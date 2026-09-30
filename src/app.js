import { mountRules } from './ui/rules.js';
import { mountFormats } from './ui/formats.js';
import { mountScoreboard } from './ui/scoreboard.js';
import { mountDraw } from './ui/draw.js';
import { autoHideTopbar } from './ui/topbar.js';
import { RULEBOOK } from './data/rules.js';

const ROUTES = ['rules', 'formats', 'score', 'draw'];

// Hash shape: #<route> or #<route>/<sub>, e.g. #rules/kitchen. Links from v1
// used #rules-<id>; those are rewritten in place.
function parseHash() {
  let h = location.hash.replace(/^#/, '');
  const legacy = h.match(/^rules-(.+)$/);
  if (legacy) {
    h = legacy[1] === 'formats' ? 'formats' : `rules/${legacy[1]}`;
    history.replaceState(null, '', `#${h}`);
  }
  const [top, sub = ''] = h.split('/');
  return ROUTES.includes(top) ? { route: top, sub } : { route: 'rules', sub: '' };
}

const topbar = autoHideTopbar(document.querySelector('.topbar'));
const rules = mountRules(document.getElementById('view-rules'));
mountFormats(document.getElementById('view-formats'));
mountScoreboard(document.getElementById('view-score'));
mountDraw(document.getElementById('view-draw'));
document.getElementById('footer').textContent = `正統規則依據 ${RULEBOOK}。趣味玩法各球場做法不同，開打前先講好。`;

function show() {
  const { route, sub } = parseHash();
  for (const r of ROUTES) document.getElementById(`view-${r}`).hidden = r !== route;
  for (const tab of document.querySelectorAll('.tab')) {
    tab.setAttribute('aria-selected', String(tab.dataset.route === route));
  }
  if (route === 'rules') rules.show(sub);
  window.scrollTo({ top: 0 });
  topbar.show();
}

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => { location.hash = tab.dataset.route; });
}
window.addEventListener('hashchange', show);
show();
