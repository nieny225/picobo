import { SCORE_SETUP, DRAW_EMPTY, OPEN_PLAY, DRAW_PASTE as P, DRAW_SWAP as W, DRAW_RENAME as R, DRAW_MIX as X, DRAW_SCORE as S } from '../data/nav.js';
import { parseSignup } from '../signup.js';
import { toast } from './share.js';
import { isFull, toggleFull, onFullChange, fullIcon } from './fullscreen.js';
import { handoffButtonHtml, openHandoff } from './handoff.js';
import { roundRobin, createKingOfCourt, advanceKingOfCourt, createOpenPlay, finishOpenPlayGame, joinOpenPlay, leaveOpenPlay, swapPlayers, renamePlayer, courtOfGame } from '../draw.js';

const ROSTER_KEY = 'picobo.roster';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// A first visit starts with an empty list; after that the last list stays.
// Old versions started from an example list of real people's names (saved
// as { sample: true }, or not saved at all): it is dropped, with any session
// drawn from it.
function loadRoster() {
  try {
    const raw = localStorage.getItem(ROSTER_KEY); const r = raw && JSON.parse(raw);
    if (r && !r.sample && Array.isArray(r.names)) return r;
    // No list of its own yet: a saved session can only be from the example.
    localStorage.removeItem(ROSTER_KEY); localStorage.removeItem('picobo.openplay');
  } catch { /* ignore */ }
  return { names: [] };
}
function saveRoster(r) {
  try { localStorage.setItem(ROSTER_KEY, JSON.stringify(r)); } catch { /* ignore */ }
}

// The open-play session survives a reload, so a long evening is not lost.
const PLAY_KEY = 'picobo.openplay';
function loadPlay() {
  try { const raw = localStorage.getItem(PLAY_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function savePlay(p) {
  try { p ? localStorage.setItem(PLAY_KEY, JSON.stringify(p)) : localStorage.removeItem(PLAY_KEY); } catch { /* ignore */ }
}

// Mixed doubles: the switch, and each name's tag (♂ / ♀), kept per name on
// this phone so next week's roster already knows.
const MIX_KEY = 'picobo.mixed', GENDER_KEY = 'picobo.genders';
function loadMix() {
  try { return localStorage.getItem(MIX_KEY) === '1'; } catch { return false; }
}
function saveMix(on) {
  try { localStorage.setItem(MIX_KEY, on ? '1' : '0'); } catch { /* ignore */ }
}
// Only 'm' / 'f' survive, whatever was stored or handed over.
const cleanGenders = g => Object.fromEntries(Object.entries(g && typeof g === 'object' ? g : {}).filter(([, v]) => v === 'm' || v === 'f'));
function loadGenders() {
  try { return cleanGenders(JSON.parse(localStorage.getItem(GENDER_KEY))); } catch { return {}; }
}
function saveGenders(g) {
  try { localStorage.setItem(GENDER_KEY, JSON.stringify(g)); } catch { /* ignore */ }
}
const NEXT_GENDER = { '': 'm', m: 'f', f: '' };

// A name on court or in the queue is a button when players can be swapped by hand.
const nameHtml = (n, swap) => (swap ? `<button type="button" class="name-btn" data-swap="${esc(n)}">${esc(n)}</button>` : `<span>${esc(n)}</span>`);
const teamHtml = (t, first, swap = false) => `<div class="team-names${first ? ' serve-first' : ''}">${t.map(n => nameHtml(n, swap)).join('')}</div>`;

// Who `name` can trade places with: everyone on court or in the queue except
// themself and their partner, grouped by where they are.
function swapGroups(state, name) {
  const partner = state.courts.flatMap(c => c.teams).find(t => t.includes(name)) ?? [];
  const groups = [];
  const queue = state.queue.filter(n => n !== name);
  if (queue.length) groups.push({ label: W.queue, names: queue });
  for (const c of state.courts) {
    const names = c.teams.flat().filter(n => n !== name && !partner.includes(n));
    if (names.length) groups.push({ label: W.court.replace('{court}', c.court), names });
  }
  return groups;
}

// A small sheet listing who to swap with; resolves to a name, or null.
function pickSwap(name, groups) {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.className = 'install-sheet swap-sheet';
    dlg.innerHTML = `<b>${esc(W.title.replace('{name}', name))}</b><p class="muted small">${esc(W.note)}</p>
      ${groups.length ? groups.map(g => `<p class="small swap-group">${esc(g.label)}</p><div class="swap-names">${g.names.map(n => `<button type="button" class="btn" data-pick="${esc(n)}">${esc(n)}</button>`).join('')}</div>`).join('') : `<p>${esc(W.none)}</p>`}
      <div class="toolbar"><button class="btn btn-ghost" type="button" data-cancel>${esc(W.cancel)}</button></div>`;
    const done = v => { dlg.close(); dlg.remove(); resolve(v); };
    dlg.addEventListener('click', e => {
      const b = e.target.closest('[data-pick]');
      if (b) done(b.dataset.pick);
      else if (e.target.closest('[data-cancel]') || e.target === dlg) done(null);
    });
    dlg.addEventListener('cancel', e => { e.preventDefault(); done(null); });
    document.body.append(dlg);
    dlg.showModal();
  });
}

// A small sheet with the name in a text box; resolves to the new name, or
// null. `taken` says whether a name is already on the roster.
function askRename(name, taken) {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.className = 'install-sheet';
    dlg.innerHTML = `<form method="dialog" class="rename-form"><b>${esc(R.title)}</b>
      <input class="input" name="name" value="${esc(name)}" maxlength="20" autocomplete="off">
      <p class="form-error" hidden></p>
      <div class="toolbar"><button class="btn btn-ghost" type="button" data-cancel>${esc(R.cancel)}</button><button class="btn btn-primary" type="submit">${esc(R.save)}</button></div></form>`;
    const form = dlg.querySelector('form'), err = dlg.querySelector('.form-error');
    const done = v => { dlg.close(); dlg.remove(); resolve(v); };
    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = form.name.value.trim();
      const problem = !v ? R.empty : v !== name && taken(v) ? R.duplicate : '';
      if (problem) { err.textContent = problem; err.hidden = false; return; }
      done(v === name ? null : v);
    });
    dlg.querySelector('[data-cancel]').addEventListener('click', () => done(null));
    dlg.addEventListener('cancel', e => { e.preventDefault(); done(null); });
    dlg.addEventListener('click', e => { if (e.target === dlg) done(null); });
    document.body.append(dlg);
    dlg.showModal();
    form.name.select();
  });
}

// Full screen keeps only the courts, the queue and the counts (styles/main.css).
const fullBtnHtml = () => `<div class="out-head"><button class="fs-btn" type="button" id="draw-full" title="${esc(isFull('draw') ? SCORE_SETUP.exitFullscreen : SCORE_SETUP.fullscreen)}">${fullIcon(SCORE_SETUP)}</button></div>`;
function wireFull(out) {
  out.querySelector('#draw-full')?.addEventListener('click', async () => { await toggleFull('draw'); window.scrollTo({ top: 0 }); });
}
onFullChange(() => {
  const b = document.getElementById('draw-full');
  if (b) { b.innerHTML = fullIcon(SCORE_SETUP); b.title = isFull('draw') ? SCORE_SETUP.exitFullscreen : SCORE_SETUP.fullscreen; }
});

// Wires every name button in `out` to swap within `state`, then hands the new state on.
function wireSwaps(out, state, apply) {
  for (const b of out.querySelectorAll('[data-swap]')) b.addEventListener('click', async () => {
    const a = b.dataset.swap;
    const other = await pickSwap(a, swapGroups(state, a));
    if (!other) return;
    apply(swapPlayers(state, a, other));
    toast(esc(W.done.replace('{a}', a).replace('{b}', other)));
  });
}
// Score this court's game on the scoreboard, names filled in.
const scoreBtnHtml = (ci, court) => `<button type="button" class="court-score" data-score="${ci}" aria-label="${esc(S.open.replace('{court}', court))}" title="${esc(S.open.replace('{court}', court))}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 5v14M7 10v4M15.5 10h2v4h-2"/></svg></button>`;
function wireScore(out, state, kind, firstOf, toScore) {
  for (const b of out.querySelectorAll('[data-score]')) b.addEventListener('click', () => {
    const c = state.courts[Number(b.dataset.score)];
    toScore({ kind, court: c.court, teams: c.teams.map(t => t.slice()), first: firstOf(c) === 1 ? 'B' : 'A' });
  });
}

const matchHtml = (m, firstIdx) => `<div class="match"><span class="court-no">${m.court} 號場</span>${teamHtml(m.teams[0], firstIdx === 0)}<span class="vs">對</span>${teamHtml(m.teams[1], firstIdx === 1)}</div>`;

export function mountDraw(root, { toScore } = {}) {
  let roster = loadRoster();
  let sub = 'draw';
  let koc = null;
  let streakMax = 3;
  let play = loadPlay();
  const setPlay = p => { play = p; savePlay(p); };
  let mix = loadMix();
  let genders = loadGenders();
  // What the pairing sees: tags only while mixed doubles is on.
  const mixGenders = () => (mix ? genders : null);
  const showTags = () => mix && sub === 'draw';
  const tagHtml = (n, i) => {
    const g = genders[n] ?? '';
    return `<button type="button" class="chip-sex" data-sex="${i}" data-g="${g || 'none'}" aria-label="${esc(X.tag.replace('{name}', n).replace('{label}', X.labels[g]))}">${X.symbols[g]}</button>`;
  };

  const html = () => `
    <div class="section-head"><div class="head-row"><h2>抽籤輪轉</h2>${handoffButtonHtml()}</div><p class="intro">先輸入今天的球友，再選要怎麼分。</p></div>
    <div class="card roster-card">
      <div class="card-head"><h3>今天的球友 <span class="muted small num">${roster.names.length} 人</span></h3></div>
      <div class="roster" id="roster">${roster.names.map((n, i) => `<span class="name-chip">${showTags() ? tagHtml(n, i) : ''}<button type="button" class="chip-name" data-rename="${i}">${esc(n)}</button><button data-remove="${i}" aria-label="移除 ${esc(n)}">×</button></span>`).join('')}</div>
      ${roster.names.length ? '' : `<p class="muted small">${esc(DRAW_EMPTY)}</p>`}
      ${roster.names.length ? `<p class="muted small">${esc(showTags() ? `${R.hint}${X.hint}` : R.hint)}</p>` : ''}
      <form class="row" id="add-form"><input class="input" id="add-name" placeholder="輸入名字" maxlength="8" autocomplete="off"><button class="btn" type="submit" style="flex:0 0 auto">加入</button><button class="btn btn-ghost" type="button" id="clear" style="flex:0 0 auto">清空</button></form>
      <details class="paste-list"><summary>${esc(P.open)}</summary>
        <p class="muted small">${esc(P.hint)}</p>
        <textarea class="input" id="paste-text" rows="5" placeholder="${esc(P.placeholder)}"></textarea>
        <button class="btn btn-primary" type="button" id="paste-read">${esc(P.read)}</button>
        <div id="paste-pick"></div>
      </details>
    </div>
    <div class="subtabs" role="tablist">
      ${[['draw', '抽籤分組'], ['rr', '輪轉賽'], ['koc', '國王球場']].map(([id, t]) => `<button class="subtab" role="tab" data-sub="${id}" aria-selected="${sub === id}">${t}</button>`).join('')}
    </div>
    <div id="sub-body"></div>`;

  const drawBody = () => `<div class="card draw-card"><div class="draw-controls">
    <div class="row"><div class="field"><label for="courts">場地數</label><input class="input num" id="courts" type="number" min="1" max="8" value="${play ? play.courts.length : 1}"></div><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="go">${esc(play ? OPEN_PLAY.redraw : OPEN_PLAY.start)}</button></div></div>
    <label class="mix-toggle"><input type="checkbox" id="mix"${mix ? ' checked' : ''}> ${esc(X.toggle)}<span class="muted small mix-note">${esc(X.note)}</span></label>
    <p class="muted small">${esc(OPEN_PLAY.hint)}</p></div>
    <div id="out"></div></div>`;

  const renderPlay = out => {
    if (!play) { out.innerHTML = ''; return; }
    const ranked = Object.entries(play.stats).sort((a, b) => b[1].won - a[1].won || a[1].played - b[1].played);
    out.innerHTML = `${fullBtnHtml()}<div class="matches">${play.courts.map((c, ci) => c.teams.length === 2 ? `
      <div class="koc-court" data-court="${c.court}"><div class="court-head"><span class="court-no num" style="color:var(--accent);font-weight:700">${c.court} 號場</span>${mix && c.mixed === false ? `<span class="waiting">${esc(X.notMixed)}</span>` : ''}${scoreBtnHtml(ci, c.court)}</div>
      <div class="koc-teams">${c.teams.map((t, ti) => `<div class="koc-team">${teamHtml(t, c.first === ti, true)}<button class="btn" data-court="${ci}" data-win="${ti}">${esc(OPEN_PLAY.won)}</button></div>`).join('')}</div></div>`
      : `<div class="koc-court"><span class="muted">${esc(OPEN_PLAY.idle.replace('{court}', c.court))}</span></div>`).join('')}</div>
      <p class="small" style="margin-top:10px"><b>${esc(OPEN_PLAY.queue)}</b>${esc(OPEN_PLAY.queueHint)}</p>
      <div class="queue queue-4">${play.queue.map(n => nameHtml(n, true)).join('') || `<span class="muted">${esc(OPEN_PLAY.queueEmpty)}</span>`}</div>
      <p class="muted small">${esc(W.hint)}</p>
      ${play.leaving.length ? `<p class="waiting">${esc(OPEN_PLAY.leaving)}${play.leaving.map(esc).join('、')}</p>` : ''}
      <h3 class="stats-title">${esc(OPEN_PLAY.stats)}</h3>
      <table class="stats"><thead><tr>${OPEN_PLAY.cols.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${ranked.map(([n, r]) => `<tr><td>${esc(n)}</td><td class="num">${r.played}</td><td class="num">${r.won}</td></tr>`).join('')}</tbody></table>`;
    for (const b of out.querySelectorAll('[data-win]')) b.addEventListener('click', () => {
      setPlay(finishOpenPlayGame(play, Number(b.dataset.court), Number(b.dataset.win), Math.random, mixGenders()));
      renderPlay(out);
    });
    wireSwaps(out, play, next => { setPlay(next); renderPlay(out); });
    wireScore(out, play, 'open', c => c.first, toScore);
    wireFull(out);
  };

  const rrBody = () => `<div class="card">
    <div class="row">
      <div class="field"><label for="courts">場地數</label><input class="input num" id="courts" type="number" min="1" max="8" value="1"></div>
      <div class="field"><label for="rounds">幾輪</label><input class="input num" id="rounds" type="number" min="1" max="12" value="5"></div>
      <div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="go">排輪次</button></div>
    </div>
    <p class="muted small">每輪換搭檔，盡量不重複；人數超過場地容量時輪流休息。</p>
    <div id="out"></div></div>`;

  const kocBody = () => `<div class="card draw-card"><div class="draw-controls">
    <div class="row">
      <div class="field"><label for="courts">場地數</label><input class="input num" id="courts" type="number" min="1" max="8" value="1"></div>
      <div class="field"><label for="streak">最多連贏幾場</label><input class="input num" id="streak" type="number" min="1" max="10" value="${streakMax}"></div>
      <div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="go">${koc ? '重新開始' : '開始'}</button></div>
    </div>
    <p class="muted small">贏的留場、輸的排隊尾；連贏到上限也下場。</p></div>
    <div id="out"></div></div>`;

  const renderKoc = out => {
    if (!koc) { out.innerHTML = ''; return; }
    out.innerHTML = `${fullBtnHtml()}<div class="matches">${koc.courts.map((c, ci) => c.teams.length === 2 ? `
      <div class="koc-court" data-court="${c.court}"><div class="court-head"><span class="court-no num" style="color:var(--accent);font-weight:700">${c.court} 號場</span><span class="streak">留場隊已連贏 ${c.streak} 場</span>${scoreBtnHtml(ci, c.court)}</div>
      <div class="koc-teams">${c.teams.map((t, ti) => `<div class="koc-team">${teamHtml(t, c.streak === 0 ? ti === 0 : ti === 1, true)}<button class="btn" data-court="${ci}" data-win="${ti}">這隊贏</button></div>`).join('')}</div></div>`
      : `<div class="koc-court"><span class="muted">${c.court} 號場：人不夠，先休息</span></div>`).join('')}</div>
      <p class="small" style="margin-top:10px"><b>排隊中</b>（前兩位下一場上）</p><div class="queue">${koc.queue.map(n => nameHtml(n, true)).join('') || '<span class="muted">沒有人在排隊</span>'}</div>
      <p class="muted small">${esc(W.hint)}</p>`;
    for (const b of out.querySelectorAll('[data-win]')) b.addEventListener('click', () => {
      koc = advanceKingOfCourt(koc, Number(b.dataset.court), Number(b.dataset.win), streakMax);
      renderKoc(out);
    });
    wireSwaps(out, koc, next => { koc = next; renderKoc(out); });
    wireScore(out, koc, 'koc', c => (c.streak === 0 ? 0 : 1), toScore);
    wireFull(out);
  };

  const renderSub = () => {
    const body = root.querySelector('#sub-body');
    body.innerHTML = sub === 'draw' ? drawBody() : sub === 'rr' ? rrBody() : kocBody();
    const out = body.querySelector('#out');
    const courts = () => Number(body.querySelector('#courts').value) || 1;
    const guard = min => {
      if (roster.names.length < min) { out.innerHTML = `<p class="banner">至少要 ${min} 個人。</p>`; return false; }
      return true;
    };
    body.querySelector('#go').addEventListener('click', () => {
      if (sub === 'draw') {
        if (!guard(4)) return;
        // A redraw keeps the counts and puts whoever has played least first.
        setPlay(createOpenPlay(roster.names, courts(), Math.random, play?.stats ?? {}, mixGenders()));
        body.querySelector('#go').textContent = OPEN_PLAY.redraw;
        renderPlay(out);
      } else if (sub === 'rr') {
        if (!guard(4)) return;
        const rounds = roundRobin(roster.names, courts(), Number(body.querySelector('#rounds').value) || 1);
        out.innerHTML = rounds.map(r => `<div class="round"><h3><span>第 ${r.round} 輪</span>${r.resting.length ? `<span class="waiting">休息：${r.resting.join('、')}</span>` : ''}</h3><div class="matches">${r.matches.map(m => matchHtml(m, -1)).join('')}</div></div>`).join('<div style="height:8px"></div>');
      } else {
        if (!guard(4)) return;
        koc = createKingOfCourt(roster.names, courts());
        renderKoc(out);
      }
    });
    // Mixed doubles on or off: the tags show on the roster; courts already
    // playing stay as they are, the next games pair by the tags.
    body.querySelector('#streak')?.addEventListener('input', e => { streakMax = Number(e.target.value) || 3; });
    body.querySelector('#mix')?.addEventListener('change', e => { mix = e.target.checked; saveMix(mix); render(); });
    if (sub === 'koc') renderKoc(out);
    if (sub === 'draw') renderPlay(out);
  };

  const render = () => {
    root.innerHTML = html();
    root.querySelector('#add-form').addEventListener('submit', e => {
      e.preventDefault();
      const v = root.querySelector('#add-name').value.trim();
      if (!v || roster.names.includes(v)) return;
      roster = { names: [...roster.names, v] };
      if (play) setPlay(joinOpenPlay(play, v, Math.random, mixGenders()));
      saveRoster(roster); render();
      root.querySelector('#add-name').focus();
    });
    // A pasted sign-up list: one session goes straight in; several ask which.
    // The names join today's roster (or replace the example list).
    const addNames = names => {
      const fresh = names.filter(n => !roster.names.includes(n));
      roster = { names: [...roster.names, ...fresh] };
      if (play) for (const n of fresh) setPlay(joinOpenPlay(play, n, Math.random, mixGenders()));
      saveRoster(roster); render();
      toast(esc(P.added.replace('{n}', fresh.length)));
    };
    root.querySelector('#paste-read').addEventListener('click', () => {
      const sessions = parseSignup(root.querySelector('#paste-text').value);
      const pick = root.querySelector('#paste-pick');
      if (sessions.length === 0) { pick.innerHTML = `<p class="form-error">${esc(P.none)}</p>`; return; }
      if (sessions.length === 1) { addNames(sessions[0].names); return; }
      pick.innerHTML = `<p class="small"><b>${esc(P.pick)}</b></p><div class="paste-sessions">${sessions.map((s, i) =>
        `<button class="btn" type="button" data-session="${i}">${esc(P.session.replace('{title}', s.title || P.untitled).replace('{n}', s.names.length))}</button>`).join('')}</div>`;
      for (const b of pick.querySelectorAll('[data-session]')) b.addEventListener('click', () => addNames(sessions[Number(b.dataset.session)].names));
    });
    root.querySelector('#clear').addEventListener('click', () => { roster = { names: [] }; koc = null; setPlay(null); saveRoster(roster); render(); });
    for (const b of root.querySelectorAll('[data-sex]')) b.addEventListener('click', () => {
      const n = roster.names[Number(b.dataset.sex)];
      const g = NEXT_GENDER[genders[n] ?? ''];
      genders = { ...genders };
      if (g) genders[n] = g; else delete genders[n];
      saveGenders(genders); render();
    });
    // Tap a name to fix it; a running session follows the new name.
    for (const b of root.querySelectorAll('[data-rename]')) b.addEventListener('click', async () => {
      const i = Number(b.dataset.rename), old = roster.names[i];
      const name = await askRename(old, v => roster.names.includes(v));
      if (!name) return;
      roster = { names: roster.names.map((n, j) => (j === i ? name : n)) };
      if (genders[old]) { genders = { ...genders, [name]: genders[old] }; delete genders[old]; saveGenders(genders); }
      const has = s => s && (s.queue.includes(old) || s.courts.some(c => c.teams.flat().includes(old)) || old in (s.stats ?? {}));
      if (has(play)) setPlay(renamePlayer(play, old, name));
      if (has(koc)) koc = renamePlayer(koc, old, name);
      saveRoster(roster); render();
    });
    for (const b of root.querySelectorAll('[data-remove]')) b.addEventListener('click', () => {
      const gone = roster.names[Number(b.dataset.remove)];
      roster = { names: roster.names.filter((_, i) => i !== Number(b.dataset.remove)) };
      if (play) setPlay(leaveOpenPlay(play, gone));
      koc = null; saveRoster(roster); render();
    });
    for (const t of root.querySelectorAll('.subtab')) t.addEventListener('click', () => { sub = t.dataset.sub; render(); });
    root.querySelector('.handoff-btn').addEventListener('click', () => openHandoff('draw', { roster, play, koc, sub, mix, genders: Object.fromEntries(roster.names.filter(n => genders[n]).map(n => [n, genders[n]])) }));
    renderSub();
  };
  render();

  return {
    hasState: () => roster.names.length > 0 || !!play || !!koc,
    // Scroll to the games: that court's box when given, else the top of the
    // courts. False when no session is on screen.
    revealGames(court) {
      const out = root.querySelector('#out');
      if (!out?.querySelector('.koc-court')) return false;
      const box = court == null ? null : [...out.querySelectorAll('.koc-court')].find(el => el.dataset.court === String(court));
      (box ?? out).scrollIntoView({ block: 'start' });
      return true;
    },
    // The scoreboard finished a game started from here: mark the winner on
    // that court (0 or 1) if the same game is still on it. False otherwise.
    reportWin(link, winnerIndex) {
      const ci = courtOfGame(link.kind === 'koc' ? koc : play, link);
      if (ci < 0) return false;
      if (link.kind === 'koc') { koc = advanceKingOfCourt(koc, ci, winnerIndex, streakMax); sub = 'koc'; }
      else { setPlay(finishOpenPlayGame(play, ci, winnerIndex, Math.random, mixGenders())); sub = 'draw'; }
      render();
      return true;
    },
    // A roster (and open-play / king-of-court session) handed over from another phone.
    receive(data) {
      if (!Array.isArray(data?.roster?.names)) throw new Error('draw: not a draw hand-over');
      roster = data.roster; play = data.play ?? null; koc = data.koc ?? null; sub = data.sub ?? 'draw';
      if (typeof data.mix === 'boolean') { mix = data.mix; saveMix(mix); }
      if (data.genders) { genders = { ...genders, ...cleanGenders(data.genders) }; saveGenders(genders); }
      saveRoster(roster); savePlay(play); render();
    },
  };
}
