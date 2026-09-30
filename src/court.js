// Single source of court geometry. Rules scenes and the scoreboard both
// describe positions with the vocabulary exported here; nothing else draws a
// court.
//
// Coordinate system: viewBox units are feet × 10, with a 4 ft margin on every
// side. Court is 20 ft × 44 ft, net across the middle, non-volley zone (NVZ)
// 7 ft each side of the net. "near" is the bottom half (player faces up),
// "far" is the top half (player faces down). A player's "right" is their own
// right when facing the net, so the far team's right court is on the viewer's
// left. Region ids: nvz, nvz:near, nvz:far, serviceBox:<side>:<pos>,
// baseline:<side>, court, net.

const M = 40;                 // margin
const W = 200;                // court width
const L = 440;                // court length
const NVZ = 70;               // kitchen depth
export const VIEW = { w: W + 2 * M, h: L + 2 * M };
const X0 = M, X1 = M + W, XC = M + W / 2;
const Y0 = M, Y1 = M + L, YN = M + L / 2;
const YK_FAR = YN - NVZ, YK_NEAR = YN + NVZ;

function xOf(side, pos) {
  const viewerRight = side === 'near' ? pos === 'right' : pos === 'left';
  return viewerRight ? XC + W / 4 : XC - W / 4;
}

// Named spots for ball paths and player placement.
export const SPOTS = {};
for (const side of ['near', 'far']) {
  for (const pos of ['right', 'left']) {
    const x = xOf(side, pos);
    const near = side === 'near';
    SPOTS[`${side}:${pos}:behind`] = [x, near ? Y1 + 18 : Y0 - 18];
    SPOTS[`${side}:${pos}:baseline`] = [x, near ? Y1 - 22 : Y0 + 22];
    SPOTS[`${side}:${pos}:mid`] = [x, near ? YK_NEAR + 55 : YK_FAR - 55];
    SPOTS[`${side}:${pos}:kitchenLine`] = [x, near ? YK_NEAR + 14 : YK_FAR - 14];
    SPOTS[`${side}:${pos}:kitchen`] = [x, near ? YK_NEAR - 30 : YK_FAR + 30];
  }
  SPOTS[`${side}:center:baseline`] = [XC, side === 'near' ? Y1 - 22 : Y0 + 22];
  SPOTS[`${side}:center:mid`] = [XC, side === 'near' ? YK_NEAR + 55 : YK_FAR - 55];
}
SPOTS['net:center'] = [XC, YN];

const REGIONS = {
  court: [X0, Y0, W, L],
  'nvz': [X0, YK_FAR, W, NVZ * 2],
  'nvz:far': [X0, YK_FAR, W, NVZ],
  'nvz:near': [X0, YN, W, NVZ],
  'serviceBox:near:right': [XC, YK_NEAR, W / 2, L / 2 - NVZ],
  'serviceBox:near:left': [X0, YK_NEAR, W / 2, L / 2 - NVZ],
  'serviceBox:far:right': [X0, Y0, W / 2, L / 2 - NVZ],
  'serviceBox:far:left': [XC, Y0, W / 2, L / 2 - NVZ],
  'baseline:near': [X0, Y1 - 3, W, 6],
  'baseline:far': [X0, Y0 - 3, W, 6],
  'kitchenLine:near': [X0, YK_NEAR - 3, W, 6],
  'kitchenLine:far': [X0, YK_FAR - 3, W, 6],
  net: [X0 - 12, YN - 3, W + 24, 6],
};

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function rect([x, y, w, h], cls) {
  return `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
}

function lines() {
  const s = 'class="court-line"';
  return [
    `<rect ${s} x="${X0}" y="${Y0}" width="${W}" height="${L}" fill="none"/>`,
    `<line ${s} x1="${X0}" y1="${YK_FAR}" x2="${X1}" y2="${YK_FAR}"/>`,
    `<line ${s} x1="${X0}" y1="${YK_NEAR}" x2="${X1}" y2="${YK_NEAR}"/>`,
    `<line ${s} x1="${XC}" y1="${Y0}" x2="${XC}" y2="${YK_FAR}"/>`,
    `<line ${s} x1="${XC}" y1="${YK_NEAR}" x2="${XC}" y2="${Y1}"/>`,
    `<line class="court-net" x1="${X0 - 12}" y1="${YN}" x2="${X1 + 12}" y2="${YN}"/>`,
    `<circle class="court-post" cx="${X0 - 12}" cy="${YN}" r="4"/>`,
    `<circle class="court-post" cx="${X1 + 12}" cy="${YN}" r="4"/>`,
  ].join('');
}

function dimensionLabels() {
  const t = 'class="court-dim"';
  return [
    `<text ${t} x="${XC}" y="${Y0 - 14}" text-anchor="middle">6.10 m（20 ft）</text>`,
    `<text ${t} x="${X1 + 30}" y="${YN}" text-anchor="middle" transform="rotate(90 ${X1 + 30} ${YN})">13.41 m（44 ft）</text>`,
    `<text ${t} x="${X0 - 8}" y="${(YK_FAR + YN) / 2 + 4}" text-anchor="end">2.13 m</text>`,
    `<text ${t} x="${X0 - 8}" y="${(YK_NEAR + YN) / 2 + 4}" text-anchor="end">2.13 m</text>`,
    `<text class="court-zone" x="${XC}" y="${(YK_FAR + YN) / 2 + 5}" text-anchor="middle">廚房（非截擊區）</text>`,
    `<text class="court-zone" x="${XC}" y="${(YK_NEAR + YN) / 2 + 5}" text-anchor="middle">廚房（非截擊區）</text>`,
  ].join('');
}

function ballPath(ball) {
  if (!ball || !ball.path || ball.path.length === 0) return '';
  const pts = ball.path.map(p => (typeof p === 'string' ? SPOTS[p] : p));
  if (pts.some(p => !p)) throw new Error('court: unknown spot in ball path');
  const step = Math.min(ball.step ?? pts.length - 1, pts.length - 1);
  const out = [];
  for (let i = 0; i < step; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const cls = i === step - 1 ? 'ball-seg ball-seg-current' : 'ball-seg';
    out.push(`<line class="${cls}" x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/>`);
  }
  for (const i of ball.bounces ?? []) {
    if (i <= step && pts[i]) out.push(`<circle class="ball-bounce" cx="${pts[i][0]}" cy="${pts[i][1]}" r="9"/>`);
  }
  const [cx, cy] = pts[step];
  out.push(`<g class="ball" style="transform:translate(${cx}px,${cy}px)"><circle r="7"/></g>`);
  return out.join('');
}

function players(list) {
  return (list ?? []).map(p => {
    const [x, y] = p.at ? (SPOTS[p.at] ?? p.at) : SPOTS[`${p.side}:${p.pos}:${p.depth ?? 'baseline'}`];
    if (!x && x !== 0) throw new Error(`court: cannot place player ${p.label}`);
    const label = esc(String(p.label ?? '').slice(0, 2));
    const cls = `player team-${p.team ?? 'A'}${p.serving ? ' serving' : ''}${p.dim ? ' dim' : ''}`;
    const serve = p.serving ? `<circle class="serve-mark" cx="19" cy="-15" r="6"/>` : '';
    return `<g class="${cls}" style="transform:translate(${x}px,${y}px)"><circle r="15"/><text y="5" text-anchor="middle">${label}</text>${serve}</g>`;
  }).join('');
}

// Renders the court into `el`. Idempotent: replaces previous content.
export function renderCourt(el, scene = {}) {
  const hl = (scene.highlight ?? []).map(id => {
    const r = REGIONS[id];
    if (!r) throw new Error(`court: unknown region ${id}`);
    return rect(r, `court-hl hl-${id.replace(/:/g, '-')}`);
  }).join('');
  el.innerHTML =
    `<svg class="court" viewBox="0 0 ${VIEW.w} ${VIEW.h}" role="img" aria-label="${esc(scene.alt ?? '匹克球球場示意圖')}">` +
    rect(REGIONS.court, 'court-surface') +
    rect(REGIONS['nvz:far'], 'court-nvz') + rect(REGIONS['nvz:near'], 'court-nvz') +
    hl + lines() + (scene.labels ? dimensionLabels() : '') +
    ballPath(scene.ball) + players(scene.players) +
    `</svg>`;
}
