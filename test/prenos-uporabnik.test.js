// Točka A4: prenosi z uporabniškega naslova (server/prenos-uporabnik.js). Naslov se preveri tudi ob povezovanju,
// zato DNS rebinding (prvi odgovor javen, drugi zaseben) ne pride do zasebnega naslova; telo z mejo po razširjanju.
// Zagon: node --test test/prenos-uporabnik.test.js
import test from "node:test";
import assert from "node:assert/strict";
import zlib from "node:zlib";
import { PassThrough } from "node:stream";
import { fetchIcs } from "../server/schedule.js";
import { beriTok, prenesiJavno, PRENOS_MAX } from "../server/prenos-uporabnik.js";

test("A4 DNS rebinding: drugi odgovor DNS (ob povezovanju) je zaseben, prenos se ustavi", async () => {
  let klicev = 0;
  const lookup = async () => (++klicev === 1 ? [{ address: "93.184.216.34", family: 4 }] : [{ address: "127.0.0.1", family: 4 }]);
  await assert.rejects(fetchIcs("https://rebind.example.invalid/a.ics", { lookup }), /ni javen/);
  assert.equal(klicev, 2, "naslov je preverjen pred prenosom in ob povezovanju");
  // Tudi oblika IPv6, ki nosi zasebni IPv4, in mešan seznam (en naslov zaseben).
  let k2 = 0;
  const mesan = async () => (++k2 === 1 ? [{ address: "93.184.216.34" }] : [{ address: "93.184.216.34" }, { address: "::ffff:10.0.0.5" }]);
  await assert.rejects(prenesiJavno("https://rebind2.example.invalid/x", { lookup: mesan }), (e) => e.code === "ZASEBNI");
});

test("A4 naslov: samo https na 443 brez gesla; zasebni naslov IP takoj zavrnjen", async () => {
  for (const u of ["http://example.org/a", "https://u:p@example.org/a", "https://example.org:8443/a", "ni naslov"]) {
    await assert.rejects(prenesiJavno(u, { lookup: async () => [{ address: "93.184.216.34" }] }), (e) => e.code === "NASLOV", u);
  }
  await assert.rejects(prenesiJavno("https://[::ffff:7f00:1]/a"), (e) => e.code === "ZASEBNI");
  await assert.rejects(prenesiJavno("https://ni.example.invalid/a", { lookup: async () => [] }), (e) => e.code === "NI_NASLOVA");
});

function odziv(telo, headers = {}) {
  const res = new PassThrough();
  res.headers = headers;
  res.end(telo);
  return res;
}

test("A4 telo: gzip in br se razširita, meja velja po razširjanju (bomba gzip)", async () => {
  assert.equal(await beriTok(odziv(zlib.gzipSync("BEGIN:VCALENDAR č"), { "content-encoding": "gzip" }), PRENOS_MAX), "BEGIN:VCALENDAR č");
  assert.equal(await beriTok(odziv(zlib.brotliCompressSync("ŠUM"), { "content-encoding": "br" }), PRENOS_MAX), "ŠUM");
  const bomba = zlib.gzipSync(Buffer.alloc(10 * 1024 * 1024, 65)); // 10 MB razširjeno, nekaj kB stisnjeno
  assert.ok(bomba.length < 100_000);
  await assert.rejects(beriTok(odziv(bomba, { "content-encoding": "gzip" }), PRENOS_MAX), (e) => e.code === "PREVELIK");
  await assert.rejects(beriTok(odziv(Buffer.alloc(PRENOS_MAX + 1, 65)), PRENOS_MAX), (e) => e.code === "PREVELIK");
});
