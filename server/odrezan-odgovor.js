// Odrezan odgovor inštruktorja (P1-2, j 26. 11. 2026, plan na issue #539): ko se odgovor konča na meji izhoda
// (stop_reason »max_tokens«; v načinu chat si razmislek in odgovor delita 3000 žetonov, Preizkus 3, 4. krog, naloge
// 68, 71, 73, 78), strežnik pokliče isti model največ ENKRAT, brez razmisleka, da odgovor nadaljuje. Nadaljevanje
// se pretaka kot nadaljnje delte (učenec vidi en odgovor) in se pripne besedilu ter porabi PRED vsem nadaljnjim
// (META, sodba in preverjanje, popravek, kartice, gumbi, predpomnilnik, shranjevanje).
// Modeli 4.6+ (Haiku 5.5, Sonnet 5.5, Opus 5.5) ne dovolijo predizpolnjenega odgovora (assistant prefill vrne 400),
// zato nadaljevanje teče prek zgodovine: [...isti pozivi, assistant: delno besedilo, user: skrito navodilo]. Sistemski
// prompt in orodja ostanejo enaki (predpomnjeni začetek). Brez prostora pod mejo AI, ob napaki ali ponovni meji izhoda
// dobi učenec kratko opombo (chat.cutNote) in lahko napiše »nadaljuj«; nikoli več kot en dodaten klic.
import SL from "../public/i18n/sl.js";
import { uiChain } from "../public/i18n/languages.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { addUsage } from "./claude.js";

export const CONTINUE_INSTRUCTION =
  "Your previous reply was cut off by the length limit. Continue exactly where it stopped, without repeating anything or greeting; if it stopped in the middle of a word, begin with that whole word. Finish the reply including the blocks and the META line.";

// Pozivi za nadaljevanje. Brez delnega besedila (ves izhod je šel v razmislek) isti pozivi: odgovor brez razmisleka.
export function continuationMessages(messages, partial) {
  const t = String(partial || "").trimEnd();
  if (!t) return messages;
  return [...messages, { role: "assistant", content: [{ type: "text", text: t }] }, { role: "user", content: [{ type: "text", text: CONTINUE_INSTRUCTION }] }];
}

// Šiv med delnim odgovorom in nadaljevanjem (pregled P1-2): model dobi delni odgovor brez končnih presledkov, zato
// nadaljevanje včasih začne brez presledka (»masa$m«) ali ponovi konec (»izraču« + »izračunamo«). Ponovljen konec
// (najdaljša končnica delnega odgovora, s katero se nadaljevanje začne: vsaj 6 znakov ali cela načeta beseda) se
// izpusti; sicer se med besedo in besedo (črka, številka, $) vstavi en presledek.
const MAX_OVERLAP = 200;
const MIN_OVERLAP = 6;
const wordStartAt = (s, i) => i === 0 || /\s/.test(s[i - 1]);
const overlapOk = (partial, n) => n >= MIN_OVERLAP || (/[\p{L}\p{N}]$/u.test(partial) && wordStartAt(partial, partial.length - n));
// null: nadaljevanje (buf) se še lahko izkaže za ponovitev konca, počakaj na več besedila (razen final).
export function seam(partial, buf, final = false) {
  const p = String(partial || "");
  const tail = p.slice(-MAX_OVERLAP);
  if (!final) for (let n = buf.length + 1; n <= tail.length; n++) if (tail.slice(-n).startsWith(buf) && overlapOk(p, n)) return null;
  let drop = 0;
  for (let n = Math.min(tail.length, buf.length); n >= 1; n--) {
    if (buf.startsWith(tail.slice(-n)) && overlapOk(p, n)) {
      drop = n;
      break;
    }
  }
  const out = buf.slice(drop);
  return !drop && /\S$/.test(p) && /^[\p{L}\p{N}$]/u.test(out) ? " " + out : out;
}

// Rezultat prvega klica z nadaljevanjem (text: nadaljevanje po šivu, kot ga je videl učenec): besedilo, vsebina,
// poraba in število klicev orodij skupaj; stopReason nadaljevanja (»end_turn« samo, če je odgovor res dokončan;
// »tool_use« pomeni, da odgovor ni dokončan, zato »max_tokens« in opomba). Čas (timing) ostane od prvega klica.
export function mergeContinuation(first, cont, text = cont.text) {
  return {
    ...first,
    text: (first.text || "") + (text || ""),
    content: [...(first.content || []), ...(cont.content || [])],
    usage: addUsage(first.usage || null, cont.usage || null),
    stopReason: cont.stopReason === "tool_use" ? "max_tokens" : cont.stopReason,
    toolCalls: (first.toolCalls || 0) + (cont.toolCalls || 0),
    continued: true,
  };
}

/**
 * Nadaljuje odgovor, ki se je končal na meji izhoda (največ en dodaten klic).
 * @param first rezultat streamFn
 * @param o.streamFn, o.args isti klic kot prvi (system, messages, mode, tools, onText, signal …)
 * @param o.reserveUsd(messages) najvišji strošek nadaljevanja; o.hold rezervacija zahteve (take/settle, server/usage.js)
 * @param o.costOf(model, usage) dejanski strošek klica: po uspehu ostane rezerviran (sprosti ga klicatelj po zapisu)
 * @param o.onLost(err) zapis porabe neuspelega nadaljevanja (ne ob prekinitvi: ta gre v zunanji catch)
 * @returns rezultat (pri neuspehu ali brez prostora prvi, s stopReason »max_tokens« → opomba); contCostUsd: strošek
 *   nadaljevanja, ki ostane v rezervaciji
 */
export async function continueCut(first, { streamFn, args, reserveUsd, hold, costOf, onLost = null }) {
  if (first?.stopReason !== "max_tokens" || args.signal?.aborted) return first;
  // Odgovor s klici orodij: zgodovina nadaljevanja krogov orodij nima, zato brez nadaljevanja (opomba).
  if (first.toolCalls) return first;
  const messages = continuationMessages(args.messages, first.text);
  const need = reserveUsd(messages);
  if (!hold.take(need)) return first;
  const partial = first.text || "";
  let buf = "";
  let decided = false;
  let shown = ""; // nadaljevanje, kot ga je dobil učenec (po šivu)
  const emit = (t) => {
    if (!t) return;
    shown += t;
    args.onText(t);
  };
  const onText = (chunk) => {
    if (decided) return emit(chunk);
    buf += chunk;
    const out = seam(partial, buf);
    if (out === null) return;
    decided = true;
    emit(out);
  };
  const flush = () => {
    if (!decided && buf) emit(seam(partial, buf, true));
    decided = true;
  };
  let keep = 0;
  try {
    const cont = await streamFn({
      ...args,
      messages,
      onText,
      noThinking: true, // brez razmisleka, kjer model to dovoli (Haiku; Opus 5.5 ga ne dovoli izklopiti)
      onPhase: null,
      // Brez izvajanja orodij in brez umika: umik bi učencu pobrisal že prikazan začetek odgovora.
      onToolUse: null,
      onRetract: null,
    });
    if (!decided && !buf && cont.text) buf = cont.text; // model brez pretakanja (preizkusi)
    flush();
    keep = Math.max(0, Math.min(need, costOf(cont.model || first.model, cont.usage || {})));
    return { ...mergeContinuation(first, cont, shown), contCostUsd: keep };
  } catch (e) {
    if (args.signal?.aborted) {
      // Prekinitev: zunanji catch zapiše porabo napake, zato nese oba klica.
      if (e && typeof e === "object") e.usage = addUsage(first.usage || null, e.usage || null);
      throw e;
    }
    onLost?.(e);
    console.warn(`[evklid] nadaljevanje odrezanega odgovora ni uspelo: ${e?.message || e}`);
    // Že pretočen del nadaljevanja ostane (zaslon in zgodovina enaka), odgovor ostane odrezan (opomba).
    flush();
    return shown ? { ...first, text: partial + shown, continued: true } : first;
  } finally {
    // Po uspehu ostane rezerviran dejanski strošek nadaljevanja, dokler ga klicatelj ne zapiše; sicer vse sproščeno.
    hold.settle(need - keep);
  }
}

// Opomba pod odrezanim odgovorom v jeziku odgovora (živi jeziki vmesnika, sicer veriga uiChain, nazadnje slovensko).
const here = path.dirname(fileURLToPath(import.meta.url));
const UI = new Map();
function uiText(code, key) {
  if (!UI.has(code)) {
    let j = {};
    try {
      j = JSON.parse(fs.readFileSync(path.join(here, "..", "public", "i18n", "ui", `${code}.json`), "utf8"));
    } catch {}
    UI.set(code, j);
  }
  return UI.get(code)[key];
}
/** Kratka opomba v ležečem tisku v jeziku učenca (veriga uiChain, sicer slovensko). */
export function uiNote(key, language = "sl") {
  let t = null;
  for (const c of uiChain(language || "sl")) {
    t = c === "sl" ? SL[key] : uiText(c, key);
    if (t) break;
  }
  return `\n\n*(${t || SL[key]})*`;
}
export function cutNote(language = "sl") {
  const key = "chat.cutNote";
  let t = null;
  for (const c of uiChain(language || "sl")) {
    t = c === "sl" ? SL[key] : uiText(c, key);
    if (t) break;
  }
  return `\n\n*(${t || SL[key]})*`;
}
