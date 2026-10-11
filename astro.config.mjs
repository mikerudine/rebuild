import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mikerudine.github.io',
  base: '/rebuild/',
  output: 'static',
  i18n: {
    defaultLocale: 'uk',
    locales: ['uk', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
