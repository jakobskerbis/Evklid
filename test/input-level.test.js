// Glasovni vnos (izgovorjeni izrazi), tipkovnica s simboli (kemijske formule) in prehod v višji letnik.
import test from "node:test";
import assert from "node:assert/strict";
import { spokenMath } from "../public/speech.js";
import { chemFormat, GROUPS, groupOrder } from "../public/symbols.js";
import { stageUp as stageUpClient } from "../public/level-up.js";
import { nextLevel, levelUpSuggestion, stageUp, schoolYearOf } from "../server/level-up.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

test("izgovorjeni računi se zapišejo s simboli", () => {
  assert.equal(spokenMath("Koliko je x na kvadrat plus 3 krat x je enako 0"), "Koliko je x² + 3 · x = 0");
  assert.equal(spokenMath("koren iz 16 deljeno z 2"), "√16 : 2");
  assert.equal(spokenMath("kvadratni koren iz 81"), "√81");
  assert.equal(spokenMath("a na kub minus b na kub"), "a³ − b³");
  assert.equal(spokenMath("3 skozi 4 plus 1 skozi 2"), "3/4 + 1/2");
  assert.equal(spokenMath("3 cela 5 krat pi"), "3,5 · π");
  assert.equal(spokenMath("kot 30 stopinj"), "kot 30°");
  assert.equal(spokenMath("koliko je 7 krat 8?"), "koliko je 7 · 8?");
});

test("navadno besedilo ostane nespremenjeno", () => {
  for (const t of ["Kako izračunam površino kocke?", "kaj je to plus ena stvar", "dvakrat sem poskusil", "minus 5 stopinj zunaj"]) {
    assert.equal(spokenMath(t), t.replace("5 stopinj", "5°"));
  }
  assert.equal(spokenMath(""), "");
});

test("kemijske formule dobijo indekse in naboje", () => {
  assert.equal(chemFormat("2H2 + O2 → 2H2O"), "2H₂ + O₂ → 2H₂O");
  assert.equal(chemFormat("Ca(OH)2 in H2SO4"), "Ca(OH)₂ in H₂SO₄");
  assert.equal(chemFormat("Fe3+ in SO4 2-"), "Fe³⁺ in SO₄²⁻");
  assert.equal(chemFormat("Na+ Cl- NaCl"), "Na⁺ Cl⁻ NaCl");
  assert.equal(chemFormat("C6H12O6 + 6O2"), "C₆H₁₂O₆ + 6O₂");
  assert.equal(chemFormat("CuSO4·5H2O"), "CuSO₄·5H₂O");
  assert.equal(chemFormat("Koliko molov je v 18 g H2O?"), "Koliko molov je v 18 g H₂O?");
  // matematika in navadne besede ostanejo
  assert.equal(chemFormat("točka A2 in x2 + 3, Ja"), "točka A2 in x2 + 3, Ja");
});

test("skupine simbolov so urejene po ravni", () => {
  assert.equal(groupOrder("FAKS", "MAT")[0], "analiza");
  assert.equal(groupOrder("OS", "MAT")[0], "osnovno");
  assert.equal(groupOrder("SS", "KEM")[0], "kemija");
  assert.ok(!groupOrder("OS", "FIZ").includes("analiza"));
  for (const g of Object.values(GROUPS)) for (const k of g.keys) assert.ok((k.ins.match(/@/g) || []).length <= 1, k.label);
});

test("naslednja raven", () => {
  assert.deepEqual(nextLevel({ educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred" }).settings, { educational_track: "OSNOVNA_SOLA", curriculum_level: "9. razred" });
  const ss = nextLevel({ educational_track: "OSNOVNA_SOLA", curriculum_level: "9. razred" });
  assert.equal(ss.stageUp, "SS");
  assert.equal(ss.settings.curriculum_level, "1. letnik OR");
  assert.equal(nextLevel({ educational_track: "SREDNJA_SOLA", curriculum_level: "2. letnik VR" }).settings.curriculum_level, "3. letnik VR");
  const uni = nextLevel({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik OR" });
  assert.equal(uni.stageUp, "UNI");
  assert.ok(uni.choose);
  assert.equal(nextLevel({ educational_track: "UNIVERZA", study_program: "UL-FKKT-KEM", curriculum_level: "3. letnik" }), null);
  assert.equal(nextLevel({ educational_track: "UNIVERZA", study_program: "UL-FKKT-KEM", curriculum_level: "1. letnik" }).settings.curriculum_level, "2. letnik");
  assert.equal(stageUp({ educational_track: "OSNOVNA_SOLA" }, { educational_track: "SREDNJA_SOLA" }), "SS");
  assert.equal(stageUp({ educational_track: "UNIVERZA" }, { educational_track: "SREDNJA_SOLA" }), null);
  assert.equal(stageUpClient({ educational_track: "SREDNJA_SOLA" }, { educational_track: "UNIVERZA" }), "UNI");
  assert.equal(stageUpClient({ educational_track: "SREDNJA_SOLA" }, { educational_track: "SREDNJA_SOLA" }), null);
});

test("predlog za prehod samo na začetku šolskega leta in če je raven iz lanskega leta", () => {
  const st = { settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred" }, level_since: "2026-03-10 12:00:00" };
  const sep = new Date(Date.UTC(2026, 8, 5));
  const s = levelUpSuggestion(st, sep);
  assert.equal(s.label, "9. razred");
  assert.equal(s.schoolYear, "2026/27");
  assert.equal(levelUpSuggestion(st, new Date(Date.UTC(2026, 11, 1))), null); // december
  assert.equal(levelUpSuggestion(st, new Date(Date.UTC(2026, 4, 1))), null); // maj
  assert.equal(levelUpSuggestion({ ...st, level_since: "2026-09-01 08:00:00" }, sep), null); // raven že nastavljena letos
  assert.equal(schoolYearOf(new Date(Date.UTC(2027, 1, 1))), 2026);
});

test("faks: študijsko leto od 1. oktobra, predlog od 19. septembra do konca novembra", () => {
  const st = { settings: { educational_track: "UNIVERZA", study_program: "", curriculum_level: "1. letnik" }, level_since: "2026-07-10 12:00:00" };
  assert.equal(levelUpSuggestion(st, new Date(Date.UTC(2026, 8, 5))), null); // 5. 9.: šolsko leto da, študijsko še ne
  const s = levelUpSuggestion(st, new Date(Date.UTC(2026, 9, 3)));
  assert.equal(s.label, "2. letnik");
  assert.equal(s.schoolYear, "2026/27");
  assert.equal(s.study, true);
  assert.ok(levelUpSuggestion(st, new Date(Date.UTC(2026, 10, 25)))); // 25. 11.
  assert.equal(levelUpSuggestion(st, new Date(Date.UTC(2026, 11, 2))), null); // december
  // Raven nastavljena avgusta (po izpitih) velja že za novo študijsko leto.
  assert.equal(levelUpSuggestion({ ...st, level_since: "2026-08-20 08:00:00" }, new Date(Date.UTC(2026, 9, 3))), null);
  // SŠ ostane pri šolskem letu (september).
  const ss = { settings: { educational_track: "SREDNJA_SOLA", curriculum_level: "2. letnik OR" }, level_since: "2026-03-10 12:00:00" };
  assert.equal(levelUpSuggestion(ss, new Date(Date.UTC(2026, 8, 5))).study, false);
});

test("sprememba ravni zapiše čas in API vrne predlog", async () => {
  const store = openDb(":memory:");
  const st = store.createStudent("Ana", { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred" });
  assert.equal(st.level_since, st.created_at);
  store.db.prepare("UPDATE students SET created_at = '2025-09-01 10:00:00' WHERE id = ?").run(st.id);
  assert.equal(store.updateStudent(st.id, { name: "Ana B" }).level_since, "2025-09-01 10:00:00"); // ime ne spremeni ravni
  const moved = store.updateStudent(st.id, { settings: { curriculum_level: "9. razred" } });
  assert.notEqual(moved.level_since, "2025-09-01 10:00:00");

  const app = createApp(store, {});
  const server = app.listen(0);
  try {
    const r = await fetch(`http://127.0.0.1:${server.address().port}/api/students/${st.id}/level-up`).then((x) => x.json());
    assert.equal(r.premium, true); // brez računov je vse odklenjeno
    assert.equal(r.next.stageUp, "SS");
    assert.equal(r.suggestion, null); // raven je bila pravkar spremenjena
  } finally {
    server.close();
  }
});
