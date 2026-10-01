import { HOME } from '../data/home.js';
import { esc } from './scenes.js';

// "Install the app" card on the home page. Chrome, Edge and Android hand us an
// install prompt (beforeinstallprompt) that a button can trigger. iPhone and
// iPad Safari have no prompt, so they get the Share > Add to Home Screen steps.
// Nothing shows once the app runs installed, or where neither applies.
let deferred = null;
const listeners = new Set();
const changed = () => listeners.forEach(f => f());

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; changed(); });
window.addEventListener('appinstalled', () => { deferred = null; changed(); });

const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const iosSafari = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function mountInstall(el) {
  const render = () => {
    const t = HOME.install;
    if (installed() || (!deferred && !iosSafari())) { el.hidden = true; el.innerHTML = ''; return; }
    el.hidden = false;
    el.innerHTML = deferred
      ? `<b>${esc(t.title)}</b><span>${esc(t.desc)}</span><button class="btn btn-primary" type="button">${esc(t.button)}</button>`
      : `<b>${esc(t.title)}</b><span>${esc(t.ios)}</span>`;
    el.querySelector('button')?.addEventListener('click', async () => {
      const prompt = deferred;
      deferred = null;
      prompt.prompt();
      await prompt.userChoice.catch(() => null);
      render();
    });
  };
  listeners.add(render);
  render();
}

// Offline support. Fails quietly where service workers are not allowed (the
// claude.ai artifact preview, private modes); the page works the same online.
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').catch(() => { /* not available here */ });
}
