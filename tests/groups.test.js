import { test } from 'node:test';
import assert from 'node:assert/strict';
import { saveGroup, removeGroup, groupOf, cleanGroups, MAX_GROUPS } from '../src/groups.js';

test('saving a group: newest first, same name replaces, names cleaned', () => {
  let g = saveGroup([], '週六 Kallang 團', ['Amy', ' Ben ', 'Amy', '']);
  assert.deepEqual(g, [{ name: '週六 Kallang 團', names: ['Amy', 'Ben'] }]);
  g = saveGroup(g, '週三團', ['Chris', 'Dan']);
  assert.equal(g[0].name, '週三團');
  g = saveGroup(g, '週六 Kallang 團', ['Amy', 'Erin']);
  assert.deepEqual(g.map(x => x.name), ['週六 Kallang 團', '週三團']);
  assert.deepEqual(g[0].names, ['Amy', 'Erin']);
  assert.throws(() => saveGroup(g, ' ', ['A']), /empty name/);
  assert.throws(() => saveGroup(g, 'x', [' ']), /no players/);
});

test('a full list refuses a new name but still replaces an old one', () => {
  let g = [];
  for (let i = 0; i < MAX_GROUPS; i++) g = saveGroup(g, `G${i}`, ['A']);
  assert.throws(() => saveGroup(g, 'new', ['A']), /full/);
  assert.equal(saveGroup(g, 'G3', ['B']).length, MAX_GROUPS);
});

test('remove, find by members, clean what was stored', () => {
  const g = [{ name: 'A', names: ['Amy', 'Ben'] }, { name: 'B', names: ['Chris'] }];
  assert.deepEqual(removeGroup(g, 'A'), [{ name: 'B', names: ['Chris'] }]);
  assert.equal(groupOf(g, ['Ben', 'Amy']).name, 'A');
  assert.equal(groupOf(g, ['Ben']), null);
  assert.deepEqual(cleanGroups([{ name: ' X ', names: ['a', 'a'] }, { name: '', names: ['b'] }, null, { name: 'Y', names: [] }]), [{ name: 'X', names: ['a'] }]);
  assert.deepEqual(cleanGroups('oops'), []);
});
