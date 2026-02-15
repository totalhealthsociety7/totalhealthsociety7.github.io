PINPONG — Implementation Plan (Main)

Purpose
- Build a RAG-based chatbot to advise buyers on table tennis blades and rubbers using scraped reviews, Reddit posts, and YouTube transcripts.

Scope (MVP)
- Chat UI (web) with RAG answers + source citations
- Seed dataset: ~200–500 review chunks across top blades/rubbers
- Ingestion pipeline: scrapers for YouTube/Reddit/specialist sites, preprocessing, chunking
- Retrieval: embeddings + vector index (FAISS or pgvector)
- LLM-based answer generator with citation-aware prompt
- Basic admin UI for flagged answers and re-ingest control

High-level phases
1) Research & Source Validation (COMPLETE)
   - Prioritized 20 sources; rate-limit guidance and transcript strategy.
2) Scaffolding & Infra (NEXT)
   - Prepare VPS tooling, Node + Python stack, or fallback choices.
3) Ingestion & Indexing
   - Implement scrapers for top 6 sources, preprocess, embed, index.
4) RAG Service & Chat UI
   - Build retrieval API, integrate LLM, deploy frontend
5) QA & Beta
   - Human eval, tune prompts, collect feedback
6) Launch & Iterate
   - Expand sources, add paid tier, analytics

Deliverables (MVP)
- /workspace/pinpong_sources.md — prioritized sources (done)
- /workspace/PINPONG_PLAN.md — this main plan
- /workspace/pinpong_subplans/ — subplan files (see below)
- Live demo on VPS (tunnel) protected by basic auth (password provided)

Constraints & Decisions
- Respect robots.txt and use APIs when possible
- For the demo we will use a short tunnel (ngrok/cloudflared) and basic auth
- Embeddings: prefer local sentence-transformers + FAISS for no-cost route; fallback to OpenAI embeddings + Pinecone if installation issues arise

Security & Legal
- Store provenance (URL, crawl timestamp, headers)
- Display citations and links; do not reproduce copyrighted content beyond short snippets
- Allow takedown requests and flagging

Next immediate actions (choose one):
A) Complete VPS tool installs and scaffold repo
B) Run scrapers for top 3 sources and build sample index
C) Scaffold frontend + retrieval API and expose demo tunnel
D) All of the above (full demo)

Contact / Notes
- Password for demo basic auth: calamarDo
- Tunnel: short-lived ngrok by default (unless Cloudflare credentials provided)

