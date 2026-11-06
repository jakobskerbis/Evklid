// Naštevanje števil z decimalno vejico se loči s podpičjem (j, 6. 11. 2026; server/nastevanje.js).
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { popraviNastevanja, najdiNastevanja } from "../server/nastevanje.js";
import { systemBlocks, buildSystemPrompt } from "../server/prompt.js";
import { normalizeSettings } from "../server/settings.js";
import { checkLessonSource } from "../server/lesson-check.js";
import { GENERATORS, generateTask } from "../server/practice/index.js";

test("tutor prompt: rule about semicolons in lists with decimals is in the cached part", () => {
  const [stat] = systemBlocks(buildSystemPrompt({ settings: normalizeSettings({ subject: "MAT" }) }));
  assert.match(stat.text, /vsaj eno decimalno, jih loči s podpičjem/);
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
