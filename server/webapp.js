// Evklid kot aplikacija na telefonu in računalniku (PWA).
// - /manifest.webmanifest: opis aplikacije v jeziku vmesnika (?lang=… ali jezik brskalnika),
//   z bližnjicami (dolg pritisk na ikono) in posnetki zaslona za okno »Namesti«.
// - /.well-known/assetlinks.json: povezava z aplikacijo v Google Play (TWA), ko sta v .env
//   ANDROID_PACKAGE in ANDROID_SHA256 (glej docs/aplikacija.md).
import { BRAND } from "./brand.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import SL from "../public/i18n/sl.js";
import { UI_LANGUAGES, RTL, detectLanguage, uiChain } from "../public/i18n/languages.js";

const UI_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "i18n", "ui");
const KEYS = ["inst.desc", "nav.path", "nav.textbook", "nav.chat", "nav.graph"];
const cache = new Map();

// Slovarji vmesnika za jezik (veriga nadomestnih jezikov kot v brskalniku), tudi za stran /prenesi.
const dictCache = new Map();
export function uiDicts(lang) {
  if (dictCache.has(lang)) return dictCache.get(lang);
  const dicts = uiChain(lang)
    .filter((c) => UI_LANGUAGES.includes(c))
    .map((c) => {
      if (c === "sl") return SL;
      try {
        return JSON.parse(fs.readFileSync(path.join(UI_DIR, `${c}.json`), "utf8"));
      } catch {
        return {};
      }
    });
  dictCache.set(lang, dicts);
  return dicts;
}

// Besedilo ključa v jeziku (s spremenljivkami {ime}); manjkajoč prevod vzame slovenščino.
export const uiText = (lang, key, vars = {}) =>
  String(uiDicts(lang).find((d) => typeof d[key] === "string")?.[key] ?? SL[key] ?? key).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

// Besedila za manifest.
function strings(lang) {
  if (cache.has(lang)) return cache.get(lang);
  const dicts = uiDicts(lang);
  const out = Object.fromEntries(KEYS.map((k) => [k, dicts.find((d) => typeof d[k] === "string")?.[k] || k]));
  cache.set(lang, out);
  return out;
}

// Barva sistemske vrstice nameščene aplikacije (Android jo pobarva s theme_color, tudi spodnjo vrstico
// pod menijem) sledi slogu vmesnika: theme.js v povezavo do manifesta doda ?barva= (meni) in ?ozadje=.
const HEX = /^#[0-9a-f]{6}$/i;
const hexOr = (v, fallback) => (typeof v === "string" && HEX.test(v) ? v.toLowerCase() : fallback);

export function manifest(lang = "sl", { barva, ozadje } = {}) {
  const s = strings(lang);
  const shortcut = (key, view, file) => ({
    name: s[key],
    url: `/?pogled=${view}`,
    icons: [{ src: `/icons/shortcut-${file}.png`, sizes: "192x192", type: "image/png" }],
  });
  return {
    id: "/",
    name: BRAND.name,
    short_name: BRAND.name,
    description: s["inst.desc"],
    lang,
    dir: RTL.has(lang) ? "rtl" : "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: hexOr(ozadje, "#f6f7f9"),
    theme_color: hexOr(barva, "#ffffff"),
    categories: ["education"],
    // Klik na ikono, ko je Evklid že odprt, ga prikaže (brez drugega okna).
    launch_handler: { client_mode: ["navigate-existing", "auto"] },
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [shortcut("nav.path", "path", "pot"), shortcut("nav.chat", "chat", "instruktor"), shortcut("nav.textbook", "textbook", "ucbenik"), shortcut("nav.graph", "graph", "kalkulator")],
    screenshots: [
      { src: "/icons/screen-pot.png", sizes: "780x1688", type: "image/png", form_factor: "narrow", label: s["nav.path"] },
      { src: "/icons/screen-ucbenik.png", sizes: "780x1688", type: "image/png", form_factor: "narrow", label: s["nav.textbook"] },
      { src: "/icons/screen-racunalnik.png", sizes: "1440x900", type: "image/png", form_factor: "wide", label: s["nav.path"] },
    ],
  };
}

// Jezik manifesta: izbira v aplikaciji (?lang=) ima prednost pred jezikom brskalnika.
export function manifestLang(query, acceptLanguages = []) {
  if (typeof query === "string" && (UI_LANGUAGES.includes(query) || query === "sr-Latn")) return query;
  return detectLanguage(acceptLanguages).code;
}

export function mountWebApp(app) {
  app.get("/manifest.webmanifest", (req, res) => {
    const lang = manifestLang(req.query.lang, req.acceptsLanguages());
    res.set("Cache-Control", "no-cache").type("application/manifest+json").send(JSON.stringify(manifest(lang, req.query)));
  });
  app.get("/.well-known/assetlinks.json", (_req, res) => {
    const pkg = process.env.ANDROID_PACKAGE;
    const prints = String(process.env.ANDROID_SHA256 || "").split(/[\s,]+/).filter(Boolean);
    if (!pkg || !prints.length) return res.status(404).json([]);
    res.json([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: { namespace: "android_app", package_name: pkg, sha256_cert_fingerprints: prints },
      },
    ]);
  });
}
