// Virus HIV v prerezu: steklena ovojnica (prerez pokaže dvosloj fosfolipidov) s trimeri Env (gp120 + gp41, sladkorni
// ščit), pod njo mreža matriksnega proteina p17, v sredini stožčasta kapsida iz šesterčkov in peterčkov p24 z dvema
// molekulama RNK (obdanima z beljakovino p7) in encimi (reverzna transkriptaza, integraza, proteaza).
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "virus-hiv",
  naslov: "Virus HIV",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Virus človeške imunske pomanjkljivosti (premer okoli 110 nm), ki povzroča aids. Skozi prozorno ovojnico in izrezan klin se vidi stožčasta kapsida iz šesterčkov in peterčkov beljakovine p24, v njej dve molekuli RNK in encimi. Ima 12 bodic, toliko kot pravi virusi (od okoli 7 do 14).",
  poskusi: "Tapni stožčasto kapsido in poišči obe molekuli RNK v njej, nato še peterčke na koncih kapside.",
  merilo: { m: 150e-9, oznaka: "150 nm" },
};

export function zgradi(THREE, ctx = {}) {
  let seme = 79;
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const zac = ctx.zacetek || {};
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  const kit = videzCelic(THREE, { hi, odpad });
  const { hash, sum, fbm } = kit;

  // ---------- orodja ----------
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const nakl = (s = 1) => V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(s);
  // mat(barva, {…}): mokra površina beljakovin (relief in vlažen videz doda kit.poliraj na koncu).
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.7, clearcoatRoughness: 0.2,
      sheen: 0.4, sheenColor: new THREE.Color(barva).lerp(new THREE.Color(0xffffff), 0.45).multiplyScalar(0.8), sheenRoughness: 0.45,
    }, o));
    odpad.push(m);
    return m;
  }
  // Združi geometrije (z index ali brez) v eno; po želji pobarva vsako z barvo oglišč.
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], idx = [];
    let off = 0;
    geos.forEach((g, i) => {
      const p = g.attributes.position, n = g.attributes.normal;
      const c = barve ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (c) col.push(c.r, c.g, c.b);
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
    deli.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }
  // Trak (ploskev prereza) iz parov točk [zunanja, notranja] z dano normalo.
  function trak(pari, nrm) {
    const pos = [], nor = [], idx = [];
    pari.forEach(([a, b], i) => {
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z); nor.push(nrm.x, nrm.y, nrm.z, nrm.x, nrm.y, nrm.z);
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
    g.setIndex(idx);
    return g;
  }
  // zrnata kepica beljakovine (elipsoid s šumom)
  const kepa = (sx, sy, sz, n, ws, hs) => deformiraj(new THREE.SphereGeometry(1, ws, hs), (v) => {
    v.set(v.x * sx, v.y * sy, v.z * sz);
    v.multiplyScalar(1 + 0.1 * sum(v.x * 70 + n * 3.1, v.y * 70, v.z * 70));
  });
  const KAM = V(-0.47, 0.34, 0.81).normalize();
  const o = new THREE.Object3D(), gor = V(0, 1, 0);

  // 1 enota = 75 nm
  const RE = 0.74, D = 0.06; // ovojnica: premer ≈ 111 nm, lipidni dvosloj ≈ 4,5 nm
  const oblE = (d) => RE * (1 + 0.02 * fbm(d.x * 1.7 + 4, d.y * 1.7, d.z * 1.7) + 0.005 * sum(d.x * 9, d.y * 9, d.z * 9));
  const odm = (dz) => (d) => oblE(d) - dz;
  // izrezan klin: x < 0, z > 0 po vsej višini (proti gledalcu)
  const vKlinu = (d, m = 0) => d.x < m && d.z > -m;
  const MER = [(t) => V(0, Math.cos(t * Math.PI), Math.sin(t * Math.PI)), (t) => V(-Math.sin(t * Math.PI), Math.cos(t * Math.PI), 0)];
  function lupinaK(f, ws, hs) {
    const odp = new THREE.SphereGeometry(1, ws, hs, Math.PI / 2, Math.PI * 1.5, 0, Math.PI);
    const pok = new THREE.SphereGeometry(1, Math.round(ws / 4), hs, 0, Math.PI / 2, 0, Math.PI);
    for (const g of [odp, pok]) deformiraj(g, (v) => { v.normalize(); v.multiplyScalar(f(v)); });
    return { odprta: odp, pokrov: pok };
  }

  // ---------- ovojnica: steklena zunanja ploskev, temna notranja stran, prerez dvosloja ----------
  const ov = lupinaK(oblE, q(104), q(68));
  const ovMat = kit.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.15, rf: 34, k: 0.7, rob: "#9fb4ff", rk: 1.3 });
  const ovOut = new THREE.Mesh(ov.odprta, ovMat);
  const ovPok = new THREE.Mesh(ov.pokrov, ovMat);
  ovPok.visible = false;
  const ovIn = new THREE.Mesh(lupinaK(odm(D), q(84), q(56)).odprta, mat(0x2b1f5c, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  const ovRez = new THREE.Mesh(kit.prerezDvosloj(oblE, odm(D), q(200), MER), kit.dvoslojMat(D, { glave: "#7f55e8", repi: "#9a88e0", beljakovina: "#5fd0b8", delez: 0.16 }));
  group.add(ovOut, ovPok, ovIn, ovRez);

  // ---------- bodice Env: trimer gp120 (glavica) na gp41 (pecelj skozi ovojnico) ----------
  function gp41G() {
    const g = [];
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2, pts = [];
      for (let i = 0; i <= 8; i++) { const u = i / 8, b = a + u * 1.3; pts.push(V(Math.cos(b) * (0.011 + 0.014 * u), -D - 0.03 + u * (D + 0.1), Math.sin(b) * (0.011 + 0.014 * u))); }
      g.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), hi ? 12 : 6, 0.0095, hi ? 6 : 3, false));
    }
    return zdruzi(g);
  }
  const DL = hi ? [12, 9] : [6, 4];
  function gp120G() {
    const g = [], b = [];
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2;
      g.push(deformiraj(kepa(0.048, 0.042, 0.05, k, ...DL), (v) => { v.applyAxisAngle(V(-Math.sin(a), 0, Math.cos(a)), 0.5); v.x += Math.cos(a) * 0.042; v.z += Math.sin(a) * 0.042; v.y += 0.098; })); b.push("#2fcfa8");
      // zanki V1/V2 na vrhu trimera
      const a2 = a + 0.9;
      g.push(kepa(0.022, 0.02, 0.022, k + 5, ...DL).translate(Math.cos(a2) * 0.022, 0.142, Math.sin(a2) * 0.022)); b.push("#5fe6c4");
    }
    return zdruzi(g, b);
  }
  const bodD = [], rezB = [], NB = 12;
  for (let i = 0; i < NB; i++) {
    const y = 1 - (2 * (i + 0.5)) / NB, r = Math.sqrt(1 - y * y), a = i * 2.39996 + 0.4;
    const d = V(Math.cos(a) * r, y, Math.sin(a) * r).add(nakl(0.15)).normalize();
    (vKlinu(d, 0.12) ? rezB : bodD).push(d);
  }
  const nB0 = bodD.length;
  bodD.push(...rezB);
  const g120Geo = gp120G();
  const gp41 = new THREE.InstancedMesh(gp41G(), mat("#1d8f84"), bodD.length);
  const gp120 = new THREE.InstancedMesh(g120Geo, mat(0xffffff, { vertexColors: true }), bodD.length);
  // sladkorni ščit: glikani prekrivajo skoraj vso zunanjo površino gp120
  const glLay = kit.posej(new THREE.Mesh(g120Geo), hi ? 22 : 9, (p, n) => p.y > 0.06 && n.y > -0.5);
  const glikG = hi ? zdruzi([new THREE.IcosahedronGeometry(0.0085, 0).translate(0, 0.007, 0), new THREE.IcosahedronGeometry(0.0075, 0).translate(0.006, 0.018, 0.002), new THREE.IcosahedronGeometry(0.0068, 0).translate(-0.005, 0.02, -0.003)])
    : new THREE.IcosahedronGeometry(1, 0).scale(0.01, 0.015, 0.01).translate(0, 0.009, 0);
  const glik = new THREE.InstancedMesh(glikG, mat("#bdeeff", { roughness: 0.3 }), bodD.length * glLay.length);
  const mL = new THREE.Matrix4(), qa = new THREE.Quaternion();
  bodD.forEach((d, i) => {
    o.position.copy(d).multiplyScalar(oblE(d) - 0.004); o.quaternion.setFromUnitVectors(gor, d.clone().add(nakl(0.25)).normalize()); o.rotateY(rnd() * 6); o.scale.setScalar(1); o.updateMatrix();
    gp41.setMatrixAt(i, o.matrix); gp120.setMatrixAt(i, o.matrix);
    glLay.forEach((t, j) => glik.setMatrixAt(i * glLay.length + j, o.matrix.clone().multiply(mL.compose(t.p.clone().addScaledVector(t.n, -0.002), qa.setFromUnitVectors(gor, t.n), V(1, 1, 1).multiplyScalar(0.85 + 0.3 * hash(i, j, 2))))));
  });
  gp41.count = gp120.count = nB0;
  glik.count = nB0 * glLay.length;
  group.add(gp41, gp120, glik);

  // ---------- matriksni protein p17: trimeri v nesklenjeni mreži tik pod ovojnico ----------
  const maG = zdruzi([0, 1, 2].map((k) => { const a = (k / 3) * Math.PI * 2; return kepa(0.024, 0.02, 0.026, k + 11, hi ? 7 : 4, hi ? 5 : 3).translate(Math.cos(a) * 0.024, 0, Math.sin(a) * 0.024); }));
  const maD = [], maRez = [], NM = hi ? 760 : 420;
  for (let i = 0; i < NM; i++) {
    const y = 1 - (2 * (i + 0.5)) / NM, r = Math.sqrt(1 - y * y), a = i * 2.39996 + 1.1;
    const d = V(Math.cos(a) * r, y, Math.sin(a) * r).add(nakl(0.02)).normalize();
    if (fbm(d.x * 2.6 + 5, d.y * 2.6, d.z * 2.6) < -0.04 || bodD.some((b) => b.angleTo(d) < 0.07)) continue; // vrzeli v mreži, prostor za repe gp41
    (vKlinu(d, 0.06) ? maRez : maD).push(d);
  }
  const nMA0 = maD.length;
  maD.push(...maRez);
  const ma = new THREE.InstancedMesh(maG, mat("#6c7fc9"), maD.length);
  maD.forEach((d, i) => { o.position.copy(d).multiplyScalar(oblE(d) - D - 0.016); o.quaternion.setFromUnitVectors(gor, d.clone().negate()); o.rotateY(rnd() * 6); o.scale.setScalar(0.9 + rnd() * 0.2); o.updateMatrix(); ma.setMatrixAt(i, o.matrix); });
  ma.count = nMA0;
  group.add(ma);

  // ---------- stožčasta kapsida (p24): mreža šesterčkov, 12 peterčkov (5 na ožjem, 7 na širšem koncu) ----------
  // lokalne osi: y = os stožca, z = proti gledalcu (ta polovica širšega dela je odrezana)
  const R0 = V().crossVectors(gor, KAM).normalize(), U0 = V().crossVectors(KAM, R0).normalize();
  const osK = U0.clone().addScaledVector(R0, -0.32).normalize();
  const zK = KAM.clone().addScaledVector(osK, -KAM.dot(osK)).normalize(), xK = V().crossVectors(osK, zK);
  const kapsG = new THREE.Group();
  kapsG.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xK, osK, zK));
  kapsG.position.copy(R0).multiplyScalar(-0.07).addScaledVector(U0, 0.02);
  group.add(kapsG);
  const prof = [];
  for (let i = 0; i <= 8; i++) { const t = -Math.PI / 2 + (i / 8) * (Math.PI / 2 + 0.22); prof.push([0.1 * Math.cos(t), -0.5 + 0.1 * Math.sin(t)]); }
  const c0 = prof[prof.length - 1];
  for (let i = 1; i <= 24; i++) { const u = i / 24; prof.push([c0[0] + (0.3 - c0[0]) * u, c0[1] + (0.38 - c0[1]) * u]); }
  for (let i = 1; i <= 12; i++) { const t = (i / 12) * Math.PI / 2; prof.push([0.3 * Math.cos(t), 0.38 + 0.18 * Math.sin(t)]); }
  prof[prof.length - 1][0] = 0;
  const odmikP = (dz) => prof.map(([r, h], i) => {
    const a = prof[Math.max(0, i - 1)], b = prof[Math.min(prof.length - 1, i + 1)];
    const tr = b[0] - a[0], th = b[1] - a[1], l = Math.hypot(tr, th) || 1;
    return new THREE.Vector2(Math.max(0, r - dz * (th / l)), h + dz * (tr / l));
  });
  // ožji del kapside ostane cel (vidi se mreža), širši del je odprt (polovica proti gledalcu odrezana)
  const HS = -0.12;
  const iS = prof.findIndex((p) => p[1] >= HS);
  prof[iS][1] = HS;
  const P0 = odmikP(-0.004), P1 = odmikP(0.03);
  const lat = (P, a, b2, full) => new THREE.LatheGeometry(P.slice(a, b2 + 1), q(full ? 56 : 36), full ? 0 : Math.PI / 2, full ? Math.PI * 2 : Math.PI);
  const kOut = new THREE.Mesh(zdruzi([lat(P0, 0, iS, true), lat(P0, iS, P0.length - 1, false)]), mat("#8a3f12", { roughness: 0.55 }));
  const kIn = new THREE.Mesh(zdruzi([lat(P1, 0, iS, true), lat(P1, iS, P1.length - 1, false)]), mat("#c9772a", { roughness: 0.6, side: THREE.BackSide }));
  const rezP = [];
  for (const sx of [1, -1]) rezP.push(trak(P0.slice(iS).map((p, i) => [V(sx * p.x, p.y, 0), V(sx * P1[iS + i].x, P1[iS + i].y, 0)]), V(0, 0, 1)));
  { const pari = []; for (let j = 0; j <= 24; j++) { const f = -Math.PI / 2 + (j / 24) * Math.PI; pari.push([V(P0[iS].x * Math.sin(f), HS, P0[iS].x * Math.cos(f)), V(P1[iS].x * Math.sin(f), HS, P1[iS].x * Math.cos(f))]); } rezP.push(trak(pari, V(0, 1, 0))); }
  const kRez = new THREE.Mesh(zdruzi(rezP), mat("#e3933c", { roughness: 0.5, side: THREE.DoubleSide }));
  // mreža: vrste vzdolž profila, v vsaki vrsti šesterčki na razdalji ≈ 9,6 nm
  const dl = [0];
  for (let i = 1; i < prof.length; i++) dl.push(dl[i - 1] + Math.hypot(prof[i][0] - prof[i - 1][0], prof[i][1] - prof[i - 1][1]));
  const naS = (s) => { let i = 1; while (i < dl.length - 1 && dl[i] < s) i++; const u = (s - dl[i - 1]) / (dl[i] - dl[i - 1]); const a = prof[i - 1], b = prof[i]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return { r: a[0] + (b[0] - a[0]) * u, h: a[1] + (b[1] - a[1]) * u, nr: (b[1] - a[1]) / l, nh: -(b[0] - a[0]) / l }; };
  const DH = 0.128, heks = [], pent = [];
  const vrst = Math.floor(dl[dl.length - 1] / (DH * 0.866));
  for (let rI = 0; rI <= vrst; rI++) {
    const s = 0.04 + rI * DH * 0.866, P = naS(Math.min(s, dl[dl.length - 1] - 0.03));
    const cel = P.h < HS - 0.03, obseg = cel ? Math.PI * 2 : Math.PI;
    const nT = Math.max(1, Math.round((Math.PI * 2 * P.r) / DH));
    for (let j = 0; j < nT; j++) {
      const f = ((j + (rI % 2 ? 0.75 : 0.25)) / nT) * Math.PI * 2;
      if (!cel && (f < Math.PI / 2 + 0.06 || f > Math.PI * 1.5 - 0.06)) continue;
      if (Math.abs(P.h - HS) < 0.04) continue;
      const n = V(P.nr * Math.sin(f), P.nh, P.nr * Math.cos(f)).normalize();
      const pos = V(P.r * Math.sin(f), P.h, P.r * Math.cos(f)).addScaledVector(n, 0.004);
      const tang = V(-(P.nh) * Math.sin(f), P.nr, -(P.nh) * Math.cos(f)).normalize();
      const m4 = new THREE.Matrix4().makeBasis(V().crossVectors(tang, n), tang, n).setPosition(pos);
      heks.push({ m4, h: P.h, s, p: pos });
    }
  }
  const izberiP = (kand, n, raz) => {
    for (const x of kand) if (pent.filter((y) => y.kon === kand).length < n && pent.every((y) => y.p.distanceTo(x.p) > raz)) { x.kon = kand; pent.push(x); }
  };
  izberiP(heks.filter((x) => x.h < -0.3).sort((a, b) => a.s - b.s), 5, 0.1);
  izberiP(heks.filter((x) => x.h > 0.4).sort((a, b) => b.s - a.s), 4, 0.17); // 7 na širšem koncu, 3 od teh na odrezani polovici
  for (const x of pent) heks.splice(heks.indexOf(x), 1);
  // šesterček/peterček: obroč domen NTD (zunaj) nad obročem domen CTD, ki povezujejo sosede
  const DK = hi ? [8, 6] : [5, 3];
  function obrocG(n, rN) {
    const g = [], b = [];
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      g.push(deformiraj(kepa(0.026, 0.02, 0.019, k, ...DK), (v) => { v.applyAxisAngle(V(0, 0, 1), a); v.x += Math.cos(a) * rN; v.y += Math.sin(a) * rN; v.z += 0.012; })); b.push("#ffb43c");
      if (hi || n === 5) { const a2 = a + Math.PI / n; g.push(kepa(0.017, 0.017, 0.014, k + 7, ...DK).translate(Math.cos(a2) * (rN + 0.022), Math.sin(a2) * (rN + 0.022), -0.006)); b.push("#e07f22"); }
    }
    return zdruzi(g, b);
  }
  const hexM = new THREE.InstancedMesh(obrocG(6, 0.034), mat(0xffffff, { vertexColors: true }), heks.length);
  heks.forEach((x, i) => hexM.setMatrixAt(i, x.m4));
  const penM = new THREE.InstancedMesh(obrocG(5, 0.029), mat("#ff8a8a", { vertexColors: true }), Math.max(1, pent.length));
  pent.forEach((x, i) => penM.setMatrixAt(i, x.m4));
  penM.count = pent.length;
  kapsG.add(kOut, kIn, kRez, hexM, penM);

  // ---------- vsebina kapside: dve RNK, obdani z beljakovino p7, encimi ----------
  const rKon = (h) => (h < -0.5 ? 0.1 * Math.sqrt(Math.max(0, 1 - ((h + 0.5) / 0.1) ** 2)) : h > 0.38 ? 0.3 * Math.sqrt(Math.max(0, 1 - ((h - 0.38) / 0.18) ** 2)) : 0.1 + ((h + 0.5) / 0.88) * 0.2);
  const krivulje = [];
  for (let k = 0; k < 2; k++) {
    const pts = [];
    for (let i = 0; i <= 110; i++) {
      const h = -0.44 + (i / 110) * 0.86, rr = Math.max(0.01, rKon(h) - 0.08) * (0.55 + 0.35 * Math.sin(i * 0.9 + k * 2));
      const a = k * Math.PI + h * 12 + Math.sin(i * 0.5 + k) * 0.8;
      pts.push(V(Math.cos(a) * rr, h, Math.sin(a) * rr * 0.9 - 0.03));
    }
    krivulje.push(new THREE.CatmullRomCurve3(pts));
  }
  const rnk = new THREE.Mesh(zdruzi(krivulje.map((c) => new THREE.TubeGeometry(c, hi ? 360 : 180, 0.0075, hi ? 5 : 3, false)), ["#ff5c8a", "#ff7aa0"]), mat(0xffffff, { vertexColors: true, roughness: 0.32 }));
  // p7 (nukleokapsidni protein): drobne kepice ob RNK
  const ncT = [];
  krivulje.forEach((c, k) => { const n = hi ? 150 : 70; for (let i = 0; i < n; i++) ncT.push(c.getPointAt((i + 0.5) / n).add(nakl(0.03))); });
  const nc = new THREE.InstancedMesh(kepa(0.013, 0.011, 0.012, 3, hi ? 6 : 4, hi ? 4 : 3), mat("#46c8ff"), ncT.length);
  ncT.forEach((p, i) => { o.position.copy(p); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.scale.setScalar(0.85 + rnd() * 0.3); o.updateMatrix(); nc.setMatrixAt(i, o.matrix); });
  // encimi na naključnih mestih v širšem delu kapside (ne čez RNK)
  const zasedeno = [];
  function mesta(n, rr) {
    const out = [];
    for (let t = 0; t < 4000 && out.length < n; t++) {
      const h = -0.3 + rnd() * 0.78, a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * Math.max(0, rKon(h) - 0.035 - rr);
      const p = V(Math.cos(a) * r, h, Math.sin(a) * r);
      if (zasedeno.some((x) => x.p.distanceTo(p) < x.r + rr + 0.01)) continue;
      zasedeno.push({ p, r: rr }); out.push(p);
    }
    return out;
  }
  // reverzna transkriptaza: heterodimer p66/p51 (p66 v obliki desne roke: dlan, prsti, palec)
  const rtGeo = zdruzi([kepa(0.036, 0.028, 0.03, 1, ...DK), kepa(0.02, 0.026, 0.018, 2, ...DK).translate(0.03, 0.028, 0), kepa(0.018, 0.024, 0.016, 3, ...DK).translate(-0.026, 0.03, 0.004),
    kepa(0.034, 0.024, 0.026, 4, ...DK).translate(0.006, -0.04, -0.004)], ["#3347ff", "#5566ff", "#5566ff", "#2433c8"]);
  const inGeo = zdruzi([[1, 1, 0], [-1, 1, 0], [1, -1, 0.4], [-1, -1, 0.4]].map(([x, y, z], k) => kepa(0.018, 0.017, 0.016, k + 20, ...DK).translate(x * 0.017, y * 0.017, z * 0.017)));
  const prGeo = zdruzi([kepa(0.017, 0.014, 0.015, 30, ...DK).translate(-0.014, 0, 0), kepa(0.017, 0.014, 0.015, 31, ...DK).translate(0.014, 0, 0)]);
  const rtP = mesta(hi ? 9 : 6, 0.05), inP = mesta(hi ? 10 : 6, 0.04), prP = mesta(hi ? 6 : 4, 0.03);
  const postavi = (geo, barva, P, s = 1) => {
    const m = new THREE.InstancedMesh(geo, mat(barva, barva === 0xffffff ? { vertexColors: true } : {}), P.length);
    P.forEach((p, i) => { o.position.copy(p); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.scale.setScalar(s); o.updateMatrix(); m.setMatrixAt(i, o.matrix); });
    kapsG.add(m);
    return m;
  };
  const rt = postavi(rtGeo, 0xffffff, rtP), integ = postavi(inGeo, "#b07be8", inP), prot = postavi(prGeo, "#c6f04a", prP);
  kapsG.add(rnk, nc);
  kapsG.updateMatrix();
  const vSk = (p) => p.clone().applyMatrix4(kapsG.matrix);

  // rahle razlike v svetlosti med ponovljenimi beljakovinami
  {
    const c = new THREE.Color();
    for (const m of [ma, nc, glik, hexM]) for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.86 + 0.24 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
  }

  // ---------- deli ----------
  const tB = bodD.slice(0, nB0).filter((d) => d.dot(KAM) > 0.3).sort((a, b) => b.y - a.y)[0] || bodD[0];
  const tB2 = bodD.slice(0, nB0).filter((d) => d.dot(KAM) > 0.3 && d !== tB).sort((a, b) => a.y - b.y)[0] || tB;
  const tMA = maD.slice(0, nMA0).filter((d) => d.x > 0.05 && d.z < -0.1 && d.y < 0.3).sort((a, b) => b.dot(KAM) - a.dot(KAM))[0] || maD[0];
  const najV = (P) => P.map(vSk).sort((a, b) => b.dot(KAM) - a.dot(KAM))[0];
  del("ovojnica", "Ovojnica", "Dvojna plast fosfolipidov (v prerezu glave in repi), ki jo virus vzame membrani celice, iz katere izbrsti; vanjo so vgrajene bodice.", "#9fb4ff", [ovOut, ovPok, ovIn, ovRez],
    MER[1](0.3).normalize().multiplyScalar(RE - D / 2).add(V(0, 0, 0.004)).toArray());
  del("gp120", "Beljakovina gp120", "Glavica bodice iz treh enakih delov; veže se na receptor CD4 na celicah T pomagalkah, tako virus najde celico, ki jo okuži.", "#2fcfa8", [gp120],
    tB.clone().multiplyScalar(oblE(tB) + 0.11).toArray());
  del("gp41", "Beljakovina gp41", "Pecelj bodice, zasidran v ovojnico; po vezavi zlije ovojnico virusa z membrano celice, da kapsida pride v celico.", "#1d8f84", [gp41],
    tB2.clone().multiplyScalar(oblE(tB2) + 0.03).toArray());
  del("glikani", "Sladkorni ščit (glikani)", "Verige sladkorjev, ki prekrivajo skoraj vso površino gp120; imunski sistem jih ima za lastne, zato protitelesa bodice težko prepoznajo.", "#bdeeff", [glik],
    tB.clone().multiplyScalar(oblE(tB) + 0.16).toArray());
  del("matriks", "Matriksni protein (p17)", "Nesklenjena mreža trimerov tik pod ovojnico, ki ovojnico podpira in v njej zadrži bodice.", "#6c7fc9", [ma],
    tMA.clone().multiplyScalar(oblE(tMA) - D - 0.016).toArray());
  del("kapsida", "Kapsida (p24)", "Stožčast ovoj iz okoli 250 šesterčkov in 12 peterčkov beljakovine p24 (5 na ožjem, 7 na širšem koncu); peterčki omogočijo, da se mreža zapre. V njej sta dedni zapis in encimi.", "#ffb43c", [kOut, kIn, kRez, hexM, penM],
    vSk(V(0.27, 0.2, -0.1)).toArray());
  del("rnk", "RNK (dve molekuli)", "Virus nosi dve enaki molekuli RNK, vsaka ima okoli 9 700 nukleotidov z navodili za izdelavo novih virusov.", "#ff5c8a", [rnk], vSk(krivulje[0].getPointAt(0.62)).toArray());
  del("nukleokapsidni-protein", "Nukleokapsidni protein (p7)", "Majhna beljakovina, ki se v velikem številu veže na RNK, jo zgosti in varuje v kapsidi.", "#46c8ff", [nc], najV(ncT).toArray());
  del("reverzna-transkriptaza", "Reverzna transkriptaza", "Encim, ki po virusni RNK izdela DNK; zato HIV uvrščamo med retroviruse. Oblika spominja na desno roko z dlanjo, prsti in palcem.", "#3347ff", [rt], najV(rtP).toArray());
  del("integraza", "Integraza", "Encim, ki virusno DNK vgradi v DNK okužene celice; tam lahko ostane skrita več let.", "#b07be8", [integ], najV(inP).toArray());
  del("proteaza", "Proteaza", "Encim, ki razreže dolge verige virusnih beljakovin na posamezne beljakovine, da virus dozori; zdravila proti HIV ga pogosto zavirajo.", "#c6f04a", [prot], najV(prP).toArray());

  // ---------- nadzor ----------
  const nadzor = [
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cel", "Cel virus"]], vrednost: zac.prikaz === "cel" ? "cel" : "prerez", ob: (v) => {
      const c = v === "cel";
      nadzor[0].vrednost = v;
      ovPok.visible = c; ovRez.visible = !c;
      gp41.count = gp120.count = c ? bodD.length : nB0;
      glik.count = gp41.count * glLay.length;
      ma.count = c ? maD.length : nMA0;
    } },
  ];
  nadzor[0].ob(nadzor[0].vrednost);

  kit.poliraj(group, deli, {
    ovojnica: { tex: "fino", rf: 60, k: 0.9, b: 0.24, lisa: 0.2, f: 4, rough: 0.72, cc: 0.08 },
    gp120: { tex: "gube", rf: 100, k: 0.8, b: 0.2 },
    gp41: { tex: "fino", rf: 120, k: 0.6 },
    glikani: { tex: null, rough: 0.28, cc: 0.9 },
    matriks: { tex: "zrna", rf: 130, k: 0.8 },
    kapsida: { tex: "zrna", rf: 110, k: 0.8, b: 0.22 },
    rnk: { tex: null, rough: 0.3, cc: 0.85 },
    "nukleokapsidni-protein": { tex: null },
    "reverzna-transkriptaza": { tex: "zrna", rf: 120, k: 0.8 },
    integraza: { tex: "zrna", rf: 120, k: 0.8 },
    proteaza: { tex: "zrna", rf: 120, k: 0.8 },
  });
  // stikalo »Barve kot v učbeniku«: klasične barve slik virusa HIV
  nadzor.push(kit.barveUcbenika(deli, {
    ovojnica: "#f2b6c6", gp120: "#4cae4f", gp41: "#2e7d32", glikani: "#f2ecd8", matriks: "#4f95e8", kapsida: "#f5c242",
    rnk: "#e53935", "nukleokapsidni-protein": "#ff9a6a", "reverzna-transkriptaza": "#7e57c2", integraza: "#26a69a", proteaza: "#ec407a",
  }));

  return {
    group,
    deli,
    nadzor,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81],
    korak(t) {
      if (!gib) return;
      group.rotation.y = Math.sin(t * 0.15) * 0.04;
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
