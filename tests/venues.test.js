import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchVenue, sortVenues, activeCount, OPERATORS } from '../src/venues.js';
import { VENUES } from '../src/data/zh-TW/venues.js';

const A = { id: 'a', name: 'Alpha Hall', city: '中區', price: 0, operator: 'public', setting: 'outdoor', courts: 4 };
const B = { id: 'b', name: 'Beta Club', city: '東區', price: 8, operator: 'club', setting: 'indoor', courts: 2 };
const C = { id: 'c', name: 'Gamma Arena', city: '中區', price: 40, operator: 'private', setting: ['sheltered', 'outdoor'] };
const D = { id: 'd', name: 'Delta', city: '東區', operator: 'private', setting: 'indoor', courts: 6 };
const ALL = [A, B, C, D];
const ids = (f, favs) => ALL.filter(v => matchVenue(v, f, favs)).map(v => v.id).join('');

test('no filter shows everything', () => assert.equal(ids({}), 'abcd'));
test('region and search', () => {
  assert.equal(ids({ region: '中區' }), 'ac');
  assert.equal(ids({ q: 'club' }), 'b');
});
test('price bands: OR inside, unknown price only hidden while a band is on', () => {
  assert.equal(ids({ prices: ['free'] }), 'a');
  assert.equal(ids({ prices: ['low', 'high'] }), 'bc');
  assert.equal(ids({ prices: [] }), 'abcd');
  assert.throws(() => ids({ prices: ['cheap'] }), /unknown price band/);
});
test('operators, dry, favourites, minimum courts', () => {
  assert.equal(ids({ ops: ['private'] }), 'cd');
  assert.equal(ids({ ops: ['public', 'club'] }), 'ab');
  assert.throws(() => ids({ ops: ['gov'] }), /unknown operator/);
  assert.equal(ids({ dry: true }), 'bcd');
  assert.equal(ids({ fav: true }, new Set(['c'])), 'c');
  assert.equal(ids({ minCourts: 2 }), 'abd');
  assert.equal(ids({ minCourts: 4 }), 'ad');
  assert.equal(ids({ minCourts: 6 }), 'd');
  assert.equal(ids({ minCourts: 0 }), 'abcd');
  assert.throws(() => ids({ minCourts: 3 }), /unknown court step/);
});
test('groups combine with AND', () => assert.equal(ids({ region: '東區', dry: true, ops: ['private'] }), 'd'));
test('sort by price: cheapest first, unknown last; region keeps data order', () => {
  assert.equal(sortVenues([C, D, B, A], 'price').map(v => v.id).join(''), 'abcd');
  assert.equal(sortVenues([C, A], 'region').map(v => v.id).join(''), 'ca');
  assert.throws(() => sortVenues(ALL, 'near'), /unknown sort/);
});
test('active filter count', () => assert.equal(activeCount({ prices: ['free', 'low'], ops: ['club'], dry: true, minCourts: 2, fav: true }), 5));

test('venue data: every venue has an operator and a price that is a number or absent', () => {
  for (const v of VENUES) {
    assert.ok(OPERATORS.includes(v.operator), `${v.id} operator`);
    if ('price' in v) assert.ok(typeof v.price === 'number' && v.price >= 0, `${v.id} price`);
  }
  // free courts say so in fee, and only they have price 0
  for (const v of VENUES) assert.equal(v.price === 0, v.fee === '免費', v.id);
});
