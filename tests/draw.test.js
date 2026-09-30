import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffle, makeTeams, assignCourts, roundRobin, createKingOfCourt, advanceKingOfCourt } from '../src/draw.js';

function seeded(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
}
const names = n => Array.from({ length: n }, (_, i) => `P${i + 1}`);

test('shuffle keeps every item and does not mutate', () => {
  const src = names(8);
  const out = shuffle(src, seeded(1));
  assert.deepEqual([...out].sort(), [...src].sort());
  assert.deepEqual(src, names(8));
});

test('makeTeams pairs everyone and reports the odd one out', () => {
  const { teams, leftover } = makeTeams(names(7), seeded(2));
  assert.equal(teams.length, 3);
  assert.equal(leftover.length, 1);
  assert.throws(() => makeTeams(['a', 'a']), /duplicate/);
});

test('assignCourts fills courts in order and parks the rest', () => {
  const teams = [['a', 'b'], ['c', 'd'], ['e', 'f'], ['g', 'h'], ['i', 'j']];
  const { matches, waiting } = assignCourts(teams, 2);
  assert.equal(matches.length, 2);
  assert.deepEqual(matches[1].teams, [['e', 'f'], ['g', 'h']]);
  assert.deepEqual(waiting, [['i', 'j']]);
});

test('roundRobin: 8 players, 2 courts, 5 rounds never repeats a partner', () => {
  const rounds = roundRobin(names(8), 2, 5, seeded(3));
  const seen = new Set();
  for (const r of rounds) {
    assert.equal(r.resting.length, 0);
    for (const m of r.matches) for (const t of m.teams) {
      const key = [...t].sort().join('+');
      assert.ok(!seen.has(key), `partner repeat ${key}`);
      seen.add(key);
    }
  }
});

test('roundRobin: rest duty rotates and everyone plays', () => {
  const rounds = roundRobin(names(10), 2, 5, seeded(4));
  const rest = {};
  for (const r of rounds) {
    assert.equal(r.resting.length, 2);
    for (const n of r.resting) rest[n] = (rest[n] ?? 0) + 1;
  }
  assert.equal(Object.keys(rest).length, 10);
  assert.ok(Object.values(rest).every(v => v === 1));
});

test('king of the court: winners stay, losers queue, streak cap rotates winners out', () => {
  let s = createKingOfCourt(names(6), 1, seeded(5));
  assert.equal(s.queue.length, 2);
  const w = s.courts[0].teams[0];
  s = advanceKingOfCourt(s, 0, 0, 3);
  assert.deepEqual(s.courts[0].teams[0], w);
  assert.equal(s.courts[0].streak, 1);
  assert.equal(s.queue.length, 2);
  s = advanceKingOfCourt(s, 0, 0, 3);
  s = advanceKingOfCourt(s, 0, 0, 3);
  assert.equal(s.courts[0].streak, 0);
  assert.notDeepEqual(s.courts[0].teams[0], w);
  assert.ok(s.queue.includes(w[0]) && s.queue.includes(w[1]));
});
