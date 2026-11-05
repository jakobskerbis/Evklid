// node merge.cjs <id> → združi parts/<id>-p1.json in -p2.json v content/exam-papers/<id>.json
const fs = require("fs");
const id = process.argv[2];
const P = (n) => JSON.parse(fs.readFileSync(`${__dirname}/parts/${id}-p${n}.json`, "utf8"));
const a = P(1), b = P(2);
const polas = [1, 2].map((n) => {
  const own = (n === 1 ? a : b).polas.find((x) => x.pola === n) || {};
  const other = (n === 1 ? b : a).polas.find((x) => x.pola === n) || {};
  return { ...other, ...own };
});
const out = { ...a, polas, sections: { ...(b.sections || {}), ...(a.sections || {}) }, tasks: [...a.tasks, ...b.tasks] };
if (!Object.keys(out.sections).length) delete out.sections;
out.points = out.tasks.reduce((s, t) => s + t.parts.reduce((x, p) => x + p.points, 0), 0);
out.minutes = polas.reduce((s, p) => s + (p.minutes || 0), 0) || a.minutes;
fs.writeFileSync(`/home/user/Evklid/content/exam-papers/${id}.json`, JSON.stringify(out, null, 1) + "\n");
console.log(id, out.tasks.length, "nalog", out.points, "točk");
