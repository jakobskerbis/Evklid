// Service worker: aplikacija se odpre tudi brez povezave in ponovno ne prenaša knjižnic.
// - knjižnice in pisave (/vendor/): najprej iz predpomnilnika (se ne spreminjajo),
// - vstopna stran (/ z ali brez poizvedbe, npr. /?pogled=chat, /?koda=): najprej omrežje s kratkim rokom (0,4 s; stran
//   je majhna, ob nespremenjeni samo 304), ob izpadu ali počasni povezavi shranjena kopija (ena, pod »/«). Vsak odgovor strežnika pove
//   različico datotek (glava X-Evklid-App, server/app.js). Če je drugačna od APP tega service workerja, ta do
//   zamenjave ne postreže nobene shranjene kopije več (outdated): nova stran tako nikoli ne dobi starih modulov,
// - stran, ki ji je bila postrežena shranjena (starejša) vstopna stran, ker je omrežje zamujalo, pove svojo
//   različico (sporočilo »page-app«, public/app.js): leni moduli zanjo pridejo iz kopij iste različice, dokler se
//   ne osveži, nikoli iz druge različice kot njen app.js,
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
const SHELL = ["/"];
const ENTRY = "/"; // ključ shranjene vstopne strani (tudi za /index.html in /?…)
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
// Vstopna stran čaka omrežje največ 0,4 s (prej 2,5 s; j 2026-11-10, hiter zagon): ob počasni ali šele vzpostavljeni
// povezavi telefona se takoj odpre shranjena stran iste različice. Če strežnik medtem že ima novo različico, jo
// odgovor v ozadju shrani, stran pa se sama osveži (public/app.js reloadOnceFor), kot prej po 2,5 s.
const TIMEOUT = { entry: 400, static: 4000, api: 7000 };
// Strežnik je objavil novo različico datotek (vstopna stran z drugačno X-Evklid-App): stare kopije niso več sveže.
let outdated = false;
// Odprte strani in različica, ki jo izvajajo (clientId → APP strani; sporočilo »page-app«). Ob ponovnem zagonu
// service workerja se izgubi; strani ga pošljejo znova ob vsaki menjavi service workerja.
const pages = new Map();

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(STATIC).then((c) => Promise.all(SHELL.map((u) => fetch(u).then((res) => put(c, u, res))))).catch(() => null));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => (!k.startsWith(VERSION) && k !== MODELS) || k === OLD_API).map((k) => caches.delete(k))))
      // kopije drugih različic pobrišemo samo, ko ni odprte strani (stara stran še potrebuje svoje lene module)
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((open) => (open.length ? null : pruneStatic()))
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

// Stran pove, katero različico izvaja (public/app.js ob zagonu in ob menjavi service workerja).
self.addEventListener("message", (e) => {
  if (e.data?.type !== "page-app" || typeof e.data.app !== "string" || !e.source?.id) return;
  pages.set(e.source.id, e.data.app);
  asking.get(e.source.id)?.();
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
// Oznaka je različica, ki jo je poslal strežnik (glava X-Evklid-App na vsakem odgovoru), ne APP tega service
// workerja: datoteka nove različice nikoli ne dobi stare oznake (tudi ko se zastarel SW vmes znova zažene).
// Odgovor brez oznake strežnika (stari strežnik) dobi APP. Zasebnega odgovora (no-store) ne shranimo. Glavi
// stiskanja odstranimo, ker je telo že razpakirano (Safari bi sicer lahko zavrnil kopijo).
async function put(cache, req, res) {
  if (!res?.ok || privateRes(res)) return;
  const headers = new Headers(res.headers);
  headers.set(STAMP, res.headers.get(STAMP) || APP);
  headers.delete("content-encoding");
  headers.delete("content-length");
  await cache.put(req, new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers }));
}
// Različica, ki jo izvaja stran, iz katere je zahteva (prazno: neznana, npr. stran brez oznake). Strani, ki je ta
// service worker ni naložil (odprta pred menjavo ali ponovnim zagonom service workerja), enkrat vprašamo
// (»which-app«, public/app.js odgovori s »page-app«), največ 400 ms; odgovor velja do konca strani.
const asking = new Map(); // clientId → razreši čakanje na odgovor
const asked = new Set();
async function pageApp(id) {
  if (!id || pages.has(id)) return (id && pages.get(id)) || "";
  if (!APP || asked.has(id)) return "";
  asked.add(id);
  try {
    // matchAll (ne clients.get, ki pri strani med nalaganjem čaka na konec navigacije)
    const c = (await self.clients.matchAll({ type: "window" })).find((x) => x.id === id);
    if (!c) return "";
    await new Promise((done) => {
      const t = setTimeout(done, 400);
      asking.set(id, () => (clearTimeout(t), done()));
      c.postMessage({ type: "which-app" });
    });
  } catch {}
  asking.delete(id);
  return pages.get(id) || "";
}
// Kopija je sveža za to stran: iste različice kot stran (stara stran iz predpomnilnika dobi svoje stare module),
// sicer iste različice kot ta service worker, dokler strežnik ne objavi nove. page: različica strani (pageApp).
function fresh(hit, page = "") {
  const stamp = hit?.headers.get(STAMP);
  if (!APP || !stamp) return false;
  if (page) return stamp === page;
  return !outdated && stamp === APP;
}
// Odgovor z omrežja: ali je strežnik že na drugi različici datotek? (ne kličemo registration.update(): brskalnik
// novi service worker poišče sam ob navigaciji, klic iz fetch pa ga je pustil čakati 20–30 s; pregled B2 P1-2)
function noteVersion(res) {
  const v = res.headers.get(STAMP);
  if (APP && v && v !== APP) outdated = true;
  return v;
}
// Pobriše kopije, ki jih ne izvaja nobena odprta stran in niso različice keep (ali APP). Brskalnik lahko service
// worker vmes ustavi in znova zažene (outdated se izgubi), zato stare kopije res pobrišemo.
async function pruneStatic(keep = APP) {
  try {
    // (ne clients.get: za stran, ki se šele nalaga, čaka na konec njene navigacije – zastoj, če jo čaka ta odgovor)
    const live = await self.clients.matchAll({ type: "window" });
    const open = new Set(live.map((c) => pages.get(c.id)).filter(Boolean));
    if (pages.size > 50) for (const id of pages.keys()) if (!live.some((c) => c.id === id)) pages.delete(id);
    const c = await caches.open(STATIC);
    for (const req of await c.keys()) {
      const stamp = (await c.match(req))?.headers.get(STAMP);
      if (stamp !== keep && !open.has(stamp)) await c.delete(req);
    }
  } catch {}
}
function dropStale(v) {
  if (!APP || !v || v === APP) return;
  outdated = true;
  return pruneStatic(v);
}

// Najprej omrežje; uspešen odgovor shranimo, ob napaki ali izteku časa vrnemo shranjenega.
// Shranjena kopija ob počasnem omrežju ali izpadu: samo različice, ki jo izvaja stran (oziroma APP, dokler strežnik
// ne objavi nove). Vstopne strani zastarel service worker ne postreže iz predpomnilnika (počaka omrežje).
function usable(hit, entry, page, cacheName, nav = false) {
  const stamp = hit.headers.get(STAMP);
  // strani strežnika (učbenik, /3d …) brez povezave: shranjena kopija je boljša kot nič (pregled A2, P3-8)
  if (cacheName !== STATIC || !APP || !stamp || (nav && !entry)) return true;
  if (entry) return !outdated;
  const want = page || (outdated ? "" : APP);
  return stamp === want;
}
// entry: vstopna stran (shranjena pod ENTRY, ne glede na poizvedbo); clientId: stran, ki je zahtevala datoteko;
// onPage(v): različica vstopne strani, ki je bila postrežena (z omrežja ali shranjena kopija).
async function networkFirst(req, cacheName, ms, { entry = false, page = "", onPage = null } = {}) {
  const cache = await caches.open(cacheName);
  const key = entry ? ENTRY : req;
  const net = fetch(req).then((res) => {
    if (tunnelDown(res)) throw new Error("tunnel down");
    const v = cacheName === STATIC ? noteVersion(res) : null;
    if (req.mode === "navigate") onPage?.(v || APP);
    // nova različica vstopne strani: najprej pobriše kopije, ki jih nobena odprta stran ne izvaja
    if (entry && APP && v && v !== APP) return Promise.resolve(dropStale(v)).then(() => (put(cache, key, res.clone()).catch(() => null), res));
    if (res.ok && res.type === "basic" && !privateRes(res)) (cacheName === STATIC ? put(cache, key, res.clone()) : cache.put(req, res.clone())).catch(() => null);
    return res;
  });
  try {
    return await withTimeout(net, ms);
  } catch {
    const hit = await cache.match(key);
    if (hit && usable(hit, entry, page, cacheName, req.mode === "navigate")) {
      if (req.mode === "navigate") onPage?.(hit.headers.get(STAMP) || APP);
      // Odgovor z omrežja, ki ga ne bomo uporabili, prekinemo: neprebrano telo bi service worker držalo »zasedenega«
      // in novi service worker bi čakal (waiting). Kopija za predpomnilnik (clone) se prebere neodvisno.
      net.then((r) => r?.body?.cancel?.().catch(() => null)).catch(() => null);
      return hit;
    }
    try {
      return await net; // počasna povezava brez kopije: vseeno počakamo na omrežje
    } catch {
      if (req.mode === "navigate") return (await caches.match(ENTRY)) || Response.error();
      return new Response(JSON.stringify({ error: "offline", offline: true }), {
        status: 503,
        headers: { "Content-Type": "application/json", "X-Offline": "1" },
      });
    }
  }
}

// Datoteka aplikacije: kopija iste različice takoj (brez omrežja), sicer najprej omrežje.
async function appFile(req, clientId) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(req);
  const page = hit ? await pageApp(clientId) : "";
  if (fresh(hit, page)) return hit;
  return networkFirst(req, STATIC, TIMEOUT.static, { page });
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
  // Vnaprej izdelan PDF učbenika (server/ucbenik-pdf.js): velik prenos z delnimi zahtevki (Range), ki ga brskalnik
  // opravi sam (predpomnilnik HTTP z ETag); kopija v predpomnilniku aplikacije bi le podvojila prostor.
  if (url.pathname.startsWith("/ucbenik-pdf/")) return;
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
  // Vstopna stran: vsaka navigacija na / ali /index.html, tudi s poizvedbo (bližnjice ikone /?pogled=, koda
  // razreda /?koda=, /?ref=, /?vir= …; pregled A2 P1-1). Takoj iz predpomnilnika samo statične datoteke
  // aplikacije; strani, ki jih sestavi strežnik (/sole, /ucbenik/…, /3d, /kalkulator.html, manifest), ostanejo
  // najprej omrežje, tudi te pa preverijo različico (noteVersion v networkFirst).
  const entry = (url.pathname === "/" || url.pathname === "/index.html") && (req.mode === "navigate" || !url.search);
  // Zahteve nove strani dobijo kopije različice strani, ki jo je dobila (fresh): shranjena (starejša) stran svoje
  // stare module, nova stran nove. Zapis velja za novo stran (brskalnik lahko ob osvežitvi isti id uporabi znova).
  const id = req.mode === "navigate" ? e.resultingClientId || "" : "";
  let served = false;
  const onPage = (v) => {
    if (served || !id) return;
    served = true;
    asked.delete(id);
    if (v) pages.set(id, v);
    else pages.delete(id);
  };
  if (entry) {
    e.respondWith(networkFirst(req, STATIC, TIMEOUT.entry, { entry: true, onPage }));
    return;
  }
  if (APP_FILE.test(url.pathname) && req.mode !== "navigate") {
    e.respondWith(appFile(req, e.clientId));
    return;
  }
  e.respondWith(networkFirst(req, STATIC, TIMEOUT.static, { onPage }));
});
