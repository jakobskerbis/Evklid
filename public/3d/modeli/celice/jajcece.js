// Jajčna celica v prerezu s prozorno ovojnico in korono radiato; ob njej semenčice za primerjavo velikosti.
// Izbira »Stopnja«: ob ovulaciji (delitveno vreteno, polarno telesce) ali pred ovulacijo (jedro – zarodni mešiček).
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-jajcece",
  naslov: "Jajčna celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Največja celica človeškega telesa (okoli 120 µm), obdana s prozorno ovojnico in venčkom foliklovih celic (korona radiata). Ob njej so semenčice v pravi velikosti. Zrnc in celic korone je manj kot v resnici.",
  poskusi: "Primerjaj jajčno celico s semenčicami ob njej: kolikokrat je večja?",
  merilo: { m: 200e-6, oznaka: "200 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const odpad = [];
  let deli = [];
  const V = videzCelic(THREE, { hi, odpad });
  const { sum, fbm } = V;

  // ---------- orodja ----------
  let seme = 7;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3,
      sheen: 0.5, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
    }, o));
    odpad.push(m);
    return m;
  }
  const zdruzi = V.zdruzi;
  function del(id, ime, opis, barva, meshes, tocka, seznam) {
    meshes.forEach((m) => { m.userData.del = id; });
    seznam.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const nakljucna = (s = 1) => V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(s * 2);
  // Odrezan osmi del: x < 0, y > 0, z > 0 (proti gledalcu levo zgoraj).
  const vIzrezu = (v, c = { x: 0, y: 0, z: 0 }) => v.x < c.x && v.y > c.y && v.z > c.z;
  // Lupina z odrezanim osmim delom; f(smer) vrne polmer v tej smeri.
  function lupina(f, ws, hs) {
    ws = Math.round(ws / 4) * 4;
    const zg = new THREE.SphereGeometry(1, (ws * 3) / 4, hs / 2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const pokr = new THREE.SphereGeometry(1, ws / 4, hs / 2, 0, Math.PI / 2, 0, Math.PI / 2);
    const v = V3(0, 0, 0);
    for (const g of [zg, sp, pokr]) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); v.multiplyScalar(f(v)); p.setXYZ(i, v.x, v.y, v.z); }
      g.computeVertexNormals();
    }
    return { odprta: zdruzi([zg, sp]), pokrov: pokr };
  }
  const loki = [
    (t) => V3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)),
    (t) => V3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0),
    (t) => V3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)),
  ];
  // Ploskev prereza plasti med zunanjo fZ in notranjo fN ploskvijo na treh ravninah izreza (x = 0, y = 0, z = 0);
  // pasovi [[t0, t1, barva], …] od zunaj (t = 0) navznoter (t = 1); brez pasov = enobarvna ploskev z nD vrsticami.
  function prerezPlasti(fZ, fN, seg, pasovi, nD = 1) {
    pasovi = pasovi || Array.from({ length: nD }, (_, i) => [i / nD, (i + 1) / nD, 0xffffff]);
    const pos = [], col = [], idx = [], c = new THREE.Color();
    for (const L of loki) for (const [t0, t1, barva] of pasovi) {
      c.set(barva);
      const off = pos.length / 3;
      for (let i = 0; i <= seg; i++) {
        const d = L(i / seg).normalize(), rz = fZ(d), rn = fN(d);
        for (const t of [t0, t1]) { const rr = rz + (rn - rz) * t; pos.push(d.x * rr, d.y * rr, d.z * rr); col.push(c.r, c.g, c.b); }
      }
      for (let i = 0; i < seg; i++) { const a = off + i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Odstrani trikotnike, katerih težišče (+ premik) izpolni pogoj.
  function odrezi(g, pogoj, premik = V3(0, 0, 0)) {
    const p = g.attributes.position, ix = g.index.array, ost = [], a = V3(0, 0, 0), b = V3(0, 0, 0), c = V3(0, 0, 0);
    for (let i = 0; i < ix.length; i += 3) {
      a.fromBufferAttribute(p, ix[i]); b.fromBufferAttribute(p, ix[i + 1]); c.fromBufferAttribute(p, ix[i + 2]);
      a.add(b).add(c).multiplyScalar(1 / 3).add(premik);
      if (!pogoj(a)) ost.push(ix[i], ix[i + 1], ix[i + 2]);
    }
    g.setIndex(ost);
    return g;
  }
  // Cev s spremenljivim polmerom rF(t) vzdolž krivulje; zaobljena konca.
  function cev(krivulja, nSeg, rF, nRad) {
    const fr = krivulja.computeFrenetFrames(nSeg, false);
    const pos = [], idx = [], P = V3(0, 0, 0);
    for (let i = 0; i <= nSeg; i++) {
      krivulja.getPointAt(i / nSeg, P);
      const r = rF(i / nSeg), N = fr.normals[i], Bn = fr.binormals[i];
      for (let j = 0; j < nRad; j++) {
        const a = (j / nRad) * Math.PI * 2, c = Math.cos(a) * r, s = Math.sin(a) * r;
        pos.push(P.x + c * N.x + s * Bn.x, P.y + c * N.y + s * Bn.y, P.z + c * N.z + s * Bn.z);
      }
    }
    for (let i = 0; i < nSeg; i++) for (let j = 0; j < nRad; j++) {
      const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad), c = a + nRad, d = b + nRad;
      idx.push(a, b, c, b, d, c);
    }
    for (const [i, sg] of [[0, -1], [nSeg, 1]]) {
      krivulja.getPointAt(i / nSeg, P);
      const T = fr.tangents[i], r = rF(i / nSeg), c = pos.length / 3;
      pos.push(P.x + T.x * r * 0.6 * sg, P.y + T.y * r * 0.6 * sg, P.z + T.z * r * 0.6 * sg);
      for (let j = 0; j < nRad; j++) { const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad); if (sg < 0) idx.push(c, b, a); else idx.push(c, a, b); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Material ploskve prereza: vzorec v senčilniku (koda GLSL nastavi bv = barva sRGB in zh = višina reliefa) iz P =
  // položaj v koordinatah mreže. Komplet ga ne prebarva (userData.rez).
  function rezMat(koda, kljuc, o = {}) {
    const m = mat(0xffffff, Object.assign({ roughness: 0.5, clearcoat: 0.45, clearcoatRoughness: 0.2, sheen: 0.3, sheenColor: new THREE.Color(0xe6ecff), side: THREE.DoubleSide }, o));
    m.userData.rez = true;
    const dodaj = (m) => {
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vRp;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRp = position;");
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vRp;" + V.GLSL)
          .replace("#include <color_fragment>", `#include <color_fragment>
            vec3 P = vRp; vec3 bv = vec3(1.0); float zh = 0.0;
            ${koda}
            diffuseColor.rgb = pow(clamp(bv, 0.0, 1.0), vec3(2.2));`)
          .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal = zvRelief(normal, zh, faceDirection);");
      };
      m.customProgramCacheKey = () => "jajcece-rez-" + kljuc;
      m.clone = function () { const c = new this.constructor().copy(this); dodaj(c); return c; };
    };
    dodaj(m);
    return m;
  }
  const o = new THREE.Object3D(), smer = V3(0, 0, 0), GOR = V3(0, 1, 0);
  // Ikozaeder nima skupnih oglišč (bil bi ploskovno senčen): normale kažejo od središča, da je kroglica gladka.
  function gladka(g) {
    const p = g.attributes.position, n = g.attributes.normal, v = V3(0, 0, 0);
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); n.setXYZ(i, v.x, v.y, v.z); }
    return g;
  }
  const nad = (dd) => (t) => ({ p: t.p.addScaledVector(t.n, dd), n: t.n });

  const RE = 0.58, ZI = 0.62, ZO = 0.74, KR = 0.745, DM = 0.965; // oolema, zona (notranji, zunanji rob), začetek korone, debelina membrane
  const dPT = V3(-0.62, 0.78, 0.02).normalize(); // smer polarnega telesca
  const tPT = V3(1, 0, 0).cross(dPT).normalize(); // tangenta (smer vretena)
  const bT = dPT.clone().cross(tPT).normalize();
  const DVOSLOJ = [[0, 0.12, 0xdce0ff], [0.12, 0.34, 0x4a33a8], [0.34, 0.66, 0xece6ff], [0.66, 0.88, 0x4a33a8], [0.88, 1, 0x7b5ce0]];
  const C_ZONA = "#b9c8ff", C_KOR = "#ec8f86", C_KORT = B.mesicki, C_RUM = "#f4df8c", C_KROM = B.dnk, C_PVP = "#7fdcec", C_MV = "#b59cff", C_SEM = "#7fe0cf";

  // ---------- jajčna celica: steklena membrana (oolema) z mikrovili, citoplazma; za vsako stopnjo svoja oblika ----------
  const memMat = V.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.14, rf: 26, k: 0.9, rob: B.membranaRob, rk: 1.3 });
  const robMat = mat(0xffffff, { vertexColors: true, roughness: 0.45, clearcoat: 0.5, side: THREE.DoubleSide });
  robMat.userData.rez = true;
  const citMat = mat(0x3d3180, { roughness: 0.62, clearcoat: 0.25, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide });
  const mvGeo = new THREE.CylinderGeometry(0.0021, 0.003, 0.017, q(6), 1, true).translate(0, 0.0075, 0);
  const mvMat = mat(C_MV, { roughness: 0.32 });
  function mikrovili(tocke) {
    const im = new THREE.InstancedMesh(mvGeo, mvMat, tocke.length);
    tocke.forEach((t, i) => {
      o.position.copy(t.p);
      o.quaternion.setFromUnitVectors(GOR, t.n.clone().add(nakljucna(0.25)).normalize());
      o.scale.set(1, 0.7 + 0.6 * rnd(), 1);
      o.updateMatrix(); im.setMatrixAt(i, o.matrix);
    });
    return im;
  }
  function jajce(ov) {
    const obl = (d) => RE * (1 + 0.012 * fbm(d.x * 3 + 2, d.y * 3, d.z * 3) - (ov ? 0.1 * Math.pow(Math.max(0, d.dot(dPT)), 60) : 0));
    const l = lupina(obl, q(100), q(64));
    const out = new THREE.Mesh(l.odprta, memMat), pok = new THREE.Mesh(l.pokrov, memMat);
    const rob = new THREE.Mesh(prerezPlasti(obl, (d) => obl(d) * DM, q(90), DVOSLOJ), robMat);
    const lc = lupina((d) => obl(d) * DM, q(84), q(52));
    lc.pokrov.dispose();
    const cit = new THREE.Mesh(lc.odprta, citMat);
    const mv = mikrovili(V.posej(out, hi ? 2600 : 520)), mvP = mikrovili(V.posej(pok, hi ? 650 : 130));
    pok.visible = false; mvP.visible = false;
    group.add(out, pok, rob, cit, mv, mvP);
    return { obl, out, pok, rob, cit, mv, mvP };
  }
  const JO = jajce(true), JJ = jajce(false);
  const oblE = JJ.obl;

  // ---------- organeli v citoplazmi (v odprtem delu in ob njem) ----------
  const JC = V3(-0.04, 0.04, 0.03), RJ = 0.125;
  const vidno = (v) => v.x < 0.12 && v.y > -0.12 && v.z > -0.12;
  const POG = V3(-0.47, 0.34, 0.81).normalize();
  const predJedrom = (v) => { const w = v.clone().sub(JC), t = w.dot(POG); return t > 0 && w.addScaledVector(POG, -t).length() < RJ * 0.8; };
  const prosto = (v, r) => !predJedrom(v) && v.distanceTo(JC) > RJ + 0.03 && v.distanceTo(dPT.clone().multiplyScalar(0.5)) > 0.1 && v.length() < RE * DM - r;
  function tocke(n, r, pogoj = () => true) {
    const out = [];
    for (let p = 0; out.length < n && p < n * 60; p++) {
      const v = nakljucna(RE);
      if (!vidno(v) || !prosto(v, r) || !pogoj(v)) continue;
      out.push(v);
    }
    return out;
  }
  // rumenjakova zrnca
  const rumK = tocke(hi ? 170 : 90, 0.02);
  const rum = new THREE.InstancedMesh(gladka(new THREE.IcosahedronGeometry(0.0095, hi ? 1 : 0)), mat(C_RUM, { roughness: 0.4 }), rumK.length);
  rumK.forEach((v, i) => { o.position.copy(v); o.quaternion.identity(); o.scale.setScalar(0.6 + rnd() * 0.9); o.updateMatrix(); rum.setMatrixAt(i, o.matrix); });
  // mitohondriji (okrogli, z redkimi kristami), pogosto ob skupkih gladkega ER
  const serC = tocke(hi ? 34 : 18, 0.03);
  const mitK = [];
  serC.forEach((c) => { for (let i = 0; i < 2; i++) mitK.push(c.clone().add(nakljucna(0.028))); });
  mitK.push(...tocke(hi ? 50 : 26, 0.02, (v) => rumK.every((r) => r.distanceTo(v) > 0.02)));
  const mitG = new THREE.SphereGeometry(0.0105, q(12), q(9));
  { const p = mitG.attributes.position, v = V3(0, 0, 0); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.08 * sum(v.x * 300, v.y * 300, v.z * 300)); p.setXYZ(i, v.x, v.y, v.z); } mitG.computeVertexNormals(); }
  const mit = new THREE.InstancedMesh(mitG, mat(B.mitohondrij, { roughness: 0.34 }), mitK.length);
  mitK.forEach((v, i) => { o.position.copy(v); o.scale.set(1, 0.78, 1).multiplyScalar(0.8 + 0.4 * rnd()); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.updateMatrix(); mit.setMatrixAt(i, o.matrix); });
  // skupki gladkega ER: grozdi mehurčkov in cevk
  const serK = [];
  serC.forEach((c) => { const n = 7 + Math.floor(rnd() * 6); for (let i = 0; i < n; i++) serK.push(c.clone().add(nakljucna(0.022))); });
  const ser = new THREE.InstancedMesh(gladka(new THREE.IcosahedronGeometry(0.0062, hi ? 1 : 0)), mat(B.ger, { roughness: 0.3 }), serK.length);
  serK.forEach((v, i) => { o.position.copy(v); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.scale.set(1, 0.7 + 0.8 * rnd(), 1); o.updateMatrix(); ser.setMatrixAt(i, o.matrix); });
  group.add(rum, mit, ser);
  // drobna zrnca v citoplazmi (temna, majhna)
  const zrnT = [];
  for (let p = 0; zrnT.length < (hi ? 4500 : 1600) && p < 200000; p++) {
    const v = nakljucna(RE);
    if (v.length() > RE * DM - 0.012 || vIzrezu(V3(v.x + 0.01, v.y - 0.01, v.z - 0.01)) || v.distanceTo(JC) < RJ + 0.01) continue;
    zrnT.push(v);
  }
  const zrn = V.pike(zrnT, 0x7a66d8, 0.0062, 0.5);
  group.add(zrn);

  // kortikalna zrnca: plast tik pod membrano
  const korK = [];
  for (let p = 0; korK.length < (hi ? 1100 : 380) && p < 40000; p++) {
    smer.copy(nakljucna()).normalize();
    if (vIzrezu(V3(smer.x + 0.03, smer.y - 0.03, smer.z - 0.03)) || smer.dot(dPT) > 0.93) continue;
    korK.push(smer.clone().multiplyScalar(oblE(smer) * (DM - 0.012 - rnd() * 0.012)));
  }
  const kor = new THREE.InstancedMesh(gladka(new THREE.IcosahedronGeometry(0.0068, 0)), mat(C_KORT, { roughness: 0.2, clearcoat: 1 }), korK.length);
  korK.forEach((v, i) => { o.position.copy(v); o.quaternion.identity(); o.scale.setScalar(0.75 + 0.5 * rnd()); o.updateMatrix(); kor.setMatrixAt(i, o.matrix); });
  group.add(kor);

  // ---------- ob ovulaciji: delitveno vreteno (2. mejotska delitev) in prvo polarno telesce ----------
  const VC = dPT.clone().multiplyScalar(RE * 0.82);
  const vretK = [];
  for (let i = 0; i < (hi ? 44 : 22); i++) {
    const a = rnd() * Math.PI * 2, w = 0.024 + rnd() * 0.014, pts = [];
    for (let k = 0; k <= 10; k++) {
      const t = -1 + (2 * k) / 10, r = w * Math.cos((t * Math.PI) / 2.3);
      pts.push(VC.clone().addScaledVector(tPT, t * 0.062).addScaledVector(dPT, Math.cos(a) * r).addScaledVector(bT, Math.sin(a) * r));
    }
    vretK.push(new THREE.CatmullRomCurve3(pts));
  }
  const vreteno = V.vlakna(vretK, 0.0014, B.citoskelet, { sij: 0.55, seg: hi ? 20 : 10, rad: 3 });
  // 23 kromosomov v metafazni ravnini; vsak iz dveh sestrskih kromatid, obrnjenih proti poloma vretena
  const kromG = [];
  for (let i = 0; i < 23; i++) {
    const a = rnd() * Math.PI * 2, r = 0.029 * Math.sqrt(rnd()), dol = 0.009 + rnd() * 0.009, kz = rnd() * Math.PI;
    const c = VC.clone().addScaledVector(dPT, Math.cos(a) * r).addScaledVector(bT, Math.sin(a) * r);
    const os = dPT.clone().multiplyScalar(Math.cos(kz)).addScaledVector(bT, Math.sin(kz));
    for (const s of [-1, 1]) {
      const g = new THREE.CapsuleGeometry(0.0026, dol, 2, q(7));
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(GOR, os));
      const p = c.clone().addScaledVector(tPT, s * 0.0029);
      kromG.push(g.translate(p.x, p.y, p.z));
    }
  }
  const kromV = new THREE.Mesh(zdruzi(kromG), mat(C_KROM, { roughness: 0.35, emissive: new THREE.Color(C_KROM).multiplyScalar(0.12) }));
  group.add(vreteno, kromV);
  // polarno telesce v perivitelinskem prostoru: steklena membrana, citoplazma in kromosomi; prerezano na ravnini z = 0
  const PC = dPT.clone().multiplyScalar(RE * 0.985), RP = 0.056;
  const ptG = new THREE.SphereGeometry(RP, q(40), q(28));
  { const p = ptG.attributes.position, v = V3(0, 0, 0); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.04 * sum(v.x * 40, v.y * 40, v.z * 40)); p.setXYZ(i, v.x, v.y, v.z); } ptG.computeVertexNormals(); }
  const ptMat = V.steklo(mat("#f2a6c8", { side: THREE.FrontSide }), { a: 0.16, rf: 260, k: 0.8, rob: "#ffc4e0", rk: 1.2 });
  const polT = new THREE.Mesh(odrezi(ptG.clone(), (c) => vIzrezu(c), PC), ptMat);
  const polTIn = new THREE.Mesh(odrezi(ptG.clone().scale(0.93, 0.93, 0.93), (c) => vIzrezu(c), PC), mat(0x5a3f9e, { roughness: 0.6, clearcoat: 0.2, side: THREE.BackSide }));
  const polTPok = new THREE.Mesh(odrezi(ptG, (c) => !vIzrezu(c), PC), ptMat);
  polTPok.visible = false;
  for (const m of [polT, polTIn, polTPok]) m.position.copy(PC);
  // rob prereza polarnega telesca (kolobar v ravnini z = 0, dvosloj)
  const rz = Math.sqrt(Math.max(0, RP * RP - PC.z * PC.z));
  const ptRobG = new THREE.RingGeometry(rz * 0.9, rz, q(40), 4);
  {
    const p = ptRobG.attributes.position, col = [], c = new THREE.Color();
    for (let i = 0; i < p.count; i++) { const t = (rz - Math.hypot(p.getX(i), p.getY(i))) / (rz * 0.1); c.set(t < 0.25 || t > 0.75 ? 0x7b3a9e : 0xf6dcf0); col.push(c.r, c.g, c.b); }
    ptRobG.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    ptRobG.translate(PC.x, PC.y, 0.0008);
  }
  const ptRob = new THREE.Mesh(ptRobG, robMat);
  const ptKr = [];
  for (let i = 0; i < 9; i++) {
    const g = new THREE.CapsuleGeometry(0.0034, 0.008 + rnd() * 0.008, 2, q(7));
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(GOR, nakljucna().normalize()));
    ptKr.push(g.translate(PC.x + (rnd() - 0.5) * 0.05, PC.y + (rnd() - 0.5) * 0.05, -0.006 - rnd() * 0.02));
  }
  const polKr = new THREE.Mesh(zdruzi(ptKr), mat(C_KROM, { roughness: 0.35, emissive: new THREE.Color(C_KROM).multiplyScalar(0.12) }));
  group.add(polT, polTIn, polTPok, ptRob, polKr);

  // ---------- pred ovulacijo: jedro (zarodni mešiček) z jedrcem, kromatinom in jedrnimi porami ----------
  const oblJ = (d) => RJ * (1 + 0.03 * sum(d.x * 2 + 7, d.y * 2, d.z * 2));
  const jl = lupina(oblJ, q(64), q(40));
  const jMat = mat(B.jedro, { roughness: 0.3 });
  const jOut = new THREE.Mesh(jl.odprta, jMat), jPok = new THREE.Mesh(jl.pokrov, jMat);
  const jRob = new THREE.Mesh(prerezPlasti(oblJ, (d) => oblJ(d) * 0.9, q(48), [[0, 0.06, 0x34107a], [0.06, 0.2, 0x6a2fd0], [0.2, 0.3, 0xc39af5], [0.3, 0.7, 0xe8d6ff], [0.7, 0.8, 0xc39af5], [0.8, 0.94, 0x6a2fd0], [0.94, 1, 0x34107a]]), robMat);
  const jIn = new THREE.Mesh(lupina((d) => oblJ(d) * 0.9, q(48), q(32)).odprta, mat(0xa565f0, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  jPok.visible = false;
  const nPor = hi ? 70 : 40;
  const pore = new THREE.InstancedMesh(new THREE.TorusGeometry(0.0085, 0.0034, 4, q(8)), mat(B.ovojnica, { roughness: 0.4 }), nPor);
  for (let k = 0; k < nPor;) {
    smer.copy(nakljucna()).normalize();
    if (vIzrezu(smer)) continue;
    o.position.copy(smer).multiplyScalar(oblJ(smer) * 1.004); o.lookAt(o.position.clone().add(smer)); o.scale.setScalar(1); o.updateMatrix(); pore.setMatrixAt(k++, o.matrix);
  }
  const kromJ = [];
  for (let i = 0; i < (hi ? 14 : 8); i++) {
    const pts = [];
    let p = nakljucna(RJ * 0.45);
    for (let s = 0; s < 8; s++) { p = p.clone().add(nakljucna(0.04)); if (p.length() > RJ * 0.78) p.multiplyScalar(0.7); pts.push(p); }
    kromJ.push(new THREE.CatmullRomCurve3(pts));
  }
  const kromatin = V.vlakna(kromJ, 0.0034, B.kromatin, { sij: 0.15, seg: hi ? 30 : 14, rad: hi ? 5 : 3 });
  const jcG = new THREE.SphereGeometry(0.04, q(36), q(26));
  { const p = jcG.attributes.position, v = V3(0, 0, 0); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.1 * fbm(v.x * 50, v.y * 50, v.z * 50)); p.setXYZ(i, v.x, v.y, v.z); } jcG.computeVertexNormals(); }
  const jedrce = new THREE.Mesh(jcG, mat(B.jedrce, { roughness: 0.5, clearcoat: 0.4 }));
  jedrce.position.set(-0.03, 0.03, 0.02);
  const jedroG = new THREE.Group();
  jedroG.position.copy(JC);
  jedroG.add(jOut, jPok, jRob, jIn, pore, kromatin, jedrce);
  group.add(jedroG);

  // ---------- perivitelinski prostor: tekočina med oolemo in ovojnico (v prerezu prosojen pas) ----------
  const pvpMat = mat(C_PVP, { transparent: true, opacity: 0.3, depthWrite: false, roughness: 0.2, clearcoat: 1, side: THREE.DoubleSide });
  pvpMat.userData.cv = { brez: true };
  const pvpO = new THREE.Mesh(odrezi(prerezPlasti(() => ZI, (d) => JO.obl(d) * 1.002, q(64), null, 2), (c) => c.distanceTo(PC) < RP * 1.02), pvpMat);
  const pvpJ = new THREE.Mesh(prerezPlasti(() => ZI, (d) => JJ.obl(d) * 1.002, q(64), null, 2), pvpMat);
  for (const m of [pvpO, pvpJ]) { m.geometry.deleteAttribute("color"); m.renderOrder = 3; group.add(m); }

  // ---------- prozorna ovojnica (zona pellucida): debela steklena lupina, v prerezu vlaknata mreža ----------
  const zlo = lupina(() => ZO, q(88), q(60)), zli = lupina(() => ZI, q(72), q(48));
  const zMat = V.steklo(mat(C_ZONA, { side: THREE.FrontSide }), { a: 0.2, rf: 22, k: 0.7, rob: "#d4e2ff", rk: 1.2, difuzno: 0.25 });
  const zOut = new THREE.Mesh(zlo.odprta, zMat), zPok = new THREE.Mesh(zlo.pokrov, zMat);
  zli.pokrov.dispose();
  const zIn = new THREE.Mesh(zli.odprta, V.steklo(mat(C_ZONA, { side: THREE.BackSide }), { a: 0.14, rf: 22, k: 0.6, rob: "#d4e2ff", rk: 0.9, difuzno: 0.25 }));
  zPok.visible = false;
  const zPl = new THREE.Mesh(prerezPlasti(() => ZO, () => ZI, q(72), null, 6), rezMat(`
    float rr = length(P), t = clamp((rr - ${ZI.toFixed(3)}) / ${(ZO - ZI).toFixed(3)}, 0.0, 1.0);
    vec3 q = P * 150.0;
    float f1 = 1.0 - abs(2.0 * zvS(q) - 1.0), f2 = 1.0 - abs(2.0 * zvS(q * 2.2 + 5.0) - 1.0);
    float fil = smoothstep(0.84, 0.97, max(f1, f2 * 0.96));
    vec3 osn = mix(vec3(0.52, 0.6, 0.93), vec3(0.74, 0.8, 1.0), smoothstep(0.15, 0.85, t));
    bv = mix(osn, vec3(0.95, 0.97, 1.0), fil * 0.75) * (0.9 + 0.12 * zvS(P * 34.0));
    bv = mix(bv, vec3(0.4, 0.46, 0.88), 1.0 - smoothstep(0.0, 0.05, min(t, 1.0 - t)));
    zh = fil * 0.0016 + zvS(P * 34.0) * 0.002;`, "zona"));
  zOut.renderOrder = 2; zIn.renderOrder = 1;
  group.add(zOut, zPok, zIn, zPl);

  // ---------- korona radiata: stebričaste foliklove celice okoli ovojnice ----------
  const korona = [];
  const nK = hi ? 1190 : 540, nZun = hi ? 200 : 60;
  for (let p = 0; korona.length < nK + nZun && p < 60000; p++) {
    smer.copy(nakljucna()).normalize();
    const zun = korona.length >= nK;
    if (vIzrezu(V3(smer.x + 0.02, smer.y - 0.02, smer.z - 0.02))) continue;
    const r = zun ? 0.86 + rnd() * 0.05 : KR + 0.06 + rnd() * 0.012;
    const pos = smer.clone().multiplyScalar(r);
    const min = zun ? 0.075 : hi ? 0.05 : 0.06;
    if (korona.some((k) => k.p.distanceToSquared(pos) < min * min)) continue;
    korona.push({ p: pos, d: smer.clone(), zun });
  }
  const kGeo = new THREE.IcosahedronGeometry(1, hi ? 1 : 0);
  { const p = kGeo.attributes.position, v = V3(0, 0, 0); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.08 * sum(v.x * 2.2 + 3, v.y * 2.2, v.z * 2.2)); p.setXYZ(i, v.x, v.y, v.z); } gladka(kGeo); }
  const kMat = mat(C_KOR, { roughness: 0.42 });
  const kor2 = new THREE.InstancedMesh(kGeo, kMat, korona.length);
  korona.forEach((k, i) => {
    o.position.copy(k.p); o.quaternion.setFromUnitVectors(GOR, k.d); o.rotateY(rnd() * 3);
    if (k.zun) o.scale.set(0.034, 0.03, 0.03); else o.scale.set(0.027 + rnd() * 0.006, 0.062, 0.025 + rnd() * 0.006);
    o.updateMatrix(); kor2.setMatrixAt(i, o.matrix);
  });
  // izrastki foliklovih celic skozi ovojnico do oocite (na ploskvah prereza)
  const izG = [];
  for (let i = 0; i < (hi ? 42 : 21); i++) {
    const a = ((i % 14) / 14 + 0.03) * (Math.PI / 2), r0 = KR + 0.01, r1 = RE + 0.006, pl = i % 3;
    const pt = (r) => (pl === 0 ? V3(0.003, Math.cos(a) * r, Math.sin(a) * r) : pl === 1 ? V3(-Math.cos(a) * r, 0.003, Math.sin(a) * r) : V3(-Math.cos(a) * r, Math.sin(a) * r, 0.003));
    izG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([pt(r0), pt((r0 + r1) / 2).add(V3(0.004, 0.004, 0.004)), pt(r1)]), hi ? 10 : 6, 0.0026, q(5), false));
  }
  const izr = new THREE.Mesh(zdruzi(izG), mat("#ffc0a4", { roughness: 0.35, emissive: new THREE.Color(0xff9a74).multiplyScalar(0.15) }));
  group.add(kor2, izr);

  // ---------- semenčice v pravi velikosti (≈ 60 µm, pol premera jajčne celice) ----------
  const semMat = mat(B.bicek, { roughness: 0.32 });
  const semGlMat = mat(C_SEM, { roughness: 0.28 });
  const sem = [], glave = [];
  for (const [dx, dy, dz, tx, ty, tz, fz] of [[0.62, -0.22, 0.75, 0.2, 0.95, -0.1, 0], [0.25, -0.72, 0.65, -0.95, 0.1, 0.3, 1.7], [0.92, 0.32, 0.22, -0.2, 0.3, 0.9, 3.1]]) {
    const d = V3(dx, dy, dz).normalize(), t = V3(tx, ty, tz).projectOnPlane(d).normalize(), n = d.clone().cross(t);
    const glava = new THREE.SphereGeometry(1, q(14), q(10)).scale(0.026, 0.016, 0.008);
    glava.applyMatrix4(new THREE.Matrix4().makeBasis(d.clone().negate(), t, n));
    const gp = d.clone().multiplyScalar(0.9);
    glava.translate(gp.x, gp.y, gp.z);
    glave.push(glava);
    const rep = new THREE.Mesh(new THREE.BufferGeometry(), semMat);
    sem.push({ d, t, n, f: fz, rep });
    group.add(rep);
  }
  const semGlave = new THREE.Mesh(zdruzi(glave), semGlMat);
  group.add(semGlave);
  function postaviSemencice(cas) {
    for (const s of sem) {
      const pts = [];
      for (let i = 0; i <= 40; i++) {
        const u = i / 40, th = (u * 0.58) / 0.95, R = 0.922 + 0.045 * Math.min(1, u * 2.5);
        const val = 0.03 * Math.pow(u, 1.1) * Math.sin(u * 14 - cas * 9 + s.f);
        pts.push(s.d.clone().multiplyScalar(Math.cos(th)).addScaledVector(s.t, Math.sin(th)).multiplyScalar(R).addScaledVector(s.n, val));
      }
      s.rep.geometry.dispose();
      s.rep.geometry = cev(new THREE.CatmullRomCurve3(pts), q(60), (u) => (u < 0.08 ? 0.0065 : 0.0052 - 0.0028 * u), q(6));
    }
  }
  postaviSemencice(0);
  const semMeshes = [semGlave, ...sem.map((s) => s.rep)];

  // ---------- deli ----------
  const D = {};
  const dd = (id, ime, opis, barva, meshes, tocka) => { const sez = []; del(id, ime, opis, barva, meshes, tocka, sez); D[id] = sez[0]; };
  const naE = (x, y, z, f = 1.01) => { const d = V3(x, y, z).normalize(); return d.multiplyScalar(oblE(d) * f).toArray(); };
  const izmed = (sez, pogoj) => (sez.find(pogoj) || sez[0]).toArray();
  dd("membrana", "Celična membrana", "Meja jajčne celice iz dveh plasti fosfolipidov; ko se z njo zlije membrana ene semenčice, se jajčna celica takoj zaščiti pred drugimi. Debelina je povečana.", "#9fb4ff",
    [JO.out, JO.pok, JO.rob, JJ.out, JJ.pok, JJ.rob], [-0.313, 0, 0.468]);
  dd("mikrovili", "Mikrovili", "Drobni prstasti izrastki membrane, ki štrlijo v perivitelinski prostor; na njih se semenčica pripne in zlije z jajčno celico.", C_MV,
    [JO.mv, JO.mvP, JJ.mv, JJ.mvP], naE(0.05, 0.62, 0.78, 1.02));
  dd("citoplazma", "Citoplazma", "Bogata zaloga snovi in organelov, iz katerih živi zarodek prve dni po oploditvi.", "#5b4bb0", [JO.cit, JJ.cit], naE(0.2, -0.3, -0.9, 0.93));
  dd("rumenjak", "Rumenjakova zrnca", "Zrnca s hranilnimi snovmi; človeška jajčna celica jih ima malo, ker zarodek kmalu dobi hrano od matere.", C_RUM, [rum], izmed(rumK, (v) => v.x < -0.15 && v.y > 0.15 && v.z > 0.15));
  dd("mitohondriji", "Mitohondriji", "Okrogli mitohondriji z redkimi kristami; jajčna celica jih ima več sto tisoč in vsi mitohondriji zarodka so materini.", B.mitohondrij, [mit], izmed(mitK, (v) => v.x < -0.1 && v.y > 0.1 && v.z > 0.1));
  dd("gladki-er", "Gladki endoplazemski retikulum", "Skupki mehurčkov in cevk; hranijo kalcijeve ione, ki ob oploditvi sprožijo izločanje kortikalnih zrnc.", B.ger, [ser], izmed(serC, (v) => v.x < -0.1 && v.y > 0.1 && v.z > 0.1));
  dd("kortikalna-zrnca", "Kortikalna zrnca", "Mehurčki tik pod membrano; ob oploditvi izpraznijo vsebino in prozorno ovojnico strdijo, da ne vstopi druga semenčica.", C_KORT, [kor], naE(0.3, 0.35, -0.85, 0.94));
  dd("vreteno", "Delitveno vreteno", "Snopi mikrotubulov med poloma; ob oploditvi razvlečejo sestrske kromatide, saj se druga mejotska delitev dokonča šele takrat.", B.citoskelet, [vreteno], VC.clone().addScaledVector(tPT, 0.04).toArray());
  dd("kromosomi", "Kromosomi", "23 kromosomov, vsak iz dveh sestrskih kromatid, urejenih v ravnini sredi vretena (metafaza druge mejotske delitve).", C_KROM, [kromV], VC.toArray());
  dd("polarno-telesce", "Polarno telesce", "Majhna celica, ki se odcepi pri prvi mejotski delitvi; dobi polovico kromosomov, a skoraj nič citoplazme, in propade.", "#f2a6c8", [polT, polTIn, polTPok, ptRob, polKr], PC.clone().add(V3(-0.01, 0.02, 0.02)).toArray());
  dd("jedro", "Jedro (zarodni mešiček)", "Veliko jedro nezrele jajčne celice v jajčniku; tik pred ovulacijo se ovojnica razgradi in celica nadaljuje mejozo.", B.jedro, [jOut, jPok, jIn], JC.clone().add(V3(0.06, 0.1, -0.06)).toArray());
  dd("jedrna-ovojnica", "Jedrna ovojnica in pore", "Dvojna membrana z jedrnimi porami okoli zarodnega mešička; skozi pore potujejo snovi, tik pred ovulacijo pa se ovojnica razgradi.", B.ovojnica, [jRob, pore], JC.clone().add(V3(-0.07, 0.07, 0.05)).toArray());
  dd("kromatin", "Kromatin", "Dolge niti DNK in beljakovin v jedru; pred nadaljevanjem mejoze se zgostijo v kromosome.", B.kromatin, [kromatin], JC.clone().add(V3(-0.02, 0.05, 0.04)).toArray());
  dd("jedrce", "Jedrce", "Telesce v jedru, kjer nastajajo ribosomi; nezrela jajčna celica jih potrebuje zelo veliko.", B.jedrce, [jedrce], JC.clone().add(jedrce.position).toArray());
  dd("perivitelinski-prostor", "Perivitelinski prostor", "Ozek prostor s tekočino med membrano jajčne celice in prozorno ovojnico; v njem leži polarno telesce.", C_PVP, [pvpO, pvpJ], [-0.01, 0.42, 0.42]);
  dd("zona", "Prozorna ovojnica", "Debela prosojna plast iz beljakovin in sladkorjev (zona pellucida); nanjo se pripne semenčica iste vrste, po oploditvi pa se strdi.", C_ZONA, [zOut, zPok, zIn, zPl], [-0.02, 0.48, 0.47]);
  dd("korona", "Korona radiata (žarkasti venec)", "Venec foliklovih celic, ki jajčno celico hranijo in varujejo; semenčice se morajo preriniti med njimi.", C_KOR, [kor2], [0.25, 0.55, 0.62]);
  dd("izrastki", "Izrastki foliklovih celic", "Tanki podaljški celic korone, ki segajo skozi prozorno ovojnico do jajčne celice in ji dovajajo hranila in signale.", "#ffc0a4", [izr], [0.003, Math.cos(0.5) * 0.68, Math.sin(0.5) * 0.68]);
  dd("semencice", "Semenčice (za primerjavo)", "Semenčice v pravi velikosti: s 60 µm so dolge pol premera jajčne celice, njihova glava pa meri le 5 µm.", C_SEM, semMeshes, sem[0].d.clone().multiplyScalar(0.91).toArray());

  let ovulacija = true, semVidne = true, cela = false;
  function osvezi() {
    const [A, N] = ovulacija ? [JO, JJ] : [JJ, JO];
    for (const m of [N.out, N.pok, N.rob, N.cit, N.mv, N.mvP]) m.visible = false;
    for (const m of [A.out, A.cit]) m.visible = true;
    A.pok.visible = cela; A.mvP.visible = cela; A.rob.visible = !cela; A.mv.visible = true;
    for (const m of [vreteno, kromV, polT, polTIn, polKr]) m.visible = ovulacija;
    polTPok.visible = ovulacija && cela; ptRob.visible = ovulacija && !cela;
    jedroG.visible = !ovulacija;
    jPok.visible = cela; jRob.visible = !cela;
    zPok.visible = cela; zPl.visible = !cela; izr.visible = !cela; pvpO.visible = !cela && ovulacija; pvpJ.visible = !cela && !ovulacija;
    for (const m of semMeshes) m.visible = semVidne;
    deli = ["membrana", "mikrovili", "citoplazma", ...(ovulacija ? ["vreteno", "kromosomi", "polarno-telesce"] : ["jedro", "jedrna-ovojnica", "kromatin", "jedrce"]),
      "rumenjak", "mitohondriji", "gladki-er", "kortikalna-zrnca", ...(cela ? [] : ["perivitelinski-prostor"]), "zona", "korona", ...(cela ? [] : ["izrastki"]), ...(semVidne ? ["semencice"] : [])].map((id) => D[id]);
  }
  osvezi();

  const nadzor = [
    {
      tip: "izbira", id: "stopnja", oznaka: "Stopnja", moznosti: [["ovulacija", "Ob ovulaciji"], ["jajcnik", "Pred ovulacijo"]], vrednost: "ovulacija",
      ob: (v) => { ovulacija = v !== "jajcnik"; osvezi(); },
    },
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez", ob: (v) => { cela = v === "cela"; osvezi(); } },
    { tip: "stikalo", id: "semencice", oznaka: "Semenčice za primerjavo", vrednost: true, ob: (v) => { semVidne = !!v; osvezi(); } },
  ];
  const z = ctx.zacetek || {};
  for (const n of nadzor) if (z[n.id] !== undefined) { n.vrednost = z[n.id]; n.ob(z[n.id]); }

  // rahle razlike v svetlosti med ponovljenimi deli (organeli in celice niso vsi povsem enaki)
  {
    const c = new THREE.Color();
    group.traverse((m) => {
      if (!m.isInstancedMesh || m.instanceColor) return;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.86 + 0.24 * V.hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
    });
  }

  const vsiDeli = Object.values(D);
  const zat = (p) => 0.8 + 0.2 * Math.min(1, Math.max(0, 0.5 + 0.6 * (-p.x + p.y + p.z) / (Math.hypot(p.x, p.y, p.z) * 1.732 || 1)));
  V.poliraj(group, vsiDeli, {
    citoplazma: { tex: "fino", rf: 40, k: 1.1, b: 0.24, lisa: 0.22, f: 4, ao: zat },
    mikrovili: { tex: null },
    jedro: { tex: "zrna", rf: 110, k: 1.1, b: 0.2, lisa: 0.12, f: 14 },
    "jedrna-ovojnica": { tex: null },
    jedrce: { tex: "zrna", rf: 160, k: 1.3, b: 0.25 },
    kromosomi: { tex: "gube", rf: 600, k: 0.8 },
    "polarno-telesce": { tex: "fino", rf: 200, k: 0.8 },
    rumenjak: { tex: "zrna", rf: 260, k: 0.9, b: 0.2 },
    mitohondriji: { tex: "gube", rf: 260, k: 0.8 },
    "gladki-er": { tex: "fino", rf: 300, k: 0.6 },
    "kortikalna-zrnca": { tex: "zrna", rf: 300, k: 0.7 },
    korona: { tex: "zrna", rf: 60, k: 1.2, b: 0.22, s: 0.2 },
    izrastki: { tex: null },
    semencice: { tex: null },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  const nUcb = V.barveUcbenika(vsiDeli, {
    mikrovili: "#f09ab0", rumenjak: "#f2d36b", "kortikalna-zrnca": "#d8509a", vreteno: "#8fa3cc", kromosomi: "#3a2a8f",
    "polarno-telesce": "#f2b8c8", "perivitelinski-prostor": "#cfeef8", zona: "#e4e8f6", korona: "#f2c09a",
    izrastki: "#e8a888", semencice: "#9fd8e8",
  });
  nadzor.push(nUcb);

  return {
    group,
    get deli() { return deli; },
    nadzor,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81],
    korak(t) {
      if (!gib || !semVidne) return;
      postaviSemencice(t);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
