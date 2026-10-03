import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

// Every language has the same data files with the same shape as zh-TW: keys,
// array lengths, value types and {placeholders}. Values that are ids, links
// or court positions must not be translated at all.
const DIR = new URL('../src/data/', import.meta.url);
const FILES = readdirSync(new URL('zh-TW/', DIR)).filter(f => f.endsWith('.js'));
const LANGS = ['en', 'zh-CN'];
const SAME = new Set(['id', 'route', 'href', 'kind', 'host', 'shapes', 'url', 'signupUrl', 'source', 'path', 'highlight', 'bounces', 'side', 'pos', 'depth', 'team', 'play', 'scoring', 'step', 'at', 'address', 'block', 'open', 'operator']);
// Translated on purpose, together with what they key: venue regions and format groups.
const TRANSLATED_IDS = [/^VENUES\.\d+\.city$/, /^VENUES_PAGE\.regions\.\d+\.id$/, /^FORMATS\.\d+\.group$/];
const KEYS_TRANSLATED = [/^FORMATS_PAGE\.groupShort$/];
const holes = s => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort();
// A key like `scoring` or `address` is an id in one place and copy in another:
// only values with no Chinese in them are held fixed.
const hasHan = v => /[\u4e00-\u9fff]/.test(JSON.stringify(v));

function compare(a, b, path, errs) {
  const t = v => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);
  if (t(a) !== t(b)) { errs.push(`${path}: ${t(a)} vs ${t(b)}`); return; }
  if (Array.isArray(a)) {
    if (a.length !== b.length) { errs.push(`${path}: ${a.length} items vs ${b.length}`); return; }
    a.forEach((x, i) => compare(x, b[i], `${path}.${i}`, errs));
  } else if (t(a) === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b);
    if (KEYS_TRANSLATED.some(r => r.test(path))) { if (ka.length !== kb.length) errs.push(`${path}: ${ka.length} keys vs ${kb.length}`); return; }
    if (ka.join() !== kb.join()) { errs.push(`${path}: keys ${ka.join()} vs ${kb.join()}`); return; }
    for (const k of ka) {
      const p = `${path}.${k}`;
      const fixed = (SAME.has(k) || (k === 'value' && 'type' in a)) && !hasHan(a[k]);
      if (fixed && !TRANSLATED_IDS.some(r => r.test(p))) { if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) errs.push(`${p}: must stay ${JSON.stringify(a[k])}`); continue; }
      compare(a[k], b[k], p, errs);
    }
  } else if (t(a) === 'string') {
    if (holes(a).join() !== holes(b).join()) errs.push(`${path}: placeholders {${holes(a)}} vs {${holes(b)}}`);
  } else if (t(a) !== 'function' && a !== b) errs.push(`${path}: ${a} vs ${b}`);
}

for (const lang of LANGS) {
  test(`${lang}: every data file matches zh-TW in shape`, async () => {
    const errs = [];
    for (const f of FILES) {
      if (!existsSync(new URL(`${lang}/${f}`, DIR))) { errs.push(`${lang}/${f} missing`); continue; }
      const [a, b] = await Promise.all([import(new URL(`zh-TW/${f}`, DIR)), import(new URL(`${lang}/${f}`, DIR))]);
      if (Object.keys(a).join() !== Object.keys(b).join()) { errs.push(`${f}: exports differ`); continue; }
      for (const k of Object.keys(a)) compare(a[k], b[k], k, errs);
    }
    assert.deepEqual(errs, []);
  });
}

test('each src/data/<name>.js re-exports everything its zh-TW file exports', async () => {
  for (const f of FILES) {
    const [a, sw] = await Promise.all([import(new URL(`zh-TW/${f}`, DIR)), import(new URL(f, DIR))]);
    assert.deepEqual(Object.keys(sw).sort(), Object.keys(a).sort(), f);
  }
});

test('no Chinese left in the English copy', () => {
  for (const f of FILES) {
    const p = new URL(`en/${f}`, DIR);
    if (!existsSync(p)) continue;
    const lines = readFileSync(p, 'utf8').split('\n').filter(l => !l.trim().startsWith('//') && !/source:|langNames|brandZh/.test(l) && /[一-鿿]/.test(l));
    assert.deepEqual(lines, [], f);
  }
});

test('fill: placeholders and {n|one|other} word forms', async () => {
  const { fill } = await import('../src/fill.js');
  assert.equal(fill('{n} {n|game|games}', { n: 1 }), '1 game');
  assert.equal(fill('{n} {n|game|games}', { n: 3 }), '3 games');
  assert.equal(fill('{n} {n|game|games}', { n: 0 }), '0 games');
  assert.equal(fill('{a}-{b}', { a: 11, b: 7 }), '11-7');
  assert.equal(fill('打了 {n} 場', { n: 1 }), '打了 1 場');
});
