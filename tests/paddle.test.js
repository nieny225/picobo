import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paddleRulesSvg, paddleShapesSvg, PADDLE_SHAPES } from '../src/paddle.js';

const t = { alt: 'a', length: 'L', sum: 'S', tapeEdge: 'E', free: 'F', tapeGrip: 'G', names: { standard: 's', hybrid: 'h', elongated: 'e' }, sizes: { standard: '1', hybrid: '2', elongated: '3' } };

test('paddle drawings: labels from data, picked shapes stand out', () => {
  const r = paddleRulesSvg(t);
  for (const w of ['>L<', '>S<', '>1<', '>2<', '>3<']) assert.ok(r.includes(w), w);
  assert.deepEqual(PADDLE_SHAPES, ['standard', 'hybrid', 'elongated']);
  const all = paddleShapesSvg(t);
  assert.equal((all.match(/pd-shape dim/g) ?? []).length, 0);
  const one = paddleShapesSvg(t, ['elongated']);
  assert.equal((one.match(/pd-shape dim/g) ?? []).length, 2);
  assert.equal((one.match(/ picked/g) ?? []).length, 1);
});
