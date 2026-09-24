import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Nginx listens on port 8080 and reverse-proxies to port 3000.
// Therefore the Node app server must listen on port 3000.
const PORT = process.env.PORT === '8080' 
  ? 3000 
  : parseInt(process.env.DEFAULT_APP_PORT || process.env.PORT || '3000', 10);

const distPath = path.join(__dirname, 'dist');

// Health check endpoint for Cloud Run
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Serve static assets from dist
app.use(express.static(distPath, {
  maxAge: '1d',
  index: false
}));

// Fallback to index.html for client-side routing
app.get('*', (_req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application build not found. Please run npm run build.');
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Flipkart First Mile Server listening on http://0.0.0.0:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
