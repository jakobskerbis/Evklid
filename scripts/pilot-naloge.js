// Pilot: povzetek nalog članov za jutranji pregled (brez imen in e-naslovov, brez API in stroškov).
//   node scripts/pilot-naloge.js            → izpiše Markdown
//   node scripts/pilot-naloge.js --json     → isti podatki kot JSON
// Branje po pogojih (delež »Prebrano prav«), »Ne deluje« po delih aplikacije, anketa, opombe (server/pilot-naloge.js).
import fs from "node:fs";
import "../server/env.js";
import { DatabaseSync } from "node:sqlite";
import { BRAND } from "../server/brand.js";
import { pilotTasksReport, pilotTasksMarkdown } from "../server/pilot-naloge.js";

const file = process.env.EVKLID_DB || `data/${BRAND.slug}.db`;
if (!fs.existsSync(file)) {
  console.log(`Ni baze ${file}.`);
  process.exit(0);
}
const r = pilotTasksReport(new DatabaseSync(file));
// Seznam fotografij (id) potrebuje samo skrbniška stran; v jutranjem pregledu zadošča število.
delete r.photoList;
console.log(process.argv.includes("--json") ? JSON.stringify(r, null, 2) : pilotTasksMarkdown(r));
