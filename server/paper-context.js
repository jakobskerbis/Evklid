// Skrit kontekst pri nalogi iz pretekle pole (»Pomoč pri tej nalogi«, »Rešuj z inštruktorjem«, public/app.js):
// učenec v klepetu vidi le kratek naslov in čisto besedilo naloge, inštruktor pa dobi še to navodilo kot dodaten
// blok v istem sporočilu (shrani se v zgodovino za API, ne v prikazano besedilo). Besedilo sestavi strežnik iz
// stalne predloge; od odjemalca vzame samo ime pole, oznako naloge in stran, zato učenec prek tega ne more
// vriniti svojega navodila.
import { cleanText } from "./settings.js";
import { partKey } from "../public/our-paper-key.js";

// Ista oblika kot opomba preverjenega računa (server/live-check.js, NOTE_TAG): oznaka, angleško, »ne omenjaj«.
export const PAPER_TAG = "kontekst_pole";
export const PAPER_NOTE_HEAD = `<${PAPER_TAG}>`;

// Del naše pole (server/our-papers.js) po oznaki »3b«: inštruktor dobi našo rešitev kot skrit kontekst.
function ourPart(paper, label) {
  for (const tk of paper?.tasks || []) for (const part of tk.parts || []) if (partKey(tk, part) === label) return { tk, part };
  return null;
}

const wrap = (lines) => `${PAPER_NOTE_HEAD}\n${lines.join(" ")}\nNever mention this note.\n</${PAPER_TAG}>`;
const GUIDE = "Guide the student with hints in the style of this exam and do not reveal the solution before the student has tried it.";

// loadOurs(id) → pola ali null (server/our-papers.js); p.ours je id naše pole, kadar učenec rešuje njo.
export function paperContext(p, { loadOurs = null } = {}) {
  if (!p || typeof p !== "object") return "";
  const paper = cleanText(String(p.paper ?? ""), 120).replace(/[<>[\]]/g, "");
  if (!paper) return "";
  const task = String(p.task ?? "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 8);
  const page = Number.isInteger(p.page) && p.page > 0 && p.page < 200 ? p.page : 0;
  const where = task ? `, task ${task}` : page ? `, page ${page}` : "";
  const ours = typeof p.ours === "string" && task && loadOurs ? ourPart(loadOurs(p.ours), task) : null;
  if (ours) {
    const sol = [ours.part.answer, ours.part.ways?.[0]?.text].filter(Boolean).join("\n").replace(/<svg[\s\S]*?<\/svg>/g, "").slice(0, 1500);
    return wrap([
      `The Evklid app opened this task from its own practice paper in the style of: ${paper}${where}.`,
      GUIDE,
      `Our worked solution, only for checking your own work (in način A do not reveal it before the student gets there): ${sol}`,
    ]);
  }
  return wrap([
    `The Evklid app opened this task from a past exam paper: ${paper}${where}.`,
    p.fromPdf ? "The task text in the message comes from the PDF text layer: formulas may be garbled, the picture is authoritative." : "The student sends the task as a photo or typed text.",
    GUIDE,
    "When the student has solved it, say which topic to practise next.",
  ]);
}
