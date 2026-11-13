// Referenčni material za fakultetne predmete: prosto in zakonito dostopni viri
// (odprti učbeniki, zapiski predavanj, video, zbirke nalog, spletni tečaji).
//
// Podatki so v content/references/*.json (oblika je opisana v README.md tam):
//   themes      – tematska področja s seznamom virov (npr. »Organska kemija«)
//   courses     – predmet (ključ poti UNI-…) → id-ji tem
//   courseItems – gradivo, objavljeno prav za ta predmet (npr. skripta fakultete)
// Branje ne stane nič; povezave preveri `node scripts/preveri-reference.js`.
import "./env.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPath, getProgram, listProgramPaths } from "./curriculum.js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const REFERENCES_DIR = process.env.EVKLID_REFERENCES || path.join(here, "..", "content", "references");

export const REF_TYPES = ["ucbenik", "zapiski", "video", "naloge", "tecaj", "prirocnik"];

// Naloži in združi vse datoteke. Napake v podatkih javi takoj (ob zagonu in v testih).
export function loadReferences(dir = REFERENCES_DIR) {
  const data = { themes: {}, courses: {}, courseItems: {}, files: [] };
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  } catch {
    return data;
  }
  for (const f of files) {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    data.files.push(f);
    for (const [id, t] of Object.entries(d.themes || {})) {
      if (data.themes[id]) throw new Error(`reference: tema ${id} je v več datotekah (${f})`);
      data.themes[id] = { id, title: t.title, items: t.items || [], file: f };
    }
    for (const [k, ids] of Object.entries(d.courses || {})) data.courses[k] = [...new Set([...(data.courses[k] || []), ...ids])];
    for (const [k, items] of Object.entries(d.courseItems || {})) data.courseItems[k] = [...(data.courseItems[k] || []), ...items];
  }
  return data;
}

let DATA = null;
const data = () => (DATA ||= loadReferences());
// Za teste: drug imenik ali ponovno branje.
export function reloadReferences(dir) {
  DATA = loadReferences(dir);
  return DATA;
}

const pick = (it, theme) => ({
  title: it.title,
  url: it.url,
  source: it.source,
  author: it.author || null,
  lang: it.lang,
  type: it.type,
  desc: it.desc,
  license: it.license,
  theme,
});

// Viri za en predmet: najprej gradivo fakultete, nato viri tem; brez podvojenih povezav.
export function referencesFor(courseKey) {
  const d = data();
  const seen = new Set();
  const out = [];
  const add = (it, theme) => {
    if (!it?.url || seen.has(it.url)) return;
    seen.add(it.url);
    out.push(pick(it, theme));
  };
  for (const it of d.courseItems[courseKey] || []) add(it, null);
  for (const id of d.courses[courseKey] || []) {
    const t = d.themes[id];
    if (t) for (const it of t.items) add(it, t.title);
  }
  return out;
}

// Teme predmeta (za oznako »Področje«).
export function themesFor(courseKey) {
  const d = data();
  return (d.courses[courseKey] || []).map((id) => d.themes[id]?.title).filter(Boolean);
}

// Vsi predmeti študijskega programa z viri, po letnikih (izbirni na koncu).
export function programReferences(programId) {
  const prog = getProgram(programId);
  if (!prog) return null;
  const courses = listProgramPaths(programId).map((p) => ({
    key: p.key,
    label: getPath(p.key).label,
    group: p.elective ? "Izbirni predmeti" : `${p.year}. letnik`,
    year: p.year,
    themes: themesFor(p.key),
    items: referencesFor(p.key),
  }));
  return { program: programId, label: prog.label, courses };
}

// Povzetek za preverjanje in README: koliko tem, virov, slovenskih virov.
export function referenceStats() {
  const d = data();
  const items = [...Object.values(d.themes).flatMap((t) => t.items), ...Object.values(d.courseItems).flat()];
  const urls = new Set(items.map((i) => i.url));
  return {
    themes: Object.keys(d.themes).length,
    items: items.length,
    urls: urls.size,
    slovenian: items.filter((i) => i.lang === "sl").length,
    courses: Object.keys(d.courses).length,
    courseItems: Object.values(d.courseItems).flat().length,
  };
}

// Vsi viri (za preverjanje povezav).
export function allReferenceItems() {
  const d = data();
  return [
    ...Object.values(d.themes).flatMap((t) => t.items.map((it) => ({ ...it, where: `tema ${t.id}` }))),
    ...Object.entries(d.courseItems).flatMap(([k, items]) => items.map((it) => ({ ...it, where: `predmet ${k}` }))),
  ];
}
