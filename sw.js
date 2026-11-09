// Caches the app shell so it opens fast and works with a weak signal.
const CACHE = "gse-v71";
const SHELL = ["./", "index.html", "app.js", "data.js", "todo.js", "icon.svg", "manifest.webmanifest"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // Network first so data refreshes show up; cache when offline.
  e.respondWith(fetch(e.request).then(r => {
    if (new URL(e.request.url).origin === location.origin) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request)));
});
