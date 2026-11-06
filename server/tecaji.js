// Tečaji tujih valut za mejo AI regijskih paketov (j 2026-11-06 12:53): tedensko iz odprtega vira brez ključa,
// z rezervo 10 % (server/accounts/plans.js eurPerUnitNow). Če vira ni ali tečaji niso sveži (datum podatkov starejši
// od 8 dni), velja stalni tečaj EUR_PER_UNIT z rezervo 20 %. Cene, ki jih kupec plača, se ne spremenijo.
//
// Vir: odprti podatki fawazahmed0/exchange-api (CC0, brez ključa), pripeta različica po datumu (včerajšnji dan, ne
// spremenljivi @latest; pregled #462 H5/K3-4) prek jsDelivr, rezervni naslov Cloudflare Pages istega avtorja.
// Oblika { date: "YYYY-MM-DD", eur: { inr: 98.1, … } } (enot valute za 1 €). Svežost po datumu podatkov (json.date),
// ne po času prenosa. Šibkejša valuta (nižja meja) velja do 20-krat; močnejša od stalnega tečaja največ +10 %
// (napačen ali zastarel podatek bi sicer zvišal mejo), sicer valuta ostane na stalnem tečaju.
import { EUR_PER_UNIT, setFxRates, FX_MAX_AGE_MS } from "./accounts/plans.js";

const DAY = 86400000;
const KEY = "fx_eur";
const MAX_BYTES = 1_000_000;
const TIMEOUT_MS = 15_000;
export const FX_UP_MAX = 1.1;
const ymd = (ms) => new Date(ms).toISOString().slice(0, 10);
// Naslovi za dan (YYYY-MM-DD); EVKLID_FX_URL lahko vsebuje {date}.
export const fxUrls = (now = Date.now()) => {
  const day = ymd(now - DAY);
  if (process.env.EVKLID_FX_URL) return [process.env.EVKLID_FX_URL.replaceAll("{date}", day)];
  return [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${day}/v1/currencies/eur.json`,
    `https://${day}.currency-api.pages.dev/v1/currencies/eur.json`,
  ];
};

// Datum podatkov (ms) ali NaN; zavrnjen, če je starejši od FX_MAX_AGE_MS ali več kot dan v prihodnosti.
export function fxDate(json, now = Date.now()) {
  const at = Date.parse(String(json?.date || ""));
  if (!Number.isFinite(at) || at > now + DAY || now - at > FX_MAX_AGE_MS) return NaN;
  return at;
}

// Iz odgovora vira: { CUR: € za enoto } za valute iz EUR_PER_UNIT (brez XOF, vezan na evro); {} za zastarel odgovor.
export function parseFx(json, now = Date.now()) {
  const table = json?.eur;
  if (!table || typeof table !== "object" || !Number.isFinite(fxDate(json, now))) return {};
  const out = {};
  for (const [cur, fixed] of Object.entries(EUR_PER_UNIT)) {
    if (cur === "XOF") continue;
    const perEur = Number(table[cur.toLowerCase()]);
    if (!(perEur > 0)) continue;
    const eur = 1 / perEur;
    if (eur > fixed / 20 && eur <= fixed * FX_UP_MAX) out[cur] = eur;
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

async function readJson(res) {
  if (typeof res.text !== "function") return res.json();
  const text = await res.text();
  if (text.length > MAX_BYTES) throw new Error("prevelik odgovor");
  return JSON.parse(text);
}

export async function refreshFx(db, { fetchFn = globalThis.fetch, log = console, now = Date.now() } = {}) {
  let last = null;
  for (const url of fxUrls(now)) {
    try {
      const res = await fetchFn(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await readJson(res);
      const at = fxDate(json, now);
      if (!Number.isFinite(at)) throw new Error(`zastarel ali neveljaven datum podatkov (${json?.date})`);
      const rates = parseFx(json, now);
      if (!Object.keys(rates).length) throw new Error("brez tečajev");
      db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(KEY, JSON.stringify({ rates, at }));
      setFxRates(rates, at);
      return rates;
    } catch (err) {
      last = err;
    }
  }
  log.warn?.(`[evklid] tečaji za mejo AI niso osveženi (${last?.message || last}); velja stalni tečaj z rezervo 20 %`);
  return null;
}

// Ob zagonu naloži shranjene; vsak dan preveri in osveži, ko so podatki starejši od 6 dni (približno tedensko;
// po napaki naslednji dan znova).
export function startFxJobs(db, { scheduler = true, fetchFn, log = console } = {}) {
  loadFx(db);
  if (!scheduler) return;
  const run = () => {
    if (db.isOpen === false) return;
    const v = loadFx(db);
    if (v?.at && Date.now() - v.at < 6 * DAY) return;
    refreshFx(db, { fetchFn, log });
  };
  setTimeout(run, 30_000).unref?.();
  setInterval(run, DAY).unref();
}
