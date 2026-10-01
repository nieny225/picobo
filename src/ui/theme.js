import { THEME } from '../data/nav.js';
import { esc } from './scenes.js';

// Light / dark toggle in the top bar. The page is light unless dark was chosen
// here; the choice is kept in localStorage and set as data-theme on <html>
// (an inline script in index.html applies it before first paint). The browser
// bar colour follows the toggle.
const KEY = 'picobo.theme';
const BAR = { light: '#fffbe8', dark: '#151510' };
const ICON = {
  // Shown in light mode: tap for dark.
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  // Shown in dark mode: tap for light.
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
};

const current = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

function paint(btn) {
  const dark = current() === 'dark';
  const label = dark ? THEME.toLight : THEME.toDark;
  btn.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${dark ? ICON.sun : ICON.moon}</svg>`;
  btn.setAttribute('aria-label', label);
  btn.title = label;
  if (document.documentElement.dataset.theme) {
    for (const m of document.querySelectorAll('meta[name="theme-color"]')) m.content = BAR[current()];
  }
}

export function mountThemeToggle(btn) {
  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch { /* storage unavailable: still switches for this visit */ }
    paint(btn);
  });
  paint(btn);
  btn.hidden = false;
}
