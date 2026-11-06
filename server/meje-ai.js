// Trda meja stroška AI na uporabnika (j 2026-11-06 6:40, »marža vedno ≥ 75 %«).
//
// Strošek AI (vhodni in izhodni žetoni, predpomnilnik, skener, slike, ponovni poskusi, prekinjeni odgovori) ne sme
// preseči 25 % tega, kar uporabnik plača, za noben paket in način. Brezplačni paketi (brezplačni, gost, preizkus,
// aktivacijska koda, bonus za priporočilo) imajo nizko stalno mejo v $.
//
// Kako je meja trda: pred vsakim klicem modela strežnik rezervira najvišji možni strošek tega klica (rezerva, spodaj)
// in klic dovoli le, če poraba + rezervacije drugih klicev v teku + rezerva tega klica ostanejo pod mejo
// (server/usage.js hold/headroom). Zadnji klic zato meje ne more prestopiti, tudi hkratni klici ne.
//
// Rezerva klica: vhod ≤ število bajtov besedila (vsak žeton je vsaj en bajt UTF-8), le naša stalna navodila (sistemski
// prompt, orodja) štejemo kot bajti / 2 (slovensko in angleško besedilo ima ~3–4 bajte na žeton); slika največ
// IMAGE_TOKENS; vsak vhodni žeton po najvišji ceni (zapis v predpomnilnik za 1 h = 2× vhod); izhod = max_tokens.
import "./env.js";
import { PRICES, modeParams, MODEL, MODEL_MID } from "./claude.js";
import { SPLIT_MARKER } from "./prompt.js";
import {
  PLANS, LEGACY_PLANS, SCHOOL_PLANS, REGIONAL_PRICES, plansFor, planGuarantee, planEurMonth, PASSES, FAKS_PASSES, passCapUsd,
  giftFor, giftGuarantee, LEGACY_GIFT_CENTS, COST, freeStudentMonthlyUsd, freeMonthlyPoolUsd, TRIAL_DAYS, REFERRAL_DAYS, netOfVat,
} from "./accounts/plans.js";
import { STOPNJE } from "../public/stopnja.js";
import { CREDIT_PACKS, creditUsdFor } from "./placila/krediti.js";
import { SCHOOL_LICENCE_PRICES, maxAiCapUsd } from "./schools.js";

const num = (k, d) => {
  const v = Number(process.env[k]);
  return process.env[k] !== undefined && process.env[k] !== "" && Number.isFinite(v) && v >= 0 ? v : d;
};

// ---------- stalne meje paketov brez plačila (v $) ----------
// Preizkus (7 dni) za ves preizkus, aktivacijska koda in bonus za priporočilo na mesec, oboje za ves račun.
// Brezplačni paket in gost: EVKLID_FREE_STUDENT_USD (0,2 $ na profil na mesec) in EVKLID_FREE_POOL_USD (vsi skupaj).
export const NOPAY_USD = {
  trial: () => num("EVKLID_TRIAL_AI_USD", 0.5),
  promo: () => num("EVKLID_PROMO_AI_USD", 0.5),
  bonus: () => num("EVKLID_BONUS_AI_USD", 0.5),
  // Stari profili brez računa staršev (pred računi): kot aktivacijska koda.
  legacy: () => num("EVKLID_LEGACY_AI_USD", 0.5),
};

// Skupni bazen vseh profilov brez plačila (preizkus, koda, bonus) na mesec, za vse račune skupaj (pregled #462: vsak nov
// e-naslov dobi preizkus; bazen omeji zlorabo z mnogo računi). Privzeto 20 $ (potrdi j).
export const nopayPoolUsd = () => num("EVKLID_NOPAY_POOL_USD", 20);

// ---------- rezerva enega klica ----------
// Modeli Claude 4.7 in novejši sprejmejo slike do 2576 px in največ 4784 žetonov (platform.claude.com, vision).
export const IMAGE_TOKENS = 4800;
const MSG_OVERHEAD = 20; // oznake vlog in blokov
const bytes = (s) => Buffer.byteLength(String(s ?? ""), "utf8");
// Najdražji model (leno: claude.js se lahko naloži za tem modulom).
const mostExpensive = () => Object.values(PRICES).flatMap((p) => [p, p.long].filter(Boolean)).reduce((a, p) => (p.out > a.out ? p : a));
export function priceOf(model) {
  const id = String(model || "");
  const key = Object.keys(PRICES).filter((k) => id === k || id.startsWith(`${k}-`)).sort((a, b) => b.length - a.length)[0];
  return PRICES[key] || mostExpensive(); // neznan model: najdražji (previdno)
}
// Najvišja cena vhodnega žetona: zapis v predpomnilnik za 1 h (2× vhod) ali 5 min (cacheWrite).
const inMax = (p) => Math.max(p.in * 2, p.cacheWrite, p.in);

// Zgornja meja vhodnih žetonov sporočil (bajti, slike po IMAGE_TOKENS).
export function messageTokens(messages) {
  let t = 0;
  for (const m of [].concat(messages || [])) {
    t += MSG_OVERHEAD;
    const content = typeof m?.content === "string" ? [{ type: "text", text: m.content }] : Array.isArray(m?.content) ? m.content : [];
    for (const b of content) {
      t += MSG_OVERHEAD;
      if (b?.type === "image" || b?.type === "document") t += IMAGE_TOKENS;
      else if (b?.type === "text") t += bytes(b.text);
      else t += bytes(JSON.stringify(b ?? ""));
    }
  }
  return t;
}
// Zgornja meja žetonov sistemskega prompta: stalni del (naša navodila) bajti / 2, del za učenca (ime, nastavitve) bajti.
export function systemTokens(system) {
  if (Array.isArray(system)) return system.reduce((t, b) => t + MSG_OVERHEAD + bytes(b?.text), 0);
  const s = String(system ?? "");
  const at = s.indexOf(SPLIT_MARKER);
  if (at === -1) return Math.ceil(bytes(s) / 2) + MSG_OVERHEAD;
  return Math.ceil(bytes(s.slice(0, at)) / 2) + bytes(s.slice(at)) + MSG_OVERHEAD;
}
// Najvišji strošek klica v $.
export function callMaxUsd(model, inputTokens, outputTokens) {
  let p = priceOf(model);
  if (p.long && inputTokens > p.long.over) p = p.long; // Haiku nad 100k žetonov: 5× (pregled #462 A1)
  return ((Math.max(0, inputTokens) * inMax(p)) + Math.max(0, outputTokens) * p.out) / 1e6;
}
// Rezerva klica inštruktorja (server/claude.js streamReply) za način mode; extraTokens: skrite opombe in povzetek.
export function replyReserveUsd({ mode = "chat", system = "", messages = [], tools = null, extraTokens = 0, quickMax = null } = {}) {
  const { model, max_tokens } = modeParams(mode);
  const out = quickMax ? Math.min(max_tokens, quickMax) : max_tokens;
  const input = systemTokens(system) + messageTokens(messages) + (tools?.length ? Math.ceil(bytes(JSON.stringify(tools)) / 2) : 0) + extraTokens;
  return callMaxUsd(model, input, out);
}
// Zgodovina pod pragom dolgega poziva (Haiku nad 100k žetonov 5×, pregled #462 A1): odreže najstarejše izmenjave,
// dokler poziv (z rezervo za opombe) ne gre pod prag. Modeli brez dražjega dolgega poziva: nespremenjeno.
export function fitLongPrompt({ mode = "chat", system = "", messages = [], tools = null, extraTokens = 2000, margin = 5000 } = {}) {
  const p = priceOf(modeParams(mode).model);
  if (!p.long) return messages;
  const fixed = systemTokens(system) + (tools?.length ? Math.ceil(bytes(JSON.stringify(tools)) / 2) : 0) + extraTokens;
  let out = messages;
  while (out.length > 1 && fixed + messageTokens(out) > p.long.over - margin) {
    out = out.slice(1);
    while (out.length > 1 && out[0].role !== "user") out = out.slice(1);
  }
  return out;
}
// Rezerva za pregled s Sonnetom ali preverjevalca (server/verify.js askModel: max_tokens 8000, kratka navodila).
export const CHECK_MAX_TOKENS = 8000;
export const checkReserveUsd = (model = MODEL_MID, userText = "") => callMaxUsd(model, 1500 + bytes(userText) + MSG_OVERHEAD * 2, CHECK_MAX_TOKENS);
// Rezerva za kratek povzetek pogovora (server/povzetek.js: hitri model, največ 400 izhodnih žetonov).
export const summaryReserveUsd = (messages) => callMaxUsd(MODEL, 1000 + messageTokens(messages), 400);
// Rezerva za klic z eno sliko in kratkim navodilom (skener, branje zapisa, urnik): model, max_tokens.
export const imageCallReserveUsd = (model, maxTokens, images = 1, promptTokens = 4000) => callMaxUsd(model, promptTokens + images * IMAGE_TOKENS, maxTokens);

// Cenejši načini po vrsti, ko rezerva izbranega ne gre več pod mejo.
export const FALLBACK_MODES = { deep: ["mid", "think", "chat", "lite"], mid: ["think", "chat", "lite"], think: ["chat", "lite"], chat: ["lite"], lite: [] };

// ---------- tabela meja (docs/stroski-ai.md, opis PR, test/marza-ai.test.js) ----------
const r2 = (x) => Math.round(x * 100) / 100;
const eurOf = (cents) => cents / 100;
// Vrstica: paket, plačilo v € z DDV in brez (na obdobje meje), meja AI v $ (najslabši primer), delež plačila brez DDV.
// Delež je od plačila BREZ DDV (j 2026-11-06, plans.js VAT_RATE).
const row = (name, paidEur, capUsd, period = "mesec") => ({
  name,
  period,
  paidEur: r2(paidEur),
  netEur: r2(netOfVat(paidEur)),
  capUsd: Math.round(capUsd * 1000) / 1000,
  share: paidEur > 0 ? (capUsd * COST.eurPerUsd) / netOfVat(paidEur) : null,
});
export function aiCapRows() {
  const rows = [];
  for (const p of [...PLANS.map((x) => ({ ...x, currency: "EUR" })), ...LEGACY_PLANS.map((x) => ({ ...x, currency: "EUR" })), ...SCHOOL_PLANS]) {
    rows.push(row(p.label, planEurMonth(p), planGuarantee(p).total));
  }
  for (const cur of Object.keys(REGIONAL_PRICES)) for (const p of plansFor(cur)) rows.push(row(`${p.label} (${cur})`, planEurMonth(p), planGuarantee(p).total));
  for (const p of [...PASSES, ...FAKS_PASSES]) rows.push(row(`Paket pred testom ${p.level === "FAKS" ? "faks " : ""}${p.days} dni`, eurOf(p.amount), passCapUsd({ ai_usd: p.aiUsd, amount: p.amount }), `${p.days} dni`));
  // Darilo velja za stopnjo darila ali nižjo; najvišji delež ima stopnja darila.
  for (const l of STOPNJE) rows.push(row(`Darilna koda ${l} (1 leto, na mesec)`, giftFor(l).amount / 100 / 12, giftGuarantee(l, l).total));
  rows.push(row("Darilna koda (stara, 49 €)", LEGACY_GIFT_CENTS / 100 / 12, giftGuarantee(null, "OS").total));
  for (const [plan, v] of Object.entries(SCHOOL_LICENCE_PRICES)) {
    rows.push(row(`Šolska licenca ${plan} (na učenca)`, v.eur / 12, maxAiCapUsd({ seats: 1, plan, price_eur: v.eur })));
  }
  for (const p of CREDIT_PACKS) rows.push(row(`Dokup ${eurOf(p.amount)} €`, eurOf(p.amount), creditUsdFor(p.amount), "nakup"));
  return rows;
}
// Stalne meje paketov brez plačila (v $).
export function nopayRows() {
  return [
    { name: "Brezplačni paket / gost (na profil)", capUsd: freeStudentMonthlyUsd(), period: "mesec" },
    { name: "Brezplačni paket / gost (vsi skupaj)", capUsd: freeMonthlyPoolUsd(), period: "mesec" },
    { name: `Preizkus (${TRIAL_DAYS} dni, ves račun)`, capUsd: NOPAY_USD.trial(), period: `${TRIAL_DAYS} dni` },
    { name: "Aktivacijska koda (ves račun)", capUsd: NOPAY_USD.promo(), period: "mesec" },
    { name: "Bonus za priporočilo (ves račun)", capUsd: NOPAY_USD.bonus(), period: `${REFERRAL_DAYS} dni` },
    { name: "Šolska licenca s ceno 0 (na učenca)", capUsd: freeStudentMonthlyUsd(), period: "mesec" },
    { name: "Preizkus, koda in bonus (vsi računi skupaj)", capUsd: nopayPoolUsd(), period: "mesec" },
  ];
}
// Najvišje rezerve za tipične klice (za tabelo v docs): sistemski prompt ~50 KB, 10 izmenjav po 2 KB.
export function reserveExamples() {
  const system = "x".repeat(50_000);
  const turn = (n) => Array.from({ length: n }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: "y".repeat(2000) }));
  return ["lite", "chat", "think", "mid", "deep"].map((mode) => ({ mode, model: modeParams(mode).model, maxTokens: modeParams(mode).max_tokens, usd: replyReserveUsd({ mode, system, messages: turn(mode === "deep" || mode === "mid" ? 6 : 20) }) }));
}
