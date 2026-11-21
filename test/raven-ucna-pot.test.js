// Maturant na osnovni ravni (»4. letnik OR«): učna pot in priprava na test brez tem samo za višjo raven
// (primerjava z Astro, 21. 11. 2026: pot OR se je začela z matematično indukcijo, priprava je dala drugi odvod).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { getPath } from "../server/curriculum.js";
import { createApp } from "../server/app.js";

const VR_ONLY = /\(višja raven\)\s*$/;

test("MAT-SS path for an OR student hides VR-only topics; VR and unsure students keep them; test prep follows", async () => {
  const path = getPath("MAT-SS-4");
  const all = path.units.flatMap((u) => u.topics);
  const vrOnly = new Set(all.filter((t) => VR_ONLY.test(t.goals || "")).map((t) => t.id));
  assert.ok([...vrOnly].some((id) => /indukcij/.test(id)), "matematična indukcija je po katalogu samo višja raven");
  assert.ok(vrOnly.size >= 4);

  const store = openDb(":memory:");
  const app = createApp(store, { streamFn: async () => ({ content: [], text: "", stopReason: "end_turn" }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, opts = {}) => {
    const res = await fetch(base + p, { method: opts.method || "GET", headers: { "Content-Type": "application/json" }, body: opts.body ? JSON.stringify(opts.body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  const ids = (v) => v.units.flatMap((u) => u.topics.map((t) => t.id));
  try {
    const mk = async (level) => (await call("/api/students", { method: "POST", body: { name: "Ana", settings: { educational_track: "SREDNJA_SOLA", curriculum_level: level, subject: "MAT" } } })).body;
    const or = await mk("4. letnik OR");
    const vr = await mk("4. letnik VR");
    const unsure = await mk("4. letnik");
    const pOr = (await call(`/api/students/${or.id}/path`)).body;
    const pVr = (await call(`/api/students/${vr.id}/path`)).body;
    const pUn = (await call(`/api/students/${unsure.id}/path`)).body;
    assert.equal(pOr.key, "MAT-SS-4");
    assert.ok(!ids(pOr).some((id) => vrOnly.has(id)), "osnovna raven: brez tem višje ravni");
    assert.ok(!/indukcij/.test(ids(pOr)[0]), "pot OR se ne začne z indukcijo");
    // Indeks sklopa iz pogleda (test-plan, placement, sklop) je indeks v path.units: noben sklop ne sme izpasti.
    assert.equal(pOr.units.length, path.units.length, "OR: vsi sklopi ostanejo (indeksi sklopov se ne zamaknejo)");
    assert.equal(ids(pVr).length, all.length, "višja raven: vse teme");
    assert.equal(ids(pUn).length, all.length, "»še ne vem«: vse teme");

    // Priprava na test iz sklopa Odvod: OR dobi samo teme osnovne ravni.
    const odvod = path.units.findIndex((u) => u.topics.some((t) => /drugi-odvod/.test(t.id)));
    assert.ok(odvod >= 0);
    const date = new Date(Date.now() + 10 * 864e5).toISOString().slice(0, 10);
    for (const [s, expectVr] of [[or, false], [vr, true]]) {
      assert.equal((await call(`/api/students/${s.id}/test-plan`, { method: "POST", body: { path: "MAT-SS-4", units: [odvod], date } })).status, 200);
      assert.equal((await call(`/api/students/${s.id}/test-prep`, { method: "POST", body: {} })).status, 200);
      const row = store.db.prepare("SELECT plan FROM sessions WHERE student_id = ? AND kind = 'test' ORDER BY rowid DESC").get(s.id);
      const topics = new Set(JSON.parse(row.plan).map((x) => x.topic));
      assert.equal([...topics].some((id) => vrOnly.has(id)), expectVr, `${expectVr ? "VR" : "OR"}: ${[...topics].join(", ")}`);
    }
    // Preizkus znanja sklopa Odvod: OR samo teme osnovne ravni (kot sklop na poti).
    for (const [s, expectVr] of [[or, false], [vr, true]]) {
      assert.equal((await call(`/api/students/${s.id}/placement`, { method: "POST", body: { path: "MAT-SS-4", unit: odvod } })).status, 200);
      const row = store.db.prepare("SELECT plan FROM sessions WHERE student_id = ? AND kind = 'placement' ORDER BY rowid DESC").get(s.id);
      const topics = new Set(JSON.parse(row.plan).map((x) => x.topic));
      assert.equal([...topics].some((id) => vrOnly.has(id)), expectVr, `placement ${expectVr ? "VR" : "OR"}: ${[...topics].join(", ")}`);
    }
  } finally {
    server.close();
  }
});
