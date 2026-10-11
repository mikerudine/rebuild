import type { Lang } from './ui';
import { defaultLang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first === 'en') return 'en';
  return defaultLang;
}

/** Path with Astro `base` (/rebuild/) already reflected in url.pathname from request. */
export function localizedPath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (lang === 'en') {
    return `${base}/en${clean === '/' ? '' : clean}`;
  }
  return `${base}${clean === '/' ? '/' : clean}`;
}

export function switchLangPath(url: URL, target: Lang): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  let path = url.pathname;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || '/';
  }
  if (path.startsWith('/en')) {
    path = path.slice(3) || '/';
  }
  return localizedPath(path, target);
}
