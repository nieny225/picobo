import { VENUES, VENUES_PAGE as V } from '../data/venues.js';
import { mapUrl } from '../meetup.js';
import { MEETUP } from '../data/meetup.js';
import { SIGNUP } from '../data/signup.js';
import { esc } from './scenes.js';
import { shareButtonHtml, sharePage, shareIcon } from './share.js';
import { SHARE } from '../data/nav.js';
import { fill } from '../fill.js';
import { SETTINGS } from '../data/settings.js';
import { matchVenue, sortVenues, activeCount, BAND_IDS, OPERATORS, SORTS, COURT_STEPS, filterToQuery, queryToFilter, isFiltered } from '../venues.js';
import { COUNTRIES, getCountry, setCountry } from '../country.js';

// A court's setting: one of indoor / sheltered / outdoor, or a list when it has both kinds.
const settingsOf = v => [v.setting ?? []].flat().map(k => { if (!V.settings[k]) throw new Error(`venues: unknown setting ${k}`); return k; });

// A booking contact as a link: phone dials, LINE and web open in a new tab.
function bookingHref(b) {
  if (b.type === 'phone') return `tel:${b.value.replace(/[^\d+]/g, '')}`;
  if (b.type === 'whatsapp') return `https://wa.me/${b.value.replace(/\D/g, '')}`;
  if (b.type === 'line') return b.value.startsWith('http') ? b.value : `https://line.me/R/ti/p/${encodeURIComponent(b.value)}`;
  if (b.type === 'url') return b.value;
  throw new Error(`venues: unknown booking type ${b.type}`);
}

// Booking links stay one row: web booking as calendar icon + 「預約」, phone,
// WhatsApp and LINE as icons only (the full label is the tooltip / screen reader name).
const ICON = {
  url: '<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2z"/>',
  line: '<path d="M12 4c5 0 9 3.1 9 7s-4 7-9 7l-4 3v-3.6C5 16.2 3 13.8 3 11c0-3.9 4-7 9-7z"/>',
};
function bookingBtn(b) {
  const href = bookingHref(b), label = b.label || V.booking[b.type];
  const svg = `<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICON[b.type]}</svg>`;
  const ext = href.startsWith('tel:') ? '' : ' target="_blank" rel="noopener"';
  return b.type === 'url'
    ? `<a class="btn book-btn" href="${esc(href)}"${ext} title="${esc(label)}" aria-label="${esc(label)}">${svg}<span aria-hidden="true">${esc(V.bookShort)}</span></a>`
    : `<a class="btn book-btn icon-only" href="${esc(href)}"${ext} title="${esc(label)}" aria-label="${esc(label)}">${svg}</a>`;
}

function venueCard(v) {
  const link = (href, label, cls = 'btn') => `<a class="${cls}" href="${esc(href)}"${href.startsWith('#') || href.startsWith('tel:') ? '' : ' target="_blank" rel="noopener"'}>${esc(label)}</a>`;
  return `<article class="card venue" id="venue-${esc(v.id)}">
    <div class="card-head venue-head"><h3>${esc(v.name)}</h3><button type="button" class="fav-btn venue-share" data-share-venue="${esc(v.id)}" aria-label="${esc(V.share)}">${shareIcon}</button><button type="button" class="fav-btn" data-fav="${esc(v.id)}" aria-pressed="${favs.has(v.id)}" aria-label="${esc(favs.has(v.id) ? V.unfav : V.fav)}">${heart(favs.has(v.id))}</button></div>
    <div class="format-meta">${settingsOf(v).map(k => `<span>${esc(V.settings[k])}</span>`).join('')}${v.courts ? `<span>${esc(fill(V.courts, { n: v.courts }))}</span>` : ''}</div>
    ${v.address ? `<a class="venue-address" href="${esc(mapUrl({ place: v.name, address: v.address }))}" target="_blank" rel="noopener" aria-label="${esc(`${V.map}：${v.address}`)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg><span>${esc(v.address)}</span></a>` : ''}
    <dl class="event-facts">
      ${v.fee ? `<div><dt>${esc(V.fee)}</dt><dd>${esc(v.fee)}</dd></div>` : ''}
      ${v.hours ? `<div><dt>${esc(V.hours)}</dt><dd>${esc(v.hours)}</dd></div>` : ''}
    </dl>
    ${v.note ? `<p class="muted small">${esc(v.note)}</p>` : ''}
    <div class="meetup-actions">
      ${(v.booking ?? []).map(bookingBtn).join('')}
      ${link(`#signup?venue=${encodeURIComponent(v.id)}`, SIGNUP.fromVenue, 'btn btn-primary')}
      ${MEETUP.open ? link(`#meetup?venue=${encodeURIComponent(v.id)}`, V.meetup, 'btn') : ''}
    </div>
  </article>`;
}

// Favourite courts, kept on this phone only.
const FAV_KEY = 'picobo.favVenues';
function loadFavs() {
  try { const f = JSON.parse(localStorage.getItem(FAV_KEY)); return new Set(Array.isArray(f) ? f : []); } catch { return new Set(); }
}
function saveFavs(favs) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); } catch { /* storage unavailable: this visit only */ }
}
const favs = loadFavs();
const heart = on => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M12 21s-8.5-5.2-8.5-11.5a4.8 4.8 0 0 1 8.5-3A4.8 4.8 0 0 1 20.5 9.5C20.5 15.8 12 21 12 21z"/></svg>`;

// Filters: search, region and a favourites toggle on the bar; price, type,
// minimum courts and rain-proof in the 篩選 sheet; sort by region or price.
// Remembered per device (not the search text). The country (新加坡｜台北) is
// its own setting (src/country.js); switching it clears the region.
const FILTER_KEY = 'picobo.venueFilter';
const blank = () => ({ q: '', country: getCountry(), regions: [], prices: [], ops: [], dry: false, fav: false, minCourts: 0, sort: 'region' });
function loadFilter() {
  const f = blank();
  try {
    const s = JSON.parse(localStorage.getItem(FILTER_KEY));
    if (!s || typeof s !== 'object') return f;
    // Before multi-select there was one `region` string.
    const ids = V.regions[f.country].map(r => r.id).filter(Boolean);
    f.regions = (Array.isArray(s.regions) ? s.regions : [s.region]).filter(r => ids.includes(r));
    // Before the sheet there was one `kind` switch: dry, free or fav.
    if (s.kind === 'dry') f.dry = true;
    if (s.kind === 'free') f.prices = ['free'];
    if (s.kind === 'fav') f.fav = true;
    if (Array.isArray(s.prices)) f.prices = s.prices.filter(b => BAND_IDS.includes(b));
    if (Array.isArray(s.ops)) f.ops = s.ops.filter(o => OPERATORS.includes(o));
    for (const k of ['dry', 'fav']) if (typeof s[k] === 'boolean') f[k] = s[k];
    if (s.big === true) f.minCourts = 4; // before the 場地數 row there was one 4+ chip
    if (COURT_STEPS.includes(s.minCourts)) f.minCourts = s.minCourts;
    if (SORTS.includes(s.sort)) f.sort = s.sort;
  } catch { /* storage unavailable or corrupt */ }
  return f;
}
function saveFilter({ q, country, ...rest }) {
  try { localStorage.setItem(FILTER_KEY, JSON.stringify(rest)); } catch { /* storage unavailable */ }
}
const shownOf = f => sortVenues(VENUES.filter(v => matchVenue(v, f, favs)), f.sort);

const FUNNEL = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>';

// What the badge on 篩選 counts: everything in the sheet, region and sort included.
const sheetCount = f => activeCount(f) + f.regions.length + (f.sort !== 'region' ? 1 : 0);

// One row: search, ♥ (used most, so it stays out here) and 篩選; the rest is in the sheet.
function barHtml(f) {
  const n = sheetCount(f);
  return `<div class="venue-bar">
    <div class="venue-tools">
      <input class="input" type="search" id="venue-q" placeholder="${esc(V.search)}" aria-label="${esc(V.search)}" value="${esc(f.q)}" autocomplete="off">
      <button type="button" class="btn venue-fav" data-favonly aria-pressed="${f.fav}" aria-label="${esc(V.favOnly)}" title="${esc(V.favOnly)}">${heart(f.fav)}</button>
      <button type="button" class="btn venue-filter" data-open-filter aria-pressed="${n > 0}">${FUNNEL}<span>${esc(V.filter)}</span>${n ? `<b class="venue-badge">${n}</b>` : ''}</button>
    </div>
  </div>`;
}

// The 篩選 sheet: chips toggle at once and the list behind it follows; the
// footer button shows how many courts are left and closes the sheet.
function openFilter(f, onChange) {
  const dlg = document.createElement('dialog');
  dlg.className = 'install-sheet share-sheet venue-sheet';
  const chips = (k, options, on) => `<div class="chips" role="group">${options.map(o =>
    `<button type="button" class="chip" data-${k}="${o.id}" aria-pressed="${on(o.id)}">${esc(o.label)}</button>`).join('')}</div>`;
  const render = () => {
    dlg.innerHTML = `<div class="share-sheet-head"><b>${esc(V.filterTitle)}</b><button type="button" class="btn btn-ghost" data-close>${esc(SETTINGS.close)}</button></div>
      <section><h4>${esc(V.regionLabel)}</h4>${chips('regionpick', V.regions[f.country].filter(r => !r.id || VENUES.some(v => v.city === r.id)), id => (id ? f.regions.includes(id) : f.regions.length === 0))}</section>
      <section><h4>${esc(V.priceLabel)}</h4>${chips('price', V.prices[f.country], id => f.prices.includes(id))}<p class="muted small">${esc(V.priceHint[f.country])}</p></section>
      <section><h4>${esc(V.opLabel)}</h4>${chips('op', V.ops, id => f.ops.includes(id))}<p class="muted small">${esc(V.opHint[f.country])}</p></section>
      <section><h4>${esc(V.courtsLabel)}</h4>${chips('courts', V.courtSteps, id => f.minCourts === id)}</section>
      <section><h4>${esc(V.otherLabel)}</h4>${chips('other', V.others, id => f[id])}</section>
      <section><h4>${esc(V.sortLabel)}</h4>${chips('sort', V.sorts, id => f.sort === id)}</section>
      <div class="toolbar"><button type="button" class="btn btn-ghost" data-clear>${esc(V.clear)}</button>
        <button type="button" class="btn btn-primary" data-close>${esc(fill(V.show, { n: shownOf(f).length }))}</button></div>`;
  };
  const toggle = (list, id) => (list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  render();
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-close]')) { dlg.close(); return; }
    const b = e.target.closest('button');
    if (!b) return;
    if ('regionpick' in b.dataset) f.regions = b.dataset.regionpick ? toggle(f.regions, b.dataset.regionpick) : []; // 全部 clears
    else if (b.dataset.sort) f.sort = b.dataset.sort;
    else if (b.dataset.price) f.prices = toggle(f.prices, b.dataset.price);
    else if (b.dataset.op) f.ops = toggle(f.ops, b.dataset.op);
    else if (b.dataset.courts) { const n = Number(b.dataset.courts); f.minCourts = f.minCourts === n ? 0 : n; }
    else if (b.dataset.other) f[b.dataset.other] = !f[b.dataset.other];
    else if ('clear' in b.dataset) Object.assign(f, { regions: [], prices: [], ops: [], dry: false, minCourts: 0, sort: 'region' });
    else return;
    render();
    onChange();
  });
  dlg.addEventListener('close', () => dlg.remove());
  document.body.append(dlg);
  dlg.showModal();
}

function listHtml(f) {
  const shown = shownOf(f);
  // Courts not in the list (a condo court, a friend's club) still get a sign-up message.
  const unlisted = `<p class="muted small venue-unlisted">${esc(V.unlisted)} <a href="#signup">${esc(SIGNUP.fromVenue)}</a></p>`;
  if (shown.length === 0) return `<article class="card"><p>${esc(f.fav && favs.size === 0 && !f.q ? V.noFav : V.none)}</p></article>${unlisted}`;
  const count = `<p class="muted small">${esc(fill(V.count, { n: shown.length }))}</p>`;
  if (f.sort !== 'region') return `${count}${shown.map(venueCard).join('')}${unlisted}`;
  // Region headings in the order the regions are listed (Taipei: by district).
  const order = REGION_IDS[f.country ?? 'sg'];
  const cities = [...new Set(shown.map(v => v.city))].sort((x, y) => order.indexOf(x) - order.indexOf(y));
  return `${count}
    ${cities.map(c => `<section class="rule-group"><h3>${esc(c)}</h3>${shown.filter(v => v.city === c).map(venueCard).join('')}</section>`).join('')}
    ${unlisted}`;
}

const REGION_IDS = Object.fromEntries(COUNTRIES.map(c => [c, V.regions[c].map(r => r.id)]));
// 台北・東區 / S$10 以下 / 不怕下雨: the parts of the strip over a friend's filtered list.
function sharedSummary(f) {
  const label = (list, id) => list.find(o => o.id === id).label;
  return [
    V.area[f.country],
    ...f.regions,
    ...f.prices.map(b => label(V.prices[f.country], b)),
    ...f.ops.map(o => label(V.ops, o)),
    f.dry && label(V.others, 'dry'),
    f.minCourts && label(V.courtSteps, f.minCourts),
    f.sort !== 'region' && label(V.sorts, f.sort),
  ].filter(Boolean);
}

// Courts directory (#venues), grouped by region in data order. #venues/<id>
// is one court's own page (the link its share icon sends): just that card,
// whatever the filters, with a way back to the whole list.
export function mountVenues(root) {
  const PIN = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  // 📍 新加坡｜台北 under the title: which country's courts the list shows.
  const areas = c => COUNTRIES.map(k => `<button type="button" class="venue-area" data-country="${k}" aria-pressed="${k === c}">${PIN}${esc(V.area[k])}</button>`).join('');
  const head = `<div class="section-head"><div class="head-row"><h2>${esc(V.title)}</h2>${shareButtonHtml()}</div><div class="venue-areas" role="group" aria-label="${esc(V.areaLabel)}">${areas(getCountry())}</div><p class="muted small">${esc(V.disclaimer)}</p></div>`;
  if (VENUES.length === 0) { root.innerHTML = `${head}<article class="card"><p>${esc(V.empty)}</p></article>`; return { show() {} }; }
  const f = loadFilter();
  root.innerHTML = `<div class="venue-all">${head}${barHtml(f)}<div class="venue-shared" hidden></div><div class="venue-list"></div></div><div class="venue-one" hidden></div>`;
  const all = root.querySelector('.venue-all'), one = root.querySelector('.venue-one');
  const list = root.querySelector('.venue-list');
  let current = null; // the venue shown on its own page, if any
  let shared = null; // a filter opened from a friend's link: shown, never saved
  const sharedBox = root.querySelector('.venue-shared');
  const renderShared = () => {
    sharedBox.innerHTML = `<p><b>${esc(V.sharedLabel)}</b> ${sharedSummary(shared).map(t => `<span class="nowrap">${esc(t)}</span>`).join(esc(V.sharedSep))}</p><a class="btn" href="#venues">${esc(V.seeAll)}</a>`;
  };
  const renderOne = () => {
    one.innerHTML = `<nav class="rule-top"><a class="back" href="#venues">${esc(V.back)}</a></nav>${venueCard(current)}`;
  };
  const areaBox = root.querySelector('.venue-areas');
  const render = () => {
    areaBox.innerHTML = areas((shared ?? f).country);
    if (current) renderOne(); else list.innerHTML = listHtml(shared ?? f);
  };
  render();
  // Another country (here or in Settings): its own regions, so the regions reset.
  const toCountry = c => {
    if (c === f.country) return;
    Object.assign(f, { country: c, regions: [] });
    redraw();
  };
  window.addEventListener('picobo:country', e => toCountry(e.detail));
  root.addEventListener('click', e => {
    const a = e.target.closest('[data-country]');
    if (a) {
      if (shared) location.hash = '#venues'; // leave a friend's filter for your own list
      if (a.dataset.country !== getCountry()) setCountry(a.dataset.country);
      return;
    }
    // With filters on (and not already a friend's link), the link carries them.
    if (e.target.closest('.share-btn')) {
      if (!shared && isFiltered(f)) sharePage(V.title, `${SHARE.url}#venues?${filterToQuery(f, REGION_IDS)}`);
      else sharePage(V.title);
      return;
    }
    const s = e.target.closest('[data-share-venue]');
    if (s) {
      const v = VENUES.find(x => x.id === s.dataset.shareVenue);
      sharePage(v.name, `${SHARE.url}#venues/${encodeURIComponent(v.id)}`, fill(V.shareText, { name: v.name }));
      return;
    }
    const b = e.target.closest('[data-fav]');
    if (!b) return;
    if (favs.has(b.dataset.fav)) favs.delete(b.dataset.fav); else favs.add(b.dataset.fav);
    saveFavs(favs);
    render();
  });
  root.querySelector('#venue-q').addEventListener('input', e => { f.q = e.target.value.trim(); render(); });
  const bar = root.querySelector('.venue-bar');
  const redraw = () => {
    saveFilter(f);
    render();
    const n = sheetCount(f), fb = bar.querySelector('.venue-filter');
    fb.setAttribute('aria-pressed', String(n > 0));
    fb.querySelector('.venue-badge')?.remove();
    if (n) fb.insertAdjacentHTML('beforeend', `<b class="venue-badge">${n}</b>`);
    const fav = bar.querySelector('[data-favonly]');
    fav.setAttribute('aria-pressed', String(f.fav));
    fav.innerHTML = heart(f.fav);
  };
  bar.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if ('favonly' in b.dataset) f.fav = !f.fav;
    else if ('openFilter' in b.dataset) { openFilter(f, redraw); return; }
    else return;
    redraw();
  });
  return {
    show(sub, query = '') {
      const v = VENUES.find(x => x.id === decodeURIComponent(sub || ''));
      if (sub && !v) history.replaceState(null, '', '#venues');
      current = v ?? null;
      shared = current ? null : queryToFilter(query, REGION_IDS);
      all.hidden = !!current;
      one.hidden = !current;
      bar.hidden = !!shared;
      sharedBox.hidden = !shared;
      if (shared) renderShared();
      render();
    },
  };
}
