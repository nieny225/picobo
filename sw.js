// Service worker: lets the installed app open with no signal at the court.
// Network first, so every visit online gets the latest files; the cache is the
// fallback when the network is gone or too slow. Every file the page needs is
// listed in FILES (tests/sw.test.js checks the list against src/ and styles/).
const CACHE = 'picobo-v2';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'favicon.svg',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'styles/main.css',
  'src/app.js',
  'src/court.js',
  'src/draw.js',
  'src/handoff.js',
  'src/scoring.js',
  'src/tournament.js',
  'src/data/event.js',
  'src/data/formats.js',
  'src/data/glossary.js',
  'src/data/home.js',
  'src/data/nav.js',
  'src/data/rules.js',
  'src/ui/draw.js',
  'src/ui/event.js',
  'src/ui/formats.js',
  'src/ui/handoff.js',
  'src/ui/home.js',
  'src/ui/install.js',
  'src/ui/rules.js',
  'src/ui/scenes.js',
  'src/ui/scoreboard.js',
  'src/ui/share.js',
  'src/ui/theme.js',
  'src/ui/topbar.js',
  'src/ui/tournament.js',
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
  const timeout = new Promise(resolve => setTimeout(() => resolve(cached), TIMEOUT_MS));
  return Promise.race([network.catch(() => cached), timeout]);
}
