import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeMeetup, summaryText, icsText, mapUrl, contactLinks } from '../src/meetup.js';
import { MEETUP } from '../src/data/meetup.js';
import { encodeHandoff, decodeHandoff } from '../src/handoff.js';

const L = MEETUP.labels;
const base = { date: '2026-10-10', start: '09:00', end: '11:00', place: ' 大安  球場 ', play: 'doubles', level: 'intermediate', need: '2' };

test('normalize trims, checks and keeps only known fields', () => {
  const m = normalizeMeetup({ ...base, extra: 'x', whatsapp: '0912-345-678', line: ' bruce.lee ' });
  assert.equal(m.place, '大安 球場');
  assert.equal(m.need, 2);
  assert.equal(m.whatsapp, '886912345678');
  assert.equal(normalizeMeetup({ ...base, whatsapp: '9123 4567' }).whatsapp, '6591234567');
  assert.equal(m.line, 'bruce.lee');
  assert.equal('extra' in m, false);
});

test('normalize throws naming the bad field', () => {
  const bad = (patch, field) => assert.throws(() => normalizeMeetup({ ...base, ...patch }), new RegExp(`meetup: ${field}$`));
  bad({ date: '2026-13-40' }, 'date');
  bad({ start: '9' }, 'start');
  bad({ end: '08:00' }, 'end');
  bad({ place: '  ' }, 'place');
  bad({ play: 'mixed' }, 'play');
  bad({ level: 'pro' }, 'level');
  bad({ need: '2.5' }, 'need');
  bad({ need: '21' }, 'need');
  bad({ line: 'a b/c' }, 'line');
  bad({ whatsapp: '123' }, 'whatsapp');
  bad({ note: 'x'.repeat(141) }, 'note');
});

test('summary line reads like the chat line', () => {
  const m = normalizeMeetup(base);
  assert.equal(summaryText(m, L), '週六 10/10 09:00–11:00｜大安 球場｜雙打 中階｜缺 2 人');
  assert.equal(summaryText({ ...m, end: '', level: 'any', need: 0 }, L), '週六 10/10 09:00｜大安 球場｜雙打｜人滿可候補');
});

test('calendar file has local times, escapes text, defaults to two hours', () => {
  const m = normalizeMeetup({ ...base, end: '', start: '23:00', note: '球我帶, 費用平分; 謝謝' });
  const ics = icsText(m, L, new Date(Date.UTC(2026, 9, 1, 8, 30, 0)));
  assert.match(ics, /DTSTART:20261010T230000\r\n/);
  assert.match(ics, /DTEND:20261011T010000\r\n/);
  assert.match(ics, /DTSTAMP:20261001T083000Z/);
  assert.match(ics, /球我帶\\, 費用平分\\; 謝謝/);
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n') && ics.includes('END:VEVENT\r\nEND:VCALENDAR'));
});

test('map and contact links', () => {
  const m = normalizeMeetup({ ...base, address: '台北市大安區', line: '@picobo', whatsapp: '+886 912 345 678' });
  assert.equal(mapUrl(m), 'https://www.google.com/maps/search/?api=1&query=%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%AE%89%E5%8D%80');
  assert.deepEqual(contactLinks(m), { line: 'https://line.me/R/ti/p/%40picobo', whatsapp: 'https://wa.me/886912345678' });
  assert.equal(contactLinks(normalizeMeetup({ ...base, line: 'bruce' })).line, 'https://line.me/ti/p/~bruce');
  assert.deepEqual(contactLinks(normalizeMeetup(base)), {});
});

test('a meetup survives the share link', async () => {
  const m = normalizeMeetup({ ...base, note: '新手歡迎，球我帶。'.repeat(5), host: '小明' });
  const back = await decodeHandoff(await encodeHandoff('meetup', m));
  assert.equal(back.kind, 'meetup');
  assert.deepEqual(back.data, m);
});
