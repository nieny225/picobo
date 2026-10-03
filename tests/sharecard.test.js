import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreCard, statsCard, reportCard } from '../src/sharecard.js';
import { createMatch, pointWon } from '../src/scoring.js';
import { SCORE_SHARE } from '../src/data/nav.js';

test('a finished game: teams, score, winner and the meta line', () => {
  let m = createMatch({ mode: 'rally-doubles', target: 3, teams: { A: ['Amy', 'Ben'], B: ['Chris', 'Dan'] } });
  for (const t of ['B', 'B', 'A', 'B']) m = pointWon(m, t);
  const c = scoreCard(m, '2026-10-02', SCORE_SHARE);
  assert.deepEqual(c.teams, [['Amy', 'Ben'], ['Chris', 'Dan']]);
  assert.deepEqual(c.scores, [1, 3]);
  assert.equal(c.winner, 1);
  assert.equal(c.meta, '10/2 (Fri)・雙打・每球得分');
  const s = scoreCard(createMatch({ mode: 'sideout-singles', teams: { A: ['Amy'], B: ['Ben'] } }), '2026-10-03', SCORE_SHARE);
  assert.equal(s.winner, null);
  assert.equal(s.meta, '10/3 (Sat)・單打・側出計分');
  assert.throws(() => scoreCard(null, '2026-10-02', SCORE_SHARE), /not a match/);
});

test('戰績: most wins first, then fewest games; everyone who played is on it', () => {
  const stats = { A: { played: 3, won: 1 }, B: { played: 2, won: 2 }, C: { played: 3, won: 2 }, D: { played: 0, won: 0 }, E: { played: 1, won: 0 }, F: { played: 2, won: 1 }, G: { played: 4, won: 0 } };
  const c = statsCard(stats, '2026-10-02', SCORE_SHARE);
  assert.deepEqual(c.rows.map(r => r.name), ['B', 'C', 'F', 'A', 'E', 'G']);
  assert.deepEqual(c.rows[0], { rank: 1, name: 'B', played: 2, won: 2 });
  assert.equal(c.meta, '10/2 (Fri)・6 人');
  assert.throws(() => statsCard({ A: { played: 0, won: 0 } }, '2026-10-02', SCORE_SHARE), /no games/);
});

test('戰報: headline split around the count, dates for the range, four tiles', () => {
  const sum = { played: 14, won: 9, lost: 5, rate: 64, longestStreak: 4, bestPartner: { name: 'Amy', played: 7, won: 6 }, mostPartner: { name: 'Ben', played: 8, won: 3 } };
  const fri = new Date(2026, 9, 2, 20, 0);
  const w = reportCard(sum, 'Max', 'week', fri, SCORE_SHARE);
  assert.equal(w.meta, 'Max・9/28–10/4');
  assert.deepEqual(w.headline, { before: '這週打了 ', n: '14', after: ' 場' });
  assert.deepEqual(w.tiles.map(t => t.value), ['64%', '4', 'Amy', '9 勝 5 敗']);
  assert.equal(reportCard(sum, 'Max', 'month', fri, SCORE_SHARE).meta, 'Max・10 月');
  assert.equal(reportCard(sum, 'Max', 'all', fri, SCORE_SHARE).headline.before, '總共打了 ');
  const noBest = reportCard({ ...sum, bestPartner: null }, 'Max', 'week', fri, SCORE_SHARE);
  assert.deepEqual(noBest.tiles[2], { label: '最常搭檔', value: 'Ben' });
  assert.throws(() => reportCard({ ...sum, played: 0 }, 'Max', 'week', fri, SCORE_SHARE), /no games/);
  assert.throws(() => reportCard(sum, 'Max', 'year', fri, SCORE_SHARE), /range/);
});
