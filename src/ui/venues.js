import { VENUES, VENUES_PAGE as V } from '../data/venues.js';
import { mapUrl } from '../meetup.js';
import { esc } from './scenes.js';
import { shareButtonHtml, sharePage } from './share.js';

const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);

// A booking contact as a link: phone dials, LINE and web open in a new tab.
function bookingHref(b) {
  if (b.type === 'phone') return `tel:${b.value.replace(/[^\d+]/g, '')}`;
  if (b.type === 'whatsapp') return `https://wa.me/${b.value.replace(/\D/g, '')}`;
  if (b.type === 'line') return b.value.startsWith('http') ? b.value : `https://line.me/R/ti/p/${encodeURIComponent(b.value)}`;
  if (b.type === 'url') return b.value;
  throw new Error(`venues: unknown booking type ${b.type}`);
}

function venueCard(v) {
  const link = (href, label, cls = 'btn') => `<a class="${cls}" href="${esc(href)}"${href.startsWith('#') || href.startsWith('tel:') ? '' : ' target="_blank" rel="noopener"'}>${esc(label)}</a>`;
  return `<article class="card venue" id="venue-${esc(v.id)}">
    <h3>${esc(v.name)}</h3>
    <div class="format-meta"><span>${esc(V.settings[v.setting] ?? '')}</span>${v.courts ? `<span>${esc(fill(V.courts, { n: v.courts }))}</span>` : ''}</div>
    ${v.address ? `<p>${esc(v.address)}</p>` : ''}
    <dl class="event-facts">
      ${v.fee ? `<div><dt>${esc(V.fee)}</dt><dd>${esc(v.fee)}</dd></div>` : ''}
      ${v.hours ? `<div><dt>${esc(V.hours)}</dt><dd>${esc(v.hours)}</dd></div>` : ''}
    </dl>
    ${v.note ? `<p class="muted small">${esc(v.note)}</p>` : ''}
    <div class="meetup-actions">
      ${(v.booking ?? []).map(b => link(bookingHref(b), b.label || V.booking[b.type])).join('')}
      ${link(mapUrl({ place: v.name, address: v.address }), V.map)}
      ${link(`#meetup?venue=${encodeURIComponent(v.id)}`, V.meetup, 'btn btn-primary')}
    </div>
  </article>`;
}

// Courts directory (#venues), grouped by city in data order.
export function mountVenues(root) {
  const cities = [...new Set(VENUES.map(v => v.city))];
  root.innerHTML = `
    <div class="section-head"><div class="head-row"><h2>${esc(V.title)}</h2>${shareButtonHtml()}</div><p class="intro">${esc(V.intro)}</p><p class="muted small">${esc(V.disclaimer)}</p></div>
    ${VENUES.length === 0 ? `<article class="card"><p>${esc(V.empty)}</p></article>`
    : cities.map(c => `<section class="rule-group"><h3>${esc(c)}</h3>${VENUES.filter(v => v.city === c).map(venueCard).join('')}</section>`).join('')}`;
  root.querySelector('.share-btn').addEventListener('click', () => sharePage(V.title));
}
