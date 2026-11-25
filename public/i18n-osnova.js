// Jezik vmesnika brez vgrajenih slovenskih besedil (osnova za prvi izris aplikacije). Moduli prvega izrisa
// (server/startup-files.js) uvozijo to datoteko, vsi drugi public/i18n.js, ki doda celo public/i18n/sl.js.
// Zakaj: sl.js je ~75 KB stisnjeno, prvi izris Učne poti pa rabi le del (docs/meritve/prijavljen-mobilno-2026-11-19.md).
// Strežnik za prijavljenega učenca v stran vstavi besedila, ki jih uporabljajo moduli prvega izrisa (server/i18n-jedro.js,
// <script id="evklid-sl-jedro">); `ready` se tedaj izpolni takoj, celoten slovar pa app.js naloži po prvem izrisu.
// Brez jedra (pristajalna stran, stran iz service workerja, druge strani, drug jezik) `ready` počaka cel slovar, kot prej.
// Modul, ki ni del prvega izrisa, uvozi public/i18n.js: brskalnik ga zažene šele, ko je cel slovar naložen (statičen uvoz),
// zato so njegovi t() pravilni že ob nalaganju. Brez top-level await: Safari ima z njim napako, ko modul uvaža več modulov
// hkrati (WebKit 242740, aplikacija na iPadu se ni izrisala).
import { zavrzi } from "./odgovor.js";
import { DEFAULT_LANGUAGE, LANGUAGES, isLanguage, langInfo, uiDicts, UI_LANGUAGES, LIVE_UI_LANGUAGES, detectLanguage, homeLanguage } from "./i18n/languages.js";

const KEY = "evklid.lang";
let lang = DEFAULT_LANGUAGE;
let SL = {}; // slovenska besedila: jedro s strežnika ali cel public/i18n/sl.js
let vse = false; // cel slovar je naložen
// Del slovarja za zaslone po prvem izrisu (public/i18n-zasloni.js): za jedrom, dokler ni celega slovarja.
const DEL = {};
let dicts = [SL, DEL]; // od izbranega jezika proti izvirniku
let prevodi = []; // naloženi prevodi izbranega jezika (pred slovenščino)
// Ključi, ki jih je kdo zahteval pred celim slovarjem in jih ni bilo v jedru (test/zacetek-leno.test.js preveri, da jih ni).
const manjka = new Set();
export const manjkajoci = () => [...manjka];
const zamenjajSL = (d) => {
  SL = d;
  dicts = [...prevodi, SL, DEL];
};
export function dodajDel(del) {
  if (!vse && del && typeof del === "object") Object.assign(DEL, del);
}
// public/i18n.js ob nalaganju: cel slovar. Ključi, ki jih zagon ni našel v jedru, so s tem tu (statični napisi znova).
let celP = null;
let celOk = null;
export function dodajSlovenscino(cel) {
  if (vse) return;
  vse = true;
  zamenjajSL(cel);
  if (typeof document !== "undefined" && manjka.size) applyI18n();
  celOk?.();
}
// Cel slovar (public/i18n.js): obljuba, ki se izpolni, ko je naložen. Ne sproži nalaganja; to stori naloziVse.
export const celSlovar = () => (vse ? Promise.resolve() : (celP ||= new Promise((ok) => (celOk = ok))));
export const vseNalozeno = () => vse;
export function naloziVse() {
  if (vse) return Promise.resolve();
  return import("./i18n.js").then(() => celSlovar()); // i18n.js ob nalaganju pokliče dodajSlovenscino
}
// Jedro s strežnika (server/i18n-jedro.js): samo za slovenščino, enkrat.
function beriJedro() {
  try {
    const el = typeof document !== "undefined" && document.getElementById("evklid-sl-jedro");
    if (!el) return null;
    el.remove();
    const d = JSON.parse(el.textContent || "null");
    return d && typeof d === "object" && !Array.isArray(d) ? d : null;
  } catch {
    return null;
  }
}

function stored() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

// Srbska latinica nastane iz cirilice.
const SR_LATN = { а: "a", б: "b", в: "v", г: "g", д: "d", ђ: "đ", е: "e", ж: "ž", з: "z", и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o", п: "p", р: "r", с: "s", т: "t", ћ: "ć", у: "u", ф: "f", х: "h", ц: "c", ч: "č", џ: "dž", ш: "š" };
export function srToLatin(s) {
  return s.replace(/[Ѐ-ӿ]/g, (ch) => {
    const lower = ch.toLowerCase();
    const out = SR_LATN[lower];
    if (out === undefined) return ch;
    return ch === lower ? out : out.charAt(0).toUpperCase() + out.slice(1);
  });
}
function translit(dict) {
  const out = {};
  for (const [k, v] of Object.entries(dict)) {
    out[k] = typeof v === "string" ? srToLatin(v) : Object.fromEntries(Object.entries(v).map(([f, s]) => [f, srToLatin(s)]));
  }
  return out;
}

async function fetchDict(code) {
  const file = code === "sr-Latn" ? "sr" : code;
  if (!UI_LANGUAGES.includes(file) || file === "sl") return null;
  try {
    const res = await fetch(`i18n/ui/${file}.json`);
    if (!res.ok) return zavrzi(res), null;
    const d = await res.json();
    return code === "sr-Latn" ? translit(d) : d;
  } catch {
    return null;
  }
}

async function load(code) {
  lang = isLanguage(code) ? code : DEFAULT_LANGUAGE;
  // Slovenščina je izvirnik in vedno zadnja (za »sl« torej samo izvirnik); za živim jezikom (vsi ključi) ne iščemo več.
  const chain = uiDicts(lang);
  const jedro = beriJedro();
  // Slovenščina z jedrom: brez čakanja (cel slovar pride po prvem izrisu); sicer cel slovar skupaj s prevodi. Živ jezik
  // vmesnika (de, hr, it, hu, en) ima vse ključe: prvi izris ne čaka slovenskega izvirnika (~84 KB), ta se naloži v ozadju
  // (kot nadomestek in za module, ki uvozijo public/i18n.js). Če prevod ne pride (napaka omrežja), počakamo izvirnik.
  const izvirnik = jedro && lang === "sl" ? null : naloziVse();
  izvirnik?.catch(() => {}); // napaka v ozadju ni napaka zagona, kadar prevod ima vse ključe; sicer jo dobi await spodaj
  const loaded = await Promise.all(chain.map(fetchDict));
  const poln = chain.length > 0 && LIVE_UI_LANGUAGES.includes(chain.at(-1)) && !!loaded.at(-1);
  if (izvirnik && !poln) await izvirnik;
  prevodi = loaded.filter(Boolean);
  if (!vse) zamenjajSL(jedro || {});
  else dicts = [...prevodi, SL, DEL];
  const html = document.documentElement;
  html.lang = lang;
  html.dir = langInfo(lang).rtl ? "rtl" : "ltr";
}

// Ob prvem zagonu jezik in regija naprave (npr. sl-SI → slovenščina, pt-BR → portugalščina za Brazilijo),
// sicer najbližji jezik ali narečje, brez ujemanja angleščina. Izbira v Nastavitvah ima prednost.
const detected = detectLanguage(typeof navigator === "undefined" ? [] : navigator.languages?.length ? navigator.languages : [navigator.language]);
let timeZone = "";
try {
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
} catch {}
export const ready = load(stored() || homeLanguage(detected.code, timeZone)).then(() => applyI18n());

export const currentLang = () => lang;
// Regija (ISO 3166, npr. "BR") velja, ko je izbrani jezik tisti, ki ga je zaznala naprava.
export const regionFor = (code) => (code === detected.code ? detected.region : "");
export const currentRegion = () => regionFor(lang);
// Država naprave (ne glede na izbrani jezik), npr. za privzeti šolski sistem.
export const deviceRegion = () => detected.region || "";
// Oznaka za Intl (datumi, števila); zh-Hant, sr-Latn … so veljavne BCP 47 oznake.
export const locale = () => (currentRegion() ? `${lang}-${currentRegion()}` : lang);

const plural = new Map();
function pluralForm(n) {
  if (!plural.has(lang)) {
    let pr;
    try {
      pr = new Intl.PluralRules(lang);
    } catch {
      pr = new Intl.PluralRules("en");
    }
    plural.set(lang, pr);
  }
  return plural.get(lang).select(n);
}

export function t(key, vars = {}) {
  let v;
  for (const d of dicts) {
    if (d[key] !== undefined) {
      v = d[key];
      break;
    }
  }
  if (v === undefined) {
    if (!vse) manjka.add(key);
    return key;
  }
  // Množinske oblike: { one, two, few, other } po pravilih jezika, število je {n}.
  if (typeof v === "object") v = v[pluralForm(Number(vars.n))] ?? v.other ?? Object.values(v)[0];
  return v.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));
}

// Statični napisi v HTML: data-i18n (besedilo), data-i18n-ph (placeholder), data-i18n-title, data-i18n-aria, data-i18n-alt.
export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  root.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  root.querySelectorAll("[data-i18n-title]").forEach((el) => (el.title = t(el.dataset.i18nTitle)));
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  root.querySelectorAll("[data-i18n-alt]").forEach((el) => (el.alt = t(el.dataset.i18nAlt)));
}

// Zamenja jezik in ponovno naloži stran (vsi napisi se izrišejo znova).
// Vrne false, če ga ni mogoče shraniti (npr. zasebno okno), da se stran ne nalaga v nedogled.
export function setLanguage(code, { reload = true } = {}) {
  if (!isLanguage(code)) return false;
  try {
    localStorage.setItem(KEY, code);
  } catch {}
  if (stored() !== code) return false;
  // Nov slovar najprej v predpomnilnik, da se stran po ponovnem nalaganju odpre hitro in v novem jeziku;
  // na počasni povezavi čakamo največ 1,5 s.
  if (reload && code !== lang) Promise.race([fetchDict(code), new Promise((ok) => setTimeout(ok, 1500))]).finally(() => location.reload());
  return true;
}

// <option> za vse jezike: najprej slovenščina in angleščina, nato po angleškem imenu.
// Ime v jeziku in v oklepaju angleško ime (iskanje deluje po obeh).
export function languageOptions(selected = lang) {
  const list = [...LANGUAGES].sort((a, b) => {
    const rank = (c) => (c === "sl" ? 0 : c === "en" ? 1 : 2);
    return rank(a[0]) - rank(b[0]) || a[2].localeCompare(b[2], "en");
  });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  return list
    .map(([code, native, english]) => {
      // Isolating the English name keeps "العربية (Arabic)" readable in both directions.
      const label = native === english ? native : `${native} (\u2068${english}\u2069)`;
      return `<option value="${code}" ${code === selected ? "selected" : ""}>${esc(label)}</option>`;
    })
    .join("");
}

