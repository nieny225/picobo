// Fills {name} placeholders in copy. A count can pick a word form with
// {n|one|other}: '{n} {n|game|games}' gives "1 game", "3 games" (English
// needs it; Chinese copy just uses {n}). No DOM.
export const fill = (s, vars) => s.replace(/\{(\w+)(?:\|([^|}]*)\|([^}]*))?\}/g,
  (_, k, one, other) => (one === undefined ? vars[k] : Number(vars[k]) === 1 ? one : other));
