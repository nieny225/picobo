// Paddle drawings for the 裝備 pages: the official size limits with where
// tape may go, and the three common shapes to scale. No DOM; returns SVG
// markup. Units are mm (1 viewBox unit = 1 mm). Words come in as `labels`
// (src/data/rules.js), so nothing here is copy.
//
// Sizes: standard about 16 × 8 in, hybrid about 16.25 × 7.75 in, elongated
// about 16.5 × 7.5 in (Paddletek / Pickleball Effect guides). The handle and
// the sweet spot are drawn to show the idea, not measured: the elongated
// paddle's sweet spot is smaller and further from the hand (PickleballCentral).
const SHAPES = {
  standard: { w: 203, l: 406, spot: [85, 0.52] },
  hybrid: { w: 197, l: 413, spot: [75, 0.47] },
  elongated: { w: 191, l: 419, spot: [62, 0.40] },
};
export const PADDLE_SHAPES = Object.keys(SHAPES);
const HANDLE = 130, GRIP_W = 34;

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Outline of a paddle whose top-left corner of the face is at (x, y).
function outline(x, y, w, l) {
  const head = l - HANDLE, r = Math.min(46, w / 4);
  const hx = x + (w - GRIP_W) / 2;
  return `M${x} ${y + r} Q${x} ${y} ${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + head - 30} Q${x + w} ${y + head} ${x + w - 40} ${y + head} H${hx + GRIP_W} V${y + l} H${hx} V${y + head} H${x + 40} Q${x} ${y + head} ${x} ${y + head - 30} Z`;
}

// 球拍規定: one paddle with its length and width limits, the tape zones in
// yellow (within 1 in above the grip, within ½ in of the edge). Numbered
// markers point at the zones; the page lists what each number means.
export function paddleRulesSvg(t) {
  const { w, l } = SHAPES.standard, x = 90, y = 20, head = l - HANDLE;
  const hx = x + (w - GRIP_W) / 2, d = outline(x, y, w, l);
  const arrow = (x1, y1, x2, y2) => `<line class="pd-dim" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-start="url(#pd-a)" marker-end="url(#pd-a)"/>`;
  const pin = (n, cx, cy) => `<g class="pd-pin"><circle cx="${cx}" cy="${cy}" r="20"/><text x="${cx}" y="${cy + 8}" text-anchor="middle">${n}</text></g>`;
  return `<svg class="paddle-fig" viewBox="0 0 330 540" role="img" aria-label="${esc(t.alt)}">
    <defs><marker id="pd-a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="pd-arrowhead"/></marker>
    <clipPath id="pd-clip"><path d="${d}"/></clipPath></defs>
    <path class="pd-face" d="${d}"/>
    <g clip-path="url(#pd-clip)"><path class="pd-tape" d="${d}" stroke-width="25"/>
    <rect class="pd-tape-fill" x="${x}" y="${y + head - 25}" width="${w}" height="25"/></g>
    <rect class="pd-grip" x="${hx}" y="${y + head}" width="${GRIP_W}" height="${HANDLE}"/>
    <path class="pd-edge" d="${d}"/>
    ${arrow(x - 30, y, x - 30, y + l)}
    <text class="pd-label" transform="translate(${x - 44} ${y + l / 2}) rotate(-90)" text-anchor="middle">${esc(t.length)}</text>
    ${arrow(x, y + l + 24, x + w, y + l + 24)}
    <text class="pd-label" x="${x + w / 2}" y="${y + l + 62}" text-anchor="middle">${esc(t.sum)}</text>
    ${pin(1, x + w - 6, y + 70)}${pin(2, x + w / 2, y + 150)}${pin(3, x + w - 20, y + head - 12)}
  </svg>`;
}

// 怎麼選球拍: the three shapes side by side, to scale, each with its sweet
// spot. Shapes not in `pick` are dimmed when a pick is given.
export function paddleShapesSvg(t, pick = null) {
  const gap = 40, base = 20, top = 20;
  let x = base;
  const parts = PADDLE_SHAPES.map(id => {
    const s = SHAPES[id], y = top + (SHAPES.elongated.l - s.l);
    const [d, at] = s.spot;
    const on = !pick || pick.includes(id);
    const g = `<g class="pd-shape${on ? '' : ' dim'}${pick && on ? ' picked' : ''}">
      <path class="pd-face" d="${outline(x, y, s.w, s.l)}"/>
      <rect class="pd-grip" x="${x + (s.w - GRIP_W) / 2}" y="${y + s.l - HANDLE}" width="${GRIP_W}" height="${HANDLE}"/>
      <ellipse class="pd-spot" cx="${x + s.w / 2}" cy="${y + (s.l - HANDLE) * at}" rx="${d * 0.62}" ry="${d * 0.62}"/>
      <path class="pd-edge" d="${outline(x, y, s.w, s.l)}"/>
      <text class="pd-name" x="${x + s.w / 2}" y="${top + SHAPES.elongated.l + 44}" text-anchor="middle">${esc(t.names[id])}</text>
      <text class="pd-label" x="${x + s.w / 2}" y="${top + SHAPES.elongated.l + 78}" text-anchor="middle">${esc(t.sizes[id])}</text>
    </g>`;
    x += s.w + gap;
    return g;
  });
  return `<svg class="paddle-fig" viewBox="0 0 ${x - gap + base} ${top + SHAPES.elongated.l + 96}" role="img" aria-label="${esc(t.alt)}">${parts.join('')}</svg>`;
}
