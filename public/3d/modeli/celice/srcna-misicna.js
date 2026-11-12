// Srčna mišična celica: razvejana, prečno progasta celica z osrednjim jedrom, povezana s sosednjimi celicami
// prek stopničastih interkalarnih diskov. Okno v celici pokaže miofibrile, mitohondrije in jedri. Pogodba graditelja: docs/3d.md.
// Skupni videz celic iz public/3d/celice-videz.js (paleta kot Bc, ker je B točka v postavitvi).
import { videzCelic, BARVE as Bc } from "../../celice-videz.js";

export const info = {
  id: "celica-srcna-misicna",
  naslov: "Srčna mišična celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Razvejana prečno progasta celica z enim ali dvema jedroma v sredini, polna miofibril in mitohondrijev. S sosedami je povezana z interkalarnimi diski, zato se srce krči kot celota. Sosednje celice so prikazane le delno.",
  poskusi: "Poišči interkalarni disk in preberi, kako se utrip prenese na sosednjo celico.",
  merilo: { m: 120e-6, oznaka: "120 µm" },
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

  const SAR = 2.1 / 60; // dolžina sarkomere v enotah (1 enota = 60 µm)
  const R = 0.165; // polmer celice (≈ 20 µm premera)
  const Y0 = -0.2;
  const telo = new THREE.Group(); // vse, kar utripa
  group.add(telo);
  const Yos = v3(0, 1, 0), Zos = v3(0, 0, 1);
  const hex = (a) => { const c = new THREE.Color(a); return [c.r * 255, c.g * 255, c.b * 255]; };

  // ---------- teksture ----------
  const pas = (v) => { // ena sarkomera, v od Z do Z
    const x = v * 2.1, dc = Math.abs(x - 1.05);
    if (x < 0.06 || x > 2.04) return "z";
    if (dc < 0.8) return dc < 0.035 ? "m" : dc < 0.05 ? "h" : "a";
    return "i";
  };
  // barve, ki jih skupna paleta nima (pas A = miozin magenta, pas I = aktin mentol; enako kot pri skeletnem vlaknu)
  const DISK = "#f1ecff", STIK = "#41e0e8", DEZ = "#6a2fd0", SOS = "#8a7fd8", TC = "#f4f6ff";
  const BP = { z: hex(0x2a1a6e), m: hex(0x6e1a48), h: hex(0xe872a8), a: hex(0xc2306e), i: hex(0xc9f4e2) };
  const mfTex = tekstura(4, 128, (u, v) => BP[pas(v)]);
  const sosTex = tekstura(32, 64, (u, v) => {
    const p = pas(v), k = p === "z" ? 0.72 : p === "a" || p === "m" ? 0.86 : 1, n = 0.94 + 0.06 * sum(u * 20, v * 2, 4);
    return [138 * k * n, 127 * k * n, 216 * k * n];
  });
  // SR okoli miofibril: vzdolžne cevke, ob Z-liniji končne cisterne (diade s T-cevko); T-cevka na Z-liniji
  const srTex = tekstura(64, 128, (u, v) => {
    const d = Math.min(v, 1 - v);
    if (d < 0.035) return [0, 0, 0, 0];
    if (d < 0.08) return [255, 255, 255, 255];
    return Math.abs(Math.sin(u * Math.PI * 7)) > 0.74 || (Math.abs(v - 0.5) < 0.05 && hash(Math.floor(u * 28), 3, 1) > 0.4) ? [255, 255, 255, 255] : [0, 0, 0, 0];
  }, false);
  const tTex = tekstura(4, 128, (u, v) => (Math.min(v, 1 - v) < 0.035 ? [255, 255, 255, 255] : [0, 0, 0, 0]), false);
  for (const t of [srTex, tTex]) { t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; }
  const pikeTex = tekstura(128, 128, (u, v) => {
    const fu = (u * 26) % 1 - 0.5, fv = (v * 26 + (Math.floor(u * 26) % 2) * 0.5) % 1 - 0.5;
    if (fu * fu + fv * fv < 0.1) return hex(0xc2306e);
    const gu = (u * 26 + 0.5) % 1 - 0.5, gv = (v * 26 + 0.5 + (Math.floor(u * 26 + 0.5) % 2) * 0.5) % 1 - 0.5;
    if (gu * gu + gv * gv < 0.02 && hash(Math.floor(u * 26 + 0.5), Math.floor(v * 26), 2) > 0.35) return hex(0xe29424);
    return hex(0x3d3180);
  });

  // ---------- interkalarni disk: stopničasta meja ----------
  const stopnica = (s) => 0.022 * Math.tanh(5 * Math.sin((Math.PI * s) / 0.075));
  function disk(C, n) { const e1 = n.clone().cross(Zos).normalize(); if (e1.lengthSq() < 0.5) e1.set(0, 1, 0); return { C, n: n.clone(), e1, e2: n.clone().cross(e1).normalize() }; }
  function zamakniKonec(g, dk, pogoj) { // premakne oglišča na koncu valja na stopničasto ploskev diska
    const p = g.attributes.position, v = v3(0, 0, 0);
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      if (!pogoj(v)) continue;
      const d = v.clone().sub(dk.C), ax = d.dot(dk.n);
      v.addScaledVector(dk.n, -ax + stopnica(d.dot(dk.e1)));
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
  }
  // organska neravnost površine: premik v smeri stran od osi (enak za vse celice, zato se na diskih ujemajo)
  const izboklina = (p) => R * (0.045 * fbm(p.x * 5 + 11, p.y * 5, p.z * 5) + 0.06 * sum(p.x * 1.7, p.y * 1.7 + 3, p.z * 1.7));
  function nagubaj(g, a, u, merilo = 1) {
    const p = g.attributes.position, v = v3(0, 0, 0), r = v3(0, 0, 0);
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      r.copy(v).sub(a); r.addScaledVector(u, -r.dot(u));
      const rl = r.length();
      if (rl < 1e-6) continue;
      v.addScaledVector(r, (izboklina(a.clone().addScaledVector(u, v.clone().sub(a).dot(u)).addScaledVector(r, R / rl)) * merilo) / R);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }
  // valjast odsek celice od a do b (os y vrtenine → smer a→b); vrne geometrije v koordinatah skupine
  function odsek(a, b, r0, r1, { rez = null, dA = null, dB = null, nKot = 48 } = {}) {
    const smerAB = b.clone().sub(a), L = smerAB.length(), u = smerAB.clone().normalize();
    const prof = (y0, y1) => {
      const p = [];
      const n = Math.max(2, Math.ceil((y1 - y0) / 0.025));
      for (let i = 0; i <= n; i++) {
        let y = y0 + ((y1 - y0) * i) / n;
        if (i === 1 && dA && y0 === 0) y = Math.max(y, 0.05);
        if (i === n - 1 && dB && y1 === L) y = Math.min(y, L - 0.05);
        const t = y / L;
        p.push([y, (r0 + (r1 - r0) * t) * (1 + 0.03 * sum(y * 7 + a.x * 3, a.y * 5, 1))]);
      }
      return p;
    };
    const kv = new THREE.Quaternion().setFromUnitVectors(Yos, u);
    const vSvet = (g) => { g.applyQuaternion(kv); g.translate(a.x, a.y, a.z); return g; };
    const uvPoY = (g) => { // uv.y = dolžina v sarkomerah
      const p = g.attributes.position, t = g.attributes.uv;
      for (let i = 0; i < p.count; i++) t.setY(i, p.getY(i) / SAR);
      return g;
    };
    const konci = (g) => {
      if (dA) zamakniKonec(g, dA, (v) => Math.abs(v.clone().sub(a).dot(u)) < 1e-4);
      if (dB) zamakniKonec(g, dB, (v) => Math.abs(v.clone().sub(a).dot(u) - L) < 1e-4);
      return nagubaj(g, a, u);
    };
    const out = { L, u, kv };
    if (rez) {
      const pr = prof(0, rez), pc = prof(rez, L);
      const v1 = vrtenina(pr, q(nKot)), v2 = vrtenina(pc, q(nKot), false);
      out.odprta = konci(vSvet(uvPoY(v1.odprta)));
      out.pokrov = konci(vSvet(uvPoY(v1.pokrov)));
      out.cela = konci(vSvet(uvPoY(v2.cela)));
      out.notranja = konci(vSvet(vrtenina(pr.map(([y, r]) => [y, r * 0.972]), q(nKot)).odprta));
      out.rob = nagubaj(vSvet(prerezVrtenine(pr, (y, r) => r * 0.972, [[0, 0.08, 0xc8d2ff], [0.08, 0.32, 0x6a4fd0], [0.32, 0.68, 0xe6e0ff], [0.68, 0.92, 0x6a4fd0], [0.92, 1, 0x4a33a8]])), a, u);
      out.prof = pr;
    } else out.cela = konci(vSvet(uvPoY(vrtenina(prof(0, L), q(nKot), false).cela)));
    return out;
  }

  // ---------- postavitev ----------
  const A = v3(-0.6, Y0, 0), B = v3(0.5, Y0, 0), P = v3(0.15, Y0, 0);
  const smerVeje = v3(0.6, 0.8, 0).normalize();
  const Dv = P.clone().addScaledVector(smerVeje, 0.58);
  const X = v3(1, 0, 0);
  const dkA = disk(A, X), dkB = disk(B, X), dkD = disk(Dv, smerVeje);
  const REZ = 0.68; // dolžina okna od diska A
  const glavna = odsek(A, B, R, R * 0.97, { rez: REZ, dA: dkA, dB: dkB, nKot: 64 });
  const veja = odsek(P.clone().addScaledVector(smerVeje, 0.05), Dv, R * 0.88, R * 0.8, { dB: dkD, nKot: 40 });
  const n1 = odsek(v3(-0.93, Y0, 0), A, R * 0.92, R, { dB: dkA, nKot: 40 });
  const n2 = odsek(B, v3(0.9, Y0, 0), R * 0.97, R * 0.93, { dA: dkB, nKot: 40 });
  const n3 = odsek(Dv, Dv.clone().addScaledVector(smerVeje, 0.27), R * 0.8, R * 0.85, { dA: dkD, nKot: 40 });

  const slMat = V.steklo(mat(Bc.membrana, { side: THREE.FrontSide }), { a: 0.16, rf: 60, k: 0.9, rob: Bc.membranaRob, rk: 1.3 });
  const memOdprta = new THREE.Mesh(glavna.odprta, slMat);
  const memCela = new THREE.Mesh(zdruzi([glavna.cela, veja.cela]), slMat);
  const memPokrov = new THREE.Mesh(glavna.pokrov, slMat);
  memPokrov.visible = false;
  const memRob = new THREE.Mesh(glavna.rob, mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  // lok roba na koncu okna in četrtinska ploskev prereza
  const lok = [];
  for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI / 2; lok.push(v3(A.x + REZ, Y0 + Math.sin(a) * R * 0.99, Math.cos(a) * R * 0.99)); }
  const lokRob = new THREE.Mesh(nagubaj(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lok), 24, 0.005, q(6), false), v3(0, Y0, 0), X), memRob.material);
  const cetrt = (() => {
    const pos = [], uv = [], idx = [], nk = q(48), nr = 8;
    for (let i = 0; i <= nr; i++) for (let j = 0; j <= nk; j++) {
      const r = (R * 0.975 * i) / nr, a = (j / nk) * Math.PI * 2, y = Math.sin(a) * r, z = Math.cos(a) * r;
      pos.push(A.x + REZ, Y0 + y, z); uv.push(0.5 + y / (2 * R), 0.5 + z / (2 * R));
    }
    const w = nk + 1;
    for (let i = 0; i < nr; i++) for (let j = 0; j < nk; j++) { const a = i * w + j; idx.push(a, a + w, a + 1, a + 1, a + w, a + w + 1); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    return nagubaj(g, v3(0, Y0, 0), X);
  })();
  const spMat = mat(0x3d3180, { roughness: 0.62, clearcoat: 0.25, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide });
  const spIn = new THREE.Mesh(glavna.notranja, spMat);
  const spCela = new THREE.Mesh(memCela.geometry, spMat); // notranja stena zaprtega dela celice in veje (zadnje ploskve)
  const prerez = new THREE.Mesh(cetrt, mat(0xffffff, { map: pikeTex, roughness: 0.7, clearcoat: 0.15, side: THREE.DoubleSide }));
  telo.add(memOdprta, memCela, memPokrov, memRob, lokRob, spIn, spCela, prerez);
  // beljakovine v sarkolemi
  const nadS = (t) => ({ p: t.p.addScaledVector(t.n, 0.0015), n: t.n });
  const beljS = V.beljakovine([...V.posej(memOdprta, hi ? 320 : 90), ...V.posej(memCela, hi ? 560 : 150)].map(nadS), Bc.beljakovine, 0.0042, { visina: 1.5 });
  telo.add(beljS);

  // sosednje celice (prerezani zunanji konci)
  const sosMat = mat(0xffffff, { map: sosTex, roughness: 0.42, clearcoat: 0.7, sheen: 0.4 });
  const konecSos = (o1, dir, r) => {
    const g = new THREE.CircleGeometry(r, q(32));
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(Zos, dir));
    g.translate(o1.x, o1.y, o1.z);
    return g;
  };
  const sosedje = new THREE.Mesh(zdruzi([n1.cela, n2.cela, n3.cela]), sosMat);
  const sosKonci = new THREE.Mesh(zdruzi([
    konecSos(v3(-0.93, Y0, 0), v3(-1, 0, 0), R * 0.92), konecSos(v3(0.9, Y0, 0), X, R * 0.93),
    konecSos(Dv.clone().addScaledVector(smerVeje, 0.27), smerVeje, R * 0.85),
  ]), mat(0xffffff, { map: pikeTex, roughness: 0.7, clearcoat: 0.15 }));
  telo.add(sosedje, sosKonci);

  // interkalarni diski: stopničasta plošča, rob okoli celice; na disku A presledkovni stiki in dezmosomi
  const dMat = mat(DISK, { roughness: 0.3, clearcoat: 0.9, side: THREE.DoubleSide });
  const diskGeo = [];
  for (const [dk, r] of [[dkA, R * 1.005], [dkB, R * 0.975], [dkD, R * 0.81]]) {
    const n = q(40), g = new THREE.PlaneGeometry(2 * r, 2 * r, n, n), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const s = p.getX(i), t = p.getY(i);
      const w = dk.C.clone().addScaledVector(dk.e1, s).addScaledVector(dk.e2, t).addScaledVector(dk.n, stopnica(s));
      p.setXYZ(i, w.x, w.y, w.z);
    }
    g.computeVertexNormals();
    odrezi(g, (c) => c.clone().sub(dk.C).projectOnPlane(dk.n).length() > r * 0.99);
    diskGeo.push(nagubaj(g, dk.C, dk.n));
    const pts = [];
    for (let i = 0; i <= 200; i++) { const a = (i / 200) * Math.PI * 2, s = Math.cos(a) * r * 1.035, t = Math.sin(a) * r * 1.035; pts.push(dk.C.clone().addScaledVector(dk.e1, s).addScaledVector(dk.e2, t).addScaledVector(dk.n, stopnica(s))); }
    diskGeo.push(nagubaj(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 200, 0.006, q(5), true), dk.C, dk.n));
  }
  const diski = new THREE.Mesh(zdruzi(diskGeo), dMat);
  const stiki = [], dezm = [];
  for (let k = -3; k <= 3; k++) for (let j = -6; j <= 6; j++) {
    const t = j * 0.026, sStik = k * 0.075, sDez = (k + 0.5) * 0.075;
    if (Math.hypot(sStik, t) < R * 0.9) stiki.push(dkA.C.clone().addScaledVector(dkA.e1, sStik).addScaledVector(dkA.e2, t));
    if (Math.hypot(sDez, t) < R * 0.9 && j % 2 === 0) dezm.push(dkA.C.clone().addScaledVector(dkA.e1, sDez).addScaledVector(dkA.e2, t).addScaledVector(dkA.n, stopnica(sDez)));
  }
  const stikM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0055, q(8), q(6)), mat(STIK, { roughness: 0.25, clearcoat: 1, emissive: new THREE.Color(STIK).multiplyScalar(0.25) }), stiki.length);
  stiki.forEach((p, i) => { o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.set(1.6, 1, 1); o.updateMatrix(); stikM.setMatrixAt(i, o.matrix); });
  const dezG = new THREE.CylinderGeometry(0.009, 0.009, 0.026, q(8)).rotateZ(Math.PI / 2);
  const dezM = new THREE.InstancedMesh(dezG, mat(DEZ, { roughness: 0.35, clearcoat: 0.8 }), dezm.length);
  dezm.forEach((p, i) => { o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); dezM.setMatrixAt(i, o.matrix); });
  telo.add(diski, stikM, dezM);

  // ---------- notranjost okna: miofibrile, mitohondriji, jedri ----------
  const vRezu = (y, z) => y > 0.002 && z > 0.002;
  const RF = 0.0125, SPF = 0.038;
  const mfPos = [];
  for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) {
    const y = i * SPF + (j % 2) * SPF * 0.5 + (rnd() - 0.5) * 0.006, z = j * SPF * 0.92 + (rnd() - 0.5) * 0.006;
    if (Math.hypot(y, z) > R * 0.76 || vRezu(y, z)) continue;
    mfPos.push([y, z]);
  }
  const jedra = [[-0.33, 0.085], [-0.13, 0.08]]; // x, polovica dolžine
  const vJedru = (x, y, z, rob = 0) => jedra.some(([cx, h]) => Math.abs(x - cx) < h + rob + 0.03 && Math.hypot(y, z) < 0.042 + rob);
  const LF = REZ + 0.025;
  const mfGeo = new THREE.CylinderGeometry(RF, RF, LF, q(10), 1, true).rotateZ(-Math.PI / 2).translate(A.x + 0.025 + LF / 2, 0, 0);
  { const t = mfGeo.attributes.uv; for (let i = 0; i < t.count; i++) t.setY(i, t.getY(i) * (LF / SAR)); }
  const mfOsn = mfPos.filter(([y, z]) => Math.hypot(y, z) > 0.055);
  // ob jedrih se miofibrile umaknejo (jedri ležita v svetlem pasu sredi celice)
  const mfM = new THREE.InstancedMesh(mfGeo, mat(0xffffff, { map: mfTex, roughness: 0.45, clearcoat: 0.5, sheen: 0.3 }), mfOsn.length);
  const cc = new THREE.Color();
  mfOsn.forEach(([y, z], i) => {
    o.position.set(0, Y0 + y, z); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); mfM.setMatrixAt(i, o.matrix);
    // globlje ležeče miofibrile temnejše (namesto senčenja), rahle razlike med njimi
    const k = (0.62 + 0.38 * Math.min(1, Math.hypot(y, z) / (R * 0.7))) * (0.9 + 0.2 * hash(y * 71, z * 53, 3));
    mfM.setColorAt(i, cc.setRGB(k, k, k));
  });
  telo.add(mfM);
  // mitohondriji v vrstah med miofibrilami (≈ tretjina prostornine) in ob polih jeder
  const mitKos = [];
  const blizuPloskve = (y, z) => (Math.abs(z) < 0.03 && y > -0.02) || (Math.abs(y) < 0.03 && z > -0.02) || (y < 0.02 && z < 0.02 && y > -0.06 && z > -0.06);
  for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) {
    const y = (i + 0.5) * SPF * 0.98, z = (j + 0.5) * SPF * 0.92;
    if (Math.hypot(y, z) > R * 0.74 || vRezu(y, z) || !blizuPloskve(y, z)) continue;
    for (let x = A.x + 0.03; x < A.x + REZ + 0.02; x += SAR * 1.02) {
      if (vJedru(x, y, z, 0.01)) continue;
      mitKos.push([x + (rnd() - 0.5) * 0.004, Y0 + y, z, 1]);
    }
  }
  for (const [cx, h] of jedra) for (const sg of [-1, 1]) for (let k = 0; k < 7; k++) {
    const a = rnd() * Math.PI * 1.5 + Math.PI / 2, rr = 0.02 + rnd() * 0.025;
    const x = cx + sg * (h + 0.02 + rnd() * 0.03);
    if (jedra.some(([c2, h2]) => Math.abs(x - c2) < h2 + 0.01)) continue;
    mitKos.push([x, Y0 + Math.cos(a) * rr, Math.sin(a) * rr, 0.8]);
  }
  const mitM = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.0095, 0.016, 2, q(8)), mat(Bc.mitohondrij, { roughness: 0.36 }), mitKos.length);
  mitKos.forEach(([x, y, z, s], i) => {
    o.position.set(x, y, z); o.rotation.set(rnd() * 0.3, 0, Math.PI / 2); o.scale.set(s, 1, s); o.updateMatrix(); mitM.setMatrixAt(i, o.matrix);
    const k = 0.84 + 0.26 * hash(x * 41, y * 37, z * 29); mitM.setColorAt(i, cc.setRGB(k, k * 0.96, k * 0.92));
  });
  telo.add(mitM);
  // jedri: podolgovati, v sredini celice (prerezani kot celica)
  const jGeo = [], jIn = [], jPok = [];
  for (const [cx, h] of jedra) {
    const pr = [];
    for (let i = 0; i <= 30; i++) { const t = -1 + (2 * i) / 30; pr.push([cx + t * h, 0.04 * Math.sqrt(Math.max(0, 1 - Math.pow(Math.abs(t), 2.2))) + 0.0005]); }
    const v = vrtenina(pr, q(36));
    const k = (g) => g.rotateZ(-Math.PI / 2).translate(0, Y0, 0);
    // vrtenina okoli y z osjo x: y → x zahteva zamenjavo; vrtenino zgradimo ob osi y, nato zavrtimo
    jGeo.push(k(v.odprta)); jPok.push(k(v.pokrov));
    jIn.push(k(vrtenina(pr.map(([y, r]) => [y, r * 0.93]), q(36)).odprta));
  }
  // vrtenina je bila zgrajena ob y z vrednostmi cx ± h, po zasuku ležita jedri ob osi x
  const jMat = mat(Bc.jedro, { roughness: 0.3 });
  const jedroM = new THREE.Mesh(zdruzi(jGeo), jMat), jedroPok = new THREE.Mesh(zdruzi(jPok), jMat);
  jedroPok.visible = false;
  const nukM = new THREE.Mesh(zdruzi(jIn), mat(0xa565f0, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  telo.add(jedroM, jedroPok, nukM);

  // miofibrile tudi v zaprtem delu celice in v veji (vidne skozi stekleno sarkolemo)
  const mfVal = (L) => { const g = new THREE.CylinderGeometry(RF, RF, L, q(10), 1, true), t = g.attributes.uv; for (let i = 0; i < t.count; i++) t.setY(i, t.getY(i) * (L / SAR)); return g; };
  const mfVse = [];
  for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) {
    const y = i * SPF + (j % 2) * SPF * 0.5, z = j * SPF * 0.92;
    if (Math.hypot(y, z) < R * 0.76) mfVse.push([y, z]);
  }
  const x0Z = A.x + REZ + 0.03, LZ = B.x - 0.035 - x0Z;
  const mfZap = new THREE.InstancedMesh(mfVal(LZ).rotateZ(-Math.PI / 2), mfM.material, mfVse.length);
  mfVse.forEach(([y, z], i) => { o.position.set(x0Z + LZ / 2, Y0 + y, z); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); mfZap.setMatrixAt(i, o.matrix); });
  const vZ = P.clone().addScaledVector(smerVeje, 0.2), vK = Dv.clone().addScaledVector(smerVeje, -0.035), LV = vK.distanceTo(vZ), e1V = Zos.clone(), e2V = smerVeje.clone().cross(e1V);
  const mfVej = mfVse.filter(([y, z]) => Math.hypot(y, z) < R * 0.6);
  const mfV = new THREE.InstancedMesh(mfVal(LV), mfM.material, mfVej.length);
  mfVej.forEach(([y, z], i) => { o.position.copy(vZ).lerp(vK, 0.5).addScaledVector(e2V, y).addScaledVector(e1V, z); o.quaternion.setFromUnitVectors(Yos, smerVeje); o.scale.setScalar(1); o.updateMatrix(); mfV.setMatrixAt(i, o.matrix); });
  telo.add(mfZap, mfV);
  // sarkoplazemski retikulum in T-cevke okoli miofibril ob ploskvah prereza
  const mfRob = mfOsn.filter(([y, z]) => blizuPloskve(y, z) && Math.hypot(y, z) > 0.06);
  const ovoj = (r) => { const g = new THREE.CylinderGeometry(r, r, LF, q(14), 1, true).rotateZ(-Math.PI / 2).translate(A.x + 0.025 + LF / 2, 0, 0), t = g.attributes.uv; for (let i = 0; i < t.count; i++) t.setY(i, t.getY(i) * (LF / SAR)); return g; };
  const srM = new THREE.InstancedMesh(ovoj(RF * 1.14), mat(Bc.ger, { alphaMap: srTex, alphaTest: 0.5, roughness: 0.35, clearcoat: 0.7, side: THREE.DoubleSide }), mfRob.length);
  const tM = new THREE.InstancedMesh(ovoj(RF * 1.24), mat(TC, { alphaMap: tTex, alphaTest: 0.5, roughness: 0.3, clearcoat: 0.7, side: THREE.DoubleSide }), mfRob.length);
  mfRob.forEach(([y, z], i) => { o.position.set(0, Y0 + y, z); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); srM.setMatrixAt(i, o.matrix); tM.setMatrixAt(i, o.matrix); });
  // T-cevke na ploskvah prereza: od sarkoleme navznoter ob vsaki Z-liniji
  const tcG = [];
  for (let x = A.x + 0.025 + SAR; x < A.x + REZ; x += SAR) {
    tcG.push(palica(v3(x, Y0 + R * 0.95, 0.002), v3(x, Y0 + 0.03, 0.002), 0.0022, q(5)));
    tcG.push(palica(v3(x, Y0 + 0.002, R * 0.95), v3(x, Y0 + 0.002, 0.03), 0.0022, q(5)));
  }
  const tCev = new THREE.Mesh(zdruzi(tcG), tM.material);
  telo.add(srM, tM, tCev);
  // glikogen: zrnca med miofibrilami v oknu
  const glT = [];
  for (let t = 0; glT.length < (hi ? 1800 : 600) && t < 30000; t++) {
    const y = (rnd() - 0.5) * 2 * R * 0.8, z = (rnd() - 0.5) * 2 * R * 0.8, x = A.x + 0.03 + rnd() * (REZ - 0.01);
    if (Math.hypot(y, z) > R * 0.8 || vRezu(y + 0.004, z + 0.004) || vJedru(x, y, z) || mfOsn.some(([a, b]) => Math.hypot(a - y, b - z) < RF * 1.25)) continue;
    glT.push(v3(x, Y0 + y, z));
  }
  const glikogen = V.pike(glT, Bc.glikogen, 0.0055, 0.35, { lovi: true });
  telo.add(glikogen);

  // ---------- deli ----------
  del("sarkolema", "Sarkolema", "Celična membrana srčne mišične celice (v prerezu dvosloj, debelina povečana); skozi njo vstopajo kalcijevi ioni, ki sprožijo vsak utrip.", "#9fb4ff", [memOdprta, memCela, memPokrov, memRob, lokRob, beljS], [0.25, Y0 - 0.02, R * 1.02]);
  del("sarkoplazma", "Sarkoplazma", "Citoplazma celice z glikogenom in mioglobinom; v prerezu se vidijo konci miofibril in mitohondriji.", "#5b4bb0", [spIn, spCela, prerez], [A.x + REZ + 0.002, Y0 + 0.06, 0.08]);
  del("jedro", "Jedro", "Eno ali dve jedri ležita v sredini celice (pri skeletni mišici so ob robu); celice srca se po rojstvu skoraj ne delijo več.", Bc.jedro, [jedroM, jedroPok], [jedra[0][0], Y0 + 0.03, 0.03]);
  del("nukleoplazma", "Nukleoplazma", "Notranjost jedra z dednim zapisom (DNK).", "#a565f0", [nukM], [jedra[1][0], Y0 + 0.015, 0.012]);
  del("miofibrile", "Miofibrile", "Niti iz zaporedja sarkomer s temnimi in svetlimi pasovi; zato je celica prečno progasta kot skeletna mišica.", "#c2306e", [mfM, mfZap, mfV], [A.x + 0.4, Y0 + 0.1, 0.006]);
  del("sarkoplazemski-retikulum", "Sarkoplazemski retikulum", "Mreža cevk okoli miofibril, ki hrani kalcijeve ione; ob vsakem utripu jih sprosti in sproži krčenje, nato jih načrpa nazaj.", Bc.ger, [srM], [A.x + 0.3, Y0 + (mfRob[0] ? mfRob[0][0] : 0.05), (mfRob[0] ? mfRob[0][1] : 0) + RF * 1.2]);
  del("t-cevke", "T-cevke (prečne cevke)", "Vdolbine sarkoleme ob Z-linijah, ki električni signal hitro prenesejo v notranjost celice do sarkoplazemskega retikuluma.", TC, [tM, tCev], [A.x + 0.025 + SAR * 8, Y0 + R * 0.6, 0.004]);
  del("glikogen", "Glikogen", "Zrnca shranjenega sladkorja med miofibrilami; srce ga porabi, ko mu za trenutek zmanjka kisika ali glukoze iz krvi.", Bc.glikogen, [glikogen], (glT.find((p) => Math.abs(p.z) < 0.01 && p.y > Y0 + 0.05) || glT[0]).toArray());
  del("mitohondriji", "Mitohondriji", "Zavzemajo okoli tretjino celice, ker srce dela vse življenje brez počitka in potrebuje veliko ATP.", Bc.mitohondrij, [mitM], (mitKos.find((m) => m[2] > -0.005 && m[2] < 0.01 && m[1] > Y0 + 0.08 && m[0] > A.x + 0.45) || mitKos[0]).slice(0, 3));
  del("presledkovni-stiki", "Presledkovni stiki", "Kanalčki v interkalarnem disku, skozi katere ioni neposredno prehajajo v sosednjo celico; zato se električni signal takoj razširi naprej.", STIK, [stikM], stiki[Math.floor(stiki.length * 0.6)].toArray());
  del("dezmosomi", "Dezmosomi", "Gumbasti stiki v interkalarnem disku, ki sosednji celici trdno spnejo, da se pri močnem krčenju ne razmakneta.", DEZ, [dezM], dezm[Math.floor(dezm.length * 0.6)].toArray());
  del("interkalarni-disk", "Interkalarni disk", "Stopničasta meja med sosednjima celicama; v njej so dezmosomi in presledkovni stiki, ki celice povežejo v mrežo, ki se krči kot celota.", DISK, [diski], dkA.C.clone().addScaledVector(dkA.e1, 0.07).addScaledVector(dkA.e2, 0.07).addScaledVector(dkA.n, stopnica(0.07) + 0.004).toArray());
  del("sosednje-celice", "Sosednje celice", "Srčne mišične celice so razvejane in povezane v mrežo; ko se vzburi ena, se signal razširi na vse.", SOS, [sosedje, sosKonci], Dv.clone().addScaledVector(smerVeje, 0.15).add(v3(0, 0, R * 0.86)).toArray());

  // ---------- nadzor in utrip ----------
  let utrip = true;
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez",
      ob: (v) => { const cela = v === "cela"; memPokrov.visible = cela; jedroPok.visible = cela; memRob.visible = !cela; lokRob.visible = !cela; prerez.visible = !cela; tCev.visible = !cela; },
    },
    { tip: "stikalo", id: "utrip", oznaka: "Utripanje", vrednost: true, ob: (v) => { utrip = !!v; if (!utrip) telo.scale.set(1, 1, 1); } },
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

  V.poliraj(group, deli, {
    sarkoplazma: { tex: "fino", rf: 120, k: 1.1, b: 0.24, lisa: 0.2, f: 10 },
    jedro: { tex: "zrna", rf: 200, k: 1, lisa: 0.1, f: 20 },
    nukleoplazma: { tex: "fino", rf: 240, k: 0.9, lisa: 0.15, f: 20 },
    miofibrile: { tex: "vlakna", rf: 260, k: 0.7, ton: 0.4 },
    "sarkoplazemski-retikulum": { tex: "fino", rf: 300, k: 0.6 },
    mitohondriji: { tex: "gube", rf: 400, k: 0.8 },
    "interkalarni-disk": { tex: "gube", rf: 90, k: 0.8 },
    "presledkovni-stiki": { tex: null },
    "sosednje-celice": { tex: "zrna", rf: 120, k: 0.8, ton: 0.5 },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(deli, {
    sarkolema: "#e8809a", sarkoplazma: "#f5d6b8", miofibrile: "#e07a8a", "sarkoplazemski-retikulum": "#35c4b0", "t-cevke": "#f8de72",
    glikogen: "#f2ecd6", "interkalarni-disk": "#5e40bd", "presledkovni-stiki": "#35c4dc", dezmosomi: "#2f1e80", "sosednje-celice": "#e8a0b4",
  }));

  return {
    group,
    deli,
    nadzor,
    oder: "celica",
    pogled: [-0.235, 0.423, 0.875],
    korak(t) {
      if (!gib || !utrip) return;
      const f = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * 1.1)), 3), s = 1 - 0.06 * f, g = 1 / Math.sqrt(s);
      telo.scale.set(s, g, g);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
