/**
 * Fetches verified Derzhstat SDMX series at build time and writes public JSON.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SDMX_BASE =
  'https://stat.gov.ua/sdmx/workspaces/default:integration/registry/sdmx/2.1';

const YASINIA_HROMADA = 'UA21060070000049340';

type Observation = { year: number; value: number };

function parseSeries(xml: string, indicator: string, gender: string): Observation[] {
  const seriesRe = new RegExp(
    `<Series INDICATOR="${indicator}"[^>]*MANAGER_GENDER="${gender}"[^>]*>([\\s\\S]*?)</Series>`,
    'g',
  );
  const match = seriesRe.exec(xml);
  if (!match) return [];
  const body = match[1];
  const obs: Observation[] = [];
  const obsRe = /TIME_PERIOD="(\d+)" OBS_VALUE="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = obsRe.exec(body))) {
    obs.push({ year: Number(m[1]), value: Number(m[2]) });
  }
  return obs.sort((a, b) => a.year - b.year);
}

async function fetchXml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { Accept: 'application/xml' },
  });
  if (!res.ok) {
    throw new Error(`SDMX fetch failed ${res.status}: ${url}`);
  }
  return res.text();
}

async function main() {
  const key = `REG_LEG_ENT+ACT_ENTRP.${YASINIA_HROMADA}....`;
  const url = `${SDMX_BASE}/data/DF_STATISTICAL_BUSINESS_REGISTER_A/${key}?startPeriod=2021`;
  const xml = await fetchXml(url);
  const fetchedAt = new Date().toISOString();

  const regLegalTotal = parseSeries(xml, 'REG_LEG_ENT', '_T');
  const actEntrpTotal = parseSeries(xml, 'ACT_ENTRP', '_T');

  const payload = {
    source: {
      provider: 'Derzhstat (SSSU) SDMX API',
      dataflow_id: 'DF_STATISTICAL_BUSINESS_REGISTER_A',
      dataflow_title:
        'Statistical Business Register (annual): active enterprises, legal entities, sole proprietors',
      query_url: url,
      region_katottg: YASINIA_HROMADA,
      region_name_uk: 'Ясіняська територіальна громада',
      license: 'Official statistics; cite Derzhstat and link to source query',
    },
    fetched_at: fetchedAt,
    series: [
      {
        indicator: 'REG_LEG_ENT',
        indicator_label_uk: 'Зареєстровані юридичні особи (усього)',
        unit: 'entities',
        observations: regLegalTotal,
      },
      {
        indicator: 'ACT_ENTRP',
        indicator_label_uk: 'Діючі суб’єкти господарювання (усього)',
        unit: 'entities',
        observations: actEntrpTotal,
      },
    ].filter((s) => s.observations.length > 0),
  };

  if (payload.series.length === 0) {
    throw new Error('No observations parsed from SDMX response');
  }

  const json = JSON.stringify(payload, null, 2);
  const publicDir = join(process.cwd(), 'public', 'data');
  const srcDir = join(process.cwd(), 'src', 'data', 'generated');
  await mkdir(publicDir, { recursive: true });
  await mkdir(srcDir, { recursive: true });
  const publicPath = join(publicDir, 'yasinia-business-register.json');
  const srcPath = join(srcDir, 'yasinia-business-register.json');
  await writeFile(publicPath, json, 'utf8');
  await writeFile(srcPath, json, 'utf8');
  console.log(`Wrote ${publicPath} (${payload.series.length} series)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
