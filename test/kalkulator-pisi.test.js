// Okno »Piši« znanstvenega kalkulatorja (j, 27. 11.): ročno napisan izraz se po premoru pisanja prebere in postavi
// v vnos; okno je pripeto desno, levo ali spodaj ali prosto, ob robu se pripne, velikost in postavitev se zapomnita.
// 1) strežnik: POST /api/students/:id/calc/read (preverjanje slike, prepis, poraba »ocr«, preizkusni način);
// 2) pravi brskalnik (Playwright: Chromium in WebKit, kar je nameščeno): pisanje, branje, »Popravi«, »=«, vlečenje.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

async function withServer(fn, opts = {}) {
  const store = openDb(":memory:");
  const app = createApp(store, { streamFn: async () => ({ content: [], text: "", stopReason: "end_turn" }), log: { error() {}, warn() {}, info() {} }, ...opts });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, o = {}) => {
    const res = await fetch(base + p, { method: o.method || "GET", headers: { "Content-Type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, store });
  } finally {
    server.close();
  }
}

const PNG = "data:image/png;base64,iVBORw0KGgo=";

test("kalkulator: branje pisave preveri sliko, vrne prepis in zapiše porabo (ocr)", async () => {
  const seen = [];
  const readCalcFn = async (o) => {
    seen.push(o);
    return { text: "3x+1/2", usage: { input_tokens: 600, output_tokens: 12 }, model: "claude-haiku-5-5" };
  };
  await withServer(
    async ({ call, store }) => {
      const s = (await call("/api/students", { method: "POST", body: { name: "Pia" } })).body;
      assert.equal((await call(`/api/students/${s.id}/calc/read`, { method: "POST", body: { image: "nekaj" } })).status, 400);
      assert.equal((await call(`/api/students/${s.id}/calc/read`, { method: "POST", body: {} })).status, 400);
      const ok = await call(`/api/students/${s.id}/calc/read`, { method: "POST", body: { image: PNG } });
      assert.equal(ok.status, 200);
      assert.equal(ok.body.text, "3x+1/2");
      assert.equal(seen.length, 1);
      assert.equal(seen[0].mediaType, "image/png");
      assert.equal(store.db.prepare("SELECT kind FROM usage").get().kind, "ocr");
      assert.equal((await call(`/api/students/999999/calc/read`, { method: "POST", body: { image: PNG } })).status, 404);
      // decimalni ločilnik kot pri tipkanju: privzeto vejica, angleščina pika (pregled: sin(1,5) v en ne deluje)
      assert.equal(seen[0].comma, true);
      await call(`/api/students/${s.id}/calc/read`, { method: "POST", body: { image: PNG, comma: false } });
      assert.equal(seen[1].comma, false);
      // zanka v odjemalcu: največ 30 branj na minuto, nato 429 brez klica modela
      for (let i = 2; i < 30; i++) assert.equal((await call(`/api/students/${s.id}/calc/read`, { method: "POST", body: { image: PNG } })).status, 200);
      const n = seen.length;
      const many = await call(`/api/students/${s.id}/calc/read`, { method: "POST", body: { image: PNG } });
      assert.equal(many.status, 429);
      assert.ok(many.body.error);
      assert.equal(seen.length, n);
    },
    { readCalcFn },
  );
  // preizkusni način (brez ključa): sporočilo, brez prepisa
  await withServer(
    async ({ call }) => {
      const s = (await call("/api/students", { method: "POST", body: { name: "Jan" } })).body;
      const r = await call(`/api/students/${s.id}/calc/read`, { method: "POST", body: { image: PNG } });
      assert.equal(r.status, 200);
      assert.equal(r.body.text, null);
      assert.ok(r.body.message);
    },
    { readCalcFn: async () => ({ text: null, mock: true }) },
  );
  // napaka modela: 502 s sporočilom, brez prepisa
  await withServer(
    async ({ call }) => {
      const s = (await call("/api/students", { method: "POST", body: { name: "Eva" } })).body;
      const r = await call(`/api/students/${s.id}/calc/read`, { method: "POST", body: { image: PNG } });
      assert.equal(r.status, 502);
      assert.ok(r.body.error);
    },
    {
      readCalcFn: async () => {
        throw new Error("x");
      },
    },
  );
});

test("kalkulator: prepis pisave je ena vrstica, ≤ ≥ ≠ v zapisu kalkulatorja", async () => {
  const src = fs.readFileSync("server/claude.js", "utf8");
  const fn = src.slice(src.indexOf("export async function readCalcInk"));
  assert.match(fn, /<zapis>/);
  assert.match(fn, /replace\(\/<=\/g, "≤"\)/);
  assert.match(fn, /slice\(0, 200\)/);
  assert.match(fn, /m \? m\[1\] : ""/, "brez <zapis> nič ne vstavimo (ne besedila modela)");
  assert.match(fn, /comma \? "decimalna števila z vejico/);
});

// ---------- pravi brskalnik ----------
const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
const PUB = path.resolve("public");
const KX = path.resolve("node_modules/katex/dist");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><link rel="stylesheet" href="/okna.css"><script src="/vendor/katex/katex.min.js"></script>
<style>body { margin: 0; } #ovoj { height: 100vh; display: flex; flex-direction: column; }</style>
<div id="ovoj"><div id="s"></div></div>
<script type="module">
import { createScientific } from "/graph/sci.js";
localStorage.removeItem("t-sci");
window.reads = [];
window.commas = [];
const pisi = new URLSearchParams(location.search).get("pisi");
if (pisi) localStorage.setItem("evklid.sci.pisi", pisi);
window.sci = createScientific(document.getElementById("s"), { t: (k) => k, icon: () => "", locale: () => "sl", storageKey: () => "t-sci", toast() {}, canSteps: () => false,
  readInk: async (img, o) => { window.reads.push(img.slice(0, 22)); window.commas.push(o?.comma); await new Promise((r) => setTimeout(r, window.DELAY ?? 50)); return { text: window.READ ?? "2+3" }; } });
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/t-pisi.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = url.startsWith("/vendor/katex/") ? path.join(KX, url.slice(14)) : path.join(PUB, path.normalize(url));
    if (!(file.startsWith(PUB) || file.startsWith(KX)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

const engines = [];
for (const name of ["chromium", "webkit"]) {
  try {
    if (playwright) engines.push([name, await playwright[name].launch()]);
  } catch {}
}
const skip = engines.length ? false : "Playwright ni nameščen";

test("kalkulator: okno »Piši« prebere zapis po premoru, se pripne in zapomni postavitev", { skip }, async (t) => {
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/t-pisi.html`;
  t.after(async () => {
    for (const [, b] of engines) await b.close();
    server.close();
  });
  for (const [engine, browser] of engines) {
    const where = (s) => `${engine} ${s}`;
    // iPad ležeče: privzeto odprto (dotik, ≥ 700 px), pripeto desno, tipke ostanejo
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 1024 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => window.ready);
    await page.waitForSelector(".sc-pisi:not([hidden])");
    const lay = () =>
      page.evaluate(() => {
        const r = (q) => document.querySelector(q)?.getBoundingClientRect() ?? new DOMRect();
        return { cls: document.querySelector(".sc").className, pisi: r(".sc-pisi").toJSON(), keys: r(".sc-keys").toJSON(), entry: r(".sc-entry").toJSON(), vw: innerWidth, vh: innerHeight, btn: document.querySelector(".sc-write-btn").getAttribute("aria-pressed") };
      });
    let L = await lay();
    assert.match(L.cls, /sc-pisi-r/, where("pripeto desno"));
    assert.equal(L.btn, "true");
    assert.ok(L.pisi.right >= L.vw - 1 && L.pisi.width > 300, where("okno ob desnem robu"));
    assert.ok(L.keys.right <= L.pisi.left + 1 && L.keys.width > 300 && L.keys.bottom <= L.vh + 1, where("tipke levo od okna"));
    // pisanje: dve potezi, branje šele po premoru, enkrat
    const c = await page.evaluate(() => document.querySelector(".sc-pisi canvas").getBoundingClientRect().toJSON());
    const stroke = async (x0, y0, x1, y1) => {
      await page.mouse.move(x0, y0);
      await page.mouse.down();
      for (let i = 1; i <= 8; i++) await page.mouse.move(x0 + ((x1 - x0) * i) / 8, y0 + ((y1 - y0) * i) / 8);
      await page.mouse.up();
    };
    await stroke(c.x + 100, c.y + 200, c.x + 160, c.y + 260);
    await stroke(c.x + 160, c.y + 200, c.x + 100, c.y + 260);
    assert.equal(await page.evaluate(() => window.reads.length), 0, where("med pisanjem še ne bere"));
    await page.waitForFunction(() => document.querySelector(".sc-input").value === "2+3", null, { timeout: 5000 });
    assert.equal(await page.evaluate(() => window.reads.length), 1, where("eno branje"));
    assert.match(await page.evaluate(() => window.reads[0]), /^data:image\/png;base64/);
    assert.equal(await page.evaluate(() => window.commas[0]), true, where("decimalna vejica (sl)"));
    assert.equal(await page.evaluate(() => document.querySelector(".sc-ink-note").hidden), false, where("opomba »prebrano«"));
    // ponoven premor brez nove poteze: ni novega branja
    await page.waitForTimeout(1200);
    assert.equal(await page.evaluate(() => window.reads.length), 1, where("brez spremembe ni branja"));
    // »=«: izračun, list se počisti, opomba izgine
    await page.click('.sc-key[data-ins="#eq"]');
    await page.waitForFunction(() => !document.querySelector(".sc-input").value);
    assert.equal(await page.evaluate(() => document.querySelector(".sc-ink-note").hidden), true);
    assert.match(await page.evaluate(() => document.querySelector(".sc-history").textContent), /5/, where("izid v zgodovini"));
    // pozno branje ne prepiše tipkanja (pregled): med branjem učenec natipka 7*8
    await page.evaluate(() => Object.assign(window, { DELAY: 700, READ: "9*9" }));
    const n0 = await page.evaluate(() => window.reads.length);
    await stroke(c.x + 300, c.y + 200, c.x + 340, c.y + 260);
    await page.waitForFunction((n) => window.reads.length > n, n0, { timeout: 5000 });
    await page.evaluate(() => {
      const i = document.querySelector(".sc-input");
      i.value = "7*8";
      i.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(1000);
    assert.equal(await page.evaluate(() => document.querySelector(".sc-input").value), "7*8", where("tipkano ostane"));
    assert.equal(await page.evaluate(() => document.querySelector(".sc-ink-note").hidden), true);
    await page.evaluate(() => {
      const i = document.querySelector(".sc-input");
      i.value = "";
      i.dispatchEvent(new Event("input", { bubbles: true }));
      window.DELAY = 50;
    });
    // nova poteza, nato »Popravi«: okno se skrije, vnos ostane, tipke so vidne
    await page.evaluate(() => (window.READ = "x^2-1"));
    await stroke(c.x + 120, c.y + 220, c.x + 220, c.y + 220);
    await page.waitForFunction(() => document.querySelector(".sc-input").value === "x^2-1", null, { timeout: 5000 });
    await page.click(".sc-ink-fix");
    L = await lay();
    assert.doesNotMatch(L.cls, /sc-pisi-on/, where("Popravi skrije okno"));
    assert.equal(L.btn, "false");
    assert.equal(await page.evaluate(() => document.querySelector(".sc-input").value), "x^2-1");
    assert.equal(await page.evaluate(() => document.activeElement?.classList.contains("sc-input")), true, where("Popravi: fokus v vnosu"));
    assert.notEqual(await page.evaluate(() => JSON.parse(localStorage.getItem("evklid.sci.pisi")).open), false, where("Popravi ne zapre okna za vedno"));
    // znova odpri, ločnica: širše okno se zapomni
    await page.click(".sc-write-btn");
    L = await lay();
    const rs = await page.evaluate(() => document.querySelector(".sc-pisi-rs").getBoundingClientRect().toJSON());
    await page.mouse.move(rs.x + rs.width / 2, rs.y + rs.height / 2);
    await page.mouse.down();
    await page.mouse.move(rs.x - 150, rs.y + rs.height / 2, { steps: 5 });
    await page.mouse.up();
    const L2 = await lay();
    assert.ok(Math.abs(L2.pisi.width - L.pisi.width - 150) < 4, where(`ločnica: ${L.pisi.width} → ${L2.pisi.width}`));
    // vlečenje za ⠿: prosto okno, ob spodnjem robu se pripne spodaj (tipke se skrijejo)
    const g = await page.evaluate(() => document.querySelector(".sc-pisi-drag").getBoundingClientRect().toJSON());
    await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2);
    await page.mouse.down();
    await page.mouse.move(600, 500, { steps: 5 });
    assert.match((await lay()).cls, /sc-pisi-f/, where("med vlečenjem prosto"));
    assert.equal(await page.evaluate(() => document.querySelector(".sc-pisi-snap-b").hidden), false, where("cona za pripenjanje"));
    await page.mouse.move(600, L.vh - 30, { steps: 5 });
    await page.mouse.up();
    L = await lay();
    assert.match(L.cls, /sc-pisi-b/, where("pripeto spodaj"));
    assert.ok(L.pisi.bottom >= L.vh - 1 && L.pisi.width >= L.vw - 1, where("spodaj čez vso širino"));
    assert.ok(L.keys.height > 200 && L.keys.bottom <= L.pisi.top + 1, where("tablica spodaj: tipke ostanejo nad oknom"));
    assert.equal(await page.evaluate(() => document.querySelector(".sc-pisi-snap-b").hidden), true);
    // postavitev se zapomni (nov obisk)
    await page.reload();
    await page.waitForFunction(() => window.ready);
    await page.waitForSelector(".sc-pisi:not([hidden])");
    assert.match((await lay()).cls, /sc-pisi-b/, where("zapomnjeno"));
    // »Tipke« zapre okno in si to zapomni
    await page.click('.sc-pisi [data-a="keys"]');
    await page.reload();
    await page.waitForFunction(() => window.ready);
    await page.waitForTimeout(200);
    assert.doesNotMatch((await lay()).cls, /sc-pisi-on/, where("zaprto ostane zaprto"));
    assert.deepEqual(errors, [], where("brez napak"));
    await ctx.close();

    // računalnik z miško: privzeto zaprto; telefon: le spodaj (tudi če je zapomnjeno desno)
    for (const [name, opt, expect, stored] of [
      ["računalnik", { viewport: { width: 1440, height: 900 } }, null],
      ["telefon", { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }, "b", { open: true, mode: "r" }],
      ["iPad pokončno", { viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true }, "b", null],
    ]) {
      const cx = await browser.newContext(opt);
      const p = await cx.newPage();
      await p.goto(stored ? `${url}?pisi=${encodeURIComponent(JSON.stringify(stored))}` : url);
      await p.waitForFunction(() => window.ready);
      await p.waitForTimeout(200);
      const cls = await p.evaluate(() => document.querySelector(".sc").className);
      if (!expect) assert.doesNotMatch(cls, /sc-pisi-on/, where(`${name}: privzeto zaprto`));
      else {
        assert.match(cls, new RegExp(`sc-pisi-${expect}\\b`), where(`${name}: ${cls}`));
        const hs = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        assert.equal(hs, false, where(`${name}: brez vodoravnega drsenja`));
        const k = await p.evaluate(() => [document.querySelector(".sc-keys").getBoundingClientRect().toJSON(), document.querySelector(".sc-pisi").getBoundingClientRect().toJSON(), innerHeight]);
        // telefon: okno namesto tipk; tablica pokončno: tipke nad oknom, oboje na zaslonu
        if (name === "telefon") assert.equal(k[0].height, 0, where(name));
        else assert.ok(k[0].height > 200 && k[0].bottom <= k[1].top + 1 && k[1].bottom <= k[2] + 1 && k[1].height >= 160, where(`${name}: ${JSON.stringify(k)}`));
      }
      await cx.close();
    }
  }
});
