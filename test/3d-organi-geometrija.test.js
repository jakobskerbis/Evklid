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

test("geometrija organov: jetra.json opisuje nove dele in prerez pokaže prereze dreves (svetline), ne celih cevi", () => {
  const j = json("jetra");
  const po = Object.fromEntries(j.deli.map((x) => [x.id, x]));
  for (const id of ["spodnja-votla-vena", "srpasta-vez", "obla-vez"]) {
    assert.ok(po[id], `manjka del ${id}`);
    for (const k of ["ime", "la", "opisOs", "opis", "opisStudij"]) assert.ok(po[id][k] && po[id][k].length > 3, `${id}.${k}`);
    assert.ok(po[id].vozlisca?.length, `${id} nima vozlišč`);
  }
  // ocena r5: cela drevesa na rezni ploskvi so bila »špageti«; zdaj se režejo, presek je stena in temna svetlina
  for (const t of ["portalna", "arterija", "vena", "zolcevod"]) {
    assert.ok(!j.tkiva[t].brezReza, `tkivo ${t} se v prerezu reže`);
    // krog n5: obroč s steno in svetlino (rezPresek.cev), neprerezane cevi niso na rezni ploskvi (samoPresek)
    assert.ok(j.tkiva[t].rezPresek?.luknjaBarva && j.tkiva[t].rezPresek.robBarva && j.tkiva[t].rezPresek.cev, `tkivo ${t}: presek s svetlino in steno`);
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

test("geometrija organov: pljuca.json v prerezu pokaže prereze dihalnega in žilnega drevesa (ne celih cevi na rezu)", () => {
  const j = json("pljuca");
  for (const t of ["dihalna", "dihalna-v", "pljucna-arterija", "pljucna-arterija-v", "pljucna-vena", "pljucna-vena-v"]) {
    assert.ok(!j.tkiva[t].brezReza, t);
    assert.ok(j.tkiva[t].rezPresek?.rob > 0 || j.tkiva[t].rezPresek?.cev, `${t}: presek s steno`);
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
  for (const fn of ["mali_iz_mri", "slepi_konci", "ct_rezenj"]) assert.ok(izvoz.includes(fn), fn);
  for (const f of ["drevesa.py", "jetra_geometrija.py", "mali-mozgani-rez.py", "mali-mozgani-mri.py", "pljuca-ct.py"]) {
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

// Krog 2 (2026-11-13): mali možgani iz segmentacije MRI (aseg), kvadratni reženj jeter en kos, pljučni režnji iz CT.
for (const dat of ["mozgani.glb", "mozgani-telefon.glb"]) {
  test(`geometrija organov: ${dat} ima male možgane iz MRI kot eno zaprto telo namesto režnjičev Z-Anatomy`, async () => {
    const d = await deli(dat);
    const m = najdi(d, "Cerebellum (MRI)");
    assert.equal(m.zaprte, m.komponente, "mali možgani niso zaprti");
    assert.equal(m.komponente, 1, `kosov ${m.komponente}`);
    assert.equal(m.luknje, 0);
    assert.ok(!d.some((x) => /^(Culmen|Declive|Tuber of vermis|Biventral lobule)/.test(x.ime)), "režnjiči Z-Anatomy so še v datoteki");
  });
}

test("geometrija organov: sredinska ravnina MRI (strig zasukane glave) iz medialnih robov polobel", (t) => {
  const izvoz = fs.readFileSync(path.join(KOREN, "scripts", "atlas", "izvozi-organe.py"), "utf8");
  for (const fn of ["def sredinska_ravnina", "def mri_preslikava", "T = mri_preslikava(MRI"]) assert.ok(izvoz.includes(fn), fn);
  const np_ = spawnSync("python3", ["-c", "import numpy"]);
  if (np_.status !== 0) return t.skip("python3 z numpy ni na voljo");
  // umetni polobli: sredina X = 1 mm + 0,03·Y + 0,02·Z, reža 1 mm; ravnina mora priti nazaj
  const prog = `
import re, sys, numpy as np
src = open(sys.argv[1], encoding="utf8").read()
exec(re.search(r"def sredinska_ravnina.*?return a0, b, c\\n", src, re.S).group(0))
g = np.random.default_rng(1)
Y, Z = g.uniform(-0.08, 0.08, 40000), g.uniform(-0.03, 0.06, 40000)
x0 = 0.001 + 0.03 * Y + 0.02 * Z
vl = np.c_[x0 + 0.0005 + g.uniform(0, 0.06, len(Y)), Y, Z]
vr = np.c_[x0 - 0.0005 - g.uniform(0, 0.06, len(Y)), Y, Z]
a0, b, c = sredinska_ravnina(vl, vr)
print(round(a0 * 1000, 2), round(b, 3), round(c, 3))`;
  const r = spawnSync("python3", ["-c", prog, path.join(KOREN, "scripts", "atlas", "izvozi-organe.py")], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  const [a0, b, c] = r.stdout.trim().split("\n").pop().split(" ").map(Number);
  assert.ok(Math.abs(a0 - 1) < 0.3 && Math.abs(b - 0.03) < 0.005 && Math.abs(c - 0.02) < 0.005, r.stdout);
});

for (const dat of ["mozgani.glb", "mozgani-telefon.glb"]) {
  test(`geometrija organov: ${dat} – polobli MRI ostaneta vsaka na svoji strani reza (brez prepognjenih lis)`, async () => {
    const { NodeIO } = await import("@gltf-transform/core");
    const { ALL_EXTENSIONS } = await import("@gltf-transform/extensions");
    const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(path.join(ORGANI, dat));
    const ravnina = -json("mozgani").prerez.ravnine[0].d; // rez x = 0,4 mm
    for (const node of doc.getRoot().listNodes()) {
      const m = node.getName().match(/\(MRI\)\.([lr])$/);
      if (!node.getMesh() || !m) continue;
      const M = node.getWorldMatrix(), v = [0, 0, 0];
      let naj = m[1] === "l" ? Infinity : -Infinity;
      for (const prim of node.getMesh().listPrimitives()) {
        const pos = prim.getAttribute("POSITION");
        for (let i = 0; i < pos.getCount(); i++) {
          pos.getElement(i, v);
          const x = M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12];
          naj = m[1] === "l" ? Math.min(naj, x) : Math.max(naj, x);
        }
      }
      // ≥ 1 mm od ravnine reza: bliže je pokrov reza risal sive lise čez medialno ploskev
      if (m[1] === "l") assert.ok(naj > ravnina + 0.001, `${node.getName()}: x = ${naj}`);
      else assert.ok(naj < -0.0014, `${node.getName()}: x = ${naj}`);
    }
  });
}

test("geometrija organov: lističi malih možganov krožijo okoli fastigija iz izvoza", () => {
  const c = json("mozgani").tkiva.mali.listiSredisce;
  assert.equal(c.length, 3);
  assert.ok(Math.abs(c[0]) < 0.004, `fastigij ni na sredini: x = ${c[0]}`);
});

for (const dat of ["jetra.glb", "jetra-telefon.glb"]) {
  test(`geometrija organov: ${dat} – kvadratni reženj je en kos (brez pasu za porto)`, async () => {
    const r = najdi(await deli(dat), "Quadrate lobe of liver (lastno)");
    assert.equal(r.komponente, 1, `kosov ${r.komponente}`);
  });
}

test("geometrija organov: viri pljučnih režnjev (TotalSegmentator) in malih možganov (aseg) so navedeni", () => {
  const viri = JSON.parse(fs.readFileSync(path.join(KOREN, "public", "3d", "viri.json"), "utf8")).viri;
  const ts = viri.find((v) => v.id === "totalsegmentator");
  assert.ok(ts && ts.licenca === "CC BY 4.0" && ts.datoteke.includes("organi-3d/pljuca*.glb"));
  assert.match(viri.find((v) => v.id === "openneuro-ds000001").opis, /Mali možgani/);
  const cr = fs.readFileSync(path.join(ORGANI, "CREDITS.txt"), "utf8");
  assert.match(cr, /TotalSegmentator/); assert.match(cr, /aseg/);
});

// Krog 5 (2026-11-13): Taubinovo glajenje (stopnice vokslov MRI in CT), ravno odrezan vrh sapnika, središče ledvice brez
// sečevoda (koordinate reza v ledvica.json), glajenje mej režnjev MRI, sečevod in čašice v ravnini reza.
test("geometrija organov: krog 5 – orodja v izvozu (taubin_bm, ravnoOdrezi, sredisce_brez, glajenjeMej, čaše)", (t) => {
  const izvoz = fs.readFileSync(path.join(KOREN, "scripts", "atlas", "izvozi-organe.py"), "utf8");
  const drevesa = fs.readFileSync(path.join(KOREN, "scripts", "atlas", "drevesa.py"), "utf8");
  for (const s of ['cfg.get("ravnoOdrezi"', 'cfg.get("sredisce_brez")', 'sredisce_brez=r"^Ureter"', 'm.get("glajenjeMej"', 'mm.get("glajenje")', "use_negative", "na_ravnino("])
    assert.ok(izvoz.includes(s), s);
  assert.ok(drevesa.includes("def taubin_bm(") && drevesa.includes("taubin_bm(bm, cfg.get(\"drevesa\", {}).get(\"ctGlajenje\""), "taubin_bm v drevesa.py");
  const np_ = spawnSync("python3", ["-c", "import numpy"]);
  if (np_.status !== 0) return t.skip("python3 z numpy ni na voljo");
  // Taubin na stopnicah: hrapavost pade, prostornina (srednji polmer) ostane
  const prog = `
import re, sys, types, numpy as np
src = open(sys.argv[1], encoding="utf8").read()
exec(re.search(r"def taubin_bm.*?v\\.co = q\\n", src, re.S).group(0))
class V:
    def __init__(s, i, co): s.index, s.co = i, co
class E:
    def __init__(s, a, b): s.verts = (a, b)
class Seznam(list):
    def ensure_lookup_table(s): pass
    def index_update(s): pass
n = 400
vs = Seznam(V(i, (np.cos(2 * np.pi * i / n) * (1 + 0.05 * (i % 2)), np.sin(2 * np.pi * i / n) * (1 + 0.05 * (i % 2)), 0.0)) for i in range(n))
bm = types.SimpleNamespace(verts=vs, edges=[E(vs[i], vs[(i + 1) % n]) for i in range(n)])
r0 = np.array([np.hypot(*v.co[:2]) for v in vs])
taubin_bm(bm, 30)
r1 = np.array([np.hypot(*np.asarray(v.co)[:2]) for v in vs])
print(round(r0.std(), 4), round(r1.std(), 4), round(r0.mean(), 3), round(r1.mean(), 3))`;
  const r = spawnSync("python3", ["-c", prog, path.join(KOREN, "scripts", "atlas", "drevesa.py")], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  const [s0, s1, m0, m1] = r.stdout.trim().split("\n").pop().split(" ").map(Number);
  assert.ok(s1 < s0 * 0.2, `stopnice ostanejo: ${s0} → ${s1}`);
  assert.ok(Math.abs(m1 - m0) < 0.02, `skrčenje: ${m0} → ${m1}`);
});
