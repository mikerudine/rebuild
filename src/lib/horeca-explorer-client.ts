import horecaSummary from '@/data/horeca-summary.json';
import { parseCsv } from '@/lib/csv';
import { renderBarChart, renderGroupedBars, renderScatter } from '@/lib/plot-charts';

function shortOblast(name: string) {
  return name.replace(' область', '').replace('м. ', '');
}

const HROMADA_NAME_BY_CODE: Record<string, string> = {
  UA26120130000088448: 'Поляницька',
  UA21060070000049340: 'Ясінянська',
  UA26120010000096774: 'Ворохтянська',
  UA32080110000056605: 'Гостомельська',
  UA32140050000046018: 'Гатненська',
  UA07080230000046097: 'Підгайцівська',
  UA73060590000095243: 'Чагорська',
  UA46060410000052681: 'Сокільницька',
};

export async function initHorecaExplorer() {
  const root = document.querySelector('.horeca-explorer') as HTMLElement | null;
  if (!root) return;
  const lang = root.dataset.lang || 'uk';
  const base = root.dataset.base || '/';

  const [compareText, kvedText, hromadaOsmText, growthText] = await Promise.all([
    fetch(`${base}data/oblast_horeca_compare.csv`).then((r) => r.text()),
    fetch(`${base}data/derzhstat_kved_I_oblast_growth.csv`).then((r) => r.text()),
    fetch(`${base}data/osm_hromada_food_counts.csv`).then((r) => r.text()),
    fetch(`${base}data/hromada_growth_ranked.csv`).then((r) => r.text()),
  ]);
  const nameByCode: Record<string, string> = { ...HROMADA_NAME_BY_CODE };
  for (const r of parseCsv(growthText)) {
    if (r.code && r.name) nameByCode[r.code] = r.name;
  }

  const compareRows = parseCsv(compareText).filter((r) => r.oblast);
  const scatterData = compareRows
    .map((r) => ({
      x: parseFloat(r.osm_food_pct_2021_2025),
      y: parseFloat(r.kvedI_fop_pct_2021_2025),
      label: shortOblast(r.oblast),
    }))
    .filter((d) => Number.isFinite(d.x) && Number.isFinite(d.y));

  const scatterEl = document.getElementById('horeca-correlation-chart');
  if (scatterEl) {
    renderScatter(scatterEl, scatterData, {
      xLabel: lang === 'uk' ? 'OSM їжа, % 2021→2025' : 'OSM food, % 2021→2025',
      yLabel: lang === 'uk' ? 'KVED I ФОП, % 2021→2025' : 'KVED I FOP, % 2021→2025',
    });
  }

  const corr = document.getElementById('horeca-correlation-note');
  if (corr) {
    const c = horecaSummary.correlation_oblast;
    corr.textContent =
      lang === 'uk'
        ? `Кореляція по областях: OSM vs юрособи I = ${c.osm_vs_legal_I}; OSM vs ФОП I = ${c.osm_vs_fop_I}; юрособи vs ФОП I = ${c.legal_vs_fop_I}.`
        : `Oblast correlations: OSM vs legal I = ${c.osm_vs_legal_I}; OSM vs FOP I = ${c.osm_vs_fop_I}; legal vs FOP I = ${c.legal_vs_fop_I}.`;
  }

  const topOsm = [...compareRows]
    .sort((a, b) => parseFloat(b.osm_food_pct_2021_2025) - parseFloat(a.osm_food_pct_2021_2025))
    .slice(0, 12)
    .reverse()
    .map((r) => ({
      label: shortOblast(r.oblast),
      value: parseFloat(r.osm_food_pct_2021_2025),
    }));

  const osmEl = document.getElementById('horeca-osm-oblast-chart');
  if (osmEl) {
    renderBarChart(osmEl, topOsm, {
      xLabel: lang === 'uk' ? 'Зростання точок OSM, %' : 'OSM point growth, %',
      valueFormat: (n) => `${n.toFixed(1)}%`,
    });
  }

  const kvedRows = parseCsv(kvedText).filter(
    (r) => r.indicator === 'REG_INDIV_ENT' && r.name !== 'Україна' && r.pct_2021_2025,
  );
  const topFopFixed = [...kvedRows]
    .sort((a, b) => parseFloat(b.pct_2021_2025) - parseFloat(a.pct_2021_2025))
    .slice(0, 12)
    .reverse()
    .map((r) => ({
      label: r.name === 'Київ' ? 'м. Київ' : r.name,
      value: parseFloat(r.pct_2021_2025),
    }));

  const fopEl = document.getElementById('horeca-kved-fop-chart');
  if (fopEl) {
    renderBarChart(fopEl, topFopFixed, {
      xLabel: lang === 'uk' ? 'ФОП KVED I, % 2021→2025' : 'KVED I FOP, % 2021→2025',
      valueFormat: (n) => `${n.toFixed(1)}%`,
    });
  }

  // Hromada OSM food 2021 vs 2025
  const byCode: Record<string, Record<number, number>> = {};
  for (const r of parseCsv(hromadaOsmText)) {
    const code = r.katottg;
    if (!byCode[code]) byCode[code] = {};
    byCode[code][parseInt(r.year_jan1, 10)] = parseInt(r.count, 10);
  }
  const hromadaRows = Object.entries(byCode)
    .map(([code, years]) => ({
      code,
      name: nameByCode[code] || code,
      y2021: years[2021] ?? null,
      y2025: years[2025] ?? null,
      delta: (years[2025] ?? 0) - (years[2021] ?? 0),
    }))
    .filter((r) => r.y2021 !== null && r.y2025 !== null && r.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 15);

  const tbody = document.querySelector('#horeca-hromada-table tbody');
  if (tbody) {
    tbody.replaceChildren();
    for (const r of hromadaRows) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.name}</td><td>${r.y2021}</td><td>${r.y2025}</td><td>+${r.delta}</td>`;
      tbody.appendChild(tr);
    }
  }

  const legalRows = parseCsv(kvedText).filter((r) => r.indicator === 'REG_LEG_ENT' && r.name === 'Україна');
  const nat = document.getElementById('horeca-national-note');
  if (nat && legalRows[0]) {
    nat.textContent =
      lang === 'uk'
        ? `KVED 56.10 (ресторани): юрособи +${horecaSummary.national_kved_56.restaurants_legal_pct_2021_2025}%, ФОП +${horecaSummary.national_kved_56.restaurants_fop_pct_2021_2025}% (2021→2025, Derzhstat).`
        : `KVED 56.10 (restaurants): legal +${horecaSummary.national_kved_56.restaurants_legal_pct_2021_2025}%, FOP +${horecaSummary.national_kved_56.restaurants_fop_pct_2021_2025}% (2021→2025).`;
  }
}
