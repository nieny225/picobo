# Picobo — Pickleball rules & court tools (zh-TW)

**Resuming work? Read `docs/HANDOFF.md` first.** `docs/PLAN.md` is the
approved v1 plan.

## What this is

Brand name: **Picobo 痞克柏** (the Chinese name is 痞克柏, not 匹克球; 匹克球
stays the name of the sport in all copy).


A single-page web app, in Traditional Chinese (Taiwan usage), that is both the
place to *learn* pickleball rules and a *tool people use on court*: visual rule
explanations on a court diagram, a scoreboard that shows who serves from where,
and a draw / rotation scheduler for group play.

Audience: Taiwan recreational players, mostly on a phone at the court, often
with sweaty thumbs and bright sunlight. Mobile-first, big tap targets, high
contrast.

Deliverables: a claude.ai Artifact first (published from these same files), a
static site later. There is no backend and no build step.

## Stack rules (do not drift)

- Plain HTML, CSS and JavaScript ES modules. No framework, no bundler, no npm
  dependencies, no TypeScript, no CSS preprocessor.
- No backend, no analytics, no runtime requests except the two Google Fonts
  faces linked in `index.html`, each with a full system fallback stack so the
  page reads fine offline or when fonts are blocked.
- Persistence is `localStorage` only, every read/write wrapped in try/catch,
  and the page must render correctly when storage is empty or throws.
- No i18n framework. All user-facing copy is zh-TW and lives in `src/data/`.
  An English version is a separate decision for later.

## Layout

```
index.html              the page; hash-routed tabs: #home (default) #rules #score #draw,
                        sub-pages #rules/<id> and #formats/<id> (fun formats sit
                        under the rules tab); tabs in the header on desktop, in a
                        bottom bar on phones (< 768px)
styles/main.css         design tokens on :root, dark mode, mobile-first
src/app.js              router; mounts the views
src/court.js            SVG court renderer shared by rules + scoreboard
src/scoring.js          pure scoring state machines (no DOM)
src/draw.js             pure draw / round-robin / king-of-court logic (no DOM)
src/ui/home.js          home: slogan, hero court, entry cards
src/ui/rules.js         rules index + one page per rule + left drawer, drives court scenes
src/ui/formats.js       fun formats index + one page per format with court scenes
src/ui/scenes.js        court scene carousel shared by rules and formats
src/ui/scoreboard.js    scoreboard view
src/ui/draw.js          draw + rotation view
src/ui/share.js         share button: system share sheet, else copy link (picobo.net URL)
src/ui/topbar.js        hides the top bar while scrolling down; sets --topbar-h for sticky bars
src/data/rules.js       rule copy + court scene definitions
src/data/formats.js     fun formats + their court scenes (國王球場, 輪轉賽, 3 人制, 半場單打, 廚房戰, 快打短局)
src/data/glossary.js    中英術語對照 + 常見誤解
src/data/home.js        首頁 slogan 與入口文字
src/data/nav.js         目錄、上一條／下一條、玩法頁的介面文字
tests/*.test.js         node:test for the pure modules
```

## Code conventions

- One module, one responsibility. Pure logic (`scoring.js`, `draw.js`) never
  touches the DOM and is unit-tested. UI modules only render data and call
  pure functions. Data modules export plain objects, no logic.
- Every user-visible string lives in `src/data/`. Never inline zh-TW copy in
  UI code; add a data field instead.
- `court.js` is the single source of court geometry and region ids. Rules
  scenes and the scoreboard both describe positions using its vocabulary
  (`nvz`, `serviceBox:near:right`, `baseline:far`, player `{side, pos}`).
  Never draw a second court.
- Scoring: `pointWon(state, team)` returns a new state and never mutates. The
  history stack for undo lives inside the state. Side-out doubles: after a
  side-out the first server is whoever is currently in the right court; only
  the serving team swaps positions, and only when it scores. Rally doubles
  follows the USA Pickleball provisional rule (2026): every rally scores, no
  second server, each team stands by its own score (rule 14.A.4) and after
  a side-out the player now in the right court serves. Rally singles: every
  rally scores, the server stands by their own score.
- CSS: colors and spacing are custom properties on `:root`, redefined for
  dark mode. Tap targets are at least 44px. No horizontal page scroll at
  360px width. Prefer `scroll-snap` carousels for step-by-step rule scenes.
- Fail loud: throw on impossible state (unknown mode, negative score, unknown
  team) rather than silently falling back.
- Keep files small and flat. Surgical changes over rewrites.

## Content style guide

- 繁體中文，台灣用語。全形標點「，。、：；？！」，中英文之間留一個半形空格。
- 術語以 `src/data/glossary.js` 為準。第一次出現寫「中文（English）」，之後只用中文，
  例外是球友日常直接講英文的詞（dink、side-out、drop serve）可以中英並用。
- 正統規則以 USA Pickleball Official Rulebook 現行版為準，頁尾標示版本年份；
  引用時附規則編號（例如 4.B.6）。
- 球場上各地不同的做法（每球得分簡易版、3 人制、廚房戰）必須標「各球場做法不同」，
  不可寫成官方規則。
- 語氣：像球場上會教你的前輩，直接、短句、先講結論再講理由。一條規則一句話能講完
  就不要兩句。

## Commands

```
python3 -m http.server 8080        # run: open http://localhost:8080
node --test                 # unit tests for scoring.js and draw.js
```

Layout check: drive the local server with Playwright and the preinstalled
Chromium (`executablePath: '/opt/pw-browsers/chromium'`) at 390×844 and
1280×800, light and dark, and confirm no horizontal overflow.

## Publishing the artifact

Publish `index.html` with the Artifact tool and pass `styles/**` and `src/**`
through `files` so ES module imports resolve. Re-publish to the same URL; do
not create a second artifact for updates.

Current artifact: https://claude.ai/artifact/W4LaC8XBDpJiVMLHmdeVKD

## Static site

Live at https://picobo.net via GitHub Pages: branch `main`, folder `/`, no
build. `CNAME` holds the domain, `.nojekyll` skips Jekyll. DNS is at Gandi
(apex A/AAAA to GitHub Pages, `www` CNAME to `nieny225.github.io`); the full
setup is in `docs/DEPLOY.md`. Anything merged to `main` goes live.

## Git

- Work on the branch given for the session; never push elsewhere.
- Commit per phase with a descriptive message. No generated files, no
  scratch, no `.DS_Store`.
- No pull request unless asked.
