# Handoff — read this first when resuming

Last updated: 2026-10-03, branch `ccr-7b6d14a5-myo5fh` (also pushed to `main`,
which is live at https://picobo.net). The latest commit is on both; the
working tree was clean at hand-over. A new session gets its own branch name:
work there and fast-forward `main` the same way.

## How the user works (keep doing this)

- The user writes in zh-TW (sometimes English). Reply in the user's language;
  site copy is always zh-TW (see CLAUDE.md style guide).
- Most feedback arrives as **comments on the claude.ai artifact**. A comment
  shows up as a queued notification: call ReadNotifications, then
  ArtifactComments `read` with the thread id, do the work, then `reply` (in
  zh-TW, saying what changed) and `resolve` the thread. If the comment is a
  question or a proposal is needed, reply and leave the thread open.
- Every change ships the same way: `node --test` green, Playwright layout check
  (360 / 390 / 1280, light and dark, no horizontal overflow, screenshots for
  visual changes), commit on the session branch with the required trailers,
  `git push origin <branch>` AND `git push origin <branch>:main` (the user has
  authorized fast-forwarding `main`; that deploys picobo.net), then republish
  the artifact with only the changed files in `files`. When the artifact
  refuses a publish because a file "was not read", read it with Artifact
  `read` + `path` (check it matches the previous commit), then publish again.
- "deploy" from the user means: make sure `main` has the latest commit and the
  live site serves it (fetch a changed file from picobo.net to confirm).
- For design or scope questions give a short recommendation and ask; for small
  clear asks just do it. The user likes concise answers and dislikes clutter on
  screen (prefer icons over extra buttons, fewer bars).
- Things the user decided against: custom name-suggestion dropdown (reverted;
  the browser's own autofill is enough), "交接" wording (use plain 分享), the
  install card on the home page, deuce/advantage wording (use Game Point).

## Open items

- Share to IG (src/ui/sharecard.js) is built but **not yet tried on a real
  phone**: 分享 → Instagram Story/post, 📷 拍照 (camera via
  capture=environment), drag + 小／中／大 on the preview, and the 貼紙 tab
  (複製貼紙 → paste in an IG story). The claude.ai preview cannot do share
  sheet / clipboard images / camera; test on picobo.net in Safari or Chrome.
  Wait for the user's report and fix what fails.
- Optional 戰績 picture title was offered (今日球場戰報 / 誰是今天的 carry /
  本日 MVP：<name> / 今天誰最兇); the user has not picked one, so there is none.
- Home 找場地 card: added 「還能快速揪團」 to the description; the user may
  instead want the title changed (e.g. 找場地・揪團) — asked, not answered.
- 國王球場 has no 混雙 option yet (抽籤分組 has it).
- Old remote branch `ccr-e7df49dc-8t69j2` only holds a "Create CNAME" commit
  whose content is already on `main`; safe to delete, left in place.

- Pico Bowl: date (November), venue, hours, Google Form link still TBD; the
  home card stays "Coming soon" until `PICOBOWL.open = true` in
  `src/data/event.js`. Organizer tool lives at picobo.net/#picobowl/manage.
- Slogan alternative ("pick a wine" / "pick a partner") parked by the user.
- GitHub repo is now private (user upgraded to GitHub Enterprise); Pages still
  serves picobo.net over https with a valid certificate.
- The artifact preview cannot install the app or use the real Fullscreen API
  (iframe); the in-page full-screen fallback works there.

## Roadmap (user, 2026-10-03)

- Market: start with Taiwanese players in Singapore; later expand to Taiwan
  and add English.
- Phase 1 design draft: docs/PHASE1.md (waiting for the user's answers).
- Phase 1 features (goal: stickiness, so people open Picobo every time they
  play). Not started; propose a design and ask before building each:
  1. 個人戰績本: every game from the scoreboard and 抽籤 is recorded
     automatically; show win rate, most frequent partner, longest win streak.
  2. 本週／本月戰報圖: a share picture like 「這週打了 14 場、勝率 64%、
     最佳拍檔 Amy」 (reuse src/ui/sharecard.js).
  3. 常用球團: save a regular group's roster; one tap fills it into 抽籤,
     報名訊息 and 揪團.
  4. 固定場次範本: e.g. 「每週六 5-7pm @ 某場地」; one tap makes this
     week's 報名訊息.
  Open question for 1 and 2: whose record it is — the phone owner picks
  "this is me" among roster names (all local, localStorage, no accounts).
- Decided against for now: court-fee splitting (friends already settle it in
  the chat sign-up list), rules quiz, and situation / ruling lookup
  (情境查判). Keep the ideas on file, do not build them.

## Where things stand

v1 is built, tested and pushed. `docs/PLAN.md` is the approved plan; the
code follows it except where noted under "Decisions" below.

| Area | State |
|---|---|
| Repo scaffold, `CLAUDE.md` | done |
| `src/court.js` shared SVG court | done |
| Rules content (`src/data/rules.js`, 31 scenes) | done, zh-TW copy reviewed once |
| Fun formats ×11, glossary ×16, misconceptions ×8 | done |
| Tests (`node --test`) | 62, all green: scoring + oracle, draw + open play + mixed doubles, tournament, handoff, signup parser, sharecard, sw precache list |
| Rules view with step carousel, scoreboard view, draw view | done |
| Layout check at 390px and 1280px, light and dark | done, no overflow |
| Artifact | https://claude.ai/artifact/W4LaC8XBDpJiVMLHmdeVKD, kept in step with `main` |

Run locally: `python3 -m http.server 8080`, tests: `node --test`.

## Artifact

Current artifact (new account, published 2026-09-30 with style C):
https://claude.ai/artifact/W4LaC8XBDpJiVMLHmdeVKD. Republish to this URL;
the old v1 artifact (PJXBm8ZHFXikZ4WEiVYEcM) belongs to the previous account
and is no longer updated.

The artifact serves the ES modules fine (the user uses it daily for review).

## Decisions made with the user (do not re-litigate)

- Stack: plain HTML/CSS/JS ES modules, no build, no deps, no backend.
- v1 tools: scoreboard, draw + rotation, visual rule teaching. Deferred:
  serve-position lookup widget, rules quiz, GitHub Pages workflow, English.
- Fun formats: all six kept.
- Rally scoring: one version, the USA Pickleball provisional rule (2025,
  continued 2026). MLP's freeze rule is history only (MLP doubles went back to
  side-out scoring in 2026), mentioned in one collapsed card.
- Rule presentation: steps within a rule are a horizontal swipe carousel with
  the court fixed above; rules scroll vertically with anchors.

## Rule facts verified by web search (2026-09-30)

- Doubles: the first serve of each side-out is from the right/even court by
  the player standing there (USA Pickleball rules summary, rule 4.B.6). There
  is no fixed first server. The user asked about this specifically and the
  first draft answer was wrong; the content and the engine now follow 4.B.6.
- 2026 rulebook: volley serve (upward arc, contact below waist, paddle head
  below wrist) must be "clearly" legal; drop serve unchanged except no finger
  spin on release; in rally scoring either team can score the winning point;
  rally scoring stays provisional through 2026.
- Deciding game: change ends when the first team reaches 6 (11-pt), 8
  (15-pt), 11 (21-pt).
- MLP 2026: doubles side-out to 11; rally scoring only in the singles
  DreamBreaker to 21, no freeze.

Verified 2026-10-01 against the 2026 rulebook PDF itself (rule 14, rally
scoring, 14.A.1 to 14.A.5): 14.A.3 score is two numbers; 14.A.4 after a
side-out, service begins with the player correctly positioned on the right
according to the team's score. The engine and copy had the hand-over server
serving from the left at odd scores; fixed. Section 14 has no rule limiting
who can win the last point. USA Pickleball's rally-scoring blog page still
says the game must be won on serve; that page reads like the 2025 wording and
the rulebook was taken as the source.

Direct fetches of usapickleball.org were blocked by the sandbox network
policy; only search summaries were available. Rule numbers other than 4.B.6
are cited at section level in the copy for that reason.

## Design style (decided: C 新粗野, applied)

The user asked: 「設計風格，你可以先上網搜尋最流行的幾個 style guideline，然後給我幾個
mockup 讓我挑選」

Done 2026-09-30: web search of 2026 UI trends (Liquid Glass in iOS 26,
Material 3 Expressive, neubrutalism / structural UI, bento grids; thumb-zone
bottom navigation as the common pattern). Four directions, each drawn as a
390×844 phone mockup of the 學規則 card (kitchen rule, step 2) and the
scoreboard (4-2-1), on a design canvas:
https://claude.ai/artifact/F9LVrRNbXu3Mhq1zNmU8WD

| | Style | Look | Fonts |
|---|---|---|---|
| A | 液態玻璃 Liquid Glass | frosted panels over court blue, floating bottom tab bar | system / Noto Sans TC, ui-rounded numerals |
| B | 表現派 Material 3 Expressive | warm cream, lime tonal chips, mixed big radii, green court | Lexend + Noto Sans TC |
| C | 新粗野 Neubrutalism | cream, 3px black borders, hard offset shadows, ball-yellow | Space Grotesk + Noto Sans TC |
| D | 夜場便當格 Bento, dark | near-black tiles, neon ball-yellow LED numerals | Chakra Petch + Noto Sans TC |

Court images in the mockups were generated from `src/court.js` itself, so the
geometry is the real one.

The user picked **C 新粗野**. Applied in `styles/main.css` (tokens at the top:
cream paper, 3px ink borders `--bw`, hard offset shadows `--shadow`,
ball-yellow `--mark` for the current tab / chip / step, blue `--accent` for
primary actions) and `index.html` (Noto Sans TC 500/700/900 + Space Grotesk
700). Dark mode swaps ink to cream and the shadow colour to ball-yellow.
Layout check passed at 360, 390 and 1280 px, light and dark, all three tabs,
no horizontal overflow. Google Fonts are blocked in the sandbox, so the
screenshots used the system fallbacks; the real faces are still unseen.

## Navigation (2026-09-30)

The rules tab was one 16,800 px page on a phone. Now:

- (Superseded below: tabs are now 首頁／規則／計分／抽籤, formats live under
  規則.)
- #rules is an index (grouped by section, one tappable row per rule, plus
  the compare table, 常見誤解 and 術語表). Each opens its own page,
  #rules/<id>, with 目錄 back link and 上一條／下一條 at the bottom.
- v1 links #rules-<id> are rewritten to #rules/<id> (#rules-formats to
  #formats). Unknown ids fall back to the index.
- A sticky bar on top of every rules page holds the 目錄 button (opens a
  left drawer, `<dialog>`, listing every rules page with the current one
  highlighted) and shows where the reader is (section / page). It replaced a
  floating button that overlapped content once the bottom nav existed.
- The top bar hides while scrolling down and comes back on any scroll up
  (`src/ui/topbar.js`); the rules bar then moves up to the top.
- 玩法: one page per format (#formats/<id>), rendered inside the rules view
  (same bar and drawer; listed in the rules index), with court scenes (queue / resting players drawn
  dimmed in the court's right margin), marked 各球場做法不同.
- Rules are grouped 球場與線 / 側出計分 / 每球得分 / 共通規則 / 更多 (the filter shows one scoring section). Two
  toggles at the top of #rules (雙打｜單打, 側出計分｜每球得分) filter the
  index, the drawer and prev/next; the choice is kept in localStorage
  (`picobo.rulesFilter`). Data: section `scoring` and rule `play` fields.
  Each rule page shows 適用：<play>｜<scoring>.
- Home (#home, the default route): slogan "Pick a day, pick a place, picobo." (was "Pick one, …"),
  a hero court from court.js, entry cards to
  rules / score / draw. The slogan hints at future social play, court
  matching and events; the user wants that kept unsaid for now.
- Main navigation is 首頁／規則／計分／抽籤: header tabs on desktop, a fixed
  bottom bar with icons on phones (< 768px). Fun formats moved under the
  rules tab (a 趣味玩法 group in the rules index and drawer); bare #formats
  redirects to #rules.
- Scoreboard modes: play (雙打｜單打) × scoring (Side-out｜Rally｜快打), five
  engine modes including rally-singles. The picker defaults to the rules
  filter when one is saved.
- On the rules index the sticky bar shows the section currently under it.
- On phones (< 768px) rule and format scenes draw the court lying down
  (`renderCourt(..., { landscape: true })`): near side on the left, labels
  upright, bigger players, off-court queue under the court left to right. A
  whole step (court, caption, buttons) now fits on one screen. Desktop and
  the home hero stay upright.
- The scoreboard does the same on phones: the court lies down between the call
  and the score buttons, so the whole board fits on one screen and each team's
  button sits over its half. After the side switch the buttons swap with the
  court (`.score-row.switched`). Desktop keeps the upright court under the
  buttons.
- Scoreboard during a game (`#view-score.score-playing`): on phones the top bar
  and page title fold away; the screen is kept on with the Wake Lock API; a
  全螢幕 button shows where the Fullscreen API is allowed (not iPhone Safari,
  not inside the artifact iframe), as a corner icon on the board. Where the
  API is not available the icon still shows and switches the same layout on
  inside the page (no browser full screen); Esc, the icon or leaving the page
  turns it off. In full
  screen (`html.is-fullscreen`) only the board shows: bars, title and footer go,
  the court lies down on every screen size and the score buttons take the rest
  of the height. A game-point tag (`gamePoint()` in
  scoring.js) sits on the call box.
- 抽籤分組 is now open play (`createOpenPlay` / `finishOpenPlayGame` /
  `joinOpenPlay` / `leaveOpenPlay` in draw.js): one queue of players, the first
  four take a free court, finished players re-queue winner/loser/winner/loser
  so partners split, played/won counts per player. Saved as `picobo.openplay`.
  Adding or removing a roster name joins or leaves the session (a player on
  court leaves after that game). Court count defaults to 1.
- Phones under the 規則 tab (rules index, rule pages, fun formats) and the 抽籤
  tab drop the top bar entirely (`html[data-tab="rules"]`, set by the router); the 目錄 bar
  sits at the top and the bottom bar handles navigation.
- Pico Bowl (tournament, November 2026, date TBD): page at `#picobowl`
  (`src/ui/event.js`, copy in `src/data/event.js`), marked 草案. The home card
  shows Coming soon and is not a link while `PICOBOWL.open` is false; the URL
  works regardless. Decided so far: 2 courts; men's / women's / mixed doubles
  (about 7 / 5 / 10 teams); a player may enter men's or women's plus mixed;
  morning MD + WD, afternoon XD; rally scoring, pools to 15, semis and final to
  21, win by 2. Up to 6 teams one pool and a final; 7+ teams pools of 3-4, four
  qualifiers to semis (pool winners, then best runners-up). Simulated day with
  2 courts: about 5.5 hours of play. Still open: date, venue, hours, Google Form.
- Organizer tool at `#picobowl/manage` (not linked anywhere; give the URL to
  the organizer). Logic in `src/tournament.js` (tested in
  `tests/tournament.test.js`): free courts take the earliest ready match,
  preferring a division with nothing on court, never a player already on
  court; scores fill pool tables and seed semis and final. Stored in
  `picobo.picobowl` on that phone only; "複製戰況" copies a LINE-ready summary.
  Not shared live between phones (no backend).
- Install needs https. `index.html` sends any http visit on picobo.net to
  https://picobo.net first (GitHub Pages also redirects once Enforce HTTPS is on).
- If Chrome shows a red ✕ (Not secure) on picobo.net in normal tabs but not in
  incognito, the phone once clicked through a certificate warning (before the
  Pages certificate existed). Chrome keeps that until it restarts: force stop
  Chrome, reopen https://picobo.net, and install works again.
- Hand-over links: the scoreboard (play screen), 抽籤 (page head) and the Pico
  Bowl organizer screen each have a plain 分享 button; tapping it first opens a
  short sheet saying the other person can carry on from the link, then shares
  `https://picobo.net/#<tool>?s=<state>`. `src/handoff.js` packs the state
  (deflate-raw + base64url where CompressionStream exists, else plain JSON);
  `app.js` loads it into the tool on open, asks before replacing a game in
  progress, and drops the state from the URL. The scoreboard sends the last 10
  rallies so undo still works. A link is a snapshot, not a live sync.
- The top-bar install button turns into a share icon (invite friends to
  picobo.net) once the app runs installed or wherever install is not offered.
- Rules contents drawer opens from a small yellow tab on the left edge,
  low on the left edge, just above the bottom bar (`.drawer-tab`; tap it or drag it right). Not an edge swipe,
  which is the phone's back gesture. The sticky rules bar now holds the
  雙打｜單打 and 側出計分｜每球得分 switches and share (the old location line
  and the filter block on the index are gone). First visit shows a hint
  bubble once (`picobo.filterHintSeen`). Switching on a rule that does not apply to the new combination
  jumps to its singles/doubles twin or the same scoring step, else back to
  the index with a toast.
- Scoring sections share one skeleton (user's pick, option A): rule `step`
  points 怎麼得分 → calling 怎麼喊分 → positions 誰發球、站哪裡, then the
  side-out vs rally table (rally adds 職業賽與凍結 before it). Each step page
  ends with 到計分板試打 → `#score?play=…&scoring=…`, which presets the
  scoreboard setup (toast if a match is in progress). Old ids (scoring,
  rally-basics, rally-singles, scoring-singles) redirect via MOVED.
- Rules with singles fields (singlesScenes / singlesSummary / singlesDetail)
  are split into two pages in `src/ui/rules.js`: doubles `#rules/<id>`,
  singles `#rules/<id>-singles`. Switching play jumps to the twin silently.
  Opening a rule outside the current filter (a shared link) switches the
  bar to match. Old `#rules/singles` lands on `points-singles`.
- Rules page order comes from `toc(f)` in `src/ui/rules.js`; index, drawer
  and prev / next (rules and fun formats alike, one chain) all read it. The
  check used after changes: for each of the four filter combinations, the
  index links, the drawer links, and walking 下一條 and 上一條 end to end
  must give the same list (Playwright, 25 pages per combination today).
- 揪團卡 and 場地名錄 (2026-10-02, the zero-backend first step toward
  matchmaking / booking; plan in the session plan file). #meetup: the host
  fills date, time, place, play, level, how many needed, optional contact
  (LINE ID / WhatsApp); the card shares as picobo.net/#meetup?s=<state>
  (handoff kind `meetup`) with a one-line summary for the chat. Hidden for now (`MEETUP.open: false`: no home card, no 在這裡揪團 on courts) — the user prefers a copy-paste sign-up message after booking (接龍 list), under discussion; #meetup still works by URL. Opening it
  only shows the card (map, .ics calendar file, contact, 我也來揪一團); it
  never replaces anything. Last form saved as `picobo.meetup`. #venues reads
  `src/data/venues.js`: 84 Singapore courts (all found venues, on request: commercial clubs, ActiveSG incl. 19 school halls, onePA CCs, members' clubs, free HDB courts) (the app's first audience is
  Taiwanese players in Singapore), grouped 中區／東區／西區／北區／東北區, Pickle &
  Bones @ TRIFECTA (the user's regular court) first. Sources: venue sites,
  ActiveSG, onePA, TheSmartLocal (2026-06), SassyMama (2026-09); entries with only one or unofficial source say so in their note (資料只有單一或非官方來源). Not listed: Braddell Heights CC (no address found). Prices change; the page says so. A sticky bar filters by search (name or address), region and kind (不怕下雨 = indoor, sheltered or both; 免費); region and kind are kept as `picobo.venueFilter`. A heart top right on each court saves it as a favourite (`picobo.favVenues`, this phone only); kind ♥ 最愛 lists them. Not built yet, needs a backend: accounts, live sign-up
  counts, a public list, booking and payment.
- 報名訊息 (#signup, under the 約球 tab; user's pick over 揪團卡): after
  booking, the host gets the plain-text 接龍 list groups already paste in
  IG / WhatsApp / LINE. Simple English, auto weekday: "🏓 Pickleball",
  "10/10 (Sat) 5-7pm", "📍 <court>", a short map link
  (maps.google.com/?q=Singapore+<postal>, once per court), optional
  "Max N players", numbered names then blank numbers (or numbers up to the
  cap), "via picobo.net". Several sessions in one message. Copy button plus
  share icon (text only). Form kept as `picobo.signup`; old dates roll
  forward to today. Entry: 發報名訊息 on every court card, plus a small text link under the list for courts not in it (condo courts, a friend's club).
- 抽籤 has 貼上群組接龍，自動讀出名字 (a collapsible under the roster): paste the group's
  接龍 list, `parseSignup` (src/signup.js) reads numbered lines into names,
  splitting pairs on & ＆ + , 、 / and 和 跟 and spaces (groups write first names and handles, so "Simone kahyee" is two players; IG mentions shown without the @), dropping "w/ …" and bracketed
  notes; a line with a date like 9/5 starts a session. One session goes
  straight in; several ask which. Names join the roster (or replace the
  example list) and join a running open-play queue.
- 抽籤分組 and 國王球場: every name on court or in the queue is a button;
  tapping it opens a sheet of who to trade places with (queue first, then
  each court; not themself or their partner). `swapPlayers` (src/draw.js)
  swaps any two positions, keeps counts, refuses partners, and drops a
  leaving player who is swapped into the queue. Tested: court↔queue,
  queue↔queue, court↔court, cancel, a game finished after swaps.
- Roster chips: tap the name to rename it (sheet with a text box; empty or
  duplicate names refused). `renamePlayer` (src/draw.js) carries the new
  name through a running open play or king of the court: courts, queue,
  leaving and counts.
- Full screen lives in `src/ui/fullscreen.js` (owner = route: 'score' or
  'draw'; `<html class="is-fullscreen" data-full="…">`; ends on Esc, the
  browser's exit, or leaving that tab). The draw's quiet corner icon sits
  above the courts in 抽籤分組 and 國王球場; full screen hides the roster,
  sub-tabs and controls, leaving courts, queue and the counts.
- Share is an icon only (no 分享 text), top right on every tool: the rules
  bar, the 計分 and 抽籤 headings, Pico Bowl and its organizer screen. During
  a game it sits in the board's top-right corner (hand-over link); full
  screen is a frameless, half see-through icon in the top-left corner.
- Fun formats: 11 in four purpose groups (see CLAUDE.md; regrouped by purpose at the user's pick, no extra filter). Added 2026-10-02 at the
  user's pick: 接力團體賽, 繞場, 蘇格蘭雙打, 截擊大戰, 第三拍挑戰. Not added:
  上下河 (Up and Down the River), 雙球大亂鬥, 非慣用手, 精彩球加分. Off-court
  players with `keepSide: true` stay at their own end when the court lies down
  (繞場's two lines); other queues run left to right under the court.
- Installable web app: `manifest.webmanifest`, `icons/` (PNGs rendered from
  `icons/icon.svg` with Playwright: open the SVG at 192/512/180 px and
  screenshot), `sw.js` (network first with a 3 s timeout, cache fallback; fetches use cache: no-cache so the HTTP cache never serves a stale file;
  precache list checked by `tests/sw.test.js`). A yellow 安裝 button in the
  top bar (no card on the home page): a button where the browser offers a prompt (Chrome, Edge, Android),
  Share > Add to Home Screen steps on iPhone/iPad (File > Add to Dock on Mac
  Safari) in a small dialog; Android without a prompt gets ⋮ > Install app
  steps; LINE / Facebook / Instagram in-app browsers are told to open the page
  in a real browser. Nothing shows once running installed, or on desktop
  browsers without a prompt. A browser tab cannot tell whether the app is
  already installed, so on phones the button stays in the browser.
- Light/dark toggle (`src/ui/theme.js`), top right on phones and after the
  tabs on desktop. Light by default (the system setting is ignored); dark
  only when chosen. The choice is stored as
  `picobo.theme` and applied as `data-theme` on `<html>` by an inline script in
  `index.html` before first paint. Works without storage (this visit only).
- `tests/scoring-oracle.test.js` cross-checks the engine against a separate
  rulebook reference over 300 random games per play x scoring combination
  (calls, server, server's court, positions, scores, game end, undo). It
  fails against the pre-14.A.4 engine, so it does catch real mistakes.
- Page heights at 390 px: index ~2,100, a rule page ~1,350, formats ~3,400.

## Live on picobo.net (2026-09-30)

The user bought picobo.net at Gandi and chose: make the repo public and host
on GitHub Pages (branch `main`, root). Repo side is ready (`CNAME`,
`.nojekyll`, favicon). GitHub Pages deploys `main` (first successful
deploy of `main` at 03b44ef, 07:01 UTC); Gandi apex A records point at GitHub
Pages and the DNS check passed. https now works with a valid certificate and
http redirects to https (checked 2026-10-01). Possibly still open on the
user's side: default branch `main`, apex AAAA records, domain verification TXT. Before that, `picobo.net` pointed at Gandi's
parking IP 217.70.184.38. There was no `main` branch yet; the remote default
branch was the old session branch `ccr-e7df49dc-8t69j2`.
- 抽籤分組 has a 混雙 checkbox (off by default, `picobo.mixed`). While it is
  on, roster chips show a tag before each name (? → ♂ → ♀ per tap), kept per
  name on this phone in `picobo.genders` and carried by the hand-over link.
  `mixTeams` in draw.js splits each court's four into one man + one woman
  per team when the tags allow (untagged players fit anywhere); the queue
  order never changes for it, and a court that cannot be mixed plays anyway
  and shows 「這場不是混雙」. King of the court has no mixed option yet.
- 抽籤 → 計分板: each court in 抽籤分組 and 國王球場 has a scoreboard icon
  (`.court-score`). It opens the scoreboard setup with the four names, teams
  and first-serving team filled in (`scoreboard.fromDraw`; a game still being
  scored asks first). The match keeps `from` ({ kind, court, teams }); when
  it ends, 「回抽籤，記錄 … 贏」 calls `draw.reportWin`, which finds the same
  game with `courtOfGame` (same court, same two teams) and marks the winner.
  If the court changed meanwhile it only says so. app.js wires the two views;
  same phone only (a hand-over drops `from`). After the first game the
  scoreboard keeps its settings (`picobo.scoreSettings`: mode, target, win
  by), so a game from 抽籤 starts scoring right away; 重新設定 changes them.
- 抽籤 starts with an empty roster (no example names: they were real
  friends' names). The last roster stays on the phone. An old saved example
  list, or a session drawn from it, is dropped on load. Copy examples use
  generic names (Amy & Ben, Chris).
- Share as picture (src/ui/sharecard.js, content from src/sharecard.js): a
  finished game (scoreboard 「分享到 IG」, camera icon; 「📷 IG」 under 380px)
  or the 抽籤 今天戰績 (「📷 IG」 pill by the title). After a game the
  board's buttons are one row: undo and reset as icons only. One sheet: 限動 9:16 / 貼文 4:5, optional own photo (cover-fit,
  never uploaded; 拍照 opens the camera with capture="environment", 選照片 the
  album), 分享 via navigator.share({ files }) else 存圖 (download).
  Score image is the chosen B1 mockup (big picobo. tag top left, cream score
  band; long names drop under the score); no photo = drawn court background.
  戰績: everyone who played (rows shrink, two columns for long lists), no
  title (the table says it); cream card with the logo on top without
  a photo, ranking panel over the photo with one. Every image carries
  picobo.net (score band, 戰績, sticker).
  The score band / 戰績 panel has 小／中／大 (scale 0.55 / 0.75 / 1; a photo
  makes it 小 until the player picks) and can be dragged on the preview;
  it stays inside the picture and below the brand tag when it fits.
  Games also have a 貼紙 tab: transparent PNG, 複製貼紙 (ClipboardItem) or
  存貼紙. Not yet tried on a real phone with Instagram.
- 常用球團 (phase 1, feature 3): `picobo.groups`, rules in src/groups.js,
  UI in src/ui/groups.js. 抽籤 roster card shows 「＋ 存成球團」 (first, so it
  never scrolls away) and one chip per group; tapping a group replaces the
  roster (asks first; clears the draw in progress); the chip whose members
  match the roster is highlighted. The ＋ sheet also lists groups to delete.
  報名訊息 shows the group chips above 已經報名; a tap fills the names.
- 個人戰績本 (phase 1, feature 1): src/record.js (pure, tested),
  src/ui/record.js (picobo.games, max 1000; picobo.me = { name, aliases }),
  page src/ui/me.js at #me (under 首頁; top-bar person icon `#me-btn`; home
  card 「我的戰績 這週」 once me has a game this week, refreshed on each visit
  to home). Recorded: scoreboard games when they finish (not with 甲1/乙1
  placeholder names; undo on a finished game removes the record; a game sent
  from 抽籤 and reported back counts once, from the scoreboard), every 這隊贏
  in 抽籤分組 (source draw) and 國王球場 (koc), with no score. The page: pick
  who you are (several spellings = aliases), 這週／本月／全部, 場數・勝率・
  最長連勝, 最佳拍檔 (≥3 games), 最常搭檔, 最難纏的對手 (≥3), last 10 games,
  清除所有紀錄. 固定場次範本 (feature 4) skipped by the user for now.
- 戰報圖 (phase 1, feature 2): 「📷 IG」 next to the 我的戰績 title opens
  the same share sheet with kind 'report' (reportCard in src/sharecard.js,
  tested; reportPanel in src/ui/sharecard.js). It shares the range on screen:
  name・dates (week Mon–Sun, 「10 月」, 全部), 「這週打了 14 場」 with the
  count on yellow, tiles 勝率／最長連勝／最佳拍檔 (else 最常搭檔)／戰績.
  Photo, 限動／貼文, 小中大 and drag work as for the other pictures.
  Phase 1 is done except 固定場次範本 (skipped).

## Known gaps and ideas not yet scheduled

- Google Fonts were blocked in the sandbox, so Noto Sans TC / Space Grotesk
  have not been seen rendered; system fallbacks looked fine.
- Scoreboard has no sound or vibration on score; intentionally left out.
- Round-robin pairing is a randomized search, not a perfect schedule.
- Scene animations are simple position transitions; ball flight is static.
