import { HANDOFF, SHARE } from '../data/nav.js';
import { encodeHandoff } from '../handoff.js';
import { esc } from './scenes.js';
import { sharePage } from './share.js';

// Share-the-current-state button for the scoreboard, draw and Pico Bowl
// organizer. It looks like any share button; tapping it first explains what
// the link does, then shares picobo.net/#<route>?s=<state>.
const ROUTE = { score: 'score', draw: 'draw', tourney: 'picobowl/manage' };
export const routeOf = kind => ROUTE[kind];

export const handoffButtonHtml = () =>
  `<button class="share-btn handoff-btn" type="button" aria-label="${esc(HANDOFF.aria)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg><span>${esc(SHARE.label)}</span></button>`;

// The link is built while the sheet is open, so tapping 分享連結 can open the
// share sheet straight away (browsers only allow it right after a tap).
export function openHandoff(kind, data) {
  const url = encodeHandoff(kind, data).then(code => `${SHARE.url}#${ROUTE[kind]}?s=${code}`);
  let dlg = document.querySelector('.handoff-sheet');
  if (!dlg) {
    dlg = document.createElement('dialog');
    dlg.className = 'install-sheet handoff-sheet';
    document.body.append(dlg);
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }
  const t = HANDOFF.sheet[kind];
  dlg.innerHTML = `<b>${esc(t.title)}</b><p>${esc(t.body)}</p><p class="muted small">${esc(HANDOFF.note)}</p>
    <div class="toolbar"><button class="btn btn-primary" type="button" data-go>${esc(HANDOFF.go)}</button><button class="btn btn-ghost" type="button" data-cancel>${esc(HANDOFF.cancel)}</button></div>`;
  dlg.querySelector('[data-cancel]').addEventListener('click', () => dlg.close());
  dlg.querySelector('[data-go]').addEventListener('click', async () => {
    dlg.close();
    await sharePage(HANDOFF.titles[kind], await url);
  });
  dlg.showModal();
}
