// Učbenik za PDF (pregled: 30 s na telefonu): tisk brez MathML, »PDF poglavja«, pregrada z napredkom,
// zaznava brskalnikov brez tiskanja in predgrevanje predpomnilnika po zagonu.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { printPage, printSignature, renderMd, unitTopics } from "../server/textbook-print.js";
import { getPath } from "../server/curriculum.js";

const ROOT = path.join(import.meta.dirname, "..");
const KEY = "MAT-OS-8";
const UNIT = getPath(KEY).units[0].title; // »Racionalna števila«, 3 lekcije

test("tisk izpiše formule brez MathML, aplikacija ga obdrži", () => {
  assert.doesNotMatch(renderMd("$x^2$", "html"), /katex-mathml/);
  assert.match(renderMd("$x^2$"), /katex-mathml/);
  assert.doesNotMatch(printPage(KEY, null, UNIT), /katex-mathml/);
  assert.match(printPage(KEY, null, UNIT), /class="katex-html"/);
});

test("PDF poglavja: samo lekcije sklopa, brez kazala, podpis in meje", () => {
  const topics = unitTopics(KEY, UNIT);
  assert.ok(topics.length >= 2);
  const html = printPage(KEY, null, UNIT);
  assert.equal((html.match(/<article class="lesson"/g) || []).length, topics.length);
  assert.doesNotMatch(html, /<h2>Kazalo<\/h2>/);
  assert.ok(html.length < printPage(KEY).length / 3, "poglavje je precej manjše od celega razreda");
  assert.match(html, /data-skupaj="3"/);
  assert.ok(printSignature(KEY, null, UNIT));
  assert.notEqual(printSignature(KEY, null, UNIT), printSignature(KEY, null));
  assert.equal(printSignature(KEY, null, "Ni takega sklopa"), null);
  assert.equal(printPage(KEY, null, "Ni takega sklopa"), null);
  assert.equal(printPage("NI-TAKE-POTI", null, UNIT), null);
  assert.deepEqual(unitTopics(KEY, ""), []);
});

test("pot /ucbenik?poglavje=: poglavje, 404 za neznano, lekcija in cel razred nespremenjena", async () => {
  const app = createApp(openDb(":memory:"), { scheduler: false });
  const srv = app.listen(0);
  const base = `http://127.0.0.1:${srv.address().port}`;
  try {
    const q = (u) => `${base}/ucbenik/${KEY}?poglavje=${encodeURIComponent(u)}`;
    const a = await fetch(q(UNIT));
    assert.equal(a.status, 200);
    const htmlA = await a.text();
    assert.equal(htmlA, printPage(KEY, null, UNIT));
    const other = getPath(KEY).units[1].title;
    const htmlB = await (await fetch(q(other))).text();
    assert.notEqual(htmlA, htmlB, "vsako poglavje ima svoj vnos v predpomnilniku");
    assert.equal((await fetch(q("Ni takega sklopa"))).status, 404);
    const full = await (await fetch(`${base}/ucbenik/${KEY}`)).text();
    assert.match(full, /<h2>Kazalo<\/h2>/);
    assert.equal(full, printPage(KEY));
    assert.ok(full.length > 3 * htmlA.length);
    assert.equal((await fetch(`${base}/ucbenik/${KEY}/${getPath(KEY).units[0].topics[0].id.split("/")[1]}?poglavje=x`)).status, 200, "pri lekciji se poglavje prezre");
  } finally {
    srv.close();
  }
});

test("pregrada »Pripravljam učbenik …« z napredkom je na vrhu strani, pred vsebino, in skrita pri tisku", () => {
  const html = printPage(KEY);
  const lessons = (html.match(/<article class="lesson"/g) || []).length;
  assert.match(html, new RegExp(`id="priprava"[^>]*data-skupaj="${lessons}"`));
  assert.ok(html.indexOf("Pripravljam učbenik") < html.indexOf('<main>'));
  assert.ok(html.indexOf("/ucbenik-priprava.js") < html.indexOf('<main>'), "skripta teče, še preden pride vsebina");
  assert.match(html, /@media print \{\s*\.priprava \{ display: none; \}/);
  // gumbi ≥ 40 px
  assert.match(html, /\.bar button \{[^}]*min-height: 44px/);
  assert.match(html, /\.priprava \.p-akcije button \{[^}]*min-height: 44px/);
});

test("zaznava brskalnikov, ki ne znajo tiskati", () => {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(ROOT, "public", "ucbenik-priprava.js"), "utf8"), ctx);
  const ne = ctx.neZnaTiskati;
  const iosSafari = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
  const iosChrome = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0 Mobile/15E148 Safari/604.1";
  const androidChrome = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";
  const desktop = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
  for (const ua of [iosSafari, iosChrome, androidChrome, desktop, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Gecko/20100101 Firefox/127.0"]) assert.equal(ne(ua), false, ua);
  const fbAndroid = "Mozilla/5.0 (Linux; Android 13; SM-S911B Build/TP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/460.0]";
  const instaIos = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21F90 Instagram 340.0";
  const iosWebView = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
  const androidWv = "Mozilla/5.0 (Linux; Android 12; Pixel 6 Build/SD1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0 Mobile Safari/537.36";
  const tiktok = "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 Chrome/100.0 Mobile Safari/537.36 musical_ly_2022";
  for (const ua of [fbAndroid, instaIos, iosWebView, androidWv, tiktok]) assert.equal(ne(ua), true, ua);
  assert.equal(ne(desktop, false), true, "brez window.print");
  assert.equal(ne(androidWv + " EvklidApp/1.4.0"), false, "APK Evklid: /ucbenik/ odpre sistemski brskalnik, brez navodila");
});

test("pregrada je privzeto skrita (CSS), skripta jo prikaže; varnostni čas z gumbom »Vseeno prikaži«", () => {
  const html = printPage(KEY, null, UNIT);
  assert.match(html, /\.priprava \{ display: none;/);
  assert.match(html, /\.priprava\.p-on \{ display: flex; \}/);
  assert.match(html, /class="p-prikazi"/);
  const src = fs.readFileSync(path.join(ROOT, "public", "ucbenik-priprava.js"), "utf8");
  assert.match(src, /classList\.add\("p-on"\)/);
  assert.match(src, /45_000/);
  assert.doesNotMatch(src, /r\.ok \? r\.json\(\)/);
  assert.match(src, /const url = location\.href;/);
});

test("navodilo v brskalniku brez tiskanja: besedila in gumbi v pregradi, samodejni tisk se ne sproži", () => {
  const src = fs.readFileSync(path.join(ROOT, "public", "ucbenik-priprava.js"), "utf8");
  assert.match(src, /window\.__tiskNe = unsupported/);
  assert.match(fs.readFileSync(path.join(ROOT, "public", "ucbenik-tisk.js"), "utf8"), /!window\.__tiskNe/);
  const html = printPage(KEY, null, UNIT);
  assert.match(html, /Odpri povezavo v Chromu ali Safariju/);
  assert.match(html, /class="p-kopiraj"/);
});

test("predgrevanje po zagonu: strani razredov pridejo v predpomnilnik (brez predaha), drugi klic jih ne izrisuje znova", async () => {
  process.env.EVKLID_TISK_PREDAH_MS = "0";
  const app = createApp(openDb(":memory:"), { scheduler: false });
  const n = await app.locals.tiskPredgrej();
  assert.ok(n > 0, "vsaj ena stran");
  assert.equal(await app.locals.tiskPredgrej(), 0, "že v predpomnilniku");
  process.env.EVKLID_TISK_PREDGREJ = "0";
  assert.equal(await app.locals.tiskPredgrej(), 0);
  delete process.env.EVKLID_TISK_PREDGREJ;
  delete process.env.EVKLID_TISK_PREDAH_MS;
});

test("ključi za jezike so v vseh jezikih (sl.js in 31 prevodov), povezave v učbeniku nosijo jezik", async () => {
  const keys = ["tbk.pdfUnit", "tbk.pdfLesson", "tbk.pdfPrep", "tbk.pdfProgress", "tbk.pdfNoPrint", "tbk.pdfCopy", "tbk.pdfCopied", "tbk.pdfTry", "tbk.pdfShow", "tbk.pdfSave"];
  const dir = path.join(ROOT, "public", "i18n", "ui");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.ok(files.length >= 31);
  for (const f of files) {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    for (const k of keys) assert.ok(d[k]?.trim(), `${f} ${k}`);
    for (const v of ["{done}", "{total}"]) assert.ok(d["tbk.pdfProgress"].includes(v), `${f} ${v}`);
  }
  const tb = fs.readFileSync(path.join(ROOT, "public", "textbook.js"), "utf8");
  assert.match(tb, /tbk\.pdfUnit/);
  assert.doesNotMatch(tb, /#natisni"[^`]*>\$\{ic\("download"\)\}PDF lekcije/, "besedilo ni več vdelano");
});
