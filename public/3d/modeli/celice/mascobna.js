// Maščobna celica (adipocit bele maščobe) v prerezu: ena velika maščobna kapljica, tanek pas citoplazme in jedro kot pečatni prstan.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
// Model je zgrajen v µm (1 enota = 62 µm); drsnik spremeni velikost kapljice, zato se ploskve ob vsaki spremembi zgradijo znova.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-mascobna",
  naslov: "Maščobna celica (adipocit)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Celica bele maščobe s premerom okoli 100 µm. Skoraj vso celico zapolni ena maščobna kapljica, zato sta citoplazma in sploščeno jedro potisnjena ob membrano kot pečatni prstan. Z drsnikom spremeniš količino shranjene maščobe: kapljica in celica se povečata ali skrčita.",
  poskusi: "Premikaj drsnik »Shranjena maščoba« in opazuj, kako se celica poveča.",
  merilo: { m: 124e-6, oznaka: "124 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  const V = videzCelic(THREE, { hi, odpad });
  const { sum, fbm } = V;

  // ---------- orodja ----------
  let seme = 7;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.45, clearcoat: 0.7, clearcoatRoughness: 0.15,
      sheen: 0.4, sheenColor: new THREE.Color(barva).lerp(new THREE.Color(0xffffff), 0.45).multiplyScalar(0.8), sheenRoughness: 0.45,
    }, o));
    odpad.push(m);
    return m;
  }
  // Material mreže, ki se ob drsniku zgradi znova: relief iz kompleta (V.sencilo) namesto V.poliraj, ki obdela geometrijo le enkrat.
  const reliefMat = (barva, o, r) => V.sencilo(mat(barva, o), Object.assign({ vr: 2, rf: 1, k: 0.8, b: 0.18, s: 0.14 }, r));
  // ---------- debele membrane (debelina je povečana, da je vidna) ----------
  // Plasti na prerezu od notranje (s = 0) do zunanje strani (s = 1): [s0, s1, barva].
  const _bela = new THREE.Color(0xffffff);
  const DVOSLOJ = [[0, 0.16, new THREE.Color(0x7b5ce0)], [0.22, 0.36, new THREE.Color(0x4a33a8)], [0.42, 0.58, new THREE.Color(0xece6ff)], [0.64, 0.78, new THREE.Color(0x4a33a8)], [0.86, 1, new THREE.Color(0xdce0ff)]];
  // dvojna jedrna ovojnica: dva dvosloja z ozkim presledkom med njima
  const DVOJNA = (b, vmes) => { const c = new THREE.Color(b), g = c.clone().multiplyScalar(0.55), r = c.clone().lerp(_bela, 0.35), v = new THREE.Color(vmes); return [[0, 0.07, g], [0.12, 0.24, r], [0.29, 0.31, g], [0.38, 0.62, v], [0.69, 0.71, g], [0.76, 0.88, r], [0.93, 1, g]]; };
  function barvaPlasti(plasti, s, out) {
    for (let i = 0; i < plasti.length; i++) {
      const [a, b, c] = plasti[i];
      if (s <= b + 1e-6) return s >= a - 1e-6 || i === 0 ? out.copy(c) : out.copy(plasti[i - 1][2]).lerp(c, (s - plasti[i - 1][1]) / (a - plasti[i - 1][1]));
    }
    return out.copy(plasti[plasti.length - 1][2]);
  }
  const vrsticePlasti = (plasti) => [...new Set(plasti.flatMap(([a, b]) => [a, b]).concat([0, 1]).map((x) => Math.round(x * 1000) / 1000))].sort((a, b) => a - b);
  // Trak prereza med dvema krivuljama: A[i] (notranja) in B[i] (zunanja), normala n.
  function trakPlasti(A, B, n, plasti) {
    const S = vrsticePlasti(plasti), C = A.length, pos = [], nor = [], col = [], idx = [], c = new THREE.Color(), p = V3();
    for (let j = 0; j < S.length; j++) for (let i = 0; i < C; i++) {
      p.copy(A[i]).lerp(B[i], S[j]); pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z);
      barvaPlasti(plasti, S[j], c);
      col.push(c.r, c.g, c.b);
    }
    const m = Math.floor(C / 2), e1 = V3().subVectors(A[Math.min(C - 1, m + 1)], A[Math.max(0, m - 1)]), e2 = V3().subVectors(B[m], A[m]);
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
  // točka na ravnini prereza: ravnina 0: x = 0 (y, z > 0), 1: y = 0 (x < 0, z > 0), 2: z = 0 (x < 0, y > 0)
  const naRavnini = (rv, kot, r, p = V3()) => { const c = Math.cos(kot) * r, s = Math.sin(kot) * r; return rv === 0 ? p.set(0, c, s) : rv === 1 ? p.set(-c, 0, s) : p.set(-c, s, 0); };
  const normalaRavnine = (rv) => (rv === 0 ? V3(-1, 0, 0) : rv === 1 ? V3(0, 1, 0) : V3(0, 0, 1));
  // Prerez debele lupine na treh ravninah odrezanega osmega dela; rz(d), rn(d): zunanji in notranji polmer v smeri d.
  function prerezLupine(rz, rn, plasti, seg, zamik = 0) {
    return zdruzi([0, 1, 2].map((rv) => {
      const n = normalaRavnine(rv), A = [], Bb = [];
      for (let i = 0; i <= seg; i++) { const d = naRavnini(rv, (i / seg) * Math.PI / 2, 1); A.push(d.clone().multiplyScalar(rn(d)).addScaledVector(n, zamik)); Bb.push(d.clone().multiplyScalar(rz(d)).addScaledVector(n, zamik)); }
      return trakPlasti(A, Bb, n, plasti);
    }), true);
  }
  // Združi geometrije v eno; barve === true ohrani barve oglišč.
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], idx = [];
    let off = 0;
    geos.forEach((g) => {
      const p = g.attributes.position, n = g.attributes.normal, gc = barve ? g.attributes.color : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (gc) col.push(gc.getX(k), gc.getY(k), gc.getZ(k));
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
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka });
  }
  // Odrezan osmi del: x < 0, y > 0, z > 0 (proti gledalcu levo zgoraj).
  const vIzrezu = (v, c = { x: 0, y: 0, z: 0 }) => v.x < c.x && v.y > c.y && v.z > c.z;
  // Parametrična ploskev f(u, v, p) za u, v ∈ [0, 1]; normale iz končnih razlik.
  function normala(f, u, v, n) {
    const e = 1e-4, _a = V3(), _b = V3(), _c = V3(), _d = V3(), _t = V3();
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
    const p = V3(), n = V3();
    for (let j = 0, k = 0; j <= nv; j++) for (let i = 0; i <= nu; i++, k += 3) {
      f(i / nu, j / nv, p); normala(f, i / nu, j / nv, n);
      if (obrni) n.negate();
      pos[k] = p.x; pos[k + 1] = p.y; pos[k + 2] = p.z; nor[k] = n.x; nor[k + 1] = n.y; nor[k + 2] = n.z;
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const A = j * (nu + 1) + i, Bq = A + 1, C = A + nu + 2, D = A + nu + 1;
      if (obrni) idx.push(A, D, Bq, Bq, D, C); else idx.push(A, Bq, D, Bq, C, D);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    g.setIndex(idx);
    return g;
  }
  // Lupina z odrezanim osmim delom; f(smer) vrne polmer v tej smeri.
  function lupina(f, ws, hs) {
    ws = Math.round(ws / 4) * 4;
    const zg = new THREE.SphereGeometry(1, (ws * 3) / 4, hs / 2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const v = V3();
    for (const g of [zg, sp]) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); v.multiplyScalar(f(v)); p.setXYZ(i, v.x, v.y, v.z); }
      g.computeVertexNormals();
    }
    return zdruzi([zg, sp]);
  }
  const o = new THREE.Object3D(), GOR = V3(0, 1, 0);

  const S = 1 / 62; // enot na µm (premer enotske krogle = 124 µm)
  const RDM = 56, VC = 58 ** 3 - 56 ** 3; // največja kapljica in stalna prostornina citoplazme (v R³)
  let f = 0.8, Rd = 0, Rc = 0, T0 = 0;
  const N = V3(-0.62, 0.785, 0).normalize(), E1 = V3(0.785, 0.62, 0).normalize(), E2 = V3(0, 0, 1); // jedro leži na ravnini prereza z = 0
  const B1 = 8.5, B2 = 5; // polovični dolžini jedra v µm
  const TM = 0.9, TJO = 0.42; // debelina membrane in jedrne ovojnice v µm (povečani, da sta vidni)
  const svet = new THREE.Group(); svet.scale.setScalar(S); group.add(svet);

  const izbo = (d) => { // izboklina membrane nad jedrom
    const a = d.dot(E1) * Rc / B1, b = d.dot(E2) * Rc / B2, n = d.dot(N);
    if (n < 0.8) return 0;
    return Math.max(0, 1 - a * a - b * b) ** 0.8 * Math.max(0, T0 + TM + 0.5 - (Rc - Rd));
  };
  const oblika = (d) => Rc * (1 + 0.004 * fbm(d.x * 3 + 2, d.y * 3, d.z * 3)) + izbo(d);
  const robR = (rv, kot) => oblika(naRavnini(rv, kot, 1).normalize());
  const nadJedrom = (d) => { const a = d.dot(E1) * Rc / B1, b = d.dot(E2) * Rc / B2; return d.dot(N) > 0.8 && a * a + b * b < 1.4; };

  // ---------- materiali in mreže (zgradi jih postavi()) ----------
  const prazna = () => new THREE.BufferGeometry();
  const memMat = V.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.1, rf: 1.6, k: 0.3, rob: B.membranaRob, rk: 1.3, difuzno: 0.08 });
  const mem = new THREE.Mesh(prazna(), memMat);
  const robMat = mat(0xffffff, { vertexColors: true, roughness: 0.45, clearcoat: 0.5, side: THREE.DoubleSide });
  robMat.userData.rez = true;
  const memRob = new THREE.Mesh(prazna(), robMat);
  // maščobna kapljica: zlata, gladka in sijoča; v prerezu ravne ploskve, skozi steklo membrane njena površina
  const kapMat = reliefMat(0xffffff, { vertexColors: true, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.04, specularIntensity: 1, specularColor: new THREE.Color(0xfff2c8), ior: 1.47, sheen: 0.2, sheenColor: new THREE.Color(0xffd27a), emissive: new THREE.Color(0x3a2400), side: THREE.DoubleSide }, { vr: 2, rf: 0.12, k: 0.12, b: 0.1, s: 0.25 });
  const kapljica = new THREE.Mesh(prazna(), kapMat);
  const kapPov = new THREE.Mesh(prazna(), reliefMat("#f2a814", { roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.04, emissive: new THREE.Color(0x3a2200), sheen: 0 }, { vr: 2, rf: 0.5, k: 0.15, b: 0.1 }));
  const citMat = reliefMat(0xffffff, { vertexColors: true, roughness: 0.55, clearcoat: 0.35, sheen: 0.3, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.DoubleSide }, { vr: 2, rf: 1.4, k: 1, b: 0.22 });
  const cit = new THREE.Mesh(prazna(), citMat);
  const jMat = reliefMat(B.jedro, { roughness: 0.32, side: THREE.DoubleSide }, { vr: 0, rf: 0.9, k: 1, b: 0.2 });
  const jedro = new THREE.Mesh(prazna(), jMat);
  const jPlo = new THREE.Mesh(prazna(), reliefMat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.35, side: THREE.DoubleSide }, { vr: 0, rf: 1.6, k: 0.9, b: 0.2 }));
  // kapilara: steklena stena (endotelij) z eritrociti v svetlini
  const kapilara = new THREE.Mesh(prazna(), V.steklo(mat("#ff8a9a", { side: THREE.DoubleSide }), { a: 0.2, rf: 0.5, k: 0.8, rob: "#ffb3c2", rk: 1.2, difuzno: 0.35, dvostransko: true }));
  // kolagenska in mrežasta (retikulinska) vlakna okoli celice
  const vZacasna = V.vlakna([new THREE.LineCurve3(V3(), V3(1, 0, 0))], 1, "#dfe9ff", { sij: 0.4 }), vlaknaMat = vZacasna.material;
  vZacasna.geometry.dispose();
  const vlakna = new THREE.Mesh(prazna(), vlaknaMat);
  svet.add(mem, memRob, kapljica, kapPov, cit, jedro, jPlo, kapilara, vlakna);

  // ---------- drobni deli v pasu citoplazme in na membrani (primerki; postavi() jim le premakne lego) ----------
  const nadZun = (d) => !vIzrezu(d, { x: 0.05, y: -0.05, z: -0.05 });
  function smeri(n, pogoj = () => true) {
    const out = [];
    for (let p = 0; out.length < n && p < n * 50; p++) {
      const d = V3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
      if (d.lengthSq() > 1 || d.lengthSq() < 0.05) continue;
      d.normalize();
      if (!pogoj(d)) continue;
      out.push({ d, t: 0.25 + 0.5 * rnd(), s: 0.7 + 0.6 * rnd(), a: rnd() * 6.28, b: rnd() * 6.28 });
    }
    return out;
  }
  // v pasu citoplazme: brez dela nad jedrom, ob ravninah prereza pa gostejši (tam jih vidiš v prerezu)
  const vPasu = (d) => nadZun(d) && !nadJedrom(d);
  const obRavnini = (d) => vPasu(d) && Math.min(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z)) < 0.12 && (d.x < 0.12 && d.y > -0.12 && d.z > -0.12);
  const mitL = [...smeri(hi ? 70 : 34, vPasu), ...smeri(hi ? 26 : 14, obRavnini)];
  const kapL = [...smeri(hi ? 80 : 40, vPasu), ...smeri(hi ? 26 : 14, obRavnini)];
  const erL = [...smeri(hi ? 90 : 40, vPasu), ...smeri(hi ? 30 : 14, obRavnini)];
  const kavL = smeri(hi ? 700 : 200, nadZun);
  const belL = smeri(hi ? 500 : 140, nadZun);
  const mitG = (() => { const L = 0.9, r = 0.35, pr = []; for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (i / 12) * Math.PI; pr.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); } return new THREE.LatheGeometry(pr, q(12)); })();
  const mit = new THREE.InstancedMesh(mitG, mat(B.mitohondrij, { roughness: 0.34 }), mitL.length);
  const kapM = new THREE.InstancedMesh(new THREE.SphereGeometry(1, q(14), q(10)), mat(B.mascoba, { roughness: 0.14, clearcoat: 1, emissive: new THREE.Color(0x2a1a00) }), kapL.length);
  const erM = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.22, 1.6, 2, q(7)), mat(B.ger, { roughness: 0.3 }), erL.length);
  const kavM = new THREE.InstancedMesh(new THREE.TorusGeometry(0.28, 0.1, hi ? 4 : 3, q(10)).rotateX(Math.PI / 2), mat("#ff7fc0", { roughness: 0.35 }), kavL.length);
  const belM = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.32, hi ? 1 : 0), mat(B.beljakovine, { roughness: 0.35 }), belL.length);
  // eritrociti v kapilari (dvojno vbočene ploščice) in jedra endotelijskih celic na njeni steni
  const erPr = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10, r = 3 * Math.sin((t * Math.PI) / 2); erPr.push(new THREE.Vector2(r, 0.95 * (0.35 + 1.1 * (r / 3) ** 2 - 0.9 * (r / 3) ** 4) * Math.cos((t * Math.PI) / 2) ** 0.4)); }
  const erGeo = (() => { const g = new THREE.LatheGeometry([...erPr.slice().reverse().map((v) => new THREE.Vector2(v.x, -v.y)), ...erPr.slice(1)], q(16)); g.computeVertexNormals(); return g; })();
  const nEr = hi ? 16 : 10, nEnd = 6;
  const eritrociti = new THREE.InstancedMesh(erGeo, mat(B.hemoglobin, { roughness: 0.36 }), nEr);
  const endo = new THREE.InstancedMesh(new THREE.SphereGeometry(1, q(14), q(10)), mat(B.jedro, { roughness: 0.32 }), nEnd);
  // drobna zrnca (glikogen, beljakovine) v pasu citoplazme
  const zrnL = smeri(hi ? 1800 : 600, vPasu);
  const zrn = V.pike(zrnL.map(() => [0, 0, 0]), 0x9c8ae8, 0.4 * S, 0.5); // velikost točk je v enotah scene (merilo skupine ne velja)
  svet.add(mit, kapM, erM, kavM, belM, eritrociti, endo, zrn);

  // Barve oglišč kapljice: v sredini svetlo zlata, proti robu temneje jantarna z rahlimi progami; ob citoplazmi senca.
  const kS = new THREE.Color(0xffd23c), kR = new THREE.Color(0xe08608), kT = new THREE.Color(0x6e3604), _c = new THREE.Color();
  function barvajKapljico(g, rv) {
    const p = g.attributes.position, a = new Float32Array(p.count * 3), v = V3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i); const r = v.length() / Rd;
      const proga = fbm(v.x * 0.05 + rv * 3, v.y * 0.05 + fbm(v.z * 0.04, v.x * 0.04, 1) * 1.5, v.z * 0.05 + 9);
      _c.copy(kS).lerp(kR, THREE.MathUtils.clamp(r ** 2 * 0.8 + proga * 0.32, 0, 1));
      if (r > 0.9) _c.lerp(kT, ((r - 0.9) / 0.1) ** 1.5 * 0.55);
      const os = Math.min(...[v.x, v.y, v.z].map((x, k) => (k === rv ? 1e9 : Math.abs(x)))); // razdalja do roba, kjer se ploskvi stikata
      _c.lerp(kT, Math.max(0, 1 - os / 10) ** 2 * 0.5 * Math.min(1, r * 4));
      _c.multiplyScalar(0.75 + 0.25 * THREE.MathUtils.smoothstep(r, 0.05, 0.6));
      a.set([_c.r, _c.g, _c.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  }
  const cS = new THREE.Color(0x5a48b8), cT = new THREE.Color(0x2c2458), cZ = new THREE.Color(0x7d68dc);
  function barvajCit(g) {
    const p = g.attributes.position, a = new Float32Array(p.count * 3), v = V3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i); const r = v.length(), t = THREE.MathUtils.clamp((r - Rd) / Math.max(0.5, Rc - Rd), 0, 1);
      const zr = sum(v.x * 0.9, v.y * 0.9, v.z * 0.9);
      _c.copy(cS).lerp(cZ, THREE.MathUtils.clamp(zr * 0.6 + 0.3, 0, 1)).lerp(cT, (1 - Math.sin(Math.PI * t)) * 0.5);
      a.set([_c.r, _c.g, _c.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  }
  // Primerek na krogli: smer d, polmer r, os primerka po tangenti (kot a) ali po normali (pokonci).
  function postaviNa(im, L, rF, sk, pokonci = false) {
    L.forEach((x, i) => {
      o.position.copy(x.d).multiplyScalar(rF(x));
      if (pokonci) { o.quaternion.setFromUnitVectors(GOR, x.d); o.rotateY(x.a); }
      else { const t = V3(0, 1, 0).cross(x.d).normalize().applyAxisAngle(x.d, x.a); o.quaternion.setFromUnitVectors(GOR, t); o.rotateY(x.b); }
      o.scale.setScalar(1);
      sk(o.scale, x);
      o.updateMatrix(); im.setMatrixAt(i, o.matrix);
    });
    im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); im.computeBoundingBox();
  }

  function postavi() {
    Rd = RDM * Math.cbrt(f);
    Rc = Math.cbrt(Rd ** 3 + VC);
    T0 = Math.min(3.2, (Rc - Rd) * 1.6 + 1.4); // debelina jedra: sploščeno, a debelejše od pasu citoplazme
    // membrana: steklo, v prerezu debel dvosloj
    mem.geometry.dispose(); mem.geometry = lupina(oblika, q(150), q(90));
    memRob.geometry.dispose(); memRob.geometry = prerezLupine((d) => oblika(d) * 0.999, (d) => oblika(d) - TM, DVOSLOJ, q(120), 0.03);
    // ploskve prereza: kapljica (do Rd) in pas citoplazme (od Rd do membrane); površina kapljice (vidna skozi membrano)
    const kg = [], cg = [];
    const H = Math.min(3.5, Rd * 0.065); // rahla izboklina ploskve kapljice (kot gladka gladina olja), ujame odsev luči
    for (let rv = 0; rv < 3; rv++) {
      const nr = normalaRavnine(rv);
      kg.push(barvajKapljico(ploskev((u, v, p) => naRavnini(rv, u * Math.PI / 2, v * (Rd - 0.03), p).addScaledVector(nr, H * Math.sin(Math.PI * u) * 4 * v * (1 - v)), q(64), q(28)), rv));
      cg.push(barvajCit(ploskev((u, v, p) => { const k = u * Math.PI / 2, r1 = robR(rv, k) - TM; return naRavnini(rv, k, Rd + (r1 - Rd) * v, p); }, q(120), 6)));
    }
    kapljica.geometry.dispose(); kapljica.geometry = zdruzi(kg, true);
    cit.geometry.dispose(); cit.geometry = zdruzi(cg, true);
    kapPov.geometry.dispose(); kapPov.geometry = lupina(() => Rd, q(110), q(64));
    // jedro: sploščena leča med kapljico in membrano, prerezana na z = 0
    const Rin = Rd + 0.12;
    const debel = (a, b) => T0 * Math.max(0, 1 - a * a - b * b) ** 0.55;
    const smerJ = (a, b) => N.clone().addScaledVector(E1, (a * B1) / Rc).addScaledVector(E2, (b * B2) / Rc).normalize();
    const zun = (u, v, p) => { const a = -1 + 2 * u, wv = Math.sqrt(Math.max(0, 1 - a * a)), b = -wv * v; return p.copy(smerJ(a, b)).multiplyScalar(Rin + debel(a, b)); };
    const not = (u, v, p) => { const a = -1 + 2 * u, wv = Math.sqrt(Math.max(0, 1 - a * a)), b = -wv * v; return p.copy(smerJ(a, b)).multiplyScalar(Rin); };
    jedro.geometry.dispose(); jedro.geometry = zdruzi([ploskev(zun, q(48), q(14)), ploskev(not, q(48), q(10), true)]);
    const pre = ploskev((u, v, p) => { const a = -1 + 2 * u; return p.copy(smerJ(a, 0)).multiplyScalar(Rin + debel(a, 0) * v).setZ(0.09); }, q(96), q(24));
    { const p = pre.attributes.position, c = new Float32Array(p.count * 3), A = new THREE.Color(0xc48bff), Bc = new THREE.Color(0x4a1aa8), t = new THREE.Color();
      const ovoj = DVOJNA(0x6b36d6, 0xe8d6ff), nu = q(96) + 1;
      for (let i = 0; i < p.count; i++) {
        t.copy(A).lerp(Bc, THREE.MathUtils.clamp(sum(p.getX(i) * 1.2, p.getY(i) * 1.2, 3) * 0.9 + 0.35, 0, 0.9));
        // jedrna ovojnica: dve membrani ob robu prereza, vmes pore
        const iu = i % nu, iv = Math.floor(i / nu), uu = iu / (nu - 1), vv = iv / q(24), a = -1 + 2 * uu, D = debel(a, 0);
        const rob = Math.min(vv * D, (1 - vv) * D, Math.abs(a) > 0.97 ? 0 : 99);
        const pora = Math.abs(((uu * 9) % 1) - 0.5) < 0.05;
        if (rob < TJO && !pora) barvaPlasti(ovoj, 1 - rob / TJO, t);
        c.set([t.r, t.g, t.b], i * 3);
      }
      pre.setAttribute("color", new THREE.BufferAttribute(c, 3)); }
    jPlo.geometry.dispose(); jPlo.geometry = pre;
    // drobni deli v pasu citoplazme (polmer med kapljico in membrano) in na membrani
    const vPas = (x, d = 0) => { const r1 = oblika(x.d) - TM; return Rd + (r1 - Rd) * x.t + d; };
    const deb = Math.max(0.3, Math.min(1, (Rc - Rd - TM) / 1.4));
    postaviNa(mit, mitL, vPas, (s, x) => s.setScalar(deb * x.s));
    postaviNa(kapM, kapL, vPas, (s, x) => s.setScalar(deb * x.s * 0.55));
    postaviNa(erM, erL, vPas, (s, x) => s.set(1, x.s, 1).multiplyScalar(deb));
    postaviNa(kavM, kavL, (x) => oblika(x.d) + 0.04, (s, x) => s.set(x.s, x.s, 1), true);
    postaviNa(belM, belL, (x) => oblika(x.d) + 0.15, (s, x) => s.set(1, 1.5, 1).multiplyScalar(x.s), true);
    { const p = zrn.geometry.attributes.position; zrnL.forEach((x, i) => { const r = vPas(x); p.setXYZ(i, x.d.x * r, x.d.y * r, x.d.z * r); }); p.needsUpdate = true; zrn.geometry.computeBoundingSphere(); }
    // kapilara, ki se vije ob celici (zadaj desno), z eritrociti in jedri endotelijskih celic
    seme = 91; // enaka naključna razporeditev pri vsaki velikosti
    const pts = [];
    for (let i = 0; i <= 24; i++) { const t = i / 24, a = -1.5 + 2.2 * t, d = V3(Math.cos(a) * 0.9, Math.sin(a) * 0.9, 0.42 + 0.06 * Math.sin(t * 7)).normalize(); pts.push(d.multiplyScalar(Rc + 4.0)); }
    const kriv = new THREE.CatmullRomCurve3(pts);
    kapilara.geometry.dispose(); kapilara.geometry = new THREE.TubeGeometry(kriv, q(120), 3.6, q(18), false);
    const P = V3(), T = V3();
    for (let i = 0; i < nEr; i++) {
      const u = 0.03 + (0.94 * (i + 0.5 * rnd())) / nEr;
      kriv.getPointAt(Math.min(0.98, u), P); kriv.getTangentAt(Math.min(0.98, u), T);
      o.position.copy(P); o.quaternion.setFromUnitVectors(GOR, T.clone().add(V3(Math.sin(i * 2.3), Math.cos(i * 1.7), Math.sin(i)).multiplyScalar(0.35)).normalize());
      o.scale.setScalar(0.92); o.updateMatrix(); eritrociti.setMatrixAt(i, o.matrix);
    }
    eritrociti.instanceMatrix.needsUpdate = true; eritrociti.computeBoundingSphere(); eritrociti.computeBoundingBox();
    for (let i = 0; i < nEnd; i++) {
      const u = (i + 0.5) / nEnd;
      kriv.getPointAt(u, P); kriv.getTangentAt(u, T);
      const st = V3(0, 0, 1).cross(T).normalize().applyAxisAngle(T, i * 2.1);
      o.position.copy(P).addScaledVector(st, 3.6); o.quaternion.setFromUnitVectors(GOR, T); o.scale.set(1.1, 3.4, 1.1); o.updateMatrix(); endo.setMatrixAt(i, o.matrix);
    }
    endo.instanceMatrix.needsUpdate = true; endo.computeBoundingSphere(); endo.computeBoundingBox();
    // vlakna: tanka mrežasta vlakna tik ob membrani in debelejši snopi kolagena malo dlje
    const tubes = [];
    const lok = (r0, n, sir, deb, nSeg) => {
      for (let k = 0; k < n; k++) {
        let d = V3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize(), t = V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).cross(d).normalize();
        const tp = [];
        for (let j = 0; j <= 8; j++) {
          const dd = d.clone().applyAxisAngle(t, (j - 4) * sir / 8).add(V3(Math.sin(j * 1.9 + k), Math.cos(j * 1.3 + k), Math.sin(j * 0.7 - k)).multiplyScalar(0.012)).normalize();
          tp.push(dd);
        }
        if (tp.some((x) => vIzrezu(x, { x: 0.06, y: -0.06, z: -0.06 }))) continue;
        tubes.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tp.map((x) => x.clone().multiplyScalar(oblika(x) + r0))), nSeg, deb, hi ? 5 : 3, false));
      }
    };
    lok(0.55, hi ? 240 : 80, 0.8, 0.15, hi ? 22 : 10);
    lok(1.5, hi ? 22 : 10, 1.1, 0.4, hi ? 36 : 18);
    vlakna.geometry.dispose(); vlakna.geometry = V.zdruzi(tubes);
  }
  postavi();

  const W = (p) => p.clone().multiplyScalar(S).toArray();
  const naSmer = (x, y, z, r) => { const d = V3(x, y, z).normalize(); return W(d.multiplyScalar(r(d))); };
  function postaviDele() {
    deli.length = 0;
    const sm = V3(0.45, 0.25, 0.86).normalize();
    const mi = mitL.find((x) => ob(x.d)) || mitL[0], ka = kapL.find((x) => ob(x.d)) || kapL[0], er = erL.find((x) => ob(x.d)) || erL[0];
    const pas = (x) => x.d.clone().multiplyScalar(Rd + (oblika(x.d) - TM - Rd) * x.t);
    del("membrana", "Celična membrana", "Tanka ovojnica celice iz dveh plasti fosfolipidov z beljakovinami; ob jedru je navzven nekoliko izbočena. Debelina membrane je povečana.", "#9fb4ff", [mem, memRob, belM], W(sm.multiplyScalar(oblika(sm) * 1.005)));
    del("kaveole", "Kaveole", "Drobne vdolbinice v membrani; maščobna celica jih ima zelo veliko. Pomagajo pri sprejemu maščobnih kislin in pri odzivu na inzulin.", "#ff7fc0", [kavM], naSmer(0.62, -0.3, 0.72, (d) => oblika(d) + 0.1));
    del("kapljica", "Maščobna kapljica", "Ena velika kapljica maščob (trigliceridov), ki zapolni skoraj vso celico; je zaloga energije in toplotna izolacija telesa.", "#f3d36b", [kapljica, kapPov], W(naRavnini(1, 0.75, Rd * 0.55)));
    del("citoplazma", "Citoplazma", "Le tanek pas citoplazme ob membrani, ker kapljica zavzame skoraj ves prostor.", "#5b4bb0", [cit], W(naRavnini(0, 0.55, (Rd + robR(0, 0.55)) / 2)));
    del("jedro", "Jedro", "Sploščeno jedro z dvojno ovojnico in porami, ki ga kapljica potisne ob rob celice; v prerezu je celica videti kot pečatni prstan.", B.jedro, [jedro, jPlo], W(N.clone().multiplyScalar(Rd + T0 * 0.5).setZ(0.2)));
    del("mitohondrij", "Mitohondriji", "Maloštevilni mitohondriji v tankem pasu citoplazme; pri razgradnji maščob dajejo energijo.", B.mitohondrij, [mit], W(pas(mi)));
    del("drobne-kapljice", "Drobne maščobne kapljice", "Majhne kapljice maščob v citoplazmi; ko celica kopiči maščobo, se zlivajo z veliko kapljico.", "#ffd84a", [kapM], W(pas(ka)));
    del("gladki-er", "Gladki endoplazemski retikulum", "Cevke v pasu citoplazme, v katerih nastajajo maščobe (trigliceridi), ki se nato shranijo v kapljico.", B.ger, [erM], W(pas(er)));
    del("kapilara", "Kapilara", "Tanka žila iz endotelijskih celic; po krvi pridejo maščobe v celico in odidejo iz nje, ko telo potrebuje energijo.", "#ff8a9a", [kapilara, endo], W(V3(Math.cos(-0.6) * 0.9, Math.sin(-0.6) * 0.9, 0.42 + 0.06 * Math.sin((0.9 / 2.2) * 7)).normalize().multiplyScalar(Rc + 7.6)));
    del("eritrociti", "Rdeče krvničke", "Krvne celice v kapilari; prinašajo kisik, ki ga celica potrebuje pri razgradnji maščob.", B.hemoglobin, [eritrociti], (() => { const m = new THREE.Matrix4(), p = V3(); eritrociti.getMatrixAt(Math.floor(nEr / 2), m); return W(p.setFromMatrixPosition(m)); })());
    del("vlakna", "Kolagenska in mrežasta vlakna", "Vlakna medceličnine, ki maščobne celice povezujejo v tkivo in jih držijo na mestu.", "#dfe9ff", [vlakna], naSmer(0.5, 0.6, 0.62, (d) => oblika(d) + 0.6));
  }
  const ob = (d) => d.x < 0.12 && d.y > -0.12 && d.z > -0.12 && Math.min(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z)) < 0.12;
  postaviDele();
  const fmt = (x) => String(Math.round(x));
  const nadzor = [
    { tip: "drsnik", id: "mascoba", oznaka: "Shranjena maščoba", min: 10, max: 100, korak: 1, vrednost: 80,
      ob: (v) => { f = THREE.MathUtils.clamp(v, 10, 100) / 100; postavi(); postaviDele(); const u = nadzor.find((c) => c.id === "ucbenik"); if (u?.vrednost) u.ob(true); } },
    { tip: "izpis", id: "mere", oznaka: "Velikost", vrednost: () => `celica ${fmt(2 * Rc)} µm · kapljica ${fmt(2 * Rd)} µm (${fmt((Rd ** 3 / Rc ** 3) * 100)} % prostornine)` },
  ];
  const zac = ctx.zacetek && Number(ctx.zacetek.mascoba);
  if (zac >= 10 && zac <= 100) { nadzor[0].vrednost = zac; nadzor[0].ob(zac); }

  // rahle razlike v svetlosti med ponovljenimi deli
  {
    const c = new THREE.Color();
    for (const m of [mit, kapM, erM, kavM, belM, eritrociti, endo]) for (let i = 0; i < m.count; i++) { const k = 0.86 + 0.24 * V.hash(i * 1.37, m.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
  }
  V.poliraj(group, deli, {
    mitohondrij: { tex: "gube", rf: 3, k: 0.8 },
    "drobne-kapljice": { tex: "fino", rf: 2, k: 0.3, rough: 0.14, cc: 1, ccr: 0.04 },
    "gladki-er": { tex: "fino", rf: 4, k: 0.6 },
    kaveole: { tex: null },
    membrana: { tex: "zrna", rf: 4, k: 0.6 },
    eritrociti: { tex: "fino", rf: 1.4, k: 0.6, rough: 0.34 },
    kapilara: { tex: "zrna", rf: 1.5, k: 0.8 },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(deli, {
    kapljica: "#f6e27a", "drobne-kapljice": "#f8ec9a", kaveole: "#c8607a", kapilara: "#d9535f", eritrociti: "#c8202c", vlakna: "#e6d8b8",
  }));

  return {
    group,
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
    deli,
    nadzor,
    oder: "celica",
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
