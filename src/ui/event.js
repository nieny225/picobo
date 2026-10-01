import { PICOBOWL as E } from '../data/event.js';
import { esc, enTag } from './scenes.js';
import { shareButtonHtml, sharePage } from './share.js';
import { renderManage } from './tournament.js';

// Pico Bowl tournament page (#picobowl) and the organizer screen
// (#picobowl/manage, not linked from anywhere). Reachable by URL even while
// the home card says Coming soon.
export function mountEvent(root) {
  return { show(sub) { if (sub === 'manage') renderManage(root); else renderInfo(root); } };
}

function renderInfo(root) {
  const list = items => `<ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const signup = E.signupUrl
    ? `<a class="btn btn-primary btn-block" href="${esc(E.signupUrl)}" target="_blank" rel="noopener">${esc(E.signupTitle)}</a>`
    : `<button class="btn btn-block" type="button" disabled>${esc(E.signupPending)}</button>`;
  root.innerHTML = `
    <nav class="rule-top"><span class="event-kicker">${esc(E.tagline)}</span>${shareButtonHtml()}</nav>
    <section class="event-hero">
      <h2 class="event-name">${esc(E.name)}</h2>
      <dl class="event-facts">${E.facts.map(f => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>
      <p class="event-draft"><span class="rule-no">${esc(E.draft)}</span>${esc(E.draftNote)}</p>
    </section>
    <article class="card">
      <h3>${esc(E.divisionsTitle)}</h3>
      <div class="event-divisions">${E.divisions.map(d => `<div><b>${esc(d.name)}${enTag(d.en)}</b><span>${esc(d.note)}</span></div>`).join('')}</div>
      <p class="muted small">${esc(E.divisionsNote)}</p>
    </article>
    <article class="card"><h3>${esc(E.formatTitle)}</h3>${list(E.format)}</article>
    <article class="card"><h3>${esc(E.dayTitle)}</h3>
      <dl class="event-day">${E.day.map(d => `<div><dt>${esc(d.when)}</dt><dd>${esc(d.what)}</dd></div>`).join('')}</dl>
    </article>
    <article class="card"><h3>${esc(E.scoringTitle)}</h3>${list(E.scoring)}
      <div class="event-links">${E.rulesLinks.map(l => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join('')}</div>
    </article>
    <article class="card"><h3>${esc(E.rankingTitle)}</h3><ol>${E.ranking.map(r => `<li>${esc(r)}</li>`).join('')}</ol></article>
    <article class="card"><h3>${esc(E.signupTitle)}</h3>${signup}</article>`;
  root.querySelector('.share-btn')?.addEventListener('click', () => sharePage(E.name));
}

// Home-page card: a link once the event opens, a Coming soon tile before that.
export function eventCardHtml() {
  const inner = `<span class="event-card-tag">${esc(E.open ? E.tagline : E.comingSoon)}</span><b>${esc(E.name)}</b><span>${esc(E.cardDesc)}</span>`;
  return E.open
    ? `<a class="event-card" href="#picobowl">${inner}</a>`
    : `<div class="event-card is-soon" aria-disabled="true">${inner}</div>`;
}
