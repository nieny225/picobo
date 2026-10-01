import { FORMATS } from '../data/formats.js';
import { FORMATS_PAGE, RULE_PAGE } from '../data/nav.js';
import { esc, enTag, sceneBlock, wireScene } from './scenes.js';
import { shareButtonHtml, sharePage } from './share.js';

const link = f => `<a class="rule-link" href="#formats/${f.id}">
  <span class="rule-link-text"><b>${esc(f.name)}${enTag(f.en)}</b><span class="rule-link-sum">${esc(f.tagline)}</span></span>
  </a>`;

function indexHtml() {
  const groups = [...new Set(FORMATS.map(f => f.group))];
  return `
    <div class="section-head"><h2>${esc(FORMATS_PAGE.title)}</h2><p class="intro">${esc(FORMATS_PAGE.intro)}</p></div>
    ${groups.map(g => `<section class="rule-group"><h3>${esc(g)}</h3>
      <div class="rule-list">${FORMATS.filter(f => f.group === g).map(link).join('')}</div></section>`).join('')}`;
}

function pageHtml(i) {
  const f = FORMATS[i], prev = FORMATS[i - 1], next = FORMATS[i + 1];
  const step = (q, label, cls) => q
    ? `<a class="pager-link ${cls}" href="#formats/${q.id}"><span class="muted small">${esc(label)}</span><b>${esc(q.name)}</b></a>`
    : '<span></span>';
  return `
    <nav class="rule-top"><a class="back" href="#rules">${esc(RULE_PAGE.back)}</a><span class="muted small">${esc(f.group)}</span>${shareButtonHtml()}</nav>
    <article class="card format" id="formats-${f.id}">
      <div class="card-head"><h3>${esc(f.name)}${enTag(f.en)}</h3><span class="rule-no">${esc(FORMATS_PAGE.unofficial)}</span></div>
      <div class="format-meta"><span>${esc(f.players)}</span></div>
      <p class="summary">${esc(f.tagline)}</p>
      ${sceneBlock(f)}
      <ol>${f.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ol>
      <p><b>${esc(FORMATS_PAGE.scoring)}</b>${esc(f.scoring)}</p>
      <p class="format-tip">${esc(f.tip)}</p>
    </article>
    <nav class="pager">${step(prev, RULE_PAGE.prev, 'prev')}${step(next, RULE_PAGE.next, 'next')}</nav>`;
}

// Renders the index (sub = '') or one format (sub = format id). An unknown id
// is a bad link, so it falls back to the index.
export function mountFormats(root) {
  root.innerHTML = '<div class="rules-page"></div>';
  const pageEl = root.firstElementChild;
  let current = null;
  return {
    show(sub) {
      const i = FORMATS.findIndex(f => f.id === sub);
      const key = i < 0 ? '' : sub;
      if (key === current) return;
      current = key;
      pageEl.innerHTML = i < 0 ? indexHtml() : pageHtml(i);
      pageEl.querySelector('.share-btn')?.addEventListener('click', () => sharePage(FORMATS[i].name));
      const wrap = pageEl.querySelector('.scene-wrap');
      if (wrap) wireScene(wrap, FORMATS[i].scenes);
    },
  };
}
