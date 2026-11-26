// K-10 (primerjava priprave na test z Astra AI): nabor 10 kompletov je popoln, pasti so v zapiskih dobesedno (mesto, ki ga
// ocenjevalec išče, res obstaja) in skripta Evklidove strani v preizkusnem načinu prehodi komplet do konca brez klica AI.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = path.join(import.meta.dirname, "..");
const DIR = path.join(ROOT, "test/fixtures/priprava/k10");
const exp = JSON.parse(fs.readFileSync(path.join(DIR, "pricakovano.json"), "utf8"));

test("K-10 nabor: 10 kompletov, vsak z zapiski, temami in pastmi, ki so v zapiskih dobesedno", () => {
  assert.equal(exp.kompleti.length, 10);
  assert.deepEqual(exp.merila, ["pokritost", "pravilnost", "zvestoba", "nacrt", "cas"]);
  const datoteke = fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).sort();
  assert.deepEqual(datoteke, exp.kompleti.map((k) => `${k.id}.md`).sort());
  const vrste = new Set();
  for (const k of exp.kompleti) {
    const zap = fs.readFileSync(path.join(DIR, `${k.id}.md`), "utf8");
    assert.ok(k.teme.length >= 5, `${k.id}: premalo tem`);
    assert.ok(k.pasti.length >= 1, `${k.id}: brez pasti`);
    for (const p of k.pasti) {
      vrste.add(p.vrsta);
      assert.ok(p.mesta.length >= 1 && p.pravilno, `${k.id}: past brez mesta ali pravilnega`);
      for (const m of p.mesta) assert.ok(zap.includes(m), `${k.id}: »${m}« ni v zapiskih`);
    }
    if (k.pot) assert.ok(Array.isArray(k.sklopi) && k.sklopi.length, `${k.id}: sklopi`);
  }
  // Vse vrste pasti so zastopane: negotovo branje, napaka v zapiskih, nasprotje virov, navodilo v besedilu.
  for (const v of ["negotovo", "napaka", "nasprotje", "napad"]) assert.ok(vrste.has(v), v);
  // Pet predmetov in obe šoli.
  assert.deepEqual([...new Set(exp.kompleti.map((k) => k.predmet))].sort(), ["BIO", "FIZ", "KEM", "MAT", "ZGO"]);
  assert.ok(exp.kompleti.some((k) => k.raven.startsWith("OŠ")));
});

test("K-10 skripta: preizkusni način prehodi komplet (teme, 6 nalog kviza s ključem, načrt), brez klica AI", () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "k10-"));
  const env = { ...process.env, EVKLID_MERI_IZID: path.join(out, "evklid.json"), ANTHROPIC_API_KEY: "", ANTHROPIC_AUTH_TOKEN: "", EVKLID_MOCK: "" };
  const r = spawnSync(process.execPath, ["--disable-warning=ExperimentalWarning", "scripts/meri-k10-priprava.mjs", "--preizkus", "--samo", "03-mat-os9-linearna,10-zgo-prva-svetovna"], { cwd: ROOT, env, encoding: "utf8", timeout: 120000 });
  try {
    assert.equal(r.status, 0, r.stderr + r.stdout);
    const izid = JSON.parse(fs.readFileSync(path.join(out, "evklid.json"), "utf8"));
    assert.equal(izid.usd, 0);
    const [lin, zgo] = izid.izidi;
    assert.ok(lin.teme.length >= 1 && lin.pokritost);
    assert.equal(lin.kviz.length, 6);
    assert.ok(lin.kviz.every((q) => q.besedilo && q.odgovor !== ""));
    assert.ok(lin.nacrt.dni >= 1);
    assert.ok(lin.razlage.every((x) => x.izpusceno === "preizkus"));
    // Zgodovina nima učnega načrta v Evklidu: brez obsega in brez kviza (pošteno zapisano, ne izpuščeno).
    assert.equal(zgo.obseg, null);
    assert.equal(zgo.kvizNi, "kviz_brez_tem");
    assert.ok(fs.readFileSync(path.join(out, "evklid-03-mat-os9-linearna.md"), "utf8").includes("## Vprašanja prvega kviza"));
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test("K-10 skripta: privzeti izid je med datotekami, ki jih Meritev naloži kot artefakt", () => {
  // Meritev (.github/workflows/meri.yml) naloži samo meri.log in data/meri-*.json; drugje bi se plačane razlage izgubile.
  const wf = fs.readFileSync(path.join(ROOT, ".github/workflows/meri.yml"), "utf8");
  assert.match(wf, /^\s+data\/meri-\*\.json$/m);
  const skripta = fs.readFileSync(path.join(ROOT, "scripts/meri-k10-priprava.mjs"), "utf8");
  const privzeto = /EVKLID_MERI_IZID \|\| path\.join\(ROOT, "([^"]+)"\)/.exec(skripta)?.[1];
  assert.match(privzeto, /^data\/meri-[a-z0-9-]+\.json$/);
});
