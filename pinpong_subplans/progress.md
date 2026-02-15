PinPong Progress Tracker

Status legend: TODO / IN-PROGRESS / REVIEW / DONE

1) Research & Sources — DONE
   - Prioritized 20 sources (pinpong_sources.md) — DONE
2) VPS environment prep — IN-PROGRESS
   - Homebrew installs — IN-PROGRESS
   - Python venv attempted — BLOCKED (ensurepip missing)
3) Scaffold repo & apps — TODO
4) Scrapers for top 3 sources — TODO
5) Build FAISS index (sample) — TODO
6) Chat UI & retrieval API deployment — TODO
7) Demo tunnel + nginx basic auth — TODO

Notes & blockers:
- Python venv creation failed due to missing system venv support. Options: install system packages or use managed embeddings/Pinecone. Decide to continue with full local stack or fallback.

Last updated: 2026-02-14 17:47 EST

Agents involved:
- main agent (Corvus)
- subagent research:pinpong-sources (completed)
