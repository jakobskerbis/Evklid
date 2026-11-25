// 3D atlas in modeli (docs/3d.md): stran /3d, knjižnica three pod /vendor/three in seznam datotek modelov.
// CSP ostane stroga (script-src 'self', brez vrinjenih skript in brez importmap): dodatki three
// (examples/jsm) uvažajo golo ime "three", zato jih strežemo z zamenjanim uvozom na /vendor/three/build/
// three.module.js. Tako dobijo vse strani isti modul three, tudi glavna aplikacija (pogon simulacij 3d-<id>).
// Dekodirnik meshopt za stisnjene modele telesa potrebuje WebAssembly ('wasm-unsafe-eval'), a samo na /3d.
import fs from "node:fs";
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

// 3D modeli (GLB) in studijsko okolje (HDR) stisnjeni z brotli (j 25. 11. 2026: »Stisni vse kar je smiselno«, »ali se
// velikost lahko zmanjša brez izgube kvalitete«): brez izgube, brskalnik datoteko sam razširi v isto vsebino. Srce
// 6,2 → 4,2 MB, telo-hd 30 → ~20 MB (−32 %). Stisnemo enkrat (kakovost 5: skoraj ista velikost kot 11, ~0,3 s in
// ~20 MB pomnilnika za 7 MB namesto 20 s in 150 MB) in shranimo na disk ob bazi (Render: /var/data, ostane ob objavi),
// zato pomnilnik strežnika ne raste. Dokler stisnjene ni, gre datoteka nestisnjena (express.static), stiskanje pa se
// postavi v vrsto (ena naenkrat, v niti zlib). X-File-Size: prava velikost za trak nalaganja (three FileLoader jo bere
// pred Content-Length, ki je pri stisnjeni datoteki manjši). Različica v naslovu (?v=, server/tri-d.js modelList) je
// zgoščena vrednost vsebine, zato sme brskalnik tako datoteko hraniti brez vprašanja strežniku.
const BR_DATOTEKE = /\.(glb|hdr)$/i;
const brMapa = () =>
  process.env.EVKLID_BR_DIR || (process.env.EVKLID_DB ? path.join(path.dirname(process.env.EVKLID_DB), "br-3d") : path.join(os.tmpdir(), "evklid-br-3d"));

export function brModeli(root = modelsDir, { mapa = brMapa(), kakovost = 5 } = {}) {
  const vrsta = new Map(); // ključ → { file, cilj }
  let tece = null; // obljuba delavca, dokler vrsta ni prazna
  const kljuc = (file, st) => crypto.createHash("sha1").update(`${path.relative(root, file)}:${st.size}:${st.mtimeMs}`).digest("hex").slice(0, 24);
  const cilj = (k) => path.join(mapa, `${k}.br`);
  function delaj() {
    if (!tece) tece = obdelaj().finally(() => (tece = null));
    return tece;
  }
  async function obdelaj() {
    {
      while (vrsta.size) {
        const [k, { file, out }] = vrsta.entries().next().value;
        try {
          const raw = await fs.promises.readFile(file);
          const body = await new Promise((res, rej) =>
            zlib.brotliCompress(raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: kakovost, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: raw.length } }, (e, o) => (e ? rej(e) : res(o))),
          );
          await fs.promises.mkdir(mapa, { recursive: true });
          const tmp = `${out}.${process.pid}.tmp`;
          await fs.promises.writeFile(tmp, body);
          await fs.promises.rename(tmp, out);
        } catch (e) {
          console.warn(`[evklid] brotli 3D ${path.relative(root, file)}: ${e?.message || e}`);
        }
        vrsta.delete(k);
      }
    }
  }
  const postavi = (file, st) => {
    const k = kljuc(file, st);
    const out = cilj(k);
    if (vrsta.has(k) || fs.existsSync(out)) return;
    vrsta.set(k, { file, out });
    delaj();
  };
  const middleware = (req, res, next) => {
    if ((req.method !== "GET" && req.method !== "HEAD") || req.headers.range || process.env.EVKLID_COMPRESS === "0") return next();
    let rel;
    try {
      rel = decodeURIComponent(req.path);
    } catch {
      return next();
    }
    if (!BR_DATOTEKE.test(rel)) return next();
    const file = path.join(root, rel);
    if (!file.startsWith(root + path.sep)) return next(); // ../ ven iz mape
    let st;
    try {
      st = fs.statSync(file);
    } catch {
      return next();
    }
    if (!st.isFile()) return next();
    if (pickEncoding(req.headers["accept-encoding"]) !== "br") return next(); // gzip modelov skoraj ne zmanjša
    const k = kljuc(file, st);
    let bst;
    try {
      bst = fs.statSync(cilj(k));
    } catch {
      postavi(file, st);
      return next(); // še ni stisnjena: tokrat nestisnjena
    }
    const etag = `"${k}-br"`;
    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", req.query?.v ? "public, max-age=31536000, immutable" : "no-cache");
    if (req.headers["if-none-match"] === etag) return res.status(304).end();
    res.setHeader("Content-Type", /\.glb$/i.test(rel) ? "model/gltf-binary" : "application/octet-stream");
    res.setHeader("Content-Encoding", "br");
    res.setHeader("Content-Length", bst.size);
    res.setHeader("X-File-Size", st.size);
    if (req.method === "HEAD") return res.end();
    const tok = fs.createReadStream(cilj(k));
    tok.on("error", () => (res.headersSent ? res.destroy() : next()));
    tok.pipe(res);
  };
  // Po zagonu: stisni vse modele (ki še niso) in pobriši stisnjene kopije starih različic. Vrne obljubo (število).
  middleware.warm = async () => {
    const vse = [];
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (BR_DATOTEKE.test(e.name)) vse.push(p);
      }
    };
    walk(root);
    const zive = new Set();
    for (const f of vse) {
      const st = fs.statSync(f);
      zive.add(`${kljuc(f, st)}.br`);
      postavi(f, st);
    }
    await delaj();
    try {
      for (const f of fs.readdirSync(mapa)) if (f.endsWith(".br") && !zive.has(f)) fs.rmSync(path.join(mapa, f), { force: true });
    } catch {}
    return vse.length;
  };
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
