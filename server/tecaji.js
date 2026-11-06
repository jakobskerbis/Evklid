// Tečaji tujih valut za mejo AI regijskih paketov (j 2026-11-06 12:53): tedensko iz odprtega vira brez ključa,
// z rezervo 10 % (server/accounts/plans.js eurPerUnitNow). Če vira ni ali tečaji niso sveži (> 14 dni), velja stalni
// tečaj EUR_PER_UNIT z rezervo 20 %. Cene, ki jih kupec plača, se ne spremenijo.
//
// Vir (EVKLID_FX_URL): odprti podatki fawazahmed0/exchange-api (CC0, brez ključa) prek jsDelivr; oblika
// { date, eur: { inr: 98.1, … } } (enot valute za 1 €). Šibkejša valuta (nižja meja) velja vedno (do 20-krat); močnejša
// od stalnega tečaja največ za 50 % (napačen podatek bi sicer zvišal mejo), sicer valuta ostane na stalnem tečaju.
import { EUR_PER_UNIT, setFxRates } from "./accounts/plans.js";

export const FX_URL = () => process.env.EVKLID_FX_URL || "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json";
const WEEK = 7 * 86400000;
const KEY = "fx_eur";

// Iz odgovora vira: { CUR: € za enoto } za valute iz EUR_PER_UNIT (brez XOF, vezan na evro).
export function parseFx(json) {
  const table = json?.eur;
  if (!table || typeof table !== "object") return {};
  const out = {};
  for (const [cur, fixed] of Object.entries(EUR_PER_UNIT)) {
    if (cur === "XOF") continue;
    const perEur = Number(table[cur.toLowerCase()]);
    if (!(perEur > 0)) continue;
    const eur = 1 / perEur;
    if (eur > fixed / 20 && eur <= fixed * 1.5) out[cur] = eur;
  }
  return out;
}

// Naloži shranjene tečaje (kv) v plans.js; vrne { rates, at } ali null.
export function loadFx(db) {
  try {
    const row = db.prepare("SELECT value FROM kv WHERE key = ?").get(KEY);
    const v = row ? JSON.parse(row.value) : null;
    if (v?.rates && v.at) setFxRates(v.rates, v.at);
    return v;
  } catch {
    return null;
  }
}

export async function refreshFx(db, { fetchFn = globalThis.fetch, log = console, now = Date.now() } = {}) {
  try {
    const res = await fetchFn(FX_URL(), { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rates = parseFx(await res.json());
    if (!Object.keys(rates).length) throw new Error("brez tečajev");
    db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(KEY, JSON.stringify({ rates, at: now }));
    setFxRates(rates, now);
    return rates;
  } catch (err) {
    log.warn?.(`[evklid] tečaji za mejo AI niso osveženi (${err?.message || err}); velja stalni tečaj z rezervo 20 %`);
    return null;
  }
}

// Ob zagonu naloži shranjene; osveži ob zagonu, če so starejši od tedna, nato enkrat na teden.
export function startFxJobs(db, { scheduler = true, fetchFn, log = console } = {}) {
  const v = loadFx(db);
  if (!scheduler) return;
  const run = () => {
    if (db.isOpen === false) return;
    refreshFx(db, { fetchFn, log });
  };
  if (!v?.at || Date.now() - v.at > WEEK) setTimeout(run, 30_000).unref?.();
  setInterval(run, WEEK).unref();
}
