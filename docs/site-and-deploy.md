# Site & deploy

- **Astro** static site + **Observable Plot** charts. Live: https://mikerudine.github.io/rebuild/ (UA), `/en/...` mirrors.
- Pages: index, growth, jobs, retail, horeca, postal, transport, cases (kvasy, shabo), data, methodology — each in `src/pages/` and `src/pages/en/`. Strings in `src/i18n/ui.ts`.
- Data: CSVs in `public/data/`, parsed by `src/lib/csv.ts`.
- Charts: components in `src/components/*Explorer.astro` load **bundled ES modules** `src/lib/*-client.ts` via a normal `<script>` (Astro bundles). **Do not** use `<script define:vars>` with imports — browsers reject it and charts become empty boxes (fixed in PR #6).
- Deploy: `.github/workflows/deploy.yml` — on push to `main`: `npm ci && npm run build` → `peaceiris/actions-gh-pages` to `gh-pages` branch. Pages source = gh-pages (enabled via `gh api POST repos/mikerudine/rebuild/pages`). `astro.config.mjs` sets base `/rebuild`.
- No mention of the app/game on the site.

## Oblast KPI dashboard (`/oblast/<slug>/`)
- Pages: `src/pages/oblast/<slug>/index.astro` + `/en` mirror; both render `src/components/OblastDashboard.astro` (client: `src/lib/oblast-dashboard-client.ts`, bundled ES module).
- Data: `public/data/oblast/<slug>.json` (KPI tiles, hromada table, series, rule-based successes/problems, coverage scores).
- First oblast: `ivano-frankivsk` (UA26). To add another: run the builder with a new KATOTTG prefix + slug, copy the two page files, add the work.ua city/EN name mappings in the script if missing.
- Links to `/transport/` automatically once that page exists (HEAD check).
