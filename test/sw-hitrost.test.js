// Service worker (public/sw.js): datoteke aplikacije iste različice se odprejo takoj iz predpomnilnika,
// osebni API odgovori in strani strežnika gredo vedno najprej na omrežje (naloga hitrost, j 6. 11. 2026).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const ORIGIN = "https://evklid.test";

// Majhen posnetek okolja service workerja: Cache API v pomnilniku, fetch, ki šteje klice.
// served: različica datotek, ki jo strežnik pošlje z vstopno stranjo (glava X-Evklid-App); hang: omrežje ne odgovori.
function loadSw(app, net = {}) {
  const stores = new Map();
  const key = (r) => (typeof r === "string" ? new URL(r, ORIGIN).href : r.url);
  const cacheFor = (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const m = stores.get(name);
    return {
      match: async (r) => m.get(key(r))?.clone(),
      put: async (r, res) => void m.set(key(r), res),
      keys: async () => [...m.keys()].map((url) => ({ url })),
      delete: async (r) => m.delete(key(r)),
    };
  };
  const caches = {
    open: async (n) => cacheFor(n),
    keys: async () => [...stores.keys()],
    delete: async (n) => stores.delete(n),
    match: async (r) => {
      for (const n of stores.keys()) {
        const hit = await cacheFor(n).match(r);
        if (hit) return hit;
      }
    },
  };
  const calls = [];
  const fetchFn = async (r) => {
    const url = key(r);
    calls.push(url);
    if (net.hang) return new Promise(() => {});
    const headers = { "content-type": "text/plain" };
    // strežnik pošlje različico datotek na vsakem odgovoru zunaj API (server/app.js)
    if (net.served && !new URL(url).pathname.startsWith("/api/")) headers["X-Evklid-App"] = net.served;
    if (net.slowEntry && new URL(url).pathname === "/") await new Promise((r) => setTimeout(r, net.slowEntry));
    if (net.privateEntry && new URL(url).pathname === "/") headers["cache-control"] = "no-store";
    const res = new Response(`net:${url}`, { status: net.status?.[new URL(url).pathname] || 200, headers });
    Object.defineProperty(res, "type", { value: "basic" });
    return res;
  };
  const listeners = {};
  const updates = [];
  const open = new Set(net.open || []); // odprte strani (id)
  const clients = { claim: async () => {}, matchAll: async () => [...open].map((id) => ({ id, postMessage() {} })), get: async (id) => (open.has(id) ? { id } : undefined) };
  const self = { addEventListener: (t, f) => (listeners[t] ||= []).push(f), location: { origin: ORIGIN }, skipWaiting() {}, clients, registration: { update: async () => void updates.push(1) } };
  // preveri: ms do preverjanja shranjene vstopne strani v ozadju (ENTRY_PREVERI, v aplikaciji 3 s)
  const src = fs
    .readFileSync(new URL("../public/sw.js", import.meta.url), "utf8")
    .replace('const APP = "";', `const APP = "${app}";`)
    .replace(/const ENTRY_PREVERI = \d+;/, `const ENTRY_PREVERI = ${net.preveri ?? 20};`);
  vm.runInNewContext(src, { self, caches, fetch: fetchFn, Response, Headers, URL, setTimeout, clearTimeout, Promise, JSON, Error, AbortController });
  // ids: { clientId, resultingClientId } (stran, ki zahteva / stran, ki bo nastala z navigacijo)
  const get = async (path, mode = "no-cors", ids = {}) => {
    let p = null;
    for (const f of listeners.fetch) f({ request: { method: "GET", url: new URL(path, ORIGIN).href, mode }, respondWith: (x) => (p = x), waitUntil() {}, ...ids });
    return p ? (await p).text() : null; // null: SW se ne vmeša (brskalnik gre sam na omrežje)
  };
  const message = (data, source) => {
    const waits = [];
    for (const f of listeners.message) f({ data, source, ports: [], waitUntil: (x) => waits.push(x) });
    return Promise.all(waits);
  };
  return { get, message, calls, caches, cacheFor, updates, open };
}

test("datoteka aplikacije iste različice: takoj iz predpomnilnika, brez omrežja", async () => {
  const sw = loadSw("abc123");
  assert.equal(await sw.get("/graph/calc.js"), `net:${ORIGIN}/graph/calc.js`); // prvič: omrežje
  await new Promise((r) => setTimeout(r, 10)); // shranjevanje teče v ozadju
  sw.calls.length = 0;
  assert.equal(await sw.get("/graph/calc.js"), `net:${ORIGIN}/graph/calc.js`);
  assert.deepEqual(sw.calls, [], "druga zahteva ne sme na omrežje");
  // vstopna stran iste različice (N-08b, j 26. 11. 2026): takoj iz predpomnilnika, omrežje jo preveri šele v ozadju
  await sw.get("/", "navigate");
  await new Promise((r) => setTimeout(r, 10));
  sw.calls.length = 0;
  assert.equal(await sw.get("/", "navigate"), `net:${ORIGIN}/`, "shranjena kopija (z omrežja ob prvem odprtju)");
  assert.deepEqual(sw.calls, [], "odprtje ne čaka omrežja");
  await new Promise((r) => setTimeout(r, 60));
  assert.deepEqual(sw.calls, [`${ORIGIN}/`], "preverjanje v ozadju po ENTRY_PREVERI");
});

// Scenarij pregledovalca (swmix): telefon ima shranjeno različico »stara«, strežnik pa že teče z »nova«.
// Prej: stara vstopna stran in stari app.js iz predpomnilnika, leni moduli pa z omrežja (nova) – mešanica.
// N-08b (j 26. 11. 2026): prvo odprtje po objavi je takoj shranjena stran z moduli svoje različice (stran se sama
// osveži, public/app.js reloadOnceFor); preverjanje v ozadju pobriše stare kopije, naslednje odprtje je nova stran.
test("po objavi nove različice: stara stran takoj s svojimi moduli, nato nova vstopna stran in nobena stara kopija več (brez mešanja)", async () => {
  const sw = loadSw("stara", { served: "nova" });
  const st = await sw.caches.open("evklid-v1-static");
  for (const f of ["/", "/app.js", "/graph/tools.js"]) await st.put(`${ORIGIN}${f}`, new Response(`staro:${f}`, { headers: { "X-Evklid-App": "stara" } }));
  assert.equal(await sw.get("/", "navigate", { resultingClientId: "s" }), "staro:/", "prvo odprtje po objavi: shranjena stran takoj");
  sw.open.add("s");
  assert.equal(await sw.get("/app.js", "no-cors", { clientId: "s" }), "staro:/app.js", "stara stran: app.js njene različice");
  await new Promise((r) => setTimeout(r, 60)); // preverjanje v ozadju najde novo različico
  sw.open.delete("s"); // stran se osveži
  assert.equal(await sw.get("/", "navigate"), `net:${ORIGIN}/`, "po preverjanju: nova vstopna stran");
  assert.equal(sw.updates.length, 0, "brez registration.update() iz fetch (nov SW bi obvisel v »waiting«, pregled B2 P1-2)");
  for (const f of ["/app.js", "/graph/tools.js"]) assert.equal(await sw.get(f), `net:${ORIGIN}${f}`, `${f}: nova različica, ne stara kopija`);
  await new Promise((r) => setTimeout(r, 10));
  // stare kopije so pobrisane (tudi če brskalnik service worker vmes znova zažene), nove imajo oznako nove različice
  for (const f of ["/", "/app.js", "/graph/tools.js"]) assert.notEqual((await st.match(`${ORIGIN}${f}`))?.headers.get("X-Evklid-App"), "stara", f);
});

// Pregled A2 P1-1: vstop s poizvedbo (bližnjice ikone, koda razreda, vir) mora iti skozi isto preverjanje.
for (const q of ["/?pogled=chat", "/?koda=ABC123", "/index.html?ref=x"]) {
  test(`vstop s poizvedbo ${q}: po objavi nobena stara kopija modula`, async () => {
    const sw = loadSw("stara", { served: "nova" });
    const st = await sw.caches.open("evklid-v1-static");
    for (const f of ["/", "/app.js"]) await st.put(`${ORIGIN}${f}`, new Response(`staro:${f}`, { headers: { "X-Evklid-App": "stara" } }));
    assert.equal(await sw.get(q, "navigate"), "staro:/", "takoj shranjena vstopna stran (ista kopija kot »/«)");
    await new Promise((r) => setTimeout(r, 60)); // preverjanje v ozadju najde novo različico
    assert.equal(await sw.get(q, "navigate"), `net:${ORIGIN}${q}`, "naslednje odprtje: nova stran");
    assert.equal(await sw.get("/app.js"), `net:${ORIGIN}/app.js`, "app.js nove različice");
    await new Promise((r) => setTimeout(r, 10));
    assert.equal(await st.match(`${ORIGIN}${q}`), undefined, "kopija s poizvedbo se ne shrani posebej (samo »/«)");
  });
}

test("kopija dobi oznako različice, ki jo je poslal strežnik (ne APP service workerja); no-store se ne shrani", async () => {
  const sw = loadSw("stara", { served: "nova" });
  await sw.get("/graph/calc.js");
  await new Promise((r) => setTimeout(r, 10));
  const hit = await (await sw.caches.open("evklid-v1-static")).match(`${ORIGIN}/graph/calc.js`);
  assert.equal(hit.headers.get("X-Evklid-App"), "nova");
  assert.equal(hit.headers.get("content-encoding"), null);
});

// Pregled B2 P2-1: stara stran iz predpomnilnika (vstopna stran zamuja) do osvežitve dobiva svoje lene module.
test("počasna vstopna stran ob objavi: stara stran dobi lene module svoje različice, nova stran nove", async () => {
  const sw = loadSw("stara", { served: "nova", slowEntry: 300, open: ["stara-stran"] });
  const st = await sw.caches.open("evklid-v1-static");
  for (const f of ["/", "/app.js", "/graph/tools.js"]) await st.put(`${ORIGIN}${f}`, new Response(`staro:${f}`, { headers: { "X-Evklid-App": "stara" } }));
  const t0 = Date.now();
  assert.equal(await sw.get("/", "navigate", { resultingClientId: "stara-stran" }), "staro:/", "shranjena stran takoj");
  assert.ok(Date.now() - t0 < 200, "brez čakanja na počasno omrežje");
  await new Promise((r) => setTimeout(r, 500)); // preverjanje v ozadju najde novo različico, kopije za odprto staro stran ostanejo
  assert.equal(await sw.get("/graph/tools.js", "no-cors", { clientId: "stara-stran" }), "staro:/graph/tools.js");
  assert.equal(await sw.get("/graph/tools.js", "no-cors", { clientId: "nova-stran" }), `net:${ORIGIN}/graph/tools.js`);
});

test("ista različica na strežniku: kopije modulov ostanejo takojšnje", async () => {
  const sw = loadSw("ista", { served: "ista" });
  const st = await sw.caches.open("evklid-v1-static");
  await st.put(`${ORIGIN}/app.js`, new Response("shranjeno", { headers: { "X-Evklid-App": "ista" } }));
  await sw.get("/", "navigate");
  sw.calls.length = 0;
  assert.equal(await sw.get("/app.js"), "shranjeno");
  assert.deepEqual(sw.calls, []);
  assert.equal(sw.updates.length, 0);
});

test("vstopna stran brez povezave (omrežje ne odgovori): v kratkem roku shranjena kopija", async () => {
  const sw = loadSw("abc", { hang: true });
  await (await sw.caches.open("evklid-v1-static")).put(`${ORIGIN}/`, new Response("shranjena stran", { headers: { "X-Evklid-App": "abc" } }));
  const t0 = Date.now();
  assert.equal(await sw.get("/", "navigate"), "shranjena stran");
  assert.ok(Date.now() - t0 < 2000, "rok vstopne strani je kratek (1 s)");
});

test("nova različica aplikacije: stara kopija ni več sveža, gre na omrežje", async () => {
  const sw = loadSw("nova");
  const old = new Response("staro", { headers: { "X-Evklid-App": "stara" } });
  await (await sw.caches.open("evklid-v1-static")).put(`${ORIGIN}/app.js`, old);
  assert.equal(await sw.get("/app.js"), `net:${ORIGIN}/app.js`);
  assert.deepEqual(sw.calls, [`${ORIGIN}/app.js`]);
});

test("API, strani strežnika in poizvedbe ostanejo najprej omrežje", async () => {
  const sw = loadSw("abc123");
  for (const path of ["/api/formulas", "/sole", "/3d/modeli/seznam.json"]) {
    const mode = path.startsWith("/api") || path.endsWith(".json") ? "cors" : "navigate";
    await sw.get(path, mode);
    await new Promise((r) => setTimeout(r, 10));
    sw.calls.length = 0;
    await sw.get(path, mode);
    assert.deepEqual(sw.calls, [`${ORIGIN}${path}`], `${path} mora vsakič najprej na omrežje`);
  }
  // prijava, plačila in osebni API (P7): SW se sploh ne vmeša, nič se ne shrani
  assert.equal(await sw.get("/api/auth/me", "cors"), null);
  assert.equal(await sw.get("/api/progress", "cors"), null);
});

test("vstopna stran (N-08b): osebna stran strežnika se v ozadju ne shrani, kopija ostane in se odpre takoj", async () => {
  const sw = loadSw("abc", { served: "abc", privateEntry: true });
  const st = await sw.caches.open("evklid-v1-static");
  await st.put(`${ORIGIN}/`, new Response("javna kopija", { headers: { "X-Evklid-App": "abc" } }));
  assert.equal(await sw.get("/", "navigate"), "javna kopija");
  await new Promise((r) => setTimeout(r, 60));
  assert.equal(await (await st.match(`${ORIGIN}/`)).text(), "javna kopija", "no-store ne zamenja kopije");
  assert.equal(await sw.get("/?ref=sola", "navigate"), "javna kopija", "tudi vstop s poizvedbo");
});

test("vstopna stran (N-08b): prijava z geslom (401) pobriše kopijo, naslednje odprtje gre na omrežje (prijava)", async () => {
  const sw = loadSw("abc", { served: "abc", status: { "/": 401 } });
  const st = await sw.caches.open("evklid-v1-static");
  await st.put(`${ORIGIN}/`, new Response("shranjena stran", { headers: { "X-Evklid-App": "abc" } }));
  assert.equal(await sw.get("/", "navigate"), "shranjena stran");
  await new Promise((r) => setTimeout(r, 60));
  assert.equal(await st.match(`${ORIGIN}/`), undefined, "kopija pobrisana");
  sw.calls.length = 0;
  await sw.get("/", "navigate");
  assert.deepEqual(sw.calls, [`${ORIGIN}/`], "naslednje odprtje: omrežje");
});

test("vstopna stran (N-08b): kopija druge različice ni takojšnja (čaka omrežje do 1 s)", async () => {
  const sw = loadSw("nova", { served: "nova" });
  const st = await sw.caches.open("evklid-v1-static");
  await st.put(`${ORIGIN}/`, new Response("stara kopija", { headers: { "X-Evklid-App": "stara" } }));
  assert.equal(await sw.get("/", "navigate"), `net:${ORIGIN}/`);
});

test("brez različice (APP prazen): datoteke aplikacije kot prej najprej omrežje", async () => {
  const sw = loadSw("");
  await sw.get("/app.js");
  await new Promise((r) => setTimeout(r, 10));
  sw.calls.length = 0;
  await sw.get("/app.js");
  assert.deepEqual(sw.calls, [`${ORIGIN}/app.js`]);
});
