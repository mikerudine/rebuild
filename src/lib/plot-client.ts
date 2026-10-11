import * as Plot from '@observablehq/plot';

export type LineSpec = {
  data: { x: number; y: number; series?: string }[];
  xLabel?: string;
  yLabel?: string;
  colorDomain?: string[];
};

export function renderLineChart(container: HTMLElement, spec: LineSpec) {
  container.replaceChildren();
  const hasSeries = spec.data.some((d) => d.series);
  const plot = Plot.plot({
    width: Math.min(640, container.clientWidth || 640),
    marginLeft: 52,
    marginBottom: 40,
    x: { label: spec.xLabel, tickFormat: (d: number) => String(d) },
    y: { label: spec.yLabel, grid: true },
    color: hasSeries ? { domain: spec.colorDomain, legend: true } : undefined,
    marks: [
      Plot.lineY(spec.data, {
        x: 'x',
        y: 'y',
        stroke: hasSeries ? 'series' : '#0057b7',
        strokeWidth: 2,
      }),
      Plot.dot(spec.data, {
        x: 'x',
        y: 'y',
        fill: hasSeries ? 'series' : '#0057b7',
        r: 3,
      }),
    ],
  });
  container.append(plot);
}
