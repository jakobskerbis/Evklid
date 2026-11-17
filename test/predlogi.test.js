// Predlogi v praznem klepetu (j, 17. 11. 2026): po profilu in vsakič drugačni (public/predlogi.js).
import test from "node:test";
import assert from "node:assert/strict";
import { chatIdeas, examIdea } from "../public/predlogi.js";

const t = (k, p = {}) => (p.topic ? `${k}:${p.topic}` : k);
// mulberry32: ponovljivo naključje za teste.
const seq = (a) => () => {
  a = (a + 0x6d2b79f5) | 0;
  let x = Math.imul(a ^ (a >>> 15), 1 | a);
  x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
  return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
};
const path = {
  next: { id: "t3", name: "Zaporedja" },
  topics: [
    { id: "t1", name: "Funkcije", status: "mastered" },
    { id: "t2", name: "Limite", status: "mastered" },
    { id: "t3", name: "Zaporedja" },
    { id: "t4", name: "Indukcija" },
    { id: "t5", name: "Odvod" },
    { id: "t6", name: "Integral" },
  ],
};
const maturant = { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR", subject: "MAT" };

test("predlogi: trije, vsak z drugo temo in drugo vrsto vprašanja", () => {
  for (let i = 1; i < 60; i++) {
    const ideas = chatIdeas(maturant, path, t, seq(i));
    assert.equal(ideas.length, 3);
    assert.equal(new Set(ideas).size, 3);
    const kinds = ideas.map((x) => x.split(":")[0]);
    assert.equal(new Set(kinds).size, 3, ideas.join(" | "));
    const topics = ideas.map((x) => x.split(":")[1]).filter(Boolean);
    assert.equal(new Set(topics).size, topics.length, ideas.join(" | "));
    assert.ok(ideas.every((x) => !/Funkcije|Limite/.test(x) || /ideaRepeat|ideaTask|ideaQuiz/.test(x)), "osvojene teme samo za ponavljanje");
  }
});

test("predlogi: se spreminjajo med novimi klepeti", () => {
  const seen = new Set();
  for (let i = 1; i < 40; i++) seen.add(chatIdeas(maturant, path, t, seq(i)).slice().sort().join("|"));
  assert.ok(seen.size > 10, `samo ${seen.size} različnih naborov`);
  const exam = [...Array(40)].filter((_, i) => chatIdeas(maturant, path, t, seq(i + 1)).includes("chat.ideaMaturaVR")).length;
  assert.ok(exam > 10 && exam < 40, `matura v ${exam} od 40`);
});

test("predlogi: naloga v slogu izpita samo za maturante in NPZ, brez poti splošni", () => {
  assert.equal(examIdea(maturant), "chat.ideaMaturaVR");
  assert.equal(examIdea({ ...maturant, curriculum_level: "4. letnik OR" }), "chat.ideaMaturaOR");
  assert.equal(examIdea({ ...maturant, subject: "KEM" }), "chat.ideaMatura");
  assert.equal(examIdea({ ...maturant, curriculum_level: "3. letnik VR" }), null);
  assert.equal(examIdea({ educational_track: "OSNOVNA_SOLA", curriculum_level: "9. razred", subject: "MAT" }), "chat.ideaNpz");
  assert.equal(examIdea({ educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" }), null);
  assert.deepEqual(chatIdeas({}, null, t, seq(3)).slice().sort(), ["chat.idea1", "chat.idea2", "chat.idea3"]);
  // Ena sama tema: različne vrste vprašanj iste teme.
  const one = chatIdeas({}, { topics: [{ id: "a", name: "Ulomki" }] }, t, seq(5));
  assert.equal(one.length, 3);
  assert.equal(new Set(one).size, 3);
});
