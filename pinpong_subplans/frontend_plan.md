Frontend Subplan — PinPong

Goals
- Build a simple chat UI that: accepts user queries, displays LLM answers with citations, and offers feedback buttons.

Tech
- Next.js (React) with a single-page chat interface
- Serverless API route to call retrieval endpoint on VPS

Features (MVP)
- Chat input + history
- Display of retrieved sources under each answer (link + short excerpt)
- Feedback buttons: helpful / not helpful / flag
- Admin route to view flagged answers

Deployment
- Serve via nginx on the VPS for demo; later migrate frontend to Vercel for production

UX notes
- Keep responses concise (one paragraph + pros/cons bullets)
- Always show "Sources" with 1–5 items and highlight source type (YouTube/Reddit/review)
