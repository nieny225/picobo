import { renderCourt } from '../court.js';
import { MODES, createMatch, pointWon, undo, announce, serverPosition, sideSwitchDue, markSidesSwitched, other, gamePoint } from '../scoring.js';
import { coinFlip } from '../draw.js';
import { FILTER, SCORE_SETUP, DRAW_SCORE as D, SCORE_SHARE } from '../data/nav.js';
import { openShareSheet } from './sharecard.js';
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
  const p = prefill ?? { target: 11, A: ['甲1', '甲2'], B: ['乙1', '乙2'] };
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
    <div class="team-label"><span class="swatch swatch-${team}"></span>${team === 'A' ? '甲隊' : '乙隊'}</div>
    <input class="input" id="name-${team}-0" value="${esc(list[0] ?? '')}" placeholder="球員 1" maxlength="6">
    <input class="input" id="name-${team}-1" value="${esc(list[1] ?? '')}" placeholder="球員 2" maxlength="6" data-doubles-only>
  </div>`;
  return `<div class="section-head"><div class="head-row"><h2>計分板</h2>${shareButtonHtml()}</div><p class="intro">按誰贏了這一球，站位、換發、喊分自動算好。</p></div>
  <form class="card" id="setup">
    ${p.from ? `<p class="small from-draw">${esc(D.from.replace('{court}', p.from.court))}</p>` : ''}
    <div class="field"><span class="field-label">${esc(SCORE_SETUP.mode)}</span>${modes}</div>
    <div class="row">
      <div class="field"><label for="target">打到幾分</label><select class="input" id="target">${[7, 11, 15, 21].map(n => `<option value="${n}"${n === target ? ' selected' : ''}>${n} 分</option>`).join('')}</select></div>
      <div class="field"><label for="winby">要贏幾分</label><select class="input" id="winby"><option value="2">贏 2 分</option><option value="1">贏 1 分就好</option></select></div>
    </div>
    <div class="team-fields">${names('A', p.A)}${names('B', p.B)}</div>
    <div class="row">
      <div class="field"><label for="first">誰先發球</label><select class="input" id="first"><option value="A">甲隊</option><option value="B"${p.first === 'B' ? ' selected' : ''}>乙隊</option></select></div>
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

// Full screen is a quiet icon in the board's top-left corner (share takes
// the top-right); src/ui/fullscreen.js does the work.
const fullscreenIcon = () => fullIcon(SCORE_SETUP);

// The same three-dot share icon as the page share button.
const SHARE_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';

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
    <button class="fs-btn" type="button" id="fullscreen" title="${esc(isFull() ? SCORE_SETUP.exitFullscreen : SCORE_SETUP.fullscreen)}">${fullscreenIcon()}</button>
    ${handoffButtonHtml()}
    <div class="announce"><div class="big num" id="big">${esc(announce(state))}</div><div class="who">${who}</div>${gpTag}</div>
    ${banner}${winner}
    ${state.mode === 'fun' ? '' : '<div class="court-wrap" id="board-court"></div>'}
    <div class="score-row${state.sidesSwitched ? ' switched' : ''}">
      <button class="score-btn team-A" id="win-A"${state.finished ? ' disabled' : ''}><span class="pts num">${state.scores.A}</span><span class="name">${esc(A)} 贏這球</span></button>
      <button class="score-btn team-B" id="win-B"${state.finished ? ' disabled' : ''}><span class="pts num">${state.scores.B}</span><span class="name">${esc(B)} 贏這球</span></button>
    </div>
    <div class="toolbar">
      <button class="btn icon-btn" id="undo" aria-label="復原上一球"${state.history.length ? '' : ' disabled'}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/></svg><span class="btn-text">復原上一球</span></button>
      ${state.finished && state.from ? `<button class="btn btn-primary" id="to-draw">${esc(D.back.replace('{names}', state.teams[state.winner].names.join('・')))}</button>` : ''}
      ${state.finished ? `<button class="btn${state.from ? '' : ' btn-primary'}" id="again">再來一局</button><button class="btn icon-btn" id="share-score">${SHARE_ICON}<span class="btn-text">${esc(SCORE_SHARE.open)}</span></button>` : ''}
      <button class="btn btn-ghost icon-btn" id="reset" aria-label="重新設定"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg><span class="btn-text">重新設定</span></button>
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
      saveSettings({ mode, target: state.target, winBy: state.winBy });
      // Which 抽籤 game this is, so the result can go back there.
      if (prefill?.from) state.from = prefill.from;
      save(state); renderPlay();
      window.scrollTo({ top: 0 });
    });
  };

  const renderPlay = () => {
    root.innerHTML = `<div class="section-head"><h2>計分板</h2></div><div class="card">${playHtml(state)}</div>`;
    syncPlaying();
    // The last 10 rallies travel with the hand-over so the next scorekeeper can still undo.
    root.querySelector('.handoff-btn').addEventListener('click', () => openHandoff('score', { ...state, from: undefined, history: state.history.slice(-10) }));
    root.querySelector('#fullscreen').addEventListener('click', () => toggleFull('score'));
    const court = root.querySelector('#board-court');
    if (court) renderCourt(court, courtScene(state), { landscape: lieDown() });
    const update = next => { state = next; save(state); renderPlay(); };
    root.querySelector('#win-A').addEventListener('click', () => update(pointWon(state, 'A')));
    root.querySelector('#win-B').addEventListener('click', () => update(pointWon(state, 'B')));
    root.querySelector('#undo').addEventListener('click', () => update(undo(state)));
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
