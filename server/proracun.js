// Mesečni proračun API (j 2026-10-30): izbira modela naj porabi čim bližje mesečnemu znesku
// (200 $ kredita iz Claude Max), a ga nikoli ne preseže. Poraba se šteje iz dejanskih žetonov
// (tabela usage, server/claude.js costUsd); hitrost porabe primerjamo z delom meseca, ki je minil.
//
// Ravni: 3 največ (pod polovico načrta: običajne odgovore pripravi Opus), 2 več (Sonnet),
// 1 običajno (kot doslej, server/usage.js chooseMode), 0 varčno (samo hitri model), -1 ustavljeno.
// Z več učenci poraba raste in raven sama pade; nihče ne dobi več od enakega deleža proračuna.
import "./env.js";

const num = (k, d) => {
  const v = Number(process.env[k]);
  return Number.isFinite(v) && process.env[k] !== "" && process.env[k] !== undefined ? v : d;
};

export const BUDGET = {
  // Privzeti mesečni znesek v $ (0 = brez proračuna, modeli kot doslej). Skrbnik ga lahko
  // spremeni v števcu porabe (shrani se v bazo in ima prednost).
  baseUsd: () => num("EVKLID_MONTHLY_BUDGET_USD", 0),
  // Rezerva pod mejo v %: inštruktor se ustavi prej, da tudi hkratni odgovori ne gredo čez.
  reservePct: () => Math.min(50, Math.max(0, num("EVKLID_BUDGET_RESERVE_PCT", 3))),
  // Kolikokrat dnevnega deleža sme biti porabljeno danes, preden nadgradnje počakajo do jutri.
  burst: () => num("EVKLID_BUDGET_BURST", 2),
};

// Uteži za delitev proračuna po profilih (j 2026-10-30: plačljivi sorazmerno s ceno več kot brezplačni).
// Plačljiva naročnina: mesečna cena na otroka v € (9,99 € → 9,99); preizkus, koda, bonus in paket pred
// testom kot mesečna naročnina za enega otroka; šolska licenca in brezplačni paket po spodnjih utežeh.
export const SHARE = {
  free: () => Math.max(0, num("EVKLID_SHARE_FREE", 1)),
  school: () => Math.max(0, num("EVKLID_SHARE_SCHOOL", 2)),
};

const DAY = 86_400_000;
export const MAX_BUDGET_USD = 100_000;

// Obračunsko obdobje = koledarski mesec v UTC (enako kot date('now','start of month') v SQLite).
export function periodOf(now = new Date()) {
  const start = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);
  return { start, end, key: new Date(start).toISOString().slice(0, 7) };
}

/**
 * Raven porabe iz stanja proračuna (čista funkcija, brez baze).
 * @param {{cap:number, spent:number, today:number, now?:Date}} s cap = meja z rezervo
 * @returns {{level:number, pace:number|null, projected:number|null, dayAllowance:number|null}}
 */
export function paceLevel({ cap, spent, today = 0, now = new Date() }) {
  if (!cap) return { level: 1, pace: null, projected: null, dayAllowance: null };
  const { start, end } = periodOf(now);
  const days = (end - start) / DAY;
  const elapsed = Math.max(0, now.getTime() - start) / DAY;
  const rem = cap - spent;
  const projected = elapsed >= 1 ? (spent / elapsed) * days : null;
  if (rem <= 0) return { level: -1, pace: spent / cap, projected, dayAllowance: 0 };
  // Prvi dan štejemo kot cel dan, da en drag odgovor zjutraj 1. ne spusti ravni.
  const pace = spent / (cap * (Math.max(elapsed, 1) / days));
  const daysLeft = Math.max(1, (end - now.getTime()) / DAY);
  const dayAllowance = rem / daysLeft;
  let level = pace >= 1.1 ? 0 : pace >= 0.8 ? 1 : pace >= 0.5 ? 2 : 3;
  // Zadnjih 5 % proračuna: samo hitri model.
  if (rem < cap * 0.05) level = 0;
  // Nenaden naval (danes že večkratnik dnevnega deleža): nadgradnje počakajo do jutri.
  else if (today > dayAllowance * BUDGET.burst()) level = Math.min(level, 1);
  return { level, pace, projected, dayAllowance };
}

const RANK = { lite: 0, chat: 0, think: 1, mid: 2, deep: 3 };

/**
 * Prilagodi način klica (server/claude.js modeParams) ravni proračuna.
 * maxTier: najzmogljivejši dovoljeni način za učenca ("deep" Opus, "mid" Sonnet, null brez nadgradnje:
 * brezplačni paket nikoli ne dobi Opusa in ima svoje meje). overShare: učenec je že porabil svoj enaki delež.
 * @returns {{mode:string, boosted:boolean, saved:boolean}}
 */
export function budgetMode(mode, { level = 1, maxTier = "deep", lite = false, overShare = false } = {}) {
  if (level <= 0) {
    const down = mode === "deep" || mode === "mid";
    return { mode: down ? "think" : mode, boosted: false, saved: down };
  }
  if (level === 1 || lite || mode === "lite" || overShare || !maxTier) return { mode, boosted: false, saved: false };
  let want = level >= 3 ? "deep" : "mid";
  if (RANK[want] > RANK[maxTier]) want = maxTier;
  return RANK[want] > RANK[mode] ? { mode: want, boosted: true, saved: false } : { mode, boosted: false, saved: false };
}

// Hitri način (j 2026-11-01): naročnik nad zajamčenim deležem dobi samo hitri model. Podrobna razlaga
// (Opus, Sonnet) postane razlaga hitrega modela z več razmisleka; ostali načini so že hitri.
export const fastMode = (mode) => (mode === "deep" || mode === "mid" ? "think" : mode);
