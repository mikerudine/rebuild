/** Curated SDMX dataflows verified in project research (2026-10-11). */
export type DataflowRow = {
  id: string;
  titleUk: string;
  titleEn: string;
  lowestGeoUk: string;
  lowestGeoEn: string;
  yearsNote: string;
  verified: boolean;
};

export const sdmxCatalog: DataflowRow[] = [
  {
    id: 'DF_STATISTICAL_BUSINESS_REGISTER_A',
    titleUk: 'Статистичний бізнес-реєстр (річний)',
    titleEn: 'Statistical Business Register (annual)',
    lowestGeoUk: 'громада',
    lowestGeoEn: 'hromada',
    yearsNote: '2021–2025',
    verified: true,
  },
  {
    id: 'DF_STATISTICAL_BUSINESS_REGISTER_Q_M',
    titleUk: 'Статистичний бізнес-реєстр (квартальний/місячний)',
    titleEn: 'Statistical Business Register (quarterly/monthly)',
    lowestGeoUk: 'громада',
    lowestGeoEn: 'hromada',
    yearsNote: '2022Q1–2026Q2',
    verified: true,
  },
  {
    id: 'DF_COSTS_OF_ENVIRONMENTAL_PROTECTION',
    titleUk: 'Витрати на охорону довкілля',
    titleEn: 'Environmental protection costs',
    lowestGeoUk: 'громада',
    lowestGeoEn: 'hromada',
    yearsNote: '2022–2025',
    verified: true,
  },
  {
    id: 'DF_CAPITAL_INVESTMENTS_A',
    titleUk: 'Капітальні інвестиції (річні)',
    titleEn: 'Capital investments (annual)',
    lowestGeoUk: 'район',
    lowestGeoEn: 'rayon',
    yearsNote: '2021–2025',
    verified: true,
  },
  {
    id: 'DF_BEGINING_COMPLETION_CONSTRUCTION',
    titleUk: 'Житлове будівництво: початок і введення',
    titleEn: 'Housing construction started and completed',
    lowestGeoUk: 'район',
    lowestGeoEn: 'rayon',
    yearsNote: '2021Q1–2026Q2',
    verified: true,
  },
  {
    id: 'DF_ENTERPRISE_LABOR_STATISTICS',
    titleUk: 'Праця та заробітна плата на підприємствах',
    titleEn: 'Enterprise labor statistics',
    lowestGeoUk: 'район',
    lowestGeoEn: 'rayon',
    yearsNote: '2021–2026Q2',
    verified: true,
  },
  {
    id: 'DF_AREA_HARVESTS_CROP_YIELD_A',
    titleUk: 'Посіви, урожай, багаторічні насадження (зокрема виноградники)',
    titleEn: 'Crops, harvests, perennial plantings (incl. vineyards)',
    lowestGeoUk: 'район',
    lowestGeoEn: 'rayon',
    yearsNote: '2021–2025',
    verified: true,
  },
  {
    id: 'DF_POPULATION_STRUCTURE',
    titleUk: 'Структура населення',
    titleEn: 'Population structure',
    lowestGeoUk: 'область',
    lowestGeoEn: 'oblast',
    yearsNote: '1989–2025 (без рівня села/громади)',
    verified: true,
  },
  {
    id: 'DF_COLLECTIVE_ACCOM_FACILITIES',
    titleUk: 'Засоби колективного розміщення (туризм)',
    titleEn: 'Collective accommodation facilities',
    lowestGeoUk: 'область',
    lowestGeoEn: 'oblast',
    yearsNote: '2015–2025',
    verified: true,
  },
  {
    id: 'DF_ARRIVAL_GRAPES_WINE_MATERIALS',
    titleUk: 'Надходження винограду для виноматеріалів',
    titleEn: 'Grapes processed into wine materials',
    lowestGeoUk: 'область (6 виноробних областей)',
    lowestGeoEn: 'oblast (6 wine oblasts)',
    yearsNote: '2016–2021',
    verified: true,
  },
];

export const SDMX_API_BASE =
  'https://stat.gov.ua/sdmx/workspaces/default:integration/registry/sdmx/2.1';
