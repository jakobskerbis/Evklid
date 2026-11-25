// Prepoznava napačnih predstav s kodo (P1-5; načrt kakovosti pred obsegom, j 25. 11. 2026: »A gradi module, B jih
// vklopi«). Za učenčev rezultat v klepetu pove, katera tipična napaka ga razloži: napačen predznak, napačen velikostni
// red, obratna vrednost, faktor 2, nepretvorjena ali napačna enota, ali napaka, ki jo našteje generator naloge.
// Vrne skrito opombo za inštruktorja (slovensko, kot poziv); učencu je ne pokažemo in rezultata ne izda.
//
// Uporablja isto preverjanje kot Vadnica (checkAnswer in diagnose v server/practice/check.js; datoteka kalkulatorja,
// tu samo uvoz). Ob dvomu vrne null: modul nikoli ne ugiba, opomba je le za vzorec, ki ga koda zares najde.
// Brez AI, brez stanja. Profil B odloči, kje ga vklopi (kjer ima pravilen rezultat: RACUN, naloga iz Vadnice).
import { checkAnswer, parseNumberWithUnit, unitFactor, sameUnit } from "./practice/check.js";

export const KODE = ["sign", "magnitude", "reciprocal", "factor2", "unit", "generator"];
const IZ_CHECK = {
  "chk.sign": ["sign", {}],
  "chk.magnitudeBig": ["magnitude", { smer: "vec" }],
  "chk.magnitudeSmall": ["magnitude", { smer: "manj" }],
  "chk.reciprocal": ["reciprocal", {}],
  "chk.factor2Big": ["factor2", { smer: "vec" }],
  "chk.factor2Small": ["factor2", { smer: "manj" }],
};
// Pogoste pretvorbe, ki jih učenec izpusti: število je vrednost v drugi enoti.
const PRETVORBE = [
  [3.6, "km/h in m/s (faktor 3,6)"],
  [1 / 3.6, "km/h in m/s (faktor 3,6)"],
  [60, "minute in sekunde ali ure in minute (faktor 60)"],
  [1 / 60, "minute in sekunde ali ure in minute (faktor 60)"],
  [3600, "ure in sekunde (faktor 3600)"],
  [1 / 3600, "ure in sekunde (faktor 3600)"],
];
const CAS = { s: 1, min: 60, h: 3600 };
const MAX_VNOS = 80;

// Pravilen rezultat: število, besedilo z enoto (»12,5 m/s«) ali { value, unit, mistakes, alsoAccept } iz generatorja.
function spec(pravilno) {
  if (typeof pravilno === "number") return Number.isFinite(pravilno) ? { type: "number", value: pravilno, unit: "" } : null;
  if (typeof pravilno === "string") {
    const p = parseNumberWithUnit(ocisti(pravilno));
    return p ? { type: "number", value: p.value, unit: p.unit } : null;
  }
  if (pravilno && typeof pravilno === "object" && Number.isFinite(pravilno.value)) {
    const { value, unit = "", mistakes, alsoAccept, decimals } = pravilno;
    return { type: "number", value, unit: String(unit || ""), ...(Array.isArray(mistakes) ? { mistakes } : {}), ...(Array.isArray(alsoAccept) ? { alsoAccept } : {}), ...(Number.isInteger(decimals) ? { decimals } : {}) };
  }
  return null;
}

// Zapis iz klepeta: $…$, \, (tanki presledek), \mathrm{…}, \text{…}, \cdot.
const ocisti = (s) =>
  String(s ?? "")
    .replace(/\\(?:mathrm|text|rm|mbox)\s*\{\s*([^{}]*?)\s*\}/g, "$1")
    .replace(/\\[,;:! ]|~/g, " ")
    .replace(/\\cdot/g, "·")
    .replace(/\$/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Faktor pretvorbe enote (tudi sestavljene a/b s časom, npr. km/h → m/s) ali null.
function faktor(od, v) {
  if (!od || !v) return null;
  if (sameUnit(od, v)) return 1;
  const f = unitFactor(od, v);
  if (f != null) return f;
  const [a1, b1, ...x1] = od.split("/");
  const [a2, b2, ...x2] = v.split("/");
  if (b1 === undefined || b2 === undefined || x1.length || x2.length) return null;
  const del = (x, y) => (sameUnit(x, y) ? 1 : (unitFactor(x, y) ?? (CAS[x] && CAS[y] ? CAS[x] / CAS[y] : null)));
  const fa = del(a1.trim(), a2.trim());
  const fb = del(b1.trim(), b2.trim());
  return fa != null && fb != null ? fa / fb : null;
}

// Enako do zaokrožitve, ki jo je učenec zapisal (pol zadnjega mesta), ali 0,5 % (kot v Vadnici).
const blizu = (v, cilj, decimals) => Math.abs(v - cilj) <= Math.max(0.51 * 10 ** -Math.max(decimals, 0), 0.005 * Math.abs(cilj)) + 1e-12;

const NAVODILO = " Rezultata ne povej; z enim vprašanjem ga usmeri, naj sam preveri ta del.";
function opomba(koda, params) {
  const vec = params.smer === "vec" ? "prevelik" : "premajhen";
  const t = {
    sign: "učenčev rezultat ima pravo velikost, a napačen predznak.",
    magnitude: `učenčeve števke so prave, rezultat pa je ${params.times}-krat ${vec} (verjetno pretvorba enot ali decimalna vejica).`,
    reciprocal: "učenec je dobil obratno vrednost (verjetno obrnjena formula ali deljenje v napačnem vrstnem redu).",
    factor2: `učenčev rezultat je natanko 2-krat ${vec} (verjetno ½ v formuli, premer namesto polmera ali izpuščen kvadrat).`,
    unit: params.kaj ? `število se ujema z rezultatom v drugi enoti (${params.kaj}); verjetno enote ni pretvoril.` : `enota učenčevega rezultata (${params.ima}) ne ustreza iskani količini (${params.prava}).`,
    generator: `tipična napaka pri tej nalogi: ${params.zakaj}`,
  }[koda];
  return `Koda: ${t}${NAVODILO}`;
}
const izid = (koda, params) => ({ koda, params, opomba: opomba(koda, params) });

/**
 * @param {{ pravilno: number|string|{value:number, unit?:string, mistakes?:{value:number, why:string}[], alsoAccept?:number[], decimals?:number}, ucenec: string }} x
 * @returns {null | { koda: string, params: object, opomba: string }}
 */
export function napacnaPredstava({ pravilno, ucenec } = {}) {
  const ans = spec(pravilno);
  const vnos = ocisti(ucenec);
  if (!ans || !vnos || vnos.length > MAX_VNOS) return null;
  let r;
  try {
    r = checkAnswer(ans, vnos, { convert: true });
  } catch {
    return null;
  }
  if (r.kind === "correct") return null;
  const p = parseNumberWithUnit(vnos);
  if (!p) return null;
  // Pravilna vrednost v drugi enoti (72 km/h, ko iščemo m/s): to ni napačna predstava.
  const f = ans.unit && p.unit ? faktor(p.unit, ans.unit) : null;
  if (f != null && blizu(p.value * f, ans.value, 12)) return null;
  if (r.kind === "wrong" && r.mistake) {
    if (IZ_CHECK[r.mistake.code]) {
      const [koda, extra] = IZ_CHECK[r.mistake.code];
      return izid(koda, { ...extra, ...(r.mistake.params?.times ? { times: r.mistake.params.times } : {}) });
    }
    if (!r.mistake.code && r.mistake.message) return izid("generator", { zakaj: String(r.mistake.message).slice(0, 200) });
  }
  // Nepretvorjena enota: število je rezultat v drugi pogosti enoti (enota zapisana kot prava ali brez nje).
  if (ans.value && (f === 1 || !p.unit)) {
    for (const [k, kaj] of PRETVORBE) if (blizu(p.value, ans.value * k, p.decimals)) return izid("unit", { kaj });
    if (/^(?:K|°C)$/.test(ans.unit) && [273.15, -273.15].some((d) => blizu(p.value, ans.value + d, p.decimals))) return izid("unit", { kaj: "kelvini in stopinje Celzija (273,15)" });
  }
  // Enota druge količine (20 N, ko iščemo m/s).
  if (r.kind === "unit" && r.code === "chk.unit" && p.unit && f == null) return izid("unit", { ima: p.unit.slice(0, 20), prava: ans.unit.slice(0, 20) });
  return null;
}
