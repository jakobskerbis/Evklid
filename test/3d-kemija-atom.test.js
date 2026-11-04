// Znanstvene preverbe modelov »Atom« in »Atomske orbitale« (public/3d/modeli/kemija/atom.js, orbitale.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import * as A from "../public/3d/modeli/kemija/atom.js";
import * as O from "../public/3d/modeli/kemija/orbitale.js";

test("atom: konfiguracije Z = 1–36 seštejejo v Z, lupine in izjemi Cr, Cu", () => {
  for (let Z = 1; Z <= 36; Z++) {
    const k = A.konfiguracija(Z);
    assert.equal(k.reduce((s, x) => s + x.e, 0), Z, `Z = ${Z}`);
    for (const x of k) assert.ok(x.e >= 1 && x.e <= 2 * (2 * x.l + 1), `Z = ${Z}: ${x.n}${"spdf"[x.l]}${x.e}`);
    assert.equal(A.lupine(Z).reduce((s, e) => s + e, 0), Z);
    assert.ok(A.ELEMENTI[Z - 1][2] >= Z, `A ≥ Z za ${A.ELEMENTI[Z - 1][0]}`);
  }
  assert.equal(A.skrajsano(24), "[Ar] 3d⁵ 4s¹");
  assert.equal(A.skrajsano(29), "[Ar] 3d¹⁰ 4s¹");
  assert.equal(A.skrajsano(26), "[Ar] 3d⁶ 4s²");
  assert.equal(A.zapis(A.konfiguracija(6)), "1s² 2s² 2p²");
  assert.deepEqual(A.lupine(26), [2, 8, 14, 2]);
  assert.deepEqual(A.lupine(29), [2, 8, 18, 1]);
  assert.deepEqual(A.lupine(19), [2, 8, 8, 1]);
  assert.deepEqual(A.lupine(36), [2, 8, 18, 8]);
  assert.equal(A.ELEMENTI[25][1], "Železo");
  assert.equal(A.ELEMENTI[16][2] - 17, 18); // ³⁵Cl ima 18 nevtronov
});

test("atom: Slaterjev efektivni naboj in Hundovo pravilo", () => {
  assert.ok(Math.abs(A.zeff(6, 2, 1) - 3.25) < 1e-9); // C 2p
  assert.ok(Math.abs(A.zeff(19, 4, 0) - 2.2) < 1e-9); // K 4s
  assert.ok(Math.abs(A.zeff(26, 3, 2) - 6.25) < 1e-9); // Fe 3d
  assert.ok(Math.abs(A.zeff(1, 1, 0) - 1) < 1e-9);
  assert.deepEqual(A.hund(1, 2), [1, 1, 0]);
  assert.deepEqual(A.hund(1, 4), [2, 1, 1]);
  assert.deepEqual(A.hund(2, 6), [2, 1, 1, 1, 1]);
  // zunanja lupina je umerjena na polmer atoma (vrh pri izračunanem polmeru); notranje lupine so manjše od zunanje
  assert.ok(Math.abs(A.vrh(2, 1) - 4) < 0.05); // vodikova 2p: vrh pri 4 a0
  for (const Z of [1, 6, 11, 19, 26]) {
    const v = A.velikosti(Z), nMax = Math.max(...v.map((x) => x.n)), lHi = Math.max(...v.filter((x) => x.n === nMax).map((x) => x.l));
    const x = v.find((q) => q.n === nMax && q.l === lHi);
    assert.ok(Math.abs(A.vrh(x.n, x.l) * x.a * 52.9177 - A.ELEMENTI[Z - 1][3]) < 1, `Z = ${Z}: polmer`);
  }
  for (let Z = 3; Z <= 36; Z++) {
    const v = A.velikosti(Z), nMax = Math.max(...v.map((x) => x.n));
    const zun = Math.min(...v.filter((x) => x.n === nMax).map((x) => A.vrh(x.n, x.l) * x.a));
    for (const x of v) if (x.n < nMax) assert.ok(A.vrh(x.n, x.l) * x.a < zun, `Z = ${Z}: ${x.n}${"spd"[x.l]} ni manjša od zunanje lupine`);
  }
});

test("orbitale: radialni deli so normirani in imajo n − l − 1 vozlov", () => {
  for (const [n, l] of [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [3, 2], [4, 0], [4, 2], [4, 3], [5, 1]]) {
    let s = 0, spremembe = 0, pr = O.radialna(n, l, 1e-6);
    const rMax = 4 * n * n + 30, K = 40000, dr = rMax / K;
    for (let i = 0; i < K; i++) {
      const r = (i + 0.5) * dr, R = O.radialna(n, l, r);
      s += R * R * r * r * dr;
      if (Math.abs(R) > 1e-12 && Math.sign(R) !== Math.sign(pr) && Math.abs(pr) > 1e-12) spremembe++;
      if (Math.abs(R) > 1e-12) pr = R;
    }
    assert.ok(Math.abs(s - 1) < 1e-3, `∫R²r²dr za ${n}${"spdf"[l]} = ${s}`);
    assert.equal(spremembe, n - l - 1, `vozli ${n}${"spdf"[l]}`);
    assert.equal(O.radialniVozli(n, l).length, n - l - 1);
  }
  // 2s: vozel pri r = 2 a0; 3s: pri (9 ± 3√3)/2 a0
  assert.ok(Math.abs(O.radialniVozli(2, 0)[0] - 2) < 1e-6);
  assert.ok(Math.abs(O.radialniVozli(3, 0)[0] - (9 - 3 * Math.sqrt(3)) / 2) < 1e-6);
});

test("orbitale: kotni deli so normirani, vozelne ravnine in stožci res dajo ψ = 0", () => {
  for (const l of [0, 1, 2, 3]) for (const k of O.KOTNE[l]) {
    let s = 0;
    const NT = 200, NF = 400;
    for (let i = 0; i < NT; i++) {
      const th = ((i + 0.5) * Math.PI) / NT;
      for (let j = 0; j < NF; j++) {
        const ph = ((j + 0.5) * 2 * Math.PI) / NF, y = k.Y(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th));
        s += y * y * Math.sin(th) * (Math.PI / NT) * ((2 * Math.PI) / NF);
      }
    }
    assert.ok(Math.abs(s - 1) < 2e-3, `∫|Y|² za l=${l} ${k.id}: ${s}`);
    // število kotnih vozlov = l (stožec šteje za dva)
    assert.equal(k.ravnine.length + 2 * k.stozci.length, l, `kotni vozli ${k.id}`);
    for (const n of k.ravnine) {
      const t = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
      const u = [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]], lu = Math.hypot(...u);
      assert.ok(Math.abs(k.Y(...u.map((x) => x / lu))) < 1e-9, `ravnina ${k.id}`);
    }
    for (const c2 of k.stozci) assert.ok(Math.abs(k.Y(Math.sqrt(1 - c2), 0, Math.sqrt(c2))) < 1e-9, `stožec ${k.id}`);
  }
  assert.equal(O.ORBITALE.filter((o) => o.n <= 4).length, 1 + 4 + 9 + 16);
});

test("orbitale: prag 90 % obdaja 0,9 verjetnosti (1s analitično, 2p z mrežo)", () => {
  // 1s: |ψ| > c je krogla r < r_c, P(r_c) = 1 − e^(−2r)(1 + 2r + 2r²)
  const { c } = O.prag("1s");
  const rc = -Math.log(c * Math.sqrt(Math.PI));
  const P1 = 1 - Math.exp(-2 * rc) * (1 + 2 * rc + 2 * rc * rc);
  assert.ok(Math.abs(P1 - 0.9) < 0.02, `1s: ${P1}`);
  // 2p_z: neodvisna 3D mreža
  const { c: c2 } = O.prag("2pz");
  const psi = O.valovna("2pz"), L = 24, N = 140, h = (2 * L) / N;
  let vse = 0, notri = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) {
    const p = psi(-L + (i + 0.5) * h, -L + (j + 0.5) * h, -L + (k + 0.5) * h), w = p * p * h * h * h;
    vse += w; if (Math.abs(p) > c2) notri += w;
  }
  assert.ok(Math.abs(vse - 1) < 0.01, `∫|ψ|² = ${vse}`);
  assert.ok(Math.abs(notri / vse - 0.9) < 0.02, `2p: ${notri / vse}`);
});

test("orbitale: marching tetrahedra da zaprto ploskev krogle s pravo prostornino", () => {
  const N = 40, L = 1.2, h = (2 * L) / (N - 1), vals = new Float32Array(N * N * N);
  for (let k = 0; k < N; k++) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = -L + h * i, y = -L + h * j, z = -L + h * k;
    vals[i + N * j + N * N * k] = 1 - Math.hypot(x, y, z);
  }
  const { pos, idx } = O.tetraedri(vals, N, -L, h);
  let V = 0;
  for (let t = 0; t < idx.length; t += 3) {
    const [a, b, c] = [idx[t], idx[t + 1], idx[t + 2]].map((q) => pos.slice(3 * q, 3 * q + 3));
    V += (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
  }
  assert.ok(Math.abs(V - (4 / 3) * Math.PI) < 0.03 * (4 / 3) * Math.PI, `V = ${V}`); // pozitivno: trikotniki obrnjeni navzven
});

test("atom, orbitale: oznake delov ležijo na vidnih delih", async () => {
  const { naloziThree } = await import("./fixtures/3d-modeli.js");
  const THREE = await naloziThree();
  if (!THREE) return;
  // brez gibanja elektroni mirujejo: točka »valenčni elektroni« je na enem od njih
  const a = A.zgradi(THREE, { kakovost: "nizka", gibanje: false });
  const Zn = a.nadzor.find((n) => n.id === "Z");
  for (const Z of [1, 3, 6, 11, 26, 36]) {
    Zn.ob(Z); a.korak(5, 1 / 60);
    const d = a.deli.find((x) => x.id === "valencni"), el = d.meshes[0], M = new THREE.Matrix4(), p = new THREE.Vector3();
    let naj = Infinity;
    for (let i = 0; i < el.count; i++) { el.getMatrixAt(i, M); naj = Math.min(naj, p.setFromMatrixPosition(M).distanceTo(new THREE.Vector3(...d.tocka))); }
    assert.ok(naj < 0.01, `Z = ${Z}: točka valenčnih elektronov je ${naj.toFixed(3)} od najbližjega elektrona`);
  }
  a.dispose();
  // skrite vozelne ploskve nimajo oznake; ob vklopu se vrne
  const o = O.zgradi(THREE, { kakovost: "nizka", zacetek: { orbitala: "3pz" } });
  const vozli = o.nadzor.find((n) => n.id === "vozli");
  assert.ok(o.deli.some((d) => d.id === "vozli"));
  vozli.ob(false);
  assert.ok(!o.deli.some((d) => d.id === "vozli") && o.deli.every((d) => d.meshes.every((m) => m.visible)), "vozli izklopljeni");
  o.nadzor.find((n) => n.id === "orbitala").ob("4dxy");
  assert.ok(!o.deli.some((d) => d.id === "vozli"), "vozli ostanejo skriti ob menjavi orbitale");
  vozli.ob(true);
  assert.ok(o.deli.some((d) => d.id === "vozli"), "vozli vklopljeni");
  o.dispose();
});
