import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fromBrowser, LANG, LANGS } from '../src/lang.js';

test('language from the browser: Traditional → zh-TW, other Chinese → zh-CN, else en', () => {
  assert.equal(fromBrowser(['zh-TW', 'en']), 'zh-TW');
  assert.equal(fromBrowser(['zh-Hant-HK']), 'zh-TW');
  assert.equal(fromBrowser(['zh-SG']), 'zh-CN');
  assert.equal(fromBrowser(['zh-Hans-CN']), 'zh-CN');
  assert.equal(fromBrowser(['zh']), 'zh-CN');
  assert.equal(fromBrowser(['en-SG', 'zh-TW']), 'en');
  assert.equal(fromBrowser(['ms-MY', 'zh-TW']), 'zh-TW');
  assert.equal(fromBrowser(['ja-JP']), 'en');
  assert.equal(fromBrowser(['en-SG']), 'en');
  assert.equal(fromBrowser([]), 'zh-TW');
  assert.equal(LANG, 'zh-TW'); // node has no browser
  assert.deepEqual(LANGS, ['zh-TW', 'zh-CN', 'en']);
});
