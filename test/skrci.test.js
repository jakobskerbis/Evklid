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
import os from "node:os";
import path from "node:path";
import { skrciJs, skrciVklopljeno, skrciVrsta } from "../server/skrci.js";
import { compressedStatic } from "../server/compress.js";

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

test("skrciJs: navadni skripti ES5 ostanejo ES5 (catch z imenom); napaka krčenja enkrat v dnevnik", async (t) => {
  const out = (await skrciJs(Buffer.from("var a;\ntry { a = f(); } catch (e) { a = 0; }\n"), "zacetek.js")).toString();
  assert.match(out, /catch\(e\)/, out);
  const warn = t.mock.method(console, "warn", () => {});
  await assert.rejects(skrciJs(Buffer.from("const = ;"), "slaba1.js"));
  await assert.rejects(skrciJs(Buffer.from("let let;"), "slaba2.js"));
  assert.equal(warn.mock.callCount(), 1);
  assert.match(String(warn.mock.calls[0].arguments[0]), /krčenje JS ni uspelo \(slaba1\.js\)/);
});

test("skrciJs: največ dve krčenji hkrati (prvo odprtje po objavi: ~130 modulov naenkrat, esbuild sicer zraste)", async () => {
  const src = fs.readFileSync(new URL("../public/app.js", import.meta.url));
  const vse = Array.from({ length: 12 }, (_, i) => skrciJs(src, `public/a${i}.js`));
  assert.deepEqual(skrciVrsta(), { tece: 2, caka: 10 });
  let najvec = 0;
  const merilnik = setInterval(() => (najvec = Math.max(najvec, skrciVrsta().tece)), 1);
  const izhod = await Promise.all(vse);
  clearInterval(merilnik);
  assert.ok(najvec <= 2, `hkrati ${najvec}`);
  assert.ok(izhod.every((b) => b.equals(izhod[0]) && b.length < src.length * 0.8));
  assert.deepEqual(skrciVrsta(), { tece: 0, caka: 0 });
  // napaka razčlenjevanja sprosti mesto
  await assert.rejects(skrciJs(Buffer.from("const = ;"), "public/x.js"));
  assert.deepEqual(skrciVrsta(), { tece: 0, caka: 0 });
});

test("strežnik z vklopom: /app.js skrčen (brotli), oznaka ETag -s; /sw.js in vendor nespremenjena; brez vklopa izvirnik", async () => {
  const get = async (base, p) => {
    const r = await fetch(base + p, { headers: { "accept-encoding": "br" } });
    const buf = Buffer.from(await r.arrayBuffer());
    // fetch v Node sam razpakira; glava pove, ali je bil odgovor stisnjen
    return { buf, etag: r.headers.get("etag") || "", enc: r.headers.get("content-encoding"), app: r.headers.get("x-evklid-app") };
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
  let zApp;
  try {
    const a = await get(z.base, "/app.js");
    zApp = a.app;
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
    // Vklop/izklop brez nove gradnje (iste datoteke, isti commit): nova različica datotek, sicer service worker
    // (public/sw.js appFile, kopija iste različice brez omrežja) še naprej streže skrčene kopije.
    assert.ok(zApp && a.app && zApp !== a.app, `različica datotek ${zApp} / ${a.app}`);
  } finally {
    n.close();
  }
});

test("compressedStatic s krčenjem: ETag iz načina krčenja, 304, napaka krčenja pošlje izvirnik", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "skrci-"));
  const src = `// komentar\nexport const a = ${JSON.stringify("x".repeat(2000))};\n`;
  fs.writeFileSync(path.join(dir, "m.js"), src);
  fs.writeFileSync(path.join(dir, "slab.js"), "const = ;\n".repeat(200));
  const klic = async (mw, url, headers = {}) => {
    const res = { headers: {}, status: 200, body: null, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, end(b) { this.body = b ?? null; return this; } };
    res.status = function (c) { this.code = c; return this; };
    let naprej = false;
    await mw({ method: "GET", path: url, headers: { "accept-encoding": "br", ...headers } }, res, () => (naprej = true));
    return { naprej, code: res.code || 200, etag: res.headers.etag, body: res.body && zlib.brotliDecompressSync(res.body).toString() };
  };
  const krci = (oznaka) => Object.assign((buf, f) => skrciJs(buf, f), { oznaka });
  const a = compressedStatic([["/", dir]], { skrci: krci("esbuild-1") });
  const b = compressedStatic([["/", dir]], { skrci: krci("esbuild-2") });
  const brez = compressedStatic([["/", dir]]);
  const ra = await klic(a, "/m.js");
  assert.ok(!ra.body.includes("komentar") && ra.body.length < src.length, "skrčeno");
  assert.match(ra.etag, /-br-s"$/);
  assert.notEqual((await klic(b, "/m.js")).etag, ra.etag, "nova različica esbuild: nova oznaka (brskalnik ne obdrži stare skrčene kopije)");
  assert.notEqual((await klic(brez, "/m.js")).etag, ra.etag);
  assert.equal((await klic(a, "/m.js", { "if-none-match": ra.etag })).code, 304);
  const slab = await klic(a, "/slab.js");
  assert.equal(slab.code, 200);
  assert.equal(slab.body, fs.readFileSync(path.join(dir, "slab.js"), "utf8"), "napaka krčenja: izvirnik");
  fs.rmSync(dir, { recursive: true, force: true });
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
