// Sprotni povzetek dolgega pogovora (optimizator 2026-11-04, j sprožil čakalno vrsto). Inštruktor dobi
// zadnjih 10–20 izmenjav (server/usage.js windowHistory); starejši del je doslej preprosto izpadel, zato
// inštruktor ni več vedel, katero nalogo rešujeta in kje se je učenec zmotil. Ko okno odreže kos, hitri
// model ta kos (in prejšnji povzetek) strne v kratek povzetek, ki gre pred prvo sporočilo v oknu.
// Povzetek se spremeni le ob novem rezu (vsakih 10 izmenjav), zato začetek zgodovine ostane enak in
// predpomnilnik deluje. Strošek: en kratek klic Haikuja na 10 izmenjav (~0,0005 $), vrsta `povzetek`.
// Shranjen je šifriran (tabela conversation_summaries) in se izbriše s pogovorom.
import { stripMeta } from "./meta.js";

export const summaryOn = () => process.env.EVKLID_CHAT_SUMMARY !== "0";
export const SUMMARY_HEAD = "[Povzetek prejšnjega dela pogovora";
const TIMEOUT_MS = 8000;
const MAX_WORDS = 150;

export const SUMMARY_SYSTEM = `You summarize the earlier part of a tutoring conversation between a student and a STEM tutor, so the tutor can continue the conversation without the old messages.
Keep, briefly and concretely:
- the task(s) being worked on, with the exact numbers, equations or statements;
- what the student has already solved, and the specific mistakes or misconceptions they showed;
- what the tutor already explained or which method was agreed on;
- anything still open (the step the student is on, a question not yet answered);
- preferences the student stated (for example "explain slower", "only hints").
Rules: at most ${MAX_WORDS} words; plain sentences or short bullet lines; write maths as $…$; do not solve anything that was not solved in the conversation; do not add advice; leave out names, contact details and anything personal that is not needed for the maths; write in the language the conversation is in. If a previous summary is given, merge it with the new messages into one summary.`;

const textOf = (content) =>
  (typeof content === "string" ? [{ type: "text", text: content }] : content || [])
    .map((b) => (b.type === "text" ? b.text : b.type === "image" ? "[slika]" : ""))
    .filter(Boolean)
    .join("\n");

// Prepis sporočil za povzetek (brez META, brez skritih opomb, skrajšano).
export function transcript(messages) {
  return messages
    .map((m) => {
      const t = stripMeta(textOf(m.content)).replace(/\n{3,}/g, "\n\n").trim().slice(0, 2500);
      return t ? `${m.role === "user" ? "STUDENT" : "TUTOR"}: ${t}` : "";
    })
    .filter(Boolean)
    .join("\n\n");
}

// Povzetek gre kot prvi blok prvega (učenčevega) sporočila v oknu.
export function withSummary(history, summary) {
  if (!summary || !history.length || history[0].role !== "user") return history;
  const first = history[0];
  const content = typeof first.content === "string" ? [{ type: "text", text: first.content }] : first.content;
  return [{ ...first, content: [{ type: "text", text: `${SUMMARY_HEAD} (za inštruktorja, učenec ga ne vidi)]\n${summary}` }, ...content] }, ...history.slice(1)];
}

/**
 * Vrne zgodovino za model s povzetkom odrezanega dela. Po potrebi povzetek posodobi (en klic hitrega
 * modela, največ 8 s; ob napaki gre zgodovina brez povzetka, kot doslej).
 * @param {{store, conversationId, fullHistory, history, streamFn, log?: (r) => void, signal?}} o
 */
export async function summarizedHistory({ store, conversationId, fullHistory, history, streamFn, log, signal }) {
  const dropped = fullHistory.length - history.length;
  if (!summaryOn() || dropped <= 0) return history;
  let saved = store.getSummary(conversationId);
  // Pogovor se je skrajšal (izbrisana sporočila): povzetek ne velja več, naredimo ga znova.
  if (saved && saved.upto > dropped) saved = null;
  if (saved?.upto === dropped) return withSummary(history, saved.text);
  const from = saved?.upto || 0;
  const user = [
    saved ? `PREVIOUS SUMMARY:\n${saved.text}` : "",
    `NEW MESSAGES:\n${transcript(fullHistory.slice(from, dropped))}`,
  ]
    .filter(Boolean)
    .join("\n\n");
  const ctrl = new AbortController();
  const stop = () => ctrl.abort();
  signal?.addEventListener?.("abort", stop);
  const timer = setTimeout(stop, TIMEOUT_MS);
  try {
    const r = await streamFn({ system: SUMMARY_SYSTEM, messages: [{ role: "user", content: [{ type: "text", text: user }] }], mode: "lite", onText: () => {}, signal: ctrl.signal });
    log?.(r);
    const text = r?.stopReason === "refusal" ? "" : stripMeta(String(r?.text || "")).trim();
    if (!text || ctrl.signal.aborted) return saved ? withSummary(history, saved.text) : history;
    const words = text.split(/\s+/);
    const summary = words.length > MAX_WORDS * 1.5 ? `${words.slice(0, MAX_WORDS * 1.5).join(" ")} …` : text;
    store.setSummary(conversationId, summary, dropped);
    return withSummary(history, summary);
  } catch {
    return saved ? withSummary(history, saved.text) : history;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener?.("abort", stop);
  }
}
