// Skrčene datoteke JS (N-08c, server/skrci.js): manjši prenos, ista koda; vendor in sw.js nespremenjena,
// aplikacija se s skrčenimi datotekami odpre brez napak.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import zlib from "node:zlib";
import { createRequire } from "node:module";
import * as acorn from "acorn";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { skrciJs, skrciVklopljeno } from "../server/skrci.js";

const require = createRequire(import.meta.url);

test("vklop: produkcija ali EVKLID_SKRCI=1; EVKLID_SKRCI=0 izklopi; razvoj in testi brez", () => {
  assert.equal(skrciVklopljeno({}), false);
  assert.equal(skrciVklopljeno({ EVKLID_SKRCI: "1" }), true);
  assert.equal(skrciVklopljeno({ RENDER: "true" }), true);
  assert.equal(skrciVklopljeno({ NODE_ENV: "production" }), true);
  assert.equal(skrciVklopljeno({ RENDER: "true", EVKLID_SKRCI: "0" }), false);
});

test("skrciJs: brez komentarjev, imena ostanejo, koda se razčleni; sw.js in ne-JS se ne krčita", async () => {
  const src = fs.readFileSync(new URL("../public/app.js", import.meta.url));
  const out = await skrciJs(src, "public/app.js");
  assert.ok(out.length < src.length * 0.8, `manjša datoteka (${out.length} / ${src.length})`);
  const code = out.toString("utf8");
  assert.doesNotThrow(() => acorn.parse(code, { ecmaVersion: "latest", sourceType: "module" }));
  assert.ok(!/\/\/ Service worker izve/.test(code), "komentarji odstranjeni");
  assert.ok(/function reloadIfNewer\(/.test(code), "imena funkcij ostanejo (berljive napake)");
  assert.equal(await skrciJs(fs.readFileSync(new URL("../public/sw.js", import.meta.url)), "public/sw.js"), null);
  assert.equal(await skrciJs(Buffer.from("body{}"), "public/style.css"), null);
});

test("strežnik z vklopom: /app.js skrčen (brotli), oznaka ETag -s; /sw.js in vendor nespremenjena; brez vklopa izvirnik", async () => {
  const get = async (base, p) => {
    const r = await fetch(base + p, { headers: { "accept-encoding": "br" } });
    const buf = Buffer.from(await r.arrayBuffer());
    // fetch v Node sam razpakira; glava pove, ali je bil odgovor stisnjen
    return { buf, etag: r.headers.get("etag") || "", enc: r.headers.get("content-encoding") };
  };
  const zagon = async (skrci) => {
    const prej = process.env.EVKLID_SKRCI;
    process.env.EVKLID_SKRCI = skrci ? "1" : "0";
    try {
      const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
      const s = app.listen(0);
      return { base: `http://127.0.0.1:${s.address().port}`, close: () => s.close() };
    } finally {
      if (prej === undefined) delete process.env.EVKLID_SKRCI;
      else process.env.EVKLID_SKRCI = prej;
    }
  };
  const src = fs.readFileSync(new URL("../public/app.js", import.meta.url));
  const z = await zagon(true);
  try {
    const a = await get(z.base, "/app.js");
    assert.ok(a.buf.length < src.length * 0.8, `skrčen app.js (${a.buf.length} / ${src.length})`);
    assert.match(a.etag, /-br-s"$/);
    const sw = await get(z.base, "/sw.js");
    assert.ok(sw.buf.toString().includes("const TIMEOUT"), "sw.js ni skrčen");
    const katex = await get(z.base, "/vendor/katex/katex.min.js");
    assert.ok(katex.buf.length > 1000 && !/-s"$/.test(katex.etag), "vendor nespremenjen");
  } finally {
    z.close();
  }
  const n = await zagon(false);
  try {
    const a = await get(n.base, "/app.js");
    assert.equal(a.buf.length, src.length, "brez vklopa izvirnik");
  } finally {
    n.close();
  }
});

let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
test.after(() => chromium?.close());

test("aplikacija s skrčenimi datotekami: Učna pot se odpre, inštruktor odgovori, brez napak na strani", { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 }, async () => {
  process.env.EVKLID_SKRCI = "1";
  const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none done=0>>';
  const streamFn = async ({ onText }) => {
    const text = "Seštej enice: $2 + 0 = 2$." + META;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn" };
  };
  let app;
  try {
    app = createApp(openDb(":memory:"), { scheduler: false, streamFn, log: { error() {}, warn() {}, info() {} } });
  } finally {
    delete process.env.EVKLID_SKRCI;
  }
  const s = app.listen(0);
  const base = `http://127.0.0.1:${s.address().port}`;
  const ctx = await chromium.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
  try {
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(e.message));
    await p.goto(base + "/healthz");
    const id = await p.evaluate(() =>
      fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Nika", settings: { interests: [], educational_track: "OSNOVNA_SOLA", curriculum_level: "9. razred", subject: "MAT" } }) })
        .then((r) => r.json())
        .then((x) => x.id),
    );
    await p.evaluate((id) => (localStorage.setItem("studentId", String(id)), localStorage.setItem("evklid.tour", "1")), id);
    const skrcen = p.waitForResponse((r) => r.url().endsWith("/app.js"));
    await p.goto(base + "/");
    assert.match((await skrcen).headers()["etag"] || "", /-s"$/, "brskalnik dobi skrčen app.js");
    await p.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
    await p.waitForFunction(() => window.evklid && window.evklid.showView, null, { timeout: 60000 });
    await p.evaluate(() => window.evklid.showView("chat"));
    await p.waitForSelector("#input", { state: "visible" });
    await p.fill("#input", "Koliko je 12 + 30?");
    await p.click("#send");
    await p.waitForSelector(".msg.assistant:not(.typing) .katex", { timeout: 30000 });
    await p.evaluate(() => window.evklid.showView("textbook"));
    await p.waitForSelector("#tb-q", { state: "visible" });
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    s.close();
  }
});
