import { renderCourt } from '../court.js';
import { createMatch, pointWon, undo, announce, serverPosition, sideSwitchDue, markSidesSwitched, other } from '../scoring.js';
import { coinFlip } from '../draw.js';

const KEY = 'picobo.match';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const MODES = [
  { id: 'sideout-doubles', name: '正統雙打', desc: '側出計分、兩個發球員、喊三個數字' },
  { id: 'rally-doubles', name: '每球得分雙打', desc: '每球都得分、誰贏誰發' },
  { id: 'sideout-singles', name: '正統單打', desc: '側出計分、偶右奇左' },
  { id: 'fun', name: '快打／趣味', desc: '只算分數，不管發球' },
];

function load() {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function save(state) {
  try { state ? localStorage.setItem(KEY, JSON.stringify(state)) : localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
}

function setupHtml(prefill) {
  const p = prefill ?? { mode: 'sideout-doubles', target: 11, A: ['甲1', '甲2'], B: ['乙1', '乙2'] };
  const modes = MODES.map(m => `<label class="mode-card"><input type="radio" name="mode" value="${m.id}" id="mode-${m.id}"${m.id === p.mode ? ' checked' : ''}><b>${m.name}</b><span>${m.desc}</span></label>`).join('');
  const names = (team, list) => `<div class="field team-fields-col">
    <div class="team-label"><span class="swatch swatch-${team}"></span>${team === 'A' ? '甲隊' : '乙隊'}</div>
    <input class="input" id="name-${team}-0" value="${esc(list[0] ?? '')}" placeholder="球員 1" maxlength="6">
    <input class="input" id="name-${team}-1" value="${esc(list[1] ?? '')}" placeholder="球員 2" maxlength="6" data-doubles-only>
  </div>`;
  return `<div class="section-head"><h2>計分板</h2><p class="intro">按誰贏了這一球，站位、換發、喊分自動算好。</p></div>
  <form class="card" id="setup">
    <div class="field"><label>模式</label><div class="mode-grid">${modes}</div></div>
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
    <div class="announce"><div class="big num" id="big">${esc(announce(state))}</div><div class="who">${who}</div></div>
    ${banner}${winner}
    <div class="score-row">
      <button class="score-btn team-A" id="win-A"${state.finished ? ' disabled' : ''}><span class="pts num">${state.scores.A}</span><span class="name">${esc(A)} 贏這球</span></button>
      <button class="score-btn team-B" id="win-B"${state.finished ? ' disabled' : ''}><span class="pts num">${state.scores.B}</span><span class="name">${esc(B)} 贏這球</span></button>
    </div>
    ${state.mode === 'fun' ? '' : '<div class="court-wrap" id="board-court"></div>'}
    <div class="toolbar">
      <button class="btn" id="undo"${state.history.length ? '' : ' disabled'}>復原上一球</button>
      ${state.finished ? '<button class="btn btn-primary" id="again">再來一局</button>' : ''}
      <button class="btn btn-ghost" id="reset">重新設定</button>
    </div>
  </div>`;
}

export function mountScoreboard(root) {
  let state = load();
  let prefill = null;

  const renderSetup = () => {
    root.innerHTML = setupHtml(prefill);
    const form = root.querySelector('#setup');
    const syncMode = () => {
      const mode = form.mode.value;
      const doubles = mode === 'sideout-doubles' || mode === 'rally-doubles';
      for (const el of form.querySelectorAll('[data-doubles-only]')) el.hidden = !doubles;
      if (mode === 'fun') { form.winby.value = '1'; }
      if (mode === 'fun' && !prefill) { form.target.value = '7'; }
    };
    form.addEventListener('change', e => { if (e.target.name === 'mode') syncMode(); });
    syncMode();
    form.querySelector('#flip').addEventListener('click', () => {
      form.first.value = coinFlip();
      form.querySelector('#flip').textContent = `硬幣說：${form.first.value === 'A' ? '甲隊' : '乙隊'}先發`;
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const mode = form.mode.value;
      const doubles = mode === 'sideout-doubles' || mode === 'rally-doubles';
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
