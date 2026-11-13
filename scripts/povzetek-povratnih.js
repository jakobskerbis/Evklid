// Povzetek povratnih informacij testerjev (brez API, brez stroškov).
//   node scripts/povzetek-povratnih.js [data/povratne-informacije.json]
// Zapiše data/povratne-informacije-povzetek.md in ga izpiše.
import fs from "node:fs";
import path from "node:path";
import "../server/env.js";
import { DatabaseSync } from "node:sqlite";
import { summaryMarkdown, FeedbackStore } from "../server/feedback.js";
import { BRAND } from "../server/brand.js";

const file = process.argv[2] || path.join("data", "povratne-informacije.json");
const dbFile = process.env.EVKLID_DB || path.join("data", `${BRAND.slug}.db`);
let entries;
if (fs.existsSync(file)) entries = JSON.parse(fs.readFileSync(file, "utf8"));
else if (fs.existsSync(dbFile)) {
  // S ključem za šifriranje (EVKLID_DATA_KEY) datoteke ni: mnenja preberemo iz baze.
  entries = new FeedbackStore(new DatabaseSync(dbFile)).list();
} else {
  console.log(`Ni datoteke ${file}. Mnenja se zapišejo vanjo, ko prvi tester pošlje vprašalnik.`);
  process.exit(0);
}
const md = summaryMarkdown(entries);
const out = path.join(path.dirname(file), "povratne-informacije-povzetek.md");
fs.writeFileSync(out, md);
console.log(md);
console.log(`Shranjeno v ${out}`);
