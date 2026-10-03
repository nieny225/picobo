import { HANDOFF, SHARE } from '../data/nav.js';
import { encodeHandoff } from '../handoff.js';
import { esc } from './scenes.js';
import { sharePage } from './share.js';
import { todayGamesLink, shareTodayGames } from './record.js';
import { LINK_ICON } from './me.js';

// Share-the-current-state button for the scoreboard, draw and Pico Bowl
// organizer. It looks like any share button; tapping it first explains what
// the link does, then shares picobo.net/#<route>?s=<state>.
const ROUTE = { score: 'score', draw: 'draw', tourney: 'picobowl/manage', games: 'me' };
export const routeOf = kind => ROUTE[kind];

export const handoffButtonHtml = () =>
  `<button class="share-btn handoff-btn" type="button" aria-label="${esc(HANDOFF.aria)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg><span class="sr-only">${esc(SHARE.label)}</span></button>`;

// The link is built while the sheet is open, so tapping 分享連結 can open the
// share sheet straight away (browsers only allow it right after a tap).
// With { games: true } (抽籤) the sheet offers two links: today's results to
// the players (戰績連結), or the whole state to the next organizer.
export function openHandoff(kind, data, { games = false } = {}) {
  const url = encodeHandoff(kind, data).then(code => `${SHARE.url}#${ROUTE[kind]}?s=${code}`);
  let dlg = document.querySelector('.handoff-sheet');
  if (!dlg) {
    dlg = document.createElement('dialog');
    dlg.className = 'install-sheet handoff-sheet';
    document.body.append(dlg);
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }
  const t = HANDOFF.sheet[kind], c = HANDOFF.choose;
  dlg.innerHTML = games
    ? `<b>${esc(c.title)}</b>
      <section class="handoff-choice"><b>${esc(c.games.title)}</b><p>${esc(c.games.body)}</p><button class="btn btn-primary btn-block icon-btn" type="button" data-games>${LINK_ICON}<span>${esc(c.games.go)}</span></button></section>
      <section class="handoff-choice"><b>${esc(c.handoff.title)}</b><p>${esc(c.handoff.body)}</p><p class="muted small">${esc(HANDOFF.note)}</p><button class="btn btn-block" type="button" data-go>${esc(HANDOFF.go)}</button></section>
      <div class="toolbar"><button class="btn btn-ghost" type="button" data-cancel>${esc(HANDOFF.cancel)}</button></div>`
    : `<b>${esc(t.title)}</b><p>${esc(t.body)}</p><p class="muted small">${esc(HANDOFF.note)}</p>
    <div class="toolbar"><button class="btn btn-primary" type="button" data-go>${esc(HANDOFF.go)}</button><button class="btn btn-ghost" type="button" data-cancel>${esc(HANDOFF.cancel)}</button></div>`;
  if (games) {
    const link = todayGamesLink();
    dlg.querySelector('[data-games]').addEventListener('click', () => { dlg.close(); shareTodayGames(link); });
  }
  dlg.querySelector('[data-cancel]').addEventListener('click', () => dlg.close());
  dlg.querySelector('[data-go]').addEventListener('click', async () => {
    dlg.close();
    await sharePage(HANDOFF.titles[kind], await url);
  });
  dlg.showModal();
}
