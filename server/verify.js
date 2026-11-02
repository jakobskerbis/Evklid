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

const SYSTEM = `You are a strict fact-checker for an AI tutor that teaches school and university maths, physics, chemistry and biology.
You receive the student's question and the tutor's answer (or flashcards made from it). The answer may be in any language.
Check every statement, number, calculation, unit, formula, chemical formula, definition and named fact. Recompute every calculation yourself.
Only factual or computational errors count. Teaching style, questions to the student, leaving steps for the student, hints and simplifications that are correct for the school level are fine.
If anything is wrong, or you are not sure it is right, it is not OK.
Reply with exactly one line: OK, or NAPAKA: <short reason>.`;

// Ena vrstica odgovora preverjevalca → { ok, reason }.
export function parseVerdict(text) {
  const t = String(text || "").trim();
  // »**OK**« ali »`OK`« je še vedno golo OK.
  if (/^OK\.?$/i.test(t.replace(/^[*`_\s]+|[*`_\s]+$/g, ""))) return { ok: true };
  const m = /NAPAKA\s*:?\s*(.*)/i.exec(t);
  return { ok: false, reason: (m ? m[1] : t).slice(0, 300) || "brez razloga" };
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

export async function askModel(model, user, createFn, system = SYSTEM) {
  const create = createFn || ((p) => getClient().messages.create(p));
  const r = await create({ model, max_tokens: 8000, output_config: { effort: EFFORT }, system, messages: [{ role: "user", content: user }] });
  const text = (r.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  // Odrezan (max_tokens) ali zavrnjen odgovor preverjevalca ni OK, tudi če se začne z »OK«.
  const cut = r.stop_reason && r.stop_reason !== "end_turn" && r.stop_reason !== "stop_sequence";
  const verdict = cut ? { ok: false, reason: `preverjevalec ni končal (${r.stop_reason})` } : parseVerdict(text);
  return { verdict, text, usage: r.usage, model: r.model || model };
}

/**
 * Preveri odgovor trikrat. `kind`: "answer" (celoten odgovor) ali "cards" (kartice).
 * @returns {Promise<{ok: boolean, reason?: string, cost: number}>}
 */
export async function verifyAnswer({ question, answer, kind = "answer", usage = null, createFn = null }) {
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
  const user = checkerUser({ question, answer, kind });
  let cost = 0;
  try {
    // allSettled: tudi ko en klic pade, se strošek uspelega zabeleži (dnevna omejitev).
    const settled = await Promise.allSettled(models.map((m) => askModel(m, user, createFn)));
    const results = settled.filter((s) => s.status === "fulfilled").map((s) => s.value);
    for (const r of results) {
      cost += costUsd(r.model, r.usage || {});
      usage?.log(null, r.model, r.usage, "verify");
    }
    const failed = settled.find((s) => s.status === "rejected");
    if (failed) return { ok: false, reason: `preverjanje ni uspelo: ${failed.reason?.message || failed.reason}`, cost };
    const bad = results.find((r) => !r.verdict.ok);
    return bad ? { ok: false, reason: `${bad.model}: ${bad.verdict.reason}`, cost } : { ok: results.length > 0, cost };
  } catch (e) {
    return { ok: false, reason: `preverjanje ni uspelo: ${e.message}`, cost };
  }
}
