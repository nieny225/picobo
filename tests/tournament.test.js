import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planPools, roundRobinRounds, createTournament, standings, recordScore, fillCourts, isFinished } from '../src/tournament.js';

function seeded(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
}
const men = Array.from({ length: 14 }, (_, i) => `M${i + 1}`);
const women = Array.from({ length: 10 }, (_, i) => `W${i + 1}`);
const pairs = list => Array.from({ length: list.length / 2 }, (_, i) => [list[2 * i], list[2 * i + 1]]);
// Pico Bowl shape: men's 7, women's 5 in the morning, mixed 10 in the afternoon.
const picoBowl = (rng = seeded(1)) => createTournament({
  courts: 2, rng,
  divisions: [
    { id: 'MD', name: '男雙', block: 1, teams: pairs(men) },
    { id: 'WD', name: '女雙', block: 1, teams: pairs(women) },
    { id: 'XD', name: '混雙', block: 2, teams: men.slice(0, 10).map((m, i) => [m, women[i]]) },
  ],
});

test('pool sizes: one pool up to 6, else pools of 3-4', () => {
  assert.deepEqual(planPools(5), [5]);
  assert.deepEqual(planPools(7), [4, 3]);
  assert.deepEqual(planPools(10), [4, 3, 3]);
  assert.deepEqual(planPools(12), [4, 4, 4]);
  assert.throws(() => planPools(1), /at least 2/);
});

test('round robin: everyone meets everyone once, nobody twice in a round', () => {
  for (const n of [3, 4, 5, 6]) {
    const ids = Array.from({ length: n }, (_, i) => i);
    const rounds = roundRobinRounds(ids);
    const seen = new Set();
    for (const r of rounds) {
      const inRound = r.flat();
      assert.equal(new Set(inRound).size, inRound.length);
      for (const [a, b] of r) seen.add([a, b].sort().join('-'));
    }
    assert.equal(seen.size, n * (n - 1) / 2);
  }
});

test('Pico Bowl: 38 games, the morning starts with one MD and one WD court', () => {
  const s = picoBowl();
  assert.equal(s.matches.length, 9 + 3 + 10 + 1 + 12 + 3);
  assert.equal(s.courts.filter(Boolean).length, 2);
  const divs = s.courts.map(id => s.matches.find(m => m.id === id).div).sort();
  assert.deepEqual(divs, ['MD', 'WD'], "men's and women's doubles get a court each");
});

// Plays the whole day with random 15-x results, checking the courts each time.
function playOut(s, rng = seeded(9)) {
  let guard = 0;
  while (!isFinished(s)) {
    assert.ok(guard++ < 200, 'tournament stalls');
    const id = s.courts.find(Boolean);
    assert.ok(id, 'nothing on court but matches remain');
    const onCourt = s.courts.filter(Boolean).map(c => s.matches.find(m => m.id === c));
    const players = onCourt.flatMap(m => [...s.teams[m.a].players, ...s.teams[m.b].players]);
    assert.equal(new Set(players).size, players.length, 'nobody on two courts at once');
    const loser = Math.floor(rng() * 14);
    s = recordScore(s, id, ...(rng() < 0.5 ? [15, loser] : [loser, 15]));
  }
  return s;
}

test('Pico Bowl plays out to three champions with no player double-booked', () => {
  const s = playOut(picoBowl());
  for (const d of ['MD', 'WD', 'XD']) {
    const final = s.matches.find(m => m.id === `${d}-final`);
    assert.ok(final.score && final.a && final.b);
  }
});

test('standings: wins, then head-to-head for two level teams, then point difference', () => {
  let s = createTournament({ courts: 1, rng: seeded(2), divisions: [{ id: 'WD', name: '女雙', block: 1, teams: pairs(women.slice(0, 6)) }] });
  const [a, b, c] = s.divisions[0].pools[0];
  const game = (x, y) => s.matches.find(m => (m.a === x && m.b === y) || (m.a === y && m.b === x));
  const win = (w, l, pts) => { const m = game(w, l); s = recordScore(s, m.id, ...(m.a === w ? [15, pts] : [pts, 15])); };
  win(a, b, 3); win(b, c, 13); win(c, a, 14);       // all 1-1: point difference decides (a +10, b -10, c 0)
  assert.deepEqual(standings(s, 'WD', 0).map(r => r.team), [a, c, b]);
});

test('two pools: semis cross A1-B2 and B1-A2, the final takes the semi winners', () => {
  let s = createTournament({ courts: 2, rng: seeded(4), divisions: [{ id: 'MD', name: '男雙', block: 1, teams: pairs(men) }] });
  const semi = n => s.matches.find(m => m.id === `MD-semi${n}`);
  assert.equal(semi(1).a, null, 'unknown until pools finish');
  while (s.matches.some(m => m.stage === 'pool' && !m.score)) {
    const id = s.courts.find(x => x && s.matches.find(m => m.id === x).stage === 'pool');
    s = recordScore(s, id, 15, 7);
  }
  const [A, B] = [0, 1].map(p => standings(s, 'MD', p).map(r => r.team));
  assert.deepEqual([semi(1).a, semi(1).b], [A[0], B[1]]);
  assert.deepEqual([semi(2).a, semi(2).b], [B[0], A[1]]);
  s = recordScore(s, semi(1).id, 9, 15);
  s = recordScore(s, semi(2).id, 15, 9);
  const final = s.matches.find(m => m.id === 'MD-final');
  assert.deepEqual([final.a, final.b], [B[1], B[0]]);
});

test('scores: bad input throws; a pool score can be corrected until the playoffs use it', () => {
  let s = picoBowl();
  const id = s.courts[0];
  assert.throws(() => recordScore(s, id, 15, 15), /level/);
  assert.throws(() => recordScore(s, id, -1, 15), /whole numbers/);
  assert.throws(() => recordScore(s, 'nope', 15, 3), /unknown match/);
  s = recordScore(s, id, 15, 3);
  s = recordScore(s, id, 3, 15);
  assert.deepEqual(s.matches.find(m => m.id === id).score, [3, 15]);
  assert.equal(fillCourts(s).courts.length, 2);
});
