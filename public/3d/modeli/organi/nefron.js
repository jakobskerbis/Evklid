// Nefron: glomerul v Bowmanovi kapsuli, proksimalni zviti tubul, Henlejeva zanka, distalni zviti tubul in zbiralca;
// okoli njih peritubularne kapilare in vasa recta. Mere: Ross & Pawlina, Histology (8. izd.), Junqueira's Basic Histology
// (16. izd.), pogl. Sečila; viri v viri.json. Gradi se v µm (zanka močno skrajšana). Pogodba: docs/3d.md.

export const info = {
  id: "organ-nefron",
  naslov: "Nefron",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Nefron je osnovna enota ledvice; vsaka ledvica jih ima okoli milijon. V glomerulu se iz krvi precedi primarni seč, v cevkah se večina vode in snovi vrne v kri, ostanek odteče po zbiralcu. Glomerul je narisan povečan, Henlejeva zanka pa močno skrajšana: v resnici je nefron dolg nekaj centimetrov.",
  poskusi: "Sledi rumenim kapljicam od glomerula do zbiralca: skozi katere dele gredo?",
  merilo: { m: 1.4e-3, oznaka: "1,4 mm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const gib = ctx.gibanje !== false;
  const S = 1 / 760, YC = 175, XC = 70;
  const group = new THREE.Group();
  const svet = new THREE.Group();
  svet.scale.setScalar(S);
  svet.position.set(-XC * S, -YC * S, 0);
  group.add(svet);
  const U = (v) => [(v.x - XC) * S, (v.y - YC) * S, v.z * S].map((x) => Math.round(x * 1000) / 1000);
  const odpad = [];
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const o = new THREE.Object3D();
  let seme = 9;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;

  // ---------- orodja ----------
  function mat(barva, x = {}) {
    const c = new THREE.Color(barva);
    const m = new THREE.MeshPhysicalMaterial({
      color: c, roughness: 0.52, clearcoat: 0.35, clearcoatRoughness: 0.4,
      sheen: 0.5, sheenRoughness: 0.55, sheenColor: c.clone().lerp(new THREE.Color(0xffffff), 0.45), ...x,
    });
    odpad.push(m);
    return m;
  }
  // Ponovljiv gladek šum na [0, 1]² (vsota sinusov s celimi frekvencami).
  function valovi(s, k, fu, fv = fu) {
    seme = s;
    const w = [];
    for (let i = 0; i < k; i++) w.push([Math.round((rnd() - 0.5) * 2 * fu), Math.round((rnd() - 0.5) * 2 * fv) || 1, rnd() * 6.283, 0.4 + rnd()]);
    const vs = w.reduce((a, x) => a + x[3], 0);
    return (u, v) => w.reduce((a, [m, n, p, am]) => a + am * Math.sin(6.283 * (m * u + n * v) + p), 0) / vs;
  }
  function tekstura(n, f) {
    const d = new Uint8Array(n * n * 4);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const g = Math.max(0, Math.min(255, Math.round(f(i / n, j / n) * 255))), k = (j * n + i) * 4;
      d[k] = d[k + 1] = d[k + 2] = g; d[k + 3] = 255;
    }
    const t = new THREE.DataTexture(d, n, n, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.needsUpdate = true;
    odpad.push(t);
    return t;
  }
  function geo(pos, nor, uv, idx) {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    if (nor) g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv || new Array((pos.length / 3) * 2).fill(0), 2));
    g.setIndex(idx);
    if (!nor) g.computeVertexNormals();
    return g;
  }
  function zdruzi(geos) {
    const pos = [], nor = [], uv = [], idx = [];
    let off = 0;
    for (const g0 of geos) {
      const g = g0.index ? g0 : g0.toNonIndexed();
      const p = g.attributes.position, n = g.attributes.normal, t = g.attributes.uv;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        uv.push(t ? t.getX(k) : 0, t ? t.getY(k) : 0);
      }
      if (g.index) for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      else for (let k = 0; k < p.count; k++) idx.push(k + off);
      off += p.count;
      g0.dispose();
    }
    return geo(pos, nor, uv, idx);
  }
  // Cev s spremenljivim polmerom r(t) po krivulji skozi točke; zaobljena konca.
  function cev(tocke, r, nSeg, nRad = hi ? 8 : 6) {
    const kr = new THREE.CatmullRomCurve3(tocke.map((p) => V(...p)));
    const fr = kr.computeFrenetFrames(nSeg, false), P = new THREE.Vector3();
    const pos = [], idx = [];
    for (let i = 0; i <= nSeg; i++) {
      kr.getPointAt(i / nSeg, P);
      const rr = typeof r === "function" ? r(i / nSeg) : r, N = fr.normals[i], B = fr.binormals[i];
      for (let j = 0; j < nRad; j++) {
        const a = (j / nRad) * 6.283, c = Math.cos(a) * rr, s = Math.sin(a) * rr;
        pos.push(P.x + c * N.x + s * B.x, P.y + c * N.y + s * B.y, P.z + c * N.z + s * B.z);
      }
    }
    for (let i = 0; i < nSeg; i++) for (let j = 0; j < nRad; j++) {
      const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad);
      idx.push(a, b, a + nRad, b, b + nRad, a + nRad);
    }
    for (const [i, sg] of [[0, -1], [nSeg, 1]]) {
      kr.getPointAt(i / nSeg, P);
      const T = fr.tangents[i], rr = typeof r === "function" ? r(i / nSeg) : r, c = pos.length / 3;
      pos.push(P.x + T.x * rr * 0.7 * sg, P.y + T.y * rr * 0.7 * sg, P.z + T.z * rr * 0.7 * sg);
      for (let j = 0; j < nRad; j++) {
        const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad);
        if (sg < 0) idx.push(c, b, a); else idx.push(c, a, b);
      }
    }
    return geo(pos, null, null, idx);
  }
  const kroglica = (x, y, z, rx, ry = rx, rz = rx, n = hi ? 14 : 9) => new THREE.SphereGeometry(1, n, Math.round(n * 0.7)).scale(rx, ry, rz).translate(x, y, z);
  // Vrtenina iz profila [[r, y], …] z barvo oglišč po višini (barva(y) → THREE.Color).
  function vrtenina(prof, n, barva) {
    const g = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.01), y)), n);
    const p = g.attributes.position, col = [];
    for (let i = 0; i < p.count; i++) { const c = barva(p.getY(i)); col.push(c.r, c.g, c.b); }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return g;
  }

  // Glavna krivulja cevke (kontrolne točke) in meje odsekov (indeksi točk).
  const G = V(-130, 600, 0), RK = 118; // središče in polmer Bowmanove kapsule (povečano)
  const VP = V(-14, 628, 0); // žilni pol
  const TOCKE = [
    [-232, 548, 0], [-300, 480, 40], [-365, 560, 90], [-345, 705, 40], [-255, 768, -40], [-150, 810, -88], [-40, 790, -84], [10, 715, -125], [-20, 560, -118], [-130, 468, -86], [-262, 432, -30], // PCT 0–10
    [-262, 330, 0], [-236, 230, 8], // ravni del 10–12
    [-206, 90, 0], [-178, -190, 0], [-160, -400, 0], [-118, -470, 0], [-84, -420, 0], // tanki padajoči + zavoj 12–17
    [-74, -240, 0], [-64, -80, 0], // tanki naraščajoči 17–19
    [-56, 30, 0], [-42, 250, 12], [-26, 450, 30], [16, 590, 34], // debeli naraščajoči do macule dense 19–23
    [74, 662, 64], [135, 602, 110], [186, 692, 64], [146, 786, 4], [205, 830, -58], // DCT 23–28
    [280, 772, -44], [335, 708, -20], // veznik 28–30
  ];
  const n = TOCKE.length;
  const K = new THREE.CatmullRomCurve3(TOCKE.map((p) => V(...p)), false, "centripetal");
  const ODSEKI = [
    ["pct", 0, 10, 26, 28], ["ravni", 10, 12, 26, 25], ["tanki", 12, 19, 25, 8], ["debeli", 19, 23, 8, 14], ["dct", 23, 28, 14, 17], ["veznik", 28, 30, 17, 17],
  ];
  class Del extends THREE.Curve {
    constructor(t0, t1) { super(); this.t0 = t0; this.t1 = t1; }
    getPoint(s, out = new THREE.Vector3()) { return out.copy(K.getPoint(this.t0 + (this.t1 - this.t0) * s)); }
  }
  // Cev po delu krivulje s polmerom, ki se gladko spremeni iz r0 v r1 (brez skoka na stiku odsekov).
  function cevOdsek(a, b, r0, r1, gostota = 0.5) {
    const k = new Del(a / (n - 1), b / (n - 1));
    const L = k.getLength(), seg = Math.max(8, Math.round((L / 12) * gostota * (hi ? 1 : 0.6))), rad = hi ? 16 : 9;
    const g = new THREE.TubeGeometry(k, seg, 1, rad, false);
    const p = g.attributes.position, P = new THREE.Vector3(), v = new THREE.Vector3();
    for (let i = 0; i <= seg; i++) {
      const s = i / seg, r = r1 + (r0 - r1) * Math.exp(-s * 9);
      k.getPointAt(s, P);
      for (let j = 0; j <= rad; j++) { const x = i * (rad + 1) + j; v.fromBufferAttribute(p, x).sub(P).multiplyScalar(r).add(P); p.setXYZ(x, v.x, v.y, v.z); }
    }
    g.computeVertexNormals();
    return g;
  }
  const sum = valovi(7, 14, 10), sum2 = valovi(17, 10, 4);
  const zrna = tekstura(128, (u, v) => 0.82 + 0.1 * sum(u, v) + 0.06 * sum2(u, v));
  const zrna2 = tekstura(128, (u, v) => 0.86 + 0.08 * sum(v, u));
  zrna.repeat.set(10, 1); zrna2.repeat.set(10, 1);
  const tm = (barva, tex = zrna, x = {}) => mat(barva, { map: tex, bumpMap: tex, bumpScale: 1.6, roughness: 0.5, clearcoat: 0.5, sheen: 0.6, transparent: true, opacity: 0.9, ...x }); // rahlo prosojne: vidiš tok v cevki
  const M = {
    pct: tm(0xf0a274), ravni: tm(0xeeaa80), tanki: tm(0xf3dcb4, zrna2), debeli: tm(0xe6b44c), dct: tm(0xd9c060), veznik: tm(0x9fd0a4),
    zbir: tm(0x6fbfb8, zrna2), kaps: mat(0xf6dccb, { transparent: true, opacity: 0.3, depthWrite: false, side: THREE.FrontSide, roughness: 0.3, clearcoat: 1 }),
    kapsN: mat(0xd8a597, { roughness: 0.55, side: THREE.BackSide }),
    kapsRob: mat(0xf1e4d6, { roughness: 0.5 }),
    tuft: mat(0xd94854, { roughness: 0.35, clearcoat: 0.9 }), art: mat(0xd23c48, { roughness: 0.35, clearcoat: 0.8 }), ven: mat(0x5f73c6, { roughness: 0.35, clearcoat: 0.8 }),
    kap: mat(0xffffff, { vertexColors: true, roughness: 0.35, clearcoat: 0.8 }), lumen: mat(0x3b2a2a, { roughness: 0.8 }),
    kaplja: mat(0xffe27a, { roughness: 0.2, clearcoat: 1, emissive: 0xa08018 }), kri: mat(0xc42a36, { roughness: 0.3, clearcoat: 1 }),
  };
  const mreze = {};
  for (const [id, a, b, r0, r1] of ODSEKI) { mreze[id] = new THREE.Mesh(cevOdsek(a, b, r0, r1), M[id]); svet.add(mreze[id]); }

  // zbiralca: navpična cev, prerezana zgoraj in spodaj (stena in svetlina)
  const CD = new THREE.CatmullRomCurve3([V(345, 870, -10), V(342, 708, -20), V(330, 300, -10), V(318, -150, 0), V(312, -560, 10)]);
  const RZ = (s) => 24 + 10 * s;
  const zbirG = new THREE.TubeGeometry(CD, hi ? 60 : 30, 1, hi ? 20 : 12, false);
  {
    const p = zbirG.attributes.position, P = new THREE.Vector3(), v = new THREE.Vector3(), seg = hi ? 60 : 30, rad = hi ? 20 : 12;
    for (let i = 0; i <= seg; i++) { CD.getPointAt(i / seg, P); for (let j = 0; j <= rad; j++) { const x = i * (rad + 1) + j; v.fromBufferAttribute(p, x).sub(P).multiplyScalar(RZ(i / seg)).add(P); p.setXYZ(x, v.x, v.y, v.z); } }
    zbirG.computeVertexNormals();
  }
  const konci = [];
  for (const s of [0, 1]) {
    const P = CD.getPointAt(s), T = CD.getTangentAt(s), r = RZ(s);
    const rob = new THREE.RingGeometry(r * 0.62, r, hi ? 20 : 12).lookAt(s ? T : T.clone().negate()).translate(P.x, P.y, P.z);
    const lum = new THREE.CircleGeometry(r * 0.62, hi ? 20 : 12).lookAt(s ? T : T.clone().negate()).translate(P.x - T.x * 4 * (s ? 1 : -1), P.y - T.y * 4 * (s ? 1 : -1), P.z);
    konci.push([rob, lum]);
  }
  const zbir = new THREE.Mesh(zdruzi([zbirG, konci[0][0], konci[1][0]]), M.zbir);
  const zbirL = new THREE.Mesh(zdruzi([konci[0][1], konci[1][1]]), M.lumen);
  svet.add(zbir, zbirL);

  // Bowmanova kapsula: prosojna lupina z odprtino spredaj (rob kaže debelino), zgoraj žilni, spodaj sečni pol
  const kapsG = new THREE.SphereGeometry(RK, hi ? 40 : 24, hi ? 30 : 18);
  {
    const p = kapsG.attributes.position, ix = kapsG.index.array, ost = [], c = new THREE.Vector3();
    for (let i = 0; i < ix.length; i += 3) {
      c.set(0, 0, 0);
      for (let k = 0; k < 3; k++) c.add(new THREE.Vector3().fromBufferAttribute(p, ix[i + k]));
      c.multiplyScalar(1 / 3 / RK);
      if (c.z > 0.55) continue; // okno spredaj
      ost.push(ix[i], ix[i + 1], ix[i + 2]);
    }
    kapsG.setIndex(ost);
    kapsG.translate(G.x, G.y, G.z);
  }
  const kaps = new THREE.Mesh(kapsG, M.kaps);
  const kapsN = new THREE.Mesh(kapsG.clone().scale(1, 1, 1), M.kapsN); // notranja (parietalna) plast, vidna skozi okno
  kaps.renderOrder = 2;
  const robKG = [];
  {
    const pts = [], rr = Math.sqrt(1 - 0.55 * 0.55) * RK;
    for (let i = 0; i <= 48; i++) { const f = (i / 48) * Math.PI * 2; pts.push([G.x + Math.cos(f) * rr, G.y + Math.sin(f) * rr, G.z + 0.55 * RK]); }
    robKG.push(cev(pts, 3.2, hi ? 96 : 48, 6));
  }
  const kapsRob = new THREE.Mesh(zdruzi(robKG), M.kapsRob);
  svet.add(kaps, kapsN, kapsRob);

  // glomerul: klopčič kapilarnih zank (naključna gladka pot v krogli)
  const tuftT = [];
  seme = 3;
  {
    let p = VP.clone().lerp(G, 0.35);
    const korakov = hi ? 90 : 56;
    for (let i = 0; i < korakov; i++) {
      tuftT.push(p.toArray());
      const d = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize().multiplyScalar(30);
      const q = p.clone().add(d), od = q.clone().sub(G);
      if (od.length() > RK * 0.74) q.copy(G).add(od.setLength(RK * 0.74 - 14 * rnd()));
      p = q;
    }
    tuftT.push(VP.clone().lerp(G, 0.3).add(V(0, 14, 0)).toArray());
  }
  const tuftG = cev(tuftT, 7, (hi ? 5 : 3) * tuftT.length, hi ? 8 : 6);
  const tuft = new THREE.Mesh(tuftG, M.tuft);
  svet.add(tuft);

  // žile: interlobularna arterija in vena, dovodna in odvodna arteriola
  const AI = new THREE.CatmullRomCurve3([V(470, 880, 70), V(460, 700, 80), V(455, 330, 70)]);
  const VI = new THREE.CatmullRomCurve3([V(520, 330, -90), V(525, 700, -100), V(520, 880, -110)]);
  const AFF = new THREE.CatmullRomCurve3([V(462, 720, 80), V(280, 640, 70), V(120, 650, 40), V(30, 640, 14), VP.clone().add(V(-8, 0, 0))]);
  const EFF = new THREE.CatmullRomCurve3([VP.clone().add(V(-6, 10, 0)), V(20, 690, -6), V(60, 760, -40), V(40, 860, -80), V(-60, 880, -120)]);
  const tub = (k, r0, r1, seg) => {
    const g = new THREE.TubeGeometry(k, seg, 1, hi ? 14 : 8, false), p = g.attributes.position, P = new THREE.Vector3(), v = new THREE.Vector3(), rad = hi ? 14 : 8;
    for (let i = 0; i <= seg; i++) { k.getPointAt(i / seg, P); const r = r0 + (r1 - r0) * (i / seg); for (let j = 0; j <= rad; j++) { const x = i * (rad + 1) + j; v.fromBufferAttribute(p, x).sub(P).multiplyScalar(r).add(P); p.setXYZ(x, v.x, v.y, v.z); } }
    g.computeVertexNormals();
    return g;
  };
  const kapa = (k, s, r) => { const P = k.getPointAt(s), T = k.getTangentAt(s); return new THREE.CircleGeometry(r, hi ? 14 : 8).lookAt(s ? T : T.clone().negate()).translate(P.x, P.y, P.z); };
  const art = new THREE.Mesh(zdruzi([tub(AI, 38, 34, 20), kapa(AI, 0, 38), kapa(AI, 1, 34)]), M.art);
  const ven = new THREE.Mesh(zdruzi([tub(VI, 46, 50, 20), kapa(VI, 0, 46), kapa(VI, 1, 50)]), M.ven);
  const aff = new THREE.Mesh(tub(AFF, 15, 12, hi ? 40 : 24), M.art);
  const eff = new THREE.Mesh(tub(EFF, 9, 9, hi ? 40 : 24), M.art);
  svet.add(art, ven, aff, eff);

  // peritubularne kapilare: vijačnice okoli zvitih cevk (barva od rdeče proti modri) in vasa recta ob zanki
  const kapG = [], rdeca = new THREE.Color(0xd94a58), modra = new THREE.Color(0x7a6ad0);
  const pobarvaj = (g, c0, c1) => {
    const p = g.attributes.position, col = [], c = new THREE.Color(), cnt = p.count;
    for (let i = 0; i < cnt; i++) { c.copy(c0).lerp(c1, i / cnt); col.push(c.r, c.g, c.b); }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return g;
  };
  for (const [a, b, r, f] of [[0.5, 3.5, 28, 0], [3, 6.5, 28, 2], [6, 9.5, 28, 4], [23.3, 25.5, 17, 1], [25, 27.8, 17, 3]]) {
    const pts = [], d = new Del(a / (n - 1), b / (n - 1)), N = 40;
    const fr = d.computeFrenetFrames(N, false);
    for (let i = 0; i <= N; i++) {
      const P = d.getPointAt(i / N), ang = f + i * 0.3, rr = r + 2.5;
      pts.push(P.clone().add(fr.normals[i].clone().multiplyScalar(Math.cos(ang) * rr)).add(fr.binormals[i].clone().multiplyScalar(Math.sin(ang) * rr)).toArray());
    }
    kapG.push(pobarvaj(cev(pts, 4, hi ? 90 : 50, hi ? 7 : 5), rdeca, modra));
  }
  // vasa recta: dolgi kapilari ob Henlejevi zanki
  for (const [dx, dz] of [[-46, 30], [36, -30]]) {
    const pts = [[-150 + dx, 360, dz], [-150 + dx * 1.2, 0, dz], [-128 + dx * 1.1, -380, dz], [-110, -500 - Math.abs(dx) * 0.3, dz], [-80 - dx * 0.8, -380, dz], [-60 - dx * 0.6, 0, dz], [-40 - dx * 0.5, 360, dz]];
    kapG.push(pobarvaj(cev(pts, 5, hi ? 80 : 40, hi ? 7 : 5), rdeca, modra));
  }
  const kap = new THREE.Mesh(zdruzi2(kapG), M.kap);
  svet.add(kap);
  function zdruzi2(geos) { // združi z barvami oglišč
    const col = [];
    for (const g of geos) { const c = g.attributes.color; for (let i = 0; i < c.count; i++) col.push(c.getX(i), c.getY(i), c.getZ(i)); }
    const out = zdruzi(geos);
    out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return out;
  }

  // meja skorja/sredica: rahla ploskev in napisa
  const meja = new THREE.Mesh(new THREE.PlaneGeometry(1300, 420).rotateX(-Math.PI / 2).translate(80, 280, 0), new THREE.MeshBasicMaterial({ color: 0x9fb4d8, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide }));
  odpad.push(meja.material);
  meja.raycast = () => {};
  svet.add(meja);
  if (typeof document !== "undefined") {
    for (const [txt, y] of [["skorja ↑", 330], ["sredica ↓", 230]]) {
      const cv = document.createElement("canvas");
      cv.width = 512; cv.height = 128;
      const c2 = cv.getContext("2d");
      if (!c2) continue;
      c2.font = "600 56px system-ui, sans-serif"; c2.textAlign = "left"; c2.textBaseline = "middle"; c2.fillStyle = "#b9c6dc";
      c2.fillText(txt, 8, 64);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sm = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      odpad.push(sm, tex);
      const sp = new THREE.Sprite(sm);
      sp.center.set(0, 0.5);
      sp.scale.set(0.72, 0.18, 1); // berljivo tudi na telefonu
      sp.position.set(-600 * S, (y - YC) * S, 0);
      sp.raycast = () => {};
      group.add(sp);
    }
  }

  // ---------- tok: kapljice seča po cevki in zbiralci, krvničke po arteriolah ----------
  const POT = [];
  for (let i = 0; i <= 260; i++) POT.push(K.getPoint(i / 260));
  for (let i = 0; i <= 50; i++) POT.push(CD.getPointAt(0.11 + (i / 50) * 0.89));
  const dol = [0];
  for (let i = 1; i < POT.length; i++) dol.push(dol[i - 1] + POT[i].distanceTo(POT[i - 1]));
  const L = dol[dol.length - 1];
  const nK = hi ? 70 : 40;
  const kaplje = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, hi ? 2 : 1), M.kaplja, nK);
  const KRI = [];
  for (let i = 0; i <= 40; i++) KRI.push(AFF.getPointAt(i / 40));
  for (let i = 0; i <= 40; i++) KRI.push(EFF.getPointAt(i / 40));
  const nKr = hi ? 26 : 14;
  const krvnicke = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 6).scale(1, 0.45, 1), M.kri, nKr);
  svet.add(kaplje, krvnicke);
  const naPoti = (pts, s) => { const i = Math.min(pts.length - 2, Math.floor(s * (pts.length - 1))), t = s * (pts.length - 1) - i; return pts[i].clone().lerp(pts[i + 1], t); };
  function tok(t) {
    for (let i = 0; i < nK; i++) {
      const s = (((i / nK + t * 0.02) % 1) * L);
      let j = 1;
      while (j < dol.length - 1 && dol[j] < s) j++;
      const p = POT[j - 1].clone().lerp(POT[j], (s - dol[j - 1]) / Math.max(1e-6, dol[j] - dol[j - 1]));
      o.position.copy(p); o.quaternion.identity();
      // kapljica se manjša: večina vode se vrne v kri (v resnici okoli 99 %)
      o.scale.setScalar(Math.max(3.2, 8 - (s / L) * 6));
      o.updateMatrix(); kaplje.setMatrixAt(i, o.matrix);
    }
    for (let i = 0; i < nKr; i++) {
      const p = naPoti(KRI, (i / nKr + t * 0.06) % 1);
      o.position.copy(p); o.rotation.set(i, i * 2, 0); o.scale.setScalar(5); o.updateMatrix(); krvnicke.setMatrixAt(i, o.matrix);
    }
    kaplje.instanceMatrix.needsUpdate = krvnicke.instanceMatrix.needsUpdate = true;
    kaplje.computeBoundingSphere(); krvnicke.computeBoundingSphere();
  }
  tok(0.4);

  // ---------- deli ----------
  const deli = [];
  const del = (id, ime, la, opis, barva, meshes, p, x = {}) => deli.push({ id, ime, la, opis, barva, meshes, tocka: U(p), ...x });
  const tk = (i) => K.getPoint(i / (n - 1));
  del("glomerul", "Glomerul", "Glomerulus", "Klopčič kapilar, skozi katerih steno se iz krvi precedi voda z drobnimi snovmi; na dan nastane okoli 180 litrov primarnega seča.", "#d94854", [tuft], G.clone().add(V(10, -10, 60)));
  del("kapsula", "Bowmanova kapsula", "Capsula glomeruli", "Dvoslojna čaša okoli glomerula, ki prestreže primarni seč in ga vodi v cevko.", "#f1e4d6", [kaps, kapsN, kapsRob], G.clone().add(V(-80, 70, 60)));
  del("dovodna", "Dovodna arteriola", "Arteriola glomerularis afferens", "Prinaša kri v glomerul; je širša od odvodne, zato je v glomerulu tlak visok.", "#d23c48", [aff], AFF.getPointAt(0.45));
  del("odvodna", "Odvodna arteriola", "Arteriola glomerularis efferens", "Odvaja kri iz glomerula v kapilare okoli cevk.", "#d23c48", [eff], EFF.getPointAt(0.6), { skrijTocko: true });
  del("pct", "Proksimalni zviti tubul", "Tubulus contortus proximalis", "Najdaljši del cevke s ščetkastim robom; tu se vrne v kri večina vode, vsa glukoza in aminokisline.", "#f0a274", [mreze.pct, mreze.ravni], tk(3));
  del("tanki", "Henlejeva zanka (tanki del)", "Pars tenuis ansae nephroni", "Tanka zanka, ki se spusti globoko v sredico; v padajočem kraku voda izhaja iz cevke.", "#f3dcb4", [mreze.tanki], tk(15));
  del("debeli", "Debeli del Henlejeve zanke", "Pars recta tubuli distalis", "Naraščajoči krak, ki črpa sol iz seča, vode pa ne prepušča; tako je sredica slana in lahko izsrka vodo iz zbiralc.", "#e6b44c", [mreze.debeli], tk(20.5));
  del("dct", "Distalni zviti tubul", "Tubulus contortus distalis", "Cevka se vrne k svojemu glomerulu (macula densa) in natančno uravna sol in kislost seča.", "#d9c060", [mreze.dct, mreze.veznik], tk(25.5));
  del("zbiralca", "Zbiralce", "Tubulus colligens", "Vanj se izliva več nefronov; s hormonom ADH telo določi, koliko vode se še vrne v kri. Ostane seč.", "#6fbfb8", [zbir, zbirL], CD.getPointAt(0.55));
  del("kapilare", "Peritubularne kapilare in vasa recta", "Vasa peritubularia et vasa recta", "Kapilare okoli cevk sprejmejo vodo in snovi, ki se vrnejo iz seča v kri.", "#d94a58", [kap], tk(5.5).add(V(0, 0, 40)));
  del("zile", "Interlobularna arterija in vena", "Arteria et vena interlobularis", "Žili med ledvičnimi režnjiči: arterija prinaša kri k nefronom, vena jo odvaja.", "#5f73c6", [art, ven], AI.getPointAt(0.55), { skrijTocko: true });
  del("tok", "Primarni seč in seč", "Urina primaria et urina", "Rumene kapljice kažejo pot tekočine; vse manjše so, ker se večina vode vrne v kri.", "#ffe27a", [kaplje, krvnicke], POT[Math.floor(POT.length * 0.04)], { skrijTocko: true });

  const nadzor = [
    { tip: "stikalo", id: "kapilare", oznaka: "Pokaži kapilare", vrednost: true, ob: (v) => { kap.visible = !!v; } },
  ];
  if (ctx.zacetek && "kapilare" in ctx.zacetek) { const v = /^(1|true|da)$/i.test(String(ctx.zacetek.kapilare)); nadzor[0].vrednost = v; nadzor[0].ob(v); }

  return {
    group,
    get deli() { return kap.visible ? deli : deli.filter((d) => d.id !== "kapilare"); },
    nadzor,
    korak(t) { if (gib) tok(t); },
    pogled: [0.18, 0.12, 1],
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      for (const x of odpad) x.dispose();
    },
  };
}
