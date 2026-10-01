import { HANDOFF, SHARE } from '../data/nav.js';
import { encodeHandoff } from '../handoff.js';
import { esc } from './scenes.js';
import { sharePage } from './share.js';

// The 交接 button and what it shares: picobo.net/#<route>?s=<state>.
const ROUTE = { score: 'score', draw: 'draw', tourney: 'picobowl/manage' };
export const routeOf = kind => ROUTE[kind];

export const handoffButtonHtml = () =>
  `<button class="share-btn handoff-btn" type="button" aria-label="${esc(HANDOFF.aria)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13M13 7l5 5-5 5M20 4v16"/></svg><span>${esc(HANDOFF.button)}</span></button>`;

export async function shareHandoff(kind, data) {
  const code = await encodeHandoff(kind, data);
  await sharePage(HANDOFF.titles[kind], `${SHARE.url}#${ROUTE[kind]}?s=${code}`);
}
