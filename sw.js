/* Service worker — Fléchettes PDC
   Stratégie : on sert immédiatement ce qui est en cache (démarrage instantané, même sans réseau),
   et on met à jour le cache en arrière-plan. Une nouvelle version s'affiche donc au lancement suivant.
   Pour forcer un nettoyage complet après une grosse modification, augmentez CACHE_VERSION. */
const CACHE_VERSION = 'pdc-V19.1';

const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './config.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-48.png',
  './fonts/outfit-latin-wght-normal.woff2',
  './fonts/dm-sans-latin-wght-normal.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => Promise.all(PRECACHE.map((u) =>
        fetch(new Request(u, { cache: 'reload' })).then((r) => { if (r && r.ok) return cache.put(u, r); }).catch(() => {})
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req, { cache: 'no-cache' })
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);

      if (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html')) {
        const fresh = await network;                   // pages : réseau d'abord (nouvelle version immédiate), cache si hors connexion
        if (fresh) return fresh;
      }
      if (cached) return cached;                       // le reste : cache d'abord, mise à jour en arrière-plan
      const res = await network;
      if (res) return res;
      if (req.mode === 'navigate') return cache.match('./index.html');  // hors connexion : on ouvre l'appli
      return new Response('', { status: 504, statusText: 'Hors connexion' });
    })
  );
});
