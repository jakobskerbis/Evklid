// Znanstvene preverbe 3D modelov DNK/RNK in beljakovin (public/3d/modeli/kemija/dnk.js, beljakovina.js).
// Mere se preverjajo na ustvarjeni geometriji (položaji fosfatov v sceni), ne na konstantah.
import { test as nodeTest } from "node:test";
import { naloziThree } from "./fixtures/3d-modeli.js";

// three pride s kompletom 3D (package.json); brez njega se preverbe preskočijo, kot v test/3d-kemija.test.js.
const THREE = await naloziThree();
const test = (ime, fn) => nodeTest(ime, { skip: !THREE && "three ni nameščen" }, fn);
import assert from "node:assert/strict";
import { zgradi as zgradiDNK } from "../public/3d/modeli/kemija/dnk.js";
import { zgradi as zgradiBelj, beljakovina } from "../public/3d/modeli/kemija/beljakovina.js";

const deg = 180 / Math.PI;
const nastavi = (m, id, v) => m.nadzor.find((n) => n.id === id).ob(v);

/** Položaji fosfatov (nm) po verigah v smeri 5'→3' in podatki o nukleotidih. */
function fosfati(m) {
  m.group.updateMatrixWorld(true);
  const im = m.group.getObjectByName("fosfati");
  const { nmNaEnoto, struktura } = m.group.userData.dnk;
  const M = new THREE.Matrix4(), poz = [];
  for (let i = 0; i < im.count; i++) {
    im.getMatrixAt(i, M);
    poz.push(new THREE.Vector3().setFromMatrixPosition(M).applyMatrix4(im.matrixWorld).multiplyScalar(nmNaEnoto));
  }
  return { poz, s: struktura };
}

/** Os vijačnice iz zaporednih točk (smer) in krožnica v ravnini, pravokotni na os (središče, polmer). */
function vijacnica(tocke) {
  const b = [];
  for (let i = 1; i < tocke.length - 1; i++) b.push(tocke[i + 1].clone().sub(tocke[i]).sub(tocke[i].clone().sub(tocke[i - 1])));
  const os = new THREE.Vector3();
  for (let i = 0; i < b.length - 1; i++) { const c = b[i].clone().cross(b[i + 1]); if (os.dot(c) < 0) c.negate(); os.add(c); }
  os.normalize();
  if (os.dot(tocke[tocke.length - 1].clone().sub(tocke[0])) < 0) os.negate();
  // ortonormirana baza ravnine
  const u = new THREE.Vector3(1, 0, 0).cross(os); if (u.length() < 0.1) u.set(0, 0, 1).cross(os); u.normalize();
  const v = os.clone().cross(u);
  // krožnica po metodi najmanjših kvadratov (Kåsa)
  const P = tocke.map((p) => [p.dot(u), p.dot(v)]);
  let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, sxz = 0, syz = 0, sz = 0;
  for (const [x, y] of P) { const z = x * x + y * y; sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; sxz += x * z; syz += y * z; sz += z; }
  const n = P.length;
  const A = new THREE.Matrix3().set(sxx, sxy, sx, sxy, syy, sy, sx, sy, n).invert();
  const r = new THREE.Vector3(sxz, syz, sz).applyMatrix3(A);
  const cx = r.x / 2, cy = r.y / 2, R = Math.sqrt(r.z + cx * cx + cy * cy);
  const kot = (p) => Math.atan2(p.dot(v) - cy, p.dot(u) - cx);
  return { os, R, visina: (p) => p.dot(os), kot };
}

/** Dvig in zasuk na nukleotid v eni verigi (os v smeri 5'→3'). */
function korakVijacnice(tocke) {
  const h = vijacnica(tocke);
  let dv = 0, dk = 0;
  for (let i = 1; i < tocke.length; i++) {
    dv += h.visina(tocke[i]) - h.visina(tocke[i - 1]);
    let d = h.kot(tocke[i]) - h.kot(tocke[i - 1]);
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    dk += d;
  }
  return { dvig: dv / (tocke.length - 1), zasuk: (dk / (tocke.length - 1)) * deg, R: h.R, h };
}

test("DNK: oblika B – 0,34 nm na bazni par, 10,5 bp na zavoj, premer 2 nm, desnosučna", () => {
  const m = zgradiDNK(THREE, { kakovost: "visoka", gibanje: true });
  const { poz, s } = fosfati(m);
  const I = s.verige[0].map((i) => poz[i]), II = s.verige[1].map((i) => poz[i]);
  const a = korakVijacnice(I), b = korakVijacnice(II);
  assert.ok(Math.abs(a.dvig - 0.34) <= 0.01, `dvig ${a.dvig.toFixed(3)} nm`);
  assert.ok(Math.abs(b.dvig - 0.34) <= 0.01, `dvig II ${b.dvig.toFixed(3)} nm`);
  // vsaka veriga zase gleda v smeri 5'→3'; zasuk mora biti pozitiven (desnosučna vijačnica) pri obeh
  assert.ok(a.zasuk > 0 && b.zasuk > 0, `desnosučnost: ${a.zasuk.toFixed(1)}°, ${b.zasuk.toFixed(1)}°`);
  assert.ok(Math.abs(360 / a.zasuk - 10.5) <= 0.2, `bp na zavoj ${(360 / a.zasuk).toFixed(2)}`);
  const premer = 2 * (a.R + m.group.userData.dnk.polmerFosfata);
  assert.ok(Math.abs(premer - 2.0) <= 0.2, `premer ${premer.toFixed(2)} nm`);
  // protivzporedni verigi: os verige I in os verige II kažeta v nasprotni smeri
  assert.ok(a.h.os.dot(b.h.os) < -0.99, "verigi nista protivzporedni");
  // žlebova: verigi nista razmaknjeni za 180°, mali žleb je ožji od velikega
  const y = a.h.visina(I[10]);
  const kotII = (() => { // kot verige II na višini y (linearna interpolacija po fosfatih)
    const hs = II.map((p) => a.h.visina(p));
    for (let i = 1; i < II.length; i++) if ((hs[i] - y) * (hs[i - 1] - y) <= 0) {
      const t = (y - hs[i - 1]) / (hs[i] - hs[i - 1]);
      let k0 = a.h.kot(II[i - 1]), k1 = a.h.kot(II[i]);
      while (k1 - k0 > Math.PI) k1 -= 2 * Math.PI;
      while (k1 - k0 < -Math.PI) k1 += 2 * Math.PI;
      return k0 + (k1 - k0) * t;
    }
    throw new Error("ni višine");
  })();
  let d = Math.abs(a.h.kot(I[10]) - kotII) * deg % 360;
  const mali = Math.min(d, 360 - d);
  assert.ok(mali > 100 && mali < 160, `kot malega žleba ${mali.toFixed(0)}°`);
});

test("DNK: pari A–T z dvema in G–C s tremi vodikovimi vezmi, razdalje 0,26–0,32 nm", () => {
  const m = zgradiDNK(THREE, { kakovost: "nizka", gibanje: false });
  const s = m.group.userData.dnk.struktura;
  for (const [i, j] of s.pari) {
    const par = [s.nt[i].baza, s.nt[j].baza].sort().join("");
    assert.ok(par === "AT" || par === "CG", `par ${par}`);
  }
  assert.ok(!s.nt.some((n) => n.baza === "U"), "uracil v DNK");
  const pike = m.group.getObjectByName("vodikove-vezi");
  const vezi = new Map();
  pike.userData.vezi.forEach((v, k) => { const kl = `${v[0]}-${v[1]}`; const x = vezi.get(kl) || vezi.set(kl, new Map()).get(kl), kk = `${v[2]}-${v[3]}`; if (!x.has(kk)) x.set(kk, k); });
  assert.equal(vezi.size, s.pari.length);
  m.group.updateMatrixWorld(true);
  const nmNaEnoto = m.group.userData.dnk.nmNaEnoto, M = new THREE.Matrix4();
  const tocka = (k) => { pike.getMatrixAt(k, M); return new THREE.Vector3().setFromMatrixPosition(M).applyMatrix4(pike.matrixWorld).multiplyScalar(nmNaEnoto); };
  for (const [i, j] of s.pari) {
    const par = [s.nt[i].baza, s.nt[j].baza].sort().join("");
    const v = vezi.get(`${s.nt[i].baza === "A" || s.nt[i].baza === "G" ? i : j}-${s.nt[i].baza === "A" || s.nt[i].baza === "G" ? j : i}`);
    assert.equal(v.size, par === "AT" ? 2 : 3, `${par}: ${v.size} vezi`);
    for (const k of v.values()) {
      // pike so pri 0,22 · 0,5 · 0,78 razdalje donor–akceptor (zaporedni indeksi)
      const d = tocka(k).distanceTo(tocka(k + 2)) / 0.56;
      assert.ok(d > 0.26 && d < 0.32, `${par}: razdalja ${d.toFixed(3)} nm`);
    }
  }
});

test("DNK: odpiranje razklene vijačnico in skrije vodikove vezi", () => {
  const m = zgradiDNK(THREE, { kakovost: "nizka", gibanje: true });
  const pred = fosfati(m);
  const top = pred.s.pari[pred.s.pari.length - 1];
  const d0 = pred.poz[top[0]].distanceTo(pred.poz[top[1]]);
  nastavi(m, "odpiranje", 1);
  const po = fosfati(m);
  const d1 = po.poz[top[0]].distanceTo(po.poz[top[1]]);
  assert.ok(d1 > d0 + 2, `razmik vrhnjega para ${d0.toFixed(2)} → ${d1.toFixed(2)} nm`);
  const pike = m.group.getObjectByName("vodikove-vezi"), M = new THREE.Matrix4();
  let skrite = 0;
  for (let i = 0; i < pike.count; i++) { pike.getMatrixAt(i, M); if (Math.hypot(...M.elements.slice(0, 3)) === 0) skrite++; }
  assert.ok(skrite > pike.count / 2, `skritih pik ${skrite} od ${pike.count}`);
  // spodnji del ostane zaprt: dvig in zasuk ostaneta kot v obliki B
  const I = po.s.verige[0].slice(0, 5).map((i) => po.poz[i]);
  const k = korakVijacnice(I);
  assert.ok(Math.abs(k.dvig - 0.34) <= 0.01 && Math.abs(360 / k.zasuk - 10.5) <= 0.3);
});

test("RNK: lasnica v obliki A – 0,28 nm na bazni par, okoli 11 bp na zavoj, A–U in G–C", () => {
  const m = zgradiDNK(THREE, { kakovost: "visoka", gibanje: true, zacetek: { molekula: "RNK" } });
  const { poz, s } = fosfati(m);
  assert.equal(s.verige.length, 1, "RNK je ena veriga");
  const steblo = s.verige[0].filter((i) => s.nt[i].stran === 0).map((i) => poz[i]);
  const a = korakVijacnice(steblo);
  assert.ok(Math.abs(a.dvig - 0.28) <= 0.01, `dvig ${a.dvig.toFixed(3)} nm`);
  assert.ok(a.zasuk > 0 && Math.abs(360 / a.zasuk - 11) <= 0.3, `bp na zavoj ${(360 / a.zasuk).toFixed(2)}`);
  for (const [i, j] of s.pari) {
    const par = [s.nt[i].baza, s.nt[j].baza].sort().join("");
    assert.ok(par === "AU" || par === "CG", `par ${par}`);
  }
  assert.ok(!s.nt.some((n) => n.baza === "T"), "timin v RNK");
  assert.ok(s.nt.every((n) => n.at["O2'"]), "riboza mora imeti O2'");
  const zanka = s.nt.filter((n) => n.stran === 2).map((n) => n.baza).join("");
  assert.equal(zanka, "UUCG");
  const vezi = m.group.getObjectByName("vodikove-vezi").userData.vezi;
  const st = new Set(vezi.map((v) => `${v[0]}-${v[1]}-${v[2]}`));
  assert.equal(st.size, s.pari.reduce((t, [i]) => t + (s.nt[i].baza === "A" || s.nt[i].baza === "U" ? 2 : 3), 0));
});

test("DNK: atomski prikaz ima vse atome nukleotidov in en fosfor na nukleotid", () => {
  const m = zgradiDNK(THREE, { kakovost: "visoka", gibanje: true, zacetek: { prikaz: "atomski" } });
  const s = m.group.userData.dnk.struktura;
  let P = 0, vsi = 0;
  m.group.traverse((o) => { if (o.isInstancedMesh && o.name.startsWith("atomi-")) { vsi += o.count; if (o.name.endsWith("|P")) P += o.count; } });
  assert.equal(P, s.nt.length);
  assert.ok(vsi > 19 * s.nt.length && vsi < 23 * s.nt.length, `atomov ${vsi}`);
});

test("Beljakovine: število aminokislin po verigah se ujema z vnosi PDB", () => {
  const h = beljakovina("hemoglobin"), i = beljakovina("inzulin"), g = beljakovina("gfp");
  assert.deepEqual(h.verige.map((v) => [v.id, v.n, v.ca.length]), [["A", 141, 141], ["B", 146, 146], ["C", 141, 141], ["D", 146, 146]]);
  assert.ok(h.verige[0].sq.startsWith("VLSPADKTNVKAAWGKVGAHAGEYGAEALERMF") && h.verige[1].sq.startsWith("VHLTPEEKSAVTALWGKVNVDEVGGEALGRLL"));
  assert.equal(h.steviloAK, 574);
  assert.deepEqual(i.verige.map((v) => [v.id, v.n, v.ca.length]), [["A", 21, 21], ["B", 30, 30]]);
  assert.equal(i.verige[0].sq, "GIVEQCCTSICSLYQLENYCN");
  assert.equal(i.verige[1].sq, "FVNQHLCGSHLVEALYLVCGERGFFYTPKA");
  assert.equal(g.verige[0].n, 238);
  assert.equal(g.verige[0].z, 2);
  assert.equal(g.verige[0].ca.length, 228); // ostanki 2–229
  assert.equal(g.verige[0].sq.slice(63, 66), "TYG"); // kromofor iz Thr65–Tyr66–Gly67 (različica S65T)
  for (const B of [h, i, g]) for (const v of B.verige) assert.equal(v.ss.length, v.ca.length);
});

test("Beljakovine: zaporedni atomi Cα so 3,8 ± 0,3 Å narazen (cis-prolin 2,9 Å)", () => {
  for (const k of ["hemoglobin", "inzulin", "gfp"]) {
    for (const v of beljakovina(k).verige) {
      for (let j = 1; j < v.ca.length; j++) {
        const d = Math.hypot(...[0, 1, 2].map((x) => v.ca[j][x] - v.ca[j - 1][x]));
        if (d > 4.5) continue; // prekinitev verige
        const cisPro = v.sq[j] === "P" && Math.abs(d - 2.95) <= 0.15;
        assert.ok(Math.abs(d - 3.8) <= 0.3 || cisPro, `${k} ${v.id}${v.z + j}: ${d.toFixed(2)} Å`);
      }
    }
  }
});

test("Beljakovine: hem z železom, disulfidni mostovi, kromofor GFP", () => {
  const h = beljakovina("hemoglobin");
  assert.equal(h.het.length, 4);
  for (const hem of h.het) {
    const fe = hem.at.filter((a) => a.el === "F");
    assert.equal(fe.length, 1);
    const n = hem.at.filter((a) => a.el === "N").map((a) => Math.hypot(...[0, 1, 2].map((x) => a.p[x] - fe[0].p[x])));
    assert.equal(n.length, 4);
    for (const d of n) assert.ok(d > 1.9 && d < 2.25, `Fe–N ${d.toFixed(2)} Å`);
  }
  // α-vijačnice prevladujejo v hemoglobinu, β-ploskve v GFP
  const delez = (B, t) => B.verige.reduce((s, v) => s + v.ss.filter((x) => x === t).length, 0) / B.verige.reduce((s, v) => s + v.ss.length, 0);
  assert.ok(delez(h, "H") > 0.65);
  assert.ok(delez(beljakovina("gfp"), "E") > 0.4);
  const ins = beljakovina("inzulin");
  assert.deepEqual(ins.ssb.map((s) => s.join("")).sort(), ["A20B19", "A6A11", "A7B7"]);
  for (const [c1, r1, c2, r2] of ins.ssb) {
    const d = Math.hypot(...[0, 1, 2].map((x) => ins.cys[c1 + r1][1][x] - ins.cys[c2 + r2][1][x]));
    assert.ok(Math.abs(d - 2.05) <= 0.15, `S–S ${d.toFixed(2)} Å`);
    for (const [c, r] of [[c1, r1], [c2, r2]]) assert.equal(ins.verige.find((v) => v.id === c).sq[r - 1], "C");
  }
  for (const [kljuc, del] of [["hemoglobin", "hem"], ["inzulin", "disulfidni-most"], ["gfp", "kromofor"]]) {
    const m = zgradiBelj(THREE, { kakovost: "nizka", gibanje: true, zacetek: { beljakovina: kljuc } });
    assert.ok(m.deli.some((d) => d.id === del), `${kljuc}: manjka del ${del}`);
  }
});
