// Which country's courts the directory shows: 'sg' (Singapore) or 'tw'
// (Taipei for now). The saved choice wins, else the phone's time zone
// (Asia/Taipei → tw), else sg. Switching saves and tells the open views
// (event 'picobo:country' on window); no reload, the copy doesn't change.
export const COUNTRIES = ['sg', 'tw'];
const KEY = 'picobo.country';

export const fromTimeZone = tz => (tz === 'Asia/Taipei' ? 'tw' : 'sg');

let chosen = null; // this visit's pick, for when storage throws

export function getCountry() {
  if (chosen) return chosen;
  try { const saved = localStorage.getItem(KEY); if (COUNTRIES.includes(saved)) return saved; } catch { /* storage unavailable */ }
  try { return fromTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch { return 'sg'; }
}

export function setCountry(c) {
  if (!COUNTRIES.includes(c)) throw new Error(`country: unknown ${c}`);
  chosen = c;
  try { localStorage.setItem(KEY, c); } catch { /* storage unavailable: this visit only */ }
  window.dispatchEvent(new CustomEvent('picobo:country', { detail: c }));
}
