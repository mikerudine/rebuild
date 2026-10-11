import growthSummary from '@/data/growth-summary.json';
import { parseCsv } from '@/lib/csv';
import { renderBarChart, renderGroupedBars } from '@/lib/plot-charts';

const YASINIA = growthSummary.yasinia_code;

const zoneLabels = {
  uk: { west: 'Захід', centre: 'Центр', front: 'Фронт' },
  en: { west: 'West', centre: 'Centre', front: 'Frontline' },
};

type Row = Record<string, string>;

let allRows: Row[] = [];
let smallRows: Row[] = [];
let sortKey = 'rank_leg_cagr';
let sortAsc = true;

function num(row: Row, key: string): number | null {
  const v = parseFloat(row[key]);
  return Number.isFinite(v) ? v : null;
}

function getActiveRows(smallOnly: boolean) {
  return smallOnly ? smallRows : allRows;
}

function filterRows(rows: Row[], zone: string, q: string) {
  let out = rows;
  if (zone) out = out.filter((r) => r.zone === zone);
  if (q) {
    const qq = q.toLowerCase();
    out = out.filter(
      (r) =>
        r.name.toLowerCase().includes(qq) ||
        r.center.toLowerCase().includes(qq) ||
        r.oblast.toLowerCase().includes(qq),
    );
  }
  return out;
}

function renderTop20(rows: Row[], lang: string) {
  const top = [...rows].sort((a, b) => (num(a, 'leg_cagr') ?? 0) - (num(b, 'leg_cagr') ?? 0)).slice(-20).reverse();
  const data = top.map((r) => ({
    label: `${r.name} (${r.center})`,
    value: num(r, 'leg_cagr') ?? 0,
    highlight: r.code === YASINIA,
  }));
  const el = document.getElementById('growth-top20-chart');
  if (!el) return;
  renderBarChart(el, data, {
    xLabel: lang === 'uk' ? 'CAGR юридичних осіб, %' : 'Legal-entity CAGR, %',
    valueFormat: (n) => `${n.toFixed(1)}%`,
  });
}

function renderZoneMedians(lang: string) {
  const z = growthSummary.median_leg_cagr_by_zone_pct;
  const labels = lang === 'uk' ? zoneLabels.uk : zoneLabels.en;
  const el = document.getElementById('growth-zone-chart');
  if (!el) return;
  renderGroupedBars(
    el,
    [
      { group: labels.west, metric: 'CAGR', value: z['west/relocation-receiving'] },
      { group: labels.centre, metric: 'CAGR', value: z['centre/other'] },
      { group: labels.front, metric: 'CAGR', value: z['frontline/occupied-affected'] },
    ],
    { yLabel: lang === 'uk' ? 'CAGR, %' : 'CAGR, %' },
  );
}

function renderTable(rows: Row[], lang: string) {
  const sorted = [...rows].sort((a, b) => {
    const av =
      sortKey === 'name' || sortKey === 'center' || sortKey === 'oblast' ? a[sortKey] : num(a, sortKey);
    const bv =
      sortKey === 'name' || sortKey === 'center' || sortKey === 'oblast' ? b[sortKey] : num(b, sortKey);
    if (av === bv) return 0;
    if (sortAsc) return av! > bv! ? 1 : -1;
    return av! < bv! ? 1 : -1;
  });
  const tbody = document.querySelector('#growth-table tbody');
  if (!tbody) return;
  tbody.replaceChildren();
  for (const r of sorted.slice(0, 500)) {
    const tr = document.createElement('tr');
    if (r.code === YASINIA) tr.className = 'row-highlight';
    tr.innerHTML = `<td>${r.rank_leg_cagr}</td><td>${r.name}</td><td>${r.center}</td><td>${r.oblast}</td><td>${r.leg_cagr}</td><td>${r.leg_pct}</td><td>${r.fop_cagr}</td><td>${r.fop_pct}</td><td>${r.composite}</td>`;
    tbody.appendChild(tr);
  }
  if (sorted.length > 500) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="9">${lang === 'uk' ? `Показано 500 з ${sorted.length} рядків — звузьте фільтр.` : `Showing 500 of ${sorted.length} rows — narrow filters.`}</td>`;
    tbody.appendChild(tr);
  }
}

function refresh() {
  const root = document.querySelector('.growth-explorer');
  const lang = root?.getAttribute('data-lang') || 'uk';
  const smallOnly = (document.getElementById('growth-small-only') as HTMLInputElement | null)?.checked;
  const zone = (document.getElementById('growth-zone-filter') as HTMLSelectElement | null)?.value ?? '';
  const q = (document.getElementById('growth-search') as HTMLInputElement | null)?.value?.trim() ?? '';
  const rows = filterRows(getActiveRows(!!smallOnly), zone, q);
  renderTop20(rows, lang);
  renderTable(rows, lang);
}

export async function initGrowthExplorer() {
  const root = document.querySelector('.growth-explorer') as HTMLElement | null;
  if (!root) return;
  const lang = root.dataset.lang || 'uk';
  const rankedUrl = root.dataset.ranked;
  const smallUrl = root.dataset.small;
  if (!rankedUrl || !smallUrl) return;

  const [rankedText, smallText] = await Promise.all([
    fetch(rankedUrl).then((r) => r.text()),
    fetch(smallUrl).then((r) => r.text()),
  ]);
  allRows = parseCsv(rankedText);
  smallRows = parseCsv(smallText);
  renderZoneMedians(lang);
  document.getElementById('growth-small-only')?.addEventListener('change', refresh);
  document.getElementById('growth-zone-filter')?.addEventListener('change', refresh);
  document.getElementById('growth-search')?.addEventListener('input', refresh);
  document.querySelectorAll('#growth-table th[data-sort]').forEach((th) => {
    (th as HTMLElement).style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const key = (th as HTMLElement).dataset.sort!;
      if (sortKey === key) sortAsc = !sortAsc;
      else {
        sortKey = key;
        sortAsc = key === 'name' || key === 'center' || key === 'oblast';
      }
      refresh();
    });
  });
  refresh();
}
