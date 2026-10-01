// The service worker precaches a hand-kept list of files. A file added under
// src/ or styles/ but missing from the list would break the app offline.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const sw = readFileSync(join(root, 'sw.js'), 'utf8');
const listed = [...sw.match(/const FILES = \[([\s\S]*?)\];/)[1].matchAll(/'([^']+)'/g)].map(m => m[1]);

function walk(dir) {
  return readdirSync(join(root, dir)).flatMap(f => {
    const p = `${dir}/${f}`;
    return statSync(join(root, p)).isDirectory() ? walk(p) : [p];
  });
}

test('sw.js precaches every app file', () => {
  for (const f of [...walk('src'), ...walk('styles'), ...walk('icons')]) assert.ok(listed.includes(f), `${f} missing from sw.js FILES`);
});

test('every precached file exists', () => {
  for (const f of listed) if (f !== './') assert.ok(existsSync(join(root, f)), `${f} listed in sw.js but not found`);
});
