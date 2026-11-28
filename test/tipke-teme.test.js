// Tipke nad tipkovnico po temi naloge v klepetu z inštruktorjem (public/tipkovnica-data.js tutorChips; j, 27. 11.).
import test from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { tutorChips, TOPIC_CHIPS, TUTOR_BASE, applyTemplate } from "../public/tipkovnica-data.js";
import { chapterProfile } from "../public/graph/tipke-poglavja.js";
import { splitFormulas } from "../public/vnos-formul.js";
const tex = (s) => splitFormulas(s).filter((p) => "tex" in p).map((p) => p.tex);

const labels = (l) => l.map((c) => (Array.isArray(c) ? c[0] : c.label));
const forTopic = (id, phone = false) => {
  const topic = { id, subject: "MAT" };
  return labels(tutorChips(topic, chapterProfile(topic), phone));
};

test("stalne tipke spredaj in vedno enake; √ in xⁿ na en dotik", () => {
  for (const id of ["MAT-SS-3/kompleksna-stevila", "MAT-SS-2/logaritem", "MAT-SS-4/odvod", "x"]) {
    const l = forTopic(id);
    assert.deepEqual(l.slice(0, TUTOR_BASE.length), ["+", "−", "×", "÷", "( )", "=", "a/b", "x²", "xⁿ", "√"]);
  }
});

test("tipke teme: kompleksna števila, kotne, logaritmi, zaporedja, analiza, kemija", () => {
  assert.deepEqual(forTopic("MAT-SS-3/kompleksna-stevila").slice(10), ["i", "a + bi", "|z|", "z̄", "arg"]);
  assert.ok(forTopic("MAT-SS-3/kotne-funkcije").includes("sin"));
  assert.ok(forTopic("MAT-SS-2/logaritem").includes("logₐ"));
  assert.ok(forTopic("MAT-SS-3/aritmeticno-zaporedje").includes("aₙ₊₁"));
  assert.ok(forTopic("MAT-SS-4/odvod").includes("lim"));
  const kem = labels(tutorChips({ id: "KEM-SS-1/ioni", subject: "KEM" }, "kem"));
  for (const k of ["→", "⇌", "Xₙ", "X⁻"]) assert.ok(kem.includes(k), k);
  assert.ok(forTopic("MAT-SS-1/linearne-neenacbe").includes("≤"));
});

test("telefon: največ tri tipke teme in »Vse tipke« (plast f(x))", () => {
  const l = tutorChips({ id: "MAT-SS-3/kompleksna-stevila" }, "cplx", true);
  assert.equal(l.length, 4 + 3 + 1);
  assert.deepEqual(l.at(-1), { label: "Vse tipke", i18n: "tk.allKeys", layer: "fx" });
  assert.equal(tutorChips(null, null, true).length, 5);
});

test("vsaka predloga teme ima največ en @ in se izriše", () => {
  for (const [p, list] of Object.entries(TOPIC_CHIPS))
    for (const [label, ins] of list) {
      assert.ok((ins.match(/@/g) || []).length <= 1, `${p} ${label}`);
      const { value } = applyTemplate("", 0, 0, ins);
      for (const t of tex(value)) assert.doesNotThrow(() => katex.renderToString(t, { throwOnError: true, strict: "ignore" }), `${ins} → ${t}`);
    }
});

test("»Moje tipke«: dodaj (izbrano ali zapis pred kazalcem), brez podvojitve, odstrani, pokvarjen zapis", async () => {
  const { parseMoje, mojeAdd, mojeDel, mojeFrom, MOJE_KEY } = await import("../public/tipkovnica-data.js");
  assert.equal(MOJE_KEY, "evklid.mojeTipke");
  let m = parseMoje("ni json");
  assert.deepEqual(m, { mat: [], sym: [], kem: [] });
  assert.equal(mojeFrom("Ion SO₄²⁻", 9, 9), "SO₄²⁻");
  assert.equal(mojeFrom("g = 9,81 m/s²", 0, 8), "g = 9,81");
  assert.equal(mojeFrom("abc ", 4, 4), "");
  m = mojeAdd(mojeAdd(mojeAdd(m, "kem", "SO₄²⁻"), "kem", "NH₄⁺"), "kem", "SO₄²⁻");
  assert.deepEqual(m.kem, ["NH₄⁺", "SO₄²⁻"]);
  assert.deepEqual(mojeDel(m, "kem", "NH₄⁺").kem, ["SO₄²⁻"]);
  assert.deepEqual(parseMoje(JSON.stringify(m)).kem, ["NH₄⁺", "SO₄²⁻"]);
  assert.deepEqual(mojeAdd(m, "kem", "x".repeat(41)), m);
});
