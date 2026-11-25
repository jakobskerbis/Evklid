// Vodeni poskus (public/sim/lab-vodeno.js, lab-vodeno-koraki.js; načrt laboratorija, faza 1, j 25. 11. 2026).
// 1) brez brskalnika: vsak vodeni poskus obstaja, koraki so popolni, obkrožene kontrole obstajajo v motorju, pomožne
//    funkcije in štetje uporabe (server/laboratorij.js) delajo;
// 2) v pravem brskalniku (Playwright, če je nameščen): vsak vodeni poskus se odigra do konca z istimi kliki kot učenec
//    (če se motor spremeni tako, da korak ni več izvedljiv, test pade), »Prosto« skrije kartico, »↺ Ponastavi« začne
//    znova; na telefonu (360 × 740) kartica ne povzroči vodoravnega drsenja in risba ostane pripeta.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { DatabaseSync } from "node:sqlite";
import { KORAKI, stevilo, celica, ujemanje } from "../public/sim/lab-vodeno-koraki.js";
import { ENGINES } from "../public/sim/index.js";
import { LAB_INFO } from "../public/sim/katalog.js";
import { migrateLab, labUporaba, mountLab, NACINI, DOGODKI } from "../server/laboratorij.js";

test("every guided experiment is a real lab experiment with complete steps", async () => {
  assert.deepEqual(Object.keys(KORAKI).sort(), ["lab-ohm", "lab-prosti-pad", "lab-titracija"]);
  for (const [key, def] of Object.entries(KORAKI)) {
    assert.ok(LAB_INFO[key] && ENGINES[key], `${key}: ni v katalogu laboratorija`);
    for (const f of ["naslov", "cilj", "konec"]) assert.ok(def[f]?.length > 20, `${key}: manjka ${f}`);
    assert.ok(def.koraki.length >= 5 && def.koraki.length <= 12, `${key}: ${def.koraki.length} korakov`);
    const src = fs.readFileSync(`public/sim/${ENGINES[key][0]}`, "utf8").toLocaleLowerCase("sl");
    for (const [i, k] of def.koraki.entries()) {
      for (const f of ["naslov", "kaj", "zakaj"]) assert.ok(k[f]?.length > 5, `${key} korak ${i + 1}: manjka ${f}`);
      assert.equal(typeof k.done, "function");
      assert.ok(k.naslov.length <= 60, `${key} korak ${i + 1}: naslov predolg za telefon`);
      // Obkrožena kontrola mora obstajati v motorju (gumb, stikalo ali oznaka), sicer korak nima kaj pokazati.
      for (const t of k.poudari || []) assert.ok(src.includes(t.toLocaleLowerCase("sl")), `${key} korak ${i + 1}: kontrole »${t}« ni v ${ENGINES[key][0]}`);
    }
  }
});

test("helpers: numbers with a decimal comma, table columns, concordant titrations", () => {
  assert.equal(stevilo("2,0 V"), 2);
  assert.equal(stevilo("−0,35"), -0.35);
  assert.ok(Number.isNaN(stevilo("–")));
  assert.equal(celica({ "h [m]": "0,50", "t [s]": "0,3194" }, /^t\b/), "0,3194");
  const r = (vz, V) => ({ vzorec: vz, "V [mL]": V });
  assert.equal(ujemanje([r("HCl", "20,00"), r("HCl", "20,15")]), false);
  assert.equal(ujemanje([r("HCl", "20,00"), r("HCl", "20,10")]), true);
  assert.equal(ujemanje([r("HCl", "20,00"), r("CH₃COOH", "20,05")]), false, "različna vzorca se ne ujemata");
});

test("step checks: a done() reads only what the student did", () => {
  const c = (o) => ({ par: () => "", num: () => NaN, bilo: () => false, vrstice: [], sklepi: 0, ...o });
  const tit = KORAKI["lab-titracija"].koraki;
  assert.equal(tit[0].done(c({ par: (n) => (n === "zaščitna očala" ? "ne" : "") })), false);
  assert.equal(tit[0].done(c({ par: (n) => (n === "zaščitna očala" ? "da" : "") })), true);
  const ohm = KORAKI["lab-ohm"].koraki;
  const vr = (U, I, p = "100 Ω") => ({ porabnik: p, "U [V]": U, "I [mA]": I, "U/I [Ω]": "100" });
  const pet = ["2,0", "4,0", "6,0", "8,0", "10,0"].map((U) => vr(U, String(stevilo(U) * 10)));
  assert.equal(ohm[2].done(c({ vrstice: pet.slice(0, 4) })), false, "4 napetosti niso dovolj");
  assert.equal(ohm[2].done(c({ vrstice: pet })), true);
  assert.equal(ohm[2].done(c({ vrstice: [...pet.slice(0, 4), vr("10,0", "–")] })), false, "meritev brez toka ne šteje");
  const pad = KORAKI["lab-prosti-pad"].koraki;
  const h = (x) => ({ predmet: "kroglica", "h [m]": x, "t [s]": "0,3", "t² [s²]": "0,09", "v [m/s]": "–" });
  assert.equal(pad[2].done(c({ vrstice: ["0,20", "0,50", "1,00", "1,50", "2,00"].map(h) })), true);
  assert.equal(pad[2].done(c({ vrstice: ["0,20", "0,20", "0,50", "1,00", "1,50"].map(h) })), false, "ista višina dvakrat");
});

test("usage counter: anonymous daily counts per experiment, mode and event; only known values", () => {
  const db = new DatabaseSync(":memory:");
  const routes = {};
  const app = { get: (p, f) => (routes[`GET ${p}`] = f), post: (p, f) => (routes[`POST ${p}`] = f) };
  mountLab(app, { loadStudent: (req) => ({ id: Number(req.params.id) }), accounts: null, db, isAdmin: (req) => !!req.admin });
  const call = (body, id = 1) => {
    let code = 200, out = null;
    const res = { status: (c) => ((code = c), res), json: (o) => ((out = o), res) };
    routes["POST /api/students/:id/lab/uporaba"]({ params: { id }, body }, res);
    return { code, out };
  };
  assert.equal(call({ key: "lab-ohm", nacin: "vodeno", dogodek: "odprt" }).code, 200);
  assert.equal(call({ key: "lab-ohm", nacin: "vodeno", dogodek: "odprt" }).code, 200); // isti v 10 s: enkrat
  call({ key: "lab-ohm", nacin: "vodeno", dogodek: "odprt" }, 2);
  call({ key: "lab-ohm", nacin: "vodeno", dogodek: "koncano" }, 2);
  call({ key: "lab-co2", nacin: "brez", dogodek: "odprt" });
  assert.equal(call({ key: "lab-ne-obstaja", nacin: "vodeno", dogodek: "odprt" }).code, 400);
  assert.equal(call({ key: "lab-ohm", nacin: "x", dogodek: "odprt" }).code, 400);
  assert.equal(call({ key: "lab-ohm", nacin: "vodeno", dogodek: "x" }).code, 400);
  const r = labUporaba(db);
  assert.equal(r.skupaj, 3);
  assert.deepEqual(r.poskusi[0], { poskus: "lab-ohm", odprt: 2, vodeno: 2, prosto: 0, preklopi: 0, koncano: 1 });
  // Brez stolpca z učencem: tabela nima osebnih podatkov.
  const cols = db.prepare("PRAGMA table_info(lab_uporaba)").all().map((x) => x.name);
  assert.deepEqual(cols, ["dan", "poskus", "nacin", "dogodek", "n"]);
  let code = 0;
  routes["GET /api/admin/laboratorij"]({ query: {} }, { status: (c) => ((code = c), { json() {} }), json() {} });
  assert.equal(code, 403);
  migrateLab(db); // drugič brez napake
  assert.deepEqual(NACINI, ["vodeno", "prosto", "brez"]);
  assert.deepEqual(DOGODKI, ["odprt", "preklop", "koncano"]);
});

// ---------------------------------------------------------------- v brskalniku
const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
let browser = null;
before(async () => {
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
});
after(() => browser?.close());

const PUB = path.resolve("public");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html", ".woff2": "font/woff2", ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/lab.css"><link rel="stylesheet" href="/textbook.css">
<style>body{margin:0;display:flex;flex-direction:column;height:100dvh}header{height:56px;flex:none;background:#ddd}#v{flex:1;min-height:0;overflow-y:auto;padding:24px 16px 48px}</style>
<header></header><main id="v" class="lab-view"><h2>Poskus</h2><section class="card lab-bench"><div id="m"></div></section></main>
<script type="module">
import { mountSim } from "/sim/index.js";
import { vodi } from "/sim/lab-vodeno.js";
const m = document.getElementById("m");
const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
window.wait = (ms) => new Promise((r) => setTimeout(r, ms));
window.mount = async (id, nacin = "vodeno") => {
  await mountSim(id, m, {});
  window.konec = 0;
  window.vod = vodi(m, id, { nacin, onKonec: () => window.konec++ });
  await frame();
};
const txt = (e) => (e.textContent || "").replace(/\\s+/g, " ").trim();
const ctl = () => m.querySelector(".demo-controls");
window.klik = async (t) => {
  const b = [...m.querySelectorAll("button")].find((x) => !x.closest(".lab-vod-wrap") && txt(x).startsWith(t) && !x.disabled);
  if (!b) throw new Error("ni gumba " + t);
  b.click();
  await wait(120);
};
window.stikalo = async (t, on = true) => {
  const l = [...m.querySelectorAll(".demo-check")].find((x) => txt(x).startsWith(t));
  if (!l) throw new Error("ni stikala " + t);
  const c = l.querySelector("input");
  if (c.checked !== on) c.click();
  await wait(120);
};
window.drsnik = async (t, v) => {
  const lab = [...m.querySelectorAll(".demo-slider-label")].find((x) => txt(x).startsWith(t));
  const r = lab?.parentElement.querySelector('input[type="range"]');
  if (!r) throw new Error("ni drsnika " + t);
  r.value = String(v);
  r.dispatchEvent(new Event("input", { bubbles: true }));
  r.dispatchEvent(new Event("change", { bubbles: true }));
  await wait(120);
};
window.izbira = async (t, besedilo) => {
  const lab = [...m.querySelectorAll(".demo-slider-label")].find((x) => txt(x) === t);
  const box = lab?.parentElement;
  const sel = box?.querySelector("select");
  if (sel) {
    const o = [...sel.options].find((x) => txt(x).startsWith(besedilo));
    sel.value = o.value;
    sel.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    const b = [...(box?.querySelectorAll(".seg-btn") || [])].find((x) => txt(x).startsWith(besedilo));
    if (!b) throw new Error("ni izbire " + t + " " + besedilo);
    b.click();
  }
  await wait(120);
};
window.vpisi = async (aria, v) => {
  const i = m.querySelector('input[aria-label="' + aria + '"]');
  i.value = v;
  i.dispatchEvent(new Event("input", { bubbles: true }));
  await wait(60);
};
// Vprašanje »Sklep«: klikne možnosti po vrsti, dokler ena ni pravilna (kot učenec, ki poskuša).
window.sklep = async (n) => {
  const q = m.querySelectorAll(".lab-q")[n];
  if (!q) throw new Error("ni sklepa " + n);
  for (const b of q.querySelectorAll(".lab-opt")) {
    if (q.querySelector(".lab-opt.ok")) break;
    b.click();
    await wait(60);
  }
  await wait(120);
};
window.stanje = () => ({ korak: vod.korak, konec, oznaka: txt(m.querySelector(".lab-vod-oznaka") || {}), naslov: txt(m.querySelector(".lab-vod h4") || {}), skrita: !!m.querySelector(".lab-vod")?.hidden, cilji: m.querySelectorAll(".lab-vod-cilj").length, prvi: ctl()?.firstElementChild?.className });
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t-vod.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

// Igra vsakega vodenega poskusa: zaporedje dejanj, po katerem morajo biti opravljeni vsi koraki.
const IGRA = {
  "lab-titracija": async () => {
    await stikalo("zaščitna očala");
    await klik("Speri bireto");
    await klik("Napolni bireto");
    await klik("Izpusti zrak");
    await stikalo("pipeto prej speri");
    for (const [r1, r2] of [["0,50", "20,50"], ["0,55", "20,60"]]) {
      await klik("Odpipetiraj");
      await wait(3300); // pipetiranje traja 3 s, med njim pipa birete ne teče
      await klik("Dodaj 2 kapljici");
      await vpisi("odčitek birete v mililitrih", r1);
      await klik("Zapiši");
      await klik("1 kapljica");
      await wait(400);
      await vpisi("odčitek birete v mililitrih", r2);
      await klik("Zapiši");
    }
    await vpisi("izračunana koncentracija kisline v mol na liter", "0,0801"); // 0,1000 · 20,025 / 25,00
    await klik("Preveri koncentracijo");
  },
  "lab-ohm": async () => {
    for (const U of [2, 4, 6, 8, 10]) {
      await drsnik("napetost napajalnika", U);
      await wait(500); // merilnika odčitata vsakih 0,4 s
      await klik("Zapiši meritev");
    }
    await sklep(0);
    await drsnik("napetost napajalnika", 1);
    await izbira("ampermeter", "vzporedno");
    await wait(600);
    await izbira("ampermeter", "zaporedno");
    if ([...document.querySelectorAll(".lab-ev")].some((x) => /pregorela varovalka/.test(x.textContent))) await klik("Zamenjaj varovalko");
    await izbira("porabnik", "žarnica");
    for (const U of [1, 2, 4, 6]) {
      await drsnik("napetost napajalnika", U);
      await wait(500);
      await klik("Zapiši meritev");
    }
    await sklep(1);
  },
  "lab-prosti-pad": async () => {
    for (const cm of [20, 50, 100, 150, 200]) {
      await drsnik("vrata pod predmetom", cm);
      await klik("Spusti");
      await wait(1100);
      await klik("Zapiši meritev");
    }
    await sklep(0);
    await izbira("predmet", "filter");
    await izbira("spust", "klešče");
    for (const cm of [50, 100, 150]) {
      await drsnik("vrata pod predmetom", cm);
      await klik("Spusti");
      await wait(3300); // filter pade do tal (stojalo ~2 m) s končno hitrostjo ~1 m/s
      await klik("Zapiši meritev");
    }
    await sklep(1);
  },
};

test("guided experiments play through to the end in a real browser", { timeout: 300000 }, async (t) => {
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(() => server.close());
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/t-vod.html`);
  await page.waitForFunction(() => window.ready);
  for (const [key, play] of Object.entries(IGRA)) {
    await page.evaluate((k) => mount(k), key);
    const s0 = await page.evaluate(() => stanje());
    const n = KORAKI[key].koraki.length;
    assert.equal(s0.korak, 0, `${key}: začne pri prvem koraku`);
    assert.equal(s0.oznaka.startsWith(`Korak 1 od ${n}`), true, `${key}: ${s0.oznaka}`);
    assert.equal(s0.prvi, "lab-vod-wrap", `${key}: kartica je na vrhu kontrol`);
    if (KORAKI[key].koraki[0].poudari) assert.ok(s0.cilji >= 1, `${key}: prvi korak obkroži kontrolo`);
    await page.evaluate(`(${play.toString()})()`);
    await page.waitForTimeout(900);
    const s = await page.evaluate(() => stanje());
    assert.equal(s.korak, n, `${key}: obstal pri koraku ${s.korak + 1} »${s.naslov}«`);
    assert.equal(s.konec, 1, `${key}: konec javljen enkrat`);
    assert.match(s.oznaka, /opravljeno/);
    assert.equal(s.cilji, 0);
  }
  assert.deepEqual(errors, []);
});

test("Prosto hides the card; Ponastavi starts the guide again; phone: no sideways scroll", { timeout: 120000 }, async (t) => {
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(() => server.close());
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${base}/t-vod.html`);
  await page.waitForFunction(() => window.ready);
  await page.evaluate(() => mount("lab-titracija"));
  await page.evaluate(() => stikalo("zaščitna očala"));
  await page.waitForTimeout(300);
  assert.equal((await page.evaluate(() => stanje())).korak, 1);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(over <= 0, `vodoravno drsenje ${over} px`);
  // risba ostane pripeta (lab.js → pripni) tudi s kartico na vrhu kontrol
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector(".lab-tit-top > .demo-stage")).position), "sticky");
  await page.click(".lab-vod-nacin .seg-btn[data-v=prosto]");
  await page.waitForTimeout(200);
  let s = await page.evaluate(() => stanje());
  assert.equal(s.skrita, true);
  assert.equal(s.cilji, 0);
  await page.click(".lab-vod-nacin .seg-btn[data-v=vodeno]");
  await page.click(".demo-reset");
  await page.waitForTimeout(1200);
  s = await page.evaluate(() => stanje());
  assert.equal(s.korak, 0, "po »Ponastavi« znova od začetka");
  assert.equal(s.prvi, "lab-vod-wrap", "kartica je spet na vrhu novih kontrol");
  assert.equal(s.skrita, false);
});
