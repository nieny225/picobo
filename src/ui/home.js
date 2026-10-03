import { HOME } from '../data/home.js';
import { esc, enTag } from './scenes.js';
import { eventCardHtml } from './event.js';
import { MEETUP } from '../data/meetup.js';
import { homeMeCardHtml } from './me.js';

// Slogan "Pick a day, pick a place, picobo." (set a time, find a court, play).
export function mountHome(root) {
  // 揪團 stays reachable by URL but has no entry card until it opens.
  const [lead, ...rest] = HOME.entries.filter(e => e.route && (e.route !== 'meetup' || MEETUP.open));
  // An entry with `href` (the partner form) opens outside Picobo, in a new tab,
  // as a slim row under the tool cards.
  const outside = HOME.entries.filter(e => e.href).map(e => `<a class="home-partner" href="${esc(e.href)}" target="_blank" rel="noopener">
    <b>${esc(e.title)}${enTag(e.en)}</b><span>${esc(e.desc)}</span><span class="home-partner-go" aria-hidden="true">↗</span></a>`).join('');
  const entry = (e, cls) => `<a class="home-entry ${cls}" href="#${e.route}">
    <b>${esc(e.title)}${enTag(e.en)}</b><span>${esc(e.desc)}</span></a>`;
  root.innerHTML = `
    <section class="home-hero">
      <h2 class="home-slogan">${HOME.slogan.map((l, i) => `<span${i === HOME.slogan.length - 1 ? ' class="mark"' : ''}>${esc(l)}</span>`).join('')}</h2>
      <p class="intro">${esc(HOME.intro)}</p>
    </section>
    <div class="home-me"></div>
    ${eventCardHtml()}
    <nav class="home-entries" aria-label="${esc(HOME.entriesLabel)}">${entry(lead, 'lead')}${rest.map(e => entry(e, '')).join('')}</nav>
    ${outside}`;
  // 我的戰績 this week, once there is something to show; redrawn on each visit.
  const meBox = root.querySelector('.home-me');
  const refresh = () => { meBox.innerHTML = homeMeCardHtml(); };
  refresh();
  return { refresh };
}
