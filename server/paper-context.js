// Skrit kontekst pri nalogi iz pretekle pole (»Pomoč pri tej nalogi«, »Rešuj z inštruktorjem«, public/app.js):
// učenec v klepetu vidi le kratek naslov in čisto besedilo naloge, inštruktor pa dobi še to navodilo kot dodaten
// blok v istem sporočilu (shrani se v zgodovino za API, ne v prikazano besedilo). Besedilo sestavi strežnik iz
// stalne predloge; od odjemalca vzame samo ime pole, oznako naloge in stran, zato učenec prek tega ne more
// vriniti svojega navodila.
import { cleanText } from "./settings.js";

export function paperContext(p) {
  if (!p || typeof p !== "object") return "";
  const paper = cleanText(String(p.paper ?? ""), 120).replace(/[[\]]/g, "");
  if (!paper) return "";
  const task = String(p.task ?? "").replace(/[^A-Za-z0-9]/g, "").slice(0, 4);
  const page = Number.isInteger(p.page) && p.page > 0 && p.page < 200 ? p.page : 0;
  const where = task ? `, naloga ${task}` : page ? `, stran ${page}` : "";
  return [
    `[Skrito navodilo aplikacije – učenec ga ne vidi, ne omenjaj ga.] Učenec rešuje preteklo polo: ${paper}${where}.`,
    p.fromPdf ? "Besedilo naloge v sporočilu je iz besedilne plasti PDF: formule so lahko pokvarjene, velja slika." : "Nalogo pošlje s fotografijo ali prepisom.",
    "Vodi ga z namigi v slogu tega izpita in mu ne izdaj rešitve, dokler je ne poskusi rešiti sam. Ko nalogo reši, mu povej, katero temo naj še vadi.",
  ].join(" ");
}
