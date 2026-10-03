import { renderCourt } from '../court.js';
import { MODES, createMatch, pointWon, undo, announce, serverPosition, sideSwitchDue, markSidesSwitched, other, gamePoint } from '../scoring.js';
import { coinFlip } from '../draw.js';
import { FILTER, SCORE_SETUP, DRAW_SCORE as D, SCORE_SHARE, SCORE_TEXT as T } from '../data/nav.js';

const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);
import { openShareSheet, CAMERA_ICON } from './sharecard.js';
import { recordGame, unrecordGame } from './record.js';
import { LANDSCAPE } from './scenes.js';
import { handoffButtonHtml, openHandoff } from './handoff.js';
import { shareButtonHtml, sharePage } from './share.js';
import { isFull, toggleFull, exitFull, onFullChange, fullIcon } from './fullscreen.js';

const KEY = 'picobo.match';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Mode = play (doubles / singles) x scoring (side-out / rally), or the
// plain-counter fun mode. Defaults follow the rules filter when one is saved.
const SCORING_OPTIONS = [...FILTER.scoring.options, SCORE_SETUP.fun];
const modeOf = (play, scoring) => (scoring === 'fun' ? 'fun' : `${scoring}-${play}`);
function defaultChoice() {
  try {
    const f = JSON.parse(localStorage.getItem('picobo.rulesFilter'));
    if (f && FILTER.play.options.some(o => o.id === f.play) && FILTER.scoring.options.some(o => o.id === f.scoring)) return f;
  } catch { /* storage unavailable or corrupt */ }
  return { play: 'doubles', scoring: 'sideout' };
}

// The last game's settings (mode, target, win by), so a game sent over
// from 抽籤 can start straight away.
const SETTINGS_KEY = 'picobo.scoreSettings';
function loadSettings() {
  try {
    const v = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (v && MODES.includes(v.mode) && Number.isInteger(v.target) && Number.isInteger(v.winBy)) return v;
  } catch { /* storage unavailable or corrupt */ }
  return null;
}
function saveSettings(v) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(v)); } catch { /* storage unavailable */ }
}

function load() {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function save(state) {
  try { state ? localStorage.setItem(KEY, JSON.stringify(state)) : localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
}

function setupHtml(prefill) {
  const p = prefill ?? { target: 11, A: T.placeholders.A.slice(), B: T.placeholders.B.slice() };
  // A game from 抽籤 brings names (and who serves first) but no mode.
  const choice = prefill?.mode
    ? { play: p.A.length > 1 ? 'doubles' : 'singles', scoring: p.mode === 'fun' ? 'fun' : p.mode.split('-')[0] }
    : { ...defaultChoice(), ...(prefill ? { play: p.A.length > 1 ? 'doubles' : 'singles' } : {}) };
  const target = p.target ?? 11;
  const seg = (k, label, options) => `<div class="seg-row"><span class="seg-label">${esc(label)}</span>
    <div class="seg" role="group" aria-label="${esc(label)}">${options.map(o =>
      `<button type="button" data-k="${k}" data-v="${o.id}" aria-pressed="${choice[k] === o.id}">${esc(o.label)}${o.en ? `<span class="seg-en" aria-hidden="true">${esc(o.en)}</span>` : ''}</button>`).join('')}</div></div>`;
  const modes = `<div class="filters">${seg('play', FILTER.play.label, FILTER.play.options)}${seg('scoring', FILTER.scoring.label, SCORING_OPTIONS)}
    <p class="small mode-hint" id="mode-hint"></p></div>
    <input type="hidden" name="mode" value="${modeOf(choice.play, choice.scoring)}">`;
  const names = (team, list) => `<div class="field team-fields-col">
    <div class="team-label"><span class="swatch swatch-${team}"></span>${esc(T.teams[team])}</div>
    <input class="input" id="name-${team}-0" value="${esc(list[0] ?? '')}" placeholder="${esc(fill(T.player, { n: 1 }))}" maxlength="6">
    <input class="input" id="name-${team}-1" value="${esc(list[1] ?? '')}" placeholder="${esc(fill(T.player, { n: 2 }))}" maxlength="6" data-doubles-only>
  </div>`;
  return `<div class="section-head"><div class="head-row"><h2>${esc(T.title)}</h2>${shareButtonHtml()}</div><p class="intro">${esc(T.intro)}</p></div>
  <form class="card" id="setup">
    ${p.from ? `<p class="small from-draw">${esc(D.from.replace('{court}', p.from.court))}</p>` : ''}
    <div class="field"><span class="field-label">${esc(SCORE_SETUP.mode)}</span>${modes}</div>
    <div class="row">
      <div class="field"><label for="target">${esc(T.target)}</label><select class="input" id="target">${[7, 11, 15, 21].map(n => `<option value="${n}"${n === target ? ' selected' : ''}>${esc(fill(T.points, { n }))}</option>`).join('')}</select></div>
      <div class="field"><label for="winby">${esc(T.winBy)}</label><select class="input" id="winby"><option value="2">${esc(T.winBy2)}</option><option value="1">${esc(T.winBy1)}</option></select></div>
    </div>
    <div class="team-fields">${names('A', p.A)}${names('B', p.B)}</div>
    <div class="row">
      <div class="field"><label for="first">${esc(T.first)}</label><select class="input" id="first"><option value="A">${esc(T.teams.A)}</option><option value="B"${p.first === 'B' ? ' selected' : ''}>${esc(T.teams.B)}</option></select></div>
      <div class="field"><label>&nbsp;</label><button type="button" class="btn" id="flip">${esc(T.flip)}</button></div>
    </div>
    <label class="row" style="align-items:center;gap:8px"><input type="checkbox" id="deciding" style="flex:none;width:20px;height:20px"> <span style="flex:1">${esc(T.deciding)}</span></label>
    <button type="submit" class="btn btn-primary btn-block">${esc(T.start)}</button>
  </form>`;
}

function courtScene(state) {
  const nearTeam = state.sidesSwitched ? 'B' : 'A';
  const players = [];
  for (const id of ['A', 'B']) {
    const team = state.teams[id];
    const side = id === nearTeam ? 'near' : 'far';
    if (team.positions) {
      for (const pos of ['right', 'left']) {
        const name = team.positions[pos];
        const serving = state.server === name && state.serving === id;
        players.push({ team: id, side, pos, label: name, serving, depth: serving ? 'behind' : 'baseline' });
      }
    } else {
      const serving = state.serving === id;
      const pos = serving ? (state.scores[id] % 2 === 0 ? 'right' : 'left') : (state.scores[other(id)] % 2 === 0 ? 'right' : 'left');
      players.push({ team: id, side, pos, label: team.names[0], serving, depth: serving ? 'behind' : 'baseline' });
    }
  }
  return { players, alt: T.alt };
}

// "雙打・每球得分・打到 11 分": which mode this game is using.
function modeLabel(state) {
  const scoring = state.mode === 'fun' ? SCORE_SETUP.fun : FILTER.scoring.options.find(o => state.mode.startsWith(o.id));
  const play = FILTER.play.options.find(o => o.id === (state.teams.A.names.length > 1 ? 'doubles' : 'singles'));
  return SCORE_SETUP.playing.replace('{play}', play.label).replace('{scoring}', scoring.label).replace('{target}', state.target);
}

// Full screen is a quiet icon in the board's top-left corner (share takes
// the top-right); src/ui/fullscreen.js does the work.
const fullscreenIcon = () => fullIcon(SCORE_SETUP);

function playHtml(state) {
  const A = state.teams.A.names.join('・'), B = state.teams.B.names.join('・');
  const teamName = id => T.teams[id];
  let who = '';
  if (state.finished) who = '';
  else if (state.mode === 'fun') who = esc(T.fun);
  else {
    const n = state.mode === 'sideout-doubles' ? fill(T.serverN, { n: state.serverNumber }) : '';
    who = esc(fill(T.serving, { team: teamName(state.serving), n, name: state.server, pos: T.pos[serverPosition(state)] }));
  }
  const gp = gamePoint(state);
  const gpTag = gp.length === 0 ? ''
    : `<div class="game-point">${esc(gp.length === 2 ? SCORE_SETUP.gamePointBoth : SCORE_SETUP.gamePoint.replace('{team}', teamName(gp[0])))}</div>`;
  const banner = sideSwitchDue(state)
    ? `<div class="banner"><span>${esc(T.switchSides)}</span><button class="btn" id="switched">${esc(T.switched)}</button></div>` : '';
  const winner = state.finished
    ? `<p class="winner">${esc(fill(T.won, { team: teamName(state.winner), a: state.scores.A, b: state.scores.B }))}</p>` : '';
  return `<div class="board">
    <p class="mode-tag">${esc(modeLabel(state))}</p>
    <button class="fs-btn" type="button" id="fullscreen" title="${esc(isFull() ? SCORE_SETUP.exitFullscreen : SCORE_SETUP.fullscreen)}">${fullscreenIcon()}</button>
    ${handoffButtonHtml()}
    <div class="announce"><div class="big num" id="big">${esc(announce(state))}</div><div class="who">${who}</div>${gpTag}</div>
    ${banner}${winner}
    ${state.mode === 'fun' ? '' : '<div class="court-wrap" id="board-court"></div>'}
    <div class="score-row${state.sidesSwitched ? ' switched' : ''}">
      <button class="score-btn team-A" id="win-A"${state.finished ? ' disabled' : ''}><span class="pts num">${state.scores.A}</span><span class="name">${esc(fill(T.rallyWon, { names: A }))}</span></button>
      <button class="score-btn team-B" id="win-B"${state.finished ? ' disabled' : ''}><span class="pts num">${state.scores.B}</span><span class="name">${esc(fill(T.rallyWon, { names: B }))}</span></button>
    </div>
    ${state.finished && state.from ? `<button class="btn btn-primary btn-block" id="to-draw">${esc(D.back.replace('{names}', state.teams[state.winner].names.join('・')))}</button>` : ''}
    <div class="toolbar${state.finished ? ' is-finished' : ''}">
      <button class="btn icon-btn" id="undo" aria-label="${esc(T.undo)}"${state.history.length ? '' : ' disabled'}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/></svg><span class="btn-text">${esc(T.undo)}</span></button>
      ${state.finished ? `<button class="btn${state.from ? '' : ' btn-primary'}" id="again">${esc(T.again)}</button><button class="btn icon-btn" id="share-score" aria-label="${esc(SCORE_SHARE.open)}">${CAMERA_ICON}<span class="lbl-long" aria-hidden="true">${esc(SCORE_SHARE.open)}</span><span class="lbl-short" aria-hidden="true">${esc(SCORE_SHARE.ig)}</span></button>` : ''}
      <button class="btn btn-ghost icon-btn" id="reset" aria-label="${esc(T.reset)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg><span class="btn-text">${esc(T.reset)}</span></button>
    </div>
  </div>`;
}

// Keeps the phone screen on while a game is being scored. The browser drops
// the lock when the page is hidden, so it is taken again on return.
let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && !wakeLock && navigator.wakeLock && document.visibilityState === 'visible') {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch { wakeLock = null; /* not allowed here (iframe, battery saver): screen just dims as usual */ }
}

// Phones, and any screen in full screen, show the court lying down.
const lieDown = () => LANDSCAPE.matches || isFull('score');

// A small yes/no sheet; resolves true for yes.
function confirmSheet(t) {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.className = 'install-sheet';
    dlg.innerHTML = `<b>${esc(t.title)}</b><p>${esc(t.body)}</p>
      <div class="toolbar"><button class="btn btn-ghost" type="button" data-yes>${esc(t.yes)}</button><button class="btn btn-primary" type="button" data-no>${esc(t.no)}</button></div>`;
    const done = ok => { dlg.close(); dlg.remove(); resolve(ok); };
    dlg.querySelector('[data-yes]').addEventListener('click', () => done(true));
    dlg.querySelector('[data-no]').addEventListener('click', () => done(false));
    dlg.addEventListener('cancel', e => { e.preventDefault(); done(false); });
    dlg.addEventListener('click', e => { if (e.target === dlg) done(false); });
    document.body.append(dlg);
    dlg.showModal();
  });
}

export function mountScoreboard(root, { toDraw } = {}) {
  let state = load();
  let prefill = null;
  // While a game is on screen the view is marked .score-playing: on phones the
  // top bar and the page title fold away (styles/main.css) and the screen stays on.
  const onScore = () => location.hash.replace(/^#/, '').split('/')[0] === 'score';
  const syncPlaying = () => {
    const playing = !!state && onScore();
    root.classList.toggle('score-playing', playing);
    if (!playing && isFull('score')) exitFull();
    keepAwake(playing && !state.finished);
  };
  // CSS gives the board the whole screen while <html> has .is-fullscreen;
  // redraw the court (it lies down) and flip the icon.
  onFullChange(on => {
    const court = root.querySelector('#board-court');
    if (court && state) renderCourt(court, courtScene(state), { landscape: lieDown() });
    const b = root.querySelector('#fullscreen');
    if (b) { b.innerHTML = fullscreenIcon(); b.title = on ? SCORE_SETUP.exitFullscreen : SCORE_SETUP.fullscreen; }
  });
  window.addEventListener('hashchange', syncPlaying);
  document.addEventListener('visibilitychange', syncPlaying);

  const renderSetup = () => {
    root.innerHTML = setupHtml(prefill);
    root.querySelector('.section-head .share-btn').addEventListener('click', () => sharePage(T.title));
    const form = root.querySelector('#setup');
    const pick = k => form.querySelector(`[data-k="${k}"][aria-pressed="true"]`).dataset.v;
    const syncMode = () => {
      const play = pick('play'), scoring = pick('scoring');
      const mode = modeOf(play, scoring);
      form.mode.value = mode;
      form.querySelector('#mode-hint').textContent = SCORE_SETUP.hints[mode];
      for (const el of form.querySelectorAll('[data-doubles-only]')) el.hidden = play !== 'doubles';
      if (mode === 'fun') { form.winby.value = '1'; }
      if (mode === 'fun' && !prefill) { form.target.value = '7'; }
    };
    form.addEventListener('click', e => {
      const b = e.target.closest('[data-k]');
      if (!b) return;
      for (const x of form.querySelectorAll(`[data-k="${b.dataset.k}"]`)) x.setAttribute('aria-pressed', String(x === b));
      syncMode();
    });
    syncMode();
    form.querySelector('#flip').addEventListener('click', () => {
      form.first.value = coinFlip();
      form.querySelector('#flip').textContent = fill(T.flipped, { team: T.teams[form.first.value] });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const mode = form.mode.value;
      const doubles = pick('play') === 'doubles';
      const names = id => {
        const list = [form[`name-${id}-0`].value.trim() || T.placeholders[id][0]];
        if (doubles) list.push(form[`name-${id}-1`].value.trim() || T.placeholders[id][1]);
        return list;
      };
      state = createMatch({
        mode, target: Number(form.target.value), winBy: Number(form.winby.value),
        teams: { A: names('A'), B: names('B') }, firstServer: form.first.value, decidingGame: form.deciding.checked,
      });
      saveSettings({ mode, target: state.target, winBy: state.winBy });
      // Which 抽籤 game this is, so the result can go back there.
      if (prefill?.from) state.from = prefill.from;
      save(state); renderPlay();
      window.scrollTo({ top: 0 });
    });
  };

  const renderPlay = () => {
    root.innerHTML = `<div class="section-head"><h2>${esc(T.title)}</h2></div><div class="card">${playHtml(state)}</div>`;
    syncPlaying();
    // The last 10 rallies travel with the hand-over so the next scorekeeper can still undo.
    root.querySelector('.handoff-btn').addEventListener('click', () => openHandoff('score', { ...state, from: undefined, recordId: undefined, history: state.history.slice(-10) }));
    root.querySelector('#fullscreen').addEventListener('click', () => toggleFull('score'));
    const court = root.querySelector('#board-court');
    if (court) renderCourt(court, courtScene(state), { landscape: lieDown() });
    // A game that just ended goes into 我的戰績 (src/ui/record.js); undoing
    // the last rally of a finished game takes it out again.
    const update = next => {
      if (next.finished && !state.finished) {
        next = { ...next, recordId: recordGame({ source: 'score', teams: [next.teams.A.names, next.teams.B.names], scores: [next.scores.A, next.scores.B], winner: next.winner === 'A' ? 0 : 1 }) };
      }
      state = next; save(state); renderPlay();
    };
    root.querySelector('#win-A').addEventListener('click', () => update(pointWon(state, 'A')));
    root.querySelector('#win-B').addEventListener('click', () => update(pointWon(state, 'B')));
    root.querySelector('#undo').addEventListener('click', () => {
      if (state.finished) unrecordGame(state.recordId);
      update(undo(state));
    });
    // A finished game as a picture for IG and friends (src/ui/sharecard.js).
    root.querySelector('#share-score')?.addEventListener('click', () => openShareSheet('score', state));
    root.querySelector('#switched')?.addEventListener('click', () => update(markSidesSwitched(state)));
    root.querySelector('#again')?.addEventListener('click', () => {
      update(createMatch({
        mode: state.mode, target: state.target, winBy: state.winBy,
        teams: { A: state.teams.A.names, B: state.teams.B.names },
        firstServer: other(state.winner), decidingGame: false,
      }));
    });
    // Back to 抽籤 with the winner; the board goes back to a blank setup.
    root.querySelector('#to-draw')?.addEventListener('click', () => {
      const { from, winner } = state;
      state = null; prefill = null; save(null); renderSetup(); syncPlaying();
      toDraw?.(from, winner === 'A' ? 0 : 1);
    });
    const reset = () => {
      prefill = { mode: state.mode, target: state.target, A: state.teams.A.names, B: state.teams.B.names, from: state.from };
      state = null; save(null); renderSetup(); syncPlaying();
    };
    // Reset sits at the far end of the row and asks first once a game is under way.
    root.querySelector('#reset').addEventListener('click', () => {
      if (state.history.length === 0 || state.finished) { reset(); return; }
      confirmSheet(SCORE_SETUP.resetConfirm).then(ok => { if (ok) reset(); });
    });
  };

  // Phones lie the court down (甲 on the left, under 甲's button); redraw
  // when the width crosses the breakpoint.
  LANDSCAPE.addEventListener('change', () => {
    const court = root.querySelector('#board-court');
    if (court && state) renderCourt(court, courtScene(state), { landscape: lieDown() });
  });


  if (state) renderPlay(); else renderSetup();

  return {
    hasState: () => !!state,
    // From a rule page's 到計分板試打: pick that mode on the setup screen.
    // A match in progress stays; returns false so the caller can say why.
    preset(play, scoring) {
      if (state) return false;
      for (const [k, v] of [['play', play], ['scoring', scoring]]) root.querySelector(`#setup [data-k="${k}"][data-v="${v}"]`)?.click();
      return true;
    },
    // A game from 抽籤 ({ kind, court, teams, first }): the setup screen with
    // those names. A game still being scored here is only replaced if the
    // scorer says so; resolves false when they keep it.
    async fromDraw(link) {
      if (state && !state.finished && state.history.length > 0) {
        const t = { ...D.busy, body: D.busy.body.replace('{court}', link.court) };
        if (!(await confirmSheet(t))) return false;
      }
      state = null; save(null);
      prefill = { A: link.teams[0], B: link.teams[1], first: link.first, from: link };
      // Played here before: same settings, start scoring now (重新設定 changes
      // them). A 抽籤 game is always doubles. First time: the setup screen.
      const last = loadSettings();
      if (!last) { renderSetup(); syncPlaying(); return true; }
      const mode = last.mode === 'fun' ? 'fun' : last.mode.replace(/-singles$/, '-doubles');
      state = createMatch({ mode, target: last.target, winBy: last.winBy, teams: { A: link.teams[0], B: link.teams[1] }, firstServer: link.first });
      state.from = link;
      save(state); renderPlay();
      return true;
    },
    // A match handed over from another phone. Throws on anything that is not one.
    receive(data) {
      if (!MODES.includes(data?.mode) || !data.scores || !data.teams?.A || !Array.isArray(data.history)) throw new Error('scoreboard: not a match');
      state = data; save(state); renderPlay();
    },
  };
}
