#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.join(__dirname, 'docs', '.vitepress', 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  // Remove query string e decode URL
  let filePath = decodeURIComponent(req.url.split('?')[0]);

  // Tenta primeiro no dist
  let fullPath = path.join(DIST_DIR, filePath);

  // Se é um diretório, serve index.html
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    fullPath = path.join(fullPath, 'index.html');
  }

  // Se não existe e não tem extensão, tenta com .html
  if (!fs.existsSync(fullPath) && !path.extname(filePath)) {
    const htmlPath = fullPath + '.html';
    if (fs.existsSync(htmlPath)) {
      fullPath = htmlPath;
    }
  }

  // Se ainda não existe no dist, tenta na raiz docs (para catalog.json, etc)
  if (!fs.existsSync(fullPath)) {
    const docsPath = path.join(__dirname, 'docs', filePath);
    if (fs.existsSync(docsPath) && fs.statSync(docsPath).isFile()) {
      fullPath = docsPath;
    }
  }

  // Se ainda não existe, serve 404.html ou index.html (SPA fallback)
  if (!fs.existsSync(fullPath)) {
    const notFoundPath = path.join(DIST_DIR, '404.html');
    fullPath = fs.existsSync(notFoundPath) ? notFoundPath : path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(fullPath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      console.error(`Error reading file ${fullPath}:`, err);
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }

    // Headers de cache (1 ano para assets, sem cache para HTML/JSON)
    const cacheControl = (ext === '.html' || ext === '.json')
      ? 'no-cache'
      : 'public, max-age=31536000, immutable';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block'
    });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}/`);
  console.log(`📂 Serving files from: ${DIST_DIR}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
