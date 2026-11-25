// Poskusni izpit na naši poli (server/poskusna-pola.js, public/our-paper-key.js simScope): obseg in največ točk
// izpitne pole, ocena po temah, shranjevanje, šibke točke, zgodovina na strani NPZ in matura, napačni vnosi.
import test from "node:test";
import assert from "node:assert/strict";
import { simScope, simPolas, partKey } from "../public/our-paper-key.js";
import { gradeSim, SIM_PER_DAY } from "../server/poskusna-pola.js";
import { loadOurPaper, ourPaperIds } from "../server/our-papers.js";
import { paperTopics } from "../server/weaknesses.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const MAT = "MATURA-MAT-OR-2025-spomladanski";

test("simScope: izpitna pola z lastnim časom in točkami, izbirne naloge v zadnji poli, pola brez delitve", () => {
  const mat = loadOurPaper(MAT);
  assert.deepEqual(
    simPolas(mat).map((x) => [x.pola, x.minutes, x.maxPoints, x.choice]),
    [
      [1, 90, 60, false],
      [2, 90, 60, false],
    ],
  );
  assert.ok(simScope(mat, 1).tasks.every((tk) => tk.pola === 1));
  assert.equal(simScope(mat, 3), null);
  assert.equal(simScope(mat, null), null);
  // Matura BIO: na poli 2 učenec izbere naloge (maxPoints 80 = 40 + 40).
  const bio = loadOurPaper("MATURA-BIO-2025-spomladanski");
  assert.deepEqual(simPolas(bio).map((x) => [x.maxPoints, x.choice]), [[40, false], [40, true]]);
  // Poklicna matura: pola brez delitve, izbira med nalogami (70 od naštetih 80).
  const pm = loadOurPaper("POKLICNA-MAT-2026-spomladanski");
  assert.deepEqual(simPolas(pm).map((x) => [x.pola, x.minutes, x.maxPoints, x.choice]), [[null, 120, 70, true]]);
  assert.equal(simScope(pm, 1), null);
  // Vsaka naša pola: vsota izpitnih pol je največ točk pole.
  for (const id of ourPaperIds().keys()) {
    const p = loadOurPaper(id);
    assert.equal(simPolas(p).reduce((s, x) => s + x.maxPoints, 0), p.maxPoints || p.points, id);
  }
});

test("gradeSim: točke po delih in temah, napačne točke in tuji deli so napaka", () => {
  const p = loadOurPaper(MAT);
  const parts = simScope(p, 1).tasks.flatMap((tk) => tk.parts.map((q) => ({ key: partKey(tk, q), max: q.points })));
  const given = Object.fromEntries(parts.map((x, i) => [x.key, i % 2 ? x.max : 0]));
  const r = gradeSim(MAT, p, 1, given);
  const want = parts.reduce((s, x, i) => s + (i % 2 ? x.max : 0), 0);
  assert.equal(r.points, want);
  assert.equal(r.maxPoints, 60);
  assert.equal(r.percent, Math.round((100 * want) / 60));
  assert.equal(r.topics.reduce((s, x) => s + x.max, 0), 60);
  assert.equal(r.topics.reduce((s, x) => s + x.got, 0), want);
  assert.ok(r.topics.filter((x) => x.id).every((x) => x.name), "teme imajo ime");
  // Šibkejše teme najprej (deleži naraščajo), »Drugo« (brez teme) na koncu.
  const named = r.topics.filter((x) => x.id);
  for (let i = 1; i < named.length; i++) assert.ok(named[i - 1].got / named[i - 1].max <= named[i].got / named[i].max);
  assert.match(gradeSim(MAT, p, 1, { [parts[0].key]: parts[0].max + 1 }).error, /Neveljavne/);
  assert.match(gradeSim(MAT, p, 1, { [parts[0].key]: 0.5 }).error, /Neveljavne/);
  assert.match(gradeSim(MAT, p, 1, { [parts[0].key]: -1 }).error, /Neveljavne/);
  // Del pole 2 pri poli 1 se ne šteje; brez ocenjenega dela je napaka.
  const p2 = simScope(p, 2).tasks[0];
  assert.match(gradeSim(MAT, p, 1, { [partKey(p2, p2.parts[0])]: 1 }).error, /vsaj en del/);
});

test("API: shrani poskusno polo, šibke točke, zgodovina na strani NPZ in matura, napačni vnosi 4xx", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { streamFn: async () => ({ content: [], text: "", stopReason: "end_turn" }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, body) => {
    const res = await fetch(base + path, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  try {
    const s = (await call("/api/students", { name: "Eva", settings: { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik OR", subject: "MAT" } })).body;
    const other = (await call("/api/students", { name: "Ana", settings: { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik OR", subject: "MAT" } })).body;
    let v = (await call(`/api/students/${s.id}/exams`)).body;
    assert.deepEqual(v.sims, []);
    const p = loadOurPaper(MAT);
    const map = paperTopics(MAT, p);
    const tasks = simScope(p, 1).tasks;
    const given = {};
    for (const tk of tasks) for (const q of tk.parts) given[partKey(tk, q)] = 0; // vse narobe
    const url = `/api/students/${s.id}/exam-sim`;
    assert.equal((await call(url, { paper: "NPZ9-MAT-1999-redni", pola: 1, points: given })).status, 404);
    assert.equal((await call(url, { paper: "../../package", pola: 1, points: given })).status, 404);
    assert.equal((await call(url, { paper: MAT, pola: 7, points: given })).status, 400);
    assert.equal((await call(url, { paper: MAT, pola: 1, points: [] })).status, 400);
    assert.equal((await call(url, { paper: MAT, pola: 1 })).status, 400);
    assert.equal((await call(url, { paper: MAT, pola: 1, points: { "1-A1": 99 } })).status, 400);
    const r = await call(url, { paper: MAT, pola: 1, points: given, seconds: 5000 });
    assert.equal(r.status, 200);
    assert.equal(r.body.points, 0);
    assert.equal(r.body.maxPoints, 60);
    assert.ok(r.body.weak.length > 0 && r.body.weak.length <= 3);
    // Šibke točke: deli s temo štejejo kot napaka (vir »paper«), vsak del enkrat.
    const n = store.db.prepare("SELECT SUM(n) AS n, SUM(wrong) AS w FROM skill_results WHERE student_id = ? AND source = 'paper'").get(s.id);
    assert.ok(n.n > 0 && n.n === n.w, "vsi deli napačni");
    assert.ok(n.n <= map.size);
    await call(url, { paper: MAT, pola: 1, points: given, seconds: 4000 });
    assert.equal(store.db.prepare("SELECT SUM(n) AS n FROM skill_results WHERE student_id = ? AND source = 'paper'").get(s.id).n, n.n, "isti del se ne šteje dvakrat");
    v = (await call(`/api/students/${s.id}/exams`)).body;
    assert.equal(v.sims.length, 2);
    assert.deepEqual(
      { paper: v.sims[0].paper, pola: v.sims[0].pola, points: v.sims[0].points, maxPoints: v.sims[0].maxPoints, seconds: v.sims[0].seconds },
      { paper: MAT, pola: 1, points: 0, maxPoints: 60, seconds: 4000 },
    );
    assert.ok(v.sims[0].weak.every((w) => w.id && w.name && w.got === 0 && w.max > 0));
    // Drug profil ne vidi rezultatov; NPZ stran istega učenca jih ne kaže.
    assert.deepEqual((await call(`/api/students/${other.id}/exams`)).body.sims, []);
    assert.deepEqual((await call(`/api/students/${s.id}/exams?exam=POKLICNA`)).body.sims, []);
    // Odprte seje (spodnja vrstica) ostanejo prazne: poskusna pola je shranjena kot končana.
    assert.ok(!store.db.prepare("SELECT 1 FROM sessions WHERE kind = 'pola' AND finished = 0").get());
    // Varovalka: največ SIM_PER_DAY shranjenih pol na dan.
    for (let i = 2; i < SIM_PER_DAY; i++) store.db.prepare("INSERT INTO sessions (id, student_id, kind, params, plan, finished) VALUES (?, ?, 'pola', '{}', '[]', 1)").run(`x${i}`, s.id);
    assert.equal((await call(url, { paper: MAT, pola: 1, points: given })).status, 429);
  } finally {
    server.close();
  }
});

test("uradni datum izpita: NPZ matematika in tretji predmet, matura od začetka roka, mimo roka prazno", async () => {
  const { uradniDatum } = await import("../public/goal-data.js");
  const nov = "2026-11-25";
  assert.equal(uradniDatum("NPZ9", "MAT", nov), "2027-04-01");
  assert.equal(uradniDatum("NPZ6", "MAT", nov), "2027-04-01");
  assert.equal(uradniDatum("NPZ9", "FIZ", nov), "2027-03-24");
  assert.equal(uradniDatum("NPZ6", "FIZ", nov), "");
  assert.equal(uradniDatum("MATURA", "MAT", nov), "2027-05-29");
  assert.equal(uradniDatum("POKLICNA", "MAT", nov), "2027-05-29");
  assert.equal(uradniDatum("SAT", "MAT", nov), "");
  assert.equal(uradniDatum("NPZ9", "MAT", "2027-04-02"), "");
});
