// P7: service worker ne shrani osebnih odgovorov API; ob odjavi (sporočilo clear-private) in ob novi
// različici se predpomnilnik API pobriše.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const SRC = fs.readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");

function load({ cacheNames = [] } = {}) {
  const handlers = {};
  const stores = new Map(cacheNames.map((n) => [n, new Map()]));
  const caches = {
    open: async (n) => {
      if (!stores.has(n)) stores.set(n, new Map());
      const m = stores.get(n);
      return { put: async (req, res) => m.set(typeof req === "string" ? req : req.url, res), match: async (req) => m.get(typeof req === "string" ? req : req.url), keys: async () => [...m.keys()].map((url) => ({ url })), delete: async (r) => m.delete(r.url ?? r), addAll: async () => {} };
    },
    keys: async () => [...stores.keys()],
    delete: async (n) => stores.delete(n),
    match: async () => undefined,
  };
  const self = { location: { origin: "https://evklid.test" }, addEventListener: (t, fn) => (handlers[t] ||= []).push(fn), skipWaiting() {}, clients: { claim: async () => {} } };
  const fetched = [];
  const fetchFn = async (req) => {
    const u = typeof req === "string" ? req : req.url;
    fetched.push(u);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json", ...(u.includes("zasebno") ? { "cache-control": "private, no-store" } : {}) } });
  };
  const ctx = vm.createContext({ self, caches, fetch: fetchFn, URL, Response, setTimeout, clearTimeout, Promise, JSON, console });
  // Odgovor fetch ima type »basic« v brskalniku; tu ga nastavimo ročno.
  ctx.fetch = async (req) => Object.defineProperty(await fetchFn(req), "type", { value: "basic" });
  vm.runInContext(SRC, ctx);
  const fire = async (type, ev) => {
    const waits = [];
    for (const fn of handlers[type] || []) fn({ ...ev, waitUntil: (p) => waits.push(p), respondWith: (p) => waits.push((ev.responded = true, p)) });
    await Promise.all(waits);
    await new Promise((r) => setTimeout(r, 10));
    return ev;
  };
  const get = (path) => fire("fetch", { request: { method: "GET", url: `https://evklid.test${path}`, mode: "cors" } });
  return { stores, fire, get, fetched };
}

test("P7: osebni odgovori API gredo mimo predpomnilnika, javni se shranijo", async () => {
  const sw = load();
  for (const p of ["/api/students", "/api/students/1/conversations", "/api/conversations/5", "/api/students/1/progress", "/api/account", "/api/teacher/home", "/api/reports"]) {
    const ev = await sw.get(p);
    assert.ok(!ev.responded, `${p} ne gre skozi service worker`);
  }
  const ev = await sw.get("/api/textbook/toc?book=MAT-OS-7");
  assert.ok(ev.responded);
  const saved = [...sw.stores.entries()].filter(([n]) => /-api/.test(n)).flatMap(([, m]) => [...m.keys()]);
  assert.deepEqual(saved, ["https://evklid.test/api/textbook/toc?book=MAT-OS-7"]);
  // Javna pot z oznako »zasebno« (Cache-Control: private/no-store) se ne shrani.
  await sw.get("/api/topic?id=zasebno");
  assert.equal([...sw.stores.entries()].filter(([n]) => /-api/.test(n)).flatMap(([, m]) => [...m.keys()]).length, 1);
});

test("P7: ob odjavi in novi različici se predpomnilnik API pobriše", async () => {
  const sw = load({ cacheNames: ["evklid-v1-api", "evklid-v1-static", "evklid-3d-v1"] });
  await sw.fire("activate", {});
  assert.deepEqual([...sw.stores.keys()].sort(), ["evklid-3d-v1", "evklid-v1-static"], "stari predpomnilnik z osebnimi odgovori je pobrisan");
  await sw.get("/api/paths");
  assert.ok([...sw.stores.keys()].some((n) => /-api/.test(n)));
  await sw.fire("message", { data: { type: "clear-private" } });
  assert.ok(![...sw.stores.keys()].some((n) => /-api/.test(n)), "odjava pobriše predpomnilnik API");
  assert.ok(sw.stores.has("evklid-v1-static"), "datoteke aplikacije ostanejo");
});

test("P7: obiskana lekcija – shrani se javna kopija (/api/lesson), osebna pot ne", async () => {
  const sw = load();
  const ev = await sw.get("/api/students/3/lesson?id=MAT-OS-7-ulomki");
  assert.ok(!ev.responded, "osebna lekcija gre mimo service workerja");
  const saved = () => [...sw.stores.entries()].filter(([n]) => /-api/.test(n)).flatMap(([, m]) => [...m.keys()]);
  assert.deepEqual(saved(), ["https://evklid.test/api/lesson?id=MAT-OS-7-ulomki"]);
  await sw.get("/api/students/3/lesson?id=MAT-OS-7-ulomki");
  assert.equal(sw.fetched.filter((u) => u.includes("/api/lesson?")).length, 1, "javna kopija se prenese samo enkrat");
});
