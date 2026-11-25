// Proračun hitrosti (naloga hitrost, j 6. 11. 2026): prvo odprtje ne sme rasti brez razloga, težke
// knjižnice in orodja se naložijo šele ob uporabi, vstopna stran vnaprej naloži vse module prvega odprtja.
// Meritev časov v brskalniku: node scripts/meri-hitrost.cjs (tabela v poročilu naloge).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { startupFiles } from "../server/startup-files.js";
import { entryHtml } from "../server/vstopna-stran.js";

const pub = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const own = startupFiles(pub, "index.html").filter((u) => u !== "/" && !u.startsWith("/vendor/"));
const br = (u) => zlib.brotliCompressSync(fs.readFileSync(path.join(pub, u)), { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } }).length;

// Ob nastanku (6. 11. 2026): 128 datotek, ~690 KB stisnjeno, največja ~60 KB (i18n/sl.js, app.js).
// 10. 11. 2026 (#479, j potrdil 10. 11.): +30 KB za public/nujno.js (lokalni zaznavalnik nujnih primerov, ~24 KB stisnjeno).
// Ostane del prvega odprtja namenoma: okno z nujno pomočjo mora delovati takoj ob pošiljanju in brez povezave.
// 10. 11. 2026 (#553, čaka potrditev j): +5 KB za nove znake lokalnega zaznavalnika (public/nujno.js +3 KB stisnjeno; prvo odprtje 811,4 KB).
// 10. 11. 2026 (#560, j potrdil 10. 11.: 815 → 819 KB): +5 KB za hiter zagon (public/zacetek.js pokaže posnetek zadnjega zaslona, ga
// očisti in preveri račun/profil, klice zagona začne že v <head>; zamenjava posnetka s pravim pogledom v app.js);
// prvo odprtje 814,4 → 818,7 KB (main po #556). Shranjevanje posnetka (public/posnetek.js) se naloži po zagonu in ne šteje sem.
// j 10. 11.: nujna pomoč (#561, 819 → 821 KB): popravki lokalnega zaznavalnika po pregledih A in B (public/nujno.js +1,2 KB
// stisnjeno; prvo odprtje 819,2 → 820,4 KB). Okno z nujno pomočjo mora delovati takoj in brez povezave.
// j 12. 11. 2026 (#604, kviz z novimi vrstami vprašanj, main že 820,98 KB): »dvigni na 2MB« → 2048 KB.
// 12. 11. 2026 (#602): namigi za razmerje a : b in količnik (5 novih ključev chk.* v
// public/i18n/sl.js, +0,12 KB stisnjeno; prvo odprtje 820,98 → 821,10 KB, main po #605). Kviz in pilot pokažeta namig po kodi
// iz sl.js, zato besedila ne moreta biti naložena pozneje.
// j 14. 11. 2026 (B3, #674, »Ok« na kartico): meja na datoteko 75 → 80 KB, ker je public/i18n/sl.js dosegel 74,96 KB in
// anketa po 7 dneh (13 ključev, +0,2 KB stisnjeno) ne gre več noter.
// j 19. 11. 2026 (#868, kartica »Da, 85 KB«): meja na datoteko 80 → 85 KB; public/i18n/sl.js je bil na 79,87 KB, sporočila
// za cel zapis v vajah (6 ključev chk.*, kviz in pilot jih pokažeta po kodi) ga dvignejo na 80,07 KB.
const BUDGET = { files: 140, totalKB: 2048, fileKB: 85 };

test("prvo odprtje: velikost stisnjenih datotek v proračunu", () => {
  assert.ok(own.length <= BUDGET.files, `${own.length} datotek ob prvem odprtju (proračun ${BUDGET.files}); novo veliko kodo naloži z import() ob uporabi`);
  const sizes = own.map((u) => [u, br(u)]);
  const total = sizes.reduce((a, [, n]) => a + n, 0) / 1024;
  assert.ok(total <= BUDGET.totalKB, `prvo odprtje ${total.toFixed(0)} KB stisnjeno (proračun ${BUDGET.totalKB} KB)`);
  for (const [u, n] of sizes) assert.ok(n / 1024 <= BUDGET.fileKB, `${u}: ${(n / 1024).toFixed(0)} KB stisnjeno (proračun ${BUDGET.fileKB} KB na datoteko)`);
});

test("težka orodja niso del prvega odprtja (naložijo se ob uporabi ali ob nedejavnosti)", () => {
  for (const u of ["/graph/calc.js", "/graph/sci.js", "/graph/tools.js", "/3d/modeli.js", "/games/index.js", "/icons/deljenje.jpg"]) {
    assert.ok(!own.includes(u), `${u} se naloži ob prvem odprtju`);
  }
  assert.ok(!startupFiles(pub, "index.html").some((u) => u.startsWith("/vendor/three")), "three.js ob prvem odprtju");
});

test("vstopna stran vnaprej naloži vse module prvega odprtja (brez slapa uvozov)", () => {
  const { html, modules } = entryHtml(pub);
  assert.ok(modules.includes("/app.js") && modules.length > 20);
  for (const u of modules) {
    assert.ok(fs.existsSync(path.join(pub, u)), `${u} ne obstaja`);
    assert.ok(html.includes(`<link rel="modulepreload" href="${u}" fetchpriority="low">`), u);
  }
  // navadne skripte (theme.js, knjižnice) niso moduli
  assert.ok(!html.includes('modulepreload" href="/theme.js"'));
  assert.ok(html.indexOf("modulepreload") < html.indexOf("</head>"));
});

test("strežnik pošlje vstopno stran z modulepreload, stisnjeno in s 304", async () => {
  const { createApp } = await import("../server/app.js");
  const { openDb } = await import("../server/db.js");
  const server = createApp(openDb(":memory:")).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const res = await fetch(`${base}/`, { headers: { "accept-encoding": "br" } });
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    const text = await res.text();
    assert.match(text, /<link rel="modulepreload" href="\/app\.js" fetchpriority="low">/);
    const again = await fetch(`${base}/index.html`, { headers: { "accept-encoding": "br", "if-none-match": res.headers.get("etag") } });
    assert.equal(again.status, 304);
  } finally {
    server.close();
  }
});

// Odprtje lekcije (#9, profil A): lekcija je po korakih (»1/20«), zato prvi izris naredi samo korak na zaslonu in
// naslednjega; ostale (KaTeX, klikljivi simboli) izriše v ozadju po kosih, skok na korak ali tisk pa takoj. Meritev s
// CPU 4× (MAT-SS-4/odvod, 23 korakov, telefon): prva formula 1530 → 329 ms, najdaljša dolga naloga 1437 → 209 ms.
// Preverjanje je strukturno (ni odvisno od hitrosti stroja): koliko korakov in klicev renderRich naredi prvi izris.
const LESSON_STEPS_NOW = 2;
test("lekcija: prvi izris naredi največ 2 koraka, ostali se izrišejo v ozadju ali ob skoku", async (t) => {
  const { createRequire } = await import("node:module");
  const http = await import("node:http");
  const { lessonView } = await import("../server/textbook.js");
  let playwright = null;
  try {
    playwright = createRequire(import.meta.url)("playwright");
  } catch {}
  const browser = await playwright?.chromium.launch().catch(() => null);
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const ID = "MAT-SS-4/odvod";
  const page = `<!doctype html><meta charset="utf-8"><main class="view"><div id="view-textbook" class="textbook"></div></main>
<script type="module">
import { initTextbook, openLesson, showTextbook } from "/textbook.js";
window.rr = 0;
const api = async (url) => {
  const u = new URL(url, location.href);
  if (u.pathname.endsWith("/lesson")) return (await fetch("/t-lesson.json")).json();
  throw Object.assign(new Error("?"), { status: 404 });
};
initTextbook({ api, renderRich: (s) => (window.rr++, "<p>" + s + "</p>"), escapeHtml: (s) => String(s), getStudent: () => ({ id: 1, settings: {} }),
  openTopic: async () => true, nextPractice() {}, learnWithTutor() {}, showView: () => (window.shown = showTextbook()), openLab() {}, open3d() {}, toast() {} });
window.odpri = async (k) => {
  if (k != null) sessionStorage.setItem("tb-step:${ID}", String(k));
  window.rr = 0;
  await openLesson("${ID}");
  await window.shown;
  const steps = [...document.querySelectorAll(".tb-step")];
  return { n: steps.length, now: steps.filter((s) => !s.hasAttribute("data-lazy")).map((s) => Number(s.dataset.step)), rr: window.rr,
    shown: Number(steps.find((s) => !s.hidden)?.dataset.step) };
};
window.ready = true;
</script>`;
  const lesson = JSON.stringify(lessonView(ID));
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t-lesson.json") return res.writeHead(200, { "content-type": "application/json" }).end(lesson);
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page);
    const file = path.join(pub, path.normalize(url));
    if (!file.startsWith(pub) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    const type = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json" }[path.extname(file)] || "application/octet-stream";
    res.writeHead(200, { "content-type": type }).end(fs.readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const p = await browser.newPage({ viewport: { width: 360, height: 740 } });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(`http://127.0.0.1:${server.address().port}/t.html`);
  await p.waitForFunction(() => window.ready, null, { timeout: 15000 });
  const lazyLeft = () => p.evaluate(() => document.querySelectorAll(".tb-step[data-lazy]").length);

  // Prvo odprtje: korak 1 in 2, ostali prazni; nato se v ozadju izrišejo vsi.
  const a = await p.evaluate(() => window.odpri());
  assert.ok(a.n > 10, `lekcija ${ID} ima ${a.n} korakov`);
  assert.deepEqual(a.now, [0, 1], "prvi izris: samo korak na zaslonu in naslednji");
  assert.ok(a.now.length <= LESSON_STEPS_NOW);
  await p.waitForFunction(() => !document.querySelector(".tb-step[data-lazy]"), null, { timeout: 15000 });
  const total = await p.evaluate(() => window.rr);
  assert.ok(a.rr * 4 < total, `prvi izris ${a.rr} od ${total} klicev renderRich`);
  assert.ok(await p.evaluate(() => [...document.querySelectorAll(".tb-step")].every((s) => s.querySelector(".tb-section, .tb-checks"))), "vsak korak izrisan");

  // Skok na korak (shranjen v seji, kot ob vrnitvi v lekcijo): ta korak je viden in izrisan takoj.
  const b = await p.evaluate(() => window.odpri(9));
  assert.equal(b.shown, 9);
  assert.deepEqual(b.now, [9, 10]);
  // »Naprej« večkrat hitro zapored: vsak pokazan korak ima vsebino že ob kliku.
  const empty = await p.evaluate(() => {
    const out = [];
    for (let i = 0; i < 6; i++) {
      document.querySelector("#tb-step-next").click();
      const s = document.querySelector(".tb-step:not([hidden])");
      if (!s.querySelector(".tb-section, .tb-checks")) out.push(s.dataset.step);
    }
    return out;
  });
  assert.deepEqual(empty, [], "koraki brez vsebine ob kliku »Naprej«");
  // Tisk (Ctrl+P) takoj po odprtju: vsi koraki izrisani.
  await p.evaluate(async () => {
    await window.odpri(0);
    window.dispatchEvent(new Event("beforeprint"));
  });
  assert.equal(await lazyLeft(), 0, "tisk: vsi koraki izrisani");
  assert.deepEqual(errors, []);
});
