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
| Artifact | published from the OLD account (see below) |

Run locally: `python3 -m http.server 8080`, tests: `node --test`.

## Artifact ownership

The v1 artifact (`https://claude.ai/artifact/PJXBm8ZHFXikZ4WEiVYEcM`) belongs
to the previous account. A session on the new account cannot republish to
that URL. On the first publish from the new account, create a new artifact
from `index.html` with the same `files` map (`styles/main.css` and every file
under `src/`), then replace the URL in `CLAUDE.md`.

Not yet verified anywhere: that the artifact host serves the ES module files
correctly. It worked in a local browser. If the artifact opens blank, the
fallback is to concatenate the modules into one inline script for publishing
only (keep the repo multi-file).

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

## Design style exploration (mockups delivered, waiting on the user's pick)

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
geometry is the real one. Next: the user picks (or mixes) one; then rewrite
the tokens in `styles/main.css` and the font link in `index.html`, keep a
light and a dark palette for the chosen style, re-run the layout check.

## Known gaps and ideas not yet scheduled

- Google Fonts were blocked in the sandbox, so the display face has not been
  seen rendered; system fallbacks looked fine.
- Scoreboard has no sound or vibration on score; intentionally left out.
- Round-robin pairing is a randomized search, not a perfect schedule.
- Scene animations are simple position transitions; ball flight is static.
