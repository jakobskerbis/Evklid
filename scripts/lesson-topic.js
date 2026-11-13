#!/usr/bin/env node
// Izpiše podatke o temah (za pisanje lekcije): node scripts/lesson-topic.js MAT-OS-6/kot FIZ-OS-8/vzgon
// Izhod je dovolj za pisca: ni treba brati celih sosednjih lekcij (docs/token-rules.md).
// previousSummaries = »Povzetek« zadnjih (do 3) že napisanih lekcij pred temo na isti poti,
// da pisec ve, kaj učenec že zna; exemplar = ena vzorčna lekcija v novi obliki (za slog).
import fs from "node:fs";
import path from "node:path";
import { getTopic, getPath, topicOrder } from "../server/curriculum.js";
import { lessonView, LESSONS_DIR } from "../server/textbook.js";

const EXEMPLAR = "content/lessons/FIZ-OS-9/upor-in-ohmov-zakon.md";
const ids = process.argv.slice(2);
if (!ids.length) {
  console.error("uporaba: node scripts/lesson-topic.js <id-teme> [...]");
  process.exit(1);
}
const lessonFile = (id) => path.join(LESSONS_DIR, `${id}.md`);
const summary = (id) => {
  const src = fs.readFileSync(lessonFile(id), "utf8");
  const m = src.match(/^## Povzetek[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  return m ? m[1].trim().replace(/\n{2,}/g, "\n") : "";
};
const out = ids.map((id) => {
  const t = getTopic(id);
  if (!t) return { id, error: "tema ne obstaja" };
  const order = topicOrder(t.path);
  const i = order.findIndex((x) => x.id === id);
  const v = lessonView(id);
  const written = (x) => x.id !== id && fs.existsSync(lessonFile(x.id));
  const prev = order.slice(0, i).filter(written).slice(-3);
  const sibling = prev.at(-1) || order.find(written);
  return {
    id, file: `content/lessons/${id}.md`, name: t.name, unit: t.unit, path: t.path, pathLabel: getPath(t.path).label, goals: t.goals,
    demos: v.demos.map((d) => d.title),
    before: order.slice(Math.max(0, i - 6), i).map((x) => x.name),
    after: order.slice(i + 1, i + 4).map((x) => x.name),
    lessonExists: fs.existsSync(lessonFile(id)),
    exemplar: EXEMPLAR,
    sampleLessonsInSamePath: sibling ? [`content/lessons/${sibling.id}.md`] : [],
    previousSummaries: prev.map((x) => ({ name: x.name, povzetek: summary(x.id) })),
  };
});
console.log(JSON.stringify(out, null, 1));
