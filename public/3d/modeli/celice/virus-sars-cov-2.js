// Koronavirus SARS-CoV-2 v prerezu: steklena lipidna ovojnica (prerez pokaže dvosloj fosfolipidov) z beljakovinami S
// (glavica, pregibno steblo, vezavne domene, sladkorni ovoj), M in E; v notranjosti nukleokapsida: RNK, ovita z
// beljakovinami N v vijačno nitko, ki je zvita v kroglice.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "virus-sars-cov-2",
  naslov: "Koronavirus SARS-CoV-2",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Virus, ki povzroča covid-19 (premer ovojnice okoli 90 nm). Ima 30 konic S, toliko kot pravi virusi (od okoli 25 do 40); njihova stebla se pregibajo. Skozi prozorno ovojnico in odrezan del se vidi nukleokapsida: RNK, ovita z beljakovinami N.",
  poskusi: "Tapni konico S in preberi, kako se virus pripne na celico; nato poišči dvignjeno vezavno domeno.",
  merilo: { m: 140e-9, oznaka: "140 nm" },
};

export function zgradi(THREE, ctx = {}) {
  let seme = 67;
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
  // Smer proti privzeti kameri (za izbiro vidnih točk).
  const KAM = V(-0.47, 0.34, 0.81).normalize();
  // Ali je točka p vidna skozi izrez? ovira(x) = true, če točka x zakriva pogled.
  function vidna(p, ovira, korak = 0.02) {
    const x = p.clone();
    for (let i = 0; i < 120; i++) {
      x.addScaledVector(KAM, korak);
      if (x.x < 0 && x.y > 0 && x.z > 0) return true;
      if (ovira(x)) return false;
    }
    return true;
  }
  // Povpreči normale oglišč na istem mestu (šivi med deli mreže).
  function zgladi(g) {
    const p = g.attributes.position, n = g.attributes.normal, m = new Map();
    const kljuc = (i) => Math.round(p.getX(i) * 1e4) + "," + Math.round(p.getY(i) * 1e4) + "," + Math.round(p.getZ(i) * 1e4);
    for (let i = 0; i < p.count; i++) { const k = kljuc(i); const s = m.get(k); if (s) { s[0] += n.getX(i); s[1] += n.getY(i); s[2] += n.getZ(i); } else m.set(k, [n.getX(i), n.getY(i), n.getZ(i)]); }
    for (let i = 0; i < p.count; i++) { const s = m.get(kljuc(i)), l = Math.hypot(s[0], s[1], s[2]) || 1; n.setXYZ(i, s[0] / l, s[1] / l, s[2] / l); }
    return g;
  }
  // Lupina z odrezanim osmim delom (x < 0, y > 0, z > 0); f(smer) vrne polmer v tej smeri.
  function lupina(f, ws, hs) {
    const w4 = Math.max(2, Math.round(ws / 4)), h2 = Math.max(2, Math.round(hs / 2)); // enak razmik oglišč na šivih
    const zg = new THREE.SphereGeometry(1, w4 * 3, h2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, w4 * 4, h2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const pokr = new THREE.SphereGeometry(1, w4, h2, 0, Math.PI / 2, 0, Math.PI / 2);
    for (const g of [zg, sp, pokr]) deformiraj(g, (v) => { v.normalize(); v.multiplyScalar(f(v)); });
    return { odprta: zgladi(zdruzi([zg, sp])), pokrov: pokr };
  }
  const o = new THREE.Object3D(), gor = V(0, 1, 0);

  // 1 enota = 70 nm
  const RE = 0.62, D = 0.062; // ovojnica (premer ≈ 87 nm), lipidni dvosloj ≈ 4,3 nm
  const oblE = (d) => RE * (1 + 0.025 * fbm(d.x * 1.8 + 2, d.y * 1.8, d.z * 1.8) + 0.005 * sum(d.x * 9, d.y * 9, d.z * 9));
  const fN = (d) => oblE(d) - D;

  // ---------- ovojnica: steklena zunanja ploskev, temna notranja stran, prerez dvosloja ----------
  const ov = lupina(oblE, q(100), q(64));
  const ovMat = kit.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.15, rf: 40, k: 0.7, rob: "#9fb4ff", rk: 1.3 });
  const ovOut = new THREE.Mesh(ov.odprta, ovMat);
  const ovIn = new THREE.Mesh(lupina(fN, q(80), q(52)).odprta, mat(0x2b1f5c, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  const ovRez = new THREE.Mesh(kit.prerezDvosloj(oblE, fN, q(160)), kit.dvoslojMat(D, { glave: "#7f55e8", repi: "#9a88e0", beljakovina: "#9b78ff", delez: 0.22 }));
  const ovPok = new THREE.Mesh(ov.pokrov, ovMat);
  ovPok.visible = false;
  group.add(ovOut, ovIn, ovRez, ovPok);

  // razpored po površini (zlati kot); tiste v odrezanem delu postavi na konec (vidne le pri celem virusu)
  const vRezu = (d) => d.x < 0.08 && d.y > -0.08 && d.z > -0.08;
  function povrsina(n, odmik, zamik = 0) {
    const out = [], rez = [], N2 = Math.round(n * 1.15);
    for (let i = 0; i < N2; i++) {
      const y = 1 - (2 * (i + 0.5)) / N2, r = Math.sqrt(1 - y * y), a = i * 2.39996 + zamik;
      const d = V(Math.cos(a) * r, y, Math.sin(a) * r).add(nakl(odmik)).normalize();
      (vRezu(d) ? rez : out).push(d);
    }
    return out.concat(rez);
  }
  const zunaj = (arr) => arr.filter((d) => !vRezu(d)).length;
  // zrnata kepica beljakovine (elipsoid s šumom)
  const kepa = (sx, sy, sz, n, ws, hs) => deformiraj(new THREE.SphereGeometry(1, ws, hs), (v) => {
    v.set(v.x * sx, v.y * sy, v.z * sz);
    v.multiplyScalar(1 + 0.1 * sum(v.x * 80 + n * 3.1, v.y * 80, v.z * 80));
  });

  // ---------- beljakovina S: trimer v obliki pred zlitjem (glavica S1/S2, steblo z dvema pregiboma) ----------
  // Glavica (≈ 14 nm): v vsaki verigi osrednja vijačnica S2, velik zunanji reženj NTD v vogalu krone in poddomena SD.
  const DL = hi ? [12, 9] : [6, 4];
  function glavaG() {
    const g = [], b = [];
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2, an = a - 0.55, as = a + 0.4;
      g.push(kepa(0.03, 0.09, 0.03, k, ...DL).rotateZ(0.16).rotateY(-a).translate(Math.cos(a) * 0.02, 0.09, Math.sin(a) * 0.02)); b.push("#c22a48");
      g.push(kepa(0.04, 0.036, 0.036, k + 4, ...DL).rotateZ(-0.25).rotateY(-an).translate(Math.cos(an) * 0.056, 0.138, Math.sin(an) * 0.056)); b.push("#f04c5e");
      g.push(kepa(0.03, 0.034, 0.028, k + 8, ...DL).rotateY(-as).translate(Math.cos(as) * 0.04, 0.08, Math.sin(as) * 0.04)); b.push("#e03a52");
    }
    g.push(kepa(0.034, 0.03, 0.034, 13, ...DL).translate(0, 0.02, 0)); b.push("#b42642");
    return zdruzi(g, b);
  }
  // Odsek stebla (≈ 5 nm): tri prepletene vijačnice HR2.
  const LST = 0.07;
  function stebloG() {
    const g = [];
    for (let k = 0; k < 3; k++) {
      const pts = [];
      for (let i = 0; i <= 8; i++) { const u = i / 8, a = (k / 3) * Math.PI * 2 + u * Math.PI * 0.9; pts.push(V(Math.cos(a) * 0.0095, u * LST, Math.sin(a) * 0.0095)); }
      g.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), hi ? 10 : 5, 0.0064, hi ? 5 : 3, false));
    }
    return zdruzi(g);
  }
  // Sladkorna veriga (glikan): kratka razvejana kepica.
  function glikanG() {
    if (!hi) return new THREE.IcosahedronGeometry(1, 0).scale(0.009, 0.013, 0.009).translate(0, 0.008, 0);
    return zdruzi([
      new THREE.IcosahedronGeometry(0.0075, 0).translate(0, 0.006, 0),
      new THREE.IcosahedronGeometry(0.0068, 0).translate(0.005, 0.016, 0.002),
      new THREE.IcosahedronGeometry(0.006, 0).translate(-0.005, 0.017, -0.002),
    ]);
  }
  const smS = povrsina(26, 0.12), nS0 = zunaj(smS);
  // razpored glikanov na glavici (v koordinatah glavice) in na zgornjem odseku stebla (66 mest na trimer, prikazan del)
  const glavaGeo = glavaG();
  const glLay = kit.posej(new THREE.Mesh(glavaGeo), hi ? 16 : 7, (p, n) => p.y > 0.03 && p.y < 0.17 && n.y > -0.4 && Math.hypot(p.x, p.z) > 0.035)
    .map((t) => ({ g: true, p: t.p.addScaledVector(t.n, -0.002), n: t.n }));
  for (let j = 0; j < (hi ? 3 : 1); j++) { const a = j * 2.1 + 0.4; glLay.push({ g: false, p: V(Math.cos(a) * 0.014, 0.018 + j * 0.018, Math.sin(a) * 0.014), n: V(Math.cos(a), 0.2, Math.sin(a)).normalize() }); }
  const sPol = smS.map((d, i) => {
    const nagib = nakl(0.4); nagib.sub(d.clone().multiplyScalar(nagib.dot(d))); // nagib v kolku do ≈ 20°
    const pregib = rnd() < 0.4 ? rnd() * 0.2 : 0.35 + rnd() * 0.65; // pregib v kolenu: nekaj skoraj ravnih, večina nagnjenih
    return { p: d.clone().multiplyScalar(oblE(d) - 0.004), os: d.clone().add(nagib).normalize(), vrt: rnd() * 6.28, pregib, gleženj: (rnd() - 0.5) * 0.5, f: rnd() * 6, gorRBD: i % 2 === 0 ? Math.floor(rnd() * 3) : -1 };
  });
  const glMat = mat(0xffffff, { vertexColors: true });
  const glave = new THREE.InstancedMesh(glavaGeo, glMat, smS.length);
  const stebla = new THREE.InstancedMesh(stebloG(), mat("#a8264a"), smS.length * 2);
  const rbdM = new THREE.InstancedMesh(kepa(0.024, 0.02, 0.029, 21, ...(hi ? [10, 7] : [6, 4])), mat("#ffb43c"), smS.length * 3);
  const glik = new THREE.InstancedMesh(glikanG(), mat("#bdeeff", { roughness: 0.3 }), smS.length * glLay.length);
  const mK = new THREE.Matrix4(), mH = new THREE.Matrix4(), mL = new THREE.Matrix4(), qa = new THREE.Quaternion(), X = V(1, 0, 0);
  const lok = (p, n, s = 1) => mL.compose(p, qa.setFromUnitVectors(gor, n), V(s, s, s));
  function postaviS(t) {
    sPol.forEach((s, i) => {
      const nihaj = gib ? Math.sin(t * 0.8 + s.f) * 0.08 : 0;
      // kolk: steblo zasidrano v ovojnici
      o.position.copy(s.p); o.quaternion.setFromUnitVectors(gor, s.os); o.rotateY(s.vrt); o.scale.set(1, 1, 1); o.updateMatrix();
      const mKolk = o.matrix.clone();
      stebla.setMatrixAt(i * 2, mL.copy(mKolk).multiply(new THREE.Matrix4().compose(V(0, -0.04, 0), qa.identity(), V(1, (LST + 0.04) / LST, 1))));
      // koleno
      mK.copy(mKolk).multiply(new THREE.Matrix4().makeTranslation(0, LST, 0)).multiply(new THREE.Matrix4().makeRotationX(s.pregib + nihaj));
      stebla.setMatrixAt(i * 2 + 1, mK);
      // gleženj in glavica
      mH.copy(mK).multiply(new THREE.Matrix4().makeTranslation(0, LST, 0)).multiply(new THREE.Matrix4().makeRotationX(s.gleženj - nihaj * 0.5));
      glave.setMatrixAt(i, mH);
      for (let k = 0; k < 3; k++) { // vezavne domene: spuščene na vrhu krone, ena pri polovici konic dvignjena
        const a = (k / 3) * Math.PI * 2 + 0.55, up = s.gorRBD === k;
        const p = up ? V(Math.cos(a) * 0.06, 0.205, Math.sin(a) * 0.06) : V(Math.cos(a) * 0.032, 0.176, Math.sin(a) * 0.032);
        const n = up ? V(Math.cos(a) * 0.9, 1, Math.sin(a) * 0.9).normalize() : gor;
        rbdM.setMatrixAt(i * 3 + k, mH.clone().multiply(lok(p, n)));
      }
      glLay.forEach((l, j) => glik.setMatrixAt(i * glLay.length + j, (l.g ? mH : mK).clone().multiply(lok(l.p, l.n, 0.85 + 0.3 * hash(i, j, 3)))));
    });
    for (const m of [glave, stebla, rbdM, glik]) { m.instanceMatrix.needsUpdate = true; m.computeBoundingSphere(); }
  }
  postaviS(0);
  group.add(glave, stebla, rbdM, glik);

  // ---------- beljakovina M (dimeri) in E (peterni kanalčki) ----------
  // dimer M: majhna zunanja dela nad ovojnico in večja notranja dela pod njo (vidna na notranji strani ovojnice)
  const mGeo = zdruzi([kepa(0.016, 0.011, 0.012, 1, q(6), q(4)).translate(-0.012, 0.003, 0), kepa(0.016, 0.011, 0.012, 2, q(6), q(4)).translate(0.012, 0.003, 0),
    kepa(0.019, 0.013, 0.015, 3, q(6), q(4)).translate(-0.013, -D - 0.007, 0), kepa(0.019, 0.013, 0.015, 4, q(6), q(4)).translate(0.013, -D - 0.007, 0)]);
  const smM = povrsina(hi ? 280 : 130, 0.03, 1.3).filter((d) => smS.every((s) => s.angleTo(d) > 0.09));
  const mProt = new THREE.InstancedMesh(mGeo, mat(B.beljakovine), smM.length);
  smM.forEach((d, i) => { o.position.copy(d).multiplyScalar(oblE(d)); o.quaternion.setFromUnitVectors(gor, d); o.rotateY(rnd() * 6); o.scale.setScalar(1); o.updateMatrix(); mProt.setMatrixAt(i, o.matrix); });
  const nM0 = zunaj(smM);
  mProt.count = nM0;
  group.add(mProt);
  const eG = [];
  for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; eG.push(new THREE.SphereGeometry(1, q(8), q(6)).scale(0.011, 0.022, 0.011).translate(Math.cos(a) * 0.016, 0.004, Math.sin(a) * 0.016)); }
  const smE = povrsina(20, 0.1, 2.7).filter((d) => smS.every((s) => s.angleTo(d) > 0.12));
  const eProt = new THREE.InstancedMesh(zdruzi(eG), mat("#2fd6a6"), smE.length);
  smE.forEach((d, i) => { o.position.copy(d).multiplyScalar(oblE(d)); o.quaternion.setFromUnitVectors(gor, d); o.updateMatrix(); eProt.setMatrixAt(i, o.matrix); });
  const nE0 = zunaj(smE);
  eProt.count = nE0;
  group.add(eProt);

  // ---------- nukleokapsida: RNK, ovita z beljakovinami N v vijačno nitko, zvito v kroglice (≈ 14 nm) ----------
  seme = 4242; // razpored ni odvisen od števila beljakovin v ovojnici
  const RB = 0.058, RN = 0.026, RK = RB + RN, robR = RB * 0.6;
  const nA = hi ? 40 : 24, nB = hi ? 6 : 3; // kroglice zunaj in znotraj odrezanega dela (te le pri celem virusu)
  const kA = [], kB = [];
  for (let t = 0; t < 80000 && (kA.length < nA || kB.length < nB); t++) {
    const c = nakl(2 * RE);
    if (c.length() > fN(c.clone().normalize()) - RK - 0.012 || kA.concat(kB).some((x) => x.distanceTo(c) < 0.168)) continue;
    if (!(c.x < robR && c.y > -robR && c.z > -robR)) { if (kA.length < nA) kA.push(c); }
    else if (c.x < -0.03 && c.y > 0.03 && c.z > 0.03 && kB.length < nB) kB.push(c);
  }
  // pot: od kroglice do najbližje še neobiskane (najprej vse zunaj odrezanega dela)
  kA.sort((a, b) => b.x - a.x);
  const kr = kA.splice(0, 1);
  for (const sk of [kA, kB]) while (sk.length) {
    const z = kr[kr.length - 1];
    let bi = 0;
    sk.forEach((x, i) => { if (x.distanceToSquared(z) < sk[bi].distanceToSquared(z)) bi = i; });
    kr.push(sk.splice(bi, 1)[0]);
  }
  const nKA = kr.length - nB;
  const rp = [];
  let iRez = -1;
  kr.forEach((c, i) => {
    if (i === nKA) iRez = rp.length;
    const sl = kr[i + 1] || c.clone().add(V(0.05, 0.05, 0));
    const ax = sl.clone().sub(c).normalize(), u = V().crossVectors(ax, Math.abs(ax.y) < 0.9 ? gor : X).normalize(), w = V().crossVectors(ax, u);
    for (let s = 0; s < 16; s++) {
      const a = (s / 16) * Math.PI * 3.2, h = (s / 16 - 0.5) * 0.07;
      rp.push(c.clone().addScaledVector(u, Math.cos(a) * RB).addScaledVector(w, Math.sin(a) * RB).addScaledVector(ax, h));
    }
  });
  const pot = new THREE.CatmullRomCurve3(rp);
  pot.arcLengthDivisions = rp.length * 10;
  const KN = 0.05, nN = Math.round(pot.getLength() / KN);
  const okv = pot.computeFrenetFrames(nN * 4, false);
  const tocP = (k, n4, r, fi, out) => { const u = k / n4, f = okv; return out.copy(pot.getPointAt(u)).addScaledVector(f.normals[k], Math.cos(fi) * r).addScaledVector(f.binormals[k], Math.sin(fi) * r); };
  let jRez = nN;
  const nPol = [];
  const nBlob = deformiraj(new THREE.SphereGeometry(1, hi ? 9 : 5, hi ? 6 : 3), (v) => { v.set(v.x * RN, v.y * RN * 0.8, v.z * RN * 1.1); v.multiplyScalar(1 + 0.14 * sum(v.x * 90, v.y * 90 + 3, v.z * 90)); });
  const nProt = new THREE.InstancedMesh(nBlob, mat("#3f86ff"), nN + 1);
  for (let j = 0; j <= nN; j++) {
    const p = tocP(j * 4, nN * 4, 0.011, j * 2.1, V());
    if (jRez === nN && iRez >= 0 && p.distanceTo(rp[iRez]) < 0.06 && j > nN * 0.6) jRez = j;
    o.position.copy(p); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.scale.setScalar(0.88 + rnd() * 0.24); o.updateMatrix();
    nProt.setMatrixAt(j, o.matrix);
    nPol.push(p);
  }
  nProt.count = jRez;
  group.add(nProt);
  // RNK: vijačnica v žlebu med beljakovinami N
  const rnkT = [];
  for (let k = 0; k <= nN * 4; k++) rnkT.push(tocP(k, nN * 4, RN * 0.95, (k / 4) * 2.1 + 1.6, V()));
  const RAD = hi ? 5 : 3;
  const rnk = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rnkT), nN * 4, 0.0058, RAD, false), mat(B.rnk, { roughness: 0.32 }));
  rnk.geometry.setDrawRange(0, jRez * 4 * RAD * 6);
  group.add(rnk);

  // rahle razlike v svetlosti med ponovljenimi beljakovinami
  {
    const c = new THREE.Color();
    for (const m of [mProt, eProt, nProt, glik, rbdM]) for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.86 + 0.24 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
  }

  // ---------- deli ----------
  const KS = sPol.slice(0, nS0).map((s, i) => ({ s, i })).filter(({ s }) => s.os.dot(KAM) > 0.4).sort((a, b) => a.s.p.y - b.s.p.y)[0] || { s: sPol[0], i: 0 };
  const glTocka = (i, p) => { mH.identity(); glave.getMatrixAt(i, mH); return p.clone().applyMatrix4(mH); };
  const tRBD = (() => { const i = sPol.slice(0, nS0).findIndex((s, i) => s.gorRBD >= 0 && s.os.dot(KAM) > 0.5) ; const m = new THREE.Matrix4(); const k = Math.max(0, i) * 3 + Math.max(0, sPol[Math.max(0, i)].gorRBD); rbdM.getMatrixAt(k, m); return V().applyMatrix4(m); })();
  const tM = smM.slice(0, nM0).filter((d) => d.dot(KAM) > 0.75)[0] || smM[0];
  const tE = smE.slice(0, nE0).filter((d) => d.y < -0.1).sort((a, b) => b.dot(KAM) - a.dot(KAM))[0] || smE[0];
  const tN = nPol.slice(0, jRez).filter((c) => vidna(c, (x) => x.length() > fN(x.clone().normalize()))).sort((a, b) => b.dot(KAM) - a.dot(KAM));
  del("ovojnica", "Ovojnica (lipidna membrana)", "Dvojna plast fosfolipidov (v prerezu glave in repi), ki jo virus vzame celici, iz katere izide; vanjo so vgrajene virusne beljakovine.", "#9fb4ff", [ovOut, ovIn, ovRez, ovPok],
    V(-0.42, 0.42, 0).normalize().multiplyScalar(RE - D / 2).toArray());
  del("beljakovina-s", "Beljakovina S (konica)", "Konica iz treh enakih verig: glavica (S1) se pripne na receptor ACE2 na celicah dihal, steblo (S2) zlije ovojnico s celico. Steblo ima pregibe, zato so konice različno nagnjene.", "#e8384f", [glave, stebla],
    glTocka(KS.i, V(0, 0.12, 0)).toArray());
  del("rbd", "Vezavna domena (RBD)", "Vrh vsake verige S, ki se dotakne receptorja ACE2. Lahko je spuščena ali dvignjena; vezati se more le dvignjena. Pri mnogih konicah je dvignjena ena od treh.", "#ffb43c", [rbdM], tRBD.toArray());
  del("glikani", "Sladkorni ovoj (glikani)", "Verige sladkorjev na beljakovini S (okoli 66 na konico); prekrivajo jo kot ščit, zato jo protitelesa težje prepoznajo.", "#bdeeff", [glik],
    glTocka(KS.i, glLay[2].p.clone().addScaledVector(glLay[2].n, 0.012)).toArray());
  del("beljakovina-m", "Beljakovina M", "Najpogostejša beljakovina ovojnice; daje virusu obliko in povezuje ovojnico z nukleokapsido.", B.beljakovine, [mProt], tM.clone().multiplyScalar(oblE(tM) + 0.008).toArray());
  del("beljakovina-e", "Beljakovina E", "Majhna beljakovina, ki v ovojnici tvori drobne kanalčke; pomaga pri sestavljanju in sproščanju novih virusov.", "#2fd6a6", [eProt], tE.clone().multiplyScalar(oblE(tE) + 0.012).toArray());
  del("nukleokapsida", "Nukleokapsida (beljakovina N)", "Beljakovine N se vežejo na RNK in jo ovijejo v vijačno nitko, ta pa se zvije v kroglice; tako je dedni zapis zaščiten v notranjosti virusa.", "#3f86ff", [nProt], (tN[0] || nPol[0]).toArray());
  const r0 = tN[3] || nPol[1];
  del("rnk", "RNK (dedni zapis)", "Ena dolga molekula RNK z okoli 30 000 nukleotidi; v okuženi celici se po njej izdelajo nove virusne beljakovine.", B.rnk, [rnk],
    rnkT.reduce((a, x) => (x.distanceTo(r0) < a.distanceTo(r0) ? x : a), rnkT[0]).toArray());

  // ---------- nadzor ----------
  const nadzor = [
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cel", "Cel virus"]], vrednost: zac.prikaz === "cel" ? "cel" : "prerez", ob: (v) => {
      const c = v === "cel";
      nadzor[0].vrednost = v;
      ovPok.visible = c; ovRez.visible = !c;
      const nS = c ? smS.length : nS0;
      glave.count = nS; stebla.count = nS * 2; rbdM.count = nS * 3; glik.count = nS * glLay.length;
      mProt.count = c ? smM.length : nM0; eProt.count = c ? smE.length : nE0;
      nProt.count = c ? nN + 1 : jRez;
      rnk.geometry.setDrawRange(0, c ? Infinity : jRez * 4 * RAD * 6);
    } },
  ];
  nadzor[0].ob(zac.prikaz === "cel" ? "cel" : "prerez");

  kit.poliraj(group, deli, {
    ovojnica: { tex: "fino", rf: 60, k: 0.9, b: 0.24, lisa: 0.2, f: 4, rough: 0.72, cc: 0.08 },
    "beljakovina-s": { tex: "gube", rf: 110, k: 0.8, b: 0.2, s: 0.18 },
    rbd: { tex: "zrna", rf: 140, k: 0.8, b: 0.2 },
    glikani: { tex: null, rough: 0.28, cc: 0.9 },
    "beljakovina-m": { tex: "zrna", rf: 150, k: 0.7 },
    "beljakovina-e": { tex: "zrna", rf: 150, k: 0.7 },
    nukleokapsida: { tex: "zrna", rf: 130, k: 0.9, b: 0.22 },
    rnk: { tex: null, rough: 0.3, cc: 0.85 },
  });
  // stikalo »Barve kot v učbeniku«: klasične barve slik koronavirusa (siva ovojnica, rdeče konice …)
  nadzor.push(kit.barveUcbenika(deli, {
    ovojnica: "#bdb5c6", "beljakovina-s": "#d42a2e", rbd: "#ff9a86", glikani: "#f2ecd8",
    "beljakovina-m": "#f08a2a", "beljakovina-e": "#f6d84a", nukleokapsida: "#3c78d8", rnk: "#e8488c",
  }));

  return {
    group,
    deli,
    nadzor,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81],
    korak(t) {
      if (!gib) return;
      postaviS(t);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
