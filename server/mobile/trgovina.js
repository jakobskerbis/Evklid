import fs from "node:fs";
import path from "node:path";

// Različica aplikacije iz trgovine (Google Play, App Store) ne sme ponuditi nakupa s kartico (Apple 3.1.1, Google Play
// Payments): tam velja nakup v trgovini (server/mobile/store-billing.js). Splet v aplikaciji teh obrazcev ne pokaže
// (public/pay-ui.js); to je varovalo na strežniku, če bi jih kdo vseeno poslal.
// Kako strežnik prepozna različico iz trgovine:
// - zahteve aplikacije same (mobile/src/lib/api.ts): glavi X-App-Client in X-App-Channel: store;
// - zahteve spletne strani v aplikaciji (WebView, brez teh glav): User-Agent »… EvklidApp/<različica> store«
//   (mobile/src/app/web.tsx applicationNameForUserAgent).
// Starejše aplikacije brez kanala in APK z evklid.app (kanal »direct«) delujejo kot prej.
// portal: v Stripovem portalu se paket zamenja (mesečno ↔ letno) z doplačilom s kartico.
// /api/pay/<žeton>/checkout: plačilo staršu poslane povezave (public/placaj.js, server/accounts/billing.js).
const BUY = /^\/api\/(billing\/(checkout|upgrade|gift|credit|pass|podari|pay-link|portal)|pay\/[^/]+\/checkout)$/;
const STORE_UA = / EvklidApp\/\S+ store\b/;

export const storeAppRequest = (req) =>
  (!!req.get("x-app-client") && String(req.get("x-app-channel") || "").trim().toLowerCase() === "store") ||
  STORE_UA.test(String(req.get("user-agent") || ""));

// Nakup se je začel v aplikaciji (katerikoli kanal): stran za uspeh dobi »&app=1« in brez prijave pove, naj se
// vrne v aplikacijo (public/account.js renderPaidElsewhere).
export const fromApp = (req) => !!req.get("x-app-client") || / EvklidApp\//.test(String(req.get("user-agent") || ""));
export const appMark = (req) => (fromApp(req) ? "&app=1" : "");

// Pot kot jo ujame usmerjevalnik (velike črke, podvojene ali končne poševnice).
const normal = (p) => String(p || "").toLowerCase().replace(/\/{2,}/g, "/").replace(/(.)\/$/, "$1");

export function blockStoreAppPurchases(req, res, next) {
  if (req.method !== "POST" || !BUY.test(normal(req.path)) || !storeAppRequest(req)) return next();
  res.status(403).json({ error: "V tej aplikaciji nakup ni mogoč.", store_app: true });
}

// Javne strani v različici iz trgovine: brez cen, brez povezav na razdelek s cenami in brez prenosa APK mimo trgovine
// (/prenesi). Strani, ki nimajo theme.js ali v-aplikaciji.js ali jim CSS ne zadošča (besedilo s cenami), označijo take
// dele z <!--ce:!trgovina-->…<!--/ce:!trgovina-->; strežnik jih za aplikacijo iz trgovine izreže, sicer ostanejo.
// /o-evklidu in /zakaj-evklid gresta skozi server/vidnost.js (isti zapis v njegovih pogojnih delih).
const STORE_PART = /<!--ce:!trgovina-->\n?([\s\S]*?)<!--\/ce:!trgovina-->\n?/g;
export const storeHtml = (html, store) => String(html).replace(STORE_PART, (_m, body) => (store ? "" : body));

// Statične strani s takimi deli: v aplikaciji iz trgovine jih pošlje ta vmesnik (pred statičnimi datotekami),
// drugim zahtevam pusti express.static. Vary: odgovor je odvisen od User-Agent in X-App-Channel.
// V produkciji strani preberemo ob zagonu (brez dostopa do diska ob vsaki zahtevi; sprememba velja po ponovnem zagonu),
// v razvoju ob vsaki zahtevi (kot server/vidnost.js). Manjkajoča stran ne ustavi zagona: zahtevo dobi express.static.
// Pot primerjamo dekodirano (/starsi%2Ehtml je za express.static ista datoteka kot /starsi.html).
export const STORE_PAGES = ["/starsi.html", "/garancija.html"];
export function storeAppPages(publicDir, { cache = process.env.NODE_ENV === "production" } = {}) {
  const load = (p) => {
    try {
      return storeHtml(fs.readFileSync(path.join(publicDir, p.slice(1)), "utf8"), true);
    } catch {
      return null;
    }
  };
  const pages = cache ? new Map(STORE_PAGES.map((p) => [p, load(p)])) : null;
  return (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    let p;
    try {
      p = decodeURIComponent(req.path);
    } catch {
      return next();
    }
    if (!STORE_PAGES.includes(p)) return next();
    res.vary("User-Agent");
    res.vary("X-App-Channel");
    if (!storeAppRequest(req)) return next();
    const html = cache ? pages.get(p) : load(p);
    if (html == null) return next();
    res.set("Cache-Control", "no-cache");
    res.type("html").send(html);
  };
}
