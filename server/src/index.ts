import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { translateRouter } from './routes/translate';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost requests or undefined (same-origin / postman / mobile)
      if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasGoogleKey = Boolean(process.env.GOOGLE_TRANSLATE_API_KEY?.trim());
  res.json({
    status: 'online',
    service: 'Language Translation Tool API',
    internship: 'CodeAlpha AI Internship',
    configuredProvider: hasGoogleKey ? 'Google Cloud Translation API' : 'MyMemory Live Public API (Fallback Ready)',
    timestamp: new Date().toISOString(),
  });
});

// Mount translate routes
app.use('/api', translateRouter);

// Serve static frontend files if client build exists (Production / Deployment)
import fs from 'fs';
const possibleDistPaths = [
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../client/dist'),
];
const clientDistPath = possibleDistPaths.find((p) => fs.existsSync(p));

if (clientDistPath) {
  console.log(`📦 Serving static frontend from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}


// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Translation Backend Server is running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔑 Google Cloud API Key: ${process.env.GOOGLE_TRANSLATE_API_KEY ? 'Configured ✅' : 'Not set (Using Real Live Translation Engine) 🌐'}`);
  console.log(`====================================================`);
});

