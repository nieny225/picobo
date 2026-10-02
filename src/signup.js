// 報名訊息: the plain-text sign-up list a host pastes into IG, WhatsApp or
// LINE after booking a court, in the shape groups already use:
//   9/5 (Sat) 5-7pm
//   📍 Pickle & Bones @ TRIFECTA
//   1. Rose & Max
//   2.
// Players copy it, add their name on the next number and paste it back.
// No DOM; the fixed words come in as `labels` from src/data/signup.js.

// A short map link: a Singapore postal code pins the building, so it is
// enough; otherwise the place name.
export function shortMapLink(place, address = '') {
  const postal = address.match(/Singapore\s+(\d{6})/i);
  return `https://maps.google.com/?q=${encodeURIComponent(postal ? `Singapore ${postal[1]}` : place).replace(/%20/g, '+')}`;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

// "17:00" -> { h: '5', m: '', ap: 'pm' }
function clock(t) {
  const [h, m] = t.split(':').map(Number);
  return { h: String(h % 12 || 12), m: m ? `:${String(m).padStart(2, '0')}` : '', ap: h < 12 ? 'am' : 'pm' };
}

// "5-7pm", "11am-1pm", "5:30-7pm", "8pm" (no end).
export function timeText(start, end) {
  if (!TIME.test(start ?? '')) throw new Error('signup: start');
  const a = clock(start);
  if (!end) return `${a.h}${a.m}${a.ap}`;
  if (!TIME.test(end)) throw new Error('signup: end');
  const b = clock(end);
  return a.ap === b.ap ? `${a.h}${a.m}-${b.h}${b.m}${b.ap}` : `${a.h}${a.m}${a.ap}-${b.h}${b.m}${b.ap}`;
}

// "2026-09-05" -> "9/5 (Sat)"
export function dateText(date) {
  if (!DATE.test(date ?? '') || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) throw new Error('signup: date');
  const [, mo, da] = date.split('-').map(Number);
  return `${mo}/${da} (${WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()]})`;
}

// The day after `date`, for the next session a host adds.
export function nextDay(date) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// One message for one or more sessions. Each session: { date, start, end,
// place, link }. names: who is already in (one line each, e.g. "Rose & Max").
// cap: optional player limit; it also sets how many numbers are printed.
// Without a cap, `blanks` empty numbers follow the names.
export function signupText({ sessions, names = [], cap = null, blanks = 3 }, labels) {
  if (!Array.isArray(sessions) || sessions.length === 0) throw new Error('signup: sessions');
  if (cap !== null && (!Number.isInteger(cap) || cap < 1 || cap > 40)) throw new Error('signup: cap');
  const list = names.map(n => n.trim()).filter(Boolean);
  const count = cap ? Math.max(cap, list.length) : list.length + blanks;
  const numbered = Array.from({ length: count }, (_, i) => `${i + 1}. ${list[i] ?? ''}`.trimEnd());
  const blocks = sessions.map((s, i) => {
    const place = String(s.place ?? '').trim();
    if (!place) throw new Error('signup: place');
    // The same court as the session before: its link is already above.
    const repeat = i > 0 && sessions[i - 1].link === s.link;
    return [
      `${dateText(s.date)} ${timeText(s.start, s.end)}`,
      `📍 ${place}`,
      s.link && !repeat ? s.link : null,
      cap ? labels.cap.replace('{n}', cap) : null,
      ...numbered,
    ].filter(line => line !== null).join('\n');
  });
  return [labels.heading, '', blocks.join('\n\n'), '', labels.footer].join('\n');
}
