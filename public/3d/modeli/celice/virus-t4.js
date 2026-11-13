// Bakteriofag T4 na steni bakterije: glava (podaljšan dvajsetploskovec iz kapsomer) z DNK, vrat z ovratnikom in
// brčicami, krčljivi rep (vijačni obroči podenot okoli repne cevke), šesterokotna bazalna plošča, repna vlakna.
// Drsnik »Vbrizgavanje«: plašč repa se skrči, cevka prebode steno, DNK preide v bakterijo.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "virus-bakteriofag-t4",
  naslov: "Bakteriofag T4",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Virus, ki napada bakterijo E. coli (visok okoli 200 nm). Z repnimi vlakni se pritrdi na bakterijo, skrči plašč repa in vbrizga svojo DNK. Okno v glavi pokaže navito DNK; navojev je manj kot v resnici.",
  poskusi: "Premakni drsnik »Vbrizgavanje« do konca in opazuj, kam gre DNK.",
  merilo: { m: 360e-9, oznaka: "360 nm" },
};

export function zgradi(THREE, ctx = {}) {
  let seme = 53;
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const zac = ctx.zacetek || {};
  const group = new THREE.Group();
  let deli = [];
  const odpad = [];
  const kit = videzCelic(THREE, { hi, odpad });
  const { hash, sum } = kit;

  // ---------- orodja ----------
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const nakl = (s = 1) => V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(s);
  const gladko = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  // mat(barva, {…}): mokra površina beljakovin (relief in vlažen videz doda kit.poliraj na koncu).
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.7, clearcoatRoughness: 0.2,
      sheen: 0.4, sheenColor: new THREE.Color(barva).lerp(new THREE.Color(0xffffff), 0.45).multiplyScalar(0.8), sheenRoughness: 0.45,
    }, o));
    odpad.push(m);
    return m;
  }
  // Združi geometrije (z index ali brez) v eno; po želji pobarva vsako z barvo oglišč; ohrani atribut aRez (prerez dvosloja).
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], rez = [], idx = [];
    let off = 0;
    const zRez = geos.every((g) => g.attributes.aRez);
    geos.forEach((g, i) => {
      const p = g.attributes.position, n = g.attributes.normal, a = g.attributes.aRez;
      const c = barve ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (c) col.push(c.r, c.g, c.b);
        if (zRez) rez.push(a.getX(k), a.getY(k));
      }
      if (g.index) for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      else for (let k = 0; k < p.count; k++) idx.push(k + off);
      off += p.count;
      g.dispose();
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    if (barve) out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    if (zRez) out.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    out.setIndex(idx);
    return out;
  }
  function deformiraj(g, fn) {
    const p = g.attributes.position, v = V();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); fn(v, i); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    const d = { id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) };
    deli.push(d);
    return d;
  }
  // Trak (ploskev prereza) iz parov točk [a, b] z dano normalo; aRez = (s, 0 pri a … 1 pri b) za dvosloj.
  function trak(pari, nrm, s0 = 0) {
    const pos = [], nor = [], rez = [], idx = [];
    let s = s0;
    pari.forEach(([a, b], i) => {
      if (i) s += a.distanceTo(pari[i - 1][0]);
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z); nor.push(nrm.x, nrm.y, nrm.z, nrm.x, nrm.y, nrm.z); rez.push(s, 0, s, 1);
      if (i) { const k = 2 * i; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
    });
    let sx = 0, sy = 0, sz = 0;
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3;
      const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
      const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
      sx += uy * vz - uz * vy; sy += uz * vx - ux * vz; sz += ux * vy - uy * vx;
    }
    if (sx * nrm.x + sy * nrm.y + sz * nrm.z < 0) for (let i = 0; i < idx.length; i += 3) { const t = idx[i]; idx[i] = idx[i + 2]; idx[i + 2] = t; }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    g.setIndex(idx);
    return g;
  }
  const KAM = V(-0.47, 0.34, 0.81).normalize();
  const o = new THREE.Object3D(), gor = V(0, 1, 0);
  // zrnata kepica beljakovine (elipsoid s šumom)
  const kepa = (sx, sy, sz, n, ws, hs) => deformiraj(new THREE.SphereGeometry(1, ws, hs), (v) => {
    v.set(v.x * sx, v.y * sy, v.z * sz);
    v.multiplyScalar(1 + 0.1 * sum(v.x * 60 + n * 3.1, v.y * 60, v.z * 60));
  });
  const kepaP = (p, r, n) => kepa(r, r, r, n, q(10), q(7)).translate(p.x, p.y, p.z);
  // Valj od a do b; biseri > 0 doda zaporedje zadebelitev (domene beljakovinskega vlakna).
  function palica(a, b, r, seg = q(8), r2 = r, biseri = 0) {
    const d = b.clone().sub(a), L = d.length(), hs = biseri ? Math.max(2, Math.round(biseri * (hi ? 4 : 2))) : 1;
    const g = new THREE.CylinderGeometry(r2, r, L, seg, hs);
    if (biseri) deformiraj(g, (v) => { const u = v.y / L + 0.5, k = 1 + 0.38 * Math.abs(Math.sin(u * biseri * Math.PI)); v.x *= k; v.z *= k; });
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(gor, d.normalize()));
    const c = a.clone().add(b).multiplyScalar(0.5);
    return g.translate(c.x, c.y, c.z);
  }

  // 1 enota = 180 nm
  // ---------- glava: podaljšan dvajsetploskovec (120 × 86 nm) ----------
  const S = 0.267, E = 0.249, YH = 0.467;
  const az = (Math.atan2(KAM.z, KAM.x) - Math.PI / 5);
  const ogl = (r, y, a) => V(r * Math.cos(a + az), y, r * Math.sin(a + az));
  const VR = [ogl(0, S * (1 + E), 0)];
  for (let k = 0; k < 5; k++) VR.push(ogl(0.894 * S, S * (0.447 + E), (2 * Math.PI * k) / 5));
  for (let k = 0; k < 5; k++) VR.push(ogl(0.894 * S, -S * (0.447 + E), (2 * Math.PI * k) / 5 + Math.PI / 5));
  VR.push(ogl(0, -S * (1 + E), 0));
  const U = (k) => 1 + (k % 5), Lw = (k) => 6 + (k % 5), BOT = 11;
  let ploskve = [];
  for (let k = 0; k < 5; k++) ploskve.push([0, U(k + 1), U(k)], [U(k), U(k + 1), Lw(k)], [Lw(k), U(k + 1), Lw(k + 1)], [BOT, Lw(k), Lw(k + 1)]);
  ploskve = ploskve.map((f) => {
    const [a, b, c] = f.map((i) => VR[i]);
    const n = V().crossVectors(b.clone().sub(a), c.clone().sub(a));
    return n.dot(a.clone().add(b).add(c)) < 0 ? [f[0], f[2], f[1]] : f;
  });
  const normala = (f) => V().crossVectors(VR[f[1]].clone().sub(VR[f[0]]), VR[f[2]].clone().sub(VR[f[0]])).normalize();
  // okno: tri ploskve, najbolj obrnjene proti gledalcu
  const okno = new Set(ploskve.map((f, i) => [i, normala(f).dot(KAM)]).sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]));
  const robovi = new Map();
  ploskve.forEach((f, i) => { for (let j = 0; j < 3; j++) { const a = f[j], b = f[(j + 1) % 3], key = Math.min(a, b) + "-" + Math.max(a, b); robovi.set(key, (robovi.get(key) || 0) + (okno.has(i) ? 1 : 0)); } });
  const NOTR = 0.93; // notranja ploskev kapside (debelina lupine ≈ 4 nm)
  const ploskevG = (izberi, k = 1, obrni = false) => zdruzi(ploskve.filter((f, i) => izberi(i)).map((f) => {
    const t = new THREE.BufferGeometry().setFromPoints((obrni ? [f[0], f[2], f[1]] : f).map((j) => VR[j].clone().multiplyScalar(k)));
    t.computeVertexNormals();
    return t;
  }));
  const glava = new THREE.Mesh(ploskevG((i) => !okno.has(i)), mat("#4152c0", { roughness: 0.5 }));
  const glavaIn = new THREE.Mesh(ploskevG((i) => !okno.has(i), NOTR, true), mat("#4a3f8f", { roughness: 0.6 }));
  // rob okna: polna ploskev prereza lupine
  const robOk = [];
  for (const [key, nOk] of robovi) {
    if (nOk !== 1) continue;
    const [a, b] = key.split("-").map(Number), A = VR[a], Bv = VR[b];
    const n = A.clone().add(Bv).normalize().cross(Bv.clone().sub(A)).normalize();
    robOk.push(trak([[A.clone().multiplyScalar(1.004), A.clone().multiplyScalar(NOTR)], [Bv.clone().multiplyScalar(1.004), Bv.clone().multiplyScalar(NOTR)]], n));
  }
  const glavaRez = new THREE.Mesh(zdruzi(robOk), mat("#9aa8ff", { roughness: 0.45, side: THREE.DoubleSide }));
  const glavaPok = new THREE.Mesh(ploskevG((i) => okno.has(i)), glava.material);
  glavaPok.visible = false;
  // kapsomere: šesterčki gp23 (s sredinsko beljakovino Hoc) na trikotni mreži vsake ploskve, peterčki gp24 v ogliščih
  // mreža s korakom ≈ 13 nm: točke na robovih (skupne sosednjima ploskvama) in trikotna mreža v notranjosti ploskve
  const KR = 0.074, kapsO = new Map();
  const dodajK = (p, n, x, naOknu) => {
    const kl = p.toArray().map((v) => Math.round(v * 1e3)).join(",");
    const e = kapsO.get(kl) || { p, n: V(), x, okno: true };
    e.n.add(n);
    if (!naOknu) e.okno = false; // na robu okna ostane (kot prerezana kapsomera)
    kapsO.set(kl, e);
  };
  const red = (u) => u.x + u.y * 7.1 + u.z * 13.3;
  ploskve.forEach((f, i) => {
    const [a, b, c] = f.map((j) => VR[j]), n = normala(f), naOknu = okno.has(i);
    for (const [u, w] of [[a, b], [b, c], [c, a]]) {
      const [P, Q] = red(u) < red(w) ? [u, w] : [w, u]; // enake točke za obe ploskvi ob robu
      const m = Math.max(1, Math.round(P.distanceTo(Q) / KR));
      for (let k = 1; k < m; k++) dodajK(P.clone().lerp(Q, k / m), n, Q.clone().sub(P).normalize(), naOknu);
    }
    const ex = b.clone().sub(a).normalize(), ey = V().crossVectors(n, ex);
    const ed = [[a, b], [b, c], [c, a]].map(([u, w]) => ({ u, m: V().crossVectors(n, w.clone().sub(u).normalize()) }));
    const L = Math.max(a.distanceTo(b), b.distanceTo(c), c.distanceTo(a));
    for (let j = 0; j * KR * 0.866 < L; j++) for (let k = -3; k * KR < L + KR; k++) {
      const p = a.clone().addScaledVector(ex, (k + (j % 2) * 0.5) * KR).addScaledVector(ey, j * KR * 0.866);
      if (ed.every((e) => p.clone().sub(e.u).dot(e.m) > KR * 0.56)) dodajK(p, n, ex, naOknu);
    }
  });
  const kapsG = (n, rN, barva, hoc) => {
    const g = [];
    for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2; g.push(deformiraj(kepa(0.0172, 0.0145, 0.012, k, hi ? 7 : 5, hi ? 5 : 3), (v) => { v.applyAxisAngle(V(0, 0, 1), a); v.x += Math.cos(a) * rN; v.y += Math.sin(a) * rN; v.z += 0.008; })); }
    if (hoc && hi) g.push(kepa(0.009, 0.009, 0.011, 9, 7, 5).translate(0, 0, 0.016));
    return zdruzi(g);
  };
  const hexL = [...kapsO.values()];
  const hexOkno = hexL.filter((e) => e.okno), hexOst = hexL.filter((e) => !e.okno);
  const m4 = new THREE.Matrix4();
  const kapsMesh = (sez, geo, barva) => {
    const m = new THREE.InstancedMesh(geo, mat(barva), Math.max(1, sez.length));
    sez.forEach((e, i) => {
      const n = e.n.clone().normalize(), x = e.x.clone().projectOnPlane(n).normalize(), y = V().crossVectors(n, x);
      m.setMatrixAt(i, m4.makeBasis(x, y, n).setPosition(e.p.clone().addScaledVector(n, 0.002)));
    });
    m.count = sez.length;
    return m;
  };
  const hexGeo = kapsG(6, 0.0225, 0, true);
  const hexM = kapsMesh(hexOst, hexGeo, "#6f8cff");
  const hexP = kapsMesh(hexOkno, hexGeo.clone(), "#6f8cff");
  hexP.material = hexM.material;
  hexP.visible = false;
  const pentL = VR.filter((p, i) => i !== BOT).map((p) => ({ p, n: p.clone().normalize(), x: V(0, 1, 0).cross(p).normalize().lengthSq() > 0.1 ? V(0, 1, 0).cross(p).normalize() : V(1, 0, 0) }));
  const pentM = kapsMesh(pentL, kapsG(5, 0.018, 0, false), "#ffb43c");

  // ---------- DNK, navita v glavi kot na tuljavi (zunanji navoji, v sredini gosta sredica) ----------
  const dnkTocke = [VR[BOT].clone().multiplyScalar(0.8)];
  const RIN = 0.2, HIN = 0.29;
  const plasti = hi ? [0.172, 0.15, 0.128, 0.106] : [0.17, 0.138];
  const KOR = hi ? 0.021 : 0.03;
  let navzgor = true;
  for (const r of plasti) {
    const h = HIN * Math.sqrt(Math.max(0, 1 - (r / RIN) ** 2)) - 0.02;
    const navoji = Math.max(2, Math.floor((2 * h) / KOR)), korak = hi ? 22 : 12;
    for (let i = 0; i <= navoji * korak; i++) {
      const u = i / (navoji * korak), a = u * navoji * Math.PI * 2 + r * 9;
      const y = navzgor ? -h + 2 * h * u : h - 2 * h * u;
      dnkTocke.push(V(r * Math.cos(a), y, r * Math.sin(a)));
    }
    navzgor = !navzgor;
  }
  const dnkKr = new THREE.CatmullRomCurve3(dnkTocke);
  const dnkSeg = Math.round(dnkKr.getLength() / (hi ? 0.011 : 0.022)), RADD = hi ? 5 : 3;
  const dnkGeo = new THREE.TubeGeometry(dnkKr, dnkSeg, 0.0068, RADD, false);
  const dnkMat = mat(B.dnk, { roughness: 0.32, emissive: new THREE.Color(B.dnk).multiplyScalar(0.1) });
  const dnk = new THREE.Mesh(dnkGeo, dnkMat);
  const rS = plasti[plasti.length - 1] - 0.016;
  const sredica = new THREE.Mesh(kepa(rS, HIN * Math.sqrt(1 - (rS / RIN) ** 2) - 0.01, rS, 7, q(24), q(16)), mat("#c2337a", { roughness: 0.5 }));

  // ---------- vrat z ovratnikom in brčicami ----------
  const yP = VR[BOT].y;
  const vg = [palica(V(0, yP + 0.01, 0), V(0, yP - 0.055, 0), 0.04, q(16), 0.048), new THREE.CylinderGeometry(0.082, 0.078, 0.016, q(24)).translate(0, yP - 0.036, 0)];
  const vb = ["#5d74d8", "#8ea0ff"];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; vg.push(kepaP(V(Math.cos(a) * 0.05, yP - 0.002, Math.sin(a) * 0.05), 0.015, k)); vb.push("#7a8cf0"); } // portal in vratni obroč
  const brcT = [];
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + 0.3;
    vg.push(kepaP(V(Math.cos(a) * 0.08, yP - 0.036, Math.sin(a) * 0.08), 0.016, k + 20)); vb.push("#a9b6ff");
    brcT.push(new THREE.CatmullRomCurve3([V(Math.cos(a) * 0.085, yP - 0.036, Math.sin(a) * 0.085), V(Math.cos(a + 0.08) * 0.18, yP - 0.06, Math.sin(a + 0.08) * 0.18), V(Math.cos(a + 0.18) * 0.3, yP - 0.06 + 0.04 * Math.sin(k), Math.sin(a + 0.18) * 0.3)]));
  }
  const vrat = new THREE.Mesh(zdruzi(vg, vb), mat(0xffffff, { vertexColors: true }));
  const brcice = kit.vlakna(brcT, 0.0042, "#ffe08a", { sij: 0.3, seg: hi ? 24 : 10, rad: hi ? 5 : 3 });

  // ---------- repna cevka (9 nm, obroči gp19 s korakom 4 nm) ----------
  // Cevka ima ozko režo proti gledalcu (kot okno v glavi), da se med vbrizgavanjem vidi DNK v njej (kjer je cevka zunaj
  // plašča: v prerezu stene bakterije).
  const yN = yP - 0.055, yB = -0.47, CEV = 0.48;
  const RE = 1.3, thK = Math.atan2(KAM.x, KAM.z) + RE / 2, thL = Math.PI * 2 - RE;
  const cevG = new THREE.CylinderGeometry(0.025, 0.025, CEV, q(16), Math.round(CEV / (hi ? 0.0057 : 0.0113)), true, thK, thL).translate(0, yN - CEV / 2, 0);
  deformiraj(cevG, (v) => { const k = 1 + 0.1 * Math.cos(((v.y - yN) / 0.0226) * Math.PI * 2); v.x *= k; v.z *= k; });
  const YC = yN - CEV - 0.028; // konica cevke (v koordinatah glave)
  const cevka = new THREE.Mesh(zdruzi([cevG, new THREE.CylinderGeometry(0.025, 0.012, 0.028, q(16), 1, true, thK, thL).translate(0, yN - CEV - 0.014, 0)]), mat("#eef2ff", { roughness: 0.3, side: THREE.DoubleSide }));
  // DNK na poti: od portala v vratu skozi vso cevko do konice (riše se le del, ki je trenutno v cevki)
  const dnkCevKr = new THREE.LineCurve3(V(0, dnkTocke[0].y, 0), V(0, YC + 0.004, 0));
  const segCev = Math.round(dnkCevKr.getLength() / (hi ? 0.006 : 0.012));
  const dnkCev = new THREE.Mesh(new THREE.TubeGeometry(dnkCevKr, segCev, 0.0068, RADD, false), dnkMat);

  const glavaG = new THREE.Group();
  for (const m of [glava, glavaIn, glavaRez, glavaPok, hexM, hexP, pentM, dnk, sredica, dnkCev, vrat, brcice, cevka]) { m.position.y = YH; glavaG.add(m); }
  group.add(glavaG);

  // ---------- krčljivi plašč: 23 obročev po 6 podenot gp18 (138 beljakovin), vsak obroč zasukan za 17° ----------
  const pod = [], pb = [];
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    pod.push(kepa(0.026, 0.0118, 0.028, k, q(10), q(7)).rotateY(-a).translate(Math.cos(a) * 0.045, 0, Math.sin(a) * 0.045)); pb.push("#1fae96");
    if (hi) { const a2 = a + 0.28; pod.push(kepa(0.018, 0.0105, 0.02, k + 6, 8, 6).rotateY(-a2).translate(Math.cos(a2) * 0.07, 0.003, Math.sin(a2) * 0.07)); pb.push("#36dcbc"); }
  }
  const NO = 23;
  const plasc = new THREE.InstancedMesh(zdruzi(pod, pb), mat(0xffffff, { vertexColors: true }), NO);
  group.add(plasc);

  // ---------- bazalna plošča: šest klinov okoli pesta z iglo (gp5), zatiči za dolga vlakna ----------
  const aK = Math.atan2(KAM.z, KAM.x);
  const bg = [new THREE.CylinderGeometry(0.13, 0.115, 0.03, 6, 1).rotateY(Math.PI / 2 - aK - Math.PI / 6).translate(0, yB - 0.035, 0), new THREE.CylinderGeometry(0.052, 0.045, 0.05, q(16)).translate(0, yB - 0.03, 0)];
  const bb = ["#b8452f", "#d65a3e"];
  // igla (gp5/gp27) sedi na konici cevke: ob krčenju jo cevka potisne skozi zunanjo membrano, v periplazmi (ob
  // peptidoglikanu, ki ga gp5 razgradi) se odcepi in razpade
  const YI = yB - 0.055; // vrh igle v mirovanju (pod pestom plošče)
  const igla = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.004, 0.06, q(10)).translate(0, -0.03, 0), mat("#ffd0a0"));
  igla.position.y = YI;
  const vog = [];
  for (let k = 0; k < 6; k++) {
    const a = aK + Math.PI / 6 + (k / 6) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    vog.push(a);
    bg.push(kepa(0.036, 0.024, 0.03, k, q(10), q(7)).rotateY(-a).translate(c * 0.09, yB - 0.02, s * 0.09)); bb.push("#ff7a5c"); // gp7
    bg.push(kepaP(V(c * 0.14, yB - 0.03, s * 0.14), 0.026, k + 10)); bb.push("#ff9a6a"); // gp10 in zatič gp9
    bg.push(kepaP(V(c * 0.115, yB - 0.058, s * 0.115), 0.018, k + 20)); bb.push("#e8603e"); // gp11 (sidrišče kratkega vlakna)
  }
  const plosca = new THREE.Mesh(zdruzi(bg, bb), mat(0xffffff, { vertexColors: true }));
  group.add(plosca, igla);

  // ---------- repna vlakna: dolga (gp34 + kolence gp35 + gp36/37 s konico), kratka (gp12) ----------
  const YS = -0.565; // vrh bakterijske stene
  const dv = [], db = [], kv = [], vlT = [];
  for (const a of vog) {
    const c = Math.cos(a), s = Math.sin(a);
    const p0 = V(c * 0.15, yB - 0.025, s * 0.15), p1 = V(c * 0.43, -0.29, s * 0.43), p2 = V(c * 0.62, YS + 0.014, s * 0.62);
    dv.push(palica(p0, p1, 0.0085, q(8), 0.0085, 8), kepaP(p1, 0.017, 1), palica(p1, p2, 0.0062, q(8), 0.0072, 9), kepa(0.012, 0.016, 0.012, 3, q(8), q(6)).translate(p2.x, p2.y + 0.004, p2.z));
    db.push("#ffc94a", "#ff9a3c", "#ffd86a", "#ff9a3c");
    vlT.push(p1);
    const k0 = V(c * 0.115, yB - 0.062, s * 0.115), k1 = V(c * 0.18, YS + 0.01, s * 0.18);
    kv.push(palica(k0, k1, 0.0085, q(7), 0.0085, 4), kepaP(k1, 0.013, 4));
  }
  const dolga = new THREE.Mesh(zdruzi(dv, db), mat(0xffffff, { vertexColors: true }));
  const kratka = new THREE.Mesh(zdruzi(kv), mat("#e08a3a"));
  group.add(dolga, kratka);

  // ---------- košček bakterijske stene: zunanja membrana z LPS, peptidoglikan, celična membrana ----------
  // košček stene je prerezan: izrezan klin proti gledalcu pokaže plasti (v membranah dvosloj fosfolipidov)
  const fiK = Math.atan2(KAM.x, KAM.z), KLIN = 0.44, fi0 = fiK + KLIN, fiL = Math.PI * 2 - 2 * KLIN;
  function plast(y0, y1, R, hrapav) {
    const pr = [], nR = q(14);
    for (let i = 0; i <= nR; i++) pr.push(new THREE.Vector2((i / nR) * (R - 0.012), y1));
    pr.push(new THREE.Vector2(R, y1 - 0.006), new THREE.Vector2(R + 0.004, (y0 + y1) / 2), new THREE.Vector2(R, y0 + 0.006));
    for (let i = nR; i >= 0; i--) pr.push(new THREE.Vector2((i / nR) * (R - 0.012), y0));
    const rez = [];
    for (const fi of [fi0, fi0 + fiL]) {
      const sx = Math.sin(fi), sz = Math.cos(fi), pari = [];
      for (let i = 0; i <= nR * 3; i++) { const r = (i / (nR * 3)) * (R - 0.004); pari.push([V(r * sx, y1, r * sz), V(r * sx, y0, r * sz)]); }
      rez.push(trak(pari, V(sz, 0, -sx).multiplyScalar(fi === fi0 ? -1 : 1), fi === fi0 ? 0 : 3.7));
    }
    const obl = (v) => {
      const a = Math.atan2(v.z, v.x), rr = Math.hypot(v.x, v.z);
      const f = 1 + 0.05 * sum(Math.cos(a) * 2.5 + 7, Math.sin(a) * 2.5, y0 * 3) * Math.min(1, rr / R);
      v.x *= f; v.z *= f;
      if (hrapav && v.y > (y0 + y1) / 2) v.y += hrapav * sum(v.x * 40, 3, v.z * 40);
    };
    const g = deformiraj(new THREE.LatheGeometry(pr, q(60), fi0, fiL), obl);
    const gr = zdruzi(rez);
    const p = gr.attributes.position, v = V();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); obl(v); p.setXYZ(i, v.x, v.y, v.z); }
    return { g, rez: gr };
  }
  const omP = plast(-0.605, YS, 0.68, 0.004), pgP = plast(-0.645, -0.615, 0.66, 0.003), imP = plast(-0.72, -0.68, 0.64, 0.003);
  const zun = new THREE.Mesh(omP.g, kit.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.2, rf: 40, k: 0.7, rob: B.membranaRob, rk: 1.1 }));
  const zunRez = new THREE.Mesh(omP.rez, kit.dvoslojMat(0.04, { glave: "#7f55e8", repi: "#9a88e0", beljakovina: "#5fd0b8", delez: 0.25 }));
  const pg = new THREE.Mesh(pgP.g, kit.sencilo(mat(new THREE.Color(B.stena).lerp(new THREE.Color(B.stenaTemna), 0.3), { side: THREE.DoubleSide }), { vr: 3, rf: 70, k: 0.8, b: 0.22, s: 0.12, luknje: { f: 55, prag: 0.6 } }));
  const pgRez = new THREE.Mesh(pgP.rez, mat(B.stenaTemna, { side: THREE.DoubleSide }));
  pgRez.material.userData.rez = true;
  const memB = new THREE.Mesh(imP.g, mat(B.dvosloj, { side: THREE.DoubleSide }));
  const memRez = new THREE.Mesh(imP.rez, kit.dvoslojMat(0.04, { glave: "#7f55e8", repi: "#9a88e0", beljakovina: "#ffb43c", delez: 0.2 }));
  // LPS (sladkorne verige) in porini na zunanji membrani, beljakovine na celični membrani
  const vKlinu = (p) => { const a = Math.atan2(p.x, p.z) - fiK; const b = Math.atan2(Math.sin(a), Math.cos(a)); return Math.abs(b) < KLIN + 0.03; };
  const vrh = (y) => (p, n) => { if (n.y < 0) n.negate(); return n.y > 0.7 && p.y > y && !vKlinu(p) && Math.hypot(p.x, p.z) > 0.05; };
  const lpsT = kit.posej(zun, hi ? 520 : 160, vrh(YS - 0.01));
  const lpsG = hi ? zdruzi([new THREE.CylinderGeometry(0.0035, 0.0045, 0.02, 4, 1).translate(0, 0.01, 0), new THREE.IcosahedronGeometry(0.0065, 0).translate(0, 0.022, 0)])
    : new THREE.IcosahedronGeometry(1, 0).scale(0.006, 0.014, 0.006).translate(0, 0.01, 0);
  const lps = new THREE.InstancedMesh(lpsG, mat("#bdeeff", { roughness: 0.3 }), lpsT.length);
  lpsT.forEach((t, i) => { o.position.copy(t.p); o.quaternion.setFromUnitVectors(gor, t.n.clone().add(nakl(0.5)).normalize()); o.scale.setScalar(0.8 + rnd() * 0.5); o.updateMatrix(); lps.setMatrixAt(i, o.matrix); });
  const porini = kit.beljakovine(kit.posej(zun, hi ? 70 : 30, vrh(YS - 0.01)), "#5fd0b8", 0.01, { visina: 0.7 });
  const imBelj = kit.beljakovine(kit.posej(memB, hi ? 90 : 36, vrh(-0.69)), "#ffb43c", 0.01, { visina: 1.4 });
  group.add(zun, zunRez, pg, pgRez, memB, memRez, lps, porini, imBelj);

  // DNK v bakteriji (raste med vbrizgavanjem)
  const YT = -0.75; // konica cevke po krčenju (tik pod celično membrano)
  const CB = V(KAM.x, 0, KAM.z).normalize().multiplyScalar(0.2).setY(-0.85);
  const vp = [V(0, YT + 0.02, 0), V(0, YT - 0.03, 0)];
  let p = vp[1].clone(), d = V(KAM.x, -0.6, KAM.z).normalize();
  for (let i = 0; i < 70; i++) {
    d.add(nakl(1.1)).normalize();
    let q2 = p.clone().addScaledVector(d, 0.05);
    for (let t = 0; t < 8 && (((q2.x - CB.x) / 0.26) ** 2 + ((q2.y - CB.y) / 0.08) ** 2 + ((q2.z - CB.z) / 0.26) ** 2 > 1); t++) { d.add(CB.clone().sub(q2).multiplyScalar(4)).normalize(); q2 = p.clone().addScaledVector(d, 0.05); }
    vp.push(q2); p = q2;
  }
  const notSeg = q(700);
  const dnkB = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(vp), notSeg, 0.0068, RADD, false), dnkMat);
  group.add(dnkB);

  // rahle razlike v svetlosti med ponovljenimi beljakovinami
  {
    const c = new THREE.Color();
    for (const m of [hexM, hexP, lps]) for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.86 + 0.24 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
  }

  // ---------- deli ----------
  const najblizja = (tocke, pogoj = () => true) => tocke.filter(pogoj).sort((a, b) => b.dot(KAM) - a.dot(KAM))[0];
  const tGlava = najblizja(hexOst.map((e) => e.p), (x) => x.y > 0.12) || hexOst[0].p;
  const dGl = del("glava", "Glava (kapsida)", "Beljakovinski ovoj v obliki podaljšanega dvajsetploskovca iz 155 šesterčkov (kapsomer) in 11 peterčkov v ogliščih; v dvanajstem oglišču je vrat. Varuje DNK.", "#6f8cff",
    [glava, glavaIn, glavaRez, glavaPok, hexM, hexP, pentM], [tGlava.x, tGlava.y + YH, tGlava.z]);
  const dDnk = del("dnk", "DNK", "Dedni zapis virusa: dolga dvojna vijačnica (okoli 169 000 parov baz), tesno navita v glavi; ob okužbi potuje skozi rep v bakterijo.", B.dnk, [dnk, sredica, dnkCev, dnkB], [0, YH, 0]);
  const dVr = del("vrat", "Vrat z ovratnikom", "Kratek vrat pod glavo, ki glavo povezuje z repom; skozi portal v njem DNK zapusti glavo.", "#8ea0ff", [vrat], [0.05, yP - 0.036 + YH, 0.07]);
  const tBr = brcT.map((c) => c.getPointAt(0.6)).sort((a, b) => b.dot(KAM) - a.dot(KAM))[0];
  const dBr = del("brcice", "Brčice (fibritin)", "Šest tankih vlaken na ovratniku; pomagajo pri sestavljanju repnih vlaken in jih zadržijo, dokler virus ne najde bakterije.", "#ffe08a", [brcice], [tBr.x, tBr.y + YH, tBr.z]);
  const tGl = dGl.tocka.slice(), tVr = dVr.tocka.slice(), tBrc = dBr.tocka.slice();
  const dPlasc = del("plasc", "Krčljivi plašč repa", "Ovoj iz 23 obročev s po šestimi beljakovinami, ki se vijejo okoli repne cevke; ob okužbi se skrči kot vzmet in potisne cevko skozi steno bakterije.", "#1fae96", [plasc], [0, 0, 0]);
  const dCev = del("cevka", "Repna cevka", "Votla cevka v repu, skozi katero DNK potuje iz glave v bakterijo; vidna je, ko se plašč skrči.", "#eef2ff", [cevka], [0, 0, 0]);
  del("bazalna-plosca", "Bazalna plošča", "Šesterokotna plošča na koncu repa; ko vlakna najdejo bakterijo, sproži krčenje plašča. Igla v njenem središču načne steno bakterije.", "#ff7a5c", [plosca, igla],
    V(Math.cos(aK) * 0.13, yB - 0.03, Math.sin(aK) * 0.13).toArray());
  const tv = V(Math.cos(vog[0]) * 0.52, (-0.29 + YS) / 2, Math.sin(vog[0]) * 0.52);
  del("dolga-vlakna", "Dolga repna vlakna", "Šest dolgih, v kolenu zalomljenih vlaken, s katerimi virus otipa bakterijo in prepozna beljakovine ter sladkorje na njeni površini.", "#ffc94a", [dolga], tv.toArray());
  del("kratka-vlakna", "Kratka repna vlakna", "Kratka vlakna pod bazalno ploščo, ki virus trdno pripnejo na steno bakterije.", "#e08a3a", [kratka],
    V(Math.cos(vog[5]) * 0.17, YS + 0.012, Math.sin(vog[5]) * 0.17).toArray());
  del("stena-bakterije", "Celična stena bakterije", "Zunanja membrana s sladkornimi verigami (LPS) in tanka mreža peptidoglikana bakterije E. coli, ki ju virus prebode z repno cevko.", B.stena, [zun, zunRez, pg, pgRez, lps, porini],
    [Math.sin(fiK + 1.1) * 0.45, YS + 0.004, Math.cos(fiK + 1.1) * 0.45]);
  del("membrana-bakterije", "Celična membrana bakterije", "Notranja membrana bakterije (dvosloj fosfolipidov); pod njo je citoplazma, kamor pride virusna DNK.", B.dvosloj, [memB, memRez, imBelj], [Math.sin(fiK + 0.55) * 0.3, -0.7, Math.cos(fiK + 0.55) * 0.3]);
  const vsiDeli = deli.slice();

  // ---------- vbrizgavanje ----------
  // 0 … 0,5: plašč se skrči (krajši in širši), glava s cevko se spusti, cevka prebode steno do celične membrane.
  // 0,5 … 1: DNK zapušča glavo skozi portal, potuje po cevki (sprednji konec doseže konico, ko je izpraznjenih ~10 %
  // glave) in se v citoplazmi nabira; ob koncu zapusti cevko še zadnji konec. Tako je DNK vedno nekje vidna.
  const L0 = YH + yN - yB, LK = 0.205, idxDnk = dnkGeo.index.count, nRad = RADD * 6, idxCev = dnkCev.geometry.index.count;
  const F = 0.1; // delež poti, ko je DNK že v cevki, v bakteriji pa še ne (in na koncu obratno)
  const med = (x) => Math.min(1, Math.max(0, x));
  let v = 0, ddZdaj = 0;
  function nastavi(x) {
    v = Math.min(1, Math.max(0, +x || 0));
    nadzor[0].vrednost = v;
    // DNK krene takoj, ko je plašč skrčen (brez mrtvega dela drsnika), in teče enakomerno
    const a = gladko(0, 0.5, v), dd = med((v - 0.5) / 0.5);
    ddZdaj = dd;
    const D = a * (L0 - LK), L = L0 - D;
    glavaG.position.y = -D;
    const rs = 1 + 0.36 * a;
    for (let i = 0; i < NO; i++) {
      o.position.set(0, yB + (i + 0.5) * (L / NO), 0);
      o.rotation.set(0, i * 0.3 + a * 0.6, 0);
      o.scale.set(rs, 1 - 0.55 * a, rs); o.updateMatrix(); plasc.setMatrixAt(i, o.matrix);
    }
    plasc.instanceMatrix.needsUpdate = true;
    plasc.computeBoundingSphere();
    // igla: cevka jo doseže, ko prepotuje vrzel do nje, potem jo potiska pred sabo; v periplazmi razpade
    const yKon = YC + YH - D, yIg = Math.min(YI, yKon);
    igla.position.y = yIg;
    const ki = 1 - gladko(-0.57, -0.62, yIg);
    igla.scale.setScalar(Math.max(0.001, ki));
    igla.visible = ki > 0.02;
    // DNK v glavi (od portala naprej), v cevki in v bakteriji
    const hd = med(dd / (1 - F)), cd = med((dd - F) / (1 - F));
    const zc = Math.floor(hd * dnkSeg) * nRad;
    dnk.geometry.setDrawRange(zc, Math.max(0, idxDnk - zc));
    dnk.visible = zc < idxDnk;
    // gosta sredica se manjša sorazmerno z izpraznjenim delom glave (prej je stala do polovice in glava je bila videti polna)
    const ks = Math.max(0.001, Math.sqrt(1 - hd));
    sredica.scale.set(ks, ks, ks);
    sredica.visible = ks > 0.01;
    const c0 = Math.floor(med((dd - (1 - F)) / F) * segCev) * nRad, c1 = Math.floor(med(dd / F) * segCev) * nRad;
    dnkCev.geometry.setDrawRange(c0, Math.max(0, Math.min(idxCev, c1) - c0));
    dnkCev.visible = c1 > c0 && dd > 0.002 && dd < 0.998;
    dnkB.geometry.setDrawRange(0, Math.floor(cd * notSeg) * nRad);
    dnkB.visible = cd > 0.005;
    dPlasc.tocka = [Math.cos(az + 2) * 0.07 * rs, yB + L * 0.6, Math.sin(az + 2) * 0.07 * rs].map((x) => Math.round(x * 1000) / 1000);
    dCev.tocka = (a > 0.3 ? [KAM.x * 0.03, -0.66, KAM.z * 0.03] : [0.02, yB + 0.05, 0.03]);
    const kj = hd < 0.995 ? dnkTocke[Math.min(dnkTocke.length - 1, Math.floor(hd * dnkTocke.length + dnkTocke.length * 0.02))] : null;
    dDnk.tocka = kj ? [kj.x, kj.y + YH - D, kj.z] : cd > 0.005 ? vp[Math.floor(vp.length / 2)].toArray() : [0, -0.66, 0];
    dGl.tocka = [tGl[0], tGl[1] - D, tGl[2]]; dVr.tocka = [tVr[0], tVr[1] - D, tVr[2]]; dBr.tocka = [tBrc[0], tBrc[1] - D, tBrc[2]];
    deli = vsiDeli.filter((x) => x !== dCev || a > 0.05);
  }
  // Besedilo sledi istim mejam kot slika: krčenje do 0,5, nato DNK (glava → cevka → bakterija), konec, ko je tudi cevka prazna.
  const faza = () => (v < 0.02 ? "Virus je z repnimi vlakni pritrjen na bakterijo" : v <= 0.5 ? "Plašč repa se krči, cevka prebija steno"
    : ddZdaj < 0.998 ? "DNK potuje iz glave skozi repno cevko v bakterijo" : "Vsa DNK je v bakteriji, glava je prazna");
  const zaprta = (x) => { nadzor[2].vrednost = x; glavaPok.visible = hexP.visible = x === "zaprta"; };
  const nadzor = [
    { tip: "drsnik", id: "vbrizgavanje", oznaka: "Vbrizgavanje", min: 0, max: 1, korak: 0.01, vrednost: 0, ob: nastavi },
    { tip: "izpis", id: "faza", oznaka: "Faza", vrednost: faza },
    { tip: "izbira", id: "prikaz", oznaka: "Glava", moznosti: [["odprta", "Z oknom"], ["zaprta", "Zaprta"]], vrednost: "odprta", ob: zaprta },
  ];
  if (zac.vbrizgavanje != null && isFinite(+zac.vbrizgavanje)) nadzor[0].vrednost = Math.min(1, Math.max(0, +zac.vbrizgavanje));
  zaprta(zac.prikaz === "zaprta" ? "zaprta" : "odprta");
  nastavi(nadzor[0].vrednost);

  kit.poliraj(group, vsiDeli, {
    glava: { tex: "zrna", rf: 120, k: 0.8, b: 0.22 },
    dnk: { tex: null, rough: 0.3, cc: 0.85 },
    vrat: { tex: "zrna", rf: 110, k: 0.7 },
    plasc: { tex: "gube", rf: 110, k: 0.8, b: 0.2 },
    cevka: { tex: "fino", rf: 160, k: 0.5 },
    "bazalna-plosca": { tex: "zrna", rf: 100, k: 0.8, b: 0.2 },
    "dolga-vlakna": { tex: "fino", rf: 140, k: 0.6 },
    "kratka-vlakna": { tex: "fino", rf: 140, k: 0.6 },
    "stena-bakterije": { tex: null, rough: 0.3, cc: 0.9 },
    "membrana-bakterije": { tex: "fino", rf: 90, k: 0.8, b: 0.2, lisa: 0.14, f: 6 },
  });
  // stikalo »Barve kot v učbeniku«: klasične barve slik bakteriofaga
  const ucb = kit.barveUcbenika(vsiDeli, {
    glava: "#7fa3d8", dnk: "#e53935", vrat: "#5e7fb8", brcice: "#f2c94a", plasc: "#4caf50", cevka: "#d8d8d8", "bazalna-plosca": "#e57c3a",
    "dolga-vlakna": "#f2a93a", "kratka-vlakna": "#c27a3a", "stena-bakterije": "#5c9e2e", "membrana-bakterije": "#e8809a",
  });
  nadzor.push(ucb);

  return {
    group,
    get deli() { return deli; },
    nadzor,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81],
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
