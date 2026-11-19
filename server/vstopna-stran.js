// Vstopna stran (public/index.html) z vnaprejšnjim nalaganjem modulov (<link rel="modulepreload">).
// Brskalnik sicer odkrije uvoze app.js šele, ko prenese in prebere vsak modul (7 ravni uvozov: na
// počasni mobilni povezavi več sekund samega čakanja). S seznamom v glavi strani začne vse prenose
// takoj (naloga hitrost, j 6. 11. 2026). Seznam sestavi server/startup-files.js iz istih uvozov, zato
// ga ni treba vzdrževati na roke. Stran stisnemo enkrat in jo ponovno sestavimo, ko se index.html spremeni.
// Stran nosi različico datotek aplikacije (<meta name="evklid-app"> in glava X-Evklid-App, ista vrednost kot
// APP v public/sw.js): service worker po njej ve, da je objavljena nova različica, in ne postreže starih
// kopij modulov ob novi strani; app.js po njej ve, katero različico res izvaja (PR #481, pregled točka 1).
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import { startupFiles } from "./startup-files.js";
import { pickEncoding } from "./compress.js";
import { icon } from "../public/icons.js";
import { translateStatic } from "./pristajalna-takoj.js";

// Navadni (ne-modulski) <script src> v index.html: teh ne nalagamo kot modul.
const CLASSIC = /<script(?![^>]*type="module")[^>]*\ssrc="([^"?#]+)/g;

const META = "evklid-app";

// Ikone lupine (<i data-icon="ime"></i>) pošljemo že izrisane (j 16. 11. 2026: »vedno ko odprem evklida se zaslon
// osveži in utripne«): prej jih je dopolnil šele app.js (hydrateIcons), zato so se glava, spodnja vrstica in pasici
// ob vsakem odprtju za pol sekunde ali več pokazale brez ikon, nato pa poskočile. Isti izris kot icons.js icon();
// data-zg: ob zgodovinskem slogu ostane skrita do ikon obdobja (style.css), kot prej. Neznano ime ostane <i>.
// icons.js se naloži ob zagonu strežnika: nove oblike ikon (scripts/build-icons.js) veljajo po ponovnem zagonu.
const ICON = /<i data-icon="([a-z0-9-]+)"><\/i>/g;
export const withIcons = (html) =>
  html.replace(ICON, (m, name) => {
    const svg = icon(name);
    return svg.endsWith('aria-hidden="true"></svg>') ? m : svg.replace("<svg ", "<svg data-zg ");
  });

export function entryHtml(publicDir, { version = "", preload = true } = {}) {
  const file = path.join(publicDir, "index.html");
  const html = withIcons(fs.readFileSync(file, "utf8"));
  const classic = new Set([...html.matchAll(CLASSIC)].map((m) => "/" + m[1].replace(/^\.?\//, "")));
  const mods = startupFiles(publicDir, "index.html").filter((u) => u.endsWith(".js") && !u.startsWith("/vendor/") && !classic.has(u));
  const head = [];
  if (version) head.push(`  <meta name="${META}" content="${version}">`);
  // fetchpriority="low": moduli ne tekmujejo s slogi in pisavami za prvi izris (počasen 4G, j 19. 11. 2026). Prej so vsi
  // hkrati jemali pasovno širino slogom, zato je bil prvi izris v Lighthouse (telefon, počasen 4G) šele po ~9 s.
  if (preload) for (const u of mods) head.push(`  <link rel="modulepreload" href="${u}" fetchpriority="low">`);
  return { html: head.length ? html.replace("</head>", `${head.join("\n")}\n</head>`) : html, modules: preload ? mods : [] };
}

// Zadnji slog, ki ga pristajalna stran potrebuje za prvi izris (pred njim pisave, KaTeX, style.css, ui.css).
const ZADNJI_SLOG = "account.css";

// Pristajalna stran, izrisana na strežniku (server/pristajalna-takoj.js landingPage): v <main id="view-auth"> ostane
// skrita (hidden), dokler public/zacetek.js pred prvim izrisom ne potrdi, da bi jo pokazal tudi app.js. <meta> pove jezik,
// prvo oznako jezika, smer pisave in pasici, ki ju app.js pokaže po /api/config (da se stran ob tem ne premakne).
const AUTH_MAIN = '<main id="view-auth" class="view narrow" hidden></main>';
export function withLanding(html, page) {
  if (!page || !html.includes(AUTH_MAIN) || !html.includes('<meta charset="utf-8">')) return html;
  const attr = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const meta = `  <meta name="evklid-pristajalna" content="${attr(page.lang)}" data-oznaka="${attr(page.tag)}" data-smer="${page.rtl ? "rtl" : "ltr"}" data-tn="${attr(page.testNotice || "")}"${page.mock ? ' data-mock="1"' : ""}>`;
  // Moduli (modulepreload) gredo v <template>: zacetek.js jih začne prenašati šele po prvem izrisu pristajalne strani
  // (prej so si s slogi delili počasno povezavo), ali takoj, ko strani ne pokaže (nato je vse kot prej).
  const links = [];
  html = html.replace(/^ *<link rel="modulepreload"[^>]*>\n/gm, (l) => (links.push(l.trim()), ""));
  const tpl = links.length ? `\n  <template id="evklid-moduli">${links.join("")}</template>` : "";
  // Slogi za druge zaslone (vsi za account.css, vrstni red ostane): brez href, zacetek.js jih vklopi na istem mestu po
  // prvem izrisu pristajalne strani (je ne spremenijo, test/pristajalna-takoj.test.js) ali takoj, ko je ne pokaže.
  const head = html.slice(0, html.indexOf("</head>"));
  const zadnji = `<link rel="stylesheet" href="${ZADNJI_SLOG}">`;
  const last = head.indexOf(zadnji);
  if (last > 0) {
    const from = last + zadnji.length;
    html = html.slice(0, from) + head.slice(from).replace(/<link rel="stylesheet" href="([^"]+)">/g, '<link rel="stylesheet" data-href="$1" data-pozneje>') + html.slice(head.length);
  }
  // Pred public/zacetek.js (navaden skript v <head>), ki ju prebere pred prvim izrisom.
  let out = html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n${meta}${tpl}`).replace(AUTH_MAIN, `<main id="view-auth" class="view narrow" hidden data-vnaprej>${page.html}</main>`);
  // Pasici »Preizkusni način« in »Testna različica« v jeziku strani (sicer so v index.html slovenske do applyI18n).
  if (page.lang !== "sl" && page.t)
    for (const id of ["mock-banner", "test-notice"]) {
      const a = out.indexOf(`<div id="${id}"`);
      const b = a < 0 ? -1 : out.indexOf("\n  </div>", a);
      if (b > a) out = out.slice(0, a) + translateStatic(out.slice(a, b), page.t) + out.slice(b);
    }
  return out;
}

// version: različica datotek aplikacije (server/razlicica.js staticVersion); preload=false: brez seznama
// modulov (EVKLID_MODULEPRELOAD=0, za primerjavo hitrosti), različica pa ostane.
// version: različica datotek (niz ali funkcija, ki jo vrne trenutno; server/razlicica.js liveStaticVersion).
// landing(req): podatki za pristajalno stran (server/pristajalna-takoj.js landingPage) ali null.
export function entryPage(publicDir, { version = "", preload = true, landing = null } = {}) {
  const ver = typeof version === "function" ? version : () => version;
  const file = path.join(publicDir, "index.html");
  let built = null; // { mtime, v, html, variants: Map(ključ → { raw, etag, enc }) }
  const variant = (raw) => ({ raw, etag: `"${crypto.createHash("sha1").update(raw).digest("base64url").slice(0, 20)}"`, enc: {} });
  const build = (req) => {
    const mtime = fs.statSync(file).mtimeMs;
    const v = ver();
    if (built?.mtime !== mtime || built.v !== v) {
      const html = entryHtml(publicDir, { version: v, preload }).html;
      built = { mtime, v, html, base: variant(Buffer.from(html)), variants: new Map() };
    }
    let page = null;
    try {
      page = landing?.(req) || null;
    } catch {
      page = null; // napaka pri izrisu: navadna stran (pristajalno stran izriše app.js)
    }
    if (!page) return { v, ...built.base };
    let x = built.variants.get(page.key);
    if (!x) {
      if (built.variants.size >= 64) built.variants.delete(built.variants.keys().next().value);
      x = variant(Buffer.from(withLanding(built.html, page)));
      built.variants.set(page.key, x);
    }
    return { v, ...x };
  };
  return (req, res, next) => {
    if ((req.method !== "GET" && req.method !== "HEAD") || (req.path !== "/" && req.path !== "/index.html")) return next();
    let page;
    try {
      page = build(req);
    } catch {
      return next(); // brez seznama: express.static pošlje navaden index.html
    }
    const enc = process.env.EVKLID_COMPRESS === "0" ? null : pickEncoding(req.headers["accept-encoding"]);
    const etag = enc ? page.etag.replace(/"$/, `-${enc}"`) : page.etag;
    res.setHeader("Cache-Control", "no-cache");
    // Stran je odvisna od jezika brskalnika in od seje (pristajalna stran samo za obiskovalce brez seje).
    res.setHeader("Vary", landing ? "Accept-Encoding, Accept-Language, Cookie" : "Accept-Encoding");
    if (page.v) res.setHeader("X-Evklid-App", page.v); // tudi ob 304: service worker primerja z APP
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
