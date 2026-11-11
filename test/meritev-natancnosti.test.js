// Meritev natančnosti celega odgovora (scripts/meritev-natancnosti.js, j 2026-11-10): pot skozi pravi klepet z
// vstavljenim modelom in izmišljenim ocenjevalcem (brez API), nadaljevanje po prekinitvi, meja stroška, oblika zapisa.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runChecked, summarize, neutralize, measurementError, latestMeasurement, writeMeasurement, loadProgress, GRADER_FINAL_RULE, MIN_PRIMERI, DOC_START, DOC_END } from "../scripts/meritev-natancnosti.js";
import { DEFAULT_SETTINGS } from "../server/settings.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const tmp = () => mkdtempSync(path.join(tmpdir(), "evklid-meritev-"));
const TOPIC = "FIZ-OS-9/upor-in-ohmov-zakon";
const TOPIC2 = "FIZ-OS-9/elektricni-tok-in-napetost";
const usage = { input_tokens: 1000, output_tokens: 1000 };

test("runChecked: pravi klepet v obeh pogojih, popravek samo s preverjanjem, ocenjevalec ne vidi oznake, nadaljevanje brez ponovnega plačila", async () => {
  const calls = { answers: 0, fixes: 0 };
  // Vstavljeni model: odgovor z napačnim računom; popravek, ko ga zahteva sprotno preverjanje (server/live-check.js).
  const streamFn = async ({ system, onText }) => {
    const fix = String(system).startsWith("You fix one mistake");
    const text = fix ? "Popravek: pravilno je $12 \\cdot 3 + 4 = 40$." : "Najprej izračunamo: $12 \\cdot 3 + 4 = 41$. To je vmesni rezultat naloge, s katerim nadaljujemo v naslednjem koraku rešitve.";
    fix ? calls.fixes++ : calls.answers++;
    onText?.(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", usage, model: "claude-haiku-5-5" };
  };
  const graded = [];
  const grade = async (t, answer) => {
    graded.push(answer);
    return { ocena: /= 40/.test(answer) ? "pravilno" : "napaka", vrsta: /= 40/.test(answer) ? "ni" : "racun_vmes", rezultat_podan: true, razlog: "izmišljen ocenjevalec", usd: 0.01 };
  };
  const tasks = [
    { id: TOPIC, path: "FIZ-OS-9", title: "P1", task: "Koliko je vmesni rezultat?", solution: "**Rešitev:**\n1. Odgovor: $40$." },
    { id: TOPIC2, path: "FIZ-OS-9", title: "P2", task: "Koliko je vmesni rezultat pri drugi nalogi?", solution: "**Rešitev:**\n1. Odgovor: $40$." },
  ];
  const progressFile = path.join(tmp(), "napredek.json");
  const ctx = { tasks, settingsFor: () => ({ ...DEFAULT_SETTINGS }), question: (x) => `Kako rešim to nalogo?\n\n${x}`, grade, group: () => "osnovna šola", maxUsd: 5, worstPair: 0.5, progressFile, createOpts: { streamFn }, log: () => {} };

  // Prekinitev po prvem primeru: meja dovoli en par (0,5 $ rezerve), drugi se ne začne.
  const first = await runChecked({ ...ctx, tasks: tasks.slice(0, 1) });
  assert.deepEqual(first.rows.map((r) => [r.pogoj, r.ocena, r.popravek]), [["brez", "napaka", false], ["s", "pravilno", true]]);
  assert.deepEqual([calls.answers, calls.fixes], [2, 1]);
  // Učenec vidi blok »> **Popravek:**«; ocenjevalec dobi isto besedilo brez oznake in brez citata.
  const withFix = first.rows[1].answer;
  assert.match(withFix, /\n\n> \*\*Popravek:\*\* pravilno je/);
  assert.ok(!graded.some((a) => /Popravek|^> /m.test(a)), "oznaka popravka ne pride do ocenjevalca");
  assert.ok(graded[1].endsWith("pravilno je $12 \\cdot 3 + 4 = 40$."));
  assert.equal(first.rows[0].koda, false); // 40 iz lekcije ni v odgovoru brez popravka
  assert.equal(first.rows[1].koda, true);
  assert.ok(first.rows.every((r) => r.usd > 0 && r.grade_usd === 0.01 && r.model === "claude-haiku-5-5"));
  assert.equal(loadProgress(progressFile).length, 2);

  // Isti ukaz z vsemi primeri: prvi primer se ne pošlje in ne oceni znova, doda se samo drugi.
  const second = await runChecked(ctx);
  assert.equal(second.resumed, 2);
  assert.equal(second.rows.length, 4);
  assert.deepEqual([calls.answers, calls.fixes, graded.length], [4, 2, 4]);
  assert.ok(Math.abs(second.gradeUsd - 0.04) < 1e-9 && second.appUsd > first.appUsd);
  // Tretjič ni več dela: nič klicev.
  const third = await runChecked(ctx);
  assert.deepEqual([calls.answers, graded.length, third.rows.length, third.stopped], [4, 4, 4, false]);
  // Meja stroška velja za ves strošek, tudi že shranjenega: pod rezervo za par se nov primer ne začne.
  const fresh = path.join(tmp(), "napredek.json");
  const capped = await runChecked({ ...ctx, progressFile: fresh, maxUsd: 0.4 });
  assert.deepEqual([capped.stopped, capped.rows.length, calls.answers], [true, 0, 4]);
  assert.ok(!existsSync(fresh));
  await assert.rejects(() => runChecked({ ...ctx, maxUsd: NaN }), /neveljavna meja/);
  await assert.rejects(() => runChecked({ ...ctx, maxUsd: 0 }), /neveljavna meja/);

  // Povzetek: pari in delež podanih rezultatov; pod 40 primeri ni za objavo.
  const sum = summarize(second.rows, { datum: "2026-12-01", ocenjevalec: "x", vprasanje: "q", meja_pregledov: "brez", strosek_usd: { aplikacija: 0, ocenjevalec: 0, skupaj: 0 }, trajanje_min: 1 });
  assert.deepEqual(sum.pari, { bolje: 2, slabse: 0, napaka_v_obeh: 0, brez_napake_v_obeh: 0 });
  assert.deepEqual(sum.vrstice.map((r) => [r.napake, r.primeri, r.rezultat_podan_pct, r.popravki]), [[2, 2, 100, 0], [0, 2, 100, 2]]);
  assert.equal(sum.meja_pregledov, "brez");
  assert.ok(sum.opombe.some((o) => /šum/.test(o)) && sum.opombe.some((o) => /BREZ dnevne meje/.test(o)));
  assert.equal(MIN_PRIMERI, 40);
  assert.match(measurementError(sum), /manj kot 40/);
  assert.match(GRADER_FINAL_RULE, /končno stanje odgovora po popravku/);
  assert.ok(readFileSync(path.join(root, "scripts/primerjava-modelov.js"), "utf8").includes("${GRADER_FINAL_RULE}"));
});

test("neutralize: odstrani samo končni blok popravka", () => {
  assert.equal(neutralize("Razlaga.\n\n> **Popravek:** prav je 40.\n> Druga vrstica."), "Razlaga.\n\nprav je 40.\nDruga vrstica.");
  assert.equal(neutralize("Razlaga.\n\n> **Correction:** it is 40."), "Razlaga.\n\nit is 40.");
  assert.equal(neutralize("Razlaga.\n\n> **Namig:** poskusi.\n\nŠe besedilo."), "Razlaga.\n\n> **Namig:** poskusi.\n\nŠe besedilo.");
  assert.equal(neutralize("Brez popravka."), "Brez popravka.");
});

test("oblika meritve: pokvarjena datoteka → null, --iz-json zavrne napačno obliko in premajhen vzorec", () => {
  const ok = JSON.parse(readFileSync(path.join(root, "docs/meritve/natancnost-2026-11-04.json"), "utf8"));
  assert.equal(measurementError(ok), null);
  for (const bad of [null, [], {}, { ...ok, datum: "4. 11. 2026" }, { ...ok, vrsta: "x" }, { ...ok, primeri: 0 }, { ...ok, vrstice: [] }, { ...ok, vrstice: [{ ime: "A", primeri: 5 }] }, { ...ok, vrstice: [{ ime: "A", primeri: 5, napake: 6 }] }, { ...ok, vrstice: [{ ime: "A", primeri: 5, napake_pct: 120 }] }, { ...ok, vrstice: "x" }]) {
    assert.ok(measurementError(bad), JSON.stringify(bad)?.slice(0, 60));
  }
  const warn = console.warn;
  console.warn = () => {};
  try {
    const dir = tmp();
    assert.equal(latestMeasurement(dir), null); // prazna mapa
    assert.equal(latestMeasurement(path.join(dir, "ni")), null);
    writeFileSync(path.join(dir, "natancnost-2026-11-04.json"), JSON.stringify(ok));
    assert.equal(latestMeasurement(dir).primeri, 50);
    writeFileSync(path.join(dir, "natancnost-2026-12-01.json"), "{ pokvarjeno");
    assert.equal(latestMeasurement(dir), null);
    writeFileSync(path.join(dir, "natancnost-2026-12-01.json"), JSON.stringify({ ...ok, vrstice: [{ ime: "A" }] }));
    assert.equal(latestMeasurement(dir), null);
    // writeMeasurement ne zapiše napačne oblike.
    const doc = path.join(dir, "doc.md");
    writeFileSync(doc, `a\n${DOC_START}\n${DOC_END}\nb`);
    assert.throws(() => writeMeasurement({ ...ok, datum: "2026-12-02", vrsta: "aplikacija" }, { dir, doc }), /ni v pravi obliki/);
    assert.ok(!existsSync(path.join(dir, "natancnost-2026-12-02.json")) && readFileSync(doc, "utf8") === `a\n${DOC_START}\n${DOC_END}\nb`);
  } finally {
    console.warn = warn;
  }

  const run = (args, env = {}) =>
    spawnSync(process.execPath, ["--disable-warning=ExperimentalWarning", "scripts/primerjava-modelov.js", ...args], {
      cwd: root,
      env: { PATH: process.env.PATH, HOME: process.env.HOME, ANTHROPIC_API_KEY: "", ANTHROPIC_BASE_URL: "http://127.0.0.1:9", ...env },
      encoding: "utf8",
      timeout: 60000,
    });
  const before = readdirSync(path.join(root, "docs/meritve")).join();
  const docBefore = readFileSync(path.join(root, "docs/stroski-ai.md"), "utf8");
  const dir = tmp();
  const small = path.join(dir, "majhna.json");
  const row = (kljuc, napake) => ({ kljuc, ime: kljuc, primeri: 30, napake });
  writeFileSync(small, JSON.stringify({ shema: 1, datum: "2026-12-01", vrsta: "aplikacija", primeri: 30, meja_pregledov: "brez", vrstice: [row("brez", 3), row("s", 1)] }));
  writeFileSync(path.join(dir, "pokvarjena.json"), "{");
  for (const f of ["majhna.json", "pokvarjena.json"]) {
    const r = run(["--iz-json", path.join(dir, f)]);
    assert.equal(r.status, 1, f);
    assert.match(r.stderr, /--iz-json:/);
  }
  // Neveljavna meja stroška: napaka pred klici, tudi s ključem.
  for (const bad of [["--max-usd", "5,5"], ["--max-usd", "0"], ["--max-usd", "-3"], ["--max-usd", "abc"], ["--max-usd"]]) {
    const r = run(["--s-preverjanjem", ...bad], { ANTHROPIC_API_KEY: "sk-ant-test" });
    assert.equal(r.status, 1, bad.join(" "));
    assert.match(r.stderr, /Neveljavna meja --max-usd/);
    assert.ok(!/\[\d+\/\d+\]/.test(r.stdout));
  }
  assert.equal(readdirSync(path.join(root, "docs/meritve")).join(), before);
  assert.equal(readFileSync(path.join(root, "docs/stroski-ai.md"), "utf8"), docBefore);
  // Zagon s ključem ne piše v docs/: v skripti writeMeasurement kliče samo --iz-json.
  const src = readFileSync(path.join(root, "scripts/primerjava-modelov.js"), "utf8");
  assert.equal(src.match(/writeMeasurement\(/g).length, 1);
  assert.ok(src.indexOf("writeMeasurement(") < src.indexOf("if (CHECK && MOCK && !DRY)"));
});
