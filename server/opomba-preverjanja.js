// Opomba brez modela pod odgovorom (AUDIT-060, AUDIT-066; j 27. 11.: »Dokončaj pred pilotom«): ko koda zanesljivo ve,
// da je v odgovoru napaka, popravka modela pa ni (meja porabe, napaka klica, pri blagi ugotovitvi tudi »OK« modela),
// učenec vidi kratko opombo. Opomba je konkretna in vedno resnična: pove, kateri zapis ne drži in koliko je prav
// (vse izračuna koda), zato ni lažni alarm niti takrat, ko je inštruktor napako navedel namenoma. Splošno besedilo
// (chat.checkNote) ostane le za ugotovitve brez podatkov za konkreten zapis (trditve iz bloka RACUN).
//
// Ugotovitev (fact) je podatek brez jezika, ki ga pripravijo live-check.js, racun.js in sodba-koraka.js:
//   { kind: "calc", wrong, right? }            račun »wrong« ne drži; »right« je resnična enakost (izračunana)
//   { kind: "value", wrong, eq?, right, sys? } vrednost »wrong« ni rešitev enačbe ali sistema »eq«
//   { kind: "step", wrong, eq, right }         enačba »wrong« ne sledi iz »eq«
//   { kind: "deriv", wrong, fn, right }        odvod »wrong« funkcije »fn« ni pravilen
//   { kind: "rightValue" | "rightCalc" | "rightStep", stmt, eq, right? }  učenčev korak je pravilen
// Vsi deli so TeX brez »$«; besedilo jih ovije v »$…$«.
import SL from "../public/i18n/sl.js";
import { uiChain } from "../public/i18n/languages.js";
import { uiText } from "./odrezan-odgovor.js";
export { plainToTex, numTex } from "./besedilo-trditev.js";

const MAX_PART = 160;

function uiString(key, language) {
  for (const c of uiChain(language || "sl")) {
    const t = c === "sl" ? SL[key] : uiText(c, key);
    if (t) return t;
  }
  return SL[key] || "";
}

// Del zapisa za opombo: brez »$« in prelomov, ne predolg (sicer null in splošna opomba). Besedilni zapis računa
// (»((1)/(sqrt(3)))«, »x**2«) ni TeX: null. Decimalna vejica (razen v angleščini): »0.2« → »0{,}2« (pregled A).
function partIn(s, language = "sl") {
  if (s == null) return null;
  let t = String(s).replace(/\$/g, "").replace(/\s+/g, " ").trim();
  if (!t || t.length > MAX_PART) return null;
  if (/(?<![\\a-zA-Z])(?:sqrt|sin|cos|tan|log|ln|exp|pi)\s*\(|\)\s*\/\s*\(|\*\*|\(\(/.test(t)) return null;
  if (!/^en\b/i.test(language || "")) t = t.replace(/(\d)\.(?=\d)/g, "$1{,}");
  // neuravnoteženi oklepaji TeX bi pokvarili prikaz
  let depth = 0;
  for (const ch of t) {
    if (ch === "{") depth++;
    else if (ch === "}" && --depth < 0) return null;
  }
  return depth ? null : `$${t}$`;
}

const fill = (t, vars) => t.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));

/** Besedilo opombe (brez oblikovanja) ali null, ko iz ugotovitve ni mogoče sestaviti konkretnega zapisa. */
export function factText(fact, language = "sl", { soft = false } = {}) {
  if (!fact) return null;
  const part = (s) => partIn(s, language);
  const wrong = part(fact.wrong);
  if (soft) {
    if (fact.kind !== "calc" || !wrong) return null;
    const right = part(fact.right);
    return fill(uiString(right ? "chat.noteSoft" : "chat.noteSoftBare", language), { wrong, right });
  }
  switch (fact.kind) {
    case "calc": {
      if (!wrong) return null;
      const right = part(fact.right);
      return fill(uiString(right ? "chat.noteCalc" : "chat.noteCalcBare", language), { wrong, right });
    }
    case "value": {
      const right = part(fact.right);
      const eq = part(fact.eq);
      if (!wrong || !right) return null;
      const key = !eq ? "chat.noteValueTask" : fact.sys ? "chat.noteValueSys" : "chat.noteValue";
      return fill(uiString(key, language), { wrong, eq, right });
    }
    case "step": {
      const right = part(fact.right);
      const eq = part(fact.eq);
      if (!wrong || !right || !eq) return null;
      return fill(uiString("chat.noteStep", language), { wrong, eq, right });
    }
    case "deriv": {
      const right = part(fact.right);
      const fn = part(fact.fn);
      if (!wrong || !right || !fn) return null;
      return fill(uiString("chat.noteDeriv", language), { wrong, fn, right });
    }
    case "rightValue":
    case "rightCalc":
    case "rightStep": {
      const stmt = part(fact.stmt);
      const eq = part(fact.eq);
      const right = part(fact.right);
      if (!stmt || !eq || (fact.kind === "rightStep" && !right)) return null;
      const key = { rightValue: "chat.noteRightValue", rightCalc: "chat.noteRightCalc", rightStep: "chat.noteRightStep" }[fact.kind];
      return fill(uiString(key, language), { stmt, eq, right });
    }
    default:
      return null;
  }
}

/**
 * Opomba pod odgovorom (ležeče, v jeziku učenca). Trdna ugotovitev brez konkretnega zapisa dobi splošno opombo
 * (chat.checkNote); blaga (AUDIT-066) brez konkretnega zapisa le splošno blago opombo.
 */
export function checkNoteFor(fact, language = "sl", { soft = false, verdict = false } = {}) {
  const t = factText(fact, language, { soft }) || uiString(soft ? "chat.noteSoftGeneric" : verdict ? "chat.checkNoteVerdict" : "chat.checkNote", language);
  return `\n\n*(${t})*`;
}
