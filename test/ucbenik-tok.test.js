// /ucbenik brez prijave: učbenik programa (P-UL-FKKT-KEM, ~67 MB HTML) se je izrisal v en niz in proces dvignil
// z ~300 na ~900 MB RSS (strežnik Render »starter« ima 512 MB → OOM). Zdaj gre kos za kosom (lekcija za lekcijo).
import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { printPage, printPageParts } from "../server/textbook-print.js";
import { getBook } from "../server/textbook.js";

const ROOT = path.join(import.meta.dirname, "..");

test("cela pot in cel predmet: odgovor po kosih, enak kot printPage; ena lekcija v celoti", async () => {
  const srv = createApp(openDb(":memory:"), { scheduler: false }).listen(0);
  const base = `http://127.0.0.1:${srv.address().port}`;
  try {
    for (const key of ["MAT-OS-8", "FIZ-OS"]) {
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
