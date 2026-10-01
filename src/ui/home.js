import { renderCourt } from '../court.js';
import { HOME } from '../data/home.js';
import { esc, enTag } from './scenes.js';
import { eventCardHtml } from './event.js';

// "Pick one" is the serving player, "pick a place" the lit service box.
const HERO_SCENE = {
  alt: HOME.courtAlt,
  highlight: ['serviceBox:far:right'],
  players: [
    { team: 'A', side: 'near', pos: 'right', label: '', depth: 'behind', serving: true },
    { team: 'B', side: 'far', pos: 'right', label: '', dim: true },
  ],
  ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] },
};

export function mountHome(root) {
  const [lead, ...rest] = HOME.entries;
  const entry = (e, cls) => `<a class="home-entry ${cls}" href="#${e.route}">
    <b>${esc(e.title)}${enTag(e.en)}</b><span>${esc(e.desc)}</span></a>`;
  root.innerHTML = `
    <section class="home-hero">
      <h2 class="home-slogan">${HOME.slogan.map((l, i) => `<span${i === HOME.slogan.length - 1 ? ' class="mark"' : ''}>${esc(l)}</span>`).join('')}</h2>
      <div class="home-court court-wrap"></div>
      <p class="intro">${esc(HOME.intro)}</p>
    </section>
    ${eventCardHtml()}
    <nav class="home-entries" aria-label="${esc(HOME.entriesLabel)}">${entry(lead, 'lead')}${rest.map(e => entry(e, '')).join('')}</nav>`;
  renderCourt(root.querySelector('.home-court'), HERO_SCENE);
}
