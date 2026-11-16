// Izbira enote pri številski nalogi (j, 16. 11. 2026: v »Testu predznanja« je gumb ob polju za odgovor že
// pred odgovorom pokazal pravo enoto »V« zaporne napetosti). Enota je del odgovora, zato je privzeto ni
// (prazna izbira »Enota«), ponudba pa je več enot predmeta po abecedi: prava je ena izmed njih in ni prva
// po pravilu. Brez DOM: uporabljata jo spletna plošča (pad.js) in aplikacija (mobile/src/app/practice.tsx).

// Enote, ki jih uporabljajo generatorji nalog po predmetih (server/practice/generators, 16. 11. 2026).
// Prava enota je skoraj vedno v svojem seznamu, zato med ponujenimi ne izstopa.
const POOL = {
  FIZ: "N m/s m cm J A ° V s m/s² W kJ kg Ω % Hz km/h min Pa km/s °C mm kPa K N/m nm kg/m³ eV km g W/m² nC mol mA h THz kWh dB cm³ mN µT g/cm³ µJ mg ps pF L µC mL MeV kN/C mT kW dpt MJ mJ mV MBq m² ns V/m MW ms N_s kg_m/s bar GHz t",
  KEM: "g % mol/L g/mol mol L kJ kg V mL kJ/mol mol/(L·s) kPa MJ mol/(L·min) h g/cm³ min g/L kg/mol K °C Pa s mg",
  MAT: "cm ° € m cm² cm³ dm³ % km m² dm m³ mm min °C h km/h g dm² L mm² kg dag s ml dl",
  BIO: "% kJ cm µm mm g mg mL L h min °C",
};
POOL.UNI = `${POOL.FIZ} ${POOL.KEM} MPa kN µmol/L mmol/L pm µs`;
POOL.NAR = `${POOL.FIZ} ${POOL.KEM}`;
const pool = (subject) => (POOL[subject] || `${POOL.FIZ} ${POOL.KEM} ${POOL.MAT}`).split(" ").map((u) => u.replace(/_/g, " "));
// Enoti z istim zapisom (l in L, cm^3 in cm³) štejemo za eno.
const norm = (u) => String(u).replace(/\^?2/g, "²").replace(/\^?3/g, "³").replace(/\s+/g, "").toLowerCase();

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

/**
 * Enote za izbiro: prava in `count − 1` drugih iz predmeta, razvrščene po abecedi (ne prava prva).
 * @param {string} unit prava enota naloge (task.unit); brez nje prazen seznam
 * @param {{ subject?: string, seed?: string, count?: number }} [o]
 */
export function unitChoices(unit, { subject = "", seed = "", count = 6 } = {}) {
  if (!unit) return [];
  const seen = new Set([norm(unit)]);
  const others = [];
  for (const u of pool(String(subject || "").split("-")[0].toUpperCase())) {
    if (seen.has(norm(u))) continue;
    seen.add(norm(u));
    others.push(u);
  }
  const r = rng(`${seed}|${unit}`);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  return [unit, ...others.slice(0, Math.max(0, count - 1))].sort((a, b) => a.localeCompare(b, "sl", { sensitivity: "base" }) || (a < b ? -1 : 1));
}
