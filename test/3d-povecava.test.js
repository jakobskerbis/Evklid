// »Poglej pod povečavo« (docs/3d.md): deli organov z `povecava` kažejo na obstoječ model, gumb ima prevod v vseh jezikih,
// pregledovalnik ga pokaže samo, ko stran da opts.povecava, stran pa odpre cilj z novim vnosom v zgodovini (Nazaj vrne na organ).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sl from "../public/i18n/sl.js";
import { naloziThree } from "./fixtures/3d-modeli.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODELI = path.join(ROOT, "public", "3d", "modeli");
const THREE = await naloziThree();

async function vsiId() {
  const ids = new Set();
  for (const p of fs.readdirSync(MODELI)) {
    const f = path.join(MODELI, p, "index.js");
    if (fs.existsSync(f)) for (const e of (await import(f)).default) ids.add(e.id);
  }
  return ids;
}

test("povečava: deli organov iz GLB kažejo na obstoječe modele", async () => {
  const ids = await vsiId();
  const povezave = [];
  for (const f of fs.readdirSync(path.join(MODELI, "organi-3d")).filter((x) => x.endsWith(".json"))) {
    const d = JSON.parse(fs.readFileSync(path.join(MODELI, "organi-3d", f), "utf8"));
    for (const del of d.deli || []) if (del.povecava) {
      assert.ok(ids.has(del.povecava), `${f}/${del.id}: povecava ${del.povecava} ne obstaja`);
      povezave.push(`${f.replace(".json", "")}/${del.id}`);
    }
  }
  for (const p of ["oko/mreznica", "srce/levi-prekat", "mozgani/celni"]) assert.ok(povezave.includes(p), `manjka povezava ${p}`);
});

test("povečava: prerezi tkiv imajo veljavne povezave, mrežnica vodi do paličic in čepkov", { skip: !THREE && "three ni nameščen" }, async () => {
  const ids = await vsiId();
  const organi = (await import(path.join(MODELI, "organi", "index.js"))).default;
  for (const e of organi) {
    const mod = await import(path.join(MODELI, "organi", e.pot));
    if (typeof mod.organ === "string" || mod.izDatotek) continue;
    const m = mod.zgradi(THREE, { kakovost: "nizka", gibanje: false });
    for (const d of m.deli) if (d.povecava) assert.ok(ids.has(d.povecava), `${e.id}/${d.id}: ${d.povecava}`);
    if (e.id === "organ-mreznica") {
      for (const id of ["palicice", "cepki"]) assert.equal(m.deli.find((d) => d.id === id)?.povecava, "celica-palicica-cepek", id);
      // rumena pega: samo čepki, povezava ostane
      m.nadzor.find((c) => c.id === "mesto").ob("pega");
      assert.ok(!m.deli.some((d) => d.id === "palicice"));
      assert.equal(m.deli.find((d) => d.id === "cepki")?.povecava, "celica-palicica-cepek");
    }
    if (e.id === "organ-mesicki") assert.equal(m.deli.find((d) => d.id === "eritrociti")?.povecava, "celica-eritrocit");
    m.dispose?.();
  }
});

test("povečava: gumb ima besedilo v vseh jezikih, pregledovalnik in stran ga povežeta z zgodovino", () => {
  assert.equal(sl["a3.magnify"], "Poglej pod povečavo");
  const ui = path.join(ROOT, "public", "i18n", "ui");
  for (const f of fs.readdirSync(ui).filter((x) => x.endsWith(".json"))) {
    const v = JSON.parse(fs.readFileSync(path.join(ui, f), "utf8"))["a3.magnify"];
    assert.ok(v && v !== sl["a3.magnify"], `${f}: a3.magnify`);
  }
  const preg = fs.readFileSync(path.join(ROOT, "public", "3d", "pregledovalnik.js"), "utf8");
  assert.match(preg, /d\.povecava && typeof opts\.povecava === "function"/, "gumb samo, ko ga stran podpira (lekcije ne zapustijo strani)");
  assert.match(preg, /t\("a3\.magnify"\)/);
  const stran = fs.readFileSync(path.join(ROOT, "public", "3d", "stran.js"), "utf8");
  assert.match(stran, /history\.pushState\(\{ k3Iz: "povecava" \}/, "povečava doda vnos v zgodovino");
  assert.match(stran, /if \(history\.state\?\.k3Iz\) history\.back\(\)/, "Nazaj se vrne na organ");
  assert.match(fs.readFileSync(path.join(ROOT, "public", "3d", "organ.js"), "utf8"), /povecava: x\.d\.povecava/, "organ.js prenese povecava iz JSON");
});
