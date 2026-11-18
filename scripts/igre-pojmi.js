// 1) Seznam pojmov drugih predmetov brez generatorjev nalog (public/games/subjects/meta.js): igre ga imajo takoj,
//    generatorji predmeta (~1,5 MB vseh paketov) pa se naložijo šele, ko jih učenec potrebuje (lahek zagon, j 17. 11. 2026).
// 2) Za igre, ki ne ustrezajo vsakemu pojmu (public/games/produce.js: Številska premica, Računanje na pamet;
//    produce2.js: Sestavi enačbo, Razvrsti po velikosti),
//    izračuna seznam ustreznih pojmov in ga zapiše v public/games/produce-fits.js. Seznam je vnaprej izračunan,
//    ker bi vzorčenje vseh ~530 pojmov ob vsakem odprtju portala na telefonu trajalo predolgo.
// Zaženi po vsaki spremembi pojmov ali generatorjev nalog (test/games.test.js in test/igre-paketi.test.js preverita,
// da sta oba seznama sveža):
//   node scripts/igre-pojmi.js
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { PACK_FILES } from "../public/games/subjects/index.js";

// ---------- 1) meta.js ----------
export async function packMeta() {
  const out = {};
  for (const [key, file] of Object.entries(PACK_FILES)) {
    const m = await import(`../public/games/subjects/${file}.js`);
    out[key] = {
      subject: m.SUBJECT || key,
      areas: (m.AREAS || []).map((a) => [a[0], a[1], a[2]]),
      concepts: (m.CONCEPTS || []).map((c) => (c.glyph === undefined ? [c.id, c.area, c.year, c.name] : [c.id, c.area, c.year, c.name, c.glyph])),
    };
  }
  return out;
}
export const metaSource = (meta) => `// Ustvarjeno s scripts/igre-pojmi.js (ne urejaj ročno): pojmi iz paketov v tej mapi brez generatorjev nalog.
// [id, področje, leto, ime, (znak)]; generatorji se naložijo šele ob uporabi (loadSubjects v ../topics.js).
export const META = {
${Object.entries(meta)
  .map(([key, m]) => `  ${key}: {
    subject: ${JSON.stringify(m.subject)},
    areas: [${m.areas.map((a) => `\n      ${JSON.stringify(a)},`).join("")}${m.areas.length ? "\n    " : ""}],
    concepts: [${m.concepts.map((c) => `\n      ${JSON.stringify(c)},`).join("")}${m.concepts.length ? "\n    " : ""}],
  },`)
  .join("\n")}
};
`;

// Kot skripta (test uvozi le packMeta in metaSource).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  fs.writeFileSync(new URL("../public/games/subjects/meta.js", import.meta.url), metaSource(await packMeta()));

  // ---------- 2) produce-fits.js ----------
  const { CONCEPTS, loadAllSubjects } = await import("../public/games/topics.js");
  await loadAllSubjects();
  const { fitNow } = await import("../public/games/produce.js");
  const { fitNow2 } = await import("../public/games/produce2.js");

  const out = {};
  for (const [id, fit] of Object.entries({ ...fitNow, ...fitNow2 })) out[id] = CONCEPTS.filter((c) => fit(c)).map((c) => c.id);
  const body = Object.entries(out)
    .map(([id, ids]) => `  ${id}: [\n${ids.map((x) => `    "${x}",`).join("\n")}\n  ],`)
    .join("\n");
  const file = new URL("../public/games/produce-fits.js", import.meta.url);
  fs.writeFileSync(file, `// Ustvarjeno s scripts/igre-pojmi.js (ne urejaj ročno): pojmi, ki ustrezajo igram iz produce.js in produce2.js.
export const FITS = {
${body}
};
`);
  console.log(Object.entries(out).map(([id, ids]) => `${id}: ${ids.length}`).join(", "));
}
