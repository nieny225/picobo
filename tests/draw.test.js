import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffle, makeTeams, assignCourts, roundRobin, createKingOfCourt, advanceKingOfCourt, createOpenPlay, finishOpenPlayGame, joinOpenPlay, leaveOpenPlay, swapPlayers, renamePlayer, mixTeams, courtOfGame } from '../src/draw.js';

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

const everyone = s => [...s.courts.flatMap(c => c.teams.flat()), ...s.queue].sort();

test('open play: first four take the court, finished four go to the back, partners split', () => {
  let s = createOpenPlay(names(10), 2, seeded(3));
  assert.equal(s.courts.every(c => c.teams.length === 2), true);
  assert.equal(s.queue.length, 2);
  const [[a, b], [c, d]] = s.courts[0].teams;
  const nextUp = s.queue.slice(0, 2);
  s = finishOpenPlayGame(s, 0, 1, seeded(4));
  // Re-queued as winner, loser, winner, loser; the court refills from the
  // front, so the two waiting players come on with the first two finishers.
  assert.deepEqual(s.courts[0].teams, [nextUp, [c, a]]);
  assert.deepEqual(s.queue, [d, b]);
  assert.deepEqual(s.stats[c], { played: 1, won: 1 });
  assert.deepEqual(s.stats[a], { played: 1, won: 0 });
  assert.deepEqual(everyone(s), names(10).sort(), 'nobody lost or duplicated');
});

test('open play: an odd player out still gets on court', () => {
  let s = createOpenPlay(names(5), 1, seeded(9));
  const waiting = s.queue[0];
  s = finishOpenPlayGame(s, 0, 0, seeded(1));
  assert.ok(s.courts[0].teams.flat().includes(waiting));
});

test('open play: join fills an idle court; leave takes effect after the game', () => {
  let s = createOpenPlay(names(5), 2, seeded(2));
  assert.equal(s.courts[1].teams.length, 0, 'second court idle with 5 players');
  for (const n of ['Q1', 'Q2', 'Q3']) s = joinOpenPlay(s, n, seeded(7));
  assert.equal(s.courts[1].teams.length, 2, 'eight players fill both courts');
  assert.throws(() => joinOpenPlay(s, 'Q1'), /duplicate/);
  const gone = s.courts[0].teams[0][0];
  s = leaveOpenPlay(s, gone);
  assert.ok(s.courts[0].teams.flat().includes(gone), 'finishes the game first');
  s = finishOpenPlayGame(s, 0, 0, seeded(8));
  assert.ok(!everyone(s).includes(gone));
  assert.deepEqual(s.stats[gone], { played: 1, won: 1 }, 'counts stay');
  const q = s.queue[s.queue.length - 1];
  s = leaveOpenPlay(s, q);
  assert.ok(!s.queue.includes(q));
  s = joinOpenPlay(s, gone, seeded(5));
  assert.equal(s.queue[s.queue.length - 1], gone, 'can come back, counts kept');
  assert.deepEqual(s.stats[gone], { played: 1, won: 1 });
});

test('swapping players by hand: court and queue, any direction', () => {
  const base = { courts: [{ court: 1, teams: [['A', 'B'], ['C', 'D']], first: 0 }, { court: 2, teams: [['E', 'F'], ['G', 'H']], first: 1 }], queue: ['I', 'J', 'K'], stats: {}, leaving: [] };
  let s = swapPlayers(base, 'B', 'J');
  assert.deepEqual(s.courts[0].teams, [['A', 'J'], ['C', 'D']]);
  assert.deepEqual(s.queue, ['I', 'B', 'K']);
  assert.deepEqual(base.courts[0].teams[0], ['A', 'B'], 'never mutates');
  s = swapPlayers(base, 'K', 'I');
  assert.deepEqual(s.queue, ['K', 'J', 'I']);
  s = swapPlayers(base, 'A', 'H');
  assert.deepEqual(s.courts.map(c => c.teams), [[['H', 'B'], ['C', 'D']], [['E', 'F'], ['G', 'A']]]);
  s = swapPlayers(base, 'A', 'C');
  assert.deepEqual(s.courts[0].teams, [['C', 'B'], ['A', 'D']]);
  assert.throws(() => swapPlayers(base, 'A', 'B'), /partners/);
  assert.throws(() => swapPlayers(base, 'A', 'A'), /two players/);
  assert.throws(() => swapPlayers(base, 'A', 'Z'), /Z is not playing/);
});

test('a leaving player swapped off court leaves now; king of the court swaps too', () => {
  const base = { courts: [{ court: 1, teams: [['A', 'B'], ['C', 'D']], first: 0 }], queue: ['E', 'F'], stats: {}, leaving: ['B'] };
  const s = swapPlayers(base, 'B', 'E');
  assert.deepEqual(s.courts[0].teams[0], ['A', 'E']);
  assert.deepEqual(s.queue, ['F']);
  assert.deepEqual(s.leaving, []);
  let k = createKingOfCourt(names(6), 1, seeded(5));
  const [x] = k.courts[0].teams[0], [y] = k.queue;
  k = swapPlayers(k, x, y);
  assert.ok(k.courts[0].teams[0].includes(y) && k.queue.includes(x));
  assert.equal('leaving' in k, false);
});

test('renaming a player follows them everywhere', () => {
  const base = { courts: [{ court: 1, teams: [['A', 'B'], ['C', 'D']], first: 0 }], queue: ['E'], stats: { A: { played: 2, won: 1 }, B: {}, C: {}, D: {}, E: {} }, leaving: ['A'] };
  const s = renamePlayer(base, 'A', ' Amy ');
  assert.deepEqual(s.courts[0].teams[0], ['Amy', 'B']);
  assert.deepEqual(s.stats.Amy, { played: 2, won: 1 });
  assert.equal('A' in s.stats, false);
  assert.deepEqual(s.leaving, ['Amy']);
  assert.deepEqual(renamePlayer(base, 'E', 'Eve').queue, ['Eve']);
  assert.equal(renamePlayer(base, 'A', 'A'), base);
  assert.throws(() => renamePlayer(base, 'A', 'B'), /duplicate/);
  assert.throws(() => renamePlayer(base, 'A', ' '), /empty/);
  const k = renamePlayer({ courts: [{ court: 1, teams: [['A', 'B'], ['C', 'D']], streak: 1 }], queue: ['E'] }, 'D', 'Dan');
  assert.deepEqual(k.courts[0].teams[1], ['C', 'Dan']);
  assert.equal('stats' in k, false);
});

test('a redraw keeps counts and puts whoever played least first', () => {
  const prior = { P1: { played: 3, won: 2 }, P2: { played: 0, won: 0 }, P3: { played: 3, won: 1 }, P4: { played: 1, won: 1 }, P5: { played: 2, won: 0 }, P6: { played: 0, won: 0 } };
  const s = createOpenPlay(names(6), 1, seeded(11), prior);
  const order = [...s.courts[0].teams.flat(), ...s.queue];
  assert.deepEqual(order.map(n => prior[n].played), [0, 0, 1, 2, 3, 3]);
  assert.deepEqual(s.stats.P1, { played: 3, won: 2 });
});

test('mixed doubles: one man + one woman per team when the tags allow', () => {
  const g = { A: 'm', B: 'm', C: 'f', D: 'f', E: 'm' };
  assert.deepEqual(mixTeams(['A', 'C', 'B', 'D'], g), { teams: [['A', 'C'], ['B', 'D']], mixed: true });
  assert.deepEqual(mixTeams(['A', 'B', 'C', 'D'], g), { teams: [['A', 'D'], ['B', 'C']], mixed: true });
  assert.deepEqual(mixTeams(['A', 'C', 'D', 'B'], g), { teams: [['A', 'C'], ['D', 'B']], mixed: true });
  // Untagged players fit anywhere.
  assert.deepEqual(mixTeams(['A', 'B', 'X', 'Y'], g), { teams: [['A', 'Y'], ['B', 'X']], mixed: true });
  // Three men: play anyway, flagged.
  assert.deepEqual(mixTeams(['A', 'B', 'E', 'C'], g), { teams: [['A', 'B'], ['E', 'C']], mixed: false });
  assert.throws(() => mixTeams(['A', 'B', 'C'], g), /four/);
  assert.throws(() => mixTeams(['A', 'B', 'C', 'Z'], { Z: 'x' }), /gender/);
});

test('mixed open play pairs each court and never reorders the queue', () => {
  const g = { P1: 'm', P2: 'm', P3: 'm', P4: 'm', P5: 'f', P6: 'f', P7: 'f', P8: 'f' };
  let s = createOpenPlay(names(8), 2, seeded(5), {}, g);
  const plain = createOpenPlay(names(8), 2, seeded(5));
  assert.deepEqual(s.queue, plain.queue);
  for (const c of s.courts) {
    assert.deepEqual(c.teams.flat().sort(), plain.courts[c.court - 1].teams.flat().sort());
    if (c.mixed) for (const t of c.teams) assert.notEqual(g[t[0]], g[t[1]]);
  }
  s = finishOpenPlayGame(s, 0, 0, seeded(6), g);
  assert.equal(typeof s.courts[0].mixed, 'boolean');
  assert.equal('mixed' in finishOpenPlayGame(plain, 0, 0, seeded(6)).courts[0], false);
});

test('a scored game finds its court again, unless it changed', () => {
  const s = { courts: [{ court: 1, teams: [['A', 'B'], ['C', 'D']] }, { court: 2, teams: [['E', 'F'], ['G', 'H']] }, { court: 3, teams: [] }], queue: [] };
  assert.equal(courtOfGame(s, { court: 2, teams: [['F', 'E'], ['G', 'H']] }), 1);
  assert.equal(courtOfGame(s, { court: 2, teams: [['G', 'H'], ['E', 'F']] }), -1);
  assert.equal(courtOfGame(s, { court: 1, teams: [['A', 'C'], ['B', 'D']] }), -1);
  assert.equal(courtOfGame(s, { court: 3, teams: [] }), -1);
  assert.equal(courtOfGame(null, { court: 1, teams: [['A', 'B'], ['C', 'D']] }), -1);
});
