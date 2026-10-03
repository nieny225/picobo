// 個人戰績本: every game played through Picobo, kept on the phone, and the
// numbers for one player ("me"). No DOM. A game:
//   { id, at: ISO time, source: 'score' | 'draw' | 'koc',
//     teams: [[a, b], [c, d]], scores: [x, y] | null, winner: 0 | 1 }
// 抽籤 games have no score (scores: null), only who won.
export const MAX_GAMES = 1000;
const SOURCES = ['score', 'draw', 'koc'];

// The scoreboard's placeholder names: a game with these is not anyone's.
const PLACEHOLDER = /^[甲乙][12]$/;

export function makeGame({ id, at, source, teams, scores = null, winner }) {
  if (!SOURCES.includes(source)) throw new Error(`record: unknown source ${source}`);
  if (!Array.isArray(teams) || teams.length !== 2 || teams.some(t => !Array.isArray(t) || t.length < 1 || t.length > 2)) throw new Error('record: teams');
  if (winner !== 0 && winner !== 1) throw new Error('record: winner');
  if (scores !== null && (!Array.isArray(scores) || scores.length !== 2)) throw new Error('record: scores');
  if (Number.isNaN(Date.parse(at))) throw new Error('record: at');
  return { id: String(id), at, source, teams: teams.map(t => t.map(String)), scores: scores && scores.map(Number), winner };
}

// False for a scoreboard game still using 甲1／乙1… (nobody's game).
export const hasRealNames = teams => teams.flat().every(n => n.trim() && !PLACEHOLDER.test(n.trim()));

export function addGame(games, game) {
  return [...games, game].slice(-MAX_GAMES);
}

export function removeGame(games, id) {
  return games.filter(g => g.id !== String(id));
}

// Whatever was stored, as valid games (bad entries dropped).
export function cleanGames(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const g of raw) { try { out.push(makeGame(g)); } catch { /* skip a broken entry */ } }
  return out.slice(-MAX_GAMES);
}

// "Me": a name plus other spellings of it (Max, max3066), case-insensitive.
const norm = s => String(s).trim().toLowerCase();
export const isMe = (name, me) => !!me && [me.name, ...(me.aliases ?? [])].some(n => norm(n) === norm(name));

// Start of the range in local time: this week (from Monday), this month, or all.
export function rangeStart(range, now = new Date()) {
  if (range === 'all') return null;
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === 'week') d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  else if (range === 'month') d.setDate(1);
  else throw new Error(`record: unknown range ${range}`);
  return d;
}

// Everyone who appears in the games, most frequent first (for "which one is you?").
export function namesSeen(games) {
  const count = new Map();
  for (const g of games) for (const n of g.teams.flat()) count.set(n, (count.get(n) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([n]) => n);
}

// The numbers for `me` over `range`. Partners and opponents need at least
// `min` games together before they count as 最佳拍檔／最難纏的對手.
export function summary(games, me, range = 'all', now = new Date(), min = 3) {
  const from = rangeStart(range, now);
  const mine = games
    .filter(g => !from || new Date(g.at) >= from)
    .map(g => ({ g, side: g.teams.findIndex(t => t.some(n => isMe(n, me))) }))
    .filter(x => x.side !== -1)
    .sort((a, b) => a.g.at.localeCompare(b.g.at));
  let won = 0, run = 0, longest = 0;
  const partners = new Map(), opponents = new Map();
  const bump = (map, name, win) => { const r = map.get(name) ?? { name, played: 0, won: 0 }; r.played++; if (win) r.won++; map.set(name, r); };
  for (const { g, side } of mine) {
    const win = g.winner === side;
    if (win) { won++; run++; longest = Math.max(longest, run); } else run = 0;
    for (const n of g.teams[side]) if (!isMe(n, me)) bump(partners, n, win);
    for (const n of g.teams[1 - side]) bump(opponents, n, win);
  }
  const played = mine.length;
  const pick = (list, score) => list.sort((a, b) => score(b) - score(a) || b.played - a.played || a.name.localeCompare(b.name))[0] ?? null;
  const ps = [...partners.values()], os = [...opponents.values()];
  return {
    played, won, lost: played - won,
    rate: played ? Math.round((won / played) * 100) : null,
    longestStreak: longest,
    currentStreak: run,
    withScore: mine.filter(x => x.g.scores).length,
    bestPartner: pick(ps.filter(p => p.played >= min), p => p.won * 1000 + Math.round((p.won / p.played) * 100)),
    mostPartner: pick(ps, p => p.played),
    toughest: pick(os.filter(o => o.played >= min && o.played > o.won), o => (o.played - o.won) * 1000 - o.won),
    recent: mine.slice(-10).reverse().map(({ g, side }) => ({
      id: g.id, at: g.at, source: g.source, won: g.winner === side,
      partners: g.teams[side].filter(n => !isMe(n, me)), opponents: g.teams[1 - side],
      scores: g.scores ? [g.scores[side], g.scores[1 - side]] : null,
    })),
  };
}
