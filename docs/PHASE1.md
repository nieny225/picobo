# Phase 1: stickiness (built, except 固定場次範本)

Goal: people open Picobo every time they play, not only when they need a
tool. Four features, picked by the user on 2026-10-03:

1. 個人戰績本 — every game played through Picobo is recorded; win rate,
   partners, streaks.
2. 本週／本月戰報圖 — a share picture of that record.
3. 常用球團 — saved rosters, one tap into 抽籤 / 報名訊息.
4. 固定場次範本 — "every Saturday 5-7pm @ court", one tap to this week's
   報名訊息.

Constraints from CLAUDE.md still hold: no backend, no accounts, localStorage
only (every read/write in try/catch), zh-TW copy in `src/data/`, pure logic
in its own tested module, no new dependencies.

## Suggested order

3 → 4 → 1 → 2. Groups and templates are small, remove typing every week,
and give 1 and 2 cleaner names to count. 2 needs 1.

## 3. 常用球團 (groups) — built 2026-10-03

- Storage `picobo.groups`: `[{ id, name, names: [...], updated }]`, at most 20.
- 抽籤 roster card: a row of group chips above the names
  (「週六 Kallang 團」「週三 Trifecta 團」 …). Tap one: the roster becomes
  that group (asks first if the roster has other names). 「＋ 存成球團」
  saves the current roster under a name. Long-press or ⋯ on a chip: rename,
  delete.
- 報名訊息: the same chips above 「已經報名」; tap fills the names box,
  one name per line (groups hold single names, not couples).
- Mixed-doubles tags already live per name (`picobo.genders`), so a loaded
  group brings its tags along for free.
- Pure: `src/groups.js` — add / rename / remove / mergeInto(roster) with
  tests (duplicates, empty names, the 20 limit).

## 4. 固定場次範本 (templates) — skipped for now (user: not used often yet)

- Storage `picobo.templates`: `[{ id, weekday 0-6, start, end, place,
  cap, groupId? }]`, at most 10.
- 報名訊息: 「存成固定場次」 under the form saves the first session's
  weekday / time / place / cap. Saved templates show as a list at the top:
  「每週六 5-7pm・Kallang ›」. Tap: the form fills with the **next**
  date for that weekday (today if it is that day and before the start
  time), and the group's names if the template has one.
- Home: if templates exist, one small card 「下一場：週六 10/4 5-7pm
  Kallang → 發報名訊息」.
- Pure: `nextDate(template, now)` in `src/signup.js` (or `templates.js`),
  tested across week ends, month ends and "today after start time".

## 1. 個人戰績本 (personal record) — built 2026-10-03

- **Who is "me"**: no accounts. The first time, the 我的戰績 page asks
  「你是哪一位？」 and lists names seen in recent rosters; the choice is
  stored (`picobo.me` = { name, aliases: [] }). Aliases cover the same
  person written two ways (「Max」「max3066」). Changeable any time.
- **What is recorded** (`picobo.games`, newest last, keep the last 1000):
  `{ at, source: 'score'|'draw'|'koc', teams: [[a,b],[c,d]],
  scores: [x,y] | null, winner: 0|1, mode? }`.
  - Scoreboard: when a game finishes (only if names are real, not 甲1/乙1).
  - 抽籤分組 and 國王球場: when 這隊贏 is pressed (no score, just W/L).
  - Draw → scoreboard → 回抽籤 is one game: recorded once, with the score.
  - Undo on the scoreboard after finishing removes the record again.
  - Every game is stored for every player, not only "me", so picking or
    changing "me" later still has history (and 2 can show anyone's card).
- **Page** `#me` (under 首頁; home gets a card 「我的戰績：這週 6 場・勝率
  67%」). Sections: this week / this month / all toggle; tiles 場數・勝率・
  最長連勝; 最佳拍檔 (most wins together, at least 3 games) and 最常搭檔;
  最難纏的對手 (most losses against, at least 3); recent games list
  (date, partner, opponents, W/L, score if any). 「清除紀錄」 at the bottom.
- Pure: `src/record.js` — `addGame`, `removeLast`, `summary(games, me,
  range, now)` returning counts, rate, streaks, partners, opponents. Tested
  with fixed dates (week starts Monday, local time).

## 2. 戰報圖 (weekly / monthly share picture) — built 2026-10-03

- A new kind in `src/ui/sharecard.js`: `'report'`. Same sheet (限動/貼文,
  拍照/選照片, 小中大 + drag, 分享/存圖).
- Content: big 「這週打了 14 場」, 勝率 64%, 最長連勝 4, 最佳拍檔 Amy,
  date range, picobo.net; the brand tag top left as on the other pictures.
- Entry: 「📷 IG」 on the 我的戰績 page, sharing whatever range is shown.

## 戰績連結 — A built 2026-10-03, B later

Someone else usually keeps score, so games land on their phone. A: a link
with today's games (「🔗 傳給球友」 in 抽籤 今天戰績, 「把今天的比賽傳給球友」
on 我的戰績), opened by each player once; merged by game id. B: accounts +
cloud database with the future login / profile; uploads the games already on
phones.

## Decisions (user, 2026-10-03)

1. 我的戰績 is its own page (`#me`). Logins and a real profile will come
   later, so for now add a personal entry point: a person icon in the top
   bar (next to share / theme) that opens `#me`. The home card links there
   too.
2. Counting 抽籤 games without a score: the user was unsure. Decision for
   now: record them (most evenings are 抽籤 only) with `source` and
   `scores: null`, so they can be filtered out later. The page shows how many
   games came with a score.
3. Keep 最難纏的對手.
4. Order 3 → 4 → 1 → 2.
