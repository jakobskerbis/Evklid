// Listna reža: par fižolastih celic zapiralk v koščku povrhnjice lista. Drsnik »Turgor« reže odpira in zapira.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-zapiralka",
  naslov: "Celici zapiralki in listna reža",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Dve fižolasti celici zapiralki med povrhnjičnimi celicami lista uravnavata listno režo. Ko vanju vstopijo kalijevi ioni in voda, nabreknesta in reža se odpre. V prikazu »Prerez« je sprednja polovica odrezana, da se vidi prerez obeh zapiralk.",
  poskusi: "Premikaj drsnik »Turgor« in opazuj, kdaj se listna reža odpre.",
  merilo: { m: 85e-6, oznaka: "85 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  const V = videzCelic(THREE, { hi, odpad });
  const BARVE_DVOSLOJ = B.dvosloj;
  let seme = 23;
  // ---------- orodja (enaka kot v zivalska.js, z dodatki za ploskve in prereze) ----------
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
  const gladko = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  // mat(barva, { …, zrnje: [vrsta, ponovitev u, ponovitev v, jakost] }): mokra, rahlo prosojna organska površina.
  function mat(barva, o = {}) {
    const { zrnje, ...ost } = o;
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.22,
      sheen: 0.35, sheenColor: new THREE.Color(barva).lerp(new THREE.Color(0xffffff), 0.45).multiplyScalar(0.8), sheenRoughness: 0.45,
    }, ost));
    void zrnje; // relief da V.poliraj (skupni videz), ne normalna mapa
    odpad.push(m);
    return m;
  }
  // ---------- debele membrane (debelina je povečana, da je vidna) ----------
  // Plasti na prerezu od notranje (s = 0) do zunanje strani (s = 1): [s0, s1, barva].
  const _bela = new THREE.Color(0xffffff);
  // dvosloj fosfolipidov: temni glavi ob obeh straneh, svetlejši rep v sredini
  const DVOSLOJ = (b) => { const c = new THREE.Color(b); return [[0, 0.2, c.clone().multiplyScalar(0.58)], [0.34, 0.66, c.clone().lerp(_bela, 0.42)], [0.8, 1, c.clone().multiplyScalar(0.58)]]; };
  // dvojna ovojnica (jedro, mitohondrij): dva dvosloja z ozkim presledkom med njima
  const DVOJNA = (b, vmes) => { const c = new THREE.Color(b), g = c.clone().multiplyScalar(0.55), r = c.clone().lerp(_bela, 0.35), v = new THREE.Color(vmes); return [[0, 0.07, g], [0.12, 0.24, r], [0.29, 0.31, g], [0.38, 0.62, v], [0.69, 0.71, g], [0.76, 0.88, r], [0.93, 1, g]]; };
  // celična stena: celulozna vlakna (rahle proge), na zunanji strani temnejša srednja lamela
  const STENA = (b) => { const c = new THREE.Color(b); return [[0, 0.1, c.clone().lerp(_bela, 0.18)], [0.2, 0.42, c.clone()], [0.5, 0.58, c.clone().multiplyScalar(0.9)], [0.66, 0.86, c.clone().lerp(_bela, 0.1)], [0.93, 1, c.clone().multiplyScalar(0.62)]]; };
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
  // Prerez debele lupine na treh ravninah odrezanega osmega dela (x < 0, y > 0, z > 0).
  // rz(d), rn(d): zunanji in notranji polmer v smeri d (|d| = 1); c: središče; zamik: odmik od ravnine proti gledalcu.
  function prerezLupine(rz, rn, plasti, seg, { c = new THREE.Vector3(), pora = null, zamik = 0 } = {}) {
    const ravnine = [
      [(t) => new THREE.Vector3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)), new THREE.Vector3(-1, 0, 0)],
      [(t) => new THREE.Vector3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0), new THREE.Vector3(0, 0, 1)],
      [(t) => new THREE.Vector3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)), new THREE.Vector3(0, 1, 0)],
    ];
    const geos = ravnine.map(([L, n], k) => {
      const A = [], B = [];
      for (let i = 0; i <= seg; i++) { const d = L(i / seg).normalize(); A.push(d.clone().multiplyScalar(rn(d)).add(c).addScaledVector(n, zamik)); B.push(d.clone().multiplyScalar(rz(d)).add(c).addScaledVector(n, zamik)); }
      return trakPlasti(A, B, n, plasti, pora && ((t) => pora(t, k)));
    });
    return zdruziPlasti(geos);
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
  const matPlasti = (o = {}) => { const m = mat(0xffffff, Object.assign({ vertexColors: true, roughness: 0.5, clearcoat: 0.5, clearcoatRoughness: 0.3, sheen: 0.2, side: THREE.DoubleSide }, o)); m.userData.rez = true; return m; };
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
  // Barve oglišč kot množilnik okoli 1 (material obdrži svojo barvo): rahle lise iz šuma, po želji toplejše/hladnejše.
  // Material mora imeti vertexColors: true in ga ne sme deliti z geometrijo brez barv.
  // mnozi: true pomnoži obstoječe barve oglišč (npr. iz pobarvaj) namesto da jih zamenja.
  function lise(g, { j = 0.14, fr = 3, odtenek = 0.04, temno = null, mnozi = false } = {}) {
    const p = g.attributes.position, a = new Float32Array(p.count * 3), st = mnozi && g.attributes.color;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), n = fbm(x * fr + 3.1, y * fr - 0.7, z * fr + 1.9), h = sum(x * fr * 0.5 - 4, y * fr * 0.5 + 2, z * fr * 0.5);
      const k = (1 + n * j) * (temno ? temno(x, y, z) : 1);
      a[i * 3] = k * (1 + h * odtenek); a[i * 3 + 1] = k; a[i * 3 + 2] = k * (1 - h * odtenek);
      if (st) { a[i * 3] *= st.getX(i); a[i * 3 + 1] *= st.getY(i); a[i * 3 + 2] *= st.getZ(i); }
    }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  }
  // Drobni delci (ribosomi, zrnca, mehurčki) v škatli od a do b, kjer pogoj(p) velja: ikozaedri z rahlo različno barvo in velikostjo.
  function drobci(n, a, b, velikost, material, pogoj, { razlika = 0.25, detajl = 0 } = {}) {
    const m = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, detajl), material, n), ob = new THREE.Object3D(), p = new THREE.Vector3(), c = new THREE.Color();
    let k = 0;
    for (let t = 0; t < n * 80 && k < n; t++) {
      p.set(a.x + (b.x - a.x) * rnd(), a.y + (b.y - a.y) * rnd(), a.z + (b.z - a.z) * rnd());
      if (!pogoj(p)) continue;
      ob.position.copy(p); ob.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6);
      ob.scale.set(1, 0.75 + rnd() * 0.4, 0.8 + rnd() * 0.3).multiplyScalar(velikost * (0.6 + rnd() * 0.8)); ob.updateMatrix();
      m.setMatrixAt(k, ob.matrix); const s = 1 + (rnd() * 2 - 1) * razlika; m.setColorAt(k, c.setRGB(s, s, s)); k++;
    }
    m.count = k; m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere(); m.computeBoundingBox();
    return m;
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
  // Odstrani trikotnike, katerih središče izpolni pogoj f(Vector3) (npr. odprtina, kjer se ploskvi stikata).
  function izrezi(g, f) {
    const p = g.attributes.position, ix = g.index.array, ost = [], c = new THREE.Vector3(), t = new THREE.Vector3();
    for (let i = 0; i < ix.length; i += 3) {
      c.set(0, 0, 0);
      for (let k = 0; k < 3; k++) c.add(t.fromBufferAttribute(p, ix[i + k]));
      if (!f(c.multiplyScalar(1 / 3))) ost.push(ix[i], ix[i + 1], ix[i + 2]);
    }
    g.setIndex(ost);
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
  // Cev vzdolž točk.
  const cev = (pts, r, seg, rad, zaprta = false) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, zaprta), seg, r, rad, zaprta);
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

  // Košček lista je nagnjen proti gledalcu; vse gradimo v skupini »list« (1 enota = 42,5 µm).
  const list = new THREE.Group();
  list.rotation.x = 0.85;
  list.position.y = 0.04;
  group.add(list);
  list.updateMatrix();
  const TT = (v) => (Array.isArray(v) ? new THREE.Vector3(...v) : v.clone()).applyMatrix4(list.matrix).toArray();

  // ---------- celici zapiralki: obroč s središčnico (Bc·cos α, Y0, A·sin α) ----------
  // α ∈ [−π/2, π/2] desna zapiralka, α ∈ [π/2, 3π/2] leva; na α = ±π/2 se stikata.
  const A = 0.4, Y0 = -0.1, R0 = 0.122, V0 = 0.135, T = 0.3;
  let tau = 0.8, prerez = false;
  const zacT = ctx.zacetek && Number.isFinite(+ctx.zacetek.turgor) ? Math.min(1, Math.max(0, +ctx.zacetek.turgor)) : null;
  if (zacT != null) tau = zacT;
  const Bc = (t) => 0.108 + 0.098 * t;
  const rrA = (a) => R0 * (0.56 + 0.44 * Math.abs(Math.cos(a)));
  const rvA = (a) => V0 * (0.62 + 0.38 * Math.abs(Math.cos(a)));
  const UP = new THREE.Vector3(0, 1, 0), _c = new THREE.Vector3(), _n = new THREE.Vector3();
  function okvir(a, t) {
    const b = Bc(t);
    _c.set(b * Math.cos(a), Y0, A * Math.sin(a));
    _n.set(Math.cos(a) / b, 0, Math.sin(a) / A).normalize();
  }
  // plast: 0 zunanja stena, 1 notranja ploskev stene (meja citoplazme), 2 vakuola
  function zapiralka(a, psi, plast, out, t = tau) {
    okvir(a, t);
    let R = rrA(a), V = rvA(a), cx = 0;
    if (plast === 1) { const w = 0.015 + 0.046 * Math.pow(Math.max(0, -Math.cos(psi)), 2); R -= w; V -= 0.015 + 0.008 * Math.max(0, -Math.cos(psi)); }
    if (plast === 2) { const f = 0.5 + 0.2 * t; R = (R - 0.042) * f; V = (V - 0.022) * (f + 0.1); cx = 0.016; }
    return out.copy(_c).addScaledVector(_n, R * Math.cos(psi) + cx).addScaledVector(UP, V * Math.sin(psi));
  }
  const NA = q(150), NP = q(26);
  // v prerezu je odrezana sprednja polovica (z > 0, α ∈ [0, π])
  const zadaj = (n = NA, m = NP, v0 = 0, v1 = Math.PI * 2) => [[Math.PI, Math.PI * 2, Math.round(n * 0.5), v0, v1, m]];
  const spredaj = (n = NA, m = NP, v0 = 0, v1 = Math.PI * 2) => [[0, Math.PI, Math.round(n * 0.5), v0, v1, m]];
  const Pz = (plast) => (u, v, out) => zapiralka(u, v, plast, out);
  const VENT = [Math.PI * 0.62, Math.PI * 1.38]; // trebušna stran (ob reži)

  // stena zapiralke je zelenkasto steklo (vidi se notranjost), prerez stene pa je trden in debel
  const ZID = "#7fc23a", ZID_T = "#4f8a1c";
  const stenaZMat = V.steklo(mat(0x8fd04a), { a: 0.2, rob: "#c4f58a", rk: 1.05, rf: 12, k: 0.7 });
  // citoplazma: temno vijolična notranja ploskev (vidna za kloroplasti), na trebušni strani je ne rišemo (tam je stena)
  const citZMat = mat(0x4a3a9e, { roughness: 0.6, side: THREE.BackSide });
  const ventMat = mat(ZID_T, { roughness: 0.45, clearcoat: 0.5, side: THREE.DoubleSide });
  const vakZMat = mat(new THREE.Color(B.vakuola).multiplyScalar(0.72), { roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.06, emissive: new THREE.Color(B.vakuola).multiplyScalar(0.12) });
  const zg = [];
  function zapiralkaMesh(Pf, krpe, material, red) {
    const m = new THREE.Mesh(ploskev(Pf, krpe, true), material);
    m.renderOrder = red; list.add(m); zg.push([m, Pf]);
    return m;
  }
  const stenaZ = [zapiralkaMesh(Pz(0), zadaj(), stenaZMat, 3), zapiralkaMesh(Pz(0), spredaj(), stenaZMat, 3)];
  const citZ = [zapiralkaMesh(Pz(1), zadaj(q(120), q(16), VENT[1], VENT[0] + Math.PI * 2), citZMat, 2), zapiralkaMesh(Pz(1), spredaj(q(120), q(16), VENT[1], VENT[0] + Math.PI * 2), citZMat, 2)];
  const ventZ = [zapiralkaMesh(Pz(1), zadaj(q(120), q(10), VENT[0], VENT[1]), ventMat, 0), zapiralkaMesh(Pz(1), spredaj(q(120), q(10), VENT[0], VENT[1]), ventMat, 0)];
  const vakZ = [zapiralkaMesh(Pz(2), zadaj(q(110), q(18)), vakZMat, 0), zapiralkaMesh(Pz(2), spredaj(q(110), q(18)), vakZMat, 0)];

  // stena med zapiralkama na obeh koncih
  const koncaMat = mat(ZID_T, { roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide });
  const konca = new THREE.Mesh(zdruzi([0, 1].map(() => new THREE.CircleGeometry(1, q(20)))), koncaMat);
  konca.renderOrder = 1;
  list.add(konca);
  function postaviKonca() {
    const p = konca.geometry.attributes.position, nPol = p.count / 2, v = new THREE.Vector3();
    [Math.PI / 2, -Math.PI / 2].forEach((a, k) => {
      for (let i = 0; i < nPol; i++) {
        const j = k * nPol + i;
        const psi = i === 0 ? 0 : ((i - 1) / (nPol - 2)) * Math.PI * 2, s = i === 0 ? 0 : 1;
        zapiralka(a, psi, 1, v);
        okvir(a, tau);
        v.lerp(_c, prerez && k === 0 ? 1 : 1 - s * 0.98); // sprednja stena je v prerezu odrezana
        p.setXYZ(j, v.x, v.y, v.z);
      }
    });
    p.needsUpdate = true;
    konca.geometry.computeVertexNormals();
    konca.geometry.computeBoundingSphere();
  }
  postaviKonca();

  // kloroplasti in jedri v zapiralkah
  const kloGeo = (() => {
    const g = new THREE.IcosahedronGeometry(1, hi ? 2 : 1);
    const p = g.attributes.position, col = [], c = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const t = 0.5 + 0.5 * sum(p.getX(i) * 3 + 2, p.getY(i) * 3, p.getZ(i) * 3);
      const g2 = 0.5 + 0.5 * sum(p.getX(i) * 9 + 5, p.getY(i) * 9, p.getZ(i) * 9); // grana: temne pege
      c.set(0x6fd047).lerp(new THREE.Color(B.tilakoid), Math.max(gladko(0.5, 0.8, t) * 0.5, gladko(0.62, 0.72, g2) * 0.85)); col.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return g.scale(0.03, 0.014, 0.04);
  })();
  const kloPol = [];
  for (const [a0, a1] of [[-1.25, 1.25], [Math.PI - 1.25, Math.PI + 1.25]]) {
    let k = 0, pk = 0;
    while (k < (hi ? 16 : 12) && pk++ < 3000) {
      const a = a0 + rnd() * (a1 - a0), psi = -0.9 + rnd() * 2.6; // večinoma zgoraj in na hrbtni strani
      const p = zapiralka(a, psi, 1, new THREE.Vector3(), 0.5);
      if (kloPol.some((x) => x.p.distanceTo(p) < 0.062)) continue;
      kloPol.push({ a, psi, p, zas: rnd() * 6, s: 0.85 + rnd() * 0.3 });
      k++;
    }
  }
  const kloroplasti = new THREE.InstancedMesh(kloGeo, mat(0xffffff, { vertexColors: true, roughness: 0.4, clearcoat: 0.7, clearcoatRoughness: 0.12, sheen: 0.4, sheenColor: new THREE.Color(0x9adf80) }), kloPol.length);
  const jedri = new THREE.InstancedMesh(preoblikuj(new THREE.SphereGeometry(1, q(20), q(14)), (v) => v.multiplyScalar(1 + 0.04 * sum(v.x * 3, v.y * 3, v.z * 3))).scale(0.032, 0.04, 0.06),
    mat(B.jedro, { roughness: 0.35, clearcoat: 0.6 }), 2);
  list.add(kloroplasti, jedri);
  // mitohondriji (zapiralki jih imata veliko: ATP za črpalke v membrani)
  const mitPol = [];
  for (const [a0, a1] of [[-1.3, 1.3], [Math.PI - 1.3, Math.PI + 1.3]]) {
    let k = 0, pk = 0;
    while (k < (hi ? 13 : 8) && pk++ < 3000) {
      const a = a0 + rnd() * (a1 - a0), psi = rnd() * Math.PI * 2;
      const p = zapiralka(a, psi, 1, new THREE.Vector3(), 0.5);
      if (kloPol.some((x) => x.p.distanceTo(p) < 0.04) || mitPol.some((x) => x.p.distanceTo(p) < 0.045)) continue;
      mitPol.push({ a, psi, p, zas: rnd() * 6, s: 0.8 + rnd() * 0.4 });
      k++;
    }
  }
  const mitGeo = preoblikuj(new THREE.CapsuleGeometry(0.0065, 0.02, hi ? 4 : 2, hi ? 10 : 6).rotateX(Math.PI / 2),
    (v) => v.multiplyScalar(1 + 0.08 * sum(v.x * 300, v.y * 300, v.z * 300)));
  const mitohondriji = new THREE.InstancedMesh(mitGeo, mat(B.mitohondrij, { roughness: 0.35, clearcoat: 0.8 }), mitPol.length);
  // protonske črpalke in kalijevi kanalčki v membrani (tik pod steno)
  const kanPol = [];
  for (let i = 0; i < (hi ? 260 : 80); i++) {
    const a = rnd() < 0.5 ? -1.45 + rnd() * 2.9 : Math.PI - 1.45 + rnd() * 2.9;
    kanPol.push({ a, psi: rnd() * Math.PI * 2, rot: rnd() * 6.28, s: 0.7 + rnd() * 0.6 });
  }
  const kanalcki = V.beljakovine(kanPol.map(() => ({ p: new THREE.Vector3(), n: UP })), B.beljakovine, 0.0042, { visina: 1.4 });
  list.add(mitohondriji, kanalcki);
  // celulozna vlakna ovijajo zapiralko kot obroči (radialna micelacija): zato se ob nabrekanju podaljša, ne odebeli
  const nObr = hi ? 26 : 14, segObr = hi ? 40 : 20, rObr = 0.0011;
  const obrA = [];
  for (const [a0, a1] of [[-1.44, 1.44], [Math.PI - 1.44, Math.PI + 1.44]]) for (let i = 0; i < nObr; i++) obrA.push(a0 + (a1 - a0) * (i + 0.5) / nObr);
  const obroci = V.vlakna([new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3(0, 0.001, 0))], rObr, "#b8e070", { sij: 0.12, seg: 1, rad: 3 });
  list.add(obroci);
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3(), M4 = new THREE.Matrix4();
  function postaviObroce() {
    const geos = obrA.filter((a) => !(prerez && Math.sin(a) > -0.05)).map((a) => {
      const pts = [];
      for (let i = 0; i < segObr; i++) { const psi = (i / segObr) * Math.PI * 2; zapiralka(a, psi, 0, vA); zapiralka(a, psi, 1, vB); pts.push(vB.clone().lerp(vA, 0.82)); }
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), segObr, rObr, 3, true);
    });
    obroci.geometry.dispose();
    obroci.geometry = zdruzi(geos);
    obroci.geometry.computeBoundingSphere();
  }
  // organel med vakuolo (0) in steno (1) na deležu f, sploščen vzporedno s steno, dolga os vzdolž zapiralke
  function postaviOrganele(mesh, pol, f) {
    pol.forEach((k, i) => {
      zapiralka(k.a, k.psi, 2, vA); zapiralka(k.a, k.psi, 1, vB); vA.lerp(vB, f);
      zapiralka(k.a + 0.01, k.psi, 1, vC); vC.sub(vB).normalize();
      okvir(k.a, tau); const nn = vB.clone().sub(_c).normalize();
      const x = new THREE.Vector3().crossVectors(nn, vC).normalize();
      M4.makeBasis(x, nn, vC);
      o.position.copy(vA); o.quaternion.setFromRotationMatrix(M4); o.rotateY(Math.sin(k.zas) * 0.5);
      const skrit = prerez && Math.sin(k.a) > -0.05; // sprednja polovica je odrezana
      o.scale.setScalar(skrit ? 0.0001 : k.s); o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }
  function postaviNotranjost() {
    postaviOrganele(kloroplasti, kloPol, 0.62);
    postaviOrganele(mitohondriji, mitPol, 0.45);
    kanPol.forEach((k, i) => {
      zapiralka(k.a, k.psi, 1, vB); okvir(k.a, tau);
      const nn = vA.copy(vB).sub(_c).normalize();
      o.position.copy(vB).addScaledVector(nn, -0.0012); o.quaternion.setFromUnitVectors(UP, nn); o.rotateY(k.rot);
      o.scale.setScalar(prerez && Math.sin(k.a) > -0.05 ? 0.0001 : k.s); o.updateMatrix();
      kanalcki.setMatrixAt(i, o.matrix);
    });
    kanalcki.instanceMatrix.needsUpdate = true;
    kanalcki.computeBoundingSphere();
    postaviObroce();
    [[-0.36, 0], [Math.PI + 0.4, 1]].forEach(([a, i]) => {
      zapiralka(a, Math.PI * 0.82, 2, vA); zapiralka(a, Math.PI * 0.82, 1, vB); vA.lerp(vB, 0.5);
      okvir(a, tau);
      o.position.copy(vA); o.rotation.set(0, Math.atan2(_n.x, _n.z), 0); o.scale.setScalar(1); o.updateMatrix();
      jedri.setMatrixAt(i, o.matrix);
    });
    jedri.instanceMatrix.needsUpdate = true;
    jedri.computeBoundingSphere();
  }

  // prerez leve zapiralke na ravnini z = 0 (α = π)
  const kapaMat = [mat(ZID, { roughness: 0.55, clearcoat: 0.35, side: THREE.DoubleSide }),
    mat(0x6a54c8, { roughness: 0.6, clearcoat: 0.3, side: THREE.DoubleSide }), mat(B.vakuola, { roughness: 0.25, clearcoat: 0.8, side: THREE.DoubleSide, emissive: new THREE.Color(B.vakuola).multiplyScalar(0.1) })];
  const kape = kapaMat.map((m) => { const x = new THREE.Mesh(new THREE.BufferGeometry(), m); list.add(x); return x; });
  function obris(plast, a) {
    const pts = [];
    for (let i = 0; i < 48; i++) { zapiralka(a, (i / 48) * Math.PI * 2, plast, vA); pts.push(new THREE.Vector2(vA.x, vA.y)); }
    return pts;
  }
  // celična membrana tik pod steno, vidna na prerezu (debelina povečana)
  const TMZ = 0.0045;
  const memZ = new THREE.Mesh(new THREE.BufferGeometry(), matPlasti({ roughness: 0.55, clearcoat: 0.25 }));
  list.add(memZ);
  const naMembrani = (a, psi, k, out) => { zapiralka(a, psi, 1, out); const c = _c.clone(); return out.addScaledVector(c.sub(out).setZ(0).normalize(), TMZ * k); };
  function postaviMembrano() {
    const geos = [0, Math.PI].map((a) => {
      const A = [], B = [];
      for (let i = 0; i <= 96; i++) { const psi = (i / 96) * Math.PI * 2; B.push(naMembrani(a, psi, 0, new THREE.Vector3()).setZ(0.0026)); A.push(naMembrani(a, psi, 1, new THREE.Vector3()).setZ(0.0026)); }
      return trakPlasti(A, B, new THREE.Vector3(0, 0, 1), DVOSLOJ(BARVE_DVOSLOJ));
    });
    memZ.geometry.dispose(); memZ.geometry = zdruziPlasti(geos); memZ.geometry.computeBoundingSphere();
  }
  function postaviKape() {
    postaviMembrano();
    const oblike = [[], [], []];
    for (const a of [0, Math.PI]) {
      const o0 = obris(0, a), o1 = obris(1, a), o2 = obris(2, a);
      const s0 = new THREE.Shape(o0); s0.holes.push(new THREE.Path(o1.slice().reverse()));
      const s1 = new THREE.Shape(o1); s1.holes.push(new THREE.Path(o2.slice().reverse()));
      oblike[0].push(s0); oblike[1].push(s1); oblike[2].push(new THREE.Shape(o2));
    }
    oblike.forEach((s, i) => {
      kape[i].geometry.dispose();
      kape[i].geometry = proti(new THREE.ShapeGeometry(s, 2).translate(0, 0, 0.0006 * (i + 1)));
    });
  }

  // ---------- povrhnjične celice: sestavljanke okoli zapiralk ----------
  const RP = 0.9, TAU = Math.PI * 2;
  const robLuknje = (a, t, out) => { okvir(a, t); return out.copy(_c).addScaledVector(_n, rrA(a) + 0.004).setY(0); };
  // semena celic (v mirovni legi); šum ukrivi meje v »sestavljanko«
  const semena = [];
  for (let i = 0; i < 10; i++) {
    const f = (i / 10) * TAU + 0.3 + (rnd() - 0.5) * 0.4, r = 0.5 + rnd() * 0.32;
    semena.push(new THREE.Vector2(Math.cos(f) * r * 1.05, Math.sin(f) * r));
  }
  semena.push(new THREE.Vector2(0.0, 0.92), new THREE.Vector2(0.0, -0.92), new THREE.Vector2(0.95, 0.1), new THREE.Vector2(-0.95, -0.1));
  const odtenki = semena.map(() => rnd());
  const _w = new THREE.Vector2();
  function sestavljanka(x, z) {
    _w.set(x + 0.05 * Math.sin(z * 17 + 1.3) + 0.03 * fbm(x * 5, 3, z * 5), z + 0.05 * Math.sin(x * 19 + 0.7) + 0.03 * fbm(x * 5 + 9, 1, z * 5));
    let d1 = 9, d2 = 9, id = 0;
    semena.forEach((s, i) => { const d = s.distanceTo(_w); if (d < d1) { d2 = d1; d1 = d; id = i; } else if (d < d2) d2 = d; });
    return { e: (d2 - d1) * 0.5, id };
  }
  const I0 = new THREE.Vector3(), I1 = new THREE.Vector3(), O0 = new THREE.Vector3();
  const TAU_MIR = 0.5;
  // u = oddaljenost od luknje (0) do roba koščka (1), v = α
  function material(u, a, out) {
    robLuknje(a, TAU_MIR, I0);
    O0.copy(I0).normalize().multiplyScalar(RP);
    return out.copy(I0).lerp(O0, u);
  }
  const X0 = new THREE.Vector3();
  function visina(u, a) {
    material(u, a, X0);
    const { e } = sestavljanka(X0.x, X0.z);
    const dl = u * I0.distanceTo(O0);
    const e2 = Math.min(e, dl);
    const vrh = 0.004 + 0.026 * gladko(0.0, 0.22, e2);
    return Y0 + (vrh - Y0) * gladko(0, 0.1, dl);
  }
  function povrsje(u, a, out, y = null) {
    material(u, a, out);
    const yy = y == null ? visina(u, a) : y;
    robLuknje(a, tau, I1); robLuknje(a, TAU_MIR, I0);
    out.addScaledVector(I1.sub(I0), (1 - u) * (1 - u));
    out.y = yy;
    return out;
  }
  const NU = q(84), NV = q(400);
  const kZad = (nu, nv) => [[0, 1, nu, Math.PI, Math.PI * 2, Math.round(nv * 0.5)]];
  const kSpr = (nu, nv) => [[0, 1, nu, 0, Math.PI, Math.round(nv * 0.5)]];
  const uu = (u) => Math.pow(u, 1.25);
  const Pvrh = (u, a, out) => povrsje(uu(u), a, out);
  const Pdno = (u, a, out) => povrsje(uu(u), a, out, -T);
  const ZID_C = new THREE.Color(ZID), ZID_TC = new THREE.Color(ZID_T), CIT_C = new THREE.Color(0x6a54c8);
  const barvaCelic = (x, y, z, u, a, c) => {
    material(uu(u), a, X0);
    const { e, id } = sestavljanka(X0.x, X0.z);
    const dl = uu(u) * I0.distanceTo(O0);
    // povrhnjične celice so brez kloroplastov: hladno modrikaste, med njimi zelene stene
    c.setHSL(0.62 + odtenki[id] * 0.06, 0.48, 0.37 + odtenki[id] * 0.07);
    c.multiplyScalar(0.78 + 0.22 * gladko(0.0, 0.08, Math.min(e, dl))); // ob stenah med celicami senca
    c.lerp(ZID_C, 1 - gladko(0.004, 0.02, Math.min(e, dl)));
  };
  const povMat = mat(0xffffff, { vertexColors: true, roughness: 0.58, clearcoat: 0.32, clearcoatRoughness: 0.14, sheen: 0.3, sheenColor: new THREE.Color(0xc8d0a8), zrnje: ["zrnje", 18, 10, 0.22] });
  const pg = [];
  function povMesh(Pf, krpe, obrni, barva, mt = povMat) {
    const g = ploskev(Pf, krpe, obrni);
    if (barva) pobarvaj(g, barva);
    const m = new THREE.Mesh(g, mt);
    list.add(m); pg.push([m, Pf]);
    return m;
  }
  const povZad = povMesh(Pvrh, kZad(NU, NV), true, barvaCelic);
  const povSpr = povMesh(Pvrh, kSpr(NU, NV), true, barvaCelic);
  const dnoMat = mat(0xffffff, { vertexColors: true, roughness: 0.65, clearcoat: 0.2, zrnje: ["zrnje", 18, 10, 0.25] });
  const dno = povMesh(Pdno, [[0, 1, q(20), 0, TAU, q(96)]], false, barvaCelic, dnoMat);
  // stranice: ob luknji (pod zapiralkama) in na robu koščka
  const Pstr = (u0) => (s, a, out) => { const top = povrsje(u0, a, new THREE.Vector3()); return out.copy(top).setY(top.y + (-T - top.y) * s); };
  const strBarva = (x, y, z, u, a, c) => { barvaCelic(x, y, z, 1, a, c); if (y < -T + 0.012) c.copy(ZID_TC); };
  const strZad = povMesh(Pstr(1), [[0, 1, 6, Math.PI, Math.PI * 2, q(144)]], true, strBarva, dnoMat);
  const strSpr = povMesh(Pstr(1), [[0, 1, 6, 0, Math.PI, q(144)]], true, strBarva, dnoMat);
  const lukMat = mat(ZID, { roughness: 0.6, clearcoat: 0.3, side: THREE.DoubleSide });
  const luknja = povMesh(Pstr(0), [[0, 1, 4, Math.PI, Math.PI * 2, q(60)]], true, null, lukMat);
  const luknjaSpr = povMesh(Pstr(0), [[0, 1, 4, 0, Math.PI, q(60)]], true, null, lukMat);

  // ploskvi reza povrhnjice na ravnini z = 0: a = 0 (x > 0) in a = π (x < 0)
  const D_KUT = 0.012;
  const Prez = (a) => (u, s, out) => { const top = povrsje(uu(u), a, out); const y0 = top.y - D_KUT; return out.setY(y0 + (-T - y0) * s); };
  const Pkut = (a) => (u, s, out) => { const top = povrsje(uu(u), a, out); return out.setY(top.y - D_KUT * s); };
  const rezBarva = (a) => (x, y, z, u, s, c) => {
    material(uu(u), a, X0);
    const { e } = sestavljanka(X0.x, X0.z);
    c.set(0xb9cdf0).lerp(new THREE.Color(0x7f98d4), s); // celični sok v vakuolah povrhnjičnih celic
    const dl = uu(u) * I0.distanceTo(O0), m = Math.min(e, dl);
    if (m < 0.017) c.lerp(CIT_C, 0.8); // tanka plast citoplazme ob steni
    if (m < 0.008 || y < -T + 0.01) c.copy(ZID_C);
  };
  // ploskve reza gledajo navzdol-naprej; normale jim nagnemo proti gledalcu, da so svetle in berljive
  const proti = (g, z = 1) => { const n = g.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 0.6 * z, 0.8 * z); n.needsUpdate = true; return g; };
  const rezMat = mat(0xffffff, { vertexColors: true, roughness: 0.6, clearcoat: 0.25, side: THREE.DoubleSide, zrnje: ["zrnje", 24, 3, 0.3] });
  const rez = [0, Math.PI].map((a) => povMesh(Prez(a), [[0, 1, q(140), 0, 1, 5]], false, rezBarva(a), rezMat));
  const kutMat = mat(0xe6b52e, { roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.08, sheen: 0.3, side: THREE.DoubleSide });
  const kut = [0, Math.PI].map((a) => povMesh(Pkut(a), [[0, 1, q(140), 0, 1, 1]], false, null, kutMat));
  // kutikula na zunanjem robu koščka (vidna tudi v celem prikazu)
  const Pkrob = (s, a, out) => { povrsje(1, a, out); out.x *= 1.003; out.z *= 1.003; out.y = out.y + 0.002 - (D_KUT + 0.002) * s; return out; };
  const kutRob = povMesh(Pkrob, [[0, 1, 1, Math.PI, Math.PI * 2, q(144)]], true, null, kutMat);
  const kutRobSpr = povMesh(Pkrob, [[0, 1, 1, 0, Math.PI, q(144)]], true, null, kutMat);

  // ---------- celice gobastega tkiva pod povrhnjico in podrežna votlina ----------
  const gob = [];
  // zadnja celica leži pod režo in se vidi skozi odprto režo
  const GOB_REZA = [0.01, -0.03, 0.1, -T - 0.2, 1.7];
  [[0.52, -0.14, 0.15], [-0.42, -0.36, 0.14], [0.08, -0.56, 0.15], [-0.6, -0.08, 0.12], [0.62, -0.42, 0.11], [0.3, -0.36, 0.1], [-0.18, -0.68, 0.1], GOB_REZA].forEach(([x, z, r, y, sz = 1.1], i) => {
    const g = new THREE.SphereGeometry(1, q(40), q(28));
    preoblikuj(g, (v) => { v.multiplyScalar(1 + 0.12 * fbm(v.x * 1.4 + i * 3, v.y * 1.4, v.z * 1.4)); v.multiply(new THREE.Vector3(r * 1.3, r, r * sz)); v.add(new THREE.Vector3(x, y ?? -T - r * 0.72, z)); });
    gob.push(g);
  });
  // celice gobastega tkiva: zelenkasto steklo, skozi katero se vidijo kloroplasti ob njihovi steni
  const gobasto = new THREE.Mesh(zdruzi(gob), V.steklo(mat(0x6cc84a), { a: 0.3, rob: "#c4f58a", rk: 1.0, rf: 10 }));
  gobasto.renderOrder = 2;
  const gobKlo = V.posej(gobasto, hi ? 300 : 90);
  const gobKloMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, hi ? 1 : 0).scale(0.026, 0.011, 0.034),
    mat(0x55b83a, { roughness: 0.4, clearcoat: 0.7 }), gobKlo.length);
  gobKlo.forEach((t, i) => {
    o.position.copy(t.p).addScaledVector(t.n, -0.014); o.quaternion.setFromUnitVectors(UP, t.n); o.rotateY(rnd() * 6.28);
    o.scale.setScalar(0.8 + rnd() * 0.4); o.updateMatrix(); gobKloMesh.setMatrixAt(i, o.matrix);
  });
  gobKloMesh.instanceMatrix.needsUpdate = true; gobKloMesh.computeBoundingSphere();
  list.add(gobasto, gobKloMesh);
  const votlina = new THREE.Mesh(new THREE.SphereGeometry(0.22, q(32), q(12), 0, TAU, Math.PI / 2, Math.PI / 2).scale(1.1, 0.7, 1.5).translate(0, -T + 0.01, 0),
    mat(0x24405e, { roughness: 0.9, clearcoat: 0, sheen: 0, transparent: true, opacity: 0.4, depthWrite: false, side: THREE.BackSide }));
  list.add(votlina);

  // ---------- posodobitev ob spremembi turgorja ali prikaza ----------
  function posodobi() {
    for (const [m, Pf] of zg) m.geometry.userData.osvezi(Pf);
    for (const [m, Pf] of pg) m.geometry.userData.osvezi(Pf);
    [...rez, ...kut].forEach((m, i) => proti(m.geometry, i % 2 ? 1 : -1)); // ploskev pri a = 0 je obrnjena
    postaviKonca();
    postaviNotranjost();
    postaviKape();
  }
  posodobi();
  let delMem = null;
  function nastaviPrikaz(cela) {
    prerez = !cela;
    for (const m of [stenaZ[1], citZ[1], ventZ[1], vakZ[1], povSpr, strSpr, luknjaSpr, kutRobSpr]) m.visible = cela;
    for (const m of [...kape, ...rez, ...kut, memZ]) m.visible = !cela;
    const im = deli.indexOf(delMem); // membrana je vidna le na prerezu
    if (cela && im >= 0) deli.splice(im, 1);
    if (!cela && im < 0 && delMem) deli.splice(deli.findIndex((d) => d.id === "citoplazma") + 1, 0, delMem);
    postaviNotranjost();
    postaviKonca();
    const dk = deli.find((d) => d.id === "kutikula"), dg = deli.find((d) => d.id === "gobasto-tkivo");
    const zaokr = (t) => t.map((x) => Math.round(x * 1000) / 1000);
    if (dk) dk.tocka = zaokr(cela ? tockaKutRob() : tockaKutRez());
    if (dg) dg.tocka = zaokr(cela ? TT([GOB_REZA[0], GOB_REZA[3] + GOB_REZA[2] * 0.95, GOB_REZA[1]]) : TT([0.52, -T - 0.24, -0.14]));
  }
  nastaviPrikaz(true);

  // ---------- deli ----------
  function tockaKutRez() { return TT(povrsje(0.7, Math.PI, new THREE.Vector3()).add(new THREE.Vector3(0, -0.004, 0.002))); }
  function tockaKutRob() { const v = povrsje(1, Math.PI * 0.62, new THREE.Vector3()); v.x *= 1.004; v.z *= 1.004; v.y -= 0.004; return TT(v); }
  const t0 = (a, psi, plast) => TT(zapiralka(a, psi, plast, new THREE.Vector3()));
  del("zapiralki", "Celici zapiralki", "Fižolasti celici okoli reže; ko se napolnita z vodo, nabreknesta, se upogneta narazen in reža se odpre.", ZID,
    [...stenaZ, konca, kape[0]], t0(-0.5, 0.9, 0));
  del("notranja-stena", "Odebeljena notranja stena", "Stena ob reži je debelejša in se ne raztegne, zato se nabrekla zapiralka upogne kot banana in odmakne od sosede.", ZID_T,
    [...ventZ], TT([Bc(tau) - rrA(0) + 0.022, Y0 + 0.03, -0.06]));
  del("kloroplasti", "Kloroplasti", "Zapiralki imata kloroplaste, v katerih poteka fotosinteza; povrhnjične celice okoli njiju jih nimajo ali imajo le redke drobne.", B.kloroplast,
    [kloroplasti], TT(kloPol.find((k) => Math.cos(k.a) > 0.5 && k.psi > 0.6)?.p || kloPol[0].p));
  del("jedro", "Jedro", "Vsaka zapiralka ima svoje jedro z DNK, ki upravlja njeno delovanje.", B.jedro, [jedri], t0(-0.36, Math.PI * 0.75, 1));
  del("mitohondriji", "Mitohondriji", "Zapiralki imata veliko mitohondrijev. Ti s celičnim dihanjem dajejo ATP, s katerim črpalke v membrani poganjajo ione.", B.mitohondrij,
    [mitohondriji], TT(mitPol.find((k) => Math.sin(k.a) < -0.2 && Math.cos(k.a) > 0)?.p || mitPol[0].p));
  del("kanalcki", "Črpalke in kanalčki", "Beljakovine v membrani: protonske črpalke porabljajo ATP, skozi kalijeve kanalčke nato vstopijo ioni K⁺, za njimi pa z osmozo priteče voda.", B.beljakovine,
    [kanalcki], t0(-0.7, 1.2, 1));
  del("mikrofibrile", "Celulozna vlakna", "V steni so celulozna vlakna navita kot obroči okoli zapiralke. Zato se ta ob nabrekanju ne odebeli, ampak podaljša in upogne.", "#b8e070",
    [obroci], t0(-0.9, 0.6, 0));
  del("vakuola", "Vakuola", "Ko v zapiralko vstopijo kalijevi ioni (K⁺), za njimi z osmozo priteče voda; vakuola se poveča in turgor naraste.", "#9fe3f0",
    [...vakZ, kape[2]], TT([-Bc(tau) + 0.012, Y0, 0.003]));
  del("citoplazma", "Citoplazma", "Plast žive snovi med steno in vakuolo, v kateri ležijo kloroplasti in jedro.", "#6a54c8",
    [...citZ, kape[1]], TT([-Bc(tau) - rrA(Math.PI) * 0.62, Y0 + 0.045, 0.002]));
  del("membrana", "Celična membrana", "Tanka meja žive snovi tik pod steno zapiralke; skozi beljakovinske kanalčke v njej prehajajo kalijevi ioni. Debelina membrane je povečana.", B.dvosloj,
    [memZ], TT(naMembrani(Math.PI, Math.PI * 0.5, 0.5, new THREE.Vector3()).setZ(0.003)));
  delMem = deli[deli.length - 1];
  if (!prerez) deli.splice(deli.indexOf(delMem), 1);
  del("reza", "Listna reža", "Odprtina med zapiralkama: skozi njo v list vstopa ogljikov dioksid, izhajata pa kisik in vodna para.", "#3a6a9a",
    [votlina], TT([0, Y0 - 0.02, -0.12]));
  del("povrhnjica", "Povrhnjične celice", "Ploščate prozorne celice v obliki sestavljanke, večinoma brez kloroplastov; tesno se prilegajo in ščitijo list.", "#a9c0ea",
    [povZad, povSpr, dno, strZad, strSpr, luknja, luknjaSpr, ...rez], TT(povrsje(0.45, Math.PI * 1.75, new THREE.Vector3())));
  del("kutikula", "Kutikula", "Voščena plast na zunanji steni povrhnjice, ki zmanjšuje izhlapevanje vode; reža je zato glavna pot za pline.", "#e6b52e",
    [...kut, kutRob, kutRobSpr], tockaKutRob());
  del("gobasto-tkivo", "Celice gobastega tkiva", "Pod režo je zračni prostor med rahlo razporejenimi celicami s kloroplasti; tja vstopa ogljikov dioksid.", "#6cc84a",
    [gobasto, gobKloMesh], TT([GOB_REZA[0], GOB_REZA[3] + GOB_REZA[2] * 0.95, GOB_REZA[1]]));

  // ---------- nadzor ----------
  const sirina = () => Math.max(0, 2 * (Bc(tau) - rrA(0))) * 42.5;
  const nadzor = [
    {
      tip: "drsnik", id: "turgor", oznaka: "Turgor", min: 0, max: 1, korak: 0.01, vrednost: tau,
      ob: (v) => { tau = Math.min(1, Math.max(0, +v)); posodobi(); },
    },
    {
      tip: "izpis", id: "reza", oznaka: "Reža",
      vrednost: () => {
        const s = sirina();
        if (s < 0.3) return "zaprta (K⁺ in voda sta zapustila zapiralki)";
        return (s < 3 ? "priprta" : "odprta") + ", ≈ " + s.toFixed(1).replace(".", ",") + " µm (K⁺ in voda v zapiralkah)";
      },
    },
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["cela", "Cel košček"], ["prerez", "Prerez"]], vrednost: "prerez",
      ob: (v) => nastaviPrikaz(v === "cela"),
    },
  ];
  if (ctx.zacetek && ctx.zacetek.prikaz) nadzor[2].vrednost = ctx.zacetek.prikaz;
  nastaviPrikaz(nadzor[2].vrednost === "cela");

  // ---------- skupni videz: vlažne kiparske površine, barve kot v učbeniku ----------
  V.poliraj(group, deli, {
    zapiralki: { tex: "gube", rf: 90, k: 1.2, b: 0.25, lisa: 0.12, f: 8 },
    "notranja-stena": { tex: "vlakna", rf: 120, k: 1.2, b: 0.3 },
    kloroplasti: { tex: "zrna", rf: 260, k: 0.9, b: 0.2 },
    jedro: { tex: "zrna", rf: 160, k: 1.2, b: 0.22 },
    mitohondriji: { tex: "gube", rf: 320, k: 0.9, b: 0.22 },
    vakuola: { tex: "zrna", rf: 40, k: 0.5, b: 0.08, rough: 0.18, cc: 0.9, ccr: 0.06 },
    citoplazma: { tex: "fino", rf: 120, k: 1.0, b: 0.24 },
    povrhnjica: { tex: "gube", rf: 34, k: 0.9, b: 0.18, ton: 0.6, rough: 0.4, cc: 0.6 },
    kutikula: { tex: "zrna", rf: 140, k: 0.8, rough: 0.25, cc: 1, ccr: 0.05 },
    "gobasto-tkivo": { tex: "zrna", rf: 260, k: 0.8 },
    reza: { tex: null },
  });
  nadzor.push(V.barveUcbenika(deli, {
    zapiralki: "#5c9e2e", "notranja-stena": "#3f6a1e", kanalcki: "#c0569a", mikrofibrile: "#d8e6a0", reza: "#2a4060",
    povrhnjica: "#e4ecef", kutikula: "#f2d24a", "gobasto-tkivo": "#7cc85a",
  }));

  return {
    group,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
    deli,
    nadzor,
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
