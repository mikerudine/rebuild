import * as Plot from '@observablehq/plot';

export function renderLineChart(
  container: HTMLElement,
  data: { x: string; y: number }[],
  opts: { yLabel: string; color?: string; width?: number },
) {
  container.replaceChildren();
  const plot = Plot.plot({
    width: opts.width ?? Math.min(720, container.clientWidth || 720),
    marginLeft: 56,
    marginBottom: 48,
    x: { label: null, tickRotate: -45 },
    y: { label: opts.yLabel, grid: true },
    marks: [
      Plot.lineY(data, { x: 'x', y: 'y', stroke: opts.color ?? '#0057b7', strokeWidth: 2 }),
      Plot.dot(data, { x: 'x', y: 'y', fill: opts.color ?? '#0057b7', r: 2.5 }),
    ],
  });
  container.append(plot);
}

export function renderBarChart(
  container: HTMLElement,
  data: { label: string; value: number; highlight?: boolean }[],
  opts: { xLabel: string; valueFormat?: (n: number) => string; width?: number; height?: number },
) {
  container.replaceChildren();
  const plot = Plot.plot({
    width: opts.width ?? Math.min(720, container.clientWidth || 720),
    height: opts.height ?? Math.max(320, data.length * 22),
    marginLeft: 140,
    marginRight: 24,
    marginBottom: 40,
    x: { label: opts.xLabel, grid: true },
    y: { label: null, domain: data.map((d) => d.label) },
    marks: [
      Plot.barX(data, {
        x: 'value',
        y: 'label',
        fill: (d) => (d.highlight ? '#ffd700' : '#0057b7'),
        sort: { y: 'x', reverse: true },
      }),
      Plot.text(data, {
        x: 'value',
        y: 'label',
        text: (d) => (opts.valueFormat ? opts.valueFormat(d.value) : String(d.value)),
        dx: 6,
        textAnchor: 'start',
        fill: '#1a1a1a',
        fontSize: 11,
      }),
    ],
  });
  container.append(plot);
}

export function renderGroupedBars(
  container: HTMLElement,
  data: { group: string; metric: string; value: number }[],
  opts: { yLabel: string; width?: number },
) {
  container.replaceChildren();
  const plot = Plot.plot({
    width: opts.width ?? Math.min(480, container.clientWidth || 480),
    marginLeft: 48,
    marginBottom: 56,
    x: { label: null },
    y: { label: opts.yLabel, grid: true },
    color: { legend: true },
    marks: [
      Plot.barY(data, {
        x: 'group',
        y: 'value',
        fill: 'metric',
        tip: true,
      }),
    ],
  });
  container.append(plot);
}

export function renderScatter(
  container: HTMLElement,
  data: { x: number; y: number; label: string }[],
  opts: { xLabel: string; yLabel: string; width?: number },
) {
  container.replaceChildren();
  const plot = Plot.plot({
    width: opts.width ?? Math.min(640, container.clientWidth || 640),
    height: 420,
    marginLeft: 52,
    marginBottom: 48,
    x: { label: opts.xLabel, grid: true },
    y: { label: opts.yLabel, grid: true },
    marks: [
      Plot.dot(data, { x: 'x', y: 'y', fill: '#0057b7', r: 4, title: 'label' }),
      Plot.text(data, {
        x: 'x',
        y: 'y',
        text: 'label',
        dy: -8,
        fontSize: 9,
        fill: '#5c5c5c',
      }),
    ],
  });
  container.append(plot);
}
