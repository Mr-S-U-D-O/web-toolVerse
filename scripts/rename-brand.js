import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function renameBrand() {
  let count = 0;
  walkDir(SRC_DIR, filePath => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Perform replace
      const updated = content
        .replace(/web-toolVerse/g, 'Tool Cabinet')
        .replace(/Web-ToolVerse/g, 'Tool Cabinet');
      
      if (content !== updated) {
        fs.writeFileSync(filePath, updated, 'utf8');
        console.log(`Updated: ${path.relative(SRC_DIR, filePath)}`);
        count++;
      }
    }
  });
  console.log(`Rebranding complete! Updated ${count} files.`);
}

renameBrand();
