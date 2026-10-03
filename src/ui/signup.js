import { SIGNUP as T } from '../data/signup.js';
import { VENUES } from '../data/venues.js';
import { signupText, nextDay, shortMapLink } from '../signup.js';
import { esc } from './scenes.js';
import { shareButtonHtml, shareText, toast } from './share.js';
import { loadGroups, groupChipsHtml } from './groups.js';
import { GROUPS as G } from '../data/nav.js';

const KEY = 'picobo.signup';
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? null; } catch { return null; }
}
function save(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable: no prefill next time */ }
}

// A listed court gets its map link in the message; anything typed by hand does not.
const venueNamed = name => VENUES.find(v => v.name === name.trim());
const linkFor = place => { const v = venueNamed(place); return v ? shortMapLink(v.name, v.address) : ''; };

function sessionHtml(s, i, many) {
  const f = T.fields;
  return `<fieldset class="signup-session" data-i="${i}">
    <legend>${esc(T.session.replace('{n}', i + 1))}${many ? ` <button type="button" class="link-btn" data-remove="${i}">${esc(T.removeSession)}</button>` : ''}</legend>
    <div class="field"><label for="s-place-${i}">${esc(f.place)}</label><input class="input" id="s-place-${i}" data-f="place" list="s-venues" value="${esc(s.place)}" placeholder="${esc(f.placeHint)}"></div>
    <div class="row">
      <div class="field"><label for="s-date-${i}">${esc(f.date)}</label><input class="input" id="s-date-${i}" data-f="date" type="date" value="${esc(s.date)}"></div>
      <div class="field"><label for="s-start-${i}">${esc(f.start)}</label><input class="input" id="s-start-${i}" data-f="start" type="time" value="${esc(s.start)}"></div>
      <div class="field"><label for="s-end-${i}">${esc(f.end)}</label><input class="input" id="s-end-${i}" data-f="end" type="time" value="${esc(s.end)}"></div>
    </div>
  </fieldset>`;
}

// 報名訊息 (#signup): sessions, who is already in, an optional cap; a live
// preview of the text, copied or shared as plain text.
export function mountSignup(root) {
  let state = null;
  let text = '';

  const build = () => {
    const err = root.querySelector('.form-error');
    try {
      const cap = state.cap === '' ? null : Number(state.cap);
      text = signupText({
        sessions: state.sessions.map(s => ({ ...s, link: linkFor(s.place) })),
        names: state.names.split('\n'), cap, blanks: Number(state.blanks),
      }, T.labels);
      err.hidden = true;
      save(state);
    } catch (x) {
      text = '';
      err.textContent = T.errors[x.message.replace('signup: ', '')] ?? x.message;
      err.hidden = false;
    }
    root.querySelector('.signup-preview').textContent = text;
    root.querySelector('#signup-copy').disabled = !text;
  };

  const render = () => {
    const f = T.fields;
    root.innerHTML = `
      <div class="section-head"><div class="head-row"><h2>${esc(T.title)}</h2>${shareButtonHtml()}</div><p class="intro">${esc(T.intro)}</p></div>
      <form class="card" id="signup-form" novalidate>
        <datalist id="s-venues">${VENUES.map(v => `<option value="${esc(v.name)}">`).join('')}</datalist>
        <div class="signup-sessions">${state.sessions.map((s, i) => sessionHtml(s, i, state.sessions.length > 1)).join('')}</div>
        <button type="button" class="btn" id="signup-add">＋ ${esc(T.addSession)}</button>
        <div class="field"><label for="s-names">${esc(f.names)}</label>${groupChipsHtml(loadGroups(), '', false)}<textarea class="input" id="s-names" rows="3" placeholder="${esc(f.namesHint)}">${esc(state.names)}</textarea></div>
        <div class="row">
          <div class="field"><label for="s-cap">${esc(f.cap)}</label><input class="input" id="s-cap" type="number" min="1" max="40" inputmode="numeric" value="${esc(state.cap)}"></div>
          <div class="field"><label for="s-blanks">${esc(f.blanks)}</label><select class="input" id="s-blanks"${state.cap ? ' disabled' : ''}>${[0, 1, 2, 3, 4, 5, 6, 8].map(n => `<option value="${n}"${String(n) === String(state.blanks) ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
        </div>
        <p class="form-error" hidden></p>
      </form>
      <article class="card"><h3>${esc(T.preview)}</h3><pre class="signup-preview"></pre>
        <button type="button" class="btn btn-primary btn-block" id="signup-copy">${esc(T.copy)}</button></article>`;
    const form = root.querySelector('#signup-form');
    form.addEventListener('input', e => {
      const box = e.target.closest('.signup-session');
      if (box && e.target.dataset.f) state.sessions[box.dataset.i][e.target.dataset.f] = e.target.value;
      if (e.target.id === 's-names') state.names = e.target.value;
      if (e.target.id === 's-cap') { state.cap = e.target.value; form.querySelector('#s-blanks').disabled = !!state.cap; }
      if (e.target.id === 's-blanks') state.blanks = e.target.value;
      build();
    });
    form.addEventListener('change', e => { if (e.target.id === 's-blanks') { state.blanks = e.target.value; build(); } });
    form.querySelector('#signup-add').addEventListener('click', () => {
      const last = state.sessions.at(-1);
      state.sessions.push({ ...last, date: last.date ? nextDay(last.date) : today() });
      render();
    });
    form.addEventListener('click', e => {
      const r = e.target.closest('[data-remove]');
      if (r) { state.sessions.splice(Number(r.dataset.remove), 1); render(); }
      // 常用球團: its players fill 已經報名, one per line.
      const g = e.target.closest('[data-group]');
      const group = g && loadGroups().find(x => x.name === g.dataset.group);
      if (group) {
        state.names = group.names.join('\n');
        form.querySelector('#s-names').value = state.names;
        for (const b of form.querySelectorAll('[data-group]')) b.setAttribute('aria-pressed', String(b === g));
        build();
        toast(esc(G.loaded.replace('{name}', group.name)));
      }
    });
    root.querySelector('#signup-copy').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(text); toast(esc(T.copied)); } catch { toast(esc(T.copyFailed)); }
    });
    root.querySelector('.section-head .share-btn').addEventListener('click', () => { if (text) shareText(T.shareTitle, text); });
    build();
  };

  return {
    // venue=<id> (from a court card) puts that court in the first session.
    show(query) {
      const saved = load();
      state = {
        sessions: saved?.sessions?.length ? saved.sessions : [{ place: '', date: today(), start: '17:00', end: '19:00' }],
        names: saved?.names ?? '', cap: saved?.cap ?? '', blanks: saved?.blanks ?? 3,
      };
      // Old dates roll forward to today, keeping the gap between sessions.
      if (state.sessions[0].date < today()) {
        let d = today();
        state.sessions = state.sessions.map((s, i) => { if (i > 0) d = nextDay(d); return { ...s, date: d }; });
      }
      const venue = VENUES.find(v => v.id === new URLSearchParams(query).get('venue'));
      if (venue) state.sessions = state.sessions.map(s => ({ ...s, place: venue.name }));
      render();
    },
  };
}
