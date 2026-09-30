# Picobo — 台灣繁中 Pickleball 規則教學 + 球場工具

## Context

The `nieny225/picobo` repo is empty (no commits, no branch). The goal is a
Traditional Chinese (Taiwan) web app that is both the go-to place to *learn*
pickleball and a *tool you use on court*. First deliverable is a claude.ai
Artifact; the same files later deploy as a static site. Before building the
app, the repo gets initialized with a `CLAUDE.md` so future sessions develop
consistently.

Decisions already made with the user:

| Decision | Choice |
|---|---|
| v1 tools | Visual scoreboard, draw/grouping + rotation scheduler, visual rule teaching with court diagrams |
| Fun formats | All six: 國王球場, 輪轉賽, 3 人制, 半場單打, 廚房戰, 快打短局 |
| Rally scoring | Teach the simple club version as main text, MLP pro version (freeze rule) in a collapsible |
| Stack | Plain HTML / CSS / JS ES modules, **no build step, no dependencies, no backend** |

Deferred to later (explicitly not v1): serve-position lookup widget, rules quiz,
GitHub Pages workflow, English version.

## Order of work

1. **Repo init** on branch `ccr-e7df49dc-8t69j2`: `CLAUDE.md`, `README.md`,
   `.gitignore`, `.editorconfig`, empty scaffold. Commit + push before writing
   app code.
2. Shared court SVG component + rules content + rules UI → first artifact publish.
3. Scoring state machine (with tests) + scoreboard UI.
4. Draw / rotation algorithms (with tests) + draw UI.
5. Mobile polish, final artifact publish, push.

Load `artifact-design` (and `artifact-diagramming` for the SVG court) before
writing `index.html`. No `dataviz` needed (no charts).

## File layout

```
index.html              single page, three tabs via hash routing: #rules #score #draw
styles/main.css         tokens on :root, dark mode, mobile-first (16px gutters, 44px+ tap targets)
src/app.js              router, mounts the three views
src/court.js            SVG court renderer, the one component shared by rules + scoreboard
src/scoring.js          pure scoring state machines (no DOM)
src/draw.js             pure draw / round-robin / king-of-court queue algorithms (no DOM)
src/ui/rules.js         renders rule sections from data, drives court scenes step by step
src/ui/scoreboard.js    scoreboard view
src/ui/draw.js          draw + rotation view
src/data/rules.js       all zh-TW rule copy + court scene definitions
src/data/formats.js     the six fun formats
src/data/glossary.js    中英術語對照
tests/scoring.test.js   node:test
tests/draw.test.js      node:test
CLAUDE.md  README.md  .gitignore  .editorconfig
```

Principles (also go into CLAUDE.md): one module one responsibility; all logic
that can be pure lives in `scoring.js` / `draw.js` and is tested; all Chinese
copy lives in `src/data/`, never inline in UI code; UI modules only render data
and call pure functions. State persisted to `localStorage` (roster, current
match) wrapped in try/catch.

## Court component (`src/court.js`)

`renderCourt(el, scene)` draws a top-down court and returns nothing else. Scene:

```js
{
  orientation: 'portrait',                 // phone default; net horizontal
  highlight: ['nvz', 'serviceBox:far:right', 'baseline:near'],
  players: [{ team: 'A', side: 'near', pos: 'right', label: '小明', serving: true }],
  ball: { path: [[x,y], ...], bounces: [1], step: 2 },   // step = how many segments shown
  labels: true                              // dimension labels on/off
}
```

Real proportions: 44 ft × 20 ft (13.41 m × 6.10 m), NVZ 7 ft (2.13 m) each side,
service boxes 10 × 15 ft, net 36 in at posts / 34 in center. Region ids are the
vocabulary both rules scenes and the scoreboard use. Colors via CSS custom
properties so dark mode works.

## Rules content (`src/data/rules.js`)

Each item: `{ id, title, summary (1–2 sentences), detail (paragraphs), scene | scenes[] (step list, each with highlight/players/ball + caption), misconceptions[] }`.

Presentation (user asked for slide/carousel where it reads better):
- **Within a rule, steps are a horizontal swipe carousel**: the court SVG stays
  fixed at the top of the card and animates; the caption strip below swipes
  (CSS scroll-snap, dots, 上一步／下一步 buttons, keyboard arrows). Keeping
  the court in place is what makes the ball path readable.
- **Between rules, vertical scroll** with a sticky section nav, so every rule
  keeps a `#rules/serve`-style anchor and the page stays searchable.
- Summary + court first, 「更多說明」 expands detail. A full-screen
  slideshow of all rules is a later option, not v1.

**Section 0 · 球場與基本**: dimensions, 廚房/非截擊區, 發球區, 線的意義（線算界內，唯獨發球碰廚房線算出界）, 網高, 裝備一句話.

**Section 1 · 正統規則（USA Pickleball 側出計分）**
1. 發球：低手（揮拍由下往上、觸球點低於腰／肚臍、拍頭低於手腕）或落地發球（drop serve）；至少一腳在底線後；對角發球；必須越過廚房及廚房線；只有一次機會；觸網落在界內照打（2021 起無 let 重發）；發球前先喊分。
2. 雙彈跳：發球落地一次、回球落地一次，之後才可截擊。Scene: 4-step ball path.
3. 廚房（非截擊區）：踩線或在區內不可截擊，含截擊後衝力踩進去；球落地後可進廚房打；任何身上物品掉進廚房都算。
4. 計分與喊分：11 分、贏 2 分；雙打三個數字「發球方分數 – 接球方分數 – 第幾發球員」；開局 0-0-2。Interactive 「跟著喊一局」walk-through.
5. 發球順序與站位（USA Pickleball 基本規則原文：「每次 side-out 的第一球由右側／偶數區發出」）：side-out 後，**當時站在右邊的人就是第一發球員，從右邊發**；沒有固定的 Server 1。誰站右邊由分數決定：只有得分才換位（發球員與搭檔對調），接球方永不換位，所以開局站右邊的人在偶數分一定在右邊、奇數分一定在左邊。第一發球員失分換第二發球員（從他站的位置、也就是左邊發），再失分 side-out。口訣：「拿回發球權，看分數確認站位，右邊的人開球」。Scene: 逐分播放甲乙隊例子（A1 開局站右；甲隊 1 分時 side-out 回來，A1 在左，由右邊的 A2 先發）。
6. 換場：每局結束換場；決勝局（第三局）一方到 6 分換場。
7. 界內界外與常見犯規：出界、掛網、廚房截擊、雙彈跳違規、碰網／網柱、球碰身體（持拍手腕以下除外）、雙擊、發球員／站位錯誤。
8. 單打差異：兩個數字、發球員偶數右奇數左、無第二發球員。

**Section 2 · 每球得分制（Rally Scoring）**
- 簡易版（main）: 每球都得分；贏球方下一球發球；發球方贏球 → 發球員與搭檔換位、同一人續發；接球方贏球 → 得分並取得發球權，發球員為依分數奇偶站在對應位置的人（偶右奇左）；接球方不換位；打到 15 或 21，贏 2 分。Note that clubs vary; state the version taught.
- 職業版 MLP（collapsible）: 21 分制；凍結規則（一方到 20 分後只能在自己發球時得分；落後方到 18 分時也凍結；凍結後不需贏 2 分）。**Verify against the current MLP rulebook before writing this copy — freeze thresholds are from memory.**
- 對照表：傳統 vs 每球得分（誰得分、喊分格式、局長、換位規則）。

**Section 3 · 趣味玩法 (`src/data/formats.js`)**, each: 適合人數、場地、規則 3–5 條、計分、小訣竅.
1. 國王球場 King of the Court：贏家留場（可設最多連續 3 局），輸家排隊尾；短局 7 或 11 分。
2. 輪轉賽 / 混雙輪轉 Round Robin：固定輪次每輪換搭檔，記個人分。
3. 3 人制 Cutthroat：發球者一人打二人；發球者贏球得 1 分續發，輸球換下一位當發球者；先到 11 分。註明各地版本不同。
4. 半場單打 Skinny Singles：單打只用對角半場（偶數右、奇數左）；也列「同側半場」變體。
5. 廚房戰 Dink Game：雙方站廚房線，只能 dink，球須落在廚房內（或線後一步內）；每球得分到 7 或 11。
6. 快打短局 / 計時制：每球得分到 7（贏 1 或 2 分），或 10 分鐘計時，用於輪轉。

**Section 4 · 常見誤解 + 術語表 (`src/data/glossary.js`)**. Misconceptions, first one is the user's own question: 「我們隊有固定的第一發球員？」→ 沒有，side-out 後站右邊的人就是第一發球員，誰在右邊由分數決定（開局站右者：偶數在右、奇數在左）；「偶數從右發、奇數從左發？」→ 那是單打規則，雙打看的是開局站右者的位置；「球碰廚房線算界內？」→ 是，只有發球例外；「發球 let 要重發？」→ 不用，2021 起照打；「球落地後可以站在廚房裡打？」→ 可以；「發球可以過肩？」→ 不行。Glossary: 廚房／非截擊區 NVZ (Kitchen)、丁克 Dink、截擊 Volley、側出／換發 Side-out、第三拍吊球 Third Shot Drop、雙彈跳 Two-Bounce Rule、發球失誤 Fault、踩線 Foot Fault、厄尼 Erne、繞柱球 ATP、抽球 Drive、高吊 Lob、重置 Reset、發球方／接球方.

Content source policy: USA Pickleball Official Rulebook (current edition) is
canonical for Sections 0–1; cite the edition year in the footer. Use WebSearch
during implementation to confirm: Rule 4.B exact wording for the doubles
first server after a side-out (plan follows the USA Pickleball basic-rules
summary: "the first serve of each side-out is made from the right/even
court"; quote the rule number in the copy), 2026 rulebook serve rules wording,
side switch rule, MLP freeze thresholds, USA Pickleball rally-scoring
provisional rule. Anything not confirmed is marked 「各球場做法不同」 rather than stated as
official.

## Scoring engine (`src/scoring.js`) — pure, tested

```js
createMatch({ mode, target, winBy, teams: { A: [name, name], B: [...] }, firstServer })
pointWon(state, 'A' | 'B') -> newState       // never mutates
undo(state) -> previous state (history stack kept inside state)
announce(state) -> '4-2-1' | '4-2' | '4-2（A 發球）'
sideSwitchDue(state) -> boolean               // deciding-game reminder
```

Modes: `sideout-doubles`, `sideout-singles`, `rally-simple`, `rally-mlp`,
`fun` (rally, configurable target, no positions). State holds: scores, serving
team, server number (side-out only), player positions per team
(`{ right, left }`), history, `finished`, `winner`.

Position rules to encode exactly (these are what the court diagram shows):
- Side-out doubles: game starts 0-0-2; serving team scores → server & partner
  swap sides, same server; serving team loses → server 1 → server 2 (serves
  from wherever they stand); server 2 loses → side-out, new server 1 is
  **whoever is currently in the right court** (no parity lookup needed: the
  positions already carry parity because only scoring swaps them). Receiving
  team never moves. Test asserts: starting-right player is on the right at
  every even score and on the left at every odd score.
- Side-out singles: server on parity side; no server number.
- Rally simple: as Section 2 main text. Rally MLP: same plus freeze (verify).
- Fun: just counters, first to target.

Tests: opening sequence 0-0-2 → 1-0-2 (swap) → side-out 0-1-1 → …; server-2
handover keeps positions; receiving team never moves; undo restores exact
state; win-by-2 and deuce; rally parity picks correct server; freeze blocks
points on receive.

## Scoreboard UI (`src/ui/scoreboard.js`)

Setup: mode, target (7/11/15/21), team names (default 甲隊/乙隊 or from draw
roster), who serves first (coin flip button). Play: full-width court with
player labels and serving marker, giant score + announce string
(「4-2-1」, tap to hear nothing—no audio in v1), two huge tap targets
「甲隊贏球」「乙隊贏球」, 復原, 換場提醒 banner, 結束/新局. Match state persisted
to localStorage so a refresh on court doesn't lose the game.

## Draw / rotation (`src/draw.js`) — pure, tested

```js
shuffle(names)                                   // Fisher–Yates, seedable for tests
makeTeams(names) -> [[a,b], ...] (+ leftover)
assignCourts(teams, courtCount) -> [{ court, teams: [t1, t2] }]
roundRobin(names, courtCount, rounds) -> rounds[] // greedy: minimize repeat partners, then repeat opponents; N ≤ 16 fine
kingOfCourt(queue, courtCount) -> { playing, waiting }, advance(state, winners) // winners stay, max-stay configurable
```

UI: roster editor (chips, persisted), 抽籤 (teams + courts + 誰先發球),
輪轉賽 (rounds table, tap a round to expand), 國王球場 (queue view with
「這場贏家」buttons). Keep it list-based; no drag-and-drop.

## CLAUDE.md contents (English, ~80 lines)

Purpose & audience (Taiwan players, phone on court); stack rules (no build, no
deps, no backend, ES modules, works from `file://`-free static host);
directory map above; conventions (pure logic vs UI split, data files hold all
copy, one component per file, CSS tokens + dark mode, 44px tap targets);
content style guide (繁體中文台灣用語, 全形標點, 術語以 glossary 為準, first
mention 中文（English）, official rules cite USA Pickleball rulebook edition,
unverified club variants labelled as such); commands
(`python3 -m http.server 8080` to run, `node --test tests/` to test, headless
Chromium screenshot at 390px width to check layout); artifact publish
procedure (Artifact tool, `index.html` + `files` map of `src/**` and
`styles/**`, same URL on republish); git (branch naming, commit style, never
commit `.DS_Store`/scratch). Explicit "don't": no frameworks, no bundler, no
analytics, no i18n framework before an English version is actually requested.

`README.md`: two paragraphs in zh-TW + how to run. `.gitignore`: node_modules,
.DS_Store, *.log, scratch. `.editorconfig`: 2-space, LF, utf-8.

## Verification

- `node --test tests/` green for scoring and draw.
- Serve locally (`python3 -m http.server`), drive with Playwright + preinstalled
  Chromium at 390×844 and 1280×800: screenshot each tab, no horizontal
  scroll, tap targets ≥ 44px, dark mode via `prefers-color-scheme` emulation.
- Manual scenario in scoreboard: play a full side-out doubles game and confirm
  announce strings and court positions match Section 1 rule 5 at every point.
- Publish artifact; open and check ES module imports resolve from `files`
  (fallback if the artifact host can't serve modules: inline via a small
  concat step, but only if actually needed).
- Commit after each phase; `git push -u origin ccr-e7df49dc-8t69j2` with
  retry/backoff on network errors. No PR unless asked.
