import { renderCourt } from '../court.js';
import { SECTIONS } from '../data/rules.js';
import { GLOSSARY, MISCONCEPTIONS } from '../data/glossary.js';
import { RULES_INDEX, RULE_PAGE, EXTRA_PAGES } from '../data/nav.js';

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

// Every page reachable from the index, in reading order: the rules of each
// section (plus its compare table), then the FAQ and the glossary.
const PAGES = [
  ...SECTIONS.flatMap(sec => [
    ...sec.items.map(item => ({ id: item.id, kind: 'rule', sec, item, title: item.title, summary: item.summary, rule: item.rule })),
    ...(sec.compare ? [{ id: 'compare', kind: 'compare', sec, title: sec.compare.title, summary: EXTRA_PAGES.compare.summary }] : []),
  ]),
  { id: 'faq', kind: 'faq', title: EXTRA_PAGES.faq.title, summary: EXTRA_PAGES.faq.summary },
  { id: 'glossary', kind: 'glossary', title: EXTRA_PAGES.glossary.title, summary: EXTRA_PAGES.glossary.summary },
];

const link = p => `<a class="rule-link" href="#rules/${p.id}">
  <span class="rule-link-text"><b>${esc(p.title)}</b><span class="rule-link-sum">${esc(p.summary)}</span></span>
  ${p.rule ? `<span class="rule-no">${esc(p.rule)}</span>` : ''}</a>`;

function indexHtml() {
  const groups = SECTIONS.map(sec => `
    <section class="rule-group" id="rules-${sec.id}">
      <h3>${esc(sec.title)}${sec.subtitle ? ` <span class="muted small">${esc(sec.subtitle)}</span>` : ''}</h3>
      <div class="rule-list">${PAGES.filter(p => p.sec === sec).map(link).join('')}</div>
    </section>`).join('');
  return `
    <div class="section-head"><h2>${esc(RULES_INDEX.title)}</h2><p class="intro">${esc(RULES_INDEX.intro)}</p></div>
    ${groups}
    <section class="rule-group"><h3>${esc(RULES_INDEX.more)}</h3>
      <div class="rule-list">${PAGES.filter(p => !p.sec).map(link).join('')}</div>
    </section>`;
}

function pageBody(p) {
  if (p.kind === 'rule') return ruleCard(p.item);
  if (p.kind === 'compare') return compareTable(p.sec.compare);
  if (p.kind === 'faq') {
    return `<div class="section-head"><h2>${esc(p.title)}</h2></div>
      <div class="faq">${MISCONCEPTIONS.map(m => `<details><summary>${esc(m.q)}</summary><p>${esc(m.a)}</p></details>`).join('')}</div>`;
  }
  return `<div class="section-head"><h2>${esc(p.title)}</h2><p class="intro">${esc(EXTRA_PAGES.glossary.intro)}</p></div>
    <div class="glossary">${GLOSSARY.map(g => `<div class="term"><b>${esc(g.zh)} <span class="en">${esc(g.en)}</span></b>${g.alias ? `<span class="muted small">${esc(g.alias)}</span>` : ''}<span class="small">${esc(g.def)}</span></div>`).join('')}</div>`;
}

function pageHtml(i) {
  const p = PAGES[i], prev = PAGES[i - 1], next = PAGES[i + 1];
  const step = (q, label, cls) => q
    ? `<a class="pager-link ${cls}" href="#rules/${q.id}"><span class="muted small">${esc(label)}</span><b>${esc(q.title)}</b></a>`
    : '<span></span>';
  return `
    <nav class="rule-top"><a class="back" href="#rules">${esc(RULE_PAGE.back)}</a>${p.sec ? `<span class="muted small">${esc(p.sec.title)}</span>` : ''}</nav>
    ${pageBody(p)}
    <nav class="pager">${step(prev, RULE_PAGE.prev, 'prev')}${step(next, RULE_PAGE.next, 'next')}</nav>`;
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

// Renders the index (sub = '') or one page (sub = page id). An unknown id is
// a bad link, not a bad state, so it falls back to the index.
export function mountRules(root) {
  let current = null;
  return {
    show(sub) {
      const i = PAGES.findIndex(p => p.id === sub);
      const key = i < 0 ? '' : sub;
      if (key === current) return;
      current = key;
      root.innerHTML = i < 0 ? indexHtml() : pageHtml(i);
      const page = PAGES[i];
      if (page?.kind === 'rule') {
        const wrap = root.querySelector('.scene-wrap');
        if (wrap) wireScene(wrap, page.item.scenes);
      }
    },
  };
}
