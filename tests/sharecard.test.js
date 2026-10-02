import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreCard, statsCard } from '../src/sharecard.js';
import { createMatch, pointWon } from '../src/scoring.js';
import { SCORE_SHARE } from '../src/data/nav.js';

test('a finished game: teams, score, winner and the meta line', () => {
  let m = createMatch({ mode: 'rally-doubles', target: 3, teams: { A: ['Amy', 'Ben'], B: ['Chris', 'Dan'] } });
  for (const t of ['B', 'B', 'A', 'B']) m = pointWon(m, t);
  const c = scoreCard(m, '2026-10-02', SCORE_SHARE);
  assert.deepEqual(c.teams, [['Amy', 'Ben'], ['Chris', 'Dan']]);
  assert.deepEqual(c.scores, [1, 3]);
  assert.equal(c.winner, 1);
  assert.equal(c.meta, '10/2 (Fri)・雙打・每球得分・打到 3 分');
  const s = scoreCard(createMatch({ mode: 'sideout-singles', teams: { A: ['Amy'], B: ['Ben'] } }), '2026-10-03', SCORE_SHARE);
  assert.equal(s.winner, null);
  assert.equal(s.meta, '10/3 (Sat)・單打・側出計分・打到 11 分');
  assert.throws(() => scoreCard(null, '2026-10-02', SCORE_SHARE), /not a match/);
});

test('戰績: most wins first, then fewest games; the rest counted', () => {
  const stats = { A: { played: 3, won: 1 }, B: { played: 2, won: 2 }, C: { played: 3, won: 2 }, D: { played: 0, won: 0 }, E: { played: 1, won: 0 }, F: { played: 2, won: 1 }, G: { played: 4, won: 0 } };
  const c = statsCard(stats, '2026-10-02', SCORE_SHARE);
  assert.deepEqual(c.rows.map(r => r.name), ['B', 'C', 'F', 'A', 'E']);
  assert.deepEqual(c.rows[0], { rank: 1, name: 'B', played: 2, won: 2 });
  assert.equal(c.rest, '…其餘 2 人');
  assert.equal(c.meta, '10/2 (Fri)・7 人');
  assert.equal(statsCard({ A: { played: 1, won: 1 }, B: { played: 1, won: 0 } }, '2026-10-02', SCORE_SHARE).rest, '');
  assert.throws(() => statsCard({ A: { played: 0, won: 0 } }, '2026-10-02', SCORE_SHARE), /no games/);
});
