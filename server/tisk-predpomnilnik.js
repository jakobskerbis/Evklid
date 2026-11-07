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
  let bytes = 0;
  const sizeOf = (e) => e.html.length + (e.br?.length || 0) + (e.gzip?.length || 0);

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
    drop(key);
    const html = render();
    if (html == null) return null;
    const buf = Buffer.from(html);
    const e = {
      sig,
      html: buf,
      etag: `W/"${crypto.createHash("sha1").update(buf).digest("base64url").slice(0, 27)}"`,
      pending: {},
      cached: false,
    };
    if (e.html.length * 2 <= maxBytes) {
      map.set(key, e);
      e.cached = true;
      bytes += e.html.length;
      trim();
    }
    return e;
  }

  function compressed(e, enc) {
    if (e[enc]) return Promise.resolve(e[enc]);
    if (!e.pending[enc]) {
      e.pending[enc] = new Promise((resolve, reject) => {
        const done = (err, out) => (err ? reject(err) : resolve(out));
        if (enc === "br") zlib.brotliCompress(e.html, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: e.html.length } }, done);
        else zlib.gzip(e.html, { level: 6 }, done);
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
    const enc = compress && e.html.length >= MIN_SIZE ? pickEncoding(req.headers["accept-encoding"]) : null;
    let body = e.html;
    if (enc) {
      try {
        body = await compressed(e, enc);
        res.setHeader("Content-Encoding", enc);
      } catch {
        body = e.html;
      }
    }
    res.setHeader("Content-Length", body.length);
    res.end(body);
  }

  return { get, send, stats: () => ({ entries: map.size, bytes }) };
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
