import { HOME } from '../data/home.js';
import { esc } from './scenes.js';
import { SHARE } from '../data/nav.js';
import { sharePage } from './share.js';

// Install the app: a button in the top bar.
// Chrome, Edge and Android hand us an install prompt (beforeinstallprompt)
// that a button can trigger. iPhone, iPad and Mac Safari have no prompt, so
// they get the Share > Add to Home Screen (or File > Add to Dock) steps.
// Android without a prompt (just uninstalled, or Chrome not offering yet) gets
// the ⋮ > Install app steps; in-app browsers (LINE, Facebook, Instagram) are
// told to open the page in a real browser first. Once the app runs installed
// (no address bar to copy) or where install is not offered, the same spot is
// a small share icon for inviting friends to picobo.net.
let deferred = null;
const listeners = new Set();
const changed = () => listeners.forEach(f => f());

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; changed(); });
window.addEventListener('appinstalled', () => { deferred = null; changed(); });

const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const iosSafari = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const macSafari = () => /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints <= 1
  && /Version\/[\d.]+ Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|Firefox/.test(navigator.userAgent);
const inApp = () => /\bLine\/|FBAN|FBAV|Instagram/i.test(navigator.userAgent);
const android = () => /Android/.test(navigator.userAgent);
// The how-to text for browsers without a prompt, or null where install is not offered.
const manualSteps = () => (inApp() ? HOME.install.inApp
  : iosSafari() ? HOME.install.ios
  : android() ? HOME.install.android
  : macSafari() ? HOME.install.mac : null);
const offered = () => !installed() && (deferred || manualSteps());

async function promptInstall() {
  const prompt = deferred;
  deferred = null;
  prompt.prompt();
  await prompt.userChoice.catch(() => null);
  changed();
}

const ICON = {
  install: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  invite: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
};
const svg = d => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

// Top-bar button: install (the browser's prompt, or a sheet with the steps)
// while that is on offer, otherwise invite (share picobo.net).
export function mountInstallButton(btn) {
  const t = HOME.install;
  const render = () => {
    const invite = !offered();
    btn.classList.toggle('is-invite', invite);
    btn.innerHTML = invite ? svg(ICON.invite) : `${svg(ICON.install)}<span>${esc(t.short)}</span>`;
    btn.setAttribute('aria-label', invite ? t.invite.aria : t.aria);
    btn.title = invite ? t.invite.aria : t.aria;
    btn.hidden = false;
  };
  btn.addEventListener('click', () => {
    if (!offered()) { sharePage(t.invite.title, SHARE.url, t.invite.text); return; }
    if (deferred) { promptInstall(); return; }
    let dlg = document.querySelector('.install-steps');
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'install-sheet install-steps';
      document.body.append(dlg);
      dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('button')) dlg.close(); });
    }
    dlg.innerHTML = `<b>${esc(t.title)}</b><p>${esc(manualSteps())}</p><button class="btn btn-primary" type="button">${esc(t.close)}</button>`;
    dlg.showModal();
  });
  listeners.add(render);
  render();
}

// Offline support. Fails quietly where service workers are not allowed (the
// claude.ai artifact preview, private modes); the page works the same online.
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').catch(() => { /* not available here */ });
}
