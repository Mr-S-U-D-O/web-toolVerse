import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { exec } from 'child_process';
import https from 'https';
import http from 'http';
import { parse } from 'url';
import { ensureYtDlp, getYtDlpPath } from './scripts/downloadYtDlp.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ensure yt-dlp binary is available before starting
  await ensureYtDlp();

  // Initialize Gemini
  let ai: GoogleGenAI | null = null;
  try {
    if (process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI. Is GEMINI_API_KEY valid?');
  }

  app.post('/api/gemini/run', async (req, res) => {
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API is not configured. Please provide a valid GEMINI_API_KEY in the environment.' });
    }

    try {
      const { systemPrompt, input } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
           { role: 'user', parts: [{ text: input }] }
        ],
        config: {
           systemInstruction: systemPrompt
        }
      });
      res.json({ text: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || 'Failed to process AI request.' });
    }
  });

  // A) The Extractor Route
  app.post('/api/extract', (req, res) => {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    const binaryPath = getYtDlpPath();
    const command = `"${binaryPath}" -J "${url.replace(/"/g, '\\"')}"`;
    
    exec(command, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
      if (error) {
        console.error('yt-dlp error:', stderr);
        res.status(500).json({ error: 'Failed to extract video metadata.' });
        return;
      }
      try {
        const data = JSON.parse(stdout);
        res.json(data);
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse metadata.' });
      }
    });
  });

  // B) The CORS Proxy Route
  app.get('/api/proxy', (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      res.status(400).send('Target URL required');
      return;
    }

    const parsedUrl = parse(targetUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const proxyReq = client.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': parsedUrl.hostname || '',
      }
    }, (proxyRes) => {
      // Forward necessary headers
      if (proxyRes.headers['content-type']) res.setHeader('Content-Type', proxyRes.headers['content-type']);
      if (proxyRes.headers['content-length']) res.setHeader('Content-Length', proxyRes.headers['content-length']);
      if (proxyRes.headers['accept-ranges']) res.setHeader('Accept-Ranges', proxyRes.headers['accept-ranges']);
      res.setHeader('Access-Control-Allow-Origin', '*');

      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.status(500).send('Proxy error: ' + err.message);
    });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
