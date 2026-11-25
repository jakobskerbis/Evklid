// Zlati nabor inštruktorja (P1-10; scripts/meri-zlati-nabor.mjs, scripts/zlati-nabor-ocena.mjs): brez klicev API.
// Preveri nabor (reference s številkami preračuna koda, ne model), branje in združevanje ocen, primerjavo pred/po, meje
// stroška in šifriranje izida Preizkusa 3.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { normalizeSettings } from "../server/settings.js";
import { asksForSolution } from "../server/nacin.js";
import { MERILA, SKUPINE, sestaviPrimere, vzorecPoVrsti, vprasanjeOcenjevalcu, preberiOceno, potrebenTretji, zdruziOcene, ujemanje, povzetek, primerjaj } from "../scripts/zlati-nabor-ocena.mjs";
import { odsifriraj, kljucIz } from "../scripts/preizkus3-sifra.mjs";

const env = { ...process.env, ANTHROPIC_API_KEY: "", EVKLID_DATA_KEY: "", PREIZKUS3_KLJUC: "", GITHUB_ACTIONS: "" };
const skripta = "scripts/meri-zlati-nabor.mjs";
const beri = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), "utf8"));
const novi = beri("./fixtures/zlati-nabor/novi.json").primeri;
const tmpDir = () => fs.mkdtempSync(path.join(os.tmpdir(), "evklid-zlati-test-"));

test("novi del nabora: 11 BIO, 11 KEM, 14 napačnih predstav; znana merila, veljaven profil, referenca", () => {
  const st = {};
  for (const p of novi) st[p.skupina] = (st[p.skupina] || 0) + 1;
  assert.deepEqual(st, { bio: 11, kem: 11, predstave: 14 });
  assert.equal(new Set(novi.map((p) => p.id)).size, novi.length);
  for (const p of novi) {
    assert.ok(p.referenca?.length > 20, p.id);
    assert.ok(p.krogi.length >= 1 && p.krogi.every((k) => k.length > 5), p.id);
    for (const m of p.merila) assert.ok(MERILA[m], `${p.id}: ${m}`);
    // Profil ostane, kot je zapisan (normalizeSettings bi neveljavnega tiho zamenjal s privzetim).
    const s = normalizeSettings(p.profil);
    assert.equal(s.subject, p.profil.subject, p.id);
    assert.equal(s.educational_track, p.profil.educational_track, p.id);
    assert.equal(s.curriculum_level, p.profil.curriculum_level, p.id);
    if (p.skupina === "predstave") {
      assert.ok(p.predstava, p.id);
      assert.deepEqual(p.merila, ["napaka", "predstava", "trditve", "raven"]);
      // Učenec preveri svoj odgovor, ne prosi za rešitev (meri se, ali inštruktor ujame napako).
      for (const k of p.krogi) assert.equal(asksForSolution(k), false, `${p.id}: ${k}`);
    } else assert.ok(p.merila.includes("rezultat"), p.id);
  }
});

test("reference s številkami: preračunane neodvisno s kodo", () => {
  const Ar = { H: 1.008, C: 12.011, N: 14.007, O: 15.999, Ca: 40.08 };
  const ref = (id) => novi.find((p) => p.id === id).referenca;
  const ima = (id, ...vrednosti) => vrednosti.forEach((v) => assert.ok(ref(id).includes(v), `${id}: »${v}«`));
  const z = (x, d) => x.toFixed(d).replace(".", ",");
  ima("kem-molska-masa-caco3", z(Ar.Ca + Ar.C + 3 * Ar.O, 2).slice(0, 5)); // 100,09
  const MH2O = 2 * Ar.H + Ar.O;
  ima("kem-mnozina-vode", z(9 / MH2O, 2), z(MH2O, 2)); // 0,50 mol; 18,02 g/mol
  ima("kem-stehiometrija-metan", z((16 / (Ar.C + 4 * Ar.H)) * (Ar.C + 2 * Ar.O), 1)); // 43,9 g
  ima("kem-redcenje", z((0.5 * 250) / 2, 1)); // 62,5 mL
  ima("kem-molski-volumen", z(0.5 * 22.4, 1)); // 11,2 L
  ima("kem-omejujoci-reaktant", z((2 / (2 * Ar.H)) * MH2O, 1)); // 17,9 g
  ima("kem-ph-hcl", `= ${-Math.log10(0.01)}`);
  ima("kem-ph-naoh", `= ${14 + Math.log10(0.001)}`);
  ima("kem-masni-delez", `${(20 / 200) * 100} %`);
  ima("kem-oksidacijsko-mn", `+${0 - 1 - 4 * -2}`);
  ima("bio-hardy-weinberg", z(2 * 0.6 * Math.sqrt(0.16), 2), "48 %");
  ima("pr-ulomki-sestevanje", "5/6");
  ima("pr-odstotki-osnova", z(1.2 * 0.8, 2), `${Math.round((1 - 1.2 * 0.8) * 100)} %`);
  ima("pr-ohm-obratno", `${12 / 4} A`);
  ima("pr-kineticna-polovica", `${0.5 * 2 * 3 ** 2} J`);
  ima("pr-kmh-ms", `${72 / 3.6} m/s`);
  ima("pr-gostota-enote", `${500 / 250} g/cm³`, `${(500 / 250) * 1000} kg/m³`);
  ima("pr-pospesek-predznak", `−${(20 - 10) / 5} m/s²`);
  ima("pr-amonijak-razmerje", `${(3 * 2) / 3} mol`);
  ima("pr-ph-redcenje", `pH = ${-Math.log10(0.01 / 10)}`);
  ima("pr-deljenje-z-ulomkom", `= ${6 / 0.5}`);
  ima("pr-koren-vsote", `= ${Math.sqrt(9 + 16)}`);
});

test("sestava: stalen vzorec maturitetnih korakov zajame vse vrste; referenca ni v sporočilih učenca", () => {
  const matura = beri("./fixtures/napacni-koraki-matura.json").primeri;
  const vzorec = vzorecPoVrsti(matura, 8);
  assert.equal(vzorec.length, 20);
  assert.deepEqual(new Set(vzorec.map((p) => p.vrsta)), new Set(matura.map((p) => p.vrsta)));
  assert.deepEqual(vzorecPoVrsti(matura, 8), vzorec, "stalen izbor");
  const vsi = sestaviPrimere({ novi, astra: beri("./fixtures/astra-vprasanja.json").primeri, pedagogika: beri("./fixtures/pedagogika-12.json").pogovori, matura: vzorec });
  assert.equal(vsi.length, 78);
  assert.equal(new Set(vsi.map((p) => p.id)).size, 78);
  for (const p of vsi) {
    assert.ok(SKUPINE.includes(p.skupina));
    for (const k of p.krogi) assert.ok(!k.includes(p.referenca), p.id);
  }
  const mat = vsi.find((p) => p.skupina === "matura");
  assert.equal(mat.zgodovina[0].vloga, "ucenec");
  assert.equal(mat.zgodovina[1].vloga, "instruktor");
  // Ocenjevalec dobi profil, pogovor, referenco in samo merila primera; nič o različici ali modelu.
  const q = vprasanjeOcenjevalcu(mat, [{ ucenec: mat.krogi[0], evklid: "Odgovor." }]);
  assert.match(q, /REFERENCE \(teacher\)/);
  for (const m of Object.keys(MERILA)) assert.equal(q.includes(`- ${m}:`), mat.merila.includes(m), m);
  assert.doesNotMatch(q, /kandidat|haiku|sonnet|opus|system_prompt/i);
  const obrnjeno = vprasanjeOcenjevalcu(mat, [], { obrni: true });
  assert.ok(obrnjeno.indexOf("- raven:") < obrnjeno.indexOf("- napaka:"));
  // Preizkus 3 nima reference: ocenjevalec rešuje sam.
  const [p3] = sestaviPrimere({ preizkus3: [{ id: 7, q: "Reši x^2 = 4.", nastavitve: { subject: "MAT" } }] });
  assert.equal(p3.id, "p3-7");
  assert.match(vprasanjeOcenjevalcu(p3, []), /REFERENCE: none/);
});

test("branje ocene: samo veljaven JSON z vsemi merili; pedagogika 1–10, ko je zahtevana", () => {
  const m = ["napaka", "trditve"];
  assert.deepEqual(preberiOceno('Nekaj pred {"merila": {"napaka": "da", "trditve": "NE"}, "pedagogika": null, "napake": ["x = 3 ni prav"]}', m), { merila: { napaka: "DA", trditve: "NE" }, pedagogika: null, napake: ["x = 3 ni prav"] });
  assert.equal(preberiOceno('{"merila": {"napaka": "DA"}}', m), null, "manjka merilo");
  assert.equal(preberiOceno('{"merila": {"napaka": "DA", "trditve": "MORDA"}}', m), null, "neznana vrednost");
  assert.equal(preberiOceno("OK", m), null);
  assert.equal(preberiOceno('{"merila": {"napaka": "DA", "trditve": "DA"}, "pedagogika": 11}', m, true), null);
  assert.equal(preberiOceno('{"merila": {"napaka": "DA", "trditve": "DA"}, "pedagogika": 7}', m, true).pedagogika, 7);
});

test("združevanje: tretji ocenjevalec ob razhajanju, odloči večina; ujemanje in kapa", () => {
  const m = ["rezultat", "trditve"];
  const o = (r, t, p = null) => ({ merila: { rezultat: r, trditve: t }, pedagogika: p, napake: [] });
  assert.equal(potrebenTretji(o("DA", "DA"), o("DA", "DA"), m), false);
  assert.equal(potrebenTretji(o("DA", "DA"), o("DA", "NE"), m), true);
  assert.equal(potrebenTretji(o("DA", "DA", 9), o("DA", "DA", 5), m), true, "pedagogika za več kot 2");
  assert.equal(potrebenTretji(o("DA", "DA"), null, m), true);
  assert.deepEqual(zdruziOcene([o("DA", "DA", 9), o("DA", "NE", 7), o("DA", "NE", 8)], m), { merila: { rezultat: "DA", trditve: "NE" }, pedagogika: 8 });
  assert.equal(zdruziOcene([o("DA", "DA"), o("NE", "DA"), o("NR", "DA")], m).merila.rezultat, "NEODLOCENO");
  const izid = [
    { id: "a", skupina: "kem", ocene: [o("DA", "DA"), o("DA", "DA")], koncna: { merila: { rezultat: "DA", trditve: "DA" }, pedagogika: null } },
    { id: "b", skupina: "kem", ocene: [o("NE", "DA"), o("DA", "DA"), o("NE", "DA")], koncna: { merila: { rezultat: "NE", trditve: "DA" }, pedagogika: null } },
  ];
  const u = ujemanje(izid);
  assert.equal(u.parov, 4);
  assert.equal(u.delez, 0.75);
  assert.ok(u.kapa < 0.75 && u.kapa > -1);
  const pov = povzetek(izid);
  assert.deepEqual(pov.skupine.kem.merila.rezultat, { DA: 1, NE: 1, NR: 0, NEODLOCENO: 0 });
  assert.deepEqual(pov.skupine.kem.zNapako, ["b"]);
});

test("primerjava pred/po: slabše, če ima katero merilo na istih primerih več NE ali pade pedagogika", () => {
  const r = (id, merila, pedagogika = null) => ({ id, koncna: { merila, pedagogika } });
  const prej = { izid: [r("a", { rezultat: "DA", trditve: "NE" }, 8), r("b", { rezultat: "DA", trditve: "DA" }, 8), r("c", { rezultat: "NE" })] };
  const enako = { izid: [r("a", { rezultat: "DA", trditve: "DA" }, 8), r("b", { rezultat: "DA", trditve: "DA" }, 9)] };
  const p1 = primerjaj(prej, enako);
  assert.equal(p1.primerov, 2, "samo skupni primeri");
  assert.deepEqual(p1.slabse, []);
  assert.deepEqual(p1.izboljsani, ["a:trditve"]);
  const slabse = { izid: [r("a", { rezultat: "NE", trditve: "DA" }, 8), r("b", { rezultat: "DA", trditve: "DA" }, 6)] };
  const p2 = primerjaj(prej, slabse);
  assert.deepEqual(p2.slabse, ["rezultat", "pedagogika"]);
  assert.deepEqual(p2.poslabsani, ["a:rezultat"]);
  // Ukazna vrstica: izhod 0 brez poslabšanja, 2 s poslabšanjem.
  const d = tmpDir();
  const pot = (ime, v) => (fs.writeFileSync(path.join(d, ime), JSON.stringify(v)), path.join(d, ime));
  const cli = (b) => spawnSync(process.execPath, ["scripts/zlati-nabor-ocena.mjs", "--primerjaj", pot("a.json", prej), pot("b.json", b)], { encoding: "utf8" });
  const ok = cli(enako);
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /IZID: ni slabše v nobenem merilu/);
  const slabo = cli(slabse);
  assert.equal(slabo.status, 2);
  assert.match(slabo.stdout, /rezultat: 0 → 1 {2}SLABŠE/);
});

test("meri-zlati-nabor: --suho brez klica; neveljavni argumenti in preizkus3 brez ključa končajo z 1", () => {
  const suho = spawnSync(process.execPath, [skripta, "--suho"], { encoding: "utf8", env });
  assert.equal(suho.status, 0, suho.stderr);
  assert.match(suho.stdout, /78 primerov \(bio 11, kem 11, predstave 14, astra 10, pedagogika 12, matura 20\), 103 sporočil; način think/);
  assert.match(suho.stdout, /Različica: trenutni inštruktor \(system_prompt\.md\); izid data\/meri-zlati-nabor\.json/);
  const kand = spawnSync(process.execPath, [skripta, "--suho", "--kandidat", "--del", "2-3"], { encoding: "utf8", env });
  assert.equal(kand.status, 0, kand.stderr);
  assert.match(kand.stdout, /Različica: KANDIDAT .*izid data\/meri-zlati-nabor-kandidat-2-3\.json/);
  assert.match(kand.stdout, /^26 primerov/m);
  // Argumenti morajo prestati filter vnosov v .github/workflows/meri.yml (samo a-z 0-9 presledek , = . -).
  const wf = fs.readFileSync(new URL("../.github/workflows/meri.yml", import.meta.url), "utf8");
  const vzorec = /if \[\[ ! "\$ARGUMENTI" =~ \^\[(.*?)\]\*\$ \]\]/.exec(wf);
  assert.ok(vzorec, "filter argumentov v meri.yml");
  assert.match("--skupine bio,kem,preizkus3 --del 1-3 --kandidat --nacin chat --hkrati 4", new RegExp(`^[${vzorec[1].replace("\\ ", " ")}]*$`));
  for (const slab of [["--max-usd", "9"], ["--nacin", "deep"], ["--max-usd=1"], ["--skupine", "bio,bio"], ["--skupine", "fiz"], ["--del", "4-3"], ["--hkrati", "9"], ["--primeri", "ni-takega"], ["--skupine", "preizkus3"]]) {
    assert.equal(spawnSync(process.execPath, [skripta, "--suho", ...slab], { encoding: "utf8", env }).status, 1, slab.join(" "));
  }
  // V GitHub Actions brez ključa ni Preizkusa 3, tudi z lokalno datoteko ne.
  const gh = spawnSync(process.execPath, [skripta, "--suho", "--skupine", "preizkus3", "--p3-datoteka", "x.json"], { encoding: "utf8", env: { ...env, GITHUB_ACTIONS: "true" } });
  assert.equal(gh.status, 1);
});

test("meri-zlati-nabor --preizkus: pravi pogovor skozi aplikacijo, dva ocenjevalca, povzetek v datoteki (0 $)", () => {
  const out = path.join(tmpDir(), "izid.json");
  const r = spawnSync(process.execPath, [skripta, "--preizkus", "--skupine", "predstave,pedagogika,matura", "--primeri", "pr-ohm-obratno,ped-P01-kvadratna,mat-minus-pred-oklepajem"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out }, timeout: 180000 });
  assert.equal(r.status, 0, r.stderr + r.stdout.slice(-500));
  const izid = JSON.parse(fs.readFileSync(out, "utf8"));
  assert.equal(izid.koncano, true);
  assert.equal(izid.ustavljeno, false);
  assert.deepEqual(izid.izid.map((x) => x.id), ["pr-ohm-obratno", "ped-P01-kvadratna", "mat-minus-pred-oklepajem"]);
  const ped = izid.izid[1];
  assert.equal(ped.prepis.length, 3);
  assert.equal(ped.ocene.length, 2);
  assert.equal(ped.koncna.pedagogika, 8);
  assert.equal(izid.povzetek.skupine.predstave.merila.predstava.DA, 1);
  assert.match(r.stdout, /\| predstave \| 1 \|/);
});

test("meri-zlati-nabor: rezerva pred sporočilom nad mejo → ustavi se brez klica in konča z 1", () => {
  const out = path.join(tmpDir(), "izid.json");
  const r = spawnSync(process.execPath, [skripta, "--preizkus", "--skupine", "kem", "--max-usd", "0.1"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out }, timeout: 60000 });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /ustavljeno pred mejo 0\.1 \$/);
  assert.equal(JSON.parse(fs.readFileSync(out, "utf8")).ustavljeno, true);
});

test("meri-zlati-nabor preizkus3: izid šifriran s ključem, v dnevniku ni besedila naloge", () => {
  const d = tmpDir();
  const naloge = path.join(d, "naloge.json");
  const skrivno = "Skrivna naloga: reši 3x + 1 = 10.";
  fs.writeFileSync(naloge, JSON.stringify({ naloge: [{ id: 1, q: skrivno, nastavitve: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT", solving_mode: "B" } }, { id: 2, q: "Druga.", nastavitve: { subject: "MAT" } }] }));
  const kljuc = crypto.randomBytes(32).toString("base64");
  const out = path.join(d, "izid.json");
  const r = spawnSync(process.execPath, [skripta, "--preizkus", "--skupine", "preizkus3", "--p3-datoteka", naloge], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out, PREIZKUS3_KLJUC: kljuc }, timeout: 60000 });
  assert.equal(r.status, 0, r.stderr + r.stdout.slice(-500));
  assert.ok(!r.stdout.includes(skrivno));
  const surovo = fs.readFileSync(out, "utf8");
  assert.ok(!surovo.includes(skrivno), "izid ni v čistem besedilu");
  const izid = JSON.parse(odsifriraj(surovo, kljucIz(kljuc)));
  // Vsaka 5. naloga: iz dveh samo prva.
  assert.deepEqual(izid.izid.map((x) => x.id), ["p3-1"]);
  assert.equal(izid.izid[0].prepis[0].ucenec, skrivno);
  assert.match(r.stdout, /preizkus3 \(brez reference\)/);
});
