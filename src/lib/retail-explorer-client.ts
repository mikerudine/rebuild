import retailSummary from '@/data/retail-summary.json';
import { parseCsv } from '@/lib/csv';
import { renderBarChart, renderGroupedBars } from '@/lib/plot-charts';

function shortOblast(name: string) {
  return name
    .replace(' область', '')
    .replace('Автономна Республіка Крим', 'Крим')
    .replace('м. ', '');
}

export async function initRetailExplorer() {
  const root = document.querySelector('.retail-explorer') as HTMLElement | null;
  if (!root) return;
  const lang = root.dataset.lang || 'uk';
  const base = root.dataset.base || '/';

  const [oblastText, atbText, completenessText, hromadaText] = await Promise.all([
    fetch(`${base}data/oblast_store_counts.csv`).then((r) => r.text()),
    fetch(`${base}data/atb_corrected_oblast_change.csv`).then((r) => r.text()),
    fetch(`${base}data/osm_completeness_chain_national.csv`).then((r) => r.text()),
    fetch(`${base}data/hromada_chain_stores.csv`).then((r) => r.text()),
  ]);

  const oblastRows = parseCsv(oblastText).filter((r) => r.oblast && r.pct_21_26);
  const topOsm = [...oblastRows]
    .sort((a, b) => parseFloat(b.pct_21_26) - parseFloat(a.pct_21_26))
    .slice(0, 15)
    .reverse()
    .map((r) => ({
      label: shortOblast(r.oblast),
      value: parseFloat(r.pct_21_26),
    }));

  const osmEl = document.getElementById('retail-osm-oblast-chart');
  if (osmEl) {
    renderBarChart(osmEl, topOsm, {
      xLabel: lang === 'uk' ? 'Зміна магазинів мереж, % (2021→2026)' : 'Chain store change, % (2021→2026)',
      valueFormat: (n) => `${n.toFixed(1)}%`,
    });
  }

  const atbRows = parseCsv(atbText).filter((r) => r.corrected_pct && r.oblast);
  const topAtb = [...atbRows]
    .filter((r) => Number.isFinite(parseFloat(r.corrected_pct)))
    .sort((a, b) => parseFloat(b.corrected_pct!) - parseFloat(a.corrected_pct!))
    .slice(0, 12)
    .reverse()
    .map((r) => ({
      label: shortOblast(r.oblast),
      value: parseFloat(r.corrected_pct!),
    }));

  const atbEl = document.getElementById('retail-atb-corrected-chart');
  if (atbEl) {
    renderBarChart(atbEl, topAtb, {
      xLabel: lang === 'uk' ? 'ATB: скоригована зміна, %' : 'ATB: corrected change, %',
      valueFormat: (n) => `${n.toFixed(0)}%`,
    });
  }

  const compRows = parseCsv(completenessText);
  const compEl = document.getElementById('retail-completeness-chart');
  if (compEl) {
    renderGroupedBars(
      compEl,
      compRows.map((r) => ({
        group: r.chain,
        metric: lang === 'uk' ? 'повнота' : 'completeness',
        value: parseFloat(r.completeness) * 100,
      })),
      { yLabel: lang === 'uk' ? 'OSM/офіційний список, %' : 'OSM vs official, %' },
    );
  }

  const tbody = document.querySelector('#retail-examples-table tbody');
  if (tbody) {
    tbody.replaceChildren();
    for (const ex of retailSummary.hromada_examples) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${ex.name}</td><td>${ex.stores_2021}</td><td>${ex.stores_2026}</td><td>${lang === 'uk' ? ex.note_uk : ex.note_en}</td>`;
      tbody.appendChild(tr);
    }
  }

  // Optional: verify Sokilnytska from CSV
  const hromadaRows = parseCsv(hromadaText);
  const sokil = hromadaRows.find((r) => r.name === 'Сокільницька');
  if (sokil && tbody) {
    const cap = document.getElementById('retail-sokil-verify');
    if (cap) {
      cap.textContent =
        lang === 'uk'
          ? `Перевірка CSV: Сокільницька ${sokil['2021']}→${sokil['2026']} (Δ ${sokil.chg_21_26}). Spearman(зростання юросіб, Δ магазинів)=${retailSummary.spearman_leg_vs_stores}.`
          : `CSV check: Sokilnytska ${sokil['2021']}→${sokil['2026']} (Δ ${sokil.chg_21_26}). Spearman(legal growth, store Δ)=${retailSummary.spearman_leg_vs_stores}.`;
    }
  }
}
