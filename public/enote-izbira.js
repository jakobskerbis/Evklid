// Izbira enote pri številski nalogi (j, 16. 11. 2026: v »Testu predznanja« je gumb ob polju za odgovor že
// pred odgovorom pokazal pravo enoto »V« zaporne napetosti). Enota je del odgovora, zato je privzeto ni
// (prazna izbira »Enota«), ponudba pa je šest enot po abecedi: prava, 2–3 z isto osnovo in drugo predpono
// (V → mV, kV) in enote predmeta. Med ponujenimi ni enote, ki jo preverjanje sprejme kot pravo (accepts), in ne
// enote, ki je enakovredna pravi (mL in cm³, N s in kg m/s), ker bi jo preverjanje zavrnilo, čeprav je prav.
// Ponudbo sestavi strežnik (server/practice/index.js publicTask → task.units, s pravim preverjanjem); odjemalec
// jo izračuna sam le, če je ni (aplikacija brez povezave). Brez DOM. Pomožne funkcije za vpis enote v polje
// (withUnit, unitAtEnd) uporabljajo plošča (pad.js), tipkovnica (tipkovnica.js) in aplikacija Expo.

// Enote, ki jih uporabljajo generatorji nalog po predmetih (server/practice/generators, 17. 11. 2026); »_« je presledek.
const POOL = {
  FIZ: "N m/s m cm J A ° V s m/s² W kJ kg Ω % Hz km/h min Pa km/s °C mm kPa K N/m nm kg/m³ eV km g W/m² nC mol mA h THz kWh dB cm³ mN µT g/cm³ µJ mg ps pF L µC mL MeV kN/C mT kW dpt MJ mJ mV MBq m² ns V/m MW ms N_s kg_m/s bar GHz t µF N_m min⁻¹ MW/m² As c D let dni dm dm² dm³ dag €",
  KEM: "g % mol/L g/mol mol L kJ kg V mL kJ/mol mol/(L·s) kPa MJ mol/(L·min) h g/cm³ min g/L kg/mol K °C Pa s mg mmol µmol",
  MAT: "cm ° € m cm² cm³ dm³ % km m² dm m³ mm min °C h km/h g dm² L mm² kg dag s ml dl t dni let ur",
  BIO: "% kJ cm µm mm g mg mL L h min °C",
  DENAR: "€ % let dni mesecev tednov ur",
};
POOL.UNI = `${POOL.FIZ} ${POOL.KEM} MPa kN µmol/L mmol/L pm µs kNm mmol/L kg/h µmol/min`;
POOL.NAR = `${POOL.FIZ} ${POOL.KEM}`;
const poolOf = (subject, unit) =>
  (/^(?:€|EUR|\$)$/.test(unit) ? POOL.DENAR : POOL[subject] || `${POOL.FIZ} ${POOL.KEM} ${POOL.MAT}`).split(" ").map((u) => u.replace(/_/g, " "));

// Zapis za prikaz: ^2 → ², ^3 → ³, ^-1 → ⁻¹.
export const prettyUnit = (u) => String(u).replace(/\^\{?-1\}?/g, "⁻¹").replace(/\^\{?2\}?/g, "²").replace(/\^\{?3\}?/g, "³");
// Enako zapisani enoti (l in L, cm^3 in cm³, »N s« in »N·s«).
const norm = (u) => prettyUnit(u).replace(/[\s·*]+/g, "").toLowerCase();

// Enakovredne enote: preverjanje jih ne sprejme kot pravo (zahteva zapis naloge), zato niso med drugimi enotami.
const EQUIV = [
  ["ml", "cm³"],
  ["l", "dm³"],
  ["ns", "kgm/s"],
  ["n/c", "v/m"],
  ["kn/c", "kv/m"],
  ["j", "nm", "ws"],
  ["pa", "n/m²"],
  ["kwh", "3,6mj"],
  ["as", "c"],
  ["1/s", "s⁻¹", "hz"],
  ["min⁻¹", "1/min"],
];
const equivalent = (a, b) => EQUIV.some((g) => g.includes(norm(a)) && g.includes(norm(b)));

// Enote, ki imajo predpone (V → mV, kV …), in predpone, ki se pri njih res uporabljajo (po vrsti).
const PREFIXED = {
  m: ["k", "c", "m", "d", "µ", "n"],
  g: ["k", "m", "µ"],
  s: ["m", "µ", "n"],
  V: ["m", "k", "M", "µ"],
  A: ["m", "k", "µ"],
  W: ["k", "M", "m"],
  J: ["k", "M", "m", "µ"],
  N: ["k", "m", "M"],
  Pa: ["k", "M", "h"],
  Hz: ["k", "M", "G"],
  Ω: ["k", "M", "m"],
  C: ["µ", "n", "m"],
  F: ["µ", "n", "p"],
  T: ["m", "µ"],
  L: ["m", "d", "c"],
  eV: ["k", "M", "G"],
  mol: ["m", "µ", "k"],
  Bq: ["k", "M", "G"],
  Wb: ["m"],
};
const PREFIXES = "kMGcmdµnph";
function siblings(unit) {
  const u = prettyUnit(unit);
  const m = /^(.*?)([²³]?)$/.exec(u);
  const body = m[1];
  const pow = m[2];
  // Najprej cela osnova (mol, Pa, eV), nato predpona + osnova (kPa, MeV, cm³).
  for (const base of Object.keys(PREFIXED).sort((a, b) => b.length - a.length)) {
    let pre = null;
    if (body === base) pre = "";
    else if (body.endsWith(base) && body.length === base.length + 1 && PREFIXES.includes(body[0])) pre = body[0];
    if (pre === null) continue;
    return [...(pre ? [""] : []), ...PREFIXED[base]].filter((p) => p !== pre).map((p) => `${p}${base}${pow}`);
  }
  return [];
}

// Deterministično naključje iz besedila naloge: ista naloga vedno pokaže iste enote.
function rng(seed) {
  let h = 2166136261;
  for (const ch of String(seed)) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
function shuffle(list, r) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

/**
 * Enote za izbiro: prava in `count − 1` drugih, razvrščene po abecedi (ne prava prva).
 * @param {string} unit prava enota naloge; brez nje prazen seznam
 * @param {{ subject?: string, seed?: string, count?: number, accepts?: (u: string) => boolean }} [o]
 *   accepts: ali preverjanje sprejme to enoto kot pravo (strežnik: checkAnswer); take niso med drugimi.
 */
export function unitChoices(unit, { subject = "", seed = "", count = 6, accepts = null } = {}) {
  if (!unit) return [];
  const right = prettyUnit(unit);
  const subj = String(subject || "").split(/[-/]/)[0].toUpperCase();
  const seen = new Set([norm(right)]);
  const ok = (u) => {
    if (seen.has(norm(u)) || equivalent(u, right)) return false;
    if (accepts && accepts(u)) return false;
    seen.add(norm(u));
    return true;
  };
  const r = rng(`${seed}|${unit}`);
  const sib = shuffle(siblings(right).filter(ok), r).slice(0, 3 - (r() < 0.5 ? 1 : 0));
  const rest = [];
  for (const u of shuffle(poolOf(subj, right).map(prettyUnit), r)) {
    if (sib.length + rest.length >= count - 1) break;
    if (ok(u)) rest.push(u);
  }
  return [right, ...sib, ...rest].sort((a, b) => a.localeCompare(b, "sl", { sensitivity: "base" }) || (a < b ? -1 : 1));
}

// Ponujena enota na koncu odgovora (»1,25 V«, »12V«, sama »V«), najdaljša; sicer "".
export function unitAtEnd(value, units = []) {
  const v = String(value ?? "").trimEnd();
  return (
    [...units]
      .sort((a, b) => b.length - a.length)
      .find((u) => {
        if (!v.endsWith(u)) return false;
        const rest = v.slice(0, -u.length);
        return rest === "" || /\s$/.test(rest) || /[\d)}\]]$/.test(rest);
      }) || ""
  );
}

// Vpis enote: zamenja ponujeno enoto na koncu (tudi »N s«, »kg m/s«) ali karkoli za zadnjo števko (»30°«);
// prazna enota jo odstrani; prazno število da samo enoto.
export function withUnit(value, unit, units = []) {
  let v = String(value ?? "").trimEnd();
  const old = unitAtEnd(v, units);
  if (old) v = v.slice(0, -old.length).trimEnd();
  else v = /[\d)}\]]/.test(v) ? v.replace(/(?<=[\d)}\]])[^\d)}\]]*$/, "").trimEnd() : "";
  if (!unit) return v;
  return v ? `${v} ${unit}` : unit;
}
