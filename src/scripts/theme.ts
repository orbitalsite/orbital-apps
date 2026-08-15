/**
 * ORBITAL — Theme Manager
 * Handles dark/light mode with localStorage persistence.
 * Default theme: 'dark'.
 */

const THEME_KEY = 'orbital-theme';
type Theme = 'light' | 'dark';

function getStoredTheme(): Theme | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(THEME_KEY) as Theme | null;
}

export function getCurrentTheme(): Theme {
  return getStoredTheme() || 'dark';
}

export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  
  // Dispatch custom event for Three.js scenes and other listeners
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
}

export function toggleTheme(): void {
  const current = getCurrentTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
}

/** 
 * Initialize theme — inline in <head> to prevent flash.
 * Default is always 'dark'.
 */
export function initThemeInline(): string {
  return `
    (function() {
      var theme = localStorage.getItem('${THEME_KEY}');
      if (!theme) {
        theme = 'dark';
      }
      document.documentElement.setAttribute('data-theme', theme);
    })();
  `;
}
