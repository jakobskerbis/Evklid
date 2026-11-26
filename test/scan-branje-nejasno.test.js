// P3-5 (načrt »Kakovost pred obsegom«): skener nejasnega znaka ne ugiba. Model ga zapiše kot [?] z možnostmi, strežnik
// oznake ohrani in reševanja z [?] ne dovoli, zaslon Skeniraj oznake pokaže in jih da popraviti, meritev šteje ugibanje.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import SL from "../public/i18n/sl.js";
import { NEJASNO, unclearCount, hasUnclear, cleanUnclear, fillUnclear, firstUnclear, markUnclear, normalizeUnclear, keepOptions } from "../public/scan/nejasno.js";
import { cleanProblems, READ_PROMPT } from "../server/scan.js";
import { oceniRacun } from "../scripts/sken-ocena.mjs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

test("nejasno.js: štetje, zapolnitev i-te oznake, označen HTML", () => {
  assert.equal(NEJASNO, "[?]");
  assert.equal(unclearCount("2*x^2-[?]*x-[?]=0"), 2);
  assert.equal(unclearCount("x+1=2"), 0);
  assert.equal(unclearCount(null), 0);
  assert.equal(hasUnclear("a=[?] cm"), true);
  assert.equal(hasUnclear("x^2 ? 4"), false, "samo vprašaj ni oznaka");
  assert.equal(fillUnclear("[?]x+[?]=[?]", 1, "7"), "[?]x+7=[?]");
  assert.equal(fillUnclear("[?]x+[?]=[?]", 0, "-"), "-x+[?]=[?]");
  assert.equal(fillUnclear("[?]x+[?]=[?]", 2, "1"), "[?]x+[?]=1");
  assert.equal(fillUnclear("[?]x", 1, "1"), "[?]x", "neobstoječa oznaka ne spremeni besedila");
  assert.equal(fillUnclear("[?]x", -1, "1"), "[?]x");
  assert.equal(firstUnclear("2x-[?]=0"), 3);
  assert.equal(firstUnclear("2x=0"), -1);
  assert.equal(markUnclear("x<[?]&1", esc), 'x&#60;<mark class="scan-unclear-mark">?</mark>&#38;1');
});

test("normalizeUnclear in keepOptions: \\boxed{?} v podatkih je oznaka; ročni popravek ohrani možnosti ostalih oznak", () => {
  assert.equal(normalizeUnclear("a = \\boxed{?}\\ \\mathrm{cm}"), "a = [?]\\ \\mathrm{cm}");
  assert.equal(normalizeUnclear("a = \x08oxed{ ? } cm"), "a = [?] cm", "backspace iz neubežanega JSON");
  assert.equal(normalizeUnclear("x-[ ?]=1"), "x-[?]=1");
  assert.equal(normalizeUnclear("\\boxed{x}"), "\\boxed{x}");
  const o = [["1"], ["2"], ["3"]];
  assert.deepEqual(keepOptions("[?]x+[?]=[?]", "[?]x+7=[?]", o), [["1"], ["3"]]);
  assert.deepEqual(keepOptions("[?]x+[?]=[?]", "5x+[?]=[?]", o), [["2"], ["3"]]);
  assert.deepEqual(keepOptions("[?]x+[?]=[?]", "[?]x+[?]=4", o), [["1"], ["2"]]);
  assert.deepEqual(keepOptions("[?]x+[?]=[?]", "[?]x+[?]=[?]", o), o);
  assert.equal(keepOptions("[?]x", "[?]x+[?]", [["1"]]), null, "nova oznaka: možnosti niso več poravnane");
  assert.equal(keepOptions("[?]x+[?]", "[?]x", [["1"]]), null, "napačna dolžina vhoda");
});

test("cleanUnclear: ena vrsta možnosti na oznako, največ 3, brez praznih, podvojenih, dolgih in [?]", () => {
  assert.deepEqual(cleanUnclear([["1", "7"]], 0), []);
  assert.deepEqual(cleanUnclear([["1", "7", "7", " ", "4", "9"]], 1), [["1", "7", "4"]]);
  assert.deepEqual(cleanUnclear([["x".repeat(13), "[?]", 3, " + "]], 1), [["+"]]);
  assert.deepEqual(cleanUnclear("1,7", 2), [[], []], "napačna oblika → prazne možnosti, oznake ostanejo");
  assert.deepEqual(cleanUnclear([["1"], ["2"], ["3"]], 2), [["1"], ["2"]], "odvečne vrste odpadejo");
});

test("READ_PROMPT: ne ugiba, nejasen znak je [?] z možnostmi; tudi v podatkih", () => {
  assert.match(READ_PROMPT, /Never guess/);
  assert.match(READ_PROMPT, /write \[\?\] in its place in "text" and \\\\boxed\{\?\} in "tex"/);
  assert.match(READ_PROMPT, /"unclear": one list per \[\?\]/);
  assert.match(READ_PROMPT, /An unclear value in "given" is written as \[\?\]/);
  assert.match(READ_PROMPT, /a clearly written character is never \[\?\]/);
  assert.match(READ_PROMPT, /nothing in the task itself settles it \(the student's working may only confirm a sign or a letter, never a digit\)/);
  assert.match(READ_PROMPT, /"tex", and/);
  assert.ok(READ_PROMPT.includes('\\\\boxed{?} in "tex"'), "v JSON ubežan \\boxed");
  assert.match(READ_PROMPT, /"unclear":\[\["\.\.\.","\.\.\."\]\]/);
});

test("cleanProblems: unclear se poravna na oznake v besedilu, brez oznak ga ni", () => {
  const out = cleanProblems([
    { text: "2*x^2-[?]*x-5=0", tex: "2x^2-\\boxed{?}x-5=0", unclear: [["3", "8"], ["9"]] },
    { text: "x+1=2", unclear: [["1", "7"]] },
    { text: "[?]x=[?]", unclear: [["2"]] },
    { text: "P=?", given: ["a = [?]\\ \\mathrm{cm}"] },
  ]);
  assert.deepEqual(out[0].unclear, [["3", "8"]]);
  assert.equal(out[0].tex, "2x^2-\\boxed{?}x-5=0");
  assert.equal("unclear" in out[1], false);
  assert.deepEqual(out[2].unclear, [["2"], []]);
  assert.deepEqual(out[3].given, ["a = [?]\\ \\mathrm{cm}"]);
  const b = cleanProblems([{ text: "x-\\boxed{?}=1", tex: "x-\x08oxed{?}=1", given: ["a = \\boxed{?}"], unclear: [["2"]] }])[0];
  assert.equal(b.text, "x-[?]=1");
  assert.equal(b.tex, "x-\\boxed{?}=1", "backspace v tex popravljen");
  assert.deepEqual(b.given, ["a = [?]"]);
  assert.deepEqual(b.unclear, [["2"]]);
  const c = cleanProblems([{ text: "P=?", sought: "\\text{ploščina lika [?]}" }])[0];
  assert.equal(c.sought, "\\text{ploščina lika ?}", "v iskanem ni oznake, ki je učenec ne more popraviti");
  assert.equal("unclear" in out[3], false, "P=? nima oznake v računu");
});

test("API: /scan/read vrne oznake in možnosti; /scan/solve zavrne [?] v nalogi ali podatkih brez klica AI", async () => {
  const store = openDb(":memory:");
  const calls = [];
  const app = createApp(store, {
    scanReadFn: async () => ({ problems: cleanProblems([{ text: "2*x-[?]=5", tex: "", unclear: [["1", "7"]] }]), usage: null, model: "m" }),
    scanSolveFn: async (a) => (calls.push(a), { solution: null, usage: [], model: "m" }),
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (p, body) => {
    const r = await fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return { status: r.status, body: await r.json() };
  };
  try {
    const s = (await req("/api/students", { name: "Ana", settings: { curriculum_level: "3. letnik" } })).body;
    const read = await req(`/api/students/${s.id}/scan/read`, { image: "data:image/jpeg;base64," + Buffer.from("x").toString("base64") });
    assert.equal(read.status, 200);
    assert.deepEqual(read.body.problems[0].unclear, [["1", "7"]]);
    let r = await req(`/api/students/${s.id}/scan/solve`, { text: "2*x-[?]=5" });
    assert.equal(r.status, 400);
    assert.equal(r.body.unclear, true);
    r = await req(`/api/students/${s.id}/scan/solve`, { text: "P=?", given: ["a = [?]\\ \\mathrm{cm}"] });
    assert.equal(r.status, 400);
    assert.equal(calls.length, 0, "AI ni bil poklican");
    r = await req(`/api/students/${s.id}/scan/solve`, { text: "2*x-7=5" });
    assert.notEqual(r.status, 400, "popravljena naloga gre naprej");
    assert.ok(calls.length >= 1);
  } finally {
    server.close();
  }
});

test("meritev: napačno branje brez oznake je ugibanje, označeno mesto ni", () => {
  const n = { racun: "2*x^2-3*x-5=0" };
  assert.deepEqual([oceniRacun(n, { text: "2x^2-3x-5=0" }).ugibano, oceniRacun(n, { text: "2x^2-3x-5=0" }).oznaceno], [false, 0]);
  assert.equal(oceniRacun(n, { text: "2x^2-8x-5=0" }).ugibano, true);
  let o = oceniRacun(n, { text: "2x^2-[?]x-5=0", unclear: [["3", "8"]] });
  assert.deepEqual([o.ugibano, o.oznaceno, o.ok], [false, 1, false], "označeno: ni ugibano, a tudi ni še pravilno prebrano");
  assert.equal(oceniRacun(n, { text: "0=2x^2-[?]x-5", unclear: [["8", "3"]] }).ugibano, false, "enakovredno z možnostjo");
  assert.equal(oceniRacun(n, { text: "2x^2-[?]x-6=0" }).ugibano, true, "napaka zunaj oznake");
  assert.equal(oceniRacun(n, { text: "2x^2-[?]-5=0" }).ugibano, false, "oznaka lahko pokrije več znakov");
  // ohlapna primerjava (vsa števila in operacije so nekje) ni dovolj za »ni ugibal«; velike črke štejejo
  for (const t of ["2*a^2-3*a-5=0", "2*X^2-3*X-5=0", "2*x^2-3/x-5=0", "2*x^2-3*x^2-5=0"]) assert.equal(oceniRacun(n, { text: t }).ugibano, true, t);
  assert.equal(oceniRacun(n, { text: "0=2x^2-3x-5" }).ugibano, false, "enakovreden zapis ni ugibanje");
  assert.equal(oceniRacun(n, { text: "2*x^2[?]=0" }).ugibano, true, "oznaka ne pokrije celega člena");
  o = oceniRacun(n, { text: "2x^2-[?]x-5=0", unclear: [["5", "8"]] });
  assert.deepEqual([o.ugibano, o.moznostiZgresene], [false, 1], "prave možnosti ni med gumbi");
  const c = { racun: "c=?", podatki: ["5", "12"] };
  assert.equal(oceniRacun(c, { text: "c=?", given: ["a=[?]", "b=13"] }).ugibano, true, "ena oznaka ne opraviči dveh manjkajočih podatkov");
  assert.equal(oceniRacun(c, { text: "c=?", given: ["a=[?]", "b=12"] }).ugibano, false);
  const w = { racun: "s=?", podatki: ["2.5", "8"] };
  assert.equal(oceniRacun(w, { text: "s=?", given: ["a = 2{,}5\\ \\mathrm{m/s^2}", "t = 3\\ \\mathrm{s}"] }).ugibano, true);
  assert.equal(oceniRacun(w, { text: "s=?", given: ["a = 2{,}5\\ \\mathrm{m/s^2}", "t = [?]\\ \\mathrm{s}"] }).ugibano, false);
});

test("zaslon Skeniraj: oznake se pokažejo, Reši je zaprt, dokler je [?]; besedila v živih jezikih", () => {
  const src = fs.readFileSync(new URL("../public/scan/scan.js", import.meta.url), "utf8");
  const go = src.slice(src.indexOf("const go = () => {"), src.indexOf("solveNow();", src.indexOf("const go = () => {")));
  assert.match(go, /if \(hasUnclear\(input\.value\) \|\| S\.given\.some\(hasUnclear\)\) \{\s*S\.text = input\.value;\s*S\.unclearNeed = true;[\s\S]*?return;/);
  assert.ok(go.indexOf("hasUnclear(input.value)") < go.indexOf("analyze(input.value)"), "oznaka se preveri pred reševanjem");
  assert.match(src, /S\.unclear = \(S\.problems\[0\]\.unclear \|\| \[\]\)/);
  assert.match(src, /S\.unclear = \(p\.unclear \|\| \[\]\)/);
  assert.match(src, /class="scan-unclear-host" aria-live="polite"/);
  assert.match(src, /S\.unclearNeed \? `<p class="scan-unclear-need">/, "sporočilo o [?] je v obvestilu o branju, ne rdeča napaka");
  assert.match(src, /keepOptions\(S\.text, input\.value, S\.unclear\)/);
  // j 26. 11.: polje kaže nalogo kot formulo, surov zapis le med urejanjem
  assert.match(src, /<div class="scan-input-izris" aria-hidden="true"><\/div>/);
  assert.match(src, /wrap\.classList\.toggle\("ima-izris", !!html\)/);
  const css = fs.readFileSync(new URL("../public/scan.css", import.meta.url), "utf8");
  assert.match(css, /\.scan-input-wrap\.ima-izris:focus-within \.scan-input-izris \{ display: none; \}/);
  assert.doesNotMatch(css, /:has\(\.scan-input-wrap/, "fokus ne sme premikati postavitve (izgubljeni kliki)");
  assert.match(src, /scrollWidth > fieldIzris\.clientWidth \+ 1/, "preširoka formula ostane surov zapis");
  assert.match(fs.readFileSync(new URL("../public/sirina.js", import.meta.url), "utf8"), /\.sc, \.scan-input-izris"\)\) return null;/);
  for (const k of ["scan.unclearTitle", "scan.unclear", "scan.unclearOne", "scan.unclearApply", "scan.unclearGivenOnly", "scan.unclearN", "scan.unclearErr", "scan.unclearGiven"]) {
    assert.ok(SL[k], k);
    for (const lang of ["en", "de", "hr", "it", "hu"]) {
      const ui = JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${lang}.json`, import.meta.url), "utf8"));
      assert.ok(ui[k], `${lang} ${k}`);
    }
  }
  assert.match(SL["scan.unclearN"], /\{n\}/);
});
