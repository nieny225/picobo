// Pure draw / rotation logic. No DOM. `rng` is injectable for tests.

export function shuffle(items, rng = Math.random) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function coinFlip(rng = Math.random) {
  return rng() < 0.5 ? 'A' : 'B';
}

// Random pairs. An odd name is returned in `leftover`.
export function makeTeams(names, rng = Math.random) {
  assertNames(names, 2);
  const order = shuffle(names, rng);
  const teams = [];
  for (let i = 0; i + 1 < order.length; i += 2) teams.push([order[i], order[i + 1]]);
  return { teams, leftover: order.length % 2 ? [order[order.length - 1]] : [] };
}

// Pairs teams onto courts in the given order. Teams that do not fit wait.
export function assignCourts(teams, courtCount) {
  if (!Number.isInteger(courtCount) || courtCount < 1) throw new Error('draw: courtCount must be >= 1');
  const matches = [];
  let i = 0;
  for (let c = 1; c <= courtCount && i + 1 < teams.length; c++, i += 2) {
    matches.push({ court: c, teams: [teams[i], teams[i + 1]] });
  }
  return { matches, waiting: teams.slice(i) };
}

// Fixed-round rotation. Every round: `courtCount * 4` players play, the rest
// rest (rest duty rotates), and pairings are chosen to minimize repeated
// partners first, repeated opponents second.
export function roundRobin(names, courtCount, rounds, rng = Math.random) {
  assertNames(names, 4);
  if (!Number.isInteger(courtCount) || courtCount < 1) throw new Error('draw: courtCount must be >= 1');
  if (!Number.isInteger(rounds) || rounds < 1) throw new Error('draw: rounds must be >= 1');
  const perRound = Math.min(courtCount * 4, Math.floor(names.length / 4) * 4);
  const courtsUsed = perRound / 4;
  const partner = countTable(names);
  const opponent = countTable(names);
  const order = shuffle(names, rng);
  let restPointer = 0;
  const out = [];
  for (let r = 1; r <= rounds; r++) {
    // Resting players are taken from a rotating window so rest is shared.
    const restCount = order.length - perRound;
    const resting = [];
    for (let k = 0; k < restCount; k++) resting.push(order[(restPointer + k) % order.length]);
    restPointer = (restPointer + restCount) % order.length;
    const playing = order.filter(n => !resting.includes(n));
    const best = bestPairing(playing, partner, opponent, rng);
    const matches = [];
    for (let c = 0; c < courtsUsed; c++) {
      const g = best.slice(c * 4, c * 4 + 4);
      const t1 = [g[0], g[1]], t2 = [g[2], g[3]];
      bump(partner, t1[0], t1[1]); bump(partner, t2[0], t2[1]);
      for (const a of t1) for (const b of t2) bump(opponent, a, b);
      matches.push({ court: c + 1, teams: [t1, t2] });
    }
    out.push({ round: r, matches, resting });
  }
  return out;
}

// King of the court: winners stay, losers go to the back of the queue, the
// next two waiting players come in as a team. A winning team that reaches
// `maxStreak` also rotates out (after the losers).
export function createKingOfCourt(names, courtCount, rng = Math.random) {
  assertNames(names, 4);
  if (!Number.isInteger(courtCount) || courtCount < 1) throw new Error('draw: courtCount must be >= 1');
  const queue = shuffle(names, rng);
  const courts = [];
  for (let c = 1; c <= courtCount && queue.length >= 4; c++) {
    courts.push({ court: c, teams: [queue.splice(0, 2), queue.splice(0, 2)], streak: 0 });
  }
  return { courts, queue };
}

export function advanceKingOfCourt(state, courtIndex, winnerIndex, maxStreak = 3) {
  const court = state.courts[courtIndex];
  if (!court) throw new Error('draw: no such court');
  if (winnerIndex !== 0 && winnerIndex !== 1) throw new Error('draw: winnerIndex must be 0 or 1');
  const winners = court.teams[winnerIndex], losers = court.teams[1 - winnerIndex];
  const queue = state.queue.slice();
  queue.push(...losers);
  let streak = court.streak + 1;
  let staying = winners;
  if (streak >= maxStreak) { queue.push(...winners); staying = null; streak = 0; }
  const teams = [];
  if (staying) teams.push(staying);
  while (teams.length < 2 && queue.length >= 2) teams.push(queue.splice(0, 2));
  const courts = state.courts.slice();
  if (teams.length === 2) courts[courtIndex] = { court: court.court, teams, streak };
  else {
    // Not enough players to refill: hand everyone back to the queue.
    for (const t of teams) queue.push(...t);
    courts[courtIndex] = { court: court.court, teams: [], streak: 0 };
  }
  return { courts, queue };
}

// Open play (paddle stack): everyone waits in one queue. When a court
// finishes, its four players go to the back of the queue and the first four in
// the queue take the court, front two against next two. The finished four
// re-queue as winner, loser, winner, loser so partners split up next time.
// Played/won counts are kept per player. `first` is the team that serves
// first on each court (coin flip). A redraw passes the counts so far: the
// shuffle then puts whoever has played least at the front (random among
// equals) and keeps the counts.
// Mixed doubles: pass `genders` ({ name: 'm' | 'f' }, untagged players fit
// anywhere) and each court's four are paired one man + one woman per team
// when they can be; the queue order never changes for it. Such a court
// carries `mixed: true | false`.
export function createOpenPlay(names, courtCount, rng = Math.random, prior = {}, genders = null) {
  assertNames(names, 4);
  if (!Number.isInteger(courtCount) || courtCount < 1) throw new Error('draw: courtCount must be >= 1');
  const played = n => prior[n]?.played ?? 0;
  const queue = shuffle(names, rng).sort((a, b) => played(a) - played(b));
  const stats = {};
  for (const n of names) stats[n] = prior[n] ?? { played: 0, won: 0 };
  const courts = [];
  for (let c = 1; c <= courtCount; c++) courts.push(fillCourt(c, queue, rng, genders));
  return { courts, queue, stats, leaving: [] };
}

function fillCourt(court, queue, rng, genders = null) {
  if (queue.length < 4) return { court, teams: [], first: 0 };
  const g = queue.splice(0, 4);
  const first = coinFlip(rng) === 'A' ? 0 : 1;
  if (!genders) return { court, teams: [[g[0], g[1]], [g[2], g[3]]], first };
  return { court, ...mixTeams(g, genders), first };
}

// Four players into two teams of one man + one woman where the tags allow.
// The usual split (1+2 against 3+4) wins when it already works, then 1+4
// against 2+3 (which still keeps the last winners apart), then 1+3 / 2+4.
export function mixTeams(four, genders) {
  if (four.length !== 4) throw new Error('draw: mixTeams needs four players');
  for (const n of four) if (genders[n] && genders[n] !== 'm' && genders[n] !== 'f') throw new Error(`draw: unknown gender ${genders[n]}`);
  const [a, b, c, d] = four;
  const fits = t => !(genders[t[0]] && genders[t[0]] === genders[t[1]]);
  for (const teams of [[[a, b], [c, d]], [[a, d], [b, c]], [[a, c], [b, d]]]) {
    if (teams.every(fits)) return { teams, mixed: true };
  }
  return { teams: [[a, b], [c, d]], mixed: false };
}

export function finishOpenPlayGame(state, courtIndex, winnerIndex, rng = Math.random, genders = null) {
  const court = state.courts[courtIndex];
  if (!court || court.teams.length !== 2) throw new Error('draw: no game on that court');
  if (winnerIndex !== 0 && winnerIndex !== 1) throw new Error('draw: winnerIndex must be 0 or 1');
  const [w, l] = [court.teams[winnerIndex], court.teams[1 - winnerIndex]];
  const stats = { ...state.stats };
  for (const n of [...w, ...l]) stats[n] = { played: stats[n].played + 1, won: stats[n].won + (w.includes(n) ? 1 : 0) };
  const queue = state.queue.slice();
  const back = [w[0], l[0], w[1], l[1]].filter(n => !state.leaving.includes(n));
  queue.push(...back);
  const leaving = state.leaving.filter(n => !court.teams.flat().includes(n));
  const courts = state.courts.slice();
  courts[courtIndex] = fillCourt(court.court, queue, rng, genders);
  // A court that was idle for lack of players can start now too.
  for (let i = 0; i < courts.length; i++) if (courts[i].teams.length === 0) courts[i] = fillCourt(courts[i].court, queue, rng, genders);
  return { courts, queue, stats, leaving };
}

// A new player (or one who left earlier) joins the back of the queue; an idle
// court starts if it can. Someone on court who was leaving just stays.
export function joinOpenPlay(state, name, rng = Math.random, genders = null) {
  const present = state.queue.includes(name) || state.courts.some(c => c.teams.flat().includes(name));
  if (present && !state.leaving.includes(name)) throw new Error('draw: duplicate player names');
  const queue = present ? state.queue.slice() : [...state.queue, name];
  const courts = state.courts.map(c => (c.teams.length === 0 ? fillCourt(c.court, queue, rng, genders) : c));
  const stats = { ...state.stats, [name]: state.stats[name] ?? { played: 0, won: 0 } };
  return { courts, queue, stats, leaving: state.leaving.filter(n => n !== name) };
}

// A player leaves: out of the queue now, or off the court after this game.
// Their counts stay in the table.
export function leaveOpenPlay(state, name) {
  const onCourt = state.courts.some(c => c.teams.flat().includes(name));
  return { ...state, queue: state.queue.filter(n => n !== name), leaving: onCourt ? [...state.leaving, name] : state.leaving };
}

// Swap two players wherever they stand: on a court (either team, any court)
// or in the queue. Used when people trade places by hand ("you go in for
// me"). Counts don't change. Partners on the same team can't swap (nothing
// would change). In open play, someone who was leaving after this game and
// is swapped into the queue simply leaves now.
export function swapPlayers(state, a, b) {
  if (a === b) throw new Error('draw: swap needs two players');
  const courts = state.courts.map(c => ({ ...c, teams: c.teams.map(t => t.slice()) }));
  let queue = state.queue.slice();
  const find = name => {
    for (const c of courts) for (const t of c.teams) { const i = t.indexOf(name); if (i >= 0) return { list: t, i }; }
    const i = queue.indexOf(name);
    if (i >= 0) return { list: queue, i };
    throw new Error(`draw: ${name} is not playing`);
  };
  const pa = find(a), pb = find(b);
  if (pa.list === pb.list && pa.list !== queue) throw new Error('draw: partners cannot swap');
  pa.list[pa.i] = b;
  pb.list[pb.i] = a;
  if (!state.leaving) return { ...state, courts, queue };
  const gone = state.leaving.filter(n => queue.includes(n));
  queue = queue.filter(n => !gone.includes(n));
  return { ...state, courts, queue, leaving: state.leaving.filter(n => !gone.includes(n)) };
}

// Rename a player everywhere they appear: courts, queue, leaving and counts.
// Works for open play and king of the court (whichever fields exist).
export function renamePlayer(state, from, to) {
  const name = String(to ?? '').trim();
  if (!name) throw new Error('draw: empty name');
  if (name === from) return state;
  const everyone = [...state.courts.flatMap(c => c.teams.flat()), ...state.queue, ...Object.keys(state.stats ?? {})];
  if (everyone.includes(name)) throw new Error('draw: duplicate player names');
  const swap = n => (n === from ? name : n);
  const next = { ...state, courts: state.courts.map(c => ({ ...c, teams: c.teams.map(t => t.map(swap)) })), queue: state.queue.map(swap) };
  if (state.leaving) next.leaving = state.leaving.map(swap);
  if (state.stats) next.stats = Object.fromEntries(Object.entries(state.stats).map(([k, v]) => [swap(k), v]));
  return next;
}

function assertNames(names, min) {
  if (!Array.isArray(names) || names.length < min) throw new Error(`draw: need at least ${min} players`);
  if (new Set(names).size !== names.length) throw new Error('draw: duplicate player names');
}

function countTable(names) {
  const t = {};
  for (const n of names) t[n] = {};
  return t;
}

function bump(table, a, b) {
  table[a][b] = (table[a][b] ?? 0) + 1;
  table[b][a] = (table[b][a] ?? 0) + 1;
}

// Random restarts followed by swap-improvement. Good enough for rec-play
// sizes (N <= 16); a perfect schedule is not guaranteed.
function bestPairing(playing, partner, opponent, rng) {
  let best = null, bestCost = Infinity;
  for (let attempt = 0; attempt < 40 && bestCost > 0; attempt++) {
    let cand = shuffle(playing, rng);
    let cost = pairingCost(cand, partner, opponent);
    for (let k = 0; k < 400 && cost > 0; k++) {
      const i = Math.floor(rng() * cand.length), j = Math.floor(rng() * cand.length);
      if (i === j) continue;
      const next = cand.slice();
      [next[i], next[j]] = [next[j], next[i]];
      const c = pairingCost(next, partner, opponent);
      if (c <= cost) { cand = next; cost = c; }
    }
    if (cost < bestCost) { best = cand; bestCost = cost; }
  }
  return best;
}

function pairingCost(order, partner, opponent) {
  let cost = 0;
  for (let c = 0; c + 3 < order.length; c += 4) {
    const [a, b, x, y] = order.slice(c, c + 4);
    cost += 4 * ((partner[a][b] ?? 0) ** 2 + (partner[x][y] ?? 0) ** 2);
    for (const p of [a, b]) for (const q of [x, y]) cost += (opponent[p][q] ?? 0) ** 2;
  }
  return cost;
}
