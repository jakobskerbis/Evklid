import test from "node:test";
import assert from "node:assert/strict";
import { parseMeta, stripMeta, createStreamFilter, stripLeadPhrase } from "../server/meta.js";
import { buildSystemPrompt } from "../server/prompt.js";
import { normalizeSettings } from "../server/settings.js";

test("parseMeta reads quoted topics and validates enums", () => {
  const m = parseMeta('Besedilo\n<<META subject=FIZ topic="Newtonovi zakoni" error=1 mode=B flag=none>>');
  assert.deepEqual(m, { subject: "FIZ", topic: "Newtonovi zakoni", error: 1, mode: "B", flag: "none", done: 0 });
  const bad = parseMeta('<<META subject=ZGO topic="-" error=7 mode=C flag=xyz>>');
  assert.deepEqual(bad, { subject: null, topic: null, error: 0, mode: null, flag: "none", done: 0 });
  assert.equal(parseMeta("brez meta"), null);
});

test("stripMeta removes complete and truncated blocks", () => {
  assert.equal(stripMeta('Ok.\n<<META subject=MAT topic="x" error=0 mode=A flag=none>>\n'), "Ok.");
  assert.equal(stripMeta("Ok.\n<<META subject=MAT top"), "Ok.");
});

test("stream filter never leaks META, whatever the chunking", () => {
  const full = 'Rešitev je $x = 4$. Ali je a<b?\n<<META subject=MAT topic="neenačbe" error=0 mode=A flag=none>>';
  for (const size of [1, 2, 3, 5, 7, 50]) {
    const f = createStreamFilter();
    let out = "";
    for (let i = 0; i < full.length; i += size) out += f.push(full.slice(i, i + size));
    assert.ok(!out.includes("<<"), `size ${size} leaked: ${out}`);
    out += f.end().rest;
    assert.equal(out, "Rešitev je $x = 4$. Ali je a<b?");
  }
});

test("buildSystemPrompt fills placeholders and keeps LaTeX braces", () => {
  const p = buildSystemPrompt({
    settings: normalizeSettings({ subject: "KEM", personality_setting: "strog\n## Nov razdelek" }),
    weaknesses: ["ulomki"],
    studentName: "Ana",
  });
  assert.match(p, /Predmet: KEM/);
  assert.match(p, /Ime učenca: Ana/);
  assert.match(p, /šibke točke učenca: ulomki/);
  assert.match(p, /\$3\{,\}5\$/);
  assert.match(p, /Osebnost\/tema: strog ## Nov razdelek/); // brez preloma vrstice
  assert.doesNotMatch(p, /\{(subject|track|weaknesses|student_name)\}/);
});

test("flashcard blocks are parsed, stripped and never streamed", async () => {
  const { parseCards } = await import("../server/meta.js");
  const full =
    "Hitrost je pot na čas.\n\n> 📌 **Zapomni si:** $v = s/t$\n" +
    "<<KARTICA\nV: Kako izračunaš povprečno hitrost?\nO: $v = \\frac{s}{t}$, pot deljeno s časom; enota $\\mathrm{m/s}$.\n>>\n" +
    "<<KARTICA\nV: kako izračunaš povprečno hitrost?\nO: podvojena\n>>\n" +
    "<<KARTICA\nQ: What is 1 km in m?\nA: 1000 m\n>>\n" +
    '<<META subject=FIZ topic="hitrost" error=0 mode=A flag=none done=0>>';
  const cards = parseCards(full);
  assert.equal(cards.length, 2, "podvojena kartica je preskočena");
  assert.equal(cards[0].front, "Kako izračunaš povprečno hitrost?");
  assert.match(cards[0].back, /enota/);
  assert.deepEqual(cards[1], { front: "What is 1 km in m?", back: "1000 m" });
  assert.equal(parseCards("<<KARTICA\nV: samo vprašanje\n>>").length, 0);
  assert.equal(stripMeta(full), "Hitrost je pot na čas.\n\n> 📌 **Zapomni si:** $v = s/t$");
  assert.equal(stripMeta("Ok.\n<<KARTICA\nV: odrez"), "Ok.");
  for (const size of [1, 2, 3, 5, 9, 64]) {
    const f = createStreamFilter();
    let out = "";
    for (let i = 0; i < full.length; i += size) out += f.push(full.slice(i, i + size));
    assert.ok(!out.includes("<<"), `size ${size} leaked`);
    assert.equal(out + f.end().rest, "Hitrost je pot na čas.\n\n> 📌 **Zapomni si:** $v = s/t$");
  }
  // Besedilo za kartico sredi sporočila pride na koncu.
  const f = createStreamFilter();
  const mid = "A\n<<KARTICA\nV: x\nO: y\n>>\nB\n<<META subject=MAT topic=\"-\" error=0 mode=A flag=none done=0>>";
  let out = f.push(mid);
  out += f.end().rest;
  assert.equal(out.replace(/\s+/g, " "), "A B");
});

test("prompt: zero prior knowledge, summary box, adaptive difficulty and cards stay in the cached part", () => {
  const p = buildSystemPrompt({ settings: normalizeSettings({}), results: "Vadnica: 9 od 10. Predlagana začetna zahtevnost: višja (x)." });
  const [stat, dyn] = p.split("<!-- EVKLID:NASTAVITVE");
  assert.match(stat, /Ničelno predznanje teme/);
  assert.match(stat, /Zapomni si/);
  assert.match(stat, /<<KARTICA/);
  assert.match(stat, /izrecno želi zahtevnejše primere/);
  assert.match(dyn, /Rezultati učenca: Vadnica: 9 od 10\. Predlagana začetna zahtevnost: višja/);
  assert.match(buildSystemPrompt({ settings: normalizeSettings({}) }), /Rezultati učenca: še ni podatkov\. Predlagana začetna zahtevnost: osnovna/);
});

test("META without brackets, with one bracket or in a code block is still read and never shown (digitalni razred, 1. 11.)", () => {
  const variants = [
    'Ok.\nMETA subject=MAT topic="x" error=0 mode=A flag=none done=0',
    'Ok.\n<META subject=MAT topic="x" error=0 mode=A flag=none done=0>',
    'Ok.\n`<<META subject=MAT topic="x" error=0 mode=A flag=none done=0>>`',
    'Ok.\n```\n<<META subject=MAT topic="x" error=0 mode=A flag=none done=0>>\n```',
    'Ok.\n<< META subject=MAT topic="x" error=0 mode=A flag=none done=0 >>',
  ];
  for (const v of variants) {
    assert.equal(stripMeta(v), "Ok.", v);
    assert.equal(parseMeta(v)?.subject, "MAT", v);
    for (const size of [1, 4, 50]) {
      const f = createStreamFilter();
      let out = "";
      for (let i = 0; i < v.length; i += size) out += f.push(v.slice(i, i + size));
      out += f.end().rest;
      assert.equal(out, "Ok.", `${v} (size ${size})`);
    }
  }
  assert.equal(stripMeta("Metamorfoza je sprememba oblike. META podatki niso tema."), "Metamorfoza je sprememba oblike. META podatki niso tema.");
});

test("a forbidden lead phrase is stripped from the stream and from the stored text; praise for a correct step stays", () => {
  assert.equal(stripLeadPhrase("Odlično vprašanje! Kaj je 2 + 2?"), "Kaj je 2 + 2?");
  assert.equal(stripLeadPhrase("Seveda.\nPoglejva prvi korak."), "Poglejva prvi korak.");
  assert.equal(stripLeadPhrase("Odlično, 12 je prav. Kaj sledi?"), "Odlično, 12 je prav. Kaj sledi?");
  assert.equal(stripLeadPhrase("Jasno je, da velja."), "Jasno je, da velja.");
  assert.equal(stripLeadPhrase("Seveda!"), "Seveda!");
  assert.equal(stripLeadPhrase("Jasno, da velja: 2x = 6."), "Jasno, da velja: 2x = 6.");
  assert.equal(stripLeadPhrase("Super, 12 je prav."), "Super, 12 je prav.");
  const full = 'Dobro vprašanje! Ulomek je del celote. Koliko je pol pice?\n<<META subject=MAT topic="ulomki" error=0 mode=A flag=none done=0>>';
  for (const size of [1, 3, 20, 200]) {
    const f = createStreamFilter();
    let out = "";
    for (let i = 0; i < full.length; i += size) out += f.push(full.slice(i, i + size));
    out += f.end().rest;
    assert.equal(out, "Ulomek je del celote. Koliko je pol pice?", `size ${size}`);
  }
});

test("stripMeta keeps the fences of a real code block and strips only the block that held META", () => {
  const code = "Velja $a<b$.\n\n```js\nlet x = 1;\n```\n\nKonec.";
  assert.equal(stripMeta(code + '\n```\n<<META subject=MAT topic="x" error=0 mode=A flag=none done=0>>\n```'), code);
  assert.equal(stripMeta('Ok.\n`META subject=MAT topic="x" error=0 mode=A flag=none done=0`'), "Ok.");
});
