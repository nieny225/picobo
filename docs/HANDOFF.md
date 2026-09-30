# Handoff — read this first when resuming

Last updated: 2026-09-30, branch `ccr-7b6d14a5-myo5fh`.
The previous session ran under a different claude.ai account; this document
is the full context needed to continue from a new session.

## Where things stand

v1 is built, tested and pushed. `docs/PLAN.md` is the approved plan; the
code follows it except where noted under "Decisions" below.

| Area | State |
|---|---|
| Repo scaffold, `CLAUDE.md` | done |
| `src/court.js` shared SVG court | done |
| Rules content (`src/data/rules.js`, 31 scenes) | done, zh-TW copy reviewed once |
| Fun formats ×6, glossary ×16, misconceptions ×7 | done |
| Scoring engine + 10 tests | done, all green |
| Draw / round-robin / king-of-court + 6 tests | done, all green |
| Rules view with step carousel, scoreboard view, draw view | done |
| Layout check at 390px and 1280px, light and dark | done, no overflow |
| Artifact | republished from the new account with style C (see below) |

Run locally: `python3 -m http.server 8080`, tests: `node --test`.

## Artifact

Current artifact (new account, published 2026-09-30 with style C):
https://claude.ai/artifact/W4LaC8XBDpJiVMLHmdeVKD. Republish to this URL;
the old v1 artifact (PJXBm8ZHFXikZ4WEiVYEcM) belongs to the previous account
and is no longer updated.

Still not verified: that the artifact host serves the ES module files
correctly (a sandbox session cannot open the artifact page). If it opens
blank, the fallback is to concatenate the modules into one inline script for
publishing only (keep the repo multi-file).

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

- Four top tabs: 規則 #rules, 玩法 #formats, 計分 #score, 抽籤 #draw.
- #rules is an index (grouped by section, one tappable row per rule, plus
  the compare table, 常見誤解 and 術語表). Each opens its own page,
  #rules/<id>, with 目錄 back link and 上一條／下一條 at the bottom.
- v1 links #rules-<id> are rewritten to #rules/<id> (#rules-formats to
  #formats). Unknown ids fall back to the index.
- Page heights at 390 px: index ~2,100, a rule page ~1,350, formats ~3,400.

## Going live (in progress, 2026-09-30)

The user bought picobo.net at Gandi and chose: make the repo public and host
on GitHub Pages (branch `main`, root). Repo side is ready (`CNAME`,
`.nojekyll`, favicon). The user does the GitHub settings and Gandi DNS by
following `docs/DEPLOY.md`. Before that, `picobo.net` pointed at Gandi's
parking IP 217.70.184.38. There was no `main` branch yet; the remote default
branch was the old session branch `ccr-e7df49dc-8t69j2`.

## Known gaps and ideas not yet scheduled

- Google Fonts were blocked in the sandbox, so Noto Sans TC / Space Grotesk
  have not been seen rendered; system fallbacks looked fine.
- Scoreboard has no sound or vibration on score; intentionally left out.
- Round-robin pairing is a randomized search, not a perfect schedule.
- Scene animations are simple position transitions; ball flight is static.
