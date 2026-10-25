import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';

type Any = Record<string, any>;
const PAL = ['#c6f432', '#7c5cff', '#ff4d8d', '#59d6ff', '#ffb547', '#ff7a45'];
let LANG: 'uk' | 'en' = 'uk';
let LOC = 'uk-UA';
let nf = new Intl.NumberFormat(LOC, { maximumFractionDigits: 1 });
const L = (uk: string, en: string) => (LANG === 'en' ? en : uk);
const num = (v: number) => v.toLocaleString(LOC);
const pct = (v: number | null | undefined) => v == null ? '—' : (v > 0 ? '+' : v < 0 ? '−' : '') + nf.format(Math.abs(v)) + '%';
const style = { background: 'transparent', color: '#8e8ea6', fontSize: '11px', fontFamily: 'inherit', overflow: 'visible' } as const;
const $ = (id: string) => document.getElementById(id) as HTMLElement;
const W = (el: HTMLElement) => Math.max(280, el.clientWidth);
const isMobile = () => window.innerWidth < 760;

function put(id: string, node: Element) { const el = $(id); el.replaceChildren(node); }

function bubbles(H: Any[], kp: Any) {
  const el = $('bub'); const w = W(el); const m = isMobile();
  const pts = H.filter((h) => h.leg_pct != null && h.grads_pct != null);
  const rays = [...new Set(H.map((h) => h.rayon))].sort();
  const top = new Set([...pts].sort((a, b) => b.fop_2025 - a.fop_2025).slice(0, m ? 2 : 3).map((h) => h.name));
  const lab = pts.filter((p) => top.has(p.name) || (!m && (Math.abs(p.grads_pct) > 38 || p.leg_pct > 25 || p.leg_pct < -3)) || (m && (p.leg_pct > 40 || p.grads_pct < -45)));
  const uaX = kp.reg_leg_ent.national_change_pct, uaY = kp.edu_grads.national_change_pct;
  put('bub', Plot.plot({
    width: w, height: m ? 340 : 440, style, marginLeft: 44, marginBottom: 34,
    x: { label: L('юрособи, % →', 'legal entities, % →'), tickFormat: (d: number) => pct(d), grid: false },
    y: { label: L('↑ випускники, %', '↑ graduates, %'), tickFormat: (d: number) => pct(d) },
    r: { range: [3, m ? 18 : 28] },
    color: { domain: rays, range: PAL },
    marks: [
      Plot.ruleX([0], { stroke: '#333' }), Plot.ruleY([0], { stroke: '#333' }),
      Plot.ruleX([uaX], { stroke: '#7c5cff', strokeDasharray: '4 4' }),
      Plot.ruleY([uaY], { stroke: '#7c5cff', strokeDasharray: '4 4' }),
      Plot.text([uaX], { x: (d: number) => d, frameAnchor: 'top', dx: 4, textAnchor: 'start', text: () => `${L('UA юрособи', 'UA legal ent.')} ${pct(uaX)}`, fill: '#a08cff' }),
      Plot.text([uaY], { y: (d: number) => d, frameAnchor: 'right', dy: -7, textAnchor: 'end', text: () => `${L('UA випускники', 'UA graduates')} ${pct(uaY)}`, fill: '#a08cff' }),
      Plot.dot(pts, { x: 'leg_pct', y: 'grads_pct', r: 'fop_2025', fill: 'rayon', fillOpacity: 0.55, stroke: 'rayon', sort: { channel: '-r' },
        title: (d: Any) => `${d.name} (${d.rayon})\n${L('юрособи', 'legal ent.')} ${pct(d.leg_pct)} · ${L('випускники', 'graduates')} ${pct(d.grads_pct)} · ${L('ФОП', 'FOP')} ${num(d.fop_2025)}` , tip: true }),
      Plot.text(lab, { x: 'leg_pct', y: 'grads_pct', text: 'name', dy: -14, fill: '#ddd', fontSize: m ? 10 : 11 }),
    ],
  }));
  $('bubl').innerHTML = rays.map((r, i) => `<span><i style="background:${PAL[i]}"></i>${r}</span>`).join('') + `<span>· ${pts.length} ${L('з', 'of')} ${H.length} ${L('громад (у решти немає даних НМТ)', 'hromadas (no NMT data for the rest)')}</span>`;
}

function radar(kp: Any) {
  const el = $('rad'); const s = Math.min(W(el), 400); const m = isMobile();
  const ks = ['reg_leg_ent', 'reg_indiv_ent', 'workua_salary', 'atb_corrected', 'horeca_osm', 'edu_grads', 'edu_schools', 'house_m2'];
  const lab = LANG === 'en' ? ['Legal ent.', 'FOP', 'Salary', 'ATB', 'Food venues', 'Graduates', 'Schools', 'Housing m²'] : ['Юрособи', 'ФОП', 'Зарплата', 'АТБ', 'Заклади харч.', 'Випускники', 'Школи', 'м² житла'];
  const lo = -20, hi = 50, R = 1, rr = (v: number) => (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * R;
  const ang = (i: number) => -Math.PI / 2 + i * 2 * Math.PI / ks.length;
  const pt = (v: number, i: number) => ({ x: rr(v) * Math.cos(ang(i)), y: rr(v) * Math.sin(ang(i)) });
  const poly = (scope: string, f: (t: Any) => number) => [...ks, ks[0]].map((k, i) => ({ scope, ...pt(f(kp[k]), i % ks.length) }));
  const rings = [-20, 0, 25, 50].flatMap((v) => [...ks, ks[0]].map((_, i) => ({ v, ...pt(v, i % ks.length) })));
  const labs = ks.map((k, i) => ({ x: 1.28 * Math.cos(ang(i)), y: 1.2 * Math.sin(ang(i)), t: `${lab[i]}\n${pct(kp[k].change_pct)}` }));
  const data = [...poly(L('Україна', 'Ukraine'), (t) => t.national_change_pct), ...poly(L('область', 'oblast'), (t) => t.change_pct)];
  put('rad', Plot.plot({
    width: s, height: s, style, margin: m ? 34 : 40, x: { axis: null, domain: [-1.3, 1.3] }, y: { axis: null, domain: [1.3, -1.3] },
    color: { domain: [L('область', 'oblast'), L('Україна', 'Ukraine')], range: ['#c6f432', '#7c5cff'] },
    marks: [
      Plot.line(rings, { x: 'x', y: 'y', z: 'v', stroke: (d: Any) => d.v === 0 ? '#555' : '#2a2a3a' }),
      Plot.text([-20, 0, 25, 50], { x: 0.03, y: (v: number) => -rr(v) + 0.05, text: (v: number) => pct(v), fontSize: 9, textAnchor: 'start' }),
      Plot.line(data, { x: 'x', y: 'y', z: 'scope', stroke: 'scope', fill: 'scope', fillOpacity: 0.2, strokeWidth: 2 }),
      Plot.text(labs, { x: 'x', y: 'y', text: 't', fill: '#ddd', fontSize: m ? 10 : 11, lineHeight: 1.2 }),
    ],
  }));
}

function histogram(H: Any[], kp: Any, med: number) {
  const el = $('his'); const w = W(el);
  const v = H.filter((h) => h.fop_pct != null);
  const ua = kp.reg_indiv_ent.national_change_pct;
  put('his', Plot.plot({
    width: w, height: 280, style, marginLeft: 34, marginBottom: 42, x: { label: L('зміна ФОП, %', 'FOP change, %'), labelAnchor: 'center', labelOffset: 34, tickFormat: (d: number) => d + '%', ticks: d3.range(20, 120, 20) }, y: { label: L('громад', 'hromadas'), grid: true },
    marks: [
      Plot.rectY(v, Plot.binX({ y: 'count' }, { x: 'fop_pct', thresholds: d3.range(0, 130, 10), fill: '#59d6ff', fillOpacity: 0.85, inset: 2, rx: 4 })),
      Plot.text(v, Plot.binX({ y: 'count', text: 'count' }, { x: 'fop_pct', thresholds: d3.range(0, 130, 10), dy: -8, fill: '#ddd' })),
      Plot.ruleX([med], { stroke: '#c6f432', strokeWidth: 2 }),
      Plot.ruleX([ua], { stroke: '#7c5cff', strokeWidth: 2, strokeDasharray: '5 4' }),
      Plot.text([med], { x: (d: number) => d, frameAnchor: 'top', dx: 5, textAnchor: 'start', text: () => `${L('медіана', 'median')} ${pct(med)}`, fill: '#c6f432', fontWeight: 700 }),
      Plot.text([ua], { x: (d: number) => d, frameAnchor: 'top', dy: 16, dx: -5, textAnchor: 'end', text: () => `${L('Україна', 'Ukraine')} ${pct(ua)}`, fill: '#a08cff', fontWeight: 700 }),
    ],
  }));
}

function waterfall(ex: Any) {
  const el = $('wf'); const w = W(el);
  let cur = ex.routes_base.routes;
  const rows: Any[] = [{ l: String(ex.routes_base.year), y1: 0, y2: cur, kind: 'total', t: String(cur) }];
  for (const e of ex.route_events.filter((e: Any) => e.year < ex.routes_end.year)) { const n = cur + e.opened - e.closed; rows.push({ l: String(e.year), y1: cur, y2: n, kind: n > cur ? 'up' : n < cur ? 'down' : 'flat', t: n === cur ? '0' : (n > cur ? '+' : '−') + Math.abs(n - cur), sub: `+${e.opened} / −${e.closed}` }); cur = n; }
  rows.push({ l: String(ex.routes_end.year), y1: 0, y2: ex.routes_end.routes, kind: 'total', t: String(ex.routes_end.routes) });
  const col: Any = { total: '#59d6ff', up: '#c6f432', down: '#ff4d8d', flat: '#555' };
  put('wf', Plot.plot({
    width: w, height: 270, style, marginLeft: 36, x: { label: null, domain: rows.map((r) => r.l), padding: 0.25 }, y: { domain: [480, 600], grid: true, label: L('маршрутів', 'routes') },
    marks: [
      Plot.barY(rows, { x: 'l', y1: (d: Any) => Math.max(d.y1, 480), y2: (d: Any) => d.y2 === d.y1 ? d.y1 + 0.6 : d.y2, fill: (d: Any) => col[d.kind], rx: 4, clip: true }),
      Plot.text(rows, { x: 'l', y: (d: Any) => Math.max(d.y1, d.y2), text: 't', dy: -8, fill: '#eee', fontWeight: 700 }),
      Plot.text(rows.filter((r) => r.sub), { x: 'l', y: (d: Any) => Math.min(d.y1, d.y2), text: 'sub', dy: 12, fill: '#8e8ea6', fontSize: 9 }),
    ],
  }));
}

function donut(S: Any) {
  const el = $('dn'); const s = Math.min(W(el), 340);
  const kinds: [string, string][] = [['new', '#c6f432'], ['amnesty', '#59d6ff'], ['apt', '#ff4d8d']];
  const get = (y: number, k: string) => S.houses.find((r: Any) => r.year === y && r.scope === 'oblast' && r.kind === k).count as number;
  const svg = d3.create('svg').attr('viewBox', `${-s / 2} ${-s / 2} ${s} ${s}`).attr('width', s).attr('height', s).attr('font-family', 'inherit');
  const ring = (y: number, r0: number, r1: number) => {
    const vals = kinds.map(([k, c]) => ({ k, c, v: get(y, k) }));
    const arcs = d3.pie<Any>().value((d) => d.v).sort(null)(vals);
    const arc = d3.arc<any>().innerRadius(r0).outerRadius(r1).padAngle(0.015).cornerRadius(3);
    const g = svg.append('g');
    g.selectAll('path').data(arcs).join('path').attr('d', arc).attr('fill', (d: Any) => d.data.c).append('title').text((d: Any) => `${y}: ${d.data.v}`);
    g.selectAll('text').data(arcs.filter((a) => a.endAngle - a.startAngle > 0.25)).join('text').attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle').attr('dy', 4).attr('font-size', 11).attr('font-weight', 800).attr('fill', '#0a0a12').text((d: Any) => d.data.v);
    return d3.sum(vals, (d) => d.v);
  };
  const t26 = ring(2026, s * 0.36, s * 0.48), t21 = ring(2021, s * 0.24, s * 0.33);
  const c = svg.append('g').attr('text-anchor', 'middle');
  c.append('text').attr('dy', -4).attr('font-size', 28).attr('font-weight', 800).attr('fill', '#fff').text(t26.toLocaleString(LOC));
  c.append('text').attr('dy', 14).attr('font-size', 11).attr('fill', '#8e8ea6').text(L('будинків 2026', 'buildings 2026'));
  c.append('text').attr('dy', 30).attr('font-size', 11).attr('fill', '#8e8ea6').text(`2021: ${t21.toLocaleString(LOC)}`);
  put('dn', svg.node()!);
}

function dumbbell(H: Any[], ex: Any, mode: string) {
  const el = $('db'); const w = W(el); const m = isMobile();
  let rows: Any[];
  if (mode === 'schools') {
    rows = ex.schools.filter((s: Any) => s.s23 >= 4 || s.s23 !== s.s25).map((s: Any) => ({ n: s.name, a: s.s23, b: s.s25 }))
      .sort((x: Any, y: Any) => Math.abs(y.b - y.a) - Math.abs(x.b - x.a) || y.a - x.a).slice(0, m ? 12 : 18);
    $('dbn').textContent = L('Школи, з яких випускники складали НМТ, 2023 → 2025. Громади з найбільшими змінами', 'Schools whose graduates took the NMT, 2023 → 2025. Hromadas with the largest changes');
  } else {
    rows = H.filter((h) => h.trips_2019 != null && h.trips_pct != null).sort((a, b) => b.trips_2019 - a.trips_2019).slice(0, m ? 12 : 16)
      .map((h) => ({ n: h.name, a: h.trips_2019, b: Math.round(h.trips_2019 * (1 + h.trips_pct / 100)) }));
    $('dbn').textContent = L('Автобусні рейси на добу, 2019 → 2026. Громади з найбільшою кількістю рейсів у 2019', 'Daily bus trips, 2019 → 2026. Hromadas with the most trips in 2019');
  }
  rows.forEach((r) => { r.d = r.b - r.a; r.col = r.d > 0 ? '#c6f432' : r.d < 0 ? '#ff4d8d' : '#8e8ea6'; r.t = (r.d > 0 ? '+' : r.d < 0 ? '−' : '±') + Math.abs(r.d); });
  const useLog = mode === 'trips';
  put('db', Plot.plot({
    width: w, height: rows.length * 24 + 40, style, marginLeft: m ? 118 : 150, marginRight: 46,
    x: { type: useLog ? 'log' : 'linear', grid: true, label: mode === 'schools' ? L('шкіл', 'schools') : L('рейсів на добу (лог. шкала)', 'daily trips (log scale)') },
    y: { domain: rows.map((r) => r.n), label: null },
    marks: [
      Plot.ruleY(rows, { y: 'n', x1: 'a', x2: 'b', stroke: 'col', strokeWidth: 4, strokeOpacity: 0.6, strokeLinecap: 'round' }),
      Plot.dot(rows, { x: 'a', y: 'n', fill: '#8e8ea6', r: 5 }),
      Plot.dot(rows, { x: 'b', y: 'n', fill: 'col', r: 6, title: (d: Any) => `${d.n}: ${d.a} → ${d.b}`, tip: true }),
      Plot.text(rows, { x: (d: Any) => Math.max(d.a, d.b), y: 'n', text: 't', dx: 12, textAnchor: 'start', fill: 'col', fontWeight: 700 }),
      Plot.axisY({ tickSize: 0, fill: '#ddd' }),
    ],
  }));
}

export async function initOblastDashboardD() {
  const root = $('pd'); if (!root) return; const base = root.dataset.base || '/'; const slug = root.dataset.slug || 'ivano-frankivsk';
  LANG = root.dataset.lang === 'en' ? 'en' : 'uk'; LOC = LANG === 'en' ? 'en-US' : 'uk-UA'; nf = new Intl.NumberFormat(LOC, { maximumFractionDigits: 1 });
  const D = await fetch(`${base}data/oblast/${slug}.json`).then((r) => r.json()); const ex = D.extra;
  const kp: Any = Object.fromEntries(D.kpis.map((k: Any) => [k.kpi, k]));
  // Drop raion-level rows (KATOTTG 3rd level 0000000) that slipped into the hromada list
  const H: Any[] = D.hromadas;
  $('wfn').textContent = String(ex.routes_base.routes - ex.routes_end.routes);
  $('asof').textContent = new Date(D.generated).toLocaleDateString(LOC, { month: 'long', year: 'numeric' });
  $('hs').innerHTML = (LANG === 'en' ? [['reg_indiv_ent', 'FOPs'], ['house_new', 'new houses'], ['edu_grads', 'NMT graduates'], ['tr_trips', 'daily bus trips']] : [['reg_indiv_ent', 'ФОП'], ['house_new', 'нових будинків'], ['edu_grads', 'випускників на НМТ'], ['tr_trips', 'рейсів на добу']]).map(([k, c]) => {
    const t = kp[k]; return `<div><b style="color:${t.good ? 'var(--a)' : 'var(--p)'}">${pct(t.change_pct)}</b><span>${c} · ${t.base_label}→${LANG === 'en' ? String(t.as_of).replace('січ–вер', 'Jan–Sep').replace('(останній знімок)', '(latest snapshot)') : t.as_of}${t.national_change_pct != null ? ' · ' + L('Україна', 'Ukraine') + ' ' + pct(t.national_change_pct) : ''}</span></div>`;
  }).join('');
  let mode = 'schools';
  const safe = (f: () => void) => { try { f(); } catch (e) { console.error(e); } };
  const draw = () => { safe(() => bubbles(H, kp)); safe(() => radar(kp)); safe(() => histogram(H, kp, D.medians.fop_pct)); safe(() => waterfall(ex)); safe(() => donut(D.series)); safe(() => dumbbell(H, ex, mode)); };
  document.querySelectorAll<HTMLButtonElement>('.tabs button').forEach((b) => b.addEventListener('click', () => {
    mode = b.dataset.m!; document.querySelectorAll('.tabs button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); dumbbell(H, ex, mode);
  }));
  draw();
  let lastW = window.innerWidth, t: number | undefined;
  window.addEventListener('resize', () => { if (Math.abs(window.innerWidth - lastW) < 40) return; lastW = window.innerWidth; clearTimeout(t); t = window.setTimeout(draw, 150); });
}
