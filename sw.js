/* CLAUSE Statistical Assessment - service worker
   Change VERSION on every release so that devices fetch the new files. */
const VERSION = 'sa-1.0.0';
const CACHE = 'clause-' + VERSION;
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './privacy.html', './terms.html',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
  './icons/favicon-32.png', './icons/favicon-16.png', './icons/apple-touch-icon.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('clause-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// Pages: network first (so updates arrive automatically), cache when offline or slow.
// Other files: cache first.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const ctl = new AbortController();
        const timer = setTimeout(() => ctl.abort(), 4000);
        const res = await fetch(req, { signal: ctl.signal });
        clearTimeout(timer);
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      } catch (err) {
        const hit = await caches.match(req, { ignoreSearch: true });
        return hit || caches.match('./index.html');
      }
    })());
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
