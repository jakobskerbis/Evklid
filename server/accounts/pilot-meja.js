// Meja inštruktorja za pilot in lastnika (j 2026-11-06 12:14).
// - Član pilota: potrjen e-naslov v EVKLID_PILOT_EMAILS, do vključno EVKLID_PILOT_DO (privzeto 2026-12-15, po
//   slovenskem času). Do konca pilota ima brezplačno mejo PLAČANEGA paketa svoje stopnje (strošek AI krije j),
//   potem samodejno spet svoj običajni paket.
// - Lastnik: potrjen e-naslov v EVKLID_ADMIN_EMAILS. Inštruktor brez meje (brez zaustavitve), poraba se še vedno
//   zapiše (server/usage.js log), poročilo marže jo prikaže ločeno (server/advice.js).
// Brez potrjenega e-naslova ne velja nič od tega: sicer bi se kdorkoli registriral s tujim naslovom.

export const PILOT_DO_DEFAULT = "2026-12-15";

const list = (v) =>
  String(v || "")
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

const verifiedEmail = (p) => (p && !p.is_guest && p.email_verified_at ? String(p.email || "").trim().toLowerCase() : "");

// Konec pilota (ms): konec dneva EVKLID_PILOT_DO po slovenskem času (pozimi UTC+1; previdno do 23:00 UTC).
// Napačen zapis datuma: privzeti datum (ne pilot brez konca).
export function pilotEndMs(env = process.env) {
  const raw = String(env.EVKLID_PILOT_DO || "").trim();
  const day = /^\d{4}-\d{2}-\d{2}$/.test(raw) && Number.isFinite(Date.parse(`${raw}T00:00:00Z`)) ? raw : PILOT_DO_DEFAULT;
  return Date.parse(`${day}T23:00:00Z`);
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
