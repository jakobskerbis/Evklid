// Naše pole v slogu preteklih pol (server/our-papers.js, content/exam-papers): oblika, zgradba izvirne pole,
// varne slike, katalog in API.
import test from "node:test";
import assert from "node:assert/strict";
import { validatePaper, ourPaperIds, loadOurPaper } from "../server/our-papers.js";
import { PAPER_STRUCTURES } from "../server/our-paper-structures.js";
import { PAPERS_SI } from "../server/exam-papers-si.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const part = (o = {}) => ({ id: "a", points: 1, format: "open", text: "Izračunaj $3 \\cdot 4$.", answer: "$12$", ways: [{ title: "Po korakih", text: "$3 \\cdot 4 = 12$" }], ...o });
const paper = (tasks) => ({ id: "NPZ9-MAT-2026-redni", exam: "NPZ9", subject: "MAT", minutes: 60, author: "AI", tasks });

test("validatePaper: pravilna pola, točke po zgradbi, napačen račun, varen SVG, dva načina pri 2 točkah", () => {
  const ok = paper([{ n: 1, parts: [part(), part({ id: "b", points: 2, ways: [{ title: "1", text: "$2 + 2 = 4$" }, { title: "2", text: "$2 \\cdot 2 = 4$" }] })] }]);
  const r = validatePaper(ok, { points: 3, tasks: [[1, 2]] });
  assert.deepEqual(r.errors, []);
  assert.equal(r.points, 3);
  assert.ok(r.checked >= 3);
  const errs = (p, exp) => validatePaper(p, exp).errors.join("\n");
  assert.match(errs(ok, { points: 3, tasks: [[2, 1]] }), /točke po delih 1\+2, zgradba izvirne pole 2\+1/);
  assert.match(errs(paper([{ n: 1, parts: [part({ ways: [{ title: "x", text: "$3 \\cdot 4 = 13$" }] })] }])), /račun se ne izide/);
  assert.match(errs(paper([{ n: 1, parts: [part({ points: 2 })] }])), /vsaj dva načina/);
  assert.match(errs(paper([{ n: 1, figure: '<svg onload="x()"></svg>', parts: [part()] }])), /varen <svg>/);
  assert.match(errs(paper([{ n: 1, parts: [part({ figure: '<svg><a href="https://x">a</a></svg>' })] }])), /varen <svg>/);
  assert.match(errs(paper([{ n: 1, parts: [part({ solutionFigure: "<svg><script>x</script></svg>" })] }])), /solutionFigure mora biti varen/);
  assert.match(errs(paper([{ n: 1, parts: [part({ format: "choice", choices: ["A", "B"], correct: [2] })] }])), /correct/);
  assert.match(errs(paper([{ n: 2, parts: [part()] }])), /n mora biti 1/);
  assert.match(errs(paper([{ n: 1, parts: [part({ text: "$\\frac{1}{$" })] }])), /formula se ne izriše/);
  assert.match(errs({ ...ok, author: "Ana" }), /author/);
});

test("zgradbe izvirnih pol: vsota točk, vnos v katalogu RIC", () => {
  for (const [id, s] of Object.entries(PAPER_STRUCTURES)) {
    assert.ok(PAPERS_SI.some((e) => e.id === id), id);
    assert.equal(s.tasks.flat().reduce((a, b) => a + b, 0), s.points, id);
    assert.equal(s.topics.length, s.tasks.length, id);
  }
});

test("naše pole v content/exam-papers: vsaka gre skozi preverjanje in ima zgradbo", () => {
  for (const id of ourPaperIds().keys()) {
    assert.ok(PAPER_STRUCTURES[id], `${id}: zgradba v server/our-paper-structures.js`);
    const r = validatePaper(loadOurPaper(id), PAPER_STRUCTURES[id]);
    assert.deepEqual(r.errors, [], id);
  }
});

test("API: katalog označi naše pole, polo vrne, neznano 404", async () => {
  const app = createApp(openDb(":memory:"), {});
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const { papers } = await (await fetch(`${base}/api/exam-papers`)).json();
    const ids = [...ourPaperIds().keys()];
    assert.deepEqual(papers.filter((e) => e.ours).map((e) => e.id).sort(), ids.sort());
    if (ids.length) {
      const p = await (await fetch(`${base}/api/exam-papers/ours/${ids[0]}`)).json();
      assert.equal(p.id, ids[0]);
    }
    assert.equal((await fetch(`${base}/api/exam-papers/ours/NPZ9-MAT-1999-redni`)).status, 404);
    assert.equal((await fetch(`${base}/api/exam-papers/ours/..%2F..%2Fpackage`)).status, 404);
  } finally {
    server.close();
  }
});
