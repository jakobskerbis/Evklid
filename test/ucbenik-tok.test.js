// /ucbenik brez prijave: učbenik programa (P-UL-FKKT-KEM, ~67 MB HTML) se je izrisal v en niz in proces dvignil
// z ~300 na ~900 MB RSS (strežnik Render »starter« ima 512 MB → OOM). Zdaj gre kos za kosom (lekcija za lekcijo).
import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import zlib from "node:zlib";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { printPage, printPageParts, printSizeHint, streamParts } from "../server/textbook-print.js";
import { getBook } from "../server/textbook.js";

const ROOT = path.join(import.meta.dirname, "..");

test("velika cela pot in predmet: odgovor po kosih, enak kot printPage; ena lekcija v celoti", async () => {
  // Meja predpomnilnika 1 MB: MAT-OS-8 (ocena ~6 MB) in FIZ-OS (~11 MB) sta »velika« (ocena > pol meje).
  process.env.EVKLID_TISK_MB = "1";
  const app = createApp(openDb(":memory:"), { scheduler: false });
  delete process.env.EVKLID_TISK_MB;
  const srv = app.listen(0);
  const base = `http://127.0.0.1:${srv.address().port}`;
  try {
    for (const key of ["MAT-OS-8", "FIZ-OS", "MAT-OS-8"]) {
      assert.ok(printSizeHint(key) > 0.5 * 1048576, key);
      const r = await fetch(`${base}/ucbenik/${key}`);
      assert.equal(r.status, 200, key);
      assert.match(r.headers.get("content-type"), /text\/html/);
      assert.equal(r.headers.get("content-length"), null, `${key}: brez Content-Length (pošiljanje po kosih)`);
      const html = await r.text();
      // Datum izdaje je v obeh enak (isti dan); vsebina mora biti enaka staremu izrisu v enem nizu.
      assert.equal(html, printPage(key), key);
      assert.match(html, /^<!doctype html>/);
      assert.match(html, /<\/main>\n<script src="\/ucbenik-tisk.js"><\/script>\n<\/body><\/html>$/);
    }
    const one = await fetch(`${base}/ucbenik/FIZ-OS-9/upor-in-ohmov-zakon`);
    assert.equal(one.status, 200);
    assert.ok(Number(one.headers.get("content-length")) > 0, "ena lekcija ostane v celoti (ETag, dolžina)");
    assert.equal((await fetch(`${base}/ucbenik/MAT-OS-8/formule`)).status, 200);
    assert.equal((await fetch(`${base}/ucbenik/NI-TAKE-POTI`)).status, 404);
  } finally {
    srv.close();
  }
});

test("printPageParts izrisuje sproti: prvi kos brez izrisa vseh lekcij", () => {
  const parts = printPageParts("MAT-OS-8")[Symbol.iterator]();
  const first = parts.next().value;
  assert.match(first, /<h2>Kazalo<\/h2>/, "lupina in kazalo sta prvi kos");
  assert.doesNotMatch(first, /<article class="lesson"/, "lekcije pridejo pozneje, ena za drugo");
  const second = parts.next().value;
  assert.match(second, /^<article class="lesson"/);
  assert.equal((second.match(/<article class="lesson"/g) || []).length, 1, "en kos = ena lekcija");
  parts.return();
  assert.equal(printPageParts("NI-TAKE-POTI"), null);
  assert.equal(printPageParts("MAT-OS-8", "ni-take-teme"), null);
});

test("streamParts: zbere stran za predpomnilnik do meje, večje ali prekinjene ne", async () => {
  const fake = () => {
    const out = [];
    return { out, destroyed: false, write: (c) => (out.push(c), true), end() { this.ended = true; }, on() {}, off() {} };
  };
  const a = fake();
  const buf = await streamParts(a, ["<p>", "šola", "</p>"], { collect: 100 });
  assert.equal(buf.toString(), "<p>šola</p>");
  assert.equal(Buffer.concat(a.out).toString(), "<p>šola</p>");
  assert.ok(a.ended);
  assert.equal(await streamParts(fake(), ["x".repeat(60), "y".repeat(60)], { collect: 100 }), null, "nad mejo: ne zbere");
  assert.equal(await streamParts(fake(), ["a", "b"]), null, "brez collect");
  const gone = fake();
  gone.destroyed = true;
  assert.equal(await streamParts(gone, ["a"], { collect: 100 }), null, "prekinjena povezava");
});

test("printSizeHint: ocena velikosti brez izrisa (P-UL-FKKT-KEM ~67 MB)", () => {
  assert.ok(printSizeHint("MAT-OS-8") > 1e6 && printSizeHint("MAT-OS-8") < 20e6, String(printSizeHint("MAT-OS-8")));
  if (getBook(BIG)) assert.ok(printSizeHint(BIG) > 42 * 1048576, "učbenik programa je nad mejo predpomnilnika");
  assert.equal(printSizeHint("NI-TAKE-POTI"), 0);
});

const rawGet = (base, p, opts = {}) =>
  new Promise((resolve) => {
    const req = http.request(base + p, { method: opts.method || "GET", headers: opts.headers || {} }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks), complete: res.complete }));
      res.on("aborted", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks), complete: false }));
      res.on("error", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks), complete: false }));
    });
    req.on("error", (e) => resolve({ error: e }));
    req.end();
  });

// Pregled #519 B, P2-1: napaka med izrisom po poslanih glavah = vidno opozorilo in prekinjen prenos, ne tiho odrezana stran.
test("streamParts: napaka med izrisom → opozorilo na strani in prekinjen prenos (tudi stisnjeno)", async () => {
  for (const encoding of [null, "gzip"]) {
    const srv = http.createServer((req, res) => {
      res.setHeader("Content-Type", "text/html");
      function* parts() {
        yield "<p>prvi del</p>".repeat(1000);
        throw new Error("lekcija se ni izrisala");
      }
      streamParts(res, parts(), { collect: 1e6, encoding }).then((buf) => res.emit("result", buf));
    }).listen(0);
    const origErr = console.error;
    console.error = () => {};
    try {
      const r = await rawGet(`http://127.0.0.1:${srv.address().port}`, "/");
      const body = encoding ? zlib.gunzipSync(r.body, { finishFlush: zlib.constants.Z_SYNC_FLUSH }).toString() : r.body.toString();
      assert.match(body, /prvi del/);
      assert.match(body, /role="alert"[^>]*>Učbenika ni bilo mogoče izrisati do konca/, `${encoding}: vidno opozorilo`);
      assert.equal(r.complete, false, `${encoding}: prenos ni označen kot cel`);
    } finally {
      console.error = origErr;
      srv.close();
    }
  }
});

// Pregled #519 B, P2-2: izris po kosih sprosti glavno nit med kosi.
test("streamParts: med kosi tečejo drugi zahtevki (glavna nit ni zasedena do konca)", async () => {
  let ticks = 0;
  const iv = setInterval(() => ticks++, 0);
  const res = { destroyed: false, writableEnded: false, write: () => true, end() { this.writableEnded = true; }, on() {}, off() {} };
  function* parts() {
    for (let i = 0; i < 20; i++) {
      const t = Date.now();
      while (Date.now() - t < 5); // ~5 ms izrisa na lekcijo
      yield "<article></article>";
    }
  }
  await streamParts(res, parts());
  clearInterval(iv);
  assert.ok(ticks >= 10, `med 20 kosi je časovnik tekel ${ticks}-krat`);
});

// Največji učbenik programa (7. 11.: P-UL-FKKT-KEM, 67 MB) z omejeno kopico: prej se je proces sesul (FATAL ERROR: heap limit).
const BIG = "P-UL-FKKT-KEM";

test("največji učbenik programa se prenese z omejeno kopico (160 MB) brez zrušitve", { timeout: 180_000 }, async (t) => {
  if (!getBook(BIG)) return t.skip(`${BIG} ne obstaja več`);
  const big = { key: BIG };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-tok-"));
  const port = 20000 + Math.floor(Math.random() * 20000);
  const srv = spawn(process.execPath, ["--max-old-space-size=160", "--disable-warning=ExperimentalWarning", "server/index.js"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", EVKLID_ACCOUNTS: "", ANTHROPIC_API_KEY: "", RESEND_API_KEY: "", STRIPE_SECRET_KEY: "" },
    stdio: ["ignore", "ignore", "pipe"],
  });
  let err = "";
  srv.stderr.on("data", (d) => (err += d));
  const base = `http://127.0.0.1:${port}`;
  try {
    let up = false;
    for (let i = 0; i < 300 && !up; i++) {
      up = await fetch(`${base}/healthz`).then((r) => r.ok, () => false);
      if (!up) await new Promise((r) => setTimeout(r, 100));
    }
    assert.ok(up, `strežnik se ni zagnal: ${err.slice(-500)}`);
    const r = await fetch(`${base}/ucbenik/${big.key}`);
    assert.equal(r.status, 200);
    const html = await r.text().catch((e) => assert.fail(`prenos ${big.key} prekinjen (${e.cause?.message || e.message}): ${err.slice(-300)}`));
    assert.ok(html.length > 20e6, `${big.key}: ${html.length} znakov`);
    assert.ok(html.endsWith("</body></html>"), "odgovor je cel");
    assert.equal(srv.exitCode, null, "strežnik še teče");
  } finally {
    srv.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("HEAD velikega učbenika ne izriše strani", { timeout: 60_000 }, async (t) => {
  if (!getBook(BIG)) return t.skip(`${BIG} ne obstaja več`);
  const srv = createApp(openDb(":memory:"), { scheduler: false }).listen(0);
  try {
    const t0 = Date.now();
    const r = await rawGet(`http://127.0.0.1:${srv.address().port}`, `/ucbenik/${BIG}`, { method: "HEAD" });
    assert.equal(r.status, 200);
    assert.match(r.headers["content-type"], /text\/html/);
    assert.ok(Date.now() - t0 < 1500, `HEAD ${Date.now() - t0} ms (izris traja ~4 s)`);
  } finally {
    srv.close();
  }
});
