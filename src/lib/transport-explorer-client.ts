import * as Plot from '@observablehq/plot';
import { parseCsv } from '@/lib/csv';
import { renderBarChart } from '@/lib/plot-charts';

type Row = Record<string, string>;
const n = (r: Row, k: string) => {
  const v = parseFloat(r[k]);
  return Number.isFinite(v) ? v : 0;
};

function width(el: HTMLElement, max = 720) {
  return Math.min(max, el.clientWidth || max);
}

function renderSeries(el: HTMLElement, rows: Row[], lang: string) {
  const labels: Record<string, string> =
    lang === 'uk'
      ? { routes: 'Маршрути', daily_round_trips: 'Оборотні рейси / день', buses: 'Автобуси' }
      : { routes: 'Routes', daily_round_trips: 'Round trips / day', buses: 'Buses' };
  const data = rows.flatMap((r) =>
    Object.keys(labels).map((k) => ({ year: n(r, 'year'), metric: labels[k], value: n(r, k) })),
  );
  el.replaceChildren(
    Plot.plot({
      width: width(el),
      height: 340,
      marginLeft: 56,
      x: { label: null, tickFormat: 'd' },
      y: { label: lang === 'uk' ? 'Кількість' : 'Count', grid: true, zero: true },
      color: { legend: true },
      marks: [
        Plot.lineY(data, { x: 'year', y: 'value', stroke: 'metric', strokeWidth: 2 }),
        Plot.dot(data, { x: 'year', y: 'value', fill: 'metric', r: 3, tip: true }),
      ],
    }),
  );
}

function renderEvents(el: HTMLElement, rows: Row[], lang: string) {
  const op = lang === 'uk' ? 'Відкрито' : 'Opened';
  const cl = lang === 'uk' ? 'Закрито' : 'Closed';
  const data = rows
    .filter((r) => n(r, 'year') > 2018)
    .flatMap((r) => [
      { group: r.year, metric: op, value: n(r, 'routes_opened') },
      { group: r.year, metric: cl, value: n(r, 'routes_closed') },
    ]);
  el.replaceChildren(
    Plot.plot({
      width: width(el),
      height: 300,
      marginLeft: 48,
      fx: { label: null },
      x: { axis: null },
      y: { label: lang === 'uk' ? 'Маршрутів за рік' : 'Routes per year', grid: true },
      color: { legend: true, domain: [op, cl], range: ['#0057b7', '#d1495b'] },
      marks: [Plot.barY(data, { fx: 'group', x: 'metric', y: 'value', fill: 'metric', tip: true })],
    }),
  );
}

function renderRanking(el: HTMLElement, rows: Row[], lang: string) {
  const data = rows
    .filter((r) => n(r, 'trips_2019') >= 10)
    .map((r) => ({ label: r.hromada_name, value: n(r, 'trips_pct'), highlight: n(r, 'trips_pct') > 0 }))
    .sort((a, b) => b.value - a.value);
  renderBarChart(el, data, {
    xLabel: lang === 'uk' ? 'Зміна оборотних рейсів/день, % 2019→2026' : 'Change in daily round trips, % 2019→2026',
    valueFormat: (v) => `${v > 0 ? '+' : ''}${v}%`,
    width: width(el),
  });
}

function renderNational(el: HTMLElement, rows: Row[], lang: string) {
  const all = lang === 'uk' ? 'Усі (ФОП + юрособи)' : 'All (FOP + legal)';
  const leg = lang === 'uk' ? 'Юрособи' : 'Legal entities';
  const data = rows.flatMap((r) => [
    { year: n(r, 'year'), metric: all, value: n(r, 'bus_carriers') },
    { year: n(r, 'year'), metric: leg, value: n(r, 'bus_carriers_legal') },
  ]);
  el.replaceChildren(
    Plot.plot({
      width: width(el),
      height: 320,
      marginLeft: 60,
      x: { label: null, tickFormat: 'd' },
      y: { label: lang === 'uk' ? 'Перевізників з чинною ліцензією' : 'Carriers with a valid licence', grid: true, zero: true },
      color: { legend: true },
      marks: [
        Plot.lineY(data, { x: 'year', y: 'value', stroke: 'metric', strokeWidth: 2 }),
        Plot.dot(data, { x: 'year', y: 'value', fill: 'metric', r: 3, tip: true }),
      ],
    }),
  );
}

function renderIfCarriers(el: HTMLElement, rows: Row[], lang: string) {
  const y0 = '2019';
  const y1 = '2026';
  const by: Record<string, { name: string; a: number; b: number }> = {};
  for (const r of rows) {
    if (r.year !== y0 && r.year !== y1) continue;
    const e = (by[r.hromada_code] ??= { name: r.hromada_name, a: 0, b: 0 });
    if (r.year === y0) e.a = n(r, 'bus_carriers');
    else e.b = n(r, 'bus_carriers');
  }
  const top = Object.values(by)
    .sort((p, q) => q.b - p.b)
    .slice(0, 12);
  const data = top.flatMap((e) => [
    { group: e.name, metric: y0, value: e.a },
    { group: e.name, metric: y1, value: e.b },
  ]);
  el.replaceChildren(
    Plot.plot({
      width: width(el),
      height: 360,
      marginLeft: 48,
      marginBottom: 90,
      fx: { label: null, domain: top.map((e) => e.name), tickRotate: -35 },
      x: { axis: null },
      y: { label: lang === 'uk' ? 'Автобусних перевізників' : 'Bus carriers', grid: true },
      color: { legend: true },
      marks: [Plot.barY(data, { fx: 'group', x: 'metric', y: 'value', fill: 'metric', tip: true })],
    }),
  );
}

function renderTable(rows: Row[]) {
  const tbody = document.querySelector('#transport-table tbody');
  if (!tbody) return;
  tbody.replaceChildren();
  for (const r of rows) {
    const tr = document.createElement('tr');
    const pct = r.trips_pct === '' ? '—' : `${n(r, 'trips_pct') > 0 ? '+' : ''}${r.trips_pct}%`;
    tr.innerHTML = `<td>${r.hromada_name}</td><td>${n(r, 'routes_2019')}</td><td>${n(r, 'routes_2026')}</td><td>${n(r, 'trips_2019')}</td><td>${n(r, 'trips_2026')}</td><td>${pct}</td><td>${n(r, 'buses_2019')}</td><td>${n(r, 'buses_2026')}</td><td>${n(r, 'routes_opened')}</td><td>${n(r, 'routes_closed')}</td>`;
    tbody.appendChild(tr);
  }
}

export async function initTransportExplorer() {
  const root = document.querySelector('.transport-explorer') as HTMLElement | null;
  if (!root) return;
  const lang = root.dataset.lang || 'uk';
  const base = root.dataset.base || '/';
  const get = (f: string) => fetch(`${base}data/${f}`).then((r) => r.text()).then(parseCsv);
  const [oblast, growth, nat, ifc] = await Promise.all([
    get('transport_if_oblast_year.csv'),
    get('transport_if_hromada_growth.csv'),
    get('transport_carriers_ukraine_year.csv'),
    get('transport_carriers_if_hromada_year.csv'),
  ]);
  const el = (id: string) => document.getElementById(id) as HTMLElement | null;
  const s = el('transport-series-chart');
  if (s) renderSeries(s, oblast, lang);
  const e = el('transport-events-chart');
  if (e) renderEvents(e, oblast, lang);
  const g = el('transport-ranking-chart');
  if (g) renderRanking(g, growth, lang);
  const c = el('transport-national-chart');
  if (c) renderNational(c, nat, lang);
  const i = el('transport-if-carriers-chart');
  if (i) renderIfCarriers(i, ifc, lang);
  renderTable(growth);
}
