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
  "Your previous reply was cut off by the length limit. Continue exactly where it stopped, without repeating anything or greeting; finish the reply including the blocks and the META line.";

// Pozivi za nadaljevanje. Brez delnega besedila (ves izhod je šel v razmislek) isti pozivi: odgovor brez razmisleka.
export function continuationMessages(messages, partial) {
  const t = String(partial || "").trimEnd();
  if (!t) return messages;
  return [...messages, { role: "assistant", content: [{ type: "text", text: t }] }, { role: "user", content: [{ type: "text", text: CONTINUE_INSTRUCTION }] }];
}

// Rezultat prvega klica z nadaljevanjem: besedilo, vsebina, poraba in število klicev orodij skupaj; stopReason
// nadaljevanja (»end_turn« samo, če je odgovor res dokončan). Čas (timing) ostane od prvega klica.
export function mergeContinuation(first, cont) {
  return {
    ...first,
    text: (first.text || "") + (cont.text || ""),
    content: [...(first.content || []), ...(cont.content || [])],
    usage: addUsage(first.usage || null, cont.usage || null),
    stopReason: cont.stopReason,
    toolCalls: (first.toolCalls || 0) + (cont.toolCalls || 0),
    continued: true,
  };
}

/**
 * Nadaljuje odgovor, ki se je končal na meji izhoda (največ en dodaten klic).
 * @param first rezultat streamFn
 * @param o.streamFn, o.args isti klic kot prvi (system, messages, mode, tools, onText, signal …)
 * @param o.reserveUsd(messages) najvišji strošek nadaljevanja; o.hold rezervacija zahteve (take/settle, server/usage.js)
 * @param o.onLost(err) zapis porabe neuspelega nadaljevanja (ne ob prekinitvi: ta gre v zunanji catch)
 * @returns rezultat (pri neuspehu ali brez prostora prvi, s stopReason »max_tokens« → opomba)
 */
export async function continueCut(first, { streamFn, args, reserveUsd, hold, onLost = null }) {
  if (first?.stopReason !== "max_tokens" || args.signal?.aborted) return first;
  const messages = continuationMessages(args.messages, first.text);
  const need = reserveUsd(messages);
  if (!hold.take(need)) return first;
  try {
    const cont = await streamFn({
      ...args,
      messages,
      noThinking: true, // brez razmisleka, kjer model to dovoli (Haiku; Opus 5.5 ga ne dovoli izklopiti)
      onPhase: null,
      // Brez izvajanja orodij in brez umika: umik bi učencu pobrisal že prikazan začetek odgovora.
      onToolUse: null,
      onRetract: null,
    });
    return mergeContinuation(first, cont);
  } catch (e) {
    if (args.signal?.aborted) {
      // Prekinitev: zunanji catch zapiše porabo napake, zato nese oba klica.
      if (e && typeof e === "object") e.usage = addUsage(first.usage || null, e.usage || null);
      throw e;
    }
    onLost?.(e);
    console.warn(`[evklid] nadaljevanje odrezanega odgovora ni uspelo: ${e?.message || e}`);
    return first;
  } finally {
    hold.settle(need);
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
export function cutNote(language = "sl") {
  const key = "chat.cutNote";
  let t = null;
  for (const c of uiChain(language || "sl")) {
    t = c === "sl" ? SL[key] : uiText(c, key);
    if (t) break;
  }
  return `\n\n*(${t || SL[key]})*`;
}
