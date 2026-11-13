import test from "node:test";
import assert from "node:assert/strict";
import { mdBlocks, splitSection, lessonSteps } from "../public/lesson-steps.js";
import { loadLesson } from "../server/textbook.js";

const think = '<div class="tb-think"><p class="tb-think-label">Premisli</p>\n\nZakaj?\n\n<details><summary>Pokaži odgovor</summary>\n\nKer.\n\n</details></div>';

test("blocks keep Premisli, formula and $$ math whole", () => {
  const md = `Prvi.\n\n${think}\n\n$$\na = b\n\nc = d\n$$\n\nZadnji.`;
  const b = mdBlocks(md);
  assert.equal(b.length, 4);
  assert.equal(b[1], think);
  assert.match(b[2], /^\$\$[\s\S]*\$\$$/);
});

test("explanation splits after every Premisli and at ### headings; examples stay whole", () => {
  const md = `Uvod.\n\n${think}\n\nNaprej.\n\n### Drugi del\n\nBesedilo.`;
  assert.deepEqual(splitSection(md, "explain").map((c) => c.slice(0, 6)), ["Uvod.\n", "Naprej", "### Dr"]);
  const ex = `### Primer 1\n\n${"Korak. ".repeat(400)}\n\n${"Še. ".repeat(300)}\n\n### Primer 2\n\nB`;
  assert.equal(splitSection(ex, "examples").length, 2);
  assert.equal(splitSection("Kratko.", "why").length, 1);
});

test("»Za izpit«: one exam task with its long solution is one step", () => {
  const sol = `<details class="tb-solution"><summary>Pokaži rešitev</summary>\n\n${"Korak. ".repeat(250)}\n\n</details>`;
  const S = [{ title: "Za izpit", md: `Znati moraš povedati:\n- izrek\n\n### Naloga 1\n\n${"Besedilo. ".repeat(70)}\n\n${sol}\n\n### Naloga 2\n\nUtemelji.` }];
  assert.deepEqual(lessonSteps(S).map((s) => s.md.slice(0, 12)), ["Znati moraš ", "### Naloga 1", "### Naloga 2"]);
});

test("long explanation is cut at a paragraph, never into tiny pieces", () => {
  const p = "Odstavek z nekaj besedami. ".repeat(20); // ~540 znakov
  const parts = splitSection(Array(6).fill(p).join("\n\n"), "explain");
  assert.ok(parts.length >= 2);
  for (const c of parts) assert.ok(c.length >= 350 && c.length <= 1700, String(c.length));
});

test("quiz questions are spread between the cards: after Razlaga, after Pogoste napake, rest at the end", () => {
  const S = ["Zakaj se tega učimo", "Razlaga", "Rešeni primeri", "Pogoste napake", "Povzetek"].map((title) => ({ title, md: "Besedilo." }));
  const steps = lessonSteps(S, 5);
  const checks = steps.filter((s) => s.type === "check");
  assert.deepEqual(checks.map((c) => c.checks), [[0], [1], [2, 3, 4]]);
  assert.equal(steps[steps.indexOf(checks[0]) - 1].title, "Razlaga");
  assert.equal(steps[steps.indexOf(checks[1]) - 1].title, "Pogoste napake");
  assert.equal(checks[2].final, true);
  assert.deepEqual(lessonSteps(S, 2).filter((s) => s.type === "check").map((c) => c.checks), [[0, 1]]);
  assert.equal(lessonSteps(S, 0).filter((s) => s.type === "check").length, 0);
});

test("a real lesson becomes short cards that keep all its text", () => {
  const L = loadLesson("FIZ-OS-9/upor-in-ohmov-zakon");
  const steps = lessonSteps(L.sections, L.checks.length);
  assert.ok(steps.length >= 8);
  const text = steps.filter((s) => s.type === "text");
  for (const [i, s] of L.sections.entries()) {
    const joined = text.filter((x) => x.section === i).map((x) => x.md).join("\n\n");
    assert.equal(joined.replace(/\s+/g, " ").trim(), s.md.replace(/\s+/g, " ").trim(), s.title);
  }
  assert.deepEqual(steps.filter((s) => s.type === "check").flatMap((s) => s.checks), L.checks.map((_, i) => i));
});

test("a numbered point stays whole on one step (j, 1. 11. 2026)", () => {
  const p = "Besedilo ".repeat(60).trim();
  const md = [`**1. Prva.** ${p}`, p, `**2. Druga.** ${p}`, p, p, `**3. Tretja.** Kratko.`, p].join("\n\n");
  const parts = splitSection(md, "explain");
  for (const c of parts) assert.match(c, /^\*\*\d+\. /, "every step starts with a point");
  assert.equal(parts.join("\n\n"), md);
  const L = loadLesson("MAT-SS-2/kompleksna-stevila");
  const raz = L.sections.find((s) => /razlag/i.test(s.title));
  for (const c of splitSection(raz.md, "explain")) assert.match(c.trimStart(), /^\*\*\d+\. /);
});

test("a simulation sits on the step whose text mentions it (j, 2. 11. 2026)", async () => {
  const { demoSteps } = await import("../public/lesson-steps.js");
  const T = (section, md, title = "Razlaga", last = false) => ({ type: "text", section, title, md, last });
  const steps = [T(0, "Uvod brez omembe.", "Zakaj se tega učimo", true), T(1, "Razlaga."), T(1, "V simulaciji spodaj »Merjenje« izmeri svinčnik.", "Razlaga", true), { type: "check", checks: [0] }, T(2, "Primer.", "Rešeni primeri", true)];
  assert.deepEqual(demoSteps(steps, [{ title: "Merjenje" }], 2), [[2]]);
  // brez omembe ostane za rešenimi primeri
  assert.deepEqual(demoSteps(steps.map((s) => (s.type === "text" ? { ...s, md: "Nič." } : s)), [{ title: "Merjenje" }], 2), [[4]]);
  // dve simulaciji: naslov odloči, splošna omemba velja za neomenjeno
  const two = [T(0, "Uvod.", "Zakaj", true), T(1, "Poskusi simulacijo spodaj."), T(1, "V simulaciji spodaj (»Graf«) nariši.", "Razlaga", true), T(2, "Primer.", "Rešeni primeri", true)];
  assert.deepEqual(demoSteps(two, [{ title: "Koren" }, { title: "Graf" }], 2), [[1], [2]]);
  // omemba samo v uvodu: tam in še za rešenimi primeri
  const intro = [T(0, "Pomaga ti simulacija spodaj.", "Zakaj se tega učimo", true), T(1, "Razlaga.", "Razlaga", true), T(2, "Primer.", "Rešeni primeri", true)];
  assert.deepEqual(demoSteps(intro, [{ title: "X" }], 2), [[0, 2]]);
  // prava lekcija iz j-jevega posnetka: simulacija je na koraku, ki jo omenja
  const L = loadLesson("FIZ-OS-8/merske-napake");
  const st = lessonSteps(L.sections, L.checks.length);
  const [ks] = demoSteps(st, [{ title: "Merjenje in merska napaka" }], L.sections.findIndex((s) => /rešen/i.test(s.title)));
  for (const k of ks) assert.match(st[k].md, /simulacij/i);
});
