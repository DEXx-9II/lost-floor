/* הקומה האבודה – Service Worker: עובד גם בלי אינטרנט (סולו), ותמיד מביא גרסה חדשה כשיש רשת */
const CACHE = 'lost-floor-v10b';
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;     // פונטים וספריות חיצוניות – הדפדפן מטפל בהם כרגיל
  // הדף עצמו: קודם רשת (תמיד הגרסה האחרונה), ואם אין – מהמטמון
  e.respondWith(fetch(r).then(res => { if (res.ok) caches.open(CACHE).then(c => c.put(r, res.clone())); return res; }).catch(() => caches.match(r).then(m => m || caches.match('./index.html'))));
});
