# Site & deploy

- **Astro** static site + **Observable Plot** charts. Live: https://mikerudine.github.io/rebuild/ (UA), `/en/...` mirrors.
- Pages: index, growth, jobs, retail, horeca, postal, transport, cases (kvasy, shabo), data, methodology — each in `src/pages/` and `src/pages/en/`. Strings in `src/i18n/ui.ts`.
- Data: CSVs in `public/data/`, parsed by `src/lib/csv.ts`.
- Charts: components in `src/components/*Explorer.astro` load **bundled ES modules** `src/lib/*-client.ts` via a normal `<script>` (Astro bundles). **Do not** use `<script define:vars>` with imports — browsers reject it and charts become empty boxes (fixed in PR #6).
- Deploy: `.github/workflows/deploy.yml` — on push to `main`: `npm ci && npm run build` → `peaceiris/actions-gh-pages` to `gh-pages` branch. Pages source = gh-pages (enabled via `gh api POST repos/mikerudine/rebuild/pages`). `astro.config.mjs` sets base `/rebuild`.
- No mention of the app/game on the site.
