// Paramecij (copatkar, Paramecium caudatum): migetalkar v obliki copata; odrezan klin vzdolž celice pokaže notranjost.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-paramecij",
  naslov: "Paramecij (copatkar)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Enocelični migetalkar iz mlakuž, dolg okoli četrt milimetra. Plava z migetalkami, hrano pa mu v celična usta nažene ustna kotanja. Migetalk je zaradi preglednosti manj kot v resnici (okoli 5000).",
  poskusi: "Poišči oba krčljiva mehurčka in ustno kotanjo.",
  merilo: { m: 250e-6, oznaka: "250 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  const V = videzCelic(THREE, { hi, odpad });
  let seme = 61;
  // ---------- orodja (enaka kot v zivalska.js, z dodatki za ploskve in prereze) ----------
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const { sum } = V;
  const gladko = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  // mat(barva, {…}): mokra organska površina (relief in vlažen videz doda V.poliraj na koncu).
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.22,
      sheen: 0.35, sheenColor: new THREE.Color(barva).lerp(new THREE.Color(0xffffff), 0.45).multiplyScalar(0.8), sheenRoughness: 0.45,
    }, o));
    odpad.push(m);
    return m;
  }
  // ---------- debele membrane (debelina je povečana, da je vidna) ----------
  // Plasti na prerezu od notranje (s = 0) do zunanje strani (s = 1): [s0, s1, barva].
  const _bela = new THREE.Color(0xffffff);
  // dvojna ovojnica (jedro, mitohondrij): dva dvosloja z ozkim presledkom med njima
  const DVOJNA = (b, vmes) => { const c = new THREE.Color(b), g = c.clone().multiplyScalar(0.55), r = c.clone().lerp(_bela, 0.35), v = new THREE.Color(vmes); return [[0, 0.07, g], [0.12, 0.24, r], [0.29, 0.31, g], [0.38, 0.62, v], [0.69, 0.71, g], [0.76, 0.88, r], [0.93, 1, g]]; };
  function barvaPlasti(plasti, s, out) {
    for (let i = 0; i < plasti.length; i++) {
      const [a, b, c] = plasti[i];
      if (s <= b + 1e-6) return s >= a - 1e-6 || i === 0 ? out.copy(c) : out.copy(plasti[i - 1][2]).lerp(c, (s - plasti[i - 1][1]) / (a - plasti[i - 1][1]));
    }
    return out.copy(plasti[plasti.length - 1][2]);
  }
  const vrsticePlasti = (plasti) => [...new Set(plasti.flatMap(([a, b]) => [a, b]).concat([0, 1]).map((x) => Math.round(x * 1000) / 1000))].sort((a, b) => a - b);
  // Trak prereza med dvema krivuljama: A[i] (notranja) in B[i] (zunanja), normala n; pora(t) → barva pore ali null.
  function trakPlasti(A, B, n, plasti, pora) {
    const S = vrsticePlasti(plasti), C = A.length, pos = [], nor = [], col = [], idx = [], c = new THREE.Color(), p = new THREE.Vector3();
    for (let j = 0; j < S.length; j++) for (let i = 0; i < C; i++) {
      p.copy(A[i]).lerp(B[i], S[j]); pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z);
      const pc = pora && pora(i / (C - 1));
      if (pc && S[j] > 0.01 && S[j] < 0.99) c.copy(pc); else barvaPlasti(plasti, S[j], c);
      col.push(c.r, c.g, c.b);
    }
    // zavoj trikotnikov naj se ujema z normalo
    const m = Math.floor(C / 2), e1 = new THREE.Vector3().subVectors(A[Math.min(C - 1, m + 1)], A[Math.max(0, m - 1)]), e2 = new THREE.Vector3().subVectors(B[m], A[m]);
    const obrni = e1.cross(e2).dot(n) < 0;
    for (let j = 0; j < S.length - 1; j++) for (let i = 0; i < C - 1; i++) {
      const a = j * C + i, b = a + 1, d = a + C, e = d + 1;
      if (obrni) idx.push(a, d, b, b, d, e); else idx.push(a, b, d, b, e, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    return g;
  }
  function zdruziPlasti(geos) {
    const pos = [], nor = [], col = [], idx = []; let off = 0;
    for (const g of geos) {
      const p = g.attributes.position, n = g.attributes.normal, cc = g.attributes.color;
      for (let k = 0; k < p.count; k++) { pos.push(p.getX(k), p.getY(k), p.getZ(k)); nor.push(n.getX(k), n.getY(k), n.getZ(k)); col.push(cc.getX(k), cc.getY(k), cc.getZ(k)); }
      for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      off += p.count; g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    out.setIndex(idx);
    return out;
  }
  // pore jedrne ovojnice: na prerezu presledki v obeh membranah na približno enakih razdaljah
  const porePrereza = (n, barva) => { const c = new THREE.Color(barva); return (t, k) => (Math.abs(((t * n + k * 0.37) % 1) - 0.5) < 0.045 && t > 0.04 && t < 0.96 ? c : null); };
  const matPlasti = (o = {}) => mat(0xffffff, Object.assign({ vertexColors: true, roughness: 0.5, clearcoat: 0.5, clearcoatRoughness: 0.3, sheen: 0.2, side: THREE.DoubleSide }, o));
  // Združi geometrije (z index ali brez) v eno; po želji pobarva vsako z barvo oglišč.
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], idx = [], uv = [];
    let off = 0;
    geos.forEach((g, i) => {
      const tu = g.attributes.uv, p = g.attributes.position, n = g.attributes.normal, gc = g.attributes.color;
      const c = barve && barve[i] != null ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (tu) uv.push(tu.getX(k), tu.getY(k)); else { const x = p.getX(k), y = p.getY(k), zz = p.getZ(k); uv.push(0.5 + Math.atan2(zz, x) / (2 * Math.PI), 0.5 + Math.asin(Math.max(-1, Math.min(1, y / (Math.hypot(x, y, zz) || 1)))) / Math.PI); }
        if (c) col.push(c.r, c.g, c.b);
        else if (barve) { if (gc) col.push(gc.getX(k), gc.getY(k), gc.getZ(k)); else col.push(1, 1, 1); }
      }
      if (g.index) for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      else for (let k = 0; k < p.count; k++) idx.push(k + off);
      off += p.count;
      g.dispose();
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    out.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    if (barve) out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    out.setIndex(idx);
    return out;
  }
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }
  // Ploskev iz parametrov: P(u, v, izhod) za več krp [u0, u1, nu, v0, v1, nv] v eni geometriji.
  // Normale računa numerično iz P, zato se krpe zlepijo brez šivov; geo.userData.osvezi(P) premakne oglišča.
  function ploskev(P, krpe, obrni = false) {
    const pos = [], idx = [], uv = [];
    let off = 0;
    for (const [u0, u1, nu, v0, v1, nv] of krpe) {
      for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) uv.push(u0 + (u1 - u0) * i / nu, v0 + (v1 - v0) * j / nv);
      for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
        const a = off + i * (nv + 1) + j, b = a + nv + 1, c = b + 1, d = a + 1;
        if (obrni) idx.push(a, d, b, b, d, c); else idx.push(a, b, d, b, c, d);
      }
      off += (nu + 1) * (nv + 1);
    }
    const n = uv.length / 2;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    g.setIndex(idx);
    const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), D = new THREE.Vector3(), E = new THREE.Vector3(), N = new THREE.Vector3();
    g.userData.uv = uv;
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.userData.osvezi = (Pf) => {
      const p = g.attributes.position.array, no = g.attributes.normal.array, e = 1e-3;
      for (let k = 0; k < n; k++) {
        const u = uv[2 * k], v = uv[2 * k + 1];
        Pf(u, v, A);
        p[3 * k] = A.x; p[3 * k + 1] = A.y; p[3 * k + 2] = A.z;
        Pf(u + e, v, B); Pf(u - e, v, C); B.sub(C);
        Pf(u, v + e, C); Pf(u, v - e, D); C.sub(D);
        N.crossVectors(B, C);
        for (let t = 0, eu = e; t < 4 && N.lengthSq() < 1e-14; t++) {
          // izrojena točka (pol, konica): smer v vzemi na sosednjih krogih
          eu *= 6;
          Pf(u + eu, v, B); Pf(u - eu, v, C); B.sub(C);
          Pf(u + eu, v + e, C); Pf(u + eu, v - e, D); C.sub(D);
          Pf(u - eu, v + e, D); Pf(u - eu, v - e, E); D.sub(E); C.add(D);
          N.crossVectors(B, C);
        }
        if (N.lengthSq() < 1e-16) N.copy(A).normalize();
        N.normalize();
        if (obrni) N.negate();
        no[3 * k] = N.x; no[3 * k + 1] = N.y; no[3 * k + 2] = N.z;
      }
      g.attributes.position.needsUpdate = true;
      g.attributes.normal.needsUpdate = true;
      g.computeBoundingSphere();
    };
    g.userData.osvezi(P);
    return g;
  }
  // Barve oglišč iz funkcije položaja (x, y, z, u, v) -> THREE.Color.
  function pobarvaj(g, f) {
    const p = g.attributes.position, uv = g.userData.uv || [];
    const col = new Float32Array(p.count * 3), c = new THREE.Color();
    for (let k = 0; k < p.count; k++) {
      f(p.getX(k), p.getY(k), p.getZ(k), uv[2 * k], uv[2 * k + 1], c);
      col[3 * k] = c.r; col[3 * k + 1] = c.g; col[3 * k + 2] = c.b;
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return g;
  }
  // Trak med dvema nizoma točk (enako dolgima): ploskev prereza med dvema plastema.
  function pas(A, B) {
    const pos = [], idx = [];
    for (let i = 0; i < A.length; i++) pos.push(A[i].x, A[i].y, A[i].z, B[i].x, B[i].y, B[i].z);
    for (let i = 0; i < A.length - 1; i++) { const a = 2 * i; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Premakni oglišča s funkcijo f(v: Vector3) (spremeni v na mestu) in preračunaj normale.
  function preoblikuj(g, f) {
    const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); f(v, i); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
  const o = new THREE.Object3D();
  // InstancedMesh iz seznama {p, r (Euler ali Quaternion), s (število ali Vector3)}.
  function instance(geo, material, sez) {
    const m = new THREE.InstancedMesh(geo, material, Math.max(1, sez.length));
    m.count = sez.length;
    postaviInstance(m, sez);
    return m;
  }
  function postaviInstance(m, sez) {
    sez.forEach((x, i) => {
      o.position.copy(x.p);
      if (x.r && x.r.isQuaternion) o.quaternion.copy(x.r); else if (x.r) o.rotation.copy(x.r); else o.rotation.set(0, 0, 0);
      if (x.s == null) o.scale.setScalar(1); else if (typeof x.s === "number") o.scale.setScalar(x.s); else o.scale.copy(x.s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere && m.computeBoundingSphere();
  }

  // ---------- oblika copata ----------
  // 1 enota = 125 µm; dolžina 1,8 enote (225 µm). Os x: spredaj (+x) top, zadaj (−x) bolj koničast.
  // u ∈ [0, 1] vzdolž telesa, v okoli osi (y = cos v, z = sin v). Klin v ∈ (0, π/2) (y > 0, z > 0) je odrezan.
  const DL = 1.8, R = 0.215, TAU = Math.PI * 2;
  const V_UST = 2.15; // trebušna stran z ustno kotanjo (spredaj spodaj, proti gledalcu)
  const profil = (u) => R * Math.pow(Math.sin(Math.PI * Math.pow(Math.min(1, Math.max(0, u)), 0.88)), 0.62) * (1 + 0.1 * Math.sin(Math.PI * u * 2 - 0.6));
  const vUst = (u) => V_UST + 0.55 * (u - 0.5); // kotanja se vije
  const globina = (u, v) => {
    const g = gladko(0.44, 0.52, u) * (1 - gladko(0.82, 0.95, u)) * (0.04 + 0.07 * (1 - (u - 0.5) / 0.45));
    let dv = v - vUst(u); dv -= TAU * Math.round(dv / TAU);
    return g * Math.exp(-(dv * dv) / (0.36 * 0.36));
  };
  // položaj na plasti z odmikom d (navznoter)
  function telo(u, v, d, out) {
    const r = Math.max(0, profil(u) - d - globina(u, v) * (1 - d * 8) + 0.004 * sum(u * 14, Math.cos(v) * 2, Math.sin(v) * 2));
    const x = (-DL / 2 + DL * u) * (1 - (d * 2) / DL);
    // rahlo upognjen hrbet (copat)
    const upogib = 0.035 * Math.sin(Math.PI * u);
    return out.set(x, r * Math.cos(v) * 0.96 + upogib, r * Math.sin(v) * 1.04);
  }
  const P = (d) => (u, v, out) => telo(u, v, d, out);
  const D_EKTO = 0.034;
  const KLIN = [0, Math.PI / 2];
  const odprta = (nu, nv) => [[0, 1, nu, Math.PI / 2, TAU, Math.round(nv * 0.75)]];
  const pokrov = (nu, nv) => [[0, 1, nu, 0, Math.PI / 2, Math.round(nv * 0.25)]];
  const robT = (d, v, n = q(110)) => { const a = []; for (let i = 0; i <= n; i++) a.push(telo(i / n, v, d, new THREE.Vector3())); return a; };

  // ---------- pelikula, ektoplazma, endoplazma ----------
  const pelMat = mat(0xd9c6e8, { roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.25, sheen: 0.8, sheenColor: new THREE.Color(0xf4ecff) });
  const pelGeo = ploskev(P(0), odprta(q(170), q(100)), true);
  const pelPGeo = ploskev(P(0), pokrov(q(170), q(100)), true);
  for (const g of [pelGeo, pelPGeo]) pobarvaj(g, (x, y, z, u, v, c) => {
    // vrste migetalk (kinete) kot nežne proge
    const pr = 0.5 + 0.5 * Math.cos(v * 44 + u * 6);
    c.set(0xb9a2d2).lerp(new THREE.Color(0x7e62a4), 0.3 * pr + 0.2 * (0.5 + 0.5 * sum(u * 30, v * 3, 1)));
  });
  // pelikula je steklena (prosojna s svetlim robom), da se skoznjo vidi notranjost; vrste migetalk dajo migetalke same
  const pelMatV = V.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.16, rf: 38, k: 1, tex: "gube", rob: "#8c9cff", rk: 1.3 });
  odpad.splice(odpad.indexOf(pelMat), 1); pelMat.dispose();
  const pelikula = new THREE.Mesh(pelGeo, pelMatV);
  const pelPokrov = new THREE.Mesh(pelPGeo, pelMatV);
  pelPokrov.visible = false;
  // plasti na ploskvah reza: trak med notranjo (A) in zunanjo (B) krivuljo, normala iz ploskve
  const trakMed = (A, B, plasti, pora) => { const m = Math.floor(A.length / 2); return trakPlasti(A, B, new THREE.Vector3().subVectors(A[m + 1], A[m - 1]).cross(new THREE.Vector3().subVectors(B[m], A[m])).normalize(), plasti, pora); };
  // pelikula: celična membrana in pod njo ploščati mešički (alveoli); debelina je povečana
  const pelRez = new THREE.Mesh(zdruziPlasti(KLIN.map((v) => trakMed(robT(0.009, v), robT(0, v), DVOJNA(0x6b3fc8, 0xbfeef7)))), matPlasti({ roughness: 0.45, clearcoat: 0.5 }));
  const ektoRez = new THREE.Mesh(zdruzi([pas(robT(0.008, 0), robT(D_EKTO, 0)), pas(robT(0.008, Math.PI / 2), robT(D_EKTO, Math.PI / 2))]),
    mat(0x8fb4dc, { roughness: 0.3, clearcoat: 0.7, side: THREE.DoubleSide }));
  const endGeo = ploskev(P(D_EKTO), odprta(q(130), q(80)), true);
  pobarvaj(endGeo, (x, y, z, u, v, c) => { const t = 0.5 + 0.5 * sum(x * 60, y * 60, z * 60); c.setScalar(1 - 0.64 * gladko(0.5, 0.78, t) * 0.75); });
  // odtenek je v barvi materiala, barve oglišč le senčijo (tako stikalo učbeniških barv doseže tudi svetlo barvo)
  const endoplazma = new THREE.Mesh(endGeo, mat(0x4b3d9a, { vertexColors: true, roughness: 0.68, clearcoat: 0.15, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide }));
  group.add(pelikula, pelPokrov, pelRez, ektoRez, endoplazma);

  // ---------- trihociste: vretenca v ektoplazmi (vidna na ploskvah reza) ----------
  const triSez = [];
  for (const v of [0, Math.PI / 2]) for (let u = 0.04; u < 0.97; u += 0.019) {
    const a = telo(u, v, 0.009, new THREE.Vector3()), b = telo(u, v, D_EKTO - 0.003, new THREE.Vector3());
    const smer = b.clone().sub(a), dl = smer.length();
    if (dl < 0.012) continue;
    // malo pred ravnino reza, da so vidne
    const zamik = v === 0 ? new THREE.Vector3(0, 0, 0.003) : new THREE.Vector3(0, 0.003, 0);
    triSez.push({ p: a.clone().lerp(b, 0.5).add(zamik), r: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), smer.normalize()), s: new THREE.Vector3(1, dl / 0.028, 1) });
  }
  const trihociste = instance(new THREE.CylinderGeometry(0.0035, 0.0035, 0.028, q(6), 1).scale(1, 1, 1), mat(0x7fb0ff, { roughness: 0.3, clearcoat: 0.8, sheen: 0.3, emissive: new THREE.Color(0x10204a) }), triSez);
  // vretenasta oblika: zoži konca
  preoblikuj(trihociste.geometry, (v) => { const k = 1 - Math.pow(Math.abs(v.y) / 0.014, 2) * 0.75; v.x *= k; v.z *= k; });
  group.add(trihociste);

  // ---------- ustna kotanja in celična usta s požiralnikom ----------
  const kotGeo = ploskev((u, v, out) => { telo(u, v, -0.0015, out); return out; }, [[0.45, 0.93, q(60), V_UST - 0.75, V_UST + 0.85, q(26)]], true);
  pobarvaj(kotGeo, (x, y, z, u, v, c) => { const g = globina(u, v) / 0.09; c.set(0x8a6ad8).lerp(new THREE.Color(0x3d2a80), Math.min(1, g * 1.6)); });
  const kotMat = mat(0xffffff, { vertexColors: true, roughness: 0.46, clearcoat: 0.5, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const kotanja = new THREE.Mesh(kotGeo, kotMat);
  group.add(kotanja);
  const U_USTA = 0.49, ustaT = telo(U_USTA, vUst(U_USTA), 0, new THREE.Vector3());
  const pozK = [ustaT.clone(), telo(0.47, vUst(0.47), 0.06, new THREE.Vector3()), new THREE.Vector3(-0.08, -0.05, 0.05), new THREE.Vector3(-0.15, -0.02, 0.02)];
  const pozCurve = new THREE.CatmullRomCurve3(pozK);
  const pozGeo = new THREE.TubeGeometry(pozCurve, q(30), 0.02, q(14), false);
  preoblikuj(pozGeo, (v, i) => { const t = Math.floor(i / (q(14) + 1)) / q(30); const c = pozCurve.getPointAt(t); v.sub(c).multiplyScalar(1.5 - t * 0.9).add(c); });
  const ustaMat = mat(0x4a2f8a, { roughness: 0.4, clearcoat: 0.7, side: THREE.DoubleSide });
  const usta = new THREE.Mesh(zdruzi([pozGeo, new THREE.TorusGeometry(0.028, 0.006, q(6), q(18)).lookAt(new THREE.Vector3(0, -0.5, 0.86)).translate(ustaT.x, ustaT.y, ustaT.z)]), ustaMat);
  usta.geometry.computeBoundingSphere();
  group.add(usta);

  // ---------- makronukleus (prerezan) in mikronukleus ----------
  const MK = new THREE.Vector3(0.04, 0.0, -0.035);
  const mk = (d) => (u, v, out) => {
    // fižolasto: elipsoid, upognjen okoli osi z
    const a = Math.PI * u, s = Math.sin(a);
    const rx = 0.23 - d, ry = (0.085 - d) * s, rz = (0.075 - d) * s;
    const x = -rx * Math.cos(a), bend = 0.05 * (1 - Math.pow(x / 0.23, 2));
    const k = 1 + 0.03 * sum(u * 9, Math.cos(v) * 2, Math.sin(v) * 2);
    return out.set(MK.x + x, MK.y + ry * k * Math.cos(v) - bend, MK.z + rz * k * Math.sin(v));
  };
  const mkMat = mat(B.jedro, { roughness: 0.32, clearcoat: 0.85, sheen: 0.4, sheenColor: new THREE.Color(B.nukleoplazma) });
  const mkGeoO = ploskev(mk(0), [[0, 1, q(60), Math.PI / 2, TAU, q(36)]], true);
  const makro = new THREE.Mesh(mkGeoO, mkMat);
  const makroP = new THREE.Mesh(ploskev(mk(0), [[0, 1, q(60), 0, Math.PI / 2, q(12)]], true), mkMat);
  makroP.visible = false;
  const mkIn = ploskev(mk(0.009), [[0, 1, q(50), Math.PI / 2, TAU, q(30)]], true);
  pobarvaj(mkIn, (x, y, z, u, v, c) => { const t = 0.5 + 0.5 * sum(x * 90, y * 90, z * 90); c.set(B.nukleoplazma).lerp(new THREE.Color(B.kromatin), gladko(0.5, 0.75, t)); });
  const makroIn = new THREE.Mesh(mkIn, mat(0xffffff, { vertexColors: true, roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  const mkRob = (v) => { const a = []; for (let i = 0; i <= 40; i++) a.push(mk(0.003)(i / 40, v, new THREE.Vector3())); return a; };
  const mkKriv = (d, v) => { const a = []; for (let i = 0; i <= q(70); i++) a.push(mk(d)(i / q(70), v, new THREE.Vector3())); return a; };
  const makroRob = new THREE.Mesh(zdruziPlasti(KLIN.map((v) => trakMed(mkKriv(0.009, v), mkKriv(0, v), DVOJNA(B.ovojnica, 0xe8d6ff), porePrereza(9, 0xc48bff)))), matPlasti({ roughness: 0.58, clearcoat: 0.2 }));
  const mikro = new THREE.Mesh(preoblikuj(new THREE.SphereGeometry(0.03, q(20), q(14)), (v) => v.multiplyScalar(1 + 0.05 * sum(v.x * 80, v.y * 80, v.z * 80))), mat(B.kromatin, { roughness: 0.35, clearcoat: 0.8 }));
  mikro.position.set(MK.x + 0.03, MK.y - 0.03, MK.z - 0.085);
  group.add(makro, makroP, makroIn, makroRob, mikro);

  // ---------- krčljiva mehurčka z dovodnimi kanalčki (na hrbtni strani) ----------
  const V_HRBET = 5.05;
  const kmPol = [0.27, 0.74].map((u) => {
    const p = telo(u, V_HRBET, D_EKTO + 0.022, new THREE.Vector3());
    const pA = telo(u + 0.01, V_HRBET, D_EKTO + 0.022, new THREE.Vector3()), pB = telo(u, V_HRBET + 0.05, D_EKTO + 0.022, new THREE.Vector3());
    const t1 = pA.sub(p).normalize(), t2 = pB.sub(p).normalize();
    return { p, t1, t2 };
  });
  const kmSez = kmPol.map((k) => ({ p: k.p, s: 0.05 }));
  const krcljivi = instance(new THREE.SphereGeometry(1, q(24), q(16)), V.steklo(mat(B.vakuola), { a: 0.45, rf: 3, k: 0.3, rob: "#9ff0ff", rk: 1.3, difuzno: 0.6, iri: 0.3 }), kmSez);
  krcljivi.renderOrder = 4;
  const kanGeo = [], N_KAN = 8;
  const kanSez = [];
  kmPol.forEach((k, j) => {
    for (let i = 0; i < N_KAN; i++) {
      const a = (i / N_KAN) * TAU + j * 0.3;
      const smer = k.t1.clone().multiplyScalar(Math.cos(a)).addScaledVector(k.t2, Math.sin(a)).normalize();
      kanSez.push({ p: k.p.clone(), r: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), smer), s: new THREE.Vector3(1, 1, 1), j });
    }
  });
  {
    // kanalček: zožena cev dolžine 0,15 vzdolž +x
    const pts = [];
    for (let i = 0; i <= 6; i++) pts.push(new THREE.Vector3(0.02 + (i / 6) * 0.15, 0.006 * Math.sin(i), 0));
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(14), 0.007, q(7), false);
    preoblikuj(g, (v) => { const t = (v.x - 0.02) / 0.15; v.y *= 1.2 - t * 0.8; v.z *= 1.2 - t * 0.8; });
    kanGeo.push(g);
  }
  const kanalcki = instance(kanGeo[0], mat(0x5fd0de, { roughness: 0.18, clearcoat: 0.9 }), kanSez);
  group.add(krcljivi, kanalcki);
  function utrip(t) {
    kmPol.forEach((k, j) => {
      const f = ((t / 6) + j * 0.5) % 1; // kanalčki se polnijo, mehurček nabrekne in se izprazni ven
      const rv = f < 0.8 ? 0.02 + 0.04 * gladko(0.25, 0.8, f) : 0.06 * (1 - (f - 0.8) / 0.2) + 0.012;
      const kn = f < 0.8 ? 1.25 - 0.75 * gladko(0.3, 0.8, f) : 0.5 + 0.75 * gladko(0.8, 1, f);
      kmSez[j].s = rv;
      kanSez.forEach((x) => { if (x.j === j) x.s.set(1, kn, kn); });
    });
    postaviInstance(krcljivi, kmSez); postaviInstance(kanalcki, kanSez);
  }
  utrip(1);

  // ---------- prebavni mehurčki (krožijo s citoplazmo) ----------
  const kroz = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.15, -0.05, 0.04), new THREE.Vector3(-0.42, -0.06, 0.02), new THREE.Vector3(-0.62, 0.0, -0.04),
    new THREE.Vector3(-0.4, 0.06, -0.12), new THREE.Vector3(0.0, -0.02, -0.14), new THREE.Vector3(0.42, 0.04, -0.1),
    new THREE.Vector3(0.6, -0.02, -0.02), new THREE.Vector3(0.38, -0.08, 0.06), new THREE.Vector3(0.1, -0.1, 0.07),
  ].map((v) => v.multiply(new THREE.Vector3(1, 0.75, 0.75))), true);
  const N_PREB = hi ? 11 : 8;
  const preb = [];
  for (let i = 0; i < N_PREB; i++) preb.push({ f: i / N_PREB + rnd() * 0.03, s: 0.022 + rnd() * 0.02 });
  const prebavni = new THREE.InstancedMesh(preoblikuj(new THREE.SphereGeometry(1, q(18), q(12)), (v) => v.multiplyScalar(1 + 0.05 * sum(v.x * 3, v.y * 3, v.z * 3))),
    mat(0xffffff, { roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.1, sheen: 0.4 }), N_PREB);
  const _c = new THREE.Color(), _v = new THREE.Vector3();
  function postaviPreb(t) {
    preb.forEach((m, i) => {
      const f = (((m.f + t * 0.012) % 1) + 1) % 1;
      kroz.getPointAt(f, _v);
      // sveži mehurčki ob požiralniku so večji in zelenkasti, starejši manjši in rjavkasti
      o.position.copy(_v); o.rotation.set(0, 0, 0); o.scale.setScalar(m.s * (1.15 - 0.45 * f)); o.updateMatrix();
      prebavni.setMatrixAt(i, o.matrix);
      prebavni.setColorAt(i, _c.set(0x9fc46a).lerp(new THREE.Color(0xb07a4a), f));
    });
    prebavni.instanceMatrix.needsUpdate = true;
    if (prebavni.instanceColor) prebavni.instanceColor.needsUpdate = true;
    prebavni.computeBoundingSphere();
  }
  postaviPreb(0);
  group.add(prebavni);

  // ---------- migetalke ----------
  const cilGeo = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.045, 0), new THREE.Vector3(0, 0.07, 0.024)), hi ? 4 : 3, 0.0024, 3, false);
  const cil = [];
  const N_VRST = hi ? 104 : 46, N_VZD = hi ? 46 : 24;
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3(), vN = new THREE.Vector3(), M4 = new THREE.Matrix4();
  for (let i = 0; i < N_VRST; i++) for (let j = 0; j < N_VZD; j++) {
    const u = 0.015 + (j + (i % 2) * 0.5) / N_VZD * 0.97, v = (i / N_VRST) * TAU + u * 0.6; // kinete se rahlo vijejo
    if (u > 0.995) continue;
    telo(u, v, 0, vA); telo(u + 0.004, v, 0, vB); telo(u, v + 0.02, 0, vC);
    const au = vB.clone().sub(vA).normalize(), av = vC.clone().sub(vA).normalize();
    vN.crossVectors(av, au).normalize(); // navzven
    const nazaj = au.clone().negate();
    const x = new THREE.Vector3().crossVectors(vN, nazaj).normalize();
    const zz = new THREE.Vector3().crossVectors(x, vN);
    M4.makeBasis(x, vN, zz);
    const vk = (((v % TAU) + TAU) % TAU);
    cil.push({ p: vA.clone(), q0: new THREE.Quaternion().setFromRotationMatrix(M4), u, v: vk, s: (u < 0.05 ? 1.7 : 1) * (globina(u, vk) > 0.02 ? 1.25 : 1) * (0.9 + rnd() * 0.2) });
  }
  const migetalke = new THREE.InstancedMesh(cilGeo, mat(B.bicek, { roughness: 0.32, clearcoat: 0.8, sheen: 0.4, emissive: new THREE.Color(B.bicek).multiplyScalar(0.12) }), cil.length);
  const qR = new THREE.Quaternion(), X = new THREE.Vector3(1, 0, 0);
  let prerez = true;
  function postaviMigetalke(t) {
    cil.forEach((c, i) => {
      // metahrono valovanje: faza zamaknjena vzdolž telesa
      const th = 0.35 + 0.55 * Math.sin(t * 9 - c.u * 2 * Math.PI * 7 + c.v * 0.5);
      qR.setFromAxisAngle(X, th);
      o.position.copy(c.p); o.quaternion.copy(c.q0).multiply(qR);
      const skrit = prerez && c.v > -0.02 && c.v < Math.PI / 2 + 0.02;
      o.scale.setScalar(skrit ? 0.0001 : c.s); o.updateMatrix();
      migetalke.setMatrixAt(i, o.matrix);
    });
    migetalke.instanceMatrix.needsUpdate = true;
  }
  postaviMigetalke(0.4);
  migetalke.computeBoundingSphere();
  group.add(migetalke);

  // ---------- mitohondriji: številni, zlasti v ektoplazmi pod pelikulo ----------
  const vKlinu = (v) => { const w = ((v % TAU) + TAU) % TAU; return w > -0.03 && w < Math.PI / 2 + 0.03; };
  const mitSez = [], _p = new THREE.Vector3();
  for (let t = 0; mitSez.length < (hi ? 520 : 140) && t < 20000; t++) {
    const u = 0.05 + rnd() * 0.9, v = Math.PI / 2 + 0.06 + rnd() * (TAU - Math.PI / 2 - 0.12);
    const d = rnd() < 0.65 ? 0.013 + rnd() * (D_EKTO - 0.016) : D_EKTO + rnd() * Math.max(0.01, profil(u) * 0.7 - D_EKTO);
    telo(u, v, d, _p);
    if (_p.distanceTo(MK) < 0.12 || kmPol.some((k) => k.p.distanceTo(_p) < 0.07)) continue;
    mitSez.push({ p: _p.clone(), r: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3), s: 0.8 + rnd() * 0.45 });
  }
  const mitohondriji = instance(new THREE.CapsuleGeometry(0.0038, 0.01, 2, hi ? 7 : 5), mat(B.mitohondrij, { roughness: 0.3, clearcoat: 0.85 }), mitSez);
  group.add(mitohondriji);

  // ---------- celična zadnjična odprtina (citoprokt) na trebušni strani zadaj ----------
  const U_CP = 0.3, V_CP = V_UST - 0.1, cpT = telo(U_CP, V_CP, 0, new THREE.Vector3());
  const cpN = (() => { const a = telo(U_CP + 0.01, V_CP, 0, new THREE.Vector3()).sub(cpT), b = telo(U_CP, V_CP + 0.05, 0, new THREE.Vector3()).sub(cpT); return b.cross(a).normalize(); })();
  if (cpN.dot(cpT.clone().setX(0)) < 0) cpN.negate();
  const cpGeo = new THREE.TorusGeometry(0.02, 0.0045, q(8), q(24)).scale(1.9, 0.55, 1);
  const citoprokt = new THREE.Mesh(cpGeo, mat(0x3d2a80, { roughness: 0.35, clearcoat: 0.8 }));
  citoprokt.position.copy(cpT).addScaledVector(cpN, 0.001);
  citoprokt.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), cpN);
  { // daljša os reže vzdolž telesa
    const os = new THREE.Vector3(1, 0, 0).applyQuaternion(citoprokt.quaternion), zel = new THREE.Vector3(1, 0, 0).projectOnPlane(cpN).normalize();
    const kot = Math.atan2(os.clone().cross(zel).dot(cpN), os.dot(zel));
    citoprokt.rotateZ(kot);
  }
  group.add(citoprokt);

  // drobna zrnca v endoplazmi (majhna in temna)
  const prahT = [];
  for (let t = 0; prahT.length < (hi ? 3600 : 1400) && t < 30000; t++) {
    const u = 0.04 + rnd() * 0.92, v = Math.PI / 2 + 0.03 + rnd() * (TAU - Math.PI / 2 - 0.06);
    prahT.push(telo(u, v, D_EKTO + 0.004 + rnd() * Math.max(0, profil(u) - D_EKTO - 0.01), new THREE.Vector3()));
  }
  group.add(V.pike(prahT, 0x7a68d0, 0.0045, 0.5));
  void vKlinu;

  // ---------- deli ----------
  const T = (u, v, d) => telo(u, v, d, new THREE.Vector3()).toArray();
  del("pelikula", "Pelikula", "Čvrsta, a prožna ovojnica iz celične membrane in ploščatih mešičkov pod njo; parameciju daje stalno obliko copata. Debelina je povečana.", "#9fb4ff",
    [pelikula, pelPokrov, pelRez], T(0.3, 3.3, 0));
  del("migetalke", "Migetalke", "Tisoče kratkih dlačic, ki utripajo v valovih kot žito na vetru; poganjajo paramecij skozi vodo.", B.bicek,
    [migetalke], T(0.82, 3.9, -0.05));
  del("ektoplazma", "Ektoplazma", "Bistra zunanja plast citoplazme pod pelikulo, v kateri so trihociste, korenine migetalk in veliko mitohondrijev.", "#8fb4dc",
    [ektoRez], T(0.62, Math.PI / 2, 0.02));
  del("endoplazma", "Endoplazma", "Zrnata notranjost celice, ki počasi kroži in s seboj nosi prebavne mehurčke.", "#5b4bb0",
    [endoplazma], T(0.2, 3.6, D_EKTO + 0.001));
  del("trihociste", "Trihociste", "Vretenca pod površjem, ki ob nevarnosti izstrelijo dolge niti in odvrnejo plenilca.", "#7fb0ff",
    [trihociste], triSez[Math.round(triSez.length * 0.3)].p.toArray());
  del("ustna-kotanja", "Ustna kotanja", "Žleb na trebušni strani; migetalke v njem naganjajo bakterije in drobne delce hrane proti celičnim ustom.", "#8a6ad8",
    [kotanja], T(0.72, vUst(0.72), -0.002));
  del("celicna-usta", "Celična usta in požiralnik", "Odprtina na koncu ustne kotanje; hrana gre skozi požiralnik in se na njegovem dnu zapre v prebavni mehurček.", "#4a2f8a",
    [usta], pozK[2].toArray());
  del("makronukleus", "Makronukleus", "Veliko jedro z dvojno ovojnico in porami, ki upravlja vsakodnevno delovanje celice; ima veliko kopij genov.", B.jedro,
    [makro, makroP, makroRob], mk(0)(0.65, 3.5, new THREE.Vector3()).toArray());
  del("makronukleus-notranjost", "Notranjost makronukleusa", "V jedru so zgoščene niti DNK (kromatin), ki jih vidimo kot temnejša zrnca.", B.nukleoplazma,
    [makroIn], mk(0.008)(0.4, 0.6, new THREE.Vector3()).add(new THREE.Vector3(0, -0.04, -0.04)).toArray());
  del("mikronukleus", "Mikronukleus", "Majhno jedro z zalogo dedne snovi, ki je pomembno pri spolnem razmnoževanju (konjugaciji).", B.kromatin,
    [mikro], mikro.position.toArray());
  del("krcljivi-mehurcek", "Krčljiva mehurčka", "Zvezdasta mehurčka: kanalčki zbirajo odvečno vodo, mehurček nabrekne in jo iztisne iz celice. Delujeta izmenično.", B.vakuola,
    [krcljivi, kanalcki], kmPol[0].p.toArray());
  del("prebavni-mehurcki", "Prebavni mehurčki", "Mehurčki s hrano krožijo po celici; encimi hrano prebavijo, ostanki gredo ven skozi celično zadnjično odprtino.", "#9fc46a",
    [prebavni], kroz.getPointAt(0.45).toArray());
  del("mitohondriji", "Mitohondriji", "Številne drobne paličice, največ tik pod pelikulo; s celičnim dihanjem dajejo energijo za utripanje migetalk. Narisane so povečane.", B.mitohondrij,
    [mitohondriji], (mitSez.find((m) => m.p.z > 0.1 && m.p.y < 0) || mitSez[0]).p.toArray());
  del("citoprokt", "Celična zadnjična odprtina", "Mesto na pelikuli, kjer se prazen prebavni mehurček zlije z membrano in izloči neprebavljene ostanke hrane.", "#3d2a80",
    [citoprokt], cpT.toArray());

  // ---------- nadzor ----------
  let zadnjiT = 0;
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez",
      ob: (v) => {
        prerez = v !== "cela";
        pelPokrov.visible = makroP.visible = !prerez;
        for (const m of [pelRez, ektoRez, trihociste, makroRob]) m.visible = prerez;
        postaviMigetalke(zadnjiT + 0.4);
      },
    },
  ];
  if (ctx.zacetek && ctx.zacetek.prikaz) { nadzor[0].vrednost = ctx.zacetek.prikaz; nadzor[0].ob(ctx.zacetek.prikaz); }

  V.poliraj(group, deli, {
    pelikula: { tex: "fino", rf: 300, k: 0.4 },
    migetalke: { tex: null },
    ektoplazma: { tex: "fino", rf: 200, k: 0.8, b: 0.2 },
    endoplazma: { tex: "fino", rf: 60, k: 1.1, b: 0.24, lisa: 0.2, f: 8 },
    trihociste: { tex: null },
    "ustna-kotanja": { tex: "gube", rf: 120, k: 1, b: 0.22 },
    "celicna-usta": { rf: 120, k: 0.8 },
    makronukleus: { tex: "gube", rf: 40, k: 1.2, b: 0.22 },
    "makronukleus-notranjost": { tex: "fino", rf: 120, k: 1, b: 0.22 },
    mikronukleus: { rf: 200, k: 1 },
    "krcljivi-mehurcek": { tex: null },
    "prebavni-mehurcki": { tex: "zrna", rf: 120, k: 0.8 },
    mitohondriji: { tex: null },
    citoprokt: { tex: null },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(deli, { pelikula: "#e8809a", ektoplazma: "#f3ead8", endoplazma: "#e3c29a", trihociste: "#4f95e8", "ustna-kotanja": "#c98ab0", "celicna-usta": "#8a4a8a",
    makronukleus: "#9a6fe0", "makronukleus-notranjost": "#cdb8f5", mikronukleus: "#4a2fa3", "krcljivi-mehurcek": "#7ccdf0", "prebavni-mehurcki": "#e2b36c", citoprokt: "#8a4a8a" }));

  return {
    group,
    oder: "celica",
    pogled: [-0.39, 0.62, 0.68], // smer kamere: yaw −30°, pitch 38° – bolj od zgoraj, da se vidi v notranjost podolgovate celice
    // seznam delov kaže le dele, ki so v trenutnem prikazu vidni
    get deli() { return deli.filter((d) => d.meshes.some((m) => { for (let o = m; o; o = o.parent) if (!o.visible) return false; return true; })); },
    nadzor,
    korak(t) {
      if (!gib || !Number.isFinite(t)) return;
      zadnjiT = t;
      postaviMigetalke(t);
      utrip(t);
      postaviPreb(t);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
