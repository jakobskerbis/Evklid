// Poštene oznake vsebine (N-03, načrt »Kakovost pred obsegom«, j 25. 11. 2026: »Jasno razlikuj strojno preverjeno
// vsebino od strokovno recenzirane vsebine«). Oznaka pove, kdo ali kaj je vsebino res preveril, in je nikoli ni brez
// dokaza v podatkih:
//
//   osnutek       lekcija še ni končala pregledov (stanje »osnutek«) ali program v njej najde napako
//   pregledal_ai  trije pregledi AI so končani (stanje »preverjeno«), program pa nima česa preračunati (npr. biologija)
//   strojno       Strojno preverjeno: program je lekcijo preveril in preračunal vsaj en račun ali identiteto, napak ni
//                 (server/lesson-check.js na trenutnem besedilu), pregledi AI so končani
//   strokovno     Strokovno pregledano: učitelj (človek) je lekcijo pregledal; v glavi »stanje: pregledano«,
//                 »pregledal: <ime>« in »pregledano: LLLL-MM-DD« (datum ni v prihodnosti)
//   formalno      Formalno dokazano: N trditev iz lekcije je dokazal Lean (lean/Evklid/Lekcije/**, docs/lean.md) in
//                 lekcija se po dokazu ni spremenila (sha256 v glavi dokaza). Vedno s številom trditev: dokaz posameznih
//                 trditev ni dokaz cele lekcije (PV-01, docs/preverjanje.md).
//
// Oznake so oznake izvora in pregleda celote. Status posamezne trditve (sedem statusov, public/preverjanje/statusi.js)
// je druga stvar: »strojno« lekcije pomeni le, da program ni našel napake v računih, ki jih zna preračunati.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { checkLessonSource, veljavenDatumPregleda } from "./lesson-check.js";
import { lessonSource, parseLesson } from "./textbook.js";
import { validatePaper, loadOurPaper, ourPaperIds } from "./our-papers.js";
import { PAPER_STRUCTURES } from "./our-paper-structures.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LEAN_DIR = path.join(ROOT, "lean", "Evklid", "Lekcije");

export const OZNAKE = ["osnutek", "pregledal_ai", "strojno", "strokovno", "formalno"];

export const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

export const veljavenDatum = veljavenDatumPregleda;

// Je ime človeka (ne modela ali programa): enako pravilo kot »pregledal:« v server/lesson-check.js.
export const imeCloveka = (s) => typeof s === "string" && s.trim().length >= 2 && !/(?<![\p{L}\p{N}])(ai|opus|sonnet|haiku|fable|claude|gpt|gemini|program)(?![\p{L}\p{N}])/iu.test(s);

/**
 * Oznake iz dokazov. Edina pravila za oznake; vse drugo samo zbere dokaze.
 *   stanje:      »osnutek« | »preverjeno« | »pregledano« (glava lekcije)
 *   pregledal:   ime učitelja iz glave ali null
 *   pregledano:  datum pregleda iz glave (LLLL-MM-DD) ali null
 *   preverjanje: { napake, koraki } iz programa na trenutnem besedilu ali null (ni bilo preverjeno)
 *   lean:        { izreki, svez } ali null (ni dokazov)
 * Vrne seznam oznak { id, ... } v vrstnem redu prikaza.
 */
export function oznakeIzDokazov({ stanje = "osnutek", pregledal = null, pregledano = null, preverjanje = null, lean = null } = {}, danes = new Date()) {
  const out = [];
  const pregledi = stanje === "preverjeno" || stanje === "pregledano";
  const brezNapak = !!preverjanje && Number.isInteger(preverjanje.napake) && preverjanje.napake === 0;
  const koraki = brezNapak && Number.isInteger(preverjanje.koraki) && preverjanje.koraki > 0 ? preverjanje.koraki : 0;
  if (!pregledi || !brezNapak) out.push({ id: "osnutek" });
  else if (koraki) out.push({ id: "strojno", koraki });
  else out.push({ id: "pregledal_ai" });
  if (stanje === "pregledano" && brezNapak && imeCloveka(pregledal) && veljavenDatum(pregledano, danes)) out.push({ id: "strokovno", datum: pregledano });
  if (lean && lean.svez === true && Number.isInteger(lean.izreki) && lean.izreki > 0) out.push({ id: "formalno", izreki: lean.izreki });
  return out;
}

// Dokazi Lean po lekcijah: glava »vir: content/lessons/<pot>.md« in »sha256: …« (docs/lean.md, L2), izreki so vrstice,
// ki se začnejo s »theorem« ali »lemma« (»example« je samo pokazatelj, da se predpostavke dajo izpolniti).
// Koda Lean brez komentarjev (»-- …« in gnezdeni »/- … -/«): izrek v komentarju ni izrek.
export function brezKomentarjev(txt) {
  let out = "";
  let globina = 0;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    const n = txt[i + 1];
    if (c === "/" && n === "-") {
      globina++;
      i++;
    } else if (globina && c === "-" && n === "/") {
      globina--;
      i++;
    } else if (globina) {
      if (c === "\n") out += c;
    } else if (c === "-" && n === "-") {
      while (i + 1 < txt.length && txt[i + 1] !== "\n") i++;
    } else out += c;
  }
  return out;
}

let leanIndex = null;
export function leanDokazi(dir = LEAN_DIR) {
  if (leanIndex && dir === LEAN_DIR) return leanIndex;
  const idx = new Map();
  const walk = (d) => {
    let ents = [];
    try {
      ents = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".lean")) {
        const txt = fs.readFileSync(p, "utf8");
        const vir = /^vir: (content\/lessons\/\S+\.md)$/m.exec(txt)?.[1];
        const sha = /^sha256: ([0-9a-f]{64})$/m.exec(txt)?.[1];
        if (!vir || !sha || idx.has(vir)) continue; // brez glave ali podvojeno: ni dokaz (scripts/lean-lekcije.mjs to javi)
        const koda = brezKomentarjev(txt);
        if (/(?<![\w.'])(sorry|admit|axiom|native_decide)(?![\w'])/.test(koda)) continue; // prepovedano (docs/lean.md): ni dokaz
        const izreki = (koda.match(/^(?:(?:private|protected|public|nonrec)\s+)*(?:theorem|lemma)\s/gm) || []).length;
        idx.set(vir, { sha, izreki });
      }
    }
  };
  walk(dir);
  if (dir === LEAN_DIR) leanIndex = idx;
  return idx;
}

// Oznake lekcije teme. Program preveri besedilo, ki ga učenec vidi, enkrat na različico datoteke (~25 ms); oznake se
// iz dokazov sestavijo ob vsakem klicu (datum pregleda, svežina dokaza Lean).
const lessonCache = new Map(); // datoteka -> { mtime, size, meta, preverjanje, sha }
export function oznakeLekcije(topicId, { danes = new Date(), lean = leanDokazi() } = {}) {
  const src = lessonSource(topicId);
  if (!src) return null;
  let st;
  try {
    st = fs.statSync(src.file);
  } catch {
    return null;
  }
  let hit = lessonCache.get(src.file);
  if (!hit || hit.mtime !== st.mtimeMs || hit.size !== st.size) {
    const buf = fs.readFileSync(src.file);
    const text = buf.toString("utf8");
    let preverjanje = null;
    try {
      const r = checkLessonSource(text, src.id);
      preverjanje = { napake: r.errors.length, koraki: (r.calcChecked || 0) + (r.identitiesChecked || 0) };
    } catch {
      preverjanje = null; // program ni mogel preveriti: brez oznake »strojno«
    }
    hit = { mtime: st.mtimeMs, size: st.size, meta: parseLesson(text).meta, preverjanje, sha: sha256(buf) };
    lessonCache.set(src.file, hit);
  }
  const rel = path.relative(ROOT, src.file).split(path.sep).join("/");
  const l = lean.get(rel);
  const { meta } = hit;
  return oznakeIzDokazov(
    { stanje: meta.stanje, pregledal: meta.pregledal || null, pregledano: meta.pregledano || null, preverjanje: hit.preverjanje, lean: l ? { izreki: l.izreki, svez: l.sha === hit.sha } : null },
    danes,
  );
}

// Oznake naše pole: napisal AI, pregledali trije pregledovalci AI (docs/token-rules.md), program preračuna korake
// (validatePaper). »strojno« samo, če pola gre skozi preverjanje in je program preračunal vsaj en korak; »strokovno«
// samo z imenom učitelja in datumom v poli (»pregledal«, »pregledano«).
const paperCache = new Map(); // pola -> { mtime, size, preverjanje, pregledal, pregledano }
export function oznakePole(id, { danes = new Date() } = {}) {
  const file = ourPaperIds().get(String(id));
  let st = null;
  try {
    st = file ? fs.statSync(file) : null;
  } catch {
    st = null;
  }
  if (!st) return null;
  let hit = paperCache.get(id);
  // Ob spremembi datoteke pola znova skozi program (loadOurPaper jo bere ob vsakem klicu): oznaka ni starejša od vsebine.
  if (!hit || hit.mtime !== st.mtimeMs || hit.size !== st.size) {
    const paper = loadOurPaper(id);
    if (!paper) return null;
    let preverjanje = null;
    try {
      const r = validatePaper(paper, PAPER_STRUCTURES[id] || null);
      preverjanje = { napake: r.errors.length, koraki: r.checked || 0 };
    } catch {
      preverjanje = null;
    }
    hit = { mtime: st.mtimeMs, size: st.size, preverjanje, pregledal: paper.pregledal || null, pregledano: paper.pregledano || null };
    paperCache.set(id, hit);
  }
  return oznakeIzDokazov({ stanje: hit.pregledal ? "pregledano" : "preverjeno", pregledal: hit.pregledal, pregledano: hit.pregledano, preverjanje: hit.preverjanje }, danes);
}

// Staro polje lesson.status za stare odjemalce, ki iz njega izrišejo opombo: nikoli močnejše od oznak.
export function stanjeZaStare(status, oznake) {
  if (!Array.isArray(oznake) || oznake.some((o) => o.id === "osnutek")) return "osnutek";
  if (status === "pregledano" && !oznake.some((o) => o.id === "strokovno")) return "preverjeno";
  return status;
}
