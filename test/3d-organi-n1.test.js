// Krog n1 (2026-11-13): možgani, pljuča in jetra iz najboljših odprtih virov.
// – možgani: deblo, mali možgani, talamus, hipotalamus, forniks, žuljevo telo iz HRA Brain v1.4 (mozgani_hra.py), risba
//   sredinskega reza (mozgani-rez-hra.py), listi v pahljači (listiKot), rez z risbo tudi v učnih barvah (rezUcna);
// – pljuča: režnji, arterije, vene in dihalno drevo iz enega CT (pljuca-zile.py, pljuca_geometrija.py), sapnik HRA;
// – jetra: površina, portalna vena in jetrne vene s spodnjo votlo veno iz HVA-CT (jetra-ct.py, jetra_geometrija.jetra_ct).
// Test bere objavljene GLB-je in JSON; orodja CT preizkusi na umetnih maskah (če sta numpy in scipy na voljo).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { preveriGLB } from "../scripts/atlas/preveri-mreze.mjs";

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORGANI = path.join(KOREN, "public", "3d", "modeli", "organi-3d");
const ATLAS = path.join(KOREN, "scripts", "atlas");
const json = (o) => JSON.parse(fs.readFileSync(path.join(ORGANI, `${o}.json`), "utf8"));
const beri = (...p) => fs.readFileSync(path.join(KOREN, ...p), "utf8");
const MEJE = { racunalnik: [6_291_456, 300_000], telefon: [1_992_294, 90_000] };

test("n1: orodja se prevedejo in izvoz jih kliče", (t) => {
  const izvoz = beri("scripts", "atlas", "izvozi-organe.py");
  for (const s of ["from mozgani_hra import", "from pljuca_geometrija import pljuca_ct", "jetra_ct", 'dodaj=["pljuca_ct"]', 'dodaj=["jetra_ct"]', "hra_mozgani=dict(", '"_racunalnik"'])
    assert.ok(izvoz.includes(s), s);
  if (spawnSync("python3", ["--version"]).status !== 0) return t.skip("python3 ni na voljo");
  for (const f of ["ct_orodja.py", "ct_orodja_preizkus.py", "pljuca-zile.py", "jetra-ct.py", "mozgani_hra.py", "mozgani-rez-hra.py", "pljuca_geometrija.py", "jetra_geometrija.py"]) {
    const r = spawnSync("python3", ["-c", "import ast,sys; ast.parse(open(sys.argv[1], encoding='utf8').read())", path.join(ATLAS, f)]);
    assert.equal(r.status, 0, `${f}: ${r.stderr}`);
  }
});

test("n1: ct_orodja – skelet umetnega drevesa (Y) in površina krogle", (t) => {
  const ima = spawnSync("python3", ["-c", "import numpy, scipy, skimage"]);
  if (ima.status !== 0) return t.skip("numpy, scipy ali scikit-image niso na voljo");
  const r = spawnSync("python3", [path.join(ATLAS, "ct_orodja_preizkus.py")], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  const d = JSON.parse(r.stdout.trim().split("\n").pop());
  assert.equal(d.korenin, 1);
  assert.equal(d.listov, 2, "dve veji");
  assert.equal(d.razcepov, 1, "en razcep");
  assert.ok(d.starsi_pred_otroki, "starš ima manjši indeks od otroka (Drevo to predpostavlja)");
  assert.ok(d.korenina_z_mm < 12, `korenina je spodnji konec debla (z ${d.korenina_z_mm} mm)`);
  assert.ok(d.najvecji_r_mm > 2.6 && d.najvecji_r_mm < 4.6, `polmer debla ${d.najvecji_r_mm} mm (pravi 4 mm)`);
  assert.ok(d.visina_mm > 40 && d.visina_mm < 56, `višina drevesa ${d.visina_mm} mm`);
  assert.ok(Math.abs(d.krogla_mm3 - 4189) / 4189 < 0.12, `prostornina krogle ${d.krogla_mm3} mm³ (prava 4189)`);
});

for (const [vrsta, pripona] of [["racunalnik", ""], ["telefon", "-telefon"]]) {
  test(`n1: velikosti in trikotniki (${vrsta}) – možgani, pljuča, jetra`, async () => {
    for (const o of ["mozgani", "pljuca", "jetra"]) {
      const dat = `${o}${pripona}.glb`;
      const b = fs.statSync(path.join(ORGANI, dat)).size;
      assert.ok(b <= MEJE[vrsta][0], `${dat}: ${b} B`);
      const tris = (await preveriGLB(path.join(ORGANI, dat))).reduce((s, x) => s + x.trikotniki, 0);
      assert.ok(tris <= MEJE[vrsta][1], `${dat}: ${tris} trikotnikov`);
    }
  });

  test(`n1: mozgani${pripona}.glb ima strukture HRA namesto malih možganov MRI`, async () => {
    const d = await preveriGLB(path.join(ORGANI, `mozgani${pripona}.glb`));
    for (const ime of ["Brainstem (HRA)", "Cerebellum (HRA)", "Corpus callosum (HRA)", "Fornix (HRA)", "Thalamus (HRA)", "Hypothalamus (HRA)"]) {
      const r = d.find((x) => x.ime === ime);
      assert.ok(r, `manjka ${ime}`);
      assert.equal(r.navznoter, 0, `${ime}: obrnjen navznoter`);
    }
    for (const ime of ["Brainstem (HRA)", "Cerebellum (HRA)"]) assert.ok(d.find((x) => x.ime === ime).odprtiRobovi <= 2, `${ime} je zaprto telo`);
    assert.ok(!d.some((x) => /Cerebellum \(MRI\)/.test(x.ime)), "mali možgani MRI so še v datoteki");
  });

  test(`n1: pljuca${pripona}.glb – režnji, sapnik HRA z obroči in drevesa iz CT`, async () => {
    const d = await preveriGLB(path.join(ORGANI, `pljuca${pripona}.glb`));
    const rezn = d.filter((x) => /lobe of (left|right) lung$/.test(x.ime));
    assert.equal(rezn.length, 5);
    for (const r of rezn) {
      assert.ok(r.odprtiRobovi <= 2, `${r.ime}: odprtih robov ${r.odprtiRobovi}`);
      assert.equal(r.navznoter, 0, r.ime);
    }
    for (const ime of ["Trachea (HRA)", "Tracheal cartilage (HRA)", "Main bronchi (HRA)", "Main bronchial cartilage (HRA)"]) assert.ok(d.find((x) => x.ime === ime), `manjka ${ime}`);
    for (const ime of ["Bronchi (CT)", "Bronchi in lungs (CT)", "Pulmonary arteries (CT)", "Pulmonary arteries in lungs (CT)", "Pulmonary veins (CT)", "Pulmonary veins in lungs (CT)"]) {
      const r = d.find((x) => x.ime === ime);
      assert.ok(r, `manjka ${ime}`);
      assert.ok(r.komponente >= (pripona ? 8 : 15), `${ime}: ${r.komponente} vej`);
    }
    assert.ok(!d.some((x) => /segment/i.test(x.ime)), "veje Z-Anatomy so še v datoteki");
  });

  test(`n1: jetra${pripona}.glb – drevesa HVA-CT, votla vena s svetlino, režnji`, async () => {
    const d = await preveriGLB(path.join(ORGANI, `jetra${pripona}.glb`));
    assert.equal(d.length, 12);
    for (const ime of ["Right lobe of liver (lastno)", "Left lobe of liver (lastno)", "Quadrate lobe of liver (lastno)", "Caudate lobe of liver (lastno)"]) {
      const r = d.find((x) => x.ime === ime);
      assert.ok(r, `manjka ${ime}`);
      assert.ok(r.odprtiRobovi <= 2 && r.luknje <= 1, `${ime}: odprti robovi ${r.odprtiRobovi}`);
      assert.equal(r.navznoter, 0, ime);
    }
    for (const ime of ["Hepatic portal vein and branches (CT)", "Hepatic veins (CT)", "Hepatic artery and branches (lastno)", "Bile ducts (lastno)"]) {
      const r = d.find((x) => x.ime === ime);
      assert.ok(r, `manjka ${ime}`);
      assert.equal(r.odprtiRobovi, 0, `${ime}: cevi so zaprte`);
      assert.ok(r.komponente >= (pripona ? 10 : 30), `${ime}: ${r.komponente} vej`);
    }
    const ivc = d.find((x) => x.ime === "Inferior vena cava (CT)");
    assert.ok(ivc, "manjka spodnja votla vena");
    assert.equal(ivc.komponente, 1);
    assert.equal(ivc.odprtiRobovi, 0, "votla cev s steno je zaprta mreža (zunanja in notranja ploskev, obroča na koncih)");
    for (const ime of ["Gallbladder", "Falciform ligament (lastno)", "Round ligament of liver (lastno)"]) assert.ok(d.find((x) => x.ime === ime), `manjka ${ime}`);
  });
}

test("n1: JSON organov – deli kažejo na nova vozlišča, rez z risbo, tkivo hrustanca", () => {
  const m = json("mozgani");
  for (const t of ["mali", "deblo"]) {
    assert.equal(m.tkiva[t].rezPresek.vrsta, 0);
    assert.ok(!m.tkiva[t].rezPresek.ovoj, `${t}: brez ovoja (pravi obris HRA)`);
    assert.ok(m.tkiva[t].rezSlika?.slika, `${t}: risba reza`);
  }
  assert.ok(m.tkiva.mali.listiKot > 0, "listi malih možganov v pahljači");
  const vozl = (j) => new Set(j.deli.flatMap((x) => x.vozlisca || []));
  assert.ok([...vozl(m)].some((v) => v.startsWith("Brainstem (HRA)")), "deblo HRA v delih možganov");
  const p = json("pljuca");
  assert.ok(p.tkiva.hrustanec, "tkivo hrustanec");
  const vp = [...vozl(p)];
  for (const ime of ["Trachea (HRA)", "Bronchi in lungs (CT)", "Pulmonary arteries in lungs (CT)", "Pulmonary veins (CT)"]) assert.ok(vp.some((v) => v.startsWith(ime)), `pljuca.json: ${ime}`);
  const j = json("jetra");
  const vj = [...vozl(j)];
  for (const ime of ["Hepatic portal vein and branches (CT)", "Hepatic veins (CT)", "Inferior vena cava (CT)", "Caudate lobe of liver (lastno)"]) assert.ok(vj.some((v) => v.startsWith(ime)), `jetra.json: ${ime}`);
  for (const o of [m, p, j]) for (const d of o.deli) assert.ok(d.vozlisca?.length, `${o.id || ""} ${d.id}: del brez vozlišč`);
});

test("n1: pregledovalnik – risba reza v učnih barvah in pahljača listov", () => {
  const src = beri("public", "3d", "organ.js");
  for (const s of ["rezUcna", "ucniPresekSlike", "slikeTkiv", "listiKot"]) assert.ok(src.includes(s), s);
  assert.ok(!/float orgSl\b/.test(src), "lokalna spremenljivka ne sme zasenčiti vzorčevalnika orgSl");
});

test("n2: drevesa v pljučih molijo iz rezne ploskve (rezOdmik), deblo z začetkom hrbtenjače", () => {
  const src = beri("public", "3d", "organ.js");
  for (const s of ["rezOdmik", "const ravZa", "userData.ravnineRez"]) assert.ok(src.includes(s), s);
  const p = json("pljuca");
  for (const t of ["dihalna-v", "pljucna-arterija-v", "pljucna-vena-v"]) {
    assert.ok(p.tkiva[t].rezOdmik > 0.005 && p.tkiva[t].rezOdmik < 0.03, `${t}: rezOdmik ${p.tkiva[t].rezOdmik}`);
    assert.ok(!p.tkiva[t].brezReza && p.tkiva[t].rezPresek, `${t}: še vedno se reže (s presekom)`);
  }
  for (const t of ["pljuca", "dihalna", "hrustanec"]) assert.ok(!p.tkiva[t].rezOdmik, `${t}: reže se na glavni ravnini`);
  assert.ok(beri("scripts", "atlas", "mozgani_hra.py").includes('h.get("hrbtenjaca"'), "začetek hrbtenjače v mozgani_hra.py");
  assert.ok(beri("scripts", "atlas", "mozgani-rez-hra.py").includes("ozke = je_mali"), "ozke razpoke niso izrez");
});

test("n1: viri – HRA, TotalSegmentator in HVA-CT (deljenje pod enakimi pogoji)", () => {
  const viri = JSON.parse(beri("public", "3d", "modeli", "organi", "viri.json"));
  const najdi = (re) => viri.find((v) => re.test(v.ime));
  const hra = najdi(/Brain, v1\.4/);
  assert.ok(hra && hra.licenca === "CC BY 4.0");
  assert.ok(najdi(/Trachea v1\.1/)?.licenca === "CC BY 4.0");
  assert.match(najdi(/TotalSegmentator/).licenca, /CC BY 4\.0.*Apache-2\.0/);
  const hva = najdi(/HVA-CT/);
  assert.equal(hva.licenca, "CC BY-SA 4.0");
  assert.match(hva.za, /Deljenje pod enakimi pogoji/);
  for (const v of viri) assert.ok(!/NC|ND/.test(v.licenca), `${v.ime}: licenca ${v.licenca}`);
  const cr = beri("public", "3d", "modeli", "organi-3d", "CREDITS.txt");
  for (const re of [/HVA-CT/, /zenodo\.19850108/, /CC BY-SA 4\.0/, /Deljenje pod enakimi pogoji/, /Brain v1\.4/, /Trachea v1\.1/, /lung_vessels/, /liver_segments/]) assert.match(cr, re);
});
