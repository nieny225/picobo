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
