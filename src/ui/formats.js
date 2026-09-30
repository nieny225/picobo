import { FORMATS } from '../data/formats.js';
import { FORMATS_PAGE } from '../data/nav.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function formatCard(f) {
  return `<article class="card format" id="formats-${f.id}">
    <div class="card-head"><h3>${esc(f.name)} <span class="muted small">${esc(f.en)}</span></h3></div>
    <div class="format-meta"><span>${esc(f.group)}</span><span>${esc(f.players)}</span></div>
    <p class="summary">${esc(f.tagline)}</p>
    <ol>${f.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ol>
    <p><b>計分：</b>${esc(f.scoring)}</p>
    <p class="format-tip">${esc(f.tip)}</p>
  </article>`;
}

export function mountFormats(root) {
  root.innerHTML = `
    <div class="section-head"><h2>${esc(FORMATS_PAGE.title)}</h2><p class="intro">${esc(FORMATS_PAGE.intro)}</p></div>
    <div class="formats">${FORMATS.map(formatCard).join('')}</div>`;
}
