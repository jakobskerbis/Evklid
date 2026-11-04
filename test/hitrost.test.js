// Hitro odprtje strani (j, 2026-11-04: »zakaj spletna stran deluje zelo počasi«):
// statične datoteke se stisnejo v ozadju in po zagonu vnaprej, igre se naložijo šele kasneje.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { compressedStatic } from "../server/compress.js";
import { startupFiles } from "../server/startup-files.js";

const PUBLIC = path.resolve("public");

function fakeRes() {
  const res = { headers: {}, statusCode: 200, body: null };
  res.setHeader = (k, v) => (res.headers[k.toLowerCase()] = v);
  res.status = (c) => ((res.statusCode = c), res);
  res.end = (b) => ((res.body = b ?? null), res);
  return res;
}
const get = async (mw, p, headers = {}) => {
  const res = fakeRes();
  let nexted = false;
  await mw({ method: "GET", path: p, headers: { "accept-encoding": "br", ...headers } }, res, () => (nexted = true));
  return { res, nexted };
};

test("startupFiles: index.html, its styles and the static module graph, games only when asked", () => {
  const list = startupFiles(PUBLIC);
  for (const u of ["/", "/app.js", "/style.css", "/theme.js", "/i18n/sl.js", "/vendor/katex/katex.min.js"]) assert.ok(list.includes(u), u);
  assert.ok(!list.some((u) => u.startsWith("/games/subjects/")), "games subjects must not be in the first load");
  const later = startupFiles(PUBLIC, "index.html", ["games/index.js"]);
  assert.ok(later.includes("/games/index.js") && later.some((u) => u.startsWith("/games/subjects/")));
  assert.deepEqual(later.slice(0, list.length), list, "first-load files come first");
  for (const u of later) if (!u.startsWith("/vendor/") && u !== "/") assert.ok(fs.existsSync(path.join(PUBLIC, u)), u);
});

test("app.js loads the games code lazily (import(), not a static import)", () => {
  const src = fs.readFileSync(path.join(PUBLIC, "app.js"), "utf8");
  assert.ok(!/^import[^;]*from\s+["']\.\/games\/index\.js["']/m.test(src));
  assert.match(src, /import\("\.\/games\/index\.js"\)/);
  // Neuspel modul si brskalnik zapomni: nov poskus (npr. po izpadu povezave) mora uporabiti drug naslov.
  assert.match(src, /import\(`\.\/games\/index\.js\?r=/);
});

test("compressedStatic: warm() prepares files, parallel requests compress once, edits are picked up", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-hitrost-"));
  const file = path.join(dir, "a.js");
  fs.writeFileSync(file, "export const a = 1;\n".repeat(200));
  const mw = compressedStatic([["/", dir]]);
  assert.equal(await mw.warm(["/a.js", "/manjka.js", "/slika.png"]), 1);
  const calls = [];
  const orig = zlib.brotliCompress;
  zlib.brotliCompress = (...a) => (calls.push(1), orig(...a));
  try {
    const [r1, r2] = await Promise.all([get(mw, "/a.js"), get(mw, "/a.js")]);
    assert.equal(calls.length, 0, "warm() already compressed it");
    assert.equal(r1.res.headers["content-encoding"], "br");
    assert.equal(zlib.brotliDecompressSync(r1.res.body).toString(), fs.readFileSync(file, "utf8"));
    assert.equal(r1.res.headers.etag, r2.res.headers.etag);
    const again = await get(mw, "/a.js", { "if-none-match": r1.res.headers.etag });
    assert.equal(again.res.statusCode, 304);
    // Nova različica datoteke: novo stiskanje (enkrat za obe hkratni zahtevi) in nov ETag.
    fs.writeFileSync(file, "export const b = 2;\n".repeat(200));
    fs.utimesSync(file, new Date(), new Date(Date.now() + 5000));
    const [n1, n2] = await Promise.all([get(mw, "/a.js"), get(mw, "/a.js")]);
    assert.equal(calls.length, 1);
    assert.notEqual(n1.res.headers.etag, r1.res.headers.etag);
    assert.equal(zlib.brotliDecompressSync(n2.res.body).toString(), fs.readFileSync(file, "utf8"));
  } finally {
    zlib.brotliCompress = orig;
  }
  // Brez brotli/gzip, neznana vrsta ali pot ven iz mape: naprej na express.static.
  const plain = fakeRes();
  let nexted = false;
  await mw({ method: "GET", path: "/a.js", headers: {} }, plain, () => (nexted = true));
  assert.ok(nexted);
  assert.ok((await get(mw, "/../x.js")).nexted);
  fs.rmSync(dir, { recursive: true, force: true });
});
