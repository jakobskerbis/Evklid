// Oznaka »pogovarjaš se z umetno inteligenco, ne s človekom« (EU AI Act, čl. 50(1); kot public/ai-oznaka/ai-oznaka.js).
// Isti slovarji kot splet (public/ai-oznaka/sl.js in i18n/<jezik>.json), da je vsak prevod en sam.
import SL from "../../../public/ai-oznaka/sl.js";
import { mlad } from "../../../public/ai-oznaka/mlad.js";
import { uiChain } from "../../../public/i18n/languages.js";
import { currentLanguage, t } from "./i18n";

type Dict = Record<string, string>;
// Metro potrebuje statične poti.
const LOADERS: Record<string, () => Dict> = {
  en: () => require("../../../public/ai-oznaka/i18n/en.json"),
  de: () => require("../../../public/ai-oznaka/i18n/de.json"),
  it: () => require("../../../public/ai-oznaka/i18n/it.json"),
  fr: () => require("../../../public/ai-oznaka/i18n/fr.json"),
  es: () => require("../../../public/ai-oznaka/i18n/es.json"),
  pt: () => require("../../../public/ai-oznaka/i18n/pt.json"),
  hr: () => require("../../../public/ai-oznaka/i18n/hr.json"),
  sr: () => require("../../../public/ai-oznaka/i18n/sr.json"),
  bs: () => require("../../../public/ai-oznaka/i18n/bs.json"),
  mk: () => require("../../../public/ai-oznaka/i18n/mk.json"),
  sq: () => require("../../../public/ai-oznaka/i18n/sq.json"),
  hu: () => require("../../../public/ai-oznaka/i18n/hu.json"),
  pl: () => require("../../../public/ai-oznaka/i18n/pl.json"),
  cs: () => require("../../../public/ai-oznaka/i18n/cs.json"),
  sk: () => require("../../../public/ai-oznaka/i18n/sk.json"),
  ro: () => require("../../../public/ai-oznaka/i18n/ro.json"),
  uk: () => require("../../../public/ai-oznaka/i18n/uk.json"),
  ru: () => require("../../../public/ai-oznaka/i18n/ru.json"),
  tr: () => require("../../../public/ai-oznaka/i18n/tr.json"),
  ar: () => require("../../../public/ai-oznaka/i18n/ar.json"),
  fa: () => require("../../../public/ai-oznaka/i18n/fa.json"),
  hi: () => require("../../../public/ai-oznaka/i18n/hi.json"),
  bn: () => require("../../../public/ai-oznaka/i18n/bn.json"),
  ur: () => require("../../../public/ai-oznaka/i18n/ur.json"),
  id: () => require("../../../public/ai-oznaka/i18n/id.json"),
  vi: () => require("../../../public/ai-oznaka/i18n/vi.json"),
  zh: () => require("../../../public/ai-oznaka/i18n/zh.json"),
  "zh-Hant": () => require("../../../public/ai-oznaka/i18n/zh-Hant.json"),
  ja: () => require("../../../public/ai-oznaka/i18n/ja.json"),
  ko: () => require("../../../public/ai-oznaka/i18n/ko.json"),
  th: () => require("../../../public/ai-oznaka/i18n/th.json"),
  sw: () => require("../../../public/ai-oznaka/i18n/sw.json"),
};

export function aiT(key: string): string {
  for (const c of uiChain(currentLanguage()) as string[]) {
    const d = c === "sl" ? (SL as Dict) : LOADERS[c === "sr-Latn" ? "sr" : c]?.();
    if (d?.[key] !== undefined) return d[key];
  }
  return t(key);
}

type Settings = Record<string, string | undefined> | undefined;
/** Opomba pod poljem za vnos in ob besedilu AI (vrsta kot na spletu). */
export function aiOpomba(settings: Settings, vrsta: "klepet" | "resitev" = "klepet"): string {
  if (mlad(settings || {})) return aiT("aio.mlad");
  return aiT(vrsta === "resitev" ? "aio.resitev" : "aio.star");
}
/** Obvestilo v praznem klepetu: naslov in opis glede na starost. */
export function aiUvod(settings: Settings): { naslov: string; opis: string } {
  const young = mlad(settings || {});
  return { naslov: aiT(young ? "aio.uvodMlad" : "aio.uvodStar"), opis: aiT(young ? "aio.opisMlad" : "aio.opisStar") };
}
