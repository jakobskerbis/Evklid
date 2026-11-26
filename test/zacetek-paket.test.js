// Ponovni obisk prijavljenega učenca (N-08, 25. 11. 2026): service worker postreže shranjeno vstopno stran brez začetnih
// podatkov, zato public/zacetek.js podatke Učne poti zahteva v enem klicu (GET /api/zacetni-podatki) takoj v <head>.
// app.js jih vzame namesto verige klicev (račun → profili → pot → načini …: na počasnem 4G trije krogi po ~0,56 s).
// Brez service workerja (prvi obisk) ali z začetnimi podatki v strani ostane vse kot prej (test/zacetek.test.js).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const src = fs.readFileSync(new URL("../public/zacetek.js", import.meta.url), "utf8");

// Najmanjša lažna stran za zacetek.js (brez posnetka in zapisa: Učna pot z okostjem, kot ob ponovnem obisku po 12 urah).
function zagon({ odgovori = {}, sw = true, studentId = "7", zacetni = null, racun = true } = {}) {
  const store = new Map();
  if (studentId != null) store.set("studentId", studentId);
  if (racun) store.set("evklid.racun", "1"); // public/account.js: naprava je bila prijavljena v račun
  const klici = [];
  const el = () => ({ attrs: {}, setAttribute() {}, removeAttribute() {}, querySelectorAll: () => [], hidden: true });
  const podatki = zacetni && { textContent: JSON.stringify(zacetni), parentNode: { removeChild: (x) => (x.removed = true) } };
  const document = {
    documentElement: { setAttribute() {}, removeAttribute() {}, hasAttribute: () => false },
    getElementById: (id) => (id === "evklid-zacetni" && podatki && !podatki.removed ? podatki : null),
    createElement: el,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {},
    readyState: "loading",
  };
  const fetch = (url, o) => {
    klici.push(o?.method ? `${o.method} ${url}` : url);
    const v = odgovori[url];
    if (v === "visi") return new Promise(() => {});
    if (v === 204) return Promise.resolve({ ok: true, status: 204, body: { cancel: () => Promise.resolve() } });
    return Promise.resolve(v === undefined ? { ok: false, status: 404, body: { cancel: () => Promise.resolve() } } : { ok: true, status: 200, json: () => Promise.resolve(JSON.parse(JSON.stringify(v))) });
  };
  const window = { fetch };
  const ctx = {
    window,
    navigator: sw ? { serviceWorker: { controller: {} } } : {},
    localStorage: { getItem: (k) => store.get(k) ?? null, removeItem: (k) => store.delete(k) },
    location: { search: "" },
    URLSearchParams,
    document,
    fetch: (...a) => window.fetch(...a),
    Date,
    requestAnimationFrame: (fn) => fn(),
    setTimeout: () => 0,
    clearTimeout() {},
  };
  vm.runInNewContext(src, ctx);
  return { api: window.evklidZacetek, klici, window };
}
const tick = () => new Promise((r) => setImmediate(r));
// Predmeti iz vm imajo svoje prototipe: primerjamo kopijo.
const k = async (p) => JSON.parse(JSON.stringify(await p));

const D = {
  "/api/account/status": { enabled: true, logged_in: true },
  "/api/config": { mock: false },
  "/api/students": [{ id: 7, name: "Ana", settings: {} }],
  "/api/students/7/conversations": [],
  "/api/students/7/path": { key: "MAT-OS-8", units: [] },
  "/api/students/7/xp": { total: 10 },
  "/api/students/7/modes?path=MAT-OS-8": { modes: [] },
  "/api/paths?subject=MAT&system=SI": [],
};

test("ponovni obisk (stran iz service workerja): en klic za vse podatke Učne poti, app.js ne kliče strežnika", async () => {
  const z = zagon({ odgovori: { "/api/zacetni-podatki": { s: 7, d: D } } });
  assert.deepEqual(z.klici, ["/api/zacetni-podatki"], "namesto štirih klicev en sam, takoj v <head>");
  // app.js vpraša, še preden odgovor pride: počaka isti klic (ne pokliče sam).
  const pot = z.api.vnaprej("/api/students/7/path");
  assert.ok(pot && typeof pot.then === "function");
  assert.deepEqual(await k(pot), D["/api/students/7/path"]);
  for (const url of Object.keys(D)) assert.deepEqual(await k(z.api.vnaprej(url)), D[url], url);
  assert.deepEqual(z.klici, ["/api/zacetni-podatki"], "veriga klicev po zagonu app.js je izginila");
  // Česar paket nima (ali ni del Učne poti), gre na strežnik takoj (ne čaka paketa).
  assert.equal(z.api.vnaprej("/api/students/7/flashcards?path=MAT-OS-8"), null);
  assert.equal(z.api.vnaprej("/api/students/7/level-up"), null, "v paketu ni bilo: app.js pokliče sam");
  // Sprememba (POST) prek fetch: podatki ne veljajo več.
  await z.window.fetch("/api/students/7/practice/next", { method: "POST" });
  assert.equal(z.api.vnaprej("/api/students/7/path"), null);
});

test("ponovni obisk: paket ne uspe (204, napaka, star strežnik) → isti štirje klici kot prej", async () => {
  for (const odgovor of [204, undefined]) {
    const z = zagon({ odgovori: { "/api/zacetni-podatki": odgovor, "/api/config": { mock: true }, "/api/account/status": { enabled: true, logged_in: true } } });
    const cfg = z.api.vnaprej("/api/config"); // app.js vpraša pred odgovorom paketa
    await tick();
    assert.deepEqual(z.klici, ["/api/zacetni-podatki", "/api/account/status", "/api/config", "/api/students", "/api/students/7/conversations"], String(odgovor));
    assert.deepEqual(await k(cfg), { mock: true });
    assert.equal(z.api.vnaprej("/api/config"), null, "samo enkrat");
    assert.equal(await z.api.vnaprej("/api/students"), null, "neuspel klic ne velja");
  }
});

test("ponovni obisk: več profilov (s: null) → seznam iz paketa, pogovori izbranega profila posebej kot prej", async () => {
  const d = { "/api/account/status": D["/api/account/status"], "/api/config": {}, "/api/students": [{ id: 7 }, { id: 8 }] };
  const z = zagon({ odgovori: { "/api/zacetni-podatki": { s: null, d }, "/api/students/7/conversations": [] } });
  await tick();
  assert.deepEqual(z.klici, ["/api/zacetni-podatki", "/api/students/7/conversations"]);
  assert.deepEqual(await k(z.api.vnaprej("/api/students")), d["/api/students"]);
  assert.deepEqual(await k(z.api.vnaprej("/api/students/7/conversations")), []);
  assert.equal(await z.api.vnaprej("/api/students/7/path"), null, "app.js pokliče sam");
});

test("ponovni obisk: sprememba (POST) pred odgovorom paketa → paket ne velja, app.js vpraša strežnik", async () => {
  const z = zagon({ odgovori: { "/api/zacetni-podatki": { s: 7, d: D } } });
  await z.window.fetch("/api/students/7/practice/next", { method: "POST" });
  assert.equal(await z.api.vnaprej("/api/students/7/path"), null);
  // Paket, ki še teče: app.js ga počaka (ne pokliče isto drugič).
  const v = zagon({ odgovori: { "/api/zacetni-podatki": "visi" } });
  const p = v.api.vnaprej("/api/students/7/path");
  assert.ok(p && typeof p.then === "function");
  assert.deepEqual(v.klici, ["/api/zacetni-podatki"]);
});

test("prvi obisk (brez service workerja) in stran s podatki: brez paketa, kot prej", async () => {
  assert.deepEqual(zagon({ sw: false }).klici, ["/api/account/status", "/api/config", "/api/students", "/api/students/7/conversations"]);
  assert.deepEqual(zagon({ zacetni: { s: 7, d: D } }).klici, []);
  assert.deepEqual(zagon({ studentId: null }).klici, ["/api/account/status", "/api/config"], "brez profila samo javna klica");
  assert.deepEqual(zagon({ studentId: "7;x" }).klici, ["/api/account/status", "/api/config"]);
});

// Pregled 2 (#1124): brez računov (domači strežnik, EVKLID_ACCOUNTS izklopljen) poti ni (404 v konzoli ob vsakem
// ponovnem obisku in en krog več). Naprava, ki ni bila nikoli prijavljena (ni evklid.racun), kliče kot prej.
test("ponovni obisk brez računov (naprava ni bila prijavljena): brez paketa, isti štirje klici kot prej", () => {
  assert.deepEqual(zagon({ racun: false }).klici, ["/api/account/status", "/api/config", "/api/students", "/api/students/7/conversations"]);
});
