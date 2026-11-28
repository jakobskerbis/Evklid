// K-06 / K-16: neodvisni nabor inštruktorja (scripts/nabor-instruktorja.mjs, docs/nabor-instruktorja.md). Brez ključa:
// velikost in sestava po načrtu (≥ 30 % uradnih, 20 % skrito), noben referenčni odgovor iz inštruktorja, naloge iz
// generatorjev se ponovijo z istim odgovorom, šifrirani datoteki imata pravo glavo. S ključem NABOR_KLJUC še: vsebina
// šifer se ujema z objavljeno sestavo (sha256) in uradne postavke imajo uradni odgovor.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { MAPA, CILJI, MIN_URADNO, SKRITO, NABOR, nalogaGeneratorja, razdeli, postavkaUradna, odtis } from "../scripts/nabor-instruktorja.mjs";
import { jeSifrirano, kljucIz, odsifriraj } from "../scripts/preizkus3-sifra.mjs";
import { getTopic } from "../server/curriculum.js";
import { checkAnswer } from "../server/practice/check.js";

const beri = (f) => fs.readFileSync(`${MAPA}/${f}`, "utf8");
const sestava = JSON.parse(beri("sestava.json"));
const gen = JSON.parse(beri("razvoj-generatorji.json"));

test("velikost, delež uradnih in skriti del po načrtu", () => {
  for (const [nab, cilj] of Object.entries(CILJI)) {
    const s = sestava.nabori[nab];
    assert.ok(s.n >= cilj, `${nab}: ${s.n} < ${cilj}`);
    assert.ok(s.delez_uradnih >= MIN_URADNO, `${nab}: uradnih ${s.delez_uradnih}`);
    assert.ok(Math.abs(s.skritih / s.n - SKRITO) <= 0.03, `${nab}: skritih ${s.skritih} od ${s.n}`);
  }
});

test("javni del: vse iz generatorjev, odgovor iz kode, teme obstajajo, id-ji enkratni", () => {
  const ids = new Set();
  for (const p of gen) {
    assert.equal(p.vir.vrsta, "generator");
    assert.equal(p.odgovor_vir, "koda generatorja");
    assert.ok(getTopic(p.tema), p.tema);
    assert.ok(!ids.has(p.id), p.id);
    ids.add(p.id);
  }
  // Javni so samo števci: seznam razvojnih uradnih id-jev bi skupaj z javnimi polami izdal skrite naloge.
  assert.deepEqual(Object.keys(sestava).sort(), ["nabori", "razlicica", "sha256"]);
  const sha = crypto.createHash("sha256").update(beri("razvoj-generatorji.json")).digest("hex");
  assert.equal(sha, sestava.sha256["razvoj-generatorji.json"], "razvoj-generatorji.json se ne ujema s sestava.json");
});

// Vse postavke (≈ 2 s): sprememba generatorja, ki pri istem semenu da drugo nalogo ali odgovor, pade tu. Popravek
// zahteva ponovno gradnjo (ključ in zasebni prepisi, docs/nabor-instruktorja.md).
test("naloge iz generatorjev se ponovijo z istim besedilom in odgovorom (vse)", () => {
  for (const p of gen) {
    const t = nalogaGeneratorja(p.vir);
    const a = t.answer;
    const v = a.type === "number" ? a.value : a.type === "choice" ? a.index : a.type === "fraction" ? `${a.num}/${a.den}` : (a.values ?? a.value ?? null);
    assert.equal(odtis(t.text), p.besedilo_odtis, `${p.id}: besedilo naloge se je spremenilo`);
    assert.deepEqual(v, p.odgovor.vrednost, p.id);
    if (p.vrsta === "napaka") assert.ok(!["correct", "rounding"].includes(checkAnswer(a, p.napaka.ucenec).kind), `${p.id}: napačna rešitev ni napačna`);
  }
});

test("razdelitev: cele skupine, ~20 % v vsakem sloju, brez ključa ni mogoče ponoviti", () => {
  const p = Array.from({ length: 300 }, (_, i) => ({ predmet: "MAT", vir: { vrsta: i % 3 ? "generator" : "uradno" }, skupina: `S${Math.floor(i / 3)}`, id: `x${i}` }));
  const a = razdeli(p, Buffer.alloc(32, 1));
  const b = razdeli(p, Buffer.alloc(32, 2));
  const sk = new Set(a.skrito.map((x) => x.skupina));
  assert.ok(a.razvoj.every((x) => !sk.has(x.skupina)), "skupina ni razdeljena");
  assert.ok(a.skrito.length >= 0.2 * 300 && a.skrito.length <= 0.25 * 300, String(a.skrito.length));
  assert.notDeepEqual(a.skrito.map((x) => x.id), b.skrito.map((x) => x.id));
  assert.equal(NABOR("KEM"), "FIZ/KEM");
});

test("uradna postavka brez uradnega odgovora ne gre v nabor", () => {
  assert.equal(postavkaUradna({ id: "M251-401-1-1/1a", odgovor: null }), null);
  assert.equal(postavkaUradna({ id: "M251-401-1-1/1a", odgovor: { vrednost: "" } }), null);
  assert.equal(postavkaUradna({ id: "M251-401-1-1/1a", odgovor: { vrednost: "216°" }, odgovor_negotov: true }), null);
  assert.equal(postavkaUradna({ id: "M251-401-1-1/1a", odgovor: { tip: "risba", vrednost: "graf" } }), null);
  assert.equal(postavkaUradna({ id: "M251-401-1-1/1a", vir: { ustanova: "RIC" }, odgovor: { vrednost: "3" } }).vir.vrsta, "uradno");
});

test("uradne in skrite naloge so v repozitoriju samo šifrirane", () => {
  for (const f of ["razvoj-uradno.enc", "skrito.enc"]) {
    assert.ok(jeSifrirano(beri(f)), f);
    // Samo glava in base64 šifra, nič drugega (glava sama ne zagotavlja, da je vsebina šifrirana).
    const o = JSON.parse(beri(f));
    assert.deepEqual(Object.keys(o).sort(), ["alg", "data", "iv", "oblika", "tag", "v"], f);
    assert.match(o.data, /^[A-Za-z0-9+/]{1000,}={0,2}$/, f);
  }
  const javno = fs.readdirSync(MAPA).filter((f) => !f.endsWith(".enc"));
  assert.deepEqual(javno.sort(), ["razvoj-generatorji.json", "sestava.json"]);
});

test("s ključem: šifre se ujemajo s sestavo, uradne postavke imajo uradni odgovor", { skip: !process.env.NABOR_KLJUC && "brez NABOR_KLJUC" }, () => {
  const k = kljucIz(process.env.NABOR_KLJUC);
  const uradno = odsifriraj(beri("razvoj-uradno.enc"), k);
  const skrito = odsifriraj(beri("skrito.enc"), k);
  const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
  assert.equal(sha(uradno), sestava.sha256["razvoj-uradno (čisto besedilo)"]);
  assert.equal(sha(skrito), sestava.sha256["skrito (čisto besedilo)"]);
  for (const p of [...JSON.parse(uradno), ...JSON.parse(skrito)]) {
    if (p.vir.vrsta === "uradno") assert.equal(p.odgovor_vir, "uradna navodila za ocenjevanje", p.id);
    assert.ok(p.odgovor && p.odgovor.vrednost != null, p.id);
  }
});
