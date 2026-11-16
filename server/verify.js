// Trojno preverjanje, preden se odgovor inštruktorja shrani za ponovno uporabo (j, 2026-10-30:
// »lahko se shranjuje, ampak naj bo dovoljkrat pregledano za popolno točnost«).
//   1. koda: vsak čisto številski račun v odgovoru se izračuna znova (server/lesson-math.js),
//   2. in 3. dva neodvisna AI pregleda z različnima modeloma (privzeto Sonnet in Opus).
// Shranjen odgovor (answer_cache) in kartice za ponavljanje so vidni šele, ko vsi trije rečejo OK.
// Ob dvomu, napaki ali porabljenem dnevnem znesku se nič ne shrani.
import "./env.js";
import { checkArithmetic } from "./lesson-math.js";
import { getClient, isMockMode, costUsd, MODEL_MID, MODEL_DEEP } from "./claude.js";

const env = (k, d) => (process.env[k] === undefined || process.env[k] === "" ? d : process.env[k]);
export const VERIFY_MODELS = () =>
  env("EVKLID_VERIFY_MODELS", `${MODEL_MID},${MODEL_DEEP}`)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
// Največ toliko USD na dan za preverjanje; nad tem se novi odgovori in kartice ne shranijo.
export const VERIFY_DAILY_USD = () => {
  // Neveljavna vrednost ne sme izklopiti omejitve (NaN >= x je vedno false).
  const v = Number(env("EVKLID_VERIFY_DAILY_USD", 1));
  return Number.isFinite(v) ? v : 1;
};
const EFFORT = env("EVKLID_VERIFY_EFFORT", "medium");

export const SYSTEM = `You are a strict fact-checker for an AI tutor that teaches school and university maths, physics, chemistry and biology.
You receive the student's question and the tutor's answer (or flashcards made from it). The answer may be in any language.
Check every statement, number, calculation, unit, formula, chemical formula, definition and named fact. Recompute every calculation yourself.
Only factual or computational errors count. Teaching style, questions to the student, leaving steps for the student, hints and simplifications that are correct for the school level are fine.
If anything is wrong, or you are not sure it is right, it is not OK.
Reply with exactly one line: OK, or NAPAKA: <short reason>.`;

// Pri karticah (kind "cards") preverjevalec dobi oštevilčene kartice in sodi vsako posebej: ena napačna kartica
// ne zavrže drugih (prej je ena sodba veljala za vse kartice odgovora).
export const CARDS_SYSTEM = SYSTEM.replace(
  /Reply with exactly one line:.*$/,
  `The flashcards are numbered; judge each card on its own. A card that states a correct fact in any correct wording is OK.
Reply OK if every card is right; otherwise one line per wrong card: NAPAKA <number>: <short reason>. Nothing else.`,
);

// Odgovor preverjevalca → { ok, reason }. Sodba je zadnja vrstica: model včasih pred »OK« napiše utemeljitev
// (krog 8: »The flashcard states the criss-cross rule: …« brez besede NAPAKA je pravilno kartico zavrgel).
// »NAPAKA« kjer koli, ali zadnja vrstica, ki ni golo OK, je še vedno zavrnitev (brez sodbe = dvom).
const bare = (s) => s.replace(/^[*`_\s#>-]+|[*`_\s.]+$/g, "");
export function parseVerdict(text) {
  const t = String(text || "").trim();
  const m = /NAPAKA\s*:?\s*(.*)/i.exec(t);
  const last = t.split("\n").map(bare).filter(Boolean).at(-1) || "";
  if (!m && /^OK$/i.test(last)) return { ok: true };
  return { ok: false, reason: (m ? m[1] : `brez sodbe: ${t}`).slice(0, 300) || "brez razloga" };
}

// Sodba za n oštevilčenih kartic → { cards: [true = pravilna], reason }. »NAPAKA <k>: …« zavrže le kartico k;
// NAPAKA brez veljavne številke ali odgovor brez sodbe zavrže vse.
export function parseCardVerdicts(text, n) {
  const t = String(text || "");
  const bad = new Map();
  for (const line of t.split("\n")) {
    if (!/NAPAKA/i.test(line)) continue;
    const m = /^[\s*`_#>-]*NAPAKA\s*(?:card\s*|kartica\s*)?#?(\d+)\s*[:.)–-]\s*(.*)$/i.exec(line);
    const k = m ? Number(m[1]) : 0;
    if (!(k >= 1 && k <= n)) return { cards: Array(n).fill(false), reason: parseVerdict(line).reason };
    bad.set(k, bare(m[2]) || "brez razloga");
  }
  if (bad.size) return { cards: Array.from({ length: n }, (_, i) => !bad.has(i + 1)), reason: [...bad].map(([k, r]) => `${k}: ${r}`).join("; ").slice(0, 300) };
  const v = parseVerdict(t);
  return { cards: Array(n).fill(v.ok), reason: v.reason };
}

// Prvi pregled: koda. Vrne razlog, če se kateri račun ne izide.
export function codeCheck(text) {
  let mismatches;
  try {
    ({ mismatches } = checkArithmetic(String(text || "")));
  } catch (e) {
    return `računa ni bilo mogoče preveriti (${e?.message || e})`;
  }
  return mismatches.length ? `račun se ne izide: ${mismatches[0].left} ≠ ${mismatches[0].right}` : null;
}

// Sporočilo za preverjevalca (vprašanje + odgovor); uporablja ga tudi sprotno preverjanje (server/live-check.js).
export function checkerUser({ question, answer, kind = "answer" }) {
  const label = kind === "cards" ? "FLASHCARDS (question → answer)" : "TUTOR ANSWER";
  return `STUDENT QUESTION:\n${String(question || "(none)").slice(0, 4000)}\n\n${label}:\n${String(answer)}`;
}

// opts.signal: prekinitev (npr. učenec zapre pogovor); opts.timeoutMs: rok, po njem napaka z name »TimeoutError«
// (tudi če createFn signala ne upošteva).
// opts.cards: število oštevilčenih kartic; verdict ima tedaj še cards (sodba za vsako kartico).
export async function askModel(model, user, createFn, system = SYSTEM, { signal = null, timeoutMs = 0, cards = 0 } = {}) {
  const create = createFn || ((p, o) => getClient().messages.create(p, o));
  const params = { model, max_tokens: 8000, output_config: { effort: EFFORT }, system, messages: [{ role: "user", content: user }] };
  let r;
  if (!signal && !(timeoutMs > 0)) r = await create(params);
  else {
    const ctl = new AbortController();
    const stop = (reason) => ctl.abort(reason);
    const onAbort = () => stop(Object.assign(new Error("aborted"), { name: "AbortError" }));
    if (signal?.aborted) onAbort();
    signal?.addEventListener?.("abort", onAbort, { once: true });
    let timer = null;
    const limit = new Promise((_, reject) => {
      if (timeoutMs > 0) timer = setTimeout(() => {
        const e = Object.assign(new Error(`pregled ni končal v ${timeoutMs} ms`), { name: "TimeoutError" });
        stop(e);
        reject(e);
      }, timeoutMs);
      ctl.signal.addEventListener("abort", () => reject(ctl.signal.reason), { once: true });
    });
    try {
      r = await Promise.race([create(params, { signal: ctl.signal }), limit]);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener?.("abort", onAbort);
    }
  }
  const text = (r.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  // Odrezan (max_tokens) ali zavrnjen odgovor preverjevalca ni OK, tudi če se začne z »OK«.
  const cut = r.stop_reason && r.stop_reason !== "end_turn" && r.stop_reason !== "stop_sequence";
  let verdict = cut ? { ok: false, reason: `preverjevalec ni končal (${r.stop_reason})` } : parseVerdict(text);
  if (cards > 0) {
    const c = cut ? { cards: Array(cards).fill(false), reason: verdict.reason } : parseCardVerdicts(text, cards);
    verdict = { ok: c.cards.every(Boolean), cards: c.cards, ...(c.cards.every(Boolean) ? {} : { reason: c.reason }) };
  }
  return { verdict, text, usage: r.usage, model: r.model || model };
}

// Kartica v eni vrstici: večvrstični odgovor (»1. …\n2. …«) bi preverjevalcu zamaknil številke kartic.
const oneLine = (c) => String(c).replace(/\s*\n\s*/g, " ; ");

/**
 * Preveri odgovor trikrat. `kind`: "answer" (celoten odgovor) ali "cards" (kartice).
 * `cards`: seznam kartic (»vprašanje → odgovor«); preverjevalca jih dobita oštevilčene in sodita vsako posebej,
 * rezultat ima tedaj `cards` (true = kartica prestala oba modela). Brez sodbe po karticah (koda, dnevni znesek,
 * napaka klica) `cards` ni, in velja `ok` za vse.
 * @returns {Promise<{ok: boolean, reason?: string, cost: number, cards?: boolean[]}>}
 */
// Strošek plača aplikacija (student_id NULL) iz dnevnega zneska VERIFY_DAILY_USD (j 2026-11-06), ne meja učenca.
export async function verifyAnswer({ question, answer, kind = "answer", cards = null, usage = null, createFn = null }) {
  const n = kind === "cards" && Array.isArray(cards) ? cards.length : 0;
  if (n) answer = cards.join("\n");
  const code = codeCheck(answer);
  if (code) return { ok: false, reason: code, cost: 0 };
  // Brez API ključa (preizkusni način) so odgovori vnaprej pripravljeni in jih ni treba preverjati.
  if (!createFn && isMockMode()) return { ok: true, cost: 0, mock: true };
  if (usage && VERIFY_DAILY_USD() >= 0 && usage.kindToday?.("verify") >= VERIFY_DAILY_USD()) return { ok: false, reason: "dnevni znesek za preverjanje je porabljen", cost: 0 };
  // Predolgega odgovora preverjevalec ne bi videl v celoti: tak se ne shrani.
  if (String(answer).length > 12000) return { ok: false, reason: "odgovor je predolg za celotno preverjanje", cost: 0 };
  // Pravilo treh pregledov: koda in vsaj dva različna modela.
  const models = [...new Set(VERIFY_MODELS())];
  if (models.length < 2) return { ok: false, reason: "za preverjanje sta potrebna dva različna modela (EVKLID_VERIFY_MODELS)", cost: 0 };
  const user = checkerUser({ question, answer: n ? cards.map((c, i) => `${i + 1}. ${oneLine(c)}`).join("\n") : answer, kind });
  let cost = 0;
  try {
    // allSettled: tudi ko en klic pade, se strošek uspelega zabeleži (dnevna omejitev).
    const settled = await Promise.allSettled(models.map((m) => askModel(m, user, createFn, n ? CARDS_SYSTEM : SYSTEM, { cards: n })));
    const results = settled.filter((s) => s.status === "fulfilled").map((s) => s.value);
    for (const r of results) {
      cost += costUsd(r.model, r.usage || {});
      usage?.log(null, r.model, r.usage, "verify");
    }
    const failed = settled.find((s) => s.status === "rejected");
    if (failed) return { ok: false, reason: `preverjanje ni uspelo: ${failed.reason?.message || failed.reason}`, cost };
    const bad = results.find((r) => !r.verdict.ok);
    const reason = bad ? `${bad.model}: ${bad.verdict.reason}` : undefined;
    // Kartica velja, ko jo potrdita oba modela.
    if (n) return { ok: !bad && results.length > 0, reason, cost, cards: Array.from({ length: n }, (_, i) => results.length > 0 && results.every((r) => r.verdict.cards[i])) };
    return bad ? { ok: false, reason, cost } : { ok: results.length > 0, cost };
  } catch (e) {
    return { ok: false, reason: `preverjanje ni uspelo: ${e.message}`, cost };
  }
}
