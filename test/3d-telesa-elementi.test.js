// Telesa iz Evklidovih Elementov (j, 5. 11.): pet pravilnih teles in poševni paralelepiped. Vse formule preverimo
// z geometrijo (oglišča in ploskve), mreža se zloži brez lukenj in se razprta ne prekriva.
import test from "node:test";
import assert from "node:assert/strict";
import { IMA_THREE, preveriPodrocje } from "./3d-preveri-gradnik.js";
import { pravilnoTelo, paralelepipedTelo, paralelepipedKolicine, PRAVILNA, ELEMENTI, euler } from "../public/3d/modeli/matematika/telesa.js";

const s5 = Math.sqrt(5), s3 = Math.sqrt(3), s2 = Math.SQRT2;
// formule iz naloge, zapisane neodvisno od gradnika
const NALOGA = {
  tetraeder: { V: (a) => (s2 / 12) * a ** 3, P: (a) => s3 * a * a, o: 4, r: 6, p: 4 },
  kocka: { V: (a) => a ** 3, P: (a) => 6 * a * a, o: 8, r: 12, p: 6 },
  oktaeder: { V: (a) => (s2 / 3) * a ** 3, P: (a) => 2 * s3 * a * a, o: 6, r: 12, p: 8 },
  dodekaeder: { V: (a) => ((15 + 7 * s5) / 4) * a ** 3, P: (a) => 3 * Math.sqrt(25 + 10 * s5) * a * a, o: 20, r: 30, p: 12 },
  ikozaeder: { V: (a) => ((5 * (3 + s5)) / 12) * a ** 3, P: (a) => 5 * s3 * a * a, o: 12, r: 30, p: 20 },
};
const raz = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const vek = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const skal = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const dol = (a) => Math.hypot(...a);
const sred = (t) => [0, 1, 2].map((i) => t.reduce((s, p) => s + p[i], 0) / t.length);
const blizu = (x, y, rel = 1e-9) => Math.abs(x - y) <= rel * Math.max(1, Math.abs(y));

// prostornina (vsota piramid iz notranje točke), površina, polmera včrtane in očrtane krogle
function izmeri(tocke, ploskve) {
  const C = sred(tocke);
  let V = 0, P = 0; const dPloskev = [];
  for (const F of ploskve) {
    const q = F.map((i) => tocke[i]); let n = [0, 0, 0];
    for (let k = 1; k < q.length - 1; k++) { const c = vek(raz(q[k], q[0]), raz(q[k + 1], q[0])); n = [n[0] + c[0], n[1] + c[1], n[2] + c[2]]; }
    const A = dol(n) / 2; P += A;
    const h = Math.abs(skal(n, raz(q[0], C))) / dol(n); dPloskev.push(h); V += (A * h) / 3;
  }
  return { V, P, dPloskev, dOgl: tocke.map((p) => dol(raz(p, C))) };
}
// robovi: vsak rob mora biti skupen natanko dvema ploskvama (telo je zaprto, brez lukenj)
function robovi(ploskve) {
  const m = new Map();
  for (const F of ploskve) F.forEach((a, k) => { const b = F[(k + 1) % F.length], kl = Math.min(a, b) + "-" + Math.max(a, b); m.set(kl, (m.get(kl) || 0) + 1); });
  return m;
}

test("pravilna telesa: V, P, r, R iz formul se ujemajo z geometrijo; Euler o − r + p = 2", () => {
  for (const [ime, N] of Object.entries(NALOGA)) {
    for (const a of [1, 2.5, 7]) {
      const { tocke, ploskve } = pravilnoTelo(ime, a), F = PRAVILNA[ime];
      const m = izmeri(tocke, ploskve), rob = robovi(ploskve);
      assert.equal(tocke.length, N.o, ime); assert.equal(ploskve.length, N.p, ime); assert.equal(rob.size, N.r, ime);
      assert.equal(N.o - N.r + N.p, 2);
      assert.deepEqual([F.o, F.r, F.p], [N.o, N.r, N.p], ime);
      assert.ok([...rob.values()].every((x) => x === 2), `${ime}: vsak rob je skupen dvema ploskvama`);
      for (const P of ploskve) {
        assert.equal(P.length, F.n, ime);
        P.forEach((i, k) => assert.ok(blizu(dol(raz(tocke[i], tocke[P[(k + 1) % P.length]])), a), `${ime}: vsi robovi so a`));
      }
      // v vsakem oglišču se stika k ploskev
      for (let i = 0; i < tocke.length; i++) assert.equal(ploskve.filter((P) => P.includes(i)).length, F.k, ime);
      assert.ok(blizu(m.V, N.V(a)), `${ime} V ${m.V} ≠ ${N.V(a)}`); assert.ok(blizu(F.V[1](a), N.V(a)), `${ime} V formula`);
      assert.ok(blizu(m.P, N.P(a)), `${ime} P`); assert.ok(blizu(F.P[1](a), N.P(a)), `${ime} P formula`);
      for (const d of m.dPloskev) assert.ok(blizu(d, F.Rv[1](a)), `${ime} r`);
      for (const d of m.dOgl) assert.ok(blizu(d, F.Ro[1](a)), `${ime} R`);
      // telo leži na spodnji ploskvi (y = 0), vse ostalo je nad njo
      assert.ok(ploskve[0].every((i) => Math.abs(tocke[i][1]) < 1e-9) && tocke.every((p) => p[1] > -1e-9), `${ime} leži na podlagi`);
    }
    assert.match(euler(ime), /= 2$/);
  }
  // Evklid XIII. 13–15: (premer očrtane krogle)² = 3/2 a², 2a², 3a²
  assert.ok(blizu((2 * PRAVILNA.tetraeder.Ro[1](1)) ** 2, 1.5));
  assert.ok(blizu((2 * PRAVILNA.oktaeder.Ro[1](1)) ** 2, 2));
  assert.ok(blizu((2 * PRAVILNA.kocka.Ro[1](1)) ** 2, 3));
});

test("poševni paralelepiped: V = ab·sinα·c·sinφ in P iz geometrije pri več kotih", () => {
  for (const [a, b, c, al, fi] of [[4, 3, 6, 60, 70], [1, 10, 10, 30, 30], [10, 1, 1, 90, 90], [5, 5, 5, 45, 80]]) {
    const g = paralelepipedTelo(a, b, c, al, fi), m = izmeri(g.tocke, g.ploskve), k = paralelepipedKolicine(a, b, c, al, fi);
    const rad = Math.PI / 180;
    assert.ok(blizu(m.V, a * b * c * Math.sin(al * rad) * Math.sin(fi * rad)), "V");
    assert.ok(blizu(k.V, m.V) && blizu(k.P, m.P), `P ${k.P} ≠ ${m.P}`);
    assert.ok([...robovi(g.ploskve).values()].every((x) => x === 2));
    if (al === 90 && fi === 90) assert.ok(blizu(k.P, 2 * (a * b + a * c + b * c)), "kvader");
  }
});

test("vsako telo ima vrstico iz Evklidovih Elementov", { skip: IMA_THREE ? false : "three ni nameščen" }, async () => {
  await preveriPodrocje("matematika");
  const THREE = await import("three");
  const { zgradi } = await import("../public/3d/modeli/matematika/telesa.js");
  const r = zgradi(THREE, { kakovost: "nizka", gibanje: false, zacetek: {} });
  const ids = ["telo", "platon"].flatMap((id) => r.nadzor.find((c) => c.id === id).moznosti.map(([v]) => v));
  assert.ok(ids.length >= 16);
  for (const id of ids) assert.ok(ELEMENTI[id], `ni vrstice za ${id}`);
  for (const [id, n] of [["tetraeder", 13], ["oktaeder", 14], ["kocka", 15], ["ikozaeder", 16], ["dodekaeder", 17]]) assert.match(ELEMENTI[id], new RegExp(`XIII\\. knjiga, trditev ${n}\\b`), id);
});

test("mreže novih teles: zložene brez lukenj, razprte na podlagi brez prekrivanja, ploščina = P", { skip: IMA_THREE ? false : "three ni nameščen" }, async () => {
  await preveriPodrocje("matematika"); // DOM za platno
  const THREE = await import("three");
  const { zgradi } = await import("../public/3d/modeli/matematika/telesa.js");
  const ploscina = (q) => { let n = [0, 0, 0]; for (let k = 1; k < q.length - 1; k++) { const c = vek(raz(q[k], q[0]), raz(q[k + 1], q[0])); n = [n[0] + c[0], n[1] + c[1], n[2] + c[2]]; } return dol(n) / 2; };
  // ločilna os za konveksne mnogokotnike v ravnini xz
  const locena = (A, B, tol) => {
    for (const P of [A, B]) for (let i = 0; i < P.length; i++) {
      const p = P[i], q = P[(i + 1) % P.length], L = Math.hypot(q[0] - p[0], q[2] - p[2]), nx = (p[2] - q[2]) / L, nz = (q[0] - p[0]) / L;
      const pa = A.map((x) => x[0] * nx + x[2] * nz), pb = B.map((x) => x[0] * nx + x[2] * nz);
      if (Math.max(...pa) <= Math.min(...pb) + tol || Math.max(...pb) <= Math.min(...pa) + tol) return true;
    }
    return false;
  };
  const primeri = [
    ...["tetraeder", "oktaeder", "dodekaeder", "ikozaeder"].map((telo) => ({ telo, a: 3 })),
    ...[[30, 30], [30, 90], [90, 30], [60, 70], [45, 45], [90, 90]].flatMap(([alfa, fi]) => [[4, 3, 6], [1, 10, 10], [10, 1, 2]].map(([a, b, c]) => ({ telo: "paralelepiped", a, b, c, alfa, fi }))),
  ];
  for (const zacetek of primeri) {
    const r = zgradi(THREE, { kakovost: "nizka", gibanje: false, zacetek });
    const kdo = JSON.stringify(zacetek);
    const P = Number(r.povzetek().match(/P = ([\d ]+,\d)/)[1].replace(/ /g, "").replace(",", "."));
    // zloženo: vsak rob (par točk) se pojavi natanko v dveh ploskvah
    const zlozeno = r.ploskveMreze(), kl = (p) => p.map((x) => x.toFixed(5)).join();
    const m = new Map();
    for (const F of zlozeno) F.forEach((p, k) => { const a = kl(p), b = kl(F[(k + 1) % F.length]), x = a < b ? a + "|" + b : b + "|" + a; m.set(x, (m.get(x) || 0) + 1); });
    assert.ok([...m.values()].every((x) => x === 2), `${kdo}: zloženo telo ima luknjo`);
    const raz1 = r.nadzor.find((c) => c.id === "razpri"); raz1.vrednost = 1; raz1.ob(1);
    const mreza = r.ploskveMreze();
    assert.equal(mreza.length, zlozeno.length);
    assert.ok(mreza.every((F) => F.every((p) => Math.abs(p[1]) < 1e-6)), `${kdo}: mreža leži na podlagi`);
    const S = mreza.reduce((s, F) => s + ploscina(F), 0);
    assert.ok(Math.abs(S - P) < 0.06, `${kdo}: ploščina mreže ${S} ≠ P ${P}`);
    for (let i = 0; i < mreza.length; i++) for (let j = i + 1; j < mreza.length; j++) assert.ok(locena(mreza[i], mreza[j], 1e-6), `${kdo}: ploskvi ${i} in ${j} se prekrivata`);
    r.dispose();
  }
});

test("skupina »Pravilna telesa (Platonova)«: izbira, razlaga, krogli in prerez", { skip: IMA_THREE ? false : "three ni nameščen" }, async () => {
  await preveriPodrocje("matematika");
  const THREE = await import("three");
  const { zgradi } = await import("../public/3d/modeli/matematika/telesa.js");
  const r = zgradi(THREE, { kakovost: "nizka", gibanje: false, zacetek: { telo: "ikozaeder" } });
  const c = (id) => r.nadzor.find((x) => x.id === id), iz = (id) => c(id).vrednost();
  assert.equal(c("skupina").vrednost, "platonova", "zacetek s pravilnim telesom odpre njegovo skupino");
  assert.equal(c("platon").vrednost, "ikozaeder");
  assert.equal(c("telo").vidno(), false); assert.equal(c("platon").vidno(), true);
  // pregledovalnik začetne vrednosti pošlje tudi seznamu osnovnih teles (njegovo trenutno vrednost): ikozaeder ostane
  c("telo").ob(c("telo").vrednost);
  assert.equal(c("platon").vrednost, "ikozaeder"); assert.match(r.povzetek(), /V = 139,6/);
  assert.match(iz("zakaj5"), /samo 5/);
  assert.match(iz("elementi"), /^Evklid, Elementi, .*XIII\. knjiga, trditev 16/);
  assert.match(iz("euler"), /12 oglišč, 30 robov, 20 ploskev: 12 − 30 \+ 20 = 2/);
  // izpis je formula (tex: true): pravi ulomek, ne 5(3 + √5)a³/12; a = 4: 5(3+√5)/12 · 64 = 139,63
  assert.equal(c("V").tex, true);
  assert.equal(iz("V"), "$\\displaystyle V = {\\frac{5(3 + \\sqrt{5})\\,a^3}{12}} = {139{,}6\\,\\mathrm{cm^3}}$");
  // krogli: vklop naredi ploskve prosojne, prikaže obe krogli in polmera
  c("krogli").ob(true);
  assert.equal(c("prosojno").vrednost, true);
  assert.equal(r.group.getObjectByName("vcrtana-krogla").visible, true);
  assert.ok(r.deli.some((d) => d.id === "ocrtana") && r.deli.some((d) => d.id === "vcrtana"));
  assert.match(iz("polmera"), /^\$\\displaystyle r = .* = \{3\{,\}0\\,\\mathrm\{cm\}\}\$\n\$\\displaystyle R = .* = \{3\{,\}8\\,\\mathrm\{cm\}\}\$$/); // a = 4: r = 3,02, R = 3,80
  // kocka je v obeh skupinah; v osnovni skupini nima krogel
  c("platon").ob("kocka"); assert.equal(c("krogli").vidno(), true);
  c("skupina").ob("osnovna"); assert.equal(c("telo").vrednost, "kocka"); assert.equal(c("krogli").vidno(), false);
  assert.equal(r.group.getObjectByName("vcrtana-krogla").visible, false);
  c("skupina").ob("platonova"); assert.equal(c("platon").vrednost, "kocka");
  // vodoravni prerez dodekaedra skozi sredino je pravilni desetkotnik
  c("platon").ob("dodekaeder"); c("krogli").ob(false);
  c("prerez").ob(true); c("nagib").ob(0); c("lega").ob(0.5);
  assert.match(iz("prerezIzpis"), /^pravilni desetkotnik/);
  r.dispose();
});
