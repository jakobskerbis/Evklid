// Znanstvene preverbe modelov »Periodni sistem v 3D« in »Kristalne mreže« (public/3d/modeli/kemija/periodni-sistem.js, kristali.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import * as P from "../public/3d/modeli/kemija/periodni-sistem.js";
import * as K from "../public/3d/modeli/kemija/kristali.js";
import * as A from "../public/3d/modeli/kemija/atom.js";

const blizu = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} ≠ ${b} ± ${tol}`);

test("periodni sistem: 118 elementov, zaporedni Z, enolična mesta, imena", () => {
  assert.equal(P.ELEMENTI.length, 118);
  P.ELEMENTI.forEach((e, i) => assert.equal(e.Z, i + 1));
  assert.equal(new Set(P.ELEMENTI.map((e) => e.simbol)).size, 118);
  assert.equal(new Set(P.ELEMENTI.map((e) => `${e.stolpec},${e.vrstica}`)).size, 118, "dve ploščici na istem mestu");
  for (const e of P.ELEMENTI) {
    assert.ok(e.stolpec >= 1 && e.stolpec <= 18, e.simbol);
    assert.ok(e.ime && e.ime[0] === e.ime[0].toUpperCase(), e.simbol);
  }
  const ime = (s) => P.ELEMENTI.find((e) => e.simbol === s).ime;
  assert.equal(ime("Sn"), "Kositer"); assert.equal(ime("Pb"), "Svinec"); assert.equal(ime("Hg"), "Živo srebro");
  assert.equal(ime("W"), "Volfram"); assert.equal(ime("Ds"), "Darmštatij"); assert.equal(ime("Og"), "Oganeson");
  assert.equal(ime("Ts"), "Tenes"); assert.equal(ime("Lr"), "Lavrencij");
  // ista imena kot v modelu Atom (Z = 1–36)
  for (let Z = 1; Z <= 36; Z++) assert.equal(P.ELEMENTI[Z - 1].ime, A.ELEMENTI[Z - 1][1], `Z = ${Z}`);
});

test("periodni sistem: skupine, periode, bloki, kategorije", () => {
  const e = (s) => P.ELEMENTI.find((x) => x.simbol === s);
  assert.deepEqual([e("O").skupina, e("O").perioda, e("O").blok], [16, 2, "p"]);
  assert.deepEqual([e("Fe").skupina, e("Fe").perioda, e("Fe").blok], [8, 4, "d"]);
  assert.deepEqual([e("He").skupina, e("He").blok], [18, "s"]);
  assert.deepEqual([e("Hf").skupina, e("Hf").perioda], [4, 6]);
  assert.equal(e("Eu").skupina, null); assert.equal(e("Eu").blok, "f");
  const bloki = { s: 0, p: 0, d: 0, f: 0 };
  for (const x of P.ELEMENTI) bloki[x.blok]++;
  assert.deepEqual(bloki, { s: 14, p: 36, d: 38, f: 30 });
  const kat = Object.fromEntries(P.KATEGORIJE.map((k) => [k.id, P.ELEMENTI.filter((x) => x.kategorija === k.id).length]));
  assert.deepEqual(kat, { alkalijske: 6, zemeljskoalkalijske: 6, prehodne: 38, lantanoidi: 15, aktinoidi: 15, "ostale-kovine": 12, polkovine: 6, nekovine: 7, halogeni: 6, "zlahtni-plini": 7 });
  assert.equal(e("H").kategorija, "nekovine"); assert.equal(e("Si").kategorija, "polkovine"); assert.equal(e("Al").kategorija, "ostale-kovine");
});

test("periodni sistem: elektroni po lupinah seštejejo v Z, izjeme osnovnega stanja", () => {
  for (let Z = 1; Z <= 118; Z++) {
    const k = P.konfiguracija(Z);
    assert.equal(k.reduce((s, x) => s + x.e, 0), Z, `Z = ${Z}`);
    for (const x of k) assert.ok(x.e >= 1 && x.e <= 2 * (2 * x.l + 1), `Z = ${Z}: ${x.n}${"spdf"[x.l]}${x.e}`);
    const l = P.lupine(Z);
    assert.equal(l.reduce((s, x) => s + x, 0), Z);
    l.forEach((x, i) => assert.ok(x <= 2 * (i + 1) ** 2, `Z = ${Z}: lupina ${i + 1}`));
    if (Z <= 36) assert.deepEqual(l, A.lupine(Z), `Z = ${Z} kot v modelu Atom`);
  }
  assert.deepEqual(P.lupine(26), [2, 8, 14, 2]);
  assert.deepEqual(P.lupine(46), [2, 8, 18, 18]);
  assert.deepEqual(P.lupine(79), [2, 8, 18, 32, 18, 1]);
  assert.deepEqual(P.lupine(103), [2, 8, 18, 32, 32, 8, 3]);
  assert.deepEqual(P.lupine(118), [2, 8, 18, 32, 32, 18, 8]);
  assert.equal(P.skrajsano(24), "[Ar] 3d⁵ 4s¹");
  assert.equal(P.skrajsano(29), "[Ar] 3d¹⁰ 4s¹");
  assert.equal(P.skrajsano(46), "[Kr] 4d¹⁰");
  assert.equal(P.skrajsano(64), "[Xe] 4f⁷ 5d¹ 6s²");
  assert.equal(P.skrajsano(78), "[Xe] 4f¹⁴ 5d⁹ 6s¹");
  assert.equal(P.skrajsano(92), "[Rn] 5f³ 6d¹ 7s²");
});

test("periodni sistem: izbrane vrednosti lastnosti", () => {
  const e = (s) => P.ELEMENTI.find((x) => x.simbol === s);
  assert.equal(e("O").en, 3.44); assert.equal(e("F").en, 3.98); assert.equal(e("Ne").en, null);
  assert.equal(e("Fe").ar, "55.845"); assert.equal(e("C").ar, "12.011"); assert.equal(e("Tc").ar, "[97]");
  assert.equal(e("He").ie, 2372); assert.equal(e("H").ie, 1312); assert.equal(e("Na").ie, 496);
  assert.equal(e("Os").gostota, 22.59); assert.equal(e("C").polmer, 76);
  assert.equal(e("Br").stanje, "tekoce"); assert.equal(e("Hg").stanje, "tekoce"); assert.equal(e("Cl").stanje, "plinasto");
  assert.equal(e("Ga").stanje, "trdno"); assert.equal(e("Og").stanje, "neznano");
  // trendi: elektronegativnost raste po periodi, ionizacijska energija pada po skupini, polmer raste po skupini
  const p2 = ["Li", "Be", "B", "C", "N", "O", "F"].map((s) => e(s).en);
  p2.forEach((x, i) => i && assert.ok(x > p2[i - 1]));
  const g1 = ["Li", "Na", "K", "Rb", "Cs"];
  g1.forEach((s, i) => i && assert.ok(e(s).ie < e(g1[i - 1]).ie && e(s).polmer > e(g1[i - 1]).polmer, s));
  for (const x of P.ELEMENTI) {
    if (x.masa) assert.ok(x.masa >= 2 * x.Z * 0.95 || x.Z === 1, `masa ${x.simbol}`);
    if (x.en !== null) assert.ok(x.en > 0.6 && x.en < 4.1);
    if (x.ie !== null) assert.ok(x.ie > 350 && x.ie < 2400);
  }
  for (let Z = 2; Z <= 92; Z++) if (![19, 28, 53, 91].includes(Z)) assert.ok(P.ELEMENTI[Z - 1].masa > P.ELEMENTI[Z - 2].masa, `A_r narašča pri Z = ${Z}`); // izjeme: Ar/K, Co/Ni, Te/I, Th/Pa
});

test("periodni sistem: izbira elementa s tapom (instanceId) in s ključem", () => {
  const m = P.zgradi(THREE, { kakovost: "nizka" });
  const prehodne = m.deli.find((d) => d.id === "prehodne").meshes[0];
  const i = prehodne.userData.zji.indexOf(79);
  assert.equal(m.izberi("prehodne", { object: prehodne, instanceId: i }), "izbrani");
  assert.equal(m.deli.find((d) => d.id === "izbrani").ime, "Zlato");
  assert.equal(m.izberi("Fe"), "izbrani");
  assert.match(m.nadzor.find((n) => n.id === "lupine").vrednost(), /^2, 8, 14, 2/);
  assert.equal(m.izberi("halogeni"), "halogeni");
  // drsnik ostane usklajen z izbiro (kit bere njegovo vrednost)
  const drsnik = m.nadzor.find((n) => n.id === "element");
  assert.equal(drsnik.vrednost, 26);
  assert.equal(m.izberi("z-79"), "izbrani");
  assert.equal(drsnik.vrednost, 79);
  assert.equal(m.izberi("z-0"), "z-0"); // neveljaven ključ ne spremeni izbire
  assert.equal(drsnik.vrednost, 79);
  drsnik.ob(6);
  assert.equal(m.deli.find((d) => d.id === "izbrani").ime, "Ogljik");
  m.dispose();
});

const MR = (id) => K.MREZE.find((x) => x.id === id);
const okolica = (M) => K.delci(M, -1, 2);
/** Koordinacijsko število iz generiranih položajev: sosedi do 5 % dlje od najbližjega. */
function koordinacijsko(M, va, vb) {
  const V = K.vektorji(M), b = M.baza.find((x) => x[0] === va);
  const p = [0, 1, 2].map((i) => b[1] * V[0][i] + b[2] * V[1][i] + b[3] * V[2][i]);
  const raz = okolica(M).filter((q) => q.v === vb).map((q) => Math.hypot(q.p[0] - p[0], q.p[1] - p[1], q.p[2] - p[2])).filter((d) => d > 1);
  const d = Math.min(...raz);
  return { d, cn: raz.filter((x) => x < d * 1.05).length };
}

test("kristali: razdalje do najbližjih sosedov", () => {
  blizu(K.najblizja(MR("nacl"), "na", "cl"), 564 / 2, 0.5, "NaCl a/2");
  blizu(K.najblizja(MR("cscl"), "cs", "cl"), (412.3 * Math.sqrt(3)) / 2, 0.01, "CsCl a√3/2");
  blizu(K.najblizja(MR("diamant"), "c", "c"), 154.5, 0.3, "diamant a√3/4");
  blizu(K.najblizja(MR("grafit"), "c", "c"), 142, 0.5, "grafit v plasti");
  blizu(K.najblizja(MR("fcc"), "cu", "cu"), 361.5 / Math.SQRT2, 0.01, "fcc a/√2");
  blizu(K.najblizja(MR("bcc"), "fe", "fe"), (286.65 * Math.sqrt(3)) / 2, 0.01, "bcc a√3/2");
  blizu(K.najblizja(MR("hcp"), "mg", "mg"), 320, 1, "hcp");
  blizu(K.najblizja(MR("led"), "o", "o"), 276, 1.5, "led O···O");
  // razmik plasti grafita c/2 = 335 pm
  const G = MR("grafit"), zji = [...new Set(K.delci(G, 0, 1).map((d) => d.p[2].toFixed(1)))].map(Number).sort((a, b) => a - b);
  blizu(zji[1] - zji[0], 335.4, 0.5, "razmik plasti");
  // kontakt ionov v kaloti: vsota ionskih polmerov ≈ razdalja
  blizu(MR("nacl").vrste.na.r + MR("nacl").vrste.cl.r, 282, 2, "Na⁺ + Cl⁻");
  blizu(MR("cscl").vrste.cs.r + MR("cscl").vrste.cl.r, 357, 3, "Cs⁺ + Cl⁻");
});

test("kristali: koordinacijska števila iz položajev", () => {
  const pricak = { nacl: ["na", "cl", 6], cscl: ["cs", "cl", 8], diamant: ["c", "c", 4], grafit: ["c", "c", 3], bcc: ["fe", "fe", 8], fcc: ["cu", "cu", 12], hcp: ["mg", "mg", 12], led: ["o", "o", 4] };
  for (const [id, [a, b, cn]] of Object.entries(pricak)) assert.equal(koordinacijsko(MR(id), a, b).cn, cn, id);
  assert.equal(koordinacijsko(MR("nacl"), "cl", "na").cn, 6);
  assert.equal(koordinacijsko(MR("cscl"), "cl", "cs").cn, 8);
});

test("kristali: delci v osnovni celici in zapolnjenost", () => {
  const enote = { nacl: 4, cscl: 1, diamant: 8, grafit: 4, bcc: 2, fcc: 4, hcp: 2, led: 4 };
  for (const [id, n] of Object.entries(enote)) blizu(K.enoteVCelici(MR(id)), n, 1e-9, id);
  blizu(K.zapolnjenost(MR("bcc")), (Math.PI * Math.sqrt(3)) / 8, 1e-9, "bcc 68 %");
  blizu(K.zapolnjenost(MR("fcc")), Math.PI / (3 * Math.SQRT2), 1e-9, "fcc 74 %");
  blizu(K.zapolnjenost(MR("hcp")), 0.74, 0.01, "hcp 74 %");
});

test("kristali: led po pravilih led (2 vodika na kisik, en vodik na vezi O···O)", () => {
  const L = MR("led");
  for (const N of [1, [2, 2, 1], [3, 3, 2]]) {
    const O = K.delci(L, 0, N), H = K.vodikiLedu(L, N, O);
    assert.equal(H.length, 2 * O.length);
    const dajalec = new Array(O.length).fill(0), prejemnik = new Array(O.length).fill(0);
    for (const h of H) {
      dajalec[h.dajalecI]++; prejemnik[h.prejemnikI]++;
      blizu(Math.hypot(...h.h.map((x, i) => x - h.dajalec[i])), 100, 1e-6, "O–H");
    }
    assert.ok(dajalec.every((x) => x === 2) && prejemnik.every((x) => x === 2), `N = ${N}`);
  }
});

test("kristali: koordinacijski polieder in deli pri vseh mrežah", () => {
  const m = K.zgradi(THREE, { kakovost: "nizka" });
  const nad = (id) => m.nadzor.find((x) => x.id === id);
  nad("koordinacija").ob(true);
  for (const M of K.MREZE) {
    nad("mreza").ob(M.id);
    assert.ok(m.deli.some((d) => d.id === "koordinacija"), M.id);
    assert.ok(m.deli.some((d) => d.id === "celica"), M.id);
    if (M.id === "grafit") assert.ok(m.deli.some((d) => d.id === "plast"));
    if (M.id === "led") assert.ok(m.deli.some((d) => d.id === "vodikove-vezi"));
    assert.match(nad("koordinacijsko").vrednost(), /^(6|8|4|3|12) /);
  }
  m.dispose();
  // sosedi iz neskončne mreže segajo čez majhen blok: vse mora ostati v krogli s polmerom 1
  const m2 = K.zgradi(THREE, { kakovost: "nizka", zacetek: { koordinacija: true } });
  const v = new THREE.Vector3(), Mx = new THREE.Matrix4(), I = new THREE.Matrix4();
  const n2 = (id) => m2.nadzor.find((x) => x.id === id);
  n2("koordinacija").ob(true);
  for (const M of K.MREZE) for (const prikaz of ["kroglice", "kalota", "celica"]) for (const n of [1, 3]) {
    n2("mreza").ob(M.id); n2("prikaz").ob(prikaz); n2("celice").ob(n);
    let r = 0;
    m2.group.updateMatrixWorld(true);
    m2.group.traverse((o) => {
      for (let x = o; x; x = x.parent) if (!x.visible) return;
      if (!o.isMesh) return;
      const p = o.geometry.attributes.position;
      for (let k = 0; k < (o.isInstancedMesh ? o.count : 1); k++) {
        if (o.isInstancedMesh) { o.getMatrixAt(k, I); Mx.multiplyMatrices(o.matrixWorld, I); } else Mx.copy(o.matrixWorld);
        for (let i = 0; i < p.count; i++) r = Math.max(r, v.fromBufferAttribute(p, i).applyMatrix4(Mx).length());
      }
    });
    assert.ok(r <= 1, `${M.id}/${prikaz}/${n}: oglišče ${r.toFixed(3)} od središča`);
  }
  m2.dispose();
});
