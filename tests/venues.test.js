import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchVenue, sortVenues, activeCount, OPERATORS } from '../src/venues.js';
import { VENUES, VENUES_PAGE } from '../src/data/zh-TW/venues.js';
import { COUNTRIES, fromTimeZone } from '../src/country.js';

const A = { id: 'a', country: 'sg', name: 'Alpha Hall', city: '中區', price: 0, operator: 'public', setting: 'outdoor', courts: 4 };
const B = { id: 'b', country: 'sg', name: 'Beta Club', city: '東區', price: 8, operator: 'club', setting: 'indoor', courts: 2 };
const C = { id: 'c', country: 'sg', name: 'Gamma Arena', city: '中區', price: 40, operator: 'private', setting: ['sheltered', 'outdoor'] };
const D = { id: 'd', country: 'sg', name: 'Delta', city: '東區', operator: 'private', setting: 'indoor', courts: 6 };
const T = { id: 't', country: 'tw', name: 'Taipei Court', city: '中正萬華', price: 400, operator: 'public', setting: 'indoor', courts: 2 };
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
test('country: only that country, prices in its own currency', () => {
  const both = [...ALL, T];
  const of = f => both.filter(v => matchVenue(v, f)).map(v => v.id).join('');
  assert.equal(of({ country: 'sg' }), 'abcd');
  assert.equal(of({ country: 'tw' }), 't');
  assert.equal(of({ country: 'tw', prices: ['low'] }), 't'); // NT$400 is cheap in Taipei
  assert.equal(of({ prices: ['high'] }), 'c'); // S$40 is not NT$400
});
test('groups combine with AND', () => assert.equal(ids({ region: '東區', dry: true, ops: ['private'] }), 'd'));
test('sort by price: cheapest first, unknown last; region keeps data order', () => {
  assert.equal(sortVenues([C, D, B, A], 'price').map(v => v.id).join(''), 'abcd');
  assert.equal(sortVenues([C, A], 'region').map(v => v.id).join(''), 'ca');
  assert.throws(() => sortVenues(ALL, 'near'), /unknown sort/);
});
test('active filter count', () => assert.equal(activeCount({ prices: ['free', 'low'], ops: ['club'], dry: true, minCourts: 2, fav: true }), 5));

test('venue data: every venue has a country, an operator and a price that is a number or absent', () => {
  assert.equal(new Set(VENUES.map(v => v.id)).size, VENUES.length, 'ids are unique');
  for (const v of VENUES) {
    assert.ok(COUNTRIES.includes(v.country), `${v.id} country`);
    assert.ok(VENUES_PAGE.regions[v.country].some(r => r.id === v.city), `${v.id} city ${v.city} is a region of ${v.country}`);
    assert.ok(OPERATORS.includes(v.operator), `${v.id} operator`);
    if ('price' in v) assert.ok(typeof v.price === 'number' && v.price >= 0, `${v.id} price`);
  }
  // free courts say so in fee, and only they have price 0
  for (const v of VENUES) assert.equal(v.price === 0, v.fee === '免費', v.id);
});

test('shared filter link: round trip, language-free regions, junk dropped', async () => {
  const { filterToQuery, queryToFilter, isFiltered, REGION_KEYS } = await import('../src/venues.js');
  const { VENUES_PAGE: TW } = await import('../src/data/zh-TW/venues.js');
  const { VENUES_PAGE: EN } = await import('../src/data/en/venues.js');
  const ids = P => Object.fromEntries(COUNTRIES.map(c => [c, P.regions[c].map(r => r.id)]));
  const tw = ids(TW), en = ids(EN);
  for (const c of COUNTRIES) assert.equal(tw[c].length, REGION_KEYS[c].length, c);
  const f = { q: 'abc', region: '東區', prices: ['free', 'low'], ops: ['public'], dry: true, fav: true, minCourts: 4, sort: 'price' };
  const qs = filterToQuery(f, tw);
  assert.equal(qs, 'r=east&p=free%2Clow&op=public&dry=1&c=4&sort=price');
  assert.deepEqual(queryToFilter(qs, en), { q: '', fav: false, country: 'sg', region: 'East', prices: ['free', 'low'], ops: ['public'], dry: true, minCourts: 4, sort: 'price' });
  assert.equal(queryToFilter('', tw), null);
  assert.equal(queryToFilter('s=xyz', tw), null);
  assert.deepEqual(queryToFilter('r=mars&p=cheap,free&c=3&sort=near', tw), { q: '', fav: false, country: 'sg', region: '', prices: ['free'], ops: [], dry: false, minCourts: 0, sort: 'region' });
  assert.equal(isFiltered({ region: '', prices: [], ops: [], sort: 'region' }), false);
  assert.equal(isFiltered({ region: '', prices: [], ops: [], sort: 'price' }), true);
  assert.throws(() => filterToQuery({ region: 'Mars' }, tw), /unknown region/);
  // Taipei: cc=tw, its own region keys; a bare cc=tw is still a shared list
  const t = { country: 'tw', region: tw.tw[2], prices: ['low'], ops: [], sort: 'region' };
  const tq = filterToQuery(t, tw);
  assert.equal(tq, `cc=tw&r=${REGION_KEYS.tw[2]}&p=low`);
  assert.equal(queryToFilter(tq, en).region, en.tw[2]);
  assert.equal(queryToFilter('cc=tw', tw).country, 'tw');
  assert.equal(queryToFilter('cc=xx&r=east', tw).country, 'sg');
  assert.equal(isFiltered({ country: 'tw', region: '', prices: [], ops: [], sort: 'region' }), true);
});

test('country from the time zone', () => {
  assert.equal(fromTimeZone('Asia/Taipei'), 'tw');
  assert.equal(fromTimeZone('Asia/Singapore'), 'sg');
  assert.equal(fromTimeZone(undefined), 'sg');
});
