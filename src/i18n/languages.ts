export const languages = { ar: 'العربية', en: 'English' } as const;
export const defaultLang = 'ar';
export type Lang = keyof typeof languages;
export const rtlLanguages: Lang[] = ['ar'];
export function isRtl(lang: Lang): boolean { return rtlLanguages.includes(lang); }
export function getLanguageDir(lang: Lang): 'rtl' | 'ltr' { return isRtl(lang) ? 'rtl' : 'ltr'; }
