// UI copy for the rules index, single rule pages and fun format pages.
export const RULES_INDEX = {
  title: 'Learn the rules',
  intro: 'Pick a rule and see it on the court. Every rule has its own link you can send to friends.',
  more: 'More',
  moreEn: '',
};

// Toggles at the top of the rules index: play × scoring, four combinations.
export const FILTER = {
  play: { label: 'Play', options: [{ id: 'doubles', label: 'Doubles' }, { id: 'singles', label: 'Singles' }] },
  scoring: { label: 'Scoring', options: [{ id: 'sideout', label: 'Side-out', en: '' }, { id: 'rally', label: 'Rally', en: '' }] },
  applies: 'Applies to',
  both: { play: 'Singles & doubles', scoring: 'Both scoring types' },
  showing: 'Showing: ',
  // Hint bubble the first time the toggle bar appears (shown once).
  hint: 'Tap here to switch singles / doubles and scoring',
  // After switching, this rule does not apply and has no counterpart: back to the index.
  backToIndex: 'This rule doesn\'t apply to {combo}. Back to the index.',
};

// Scoreboard mode picker: play reuses FILTER.play, scoring is FILTER.scoring plus "Quick".
// hints is one line shown after picking.
export const SCORE_SETUP = {
  mode: 'Mode',
  fun: { id: 'fun', label: 'Quick' },
  // Shown at the top while scoring so nobody mixes up which system an old game uses.
  playing: '{play} · {scoring} · to {target}',
  // Confirm before resetting (only after at least one rally, before the game ends).
  resetConfirm: { title: 'Reset this game?', body: 'The score and serve history will be cleared and you go back to setup.', yes: 'Reset', no: 'Keep playing' },
  // Came from a rule page's "Try it on the scoreboard", but a game is still in progress.
  busy: 'A game is still in progress. Finish it or reset before switching mode.',
  fullscreen: 'Full screen',
  exitFullscreen: 'Exit full screen',
  // Small line under the big score when the next rally can end the game.
  gamePoint: 'Game point: {team}',
  gamePointBoth: 'Game point: both teams',
  hints: {
    'sideout-doubles': 'Side-out: only the serving team scores. Two servers, call three numbers.',
    'sideout-singles': 'Side-out: only the server scores. Even score serve from the right, odd from the left.',
    'rally-doubles': 'Rally: every rally scores. After a side-out, line up by your score; the player on the right serves.',
    'rally-singles': 'Rally: every rally scores. Even score serve from the right, odd from the left.',
    fun: 'Quick: score only, no serve or positions.',
  },
};

// Share a score / results as an image (IG story, post). Photos are drawn on the phone only, never uploaded. {n} is a number.
export const SCORE_SHARE = {
  open: 'Share to IG',
  openStats: 'Share today\'s results to IG',
  openReport: 'Share my stats to IG',
  // My stats report image. {n} games, {m} month, {won} / {lost} wins and losses.
  report: {
    week: '{n} {n|game|games} this week',
    month: '{n} {n|game|games} this month',
    all: '{n} {n|game|games} in total',
    monthName: 'Month {m}',
    allTime: 'All time',
    rate: 'Win rate',
    streak: 'Longest win streak',
    best: 'Best partner',
    most: 'Most frequent partner',
    record: 'Record',
    toughest: 'Toughest opponent',
    wl: '{won}W {lost}L',
  },
  // Text on the small button next to today's results (after the camera icon).
  ig: 'IG',
  title: 'Share to IG',
  tabs: { image: 'Image', sticker: 'Sticker' },
  formats: { story: 'Story 9:16', post: 'Post 4:5' },
  takePhoto: 'Take photo',
  pickPhoto: 'Pick photo',
  removePhoto: 'Remove photo',
  // Size of the score bar / results table, and the drag hint.
  sizes: { s: 'S', m: 'M', l: 'L' },
  dragHint: 'Drag on the preview to move it',
  share: 'Share',
  save: 'Save image',
  copySticker: 'Copy sticker',
  saveSticker: 'Save sticker',
  close: 'Close',
  hint: 'Tap "Share" and pick Instagram to post a story or post (LINE and WhatsApp work too). Your photo stays on this phone and is never uploaded.',
  stickerHint: 'After copying, open an IG story, long-press the photo and choose "Paste". You can drag, resize and rotate the sticker. If pasting fails, tap "Save sticker" and add it from your gallery.',
  saved: 'Image saved',
  copied: 'Sticker copied. Paste it in your IG story.',
  copyFailed: 'Can\'t copy images here. Tap "Save sticker" instead.',
  photoFailed: 'Couldn\'t read this photo. Try another one.',
  preview: 'Share image preview',
  brand: 'picobo.',
  brandZh: '',
  // Every image carries the URL so people know where to find it.
  url: 'picobo.net',
  played: 'P',
  won: 'W',
  people: '{n} {n|player|players}',
  play: { doubles: 'Doubles', singles: 'Singles' },
  scoring: { sideout: 'Side-out', rally: 'Rally', fun: 'Quick' },
  file: 'picobo',
};

// Share this page. url is the live site; sharing from the artifact uses it too.
export const SHARE = {
  url: 'https://picobo.net/',
  label: 'Share',
  aria: 'Share this page',
  copied: 'Link copied',
  manual: 'Copy this link to share:',
};

// Draw: the list is empty on first use; this line says how to start.
export const DRAW_EMPTY = 'No players yet. Type names, or paste a sign-up list from your group chat.';

// Draw: paste a group chat sign-up list and read the names. {n} count, {title} which session.
export const DRAW_PASTE = {
  open: 'Paste a sign-up list to read names',
  hint: 'Paste the whole sign-up message from your chat, e.g. "1. Amy & Ben". A pair is split into two names.',
  placeholder: '9/5 (Sat) 5-7pm\n1. Amy & Ben\n2. Chris',
  read: 'Read names',
  pick: 'This list has several sessions. Which one?',
  session: '{title} ({n} {n|player|players})',
  untitled: 'List',
  none: 'No names found. The list needs one numbered name per line, like "1. Name".',
  added: 'Added {n} {n|player|players}',
};

// Saved groups: save a regular crowd's list and load it into Draw or Sign-up in one tap. {name} group name.
export const GROUPS = {
  label: 'Saved groups',
  add: '+ Save as group',
  sheetTitle: 'Save as group',
  sheetHint: 'Save the current list and load it in one tap next time. A group with the same name gets updated.',
  namePlaceholder: 'e.g. Saturday Kallang group',
  save: 'Save',
  cancel: 'Cancel',
  saved: '"{name}" saved',
  manage: 'Saved groups',
  remove: 'Delete',
  removed: '"{name}" deleted',
  emptyName: 'Give the group a name.',
  emptyRoster: 'The list is empty. Add some players first.',
  full: 'You can save up to 20 groups. Delete some first.',
  replace: 'Switch to the "{name}" list? The current list and draw progress will be cleared.',
  loaded: 'Loaded "{name}"',
};

// Player list: tap a name to rename it (misread from a pasted list, or a name everyone knows).
export const DRAW_RENAME = {
  hint: 'Tap a name to rename, tap × to remove.',
  title: 'Rename',
  save: 'Save',
  cancel: 'Cancel',
  duplicate: 'That name is already on the list.',
  empty: 'Name can\'t be empty.',
};

// Random draw and King of the court: tap a name to swap places with someone (on court or in the queue).
export const DRAW_SWAP = {
  hint: 'Tap a name to swap places with someone.',
  title: 'Swap {name} with?',
  note: 'The two swap places. Records stay the same.',
  queue: 'In queue',
  court: 'On court {court}',
  cancel: 'Cancel',
  none: 'Nobody to swap with right now.',
  done: '{a} and {b} swapped',
};

// Random draw mixed doubles: when on, gender shows before names; tap to cycle (unset → ♂ → ♀).
export const DRAW_MIX = {
  toggle: 'Mixed doubles',
  // Small note next to the checkbox.
  note: '(tap ? on a name to set gender)',
  hint: 'Tap ? to set gender (♂, ♀). Unset players can pair with anyone.',
  symbols: { '': '?', m: '♂︎', f: '♀︎' },
  labels: { '': 'Gender not set', m: 'Male', f: 'Female' },
  tag: '{name}: {label}, tap to change',
  notMixed: 'Not a mixed game',
};

// Draw ↔ scoreboard: the score icon by the court number takes names to the scoreboard; afterwards, back to Draw to record the result.
export const DRAW_SCORE = {
  open: 'Score court {court} on the scoreboard',
  from: 'From Draw: court {court}',
  back: 'Back to Draw, record {names} won',
  recorded: 'Court {court} recorded. Next group up.',
  gone: 'This game already changed or ended in Draw. Record it there by hand.',
  busy: { title: 'A game is still in progress', body: 'Switch to court {court}? The current score will be cleared.', yes: 'Switch', no: 'Cancel' },
};

// Random draw (queue and rotate). {court} is the court number.
export const OPEN_PLAY = {
  start: 'Start draw',
  redraw: 'Redraw',
  hint: 'Everyone lines up; the first four play. When a game ends, tap the winning team. Those four go to the back of the queue, partners split, and the next four play, so everyone plays about the same number of games. Redraw shuffles the queue, fewest games first, and keeps the records.',
  won: 'Won',
  idle: 'Court {court}: not enough players, resting',
  queue: 'In queue',
  queueHint: ' (first four play next)',
  queueEmpty: 'Nobody in the queue',
  leaving: 'Leaving after this game:',
  stats: 'Results',
  cols: ['Player', 'P', 'W'],
  clear: 'Clear today\'s results',
  clearConfirm: 'Clear today\'s results? Everyone\'s games and wins reset to zero. The list, courts and queue stay. Games already saved to "My stats" are kept.',
  cleared: 'Today\'s results cleared',
};

// Light / dark toggle at top right. The label says what tapping it switches to.
export const THEME = {
  toDark: 'Switch to dark',
  toLight: 'Switch to light',
};

// Share current state: turn the scoreboard, Draw or Pico Bowl organizer state into a link
// someone else can pick up. Like the normal share, it shows an explainer first.
export const HANDOFF = {
  aria: 'Share current state so someone can take over',
  titles: { score: 'Picobo scoreboard', draw: 'Picobo draw', tourney: 'Pico Bowl organizer' },
  sheet: {
    score: { title: 'Share this game', body: 'Whoever opens the link sees the current score, who serves and where everyone stands, and can keep scoring. Good for handing over the scoring or for people watching.' },
    draw: { title: 'Share the draw', body: 'Whoever opens the link gets the same player list, queue and records, and can keep running it. Good for handing over the courts.' },
    tourney: { title: 'Share organizer progress', body: 'Whoever opens the link gets all teams, the schedule and scores, and can take over as organizer.' },
  },
  // Draw's share button offers both: today's results to the players, or the
  // whole draw to the next organizer.
  choose: {
    title: 'Share',
    games: { title: 'Send results to players', body: 'Post today\'s finished games to the group chat. Players who open it get them added to their own "My stats".', go: 'Send to players' },
    handoff: { title: 'Hand over to the next organizer', body: 'Whoever opens the link gets the same list, queue and records, and can keep running it.' },
  },
  note: 'The link is a snapshot of right now; it does not sync. After handing over, stop scoring on this phone.',
  go: 'Share link',
  cancel: 'Cancel',
  kinds: { score: 'game', draw: 'draw list and records', tourney: 'Pico Bowl schedule and scores' },
  confirm: 'This link carries someone else\'s {kind}. Replace the {kind} on this phone?',
  loaded: 'Taken over. Carry on from here; the other phone should stop scoring.',
  broken: 'This share link doesn\'t work. Ask them to share it again.',
};

// Court scene carousel. {n} in step is the step number.
export const SCENE_NAV = {
  prev: 'Previous step',
  next: 'Next step',
  step: 'Step {n}',
};

// Collapsible rules contents on the left.
export const DRAWER = {
  open: 'Contents',
  title: 'Rules contents',
  close: 'Close contents',
  home: 'Rules index',
};

export const RULE_PAGE = {
  prev: 'Previous',
  next: 'Next',
  // At the bottom of each scoring page: open the scoreboard with the same play and scoring.
  tryScore: 'Try it on the scoreboard',
};

// Pages in the contents that are not a single rule.
export const EXTRA_PAGES = {
  compare: { summary: 'How the two scoring systems differ, in one table.' },
  faq: { title: 'Common misconceptions', en: '', summary: 'Who serves first in doubles, is a line ball in: the arguments you hear most on court.' },
  glossary: { title: 'Glossary', en: '', summary: 'Dink, side-out, ATP and other terms explained.', intro: 'The words you will hear on court, in plain English.' },
};

export const FORMATS_PAGE = {
  title: 'Fun formats',
  en: '',
  note: 'Varies by club. Not official rules.',
  unofficial: 'Varies by club',
  // Toggle bar on format pages: short names by purpose (keys are formats.js group), tap to jump to that group's first format.
  groupLabel: 'By purpose',
  groupShort: { 'Many players, few courts': 'Crowded', 'Short of players': 'Few players', 'Skill practice': 'Practice', 'Just for fun': 'Fun' },
  scoring: 'Scoring: ',
};

// Scoreboard copy. Team A / Team B, default names A1, B2… (record.js recognizes these default names;
// games with default names are not saved to My stats). {n}, {team}, {name}, {pos}, {names}, {a}, {b} are filled in.
export const SCORE_TEXT = {
  title: 'Scoreboard',
  intro: 'Tap who won the rally. Positions, side-outs and the score call are worked out for you.',
  teams: { A: 'Team A', B: 'Team B' },
  placeholders: { A: ['A1', 'A2'], B: ['B1', 'B2'] },
  player: 'Player {n}',
  target: 'Play to',
  points: '{n} points',
  winBy: 'Win by',
  winBy2: 'Win by 2',
  winBy1: 'Win by 1',
  first: 'Who serves first',
  flip: 'Flip a coin',
  flipped: 'Coin says: {team} serves first',
  deciding: 'Deciding game (remind to switch ends at halfway)',
  quickHint: '{mode}, {names}',
  custom: 'Change settings first (optional)',
  start: 'Start scoring',
  alt: 'Current positions and server',
  fun: 'Quick mode, score only',
  pos: { right: 'right', left: 'left' },
  serverN: 'Server {n}, ',
  serving: '{team} serves: {n}{name} from the {pos}',
  switchSides: 'Halfway. Switch ends; the server stays the same.',
  switched: 'Ends switched',
  won: '{team} wins 🎉 {a}-{b}',
  rallyWon: '{names} won',
  undo: 'Undo',
  again: 'Play again',
  reset: 'Reset',
};

// Other copy on the Draw page. {n}, {court}, {name}, {round}, {names} are filled in.
export const DRAW_TEXT = {
  // 場上先發球那一隊名字下的小標籤。
  servesFirst: 'Serves first',
  title: 'Draw & rotation',
  intro: 'Enter today\'s players, then pick how to split them.',
  roster: 'Today\'s players',
  people: '{n} {n|player|players}',
  remove: 'Remove {name}',
  namePlaceholder: 'Enter a name',
  add: 'Add',
  clear: 'Clear',
  subs: { draw: 'Random draw', rr: 'Round robin', koc: 'King of the court' },
  courts: 'Courts',
  court: 'Court {court}',
  vs: 'vs',
  rounds: 'Rounds',
  makeRounds: 'Make rounds',
  rrHint: 'New partners each round, with as few repeats as possible. If there are more players than spots, people take turns sitting out.',
  round: 'Round {round}',
  resting: 'Sitting out: {names}',
  listSep: ', ',
  streakMax: 'Max wins in a row',
  kocStart: 'Start',
  kocRestart: 'Restart',
  kocHint: 'Winners stay, losers go to the back of the queue. Winners also come off after hitting the win limit.',
  streak: 'Staying team has won {n} in a row',
  kocQueueHint: ' (first two play next)',
  atLeast: 'Need at least {n} players.',
};

// Tabs (top and phone bottom bar), footer, court diagram labels and a few odd bits.
export const APP_TEXT = {
  // 網路慢時有些檔案先用了舊版，新版到了就提示重新整理。
  updated: 'New version ready. Tap to reload',
  // 同一隊兩個人名字之間。
  and: ' & ',
  // 頂部的站名和瀏覽器分頁標題（英文版不放中文名）。
  brand: 'Picobo',
  tabsLabel: 'Main menu',
  tabs: { home: 'Home', rules: 'Rules', score: 'Score', draw: 'Draw', venues: 'Meetup' },
  footer: 'Official rules follow the {rulebook}. Fun formats vary by club; agree on them before you play.',
  moreDetail: 'More details',
  people: '{n} {n|player|players}',
  court: { zone: 'Kitchen (non-volley zone)', zoneShort: 'Kitchen', alt: 'Pickleball court diagram' },
  standing: '{rank}. {team}  {won}W {lost}L {diff}',
  division: '[{name}]',
};
