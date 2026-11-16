// Naštevanje števil z decimalno vejico se loči s podpičjem (j, 6. 11. 2026; server/nastevanje.js).
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { popraviNastevanja, najdiNastevanja } from "../server/nastevanje.js";
import { systemBlocks, buildSystemPrompt } from "../server/prompt.js";
import { normalizeSettings } from "../server/settings.js";
import { checkLessonSource } from "../server/lesson-check.js";
import { GENERATORS, generateTask, plainCommas } from "../server/practice/index.js";

test("tutor prompt: rule about semicolons in lists with decimals is in the cached part", () => {
  const [stat] = systemBlocks(buildSystemPrompt({ settings: normalizeSettings({ subject: "MAT" }) }));
  assert.match(stat.text, /V slovenščini: če je med naštetimi števili vsaj eno decimalno, jih loči s podpičjem/);
  assert.match(stat.text, /točka \$\(1\{,\}5; 2\)\$/, "point written like in lessons, without an extra \\ space");
  assert.match(stat.text, /\$1\{,\}5\$; \$2\$ ali \$2\{,\}99\$/);
  assert.deepEqual(najdiNastevanja(stat.text), [], "the prompt itself follows the rule");
});

test("separate formulas, one formula, points and intervals get semicolons", () => {
  const cases = [
    ["$\\xi$ je lahko $1{,}5$, $2$ ali $2{,}99$.", "$\\xi$ je lahko $1{,}5$; $2$ ali $2{,}99$."],
    ["Časi $12{,}4$, $12{,}7$, $12{,}5$ in $12{,}3\\,\\mathrm{s}$.", "Časi $12{,}4$; $12{,}7$; $12{,}5$ in $12{,}3\\,\\mathrm{s}$."],
    ["Števila $7$, $-3$, $0{,}5$, $\\sqrt{9}$.", "Števila $7$; $-3$; $0{,}5$; $\\sqrt{9}$."],
    ["Točka $T(3, 7{,}5)$ in $S(0{,}030\\,\\mathrm{m}, 0)$.", "Točka $T(3; 7{,}5)$ in $S(0{,}030\\,\\mathrm{m}; 0)$."],
    ["Interval $[0{,}5, 2)$.", "Interval $[0{,}5; 2)$."],
    ["Vsote $12, 6, 9, 7{,}5, \\dots$", "Vsote $12; 6; 9; 7{,}5; \\dots$"],
    ["Členi ($11{,}6$, $10{,}8$, …).", "Členi ($11{,}6$; $10{,}8$; …)."],
    ["pufri pH 4,01, 7,00 in 10,01", "pufri pH 4,01; 7,00 in 10,01"],
    ["v 0,5, 1 in 2 mol/L", "v 0,5; 1 in 2 mol/L"],
  ];
  for (const [a, b] of cases) assert.equal(popraviNastevanja(a), b);
  assert.equal(popraviNastevanja(popraviNastevanja(cases[0][0])), cases[0][1], "idempotent");
});

test("lists without decimals, chemistry names, vectors, code and function arguments stay as they are", () => {
  for (const s of [
    "Točka $(2, 3)$, interval $[0, 1)$, števila $1$, $2$ in $3$.",
    "propan-1,2,3-triol in 2,2,4-trimetilpentan",
    "$e_1 = (1,0,0)$, $\\langle (0,1,-2), v_1 \\rangle$",
    "$f(x, 0{,}5)$ in $x_{1,2} = 0{,}5$",
    "```\n1,5, 2\n```",
    "pri $36\\,°\\mathrm{C}$, 2,2-dimetilpropan pri $10\\,°\\mathrm{C}$",
    "$a = 0{,}5$ je večje od $b$, ki je $2$.",
  ]) assert.equal(popraviNastevanja(s), s, s);
});

test("check-lesson reports a list of decimals separated by commas as an error", () => {
  const r = checkLessonSource("---\nstanje: osnutek\n---\n## Razlaga\nMeritve $1{,}5$, $2$ in $2{,}5$.\n");
  assert.ok(r.errors.some((e) => /podpičjem/.test(e) && /\$1\{,\}5\$; \$2\$/.test(e)), r.errors.join("\n"));
});

test("generated tasks: Slovenian lists with decimals use semicolons", () => {
  for (const g of GENERATORS.filter((x) => ["vrz-koordinate", "dod-mat-ss34-polinomi", "dod-os-merske-napake"].includes(x.id))) {
    let n = 0;
    for (let seed = 1; seed <= 60 && n < 5; seed++) {
      const t = generateTask(g.topics[0], 2, seed);
      if (t.generator !== g.id) continue;
      n++;
      for (const s of [t.text, t.hint, ...[].concat(t.solution || [])]) assert.deepEqual(najdiNastevanja(s || ""), [], `${g.id}: ${s}`);
    }
    assert.ok(n > 0, g.id);
  }
});

test("Slovenian content (lessons, materials, formula sheets, exam papers) has no comma-separated decimal lists", () => {
  const out = execFileSync(process.execPath, ["scripts/nastevanje.js"], { encoding: "utf8" });
  assert.match(out, /^0 mest\./m);
});

test("scoring guides: once one point separator becomes a semicolon, all top-level ones do", () => {
  assert.equal(
    popraviNastevanja("1 t. za $a = 2$, 1 t. za $0{,}5$, 1 t. za kot $3$."),
    "1 t. za $a = 2$; 1 t. za $0{,}5$; 1 t. za kot $3$.",
  );
  // Ločila v oklepaju ostanejo, točkovnik brez decimalnega naštevanja se ne spremeni.
  assert.equal(
    popraviNastevanja("2 t. za ničli ($x_1 = -1$, $x_2 = 3$; 1 t. za postopek, 1 t. za obe), 1 t. za $0{,}5$, 1 t. za graf."),
    "2 t. za ničli ($x_1 = -1$, $x_2 = 3$; 1 t. za postopek, 1 t. za obe); 1 t. za $0{,}5$; 1 t. za graf.",
  );
  for (const s of ["1 t. za $a$, 1 t. za $b$.", "1 t. za $0{,}5$ in pravilno enoto, 1 t. za graf."]) assert.equal(popraviNastevanja(s), s, s);
});

test("task texts: Slovenian lists get semicolons, bilingual (en/hi) generators keep their text", () => {
  const t = { text: "pufri pH $4{,}01$, $7{,}00$ in $10{,}01$", hint: "Values 1,500, 2 and 3", solution: ["$(0{,}5, 2)$"], answer: { mistakes: [{ why: "0,5, 1 in 2" }] } };
  const sl = plainCommas(t);
  assert.equal(sl.text, "pufri pH $4{,}01$; $7{,}00$ in $10{,}01$");
  assert.deepEqual(sl.solution, ["$(0{,}5; 2)$"]);
  assert.equal(sl.answer.mistakes[0].why, "0,5; 1 in 2");
  const en = plainCommas(t, false);
  assert.equal(en.text, t.text);
  assert.equal(en.hint, "Values 1,500, 2 and 3");
  assert.deepEqual(en.solution, t.solution);
  assert.equal(en.answer.mistakes[0].why, "0,5, 1 in 2");
  for (const g of GENERATORS.filter((x) => x.langs).slice(0, 3)) {
    const task = generateTask(g.topics[0], 2, 7);
    if (task?.generator === g.id) assert.ok(!/\d; \d/.test(task.text), `${g.id}: ${task.text}`);
  }
});

test("vrz-koordinate: with a decimal coordinate every point of the task uses a semicolon", () => {
  const g = GENERATORS.find((x) => x.id === "vrz-koordinate");
  let n = 0;
  for (let seed = 1; seed <= 400 && n < 3; seed++) {
    const t = generateTask(g.topics[0], 3, seed);
    if (t.generator !== g.id || !/S\(-?\d+,\d/.test(t.text) && !/S\(-?\d+\{,\}\d/.test(t.text)) continue;
    n++;
    assert.match(t.text, /A\(-?\d+; -?\d+\)/, t.text);
    assert.doesNotMatch(t.text, /\(-?\d+, -?\d+\)/, t.text);
  }
  assert.ok(n > 0, "found a task with a decimal coordinate");
});

test("nastevanje.js warns when the line already uses »; « for something else", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nastevanje-"));
  const f = path.join(dir, "a.md");
  fs.writeFileSync(f, "**Podatki:** kosmiči: $4$, $0{,}50$ €; jogurt: $12$, $1$ €\nČasi $1{,}5$, $2$ in $3$.\n");
  let out = "";
  try {
    execFileSync(process.execPath, ["scripts/nastevanje.js", f], { encoding: "utf8" });
  } catch (e) {
    out = e.stdout;
  }
  fs.rmSync(dir, { recursive: true, force: true });
  assert.match(out, /a\.md:1\n.*\n.*\n {2}! vrstica že ima »; «/);
  assert.doesNotMatch(out, /a\.md:2\n.*\n.*\n {2}!/);
  assert.match(out, /2 mest\. Opozoril »!«: 1\./);
});
