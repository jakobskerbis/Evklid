// Indijski izpiti: CBSE, ICSE/ISC, državni odbori, JEE, NEET; dvojezične naloge (angleško, hindijsko).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Progress } from "../server/progress.js";
import { getPath } from "../server/curriculum.js";
import { EXAMS } from "../server/exam-data.js";
import { NAMES_HI, EXAM_HI } from "../server/exam-hi.js";
import { examInfo, examKeyFor, examsFor, taskLanguage, localizeExamView } from "../server/exams.js";
import { GENERATORS, generateTask } from "../server/practice/index.js";

const INDIA = Object.keys(EXAMS).filter((id) => EXAMS[id].country === "India");
const indiaKeys = () => INDIA.flatMap((id) => Object.keys(EXAMS[id].subjects).map((s) => `${s}-EX-${id}`));

test("india: all boards and entrance exams, by school system", () => {
  assert.deepEqual(INDIA.sort(), ["CBSE10", "CBSE12", "ICSE10", "ISC12", "JEEA", "JEEM", "NEET", "STATE10", "STATE12"]);
  assert.deepEqual(examsFor("IN-ICSE").own, ["JEEM", "JEEA", "NEET", "ICSE10", "ISC12"]);
  assert.deepEqual(examsFor("IN-STATE").own, ["JEEM", "JEEA", "NEET", "STATE10", "STATE12"]);
  assert.deepEqual(Object.keys(EXAMS.NEET.subjects), ["FIZ", "KEM", "BIO"]);
  // Privzeti izpit po razredu: šolski izpit pred sprejemnim.
  const key = (system, grade, subject = "MAT") => examKeyFor({ school_system: system, curriculum_level: grade, subject });
  assert.equal(key("IN-CBSE", "Class 8"), "MAT-EX-CBSE10");
  assert.equal(key("IN-CBSE", "Class 12", "BIO"), "BIO-EX-CBSE12");
  assert.equal(key("IN-ICSE", "Class 10", "KEM"), "KEM-EX-ICSE10");
  assert.equal(key("IN-ICSE", "Class 11", "FIZ"), "FIZ-EX-ISC12");
  assert.equal(key("IN-STATE", "Class 9"), "MAT-EX-STATE10");
});

test("india: every topic uses the English/Hindi exam bank, never Slovenian base topics", () => {
  for (const key of indiaKeys()) {
    for (const t of getPath(key).units.flatMap((u) => u.topics)) {
      assert.ok(t.base.length, t.id);
      for (const b of t.base) assert.match(b, /^(MAT|FIZ|KEM|BIO)-EXB\//, `${t.id} → ${b}`);
    }
  }
});

test("india: Hindi names for every unit and topic, Hindi exam descriptions", () => {
  for (const key of indiaKeys()) {
    for (const u of getPath(key).units) {
      assert.ok(NAMES_HI[u.title], `manjka hindijsko ime sklopa: ${u.title}`);
      for (const t of u.topics) assert.ok(NAMES_HI[t.name], `manjka hindijsko ime teme: ${t.name}`);
    }
  }
  for (const id of INDIA) assert.ok(EXAM_HI[id]?.about && EXAM_HI[id]?.full, id);
  const hi = examInfo("BIO-EX-NEET", "IN-CBSE", "hi");
  assert.equal(hi.lang, "hi");
  assert.match(hi.about, /[ऀ-ॿ]/);
  assert.equal(hi.subjectName, "जीव विज्ञान");
  assert.equal(examInfo("BIO-EX-NEET", "IN-CBSE").lang, "en");
  const view = localizeExamView({ units: [{ title: "Botany", topics: [{ name: "Ecology" }] }] }, "hi");
  assert.equal(view.units[0].title, "वनस्पति विज्ञान");
  assert.equal(view.units[0].topics[0].name, "पारिस्थितिकी");
});

test("india: task language follows the UI language chain", () => {
  assert.equal(taskLanguage("hi"), "hi");
  assert.equal(taskLanguage("bho"), "hi");
  assert.equal(taskLanguage("en"), "en");
  assert.equal(taskLanguage("ta"), "en");
  assert.equal(taskLanguage("sl"), "en");
  assert.equal(taskLanguage(undefined), "en");
});

test("india: bilingual generators give the same task in English and Hindi", () => {
  const bilingual = GENERATORS.filter((g) => g.langs?.includes("hi"));
  assert.ok(bilingual.length >= 40, `dvojezičnih generatorjev: ${bilingual.length}`);
  for (const g of bilingual) {
    for (let seed = 1; seed <= 3; seed++) {
      const en = generateTask(g.topics[0], 2, seed, "en");
      const hi = generateTask(g.topics[0], 2, seed, "hi");
      if (en.generator !== g.id) continue;
      assert.equal(hi.generator, g.id);
      assert.equal(hi.textLang, "hi");
      assert.equal(en.textLang, undefined);
      assert.match(hi.text, /[ऀ-ॿ]/, g.id);
      assert.equal(JSON.stringify(hi.answer.index ?? hi.answer.value ?? hi.answer.num), JSON.stringify(en.answer.index ?? en.answer.value ?? en.answer.num), g.id);
    }
  }
});

test("india: a Hindi-speaking student gets Hindi tasks, names and exam text", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { streamFn: async () => ({ content: [], text: "", stopReason: "end_turn" }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, { method: opts.method || "GET", headers: { "Content-Type": "application/json" }, body: opts.body ? JSON.stringify(opts.body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  try {
    const s = (await call("/api/students", { method: "POST", body: { name: "Aarav", settings: { school_system: "IN-CBSE", curriculum_level: "Class 12", subject: "FIZ", language: "hi" } } })).body;
    const v = (await call(`/api/students/${s.id}/exams?exam=NEET`)).body;
    assert.equal(v.key, "FIZ-EX-NEET");
    assert.equal(v.lang, "hi");
    assert.match(v.units[0].title, /[ऀ-ॿ]/);
    const bio = (await call(`/api/students/${s.id}/exams?key=BIO-EX-NEET`)).body;
    assert.equal(bio.key, "BIO-EX-NEET");
    const c = (await call(`/api/students/${s.id}/contest`, { method: "POST", body: { path: "BIO-EX-NEET" } })).body;
    assert.equal(c.total, 30);
    assert.equal(c.task.textLang, "hi");
    assert.match(c.task.text, /[ऀ-ॿ]/);
    assert.match(c.task.topicName, /[ऀ-ॿ]/);
    const topicId = bio.units[0].topics[0].id;
    const tp = (await call(`/api/topic?id=${encodeURIComponent(topicId)}&lang=hi`)).body;
    assert.match(tp.name, /[ऀ-ॿ]/);
    const tpEn = (await call(`/api/topic?id=${encodeURIComponent(topicId)}`)).body;
    assert.doesNotMatch(tpEn.name, /[ऀ-ॿ]/);
  } finally {
    server.close();
  }
});

test("india: English student on ICSE gets ICSE Class 10 mock in English", () => {
  const store = openDb(":memory:");
  const p = new Progress(store);
  const s = store.createStudent("Meera", { ...store.getStudent?.(0)?.settings, school_system: "IN-ICSE", curriculum_level: "Class 10", language: "en" });
  const n = p.startContest(s.id, "MAT-EX-ICSE10");
  assert.equal(n.total, 21);
  assert.equal(n.task.textLang, null);
});
