import { defaultLang, type Lang } from './languages';
import ar from './ar.json';
import en from './en.json';

const translations = { ar, en };

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    const keys = key.split('.');
    
    let current: any = translations[lang];
    for (const k of keys) {
      if (current === undefined || current === null) break;
      current = current[k];
    }
    
    if (typeof current === 'string') return current;
    
    // Fallback to en
    let fallbackEn: any = translations['en'];
    for (const k of keys) {
      if (fallbackEn === undefined || fallbackEn === null) break;
      fallbackEn = fallbackEn[k];
    }
    if (typeof fallbackEn === 'string') return fallbackEn;
    
    // Fallback to ar (default)
    let fallbackAr: any = translations['ar'];
    for (const k of keys) {
      if (fallbackAr === undefined || fallbackAr === null) break;
      fallbackAr = fallbackAr[k];
    }
    if (typeof fallbackAr === 'string') return fallbackAr;
    
    return key;
  };
}

export function getLocalizedPath(lang: Lang, path: string) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${cleanPath === '/' ? '/' : cleanPath}`;
}
