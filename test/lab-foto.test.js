// Fotografski prikaz laboratorija (public/sim/foto.js, scripts/lab-foto/; docs/laboratorij.md »Fotografski prikaz«).
// Brez brskalnika: stikalo je privzeto vklopljeno, sloji in sidra v meta.json se ujemajo z modeli poskusov (merilo
// birete, prostornina bučke, menisk iz Young–Laplaceove enačbe, barvne kode uporov, vezava in polariteta vodnikov),
// slike obstajajo v vseh gostotah in so dovolj majhne za telefon (≤ 600 KB na poskus).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import SL from "../public/i18n/sl.js";
import { fotoVklopljen, fotoIzbran, vodnikiKroga, visinaIzProstornine, eksponent, gostota, OKNA_TITRACIJA, OKNA_DOKAZ, OKNA_KROG } from "../public/sim/foto.js";
import { BIRETA } from "../public/sim/lab-model-titracija.js";
import { LOADS, UPOR, AM_RANGES, VM_RANGES, Co2Bench, ACIDS, APNICA } from "../public/sim/lab-model.js";
import { BANDS } from "../public/sim/lab-fiz.js";
import { OKNA_PH, barvaVzorca, gladinaEpruvete, zaslonPh } from "../public/sim/foto-ph.js";
import { PH_VZORCI, PH_KOLICINE } from "../public/sim/lab-model-indikatorji.js";
import { OKNA_PLAMENSKA, SPEKTROSKOP_FOTO, oblikaPlamena, barvaVzorca as barvaSoli, barvePlamena, kobaltovoSteklo, zarenje, nasici } from "../public/sim/foto-plamenska.js";
import { PlamenBench, VZORCI, barvaSpektra, spekterPlamena, spekterSoli } from "../public/sim/lab-model-reakcije.js";
import { OKNA_CO2, BARVE_TEKOCIN, meriloKupcka, visinaPene, zaslon } from "../public/sim/foto-co2.js";

import { OKNA_PREVODNOST, vodnikiPrevodnosti, prosojnostSvetenja, prosojnostMehurckov } from "../public/sim/foto-prevodnost.js";
import { MATERIALI, TESTER, tester } from "../public/sim/lab-model-elektrika.js";
const FOTO = path.resolve("public/sim/foto");
const meta = (p) => JSON.parse(fs.readFileSync(path.join(FOTO, p, "meta.json"), "utf8"));
const POSKUSI = ["titracija", "dokaz", "krog", "ph", "plamenska", "co2", "prevodnost"];

test("stikalo je privzeto vklopljeno (j, 2026-11-24) in prevedeno v vse jezike", () => {
  assert.equal(fotoIzbran(), true);
  assert.equal(fotoVklopljen(), true);
  assert.ok(SL["sim.lab.foto"]);
  for (const f of fs.readdirSync("public/i18n/ui")) assert.ok(JSON.parse(fs.readFileSync(`public/i18n/ui/${f}`, "utf8"))["sim.lab.foto"], `${f}: sim.lab.foto`);
  // motorji narišejo risbo, kadar risi() vrne false (rezerva brez povezave in pri »manj podatkov«)
  for (const [f, klic] of [["lab-titracija.js", "risiTitracijo"], ["lab-indikatorji.js", "risiDokaz"], ["lab-fiz.js", "risiKrog"], ["lab-elektrika.js", "risiPrevodnost"], ["lab-indikatorji.js", "risiPh"], ["lab-reakcije.js", "risiPlamensko"], ["lab-kem.js", "risiCo2"]]) {
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

test("pH snovi: merila, gladini in elektroda iz modela, barve samo iz modela", () => {
  const m = meta("ph"), S = m.sidra.ph, k = m.merila.ph;
  // ortografska kamera: navpične razdalje so mm · 0,66 enote
  assert.ok(Math.abs(S.epruvetaDno - S.epruvetaVrh - (160 - m.epruveta.dno) * k) < 0.05, "epruveta 160 mm");
  assert.ok(Math.abs(S.casaDno - S.casaVrh - (m.casa.visina - m.casa.dno) * k) < 0.05, "čaša 95 mm");
  assert.deepEqual([m.epruveta.premer, m.epruveta.dolzina, m.casa.premer, m.casa.visina], [16, 160, 70, 95]);
  // papir: mere iz modela, v merilu
  assert.deepEqual([m.papir.sirina, m.papir.dolzina, m.papir.mokro], [PH_KOLICINE.papir.sirina, PH_KOLICINE.papir.dolzina, PH_KOLICINE.papir.mokro]);
  const [[, y0], [, y1]] = S.papir;
  assert.ok(Math.abs(y1 - y0 - m.papir.dolzina * k) < 0.05 && Math.abs(S.papirMokro - y0 - m.papir.mokro * k) < 0.05);
  // gladini: izris je pri gladini iz modela (100 mL v čaši, 4 mL v epruveti)
  assert.equal(m.casa.V, PH_KOLICINE.casaMl);
  assert.equal(m.epruveta.V, PH_KOLICINE.epruvetaMl);
  const T = m.casa.VodH;
  for (let i = 1; i < T.length; i++) assert.ok(T[i][1] > T[i - 1][1]);
  const hc = visinaIzProstornine(T, PH_KOLICINE.casaMl);
  assert.ok(Math.abs(hc - m.casa.gladinaMm) < 0.3, `čaša: model ${hc.toFixed(2)} mm, izris ${m.casa.gladinaMm} mm`);
  // valj z notranjim polmerom: nekaj več, ker ima čaša zaobljen prehod v dno (R 5,6 mm) in steno, ki se proti dnu zoži za 0,4 mm
  const Ri = m.casa.premer / 2 - m.casa.stena, valj = (Math.PI * Ri * Ri * hc) / 1000;
  assert.ok(valj > PH_KOLICINE.casaMl && valj < 1.06 * PH_KOLICINE.casaMl, `valj do ${hc} mm: ${valj.toFixed(1)} mL`);
  const he = gladinaEpruvete(PH_KOLICINE.epruvetaMl, m.epruveta.premer, m.epruveta.stena), r = 8 - 1.1;
  assert.ok(Math.abs((2 / 3) * Math.PI * r ** 3 + Math.PI * r * r * (he - r) - 4000) < 1, "4 mL = polkrogla + valj");
  assert.ok(Math.abs(he - m.epruveta.gladinaMm) < 0.01, `epruveta: model ${he}, izris ${m.epruveta.gladinaMm}`);
  const h5 = gladinaEpruvete(0.5, 16, 1.1);
  assert.ok(h5 < r && Math.abs((Math.PI * h5 * h5 * (3 * r - h5)) / 3 - 500) < 0.1, "krogelni odsek pod polkroglo");
  // elektroda: v vzorcu sta bučka in diafragma pod gladino, dvignjena je nad robom čaše
  const E = m.elektroda;
  assert.ok(E.vPotopljena - m.casa.dno + E.bucka + 3 < hc, "bučka in diafragma potopljeni");
  assert.ok(E.vZunaj > m.casa.visina, "dvignjena elektroda je nad čašo");
  // odrez polne čaše (gladina iz modela minus lok gladine in menisk) je znotraj izrisanega sloja
  const yc = S.casaDno - hc * k, sl = m.sloji["ph-casa-polna"];
  assert.ok(yc - Ri * k * Math.tan((8 * Math.PI) / 180) - 4 * k > sl.y && S.casaDno < sl.y + sl.h);
  // zaslon pH-metra 60 × 26 mm v ravnini zaslona
  assert.ok(Math.abs(S.lcd[1][0] - S.lcd[0][0] - 60 * k / Math.cos((8 * Math.PI) / 180)) < 0.05);
  assert.equal(zaslonPh(7.026), "7,03");
  assert.equal(zaslonPh(-0.5), "−0,50");
  // barve: brezbarvni vzorci ne obarvajo, obarvani dajo barvo modela, motni so motni
  assert.equal(barvaVzorca("hcl").barva, null);
  for (const [id, V] of Object.entries(PH_VZORCI)) {
    if (!V.barva) continue;
    const b = barvaVzorca(id);
    if (Math.min(...V.barva) >= 200) assert.deepEqual([b.barva, b.motnost], [V.barva, V.a], id);
    else V.barva.forEach((c, i) => assert.ok(Math.abs(b.barva[i] - (255 - (255 - c) * V.a)) < 1e-9, id));
  }
  assert.ok(barvaVzorca("mleko").motnost > 0 && barvaVzorca("kola").motnost === 0);
  // napisi in lestvica papirja so v risbi 400 × 262
  assert.ok(S.pult + 11 < 210 && OKNA_PH.ph[3] <= 210, "okno nad barvno lestvico");
  // nič barv v izrisu: papir in tekočine so v slojih brezbarvni (barvo doda aplikacija)
  const src = fs.readFileSync("scripts/lab-foto/prizor_ph.py", "utf8");
  assert.match(src, /snov\("papir-bel", \((0\.\d+), \1, \1\)/, "papir je v izrisu nevtralno bel");
  assert.doesNotMatch(src, /steklo\("[^"]*", [^)]*barva=/, "tekočine v izrisu so brezbarvne");
});

test("plamenska: gorilnik, zanka in urni stekli v merilu; plamen in barve samo iz modela", () => {
  const m = meta("plamenska"), S = m.sidra.plamenska, k = m.merila.plamenska, G = m.gorilnik;
  // gorilnik Ø 13 × 150 mm, podnožje Ø 90 mm; ortografska kamera: navpično 0,9 enote/mm
  assert.deepEqual([G.cev, G.visina, G.podnozje], [13, 150, 90]);
  assert.ok(Math.abs(S.podnozje[1] - S.ustje[1] - G.visina * k) < 0.05, "višina gorilnika");
  assert.ok(Math.abs(m.merila.vodoravno - k / Math.cos((m.merila.visinaKamere.plamenska * Math.PI) / 180)) < 1e-4);
  // zračna odprtina: odprti delež ploščine pri zasuku obroča (presek dveh krogov Ø 7 mm) = model (0, ½, 1)
  for (const [ime, f] of [["zrak0", 0], ["zrak05", 0.5], ["zrak1", 1]]) assert.ok(Math.abs(G.odprtost[ime] - f) < 0.002, `${ime}: ${G.odprtost[ime]}`);
  // zanka Ø 3 mm iz žice Ø 0,5 mm, 40 mm nad ustjem: v plamenu pri vsaki odprtosti in nad notranjim stožcem
  assert.deepEqual([m.zanka.premer, m.zanka.zica], [3, 0.5]);
  assert.ok(Math.abs(S.ustje[1] - S.zankaPlamen[1] - m.zanka.nadUstjem * k) < 0.05);
  for (const z of [0, 0.5, 1]) {
    const F = oblikaPlamena(z);
    assert.ok(m.zanka.nadUstjem < F.H * 0.8 && m.zanka.nadUstjem > F.stozec, `zanka v plamenu pri zrak = ${z}`);
    assert.ok(Math.abs(m.zanka.x) < F.W / 2);
  }
  // oblika plamena je ista kot v risbi (lab-reakcije.js, 1 cm = 10 enot)
  const src = fs.readFileSync("public/sim/lab-reakcije.js", "utf8");
  assert.match(src, /const Hf = \(12 - 4 \* z\) \* S, Wf = \(2\.4 - 0\.6 \* z\) \* S;/);
  assert.match(src, /const hc = \(2\.5 \+ \(1 - z\) \* 2\) \* S;/);
  for (const z of [0.5, 1]) assert.deepEqual([oblikaPlamena(z).H, oblikaPlamena(z).W, oblikaPlamena(z).stozec], [(12 - 4 * z) * 10, (2.4 - 0.6 * z) * 10, (2.5 + (1 - z) * 2) * 10]);
  assert.equal(oblikaPlamena(0).stozec, 0, "svetel plamen nima notranjega stožca");
  // HCl na urnem steklu: 2 mL v krogelni kapici V = πh²(3R − h)/3
  const H = m.hcl;
  assert.ok(Math.abs((Math.PI * H.gladinaMm ** 2 * (3 * H.Ri - H.gladinaMm)) / 3 - H.V * 1000) < 2, "gladina zaokrožena na µm");
  assert.ok(H.polmer < m.urnoSteklo.premer / 2 - 5, "HCl ne sega do roba");
  // barve plamena iz modela: saje le pri zaprti in pol odprti odprtini, sol iz črt in pasov (CIE 1931)
  assert.equal(barvePlamena({ zrak: 1 }).saje, null);
  assert.ok(barvePlamena({ zrak: 0 }).sajeA > barvePlamena({ zrak: 0.5 }).sajeA);
  for (const el of Object.keys(VZORCI)) {
    const zanka = { [el]: 1 }, c = barvaSpektra(spekterSoli(zanka));
    assert.deepEqual(barvePlamena({ zrak: 1, vPlamenu: true, zanka }).sol, nasici(c.rgb, c.Y / 10), el);
  }
  const na = barvePlamena({ zrak: 1, vPlamenu: true, zanka: { Na: 1 } }).sol, cu = barvePlamena({ zrak: 1, vPlamenu: true, zanka: { Cu: 1 } }).sol;
  assert.ok(na[0] > 200 && na[1] > 120 && na[2] < 40, `natrij rumen: ${na}`);
  assert.ok(cu[1] > 150 && cu[0] < 60, `baker modro zelen: ${cu}`);
  const sp = spekterPlamena(1), b = barvePlamena({ zrak: 1 });
  assert.deepEqual(b.modri, barvaSpektra(sp.filter((q) => q.vir === "plamen")).rgb);
  // kobaltovo steklo zadrži rumeno: prepušča malo svetlobe, modro; žareča žica je oranžna
  const kb = kobaltovoSteklo();
  assert.ok(kb.T < 0.06 && kb.rgb[2] > kb.rgb[0] && kb.rgb[1] < 5);
  const zr = zarenje();
  assert.ok(zr[0] === 255 && zr[1] > zr[2]);
  // sol na urnem steklu: vsak vzorec, ki ga poskus ponudi (tudi neznani), ima barvo; CuCl₂ je modro zelen, drugi beli
  const B = new PlamenBench({ seed: 3 });
  for (const [id, V] of Object.entries(B.vzorci)) {
    const c = barvaSoli(V.sestava);
    if ("Cu" in V.sestava) assert.deepEqual(c, [95, 179, 160], id);
    else assert.equal(c, null, id);
  }
  // okno spektroskopa ne prekrije plamena ali gorilnika in je v oknu
  const [sx, sy] = SPEKTROSKOP_FOTO;
  assert.ok(sx > S.ustje[0] + oblikaPlamena(0).W * m.merila.vodoravno && sx + 232 <= OKNA_PLAMENSKA.plamenska[2] && sy >= 0);
  // plamena v izrisu ni (nobenega svetila), sol je v izrisu nevtralno bela
  const py = fs.readFileSync("scripts/lab-foto/prizor_plamenska.py", "utf8");
  assert.doesNotMatch(py, /svetilo\(/);
  assert.match(py, /snov\("sol-bela", \((0\.\d+), \1, \1\)/);
});

test("CO₂: bučka na tehtnici, zamašek s cevko in apnica v merilu; gladina, pena, sode in motnost iz modela", () => {
  const m = meta("co2"), S = m.sidra.co2, k = m.merila.co2, F = m.bucka, E = m.epruveta;
  assert.deepEqual(OKNA_CO2.co2, [0, 0, 400, 300]);
  assert.ok(Math.abs(m.merila.vodoravno - k / Math.cos((m.merila.visinaKamere.co2 * Math.PI) / 180)) < 1e-4);
  // bučka 100 mL (ISO 1773, h 105 mm) stoji na tehtalni plošči; ortografska kamera: navpično 1 enota/mm
  assert.equal(F.visina, 105);
  assert.ok(Math.abs(S.pult - S.buckaDno[1] - (m.tehtnica.panZ + F.dno) * k) < 0.05, "dno bučke na plošči tehtnice");
  assert.ok(Math.abs(S.buckaDno[1] - S.buckaVrh[1] - (F.visina - F.dno) * k) < 0.05);
  // gladina: tabela V(h) prave notranje oblike narašča; »polna« slika pokrije vso tekočino, ki jo poskus dovoli (≤ 100 mL + šum valja)
  const T = F.VodH;
  for (let i = 1; i < T.length; i++) assert.ok(T[i][1] > T[i - 1][1] && T[i][0] > T[i - 1][0]);
  assert.ok(visinaIzProstornine(T, 101.5) < F.polnaMm, "101,5 mL je pod gladino polne slike");
  assert.ok(F.polnaMm < (S.buckaDno[1] - S.zamasek[1]) / k, "polna slika je pod zamaškom");
  // pena: tekočina + pena po isti tabeli, največ do vrha izrisane pene ali do zamaška
  assert.equal(visinaPene(F, 30, 0, null), visinaIzProstornine(T, 30));
  assert.ok(visinaPene(F, 30, 40, null) > visinaIzProstornine(T, 30));
  assert.equal(visinaPene(F, 60, 500, 91), 91);
  assert.equal(visinaPene(F, 60, 500, null), F.penaMm);
  // zamašek Ø 17/22 × 25 mm sedi v vratu (notranji Ø 22 − 2 · 1,3 mm) toliko globoko, kot ga vrat sprejme
  const Z = m.zamasek;
  assert.ok(Math.abs(Z.spodaj + ((Z.zgoraj - Z.spodaj) * Z.globina) / Z.visina - (22 - 2 * F.stena)) < 0.01);
  assert.ok(Math.abs(S.zamasek[1] - S.buckaVrh[1] - Z.globina * k) < 0.05);
  // epruveta 16 × 160 mm z 10 mL apnice (model: APNICA.V); konica cevke globoko pod gladino, nad dnom
  assert.deepEqual([E.premer, E.dolzina, E.V], [16, 160, APNICA.V * 1000]);
  assert.ok(Math.abs(E.gladinaMm - gladinaEpruvete(APNICA.V * 1000, E.premer, E.stena)) < 0.01);
  assert.ok(Math.abs(S.epruvetaDno - S.epruvetaGladina - E.gladinaMm * k) < 0.05);
  assert.ok(m.cevka.konicaMm > 5 && m.cevka.konicaMm < E.gladinaMm - 40, "mehurček gre skozi > 4 cm apnice");
  assert.ok(Math.abs(S.epruvetaDno - S.cevkaKonica[1] - m.cevka.konicaMm * k) < 0.05);
  assert.ok(m.cevka.zunaj < 2 * (E.premer / 2 - E.stena) - 6, "cevka se ne dotika sten epruvete");
  // kupček sode: 5 g pri nasipni gostoti 1,1 g/mL (stožec z zaobljenim vrhom, do 4 % manj); manjša masa = podobno telo
  const Sd = m.soda, Vk = (Math.PI * Sd.polmer ** 2 * Sd.visina) / 3;
  assert.ok(Math.abs(Vk - (Sd.masa / Sd.gostota) * 1000) < 2, `stožec ${Vk.toFixed(0)} mm³`);
  assert.ok(Math.abs(Sd.visina / Sd.polmer - Math.tan((Sd.nasip * Math.PI) / 180)) < 1e-3);
  assert.equal(meriloKupcka(5, 5), 1);
  assert.ok(Math.abs(meriloKupcka(0.625, 5) - 0.5) < 1e-12);
  assert.ok(Sd.polmer < 64 / 2 - 1.3 - 5, "kupček je na ravnem dnu");
  // zasloni: okni v ravnini sprednje plošče v pravem merilu; odčitek z decimalno vejico
  const [lz, dz, ls] = S.lcdTehtnica;
  assert.ok(Math.abs(dz[0] - lz[0] - m.zasloni.tehtnica[0] * m.merila.vodoravno) < 0.05 && Math.abs(ls[1] - lz[1] - m.zasloni.tehtnica[1] * k) < 0.05);
  assert.equal(zaslon(103.456, 2), "103,46");
  assert.equal(zaslon(0, 1), "0,0");
  // barve tekočin: le za tekočine iz modela; klorovodikova kislina in voda sta brezbarvni
  for (const id of Object.keys(BARVE_TEKOCIN)) assert.ok(id in ACIDS || id === "mesanica", id);
  assert.equal(BARVE_TEKOCIN.hcl, undefined);
  assert.equal(BARVE_TEKOCIN.voda, undefined);
  // apnica se pomotni iz modela (CaCO₃), ko gre CO₂ skozi cevko; z vodo v epruveti ne
  const B = new Co2Bench({ seed: 5 });
  B.setStopper("cevka"); B.pour("kis", 30); B.addSoda(1); B.step(20);
  assert.ok(B.milky() > 0.3 && B.events.some((e) => e.type === "motna"));
  // izris: brez plamena (svetil), tekočine brezbarvne, zasloni prazni (besedilo nariše aplikacija)
  const py = fs.readFileSync("scripts/lab-foto/prizor_co2.py", "utf8");
  assert.doesNotMatch(py, /svetilo\(/);
  assert.doesNotMatch(py, /steklo\("[^"]*", [^)]*barva=/);
  assert.match(fs.readFileSync("scripts/lab-foto/lab_prizori.py", "utf8"), /PRIZORI\["co2"\] = __import__\("prizor_co2"\)\.co2/);
});

test("prevodnost: vsaka snov iz modela ima sloj, sponki 6 cm narazen, celica v čaši ima K iz modela", () => {
  const m = meta("prevodnost"), K = m.sidra.prevodnost, V = m.snovi;
  for (const [id, mat] of Object.entries(MATERIALI)) {
    if (mat.tekocina) assert.ok(V.tekocine.includes(id), `${id}: tekočina`);
    else assert.ok(V.trdne.includes(id) && m.sloji[`vzorec-${id}`], `${id}: sloj vzorca`);
  }
  assert.equal(V.trdne.length + V.tekocine.length, Object.keys(MATERIALI).length);
  for (const n of ["vzorec-tekocina", "vzorec-tekocina-mehurcki", "sponke-tekocina", "magnet-privlaci", "magnet-blizu", "gumb-200m", "gumb-10"]) assert.ok(m.sloji[n], n);
  for (const n of ["zarnica", "led"]) assert.ok(m.sloji[`ind-${n}`] && m.sloji[`ind-${n}-sveti`], `lučka ${n} in njen sveteči sloj`);
  // kos snovi med sponkama je dolg 6 cm (model: R = ρ · 0,06 m / S); kamera ortografska, stični točki na isti višini
  assert.equal(V.razmikMm, 60);
  assert.ok(Math.abs(K.stikD[0] - K.stikL[0] - 60 * m.merila.prevodnost) < 0.01 && K.stikD[1] === K.stikL[1]);
  // žice in mina v izrisu imajo premer iz modela: R(baker) = ρ · 0,06 / (π · (d/2)²)
  const R = (rho, d) => (rho * 0.06) / (Math.PI * (d / 2000) ** 2);
  assert.ok(Math.abs(MATERIALI.baker.R / R(1.68e-8, V.debelina.baker) - 1) < 1e-9);
  assert.ok(Math.abs(MATERIALI.grafit.R / R(3e-5, V.debelina.grafit) - 1) < 1e-9);
  // ploščici: razmik 30 mm, potopljeni sirina × (gladina − dno ploščice) = 2 cm × 3 cm → K = d/A = 50 m⁻¹ kot v modelu
  const c = V.casa, A = (c.sirina / 1000) * ((c.gladinaMm - c.nad_dnom) / 1000);
  assert.ok(Math.abs(c.razmik / 1000 / A - TESTER.K) < 1e-9, `K = ${c.razmik / 1000 / A}`);
  for (const k of ["potopL", "potopD", "amLcd"]) assert.equal(K[k].length, 3, k);
  assert.ok(K.vzorec[1] < OKNA_PREVODNOST.prevodnost[3] && K.am[1] + 25 < OKNA_PREVODNOST.prevodnost[3]);
});

test("prevodnost: vodniki sklenejo krog s pravo polariteto (+ → ampermeter → lučka → desna sponka, leva sponka → −)", () => {
  const m = meta("prevodnost");
  const konca = { plus: "B+", minus: "B-", ind: "Lizh", AmA: "A+", A10: "A+", ACOM: "A-" };
  for (const am of [false, true]) for (const obm of ["200m", "10"]) for (const tek of [false, true]) {
    const v = vodnikiPrevodnosti(am, obm, tek);
    const g = {};
    const dodaj = (a, b) => ((g[a] ||= new Set()).add(b), (g[b] ||= new Set()).add(a));
    for (const ime of v) {
      assert.ok(m.sloji[`vod-${ime}`], `manjka sloj vodnika ${ime}`);
      const [a, b] = ime.split("-");
      if (b === "trdno" || b === "tekocina") dodaj(konca[a], a === "minus" ? "S-L" : "S-D");
      else dodaj(konca[a], b === "ind" ? "Lvh" : konca[b]);
    }
    dodaj("Lvh", "Lizh"); dodaj("S-L", "S-D"); dodaj("B+", "B-"); // lučka, snov med sponkama, baterija
    if (am) dodaj("A+", "A-");
    // ena sama zanka: vsako vozlišče ima dva soseda
    for (const [k, n] of Object.entries(g)) assert.equal(n.size, 2, `${am}/${obm}/${tek}: ${k}`);
    if (am) assert.ok(v.includes(obm === "10" ? "plus-A10" : "plus-AmA") && v.includes("ACOM-ind"), "tok vstopi v ampermeter skozi mA ali 10 A in izstopi iz COM");
    assert.equal(v.filter((x) => x.includes(tek ? "tekocina" : "trdno")).length, 2);
  }
  for (const [ime, d] of Object.entries(m.vodniki)) assert.equal(d.barva, /^(minus|ACOM)-/.test(ime) ? "crna" : "rdeca", ime);
});

test("prevodnost: svetenje in mehurčki iz modela, ne iz slike", () => {
  assert.equal(prosojnostSvetenja(0), 0);
  assert.equal(prosojnostSvetenja(1), 1);
  assert.equal(prosojnostSvetenja(1.5), 1);
  assert.ok(Math.abs(prosojnostSvetenja(0.5) - 0.5 ** (1 / 2.2)) < 1e-12);
  // vidni prag modela (žarnica 3 %, LED 0,25 %) da viden, a šibek sij
  for (const b of [0.03, 0.0025]) assert.ok(prosojnostSvetenja(b) > 0.05 && prosojnostSvetenja(b) < 0.25);
  assert.equal(prosojnostMehurckov(0.5e-3), 0);
  assert.ok(Math.abs(prosojnostMehurckov(0.2) - 1) < 1e-12);
  // slana voda z LED (nekaj mA): mehurčki so vidni; z žarnico jih je več
  const led = tester("slana1", "led"), zar = tester("slana20", "zarnica");
  assert.ok(led.mehurcki && prosojnostMehurckov(led.I) > 0.25 && prosojnostMehurckov(zar.I) > prosojnostMehurckov(led.I));
  assert.ok(!tester("destilirana", "zarnica").mehurcki);
});
