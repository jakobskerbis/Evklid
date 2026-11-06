// Meja inštruktorja za pilot in lastnika (j 2026-11-06 12:14).
// - Član pilota: potrjen e-naslov v EVKLID_PILOT_EMAILS, do vključno EVKLID_PILOT_DO (privzeto 2026-12-15, po
//   slovenskem času). Do konca pilota ima VSAK profil računa (j 2026-11-06 17:0x) brezplačno mejo PLAČANEGA paketa
//   svoje stopnje (stopnja na začetku meseca, strošek AI krije j), potem samodejno spet svoj običajni paket.
// - Lastnik: potrjen e-naslov v EVKLID_ADMIN_EMAILS. Inštruktor brez meje (brez zaustavitve), poraba se še vedno
//   zapiše (server/usage.js log), poročilo marže jo prikaže ločeno (server/advice.js).
// Brez potrjenega e-naslova ne velja nič od tega: sicer bi se kdorkoli registriral s tujim naslovom.

export const PILOT_DO_DEFAULT = "2026-12-15";
// Največ profilov na računu člana pilota, dokler pilot traja (j 2026-11-06 18:3x). Po koncu pilota obstoječi profili
// ostanejo (nič se ne izbriše), novih pa ni več kot po paketu.
export const PILOT_PROFILES = 4;

// Seznam e-naslovov iz okolja (EVKLID_ADMIN_EMAILS, EVKLID_PILOT_EMAILS): ločila vejica, podpičje ali presledek,
// male črke. Edini razčlenjevalnik za oba seznama (pregled #477 B3: skrbnik in »brez meje« se morata ujemati).
export const emailList = (v) =>
  String(v || "")
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
const list = emailList;

const verifiedEmail = (p) => (p && !p.is_guest && p.email_verified_at ? String(p.email || "").trim().toLowerCase() : "");

// Odmik Europe/Ljubljana od UTC (ms) ob trenutku t (CET +1 h, CEST +2 h).
function ljubljanaOffsetMs(t) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Ljubljana", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      .formatToParts(new Date(t))
      .map((x) => [x.type, x.value]),
  );
  return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second) - t;
}
// Polnoč (začetek dneva) po slovenskem času za dan "YYYY-MM-DD" (ms).
function ljubljanaMidnight(day) {
  const utc = Date.parse(`${day}T00:00:00Z`);
  return utc - ljubljanaOffsetMs(utc - ljubljanaOffsetMs(utc));
}
const MAX_AHEAD_MS = 366 * 86400000;
const warned = new Set();

// Konec pilota (ms): polnoč po slovenskem času na koncu dneva EVKLID_PILOT_DO (pozimi in poleti, pregled #477 B4).
// Neobstoječ dan (2026-11-31), napačen zapis ali datum več kot eno leto naprej (tipkarska napaka v letu): privzeti
// datum in opozorilo v dnevniku (pregled #477 B5), nikoli pilot brez konca.
export function pilotEndMs(env = process.env, now = Date.now()) {
  const raw = String(env.EVKLID_PILOT_DO || "").trim();
  let day = PILOT_DO_DEFAULT;
  if (raw) {
    const t = Date.parse(`${raw}T00:00:00Z`);
    const real = /^\d{4}-\d{2}-\d{2}$/.test(raw) && Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === raw;
    if (real && t - now <= MAX_AHEAD_MS) day = raw;
    else if (!warned.has(raw)) {
      warned.add(raw);
      console.warn(`[evklid] EVKLID_PILOT_DO="${raw}" ni veljaven datum (ali je več kot eno leto naprej); velja ${PILOT_DO_DEFAULT}.`);
    }
  }
  const next = new Date(Date.parse(`${day}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
  return ljubljanaMidnight(next);
}

// Ali je e-naslov na seznamu pilota ali skrbnikov (ne glede na potrditev ali datum): za takšne naslove strežnik
// nikoli ne vrne razvojne povezave za potrditev ali ponastavitev (pregled #477 A: devLinks).
export function privilegedEmail(email, env = process.env) {
  const e = String(email || "").trim().toLowerCase();
  return !!e && (list(env.EVKLID_PILOT_EMAILS).includes(e) || list(env.EVKLID_ADMIN_EMAILS).includes(e));
}

// Ali je račun (vrstica parents) član pilota ob času now.
export function isPilotParent(p, now = Date.now(), env = process.env) {
  const email = verifiedEmail(p);
  return !!email && now < pilotEndMs(env) && list(env.EVKLID_PILOT_EMAILS).includes(email);
}

// Ali je račun lastnik (skrbnik po EVKLID_ADMIN_EMAILS s potrjenim e-naslovom). Zastavica is_admin v bazi sama
// ne zadošča (j 2026-11-06: skrbniški račun brez potrjenega e-naslova ne dobi izjeme).
export function isOwnerParent(p, env = process.env) {
  const email = verifiedEmail(p);
  return !!email && list(env.EVKLID_ADMIN_EMAILS).includes(email);
}
