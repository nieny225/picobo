import { mountHome } from './ui/home.js';
import { mountRules } from './ui/rules.js';
import { mountScoreboard } from './ui/scoreboard.js';
import { mountDraw } from './ui/draw.js';
import { mountEvent } from './ui/event.js';
import { mountMeetup } from './ui/meetup.js';
import { mountVenues } from './ui/venues.js';
import { autoHideTopbar } from './ui/topbar.js';
import { mountThemeToggle } from './ui/theme.js';
import { registerServiceWorker, mountInstallButton } from './ui/install.js';
import { decodeHandoff } from './handoff.js';
import { routeOf } from './ui/handoff.js';
import { toast } from './ui/share.js';
import { HANDOFF, SCORE_SETUP } from './data/nav.js';
import { RULEBOOK } from './data/rules.js';

const ROUTES = ['home', 'rules', 'formats', 'score', 'draw', 'picobowl', 'meetup', 'venues'];
// Fun formats live under the rules tab; Pico Bowl, 揪團 and 找場地 under home.
const TAB_OF = { formats: 'rules', picobowl: 'home', meetup: 'home', venues: 'home' };

// Hash shape: #<route> or #<route>/<sub>, e.g. #rules/kitchen. Links from v1
// used #rules-<id>; those are rewritten in place.
function parseHash() {
  // A hand-over link carries the state after '?': #score?s=...
  let h = location.hash.replace(/^#/, '').split('?')[0];
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
const scoreboard = mountScoreboard(document.getElementById('view-score'));
const draw = mountDraw(document.getElementById('view-draw'));
const event = mountEvent(document.getElementById('view-picobowl'));
const meetup = mountMeetup(document.getElementById('view-meetup'));
mountVenues(document.getElementById('view-venues'));
document.getElementById('footer').textContent = `正統規則依據 ${RULEBOOK}。趣味玩法各球場做法不同，開打前先講好。`;

function show() {
  const { route, sub } = parseHash();
  // Fun formats (#formats/<id>) are pages of the rules view.
  const view = route === 'formats' ? 'rules' : route;
  for (const r of ROUTES) if (r !== 'formats') document.getElementById(`view-${r}`).hidden = r !== view;
  // CSS keys off the current tab, e.g. phones drop the top bar under 規則.
  document.documentElement.dataset.tab = TAB_OF[route] ?? route;
  for (const tab of document.querySelectorAll('.tab')) {
    tab.setAttribute('aria-selected', String(tab.dataset.route === (TAB_OF[route] ?? route)));
  }
  if (route === 'rules') rules.show(sub);
  if (route === 'formats') rules.show(`formats/${sub}`);
  if (route === 'picobowl') event.show(sub);
  // 揪團 reads its own query: a shared card (?s=) or a court to start from.
  if (route === 'meetup') meetup.show(location.hash.split('?')[1] ?? '');
  // #score?play=…&scoring=… from a rule page: preset the mode, then drop the query.
  const query = new URLSearchParams(location.hash.split('?')[1] ?? '');
  if (route === 'score' && query.has('play')) {
    if (!scoreboard.preset(query.get('play'), query.get('scoring'))) toast(SCORE_SETUP.busy);
    history.replaceState(null, '', '#score');
  }
  window.scrollTo({ top: 0 });
  topbar.show();
}

// Opening a hand-over link: load the state into the matching tool (asking
// first if this phone already has one going), then drop it from the URL.
async function receiveHandoff() {
  const code = new URLSearchParams(location.hash.split('?')[1] ?? '').get('s');
  // A 揪團卡 link is only shown, never loaded into a tool (see ui/meetup.js).
  if (!code || location.hash.startsWith('#meetup')) return;
  let payload;
  try { payload = await decodeHandoff(code); } catch { toast(HANDOFF.broken); history.replaceState(null, '', location.hash.split('?')[0]); return; }
  const tool = { score: scoreboard, draw, tourney: event }[payload.kind];
  const kind = HANDOFF.kinds[payload.kind];
  history.replaceState(null, '', `#${routeOf(payload.kind)}`);
  if (tool.hasState() && !confirm(HANDOFF.confirm.replace(/\{kind\}/g, kind))) { show(); return; }
  try { tool.receive(payload.data); toast(HANDOFF.loaded); } catch { toast(HANDOFF.broken); }
  show();
}
window.addEventListener('hashchange', receiveHandoff);
receiveHandoff();

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => { location.hash = tab.dataset.route; });
}
window.addEventListener('hashchange', show);
show();
