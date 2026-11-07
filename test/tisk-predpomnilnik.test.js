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
  const big = createPageCache({ maxBytes: 600, compress: false });
  big.get("z", "v1", () => "z".repeat(700));
  assert.equal(big.stats().entries, 0, "stran nad mejo se ne shrani");
  big.get("w", "v1", () => "w".repeat(450));
  assert.equal(big.stats().entries, 1, "stran med polovico meje in mejo se shrani (pregled #516: MAT-SS 23 MB pri meji 40 MB)");
});

// Pregled #516 B, P1: stran nad mejo se ne stisne vnaprej v br + gzip (rezultat bi se zavrgel; 549 MB RSS pri 2 zahtevkih).
test("createPageCache: stran nad mejo brez vnaprejšnjega stiskanja; stisne se le zahtevano kodiranje", async () => {
  const c = createPageCache({ maxBytes: 4000, compress: true });
  const e = c.get("p", "v1", () => "<p>velik učbenik</p>".repeat(400)); // ~8 KB > 4 KB
  assert.equal(e.cached, false);
  assert.equal(e.slim, undefined, "brez br + gzip vnaprej");
  assert.equal(e.pending.br, undefined);
  assert.equal(e.pending.gzip, undefined);
  assert.deepEqual(c.stats(), { entries: 0, bytes: 0, inflight: 0 });
  const res = fakeRes();
  await c.send({ headers: { "accept-encoding": "gzip" } }, res, e);
  assert.equal(res.headers["Content-Encoding"], "gzip");
  assert.equal(e.br, undefined, "br se ni izračunal");
  assert.equal(zlib.gunzipSync(res.body).toString(), e.html.toString());
});

// Pregled #516 B, P2: velika stran tik pod mejo ne izrine ostalih vnosov (in ne sebe): vstavi se stisnjena.
test("createPageCache: velika stran se vstavi šele stisnjena in ne izrine ostalih", async () => {
  const c = createPageCache({ maxBytes: 40_000, compress: true });
  let n = 0;
  for (const k of ["a", "b", "c"]) c.get(k, "v1", () => `<p>${k}</p>`.repeat(1000)); // 3 × 8 KB surovo
  const before = c.stats();
  assert.equal(before.entries, 3);
  const page = () => (n++, Array.from({ length: 1000 }, (_, i) => `<li>Lekcija ${i}: ${"razlaga ".repeat(1 + (i % 3))}</li>`).join("")); // ~38 KB
  const e = c.get("big", "v1", page);
  assert.ok(e.size > 30_000 && e.size <= 40_000, String(e.size));
  assert.equal(c.get("big", "v1", page), e, "med stiskanjem isti vnos, brez drugega izrisa");
  assert.equal(n, 1);
  assert.equal(c.stats().entries, 3, "med stiskanjem ostali vnosi ostanejo");
  await e.slim;
  const after = c.stats();
  assert.equal(after.entries, 4, JSON.stringify(after));
  assert.equal(e.cached, true);
  assert.equal(e.html, null);
  assert.equal(after.bytes, before.bytes + e.br.length + e.gzip.length);
  assert.equal(c.get("big", "v1", page), e);
  assert.equal(n, 1);
  // Brez stiskanja (EVKLID_COMPRESS=0) se taka stran shrani surova kot prej.
  const raw = createPageCache({ maxBytes: 40_000, compress: false });
  assert.equal(raw.get("big", "v1", page).cached, true);
});

test("pickEncoding: q=0 pomeni, da odjemalec kodiranja ne sprejme", async () => {
  const { pickEncoding } = await import("../server/compress.js");
  assert.equal(pickEncoding("gzip, deflate, br"), "br");
  assert.equal(pickEncoding("br;q=0, gzip"), "gzip");
  assert.equal(pickEncoding("br;q=0.0, gzip;q=0"), null);
  assert.equal(pickEncoding("br;q=0.5"), "br");
  assert.equal(pickEncoding("gzip"), "gzip");
  assert.equal(pickEncoding(""), null);
  assert.equal(pickEncoding("identity"), null);
});

function fakeRes() {
  const res = { headers: {}, statusCode: 200, body: null };
  res.setHeader = (k, v) => (res.headers[k] = v);
  res.status = (s) => ((res.statusCode = s), res);
  res.end = (b) => (res.body = b);
  return res;
}

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

// Ponoven zagon (posodobitev z novo lekcijo): zaporedne številke lekcij se v novem procesu ponovijo, zato ETag ne sme
// biti iz podpisa (pregled #516, P1). Vsak zagon je svoj proces.
const { spawnSync } = await import("node:child_process");
const SERVE_ONCE = `
const http = await import("node:http");
const { openDb } = await import(${JSON.stringify(new URL("../server/db.js", import.meta.url).href)});
const { createApp } = await import(${JSON.stringify(new URL("../server/app.js", import.meta.url).href)});
const s = createApp(openDb(":memory:"), { scheduler: false }).listen(0);
const out = {};
for (const u of ["/ucbenik/FIZ-OS-9/newtonovi-zakoni", "/ucbenik/FIZ-OS-9"]) {
  out[u] = await new Promise((ok) => http.get("http://127.0.0.1:" + s.address().port + u, { headers: JSON.parse(process.env.INM || "{}")[u] ? { "if-none-match": JSON.parse(process.env.INM)[u] } : {} }, (r) => { r.resume(); r.on("end", () => ok({ status: r.statusCode, etag: r.headers.etag })); }));
}
console.log(JSON.stringify(out));
s.close(); process.exit(0);`;
const runOnce = (inm = {}) => {
  const r = spawnSync(process.execPath, ["--input-type=module", "-e", SERVE_ONCE], { env: { ...process.env, EVKLID_LESSONS: tmp, INM: JSON.stringify(inm) }, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout.trim().split("\n").at(-1));
};

test("ETag po ponovnem zagonu: spremenjena lekcija ne da 304 (drug proces, isti vrstni red lekcij)", () => {
  const first = runOnce();
  const same = runOnce(Object.fromEntries(Object.entries(first).map(([u, r]) => [u, r.etag])));
  for (const [u, r] of Object.entries(same)) assert.equal(r.status, 304, `${u}: nespremenjena vsebina po zagonu → 304`);
  const file = path.join(tmp, "FIZ-OS-9", "newtonovi-zakoni.md");
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace(/^## Povzetek\n+/m, "## Povzetek\n\n- Po zagonu: OZNAKA-ZAGON\n"));
  const after = runOnce(Object.fromEntries(Object.entries(first).map(([u, r]) => [u, r.etag])));
  for (const [u, r] of Object.entries(after)) {
    assert.equal(r.status, 200, `${u}: star ETag po zagonu ne velja`);
    assert.notEqual(r.etag, first[u].etag);
  }
});

test("velika stran: shranjena kot br + gzip brez surovega HTML, odjemalec brez stiskanja dobi celo stran", async () => {
  const c = createPageCache({ maxBytes: 400000 });
  const html = Array.from({ length: 8000 }, (_, i) => `<p>Odstavek ${i} z nekaj besedila.</p>`).join("");
  assert.ok(html.length > 400000 / 2 && html.length <= 400000, String(html.length));
  let n = 0;
  const e = c.get("velika", "v1", () => (n++, html));
  await e.slim;
  assert.equal(e.html, null, "surov HTML zavržen");
  assert.ok(e.br && e.gzip);
  assert.equal(c.stats().bytes, e.br.length + e.gzip.length);
  assert.equal(c.get("velika", "v1", () => (n++, html)), e, "drugi zahtevek iz predpomnilnika");
  assert.equal(n, 1);
  const res = { h: {}, code: 200, setHeader: (k, v) => (res.h[k.toLowerCase()] = v), status: (x) => ((res.code = x), res), end: (b) => (res.body = b) };
  await c.send({ headers: {} }, res, e);
  assert.equal(res.body.toString("utf8"), html);
  assert.equal(res.h["content-length"], Buffer.byteLength(html));
});

test("send: šibka primerjava, If-None-Match *, EVKLID_COMPRESS=0 brez stiskanja", async () => {
  const fake = (headers) => {
    const res = { code: 200, h: {}, body: null, setHeader: (k, v) => (res.h[k.toLowerCase()] = v), status: (c) => ((res.code = c), res), end: (b) => (res.body = b ?? null) };
    return [{ headers }, res];
  };
  const c = createPageCache();
  const e = c.get("k", "s", () => "x".repeat(5000));
  const strong = e.etag.replace(/^W\//, "");
  for (const inm of [strong, e.etag, `"drug", ${e.etag}`, "*"]) {
    const [req, res] = fake({ "if-none-match": inm });
    await c.send(req, res, e);
    assert.equal(res.code, 304, inm);
  }
  const plain = createPageCache({ compress: false });
  const e2 = plain.get("k", "s", () => "x".repeat(5000));
  const [req, res] = fake({ "accept-encoding": "br, gzip" });
  await plain.send(req, res, e2);
  assert.equal(res.h["content-encoding"], undefined);
  assert.equal(res.body.length, 5000);
  const other = createPageCache().get("k", "s", () => "y".repeat(5000));
  assert.notEqual(other.etag, e.etag, "isti ključ in podpis, druga vsebina → drug ETag");
});

test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
