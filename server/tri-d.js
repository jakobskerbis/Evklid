// 3D atlas in modeli (docs/3d.md): stran /3d, knjižnica three pod /vendor/three in seznam datotek modelov.
// CSP ostane stroga (script-src 'self', brez vrinjenih skript in brez importmap): dodatki three
// (examples/jsm) uvažajo golo ime "three", zato jih strežemo z zamenjanim uvozom na /vendor/three/build/
// three.module.js. Tako dobijo vse strani isti modul three, tudi glavna aplikacija (pogon simulacij 3d-<id>).
// Dekodirnik meshopt za stisnjene modele telesa potrebuje WebAssembly ('wasm-unsafe-eval'), a samo na /3d.
import fs from "node:fs";
import express from "express";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { pickEncoding } from "./compress.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(here, "..", "public");
const modelsDir = path.join(publicDir, "3d", "modeli");
const page = path.join(publicDir, "3d.html");
const slicDir = path.join(publicDir, "3d", "slicice");
export const PODROCJA = ["celice", "organi", "sistemi", "kemija", "fizika", "matematika", "vesolje", "procesi"];
export const THREE_URL = "/vendor/three/build/three.module.js";

// Seznam modelov z velikostjo in kratko zgoščeno vrednostjo vsebine: stran iz velikosti kaže napredek
// prenosa v MB, vrednost gre v naslov (?v=…), da service worker ob novem izvozu ne vrne stare kopije.
let listCache = { key: "", body: null };
const obNovemSeznamu = new Set();
export function modelList() {
  const files = [];
  const walk = (dir) => {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".glb")) files.push(p);
    }
  };
  walk(modelsDir);
  files.sort();
  // Področja modelov iz kode (public/3d/modeli/<podrocje>/index.js): stran uvozi samo obstoječa, brez napak 404.
  const podrocja = PODROCJA.filter((p) => fs.existsSync(path.join(modelsDir, p, "index.js")));
  // Viri področij (public/3d/modeli/<podrocje>/viri.json): »Viri in licence« jih združi z public/3d/viri.json.
  const viri = PODROCJA.filter((p) => fs.existsSync(path.join(modelsDir, p, "viri.json")));
  // Sličice za kartice zbirke (public/3d/slicice/<id>.webp, scripts/3d-slicice.cjs): stran pokaže samo obstoječe.
  let slicice = [];
  try {
    slicice = fs.readdirSync(slicDir).filter((f) => f.endsWith(".webp")).map((f) => f.slice(0, -5)).sort();
  } catch {}
  const stats = files.map((f) => [f, fs.statSync(f)]);
  const key = podrocja.join(",") + "|" + viri.join(",") + "|" + slicice.join(",") + "|" + stats.map(([f, st]) => `${f}:${st.size}:${st.mtimeMs}`).join("|");
  if (listCache.key === key) return listCache.body;
  const datoteke = {};
  for (const [f, st] of stats) {
    const rel = path.relative(modelsDir, f).split(path.sep).join("/");
    const v = crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex").slice(0, 10);
    datoteke[rel] = { b: st.size, v };
  }
  listCache = { key, body: { datoteke, podrocja, viri, slicice } };
  for (const f of obNovemSeznamu) f(); // nove različice modelov: stisni jih (brModeli)
  return listCache.body;
}

// CSP strani /3d: osnovna politika + WebAssembly za dekodirnik meshopt. Okvir je dovoljen samo strani istega izvora
// (»Uči se« → 3D svet odpre atlas ali model čez cel zaslon v okvirju, public/uci-se.js); drugi izvori ne.
export function cspFor3d(base) {
  const d = { ...base, "script-src": [...base["script-src"], "'wasm-unsafe-eval'"] };
  if (d["frame-ancestors"]) d["frame-ancestors"] = ["'self'"];
  return Object.entries(d)
    .map(([k, v]) => `${k} ${v.join(" ")}`)
    .join("; ");
}

// Golo ime "three" v dodatkih → pot do izdelane knjižnice (samo stavki import/export … from).
export function rewriteThreeImports(src) {
  return src.replace(/(\bfrom\s*|\bimport\s*)(['"])three\2/g, `$1"${THREE_URL}"`);
}

function addonsHandler(root) {
  const cache = new Map(); // datoteka → { mtime, raw, etag, br, gzip }
  return (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    let rel;
    try {
      rel = decodeURIComponent(req.path);
    } catch {
      return next();
    }
    if (!rel.endsWith(".js")) return next();
    const file = path.join(root, rel);
    if (!file.startsWith(root + path.sep)) return next(); // ../ ven iz mape
    let st;
    try {
      st = fs.statSync(file);
    } catch {
      return next();
    }
    if (!st.isFile()) return next();
    let hit = cache.get(file);
    if (!hit || hit.mtime !== st.mtimeMs) {
      const raw = Buffer.from(rewriteThreeImports(fs.readFileSync(file, "utf8")));
      hit = { mtime: st.mtimeMs, raw, etag: `"${crypto.createHash("sha1").update(raw).digest("base64url").slice(0, 20)}"` };
      cache.set(file, hit);
    }
    const enc = process.env.EVKLID_COMPRESS === "0" ? null : pickEncoding(req.headers["accept-encoding"]);
    if (enc && !hit[enc]) hit[enc] = enc === "br" ? zlib.brotliCompressSync(hit.raw) : zlib.gzipSync(hit.raw, { level: 9 });
    const etag = enc ? hit.etag.replace(/"$/, `-${enc}"`) : hit.etag;
    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", "public, max-age=604800");
    if (req.headers["if-none-match"] === etag) return res.status(304).end();
    res.setHeader("Content-Type", "text/javascript; charset=utf-8");
    const body = enc ? hit[enc] : hit.raw;
    if (enc) res.setHeader("Content-Encoding", enc);
    res.setHeader("Content-Length", body.length);
    return req.method === "HEAD" ? res.end() : res.end(body);
  };
}

// 3D modeli (GLB) stisnjeni z brotli (j 25. 11. 2026: »Stisni vse kar je smiselno«, »ali se velikost lahko zmanjša
// brez izgube kvalitete«): brez izgube, brskalnik datoteko sam razširi v isto vsebino. Vsi modeli 87,7 → 59,1 MB
// (srce 6,2 → 4,2 MB). Stisnemo enkrat (kakovost 5: skoraj ista velikost kot 11, ~0,3 s in ~20 MB pomnilnika za 7 MB
// namesto 20 s in 150 MB) in shranimo na disk ob bazi (Render: /var/data, ostane ob objavi), zato pomnilnik strežnika
// ne raste. Ime stisnjene datoteke je različica vsebine (v iz modelList, ista kot ?v= v naslovu). Obdelava zahteve ne
// bere diska sama: izbere stisnjeno datoteko iz seznama v pomnilniku in jo pošlje express.static (kot ostale datoteke);
// dokler stisnjene ni, gre nestisnjena. X-File-Size: prava velikost za trak nalaganja (three FileLoader jo bere pred
// Content-Length, ki je pri stisnjeni datoteki manjši).
const brMapa = () =>
  process.env.EVKLID_BR_DIR || (process.env.EVKLID_DB ? path.join(path.dirname(process.env.EVKLID_DB), "br-3d") : path.join(os.tmpdir(), "evklid-br-3d"));

export function brModeli({ root = modelsDir, mapa = brMapa(), seznam = () => listCache.body, osvezi = modelList, kakovost = 5 } = {}) {
  const nared = new Set(); // različice (v), ki imajo stisnjeno datoteko na disku
  const posiljatelj = express.static(mapa, { cacheControl: false, index: false, redirect: false, dotfiles: "ignore" });
  let tece = null;
  async function stisni() {
    const datoteke = (osvezi(), seznam())?.datoteke || {};
    await fs.promises.mkdir(mapa, { recursive: true });
    const obstojece = new Set(await fs.promises.readdir(mapa));
    const zive = new Set();
    let n = 0;
    for (const [rel, d] of Object.entries(datoteke)) {
      const ime = `${d.v}.br`;
      zive.add(ime);
      if (!obstojece.has(ime)) {
        try {
          const raw = await fs.promises.readFile(path.join(root, rel));
          const body = await new Promise((res, rej) =>
            zlib.brotliCompress(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: kakovost, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: raw.length } }, (e, o) => (e ? rej(e) : res(o))),
          );
          const tmp = path.join(mapa, `${ime}.${process.pid}.tmp`);
          await fs.promises.writeFile(tmp, body);
          await fs.promises.rename(tmp, path.join(mapa, ime));
        } catch (e) {
          console.warn(`[evklid] brotli 3D ${rel}: ${e?.message || e}`);
          continue;
        }
      }
      nared.add(d.v);
      n++;
    }
    // kopije starih različic (in nedokončane .tmp) pobrišemo
    for (const f of obstojece) if (!zive.has(f)) await fs.promises.rm(path.join(mapa, f), { force: true }).catch(() => {});
    return n;
  }
  // Ena obdelava naenkrat; zahteva med obdelavo počaka nanjo in nato še enkrat preveri seznam.
  const warm = () => {
    if (!tece) tece = stisni().finally(() => (tece = null));
    return tece;
  };
  obNovemSeznamu.add(() => tece || setImmediate(() => warm().catch(() => {})));
  const middleware = (req, res, next) => {
    if ((req.method !== "GET" && req.method !== "HEAD") || req.headers.range || process.env.EVKLID_COMPRESS === "0") return next();
    if (pickEncoding(req.headers["accept-encoding"]) !== "br") return next(); // gzip modelov skoraj ne zmanjša
    let rel;
    try {
      rel = decodeURIComponent(req.path).replace(/^\/+/, "");
    } catch {
      return next();
    }
    const d = Object.hasOwn(seznam()?.datoteke || {}, rel) ? seznam().datoteke[rel] : null;
    if (!d || !nared.has(d.v)) return next(); // še ni stisnjena: tokrat nestisnjena
    const url = req.url;
    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("Cache-Control", req.query?.v ? "public, max-age=31536000, immutable" : "no-cache");
    res.setHeader("Content-Type", "model/gltf-binary");
    res.setHeader("Content-Encoding", "br");
    res.setHeader("X-File-Size", d.b);
    req.url = `/${d.v}.br`;
    posiljatelj(req, res, (err) => {
      // stisnjene datoteke ni več (pobrisana): nestisnjena po navadni poti
      req.url = url;
      for (const h of ["Content-Encoding", "X-File-Size", "Content-Type", "Cache-Control"]) res.removeHeader(h);
      nared.delete(d.v);
      next(err);
    });
  };
  middleware.warm = warm;
  return middleware;
}

export function mount3d(app, { csp, modules }) {
  const header = cspFor3d(csp);
  const send = (_req, res) => {
    res.set("Content-Security-Policy", header);
    res.set("X-Frame-Options", "SAMEORIGIN"); // starejši brskalniki brez frame-ancestors: isto pravilo
    res.set("Cache-Control", "no-cache").type("html").sendFile(page);
  };
  app.get("/3d", send);
  app.get("/3d.html", send);
  app.get("/3d/modeli/seznam.json", (_req, res) => {
    res.set("Cache-Control", "no-cache").json(modelList());
  });
  // three: samo izdelana knjižnica in dodatki (examples/jsm), ne cel paket. Izdelano knjižnico (/vendor/three/build)
  // streže server/app.js za stisnjenimi datotekami (brotli, en teden v predpomnilniku), kot ostale knjižnice.
  app.use("/vendor/three/examples/jsm", addonsHandler(path.join(modules, "three", "examples", "jsm")));
  const modeli = brModeli();
  app.use("/3d/modeli", modeli);
  app.locals.warmModeli = () => modeli.warm();
}
