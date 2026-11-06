// Service worker (public/sw.js): datoteke aplikacije iste različice se odprejo takoj iz predpomnilnika,
// osebni API odgovori in strani strežnika gredo vedno najprej na omrežje (naloga hitrost, j 6. 11. 2026).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const ORIGIN = "https://evklid.test";

// Majhen posnetek okolja service workerja: Cache API v pomnilniku, fetch, ki šteje klice.
function loadSw(app) {
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
    const res = new Response(`net:${url}`, { status: 200, headers: { "content-type": "text/plain" } });
    Object.defineProperty(res, "type", { value: "basic" });
    return res;
  };
  const listeners = {};
  const self = { addEventListener: (t, f) => (listeners[t] = f), location: { origin: ORIGIN }, skipWaiting() {}, clients: { claim: async () => {} } };
  const src = fs.readFileSync(new URL("../public/sw.js", import.meta.url), "utf8").replace('const APP = "";', `const APP = "${app}";`);
  vm.runInNewContext(src, { self, caches, fetch: fetchFn, Response, Headers, URL, setTimeout, clearTimeout, Promise, JSON, Error });
  const get = async (path, mode = "no-cors") => {
    let p = null;
    listeners.fetch({ request: { method: "GET", url: new URL(path, ORIGIN).href, mode }, respondWith: (x) => (p = x), waitUntil() {} });
    return p ? (await p).text() : null; // null: SW se ne vmeša (brskalnik gre sam na omrežje)
  };
  return { get, calls, caches, cacheFor };
}

test("datoteka aplikacije iste različice: takoj iz predpomnilnika, brez omrežja", async () => {
  const sw = loadSw("abc123");
  assert.equal(await sw.get("/graph/calc.js"), `net:${ORIGIN}/graph/calc.js`); // prvič: omrežje
  await new Promise((r) => setTimeout(r, 10)); // shranjevanje teče v ozadju
  sw.calls.length = 0;
  assert.equal(await sw.get("/graph/calc.js"), `net:${ORIGIN}/graph/calc.js`);
  assert.deepEqual(sw.calls, [], "druga zahteva ne sme na omrežje");
  // vstopna stran brez poizvedbe tudi
  await sw.get("/", "navigate");
  await new Promise((r) => setTimeout(r, 10));
  sw.calls.length = 0;
  await sw.get("/", "navigate");
  assert.deepEqual(sw.calls, []);
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
