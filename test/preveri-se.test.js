// »Preveri se« z risbo v vprašanju, vpisom števila in razvrščanjem (public/preveri-se.js, server/textbook.js):
// razčlenjevanje, izris (aplikacija, tisk, besedilo za inštruktorja), preverjanje odgovorov, šibke točke,
// pravila check-lesson in stari odjemalci (nameščena aplikacija brez glave x-app-kviz dobi samo izbiro).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseNum, parseAnswerLine, checkNumber, orderOk, orderHits, shuffled, moveItem, placeItem } from "../public/preveri-se.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const OHM = "FIZ-OS-9/upor-in-ohmov-zakon";
const QUIZ = `## Preveri se
? Kolikšen je upor, če je $U = 6\\,\\mathrm{V}$ in $I = 2\\,\\mathrm{A}$?
- $12\\,\\Omega$
~ Napetost si pomnožil s tokom namesto delil.
+ $3\\,\\Omega$
- $0{,}33\\,\\Omega$
~ Tok si delil z napetostjo, obratno.
> Upor je napetost, deljena s tokom.

? Z grafa odčitaj tok pri napetosti 4 V.
:::risba graf
opis: Premica skozi izhodišče: tok narašča z napetostjo, pri napetosti 4 V je tok 2 A.
x: 0 .. 6
y: 0 .. 3
f: x/2
:::
Odgovor zapiši v amperih.
= 2,0 A | 0,1
~ 8 | Napetost si pomnožil z 2 namesto delil.
> Pri 4 V kaže graf tok 2 A.

? Razvrsti upore od najmanjšega do največjega.
1. $1\\,\\Omega$
2. $1\\,\\mathrm{k\\Omega}$
3. $1\\,\\mathrm{M\\Omega}$
4. $1\\,\\mathrm{G\\Omega}$
> Kilo je tisoč, mega milijon, giga milijarda.
`;
const orig = fs.readFileSync(path.join(here, "..", "content", "lessons", "FIZ-OS-9", "upor-in-ohmov-zakon.md"), "utf8");
const withQuiz = (quiz) => orig.replace(/^## Preveri se\n[\s\S]*?(?=^:::simboli|^<<RACUN|^## |(?![\s\S]))/m, `${quiz}\n`);
const SRC = withQuiz(QUIZ);

// Lekcije iz začasne mape (FIZ-OS-9 z novim kvizom), preden se naložijo moduli strežnika.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-kviz-"));
fs.cpSync(path.join(here, "..", "content", "lessons", "FIZ-OS-9"), path.join(tmp, "FIZ-OS-9"), { recursive: true });
fs.writeFileSync(path.join(tmp, "FIZ-OS-9", "upor-in-ohmov-zakon.md"), SRC);
process.env.EVKLID_LESSONS = tmp;
const { parseLesson, lessonView, loadLesson, checkPlain, legacyChecks } = await import("../server/textbook.js");
const { lessonHtml } = await import("../server/textbook-print.js");
const { checkLessonSource } = await import("../server/lesson-check.js");
const { openDb } = await import("../server/db.js");
const { createApp } = await import("../server/app.js");

test("number answers: comma or point, minus variants, unit ignored, default tolerance from the shown decimals", () => {
  assert.equal(parseNum("2,30"), 2.3);
  assert.equal(parseNum(" 2.3 "), 2.3);
  assert.equal(parseNum("−4,5"), -4.5);
  assert.equal(parseNum("–4.5 m/s"), -4.5);
  assert.equal(parseNum("1 000,5 g"), 1000.5);
  assert.equal(parseNum("1,5·10^-3 mol"), 0.0015);
  assert.equal(parseNum("2e3"), 2000);
  assert.equal(parseNum("pH = 2,30"), 2.3);
  assert.equal(parseNum(""), null);
  assert.equal(parseNum("abc"), null);
  // Več števil ali nedokončan zapis ni odgovor (prej »1/2« → 1, »2 5« → 2, »10^-3« → 10).
  for (const x of ["1/2", "2 5", "2,5,3", "10^-3", "2·10³"]) assert.equal(parseNum(x), null, x);

  const a = parseAnswerLine("2,30");
  assert.deepEqual([a.answer, a.value, a.unit], ["2,30", 2.3, ""]);
  assert.ok(Math.abs(a.tol - 0.005) < 1e-12, "brez tolerance: natančno na izpisane decimalke");
  const b = parseAnswerLine("2,5 m/s | 0,1");
  assert.deepEqual([b.answer, b.value, b.unit, b.tol], ["2,5", 2.5, "m/s", 0.1]);
  assert.equal(parseAnswerLine("-3 | 0").answer, "−3");
  assert.equal(parseAnswerLine("1,5·10^-3 mol/L").answer, "$1{,}5\\cdot 10^{-3}$", "potenca kot formula");
  assert.equal(parseAnswerLine("$2{,}5$"), null, "vrednost brez $");
  assert.equal(parseAnswerLine("dva"), null);
  assert.equal(parseAnswerLine("2 | -1"), null, "negativna toleranca");

  const c = { value: 2.3, tol: 0.005, wrong: [{ value: 5.3 }, { value: -2.3 }] };
  assert.deepEqual(checkNumber(c, "2,3"), { ok: true, wrong: -1 });
  assert.equal(checkNumber(c, "2.304").ok, true);
  assert.equal(checkNumber(c, "2,31").ok, false);
  assert.equal(checkNumber(c, "2,30 mol/L").ok, true, "enota se ne upošteva");
  assert.equal(checkNumber(c, "5,3").wrong, 0);
  assert.equal(checkNumber(c, "−2,30").wrong, 1, "tipična napačna vrednost z isto toleranco");
  assert.equal(checkNumber(c, "7").wrong, -1);
  assert.equal(checkNumber(c, "   ").empty, true);
});

test("ordering: shuffle is stable per question and never already solved; tap and arrows", () => {
  for (let n = 2; n <= 6; n++)
    for (const key of ["a", "b", "Razvrsti upore", "x\ny"]) {
      const s = shuffled(n, key);
      assert.deepEqual([...s].sort(), Array.from({ length: n }, (_, i) => i));
      assert.ok(!s.every((v, i) => v === i), `${n} ${key}: že urejeno`);
      assert.deepEqual(shuffled(n, key), s, "enako ob vsakem nalaganju");
    }
  const c = { items: ["a", "b", "c"] };
  assert.equal(orderOk(c, [0, 1, 2]), true);
  assert.equal(orderOk(c, [1, 0, 2]), false);
  assert.equal(orderHits([1, 0, 2]), 1);
  assert.deepEqual(moveItem([2, 0, 1], 0, 1), [0, 2, 1]);
  assert.deepEqual(moveItem([2, 0, 1], 0, -1), [2, 0, 1], "prvi ne gre više");
  // Dotik po vrsti: 0, nato 1, nato 2 → urejeno.
  let st = { order: [2, 0, 1], placed: 0 };
  for (const want of [0, 1, 2]) st = placeItem(st.order, st.placed, st.order.indexOf(want));
  assert.deepEqual(st, { order: [0, 1, 2], placed: 3 });
  assert.deepEqual(placeItem([0, 2, 1], 1, 0), { order: [0, 2, 1], placed: 1 }, "že postavljen ostane");
});

test("parse: choice keeps its old shape, number and ordering get a type, a figure stays a whole block", () => {
  const { checks } = parseLesson(SRC);
  assert.equal(checks.length, 3);
  const [mc, num, ord] = checks;
  assert.deepEqual(Object.keys(mc), ["q", "options", "correct", "why", "optionWhy"], "izbira brez polja type");
  assert.equal(mc.correct, 1);
  assert.equal(num.type, "stevilo");
  assert.deepEqual([num.answer, num.value, num.tol, num.unit], ["2,0", 2, 0.1, "A"]);
  assert.deepEqual(num.wrong, [{ answer: "8", value: 8, why: "Napetost si pomnožil z 2 namesto delil." }]);
  assert.match(num.q, /^Z grafa odčitaj tok pri napetosti 4 V\.\n\n:::risba graf\nopis: .*\nx: 0 \.\. 6\ny: 0 \.\. 3\nf: x\/2\n:::\n\nOdgovor zapiši v amperih\.$/);
  assert.equal(ord.type, "razvrsti");
  assert.equal(ord.q, "Razvrsti upore od najmanjšega do največjega.");
  assert.equal(ord.items.length, 4);
  assert.equal(ord.items[0], "$1\\,\\Omega$");
  assert.deepEqual(parseLesson(SRC).checks[2].shown, ord.shown, "isti premešani vrstni red ob ponovnem branju");
  // Vprašanje brez odgovora ali z eno možnostjo se ne pokaže (kot prej).
  assert.equal(parseLesson("## Preveri se\n? Samo vprašanje\n? Ena\n+ a\n").checks.length, 0);
});

test("render: app (figure as SVG), print and PDF key, plain text for the tutor", () => {
  const v = lessonView(OHM);
  const [mc, num, ord] = v.lesson.checks;
  assert.equal(mc.q, loadLesson(OHM).checks[0].q, "izbira brez risbe nespremenjena");
  assert.match(num.q, /<figure class="risba"><svg class="rs"[^>]*aria-label="Premica skozi izhodišče/);
  assert.ok(!num.q.includes(":::"), "risba izrisana, ne surov blok");
  assert.match(num.q, /Odgovor zapiši v amperih\.$/);
  assert.equal(ord.shown.length, 4);

  const t = { id: OHM, name: "Ohmov zakon", unit: "Elektrika", goals: "" };
  const html = lessonHtml(t, loadLesson(OHM), 1);
  assert.match(html, /<svg class="rs"/, "risba v tisku");
  assert.ok(!html.includes(":::risba"));
  assert.match(html, /Odgovor: ____________ A/);
  assert.match(html, /<b>2,0 A<\/b>/, "rešitev: vrednost z enoto");
  assert.match(html, /Če dobiš 8 A:/, "tipična napačna vrednost z razlago");
  const letters = ord.items.map((_, i) => `${"abcdefgh"[ord.shown.indexOf(i)]})`).join(" → ");
  assert.ok(html.includes(`<b>${letters}</b>`), `rešitev razvrščanja: ${letters}`);
  assert.ok(html.includes("<b>b)</b>"), "izbira kot prej");

  const plain = checkPlain(loadLesson(OHM).checks[1]);
  assert.match(plain, /\[Slika: Premica skozi izhodišče: tok narašča z napetostjo, pri napetosti 4 V je tok 2 A\.\]/);
  assert.match(plain, /Odgovor \(število\): 2,0 A/);
  assert.match(checkPlain(loadLesson(OHM).checks[2]), /Pravilni vrstni red: \$1\\,\\Omega\$ → /);
  assert.match(checkPlain(loadLesson(OHM).checks[0]), /Pravilno: b\)/);
});

test("old clients: number and ordering become multiple choice (or are left out), indices map back", () => {
  const checks = loadLesson(OHM).checks;
  const legacy = legacyChecks(checks);
  assert.deepEqual(legacy.map((x) => x.src), [0, 1, 2]);
  assert.equal(legacy[0].c, checks[0], "izbira ista");
  const num = legacy[1].c;
  assert.deepEqual([...num.options].sort(), ["2,0 A", "8 A"]);
  assert.equal(num.options[num.correct], "2,0 A");
  assert.equal(num.optionWhy[num.options.indexOf("8 A")], "Napetost si pomnožil z 2 namesto delil.");
  const ord = legacy[2].c;
  assert.ok(ord.options.length >= 3 && new Set(ord.options).size === ord.options.length);
  assert.equal(ord.options[ord.correct], checks[2].items.join(" → "));
  for (const c of legacy.map((x) => x.c)) assert.deepEqual(Object.keys(c), ["q", "options", "correct", "why", "optionWhy"]);
  // Število brez tipične napačne vrednosti ni mogoče spremeniti v izbiro: izpustimo ga, indeksi ostanejo pravilni.
  const only = legacyChecks([{ type: "stevilo", q: "x", answer: "1", value: 1, tol: 0.5, unit: "", wrong: [], why: "" }, checks[0]]);
  assert.deepEqual(only.map((x) => x.src), [1]);
});

test("check-lesson: rules per question type", () => {
  const quizErrors = (src) => checkLessonSource(src, OHM).errors.filter((e) => /vprašanj|Preveri se|risba/.test(e));
  assert.deepEqual(quizErrors(SRC), [], "veljaven kviz z vsemi tremi vrstami in risbo");
  const bad = (from, to) => quizErrors(withQuiz(QUIZ.replace(from, to))).join("\n");
  assert.match(bad("= 2,0 A | 0,1", "= 2,0 A | 0,1\n= 2"), /natanko ena vrstica »= vrednost/);
  assert.match(bad("= 2,0 A | 0,1", "= dva A"), /ni število/);
  assert.match(bad("~ 8 | Napetost si pomnožil z 2 namesto delil.", "~ 8"), /nima razlage/);
  assert.match(bad("~ 8 | Napetost", "~ 2,05 | Napetost"), /znotraj tolerance/);
  assert.match(bad("4. $1\\,\\mathrm{G\\Omega}$\n", "4. $1\\,\\mathrm{G\\Omega}$\n5. a\n6. b\n7. c\n"), /3 do 6 elementov \(zdaj 7\)/);
  assert.match(bad("3. $1\\,\\mathrm{M\\Omega}$\n4. $1\\,\\mathrm{G\\Omega}$\n", ""), /3 do 6 elementov \(zdaj 2\)/);
  assert.match(bad("3. $1\\,\\mathrm{M", "5. $1\\,\\mathrm{M"), /oštevilčeni po vrsti/);
  assert.match(bad("4. $1\\,\\mathrm{G\\Omega}$", "4. $1\\,\\mathrm{M\\Omega}$"), /se ponavljajo/);
  assert.match(bad("= 2,0 A | 0,1", "= 2,0 A | 0,1\n+ 2 A"), /mešane vrste/);
  assert.equal(bad("f: x/2\n:::\nOdgovor zapiši v amperih.\n= 2,0 A | 0,1", "f: x/2\n:::\n= 2,0 A | 0,1"), "", "risba tik pred odgovorom");
  const late = quizErrors(withQuiz(QUIZ.replace("= 2,0 A | 0,1\n", "").replace("Odgovor zapiši v amperih.", "Odgovor zapiši v amperih.\n= 2,0 A | 0,1\n:::risba premica\nopis: Številska premica od 0 do 4 z oznako pri 2.\nod: 0\ndo: 4\n:::")));
  assert.ok(late.some((e) => /pred prvim odgovorom/.test(e)), late.join("\n"));
  // Izbira: stara pravila veljajo samo zanjo.
  assert.match(bad("- $0{,}33\\,\\Omega$\n~ Tok si delil z napetostjo, obratno.\n", ""), /vsaj 3 možnosti \(zdaj 2\)/);
  assert.ok(!checkLessonSource(SRC, OHM).warnings.some((w) => /nima razlage »~/.test(w)), "~ pri številu ni opozorilo izbire");
  // Napaka v risbi vprašanja je napaka lekcije.
  assert.ok(checkLessonSource(withQuiz(QUIZ.replace("f: x/2", "f: x/2\ntočka: 9; 9 | zunaj")), OHM).errors.some((e) => /risba/.test(e)));
});

test("API: full quiz for the web and new app, multiple choice only for old app builds; answers feed weak points", async () => {
  const store = openDb(":memory:");
  const server = createApp(store, {}).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const OLD = { "x-app-client": "android/1.4.0" };
  const NEW = { "x-app-client": "android/1.5.0", "x-app-kviz": "2" };
  const call = async (p, body, headers = {}) => {
    const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json", ...headers }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, body: await res.json(), vary: res.headers.get("vary") || "" };
  };
  try {
    const s = (await call("/api/students", { name: "Bor", settings: { subject: "FIZ", curriculum_level: "9. razred" } })).body;
    const url = `/api/students/${s.id}/lesson?id=${OHM}`;
    const web = await call(url);
    assert.deepEqual(web.body.lesson.checks.map((c) => c.type || "izbira"), ["izbira", "stevilo", "razvrsti"]);
    assert.match(web.vary, /x-app-kviz/i);
    assert.deepEqual((await call(url, null, NEW)).body.lesson.checks.map((c) => c.type || "izbira"), ["izbira", "stevilo", "razvrsti"]);
    const old = (await call(url, null, OLD)).body.lesson.checks;
    assert.equal(old.length, 3);
    for (const c of old) {
      assert.equal(c.type, undefined, "stara aplikacija ne dobi novih vrst");
      assert.ok(Array.isArray(c.options) && c.options.length >= 2 && c.correct >= 0 && c.correct < c.options.length);
    }
    assert.match(old[1].q, /<figure class="risba">/, "risba tudi za staro aplikacijo (izrisana na strežniku)");
    assert.equal(web.body.lesson.checks[0].q, old[0].q);
    // Javna kopija za branje brez povezave: enako pravilo.
    assert.equal((await call(`/api/lesson?id=${OHM}`, null, OLD)).body.lesson.checks[2].type, undefined);
    assert.equal((await call(`/api/lesson?id=${OHM}`)).body.lesson.checks[2].type, "razvrsti");

    const check = (body, headers) => call(`/api/students/${s.id}/lesson-check`, { topic: OHM, ...body }, headers);
    const rows = () => ({ ...store.db.prepare("SELECT SUM(n) AS n, SUM(wrong) AS wrong FROM skill_results WHERE source = 'lesson'").get() });
    // Neveljavni odgovori: 400, nič zapisano.
    assert.equal((await check({ q: 1, v: "" })).status, 400);
    assert.equal((await check({ q: 1, v: "abc" })).status, 400);
    assert.equal((await check({ q: 1, o: 0 })).status, 400, "število brez vnosa");
    assert.equal((await check({ q: 2, order: [0, 1, 2] })).status, 400);
    assert.equal((await check({ q: 2, order: [0, 0, 1, 2] })).status, 400);
    assert.equal((await check({ q: 2, order: "0123" })).status, 400);
    assert.equal((await check({ q: 0, o: 9 })).status, 400);
    assert.equal(rows().n, null);
    // Število: »2.0 A« s piko in enoto je pravilno; prvi odgovor na dan šteje.
    assert.deepEqual((await check({ q: 1, v: "2.0 A" })).body, { counted: true });
    assert.deepEqual((await check({ q: 1, v: "8" })).body, { counted: false });
    assert.deepEqual(rows(), { n: 1, wrong: 0 });
    // Razvrsti: napačen vrstni red je napaka.
    assert.deepEqual((await check({ q: 2, order: [1, 0, 2, 3] })).body, { counted: true });
    assert.deepEqual(rows(), { n: 2, wrong: 1 });
    // Izbira kot prej.
    assert.deepEqual((await check({ q: 0, o: 1 })).body, { counted: true });
    assert.deepEqual(rows(), { n: 3, wrong: 1 });
    // Stara aplikacija: q in o po njenem seznamu (samo izbira); isto vprašanje lekcije šteje enkrat na dan.
    assert.deepEqual((await check({ q: 2, o: old[2].correct }, OLD)).body, { counted: false });
  } finally {
    server.close();
  }
});

test("API: an old app's answer to a converted question is checked against its own options", async () => {
  const store = openDb(":memory:");
  const server = createApp(store, {}).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const OLD = { "x-app-client": "ios/1.4.0" };
  const call = async (p, body, headers = {}) => {
    const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json", ...headers }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  try {
    const s = (await call("/api/students", { name: "Ana", settings: { subject: "FIZ", curriculum_level: "9. razred" } })).body;
    const old = (await call(`/api/students/${s.id}/lesson?id=${OHM}`, null, OLD)).body.lesson.checks;
    const rows = () => ({ ...store.db.prepare("SELECT SUM(n) AS n, SUM(wrong) AS wrong FROM skill_results WHERE source = 'lesson'").get() });
    assert.equal((await call(`/api/students/${s.id}/lesson-check`, { topic: OHM, q: 1, o: old[1].options.length }, OLD)).status, 400);
    assert.deepEqual((await call(`/api/students/${s.id}/lesson-check`, { topic: OHM, q: 1, o: old[1].correct }, OLD)).body, { counted: true });
    assert.deepEqual(rows(), { n: 1, wrong: 0 });
    assert.deepEqual((await call(`/api/students/${s.id}/lesson-check`, { topic: OHM, q: 2, o: (old[2].correct + 1) % old[2].options.length }, OLD)).body, { counted: true });
    assert.deepEqual(rows(), { n: 2, wrong: 1 });
  } finally {
    server.close();
  }
});
