Infrastructure Subplan — PinPong

Goals
- Host frontend and backend on the VPS for demo; prepare for Vercel/managed migration later.
- Provide a short tunnel and basic HTTP auth for the demo.

Steps
1) Install system packages (brew already used) and runtime: Node 18+, Python3, nginx, pm2
2) Scaffold apps: Next.js frontend, Node/Python retrieval API
3) Service management: PM2 or systemd to keep processes alive
4) Reverse proxy: nginx to serve frontend and proxy API; enable basic auth (password: calamarDo)
5) Tunnel: install ngrok or cloudflared and start temporary tunnel; output public URL
6) Secrets: store API keys in env files (not committed)

Observability
- Simple logs via pm2 and nginx access/error logs
- Sentry optional later

Fallbacks
- If Python venv cannot be created on the VPS, fallback to managed embeddings (OpenAI) + Pinecone or pre-built FAISS index uploaded from external machine
