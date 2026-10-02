import { VENUES, VENUES_PAGE as V } from '../data/venues.js';
import { mapUrl } from '../meetup.js';
import { MEETUP } from '../data/meetup.js';
import { SIGNUP } from '../data/signup.js';
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
      ${link(`#signup?venue=${encodeURIComponent(v.id)}`, SIGNUP.fromVenue, 'btn btn-primary')}
      ${MEETUP.open ? link(`#meetup?venue=${encodeURIComponent(v.id)}`, V.meetup, 'btn') : ''}
    </div>
  </article>`;
}

// Filters: a search box plus region and kind switches, remembered per device.
const FILTER_KEY = 'picobo.venueFilter';
function loadFilter() {
  try {
    const f = JSON.parse(localStorage.getItem(FILTER_KEY));
    if (f && V.regions.some(r => r.id === f.region) && V.kinds.some(k => k.id === f.kind)) return { q: '', ...f };
  } catch { /* storage unavailable or corrupt */ }
  return { q: '', region: '', kind: '' };
}
function saveFilter({ region, kind }) {
  try { localStorage.setItem(FILTER_KEY, JSON.stringify({ region, kind })); } catch { /* storage unavailable */ }
}
const KIND_TEST = {
  '': () => true,
  dry: v => ['indoor', 'sheltered', 'both'].includes(v.setting),
  free: v => v.fee === V.free,
};
const matches = (v, f) => (!f.region || v.city === f.region) && KIND_TEST[f.kind](v)
  && (!f.q || `${v.name} ${v.address ?? ''}`.toLowerCase().includes(f.q.toLowerCase()));

function barHtml(f) {
  const seg = (k, label, options) => `<div class="seg" role="group" aria-label="${esc(label)}">${options.map(o =>
    `<button type="button" data-vf="${k}" data-v="${esc(o.id)}" aria-pressed="${f[k] === o.id}">${esc(o.label)}</button>`).join('')}</div>`;
  return `<div class="venue-bar">
    <input class="input" type="search" id="venue-q" placeholder="${esc(V.search)}" aria-label="${esc(V.search)}" value="${esc(f.q)}" autocomplete="off">
    ${seg('region', V.regionLabel, V.regions)}
    ${seg('kind', V.kindLabel, V.kinds)}
  </div>`;
}

function listHtml(f) {
  const shown = VENUES.filter(v => matches(v, f));
  // Courts not in the list (a condo court, a friend's club) still get a sign-up message.
  const unlisted = `<p class="muted small venue-unlisted">${esc(V.unlisted)} <a href="#signup">${esc(SIGNUP.fromVenue)}</a></p>`;
  if (shown.length === 0) return `<article class="card"><p>${esc(V.none)}</p></article>${unlisted}`;
  const cities = [...new Set(shown.map(v => v.city))];
  return `<p class="muted small">${esc(fill(V.count, { n: shown.length }))}</p>
    ${cities.map(c => `<section class="rule-group"><h3>${esc(c)}</h3>${shown.filter(v => v.city === c).map(venueCard).join('')}</section>`).join('')}
    ${unlisted}`;
}

// Courts directory (#venues), grouped by region in data order.
export function mountVenues(root) {
  const head = `<div class="section-head"><div class="head-row"><h2>${esc(V.title)}</h2>${shareButtonHtml()}</div><p class="intro">${esc(V.intro)}</p><p class="muted small">${esc(V.disclaimer)}</p></div>`;
  if (VENUES.length === 0) { root.innerHTML = `${head}<article class="card"><p>${esc(V.empty)}</p></article>`; return; }
  const f = loadFilter();
  root.innerHTML = `${head}${barHtml(f)}<div class="venue-list"></div>`;
  const list = root.querySelector('.venue-list');
  const render = () => { list.innerHTML = listHtml(f); };
  render();
  root.querySelector('.share-btn').addEventListener('click', () => sharePage(V.title));
  root.querySelector('#venue-q').addEventListener('input', e => { f.q = e.target.value.trim(); render(); });
  root.querySelector('.venue-bar').addEventListener('click', e => {
    const b = e.target.closest('[data-vf]');
    if (!b) return;
    f[b.dataset.vf] = b.dataset.v;
    for (const x of root.querySelectorAll(`[data-vf="${b.dataset.vf}"]`)) x.setAttribute('aria-pressed', String(x === b));
    saveFilter(f);
    render();
  });
}
