// nav copy in the page's language (src/lang.js); the files live in
// src/data/<lang>/ with the same exports.
import { LANG } from '../lang.js';

const m = await import(`./${LANG}/nav.js`);
export const { RULES_INDEX, FILTER, SCORE_SETUP, SCORE_SHARE, SHARE, DRAW_EMPTY, DRAW_PASTE, GROUPS, DRAW_RENAME, DRAW_SWAP, DRAW_MIX, DRAW_SCORE, OPEN_PLAY, THEME, HANDOFF, SCENE_NAV, DRAWER, RULE_PAGE, EXTRA_PAGES, FORMATS_PAGE, SCORE_TEXT, DRAW_TEXT, APP_TEXT } = m;
