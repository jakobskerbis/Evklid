// iPad 27. 11. 2026, 3D svet: »SyntaxError: Indirectly exported binding name 'CubeUVReflectionMapping' is not found«.
// Vzrok: service worker je v predpomnilnik knjižnic (VENDOR) shranil star three.module.js (three 0.186, iz predpomnilnika
// brskalnika: naslov brez različice, max-age teden, »precache« s cache: "force-cache") ob novem three.core.js (0.187) s
// strežnika. VENDOR se ne preverja, zato je 3D ostal zlomljen do naslednje nove knjižnice, »Poskusi znova« ni pomagal.
// Pravi brskalnik (Playwright Chromium, service worker vklopljen) za posredniškim strežnikom: v načinu »stara« da
// three.module.js z oznako //THREE-STARA in glavo starega strežnika (teden v predpomnilniku brskalnika), v načinu »nova«
// z oznako //THREE-NOVA (in spremenjen sw.js, da se namesti nov service worker).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}

const THREE = "/vendor/three/build/three.module.js";

async function withServer(fn) {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const upstream = app.listen(0);
  const up = `http://127.0.0.1:${upstream.address().port}`;
  const state = { mode: "stara" };
  const proxy = http.createServer(async (req, res) => {
    const url = new URL(req.url, up);
    const oznaceno = url.pathname === THREE || (state.mode === "nova" && url.pathname === "/sw.js");
    const headers = { ...req.headers, host: new URL(up).host };
    if (oznaceno) {
      delete headers["if-none-match"];
      delete headers["if-modified-since"];
      headers["accept-encoding"] = "identity";
    }
    const r = await fetch(up + req.url, { method: req.method, headers, redirect: "manual" }).catch(() => null);
    if (!r) return res.writeHead(502).end();
    const out = {};
    r.headers.forEach((v, k) => {
      if (!["content-length", "content-encoding", "transfer-encoding", "connection"].includes(k)) out[k] = v;
    });
    let body = Buffer.from(await r.arrayBuffer());
    if (oznaceno && r.ok) {
      delete out.etag; // brez validatorja: preverjanje vedno dobi novo vsebino
      if (url.pathname === THREE) {
        body = Buffer.concat([body, Buffer.from(state.mode === "nova" ? "\n//THREE-NOVA\n" : "\n//THREE-STARA\n")]);
        // stari strežnik: knjižnice teden v predpomnilniku brskalnika (iPadi to kopijo še imajo)
        if (state.mode === "stara") out["cache-control"] = "public, max-age=604800";
      } else body = Buffer.concat([body, Buffer.from("\n// nova\n")]);
    }
    res.writeHead(r.status, out);
    res.end(req.method === "HEAD" ? undefined : body);
  });
  proxy.listen(0);
  try {
    await fn(`http://localhost:${proxy.address().port}`, state);
  } finally {
    proxy.close();
    upstream.close();
  }
}

const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 120000 };

// Stran pod service workerjem naloži stari three.module.js (gre v VENDOR in v predpomnilnik brskalnika za teden).
async function staraKnjiznica(ctx, base) {
  const p = await ctx.newPage();
  await p.goto(base + "/");
  await p.waitForFunction(() => navigator.serviceWorker?.controller, null, { timeout: 30000 });
  assert.match(await p.evaluate((u) => fetch(u).then((r) => r.text()), THREE), /THREE-STARA/);
  await p.waitForTimeout(500); // cacheFirst shrani kopijo v ozadju
  return p;
}
// Vsebina three.module.js v predpomnilniku knjižnic (VENDOR) service workerja.
const vVendor = (p) =>
  p.evaluate(async (u) => {
    for (const k of await caches.keys()) {
      if (!/-vendor(-\d+)?$/.test(k)) continue;
      const hit = await (await caches.open(k)).match(u);
      if (hit) return hit.text();
    }
    return null;
  }, THREE);
// Nova knjižnica: nov VENDOR je prazen (ime vsebuje različico knjižnic), predpomnilnik brskalnika pa ima še staro kopijo.
const novaKnjiznica = (p) => p.evaluate(() => caches.keys().then((ks) => Promise.all(ks.filter((k) => /-vendor(-\d+)?$/.test(k)).map((k) => caches.delete(k)))));

test("nova knjižnica: »precache« (kalkulator) ne shrani stare kopije three iz predpomnilnika brskalnika", opts, async () => {
  await withServer(async (base, state) => {
    const ctx = await chromium.newContext({ serviceWorkers: "allow" });
    try {
      const p = await staraKnjiznica(ctx, base);
      await novaKnjiznica(p);
      state.mode = "nova";
      // public/kalkulator-zaslon.js ob nedejavnosti: three.module.js samo v predpomnilnik service workerja
      await p.evaluate(
        (u) =>
          new Promise((konec) => {
            const ch = new MessageChannel();
            ch.port1.onmessage = () => konec();
            navigator.serviceWorker.controller.postMessage({ type: "precache", urls: [u] }, [ch.port2]);
            setTimeout(konec, 10000);
          }),
        THREE,
      );
      const shranjeno = await vVendor(p);
      assert.ok(shranjeno, "three.module.js je v predpomnilniku knjižnic");
      assert.match(shranjeno, /THREE-NOVA/, "precache je shranil staro kopijo knjižnice");
    } finally {
      await ctx.close();
    }
  });
});

test("nova knjižnica: prvi prenos three skozi service worker ni stara kopija iz predpomnilnika brskalnika", opts, async () => {
  await withServer(async (base, state) => {
    const ctx = await chromium.newContext({ serviceWorkers: "allow" });
    try {
      const p = await staraKnjiznica(ctx, base);
      await novaKnjiznica(p);
      state.mode = "nova";
      assert.match(await p.evaluate((u) => fetch(u).then((r) => r.text()), THREE), /THREE-NOVA/);
      await p.waitForTimeout(500);
      assert.match((await vVendor(p)) || "", /THREE-NOVA/);
    } finally {
      await ctx.close();
    }
  });
});

test("nov service worker pobriše star (morda zastrupljen) predpomnilnik knjižnic", opts, async () => {
  await withServer(async (base, state) => {
    const ctx = await chromium.newContext({ serviceWorkers: "allow" });
    try {
      const p = await staraKnjiznica(ctx, base);
      // kopija pod starim imenom (»…-vendor«, pred popravkom): star three.module.js, kot na iPadu
      const staro = await p.evaluate(async (u) => {
        const ime = (await caches.keys()).find((k) => /-vendor(-\d+)?$/.test(k)).replace(/-vendor(-\d+)?$/, "-vendor");
        const c = await caches.open(ime);
        await c.put(u, new Response("//THREE-STARA", { headers: { "content-type": "text/javascript" } }));
        return ime;
      }, THREE);
      state.mode = "nova"; // nov sw.js
      await p.evaluate(() => navigator.serviceWorker.getRegistration().then((r) => r.update()));
      // ob aktivaciji: kopija pod starim imenom je pobrisana (three se prenese znova, z no-cache)
      // (waitForFunction ne počaka obljube, zato zanka tukaj)
      const ostane = () => p.evaluate((ime) => caches.keys().then((ks) => ks.includes(ime)), staro);
      for (let i = 0; i < 60 && (await ostane()); i++) await p.waitForTimeout(300);
      assert.equal(await ostane(), false, `predpomnilnik ${staro} je ostal`);
    } finally {
      await ctx.close();
    }
  });
});

test.after(() => chromium?.close());
