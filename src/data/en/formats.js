// Fun formats. None of these are official rules and they vary by club; each one is marked official: false.
// group sorts them by purpose: Many players, few courts / Short of players / Skill practice / Just for fun. Array order is the order of the index and of previous / next.
// scenes: court diagram steps; spot names are defined in src/court.js. People queuing or resting are drawn
// off court on the right (faded). Orange (A) is on the near half, green (B) on the far half.

const P = (team, side, pos, label, extra = {}) => ({ team, side, pos, label, ...extra });
const wait = (team, i, label) => ({ team, at: [262, 80 + i * 40], label, dim: true });
// The two lines in Around the World: each belongs to one end of the court and stays there when the court lies down.
const queueFar = (team, i, label) => ({ team, at: [262, 80 + i * 40], label, dim: true, keepSide: true });
const queueNear = (team, i, label) => ({ team, at: [262, 440 - i * 40], label, dim: true, keepSide: true });
// Players who are out: drawn off court on the left.
const out = label => ({ team: 'A', at: [18, 260], label, dim: true });
const serve = { depth: 'behind', serving: true };
const atLine = { depth: 'kitchenLine' };
export const FORMATS = [
  {
    id: 'king',
    name: 'King of the court',
    en: 'King of the Court',
    group: 'Many players, few courts',
    players: '6+ players, not enough courts',
    tagline: 'Winners stay, losers queue. The fastest way to clear a crowd.',
    rules: [
      'Four players play a short game. The losing team goes to the back of the queue.',
      'The winners stay on; the next two in the queue come on to challenge them.',
      'A team that wins three in a row steps off anyway, so everyone gets to play.',
      'The new team serves first. The team that stayed already has home advantage.',
    ],
    scoring: 'Rally scoring to 7 or 11, no need to win by 2.',
    scenes: [
      { caption: 'Team A stays on, Team B comes on to challenge. Everyone else queues at the side.', players: [P('A', 'near', 'right', 'A1'), P('A', 'near', 'left', 'A2'), P('B', 'far', 'right', 'B1', serve), P('B', 'far', 'left', 'B2'), wait('B', 0, 'C1'), wait('B', 1, 'C2'), wait('B', 2, 'D1'), wait('B', 3, 'D2')] },
      { caption: 'Team B loses and goes to the back of the queue. Team C, first in line, comes on and serves first.', players: [P('A', 'near', 'right', 'A1'), P('A', 'near', 'left', 'A2'), P('B', 'far', 'right', 'C1', serve), P('B', 'far', 'left', 'C2'), wait('B', 0, 'D1'), wait('B', 1, 'D2'), wait('B', 2, 'B1'), wait('B', 3, 'B2')] },
      { caption: 'Team A has won three in a row, so they step off too. Team D comes on, so everyone gets to play.', players: [P('A', 'near', 'right', 'D1', serve), P('A', 'near', 'left', 'D2'), P('B', 'far', 'right', 'C1'), P('B', 'far', 'left', 'C2'), wait('B', 0, 'B1'), wait('B', 1, 'B2'), wait('A', 2, 'A1'), wait('A', 3, 'A2')] },
    ],
    tip: 'Use King of the court mode on the Draw tab: tap the winners and the queue updates itself.',
  },
  {
    id: 'roundrobin',
    name: 'Round robin',
    en: 'Round Robin',
    group: 'Many players, few courts',
    players: '8 to 16 players, 1 to 4 courts',
    tagline: 'New partner and new opponents every round. Highest individual total wins.',
    rules: [
      'Plan every round in advance: who partners whom, on which court, and who sits out.',
      'All courts start each round together and play to a set score or a set time.',
      'Everyone records the points they scored this round, whoever their partner was.',
      'After the last round, the highest individual total wins the day.',
    ],
    scoring: 'Rally scoring to 11 (or 10 minutes on the clock). Your team\'s score goes under your own name.',
    scenes: [
      { caption: 'Round 1: Jo + Mo vs Ty + Al. Bo and Ed sit out.', players: [P('A', 'near', 'right', 'Jo'), P('A', 'near', 'left', 'Mo'), P('B', 'far', 'right', 'Ty'), P('B', 'far', 'left', 'Al'), wait('A', 0, 'Bo'), wait('A', 1, 'Ed')] },
      { caption: 'Round 2: new partners, new opponents. The players who sat out come on.', players: [P('A', 'near', 'right', 'Jo'), P('A', 'near', 'left', 'Bo'), P('B', 'far', 'right', 'Mo'), P('B', 'far', 'left', 'Ed'), wait('A', 0, 'Ty'), wait('A', 1, 'Al')] },
      { caption: 'Everyone records their own points, whoever their partner was. After the last round, the highest total wins.', players: [P('A', 'near', 'right', 'Ty'), P('A', 'near', 'left', 'Ed'), P('B', 'far', 'right', 'Jo'), P('B', 'far', 'left', 'Bo'), wait('A', 0, 'Mo'), wait('A', 1, 'Al')] },
    ],
    tip: 'Use the Draw tab to make the round schedule. It avoids repeat partners as far as it can.',
  },
  {
    id: 'quick',
    name: 'Quick games',
    en: 'Quick Games',
    group: 'Many players, few courts',
    players: '4 players, rotating a crowd',
    tagline: 'Games to 7 or 10 minutes each. The fastest on and off.',
    rules: [
      'Rally scoring, first to 7 wins, no need to win by 2.',
      'Or set a 10-minute timer: higher score at the buzzer wins. If tied, play one point to decide.',
      'Serve follows rally scoring: whoever wins the rally serves next.',
    ],
    scoring: 'Rally scoring to 7, or 10 minutes on the clock.',
    scenes: [
      { caption: 'Rally scoring: whoever wins the rally serves next. First to 7 wins, no need to win by 2.', players: [P('A', 'near', 'right', 'A1', serve), P('A', 'near', 'left', 'A2'), P('B', 'far', 'right', 'B1'), P('B', 'far', 'left', 'B2')], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
    ],
    tip: 'On the scoreboard pick Quick mode, set the target to 7 and win by 1.',
  },
  {
    id: 'cutthroat',
    name: 'Cutthroat',
    en: 'Cutthroat',
    group: 'Short of players',
    players: 'Exactly 3 players',
    tagline: 'One against two. Everyone takes turns being the one.',
    rules: [
      'The server plays alone against the other two. The server covers the whole half; the pair plays normal doubles.',
      'If the server wins the rally, they score 1 and keep serving: even score from the right, odd from the left.',
      'If the server loses the rally, the next player becomes the server. All three take turns.',
      'Everyone keeps their own score. First to 11 wins.',
    ],
    scoring: 'Only the server can score. First to 11, win by 2.',
    scenes: [
      { caption: 'A (orange) serves and plays alone, covering the whole half. B and C team up on the other side.', highlight: ['nvz:near', 'serviceBox:near:right', 'serviceBox:near:left'], players: [P('A', 'near', 'right', 'A', serve), P('B', 'far', 'right', 'B'), P('B', 'far', 'left', 'C')] },
      { caption: 'A wins the rally, scores 1 and keeps serving. 1 is odd, so A serves from the left.', players: [P('A', 'near', 'left', 'A', serve), P('B', 'far', 'right', 'B'), P('B', 'far', 'left', 'C')], ball: { path: ['near:left:behind', 'far:left:mid'], bounces: [1] } },
      { caption: 'A loses the rally. Now B plays alone and serves; A crosses over to team up with C.', highlight: ['nvz:near', 'serviceBox:near:right', 'serviceBox:near:left'], players: [P('A', 'near', 'right', 'B', serve), P('B', 'far', 'right', 'A'), P('B', 'far', 'left', 'C')] },
    ],
    tip: 'Playing alone is tiring, so short games to 7 work well. Some clubs widen the solo player\'s service court to the whole half.',
  },
  {
    id: 'skinny',
    name: 'Skinny singles',
    en: 'Skinny Singles',
    group: 'Short of players',
    players: 'Exactly 2 players',
    tagline: 'Singles on half the court. Less running, more placement.',
    rules: [
      'Even score: both players use the right half. Odd score: both use the left half. A ball landing in the other half is out.',
      'Another version is crosscourt: the server stands right on even, left on odd, and the ball must land in the diagonal half.',
      'Everything else is normal singles: the two-bounce rule and kitchen rules still apply.',
    ],
    scoring: 'Side-out scoring to 11, or rally scoring to 15. Agree before you start.',
    scenes: [
      { caption: 'Straight version: the server\'s score is even, so both players use only this right half. A ball in the other half is out.', highlight: ['serviceBox:near:right', 'serviceBox:far:left'], players: [P('A', 'near', 'right', 'A', serve), P('B', 'far', 'left', 'B')], ball: { path: ['near:right:behind', 'far:left:mid'], bounces: [1] } },
      { caption: 'Odd score: both players move to the left half together.', highlight: ['serviceBox:near:left', 'serviceBox:far:right'], players: [P('A', 'near', 'left', 'A', serve), P('B', 'far', 'right', 'B')], ball: { path: ['near:left:behind', 'far:right:mid'], bounces: [1] } },
      { caption: 'Crosscourt version: the server still goes right on even, left on odd, but every ball must land in the diagonal half.', highlight: ['serviceBox:near:right', 'serviceBox:far:right'], players: [P('A', 'near', 'right', 'A', serve), P('B', 'far', 'right', 'B')], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
    ],
    tip: 'Agree on which version before you start, or there will be arguments.',
  },
  {
    id: 'dink',
    name: 'Dink game',
    en: 'Dink Game',
    group: 'Skill practice',
    players: '2 or 4 players',
    tagline: 'Dinks only. Trains patience and touch.',
    rules: [
      'All four stand behind the kitchen line and start the rally with a dink (a soft feed over the net).',
      'Every ball must land in the opponents\' kitchen. Past the kitchen line is out.',
      'No volleys, no drives: the ball must bounce before you hit it.',
      'If your opponent dinks out or into the net, you score 1.',
    ],
    scoring: 'Rally scoring to 7 or 11.',
    scenes: [
      { caption: 'All four stand behind the kitchen line and start with a dink, dropping the ball softly into the other kitchen.', highlight: ['nvz'], players: [P('A', 'near', 'right', 'A1', atLine), P('A', 'near', 'left', 'A2', atLine), P('B', 'far', 'right', 'B1', atLine), P('B', 'far', 'left', 'B2', atLine)], ball: { path: ['near:right:kitchenLine', 'far:left:kitchen'], bounces: [1] } },
      { caption: 'The ball must land in the other kitchen. Outside the kitchen is out.', highlight: ['nvz:far'], players: [P('A', 'near', 'right', 'A1', atLine), P('A', 'near', 'left', 'A2', atLine), P('B', 'far', 'right', 'B1', atLine), P('B', 'far', 'left', 'B2', atLine)], ball: { path: ['near:left:kitchenLine', 'far:right:mid'], bounces: [1] } },
      { caption: 'No volleys: the ball must bounce in the kitchen before you hit it.', highlight: ['nvz:near'], players: [P('A', 'near', 'right', 'A1', atLine), P('A', 'near', 'left', 'A2', atLine), P('B', 'far', 'right', 'B1', atLine), P('B', 'far', 'left', 'B2', atLine)], ball: { path: ['far:left:kitchenLine', 'near:right:kitchen', 'near:right:kitchenLine'], bounces: [1] } },
    ],
    tip: 'Many clubs also count one step past the kitchen line as in. Agree before you start.',
  },
  {
    id: 'volley',
    name: 'Volley wars',
    en: 'Volley Wars',
    group: 'Skill practice',
    players: '2 or 4 players',
    tagline: 'After the feed the ball never bounces. Everything is hit in the air.',
    rules: [
      'Everyone stands one step behind the kitchen line and starts with a soft feed over the net.',
      'After that the ball may not bounce: every shot is a volley straight back.',
      'Let it bounce, hit the net or hit it out, and you lose the rally.',
      'Kitchen rules still apply: when you volley, your feet can\'t touch the kitchen or the kitchen line.',
    ],
    scoring: 'Rally scoring to 11.',
    scenes: [
      { caption: 'All four stand one step behind the kitchen line and start with a soft feed.', players: [P('A', 'near', 'right', 'A1', atLine), P('A', 'near', 'left', 'A2', atLine), P('B', 'far', 'right', 'B1', atLine), P('B', 'far', 'left', 'B2', atLine)], ball: { path: ['near:right:kitchenLine', 'far:left:kitchenLine', 'near:left:kitchenLine', 'far:right:kitchen'], step: 1 } },
      { caption: 'From then on the ball may not bounce. Every shot goes back in the air.', players: [P('A', 'near', 'right', 'A1', atLine), P('A', 'near', 'left', 'A2', atLine), P('B', 'far', 'right', 'B1', atLine), P('B', 'far', 'left', 'B2', atLine)], ball: { path: ['near:right:kitchenLine', 'far:left:kitchenLine', 'near:left:kitchenLine', 'far:right:kitchen'], step: 2 } },
      { caption: 'Let it bounce, hit the net or hit it out and you lose the rally. No stepping into the kitchen on a volley.', highlight: ['nvz'], players: [P('A', 'near', 'right', 'A1', atLine), P('A', 'near', 'left', 'A2', atLine), P('B', 'far', 'right', 'B1', atLine), P('B', 'far', 'left', 'B2', atLine)], ball: { path: ['near:right:kitchenLine', 'far:left:kitchenLine', 'near:left:kitchenLine', 'far:right:kitchen'], bounces: [3], step: 3 } },
    ],
    tip: 'The best drill for hand speed and reactions. Stand too close and you\'ll step into the kitchen; one step behind the line is right.',
  },
  {
    id: 'thirdshot',
    name: 'Third-shot challenge',
    en: 'Third-Shot Challenge',
    group: 'Skill practice',
    players: '4 players',
    tagline: 'Drop the third shot into the kitchen and win the rally: 2 points.',
    rules: [
      'Play normal doubles.',
      'If the serving team\'s third shot lands in the opponents\' kitchen and the serving team goes on to win the rally, it counts 2 points.',
      'If the third shot doesn\'t land in the kitchen, score as usual.',
      'The receiving team scores as usual, no bonus.',
    ],
    scoring: 'Normal scoring; a rally won after a successful drop counts 2. Playing to 15 works well.',
    scenes: [
      { caption: 'A1 serves, B1 returns deep and Team B moves up to the net.', players: [P('A', 'near', 'right', 'A1', serve), P('A', 'near', 'left', 'A2'), P('B', 'far', 'right', 'B1', { depth: 'mid' }), P('B', 'far', 'left', 'B2', { depth: 'mid' })], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchen'], bounces: [1, 2], step: 2 } },
      { caption: 'Third shot: A1 drops the ball softly into the other kitchen. Team B can only lift it.', highlight: ['nvz:far'], players: [P('A', 'near', 'right', 'A1'), P('A', 'near', 'left', 'A2'), P('B', 'far', 'right', 'B1', atLine), P('B', 'far', 'left', 'B2', atLine)], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchen'], bounces: [1, 2, 3], step: 3 } },
      { caption: 'Team A moves up to the net and wins the rally: it counts 2 points.', highlight: ['nvz:far'], players: [P('A', 'near', 'right', 'A1', atLine), P('A', 'near', 'left', 'A2', atLine), P('B', 'far', 'right', 'B1', atLine), P('B', 'far', 'left', 'B2', atLine)], ball: { path: ['near:right:behind', 'far:right:mid', 'near:right:mid', 'far:left:kitchen'], bounces: [1, 2, 3], step: 3 } },
    ],
    tip: 'Gets everyone practising the third-shot drop instead of only driving. Scores climb faster, so play to 15.',
  },
  {
    id: 'relay',
    name: 'Relay',
    en: 'Relay',
    group: 'Just for fun',
    players: '8 to 16 players in two teams',
    tagline: 'Each team sends pairs on in turn, all playing one game to 21.',
    rules: [
      'Split into two teams of 4 to 8 and set the order of pairs in advance.',
      'Each team sends its first pair on to play one long rally-scoring game to 21.',
      'When the combined score hits a multiple of 4 (4, 8, 12…), both teams send on their next pair. The score carries on.',
      'After the last pair, start again from the first. First team to 21 wins.',
    ],
    scoring: 'Rally scoring to 21, win by 2 (if time is short, first to 21 wins).',
    scenes: [
      { caption: 'Two teams of 4. Each sends its first pair on; the rest wait at the side.', players: [P('A', 'near', 'right', 'A1', serve), P('A', 'near', 'left', 'A2'), P('B', 'far', 'right', 'B1'), P('B', 'far', 'left', 'B2'), wait('A', 0, 'A3'), wait('A', 1, 'A4'), wait('B', 2, 'B3'), wait('B', 3, 'B4')] },
      { caption: 'Score 3:1 makes 4 in total, so both teams send on their next pair. The score carries on, no reset.', players: [P('A', 'near', 'right', 'A3', serve), P('A', 'near', 'left', 'A4'), P('B', 'far', 'right', 'B3'), P('B', 'far', 'left', 'B4'), wait('A', 0, 'A1'), wait('A', 1, 'A2'), wait('B', 2, 'B1'), wait('B', 3, 'B2')] },
      { caption: 'After a full round, start again from the first pair. First team to 21 wins; the rest cheer from the side.', players: [P('A', 'near', 'right', 'A1'), P('A', 'near', 'left', 'A2'), P('B', 'far', 'right', 'B1', serve), P('B', 'far', 'left', 'B2'), wait('A', 0, 'A3'), wait('A', 1, 'A4'), wait('B', 2, 'B3'), wait('B', 3, 'B4')] },
    ],
    tip: 'On the scoreboard pick rally scoring to 21. Check whether the big score adds up to a multiple of 4 to know when to swap.',
  },
  {
    id: 'around',
    name: 'Around the world',
    en: 'Around the World',
    group: 'Just for fun',
    players: '6+ players, the more the merrier',
    tagline: 'Hit once, then run to the other line. Miss and you\'re out.',
    rules: [
      'Split into two lines, one at each end, behind the baseline.',
      'The first player serves, then runs straight to the back of the line on the other side.',
      'The front player on the other side hits it back, then runs to the other side too. One shot per turn.',
      'Miss, hit it out or hit the net and you\'re out. With two left, play one point to decide.',
    ],
    scoring: 'No score. Last player standing wins.',
    scenes: [
      { caption: 'Two lines, one at each end. A serves, then runs to the back of the other line.', players: [P('A', 'near', 'right', 'A', serve), P('B', 'far', 'right', 'B'), queueFar('B', 0, 'C'), queueFar('B', 1, 'D'), queueNear('A', 0, 'E'), queueNear('A', 1, 'F')], ball: { path: ['near:right:behind', 'far:right:mid'], bounces: [1] } },
      { caption: 'B hits it back and runs to the other side too. E takes the next ball; one shot each.', players: [P('A', 'near', 'right', 'E'), P('B', 'far', 'right', 'B'), queueFar('B', 0, 'C'), queueFar('B', 1, 'D'), queueFar('B', 2, 'A'), queueNear('A', 0, 'F')], ball: { path: ['far:right:mid', 'near:right:mid'], bounces: [1] } },
      { caption: 'Miss, hit it out or hit the net and you\'re out: go cheer from the side. With two left, play one point to decide.', players: [P('A', 'near', 'right', 'F'), P('B', 'far', 'right', 'C'), queueFar('B', 0, 'D'), queueNear('A', 0, 'B'), out('E')], ball: { path: ['far:right:mid', 'near:left:behind'] } },
    ],
    tip: 'With a big group, give everyone three lives: out three times and you\'re done. Everyone plays longer.',
  },
  {
    id: 'scotch',
    name: 'Scotch doubles',
    en: 'Scotch Doubles',
    group: 'Just for fun',
    players: '4 players',
    tagline: 'Partners must take turns hitting. No one hits twice in a row.',
    rules: [
      'Normal doubles rules with one addition: partners must alternate shots.',
      'The serve counts as a shot, so the third shot is always the server\'s partner\'s.',
      'Same for the receiving team: after the returner hits, the next shot is their partner\'s.',
      'If one player hits twice in a row, their team loses the rally.',
    ],
    scoring: 'Normal scoring, side-out or rally.',
    scenes: [
      { caption: 'A1 serves, B1 returns.', players: [P('A', 'near', 'right', 'A1', serve), P('A', 'near', 'left', 'A2'), P('B', 'far', 'right', 'B1'), P('B', 'far', 'left', 'B2')], ball: { path: ['near:right:behind', 'far:right:mid', 'near:left:mid', 'far:left:mid'], bounces: [1, 2], step: 1 } },
      { caption: 'Back to Team A: A1 just served, so A2 must hit this one.', players: [P('A', 'near', 'right', 'A1'), P('A', 'near', 'left', 'A2'), P('B', 'far', 'right', 'B1'), P('B', 'far', 'left', 'B2')], ball: { path: ['near:right:behind', 'far:right:mid', 'near:left:mid', 'far:left:mid'], bounces: [1, 2], step: 2 } },
      { caption: 'Over to Team B: B1 just returned the serve, so B2 hits this one. Wrong player and you lose the rally.', players: [P('A', 'near', 'right', 'A1'), P('A', 'near', 'left', 'A2'), P('B', 'far', 'right', 'B1'), P('B', 'far', 'left', 'B2')], ball: { path: ['near:right:behind', 'far:right:mid', 'near:left:mid', 'far:left:mid'], bounces: [1, 2], step: 3 } },
    ],
    tip: 'Start slow. Once you get used to it, knowing who hits next and where to stand matters more than hitting hard.',
  },
].map(f => ({ ...f, official: false }));
