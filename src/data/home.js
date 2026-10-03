// home copy in the page's language (src/lang.js); the files live in
// src/data/<lang>/ with the same exports.
import { LANG } from '../lang.js';

const m = await import(`./${LANG}/home.js`);
export const { HOME } = m;
