Ingestion Subplan — PinPong

Goals
- Collect review text, Reddit posts, and YouTube transcripts for target blades & rubbers.
- Normalize product names to canonical IDs.
- Chunk documents for embedding and store provenance.

Steps
1) Acquire API keys: YouTube Data API, Reddit API (recommended). If unavailable, fallback to yt-dlp + captions + Reddit JSON pages.
2) Implement per-source scraper modules (Python recommended):
   - youtube_scraper.py: list videos by channel/keyword, download transcripts via youtube-transcript-api or captions.list
   - reddit_scraper.py: use Reddit API to fetch top posts/comments in r/tabletennis and r/pingpong
   - site_scraper_{site}.py: site-specific scrapers for tabletennis11, megaspin, expert-table-tennis, etc.
3) Preprocessing: HTML→text, remove boilerplate, dedupe by content hash, extract metadata (brand, model, date, reviewer, rating if present)
4) Canonicalization: fuzzy-match product names to master product table; store unresolved names for manual review
5) Chunking: split into 200–800 token chunks with overlap and attach metadata
6) Embeddings: batch embed chunks (sentence-transformers locally or OpenAI embeddings)
7) Indexing: upsert into FAISS or vector DB with metadata
8) Provenance: store raw HTML/transcript in S3 or workspace and keep index pointers

Rate limits & cadence
- Follow per-domain guidance from research results; use backoff and respect robots.txt

Outcomes
- scripts/ directory with scrapers
- sample_data/ with raw and cleaned files
- index/ with FAISS index and mapping
