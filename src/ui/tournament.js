import { PICOBOWL as E, MANAGE as T } from '../data/event.js';
import { createTournament, recordScore, standings, readyMatches } from '../tournament.js';
import { esc } from './scenes.js';
import { handoffButtonHtml, shareHandoff } from './handoff.js';

// Organizer screen (#picobowl/manage): team entry, then courts, scores,
// pool tables and playoffs. Everything lives in this phone's localStorage.
const KEY = 'picobo.picobowl';
export function loadManage() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; }
}
export function saveManage(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage unavailable: this visit only */ }
}

const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);
const poolName = p => String.fromCharCode(65 + p);
const divOf = id => E.divisions.find(d => d.id === id);

// "Bruce / Annie" or "Bruce Annie" -> ['Bruce', 'Annie'].
function parseTeams(div, text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return lines.map((line, i) => {
    const names = line.split(/\s*[/／,，、]\s*|\s+/).filter(Boolean);
    if (names.length !== 2) throw new Error(fill(T.errors.teamLine, { div: div.short, n: i + 1, line }));
    return names;
  });
}

function label(m) {
  if (m.stage === 'pool') return `${divOf(m.div).short}・${fill(T.poolRound, { pool: poolName(m.pool), round: m.round })}`;
  return `${divOf(m.div).short}・${m.stage === 'final' ? T.final : fill(T.semi, { n: m.id.slice(-1) })}`;
}
const teamName = (s, id) => (id ? s.teams[id].name : T.tbd);

function scoreForm(s, m) {
  return `<form class="score-form" data-match="${esc(m.id)}">
    <input class="input num" name="a" type="number" min="0" max="99" inputmode="numeric" value="${m.score ? m.score[0] : ''}" aria-label="${esc(teamName(s, m.a))}">
    <span>:</span>
    <input class="input num" name="b" type="number" min="0" max="99" inputmode="numeric" value="${m.score ? m.score[1] : ''}" aria-label="${esc(teamName(s, m.b))}">
    <button class="btn btn-primary" type="submit">${esc(T.submit)}</button>
  </form><p class="form-error" hidden></p>`;
}

function matchCard(s, m, withForm) {
  return `<div class="t-match${m.score ? ' is-done' : ''}">
    <span class="t-label">${esc(label(m))}</span>
    <div class="t-teams"><b>${esc(teamName(s, m.a))}</b><span class="t-score num">${m.score ? `${m.score[0]} : ${m.score[1]}` : ''}</span><b>${esc(teamName(s, m.b))}</b></div>
    ${withForm ? scoreForm(s, m) : ''}</div>`;
}

function divisionHtml(s, div) {
  const tables = div.pools.map((_, p) => `<h4>${esc(fill(T.pool, { pool: poolName(p) }))}</h4>
    <table class="stats"><thead><tr>${T.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>
    ${standings(s, div.id, p).map(r => `<tr><td>${esc(s.teams[r.team].name)}</td><td class="num">${r.won}</td><td class="num">${r.lost}</td><td class="num">${r.diff > 0 ? '+' : ''}${r.diff}</td></tr>`).join('')}
    </tbody></table>`).join('');
  const ms = s.matches.filter(m => m.div === div.id);
  const final = ms.find(m => m.stage === 'final');
  const champ = final.score ? `<p class="t-champ">${esc(T.champion)}：${esc(teamName(s, final.score[0] > final.score[1] ? final.a : final.b))}</p>` : '';
  return `<details class="t-div"${final.score ? '' : ' open'}><summary>${esc(divOf(div.id).name)}</summary>
    ${champ}${tables}
    <h4>${esc(T.matches)}</h4>
    <div class="t-list">${ms.map(m => `<div class="t-row">${matchCard(s, m, false)}${m.score ? `<button class="btn btn-ghost t-edit" type="button" data-edit="${esc(m.id)}">${esc(T.edit)}</button>` : ''}</div>`).join('')}</div>
  </details>`;
}

// Plain text for LINE.
function resultsText(s) {
  const lines = [E.name];
  for (const div of s.divisions) {
    lines.push('', `【${divOf(div.id).name}】`);
    div.pools.forEach((_, p) => {
      lines.push(fill(T.pool, { pool: poolName(p) }));
      standings(s, div.id, p).forEach((r, i) => lines.push(`${i + 1}. ${s.teams[r.team].name}  ${r.won}勝${r.lost}負 ${r.diff > 0 ? '+' : ''}${r.diff}`));
    });
    for (const m of s.matches.filter(x => x.div === div.id && x.stage !== 'pool' && x.score)) {
      lines.push(`${label(m)}：${teamName(s, m.a)} ${m.score[0]}:${m.score[1]} ${teamName(s, m.b)}`);
    }
  }
  return lines.join('\n');
}

export function renderManage(root) {
  const data = loadManage();
  const current = data.state ?? null;
  const setup = () => `
    <div class="section-head"><h2>${esc(T.title)}</h2><p class="intro">${esc(T.intro)}</p></div>
    <form class="card" id="t-setup">
      <div class="field"><label for="t-courts">${esc(T.courts)}</label><input class="input num" id="t-courts" type="number" min="1" max="8" value="${data.courts ?? 2}"></div>
      ${E.divisions.map(d => `<div class="field"><label for="t-${d.id}">${esc(d.name)}</label>
        <textarea class="input t-teams-input" id="t-${d.id}" rows="6" placeholder="${esc(T.teamsHint)}">${esc(data.teams?.[d.id] ?? '')}</textarea></div>`).join('')}
      <p class="form-error" hidden></p>
      <button class="btn btn-primary btn-block" type="submit">${esc(T.create)}</button>
    </form>`;

  const run = s => {
    const onCourt = s.courts.map((id, c) => {
      const m = id && s.matches.find(x => x.id === id);
      return `<div class="t-court"><span class="court-no">${esc(fill(T.court, { n: c + 1 }))}</span>${m ? matchCard(s, m, true) : `<p class="muted">${esc(T.idle)}</p>`}</div>`;
    }).join('');
    const queue = readyMatches(s).slice(0, 4);
    return `
      <div class="section-head"><h2>${esc(T.title)}</h2></div>
      <section class="card"><h3>${esc(T.onCourt)}</h3><div class="t-courts">${onCourt}</div>
        <h4>${esc(T.next)}</h4>${queue.length ? queue.map(m => matchCard(s, m, false)).join('') : `<p class="muted">${esc(T.nothingNext)}</p>`}
      </section>
      ${s.divisions.map(d => divisionHtml(s, d)).join('')}
      <div class="toolbar"><button class="btn" type="button" id="t-copy">${esc(T.copy)}</button>
        ${handoffButtonHtml()}
        <button class="btn btn-ghost" type="button" id="t-reset">${esc(T.reset)}</button></div>
      <p class="t-copied muted small" hidden></p>`;
  };

  root.innerHTML = `<nav class="rule-top"><a class="back" href="#picobowl">${esc(T.backToEvent)}</a></nav>` + (current ? run(current) : setup());

  const error = (form, msg) => { const p = form.nextElementSibling?.classList.contains('form-error') ? form.nextElementSibling : form.querySelector('.form-error'); p.textContent = msg; p.hidden = !msg; };
  const message = e => (/level/.test(e.message) ? T.errors.level : /whole numbers/.test(e.message) ? T.errors.number : /later round/.test(e.message) ? T.errors.used : e.message);

  if (!current) {
    const form = root.querySelector('#t-setup');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const courts = Number(form.querySelector('#t-courts').value) || 2;
      const teams = Object.fromEntries(E.divisions.map(d => [d.id, form.querySelector(`#t-${d.id}`).value]));
      try {
        const divisions = E.divisions.map(d => ({ id: d.id, name: d.name, block: d.block, teams: parseTeams(d, teams[d.id]) }))
          .filter(d => d.teams.length > 0);
        for (const d of divisions) if (d.teams.length < 2) throw new Error(fill(T.errors.tooFew, { div: divOf(d.id).short }));
        saveManage({ courts, teams, state: createTournament({ divisions, courts }) });
        renderManage(root);
        window.scrollTo({ top: 0 });
      } catch (err) { error(form, err.message.replace(/^tournament: /, '')); }
    });
    return;
  }

  for (const form of root.querySelectorAll('.score-form')) form.addEventListener('submit', e => {
    e.preventDefault();
    const a = form.a.value === '' ? NaN : Number(form.a.value), b = form.b.value === '' ? NaN : Number(form.b.value);
    try {
      saveManage({ ...data, state: recordScore(current, form.dataset.match, a, b) });
      renderManage(root);
    } catch (err) { error(form, message(err)); }
  });
  for (const btn of root.querySelectorAll('[data-edit]')) btn.addEventListener('click', () => {
    const m = current.matches.find(x => x.id === btn.dataset.edit);
    const row = btn.closest('.t-row');
    row.innerHTML = matchCard(current, m, true);
    row.querySelector('.score-form').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.currentTarget;
      try {
        saveManage({ ...data, state: recordScore(current, m.id, Number(f.a.value), Number(f.b.value)) });
        renderManage(root);
      } catch (err) { error(f, message(err)); }
    });
  });
  root.querySelector('.handoff-btn').addEventListener('click', () => shareHandoff('tourney', data));
  root.querySelector('#t-copy').addEventListener('click', async () => {
    const text = resultsText(current), note = root.querySelector('.t-copied');
    try { await navigator.clipboard.writeText(text); note.textContent = T.copied; }
    catch { note.innerHTML = `${esc(T.copyFallback)}<textarea class="input" rows="8" readonly>${esc(text)}</textarea>`; }
    note.hidden = false;
  });
  root.querySelector('#t-reset').addEventListener('click', () => {
    if (!confirm(T.resetConfirm)) return;
    saveManage({ courts: data.courts, teams: data.teams });
    renderManage(root);
  });
}
