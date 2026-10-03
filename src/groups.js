// 常用球團: saved rosters a host loads with one tap (抽籤, 報名訊息).
// Plain data, no DOM: [{ name, names: [...] }], newest first. A group is
// keyed by its name; saving under an existing name replaces it.
export const MAX_GROUPS = 20;

const clean = names => [...new Set(names.map(n => String(n).trim()).filter(Boolean))];

export function saveGroup(groups, name, names) {
  const key = String(name ?? '').trim();
  if (!key) throw new Error('groups: empty name');
  const list = clean(names ?? []);
  if (list.length === 0) throw new Error('groups: no players');
  const rest = groups.filter(g => g.name !== key);
  if (rest.length >= MAX_GROUPS) throw new Error('groups: full');
  return [{ name: key, names: list }, ...rest];
}

export function removeGroup(groups, name) {
  return groups.filter(g => g.name !== name);
}

// The saved group whose players are exactly `names` (any order), if any.
export function groupOf(groups, names) {
  const want = clean(names).sort().join('\u0000');
  return groups.find(g => [...g.names].sort().join('\u0000') === want) ?? null;
}

// Whatever was stored, as a valid list (bad entries dropped).
export function cleanGroups(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.filter(g => g && typeof g.name === 'string' && g.name.trim() && Array.isArray(g.names))
    .map(g => ({ name: g.name.trim(), names: clean(g.names) }))
    .filter(g => g.names.length > 0)
    .slice(0, MAX_GROUPS);
}
