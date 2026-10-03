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
// baseline:<side>, kitchenLine:<side>, centerline:<side>, court, net.

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
    // Exactly on the kitchen line (a ball touching it); kitchenLine is just behind it, where players stand.
    SPOTS[`${side}:${pos}:onKitchenLine`] = [x, near ? YK_NEAR : YK_FAR];
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
  'centerline:near': [XC - 3, YK_NEAR, 6, L / 2 - NVZ],
  'centerline:far': [XC - 3, Y0, 6, L / 2 - NVZ],
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

// In landscape the whole court is turned a quarter; every text is turned back
// about its own anchor so it still reads upright.
function dimensionLabels(land) {
  const t = 'class="court-dim"';
  const up = (x, y) => (land ? ` transform="rotate(-90 ${x} ${y})"` : '');
  const zone = land ? '廚房' : '廚房（非截擊區）';
  return [
    `<text ${t} x="${XC}" y="${Y0 - 14}" text-anchor="middle">6.10 m（20 ft）</text>`, // lying down this runs along the short edge
    `<text ${t} x="${X1 + 30}" y="${YN}" text-anchor="middle" transform="rotate(${land ? -90 : 90} ${X1 + 30} ${YN})">13.41 m（44 ft）</text>`,
    `<text ${t} x="${X0 - 8}" y="${(YK_FAR + YN) / 2 + 4}" text-anchor="${land ? 'middle' : 'end'}"${up(X0 - 8, (YK_FAR + YN) / 2 + 4)}>2.13 m</text>`,
    `<text ${t} x="${X0 - 8}" y="${(YK_NEAR + YN) / 2 + 4}" text-anchor="${land ? 'middle' : 'end'}"${up(X0 - 8, (YK_NEAR + YN) / 2 + 4)}>2.13 m</text>`,
    `<text class="court-zone" x="${XC}" y="${(YK_FAR + YN) / 2 + 5}" text-anchor="middle"${up(XC, (YK_FAR + YN) / 2 + 5)}>${zone}</text>`,
    `<text class="court-zone" x="${XC}" y="${(YK_NEAR + YN) / 2 + 5}" text-anchor="middle"${up(XC, (YK_NEAR + YN) / 2 + 5)}>${zone}</text>`,
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

// `rotated` says the markup goes inside the landscape quarter-turn group, so
// labels are turned back to stay upright. Players placed off the court by
// coordinates (a queue, people resting) are drawn outside that group when
// lying down: under the court, left to right in queue order.
// A player with `field: true` stands at [x, y] in court coordinates (e.g.
// chasing a ball wide of the sideline) and turns with the court.
const offCourt = p => Array.isArray(p.at) && !p.field;
function players(list, land, rotated) {
  return (list ?? []).map(p => {
    let [x, y] = p.at ? (SPOTS[p.at] ?? p.at) : SPOTS[`${p.side}:${p.pos}:${p.depth ?? 'baseline'}`];
    if (!x && x !== 0) throw new Error(`court: cannot place player ${p.label}`);
    const off = offCourt(p);
    // keepSide: the queue belongs to one end of the court, so it turns with the
    // court (far end on the right). Otherwise one queue runs left to right.
    if (land && off && !rotated) [x, y] = p.keepSide ? [VIEW.h - y, VIEW.w - 10] : [y, VIEW.w - 10];
    const label = esc(String(p.label ?? '').slice(0, 2));
    const cls = `player team-${p.team ?? 'A'}${p.serving ? ' serving' : ''}${p.dim ? ' dim' : ''}${off ? ' off' : ''}`;
    // Lying down the court is drawn smaller, so players and labels grow.
    const [r, ty, mark] = land && !off ? [22, 7, 'cx="27" cy="-20" r="8"'] : land ? [19, 7, 'cx="23" cy="-17" r="7"'] : [15, 5, 'cx="19" cy="-15" r="6"'];
    const serve = p.serving ? `<circle class="serve-mark" ${mark}/>` : '';
    const upright = `<text y="${ty}" text-anchor="middle">${label}</text>${serve}`;
    return `<g class="${cls}" style="transform:translate(${x}px,${y}px)"><circle r="${r}"/>${rotated ? `<g transform="rotate(-90)">${upright}</g>` : upright}</g>`;
  }).join('');
}

// Renders the court into `el`. Idempotent: replaces previous content.
// opts.landscape turns the court a quarter turn for short screens: the near
// side (bottom) goes to the left, the far side to the right, and a player's
// own right is still their right (it ends up at the bottom for the near side).
export function renderCourt(el, scene = {}, opts = {}) {
  const land = !!opts.landscape;
  const hl = (scene.highlight ?? []).map(id => {
    const r = REGIONS[id];
    if (!r) throw new Error(`court: unknown region ${id}`);
    return rect(r, `court-hl hl-${id.replace(/:/g, '-')}`);
  }).join('');
  el.innerHTML =
    `<svg class="court${land ? ' landscape' : ''}" viewBox="${land ? `-16 0 ${VIEW.h + 32} ${VIEW.w + 14}` : `0 0 ${VIEW.w} ${VIEW.h}`}" role="img" aria-label="${esc(scene.alt ?? '匹克球球場示意圖')}">` +
    (land ? `<g transform="translate(${VIEW.h} 0) rotate(90)">` : '') +
    rect(REGIONS.court, 'court-surface') +
    rect(REGIONS['nvz:far'], 'court-nvz') + rect(REGIONS['nvz:near'], 'court-nvz') +
    hl + lines() + (scene.labels ? dimensionLabels(land) : '') +
    ballPath(scene.ball) +
    (land
      ? players(scene.players?.filter(q => !offCourt(q)), true, true) + '</g>' + players(scene.players?.filter(offCourt), true, false)
      : players(scene.players, false, false)) +
    `</svg>`;
}

// 借場地打: a pickleball court laid on a badminton, tennis or volleyball court,
// drawn lying down (length left to right) in the same units. Host sizes in
// feet × 10 from the BWF, ITF and FIVB rules; `reuse` names the pickleball
// lines that sit on a host line (the rest are taped).
const HOSTS = {
  // 13.40 × 6.10 m; short service line 1.98 m from the net, doubles long
  // service line 0.76 m in, singles sidelines 0.46 m in.
  badminton: { l: 440, w: 200, lines: [[155, 0, 155, 200], [285, 0, 285, 200], [25, 0, 25, 200], [415, 0, 415, 200], [0, 15, 440, 15], [0, 185, 440, 185], [0, 100, 155, 100], [285, 100, 440, 100]], reuse: ['baseline', 'side', 'center'] },
  // 23.77 × 10.97 m; singles 8.23 m wide; service line 6.40 m from the net.
  tennis: { l: 780, w: 360, lines: [[0, 45, 780, 45], [0, 315, 780, 315], [180, 45, 180, 315], [600, 45, 600, 315], [180, 180, 600, 180]], reuse: ['center'] },
  // 18 × 9 m; attack lines 3 m from the centre line.
  volleyball: { l: 590, w: 295, lines: [[196.6, 0, 196.6, 295], [393.4, 0, 393.4, 295]], reuse: [] },
};
export const SETUP_HOSTS = Object.keys(HOSTS);

export function setupSvg(host, alt) {
  const h = HOSTS[host];
  if (!h) throw new Error(`court: unknown host court ${host}`);
  const m = 24, ox = m + (h.l - L) / 2, oy = m + (h.w - W) / 2, xn = ox + L / 2;
  const seg = ([x1, y1, x2, y2], cls) => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  // Pickleball lines by kind, lying down: baselines left and right.
  const pb = {
    baseline: [[ox, oy, ox, oy + W], [ox + L, oy, ox + L, oy + W]],
    side: [[ox, oy, ox + L, oy], [ox, oy + W, ox + L, oy + W]],
    kitchen: [[xn - NVZ, oy, xn - NVZ, oy + W], [xn + NVZ, oy, xn + NVZ, oy + W]],
    center: [[ox, oy + W / 2, xn - NVZ, oy + W / 2], [xn + NVZ, oy + W / 2, ox + L, oy + W / 2]],
  };
  const pbLines = Object.entries(pb).flatMap(([kind, list]) => list.map(l => {
    const cls = h.reuse.includes(kind) ? 'setup-reuse' : 'setup-tape';
    return seg(l, `${cls}-edge`) + seg(l, cls);
  }));
  return `<svg class="court setup" viewBox="0 0 ${h.l + 2 * m} ${h.w + 2 * m}" role="img" aria-label="${esc(alt)}">` +
    `<rect class="setup-floor" x="${m}" y="${m}" width="${h.l}" height="${h.w}"/>` +
    `<rect class="court-surface setup-pb" x="${ox}" y="${oy}" width="${L}" height="${W}"/>` +
    `<rect class="court-nvz" x="${xn - NVZ}" y="${oy}" width="${NVZ * 2}" height="${W}"/>` +
    seg([m, m, m + h.l, m], 'setup-host') + seg([m, m + h.w, m + h.l, m + h.w], 'setup-host') +
    seg([m, m, m, m + h.w], 'setup-host') + seg([m + h.l, m, m + h.l, m + h.w], 'setup-host') +
    h.lines.map(([x1, y1, x2, y2]) => seg([m + x1, m + y1, m + x2, m + y2], 'setup-host')).join('') +
    pbLines.join('') +
    seg([xn, m - 12, xn, m + h.w + 12], 'setup-net') +
    `</svg>`;
}
