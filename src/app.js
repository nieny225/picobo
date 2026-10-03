import { mountHome } from './ui/home.js';
import { mountRules } from './ui/rules.js';
import { mountScoreboard } from './ui/scoreboard.js';
import { mountDraw } from './ui/draw.js';
import { mountEvent } from './ui/event.js';
import { mountMeetup } from './ui/meetup.js';
import { mountVenues } from './ui/venues.js';
import { mountSignup } from './ui/signup.js';
import { mountMe, mountMeButton } from './ui/me.js';
import { receiveGames } from './ui/record.js';
import { autoHideTopbar } from './ui/topbar.js';
import { mountSettings } from './ui/settings.js';
import { registerServiceWorker, mountInstallButton } from './ui/install.js';
import { decodeHandoff } from './handoff.js';
import { routeOf } from './ui/handoff.js';
import { toast } from './ui/share.js';
import { HANDOFF, SCORE_SETUP, DRAW_SCORE, APP_TEXT } from './data/nav.js';
import { RULEBOOK } from './data/rules.js';

const ROUTES = ['home', 'rules', 'formats', 'score', 'draw', 'picobowl', 'meetup', 'venues', 'signup', 'me'];
// Fun formats live under the rules tab, Pico Bowl under home; 報名訊息 and
// 揪團卡 sit with 找場地 under the 揪團 tab; 我的戰績 under home.
const TAB_OF = { formats: 'rules', picobowl: 'home', meetup: 'venues', signup: 'venues', me: 'home' };

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
mountSettings(document.getElementById('theme-toggle'));
registerServiceWorker();
mountInstallButton(document.getElementById('install-btn'));
const home = mountHome(document.getElementById('view-home'));
const rules = mountRules(document.getElementById('view-rules'));
// 抽籤 → 計分板 with a court's four names, and the winner back again.
const scoreboard = mountScoreboard(document.getElementById('view-score'), {
  toDraw(link, winnerIndex) {
    toast(draw.reportWin(link, winnerIndex) ? DRAW_SCORE.recorded.replace('{court}', link.court) : DRAW_SCORE.gone);
    backToCourt = link.court;
    location.hash = '#draw';
  },
});
const draw = mountDraw(document.getElementById('view-draw'), {
  async toScore(link) { if (await scoreboard.fromDraw(link)) location.hash = '#score'; },
});
const event = mountEvent(document.getElementById('view-picobowl'));
const meetup = mountMeetup(document.getElementById('view-meetup'));
const venues = mountVenues(document.getElementById('view-venues'));
const signup = mountSignup(document.getElementById('view-signup'));
const me = mountMe(document.getElementById('view-me'));
mountMeButton(document.getElementById('me-btn'));
document.getElementById('footer').textContent = APP_TEXT.footer.replace('{rulebook}', RULEBOOK);
document.querySelector('.brand h1').textContent = APP_TEXT.brand;
document.title = APP_TEXT.brand;
// Tab labels in the page's language (index.html carries zh-TW for no-JS).
for (const nav of document.querySelectorAll('.tabs, .bottom-nav')) nav.setAttribute('aria-label', APP_TEXT.tabsLabel);
for (const t of document.querySelectorAll('.tab[data-route]')) {
  const label = t.querySelector('span');
  if (label) label.textContent = APP_TEXT.tabs[t.dataset.route];
}

// Coming back to 抽籤 from the scoreboard lands on the courts (the one just
// scored, after 回抽籤), not the roster at the top.
let lastRoute = null, backToCourt = null;

function show() {
  const { route, sub } = parseHash();
  const fromScore = lastRoute === 'score';
  lastRoute = route;
  // Fun formats (#formats/<id>) are pages of the rules view.
  const view = route === 'formats' ? 'rules' : route;
  for (const r of ROUTES) if (r !== 'formats') document.getElementById(`view-${r}`).hidden = r !== view;
  // CSS keys off the current tab, e.g. phones drop the top bar under 規則.
  document.documentElement.dataset.tab = TAB_OF[route] ?? route;
  document.documentElement.dataset.route = route;
  for (const tab of document.querySelectorAll('.tab')) {
    tab.setAttribute('aria-selected', String(tab.dataset.route === (TAB_OF[route] ?? route)));
  }
  if (route === 'rules') rules.show(sub);
  if (route === 'formats') rules.show(`formats/${sub}`);
  if (route === 'picobowl') event.show(sub);
  // 揪團 reads its own query: a shared card (?s=) or a court to start from.
  if (route === 'meetup') meetup.show(location.hash.split('?')[1] ?? '');
  if (route === 'signup') signup.show(location.hash.split('?')[1] ?? '');
  if (route === 'venues') venues.show(sub);
  if (route === 'me') me.show();
  if (route === 'home') home.refresh();
  // #score?play=…&scoring=… from a rule page: preset the mode, then drop the query.
  const query = new URLSearchParams(location.hash.split('?')[1] ?? '');
  if (route === 'score' && query.has('play')) {
    if (!scoreboard.preset(query.get('play'), query.get('scoring'))) toast(SCORE_SETUP.busy);
    history.replaceState(null, '', '#score');
  }
  topbar.show();
  const court = backToCourt;
  backToCourt = null;
  if (route === 'draw' && fromScore && draw.revealGames(court)) return;
  window.scrollTo({ top: 0 });
}

// Opening a hand-over link: load the state into the matching tool (asking
// first if this phone already has one going), then drop it from the URL.
async function receiveHandoff() {
  const code = new URLSearchParams(location.hash.split('?')[1] ?? '').get('s');
  // A 揪團卡 link is only shown, never loaded into a tool (see ui/meetup.js).
  if (!code || location.hash.startsWith('#meetup')) return;
  let payload;
  try { payload = await decodeHandoff(code); } catch { toast(HANDOFF.broken); history.replaceState(null, '', location.hash.split('?')[0]); return; }
  // A 戰績連結 only adds games to 我的戰績; nothing is replaced, so no question.
  if (payload.kind === 'games') {
    history.replaceState(null, '', '#me');
    try { receiveGames(payload.data); } catch { toast(HANDOFF.broken); }
    show();
    return;
  }
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
