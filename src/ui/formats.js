import { FORMATS } from '../data/formats.js';
import { FORMATS_PAGE } from '../data/nav.js';
import { esc, enTag, sceneBlock, wireScene } from './scenes.js';

// One fun format's card. Its pages live in the rules view (#formats/<id>),
// under the same bar and drawer as the rules.
export function formatCardHtml(f) {
  return `<article class="card format" id="formats-${f.id}">
      <div class="card-head"><h3>${esc(f.name)}${enTag(f.en)}</h3><span class="rule-no">${esc(FORMATS_PAGE.unofficial)}</span></div>
      <div class="format-meta"><span>${esc(f.group)}</span><span>${esc(f.players)}</span></div>
      <p class="summary">${esc(f.tagline)}</p>
      ${sceneBlock(f)}
      <ol>${f.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ol>
      <p><b>${esc(FORMATS_PAGE.scoring)}</b>${esc(f.scoring)}</p>
      <p class="format-tip">${esc(f.tip)}</p>
    </article>`;
}

export function wireFormat(root, f) {
  const wrap = root.querySelector('.scene-wrap');
  if (wrap) wireScene(wrap, f.scenes);
}
