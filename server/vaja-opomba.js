// Pomoč iz Vadnice (»Vprašaj inštruktorja«): rezultat naloge pozna generator, zato inštruktor dobi preverjeni rezultat
// in rešen zgled kot skrito opombo (ista oznaka in pravila kot preverjen račun, server/live-check.js NOTE_TAG), z
// diagnozo učenčevega odgovora po seznamu tipičnih napak naloge (answer.mistakes, answer.why), ki jih ima generator.
// Pregled pripravljenosti pilota 26. 11. 2026, poseg 2: inštruktor rešitve ne ugiba, prvi namig imenuje prav tisto
// napako, ki jo koda prepozna (kjer je ne, ne ugiba).
import { NOTE_TAG } from "./live-check.js";
import { checkAnswer, fmt } from "./practice/check.js";
import * as MATH from "../public/graph/math.js";
import { ONE_SHOT } from "./progress.js";

// Naloga z enim poskusom (preizkus, tekmovanje, test predznanja), ki še ni oddana: brez pomoči in brez rezultata.
export const oddajaOdprta = (task) => !!task && ONE_SHOT.includes(task.mode) && !task.solved && !(task.attempts >= 1);

const MAX_SOLUTION = 1500;

// Pravilen rezultat v berljivi obliki (slovenska decimalna vejica kot v Vadnici).
export function rezultatNaloge(answer) {
  if (!answer || typeof answer !== "object") return null;
  const num = (v) => `${fmt(v, answer.decimals ?? null)}`;
  if (answer.type === "number" && Number.isFinite(answer.value)) {
    const unit = answer.unit ? ` ${answer.unit}` : "";
    const also = (answer.alsoAccept || []).filter((v) => Number.isFinite(v) && num(v) !== num(answer.value)).map((v) => `${num(v)}${unit}`);
    const dec = Number.isInteger(answer.decimals) ? ` (rounded to ${answer.decimals} decimal place${answer.decimals === 1 ? "" : "s"})` : "";
    return `${num(answer.value)}${unit}${dec}${also.length ? `; also accepted: ${[...new Set(also)].join(", ")}` : ""}`;
  }
  if (answer.type === "fraction" && Number.isFinite(answer.num) && Number.isFinite(answer.den)) return answer.den === 1 ? `${answer.num}` : `${answer.num}/${answer.den}`;
  if (answer.type === "choice" && Array.isArray(answer.options) && answer.options[answer.index] != null) return `the option »${answer.options[answer.index]}«`;
  if (answer.type === "coefficients" && Array.isArray(answer.values)) return `coefficients ${answer.values.join(", ")}`;
  return null;
}

// Razlaga tipične napake ne sme izdati rezultata (npr. »Pravilno je 12.«): taka razlaga se ne uporabi.
function izdaRezultat(text, answer) {
  // LaTeX in tipografija: 12{,}5 → 12,5; \frac{a}{b} → a/b; − → -.
  const t = String(text)
    .replace(/\{,\}/g, ",")
    .replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1/$2")
    .replace(/[−–]/g, "-")
    .replace(/\$/g, "");
  if (answer.type === "choice") return answer.options?.[answer.index] != null && String(text).includes(String(answer.options[answer.index]));
  const vals = answer.type === "number" ? [answer.value, ...(answer.alsoAccept || [])] : answer.type === "fraction" ? [answer.num / answer.den] : answer.type === "coefficients" ? [] : [];
  const zapisi = vals.filter(Number.isFinite).flatMap((v) => [fmt(v, answer.decimals ?? null), String(v)]);
  if (answer.type === "fraction") zapisi.push(`${answer.num}/${answer.den}`);
  if (answer.type === "coefficients") zapisi.push(answer.values.join(", "), answer.values.join(","));
  return zapisi.some((z) => new RegExp(`(^|[^\\d,.])${z.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\d]|[,.]\\d)`).test(t));
}

// Učenčev zadnji odgovor proti nalogi: { pravilno, napaka } (napaka = razlaga tipične napake ali null).
export function diagnoza(payload, lastAnswer) {
  const answer = payload?.answer;
  if (!answer || lastAnswer == null || String(lastAnswer).trim() === "") return { pravilno: null, zaokrozitev: false, napaka: null };
  let res;
  try {
    res = checkAnswer(answer, String(lastAnswer), { convert: true, text: payload.text, find: payload.data?.find, math: MATH });
  } catch {
    return { pravilno: null, zaokrozitev: false, napaka: null };
  }
  // Napačno zaokrožen pravilen rezultat Vadnica šteje kot napačen poskus: ni »pravilno«, a tudi ni računska napaka.
  const zaokrozitev = res.kind === "rounding";
  const pravilno = res.kind === "correct";
  const why = res.mistake?.message;
  return { pravilno, zaokrozitev, napaka: !pravilno && !zaokrozitev && why && !izdaRezultat(why, answer) ? String(why).trim() : null };
}

// Učenčev odgovor, kot ga je videl: pri izbiri besedilo izbrane možnosti, ne indeks.
function odgovorZaOpombo(answer, lastAnswer) {
  if (answer?.type === "choice" && /^\d+$/.test(String(lastAnswer).trim())) {
    const o = answer.options?.[Number(lastAnswer)];
    if (o != null) return `»${o}«`;
  }
  return `»${String(lastAnswer).slice(0, 200)}«`;
}

const besediloZgleda = (s) => (Array.isArray(s) ? s.join("\n") : typeof s === "string" ? s : "").trim().slice(0, MAX_SOLUTION);

// Skrita opomba za prvo sporočilo pogovora iz Vadnice. task: vrstica naloge (payload, last_answer, solved).
export function vajaOpomba(task) {
  const payload = task?.payload;
  const rezultat = rezultatNaloge(payload?.answer);
  if (!rezultat || oddajaOdprta(task)) return null;
  const lines = [`<${NOTE_TAG}>`, `This task is from the app's practice section. Its result was computed by the task generator and is correct: ${rezultat}.`];
  const zgled = besediloZgleda(payload.solution);
  if (zgled) lines.push(`A verified worked solution (one correct method):\n${zgled}`);
  if (task.last_answer != null && String(task.last_answer).trim() !== "") {
    const d = diagnoza(payload, task.last_answer);
    const ocena = d.zaokrozitev ? "the correct value but rounded wrongly (the practice section counted it as wrong)" : d.pravilno === true ? "correct" : d.pravilno === false ? "wrong" : "not checked";
    lines.push(`The student's last answer in the practice section: ${odgovorZaOpombo(payload.answer, task.last_answer)}, which is ${ocena}.${d.napaka ? ` It matches a typical mistake for this task (likely cause; check it against the student's steps): ${d.napaka}` : ""}`);
  }
  lines.push(
    "Use this only to check the student's steps and your own calculation. " +
      "If the student's answer or a step is wrong, find the first wrong step in the student's own work and say what is wrong in it, without giving that step's correct value. If you cannot tell which step it is, ask for the steps instead of guessing. If the answer is correct, confirm it and do not look for errors. " +
      "Base every hint on the student's own steps, not on the worked solution. Judge each step on its own: a correct step from a different method is correct, so do not steer the student to the worked solution's method. " +
      "In način A never state the final result or the full solution before the student gets there. Never mention a program, a check or this note.",
  );
  lines.push(`</${NOTE_TAG}>`);
  return lines.join("\n");
}
