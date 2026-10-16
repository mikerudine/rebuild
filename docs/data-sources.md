# Data sources

## Derzhstat SDMX 2.1
Endpoint: `https://stat.gov.ua/sdmx/workspaces/default:integration/registry/sdmx/2.1`
Quirks: a data key starting with `.` → 404; the `c[REGION]` filter is ignored (filter client-side).
Only 3 dataflows reach hromada level: `DF_STATISTICAL_BUSINESS_REGISTER_A`, `DF_STATISTICAL_BUSINESS_REGISTER_Q_M`, `DF_COSTS_OF_ENVIRONMENTAL_PROTECTION`.
Territory codes: KATOTTG (current), KOATUU (old). Codelist cached at box `/workspace/village-app/sdmx/cl_katottg.xml`. Repo: `scripts/fetch-sdmx.ts`, `src/data/sdmx-catalog.ts`.

## Supabase
Project **kyiv-air-raid-alerts** (ref `maqdxmetyzpyupivyecz`), schema **`rebuild`**. Every table has RLS with policy `public_read` (select for anon, authenticated). Tables carry `source`, `dataset_id`, `fetched_at`.
Tables: bizreg_all_levels, hromada_growth_all, hromada_composite_ranked, hromada_growth_small_rural, workua_city_monthly, workua_snapshot_2026_10, village_cases, atb_corrected_oblast_change, osm_completeness_chain_national, osm_completeness_chain_oblast, stores_official_web_2026, horeca_derzhstat_kved_i, horeca_oblast_compare, horeca_osm_oblast_by_type, horeca_osm_oblast_totals, horeca_osm_top_hromadas, np_hromada_counts, np_oblast_surviving_by_year, np_points_2026_10, hromada_growth_vs_np, osm_post_national_by_operator, osm_ukrposhta_oblast, katottg_lookup (31,752 rows) + weekly NP snapshot tables.
⚠ `rebuild` is not yet in *Exposed schemas* (API settings) → not reachable via REST until Misha adds it.
DDL/loads (box): `/workspace/village-app/supabase/ddl.sql`, `load_*.sql`, `supabase/retail/`, `retail/sql/`, `postal/sql/`, `horeca/load.sql`, `lookup/sql_*.sql`.

## Kaggle
Dataset `mikerudine/rebuild-ukraine-hromada-growth` ("Ukraine Hromada Growth (rebuild)"). Files + metadata: box `/workspace/village-app/kaggle/`.

## Other sources
- **OSM**: Geofabrik yearly snapshots (2021–2026) + ohsome API. Overstates store growth → corrected vs official lists (ATB completeness 0.99, Sim23 0.34).
- **work.ua** `/stat` pages: city vacancy counts & salaries monthly.
- **Chain store APIs**: ATB `getstoreattr` (per city); Silpo `sf-ecom-api` branches; Fora `EcomCatalogGlobal GetPickupFilials`; Novus `api/popup/shops`; Sim23 `simi.ua` wp-json.
- **Nova Poshta** `getWarehouses` (works with empty apiKey). Opening date decoded from UUIDv1 `Ref`.
- **KATOTTG lookup**: `/workspace/village-app/lookup/katottg_lookup.csv` (build_lookup.py), also in Supabase and Kaggle.

## Blocked
robota.ua (Cloudflare), data.gov.ua and OpenBudget (blocked from box), Ukrposhta (API needs a token).
No hromada-level population data found.
