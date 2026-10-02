import { renderCourt } from '../court.js';
import { MODES, createMatch, pointWon, undo, announce, serverPosition, sideSwitchDue, markSidesSwitched, other, gamePoint } from '../scoring.js';
import { coinFlip } from '../draw.js';
import { FILTER, SCORE_SETUP } from '../data/nav.js';
import { LANDSCAPE } from './scenes.js';
import { handoffButtonHtml, openHandoff } from './handoff.js';
import { shareButtonHtml, sharePage } from './share.js';

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

function load() {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function save(state) {
  try { state ? localStorage.setItem(KEY, JSON.stringify(state)) : localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
}

function setupHtml(prefill) {
  const p = prefill ?? { target: 11, A: ['甲1', '甲2'], B: ['乙1', '乙2'] };
  const choice = prefill
    ? { play: p.A.length > 1 ? 'doubles' : 'singles', scoring: p.mode === 'fun' ? 'fun' : p.mode.split('-')[0] }
    : defaultChoice();
  const seg = (k, label, options) => `<div class="seg-row"><span class="seg-label">${esc(label)}</span>
    <div class="seg" role="group" aria-label="${esc(label)}">${options.map(o =>
      `<button type="button" data-k="${k}" data-v="${o.id}" aria-pressed="${choice[k] === o.id}">${esc(o.label)}${o.en ? `<span class="seg-en" aria-hidden="true">${esc(o.en)}</span>` : ''}</button>`).join('')}</div></div>`;
  const modes = `<div class="filters">${seg('play', FILTER.play.label, FILTER.play.options)}${seg('scoring', FILTER.scoring.label, SCORING_OPTIONS)}
    <p class="small mode-hint" id="mode-hint"></p></div>
    <input type="hidden" name="mode" value="${modeOf(choice.play, choice.scoring)}">`;
  const names = (team, list) => `<div class="field team-fields-col">
    <div class="team-label"><span class="swatch swatch-${team}"></span>${team === 'A' ? '甲隊' : '乙隊'}</div>
    <input class="input" id="name-${team}-0" value="${esc(list[0] ?? '')}" placeholder="球員 1" maxlength="6">
    <input class="input" id="name-${team}-1" value="${esc(list[1] ?? '')}" placeholder="球員 2" maxlength="6" data-doubles-only>
  </div>`;
  return `<div class="section-head"><div class="head-row"><h2>計分板</h2>${shareButtonHtml()}</div><p class="intro">按誰贏了這一球，站位、換發、喊分自動算好。</p></div>
  <form class="card" id="setup">
    <div class="field"><span class="field-label">${esc(SCORE_SETUP.mode)}</span>${modes}</div>
    <div class="row">
      <div class="field"><label for="target">打到幾分</label><select class="input" id="target">${[7, 11, 15, 21].map(n => `<option value="${n}"${n === p.target ? ' selected' : ''}>${n} 分</option>`).join('')}</select></div>
      <div class="field"><label for="winby">要贏幾分</label><select class="input" id="winby"><option value="2">贏 2 分</option><option value="1">贏 1 分就好</option></select></div>
    </div>
    <div class="team-fields">${names('A', p.A)}${names('B', p.B)}</div>
    <div class="row">
      <div class="field"><label for="first">誰先發球</label><select class="input" id="first"><option value="A">甲隊</option><option value="B">乙隊</option></select></div>
      <div class="field"><label>&nbsp;</label><button type="button" class="btn" id="flip">丟硬幣決定</button></div>
    </div>
    <label class="row" style="align-items:center;gap:8px"><input type="checkbox" id="deciding" style="flex:none;width:20px;height:20px"> <span style="flex:1">這是決勝局（到一半提醒換場）</span></label>
    <button type="submit" class="btn btn-primary btn-block">開始計分</button>
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
  return { players, alt: '目前站位與發球者' };
}

// "雙打・每球得分・打到 11 分": which mode this game is using.
function modeLabel(state) {
  const scoring = state.mode === 'fun' ? SCORE_SETUP.fun : FILTER.scoring.options.find(o => state.mode.startsWith(o.id));
  const play = FILTER.play.options.find(o => o.id === (state.teams.A.names.length > 1 ? 'doubles' : 'singles'));
  return SCORE_SETUP.playing.replace('{play}', play.label).replace('{scoring}', scoring.label).replace('{target}', state.target);
}

// Full screen sits in the bottom toolbar: four corners
// pointing out to enter, pointing in to leave. Where the browser allows it
// (Android, desktop) it is real full screen; where it does not (iPhone Safari,
// the claude.ai preview) the same layout fills the page instead. Either way
// <html> carries .is-fullscreen and the CSS does the rest.
const isFull = () => document.documentElement.classList.contains('is-fullscreen');
function fullscreenIcon() {
  const on = isFull();
  const d = on ? 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5' : 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5';
  const label = esc(on ? SCORE_SETUP.exitFullscreen : SCORE_SETUP.fullscreen);
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg><span class="sr-only">${label}</span>`;
}

function playHtml(state) {
  const A = state.teams.A.names.join('・'), B = state.teams.B.names.join('・');
  const teamName = id => (id === 'A' ? '甲隊' : '乙隊');
  let who = '';
  if (state.finished) who = '';
  else if (state.mode === 'fun') who = '快打模式，只算分數';
  else {
    const pos = serverPosition(state) === 'right' ? '右邊' : '左邊';
    const n = state.mode === 'sideout-doubles' ? `第 ${state.serverNumber} 發球員 ` : '';
    who = `${teamName(state.serving)}發球：${n}${esc(state.server)} 從${pos}發`;
  }
  const gp = gamePoint(state);
  const gpTag = gp.length === 0 ? ''
    : `<div class="game-point">${esc(gp.length === 2 ? SCORE_SETUP.gamePointBoth : SCORE_SETUP.gamePoint.replace('{team}', teamName(gp[0])))}</div>`;
  const banner = sideSwitchDue(state)
    ? `<div class="banner"><span>到一半了，兩隊換場，發球員不變。</span><button class="btn" id="switched">已換場</button></div>` : '';
  const winner = state.finished
    ? `<p class="winner">${teamName(state.winner)}贏了 🎉 ${state.scores.A}-${state.scores.B}</p>` : '';
  return `<div class="board">
    <p class="mode-tag">${esc(modeLabel(state))}</p>
    ${handoffButtonHtml()}
    <div class="announce"><div class="big num" id="big">${esc(announce(state))}</div><div class="who">${who}</div>${gpTag}</div>
    ${banner}${winner}
    ${state.mode === 'fun' ? '' : '<div class="court-wrap" id="board-court"></div>'}
    <div class="score-row${state.sidesSwitched ? ' switched' : ''}">
      <button class="score-btn team-A" id="win-A"${state.finished ? ' disabled' : ''}><span class="pts num">${state.scores.A}</span><span class="name">${esc(A)} 贏這球</span></button>
      <button class="score-btn team-B" id="win-B"${state.finished ? ' disabled' : ''}><span class="pts num">${state.scores.B}</span><span class="name">${esc(B)} 贏這球</span></button>
    </div>
    <div class="toolbar">
      <button class="btn icon-btn" id="undo" aria-label="復原上一球"${state.history.length ? '' : ' disabled'}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/></svg><span class="btn-text">復原</span></button>
      ${state.finished ? '<button class="btn btn-primary" id="again">再來一局</button>' : ''}
      <button class="btn icon-btn" type="button" id="fullscreen" title="${esc(isFull() ? SCORE_SETUP.exitFullscreen : SCORE_SETUP.fullscreen)}">${fullscreenIcon()}</button>
      <button class="btn btn-ghost icon-btn" id="reset" aria-label="重新設定"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg><span class="btn-text">重設</span></button>
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
const lieDown = () => LANDSCAPE.matches || isFull();

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

export function mountScoreboard(root) {
  let state = load();
  let prefill = null;
  // While a game is on screen the view is marked .score-playing: on phones the
  // top bar and the page title fold away (styles/main.css) and the screen stays on.
  const onScore = () => location.hash.replace(/^#/, '').split('/')[0] === 'score';
  const syncPlaying = () => {
    const playing = !!state && onScore();
    root.classList.toggle('score-playing', playing);
    if (!playing && isFull() && !document.fullscreenElement) setFull(false);
    keepAwake(playing && !state.finished);
  };
  // CSS gives the board the whole screen while <html> has .is-fullscreen.
  const setFull = on => {
    document.documentElement.classList.toggle('is-fullscreen', on);
    const court = root.querySelector('#board-court');
    if (court && state) renderCourt(court, courtScene(state), { landscape: lieDown() });
    const b = root.querySelector('#fullscreen');
    if (b) { b.innerHTML = fullscreenIcon(); b.title = on ? SCORE_SETUP.exitFullscreen : SCORE_SETUP.fullscreen; }
  };
  window.addEventListener('hashchange', syncPlaying);
  document.addEventListener('visibilitychange', syncPlaying);

  const renderSetup = () => {
    root.innerHTML = setupHtml(prefill);
    root.querySelector('.section-head .share-btn').addEventListener('click', () => sharePage('計分板'));
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
      form.querySelector('#flip').textContent = `硬幣說：${form.first.value === 'A' ? '甲隊' : '乙隊'}先發`;
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const mode = form.mode.value;
      const doubles = pick('play') === 'doubles';
      const names = id => {
        const list = [form[`name-${id}-0`].value.trim() || (id === 'A' ? '甲1' : '乙1')];
        if (doubles) list.push(form[`name-${id}-1`].value.trim() || (id === 'A' ? '甲2' : '乙2'));
        return list;
      };
      state = createMatch({
        mode, target: Number(form.target.value), winBy: Number(form.winby.value),
        teams: { A: names('A'), B: names('B') }, firstServer: form.first.value, decidingGame: form.deciding.checked,
      });
      save(state); renderPlay();
      window.scrollTo({ top: 0 });
    });
  };

  const renderPlay = () => {
    root.innerHTML = `<div class="section-head"><h2>計分板</h2></div><div class="card">${playHtml(state)}</div>`;
    syncPlaying();
    // The last 10 rallies travel with the hand-over so the next scorekeeper can still undo.
    root.querySelector('.handoff-btn').addEventListener('click', () => openHandoff('score', { ...state, history: state.history.slice(-10) }));
    root.querySelector('#fullscreen').addEventListener('click', async () => {
      if (document.fullscreenElement) { await document.exitFullscreen().catch(() => {}); return; }
      if (isFull()) { setFull(false); return; }
      if (document.fullscreenEnabled) {
        try { await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); return; } catch { /* refused: fall back to the in-page layout */ }
      }
      setFull(true);
    });
    const court = root.querySelector('#board-court');
    if (court) renderCourt(court, courtScene(state), { landscape: lieDown() });
    const update = next => { state = next; save(state); renderPlay(); };
    root.querySelector('#win-A').addEventListener('click', () => update(pointWon(state, 'A')));
    root.querySelector('#win-B').addEventListener('click', () => update(pointWon(state, 'B')));
    root.querySelector('#undo').addEventListener('click', () => update(undo(state)));
    root.querySelector('#switched')?.addEventListener('click', () => update(markSidesSwitched(state)));
    root.querySelector('#again')?.addEventListener('click', () => {
      update(createMatch({
        mode: state.mode, target: state.target, winBy: state.winBy,
        teams: { A: state.teams.A.names, B: state.teams.B.names },
        firstServer: other(state.winner), decidingGame: false,
      }));
    });
    const reset = () => {
      prefill = { mode: state.mode, target: state.target, A: state.teams.A.names, B: state.teams.B.names };
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

  // Real full screen follows the browser (Esc, back gesture); the in-page one
  // ends with Esc too.
  document.addEventListener('fullscreenchange', () => setFull(!!document.fullscreenElement));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isFull() && !document.fullscreenElement) setFull(false); });

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
    // A match handed over from another phone. Throws on anything that is not one.
    receive(data) {
      if (!MODES.includes(data?.mode) || !data.scores || !data.teams?.A || !Array.isArray(data.history)) throw new Error('scoreboard: not a match');
      state = data; save(state); renderPlay();
    },
  };
}
