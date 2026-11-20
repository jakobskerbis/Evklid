// Izbira enote pri številski nalogi (j, 16. 11. 2026: v »Testu predznanja« je gumb ob polju za odgovor že
// pred odgovorom pokazal pravo enoto »V« zaporne napetosti). Enota je del odgovora, zato je privzeto ni
// (prazna izbira »Enota«), ponudba pa je šest enot po abecedi: prava, 2–3 z isto osnovo in drugo predpono
// (V → mV, kV) in enote predmeta. Med ponujenimi ni enote, ki jo preverjanje sprejme kot pravo (accepts), in ne
// enote, ki je enakovredna pravi (mL in cm³, N s in kg m/s), ker bi jo preverjanje zavrnilo, čeprav je prav.
// Ponudbo sestavi strežnik (server/practice/index.js publicTask → task.units, s pravim preverjanjem); odjemalec
// jo izračuna sam le, če je ni (aplikacija brez povezave). Brez DOM. Pomožne funkcije za vpis enote v polje
// (withUnit, unitAtEnd) uporabljajo plošča (pad.js), tipkovnica (tipkovnica.js) in aplikacija Expo.

// Enote, ki jih uporabljajo generatorji nalog po predmetih (server/practice/generators, 17. 11. 2026); »_« je presledek.
// Brez ne-enot (c, D) in brez €, As, let, dni v fiziki (pregled PR 786, F); čas v besedah le, ko je prava enota čas.
const POOL = {
  FIZ: "N m/s m cm J A ° V s m/s² W kJ kg Ω % Hz km/h min Pa km/s °C mm kPa K N/m nm kg/m³ eV km g W/m² nC mol mA h THz kWh dB cm³ mN µT g/cm³ µJ mg ps pF L µC mL MeV kN/C mT kW dpt MJ mJ mV MBq m² ns V/m MW ms N_s kg_m/s bar GHz t µF N_m min⁻¹ MW/m² dm dm² dm³",
  KEM: "g % mol/L g/mol mol L kJ kg V mL kJ/mol mol/(L·s) kPa MJ mol/(L·min) h g/cm³ min g/L kg/mol K °C Pa s mg mmol µmol",
  MAT: "cm ° € m cm² cm³ dm³ % km m² dm m³ mm min °C h km/h g dm² L mm² kg dag s ml dl t dni let ur",
  BIO: "% kJ cm µm mm g mg mL L h min °C",
  DENAR: "€ % let dni mesecev tednov ur",
  CAS: "s min h dni let ur tednov mesecev ms",
};
POOL.UNI = `${POOL.FIZ} ${POOL.KEM} MPa kN µmol/L mmol/L pm µs kNm kg/h µmol/min`;
POOL.NAR = `${POOL.FIZ} ${POOL.KEM}`;
const CAS = /^(?:min|h|dni|let|ur|tednov|mesecev|leto|leti|dan|dneva)$/;
const poolOf = (subject, unit) => {
  if (/^(?:€|EUR|\$)$/.test(unit)) return POOL.DENAR.split(" ");
  const base = POOL[subject] || `${POOL.FIZ} ${POOL.KEM} ${POOL.MAT}`;
  return `${base}${CAS.test(unit) ? ` ${POOL.CAS}` : ""}`.split(" ").map((u) => u.replace(/_/g, " "));
};

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

// Enote, ki imajo predpone, in predpone po ravni (OŠ: brez µ, n, p, G; pregled PR 786, B). Pri ² in ³ le mm, cm,
// dm, m, km.
const PREFIXED = {
  m: ["k", "c", "m", "d", "µ", "n"],
  g: ["k", "m", "µ"],
  s: ["m", "µ", "n"],
  V: ["m", "k", "M"],
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
const OS_PREFIX = ["k", "c", "m", "d", "h", "M"];
const POW_PREFIX = ["k", "c", "m", "d"];
// Ali naloga je za osnovno šolo (OŠ: MAT-OS-8/…, NAR-OS-6/…).
const levelOf = (subject) => (/(?:^|[-/])OS(?:[-/]|$)/.test(String(subject)) ? "OS" : "SS");
const PREFIXES = "kMGcmdµnph";
// Enota → { base, pre, pow } za enote s predpono (V, mV, cm³) ali null.
function parseSi(unit) {
  const m = /^(.*?)([²³]?)$/.exec(prettyUnit(unit));
  const body = m[1];
  for (const base of Object.keys(PREFIXED).sort((a, b) => b.length - a.length)) {
    if (body === base) return { base, pre: "", pow: m[2] };
    if (body.endsWith(base) && body.length === base.length + 1 && PREFIXES.includes(body[0])) return { base, pre: body[0], pow: m[2] };
  }
  return null;
}
const familyKey = (u) => {
  const s = parseSi(u);
  return s ? `${s.base}${s.pow}` : `=${norm(u)}`;
};
// Enote iste družine (ista osnova in potenca, druga predpona), primerne za raven.
function family(base, pow, level) {
  let pre = PREFIXED[base] || [];
  if (pow) pre = base === "m" ? POW_PREFIX : [];
  if (level === "OS") pre = pre.filter((p) => OS_PREFIX.includes(p));
  return ["", ...pre].map((p) => `${p}${base}${pow}`);
}
// Druge osnove za vabo (druga količina, tudi druga črka osnove), po predmetih.
const DECOY = {
  FIZ: ["m", "g", "V", "A", "W", "J", "N", "Pa", "Hz", "s"],
  KEM: ["g", "L", "mol", "Pa", "J"],
  MAT: ["m", "g", "L"],
  BIO: ["m", "g", "L"],
};

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
 * Če ima prava enota predpone: 2 enoti iste družine (V → mV, kV) in vaba, enako velika družina druge količine
 * (g, kg, mg), da velikost družine ne izda odgovora (pregled PR 786, B). Sicer posamezne enote predmeta, največ
 * ena iz vsake družine.
 * @param {string} unit prava enota naloge; brez nje prazen seznam
 * @param {{ subject?: string, seed?: string, count?: number, accepts?: (u: string) => boolean }} [o]
 *   subject: predmet ali id teme (FIZ-SS-4/…: predmet in raven); accepts: ali preverjanje sprejme to enoto kot pravo.
 */
export function unitChoices(unit, { subject = "", seed = "", count = 6, accepts = null } = {}) {
  if (!unit) return [];
  const right = prettyUnit(unit);
  const subj = String(subject || "").split(/[-/]/)[0].toUpperCase();
  const level = levelOf(subject);
  const seen = new Set([norm(right)]);
  const ok = (u) => {
    if (seen.has(norm(u)) || equivalent(u, right)) return false;
    if (accepts && accepts(u)) return false;
    seen.add(norm(u));
    return true;
  };
  const r = rng(`${seed}|${unit}`);
  const out = [right];
  const si = parseSi(right);
  const famSize = 3;
  if (si) {
    const lower = new Set([norm(right)]);
    const sib = shuffle(family(si.base, si.pow, level), r)
      .filter((u) => !lower.has(norm(u)) && !equivalent(u, right) && !(accepts && accepts(u)) && lower.add(norm(u)))
      .slice(0, famSize - 1);
    // Premalo enot iste družine (s in ms v OŠ): brez družin, sicer bi bila prava edina dvojica.
    if (sib.length === famSize - 1) {
      sib.forEach((u) => ok(u) && out.push(u));
      // Vaba: druga osnova (druga črka), enako velika družina.
      for (const base of shuffle([...(DECOY[subj] || DECOY.FIZ)], r)) {
        // Druga količina: ne ista črka osnove, ne prostornina ob prostornini (L ob cm³).
        if (base[0] === si.base[0] || (base === "L" && si.base === "m" && si.pow === "³") || (si.base === "L" && base === "m")) continue;
        // mW in MW sta za preverjanje lahko isto (velikost črke): iz vsake take dvojice le ena.
        const lower = new Set();
        const cand = shuffle(family(base, "", level), r).filter((u) => {
          if (seen.has(norm(u)) || lower.has(norm(u)) || equivalent(u, right) || (accepts && accepts(u))) return false;
          lower.add(norm(u));
          return true;
        });
        if (cand.length < famSize) continue;
        cand.slice(0, famSize).forEach((u) => ok(u) && out.push(u));
        break;
      }
    }
  }
  // Dopolni s posameznimi enotami predmeta, največ ena iz vsake družine (ne nova družina, ki bi izstopala).
  const fams = new Set(out.map(familyKey));
  // Prava enota je čas v besedah (let, dni): najprej druge enote časa, da ne izstopa.
  const pool = poolOf(subj, right).map(prettyUnit);
  const time = CAS.test(right) ? shuffle(POOL.CAS.split(" "), r) : [];
  for (const u of [...time, ...shuffle(pool, r)]) {
    if (out.length >= count) break;
    const k = familyKey(u);
    if (fams.has(k)) continue;
    if (level === "OS" && /[µnpG]/.test(parseSi(u)?.pre || "")) continue;
    if (ok(u)) {
      out.push(u);
      fams.add(k);
    }
  }
  return out.sort((a, b) => a.localeCompare(b, "sl", { sensitivity: "base" }) || (a < b ? -1 : 1));
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
  else {
    // Število na začetku (tudi »12 300«, »3/4«, »2 · 10^{-3}«, »4\pi«, »2π«); vse za njim je stara enota (»30°«, »5 cm^3«).
    const m = /^\s*[+\-−]?\s*(?:\d[\d\s.,]*\d|\d)(?:\s*\/\s*\d+)?(?:\s*(?:·|\\cdot|\*|×)\s*10\s*\^\s*\{?\s*[+\-−]?\d+\s*\}?)?(?:\s*(?:π|\\pi(?![a-zA-Z])))?/.exec(v);
    v = m ? m[0].trim() : "";
  }
  if (!unit) return v;
  return v ? `${v} ${unit}` : unit;
}

// ---------- paket za vaje brez povezave (public/offline.js, mobile/src/lib/offline.ts) ----------
// Zastarel paket (isStalePack) prepozna offline.js sam: ta modul ni del prvega odprtja Učne poti.
export { isStalePack } from "./offline.js";

// Naloga iz paketa za prikaz: hasUnit ?? !!unit (stari paket); ponudbo enot izračuna odjemalec, kadar je ni;
// prava enota (»unit«) ne gre naprej. check: checkAnswer (iste enote, kot jih sprejme preverjanje, ne ponudi).
export function offlineTask(task, answer, check = null) {
  if (!task) return task;
  const { unit, ...rest } = task;
  const right = answer?.unit || unit || null;
  const hasUnit = task.hasUnit ?? !!right;
  if (!hasUnit || Array.isArray(task.units)) return { ...rest, hasUnit };
  const accepts = check && answer
    ? (u) => {
        try {
          return check(answer, `1 ${u}`).kind !== "unit";
        } catch {
          return true; // v dvomu enote ne ponudimo
        }
      }
    : null;
  return { ...rest, hasUnit, units: right ? unitChoices(right, { subject: task.topicId || "", seed: task.text || "", accepts }) : [] };
}
