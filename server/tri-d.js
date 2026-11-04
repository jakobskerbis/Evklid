// 3D atlas in modeli (docs/3d.md): stran /3d, knjižnica three pod /vendor/three in seznam datotek modelov.
// CSP ostane stroga (script-src 'self', brez vrinjenih skript in brez importmap): dodatki three
// (examples/jsm) uvažajo golo ime "three", zato jih strežemo z zamenjanim uvozom na /vendor/three/build/
// three.module.js. Tako dobijo vse strani isti modul three, tudi glavna aplikacija (pogon simulacij 3d-<id>).
// Dekodirnik meshopt za stisnjene modele telesa potrebuje WebAssembly ('wasm-unsafe-eval'), a samo na /3d.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
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
}
