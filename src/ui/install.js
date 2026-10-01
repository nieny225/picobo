import { HOME } from '../data/home.js';
import { esc } from './scenes.js';

// Install the app: a card on the home page and a button in the top bar.
// Chrome, Edge and Android hand us an install prompt (beforeinstallprompt)
// that a button can trigger. iPhone, iPad and Mac Safari have no prompt, so
// they get the Share > Add to Home Screen (or File > Add to Dock) steps.
// Nothing shows once the app runs installed, or where neither applies (the
// claude.ai artifact preview, Firefox, in-app browsers).
let deferred = null;
const listeners = new Set();
const changed = () => listeners.forEach(f => f());

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; changed(); });
window.addEventListener('appinstalled', () => { deferred = null; changed(); });

const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const iosSafari = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const macSafari = () => /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints <= 1
  && /Version\/[\d.]+ Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|Firefox/.test(navigator.userAgent);
// The how-to text for browsers without a prompt, or null where install is not offered.
const manualSteps = () => (iosSafari() ? HOME.install.ios : macSafari() ? HOME.install.mac : null);
const offered = () => !installed() && (deferred || manualSteps());

async function promptInstall() {
  const prompt = deferred;
  deferred = null;
  prompt.prompt();
  await prompt.userChoice.catch(() => null);
  changed();
}

// Top-bar button: the browser's install prompt, or a small sheet with the steps.
export function mountInstallButton(btn) {
  const render = () => {
    btn.hidden = !offered();
    btn.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg><span>${esc(HOME.install.short)}</span>`;
    btn.setAttribute('aria-label', HOME.install.aria);
  };
  btn.addEventListener('click', () => {
    if (deferred) { promptInstall(); return; }
    let dlg = document.querySelector('.install-sheet');
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'install-sheet';
      document.body.append(dlg);
      dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('button')) dlg.close(); });
    }
    dlg.innerHTML = `<b>${esc(HOME.install.title)}</b><p>${esc(manualSteps())}</p><button class="btn btn-primary" type="button">${esc(HOME.install.close)}</button>`;
    dlg.showModal();
  });
  listeners.add(render);
  render();
}

export function mountInstall(el) {
  const render = () => {
    const t = HOME.install;
    if (!offered()) { el.hidden = true; el.innerHTML = ''; return; }
    el.hidden = false;
    el.innerHTML = deferred
      ? `<b>${esc(t.title)}</b><span>${esc(t.desc)}</span><button class="btn btn-primary" type="button">${esc(t.button)}</button>`
      : `<b>${esc(t.title)}</b><span>${esc(manualSteps())}</span>`;
    el.querySelector('button')?.addEventListener('click', promptInstall);
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
