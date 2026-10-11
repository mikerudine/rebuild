export type Lang = 'uk' | 'en';

export const defaultLang: Lang = 'uk';

export const ui = {
  uk: {
    siteName: 'rebuild',
    siteTagline: 'Як ростуть українські села та громади',
    nav: {
      home: 'Головна',
      cases: 'Кейси',
      growth: 'Де росте бізнес',
      jobs: 'Вакансії та зарплати',
      retail: 'Магазини мереж',
      horeca: 'Заклади харчування',
      data: 'Дані',
      methodology: 'Методологія',
    },
    langSwitch: 'English',
    footer: 'Дослідницький сайт про розвиток сіл і територіальних громад України.',
    license: 'Код — MIT. Цифри — з указаних джерел; перепублікуйте з посиланням.',
    home: {
      title: 'Де села ростуть, коли інші спустошуються',
      lead: 'Публічне дослідження на графіках і перевірених джерелах: туристичні та економічні історії окремих сіл і те, що про них можна сказати цифрами Держстату.',
      ctaCases: 'Переглянути кейси',
      ctaData: 'Атлас даних SDMX',
      ctaGrowth: 'Де росте бізнес',
      ctaJobs: 'Вакансії та зарплати',
      teaserGrowthTitle: 'Де росте бізнес',
      teaserGrowthText:
        'Рейтинг громад за зростанням юросіб і ФОП 2021→2025: топ-20, малі громади, позиція Ясіняської ТГ.',
      teaserJobsTitle: 'Вакансії та зарплати',
      teaserJobsText: 'Місячні медіани work.ua по містах: зарплати в оголошеннях і кількість вакансій.',
      ctaRetail: 'Магазини мереж',
      ctaHoreca: 'Заклади харчування',
      teaserRetailTitle: 'Магазини мереж',
      teaserRetailText: 'OSM + офіційні списки ATB: де зростають магазини мереж 2021→2026.',
      teaserHorecaTitle: 'Заклади харчування',
      teaserHorecaText: 'KVED I у Держстаті та точки їжі в OSM по областях і громадах.',
      featuredChartTitle: 'Ясіняська громада: зареєстровані юридичні особи',
      featuredChartNote:
        'Кваси входить до Ясіняської ТГ. Показник з річного статистичного бізнес-реєстру (рівень громади).',
    },
    cases: {
      title: 'Кейси',
      lead: 'Перші історії — гірське село Кваси на Закарпатті та Шабо в Одеській області. Кожне твердження з посиланням; числа без джерела не публікуємо.',
      kvasyTitle: 'Кваси',
      kvasyMeta: 'Ясіняська ТГ, Рахівський район, Закарпатська область',
      shaboTitle: 'Шабо',
      shaboMeta: 'Білгород-Дністровський район, Одеська область',
      read: 'Читати кейс',
    },
    growth: {
      title: 'Де росте бізнес',
      lead: 'Рейтинг громад за темпами зростання юридичних осіб і ФОП у бізнес-реєстрі Держстату, 2021→2025.',
    },
    jobs: {
      title: 'Вакансії та зарплати',
      lead: 'Місячні медіанні зарплати та вакансії work.ua по містах України.',
    },
    retail: {
      title: 'Магазини мереж',
      lead: 'Зміни магазинів мереж у OpenStreetMap та скориговані оцінки ATB по областях, 2021→2026.',
    },
    horeca: {
      title: 'Заклади харчування',
      lead: 'KVED I (їжа та розміщення) у бізнес-реєстрі та точки харчування в OSM.',
    },
    data: {
      title: 'Дані',
      lead: 'Огляд наборів SDMX Держстату з перевіреною деталізацією за КАТОТТГ. Найнижчий рівень для більшості показників — громада або район, не окреме село.',
      kaggleLead:
        'Відкритий набір з рейтингами громад (бізнес-реєстр, композитні сигнали) на Kaggle:',
      catalogTitle: 'Каталог dataflow',
      chartTitle: 'Зареєстровані юридичні особи в Ясіняській громаді',
      downloadJson: 'Завантажити JSON',
    },
    methodology: {
      title: 'Методологія',
      lead: 'Звідки цифри, як ми працюємо з SDMX і чого поки не вистачає в відкритих даних.',
    },
    chart: {
      source: 'Джерело',
      fetched: 'Вивантажено',
      data: 'Дані',
    },
  },
  en: {
    siteName: 'rebuild',
    siteTagline: 'How Ukrainian villages and hromadas develop',
    nav: {
      home: 'Home',
      cases: 'Cases',
      growth: 'Business growth',
      jobs: 'Jobs & salaries',
      retail: 'Chain stores',
      horeca: 'Food service',
      data: 'Data',
      methodology: 'Methodology',
    },
    langSwitch: 'Українська',
    footer: 'A research site on the development of Ukrainian villages and territorial hromadas.',
    license: 'Code — MIT. Figures — from cited sources; republish with attribution.',
    home: {
      title: 'Where villages grow while others empty out',
      lead: 'Public research in charts and verified sources: tourism and economic stories of selected villages, plus what Derzhstat SDMX data can support at hromada and oblast level.',
      ctaCases: 'Browse cases',
      ctaData: 'SDMX data atlas',
      ctaGrowth: 'Where business grows',
      ctaJobs: 'Jobs & salaries',
      teaserGrowthTitle: 'Where business grows',
      teaserGrowthText:
        'Hromada ranking by legal entities and FOP growth 2021→2025: top 20, small hromadas, Yasinia highlighted.',
      teaserJobsTitle: 'Jobs & salaries',
      teaserJobsText: 'Monthly work.ua medians by city: advertised salaries and vacancy counts.',
      ctaRetail: 'Chain stores',
      ctaHoreca: 'Food service',
      teaserRetailTitle: 'Chain stores',
      teaserRetailText: 'OSM plus official ATB lists: where chain stores grew 2021→2026.',
      teaserHorecaTitle: 'Food service',
      teaserHorecaText: 'Derzhstat KVED I and OSM food points by oblast and hromada.',
      featuredChartTitle: 'Yasinia hromada: registered legal entities',
      featuredChartNote:
        'Kvasy is part of Yasinia hromada. Annual Statistical Business Register indicator at hromada level.',
    },
    cases: {
      title: 'Cases',
      lead: 'First stories: mountain village Kvasy in Zakarpattia and Shabo in Odesa oblast. Every claim is linked; we do not publish figures without a source.',
      kvasyTitle: 'Kvasy',
      kvasyMeta: 'Yasinia hromada, Rakhiv rayon, Zakarpattia oblast',
      shaboTitle: 'Shabo',
      shaboMeta: 'Bilhorod-Dnistrovskyi rayon, Odesa oblast',
      read: 'Read case',
    },
    growth: {
      title: 'Where business grows',
      lead: 'Hromada ranking by legal-entity and FOP growth in Derzhstat business register, 2021→2025.',
    },
    jobs: {
      title: 'Jobs & salaries',
      lead: 'Monthly work.ua median salaries and vacancy counts for Ukrainian cities.',
    },
    retail: {
      title: 'Chain stores',
      lead: 'OpenStreetMap chain store change and ATB-corrected oblast estimates, 2021→2026.',
    },
    horeca: {
      title: 'Food service',
      lead: 'KVED section I in the business register and OSM food amenity points.',
    },
    data: {
      title: 'Data',
      lead: 'Overview of Derzhstat SDMX datasets with verified KATOTTG granularity. For most indicators the lowest level is hromada or rayon, not individual villages.',
      kaggleLead: 'Open hromada growth rankings (business register, composite signals) on Kaggle:',
      catalogTitle: 'Dataflow catalog',
      chartTitle: 'Registered legal entities in Yasinia hromada',
      downloadJson: 'Download JSON',
    },
    methodology: {
      title: 'Methodology',
      lead: 'Where numbers come from, how we use SDMX, and known gaps in open data.',
    },
    chart: {
      source: 'Source',
      fetched: 'Fetched',
      data: 'Data',
    },
  },
} as const;

export type UiStrings = (typeof ui)[Lang];

export function getUi(lang: Lang): UiStrings {
  return ui[lang];
}
