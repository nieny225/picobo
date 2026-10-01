// Pure scoring state machines. No DOM. Every transition returns a new state;
// nothing here mutates its input. Positions are tracked per team as
// { right, left } (the players' own right/left facing the net).
//
// Modes
//   sideout-doubles  USA Pickleball side-out scoring, two servers, 0-0-2 start
//   sideout-singles  side-out scoring, one server, position from score parity
//   rally-doubles    USA Pickleball provisional rally scoring (2026, rule 14):
//                    every rally scores, no second server, either team can
//                    score the winning point, teams stand by their score and
//                    the right-court player serves after a side-out
//   fun              plain counters for short games; no serving logic

export const MODES = ['sideout-doubles', 'sideout-singles', 'rally-doubles', 'fun'];

export function createMatch({ mode, target = 11, winBy = 2, teams, firstServer = 'A', decidingGame = false }) {
  if (!MODES.includes(mode)) throw new Error(`scoring: unknown mode ${mode}`);
  if (!Number.isInteger(target) || target < 1) throw new Error('scoring: target must be a positive integer');
  if (!Number.isInteger(winBy) || winBy < 1) throw new Error('scoring: winBy must be a positive integer');
  if (firstServer !== 'A' && firstServer !== 'B') throw new Error('scoring: firstServer must be A or B');
  const doubles = mode === 'sideout-doubles' || mode === 'rally-doubles';
  const t = {};
  for (const id of ['A', 'B']) {
    const names = (teams?.[id]?.names ?? teams?.[id] ?? []).map(String);
    if (doubles && names.length !== 2) throw new Error(`scoring: team ${id} needs two players`);
    if (!doubles && names.length < 1) throw new Error(`scoring: team ${id} needs a player`);
    t[id] = { names, positions: doubles ? { right: names[0], left: names[1] } : null };
  }
  const state = {
    mode, target, winBy, decidingGame,
    teams: t,
    scores: { A: 0, B: 0 },
    serving: mode === 'fun' ? null : firstServer,
    serverNumber: mode === 'sideout-doubles' ? 2 : null,
    server: null,
    sidesSwitched: false,
    finished: false,
    winner: null,
    history: [],
  };
  state.server = initialServer(state);
  return state;
}

function initialServer(s) {
  if (s.mode === 'fun') return null;
  const team = s.teams[s.serving];
  return team.positions ? team.positions.right : team.names[0];
}

export function other(team) {
  if (team !== 'A' && team !== 'B') throw new Error(`scoring: unknown team ${team}`);
  return team === 'A' ? 'B' : 'A';
}

export function pointWon(state, team) {
  other(team);
  if (state.finished) throw new Error('scoring: game is finished');
  const snapshot = { ...state, history: undefined };
  const s = { ...state, scores: { ...state.scores }, teams: cloneTeams(state.teams), history: [...state.history, snapshot] };
  switch (s.mode) {
    case 'sideout-doubles': sideoutDoubles(s, team); break;
    case 'sideout-singles': sideoutSingles(s, team); break;
    case 'rally-doubles': rallyDoubles(s, team); break;
    case 'fun': s.scores[team] += 1; break;
  }
  settle(s);
  return s;
}

function sideoutDoubles(s, team) {
  if (team === s.serving) {
    s.scores[team] += 1;
    swap(s.teams[team]);
  } else if (s.serverNumber === 1) {
    s.serverNumber = 2;
    s.server = partnerOf(s.teams[s.serving], s.server);
  } else {
    s.serving = team;
    s.serverNumber = 1;
    s.server = s.teams[team].positions.right;
  }
}

function sideoutSingles(s, team) {
  if (team === s.serving) s.scores[team] += 1;
  else { s.serving = team; s.server = s.teams[team].names[0]; }
}

// Rule 14.A.4: a team always stands by its own score (the player who started
// on the right is on the right at an even score), and after a side-out the
// player now on the right serves. Only the team that won the point moves.
function rallyDoubles(s, team) {
  s.scores[team] += 1;
  const t = s.teams[team];
  const even = s.scores[team] % 2 === 0;
  t.positions = { right: even ? t.names[0] : t.names[1], left: even ? t.names[1] : t.names[0] };
  if (team !== s.serving) {
    s.serving = team;
    s.server = t.positions.right;
  }
}

function settle(s) {
  const { A, B } = s.scores;
  const lead = Math.abs(A - B);
  if (Math.max(A, B) >= s.target && lead >= s.winBy) {
    s.finished = true;
    s.winner = A > B ? 'A' : 'B';
  }
}

function swap(team) {
  const { right, left } = team.positions;
  team.positions = { right: left, left: right };
}

function partnerOf(team, name) {
  const p = team.names.find(n => n !== name);
  if (!p) throw new Error('scoring: no partner found');
  return p;
}

function cloneTeams(teams) {
  const out = {};
  for (const id of ['A', 'B']) {
    out[id] = { names: [...teams[id].names], positions: teams[id].positions ? { ...teams[id].positions } : null };
  }
  return out;
}

export function undo(state) {
  if (state.history.length === 0) return state;
  const prev = state.history[state.history.length - 1];
  return { ...prev, history: state.history.slice(0, -1) };
}

// The score as it is called before the serve.
export function announce(state) {
  const { A, B } = state.scores;
  if (state.mode === 'fun') return `${A}-${B}`;
  const s = state.serving, r = other(s);
  if (state.mode === 'sideout-doubles') return `${state.scores[s]}-${state.scores[r]}-${state.serverNumber}`;
  return `${state.scores[s]}-${state.scores[r]}`;
}

// Where the current server stands (their own right/left).
export function serverPosition(state) {
  if (!state.server) return null;
  const team = state.teams[state.serving];
  if (team.positions) return team.positions.right === state.server ? 'right' : 'left';
  return state.scores[state.serving] % 2 === 0 ? 'right' : 'left';
}

// In a deciding game teams change ends when the first team reaches the
// midpoint (6 of 11, 8 of 15, 11 of 21).
export function sideSwitchDue(state) {
  if (!state.decidingGame || state.sidesSwitched || state.finished) return false;
  const mid = Math.floor(state.target / 2) + 1;
  return Math.max(state.scores.A, state.scores.B) >= mid;
}

export function markSidesSwitched(state) {
  return { ...state, sidesSwitched: true };
}
