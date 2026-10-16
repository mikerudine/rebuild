# AGENTS.md — handoff for coding agents (Cursor, Claude, Gemini, …)

**rebuild** = research + data for *Selo*, a planned Ukrainian village/hromada **revival game**. This repo currently holds:
- An **Astro public research site** (`src/`, `public/data/`) → https://mikerudine.github.io/rebuild/ (UA default, `/en` mirror).
- **Design prototypes** for the future app (`design/`: concept, low-fi mockup, screenshots). **Not** part of the site build.
- No game code exists yet (see `docs/product-and-status.md`).

Data pipelines (Python) live outside the repo on the bot box in `/workspace/village-app/` — see `docs/pipelines.md`.

## Hard rules
1. **The public site must NOT mention the app/game** (for now). Default language Ukrainian; keep `/en` pages in sync.
2. **Never commit secrets.** Only names/paths in `docs/services-and-secrets.md`.
3. Charts = **bundled ES modules** (`src/lib/*-client.ts` imported from `<script>`), never `define:vars` scripts with imports (renders empty boxes).
4. Push to `main` → GitHub Actions builds and deploys to `gh-pages`.
5. Process: Asana tags `сейчас`/`на проверке`/`когда-нибудь`; only Misha closes tasks (`docs/process.md`).
6. Project is in **slow mode**: no new work unless Misha asks.

## Quick start
```bash
npm ci && npm run dev     # local site
npm run build             # static build to dist/
```

## Docs
- [Product & status](docs/product-and-status.md)
- [Simulation model](docs/simulation-model.md)
- [Data sources](docs/data-sources.md)
- [Pipelines](docs/pipelines.md)
- [Site & deploy](docs/site-and-deploy.md)
- [Design](docs/design.md)
- [Monetization](docs/monetization.md)
- [Services & secrets](docs/services-and-secrets.md)
- [Process](docs/process.md)
- [Next steps](docs/next-steps.md)
