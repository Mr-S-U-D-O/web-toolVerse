import fs from 'fs';
import path from 'path';
import https from 'https';
import os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const binDir = path.join(__dirname, 'bin');

export function getYtDlpPath(): string {
  const platform = os.platform();
  const ext = platform === 'win32' ? '.exe' : '';
  return path.join(binDir, `yt-dlp${ext}`);
}

export async function ensureYtDlp(): Promise<string> {
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }

  const binaryPath = getYtDlpPath();

  if (fs.existsSync(binaryPath)) {
    return binaryPath;
  }

  console.log(`[yt-dlp] Binary not found at ${binaryPath}. Downloading...`);

  const platform = os.platform();
  let downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';
  
  if (platform === 'win32') {
    downloadUrl += '.exe';
  } else if (platform === 'darwin') {
    downloadUrl += '_macos';
  }

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(binaryPath);
    
    // Helper to handle redirects
    const download = (url: string) => {
      https.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return download(res.headers.location as string);
        }
        
        if (res.statusCode !== 200) {
          fs.unlinkSync(binaryPath);
          return reject(new Error(`Failed to download yt-dlp: ${res.statusCode} ${res.statusMessage}`));
        }

        res.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log(`[yt-dlp] Download complete: ${binaryPath}`);
          
          if (platform !== 'win32') {
            try {
              execSync(`chmod +x "${binaryPath}"`);
              console.log(`[yt-dlp] Set execute permissions.`);
            } catch (err) {
              console.error(`[yt-dlp] Failed to set execute permissions:`, err);
            }
          }
          
          resolve(binaryPath);
        });
      }).on('error', (err) => {
        fs.unlinkSync(binaryPath);
        reject(err);
      });
    };

    download(downloadUrl);
  });
}

// Allow running directly
if (process.argv[1] === __filename) {
  ensureYtDlp().catch(console.error);
}
