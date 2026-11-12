// Nevron (živčna celica): celično telo v prerezu, dendriti, aksonski grič, akson z mielinsko ovojnico in končiči.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-nevron",
  naslov: "Nevron (živčna celica)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Gibalni nevron z dendriti, celičnim telesom v prerezu in aksonom z mielinsko ovojnico. Akson je močno skrajšan: v resnici je lahko dolg do 1 m, odsek med dvema Ranvierjevima zažemkoma pa meri okoli 1 mm.",
  poskusi: "Pritisni »Pošlji signal« in opazuj, kako signal skače med Ranvierjevimi zažemki.",
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

  // ---------- orodja (kot v zivalska.js) ----------
  let seme = 7;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const hash = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
  function sum(x, y, z) { // gladek 3D šum vrednosti, -1 … 1
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = x - xi, yf = y - yi, zf = z - zi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
    const l = (a, b, t) => a + (b - a) * t;
    const h = (a, b, c) => hash(xi + a, yi + b, zi + c);
    return 2 * l(l(l(h(0, 0, 0), h(1, 0, 0), u), l(h(0, 1, 0), h(1, 1, 0), u), v),
      l(l(h(0, 0, 1), h(1, 0, 1), u), l(h(0, 1, 1), h(1, 1, 1), u), v), w) - 1;
  }
  const fbm = (x, y, z) => sum(x, y, z) * 0.6 + sum(x * 2.1, y * 2.1, z * 2.1) * 0.3 + sum(x * 4.3, y * 4.3, z * 4.3) * 0.1;
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3,
      sheen: 0.5, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
    }, o));
    odpad.push(m);
    return m;
  }
  // Združi geometrije (z index ali brez) v eno; po želji pobarva vsako z barvo oglišč.
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], uv = [], idx = [];
    const zUv = geos.every((g) => g.attributes.uv);
    let off = 0;
    geos.forEach((g, i) => {
      const p = g.attributes.position, n = g.attributes.normal, t = g.attributes.uv;
      const c = barve ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (c) col.push(c.r, c.g, c.b);
        if (zUv) uv.push(t.getX(k), t.getY(k));
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
    if (zUv) out.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    out.setIndex(idx);
    return out;
  }
  function del(id, ime, opis, barva, meshes, tocka, seznam = deli) {
    meshes.forEach((m) => { m.userData.del = id; });
    seznam.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }
  // Odrezan osmi del: x < 0, y > 0, z > 0 (proti gledalcu levo zgoraj).
  const vIzrezu = (v, c = { x: 0, y: 0, z: 0 }) => v.x < c.x && v.y > c.y && v.z > c.z;
  // Lupina z odrezanim osmim delom; f(smer) vrne polmer v tej smeri.
  function lupina(f, ws, hs) {
    const zg = new THREE.SphereGeometry(1, ws, hs / 2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const pokr = new THREE.SphereGeometry(1, Math.round(ws / 4), hs / 2, 0, Math.PI / 2, 0, Math.PI / 2);
    const v = new THREE.Vector3();
    for (const g of [zg, sp, pokr]) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).normalize();
        v.multiplyScalar(f(v));
        p.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals();
    }
    return { odprta: zdruzi([zg, sp]), pokrov: pokr };
  }
  // Rob prereza: tri loki na meji odrezanega osmega dela.
  function rob(f, debelina, seg) {
    const loki = [
      (t) => new THREE.Vector3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)),
      (t) => new THREE.Vector3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0),
      (t) => new THREE.Vector3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)),
    ];
    return zdruzi(loki.map((L) => {
      const pts = [];
      for (let i = 0; i <= seg; i++) { const d = L(i / seg).normalize(); pts.push(d.multiplyScalar(f(d) * 0.99)); }
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, debelina, q(8), false);
    }));
  }
  // Cev s spremenljivim polmerom rF(t) vzdolž krivulje; zaobljena konca.
  function cev(krivulja, nSeg, rF, nRad, kape = true) {
    const fr = krivulja.computeFrenetFrames(nSeg, false);
    const pos = [], idx = [], P = new THREE.Vector3();
    for (let i = 0; i <= nSeg; i++) {
      krivulja.getPointAt(i / nSeg, P);
      const r = rF(i / nSeg), N = fr.normals[i], B = fr.binormals[i];
      for (let j = 0; j < nRad; j++) {
        const a = (j / nRad) * Math.PI * 2, c = Math.cos(a) * r, s = Math.sin(a) * r;
        pos.push(P.x + c * N.x + s * B.x, P.y + c * N.y + s * B.y, P.z + c * N.z + s * B.z);
      }
    }
    for (let i = 0; i < nSeg; i++) for (let j = 0; j < nRad; j++) {
      const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad), c = a + nRad, d = b + nRad;
      idx.push(a, b, c, b, d, c);
    }
    if (kape) {
      for (const [i, sg] of [[0, -1], [nSeg, 1]]) {
        krivulja.getPointAt(i / nSeg, P);
        const T = fr.tangents[i], r = rF(i / nSeg), c = pos.length / 3;
        pos.push(P.x + T.x * r * 0.6 * sg, P.y + T.y * r * 0.6 * sg, P.z + T.z * r * 0.6 * sg);
        for (let j = 0; j < nRad; j++) {
          const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad);
          if (sg < 0) idx.push(c, b, a); else idx.push(c, a, b);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Vrtenina okoli osi y iz profila [[y, r], …] (y narašča); odprta = brez četrtine x < 0, z > 0.
  function vrtenina(prof, n, odprto = true) {
    const pts = prof.map(([y, r]) => new THREE.Vector2(Math.max(r, 1e-4), y));
    if (!odprto) return { cela: new THREE.LatheGeometry(pts, n, 0, Math.PI * 2) };
    return {
      odprta: new THREE.LatheGeometry(pts, Math.round(n * 0.75), 0, Math.PI * 1.5),
      pokrov: new THREE.LatheGeometry(pts, Math.max(3, Math.round(n * 0.25)), Math.PI * 1.5, Math.PI * 0.5),
    };
  }
  // Rob prereza vrtenine: cevki po profilu pri kotih 0 in 1,5π.
  function robVrtenine(prof, debelina) {
    return zdruzi([0, Math.PI * 1.5].map((f) => {
      const pts = prof.map(([y, r]) => new THREE.Vector3(r * Math.sin(f), y, r * Math.cos(f)));
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 2, debelina, q(6), false);
    }));
  }
  // Ploskvi prereza vrtenine (kota 0 in 1,5π) med polmeroma rNot(y) in rZun(y); uv.x teče od notranjega do zunanjega roba.
  function ploskviPrereza(prof, rNot, nPrecno) {
    const geos = [];
    for (const f of [0, Math.PI * 1.5]) {
      const pos = [], uv = [], idx = [];
      prof.forEach(([y, r], i) => {
        const r0 = Math.min(rNot(y), r);
        for (let j = 0; j <= nPrecno; j++) {
          const rr = r0 + (r - r0) * (j / nPrecno);
          pos.push(rr * Math.sin(f), y, rr * Math.cos(f));
          uv.push(j / nPrecno, i / (prof.length - 1));
        }
      });
      const w = nPrecno + 1;
      for (let i = 0; i < prof.length - 1; i++) for (let j = 0; j < nPrecno; j++) {
        const a = i * w + j;
        idx.push(a, a + w, a + 1, a + 1, a + w, a + w + 1);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      geos.push(g);
    }
    return zdruzi(geos);
  }
  // Odstrani trikotnike, katerih težišče (v koordinatah skupine; M = matrika mreže v skupini) izpolni pogoj.
  function odrezi(g, pogoj, M = null) {
    const p = g.attributes.position, ix = g.index.array, ost = [], a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let i = 0; i < ix.length; i += 3) {
      a.fromBufferAttribute(p, ix[i]); b.fromBufferAttribute(p, ix[i + 1]); c.fromBufferAttribute(p, ix[i + 2]);
      a.add(b).add(c).multiplyScalar(1 / 3);
      if (M) a.applyMatrix4(M);
      if (!pogoj(a)) ost.push(ix[i], ix[i + 1], ix[i + 2]);
    }
    g.setIndex(ost);
    return g;
  }

  const o = new THREE.Object3D(), smer = new THREE.Vector3();
  const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const nakljucna = (s = 1) => v3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(s * 2);
  const nad = (d) => (t) => ({ p: t.p.addScaledVector(t.n, d), n: t.n });
  // steklena membrana izrastkov (vsak del svoj material, da stikalo učbeniških barv obarva vsakega posebej) in temna
  // notranja stena (zadnje ploskve iste mreže), da je izrastek »poln« citoplazme in ne prazna cev
  const steklo = (a = 0.2) => V.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a, rf: 150, k: 0.9, rob: B.membranaRob, rk: 1.3 });
  const notranja = () => mat(0x3d3180, { roughness: 0.62, clearcoat: 0.25, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide });

  // ---------- celično telo (soma): steklena membrana, v prerezu debel dvosloj ----------
  const S = v3(-0.5, 0.07, -0.02);
  const RS = 0.185;
  const osA = v3(1, -0.14, 0).normalize(); // smer aksona
  const kam = v3(-0.47, 0.34, 0.81).normalize(); // privzeta smer proti gledalcu
  const dSmeri = [
    [-0.92, 0.3, -0.25], [-0.55, -0.72, 0.42], [-0.15, 0.92, -0.38], [0.32, 0.82, 0.3],
    [0.12, -0.88, -0.45], [-0.62, -0.18, -0.76], [-0.86, -0.36, 0.36], [0.28, 0.32, -0.9],
  ].map(([x, y, z]) => v3(x, y, z).normalize());
  const oblS = (d) => {
    let b = 0;
    for (const u of dSmeri) b += 0.55 * Math.pow(Math.max(0, d.dot(u)), 7);
    b += 0.3 * Math.pow(Math.max(0, d.dot(osA)), 4);
    return RS * (1 + b + 0.045 * fbm(d.x * 2.2 + 1, d.y * 2.2, d.z * 2.2));
  };
  const soma = lupina(oblS, hi ? 120 : 56, hi ? 72 : 38);
  const somaMat = V.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.24, rf: 90, k: 0.9, rob: B.membranaRob, rk: 1.7, difuzno: 0.2 });
  const somaOut = new THREE.Mesh(soma.odprta, somaMat);
  const citMat = notranja();
  const MS = 0.93; // debelina membrane v prerezu (povečana): ≈ 7 % polmera some
  const somaInL = lupina((d) => oblS(d) * MS, hi ? 84 : 40, hi ? 52 : 26);
  somaInL.pokrov.dispose();
  const somaIn = new THREE.Mesh(somaInL.odprta, citMat);
  // polna ploskev prereza: temni glavi fosfolipidov, svetli repi; ob zunanjem robu svetla obroba
  const somaRobMat = mat(0xffffff, { vertexColors: true, roughness: 0.45, clearcoat: 0.5, side: THREE.DoubleSide });
  const somaRob = new THREE.Mesh(prerezPlasti(oblS, (d) => oblS(d) * MS, q(64), [[0, 0.1, 0x4a33a8], [0.1, 0.3, 0x7b5ce0], [0.3, 0.7, 0xe6e0ff], [0.7, 0.9, 0x7b5ce0], [0.9, 1, 0x4a33a8]]), somaRobMat);
  const somaObr = new THREE.Mesh(barvaj(rob(oblS, 0.0026, q(80)), 0xc8d2ff), somaRobMat);
  const somaPokrov = new THREE.Mesh(soma.pokrov, somaMat);
  somaPokrov.visible = false;
  for (const m of [somaOut, somaIn, somaRob, somaObr, somaPokrov]) { m.position.copy(S); group.add(m); }
  const naS = (x, y, z, f = 1) => { const d = v3(x, y, z).normalize(); return d.multiplyScalar(oblS(d) * f).add(S).toArray(); };
  // beljakovine v membrani (ionski kanalčki, črpalke, receptorji)
  const beljS = V.beljakovine(V.posej(somaOut, hi ? 520 : 80).map(nad(0.001)), B.beljakovine, 0.0042, { visina: 1.5 });
  const beljSP = V.beljakovine(V.posej(somaPokrov, hi ? 130 : 26).map(nad(0.001)), B.beljakovine, 0.0042, { visina: 1.5 });
  beljSP.visible = false;
  group.add(beljS, beljSP);

  // ---------- jedro z jedrcem in kromatinom (tudi prerezano) ----------
  const RJ = 0.074, J = S.clone().add(v3(0.01, -0.005, -0.015));
  const oblJ = (d) => RJ * (1 + 0.03 * sum(d.x * 2 + 5, d.y * 2, d.z * 2));
  const jl = lupina(oblJ, q(64), q(40));
  const jMat = mat(B.jedro, { roughness: 0.3 });
  const jOut = new THREE.Mesh(jl.odprta, jMat);
  const nukMat = mat(0xa565f0, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide });
  const jIn = new THREE.Mesh(jl.odprta.clone().scale(0.9, 0.9, 0.9), nukMat);
  // jedrna ovojnica: dve membrani (vsaka dvosloj) z ozkim presledkom med njima
  const jRobMat = mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide });
  const jRob = new THREE.Mesh(prerezPlasti(oblJ, (d) => oblJ(d) * 0.9, q(32), [[0, 0.14, 0x34107a], [0.14, 0.3, 0xc39af5], [0.3, 0.42, 0x6a2fd0], [0.42, 0.58, 0xe8d6ff], [0.58, 0.7, 0x6a2fd0], [0.7, 0.86, 0xc39af5], [0.86, 1, 0x34107a]]), jRobMat);
  const jObr = new THREE.Mesh(barvaj(rob(oblJ, 0.0016, q(48)), 0xb48cff), jRobMat);
  const jPokrov = new THREE.Mesh(jl.pokrov, jMat);
  jPokrov.visible = false;
  for (const m of [jOut, jIn, jRob, jObr, jPokrov]) { m.position.copy(J); group.add(m); }
  // jedrne pore: obročki beljakovin v ovojnici
  const pore = V.beljakovine(V.posej(jOut, hi ? 90 : 36).map(nad(0.0004)), B.ovojnica, 0.0034, { visina: 0.55, razp: 0.25 });
  group.add(pore);
  const jcGeo = new THREE.IcosahedronGeometry(0.026, hi ? 4 : 2);
  deformiraj(jcGeo, (v) => v.multiplyScalar(1 + 0.12 * fbm(v.x * 90, v.y * 90, v.z * 90)));
  const jedrce = new THREE.Mesh(jcGeo, mat(B.jedrce, { roughness: 0.55, clearcoat: 0.4 }));
  jedrce.position.copy(J).add(v3(-0.02, 0.02, 0.02));
  group.add(jedrce);
  // kromatin: nitke DNK z beljakovinami (nevron ima svetlo, »odprto« jedro z malo zgoščenega kromatina)
  const kromGeo = [];
  for (let i = 0; i < (hi ? 16 : 8); i++) {
    const pts = [];
    let p = nakljucna().normalize().multiplyScalar(RJ * (0.25 + 0.4 * rnd()));
    for (let j = 0; j < 7; j++) {
      p = p.clone().add(nakljucna(RJ * 0.2));
      if (p.length() > RJ * 0.8) p.setLength(RJ * 0.8);
      const w = p.clone();
      if (vIzrezu(w, { x: 0.004, y: -0.004, z: -0.004 })) w.x = Math.abs(w.x) + 0.004;
      if (w.distanceTo(jedrce.position.clone().sub(J)) < 0.03) w.addScaledVector(w.clone().normalize(), 0.02);
      pts.push(w.add(J));
    }
    kromGeo.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(28), 0.0017, hi ? 5 : 3, false));
  }
  const krom = new THREE.Mesh(zdruzi(kromGeo), mat(B.kromatin, { roughness: 0.5, clearcoat: 0.5 }));
  group.add(krom);

  // organeli ne zakrivajo jedra v privzetem pogledu (pred jedrom, gledano od kamere, jih ni)
  const predJedrom = (p) => { const d = p.clone().sub(J), t = d.dot(kam); return t > 0 && d.addScaledVector(kam, -t).length() < RJ + 0.012; };
  // točka p v somi je vidna skozi prerez, če pot proti kameri zapusti somo skozi odrezani del
  const vidnaS = (p) => { const x = p.clone().sub(S); for (let i = 0; i < 60; i++) { x.addScaledVector(kam, 0.006); if (x.length() > oblS(x.clone().normalize()) * MS) return vIzrezu(x); } return false; };
  const globina = (p) => 0.78 + 0.26 * Math.max(0, Math.min(1, 0.5 + p.clone().sub(S).dot(kam) / (RS * 1.6)));

  // ---------- Nisslova telesca: skladi upognjenih cistern zrnatega ER, posuti z ribosomi (ni jih v aksonskem griču) ----------
  const nisslGeo = zdruzi([-1.5, -0.5, 0.5, 1.5].map((s, k) => {
    const g = new THREE.SphereGeometry(1, q(10), q(5));
    deformiraj(g, (v) => {
      v.set(v.x * (0.018 - Math.abs(s) * 0.0015), v.y * 0.0026, v.z * (0.011 - Math.abs(s) * 0.001));
      v.y += s * 0.0058 + 2.4 * (v.x * v.x) * (1 - 0.2 * k) + 0.0012 * sum(v.x * 260 + k, v.z * 260, k);
    });
    return g;
  }));
  const nisslB = V.posej(new THREE.Mesh(nisslGeo), 90);
  const nNissl = hi ? 118 : 40;
  const nissl = new THREE.InstancedMesh(nisslGeo, mat(B.zer, { roughness: 0.4 }), nNissl);
  const nisslT = [], ribT = [];
  for (let k = 0, t = 0; k < nNissl && t < 20000; t++) {
    smer.copy(nakljucna()).normalize();
    if (smer.dot(osA) > 0.7) continue;
    const r = RJ + 0.02 + rnd() * (oblS(smer) * 0.88 - RJ - 0.025);
    o.position.copy(smer).multiplyScalar(r).add(S);
    if (o.position.distanceTo(J) < RJ + 0.03) continue;
    if (predJedrom(o.position)) continue;
    o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.scale.setScalar(0.7 + rnd() * 0.6); o.updateMatrix();
    nissl.setMatrixAt(k, o.matrix);
    const g = globina(o.position) * (0.9 + 0.2 * rnd()); nissl.setColorAt(k++, new THREE.Color(g, g, g));
    if (vIzrezu(smer)) nisslT.push(o.position.clone());
    for (let i = 0; i < (hi ? 18 : 9); i++) { const b = nisslB[Math.floor(rnd() * nisslB.length)]; ribT.push(b.p.clone().addScaledVector(b.n, 0.0011).applyMatrix4(o.matrix)); }
  }
  group.add(nissl);
  // prosti ribosomi (poliribosomi) v citoplazmi
  for (let i = 0, p = 0; i < (hi ? 1300 : 500) && p < 40000; p++) {
    const d = nakljucna().normalize(), x = d.clone().multiplyScalar(oblS(d) * MS * Math.cbrt(rnd()) * 0.96);
    if (vIzrezu(x) || x.distanceTo(J.clone().sub(S)) < RJ * 1.1) continue;
    ribT.push(x.add(S)); i++;
  }
  const ribosomi = V.pike(ribT, B.ribosomi, 0.0042, 0.35, { lovi: true });
  group.add(ribosomi);

  // ---------- Golgijev aparat ob jedru (nevroni ga imajo izrazitega) ----------
  const golGeo = zdruzi([0, 1, 2, 3, 4].map((k) => {
    const g = new THREE.SphereGeometry(1, q(16), q(6));
    const w = 0.027 - k * 0.0022;
    return deformiraj(g, (v) => { v.set(v.x * w, v.y * 0.0021, v.z * w * 0.5); v.y += k * 0.0055 - 15 * v.x * v.x - 9 * v.z * v.z; });
  }));
  const golgi = new THREE.Mesh(golGeo, mat(B.golgi, { roughness: 0.32 }));
  const G = J.clone().add(v3(0.019, 0.106, -0.03));
  golgi.position.copy(G);
  golgi.quaternion.setFromUnitVectors(v3(0, 1, 0), G.clone().sub(J).normalize());
  group.add(golgi);
  const golMes = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.0042, hi ? 1 : 0), mat(B.mesicki, { roughness: 0.2, clearcoat: 1 }), hi ? 9 : 5);
  for (let i = 0; i < golMes.count; i++) {
    o.position.copy(G).add(G.clone().sub(J).setLength(0.03 + 0.012 * rnd())).add(nakljucna(0.022)); o.rotation.set(0, 0, 0); o.scale.setScalar(0.8 + 0.4 * rnd()); o.updateMatrix();
    golMes.setMatrixAt(i, o.matrix);
  }
  group.add(golMes);

  // ---------- mitohondriji v somi: upognjeni, različno dolgi ----------
  const nMit = hi ? 34 : 18;
  const mitG = deformiraj(new THREE.CapsuleGeometry(0.0062, 0.022, q(4), q(10)), (v) => { v.x += 0.0035 * Math.sin(v.y * 90) + 9 * v.y * v.y * 0.04; v.multiplyScalar(1 + 0.04 * sum(v.x * 400, v.y * 400, v.z * 400)); });
  const mitoMat = mat(B.mitohondrij, { roughness: 0.36 });
  const mito = new THREE.InstancedMesh(mitG, mitoMat, nMit);
  const mitT = [];
  for (let k = 0, t = 0; k < nMit && t < 20000; t++) {
    smer.copy(nakljucna()).normalize();
    const r = RJ + 0.025 + rnd() * (oblS(smer) * 0.85 - RJ - 0.03);
    o.position.copy(smer).multiplyScalar(r).add(S);
    if (o.position.distanceTo(J) < RJ + 0.018 || o.position.distanceTo(G) < 0.04) continue;
    if (predJedrom(o.position)) continue;
    o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.scale.set(0.85 + rnd() * 0.3, 0.7 + rnd() * 0.6, 0.85 + rnd() * 0.3); o.updateMatrix();
    mito.setMatrixAt(k, o.matrix);
    const g = globina(o.position) * (0.9 + 0.2 * rnd()); mito.setColorAt(k++, new THREE.Color(g, g, g));
    if (vidnaS(o.position)) mitT.push(o.position.clone());
  }
  group.add(mito);

  // drobna temna zrnca v citoplazmi (beljakovinski kompleksi): notranjost ni enolična ploskev
  const prahT = [];
  for (let p = 0; prahT.length < (hi ? 1400 : 500) && p < 40000; p++) {
    const d = nakljucna().normalize(), x = d.clone().multiplyScalar(oblS(d) * MS * Math.cbrt(rnd()) * 0.97);
    if (!vIzrezu(x) && x.length() > RJ * 1.1) prahT.push(x.add(S));
  }
  group.add(V.pike(prahT, 0x7a68d0, 0.0028, 0.5));

  seme = hi ? 1000464049 : 1723809692; // stanje naključnega niza kot v prejšnji različici: dendriti ostanejo enako razvejani
  // ---------- dendriti: razvejana drevesca, ki se tanjšajo; na tanjših vejah dendritni trni ----------
  const dGeo = [], trni = [], dKriv = [];
  function veja(p0, dir, dol, r0, glob) {
    const pts = [p0.clone()];
    let p = p0.clone();
    const d = dir.clone();
    for (let i = 0; i < 4; i++) {
      d.add(nakljucna(0.22)).normalize();
      const k = d.dot(kam);
      if (k > 0.25 && p.distanceTo(S) < 0.5) d.addScaledVector(kam, -(k - 0.25)).normalize();
      p = p.clone().addScaledVector(d, dol / 4);
      if (p.length() > 0.94) { p.multiplyScalar(0.94 / p.length()); d.addScaledVector(p.clone().normalize(), -0.6).normalize(); }
      pts.push(p);
    }
    const r1 = Math.max(0.0045, r0 * 0.66);
    const kr = new THREE.CatmullRomCurve3(pts);
    dGeo.push(cev(kr, q(glob ? 8 : 12), (t) => r0 + (r1 - r0) * t, q(glob > 1 ? 5 : 8), true));
    if (glob <= 1) dKriv.push({ kr, r0, r1 });
    if (glob >= 1) {
      const n = Math.round(dol * (hi ? 70 : 40));
      for (let i = 0; i < n; i++) {
        const t = 0.1 + 0.9 * rnd(), c = kr.getPointAt(t), tan = kr.getTangentAt(t);
        const st = nakljucna().cross(tan).normalize();
        const tr = { p: c.addScaledVector(st, r0 + (r1 - r0) * t + 0.001), s: 0.6 + rnd() * 0.5 };
        if (hi || i % 2 === 0) trni.push(tr); // telefon: pol trnov (isti naključni niz, ista drevesca)
      }
    }
    if (glob < 3) {
      const n = glob === 0 ? 2 : (rnd() < 0.3 ? 3 : 2);
      for (let i = 0; i < n; i++) {
        const nd = d.clone().add(nakljucna(0.55)).normalize();
        veja(p, nd, dol * (0.72 + rnd() * 0.2), r1, glob + 1);
      }
    }
  }
  dSmeri.forEach((u, i) => veja(S.clone().addScaledVector(u, RS * 1.45), u, 0.15 + (i % 3) * 0.02, 0.034, 0));
  // začetki dendritov, ki segajo v notranjost some, odrežemo (sicer bi skozi steklo videli njihove konce)
  const dendGeo = odrezi(zdruzi(dGeo), (p) => { const d = p.clone().sub(S); return d.length() < oblS(d.normalize()) * MS; });
  const dendriti = new THREE.Mesh(dendGeo, steklo(0.28));
  const dendIn = new THREE.Mesh(dendGeo, notranja());
  // dendritni trni: drobne gobaste izbokline, na katerih so sinapse
  const trnGeo = new THREE.IcosahedronGeometry(0.0042, 0);
  trnGeo.scale(1, 1.25, 1);
  const trn = new THREE.InstancedMesh(trnGeo, mat(0xb7a2ff, { roughness: 0.3, clearcoat: 0.9 }), trni.length);
  trni.forEach((t, i) => { o.position.copy(t.p); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.scale.setScalar(t.s); o.updateMatrix(); trn.setMatrixAt(i, o.matrix); });
  group.add(dendIn, dendriti, trn);

  // ---------- akson (v lokalnem sistemu: os x vzdolž aksona, izhodišče v središču some) ----------
  const aks = new THREE.Group();
  aks.position.copy(S);
  aks.quaternion.setFromUnitVectors(v3(1, 0, 0), osA);
  group.add(aks);
  aks.updateMatrix();
  const vSkupino = (x, y, z) => v3(x, y, z).applyMatrix4(aks.matrix).toArray();
  const osX = (g) => g.rotateZ(-Math.PI / 2); // vrtenina okoli y → okoli x

  // aksonski grič (začetek v somi odrežemo kot pri dendritih)
  const ra = 0.028;
  const gric = [];
  for (let i = 0; i <= 20; i++) { const s = i / 20; gric.push([0.15 + s * 0.22, ra + (0.09 - ra) * Math.pow(1 - s, 2.2)]); }
  const gricGeo = odrezi(osX(vrtenina(gric, q(28), false).cela), (p) => { const d = p.clone().sub(S); return d.length() < oblS(d.normalize()) * MS; }, aks.matrix);
  const gricM = new THREE.Mesh(gricGeo, steklo(0.2));
  const gricIn = new THREE.Mesh(gricGeo, notranja());
  aks.add(gricIn, gricM);

  // akson
  const X0 = 0.37, XK = 1.03;
  const aksGeo = osX(new THREE.CylinderGeometry(ra, ra, XK - X0, q(20), q(12), true)).translate((X0 + XK) / 2, 0, 0);
  const aksonM = new THREE.Mesh(aksGeo, steklo(0.2));
  const aksonIn = new THREE.Mesh(aksGeo, notranja());
  aks.add(aksonIn, aksonM);

  // mielinska ovojnica: odseki (vsak je ena Schwannova celica), med njimi Ranvierjevi zažemki
  const nOdsek = 4, Lm = 0.15, rez = 0.022, xm0 = 0.375, rm = 0.049, rp = ra + 0.0015;
  const profilOdseka = (x0) => {
    const p = [];
    for (let i = 0; i <= 26; i++) {
      const s = i / 26, e = Math.min(s, 1 - s) / 0.14, f = e >= 1 ? 1 : Math.sqrt(1 - (1 - e) * (1 - e));
      p.push([x0 + s * Lm, rp + (rm - rp) * f]);
    }
    return p;
  };
  const lathe = (prof, n, a0, da) => osX(new THREE.LatheGeometry(prof.map(([y, r]) => new THREE.Vector2(Math.max(r, 1e-4), y)), n, a0, da));
  // ploskev med profiloma pN (znotraj) in pZ (zunaj) pri kotu fi: debel rez ene plasti mielina
  function trak(pN, pZ, fi) {
    const pos = [], idx = [];
    pZ.forEach(([y, r], i) => { for (const rr of [pN[i][1], r]) pos.push(rr * Math.sin(fi), y, rr * Math.cos(fi)); });
    for (let i = 0; i < pZ.length - 1; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return osX(g);
  }
  const RZ = 1; // prerezani odsek: plasti Schwannove celice, ovite okoli aksona, odrezane stopničasto
  const nPl = hi ? 7 : 4, korakPl = hi ? 0.075 : 0.13;
  const rezS = -0.32, rezK = Math.PI * 0.62; // odprtina gleda proti privzeti kameri (os lokalno +z, rahlo +y)
  const mielGeo = [], zazX = [], plGeo = [], plBarve = [];
  let rezPokrov = null;
  for (let k = 0; k < nOdsek; k++) {
    const x0 = xm0 + k * (Lm + rez), prof = profilOdseka(x0);
    zazX.push(x0 + Lm + rez / 2);
    if (k !== RZ) { mielGeo.push(lathe(prof, q(40), 0, Math.PI * 2)); continue; }
    for (let i = 0; i < nPl; i++) {
      const f = 1 - i / nPl, fN = f - 0.6 / nPl;
      const pZ = prof.map(([x, r]) => [x, rp + (r - rp) * f]), pN = prof.map(([x, r]) => [x, rp + (r - rp) * fN]);
      const a0 = rezS + rezK / 2 - i * korakPl, da = Math.PI * 2 - rezK + 2 * i * korakPl;
      const b = i % 2 ? 0xdcc08a : 0xf7eedb;
      plGeo.push(lathe(pZ, hi ? 40 : 16, a0, da), trak(pN, pZ, a0), trak(pN, pZ, a0 + da));
      plBarve.push(b, 0xfff8ea, 0xfff8ea);
      if (hi) { plGeo.push(lathe(pN, q(40), a0, da)); plBarve.push(0xc9b48a); } // notranja ploskev plasti (telefon: zadnja stran zunanje)
    }
    rezPokrov = lathe(prof, q(16), rezS - rezK / 2, rezK);
  }
  const mielMat = mat(B.mielin, { roughness: 0.4, clearcoat: 0.6, sheen: 0.6 });
  const miel = new THREE.Mesh(zdruzi(mielGeo), mielMat);
  const plasti = new THREE.Mesh(zdruzi(plGeo, plBarve), mat(0xffffff, { vertexColors: true, roughness: 0.42, clearcoat: 0.55, sheen: 0.5, side: THREE.DoubleSide }));
  const mielPokrov = new THREE.Mesh(rezPokrov, mielMat);
  mielPokrov.visible = false;
  aks.add(miel, plasti, mielPokrov);

  // jedra Schwannovih celic na zunanji strani odsekov
  const sjGeo = [];
  for (let k = 0; k < nOdsek; k++) {
    const a = k === RZ ? -2.2 : -2.4 + k * 1.9, x = xm0 + k * (Lm + rez) + Lm * (0.4 + 0.2 * rnd());
    const g = new THREE.SphereGeometry(1, q(18), q(10));
    g.scale(0.036, 0.008, 0.019).translate(0, rm - 0.0005, 0).rotateX(a).translate(x, 0, 0);
    sjGeo.push(g);
  }
  const schwJ = new THREE.Mesh(zdruzi(sjGeo), mat(0x7a52e8, { roughness: 0.4 }));
  aks.add(schwJ);
  const sjT = (() => { const k = 2, a = -2.4 + k * 1.9, x = xm0 + k * (Lm + rez) + Lm * 0.5; return vSkupino(x, Math.cos(a) * (rm + 0.006), Math.sin(a) * (rm + 0.006)); })();

  // Ranvierjevi zažemki: goli deli aksona, gosto posejani z Na⁺-kanalčki
  const zazGeo = osX(new THREE.CylinderGeometry(ra + 0.0022, ra + 0.0022, 0.013, q(18), 1, true));
  const zaz = new THREE.InstancedMesh(zazGeo, mat(0x2fc9b4, { roughness: 0.35, clearcoat: 0.8 }), nOdsek);
  zazX.forEach((x, i) => { o.position.set(x, 0, 0); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); zaz.setMatrixAt(i, o.matrix); });
  const kanT = [];
  zazX.forEach((x) => { for (let i = 0; i < (hi ? 44 : 18); i++) { const a = rnd() * Math.PI * 2, n = v3(0, Math.cos(a), Math.sin(a)); kanT.push({ p: n.clone().multiplyScalar(ra + 0.0026).setX(x + (rnd() - 0.5) * 0.011), n }); } });
  const kanalcki = V.beljakovine(kanT, B.beljakovine, 0.0026, { visina: 1.3 });
  aks.add(zaz, kanalcki);

  // ---------- citoskelet: nevrofilamenti in mikrotubuli (sijoča vlakna) od dendritov skozi somo v akson ----------
  const nfS = [], nfA = [], nfD = [];
  const vhod = S.clone().addScaledVector(osA, RS * 1.05);
  dSmeri.forEach((u) => {
    for (let j = 0; j < (hi ? 3 : 2); j++) {
      const a = S.clone().addScaledVector(u, RS * (1.3 + 0.1 * rnd())).add(nakljucna(0.01));
      const m1 = S.clone().addScaledVector(u, RS * 0.7).add(nakljucna(0.03));
      const m2 = S.clone().addScaledVector(osA, RS * 0.55).add(nakljucna(0.045));
      for (const m of [m1, m2]) { const d = m.clone().sub(J); if (d.length() < RJ + 0.025) m.copy(J).addScaledVector(d.normalize(), RJ + 0.025); }
      nfS.push(new THREE.CubicBezierCurve3(a, m1, m2, vhod.clone().add(nakljucna(0.012))));
    }
  });
  const aksInvG = aks.matrix.clone().invert();
  for (let i = 0; i < (hi ? 9 : 5); i++) {
    const a = (i / (hi ? 9 : 5)) * Math.PI * 2 + rnd() * 0.4, pts = [];
    for (let x = 0.19; x <= XK + 0.001; x += 0.06) {
      const r = x < 0.37 ? 0.012 + 0.035 * Math.pow((0.37 - x) / 0.18, 1.5) : ra * (0.45 + 0.2 * Math.sin(x * 23 + i));
      const aa = a + 0.25 * Math.sin(x * 9 + i * 2);
      pts.push(v3(x, Math.cos(aa) * r, Math.sin(aa) * r));
    }
    nfA.push(new THREE.CatmullRomCurve3(pts));
  }
  const ref = v3(0.3, 0.8, 0.5).normalize();
  for (const { kr, r0, r1 } of dKriv) for (let j = 0; j < (hi ? 3 : 2); j++) {
    const fi = (j / 3) * Math.PI * 2 + rnd(), pts = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8, P = kr.getPointAt(t), T = kr.getTangentAt(t), e1 = T.clone().cross(ref).normalize(), e2 = T.clone().cross(e1);
      pts.push(P.addScaledVector(e1, Math.cos(fi) * (r0 + (r1 - r0) * t) * 0.45).addScaledVector(e2, Math.sin(fi) * (r0 + (r1 - r0) * t) * 0.45));
    }
    nfD.push(new THREE.CatmullRomCurve3(pts));
  }
  const nfSoma = V.vlakna(nfS, 0.0016, B.citoskelet, { sij: 0.55, seg: hi ? 22 : 10, rad: hi ? 4 : 3 });
  const nfDend = V.vlakna(nfD, 0.0015, B.citoskelet, { sij: 0.55, seg: hi ? 12 : 6, rad: hi ? 4 : 3 });
  const nfAks = V.vlakna(nfA, 0.0016, B.citoskelet, { sij: 0.55, seg: hi ? 48 : 22, rad: hi ? 4 : 3 });
  group.add(nfSoma, nfDend);
  aks.add(nfAks);

  // mitohondriji v aksonu (prevažajo se po mikrotubulih do končičev)
  const nMitA = hi ? 9 : 5;

  // ---------- končne razvejitve s sinaptičnimi končiči ----------
  const E = v3(XK, 0, 0);
  const kGeo = [], koncici = [];
  const vLok = (v) => v.clone().applyMatrix4(aks.matrix);
  function konc(p0, dir, dol, r0, glob) {
    const pts = [p0.clone()];
    let p = p0.clone();
    const d = dir.clone();
    for (let i = 0; i < 3; i++) {
      d.add(nakljucna(0.16)).normalize();
      p = p.clone().addScaledVector(d, dol / 3);
      const g = vLok(p);
      if (g.length() > 0.93) p = g.multiplyScalar(0.93 / g.length()).applyMatrix4(aksInvG);
      pts.push(p);
    }
    const r1 = Math.max(0.0055, r0 * 0.72);
    kGeo.push(cev(new THREE.CatmullRomCurve3(pts), q(10), (t) => r0 + (r1 - r0) * t, q(7), true));
    if (glob < 3) {
      const n = glob === 0 ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + glob * 0.9 + rnd() * 0.6;
        konc(p, d.clone().add(v3(0, Math.cos(a), Math.sin(a)).multiplyScalar(glob === 0 ? 1.0 : 0.75)).normalize(), dol * 0.85, r1, glob + 1);
      }
    } else koncici.push({ p, d: d.clone() });
  }
  konc(E.clone().add(v3(-0.004, 0, 0)), v3(1, 0, 0), 0.06, ra, 0);
  const koncGeo = zdruzi(kGeo);
  const koncM = new THREE.Mesh(koncGeo, steklo(0.2));
  const koncIn = new THREE.Mesh(koncGeo, notranja());
  aks.add(koncIn, koncM);
  // sinaptični končiči: stekleni gumbki, v njih mešički z živčnim prenašalcem (zbrani ob konici) in mitohondrij
  const bulbGeo = [], bulbQ = [];
  for (const k of koncici) {
    const g = new THREE.SphereGeometry(1, q(20), q(14));
    const qq = new THREE.Quaternion().setFromUnitVectors(v3(1, 0, 0), k.d);
    g.scale(0.024, 0.019, 0.019).applyQuaternion(qq).translate(k.p.x + k.d.x * 0.018, k.p.y + k.d.y * 0.018, k.p.z + k.d.z * 0.018);
    bulbGeo.push(g); bulbQ.push(qq);
  }
  const bulbG = zdruzi(bulbGeo);
  const bulbi = new THREE.Mesh(bulbG, V.steklo(mat(0xffb35c, { side: THREE.FrontSide }), { a: 0.2, rf: 160, k: 0.8, rob: "#ffc878", rk: 1.25, difuzno: 0.3 }));
  const bulbIn = new THREE.Mesh(bulbG, notranja());
  aks.add(bulbIn, bulbi);
  const nVes = hi ? 22 : 7;
  const vesikli = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.0032, hi ? 1 : 0), mat(B.mesicki, { roughness: 0.18, clearcoat: 1 }), koncici.length * nVes);
  const mitoA = new THREE.InstancedMesh(mitG, mitoMat, nMitA + koncici.length);
  let nv = 0;
  koncici.forEach((k, j) => {
    const c = k.p.clone().addScaledVector(k.d, 0.018), w = v3();
    for (let i = 0; i < nVes; i++) {
      do w.set(1 - 1.5 * Math.pow(rnd(), 0.7), rnd() * 2 - 1, rnd() * 2 - 1); while (w.lengthSq() > 1);
      w.multiply(v3(0.024, 0.019, 0.019)).multiplyScalar(0.74).applyQuaternion(bulbQ[j]).add(c);
      o.position.copy(w); o.rotation.set(0, 0, 0); o.scale.setScalar(0.8 + 0.4 * rnd()); o.updateMatrix();
      vesikli.setMatrixAt(nv++, o.matrix);
    }
    o.position.copy(c).addScaledVector(k.d, -0.009); o.quaternion.setFromUnitVectors(v3(0, 1, 0), v3(0, 0, 1).cross(k.d).normalize()); o.scale.setScalar(0.62); o.updateMatrix();
    mitoA.setMatrixAt(nMitA + j, o.matrix);
  });
  for (let i = 0; i < nMitA; i++) {
    const a = rnd() * Math.PI * 2, r = ra * 0.4 * rnd();
    o.position.set(xm0 + 0.03 + (i / nMitA) * (XK - xm0 - 0.06) + rnd() * 0.02, Math.cos(a) * r, Math.sin(a) * r);
    o.rotation.set(rnd() * 3, 0, Math.PI / 2); o.scale.set(0.75, 1.1 + 0.4 * rnd(), 0.75); o.updateMatrix();
    mitoA.setMatrixAt(i, o.matrix);
  }
  aks.add(vesikli, mitoA);

  // ---------- akcijski potencial: svetel utrip, ki preskakuje od zažemka do zažemka ----------
  const tockeAP = [v3(X0, 0, 0), ...zazX.map((x) => v3(x, 0, 0))];
  const nAP = tockeAP.length + koncici.length;
  const ap = new THREE.InstancedMesh(new THREE.SphereGeometry(1, q(16), q(12)),
    new THREE.MeshBasicMaterial({ color: 0x47d4ff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }), nAP);
  odpad.push(ap.material);
  ap.visible = false;
  aks.add(ap);
  const KORAK_AP = 0.24;
  function postaviAP(tau, mirno) {
    for (let i = 0; i < nAP; i++) {
      const kk = i - tockeAP.length;
      const p = kk < 0 ? tockeAP[i] : koncici[kk].p.clone().addScaledVector(koncici[kk].d, 0.018);
      const ti = kk < 0 ? i * KORAK_AP : tockeAP.length * KORAK_AP + 0.1;
      const f = mirno ? 0.7 : Math.exp(-Math.pow((tau - ti) / 0.075, 2));
      o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(Math.max(1e-4, (kk < 0 ? 0.034 : 0.03) * f)); o.updateMatrix();
      ap.setMatrixAt(i, o.matrix);
    }
    ap.instanceMatrix.needsUpdate = true;
  }
  let apZacetek = null, apMirno = false;
  postaviAP(-10, false);

  // rahle razlike v svetlosti med ponovljenimi deli (organeli niso vsi povsem enaki)
  {
    const c = new THREE.Color();
    group.traverse((m) => {
      if (!m.isInstancedMesh || m.instanceColor) return;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.88 + 0.2 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
    });
  }

  // ---------- deli ----------
  const kT = koncici.reduce((a, k) => (vLok(k.p).z > vLok(a.p).z ? k : a), koncici[0]);
  const kTk = kT.p.clone().addScaledVector(kT.d, 0.018);
  del("celicno-telo", "Celično telo (soma)", "Najdebelejši del nevrona z jedrom, obdan s celično membrano (v prerezu dvosloj, debelina povečana); zbira signale iz dendritov in jih pošlje naprej v akson.", "#9fb4ff", [somaOut, somaRob, somaObr, somaPokrov, beljS, beljSP], naS(0.35, -0.2, 0.92));
  del("citoplazma", "Citoplazma", "Tekočina v celičnem telesu, v kateri so jedro, Nisslova telesca, Golgijev aparat in mitohondriji.", "#5b4bb0", [somaIn], naS(-0.2, 0.25, -0.95, 0.95));
  del("jedro", "Jedro", "Veliko okroglo jedro z DNK, ki usmerja delovanje nevrona; nevroni se praviloma ne delijo več.", B.jedro, [jOut, jRob, jObr, jPokrov, pore], [-0.494, 0.065, 0.037]);
  del("nukleoplazma", "Nukleoplazma", "Tekočina v notranjosti jedra, v kateri sta kromatin in jedrce.", "#a565f0", [jIn], J.clone().add(v3(-0.02, 0.01, -0.03)).toArray());
  del("kromatin", "Kromatin", "Tanke niti DNK, navite na beljakovine; v nevronu so večinoma razrahljane, ker celica neprestano bere navodila za beljakovine.", B.kromatin, [krom], J.clone().add(v3(-0.03, 0.03, -0.01)).toArray());
  del("jedrce", "Jedrce", "Izrazito temno telesce v jedru; v njem nastajajo deli ribosomov, ki jih nevron potrebuje veliko.", B.jedrce, [jedrce], jedrce.position.toArray());
  del("nisslova-telesca", "Nisslova telesca", "Kupčki zrnatega endoplazemskega retikuluma z ribosomi; izdelujejo beljakovine za ves nevron. V aksonskem griču jih ni.", B.zer, [nissl], (nisslT.filter((p) => p.dot(kam) > S.dot(kam) + 0.04).sort((a, b) => b.y - a.y)[0] || nisslT[0] || S).toArray());
  del("ribosomi", "Ribosomi", "Drobna zrnca, ki sestavljajo beljakovine; v nevronu jih je zelo veliko, na Nisslovih telescih in prosto v citoplazmi.", B.ribosomi, [ribosomi], (ribT.find((p) => vidnaS(p)) || S).toArray());
  del("golgi", "Golgijev aparat", "Kup sploščenih membranskih vrečk ob jedru; beljakovine dodela in zapakira v mešičke, ki potujejo tudi do končičev aksona.", B.golgi, [golgi, golMes], G.toArray());
  del("mitohondriji", "Mitohondriji", "Pridobivajo energijo (ATP), ki jo nevron porablja predvsem za črpanje ionov skozi membrano; veliko jih je tudi v končičih.", B.mitohondrij, [mito, mitoA], (mitT.filter((p) => p.dot(kam) > S.dot(kam) + 0.02).sort((a, b) => a.x + a.y - b.x - b.y)[0] || mitT[0] || S).toArray());
  del("citoskelet", "Nevrofilamenti in mikrotubuli", "Vlakna citoskeleta vzdolž dendritov, celičnega telesa in aksona; dajejo oporo, po mikrotubulih pa se mešički in mitohondriji prevažajo do končičev.", B.citoskelet, [nfSoma, nfDend, nfAks], vSkupino(0.3, 0.012, 0.004));
  del("dendriti", "Dendriti", "Kratki, močno razvejani izrastki, ki sprejemajo signale drugih nevronov; drobni trni na njih povečajo površino za sinapse.", "#b7a2ff", [dendriti, dendIn, trn], S.clone().addScaledVector(dSmeri[3], RS * 1.7).toArray());
  del("aksonski-gric", "Aksonski grič", "Stožčast prehod iz celičnega telesa v akson; tu se sproži živčni impulz, ko je vzburjenje dovolj močno.", "#8fa0ff", [gricM, gricIn], vSkupino(0.28, 0.026, 0.026));
  del("akson", "Akson (nevrit)", "Dolg izrastek, ki prevaja živčni impulz stran od celičnega telesa do naslednje celice; v resnici je lahko dolg do 1 m.", "#7f95ff", [aksonM, aksonIn], vSkupino(xm0 + RZ * (Lm + rez) + Lm * 0.5, 0.006, 0.012));
  del("mielinska-ovojnica", "Mielinska ovojnica", "Membrana Schwannove celice, večkrat ovita okoli aksona (v prerezu plasti); maščobna ovojnica akson izolira, zato impulz potuje hitreje.", B.mielin, [miel, plasti, mielPokrov], vSkupino(xm0 + 3 * (Lm + rez) + Lm * 0.4, 0.02, rm * 0.9));
  del("schwannova-celica", "Jedro Schwannove celice", "Vsak odsek mielinske ovojnice je ena Schwannova celica; njeno jedro je potisnjeno na zunanjo stran ovojnice.", "#7a52e8", [schwJ], sjT);
  del("ranvierjev-zazemek", "Ranvierjev zažemek", "Kratek gol del aksona med dvema odsekoma mielina, poln natrijevih kanalčkov; impulz skače od zažemka do zažemka (skokovito prevajanje).", "#2fc9b4", [zaz, kanalcki], vSkupino(zazX[2], 0.004, ra + 0.004));
  del("koncne-razvejitve", "Končne razvejitve aksona", "Na koncu se akson razveji v tanke veje, tako da lahko en nevron vzburi več celic hkrati.", "#a9b8ff", [koncM, koncIn], vSkupino(XK + 0.05, 0.01, 0.01));
  del("sinapticni-koncici", "Sinaptični končiči", "Odebeljeni konci aksona; ob sinapsi se skoraj dotikajo naslednje celice in vanjo prenesejo signal s kemičnim prenašalcem.", "#ffb35c", [bulbi, bulbIn], vSkupino(kTk.x + kT.d.x * 0.015, kTk.y + kT.d.y * 0.015, kTk.z + kT.d.z * 0.015));
  del("sinapticni-mesicki", "Sinaptični mešički", "Drobni mehurčki v končičih, polni živčnega prenašalca; ko pride impulz, se zlijejo z membrano in prenašalec izločijo v sinaptično špranjo.", B.mesicki, [vesikli], vSkupino(kTk.x, kTk.y, kTk.z));

  // ---------- nadzor ----------
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cel nevron"]], vrednost: "prerez",
      ob: (v) => {
        const cela = v === "cela";
        somaPokrov.visible = beljSP.visible = jPokrov.visible = cela; somaRob.visible = somaObr.visible = !cela;
        mielPokrov.visible = cela;
      },
    },
    {
      tip: "gumb", id: "signal", oznaka: "Pošlji signal",
      ob: () => {
        if (gib) { apZacetek = -1; ap.visible = true; postaviAP(-1, false); return; }
        apMirno = !apMirno; ap.visible = apMirno; postaviAP(0, true);
      },
    },
  ];
  if (ctx.zacetek && ctx.zacetek.prikaz) { nadzor[0].vrednost = ctx.zacetek.prikaz; nadzor[0].ob(ctx.zacetek.prikaz); }

  const zat = (p) => 0.8 + 0.2 * Math.min(1, Math.max(0, 0.5 + 0.6 * (-p.x + p.y + p.z) / (Math.hypot(p.x, p.y, p.z) * 1.732 || 1)));
  V.poliraj(group, deli, {
    citoplazma: { tex: "fino", rf: 170, k: 1.1, b: 0.24, lisa: 0.22, f: 14, ao: zat },
    jedro: { tex: "zrna", rf: 170, k: 1, lisa: 0.1, f: 22 },
    nukleoplazma: { tex: "fino", rf: 220, k: 0.9, b: 0.2, lisa: 0.15, f: 24 },
    kromatin: { tex: "gube", rf: 500, k: 0.7 },
    jedrce: { tex: "gube", rf: 300, k: 1.1 },
    "nisslova-telesca": { tex: "fino", rf: 520, k: 0.6 },
    golgi: { tex: "fino", rf: 420, k: 0.6 },
    mitohondriji: { tex: "gube", rf: 380, k: 0.8 },
    dendriti: { tex: "fino", rf: 260, k: 0.8, b: 0.2 },
    "aksonski-gric": { tex: "fino", rf: 220, k: 0.8, b: 0.2 },
    akson: { tex: "fino", rf: 220, k: 0.8, b: 0.2 },
    "koncne-razvejitve": { tex: "fino", rf: 260, k: 0.8, b: 0.2 },
    "sinapticni-koncici": { tex: "fino", rf: 260, k: 0.8, b: 0.2 },
    "mielinska-ovojnica": { tex: "gube", rf: 110, k: 0.8, b: 0.12, s: 0.18, lisa: 0.06, f: 9, ton: 0.4 },
    "schwannova-celica": { tex: "zrna", rf: 260, k: 0.7 },
    "ranvierjev-zazemek": { tex: "zrna", rf: 300, k: 0.7 },
    "sinapticni-mesicki": { tex: "zrna", rf: 500, k: 0.4 },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(deli, {
    "celicno-telo": "#e8809a", dendriti: "#f09ab0", "aksonski-gric": "#e0708e", akson: "#e27e98", "koncne-razvejitve": "#ec92aa",
    "nisslova-telesca": "#4f95e8", "mielinska-ovojnica": "#f6efc4", "schwannova-celica": "#7d5fd0", "ranvierjev-zazemek": "#35c4b0",
    "sinapticni-koncici": "#f2a65a", "sinapticni-mesicki": "#f8de72",
  }));

  return {
    group,
    deli,
    nadzor,
    oder: "celica",
    pogled: [-0.2, 0.31, 0.93],
    korak(t) {
      if (!gib || apZacetek === null || !Number.isFinite(t)) return;
      if (apZacetek < 0) apZacetek = t;
      const tau = t - apZacetek;
      if (tau > tockeAP.length * KORAK_AP + 0.45) { apZacetek = null; ap.visible = false; return; }
      postaviAP(tau, false);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };

  // Ploskev prereza plasti med zunanjo fZ in notranjo fN ploskvijo na treh ravninah izreza (x = 0, y = 0, z = 0).
  // pasovi [[t0, t1, barva], …] od zunaj (t = 0) navznoter (t = 1) pokažejo zgradbo plasti, npr. lipidni dvosloj.
  function prerezPlasti(fZ, fN, seg, pasovi) {
    const loki = [
      (t) => new THREE.Vector3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)),
      (t) => new THREE.Vector3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0),
      (t) => new THREE.Vector3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)),
    ];
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
  // Premakne oglišča: fn(v) spremeni vektor v; nato nove normale.
  function deformiraj(g, fn) {
    const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); fn(v); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
  // Enobarvne barve oglišč (za mreže, ki si delijo material z barvami oglišč).
  function barvaj(g, barva) {
    const c = new THREE.Color(barva), a = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < a.length; i += 3) { a[i] = c.r; a[i + 1] = c.g; a[i + 2] = c.b; }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  }
}
