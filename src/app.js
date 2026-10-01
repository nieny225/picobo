import { mountHome } from './ui/home.js';
import { mountRules } from './ui/rules.js';
import { mountFormats } from './ui/formats.js';
import { mountScoreboard } from './ui/scoreboard.js';
import { mountDraw } from './ui/draw.js';
import { mountEvent } from './ui/event.js';
import { autoHideTopbar } from './ui/topbar.js';
import { mountThemeToggle } from './ui/theme.js';
import { registerServiceWorker, mountInstallButton } from './ui/install.js';
import { RULEBOOK } from './data/rules.js';

const ROUTES = ['home', 'rules', 'formats', 'score', 'draw', 'picobowl'];
// Fun formats live under the rules tab; the Pico Bowl page under home.
const TAB_OF = { formats: 'rules', picobowl: 'home' };

// Hash shape: #<route> or #<route>/<sub>, e.g. #rules/kitchen. Links from v1
// used #rules-<id>; those are rewritten in place.
function parseHash() {
  let h = location.hash.replace(/^#/, '');
  const legacy = h.match(/^rules-(.+)$/);
  if (legacy) {
    h = legacy[1] === 'formats' ? 'rules' : `rules/${legacy[1]}`;
    history.replaceState(null, '', `#${h}`);
  }
  // The formats index moved into the rules index.
  if (h === 'formats') { h = 'rules'; history.replaceState(null, '', '#rules'); }
  const [top, sub = ''] = h.split('/');
  return ROUTES.includes(top) ? { route: top, sub } : { route: 'home', sub: '' };
}

const topbar = autoHideTopbar(document.querySelector('.topbar'));
mountThemeToggle(document.getElementById('theme-toggle'));
registerServiceWorker();
mountInstallButton(document.getElementById('install-btn'));
mountHome(document.getElementById('view-home'));
const rules = mountRules(document.getElementById('view-rules'));
const formats = mountFormats(document.getElementById('view-formats'));
mountScoreboard(document.getElementById('view-score'));
mountDraw(document.getElementById('view-draw'));
const event = mountEvent(document.getElementById('view-picobowl'));
document.getElementById('footer').textContent = `正統規則依據 ${RULEBOOK}。趣味玩法各球場做法不同，開打前先講好。`;

function show() {
  const { route, sub } = parseHash();
  for (const r of ROUTES) document.getElementById(`view-${r}`).hidden = r !== route;
  // CSS keys off the current tab, e.g. phones drop the top bar under 規則.
  document.documentElement.dataset.tab = TAB_OF[route] ?? route;
  for (const tab of document.querySelectorAll('.tab')) {
    tab.setAttribute('aria-selected', String(tab.dataset.route === (TAB_OF[route] ?? route)));
  }
  if (route === 'rules') rules.show(sub);
  if (route === 'formats') formats.show(sub);
  if (route === 'picobowl') event.show(sub);
  window.scrollTo({ top: 0 });
  topbar.show();
}

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => { location.hash = tab.dataset.route; });
}
window.addEventListener('hashchange', show);
show();
