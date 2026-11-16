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
