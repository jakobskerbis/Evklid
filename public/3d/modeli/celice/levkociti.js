// Bele krvničke: pet vrst levkocitov v prerezu, ob vsaki rdeča krvnička za primerjavo velikosti.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
// Vsaka vrsta je zgrajena v µm in umerjena posebej (šele ko jo izbereš).
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-levkociti",
  naslov: "Bele krvničke (levkociti)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Pet vrst belih krvničk v prerezu: nevtrofilec, eozinofilec, bazofilec, limfocit in monocit. Ob vsaki je rdeča krvnička (7,8 µm) za primerjavo velikosti; zrnc in drugih organelov je manj kot v resnici.",
  poskusi: "Zamenjaj vrsto bele krvničke in primerjaj obliko jedra, barvo zrnc in velikost z rdečo krvničko.",
  merilo: { m: 24e-6, oznaka: "24 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  const kit = videzCelic(THREE, { hi, odpad });
  const { sum, fbm } = kit;

  // ---------- orodja ----------
  let seme = 7;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const Y = V(0, 1, 0);
  const o = new THREE.Object3D();
  // mat(barva, {…}): mokra organska površina (relief in vlažen videz doda kit.poliraj na koncu).
  function mat(barva, op = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.2,
      sheen: 0.35, sheenColor: new THREE.Color(barva).lerp(new THREE.Color(0xffffff), 0.45).multiplyScalar(0.8), sheenRoughness: 0.45,
    }, op));
    odpad.push(m);
    return m;
  }
  // Združi geometrije (z indeksom ali brez) v eno; barve = seznam barv (vsaka geometrija svojo) ali true (obdrži barve oglišč).
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], idx = [];
    let off = 0;
    geos.forEach((g, i) => {
      const p = g.attributes.position, n = g.attributes.normal;
      const c = Array.isArray(barve) ? new THREE.Color(barve[i]) : null, gc = barve === true ? g.attributes.color : null;
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
  function pobarvaj(g, barva) {
    const c = new THREE.Color(barva), n = g.attributes.position.count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  }
  function deformiraj(g, f) {
    const p = g.attributes.position, v = V();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); f(v); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
  const nit = (tocke, r, seg, rs = 6) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tocke), q(seg), r, q(rs), false);
  // Odrezan osmi del: x < 0, y > 0, z > 0 (proti gledalcu levo zgoraj).
  const vIzrezu = (v, c = { x: 0, y: 0, z: 0 }) => v.x < c.x && v.y > c.y && v.z > c.z;
  const POG = V(-0.47, 0.34, 0.81).normalize();

  // ---------- lupine z odrezanim osmim delom in njihovi prerezi ----------
  // Lupina; f(smer) vrne polmer v tej smeri.
  function lupina(f, ws, hs) {
    ws = Math.round(ws / 4) * 4; // enako število oglišč na ekvatorju: brez razpoke
    const zg = new THREE.SphereGeometry(1, (ws * 3) / 4, hs / 2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const v = V();
    for (const g of [zg, sp]) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); v.multiplyScalar(f(v)); p.setXYZ(i, v.x, v.y, v.z); }
      g.computeVertexNormals();
    }
    return zgladi(zdruzi([zg, sp]));
  }
  // Povpreči normale v ogliščih z enakim položajem (šiv brez vidnega roba v senčenju).
  function zgladi(g) {
    const p = g.attributes.position, n = g.attributes.normal, sk = new Map();
    for (let i = 0; i < p.count; i++) {
      const kl = Math.round(p.getX(i) * 1e4) + "," + Math.round(p.getY(i) * 1e4) + "," + Math.round(p.getZ(i) * 1e4);
      (sk.get(kl) || sk.set(kl, []).get(kl)).push(i);
    }
    const v = V();
    for (const ix of sk.values()) {
      if (ix.length < 2) continue;
      v.set(0, 0, 0);
      for (const i of ix) v.x += n.getX(i), v.y += n.getY(i), v.z += n.getZ(i);
      v.normalize();
      for (const i of ix) n.setXYZ(i, v.x, v.y, v.z);
    }
    return g;
  }
  const LOKI = [
    (t) => V(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)),
    (t) => V(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0),
    (t) => V(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)),
  ];
  // Ploskev prereza membrane (trije loki na ravninah izreza); aRez = (dolžina vzdolž roba, globina 0 … 1 od zunaj navznoter).
  function prerezDvosloj(fZ, fN, seg) {
    const pos = [], rez = [], idx = [], prej = V(), P = V();
    LOKI.forEach((L, li) => {
      const off = pos.length / 3;
      let s = li * 7.3;
      for (let i = 0; i <= seg; i++) {
        const d = L(i / seg).normalize(), rz = fZ(d), rn = fN(d);
        P.copy(d).multiplyScalar(rz);
        if (i) s += P.distanceTo(prej);
        prej.copy(P);
        for (const t of [0, 1]) { const rr = rz + (rn - rz) * t; pos.push(d.x * rr, d.y * rr, d.z * rr); rez.push(s, t); }
      }
      for (let i = 0; i < seg; i++) { const a = off + i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Lipidni dvosloj, narisan v senčilniku (kot v zivalska.js): glave fosfolipidov, po dva repa, ponekod beljakovina čez
  // ves dvosloj. D = debelina membrane v enotah mreže.
  function dvoslojMat(D) {
    const m = mat(0xffffff, { roughness: 0.46, clearcoat: 0.55, clearcoatRoughness: 0.18, sheen: 0.3, sheenColor: new THREE.Color(0xdcd6ff), side: THREE.DoubleSide });
    m.userData.rez = true;
    const Df = (+D).toFixed(5);
    function dodaj(m) {
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec2 aRez;\nvarying vec2 vRez;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRez = aRez;");
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vRez;" + kit.GLSL)
          .replace("#include <color_fragment>", `#include <color_fragment>
            float D = ${Df}, y = vRez.y * D, s = vRez.x, aa = max(fwidth(s), 1e-5);
            float h = 0.25 * D, xl = (fract(s / h) - 0.5) * h, ci = floor(s / h);
            float bx = s / (4.0 * h), bl = (fract(bx) - 0.5) * 4.0 * h, jeB = step(0.82, zvH(vec3(floor(bx), 3.1, 7.7)));
            float rh = 0.115 * D, d1 = length(vec2(xl, y - 0.13 * D)), d2 = length(vec2(xl, y - 0.87 * D)), dg = min(d1, d2);
            float gl = smoothstep(rh + aa, rh - aa, dg);
            float yy = min(y, D - y), wig = 0.02 * D * sin(yy / D * 38.0 + ci * 1.7), rp = 0.0;
            for (int k = 0; k < 2; k++) {
              float xt = abs(xl - (float(k) * 2.0 - 1.0) * 0.045 * D - wig);
              rp = max(rp, smoothstep(0.021 * D + aa, 0.021 * D - aa, xt) * smoothstep(0.2 * D, 0.23 * D, yy) * smoothstep(0.49 * D, 0.46 * D, yy));
            }
            vec3 bv = mix(vec3(0.78, 0.76, 0.95), vec3(0.97, 0.95, 1.0), rp);
            bv = mix(bv, vec3(0.5, 0.34, 0.9) * (0.72 + 0.45 * (1.0 - dg / rh)), gl);
            float pd = length(vec2(bl / (1.75 * h), (y - 0.5 * D) / (0.55 * D))), pa = fwidth(pd), pm = jeB * smoothstep(1.0 + pa, 1.0 - pa, pd);
            bv = mix(bv, vec3(0.98, 0.7, 0.24) * (0.7 + 0.4 * (1.0 - pd)), pm);
            bv *= 1.0 - 0.4 * (1.0 - smoothstep(0.0, 0.04, min(vRez.y, 1.0 - vRez.y)));
            diffuseColor.rgb = pow(bv, vec3(2.2));
            float zh = (gl * (1.0 - pm) * sqrt(max(0.0, 1.0 - dg * dg / (rh * rh))) * 0.5 + pm * sqrt(max(0.0, 1.0 - pd * pd)) * 0.8 + rp * 0.12) * D * 0.2;`)
          .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal = zvRelief(normal, zh, faceDirection);");
      };
      m.customProgramCacheKey = () => "zv-dvosloj-" + Df;
      m.clone = function () { const c = new this.constructor().copy(this); dodaj(c); return c; };
    }
    dodaj(m);
    return m;
  }
  // Ploskev prereza plasti med zunanjo fZ in notranjo fN ploskvijo; pasovi [[t0, t1, barva], …] od zunaj (t = 0) navznoter.
  // pora(t, lok) → true: presledek v obeh membranah (jedrna pora).
  function prerezPlasti(fZ, fN, seg, pasovi, pora) {
    const pos = [], col = [], idx = [], c = new THREE.Color(), cp = new THREE.Color(0xe8d6ff);
    LOKI.forEach((L, li) => {
      for (const [t0, t1, barva] of pasovi) {
        const off = pos.length / 3;
        for (let i = 0; i <= seg; i++) {
          const d = L(i / seg).normalize(), rz = fZ(d), rn = fN(d);
          c.set(barva);
          if (pora && pora(i / seg, li) && t0 > 0.02 && t1 < 0.98) c.copy(cp);
          for (const t of [t0, t1]) { const rr = rz + (rn - rz) * t; pos.push(d.x * rr, d.y * rr, d.z * rr); col.push(c.r, c.g, c.b); }
        }
        for (let i = 0; i < seg; i++) { const a = off + i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // dvojna jedrna ovojnica: dva dvosloja (temni glavi, svetli repi) s svetlim presledkom
  const OVOJNICA = [[0, 0.04, 0x34107a], [0.04, 0.11, 0x6a2fd0], [0.11, 0.2, 0xc39af5], [0.2, 0.3, 0x6a2fd0],
    [0.3, 0.7, 0xe8d6ff], [0.7, 0.8, 0x6a2fd0], [0.8, 0.89, 0xc39af5], [0.89, 0.96, 0x6a2fd0], [0.96, 1, 0x34107a]];

  // Postavi vsebino (zgrajeno v µm) v enotsko kroglo: središče škatle v izhodišče, največji polmer = cilj. Vrne enote na µm.
  function umeri(ob, cilj = 0.98) {
    ob.position.set(0, 0, 0); ob.scale.setScalar(1); ob.updateMatrixWorld(true);
    ob.traverse((m) => { if (m.isInstancedMesh) { m.computeBoundingBox(); m.computeBoundingSphere(); } });
    const c = new THREE.Box3().setFromObject(ob, true).getCenter(V());
    let r = 0; const v = V();
    ob.traverseVisible((m) => {
      if (!m.isMesh) return;
      if (m.isInstancedMesh) {
        if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
        const mi = new THREE.Matrix4(), sf = new THREE.Sphere();
        for (let i = 0; i < m.count; i++) { m.getMatrixAt(i, mi); sf.copy(m.geometry.boundingSphere).applyMatrix4(mi).applyMatrix4(m.matrixWorld); r = Math.max(r, sf.center.distanceTo(c) + sf.radius); }
        return;
      }
      const p = m.geometry.attributes.position, st = Math.max(1, Math.floor(p.count / 3000));
      for (let i = 0; i < p.count; i += st) r = Math.max(r, v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld).distanceTo(c));
    });
    const s = cilj / r;
    ob.scale.setScalar(s); ob.position.copy(c).multiplyScalar(-s);
    return s;
  }
  const oznaka = (um) => (um >= 10 ? String(Math.round(um)) : String(Math.round(um * 10) / 10).replace(".", ",")) + " µm";

  // ---------- organeli (kot v zivalska.js; zgrajeni v enotah živalske celice, nato povečani) ----------
  // Mitohondrij v prerezu: zunanja membrana, odprtina proti gledalcu, v njej kriste.
  function mitohondrijGeo() {
    const L = 0.12, r = 0.055, prof = [];
    for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (i / 12) * Math.PI; prof.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); }
    const zun = new THREE.LatheGeometry(prof, q(18), 0.5 * Math.PI, 1.45 * Math.PI);
    const not = new THREE.LatheGeometry(prof.map((p) => new THREE.Vector2(p.x * 0.86, p.y * 0.93)), q(18), 0.5 * Math.PI, 1.45 * Math.PI);
    const ix = not.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i]; ix[i] = ix[i + 2]; ix[i + 2] = t; }
    not.computeVertexNormals();
    const kr = [];
    for (let i = 0; i < 6; i++) {
      const y = -L / 2 - r * 0.45 + i * ((L + r * 0.9) / 5);
      const w = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, Math.abs(y) - L / 2) / r, 2))) * r * 0.85;
      const c = new THREE.BoxGeometry(w * 1.5, 0.008, w * 1.6, 1, 1, 1);
      c.translate(i % 2 ? w * 0.25 : -w * 0.25, y, 0);
      kr.push(c);
    }
    const g = zdruzi([zun, not, ...kr], [0xd98a1e, 0xf0b24a, ...kr.map(() => 0xffd67e)]);
    const p = g.attributes.position, v = V(), H = L / 2 + r;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const t = v.y / H, w = 1 + 0.07 * Math.sin(t * 3.1 + 0.6) + 0.04 * sum(v.x * 40, v.y * 40, v.z * 40);
      p.setXYZ(i, v.x * w + 0.032 * (t * t - 0.4), v.y, v.z * w);
    }
    g.computeVertexNormals();
    return g;
  }
  // Odprtina mitohondrija gleda proti kameri, os je naključna, a pravokotna na smer pogleda.
  const mW = V(Math.sin(0.225 * Math.PI), 0, Math.cos(0.225 * Math.PI)), mP = V(0, 1, 0).cross(mW);
  function protiKameri() {
    const w = POG.clone().add(V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.5)).normalize();
    const y = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).projectOnPlane(w).normalize();
    const L = new THREE.Matrix4().makeBasis(mP, V(0, 1, 0), mW), T = new THREE.Matrix4().makeBasis(y.clone().cross(w), y, w);
    return new THREE.Quaternion().setFromRotationMatrix(T.multiply(L.transpose()));
  }
  // Golgijev aparat: ukrivljene sploščene cisterne (cis svetlejše, trans temnejše) in mehurčki ob koncih.
  function golgiGeo(n) {
    const zb = { pos: [], col: [], idx: [] };
    const mreza = (nU, nV, f, b) => {
      const off = zb.pos.length / 3, P = V();
      for (let j = 0; j <= nV; j++) for (let i = 0; i <= nU; i++) { f(i / nU, j / nV, P); zb.pos.push(P.x, P.y, P.z); const c = b(i / nU, j / nV); zb.col.push(c[0], c[1], c[2]); }
      for (let j = 0; j < nV; j++) for (let i = 0; i < nU; i++) { const a = off + j * (nU + 1) + i, c = a + nU + 1; zb.idx.push(a, c, a + 1, a + 1, c, c + 1); }
    };
    const gCis = new THREE.Color(B.golgiSvetel), gTrans = new THREE.Color(0xd9781a), gRob = new THREE.Color(0xffeaa8), gC = new THREE.Color();
    const konci = [];
    for (let i = 0; i < n; i++) {
      const R = 0.26 - i * 0.022, L = Math.PI * (0.78 - i * 0.05), a0 = Math.PI * (0.11 + i * 0.025), W = 0.05 * (1 - i * 0.03), T = 0.0075;
      const prerez = (u, v) => {
        const s = 2 * u - 1, e = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(s), 6)), 0.3) * (1 + 0.7 * Math.pow(s, 4));
        const b = v * Math.PI * 2, cb = Math.cos(b), sb = Math.sin(b);
        return { cb, sb, rad: T * e * (1 + 3 * Math.pow(sb, 12)) * Math.sign(cb) * Math.pow(Math.abs(cb), 0.4), z: W * e * sb };
      };
      mreza(q(30), q(12), (u, v, P) => { const a = a0 + u * L, x = prerez(u, v), r = R + x.rad; P.set(Math.cos(a) * r, Math.sin(a) * r, x.z); },
        (u, v) => { const x = prerez(u, v); gC.copy(gCis).lerp(gTrans, i / Math.max(1, n - 1)).lerp(gRob, 0.3 * Math.pow(Math.abs(x.sb), 10)); const k = 0.84 + 0.16 * x.cb; return [gC.r * k, gC.g * k, gC.b * k]; });
      for (const u of [0, 1]) konci.push({ a: a0 + u * L + (u ? 1 : -1) * 0.12, r: R });
    }
    for (let k = 0; k < (hi ? 8 : 5); k++) {
      const kk = konci[(k * 3) % konci.length], c = V(Math.cos(kk.a) * kk.r, Math.sin(kk.a) * kk.r, (rnd() - 0.5) * 0.06), r = 0.017 + rnd() * 0.01, b = gC.copy(gCis).lerp(gTrans, 0.6);
      mreza(q(10), q(7), (u, v, P) => { P.set(Math.sin(Math.PI * v) * Math.cos(2 * Math.PI * u), Math.cos(Math.PI * v), Math.sin(Math.PI * v) * Math.sin(2 * Math.PI * u)).multiplyScalar(r).add(c); },
        (u, v) => { const t = 0.8 + 0.2 * Math.cos(Math.PI * v); return [b.r * t, b.g * t, b.b * t]; });
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(zb.pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(zb.col, 3));
    g.setIndex(zb.idx);
    g.computeVertexNormals();
    return g;
  }
  // par pravokotnih centriol iz devetih trojčkov mikrotubulov
  function centrioliGeo() {
    const c = (rot) => {
      const g = [];
      for (let i = 0; i < 9; i++) for (let t = 0; t < 3; t++) {
        const a = (i / 9) * Math.PI * 2 + t * 0.09, rr = 0.03 - t * 0.0045, cy = new THREE.CylinderGeometry(0.0042, 0.0042, 0.11, q(6), 1);
        cy.translate(Math.cos(a) * rr, 0, Math.sin(a) * rr);
        if (rot) cy.rotateX(Math.PI / 2).translate(0, 0.05, 0.06);
        g.push(cy);
      }
      return g;
    };
    return zdruzi([...c(false), ...c(true)]);
  }

  // ---------- vrste ----------
  const VRSTE = {
    nevtrofilec: {
      ime: "Nevtrofilec", d: 13.5, velikost: "12–15 µm", delez: "50–70 %", cit: 0x4a2a68, citU: "#f2d8e4", guba: 0.06, nMv: 300, nabori: 7,
      opisCel: "Najpogostejša bela krvnička; prva prihiti na mesto okužbe in požre bakterije (fagocitoza).",
      jedro: { lobi: [[-2.6, 0.5, -0.6, 1.55], [-1.1, 1.9, -0.9, 1.35], [1.0, 1.6, -1.0, 1.45], [2.5, 0.1, -0.5, 1.5]], most: 0.3 },
      jedroOpis: "Jedro je razdeljeno na 3 do 5 režnjev, povezanih s tankimi nitmi; zato se celica lažje preriva skozi steno žile.",
      zrnca: [
        { id: "zrnca", n: 260, r: [0.12, 0.18], barva: "#f7a6dc", ucb: "#f0b8dc", ime: "Specifična zrnca", opis: "Najštevilnejša drobna zrnca z encimi in beljakovinami, ki ubijajo bakterije; pri barvanju so bledo rožnata." },
        { id: "azurofilna-zrnca", n: 70, r: [0.2, 0.27], barva: "#e0306e", ucb: "#9a2a7a", ime: "Azurofilna zrnca", opis: "Večja zrnca (lizosomi) s prebavnimi encimi in snovmi, ki tvorijo strupene oblike kisika; izlijejo se v fagosom z bakterijo." },
      ],
      glikogen: 220, mito: 7, golgi: 3.2, cent: [0.1, 0.2, 0.9], fagosom: [-2.3, 2.1, 2.2],
    },
    eozinofilec: {
      ime: "Eozinofilec", d: 14, velikost: "12–17 µm", delez: "1–4 %", cit: 0x52284c, citU: "#f5dccc", guba: 0.04, nMv: 260, nabori: 4,
      opisCel: "Bela krvnička, ki se bori proti zajedavcem (npr. glistam) in sodeluje pri alergijah.",
      jedro: { lobi: [[-2.3, 0.6, -0.8, 2.05], [2.3, 0.3, -0.6, 1.95]], most: 0.45 },
      jedroOpis: "Jedro ima navadno dva režnja, povezana z ožino, kot očala.",
      zrnca: [{ id: "zrnca", n: 130, r: [0.36, 0.48], barva: "#ff5a26", ucb: "#f05a30", kristal: true, ime: "Eozinofilna zrnca", opis: "Velika zrnca s kristalnim jedrom iz strupenih beljakovin, s katerimi eozinofilec uničuje zajedavce; z eozinom se obarvajo oranžno rdeče." }],
      mito: 8, golgi: 3.4, cent: [0.1, 0.8, 0.8],
    },
    bazofilec: {
      ime: "Bazofilec", d: 13, velikost: "12–15 µm", delez: "manj kot 1 %", cit: 0x3e2a68, citU: "#e6d8ee", guba: 0.045, nMv: 260, nabori: 4,
      opisCel: "Najredkejša bela krvnička; z izločanjem histamina sproži vnetje in alergijski odziv.",
      jedro: { lobi: [[-1.9, 0.9, -0.4, 1.9], [1.8, -0.7, -0.9, 1.85]], most: 0.6, s: true },
      jedroOpis: "Jedro ima dva režnja v obliki črke S; pogosto ga skoraj prekrijejo temna zrnca.",
      zrnca: [{ id: "zrnca", n: 85, r: [0.38, 0.55], barva: "#2e0f66", ucb: "#2c2a8c", ime: "Bazofilna zrnca", opis: "Velika temno vijolična zrnca s histaminom in heparinom; histamin razširi žile ter sproži srbenje in oteklino pri alergiji." }],
      glikogen: 150, mito: 6, golgi: 3.2, cent: [0.2, 0.3, 1.2],
    },
    limfocit: {
      ime: "Limfocit", d: 8.5, velikost: "7–10 µm", delez: "20–40 %", cit: 0x203c86, citU: "#a8d0f0", guba: 0.02, nMv: 420, nabori: 2,
      opisCel: "Bela krvnička imunskega sistema: limfociti B izdelujejo protitelesa, limfociti T neposredno napadejo okužene celice.",
      jedro: { okroglo: [3.35, 0.94, 1.0, 0.95], c: [0.35, 0.05, -0.25], vdolbina: 0.08, vd: [0.62, 0.78, -0.1], gost: true },
      jedroOpis: "Veliko okroglo jedro zapolni skoraj vso celico; okoli njega je le tanek pas citoplazme. Obdaja ga dvojna ovojnica s porami.",
      mito: 5, ribosomi: 650, golgi: 2.2, cent: [1.6, 2.6, 1.9],
    },
    monocit: {
      ime: "Monocit", d: 17.5, velikost: "15–20 µm", delez: "2–8 %", cit: 0x2e3a78, citU: "#c8d0e4", guba: 0.055, nMv: 340, nabori: 8,
      opisCel: "Največja bela krvnička; ko iz krvi preide v tkivo, postane makrofag, ki požira bakterije in odmrle celice.",
      jedro: { okroglo: [4.4, 1.15, 0.9, 0.82], c: [0.4, -1.0, -0.9], vdolbina: 0.6, siroko: 0.55, vd: [-0.1, 1, 0.1] },
      jedroOpis: "Veliko jedro ima obliko ledvice ali podkve; v vdolbini sta Golgijev aparat in centrosom. Obdaja ga dvojna ovojnica s porami.",
      zrnca: [{ id: "lizosomi", n: 80, r: [0.13, 0.22], barva: B.lizosom, ime: "Lizosomi (azurofilna zrnca)", opis: "Drobni mešički z encimi, ki razgradijo požrte bakterije in ostanke celic." }],
      mito: 10, vakuole: 6, ribosomi: 300, golgi: 4.6,
    },
  };

  // ---------- rdeča krvnička za primerjavo (Evans in Fung) ----------
  const R0 = 3.91, P = (x) => 0.81 + 7.83 * x - 4.39 * x * x;
  function eritrocitGeo() {
    const nu = q(72), nv = q(48), pos = [], idx = [];
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const a = (j / nv) * Math.PI, f = (i / nu) * Math.PI * 2, s = Math.sin(a);
      pos.push(R0 * s * Math.cos(f), 0.5 * Math.cos(a) * P(s * s), R0 * s * Math.sin(f));
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const A = j * (nu + 1) + i, Bq = A + 1, C = A + nu + 2, D = A + nu + 1; idx.push(A, Bq, D, Bq, C, D); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return zgladi(g);
  }

  function zgradiVrsto(id) {
    const c = VRSTE[id];
    const T = new THREE.Group(); group.add(T);
    const D = [];
    const dd = (pid, ime, opis, barva, meshes, tocka) => { meshes.forEach((m) => { m.userData.del = pid; }); D.push({ id: pid, ime, opis, barva, meshes, tocka }); };
    seme = 11 + id.length * 31;
    const R = c.d / 2, DM = 0.94;

    // ---------- celična membrana (steklena), nabori in mikrovili ----------
    const gube = (d) => { const n = sum(d.x * 2.4 + 5, d.y * 2.4, d.z * 2.4); return Math.pow(1 - Math.abs(n), 4); };
    const oblika = (d) => R * (1 + c.guba * gube(d) + 0.025 * fbm(d.x * 1.5 + 2, d.y * 1.5, d.z * 1.5) - c.guba * 0.3);
    const memMat = kit.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.13, rf: 19 / R, rob: "#8c9cff", rk: 1.3 });
    const memOut = new THREE.Mesh(lupina(oblika, q(120), q(72)), memMat);
    const memRob = new THREE.Mesh(prerezDvosloj(oblika, (d) => oblika(d) * DM, q(120)), dvoslojMat(R * (1 - DM)));
    const citIn = new THREE.Mesh(lupina((d) => oblika(d) * DM, q(96), q(56)), mat(c.cit, { roughness: 0.62, clearcoat: 0.25, sheen: 0.35, side: THREE.BackSide }));
    T.add(memOut, memRob, citIn);
    // beljakovine na zunanji strani membrane
    const nad = (t) => ({ p: t.p.addScaledVector(t.n, 0.03), n: t.n });
    const belj = kit.beljakovine(kit.posej(memOut, hi ? 650 : 200).map(nad), B.beljakovine, 0.08, { visina: 1.6 });
    T.add(belj);
    // mikrovili: tanki prstasti izrastki (pri limfocitu najdaljši)
    const mvMat = kit.steklo(mat(0xa8b4ff, { side: THREE.FrontSide }), { a: 0.32, rf: 6, k: 0.5, rob: "#a8b8ff", rk: 1.3, difuzno: 0.3 });
    const mvGeo = new THREE.CapsuleGeometry(0.075, 1, hi ? 2 : 1, hi ? 7 : 4); mvGeo.translate(0, 0.5, 0);
    const nMv = hi ? c.nMv : Math.round(c.nMv * 0.45);
    const mv = new THREE.InstancedMesh(mvGeo, mvMat, nMv);
    const smer = V();
    for (let k = 0; k < nMv;) {
      smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
      if (smer.lengthSq() > 1 || smer.lengthSq() < 0.05) continue;
      smer.normalize();
      if (vIzrezu(smer, { x: 0.04, y: -0.04, z: -0.04 })) continue;
      o.position.copy(smer).multiplyScalar(oblika(smer) * 0.985);
      o.quaternion.setFromUnitVectors(Y, smer); o.rotateZ((rnd() - 0.5) * 0.5); o.scale.set(1, 0.3 + rnd() * (id === "limfocit" ? 0.45 : 0.3), 1); o.updateMatrix();
      mv.setMatrixAt(k++, o.matrix);
    }
    // nabori (gube membrane, lamelipodiji): tanke valovite plošče, dvignjene s površine
    const nab = [];
    for (let k = 0, t = 0; k < c.nabori && t < 400; t++) {
      const s0 = V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize();
      if (vIzrezu(s0, { x: 0.35, y: -0.35, z: -0.35 })) continue;
      const os = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).cross(s0).normalize(), L = 0.25 + rnd() * 0.2, h = R * (0.07 + rnd() * 0.05), N = q(36), RS = hi ? 10 : 6;
      const sr = [];
      for (let i = 0; i <= N; i++) { const u = i / N; sr.push(s0.clone().applyAxisAngle(os, (u - 0.5) * L).addScaledVector(os, 0.05 * Math.sin(u * 9 + k)).normalize()); }
      const pos = [], idx = [];
      for (let i = 0; i <= N; i++) {
        const u = i / N, d = sr[i], tt = sr[Math.min(N, i + 1)].clone().sub(sr[Math.max(0, i - 1)]);
        const bp = d.clone().multiplyScalar(oblika(d) * 0.99), hh = h * Math.pow(Math.sin(Math.PI * u), 0.6) * (0.8 + 0.2 * Math.sin(u * 13 + k)) + 0.02;
        const bn = d.clone().cross(tt).normalize(), w = 0.05 + 0.02 * Math.sin(u * 7);
        for (let j = 0; j < RS; j++) {
          const th = (j / RS) * Math.PI * 2, val = 0.08 * Math.sin(u * 11 + k) * (1 - Math.cos(th)) * 0.5;
          const pp = bp.clone().addScaledVector(d, hh * 0.5 * (1 - Math.cos(th)) - 0.04).addScaledVector(bn, w * Math.sin(th) + val);
          pos.push(pp.x, pp.y, pp.z);
        }
      }
      for (let i = 0; i < N; i++) for (let j = 0; j < RS; j++) { const a = i * RS + j, b = i * RS + ((j + 1) % RS); idx.push(a, a + RS, b, b, a + RS, b + RS); }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx); g.computeVertexNormals();
      nab.push(g); k++;
    }
    const nabori = nab.length ? new THREE.Mesh(zdruzi(nab), mvMat) : null;
    T.add(mv);
    if (nabori) T.add(nabori);

    // ---------- jedro ----------
    const krogle = []; // približek jedra za razporejanje organelov
    const zasedeno = []; // { p, r } že postavljeni organeli
    const jA = new THREE.Color("#9a52f2"), jB = new THREE.Color(B.kromatin), jT = new THREE.Color();
    const lisasto = (g, ox = 0) => {
      const p = g.attributes.position, col = new Float32Array(p.count * 3);
      for (let i = 0; i < p.count; i++) { const n = fbm(p.getX(i) * 1.3 + ox, p.getY(i) * 1.3, p.getZ(i) * 1.3); jT.copy(jA).lerp(jB, THREE.MathUtils.clamp(n * 1.5 + 0.4, 0, 1)); col.set([jT.r, jT.g, jT.b], i * 3); }
      g.setAttribute("color", new THREE.BufferAttribute(col, 3));
      return g;
    };
    const jMeshes = {};
    let jElip = null, JG = null, Jc = null;
    if (c.jedro.lobi) {
      const L = c.jedro.lobi, jg = [];
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
        if (c.jedro.s) m.add(V(0, i % 2 ? -0.9 : 0.9, 0.5)); else m.add(V(0, 0.4, 0.3));
        jg.push(lisasto(nit([a, m, b], c.jedro.most, 24, 8)));
      }
      const jedro = new THREE.Mesh(zdruzi(jg, true), mat(0xffffff, { vertexColors: true, roughness: 0.42, clearcoat: 0.6 }));
      T.add(jedro);
      jMeshes.jedro = [jedro];
      // jedrne pore na površini ovojnice
      const N = hi ? 160 : 70, pt = kit.posej(jedro, N);
      const pore = new THREE.InstancedMesh(new THREE.TorusGeometry(0.075, 0.03, 3, q(10)), mat(B.ovojnica, { roughness: 0.4 }), pt.length);
      pt.forEach((t, k) => { o.position.copy(t.p).addScaledVector(t.n, 0.01); o.quaternion.setFromUnitVectors(V(0, 0, 1), t.n); o.scale.setScalar(0.85 + rnd() * 0.3); o.updateMatrix(); pore.setMatrixAt(k, o.matrix); });
      T.add(pore);
      jMeshes.jedro.push(pore);
    } else {
      // okroglo jedro (limfocit) ali ledvičasto (monocit), odprto kot celica: vidita se ovojnica in kromatin v njem
      const [r, sx, sy, sz] = c.jedro.okroglo, vd = V(...c.jedro.vd).normalize();
      Jc = V(...c.jedro.c);
      JG = new THREE.Group(); JG.position.copy(Jc); JG.scale.set(sx, sy, sz); T.add(JG);
      const fJ = (d) => { const kot = d.angleTo(vd); return r * (1 - c.jedro.vdolbina * Math.exp(-(kot * kot) / (c.jedro.siroko || 0.4)) + 0.035 * fbm(d.x * 3 + 1, d.y * 3, d.z * 3)); };
      const DJ = 0.93;
      const jOut = new THREE.Mesh(lisasto(lupina(fJ, q(84), q(52))), mat(0xffffff, { vertexColors: true, roughness: 0.42, clearcoat: 0.6 }));
      const jIn = new THREE.Mesh(lupina((d) => fJ(d) * DJ, q(64), q(40)), mat(0x9658e6, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
      const jRob = new THREE.Mesh(prerezPlasti(fJ, (d) => fJ(d) * DJ, q(72), OVOJNICA, (t, k) => Math.abs(((t * 7 + k * 0.37) % 1) - 0.5) < 0.04 && t > 0.06 && t < 0.94),
        mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
      jRob.material.userData.rez = true;
      JG.add(jOut, jIn, jRob);
      // pore
      const pt = kit.posej(jOut, hi ? 150 : 70);
      const pore = new THREE.InstancedMesh(new THREE.TorusGeometry(0.075, 0.03, 3, q(10)), mat(B.ovojnica, { roughness: 0.4 }), pt.length);
      pt.forEach((t, k) => { o.position.copy(t.p).addScaledVector(t.n, 0.01); o.quaternion.setFromUnitVectors(V(0, 0, 1), t.n); o.scale.setScalar(0.85 + rnd() * 0.3); o.updateMatrix(); pore.setMatrixAt(k, o.matrix); });
      JG.add(pore);
      // heterokromatin: temne kepe ob ovojnici in posamezne v notranjosti; evkromatin: rahle niti
      const kepG = new THREE.IcosahedronGeometry(1, hi ? 1 : 0);
      deformiraj(kepG, (v) => v.multiplyScalar(1 + 0.25 * sum(v.x * 1.8 + 3, v.y * 1.8, v.z * 1.8)));
      const nKep = (c.jedro.gost ? 75 : 34) * (hi ? 1 : 0.6) | 0;
      const kepe = new THREE.InstancedMesh(kepG, mat(B.kromatin, { roughness: 0.45, clearcoat: 0.5 }), nKep);
      let k = 0;
      for (let t = 0; k < nKep && t < 5000; t++) {
        const d = V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
        if (d.lengthSq() > 1 || d.lengthSq() < 0.01) continue;
        const ob = rnd() < 0.65, rr = r * (c.jedro.gost ? 0.07 + rnd() * 0.06 : 0.05 + rnd() * 0.04);
        const p = ob ? d.clone().normalize().multiplyScalar(fJ(d.clone().normalize()) * DJ - rr * 0.6) : d.multiplyScalar(r * 0.7);
        if (vIzrezu(p, { x: rr, y: -rr, z: -rr })) continue;
        o.position.copy(p); o.quaternion.setFromUnitVectors(Y, p.clone().normalize()); o.scale.set(rr * 1.3, rr * (ob ? 0.6 : 1), rr); o.updateMatrix(); kepe.setMatrixAt(k++, o.matrix);
      }
      kepe.count = k;
      const niti = [];
      for (let i = 0; i < (hi ? 12 : 7); i++) {
        const pts = [];
        let p = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(r);
        for (let s = 0; s < 9; s++) { p = p.clone().add(V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(r * 0.3)); if (p.length() > r * 0.8) p.multiplyScalar(0.7); pts.push(p); }
        niti.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(32), r * 0.024, q(5), false));
      }
      const krom = new THREE.Mesh(zdruzi(niti), mat(0x6a30d8, { roughness: 0.5, clearcoat: 0.5 }));
      // jedrce
      const jcG = new THREE.SphereGeometry(r * 0.17, q(32), q(22));
      deformiraj(jcG, (v) => v.multiplyScalar(1 + 0.12 * fbm(v.x / r * 18, v.y / r * 18, v.z / r * 18)));
      const jedrce = new THREE.Mesh(jcG, mat(B.jedrce, { roughness: 0.5, clearcoat: 0.5 }));
      jedrce.position.set(-r * 0.12, r * 0.1, r * 0.12);
      JG.add(kepe, krom, jedrce);
      jMeshes.jedro = [jOut, jRob, pore];
      jMeshes.nukleoplazma = [jIn];
      jMeshes.kromatin = [kepe, krom];
      jMeshes.jedrce = [jedrce];
      jElip = { J: Jc, r, sx, sy, sz };
      krogle.push({ c: Jc, r: 0 });
    }

    // ---------- citoplazma: postavljanje organelov ----------
    const vJedru = (p, rr) => {
      if (krogle.some((k) => k.r && p.distanceTo(k.c) < k.r + rr + 0.1)) return true;
      if (jElip) { const d = p.clone().sub(jElip.J); return V(d.x / jElip.sx, d.y / jElip.sy, d.z / jElip.sz).length() < jElip.r * 1.04 + rr; }
      return false;
    };
    function vCitoplazmi(rr, rob = 0.9, pogoj) {
      for (let t = 0; t < 5000; t++) {
        const p = V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
        if (p.lengthSq() > 1) continue;
        p.multiplyScalar(R * DM * rob);
        if (p.length() + rr > R * DM * rob) continue;
        if (vJedru(p, rr) || zasedeno.some((z) => p.distanceTo(z.p) < z.r + rr + 0.04)) continue;
        if (pogoj && !pogoj(p)) continue;
        zasedeno.push({ p, r: rr });
        return p;
      }
      return null;
    }
    const naj = (arr) => arr.reduce((a, p) => ((vIzrezu(p) ? 1 : 0) + p.dot(POG) / R > (vIzrezu(a) ? 1 : 0) + a.dot(POG) / R ? p : a), arr[0]);

    // fagosom z bakterijo (nevtrofilec) – v odprtem delu, da se vidi
    let fagosom = null, fagT = null;
    if (c.fagosom) {
      fagT = V(...c.fagosom);
      zasedeno.push({ p: fagT, r: 1.05 });
      const fg = new THREE.Mesh(new THREE.SphereGeometry(1, q(32), q(22)), kit.steklo(mat(0x9ff0ff), { a: 0.22, rf: 3, k: 0.4, rob: "#b8f6ff", rk: 1.2, difuzno: 0.35, iri: 0.3 }));
      fg.position.copy(fagT); fg.scale.set(1.05, 0.9, 0.95);
      const bakG = new THREE.CapsuleGeometry(0.28, 0.9, hi ? 4 : 2, hi ? 12 : 6);
      deformiraj(bakG, (v) => v.multiplyScalar(1 + 0.04 * sum(v.x * 9, v.y * 9, v.z * 9)));
      const bak = new THREE.Mesh(bakG, mat(0x5ccf62, { roughness: 0.4, clearcoat: 0.7 }));
      bak.position.copy(fagT); bak.rotation.set(0.6, 0.3, 1.1);
      T.add(fg, bak);
      fagosom = [fg, bak];
    }
    // Golgijev aparat in centrosom (pri monocitu v vdolbini jedra)
    let golgiPos, centPos;
    if (id === "monocit") {
      const vd = V(...c.jedro.vd).normalize();
      const hil = V(vd.x * jElip.sx, vd.y * jElip.sy, vd.z * jElip.sz).multiplyScalar(jElip.r * 0.62).add(jElip.J);
      golgiPos = hil.clone().add(V(-0.4, 0.3, 0.5)); centPos = hil.clone().add(V(0.9, 0.1, 0.3));
    } else {
      centPos = V(...c.cent);
      golgiPos = null;
    }
    zasedeno.push({ p: centPos, r: 0.4 });
    if (!golgiPos) golgiPos = vCitoplazmi(c.golgi * 0.28, 0.82, (p) => p.distanceTo(centPos) < R * 0.7) || centPos.clone().add(V(0.8, 0, 0.6));
    else zasedeno.push({ p: golgiPos, r: c.golgi * 0.25 });
    const golgi = new THREE.Mesh(golgiGeo(id === "monocit" ? 6 : 4), mat(0xffffff, { vertexColors: true, roughness: 0.34, clearcoat: 0.85, side: THREE.DoubleSide }));
    golgi.position.copy(golgiPos); golgi.scale.setScalar(c.golgi); golgi.lookAt(golgiPos.clone().add(POG)); golgi.rotateZ(rnd() * 6);
    const cent = new THREE.Mesh(centrioliGeo(), mat(B.centrosom, { roughness: 0.3, emissive: new THREE.Color(B.centrosom).multiplyScalar(0.15) }));
    cent.position.copy(centPos); cent.scale.setScalar(4.5); cent.rotation.set(0.4, 0.3, 0.5);
    T.add(golgi, cent);

    // zrnca (barva po vrsti)
    const zrnca = [];
    for (const z of c.zrnca || []) {
      const n = hi ? z.n : Math.round(z.n * 0.6);
      const kg = new THREE.SphereGeometry(1, q(z.kristal ? 16 : 12), q(z.kristal ? 12 : 9));
      deformiraj(kg, (v) => v.multiplyScalar(1 + 0.08 * sum(v.x * 1.6 + n, v.y * 1.6, v.z * 1.6)));
      const zm = z.kristal
        ? kit.steklo(mat(z.barva), { a: 0.55, rf: 4, k: 0.4, rob: "#ffc39a", rk: 1.1, difuzno: 0.85, iri: 0.2 })
        : mat(z.barva, { roughness: 0.3, clearcoat: 0.85, clearcoatRoughness: 0.1 });
      const m = new THREE.InstancedMesh(kg, zm, n);
      const jedra = z.kristal ? new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat(0x7a1808, { roughness: 0.35, clearcoat: 0.8 }), n) : null;
      const tt = [];
      let i = 0;
      for (; i < n; i++) {
        const r = z.r[0] + rnd() * (z.r[1] - z.r[0]);
        // azurofilna zrnca se zbirajo ob fagosomu
        const p = z.id === "azurofilna-zrnca" && fagT && i < 8
          ? (() => { const d = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(); const pp = fagT.clone().addScaledVector(d, 1.05 + r * 0.6); zasedeno.push({ p: pp, r }); return pp; })()
          : vCitoplazmi(r * (z.kristal ? 1.25 : 1));
        if (!p) break;
        tt.push(p);
        o.position.copy(p); o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.scale.set(r * (z.kristal ? 1.3 : 1), r, r * (z.kristal ? 0.9 : 1)); o.updateMatrix(); m.setMatrixAt(i, o.matrix);
        if (jedra) { o.scale.set(r * 1.1, r * 0.42, r * 0.55); o.updateMatrix(); jedra.setMatrixAt(i, o.matrix); }
      }
      m.count = i;
      if (jedra) jedra.count = i;
      T.add(m);
      if (jedra) T.add(jedra);
      zrnca.push({ z, meshes: jedra ? [m, jedra] : [m], tt });
    }
    // fagocitne vakuole (monocit)
    let vak = null; const vakT = [];
    if (c.vakuole) {
      vak = new THREE.InstancedMesh(new THREE.SphereGeometry(1, q(20), q(14)), kit.steklo(mat(B.vakuola), { a: 0.4, rf: 3, k: 0.3, rob: "#9ff0ff", rk: 1.2, difuzno: 0.6, iri: 0.3 }), c.vakuole);
      let i = 0;
      for (; i < c.vakuole; i++) { const r = 0.35 + rnd() * 0.4, p = vCitoplazmi(r, 0.85, i < 2 ? (pp) => vIzrezu(pp) : null) || vCitoplazmi(r, 0.85); if (!p) break; vakT.push(p); o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(r); o.updateMatrix(); vak.setMatrixAt(i, o.matrix); }
      vak.count = i;
      T.add(vak);
    }
    // mitohondriji (malo jih je), odprti proti gledalcu
    const mit = new THREE.InstancedMesh(mitohondrijGeo(), mat(0xffffff, { vertexColors: true, roughness: 0.38, side: THREE.DoubleSide }), c.mito);
    const mitT = [];
    {
      let i = 0;
      for (; i < c.mito; i++) { const p = vCitoplazmi(0.5, 0.88, i < 2 ? (pp) => vIzrezu(pp) : null) || vCitoplazmi(0.5, 0.88); if (!p) break; mitT.push(p); o.position.copy(p); o.quaternion.copy(protiKameri()); o.scale.setScalar(3.6 + rnd() * 0.8); o.updateMatrix(); mit.setMatrixAt(i, o.matrix); }
      mit.count = i;
      T.add(mit);
    }
    // ribosomi: pri limfocitu in monocitu veliko prostih (modrikasta citoplazma)
    let rib = null; const ribT = [];
    if (c.ribosomi) {
      const n = hi ? c.ribosomi : Math.round(c.ribosomi * 0.5);
      rib = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.06, 0), mat(B.ribosomi, { roughness: 0.28, clearcoat: 0.9, emissive: new THREE.Color(B.ribosomi).multiplyScalar(0.22) }), n);
      let i = 0, pos3 = 0;
      for (; i < n;) {
        const p = V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
        if (p.lengthSq() > 1) continue;
        p.multiplyScalar(R * DM * 0.97);
        if ((vJedru(p, 0.06) || zasedeno.some((z) => p.distanceTo(z.p) < z.r)) && ++pos3 < 40000) continue;
        // poliribosomi: kratke verižice
        const nn = rnd() < 0.5 ? 3 + Math.floor(rnd() * 4) : 1, kor = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).setLength(0.13);
        for (let j = 0; j < nn && i < n; j++) { o.position.copy(p).addScaledVector(kor, j); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.scale.setScalar(0.8 + rnd() * 0.4); o.updateMatrix(); rib.setMatrixAt(i++, o.matrix); ribT.push(o.position.clone()); kor.applyAxisAngle(Y, 0.6); }
      }
      T.add(rib);
    } else {
      // posamezni prosti ribosomi (brez imena; zlati drobci)
      const pt = [];
      for (let t = 0; pt.length < (hi ? 260 : 120) && t < 20000; t++) { const p = V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).multiplyScalar(R * DM * 0.95); if (p.length() < R * DM * 0.95 && !vJedru(p, 0.05)) pt.push(p); }
      T.add(kit.pike(pt, B.ribosomi, 0.1, 0.4));
    }
    // glikogen (nevtrofilec, bazofilec): rozete drobnih zrnc
    let glik = null; const glT = [];
    if (c.glikogen) {
      const kos = [];
      for (const [x, y, z] of hi ? [[0, 0, 0], [0.07, 0.02, 0], [-0.04, 0.06, 0.03], [-0.03, -0.05, 0.05], [0.02, -0.02, -0.07]] : [[0, 0, 0]]) kos.push(new THREE.IcosahedronGeometry(hi ? 0.05 : 0.08, 0).translate(x, y, z));
      const n = hi ? c.glikogen : Math.round(c.glikogen * 0.6);
      glik = new THREE.InstancedMesh(zdruzi(kos), mat("#cfe6ff", { roughness: 0.35, clearcoat: 0.6 }), n);
      let i = 0;
      for (let t = 0; i < n && t < 20000; t++) {
        const p = V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
        if (p.lengthSq() > 1) continue;
        p.multiplyScalar(R * DM * 0.95);
        if (vJedru(p, 0.1) || zasedeno.some((z) => p.distanceTo(z.p) < z.r + 0.08)) continue;
        glT.push(p); o.position.copy(p); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.scale.setScalar(0.8 + rnd() * 0.5); o.updateMatrix(); glik.setMatrixAt(i++, o.matrix);
      }
      glik.count = i;
      T.add(glik);
    }
    // citoskelet: mikrotubuli iz centrosoma (rumena sijoča vlakna) in aktinska skorja tik pod membrano
    const mt = [];
    for (let i = 0; i < (hi ? 34 : 14); i++) {
      const d = V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize();
      const kon = d.clone().multiplyScalar(oblika(d) * DM * (0.96 - 0.2 * rnd() * rnd()));
      const sr = [0.33, 0.66].map((u) => {
        const p = centPos.clone().lerp(kon, u).add(V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(R * 0.2));
        for (let k = 0; k < 6 && vJedru(p, 0.3); k++) p.multiplyScalar(1.12);
        if (p.length() > R * DM * 0.95) p.setLength(R * DM * 0.95);
        return p;
      });
      if (vJedru(kon, 0.1)) continue;
      const kr = new THREE.CubicBezierCurve3(centPos.clone(), sr[0], sr[1], kon);
      if (jElip && [0.3, 0.5, 0.7].some((u) => vIzrezu(kr.getPoint(u)))) continue; // ne čez odprto jedro
      mt.push(kr);
    }
    const akt = [];
    for (let i = 0, t = 0; i < (hi ? 140 : 45) && t < 3000; t++) {
      const d = V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize();
      const tg = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).cross(d).normalize();
      const pts = [];
      for (let j = 0; j < 4; j++) { const e = d.clone().addScaledVector(tg, (j - 1.5) * 0.06).add(V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.025)).normalize(); pts.push(e.multiplyScalar(oblika(e) * DM * (0.965 - 0.02 * rnd()))); }
      if (pts.some((x) => vIzrezu(x, { x: 0.1, y: -0.1, z: -0.1 }))) continue;
      akt.push(new THREE.CatmullRomCurve3(pts)); i++;
    }
    const cito = kit.vlakna(mt, 0.022, B.citoskelet, { sij: 0.5 });
    const aktin = kit.vlakna(akt, 0.018, B.aktin, { sij: 0.4, seg: hi ? 10 : 6, rad: 3 });
    T.add(cito, aktin);

    // drobna temna zrnca v citoplazmi (beljakovinski kompleksi), da notranjost ni prazna
    const prah = [];
    for (let t = 0; prah.length < (hi ? 2600 : 1000) && t < 60000; t++) {
      const p = V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
      if (p.lengthSq() > 1) continue;
      p.multiplyScalar(R * DM * 0.97);
      if (vIzrezu(p, { x: 0.05, y: -0.05, z: -0.05 }) || vJedru(p, 0.03)) continue;
      prah.push(p);
    }
    T.add(kit.pike(prah, new THREE.Color(c.cit).multiplyScalar(0.8), 0.045, 0.5));

    // ---------- rdeča krvnička za primerjavo ----------
    const eri = new THREE.Mesh(eritrocitGeo(), mat(0xa81828, { roughness: 0.4, clearcoat: 0.7, clearcoatRoughness: 0.12, sheen: 0.25 }));
    const smerE = V(0.87, -0.5, 0.6).normalize(), osE = V(-0.47, 0.34, 0.81).lerp(V(0.87, 0.3, 0.5), 0.6).normalize();
    eri.position.copy(smerE).multiplyScalar(R * 1.1 + R0 * 0.86);
    eri.quaternion.setFromUnitVectors(Y, osE);
    T.add(eri);

    const s = umeri(T, 0.985);
    T.traverse((x) => { if (x.isPoints) x.material.size *= s; }); // velikost točk je v enotah sveta, ne mreže
    const L = (p) => V(...p).multiplyScalar(s).add(T.position).toArray();
    const naCeli = (x, y, z) => { const d = V(x, y, z).normalize(); return L(d.multiplyScalar(oblika(d) * 1.01).toArray()); };
    const vJG = (p) => p.clone().multiply(JG.scale).add(JG.position);

    dd("membrana", "Celična membrana", "Prožna ovojnica iz dvosloja fosfolipidov z beljakovinami (v prerezu glave in repi); bela krvnička z njo spremeni obliko in se preriva skozi steno žile. Debelina je povečana.", "#9fb4ff", [memOut, memRob, belj], naCeli(0.55, 0.15, 0.8));
    dd("mikrovili", "Mikrovili in nabori", "Prstasti izrastki in valovite gube membrane; z njimi se bela krvnička oprime stene žile, tipa okolico in obda delce, ki jih bo požrla.", "#a8b4ff", nabori ? [mv, nabori] : [mv], naCeli(0.75, -0.35, 0.55));
    dd("citoplazma", "Citoplazma", c.opisCel + " Citoplazma z organeli zapolnjuje celico med membrano in jedrom.", "#" + new THREE.Color(c.cit).getHexString(), [citIn], L(V(0.45, -0.35, -0.55).normalize().multiplyScalar(R * 0.92).toArray()));
    if (c.jedro.lobi) {
      const k = krogle.reduce((a, b) => (b.c.z - b.c.x > a.c.z - a.c.x ? b : a));
      dd("jedro", "Jedro z režnji", c.jedroOpis + " Obdaja ga dvojna ovojnica s porami.", B.jedro, jMeshes.jedro, L(k.c.clone().add(V(-0.3, 0.45, 0.85).normalize().multiplyScalar(k.r * 0.95)).toArray()));
    } else {
      const r = jElip.r;
      dd("jedro", "Jedro", c.jedroOpis, B.jedro, jMeshes.jedro, L(vJG(V(0.2, 0.6, 0.75).normalize().multiplyScalar(r)).toArray()));
      dd("nukleoplazma", "Nukleoplazma", "Tekočina v jedru, v kateri sta kromatin in jedrce.", "#9658e6", jMeshes.nukleoplazma, L(vJG(V(0.45, -0.4, -0.6).normalize().multiplyScalar(r * 0.9)).toArray()));
      dd("kromatin", "Kromatin", id === "limfocit" ? "DNK z beljakovinami; pri limfocitu je večinoma zgoščen v temne kepe (heterokromatin), ker celica miruje, dokler je ne aktivira antigen." : "DNK z beljakovinami; pri monocitu je rahel in čipkast, ker v jedru poteka veliko prepisovanja genov.", B.kromatin, jMeshes.kromatin, L(vJG(V(-0.5, 0.2, 0.1).multiplyScalar(r)).toArray()));
      dd("jedrce", "Jedrce", "Gosto območje v jedru, kjer nastajajo deli ribosomov.", B.jedrce, jMeshes.jedrce, L(vJG(V(-0.12, 0.1, 0.12).multiplyScalar(r)).toArray()));
    }
    for (const { z, meshes, tt } of zrnca) if (tt.length) dd(z.id, z.ime, z.opis, z.barva, meshes, L(naj(tt).toArray()));
    if (fagosom) dd("fagosom", "Fagosom z bakterijo", "Mehurček, v katerega je nevtrofilec požrl bakterijo; zrnca se zlijejo z njim in vanj izlijejo encime, ki bakterijo razgradijo.", "#5ccf62", fagosom, L(fagT.toArray()));
    if (vak && vakT.length) dd("vakuole", "Fagocitne vakuole", "Mehurčki s požrtimi delci; lizosomi se zlijejo z njimi in vsebino prebavijo.", B.vakuola, [vak], L(naj(vakT).toArray()));
    if (glik && glT.length) dd("glikogen", "Zrnca glikogena", "Zaloga sladkorja; iz nje bela krvnička dobi energijo tudi v vnetem tkivu, kjer je malo kisika.", "#cfe6ff", [glik], L(naj(glT).toArray()));
    if (mitT.length) dd("mitohondrij", "Mitohondriji", "Pri celičnem dihanju pridobivajo energijo (ATP); v belih krvničkah jih je malo. Notranja membrana je nagubana v kriste.", B.mitohondrij, [mit], L(naj(mitT).toArray()));
    dd("golgi", "Golgijev aparat", "Kup sploščenih membranskih vrečk, ki dodela beljakovine in jih zapakira v zrnca in mešičke.", B.golgi, [golgi], L(golgiPos.toArray()));
    dd("centrosom", "Centrosom s centriolama", "Par valjčkov iz mikrotubulov; iz njega izraščajo mikrotubuli, po katerih se premikajo zrnca in organeli.", B.centrosom, [cent], L(centPos.toArray()));
    if (rib) dd("ribosomi", "Ribosomi", id === "limfocit" ? "Drobna zrnca, ki izdelujejo beljakovine (pri limfocitih B tudi protitelesa); zaradi njih je citoplazma modrikasta." : "Drobna zrnca, ki izdelujejo beljakovine; zaradi njih je citoplazma sivo modra.", B.ribosomi, [rib], L(naj(ribT).toArray()));
    dd("citoskelet", "Citoskelet", "Mikrotubuli iz centrosoma in aktinska vlakna pod membrano; omogočajo, da celica spreminja obliko, se plazi in požira delce.", B.citoskelet, [cito, aktin], L(centPos.clone().lerp(V(-0.5, 0.6, 0.6).multiplyScalar(R * 0.8), 0.5).toArray()));
    dd("eritrocit", "Rdeča krvnička za primerjavo", "Rdeča krvnička meri 7,8 µm; ob njej vidiš, kako velika je ta bela krvnička (" + c.velikost + ").", "#d9545f", [eri], L(eri.position.clone().add(osE.clone().multiplyScalar(0.5)).add(V(0.4, 1.2, 0)).toArray()));

    // vlažen videz in relief (gostote na µm)
    const k = 6.75 / R;
    kit.poliraj(T, D, {
      citoplazma: { tex: "fino", rf: 5 * k, k: 1.1, b: 0.24, lisa: 0.22, f: 0.5 * k, ao: (p) => 0.78 + 0.22 * Math.min(1, Math.max(0, 0.5 + 0.6 * (-p.x + p.y + p.z) / (Math.hypot(p.x, p.y, p.z) * 1.732 || 1))) },
      jedro: { tex: "zrna", rf: 4 * k, k: 1.2, b: 0.2 },
      nukleoplazma: { tex: "fino", rf: 7 * k, k: 0.9, b: 0.22, lisa: 0.2, f: 1 },
      kromatin: { rf: 12, k: 0.8 },
      jedrce: { tex: "zrna", rf: 9 * k, k: 1.4, b: 0.25 },
      zrnca: { tex: "zrna", rf: 9, k: 0.8, b: 0.2 },
      "azurofilna-zrnca": { tex: "zrna", rf: 9, k: 0.8, b: 0.2 },
      lizosomi: { tex: "zrna", rf: 9, k: 0.9, b: 0.22 },
      fagosom: { tex: "gube", rf: 6, k: 0.8 },
      glikogen: { tex: null },
      mitohondrij: { tex: "zrna", rf: 18, k: 0.7, b: 0.18 },
      golgi: { tex: "fino", rf: 14, k: 0.8 },
      centrosom: { tex: null },
      ribosomi: { tex: null },
      eritrocit: { tex: "fino", rf: 9, k: 0.35, b: 0.12, sheen: 0.25 },
    });
    // stikalo »Barve kot v učbeniku« za to vrsto (po poliranju, da shrani končne barve)
    const posebne = { mikrovili: "#e8809a", citoplazma: c.citU, fagosom: "#8fd06a", vakuole: "#86d4f2", glikogen: "#d8e4f2", eritrocit: "#e0485a" };
    for (const z of c.zrnca || []) if (z.ucb) posebne[z.id] = z.ucb;
    const ucb = kit.barveUcbenika(D, posebne);
    return { T, D, s, c, ucb };
  }

  const zgrajene = {};
  let vrsta = "nevtrofilec";
  // eno stikalo za vse vrste: vsaka zgrajena vrsta ima svoje (svoje učbeniške barve citoplazme in zrnc)
  const ucbenik = {
    tip: "stikalo", id: "ucbenik", oznaka: "Barve kot v učbeniku", vrednost: false,
    ob(v) { ucbenik.vrednost = !!v; for (const k in zgrajene) zgrajene[k].ucb.ob(ucbenik.vrednost); },
  };
  function nastavi(v) {
    if (!VRSTE[v]) v = "nevtrofilec";
    vrsta = v;
    if (!zgrajene[v]) {
      const prva = !Object.keys(zgrajene).length;
      zgrajene[v] = zgradiVrsto(v);
      if (prva) ucbenik.vrednost = zgrajene[v].ucb.vrednost;
      else if (zgrajene[v].ucb.vrednost !== ucbenik.vrednost) zgrajene[v].ucb.ob(ucbenik.vrednost);
    }
    for (const k in zgrajene) zgrajene[k].T.visible = k === v;
    deli.length = 0;
    zgrajene[v].D.forEach((d) => deli.push(d));
  }
  const nadzor = [
    { tip: "izbira", id: "vrsta", oznaka: "Vrsta", moznosti: Object.keys(VRSTE).map((k) => [k, VRSTE[k].ime]), vrednost: "nevtrofilec", ob: nastavi },
    { tip: "izpis", id: "podatki", oznaka: "Velikost in delež", vrednost: () => `${VRSTE[vrsta].velikost} · ${VRSTE[vrsta].delez} belih krvničk` },
    ucbenik,
  ];
  const zac = ctx.zacetek && ctx.zacetek.vrsta;
  if (zac && VRSTE[zac]) nadzor[0].vrednost = zac;
  nastavi(nadzor[0].vrednost);

  return {
    group,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
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
