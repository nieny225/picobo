import { SHARE } from '../data/nav.js';
import { esc } from './scenes.js';

// A small share button for the current page. Uses the system share sheet
// when there is one, else copies the link, else shows the link to copy by
// hand. The link is always the public site plus the current hash.
export const shareButtonHtml = () =>
  `<button class="share-btn" type="button" aria-label="${esc(SHARE.aria)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg><span>${esc(SHARE.label)}</span></button>`;

let toastTimer = 0;
export function toast(html) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.append(el);
  }
  el.innerHTML = html;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 4000);
}

// `url` defaults to this page on the public site.
export async function sharePage(title, url = SHARE.url + location.hash) {
  if (navigator.share) {
    try { await navigator.share({ title, url }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast(esc(SHARE.copied));
  } catch {
    toast(`${esc(SHARE.manual)}<br><span class="toast-url">${esc(url)}</span>`);
  }
}
