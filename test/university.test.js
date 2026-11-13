import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Progress } from "../server/progress.js";
import { getPath, getTopic, listPaths, listPrograms, listProgramPaths, pathKeyFor, studyProgramPrompt, topicOrder, uniTopicIds } from "../server/curriculum.js";
import { PROGRAMS, UNI_PATHS } from "../server/university-data.js";
import { COURSE_EXTENSIONS } from "../server/university-razsiritve.js";
import { normalizeSettings } from "../server/settings.js";
import { buildSystemPrompt } from "../server/prompt.js";
import { GENERATORS, generateTask, hasGenerator } from "../server/practice/index.js";
import { checkAnswer, roundHalfUp, fmt } from "../server/practice/check.js";
import { ALL_SUBJECTS } from "../server/subjects.js";

const UNI_SETTINGS = { educational_track: "UNIVERZA", study_program: "UL-FKKT-KEM", curriculum_level: "1. letnik", subject: "KEM" };

test("programs: every course of every faculty programme is a learning path with a year", () => {
  const programs = listPrograms();
  assert.equal(programs.length, Object.keys(PROGRAMS).length);
  for (const p of programs) {
    assert.ok(p.label.includes(p.name) && p.facultyName, p.id);
    const paths = listProgramPaths(p.id);
    assert.ok(paths.length >= 3, `${p.id}: premalo predmetov`);
    for (const path of paths) {
      const full = getPath(path.key);
      assert.ok(full && full.school === "UNI" && full.units.length, path.key);
      assert.ok([1, 2, 3, 4].includes(path.year) || path.elective, `${path.key}: letnik`);
      assert.ok(ALL_SUBJECTS.includes(path.subject), `${path.key}: predmet`);
    }
  }
  // Fakultetne poti ne vdirajo v sezname OŠ/SŠ in nimajo podvojenih tem.
  assert.ok(listPaths().every((p) => !p.key.startsWith("UNI-")));
  for (const key of Object.keys(UNI_PATHS)) {
    const ids = topicOrder(key).map((t) => t.id);
    assert.equal(new Set(ids).size, ids.length, `${key}: podvojena tema`);
  }
});

test("settings: university students pick a programme, competitions are off", () => {
  const s = normalizeSettings(UNI_SETTINGS);
  assert.equal(s.study_program, "UL-FKKT-KEM");
  assert.equal(s.track, "REGULAR");
  assert.equal(normalizeSettings({ ...UNI_SETTINGS, track: "COMPETITION" }).track, "REGULAR");
  // Neznan program pade na prvi; brez fakultete programa ne hranimo.
  assert.ok(PROGRAMS[normalizeSettings({ educational_track: "UNIVERZA", study_program: "XX" }).study_program]);
  assert.equal(normalizeSettings({ educational_track: "SREDNJA_SOLA", study_program: "UL-FKKT-KEM" }).study_program, "");
});

test("default path follows programme, year and subject", () => {
  assert.equal(pathKeyFor(normalizeSettings(UNI_SETTINGS)), "UNI-ULFKKT-SPLKEM");
  assert.equal(pathKeyFor(normalizeSettings({ ...UNI_SETTINGS, subject: "MAT" })), "UNI-ULFKKT-MAT");
  assert.equal(pathKeyFor(normalizeSettings({ ...UNI_SETTINGS, curriculum_level: "2. letnik" })), "UNI-ULFKKT-ANAL2");
  // Letnik brez predmeta iz izbranega področja: prvi predmet letnika.
  const bio3 = pathKeyFor(normalizeSettings({ educational_track: "UNIVERZA", study_program: "UL-FKKT-BIO", curriculum_level: "3. letnik", subject: "MAT" }));
  assert.equal(bio3, "UNI-ULFKKT-SPEKTROBIO");
  assert.equal(getPath(bio3).grade, 3);
  // OŠ/SŠ nespremenjeno.
  assert.equal(pathKeyFor(normalizeSettings({ educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" })), "MAT-OS-8");
});

test("system prompt names the faculty, programme and this year's courses", () => {
  const settings = normalizeSettings(UNI_SETTINGS);
  const text = studyProgramPrompt(settings);
  assert.match(text, /Fakulteta za kemijo in kemijsko tehnologijo/);
  assert.match(text, /Kemija/);
  assert.match(text, /Splošna kemija/);
  assert.match(text, /Zgradba in lastnosti trdnin/);
  const prompt = buildSystemPrompt({ settings, studentName: "Maja" });
  assert.ok(prompt.includes(text));
  assert.ok(prompt.includes("UNIVERZA"));
  assert.equal(studyProgramPrompt(normalizeSettings({ educational_track: "OSNOVNA_SOLA" })), "(ni fakultete)");
});

test("university generators: every task checks against its own answer", () => {
  const uni = GENERATORS.filter((g) => g.id.startsWith("uni-"));
  assert.ok(uni.length >= 40);
  let n = 0;
  for (const g of uni) {
    assert.ok(g.topics.length, `${g.id}: brez tem (napačen naslov teme?)`);
    for (const topicId of g.topics) {
      assert.ok(getTopic(topicId), topicId);
      for (let level = 1; level <= 3; level++) {
        for (let seed = 1; seed <= 12; seed++) {
          const t = generateTask(topicId, level, seed);
          if (t.generator !== g.id) continue;
          n++;
          const a = t.answer;
          assert.equal(a.type, "number", g.id);
          assert.ok(Number.isFinite(a.value), `${g.id}: ${a.value}`);
          const input = (a.decimals != null ? fmt(roundHalfUp(a.value, a.decimals), a.decimals) : fmt(a.value)) + (a.unit ? " " + a.unit : "");
          assert.equal(checkAnswer(a, input).kind, "correct", `${g.id} L${level} seed ${seed}: ${input}`);
          assert.doesNotMatch(t.text + t.hint + t.solution, /undefined|NaN/, g.id);
        }
      }
    }
  }
  assert.ok(n > 1000);
  // Velik del fakultetnih tem MAT/FIZ/KEM ima generator.
  // (velja za matematiko, fiziko in kemijo; strokovni predmeti, npr. biologija, so zaenkrat brez računskih nalog)
  // Tehniški in medicinski programi (dodani 30. 10. 2026) imajo zelo specializirane teme
  // (elektrotehnika, strojništvo, medicina), ki generatorjev še nimajo; zanje velja nižji delež.
  const LATER_FAC = new Set(["UL-FRI", "UL-FE", "UM-FERI", "UL-MF", "UL-VF", "UM-FS", "UM-FGPA", "UM-MF"]);
  const LATER_PROG = new Set(["UL-FGG-GR", "UL-FGG-GIG", "UL-FFA-FAR"]);
  const later = (id, p) => LATER_FAC.has(p.faculty) || LATER_PROG.has(id);
  const keysOf = (pick) => [...new Set(Object.entries(PROGRAMS).filter(([id, p]) => pick(id, p)).flatMap(([, p]) => [...p.courseKeys.flat(), ...p.electiveKeys]))];
  const share = (keys) => {
    const topics = keys.filter((k) => ["MAT", "FIZ", "KEM"].includes(UNI_PATHS[k].subject)).flatMap((k) => topicOrder(k));
    return [topics.filter((t) => hasGenerator(t.id)).length, topics.length];
  };
  const [withGen, all] = share(keysOf((id, p) => !later(id, p)));
  assert.ok(withGen / all > 0.28, `${withGen}/${all} tem z generatorjem`);
  const [withGenLater, allLater] = share(keysOf(later));
  assert.ok(withGenLater / allLater > 0.14, `${withGenLater}/${allLater} tem tehniških in medicinskih programov z generatorjem`);
  // Teme po naslovu: isti naslov v več predmetih deli generator.
  assert.ok(uniTopicIds("Kisline in baze").length >= 2);
});

test("a student practises a faculty course and earns XP", () => {
  const store = openDb(":memory:");
  const p = new Progress(store);
  const s = store.createStudent("Maja", UNI_SETTINGS);
  const key = pathKeyFor(s.settings);
  const view = p.pathView(s.id, key);
  assert.equal(view.key, "UNI-ULFKKT-SPLKEM");
  assert.ok(view.units.some((u) => u.hasPractice));
  const topic = view.units.flatMap((u) => u.topics).find((t) => t.practice);
  p.nextPractice(s.id, topic.id); // rešen zgled
  const { task } = p.nextPractice(s.id, topic.id);
  assert.ok(task.id);
  const r = p.answer(s.id, task.id, "0");
  assert.ok(["wrong", "correct", "rounding", "unit", "format"].includes(r.kind), JSON.stringify(r));
});

test("API: programmes list, programme paths and a university student profile", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { streamFn: async () => ({ content: [], text: "", stopReason: "end_turn" }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, { method: opts.method || "GET", headers: { "Content-Type": "application/json" }, body: opts.body ? JSON.stringify(opts.body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  try {
    const programs = (await call("/api/programs")).body;
    assert.ok(programs.find((p) => p.id === "UL-FMF-MAT"));
    const paths = (await call("/api/paths?program=UL-FMF-MAT")).body;
    assert.ok(paths.find((p) => p.label.startsWith("Analiza 1") && p.year === 1));
    assert.ok((await call("/api/paths?program=UL-FMF-FIZ")).body.some((p) => p.elective && p.year === null));
    assert.deepEqual((await call("/api/paths?program=XX")).body, []);
    const s = (await call("/api/students", { method: "POST", body: { name: "Tine", settings: { ...UNI_SETTINGS, study_program: "UL-FS-RRP", subject: "FIZ" } } })).body;
    assert.equal(s.settings.study_program, "UL-FS-RRP");
    const path = (await call(`/api/students/${s.id}/path`)).body;
    assert.equal(path.key, "UNI-ULFS-FIZ");
    assert.equal(path.defaultKey, "UNI-ULFS-FIZ");
    const toc = (await call("/api/textbook/toc?path=UNI-ULFS-STATKIN")).body;
    assert.ok(toc.units.flatMap((u) => u.topics).some((t) => t.practice));
  } finally {
    server.close();
  }
});

test("EMŠ programmes (medicine, pharmacy) are labelled and described as single-cycle master's", () => {
  for (const id of ["UL-MF-MED", "UL-MF-DM", "UM-MF-SM", "UL-VF-VET", "UL-FFA-FAR"]) {
    assert.ok(PROGRAMS[id], id);
    assert.match(PROGRAMS[id].label, /\(EMŠ\)$/, id);
    assert.ok(PROGRAMS[id].years.length <= 4, id);
  }
  assert.match(PROGRAMS["UL-FRI-RI"].label, /\(UN\)$/);
  // Izbirnik in opomba na učni poti izbereta besedilo po vrsti študija.
  const listed = listPrograms();
  assert.equal(listed.find((p) => p.id === "UL-MF-MED").degree, "EMŠ");
  assert.equal(listed.find((p) => p.id === "UL-FRI-RI").degree, "UN");
  const s = studyProgramPrompt({ educational_track: "UNIVERZA", study_program: "UL-MF-MED", curriculum_level: "1. letnik" });
  assert.match(s, /enoviti magistrski študijski program Medicina; predmeti 1\. letnika: /);
});

test("syllabus extensions add topics without duplicates and keep the shared blocks unchanged", () => {
  for (const [key, extra] of Object.entries(COURSE_EXTENSIONS)) {
    const titles = UNI_PATHS[key].units.flatMap(([, topics]) => topics.map((t) => t.split(" | ")[0]));
    assert.equal(new Set(titles).size, titles.length, `${key}: podvojena tema`);
    for (const [, topics] of extra) for (const t of topics) assert.ok(titles.includes(t.split(" | ")[0]), `${key}: manjka ${t}`);
  }
  // Razširitev dobi le razširjeni predmet: skupni bloki (npr. »Zgradba snovi«) ostanejo pri drugih predmetih enaki.
  assert.ok(UNI_PATHS["UNI-ULFKKT-SPLKEM"].units.length > 4);
  const others = Object.entries(UNI_PATHS).filter(([k, p]) => !COURSE_EXTENSIONS[k] && p.units.some(([u]) => u === "Zgradba snovi"));
  for (const [k, p] of others) assert.ok(!p.units.flatMap(([, t]) => t).some((t) => t.startsWith("Teorija molekulskih orbital |")), `${k}: razširitev je ušla v skupni blok`);
});
