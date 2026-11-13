// Lastna geometrija organov iz izvoza (scripts/atlas/drevesa.py, jetra_geometrija.py; 2026-11-12):
// – jetra: ena površina, razdeljena na štiri zaprte režnje, spodnja votla vena, srpasta in obla vez, drevesa portalne
//   triade in jetrnih ven;
// – pljuča: režnji so zaprta telesa, veje bronhijev in žil v pljučih so zaprte cevi iz središčnic;
// – ledvica: lastna ledvična vena in arterija z zaprtim prerezanim koncem.
// Test bere objavljene GLB-je in JSON; Python del preveri samo skladnjo (bpy na strežniku za teste ni nujno nameščen).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { preveriGLB } from "../scripts/atlas/preveri-mreze.mjs";

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORGANI = path.join(KOREN, "public", "3d", "modeli", "organi-3d");
const json = (o) => JSON.parse(fs.readFileSync(path.join(ORGANI, `${o}.json`), "utf8"));
const deli = (dat) => preveriGLB(path.join(ORGANI, dat));
const najdi = (d, ime) => { const r = d.find((x) => x.ime === ime); assert.ok(r, `manjka vozlišče »${ime}«`); return r; };

const REZNJI = ["Right lobe of liver (lastno)", "Left lobe of liver (lastno)", "Quadrate lobe of liver (lastno)", "Caudate lobe of liver (lastno)"];
const JETRA_OSTALO = ["Inferior vena cava (lastno)", "Falciform ligament (lastno)", "Round ligament of liver (lastno)",
  "Hepatic portal vein and branches (lastno)", "Hepatic artery and branches (lastno)", "Bile ducts (lastno)", "Hepatic veins (lastno)", "Gallbladder"];

for (const dat of ["jetra.glb", "jetra-telefon.glb"]) {
  test(`geometrija organov: ${dat} ima štiri režnje ene površine, votlo veno, vezi in drevesa`, async () => {
    const d = await deli(dat);
    assert.equal(d.length, REZNJI.length + JETRA_OSTALO.length, "jetra nimajo več ločenih segmentov Z-Anatomy");
    for (const ime of REZNJI) {
      const r = najdi(d, ime);
      // reženj je zaprto telo: po šivanju mej sme ostati kvečjemu drobna plavut (≤ 2 robova)
      assert.ok(r.odprtiRobovi <= 2 && r.luknje <= 1, `${ime}: odprti robovi ${r.odprtiRobovi}, luknje ${r.luknje}`);
      assert.equal(r.navznoter, 0, `${ime}: obrnjen navznoter`);
    }
    for (const ime of JETRA_OSTALO) najdi(d, ime);
    for (const ime of ["Hepatic portal vein and branches (lastno)", "Hepatic artery and branches (lastno)", "Bile ducts (lastno)", "Hepatic veins (lastno)"]) {
      const r = najdi(d, ime);
      assert.equal(r.odprtiRobovi, 0, `${ime}: cevi drevesa so zaprte`);
    }
    const tris = d.reduce((s, x) => s + x.trikotniki, 0);
    assert.ok(tris <= (dat.includes("telefon") ? 90_000 : 300_000), `${dat}: ${tris} trikotnikov`);
  });
}

test("geometrija organov: jetra.json opisuje nove dele in prerez pusti drevesa cela", () => {
  const j = json("jetra");
  const po = Object.fromEntries(j.deli.map((x) => [x.id, x]));
  for (const id of ["spodnja-votla-vena", "srpasta-vez", "obla-vez"]) {
    assert.ok(po[id], `manjka del ${id}`);
    for (const k of ["ime", "la", "opisOs", "opis", "opisStudij"]) assert.ok(po[id][k] && po[id][k].length > 3, `${id}.${k}`);
    assert.ok(po[id].vozlisca?.length, `${id} nima vozlišč`);
  }
  for (const t of ["portalna", "arterija", "vena", "zolcevod"]) {
    assert.equal(j.tkiva[t].brezReza, true, `tkivo ${t} se v prerezu ne reže`);
    assert.equal(j.tkiva[t].rezPresek, undefined, `tkivo ${t} nima pokrova prereza`);
  }
  assert.deepEqual(j.pogledi.prerez.skrijDele, ["srpasta-vez", "obla-vez"]);
});

for (const dat of ["pljuca.glb", "pljuca-telefon.glb"]) {
  test(`geometrija organov: ${dat} ima zaprte režnje in zaprte veje iz središčnic`, async () => {
    const d = await deli(dat);
    const rezn = d.filter((x) => /lobe of (left|right) lung$/.test(x.ime));
    assert.equal(rezn.length, 5);
    for (const r of rezn) {
      // hilusna odprtina Z-Anatomy je imela več deset robov; po zapiranju sme ostati kvečjemu drobna špranja
      assert.ok(r.odprtiRobovi <= 2, `${r.ime}: reženj ni zaprt (hilusna odprtina?), odprtih robov ${r.odprtiRobovi}`);
      assert.equal(r.navznoter, 0, r.ime);
    }
    const veje = d.filter((x) => /segment|of (left|right) lung$/.test(x.ime) && !/lobe of/.test(x.ime));
    assert.ok(veje.length >= 40, `veje v pljučih: ${veje.length}`);
    for (const v of veje) assert.equal(v.odprtiRobovi, 0, `${v.ime}: cev ni zaprta`);
    const tris = d.reduce((s, x) => s + x.trikotniki, 0);
    assert.ok(tris <= (dat.includes("telefon") ? 90_000 : 300_000), `${dat}: ${tris} trikotnikov`);
  });
}

test("geometrija organov: pljuca.json v prerezu pusti dihalno in žilno drevo celo", () => {
  const j = json("pljuca");
  for (const t of ["dihalna", "dihalna-v", "pljucna-arterija", "pljucna-arterija-v", "pljucna-vena", "pljucna-vena-v"]) {
    assert.equal(j.tkiva[t].brezReza, true, t);
    assert.equal(j.tkiva[t].rezPresek, undefined, t);
  }
});

for (const dat of ["ledvica.glb", "ledvica-telefon.glb"]) {
  test(`geometrija organov: ${dat} ima lastno ledvično veno in arterijo brez odprtega obroča`, async () => {
    const d = await deli(dat);
    for (const ime of ["Renal vein (lastno)", "Renal artery (lastno)"]) {
      const r = najdi(d, ime);
      assert.equal(r.odprtiRobovi, 0, `${ime}: odprt konec`);
      assert.equal(r.navznoter, 0, ime);
    }
    assert.ok(!d.some((x) => /^(Left|Right) renal (vein|artery)$/.test(x.ime)), "stara žila Z-Anatomy je še v datoteki");
  });
}

test("geometrija organov: slika prereza malih možganov obstaja in je vezana na črva in deblo", () => {
  const j = json("mozgani");
  for (const t of ["mali", "deblo"]) {
    const s = j.tkiva[t].rezSlika;
    assert.equal(s.slika, "mozgani-mali-rez.webp");
    assert.equal(s.lo.length, 2); assert.equal(s.mera.length, 2);
  }
  const v = fs.statSync(path.join(ORGANI, "mozgani-mali-rez.webp")).size;
  assert.ok(v > 40_000 && v < 400_000, `velikost slike ${v}`);
});

test("geometrija organov: Python orodja se prevedejo in izvoz jih kliče", (t) => {
  const py = spawnSync("python3", ["--version"]);
  const izvoz = fs.readFileSync(path.join(KOREN, "scripts", "atlas", "izvozi-organe.py"), "utf8");
  for (const fn of ["pljucna_drevesa", "ledvicne_zile", "jetra_deli", "uveljavi_normale"]) assert.ok(izvoz.includes(fn), fn);
  if (py.status !== 0) return t.skip("python3 ni na voljo");
  for (const f of ["drevesa.py", "jetra_geometrija.py", "mali-mozgani-rez.py"]) {
    const src = path.join(KOREN, "scripts", "atlas", f);
    const r = spawnSync("python3", ["-c", "import ast,sys; ast.parse(open(sys.argv[1], encoding='utf8').read())", src]);
    assert.equal(r.status, 0, `${f}: ${r.stderr}`);
  }
});

for (const dat of ["mozgani.glb", "mozgani-telefon.glb"]) {
  test(`geometrija organov: ${dat} – režnji skorje ene poloble so ena površina brez razpok`, async () => {
    const { NodeIO } = await import("@gltf-transform/core");
    const { ALL_EXTENSIONS } = await import("@gltf-transform/extensions");
    const { analiziraj } = await import("../scripts/atlas/preveri-mreze.mjs");
    const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(path.join(ORGANI, dat));
    for (const stran of ["l", "r"]) {
      const P = [], I = [];
      let kosov = 0;
      for (const node of doc.getRoot().listNodes()) {
        if (!node.getMesh() || !node.getName().endsWith(`(MRI).${stran}`)) continue;
        kosov++;
        const M = node.getWorldMatrix();
        for (const prim of node.getMesh().listPrimitives()) {
          const pos = prim.getAttribute("POSITION"), ind = prim.getIndices(), o = P.length / 3, v = [0, 0, 0];
          for (let i = 0; i < pos.getCount(); i++) {
            pos.getElement(i, v);
            P.push(M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12], M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13], M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14]);
          }
          const a = ind.getArray();
          for (let i = 0; i < a.length; i++) I.push(a[i] + o);
        }
      }
      assert.equal(kosov, 7, `polobla ${stran}: šest režnjev in medialna stena`);
      const r = analiziraj(Float64Array.from(P), Uint32Array.from(I));
      // posamezni kosi so vsak zase poenostavljeni dobili ~3000 odprtih robov ob mejah (luknje v medialni ploskvi v prerezu)
      assert.ok(r.odprtiRobovi <= 20, `polobla ${stran}: ${r.odprtiRobovi} odprtih robov med režnji`);
    }
  });
}
