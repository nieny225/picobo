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
- Offline support comes from `sw.js` (same-origin files only). Adding a file
  under `src/`, `styles/` or `icons/` means adding it to `FILES` in `sw.js`;
  `node --test` fails otherwise. Registration fails quietly in the artifact.
- Persistence is `localStorage` only, every read/write wrapped in try/catch,
  and the page must render correctly when storage is empty or throws.
- Three languages, no i18n framework: zh-TW (繁中, the source), zh-CN (简中)
  and en. All user-facing copy lives in `src/data/<lang>/*.js`, same exports
  and shape in every language (tests/i18n.test.js checks keys, lengths,
  {placeholders} and that ids/links/court spots are untouched). Each
  `src/data/<name>.js` is a two-line switch that loads the page language's
  file, so UI code imports `../data/<name>.js` as before. `src/lang.js` picks
  the language (?lang=, saved choice, browser) and `setLang` reloads.
  New copy: add it to zh-TW and to en and zh-CN in the same change.

## Layout

```
index.html              the page; hash-routed tabs: #home (default) #rules #score #draw
                        #venues (揪團 tab, was 約球: 場地名錄; #signup 報名訊息 under it), sub-pages #rules/<id> and
                        #formats/<id> (fun formats sit under the rules tab),
                        #picobowl (tournament page, under home), #me (我的戰績, under home; person icon
                        in the top bar), #meetup (揪團卡,
                        under the 揪團 tab, no entry point yet); tabs in the header on desktop, in a bottom bar on
                        phones (< 768px)
styles/main.css         design tokens on :root, dark mode, mobile-first
manifest.webmanifest    installable web app (name, icons, standalone)
sw.js                   service worker: network first, cache fallback for offline;
                        its FILES list must name every app file (tests/sw.test.js)
icons/                  icon.svg (source) + PNGs rendered from it with Playwright
src/app.js              router; mounts the views
src/paddle.js           球拍圖：規格上限和可貼膠帶的範圍、三種拍型照比例（裝備頁）
src/court.js            SVG court renderer shared by rules + scoreboard; renderCourt(el,
                        scene, { landscape }) lies the court down (near side left);
                        setupSvg(host) draws it on a badminton / tennis / volleyball court (借場地打)
src/scoring.js          pure scoring state machines (no DOM)
src/draw.js             pure draw / round-robin / king-of-court logic (no DOM)
src/tournament.js       pure Pico Bowl logic: pools, court queue, standings, playoffs (no DOM)
src/handoff.js          pack / unpack a tool's state into a hand-over link (#score?s=…)
src/signup.js           pure 報名訊息 text: 9/5 (Sat) 5-7pm, 📍 place, short map link, numbered list;
                        parseSignup reads a pasted list back into sessions of names (抽籤 uses it)
src/groups.js           pure 常用球團 list: save (same name replaces, max 20), remove, find by members
src/record.js           pure 個人戰績本: game records (score / draw / koc), who is me, summary for a range;
                        pack / merge for the 戰績連結 (today's games by link, #me?s=…)
src/sharecard.js        pure share-image content: a finished game's score card, the 抽籤 戰績 ranking, the 我的戰績 戰報
src/meetup.js           pure 揪團卡 logic: check the form, chat summary line, .ics, map / LINE / WhatsApp links
src/ui/home.js          home: slogan, hero court, entry cards
src/ui/rules.js         rules index + one page per rule + left drawer, drives court scenes
src/ui/formats.js       one fun format card; shown inside the rules view (bar, drawer)
src/ui/scenes.js        court scene carousel shared by rules and formats
src/ui/scoreboard.js    scoreboard view
src/ui/draw.js          draw + rotation view
src/ui/share.js         share button: system share sheet, else copy link (picobo.net URL)
src/ui/handoff.js       share-state button + explainer sheet: picobo.net/#<tool>?s=<state>; app.js loads it;
                        抽籤's sheet also offers 把戰績傳給球友 (the 戰績連結)
src/ui/fullscreen.js    full screen for one view at a time (scoreboard, draw): real API or in-page fallback
src/ui/groups.js        常用球團 chips + save/delete sheet (picobo.groups), used by 抽籤 and 報名訊息
src/ui/record.js        戰績 storage (picobo.games, picobo.me); recordGame / unrecordGame for scoreboard and draw;
                        shareTodayGames / receiveGames (戰績連結)
src/ui/me.js            我的戰績 page (#me), its home card, the top-bar person icon
src/ui/sharecard.js     share as picture: canvas card (B1 score / 戰績 / 戰報), own photo, IG sticker; share sheet or save
src/ui/topbar.js        hides the top bar while scrolling down; sets --topbar-h for sticky bars
src/ui/settings.js      ⚙︎ in the top bar: 語言 (繁中｜简中｜English) and 外觀 (light｜dark)
src/lang.js             which language the page speaks; setLang saves and reloads
src/ui/install.js       top-bar install button (prompt or steps), an invite/share icon once installed; registers the service worker
src/ui/event.js         Pico Bowl tournament page + its home-page card
src/ui/tournament.js    organizer screen at #picobowl/manage (local to one phone)
src/ui/meetup.js        揪團: form, card preview, shared card (#meetup?s=…, shown only, never loaded)
src/ui/venues.js        場地名錄 by region with filters; 發報名訊息 → #signup?venue=<id>
src/ui/signup.js        報名訊息: sessions, names, optional cap → live preview, copy / share as text
src/data/rules.js       rule copy + court scene definitions
src/data/formats.js     fun formats + court scenes, grouped by purpose: 人多場地少 (國王球場, 輪轉賽, 快打短局),
                        人數湊不齊 (3 人制, 半場單打), 想練技術 (廚房戰, 截擊大戰, 第三拍挑戰), 想玩熱鬧 (接力團體賽, 繞場, 蘇格蘭雙打)
src/data/glossary.js    中英術語對照 + 常見誤解
src/data/home.js        首頁 slogan 與入口文字
src/data/me.js          我的戰績的介面文字
src/data/nav.js         目錄、上一條／下一條、玩法頁的介面文字
src/data/event.js       Pico Bowl 比賽資訊（open: false 時首頁卡片顯示 Coming soon）
src/data/signup.js      報名訊息的介面文字和訊息裡的英文固定字
src/data/meetup.js      揪團卡的介面文字
src/data/venues.js      新加坡場地名錄（依區域分組；只放有來源的資料，來源寫在 source 欄）
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
- Page order on the rules tab has one source: `toc(f)` in `src/ui/rules.js`
  (SECTIONS order, the side-out vs rally table after the shown scoring
  section, fun formats by purpose group, then 更多). The index, the drawer and
  上一條／下一條 all read it; never order pages inside one view. When you add,
  move or rename a rule or format, check all four filter combinations
  (雙打／單打 × 側出計分／每球得分): index, drawer and the prev / next chain must
  list the same pages in the same order.
- Fail loud: throw on impossible state (unknown mode, negative score, unknown
  team) rather than silently falling back.
- Keep files small and flat. Surgical changes over rewrites.

## Content style guide

- 圖解是這個網站的特色（使用者 2026-10-03 提醒）：每一頁新內容都要配圖，能用圖講的不要只寫字。
  球場用 `court.js`，球拍用 `src/paddle.js`；文字放 `src/data/`，圖上字少、放大，說明放圖下。
- 繁體中文，台灣用語。全形標點「，。、：；？！」，中英文之間留一個半形空格。
- 简中（zh-CN）：写给新加坡和大陆读者的自然简体，不是逐字转换；用“”引号，术语照
  src/data/zh-CN/glossary.js。English (en): USA Pickleball terms, short labels
  (they sit on phone buttons), same voice; local practices say "varies by club".
  English titles get no （English） tag (enTag hides it).
- 術語以 `src/data/glossary.js` 為準。第一次出現寫「中文（English）」，之後只用中文，
  例外是球友日常直接講英文的詞（dink、side-out、drop serve）可以中英並用。
- 正統規則以 USA Pickleball Official Rulebook 現行版為準，頁尾標示版本年份；
  畫面上不寫規則編號（4.B.6、第 4 節這類），球友看不懂；需要時寫在程式註解。
- 球場上各地不同的做法（每球得分簡易版、3 人制、廚房戰）必須標「各球場做法不同」，
  不可寫成官方規則。
- 語氣：像球場上會教你的前輩，直接、短句、先講結論再講理由。一條規則一句話能講完
  就不要兩句。

## Commands

```
python3 -m http.server 8080        # run: open http://localhost:8080
node --test                 # unit tests for the pure modules and sw.js
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
