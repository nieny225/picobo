// Step-by-step court scenes shared by the rules and formats views: the court
// drawn by court.js above a scroll-snap caption strip, with dots, prev/next
// and a swipe on the court itself.
import { renderCourt } from '../court.js';
import { SCENE_NAV } from '../data/nav.js';

// On phones the court is drawn lying down so a whole step (court, caption,
// buttons) fits on one screen; desktop keeps it upright.
export const LANDSCAPE = matchMedia('(max-width: 767px)');

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// English term after a title, e.g. 發球（Serve）.
export const enTag = en => (en ? `<span class="en-tag">（${esc(en)}）</span>` : '');

export function sceneBlock(item) {
  if (!item.scenes || item.scenes.length === 0) return '';
  const steps = item.scenes.map((sc, i) =>
    `<div class="step"><p class="step-caption"><span class="step-no">${i + 1}/${item.scenes.length}</span>${esc(sc.caption)}</p></div>`).join('');
  const dots = item.scenes.map((_, i) => `<button class="dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="${esc(SCENE_NAV.step.replace('{n}', i + 1))}"></button>`).join('');
  const nav = item.scenes.length > 1
    ? `<div class="scene-nav"><button class="btn btn-ghost" data-dir="-1">${esc(SCENE_NAV.prev)}</button><div class="dots">${dots}</div><button class="btn btn-ghost" data-dir="1">${esc(SCENE_NAV.next)}</button></div>`
    : '';
  return `<div class="scene-wrap" data-scene="${item.id}"><div class="court-wrap"></div><div class="steps">${steps}</div>${nav}</div>`;
}

// Calls back with +1 (swipe left, next) or -1 (swipe right, previous) for a
// clearly horizontal touch swipe. The element has touch-action: pan-y, so
// vertical drags still scroll the page.
function onHorizontalSwipe(el, cb) {
  let x0 = null, y0 = 0;
  el.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) { x0 = null; return; }
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > 1.5 * Math.abs(dy)) cb(dx < 0 ? 1 : -1);
  }, { passive: true });
  el.addEventListener('touchcancel', () => { x0 = null; });
}

export function wireScene(wrap, scenes) {
  const court = wrap.querySelector('.court-wrap');
  const steps = wrap.querySelector('.steps');
  const dots = [...wrap.querySelectorAll('.dot')];
  const prev = wrap.querySelector('[data-dir="-1"]');
  const next = wrap.querySelector('[data-dir="1"]');
  let current = -1;
  const draw = () => renderCourt(court, scenes[current], { landscape: LANDSCAPE.matches });
  LANDSCAPE.addEventListener('change', () => { if (court.isConnected) draw(); });
  const setStep = i => {
    i = Math.max(0, Math.min(scenes.length - 1, i));
    if (i === current) return;
    current = i;
    draw();
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
  onHorizontalSwipe(court, dir => goTo(current + dir));
  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));
  wrap.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
  });
  wrap.tabIndex = 0;
  setStep(0);
}

