import { SCORE_SHARE as T } from '../data/nav.js';
import { scoreCard, statsCard } from '../sharecard.js';
import { esc } from './scenes.js';
import { toast } from './share.js';

// Share a finished game or the 抽籤 戰績 as a picture: drawn here on a
// canvas (optionally over the player's own photo, which never leaves the
// phone), then handed to the system share sheet (Instagram, LINE…) or saved.
// A game can also go out as a transparent sticker to paste into an IG story.
// The cards are always the light brand look, whatever the page theme.
const C = { bg: '#fffbe8', ink: '#111111', mark: '#e4ff3a', muted: '#4d4a3c', line: '#d9d3b8', court: '#2d6cdf', nvz: '#5b93f0', white: '#ffffff' };
const NUM = '"Space Grotesk", "Noto Sans TC", "PingFang TC", "Helvetica Neue", Arial, sans-serif';
const CJK = '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", "Helvetica Neue", Arial, sans-serif';
const W = 1080;
const SIZES = { story: 1920, post: 1350 };

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function rect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
}

// A box in the brand style: hard ink shadow, fill, thick ink border.
function box(ctx, x, y, w, h, { fill, r = 36, border = 9, shadow = 18 }) {
  if (shadow) { ctx.fillStyle = C.ink; rect(ctx, x + shadow, y + shadow, w, h, r); ctx.fill(); }
  ctx.fillStyle = fill; rect(ctx, x, y, w, h, r); ctx.fill();
  if (border) { ctx.lineWidth = border; ctx.strokeStyle = C.ink; rect(ctx, x, y, w, h, r); ctx.stroke(); }
}

// Text that shrinks until it fits `max` wide.
function fitText(ctx, text, x, y, max, size, weight, family) {
  let s = size;
  do { ctx.font = `${weight} ${s}px ${family}`; s -= 2; } while (ctx.measureText(text).width > max && s > 12);
  ctx.fillText(text, x, y);
}

// The player's photo, cropped to fill; without one, a court seen from above.
function background(ctx, h, photo) {
  if (photo) {
    const k = Math.max(W / photo.width, h / photo.height);
    const pw = photo.width * k, ph = photo.height * k;
    ctx.drawImage(photo, (W - pw) / 2, (h - ph) / 2, pw, ph);
    return;
  }
  ctx.fillStyle = C.court; ctx.fillRect(0, 0, W, h);
  ctx.fillStyle = C.nvz; ctx.fillRect(0, h * 0.4, W, h * 0.2);
  ctx.strokeStyle = C.white; ctx.lineWidth = 12;
  ctx.strokeRect(90, 70, W - 180, h - 140);
  ctx.beginPath();
  ctx.moveTo(90, h * 0.4); ctx.lineTo(W - 90, h * 0.4);
  ctx.moveTo(90, h * 0.6); ctx.lineTo(W - 90, h * 0.6);
  ctx.moveTo(W / 2, 70); ctx.lineTo(W / 2, h * 0.4);
  ctx.moveTo(W / 2, h * 0.6); ctx.lineTo(W / 2, h - 70);
  ctx.stroke();
  ctx.fillStyle = C.white; ctx.fillRect(40, h / 2 - 9, W - 80, 18);
}

// Top-left brand tag: "picobo." on yellow with a hard shadow, 痞克柏 in black.
function brandTag(ctx) {
  ctx.font = `700 120px ${NUM}`;
  const w = ctx.measureText(T.brand).width + 72;
  box(ctx, 66, 72, w, 186, { fill: C.mark, r: 0, border: 9, shadow: 24 });
  ctx.fillStyle = C.ink; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillText(T.brand, 102, 168);
  ctx.font = `900 54px ${CJK}`;
  const zw = ctx.measureText(T.brandZh).width + 48;
  ctx.fillStyle = C.ink; rect(ctx, 66 + w + 48, 108, zw, 96, 12); ctx.fill();
  ctx.fillStyle = C.white; ctx.fillText(T.brandZh, 66 + w + 72, 158);
}

// A small yellow block with the site address, right-aligned at (x, y), so
// whoever sees the picture knows where to find it. Returns its width.
function brandSmall(ctx, xRight, y, size = 48) {
  ctx.font = `700 ${size}px ${NUM}`;
  const w = ctx.measureText(T.url).width + size * 0.6;
  const h = size * 1.4;
  ctx.fillStyle = C.mark; ctx.fillRect(xRight - w, y - h / 2, w, h);
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.strokeRect(xRight - w, y - h / 2, w, h);
  ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(T.url, xRight - w / 2, y + 2);
  return w;
}

// The score band along the bottom (B1). Names sit beside the score when they
// fit; longer names move to their own row under it.
function scoreBand(ctx, h, card) {
  const x = 42, w = W - 84, bh = 552, y = h - bh - 54;
  box(ctx, x, y, w, bh, { fill: C.bg });
  ctx.font = `700 210px ${NUM}`;
  const [a, b] = card.scores.map(String);
  const colon = ' : ';
  const wa = ctx.measureText(a).width, wc = ctx.measureText(colon).width, wb = ctx.measureText(b).width;
  const half = (wa + wc + wb) / 2;
  const side = W / 2 - half - x - 84;
  ctx.font = `900 60px ${CJK}`;
  const widest = Math.max(...card.teams.flat().map(n => ctx.measureText(n).width));
  const beside = widest <= side;
  const mid = y + (beside ? 210 : 165);
  // Score in the middle, the winner's number on yellow.
  ctx.font = `700 ${beside ? 210 : 190}px ${NUM}`;
  const k = beside ? 1 : 190 / 210;
  let sx = W / 2 - half * k;
  const hi = (i, sw) => { if (card.winner === i) { ctx.fillStyle = C.mark; ctx.fillRect(sx - 18, mid - 112, sw * k + 36, 224); } };
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  hi(0, wa); ctx.fillStyle = C.ink; ctx.fillText(a, sx, mid + 8); sx += wa * k;
  ctx.fillText(colon, sx, mid + 8); sx += wc * k;
  hi(1, wb); ctx.fillStyle = C.ink; ctx.fillText(b, sx, mid + 8);
  ctx.fillStyle = C.ink;
  for (const [i, names] of card.teams.entries()) {
    ctx.textAlign = i === 0 ? 'left' : 'right';
    const nx = i === 0 ? x + 48 : x + w - 48;
    if (beside) {
      const lh = 78, top = mid - ((names.length - 1) * lh) / 2;
      names.forEach((n, j) => fitText(ctx, n, nx, top + j * lh, side, 60, 900, CJK));
    } else {
      fitText(ctx, names.join('・'), nx, y + 330, w / 2 - 72, 56, 900, CJK);
    }
  }
  // Meta line and the small brand block.
  const bw = brandSmall(ctx, x + w - 48, y + bh - 96, 52);
  ctx.textAlign = 'left'; ctx.fillStyle = C.muted;
  fitText(ctx, card.meta, x + 48, y + bh - 96, w - 96 - bw - 30, 44, 700, CJK);
}

// 戰績 rows inside a box: rank badge, name, played, won.
function statsRows(ctx, card, x, y, w, rowH) {
  ctx.textBaseline = 'middle';
  const colWon = x + w - 24, colPlayed = colWon - 150;
  card.rows.forEach((r, i) => {
    const cy = y + i * rowH + rowH / 2;
    if (i === 0) { ctx.fillStyle = C.mark; ctx.fillRect(x, cy - rowH / 2, w, rowH); }
    ctx.strokeStyle = C.line; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(x, cy + rowH / 2); ctx.lineTo(x + w, cy + rowH / 2); ctx.stroke();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(x + 54, cy, 36, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.font = `700 36px ${NUM}`; ctx.fillText(String(r.rank), x + 54, cy + 2);
    ctx.textAlign = 'left'; fitText(ctx, r.name, x + 120, cy, colPlayed - x - 240, 54, 700, CJK);
    ctx.textAlign = 'right'; ctx.font = `700 54px ${NUM}`;
    ctx.fillText(i === 0 ? `${r.played} ${T.played}` : String(r.played), colPlayed, cy);
    ctx.fillText(i === 0 ? `${r.won} ${T.won}` : String(r.won), colWon, cy);
  });
  if (card.rest) {
    ctx.textAlign = 'left'; ctx.fillStyle = C.muted; ctx.font = `500 44px ${CJK}`;
    ctx.fillText(card.rest, x + 24, y + card.rows.length * rowH + rowH / 2);
  }
}

// 戰績 without a photo: the whole card in cream (E). No title: the table
// says what it is.
function statsPlain(ctx, h, card) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, h);
  brandTag(ctx);
  ctx.fillStyle = C.ink; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.font = `900 52px ${CJK}`; ctx.fillText(card.meta, 78, 360);
  const rowH = h > 1500 ? 140 : 104;
  statsRows(ctx, card, 78, 420, W - 156, rowH);
  brandSmall(ctx, W - 78, h - 120, 64);
}

// 戰績 over a photo: brand tag on top, the ranking on a cream panel below
// with the date and the site address in its top row.
function statsOnPhoto(ctx, h, card) {
  brandTag(ctx);
  const rowH = h > 1500 ? 102 : 78;
  const rows = card.rows.length + (card.rest ? 1 : 0);
  const ph = 140 + rows * rowH + 30;
  const x = 42, w = W - 84, y = h - ph - 54;
  box(ctx, x, y, w, ph, { fill: C.bg });
  const bw = brandSmall(ctx, x + w - 48, y + 78, 44);
  ctx.fillStyle = C.ink; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  fitText(ctx, card.meta, x + 48, y + 80, w - 96 - bw - 30, 48, 900, CJK);
  statsRows(ctx, card, x + 30, y + 140, w - 60, rowH);
}

// The whole picture for `kind` at `format`, onto `canvas`.
function drawCard(canvas, kind, card, format, photo) {
  const h = SIZES[format];
  canvas.width = W; canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (kind === 'stats' && !photo) { statsPlain(ctx, h, card); return; }
  background(ctx, h, photo);
  if (kind === 'stats') { statsOnPhoto(ctx, h, card); return; }
  brandTag(ctx);
  scoreBand(ctx, h, card);
}

// The score as a sticker on a transparent background (C).
function drawSticker(canvas, card) {
  const w = 900, h = 560;
  canvas.width = w + 24; canvas.height = h + 24;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = C.ink; rect(ctx, 12, 12, w, h, 72); ctx.fill();
  ctx.lineWidth = 14; ctx.strokeStyle = C.mark; rect(ctx, 12, 12, w, h, 72); ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.white;
  fitText(ctx, card.teams[0].join('・'), 12 + w / 2, 100, w - 120, 52, 700, CJK);
  ctx.font = `700 190px ${NUM}`;
  const [a, b] = card.scores.map(String);
  const dash = ' – ';
  const wa = ctx.measureText(a).width, wd = ctx.measureText(dash).width, wb = ctx.measureText(b).width;
  let sx = 12 + w / 2 - (wa + wd + wb) / 2;
  ctx.textAlign = 'left';
  ctx.fillStyle = card.winner === 0 ? C.mark : C.white; ctx.fillText(a, sx, 262); sx += wa;
  ctx.fillStyle = C.white; ctx.fillText(dash, sx, 262); sx += wd;
  ctx.fillStyle = card.winner === 1 ? C.mark : C.white; ctx.fillText(b, sx, 262);
  ctx.textAlign = 'center'; ctx.fillStyle = C.white;
  fitText(ctx, card.teams[1].join('・'), 12 + w / 2, 410, w - 120, 52, 700, CJK);
  ctx.font = `700 44px ${NUM}`;
  const bw = ctx.measureText(T.url).width + 40;
  ctx.fillStyle = C.mark; rect(ctx, 12 + w / 2 - bw / 2, 470, bw, 64, 12); ctx.fill();
  ctx.fillStyle = C.ink; ctx.fillText(T.url, 12 + w / 2, 504);
}

// The icon for sharing to IG: a plain camera (not Instagram's own mark),
// distinct from the three-dot icon that shares a link.
export const CAMERA_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></svg>';

const toBlob = canvas => new Promise((resolve, reject) => canvas.toBlob(b => (b ? resolve(b) : reject(new Error('sharecard: no image'))), 'image/png'));

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  toast(esc(T.saved));
}

// The share sheet itself, shared by the scoreboard (kind 'score', data: the
// finished match) and the draw (kind 'stats', data: the counts).
export async function openShareSheet(kind, data) {
  const card = kind === 'score' ? scoreCard(data, today(), T) : statsCard(data, today(), T);
  let format = 'story', mode = 'image', photo = null, photoUrl = '';
  const seg = (k, options, cur) => `<div class="seg" role="group">${options.map(([id, label]) =>
    `<button type="button" data-${k}="${id}" aria-pressed="${cur === id}">${esc(label)}</button>`).join('')}</div>`;
  const dlg = document.createElement('dialog');
  dlg.className = 'install-sheet share-sheet';
  dlg.innerHTML = `<div class="share-sheet-head"><b>${esc(T.title)}</b><button type="button" class="btn btn-ghost" data-close>${esc(T.close)}</button></div>
    ${kind === 'score' ? seg('mode', [['image', T.tabs.image], ['sticker', T.tabs.sticker]], mode) : ''}
    <div class="share-format">${seg('format', [['story', T.formats.story], ['post', T.formats.post]], format)}</div>
    <div class="share-photo"><label class="btn"><input type="file" accept="image/*" hidden><span data-photo-label>${esc(T.addPhoto)}</span></label><button type="button" class="btn btn-ghost" data-nophoto hidden>${esc(T.removePhoto)}</button></div>
    <canvas class="share-preview" role="img" aria-label="${esc(T.preview)}"></canvas>
    <div class="toolbar share-actions"></div>
    <p class="muted small share-hint"></p>`;
  const canvas = dlg.querySelector('canvas');
  const actions = dlg.querySelector('.share-actions');
  const hint = dlg.querySelector('.share-hint');
  const file = () => `${T.file}-${kind}-${today()}.png`;

  const render = () => {
    const sticker = mode === 'sticker';
    dlg.querySelector('.share-format').hidden = sticker;
    dlg.querySelector('.share-photo').hidden = sticker;
    dlg.querySelector('[data-photo-label]').textContent = photo ? T.changePhoto : T.addPhoto;
    dlg.querySelector('[data-nophoto]').hidden = !photo;
    canvas.classList.toggle('is-sticker', sticker);
    if (sticker) drawSticker(canvas, card); else drawCard(canvas, kind, card, format, photo);
    actions.innerHTML = sticker
      ? `<button type="button" class="btn btn-primary" data-act="copy">${esc(T.copySticker)}</button><button type="button" class="btn" data-act="save">${esc(T.saveSticker)}</button>`
      : `<button type="button" class="btn btn-primary" data-act="share">${esc(T.share)}</button><button type="button" class="btn" data-act="save">${esc(T.save)}</button>`;
    hint.textContent = sticker ? T.stickerHint : T.hint;
  };

  const close = () => { dlg.close(); dlg.remove(); if (photoUrl) URL.revokeObjectURL(photoUrl); };
  dlg.addEventListener('click', async e => {
    const t = e.target.closest('button');
    if (e.target === dlg || t?.dataset.close !== undefined) { close(); return; }
    if (!t) return;
    if (t.dataset.mode) { mode = t.dataset.mode; for (const b of dlg.querySelectorAll('[data-mode]')) b.setAttribute('aria-pressed', String(b === t)); render(); }
    if (t.dataset.format) { format = t.dataset.format; for (const b of dlg.querySelectorAll('[data-format]')) b.setAttribute('aria-pressed', String(b === t)); render(); }
    if (t.dataset.nophoto !== undefined) { photo = null; render(); }
    const act = t.dataset.act;
    if (act === 'share') {
      const blob = await toBlob(canvas);
      const f = new File([blob], file(), { type: 'image/png' });
      if (navigator.canShare?.({ files: [f] })) {
        try { await navigator.share({ files: [f] }); } catch (err) { if (err.name !== 'AbortError') download(blob, file()); }
      } else download(blob, file());
    }
    if (act === 'save') download(await toBlob(canvas), file());
    if (act === 'copy') {
      // Safari wants the ClipboardItem made inside the tap, with a promise of the image.
      try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': toBlob(canvas) })]); toast(esc(T.copied)); } catch { toast(esc(T.copyFailed)); }
    }
  });
  dlg.querySelector('input[type=file]').addEventListener('change', async e => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const url = URL.createObjectURL(f);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      photo = img; photoUrl = url;
      render();
    } catch { URL.revokeObjectURL(url); toast(esc(T.photoFailed)); }
  });
  dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
  document.body.append(dlg);
  dlg.showModal();
  // Draw once now, again when the web fonts are in (offline: system fonts).
  render();
  try { await document.fonts?.ready; } catch { /* no font loading API */ }
  if (dlg.open) render();
}
