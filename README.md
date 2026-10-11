# rebuild

Дослідницький сайт про розвиток українських сіл і територіальних громад (українська за замовчуванням, опційно англійська).

**Live:** https://mikerudine.github.io/rebuild/

## Stack

- [Astro](https://astro.build/) (static)
- [Observable Plot](https://observablehq.com/plot/) for charts
- Derzhstat SDMX data fetched at build time (`scripts/fetch-sdmx.ts`)

## Development

```bash
npm install
npm run dev
```

Build (runs SDMX fetch first):

```bash
npm run build
```

Site is served under `/rebuild/` on GitHub Pages (`astro.config.mjs` `base`).

## License

MIT for site code. Statistical figures remain subject to their original sources (Derzhstat, cited media).
