import { renderCourt } from '../court.js';
import { SECTIONS } from '../data/rules.js';
import { FORMATS } from '../data/formats.js';
import { GLOSSARY, MISCONCEPTIONS } from '../data/glossary.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function sceneBlock(item) {
  if (!item.scenes || item.scenes.length === 0) return '';
  const steps = item.scenes.map((sc, i) =>
    `<div class="step"><p class="step-caption"><span class="step-no">${i + 1}/${item.scenes.length}</span>${esc(sc.caption)}</p></div>`).join('');
  const dots = item.scenes.map((_, i) => `<button class="dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="第 ${i + 1} 步"></button>`).join('');
  const nav = item.scenes.length > 1
    ? `<div class="scene-nav"><button class="btn btn-ghost" data-dir="-1">上一步</button><div class="dots">${dots}</div><button class="btn btn-ghost" data-dir="1">下一步</button></div>`
    : '';
  return `<div class="scene-wrap" data-scene="${item.id}"><div class="court-wrap"></div><div class="steps">${steps}</div>${nav}</div>`;
}

function ruleCard(item) {
  const detail = item.detail?.length
    ? `<details${item.collapsed ? '' : ''}><summary>更多說明</summary><div class="detail"><ul>${item.detail.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div></details>`
    : '';
  return `<article class="card rule" id="rules-${item.id}">
    <div class="card-head"><h3>${esc(item.title)}</h3>${item.rule ? `<span class="rule-no">${esc(item.rule)}</span>` : ''}</div>
    <p class="summary">${esc(item.summary)}</p>
    ${sceneBlock(item)}
    ${detail}
  </article>`;
}

function compareTable(c) {
  return `<article class="card"><h3>${esc(c.title)}</h3><div class="table-wrap"><table>
    <thead><tr><th></th><th>側出計分</th><th>每球得分</th></tr></thead>
    <tbody>${c.rows.map(r => `<tr>${r.map(x => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div></article>`;
}

function formatCard(f) {
  return `<article class="card format" id="rules-${f.id}">
    <div class="card-head"><h3>${esc(f.name)} <span class="muted small">${esc(f.en)}</span></h3></div>
    <div class="format-meta"><span>${esc(f.group)}</span><span>${esc(f.players)}</span></div>
    <p class="summary">${esc(f.tagline)}</p>
    <ol>${f.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ol>
    <p><b>計分：</b>${esc(f.scoring)}</p>
    <p class="format-tip">${esc(f.tip)}</p>
  </article>`;
}

function html() {
  const sections = SECTIONS.map(sec => `
    <div class="section-head" id="rules-${sec.id}"><h2>${esc(sec.title)}</h2>${sec.subtitle ? `<p class="sub">${esc(sec.subtitle)}</p>` : ''}<p class="intro">${esc(sec.intro)}</p></div>
    ${sec.items.map(ruleCard).join('')}
    ${sec.compare ? compareTable(sec.compare) : ''}
  `).join('');
  const nav = [...SECTIONS.map(s => [s.id, s.title]), ['formats', '趣味玩法'], ['faq', '常見誤解'], ['glossary', '術語表']]
    .map(([id, t]) => `<a class="chip" href="#rules-${id}">${esc(t)}</a>`).join('');
  return `
    <nav class="chips" aria-label="規則章節">${nav}</nav>
    ${sections}
    <div class="section-head" id="rules-formats"><h2>趣味玩法</h2><p class="intro">人數不對、場地不夠、想練特定球路的時候用。這些都不是官方規則，開打前先講好版本。</p></div>
    <div class="formats">${FORMATS.map(formatCard).join('')}</div>
    <div class="section-head" id="rules-faq"><h2>常見誤解</h2></div>
    <div class="faq">${MISCONCEPTIONS.map(m => `<details><summary>${esc(m.q)}</summary><p>${esc(m.a)}</p></details>`).join('')}</div>
    <div class="section-head" id="rules-glossary"><h2>術語表</h2><p class="intro">球場上中英文混著講很正常，這裡對照一下。</p></div>
    <div class="glossary">${GLOSSARY.map(g => `<div class="term"><b>${esc(g.zh)} <span class="en">${esc(g.en)}</span></b>${g.alias ? `<span class="muted small">${esc(g.alias)}</span>` : ''}<span class="small">${esc(g.def)}</span></div>`).join('')}</div>
  `;
}

function wireScene(wrap, scenes) {
  const court = wrap.querySelector('.court-wrap');
  const steps = wrap.querySelector('.steps');
  const dots = [...wrap.querySelectorAll('.dot')];
  const prev = wrap.querySelector('[data-dir="-1"]');
  const next = wrap.querySelector('[data-dir="1"]');
  let current = -1;
  const setStep = i => {
    i = Math.max(0, Math.min(scenes.length - 1, i));
    if (i === current) return;
    current = i;
    renderCourt(court, scenes[i]);
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === scenes.length - 1;
  };
  const goTo = i => {
    i = Math.max(0, Math.min(scenes.length - 1, i));
    steps.scrollTo({ left: i * steps.clientWidth, behavior: 'smooth' });
    setStep(i);
  };
  let raf = 0;
  steps.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => setStep(Math.round(steps.scrollLeft / steps.clientWidth)));
  });
  dots.forEach(d => d.addEventListener('click', () => goTo(Number(d.dataset.i))));
  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));
  wrap.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
  });
  wrap.tabIndex = 0;
  setStep(0);
}

export function mountRules(root) {
  root.innerHTML = html();
  const byId = {};
  for (const sec of SECTIONS) for (const it of sec.items) byId[it.id] = it;
  for (const wrap of root.querySelectorAll('.scene-wrap')) {
    wireScene(wrap, byId[wrap.dataset.scene].scenes);
  }
}
