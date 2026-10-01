import { renderCourt } from '../court.js';
import { createMatch, pointWon, undo, announce, serverPosition, sideSwitchDue, markSidesSwitched, other } from '../scoring.js';
import { coinFlip } from '../draw.js';
import { FILTER, SCORE_SETUP } from '../data/nav.js';

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
      `<button type="button" data-k="${k}" data-v="${o.id}" aria-pressed="${choice[k] === o.id}"${o.en ? ` aria-label="${esc(o.label)}" title="${esc(o.label)}"` : ''}>${esc(o.en ?? o.label)}</button>`).join('')}</div></div>`;
  const modes = `<div class="filters">${seg('play', FILTER.play.label, FILTER.play.options)}${seg('scoring', FILTER.scoring.label, SCORING_OPTIONS)}
    <p class="small mode-hint" id="mode-hint"></p></div>
    <input type="hidden" name="mode" value="${modeOf(choice.play, choice.scoring)}">`;
  const names = (team, list) => `<div class="field team-fields-col">
    <div class="team-label"><span class="swatch swatch-${team}"></span>${team === 'A' ? '甲隊' : '乙隊'}</div>
    <input class="input" id="name-${team}-0" value="${esc(list[0] ?? '')}" placeholder="球員 1" maxlength="6">
    <input class="input" id="name-${team}-1" value="${esc(list[1] ?? '')}" placeholder="球員 2" maxlength="6" data-doubles-only>
  </div>`;
  return `<div class="section-head"><h2>計分板</h2><p class="intro">按誰贏了這一球，站位、換發、喊分自動算好。</p></div>
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

// "雙打・Rally・打到 11 分": which mode this game is using.
function modeLabel(state) {
  const scoring = state.mode === 'fun' ? SCORE_SETUP.fun : FILTER.scoring.options.find(o => state.mode.startsWith(o.id));
  const play = FILTER.play.options.find(o => o.id === (state.teams.A.names.length > 1 ? 'doubles' : 'singles'));
  return SCORE_SETUP.playing.replace('{play}', play.label).replace('{scoring}', scoring.en ?? scoring.label).replace('{target}', state.target);
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
  const banner = sideSwitchDue(state)
    ? `<div class="banner"><span>到一半了，兩隊換場，發球員不變。</span><button class="btn" id="switched">已換場</button></div>` : '';
  const winner = state.finished
    ? `<p class="winner">${teamName(state.winner)}贏了 🎉 ${state.scores.A}-${state.scores.B}</p>` : '';
  return `<div class="board">
    <p class="mode-tag">${esc(modeLabel(state))}</p>
    <div class="announce"><div class="big num" id="big">${esc(announce(state))}</div><div class="who">${who}</div></div>
    ${banner}${winner}
    <div class="score-row">
      <button class="score-btn team-A" id="win-A"${state.finished ? ' disabled' : ''}><span class="pts num">${state.scores.A}</span><span class="name">${esc(A)} 贏這球</span></button>
      <button class="score-btn team-B" id="win-B"${state.finished ? ' disabled' : ''}><span class="pts num">${state.scores.B}</span><span class="name">${esc(B)} 贏這球</span></button>
    </div>
    <div class="toolbar">
      <button class="btn" id="undo"${state.history.length ? '' : ' disabled'}>復原上一球</button>
      ${state.finished ? '<button class="btn btn-primary" id="again">再來一局</button>' : ''}
      <button class="btn btn-ghost" id="reset">重新設定</button>
    </div>
    ${state.mode === 'fun' ? '' : '<div class="court-wrap" id="board-court"></div>'}
  </div>`;
}

export function mountScoreboard(root) {
  let state = load();
  let prefill = null;

  const renderSetup = () => {
    root.innerHTML = setupHtml(prefill);
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
    });
  };

  const renderPlay = () => {
    root.innerHTML = `<div class="section-head"><h2>計分板</h2></div><div class="card">${playHtml(state)}</div>`;
    const court = root.querySelector('#board-court');
    if (court) renderCourt(court, courtScene(state));
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
    root.querySelector('#reset').addEventListener('click', () => {
      prefill = { mode: state.mode, target: state.target, A: state.teams.A.names, B: state.teams.B.names };
      state = null; save(null); renderSetup();
    });
  };

  if (state) renderPlay(); else renderSetup();
}
