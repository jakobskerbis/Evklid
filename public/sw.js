// Service worker: aplikacija se odpre tudi brez povezave in ponovno ne prenaša knjižnic.
// - knjižnice in pisave (/vendor/): najprej iz predpomnilnika (se ne spreminjajo),
// - vstopna stran (/): najprej omrežje s kratkim rokom (stran je majhna, ob nespremenjeni samo 304), ob izpadu
//   shranjena kopija. Stran pove različico datotek (glava X-Evklid-App, server/vstopna-stran.js). Če je novejša
//   od APP tega service workerja, ta do zamenjave ne postreže nobene shranjene kopije več (outdated): nova stran
//   tako nikoli ne dobi starih modulov, leni moduli pa pozneje ne pridejo iz druge različice kot app.js,
// - datoteke aplikacije (.js, .css, slike …): takoj iz predpomnilnika, če jih je shranila ista različica
//   aplikacije (APP spodaj, strežnik jo dopolni ob zagonu); sicer najprej omrežje. Tako se odprtje in vsak
//   zaslon odpreta brez čakanja na omrežje, nova različica pa pride takoj, ko jo strežnik objavi,
// - javni API (učbenik, teme, poti, formule …): najprej omrežje (vedno najnovejša različica), ob izpadu
//   ali zelo počasni povezavi zadnja shranjena kopija,
// - osebni API (profili, pogovori, napredek, račun, šola …) se nikoli ne shrani (P7, zasebnost na skupnih
//   računalnikih); vaje brez povezave imajo svoj paket (public/offline.js), ki se ob odjavi pobriše,
// - 3D modeli (/3d/modeli/*.glb?v=…): najprej iz svojega predpomnilnika (MODELS), ki ostane tudi ob novi
//   različici knjižnic; ?v= je zgoščena vrednost vsebine (server/tri-d.js), zato nov izvoz pride sam,
//   stara kopija iste datoteke pa se ob tem pobriše,
// - pošiljanje (POST …) gre vedno na strežnik; vaje brez povezave ureja public/offline.js.
// Strežnik ime spodaj dopolni z različico knjižnic (server/razlicica.js): ob novi knjižnici se
// stari predpomnilnik pobriše. Nove datoteke aplikacije pridejo same: nova različica (APP) pomeni,
// da nobena shranjena kopija ni več »sveža«, zato gre vsaka najprej na omrežje in se shrani znova.
const VERSION = "evklid-v1";
// Različica datotek aplikacije (server/razlicica.js staticVersion: commit + prstni odtis mape public/).
// Prazna (npr. sw.js brez strežnika): datoteke aplikacije gredo kot prej najprej na omrežje.
const APP = "";
const APP_FILE = /\.(?:m?js|css|svg|png|jpe?g|webp|avif|gif|woff2?)$/i; // statične datoteke iz public/
const STAMP = "X-Evklid-App"; // glava v shranjeni kopiji: katera različica jo je shranila
const STATIC = `${VERSION}-static`;
const VENDOR = `${VERSION}-vendor`;
// Samo javni odgovori API (enaki za vse uporabnike). Prej »-api« z vsemi odgovori: ob aktivaciji se pobriše.
const API = `${VERSION}-api-javni`;
const OLD_API = `${VERSION}-api`;
const MODELS = "evklid-3d-v1"; // nova številka samo ob spremembi oblike shranjenih modelov
const SHELL = ["/", "/index.html"];
// API, ki ga ne shranjujemo (prijava, plačila, osebni podatki računa). /api/mobile/web (vstop v splet iz
// aplikacije, server/mobile/web-session.js) gre mimo, da ostanejo glave aplikacije in brez povezave aplikacija
// pokaže svoj zaslon »Ni povezave« (sicer: 400 brez glav ali kopija »/« na tem naslovu).
const NO_CACHE = /^\/api\/(auth|billing|account|stripe|usage|mobile)/;
// Javni API brez osebnih podatkov: samo ti odgovori gredo v predpomnilnik (vse ostalo samo omrežje).
const PUBLIC_API = /^\/api\/(topic|lesson|paths|programs|references|formulas|textbook|exam-papers)(\/|$)/;
// Lekcija za učenca (osebna: test predznanja, paket) se ne shrani; ob ogledu shranimo javno kopijo iste lekcije
// (/api/lesson?id=, brez učenčevih polj), da se obiskana lekcija bere tudi brez povezave (public/textbook.js).
const STUDENT_LESSON = /^\/api\/students\/\d+\/lesson$/;
async function storePublicLesson(id) {
  const cache = await caches.open(API);
  const url = `${self.location.origin}/api/lesson?id=${encodeURIComponent(id)}`;
  if (await cache.match(url)) return;
  const res = await fetch(url, { credentials: "same-origin" });
  if (res.ok && !privateRes(res)) await cache.put(url, res);
}
// Odgovor, ki ga strežnik označi kot zaseben, se ne shrani (tudi na javni poti).
const privateRes = (res) => /no-store|private/i.test(res.headers.get("cache-control") || "");
const TIMEOUT = { entry: 2500, static: 4000, api: 7000 };
// Strežnik je objavil novo različico datotek (vstopna stran z drugačno X-Evklid-App): stare kopije niso več sveže.
let outdated = false;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(STATIC).then((c) => Promise.all(SHELL.map((u) => fetch(u).then((res) => put(c, u, res))))).catch(() => null));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => (!k.startsWith(VERSION) && k !== MODELS) || k === OLD_API).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      // Odprte strani izvedo različico novega service workerja; stara stran se osveži (public/app.js).
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((list) => list.forEach((c) => c.postMessage({ type: "app-version", app: APP })))
      .catch(() => null),
  );
});

// Odjava ali menjava računa (public/offline.js clearPrivate): pobriše vse predpomnilnike API.
self.addEventListener("message", (e) => {
  if (e.data?.type !== "clear-private") return;
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => /-api(-|$)/.test(k)).map((k) => caches.delete(k)))));
});

// Stran ve, da strežnik že ima novo različico (public/app.js, pred osvežitvijo): pobriši stare kopije, da
// osvežitev ob počasnem omrežju ne dobi znova stare vstopne strani iz predpomnilnika. Odgovor: e.ports[0].
self.addEventListener("message", (e) => {
  if (e.data?.type !== "app-stale" || typeof e.data.app !== "string") return;
  const done = Promise.resolve(dropStale(e.data.app)).finally(() => e.ports?.[0]?.postMessage("ok"));
  e.waitUntil(done);
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
        const statics = await caches.open(STATIC);
        const cache = new URL(u, self.location.origin).pathname.startsWith("/vendor/") ? await caches.open(VENDOR) : statics;
        const hit = await cache.match(u);
        if (hit && (cache !== statics || fresh(hit))) return;
        const res = await fetch(u).catch(() => null);
        if (res?.ok) await put(cache, u, res);
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

// Shranjena kopija datoteke aplikacije z oznako različice, ki jo je shranila (glava STAMP).
// Odgovor, ki je nastal s preusmeritvijo, shranimo kot nov odgovor (brskalnik sicer zavrne preusmerjen
// odgovor za navigacijo).
async function put(cache, req, res) {
  if (!res?.ok || outdated) return; // zastarel SW: nove vsebine ne označi s staro različico
  const headers = new Headers(res.headers);
  headers.set(STAMP, APP);
  await cache.put(req, new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers }));
}
const fresh = (hit) => !!APP && !outdated && hit?.headers.get(STAMP) === APP;
// Odgovor vstopne strani z omrežja: ali je strežnik že na drugi različici datotek?
// Zastarele kopije tudi pobrišemo: brskalnik lahko ta service worker vmes ustavi in znova zažene (oznaka v
// pomnilniku se izgubi), stare kopije pa ne smejo več priti na novo stran. Kopije nove različice ostanejo.
function checkVersion(res) {
  return dropStale(res.headers.get(STAMP));
}
function dropStale(v) {
  if (!APP || !v || v === APP) return;
  if (!outdated) self.registration?.update?.().catch?.(() => null); // nov service worker čim prej
  outdated = true;
  return caches
    .open(STATIC)
    .then(async (c) => {
      for (const req of await c.keys()) {
        const hit = await c.match(req);
        if (hit?.headers.get(STAMP) !== v) await c.delete(req);
      }
    })
    .catch(() => null);
}

// Najprej omrežje; uspešen odgovor shranimo, ob napaki ali izteku časa vrnemo shranjenega.
async function networkFirst(req, cacheName, ms, entry = false) {
  const cache = await caches.open(cacheName);
  const net = fetch(req).then((res) => {
    if (tunnelDown(res)) throw new Error("tunnel down");
    const stale = entry ? checkVersion(res) : null;
    if (stale) return stale.then(() => res); // nova različica: najprej pobriše stare kopije, nove ne shrani
    if (res.ok && res.type === "basic" && !privateRes(res)) (cacheName === STATIC ? put(cache, req, res.clone()) : cache.put(req, res.clone())).catch(() => null);
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

// Datoteka aplikacije: kopija iste različice takoj (brez omrežja), sicer najprej omrežje.
async function appFile(req) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(req);
  if (fresh(hit)) return hit;
  return networkFirst(req, STATIC, TIMEOUT.static);
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
    if (STUDENT_LESSON.test(url.pathname) && url.searchParams.get("id")) {
      e.waitUntil(storePublicLesson(url.searchParams.get("id")).catch(() => null));
      return;
    }
    if (NO_CACHE.test(url.pathname) || !PUBLIC_API.test(url.pathname)) return;
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
  // Takoj iz predpomnilnika samo statične datoteke aplikacije in vstopna stran brez poizvedbe; strani, ki
  // jih sestavi strežnik (/sole, /ucbenik/…, /prenesi, seznami .json, manifest), ostanejo najprej omrežje.
  const entry = (url.pathname === "/" || url.pathname === "/index.html") && !url.search;
  if (entry) {
    e.respondWith(networkFirst(req, STATIC, TIMEOUT.entry, true));
    return;
  }
  if (APP_FILE.test(url.pathname) && req.mode !== "navigate") {
    e.respondWith(appFile(req));
    return;
  }
  e.respondWith(networkFirst(req, STATIC, TIMEOUT.static));
});
