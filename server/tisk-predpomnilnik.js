// Predpomnilnik strani za tisk (/ucbenik/..., /gradiva/povzetek/...): javne poti brez prijave, izris celotnega
// učbenika predmeta traja do ~0,8 s procesorja (MAT-OS: 17 MB HTML), poti razreda 0,15–0,25 s. Brez predpomnilnika
// je bil vsak zahtevek nov izris in nestisnjen odgovor (2 jedri strežnika).
//
// Vnos velja, dokler se ne spremeni njegov podpis (sig): datum izdaje + različica vsake lekcije (nov predmet lekcije
// ob spremembi datoteke, server/textbook.js readLesson) oziroma vsebina lista formul. Spremenjena datoteka lekcije
// torej takoj da nov izris, nikoli star rezultat. Stisnjeni različici (br, gzip) nastaneta enkrat na vnos, zunaj
// glavne niti (zlib v ozadju). ETag je iz vsebine (sha1 HTML, enkrat na vnos), ne iz podpisa: zaporedne številke
// lekcij se ob ponovnem zagonu ponovijo, zato bi po posodobitvi isti ETag dal 304 in staro lekcijo (pregled #516).
import zlib from "node:zlib";
import crypto from "node:crypto";
import { pickEncoding } from "./compress.js";

const MIN_SIZE = 1024;

// Privzeta meja: EVKLID_TISK_MB (strežnik ima 512 MB), sicer 40 MB.
const defaultMax = () => (Number(process.env.EVKLID_TISK_MB) > 0 ? Number(process.env.EVKLID_TISK_MB) : 40) * 1024 * 1024;

export function createPageCache({ maxBytes = defaultMax(), compress = process.env.EVKLID_COMPRESS !== "0" } = {}) {
  const map = new Map(); // ključ -> vnos (vrstni red = nazadnje uporabljen na koncu)
  const inflight = new Map(); // ključ -> velik vnos, ki se stiska pred vstavitvijo
  let bytes = 0;
  const sizeOf = (e) => (e.html?.length || 0) + (e.br?.length || 0) + (e.gzip?.length || 0);

  function drop(key) {
    const e = map.get(key);
    if (!e) return;
    map.delete(key);
    e.cached = false;
    bytes -= sizeOf(e);
  }
  function trim() {
    for (const key of map.keys()) {
      if (bytes <= maxBytes) break;
      drop(key);
    }
  }

  // Vnos za ključ: iz predpomnilnika, če je podpis enak, sicer nov izris (render vrne HTML ali null).
  function get(key, sig, render) {
    if (sig == null) return null;
    const hit = map.get(key);
    if (hit && hit.sig === sig) {
      map.delete(key);
      map.set(key, hit);
      return hit;
    }
    // Velika stran, ki se ravno stiska pred vstavitvijo: isti vnos (brez drugega izrisa).
    const fly = inflight.get(key);
    if (fly && fly.sig === sig) return fly;
    drop(key);
    inflight.delete(key);
    const html = render();
    if (html == null) return null;
    const buf = Buffer.from(html);
    const e = {
      sig,
      html: buf, // pri veliki strani po stiskanju null (ostaneta br in gzip)
      size: buf.length,
      etag: `W/"${crypto.createHash("sha1").update(buf).digest("base64url").slice(0, 27)}"`,
      pending: {},
      cached: false,
    };
    // Shrani se vsaka stran do meje (MAT-SS ima 23 MB; pregled #516: polovica meje je bila premalo).
    // Stran nad mejo se ne shrani in se ne stisne vnaprej: stisne se le kodiranje, ki ga zahtevek želi
    // (pregled #516 B, P1: br + gzip 67 MB strani, ki se nato zavržeta, je pri 2 zahtevkih dal 549 MB RSS).
    if (e.size > maxBytes) return e;
    // Velika stran (> 1/4 meje) se najprej stisne v br in gzip in šele nato vstavi s stisnjeno velikostjo
    // (pregled #516 B, P2: vstavljen surov HTML tik pod mejo je izrinil cel predpomnilnik in nato še sebe).
    if (compress && e.size * 4 > maxBytes) {
      inflight.set(key, e);
      e.slim = Promise.all([compressed(e, "br"), compressed(e, "gzip")]).then(
        () => {
          if (inflight.get(key) !== e) return;
          inflight.delete(key);
          e.html = null;
          drop(key);
          map.set(key, e);
          e.cached = true;
          bytes += sizeOf(e);
          trim();
        },
        () => {
          if (inflight.get(key) === e) inflight.delete(key);
        },
      );
      return e;
    }
    map.set(key, e);
    e.cached = true;
    bytes += e.size;
    trim();
    return e;
  }

  function compressed(e, enc) {
    if (e[enc]) return Promise.resolve(e[enc]);
    if (!e.pending[enc]) {
      const src = e.html;
      if (!src) return Promise.reject(new Error("brez izvirnika"));
      e.pending[enc] = new Promise((resolve, reject) => {
        const done = (err, out) => (err ? reject(err) : resolve(out));
        if (enc === "br") zlib.brotliCompress(src, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: src.length } }, done);
        else zlib.gzip(src, { level: 6 }, done);
      }).then(
        (out) => {
          e[enc] = out;
          delete e.pending[enc];
          if (e.cached) {
            bytes += out.length;
            trim();
          }
          return out;
        },
        (err) => {
          delete e.pending[enc];
          throw err;
        },
      );
    }
    return e.pending[enc];
  }

  // Pošlje vnos: 304 ob enakem ETag, stisnjeno, če odjemalec to sprejme.
  async function send(req, res, e) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("ETag", e.etag);
    // Šibka primerjava (RFC 9110 §13.1.2): W/"x" in "x" sta enaka; * ustreza vsaki obstoječi strani.
    const bare = (t) => t.trim().replace(/^W\//, "");
    const inm = String(req.headers["if-none-match"] || "").split(",").map(bare).filter(Boolean);
    if (inm.includes("*") || inm.includes(bare(e.etag))) return res.status(304).end();
    const enc = compress && e.size >= MIN_SIZE ? pickEncoding(req.headers["accept-encoding"]) : null;
    let body = null;
    if (enc) {
      try {
        body = await compressed(e, enc);
        res.setHeader("Content-Encoding", enc);
      } catch {}
    }
    // Odjemalec brez stiskanja (redko): pri veliki strani iz gzip (zlib v ozadju).
    if (!body) body = e.html ?? (await new Promise((ok, no) => zlib.gunzip(e.gzip, (err, out) => (err ? no(err) : ok(out)))));
    res.setHeader("Content-Length", body.length);
    res.end(body);
  }

  return { get, send, stats: () => ({ entries: map.size, bytes, inflight: inflight.size }) };
}

// Različica lekcije: zaporedna številka predmeta, ki ga vrne loadLesson (isti predmet, dokler se datoteka ne spremeni).
const serials = new WeakMap();
let nextSerial = 0;
export function lessonVersion(lesson) {
  if (!lesson) return 0;
  let n = serials.get(lesson);
  if (!n) serials.set(lesson, (n = ++nextSerial));
  return n;
}
