// Gladka mišična celica: vretenasta celica z osrednjim jedrom in mrežo aktinskih in miozinskih filamentov med gostimi telesci.
// Dva pogleda (cela celica, povečan izsek); drsnik »Krčenje« celico skrajša in odebeli. Pogodba graditelja: docs/3d.md.
// Skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-gladka-misicna",
  naslov: "Gladka mišična celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Vretenasta celica brez prečnih prog z enim osrednjim jedrom; aktinski in miozinski filamenti so pripeti na gosta telesca in tvorijo poševno mrežo. Povečan izsek pokaže notranjost; filamenti in kaveole so narisani debelejši in redkejši kot v resnici.",
  poskusi: "Premikaj drsnik »Krčenje« in primerjaj dolžino celice pred krčenjem in po njem.",
  merilo: { m: 12e-6, oznaka: "12 µm" },
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
  // Odstrani trikotnike, katerih težišče (v koordinatah skupine) izpolni pogoj.
  function odrezi(g, pogoj, premik = new THREE.Vector3()) {
    const p = g.attributes.position, ix = g.index.array, ost = [], a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let i = 0; i < ix.length; i += 3) {
      a.fromBufferAttribute(p, ix[i]); b.fromBufferAttribute(p, ix[i + 1]); c.fromBufferAttribute(p, ix[i + 2]);
      a.add(b).add(c).multiplyScalar(1 / 3).add(premik);
      if (!pogoj(a)) ost.push(ix[i], ix[i + 1], ix[i + 2]);
    }
    g.setIndex(ost);
    return g;
  }
  // Tekstura iz funkcije f(u, v) → [r, g, b, a] (0 … 255).
  function tekstura(w, h, f, barvna = true) {
    const d = new Uint8Array(w * h * 4);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const c = f((i + 0.5) / w, (j + 0.5) / h), k = (j * w + i) * 4;
      d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = c.length > 3 ? c[3] : 255;
    }
    const t = new THREE.DataTexture(d, w, h, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    if (barvna) t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    odpad.push(t);
    return t;
  }
  // valj med točkama a in b
  function palica(a, b, r, n) {
    const d = b.clone().sub(a), L = d.length();
    const g = new THREE.CylinderGeometry(r, r, L, n, 1, true);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), d.normalize()));
    g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    return g;
  }
  // 3/4 krog prereza na koncu izseka (brez četrtine y > 0, z > 0), normala ±x
  function kapa(x, R, sg, nKot, nR) {
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= nR; i++) for (let j = 0; j <= nKot; j++) {
      const r = (R * i) / nR, a = Math.PI / 2 + (j / nKot) * Math.PI * 1.5, y = r * Math.cos(a), z = r * Math.sin(a);
      pos.push(x, y, z); uv.push(0.5 + y / (2 * R), 0.5 + z / (2 * R));
    }
    const w = nKot + 1;
    for (let i = 0; i < nR; i++) for (let j = 0; j < nKot; j++) {
      const a = i * w + j;
      if (sg > 0) idx.push(a, a + 1, a + w, a + 1, a + w + 1, a + w); else idx.push(a, a + w, a + 1, a + 1, a + w, a + w + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  const o = new THREE.Object3D(), smer = new THREE.Vector3();
  const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const nakljucna = (s = 1) => v3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(s * 2);

  const osX = (g) => g.rotateZ(-Math.PI / 2); // vrtenina okoli y → okoli x
  const pikeTex = tekstura(128, 128, (u, v) => {
    const h = hash(Math.floor(u * 42), Math.floor(v * 42), 3), fu = (u * 42) % 1 - 0.5, fv = (v * 42) % 1 - 0.5;
    const pika = h > 0.5 && fu * fu + fv * fv < (h > 0.84 ? 0.1 : 0.05);
    const n = 0.85 + 0.15 * sum(u * 9, v * 9, 1);
    return pika ? (h > 0.84 ? [255, 95, 162] : [79, 224, 176]) : [66 * n, 52 * n, 132 * n];
  });

  // barve, ki jih skupna paleta nima (izbrane za jasen kontrast na vijoličnem odru)
  const AKT = "#4fe0b0", MIO = "#ff5fa2", GT = "#ece6ff", KAV = "#8fb0ff", SOS = "#7d78c4", IF = B.citoskelet, PS = "#ff9b4a";
  // Gradi en pogled. k = enot na µm; R(x) = polmer celice; xr = [od, do]
  function pogled(c) {
    const G = new THREE.Group();
    group.add(G);
    const dl = [], defM = [], defI = [];
    const meji = (geo, mesh) => { defM.push({ mesh, base: Float32Array.from(geo.attributes.position.array) }); return mesh; };
    const dodaj = (m) => { G.add(m); return m; };
    const R = c.R;

    // --- membrana in citoplazma ---
    const prof = [];
    for (let i = 0; i <= c.nProf; i++) { const x = c.xr[0] + (c.xr[1] - c.xr[0]) * (i / c.nProf); prof.push([x, R(x) * (1 + 0.025 * sum(x * 9, 1, 2))]); }
    const v = vrtenina(prof, q(c.nKot));
    const memMat = V.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: c.kape ? 0.13 : 0.2, rf: c.kape ? 24 : 70, k: 0.9, rob: B.membranaRob, rk: 1.3 });
    const memOut = dodaj(meji(osX(v.odprta), new THREE.Mesh(v.odprta, memMat)));
    const pok = dodaj(meji(osX(v.pokrov), new THREE.Mesh(v.pokrov, memMat)));
    pok.visible = false;
    const rg = osX(prerezVrtenine(prof, (y, r) => r * 0.966, [[0, 0.08, 0xc8d2ff], [0.08, 0.32, 0x6a4fd0], [0.32, 0.68, 0xe6e0ff], [0.68, 0.92, 0x6a4fd0], [0.92, 1, 0x4a33a8]]));
    const memRob = dodaj(meji(rg, new THREE.Mesh(rg, mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }))));
    const vin = vrtenina(prof.map(([x, r]) => [x, r * 0.966]), q(c.nKot));
    const citMat = mat(0x3d3180, { roughness: 0.62, clearcoat: 0.25, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide });
    const citIn = dodaj(meji(osX(vin.odprta), new THREE.Mesh(vin.odprta, citMat)));
    const citDeli = [citIn];
    if (c.kape) {
      const km = mat(0xffffff, { map: pikeTex, roughness: 0.6, clearcoat: 0.25, sheen: 0.2 });
      for (const [x, sg] of [[c.xr[0], -1], [c.xr[1], 1]]) {
        const g = kapa(x, R(x) * 0.985, sg, q(36), 8);
        citDeli.push(dodaj(meji(g, new THREE.Mesh(g, km))));
      }
    }

    // --- jedro (vretenasto, osrednje; pri krčenju se zvije kot vijak) ---
    const jp = [];
    for (let i = 0; i <= 40; i++) { const x = c.jx[0] + (c.jx[1] - c.jx[0]) * (i / 40); jp.push([x, c.jR(x)]); }
    if (c.jZapri) jp.push([c.jx[1], 0]);
    const jv = vrtenina(jp, q(c.nKot * 0.6));
    const jMat = mat(B.jedro, { roughness: 0.3 });
    const jOut = dodaj(meji(osX(jv.odprta), new THREE.Mesh(jv.odprta, jMat)));
    const jPok = dodaj(meji(osX(jv.pokrov), new THREE.Mesh(jv.pokrov, jMat)));
    jPok.visible = false;
    const jrg = osX(prerezVrtenine(jp, (y, r) => r * 0.94, [[0, 0.3, 0x34107a], [0.3, 0.42, 0x6a2fd0], [0.42, 0.58, 0xe8d6ff], [0.58, 0.7, 0x6a2fd0], [0.7, 1, 0x34107a]]));
    const jRob = dodaj(meji(jrg, new THREE.Mesh(jrg, mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }))));
    const jiv = vrtenina(jp.map(([x, r]) => [x, r * 0.94]), q(c.nKot * 0.6));
    const jIn = dodaj(meji(osX(jiv.odprta), new THREE.Mesh(jiv.odprta, mat(0xa565f0, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }))));
    const jcx = c.jx[0] + (c.jx[1] - c.jx[0]) * 0.55;
    const jcR = c.jR(jcx) * 0.32;
    const jc = dodaj(new THREE.Mesh(new THREE.SphereGeometry(jcR, q(16), q(12)), mat(B.jedrce, { roughness: 0.55, clearcoat: 0.4 })));
    const jcP = v3(jcx, jcR * 0.55, jcR * 0.55);
    defI.push({ mesh: jc, kos: [{ p: jcP, q: new THREE.Quaternion(), s: v3(1, 1, 1) }], enojen: true, jedro: true });

    // --- gosta telesca in poševna mreža filamentov (kot pleten tulec) ---
    // Obroči vozlov vzdolž celice: sodi obroči so goste ploščice na membrani, lihi gosta telesca v citoplazmi.
    const vRezu = (p) => p.y > 0 && p.z > 0;
    const zJedrom = (p) => {
      if (p.x < c.jx[0] - c.razmik || p.x > c.jx[1]) return false;
      const x = Math.min(Math.max(p.x, c.jx[0]), c.jx[1]);
      return Math.hypot(p.y, p.z) < c.jR(x) + c.razmik * 0.6;
    };
    const vozli = [], obroci = [];
    const nOb = Math.floor((c.xr[1] - c.xr[0]) * 0.94 / c.dx);
    for (let i = 0; i <= nOb; i++) {
      const x0 = c.xr[0] * 0.94 + i * c.dx, ob = [];
      for (let j = 0; j < c.nKrog; j++) {
        const x = x0 + (rnd() - 0.5) * c.dx * 0.3, m = i % 2 === 0;
        const a = ((j + (i % 4 < 2 ? 0 : 0.5)) / c.nKrog) * Math.PI * 2 + (rnd() - 0.5) * 0.25;
        const rr = R(x) * (m ? 0.955 : c.gtR * (0.8 + 0.4 * rnd()));
        const p = v3(x, Math.cos(a) * rr, Math.sin(a) * rr);
        const w = { p, m, a, vRezu: vRezu(p), zJedrom: zJedrom(p) };
        ob.push(w);
        if (!w.zJedrom && R(x) > c.gt * 2.5) vozli.push(w);
      }
      obroci.push(ob);
    }
    const aktG = [], mioG = [], glavG = [];
    function snop(A, B) {
      if (A.zJedrom || B.zJedrom || (A.vRezu && B.vRezu)) return;
      const P = A.p, Q = B.p, d = Q.clone().sub(P), L = d.length(), dn = d.clone().normalize();
      if (vRezu(P.clone().lerp(Q, 0.5))) return;
      for (const t of [0.3, 0.5, 0.7]) if (zJedrom(P.clone().lerp(Q, t))) return;
      const u = v3(0, 1, 0).cross(dn).normalize(), w = dn.clone().cross(u);
      for (let s = 0; s < c.nAkt; s++) {
        const a = (s / c.nAkt) * Math.PI * 2 + 0.4, off = u.clone().multiplyScalar(Math.cos(a) * c.fil * 3.2).addScaledVector(w, Math.sin(a) * c.fil * 3.2);
        aktG.push(palica(P.clone().add(off), P.clone().addScaledVector(dn, L * 0.62).add(off), c.fil, 3));
        aktG.push(palica(Q.clone().sub(off), P.clone().addScaledVector(dn, L * 0.38).sub(off), c.fil, 3));
      }
      const m0 = P.clone().addScaledVector(dn, L * 0.3), m1 = P.clone().addScaledVector(dn, L * 0.7);
      mioG.push(palica(m0, m1, c.fil * 1.9, q(5)));
      if (c.glave) for (let h = 1; h < 8; h++) {
        const t = h / 8, a = h * 2.4, nrm = u.clone().multiplyScalar(Math.cos(a)).addScaledVector(w, Math.sin(a));
        const g = new THREE.SphereGeometry(c.fil * 1.6, 4, 3);
        g.translate(m0.x + (m1.x - m0.x) * t + nrm.x * c.fil * 2.6, m0.y + (m1.y - m0.y) * t + nrm.y * c.fil * 2.6, m0.z + (m1.z - m0.z) * t + nrm.z * c.fil * 2.6);
        glavG.push(g);
      }
    }
    for (let i = 0; i < obroci.length - 1; i++) {
      const A = obroci[i], B = obroci[i + 1], n = c.nKrog, zamik = i % 4 < 2 ? 0 : -1;
      for (let j = 0; j < n; j++) {
        snop(A[j], B[(j + n + zamik) % n]);
        snop(A[j], B[(j + n + zamik + 1) % n]);
      }
    }
    const nPl = vozli.length;
    // samo vidna (ne v odrezanem delu) gosta telesca in ploščice
    for (let i = vozli.length - 1; i >= 0; i--) if (vozli[i].vRezu) vozli.splice(i, 1);
    const aktM = dodaj(new THREE.Mesh(zdruzi(aktG), mat(AKT, { roughness: 0.3, clearcoat: 0.6, emissive: new THREE.Color(AKT).multiplyScalar(0.3) })));
    meji(aktM.geometry, aktM);
    const mioM = dodaj(new THREE.Mesh(zdruzi(mioG.concat(glavG)), mat(MIO, { roughness: 0.3, clearcoat: 0.7, emissive: new THREE.Color(MIO).multiplyScalar(0.16) })));
    meji(mioM.geometry, mioM);

    // gosta telesca (v citoplazmi) in goste ploščice (na membrani)
    const gtGeo = new THREE.SphereGeometry(1, q(9), q(6));
    const gtMat = mat(GT, { roughness: 0.35, clearcoat: 0.8 });
    const gt = dodaj(new THREE.InstancedMesh(gtGeo, gtMat, vozli.length));
    const gtKos = vozli.map((w) => {
      const qq = new THREE.Quaternion();
      if (w.m) qq.setFromUnitVectors(v3(0, 1, 0), v3(0, Math.cos(w.a), Math.sin(w.a)));
      else qq.setFromEuler(new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3));
      return { p: w.p, q: qq, s: w.m ? v3(c.gt * 1.5, c.gt * 0.45, c.gt * 1.1) : v3(c.gt * 1.3, c.gt * 0.85, c.gt * 0.85) };
    });
    defI.push({ mesh: gt, kos: gtKos });

    // mitohondriji ob polih jedra
    const mt = dodaj(new THREE.InstancedMesh(new THREE.CapsuleGeometry(c.mit[0], c.mit[1], q(4), q(10)), mat(B.mitohondrij, { roughness: 0.36 }), c.nMit));
    const mtKos = [];
    for (let i = 0, poskus = 0; i < c.nMit && poskus < 5000; poskus++) {
      const x = c.mitX[0] + (c.mitX[1] - c.mitX[0]) * rnd(), rr = R(x) * c.mitR * Math.sqrt(rnd()), a = rnd() * Math.PI * 2;
      const p = v3(x, Math.cos(a) * rr, Math.sin(a) * rr);
      if (zJedrom(p) || mtKos.some((m) => m.p.distanceTo(p) < c.mit[1] * 0.9) || vozli.some((w) => w.p.distanceTo(p) < c.gt * 2.5)) continue;
      mtKos.push({ p, q: new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), v3(1, (rnd() - 0.5) * 0.4, (rnd() - 0.5) * 0.4).normalize()), s: v3(1, 1, 1) });
      i++;
    }
    mt.count = mtKos.length;
    defI.push({ mesh: mt, kos: mtKos });

    // kaveole: drobne vdolbine membrane v vrstah med gostimi ploščicami
    let kav = null, kavB = null;
    if (c.kaveole) {
      const kosi = [];
      const nVrst = 12;
      for (let r = 0; r < nVrst; r++) {
        const a0 = (r / nVrst) * Math.PI * 2 + 0.11;
        for (let x = c.xr[0] + 0.05; x < c.xr[1] - 0.04; x += 0.035 + rnd() * 0.05) {
          const a = a0 + (rnd() - 0.5) * 0.08, d = v3(0, Math.cos(a), Math.sin(a));
          if (vozli.some((w) => w.m && Math.abs(w.p.x - x) < 0.05 && Math.abs(Math.atan2(Math.sin(w.a - a), Math.cos(w.a - a))) < 0.2)) continue;
          if (d.y > -0.05 && d.z > -0.05) continue;
          kosi.push({ p: v3(x, d.y * R(x) * 1.002, d.z * R(x) * 1.002), q: new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), d), s: v3(1, 1, 1) });
        }
      }
      const kavMat = mat(KAV, { roughness: 0.3, clearcoat: 0.9 });
      kav = dodaj(new THREE.InstancedMesh(new THREE.TorusGeometry(0.011, 0.004, q(4), q(8)), kavMat, kosi.length));
      defI.push({ mesh: kav, kos: kosi });
      kavB = dodaj(new THREE.InstancedMesh(new THREE.SphereGeometry(0.016, q(7), q(5)), kavMat, kosi.length));
      defI.push({ mesh: kavB, kos: kosi.map((k) => ({ p: k.p.clone().multiplyScalar(1).setComponent(1, k.p.y * 0.94).setComponent(2, k.p.z * 0.94), q: k.q, s: v3(1, 1, 1.25) })) });
    }

    // --- dodatni deli povečanega izseka: beljakovine membrane, presledkovni stiki, vmesni filamenti, sarkoplazemski
    //     retikulum, kromatin, zrnati ER z ribosomi in Golgijev aparat ob polu jedra ---
    const belj = [], dodatni = [], jedrniDodatni = [];
    if (c.kape) {
      const gor = v3(0, 1, 0);
      const kosB = V.posej(memOut, hi ? 700 : 200, (p) => !vRezu(p)).map((t) => ({ p: t.p.clone().addScaledVector(t.n, 0.002), n: t.n,
        q: new THREE.Quaternion().setFromUnitVectors(gor, t.n).multiply(new THREE.Quaternion().setFromAxisAngle(gor, rnd() * 6.28)), s: v3(1, 1, 1).multiplyScalar(0.7 + 0.6 * rnd()) }));
      const bm = dodaj(V.beljakovine(kosB, B.beljakovine, 0.009, { visina: 1.5 }));
      belj.push(bm); defI.push({ mesh: bm, kos: kosB });
      // presledkovni stiki: gruče koneksonov na membrani
      const kosK = [];
      for (const [x0, a0] of [[0.3, 2.2], [-0.45, 2.6], [0.65, 3.5]]) for (let i = 0; i < (hi ? 46 : 20); i++) {
        const r = 0.065 * Math.sqrt(rnd()), f = rnd() * 6.28, x = x0 + r * Math.cos(f), a = a0 + (r * Math.sin(f)) / R(x), n = v3(0, Math.cos(a), Math.sin(a));
        kosK.push({ p: v3(x, n.y * R(x) * 1.006, n.z * R(x) * 1.006), q: new THREE.Quaternion().setFromUnitVectors(gor, n), s: v3(1, 1, 1) });
      }
      const kon = dodaj(new THREE.InstancedMesh(new THREE.CylinderGeometry(0.0062, 0.0062, 0.016, 6), mat(PS, { roughness: 0.3, clearcoat: 0.9, emissive: new THREE.Color(PS).multiplyScalar(0.12) }), kosK.length));
      defI.push({ mesh: kon, kos: kosK });
      dodatni.push(["presledkovni-stiki", "Presledkovni stiki", "Gruče beljakovinskih kanalčkov (koneksonov), ki povežejo sosednji celici; skoznje se širi električni signal, zato se celice v steni organa krčijo skupaj.", PS, [kon], kosK[0].p.toArray()]);
      // vmesni filamenti (dezmin): povezujejo gosta telesca med seboj in z gostimi ploščicami na membrani
      const ifK = [];
      for (const w of vozli) {
        if (w.m) continue;
        const bl = vozli.filter((u) => u !== w && u.p.distanceTo(w.p) < c.dx * 1.6).sort((a, b) => a.p.distanceTo(w.p) - b.p.distanceTo(w.p)).slice(0, 3);
        for (const u of bl) {
          if (!u.m && u.p.x < w.p.x) continue; // vsak par telesc enkrat
          const m = w.p.clone().lerp(u.p, 0.5).add(nakljucna(c.gt * 1.4));
          if (vRezu(m) || zJedrom(m)) continue;
          ifK.push(new THREE.CatmullRomCurve3([w.p.clone(), m, u.p.clone()]));
        }
      }
      const ifM = dodaj(V.vlakna(ifK, c.fil * 0.85, IF, { sij: 0.5, seg: hi ? 10 : 6, rad: 3 }));
      meji(ifM.geometry, ifM);
      dodatni.push(["vmesni-filamenti", "Vmesni filamenti", "Čvrste beljakovinske niti (dezmin), ki povezujejo gosta telesca med seboj in z membrano; celico držijo skupaj, da se krči kot celota.", IF, [ifM], ifK[0].getPoint(0.5).toArray()]);
      // sarkoplazemski retikulum: gladke cevke tik pod membrano (ob kaveolah)
      const srK = [];
      for (let t = 0; srK.length < (hi ? 16 : 9) && t < 400; t++) {
        let a = 1.75 + rnd() * 4.3, x = c.xr[0] + 0.08 + rnd() * (c.xr[1] - c.xr[0] - 0.45);
        const pts = [];
        for (let i = 0; i < 7; i++) {
          const rr = R(x) * (0.86 + 0.04 * rnd());
          pts.push(v3(x, Math.cos(a) * rr, Math.sin(a) * rr));
          x += 0.05 + 0.03 * rnd(); a += (rnd() - 0.5) * 0.45;
        }
        if (!pts.some(vRezu)) srK.push(new THREE.CatmullRomCurve3(pts));
      }
      const srM = dodaj(V.vlakna(srK, 0.0075, B.ger, { sij: 0.1, seg: hi ? 26 : 12, rad: hi ? 7 : 4 }));
      meji(srM.geometry, srM);
      dodatni.push(["sarkoplazemski-retikulum", "Sarkoplazemski retikulum", "Gladke membranske cevke tik pod membrano; hranijo kalcijeve ione in jih ob signalu sprostijo v citoplazmo, kar sproži krčenje.", B.ger, [srM], srK[0].getPoint(0.5).toArray()]);
      // kromatin v jedru
      const kromG = [];
      for (let i = 0; i < (hi ? 22 : 10); i++) {
        let x = 0.03 + rnd() * 0.72, a = rnd() * 6.28, r = 0.3 + 0.6 * rnd();
        const pts = [];
        for (let j = 0; j < 6; j++) {
          const rr = c.jR(x) * 0.78 * r;
          const y = Math.cos(a) * rr, z = Math.sin(a) * rr;
          pts.push(v3(x, y, y > 0 && z > 0 ? -z : z));
          x = Math.min(0.82, Math.max(0.02, x + (rnd() - 0.5) * 0.09)); a += (rnd() - 0.5) * 1.1; r = Math.min(1, Math.max(0.2, r + (rnd() - 0.5) * 0.4));
        }
        kromG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(24), 0.0045, hi ? 5 : 3, false));
      }
      const krom = dodaj(new THREE.Mesh(zdruzi(kromG), mat(B.kromatin, { roughness: 0.5, clearcoat: 0.5 })));
      meji(krom.geometry, krom);
      jedrniDodatni.push(krom);
      dodatni.push(["kromatin", "Kromatin", "Niti DNK, navite na beljakovine; vsebujejo navodila za izdelavo beljakovin, tudi aktina in miozina.", B.kromatin, [krom], [0.35, -0.05, 0.03]]);
      // Golgijev aparat in zrnati ER z ribosomi ob polu jedra (tu celica izdeluje beljakovine)
      const Ga = 2.35, Gp = v3(-0.17, Math.cos(Ga) * 0.25, Math.sin(Ga) * 0.25), Gn = v3(0, Math.cos(Ga), Math.sin(Ga));
      const golGeo = zdruzi([0, 1, 2, 3].map((k) => {
        const g = new THREE.SphereGeometry(1, q(18), q(6)), w = 0.07 - k * 0.006, pa = g.attributes.position, t = v3();
        for (let i = 0; i < pa.count; i++) { t.fromBufferAttribute(pa, i).set(t.x * w, t.y * 0.0055, t.z * w * 0.55); t.y += (k - 1.5) * 0.014 + 7 * t.x * t.x; pa.setXYZ(i, t.x, t.y, t.z); }
        g.computeVertexNormals();
        return g;
      }));
      const golgi = dodaj(new THREE.Mesh(golGeo, mat(B.golgi, { roughness: 0.32 })));
      defI.push({ mesh: golgi, kos: [{ p: Gp, q: new THREE.Quaternion().setFromUnitVectors(gor, Gn.clone().negate()), s: v3(1, 1, 1) }], enojen: true });
      dodatni.push(["golgi", "Golgijev aparat", "Kup sploščenih vrečk ob polu jedra; dodela beljakovine, ki jih celica izloči, na primer za vezivna vlakna med celicami.", B.golgi, [golgi], Gp.toArray()]);
      const erGeo = new THREE.SphereGeometry(1, q(16), q(6));
      { const pa = erGeo.attributes.position, t = v3(); for (let i = 0; i < pa.count; i++) { t.fromBufferAttribute(pa, i).set(t.x * 0.075, t.y * 0.0045, t.z * 0.038); t.y += 5 * t.x * t.x; pa.setXYZ(i, t.x, t.y, t.z); } erGeo.computeVertexNormals(); }
      const erB = V.posej(new THREE.Mesh(erGeo), 150), erKos = [], ribT = [];
      for (let i = 0, t = 0; i < (hi ? 8 : 5) && t < 600; t++) {
        const x = -0.08 - rnd() * 0.36, a = 1.75 + rnd() * 4.3, rr = 0.11 + rnd() * 0.13, p = v3(x, Math.cos(a) * rr, Math.sin(a) * rr);
        if (mtKos.some((m) => m.p.distanceTo(p) < 0.085) || erKos.some((e) => e.p.distanceTo(p) < 0.07) || p.distanceTo(Gp) < 0.1 || zJedrom(p)) continue;
        const qq = new THREE.Quaternion().setFromUnitVectors(gor, v3(0, Math.cos(a), Math.sin(a))).multiply(new THREE.Quaternion().setFromAxisAngle(gor, rnd() * 3));
        erKos.push({ p, q: qq, s: v3(1, 1, 1) }); i++;
        const M = new THREE.Matrix4().compose(p, qq, v3(1, 1, 1));
        for (let j = 0; j < (hi ? 46 : 20); j++) { const b = erB[Math.floor(rnd() * erB.length)]; ribT.push(b.p.clone().addScaledVector(b.n, 0.004).applyMatrix4(M)); }
      }
      const er = dodaj(new THREE.InstancedMesh(erGeo, mat(B.zer, { roughness: 0.35 }), erKos.length));
      defI.push({ mesh: er, kos: erKos });
      const rib = dodaj(V.pike(ribT, B.ribosomi, 0.011, 0.35, { lovi: true }));
      meji(rib.geometry, rib);
      dodatni.push(["zrnati-er", "Zrnati endoplazemski retikulum", "Sploščene membranske vrečke ob polih jedra, posute z ribosomi; v njih nastajajo beljakovine, ki jih celica izloči ali vgradi v membrano.", B.zer, [er], erKos[0].p.toArray()]);
      dodatni.push(["ribosomi", "Ribosomi", "Drobna zrnca, ki po navodilih iz DNK sestavljajo beljakovine, tudi aktin in miozin; sedijo na zrnatem ER ali prosto v citoplazmi.", B.ribosomi, [rib], ribT[0].toArray()]);
      // drobna temna zrnca v citoplazmi (beljakovinski kompleksi, glikogen)
      const prahT = [];
      for (let t = 0; prahT.length < (hi ? 2600 : 900) && t < 60000; t++) {
        const x = c.xr[0] + rnd() * (c.xr[1] - c.xr[0]), a = rnd() * 6.28, rr = R(x) * 0.93 * Math.sqrt(rnd()), p = v3(x, Math.cos(a) * rr, Math.sin(a) * rr);
        if (!vRezu(p) && !zJedrom(p)) prahT.push(p);
      }
      const prah = dodaj(V.pike(prahT, 0x7a68d0, 0.007, 0.5));
      meji(prah.geometry, prah);
    }

    // --- krčenje: skrajšanje, odebelitev (enaka prostornina), zasuk in mehurčki na membrani ---
    const tmp = v3(0, 0, 0);
    function D(p, kc, out, jedro) {
      const s = 1 - c.skrajsaj * kc, g = 1 / Math.sqrt(s);
      const r0 = Math.hypot(p.y, p.z), f0 = Math.atan2(p.z, p.y), Rx = Math.max(R(p.x), 1e-4);
      const mehur = Math.pow(0.5 + 0.5 * Math.sin(p.x * c.mehurK + f0 * 3), 3) * Math.pow(0.5 + 0.5 * Math.sin(p.x * c.mehurK * 0.6 - f0 * 2 + 1), 2);
      const rr = r0 * g * (1 + c.mehur * kc * mehur * Math.pow(Math.min(1, r0 / Rx), 4));
      const fi = f0 + c.zasuk * kc * p.x;
      out.set(p.x * s, Math.cos(fi) * rr, Math.sin(fi) * rr);
      if (jedro) { const a = p.x * c.vijakK; out.y += c.vijak * kc * Math.sin(a); out.z += c.vijak * kc * (Math.cos(a) - 1); }
      return out;
    }
    const jedrni = new Set([jOut, jPok, jRob, jIn, ...jedrniDodatni]);
    const qz = new THREE.Quaternion(), X = v3(1, 0, 0), sTmp = v3();
    function nastavi(kc) {
      for (const { mesh, base } of defM) {
        const pa = mesh.geometry.attributes.position, jd = jedrni.has(mesh);
        for (let i = 0; i < pa.count; i++) {
          tmp.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]);
          D(tmp, kc, tmp, jd);
          pa.setXYZ(i, tmp.x, tmp.y, tmp.z);
        }
        pa.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeBoundingSphere();
      }
      for (const { mesh, kos, enojen, jedro } of defI) {
        kos.forEach((k, i) => {
          D(k.p, kc, tmp, jedro);
          qz.setFromAxisAngle(X, c.zasuk * kc * k.p.x).multiply(k.q);
          sTmp.copy(k.s);
          if (enojen) { mesh.position.copy(tmp); mesh.quaternion.copy(qz); mesh.scale.copy(sTmp); return; }
          o.position.copy(tmp); o.quaternion.copy(qz); o.scale.copy(sTmp); o.updateMatrix();
          mesh.setMatrixAt(i, o.matrix);
        });
        if (!enojen) { mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); }
      }
    }
    // sosednje celice v tkivu (le v pogledu cele celice): zašiljeni konci se prilegajo širšim sredinam sosed
    let sos = null;
    if (c.sosedje) {
      const sg = [];
      for (const [cx, oy, oz, Ln, Rn] of c.sosedje) {
        const pr = [];
        for (let i = 0; i <= 60; i++) { const t = -1 + (2 * i) / 60; pr.push([cx + t * Ln, Rn * Math.pow(Math.max(0, 1 - t * t), 1.15) + 0.0015]); }
        sg.push(osX(vrtenina(pr, q(28), false).cela).translate(0, oy, oz));
      }
      sos = dodaj(new THREE.Mesh(zdruzi(sg), mat(SOS, { roughness: 0.4, clearcoat: 0.6, sheen: 0.4 })));
      meji(sos.geometry, sos);
    }
    nastavi(0);

    const naM = (x, a, f = 1.01) => v3(x, Math.cos(a) * R(x) * f, Math.sin(a) * R(x) * f).toArray();
    const notri = vozli.filter((w) => !w.m && (w.p.y > 0 || w.p.z > 0)).sort((a, b) => Math.abs(a.p.x + 0.3) - Math.abs(b.p.x + 0.3));
    const gtT = (notri[0] || vozli[0]).p;
    dl.push(["membrana", "Celična membrana", c.kaveole ? "Meja celice iz dvosloja fosfolipidov (debelina povečana); drobne vdolbine v njej so kaveole, ki uravnavajo vstop kalcijevih ionov, ti pa sprožijo krčenje." : "Meja celice; na njeno notranjo stran so pripeti filamenti, zato se ob krčenju nagrbanči. Kaveole vidiš v povečanem izseku.", "#9fb4ff", [memOut, memRob, pok, ...belj], naM(c.tMem, -0.9)]);
    dl.push(["citoplazma", "Citoplazma", "Notranjost celice; skoraj vso zapolnjujejo aktinski in miozinski filamenti, zato je v mikroskopu enakomerno svetla, brez prog.", "#5b4bb0", citDeli, c.tCit]);
    dl.push(["jedro", "Jedro", "Eno samo podolgovato jedro leži v sredini celice; ko se celica skrči, se nagrbanči in zvije kot vijak.", B.jedro, [jOut, jRob, jPok], c.tJedro]);
    dl.push(["nukleoplazma", "Nukleoplazma", "Tekočina v notranjosti jedra z dednim zapisom (DNK).", "#a565f0", [jIn], c.tNuk]);
    dl.push(["jedrce", "Jedrce", "Telesce v jedru, kjer nastajajo deli ribosomov.", B.jedrce, [jc], jcP.toArray()]);
    dl.push(["gosta-telesca", "Gosta telesca", "Temna sidrišča v citoplazmi in na membrani; nanje so pripeti aktinski filamenti, ki jih pri krčenju vlečejo skupaj.", GT, [gt], gtT.toArray()]);
    dl.push(["aktin", "Aktinski filamenti (tanki)", "Tanke beljakovinske niti, ki potekajo poševno od gostega telesca do gostega telesca; tvorijo mrežo brez prog.", AKT, [aktM], c.tAkt]);
    dl.push(["miozin", "Miozinski filamenti (debeli)", "Debelejše niti z glavicami, ki se pripenjajo na aktin in ga vlečejo; tako se gosta telesca približajo in celica skrči.", MIO, [mioM], c.tMio]);
    dl.push(["mitohondriji", "Mitohondriji", "Zbrani so predvsem ob polih jedra in dajejo energijo (ATP) za počasno, a vztrajno krčenje.", B.mitohondrij, [mt], (mtKos.find((m) => m.p.y > 0 && m.p.z > 0) || mtKos[0]).p.toArray()]);
    if (sos) dl.push(["sosednje-celice", "Sosednje gladke mišične celice", "V steni črevesa, žil in maternice celice ležijo tesno skupaj in se krčijo hkrati; signal se med njimi širi skozi presledkovne stike.", SOS, [sos], c.tSos]);
    if (c.kaveole) dl.push(["kaveole", "Kaveole", "Drobne vrečaste vdolbine celične membrane; zbirajo ionske kanalčke in signalne beljakovine za sprožitev krčenja.", KAV, [kav, kavB], naM(c.tMem * 0.6, -0.5, 1.02)]);
    for (const d of dodatni) dl.push(d);
    const lastni = [];
    dl.forEach((d) => del(...d, lastni));
    // rahel nagib, da podolgovata celica bolje zapolni zaslon (tudi na telefonu)
    G.rotation.z = c.nagib || 0;
    G.updateMatrix();
    const tBase = lastni.map((d) => v3(...d.tocka));
    const nastaviVse = (kc) => {
      nastavi(kc);
      lastni.forEach((d, i) => { D(tBase[i], kc, tmp, d.id === "jedro" || d.id === "nukleoplazma" || d.id === "jedrce" || d.id === "kromatin"); d.tocka = tmp.applyMatrix4(G.matrix).toArray().map((x) => Math.round(x * 1000) / 1000); });
    };
    lastni.forEach((d, i) => { d.tocka = tBase[i].clone().applyMatrix4(G.matrix).toArray().map((x) => Math.round(x * 1000) / 1000); });
    return { G, deli: lastni, nastavi: nastaviVse, prikaz: (cela) => { pok.visible = cela; jPok.visible = cela; memRob.visible = !cela; jRob.visible = !cela; } };
  }

  // ---------- pogled 1: cela celica (≈ 100 µm × 6 µm; 1 enota = 50 µm) ----------
  const L1 = 0.98;
  const celica = pogled({
    R: (x) => 0.07 * Math.pow(Math.max(0, 1 - Math.pow(x / L1, 2)), 1.15) + 0.0015,
    xr: [-L1, L1], nProf: 120, nKot: 36, rob: 0.0028, kape: false, nagib: 0.28,
    jx: [-0.17, 0.17], jR: (x) => 0.021 * Math.sqrt(Math.max(0, 1 - Math.pow(Math.abs(x / 0.17), 2.4))) + 0.0005, jZapri: false,
    dx: 0.05, nKrog: hi ? 6 : 5, nAkt: hi ? 3 : 2, gtR: 0.55, razmik: 0.008, fil: 0.0011, glave: false, gt: 0.0034,
    nMit: hi ? 22 : 14, mit: [0.004, 0.012], mitX: [-0.34, 0.34], mitR: 0.65, kaveole: false,
    sosedje: [[0.45, -0.075, -0.09, 0.5, 0.058], [-0.45, 0.045, -0.115, 0.5, 0.062], [0.02, -0.125, 0.0, 0.62, 0.062], [-0.5, -0.115, 0.05, 0.44, 0.05], [0.52, 0.085, -0.1, 0.43, 0.05], [-0.02, -0.03, -0.14, 0.66, 0.064], [0.4, -0.2, 0.05, 0.5, 0.055], [0.3, 0.13, -0.08, 0.52, 0.056], [-0.36, 0.15, -0.05, 0.5, 0.055], [0.0, 0.1, -0.24, 0.6, 0.06], [-0.55, -0.22, -0.05, 0.4, 0.05], [0.6, -0.06, -0.24, 0.36, 0.05]],
    tSos: [0.02, -0.19, 0.04],
    skrajsaj: 0.42, mehur: 0.07, mehurK: 40, zasuk: 1.4, vijak: 0.01, vijakK: 34,
    tMem: 0.32, tCit: [-0.5, 0.008, 0.012], tJedro: [0.06, 0.012, 0.016], tNuk: [-0.05, 0.004, -0.01], tAkt: [-0.42, 0.015, 0.02], tMio: [0.45, 0.01, 0.018],
  });
  // ---------- pogled 2: povečan izsek okoli pola jedra (≈ 11 µm × 4,8 µm; 1 enota = 6 µm) ----------
  const L2 = 0.9, R2 = 0.4;
  const izsek = pogled({
    R: () => R2, xr: [-L2, L2], nProf: 60, nKot: 72, rob: 0.006, kape: true, nagib: 0.3,
    jx: [-0.05, L2], jR: (x) => 0.125 * Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, 0.6 - (x + 0.05)) / 0.6, 2.2))) + 0.002, jZapri: true,
    dx: 0.15, nKrog: hi ? 12 : 9, nAkt: hi ? 4 : 3, gtR: 0.6, razmik: 0.06, fil: 0.0042, glave: true, gt: 0.024,
    nMit: hi ? 11 : 8, mit: [0.034, 0.11], mitX: [-0.55, -0.04], mitR: 0.45, kaveole: true,
    skrajsaj: 0.42, mehur: 0.09, mehurK: 9, zasuk: 0.3, vijak: 0.045, vijakK: 7,
    tMem: 0.55, tCit: [-L2 - 0.01, -0.12, -0.2], tJedro: [0.4, 0.09, 0.1], tNuk: [0.5, 0.02, -0.06], tAkt: [-0.3, 0.12, 0.2], tMio: [0.2, 0.25, 0.2],
  });
  celica.G.visible = false;

  let pogledId = "izsek", krc = 0, cela = false;
  const nadzor = [
    {
      tip: "izbira", id: "pogled", oznaka: "Pogled", moznosti: [["izsek", "Povečan izsek"], ["celica", "Cela celica v tkivu"]], vrednost: "izsek",
      ob: (v) => { pogledId = v === "izsek" ? "izsek" : "celica"; celica.G.visible = pogledId === "celica"; izsek.G.visible = !celica.G.visible; },
    },
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez",
      ob: (v) => { cela = v === "cela"; celica.prikaz(cela); izsek.prikaz(cela); },
    },
    {
      tip: "drsnik", id: "krcenje", oznaka: "Krčenje", min: 0, max: 1, korak: 0.01, vrednost: 0,
      ob: (v) => { krc = Math.min(1, Math.max(0, +v || 0)); celica.nastavi(krc); izsek.nastavi(krc); },
    },
    { tip: "izpis", id: "dolzina", oznaka: "Dolžina celice", vrednost: () => `${String(Math.round(100 * (1 - 0.42 * krc))).replace(".", ",")} µm (sproščena 100 µm)` },
  ];
  const z = ctx.zacetek || {};
  for (const n of nadzor) if (n.ob && z[n.id] !== undefined) { n.vrednost = z[n.id]; n.ob(z[n.id]); }

  // rahle razlike v svetlosti med ponovljenimi deli (organeli in beljakovine niso vsi povsem enaki)
  {
    const c = new THREE.Color();
    group.traverse((m) => {
      if (!m.isInstancedMesh || m.instanceColor) return;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.88 + 0.2 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
    });
  }

  // Ploskvi prereza plasti vrtenine (kota 0 in 1,5π) med zunanjim polmerom r in notranjim rNot(y, r);
  // pasovi [[t0, t1, barva], …] od zunaj (t = 0) navznoter (t = 1), npr. lipidni dvosloj membrane.
  function prerezVrtenine(prof, rNot, pasovi) {
    const pos = [], col = [], idx = [], c = new THREE.Color();
    for (const f of [0, Math.PI * 1.5]) for (const [t0, t1, barva] of pasovi) {
      c.set(barva);
      const off = pos.length / 3;
      prof.forEach(([y, r]) => {
        const r0 = Math.min(rNot(y, r), r);
        for (const t of [t0, t1]) { const rr = r + (r0 - r) * t; pos.push(rr * Math.sin(f), y, rr * Math.cos(f)); col.push(c.r, c.g, c.b); }
      });
      for (let i = 0; i < prof.length - 1; i++) { const a = off + i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // lipidni dvosloj: temni plasti glav fosfolipidov, svetlejša sredica iz repov
  function DVOSLOJ(glave, repi) { return [[0, 0.3, glave], [0.3, 0.7, repi], [0.7, 1, glave]]; }

  const vsiDeli = [...celica.deli, ...izsek.deli];
  V.poliraj(group, vsiDeli, {
    citoplazma: { tex: "fino", rf: 46, k: 1.1, b: 0.24, lisa: 0.2, f: 6 },
    jedro: { tex: "zrna", rf: 70, k: 1, lisa: 0.1, f: 9 },
    nukleoplazma: { tex: "fino", rf: 90, k: 0.9, b: 0.2, lisa: 0.15, f: 10 },
    jedrce: { tex: "gube", rf: 160, k: 1 },
    kromatin: { tex: "gube", rf: 260, k: 0.6 },
    mitohondriji: { tex: "gube", rf: 120, k: 0.9 },
    "gosta-telesca": { tex: "zrna", rf: 260, k: 0.6 },
    golgi: { tex: "fino", rf: 200, k: 0.6 },
    "zrnati-er": { tex: "fino", rf: 200, k: 0.6 },
    kaveole: { tex: "zrna", rf: 300, k: 0.5 },
    "presledkovni-stiki": { tex: null },
    "sosednje-celice": { tex: "zrna", rf: 90, k: 0.8, lisa: 0.12, f: 4 },
    aktin: { tex: null },
    miozin: { tex: null },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(vsiDeli, {
    "gosta-telesca": "#3a3a52", aktin: "#d94f4f", miozin: "#4a6fd8", "vmesni-filamenti": "#8fa3cc", "sarkoplazemski-retikulum": "#35c4b0",
    "presledkovni-stiki": "#f2a65a", kaveole: "#c9608a", "sosednje-celice": "#e8a0b4",
  }));

  return {
    group,
    get deli() { return pogledId === "izsek" ? izsek.deli : celica.deli; },
    nadzor,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81],
    get merilo() { return pogledId === "izsek" ? info.merilo : { m: 100e-6, oznaka: "100 µm" }; },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
