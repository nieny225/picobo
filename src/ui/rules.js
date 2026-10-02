import { SECTIONS, COMPARE, COUNTERPARTS } from '../data/rules.js';
import { FORMATS } from '../data/formats.js';
import { GLOSSARY, MISCONCEPTIONS } from '../data/glossary.js';
import { RULES_INDEX, RULE_PAGE, EXTRA_PAGES, DRAWER, FILTER, FORMATS_PAGE } from '../data/nav.js';
import { esc, enTag, sceneBlock, wireScene } from './scenes.js';
import { shareButtonHtml, sharePage, toast } from './share.js';


function ruleCard(item, applies = '') {
  const detail = item.detail?.length
    ? `<details${item.collapsed ? '' : ''}><summary>更多說明</summary><div class="detail"><ul>${item.detail.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div></details>`
    : '';
  return `<article class="card rule" id="rules-${item.id}">
    <div class="card-head"><h3>${esc(item.title)}${enTag(item.en)}</h3>${item.rule ? `<span class="rule-no">${esc(item.rule)}</span>` : ''}</div>
    ${applies}
    <p class="summary">${esc(item.summary)}</p>
    ${sceneBlock(item)}
    ${detail}
  </article>`;
}

function compareTable(c) {
  const [side, rally] = FILTER.scoring.options;
  return `<article class="card"><h3>${esc(c.title)}${enTag(c.en)}</h3><div class="table-wrap"><table>
    <thead><tr><th></th><th>${optionHtml(side)}</th><th>${optionHtml(rally)}</th></tr></thead>
    <tbody>${c.rows.map(r => `<tr>${r.map(x => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div></article>`;
}

// Every page reachable from the index, in reading order: the rules of each
// section, then the pages that are not one rule (compare, FAQ, glossary).
const PAGES = [
  ...SECTIONS.flatMap(sec => sec.items.map(item => ({ id: item.id, kind: 'rule', sec, item, title: item.title, en: item.en, summary: item.summary, rule: item.rule }))),
  { id: 'compare', kind: 'compare', title: COMPARE.title, en: COMPARE.en, summary: EXTRA_PAGES.compare.summary },
  { id: 'faq', kind: 'faq', title: EXTRA_PAGES.faq.title, en: EXTRA_PAGES.faq.en, summary: EXTRA_PAGES.faq.summary },
  { id: 'glossary', kind: 'glossary', title: EXTRA_PAGES.glossary.title, en: EXTRA_PAGES.glossary.en, summary: EXTRA_PAGES.glossary.summary },
];

// Pages that were removed or merged: old links land on their replacement.
const MOVED = { singles: 'scoring' };

// Which combination of play (doubles / singles) and scoring (side-out /
// rally) the reader cares about. Remembered per device.
const FILTER_KEY = 'picobo.rulesFilter';
const DEFAULT_FILTER = { play: 'doubles', scoring: 'sideout' };
function loadFilter() {
  try {
    const f = JSON.parse(localStorage.getItem(FILTER_KEY));
    const ok = (k, v) => FILTER[k].options.some(o => o.id === v);
    if (f && ok('play', f.play) && ok('scoring', f.scoring)) return f;
  } catch { /* storage unavailable or corrupt */ }
  return { ...DEFAULT_FILTER };
}
function saveFilter(f) {
  try { localStorage.setItem(FILTER_KEY, JSON.stringify(f)); } catch { /* storage unavailable */ }
}
// Option label as HTML, with its English term when it has one: 側出計分（Side-out）.
const optionHtml = o => `${esc(o.label)}${enTag(o.en)}`;
const optionById = (k, id) => FILTER[k].options.find(o => o.id === id);

const sectionShown = (sec, f) => !sec.scoring || sec.scoring === f.scoring;
const pageShown = (p, f) => p.kind !== 'rule' || (sectionShown(p.sec, f) && (!p.item.play || p.item.play === f.play));

// Fun formats have their own pages (#formats/<id>) but are listed here, under
// the rules tab, whatever the filter.
const FORMAT_LINKS = FORMATS.map(f => ({ href: `#formats/${f.id}`, id: `formats/${f.id}`, title: f.name, en: f.en, summary: f.tagline }));

const link = (p, f) => `<a class="rule-link" href="${p.href ?? `#rules/${p.id}`}">
  <span class="rule-link-text"><b>${esc(p.title)}${enTag(p.en)}</b><span class="rule-link-sum">${esc(f ? textFor(p, f).summary : p.summary)}</span></span>
  ${p.rule ? `<span class="rule-no">${esc(p.rule)}</span>` : ''}</a>`;

// The two switches in the sticky bar: 雙打｜單打 and Side-out｜Rally.
function barFilterHtml(f) {
  const seg = k => `<div class="seg bar-seg" role="group" aria-label="${esc(FILTER[k].label)}">${FILTER[k].options.map(o =>
    `<button type="button" data-filter="${k}" data-value="${o.id}" aria-pressed="${f[k] === o.id}"${o.en ? ` aria-label="${esc(o.label)}" title="${esc(o.label)}"` : ''}>${esc(o.en ?? o.label)}</button>`).join('')}</div>`;
  return `${seg('play')}${seg('scoring')}`;
}

function indexHtml(f) {
  const groups = SECTIONS.filter(sec => sectionShown(sec, f)).map(sec => `
    <section class="rule-group" id="rules-${sec.id}" data-title="${esc(sec.title)}">
      <h3>${esc(sec.title)}${enTag(sec.en)}${sec.subtitle ? ` <span class="muted small">${esc(sec.subtitle)}</span>` : ''}</h3>
      <div class="rule-list">${PAGES.filter(p => p.sec === sec && pageShown(p, f)).map(p => link(p, f)).join('')}</div>
    </section>`).join('');
  return `
    <div class="section-head"><h2>${esc(RULES_INDEX.title)}</h2><p class="intro">${esc(RULES_INDEX.intro)}</p></div>
    ${groups}
    <section class="rule-group" id="rules-formats" data-title="${esc(FORMATS_PAGE.title)}"><h3>${esc(FORMATS_PAGE.title)}${enTag(FORMATS_PAGE.en)}</h3>
      <p class="muted small">${esc(FORMATS_PAGE.note)}</p>
      <div class="rule-list">${FORMAT_LINKS.map(p => link(p)).join('')}</div>
    </section>
    <section class="rule-group" data-title="${esc(RULES_INDEX.more)}"><h3>${esc(RULES_INDEX.more)}${enTag(RULES_INDEX.moreEn)}</h3>
      <div class="rule-list">${PAGES.filter(p => !p.sec).map(p => link(p)).join('')}</div>
    </section>`;
}

// "適用：雙打｜側出計分" under a rule's title.
function appliesHtml(p) {
  const play = p.item.play ? optionHtml(optionById('play', p.item.play)) : esc(FILTER.both.play);
  const scoring = p.sec.scoring ? optionHtml(optionById('scoring', p.sec.scoring)) : esc(FILTER.both.scoring);
  return `<div class="format-meta applies"><span class="muted">${esc(FILTER.applies)}</span><span>${play}</span><span>${scoring}</span></div>`;
}

// "看其他版本：單打｜Rally" under 適用: one tap switches the filter (and, if
// this rule does not apply there, jumps to its counterpart).
function othersHtml(f) {
  const other = k => FILTER[k].options.find(o => o.id !== f[k]);
  const btn = k => { const o = other(k); return `<button type="button" class="link-btn" data-filter="${k}" data-value="${o.id}">${esc(o.en ?? o.label)}</button>`; };
  return `<p class="others small"><span class="muted">${esc(FILTER.others)}</span>${btn('play')}${btn('scoring')}</p>`;
}

// Rules that apply to both play styles carry a two-player version of their
// scenes; show it when the reader picked singles.
const scenesFor = (p, f) => (f.play === 'singles' && p.item.singlesScenes) || p.item.scenes;
// The same for the rule's text: singles wording when the reader picked singles.
const textFor = (p, f) => {
  if (p.kind !== 'rule' || f.play !== 'singles') return { summary: p.summary, detail: p.item?.detail };
  return { summary: p.item.singlesSummary ?? p.summary, detail: p.item.singlesDetail ?? p.item.detail };
};

function pageBody(p, f) {
  if (p.kind === 'rule') return ruleCard({ ...p.item, ...textFor(p, f), scenes: scenesFor(p, f) }, appliesHtml(p) + othersHtml(f));
  if (p.kind === 'compare') return compareTable(COMPARE);
  if (p.kind === 'faq') {
    return `<div class="section-head"><h2>${esc(p.title)}</h2><p class="sub">${esc(p.en)}</p></div>
      <div class="faq">${MISCONCEPTIONS.map(m => `<details><summary>${esc(m.q)}</summary><p>${esc(m.a)}</p></details>`).join('')}</div>`;
  }
  return `<div class="section-head"><h2>${esc(p.title)}</h2><p class="sub">${esc(p.en)}</p><p class="intro">${esc(EXTRA_PAGES.glossary.intro)}</p></div>
    <div class="glossary">${GLOSSARY.map(g => `<div class="term"><b>${esc(g.zh)} <span class="en">${esc(g.en)}</span></b>${g.alias ? `<span class="muted small">${esc(g.alias)}</span>` : ''}<span class="small">${esc(g.def)}</span></div>`).join('')}</div>`;
}

// Prev / next walk the pages of the current filter; a page reached from a
// shared link outside the filter walks the full list instead.
function pageHtml(p, f) {
  let list = PAGES.filter(q => pageShown(q, f));
  if (!list.includes(p)) list = PAGES;
  const i = list.indexOf(p), prev = list[i - 1], next = list[i + 1];
  const step = (q, label, cls) => q
    ? `<a class="pager-link ${cls}" href="#rules/${q.id}"><span class="muted small">${esc(label)}</span><b>${esc(q.title)}</b></a>`
    : '<span></span>';
  return `
    ${pageBody(p, f)}
    <nav class="pager">${step(prev, RULE_PAGE.prev, 'prev')}${step(next, RULE_PAGE.next, 'next')}</nav>`;
}

// Swipe left to dismiss: the drawer follows the finger and closes once it
// has been dragged a quarter of its width. Touch events (not pointer events)
// so the scrolling list cannot cancel the gesture: once a drag reads as
// horizontal, touchmove is prevented and the browser does not scroll.
function swipeToClose(drawer) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let startX = null, startY = 0, dx = 0, mode = null, swallowUntil = 0;
  const reset = () => { drawer.style.transform = ''; drawer.style.transition = ''; };
  drawer.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) { startX = null; return; }
    startX = e.touches[0].clientX; startY = e.touches[0].clientY; dx = 0; mode = null;
  }, { passive: true });
  drawer.addEventListener('touchmove', e => {
    if (startX === null || mode === 'scroll') return;
    const x = e.touches[0].clientX - startX, y = e.touches[0].clientY - startY;
    if (!mode) {
      if (Math.abs(x) < 8 && Math.abs(y) < 8) return;
      mode = Math.abs(x) > Math.abs(y) ? 'swipe' : 'scroll';
      if (mode === 'scroll') return;
    }
    e.preventDefault();
    dx = Math.min(0, x);
    drawer.style.transition = 'none';
    drawer.style.transform = `translateX(${dx}px)`;
  }, { passive: false });
  const end = () => {
    if (startX === null) return;
    startX = null;
    if (mode !== 'swipe') return;
    mode = null;
    swallowUntil = performance.now() + 400;
    drawer.style.transition = '';
    if (dx > -drawer.offsetWidth / 4) { drawer.style.transform = ''; return; }
    if (reduced.matches) { drawer.close(); reset(); return; }
    drawer.style.transform = 'translateX(-100%)';
    setTimeout(() => { drawer.close(); reset(); }, 200);
  };
  drawer.addEventListener('touchend', end);
  drawer.addEventListener('touchcancel', end);
  // A drag that ends over a link must not also follow it.
  drawer.addEventListener('click', e => { if (performance.now() < swallowUntil) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
}

// Renders the index (sub = '') or one page (sub = page id). An unknown id is
// a bad link, not a bad state, so it falls back to the index.
// The edge tab opens the drawer on a tap, or when dragged right past 24px.
function dragToOpen(tab, open) {
  let x0 = null;
  tab.addEventListener('click', open);
  tab.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  tab.addEventListener('touchmove', e => {
    if (x0 !== null && e.touches[0].clientX - x0 > 24) { x0 = null; open(); }
  }, { passive: true });
  tab.addEventListener('touchend', () => { x0 = null; });
}

// Left drawer listing every page, reachable from any rules page. It is a
// modal <dialog>, so focus, Esc and the backdrop come from the browser.
function drawerNavHtml(f) {
  const group = (title, en, pages) => `<h3>${esc(title)}${enTag(en)}</h3>
    <ul>${pages.map(p => `<li><a href="${p.href ?? `#rules/${p.id}`}" data-id="${p.id}">${esc(p.title)}${enTag(p.en)}</a></li>`).join('')}</ul>`;
  return `<p class="drawer-note">${esc(FILTER.showing)}<b>${optionHtml(optionById('play', f.play))}・${optionHtml(optionById('scoring', f.scoring))}</b></p>
    <a class="drawer-home" href="#rules" data-id="">${esc(DRAWER.home)}</a>
    ${SECTIONS.filter(sec => sectionShown(sec, f)).map(sec => group(sec.title, sec.en, PAGES.filter(p => p.sec === sec && pageShown(p, f)))).join('')}
    ${group(FORMATS_PAGE.title, FORMATS_PAGE.en, FORMAT_LINKS)}
    ${group(RULES_INDEX.more, RULES_INDEX.moreEn, PAGES.filter(p => !p.sec))}`;
}

function drawerHtml() {
  return `<dialog class="drawer" aria-label="${esc(DRAWER.title)}">
    <div class="drawer-head"><b>${esc(DRAWER.title)}</b><button class="drawer-close" type="button" aria-label="${esc(DRAWER.close)}">×</button></div>
    <nav class="drawer-body"></nav>
  </dialog>`;
}

// Renders the index (sub = '') or one page (sub = page id). An unknown id is
// a bad link, not a bad state, so it falls back to the index.
export function mountRules(root) {
  // A sticky bar on top of every rules page holds the 雙打｜單打 and
  // Side-out｜Rally switches and share. The contents drawer opens from a small tab on the left edge (tap it or drag
  // it right); a swipe from the screen edge itself is the system back gesture.
  root.innerHTML = `<div class="rules-bar"><div class="bar-filters"></div><span class="bar-share"></span><p class="filter-hint" hidden>${esc(FILTER.hint)}</p></div>
    <button class="drawer-tab" type="button" aria-haspopup="dialog" aria-label="${esc(DRAWER.title)}"><span>${esc(DRAWER.open)}</span></button>
    <div class="rules-page"></div>${drawerHtml()}`;
  const filtersEl = root.querySelector('.bar-filters');
  const hintEl = root.querySelector('.filter-hint');
  const shareSlot = root.querySelector('.bar-share');
  shareSlot.addEventListener('click', e => { if (e.target.closest('.share-btn')) sharePage(PAGES.find(q => q.id === current)?.title ?? RULES_INDEX.title); });
  const pageEl = root.querySelector('.rules-page');
  const drawer = root.querySelector('.drawer');
  const drawerNav = drawer.querySelector('.drawer-body');
  dragToOpen(root.querySelector('.drawer-tab'), () => drawer.showModal());
  root.querySelector('.drawer-close').addEventListener('click', () => drawer.close());
  // A click on the backdrop lands on the dialog element itself.
  drawer.addEventListener('click', e => { if (e.target === drawer || e.target.closest('a')) drawer.close(); });
  swipeToClose(drawer);
  let filter = loadFilter();
  let current = null;
  const render = () => {
    const p = PAGES.find(q => q.id === current);
    pageEl.innerHTML = p ? pageHtml(p, filter) : indexHtml(filter);
    filtersEl.innerHTML = barFilterHtml(filter);
    shareSlot.innerHTML = p ? shareButtonHtml() : '';
    drawerNav.innerHTML = drawerNavHtml(filter);
    for (const a of drawerNav.querySelectorAll('a[data-id]')) {
      if (a.dataset.id === current) a.setAttribute('aria-current', 'page');
    }
    if (p?.kind === 'rule') {
      const wrap = pageEl.querySelector('.scene-wrap');
      if (wrap) wireScene(wrap, scenesFor(p, filter));
    }
  };
  // Switching play or scoring, from the bar or a rule page. A rule that does
  // not apply to the new combination hands over to its counterpart, or to the
  // index with a note.
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    filter = { ...filter, [b.dataset.filter]: b.dataset.value };
    saveFilter(filter);
    const p = PAGES.find(q => q.id === current);
    if (p && !pageShown(p, filter)) {
      const to = COUNTERPARTS[p.id]?.[`${filter.play}:${filter.scoring}`];
      const combo = `${optionById('play', filter.play).label}・${optionById('scoring', filter.scoring).label}`;
      if (to) toast(esc(FILTER.jumped.replace('{title}', PAGES.find(q => q.id === to).title)));
      else toast(esc(FILTER.backToIndex.replace('{combo}', combo)));
      location.hash = to ? `#rules/${to}` : '#rules';
      return;
    }
    render();
    filtersEl.querySelector(`[data-filter="${b.dataset.filter}"][data-value="${b.dataset.value}"]`)?.focus();
  });
  // First visit: a bubble under the switches, gone at the first tap anywhere.
  const HINT_KEY = 'picobo.filterHintSeen';
  let hintSeen = true;
  try { hintSeen = localStorage.getItem(HINT_KEY) === '1'; } catch { /* storage unavailable: no hint */ }
  if (!hintSeen) {
    hintEl.hidden = false;
    document.addEventListener('pointerdown', () => {
      hintEl.hidden = true;
      try { localStorage.setItem(HINT_KEY, '1'); } catch { /* storage unavailable */ }
    }, { once: true });
  }
  return {
    show(sub) {
      if (MOVED[sub]) { history.replaceState(null, '', `#rules/${MOVED[sub]}`); sub = MOVED[sub]; }
      const key = PAGES.some(p => p.id === sub) ? sub : '';
      if (drawer.open) drawer.close();
      if (key === current) return;
      current = key;
      render();
    },
  };
}
