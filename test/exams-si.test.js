// Slovenski izpiti (NPZ 6. in 9. razred, splošna matura) kot poskusni izpit na čas.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { Progress } from "../server/progress.js";
import { getPath } from "../server/curriculum.js";
import { createApp } from "../server/app.js";
import { examInfo, examKeyFor, examsFor, mockPlan, officialPapers } from "../server/exams.js";
import { hasGenerator } from "../server/practice/index.js";
import { PAPERS_SI, PAPERS_SOURCE } from "../server/exam-papers-si.js";

test("si exams: NPZ and matura for Slovenian students only, default by school and grade", () => {
  assert.deepEqual(examsFor("SI").own, ["NPZ6", "NPZ9", "MATURA", "POKLICNA"]);
  for (const sys of ["IN-CBSE", "US", "NG"]) for (const id of ["NPZ6", "NPZ9", "MATURA", "POKLICNA"]) assert.ok(!examsFor(sys).other.includes(id), `${sys}: ${id}`);
  const key = (track, grade, subject) => examKeyFor({ school_system: "SI", educational_track: track, curriculum_level: grade, subject });
  assert.equal(key("OSNOVNA_SOLA", "6. razred", "MAT"), "MAT-EX-NPZ6");
  assert.equal(key("OSNOVNA_SOLA", "9. razred", "KEM"), "KEM-EX-NPZ9");
  assert.equal(key("SREDNJA_SOLA", "4. letnik", "BIO"), "BIO-EX-MATURA");
  assert.equal(key("SREDNJA_SOLA", "3. letnik VR", "MAT"), "MAT-EX-MATURA", "SŠ: privzeto splošna matura");
});

test("si exams: topics come from the Slovenian learning paths, tasks are in Slovenian", () => {
  const info = examInfo("MAT-EX-MATURA", "SI");
  assert.equal(info.tasksLang, "sl");
  assert.equal(info.subjects.length, 4);
  const path = getPath("MAT-EX-NPZ9");
  assert.deepEqual(path.units.map((u) => u.title), ["6. razred", "7. razred", "8. razred", "9. razred"]);
  for (const t of path.units.flatMap((u) => u.topics)) for (const b of t.base) assert.match(b, /^MAT-OS-[6-9]\//);
  const ids = getPath("MAT-EX-MATURA").units.flatMap((u) => u.topics.map((t) => t.id));
  assert.equal(new Set(ids).size, ids.length);
});

test("si exams: matura physics mock is a timed multiple-choice paper", () => {
  const store = openDb(":memory:");
  const p = new Progress(store);
  const s = store.createStudent("Ana");
  const n = p.startContest(s.id, "FIZ-EX-MATURA");
  assert.equal(n.total, 18);
  assert.equal(n.task.answerType, "choice");
  assert.equal(n.task.textLang, null);
});

test("si exams: poklicna matura is mathematics only, catalogue topics from the secondary-school paths", () => {
  const info = examInfo("MAT-EX-POKLICNA", "SI");
  assert.equal(info.subjects.length, 1);
  assert.equal(info.tasksLang, "sl");
  assert.equal(examKeyFor({ school_system: "SI", educational_track: "SREDNJA_SOLA", curriculum_level: "2. letnik OR", subject: "FIZ" }, "POKLICNA"), "MAT-EX-POKLICNA");
  // 1. del izpitne pole: 11 krajših nalog, 7 × 4 + 2 × 5 + 2 × 6 = 50 točk.
  assert.equal(info.mock.tasks, 11);
  assert.equal(info.mock.maxPoints, 50);
  const path = getPath("MAT-EX-POKLICNA");
  assert.equal(path.units.length, 8);
  const topics = path.units.flatMap((u) => u.topics);
  for (const t of topics) {
    assert.ok(hasGenerator(t.id), `${t.id}: brez nalog`);
    for (const b of t.base) assert.match(b, /^MAT-SS-[1-4]\//);
  }
  // Snov, ki je ni v katalogu poklicne mature.
  for (const name of ["Kompleksna števila", "Vektorji v ravnini in prostoru", "Nedoločeni integral", "Limita in zveznost funkcije", "Elipsa, hiperbola, parabola"]) assert.ok(!topics.some((t) => t.name === name), name);
  assert.equal(mockPlan("MAT-EX-POKLICNA").plan.length, 11);
  assert.match(officialPapers("POKLICNA", "MAT").url, /^https:\/\/www\.ric\.si\/poklicna-matura\//);
});

test("si exams: past papers catalogue only links to ric.si and keeps only the structure slot and an empty slot for our own paper", () => {
  assert.match(PAPERS_SOURCE.url, /^https:\/\/www\.ric\.si\//);
  assert.ok(PAPERS_SI.length > 100);
  const ids = new Set();
  const KINDS = ["paper", "paper1", "paper2", "scoring"];
  for (const e of PAPERS_SI) {
    assert.ok(!ids.has(e.id), `podvojen ${e.id}`);
    ids.add(e.id);
    assert.ok(["NPZ6", "NPZ9", "MATURA", "POKLICNA"].includes(e.exam), e.id);
    assert.ok(["MAT", "FIZ", "KEM", "BIO"].includes(e.subject), e.id);
    assert.ok(Number.isInteger(e.year) && e.year >= 2000 && e.year <= 2100, e.id);
    assert.ok(e.exam.startsWith("NPZ") ? ["redni", "naknadni"].includes(e.term) : ["spomladanski", "jesenski", "zimski"].includes(e.term), e.id);
    assert.equal(e.level, e.exam === "MATURA" && e.subject === "MAT" ? e.level || "missing" : null, e.id);
    if (e.level) assert.ok(["OR", "VR"].includes(e.level), e.id);
    assert.match(e.page, /^https:\/\/www\.ric\.si\//);
    assert.ok(e.files.length && e.files.some((f) => f.kind !== "scoring"), e.id);
    for (const f of e.files) {
      assert.ok(KINDS.includes(f.kind), e.id);
      assert.match(f.url, /^https:\/\/www\.ric\.si\/mma\//, e.id);
    }
    // Brez besedila pol: samo povezave (RIC ima vse pravice).
    assert.deepEqual(Object.keys(e).sort(), ["exam", "files", "id", "level", "ours", "page", "session", "structure", "subject", "term", "year"]);
    // Zgradba pole (pozneje { n, topicId, format, points }) in naša pola v istem slogu: zdaj še prazni.
    assert.ok(Array.isArray(e.structure), e.id);
    for (const x of e.structure) assert.deepEqual(Object.keys(x).sort(), ["format", "n", "points", "topicId"], e.id);
    assert.ok(e.ours === null || typeof e.ours === "object", e.id);
  }
  // Vrstni red kot na ric.si: novejša leta prej, v letu spomladanski → jesenski → zimski (februar naslednjega leta).
  const TERM = { redni: 0, spomladanski: 0, naknadni: 1, jesenski: 1, zimski: 2 };
  for (let i = 1; i < PAPERS_SI.length; i++) {
    const [a, b] = [PAPERS_SI[i - 1], PAPERS_SI[i]];
    if (a.exam !== b.exam || a.subject !== b.subject || a.level !== b.level) continue;
    assert.ok(a.year > b.year || (a.year === b.year && TERM[a.term] <= TERM[b.term]), `${a.id} pred ${b.id}`);
  }
  // Vsak izpit in predmet razdelka ima vsaj nekaj pol; matematika na maturi po ravneh.
  for (const k of ["NPZ6-MAT", "NPZ9-MAT", "NPZ9-FIZ", "NPZ9-KEM", "NPZ9-BIO", "MATURA-MAT-OR", "MATURA-MAT-VR", "MATURA-FIZ", "MATURA-KEM", "MATURA-BIO", "POKLICNA-MAT"])
    assert.ok(PAPERS_SI.some((e) => [e.exam, e.subject, e.level].filter(Boolean).join("-") === k), k);
});

test("API: NPZ and matura view has readiness, the date comes from the goal, papers come from the catalogue", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { streamFn: async () => ({ content: [], text: "", stopReason: "end_turn" }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, { method: opts.method || "GET", headers: { "Content-Type": "application/json" }, body: opts.body ? JSON.stringify(opts.body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  try {
    const s = (await call("/api/students", { method: "POST", body: { name: "Eva", settings: { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik OR", subject: "MAT" } } })).body;
    const v = (await call(`/api/students/${s.id}/exams`)).body;
    assert.equal(v.key, "MAT-EX-MATURA");
    assert.deepEqual(v.exams.own.filter((x) => x.track === "SREDNJA_SOLA").map((x) => x.id), ["MATURA", "POKLICNA"]);
    assert.equal(v.readiness.percent, 0);
    assert.equal(v.readiness.weakest.length, 3);
    // Obvladana osnovna tema na Učni poti šteje tudi za izpit.
    const first = getPath("MAT-EX-POKLICNA").units[0].topics[0];
    await call(`/api/students/${s.id}/topic-status`, { method: "POST", body: { topic_id: first.base[0], status: "mastered" } });
    const pm = (await call(`/api/students/${s.id}/exams?exam=POKLICNA`)).body;
    assert.equal(pm.key, "MAT-EX-POKLICNA");
    assert.ok(pm.readiness.percent > 0);
    assert.ok(!pm.readiness.weakest.some((w) => w.id === first.id));
    assert.equal(pm.official.url, "https://www.ric.si/poklicna-matura/predmeti/tretji-predmet/matematika/");
    // Datum izpita se shrani v cilj (isti API kot Nastavitve → Cilj).
    const up = (await call(`/api/students/${s.id}`, { method: "PUT", body: { settings: { goal: "matura", goal_date: "2027-06-01" } } })).body;
    assert.equal(up.settings.goal, "matura");
    assert.equal(up.settings.goal_date, "2027-06-01");
    const p = await call("/api/exam-papers");
    assert.equal(p.status, 200);
    assert.equal(p.body.papers.length, PAPERS_SI.length);
    const bad = await call(`/api/students/${s.id}/exams?key=MAT-EX-NOPE`);
    assert.equal(bad.status, 200);
    assert.equal(bad.body.key, "MAT-EX-MATURA");
  } finally {
    server.close();
  }
});
