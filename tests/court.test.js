import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupSvg, SETUP_HOSTS } from '../src/court.js';

const count = (svg, cls) => (svg.match(new RegExp(`class="${cls}"`, 'g')) ?? []).length;

test('借場地打: reused and taped pickleball lines per host court', () => {
  assert.deepEqual(SETUP_HOSTS, ['badminton', 'tennis', 'volleyball']);
  // Eight pickleball lines: 2 baselines, 2 sidelines, 2 kitchen lines, 2 centre halves.
  const lines = { badminton: [6, 2], tennis: [2, 6], volleyball: [0, 8] };
  for (const [host, [reuse, tape]] of Object.entries(lines)) {
    const svg = setupSvg(host, host);
    assert.equal(count(svg, 'setup-reuse'), reuse, host);
    assert.equal(count(svg, 'setup-tape'), tape, host);
  }
  assert.throws(() => setupSvg('squash', 'x'), /unknown host/);
});
