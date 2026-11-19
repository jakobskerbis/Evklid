// Pristajalna stran že v prvem odgovoru strežnika (naloga hitrost prvega nalaganja, j 19. 11. 2026; zunanji pregled:
// »LCP ~18 s na počasnem 4G«). Prej jo je izrisal šele app.js, ko je brskalnik prenesel in zagnal ~130 modulov
// (1,3 MB), zato je nov obiskovalec na počasni mobilni povezavi več kot 10 s gledal prazno lupino. Zdaj strežnik
// obiskovalcu brez seje pošlje isto pristajalno stran (public/pristajalna.js, isti izris kot v brskalniku) v
// jeziku, ki ga bo izbral brskalnik, in z istimi podatki kot /api/account/prices. Vidna je samo, ko public/zacetek.js
// pred prvim izrisom potrdi, da bi jo app.js tudi sam pokazal (nov obiskovalec, isti jezik, brez sidra in poizvedbe);
// account.js jo nato prevzame brez ponovnega izrisa (renderLanding), sicer jo skrije.
import fs from "node:fs";
import path from "node:path";
import SL from "../public/i18n/sl.js";
import { detectLanguage, isLanguage, langInfo, uiChain, UI_LANGUAGES } from "../public/i18n/languages.js";
import { landingHtml } from "../public/pristajalna.js";

// Oznake jezikov iz glave Accept-Language po prednosti (q), kot navigator.languages v brskalniku.
export function acceptTags(header) {
  return String(header || "")
    .split(",")
    .map((part, i) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => /^\s*q=([\d.]+)\s*$/.exec(p)).find(Boolean);
      return { tag: tag.trim(), q: q ? Number(q[1]) : 1, i };
    })
    .filter((x) => x.tag && x.tag !== "*" && x.q > 0 && /^[A-Za-z]{1,8}(-[A-Za-z0-9]{1,8})*$/.test(x.tag))
    .sort((a, b) => b.q - a.q || a.i - b.i)
    .map((x) => x.tag);
}

// Jezik in regija, kot ju izbere public/i18n.js (detectLanguage), a samo, ko odloči že prva oznaka: brskalnik
// (zacetek.js) primerja le prvo oznako navigator.languages, zato mora biti izbira od nje odvisna. Sicer null.
// Srbska latinica nastane iz cirilice s prečrkovanjem (i18n.js srToLatin): te strani ne izrišemo vnaprej.
export function landingLanguage(header) {
  const tags = acceptTags(header);
  if (!tags.length) return null;
  const first = detectLanguage([tags[0]]);
  // detectLanguage vrne angleščino tudi, ko nobena oznaka ne ustreza: takrat bi odločile naslednje oznake.
  if (first.code === "en" && !/^en(-|$)/i.test(tags[0])) return null;
  if (first.code === "sr-Latn" || !isLanguage(first.code)) return null;
  return { lang: first.code, region: first.region, tag: tags[0], rtl: !!langInfo(first.code).rtl };
}

// Prevajalnik kot t() v public/i18n.js: veriga slovarjev od izbranega jezika do slovenščine, množinske oblike.
const dicts = new Map();
function dictFor(code, publicDir) {
  if (!UI_LANGUAGES.includes(code) || code === "sl") return null;
  if (!dicts.has(code)) {
    try {
      dicts.set(code, JSON.parse(fs.readFileSync(path.join(publicDir, "i18n", "ui", `${code}.json`), "utf8")));
    } catch {
      dicts.set(code, null);
    }
  }
  return dicts.get(code);
}
export function translator(lang, publicDir) {
  const all = uiChain(lang);
  const chain = [...all.slice(0, all.indexOf("sl")).map((c) => dictFor(c, publicDir)).filter(Boolean), SL];
  let pr;
  try {
    pr = new Intl.PluralRules(lang);
  } catch {
    pr = new Intl.PluralRules("en");
  }
  return (key, vars = {}) => {
    let v;
    for (const d of chain) {
      if (d[key] !== undefined) {
        v = d[key];
        break;
      }
    }
    if (v === undefined) return key;
    if (typeof v === "object") v = v[pr.select(Number(vars.n))] ?? v.other ?? Object.values(v)[0];
    return v.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));
  };
}

const escAttr = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Statični napisi (data-i18n, data-i18n-aria, data-i18n-title) v delu strani, kot applyI18n v public/i18n.js.
export function translateStatic(html, t) {
  return html
    .replace(/(<[^>]*\sdata-i18n="([^"]+)"[^>]*>)([^<]*)</g, (m, open, key) => `${open}${escAttr(t(key))}<`)
    .replace(/<[^>]*\sdata-i18n-(aria|title)="[^"]+"[^>]*>/g, (tag) =>
      tag
        .replace(/(\saria-label=")[^"]*("[^>]*\sdata-i18n-aria="([^"]+)")/, (m, a, b, key) => `${a}${escAttr(t(key))}${b}`)
        .replace(/(\stitle=")[^"]*("[^>]*\sdata-i18n-title="([^"]+)")/, (m, a, b, key) => `${a}${escAttr(t(key))}${b}`),
    );
}

// Podatki za stran ali null (stran se ne izriše vnaprej):
//   prices(req, region): kot /api/account/prices (server/accounts/index.js pricesFor); brez računov ni pristajalne strani.
//   banners(): ["mock-banner", "test-notice"], ki ju app.js pokaže po /api/config; testNotice: znak seznama
//   »Testna verzija« (public/testna-verzija.js: zaprto obvestilo ostane zaprto).
export function landingPage(req, { publicDir, name, prices, mock = false, testNotice = [] }) {
  if (!prices) return null;
  // Seja (piškotek sm_session) pomeni prijavljenega uporabnika ali vsaj nekoga, ki je že bil tu: app.js mu ne
  // pokaže pristajalne strani. Aplikacija za telefon (WebView) se vedno prijavi sama.
  if (/(?:^|;\s*)sm_session=/.test(String(req.headers.cookie || ""))) return null;
  if (/EvklidApp\//.test(String(req.headers["user-agent"] || ""))) return null;
  const jezik = landingLanguage(req.headers["accept-language"]);
  if (!jezik) return null;
  const p = prices(req, jezik.region);
  if (!p) return null;
  const t = translator(jezik.lang, publicDir);
  return {
    ...jezik,
    key: JSON.stringify([jezik.lang, jezik.tag, p.trial_days, p.min_age, p.guarantee || null, mock, testNotice]),
    html: landingHtml(t, { name, prices: p }),
    t,
    mock,
    testNotice: testNotice.join(","),
  };
}
