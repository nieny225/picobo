// Hand-over links: the whole state of a tool, packed into the URL hash so the
// next scorekeeper or organizer can open it on their own phone. No DOM; works
// in browsers and in node (for tests). Format: one letter, then base64url.
//   z  deflate-raw compressed JSON (CompressionStream, where available)
//   j  plain JSON
const KINDS = ['score', 'draw', 'tourney', 'meetup'];

function toBase64Url(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromBase64Url(text) {
  const bin = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}
async function pipe(bytes, stream) {
  const out = new Response(new Blob([bytes]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

export async function encodeHandoff(kind, data) {
  if (!KINDS.includes(kind)) throw new Error(`handoff: unknown kind ${kind}`);
  const json = new TextEncoder().encode(JSON.stringify({ v: 1, kind, data }));
  if (typeof CompressionStream === 'function') return `z${toBase64Url(await pipe(json, new CompressionStream('deflate-raw')))}`;
  return `j${toBase64Url(json)}`;
}

// Throws on anything that is not a hand-over link this app wrote.
export async function decodeHandoff(text) {
  const tag = text[0], body = text.slice(1);
  let bytes;
  if (tag === 'z') {
    if (typeof DecompressionStream !== 'function') throw new Error('handoff: this browser cannot read compressed links');
    bytes = await pipe(fromBase64Url(body), new DecompressionStream('deflate-raw'));
  } else if (tag === 'j') bytes = fromBase64Url(body);
  else throw new Error('handoff: not a hand-over link');
  const payload = JSON.parse(new TextDecoder().decode(bytes));
  if (payload?.v !== 1 || !KINDS.includes(payload.kind) || payload.data == null) throw new Error('handoff: bad payload');
  return payload;
}
