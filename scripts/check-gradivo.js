#!/usr/bin/env node
// Preveri obliko napisanih gradiv (docs/gradiva.md): domači poskusi, projekti, videi, miselni vzorci.
// Uporaba: node scripts/check-gradivo.js [-q] [datoteke …]   (brez datotek: vse v content/gradiva)
import fs from "node:fs";
import path from "node:path";
import { checkGradivo, GRADIVA_DIR, FORMATS } from "../server/gradiva-vsebina.js";

const args = process.argv.slice(2);
const quiet = args.includes("-q");
const walk = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith(".md") ? [path.join(dir, e.name)] : [])) : []);
const files = args.filter((a) => a !== "-q");
const list = files.length ? files : walk(GRADIVA_DIR);
let bad = 0;
for (const file of list) {
  // …/<vrsta>/<POT>/<tema>.md, tudi zunaj GRADIVA_DIR (npr. test/fixtures/gradiva).
  const [vrsta, pot, tema] = path.resolve(file).split(path.sep).slice(-3);
  const topicId = `${pot}/${tema.replace(/\.md$/, "")}`;
  let errs;
  if (vrsta === "miselni") {
    const veje = fs.readFileSync(file, "utf8").split(/\r?\n/).filter((l) => /^[-*+]\s+\S/.test(l)).length;
    errs = !veje ? ["miselni vzorec nima alinej (- veja)"] : veje > 8 ? ["največ 8 vej"] : [];
  } else if (FORMATS[vrsta]) errs = checkGradivo(vrsta, fs.readFileSync(file, "utf8"), topicId);
  else errs = [`neznana mapa »${vrsta}« (${[...Object.keys(FORMATS), "miselni"].join(", ")})`];
  if (errs.length) {
    bad++;
    console.log(`✗ ${file}\n${errs.map((e) => `  - ${e}`).join("\n")}`);
  } else if (!quiet) console.log(`✓ ${file}`);
}
console.log(`${list.length} gradiv, ${bad} z napakami.`);
process.exit(bad ? 1 : 0);
