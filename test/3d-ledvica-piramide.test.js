// Naslikane ledvične piramide iz izpisa izvoza (scripts/atlas/ledvica-piramide.mjs): po ena piramida na čašo,
// vrh v čaši, os proti skorji, dolžina znotraj ledvice; zapis v ledvica.json je ponovljiv iz izpisa izvoza.
// Zagon: node --test test/3d-ledvica-piramide.test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const j = JSON.parse(fs.readFileSync(path.join(KOREN, "public/3d/modeli/organi-3d/ledvica.json"), "utf8"));

test("ledvica-piramide: suhi zagon iz izpisa izvoza da sedem piramid s smiselnimi dolžinami", () => {
  const izpis = execFileSync("node", [path.join(KOREN, "scripts/atlas/ledvica-piramide.mjs"), path.join(KOREN, "test/fixtures/ledvica-izvoz.log"), "--suho"], { encoding: "utf8" });
  const v = [...izpis.matchAll(/^([a-z]) ([-\d.]+), ([-\d.]+), ([-\d.]+) do obrisa ([\d.]+) mm → dolžina ([\d.]+)/gm)];
  assert.equal(v.length, 7);
  const sez = j.tkiva.skorja.rezPiramide.seznam;
  assert.equal(sez.length, 7);
  v.forEach((m, i) => {
    const dol = +m[6], dob = +m[5];
    assert.ok(dol >= 7.5 && dol <= 19.5, `dolžina ${m[1]}: ${dol}`);
    assert.ok(dob > dol, `piramida ${m[1]} ostane znotraj obrisa`);
    // zapis v JSON ustreza izpisu (ponovljivost)
    assert.ok(Math.abs(sez[i][0] * 1000 - +m[2]) < 0.06 && Math.abs(sez[i][1] * 1000 - +m[3]) < 0.06, `vrh ${m[1]}`);
    assert.ok(Math.abs(sez[i][6] * 1000 - dol) < 0.06, `dolžina ${m[1]} v JSON`);
  });
});

test("ledvica-piramide: stožci v JSON – enotske osi v ravnini reza, enaki za skorjo in ovojnico", () => {
  const sez = j.tkiva.skorja.rezPiramide.seznam, rv = j.prerez.ravnine[0];
  assert.deepEqual(j.tkiva.ovojnica.rezPiramide.seznam, sez);
  for (const c of sez) {
    assert.ok(Math.abs(Math.hypot(c[3], c[4]) - 1) < 1e-3 && c[5] === 0);
    assert.ok(Math.abs(c[2] * rv.n[2] + rv.d) < 2e-5, "vrh leži v ravnini reza");
  }
  // sosednji vrhovi so narazen (med piramidami ostane ledvični steber)
  for (let a = 0; a < sez.length; a++) for (let b = a + 1; b < sez.length; b++)
    assert.ok(Math.hypot(sez[a][0] - sez[b][0], sez[a][1] - sez[b][1]) > 0.005, `vrhova ${a} in ${b}`);
});

test("ledvica m2: zareza hilusa v ravnini reza, meh odprt v sečevod brez pregrade, mat žilni debli", () => {
  const sin = j.tkiva.ovojnica.rezPiramide.sinus, rv = j.prerez.ravnine[0];
  assert.ok(sin.zareza.length === 8 || sin.zareza.length === 9); // m4: neobvezna 9. vrednost »do«
  for (const i of [2, 5]) assert.ok(Math.abs(sin.zareza[i] * rv.n[2] + rv.d) < 2e-5, "zareza leži v ravnini reza");
  assert.ok(Math.hypot(sin.zareza[3] - sin.zareza[0], sin.zareza[4] - sin.zareza[1]) > 0.02, "zareza sega čez ves hilus");
  assert.ok(j.tkiva.meh.rezPresek.skleni >= 0.004 && j.tkiva.meh.rezPresek.skleniBrezRoba === true);
  for (const t of ["arterija", "vena"]) assert.ok(j.tkiva[t].lak <= 0.25 && j.tkiva[t].hrap >= 0.45, `${t} ni lakirana`);
  const organ = fs.readFileSync(path.join(KOREN, "public/3d/organ.js"), "utf8");
  assert.match(organ, /function zarezaSinusa\(/);
  assert.match(organ, /skleniBrezRoba: !!t\.rezPresek\.skleniBrezRoba/);
  const izvoz = fs.readFileSync(path.join(KOREN, "scripts/atlas/izvozi-organe.py"), "utf8");
  assert.match(izvoz, /secevod_stik/);
  assert.match(izvoz, /stik meha in sečevoda: odstranjenih/);
});

test("ledvica m3: žilni debli prerezani v ravnini reza, ločne žile ob piramidah, ožji vratovi čaš, nadledvičnica s skorjo in sredico", () => {
  const drevesa = fs.readFileSync(path.join(KOREN, "scripts/atlas/drevesa.py"), "utf8");
  assert.match(drevesa, /nast\.get\("v_ravnini", True\)/);
  assert.match(drevesa, /_zile_brez_odmika/);
  const izvoz = fs.readFileSync(path.join(KOREN, "scripts/atlas/izvozi-organe.py"), "utf8");
  assert.match(izvoz, /vrat_r=0\.0019/);
  // debli se v prerezu režeta (prej brezReza: cela valja čez ploskev reza)
  for (const t of ["arterija", "vena"]) assert.ok(!j.tkiva[t].brezReza, `${t} se reže`);
  for (const t of ["skorja", "ovojnica"]) {
    const l = j.tkiva[t].rezPiramide.locne;
    assert.ok(l && l.odmik > 0 && l.razmik > 0 && l.sirina > 0 && l.sirina < 0.0004, `${t} ima ločne žile`);
    assert.ok(/^#/.test(l.arterija) && /^#/.test(l.vena) && l.arterija !== l.vena);
  }
  const n = j.tkiva.nadledvicna;
  assert.ok(n.rezPresek.polno === true && n.rezPresek.robBarva && n.rezPresek.robBarva !== n.rez, "rumena skorja, rjava sredica");
  assert.ok(j.tkiva.ovojnica.lak === 0 && j.tkiva.ovojnica.hrap >= 0.7, "ovojnica ni lakirana");
  const organ = fs.readFileSync(path.join(KOREN, "public/3d/organ.js"), "utf8");
  assert.match(organ, /pir\.locne/);
  assert.match(organ, /locne: null/); // učne barve: brez žilnih črt
});

test("ledvica m4: žili sta zlito votlo drevo z vejami (svetlina je luknja obrisa), polmesečasta nadledvičnica, sečevod v ravnini reza", async () => {
  const { NodeIO } = await import("@gltf-transform/core");
  const { ALL_EXTENSIONS } = await import("@gltf-transform/extensions");
  const { zankePreseka, ploscina } = await import("../public/3d/organ-presek.js");
  const { preberi } = await import("../scripts/atlas/zile-mreza.mjs");
  const drevesa = fs.readFileSync(path.join(KOREN, "scripts/atlas/drevesa.py"), "utf8");
  assert.match(drevesa, /def zlij_cevi\(/);
  assert.match(drevesa, /nast\.get\("veje_sinus", True\)/);
  const izvoz = fs.readFileSync(path.join(KOREN, "scripts/atlas/izvozi-organe.py"), "utf8");
  assert.match(izvoz, /def nadledvicnica_lastna\(/);
  assert.match(izvoz, /dodaj=\["ledvicni_meh", "ledvicne_zile", "nadledvicnica_lastna"\]/);
  assert.match(izvoz, /secevod_globina=0\.0/);
  const organ = fs.readFileSync(path.join(KOREN, "public/3d/organ.js"), "utf8");
  assert.match(organ, /t\.rezPresek\.cev\?\.zleb \|\| t\.rezPresek\.zleb/);
  for (const t of ["arterija", "vena"]) assert.ok(j.tkiva[t].rezPresek.zleb && j.tkiva[t].rezPresek.luknjaBarva, `${t}: odprta svetlina v rezu`);
  assert.ok(j.tkiva.meh.rezVotlina.lak > 0 && j.tkiva.meh.rezVotlina.sencaMoc >= 0.75, "notranjost meha ni ploska");
  const rv = j.prerez.ravnine[0];
  for (const f of ["ledvica.glb", "ledvica-telefon.glb"]) {
    const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(path.join(KOREN, "public/3d/modeli/organi-3d", f));
    let zil = 0;
    for (const node of doc.getRoot().listNodes()) {
      if (!node.getMesh() || !/^Renal (artery|vein) \(lastno\)/.test(node.getName())) continue;
      zil++;
      const m = preberi(node, node.getMesh().listPrimitives()[0]);
      const { zanke } = zankePreseka(m.P, m.F, rv.n, rv.d, 1e-6, 0);
      const pl = zanke.map((z) => ploscina(z));
      const naj = Math.max(...pl.map(Math.abs));
      // zunanji obris debla in v njem svetlina (druga največja zanka), ki sega skoraj po vsej dolžini: prerezana vzdolž
      const ur = pl.map(Math.abs).sort((x, y) => y - x);
      assert.ok(ur.length >= 2 && ur[0] === naj && ur[1] > 0.3 * naj, `${f}: ${node.getName()} ploščine ${pl.map((p) => (p * 1e6).toFixed(1))}`);
    }
    assert.equal(zil, 2, f);
    // nadledvičnica: polmesec (dolga in ploska), ne kapa: razmerje najdaljša / najkrajša stranica škatle
    const nad = doc.getRoot().listNodes().find((n) => n.getMesh() && /^Suprarenal/.test(n.getName()));
    const P = preberi(nad, nad.getMesh().listPrimitives()[0]).P;
    const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
    for (let i = 0; i < P.length; i++) { lo[i % 3] = Math.min(lo[i % 3], P[i]); hi[i % 3] = Math.max(hi[i % 3], P[i]); }
    const d = hi.map((x, i) => x - lo[i]).sort((a, b) => a - b);
    assert.ok(d[2] / d[0] > 3 && d[0] < 0.012, `${f}: nadledvičnica ${d.map((x) => (x * 1000).toFixed(1))} mm`);
  }
});
