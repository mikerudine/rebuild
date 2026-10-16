# Services & secrets (names/paths only — NEVER commit values)

| Service | What | Where |
|---|---|---|
| GitHub | repo mikerudine/rebuild, Pages; `gh` CLI authed as mikerudine on box | `secrets.GITHUB_TOKEN` in Actions |
| Supabase | project kyiv-air-raid-alerts, ref `maqdxmetyzpyupivyecz`, schema `rebuild` | anon/publishable key & service_role key: Supabase dashboard → API settings (via Supabase MCP on box) |
| Kaggle | dataset mikerudine/rebuild-ukraine-hromada-growth | `~/.kaggle/kaggle.json`, CLI `~/.local/bin/kaggle` |
| Asana | project 1219381758520799 | PAT at `/home/box/.secrets/asana_pat` |
| Nova Poshta | getWarehouses | no key needed (empty apiKey) |
| Ukrposhta | — | token needed, not obtained |
| Penpot | design | Misha's account |
