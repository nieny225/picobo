import { makeGame, addGame, removeGame, cleanGames, hasRealNames } from '../record.js';

// Where 個人戰績本 lives on this phone (rules in src/record.js): every finished
// game (picobo.games) and who "me" is (picobo.me). The scoreboard and the
// draw call recordGame; the scoreboard's undo calls unrecordGame.
const GAMES = 'picobo.games', ME_KEY = 'picobo.me';

export function loadGames() {
  try { return cleanGames(JSON.parse(localStorage.getItem(GAMES))); } catch { return []; }
}
export function saveGames(games) {
  try { games.length ? localStorage.setItem(GAMES, JSON.stringify(games)) : localStorage.removeItem(GAMES); } catch { /* storage unavailable */ }
}
export function loadMe() {
  try {
    const m = JSON.parse(localStorage.getItem(ME_KEY));
    if (m && typeof m.name === 'string' && m.name.trim()) return { name: m.name.trim(), aliases: Array.isArray(m.aliases) ? m.aliases.filter(a => typeof a === 'string' && a.trim()) : [] };
  } catch { /* none yet */ }
  return null;
}
export function saveMe(me) {
  try { me ? localStorage.setItem(ME_KEY, JSON.stringify(me)) : localStorage.removeItem(ME_KEY); } catch { /* storage unavailable */ }
}

// Record one finished game; returns its id (null when it is nobody's: the
// scoreboard's 甲1／乙1 placeholders).
export function recordGame({ source, teams, scores = null, winner }) {
  if (!hasRealNames(teams)) return null;
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  saveGames(addGame(loadGames(), makeGame({ id, at: new Date().toISOString(), source, teams, scores, winner })));
  return id;
}
export function unrecordGame(id) {
  if (id) saveGames(removeGame(loadGames(), id));
}
