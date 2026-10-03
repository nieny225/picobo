import { makeGame, addGame, removeGame, cleanGames, hasRealNames, packGames, unpackGames, mergeGames, gamesOn } from '../record.js';
import { encodeHandoff } from '../handoff.js';
import { ME } from '../data/me.js';
import { SHARE, SCORE_TEXT } from '../data/nav.js';
import { esc } from './scenes.js';
import { sharePage, toast } from './share.js';
import { fill } from '../fill.js';

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
  if (!hasRealNames(teams, [...SCORE_TEXT.placeholders.A, ...SCORE_TEXT.placeholders.B])) return null;
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  saveGames(addGame(loadGames(), makeGame({ id, at: new Date().toISOString(), source, teams, scores, winner })));
  return id;
}
export function unrecordGame(id) {
  if (id) saveGames(removeGame(loadGames(), id));
}

// 戰績連結: today's games on this phone, as a picobo.net/#me?s=… link for
// the group chat. The link is built first, then shared straight from the tap.
// The link for today's games, or null when there are none. Built ahead of the
// tap where it can be, since browsers only open the share sheet right after one.
export async function todayGamesLink() {
  const today = gamesOn(loadGames());
  return today.length ? `${SHARE.url}#me?s=${await encodeHandoff('games', packGames(today))}` : null;
}
export async function shareTodayGames(link = todayGamesLink()) {
  const url = await link;
  if (!url) { toast(esc(ME.link.none)); return; }
  await sharePage(ME.link.title, url, ME.link.text);
}

// A 戰績連結 opened here: add the games this phone does not have yet.
export function receiveGames(rows) {
  const { games, added } = mergeGames(loadGames(), unpackGames(rows));
  saveGames(games);
  toast(esc(added ? fill(ME.link.added, { n: added }) : ME.link.dup));
  return added;
}
