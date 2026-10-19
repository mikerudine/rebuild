# Pipelines

Scripts live on the bot box at `/workspace/village-app/` (Python 3, pandas, requests, shapely). Not in this repo — copy in if you need them.

| Area | Run | Output |
|---|---|---|
| SDMX (site) | `npx tsx scripts/fetch-sdmx.ts` (repo) | site data |
| Hromada growth | `analysis/` (see analysis.md) | hromada growth CSVs, top20 PNG |
| Vacancies | `cd vacancies && python3 fetch_workua.py` | workua_city_monthly.csv, snapshot |
| Retail (OSM) | `cd retail && python3 extract.py && python3 analyze.py` (bounds.py for polygons) | shops_osm_*.csv, store counts |
| Retail (official) | `python3 retail/web_compare.py` (lists in retail/web/*.json) | stores_official_web_2026, completeness |
| HoReCa | `cd horeca && python3 fetch_all.py; python3 ohsome_oblast.py; python3 ohsome_hrom.py` | horeca CSVs, load.sql |
| Nova Poshta (one-off) | `cd postal && python3 pull_np.py && python3 final.py` | np_* CSVs |
| **NP weekly** | `cd postal && python3 weekly_snapshot.py [YYYY-MM-DD]` | snapshots/: raw, points, changes, hromada weekly, summary, sql_<d>/ |
| Transport: IF routes | `cd transport && python3 if_parse.py && python3 if_build.py` (raw files in `if_raw/`, loader `if_load.py`) | if_routes_raw.csv → out/transport_if_routes.csv, out/transport_if_hromada_year.csv, out/if_route_events.csv, out/if_stop_match.csv |
| Transport: licences | `cd transport/lic && ./fetch_live.sh && python3 extract_snapshots.py && python3 build_carriers.py`; then `cd .. && python3 carriers_geo.py` (uses `geocode.py`) | carriers.csv, carrier_year.csv → out/transport_carriers_hromada_year.csv |
| Transport: Supabase + site | `python3 gen_sql.py` → apply `sql/ddl_transport.sql` (apply_migration) + `sql/load_*.sql` (execute_sql); `python3 site_data.py` writes `public/data/transport_*.csv` + `src/data/transport-summary.json` in a repo checkout at /workspace/rebuild; `python3 check_page.py <url>` = headless chart check | rebuild.transport_* tables, /transport/ page |
| KATOTTG lookup | `python3 lookup/build_lookup.py` | katottg_lookup.csv + sql |
| Supabase loads | `python3 supabase/gen.py` → apply `ddl.sql`, `load_*.sql` via Supabase MCP `execute_sql` | schema `rebuild` |
| Kaggle | `~/.local/bin/kaggle datasets version -p kaggle/ -m "msg"` | Kaggle dataset |

**Weekly NP snapshot**: scheduled routine every **Monday 04:17 Kyiv**. First run 2026-10-12: 54,993 points, 2 openings, 1 closure. Silent unless failure/notable change.
To publish a new site dataset: copy CSV into `public/data/`, wire a page + client module, push.

## Oblast dashboard
`python3 /workspace/village-app/dashboard/build_dashboard.py [UA26 ivano-frankivsk]` — reads analysis/, retail/, postal/ (incl. weekly NP snapshots), horeca/, vacancies/ and `public/data/osm_hromada_food_counts.csv`; writes `public/data/oblast/<slug>.json`, `coverage_score.csv` and `load_<slug>.sql` (apply via Supabase execute_sql). Re-run after each weekly NP snapshot to refresh.
