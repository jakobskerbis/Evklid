#!/usr/bin/env node
// Seznam fakultetnih tem brez lekcije, urejen po tem, v koliko programih se tema pojavi.
// Tema z enakim naslovom in predmetom v več predmetih ima eno lekcijo (server/textbook.js).
//   node scripts/fakultetne-lekcije.js [--letnik 1] [--program UL-FKKT] [--n 40] [--json] [--deli 2 --del 0]
// --program P: samo teme programov, katerih id se začne s P (npr. UL-FKKT ali UL-FKKT-KEM).
// --deli N --del K: stabilna razdelitev tem na N delov (po zgoščeni vrednosti id-ja), izpiše le del K (0..N-1),
// da več niti piše faks lekcije hkrati brez podvajanja (vsaka nit ima svoj K).
import { listPrograms, listProgramPaths, topicOrder, sameTopics, getTopic, getPath } from "../server/curriculum.js";
import { loadLesson } from "../server/textbook.js";

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? def : process.argv[i + 1];
};
const year = Number(arg("letnik", 0));
const n = Number(arg("n", 1e9));
const deli = Number(arg("deli", 1));
const del = Number(arg("del", 0));
const program = arg("program", "");
const hash = (str) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 2147483647, 7);

const groups = new Map(); // prvi id skupine -> { programi, predmeti }
for (const p of listPrograms()) {
  for (const pp of listProgramPaths(p.id)) {
    if (year && (pp.elective || pp.year !== year)) continue;
    for (const t of topicOrder(pp.key)) {
      const id = sameTopics(t.id)[0];
      if (!groups.has(id)) groups.set(id, { programs: new Set(), courses: new Set(), goals: new Set() });
      const g = groups.get(id);
      g.programs.add(p.id);
      g.courses.add(`${getPath(pp.key).label}`);
      if (t.goals) g.goals.add(t.goals);
    }
  }
}
const todo = [...groups.entries()]
  .filter(([id, g]) => !loadLesson(id) && (deli <= 1 || hash(id) % deli === del) && (!program || [...g.programs].some((p) => p.startsWith(program))))
  .map(([id, g]) => ({ id, name: getTopic(id).name, subject: getTopic(id).subject, unit: getTopic(id).unit, programs: g.programs.size, programIds: [...g.programs], courses: [...g.courses], goals: [...g.goals] }))
  .sort((a, b) => b.programs - a.programs || a.id.localeCompare(b.id))
  .slice(0, n);
if (process.argv.includes("--json")) console.log(JSON.stringify(todo, null, 2));
else {
  for (const t of todo) console.log(`${String(t.programs).padStart(3)}  ${t.id}  (${t.subject}) ${t.name}`);
  console.log(`${todo.length} tem brez lekcije${program ? ` (${program})` : ""}${year ? ` (${year}. letnik)` : ""}${deli > 1 ? ` (del ${del + 1}/${deli})` : ""}.`);
}
