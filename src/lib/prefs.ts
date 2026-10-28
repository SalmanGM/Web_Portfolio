export const STORAGE_KEY = 'sb-portfolio-v6';

export type Theme = 'dark' | 'light';
export type Lang = 'en' | 'ar';

export function savePrefs(theme: Theme, lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, lang }));
  } catch {}
}
