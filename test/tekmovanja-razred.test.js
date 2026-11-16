// Tekmovanja po razredu (j, 14. 11. 2026): trening in poskusno tekmovanje dajeta samo teme, ki jih
// učenec po učnem načrtu že pozna (competition.js MIN_YEAR), kot kategorije po razredih pri Kenguruju.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { getPath } from "../server/curriculum.js";
import { MIN_YEAR, minYear, topicsForYear } from "../server/competition.js";

const KEYS = ["MAT-TEK-OS", "MAT-TEK-SS", "FIZ-TEK-OS", "FIZ-TEK-SS", "KEM-TEK-OS", "KEM-TEK-SS"];
const idsOf = (key) => getPath(key).units.flatMap((u) => u.topics.map((t) => t.id));

test("vsaka tekmovalna tema ima najnižji razred v mejah svoje stopnje", () => {
  for (const key of KEYS) {
    const ids = idsOf(key);
    const [lo, hi] = key.endsWith("-OS") ? [1, 9] : [10, 13];
    for (const id of ids) {
      const y = minYear(id);
      assert.ok(Number.isInteger(y) && y >= lo && y <= hi, `${id}: ${y}`);
    }
    // Ni odvečnih vpisov (preimenovana tema bi sicer ostala brez razreda).
    assert.deepEqual(Object.keys(MIN_YEAR[key]).sort(), ids.map((id) => id.split("/")[1]).sort(), key);
  }
});

test("topicsForYear: Pitagorov izrek šele v 8. razredu, fizika OŠ za mlajše najnižja kategorija", () => {
  const pit = "MAT-TEK-OS/pitagorov-izrek-v-tekmovalnih-nalogah";
  assert.ok(!topicsForYear(idsOf("MAT-TEK-OS"), 6).includes(pit));
  assert.ok(topicsForYear(idsOf("MAT-TEK-OS"), 8).includes(pit));
  assert.equal(topicsForYear(idsOf("MAT-TEK-OS"), 9).length, idsOf("MAT-TEK-OS").length);
  // 6. razred odpre fiziko: samo teme 8. razreda, ne 9.
  const fiz6 = topicsForYear(idsOf("FIZ-TEK-OS"), 6);
  assert.ok(fiz6.length && fiz6.every((id) => minYear(id) === 8));
  // Brez leta (npr. izpitne poti) se nič ne spremeni.
  assert.equal(topicsForYear(idsOf("MAT-TEK-SS"), null).length, idsOf("MAT-TEK-SS").length);
  // 1. letnik: brez indukcije (4. letnik) in nihanja (3. letnik).
  assert.ok(!topicsForYear(idsOf("MAT-TEK-SS"), 10).includes("MAT-TEK-SS/zaporedja-rekurzije-in-indukcija"));
  assert.ok(!topicsForYear(idsOf("FIZ-TEK-SS"), 10).includes("FIZ-TEK-SS/nihanje-in-valovanje"));
});

test("učenec 6. razreda: razdelek, trening in poskusno tekmovanje samo s temami do 6. razreda", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { streamFn: async () => ({ content: [], text: "", stopReason: "end_turn" }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, body) => {
    const res = await fetch(base + path, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: res.status, body: await res.json() };
  };
  try {
    const settings = { educational_track: "OSNOVNA_SOLA", curriculum_level: "6. razred", subject: "MAT" };
    const s = (await call("/api/students", { name: "Zala", settings })).body;
    const c = (await call(`/api/students/${s.id}/competition`)).body;
    assert.equal(c.key, "MAT-TEK-OS");
    const shown = c.units.flatMap((u) => u.topics.map((t) => t.id));
    assert.ok(shown.length >= 8, `teme: ${shown.length}`);
    assert.ok(shown.every((id) => minYear(id) <= 6), shown.join(", "));
    assert.ok(c.units.every((u) => u.topics.length && u.progress >= 0 && u.progress <= 1));

    const plan = (sessionId) => JSON.parse(store.db.prepare("SELECT plan FROM sessions WHERE id = ?").get(sessionId).plan);
    const tr = await call(`/api/students/${s.id}/competition-training`, { path: "MAT-TEK-OS" });
    assert.equal(tr.status, 200);
    assert.equal(tr.body.total, 10);
    assert.ok(plan(tr.body.sessionId).every((p) => minYear(p.topic) <= 6));
    const ct = await call(`/api/students/${s.id}/contest`, { path: "MAT-TEK-OS" });
    assert.equal(ct.status, 200);
    const cp = plan(ct.body.sessionId);
    assert.equal(cp.length, 10);
    assert.ok(cp.every((p) => minYear(p.topic) <= 6));

    // Fizika v 6. razredu: kategorija 8. razreda (fizika se začne v 8.), ne prazno.
    const f = (await call(`/api/students/${s.id}/competition?key=FIZ-TEK-OS`)).body;
    const fz = f.units.flatMap((u) => u.topics.map((t) => t.id));
    assert.ok(fz.length && fz.every((id) => minYear(id) === 8));
  } finally {
    server.close();
  }
});

// Naloge po razredu (j, 15. 11. 2026): do 4. razreda generatorji iz tek-mat-os-mladi.js (majhna števila,
// brez stopinj, enačb in binomskih simbolov), od 5. razreda prejšnji. Brez razreda se nič ne spremeni.
test("tekmovalne naloge za 1.–4. razred so iz mladih generatorjev, od 5. razreda prejšnje", async () => {
  const { generateTask } = await import("../server/practice/index.js");
  const young = idsOf("MAT-TEK-OS").filter((id) => minYear(id) <= 4);
  assert.ok(young.length >= 6, young.join(", "));
  for (const id of young) {
    for (let seed = 0; seed < 60; seed++) {
      const level = 1 + (seed % 3);
      for (const year of [1, 2, 3, 4]) {
        const t = generateTask(id, level, seed, "sl", year);
        assert.match(t.generator, /^tek-mladi-/, `${id} ${year}. razred`);
        assert.doesNotMatch(t.text + t.solution, /\\binom|°|\\circ|undefined|NaN/, `${t.generator}: ${t.text}`);
      }
      assert.doesNotMatch(generateTask(id, level, seed, "sl", 5).generator, /^tek-mladi-/);
      assert.doesNotMatch(generateTask(id, level, seed, "sl").generator, /^tek-mladi-/);
    }
  }
});

test("učenec 3. razreda: poskusno tekmovanje z nalogami za mlajše", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { streamFn: async () => ({ content: [], text: "", stopReason: "end_turn" }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = async (path, body) => (await fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
  try {
    const s = await post("/api/students", { name: "Tim", settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "3. razred", subject: "MAT" } });
    const ct = await post(`/api/students/${s.id}/contest`, { path: "MAT-TEK-OS" });
    assert.ok(ct.sessionId);
    const plan = JSON.parse(store.db.prepare("SELECT plan FROM sessions WHERE id = ?").get(ct.sessionId).plan);
    assert.ok(plan.every((p) => minYear(p.topic) <= 3));
    const first = JSON.parse(store.db.prepare("SELECT payload FROM tasks WHERE session_id = ? ORDER BY id LIMIT 1").get(ct.sessionId).payload);
    assert.match(first.generator, /^tek-mladi-/);
  } finally {
    server.close();
  }
});

// Popravki pregleda PR #729 (16. 11. 2026): 1. razred števila do 20, 2. do 100, brez negativnih števil
// v rešitvah, brez množenja v 1. in 2. razredu, ura čez polno uro ali v isti uri, kvadrati v mreži.
test("tek-mladi: razponi po razredu, brez negativnih števil, lastni odgovor sprejet", async () => {
  const { TEK_MAT_OS_MLADI } = await import("../server/practice/generators/tek-mat-os-mladi.js");
  const { makeRng } = await import("../server/practice/rng.js");
  const { checkAnswer, fmt } = await import("../server/practice/check.js");
  for (const G of TEK_MAT_OS_MLADI) {
    for (let level = 1; level <= 3; level++) {
      for (const year of [1, 2, 3, 4]) {
        const texts = new Set();
        for (let seed = 1; seed <= 60; seed++) {
          const t = G.gen(level, makeRng(seed * 7919 + level * 31 + year), G.topics[0], "sl", year);
          texts.add(t.text);
          const a = t.answer;
          const own = a.type === "choice" ? String(a.index) : fmt(a.value) + (a.unit ? " " + a.unit : "");
          assert.equal(checkAnswer(a, own).kind, "correct", `${G.id}: ${t.text}`);
          const shown = [t.text, t.hint, t.solution, t.formula, a.type === "choice" ? a.options.join(" ") : a.value].join("\n");
          assert.doesNotMatch(shown, /(^|[\s(=+$:])-\d|\+ -|undefined|NaN|karkoli|katerakoli/, `${G.id} L${level}: ${shown}`);
          if (year <= 2) assert.doesNotMatch(shown, /\\cdot|·|večkratnik|deljiv/, `${G.id} L${level} ${year}. r.: ${shown}`);
          // Ure (8.30) so zapis časa, ne števili 8 in 30.
          const lim = year === 1 ? 20 : year <= 3 ? 100 : 1000;
          const big = (shown.replace(/\b\d{1,2}\.\d{2}\b/g, "").match(/\d+/g) || []).map(Number).filter((x) => x > lim);
          assert.deepEqual(big, [], `${G.id} L${level} ${year}. r.: ${shown}`);
        }
        assert.ok(texts.size >= 12, `${G.id} L${level} ${year}. r.: samo ${texts.size} različnih nalog`);
      }
    }
  }
});

test("tek-mladi-ure: trajanje s prehodom čez polno uro in brez njega", async () => {
  const { TEK_MAT_OS_MLADI } = await import("../server/practice/generators/tek-mat-os-mladi.js");
  const { makeRng } = await import("../server/practice/rng.js");
  const G = TEK_MAT_OS_MLADI.find((x) => x.id === "tek-mladi-ure");
  const seen = { cross: 0, same: 0 };
  for (const year of [2, 3, 4]) {
    for (let seed = 1; seed <= 200; seed++) {
      const t = G.gen(2, makeRng(seed), G.topics[0], "sl", year);
      const [s, e] = t.text.match(/\d{1,2}\.\d{2}/g).map((x) => Number(x.split(".")[0]) * 60 + Number(x.split(".")[1]));
      assert.equal(t.answer.value, e - s, t.text);
      if (year === 2) assert.ok([0, 30].includes(s % 60) && [30, 60].includes(e - s), t.text);
      const cross = Math.floor(s / 60) !== Math.floor((e - 1) / 60);
      if (cross) {
        seen.cross++;
        assert.match(t.solution, new RegExp(`Skupaj \\$[\\d + ]+= ${e - s}\\$`), t.solution);
      } else {
        seen.same++;
        assert.doesNotMatch(t.solution, /Skupaj/, t.solution);
      }
    }
  }
  assert.ok(seen.cross > 20 && seen.same > 20, JSON.stringify(seen));
  // 1. razred: samo cele in pol ure, odgovor z besedami (pol ure, eno uro).
  for (let seed = 1; seed <= 60; seed++) {
    const t = G.gen(2, makeRng(seed), G.topics[0], "sl", 1);
    assert.match(t.text, /ob \d{1,2}\.(00|30) in .* ob \d{1,2}\.(00|30)\./, t.text);
    assert.ok(["pol ure", "eno uro"].includes(t.answer.options[t.answer.index]), t.text);
  }
});

test("tek-mladi-liki: število kvadratov v mreži (preštevanje vseh kvadratov)", async () => {
  const { TEK_MAT_OS_MLADI } = await import("../server/practice/generators/tek-mat-os-mladi.js");
  const { makeRng } = await import("../server/practice/rng.js");
  const G = TEK_MAT_OS_MLADI.find((x) => x.id === "tek-mladi-liki");
  const brute = (w, h) => {
    let c = 0;
    for (let k = 1; k <= Math.min(w, h); k++) for (let i = 0; i + k <= w; i++) for (let j = 0; j + k <= h; j++) c++;
    return c;
  };
  assert.deepEqual([brute(2, 5), brute(3, 4), brute(4, 4), brute(3, 3)], [14, 20, 30, 14]);
  const shapes = new Set();
  for (const level of [2, 3]) {
    for (const year of [1, 2, 3, 4]) {
      for (let seed = 1; seed <= 60; seed++) {
        const t = G.gen(level, makeRng(seed), G.topics[0], "sl", year);
        assert.doesNotMatch(t.text, /na sliki/);
        const [, h, w] = t.text.match(/ima (\d+) vrst\S* in v vsaki vrsti \S+ (\d+) /).map(Number);
        shapes.add(`${w}x${h}`);
        assert.equal(t.answer.value, brute(w, h), t.text);
      }
    }
  }
  assert.ok(["5x2", "4x3", "3x4"].every((s) => shapes.has(s)), [...shapes].join(", "));
});

test("predlog s/z pred številom", async () => {
  const { sz } = await import("../server/practice/generators/tek-util.js");
  const S = [3, 4, 5, 6, 7, 13, 17, 23, 30, 45, 100, 150, 300, 1000];
  const Z = [0, 1, 2, 8, 9, 10, 11, 12, 18, 19, 20, 21, 28, 80, 200, 800, 2000];
  for (const n of S) assert.equal(sz(n), "s", String(n));
  for (const n of Z) assert.equal(sz(n), "z", String(n));
});
