// Krog n1 (2026-11-13): možgani, pljuča in jetra iz najboljših odprtih virov.
// – možgani: deblo, mali možgani, talamus, hipotalamus, forniks, žuljevo telo iz HRA Brain v1.4 (mozgani_hra.py), risba
//   sredinskega reza (mozgani-rez-hra.py), listi v pahljači (listiKot), rez z risbo tudi v učnih barvah (rezUcna);
// – pljuča: režnji, arterije, vene in dihalno drevo iz enega CT (pljuca-zile.py, pljuca_geometrija.py), sapnik HRA;
// – jetra: površina, portalna vena in jetrne vene s spodnjo votlo veno iz HVA-CT (jetra-ct.py, jetra_geometrija.jetra_ct).
// Krog n4 (ocena n3: pljuča in jetra iz CT slabša od r5): objavljena pljuča in jetra so spet geometrija r5 (Z-Anatomy, režnji TS,
// zrasla drevesa), različici CT ostaneta v orodjih kot možnost; možgani: iz HRA le bele sredinske strukture, deblo in
// medmožgani Z-Anatomy, mali možgani MRI.
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
  for (const s of ["from mozgani_hra import", "from pljuca_geometrija import pljuca_ct", "jetra_ct", 'dodaj=["pljucna_drevesa"]', 'dodaj=["jetra_deli"]', "hra_mozgani=dict(", "skupine=", "maliMri=True", '"_racunalnik"'])
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


  test(`n4/n5: mozgani${pripona}.glb – bele sredinske strukture HRA, deblo in mali možgani MRI, medmožgani Z-Anatomy`, async () => {
    const d = await preveriGLB(path.join(ORGANI, `mozgani${pripona}.glb`));
    for (const ime of ["Corpus callosum (HRA)", "Fornix (HRA)", "Anterior commissure (HRA)", "Optic chiasm (HRA)"]) {
      const r = d.find((x) => x.ime === ime);
      assert.ok(r, `manjka ${ime}`);
      assert.equal(r.navznoter, 0, `${ime}: obrnjen navznoter`);
    }
    const mali = d.find((x) => x.ime === "Cerebellum (MRI)");
    assert.ok(mali && mali.odprtiRobovi <= 2, "mali možgani MRI so zaprto telo");
    // ocena n3: deblo HRA je raven valj z ločenim ponsom, mali možgani HRA brez fisur → nazaj Z-Anatomy / MRI
    for (const ime of ["Brainstem (HRA)", "Cerebellum (HRA)", "Thalamus (HRA)"]) assert.ok(!d.some((x) => x.ime === ime), `${ime} je še v datoteki`);
    // n5: deblo iz segmentacije istega osebka (aseg 16), da se ujema z rezino MRI na rezni ploskvi; deblo Z-Anatomy odpade
    const deblo = d.find((x) => x.ime === "Brainstem (MRI)");
    assert.ok(deblo && deblo.odprtiRobovi === 0 && deblo.navznoter === 0, "možgansko deblo MRI je zaprto telo");
    for (const re of [/^Pons/, /^Medulla oblongata/, /^Midbrain/]) assert.ok(!d.some((x) => re.test(x.ime)), `${re} Z-Anatomy je še v datoteki`);
    assert.ok(d.some((x) => /^Thalamus\.[lr]$/.test(x.ime)), "manjka talamus");
  });

  test(`n4: pljuca${pripona}.glb in jetra${pripona}.glb sta geometrija r5 (brez vozlišč CT)`, async () => {
    for (const o of ["pljuca", "jetra"]) {
      const d = await preveriGLB(path.join(ORGANI, `${o}${pripona}.glb`));
      assert.ok(!d.some((x) => /\((CT|HRA)\)$/.test(x.ime)), `${o}: vozlišča CT/HRA`);
    }
  });
}

test("n4: JSON organov – deli kažejo na obstoječa vozlišča, rez z risbo, palete", () => {
  const m = json("mozgani");
  // n5: rezna ploskev možganov je ena slika čez ves prerez (rezina MRI istega osebka), ne risba le na malih možganih
  for (const t of ["mali", "deblo"]) {
    assert.equal(m.tkiva[t].rezPresek.vrsta, 0);
    assert.ok(!m.tkiva[t].rezSlika, `${t}: stara risba reza`);
  }
  const ps = m.prerez.slika;
  assert.ok(ps && ps.lo.length === 2 && ps.mera.length === 2 && ps.mera[0] > 0.15 && ps.mera[0] < 0.25, "prerez.slika z mero v metrih");
  for (const f of [ps.slika, ps.ucna]) {
    const v = fs.statSync(path.join(ORGANI, f)).size;
    assert.ok(v > 15_000 && v < 400_000, `${f}: ${v} B`);
  }
  const vozl = (j) => new Set(j.deli.flatMap((x) => x.vozlisca || []));
  assert.ok([...vozl(m)].some((v) => v.startsWith("Corpus callosum (HRA)")), "žuljevo telo HRA v delih možganov");
  assert.ok([...vozl(m)].some((v) => v.startsWith("Cerebellum (MRI)")), "mali možgani MRI v delih možganov");
  const p = json("pljuca");
  // n3 → n4: drobnejši vzorec pljučnih mešičkov na rezu ostane, svetlina sapnika je temna
  assert.ok(p.tkiva.pljuca.rezCelice[0].mera >= 0.0015 && p.tkiva.pljuca.rezCelice[0].jedroMoc <= 0.5, "vzorec mešičkov n3");
  const temno = (h) => parseInt(h.slice(1, 3), 16) + parseInt(h.slice(3, 5), 16) + parseInt(h.slice(5, 7), 16);
  assert.ok(temno(p.tkiva["dihalna-v"].rez) < 120, "temna svetlina sapnika");
  const j = json("jetra");
  // ocena n3: cevi v hilusu naj ne bodo »bonbonske« učne barve – v realnem načinu zamolkle, sijaj kapsule mat
  const nasic = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return (Math.max(...c) - Math.min(...c)) / Math.max(...c); };
  for (const t of ["vena", "portalna"]) assert.ok(nasic(j.tkiva[t].barva) < 0.5, `${t}: zamolkla barva`);
  assert.ok(j.tkiva.jetra.lak <= 0.2, "jetra: brez plastičnega laka");
  assert.ok(j.tkiva.jetra.rezCelice?.[0]?.mera > 0.001, "režnjiči na rezu jeter");
  for (const [ime, o] of [["mozgani", m], ["pljuca", p], ["jetra", j]]) for (const d of o.deli) assert.ok(d.vozlisca?.length, `${ime} ${d.id}: del brez vozlišč`);
});

test("n1: pregledovalnik – risba reza v učnih barvah in pahljača listov", () => {
  const src = beri("public", "3d", "organ.js");
  for (const s of ["rezUcna", "ucniPresekSlike", "slikeTkiv", "listiKot", "rezOdmik", "const ravZa", "userData.ravnineRez"]) assert.ok(src.includes(s), s);
  assert.ok(!/float orgSl\b/.test(src), "lokalna spremenljivka ne sme zasenčiti vzorčevalnika orgSl");
});

test("n3/n4: možnosti CT ostanejo v orodjih (ravnina drevesa, začetek hrbtenjače), objavljena pljuča brez odmika dreves", () => {
  const p = json("pljuca");
  for (const [t, tk] of Object.entries(p.tkiva)) assert.ok(!tk.rezOdmik, `${t}: brez rezOdmik`);
  for (const s of ['cfg["_karinaN"]', "ravninaNagib"]) assert.ok(beri("scripts", "atlas", "pljuca_geometrija.py").includes(s), s);
  assert.ok(beri("scripts", "atlas", "organi.mjs").includes("izvoz.karinaN"), "organi.mjs uporabi normalo ravnine");
  const hra = beri("scripts", "atlas", "mozgani_hra.py");
  for (const s of ['h.get("hrbtenjaca"', 'h.get("skupine"']) assert.ok(hra.includes(s), s);
  assert.ok(beri("scripts", "atlas", "mozgani-rez-hra.py").includes("ozke = je_mali"), "ozke razpoke niso izrez");
});

test("n4: viri – HRA Brain za objavljene mreže, viri CT le kot možnost orodij", () => {
  const viri = JSON.parse(beri("public", "3d", "modeli", "organi", "viri.json"));
  const najdi = (re) => viri.find((v) => re.test(v.ime));
  const hra = najdi(/Brain, v1\.4/);
  assert.ok(hra && hra.licenca === "CC BY 4.0");
  assert.match(najdi(/TotalSegmentator/).licenca, /CC BY 4\.0.*Apache-2\.0/);
  for (const v of viri) assert.ok(!/NC|ND/.test(v.licenca), `${v.ime}: licenca ${v.licenca}`);
  const cr = beri("public", "3d", "modeli", "organi-3d", "CREDITS.txt");
  for (const re of [/Brain v1\.4/, /CC BY-SA 4\.0/, /Z-Anatomy/, /TotalSegmentator/]) assert.match(cr, re);
  // objavljena jetra in pljuča n4 nimajo mrež iz HVA-CT: vir ne sme biti naveden kot vir objavljenih mrež
  assert.ok(!najdi(/HVA-CT/) || /možnost|ni v objavljenih/i.test(najdi(/HVA-CT/).za), "HVA-CT le kot možnost");
});

test("n5: možgani – orodja za Silvijevo brazdo, deblo MRI in rezino MRI; pregledovalnik riše sliko prereza", () => {
  const izv = beri("scripts", "atlas", "izvozi-organe.py");
  for (const n of ["silvij=", "silvijDolzina", "deblo=True", "gube=", "mriAfina", "Brainstem (MRI)"]) assert.ok(izv.includes(n), n);
  const rez = beri("scripts", "atlas", "mozgani-rez-mri.py");
  for (const n of ["brain.mgz", "aseg.mgz", "mriAfina", "mozgani-rez-ucne.webp"]) assert.ok(rez.includes(n), n);
  const py = spawnSync("python3", ["-c", "import ast,sys; ast.parse(open(sys.argv[1], encoding='utf8').read())", path.join(ATLAS, "mozgani-rez-mri.py")]);
  if (py.status !== null && !py.error) assert.equal(py.status, 0, String(py.stderr));
  const src = beri("public", "3d", "organ.js");
  for (const n of ["rezPlosca", "prerez.slika"]) assert.ok(src.includes(n), n);
});

test("n5: jetra – ravnina prereza skozi debla jetrnih ven in portalne veje, votla vena v žlebu", () => {
  const g = beri("scripts", "atlas", "jetra_geometrija.py");
  for (const n of ["ravninaDreves", "_karinaN", "ivcZleb", "portaDeblo"]) assert.ok(g.includes(n), n);
  const j = json("jetra");
  const r = j.prerez.ravnine[0];
  // ravnina je frontalna (normala pretežno spredaj–zadaj v glTF: os z), ne več vodoravna skozi vrata
  assert.ok(Math.abs(r.n[2]) > 0.9, `normala ${r.n}`);
  assert.ok(j.tkiva.zolcnik.rezPresek.cev && !j.tkiva.zolcnik.rezVotlina, "žolčnik na rezu s steno");
});

test("n6: možgani – parasagitalna ravnina reza, risba 2048 px brez šuma, prekati kot reže, skriti deli za risbo", () => {
  const m = json("mozgani");
  const r = m.prerez.ravnine[0];
  assert.ok(r.rocno && r.d <= -0.004 && r.d >= -0.008, `ravnina ${r.d}`);
  assert.ok(m.prerez.slika.gladko && m.prerez.slika.sum === 0, "risba brez šuma");
  for (const d of ["hipotalamus", "krizisce", "zuljevo"]) assert.ok(m.pogledi.prerez.skrijDele.includes(d), d);
  const rez = beri("scripts", "atlas", "mozgani-rez-mri.py");
  for (const n of ["REZ_SREDINA", "CETRTI_DELEZ", "zgornji_pas", "cisterne", "neozn", "REZ_PX"]) assert.ok(rez.includes(n), n);
  assert.ok(beri("public", "3d", "organ.js").includes("rezSlika?.gladko"));
});

test("n6: jetra in pljuča – orodja (žleb ob repastem režnju, ožja srpasta vez, podaljšano pljučno deblo, lingula)", () => {
  const g = beri("scripts", "atlas", "jetra_geometrija.py");
  for (const n of ["repastiZleb", "SIRINA_VEZI"]) assert.ok(g.includes(n), n);
  const d = beri("scripts", "atlas", "drevesa.py");
  for (const n of ["debloDolzina", "lingula", "bazaZozi", "Pulmonary trunk (lastno)"]) assert.ok(d.includes(n), n);
  const j = json("jetra");
  assert.ok(j.tkiva.jetra.lak <= 0.08 && j.tkiva.jetra.rezPresek.robBarva, "jetra: mat kapsula, rob kapsule na rezu");
  assert.ok(j.tkiva.jetra.rezCelice[0].moc >= 0.45, "režnjiči na rezu");
});
