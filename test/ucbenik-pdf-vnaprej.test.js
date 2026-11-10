// Vnaprej izdelani PDF-ji učbenika (server/ucbenik-pdf.js, scripts/ucbenik-pdf.cjs): seznam in zgoščene vrednosti,
// shramba na disku s prenosom z izdaje, pot /ucbenik-pdf (glave, Range, ETag, rezerva) in izdelava + pregled
// enega majhnega PDF-ja s Chromiumom.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { createPdfStore, pdfTargets, pdfHash, pdfTemplateHash, pdfDownloadName, PDF_MANIFEST, PDF_MAX_BYTES, PDF_FONT_NAMES } from "../server/ucbenik-pdf.js";
import { getPath, topicOrder } from "../server/curriculum.js";
import { loadLesson } from "../server/textbook.js";

const require = createRequire(import.meta.url);
const ROOT = path.join(import.meta.dirname, "..");
const KEY = "MAT-OS-8";
const UNIT = getPath(KEY).units[0].title;
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "evklid-pdf-test-"));
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const fakePdf = (text) => Buffer.from(`%PDF-1.4\n% ${text}\n${"x".repeat(5000)}\n%%EOF\n`);
const quiet = { log() {}, warn() {} };

// Lažna izdaja: kazalo in datoteke iz pomnilnika; šteje zahtevke.
function fakeRelease(files, manifest) {
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    const name = decodeURIComponent(String(url).split("/").pop());
    calls.push(name);
    if (name === PDF_MANIFEST) {
      if (!manifest.value) return new Response("ni", { status: 404 });
      const etag = `"${sha(JSON.stringify(manifest.value)).slice(0, 8)}"`;
      if (init.headers?.["If-None-Match"] === etag) return new Response(null, { status: 304 });
      return new Response(JSON.stringify(manifest.value), { status: 200, headers: { etag } });
    }
    return files[name] ? new Response(files[name], { status: 200 }) : new Response("ni", { status: 404 });
  };
  return { fetchFn, calls };
}
const entry = (file, buf, hash) => ({ file, hash, bytes: buf.length, sha256: sha(buf), pages: 3, lessons: 1 });

test("seznam PDF-jev: predmeti, razredi in poglavja šolskih učbenikov; zgoščena vrednost sledi vsebini", () => {
  const targets = pdfTargets();
  const ids = new Set(targets.map((t) => t.id));
  assert.equal(ids.size, targets.length, "vsak PDF enkrat");
  for (const id of [KEY, `${KEY}?${UNIT}`, "FIZ-OS"]) assert.ok(ids.has(id), id);
  assert.ok(!ids.has("MAT-OS"), "prevelik predmet (79 lekcij) ostane pri tisku v brskalniku");
  assert.equal(pdfHash("MAT-OS"), null);
  assert.ok(!targets.some((t) => t.key.startsWith("UNI-") || t.key.startsWith("P-")), "fakultetni učbeniki ostanejo pri tisku v brskalniku");
  const razred = targets.find((t) => t.id === KEY);
  assert.equal(razred.lessons, topicOrder(KEY).filter((t) => loadLesson(t.id)).length);
  assert.equal(new Set(targets.map((t) => t.base)).size, targets.length, "imena datotek se ne ponovijo");
  for (const t of targets) assert.match(`${t.base}.${pdfHash(t.key, t.unit)}.pdf`, /^[A-Za-z0-9][A-Za-z0-9._-]{0,150}\.pdf$/, t.id);

  const h = pdfHash(KEY);
  assert.match(h, /^[0-9a-f]{20}$/);
  assert.equal(pdfHash(KEY), h, "stabilna");
  assert.notEqual(pdfHash(KEY, UNIT), h);
  assert.notEqual(pdfHash("FIZ-OS"), h);
  assert.equal(pdfHash("NI-TAKE-POTI"), null);
  assert.equal(pdfHash(KEY, "Ni takega sklopa"), null);
  assert.equal(pdfHash("P-UL-FKKT-KEM"), null);
  assert.match(pdfTemplateHash(), /^[0-9a-f]{16}$/);
  assert.equal(pdfDownloadName(KEY), "Evklid - Matematika, 8. razred.pdf");
  assert.equal(pdfDownloadName(KEY, UNIT), `Evklid - ${UNIT} - Matematika, 8. razred.pdf`);
  assert.ok(PDF_FONT_NAMES.test("Gelasio-Regular") && !PDF_FONT_NAMES.test("LatinModernMath-Regular"));
});

test("shramba: prenese veljavne PDF-je, zavrne napačno vsoto, zastarelega ne postreže, stare pobriše", async () => {
  const dir = tmp();
  const a = fakePdf("razred");
  const b = fakePdf("poglavje");
  const fileA = `${KEY}.${pdfHash(KEY)}.pdf`;
  const fileB = `poglavje.${pdfHash(KEY, UNIT)}.pdf`;
  const manifest = { value: null };
  const rel = fakeRelease({ [fileA]: a, [fileB]: Buffer.from("%PDF-pokvarjen prenos") }, manifest);
  const store = createPdfStore({ dir, url: "https://primer.test/izdaja", fetchFn: rel.fetchFn, log: quiet });
  try {
    assert.equal(store.find(KEY), null, "prazna shramba");
    assert.equal(await store.sync(), 0);
    assert.match(store.status().napaka, /še ni objavljeno/, "brez izdaje: napaka v stanju, strežnik teče naprej");

    manifest.value = {
      v: 1,
      files: {
        [KEY]: entry(fileA, a, pdfHash(KEY)),
        [`${KEY}?${UNIT}`]: entry(fileB, b, pdfHash(KEY, UNIT)), // prenos vrne drugo vsebino
        "MAT-OS-9": entry("MAT-OS-9.0000.pdf", a, "00000000000000000000"), // zastarel: lekcije so se spremenile
        "MAT-OS-7": { ...entry("../../izven.pdf", a, pdfHash("MAT-OS-7")) }, // nedovoljeno ime
      },
    };
    fs.writeFileSync(path.join(dir, "star.1234.pdf"), "stara različica");
    assert.equal(await store.sync(), 1);
    const hit = store.find(KEY);
    assert.equal(hit.file, path.join(dir, fileA));
    assert.equal(hit.hash, pdfHash(KEY));
    assert.deepEqual(fs.readFileSync(hit.file), a);
    assert.equal(store.find(KEY, UNIT), null, "napačna kontrolna vsota se ne shrani");
    assert.equal(store.find("MAT-OS-9"), null, "zastarel PDF se ne prenese in ne postreže");
    assert.equal(store.find("MAT-OS-7"), null);
    assert.ok(!rel.calls.includes("MAT-OS-9.0000.pdf") && !rel.calls.some((c) => c.includes("izven")));
    assert.ok(!fs.existsSync(path.join(dir, "star.1234.pdf")), "stara različica je pobrisana");
    assert.deepEqual(fs.readdirSync(dir).sort(), [fileA, PDF_MANIFEST].sort(), "brez ostankov prekinjenih prenosov");
    assert.match(store.status().napaka, /kontrolna vsota/);
    assert.equal(store.status().datotek, 1);

    // Ponovna sinhronizacija: kazalo 304, datoteka A se ne prenese znova.
    const before = rel.calls.filter((c) => c === fileA).length;
    await store.sync();
    assert.equal(rel.calls.filter((c) => c === fileA).length, before);

    // Nova shramba nad isto mapo (ponovni zagon strežnika) streže takoj, brez omrežja.
    const again = createPdfStore({ dir, url: "x", fetchFn: async () => { throw new Error("ni omrežja"); }, log: quiet });
    assert.equal(again.find(KEY)?.hash, pdfHash(KEY));
    assert.equal(await again.sync(), 0);
    assert.match(again.status().napaka, /ni omrežja/);
    assert.ok(again.find(KEY), "napaka omrežja ne odstrani že prenesenih");

    // Okrnjena datoteka na disku (velikost se ne ujema) se ne postreže.
    fs.writeFileSync(hit.file, a.subarray(0, 100));
    assert.equal(store.find(KEY), null);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("shramba: meja velikosti in prostor na disku", async () => {
  const dir = tmp();
  const a = fakePdf("razred");
  const fileA = `${KEY}.${pdfHash(KEY)}.pdf`;
  const manifest = { value: { v: 1, files: { [KEY]: entry(fileA, a, pdfHash(KEY)) } } };
  try {
    const small = createPdfStore({ dir, url: "x", fetchFn: fakeRelease({ [fileA]: a }, manifest).fetchFn, maxBytes: 100, log: quiet });
    assert.equal(await small.sync(), 0, "čez skupno mejo se ne prenese");
    assert.equal(small.find(KEY), null);
    const full = createPdfStore({ dir, url: "x", fetchFn: fakeRelease({ [fileA]: a }, manifest).fetchFn, minFree: Number.MAX_SAFE_INTEGER, log: quiet });
    assert.equal(await full.sync(), 0);
    assert.match(full.status().napaka, /premalo prostora/);
    const big = { value: { v: 1, files: { [KEY]: { ...entry(fileA, a, pdfHash(KEY)), bytes: PDF_MAX_BYTES + 1 } } } };
    const store = createPdfStore({ dir, url: "x", fetchFn: fakeRelease({ [fileA]: a }, big).fetchFn, log: quiet });
    assert.equal(await store.sync(), 0, "prevelik PDF se ne prenese");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("pot /ucbenik-pdf: PDF z diska (glave, Range, ETag), sicer preusmeritev na tisk v brskalniku", async () => {
  const dir = tmp();
  const a = fakePdf("razred");
  const fileA = `${KEY}.${pdfHash(KEY)}.pdf`;
  fs.writeFileSync(path.join(dir, fileA), a);
  fs.writeFileSync(path.join(dir, PDF_MANIFEST), JSON.stringify({ v: 1, files: { [KEY]: entry(fileA, a, pdfHash(KEY)), "MAT-OS-9": entry("MAT-OS-9.0000.pdf", a, "00000000000000000000") } }));
  fs.writeFileSync(path.join(dir, "MAT-OS-9.0000.pdf"), a);
  const pdfStore = createPdfStore({ dir, url: "x", fetchFn: async () => { throw new Error("brez omrežja v testu"); }, log: quiet });
  const app = createApp(openDb(":memory:"), { scheduler: false, pdfStore });
  const srv = app.listen(0);
  const base = `http://127.0.0.1:${srv.address().port}`;
  try {
    const r = await fetch(`${base}/ucbenik-pdf/${KEY}?l=sl`);
    assert.equal(r.status, 200);
    assert.equal(r.headers.get("content-type"), "application/pdf");
    assert.equal(r.headers.get("content-length"), String(a.length));
    assert.equal(r.headers.get("accept-ranges"), "bytes");
    assert.equal(r.headers.get("etag"), `"${pdfHash(KEY)}"`);
    assert.equal(r.headers.get("cache-control"), "no-cache");
    const cd = r.headers.get("content-disposition");
    assert.match(cd, /^inline; filename="Evklid - Matematika, 8\. razred\.pdf"; filename\*=UTF-8''Evklid%20-%20Matematika%2C%208\.%20razred\.pdf$/);
    assert.deepEqual(Buffer.from(await r.arrayBuffer()), a);

    const part = await fetch(`${base}/ucbenik-pdf/${KEY}`, { headers: { Range: "bytes=0-7" } });
    assert.equal(part.status, 206);
    assert.equal(part.headers.get("content-range"), `bytes 0-7/${a.length}`);
    assert.equal(await part.text(), "%PDF-1.4");
    const tail = await fetch(`${base}/ucbenik-pdf/${KEY}`, { headers: { Range: "bytes=-6" } });
    assert.equal(tail.status, 206);
    assert.equal(await tail.text(), "%%EOF\n");
    assert.equal((await fetch(`${base}/ucbenik-pdf/${KEY}`, { headers: { Range: `bytes=${a.length + 5}-` } })).status, 416);

    // fetch ob If-None-Match sam doda »Cache-Control: no-cache« (strežnik potem ne sme vrniti 304), zato node:http.
    const get = (headers) => new Promise((ok, no) => http.get(`${base}/ucbenik-pdf/${KEY}`, { headers }, (res) => { let n = 0; res.on("data", (c) => (n += c.length)).on("end", () => ok({ status: res.statusCode, bytes: n })); }).on("error", no));
    assert.deepEqual(await get({ "If-None-Match": `"${pdfHash(KEY)}"` }), { status: 304, bytes: 0 });
    assert.deepEqual(await get({ "If-None-Match": '"stara"' }), { status: 200, bytes: a.length });
    assert.deepEqual(await get({ "If-Range": '"stara"', Range: "bytes=0-7" }), { status: 200, bytes: a.length }, "delni prenos stare različice se začne znova");
    assert.deepEqual(await get({ "If-Range": `"${pdfHash(KEY)}"`, Range: "bytes=0-7" }), { status: 206, bytes: 8 });
    const head = await fetch(`${base}/ucbenik-pdf/${KEY}`, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(head.headers.get("content-length"), String(a.length));

    // Rezerva: PDF-ja ni (poglavje) ali je zastarel (MAT-OS-9) -> tisk v brskalniku, jezik in poglavje ostaneta.
    const miss = await fetch(`${base}/ucbenik-pdf/${KEY}?poglavje=${encodeURIComponent(UNIT)}&l=de`, { redirect: "manual" });
    assert.equal(miss.status, 302);
    assert.equal(miss.headers.get("location"), `/ucbenik/${KEY}?poglavje=${encodeURIComponent(UNIT).replace(/%20/g, "+")}&l=de#natisni`);
    assert.equal(miss.headers.get("cache-control"), "no-store");
    const stale = await fetch(`${base}/ucbenik-pdf/MAT-OS-9`, { redirect: "manual" });
    assert.equal(stale.status, 302);
    assert.equal(stale.headers.get("location"), "/ucbenik/MAT-OS-9#natisni");
    const followed = await fetch(`${base}/ucbenik-pdf/MAT-OS-9?l=sl`);
    assert.equal(followed.status, 200);
    assert.match(followed.headers.get("content-type"), /text\/html/);
    assert.match(await followed.text(), /Pripravljam učbenik/);
    const bad = await fetch(`${base}/ucbenik-pdf/MAT-OS-9?l=${encodeURIComponent('"><script>')}`, { redirect: "manual" });
    assert.equal(bad.headers.get("location"), "/ucbenik/MAT-OS-9#natisni", "neveljaven jezik se ne prenese v preusmeritev");

    assert.equal((await fetch(`${base}/ucbenik-pdf/NI-TAKE-POTI`, { redirect: "manual" })).status, 404);
    assert.equal((await fetch(`${base}/ucbenik-pdf/${KEY}?poglavje=Ni%20takega`, { redirect: "manual" })).status, 404);
    assert.equal((await fetch(`${base}/ucbenik-pdf/..%2F..%2Fpackage.json`, { redirect: "manual" })).status, 404);

    const stanje = await (await fetch(`${base}/healthz/stanje`)).json();
    assert.ok("pdfUcbenika" in stanje);
  } finally {
    srv.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("skupno geslo velja tudi za vnaprej izdelane PDF-je", async () => {
  const dir = tmp();
  const a = fakePdf("razred");
  const fileA = `${KEY}.${pdfHash(KEY)}.pdf`;
  fs.writeFileSync(path.join(dir, fileA), a);
  fs.writeFileSync(path.join(dir, PDF_MANIFEST), JSON.stringify({ v: 1, files: { [KEY]: entry(fileA, a, pdfHash(KEY)) } }));
  const old = { p: process.env.EVKLID_PASSWORD, a: process.env.EVKLID_ACCOUNTS };
  process.env.EVKLID_PASSWORD = "geslo-za-test";
  delete process.env.EVKLID_ACCOUNTS;
  let srv;
  try {
    const app = createApp(openDb(":memory:"), { scheduler: false, pdfStore: createPdfStore({ dir, url: "x", log: quiet }) });
    srv = app.listen(0);
    const r = await fetch(`http://127.0.0.1:${srv.address().port}/ucbenik-pdf/${KEY}`, { redirect: "manual" });
    assert.notEqual(r.status, 200, "brez gesla PDF ni dostopen");
    assert.notEqual(r.headers.get("content-type"), "application/pdf");
  } finally {
    srv?.close();
    if (old.p == null) delete process.env.EVKLID_PASSWORD;
    else process.env.EVKLID_PASSWORD = old.p;
    if (old.a != null) process.env.EVKLID_ACCOUNTS = old.a;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("odjemalec: gumbi PDF razreda, poglavja in predmeta vodijo na /ucbenik-pdf, lekcija in formule na tisk", () => {
  const src = fs.readFileSync(path.join(ROOT, "public/textbook.js"), "utf8");
  const body = src.slice(src.indexOf("const pdfHref"), src.indexOf("};", src.indexOf("const pdfHref")) + 2);
  const pdfHref = new Function("uiLanguage", "currentLang", `${body}; return pdfHref;`)((x) => x, () => "sl");
  assert.equal(pdfHref(KEY), `/ucbenik-pdf/${KEY}?l=sl`);
  assert.equal(pdfHref(KEY, { unit: "Racionalna števila" }), `/ucbenik-pdf/${KEY}?poglavje=Racionalna+%C5%A1tevila&l=sl`);
  assert.equal(pdfHref("MAT-OS"), "/ucbenik-pdf/MAT-OS?l=sl");
  assert.equal(pdfHref(KEY, { topic: "cela-stevila" }), `/ucbenik/${KEY}/cela-stevila?l=sl#natisni`);
  assert.equal(pdfHref("MAT-OS", { topic: "formule" }), "/ucbenik/MAT-OS/formule?l=sl#natisni");
  assert.match(fs.readFileSync(path.join(ROOT, "public/sw.js"), "utf8"), /startsWith\("\/ucbenik-pdf\/"\)\) return;/, "service worker PDF-jev ne prestreza");
});

test("delovni tok: izdela, pregleda in objavi PDF-je brez pisanja v zgodovino gita", () => {
  const wf = fs.readFileSync(path.join(ROOT, ".github/workflows/ucbenik-pdf.yml"), "utf8");
  assert.match(wf, /content\/lessons\/\*\*/);
  assert.match(wf, /workflow_dispatch:/);
  assert.match(wf, /scripts\/ucbenik-pdf\.cjs/);
  assert.match(wf, /gh release upload/);
  assert.doesNotMatch(wf, /git (push|commit)/);
  assert.doesNotMatch(wf, /pull_request_target/);
});

// Izdelava enega majhnega PDF-ja (poglavje in majhen razred s kazalom) in pregled; potrebuje Chromium.
let chromium = null;
try {
  chromium = require("playwright").chromium;
  if (!fs.existsSync(chromium.executablePath())) chromium = null;
} catch {}
const hasPdftoppm = spawnSync("pdftoppm", ["-v"]).status === 0;

test("skripta izdela pravi PDF majhnega razreda in poglavja; pregled ujame napake", { skip: chromium ? false : "Playwright/Chromium ni nameščen", timeout: 240_000 }, async () => {
  const { renderPdf, checkPdf, startServer, servePdfFonts, findSlivers, optimizePdf } = require("../scripts/ucbenik-pdf.cjs");
  const cfg = await import("../server/ucbenik-pdf.js");
  const targets = pdfTargets();
  // Najmanjši razred z vsaj dvema lekcijama (kazalo) in najmanjše poglavje.
  const razred = targets.filter((t) => t.kind === "razred" && t.lessons >= 2).sort((x, y) => x.lessons - y.lessons)[0];
  const poglavje = targets.filter((t) => t.kind === "poglavje" && t.key === razred.key)[0];
  const server = await startServer();
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    await servePdfFonts(context, cfg);
    const opts = { domain: "evklid.app", maxBytes: PDF_MAX_BYTES, fontNames: cfg.PDF_FONT_NAMES, requiredFonts: cfg.PDF_FONT_REQUIRED };

    const a = await renderPdf(context, server.base, razred, cfg);
    assert.equal(a.buf.subarray(0, 5).toString("latin1"), "%PDF-");
    assert.equal(a.dom.lessons.length, razred.lessons);
    assert.equal(a.dom.toc.length, razred.lessons);
    assert.equal(a.tocPages.length, razred.lessons);
    assert.ok(a.tocPages.every((p, i) => p > 1 && (i === 0 || p > a.tocPages[i - 1])), "strani lekcij v kazalu naraščajo");
    const ok = await checkPdf(a.buf, a.dom, { ...opts, tocPages: a.tocPages });
    assert.deepEqual(ok.errors, []);
    assert.equal(ok.info.lessons, razred.lessons);
    assert.ok(ok.info.pages >= razred.lessons + 1);
    assert.ok(a.buf.length < PDF_MAX_BYTES);
    if (hasPdftoppm) assert.deepEqual(findSlivers(a.buf), []);
    else assert.match((await checkPdf(a.buf, a.dom, { ...opts, tocPages: a.tocPages, strict: true })).errors.join("\n"), /pdftoppm/, "strogi način zahteva orodje");
    // Stisnjen in lineariziran PDF (qpdf) prestane isti pregled in je manjši.
    const small = optimizePdf(a.buf);
    if (small) {
      assert.ok(small.length < a.buf.length * 0.9, `qpdf: ${a.buf.length} -> ${small.length}`);
      assert.deepEqual((await checkPdf(small, a.dom, { ...opts, tocPages: a.tocPages })).errors, []);
    }

    // Pregled ujame: manjkajočo lekcijo, napačno številko strani v kazalu, manjkajoče besedilo, preveliko datoteko.
    const extra = { ...a.dom, lessons: [...a.dom.lessons, { id: "x", title: "99. Lekcija, ki je v PDF ni", sections: [], text: "", formulas: 0 }] };
    assert.match((await checkPdf(a.buf, extra, { ...opts, tocPages: a.tocPages })).errors.join("\n"), /nima zaznamka[\s\S]*lekcij v PDF/);
    const wrongToc = a.tocPages.map((p, i) => (i === 0 ? p + 1 : p));
    assert.match((await checkPdf(a.buf, a.dom, { ...opts, tocPages: wrongToc })).errors.join("\n"), /kazalo: pri .* piše stran/);
    const more = { ...a.dom, lessons: a.dom.lessons.map((l, i) => (i ? l : { ...l, sections: [...l.sections, "Razdelek, ki ga ni"], text: `${l.text} ${Array.from({ length: 30 }, (_, k) => `izmišljenabeseda${k}`).join(" ")}` })) };
    const miss = (await checkPdf(a.buf, more, { ...opts, tocPages: a.tocPages })).errors.join("\n");
    assert.match(miss, /manjka razdelek »Razdelek, ki ga ni«/);
    assert.match(miss, /v PDF manjka \d+ od \d+ besed/);
    assert.match((await checkPdf(a.buf, a.dom, { ...opts, tocPages: a.tocPages, maxBytes: 1000 })).errors.join("\n"), /presega mejo/);
    assert.match((await checkPdf(a.buf, { ...a.dom, errors: 2, rawMd: ["| --- |"] }, { ...opts, tocPages: a.tocPages })).errors.join("\n"), /katex-error[\s\S]*neizrisan zapis/);
    assert.match((await checkPdf(a.buf, a.dom, { ...opts, tocPages: a.tocPages, requiredFonts: ["Pisava-Ki-Je-Ni"] })).errors.join("\n"), /ni uporabljena/);
    assert.match((await checkPdf(a.buf, a.dom, { ...opts, tocPages: a.tocPages, fontNames: /^Samo-Ta/ })).errors.join("\n"), /nepredvidena \(sistemska\) pisava/);
    assert.deepEqual((await checkPdf(Buffer.from("to ni pdf"), a.dom, opts)).errors, ["ni PDF"]);

    const b = await renderPdf(context, server.base, poglavje, cfg);
    assert.equal(b.dom.toc.length, 0, "poglavje nima kazala");
    assert.equal(b.dom.lessons.length, poglavje.lessons);
    assert.deepEqual((await checkPdf(b.buf, b.dom, opts)).errors, []);
  } finally {
    await browser.close();
    server.stop();
  }
});
