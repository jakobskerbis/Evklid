// Paketi, cene in pravica do polnega dostopa.
import "../env.js";
import { BRAND, LEGACY } from "../brand.js";
import { STOPNJE, rang } from "../../public/stopnja.js";

export const TRIAL_DAYS = 7;
export const REFERRAL_DAYS = 30;
export const MAX_CHILDREN = 4;
export const PRIVACY_VERSION = "2026-10-29";

// Cene v centih (z DDV). lookup_key poveže ceno v Stripu s paketom.
// Cene po stopnjah (j 2026-11-01, »Predlog cenika«): cena velja za profil in sledi stopnji profila
// (public/stopnja.js): OŠ 9,99 € na mesec ali 89 € na leto (nespremenjeno), SŠ 12,99 / 119 €,
// faks 16,99 / 149 €. Družina (2–4 profili OŠ ali SŠ) 17,99 / 159 € namesto »2 otroka« (15,99 / 139 €),
// Družina s študentom (2–4 profili, tudi faks) 24,99 / 219 €. Letna cena ≈ 9 mesečnih plačil.
// Paket OŠ obdrži stari lookup_key (<slug>_1_month), da obstoječe naročnine ostanejo pri isti ceni v Stripu.
// Ob spremembi zneska Stripe sam ustvari novo ceno in staro arhivira (glej ensurePrices); obstoječe
// naročnine ostanejo pri stari ceni. Naročnina odpre svojo stopnjo in vse nižje (server/placila/pravice.js).
export const LEVEL_PRICES = {
  OS: { month: 999, year: 8900 },
  SS: { month: 1299, year: 11900 },
  FAKS: { month: 1699, year: 14900 },
};
export const FAMILY_PRICES = {
  druzina: { month: 1799, year: 15900 },
  druzina_student: { month: 2499, year: 21900 },
};
// Kratka oznaka stopnje v nazivu paketa (Stripe, zavihek Račun).
export const LEVEL_LABEL = { OS: "OŠ", SS: "SŠ", FAKS: "Faks" };
const LEVEL_KEY = { OS: "1", SS: "ss", FAKS: "faks" };
const PERIOD = (interval, level) => (interval === "month" ? "mesečno" : level === "FAKS" ? "študijsko leto" : "šolsko leto");
export const PLANS = [
  ...STOPNJE.flatMap((level) =>
    ["month", "year"].map((interval) => ({
      key: `${BRAND.slug}_${LEVEL_KEY[level]}_${interval}`,
      seats: 1,
      interval,
      amount: LEVEL_PRICES[level][interval],
      level,
      label: `${LEVEL_LABEL[level]}, ${PERIOD(interval, level)}`,
    })),
  ),
  ...[
    ["druzina", "SS", "Družina"],
    ["druzina_student", "FAKS", "Družina s študentom"],
  ].flatMap(([id, level, name]) =>
    ["month", "year"].map((interval) => ({
      key: `${BRAND.slug}_${id}_${interval}`,
      seats: MAX_CHILDREN,
      interval,
      amount: FAMILY_PRICES[id][interval],
      level,
      family: true,
      label: `${name}, ${PERIOD(interval, "OS")}`,
    })),
  ),
];
// Stari paket »2 otroka« (do 2026-11-04): ni več v ponudbi. Obstoječe naročnine ostanejo pri svoji ceni in
// odprejo vse stopnje do naslednjega podaljšanja; nato preidejo na Družino (ali Družino s študentom, če je
// med profili študent), z e-pošto 30 dni prej (server/accounts/billing.js, levelChanges).
export const LEGACY_PLANS = [
  { key: `${BRAND.slug}_2_month`, seats: 2, interval: "month", amount: 1599, label: "2 otroka, mesečno", level: "FAKS", family: true, legacy: true },
  { key: `${BRAND.slug}_2_year`, seats: 2, interval: "year", amount: 13900, label: "2 otroka, šolsko leto", level: "FAKS", family: true, legacy: true },
];
export const levelPlanFor = (level, interval) => PLANS.find((p) => !p.family && p.level === level && p.interval === interval) || null;
export const familyPlanFor = (withStudent, interval) => PLANS.find((p) => p.family && p.level === (withStudent ? "FAKS" : "SS") && p.interval === interval) || null;
// V trgovinah z aplikacijami (App Store, Google Play) je vsak paket 2 € dražji kot na spletu (j 2026-11-01);
// splet je privzet. Ceni v trgovini se vpišeta v App Store Connect in Google Play Console (server/mobile).
export const STORE_MARKUP_CENTS = 200;
export const storeAmount = (plan) => plan.amount + STORE_MARKUP_CENTS;

// ---------- regijske cene (potrdil j, 2026-10-28) ----------
// Cene v lokalni valuti: [1 otrok mesečno, 1 otrok šolsko leto, 2 otroka mesečno,
// 2 otroka šolsko leto] v glavnih enotah valute (rupije, naire …).
// Merilo: ~4–5 € na mesec za enega otroka, da pokrijejo strošek AI na aktivnega učenca
// (1–2 €), ki s kupno močjo ne pade. Razmerja med paketi so kot pri cenah v evrih.
// Slovenija in ostale države ostanejo pri cenah v evrih zgoraj.
export const REGIONAL_DRAFT = false;
export const REGIONAL_PRICES = {
  INR: { countries: ["IN"], prices: [399, 3499, 649, 5599] },
  PKR: { countries: ["PK"], prices: [1399, 11999, 2199, 18999] },
  BDT: { countries: ["BD"], prices: [549, 4799, 899, 7699] },
  NGN: { countries: ["NG"], prices: [7500, 64000, 12000, 103000] },
  GHS: { countries: ["GH"], prices: [59, 499, 95, 799] },
  KES: { countries: ["KE"], prices: [649, 5599, 1049, 8999] },
  ZAR: { countries: ["ZA"], prices: [89, 779, 149, 1249] },
  EGP: { countries: ["EG"], prices: [249, 2199, 399, 3499] },
  PHP: { countries: ["PH"], prices: [279, 2399, 449, 3899] },
  IDR: { countries: ["ID"], prices: [79000, 699000, 129000, 1099000] },
  VND: { countries: ["VN"], prices: [129000, 1099000, 199000, 1799000] },
  XOF: { countries: ["SN", "CI", "ML", "BF", "NE", "BJ", "TG", "GW"], prices: [2900, 25000, 4700, 40000] },
  // Ostale države z nižjimi dohodki v Afriki in Aziji: ena cena v dolarjih.
  USD: {
    countries: ["NP", "LK", "TZ", "UG", "RW", "ET", "ZM", "ZW", "MW", "MZ", "CM", "CD", "CG", "GA", "TD", "GN", "MG", "SL", "LR", "GM", "SD", "SS", "SO", "MM", "KH", "LA", "AF", "TJ", "KG", "UZ", "MN", "BT", "MV", "LS", "SZ", "BW", "NA", "AO"],
    prices: [4.99, 42.99, 7.99, 68.99],
  },
};
// Valute brez decimalk v Stripu (znesek je v celih enotah).
const ZERO_DECIMAL = new Set(["VND", "XOF", "XAF", "UGX", "RWF", "JPY", "KRW", "GNF", "MGA"]);
const SHAPE = [
  [1, "month", "1 otrok, mesečno"],
  [1, "year", "1 otrok, šolsko leto"],
  [2, "month", "2 otroka, mesečno"],
  [2, "year", "2 otroka, šolsko leto"],
];
// Znesek v najmanjših enotah (centi, paise …), kot ga pričakuje Stripe.
export const minorUnits = (currency, major) => Math.round(major * (ZERO_DECIMAL.has(currency) ? 1 : 100));
export const currencyDecimals = (currency) => (ZERO_DECIMAL.has(currency) ? 0 : 2);

export const currencyForCountry = (country) => {
  const c = String(country || "").toUpperCase();
  return Object.entries(REGIONAL_PRICES).find(([, v]) => v.countries.includes(c))?.[0] || "EUR";
};

// Paketi v valuti: EUR = PLANS (lookup_key brez pripone), drugje lookup_key s pripono valute.
export function plansFor(currency = "EUR") {
  const r = REGIONAL_PRICES[currency];
  if (!r) return PLANS.map((p) => ({ ...p, currency: "EUR" }));
  // Regijske cene so ena cena za vse stopnje (nespremenjeno): level null = vse stopnje.
  return SHAPE.map(([seats, interval, label], i) => ({
    key: `${BRAND.slug}_${seats}_${interval}_${currency.toLowerCase()}`,
    seats,
    interval,
    amount: minorUnits(currency, r.prices[i]),
    label,
    currency,
    level: null,
  }));
}
// ---------- Evklid Osebno za učence s šolsko licenco (j 2026-10-30, načrt »Šolska licenca in Osebno«) ----------
// 5,99 € na mesec ali 49 € na šolsko leto za en profil z veljavno šolsko licenco (šola že plača šolske
// predmete, Osebno doda vse ostalo). Samo v evrih. Ni v portalu za preklop paketa (glej stripe.js), da
// redne naročnine ne morejo preiti na nižjo ceno. Ob izteku licence naročnina teče naprej po tej ceni.
export const SCHOOL_PLANS = [
  { key: `${BRAND.slug}_sola_month`, seats: 1, interval: "month", amount: 599, label: "Osebno ob šolski licenci, mesečno", school: true, currency: "EUR" },
  { key: `${BRAND.slug}_sola_year`, seats: 1, interval: "year", amount: 4900, label: "Osebno ob šolski licenci, šolsko leto", school: true, currency: "EUR" },
];
export const schoolPlanFor = (interval) => SCHOOL_PLANS.find((p) => p.interval === interval) || null;

// Darilna koda: eno leto za en profil izbrane stopnje, enkratno plačilo po letni ceni stopnje
// (j 2026-11-01: 89 / 119 / 149 € namesto 49 €; server/placila/darila.js).
export const giftFor = (level = "OS") => {
  const l = LEVEL_PRICES[level] ? level : "OS";
  return { amount: LEVEL_PRICES[l].year, days: 365, currency: "EUR", level: l, label: `Darilna koda: 1 leto ${LEVEL_LABEL[l]}` };
};
export const GIFT = giftFor("OS");
export const GIFT_PRICES = Object.fromEntries(STOPNJE.map((l) => [l, giftFor(l).amount]));

export const ALL_PLANS = [...PLANS.map((p) => ({ ...p, currency: "EUR" })), ...LEGACY_PLANS.map((p) => ({ ...p, currency: "EUR" })), ...SCHOOL_PLANS, ...Object.keys(REGIONAL_PRICES).flatMap(plansFor)];

// Cene, ustvarjene pod prejšnjim imenom aplikacije (brand.json → legacy), imajo v Stripu lookup_key »<staro>_…«.
const currentKey = (key) => LEGACY.reduce((k, l) => (k.startsWith(`${l.slug}_`) ? `${BRAND.slug}_${k.slice(l.slug.length + 1)}` : k), String(key ?? ""));
export const planByKey = (key) => ALL_PLANS.find((p) => p.key === currentKey(key)) || null;
export const isSchoolPlan = (key) => !!planByKey(key)?.school;
// Paket za nakup: v evrih 1 profil po stopnji profila, 2 ali več profilov Družina (s študentom, če je stopnja
// faks); v regijskih valutah kot doslej po številu otrok (1 ali 2).
export function planFor(seats, interval, currency = "EUR", level = "OS") {
  if (!(seats >= 1)) return null; // manjkajoče ali neveljavno število profilov: 400 pri nakupu
  if (currency === "EUR" || !REGIONAL_PRICES[currency]) {
    if (currency !== "EUR") return null;
    return seats >= 2 ? familyPlanFor(level === "FAKS", interval) : levelPlanFor(STOPNJE.includes(level) ? level : "OS", interval);
  }
  return plansFor(currency).find((p) => p.seats === (seats >= 2 ? 2 : 1) && p.interval === interval) || null;
}
// Mesečni par paketa (isti paket, mesečno; ključ <slug>_<paket>_month[_valuta]).
export const monthlyOf = (plan) => (!plan ? null : plan.interval === "month" ? plan : planByKey(plan.key.replace(/_year(?=$|_)/, "_month")) || plan);
// Mesečna cena paketa za nakup.
export const monthlyAmount = (seats, currency = "EUR", level = "OS") => planFor(seats, "month", currency, level)?.amount ?? LEVEL_PRICES.OS.month;
// Najvišja stopnja, ki jo paket odpre (null pri regijskih cenah, šolski ceni in neznanem paketu = vse stopnje).
export const planLevel = (plan) => (plan && STOPNJE.includes(plan.level) && !plan.school ? plan.level : null);
// Ali paket odpre stopnjo: svojo in vse nižje (j 2026-11-01).
export const opensLevel = (open, level) => !open || rang(level) <= rang(open);

export const freeDailyQuestions = () => {
  const v = Number(process.env.EVKLID_FREE_DAILY_QUESTIONS);
  return Number.isFinite(v) && process.env.EVKLID_FREE_DAILY_QUESTIONS ? v : 10;
};

// Brezplačni paket ne sme stati več, kot določi skrbnik (v dolarjih, kot zaračunava Claude API; 0 = brez omejitve).
// Skupaj za vse brezplačne učence na mesec (10 $ ≈ 8,7 €) in na enega brezplačnega učenca na mesec.
// 10 vprašanj na dan s Haikujem je največ ~0,14 $ na mesec, zato meja na učenca ujame le izjeme (veliko fotografij).
const envUsd = (k, d) => {
  const v = Number(process.env[k]);
  return process.env[k] !== undefined && process.env[k] !== "" && Number.isFinite(v) ? v : d;
};
export const freeMonthlyPoolUsd = () => envUsd("EVKLID_FREE_POOL_USD", 10);
export const freeStudentMonthlyUsd = () => envUsd("EVKLID_FREE_STUDENT_USD", 0.2);

// ---------- paketi pred testom (enkratno plačilo, j 2026-10-30) ----------
// Poln dostop za en profil za 7, 14 ali 30 dni, brez naročnine. Cene so 30 % nad prvim predlogom
// (3,99 / 5,99 / 8,99 €), kot je odločil j. aiUsd = največja poraba AI v času paketa; ko je porabljena,
// profil do konca paketa dela kot v brezplačnem paketu. Zaenkrat samo v evrih.
export const PASSES = [
  { days: 7, amount: 519, aiUsd: 0.75, label: "Kratka priprava" },
  { days: 14, amount: 779, aiUsd: 1.5, label: "Temeljita priprava" },
  { days: 30, amount: 1169, aiUsd: 3, label: "Velika priprava" },
].map((p) => ({ ...p, key: `${BRAND.slug}_pass_${p.days}`, currency: "EUR" }));
// Paketi pred testom za faks (j 2026-11-01): 6,99 / 9,99 / 14,99 €, meja AI 1,5-krat višja.
export const FAKS_PASSES = [
  { days: 7, amount: 699 },
  { days: 14, amount: 999 },
  { days: 30, amount: 1499 },
].map((p) => {
  const base = PASSES.find((x) => x.days === p.days);
  return { ...base, ...p, aiUsd: base.aiUsd * 1.5, key: `${BRAND.slug}_pass_faks_${p.days}`, level: "FAKS" };
});
// Paketi za stopnjo profila: faks svoje, OŠ in SŠ kot doslej.
export const passesFor = (level) => (level === "FAKS" ? FAKS_PASSES : PASSES);
export const passByDays = (days, level = "OS") => passesFor(level).find((p) => p.days === Number(days)) || null;
export const passByKey = (key) => [...PASSES, ...FAKS_PASSES].find((p) => p.key === key) || null;
// Stopnja, ki jo paket pred testom odpre: faks vse, paket OŠ/SŠ (ista cena) OŠ in SŠ. Paketi, kupljeni pred
// cenami po stopnjah (level prazen), odprejo vse stopnje kot ob nakupu (null), da študent ne izgubi dostopa.
export const passLevel = (pass) => (pass?.level === "FAKS" ? "FAKS" : pass?.level ? "SS" : null);
// Najmanjši paket, ki pokrije čas do dneva po testu (test čez daysLeft dni; 0 = danes).
export const passForDaysLeft = (daysLeft, level = "OS") => passesFor(level).find((p) => p.days >= daysLeft + 1) || null;

// ---------- poraba AI v naročnini (j 2026-11-01, »Poraba AI v naročnini«) ----------
// Zajamčeno na profil na mesec (v $, kot zaračunava Claude API): OŠ 2 $, SŠ 3 $, faks 5 $. Ko je
// porabljeno, inštruktor odgovarja naprej s hitrim modelom do dnevne meje vprašanj (60 / 60 / 100).
// Deleži naročnikov imajo prednost pred brezplačnimi v skupnem mesečnem proračunu (server/usage.js).
export const AI_GUARANTEE_USD = { OS: 2, SS: 3, FAKS: 5 };
export const guaranteeUsd = (level) => {
  const v = Number(process.env[`EVKLID_AI_GUARANTEE_${level}_USD`]);
  return process.env[`EVKLID_AI_GUARANTEE_${level}_USD`] && Number.isFinite(v) && v >= 0 ? v : AI_GUARANTEE_USD[level] ?? AI_GUARANTEE_USD.OS;
};
// Učencu in staršu pokažemo porabo kot število preostalih podrobnih razlag (nikoli € ali $).
// Ocena za eno podrobno razlago (zmogljivejši model, kratka zgodovina); zaokroženo navzdol.
export const usdPerExplanation = () => {
  const v = Number(process.env.EVKLID_USD_PER_EXPLANATION);
  return process.env.EVKLID_USD_PER_EXPLANATION && Number.isFinite(v) && v > 0 ? v : 0.04;
};
export const explanationsFor = (usd) => Math.max(0, Math.floor((usd || 0) / usdPerExplanation() + 1e-9));
// Obvestilo pri 80 %, opomba pri 100 % (inštruktor nadaljuje v hitrem načinu).
export const ALLOWANCE_NOTICE = 0.8;
// Razmerje z majhno toleranco: 0,04 / 0,05 je v plavajoči vejici malo pod 0,8, prikazano pa je »80 %«.
export const allowanceStage = (spent, allowance) => {
  if (!(allowance > 0)) return null;
  const r = spent / allowance + 1e-9;
  return r >= 1 ? "out" : r >= ALLOWANCE_NOTICE ? "low" : "ok";
};

// Neuspelo plačilo: poln dostop ostane še GRACE_DAYS dni, nato velja brezplačni paket.
export const GRACE_DAYS = 7;

const PAID = new Set(["active", "trialing", "past_due"]);
const later = (iso, now) => iso && Date.parse(iso.replace(" ", "T") + (iso.includes("Z") ? "" : "Z")) > now;

// Naročnina daje poln dostop (status past_due samo GRACE_DAYS dni od prvega neuspelega plačila).
export function paidActive(parent, now = Date.now()) {
  if (!parent?.sub_status || !PAID.has(parent.sub_status)) return false;
  if (parent.sub_status !== "past_due" || !parent.past_due_since) return true;
  return later(new Date(Date.parse(parent.past_due_since) + GRACE_DAYS * 86400000).toISOString(), now);
}

// Kaj starš trenutno ima: paid (naročnina), promo (koda), trial (preizkus), gift (darilna koda),
// bonus (mesec iz priporočila) ali free.
export function accessFor(parent, now = Date.now(), promoSeats = 1) {
  if (paidActive(parent, now)) {
    // level: najvišja stopnja, ki jo naročnina odpre (null = vse stopnje: regijske cene, šolska cena, neznan paket).
    return { tier: "paid", seats: parent.sub_seats || 1, until: parent.sub_period_end, level: planLevel(planByKey(parent.sub_plan)) };
  }
  // Aktivacijska koda; med 7-dnevnim preizkusom ostaneta 2 profila.
  if (later(parent.promo_until, now)) {
    const seats = later(parent.trial_ends_at, now) ? Math.max(2, promoSeats) : promoSeats;
    return { tier: "promo", seats, until: parent.promo_until };
  }
  if (later(parent.trial_ends_at, now)) return { tier: "trial", seats: 2, until: parent.trial_ends_at };
  // Darilna koda (server/placila/darila.js): eno leto za en profil.
  // Stopnja darila (gift_level); stara darila (49 €, pred 2026-11-04) odprejo vse stopnje.
  if (later(parent.gift_until, now)) return { tier: "gift", seats: 1, until: parent.gift_until, level: STOPNJE.includes(parent.gift_level) ? parent.gift_level : null };
  if (later(parent.bonus_until, now)) return { tier: "bonus", seats: 1, until: parent.bonus_until };
  return { tier: "free", seats: 0, until: null };
}

// Otrok ima poln dostop, če je med prvimi »seats« otroki starša.
export function isPremiumChild(access, childIds, studentId) {
  if (!access.seats) return false;
  return [...childIds].sort((a, b) => a - b).slice(0, access.seats).includes(studentId);
}

export const isoIn = (days, from = Date.now()) => new Date(from + days * 86400000).toISOString();
