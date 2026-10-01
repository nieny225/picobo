import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMatch, pointWon, undo, announce, serverPosition, sideSwitchDue, markSidesSwitched } from '../src/scoring.js';

const teams = { A: ['A1', 'A2'], B: ['B1', 'B2'] };
const doubles = (extra = {}) => createMatch({ mode: 'sideout-doubles', teams, ...extra });

test('side-out doubles: opening sequence and first-server-from-right after side-out', () => {
  let s = doubles();
  assert.equal(announce(s), '0-0-2');
  assert.equal(s.server, 'A1');
  assert.equal(serverPosition(s), 'right');

  s = pointWon(s, 'A');                      // A scores, A1 and A2 swap
  assert.equal(announce(s), '1-0-2');
  assert.equal(s.server, 'A1');
  assert.deepEqual(s.teams.A.positions, { right: 'A2', left: 'A1' });
  assert.equal(serverPosition(s), 'left');

  s = pointWon(s, 'B');                      // side-out: B serves, B1 is on the right
  assert.equal(announce(s), '0-1-1');
  assert.equal(s.server, 'B1');
  assert.deepEqual(s.teams.A.positions, { right: 'A2', left: 'A1' }, 'receiving team never moves');

  s = pointWon(s, 'A');                      // B1 loses: second server B2 from where they stand
  assert.equal(announce(s), '0-1-2');
  assert.equal(s.server, 'B2');
  assert.equal(serverPosition(s), 'left');
  assert.deepEqual(s.teams.B.positions, { right: 'B1', left: 'B2' });

  s = pointWon(s, 'A');                      // side-out back to A at score 1: A2 is on the right, so A2 serves first
  assert.equal(announce(s), '1-0-1');
  assert.equal(s.server, 'A2');
  assert.equal(serverPosition(s), 'right');
});

test('side-out doubles: starting-right player is on the right exactly when the team score is even', () => {
  let seed = 7;
  const rng = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; };
  let s = doubles({ target: 999 });
  for (let i = 0; i < 400; i++) {
    s = pointWon(s, rng() < 0.5 ? 'A' : 'B');
    for (const id of ['A', 'B']) {
      const even = s.scores[id] % 2 === 0;
      assert.equal(s.teams[id].positions.right, even ? `${id}1` : `${id}2`, `team ${id} at ${JSON.stringify(s.scores)}`);
    }
  }
});

test('win by two and deuce', () => {
  let s = doubles();
  s = { ...s, scores: { A: 10, B: 10 }, serving: 'A', serverNumber: 1, server: 'A1' };
  s = pointWon(s, 'A');
  assert.equal(s.finished, false);
  s = pointWon(s, 'A');
  assert.equal(s.finished, true);
  assert.equal(s.winner, 'A');
  assert.throws(() => pointWon(s, 'A'), /finished/);
});

test('undo restores the exact previous state', () => {
  const s0 = doubles();
  const s1 = pointWon(s0, 'A');
  const s2 = pointWon(s1, 'B');
  const back = undo(s2);
  assert.deepEqual({ ...back, history: null }, { ...s1, history: null });
  assert.equal(undo(s0), s0);
});

test('side-out singles: server position follows parity, side-out hands the serve over', () => {
  let s = createMatch({ mode: 'sideout-singles', teams: { A: ['甲'], B: ['乙'] } });
  assert.equal(announce(s), '0-0');
  s = pointWon(s, 'A');
  assert.equal(serverPosition(s), 'left');
  s = pointWon(s, 'B');
  assert.equal(s.serving, 'B');
  assert.equal(s.server, '乙');
  assert.equal(announce(s), '0-1');
});

test('rally doubles: every rally scores; after a side-out the team aligns to its score and the right-court player serves (14.A.4)', () => {
  let s = createMatch({ mode: 'rally-doubles', teams, target: 21 });
  assert.equal(s.server, 'A1');
  s = pointWon(s, 'A');                      // server alternates serving areas after each point
  assert.deepEqual(s.scores, { A: 1, B: 0 });
  assert.equal(s.server, 'A1');
  assert.deepEqual(s.teams.A.positions, { right: 'A2', left: 'A1' });
  assert.equal(serverPosition(s), 'left');
  s = pointWon(s, 'B');                      // side-out: B is at 1 (odd), so B1 moves left, B2 right, B2 serves from the right
  assert.deepEqual(s.scores, { A: 1, B: 1 });
  assert.equal(s.serving, 'B');
  assert.deepEqual(s.teams.B.positions, { right: 'B2', left: 'B1' });
  assert.equal(s.server, 'B2');
  assert.equal(serverPosition(s), 'right');
  assert.equal(announce(s), '1-1');
  assert.deepEqual(s.teams.A.positions, { right: 'A2', left: 'A1' }); // the team that lost the rally does not move
  s = pointWon(s, 'A');                      // side-out back to A at 2 (even): A1 returns right and serves
  assert.deepEqual(s.teams.A.positions, { right: 'A1', left: 'A2' });
  assert.equal(s.server, 'A1');
  assert.equal(serverPosition(s), 'right');
});

test('rally doubles: the receiving team can win the game', () => {
  let s = createMatch({ mode: 'rally-doubles', teams, target: 11 });
  s = { ...s, scores: { A: 10, B: 5 }, serving: 'B' };
  s = pointWon(s, 'A');
  assert.equal(s.finished, true);
  assert.equal(s.winner, 'A');
});

test('rally singles: every rally scores, server stands by own score, receiver can win the game', () => {
  const singles = { A: ['甲'], B: ['乙'] };
  let s = createMatch({ mode: 'rally-singles', teams: singles, target: 11 });
  assert.equal(s.server, '甲');
  assert.equal(serverPosition(s), 'right');
  s = pointWon(s, 'A');                      // server wins: 1-0, serves from the left
  assert.equal(announce(s), '1-0');
  assert.equal(serverPosition(s), 'left');
  s = pointWon(s, 'B');                      // receiver wins: gets the point and the serve, 1 is odd so left
  assert.deepEqual(s.scores, { A: 1, B: 1 });
  assert.equal(s.serving, 'B');
  assert.equal(s.server, '乙');
  assert.equal(serverPosition(s), 'left');
  assert.equal(announce(s), '1-1');
  s = { ...s, scores: { A: 10, B: 6 }, serving: 'B', server: '乙' };
  s = pointWon(s, 'A');                      // 14.A.2: the receiving side can win the last point
  assert.equal(s.winner, 'A');
});

test('fun mode is plain counters', () => {
  let s = createMatch({ mode: 'fun', teams, target: 7, winBy: 1 });
  assert.equal(s.server, null);
  for (let i = 0; i < 7; i++) s = pointWon(s, 'B');
  assert.equal(announce(s), '0-7');
  assert.equal(s.winner, 'B');
});

test('deciding game side switch is due at the midpoint once', () => {
  let s = doubles({ decidingGame: true, target: 11 });
  s = { ...s, scores: { A: 5, B: 3 } };
  assert.equal(sideSwitchDue(s), false);
  s = pointWon(s, 'A');
  assert.equal(sideSwitchDue(s), true);
  s = markSidesSwitched(s);
  assert.equal(sideSwitchDue(s), false);
});

test('bad preconditions throw', () => {
  assert.throws(() => createMatch({ mode: 'nope', teams }), /unknown mode/);
  assert.throws(() => createMatch({ mode: 'sideout-doubles', teams: { A: ['x'], B: ['y', 'z'] } }), /two players/);
  assert.throws(() => pointWon(doubles(), 'C'), /unknown team/);
});
