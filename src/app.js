import { mountRules } from './ui/rules.js';
import { mountScoreboard } from './ui/scoreboard.js';
import { mountDraw } from './ui/draw.js';
import { RULEBOOK } from './data/rules.js';

const ROUTES = ['rules', 'score', 'draw'];

function routeFromHash() {
  const h = location.hash.replace(/^#/, '');
  const top = h.split('-')[0];
  return ROUTES.includes(top) ? top : 'rules';
}

function show(route) {
  for (const r of ROUTES) {
    document.getElementById(`view-${r}`).hidden = r !== route;
  }
  for (const tab of document.querySelectorAll('.tab')) {
    tab.setAttribute('aria-selected', String(tab.dataset.route === route));
  }
  const h = location.hash.replace(/^#/, '');
  if (h.startsWith('rules-')) {
    const el = document.getElementById(h);
    if (el) el.scrollIntoView({ block: 'start' });
  } else {
    window.scrollTo({ top: 0 });
  }
}

mountRules(document.getElementById('view-rules'));
mountScoreboard(document.getElementById('view-score'));
mountDraw(document.getElementById('view-draw'));
document.getElementById('footer').textContent = `正統規則依據 ${RULEBOOK}。趣味玩法各球場做法不同，開打前先講好。`;

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => { location.hash = tab.dataset.route; });
}
window.addEventListener('hashchange', () => show(routeFromHash()));
show(routeFromHash());
