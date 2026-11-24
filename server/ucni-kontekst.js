// Skrit učni kontekst ob vprašanju iz poskusa ali 3D modela (j, 24. 11. 2026, načrt »Evklid – povezan učni prostor«,
// faza B). Učenec v Laboratoriju ali 3D svetu pritisne »Vprašaj inštruktorja«; odjemalec pošlje z naslednjim
// sporočilom majhen posnetek: kateri poskus ali model, nastavitve, odčitke merilnikov, meritve, ki jih je učenec
// zapisal v tabelo, ali izbrani del modela. Inštruktor ga dobi kot dodaten blok v istem sporočilu (shrani se v
// zgodovino za API, ne v prikazano besedilo), kot opomba pole (server/paper-context.js).
//
// Varnost: poskus, model, strukturo atlasa in lekcijo strežnik poišče v svojih katalogih in vzame njihova imena; od
// odjemalca vzame le id-je ter kratke oznake in vrednosti kontrol, očiščene (brez < > [ ] { }, brez novih vrstic,
// omejene po dolžini in številu). Česar ni v katalogu, ni v opombi; zaklenjena lekcija se ne omeni. Pravila
// (ne trdi, da si meril; ne ugibaj manjkajočih meritev) so v opombi sami, zato se prompt inštruktorja ne spremeni.
// Ni osebnih podatkov: samo stanje poskusa ali modela.
//
// Zakaj nov modul (pravilo obsega kode, docs/pregled.md §1): paper-context.js gradi opombo iz podatkov pole in rešitve,
// ta iz kataloga poskusov in modelov (server/odpri.js); skupna je le oblika ovoja, ki je ena vrstica.
import { cleanText } from "./settings.js";
import { labExperiments, SIM_TOPICS, simsForTopic } from "../public/sim/katalog.js";
import { getTopic } from "./curriculum.js";
import { allModels, atlasNames } from "./odpri.js";

export const KONTEKST_TAG = "kontekst_ucenja";
export const MEJE = { parametri: 12, odcitki: 8, stolpci: 8, vrstice: 20, besedilo: 40, ime: 60 };

const cist = (v, n) => cleanText(typeof v === "number" && Number.isFinite(v) ? String(v) : typeof v === "string" ? v : "", n).replace(/[<>[\]{}"»«]/g, "").trim();
const idOk = (v, re = /^[a-z0-9]+(?:-[a-z0-9]+)*$/) => (typeof v === "string" && v.length <= 80 && re.test(v) ? v : "");

// [{ ime, vrednost }] → »ime = vrednost; …« (samo pari z obema deloma)
function pari(list, max) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const x of list.slice(0, max * 2)) {
    const ime = cist(x?.ime, MEJE.besedilo);
    const vrednost = cist(x?.vrednost, MEJE.besedilo);
    if (ime && vrednost) out.push(`${ime} = ${vrednost}`);
    if (out.length >= max) break;
  }
  return out;
}

// { stolpci: [..], vrstice: [[..], ..] } → { glava, vrstice } ali null; zadnjih MEJE.vrstice vrstic.
function tabela(m) {
  if (!m || typeof m !== "object" || !Array.isArray(m.stolpci) || !Array.isArray(m.vrstice)) return null;
  const glava = m.stolpci.slice(0, MEJE.stolpci).map((c) => cist(c, MEJE.besedilo) || "?");
  if (!glava.length) return null;
  const vrstice = m.vrstice
    .slice(-MEJE.vrstice)
    .filter(Array.isArray)
    .map((r) => glava.map((_, i) => cist(r[i], MEJE.besedilo) || "–"))
    .filter((r) => r.some((c) => c !== "–"));
  return vrstice.length ? { glava, vrstice } : null;
}

// Lekcija, ki je odklenjena za učenca, ali null (canOpen iz accounts.lessonInteractive; brez računov vse odprto).
function lekcija(id, canOpen) {
  const t = typeof id === "string" ? getTopic(id) : null;
  if (!t || (canOpen && !canOpen(t.id))) return null;
  return t;
}

// 3D model iz kode (id »<model>«): prva tema s pogonom »3d-<model>« na učenčevi poti, sicer katera koli.
function lekcijaModela(modelId, myPath, canOpen) {
  const hits = [];
  for (const topicId of Object.keys(SIM_TOPICS)) if (simsForTopic(topicId).some((d) => d.id === `3d-${modelId}`)) hits.push(topicId);
  hits.sort((a, b) => Number(getTopic(b)?.path === myPath) - Number(getTopic(a)?.path === myPath));
  for (const id of hits) {
    const t = lekcija(id, canOpen);
    if (t) return t;
  }
  return null;
}

const ovij = (lines) => `<${KONTEKST_TAG}>\n${lines.filter(Boolean).join("\n")}\nNever mention this note.\n</${KONTEKST_TAG}>`;
const POSTENO =
  "This is a snapshot the app took when the student pressed »Vprašaj inštruktorja«; you did not run, watch or measure anything yourself, so never say you did. " +
  "Use only the values listed here. If you need a value that is not listed, ask the student to read it in the experiment; never guess or invent measurements or readings.";
const RAZISKUJ =
  "Answer the student's question about this experiment with the student's own values where they help. If the student wants to explore, suggest changing one setting, say what you expect to happen and why, and ask the student to try it and tell you what they saw.";

/**
 * k: { v: 1, sourceType: "lab" | "model3d" | "atlas", sourceId, lessonId?, selectedObject?: { id, ime? },
 *      parameters?: [{ ime, vrednost }], readings?: [{ ime, vrednost }], measurements?: { stolpci, vrstice } }
 * Vrne besedilo skrite opombe ali "" (neveljaven ali neznan vir).
 */
export async function ucniKontekst(k, { canOpen = null, myPath = "" } = {}) {
  if (!k || typeof k !== "object" || Array.isArray(k)) return "";
  if (k.sourceType === "lab") {
    // Ključ poskusa je »lab-<id>« ali »lab-<id>:{"raven":"os"}« (katalog.js labKey): samo točno ujemanje s katalogom.
    const key = typeof k.sourceId === "string" && k.sourceId.length <= 120 ? k.sourceId : "";
    const x = key && labExperiments().find((e) => e.key === key);
    if (!x) return "";
    // Poskus je odklenjen, če je odklenjena vsaj ena njegova tema (server/laboratorij.js); sicer ni opombe.
    if (canOpen && !x.topics.some((tp) => canOpen(tp.id))) return "";
    const t = x.topics.some((tp) => tp.id === k.lessonId) ? lekcija(k.lessonId, canOpen) : null;
    const nastavitve = pari(k.parameters, MEJE.parametri);
    const odcitki = pari(k.readings, MEJE.odcitki);
    const tab = tabela(k.measurements);
    return ovij([
      `The student opened this chat from the Evklid virtual lab, experiment »${x.title}«${t ? ` (textbook topic »${t.name}«)` : ""}.`,
      nastavitve.length ? `Settings of the experiment's controls: ${nastavitve.join("; ")}.` : "The app could not read the experiment's settings.",
      odcitki.length ? `Readings shown on the simulated instruments at that moment: ${odcitki.join("; ")}.` : "",
      tab
        ? `Measurements the student recorded in the experiment's table (${tab.vrstice.length} rows; columns: ${tab.glava.join(" | ")}): ${tab.vrstice.map((r) => r.join(" | ")).join("; ")}.`
        : "The student has not recorded any measurements in the table yet.",
      POSTENO,
      RAZISKUJ,
    ]);
  }
  if (k.sourceType === "atlas") {
    const id = typeof k.selectedObject?.id === "string" && k.selectedObject.id.length <= 80 ? k.selectedObject.id : "";
    const s = id && atlasNames().find((x) => x.id === id);
    if (!s) return "";
    return ovij([
      `The student opened this chat from the Evklid 3D atlas of the human body with the structure »${s.sl}« selected.`,
      "Answer about this structure at the student's level: what it is, where it is and what it does; offer a short or a more detailed explanation if the question is open.",
      "You did not see the student's screen; only the selected structure is known.",
    ]);
  }
  if (k.sourceType === "model3d") {
    const id = idOk(k.sourceId);
    const m = id && (await allModels()).find((x) => x.id === id);
    if (!m) return "";
    const del = cist(k.selectedObject?.ime, MEJE.ime);
    const t = lekcijaModela(m.id, myPath, canOpen);
    return ovij([
      `The student opened this chat from the Evklid 3D model »${m.naslov}«${del ? ` with the part »${del}« selected` : ""}${t ? ` (textbook topic »${t.name}«)` : ""}.`,
      del
        ? "Answer about this part at the student's level: what it is and what role it has in the model; offer a short or a more detailed explanation if the question is open."
        : "Answer about this model at the student's level.",
      "You did not see the student's screen; only the model and the selected part are known.",
    ]);
  }
  return "";
}
