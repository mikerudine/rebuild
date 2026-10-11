import { renderLineChart } from '@/lib/plot-client';

export async function initChartFigures() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-chart-url]');
  for (const el of nodes) {
    const url = el.dataset.chartUrl;
    if (!url || el.dataset.loaded) continue;
    el.dataset.loaded = '1';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const json = await res.json();
      const series = json.series?.[0];
      if (!series) continue;
      const points = series.observations.map((o: { year: number; value: number }) => ({
        x: o.year,
        y: o.value,
      }));
      const xLabel = document.documentElement.lang === 'en' ? 'Year' : 'Рік';
      renderLineChart(el, {
        data: points,
        xLabel,
        yLabel: series.indicator_label_uk || series.indicator,
      });
    } catch (err) {
      console.error('ChartFigure failed:', err);
    }
  }
}
