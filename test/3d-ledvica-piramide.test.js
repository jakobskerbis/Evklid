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
  assert.equal(sin.zareza.length, 8);
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
