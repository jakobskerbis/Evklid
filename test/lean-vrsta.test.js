// Vrsta preverjanj z Lean in delavec (docs/lean.md, L5): filter trditve, predloga in branje izpisa Leana, vrsta v bazi
// (najem, potek, čiščenje), poti delavca z žetonom (404 brez žetona, 401, 429, 4xx ob neveljavnem vhodu).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import express from "express";
import { preveriTrditev, TAKTIKE, NAJVEC_ZNAKOV } from "../scripts/lean-delavec/trditev.mjs";
import { predloga, preberiIzpis, ocistiSporocilo, ime } from "../scripts/lean-delavec/lean.mjs";
import { naloziNastavitve } from "../scripts/lean-delavec/delavec.mjs";
import { createLeanVrsta, mountLeanDelavec, mountLeanBranje, dokazIzLean, leanToken } from "../server/lean-vrsta.js";
import { statusTrditve } from "../public/preverjanje/trditev.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const ZETON = "a".repeat(40);

test("lean filter: spusti matematične trditve", () => {
  for (const s of [
    "(2:ℝ) + 2 = 4",
    "∀ x : ℝ, (x + 1)^2 = x^2 + 2*x + 1",
    "∀ n : ℕ, ∑ i ∈ Finset.range (n + 1), i = n * (n + 1) / 2",
    "Real.sqrt 4 = 2",
    "∀ a b : ℝ, 0 ≤ a → 0 ≤ b → a * b ≥ 0",
    "∀ x : ℝ, x ≠ 0 → x⁻¹ * x = 1",
    "Nat.Prime 7",
    "∃ x : ℤ, 3 * x = 12",
    "∀ x : ℝ, |x| ≥ 0",
    "∀ x₁ x_2 : ℚ, x₁ + x_2 = x_2 + x₁",
    "deriv (fun x : ℝ => x ^ 2) 3 = 6",
    "∀ x : ℝ, sin x ^ 2 + cos x ^ 2 = 1",
    "(10 : ℕ) % 3 = 1",
    "  1 + 1 = 2  ",
  ])
    assert.equal(preveriTrditev(s).ok, true, s);
  assert.equal(preveriTrditev("  1 + 1 = 2 ").trditev, "1 + 1 = 2");
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
  const v = f.trimEnd().split("\n");
  assert.equal(v[0], "import Mathlib");
  assert.equal(v.length, 3 + 2 * TAKTIKE.length);
  assert.equal(v[3], "theorem evklid_t1 : (2:ℝ) + 2 = 4 := by intros; norm_num");
  assert.equal(v[4], "#print axioms evklid_t1");
  assert.ok(!TAKTIKE.includes("polyrith") && !TAKTIKE.includes("native_decide"));
  assert.throws(() => predloga("True\n#eval 1"), /zavrnjena/);
  assert.throws(() => predloga("1 = 1", ["polyrith"]), /ni dovoljena/);
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
  const r = preberiIzpis([sp(4, "error", "unsolved goals\n⊢ False"), "{nepopoln"].join("\n"));
  assert.equal(r.izid, "failed");
  assert.match(r.sporocilo, /unsolved goals/);
  assert.equal(preberiIzpis("").izid, "failed");
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
  assert.throws(() => v.vpisi("1 = 1", "racun", { ucenec: 5 }), /samo trditev/);
  assert.deepEqual(v.vpisi("1 = 1", "neznano"), { napaka: "neznana vrsta" });
  assert.ok(v.vpisi("True\n#eval 1", "racun").napaka);
  const a = v.vpisi("1 + 1 = 2", "racun");
  assert.match(a.id, /^ln_[0-9a-f]{32}$/);
  assert.deepEqual(v.vpisi(" 1 + 1 = 2", "racun"), { id: a.id, obstaja: true });
  assert.notEqual(v.vpisi("1 + 1 = 2", "identiteta").id, a.id);
  assert.deepEqual(v.vpisi("2 + 2 = 4", "racun"), { napaka: "vrsta je polna" });
  const r = v.rezultat(a.id);
  assert.deepEqual(r, { id: a.id, vrsta: "racun", stanje: "queued", koncano: false });
  assert.equal(v.rezultat("ln_x"), null);
  assert.equal(v.rezultat({}), null);
  const stolpci = db.prepare("PRAGMA table_info(lean_naloge)").all().map((c) => c.name);
  for (const s of stolpci) assert.doesNotMatch(s, /student|parent|ucen|email|ime_/i, "brez stolpcev z osebnimi podatki");
});

test("lean vrsta: najem, potek najema, ponovni vpis, timeout po poskusih, čiščenje", () => {
  let t = 1_000_000;
  const { db } = openDb(":memory:");
  const v = createLeanVrsta(db, { now: () => t, meje: { najemMs: 1000, poskusov: 2, cakaMs: 50_000, hraniDni: 1 } });
  const { id } = v.vpisi("1 + 1 = 2", "racun");
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
  const b = v.vpisi("2 + 2 = 4", "racun").id;
  t += 50_001;
  v.pocisti();
  assert.equal(v.rezultat(b).stanje, "timeout", "nepobrana naloga po roku");
  assert.match(v.rezultat(b).sporocilo, /ni bil dosegljiv/);
  t += 86_400_001;
  v.pocisti();
  assert.equal(v.rezultat(id), null, "stare naloge izbrisane");
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
  const d = dokazIzLean({ ...r }, "(2:ℝ) + 2 = 4");
  assert.equal(d.dokazi[0].motor, "lean");
  assert.equal(statusTrditve(d.dokazi, "racun", d.dokaz), "delno", "brez popolnosti ni »dokazano«");
  const p = dokazIzLean(r, "(2:ℝ) + 2 = 4", { complete: "na" });
  assert.equal(statusTrditve(p.dokazi, "racun", p.dokaz), "dokazano");
  for (const stanje of ["failed", "timeout", "rejected", "queued", "leased"]) assert.equal(dokazIzLean({ ...r, stanje }, "x = x"), null, `${stanje} ni »ne drži«`);
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
    const { id } = v.vpisi("1 + 1 = 2", "racun");
    r = await post("naloga", {});
    assert.equal(r.status, 200);
    const n = await r.json();
    assert.deepEqual(Object.keys(n).sort(), ["id", "najem", "rokMs", "trditev"]);
    assert.equal(n.trditev, "1 + 1 = 2");
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
      assert.equal((await post("naloga", {}, ZETON)).status, 429, "tudi pravilen žeton po preveč napačnih");
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
    const { id } = app.locals.leanVrsta.vpisi("1 + 1 = 2", "racun");
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
    const { id } = v.vpisi("1 + 1 = 2", "racun");
    const r = await fetch(`http://127.0.0.1:${s2.address().port}/api/lean/naloge/${id}`);
    assert.equal((await r.json()).stanje, "queued");
    assert.equal((await fetch(`http://127.0.0.1:${s2.address().port}/api/lean/naloge/ln_nic`)).status, 404);
  } finally {
    s2.close();
  }
});
