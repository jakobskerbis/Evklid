// 3D modeli (GLB, HDR) stisnjeni z brotli brez izgube (j 25. 11. 2026: »Stisni vse kar je smiselno«): server/tri-d.js brModeli.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import express from "express";
import { brModeli } from "../server/tri-d.js";

async function pripravi() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "evk-modeli-"));
  const mapa = fs.mkdtempSync(path.join(os.tmpdir(), "evk-br-"));
  fs.mkdirSync(path.join(root, "organi-3d"));
  const vsebina = Buffer.concat([Buffer.from("glTF"), Buffer.alloc(200_000, 7), Buffer.from("konec")]);
  fs.writeFileSync(path.join(root, "organi-3d", "srce.glb"), vsebina);
  fs.writeFileSync(path.join(mapa, "star-model.br"), "x"); // kopija stare različice: warm jo pobriše
  // seznam kot modelList (server/tri-d.js): velikost in različica vsebine
  let body = null;
  const osvezi = () => {
    const raw = fs.readFileSync(path.join(root, "organi-3d", "srce.glb"));
    body = { datoteke: { "organi-3d/srce.glb": { b: raw.length, v: String(raw.length) } } };
  };
  const mw = brModeli({ root, mapa, seznam: () => body, osvezi });
  const app = express();
  app.use("/3d/modeli", mw);
  app.use("/3d/modeli", express.static(root));
  const srv = await new Promise((r) => {
    const s = app.listen(0, () => r(s));
  });
  const url = `http://127.0.0.1:${srv.address().port}/3d/modeli/organi-3d/srce.glb`;
  return { root, mapa, mw, srv, url, vsebina };
}
// fetch v Node razširi br sam: surovi odgovor beremo prek http
import http from "node:http";
const get = (url, headers = {}) =>
  new Promise((res, rej) =>
    http
      .get(url, { headers }, (r) => {
        const kosi = [];
        r.on("data", (k) => kosi.push(k));
        r.on("end", () => res({ status: r.statusCode, h: r.headers, body: Buffer.concat(kosi) }));
      })
      .on("error", rej),
  );

test("GLB: prvič nestisnjen in v vrsti, po stiskanju brotli z isto vsebino, X-File-Size, ETag in 304", async (t) => {
  const { mw, srv, url, vsebina, mapa } = await pripravi();
  t.after(() => srv.close());
  const prvi = await get(url, { "accept-encoding": "gzip, deflate, br" });
  assert.equal(prvi.status, 200);
  assert.equal(prvi.h["content-encoding"], undefined);
  assert.deepEqual(prvi.body, vsebina);
  assert.equal(await mw.warm(), 1);
  assert.deepEqual(fs.readdirSync(mapa).filter((f) => f.endsWith(".br")).length, 1, "stara kopija pobrisana, nova shranjena");
  const r = await get(`${url}?v=abc`, { "accept-encoding": "gzip, deflate, br" });
  assert.equal(r.status, 200);
  assert.equal(r.h["content-encoding"], "br");
  assert.equal(r.h["content-type"], "model/gltf-binary");
  assert.equal(r.h["content-length"], String(r.body.length));
  assert.equal(Number(r.h["x-file-size"]), vsebina.length);
  assert.ok(r.body.length < vsebina.length / 10);
  assert.deepEqual(zlib.brotliDecompressSync(r.body), vsebina, "brez izgube");
  assert.match(r.h["cache-control"], /immutable/, "?v= je zgoščena vrednost vsebine");
  assert.match(r.h.vary, /Accept-Encoding/);
  const brezV = await get(url, { "accept-encoding": "br" });
  assert.equal(brezV.h["cache-control"], "no-cache");
  assert.ok(r.h.etag, "ETag");
  const ponovno = await get(url, { "accept-encoding": "br", "if-none-match": r.h.etag });
  assert.equal(ponovno.status, 304);
});

test("GLB: brez br ali z Range gre nestisnjen; nova različica se stisne znova; ../ ne uide iz mape", async (t) => {
  const { root, mapa, mw, srv, url, vsebina } = await pripravi();
  t.after(() => srv.close());
  await mw.warm();
  const gz = await get(url, { "accept-encoding": "gzip" });
  assert.equal(gz.h["content-encoding"], undefined);
  assert.deepEqual(gz.body, vsebina);
  const kos = await get(url, { "accept-encoding": "br", range: "bytes=0-3" });
  assert.equal(kos.status, 206);
  assert.equal(kos.h["content-encoding"], undefined);
  // nova različica datoteke (nov seznam): stara stisnjena se ne pošlje, nova je po stiskanju spet brotli
  const nova = Buffer.concat([vsebina, Buffer.from("nova")]);
  fs.writeFileSync(path.join(root, "organi-3d", "srce.glb"), nova);
  await mw.warm();
  const r = await get(url, { "accept-encoding": "br" });
  assert.equal(r.h["content-encoding"], "br");
  assert.deepEqual(zlib.brotliDecompressSync(r.body), nova);
  // stisnjena datoteka pobrisana: nestisnjena po navadni poti, brez glav stisnjene
  for (const f of fs.readdirSync(mapa)) fs.rmSync(path.join(mapa, f));
  const brez = await get(url, { "accept-encoding": "br" });
  assert.equal(brez.status, 200);
  assert.equal(brez.h["content-encoding"], undefined);
  assert.equal(brez.h["x-file-size"], undefined);
  assert.deepEqual(brez.body, nova);
  const ven = await get(`${url.replace("/organi-3d/srce.glb", "")}/..%2f..%2fetc%2fpasswd.glb`, { "accept-encoding": "br" });
  assert.notEqual(ven.status, 200);
});
