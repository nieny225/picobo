// Service worker: lets the installed app open with no signal at the court.
// Network first, so every visit online gets the latest files; the cache is the
// fallback when the network is gone or too slow. Every file the page needs is
// listed in FILES (tests/sw.test.js checks the list against src/ and styles/).
const CACHE = 'picobo-v9';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'manifest.en.webmanifest',
  'manifest.zh-CN.webmanifest',
  'favicon.svg',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'styles/main.css',
  'src/app.js',
  'src/court.js',
  'src/draw.js',
  'src/fill.js',
  'src/groups.js',
  'src/handoff.js',
  'src/record.js',
  'src/meetup.js',
  'src/paddle.js',
  'src/scoring.js',
  'src/sharecard.js',
  'src/signup.js',
  'src/tournament.js',
  'src/data/event.js',
  'src/data/formats.js',
  'src/data/glossary.js',
  'src/data/home.js',
  'src/data/me.js',
  'src/data/meetup.js',
  'src/data/nav.js',
  'src/data/rules.js',
  'src/data/settings.js',
  'src/data/signup.js',
  'src/data/venues.js',
  'src/data/zh-TW/event.js',
  'src/data/zh-TW/formats.js',
  'src/data/zh-TW/glossary.js',
  'src/data/zh-TW/home.js',
  'src/data/zh-TW/me.js',
  'src/data/zh-TW/meetup.js',
  'src/data/zh-TW/nav.js',
  'src/data/zh-TW/rules.js',
  'src/data/zh-TW/settings.js',
  'src/data/zh-TW/signup.js',
  'src/data/zh-TW/venues.js',
  'src/data/en/event.js',
  'src/data/en/formats.js',
  'src/data/en/glossary.js',
  'src/data/en/home.js',
  'src/data/en/me.js',
  'src/data/en/meetup.js',
  'src/data/en/nav.js',
  'src/data/en/rules.js',
  'src/data/en/settings.js',
  'src/data/en/signup.js',
  'src/data/en/venues.js',
  'src/data/zh-CN/event.js',
  'src/data/zh-CN/formats.js',
  'src/data/zh-CN/glossary.js',
  'src/data/zh-CN/home.js',
  'src/data/zh-CN/me.js',
  'src/data/zh-CN/meetup.js',
  'src/data/zh-CN/nav.js',
  'src/data/zh-CN/rules.js',
  'src/data/zh-CN/settings.js',
  'src/data/zh-CN/signup.js',
  'src/data/zh-CN/venues.js',
  'src/lang.js',
  'src/ui/draw.js',
  'src/ui/event.js',
  'src/ui/formats.js',
  'src/ui/fullscreen.js',
  'src/ui/groups.js',
  'src/ui/handoff.js',
  'src/ui/home.js',
  'src/ui/install.js',
  'src/ui/me.js',
  'src/ui/meetup.js',
  'src/ui/record.js',
  'src/ui/rules.js',
  'src/ui/scenes.js',
  'src/ui/scoreboard.js',
  'src/ui/sharecard.js',
  'src/ui/share.js',
  'src/ui/signup.js',
  'src/ui/settings.js',
  'src/ui/topbar.js',
  'src/ui/tournament.js',
  'src/ui/venues.js', 'src/venues.js',
];
// On a weak court signal, give up on the network after this long and use the cache.
const TIMEOUT_MS = 3000;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // Only this site's files; Google Fonts and everything else go straight to the network.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(fromNetworkElseCache(req));
});

async function fromNetworkElseCache(req) {
  const cache = await caches.open(CACHE);
  // no-cache: always ask the server (a cheap 304 when nothing changed), never
  // the browser's HTTP cache, which GitHub Pages lets hold files for 10 minutes.
  const network = fetch(req, { cache: 'no-cache' }).then(res => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  });
  const cached = await cache.match(req, { ignoreSearch: true })
    ?? (req.mode === 'navigate' ? await cache.match('index.html') : undefined);
  if (!cached) return network;
  // Slow signal: after TIMEOUT_MS the cached copy is served. That copy can be
  // from the last deploy while other files of the page come fresh, so when the
  // network answer lands later with something new, tell the page to offer a reload.
  let timedOut = false;
  const timeout = new Promise(resolve => setTimeout(() => { timedOut = true; resolve(cached); }, TIMEOUT_MS));
  network.then(async res => {
    if (!timedOut || !res.ok) return;
    const [a, b] = await Promise.all([res.clone().text(), cached.clone().text()]);
    if (a !== b) for (const c of await self.clients.matchAll()) c.postMessage({ type: 'picobo-updated' });
  }).catch(() => { /* offline: the cached copy is all there is */ });
  return Promise.race([network.catch(() => cached), timeout]);
}
