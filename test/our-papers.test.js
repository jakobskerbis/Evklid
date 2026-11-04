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
  assert.match(errs(paper([{ n: 1, figure: "<svg/onload=x()></svg>", parts: [part()] }])), /varen <svg>/);
  assert.match(errs(paper([{ n: 1, figure: "<svg><img src=x></svg>", parts: [part()] }])), /varen <svg>/);
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
    const pts = s.tasks.map((t) => (Array.isArray(t) ? t : t.points));
    const listed = pts.flat().reduce((a, b) => a + b, 0);
    assert.equal(listed, s.maxListed ?? s.points, id);
    // opis vsake naloge (stari zapis: topics[i], novi: tasks[i].topic)
    s.tasks.forEach((t, i) => assert.ok(Array.isArray(t) ? s.topics?.[i] : t.topic, `${id} naloga ${i + 1}: opis`));
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

test("pola z dvema izpitnima polama in deli: številčenje po skupinah, ključ dela, zgradba", async () => {
  const { partKey, partLabel } = await import("../public/our-paper-key.js");
  const two = {
    ...paper([
      { pola: 1, section: "A", n: 1, parts: [part()] },
      { pola: 1, section: "A", n: 2, parts: [part()] },
      { pola: 1, section: "B", n: 1, parts: [part()] },
      { pola: 2, n: 1, parts: [part()] },
    ]),
    id: "MATURA-MAT-OR-2026-spomladanski",
    polas: [{ pola: 1, minutes: 90 }, { pola: 2, minutes: 90 }],
  };
  const exp = { points: 4, tasks: [{ pola: 1, section: "A", n: 1, points: [1] }, { pola: 1, section: "A", n: 2, points: [1] }, { pola: 1, section: "B", n: 1, points: [1] }, { pola: 2, n: 1, points: [1] }] };
  assert.deepEqual(validatePaper(two, exp).errors, []);
  assert.equal(partKey(two.tasks[2], two.tasks[2].parts[0]), "1-B1a");
  assert.equal(partLabel(two.tasks[2], two.tasks[2].parts[0]), "B1a");
  assert.equal(partKey({ n: 3 }, { id: "" }), "3");
  const bad = structuredClone(two);
  bad.tasks[1].n = 3;
  bad.tasks[3].pola = 3;
  const e = validatePaper(bad, exp).errors.join("\n");
  assert.match(e, /n mora biti 2/);
  assert.match(e, /pola 3 ni v polas/);
  assert.match(e, /se ne ujema z zgradbo/);
});

test("pola z več polami: vsaka naloga ima polo, skupine strnjene, <use> samo z notranjo povezavo", () => {
  const two = (tasks) => ({ ...paper(tasks), id: "MATURA-MAT-OR-2026-spomladanski", polas: [{ pola: 1 }, { pola: 2 }] });
  const errs = (p) => validatePaper(p).errors.join("\n");
  assert.match(errs(two([{ pola: 1, n: 1, parts: [part()] }, { n: 2, parts: [part()] }])), /pola manjka/);
  assert.match(errs(two([{ pola: 1, section: "A", n: 1, parts: [part()] }, { pola: 1, section: "B", n: 1, parts: [part()] }, { pola: 1, section: "A", n: 2, parts: [part()] }])), /niso skupaj/);
  assert.equal(errs(two([{ pola: 1, section: "A", n: 1, parts: [part()] }, { pola: 1, section: "B", n: 1, parts: [part()] }, { pola: 2, section: "A", n: 1, parts: [part()] }])), "");
  const fig = (f) => errs(paper([{ n: 1, figure: f, parts: [part()] }]));
  assert.equal(fig('<svg><defs><circle id="o" r="2"/></defs><use href="#o" x="1"/><use href = "#o"/><use xlink:href="#o"/></svg>'), "");
  for (const bad of ['<svg><use href="x.svg#o"/></svg>', "<svg><use href=//e/x#o /></svg>", '<svg><use href="#o" xlink:href="https://e/x#o"/></svg>', '<svg><use href="&#x23;o"/></svg>', "<svg><use href=\"data:image/svg+xml,<svg id='o'/>#o\"/></svg>"])
    assert.match(fig(bad), /varen <svg>/, bad);
});

test("izbirne naloge: maxPoints je največ točk izpita; slike brez zunanjih url()", () => {
  const p = paper([{ n: 1, parts: [part()] }, { n: 2, parts: [part()] }, { n: 3, parts: [part()] }]);
  const exp = { points: 2, maxListed: 3, tasks: [[1], [1], [1]] };
  assert.match(validatePaper(p, exp).errors.join("\n"), /maxPoints mora biti 2/);
  assert.deepEqual(validatePaper({ ...p, maxPoints: 2 }, exp).errors, []);
  assert.match(validatePaper({ ...p, maxPoints: 4 }).errors.join("\n"), /maxPoints 4/);
  const fig = (f) => validatePaper(paper([{ n: 1, figure: f, parts: [part()] }])).errors.join("\n");
  assert.equal(fig('<svg><defs><marker id="m"/></defs><path marker-end="url(#m)" d="M0 0L1 1"/></svg>'), "");
  assert.match(fig('<svg><rect fill="url(https://e/x.svg#g)"/></svg>'), /varen <svg>/);
  assert.match(fig("<svg><rect style=\"fill:url( 'https://e/x' )\"/></svg>"), /varen <svg>/);
});

test("izbire brez lastnih črk (pregledovalnik jih označi sam)", () => {
  const c = (choices) => validatePaper(paper([{ n: 1, parts: [part({ format: "choice", choices, correct: [0] })] }])).errors.join("\n");
  assert.match(c(["A: $1$", "B: $2$"]), /izbire se začnejo s črkami/);
  assert.match(c(["**A)** $2$", "**B)** $3$"]), /izbire se začnejo s črkami/);
  assert.equal(c(["$1$", "Ana ima prav."]), "");
  assert.equal(c(["I. kvadrant", "II. kvadrant", "C. je središče"]), "");
});
