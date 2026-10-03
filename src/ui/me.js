import { ME as T } from '../data/me.js';
import { summary, namesSeen } from '../record.js';
import { loadGames, saveGames, loadMe, saveMe } from './record.js';
import { esc } from './scenes.js';
import { toast } from './share.js';
import { openShareSheet, CAMERA_ICON } from './sharecard.js';
import { SCORE_SHARE } from '../data/nav.js';

// 我的戰績 (#me): who "me" is, then this week / this month / all games of
// theirs: counts, win rate, streaks, partners, the toughest opponent and the
// last games. Everything is read from this phone (src/ui/record.js).
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);
const PERSON = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>';
const RANGE_KEY = 'picobo.meRange';
function loadRange() {
  try { const r = localStorage.getItem(RANGE_KEY); return T.ranges[r] ? r : 'week'; } catch { return 'week'; }
}
function saveRange(r) {
  try { localStorage.setItem(RANGE_KEY, r); } catch { /* storage unavailable */ }
}
const day = at => { const d = new Date(at); return `${d.getMonth() + 1}/${d.getDate()}`; };

// The person icon in the top bar: the way in until there are real profiles.
export function mountMeButton(a) {
  a.innerHTML = PERSON;
  a.setAttribute('aria-label', T.entry);
  a.title = T.entry;
  a.hidden = false;
}

// The 我的戰績 card on the home page; empty until "me" has played a game.
export function homeMeCardHtml() {
  const me = loadMe();
  if (!me) return '';
  const s = summary(loadGames(), me, 'week');
  if (s.played === 0) return '';
  const tile = (v, label, hl) => `<div class="me-tile${hl ? ' hl' : ''}"><b class="num">${esc(v)}</b><span>${esc(label)}</span></div>`;
  return `<a class="card me-card" href="#me">
    <div class="head-row"><b>${esc(T.card)} <span class="muted small">${esc(T.ranges.week)}</span></b><span aria-hidden="true">›</span></div>
    <div class="me-tiles">${tile(s.played, T.played)}${tile(`${s.rate}%`, T.rate, true)}${tile(s.longestStreak, T.streak)}</div>
    ${s.bestPartner ? `<p class="muted small">${esc(fill(T.cardBest, { name: s.bestPartner.name, wl: fill(T.wl, { won: s.bestPartner.won, lost: s.bestPartner.played - s.bestPartner.won }) }))}</p>` : ''}
  </a>`;
}

// "Which one is you?": tap every spelling of your name (or type it).
function pickerHtml(games, me) {
  const seen = namesSeen(games).slice(0, 40);
  const picked = me ? [me.name, ...me.aliases] : [];
  const all = [...new Set([...picked, ...seen])];
  return `<article class="card me-who">
    <h3>${esc(T.who)}</h3>
    <p class="muted small">${esc(all.length ? T.whoHint : T.whoNone)}</p>
    <div class="me-names">${all.map(n => `<button type="button" class="group-chip" data-name="${esc(n)}" aria-pressed="${picked.includes(n)}">${esc(n)}</button>`).join('')}</div>
    <form class="row" id="me-add"><input class="input" id="me-name" maxlength="20" autocomplete="off" placeholder="${esc(T.namePlaceholder)}"><button class="btn" type="submit" style="flex:0 0 auto">${esc(T.add)}</button></form>
    <div class="toolbar">${me ? `<button type="button" class="btn btn-ghost" data-cancel>${esc(T.cancel)}</button>` : ''}<button type="button" class="btn btn-primary" data-confirm>${esc(T.confirm)}</button></div>
  </article>`;
}

function statsHtml(s, range) {
  const tile = (v, label, hl) => `<div class="me-tile${hl ? ' hl' : ''}"><b class="num">${esc(v)}</b><span>${esc(label)}</span></div>`;
  const ranges = `<div class="seg me-range" role="group">${Object.entries(T.ranges).map(([id, label]) => `<button type="button" data-range="${id}" aria-pressed="${id === range}">${esc(label)}</button>`).join('')}</div>`;
  if (s.played === 0) return `${ranges}<article class="card"><p>${esc(T.empty)}</p></article>`;
  const row = (icon, label, p, detail) => p ? `<div class="me-row"><span>${icon} ${esc(label)}</span><b>${esc(p.name)} <span class="muted small">${esc(detail(p))}</span></b></div>` : '';
  const wl = p => fill(T.wl, { won: p.won, lost: p.played - p.won });
  const games = s.recent.map(r => {
    const who = r.partners.length ? fill(T.with, { partners: r.partners.join('・'), opponents: r.opponents.join('・') }) : fill(T.alone, { opponents: r.opponents.join('・') });
    return `<div class="me-row"><span><span class="muted small">${esc(day(r.at))} ${esc(T.sources[r.source])}${r.scores ? ` ${r.scores[0]}-${r.scores[1]}` : ''}</span><br>${esc(who)}</span><span class="me-wl${r.won ? ' w' : ''}">${esc(r.won ? T.win : T.loss)}</span></div>`;
  }).join('');
  const people = [
    row('🤝', T.bestPartner, s.bestPartner, wl),
    row('👥', T.mostPartner, s.mostPartner, p => fill(T.games, { n: p.played })),
    row('😤', T.toughest, s.toughest, p => fill(T.vs, { won: p.won, lost: p.played - p.won })),
  ].join('');
  return `${ranges}
    <div class="me-tiles">${tile(s.played, T.played)}${tile(`${s.rate}%`, T.rate, true)}${tile(s.longestStreak, T.streak)}</div>
    ${s.withScore < s.played ? `<p class="muted small">${esc(fill(T.withScore, { n: s.withScore }))}</p>` : ''}
    ${people ? `<article class="card">${people}</article>` : ''}
    <article class="card"><h3>${esc(T.recent)}</h3>${games}</article>`;
}

export function mountMe(root) {
  let picking = false, picked = [];

  const render = () => {
    const games = loadGames(), me = loadMe();
    const range = loadRange();
    const head = `<div class="section-head"><div class="head-row"><h2>${esc(T.title)}</h2></div><p class="intro">${esc(T.intro)}</p></div>`;
    if (!me || picking) {
      picked = me ? [me.name, ...me.aliases] : [];
      root.innerHTML = `${head}${pickerHtml(games, me)}`;
      wirePicker();
      return;
    }
    const s = summary(games, me, range);
    // 戰報: the numbers shown, as a picture for IG (same 「📷 IG」 as 抽籤's 戰績).
    const ig = s.played ? `<button type="button" class="stats-share" data-report aria-label="${esc(SCORE_SHARE.openReport)}" title="${esc(SCORE_SHARE.openReport)}">${CAMERA_ICON}<span aria-hidden="true">${esc(SCORE_SHARE.ig)}</span></button>` : '';
    root.innerHTML = `${head.replace('</h2></div>', `</h2>${ig}</div>`)}
      <p class="me-who-line">${esc(T.iAm)} <b>${esc(me.name)}</b>${me.aliases.length ? ` <span class="muted small">${esc(T.alsoKnown)} ${esc(me.aliases.join('、'))}</span>` : ''} <button type="button" class="me-link" data-change>${esc(T.change)}</button></p>
      ${statsHtml(s, range)}
      ${games.length ? `<p class="me-clear"><button type="button" class="me-link" data-clear>${esc(T.clear)}</button></p>` : ''}`;
    root.querySelector('[data-change]').addEventListener('click', () => { picking = true; render(); });
    root.querySelector('[data-report]')?.addEventListener('click', () => openShareSheet('report', { summary: s, name: me.name, range }));
    for (const b of root.querySelectorAll('[data-range]')) b.addEventListener('click', () => { saveRange(b.dataset.range); render(); });
    root.querySelector('[data-clear]')?.addEventListener('click', () => {
      if (!confirm(T.clearConfirm)) return;
      saveGames([]); toast(esc(T.cleared)); render();
    });
  };

  const wirePicker = () => {
    const sync = () => { for (const b of root.querySelectorAll('[data-name]')) b.setAttribute('aria-pressed', String(picked.includes(b.dataset.name))); };
    root.querySelector('.me-names').addEventListener('click', e => {
      const b = e.target.closest('[data-name]');
      if (!b) return;
      const n = b.dataset.name;
      picked = picked.includes(n) ? picked.filter(x => x !== n) : [...picked, n];
      sync();
    });
    root.querySelector('#me-add').addEventListener('submit', e => {
      e.preventDefault();
      const input = root.querySelector('#me-name');
      const n = input.value.trim();
      if (!n) return;
      if (!picked.includes(n)) picked.push(n);
      const box = root.querySelector('.me-names');
      if (![...box.querySelectorAll('[data-name]')].some(b => b.dataset.name === n)) {
        box.insertAdjacentHTML('beforeend', `<button type="button" class="group-chip" data-name="${esc(n)}" aria-pressed="true">${esc(n)}</button>`);
      }
      input.value = '';
      sync();
    });
    root.querySelector('[data-cancel]')?.addEventListener('click', () => { picking = false; render(); });
    root.querySelector('[data-confirm]').addEventListener('click', () => {
      if (picked.length === 0) { root.querySelector('#me-name').focus(); return; }
      saveMe({ name: picked[0], aliases: picked.slice(1) });
      picking = false; render();
    });
  };

  return { show: () => { picking = false; render(); } };
}
