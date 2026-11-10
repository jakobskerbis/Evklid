// Fotografski prikaz laboratorija (public/sim/foto.js, scripts/lab-foto/; docs/laboratorij.md »Fotografski prikaz«).
// Brez brskalnika: stikalo je privzeto izklopljeno, sloji in sidra v meta.json se ujemajo z modeli poskusov (merilo
// birete, prostornina bučke, menisk iz Young–Laplaceove enačbe, barvne kode uporov, vezava in polariteta vodnikov),
// slike obstajajo v vseh gostotah in so dovolj majhne za telefon (≤ 600 KB na poskus).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import SL from "../public/i18n/sl.js";
import { fotoVklopljen, fotoNaVoljo, vodnikiKroga, visinaIzProstornine, eksponent, gostota, OKNA_TITRACIJA, OKNA_DOKAZ, OKNA_KROG } from "../public/sim/foto.js";
import { BIRETA } from "../public/sim/lab-model-titracija.js";
import { LOADS, UPOR, AM_RANGES, VM_RANGES } from "../public/sim/lab-model.js";
import { BANDS } from "../public/sim/lab-fiz.js";

const FOTO = path.resolve("public/sim/foto");
const meta = (p) => JSON.parse(fs.readFileSync(path.join(FOTO, p, "meta.json"), "utf8"));
const POSKUSI = ["titracija", "dokaz", "krog"];

test("stikalo je privzeto izklopljeno in prevedeno v vse jezike", () => {
  assert.equal(fotoNaVoljo(), false);
  assert.equal(fotoVklopljen(), false);
  assert.ok(SL["sim.lab.foto"]);
  for (const f of fs.readdirSync("public/i18n/ui")) assert.ok(JSON.parse(fs.readFileSync(`public/i18n/ui/${f}`, "utf8"))["sim.lab.foto"], `${f}: sim.lab.foto`);
  // motorji narišejo risbo, kadar risi() vrne false (rezerva brez povezave in pri »manj podatkov«)
  for (const [f, klic] of [["lab-titracija.js", "risiTitracijo"], ["lab-indikatorji.js", "risiDokaz"], ["lab-fiz.js", "risiKrog"]]) {
    const src = fs.readFileSync(`public/sim/${f}`, "utf8");
    assert.match(src, new RegExp(`foto\\.risi\\(\\(o, meta\\) => ${klic}\\(`), f);
  }
});

test("gostota slik: telefon 3× ali 2×, redek zaslon 1×, nikoli gostota, ki je ni", () => {
  assert.equal(gostota([1, 2, 3], 3, 360), 3);
  assert.equal(gostota([1, 2, 3], 2, 360), 2);
  assert.equal(gostota([1, 2, 3], 1, 360), 1);
  assert.equal(gostota([1, 2, 3], 1, 1280), 2);
  assert.equal(gostota([1, 2], 3, 360), 2);
});

test("vsak sloj ima slike v vseh gostotah in formatih; telefon naloži največ 600 KB na poskus", () => {
  for (const p of POSKUSI) {
    const m = meta(p);
    assert.equal(m.poskus, p);
    assert.ok(m.gostote.includes(1) && m.gostote.includes(2), `${p}: gostoti 1× in 2×`);
    for (const n of m.nujni) assert.ok(m.sloji[n], `${p}: nujni sloj ${n}`);
    for (const g of m.gostote) {
      let vsota = { webp: 0, avif: 0 };
      for (const [ime, s] of Object.entries(m.sloji)) {
        for (const f of s.brezIzgub ? ["webp"] : m.formati) {
          const pot = path.join(FOTO, p, `${ime}@${g}x.${f}`);
          assert.ok(fs.existsSync(pot), `manjka ${p}/${ime}@${g}x.${f}`);
          vsota[f] += fs.statSync(pot).size;
          if (s.brezIzgub) vsota.avif += fs.statSync(pot).size;
        }
        assert.ok(s.w > 0 && s.h > 0 && s.x >= 0 && s.y >= 0, `${p}/${ime}: izrez`);
      }
      // vsi sloji poskusa skupaj (v resnici se naložijo le tisti, ki jih stanje potrebuje)
      for (const f of m.formati) assert.ok(vsota[f] <= 600 * 1024, `${p} ${g}× ${f}: ${Math.round(vsota[f] / 1024)} KB > 600 KB`);
    }
  }
});

test("titracija: merilo birete iz modela, odčitek na spodnjem robu meniska, prostornina bučke", () => {
  const m = meta("titracija"), A = m.sidra.celota;
  // 50 mL = 50 · 10,5 mm pri 0,6 enote/mm (kamera ortografska: preslikava je linearna)
  assert.equal(m.bireta.mmNaML, BIRETA.mmNaML);
  assert.ok(Math.abs(A.bireta50[1] - A.bireta0[1] - BIRETA.V * BIRETA.mmNaML * m.merila.celota) < 0.2, "dolžina lestvice v oknu celote");
  assert.ok(Math.abs(A.bireta0[0] - A.bireta50[0]) < 0.01, "bireta je navpična");
  assert.ok(A.konica[1] > A.buckaVrh[1] && A.konica[1] < A.buckaVrh[1] + 15 * m.merila.celota + 1, "konica birete je v vratu bučke");
  // povečava: 9 enot/mm, kamera v višini meniska (0°), gladina na sredini okna
  assert.equal(m.merila.visinaKamere.menisk, 0);
  assert.ok(Math.abs(m.sidra.menisk.gladina[1] - OKNA_TITRACIJA.menisk[3] / 2) < 0.5);
  assert.ok(Math.abs(m.sidra.menisk.desno - m.sidra.menisk.levo - m.bireta.notranji * m.merila.menisk) < 0.2, "notranji premer 11 mm v povečavi");
  // menisk: neodvisna integracija Young–Laplaceove enačbe (voda 20 °C, kot omočenja 0°) da isto višino kot izris
  const a = m.optika.kapilarnaMm, R = m.bireta.notranji / 2;
  const strel = (k0) => {
    let r = 0, z = 0, fi = 0;
    const ds = a / 2000;
    for (let i = 0; i < 1e6; i++) {
      fi += (2 * k0 + z / (a * a) - (r < 1e-9 ? k0 : Math.sin(fi) / r)) * ds;
      r += Math.cos(fi) * ds; z += Math.sin(fi) * ds;
      if (fi >= Math.PI / 2) return { prej: true, z };
      if (r >= R) return { prej: false, z };
    }
  };
  let lo = 0, hi = 2;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; strel(mid).prej ? (hi = mid) : (lo = mid); }
  const visina = strel(lo).z;
  assert.ok(visina > 1.5 && visina < 3.9, `višina meniska ${visina} mm`); // med polkroglo ob majhnem Bondovem številu in ravno steno √2·a
  assert.ok(Math.abs(visina - m.bireta.meniskMm) < 0.05, `menisk: test ${visina.toFixed(3)} mm, izris ${m.bireta.meniskMm} mm`);
  assert.ok(Math.abs(a - Math.sqrt(0.0728 / (998.2 * 9.81)) * 1000) < 0.02, "kapilarna dolžina vode");
  // bučka: tabela V(h) prave notranje oblike narašča, 25 mL vzorca + 50 mL titranta ostane pod izrisano gladino
  const T = m.bucka.VodH;
  for (let i = 1; i < T.length; i++) assert.ok(T[i][1] > T[i - 1][1] && T[i][0] > T[i - 1][0]);
  assert.ok(visinaIzProstornine(T, 78) < m.bucka.polnaMm, "78 mL je pod gladino polne slike");
  assert.ok(Math.abs(visinaIzProstornine(T, T[40][1]) - T[40][0]) < 1e-9);
  // stožec z notranjim polmerom 30,7 → 9,7 mm v 80 mm (ISO 1773, stena 1,3 mm): prostornina do 40 mm brez zaobljenega dna
  const k = (32 - 11) / 80, R0 = 32 - 1.3, V40 = (Math.PI * (R0 ** 3 - (R0 - k * 40) ** 3)) / (3 * k) / 1000;
  const iz = T.find((t) => t[0] >= 40)[1];
  assert.ok(iz < V40 && iz > 0.93 * V40, `V(40 mm) = ${iz} mL, stožec ${V40.toFixed(1)} mL`);
  assert.ok(Math.abs(m.optika.nSteklo - 1.474) < 0.01 && Math.abs(m.optika.nVoda - 1.333) < 0.002);
});

test("barva raztopine po Beer–Lambertu: pri referenčni debelini je točno barva iz modela", () => {
  // sloj debeline hrani t = exp(−L/Lref); filter izračuna t^E, E = −ln c
  for (const c of [255, 200, 128, 30, 4]) {
    for (const u of [0.25, 1, 1.5]) assert.ok(Math.abs(Math.exp(-u) ** eksponent(c) - (c / 255) ** u) < 1e-9);
  }
  assert.equal(Math.abs(eksponent(255)), 0); // brezbarvna raztopina slike ne spremeni
});

test("dokazne reakcije: šest epruvet 16 × 160 mm v merilu, gladina iz izrisa", () => {
  const m = meta("dokaz"), D = m.sidra.dokaz;
  assert.equal(D.epruvete.length, 6);
  assert.deepEqual([m.epruveta.premer, m.epruveta.dolzina], [16, 160]);
  for (let i = 1; i < 6; i++) assert.ok(Math.abs(D.epruvete[i][0] - D.epruvete[i - 1][0] - 40 * m.merila.dokaz / Math.cos((6 * Math.PI) / 180)) < 0.05);
  assert.ok(Math.abs(D.dnoZnotraj - D.gladina - m.epruveta.gladinaMm * m.merila.dokaz) < 0.1);
  assert.ok(D.pult + 30 < OKNA_DOKAZ.dokaz[3], "napisa pod epruvetami sta v risbi");
  assert.equal(m.epruveta.lref, 16 - 2 * m.epruveta.stena);
});

test("električni krog: vodniki za vsako vezavo sestavijo pravi krog s pravo polariteto", () => {
  const m = meta("krog");
  const konca = { P: "P+", N: "P-", L1: "L1", L2: "L2", AmA: "A+", A10: "A+", ACOM: "A-", VV: "V+", VCOM: "V-" };
  for (const amPos of ["zaporedno", "vzporedno", "brez"]) for (const vmPos of ["zaporedno", "vzporedno", "brez"]) for (const obm of Object.keys(AM_RANGES)) {
    const v = vodnikiKroga(amPos, vmPos, obm);
    for (const ime of v) assert.ok(m.sloji[`krog-vod-${ime}`], `manjka sloj vodnika ${ime}`);
    const g = {}; // graf: vozlišče → sosedje; merilnik je povezava med svojima priključkoma
    const dodaj = (a, b) => ((g[a] ||= new Set()).add(b), (g[b] ||= new Set()).add(a));
    for (const ime of v) { const [a, b] = ime.split("-").map((k) => konca[k]); dodaj(a, b); }
    const pot = (od, do_, brez = []) => { const vid = new Set([od]), q = [od]; while (q.length) { const x = q.pop(); if (x === do_) return true; for (const y of g[x] || []) if (!vid.has(y) && !brez.includes(y)) vid.add(y), q.push(y); } return false; };
    if (amPos !== "brez") dodaj("A+", "A-");
    if (vmPos !== "brez") dodaj("V+", "V-");
    assert.ok(pot("P+", "L1") && pot("L2", "P-"), `${amPos}/${vmPos}: porabnik je med + in −`);
    // zaporedni merilnik: brez njega tok ne pride do porabnika; tok vstopa v + (mA ali 10 A) in izstopa iz COM
    if (amPos === "zaporedno") assert.ok(!pot("P+", "L1", ["A+"]) && v.includes(obm === "10" ? "P-A10" : "P-AmA"), "ampermeter zaporedno");
    if (vmPos === "zaporedno") assert.ok(!pot("P+", "L1", ["V+"]), "voltmeter zaporedno");
    // vzporedni merilnik: + na strani L1 (višji potencial), COM na L2
    if (vmPos === "vzporedno") assert.ok(v.includes("VV-L1") && v.includes("VCOM-L2"));
    if (amPos === "vzporedno") assert.ok(v.includes(obm === "10" ? "A10-L1" : "AmA-L1") && v.includes("ACOM-L2"));
    assert.equal(v.filter((x) => x.includes("A10")).length, amPos !== "brez" && obm === "10" ? 1 : 0, "priključek 10 A samo na območju 10 A");
  }
  // rdeč vodnik s pozitivne strani, črn iz COM ali proti minusu
  for (const [ime, d] of Object.entries(m.vodniki)) assert.equal(d.barva, /^(ACOM|VCOM|L2)-/.test(ime) ? "crna" : "rdeca", ime);
  for (const r of Object.keys(AM_RANGES)) if (r !== "200m") assert.ok(m.sloji[`krog-gumb-am-${r}`], `gumb ampermetra ${r}`);
  for (const r of Object.keys(VM_RANGES)) if (r !== "20") assert.ok(m.sloji[`krog-gumb-vm-${r}`], `gumb voltmetra ${r}`);
  for (const id of Object.keys(LOADS)) assert.ok(m.sloji[`krog-breme-${id}`] && m.sloji[`makro-${id}`], `porabnik ${id}`);
  for (const k of ["psuZaslon", "amLcd", "vmLcd"]) assert.equal(m.sidra.krog[k].length, 3);
  assert.ok(OKNA_KROG.makro[1] + OKNA_KROG.makro[3] <= OKNA_KROG.krog[3]);
});

test("barvni obročki izrisanih uporov po IEC 60062 ustrezajo upornosti iz modela", () => {
  const m = meta("krog");
  assert.equal(m.upornik.moc, UPOR.P);
  const BARVA = ["#000", "#7b4a12", "#d62728", null, "#f2c500", null, null, "#8e44ad"]; // števka → barva risbe (lab-fiz.js BANDS)
  for (const [id, L] of Object.entries(LOADS)) {
    if (L.type !== "R") continue;
    const [a, b, e, tol] = m.upornik.kode[id];
    assert.equal((a * 10 + b) * 10 ** e, L.nom, `${id}: ${a}${b}×10^${e}`);
    assert.equal(tol, "zlata"); // ±5 %
    assert.deepEqual([BARVA[a], BARVA[b], BARVA[e]], BANDS[id].slice(0, 3), `${id}: enake barve kot v risbi`);
  }
});
