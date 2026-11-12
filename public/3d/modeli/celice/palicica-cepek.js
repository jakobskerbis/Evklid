// Paličica in čepek: čutnici za svetlobo iz mrežnice, druga ob drugi, v prerezu.
// Zgoraj zunanja členka (diski, gube), spodaj sinaptična končiča. Pogodba graditelja: docs/3d.md.
// THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-palicica-cepek",
  naslov: "Paličica in čepek",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Čutnici v mrežnici očesa: paličice zaznavajo šibko svetlobo, čepki barve. Svetloba pride od spodaj, skozi celo mrežnico, do zunanjih členkov zgoraj. Celici sta narisani približno dvakrat širši, vlakni krajši, diskov pa je manj kot v resnici (paličica jih ima okoli 1000). Debelina membrane je povečana.",
  poskusi: "Primerjaj zunanja členka paličice in čepka: kje so diski?",
  merilo: { m: 64e-6, oznaka: "64 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const group = new THREE.Group();
  const odpad = [];
  const deli = [];
  const V = videzCelic(THREE, { hi, odpad });
  const { sum } = V;

  // ---------- orodja ----------
  let seme = 7;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3,
      sheen: 0.5, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
    }, o));
    odpad.push(m);
    return m;
  }
  // Združi geometrije (z indeksom ali brez) v eno; ohrani barve oglišč in aRez, če jih imajo vse.
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], rez = [], idx = [];
    const zCol = !barve && geos.every((g) => g.attributes.color), zRez = geos.every((g) => g.attributes.aRez);
    let off = 0;
    geos.forEach((g, i) => {
      if (!g.attributes.normal) g.computeVertexNormals();
      const p = g.attributes.position, n = g.attributes.normal, cA = g.attributes.color, r = g.attributes.aRez;
      const c = barve ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (c) col.push(c.r, c.g, c.b);
        else if (zCol) col.push(cA.getX(k), cA.getY(k), cA.getZ(k));
        if (zRez) rez.push(r.getX(k), r.getY(k));
      }
      if (g.index) for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      else for (let k = 0; k < p.count; k++) idx.push(k + off);
      off += p.count;
      g.dispose();
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    if (barve || zCol) out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    if (zRez) out.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    out.setIndex(idx);
    return out;
  }
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }
  // Ploskev prereza z lastnim senčilnikom: koda (GLSL) iz vRez (= aRez) in vRp (položaj v geometriji) nastavi
  // bv (barva sRGB) in zh (višina reliefa v enotah prizora). Material ima userData.rez (poliraj ga pusti pri miru).
  function rezMat(koda, kljuc) {
    const m = mat(0xffffff, { roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.3, sheen: 0.3, sheenColor: new THREE.Color(0xe6dcff), side: THREE.DoubleSide });
    m.userData.rez = true;
    const dodaj = (m) => {
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec2 aRez;\nvarying vec2 vRez;\nvarying vec3 vRp;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRez = aRez;\nvRp = position;");
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vRez;\nvarying vec3 vRp;" + V.GLSL)
          .replace("#include <color_fragment>", `#include <color_fragment>
            vec2 R = vRez; vec3 P = vRp; vec3 bv = vec3(1.0); float zh = 0.0;
            ${koda}
            diffuseColor.rgb = pow(clamp(bv, 0.0, 1.0), vec3(2.2));`)
          .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal = zvRelief(normal, zh, faceDirection);");
      };
      m.customProgramCacheKey = () => "palcep-rez-" + kljuc;
      m.clone = function () { const c = new this.constructor().copy(this); dodaj(c); return c; };
    };
    dodaj(m);
    return m;
  }
  // Mreža (nU + 1) × (nV + 1) točk f(u, v, P); rezF(u, v) → [s, t] da atribut aRez.
  function ploskev(nU, nV, f, rezF) {
    const pos = [], rez = [], idx = [], P = v3(0, 0, 0);
    for (let i = 0; i <= nU; i++) for (let j = 0; j <= nV; j++) {
      f(i / nU, j / nV, P);
      pos.push(P.x, P.y, P.z);
      if (rezF) rez.push(...rezF(i / nU, j / nV));
    }
    for (let i = 0; i < nU; i++) for (let j = 0; j < nV; j++) {
      const a = i * (nV + 1) + j, b = a + 1, c = a + nV + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    if (rezF) g.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Odstrani trikotnike, katerih težišče izpolni pogoj.
  function odrezi(g, pogoj) {
    if (!g.index) g.setIndex([...Array(g.attributes.position.count).keys()]);
    const p = g.attributes.position, ix = g.index.array, ost = [], a = v3(0, 0, 0), b = v3(0, 0, 0), c = v3(0, 0, 0);
    for (let i = 0; i < ix.length; i += 3) {
      a.fromBufferAttribute(p, ix[i]); b.fromBufferAttribute(p, ix[i + 1]); c.fromBufferAttribute(p, ix[i + 2]);
      a.add(b).add(c).multiplyScalar(1 / 3);
      if (!pogoj(a)) ost.push(ix[i], ix[i + 1], ix[i + 2]);
    }
    g.setIndex(ost);
    return g;
  }
  // Gladke normale kroglastega telesa (smer od središča geometrije).
  function gladka(g) {
    const p = g.attributes.position, n = new Float32Array(p.count * 3), w = v3(0, 0, 0);
    for (let i = 0; i < p.count; i++) { w.fromBufferAttribute(p, i).normalize(); n[i * 3] = w.x; n[i * 3 + 1] = w.y; n[i * 3 + 2] = w.z; }
    g.setAttribute("normal", new THREE.BufferAttribute(n, 3));
    return g;
  }
  // Cev s spremenljivim polmerom rF(t) vzdolž krivulje; zaobljena konca.
  function cev(krivulja, nSeg, rF, nRad) {
    const fr = krivulja.computeFrenetFrames(nSeg, false);
    const pos = [], idx = [], P = v3(0, 0, 0);
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
      pos.push(P.x + T.x * r * 0.8 * sg, P.y + T.y * r * 0.8 * sg, P.z + T.z * r * 0.8 * sg);
      for (let j = 0; j < nRad; j++) {
        const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad);
        if (sg < 0) idx.push(c, b, a); else idx.push(c, a, b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Vrtenina okoli osi y iz profila [[y, r], …]; odprta = brez četrtine x < 0, z > 0 (kota 1,5π … 2π), pokrov = ta četrtina.
  function vrtenina(prof, n) {
    const pts = prof.map(([y, r]) => new THREE.Vector2(Math.max(r, 1e-4), y));
    return {
      odprta: new THREE.LatheGeometry(pts, Math.round(n * 0.75), 0, Math.PI * 1.5),
      pokrov: new THREE.LatheGeometry(pts, Math.max(3, Math.round(n * 0.25)), Math.PI * 1.5, Math.PI * 0.5),
    };
  }
  // Ploskvi prereza plasti vrtenine (kota 0 in 1,5π) med zunanjim (y, r) in notranjim obrisom (yi, ri): k = [[y, r, yi, ri], …].
  // Brez pasov dobi atribut aRez (s vzdolž obrisa, t 0 zunaj … 1 znotraj); s pasovi [[t0, t1, barva], …] barve oglišč.
  function pas(k, x, pasovi) {
    const pos = [], rez = [], col = [], idx = [], c = new THREE.Color();
    const vrste = pasovi || [[0, 1, null]];
    for (const f of [0, Math.PI * 1.5]) {
      const sf = Math.sin(f), cf = Math.cos(f);
      for (const [t0, t1, barva] of vrste) {
        if (barva != null) c.set(barva);
        const off = pos.length / 3;
        let s = f * 3;
        k.forEach((p, i) => {
          if (i) s += Math.hypot(p[0] - k[i - 1][0], p[1] - k[i - 1][1]);
          for (const t of [t0, t1]) {
            const y = p[0] + (p[2] - p[0]) * t, r = p[1] + (p[3] - p[1]) * t;
            pos.push(x + r * sf, y, r * cf);
            if (pasovi) col.push(c.r, c.g, c.b); else rez.push(s, t);
          }
        });
        for (let i = 0; i < k.length - 1; i++) { const a = off + i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    if (pasovi) g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    else g.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Ploščata membranska vrečka (disk, guba) okoli osi y: zgornja ploskev, zaobljen rob, spodnja ploskev.
  // Rf(f) = polmer v smeri f (Lathe: x = r sin f, z = r cos f), h = pol debeline, kot f0 … f1.
  const nRob = hi ? 6 : 4;
  function obris(R, h) {
    const a = Math.max(0, R - h), o = [[0, h], [a, h]];
    for (let i = 1; i < nRob; i++) { const t = Math.PI / 2 - (Math.PI * i) / nRob; o.push([a + h * Math.cos(t), h * Math.sin(t)]); }
    o.push([a, -h], [0, -h]);
    return o;
  }
  function vrecka(Rf, h, f0, f1, nf) {
    const n = nRob + 3;
    return ploskev(nf, n - 1, (u, v, P) => {
      const f = f0 + (f1 - f0) * u, [r, y] = obris(Rf(f), h)[Math.round(v * (n - 1))];
      P.set(r * Math.sin(f), y, r * Math.cos(f));
    });
  }
  // Ploskvi prereza vrečke na kotih 0 in 1,5π: aRez = (r, t), t = 0 spodnja … 1 zgornja membrana.
  function rezVrecke(Rf, h) {
    const geos = [];
    for (const f of [0, Math.PI * 1.5]) {
      const R = Rf(f), a = Math.max(0, R - h), rr = [0, a * 0.5, a];
      for (let i = 1; i <= nRob / 2; i++) rr.push(a + h * Math.sin((Math.PI / 2) * (i / (nRob / 2))) * 0.999);
      geos.push(ploskev(rr.length - 1, 2, (u, v, P) => {
        const r = rr[Math.round(u * (rr.length - 1))], hh = r <= a ? h : Math.sqrt(Math.max(0, h * h - (r - a) * (r - a)));
        P.set(r * Math.sin(f), -hh + 2 * hh * v, r * Math.cos(f));
      }, (u, v) => [rr[Math.round(u * (rr.length - 1))], v]));
    }
    return zdruzi(geos);
  }
  // Je točka (x, z) glede na os X v odrezani četrtini (x < X, z > 0), z robom m?
  const vCetrtini = (x, z, X, m = 0) => x - X < m && z > -m;

  // ---------- obrisa celic (polmer v odvisnosti od višine y) ----------
  const PAL = [[0, -0.955], [0.035, -0.95], [0.055, -0.925], [0.06, -0.89], [0.05, -0.855], [0.022, -0.83], [0.02, -0.75], [0.02, -0.65],
    [0.06, -0.615], [0.098, -0.57], [0.103, -0.53], [0.094, -0.49], [0.05, -0.457], [0.03, -0.432], [0.03, -0.385],
    [0.05, -0.355], [0.062, -0.3], [0.066, -0.1], [0.076, -0.02], [0.078, 0.1], [0.07, 0.155], [0.045, 0.183], [0.021, 0.198],
    [0.05, 0.214], [0.069, 0.236], [0.069, 0.6], [0.069, 0.925], [0.05, 0.952], [0, 0.962]];
  const CEP = [[0, -0.955], [0.1, -0.95], [0.158, -0.94], [0.165, -0.915], [0.13, -0.893], [0.06, -0.868], [0.028, -0.84], [0.025, -0.7], [0.025, -0.585],
    [0.07, -0.555], [0.118, -0.51], [0.128, -0.46], [0.122, -0.41], [0.112, -0.365], [0.13, -0.33], [0.15, -0.25],
    [0.185, -0.12], [0.195, -0.02], [0.18, 0.06], [0.13, 0.108], [0.06, 0.128], [0.023, 0.138],
    [0.1, 0.151], [0.134, 0.165], [0.1, 0.33], [0.066, 0.46], [0.04, 0.5], [0, 0.512]];
  const DM = 0.011; // debelina membrane v prerezu (močno povečana)
  // gost obris iz kontrolnih točk (r, y) → [[y, r, yi, ri], …]; (yi, ri) je notranji rob membrane, odmaknjen za DM
  // vzdolž normale obrisa (tudi na vodoravnih delih, npr. dno končiča, je membrana enako debela).
  function gost(ctrl, n) {
    const c = new THREE.SplineCurve(ctrl.map(([r, y]) => new THREE.Vector2(r, y)));
    const p = c.getSpacedPoints(n).map((v) => [v.y, Math.max(0, v.x)]);
    for (let i = 1; i < p.length; i++) if (p[i][0] <= p[i - 1][0]) p[i][0] = p[i - 1][0] + 1e-5;
    return p.map(([y, r], i) => {
      const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)];
      let tr = b[1] - a[1], ty = b[0] - a[0];
      const l = Math.hypot(tr, ty) || 1;
      tr /= l; ty /= l;
      return [y, r, y + tr * DM, Math.max(0, r - ty * DM)];
    });
  }
  const vY = (P, y) => {
    for (let i = 1; i < P.length; i++) if (P[i][0] >= y) {
      const t = (y - P[i - 1][0]) / (P[i][0] - P[i - 1][0]);
      return P[i - 1].map((v, k) => v + (P[i][k] - v) * t);
    }
    return P[P.length - 1].slice();
  };
  function kos(P, y0, y1) {
    const out = [vY(P, y0)];
    for (const p of P) if (p[0] > y0 + 1e-4 && p[0] < y1 - 1e-4) out.push(p);
    out.push(vY(P, y1));
    return out;
  }
  const XP = -0.33, XC = 0.3; // osi celic
  const Ppal = gost(PAL, q(200)), Pcep = gost(CEP, q(200));
  const rPal = (y) => vY(Ppal, y)[1], rCep = (y) => vY(Pcep, y)[1];
  const nKot = q(48);

  // ---------- membrana: steklo, v prerezu debel lipidni dvosloj; znotraj temna citoplazma ----------
  const kosi = {}; // id kosa → { odprta, pokrov, notranja, notrPok, pasovi }
  function zgradiKos(id, P, y0, y1, x) {
    const k = kos(P, y0, y1);
    const v = vrtenina(k.map((p) => [p[0], p[1]]), nKot);
    const vin = vrtenina(k.filter((p, i) => i % 2 === 0 || i === k.length - 1).map((p) => [p[2], p[3]]), q(32));
    const e = kosi[id] || (kosi[id] = { odprta: [], pokrov: [], notranja: [], notrPok: [], pasovi: [] });
    e.odprta.push(v.odprta.translate(x, 0, 0));
    e.pokrov.push(v.pokrov.translate(x, 0, 0));
    e.notranja.push(vin.odprta.translate(x, 0, 0));
    e.notrPok.push(vin.pokrov.translate(x, 0, 0));
    e.pasovi.push(pas(k, x));
  }
  const MEJE = { pal: [-0.955, -0.83, -0.36, 0.198, 0.962], cep: [-0.955, -0.84, -0.36, 0.138, 0.512] };
  const IDS = ["koncic", "telo", "notranji", "zunanji"];
  for (const [P, M, x, ime] of [[Ppal, MEJE.pal, XP, "pal"], [Pcep, MEJE.cep, XC, "cep"]]) {
    for (let i = 0; i < 4; i++) zgradiKos(IDS[i] === "zunanji" ? "zunanji-" + ime : IDS[i], P, M[i], M[i + 1], x);
  }
  // rob stekla v barvi dela: zunanji členek paličice vijoličen, čepka zlat, notranji členek in telo modra, končič rožnat
  const ROB = { koncic: "#ff9ed2", telo: "#8fd0ff", notranji: B.membranaRob, "zunanji-pal": "#c9a6ff", "zunanji-cep": "#ffd98a" };
  const dvoMat = V.dvoslojMat(DM);
  const citMat = mat(0x3d3180, { roughness: 0.62, clearcoat: 0.25, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide });
  const memM = {}, pokrovi = [], pasovi = [], vseNotr = [], vsiNotrPok = [];
  for (const id of Object.keys(kosi)) {
    const m = V.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.14, rf: 110, k: 0.8, rob: ROB[id], rk: 1.3 });
    const zun = new THREE.Mesh(zdruzi(kosi[id].odprta), m), pk = new THREE.Mesh(zdruzi(kosi[id].pokrov), m);
    const ps = new THREE.Mesh(zdruzi(kosi[id].pasovi), dvoMat);
    memM[id] = { zun, pk, ps };
    pokrovi.push(pk);
    pasovi.push(ps);
    vseNotr.push(...kosi[id].notranja);
    vsiNotrPok.push(...kosi[id].notrPok);
    group.add(zun, pk, ps);
  }
  const citM = new THREE.Mesh(zdruzi(vseNotr), citMat), citPok = new THREE.Mesh(zdruzi(vsiNotrPok), citMat);
  group.add(citM, citPok);
  // beljakovine v membrani (kanalčki, črpalke, receptorji)
  const nBelj = { koncic: 70, telo: 90, notranji: 150, "zunanji-pal": 80, "zunanji-cep": 60 };
  const beljT = [], beljTP = [];
  for (const id of Object.keys(memM)) {
    const n = Math.round(nBelj[id] * (hi ? 1 : 0.16));
    beljT.push(...V.posej(memM[id].zun, n));
    beljTP.push(...V.posej(memM[id].pk, Math.max(2, Math.round(n / 3))));
  }
  const nad = (t) => ({ p: t.p.addScaledVector(t.n, 0.0006), n: t.n });
  const belj = V.beljakovine(beljT.map(nad), B.beljakovine, 0.0034, { visina: 1.4 });
  const beljP = V.beljakovine(beljTP.map(nad), B.beljakovine, 0.0034, { visina: 1.4 });
  group.add(belj, beljP);

  // ---------- zunanji členek paličice: prosti diski z rodopsinom (od membrane ločeni) ----------
  const HD = 0.003, RD = rPal(0.6) - DM - 0.0045; // pol debeline in polmer diska
  const nfD = hi ? 36 : 14;
  const diskG = vrecka(() => RD, HD, 0, Math.PI * 1.5, nfD);
  const diskPG = vrecka(() => RD, HD, Math.PI * 1.5, Math.PI * 2, Math.max(3, Math.round(nfD / 3)));
  const diskRG = rezVrecke(() => RD, HD);
  const diskiY = [];
  for (let y = 0.25; y < 0.918; y += 0.0145) diskiY.push(y);
  const KODA_DISK = (mem, lum) => `
    float e = min(R.y, 1.0 - R.y), lu = smoothstep(0.24, 0.36, e);
    bv = mix(${mem}, ${lum}, lu) * (0.9 + 0.2 * zvS(P * 900.0));
    zh = -lu * 0.0003;`;
  const diskMat = mat("#a64fe0", { roughness: 0.34, side: THREE.DoubleSide });
  const diski = new THREE.InstancedMesh(diskG, diskMat, diskiY.length);
  const diskiP = new THREE.InstancedMesh(diskPG, diskMat, diskiY.length);
  const diskiR = new THREE.InstancedMesh(diskRG, rezMat(KODA_DISK("vec3(0.34, 0.1, 0.55)", "vec3(0.93, 0.78, 1.0)"), "disk"), diskiY.length);
  const o = new THREE.Object3D();
  diskiY.forEach((y, i) => {
    o.position.set(XP, y, 0); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix();
    for (const m of [diski, diskiP, diskiR]) m.setMatrixAt(i, o.matrix);
  });
  group.add(diski, diskiP, diskiR);

  // ---------- zunanji členek čepka: gube membrane (na strani −x zrasle z membrano, drugod ločene) ----------
  const HG = 0.0027, REZ_G = 0.0045;
  const gubeG = [], gubePG = [], gubeRG = [];
  const nfG = hi ? 36 : 14;
  for (let y = 0.174; y < 0.49; y += 0.0135) {
    const rin = vY(Pcep, y)[3];
    if (rin < 0.025) continue;
    // pri kotu 1,5π (ravnina prereza z = 0) se guba dotika membrane: tu se vidi, da je guba del celične membrane
    const Rf = (f) => rin - REZ_G * (1 - Math.pow(Math.max(0, Math.cos(f - Math.PI * 1.5)), 6)) + (Math.cos(f - Math.PI * 1.5) > 0.98 ? 0.001 : 0);
    gubeG.push(vrecka(Rf, HG, 0, Math.PI * 1.5, nfG).translate(XC, y, 0));
    gubePG.push(vrecka(Rf, HG, Math.PI * 1.5, Math.PI * 2, Math.max(3, Math.round(nfG / 3))).translate(XC, y, 0));
    gubeRG.push(rezVrecke(Rf, HG).translate(XC, y, 0));
  }
  const gubeMat = mat("#f2b12e", { roughness: 0.34, side: THREE.DoubleSide });
  const gube = new THREE.Mesh(zdruzi(gubeG), gubeMat), gubeP = new THREE.Mesh(zdruzi(gubePG), gubeMat);
  const gubeR = new THREE.Mesh(zdruzi(gubeRG), rezMat(KODA_DISK("vec3(0.62, 0.34, 0.03)", "vec3(1.0, 0.93, 0.68)"), "guba"));
  group.add(gube, gubeP, gubeR);

  // ---------- povezovalni cilij (9 dvojčkov mikrotubulov), bazalno telesce s centriolo in korenina ----------
  const CIL = "#5fe3ff";
  const cilK = [], cilKC = []; // [{ k: krivulja, r: polmer }]
  const cevka = (a, b, r, k = cilK) => k.push({ k: new THREE.LineCurve3(a, b), r });
  const FR = Math.PI * 0.75, ROK = 0.02; // smer korenine (v zadnjem, vidnem delu celice)
  for (const [X, y0, y1, yJ] of [[XP, 0.168, 0.243, -0.47], [XC, 0.108, 0.165, -0.384]]) {
    const yb = y0 - 0.024;
    for (let i = 0; i < 9; i++) {
      const f = (i / 9) * Math.PI * 2 + 0.2, sf = Math.sin(f), cf = Math.cos(f), tf = [cf, -sf];
      const kam = vCetrtini(sf, cf, 0) ? cilKC : cilK;
      // dvojček A + B v ciliju (do vrha), trojček v bazalnem telescu
      const nC = hi ? 2 : 1, nB = hi ? 3 : 1;
      for (let k = 0; k < nC; k++) {
        const r = 0.0072 + 0.0001 * k, d = (k - 0.5 * (nC - 1)) * 0.0026;
        const px = X + sf * r + tf[0] * d, pz = cf * r + tf[1] * d;
        cevka(v3(px, y0, pz), v3(px, k ? y1 - 0.012 : y1, pz), 0.0012, kam);
      }
      for (let k = 0; k < nB; k++) {
        const r = 0.0085, d = (k - 0.5 * (nB - 1)) * 0.0026, g = f + 0.35;
        const px = X + Math.sin(g) * r + Math.cos(g) * d, pz = Math.cos(g) * r - Math.sin(g) * d;
        cevka(v3(px, yb, pz), v3(px, y0, pz), 0.0012, kam);
      }
      // hčerinska centriola, pravokotno na bazalno telesce (vzdolž z, na strani x > X)
      if (hi) {
        const a = (i / 9) * Math.PI * 2, cx = X + 0.017, cy = yb - 0.006;
        cevka(v3(cx + Math.cos(a) * 0.008, cy + Math.sin(a) * 0.008, -0.016), v3(cx + Math.cos(a) * 0.008, cy + Math.sin(a) * 0.008, 0.004), 0.0012);
      }
    }
    // korenina: progasto vlakno od bazalnega telesca do jedra
    const kx = X + Math.sin(FR) * ROK, kz = Math.cos(FR) * ROK;
    const pts = [];
    for (let i = 0; i <= 8; i++) { const t = i / 8, y = yb + (yJ - yb) * t; pts.push(v3(kx + 0.003 * Math.sin(t * 9) * t - (1 - t) * 0.012 * Math.sin(FR), y, kz + 0.002 * Math.cos(t * 7) * t - (1 - t) * 0.012 * Math.cos(FR))); }
    cilK.push({ k: new THREE.CatmullRomCurve3(pts), r: 0.0022 });
  }
  const snop = (L, seg) => { let i = 0; return V.vlakna(L.map((c) => c.k), () => L[i++].r, CIL, { sij: 0.45, seg, rad: hi ? 6 : 4 }); };
  const cilij = snop(cilK, hi ? 12 : 6), cilijC = snop(cilKC, hi ? 4 : 2);
  group.add(cilij, cilijC);

  // ---------- mitohondriji v elipsoidu notranjega členka; ob ravninah prereza prerezani (kriste) ----------
  const mitK = [];
  const LM = 5.2; // dolžina valja kapsule / polmer
  function polni(X, rF, y0, y1, n, rm) {
    const kx = Math.sin(FR) * ROK, kz = Math.cos(FR) * ROK;
    for (let i = 0, p = 0; i < n && p < 9000; p++) {
      const y = y0 + rnd() * (y1 - y0), a = rnd() * Math.PI * 2, rr = (rF(y) - DM - rm * 1.15) * Math.sqrt(rnd());
      let dx = Math.sin(a) * rr, dz = Math.cos(a) * rr, tip = "cel";
      if (Math.hypot(dx - kx, dz - kz) < rm + 0.004) continue; // korenina cilija
      if (vCetrtini(dx, dz, 0, rm)) {
        if (dz >= rm && dx > -rm * 1.6) { dx = 0; tip = "x"; }
        else if (dx <= -rm && dz < rm * 1.6) { dz = 0; tip = "z"; }
        else if (dx >= 0 && dz <= 0) { if (rm - dx < rm + dz) dx = rm * 1.02; else dz = -rm * 1.02; }
        else tip = "skrit";
      }
      const pos = v3(X + dx, y, dz);
      const L = rm * (LM / 2 + 1);
      if (mitK.some((m) => Math.hypot(m.p.x - pos.x, m.p.z - pos.z) < (rm + m.s) * 1.05 && Math.abs(m.p.y - pos.y) < L + m.s * (LM / 2 + 1))) continue;
      mitK.push({ p: pos, s: rm * (0.9 + 0.2 * rnd()), tip, nag: tip === "cel" ? [(rnd() - 0.5) * 0.2, (rnd() - 0.5) * 0.2] : [0, 0] });
      i++;
    }
  }
  polni(XP, rPal, -0.035, 0.1, hi ? 60 : 34, 0.0072);
  polni(XC, rCep, -0.18, 0.035, hi ? 160 : 80, 0.0092);
  const radM = hi ? 12 : 8;
  const kapsula = new THREE.CapsuleGeometry(1, LM, hi ? 4 : 2, radM);
  const polKaps = odrezi(new THREE.CapsuleGeometry(1, LM, hi ? 4 : 2, radM), (c) => c.x < -1e-4);
  const kapaM = ploskev(hi ? 28 : 14, hi ? 6 : 4, (u, v, P) => {
    const y = (u - 0.5) * (LM + 2), ay = Math.max(0, Math.abs(y) - LM / 2), w = Math.sqrt(Math.max(0, 1 - ay * ay)) * 0.999;
    P.set(0, y, (v * 2 - 1) * w);
  });
  const KODA_MITO = `
    float ay = max(abs(P.y) - ${(LM / 2).toFixed(2)}, 0.0), d = 1.0 - length(vec2(P.z, ay));
    float g = zvS(P * 6.0), aa = max(fwidth(P.y), 1e-4);
    bv = vec3(0.86, 0.5, 0.1) * (0.85 + 0.25 * g);
    bv = mix(bv, vec3(0.5, 0.23, 0.04), 1.0 - smoothstep(0.07, 0.11, d));
    bv = mix(bv, vec3(1.0, 0.88, 0.6), smoothstep(0.11, 0.14, d) * (1.0 - smoothstep(0.19, 0.22, d)));
    float cw = 0.85, ci = floor(P.y / cw), xl = (fract(P.y / cw) - 0.5) * cw;
    float reach = mod(ci, 2.0) < 0.5 ? (P.z + 1.0) * 0.5 : (1.0 - P.z) * 0.5;
    float cr = smoothstep(0.11 + aa, 0.11 - aa, abs(xl)) * step(0.14, d) * (1.0 - smoothstep(0.66, 0.74, reach)) * step(abs(P.y), ${(LM / 2 + 0.4).toFixed(2)});
    bv = mix(bv, vec3(1.0, 0.86, 0.48), cr);
    zh = cr * 0.0004 + g * 0.0001;`;
  const mitMat = mat(B.mitohondrij, { roughness: 0.36 });
  const cele = mitK.filter((m) => m.tip === "cel"), pol = mitK.filter((m) => m.tip === "x" || m.tip === "z"), skr = mitK.filter((m) => m.tip !== "cel");
  const mit = new THREE.InstancedMesh(kapsula, mitMat, cele.length);
  const mitPol = new THREE.InstancedMesh(polKaps, mitMat, pol.length);
  const mitRez = new THREE.InstancedMesh(kapaM, rezMat(KODA_MITO, "mito"), pol.length);
  const mitCela = new THREE.InstancedMesh(kapsula, mitMat, skr.length);
  const postavi = (m) => { o.position.copy(m.p); o.rotation.set(m.nag[0], m.tip === "z" ? Math.PI / 2 : 0, m.nag[1]); o.scale.setScalar(m.s); o.updateMatrix(); return o.matrix; };
  cele.forEach((m, i) => mit.setMatrixAt(i, postavi(m)));
  pol.forEach((m, i) => { const M = postavi(m); mitPol.setMatrixAt(i, M); mitRez.setMatrixAt(i, M); });
  skr.forEach((m, i) => mitCela.setMatrixAt(i, postavi(m)));
  group.add(mit, mitPol, mitRez, mitCela);

  // ---------- jedri (prerezani): dvojna ovojnica, kromatin, pri čepku jedrce ----------
  const jedroG = [], jedroPk = [], jedroIn = [], jedroRez = [];
  const JEDRI = [[XP, -0.535, 0.066, 0.085], [XC, -0.458, 0.074, 0.106]];
  const OV_T = "#4a1fa8", OV_S = "#e2d0ff";
  for (const [x, cy, h, r] of JEDRI) {
    const pr = [];
    for (let i = 0; i <= 28; i++) { const t = -1 + (2 * i) / 28; pr.push([cy + t * h, r * Math.sqrt(Math.max(0, 1 - t * t)) * (1 + 0.03 * sum(t * 4, x * 9, 1))]); }
    const k = pr.map(([y, rr]) => [y, rr, cy + (y - cy) * 0.93, rr * 0.93]);
    const v = vrtenina(pr, q(40));
    jedroG.push(v.odprta.translate(x, 0, 0));
    jedroPk.push(v.pokrov.translate(x, 0, 0));
    jedroRez.push(pas(k, x, [[0, 0.3, OV_T], [0.3, 0.7, OV_S], [0.7, 1, OV_T]]));
    jedroIn.push(vrtenina(k.map((p) => [p[2], p[3]]), q(40)).odprta.translate(x, 0, 0));
  }
  const jMat = mat(B.jedro, { roughness: 0.3 });
  const jedro = new THREE.Mesh(zdruzi(jedroG), jMat), jedroPok = new THREE.Mesh(zdruzi(jedroPk), jMat);
  const jedroOvoj = new THREE.Mesh(zdruzi(jedroRez), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  const nuk = new THREE.Mesh(zdruzi(jedroIn), mat(0xa565f0, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  const pore = V.beljakovine(V.posej(jedro, hi ? 110 : 26).map(nad), B.ovojnica, 0.003, { visina: 0.6, razp: 0.25 });
  group.add(jedro, jedroPok, jedroOvoj, nuk, pore);
  // kromatin: paličica ima veliko gostega, temnega kromatina, čepek manj (svetlejše jedro) in vidno jedrce
  const kromG = [];
  function kepa(c, r) {
    const g = new THREE.IcosahedronGeometry(1, hi ? 2 : 1), p = g.attributes.position, w = v3(0, 0, 0);
    for (let i = 0; i < p.count; i++) { w.fromBufferAttribute(p, i); w.multiplyScalar(r * (1 + 0.28 * sum(w.x * 1.8 + c.x * 50, w.y * 1.8 + c.y * 50, w.z * 1.8))); p.setXYZ(i, w.x, w.y * 0.85, w.z); }
    gladka(g);
    return g.translate(c.x, c.y, c.z);
  }
  for (const [[x, cy, h, r], n, rk, rob] of [[JEDRI[0], hi ? 34 : 18, 0.016, 0.72], [JEDRI[1], hi ? 16 : 9, 0.011, 0.86]]) {
    for (let i = 0, p = 0; i < n && p < 600; p++) {
      const rr = rk * (0.6 + 0.8 * rnd()), a = rnd() * Math.PI * 2, t = rnd() * 2 - 1;
      const s = rob * (x === XC ? 0.75 + 0.25 * rnd() : Math.sqrt(rnd()));
      const c = v3(x + Math.sin(a) * r * s * Math.sqrt(1 - t * t), cy + t * h * s * 0.85, Math.cos(a) * r * s * Math.sqrt(1 - t * t));
      if (vCetrtini(c.x, c.z, x, rr * 1.2)) continue;
      kromG.push(kepa(c, rr));
      i++;
    }
  }
  const krom = new THREE.Mesh(zdruzi(kromG), mat(B.kromatin, { roughness: 0.5, clearcoat: 0.5 }));
  const jcG = new THREE.IcosahedronGeometry(1, hi ? 3 : 2), jcP = jcG.attributes.position, jw = v3(0, 0, 0);
  for (let i = 0; i < jcP.count; i++) { jw.fromBufferAttribute(jcP, i); jw.multiplyScalar(0.026 * (1 + 0.14 * sum(jw.x * 2.4 + 3, jw.y * 2.4, jw.z * 2.4))); jcP.setXYZ(i, jw.x, jw.y, jw.z); }
  gladka(jcG);
  const jedrce = new THREE.Mesh(jcG, mat(B.jedrce, { roughness: 0.55, clearcoat: 0.4 }));
  jedrce.position.set(XC + 0.022, -0.452, -0.018);
  group.add(krom, jedrce);

  // ---------- notranji členek: prosti ribosomi (zlate pike) v mioidu pod elipsoidom ----------
  const ribT = [], ribTC = [];
  for (const [X, rF, y0, y1, n] of [[XP, rPal, -0.32, -0.045, hi ? 520 : 170], [XC, rCep, -0.35, -0.19, hi ? 900 : 300]]) {
    for (let i = 0; i < n; i++) {
      const y = y0 + rnd() * (y1 - y0), a = rnd() * Math.PI * 2, rr = (rF(y) - DM - 0.004) * Math.sqrt(rnd());
      const p = v3(X + Math.sin(a) * rr, y, Math.cos(a) * rr);
      (vCetrtini(p.x, p.z, X, 0.002) ? ribTC : ribT).push(p);
    }
  }
  const rib = V.pike(ribT, B.ribosomi, 0.0042, 0.35), ribC = V.pike(ribTC, B.ribosomi, 0.0042, 0.35);
  group.add(rib, ribC);

  // ---------- mikrotubuli v aksonu (od celičnega telesa do končiča) ----------
  const mtK = [];
  for (const [X, y0, y1, r, n] of [[XP, -0.87, -0.62, 0.0062, 4], [XC, -0.88, -0.56, 0.0085, 5]]) {
    for (let i = 0; i < n; i++) {
      const f = 0.15 + (i / (n - 1)) * Math.PI * 1.2, pts = [];
      for (let j = 0; j <= 6; j++) { const t = j / 6, ff = f + 0.25 * Math.sin(t * 5 + i); pts.push(v3(X + Math.sin(ff) * r, y0 + (y1 - y0) * t, Math.cos(ff) * r)); }
      mtK.push(new THREE.CatmullRomCurve3(pts));
    }
  }
  const mikrotubuli = V.vlakna(mtK, 0.0011, B.citoskelet, { sij: 0.5, seg: hi ? 24 : 10, rad: hi ? 5 : 3 });
  group.add(mikrotubuli);

  // ---------- sinaptična končiča: trakovi z mešički, prosti mešički, dendriti sosednjih celic ----------
  const RV = 0.0033;
  const mesT = [], mesTC = [], trakG = [], dendG = [], dendB = [], trakovi = [];
  const BIP = "#ffd34a", HOR = "#6fdc6a";
  function trak(c, f, w, hT, lahkoVidno) {
    // f = smer normale ploščice (v ravnini xz), c = središče dna traku na membrani
    const n = v3(Math.sin(f), 0, Math.cos(f)), t = v3(Math.cos(f), 0, -Math.sin(f));
    trakG.push(new THREE.BoxGeometry(w, hT, 0.0035).rotateY(f).translate(c.x, c.y + hT / 2 + 0.002, c.z));
    trakG.push(new THREE.BoxGeometry(w * 1.1, 0.003, 0.009).rotateY(f).translate(c.x, c.y + 0.0012, c.z)); // lokasta gostota ob membrani
    trakovi.push({ c: c.clone().add(v3(0, hT / 2, 0)), w, hT });
    const nu = hi ? 4 : 3, nv = Math.max(2, Math.round(hT / (2.2 * RV)) - (hi ? 0 : 1));
    for (const s of [-1, 1]) for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
      const u = ((i + 0.5) / nu - 0.5) * w * 0.92, yy = c.y + 0.006 + ((j + 0.5) / nv) * (hT - 0.004);
      mesT.push(c.clone().addScaledVector(t, u).addScaledVector(n, s * (0.00175 + RV + 0.0004)).setY(yy));
    }
    // triada: dva odrastka horizontalnih celic ob traku, med njima dendrit bipolarne celice
    const dno = c.y - 0.004;
    for (const [s, barva, r, glob] of [[-1, HOR, 0.0042, 0.006], [1, HOR, 0.0042, 0.006], [0, BIP, 0.0038, 0.016]]) {
      const tip = c.clone().addScaledVector(t, s * w * 0.42).setY(dno - glob);
      const kon = tip.clone().addScaledVector(t, s * 0.02 + (lahkoVidno ? 0.004 : 0)).setY(-0.98);
      const sr = tip.clone().lerp(kon, 0.5).addScaledVector(n, 0.004);
      dendG.push(cev(new THREE.CatmullRomCurve3([kon, sr, tip]), hi ? 10 : 5, (u) => r * (1 + 0.25 * (1 - u)), hi ? 8 : 5));
      dendB.push(barva);
    }
  }
  // paličica: en trak v okroglem končiču; čepek: več trakov v široki ploščici
  const dnoP = vY(Ppal, -0.955)[2] + 0.0003, dnoC = vY(Pcep, -0.955)[2] + 0.0003;
  trak(v3(XP + 0.006, dnoP, -0.008), -0.53, 0.03, 0.03, true);
  const nTr = hi ? 9 : 6;
  for (let i = 0; i < nTr; i++) {
    const f = 0.25 + (i / (nTr - 1)) * Math.PI * 1.18, rr = i % 2 ? 0.1 : 0.06;
    const c = v3(XC + Math.sin(f) * rr, dnoC + 0.002 * (rr / 0.1), Math.cos(f) * rr);
    trak(c, f + Math.PI / 2, 0.026, 0.024, false);
  }
  // prosti mešički po končiču (ne v trakovih)
  for (const [X, P, y0, y1, n] of [[XP, Ppal, -0.944, -0.87, hi ? 110 : 45], [XC, Pcep, -0.944, -0.9, hi ? 320 : 120]]) {
    for (let i = 0, p = 0; i < n && p < n * 30; p++) {
      const y = y0 + rnd() * (y1 - y0), ri = vY(P, y)[3] - RV * 1.6, a = rnd() * Math.PI * 2, rr = Math.max(0, ri) * Math.sqrt(rnd());
      const v = v3(X + Math.sin(a) * rr, y, Math.cos(a) * rr);
      if (y < vY(P, -0.955)[2] + RV + 0.001 + (X === XC ? 0.0015 : 0)) continue;
      if (trakovi.some((t) => Math.abs(v.y - t.c.y) < t.hT / 2 + RV * 2 && Math.hypot(v.x - t.c.x, v.z - t.c.z) < t.w * 0.6 + RV)) continue;
      (vCetrtini(v.x, v.z, X, RV) ? mesTC : mesT).push(v);
      i++;
    }
  }
  const mesGeo = new THREE.IcosahedronGeometry(RV, hi ? 1 : 0);
  const mesMat = mat(B.mesicki, { roughness: 0.3, clearcoat: 0.8, emissive: new THREE.Color(B.mesicki).multiplyScalar(0.12) });
  const instanci = (geo, m, tocke) => {
    const im = new THREE.InstancedMesh(geo, m, Math.max(1, tocke.length));
    tocke.forEach((p, i) => { o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
    im.count = tocke.length;
    return im;
  };
  const mes = instanci(mesGeo, mesMat, mesT), mesC = instanci(mesGeo, mesMat, mesTC);
  const trakM = new THREE.Mesh(zdruzi(trakG), mat("#ff6b2e", { roughness: 0.4, clearcoat: 0.6, emissive: new THREE.Color("#ff6b2e").multiplyScalar(0.12) }));
  const dendriti = new THREE.Mesh(zdruzi(dendG, dendB), mat(0xffffff, { vertexColors: true, roughness: 0.4, clearcoat: 0.6 }));
  group.add(mes, mesC, trakM, dendriti);

  // rahle razlike v svetlosti med ponovljenimi deli (organeli in mešički niso vsi povsem enaki)
  {
    const c = new THREE.Color();
    group.traverse((m) => {
      if (!m.isInstancedMesh || m.instanceColor) return;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.88 + 0.2 * V.hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
    });
  }

  // ---------- deli ----------
  const mem = (id) => [memM[id].zun, memM[id].pk, memM[id].ps];
  del("zunanji-clenek-palicice", "Zunanji členek paličice", "Dolg valjast vrh paličice; v njem je kup diskov s svetlobnim barvilom.", ROB["zunanji-pal"], mem("zunanji-pal"), [XP + 0.04, 0.75, 0.056]);
  del("diski-rodopsin", "Diski z rodopsinom", "Ploščati membranski mešički, ki prosto ležijo v paličici; rodopsin v njih zazna že zelo šibko svetlobo, a ne loči barv.", "#a64fe0", [diski, diskiP, diskiR], [XP, 0.62, 0.035]);
  del("zunanji-clenek-cepka", "Zunanji členek čepka", "Stožčast vrh čepka; je krajši od zunanjega členka paličice.", ROB["zunanji-cep"], mem("zunanji-cep"), [XC + 0.07, 0.33, 0.06]);
  del("gube-jodopsin", "Membranske gube z jodopsinom", "Pri čepku so diski gube celične membrane; barvilo jodopsin je v treh različicah (za modro, zeleno, rdečo svetlobo), zato vidimo barve.", "#f2b12e", [gube, gubeP, gubeR], [XC - 0.05, 0.28, 0]);
  del("cilij", "Povezovalni cilij", "Tanek most med notranjim in zunanjim členkom iz devetih parov mikrotubulov; po njem potujejo beljakovine za nove diske. Izrašča iz bazalnega telesca, korenina ga sidra v celico.", CIL, [cilij, cilijC], [XP + 0.005, 0.2, -0.005]);
  del("notranji-clenek", "Notranji členek", "Presnovni del čutnice, poln mitohondrijev; izdeluje beljakovine in daje energijo zunanjemu členku.", ROB.notranji, mem("notranji"), [XC + 0.12, -0.2, 0.12]);
  const mT = (pol.find((m) => m.tip === "x" && m.p.x > 0) || pol[0] || cele[0]).p;
  del("mitohondriji", "Mitohondriji", "Gosto zloženi v zgornjem delu notranjega členka (elipsoid); zaznavanje svetlobe porabi veliko energije (ATP). V prerezu se vidijo kriste.", B.mitohondrij, [mit, mitPol, mitRez, mitCela], mT.toArray());
  del("jedro", "Jedro", "Jedro čutnice z dvojno jedrno ovojnico in porami; pri paličici je manjše in temnejše od jedra čepka.", B.jedro, [jedro, jedroPok, jedroOvoj, pore], [XC - 0.1, -0.458, 0]);
  del("nukleoplazma", "Nukleoplazma", "Notranjost jedra z DNK.", "#a565f0", [nuk], [XP - 0.03, -0.52, 0.03]);
  del("kromatin", "Kromatin", "DNK z beljakovinami. Paličica ima veliko gostega kromatina, čepek manj, zato je njegovo jedro svetlejše.", B.kromatin, [krom], [XP + 0.03, -0.53, -0.02]);
  del("jedrce", "Jedrce", "Gosto telesce v jedru čepka, kjer nastajajo ribosomi.", B.jedrce, [jedrce], jedrce.position.toArray());
  del("celicno-telo", "Celično telo in akson", "Del celice z jedrom; tanko vlakno (akson) ga povezuje s sinaptičnim končičem.", ROB.telo, mem("telo"), [XP + 0.016, -0.72, 0.012]);
  del("citoskelet", "Mikrotubuli v aksonu", "Tanke cevke citoskeleta v aksonu; po njih motorne beljakovine prenašajo mešičke in beljakovine do končiča.", B.citoskelet, [mikrotubuli], [XC + 0.008, -0.7, -0.003]);
  del("sinapticni-koncic", "Sinaptični končič", "Končič odda signal naslednjim živčnim celicam mrežnice; paličica ima majhen okrogel končič, čepek širšo ploščico.", ROB.koncic, mem("koncic"), [XC + 0.14, -0.92, 0.07]);
  del("sinapticni-mesicki", "Sinaptični mešički", "Mešički z živčnim prenašalcem (glutamatom); v temi jih čutnica sprošča največ, svetloba to zmanjša.", B.mesicki, [mes, mesC], [XC + 0.05, -0.915, -0.04]);
  del("sinapticni-trak", "Sinaptični trakovi", "Ploščice, na katere so privezani mešički; trak jih vodi k membrani, da čutnica sprošča glutamat hitro in ves čas, dokler je tema.", "#ff6b2e", [trakM], trakovi[0].c.toArray());
  del("dendriti", "Dendriti sosednjih celic", "V končič se vrivajo odrastki horizontalnih celic (zeleni) in dendriti bipolarnih celic (rumeni); ti sprejmejo glutamat iz čutnice.", "#9ed85a", [dendriti], [XC + 0.03, -0.975, -0.06]);
  del("citoplazma", "Citoplazma", "Notranjost celic, ki povezuje vse dele čutnice.", "#3d3180", [citM, citPok], [XC - 0.12, -0.15, -0.1]);

  // ---------- nadzor ----------
  const samoCela = [...pokrovi, citPok, jedroPok, diskiP, gubeP, beljP, mitCela, cilijC, mesC, ribC];
  const samoPrerez = [...pasovi, jedroOvoj, diskiR, gubeR, mitPol, mitRez];
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Celi celici"]], vrednost: "prerez",
      ob: (v) => {
        const cela = v === "cela";
        for (const m of samoCela) m.visible = cela;
        for (const m of samoPrerez) m.visible = !cela;
      },
    },
  ];
  if (ctx.zacetek && ctx.zacetek.prikaz) nadzor[0].vrednost = ctx.zacetek.prikaz;
  nadzor[0].ob(nadzor[0].vrednost);

  const zat = (p) => 0.8 + 0.2 * Math.min(1, Math.max(0, 0.5 + 0.5 * p.y));
  V.poliraj(group, deli, {
    citoplazma: { tex: "fino", rf: 170, k: 1.1, b: 0.24, lisa: 0.22, f: 14, ao: zat },
    "diski-rodopsin": { tex: "zrna", rf: 420, k: 0.7, b: 0.22 },
    "gube-jodopsin": { tex: "zrna", rf: 420, k: 0.7, b: 0.22 },
    mitohondriji: { tex: "gube", rf: 420, k: 0.8 },
    jedro: { tex: "zrna", rf: 200, k: 1, lisa: 0.1, f: 22 },
    nukleoplazma: { tex: "fino", rf: 240, k: 0.9, b: 0.2, lisa: 0.15, f: 24 },
    kromatin: { tex: "gube", rf: 500, k: 0.7 },
    jedrce: { tex: "gube", rf: 320, k: 1.1 },
    "sinapticni-mesicki": { tex: "zrna", rf: 600, k: 0.4 },
    "sinapticni-trak": { tex: "fino", rf: 500, k: 0.5 },
    dendriti: { tex: "fino", rf: 300, k: 0.8, b: 0.2 },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(deli, {
    "zunanji-clenek-palicice": "#c79be0", "diski-rodopsin": "#8e44ad", "zunanji-clenek-cepka": "#f3d27a", "gube-jodopsin": "#e0a020",
    cilij: "#28b8dc", "notranji-clenek": "#e8809a", "celicno-telo": "#f09cb0", "sinapticni-koncic": "#f6b0c0",
    "sinapticni-mesicki": "#f8de72", "sinapticni-trak": "#d0402f", dendriti: "#7cc464",
  }));

  return {
    group,
    deli,
    nadzor,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81],
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
