// Nov poskus uvoza po napaki (?r=, public/app.js loadGames, games/subjects/index.js importPack) je ista datoteka:
// service worker jo shrani in najde brez r (public/sw.js appFileKey), da paket nalog, prenesen šele v drugem poskusu,
// deluje tudi ob naslednjem zagonu brez povezave (uvoz brez ?r=; pregled 2 #816, točka 4). Pravi Chromium s service workerjem.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
test.after(() => chromium?.close());

test("service worker: datoteka, prenesena z ?r=, je brez povezave na voljo brez ?r=", { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 120000 }, async (t) => {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  const ctx = await chromium.newContext({ serviceWorkers: "allow" });
  t.after(async () => {
    await ctx.close();
    server.close();
  });
  const p = await ctx.newPage();
  await p.goto(base + "/");
  await p.waitForFunction(() => navigator.serviceWorker?.controller, null, { timeout: 30000 });
  const get = (u) => p.evaluate((u) => fetch(u).then(async (r) => ({ status: r.status, pack: (await r.text()).includes("CONCEPTS") }), () => ({ status: 0, pack: false })), u);
  assert.deepEqual(await get("/games/subjects/fiz.js?r=2"), { status: 200, pack: true }, "drugi poskus s povezavo");
  await p.waitForTimeout(500); // shranjevanje v predpomnilnik teče ob odgovoru
  await ctx.setOffline(true);
  assert.deepEqual(await get("/games/subjects/fiz.js"), { status: 200, pack: true }, "brez povezave: isti paket brez ?r=");
  assert.deepEqual(await get("/games/subjects/fiz.js?r=3"), { status: 200, pack: true }, "brez povezave: tudi nov poskus");
  assert.notEqual((await get("/games/subjects/kem.js")).status, 200, "neprenesen paket brez povezave ni na voljo");
});

// Meritev hitrosti 21. 11. 2026: ob prvem obisku je service worker vsako datoteko, ki jo je stran pravkar prenesla, zahteval
// še enkrat (~190 zahtev na pristajalni strani). Zdaj jo vzame iz predpomnilnika brskalnika (public/sw.js, force-cache).
test("service worker: ob prvem obisku shrani prenesene datoteke brez ponovne zahteve na strežnik, brez povezave so na voljo", { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 120000 }, async (t) => {
  const http = await import("node:http");
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const hits = new Map();
  const server = http.createServer((req, res) => {
    const u = req.url.split("?")[0];
    hits.set(u, (hits.get(u) || 0) + 1);
    app(req, res);
  }).listen(0);
  const base = `http://localhost:${server.address().port}`;
  const ctx = await chromium.newContext({ serviceWorkers: "allow" });
  t.after(async () => {
    await ctx.close();
    server.close();
  });
  const p = await ctx.newPage();
  await p.goto(base + "/");
  await p.waitForFunction(() => navigator.serviceWorker?.controller, null, { timeout: 30000 });
  const FILES = ["/app.js", "/i18n-osnova.js", "/style.css", "/nujno.js"];
  // Čakamo s ponavljanjem p.evaluate: waitForFunction obljube ne počaka (obljuba je »resnična«, čakanje se je končalo
  // takoj, zato je bil test občasno rdeč, ko service worker datotek še ni shranil). Kopije beremo v istem klicu.
  const preberi = (files) => Promise.all(files.map((f) => caches.match(f))).then((r) =>
    r.every(Boolean) ? Promise.all(r.map(async (x) => ({ text: await x.text(), app: x.headers.has("X-Evklid-App") }))) : null);
  let got = null;
  for (const konec = Date.now() + 30000; !got && Date.now() < konec; ) {
    got = await p.evaluate(preberi, FILES);
    if (!got) await p.waitForTimeout(100);
  }
  assert.ok(got, "service worker je shranil vse datoteke");
  for (const f of FILES) assert.equal(hits.get(f), 1, `${f}: ena zahteva (stran), service worker brez ponovne`);
  // Kopija v predpomnilniku service workerja je ista datoteka kot na strežniku, z različico (glava X-Evklid-App).
  for (const [i, f] of FILES.entries()) {
    const want = await (await fetch(base + f)).text();
    assert.ok(got[i].text === want && got[i].app, f);
  }
});
