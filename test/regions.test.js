import test from "node:test";
import assert from "node:assert/strict";
import zlib from "node:zlib";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { SCHOOL_SYSTEMS, SYSTEM_IDS, gradesOf, systemForCountry, defaultGrade } from "../public/regions.js";
import { listPaths, pathKeyFor, getTopic, topicOrder, baseTopicIds, pathLabelFor } from "../server/curriculum.js";
import { hasGenerator, generateTask } from "../server/practice/index.js";
import { normalizeSettings } from "../server/settings.js";
import { nextLevel, levelUpSuggestion } from "../server/level-up.js";
import { buildSystemPrompt } from "../server/prompt.js";
import { lessonView, listBooks } from "../server/textbook.js";
import { plansFor, currencyForCountry, planByKey, REGIONAL_PRICES } from "../server/accounts/plans.js";
import { pickEncoding } from "../server/compress.js";
import { Progress } from "../server/progress.js";

test("every grade of every school system has a learning path in every school subject", () => {
  for (const id of SYSTEM_IDS.filter((x) => x !== "SI")) {
    assert.ok(gradesOf(id).length, id);
    for (const g of gradesOf(id)) {
      for (const subject of ["MAT", "FIZ", "KEM"]) {
        const key = pathKeyFor({ school_system: id, curriculum_level: g.label, subject });
        assert.ok(key, `${id} ${g.label} ${subject}`);
        assert.ok(listPaths(subject, id).some((p) => p.key === key), `${id} ${g.label} ${subject}: ${key} ni na seznamu`);
      }
    }
  }
});

test("regional paths map onto existing topics; Slovenian lists stay Slovenian", () => {
  assert.equal(pathKeyFor({ school_system: "NG", curriculum_level: "JSS 1", subject: "FIZ" }), "FIZ-INT-8");
  assert.equal(pathKeyFor({ school_system: "IN-CBSE", curriculum_level: "Class 8", subject: "KEM" }), "KEM-IN-8");
  assert.equal(pathKeyFor({ school_system: "TZ", curriculum_level: "Form 5", subject: "MAT" }), "MAT-INT-12");
  assert.equal(pathLabelFor("MAT-INT-8", "NG"), "Mathematics, JSS 2");
  assert.ok(listPaths("MAT").every((p) => !/-(IN|INT)-/.test(p.key)), "regijske poti v slovenskem seznamu");
  assert.ok(listPaths("MAT", "IN-CBSE").every((p) => p.school === "IN"));
  const t = getTopic("MAT-IN-8/squares-and-their-patterns");
  assert.deepEqual(t.base, ["MAT-OS-8/kvadrat-stevila"]);
  assert.deepEqual(baseTopicIds("MAT-OS-8/kvadrat-stevila"), ["MAT-OS-8/kvadrat-stevila"]);
  // INT teme imajo angleška imena.
  assert.equal(topicOrder("MAT-INT-8")[0].name, "Integers");
});

test("regional topics borrow generators, lessons and keep their own id", () => {
  const id = "MAT-IN-10/solving-quadratic-equations";
  const lin = "MAT-INT-8/linear-equations";
  assert.ok(getTopic(lin), "INT tema");
  assert.ok(hasGenerator(lin));
  const task = generateTask(lin, 2, 1234);
  assert.equal(task.topicId, lin);
  assert.deepEqual(generateTask(lin, 2, 1234).text, task.text, "isto seme, ista naloga");
  assert.ok(getTopic(id));
  const view = lessonView("MAT-INT-8/pythagoras-theorem");
  assert.equal(view.name, "Pythagoras' theorem");
  assert.ok(view.practice);
  // Teme brez osnovne teme (npr. matrike) nimajo vaj, a obstajajo.
  assert.ok(getTopic("MAT-IN-12/matrices"));
  assert.equal(hasGenerator("MAT-IN-12/matrices"), false);
  // Vsaj tretjina regijskih tem ima vaje.
  for (const prefix of ["MAT-IN-", "MAT-INT-"]) {
    const all = [6, 7, 8, 9, 10, 11, 12].flatMap((n) => topicOrder(`${prefix}${n}`));
    const share = all.filter((x) => hasGenerator(x.id)).length / all.length;
    assert.ok(share > 0.33, `${prefix}: ${share}`);
  }
});

test("settings: regional grade, track from year of school, back to Slovenia resets the grade", () => {
  const ng = normalizeSettings({ school_system: "NG", curriculum_level: "SS 2", educational_track: "UNIVERZA" });
  assert.equal(ng.educational_track, "SREDNJA_SOLA");
  assert.equal(ng.study_program, "");
  assert.equal(normalizeSettings({ school_system: "NG", curriculum_level: "8. razred" }).curriculum_level, defaultGrade("NG"));
  const back = normalizeSettings({ school_system: "SI", curriculum_level: "JSS 2" });
  assert.equal(back.curriculum_level, "8. razred");
  assert.equal(normalizeSettings({}).school_system, "SI");
  assert.equal(normalizeSettings({ data_mode: "lite" }).data_mode, "lite");
  assert.equal(normalizeSettings({ data_mode: "x" }).data_mode, "auto");
});

test("default system from the device country; next grade and school-year start per country", () => {
  assert.equal(systemForCountry("IN"), "IN-CBSE");
  assert.equal(systemForCountry("ci"), "FR-AF");
  assert.equal(systemForCountry("SI"), "SI");
  assert.equal(systemForCountry("US"), "US");
  assert.equal(systemForCountry("CN"), "CN");
  assert.equal(systemForCountry("DE"), "DE");
  assert.equal(systemForCountry("LI"), "CH");
  assert.equal(systemForCountry("BR"), "BR");
  assert.equal(systemForCountry("IT"), "SI");
  assert.equal(nextLevel({ school_system: "NG", curriculum_level: "JSS 3" }).label, "SS 1");
  assert.equal(nextLevel({ school_system: "NG", curriculum_level: "SS 3" }), null);
  // Indija: šolsko leto se začne aprila, predlog konec marca.
  const student = { settings: { school_system: "IN-CBSE", curriculum_level: "Class 8" }, created_at: "2025-06-01 10:00:00" };
  assert.equal(levelUpSuggestion(student, new Date("2026-03-25T10:00:00Z"))?.label, "Class 9");
  assert.equal(levelUpSuggestion(student, new Date("2026-09-01T10:00:00Z")), null);
  // Slovenija ostane: 20. avgust–31. oktober.
  const si = { settings: { curriculum_level: "8. razred", educational_track: "OSNOVNA_SOLA" }, created_at: "2026-01-01 10:00:00" };
  assert.equal(levelUpSuggestion(si, new Date("2026-09-01T10:00:00Z"))?.label, "9. razred");
});

test("tutor prompt names the school system, local helpline and short replies in lite mode", () => {
  const s = normalizeSettings({ school_system: "IN-CBSE", curriculum_level: "Class 10", language: "en" });
  const p = buildSystemPrompt({ settings: s, lite: true });
  assert.match(p, /Šolski sistem: India – CBSE \/ NCERT; razred Class 10/);
  assert.match(p, /CHILDLINE 1098/);
  assert.match(p, /Dolžina odgovorov: kratka/);
  const si = buildSystemPrompt({ settings: normalizeSettings({}) });
  assert.match(si, /Šolski sistem: Slovenija/);
  assert.match(si, /Dolžina odgovorov: običajna/);
});

test("textbook books per school system", () => {
  const sl = listBooks();
  assert.ok(sl.every((b) => ["OS", "SS", "TEK"].includes(b.school)));
  const ind = listBooks({ system: "IN-CBSE" });
  assert.deepEqual(ind.map((b) => b.key).sort(), ["FIZ-IN", "KEM-IN", "MAT-IN"]);
  assert.equal(ind.find((b) => b.key === "MAT-IN").subjectName, "Mathematics");
});

test("regional prices: local currency per country, Slovenia stays in euros", () => {
  assert.equal(currencyForCountry("IN"), "INR");
  assert.equal(currencyForCountry("SI"), "EUR");
  assert.equal(currencyForCountry("TZ"), "USD");
  assert.equal(currencyForCountry("DE"), "EUR");
  const inr = plansFor("INR");
  assert.equal(inr.length, 4);
  assert.equal(inr.find((p) => p.seats === 1 && p.interval === "month").amount, 39900);
  assert.equal(plansFor("VND")[0].amount, 129000, "VND nima decimalk");
  assert.equal(plansFor("EUR").find((p) => p.seats === 1 && p.interval === "month").amount, 999);
  assert.equal(planByKey("evklid_2_year_ngn").currency, "NGN");
  assert.equal(planByKey("evklid_1_month").currency, "EUR");
  for (const [cur, v] of Object.entries(REGIONAL_PRICES)) {
    const [m1, y1, m2, y2] = v.prices;
    assert.ok(y1 < m1 * 10 && m2 < m1 * 2 && y2 < y1 * 2 && y2 < m2 * 10, cur);
  }
});

test("offline pack and sync: answers are re-checked on the server and counted once", () => {
  const store = openDb(":memory:");
  const progress = new Progress(store);
  const s = store.createStudent("Asha", { school_system: "IN-CBSE", curriculum_level: "Class 8" });
  const key = pathKeyFor(s.settings);
  const pack = progress.offlinePack(s.id, key, 3);
  const [topicId, list] = Object.entries(pack.tasks)[0];
  assert.ok(list.length === 3 && list[0].answer && list[0].task.text);
  const right = list[0].answer.type === "choice" ? list[0].answer.options[list[0].answer.index] : String(list[0].answer.value ?? "");
  const results = [
    { topic_id: topicId, level: list[0].level, seed: list[0].seed, answer: right },
    { topic_id: topicId, level: list[1].level, seed: list[1].seed, answer: "nonsense 999999" },
    { topic_id: "MAT-IN-8/ne-obstaja", level: 1, seed: 1, answer: "1" },
  ];
  const first = progress.offlineSync(s.id, results);
  assert.equal(first.synced, 2);
  assert.equal(progress.offlineSync(s.id, results).synced, 0, "ista naloga ne šteje dvakrat");
});

test("compression: brotli for static files and API JSON, plain when not accepted", async () => {
  assert.equal(pickEncoding("gzip, deflate, br"), "br");
  assert.equal(pickEncoding("gzip"), "gzip");
  assert.equal(pickEncoding(""), null);
  const store = openDb(":memory:");
  const server = createApp(store).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const res = await fetch(`${base}/app.js`, { headers: { "Accept-Encoding": "br" } });
    assert.equal(res.headers.get("content-encoding"), "br");
    const raw = Buffer.from(await res.arrayBuffer());
    // fetch odstisne sam; preverimo, da je vsebina JavaScript.
    assert.match(raw.toString("utf8").slice(0, 200), /Evklid|import/);
    const api = await fetch(`${base}/api/paths?subject=MAT&system=IN-CBSE`, { headers: { "Accept-Encoding": "gzip" } });
    assert.equal(api.status, 200);
    const paths = await api.json();
    assert.equal(paths[0].key, "MAT-IN-6");
    const check = await fetch(`${base}/practice/check.js`);
    assert.equal(check.status, 200);
    assert.match(await check.text(), /export function checkAnswer/);
    assert.ok(zlib.brotliCompressSync); // brez dodatnih knjižnic
  } finally {
    server.close();
  }
});
