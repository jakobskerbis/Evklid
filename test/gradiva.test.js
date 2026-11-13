import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { speakTex, speakMarkdown, zs } from "../server/govor.js";
import { summaryParts, summaryPage, audioSummary, worksheetTasks, worksheetPage, answerHtml, branchOf, weakTopicIds } from "../server/gradiva.js";
import { officialPapers } from "../server/exams.js";

const OHM = "FIZ-OS-9/upor-in-ohmov-zakon";

test("complex numbers and sets are read aloud (bug report: lesson read-aloud)", () => {
  assert.equal(speakTex("\\bar z = a - bi"), "konjugirano z je enako a minus b i");
  assert.equal(speakTex("\\operatorname{Re} z = a"), "realni del z je enako a");
  assert.equal(speakTex("\\operatorname{Im} z = b"), "imaginarni del z je enako b");
  assert.equal(speakTex("\\mathbb{N} \\subset \\mathbb{Z}"), "N je podmnožica Z");
  assert.equal(speakTex("x \\in \\mathbb{R}"), "x je element R");
  assert.equal(speakTex("\\bar x = 5"), "x s črto je enako 5");
  assert.equal(speakTex("\\mathrm{Re}\\,z = a"), "realni del z je enako a");
  assert.equal(speakTex("\\mathrm{Im}\\,z"), "imaginarni del z");
  assert.equal(speakTex("\\overline{z_1 + z_2}"), "konjugirana vrednost z 1 plus z 2");
  // \mathrm{Re} je v fiziki Reynoldsovo število: ne beremo ga kot realni del.
  assert.doesNotMatch(speakTex("\\mathrm{Re} = 2000"), /realni del/);
});

test("formulas are read aloud in Slovenian", () => {
  assert.equal(speakTex("I = \\dfrac{U}{R}"), "I je enako U deljeno z R");
  assert.equal(speakTex("t = \\frac{s}{t}"), "t je enako s deljeno s t");
  assert.equal(speakTex("v_0 = 5\\ \\mathrm{m/s}"), "v nič je enako 5 metrov na sekundo");
  assert.equal(speakTex("2{,}5\\ \\mathrm{s}"), "2,5 sekunde");
  assert.equal(speakTex("m = 3\\ \\mathrm{kg}"), "m je enako 3 kilogrami");
  assert.equal(speakTex("1\\ \\mathrm{h}"), "1 ura");
  assert.equal(speakTex("V = 2\\ \\mathrm{m^3}"), "V je enako 2 kubična metra");
  assert.equal(speakTex("20\\ ^{\\circ}\\mathrm{C}"), "20 stopinj Celzija");
  assert.equal(speakTex("x^2 + 3x - 4 = 0"), "x na kvadrat plus 3 x minus 4 je enako 0");
  assert.equal(speakTex("\\sqrt{16} = 4"), "koren iz 16 je enako 4");
  assert.equal(speakTex("I(U)"), "I od U");
  assert.equal(speakTex("V = \\dfrac{4}{3}\\pi r^3"), "V je enako štiri tretjine pi r na kub");
  assert.equal(speakTex("\\frac{1}{2}"), "ena polovica");
  assert.equal(speakTex("A_r(\\mathrm{C})"), "A r C");
  assert.equal(speakTex("5\\ \\mathrm{C}"), "5 kulonov");
  assert.equal(speakMarkdown("- **Ohmov zakon:** $U = R \\cdot I$"), "Ohmov zakon: U je enako R krat I.");
});

test("speech: HTML from lessons and comparison signs outside math are not mangled", () => {
  assert.equal(
    speakMarkdown("## Naslov\n> citat\nAbsolutni sklic (<code>&#36;F&#36;1</code>) ostane; while (b > 0) teče."),
    "Naslov.\ncitat.\nAbsolutni sklic ($F$1) ostane; while (b > 0) teče.",
  );
});

test("z/s before numbers and letters follows Slovenian spelling", () => {
  assert.deepEqual(["2", "3", "8", "10", "13", "25", "30", "80", "100", "200", "300", "1000"].map(zs), ["z", "s", "z", "z", "s", "s", "s", "z", "s", "z", "s", "s"]);
  assert.deepEqual(["R", "t", "k", "I", "pet", "dve"].map(zs), ["z", "s", "s", "z", "s", "z"]);
});

test("povzetek na eni strani bere stanje lekcije iz glave (stanje: …)", () => {
  // Prej je bral neobstoječe polje in opombo »še pregleduje učitelj« kazal tudi pri pregledanih lekcijah.
  assert.equal(summaryParts("MAT-SS-4/statistika").status, "preverjeno");
  assert.equal(summaryParts(OHM).status, "osnutek");
});

test("one-page summary: mind map from the lesson summary, mistakes and formulas", () => {
  const p = summaryParts(OHM);
  assert.ok(p.branches.length >= 3 && p.branches.length <= 8);
  assert.ok(p.branches.some((b) => b.label === "Ohmov zakon"));
  assert.ok(p.formulas.length >= 1);
  const html = summaryPage(OHM);
  assert.match(html, /Miselni vzorec/);
  assert.match(html, /Pazi na/);
  assert.match(html, /class="katex"/);
  assert.equal(summaryPage("FIZ-OS-9/ne-obstaja"), null);
  assert.deepEqual(branchOf("Enota $a:b$ in več"), { label: "", detail: "Enota $a:b$ in več" });
});

test("audio summary is plain spoken text", () => {
  const a = audioSummary(OHM);
  assert.equal(a.lang, "sl-SI");
  assert.match(a.parts[0], /^Povzetek: /);
  assert.ok(!a.text.includes("$") && !a.text.includes("\\"));
  assert.match(a.text, /I je enako U deljeno z R/);
});

test("worksheet: printable tasks, no tap-only figures, solutions with data and answer", () => {
  const tasks = worksheetTasks([OHM], 6, 42);
  assert.equal(tasks.length, 6);
  assert.ok(tasks.every((t) => !t.figure));
  assert.deepEqual(tasks.map((t) => t.level), [1, 1, 2, 2, 3, 3]);
  assert.deepEqual(worksheetTasks([OHM], 6, 42).map((t) => t.text), tasks.map((t) => t.text), "same code, same sheet");
  const html = worksheetPage({ topicIds: [OHM], perTopic: 6, seed: 42 });
  assert.match(html, /koda lista 42/);
  assert.match(html, /<h2>Rešitve<\/h2>/);
  assert.equal((html.match(/class="ans"/g) || []).length, 6);
  assert.match(html, /Podatki:/);
  assert.equal(answerHtml({ answer: { type: "number", value: 0.02810304, decimals: 3, unit: "A" } }), "0,028 A");
  assert.equal(answerHtml({ answer: { type: "choice", options: ["x", "y"], index: 1 } }), "b) y");
  assert.equal(answerHtml({ answer: { type: "coefficients", values: [2, 1, 2] } }), "2, 1, 2");
});

test("past papers link to RIC, not copied", () => {
  assert.match(officialPapers("NPZ9", "MAT").url, /^https:\/\/www\.ric\.si\/nacionalno-preverjanje-znanja\//);
  assert.equal(officialPapers("MATURA", "KEM").url, "https://www.ric.si/splosna-matura/predmeti/kemija/");
  assert.equal(officialPapers("JEE", "MAT"), null);
});

test("HTTP: list, audio, worksheet, weak topics", async () => {
  const store = openDb(":memory:");
  const app = createApp(store);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = store.createStudent("Ana");
    const get = (p) => fetch(base + p);
    let r = await get(`/api/students/${s.id}/gradiva?topic=${OHM}`);
    const list = await r.json();
    assert.deepEqual(list.items.map((x) => x.vrsta), ["povzetek", "zvok", "delovni-list"]);
    assert.ok(list.items.every((x) => !x.locked));
    assert.equal((await get(`/api/students/${s.id}/gradiva?topic=X/y`)).status, 404);
    assert.equal((await get(list.items[0].url)).status, 200);
    assert.equal((await get("/gradiva/povzetek/FIZ-OS-9/ne-obstaja")).status, 404);
    r = await get(`/api/students/${s.id}/gradiva/zvok?topic=${OHM}`);
    assert.ok((await r.json()).parts.length > 2);
    r = await get(`/api/students/${s.id}/gradiva/delovni-list?topic=${OHM}&seme=7&n=3`);
    assert.equal(r.status, 200);
    assert.match(await r.text(), /koda lista 7/);
    // n ni celo število: list ima toliko nalog, kot je celi del (ne eno več).
    r = await get(`/api/students/${s.id}/gradiva/delovni-list?topic=${OHM}&seme=7&n=3.7`);
    assert.match(await r.text(), / 3 naloge /);
    r = await get(`/api/students/${s.id}/gradiva/delovni-list?topic=${OHM}&n=abc&seme=-1`);
    assert.equal(r.status, 200);
    r = await get(`/api/students/${s.id}/gradiva/delovni-list?sibke=1`);
    assert.equal(r.status, 404);
    assert.equal((await r.json()).code, "gr.noWeak");
    // Tri napačne naloge iz Ohmovega zakona → šibka tema.
    const ins = store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, attempts, first_try_correct) VALUES (?, ?, 1, '{}', 1, 0)");
    for (let i = 0; i < 3; i++) ins.run(s.id, OHM);
    assert.deepEqual(weakTopicIds(store.db, s.id), [OHM]);
    r = await get(`/api/students/${s.id}/gradiva/sibke`);
    assert.deepEqual(await r.json(), { topics: [{ id: OHM, name: "Upor in Ohmov zakon" }], locked: false });
    r = await get(`/api/students/${s.id}/gradiva/delovni-list?sibke=1`);
    assert.match(await r.text(), /Vaja iz šibkih tem/);
    r = await get(`/api/students/${s.id}/exams?exam=NPZ9`);
    assert.match((await r.json()).official.url, /ric\.si/);
  } finally {
    server.close();
  }
});
