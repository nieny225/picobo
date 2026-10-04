import { MEETUP as T } from '../data/meetup.js';
import { VENUES } from '../data/venues.js';
import { getCountry } from '../country.js';
import { SHARE } from '../data/nav.js';
import { PLAYS, LEVELS, normalizeMeetup, whenText, needText, summaryText, icsText, mapUrl, contactLinks } from '../meetup.js';
import { encodeHandoff, decodeHandoff } from '../handoff.js';
import { esc } from './scenes.js';
import { shareButtonHtml, sharePage } from './share.js';

const KEY = 'picobo.meetup';
const L = T.labels;

function loadDraft() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? null; } catch { return null; }
}
function saveDraft(m) {
  try { localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* storage unavailable: no prefill next time */ }
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function formHtml(d) {
  const field = (id, label, input) => `<div class="field"><label for="m-${id}">${esc(label)}</label>${input}</div>`;
  const text = (id, label, value, extra = '') => field(id, label, `<input class="input" id="m-${id}" name="${id}" value="${esc(value ?? '')}"${extra}>`);
  const seg = (name, options, value) => `<div class="seg" role="group" aria-label="${esc(T.fields[name])}">${options.map(o =>
    `<button type="button" data-k="${name}" data-v="${o}" aria-pressed="${o === value}">${esc(name === 'play' ? L.plays[o] : L.levelsShort[o] ?? L.levels[o])}</button>`).join('')}</div>`;
  return `<form class="card" id="meetup-form" novalidate>
    <div class="row">
      ${text('date', T.fields.date, d.date, ' type="date"')}
      ${text('start', T.fields.start, d.start, ' type="time"')}
      ${text('end', T.fields.end, d.end, ' type="time"')}
    </div>
    ${text('place', T.fields.place, d.place, ` placeholder="${esc(T.fields.placeHint)}" list="m-venues" maxlength="40"`)}
    <datalist id="m-venues">${VENUES.filter(v => v.country === getCountry()).map(v => `<option value="${esc(v.name)}">`).join('')}</datalist>
    ${text('address', T.fields.address, d.address, ' maxlength="80"')}
    <div class="field"><span class="field-label">${esc(T.fields.play)}</span>${seg('play', PLAYS, d.play)}</div>
    <div class="field"><span class="field-label">${esc(T.fields.level)}</span>${seg('level', LEVELS, d.level)}</div>
    <div class="row">
      ${text('need', T.fields.need, d.need, ' type="number" min="0" max="20" inputmode="numeric"')}
      ${text('host', T.fields.host, d.host, ` placeholder="${esc(T.fields.hostHint)}" maxlength="12"`)}
    </div>
    <div class="row">
      ${text('line', T.fields.line, d.line, ' autocapitalize="off" autocomplete="off"')}
      ${text('whatsapp', T.fields.whatsapp, d.whatsapp, ' type="tel" inputmode="tel"')}
    </div>
    ${field('note', T.fields.note, `<textarea class="input" id="m-note" name="note" rows="2" maxlength="140" placeholder="${esc(T.fields.noteHint)}">${esc(d.note ?? '')}</textarea>`)}
    <p class="form-error" hidden></p>
    <button class="btn btn-primary btn-block" type="submit">${esc(T.submit)}</button>
  </form>`;
}

// The card itself, the same for the host's preview and for whoever opens the link.
function cardHtml(m) {
  const contact = contactLinks(m);
  const out = (href, label) => `<a class="btn" href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`;
  return `<article class="card meetup-card">
    <p class="meetup-when num">${esc(whenText(m, L))}</p>
    <h3>${esc(m.place)}</h3>
    ${m.address ? `<p class="muted">${esc(m.address)}</p>` : ''}
    <div class="format-meta"><span>${esc(L.plays[m.play])}</span><span>${esc(L.levels[m.level])}</span><span class="meetup-need">${esc(needText(m.need, L))}</span></div>
    ${m.host ? `<p><b>${esc(L.hostLine.replace('{name}', m.host))}</b></p>` : ''}
    ${m.note ? `<p>${esc(m.note)}</p>` : ''}
    <div class="meetup-actions">
      ${out(mapUrl(m), T.map)}
      <a class="btn" href="#" data-ics download="picobo.ics">${esc(T.calendar)}</a>
      ${contact.line ? out(contact.line, T.contactLine) : ''}
      ${contact.whatsapp ? out(contact.whatsapp, T.contactWhatsapp) : ''}
    </div>
    <p class="muted small">${esc(T.noSync)}</p>
  </article>`;
}

function wireCard(root, m) {
  const a = root.querySelector('[data-ics]');
  a.href = URL.createObjectURL(new Blob([icsText(m, L)], { type: 'text/calendar' }));
}

// 揪團 (#meetup): the host's form and preview; a shared link (#meetup?s=…)
// shows the card read-only and never touches this phone's draft.
export function mountMeetup(root) {
  const head = (intro, share) => `<div class="section-head"><div class="head-row"><h2>${esc(T.title)}</h2>${share ? shareButtonHtml() : ''}</div><p class="intro">${esc(intro)}</p></div>`;

  const showForm = d => {
    root.innerHTML = head(T.intro, false) + formHtml(d);
    const form = root.querySelector('#meetup-form');
    const pick = k => form.querySelector(`[data-k="${k}"][aria-pressed="true"]`)?.dataset.v;
    form.addEventListener('click', e => {
      const b = e.target.closest('[data-k]');
      if (!b) return;
      for (const x of form.querySelectorAll(`[data-k="${b.dataset.k}"]`)) x.setAttribute('aria-pressed', String(x === b));
    });
    // Picking a listed court fills its address.
    form.place.addEventListener('change', () => {
      const v = VENUES.find(x => x.name === form.place.value.trim());
      if (v && !form.address.value) form.address.value = v.address ?? '';
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const err = form.querySelector('.form-error');
      let m;
      try {
        m = normalizeMeetup({
          date: form.date.value, start: form.start.value, end: form.end.value, place: form.place.value, address: form.address.value,
          play: pick('play'), level: pick('level'), need: form.need.value, host: form.host.value,
          line: form.line.value, whatsapp: form.whatsapp.value, note: form.note.value,
        });
      } catch (x) {
        err.textContent = T.errors[x.message.replace('meetup: ', '')] ?? x.message;
        err.hidden = false;
        return;
      }
      saveDraft(m);
      showPreview(m, await encodeHandoff('meetup', m));
      window.scrollTo({ top: 0 });
    });
  };

  const showPreview = (m, code) => {
    root.innerHTML = `${head(T.shareHint, true)}${cardHtml(m)}<button class="btn btn-block" type="button" id="meetup-edit">${esc(T.edit)}</button>`;
    wireCard(root, m);
    root.querySelector('.share-btn').addEventListener('click', () => sharePage(T.shareTitle, `${SHARE.url}#meetup?s=${code}`, summaryText(m, L)));
    root.querySelector('#meetup-edit').addEventListener('click', () => showForm(m));
  };

  const showShared = async code => {
    let m;
    try {
      const payload = await decodeHandoff(code);
      if (payload.kind !== 'meetup') throw new Error('meetup: not a meetup link');
      m = normalizeMeetup(payload.data);
    } catch {
      root.innerHTML = `${head(T.title, false)}<article class="card"><p>${esc(T.broken)}</p></article><a class="btn btn-primary btn-block" href="#meetup">${esc(T.again)}</a>`;
      return;
    }
    const again = `#meetup?place=${encodeURIComponent(m.place)}&address=${encodeURIComponent(m.address)}`;
    root.innerHTML = `${head(T.guestIntro, true)}${cardHtml(m)}<a class="btn btn-primary btn-block" href="${esc(again)}">${esc(T.again)}</a>`;
    wireCard(root, m);
    root.querySelector('.share-btn').addEventListener('click', () => sharePage(T.shareTitle, `${SHARE.url}#meetup?s=${code}`, summaryText(m, L)));
  };

  return {
    // query: the part of the hash after '?'. s = a shared card; venue / place
    // and address = start a new card there (from the courts list or a card).
    show(query) {
      const q = new URLSearchParams(query);
      if (q.get('s')) { showShared(q.get('s')); return; }
      const draft = loadDraft();
      const d = { date: today(), start: '09:00', end: '11:00', play: 'doubles', level: 'any', need: 2, ...(draft ?? {}) };
      if (draft && draft.date < today()) d.date = today();
      const venue = VENUES.find(v => v.id === q.get('venue'));
      if (venue) Object.assign(d, { place: venue.name, address: venue.address ?? '' });
      if (q.get('place')) Object.assign(d, { place: q.get('place'), address: q.get('address') ?? '' });
      showForm(d);
    },
  };
}
