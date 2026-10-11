import { workuaCityLabels } from '@/data/workua-cities';
import { parseCsv } from '@/lib/csv';
import { renderGroupedBars, renderLineChart } from '@/lib/plot-charts';

const START = '2023-10';
const END = '2026-10';

type Row = Record<string, string>;

const byCity = new Map<string, Row[]>();

function cityLabel(slug: string, lang: string) {
  const entry = workuaCityLabels[slug];
  if (entry) return lang === 'uk' ? entry.uk : entry.en;
  return slug;
}

function pctChange(from: number, to: number) {
  if (!from || !to) return null;
  return ((to - from) / from) * 100;
}

function renderCity(slug: string, lang: string) {
  const rows = byCity.get(slug) || [];
  const salary = rows.map((r) => ({ x: r.month, y: Number(r.median_salary_uah) }));
  const jobs = rows.map((r) => ({ x: r.month, y: Number(r.job_count) }));

  const salaryEl = document.getElementById('jobs-salary-chart');
  const jobsEl = document.getElementById('jobs-count-chart');
  if (salaryEl) {
    renderLineChart(salaryEl, salary, {
      yLabel: lang === 'uk' ? 'грн' : 'UAH',
      color: '#0057b7',
    });
  }
  if (jobsEl) {
    renderLineChart(jobsEl, jobs, {
      yLabel: lang === 'uk' ? 'вакансій' : 'vacancies',
      color: '#2a9d8f',
    });
  }

  const start = rows.find((r) => r.month === START);
  const end = rows.find((r) => r.month === END);
  const changeEl = document.getElementById('jobs-change-chart');
  const caption = document.getElementById('jobs-change-caption');
  if (start && end && changeEl) {
    const salPct = pctChange(Number(start.median_salary_uah), Number(end.median_salary_uah));
    const jobPct = pctChange(Number(start.job_count), Number(end.job_count));
    renderGroupedBars(
      changeEl,
      [
        { group: lang === 'uk' ? 'Зарплата' : 'Salary', metric: '%', value: salPct ?? 0 },
        { group: lang === 'uk' ? 'Вакансії' : 'Vacancies', metric: '%', value: jobPct ?? 0 },
      ],
      { yLabel: lang === 'uk' ? 'Зміна, %' : 'Change, %' },
    );
    if (caption) {
      caption.textContent =
        lang === 'uk'
          ? `${cityLabel(slug, lang)}: ${start.median_salary_uah}→${end.median_salary_uah} грн (${salPct?.toFixed(1)}%); вакансії ${start.job_count}→${end.job_count} (${jobPct?.toFixed(1)}%).`
          : `${cityLabel(slug, lang)}: salary ${start.median_salary_uah}→${end.median_salary_uah} UAH (${salPct?.toFixed(1)}%); vacancies ${start.job_count}→${end.job_count} (${jobPct?.toFixed(1)}%).`;
    }
  }
}

export async function initJobsExplorer() {
  const root = document.querySelector('.jobs-explorer') as HTMLElement | null;
  if (!root) return;
  const lang = root.dataset.lang || 'uk';
  const url = root.dataset.url;
  if (!url) return;

  const text = await fetch(url).then((r) => r.text());
  const rows = parseCsv(text).filter((r) => r.city_slug && r.city_slug !== 'city_slug');
  for (const r of rows) {
    if (!byCity.has(r.city_slug)) byCity.set(r.city_slug, []);
    byCity.get(r.city_slug)!.push(r);
  }
  for (const list of byCity.values()) list.sort((a, b) => a.month.localeCompare(b.month));

  const select = document.getElementById('jobs-city-select') as HTMLSelectElement | null;
  if (!select) return;
  const slugs = [...byCity.keys()].sort((a, b) => cityLabel(a, lang).localeCompare(cityLabel(b, lang)));
  for (const slug of slugs) {
    const opt = document.createElement('option');
    opt.value = slug;
    opt.textContent = cityLabel(slug, lang);
    select.appendChild(opt);
  }
  select.value = byCity.has('kyiv') ? 'kyiv' : slugs[0];
  select.addEventListener('change', () => renderCity(select.value, lang));
  renderCity(select.value, lang);
}
