// Besedila vmesnika: isti slovarji kot spletna aplikacija (public/i18n/sl.js in ui/<jezik>.json), da je
// vsak prevod en sam. Jezik je jezik profila (settings.language), sicer jezik telefona.
import { getCalendars, getLocales } from "expo-localization";
import { useSyncExternalStore } from "react";
import SL from "../../../public/i18n/sl.js";
import { uiChain, uiLanguage, detectLanguage, homeLanguage, RTL } from "../../../public/i18n/languages.js";

type Dict = Record<string, string | Record<string, string>>;

// Metro potrebuje statične poti; slovar se prebere šele, ko je jezik izbran.
const LOADERS: Record<string, () => Dict> = {
  en: () => require("../../../public/i18n/ui/en.json"),
  de: () => require("../../../public/i18n/ui/de.json"),
  it: () => require("../../../public/i18n/ui/it.json"),
  fr: () => require("../../../public/i18n/ui/fr.json"),
  es: () => require("../../../public/i18n/ui/es.json"),
  pt: () => require("../../../public/i18n/ui/pt.json"),
  hr: () => require("../../../public/i18n/ui/hr.json"),
  sr: () => require("../../../public/i18n/ui/sr.json"),
  bs: () => require("../../../public/i18n/ui/bs.json"),
  mk: () => require("../../../public/i18n/ui/mk.json"),
  sq: () => require("../../../public/i18n/ui/sq.json"),
  hu: () => require("../../../public/i18n/ui/hu.json"),
  pl: () => require("../../../public/i18n/ui/pl.json"),
  cs: () => require("../../../public/i18n/ui/cs.json"),
  sk: () => require("../../../public/i18n/ui/sk.json"),
  ro: () => require("../../../public/i18n/ui/ro.json"),
  uk: () => require("../../../public/i18n/ui/uk.json"),
  ru: () => require("../../../public/i18n/ui/ru.json"),
  tr: () => require("../../../public/i18n/ui/tr.json"),
  ar: () => require("../../../public/i18n/ui/ar.json"),
  fa: () => require("../../../public/i18n/ui/fa.json"),
  hi: () => require("../../../public/i18n/ui/hi.json"),
  bn: () => require("../../../public/i18n/ui/bn.json"),
  ur: () => require("../../../public/i18n/ui/ur.json"),
  id: () => require("../../../public/i18n/ui/id.json"),
  vi: () => require("../../../public/i18n/ui/vi.json"),
  zh: () => require("../../../public/i18n/ui/zh.json"),
  "zh-Hant": () => require("../../../public/i18n/ui/zh-Hant.json"),
  ja: () => require("../../../public/i18n/ui/ja.json"),
  ko: () => require("../../../public/i18n/ui/ko.json"),
  th: () => require("../../../public/i18n/ui/th.json"),
  sw: () => require("../../../public/i18n/ui/sw.json"),
};

// Telefon v angleščini v Sloveniji dobi slovenščino (homeLanguage, enako kot splet).
function deviceLanguage(): string {
  const code = detectLanguage(getLocales().map((l) => l.languageTag)).code as string;
  try {
    return homeLanguage(code, getCalendars()[0]?.timeZone || "");
  } catch {
    return code;
  }
}

let lang = deviceLanguage();
let dicts: Dict[] = [];
const subs = new Set<() => void>();

function load(code: string) {
  dicts = (uiChain(code) as string[]).map((c) => (c === "sl" ? (SL as Dict) : LOADERS[c]?.() || {}));
}
load(lang);

// Jezik profila (ali null = jezik telefona).
export function setLanguage(code?: string | null) {
  const next = code ? uiLanguage(code) : deviceLanguage();
  if (next === lang) return;
  lang = next;
  load(lang);
  subs.forEach((fn) => fn());
}
export const currentLanguage = () => lang;
export const isRtl = () => RTL.has(lang);

const plural = (code: string, n: number) => {
  try {
    return new Intl.PluralRules(code === "zh-Hant" ? "zh" : code).select(n);
  } catch {
    return n === 1 ? "one" : "other";
  }
};

export function t(key: string, vars: Record<string, string | number> = {}): string {
  let v: Dict[string] | undefined;
  let from = "sl";
  const chain = uiChain(lang) as string[];
  for (let i = 0; i < dicts.length; i++) {
    if (dicts[i][key] !== undefined) {
      v = dicts[i][key];
      from = chain[i];
      break;
    }
  }
  if (v === undefined) return key;
  let s: string;
  if (typeof v === "object") {
    const n = Number(vars.n ?? 0);
    s = v[plural(from, n)] ?? v.other ?? Object.values(v)[0];
  } else s = v;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

// Komponenta se ob menjavi jezika izriše znova.
export function useLanguage() {
  return useSyncExternalStore(
    (fn) => {
      subs.add(fn);
      return () => subs.delete(fn);
    },
    () => lang,
  );
}

// Števila v jeziku vmesnika (slovenska decimalna vejica).
export const num = (x: number, digits = 0) => {
  try {
    return new Intl.NumberFormat(lang === "zh-Hant" ? "zh-TW" : lang, { maximumFractionDigits: digits }).format(x);
  } catch {
    return String(x);
  }
};
