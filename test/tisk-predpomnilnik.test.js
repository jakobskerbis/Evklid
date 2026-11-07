// Javni poti /ucbenik/... in /gradiva/povzetek/... sta predpomnjeni po različici lekcij in poslani stisnjeno;
// spremenjena lekcija takoj da nov izris (nikoli star rezultat).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-tisk-"));
fs.cpSync(path.join(here, "..", "content", "lessons", "FIZ-OS-9"), path.join(tmp, "FIZ-OS-9"), { recursive: true });
process.env.EVKLID_LESSONS = tmp;
const { openDb } = await import("../server/db.js");
const { createApp } = await import("../server/app.js");
const { createPageCache } = await import("../server/tisk-predpomnilnik.js");

// Surov zahtevek (fetch bi odgovor sam odšifriral).
function get(base, p, headers = {}) {
  return new Promise((resolve, reject) => {
    http
      .get(base + p, { headers }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      })
      .on("error", reject);
  });
}
const text = (r) => {
  const enc = r.headers["content-encoding"];
  return (enc === "br" ? zlib.brotliDecompressSync(r.body) : enc === "gzip" ? zlib.gunzipSync(r.body) : r.body).toString("utf8");
};

test("createPageCache: izris enkrat na podpis, nov podpis = nov izris, meja velikosti", () => {
  const c = createPageCache({ maxBytes: 3000 });
  let n = 0;
  const render = (s) => () => (n++, s.repeat(500));
  assert.equal(c.get("a", "v1", render("a")).html.length, 500);
  c.get("a", "v1", render("a"));
  assert.equal(n, 1, "isti podpis: brez novega izrisa");
  assert.equal(c.get("a", "v2", render("b")).html.toString()[0], "b");
  assert.equal(n, 2, "spremenjena lekcija: nov izris");
  assert.equal(c.get("x", null, render("x")), null, "brez podpisa ni strani");
  assert.equal(c.get("y", "v1", () => null), null);
  for (const k of ["b", "c", "d", "e", "f", "g"]) c.get(k, "v1", render(k));
  assert.ok(c.stats().bytes <= 3000, JSON.stringify(c.stats()));
  assert.ok(c.stats().entries < 7);
  const big = createPageCache({ maxBytes: 600 });
  big.get("z", "v1", render("z"));
  assert.equal(big.stats().entries, 0, "prevelika stran se ne shrani");
});

test("/ucbenik in /gradiva/povzetek: stisnjeno, ETag, sveže po spremembi lekcije", async () => {
  const app = createApp(openDb(":memory:"), { scheduler: false });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const urls = ["/ucbenik/FIZ-OS-9/newtonovi-zakoni", "/ucbenik/FIZ-OS-9", "/ucbenik/FIZ-OS", "/gradiva/povzetek/FIZ-OS-9/newtonovi-zakoni"];
    for (const u of urls) {
      const plain = await get(base, u);
      assert.equal(plain.status, 200, u);
      assert.equal(plain.headers["content-encoding"], undefined);
      const br = await get(base, u, { "accept-encoding": "gzip, deflate, br" });
      assert.equal(br.headers["content-encoding"], "br", u);
      assert.ok(br.body.length < plain.body.length / 3, `${u}: ${br.body.length} od ${plain.body.length}`);
      assert.equal(text(br), plain.body.toString("utf8"), `${u}: enaka vsebina`);
      const gz = await get(base, u, { "accept-encoding": "gzip" });
      assert.equal(gz.headers["content-encoding"], "gzip");
      assert.equal(text(gz), plain.body.toString("utf8"));
      assert.match(br.headers["content-type"], /^text\/html/);
      assert.match(br.headers.vary, /Accept-Encoding/);
      assert.equal(br.headers.etag, plain.headers.etag);
      assert.equal((await get(base, u, { "if-none-match": br.headers.etag })).status, 304, u);
    }
    assert.equal((await get(base, "/ucbenik/FIZ-OS-9/ne-obstaja")).status, 404);
    assert.equal((await get(base, "/ucbenik/NI-POT")).status, 404);
    assert.equal((await get(base, "/gradiva/povzetek/FIZ-OS-9/ne-obstaja")).status, 404);

    // Sprememba lekcije: vse strani, ki jo vsebujejo, so takoj nove (tudi ob istem ETag zahtevku).
    const file = path.join(tmp, "FIZ-OS-9", "newtonovi-zakoni.md");
    const before = Object.fromEntries(await Promise.all(urls.map(async (u) => [u, (await get(base, u)).headers.etag])));
    fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace(/^## Povzetek\n+/m, "## Povzetek\n\n- Oznaka sprememb: OZNAKA-TISK-7\n"));
    const t = new Date(Date.now() + 5000);
    fs.utimesSync(file, t, t);
    for (const u of urls) {
      const r = await get(base, u, { "accept-encoding": "br", "if-none-match": before[u] });
      assert.equal(r.status, 200, `${u}: star ETag ne velja več`);
      assert.match(text(r), /OZNAKA-TISK-7/, `${u}: nova vsebina`);
      assert.notEqual(r.headers.etag, before[u]);
    }
    // Druga lekcija iste poti se ne spremeni: stran teme ostane ista.
    const other = "/ucbenik/FIZ-OS-9/" + fs.readdirSync(path.join(tmp, "FIZ-OS-9")).find((f) => f.endsWith(".md") && f !== "newtonovi-zakoni.md").slice(0, -3);
    const o1 = await get(base, other);
    if (o1.status === 200) assert.equal((await get(base, other, { "if-none-match": o1.headers.etag })).status, 304);
  } finally {
    server.close();
  }
});

test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
