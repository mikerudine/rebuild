# Data sources

## Derzhstat SDMX 2.1
Endpoint: `https://stat.gov.ua/sdmx/workspaces/default:integration/registry/sdmx/2.1`
Quirks: a data key starting with `.` → 404; the `c[REGION]` filter is ignored (filter client-side).
Only 3 dataflows reach hromada level: `DF_STATISTICAL_BUSINESS_REGISTER_A`, `DF_STATISTICAL_BUSINESS_REGISTER_Q_M`, `DF_COSTS_OF_ENVIRONMENTAL_PROTECTION`.
Territory codes: KATOTTG (current), KOATUU (old). Codelist cached at box `/workspace/village-app/sdmx/cl_katottg.xml`. Repo: `scripts/fetch-sdmx.ts`, `src/data/sdmx-catalog.ts`.

## Supabase
Project **kyiv-air-raid-alerts** (ref `maqdxmetyzpyupivyecz`), schema **`rebuild`**. Every table has RLS with policy `public_read` (select for anon, authenticated). Tables carry `source`, `dataset_id`, `fetched_at`.
Tables: bizreg_all_levels, hromada_growth_all, hromada_composite_ranked, hromada_growth_small_rural, workua_city_monthly, workua_snapshot_2026_10, village_cases, atb_corrected_oblast_change, osm_completeness_chain_national, osm_completeness_chain_oblast, stores_official_web_2026, horeca_derzhstat_kved_i, horeca_oblast_compare, horeca_osm_oblast_by_type, horeca_osm_oblast_totals, horeca_osm_top_hromadas, np_hromada_counts, np_oblast_surviving_by_year, np_points_2026_10, hromada_growth_vs_np, osm_post_national_by_operator, osm_ukrposhta_oblast, katottg_lookup (31,752 rows), transport_if_routes (5,397), transport_if_hromada_year (545), transport_carriers_hromada_year (3,363) + weekly NP snapshot tables.
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

## Transport (added 2026-10-19, page `/transport/`)
- **Ivano-Frankivsk intra-oblast bus route registers** — data.gov.ua `0ffadb43-a4a3-4650-be7b-e14c3be1dc9c` (intercity `registr_*` + suburban `registr_suburban*/suborbun*`, XLS/XLSX 2019–2026, CC-BY) and the IF 2018 file inside Ukrtransbezpeka dataset `474dbf54-…` (data.gov.ua id `6ca93112-…`). Official Mininfra form: route, length, full timetable with stops, buses (plates before 2025; assigned/reserve columns from 2025), carrier (+EDRPOU/RNOKPP from 2025), contract. The open/close-history field is **empty** in IF files → openings/closures come from snapshot diffs. Registers are rarely refreshed (suburban 2023 = 2024, all 2025 = 2026).
- **Other route registers**: Ukrtransbezpeka interregional network (data.gov.ua `1b428b3e-…`, snapshots 2018–2025); its live JSON `logistics.dsbt.gov.ua/api/opendata/interregional_routes` fails TLS from the box. Only IF publishes a current oblast register on data.gov.ua; ~200 hromada-council datasets ("Перелік перевізників…", timetables, stops) exist, patchy.
- **Ukrtransbezpeka licence register** — weekly JSON ZIP snapshots 2018-11…2022-02 (+2 XLSX 2023 without codes) in data.gov.ua `9b29b699-…` (package `716cd7d6-…`); live paginated API `https://middleware.dsbt.gov.ua/api/opendata/lc_licenses?per_page=1000&page=N` (94,592 records on 2026-10-19). Fields: code (EDRPOU/RNOKPP), name, status, activity (bus 03/07, taxi 01, car-on-order 02/06), activity `dateFrom`, `dateUntil` (cancellation); snapshots also `areaName` (oblast, ~12%) and `address` (~3%). **No vehicle or seat counts.**
- **Open ЄДР** (data.gov.ua `03cc1239-…`, UO.zip/FOP.zip): no addresses for legal entities, no address/RNOKPP for FOPs → cannot geocode carriers. Carrier hromada comes only from IF route-register addresses and licence `address` (≈10% of active bus carriers nationally).
- Derzhstat SDMX transport flows (`DF_GROUND_TRANSPORT_A/Q/M`, `DF_INTEGRATED_INDICATORS_OF_TRANSPORT_STATISTICS`): oblast level only.
- City GTFS: Mobility Database catalogue lists 11 UA feeds (Lviv, Uzhhorod, Stryi, Bucha, Odesa, Khmelnytskyi, Kyiv/Boryspil). Transitland API needs a key.

## Blocked
robota.ua (Cloudflare), OpenBudget, Ukrposhta (API needs a token). data.gov.ua **CKAN API now works** from the box (2026-10-19). mtu.gov.ua, uz.gov.ua, bus.com.ua unreachable; busfor.ua, booking.uz.gov.ua 403.
No hromada-level population data found.
