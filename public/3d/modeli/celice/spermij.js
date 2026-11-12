// Semenčica (spermij): povečana glava z vratom in srednjim delom v prerezu (privzeto) in cela celica z bičem, ki valovi.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-spermij",
  naslov: "Semenčica (spermij)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Moška spolna celica, dolga okoli 60 µm: glava z akrosomom in jedrom, vrat s centriolama, srednji del z vijačnico mitohondrijev in dolg bič. Povečan pogled pokaže notranjost glave in zgradbo biča 9 + 2; mikrotubuli so narisani debelejši kot v resnici.",
  poskusi: "Izberi »Cela semenčica« in primerjaj dolžino glave z dolžino biča.",
  merilo: { m: 12e-6, oznaka: "12 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const odpad = [];
  const V = videzCelic(THREE, { hi, odpad });
  const { sum } = V;

  // ---------- orodja ----------
  let seme = 7;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3,
      sheen: 0.5, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
    }, o));
    odpad.push(m);
    return m;
  }
  const steklo = (o = {}) => V.steklo(mat(B.membrana, { side: THREE.FrontSide }), Object.assign({ a: 0.14, rf: 60, k: 0.9, rob: B.membranaRob, rk: 1.3 }, o));
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
  function del(id, ime, opis, barva, meshes, tocka, seznam) {
    meshes.forEach((m) => { m.userData.del = id; });
    seznam.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const osX = (g) => g.rotateZ(-Math.PI / 2);
  // Odstrani trikotnike, katerih težišče izpolni pogoj.
  function odrezi(g, pogoj) {
    const p = g.attributes.position, ix = g.index.array, ost = [], a = V3(0, 0, 0), b = V3(0, 0, 0), c = V3(0, 0, 0);
    for (let i = 0; i < ix.length; i += 3) {
      a.fromBufferAttribute(p, ix[i]); b.fromBufferAttribute(p, ix[i + 1]); c.fromBufferAttribute(p, ix[i + 2]);
      a.add(b).add(c).multiplyScalar(1 / 3);
      if (!pogoj(a)) ost.push(ix[i], ix[i + 1], ix[i + 2]);
    }
    g.setIndex(ost);
    return g;
  }
  // Parametrična ploskev f(u, v, P) na mreži nU × nV; zaprtoV = v teče okoli (brez šiva); rezF(u, v) → [x, y] za aRez.
  function ploskev(nU, nV, f, zaprtoV, rezF) {
    const pos = [], rez = [], idx = [], P = V3(0, 0, 0), wV = zaprtoV ? nV : nV + 1;
    for (let i = 0; i <= nU; i++) for (let j = 0; j < wV; j++) {
      f(i / nU, j / nV, P);
      pos.push(P.x, P.y, P.z);
      if (rezF) rez.push(...rezF(i / nU, j / nV));
    }
    for (let i = 0; i < nU; i++) for (let j = 0; j < nV; j++) {
      const a = i * wV + j, b = i * wV + ((j + 1) % wV), c = a + wV, d = b + wV;
      idx.push(a, c, b, b, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    if (rezF) g.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Vrtenina okoli osi y iz profila [[y, r], …]; odprta = brez četrtine x < 0 … (po osX: y > 0, z > 0).
  function vrtenina(prof, n) {
    const pts = prof.map(([y, r]) => new THREE.Vector2(Math.max(r, 1e-4), y));
    return {
      odprta: new THREE.LatheGeometry(pts, Math.round(n * 0.75), 0, Math.PI * 1.5),
      pokrov: new THREE.LatheGeometry(pts, Math.max(3, Math.round(n * 0.25)), Math.PI * 1.5, Math.PI * 0.5),
    };
  }
  // Ploskev prereza plasti vrtenine (kota 0 in 1,5π) med r in rNot(y, r); pasovi [[t0, t1, barva], …] od zunaj navznoter.
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
  // Lupina z odrezano četrtino y > 0, z > 0 (po vsej dolžini); f(smer) vrne polmer v tej smeri.
  function lupinaK(f, ws, hs) {
    const zg = new THREE.SphereGeometry(1, ws / 2, hs / 2, Math.PI, Math.PI, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const pokr = new THREE.SphereGeometry(1, ws / 2, hs / 2, 0, Math.PI, 0, Math.PI / 2);
    const v = V3(0, 0, 0);
    for (const g of [zg, sp, pokr]) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); v.multiplyScalar(f(v)); p.setXYZ(i, v.x, v.y, v.z); }
      g.computeVertexNormals();
    }
    return { odprta: zdruzi([zg, sp]), pokrov: pokr };
  }
  const lokiK = [(t) => V3(Math.cos(t), Math.sin(t), 0), (t) => V3(Math.cos(t), 0, Math.sin(t))];
  // Ploskvi prereza lupine (ravnini z = 0, y > 0 in y = 0, z > 0) med fZ in fN: pasovi z barvami oglišč.
  function prerezK(fZ, fN, seg, pasovi) {
    const pos = [], col = [], idx = [], c = new THREE.Color();
    for (const L of lokiK) for (const [t0, t1, barva] of pasovi) {
      c.set(barva);
      const off = pos.length / 3;
      for (let i = 0; i <= seg; i++) {
        const d = L((i / seg) * Math.PI).normalize(), rz = fZ(d), rn = fN(d);
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
  // Isti ploskvi kot prerezK, a z aRez = (dolžina vzdolž roba, globina 0 zunaj … 1 znotraj) za senčilnik prereza.
  function rezK(fZ, fN, seg, nD) {
    const pos = [], rez = [], idx = [], P = V3(0, 0, 0), prej = V3(0, 0, 0);
    for (const L of lokiK) {
      const off = pos.length / 3;
      let s = 0;
      for (let i = 0; i <= seg; i++) {
        const d = L((i / seg) * Math.PI).normalize(), rz = fZ(d), rn = fN(d);
        P.copy(d).multiplyScalar(rz);
        if (i) s += P.distanceTo(prej);
        prej.copy(P);
        for (let j = 0; j <= nD; j++) { const t = j / nD, rr = rz + (rn - rz) * t; pos.push(d.x * rr, d.y * rr, d.z * rr); rez.push(s, t); }
      }
      for (let i = 0; i < seg; i++) for (let j = 0; j < nD; j++) { const a = off + i * (nD + 1) + j, b = a + nD + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Material ploskve prereza: vzorec v senčilniku (koda GLSL nastavi bv = barva sRGB in zh = višina reliefa) iz
  // R = aRez in P = položaj v koordinatah mreže. Brez dodatnih trikotnikov; komplet ga ne prebarva (userData.rez).
  function rezMat(koda, kljuc) {
    const m = mat(0xffffff, { roughness: 0.58, clearcoat: 0.3, clearcoatRoughness: 0.3, sheen: 0.3, sheenColor: new THREE.Color(0xe6dcff), side: THREE.DoubleSide });
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
      m.customProgramCacheKey = () => "spermij-rez-" + kljuc;
      m.clone = function () { const c = new this.constructor().copy(this); dodaj(c); return c; };
    };
    dodaj(m);
    return m;
  }
  // Votla cev (mikrotubul) vzdolž x od x0 do x1 s središčem (y, z): zunanji in notranji plašč, obročasta konca.
  function mikrotubul(x0, x1, y, z, r, n) {
    const ri = r * 0.55;
    const g = new THREE.LatheGeometry([new THREE.Vector2(ri, x0), new THREE.Vector2(r, x0), new THREE.Vector2(r, x1), new THREE.Vector2(ri, x1), new THREE.Vector2(ri, x0)], n);
    return osX(g).translate(0, y, z);
  }
  // Oblika glave: sploščen oval s topim zadnjim delom, proti konici tanjši (af, ar: pol dolžine spredaj in zadaj,
  // b: pol širine, c: pol debeline); vrne polmer v smeri d.
  const glavaF = (af, ar, b, c) => (d) => {
    const g = (r) => {
      const x = r * d.x, a = x > 0 ? af : ar, pe = x > 0 ? 2 : 3;
      const cc = c * (1 - 0.4 * Math.max(0, x / af)) * (1 + 0.1 * Math.max(0, -x / ar));
      return Math.pow(Math.abs(x) / a, pe) + (r * d.y / b) ** 2 + (r * d.z / cc) ** 2 - 1;
    };
    let lo = 0, hi2 = Math.max(af, ar, b, c) * 1.5;
    for (let i = 0; i < 24; i++) { const m = (lo + hi2) / 2; if (g(m) > 0) hi2 = m; else lo = m; }
    return (lo + hi2) / 2;
  };
  // Akrosom: kapica nad jedrom fJ, debelina (do k · fJ) se proti zadnjemu robu (x = xr) zvezno stanjša na nič.
  const akroF = (fJ, k, xr, w) => (d) => {
    const r = fJ(d), x = d.x * r, t = Math.min(1, Math.max(0, (x - xr) / w));
    return r * (1 + k * t * t * (3 - 2 * t));
  };
  const deformiraj = (g, f) => {
    const p = g.attributes.position, v = V3(0, 0, 0);
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); v.multiplyScalar(f(v)); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  };

  // vzorci ploskev prereza (GLSL)
  const KODA_JEDRO = `
    float d = zvS(P * 48.0) * 0.5 + zvS(P * 120.0 + 3.0) * 0.3 + zvS(P * 300.0 + 7.0) * 0.2;
    bv = mix(vec3(0.3, 0.1, 0.6), vec3(0.5, 0.26, 0.86), smoothstep(0.25, 0.85, d));
    float vak = smoothstep(0.84, 0.87, zvS(P * 17.0 + 9.0));
    bv = mix(bv, vec3(0.7, 0.56, 0.98), vak * 0.75);
    float ov = 1.0 - smoothstep(0.0, 0.05, R.y);
    bv = mix(bv, mix(vec3(0.16, 0.05, 0.42), vec3(0.75, 0.6, 1.0), smoothstep(0.012, 0.03, R.y)), ov);
    zh = d * 0.003 - vak * 0.004;`;
  const KODA_AKROSOM = `
    float d = zvS(P * 90.0) * 0.6 + zvS(P * 260.0 + 5.0) * 0.4;
    bv = mix(vec3(0.03, 0.5, 0.52), vec3(0.32, 0.92, 0.84), smoothstep(0.3, 0.8, d));
    float e = min(R.y, 1.0 - R.y), mb = 1.0 - smoothstep(0.06, 0.16, e);
    bv = mix(bv, vec3(0.02, 0.3, 0.36), mb * 0.85);
    zh = d * 0.002;`;
  const KODA_MITO = `
    float aa = max(fwidth(R.x), 1e-5), y = R.y, e = min(y, 1.0 - y), reach0 = -1.0;
    if (R.y < 0.0) { e = (1.0 + R.y) * 0.5; y = 0.5; reach0 = 0.5; }
    float g = zvS(P * 420.0);
    bv = vec3(0.86, 0.5, 0.1) * (0.85 + 0.25 * g);
    bv = mix(bv, vec3(0.5, 0.23, 0.04), 1.0 - smoothstep(0.05, 0.08, e));
    bv = mix(bv, vec3(1.0, 0.88, 0.6), smoothstep(0.07, 0.09, e) * (1.0 - smoothstep(0.12, 0.14, e)));
    float cw = 0.0085, ci = floor(R.x / cw), xl = (fract(R.x / cw) - 0.5) * cw;
    float reach = reach0 > 0.0 ? reach0 : (mod(ci, 2.0) < 0.5 ? y : 1.0 - y);
    float cr = smoothstep(0.0013 + aa, 0.0013 - aa, abs(xl)) * step(0.1, reach) * (1.0 - smoothstep(0.7, 0.76, reach));
    bv = mix(bv, vec3(1.0, 0.86, 0.48), cr);
    zh = cr * 0.0012 + g * 0.0004;`;
  const KODA_CIT = `
    float d = zvS(P * 160.0) * 0.6 + zvS(P * 420.0 + 2.0) * 0.4;
    bv = mix(vec3(0.17, 0.12, 0.38), vec3(0.32, 0.24, 0.62), d);
    zh = d * 0.0015;`;
  const DVOSLOJ = [[0, 0.14, 0xd8dcff], [0.14, 0.36, 0x4a33a8], [0.36, 0.64, 0xece6ff], [0.64, 0.86, 0x4a33a8], [0.86, 1, 0x7b5ce0]];
  const robMat = () => { const m = mat(0xffffff, { vertexColors: true, roughness: 0.45, clearcoat: 0.5, side: THREE.DoubleSide }); m.userData.rez = true; return m; };
  const nad = (dd) => (t) => ({ p: t.p.addScaledVector(t.n, dd), n: t.n });

  // barve delov (paleta B, kjer jo celica ima; drugje izbrane za jasen kontrast)
  const C_AKR = "#20c9b6", C_ODF = "#cf4f8c", C_PLASC = "#5b8cff", C_ANUL = "#38d08e", C_DIN = B.beljakovine, C_CIT = "#3d3180";

  // =====================================================================
  // POGLED 1: CELA SEMENČICA (1 enota = 30 µm)
  // =====================================================================
  const G1 = new THREE.Group();
  group.add(G1);
  const deli1 = [];
  const a1 = 0.068, HC1 = V3(0.98 - 0.094, 0, 0);
  const f1 = glavaF(0.094, a1, 0.05, 0.026), f1J = (d) => f1(d) * 0.84;
  const gl1 = deformiraj(new THREE.SphereGeometry(1, q(48), q(32)), f1).translate(HC1.x, 0, 0);
  const memGl1 = new THREE.Mesh(gl1, steklo({ a: 0.12, rf: 320 }));
  const jed1 = new THREE.Mesh(deformiraj(new THREE.SphereGeometry(1, q(40), q(28)), f1J).translate(HC1.x, 0, 0), mat(B.jedro, { roughness: 0.32 }));
  const akr1G = deformiraj(new THREE.SphereGeometry(1, q(48), q(32)), akroF(f1J, 0.1, -a1 * 0.2, a1 * 0.35));
  const akr1 = new THREE.Mesh(odrezi(akr1G, (c) => c.x < -a1 * 0.2).translate(HC1.x, 0, 0), mat(C_AKR, { roughness: 0.28 }));
  const XV0 = HC1.x - a1 + 0.004; // zadnji rob glave
  const vrat1 = new THREE.Mesh(osX(new THREE.CylinderGeometry(0.0062, 0.0075, 0.02, q(12))).translate(XV0 - 0.006, 0, 0), mat(B.centrosom, { roughness: 0.3, emissive: new THREE.Color(B.centrosom).multiplyScalar(0.25) }));
  const XS0 = XV0 - 0.017, XS1 = XS0 - 0.167; // srednji del
  const ovoj1 = new THREE.Mesh(zdruzi([
    osX(new THREE.CylinderGeometry(0.0128, 0.0128, XS0 - XS1, q(18), 6, true)).translate((XS0 + XS1) / 2, 0, 0),
    osX(new THREE.CylinderGeometry(0.0145, 0.0128, 0.02, q(18), 2, true)).translate(XS0 + 0.01, 0, 0),
  ]), steklo({ a: 0.12, rf: 400 }));
  const sredG = [];
  { const n = 13, m = n * 16, pts = []; for (let i = 0; i <= m; i++) { const t = i / m, a = t * n * Math.PI * 2; pts.push(V3(XS0 - t * (XS0 - XS1), Math.cos(a) * 0.0084, Math.sin(a) * 0.0084)); } sredG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(m), 0.0034, q(7), false)); }
  const sred1 = new THREE.Mesh(zdruzi(sredG), mat(B.mitohondrij, { roughness: 0.32 }));
  const jedro1 = new THREE.Mesh(osX(new THREE.CylinderGeometry(0.0044, 0.0044, XS0 - XS1 + 0.01, q(8), 1)).translate((XS0 + XS1) / 2, 0, 0), mat(C_ODF, { roughness: 0.35 }));
  // bič: dve cevi (steklena membrana in sijoča os), ki ju vsak korak preračunamo (potujoč val)
  const XR0 = XS1 + 0.002, XR1 = -0.975, nS = q(200), nR = q(12);
  const rRep = (s) => (s < 0.9 ? 0.0112 - 0.005 * (s / 0.9) : 0.0062 * (1 - (s - 0.9) / 0.1 * 0.5));
  const rOs = (s) => rRep(s) * (s < 0.92 ? 0.46 : 0.6);
  function cevGeo() {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array((nS + 1) * nR * 3 + 6), 3));
    const idx = [];
    for (let i = 0; i < nS; i++) for (let j = 0; j < nR; j++) { const a = i * nR + j, b = i * nR + ((j + 1) % nR), c = a + nR, d = b + nR; idx.push(a, b, c, b, d, c); }
    const kon = (nS + 1) * nR;
    for (let j = 0; j < nR; j++) { idx.push(kon + 1, nS * nR + j, nS * nR + ((j + 1) % nR)); idx.push(kon, (j + 1) % nR, j); }
    g.setIndex(idx);
    return g;
  }
  const repGeo = cevGeo(), osGeo = cevGeo();
  const repM = new THREE.Mesh(repGeo, steklo({ a: 0.16, rf: 500, rk: 1.5 }));
  const osM = new THREE.Mesh(osGeo, mat(B.citoskelet, { roughness: 0.3, emissive: new THREE.Color(B.citoskelet).multiplyScalar(0.3) }));
  const LAMBDA = 0.95, AMAX = 0.1;
  const sredina = [];
  function napolni(geo, c, rF) {
    const p = geo.attributes.position, T = V3(0, 0, 0), N = V3(0, 0, 0);
    for (let i = 0; i <= nS; i++) {
      T.copy(c[Math.min(nS, i + 1)]).sub(c[Math.max(0, i - 1)]).normalize();
      N.set(-T.y, T.x, 0);
      const r = rF(i / nS);
      for (let j = 0; j < nR; j++) {
        const a = (j / nR) * Math.PI * 2;
        p.setXYZ(i * nR + j, c[i].x + r * Math.cos(a) * N.x, c[i].y + r * Math.cos(a) * N.y, r * Math.sin(a));
      }
    }
    const kon = (nS + 1) * nR;
    p.setXYZ(kon, c[0].x + 0.001, c[0].y, 0);
    p.setXYZ(kon + 1, c[nS].x - T.x * 0.003, c[nS].y - T.y * 0.003, 0);
    p.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
  }
  function postaviRep(t) {
    const c = [];
    for (let i = 0; i <= nS; i++) {
      const s = i / nS, x = XR0 + (XR1 - XR0) * s, A = AMAX * Math.pow(s, 1.25);
      c.push(V3(x, A * Math.sin((2 * Math.PI * s * (XR0 - XR1)) / LAMBDA - t * Math.PI * 2 * 2.2), 0));
    }
    napolni(repGeo, c, rRep);
    napolni(osGeo, c, rOs);
    sredina.length = 0; sredina.push(...c);
  }
  postaviRep(0);
  G1.add(jed1, akr1, memGl1, vrat1, sred1, jedro1, ovoj1, osM, repM);
  del("membrana", "Celična membrana", "Tanka prožna ovojnica, ki obdaja vso semenčico od glave do konca biča; skoznjo vidiš jedro, akrosom in mitohondrije.", "#9fb4ff", [memGl1, ovoj1], [HC1.x + 0.02, 0.045, 0.01], deli1);
  del("akrosom", "Akrosom", "Kapica na sprednjem delu glave z encimi, ki semenčici pomagajo prebiti ovojnico jajčne celice.", C_AKR, [akr1], [HC1.x + 0.05, 0.02, 0.012], deli1);
  del("jedro", "Jedro (v glavi)", "Zelo zgoščeno jedro s polovičnim številom kromosomov (23); to je očetov delež dednega zapisa.", B.jedro, [jed1], [HC1.x - 0.03, 0.01, 0.018], deli1);
  del("vrat", "Vrat s centriolama", "Kratek vrat povezuje glavo in bič; v njem sta dve centrioli, iz ene izrašča bič.", B.centrosom, [vrat1], [XV0 - 0.006, 0.008, 0.004], deli1);
  del("srednji-del", "Srednji del z mitohondriji", "Mitohondriji so zviti v vijačnico okoli začetka biča in dajejo energijo (ATP) za plavanje.", B.mitohondrij, [sred1, jedro1], [(XS0 + XS1) / 2, 0.012, 0.004], deli1);
  del("rep", "Rep (bič)", "Dolg bič, ki z valovanjem poganja semenčico naprej; v njem je aksonema iz mikrotubulov (9 + 2).", B.bicek, [repM, osM], [-0.3, 0, 0.01], deli1);

  // =====================================================================
  // POGLED 2: GLAVA, VRAT IN SREDNJI DEL V PREREZU (1 enota = 6 µm)
  // =====================================================================
  const G2 = new THREE.Group();
  group.add(G2);
  const deli2 = [];
  const a2 = 0.34, HC2 = V3(0.98 - 0.47, 0, 0);
  const fM = glavaF(0.47, a2, 0.25, 0.125), fMN = (d) => fM(d) * 0.94, fJ = (d) => fM(d) * 0.84;
  const XR = -0.1 * a2; // zadnji rob akrosoma (koordinate glave)
  const fAk = akroF(fJ, 0.1, XR, 0.16);
  const zadaj = (c) => c.x < XR - 0.004;
  // celična membrana glave: steklo, v prerezu debel dvosloj
  const mg = lupinaK(fM, q(96), q(64));
  const memMatG = steklo({ a: 0.13, rf: 60 });
  const memG = new THREE.Mesh(mg.odprta.translate(HC2.x, 0, 0), memMatG);
  const memGP = new THREE.Mesh(mg.pokrov.translate(HC2.x, 0, 0), memMatG);
  const rMat = robMat();
  const memGR = new THREE.Mesh(prerezK(fM, fMN, q(72), DVOSLOJ).translate(HC2.x, 0, 0), rMat);
  // akrosom: kapica na sprednjih ~ 60 % jedra (zunanja ploskev in polni ploskvi prereza)
  const ak = lupinaK(fAk, q(96), q(64));
  const akMat = mat(C_AKR, { roughness: 0.28 });
  const akM = new THREE.Mesh(odrezi(ak.odprta, zadaj).translate(HC2.x, 0, 0), akMat);
  const akP = new THREE.Mesh(odrezi(ak.pokrov, zadaj).translate(HC2.x, 0, 0), akMat);
  const akR = new THREE.Mesh(odrezi(rezK(fAk, fJ, q(96), 3), zadaj).translate(HC2.x, 0, 0), rezMat(KODA_AKROSOM, "akr"));
  // jedro: zunanja ploskev in polni ploskvi prereza z zgoščenim kromatinom
  const jg = lupinaK(fJ, q(80), q(56));
  const jMat = mat(B.jedro, { roughness: 0.32 });
  const jM = new THREE.Mesh(jg.odprta.translate(HC2.x, 0, 0), jMat);
  const jP = new THREE.Mesh(jg.pokrov.translate(HC2.x, 0, 0), jMat);
  const jR = new THREE.Mesh(rezK(fJ, () => 0, q(72), 6).translate(HC2.x, 0, 0), rezMat(KODA_JEDRO, "jedro"));
  G2.add(jM, jP, jR, akM, akP, akR, memG, memGP, memGR);

  // vrat, srednji del in začetek glavnega dela biča: membrana kot vrtenina okoli osi x
  const XG = HC2.x - a2 * 0.97; // zadnji rob glave
  const XN = XG - 0.1, XA = -0.66, XK = -0.97; // konec vratu, obroček (anulus), prerezan konec
  const rB = (x) => {
    let r = x < XA - 0.02 ? 0.07 : x < XA + 0.02 ? 0.07 + 0.018 * (x - XA + 0.02) / 0.04 : 0.088;
    if (x > XN) r = 0.088 + 0.012 * Math.pow((x - XN) / (XG + 0.01 - XN), 2);
    return r * (1 + 0.012 * sum(x * 20, 1, 2));
  };
  const profB = [];
  for (let i = 0; i <= 90; i++) { const x = XK + ((XG + 0.01 - XK) * i) / 90; profB.push([x, rB(x)]); }
  const vb = vrtenina(profB, q(56));
  const memMatB = steklo({ a: 0.14, rf: 110 });
  const memB = new THREE.Mesh(osX(vb.odprta), memMatB), memBP = new THREE.Mesh(osX(vb.pokrov), memMatB);
  const memBR = new THREE.Mesh(osX(prerezVrtenine(profB, (y, r) => r * 0.9, DVOSLOJ)), rMat);
  const vbIn = vrtenina(profB.map(([x, r]) => [x, r * 0.9]), q(44));
  vbIn.pokrov.dispose();
  const citM = new THREE.Mesh(osX(vbIn.odprta), mat(C_CIT, { roughness: 0.62, clearcoat: 0.25, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide }));
  // prerezan konec biča: citoplazma, iz katere štrlijo vlakna in mikrotubuli
  const konG = new THREE.CircleGeometry(rB(XK) * 0.9, q(28)).rotateY(-Math.PI / 2).translate(XK + 0.006, 0, 0);
  konG.setAttribute("aRez", new THREE.Float32BufferAttribute(new Float32Array(konG.attributes.position.count * 2), 2));
  const konec = new THREE.Mesh(konG, rezMat(KODA_CIT, "cit"));
  G2.add(memB, memBP, memBR, citM, konec);
  // beljakovine v membrani (receptorji, kanalčki)
  const beljG = V.beljakovine([...V.posej(memG, hi ? 420 : 110), ...V.posej(memB, hi ? 300 : 80)].map(nad(0.002)), B.beljakovine, 0.0046, { visina: 1.5 });
  const beljGP = V.beljakovine([...V.posej(memGP, hi ? 170 : 40), ...V.posej(memBP, hi ? 120 : 30)].map(nad(0.002)), B.beljakovine, 0.0046, { visina: 1.5 });
  G2.add(beljG, beljGP);

  // ---------- aksonema 9 + 2: dvojčki mikrotubulov, osrednji par, radialni žarki in dineinske ročice ----------
  const RA = 0.026, XC0 = XN + 0.005, XC1 = XN + 0.055; // distalna centriola (bazalno telesce)
  const kot = (i) => (i / 9) * Math.PI * 2; // dvojček 1 zgoraj (+y), 3 in 8 ob +z in -z
  const axG = [];
  for (let i = 0; i < 9; i++) {
    const a = kot(i);
    axG.push(mikrotubul(XK - 0.004, XC0, Math.cos(a) * RA, Math.sin(a) * RA, 0.0046, q(10)));
    axG.push(mikrotubul(XK - 0.004, XC0, Math.cos(a + 0.2) * (RA + 0.0025), Math.sin(a + 0.2) * (RA + 0.0025), 0.0041, q(10)));
  }
  for (const s of [-1, 1]) axG.push(mikrotubul(XK - 0.004, XN - 0.01, 0, s * 0.0068, 0.0042, q(10)));
  const aks = new THREE.Mesh(zdruzi(axG), mat(B.citoskelet, { roughness: 0.3, side: THREE.DoubleSide, emissive: new THREE.Color(B.citoskelet).multiplyScalar(0.28) }));
  const dX = hi ? 0.024 : 0.048, nPol = Math.floor((XC0 - XK) / dX);
  const zarG = new THREE.CylinderGeometry(0.0015, 0.0015, 0.011, q(6), 1, true);
  const zarki = new THREE.InstancedMesh(zarG, mat(0xfff0a8, { roughness: 0.35, emissive: new THREE.Color(0xffd84a).multiplyScalar(0.2) }), nPol * 9);
  const rocG = new THREE.IcosahedronGeometry(0.0026, hi ? 1 : 0).scale(1, 1.7, 1);
  const dinein = new THREE.InstancedMesh(rocG, mat(C_DIN, { roughness: 0.35 }), nPol * 18);
  {
    const o = new THREE.Object3D();
    let kz = 0, kd = 0;
    for (let n = 0; n < nPol; n++) {
      const x = XK + 0.008 + n * dX;
      for (let i = 0; i < 9; i++) {
        const a = kot(i), r = V3(0, Math.cos(a), Math.sin(a)), tg = V3(0, -Math.sin(a), Math.cos(a));
        o.position.set(x, 0, 0).addScaledVector(r, RA - 0.0095);
        o.quaternion.setFromUnitVectors(V3(0, 1, 0), r);
        o.scale.setScalar(1);
        o.updateMatrix(); zarki.setMatrixAt(kz++, o.matrix);
        for (const [dr, dt] of [[0.0042, 0.0078], [-0.0006, 0.0082]]) {
          o.position.set(x + (dr > 0 ? 0 : 0.006), 0, 0).addScaledVector(r, RA + dr).addScaledVector(tg, dt);
          o.quaternion.setFromUnitVectors(V3(0, 1, 0), tg.clone().addScaledVector(r, dr > 0 ? 0.6 : -0.6).normalize());
          o.scale.setScalar(0.85 + 0.3 * rnd());
          o.updateMatrix(); dinein.setMatrixAt(kd++, o.matrix);
        }
      }
    }
  }
  // centrioli v vratu: bližnja prečno, oddaljena (bazalno telesce) v osi biča; trojčki mikrotubulov
  const cent = [];
  const centriola = (os, c, L, rr0) => {
    for (let i = 0; i < 9; i++) for (let t = 0; t < 3; t++) {
      const a = (i / 9) * Math.PI * 2 + t * 0.13, rr = rr0 - t * 0.0042;
      const g = new THREE.CylinderGeometry(0.0033, 0.0033, L, q(6));
      g.translate(Math.cos(a) * rr, 0, Math.sin(a) * rr);
      if (os === "x") g.rotateZ(-Math.PI / 2); else g.rotateX(Math.PI / 2);
      cent.push(g.translate(c.x, c.y, c.z));
    }
  };
  centriola("z", V3(XG - 0.018, 0.004, 0), 0.05, 0.026);
  centriola("x", V3((XC0 + XC1) / 2, 0, 0), XC1 - XC0, 0.03);
  const centM = new THREE.Mesh(zdruzi(cent), mat(B.centrosom, { roughness: 0.3, emissive: new THREE.Color(B.centrosom).multiplyScalar(0.2) }));
  // vezni del: bazalna ploščica pod jedrom in devet progastih stebričkov, ki se nadaljujejo v zunanja gosta vlakna
  const vezG = [new THREE.CylinderGeometry(0.06, 0.054, 0.009, q(28)).rotateZ(Math.PI / 2).translate(XG + 0.016, 0, 0)];
  const RO = 0.041, XO0 = XN + 0.02;
  for (let i = 0; i < 9; i++) {
    const a = kot(i) + 0.1;
    for (let s = 0; s < 5; s++) {
      const x0 = XO0 + s * 0.017, L = 0.0125;
      vezG.push(osX(new THREE.CylinderGeometry(0.0072, 0.0072, L, q(8))).translate(x0 + L / 2 + 0.002, Math.cos(a) * RO * (1 - s * 0.03), Math.sin(a) * RO * (1 - s * 0.03)));
    }
  }
  const vezni = new THREE.Mesh(zdruzi(vezG), mat(C_ODF, { roughness: 0.34 }));
  // zunanja gosta vlakna: 9 v srednjem delu; 3. in 8. se končata ob obročku, nadomestita ju stebra vlaknatega plašča
  const vel = [1.2, 1, 0.85, 0.9, 1.15, 1.15, 0.9, 0.85, 1];
  const odfG = [];
  for (let i = 0; i < 9; i++) {
    const a = kot(i) + 0.1, r = 0.0078 * vel[i], konX = i === 2 || i === 7 ? XA + 0.01 : XK - 0.003;
    const g = osX(new THREE.CylinderGeometry(r, r * (konX < XA ? 0.72 : 0.9), XO0 - konX, q(9), 6));
    odfG.push(g.translate((XO0 + konX) / 2, Math.cos(a) * RO, Math.sin(a) * RO));
  }
  const odf = new THREE.Mesh(zdruzi(odfG), mat(C_ODF, { roughness: 0.34 }));
  // vlaknati plašč glavnega dela: rebra (brez četrtine prereza) in dva vzdolžna stebra ob 3. in 8. dvojčku
  const plG = [], plCela = [];
  for (let x = XK + 0.012; x < XA - 0.024; x += 0.021) {
    plG.push(new THREE.TorusGeometry(0.056, 0.0048, q(6), q(22), Math.PI * 1.5).rotateY(Math.PI / 2).rotateX(Math.PI).translate(x, 0, 0));
    plCela.push(new THREE.TorusGeometry(0.056, 0.0048, q(6), q(8), Math.PI * 0.5).rotateY(Math.PI / 2).rotateX(Math.PI / 2).translate(x, 0, 0));
  }
  for (const i of [2, 7]) { const a = kot(i) + 0.1; plG.push(osX(new THREE.CylinderGeometry(0.0092, 0.0092, XA - 0.02 - XK, q(8), 4)).translate((XA - 0.02 + XK) / 2, Math.cos(a) * 0.052, Math.sin(a) * 0.052)); }
  const plasc = new THREE.Mesh(zdruzi(plG), mat(C_PLASC, { roughness: 0.34 }));
  const plascC = new THREE.Mesh(zdruzi(plCela), plasc.material);
  // obroček (anulus) med srednjim in glavnim delom
  const anulus = new THREE.Mesh(new THREE.TorusGeometry(0.071, 0.0085, q(10), q(36)).rotateY(Math.PI / 2).translate(XA, 0, 0), mat(C_ANUL, { roughness: 0.3 }));
  G2.add(aks, zarki, dinein, centM, vezni, odf, plasc, plascC, anulus);

  // ---------- mitohondrijski plašč: zaporedni mitohondriji v vijačnici, na ravninah prereza prerezani (kriste) ----------
  const Rh = 0.0635, HA = 0.0235, HR = 0.0118, NG = 13, MX0 = XA + 0.018, MX1 = XN - 0.004;
  const korakX = (MX1 - MX0) / (2 * Math.PI * NG);
  const tH = (a, C, Rad, W) => {
    C.set(MX0 + a * korakX, Rh * Math.cos(a), Rh * Math.sin(a));
    Rad.set(0, Math.cos(a), Math.sin(a));
    const T = V3(korakX, -Rh * Math.sin(a), Rh * Math.cos(a)).normalize();
    W.crossVectors(T, Rad).normalize();
    if (W.x < 0) W.negate();
  };
  const Cc = V3(0, 0, 0), Rd = V3(0, 0, 0), Ww = V3(0, 0, 0);
  const mitoCel = [], mitoZun = [], mitoRez = [];
  const nU = q(26), nP = q(14);
  // mitohondrij k sega od (k − 0,25)π do (k + 0,75)π; sodi prečkajo četrtino prereza (0 … π/2). Ob vratu (zadnji štirje
  // zavoji) jih ravnini z = 0 in y = 0 prerežeta (prečni prerez s kristami, pogled na vlakna), drugje je vijačnica cela.
  const uA = (0.25 - 0.035) / 0.93, uB = (0.75 - 0.035) / 0.93;
  for (let k = 0; k < 2 * NG; k++) {
    const ojac = 1 + 0.08 * Math.sin(k * 2.3), tau = (u) => Math.pow(Math.max(0, Math.sin(Math.PI * u)), 0.42) * ojac;
    const kotU = (u) => (k - 0.25 + 0.035 + 0.93 * u) * Math.PI; // vmes kratka reža med zaporednima mitohondrijema
    const tocka = (u, fi, P) => { tH(kotU(u), Cc, Rd, Ww); const t = tau(u); P.copy(Cc).addScaledVector(Rd, HR * t * Math.cos(fi)).addScaledVector(Ww, HA * t * Math.sin(fi)); };
    const kos = (u0, u1, n) => ploskev(n, nP, (u, v, P) => tocka(u0 + u * (u1 - u0), v * 2 * Math.PI, P), true);
    if (k % 2 || k < 2 * NG - 8) { mitoCel.push(kos(0, 1, nU)); continue; }
    mitoCel.push(kos(0, uA, Math.round(nU / 4)), kos(uB, 1, Math.round(nU / 4)));
    mitoZun.push(kos(uA, uB, Math.round(nU / 2)));
    for (const uu of [uA, uB]) mitoRez.push(ploskev(5, nP, (u, v, P) => { tocka(uu, v * 2 * Math.PI, P); P.lerp(Cc, 1 - u); }, true,
      (u, v) => [k * 0.31 + HA * tau(uu) * u * Math.sin(v * 2 * Math.PI), -u - 0.001]));
  }
  const mitoMat = mat(B.mitohondrij, { roughness: 0.34, side: THREE.DoubleSide });
  const mito = new THREE.Mesh(zdruzi(mitoCel), mitoMat);
  const mitoZ = new THREE.Mesh(zdruzi(mitoZun), mitoMat);
  const mitoR = new THREE.Mesh(zdruzi(mitoRez), rezMat(KODA_MITO, "mito"));
  G2.add(mito, mitoZ, mitoR);

  const naB = (x, a, f = 1.02) => [x, Math.cos(a) * rB(x) * f, Math.sin(a) * rB(x) * f];
  del("membrana", "Celična membrana", "Dvosloj fosfolipidov z beljakovinami, ki ovija vso semenčico; na glavi se ob oploditvi zlije z membrano jajčne celice. Debelina je povečana.", "#9fb4ff", [memG, memGP, memGR, memB, memBP, memBR, beljG, beljGP], naB(-0.3, -0.9), deli2);
  del("akrosom", "Akrosom", "Kapica z encimi na sprednjih dveh tretjinah jedra; ob stiku z jajčno celico encime sprosti in prebavi pot skozi njeno ovojnico.", C_AKR, [akM, akP, akR], [HC2.x + 0.2, 0.08, 0.05], deli2);
  del("jedro", "Jedro", "Zelo zgoščeno jedro s 23 kromosomi; DNK je tesno stisnjena (v prerezu temna, s svetlimi jedrnimi vakuolami), da je glava čim manjša.", B.jedro, [jM, jP, jR], [HC2.x - 0.06, 0.06, 0.03], deli2);
  del("centriola", "Vrat s centriolama", "V vratu sta dve centrioli iz trojčkov mikrotubulov; oddaljena je bazalno telesce, iz katerega raste bič, bližnjo semenčica prinese v jajčno celico.", B.centrosom, [centM], [XG - 0.018, 0.03, 0.03], deli2);
  del("vezni-del", "Vezni del", "Bazalna ploščica in devet progastih stebričkov v vratu; bič trdno pripnejo na glavo in se nadaljujejo v zunanja gosta vlakna.", C_ODF, [vezni], [XO0 + 0.04, Math.cos(0.1) * RO, Math.sin(0.1) * RO], deli2);
  del("mitohondriji", "Mitohondriji srednjega dela", "Okoli 13 zavojev mitohondrijev v vijačnici; v prerezu se vidijo kriste. S celičnim dihanjem dajejo ATP za gibanje biča.", B.mitohondrij, [mito, mitoZ, mitoR], [-0.3, 0.035, 0.055], deli2);
  del("citoplazma", "Citoplazma", "Tanka plast citoplazme pod membrano; semenčica ima je zelo malo, zato je lahka in hitra.", "#5b4bb0", [citM, konec], [XK + 0.006, -0.04, -0.03], deli2);
  del("aksonema", "Aksonema 9 + 2", "Os biča: devet parov mikrotubulov v krogu in dva v sredini, povezani z radialnimi žarki; z drsenjem drug ob drugem upogibajo bič.", B.citoskelet, [aks, zarki], [XK - 0.004, Math.cos(0.4) * RA, Math.sin(0.4) * RA], deli2);
  del("dinein", "Dineinske ročice", "Motorne beljakovine na mikrotubulih; z energijo ATP potiskajo sosednji par mikrotubulov, zato se bič upogne.", C_DIN, [dinein], [XK + 0.01, Math.cos(0.7) * RA, Math.sin(0.7) * RA], deli2);
  del("oporna-vlakna", "Zunanja gosta vlakna", "Devet debelih beljakovinskih vlaken ob aksonemi; bič utrdijo, da se pri močnem valovanju ne zlomi.", C_ODF, [odf], [-0.5, Math.cos(0.5) * RO, Math.sin(0.5) * RO], deli2);
  del("vlaknati-plasc", "Vlaknati plašč", "Rebrasti obroči z dvema vzdolžnima stebroma okoli glavnega dela biča; določajo, v kateri ravnini bič valovi.", C_PLASC, [plasc, plascC], [-0.8, -0.04, -0.04], deli2);
  del("anulus", "Obroček (anulus)", "Gost obroček na meji med srednjim in glavnim delom biča; mitohondrijem prepreči, da bi zdrsnili naprej po biču.", C_ANUL, [anulus], [XA, 0.05, 0.05], deli2);

  // Oba pogleda rahlo nagnemo (glava desno zgoraj), da podolgovata celica bolje zapolni zaslon.
  G1.rotation.z = 0.3; G2.rotation.z = 0.36;
  G1.updateMatrix(); G2.updateMatrix();
  const vSkupino = (G, t) => V3(...t).applyMatrix4(G.matrix).toArray().map((x) => Math.round(x * 1000) / 1000);
  for (const d of deli1) d.tocka = vSkupino(G1, d.tocka);
  for (const d of deli2) d.tocka = vSkupino(G2, d.tocka);
  G1.visible = false; G2.visible = true;

  // ---------- nadzor ----------
  let pogled = "glava";
  const cela = [memGP, akP, jP, memBP, beljGP, mitoZ, plascC], rezi = [akR, memGR, memBR, jR, mitoR];
  const nadzor = [
    {
      tip: "izbira", id: "pogled", oznaka: "Pogled", moznosti: [["glava", "Glava in vrat (povečano)"], ["celota", "Cela semenčica"]], vrednost: "glava",
      ob: (v) => { pogled = v === "glava" ? "glava" : "celota"; G1.visible = pogled === "celota"; G2.visible = !G1.visible; },
    },
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz (povečano)", moznosti: [["prerez", "Prerez"], ["cela", "Cela"]], vrednost: "prerez",
      ob: (v) => { const c = v === "cela"; for (const m of cela) m.visible = c; for (const m of rezi) m.visible = !c; },
    },
  ];
  nadzor[1].ob("prerez");
  const z = ctx.zacetek || {};
  for (const n of nadzor) if (z[n.id] !== undefined) { n.vrednost = z[n.id]; n.ob(z[n.id]); }

  // ---------- videz ----------
  const vsiDeli = [...deli1, ...deli2];
  V.poliraj(group, vsiDeli, {
    akrosom: { tex: "zrna", rf: 70, k: 0.9, b: 0.2, lisa: 0.08, f: 10 },
    jedro: { tex: "zrna", rf: 60, k: 1.1, b: 0.22, lisa: 0.12, f: 12 },
    citoplazma: { tex: "fino", rf: 160, k: 1, b: 0.24, lisa: 0.2, f: 20 },
    mitohondriji: { tex: "gube", rf: 160, k: 0.9, b: 0.2 },
    "srednji-del": { tex: "gube", rf: 900, k: 0.8 },
    vrat: { tex: null },
    centriola: { tex: null },
    aksonema: { tex: null },
    dinein: { tex: "zrna", rf: 900, k: 0.6 },
    "vezni-del": { tex: "vlakna", rf: 260, k: 0.8 },
    "oporna-vlakna": { tex: "vlakna", rf: 220, k: 0.9, b: 0.2 },
    "vlaknati-plasc": { tex: "zrna", rf: 300, k: 0.7 },
    anulus: { tex: "zrna", rf: 300, k: 0.7 },
    rep: { tex: null },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(vsiDeli, {
    akrosom: "#7fd36a", vrat: "#28b8dc", centriola: "#28b8dc", "srednji-del": "#ea5f3a", rep: "#c9a46a", "vezni-del": "#e2b36c",
    aksonema: "#2f6fd0", dinein: "#f29ac2", "oporna-vlakna": "#e2b36c", "vlaknati-plasc": "#c9a46a", anulus: "#5e40bd",
  }));

  return {
    group,
    get deli() { return pogled === "glava" ? deli2 : deli1; },
    nadzor,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81],
    get merilo() { return pogled === "glava" ? info.merilo : { m: 60e-6, oznaka: "60 µm" }; },
    korak(t) {
      if (!gib || pogled !== "celota") return;
      postaviRep(t);
      const rep = deli1.find((d) => d.id === "rep");
      const c = sredina[Math.round(sredina.length * 0.6)];
      if (rep && c) rep.tocka = vSkupino(G1, [c.x, c.y, 0.01]);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
