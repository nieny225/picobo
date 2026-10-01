import { esc } from './scenes.js';

// Names typed before, offered as suggestions in every name field through one
// shared <datalist>. Kept on this device only, most recent first. The browser's
// own autofill is turned off on these fields so only this list shows.
const KEY = 'picobo.names';
const MAX = 40;
// Placeholder names the forms fill in by themselves; never worth suggesting.
const DEFAULTS = new Set(['甲1', '甲2', '乙1', '乙2']);

export function knownNames() {
  try { const list = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(list) ? list.filter(n => typeof n === 'string') : []; } catch { return []; }
}

export function rememberNames(names) {
  const fresh = names.map(n => String(n).trim()).filter(n => n && !DEFAULTS.has(n));
  if (fresh.length === 0) return;
  const list = [...new Set([...fresh, ...knownNames()])].slice(0, MAX);
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage unavailable: no suggestions next time */ }
}

// Rewrites the shared datalist; call before showing a form with name fields.
export function syncNameList() {
  let dl = document.getElementById('known-names');
  if (!dl) {
    dl = document.createElement('datalist');
    dl.id = 'known-names';
    document.body.append(dl);
  }
  dl.innerHTML = knownNames().map(n => `<option value="${esc(n)}"></option>`).join('');
}

// Attributes for a name input that uses the list.
export const NAME_INPUT = 'list="known-names" autocomplete="off" autocapitalize="words"';
