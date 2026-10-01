import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeHandoff, decodeHandoff } from '../src/handoff.js';
import { createMatch, pointWon } from '../src/scoring.js';

test('hand-over links round-trip and stay URL safe', async () => {
  let s = createMatch({ mode: 'rally-doubles', teams: { A: ['甲1', 'Annie'], B: ['乙1', 'Max'] }, target: 15 });
  for (const t of 'ABBAABAB') s = pointWon(s, t);
  const text = await encodeHandoff('score', s);
  assert.match(text, /^[zj][A-Za-z0-9_-]+$/);
  const back = await decodeHandoff(text);
  assert.equal(back.kind, 'score');
  assert.deepEqual(back.data, JSON.parse(JSON.stringify(s)));
});

test('compression keeps a long state short enough for a LINE link', async () => {
  const roster = Array.from({ length: 30 }, (_, i) => `球友${i + 1}`);
  const text = await encodeHandoff('draw', { roster: { names: roster }, play: { queue: roster, stats: Object.fromEntries(roster.map(n => [n, { played: 3, won: 1 }])) } });
  assert.ok(text.length < 1500, `link body ${text.length} chars`);
});

test('bad links throw', async () => {
  await assert.rejects(decodeHandoff('xabc'), /not a hand-over link/);
  await assert.rejects(decodeHandoff('j' + Buffer.from('{"v":2}').toString('base64url')), /bad payload/);
  await assert.rejects(encodeHandoff('nope', {}), /unknown kind/);
});
