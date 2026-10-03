// Which language the page speaks: zh-TW (繁中), zh-CN (简中) or en. Picked
// once at load: ?lang= in the address (saved, then dropped from the URL),
// else the saved choice, else the browser's languages. Node (tests) and any
// failure get zh-TW. Switching saves and reloads, since copy is module-level.
export const LANGS = ['zh-TW', 'zh-CN', 'en'];
// Languages whose copy is in src/data/<lang>/; anything else falls back to zh-TW.
export const AVAILABLE = ['zh-TW'];
const KEY = 'picobo.lang';
export const HTML_LANG = { 'zh-TW': 'zh-Hant-TW', 'zh-CN': 'zh-Hans', en: 'en' };

// Browser language tags to one of ours, first match wins: Traditional
// regions and scripts to zh-TW, any other Chinese to zh-CN, English to en;
// other languages are skipped, and a list with none of ours gets English.
export function fromBrowser(tags = []) {
  for (const raw of tags) {
    const t = String(raw).toLowerCase();
    if (t.startsWith('zh')) return /hant|-tw|-hk|-mo/.test(t) ? 'zh-TW' : 'zh-CN';
    if (t.startsWith('en')) return 'en';
  }
  return tags.length ? 'en' : 'zh-TW';
}

function pick() {
  if (typeof window === 'undefined') return 'zh-TW';
  try {
    const url = new URL(location.href);
    const asked = url.searchParams.get('lang');
    if (LANGS.includes(asked)) {
      try { localStorage.setItem(KEY, asked); } catch { /* storage unavailable */ }
      url.searchParams.delete('lang');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
      return asked;
    }
  } catch { /* odd URL: fall through */ }
  try { const saved = localStorage.getItem(KEY); if (LANGS.includes(saved)) return saved; } catch { /* storage unavailable */ }
  return fromBrowser(navigator.languages?.length ? navigator.languages : [navigator.language].filter(Boolean));
}

const picked = pick();
export const LANG = AVAILABLE.includes(picked) ? picked : 'zh-TW';
if (typeof document !== 'undefined') document.documentElement.lang = HTML_LANG[LANG];

export function setLang(l) {
  if (!AVAILABLE.includes(l)) throw new Error(`lang: unknown language ${l}`);
  try { localStorage.setItem(KEY, l); } catch { /* storage unavailable: this visit only */ }
  // Without storage the choice still has to survive the reload.
  const url = new URL(location.href);
  url.searchParams.set('lang', l);
  location.replace(url.pathname + url.search + url.hash);
}
