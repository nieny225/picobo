import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeGame, addGame, removeGame, cleanGames, hasRealNames, isMe, rangeStart, namesSeen, summary, MAX_GAMES, packGames, unpackGames, mergeGames, gamesOn } from '../src/record.js';

let n = 0;
const g = (at, teams, winner, scores = null, source = 'draw') => makeGame({ id: ++n, at, source, teams, winner, scores });

test('games are checked, added, capped and removed', () => {
  assert.throws(() => g('2026-10-01T10:00:00', [['A', 'B'], ['C', 'D']], 2), /winner/);
  assert.throws(() => makeGame({ id: 1, at: 'x', source: 'draw', teams: [['A'], ['B']], winner: 0 }), /at/);
  assert.throws(() => makeGame({ id: 1, at: '2026-10-01', source: 'tv', teams: [['A'], ['B']], winner: 0 }), /source/);
  let list = [];
  for (let i = 0; i < MAX_GAMES + 5; i++) list = addGame(list, g('2026-10-01T10:00:00', [['A'], ['B']], 0));
  assert.equal(list.length, MAX_GAMES);
  const last = list.at(-1);
  assert.equal(removeGame(list, last.id).length, MAX_GAMES - 1);
  assert.deepEqual(cleanGames([last, { junk: 1 }, null]), [last]);
  assert.deepEqual(cleanGames('x'), []);
});

test('placeholder names and who is me', () => {
  assert.equal(hasRealNames([['甲1', '甲2'], ['Amy', 'Ben']]), false);
  assert.equal(hasRealNames([['Amy', 'Ben'], ['Chris', 'Dan']]), true);
  const me = { name: 'Max', aliases: ['max3066'] };
  assert.equal(isMe(' max ', me), true);
  assert.equal(isMe('MAX3066', me), true);
  assert.equal(isMe('Amy', me), false);
  assert.equal(isMe('Max', null), false);
});

test('ranges start on Monday and on the 1st, local time', () => {
  const fri = new Date(2026, 9, 2, 15, 0); // Fri 2 Oct 2026
  assert.equal(rangeStart('week', fri).toDateString(), new Date(2026, 8, 28).toDateString());
  assert.equal(rangeStart('month', fri).toDateString(), new Date(2026, 9, 1).toDateString());
  const sun = new Date(2026, 9, 4, 9, 0);
  assert.equal(rangeStart('week', sun).toDateString(), new Date(2026, 8, 28).toDateString());
  assert.equal(rangeStart('all', fri), null);
  assert.throws(() => rangeStart('year', fri), /range/);
});

test('summary: counts, rate, streaks, partners, the toughest opponent, recent games', () => {
  const me = { name: 'Max', aliases: [] };
  const games = [
    g('2026-09-20T10:00:00', [['Max', 'Amy'], ['Chris', 'Dan']], 0),            // last month
    g('2026-10-01T10:00:00', [['Max', 'Amy'], ['Chris', 'Dan']], 0, [11, 7], 'score'),
    g('2026-10-01T10:20:00', [['Chris', 'Max'], ['Amy', 'Ben']], 1),
    g('2026-10-01T10:40:00', [['Max', 'Amy'], ['Chris', 'Erin']], 0),
    g('2026-10-02T10:00:00', [['Ben', 'Dan'], ['Amy', 'Max']], 1),
    g('2026-10-02T10:20:00', [['Max', 'Ben'], ['Chris', 'Dan']], 1),
    g('2026-10-02T10:40:00', [['Gil', 'Hana'], ['Ivy', 'Jack']], 0),            // not mine
  ];
  const now = new Date(2026, 9, 2, 20, 0);
  const all = summary(games, me, 'all', now);
  assert.equal(all.played, 6);
  assert.equal(all.won, 4);
  assert.equal(all.rate, 67);
  assert.equal(all.longestStreak, 2);
  assert.equal(all.currentStreak, 0);
  assert.equal(all.withScore, 1);
  assert.deepEqual(all.bestPartner, { name: 'Amy', played: 4, won: 4 });
  assert.equal(all.mostPartner.name, 'Amy');
  assert.equal(all.toughest.name, 'Chris');
  assert.equal(all.recent[0].won, false);
  assert.deepEqual(all.recent[0].partners, ['Ben']);
  assert.deepEqual(all.recent.at(-1).opponents, ['Chris', 'Dan']);
  assert.deepEqual(all.recent.find(r => r.scores).scores, [11, 7]);
  const week = summary(games, me, 'week', now);
  assert.equal(week.played, 5);
  assert.deepEqual(week.bestPartner, { name: 'Amy', played: 3, won: 3 });
  assert.equal(summary(games, me, 'month', now).played, 5);
  const none = summary(games, { name: 'Zed' }, 'all', now);
  assert.equal(none.played, 0);
  assert.equal(none.rate, null);
  assert.equal(none.bestPartner, null);
});

test('scores are shown from my side, and names are listed by how often they appear', () => {
  const games = [g('2026-10-01T10:00:00', [['Amy', 'Ben'], ['Max', 'Dan']], 0, [11, 4], 'score')];
  const s = summary(games, { name: 'Max' }, 'all', new Date(2026, 9, 2));
  assert.deepEqual(s.recent[0].scores, [4, 11]);
  assert.equal(s.recent[0].won, false);
  assert.deepEqual(namesSeen([...games, g('2026-10-01T11:00:00', [['Max'], ['Amy']], 0)]).slice(0, 2), ['Amy', 'Max']);
});

test('戰績連結: pack, unpack, merge without duplicates, today only', () => {
  const a = g('2026-10-02T02:00:00.000Z', [['Max', 'Amy'], ['Chris', 'Dan']], 0, [11, 7], 'score');
  const b = g('2026-10-02T03:00:00.000Z', [['Max', 'Ben'], ['Chris', 'Dan']], 1);
  const c = g('2026-09-30T03:00:00.000Z', [['Max', 'Ben'], ['Erin', 'Dan']], 1);
  const back = unpackGames(JSON.parse(JSON.stringify(packGames([a, b]))));
  assert.deepEqual(back, [a, b]);
  assert.deepEqual(unpackGames([['x'], 'junk']), []);
  assert.throws(() => unpackGames('nope'), /games link/);
  const once = mergeGames([c, a], [a, b]);
  assert.equal(once.added, 1);
  assert.deepEqual(once.games.map(x => x.id), [c.id, a.id, b.id]);
  assert.equal(mergeGames(once.games, [a, b]).added, 0);
  const today = gamesOn([a, b, c], new Date('2026-10-02T06:00:00.000Z'));
  assert.deepEqual(today.map(x => x.id).sort(), [a.id, b.id].sort());
});
