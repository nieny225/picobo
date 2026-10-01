// Pure tournament logic for Pico Bowl. No DOM. Divisions play pool round
// robins, then semis and a final. Matches go onto courts automatically: a free
// court takes the earliest ready match whose players are not on another court.
// Every function returns a new state; nothing mutates its input.

// Pool sizes for n teams: one pool up to 6, otherwise pools of 3 or 4.
export function planPools(n) {
  if (!Number.isInteger(n) || n < 2) throw new Error('tournament: a division needs at least 2 teams');
  if (n <= 6) return [n];
  const k = Math.ceil(n / 4);
  return Array.from({ length: k }, (_, i) => Math.floor(n / k) + (i < n % k ? 1 : 0));
}

// Circle-method round robin: rounds of pairings, each team at most once per round.
export function roundRobinRounds(ids) {
  const list = ids.length % 2 ? [...ids, null] : ids.slice();
  const rounds = [];
  for (let r = 0; r < list.length - 1; r++) {
    const pairs = [];
    for (let i = 0; i < list.length / 2; i++) {
      const a = list[i], b = list[list.length - 1 - i];
      if (a !== null && b !== null) pairs.push([a, b]);
    }
    rounds.push(pairs);
    list.splice(1, 0, list.pop());
  }
  return rounds;
}

function shuffle(items, rng) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// divisions: [{ id, name, block, teams: [[p1, p2], ...] }]. `block` orders the
// day (1 = morning, 2 = afternoon); a court only starts a later block's match
// when no earlier-block match is ready.
export function createTournament({ divisions, courts, rng = Math.random }) {
  if (!Number.isInteger(courts) || courts < 1) throw new Error('tournament: courts must be >= 1');
  const teams = {}, matches = [], divs = [];
  for (const d of divisions) {
    const ids = d.teams.map((players, i) => {
      if (players.length !== 2 || players.some(p => !p)) throw new Error(`tournament: ${d.name} team ${i + 1} needs two players`);
      const id = `${d.id}${i + 1}`;
      teams[id] = { id, div: d.id, players: players.slice(), name: players.join(' / ') };
      return id;
    });
    const sizes = planPools(ids.length);
    const order = shuffle(ids, rng);
    const pools = sizes.map((n, i) => order.splice(0, n));
    pools.forEach((pool, p) => roundRobinRounds(pool).forEach((round, r) => round.forEach(([a, b], k) => {
      matches.push({ id: `${d.id}-P${p + 1}-${r + 1}${String.fromCharCode(97 + k)}`, div: d.id, stage: 'pool', pool: p, round: r + 1, block: d.block, a, b, score: null });
    })));
    for (const m of playoffShape(pools.length)) matches.push({ ...m, id: `${d.id}-${m.stage}${m.slot ?? ''}`, div: d.id, block: d.block, a: null, b: null, score: null });
    divs.push({ id: d.id, name: d.name, block: d.block, pools });
  }
  return fillCourts({ divisions: divs, teams, matches, courts: Array(courts).fill(null) });
}

// One pool: final between the top two. Two or more pools: two semis and a final.
function playoffShape(poolCount) {
  if (poolCount === 1) return [{ stage: 'final', round: 100 }];
  return [{ stage: 'semi', slot: 1, round: 90 }, { stage: 'semi', slot: 2, round: 90 }, { stage: 'final', round: 100 }];
}

const done = m => m.score !== null;
const winnerOf = m => (m.score[0] > m.score[1] ? m.a : m.b);

// Pool table: wins first; two teams level on wins are split by their own
// match; then point difference, then points scored.
export function standings(state, divId, pool) {
  const div = state.divisions.find(d => d.id === divId);
  if (!div) throw new Error(`tournament: unknown division ${divId}`);
  const ids = div.pools[pool];
  const rows = Object.fromEntries(ids.map(id => [id, { team: id, played: 0, won: 0, lost: 0, pf: 0, pa: 0 }]));
  const games = state.matches.filter(m => m.div === divId && m.stage === 'pool' && m.pool === pool && done(m));
  for (const m of games) {
    const [x, y] = m.score;
    for (const [id, f, a] of [[m.a, x, y], [m.b, y, x]]) {
      const r = rows[id];
      r.played++; r.pf += f; r.pa += a;
      if (f > a) r.won++; else r.lost++;
    }
  }
  const h2h = (p, q) => {
    const m = games.find(g => (g.a === p && g.b === q) || (g.a === q && g.b === p));
    return m ? (winnerOf(m) === p ? -1 : 1) : 0;
  };
  return Object.values(rows).map(r => ({ ...r, diff: r.pf - r.pa })).sort((p, q) => {
    if (q.won !== p.won) return q.won - p.won;
    const level = Object.values(rows).filter(r => r.won === p.won).length;
    if (level === 2) { const h = h2h(p.team, q.team); if (h) return h; }
    return q.diff - p.diff || q.pf - p.pf;
  });
}

const poolsDone = (state, divId) => state.matches.every(m => m.div !== divId || m.stage !== 'pool' || done(m));

// Teams for the playoffs once a division's pools are finished.
function seedPlayoffs(state, div) {
  const tables = div.pools.map((_, p) => standings(state, div.id, p));
  if (tables.length === 1) return { final: [tables[0][0].team, tables[0][1].team] };
  if (tables.length === 2) return { semi1: [tables[0][0].team, tables[1][1].team], semi2: [tables[1][0].team, tables[0][1].team] };
  // Three or more pools: pool winners, topped up with the best runners-up, seeded 1-4.
  const rank = (p, q) => q.won / q.played - p.won / p.played || q.diff / q.played - p.diff / p.played;
  const winners = tables.map(t => t[0]).sort(rank);
  const seeds = [...winners, ...tables.map(t => t[1]).filter(Boolean).sort(rank)].slice(0, 4).map(r => r.team);
  return { semi1: [seeds[0], seeds[3]], semi2: [seeds[1], seeds[2]] };
}

// Fills playoff slots from finished pools and semis. Slots of matches that
// already have a score are left alone.
function resolvePlayoffs(state) {
  const matches = state.matches.map(m => ({ ...m }));
  for (const div of state.divisions) {
    const get = id => matches.find(m => m.id === `${div.id}-${id}`);
    const seeded = poolsDone({ ...state, matches }, div.id) ? seedPlayoffs({ ...state, matches }, div) : {};
    for (const key of ['semi1', 'semi2', 'final']) {
      const m = get(key);
      if (!m || done(m)) continue;
      if (seeded[key]) [m.a, m.b] = seeded[key];
      else if (key === 'final' && get('semi1')) {
        const s1 = get('semi1'), s2 = get('semi2');
        m.a = done(s1) ? winnerOf(s1) : null;
        m.b = done(s2) ? winnerOf(s2) : null;
      } else { m.a = null; m.b = null; }
    }
  }
  return { ...state, matches };
}

const playersOf = (state, m) => [...state.teams[m.a].players, ...state.teams[m.b].players];

// Matches that could start now, earliest block and round first.
export function readyMatches(state) {
  return state.matches.filter(m => !done(m) && m.a && m.b && !state.courts.includes(m.id))
    .sort((p, q) => p.block - q.block || p.round - q.round);
}

// Puts the next ready match on every free court. Within the earliest block, a
// division with nothing on court goes first, so men's and women's doubles each
// get a court in the morning. Nobody is put on two courts at once.
export function fillCourts(state) {
  const courts = state.courts.slice();
  const onCourt = () => courts.filter(Boolean).map(id => state.matches.find(m => m.id === id));
  for (let c = 0; c < courts.length; c++) {
    if (courts[c]) continue;
    const playing = onCourt();
    const taken = new Set(playing.flatMap(m => playersOf(state, m)));
    const busyDivs = new Set(playing.map(m => m.div));
    const free = readyMatches({ ...state, courts }).filter(m => !playersOf(state, m).some(p => taken.has(p)));
    if (free.length === 0) continue;
    const block = free[0].block;
    const next = free.find(m => m.block === block && !busyDivs.has(m.div)) ?? free[0];
    courts[c] = next.id;
  }
  return { ...state, courts };
}

// Records (or corrects) a final score. A playoff match that already depends
// on this result and has its own score cannot be undone this way.
export function recordScore(state, matchId, a, b) {
  const m = state.matches.find(x => x.id === matchId);
  if (!m) throw new Error(`tournament: unknown match ${matchId}`);
  if (!m.a || !m.b) throw new Error('tournament: match teams are not known yet');
  if (![a, b].every(n => Number.isInteger(n) && n >= 0)) throw new Error('tournament: scores must be whole numbers >= 0');
  if (a === b) throw new Error('tournament: a game cannot end level');
  if (done(m) && dependentsPlayed(state, m)) throw new Error('tournament: a later round already used this result');
  const matches = state.matches.map(x => (x.id === matchId ? { ...x, score: [a, b] } : x));
  const courts = state.courts.map(id => (id === matchId ? null : id));
  return fillCourts(resolvePlayoffs({ ...state, matches, courts }));
}

function dependentsPlayed(state, m) {
  const later = state.matches.filter(x => x.div === m.div && x.stage !== 'pool' && x.round > m.round && done(x));
  return later.length > 0;
}

export function isFinished(state) {
  return state.matches.every(done);
}
