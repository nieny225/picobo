import { SECTIONS, COMPARE } from '../data/rules.js';
import { FORMATS } from '../data/formats.js';
import { GLOSSARY, MISCONCEPTIONS } from '../data/glossary.js';
import { RULES_INDEX, RULE_PAGE, EXTRA_PAGES, DRAWER, FILTER, FORMATS_PAGE, APP_TEXT } from '../data/nav.js';
import { esc, enTag, sceneBlock, wireScene } from './scenes.js';
import { formatCardHtml, wireFormat } from './formats.js';
import { shareButtonHtml, sharePage, toast } from './share.js';
import { setupSvg } from '../court.js';
import { paddleRulesSvg, paddleShapesSvg, paddleCoresSvg } from '../paddle.js';

// Drawings that are not a court scene (src/paddle.js), by figure kind.
const FIGURES = { paddleRules: f => paddleRulesSvg(f), paddleShapes: f => paddleShapesSvg(f), paddleCores: f => paddleCoresSvg(f) };
const figureHtml = f => (f ? `<figure class="rule-figure">${FIGURES[f.kind](f)}<figcaption class="small">${f.keys ? `<ol class="figure-keys">${f.keys.map(k => `<li>${esc(k)}</li>`).join('')}</ol>` : ''}<span class="muted">${esc(f.caption)}</span></figcaption></figure>` : '');


function ruleCard(item, applies = '') {
  const detail = item.detail?.length
    ? `<details${item.collapsed ? '' : ''}><summary>${esc(APP_TEXT.moreDetail)}</summary><div class="detail"><ul>${item.detail.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div></details>`
    : '';
  // 借場地打: one drawing per host court (court.js), then what to reuse and tape.
  const st = item.setup;
  const setup = st
    ? `<div class="setup-body"><p>${esc(st.intro)}</p>
      <p class="setup-legend small"><span><i class="lg-reuse"></i>${esc(st.legend.reuse)}</span><span><i class="lg-tape"></i>${esc(st.legend.tape)}</span><span><i class="lg-host"></i>${esc(st.legend.host)}</span></p>
      ${st.groups.map(g => `<section class="setup-group"><h4>${esc(g.name)}</h4>${setupSvg(g.host, g.name)}<ul>${g.items.map(p => `<li>${esc(p)}</li>`).join('')}</ul></section>`).join('')}
      <p class="muted small">${esc(st.note)}</p></div>`
    : '';
  // Plain bullet groups shown in full (球拍規定, 怎麼選球拍), each with an optional heading.
  const blocks = item.blocks
    ? `<div class="setup-body">${item.blocks.map(b => `<section class="setup-group">${b.name ? `<h4>${esc(b.name)}</h4>` : ''}${figureHtml(b.figure)}<ul>${b.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>`).join('')}</div>`
    : '';
  return `<article class="card rule" id="rules-${item.id}">
    <div class="card-head"><h3>${esc(item.title)}${enTag(item.en)}</h3></div>
    ${applies}
    <p class="summary">${esc(item.summary)}</p>
    ${sceneBlock(item)}
    ${setup}
    ${figureHtml(item.figure)}
    ${pickerHtml(item.picker)}
    ${blocks}
    ${detail}
  </article>`;
}

// 你以前打什麼？ one chip per sport; the suggestion shows under it (wirePicker).
function pickerHtml(pk) {
  if (!pk) return '';
  return `<div class="picker"><p class="picker-q"><b>${esc(pk.prompt)}</b></p>
    <div class="picker-options">${pk.options.map(o => `<button type="button" class="group-chip" data-pick="${o.id}" aria-pressed="false">${esc(o.label)}</button>`).join('')}</div>
    <div class="picker-result" aria-live="polite"></div><p class="muted small">${esc(pk.note)}</p></div>`;
}
function pickResultHtml(pk, o, fig) {
  const L = pk.labels;
  const shapes = fig && o.shapes ? `<div class="picker-shapes">${paddleShapesSvg(fig, o.shapes)}</div>` : '';
  const row = k => `<div class="me-row"><span class="muted">${esc(L[k])}</span><b>${esc(o[k])}</b></div>`;
  return `${shapes}${['shape', 'weight', 'grip', 'face'].map(row).join('')}
    <p><b>${esc(L.why)}</b>：${esc(o.why)}</p>
    ${o.watch.length ? `<p><b>${esc(L.watch)}</b></p><ul>${o.watch.map(w => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}`;
}
function wirePicker(el, pk, fig) {
  const box = el.querySelector('.picker');
  if (!box) return;
  box.addEventListener('click', e => {
    const b = e.target.closest('[data-pick]');
    if (!b) return;
    for (const x of box.querySelectorAll('[data-pick]')) x.setAttribute('aria-pressed', String(x === b));
    box.querySelector('.picker-result').innerHTML = pickResultHtml(pk, pk.options.find(o => o.id === b.dataset.pick), fig);
  });
}

function compareTable(c) {
  const [side, rally] = FILTER.scoring.options;
  return `<article class="card"><h3>${esc(c.title)}${enTag(c.en)}</h3><div class="table-wrap"><table>
    <thead><tr><th></th><th>${optionHtml(side)}</th><th>${optionHtml(rally)}</th></tr></thead>
    <tbody>${c.rows.map(r => `<tr>${r.map(x => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div></article>`;
}

// A rule for both play styles with its own singles text or scenes gets two
// pages: doubles at #rules/<id>, singles at #rules/<id>-singles.
const hasSingles = item => Boolean(item.singlesScenes || item.singlesSummary || item.singlesDetail);
const SINGLES = '-singles';
const ruleVersions = item => (hasSingles(item)
  ? [{ ...item, play: 'doubles' }, {
    ...item, id: item.id + SINGLES, play: 'singles',
    summary: item.singlesSummary ?? item.summary, detail: item.singlesDetail ?? item.detail, scenes: item.singlesScenes ?? item.scenes,
  }]
  : [item]);

// Every page reachable from the index, in reading order: the rules of each
// section, then the pages that are not one rule (compare, FAQ, glossary).
const PAGES = [
  ...SECTIONS.flatMap(sec => sec.items.flatMap(ruleVersions).map(item => ({ id: item.id, kind: 'rule', sec, item, title: item.title, en: item.en, summary: item.summary }))),
  { id: 'compare', kind: 'compare', title: COMPARE.title, en: COMPARE.en, summary: EXTRA_PAGES.compare.summary },
  { id: 'faq', kind: 'faq', title: EXTRA_PAGES.faq.title, en: EXTRA_PAGES.faq.en, summary: EXTRA_PAGES.faq.summary },
  { id: 'glossary', kind: 'glossary', title: EXTRA_PAGES.glossary.title, en: EXTRA_PAGES.glossary.en, summary: EXTRA_PAGES.glossary.summary },
];

// Pages that were removed or merged: old links land on their replacement.
const MOVED = {
  singles: 'points-singles', scoring: 'points', 'scoring-singles': 'points-singles',
  'rally-basics': 'rally-positions', 'rally-singles': 'rally-positions-singles',
};

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

// The side-out vs rally table closes whichever scoring section is shown.
const sectionPages = (sec, f) => [
  ...PAGES.filter(p => p.sec === sec && pageShown(p, f)),
  ...(sec.scoring ? PAGES.filter(p => p.kind === 'compare') : []),
];
const MORE = PAGES.filter(p => !p.sec && p.kind !== 'compare');

// Fun formats have their own pages (#formats/<id>) but are listed here, under
// the rules tab, whatever the filter.
const FORMAT_LINKS = FORMATS.map(f => ({ href: `#formats/${f.id}`, id: `formats/${f.id}`, title: f.name, en: f.en, summary: f.tagline, group: f.group }));
// Grouped by purpose (人多場地少, 想練技術, …), in data order.
const FORMAT_GROUPS = [...new Set(FORMATS.map(f => f.group))].map(g => [g, FORMAT_LINKS.filter(p => p.group === g)]);

// The table of contents for a filter: the one source of page order. The
// index, the drawer and prev / next all read it, so they cannot disagree.
// Each group has lists of [subheading or null, pages].
function toc(f) {
  return [
    ...SECTIONS.filter(sec => sectionShown(sec, f)).map(sec => ({ sec, title: sec.title, en: sec.en, lists: [[null, sectionPages(sec, f)]] })),
    { id: 'formats', title: FORMATS_PAGE.title, en: FORMATS_PAGE.en, note: FORMATS_PAGE.note, lists: FORMAT_GROUPS },
    { title: RULES_INDEX.more, en: RULES_INDEX.moreEn, lists: [[null, MORE]] },
  ];
}
const tocPages = f => toc(f).flatMap(g => g.lists.flatMap(([, pages]) => pages));
const hrefOf = p => p.href ?? `#rules/${p.id}`;

// Prev / next for any page in the reading order of the filter.
function pagerHtml(id, f) {
  const list = tocPages(f), i = list.findIndex(q => q.id === id);
  const step = (q, label, cls) => q
    ? `<a class="pager-link ${cls}" href="${hrefOf(q)}"><span class="muted small">${esc(label)}</span><b>${esc(q.title)}</b></a>`
    : '<span></span>';
  return `<nav class="pager">${step(list[i - 1], RULE_PAGE.prev, 'prev')}${step(list[i + 1], RULE_PAGE.next, 'next')}</nav>`;
}

const link = p => `<a class="rule-link" href="${hrefOf(p)}">
  <span class="rule-link-text"><b>${esc(p.title)}${enTag(p.en)}</b><span class="rule-link-sum">${esc(p.summary)}</span></span></a>`;

// The two switches in the sticky bar: 雙打｜單打 and 側出計分｜每球得分 (English in small type).
function barFilterHtml(f) {
  const seg = k => `<div class="seg bar-seg" role="group" aria-label="${esc(FILTER[k].label)}">${FILTER[k].options.map(o =>
    `<button type="button" data-filter="${k}" data-value="${o.id}" aria-pressed="${f[k] === o.id}">${esc(o.label)}${o.en ? `<span class="seg-en" aria-hidden="true">${esc(o.en)}</span>` : ''}</button>`).join('')}</div>`;
  return `${seg('play')}${seg('scoring')}`;
}

function indexHtml(f) {
  const groups = toc(f).map(g => `
    <section class="rule-group"${g.sec || g.id ? ` id="rules-${g.sec?.id ?? g.id}"` : ''} data-title="${esc(g.title)}">
      <h3>${esc(g.title)}${enTag(g.en)}${g.sec?.subtitle ? ` <span class="muted small">${esc(g.sec.subtitle)}</span>` : ''}</h3>
      ${g.sec?.note ? `<p class="small section-note">${esc(g.sec.note)}</p>` : ''}${g.note ? `<p class="muted small">${esc(g.note)}</p>` : ''}
      ${g.lists.map(([sub, pages]) => `${sub ? `<h4 class="format-group">${esc(sub)}</h4>` : ''}<div class="rule-list">${pages.map(link).join('')}</div>`).join('')}
    </section>`).join('');
  return `
    <div class="section-head"><h2>${esc(RULES_INDEX.title)}</h2></div>
    ${groups}`;
}

// "適用：雙打｜側出計分" under a rule's title.
function appliesHtml(p) {
  const playHtml = p.item.play ? optionHtml(optionById('play', p.item.play)) : esc(FILTER.both.play);
  const scoring = p.sec.scoring ? optionHtml(optionById('scoring', p.sec.scoring)) : esc(FILTER.both.scoring);
  return `<div class="format-meta applies"><span class="muted">${esc(FILTER.applies)}</span><span>${playHtml}</span><span>${scoring}</span></div>`;
}

function pageBody(p, f) {
  if (p.kind === 'rule') return ruleCard(p.item, appliesHtml(p));
  if (p.kind === 'compare') return compareTable(COMPARE);
  if (p.kind === 'faq') {
    return `<div class="section-head"><h2>${esc(p.title)}</h2><p class="sub">${esc(p.en)}</p></div>
      <div class="faq">${MISCONCEPTIONS.map(m => `<details><summary>${esc(m.q)}</summary><p>${esc(m.a)}</p></details>`).join('')}</div>`;
  }
  return `<div class="section-head"><h2>${esc(p.title)}</h2><p class="sub">${esc(p.en)}</p></div>
    <div class="glossary">${GLOSSARY.map(g => `<div class="term"><b>${esc(g.zh)} <span class="en">${esc(g.en)}</span></b>${g.alias ? `<span class="muted small">${esc(g.alias)}</span>` : ''}<span class="small">${esc(g.def)}</span></div>`).join('')}</div>`;
}

// On a fun format's page the bar switches purpose group instead: the current
// format's group is pressed, another one jumps to that group's first format.
function formatBarHtml(i) {
  const short = FORMATS_PAGE.groupShort;
  return `<div class="seg bar-seg" role="group" aria-label="${esc(FORMATS_PAGE.groupLabel)}">${FORMAT_GROUPS.map(([g]) =>
    `<button type="button" data-format-group="${esc(g)}" aria-pressed="${FORMATS[i].group === g}" aria-label="${esc(g)}">${esc(short[g] ?? g)}</button>`).join('')}</div>`;
}

// A fun format's page (#formats/<id>).
const formatPageHtml = (i, f) => `${formatCardHtml(FORMATS[i])}${pagerHtml(`formats/${FORMATS[i].id}`, f)}`;
const formatIndex = key => (key.startsWith('formats/') ? FORMATS.findIndex(f => `formats/${f.id}` === key) : -1);

// A rule (or compare / FAQ / glossary) page. Opening a rule switches the
// filter to match it (see show), so it is always in the filter's order.
function pageHtml(p, f) {
  // Scoring steps end with a link that opens the scoreboard in the same mode.
  const tryScore = p.item?.step
    ? `<a class="btn btn-block try-score" href="#score?play=${p.item.play}&scoring=${p.sec.scoring}">${esc(RULE_PAGE.tryScore)}</a>`
    : '';
  return `
    ${pageBody(p, f)}
    ${tryScore}
    ${pagerHtml(p.id, f)}`;
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
  const item = p => `<li><a href="${hrefOf(p)}" data-id="${p.id}">${esc(p.title)}${enTag(p.en)}</a></li>`;
  return `<p class="drawer-note">${esc(FILTER.showing)}<b>${optionHtml(optionById('play', f.play))}・${optionHtml(optionById('scoring', f.scoring))}</b></p>
    <a class="drawer-home" href="#rules" data-id="">${esc(DRAWER.home)}</a>
    ${toc(f).map(g => `<h3>${esc(g.title)}${enTag(g.en)}</h3>
      ${g.lists.map(([sub, pages]) => `${sub ? `<h4>${esc(sub)}</h4>` : ''}<ul>${pages.map(item).join('')}</ul>`).join('')}`).join('')}`;
}

function drawerHtml() {
  return `<dialog class="drawer" aria-label="${esc(DRAWER.title)}">
    <div class="drawer-head"><b>${esc(DRAWER.title)}</b><button class="drawer-close" type="button" aria-label="${esc(DRAWER.close)}">×</button></div>
    <nav class="drawer-body"></nav>
  </dialog>`;
}

// Renders the index (sub = ''), one page (sub = page id) or one fun format
// (sub = 'formats/<id>'). An unknown id is a bad link, not a bad state, so it
// falls back to the index.
export function mountRules(root) {
  // A sticky bar on top of every rules page holds the 雙打｜單打 and
  // 側出計分｜每球得分 switches and share. The contents drawer opens from a small tab on the left edge (tap it or drag
  // it right); a swipe from the screen edge itself is the system back gesture.
  root.innerHTML = `<div class="rules-bar"><div class="bar-filters"></div><span class="bar-share"></span><p class="filter-hint" hidden>${esc(FILTER.hint)}</p></div>
    <button class="drawer-tab" type="button" aria-haspopup="dialog" aria-label="${esc(DRAWER.title)}"><span>${esc(DRAWER.open)}</span></button>
    <div class="rules-page"></div>${drawerHtml()}`;
  const filtersEl = root.querySelector('.bar-filters');
  const hintEl = root.querySelector('.filter-hint');
  const shareSlot = root.querySelector('.bar-share');
  shareSlot.addEventListener('click', e => { if (e.target.closest('.share-btn')) sharePage(PAGES.find(q => q.id === current)?.title ?? FORMATS[formatIndex(current)]?.name ?? RULES_INDEX.title); });
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
    const fi = formatIndex(current);
    pageEl.innerHTML = p ? pageHtml(p, filter) : fi >= 0 ? formatPageHtml(fi, filter) : indexHtml(filter);
    // Fun formats are not filtered by play or scoring: their bar picks a purpose group.
    filtersEl.innerHTML = fi >= 0 ? formatBarHtml(fi) : barFilterHtml(filter);
    if (fi >= 0) hintEl.hidden = true;
    shareSlot.innerHTML = shareButtonHtml();
    drawerNav.innerHTML = drawerNavHtml(filter);
    for (const a of drawerNav.querySelectorAll('a[data-id]')) {
      if (a.dataset.id === current) a.setAttribute('aria-current', 'page');
    }
    if (fi >= 0) wireFormat(pageEl, FORMATS[fi]);
    if (p?.kind === 'rule') {
      const wrap = pageEl.querySelector('.scene-wrap');
      if (wrap) wireScene(wrap, p.item.scenes);
      if (p.item.picker) wirePicker(pageEl, p.item.picker, p.item.figure);
    }
  };
  // Switching play or scoring, from the bar or a rule page. A rule that does
  // not apply to the new combination hands over to its counterpart, or to the
  // index with a note.
  root.addEventListener('click', e => {
    const g = e.target.closest('[data-format-group]');
    if (g) { location.hash = FORMAT_GROUPS.find(([name]) => name === g.dataset.formatGroup)[1][0].href; return; }
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    filter = { ...filter, [b.dataset.filter]: b.dataset.value };
    saveFilter(filter);
    const p = PAGES.find(q => q.id === current);
    if (p && !pageShown(p, filter)) {
      // The same rule's other play version, or the same scoring step under
      // the other scoring (else that section's first page), takes over
      // silently; anything else goes back to the index.
      const twin = PAGES.find(q => q.id === (p.id.endsWith(SINGLES) ? p.id.slice(0, -SINGLES.length) : p.id + SINGLES));
      const step = p.item.step && PAGES.find(q => q.item?.step === p.item.step && pageShown(q, filter));
      const firstStep = p.sec.scoring && PAGES.find(q => q.kind === 'rule' && q.sec.scoring && pageShown(q, filter));
      const to = (twin && pageShown(twin, filter) && twin) || step || firstStep;
      if (!to) {
        const combo = `${optionById('play', filter.play).label}・${optionById('scoring', filter.scoring).label}`;
        toast(esc(FILTER.backToIndex.replace('{combo}', combo)));
      }
      location.hash = to ? `#rules/${to.id}` : '#rules';
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
      const key = PAGES.some(p => p.id === sub) || formatIndex(sub) >= 0 ? sub : '';
      if (drawer.open) drawer.close();
      if (key === current) return;
      current = key;
      // A link to a rule outside the current filter (a friend's shared link)
      // switches the bar to that rule's play and scoring.
      const p = PAGES.find(q => q.id === key);
      if (p?.kind === 'rule' && !pageShown(p, filter)) {
        filter = { play: p.item.play ?? filter.play, scoring: p.sec.scoring ?? filter.scoring };
        saveFilter(filter);
      }
      render();
    },
  };
}
