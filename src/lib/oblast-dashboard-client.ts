import * as Plot from '@observablehq/plot';

type Row = Record<string, any>;
const fmt = (v: any, d = 0) => (v === null || v === undefined || Number.isNaN(v) ? '—' : Number(v).toLocaleString('uk-UA', { maximumFractionDigits: d }));
const sg = (v: number | null) => (v === null || v === undefined ? '—' : `${v > 0 ? '+' : ''}${fmt(v, 1)}%`);

function lines(el: HTMLElement | null, data: Row[], x: string, y: string, lang: string) {
  if (!el) return;
  el.replaceChildren();
  const label = (s: string) => (s === 'oblast' ? (lang === 'uk' ? 'Область' : 'Oblast') : lang === 'uk' ? 'Україна' : 'Ukraine');
  const d = data.map((r) => ({ ...r, who: label(r.scope) }));
  el.append(Plot.plot({
    width: Math.min(460, el.clientWidth || 460), height: 220, marginLeft: 52,
    x: { label: null, type: x === 'month' ? 'point' : 'linear', tickFormat: x === 'year' ? 'd' : undefined, ticks: x === 'month' ? 0 : undefined },
    y: { label: null, grid: true },
    color: { domain: [label('oblast'), label('ukraine')], range: ['#1f6feb', '#999'], legend: true },
    marks: [Plot.lineY(d, { x, y, stroke: 'who', strokeWidth: 2 }), Plot.dot(d, { x, y, fill: 'who', r: 2, tip: true })],
  }));
}

export async function initOblastDashboard() {
  const root = document.querySelector('.oblast-dash') as HTMLElement | null;
  if (!root) return;
  const lang = root.dataset.lang || 'uk';
  const base = root.dataset.base || '/';
  const uk = lang === 'uk';
  const data = await fetch(`${base}data/oblast/${root.dataset.slug}.json`).then((r) => r.json());

  // transport link (only if the page exists)
  fetch(`${base}${uk ? '' : 'en/'}transport/`, { method: 'HEAD' }).then((r) => {
    if (r.ok) (root.querySelector('#od-transport-link') as HTMLElement).innerHTML = uk
      ? `Маршрути й автобуси громад області — на сторінці <a href="${base}transport/">Транспорт</a>.`
      : `Bus routes and vehicles by hromada are on the <a href="${base}en/transport/">Transport</a> page.`;
  }).catch(() => {});

  const tiles = root.querySelector('#od-tiles')!;
  for (const k of data.kpis) {
    const div = document.createElement('div');
    div.className = `od-tile ${k.good === true ? 'good' : k.good === false ? 'bad' : ''}`;
    const nat = k.national_change_pct === null ? '' : ` · ${uk ? 'Україна' : 'Ukraine'} ${sg(k.national_change_pct)}`;
    div.innerHTML = `<div class="l">${uk ? k.label_uk : k.label_en}</div><div class="v">${fmt(k.value)}${k.unit ? ' ' + (uk ? k.unit : ({ 'грн': 'UAH', 'м²': 'm²' } as Record<string, string>)[k.unit] ?? k.unit) : ''}</div>
      <div class="c">${k.change_pct === null ? k.base_label : `<b>${sg(k.change_pct)}</b> ${uk ? 'до' : 'vs'} ${k.base_label}${nat}`}</div>${k.note_uk ? `<div class="c n">${uk ? k.note_uk : k.note_en}</div>` : ''}`;
    tiles.append(div);
  }
  const li = (id: string, arr: Row[]) => { const ul = root.querySelector(id)!; for (const s of arr) { const e = document.createElement('li'); e.textContent = uk ? s.uk : s.en; ul.append(e); } };
  li('#od-succ', data.successes); li('#od-prob', data.problems);

  const s = data.series;
  lines(root.querySelector('#od-c-fop'), s.bizreg.filter((r: Row) => r.ind === 'REG_INDIV_ENT'), 'year', 'index', lang);
  lines(root.querySelector('#od-c-leg'), s.bizreg.filter((r: Row) => r.ind === 'REG_LEG_ENT'), 'year', 'index', lang);
  lines(root.querySelector('#od-c-sal'), s.workua, 'month', 'salary', lang);
  const tc = root.querySelector('#od-c-tr') as HTMLElement | null;
  if (tc && s.transport?.length) {
    const L: Record<string, string> = uk ? { routes: 'Маршрути', trips: 'Рейси/добу', buses: 'Автобуси', carriers_ua: 'Перевізники (Україна)' } : { routes: 'Routes', trips: 'Daily trips', buses: 'Buses', carriers_ua: 'Carriers (Ukraine)' };
    const d = s.transport.map((r: Row) => ({ ...r, m: L[r.metric] }));
    tc.replaceChildren(Plot.plot({ width: Math.min(460, tc.clientWidth || 460), height: 220, marginLeft: 44, x: { label: null, tickFormat: 'd' }, y: { label: null, grid: true },
      color: { domain: Object.values(L), range: ['#1f6feb', '#e36209', '#2da44e', '#999'], legend: true },
      marks: [Plot.ruleY([100]), Plot.lineY(d, { x: 'year', y: 'index', stroke: 'm', strokeWidth: 2 }), Plot.dot(d, { x: 'year', y: 'index', fill: 'm', r: 2, tip: true })] }));
  } else if (tc) tc.closest('.chart-block')?.remove();

  if (s.edu?.length) {
    const b: Record<string, number> = {}; for (const r of s.edu) if (r.year === 2023) b[r.scope] = r.grads;
    lines(root.querySelector('#od-c-edu'), s.edu.map((r: Row) => ({ ...r, index: Math.round((r.grads / b[r.scope]) * 1000) / 10 })), 'year', 'index', lang);
  } else root.querySelector('#od-c-edu')?.closest('.chart-block')?.remove();
  if (s.housing_m2?.length) lines(root.querySelector('#od-c-m2'), s.housing_m2, 'year', 'index', lang);
  else root.querySelector('#od-c-m2')?.closest('.chart-block')?.remove();

  // hromada table
  const cols: [string, string, string, boolean][] = [
    ['name', 'Громада', 'Hromada', false], ['rayon', 'Район', 'Rayon', false],
    ['leg_pct', 'Юрособи 21→25, %', 'Legal ent. 21→25, %', true], ['fop_pct', 'ФОП 21→25, %', 'FOP 21→25, %', true],
    ['composite', 'Композит', 'Composite', true], ['stores_official', 'Магазини мереж (офіц.)', 'Chain stores (official)', true],
    ['stores_chg', 'Магазини OSM 21→26', 'OSM stores 21→26', true], ['np_now', 'Точки NP', 'NP points', true],
    ['np_ratio', 'NP зараз / до 2021', 'NP now / pre-2021', true], ['np_net_weeks', 'NP нетто за тижні', 'NP net, weeks', true],
    ['grads_pct', 'Випускники НМТ 23→25, %', 'NMT graduates 23→25, %', true], ['houses_2026', 'Нові будинки 2026 (січ–вер)', 'New houses 2026 (Jan–Sep)', true], ['houses_pct', 'Нові будинки 21→26, %', 'New houses 21→26, %', true],
    ['trips_pct', 'Рейси/добу 19→26, %', 'Daily trips 19→26, %', true], ['routes_chg', 'Маршрути 19→26', 'Routes 19→26', true],
  ];
  const H: Row[] = data.hromadas;
  const med: Record<string, number> = {};
  for (const [c, , , n] of cols) if (n) { const v = H.map((h) => h[c]).filter((x) => x !== null).sort((a, b) => a - b); med[c] = v[Math.floor(v.length / 2)]; }
  const table = root.querySelector('#od-table') as HTMLTableElement;
  let sortKey = 'leg_pct', dir = -1;
  const draw = () => {
    table.tHead!.innerHTML = '<tr>' + cols.map(([c, u, e]) => `<th data-k="${c}">${uk ? u : e}${c === sortKey ? (dir < 0 ? ' ▼' : ' ▲') : ''}</th>`).join('') + '</tr>';
    const rows = [...H].sort((a, b) => ((a[sortKey] ?? -1e9) > (b[sortKey] ?? -1e9) ? 1 : -1) * dir);
    table.tBodies[0].innerHTML = rows.map((h) => '<tr>' + cols.map(([c, , , n]) => {
      if (!n) return `<td>${h[c] ?? ''}</td>`;
      const v = h[c]; const cls = v === null || v === med[c] ? '' : v > med[c] ? 'g' : 'r';
      return `<td class="${cls}">${fmt(v, 1)}</td>`;
    }).join('') + '</tr>').join('');
    table.tHead!.querySelectorAll('th').forEach((th) => th.addEventListener('click', () => { const k = th.dataset.k!; dir = k === sortKey ? -dir : -1; sortKey = k; draw(); }));
  };
  draw();

  const src = root.querySelector('#od-sources tbody')!;
  for (const k of data.kpis) src.insertAdjacentHTML('beforeend', `<tr><td>${uk ? k.label_uk : k.label_en}</td><td>${k.source}</td><td>${k.as_of}</td></tr>`);
  const c0 = data.coverage[0];
  (root.querySelector('#od-why') as HTMLElement).textContent = uk
    ? `Чому ця область: найбільше джерел із даними (${c0.sources_present} з 9) і найбільше рядів на рівні громад (${c0.hromada_level_series} з 5), включно з реєстром маршрутів. Таблиця генерується ${data.generated}.`
    : `Why this oblast: the most sources with data (${c0.sources_present} of 9) and the most hromada-level series (${c0.hromada_level_series} of 5), including the bus route registry. Generated ${data.generated}.`;
}
