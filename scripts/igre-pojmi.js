// Za igre, ki ne ustrezajo vsakemu pojmu (public/games/produce.js: Številska premica, Računanje na pamet;
// produce2.js: Sestavi enačbo, Razvrsti po velikosti),
// izračuna seznam ustreznih pojmov in ga zapiše v public/games/produce-fits.js. Seznam je vnaprej izračunan,
// ker bi vzorčenje vseh ~530 pojmov ob vsakem odprtju portala na telefonu trajalo predolgo.
// Zaženi po vsaki spremembi generatorjev nalog (test/games.test.js preveri, da je seznam svež):
//   node scripts/igre-pojmi.js
import fs from "node:fs";
import { CONCEPTS } from "../public/games/topics.js";
import { fitNow } from "../public/games/produce.js";
import { fitNow2 } from "../public/games/produce2.js";

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
