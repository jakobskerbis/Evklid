// Vrsta preverjanj z Lean in delavec (docs/lean.md, L5): filter trditve, predloga in branje izpisa Leana, vrsta v bazi
// (najem, potek, čiščenje), poti delavca z žetonom (404 brez žetona, 401, 429, 4xx ob neveljavnem vhodu).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import express from "express";
import { preveriTrditev, TAKTIKE, NAJVEC_ZNAKOV } from "../scripts/lean-delavec/trditev.mjs";
import { predloga, preberiIzpis, ocistiSporocilo, ime, izrekDokaza } from "../scripts/lean-delavec/lean.mjs";
import { naloziNastavitve, preveriZLean, enKrog, naslednjiPremor, rokNaloge, nastaviMapo, lakeExe } from "../scripts/lean-delavec/delavec.mjs";
import { createLeanVrsta, mountLeanDelavec, mountLeanBranje, dokazIzLean, leanToken } from "../server/lean-vrsta.js";
import { statusTrditve } from "../public/preverjanje/trditev.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const ZETON = "a".repeat(40);
const E1 = "(1:ℕ) + 1 = 2";
const E2 = "(2:ℕ) + 2 = 4";

test("lean filter: spusti matematične trditve", () => {
  for (const s of [
    "(2:ℝ) + 2 = 4",
    "∀ x : ℝ, (x + 1)^2 = x^2 + 2*x + 1",
    "∀ n : ℕ, ∑ i ∈ Finset.range (n + 1), i = n * (n + 1) / 2",
    "Real.sqrt 4 = (2 : ℝ)",
    "∀ a b : ℝ, 0 ≤ a → 0 ≤ b → a * b ≥ 0",
    "∀ x : ℝ, x ≠ 0 → x⁻¹ * x = 1",
    "Nat.Prime (7 : ℕ)",
    "∃ x : ℤ, 3 * x = 12",
    "∀ x : ℝ, |x| ≥ 0",
    "∀ x₁ x_2 : ℚ, x₁ + x_2 = x_2 + x₁",
    "deriv (fun x : ℝ => x ^ 2) 3 = 6",
    "∀ x : ℝ, sin x ^ 2 + cos x ^ 2 = 1",
    "(10 : ℕ) % 3 = 1",
    "  (1:ℕ) + 1 = 2  ",
    "∀ (x : ℝ) (n : ℕ), x ^ (n + 1) = x * x ^ n",
    "∀ x : ℝ, x ^ (1/2 : ℝ) ≥ 0",
    "∃! x : ℝ, 2 * x = 4",
    "(2:ℝ) / 0.5 = 4",
    "(2:ℕ) ^ 1000 > 0",
    "(123456789012 : ℕ) > 0",
    "True",
  ])
    assert.equal(preveriTrditev(s).ok, true, s);
  assert.equal(preveriTrditev("  (1:ℕ) + 1 = 2 ").trditev, "(1:ℕ) + 1 = 2");
});

test("lean filter: tipi vezav in števil, deljenje z 0, meje števil in potenc, »!« v imenu", () => {
  for (const [s, razlog] of [
    // brez tipa Lean vzame ℕ (2 - 3 = 0) ali tip iz okolice: šolsko napačne trditve bi bile »dokazane«
    ["∀ x, x - 1 < x + 1", /vezava brez tipa/],
    ["∀ x : ℝ, ∀ y, x = y", /vezava brez tipa/],
    ["∀ x > 0, x = x", /vezava brez tipa/],
    ["∃ x ∈ Finset.range 3, x = (1:ℕ)", /vezava brez tipa/],
    ["(fun x => x) (1:ℕ) = 1", /vezava brez tipa/],
    ["∀ (x) (y : ℝ), x = y", /vezava brez tipa/],
    ["1 + 1 = 2", /števila brez tipa/],
    ["2 - 3 = 0", /števila brez tipa/],
    ["∀ x : ℝ, x / 0 = 0", /deljenje z 0/],
    ["∀ x : ℝ, x / (0 : ℝ) = 0", /deljenje z 0/],
    // pomnilnik: GMP pri potenci ne upošteva -M
    ["(2^16777215)^5000 % 7 = (2:ℕ)", /eksponent/],
    ["(2:ℕ) ^ 1001 = 0", /eksponent/],
    ["(1234567890123 : ℕ) = 1", /števkami/],
    ["(2:ℕ) ^ 3 ^ 2 = 512", /potenca potence/],
    ["(2:ℕ) ^ (3 ^ 2) = 512", /potenca potence/],
    ["((2:ℕ) ^ 3) ^ 2 = 64", /potenca potence/],
    ["∀ x : ℝ, (x ^ 2)² = x ^ 4", /potenca potence/],
    ["∀ x : ℝ, x²² = x ^ 4", /potenca potence/],
    ["(2:ℕ) ^ Nat.factorial 20 = 1", /eksponentu/],
    ["(2:ℕ) ^ (Nat.factorial 20) = 1", /eksponentu/],
    // »!« takoj za imenom je del imena (kot v Leanu)
    ["∀ x : ℕ, x! = x", /ime »x!«/],
    ["Nat.foo! = (1:ℕ)", /ime »Nat.foo!«/],
  ]) {
    const r = preveriTrditev(s);
    assert.equal(r.ok, false, s);
    assert.match(r.razlog, razlog, s);
  }
});

test("lean filter: zavrne ukaze, komentarje, nize, nedovoljena imena in triki z unicode", () => {
  const slabi = [
    "",
    "   ",
    null,
    42,
    "1 = 1 := by rfl",
    "1 = 1 := rfl",
    "True\n#eval IO.println 1",
    "True\r#exit",
    "#eval 1",
    "True #print axioms",
    "@[implemented_by x] True",
    "True -- komentar",
    "True /- komentar -/",
    "/-- doc -/ True",
    "True\tx",
    "(by decide : 1 = 1)",
    "show 1 = 1 from rfl",
    "IO.println 1 = 1",
    "Lean.Elab.Command x",
    "_root_.IO.FS.removeFile = x",
    "open System in True",
    "True def x : Nat",
    "True elab \"x\" : term",
    "run_cmd x",
    "initialize x",
    "True macro x",
    "set_option maxHeartbeats 0 in True",
    "unsafe x",
    "opaque x",
    "axiom x",
    "sorry",
    "native_decide",
    "x = \"niz\"",
    "x = 'a'",
    "«#eval» = 1",
    "x = `y",
    "$x",
    "⟨1, 2⟩ = x",
    "x ; y",
    "(1 + 2 = 3",
    "1 + 2) = 3",
    "[1, 2) = x",
    "|x = 1",
    "x\u200b = 1", // ničelni presledek
    "x\u00a0= 1", // trdi presledek
    "ⅹ = 1", // rimska številka, podobna x
    "е = 1", // cirilični e
    "e\u0301 = 1", // kombinirani naglas
    "Ana ima 5 let",
    "ana@example.com = 1",
    "Polona = Polona",
    "x.foo = 1",
    "₁ = 1",
    "λ x, x",
    "x" + " + x".repeat(NAJVEC_ZNAKOV),
  ];
  for (const s of slabi) {
    const r = preveriTrditev(s);
    assert.equal(r.ok, false, JSON.stringify(s));
    assert.ok(typeof r.razlog === "string" && r.razlog.length < 120, "kratek razlog");
  }
});

test("lean predloga: ena vrstica na taktiko, #print axioms, filter še enkrat", () => {
  const f = predloga("(2:ℝ) + 2 = 4");
  assert.equal(izrekDokaza("(2:ℝ) + 2 = 4", "ring"), `import Mathlib\nset_option autoImplicit false\nopen Real\ntheorem evklid_t3 : (2:ℝ) + 2 = 4 := by intros; ring\n`);
  assert.ok(f.includes(izrekDokaza("(2:ℝ) + 2 = 4", "ring").split("\n")[3]), "izrek dokaza je vrstica iz predloge");
  assert.equal(izrekDokaza("x", "polyrith"), null);
  const v = f.trimEnd().split("\n");
  assert.equal(v[0], "import Mathlib");
  assert.equal(v.length, 3 + 2 * TAKTIKE.length);
  assert.equal(v[3], "theorem evklid_t1 : (2:ℝ) + 2 = 4 := by intros; norm_num");
  assert.equal(v[4], "#print axioms evklid_t1");
  assert.ok(!TAKTIKE.includes("polyrith") && !TAKTIKE.includes("native_decide"));
  assert.throws(() => predloga("True\n#eval 1"), /zavrnjena/);
  assert.throws(() => predloga("(1:ℕ) = 1", ["polyrith"]), /ni dovoljena/);
});

const sp = (line, severity, data) => JSON.stringify({ pos: { line, column: 0 }, severity, data });
test("lean izpis: prvi izrek brez napake in z dovoljenimi aksiomi zmaga; sorry in tuji aksiomi ne", () => {
  // vrstice: izrek k je v vrstici 4 + 2k, #print v 5 + 2k
  let izpis = [sp(4, "error", "linarith failed"), sp(5, "information", `'${ime(0)}' depends on axioms: [propext, sorryAx]`), sp(7, "information", `'${ime(1)}' depends on axioms: [propext, Classical.choice, Quot.sound]`)].join("\n");
  assert.deepEqual(preberiIzpis(izpis), { izid: "proved", taktika: TAKTIKE[1], aksiomi: ["propext", "Classical.choice", "Quot.sound"], sporocilo: `dokazano s taktiko ${TAKTIKE[1]}` });
  izpis = sp(5, "information", `'${ime(0)}' does not depend on any axioms`);
  assert.equal(preberiIzpis(izpis).izid, "proved");
  for (const [vrstica, sev, data] of [
    [5, "information", `'${ime(0)}' depends on axioms: [propext, sorryAx]`],
    [5, "information", `'${ime(0)}' depends on axioms: [Lean.ofReduceBool]`],
    [5, "information", `'${ime(0)}' depends on axioms: [evil]`],
    [5, "information", `'${ime(1)}' does not depend on any axioms`], // napačno ime pod izrekom 1
  ])
    assert.equal(preberiIzpis(sp(vrstica, sev, data)).izid, "failed", data);
  izpis = [sp(4, "warning", "declaration uses 'sorry'"), sp(5, "information", `'${ime(0)}' does not depend on any axioms`)].join("\n");
  assert.equal(preberiIzpis(izpis).izid, "failed", "opozorilo sorry");
  const r = preberiIzpis([sp(4, "error", "unsolved goals\n⊢ False"), sp(5, "information", `'${ime(0)}' depends on axioms: [sorryAx]`), "{nepopoln"].join("\n"));
  assert.equal(r.izid, "failed");
  assert.match(r.sporocilo, /unsolved goals/);
  // pokvarjena namestitev ni »failed« (sicer bi trditev 7 dni veljala za nedokazano)
  assert.equal(preberiIzpis("").izid, "napaka", "brez izpisa");
  assert.equal(preberiIzpis(sp(4, "error", "linarith failed")).izid, "napaka", "nobena vrstica #print axioms");
  const g = preberiIzpis([sp(1, "error", "unknown module prefix 'Mathlib'"), sp(5, "error", `unknown constant '${ime(0)}'`)].join("\n"));
  assert.equal(g.izid, "napaka", "napaka v glavi");
  assert.match(g.sporocilo, /glavi/);
  assert.equal(preberiIzpis(sp(5, "error", `unknown constant '${ime(0)}'`)).izid, "failed", "trditev se ne razčleni: izrek ne obstaja");
});

test("lean sporočilo: brez poti, uporabniškega imena in kontrolnih znakov, omejena dolžina", () => {
  const s = ocistiSporocilo("C:\\Users\\jakob\\AppData\\Local\\Temp\\evklid-lean-x\\T.lean:4:0: error /home/claude/x \u0007", ["C:\\Users\\jakob\\AppData\\Local\\Temp\\evklid-lean-x"]);
  assert.doesNotMatch(s, /jakob|claude|\u0007/);
  assert.ok(ocistiSporocilo("x".repeat(5000)).length <= 2000);
});

test("lean delavec: nastavitve zahtevajo https (razen lokalno) in dolg žeton", () => {
  const dir = fs.mkdtempSync("/tmp/lean-nast-");
  const p = `${dir}/n.json`;
  const pisi = (o) => fs.writeFileSync(p, JSON.stringify(o));
  pisi({ streznik: "http://evklid.app", zeton: ZETON });
  assert.throws(() => naloziNastavitve(p), /https/);
  pisi({ streznik: "https://evklid.app", zeton: "kratek" });
  assert.throws(() => naloziNastavitve(p), /zeton/);
  pisi({ streznik: "http://127.0.0.1:3000/", zeton: ZETON, premorS: 1 });
  const n = naloziNastavitve(p);
  assert.equal(n.streznik, "http://127.0.0.1:3000");
  assert.equal(n.premorS, 5, "premor najmanj 5 s");
  pisi({ streznik: "https://evklid.app", zeton: ZETON, rokS: 1800 });
  assert.equal(naloziNastavitve(p).rokS, 540, "rok manj kot najem na strežniku");
  assert.equal(rokNaloge({ rokS: 540 }, 600_000), 540);
  assert.equal(rokNaloge({ rokS: 540 }, 300_000), 240, "vsaj 60 s pred koncem najema");
  assert.equal(rokNaloge({ rokS: 240 }, undefined), 240);
  pisi({ streznik: "https://evklid.app", zeton: ZETON, lake: "lake.exe" });
  assert.throws(() => naloziNastavitve(p), /absolutna/);
  assert.throws(() => lakeExe({}, { ELAN_HOME: `${dir}/ni` }), /ni nameščen/, "brez golega »lake« iz PATH ali cwd");
  fs.mkdirSync(`${dir}/elan/toolchains/leanprover--lean4---v4.36.0/bin`, { recursive: true });
  fs.writeFileSync(`${dir}/elan/toolchains/leanprover--lean4---v4.36.0/bin/lake`, "");
  fs.writeFileSync(`${dir}/lean-toolchain`, "leanprover/lean4:v4.36.0\n");
  if (process.platform !== "win32") assert.equal(lakeExe({ projekt: dir }, { ELAN_HOME: `${dir}/elan` }), `${dir}/elan/toolchains/leanprover--lean4---v4.36.0/bin/lake`, "lake iz orodjarne projekta");
  fs.rmSync(dir, { recursive: true });
});

test("lean projekt delavca: ista Lean in Mathlib kot lean/", () => {
  const r = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
  assert.equal(r("scripts/lean-delavec/projekt/lean-toolchain"), r("lean/lean-toolchain"));
  assert.match(r("scripts/lean-delavec/projekt/lakefile.toml"), new RegExp(`rev = "${r("lean/lakefile.toml").match(/rev = "([^"]+)"/)[1]}"`));
  const a = JSON.parse(r("scripts/lean-delavec/projekt/lake-manifest.json")).packages;
  const b = JSON.parse(r("lean/lake-manifest.json")).packages;
  assert.deepEqual(a, b);
  assert.match(r("scripts/lean-delavec/zazeni.bat"), /elan\/releases\/download\/v4\.4\.0\//);
});

test("lean vrsta: vpis samo trditve in vrste, dvojniki, polna vrsta", () => {
  const { db } = openDb(":memory:");
  const v = createLeanVrsta(db, { meje: { najvecVVrsti: 2 } });
  assert.throws(() => v.vpisi(E1, "racun", { ucenec: 5 }), /samo trditev/);
  assert.deepEqual(v.vpisi(E1, "neznano"), { napaka: "neznana vrsta" });
  assert.ok(v.vpisi("True\n#eval 1", "racun").napaka);
  const a = v.vpisi(E1, "racun");
  assert.match(a.id, /^ln_[0-9a-f]{32}$/);
  assert.deepEqual(v.vpisi(` ${E1}`, "racun"), { id: a.id, obstaja: true });
  assert.notEqual(v.vpisi(E1, "identiteta").id, a.id);
  assert.deepEqual(v.vpisi(E2, "racun"), { napaka: "vrsta je polna" });
  const r = v.rezultat(a.id);
  assert.deepEqual(r, { id: a.id, vrsta: "racun", stanje: "queued", koncano: false, trditev: E1 });
  assert.equal(v.rezultat("ln_x"), null);
  assert.equal(v.rezultat({}), null);
  const stolpci = db.prepare("PRAGMA table_info(lean_naloge)").all().map((c) => c.name);
  for (const s of stolpci) assert.doesNotMatch(s, /student|parent|ucen|email|ime_/i, "brez stolpcev z osebnimi podatki");
});

test("lean vrsta: najem, potek najema, ponovni vpis, timeout po poskusih, čiščenje", () => {
  let t = 1_000_000;
  const { db } = openDb(":memory:");
  const v = createLeanVrsta(db, { now: () => t, meje: { najemMs: 1000, poskusov: 2, cakaMs: 50_000, hraniDni: 1 } });
  const { id } = v.vpisi(E1, "racun");
  const n1 = v.vzemi();
  assert.deepEqual(Object.keys(n1).sort(), ["id", "najem", "rokMs", "trditev"]);
  assert.equal(v.vzemi(), null, "ena naloga, že vzeta");
  t += 1001;
  const n2 = v.vzemi();
  assert.equal(n2.id, id, "potekel najem → spet v vrsti");
  assert.deepEqual(v.oddaj({ id, najem: n1.najem, izid: "failed" }), { napaka: "najem ni več veljaven", koda: 409 });
  t += 1001;
  assert.equal(v.vzemi(), null, "po 2 poskusih ne več");
  assert.equal(v.rezultat(id).stanje, "timeout");
  const b = v.vpisi(E2, "racun").id;
  t += 50_001;
  v.pocisti();
  assert.equal(v.rezultat(b).stanje, "timeout", "nepobrana naloga po roku");
  assert.match(v.rezultat(b).sporocilo, /ni bil dosegljiv/);
  // najem, ki je potekel davno (delavec se ni vrnil), dobi timeout tudi brez novega klica »naloga«
  const c = v.vpisi("(3:ℕ) + 3 = 6", "racun").id;
  v.vzemi();
  t += 1001 + 50_001;
  v.pocisti();
  assert.equal(v.rezultat(c).stanje, "timeout", "star najem → timeout");
  assert.notEqual(v.vpisi("(3:ℕ) + 3 = 6", "racun").id, c, "timeout ni dvojnik");
  t += 86_400_001;
  v.pocisti();
  assert.equal(v.rezultat(id), null, "stare naloge izbrisane");
});

test("lean vrsta: »napaka« (delavec ni pripravljen) vrne nalogo v vrsto; »failed« je dvojnik le kratek čas", () => {
  let t = 1_000_000;
  const { db } = openDb(":memory:");
  const v = createLeanVrsta(db, { now: () => t, meje: { poskusov: 2, neuspehMs: 1000 } });
  const { id } = v.vpisi(E1, "racun");
  let n = v.vzemi();
  assert.deepEqual(v.oddaj({ id, najem: n.najem, izid: "napaka", sporocilo: "napaka v glavi" }), { ok: true });
  let r = v.rezultat(id);
  assert.equal(r.stanje, "queued", "nazaj v vrsto, ne »failed«");
  assert.match(r.sporocilo, /ni pripravljen/);
  n = v.vzemi();
  assert.equal(n.id, id);
  v.oddaj({ id, najem: n.najem, izid: "napaka" });
  assert.equal(v.rezultat(id).stanje, "timeout", "po poskusih timeout");
  const b = v.vpisi(E2, "racun").id;
  n = v.vzemi();
  v.oddaj({ id: b, najem: n.najem, izid: "failed" });
  assert.equal(v.vpisi(E2, "racun").id, b, "failed je kratek čas dvojnik");
  t += 1001;
  assert.notEqual(v.vpisi(E2, "racun").id, b, "nato se ista trditev preveri znova");
});

test("lean vrsta: oddaja preveri izid, taktiko, aksiome in dolžino; dokaz v skupnem zapisu", () => {
  const { db } = openDb(":memory:");
  const v = createLeanVrsta(db);
  const { id } = v.vpisi("(2:ℝ) + 2 = 4", "racun");
  const n = v.vzemi();
  for (const [b, koda] of [
    [null, 400],
    [[], 400],
    [{ id, najem: n.najem, izid: "dokazano" }, 400],
    [{ id: "x", najem: n.najem, izid: "failed" }, 400],
    [{ id, najem: "x", izid: "failed" }, 400],
    [{ id, najem: n.najem, izid: "failed", sporocilo: 5 }, 400],
    [{ id, najem: n.najem, izid: "proved", taktika: "polyrith", aksiomi: [] }, 400],
    [{ id, najem: n.najem, izid: "proved", taktika: "norm_num", aksiomi: ["sorryAx"] }, 400],
    [{ id, najem: n.najem, izid: "proved", taktika: "norm_num" }, 400],
    [{ id: `ln_${"0".repeat(32)}`, najem: n.najem, izid: "failed" }, 404],
    [{ id, najem: "0".repeat(32), izid: "failed" }, 409],
  ])
    assert.equal(v.oddaj(b).koda, koda, JSON.stringify(b));
  assert.deepEqual(v.oddaj({ id, najem: n.najem, izid: "proved", taktika: "norm_num", aksiomi: ["propext", "Classical.choice", "Quot.sound"], ms: 1234, razlicica: "lean-delavec 1", sporocilo: "x".repeat(9000) }), { ok: true });
  const r = v.rezultat(id);
  assert.equal(r.stanje, "proved");
  assert.equal(r.koncano, true);
  assert.equal(r.sporocilo.length, 2000);
  assert.equal(v.oddaj({ id, najem: n.najem, izid: "failed" }).koda, 409, "druga oddaja ne prepiše");
  assert.equal(r.trditev, "(2:ℝ) + 2 = 4", "shranjena trditev");
  const d = dokazIzLean({ ...r });
  assert.equal(d.dokazi[0].motor, "lean");
  assert.equal(d.dokaz.izrek, izrekDokaza("(2:ℝ) + 2 = 4", "norm_num"), "izrek je natančno preverjeno besedilo");
  assert.equal(statusTrditve(d.dokazi, "racun", d.dokaz), "delno", "brez popolnosti ni »dokazano«");
  const p = dokazIzLean(r, { complete: "na" });
  assert.equal(statusTrditve(p.dokazi, "racun", p.dokaz), "dokazano");
  assert.ok(dokazIzLean({ ...r, trditev: "(3:ℝ) + 3 = 6" }).dokaz.izrek.includes("(3:ℝ) + 3 = 6"), "izrek iz shranjene trditve naloge");
  // predpostavke: prazno resnično (x > 1 → x < 0 → …) ni »dokazano« brez dokaza zadovoljivosti
  const h = { ...r, trditev: "∀ x : ℝ, x > 1 → x < 0 → x = 5" };
  assert.equal(dokazIzLean(h, { complete: "na" }).dokazi[0].complete, "unknown");
  assert.equal(statusTrditve(dokazIzLean(h, { complete: "na" }).dokazi, "izrek", dokazIzLean(h).dokaz), "delno");
  assert.equal(dokazIzLean(h, { complete: "na", zadovoljivo: true }).dokazi[0].complete, "na");
  for (const stanje of ["failed", "timeout", "rejected", "queued", "leased"]) assert.equal(dokazIzLean({ ...r, stanje }), null, `${stanje} ni »ne drži«`);
});

async function streznik(env, fn, { mount = (app, v) => mountLeanDelavec(app, v, { env, log: { warn() {} } }), meje } = {}) {
  const { db } = openDb(":memory:");
  const v = createLeanVrsta(db, { meje });
  const app = express();
  mount(app, v);
  const s = app.listen(0);
  const base = `http://127.0.0.1:${s.address().port}`;
  const post = (pot, body, zeton = ZETON, headers = {}) =>
    fetch(`${base}/api/lean/delavec/${pot}`, { method: "POST", headers: { "content-type": "application/json", ...(zeton ? { authorization: `Bearer ${zeton}` } : {}), ...headers }, body: typeof body === "string" ? body : JSON.stringify(body ?? {}) });
  try {
    await fn({ v, post, base });
  } finally {
    s.close();
  }
}

test("lean poti: brez žetona ali s prekratkim žetonom so izklopljene (404)", async () => {
  for (const env of [{}, { EVKLID_LEAN_TOKEN: "kratek" }]) {
    await streznik(env, async ({ post }) => {
      for (const p of ["naloga", "rezultat", "utrip"]) assert.equal((await post(p, {})).status, 404);
    });
  }
  assert.equal(leanToken({ EVKLID_LEAN_TOKEN: ` ${ZETON} ` }), ZETON);
});

test("lean poti: žeton, 204/200, oddaja, utrip, neveljavno telo, preveliko telo, meje klicev", async () => {
  await streznik({ EVKLID_LEAN_TOKEN: ZETON }, async ({ v, post, base }) => {
    assert.equal((await post("naloga", {}, null)).status, 401);
    assert.equal((await post("naloga", {}, "b".repeat(40))).status, 401);
    assert.equal((await post("naloga", {}, ZETON + "x")).status, 401);
    assert.equal((await fetch(`${base}/api/lean/delavec/naloga`)).status, 405);
    let r = await post("naloga", { razlicica: "test" });
    assert.equal(r.status, 204);
    assert.equal(v.naVoljo(), true, "klic naloge je utrip");
    const { id } = v.vpisi(E1, "racun");
    r = await post("naloga", {});
    assert.equal(r.status, 200);
    const n = await r.json();
    assert.deepEqual(Object.keys(n).sort(), ["id", "najem", "rokMs", "trditev"]);
    assert.equal(n.trditev, E1);
    assert.equal((await post("rezultat", "{pokvarjen")).status, 400);
    assert.equal((await post("rezultat", JSON.stringify({ x: "y".repeat(20000) }))).status, 413);
    assert.equal((await post("rezultat", { id, najem: n.najem, izid: "x" })).status, 400);
    assert.equal((await post("rezultat", { id, najem: n.najem, izid: "failed", sporocilo: "nobena taktika ni uspela" })).status, 200);
    assert.equal((await post("rezultat", { id, najem: n.najem, izid: "failed" })).status, 409);
    assert.equal(v.rezultat(id).stanje, "failed");
    assert.equal((await post("utrip", [1])).status, 400);
    r = await post("utrip", { razlicica: "lean-delavec 1", stanje: "caka" });
    assert.deepEqual(await r.json(), { ok: true, cakajocih: 0 });
    assert.equal((await post("drugo", {})).status, 404);
    assert.equal((await post("naloga", {}, ZETON, { "content-type": "text/plain" })).status, 204, "brez JSON telesa: prazno");
  });
});

test("lean poti: napačni žetoni z istega IP → 429; preveč klicev na minuto → 429", async () => {
  await streznik(
    { EVKLID_LEAN_TOKEN: ZETON },
    async ({ post }) => {
      for (let i = 0; i < 3; i++) assert.equal((await post("naloga", {}, "c".repeat(40))).status, 401);
      assert.equal((await post("naloga", {}, "c".repeat(40))).status, 429);
      assert.equal((await post("naloga", {}, ZETON)).status, 204, "pravilen žeton ne dobi 429 zaradi napačnih");
      assert.equal((await post("naloga", {}, "c".repeat(40), { "cf-connecting-ip": "203.0.113.9" })).status, 429, "glava odjemalca ne obide meje");
    },
    { meje: { napacnihNaIp: 3 } },
  );
  await streznik(
    { EVKLID_LEAN_TOKEN: ZETON },
    async ({ post }) => {
      for (let i = 0; i < 5; i++) assert.equal((await post("utrip", {})).status, 200);
      assert.equal((await post("utrip", {})).status, 429);
    },
    { meje: { klicevNaMinuto: 5 } },
  );
});

test("lean poti v aplikaciji: delavec pred prijavo računov, branje izida s prijavo, nekanonične poti 404", async () => {
  const old = process.env.EVKLID_LEAN_TOKEN;
  process.env.EVKLID_LEAN_TOKEN = ZETON;
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, accounts: true, log: { error() {}, warn() {}, info() {} } });
  const s = app.listen(0);
  const base = `http://127.0.0.1:${s.address().port}`;
  try {
    const { id } = app.locals.leanVrsta.vpisi(E1, "racun");
    const h = { authorization: `Bearer ${ZETON}`, "content-type": "application/json" };
    let r = await fetch(`${base}/api/lean/delavec/naloga`, { method: "POST", headers: h, body: "{}" });
    assert.equal(r.status, 200, "delavec ni uporabnik: brez prijave");
    assert.equal((await r.json()).id, id);
    r = await fetch(`${base}/API/lean/delavec/naloga`, { method: "POST", headers: h, body: "{}" });
    assert.equal(r.status, 404);
    r = await fetch(`${base}/api/lean/naloge/${id}`);
    assert.equal(r.status, 401, "branje izida zahteva prijavo, ko so računi vklopljeni");
    r = await fetch(`${base}/healthz/stanje`);
    const st = await r.json();
    assert.equal(st.leanDelavec.vklopljen, true);
    assert.equal(st.leanDelavec.naVoljo, true);
  } finally {
    s.close();
    store.db.close?.();
    if (old === undefined) delete process.env.EVKLID_LEAN_TOKEN;
    else process.env.EVKLID_LEAN_TOKEN = old;
  }
  // brez računov (domača namestitev) je branje po id odprto
  const { db } = openDb(":memory:");
  const v = createLeanVrsta(db);
  const a = express();
  mountLeanBranje(a, v);
  const s2 = a.listen(0);
  try {
    const { id } = v.vpisi(E1, "racun");
    const r = await fetch(`http://127.0.0.1:${s2.address().port}/api/lean/naloge/${id}`);
    assert.equal((await r.json()).stanje, "queued");
    assert.equal((await fetch(`http://127.0.0.1:${s2.address().port}/api/lean/naloge/ln_nic`)).status, 404);
  } finally {
    s2.close();
  }
});

// ---------- zanka delavca z lažnim lake in lažnim strežnikom ----------
const izpisi = (v) => `cat <<'KONEC'\n${v}\nKONEC`;
function lazenLake(dir, ime, telo) {
  const p = `${dir}/${ime}`;
  fs.writeFileSync(p, `#!/bin/sh\n${telo}\n`, { mode: 0o755 });
  return p;
}
// živ = obstaja in ni zombi (ubit proces brez starša lahko nekaj časa ostane zombi)
const ziv = (pid) => {
  try {
    return !/^\d+ \(.*\) Z/.test(fs.readFileSync(`/proc/${pid}/stat`, "utf8"));
  } catch {
    return false;
  }
};

test("lean delavec: lažen lake – dokaz, napaka zagona, rok ubije celo drevo procesov", { skip: process.platform === "win32" }, async () => {
  const dir = fs.mkdtempSync("/tmp/lean-lake-");
  const n = { projekt: dir, pomnilnikMB: 2048, rokS: 30 };
  const t = "(2:ℝ) + 2 = 4";
  n.lake = lazenLake(dir, "ok", izpisi(sp(5, "information", `'${ime(0)}' does not depend on any axioms`)));
  assert.equal((await preveriZLean(t, n)).izid, "proved");
  n.lake = lazenLake(dir, "glava", `${izpisi(sp(1, "error", "object file Mathlib.olean does not exist"))}\nexit 1`);
  assert.equal((await preveriZLean(t, n)).izid, "napaka", "zastarel Mathlib ni »failed«");
  n.lake = `${dir}/ni-izvedljiv`;
  fs.writeFileSync(n.lake, "x", { mode: 0o644 });
  const z = await preveriZLean(t, n);
  assert.equal(z.izid, "napaka", "napaka zagona (EACCES)");
  assert.doesNotMatch(z.sporocilo, new RegExp(dir), "brez poti");
  n.lake = `${dir}/ni-ga`;
  assert.equal((await preveriZLean(t, n)).izid, "napaka", "lake manjka");
  assert.equal((await preveriZLean("True\n#eval 1", n)).izid, "rejected");
  // lake zažene otroka (kot lean), ki drži stdout: rok mora ubiti oba
  n.lake = lazenLake(dir, "visi", `sleep 1000 & echo $! > "${dir}/otrok"; echo $$ > "${dir}/oce"; wait`);
  const zac = Date.now();
  const r = await preveriZLean(t, n, 1);
  assert.equal(r.izid, "timeout");
  assert.ok(Date.now() - zac < 10000, "ne čaka otroka");
  await new Promise((res) => setTimeout(res, 200));
  for (const f of ["oce", "otrok"]) assert.equal(ziv(Number(fs.readFileSync(`${dir}/${f}`, "utf8"))), false, `${f} ubit`);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("lean delavec: zanka – 409 po izidu ne ustavi dela, napaka namestitve in omrežje → premor", { skip: process.platform === "win32" }, async () => {
  const dir = fs.mkdtempSync("/tmp/lean-zanka-");
  nastaviMapo(dir);
  const klici = [];
  let rezultat = 200;
  const app = express();
  app.use(express.json());
  app.post("/api/lean/delavec/:pot", (req, res) => {
    klici.push([req.params.pot, req.body]);
    if (req.params.pot === "naloga") return res.json({ id: `ln_${"1".repeat(32)}`, trditev: "(2:ℝ) + 2 = 4", najem: "2".repeat(32), rokMs: 600000 });
    if (req.params.pot === "rezultat") return res.status(rezultat).json({});
    res.json({ ok: true });
  });
  const s = app.listen(0);
  const n = { streznik: `http://127.0.0.1:${s.address().port}`, zeton: ZETON, projekt: dir, pomnilnikMB: 2048, rokS: 30, utripS: 60 };
  try {
    n.lake = lazenLake(dir, "ok", izpisi(sp(5, "information", `'${ime(0)}' does not depend on any axioms`)));
    assert.equal(await enKrog(n), true);
    assert.equal(klici.at(-1)[1].izid, "proved");
    rezultat = 409;
    assert.equal(await enKrog(n), true, "409 (najem potekel): izid zavržen, brez napake");
    rezultat = 200;
    n.lake = `${dir}/ni-ga`;
    await assert.rejects(enKrog(n), /ni pripravljen/, "napaka namestitve → premor");
    assert.equal(klici.at(-1)[1].izid, "napaka", "strežnik dobi »napaka«, ne »failed«");
    assert.ok(fs.existsSync(`${dir}/stanje.json`) && !fs.readdirSync(dir).some((f) => f.endsWith(".tmp")));
  } finally {
    s.close();
  }
  await assert.rejects(enKrog(n), /fetch failed|ECONNREFUSED/, "strežnik ni dosegljiv");
  assert.deepEqual([0, 30, 60, 120, 240, 300].map(naslednjiPremor), [30, 60, 120, 240, 300, 300]);
  fs.rmSync(dir, { recursive: true, force: true });
});
