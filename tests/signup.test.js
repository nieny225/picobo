import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timeText, dateText, nextDay, signupText, shortMapLink, parseSignup } from '../src/signup.js';
import { SIGNUP } from '../src/data/signup.js';

test('times read the way people write them', () => {
  assert.equal(timeText('17:00', '19:00'), '5-7pm');
  assert.equal(timeText('09:00', '11:00'), '9-11am');
  assert.equal(timeText('11:00', '13:00'), '11am-1pm');
  assert.equal(timeText('17:30', '19:00'), '5:30-7pm');
  assert.equal(timeText('20:00', ''), '8pm');
  assert.equal(timeText('00:00', '01:30'), '12-1:30am');
  assert.equal(timeText('12:00', '14:00'), '12-2pm');
  assert.throws(() => timeText('25:00', ''), /signup: start/);
  assert.throws(() => timeText('17:00', '7pm'), /signup: end/);
});

test('dates carry the weekday', () => {
  assert.equal(dateText('2026-09-05'), '9/5 (Sat)');
  assert.equal(dateText('2026-09-06'), '9/6 (Sun)');
  assert.throws(() => dateText('2026-02-30x'), /signup: date/);
  assert.equal(nextDay('2026-09-30'), '2026-10-01');
});

test('one session with names and blank numbers', () => {
  const text = signupText({
    sessions: [{ date: '2026-09-05', start: '17:00', end: '19:00', place: 'Pickle & Bones @ TRIFECTA', link: 'https://maps.example/pb' }],
    names: ['Rose & Max', ' ', 'Henry'],
    blanks: 2,
  }, SIGNUP.labels);
  assert.equal(text, [
    '🏓 Pickleball', '',
    '9/5 (Sat) 5-7pm', '📍 Pickle & Bones @ TRIFECTA', 'https://maps.example/pb',
    '1. Rose & Max', '2. Henry', '3.', '4.', '',
    'via picobo.net',
  ].join('\n'));
});

test('short map links and no repeated link for the same court', () => {
  assert.equal(shortMapLink('Pickle & Bones', 'Upper Deck, TRIFECTA, 10A Exeter Rd, Singapore 239958'), 'https://maps.google.com/?q=Singapore+239958');
  assert.equal(shortMapLink('Delta Outdoor Courts'), 'https://maps.google.com/?q=Delta+Outdoor+Courts');
  const text = signupText({ sessions: [
    { date: '2026-09-05', start: '17:00', end: '19:00', place: 'A', link: 'L1' },
    { date: '2026-09-06', start: '17:00', end: '19:00', place: 'A', link: 'L1' },
    { date: '2026-09-07', start: '17:00', end: '19:00', place: 'B', link: 'L2' },
  ] }, SIGNUP.labels);
  assert.equal(text.match(/L1/g).length, 1);
  assert.equal(text.match(/L2/g).length, 1);
});

test('a cap prints that many numbers on every session', () => {
  const text = signupText({
    sessions: [
      { date: '2026-09-05', start: '17:00', end: '19:00', place: 'Kallang' },
      { date: '2026-09-06', start: '20:00', end: '22:00', place: 'Kallang' },
    ],
    names: ['Steven'],
    cap: 3,
  }, SIGNUP.labels);
  assert.match(text, /9\/5 \(Sat\) 5-7pm\n📍 Kallang\nMax 3 players\n1\. Steven\n2\.\n3\.\n\n9\/6 \(Sun\) 8-10pm/);
  assert.throws(() => signupText({ sessions: [{ date: '2026-09-05', start: '17:00', place: 'x' }], cap: 0 }, SIGNUP.labels), /signup: cap/);
  assert.throws(() => signupText({ sessions: [{ date: '2026-09-05', start: '17:00', place: ' ' }] }, SIGNUP.labels), /signup: place/);
  assert.throws(() => signupText({ sessions: [] }, SIGNUP.labels), /signup: sessions/);
});

test('a pasted sign-up list reads back into sessions of names', () => {
  const pasted = [
    '下一場',
    '9/5 (Sat) 5-7pm',
    '1.  VVN & Nick w/ 2 kids',
    '2.  Roger & Amy',
    '3.  Annie & Bruce',
    '4.  Henry',
    '',
    '9/6 (Sun) 8-10pm',
    '📍 Pickle & Bones @ TRIFECTA',
    'https://maps.google.com/?q=Singapore+239958',
    '1. Steven',
    '2. Roger & Amy',
    '3. Racheal & Sean',
    '4.',
    '8. Rose &Max',
    'via picobo.net',
  ].join('\n');
  const s = parseSignup(pasted);
  assert.equal(s.length, 2);
  assert.equal(s[0].title, '9/5 (Sat) 5-7pm');
  assert.deepEqual(s[0].names, ['VVN', 'Nick', 'Roger', 'Amy', 'Annie', 'Bruce', 'Henry']);
  assert.deepEqual(s[1].names, ['Steven', 'Roger', 'Amy', 'Racheal', 'Sean', 'Rose', 'Max']);
});

test('lists without a date, other separators and our own message round-trip', () => {
  assert.deepEqual(parseSignup('1、小明、小華\n2) Tom / Jerry\n3. Ann (late)\n4: 阿德和阿美'), [{ title: '', names: ['小明', '小華', 'Tom', 'Jerry', 'Ann', '阿德', '阿美'] }]);
  const text = signupText({ sessions: [{ date: '2026-09-05', start: '17:00', end: '19:00', place: 'Kallang' }], names: ['Rose & Max', 'Henry'] }, SIGNUP.labels);
  assert.deepEqual(parseSignup(text), [{ title: '9/5 (Sat) 5-7pm', names: ['Rose', 'Max', 'Henry'] }]);
  assert.deepEqual(parseSignup('nothing here'), []);
});

test('IG mentions and spaces: one player each, without the @', () => {
  const s = parseSignup('10/4 (Sat) 5-7pm\n1. @drsteven1988\n2. @c.y_o @amyling_08\n3. Annie & Bruce\n4. @max3066 @chienying_________\n5. Simone kahyee\n6. @frankchang0522 @caseyhua & @apgoh');
  assert.deepEqual(s[0].names, ['drsteven1988', 'c.y_o', 'amyling_08', 'Annie', 'Bruce', 'max3066', 'chienying_________', 'Simone', 'kahyee', 'frankchang0522', 'caseyhua', 'apgoh']);
});
