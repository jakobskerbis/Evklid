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
    const res = new Response(`net:${url}`, { status: 200, headers });
    Object.defineProperty(res, "type", { value: "basic" });
    return res;
  };
  const listeners = {};
  const updates = [];
  const open = new Set(net.open || []); // odprte strani (id)
  const clients = { claim: async () => {}, matchAll: async () => [...open].map((id) => ({ id, postMessage() {} })), get: async (id) => (open.has(id) ? { id } : undefined) };
  const self = { addEventListener: (t, f) => (listeners[t] ||= []).push(f), location: { origin: ORIGIN }, skipWaiting() {}, clients, registration: { update: async () => void updates.push(1) } };
  const src = fs.readFileSync(new URL("../public/sw.js", import.meta.url), "utf8").replace('const APP = "";', `const APP = "${app}";`);
  vm.runInNewContext(src, { self, caches, fetch: fetchFn, Response, Headers, URL, setTimeout, clearTimeout, Promise, JSON, Error });
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
  // vstopna stran pa vedno najprej omrežje (pregled PR #481, točka 1): po objavi pride nova stran takoj
  await sw.get("/", "navigate");
  await new Promise((r) => setTimeout(r, 10));
  sw.calls.length = 0;
  await sw.get("/", "navigate");
  assert.deepEqual(sw.calls, [`${ORIGIN}/`]);
});

// Scenarij pregledovalca (swmix): telefon ima shranjeno različico »stara«, strežnik pa že teče z »nova«.
// Prej: stara vstopna stran in stari app.js iz predpomnilnika, leni moduli pa z omrežja (nova) – mešanica.
test("po objavi nove različice: nova vstopna stran in nobena stara kopija modula več (brez mešanja)", async () => {
  const sw = loadSw("stara", { served: "nova" });
  const st = await sw.caches.open("evklid-v1-static");
  for (const f of ["/", "/app.js", "/graph/tools.js"]) await st.put(`${ORIGIN}${f}`, new Response(`staro:${f}`, { headers: { "X-Evklid-App": "stara" } }));
  assert.equal(await sw.get("/", "navigate"), `net:${ORIGIN}/`, "prvo odprtje po objavi: nova vstopna stran");
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
    assert.equal(await sw.get(q, "navigate"), `net:${ORIGIN}${q}`);
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
  const sw = loadSw("stara", { served: "nova", slowEntry: 1500, open: ["stara-stran"] });
  const st = await sw.caches.open("evklid-v1-static");
  for (const f of ["/", "/app.js", "/graph/tools.js"]) await st.put(`${ORIGIN}${f}`, new Response(`staro:${f}`, { headers: { "X-Evklid-App": "stara" } }));
  assert.equal(await sw.get("/", "navigate", { resultingClientId: "stara-stran" }), "staro:/", "po roku vstopne strani (1 s) shranjena stran");
  await new Promise((r) => setTimeout(r, 700)); // odgovor nove različice pride, kopije za odprto staro stran ostanejo
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
  for (const path of ["/api/formulas", "/sole", "/3d/modeli/seznam.json", "/?ref=sola"]) {
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

test("brez različice (APP prazen): datoteke aplikacije kot prej najprej omrežje", async () => {
  const sw = loadSw("");
  await sw.get("/app.js");
  await new Promise((r) => setTimeout(r, 10));
  sw.calls.length = 0;
  await sw.get("/app.js");
  assert.deepEqual(sw.calls, [`${ORIGIN}/app.js`]);
});
