import { makeTeams, assignCourts, coinFlip, roundRobin, createKingOfCourt, advanceKingOfCourt } from '../draw.js';

const ROSTER_KEY = 'picobo.roster';
const SAMPLE = ['小明', '阿華', '婷婷', '大衛', '佩佩', '阿倫', '小美', '志豪'];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function loadRoster() {
  try { const raw = localStorage.getItem(ROSTER_KEY); if (raw) return JSON.parse(raw); } catch { /* ignore */ }
  return { names: SAMPLE.slice(), sample: true };
}
function saveRoster(r) {
  try { localStorage.setItem(ROSTER_KEY, JSON.stringify(r)); } catch { /* ignore */ }
}

const teamHtml = (t, first) => `<div class="team-names${first ? ' serve-first' : ''}">${t.map(n => `<span>${esc(n)}</span>`).join('')}</div>`;
const matchHtml = (m, firstIdx) => `<div class="match"><span class="court-no">${m.court} 號場</span>${teamHtml(m.teams[0], firstIdx === 0)}<span class="vs">對</span>${teamHtml(m.teams[1], firstIdx === 1)}</div>`;

export function mountDraw(root) {
  let roster = loadRoster();
  let sub = 'draw';
  let koc = null;

  const html = () => `
    <div class="section-head"><h2>抽籤輪轉</h2><p class="intro">先輸入今天的球友，再選要怎麼分。</p></div>
    <div class="card">
      <div class="card-head"><h3>今天的球友 <span class="muted small num">${roster.names.length} 人</span></h3>${roster.sample ? '<span class="example-note">範例名單，改成你們的</span>' : ''}</div>
      <div class="roster" id="roster">${roster.names.map((n, i) => `<span class="name-chip">${esc(n)}<button data-remove="${i}" aria-label="移除 ${esc(n)}">×</button></span>`).join('')}</div>
      <form class="row" id="add-form"><input class="input" id="add-name" placeholder="輸入名字後按 Enter" maxlength="8" autocomplete="off"><button class="btn" type="submit" style="flex:0 0 auto">加入</button><button class="btn btn-ghost" type="button" id="clear" style="flex:0 0 auto">清空</button></form>
    </div>
    <div class="subtabs" role="tablist">
      ${[['draw', '抽籤分組'], ['rr', '輪轉賽'], ['koc', '國王球場']].map(([id, t]) => `<button class="subtab" role="tab" data-sub="${id}" aria-selected="${sub === id}">${t}</button>`).join('')}
    </div>
    <div id="sub-body"></div>`;

  const drawBody = () => `<div class="card">
    <div class="row"><div class="field"><label for="courts">場地數</label><input class="input num" id="courts" type="number" min="1" max="8" value="2"></div><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="go">抽籤</button></div></div>
    <p class="muted small">隨機兩人一隊、分配場地、丟硬幣決定誰先發球。</p>
    <div id="out"></div></div>`;

  const rrBody = () => `<div class="card">
    <div class="row">
      <div class="field"><label for="courts">場地數</label><input class="input num" id="courts" type="number" min="1" max="8" value="2"></div>
      <div class="field"><label for="rounds">幾輪</label><input class="input num" id="rounds" type="number" min="1" max="12" value="5"></div>
      <div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="go">排輪次</button></div>
    </div>
    <p class="muted small">每輪換搭檔，盡量不重複；人數超過場地容量時輪流休息。</p>
    <div id="out"></div></div>`;

  const kocBody = () => `<div class="card">
    <div class="row">
      <div class="field"><label for="courts">場地數</label><input class="input num" id="courts" type="number" min="1" max="8" value="1"></div>
      <div class="field"><label for="streak">最多連贏幾場</label><input class="input num" id="streak" type="number" min="1" max="10" value="3"></div>
      <div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="go">${koc ? '重新開始' : '開始'}</button></div>
    </div>
    <p class="muted small">贏的留場、輸的排隊尾；連贏到上限也下場。</p>
    <div id="out"></div></div>`;

  const renderKoc = out => {
    if (!koc) { out.innerHTML = ''; return; }
    const streakMax = Number(root.querySelector('#streak').value);
    out.innerHTML = `<div class="matches">${koc.courts.map((c, ci) => c.teams.length === 2 ? `
      <div class="koc-court"><div class="row" style="justify-content:space-between"><span class="court-no num" style="color:var(--accent);font-weight:700">${c.court} 號場</span><span class="streak">留場隊已連贏 ${c.streak} 場</span></div>
      <div class="koc-teams">${c.teams.map((t, ti) => `<div class="koc-team">${teamHtml(t, c.streak === 0 ? ti === 0 : ti === 1)}<button class="btn" data-court="${ci}" data-win="${ti}">這隊贏</button></div>`).join('')}</div></div>`
      : `<div class="koc-court"><span class="muted">${c.court} 號場：人不夠，先休息</span></div>`).join('')}</div>
      <p class="small" style="margin-top:10px"><b>排隊中</b>（前兩位下一場上）</p><div class="queue">${koc.queue.map(n => `<span>${esc(n)}</span>`).join('') || '<span class="muted">沒有人在排隊</span>'}</div>`;
    for (const b of out.querySelectorAll('[data-win]')) b.addEventListener('click', () => {
      koc = advanceKingOfCourt(koc, Number(b.dataset.court), Number(b.dataset.win), streakMax);
      renderKoc(out);
    });
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
        if (!guard(2)) return;
        const { teams, leftover } = makeTeams(roster.names);
        const { matches, waiting } = assignCourts(teams, courts());
        out.innerHTML = `<div class="matches">${matches.map(m => matchHtml(m, coinFlip() === 'A' ? 0 : 1)).join('')}</div>
          ${waiting.length ? `<p class="waiting">等下一場：${waiting.map(t => t.join('＋')).join('、')}</p>` : ''}
          ${leftover.length ? `<p class="waiting">落單：${leftover.join('、')}（下一場先上）</p>` : ''}`;
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
    if (sub === 'koc') renderKoc(out);
  };

  const render = () => {
    root.innerHTML = html();
    root.querySelector('#add-form').addEventListener('submit', e => {
      e.preventDefault();
      const v = root.querySelector('#add-name').value.trim();
      if (!v || roster.names.includes(v)) return;
      roster = { names: [...roster.names, v], sample: false };
      saveRoster(roster); render();
      root.querySelector('#add-name').focus();
    });
    root.querySelector('#clear').addEventListener('click', () => { roster = { names: [], sample: false }; koc = null; saveRoster(roster); render(); });
    for (const b of root.querySelectorAll('[data-remove]')) b.addEventListener('click', () => {
      roster = { names: roster.names.filter((_, i) => i !== Number(b.dataset.remove)), sample: false };
      koc = null; saveRoster(roster); render();
    });
    for (const t of root.querySelectorAll('.subtab')) t.addEventListener('click', () => { sub = t.dataset.sub; render(); });
    renderSub();
  };
  render();
}
