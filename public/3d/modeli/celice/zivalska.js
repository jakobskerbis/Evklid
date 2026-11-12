// Živalska celica v prerezu: odrezan osmi del pokaže notranjost (jedro, organeli, citoskelet).
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-zivalska",
  naslov: "Živalska celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Evkariontska celica brez celične stene in kloroplastov. Odrezan del pokaže jedro in organele; organelov je zaradi preglednosti manj kot v resnici.",
  poskusi: "Tapni jedro in mitohondrij ter preberi, kaj delata, nato izberi »Cela celica«.",
  merilo: { m: 20e-6, oznaka: "20 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  const V = videzCelic(THREE, { hi, odpad });
  const ZV_GLSL = V.GLSL;

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
      const c = barve ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (c) col.push(c.r, c.g, c.b);
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

  // Lupina z odrezanim osmim delom; f(smer) vrne polmer v tej smeri.
  function lupina(f, ws, hs) {
    ws = Math.round(ws / 4) * 4; // enako število oglišč na ekvatorju: brez razpoke
    const zg = new THREE.SphereGeometry(1, (ws * 3) / 4, hs / 2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const pokr = new THREE.SphereGeometry(1, ws / 4, hs / 2, 0, Math.PI / 2, 0, Math.PI / 2);
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
    return { odprta: zgladi(zdruzi([zg, sp])), pokrov: pokr };
  }
  // Povpreči normale v ogliščih z enakim položajem (šiv med deli lupine brez vidnega roba v senčenju).
  function zgladi(g) {
    const p = g.attributes.position, n = g.attributes.normal, sk = new Map();
    for (let i = 0; i < p.count; i++) {
      const kl = Math.round(p.getX(i) * 1e4) + "," + Math.round(p.getY(i) * 1e4) + "," + Math.round(p.getZ(i) * 1e4);
      (sk.get(kl) || sk.set(kl, []).get(kl)).push(i);
    }
    const v = new THREE.Vector3();
    for (const ix of sk.values()) {
      if (ix.length < 2) continue;
      v.set(0, 0, 0);
      for (const i of ix) v.x += n.getX(i), v.y += n.getY(i), v.z += n.getZ(i);
      v.normalize();
      for (const i of ix) n.setXYZ(i, v.x, v.y, v.z);
    }
    return g;
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

  // Ali točka zastira pogled na jedro iz privzete smeri kamere (organeli naj ne prekrijejo jedra in jedrca).
  const POG = new THREE.Vector3(-0.47, 0.34, 0.81).normalize();
  // najbolj vidna točka seznama: v odprtem osmem delu in čim bližje kameri
  const vidna = (tt) => tt.reduce((a, p) => ((vIzrezu(p) ? 1 : 0) + p.dot(POG) > (vIzrezu(a) ? 1 : 0) + a.dot(POG) ? p : a), tt[0]);
  const zastira = (p, C, r) => { const w = p.clone().sub(C), t = w.dot(POG); return t > 0 && w.addScaledVector(POG, -t).length() < r; };
  const predJedrom = (p, f) => zastira(p, J, RJ * f);

  // ---------- celična membrana in citoplazma ----------
  const R = 0.97;
  const oblika = (d) => R * (1 + 0.035 * fbm(d.x * 1.6 + 3, d.y * 1.6, d.z * 1.6) - 0.02);
  const mem = lupina(oblika, q(104), q(56));
  const memMat = V.steklo(mat(0x8e98e0, { side: THREE.FrontSide }), { a: 0.12, rf: 19, rob: "#8c9cff", rk: 1.35 });
  const memOut = new THREE.Mesh(mem.odprta, memMat);
  const citMat = mat(0x3d3180, { roughness: 0.62, clearcoat: 0.25, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide });
  const DM = 0.93; // notranja ploskev membrane (debelina ≈ 7 % polmera, močno povečano)
  const citIn = new THREE.Mesh(lupina((d) => oblika(d) * DM, q(84), q(48)).odprta, citMat);
  const memRob = new THREE.Mesh(prerezDvosloj(oblika, (d) => oblika(d) * DM, q(120)), dvoslojMat(R * (1 - DM)));
  const pokrov = new THREE.Mesh(mem.pokrov, memMat);
  pokrov.visible = false;
  group.add(memOut, citIn, memRob, pokrov);
  // beljakovine in sladkorni ovoj (glikokaliks) na zunanji strani membrane: vijolične kepice, nekatere v gručah
  const nad = (t) => ({ p: t.p.addScaledVector(t.n, 0.006), n: t.n });
  const beljM = V.beljakovine(V.posej(memOut, hi ? 900 : 260).map(nad), B.beljakovine, 0.013, { visina: 1.6 });
  const beljP = V.beljakovine(V.posej(pokrov, hi ? 300 : 90).map(nad), B.beljakovine, 0.013, { visina: 1.6 });
  beljP.visible = false;
  group.add(beljM, beljP);
  del("membrana", "Celična membrana", "Prožna meja celice iz dveh plasti fosfolipidov (v prerezu temni glavi in svetli repi); odloča, katere snovi vstopijo in izstopijo. Debelina membrane je povečana.", "#9fb4ff", [memOut, memRob, pokrov, beljM, beljP], [0.25, -0.3, 0.88]);
  del("citoplazma", "Citoplazma", "Želatinasta tekočina, ki napolnjuje celico; v njej plavajo organeli in poteka veliko kemijskih reakcij.", "#5b4bb0", [citIn], [0.44, -0.661, -0.493]);

  // ---------- jedro ----------
  const RJ = 0.36, J = new THREE.Vector3(0.04, 0.0, -0.04);
  const oblJ = (d) => RJ * (1 + 0.04 * sum(d.x * 2 + 9, d.y * 2, d.z * 2));
  const jl = lupina(oblJ, q(80), q(48));
  const jMat = mat(B.jedro, { roughness: 0.3 });
  const jOut = new THREE.Mesh(jl.odprta, jMat);
  const nukMat = mat(0xa565f0, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide });
  const DJ = 0.9; // dvojna jedrna ovojnica: zunanja membrana, presledek, notranja membrana (povečano)
  const jIn = new THREE.Mesh(lupina((d) => oblJ(d) * DJ, q(60), q(36)).odprta, nukMat);
  // vsaka od obeh membran je dvosloj (temni glavi, svetli repi), vmes svetel perinuklearni prostor
  const jRob = new THREE.Mesh(prerezPlasti(oblJ, (d) => oblJ(d) * DJ, q(64), [[0, 0.04, 0x34107a], [0.04, 0.11, 0x6a2fd0], [0.11, 0.2, 0xc39af5], [0.2, 0.3, 0x6a2fd0],
    [0.3, 0.7, 0xe8d6ff], [0.7, 0.8, 0x6a2fd0], [0.8, 0.89, 0xc39af5], [0.89, 0.96, 0x6a2fd0], [0.96, 1, 0x34107a]]),
    mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  const jPokrov = new THREE.Mesh(jl.pokrov, jMat);
  jPokrov.visible = false;
  for (const m of [jOut, jIn, jRob, jPokrov]) m.position.copy(J);
  group.add(jOut, jIn, jRob, jPokrov);
  // jedrne pore: obročki na jedrni ovojnici
  const nPor = hi ? 100 : 60;
  const pore = new THREE.InstancedMesh(new THREE.TorusGeometry(0.016, 0.0065, 4, q(8)), mat(B.ovojnica, { roughness: 0.4 }), nPor);
  const o = new THREE.Object3D(), smer = new THREE.Vector3();
  let k = 0;
  while (k < nPor) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (smer.lengthSq() > 1 || smer.lengthSq() < 0.05) continue;
    smer.normalize();
    if (vIzrezu(smer)) continue;
    o.position.copy(smer).multiplyScalar(oblJ(smer) * 1.004).add(J);
    o.lookAt(o.position.clone().add(smer));
    o.updateMatrix();
    pore.setMatrixAt(k++, o.matrix);
  }
  group.add(pore);
  del("jedro", "Jedro", "Največji organel; v njem je DNK z navodili za delovanje in delitev celice.", B.jedro, [jOut, jPokrov], [-0.183, 0.29, -0.04]);
  del("jedrna-ovojnica", "Jedrna ovojnica in pore", "Dvojna membrana okoli jedra (v prerezu dve temni plasti s presledkom); skozi jedrne pore potujejo snovi med jedrom in citoplazmo.", B.ovojnica, [pore, jRob], [J.x + 0.1, J.y + 0.2, J.z + 0.32]);
  del("nukleoplazma", "Nukleoplazma", "Tekočina v notranjosti jedra, v kateri sta kromatin in jedrce.", "#a565f0", [jIn], [0.177, -0.201, -0.263]);

  // kromatin: zvite niti DNK in beljakovin v jedru
  const kromGeo = [];
  for (let i = 0; i < (hi ? 16 : 9); i++) {
    const pts = [];
    let p = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(RJ * 1.1);
    for (let s = 0; s < 9; s++) {
      p = p.clone().add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.11));
      if (p.length() > RJ * 0.82) p.multiplyScalar(0.7);
      pts.push(p);
    }
    kromGeo.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(32), 0.0085, q(5), false));
  }
  const krom = new THREE.Mesh(zdruzi(kromGeo), mat(B.kromatin, { roughness: 0.5, clearcoat: 0.5 }));
  krom.position.copy(J);
  group.add(krom);
  del("kromatin", "Kromatin", "Dolge niti DNK, navite na beljakovine; pred delitvijo celice se zgostijo v kromosome.", B.kromatin, [krom], [J.x - 0.1, J.y + 0.15, J.z + 0.2]);

  // jedrce
  const jcGeo = new THREE.SphereGeometry(0.12, q(40), q(28)); // indeksirana: gladke normale po izboklinah
  {
    const p = jcGeo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.12 * fbm(v.x * 18, v.y * 18, v.z * 18)); p.setXYZ(i, v.x, v.y, v.z); }
    jcGeo.computeVertexNormals();
  }
  const jedrce = new THREE.Mesh(jcGeo, mat(B.jedrce, { roughness: 0.55, clearcoat: 0.4 }));
  jedrce.position.set(J.x - 0.09, J.y + 0.07, J.z + 0.08);
  group.add(jedrce);
  del("jedrce", "Jedrce", "Gosto območje v jedru, kjer nastajajo deli ribosomov.", B.jedrce, [jedrce], jedrce.position.toArray());

  // ---------- endoplazemski retikulum ----------
  // Mreža iz parametrične ploskve f(u, v, P) z barvami oglišč b(u, v, P) → [r, g, b]; doda jo v zbirko.
  function mreza(nU, nV, f, b, zb) {
    const off = zb.pos.length / 3, P = new THREE.Vector3();
    for (let j = 0; j <= nV; j++) for (let i = 0; i <= nU; i++) {
      f(i / nU, j / nV, P);
      zb.pos.push(P.x, P.y, P.z);
      const c = b(i / nU, j / nV, P);
      zb.col.push(c[0], c[1], c[2]);
    }
    for (let j = 0; j < nV; j++) for (let i = 0; i < nU; i++) {
      const a = off + j * (nU + 1) + i, c = a + nU + 1;
      zb.idx.push(a, c, a + 1, a + 1, c, c + 1);
    }
  }
  function izZbirke(zb) {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(zb.pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(zb.col, 3));
    g.setIndex(zb.idx);
    g.computeVertexNormals();
    return g;
  }
  // Zrnati ER: koncentrične valovite cisterne okoli jedra (odprte v izrezanem osmem delu, zato se v prerezu vidijo plasti
  // kot pri jedru), z okroglimi odprtinami (fenestracijami) in odebeljenim robom na ravninah prereza; ribosomi sedijo na
  // zunanji strani cistern.
  const erPlasti = [], erRobovi = [];
  for (let s = 0; s < 4; s++) {
    const rr = RJ + 0.058 + s * 0.036;
    const val = (d) => 1 + 0.045 * Math.sin(d.x * 9 + s * 1.7) * Math.cos(d.y * 7 - s) + 0.03 * sum(d.x * 3 + s, d.y * 3, d.z * 3);
    const f = (d) => rr * val(d);
    erPlasti.push(lupina(f, q(72), q(40)).odprta);
    erRobovi.push(rob(f, 0.0135, q(40)));
  }
  const erLu = { f: 9, prag: 0.7 };
  const erMat = V.sencilo(mat(0x3550d8, { roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.12, specularIntensity: 0.35, sheen: 0, envMapIntensity: 0.7, side: THREE.DoubleSide }),
    { vr: 2, rf: 46, k: 0.6, b: 0.22, s: 0.1, luknje: erLu });
  const zer = new THREE.Mesh(zdruzi(erPlasti), erMat);
  const zerRob = new THREE.Mesh(zdruzi(erRobovi), V.sencilo(mat(0x5a70f0, { roughness: 0.3, clearcoat: 1, sheen: 0.2, emissive: new THREE.Color(0x1a2280) }), { vr: 2, rf: 60, k: 0.6 }));
  for (const m of [zer, zerRob]) { m.position.copy(J); group.add(m); }
  const erTocke = V.posej(zer, hi ? 2600 : 700, (p) => { const l = p.clone().sub(J); return !vIzrezu(l) && !V.vLuknji(l, erLu); }).map((t) => t.p);
  del("zrnati-er", "Zrnati endoplazemski retikulum", "Sistem sploščenih membranskih vrečk z ribosomi; v njem nastajajo beljakovine, ki gredo iz celice ali v membrane.", B.zer, [zer, zerRob], [J.x - 0.3, J.y + 0.2, J.z + 0.05]);

  // Gladki ER: razvejana mreža cevk s stičišči ob zrnatem ER.
  const ger = [], vozl = [];
  for (let i = 0, p = 0; i < (hi ? 16 : 10) && p < 4000; p++) {
    const c = new THREE.Vector3(-0.3 + rnd() * 0.38, 0.42 + rnd() * 0.2, -0.46 + rnd() * 0.44);
    if (c.length() > 0.8 || vozl.some((x) => x.distanceTo(c) < 0.085)) continue;
    vozl.push(c); i++;
  }
  const povezave = new Set();
  vozl.forEach((a, i) => {
    vozl.map((b, j) => [a.distanceTo(b), j]).filter(([, j]) => j !== i).sort((x, y) => x[0] - y[0]).slice(0, 2 + (i % 2)).forEach(([d, j]) => {
      const kl = Math.min(i, j) + "-" + Math.max(i, j);
      if (povezave.has(kl) || d > 0.24) return;
      povezave.add(kl);
      const b = vozl[j], m = a.clone().lerp(b, 0.5).add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.06));
      ger.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, m, b]), q(12), 0.012 + rnd() * 0.004, q(7), false));
    });
  });
  for (const c of vozl) ger.push(new THREE.SphereGeometry(0.02, q(10), q(8)).translate(c.x, c.y, c.z));
  const gladki = new THREE.Mesh(zdruzi(ger), mat(B.ger, { roughness: 0.3, clearcoat: 0.9 }));
  group.add(gladki);
  del("gladki-er", "Gladki endoplazemski retikulum", "Razvejana mreža cevk brez ribosomov; v njih nastajajo maščobe in se razstrupljajo snovi.", B.ger, [gladki], (vozl.find((c) => c.z > -0.15 && c.y > 0.5) || vozl[0]).toArray());

  // ---------- ribosomi (prosti in na zrnatem ER) ----------
  const nRib = hi ? 3200 : 700;
  const ribGeo = new THREE.IcosahedronGeometry(0.0074, 0);
  ribGeo.scale(1, 0.82, 1.12);
  const rib = new THREE.InstancedMesh(ribGeo, mat(B.ribosomi, { roughness: 0.28, clearcoat: 0.9, emissive: new THREE.Color(B.ribosomi).multiplyScalar(0.22) }), nRib);
  k = 0;
  for (; k < nRib * 0.55 && k < erTocke.length; k++) {
    const v = erTocke[k].clone().sub(J).multiplyScalar(1.025 + rnd() * 0.012).add(J);
    o.position.copy(v); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.scale.setScalar(0.8 + rnd() * 0.45); o.updateMatrix(); rib.setMatrixAt(k, o.matrix);
  }
  // prosti ribosomi: posamezni in v kratkih verižicah (poliribosomi na isti mRNK)
  const korakP = new THREE.Vector3();
  while (k < nRib) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    const d = smer.length();
    if (d > 0.86 || d > oblika(smer.clone().normalize()) * DM - 0.03 || smer.distanceTo(J) < RJ + 0.05 || predJedrom(smer, 0.6)) continue;
    const n = rnd() < 0.45 ? 4 + Math.floor(rnd() * 5) : 1;
    korakP.set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).setLength(0.019);
    for (let j = 0; j < n && k < nRib; j++) {
      o.position.copy(smer); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.scale.setScalar(0.8 + rnd() * 0.45); o.updateMatrix(); rib.setMatrixAt(k++, o.matrix);
      korakP.applyAxisAngle(o.up, 0.5).add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.008)).setLength(0.019);
      smer.add(korakP);
    }
  }
  o.scale.setScalar(1);
  const ribT = new THREE.Vector3(), ribM = new THREE.Matrix4(), ribC = new THREE.Vector3(0.276, 0.36, 0.297), ribP = new THREE.Vector3();
  for (let i = 0, best = 1e9; i < nRib; i++) { rib.getMatrixAt(i, ribM); ribP.setFromMatrixPosition(ribM); if (ribP.distanceTo(ribC) < best) { best = ribP.distanceTo(ribC); ribT.copy(ribP); } }
  group.add(rib);
  del("ribosomi", "Ribosomi", "Drobna zrnca, ki po navodilih iz DNK sestavljajo beljakovine; nekatera prosto plavajo, druga sedijo na zrnatem ER.", B.ribosomi, [rib], ribT.toArray());

  // ---------- Golgijev aparat ----------
  // Ukrivljene sploščene cisterne: sredina tanka, robovi in konci odebeljeni; od cis (svetlejše) do trans strani (temnejše).
  const golZb = { pos: [], col: [], idx: [] };
  const gCis = new THREE.Color(B.golgiSvetel), gTrans = new THREE.Color(0xd9781a), gRob = new THREE.Color(0xffeaa8), gC = new THREE.Color();
  const konciGol = [];
  for (let i = 0; i < 6; i++) {
    const R = 0.26 - i * 0.022, L = Math.PI * (0.78 - i * 0.05), a0 = Math.PI * (0.11 + i * 0.025), W = 0.05 * (1 - i * 0.03), T = 0.0075;
    const prerez = (u, v) => {
      const s = 2 * u - 1, e = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(s), 6)), 0.3) * (1 + 0.7 * Math.pow(s, 4));
      const b = v * Math.PI * 2, cb = Math.cos(b), sb = Math.sin(b);
      return { e, cb, sb, rad: T * e * (1 + 3 * Math.pow(sb, 12)) * Math.sign(cb) * Math.pow(Math.abs(cb), 0.4), z: W * e * sb };
    };
    mreza(q(36), q(14), (u, v, P) => {
      const a = a0 + u * L, x = prerez(u, v), r = R + x.rad;
      P.set(Math.cos(a) * r, Math.sin(a) * r, x.z);
    }, (u, v) => {
      const x = prerez(u, v);
      gC.copy(gCis).lerp(gTrans, i / 5).lerp(gRob, 0.3 * Math.pow(Math.abs(x.sb), 10));
      const k = 0.84 + 0.16 * x.cb;
      return [gC.r * k, gC.g * k, gC.b * k];
    }, golZb);
    for (const u of [0, 1]) konciGol.push({ a: a0 + u * L + (u ? 1 : -1) * 0.12, r: R, i });
  }
  // mehurčki: ob koncih cistern in ob trans strani (znotraj loka)
  const krogla = (c, r, barva) => mreza(q(10), q(7), (u, v, P) => {
    P.set(Math.sin(Math.PI * v) * Math.cos(2 * Math.PI * u), Math.cos(Math.PI * v), Math.sin(Math.PI * v) * Math.sin(2 * Math.PI * u)).multiplyScalar(r).add(c);
  }, (u, v) => { const k = 0.8 + 0.2 * Math.cos(Math.PI * v); return [barva.r * k, barva.g * k, barva.b * k]; }, golZb);
  for (let n = 0; n < (hi ? 16 : 10); n++) {
    let c;
    if (n % 2 === 0) { const k = konciGol[(n * 5) % konciGol.length]; c = new THREE.Vector3(Math.cos(k.a) * k.r, Math.sin(k.a) * k.r, (rnd() - 0.5) * 0.06); }
    else { const a = Math.PI * (0.2 + rnd() * 0.5), rr = 0.1 - rnd() * 0.03; c = new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr, (rnd() - 0.5) * 0.08); }
    krogla(c, 0.017 + rnd() * 0.01, gC.copy(gCis).lerp(gTrans, n % 2 ? 0.9 : 0.4));
  }
  const golgi = new THREE.Mesh(izZbirke(golZb), mat(0xffffff, { vertexColors: true, roughness: 0.34, clearcoat: 0.85, side: THREE.DoubleSide }));
  golgi.position.set(-0.5, 0.34, 0.24);
  golgi.scale.setScalar(0.85);
  golgi.rotation.set(-0.9, -0.5, 0.6);
  group.add(golgi);
  del("golgi", "Golgijev aparat", "Kup ukrivljenih sploščenih membranskih vrečk; beljakovine dodela, zapakira v mehurčke in jih pošlje naprej.", B.golgi, [golgi], [-0.52, 0.4, 0.3]);

  // ---------- mitohondriji (v prerezu: zunanja membrana in kriste) ----------
  function mitohondrij() {
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
    // ploskvi prereza na obeh robovih odprtine: zunanja membrana, medmembranski prostor, notranja membrana
    const rez = [], rezB = [];
    for (const a of [0.5 * Math.PI, 1.95 * Math.PI]) for (const [t0, t1, b] of [[0, 0.32, 0xb4621a], [0.32, 0.62, 0xffe6b0], [0.62, 1, 0xe8a032]]) {
      const pos = [], idx = [];
      prof.forEach((pt) => { for (const t of [t0, t1]) { const sx = 1 - 0.14 * t, sy = 1 - 0.07 * t; pos.push(pt.x * sx * Math.sin(a), pt.y * sy, pt.x * sx * Math.cos(a)); } });
      for (let i = 0; i < prof.length - 1; i++) { const j = i * 2; idx.push(j, j + 2, j + 1, j + 1, j + 2, j + 3); }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx); g.computeVertexNormals();
      rez.push(g); rezB.push(b);
    }
    const g = zdruzi([zun, not, ...kr, ...rez], [0xd98a1e, 0xf0b24a, ...kr.map(() => 0xffd67e), ...rezB]);
    // organska oblika: rahlo ukrivljen in neenakomerno debel (ne popolna kapsula)
    const p = g.attributes.position, v = new THREE.Vector3(), H = L / 2 + r;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const t = v.y / H, w = 1 + 0.07 * Math.sin(t * 3.1 + 0.6) + 0.04 * sum(v.x * 40, v.y * 40, v.z * 40);
      p.setXYZ(i, v.x * w + 0.032 * (t * t - 0.4), v.y, v.z * w);
    }
    g.computeVertexNormals();
    return g;
  }
  const nMit = hi ? 24 : 12;
  const mit = new THREE.InstancedMesh(mitohondrij(), mat(0xffffff, { vertexColors: true, roughness: 0.38, side: THREE.DoubleSide }), nMit);
  const mitPol = [];
  // Odprtina mitohondrija (izrez v LatheGeometry, smer W v lastnih koordinatah) gleda proti kameri, da se vidijo kriste;
  // os mitohondrija je naključna, a pravokotna na smer pogleda.
  const mW = new THREE.Vector3(Math.sin(0.225 * Math.PI), 0, Math.cos(0.225 * Math.PI)), mP = new THREE.Vector3(0, 1, 0).cross(mW);
  function protiKameri(e) {
    const w = POG.clone().add(new THREE.Vector3(Math.sin(e.x * 2), Math.sin(e.y * 2), Math.sin(e.z * 2)).multiplyScalar(0.25)).normalize();
    const y = new THREE.Vector3(Math.cos(e.x * 2.1), Math.sin(e.y * 1.7), Math.cos(e.z * 1.3)).projectOnPlane(w).normalize();
    const pp = y.clone().cross(w);
    const L = new THREE.Matrix4().makeBasis(mP, new THREE.Vector3(0, 1, 0), mW), T = new THREE.Matrix4().makeBasis(pp, y, w);
    return T.multiply(L.transpose());
  }
  k = 0;
  while (k < nMit) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).multiplyScalar(0.82);
    if (smer.length() > 0.8 || smer.length() < RJ + 0.2 || smer.distanceTo(golgi.position) < 0.26 || mitPol.some((m) => m.p.distanceTo(smer) < 0.15) || vozl.some((c) => c.distanceTo(smer) < 0.12 || zastira(smer, c, 0.07)) || predJedrom(smer, 1.05)) continue;
    const e = new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3);
    mitPol.push({ p: smer.clone(), e, f: rnd() * 6 });
    o.position.copy(smer); o.quaternion.setFromRotationMatrix(protiKameri(e)); o.scale.setScalar(0.85 + rnd() * 0.4); o.scale.y *= 0.8 + 0.45 * hash(k, 3, 1); o.updateMatrix(); mit.setMatrixAt(k++, o.matrix);
  }
  group.add(mit);
  const mitT = vidna(mitPol.map((m) => m.p));
  del("mitohondrij", "Mitohondrij", "Elektrarna celice: pri celičnem dihanju iz glukoze in kisika pridobi energijo (ATP). Obdajata ga dve membrani; notranja je nagubana v kriste.", B.mitohondrij, [mit], mitT.toArray());

  // ---------- lizosomi in peroksisomi ----------
  function kroglice(n, polmer, barva, opcije, izogni) {
    const kg = new THREE.SphereGeometry(polmer, q(16), q(11)), kp = kg.attributes.position, kv = new THREE.Vector3();
    for (let i = 0; i < kp.count; i++) { kv.fromBufferAttribute(kp, i); kv.multiplyScalar(1 + 0.09 * sum(kv.x / polmer * 1.6 + n, kv.y / polmer * 1.6, kv.z / polmer * 1.6)); kp.setXYZ(i, kv.x, kv.y, kv.z); }
    kg.computeVertexNormals();
    const m = new THREE.InstancedMesh(kg, mat(barva, opcije), n);
    const tocke = [];
    let i = 0;
    while (i < n) {
      smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).multiplyScalar(0.85);
      if (smer.length() > 0.82 || smer.distanceTo(J) < RJ + 0.12 || izogni(smer) || predJedrom(smer, 0.95) || (i < 2 && !vIzrezu(smer))) continue;
      tocke.push(smer.clone());
      o.position.copy(smer); o.rotation.set(0, 0, 0); o.scale.setScalar(0.75 + rnd() * 0.5); o.scale.x *= 0.9 + 0.2 * hash(i, n, 2); o.scale.z *= 0.9 + 0.2 * hash(n, i, 5); o.rotation.set(hash(i, 1, n) * 3, hash(i, 2, n) * 3, 0); o.updateMatrix(); m.setMatrixAt(i++, o.matrix);
    }
    group.add(m);
    return { m, t: vidna(tocke) };
  }
  const blizu = (p) => mitPol.some((m) => m.p.distanceTo(p) < 0.14) || p.distanceTo(golgi.position) < 0.22;
  const liz = kroglice(hi ? 14 : 7, 0.046, B.lizosom, { roughness: 0.18, clearcoat: 1 }, blizu);
  del("lizosom", "Lizosom", "Mehurček z encimi, ki razgradi odslužene dele celice in snovi, ki jih celica pogoltne.", B.lizosom, [liz.m], liz.t.toArray());
  const per = kroglice(hi ? 11 : 5, 0.034, B.peroksisom, { roughness: 0.4, clearcoat: 0.6 }, blizu);
  del("peroksisom", "Peroksisom", "Majhen mehurček, ki razgrajuje maščobne kisline in strupeni vodikov peroksid.", B.peroksisom, [per.m], per.t.toArray());

  // ---------- centrosom s parom centriol ----------
  function centriola() {
    const g = [];
    for (let i = 0; i < 9; i++) {
      for (let t = 0; t < 3; t++) {
        const a = (i / 9) * Math.PI * 2 + t * 0.09, rr = 0.03 - t * 0.0045;
        const c = new THREE.CylinderGeometry(0.0042, 0.0042, 0.11, q(6), 1);
        c.translate(Math.cos(a) * rr, 0, Math.sin(a) * rr);
        g.push(c);
      }
    }
    return g;
  }
  const c1 = centriola();
  const c2 = centriola().map((g) => g.rotateX(Math.PI / 2).translate(0.0, 0.05, 0.06));
  const cent = new THREE.Mesh(zdruzi(c1.concat(c2)), mat(B.centrosom, { roughness: 0.3, emissive: new THREE.Color(B.centrosom).multiplyScalar(0.15) }));
  const C = new THREE.Vector3(-0.44, 0.16, 0.16);
  cent.position.copy(C);
  cent.rotation.set(0.4, 0.3, 0.5);
  group.add(cent);
  del("centrosom", "Centrosom s centriolama", "Par pravokotno postavljenih valjčkov iz mikrotubulov; pri delitvi celice pomagata razporediti kromosome.", B.centrosom, [cent], C.toArray());

  // ---------- citoskelet: mikrotubuli iz centrosoma (sijoča rumena vlakna) in aktinska skorja tik pod membrano ----------
  const mt = [];
  for (let i = 0; i < (hi ? 40 : 16); i++) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize();
    const kon = smer.clone().multiplyScalar(oblika(smer) * DM * (0.97 - 0.25 * rnd() * rnd()));
    const sr = [0.33, 0.66].map((u) => {
      const p = C.clone().lerp(kon, u).add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.22));
      if (p.distanceTo(J) < RJ + 0.2) p.add(p.clone().sub(J).setLength(RJ + 0.22 - p.distanceTo(J)));
      return p;
    });
    mt.push(new THREE.CubicBezierCurve3(C.clone(), sr[0], sr[1], kon));
  }
  const akt = [];
  for (let i = 0, p = 0; i < (hi ? 150 : 40) && p < 3000; p++) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize();
    const t = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).cross(smer).normalize();
    const pts = [];
    for (let j = 0; j < 4; j++) {
      const d = smer.clone().addScaledVector(t, (j - 1.5) * 0.06).add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.025)).normalize();
      pts.push(d.multiplyScalar(oblika(d) * DM * (0.955 - 0.02 * rnd())));
    }
    if (pts.some((x) => vIzrezu(x, { x: 0.02, y: -0.02, z: -0.02 }))) continue;
    akt.push(new THREE.CatmullRomCurve3(pts));
    i++;
  }
  const cito = V.vlakna(mt, 0.0026, B.citoskelet, { sij: 0.5 });
  const aktin = V.vlakna(akt, 0.0022, B.aktin, { sij: 0.4, seg: hi ? 10 : 6, rad: 3 });
  group.add(cito, aktin);
  del("citoskelet", "Citoskelet", "Mreža beljakovinskih vlaken in cevk; celici daje obliko, po njej se premikajo organeli in mehurčki.", B.citoskelet, [cito, aktin], [-0.332, 0.286, 0.284]);

  // ---------- transportni mešički (gibljejo se od Golgija proti membrani) ----------
  const nVez = hi ? 14 : 9;
  const mesi = new THREE.InstancedMesh(new THREE.SphereGeometry(0.024, q(11), q(8)), mat(B.mesicki, { roughness: 0.16, clearcoat: 1 }), nVez);
  const poti = [];
  for (let i = 0, p = 0; i < nVez && p < 500; p++) {
    smer.set(-rnd() - 0.3, rnd() * 0.8 + 0.1, rnd() + 0.2).normalize();
    const b = smer.clone().multiplyScalar(oblika(smer) * DM * 0.97);
    if (p < 400 && [0.2, 0.5, 0.8].some((u) => predJedrom(golgi.position.clone().lerp(b, u), 1.1))) continue;
    poti.push({ a: golgi.position.clone(), b, f: i / nVez, s: 0.75 + 0.5 * rnd() });
    i++;
  }
  function postaviMesicke(t) {
    poti.forEach((p, i) => {
      const u = (p.f + t * 0.06) % 1;
      o.position.copy(p.a).lerp(p.b, 0.15 + u * 0.85); o.rotation.set(0, 0, 0); o.scale.setScalar(p.s); o.updateMatrix(); mesi.setMatrixAt(i, o.matrix);
    });
    mesi.instanceMatrix.needsUpdate = true;
  }
  postaviMesicke(0);
  group.add(mesi);
  del("mesicki", "Transportni mešički", "Mehurčki, ki prenašajo beljakovine od Golgijevega aparata do celične membrane in jih izločijo iz celice.", B.mesicki, [mesi], poti[0].a.clone().lerp(poti[0].b, 0.6).toArray());

  // ---------- nadzor ----------
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez",
      ob: (v) => { const cela = v === "cela"; pokrov.visible = cela; beljP.visible = cela; jPokrov.visible = cela; memRob.visible = !cela; },
    },
  ];
  if (ctx.zacetek && ctx.zacetek.prikaz) { nadzor[0].vrednost = ctx.zacetek.prikaz; nadzor[0].ob(ctx.zacetek.prikaz); }

  // rahle razlike v svetlosti med ponovljenimi deli (organeli in beljakovine niso vsi povsem enaki)
  {
    const c = new THREE.Color();
    group.traverse((m) => {
      if (!m.isInstancedMesh || m.instanceColor) return;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.88 + 0.2 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
    });
  }

  // Ploskev prereza membrane (trije loki na ravninah izreza); aRez = (dolžina vzdolž roba, globina 0 … 1 od zunaj navznoter).
  function prerezDvosloj(fZ, fN, seg) {
    const loki = [
      (t) => new THREE.Vector3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)),
      (t) => new THREE.Vector3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0),
      (t) => new THREE.Vector3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)),
    ];
    const pos = [], rez = [], idx = [], prej = new THREE.Vector3(), P = new THREE.Vector3();
    loki.forEach((L, li) => {
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
  // Lipidni dvosloj narisan v senčilniku: glave fosfolipidov (kroglice), po dva valovita repa, ponekod beljakovina čez
  // ves dvosloj. D = debelina membrane v enotah modela. Brez dodatnih trikotnikov.
  function dvoslojMat(D) {
    const m = mat(0xffffff, { roughness: 0.46, clearcoat: 0.55, clearcoatRoughness: 0.18, sheen: 0.3, sheenColor: new THREE.Color(0xdcd6ff), side: THREE.DoubleSide });
    m.userData.rez = true;
    const Df = (+D).toFixed(5);
    function dodaj(m) {
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec2 aRez;\nvarying vec2 vRez;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRez = aRez;");
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vRez;" + ZV_GLSL)
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

  // drobna zrnca v citoplazmi (beljakovinski kompleksi, glikogen): notranjost ni enolična ploskev
  const zrnT = [];
  for (let p = 0; zrnT.length < (hi ? 5000 : 2000) && p < 200000; p++) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    const d = smer.length();
    if (d > 0.9 || vIzrezu(smer, { x: 0.01, y: -0.01, z: -0.01 }) || smer.distanceTo(J) < RJ + 0.03) continue;
    if (d > oblika(smer.clone().normalize()) * DM - 0.02) continue;
    zrnT.push(smer.clone());
  }
  const zrn = V.pike(zrnT, 0x8a74e8, 0.0065, 0.5);
  group.add(zrn);

  const vMit = (p) => mitPol.reduce((k, m) => k * (1 - 0.3 * Math.max(0, 1 - m.p.distanceTo(p) / 0.16)), 1);
  V.poliraj(group, deli, {
    membrana: { tex: "zrna", rf: 19, k: 1.3, b: 0.2, s: 0.2, lisa: 0.16, f: 2.4, sheen: 0.75, temni: 0.92, cc: 0.7, ccr: 0.12 },
    citoplazma: { tex: "fino", rf: 34, k: 1.1, b: 0.24, lisa: 0.22, f: 3.5,
      ao: (p) => (0.78 + 0.22 * Math.min(1, Math.max(0, 0.5 + 0.6 * (-p.x + p.y + p.z) / (Math.hypot(p.x, p.y, p.z) * 1.732 || 1)))) * vMit(p) },
    jedro: { tex: "zrna", rf: 28, k: 1.2, b: 0.2, lisa: 0.12, f: 5, ao: (p) => 0.86 + 0.14 * Math.max(-1, Math.min(1, p.y / RJ)) },
    nukleoplazma: { tex: "fino", rf: 40, k: 0.9, b: 0.22, lisa: 0.2, f: 7 },
    "jedrna-ovojnica": { tex: null },
    kromatin: { rf: 90, k: 0.6 },
    jedrce: { tex: "zrna", rf: 60, k: 1.4, b: 0.25 },
    "zrnati-er": { tex: "fino", rf: 46, k: 0.9, b: 0.2, temni: 0.86, s: 0.2 },
    "gladki-er": { tex: "fino", rf: 44, k: 0.7 },
    golgi: { tex: "fino", rf: 50, k: 0.8 },
    mitohondrij: { tex: "zrna", rf: 70, k: 0.7, b: 0.18 },
    lizosom: { tex: "zrna", rf: 45, k: 0.9, b: 0.22 },
    peroksisom: { tex: "zrna", rf: 55, k: 0.9, b: 0.25 },
    ribosomi: { tex: null },
    centrosom: { tex: null },
    citoskelet: { tex: null },
    mesicki: { rf: 50, k: 0.6 },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(deli));

  return {
    group,
    deli,
    nadzor,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81],
    korak(t) {
      if (!gib) return;
      postaviMesicke(t);
      group.rotation.y = Math.sin(t * 0.15) * 0.04;
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
