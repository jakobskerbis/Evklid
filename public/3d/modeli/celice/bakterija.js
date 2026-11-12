// Bakterijska celica (Escherichia coli) v prerezu: kapsula, zunanja membrana z LPS, peptidoglikan, periplazma, celična
// membrana, nukleoid, plazmidi, ribosomi, mRNK, citoskelet, bički z motorjem in pili.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-bakterijska",
  naslov: "Bakterijska celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Paličasta bakterija Escherichia coli (dolga okoli 2 µm) v prerezu. Nima jedra ne organelov z membrano: DNK leži prosto v citoplazmi kot nukleoid. Ovojnica je debelejša, bički pa krajši kot v resnici.",
  poskusi: "Izklopi kapsulo in poišči nukleoid: kje je DNK, če bakterija nima jedra?",
  merilo: { m: 3.2e-6, oznaka: "3,2 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const zac = ctx.zacetek || {};
  const group = new THREE.Group();
  let deli = [];
  const odpad = [];
  const V = videzCelic(THREE, { hi, odpad });

  // ---------- orodja ----------
  let seme = 31;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const { hash, fbm } = V;
  const v3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const nakl = (s = 1) => v3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(s);
  const gladko = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3,
      sheen: 0.5, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
    }, o));
    odpad.push(m);
    return m;
  }
  // Združi geometrije (z index ali brez) v eno; po želji pobarva vsako z barvo oglišč
  // (barva null = obdrži barve oglišč te geometrije).
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], idx = [];
    let off = 0;
    geos.forEach((g, i) => {
      const p = g.attributes.position, n = g.attributes.normal, ca = g.attributes.color;
      const c = barve && barve[i] != null ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (barve) { if (c) col.push(c.r, c.g, c.b); else if (ca) col.push(ca.getX(k), ca.getY(k), ca.getZ(k)); else col.push(1, 1, 1); }
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
  // Telo je premaknjeno nazaj (-x), da je skupaj s snopom bičkov na sredini odra; točke delov so v koordinatah telesa.
  const OX = -0.15;
  const telo = new THREE.Group();
  telo.position.x = OX;
  group.add(telo);
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka: [tocka[0] + OX, tocka[1], tocka[2]].map((x) => Math.round(x * 1000) / 1000) });
  }
  // Trak (ploskev prereza) iz parov točk [zunanja, notranja] z dano normalo.
  function trak(pari, nrm) {
    const pos = [], nor = [], idx = [];
    pari.forEach(([a, b], i) => {
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z); nor.push(nrm.x, nrm.y, nrm.z, nrm.x, nrm.y, nrm.z);
      if (i) { const k = 2 * i; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
    });
    // ovijanje trikotnikov naj se ujema z normalo (sicer DoubleSide obrne osvetlitev)
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
  // Smer proti privzeti kameri (za izbiro vidnih točk).
  const KAM = v3(-0.36, 0.52, 0.78).normalize();
  // Vrtenina okoli osi x. Profil [[x, r], …] od -x proti +x; normale v ravnini (x, r).
  function profil(pts) {
    const n = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const tx = b[0] - a[0], tr = b[1] - a[1], l = Math.hypot(tx, tr) || 1;
      return [-tr / l, tx / l];
    });
    return { p: pts, n };
  }
  function vrtTocka(P, i, th, zamik, sumF, out) {
    const [x, r] = P.p[i], [nx, nr] = P.n[i];
    const c = Math.cos(th), s = Math.sin(th);
    const d = (sumF ? sumF(x, r * c, r * s) : 0) - zamik;
    const rr = Math.max(0, r + d * nr);
    return out.set(x + d * nx, rr * c, rr * s);
  }
  // Vrne { g, rez(bool) }; izrez: i < rezI in kot od -s do nK/4 + s korakov (y > 0, z > 0, pri s > 0 širše, da se plasti
  // ovojnice vidijo kot stopnice).
  function vrtenina(P, nK, rezI, zamik = 0, sumF = null, s = 0) {
    const nP = P.p.length;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nP * (nK + 1) * 3), 3));
    const cela = [], izrez = [];
    for (let i = 0; i < nP - 1; i++) for (let j = 0; j < nK; j++) {
      const a = i * (nK + 1) + j, b = a + nK + 1;
      const t = [a, a + 1, b, b, a + 1, b + 1];
      cela.push(...t);
      if (!(i < rezI && (j < nK / 4 + s || j >= nK - s))) izrez.push(...t);
    }
    const v = v3(), p = g.attributes.position;
    for (let i = 0; i < nP; i++) for (let j = 0; j <= nK; j++) {
      vrtTocka(P, i, (j / nK) * Math.PI * 2, zamik, sumF, v);
      p.setXYZ(i * (nK + 1) + j, v.x, v.y, v.z);
    }
    g.setIndex(cela); g.computeVertexNormals(); g.setIndex(izrez);
    g.computeBoundingSphere();
    return { g, rez: (da) => g.setIndex(da ? izrez : cela) };
  }
  // Ploskve prereza med plastema vrtenine (zamika zA < zB) na obeh ravninah izreza (kota -s in 90° + s korakov).
  function vrtRez(P, nK, rezI, zA, zB, sumF, s = 0) {
    const t0 = (-s / nK) * Math.PI * 2, t1 = Math.PI / 2 + (s / nK) * Math.PI * 2;
    const t = (i, th) => [vrtTocka(P, i, th, zA, sumF, v3()), vrtTocka(P, i, th, zB, sumF, v3())];
    const a = [], c = [];
    for (let i = 0; i <= rezI; i++) { a.push(t(i, t0)); c.push(t(i, t1)); }
    return zdruzi([trak(a, v3(0, -Math.sin(t0), Math.cos(t0))), trak(c, v3(0, Math.sin(t1), -Math.cos(t1)))]);
  }
  const o = new THREE.Object3D(), smer = v3();

  // ---------- oblika: valj s polkroglastima koncema (dolžina 2 µm = 1,24 enote) ----------
  const H = 0.36, RB = 0.26;
  const nCap = hi ? 18 : 8, nCyl = hi ? 30 : 12, nK = hi ? 96 : 40;
  const pts = [];
  for (let i = 0; i < nCap; i++) { const a = Math.PI - (i / nCap) * (Math.PI / 2); pts.push([-H + RB * Math.cos(a), RB * Math.sin(a)]); }
  for (let i = 0; i <= nCyl; i++) pts.push([-H + (2 * H * i) / nCyl, RB]);
  for (let i = 1; i <= nCap; i++) { const a = Math.PI / 2 - (i / nCap) * (Math.PI / 2); pts.push([H + RB * Math.cos(a), RB * Math.sin(a)]); }
  const P = profil(pts), rezI = pts.length - 1; // izrez po vsej dolžini: četrtina y > 0, z > 0
  const sumF = (x, y, z) => 0.0035 * fbm(x * 9 + 2, y * 9, z * 9);
  // Plasti ovojnice od zunaj navznoter (zamik od zunanje ploskve; debelina ≈ 1,7-krat povečana):
  // zunanja membrana, periplazma, peptidoglikan, periplazma, celična membrana; nato citoplazma.
  const Z = { om1: 0.009, pg0: 0.0135, pg1: 0.0205, im0: 0.03, im1: 0.039 }, ZK = -0.055;
  const KOR = (Math.PI * 2) / nK, S_OM = hi ? 4 : 2, S_PG = hi ? 2 : 1; // stopnice prereza (v korakih mreže)
  const tocka = (x, th, zamik) => { let i = 0; while (i < P.p.length - 1 && P.p[i][0] < x) i++; return vrtTocka(P, i, th, zamik, sumF, v3()); };
  const osDist = (p) => Math.hypot(Math.max(0, Math.abs(p.x) - H), Math.hypot(p.y, p.z));
  const vCeli = (p, m = 0) => osDist(p) < RB - m;
  const izrezan = (p, m = 0) => p.y > -m && p.z > -m;
  // ali je točka na površini v izrezanem pasu s stopnico s
  const vPasu = (p, s) => { const th = Math.atan2(p.z, p.y); return th > -s * KOR - 0.01 && th < Math.PI / 2 + s * KOR + 0.01; };
  const plasti = (meje, barve, s) => zdruzi(meje.slice(0, -1).map((a, i) => vrtRez(P, nK, rezI, a, meje[i + 1], sumF, s)), barve);
  const rezMat = () => mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.45, side: THREE.DoubleSide });
  // Lipidni dvosloj v prerezu: temne glave, svetli repi, temne glave.
  const GLAVE = 0x6b3fc8, REPI = new THREE.Color(B.dvosloj).getHex(), REPI2 = 0xf6d9e6;
  const dvosloj = (z0, z1) => { const d = z1 - z0; return [[z0, z0 + d * 0.2, z0 + d * 0.42, z0 + d * 0.58, z0 + d * 0.8, z1], [GLAVE, REPI, REPI2, REPI, GLAVE]]; };

  // ---------- zunanja membrana (steklena, z LPS in porini) ----------
  const omG = vrtenina(P, nK, rezI, 0, sumF, S_OM);
  const omMat = V.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.12, rf: 46, k: 0.8, rob: B.membranaRob, rk: 1.1 });
  const om = new THREE.Mesh(omG.g, omMat);
  om.renderOrder = 2;
  const [omM, omB] = dvosloj(0, Z.om1);
  omB[0] = 0x4a2390; // zunanja plast: jedra LPS
  const omRez = new THREE.Mesh(plasti(omM, omB, S_OM), rezMat());
  telo.add(om, omRez);
  // točke na celi ploskvi (tudi v izrezanem pasu, za pogled »Cela celica«), razdeljene na stalne in tiste v izrezu
  function naPovrsini(mesh, geo, n, s, zamik = 0) {
    geo.rez(false);
    const t = V.posej(mesh, n).map((x) => ({ p: x.p.addScaledVector(x.n, zamik), n: x.n }));
    geo.rez(true);
    return [t.filter((x) => !vPasu(x.p, s)), t.filter((x) => vPasu(x.p, s))];
  }
  // LPS: kratke verige sladkorjev (antigen O), gost puh na zunanji strani
  const lpsGeo = new THREE.CylinderGeometry(0.0007, 0.0012, 1, hi ? 4 : 3, 1, true).translate(0, 0.5, 0);
  const lpsMat = mat(0xc3a6ff, { roughness: 0.35, clearcoat: 0.6, emissive: new THREE.Color(0x3a2470) });
  function puh(tt, geo, m, dol, raz, rezerva = 0) {
    const im = new THREE.InstancedMesh(geo, m, Math.max(1, tt.length + rezerva));
    tt.forEach((t, i) => {
      o.position.copy(t.p); o.quaternion.setFromUnitVectors(v3(0, 1, 0), t.n.clone().add(nakl(raz)).normalize());
      const l = dol[0] + (dol[1] - dol[0]) * rnd(); o.scale.set(1, l, 1); o.updateMatrix(); im.setMatrixAt(i, o.matrix);
    });
    im.count = tt.length;
    return im;
  }
  const [lpsA, lpsB] = naPovrsini(om, omG, hi ? 4400 : 720, S_OM);
  const lps = puh(lpsA, lpsGeo, lpsMat, [0.009, 0.017], 0.7), lpsP = puh(lpsB, lpsGeo, lpsMat, [0.009, 0.017], 0.7);
  const [porA, porB] = naPovrsini(om, omG, hi ? 380 : 150, S_OM, 0.002);
  const porini = V.beljakovine(porA, B.beljakovine, 0.0055, { visina: 1.3 }), poriniP = V.beljakovine(porB, B.beljakovine, 0.0055, { visina: 1.3 });
  lpsP.visible = poriniP.visible = false;
  telo.add(lps, lpsP, porini, poriniP);
  del("zunanja-membrana", "Zunanja membrana (z LPS)", "Druga membrana Gram-negativnih bakterij. Navzven moli gost puh lipopolisaharidov (LPS, verige sladkorjev); beljakovine porini v njej prepuščajo majhne molekule. Debelina je povečana.", "#c3a6ff",
    [om, omRez, lps, lpsP, porini, poriniP], tocka(-0.1, -0.5, 0).toArray());

  // ---------- periplazma (gel med membranama; v prerezu prosojna) ----------
  const periMat = mat(0x6fd2e0, { roughness: 0.2, clearcoat: 1, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true });
  periMat.userData.rez = true;
  const peri = new THREE.Mesh(zdruzi([vrtRez(P, nK, rezI, Z.om1, Z.pg0, sumF, S_OM), vrtRez(P, nK, rezI, Z.pg1, Z.im0, sumF, S_PG)]), periMat);
  peri.renderOrder = 1;
  telo.add(peri);
  del("periplazma", "Periplazma", "Ozek prostor z gelom med zunanjo in celično membrano; v njem je peptidoglikan, encimi in beljakovine, ki prenašajo snovi.", "#6fd2e0",
    [peri], tocka(0.1, -S_PG * KOR, (Z.pg1 + Z.im0) / 2).toArray());

  // ---------- celična stena: tanka mreža peptidoglikana ----------
  const pgG = vrtenina(P, nK, rezI, Z.pg0, sumF, S_PG);
  // luknje: peptidoglikan je mreža sladkornih verig, povezanih s peptidi (skozi luknje se vidi celična membrana)
  const pgMat = V.sencilo(mat(new THREE.Color(B.stena).lerp(new THREE.Color(B.stenaTemna), 0.35), { roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.15, sheen: 0.5, sheenColor: new THREE.Color(0xdfffa8) }),
    { vr: 1, rf: 150, k: 2.2, b: 0.38, s: 0.2, luknje: { f: 95, prag: 0.76 } });
  const pg = new THREE.Mesh(pgG.g, pgMat);
  const pgRez = new THREE.Mesh(plasti([Z.pg0, Z.pg0 + 0.0018, Z.pg1 - 0.0018, Z.pg1], [B.stenaTemna, B.stena, B.stenaTemna], S_PG), rezMat());
  telo.add(pg, pgRez);
  del("celicna-stena", "Celična stena (peptidoglikan)", "Tanka, a čvrsta mreža iz peptidoglikana (mureina), ki bakteriji daje obliko in jo varuje, da ne poči. Pri E. coli leži med obema membranama. Debelina je povečana.", B.stena,
    [pg, pgRez], tocka(0.05, -S_OM * KOR + 0.03, Z.pg0).toArray());

  // ---------- celična membrana in citoplazma ----------
  const imG = vrtenina(P, nK, rezI, Z.im0, sumF, 0);
  const im = new THREE.Mesh(imG.g, mat(B.dvosloj, { roughness: 0.35, clearcoat: 0.8 }));
  const [imM, imB] = dvosloj(Z.im0, Z.im1);
  const imRez = new THREE.Mesh(plasti(imM, imB, 0), rezMat());
  const cG = vrtenina(P, nK, rezI, Z.im1, sumF, 0);
  const cit = new THREE.Mesh(cG.g, mat(0x3d3180, { roughness: 0.62, clearcoat: 0.25, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide }));
  telo.add(im, imRez, cit);
  // beljakovine na notranji strani membrane (prenašalci, dihalna veriga, ATP-sintaza)
  const imT = V.posej(cit, hi ? 240 : 90).map((t) => ({ p: t.p.addScaledVector(t.n, -0.002), n: t.n.negate() }));
  const imBelj = V.beljakovine(imT, B.beljakovine, 0.0065, { visina: 1.4 });
  telo.add(imBelj);
  del("membrana", "Celična membrana", "Dvosloj fosfolipidov z beljakovinami (v prerezu temne glave, svetli repi); uravnava prehod snovi. Na njej poteka celično dihanje, saj bakterija nima mitohondrijev. Debelina je povečana.", B.dvosloj,
    [im, imRez, imBelj], tocka(-0.12, 0.012, (Z.im0 + Z.im1) / 2).toArray());
  del("citoplazma", "Citoplazma", "Gosta tekočina v celici z ribosomi, encimi in hranili; v njej ni organelov z membrano.", "#5b4bb0", [cit], tocka(-0.3, Math.PI * 1.25, Z.im1 + 0.002).toArray());

  // ---------- kapsula (sluzasta ovojnica) ----------
  const nKk = hi ? 64 : 32, sK = Math.round(((S_OM + 1) * KOR) / ((Math.PI * 2) / nKk));
  const kG = vrtenina(P, nKk, rezI, ZK, (x, y, z) => 0.01 * fbm(x * 5, y * 5, z * 5), sK);
  const kapsula = new THREE.Mesh(kG.g, V.steklo(mat(B.sluz, { side: THREE.FrontSide }), { a: 0.03, rf: 10, k: 0.6, rob: B.sluz, rk: 0.4, iri: 0.3 }));
  kapsula.renderOrder = 3;
  telo.add(kapsula);
  del("kapsula", "Kapsula", "Sluzasta plast zunaj stene, ki bakterijo varuje pred izsušitvijo in obrambnimi celicami; nimajo je vse bakterije.", B.sluz,
    [kapsula], tocka(0.05, Math.PI * 0.75, ZK).toArray());

  // ---------- nukleoid: krožna DNK, gosto zvita v klobčič (in še navita sama vase) ----------
  const KF = hi ? 72 : 48, ak = [], bk = [];
  for (let k = 1; k <= KF; k++) { const a = 1 / Math.pow(k, 0.55); ak.push(nakl(a)); bk.push(nakl(a)); }
  const nZ = hi ? 3600 : 1400, zanka = [];
  for (let i = 0; i < nZ; i++) {
    const t = (i / nZ) * Math.PI * 2, p = v3();
    for (let k = 1; k <= KF; k++) p.addScaledVector(ak[k - 1], Math.cos(k * t)).addScaledVector(bk[k - 1], Math.sin(k * t));
    zanka.push(p);
  }
  const bb = new THREE.Box3().setFromPoints(zanka), bs = bb.getSize(v3()), bc = bb.getCenter(v3());
  zanka.forEach((p) => p.sub(bc).multiply(v3(0.56 / bs.x, 0.25 / bs.y, 0.25 / bs.z)));
  // superzvitje: nit se ovija okoli osnovne krivulje (vzporedni prenos okvirja)
  function superzvij(tt, rs, obrati) {
    const n = tt.length, T = tt.map((p, i) => tt[(i + 1) % n].clone().sub(tt[(i - 1 + n) % n]).normalize());
    let N = v3(0, 1, 0).cross(T[0]).normalize();
    const out = [];
    for (let i = 0; i < n; i++) {
      N.addScaledVector(T[i], -N.dot(T[i])).normalize();
      const Bn = T[i].clone().cross(N), a = (Math.PI * 2 * obrati * i) / n;
      out.push(tt[i].clone().addScaledVector(N, Math.cos(a) * rs).addScaledVector(Bn, Math.sin(a) * rs));
    }
    return out;
  }
  const dnkTocke = hi ? superzvij(zanka, 0.0052, Math.round(nZ / 7.5)) : zanka;
  const dnk = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(dnkTocke, true), Math.round(nZ * (hi ? 1.35 : 1.25)), hi ? 0.0034 : 0.0042, hi ? 4 : 3, true),
    mat(B.dnk, { roughness: 0.32, clearcoat: 0.8, emissive: new THREE.Color(B.dnk).multiplyScalar(0.12) }));
  // beljakovine nukleoida (HU, Fis …), ki DNK zvijajo in držijo skupaj
  const napT = [];
  for (let i = 0; i < (hi ? 170 : 60); i++) { const p = zanka[Math.floor(rnd() * nZ)]; napT.push({ p: p.clone().add(nakl(0.006)), n: nakl(1).normalize() }); }
  const nap = V.beljakovine(napT, B.kromatin, hi ? 0.0052 : 0.006, { visina: 1 });
  telo.add(dnk, nap);
  const dnkT = zanka.filter((p) => !izrezan(p, 0.02)).sort((a, b) => b.dot(KAM) - a.dot(KAM))[0] || zanka[0];
  del("nukleoid", "Nukleoid (krožna DNK)", "Območje, kjer leži ena sama velika krožna molekula DNK, gosto zvita v klobčič in povezana z beljakovinami. Bakterija nima jedra, zato DNK ni ločena od citoplazme.", B.dnk, [dnk, nap], dnkT.toArray());
  const vNuk = (p) => (p.x / 0.3) ** 2 + (p.y / 0.135) ** 2 + (p.z / 0.135) ** 2 < 1;

  // ---------- plazmidi: majhne krožne DNK, superzvite v osmice ----------
  const plC = [v3(-0.5, 0.02, -0.07), v3(0.44, -0.07, 0.03), v3(0.06, -0.165, 0.05), v3(-0.28, 0.06, -0.16)].slice(0, hi ? 4 : 3);
  const plG = [];
  for (const c of plC) {
    const pp = [], R0 = 0.03 + rnd() * 0.008, e = new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3), np = hi ? 140 : 70;
    for (let i = 0; i < np; i++) {
      const t = (i / np) * Math.PI * 2;
      pp.push(v3(Math.cos(t) * R0, Math.sin(t) * R0 * 0.55, 0.014 * Math.sin(2 * t)).applyEuler(e).add(c));
    }
    plG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hi ? superzvij(pp, 0.0042, 16) : pp, true), hi ? 200 : 80, hi ? 0.0024 : 0.0032, hi ? 4 : 3, true));
  }
  const plazmid = new THREE.Mesh(zdruzi(plG), mat(0xff9fd6, { roughness: 0.3, clearcoat: 0.8, emissive: new THREE.Color(0xff9fd6).multiplyScalar(0.12) }));
  telo.add(plazmid);
  del("plazmidi", "Plazmidi", "Majhne krožne molekule DNK poleg nukleoida; nosijo dodatne gene (na primer za odpornost proti antibiotikom) in jih bakterije lahko izmenjajo.", "#ff9fd6", [plazmid], plC[0].toArray());

  // ---------- zrnca zalog (glikogen) ----------
  const zalT = [];
  for (let p = 0; zalT.length < (hi ? 7 : 4) && p < 5000; p++) {
    smer.set((rnd() * 2 - 1) * (H + RB * 0.4), (rnd() * 2 - 1) * RB, (rnd() * 2 - 1) * RB);
    const tla = (smer.z > 0.03 && smer.y < -0.01 && smer.y > -0.06) || (smer.y > 0.03 && smer.z < -0.01 && smer.z > -0.06);
    if (!vCeli(smer, Z.im1 + 0.04) || izrezan(smer, -0.005) || vNuk(smer) || (zalT.length < 3 && !tla) || plC.some((c) => c.distanceTo(smer) < 0.07) || zalT.some((c) => c.distanceTo(smer) < 0.09)) continue;
    zalT.push(smer.clone());
  }
  const zalGeo = new THREE.SphereGeometry(0.024, q(18), q(13));
  { const pz = zalGeo.attributes.position, w = v3(); for (let i = 0; i < pz.count; i++) { w.fromBufferAttribute(pz, i); w.multiplyScalar(1 + 0.12 * fbm(w.x * 90, w.y * 90, w.z * 90)); pz.setXYZ(i, w.x, w.y, w.z); } zalGeo.computeVertexNormals(); }
  const zaloge = new THREE.InstancedMesh(zalGeo, mat(B.glikogen, { roughness: 0.3, clearcoat: 0.9 }), zalT.length);
  zalT.forEach((c, i) => { o.position.copy(c); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.scale.setScalar(0.7 + 0.55 * rnd()); o.updateMatrix(); zaloge.setMatrixAt(i, o.matrix); });
  o.scale.setScalar(1);
  telo.add(zaloge);
  del("zaloge", "Zrnca zalog", "Zrnca glikogena in drugih snovi, ki si jih bakterija shrani, kadar ima hrane dovolj.", B.glikogen, [zaloge], zalT[0].toArray());

  // ---------- mRNK s polisomi: prepis in prevajanje potekata hkrati ----------
  const mrnkK = [], mrnkRib = [];
  for (let p = 0; mrnkK.length < (hi ? 16 : 8) && p < 4000; p++) {
    const z0 = zanka[Math.floor(rnd() * nZ)];
    if (izrezan(z0, 0.01) || Math.hypot(z0.y, z0.z) < 0.06) continue;
    const pp = [z0.clone()], smerR = v3(z0.x * 0.3, z0.y, z0.z).normalize();
    let ok = true;
    for (let s = 0; s < 6; s++) {
      const nx = pp[pp.length - 1].clone().addScaledVector(smerR, 0.024).add(nakl(0.03));
      if (!vCeli(nx, Z.im1 + 0.03) || izrezan(nx, -0.004)) { ok = false; break; }
      pp.push(nx);
    }
    if (!ok) continue;
    const kr = new THREE.CatmullRomCurve3(pp);
    mrnkK.push(kr);
    const L = kr.getLength();
    for (let u = 0.12; u < 1; u += 0.017 / L) mrnkRib.push(kr.getPoint(u).add(nakl(0.008)));
  }
  const mrnk = V.vlakna(mrnkK, 0.0017, B.rnk, { sij: 0.45, seg: hi ? 24 : 12, rad: 3 });
  telo.add(mrnk);
  del("mrnk", "mRNK in polisomi", "Prepis gena iz DNK. Ker bakterija nima jedra, ribosomi mRNK berejo že med prepisovanjem: na eni niti jih je več hkrati (polisom).", B.rnk,
    [mrnk], mrnkK.length ? mrnkK[0].getPoint(0.6).toArray() : [0, 0, 0]);

  // ---------- ribosomi 70S (velika in mala podenota), zelo gosti ----------
  const ribGeo = hi ? zdruzi([new THREE.IcosahedronGeometry(0.0064, 0), new THREE.OctahedronGeometry(0.0048, 0).scale(1.15, 0.8, 1).translate(0.005, 0.0044, 0)])
    : new THREE.IcosahedronGeometry(0.0068, 0).scale(1, 0.85, 1.1);
  const nRib = hi ? 3000 : 620;
  const rib = new THREE.InstancedMesh(ribGeo, mat(B.ribosomi, { roughness: 0.28, clearcoat: 0.9, emissive: new THREE.Color(B.ribosomi).multiplyScalar(0.22) }), nRib);
  const X0 = v3(0.3, 0.8, 0.5).normalize();
  const ribT = [];
  let k = 0, posk = 0;
  const postaviRib = (p) => { o.position.copy(p); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.scale.setScalar(0.85 + 0.3 * rnd()); o.updateMatrix(); rib.setMatrixAt(k++, o.matrix); };
  for (const p of mrnkRib) if (k < nRib * 0.3) postaviRib(p);
  o.scale.setScalar(1);
  while (k < nRib && posk++ < 300000) {
    smer.set((rnd() * 2 - 1) * (H + RB), (rnd() * 2 - 1) * RB, (rnd() * 2 - 1) * RB);
    if (!vCeli(smer, Z.im1 + 0.012) || izrezan(smer, 0) || (vNuk(smer) && rnd() < 0.94) || plC.some((c) => c.distanceTo(smer) < 0.05) || zalT.some((c) => c.distanceTo(smer) < 0.04)) continue;
    // dobra tretjina v verižicah (poliribosomi na isti mRNK), ostali posamič
    const n = rnd() < 0.35 ? 4 + Math.floor(rnd() * 6) : 1, kor = nakl(1).setLength(0.014);
    for (let j = 0; j < n && k < nRib; j++) {
      if (j && (!vCeli(smer, Z.im1 + 0.012) || izrezan(smer, 0))) break;
      postaviRib(smer);
      if (ribT.length < 80 && smer.x < 0 && ((smer.z > 0.04 && smer.y > -0.02) || (smer.y > 0.04 && smer.z > -0.02))) ribT.push(smer.clone());
      kor.applyAxisAngle(X0, 0.6).add(nakl(0.006)).setLength(0.014);
      smer.add(kor);
    }
  }
  o.scale.setScalar(1);
  rib.count = k;
  telo.add(rib);
  del("ribosomi", "Ribosomi (70S)", "Tisoči drobnih zrnc, ki sestavljajo beljakovine; bakterijski ribosomi (70S) so manjši od ribosomov v evkariontskih celicah (80S).", B.ribosomi, [rib],
    (ribT.sort((a, b) => b.dot(KAM) - a.dot(KAM))[0] || v3()).toArray());

  // ---------- citoskelet: kratka vlakna MreB tik pod membrano ----------
  const mreb = [], rM = RB - Z.im1 - 0.008;
  for (let p = 0; mreb.length < (hi ? 44 : 18) && p < 2000; p++) {
    const x0 = (rnd() * 2 - 1) * H * 0.95, th0 = Math.PI / 2 + 0.15 + rnd() * (Math.PI * 1.5 - 0.6), dl = 0.35 + rnd() * 0.45, dx = (rnd() - 0.5) * 0.08;
    const pp = [];
    for (let j = 0; j < 6; j++) { const th = th0 + (dl * j) / 5, r = rM - 0.004 * rnd(); pp.push(v3(x0 + (dx * j) / 5, r * Math.cos(th), r * Math.sin(th))); }
    mreb.push(new THREE.CatmullRomCurve3(pp));
  }
  const cito = V.vlakna(mreb, 0.0024, B.citoskelet, { sij: 0.5, seg: hi ? 16 : 8, rad: hi ? 5 : 3 });
  telo.add(cito);
  del("citoskelet", "Citoskelet (MreB)", "Beljakovinska vlakna tik pod membrano. Vodijo gradnjo stene, zato je bakterija paličasta; tudi bakterije imajo torej citoskelet.", B.citoskelet,
    [cito], mreb[0].getPoint(0.5).toArray());

  // ---------- bički: bazalno telo (motor), kavelj in vijačna nit ----------
  // Pri plavanju se bički zberejo v snop za celico (plava proti -x); skrajšani.
  const X = v3(1, 0, 0), Y = v3(0, 1, 0);
  const sidra = [
    { x: 0.14, th: 0.24 }, // v izrezu: vidi se motor
    { x: 0.3, th: Math.PI * 0.68 }, { x: -0.05, th: Math.PI * 1.02 }, { x: 0.42, th: Math.PI * 1.42 },
    { x: 0.2, th: Math.PI * 1.78 }, { x: -0.3, th: Math.PI * 1.3 }, { x: 0.62, th: Math.PI * 1.1 },
  ].slice(0, hi ? 7 : 5);
  const bMat = mat(B.bicek, { roughness: 0.3, clearcoat: 0.9 });
  const bicki = [], kavlji = [];
  const PITCH = 0.23, RH = 0.022; // razmerje korak : premer vijačnice kot pri pravem bičku
  for (const s of sidra) {
    const b = tocka(s.x, s.th, 0);
    const n = b.clone().sub(v3(Math.max(-H, Math.min(H, b.x)), 0, 0)).normalize();
    const d = X.clone().addScaledVector(n, 0.2).add(nakl(0.1)).normalize();
    const zac0 = b.clone().addScaledVector(n, 0.028);
    let L = 0.9;
    while (L > 0.2 && zac0.clone().addScaledVector(d, L + RH).add(v3(OX, 0, 0)).length() > 0.93 || zac0.x + d.x * L > H + RB + 0.34) L -= 0.02;
    // vijačna nit (levosučna), os = lokalna y
    const seg = hi ? 200 : 90, hp = [];
    for (let i = 0; i <= seg; i++) {
      const u = (i / seg) * L, r = RH * gladko(0, 0.07, u), a = (u / PITCH) * Math.PI * 2;
      hp.push(v3(Math.cos(a) * r, u, -Math.sin(a) * r));
    }
    const nit = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hp), seg, 0.0055, hi ? 6 : 3, false), bMat);
    nit.position.copy(zac0);
    nit.quaternion.setFromUnitVectors(Y, d);
    nit.userData.q0 = nit.quaternion.clone();
    telo.add(nit);
    bicki.push(nit);
    // kavelj: kratek ukrivljen del od zunanje membrane do niti
    kavlji.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(b.clone().addScaledVector(n, -0.004), b.clone().addScaledVector(n, 0.024), zac0.clone().addScaledVector(d, 0.006)), 10, 0.0075, q(8), false));
    s.b = b; s.n = n; s.d = d;
  }
  const kavelj = new THREE.Mesh(zdruzi(kavlji), mat(0xe9c27a, { roughness: 0.32, clearcoat: 0.7 }));
  telo.add(kavelj);
  del("bicki", "Bički", "Dolge vijačne niti iz beljakovine flagelina; motor jih vrti kot ladijski vijak, da bakterija plava. Med plavanjem se zberejo v snop za celico. Kavelj povezuje nit z motorjem.", B.bicek,
    [...bicki, kavelj], sidra[0].b.clone().addScaledVector(sidra[0].d, 0.2).toArray());

  // bazalno telo vidnega bička: obroč L (zunanja membrana), P (peptidoglikan), MS (celična membrana), C (v citoplazmi),
  // statorji v membrani, os in izvozni aparat; vsak obroč na globini svoje plasti
  const s0 = sidra[0], bt = [], btB = [];
  const OR = 0xf0913a, ORs = 0xffb86b, ST = 0x8f62f2;
  const obr = (glob, r, deb, b) => { const t = new THREE.TorusGeometry(r, deb, q(8), q(24)); t.rotateX(Math.PI / 2); t.translate(0, -glob, 0); bt.push(t); btB.push(b); };
  obr(Z.om1 / 2, 0.0095, 0.0032, ORs); // L
  obr((Z.pg0 + Z.pg1) / 2, 0.0095, 0.0034, ORs); // P
  obr((Z.im0 + Z.im1) / 2, 0.0135, 0.0042, OR); // MS
  const cR = new THREE.CylinderGeometry(0.021, 0.017, 0.016, q(24), 1, true); cR.translate(0, -(Z.im1 + 0.012), 0); bt.push(cR); btB.push(OR);
  const cD = new THREE.TorusGeometry(0.019, 0.003, q(6), q(24)); cD.rotateX(Math.PI / 2); cD.translate(0, -(Z.im1 + 0.02), 0); bt.push(cD); btB.push(OR);
  const os = new THREE.CylinderGeometry(0.0032, 0.0032, Z.im1 + 0.006, q(8)); os.translate(0, -(Z.im1 + 0.006) / 2 + 0.002, 0); bt.push(os); btB.push(ORs);
  const izv = new THREE.ConeGeometry(0.009, 0.014, q(10)); izv.rotateX(Math.PI); izv.translate(0, -(Z.im1 + 0.014), 0); bt.push(izv); btB.push(0xd2702a);
  for (let i = 0; i < 10; i++) { // statorji MotA/MotB: črpajo protone in poganjajo rotor
    const a = (i / 10) * Math.PI * 2, c = new THREE.CylinderGeometry(0.0036, 0.0036, Z.im1 - Z.im0 + 0.008, q(8));
    c.translate(Math.cos(a) * 0.025, -(Z.im0 + Z.im1) / 2 - 0.002, Math.sin(a) * 0.025); bt.push(c); btB.push(ST);
  }
  const motor = new THREE.Mesh(zdruzi(bt, btB), mat(0xffffff, { vertexColors: true, roughness: 0.36, clearcoat: 0.7, side: THREE.DoubleSide }));
  motor.position.copy(s0.b);
  motor.quaternion.setFromUnitVectors(Y, s0.n);
  telo.add(motor);
  del("bazalno-telo", "Bazalno telo (motor bička)", "Drobni motor iz beljakovinskih obročev v obeh membranah in steni; statorji ob njem izkoriščajo tok protonov in vrtijo biček do sto obratov na sekundo.", "#f0913a",
    [motor], s0.b.clone().addScaledVector(s0.n, -0.03).toArray());

  // ---------- pili (fimbrije) in en spolni pilus ----------
  const pilGeo = new THREE.CylinderGeometry(0.0013, 0.0021, 1, hi ? 5 : 3, 1, true).translate(0, 0.5, 0);
  const pilMat = mat(0x5fc9b3, { roughness: 0.4, clearcoat: 0.6, emissive: new THREE.Color(0x0a2a26) });
  const [pilA, pilB] = naPovrsini(om, omG, hi ? 340 : 130, S_OM);
  const pili = puh(pilA, pilGeo, pilMat, [0.035, 0.075], 0.6, 1), pilP = puh(pilB, pilGeo, pilMat, [0.035, 0.075], 0.6);
  { // spolni pilus (F-pilus): daljši in debelejši
    const b = tocka(-0.15, Math.PI * 1.62, 0.002), n = b.clone().sub(v3(b.x, 0, 0)).normalize().addScaledVector(X, -0.25).normalize();
    o.position.copy(b); o.quaternion.setFromUnitVectors(Y, n); o.scale.set(2, 0.24, 2); o.updateMatrix();
    pili.setMatrixAt(pili.count++, o.matrix);
  }
  pilP.visible = false;
  telo.add(pili, pilP);
  const pilT = pilA.filter((t) => t.n.dot(KAM) > 0.6).map((t) => t.p.clone().addScaledVector(t.n, 0.07));
  del("pili", "Pili (fimbrije)", "Kratki tanki laski na površini, s katerimi se bakterija prime podlage ali drugih celic; daljši spolni pilus služi za prenos plazmidov.", "#7fd8c4", [pili, pilP], (pilT[0] || v3(0, -0.3, 0.2)).toArray());

  // še več ribosomov kot sijoče kroglice (brez trikotnikov; na telefonu jih je kot primerkov malo)
  const ribPike = [];
  for (let p = 0; ribPike.length < (hi ? 900 : 1700) && p < 100000; p++) {
    smer.set((rnd() * 2 - 1) * (H + RB), (rnd() * 2 - 1) * RB, (rnd() * 2 - 1) * RB);
    if (vCeli(smer, Z.im1 + 0.01) && !izrezan(smer, 0) && !(vNuk(smer) && rnd() < 0.94)) ribPike.push(smer.clone());
  }
  const ribPt = V.pike(ribPike, B.ribosomi, hi ? 0.011 : 0.013, 0.4);
  telo.add(ribPt);
  deli.find((d) => d.id === "ribosomi").meshes.push(ribPt); // točke dobijo tudi učbeniško barvo

  // drobna zrnca v citoplazmi (encimi, beljakovinski kompleksi): majhna in temna
  const zrnT = [];
  for (let p = 0; zrnT.length < (hi ? 3600 : 1400) && p < 100000; p++) {
    smer.set((rnd() * 2 - 1) * (H + RB), (rnd() * 2 - 1) * RB, (rnd() * 2 - 1) * RB);
    if (vCeli(smer, Z.im1 + 0.006) && !izrezan(smer, 0.004)) zrnT.push(smer.clone());
  }
  telo.add(V.pike(zrnT, 0x7a68d0, 0.0042, 0.5));

  // ---------- nadzor ----------
  let rez = true, kap = true;
  const vsiDeli = deli.slice();
  const posodobi = () => {
    for (const x of [omG, pgG, imG, cG, kG]) x.rez(rez);
    omRez.visible = pgRez.visible = imRez.visible = peri.visible = motor.visible = rez;
    lpsP.visible = poriniP.visible = pilP.visible = !rez;
    kapsula.visible = kap;
    deli = vsiDeli.filter((d) => (d.id !== "kapsula" || kap) && (!["bazalno-telo", "membrana", "periplazma"].includes(d.id) || rez));
  };
  const nadzor = [
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez", ob: (v) => { rez = v !== "cela"; posodobi(); } },
    { tip: "stikalo", id: "kapsula", oznaka: "Pokaži kapsulo", vrednost: true, ob: (v) => { kap = !!v; posodobi(); } },
  ];
  if (zac.prikaz) { nadzor[0].vrednost = zac.prikaz; rez = zac.prikaz !== "cela"; }
  if (zac.kapsula === false || zac.kapsula === "false" || zac.kapsula === 0) { nadzor[1].vrednost = false; kap = false; }
  posodobi();

  const qr = new THREE.Quaternion();
  // rahle razlike v svetlosti med ponovljenimi deli
  {
    const c = new THREE.Color();
    group.traverse((m) => {
      if (!m.isInstancedMesh || m.instanceColor) return;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const kk = 0.86 + 0.24 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(kk, kk, kk)); }
    });
  }

  V.poliraj(group, vsiDeli, {
    "zunanja-membrana": { tex: "fino", rf: 300, k: 0.5, ton: 0.6 },
    "celicna-stena": { tex: "fino", rf: 260, k: 0.7, b: 0.2, lisa: 0.1, f: 20 },
    membrana: { tex: "zrna", rf: 130, k: 1, b: 0.2, s: 0.18 },
    citoplazma: { tex: "fino", rf: 120, k: 1.1, b: 0.24, lisa: 0.22, f: 8,
      ao: (p) => 0.78 + 0.22 * Math.min(1, Math.max(0, 0.5 + 0.8 * (p.y + p.z) / (Math.hypot(p.y, p.z) * 1.42 || 1))) },
    nukleoid: { rf: 600, k: 0.4 },
    plazmidi: { rf: 600, k: 0.4 },
    zaloge: { tex: "zrna", rf: 180, k: 1.1, b: 0.22 },
    ribosomi: { tex: null },
    mrnk: { tex: null },
    citoskelet: { tex: null },
    bicki: { tex: "fino", rf: 400, k: 0.5 },
    "bazalno-telo": { rf: 300, k: 0.5 },
    pili: { tex: null },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(vsiDeli, { "zunanja-membrana": "#b0609a", periplazma: "#f2e6c4", zaloge: "#ece6f4", mrnk: "#f08a2a", "bazalno-telo": "#8a5a2a" }));

  return {
    group,
    get deli() { return deli; },
    nadzor,
    oder: "celica",
    // lastni kader: škatla z bički v kotih bi celico pomanjšala; vidni obris (v projekciji) je manjši
    okvir: { sredisce: [0, 0, 0], polmer: 0.8 },
    pogled: [-0.36, 0.52, 0.78],
    korak(t) {
      if (!gib) return;
      bicki.forEach((b, i) => { qr.setFromAxisAngle(Y, -t * 5 - i); b.quaternion.copy(b.userData.q0).multiply(qr); });
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
