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

test("service worker: datoteka, prenesena z ?r=, je brez povezave na voljo brez ?r=", { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 120000 }, async (t) => {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  const ctx = await chromium.newContext({ serviceWorkers: "allow" });
  t.after(async () => {
    await ctx.close();
    await chromium.close();
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
