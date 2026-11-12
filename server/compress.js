// Stiskanje odgovorov (brotli ali gzip) brez dodatnih knjižnic: za počasne in drage
// mobilne povezave. Statične datoteke stisnemo enkrat in jih hranimo v pomnilniku,
// JSON odgovore API stisnemo sproti. Pretočni odgovori (SSE klepet) ostanejo nestisnjeni.
// Statične datoteke stiskamo v ozadju (zlib v niti, ne v glavni zanki), da prvi obiski po
// posodobitvi ne ustavijo strežnika; warm() jih po zagonu pripravi vnaprej (j, 2026-11-04:
// »zakaj spletna stran deluje zelo počasi«).
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";

const TYPES = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};
const MIN_SIZE = 1024;

// Izbere kodiranje iz glave Accept-Encoding (brotli ima prednost). »q=0« pomeni »ne« (RFC 9110 §12.5.3).
export function pickEncoding(header = "") {
  const ok = new Set();
  for (const part of String(header).toLowerCase().split(",")) {
    const [name, ...params] = part.split(";").map((x) => x.trim());
    const q = params.find((x) => x.startsWith("q="));
    if (name && !(q && Number(q.slice(2)) === 0)) ok.add(name);
  }
  if (ok.has("br")) return "br";
  if (ok.has("gzip")) return "gzip";
  return null;
}

const encode = (buf, enc) =>
  new Promise((resolve, reject) => {
    const done = (err, out) => (err ? reject(err) : resolve(out));
    if (enc === "br") zlib.brotliCompress(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: buf.length } }, done);
    else zlib.gzip(buf, { level: 9 }, done);
  });

// Stisnjene statične datoteke iz mape `root` (in podmap, npr. vendor), predpomnjene po času spremembe.
// mounts: [[url predpona, mapa], ...]. Vrne vmesnik (middleware) z metodo warm(urls) za pripravo vnaprej.
export function compressedStatic(mounts) {
  const cache = new Map(); // "enc:datoteka" -> { mtime, body, etag }
  const pending = new Map(); // "enc:datoteka" -> Promise (ista datoteka se stiska samo enkrat naenkrat)

  // URL → { file, st, prefix } ali null (ni naša datoteka); "skip" = prepusti express.static.
  const locate = (url) => {
    if (url.endsWith("/")) url += "index.html";
    if (!TYPES[path.extname(url).toLowerCase()]) return null;
    for (const [prefix, dir] of mounts) {
      if (!url.startsWith(prefix)) continue;
      const file = path.join(dir, url.slice(prefix.length));
      if (!file.startsWith(dir + path.sep) && file !== dir) return "skip"; // ../ ven iz mape
      let st;
      try {
        st = fs.statSync(file);
      } catch {
        continue;
      }
      if (!st.isFile() || st.size < MIN_SIZE) return "skip";
      return { file, st, prefix };
    }
    return null;
  };

  const compressed = (file, st, enc) => {
    const key = `${enc}:${file}`;
    const hit = cache.get(key);
    if (hit && hit.mtime === st.mtimeMs) return hit;
    const running = pending.get(key);
    if (running && running.mtime === st.mtimeMs) return running.promise;
    const raw = fs.readFileSync(file);
    const etag = `"${crypto.createHash("sha1").update(raw).digest("base64url").slice(0, 20)}-${enc}"`;
    const promise = encode(raw, enc)
      .then((body) => {
        const entry = { mtime: st.mtimeMs, body, etag };
        cache.set(key, entry);
        return entry;
      })
      .finally(() => {
        if (pending.get(key)?.promise === promise) pending.delete(key);
      });
    pending.set(key, { mtime: st.mtimeMs, promise });
    return promise;
  };

  const middleware = async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const enc = pickEncoding(req.headers["accept-encoding"]);
    if (!enc) return next();
    let url;
    try {
      url = decodeURIComponent(req.path);
    } catch {
      return next();
    }
    const found = locate(url);
    if (!found || found === "skip") return next();
    let hit;
    try {
      hit = await compressed(found.file, found.st, enc);
    } catch {
      return next(); // stiskanje ni uspelo: datoteko pošlje express.static nestisnjeno
    }
    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("ETag", hit.etag);
    res.setHeader("Cache-Control", found.prefix.startsWith("/vendor") ? "public, max-age=604800" : "no-cache");
    if (req.headers["if-none-match"] === hit.etag) return res.status(304).end();
    res.setHeader("Content-Type", TYPES[path.extname(found.file).toLowerCase()]);
    res.setHeader("Content-Encoding", enc);
    res.setHeader("Content-Length", hit.body.length);
    return req.method === "HEAD" ? res.end() : res.end(hit.body);
  };

  // Po zagonu: datoteke, ki jih potrebuje prvo odprtje strani, stisnemo eno za drugo v ozadju
  // (brotli, ki ga uporabljajo vsi današnji brskalniki). Napake ne ustavijo ničesar.
  middleware.warm = async (urls, enc = "br") => {
    let n = 0;
    for (const url of urls) {
      const found = locate(url);
      if (!found || found === "skip") continue;
      try {
        await compressed(found.file, found.st, enc);
        n++;
      } catch {}
    }
    return n;
  };
  return middleware;
}

// JSON odgovori API: res.json stisne telo, če je dovolj veliko in ga odjemalec sprejme.
export function compressedJson() {
  return (req, res, next) => {
    const enc = pickEncoding(req.headers["accept-encoding"]);
    if (!enc) return next();
    const plain = res.json.bind(res);
    res.json = (obj) => {
      const body = Buffer.from(JSON.stringify(obj));
      if (body.length < MIN_SIZE || res.headersSent) return plain(obj);
      // Hitrejša raven za sprotno stiskanje.
      const out = enc === "br" ? zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }) : zlib.gzipSync(body, { level: 6 });
      // Dopolni (ne zamenja) Vary, ki ga je nastavila pot (lekcija: x-app-kviz, server/app.js).
      if (typeof res.vary === "function") res.vary("Accept-Encoding");
      else res.setHeader("Vary", "Accept-Encoding");
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Content-Encoding", enc);
      res.setHeader("Content-Length", out.length);
      return res.end(out);
    };
    next();
  };
}
