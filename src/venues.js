// Courts directory filters and sort, no DOM. A venue carries `country`
// ('sg' | 'tw'), `price` (lowest non-member hourly court fee in the local
// currency, S$ or NT$, 0 = free, absent when unknown), `operator`
// ('public' | 'private' | 'club'), `setting` and `courts` (see src/data/venues.js).

// Price bands per country: a venue is in a band when its price falls in [min, max].
// The band ids are the same everywhere; only the amounts differ.
export const PRICE_BANDS = {
  sg: {
    free: { min: 0, max: 0 },
    low: { min: 0.01, max: 10 },
    mid: { min: 10.01, max: 35 },
    high: { min: 35.01, max: Infinity },
  },
  tw: {
    free: { min: 0, max: 0 },
    low: { min: 1, max: 500 },
    mid: { min: 501, max: 1500 },
    high: { min: 1501, max: Infinity },
  },
};
export const BAND_IDS = ['free', 'low', 'mid', 'high'];
export const OPERATORS = ['public', 'private', 'club'];
export const SORTS = ['region', 'price'];
export const COURT_STEPS = [2, 4, 6]; // "N 面以上"; 0 = any

const settingsOf = v => [v.setting ?? []].flat();

function inBand(price, band, country = 'sg') {
  const b = PRICE_BANDS[country]?.[band];
  if (!b) throw new Error(`venues: unknown price band ${band}`);
  return price !== undefined && price >= b.min && price <= b.max;
}

// f = { country, regions: [], q, prices: [], ops: [], dry, fav, minCourts }. Groups combine with AND,
// choices inside a group (regions, prices, ops) with OR. Unknown prices only drop out
// while a price band is chosen; unknown court counts while a minimum is set.
export function matchVenue(v, f, favs = new Set()) {
  if (f.minCourts && !COURT_STEPS.includes(f.minCourts)) throw new Error(`venues: unknown court step ${f.minCourts}`);
  for (const o of f.ops ?? []) if (!OPERATORS.includes(o)) throw new Error(`venues: unknown operator ${o}`);
  if (f.country && v.country !== f.country) return false;
  if (f.regions?.length && !f.regions.includes(v.city)) return false;
  if (f.q && !`${v.name} ${v.address ?? ''}`.toLowerCase().includes(f.q.toLowerCase())) return false;
  if (f.prices?.length && !f.prices.some(b => inBand(v.price, b, v.country))) return false;
  if (f.ops?.length && !f.ops.includes(v.operator)) return false;
  if (f.dry && !settingsOf(v).some(k => k === 'indoor' || k === 'sheltered')) return false;
  if (f.fav && !favs.has(v.id)) return false;
  if (f.minCourts && !(v.courts >= f.minCourts)) return false;
  return true;
}

// 'region' keeps data order (the list groups by region); 'price' is cheapest
// first, unknown prices last, ties in data order.
export function sortVenues(list, by) {
  if (by === 'region') return [...list];
  if (by === 'price') {
    const key = v => (v.price === undefined ? Infinity : v.price);
    return list.map((v, i) => [v, i]).sort((a, b) => key(a[0]) - key(b[0]) || a[1] - b[1]).map(([v]) => v);
  }
  throw new Error(`venues: unknown sort ${by}`);
}

// How many filters are on, for the badge on the 篩選 button (region, search
// and favourites have their own controls and don't count).
export const activeCount = f => (f.prices?.length ?? 0) + (f.ops?.length ?? 0) + (f.dry ? 1 : 0) + (f.minCourts ? 1 : 0);

// A filter in a shared link (#venues?cc=tw&r=east,south&p=free,low&op=public&dry=1&c=4&sort=price).
// No cc means Singapore (links from before Taipei). Regions go by position, as
// keys that read the same in every language; search text and favourites stay
// on the sharer's phone.
export const REGION_KEYS = {
  sg: ['', 'central', 'east', 'west', 'north', 'northeast'],
  tw: ['', 'zhongzheng', 'datong', 'zhongshan', 'songshan', 'daan', 'wanhua', 'xinyi', 'shilin', 'beitou', 'neihu', 'nangang', 'wenshan'],
};

// regionIds: { sg: [...], tw: [...] }, the page language's region ids in REGION_KEYS order.
export function filterToQuery(f, regionIds) {
  const country = f.country ?? 'sg';
  if (!REGION_KEYS[country]) throw new Error(`venues: unknown country ${country}`);
  const q = new URLSearchParams();
  if (country !== 'sg') q.set('cc', country);
  const rs = (f.regions ?? []).map(id => {
    const r = regionIds[country].indexOf(id);
    if (r < 1) throw new Error(`venues: unknown region ${id}`);
    return REGION_KEYS[country][r];
  });
  if (rs.length) q.set('r', rs.join(','));
  if (f.prices?.length) q.set('p', f.prices.join(','));
  if (f.ops?.length) q.set('op', f.ops.join(','));
  if (f.dry) q.set('dry', '1');
  if (f.minCourts) q.set('c', String(f.minCourts));
  if (f.sort && f.sort !== 'region') q.set('sort', f.sort);
  return q.toString();
}

// Reads a shared filter back; null when the query carries none. Unknown values
// are dropped rather than failing: a link may come from a newer or older page.
export function queryToFilter(query, regionIds) {
  const q = new URLSearchParams(query);
  if (!['cc', 'r', 'p', 'op', 'dry', 'c', 'sort'].some(k => q.has(k))) return null;
  const list = k => (q.get(k) ?? '').split(',').filter(Boolean);
  const country = q.get('cc') in REGION_KEYS ? q.get('cc') : 'sg';
  const c = Number(q.get('c'));
  return {
    q: '', fav: false, country,
    regions: list('r').map(k => REGION_KEYS[country].indexOf(k)).filter(r => r > 0).map(r => regionIds[country][r]),
    prices: list('p').filter(b => BAND_IDS.includes(b)),
    ops: list('op').filter(o => OPERATORS.includes(o)),
    dry: q.get('dry') === '1',
    minCourts: COURT_STEPS.includes(c) ? c : 0,
    sort: SORTS.includes(q.get('sort')) ? q.get('sort') : 'region',
  };
}

// Anything worth putting in a link (otherwise the share is the whole Singapore list).
export const isFiltered = f => (f.country ?? 'sg') !== 'sg' || (f.regions?.length ?? 0) > 0 || activeCount(f) > 0 || (f.sort ?? 'region') !== 'region';
