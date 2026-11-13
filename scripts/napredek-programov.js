// Stanje lekcij po univerzitetnih programih: za vsak program in letnik število tem
// in koliko jih že ima lekcijo v učbeniku. Izpiše JSON z vrstico za vsak program (za pregled napredka).
// Uporaba: node scripts/napredek-programov.js [izhod.json]
import fs from "node:fs";
import { PROGRAMS, UNIVERSITIES } from "../server/university-data.js";
import { topicOrder } from "../server/curriculum.js";
import { loadLesson } from "../server/textbook.js";

const has = new Map();
const hasLesson = (id) => {
  if (!has.has(id)) {
    let ok = false;
    try { ok = Boolean(loadLesson(id)); } catch { ok = false; }
    has.set(id, ok);
  }
  return has.get(id);
};

const rows = [];
for (const [id, p] of Object.entries(PROGRAMS)) {
  const row = { id, program: p.name, faculty: p.faculty.replace("-", " "), university: UNIVERSITIES[p.faculty.split("-")[0]] || p.faculty.split("-")[0], degree: p.degree || "UN", years: p.courseKeys.length };
  let all = 0, done = 0;
  // Vsaj 4 letniki, da imajo vse vrstice enake stolpce; daljši programi (EMŠ) dobijo še y5, y6.
  for (let y = 0; y < Math.max(4, p.courseKeys.length); y++) {
    const topics = [...new Set((p.courseKeys[y] || []).flatMap((k) => topicOrder(k).map((t) => t.id)))];
    const d = topics.filter(hasLesson).length;
    row[`y${y + 1}_topics`] = topics.length;
    row[`y${y + 1}_done`] = d;
    all += topics.length;
    done += d;
  }
  row.topics = all;
  row.done = done;
  row.missing = all - done;
  row.share = all ? Math.round((done / all) * 1000) / 1000 : 0;
  rows.push(row);
}
rows.sort((a, b) => b.share - a.share || a.id.localeCompare(b.id));
const out = JSON.stringify({ updated: new Date().toISOString(), rows }, null, 1);
if (process.argv[2]) fs.writeFileSync(process.argv[2], out);
else console.log(out);
