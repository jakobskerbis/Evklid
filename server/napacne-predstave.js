// Prepoznava napačnih predstav s kodo (P1-5; načrt kakovosti pred obsegom, j 25. 11. 2026: »A gradi module, B jih
// vklopi«). Za učenčev rezultat v klepetu pove, katera tipična napaka ga razloži: napačen predznak, napačen velikostni
// red, obratna vrednost, faktor 2, nepretvorjena ali napačna enota, ali napaka, ki jo našteje generator naloge.
// Vrne skrito opombo za inštruktorja (slovensko, kot poziv); učencu je ne pokažemo in rezultata ne izda.
//
// Uporablja isto preverjanje kot Vadnica (checkAnswer in diagnose v server/practice/check.js; datoteka kalkulatorja,
// tu samo uvoz). Ob dvomu vrne null: modul nikoli ne ugiba, opomba je le za vzorec, ki ga koda zares najde.
// Brez AI, brez stanja. Profil B odloči, kje ga vklopi (kjer ima pravilen rezultat: RACUN, naloga iz Vadnice).
import { checkAnswer, parseNumberWithUnit, siUnit, sameUnit } from "./practice/check.js";

export const KODE = ["sign", "magnitude", "reciprocal", "factor2", "unit", "generator"];
const IZ_CHECK = {
  "chk.sign": ["sign", {}],
  "chk.magnitudeBig": ["magnitude", { smer: "vec" }],
  "chk.magnitudeSmall": ["magnitude", { smer: "manj" }],
  "chk.reciprocal": ["reciprocal", {}],
  "chk.factor2Big": ["factor2", { smer: "vec" }],
  "chk.factor2Small": ["factor2", { smer: "manj" }],
};
// Pogoste pretvorbe, ki jih učenec izpusti: število je vrednost v drugi enoti iste količine. Faktor 3,6 samo pri
// hitrosti, 60 in 3600 samo pri času (pregled 2 in 3: brez enote ali pri drugi količini je to lahko le naključje).
const PRETVORBE = {
  "m1/s": [[3.6, "km/h in m/s (faktor 3,6)"], [1 / 3.6, "km/h in m/s (faktor 3,6)"]],
  s: [[60, "minute in sekunde ali ure in minute (faktor 60)"], [1 / 60, "minute in sekunde ali ure in minute (faktor 60)"], [3600, "ure in sekunde (faktor 3600)"], [1 / 3600, "ure in sekunde (faktor 3600)"]],
};
const CAS = { s: 1, min: 60, h: 3600 };
const TEMP = /^(?:K|°C)$/;
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

// Enota → { dim, scale } (vrednost v osnovni enoti = vrednost · scale) ali null; tudi čas (min, h), Wh in a/b.
function enota(u) {
  const x = String(u || "").trim();
  if (!x) return null;
  if (CAS[x]) return { dim: "s", scale: CAS[x] };
  const si = siUnit(x);
  if (si) return si.base === "Wh" ? { dim: "J1", scale: si.scale * 3600 } : { dim: si.base === "s" && si.pow === 1 ? "s" : `${si.base}${si.pow}`, scale: si.scale };
  const deli = x.split("/");
  if (deli.length !== 2) return null;
  const [a, b] = deli.map(enota);
  return a && b ? { dim: `${a.dim}/${b.dim}`, scale: a.scale / b.scale } : null;
}
const znana = (u) => !!enota(u) || TEMP.test(String(u || "").trim());

// Vrednost v enoti »od« pretvorjena v enoto »v« ali null (ni ista količina ali neznana enota).
function pretvori(x, od, v) {
  if (sameUnit(od, v)) return x;
  if (TEMP.test(od) && TEMP.test(v)) return od === "K" ? x - 273.15 : x + 273.15;
  const a = enota(od);
  const b = enota(v);
  return a && b && a.dim === b.dim ? (x * a.scale) / b.scale : null;
}

// Enako do 1 % (pravilen rezultat v drugi enoti, z učenčevim zaokroževanjem; pri dvomu raje null kot napačna opomba).
const blizu = (v, cilj, rel = 0.01) => Math.abs(v - cilj) <= rel * Math.abs(cilj) + 1e-12;

const NAVODILO = " Rezultata ne povej; z enim vprašanjem ga usmeri, naj sam preveri ta del.";
function opomba(koda, params) {
  const vec = params.smer === "vec" ? "prevelik" : "premajhen";
  const t = {
    sign: "učenčev rezultat ima pravo velikost, a napačen predznak.",
    magnitude: `učenčeve števke so prave, rezultat pa je ${params.times}-krat ${vec} (verjetno pretvorba enot ali decimalna vejica).`,
    reciprocal: "učenec je dobil obratno vrednost (verjetno obrnjena formula ali deljenje v napačnem vrstnem redu).",
    factor2: `učenčev rezultat je 2-krat ${vec} (verjetno ½ v formuli ali premer namesto polmera).`,
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
  const p = parseNumberWithUnit(vnos);
  // Samo število z znano enoto ali brez nje (»6 ali 7« ni rezultat z enoto »ali 7«).
  if (!p || !Number.isFinite(p.value) || Math.abs(p.value) > 1e15 || (p.unit && !sameUnit(p.unit, ans.unit) && !znana(p.unit))) return null;
  // Pravilna vrednost v drugi enoti iste količine (72 km/h za 20 m/s, 7200 s za 2 h, 293,15 K za 20 °C).
  const vEnoti = ans.unit && p.unit ? pretvori(p.value, p.unit, ans.unit) : p.unit && !ans.unit ? null : p.value;
  if (vEnoti != null && blizu(vEnoti, ans.value)) return null;
  let r;
  try {
    r = checkAnswer(ans, vnos, { convert: true });
  } catch {
    return null;
  }
  if (r.kind === "correct") return null;
  const pricakovane = [ans.value, ...(ans.alsoAccept || [])].filter((e) => Number.isFinite(e) && e !== 0);
  if (r.kind === "wrong" && r.mistake) {
    const [koda, extra] = IZ_CHECK[r.mistake.code] || [];
    if (koda) {
      // Vzorec potrdi še enkrat, strožje kot Vadnica (1 %), da opomba ne trdi česa, česar koda ni pokazala.
      const times = Number(r.mistake.params?.times) || 1;
      const cilj = (e) => ({ sign: -e, magnitude: extra.smer === "vec" ? e * times : e / times, reciprocal: 1 / e, factor2: extra.smer === "vec" ? 2 * e : e / 2 })[koda];
      if (vEnoti == null || !pricakovane.some((e) => blizu(vEnoti, cilj(e)))) return null;
      return izid(koda, { ...extra, ...(koda === "magnitude" ? { times: String(times) } : {}) });
    }
    // Napaka iz generatorja: brez števk (besedilo lahko vsebuje rezultat, opomba ga ne sme izdati).
    const zakaj = String(r.mistake.message || "");
    if (!r.mistake.code && zakaj && !/\d/.test(zakaj)) return izid("generator", { zakaj: zakaj.slice(0, 200) });
    if (!r.mistake.code) return null;
  }
  // Nepretvorjena enota: število je rezultat v drugi pogosti enoti iste količine (enota zapisana kot prava ali brez nje).
  const dim = TEMP.test(ans.unit) ? "T" : enota(ans.unit)?.dim;
  if (dim && p.value !== 0 && (!p.unit || sameUnit(p.unit, ans.unit))) {
    for (const [k, kaj] of PRETVORBE[dim] || []) if (pricakovane.some((e) => blizu(p.value, e * k))) return izid("unit", { kaj });
    if (dim === "T" && pricakovane.some((e) => [273.15, -273.15].some((d) => blizu(p.value, e + d, 0.002)))) return izid("unit", { kaj: "kelvini in stopinje Celzija (273,15)" });
  }
  // Enota druge količine (20 N, ko iščemo m/s): obe enoti znani, količini različni.
  if (p.unit && ans.unit && dim && znana(p.unit) && pretvori(1, p.unit, ans.unit) == null) return izid("unit", { ima: p.unit.slice(0, 20), prava: ans.unit.slice(0, 20) });
  return null;
}
