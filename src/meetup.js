// 揪團卡: the data a host fills in, checked and normalized, plus the text and
// links built from it (share line, calendar file, map, contact). No DOM; the
// zh-TW words come in as `labels` from src/data/meetup.js.

export const PLAYS = ['doubles', 'singles', 'open'];
export const LEVELS = ['any', 'beginner', 'intermediate', 'advanced'];

const LIMITS = { place: 40, address: 80, host: 12, line: 30, note: 140 };
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

// Every field checked; throws Error('meetup: <field>') on the first bad one so
// the form can point at it. Returns a clean copy with only known fields.
export function normalizeMeetup(d) {
  const fail = field => { throw new Error(`meetup: ${field}`); };
  const text = (v, field, required) => {
    const s = String(v ?? '').trim().replace(/\s+/g, ' ');
    if (required && !s) fail(field);
    if (s.length > LIMITS[field]) fail(field);
    return s;
  };
  if (!DATE.test(d?.date ?? '') || Number.isNaN(Date.parse(`${d.date}T00:00:00Z`))) fail('date');
  if (!TIME.test(d.start ?? '')) fail('start');
  const end = d.end ? String(d.end) : '';
  if (end && (!TIME.test(end) || end <= d.start)) fail('end');
  if (!PLAYS.includes(d.play)) fail('play');
  if (!LEVELS.includes(d.level)) fail('level');
  const need = Number(d.need);
  if (!Number.isInteger(need) || need < 0 || need > 20) fail('need');
  const line = text(d.line, 'line').replace(/\s/g, '');
  if (line && !/^@?[A-Za-z0-9._-]{2,29}$/.test(line)) fail('line');
  let whatsapp = String(d.whatsapp ?? '').replace(/[\s()+-]/g, '');
  if (whatsapp) {
    if (!/^\d+$/.test(whatsapp)) fail('whatsapp');
    // A Taiwan mobile written locally (09xx-xxx-xxx) becomes +886 9xx…
    if (/^09\d{8}$/.test(whatsapp)) whatsapp = `886${whatsapp.slice(1)}`;
    // A Singapore number written locally (8 digits starting 8 or 9) becomes +65.
    if (/^[89]\d{7}$/.test(whatsapp)) whatsapp = `65${whatsapp}`;
    if (whatsapp.length < 8 || whatsapp.length > 15) fail('whatsapp');
  }
  return {
    date: d.date, start: d.start, end,
    place: text(d.place, 'place', true), address: text(d.address, 'address'),
    play: d.play, level: d.level, need,
    host: text(d.host, 'host'), line, whatsapp, note: text(d.note, 'note'),
  };
}

const pad = n => String(n).padStart(2, '0');
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);
export const needText = (n, labels) => (n === 0 ? labels.needNone : fill(labels.need, { n }));
const weekdayOf = date => new Date(`${date}T00:00:00Z`).getUTCDay();

// "週六 10/12 09:00–11:00"
export function whenText(m, labels) {
  const [, mo, da] = m.date.split('-').map(Number);
  return `${labels.weekdays[weekdayOf(m.date)]} ${mo}/${da} ${m.start}${m.end ? `–${m.end}` : ''}`;
}

// One line for the chat: "週六 10/12 09:00–11:00｜○○球場｜雙打 中階｜缺 2 人"
export function summaryText(m, labels) {
  const who = `${labels.plays[m.play]}${m.level === 'any' ? '' : ` ${labels.levels[m.level]}`}`;
  return [whenText(m, labels), m.place, who, needText(m.need, labels)].join('｜');
}

// Calendar file. Floating local times (no zone): the event is at the court's
// clock time wherever the phone is. Without an end time it lasts two hours.
export function icsText(m, labels, now = new Date()) {
  const esc = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const stamp = d => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  const local = (date, time) => `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
  let endDate = m.date, endTime = m.end;
  if (!endTime) {
    const [h, mi] = m.start.split(':').map(Number);
    const t = new Date(Date.UTC(...m.date.split('-').map((v, i) => (i === 1 ? Number(v) - 1 : Number(v))), h + 2, mi));
    endDate = `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
    endTime = `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}`;
  }
  const desc = [summaryText(m, labels), m.host && fill(labels.hostLine, { name: m.host }), m.note].filter(Boolean).join('\n');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Picobo//Meetup//ZH-TW', 'BEGIN:VEVENT',
    `UID:${local(m.date, m.start)}-${encodeURIComponent(m.place).slice(0, 40)}@picobo.net`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${local(m.date, m.start)}`, `DTEND:${local(endDate, endTime)}`,
    `SUMMARY:${esc(fill(labels.calendarTitle, { place: m.place }))}`,
    `LOCATION:${esc(m.address || m.place)}`,
    `DESCRIPTION:${esc(desc)}`,
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n');
}

export const mapUrl = m => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.address || m.place)}`;

// LINE: a personal ID opens the add-friend page; an official account starts with @.
export function contactLinks(m) {
  const links = {};
  if (m.line) links.line = m.line.startsWith('@') ? `https://line.me/R/ti/p/${encodeURIComponent(m.line)}` : `https://line.me/ti/p/~${encodeURIComponent(m.line)}`;
  if (m.whatsapp) links.whatsapp = `https://wa.me/${m.whatsapp}`;
  return links;
}
