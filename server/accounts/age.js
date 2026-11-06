// Preverjanje starosti ob registraciji (GDPR čl. 8).
// Kdor je mlajši od starosti digitalne privolitve v svoji državi, računa ne more ustvariti sam:
// dobi povezavo za starše (starsi.html), starš ustvari račun in ob dodajanju profila da soglasje.
// Namesto osebnega dokumenta zahtevamo datum rojstva in potrjen e-naslov starša: to je
// sorazmerno (najmanj podatkov), skeniranih dokumentov otrok pa ne zbiramo in ne hranimo.

// Starost digitalne privolitve po državah (GDPR čl. 8 in nacionalni zakoni; ZDA COPPA).
// Države, ki jih ni na seznamu: 16 (najstrožja meja v GDPR).
const MIN_AGE = {
  SI: 15, AT: 14, BE: 13, BG: 14, HR: 16, CY: 14, CZ: 15, DK: 13, EE: 13, FI: 13, FR: 15, DE: 16, GR: 15,
  HU: 16, IE: 16, IT: 14, LV: 13, LT: 14, LU: 16, MT: 13, NL: 16, PL: 16, PT: 13, RO: 16, SK: 16, ES: 14,
  SE: 13, NO: 13, IS: 13, LI: 16, GB: 13, US: 13,
  // Zakoni, ki štejejo za otroka vsakogar, mlajšega od 18 let.
  IN: 18, NG: 18, KE: 18, ZA: 18, GH: 18,
};
export const DEFAULT_MIN_AGE = 16;
export const ADULT_AGE = 18;
// Najnižja starost imetnika računa: mlajši datum je zatipkan (npr. 2025 namesto 1985), ne pravi.
export const MIN_HOLDER_AGE = 5;
// Odgovor plačilnih poti, ko račun nima datuma rojstva (star račun, »Pozneje«): vsako plačilo ga zahteva (j 2026-11-06).
// Aplikacija pokaže prevedeno besedilo birth.payMissing.
export const BIRTH_MISSING_PAY = Object.freeze({ error: "Vpiši datum rojstva v zavihku Račun.", birth_missing: true });

export const minAgeFor = (country) => MIN_AGE[String(country || "").toUpperCase()] ?? DEFAULT_MIN_AGE;

// Najstrožja meja med državo upravljavca (SI) in državama iz omrežja ter naprave,
// da otrok z angleškimi nastavitvami telefona ne dobi nižje meje.
export function minAgeOf(...countries) {
  return Math.max(...countries.filter((c) => /^[A-Z]{2}$/i.test(String(c || ""))).map(minAgeFor), minAgeFor("SI"));
}

// "YYYY-MM-DD" → { y, m, d } ali null.
export function parseBirthDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || "").trim());
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return { y, m: mo, d };
}

// »Danes« po slovenskem času (Europe/Ljubljana), ne po časovnem pasu strežnika: na 15. ali 18. rojstni dan
// je uporabnik starejši od polnoči po slovenskem času, tudi če strežnik teče v UTC.
const SI_DAY = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Ljubljana", year: "numeric", month: "2-digit", day: "2-digit" });

export function ageOn(birth, now = new Date()) {
  const b = typeof birth === "string" ? parseBirthDate(birth) : birth;
  if (!b) return null;
  const parts = Object.fromEntries(SI_DAY.formatToParts(now).map((x) => [x.type, x.value]));
  const y = Number(parts.year), m = Number(parts.month), d = Number(parts.day);
  return y - b.y - (m < b.m || (m === b.m && d < b.d) ? 1 : 0);
}
