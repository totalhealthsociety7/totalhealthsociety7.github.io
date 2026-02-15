# Corvus PDF Factory — MVP

This repository contains a minimal PDF generator MVP (Corvus PDF Factory).

Demo: https://totalhealthsociety7-github-io.onrender.com

Quick start (local):

1. Start pdf service:
   cd pdf-service && npm install && PORT=3003 node server.js
2. Start site server (if using site-server):
   cd site-server && npm install && PORT=3000 node server.js

API:
- POST /api/generate-pdf { html } → { url: 'https://host/out/<id>.pdf' }

Notes:
- This is sample/demo content only (not medical advice).
- Use .env.example to configure PDF auth and Puppeteer path.
