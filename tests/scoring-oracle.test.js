// Cross-checks the scoring engine against an independent reference written
// straight from the rulebook, over many random games in each of the four
// play x scoring combinations. The reference never swaps players: it derives
// every position from one rule, "the player who started on the right is on
// the right whenever the team's score is even" (side-out doubles 4.B, rally
// doubles 14.A.4), or "the server stands by their own score" (singles).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMatch, pointWon, undo, announce, serverPosition } from '../src/scoring.js';

const TEAMS = { doubles: { A: ['A1', 'A2'], B: ['B1', 'B2'] }, singles: { A: ['A1'], B: ['B1'] } };
const other = t => (t === 'A' ? 'B' : 'A');
const even = n => n % 2 === 0;

function seeded(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
}

// Reference model. names[0] is the player who starts on the right.
function reference({ play, scoring, target, winBy, first }) {
  const names = TEAMS[play];
  const r = { scores: { A: 0, B: 0 }, serving: first, serverNumber: null, server: null, over: false };
  const rightOf = t => (even(r.scores[t]) ? names[t][0] : names[t][1]);
  if (play === 'doubles') {
    r.server = rightOf(first);
    if (scoring === 'sideout') r.serverNumber = 2;         // 0-0-2 start
  } else {
    r.server = names[first][0];
  }
  const won = () => {
    const { A, B } = r.scores;
    return Math.max(A, B) >= target && Math.abs(A - B) >= winBy;
  };
  return {
    state: r,
    rally(winner) {
      if (scoring === 'sideout') {
        if (winner === r.serving) r.scores[winner] += 1;    // only the serving side scores
        else if (play === 'doubles' && r.serverNumber === 1) {
          r.serverNumber = 2;
          r.server = names[r.serving].find(n => n !== r.server);
        } else {
          r.serving = winner;
          r.serverNumber = play === 'doubles' ? 1 : null;
          r.server = play === 'doubles' ? rightOf(winner) : names[winner][0];
        }
      } else {
        r.scores[winner] += 1;                              // every rally scores
        if (winner !== r.serving) {
          r.serving = winner;
          r.server = play === 'doubles' ? rightOf(winner) : names[winner][0];
        }
      }
      r.over = won();
    },
    // Court each player stands in, and the call.
    positions(t) { return play === 'doubles' ? { right: rightOf(t), left: names[t].find(n => n !== rightOf(t)) } : null; },
    serverCourt() {
      if (play === 'singles') return even(r.scores[r.serving]) ? 'right' : 'left';
      return rightOf(r.serving) === r.server ? 'right' : 'left';
    },
    call() {
      const s = r.scores[r.serving], o = r.scores[other(r.serving)];
      return scoring === 'sideout' && play === 'doubles' ? `${s}-${o}-${r.serverNumber}` : `${s}-${o}`;
    },
  };
}

const COMBOS = [];
for (const play of ['doubles', 'singles']) for (const scoring of ['sideout', 'rally']) COMBOS.push({ play, scoring });

for (const { play, scoring } of COMBOS) {
  test(`oracle: ${scoring} ${play} matches the rulebook reference over 300 random games`, () => {
    const rng = seeded(play.length * 7 + scoring.length);
    for (let game = 0; game < 300; game++) {
      const target = [7, 11, 15, 21][game % 4];
      const winBy = game % 5 === 0 ? 1 : 2;
      const first = game % 2 ? 'B' : 'A';
      let s = createMatch({ mode: `${scoring}-${play}`, teams: TEAMS[play], target, winBy, firstServer: first });
      const ref = reference({ play, scoring, target, winBy, first });
      const where = n => `${scoring}-${play} game ${game} rally ${n}`;
      for (let n = 0; n < 400 && !s.finished; n++) {
        assert.equal(announce(s), ref.call(), `${where(n)}: call`);
        assert.equal(s.serving, ref.state.serving, `${where(n)}: serving side`);
        assert.equal(s.server, ref.state.server, `${where(n)}: server`);
        assert.equal(serverPosition(s), ref.serverCourt(), `${where(n)}: server's court`);
        if (play === 'doubles') {
          for (const t of ['A', 'B']) assert.deepEqual(s.teams[t].positions, ref.positions(t), `${where(n)}: team ${t} positions`);
        }
        const winner = rng() < 0.5 ? 'A' : 'B';
        const before = s;
        s = pointWon(s, winner);
        ref.rally(winner);
        assert.deepEqual(s.scores, ref.state.scores, `${where(n)}: scores`);
        assert.equal(s.finished, ref.state.over, `${where(n)}: game over`);
        assert.deepEqual(undo(s).scores, before.scores, `${where(n)}: undo`);
      }
      assert.ok(s.finished, `${scoring}-${play} game ${game} should finish`);
      const { A, B } = s.scores;
      assert.ok(Math.max(A, B) >= target && Math.abs(A - B) >= winBy, `${scoring}-${play} game ${game}: final score ${A}-${B}`);
      if (scoring === 'sideout') assert.equal(s.winner, s.serving, 'side-out: the game ends on the serving side\'s point');
    }
  });
}

test('oracle: rally scoring lets the receiving side win the game (14.A.2)', () => {
  for (const play of ['doubles', 'singles']) {
    let s = createMatch({ mode: `rally-${play}`, teams: TEAMS[play], target: 11 });
    s = { ...s, scores: { A: 5, B: 10 } };             // A serving, B on game point
    s = pointWon(s, 'B');
    assert.equal(s.winner, 'B', play);
  }
});
