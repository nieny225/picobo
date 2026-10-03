// Courts directory filters and sort, no DOM. A venue carries `price` (lowest
// non-member hourly fee in S$, 0 = free, absent when unknown), `operator`
// ('public' | 'private' | 'club'), `setting` and `courts` (see src/data/venues.js).

// Price bands: a venue is in a band when its price falls in [min, max].
export const PRICE_BANDS = {
  free: { min: 0, max: 0 },
  low: { min: 0.01, max: 10 },
  mid: { min: 10.01, max: 35 },
  high: { min: 35.01, max: Infinity },
};
export const OPERATORS = ['public', 'private', 'club'];
export const SORTS = ['region', 'price'];
export const COURT_STEPS = [2, 4, 6]; // "N 面以上"; 0 = any

const settingsOf = v => [v.setting ?? []].flat();

function inBand(price, band) {
  const b = PRICE_BANDS[band];
  if (!b) throw new Error(`venues: unknown price band ${band}`);
  return price !== undefined && price >= b.min && price <= b.max;
}

// f = { region, q, prices: [], ops: [], dry, fav, minCourts }. Groups combine with AND,
// choices inside a group (prices, ops) with OR. Unknown prices only drop out
// while a price band is chosen; unknown court counts while a minimum is set.
export function matchVenue(v, f, favs = new Set()) {
  if (f.minCourts && !COURT_STEPS.includes(f.minCourts)) throw new Error(`venues: unknown court step ${f.minCourts}`);
  for (const o of f.ops ?? []) if (!OPERATORS.includes(o)) throw new Error(`venues: unknown operator ${o}`);
  if (f.region && v.city !== f.region) return false;
  if (f.q && !`${v.name} ${v.address ?? ''}`.toLowerCase().includes(f.q.toLowerCase())) return false;
  if (f.prices?.length && !f.prices.some(b => inBand(v.price, b))) return false;
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

// A filter in a shared link (#venues?r=east&p=free,low&op=public&dry=1&c=4&sort=price).
// Regions go by position, as keys that read the same in every language; search
// text and favourites stay on the sharer's phone.
export const REGION_KEYS = ['', 'central', 'east', 'west', 'north', 'northeast'];

// regionIds: the page language's region ids, in REGION_KEYS order.
export function filterToQuery(f, regionIds) {
  const q = new URLSearchParams();
  const r = regionIds.indexOf(f.region);
  if (r < 0) throw new Error(`venues: unknown region ${f.region}`);
  if (r > 0) q.set('r', REGION_KEYS[r]);
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
  if (!['r', 'p', 'op', 'dry', 'c', 'sort'].some(k => q.has(k))) return null;
  const list = k => (q.get(k) ?? '').split(',').filter(Boolean);
  const r = REGION_KEYS.indexOf(q.get('r') ?? '');
  const c = Number(q.get('c'));
  return {
    q: '', fav: false,
    region: r > 0 ? regionIds[r] : '',
    prices: list('p').filter(b => b in PRICE_BANDS),
    ops: list('op').filter(o => OPERATORS.includes(o)),
    dry: q.get('dry') === '1',
    minCourts: COURT_STEPS.includes(c) ? c : 0,
    sort: SORTS.includes(q.get('sort')) ? q.get('sort') : 'region',
  };
}

// Anything worth putting in a link (otherwise the share is the whole list).
export const isFiltered = f => !!f.region || activeCount(f) > 0 || (f.sort ?? 'region') !== 'region';
