import { SCORE_SHARE as T, APP_TEXT } from '../data/nav.js';
import { scoreCard, statsCard, reportCard } from '../sharecard.js';
import { esc } from './scenes.js';
import { toast } from './share.js';

// Share a finished game or the 抽籤 戰績 as a picture: drawn here on a
// canvas (optionally over the player's own photo, which never leaves the
// phone), then handed to the system share sheet (Instagram, LINE…) or saved.
// A game can also go out as a transparent sticker to paste into an IG story.
// The cards are always the light brand look, whatever the page theme.
const C = { bg: '#fffbe8', ink: '#111111', mark: '#e4ff3a', muted: '#4d4a3c', line: '#d9d3b8', court: '#2d6cdf', nvz: '#5b93f0', white: '#ffffff' };
// The page's font stacks (they follow the language, styles/main.css).
const cssFont = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
const NUM = cssFont('--font-num', '"Space Grotesk", "Noto Sans TC", "PingFang TC", "Helvetica Neue", Arial, sans-serif');
const CJK = cssFont('--font-body', '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", "Helvetica Neue", Arial, sans-serif');
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
  if (!T.brandZh) return; // English pictures carry the Latin name only.
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
      fitText(ctx, names.join(APP_TEXT.and), nx, y + 330, w / 2 - 72, 56, 900, CJK);
    }
  }
  // Meta line and the small brand block.
  const bw = brandSmall(ctx, x + w - 48, y + bh - 96, 52);
  ctx.textAlign = 'left'; ctx.fillStyle = C.muted;
  fitText(ctx, card.meta, x + 48, y + bh - 96, w - 96 - bw - 30, 44, 700, CJK);
}

// 戰績 rows: rank badge, name, played, won, everything scaled to the row
// height. The first place is highlighted and labels its numbers.
function statsRows(ctx, rows, x, y, w, rowH) {
  ctx.textBaseline = 'middle';
  const f = Math.round(Math.min(54, rowH * 0.42)), r0 = Math.min(36, rowH * 0.3);
  const colWon = x + w - f * 0.45, colPlayed = colWon - f * 2.4;
  rows.forEach((r, i) => {
    const cy = y + i * rowH + rowH / 2;
    if (r.rank === 1) { ctx.fillStyle = C.mark; ctx.fillRect(x, cy - rowH / 2, w, rowH); }
    ctx.strokeStyle = C.line; ctx.lineWidth = Math.max(3, rowH / 20);
    ctx.beginPath(); ctx.moveTo(x, cy + rowH / 2); ctx.lineTo(x + w, cy + rowH / 2); ctx.stroke();
    const bx = x + r0 + 14;
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(bx, cy, r0, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = Math.max(3, r0 / 6); ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.font = `700 ${Math.round(r0)}px ${NUM}`; ctx.fillText(String(r.rank), bx, cy + 2);
    const nx = bx + r0 + 18;
    // Room for the played column (wider on the first row, which says 打).
    ctx.textAlign = 'left'; fitText(ctx, r.name, nx, cy, colPlayed - nx - f * (r.rank === 1 ? 2.6 : 1.4), f, 700, CJK);
    ctx.textAlign = 'right'; ctx.font = `700 ${f}px ${NUM}`;
    ctx.fillText(r.rank === 1 ? `${r.played} ${T.played}` : String(r.played), colPlayed, cy);
    ctx.fillText(r.rank === 1 ? `${r.won} ${T.won}` : String(r.won), colWon, cy);
  });
}

// Everyone on the 戰績, in the space given: rows shrink to fit, and a long
// list splits into two columns.
function gridSize(n, maxH, maxRow) {
  let cols = 1, rowH = Math.min(maxRow, maxH / n);
  if (rowH < 72 && n > 1) { cols = 2; rowH = Math.min(maxRow, maxH / Math.ceil(n / 2)); }
  const per = Math.ceil(n / cols);
  return { cols, rowH, per, height: per * rowH };
}
function statsGrid(ctx, rows, x, y, w, size) {
  const gap = 36, colW = (w - gap * (size.cols - 1)) / size.cols;
  for (let c = 0; c < size.cols; c++) statsRows(ctx, rows.slice(c * size.per, (c + 1) * size.per), x + c * (colW + gap), y, colW, size.rowH);
}

// 戰績 without a photo: the whole card in cream (E). No title: the table
// says what it is.
function statsPlain(ctx, h, card) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, h);
  brandTag(ctx);
  ctx.fillStyle = C.ink; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.font = `900 52px ${CJK}`; ctx.fillText(card.meta, 78, 360);
  statsGrid(ctx, card.rows, 78, 420, W - 156, gridSize(card.rows.length, h - 420 - 220, h > 1500 ? 140 : 104));
  brandSmall(ctx, W - 78, h - 120, 64);
}

// 戰績 over a photo: the ranking on a cream panel, with the date and the
// site address in its top row. A long list grows the panel up to about two
// thirds of the picture (before the 小／中／大 size).
function statsPanel(ctx, card, x, y, w, ph, size) {
  box(ctx, x, y, w, ph, { fill: C.bg });
  const bw = brandSmall(ctx, x + w - 48, y + 78, 44);
  ctx.fillStyle = C.ink; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  fitText(ctx, card.meta, x + 48, y + 80, w - 96 - bw - 30, 48, 900, CJK);
  statsGrid(ctx, card.rows, x + 30, y + 140, w - 60, size);
}

// 戰報 panel: name and dates with the site address, the big headline with
// the count on yellow, then four tiles in two rows (and 最難纏的對手 across
// a third row when there is one).
const TILE_H = 150, TILE_GAP = 24;
const reportHeight = card => 640 + (card.tiles.some(t => t.wide) ? TILE_H + TILE_GAP : 0);
function reportPanel(ctx, card, x, y, w) {
  box(ctx, x, y, w, reportHeight(card), { fill: C.bg });
  const bw = brandSmall(ctx, x + w - 48, y + 78, 44);
  ctx.fillStyle = C.ink; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  fitText(ctx, card.meta, x + 48, y + 80, w - 96 - bw - 30, 46, 900, CJK);
  // Headline: words, the number on yellow, words.
  const { before, n, after } = card.headline;
  const hy = y + 200;
  ctx.font = `900 84px ${CJK}`; const wb = ctx.measureText(before).width;
  ctx.font = `700 96px ${NUM}`; const wn = ctx.measureText(n).width;
  let hx = x + 48;
  ctx.font = `900 84px ${CJK}`; ctx.fillText(before, hx, hy); hx += wb + 12;
  ctx.fillStyle = C.mark; ctx.fillRect(hx - 12, hy - 62, wn + 24, 124);
  ctx.fillStyle = C.ink; ctx.font = `700 96px ${NUM}`; ctx.fillText(n, hx, hy + 4); hx += wn + 12;
  ctx.font = `900 84px ${CJK}`; ctx.fillText(after, hx, hy);
  // Tiles.
  const gap = TILE_GAP, half = (w - 96 - gap) / 2, th = TILE_H, ty = y + 300;
  card.tiles.forEach((t, i) => {
    const tw = t.wide ? w - 96 : half;
    const tx = x + 48 + (t.wide ? 0 : (i % 2) * (half + gap)), yy = ty + Math.floor(i / 2) * (th + gap);
    box(ctx, tx, yy, tw, th, { fill: C.white, r: 18, border: 6, shadow: 0 });
    ctx.fillStyle = C.muted; ctx.textAlign = 'left'; ctx.font = `700 34px ${CJK}`; ctx.fillText(t.label, tx + 24, yy + 40);
    ctx.fillStyle = C.ink;
    const numeric = /^[\d%–-]+$/.test(t.value);
    fitText(ctx, t.value, tx + 24, yy + 102, tw - 48, numeric ? 64 : 56, numeric ? 700 : 900, numeric ? NUM : CJK);
  });
}

// The part laid over the photo (the score band, or the 戰績 panel): its box
// at full size, shadow included, and how to draw it there.
function overlayOf(kind, h, card) {
  const x = 42, w = W - 84;
  if (kind === 'score') {
    const bh = 552, y = h - bh - 54;
    return { x, y, w: w + 18, h: bh + 18, draw: ctx => scoreBand(ctx, h, card) };
  }
  if (kind === 'report') {
    const ph = reportHeight(card), y = h - ph - 54;
    return { x, y, w: w + 18, h: ph + 18, draw: ctx => reportPanel(ctx, card, x, y, w) };
  }
  const size = gridSize(card.rows.length, h * 0.66 - 180, h > 1500 ? 102 : 78);
  const ph = 140 + size.height + 36, y = h - ph - 54;
  return { x, y, w: w + 18, h: ph + 18, draw: ctx => statsPanel(ctx, card, x, y, w, ph, size) };
}

// 小／中／大, and where the player dragged it (centre as a fraction of the
// picture; none yet = along the bottom). Kept inside the picture.
const SCALES = { s: 0.55, m: 0.75, l: 1 };
const BRAND_BOTTOM = 300; // the brand tag ends here (with its shadow)
function placeOverlay(ctx, h, o, layout) {
  const k = SCALES[layout.size];
  const ow = o.w * k, oh = o.h * k;
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const cx = clamp(layout.fx == null ? W / 2 : layout.fx * W, ow / 2, W - ow / 2);
  // Below the brand tag when it fits there, so the logo always shows.
  const top = oh <= h - BRAND_BOTTOM ? BRAND_BOTTOM : 0;
  const cy = clamp(layout.fy == null ? h - 36 - oh / 2 : layout.fy * h, top + oh / 2, h - oh / 2);
  ctx.save();
  ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-(o.x + o.w / 2), -(o.y + o.h / 2));
  o.draw(ctx);
  ctx.restore();
  return { cx, cy };
}

// The whole picture for `kind` at `format`, onto `canvas`. Returns where the
// movable part sits (null when there is none: 戰績 without a photo).
function drawCard(canvas, kind, card, format, photo, layout) {
  const h = SIZES[format];
  canvas.width = W; canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (kind === 'stats' && !photo) { statsPlain(ctx, h, card); return null; }
  background(ctx, h, photo);
  brandTag(ctx);
  return placeOverlay(ctx, h, overlayOf(kind, h, card), layout);
}

// The score as a sticker on a transparent background (C): each team's
// names over its own score, left and right, so it is clear whose is whose.
function drawSticker(canvas, card) {
  const w = 900, h = 580, pad = 12;
  canvas.width = w + pad * 2; canvas.height = h + pad * 2;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = C.ink; rect(ctx, pad, pad, w, h, 72); ctx.fill();
  ctx.lineWidth = 14; ctx.strokeStyle = C.mark; rect(ctx, pad, pad, w, h, 72); ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const cols = [pad + w * 0.27, pad + w * 0.73];
  card.teams.forEach((names, t) => {
    ctx.fillStyle = C.white;
    names.forEach((n, j) => fitText(ctx, n, cols[t], 92 + j * 62, w * 0.42, 52, 700, CJK));
    ctx.font = `700 190px ${NUM}`;
    ctx.fillStyle = card.winner === t ? C.mark : C.white;
    ctx.fillText(String(card.scores[t]), cols[t], 330);
  });
  ctx.fillStyle = C.white; ctx.font = `700 120px ${NUM}`; ctx.fillText('–', pad + w / 2, 325);
  ctx.font = `700 44px ${NUM}`;
  const bw = ctx.measureText(T.url).width + 40;
  ctx.fillStyle = C.mark; rect(ctx, pad + w / 2 - bw / 2, 482, bw, 64, 12); ctx.fill();
  ctx.fillStyle = C.ink; ctx.fillText(T.url, pad + w / 2, 516);
}

// A photo for the album button.
const ALBUM_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';

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
  // data: the finished match (score), the 抽籤 counts (stats), or
  // { summary, name, range } from 我的戰績 (report).
  const card = kind === 'score' ? scoreCard(data, today(), T)
    : kind === 'report' ? reportCard(data.summary, data.name, data.range, new Date(), T)
      : statsCard(data, today(), T);
  let format = 'story', mode = 'image', photo = null, photoUrl = '';
  // Size and position of the score band / 戰績 panel. Until the player picks
  // a size, a photo makes it 小 so the photo shows.
  const layout = { size: 'l', fx: null, fy: null };
  let sizeChosen = false, placed = null;
  const seg = (k, options, cur) => `<div class="seg" role="group">${options.map(([id, label]) =>
    `<button type="button" data-${k}="${id}" aria-pressed="${cur === id}">${esc(label)}</button>`).join('')}</div>`;
  const dlg = document.createElement('dialog');
  dlg.className = 'install-sheet share-sheet';
  dlg.innerHTML = `<div class="share-sheet-head"><b>${esc(T.title)}</b><button type="button" class="btn btn-ghost" data-close>${esc(T.close)}</button></div>
    ${kind === 'score' ? seg('mode', [['image', T.tabs.image], ['sticker', T.tabs.sticker]], mode) : ''}
    <div class="share-format">${seg('format', [['story', T.formats.story], ['post', T.formats.post]], format)}</div>
    <div class="share-photo"><label class="btn icon-btn">${CAMERA_ICON}<input type="file" accept="image/*" capture="environment" hidden><span>${esc(T.takePhoto)}</span></label><label class="btn icon-btn">${ALBUM_ICON}<input type="file" accept="image/*" hidden><span>${esc(T.pickPhoto)}</span></label><button type="button" class="btn btn-ghost share-nophoto" data-nophoto aria-label="${esc(T.removePhoto)}" title="${esc(T.removePhoto)}" hidden>×</button></div>
    <div class="share-size">${seg('size', [['s', T.sizes.s], ['m', T.sizes.m], ['l', T.sizes.l]], layout.size)}<span class="muted small">${esc(T.dragHint)}</span></div>
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
    dlg.querySelector('[data-nophoto]').hidden = !photo;
    canvas.classList.toggle('is-sticker', sticker);
    const movable = !sticker && !(kind === 'stats' && !photo);
    dlg.querySelector('.share-size').hidden = !movable;
    canvas.classList.toggle('is-movable', movable);
    for (const b of dlg.querySelectorAll('[data-size]')) b.setAttribute('aria-pressed', String(b.dataset.size === layout.size));
    if (sticker) { drawSticker(canvas, card); placed = null; } else placed = drawCard(canvas, kind, card, format, photo, layout);
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
    if (t.dataset.size) { layout.size = t.dataset.size; sizeChosen = true; render(); }
    if (t.dataset.nophoto !== undefined) { photo = null; if (!sizeChosen) layout.size = 'l'; render(); }
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
  // Take a photo now (the camera opens) or pick one from the album.
  for (const input of dlg.querySelectorAll('input[type=file]')) input.addEventListener('change', async e => {
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
      if (!sizeChosen) layout.size = 's';
      render();
    } catch { URL.revokeObjectURL(url); toast(esc(T.photoFailed)); }
  });
  // Drag on the preview to move the score band / 戰績 panel.
  let drag = null, frame = 0;
  const point = e => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * canvas.width / r.width, y: (e.clientY - r.top) * canvas.height / r.height }; };
  canvas.addEventListener('pointerdown', e => {
    if (!placed || !canvas.classList.contains('is-movable')) return;
    drag = { start: point(e), cx: placed.cx, cy: placed.cy };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!drag) return;
    const p = point(e);
    layout.fx = (drag.cx + p.x - drag.start.x) / canvas.width;
    layout.fy = (drag.cy + p.y - drag.start.y) / canvas.height;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(render);
  });
  const endDrag = () => { drag = null; };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
  document.body.append(dlg);
  dlg.showModal();
  // Draw once now, again when the web fonts are in (offline: system fonts).
  render();
  try { await document.fonts?.ready; } catch { /* no font loading API */ }
  if (dlg.open) render();
}
