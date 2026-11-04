// Service worker: aplikacija se odpre tudi brez povezave in ponovno ne prenaša knjižnic.
// - knjižnice in pisave (/vendor/): najprej iz predpomnilnika (se ne spreminjajo),
// - ostale datoteke in branje API: najprej omrežje (vedno najnovejša različica), ob
//   izpadu ali zelo počasni povezavi zadnja shranjena kopija,
// - 3D modeli (/3d/modeli/*.glb?v=…): najprej iz svojega predpomnilnika (MODELS), ki ostane tudi ob novi
//   različici knjižnic; ?v= je zgoščena vrednost vsebine (server/tri-d.js), zato nov izvoz pride sam,
//   stara kopija iste datoteke pa se ob tem pobriše,
// - pošiljanje (POST …) gre vedno na strežnik; vaje brez povezave ureja public/offline.js.
// Strežnik ime spodaj dopolni z različico knjižnic (server/razlicica.js): ob novi knjižnici se
// stari predpomnilnik pobriše. Nove datoteke aplikacije pridejo same (najprej omrežje).
const VERSION = "evklid-v1";
const STATIC = `${VERSION}-static`;
const VENDOR = `${VERSION}-vendor`;
const API = `${VERSION}-api`;
const MODELS = "evklid-3d-v1"; // nova številka samo ob spremembi oblike shranjenih modelov
const SHELL = ["/", "/index.html"];
// API, ki ga ne shranjujemo (prijava, plačila, osebni podatki računa).
const NO_CACHE = /^\/api\/(auth|billing|account|stripe|usage)/;
const TIMEOUT = { static: 4000, api: 7000 };

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(STATIC).then((c) => c.addAll(SHELL)).catch(() => null));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION) && k !== MODELS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Stran ob prvem obisku pošlje seznam že naloženih datotek, da jih shranimo za brez povezave.
self.addEventListener("message", (e) => {
  if (e.data?.type !== "precache" || !Array.isArray(e.data.urls)) return;
  const same = e.data.urls.filter((u) => {
    try {
      const url = new URL(u, self.location.origin);
      return url.origin === self.location.origin && !url.pathname.startsWith("/api/");
    } catch {
      return false;
    }
  });
  e.waitUntil(
    Promise.all(
      same.map(async (u) => {
        const cache = await caches.open(new URL(u, self.location.origin).pathname.startsWith("/vendor/") ? VENDOR : STATIC);
        if (await cache.match(u)) return;
        const res = await fetch(u).catch(() => null);
        if (res?.ok) await cache.put(u, res);
      }),
    ),
  );
});

// Povezava do računalnika je prekinjena (ngrok ali Cloudflare javita, da strežnik ne teče):
// obravnavamo kot brez povezave, da se aplikacija odpre iz shranjene kopije.
// ERR_NGROK_6024 je samo opozorilna stran ngrok ob prvem obisku, ta ni izpad.
function tunnelDown(res) {
  const code = res.headers.get("ngrok-error-code");
  // JSON z napako je odgovor našega strežnika (deluje), ne napaka tunela.
  const ours = /json/i.test(res.headers.get("content-type") || "");
  return (code && code !== "ERR_NGROK_6024") || (!ours && [502, 504, 530].includes(res.status));
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (err) => {
        clearTimeout(t);
        reject(err);
      },
    );
  });
}

// Najprej omrežje; uspešen odgovor shranimo, ob napaki ali izteku časa vrnemo shranjenega.
async function networkFirst(req, cacheName, ms) {
  const cache = await caches.open(cacheName);
  const net = fetch(req).then((res) => {
    if (tunnelDown(res)) throw new Error("tunnel down");
    if (res.ok && res.type === "basic") cache.put(req, res.clone()).catch(() => null);
    return res;
  });
  try {
    return await withTimeout(net, ms);
  } catch {
    const hit = await cache.match(req);
    if (hit) return hit;
    try {
      return await net; // počasna povezava brez kopije: vseeno počakamo na omrežje
    } catch {
      if (req.mode === "navigate") return (await caches.match("/")) || Response.error();
      return new Response(JSON.stringify({ error: "offline", offline: true }), {
        status: 503,
        headers: { "Content-Type": "application/json", "X-Offline": "1" },
      });
    }
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(VENDOR);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone()).catch(() => null);
  return res;
}

// 3D model: shranjena kopija s pravo različico (?v=), sicer prenos; ob uspehu pobrišemo starejše različice.
async function modelFirst(req) {
  const cache = await caches.open(MODELS);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok && res.type === "basic" && new URL(req.url).searchParams.has("v")) {
    const path = new URL(req.url).pathname;
    const keep = res.clone();
    (async () => {
      for (const old of await cache.keys()) if (new URL(old.url).pathname === path) await cache.delete(old);
      await cache.put(req, keep);
    })().catch(() => null);
  }
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/sw.js" || url.pathname.startsWith("/healthz")) return;
  if (url.pathname.startsWith("/api/")) {
    if (NO_CACHE.test(url.pathname)) return;
    e.respondWith(networkFirst(req, API, TIMEOUT.api));
    return;
  }
  if (url.pathname.startsWith("/3d/modeli/") && url.pathname.endsWith(".glb")) {
    e.respondWith(modelFirst(req));
    return;
  }
  if (url.pathname.startsWith("/vendor/")) {
    e.respondWith(cacheFirst(req));
    return;
  }
  e.respondWith(networkFirst(req, STATIC, TIMEOUT.static));
});
