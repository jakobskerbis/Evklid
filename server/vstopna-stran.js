// Vstopna stran (public/index.html) z vnaprejšnjim nalaganjem modulov (<link rel="modulepreload">).
// Brskalnik sicer odkrije uvoze app.js šele, ko prenese in prebere vsak modul (7 ravni uvozov: na
// počasni mobilni povezavi več sekund samega čakanja). S seznamom v glavi strani začne vse prenose
// takoj (naloga hitrost, j 6. 11. 2026). Seznam sestavi server/startup-files.js iz istih uvozov, zato
// ga ni treba vzdrževati na roke. Stran stisnemo enkrat in jo ponovno sestavimo, ko se index.html spremeni.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import { startupFiles } from "./startup-files.js";
import { pickEncoding } from "./compress.js";

// Navadni (ne-modulski) <script src> v index.html: teh ne nalagamo kot modul.
const CLASSIC = /<script(?![^>]*type="module")[^>]*\ssrc="([^"?#]+)/g;

export function entryHtml(publicDir) {
  const file = path.join(publicDir, "index.html");
  const html = fs.readFileSync(file, "utf8");
  const classic = new Set([...html.matchAll(CLASSIC)].map((m) => "/" + m[1].replace(/^\.?\//, "")));
  const mods = startupFiles(publicDir, "index.html").filter((u) => u.endsWith(".js") && !u.startsWith("/vendor/") && !classic.has(u));
  const links = mods.map((u) => `  <link rel="modulepreload" href="${u}">`).join("\n");
  return { html: html.replace("</head>", `${links}\n</head>`), modules: mods };
}

export function entryPage(publicDir) {
  const file = path.join(publicDir, "index.html");
  let built = null; // { mtime, raw, br, gz, etag }
  const build = () => {
    const mtime = fs.statSync(file).mtimeMs;
    if (built?.mtime === mtime) return built;
    const raw = Buffer.from(entryHtml(publicDir).html);
    const etag = `"${crypto.createHash("sha1").update(raw).digest("base64url").slice(0, 20)}"`;
    built = { mtime, raw, etag, enc: {} };
    return built;
  };
  return (req, res, next) => {
    if ((req.method !== "GET" && req.method !== "HEAD") || (req.path !== "/" && req.path !== "/index.html")) return next();
    let page;
    try {
      page = build();
    } catch {
      return next(); // brez seznama: express.static pošlje navaden index.html
    }
    const enc = process.env.EVKLID_COMPRESS === "0" ? null : pickEncoding(req.headers["accept-encoding"]);
    const etag = enc ? page.etag.replace(/"$/, `-${enc}"`) : page.etag;
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("ETag", etag);
    if (req.headers["if-none-match"] === etag) return res.status(304).end();
    let body = page.raw;
    if (enc) {
      body = page.enc[enc] ||= enc === "br" ? zlib.brotliCompressSync(page.raw, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } }) : zlib.gzipSync(page.raw, { level: 9 });
      res.setHeader("Content-Encoding", enc);
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Length", body.length);
    return req.method === "HEAD" ? res.end() : res.end(body);
  };
}
