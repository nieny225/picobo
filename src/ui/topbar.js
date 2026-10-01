// Hides the sticky top bar while the page scrolls down (the chrome-hidden
// class on <html> lets bars under it move up to the top), and brings them back on any
// scroll up, so the content gets the whole screen on a phone.
export function autoHideTopbar(bar) {
  const root = document.documentElement;
  // Sticky bars under the header (the rules bar) sit at this offset.
  const measure = () => root.style.setProperty('--topbar-h', `${bar.offsetHeight}px`);
  measure();
  window.addEventListener('resize', measure);
  let lastY = window.scrollY;
  let ticking = false;
  const set = hidden => {
    bar.classList.toggle('is-hidden', hidden);
    root.classList.toggle('chrome-hidden', hidden);
  };
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const delta = y - lastY;
    if (Math.abs(delta) < 6) return;
    set(delta > 0 && y > bar.offsetHeight);
    lastY = y;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  return { show() { set(false); lastY = window.scrollY; } };
}
