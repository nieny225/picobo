import { SETTINGS as T } from '../data/settings.js';
import { LANG, AVAILABLE, setLang } from '../lang.js';
import { esc } from './scenes.js';

// The gear in the top bar: one small sheet for 語言 (繁中｜简中｜English)
// and 外觀 (light｜dark). Theme: the page is light unless dark was chosen; the
// choice is kept in localStorage and set as data-theme on <html> (an inline
// script in index.html applies it before first paint), and the browser bar
// colour follows. Language: src/lang.js saves it and reloads.
const KEY = 'picobo.theme';
const BAR = { light: '#fffbe8', dark: '#151510' };
const GEAR = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';

const theme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
function setTheme(next) {
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(KEY, next); } catch { /* storage unavailable: still switches for this visit */ }
  for (const m of document.querySelectorAll('meta[name="theme-color"]')) m.content = BAR[next];
}

function sheet() {
  const dlg = document.createElement('dialog');
  dlg.className = 'install-sheet settings-sheet';
  const seg = (k, label, options, cur) => `<div class="seg-row"><span class="seg-label">${esc(label)}</span>
    <div class="seg" role="group" aria-label="${esc(label)}">${options.map(([id, text, lang]) =>
      `<button type="button" data-${k}="${id}" aria-pressed="${cur === id}"${lang ? ` lang="${lang}"` : ''}>${esc(text)}</button>`).join('')}</div></div>`;
  const render = () => {
    dlg.innerHTML = `<div class="share-sheet-head"><b>${esc(T.title)}</b><button type="button" class="btn btn-ghost" data-close>${esc(T.close)}</button></div>
      ${seg('lang', T.language, AVAILABLE.map(l => [l, T.langNames[l], l]), LANG)}
      ${AVAILABLE.length > 1 ? `<p class="muted small">${esc(T.langHint)}</p>` : ''}
      ${seg('theme', T.theme, [['light', T.light], ['dark', T.dark]], theme())}`;
  };
  render();
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-close]')) { dlg.close(); return; }
    const l = e.target.closest('[data-lang]');
    if (l && l.dataset.lang !== LANG) { setLang(l.dataset.lang); return; }
    const t = e.target.closest('[data-theme]');
    if (t) { setTheme(t.dataset.theme); render(); }
  });
  dlg.addEventListener('close', () => dlg.remove());
  document.body.append(dlg);
  dlg.showModal();
}

export function mountSettings(btn) {
  btn.innerHTML = GEAR;
  btn.setAttribute('aria-label', T.open);
  btn.title = T.open;
  btn.addEventListener('click', sheet);
  if (document.documentElement.dataset.theme) {
    for (const m of document.querySelectorAll('meta[name="theme-color"]')) m.content = BAR[theme()];
  }
  btn.hidden = false;
}
