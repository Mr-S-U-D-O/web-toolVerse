import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
