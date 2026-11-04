// Bele krvničke: pet vrst levkocitov v prerezu, ob vsaki rdeča krvnička za primerjavo velikosti.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta. Vsaka vrsta je zgrajena v µm in umerjena posebej.

export const info = {
  id: "celica-levkociti",
  naslov: "Bele krvničke (levkociti)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Pet vrst belih krvničk v prerezu: nevtrofilec, eozinofilec, bazofilec, limfocit in monocit. Ob vsaki je rdeča krvnička (7,8 µm) za primerjavo velikosti; zrnc in drugih organelov je manj kot v resnici.",
  merilo: { m: 24e-6, oznaka: "24 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];

  // ---------- orodja ----------
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
  const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
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
    const pos = [], nor = [], col = [], idx = [];
    let off = 0;
    geos.forEach((g, i) => {
      const p = g.attributes.position, n = g.attributes.normal;
      const c = Array.isArray(barve) ? new THREE.Color(barve[i]) : null;
      const gc = !c && barve === true ? g.attributes.color : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (c) col.push(c.r, c.g, c.b);
        else if (gc) col.push(gc.getX(k), gc.getY(k), gc.getZ(k));
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
  // Pobarva geometrijo z barvo oglišč (za združevanje z barve === true).
  function pobarvaj(g, barva) {
    const c = new THREE.Color(barva), n = g.attributes.position.count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  }
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka });
  }
  // Odrezan osmi del: x < 0, y > 0, z > 0 (proti gledalcu levo zgoraj).
  const vIzrezu = (v, c = { x: 0, y: 0, z: 0 }) => v.x < c.x && v.y > c.y && v.z > c.z;
  // Parametrična ploskev f(u, v, p) za u, v ∈ [0, 1]; normale iz končnih razlik, zato se kosi stikajo brez šivov.
  function normala(f, u, v, n) { // lastni vektorji, ker f lahko spet kliče normala (odmik)
    const e = 1e-4, _a = V(), _b = V(), _c = V(), _d = V(), _t = V();
    for (const [du, dv] of [[0, 0], [0, 0.004], [0, -0.004], [0.004, 0], [-0.004, 0]]) {
      const uu = u + du, vv = v + dv;
      f(uu + e, vv, _a); f(uu - e, vv, _b); f(uu, vv + e, _c); f(uu, vv - e, _d);
      n.subVectors(_a, _b).cross(_t.subVectors(_c, _d));
      if (n.lengthSq() > 1e-24) return n.normalize();
    }
    return n.set(0, 1, 0);
  }
  function ploskev(f, nu, nv, obrni = false) {
    const pos = new Float32Array((nu + 1) * (nv + 1) * 3), nor = new Float32Array(pos.length), idx = [];
    const p = V(), n = V();
    for (let j = 0, k = 0; j <= nv; j++) for (let i = 0; i <= nu; i++, k += 3) {
      f(i / nu, j / nv, p); normala(f, i / nu, j / nv, n);
      if (obrni) n.negate();
      pos[k] = p.x; pos[k + 1] = p.y; pos[k + 2] = p.z; nor[k] = n.x; nor[k + 1] = n.y; nor[k + 2] = n.z;
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const A = j * (nu + 1) + i, B = A + 1, C = A + nu + 2, D = A + nu + 1;
      if (obrni) idx.push(A, D, B, B, D, C); else idx.push(A, B, D, B, C, D);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    g.setIndex(idx);
    return g;
  }
  // Ploskev, zamaknjena za d vzdolž normale (d > 0 navzven).
  const odmik = (f, d) => { const n = V(); return (u, v, p) => { normala(f, u, v, n); f(u, v, p); return p.addScaledVector(n, d); }; };
  // Cevka skozi točke (gladka krivulja).
  const nit = (tocke, r, seg, rs = 6, zaprta = false) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tocke, zaprta), q(seg), r, q(rs), zaprta);
  // Deformira oglišča geometrije s f(v) in na novo izračuna normale.
  function deformiraj(g, f) {
    const p = g.attributes.position, v = V();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); f(v); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
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
  // Postavi vsebino (zgrajeno v µm) v enotsko kroglo: središče škatle v izhodišče, največji polmer = cilj. Vrne enote na µm.
  function umeri(o, cilj = 0.98) {
    o.position.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrixWorld(true);
    o.traverse((m) => { if (m.isInstancedMesh) { m.computeBoundingBox(); m.computeBoundingSphere(); } });
    const c = new THREE.Box3().setFromObject(o, true).getCenter(V());
    let r = 0; const v = V();
    o.traverseVisible((m) => {
      if (!m.isMesh) return;
      if (m.isInstancedMesh) { // vsak primerek posebej (skupna krogla je ohlapna)
        if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
        const mi = new THREE.Matrix4(), sf = new THREE.Sphere();
        for (let i = 0; i < m.count; i++) { m.getMatrixAt(i, mi); sf.copy(m.geometry.boundingSphere).applyMatrix4(mi).applyMatrix4(m.matrixWorld); r = Math.max(r, sf.center.distanceTo(c) + sf.radius); }
        return;
      }
      const p = m.geometry.attributes.position, st = Math.max(1, Math.floor(p.count / 3000));
      for (let i = 0; i < p.count; i += st) r = Math.max(r, v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld).distanceTo(c));
    });
    const s = cilj / r;
    o.scale.setScalar(s); o.position.copy(c).multiplyScalar(-s);
    return s;
  }
  // Oznaka merila z decimalno vejico.
  const oznaka = (um) => (um >= 10 ? String(Math.round(um)) : String(Math.round(um * 10) / 10).replace(".", ",")) + " µm";
  const o = new THREE.Object3D();

  const VRSTE = {
    nevtrofilec: {
      ime: "Nevtrofilec", d: 13.5, velikost: "12–15 µm", delez: "50–70 %", cit: 0xeccbd8, guba: 0.05, nMv: 520,
      opisCel: "Najpogostejša bela krvnička; prva prihiti na mesto okužbe in požre bakterije (fagocitoza).",
      jedro: { lobi: [[-2.6, 0.5, -0.6, 1.55], [-1.1, 1.9, -0.9, 1.35], [1.0, 1.6, -1.0, 1.45], [2.5, 0.1, -0.5, 1.5]], most: 0.3 },
      jedroOpis: "Jedro je razdeljeno na 3 do 5 režnjev, povezanih s tankimi nitmi; zato se celica lažje preriva skozi steno žile.",
      zrnca: { n: 340, r: [0.13, 0.2], barva: 0xd7a7dc, ime: "Drobna zrnca", opis: "Številna drobna zrnca z encimi, s katerimi nevtrofilec razgradi požrte bakterije." },
    },
    eozinofilec: {
      ime: "Eozinofilec", d: 14, velikost: "12–17 µm", delez: "1–4 %", cit: 0xf2dcd4, guba: 0.035, nMv: 420,
      opisCel: "Bela krvnička, ki se bori proti zajedavcem (npr. glistam) in sodeluje pri alergijah.",
      jedro: { lobi: [[-2.3, 0.6, -0.8, 2.05], [2.3, 0.3, -0.6, 1.95]], most: 0.45 },
      jedroOpis: "Jedro ima navadno dva režnja, povezana z ožino, kot očala.",
      zrnca: { n: 150, r: [0.36, 0.48], barva: 0xf0653a, ime: "Velika oranžno rdeča zrnca", opis: "Velika zrnca s strupenimi beljakovinami za uničevanje zajedavcev; pri barvanju z eozinom se obarvajo oranžno rdeče." },
    },
    bazofilec: {
      ime: "Bazofilec", d: 15, velikost: "14–16 µm", delez: "manj kot 1 %", cit: 0xe4d6ea, guba: 0.04, nMv: 420,
      opisCel: "Najredkejša bela krvnička; z izločanjem histamina sproži vnetje in alergijski odziv.",
      jedro: { lobi: [[-1.9, 0.9, -0.4, 1.9], [1.8, -0.7, -0.9, 1.85]], most: 0.6, s: true },
      jedroOpis: "Jedro ima dva režnja v obliki črke S; pogosto ga skoraj prekrijejo temna zrnca.",
      zrnca: { n: 90, r: [0.38, 0.55], barva: 0x3c43b8, ime: "Velika temno modra zrnca", opis: "Velika zrnca s histaminom in heparinom; histamin razširi žile in sproži srbenje in oteklino pri alergiji." },
    },
    limfocit: {
      ime: "Limfocit", d: 8.5, velikost: "7–10 µm", delez: "20–40 %", cit: 0x9fc3ec, guba: 0.02, nMv: 800,
      opisCel: "Bela krvnička imunskega sistema: limfociti B izdelujejo protitelesa, limfociti T neposredno napadejo okužene celice.",
      jedro: { okroglo: [3.35, 0.94, 1.0, 0.95], c: [0.35, 0.05, -0.25], vdolbina: 0.08 },
      jedroOpis: "Veliko okroglo jedro z gostim kromatinom zapolni skoraj vso celico; okoli njega je le tanek pas citoplazme.",
      mito: 5, ribosomi: 700,
    },
    monocit: {
      ime: "Monocit", d: 17.5, velikost: "15–20 µm", delez: "2–8 %", cit: 0xbfc6dc, guba: 0.045, nMv: 560,
      opisCel: "Največja bela krvnička; ko iz krvi preide v tkivo, postane makrofag, ki požira bakterije in odmrle celice.",
      jedro: { okroglo: [4.4, 1.2, 0.8, 0.95], c: [0.6, -0.2, -1.4], vdolbina: 0.5 },
      jedroOpis: "Veliko jedro ima obliko ledvice ali podkve; kromatin je bolj rahel kot pri limfocitu.",
      zrnca: { n: 90, r: [0.12, 0.18], barva: 0xb48ad6, ime: "Lizosomi (azurofilna zrnca)", opis: "Drobni mešički z encimi, ki razgradijo požrte bakterije in ostanke celic." },
      mito: 9, vakuole: 9,
    },
  };

  // ---------- rdeča krvnička za primerjavo (Evans in Fung) ----------
  const R0 = 3.91, P = (x) => 0.81 + 7.83 * x - 4.39 * x * x;
  const eriF = (a0, a1) => (u, v, p) => { const a = a0 + (a1 - a0) * v, f = u * Math.PI * 2, s = Math.sin(a); return p.set(R0 * s * Math.cos(f), 0.5 * Math.cos(a) * P(s * s), R0 * s * Math.sin(f)); };

  const Y = V(0, 1, 0);
  function zgradiVrsto(id) {
    const c = VRSTE[id];
    const T = new THREE.Group(); group.add(T);
    const D = [];
    const dd = (pid, ime, opis, barva, meshes, tocka) => { meshes.forEach((m) => { m.userData.del = pid; }); D.push({ id: pid, ime, opis, barva, meshes, tocka }); };
    seme = 11 + id.length * 31;
    const R = c.d / 2;

    // celična membrana z gubami
    const gube = (d) => { const n = sum(d.x * 2.4 + 5, d.y * 2.4, d.z * 2.4); return Math.pow(1 - Math.abs(n), 4); };
    const oblika = (d) => R * (1 + c.guba * gube(d) + 0.025 * fbm(d.x * 1.5 + 2, d.y * 1.5, d.z * 1.5) - c.guba * 0.3);
    const mem = lupina(oblika, q(128), q(80));
    const memMat = mat(0xd88aa2, { roughness: 0.32, clearcoat: 1, sheen: 0.6 });
    const memOut = new THREE.Mesh(mem.odprta, memMat);
    const memRob = new THREE.Mesh(rob(oblika, 0.11, q(48)), memMat);
    // mikrovili: tanki prstasti izrastki
    const mvGeo = new THREE.CylinderGeometry(0.06, 0.085, 1, q(5), 1, false); mvGeo.translate(0, 0.5, 0);
    const nMv = hi ? c.nMv : Math.round(c.nMv * 0.5);
    const mv = new THREE.InstancedMesh(mvGeo, memMat, nMv);
    const smer = V();
    for (let k = 0; k < nMv;) {
      smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
      if (smer.lengthSq() > 1 || smer.lengthSq() < 0.05) continue;
      smer.normalize();
      if (vIzrezu(smer, { x: 0.04, y: -0.04, z: -0.04 })) continue;
      o.position.copy(smer).multiplyScalar(oblika(smer) * 0.99);
      o.quaternion.setFromUnitVectors(Y, smer); o.scale.set(1, 0.22 + rnd() * (id === "limfocit" ? 0.25 : 0.22), 1); o.updateMatrix();
      mv.setMatrixAt(k++, o.matrix);
    }
    T.add(memOut, memRob, mv);
    // citoplazma
    const citIn = new THREE.Mesh(mem.odprta.clone().scale(0.985, 0.985, 0.985), mat(c.cit, { roughness: 0.75, clearcoat: 0.1, sheen: 0.25, side: THREE.BackSide }));
    T.add(citIn);

    // jedro (lisast kromatin z barvo oglišč)
    const krogle = []; // približek jedra za razporejanje organelov
    const lisasto = (g, ox = 0) => {
      const p = g.attributes.position, col = new Float32Array(p.count * 3), a = new THREE.Color(0x7a68d8), b = new THREE.Color(0x4f3fae), t = new THREE.Color();
      for (let i = 0; i < p.count; i++) { const n = fbm(p.getX(i) * 1.3 + ox, p.getY(i) * 1.3, p.getZ(i) * 1.3); t.copy(a).lerp(b, THREE.MathUtils.clamp(n * 1.4 + 0.35, 0, 1)); col.set([t.r, t.g, t.b], i * 3); }
      g.setAttribute("color", new THREE.BufferAttribute(col, 3));
      return g;
    };
    const jg = [];
    if (c.jedro.lobi) {
      const L = c.jedro.lobi;
      L.forEach(([x, y, z, r], i) => {
        const g = new THREE.SphereGeometry(1, q(40), q(28));
        const ry = 0.7 + rnd() * 0.12, rz = 0.66 + rnd() * 0.12;
        deformiraj(g, (v) => { v.set(v.x * r * 1.18, v.y * r * ry, v.z * r * rz).multiplyScalar(1 + 0.07 * fbm(v.x * 1.2 + i * 3, v.y * 1.2, v.z * 1.2)); });
        g.rotateZ((rnd() - 0.5) * 1.2); g.rotateY(rnd() * 3); g.translate(x, y, z);
        jg.push(lisasto(g, i));
        krogle.push({ c: V(x, y, z), r: r * 1.05 });
      });
      for (let i = 0; i < L.length - 1; i++) {
        const a = V(...L[i]), b = V(...L[i + 1]), m = a.clone().lerp(b, 0.5);
        if (c.jedro.s) m.add(V(0, i % 2 ? -0.9 : 0.9, 0.5));
        else m.add(V(0, 0.4, 0.3));
        jg.push(lisasto(nit([a, m, b], c.jedro.most, 24, 8)));
      }
    } else {
      const [r, sx, sy, sz] = c.jedro.okroglo, J = V(...c.jedro.c), vd = V(0.62, 0.78, -0.1).normalize();
      const g = new THREE.SphereGeometry(1, q(72), q(48));
      deformiraj(g, (v) => {
        const d = v.clone().normalize(), kot = d.angleTo(vd);
        const ud = c.jedro.vdolbina * Math.exp(-(kot * kot) / 0.4);
        v.copy(d).multiplyScalar(r * (1 - ud + 0.035 * fbm(d.x * 3 + 1, d.y * 3, d.z * 3)));
        v.set(v.x * sx, v.y * sy, v.z * sz);
      });
      g.translate(J.x, J.y, J.z);
      jg.push(lisasto(g));
      krogle.push({ c: J, r: r * Math.max(sx, sy, sz) * (c.jedro.vdolbina > 0.3 ? 0.8 : 1) });
    }
    const jedro = new THREE.Mesh(zdruzi(jg, true), mat(0xffffff, { vertexColors: true, roughness: 0.4, clearcoat: 0.6 }));
    T.add(jedro);

    // naključna točka v citoplazmi, zunaj jedra
    function vCitoplazmi(rr, rob = 0.86) {
      for (let t = 0; t < 4000; t++) {
        smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
        if (smer.lengthSq() > 1) continue;
        const p = smer.clone().multiplyScalar(R * rob);
        if (p.length() + rr > R * rob) continue;
        if (krogle.some((k) => p.distanceTo(k.c) < k.r + rr + 0.1)) continue;
        if (c.jedro.okroglo) { const J = V(...c.jedro.c), dir = p.clone().sub(J); const [r, sx, sy, sz] = c.jedro.okroglo; const e = V(dir.x / sx, dir.y / sy, dir.z / sz).length(); if (e < r * 1.02 + rr) continue; }
        return p;
      }
      return null;
    }
    const tocke = { zrnca: [], mito: [], vak: [] };
    function kroglice(n, r0, r1, barva, opcije, kam, raztegni = 1) {
      const m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, q(11), q(8)), mat(barva, opcije), n);
      let i = 0;
      for (; i < n; i++) {
        const r = r0 + rnd() * (r1 - r0), p = vCitoplazmi(r);
        if (!p) break;
        kam.push(p);
        o.position.copy(p); o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.scale.set(r * raztegni, r, r); o.updateMatrix(); m.setMatrixAt(i, o.matrix);
      }
      m.count = i;
      T.add(m);
      return m;
    }
    let zrnca = null, mit = null, vak = null, rib = null;
    if (c.zrnca) {
      const z = c.zrnca;
      zrnca = kroglice(hi ? z.n : Math.round(z.n * 0.6), z.r[0], z.r[1], z.barva, { roughness: 0.3, clearcoat: 0.9, sheen: 0.3 }, tocke.zrnca, id === "eozinofilec" ? 1.25 : 1);
    }
    if (c.vakuole) vak = kroglice(c.vakuole, 0.35, 0.75, 0xa8e6ef, { roughness: 0.15, clearcoat: 1, transmission: 0, sheen: 0.2 }, tocke.vak);
    if (c.mito) {
      const L = 0.55, r = 0.22, prof = [];
      for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (i / 12) * Math.PI; prof.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); }
      mit = new THREE.InstancedMesh(new THREE.LatheGeometry(prof, q(14)), mat(0xe8743b, { roughness: 0.38 }), c.mito);
      let i = 0;
      for (; i < c.mito; i++) { const p = vCitoplazmi(0.5, 0.9); if (!p) break; tocke.mito.push(p); o.position.copy(p); o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.scale.setScalar(0.9 + rnd() * 0.3); o.updateMatrix(); mit.setMatrixAt(i, o.matrix); }
      mit.count = i;
      T.add(mit);
    }
    if (c.ribosomi) {
      const n = hi ? c.ribosomi : Math.round(c.ribosomi * 0.5);
      rib = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.07, 0), mat(0x2b3f8f, { roughness: 0.6, clearcoat: 0.2 }), n);
      let i = 0;
      for (; i < n; i++) { const p = vCitoplazmi(0.05, 0.93); if (!p) break; o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); rib.setMatrixAt(i, o.matrix); }
      rib.count = i;
      T.add(rib);
    }

    // rdeča krvnička za primerjavo
    const eri = new THREE.Mesh(zdruzi([ploskev(eriF(0, Math.PI), q(80), q(56))]), mat(0xd9545f, { roughness: 0.3, clearcoat: 1, sheen: 0.6, sheenColor: new THREE.Color(0xffc0c0) }));
    const smerE = V(0.87, -0.5, 0.6).normalize(), osE = V(-0.47, 0.34, 0.81).lerp(V(0.87, 0.3, 0.5), 0.6).normalize();
    eri.position.copy(smerE).multiplyScalar(R * 1.05 + R0 * 0.78);
    eri.quaternion.setFromUnitVectors(Y, osE);
    T.add(eri);

    const s = umeri(T, 0.985);
    const L = (p) => V(...p).multiplyScalar(s).add(T.position).toArray();
    const naCeli = (x, y, z) => { const d = V(x, y, z).normalize(); return L(d.multiplyScalar(oblika(d) * 1.01).toArray()); };
    const izbJ = () => { const k = krogle.reduce((a, b) => (b.c.z > a.c.z ? b : a)); return L(k.c.clone().add(V(-0.3, 0.45, 0.85).normalize().multiplyScalar(k.r * 0.95)).toArray()); };
    const naj = (arr) => arr.reduce((a, p) => (vIzrezu(p) && p.z - p.x > a.z - a.x ? p : a), arr[0]);

    dd("membrana", "Celična membrana", c.opisCel + " Membrana je nagubana in ima drobne mikrovile.", "#d88aa2", [memOut, memRob, mv], naCeli(0.55, 0.15, 0.8));
    dd("citoplazma", "Citoplazma", "Tekočina z organeli, ki zapolnjuje celico med membrano in jedrom.", "#" + new THREE.Color(c.cit).getHexString(), [citIn], L(V(0.45, -0.35, -0.55).normalize().multiplyScalar(R * 0.96).toArray()));
    dd("jedro", "Jedro", c.jedroOpis, "#7a68d8", [jedro], izbJ());
    if (zrnca && tocke.zrnca.length) dd("zrnca", c.zrnca.ime, c.zrnca.opis, "#" + new THREE.Color(c.zrnca.barva).getHexString(), [zrnca], L(naj(tocke.zrnca).toArray()));
    if (vak && tocke.vak.length) dd("vakuole", "Vakuole", "Mehurčki, v katerih monocit prebavlja pogoltnjene delce.", "#a8e6ef", [vak], L(naj(tocke.vak).toArray()));
    if (mit && tocke.mito.length) dd("mitohondrij", "Mitohondriji", "Elektrarne celice, ki pri celičnem dihanju pridobivajo energijo; v belih krvničkah jih je malo.", "#e8743b", [mit], L(naj(tocke.mito).toArray()));
    if (rib) dd("ribosomi", "Ribosomi", "Drobna zrnca, ki izdelujejo beljakovine (pri limfocitih B tudi protitelesa); zaradi njih je citoplazma modrikasta.", "#2b3f8f", [rib], naCeli(-0.75, 0.62, 0.15).map((x) => x * 0.97));
    dd("eritrocit", "Rdeča krvnička za primerjavo", "Rdeča krvnička meri 7,8 µm; ob njej vidiš, kako velika je ta bela krvnička (" + c.velikost + ").", "#d9545f", [eri], L(eri.position.clone().add(osE.clone().multiplyScalar(0.5)).add(V(0.4, 1.2, 0)).toArray()));
    return { T, D, s, c };
  }

  const zgrajene = {};
  let vrsta = "nevtrofilec";
  function nastavi(v) {
    if (!VRSTE[v]) v = "nevtrofilec";
    vrsta = v;
    if (!zgrajene[v]) zgrajene[v] = zgradiVrsto(v);
    for (const k in zgrajene) zgrajene[k].T.visible = k === v;
    deli.length = 0;
    zgrajene[v].D.forEach((d) => deli.push(d));
  }
  const nadzor = [
    { tip: "izbira", id: "vrsta", oznaka: "Vrsta", moznosti: Object.keys(VRSTE).map((k) => [k, VRSTE[k].ime]), vrednost: "nevtrofilec", ob: nastavi },
    { tip: "izpis", id: "podatki", oznaka: "Velikost in delež", vrednost: () => `${VRSTE[vrsta].velikost} · ${VRSTE[vrsta].delez} belih krvničk` },
  ];
  const zac = ctx.zacetek && ctx.zacetek.vrsta;
  if (zac && VRSTE[zac]) nadzor[0].vrednost = zac;
  nastavi(nadzor[0].vrednost);

  return {
    group,
    deli,
    nadzor,
    get merilo() { const um = 2 / zgrajene[vrsta].s; return { m: um * 1e-6, oznaka: oznaka(um) }; },
    korak(t) {
      if (!gib) return;
      group.rotation.y = Math.sin(t * 0.15) * 0.04;
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
