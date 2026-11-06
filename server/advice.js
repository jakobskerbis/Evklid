// Predlog mesečne meje AI in cene za skrbnika (števec porabe, public/usage-meter.js).
// Najprej kakovost (učenci naj meje ne čutijo), nato dobiček. Predlog nič ne spremeni sam:
// mejo in ceno spremeni skrbnik (meja: EVKLID_STUDENT_MONTHLY_USD, cena: server/accounts/plans.js).

import "./env.js";
import { LIMITS, EUR_PER_USD } from "./usage.js";
import { PLANS, LEVEL_PRICES, LEVEL_LABEL, guaranteeUsd, VAT_RATE } from "./accounts/plans.js";
import { STOPNJE, stageCodeSql, STAGE_CODE } from "../public/stopnja.js";

const VAT = VAT_RATE; // DDV v Sloveniji (server/accounts/plans.js)
const STRIPE = (eur) => eur * 0.015 + 0.25; // provizija za evropske kartice
const TARGET_PROFIT_EUR = 6; // cilj: vsaj ~6 € na naročnino na mesec ostane nam
const MIN_PROFIT_EUR = 4; // tudi učenec, ki porabi vso mejo, prinese vsaj toliko
const MIN_STUDENTS = 5; // manj aktivnih učencev = premalo podatkov za mejo
const MIN_TRIALS = 10; // manj končanih preizkusov = premalo podatkov za ceno
const r2 = (x) => Math.round(x * 100) / 100;
const fmt = (x) => r2(x).toLocaleString("sl-SI", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Kaj od mesečne naročnine za enega otroka ostane po DDV in Stripu.
export function netOf(priceEur) {
  return priceEur / (1 + VAT) - STRIPE(priceEur);
}

// Najvišja meja AI na učenca (v $), pri kateri tudi učenec, ki jo porabi vso, prinese MIN_PROFIT_EUR.
export function maxLimitUsd(priceEur, eurPerUsd = EUR_PER_USD()) {
  return Math.max(0, (netOf(priceEur) - MIN_PROFIT_EUR) / eurPerUsd);
}

// Zanimanje iz starševskih računov (samo z računi): registracije, preizkusi, plačila.
function interestOf(db, now = Date.now()) {
  const has = db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'parents'").get();
  if (!has) return null;
  const rows = db.prepare("SELECT trial_ends_at, sub_status, created_at, promo_until FROM parents WHERE is_admin = 0").all();
  const day = 86400000;
  const ts = (s) => (s ? Date.parse(String(s).includes("T") ? s : String(s).replace(" ", "T") + "Z") : NaN);
  const paid = (p) => ["active", "trialing", "past_due"].includes(p.sub_status);
  const promo = (p) => ts(p.promo_until) > now;
  const recent = rows.filter((p) => ts(p.created_at) > now - 30 * day).length;
  // Končani preizkusi zadnjih 90 dni (brez aktivacijske kode, ki je brezplačno leto).
  const ended = rows.filter((p) => !promo(p) && ts(p.trial_ends_at) <= now && ts(p.trial_ends_at) > now - 90 * day);
  const converted = ended.filter(paid).length;
  return {
    signups_30d: recent,
    trials_now: rows.filter((p) => ts(p.trial_ends_at) > now && !paid(p)).length,
    trials_ended: ended.length,
    converted,
    conversion_pct: ended.length ? Math.round((100 * converted) / ended.length) : null,
    paying: rows.filter(paid).length,
    promo: rows.filter(promo).length,
  };
}

// sum = Usage.summary(). Vrne { economy, limit, price, interest, separate } z besedili v slovenščini.
// groupOf(id): "pilot" (brezplačna meja plačanega paketa, plača j), "owner" (lastnik brez meje) ali null. Ta profila
// sta ločeno (separate), da ne popačita povprečja in marže plačnikov (j 2026-11-06: marža ≥ 75 %).
export function pricingAdvice(db, sum, { now = new Date(), groupOf = () => null } = {}) {
  const eur = sum.eur_per_usd || EUR_PER_USD();
  const price = (PLANS.find((p) => p.seats === 1 && p.interval === "month")?.amount || 999) / 100;
  const net = netOf(price);
  const hard = LIMITS.studentMonthlyUsd();
  const soft = LIMITS.studentSoftUsd();
  const day = now.getUTCDate();
  const daysInMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
  const scale = daysInMonth / Math.max(1, day);

  const group = (s) => {
    try {
      return groupOf(s.id) || null;
    } catch {
      return null;
    }
  };
  const tagged = sum.students.filter((s) => s.calls > 0).map((s) => ({ s, g: group(s) }));
  const active = tagged.filter((x) => !x.g).map((x) => x.s);
  const separate = separateOf(tagged, eur, scale);
  // Ocena za cel mesec po učencu (pri dnevu 1–2 je ocena groba).
  const proj = active.map((s) => s.cost_usd * scale).sort((a, b) => a - b);
  const avgEur = proj.length ? (proj.reduce((a, x) => a + x, 0) / proj.length) * eur : 0;
  const p90Usd = proj.length ? proj[Math.min(proj.length - 1, Math.floor(proj.length * 0.9))] : 0;
  const atHard = hard ? sum.students.filter((s) => s.cost_usd >= hard).length : 0;
  const nearHard = hard ? proj.filter((x) => x >= hard * 0.8).length : 0;
  const atSoft = soft ? sum.students.filter((s) => s.cost_usd >= soft).length : 0;
  const profit = net - avgEur;
  const maxUsd = maxLimitUsd(price, eur);

  const economy = {
    price_eur: price,
    net_eur: r2(net),
    ai_avg_eur: r2(avgEur),
    profit_eur: r2(profit),
    margin_pct: Math.round((100 * profit) / price),
    hard_usd: hard || null,
    soft_usd: soft || null,
    max_limit_usd: r2(maxUsd),
    at_hard: atHard,
    near_hard: nearHard,
    at_soft: atSoft,
    active: active.length,
  };

  // --- meja: kakovost pred dobičkom ---
  let limit;
  if (!hard) limit = { status: "none", text: "Mesečne meje na učenca ni. Strošek omejuje le dnevna meja podrobnih razlag." };
  else if (active.length < MIN_STUDENTS)
    limit = { status: "data", text: `Meja ${fmt(hard)} $ ostane. Za predlog je potrebnih vsaj ${MIN_STUDENTS} aktivnih učencev (zdaj ${active.length}).` };
  else if ((atHard + nearHard) / active.length >= 0.05 && hard < maxUsd) {
    const to = Math.min(maxUsd, Math.max(hard * 1.5, p90Usd * 1.25));
    limit = {
      status: "raise",
      suggest_usd: r2(to),
      text: `${atHard + nearHard} od ${active.length} učencev je pri meji ali blizu nje: to že vpliva na učenje. Predlog: dvigni mejo na ${fmt(to)} $. Tudi učenec, ki jo porabi vso, še prinese vsaj ${fmt(MIN_PROFIT_EUR)} € na mesec.`,
    };
  } else if (hard > maxUsd)
    limit = {
      status: "lower",
      suggest_usd: r2(maxUsd),
      text: `Pri meji ${fmt(hard)} $ bi učenec, ki jo porabi vso, prinesel manj kot ${fmt(MIN_PROFIT_EUR)} € na mesec. Ker je ne doseže skoraj nihče, jo lahko pustiš; varnejša meja je ${fmt(maxUsd)} $.`,
    };
  else
    limit = {
      status: "keep",
      text: `Meja ${fmt(hard)} $ je prava: 9 od 10 učencev porabi do ${fmt(p90Usd)} $ na mesec, meje ne čuti nihče.`,
    };

  // --- cena: po zanimanju, z dobičkom ---
  const interest = interestOf(db, now.getTime());
  let priceAdv;
  if (!interest)
    priceAdv = { status: "data", text: "Za predlog cene morajo biti vklopljeni starševski računi (EVKLID_ACCOUNTS=1), da se vidi, koliko preizkusov se spremeni v naročnino." };
  else if (interest.trials_ended < MIN_TRIALS)
    priceAdv = {
      status: "data",
      text: `Cena ${fmt(price)} € ostane. Za predlog je potrebnih vsaj ${MIN_TRIALS} končanih 7-dnevnih preizkusov (zdaj ${interest.trials_ended}).`,
    };
  else if (interest.conversion_pct >= 35 && profit >= TARGET_PROFIT_EUR * 0.8) {
    const to = Math.round(price * 1.2) - 0.01;
    priceAdv = {
      status: "raise",
      suggest_eur: to,
      text: `Zanimanje je veliko: ${interest.conversion_pct} % preizkusov se spremeni v naročnino. Predlog: za nove naročnike preizkusi ${fmt(to)} € na mesec (obstoječi ostanejo pri svoji ceni) in po 2 tednih primerjaj delež naročnin.`,
    };
  } else if (interest.conversion_pct <= 8) {
    const to = Math.max(4.99, Math.round(price * 0.8) - 0.01);
    const profitLow = netOf(to) - avgEur;
    priceAdv = {
      status: "lower",
      suggest_eur: to,
      text:
        profitLow >= MIN_PROFIT_EUR
          ? `Zanimanje je nizko: le ${interest.conversion_pct} % preizkusov se spremeni v naročnino. Najprej izboljšaj prvi teden (to pove zavihek Mnenje), nato preizkusi ${fmt(to)} €. Pri tej ceni ostane še ${fmt(profitLow)} € na učenca.`
          : `Zanimanje je nizko (${interest.conversion_pct} %), a nižja cena ne bi pokrila stroška AI z dobičkom. Izboljšaj prvi teden (zavihek Mnenje), cene ne nižaj.`,
    };
  } else if (profit < TARGET_PROFIT_EUR)
    priceAdv = {
      status: "raise",
      suggest_eur: Math.round(price + (TARGET_PROFIT_EUR - profit) * (1 + VAT)) - 0.01,
      text: `Na učenca ostane ${fmt(profit)} €, cilj je ${fmt(TARGET_PROFIT_EUR)} €. Strošek AI na učenca je višji od načrtovanega: preveri, kdo porabi največ, ali dvigni ceno.`,
    };
  else
    priceAdv = {
      status: "keep",
      text: `Cena ${fmt(price)} € je dobra: ${interest.conversion_pct} % preizkusov postane naročnina, na učenca ostane ${fmt(profit)} € (${economy.margin_pct} %).`,
    };

  return { economy, limit, price: priceAdv, interest, levels: levelAdvice(db, active, { eur, scale }), separate };
}

// Pilot in lastnik ločeno od plačnikov: število profilov, strošek AI ta mesec in ocena za cel mesec (€).
const SEPARATE_LABEL = { pilot: "Pilot (brezplačno, plačaš ti)", owner: "Tvoj račun (brez meje)" };
function separateOf(tagged, eur, scale) {
  const out = {};
  for (const g of Object.keys(SEPARATE_LABEL)) {
    const mine = tagged.filter((x) => x.g === g).map((x) => x.s);
    const usd = mine.reduce((a, s) => a + s.cost_usd, 0);
    out[g] = { n: mine.length, month_eur: r2(usd * eur), projected_eur: r2(usd * scale * eur) };
  }
  const parts = Object.entries(out)
    .filter(([, v]) => v.n)
    .map(([g, v]) => `${SEPARATE_LABEL[g]}: ${v.n} ${v.n === 1 ? "profil" : v.n === 2 ? "profila" : v.n < 5 ? "profili" : "profilov"}, ta mesec ${fmt(v.month_eur)} € (ocena za mesec ${fmt(v.projected_eur)} €).`);
  return { ...out, text: parts.length ? `Ni v izračunu marže zgoraj. ${parts.join(" ")}` : null };
}

// Stopnja učencev (OS/SS/FAKS) iz baze; brez tabele students (testi) vsi OŠ.
function levelsById(db) {
  const has = db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'students'").get();
  if (!has) return new Map();
  const back = Object.fromEntries(Object.entries(STAGE_CODE).map(([l, c]) => [c, l]));
  return new Map(db.prepare(`SELECT id, ${stageCodeSql("settings")} AS stage FROM students`).all().map((r) => [r.id, back[r.stage] || "OS"]));
}

// Predlog po stopnjah (j 2026-11-01): cena stopnje, kaj ostane, zajamčena poraba AI in najslabši primer
// (naročnik porabi ves zajamčeni delež). Besedila za skrbnika (števec porabe).
export function levelAdvice(db, active, { eur = EUR_PER_USD(), scale = 1 } = {}) {
  const lv = levelsById(db);
  return STOPNJE.map((level) => {
    const price = LEVEL_PRICES[level].month / 100;
    const net = netOf(price);
    const g = guaranteeUsd(level);
    const worst = net - g * eur;
    const mine = active.filter((s) => (lv.get(s.id) || "OS") === level);
    const avg = mine.length ? (mine.reduce((a, s) => a + s.cost_usd * scale, 0) / mine.length) * eur : 0;
    const status = worst >= MIN_PROFIT_EUR ? "keep" : "lower";
    const text =
      `${LEVEL_LABEL[level]}: ${fmt(price)} € na mesec, ostane ${fmt(net)} €. Zajamčeno ${fmt(g)} $ AI na mesec; ` +
      (status === "keep"
        ? `tudi naročnik, ki ga porabi vsega, prinese ${fmt(worst)} €.`
        : `naročnik, ki ga porabi vsega, prinese le ${fmt(worst)} € (cilj vsaj ${fmt(MIN_PROFIT_EUR)} €): spremljaj porabo te stopnje.`) +
      (mine.length ? ` Aktivnih ${mine.length}, povprečen strošek AI ${fmt(avg)} €.` : "");
    return { level, price_eur: price, net_eur: r2(net), guarantee_usd: g, worst_profit_eur: r2(worst), active: mine.length, ai_avg_eur: r2(avg), status, text };
  });
}
