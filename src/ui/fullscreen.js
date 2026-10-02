// Full screen for one view at a time (the scoreboard, the draw). Where the
// browser allows it (Android, desktop) it is real full screen; where it does
// not (iPhone Safari, the claude.ai preview) the same layout fills the page.
// Either way <html> carries .is-fullscreen and data-full="<owner>", and the
// CSS does the rest. Leaving the owner's tab, Esc or the back gesture ends it.
const html = document.documentElement;
const listeners = new Set();

export const isFull = owner => html.classList.contains('is-fullscreen') && (!owner || html.dataset.full === owner);

function set(on) {
  html.classList.toggle('is-fullscreen', on);
  if (!on) delete html.dataset.full;
  for (const fn of listeners) fn(on);
}

// Called with true / false whenever full screen starts or ends.
export function onFullChange(fn) { listeners.add(fn); }

export async function toggleFull(owner) {
  if (document.fullscreenElement) { await document.exitFullscreen().catch(() => {}); return; }
  if (isFull()) { set(false); return; }
  html.dataset.full = owner;
  if (document.fullscreenEnabled) {
    try { await html.requestFullscreen({ navigationUI: 'hide' }); return; } catch { /* refused: fall back to the in-page layout */ }
  }
  set(true);
}

export async function exitFull() {
  if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
  else if (isFull()) set(false);
}

document.addEventListener('fullscreenchange', () => set(!!document.fullscreenElement));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && isFull() && !document.fullscreenElement) set(false); });
window.addEventListener('hashchange', () => {
  const route = location.hash.replace(/^#/, '').split(/[/?]/)[0];
  if (isFull() && route !== html.dataset.full) exitFull();
});

// Four corners pointing out to enter, pointing in to leave.
export function fullIcon(labels) {
  const on = isFull();
  const d = on ? 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5' : 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5';
  const label = String(on ? labels.exitFullscreen : labels.fullscreen).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg><span class="sr-only">${label}</span>`;
}
