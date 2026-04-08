/* Moaaz Mustafa Portfolio — Service Worker v1 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `moaaz-static-${CACHE_VERSION}`;
const PAGE_CACHE = `moaaz-pages-${CACHE_VERSION}`;
const API_CACHE = `moaaz-api-${CACHE_VERSION}`;

const ALL_CACHES = [STATIC_CACHE, PAGE_CACHE, API_CACHE];

/** Pages to precache on install */
const PRECACHE_PAGES = [
  '/',
  '/about',
  '/experience',
  '/projects',
  '/contact',
  '/gallery',
];

/** ─── Install ──────────────────────────────────────────── */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) =>
      cache.addAll(PRECACHE_PAGES).catch(() => {
        /* Silently skip pages that can't be fetched (SSR / auth-gated) */
      }),
    ),
  );
});

/** ─── Activate ─────────────────────────────────────────── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !ALL_CACHES.includes(k))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/** ─── Fetch ────────────────────────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Skip Next.js internals (_next/webpack-hmr, etc.)
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;

  /* ── Static assets: _next/static/** ── cache-first */
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|otf)$/)
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then(
          (cached) =>
            cached ||
            fetch(request).then((response) => {
              if (response.ok) cache.put(request, response.clone());
              return response;
            }),
        ),
      ),
    );
    return;
  }

  /* ── API routes: network-first, short-lived cache fallback ── */
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            caches
              .open(API_CACHE)
              .then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  /* ── HTML pages: network-first, cached page fallback ── */
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          caches
            .open(PAGE_CACHE)
            .then((cache) => cache.put(request, response.clone()));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match('/')),
      ),
  );
});
