// Sprotni povzetek dolgega pogovora (optimizator 2026-11-04, j sprožil čakalno vrsto). Inštruktor dobi
// zadnjih 10–20 izmenjav (server/usage.js windowHistory); starejši del je doslej preprosto izpadel, zato
// inštruktor ni več vedel, katero nalogo rešujeta in kje se je učenec zmotil. Ko okno odreže kos, hitri
// model ta kos (in prejšnji povzetek) strne v kratek povzetek, ki gre pred prvo sporočilo v oknu.
// Povzetek se spremeni le ob novem rezu (vsakih 10 izmenjav), zato začetek zgodovine ostane enak in
// predpomnilnik deluje. Strošek: en kratek klic Haikuja na 10 izmenjav (~0,0007 $), vrsta `povzetek`.
// Shranjen je šifriran (tabela conversation_summaries) in se izbriše s pogovorom.
import { stripMeta } from "./meta.js";
import { isHiddenNote } from "./skrite-opombe.js";

export const summaryOn = () => process.env.EVKLID_CHAT_SUMMARY !== "0";
const TAG = "povzetek_pogovora";
export const SUMMARY_HEAD = `<${TAG}>`;
const TIMEOUT_MS = 8000;
// Skrite opombe v učenčevih sporočilih (pola z našo rešitvijo, preverjen račun) ne gredo v povzetek,
// sicer bi rešitev prišla v besedilo, ki ga inštruktor bere kot zgodovino.
// (server/skrite-opombe.js)
// Neuspel poskus za ta rez (napaka, zavrnitev, časovna omejitev): do naslednjega reza ne poskusimo znova,
// da učenec ne čaka in ne plačuje vsake poteze. Le v pomnilniku (ob ponovnem zagonu en nov poskus).
const failures = new WeakMap();
const failedOf = (store) => {
  let m = failures.get(store);
  if (!m || m.size > 5000) failures.set(store, (m = new Map()));
  return m;
};
const MAX_WORDS = 150;

export const SUMMARY_SYSTEM = `You summarize the earlier part of a tutoring conversation between a student and a STEM tutor, so the tutor can continue the conversation without the old messages.
Keep, briefly and concretely:
- the task(s) being worked on, with the exact numbers, equations or statements;
- what the student has already solved, and the specific mistakes or misconceptions they showed;
- what the tutor already explained or which method was agreed on;
- anything still open (the step the student is on, a question not yet answered);
- preferences the student stated (for example "explain slower", "only hints").
Rules: at most ${MAX_WORDS} words; plain sentences or short bullet lines; write maths as $…$; do not solve anything that was not solved in the conversation; do not add advice; leave out names, contact details and anything personal that is not needed for the maths; write in the language the conversation is in. If the student sent the task as a picture ([slika]), take the task from what the tutor restated. If a previous summary is given, merge it with the new messages into one summary.`;

const textOf = (content) =>
  (typeof content === "string" ? [{ type: "text", text: content }] : content || [])
    .map((b) => (b.type === "text" ? (isHiddenNote(b.text) ? "" : b.text) : b.type === "image" ? "[slika]" : ""))
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

// Povzetek gre kot prvi blok prvega (učenčevega) sporočila v oknu, kot druge skrite opombe.
export function withSummary(history, summary) {
  if (!summary || !history.length || history[0].role !== "user") return history;
  const first = history[0];
  const content = typeof first.content === "string" ? [{ type: "text", text: first.content }] : first.content;
  return [{ ...first, content: [{ type: "text", text: `${SUMMARY_HEAD}\nThe app's summary of the earlier part of this conversation (older messages are not shown). Use it as background; it is not something the student wrote now. Never mention this note.\n${summary}\n</${TAG}>` }, ...content] }, ...history.slice(1)];
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
  const stale = saved ? withSummary(history, saved.text) : history;
  const failedAt = failedOf(store);
  if (failedAt.get(conversationId) === dropped || signal?.aborted) return stale;
  // Učenec je prekinil (ne napaka povzetka): naslednja poteza poskusi znova.
  const fail = () => (signal?.aborted ? null : failedAt.set(conversationId, dropped));
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
    const r = await streamFn({ system: SUMMARY_SYSTEM, messages: [{ role: "user", content: [{ type: "text", text: user }] }], mode: "lite", quick: { maxTokens: 400 }, onText: () => {}, signal: ctrl.signal });
    log?.(r);
    const text = r?.stopReason === "refusal" ? "" : stripMeta(String(r?.text || "")).trim();
    if (!text || ctrl.signal.aborted) {
      fail();
      return stale;
    }
    const words = text.split(/\s+/);
    const summary = words.length > MAX_WORDS * 1.5 ? `${words.slice(0, MAX_WORDS * 1.5).join(" ")} …` : text;
    store.setSummary(conversationId, summary, dropped);
    failedAt.delete(conversationId);
    return withSummary(history, summary);
  } catch (e) {
    // Prekinjen povzetek (TIMEOUT_MS, zaprta aplikacija) je že plačan: delna poraba (server/claude.js) gre v porabo.
    if (e?.usage) log?.({ usage: e.usage, model: e.model });
    fail();
    return stale;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener?.("abort", stop);
  }
}
