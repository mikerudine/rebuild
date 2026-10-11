import postalSummary from '@/data/postal-summary.json';
import { parseCsv } from '@/lib/csv';
import { renderGroupedBars, renderScatter } from '@/lib/plot-charts';

type Row = Record<string, string>;

let allRows: Row[] = [];
let sortKey = 'rank_leg_cagr';
let sortAsc = true;

function num(row: Row, key: string): number | null {
  const v = parseFloat(row[key]);
  return Number.isFinite(v) ? v : null;
}

function filterRows(rows: Row[], zone: string, q: string) {
  let out = rows;
  if (zone) out = out.filter((r) => r.zone === zone);
  if (q) {
    const qq = q.toLowerCase();
    out = out.filter(
      (r) => r.name.toLowerCase().includes(qq) || r.oblast.toLowerCase().includes(qq),
    );
  }
  return out;
}

function renderZoneMedians(lang: string) {
  const z = postalSummary.zone_median_np_branches_ratio;
  const labels =
    lang === 'uk'
      ? { west: 'Захід', centre: 'Центр', front: 'Фронт' }
      : { west: 'West', centre: 'Centre', front: 'Frontline' };
  const el = document.getElementById('postal-zone-chart');
  if (!el) return;
  renderGroupedBars(
    el,
    [
      { group: labels.west, metric: lang === 'uk' ? 'Медіана' : 'Median', value: z.west },
      { group: labels.centre, metric: lang === 'uk' ? 'Медіана' : 'Median', value: z.centre },
      { group: labels.front, metric: lang === 'uk' ? 'Медіана' : 'Median', value: z.frontline },
    ],
    {
      yLabel:
        lang === 'uk'
          ? 'Медіана (NP відділення зараз / до 2021)'
          : 'Median (NP branches now / pre-2021)',
    },
  );
}

function renderQuintileMedians(lang: string) {
  const q = postalSummary.fop_quintile_median_np_branches_ratio;
  const el = document.getElementById('postal-quintile-chart');
  if (!el) return;
  renderGroupedBars(
    el,
    q.map((value, i) => ({
      group: `Q${i + 1}`,
      metric: lang === 'uk' ? 'Медіана відділень' : 'Branch median',
      value,
    })),
    {
      yLabel:
        lang === 'uk'
          ? 'Медіана np_branches_ratio за квінтилем зростання ФОП'
          : 'Median np_branches_ratio by FOP growth quintile',
    },
  );
}

function renderScatterCharts(rows: Row[], lang: string) {
  const scatter = rows
    .map((r) => ({
      x: num(r, 'fop_pct') ?? 0,
      y: num(r, 'np_branches_ratio') ?? 0,
      label: r.name,
    }))
    .filter((d) => Number.isFinite(d.x) && Number.isFinite(d.y));

  const el = document.getElementById('postal-scatter-chart');
  if (el) {
    renderScatter(el, scatter, {
      xLabel: lang === 'uk' ? 'Зростання ФОП, % 2021→2025' : 'FOP growth, % 2021→2025',
      yLabel:
        lang === 'uk'
          ? 'NP відділення (зараз / створені до 2021, +1)'
          : 'NP branches (now / created pre-2021, +1)',
      showLabels: false,
    });
  }
}

function renderTable(rows: Row[], lang: string) {
  const sorted = [...rows].sort((a, b) => {
    const av =
      sortKey === 'name' || sortKey === 'oblast' ? a[sortKey] : num(a, sortKey);
    const bv =
      sortKey === 'name' || sortKey === 'oblast' ? b[sortKey] : num(b, sortKey);
    if (av === bv) return 0;
    if (sortAsc) return av! > bv! ? 1 : -1;
    return av! < bv! ? 1 : -1;
  });
  const tbody = document.querySelector('#postal-table tbody');
  if (!tbody) return;
  tbody.replaceChildren();
  for (const r of sorted.slice(0, 500)) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.rank_leg_cagr}</td><td>${r.name}</td><td>${r.oblast}</td><td>${r.leg_pct}</td><td>${r.fop_pct}</td><td>${r.np_points_created_pre2021}</td><td>${r.np_points_now}</td><td>${r.np_points_ratio}</td><td>${r.np_branches_ratio}</td>`;
    tbody.appendChild(tr);
  }
  if (sorted.length > 500) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="9">${lang === 'uk' ? `Показано 500 з ${sorted.length} — звузьте фільтр.` : `Showing 500 of ${sorted.length} — narrow filters.`}</td>`;
    tbody.appendChild(tr);
  }
}

function renderExamples(lang: string) {
  const tbody = document.querySelector('#postal-examples-table tbody');
  if (!tbody) return;
  tbody.replaceChildren();
  for (const ex of postalSummary.top_business_growth_np_examples) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${ex.name}</td><td>${ex.oblast}</td><td>${ex.pre2021_points}</td><td>${ex.now_points}</td><td>${ex.leg_pct}%</td>`;
    tbody.appendChild(tr);
  }
}

function refresh() {
  const root = document.querySelector('.postal-explorer');
  const lang = root?.getAttribute('data-lang') || 'uk';
  const zone = (document.getElementById('postal-zone-filter') as HTMLSelectElement | null)?.value ?? '';
  const q = (document.getElementById('postal-search') as HTMLInputElement | null)?.value?.trim() ?? '';
  const rows = filterRows(allRows, zone, q);
  renderScatterCharts(allRows, lang);
  renderTable(rows, lang);
}

export async function initPostalExplorer() {
  const root = document.querySelector('.postal-explorer') as HTMLElement | null;
  if (!root) return;
  const lang = root.dataset.lang || 'uk';
  const base = root.dataset.base || '/';

  const text = await fetch(`${base}data/hromada_growth_vs_np.csv`).then((r) => r.text());
  allRows = parseCsv(text);

  renderZoneMedians(lang);
  renderQuintileMedians(lang);
  renderExamples(lang);

  const corr = document.getElementById('postal-correlation-note');
  if (corr) {
    const s = postalSummary.spearman;
    corr.textContent =
      lang === 'uk'
        ? `Кореляція Спірмена (${postalSummary.spearman_hromada_join_n} громад зі спільним рейтингом): зростання юросіб vs np_points_ratio = ${s.leg_pct_vs_np_points_ratio}; ФОП vs np_points_ratio = ${s.fop_pct_vs_np_points_ratio}; ФОП vs np_branches_ratio = ${s.fop_pct_vs_np_branches_ratio}.`
        : `Spearman correlation (${postalSummary.spearman_hromada_join_n} joined hromadas): legal-entity growth vs np_points_ratio = ${s.leg_pct_vs_np_points_ratio}; FOP vs np_points_ratio = ${s.fop_pct_vs_np_points_ratio}; FOP vs np_branches_ratio = ${s.fop_pct_vs_np_branches_ratio}.`;
  }

  document.getElementById('postal-zone-filter')?.addEventListener('change', refresh);
  document.getElementById('postal-search')?.addEventListener('input', refresh);
  document.querySelectorAll('#postal-table th[data-sort]').forEach((th) => {
    (th as HTMLElement).style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const key = (th as HTMLElement).dataset.sort!;
      if (sortKey === key) sortAsc = !sortAsc;
      else {
        sortKey = key;
        sortAsc = key === 'name' || key === 'oblast';
      }
      refresh();
    });
  });
  refresh();
}
