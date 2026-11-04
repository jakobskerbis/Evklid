// Živalska celica v prerezu: odrezan osmi del pokaže notranjost (jedro, organeli, citoskelet).
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "celica-zivalska",
  naslov: "Živalska celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Evkariontska celica brez celične stene in kloroplastov. Odrezan del pokaže jedro in organele; organelov je zaradi preglednosti manj kot v resnici.",
  poskusi: "Tapni jedro in mitohondrij, nato preklopi na »Cela celica« in poišči, kje je bil prerez.",
  merilo: { m: 20e-6, oznaka: "20 µm" },
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

  // ---------- celična membrana in citoplazma ----------
  const R = 0.97;
  const oblika = (d) => R * (1 + 0.035 * fbm(d.x * 1.6 + 3, d.y * 1.6, d.z * 1.6) - 0.02);
  const mem = lupina(oblika, q(112), q(64));
  const memMat = mat(0xd88aa2, { roughness: 0.32, clearcoat: 1, side: THREE.FrontSide });
  const memOut = new THREE.Mesh(mem.odprta, memMat);
  const citMat = mat(0xf1c9b6, { roughness: 0.75, clearcoat: 0.1, sheen: 0.2, side: THREE.BackSide });
  const DM = 0.97; // notranja ploskev membrane (debelina ≈ 3 % polmera, povečano)
  const citIn = new THREE.Mesh(mem.odprta.clone().scale(DM, DM, DM), citMat);
  const memRob = new THREE.Mesh(prerezPlasti(oblika, (d) => oblika(d) * DM, q(72), DVOSLOJ(0xb4587c, 0xf4d9c4)),
    mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  const pokrov = new THREE.Mesh(mem.pokrov, memMat);
  pokrov.visible = false;
  group.add(memOut, citIn, memRob, pokrov);
  del("membrana", "Celična membrana", "Prožna meja celice iz dveh plasti fosfolipidov (v prerezu temni glavi in svetli repi); odloča, katere snovi vstopijo in izstopijo. Debelina membrane je povečana.", "#d88aa2", [memOut, memRob, pokrov], [0.25, -0.3, 0.88]);
  del("citoplazma", "Citoplazma", "Želatinasta tekočina, ki napolnjuje celico; v njej plavajo organeli in poteka veliko kemijskih reakcij.", "#f1c9b6", [citIn], [0.44, -0.661, -0.493]);

  // ---------- jedro ----------
  const RJ = 0.36, J = new THREE.Vector3(0.04, 0.0, -0.04);
  const oblJ = (d) => RJ * (1 + 0.04 * sum(d.x * 2 + 9, d.y * 2, d.z * 2));
  const jl = lupina(oblJ, q(80), q(48));
  const jMat = mat(0x7a68d8, { roughness: 0.34 });
  const jOut = new THREE.Mesh(jl.odprta, jMat);
  const nukMat = mat(0xb9a8ff, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide });
  const DJ = 0.93; // dvojna jedrna ovojnica: zunanja membrana, presledek, notranja membrana (povečano)
  const jIn = new THREE.Mesh(jl.odprta.clone().scale(DJ, DJ, DJ), nukMat);
  const jRob = new THREE.Mesh(prerezPlasti(oblJ, (d) => oblJ(d) * DJ, q(48), [[0, 0.32, 0x5a46b8], [0.32, 0.68, 0xd9cffb], [0.68, 1, 0x5a46b8]]),
    mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  const jPokrov = new THREE.Mesh(jl.pokrov, jMat);
  jPokrov.visible = false;
  for (const m of [jOut, jIn, jRob, jPokrov]) m.position.copy(J);
  group.add(jOut, jIn, jRob, jPokrov);
  // jedrne pore: obročki na jedrni ovojnici
  const nPor = hi ? 110 : 60;
  const pore = new THREE.InstancedMesh(new THREE.TorusGeometry(0.016, 0.006, 4, q(10)), mat(0x5440b0, { roughness: 0.5 }), nPor);
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
  del("jedro", "Jedro", "Največji organel; v njem je DNK z navodili za delovanje in delitev celice.", "#7a68d8", [jOut, jPokrov], [-0.183, 0.29, -0.04]);
  del("jedrna-ovojnica", "Jedrna ovojnica in pore", "Dvojna membrana okoli jedra (v prerezu dve temni plasti s presledkom); skozi jedrne pore potujejo snovi med jedrom in citoplazmo.", "#5440b0", [pore, jRob], [J.x + 0.1, J.y + 0.2, J.z + 0.32]);
  del("nukleoplazma", "Nukleoplazma", "Tekočina v notranjosti jedra, v kateri sta kromatin in jedrce.", "#b9a8ff", [jIn], [0.177, -0.201, -0.263]);

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
  const krom = new THREE.Mesh(zdruzi(kromGeo), mat(0x4b3aa6, { roughness: 0.55, clearcoat: 0.4 }));
  krom.position.copy(J);
  group.add(krom);
  del("kromatin", "Kromatin", "Dolge niti DNK, navite na beljakovine; pred delitvijo celice se zgostijo v kromosome.", "#4b3aa6", [krom], [J.x - 0.1, J.y + 0.15, J.z + 0.2]);

  // jedrce
  const jcGeo = new THREE.IcosahedronGeometry(0.12, hi ? 12 : 7);
  {
    const p = jcGeo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.12 * fbm(v.x * 18, v.y * 18, v.z * 18)); p.setXYZ(i, v.x, v.y, v.z); }
    jcGeo.computeVertexNormals();
  }
  const jedrce = new THREE.Mesh(jcGeo, mat(0x34268a, { roughness: 0.6, clearcoat: 0.3 }));
  jedrce.position.set(J.x - 0.09, J.y + 0.07, J.z + 0.08);
  group.add(jedrce);
  del("jedrce", "Jedrce", "Gosto območje v jedru, kjer nastajajo deli ribosomov.", "#34268a", [jedrce], jedrce.position.toArray());

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
  // Zrnati ER: valovite sploščene cisterne (dve membrani z ozko svetlino, zaobljen rob) v plasteh okoli jedra.
  const erZb = { pos: [], col: [], idx: [] }, erTocke = [];
  const erB = new THREE.Color(0x5b8fe0), erS = new THREE.Color(0xa9c8f7), erT = new THREE.Color(0x3a6cc8), cT = new THREE.Color();
  for (let s = 0; s < 4; s++) {
    const rr = RJ + 0.07 + s * 0.055;
    const ph0 = Math.PI * 0.62, phL = Math.PI * 1.15, th0 = Math.PI * 0.3, thL = Math.PI * 0.45;
    const val = (d) => Math.sin(d.x * 14 + s) * Math.cos(d.y * 11 - s * 2);
    const deb = (u, v) => Math.pow(Math.max(0, Math.sin(Math.PI * u) * Math.sin(Math.PI * v)), 0.3);
    for (const st of [1, -1]) {
      let n = 0;
      mreza(q(48), q(22), (u, v, P) => {
        const ph = ph0 + u * phL, th = th0 + v * thL;
        P.set(-Math.cos(ph) * Math.sin(th), Math.cos(th), Math.sin(ph) * Math.sin(th));
        P.multiplyScalar(rr * (1 + 0.06 * val(P)) + st * 0.0075 * deb(u, v));
        if (st > 0 && n++ % 5 === 0 && deb(u, v) > 0.5) erTocke.push(P.clone());
      }, (u, v, P) => {
        const w = val(P.clone().normalize()), rob = Math.pow(1 - deb(u, v), 3);
        cT.copy(erB).lerp(w > 0 ? erS : erT, Math.abs(w) * 0.3).lerp(erS, rob * 0.45);
        const k = (st < 0 ? 0.82 : 1) * (0.88 + 0.04 * s);
        return [cT.r * k, cT.g * k, cT.b * k];
      }, erZb);
    }
  }
  const erMat = mat(0xffffff, { vertexColors: true, roughness: 0.42, clearcoat: 0.7, side: THREE.DoubleSide });
  const zer = new THREE.Mesh(izZbirke(erZb), erMat);
  zer.position.copy(J);
  zer.rotation.set(0.3, -0.4, 0.2);
  group.add(zer);
  zer.updateMatrix();
  del("zrnati-er", "Zrnati endoplazemski retikulum", "Sistem sploščenih membranskih vrečk z ribosomi; v njem nastajajo beljakovine, ki gredo iz celice ali v membrane.", "#5b8fe0", [zer], [-0.154, 0.196, -0.362]);

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
  const gladki = new THREE.Mesh(zdruzi(ger), mat(0x3fbfae, { roughness: 0.38, clearcoat: 0.9 }));
  group.add(gladki);
  del("gladki-er", "Gladki endoplazemski retikulum", "Razvejana mreža cevk brez ribosomov; v njih nastajajo maščobe in se razstrupljajo snovi.", "#3fbfae", [gladki], (vozl.find((c) => c.z > -0.15 && c.y > 0.5) || vozl[0]).toArray());

  // ---------- ribosomi (prosti in na zrnatem ER) ----------
  const nRib = hi ? 1000 : 500;
  const rib = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.0085, 0), mat(0x2b3f8f, { roughness: 0.6, clearcoat: 0.2 }), nRib);
  const zerM = new THREE.Matrix4().compose(J, new THREE.Quaternion().setFromEuler(zer.rotation), new THREE.Vector3(1, 1, 1));
  k = 0;
  for (; k < nRib * 0.55 && k < erTocke.length; k++) {
    const v = erTocke[(k * 7919) % erTocke.length].clone().multiplyScalar(1.02 + rnd() * 0.02).applyMatrix4(zerM);
    o.position.copy(v); o.rotation.set(0, 0, 0); o.updateMatrix(); rib.setMatrixAt(k, o.matrix);
  }
  while (k < nRib) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    const d = smer.length();
    if (d > 0.9 || smer.distanceTo(J) < RJ + 0.05) continue;
    o.position.copy(smer); o.updateMatrix(); rib.setMatrixAt(k++, o.matrix);
  }
  group.add(rib);
  del("ribosomi", "Ribosomi", "Drobna zrnca, ki po navodilih iz DNK sestavljajo beljakovine; nekateri prosto plavajo, drugi sedijo na zrnatem ER.", "#2b3f8f", [rib], [0.276, 0.36, 0.297]);

  // ---------- Golgijev aparat ----------
  // Ukrivljene sploščene cisterne: sredina tanka, robovi in konci odebeljeni; od cis (svetlejše) do trans strani (temnejše).
  const golZb = { pos: [], col: [], idx: [] };
  const gCis = new THREE.Color(0xf6d65a), gTrans = new THREE.Color(0xe59a2c), gRob = new THREE.Color(0xffe68c), gC = new THREE.Color();
  const konciGol = [];
  for (let i = 0; i < 6; i++) {
    const R = 0.26 - i * 0.022, L = Math.PI * (0.78 - i * 0.05), a0 = Math.PI * (0.11 + i * 0.025), W = 0.05 * (1 - i * 0.03), T = 0.0075;
    const prerez = (u, v) => {
      const s = 2 * u - 1, e = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(s), 6)), 0.3) * (1 + 0.7 * Math.pow(s, 4));
      const b = v * Math.PI * 2, cb = Math.cos(b), sb = Math.sin(b);
      return { e, cb, sb, rad: T * e * (1 + 3 * Math.pow(sb, 12)) * Math.sign(cb) * Math.pow(Math.abs(cb), 0.4), z: W * e * sb };
    };
    mreza(q(44), q(16), (u, v, P) => {
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
  const krogla = (c, r, barva) => mreza(q(12), q(8), (u, v, P) => {
    P.set(Math.sin(Math.PI * v) * Math.cos(2 * Math.PI * u), Math.cos(Math.PI * v), Math.sin(Math.PI * v) * Math.sin(2 * Math.PI * u)).multiplyScalar(r).add(c);
  }, (u, v) => { const k = 0.8 + 0.2 * Math.cos(Math.PI * v); return [barva.r * k, barva.g * k, barva.b * k]; }, golZb);
  for (let n = 0; n < (hi ? 12 : 8); n++) {
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
  del("golgi", "Golgijev aparat", "Kup ukrivljenih sploščenih membranskih vrečk; beljakovine dodela, zapakira v mehurčke in jih pošlje naprej.", "#f2c94c", [golgi], [-0.52, 0.4, 0.3]);

  // ---------- mitohondriji (v prerezu: zunanja membrana in kriste) ----------
  function mitohondrij() {
    const L = 0.12, r = 0.055, prof = [];
    for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + (i / 16) * Math.PI; prof.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); }
    const zun = new THREE.LatheGeometry(prof, q(22), 0.5 * Math.PI, 1.45 * Math.PI);
    const not = new THREE.LatheGeometry(prof.map((p) => new THREE.Vector2(p.x * 0.86, p.y * 0.93)), q(22), 0.5 * Math.PI, 1.45 * Math.PI);
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
    for (const a of [0.5 * Math.PI, 1.95 * Math.PI]) for (const [t0, t1, b] of [[0, 0.32, 0xc85a2a], [0.32, 0.62, 0xffe0c2], [0.62, 1, 0xf08a4a]]) {
      const pos = [], idx = [];
      prof.forEach((pt) => { for (const t of [t0, t1]) { const sx = 1 - 0.14 * t, sy = 1 - 0.07 * t; pos.push(pt.x * sx * Math.sin(a), pt.y * sy, pt.x * sx * Math.cos(a)); } });
      for (let i = 0; i < prof.length - 1; i++) { const j = i * 2; idx.push(j, j + 2, j + 1, j + 1, j + 2, j + 3); }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx); g.computeVertexNormals();
      rez.push(g); rezB.push(b);
    }
    const g = zdruzi([zun, not, ...kr, ...rez], [0xe8743b, 0xf5a96e, ...kr.map(() => 0xffc58a), ...rezB]);
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
  const nMit = hi ? 14 : 9;
  const mit = new THREE.InstancedMesh(mitohondrij(), mat(0xffffff, { vertexColors: true, roughness: 0.38, side: THREE.DoubleSide }), nMit);
  const mitPol = [];
  k = 0;
  while (k < nMit) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).multiplyScalar(0.82);
    if (smer.length() > 0.8 || smer.length() < RJ + 0.25 || smer.distanceTo(golgi.position) < 0.28) continue;
    const e = new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3);
    mitPol.push({ p: smer.clone(), e, f: rnd() * 6 });
    o.position.copy(smer); o.rotation.copy(e); o.scale.setScalar(0.85 + rnd() * 0.4); o.scale.y *= 0.8 + 0.45 * hash(k, 3, 1); o.updateMatrix(); mit.setMatrixAt(k++, o.matrix);
  }
  group.add(mit);
  const mitT = mitPol.reduce((a, m) => (vIzrezu(m.p) || m.p.z > a.z ? m.p : a), mitPol[0].p);
  del("mitohondrij", "Mitohondrij", "Elektrarna celice: pri celičnem dihanju iz glukoze in kisika pridobi energijo (ATP). Obdajata ga dve membrani; notranja je nagubana v kriste.", "#e8743b", [mit], mitT.toArray());

  // ---------- lizosomi in peroksisomi ----------
  function kroglice(n, polmer, barva, opcije, izogni) {
    const m = new THREE.InstancedMesh(new THREE.SphereGeometry(polmer, q(18), q(12)), mat(barva, opcije), n);
    const tocke = [];
    let i = 0;
    while (i < n) {
      smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).multiplyScalar(0.85);
      if (smer.length() > 0.82 || smer.distanceTo(J) < RJ + 0.12 || izogni(smer)) continue;
      tocke.push(smer.clone());
      o.position.copy(smer); o.rotation.set(0, 0, 0); o.scale.setScalar(0.75 + rnd() * 0.5); o.scale.x *= 0.9 + 0.2 * hash(i, n, 2); o.scale.z *= 0.9 + 0.2 * hash(n, i, 5); o.rotation.set(hash(i, 1, n) * 3, hash(i, 2, n) * 3, 0); o.updateMatrix(); m.setMatrixAt(i++, o.matrix);
    }
    group.add(m);
    return { m, t: tocke.find((p) => p.z > 0.2) || tocke[0] };
  }
  const blizu = (p) => mitPol.some((m) => m.p.distanceTo(p) < 0.14) || p.distanceTo(golgi.position) < 0.22;
  const liz = kroglice(hi ? 9 : 6, 0.05, 0x7fcf6a, { roughness: 0.3 }, blizu);
  del("lizosom", "Lizosom", "Mehurček z encimi, ki razgradi odslužene dele celice in snovi, ki jih celica pogoltne.", "#7fcf6a", [liz.m], liz.t.toArray());
  const per = kroglice(hi ? 7 : 4, 0.036, 0xc6e06a, { roughness: 0.5, clearcoat: 0.4 }, blizu);
  del("peroksisom", "Peroksisom", "Majhen mehurček, ki razgrajuje maščobne kisline in strupeni vodikov peroksid.", "#c6e06a", [per.m], per.t.toArray());

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
  const cent = new THREE.Mesh(zdruzi(c1.concat(c2)), mat(0x66d3f0, { roughness: 0.35 }));
  const C = new THREE.Vector3(-0.44, 0.16, 0.16);
  cent.position.copy(C);
  cent.rotation.set(0.4, 0.3, 0.5);
  group.add(cent);
  del("centrosom", "Centrosom s centriolama", "Par pravokotno postavljenih valjčkov iz mikrotubulov; pri delitvi celice pomagata razporediti kromosome.", "#66d3f0", [cent], C.toArray());

  // ---------- citoskelet: mikrotubuli iz centrosoma ----------
  const cit = [];
  for (let i = 0; i < (hi ? 18 : 10); i++) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize();
    const kon = smer.clone().multiplyScalar(oblika(smer) * 0.93);
    const sr = C.clone().lerp(kon, 0.5).add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.25));
    if (sr.distanceTo(J) < RJ + 0.06) sr.add(sr.clone().sub(J).setLength(RJ + 0.1 - sr.distanceTo(J)));
    cit.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(C.clone(), sr, kon), q(24), 0.0032, q(4), false));
  }
  const cito = new THREE.Mesh(zdruzi(cit), mat(0xa9bde6, { roughness: 0.5, clearcoat: 0.2, transparent: true, opacity: 0.45, depthWrite: false }));
  group.add(cito);
  del("citoskelet", "Citoskelet", "Mreža beljakovinskih vlaken in cevk; celici daje obliko, po njej se premikajo organeli in mehurčki.", "#c9d6f2", [cito], [-0.332, 0.286, 0.284]);

  // ---------- transportni mešički (gibljejo se od Golgija proti membrani) ----------
  const nVez = 8;
  const mesi = new THREE.InstancedMesh(new THREE.SphereGeometry(0.026, q(14), q(10)), mat(0xf7dc7a, { roughness: 0.3 }), nVez);
  const poti = [];
  for (let i = 0; i < nVez; i++) {
    smer.set(-rnd() - 0.3, rnd() * 0.8 + 0.1, rnd() + 0.2).normalize();
    poti.push({ a: golgi.position.clone(), b: smer.clone().multiplyScalar(oblika(smer) * 0.94), f: i / nVez });
  }
  function postaviMesicke(t) {
    poti.forEach((p, i) => {
      const u = (p.f + t * 0.06) % 1;
      o.position.copy(p.a).lerp(p.b, 0.15 + u * 0.85); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); mesi.setMatrixAt(i, o.matrix);
    });
    mesi.instanceMatrix.needsUpdate = true;
  }
  postaviMesicke(0);
  group.add(mesi);
  del("mesicki", "Transportni mešički", "Mehurčki, ki prenašajo beljakovine od Golgijevega aparata do celične membrane in jih izločijo iz celice.", "#f7dc7a", [mesi], poti[0].a.clone().lerp(poti[0].b, 0.6).toArray());

  // ---------- nadzor ----------
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez",
      ob: (v) => { const cela = v === "cela"; pokrov.visible = cela; jPokrov.visible = cela; memRob.visible = !cela; },
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

  // ---------- videz: globlje barve, vlažni materiali, drobna površinska tekstura, senčenje v vdolbinah ----------
  // nast[idDela] = { tex: "zrna" | "gube" | "fino" | "vlakna" | null, rep: [u, v], k: moč normal mape, lisa: lise,
  //   f: gostota lis, uv: "smer" (krogelni uv), ton: 0 … 1 (poglobitev barve), rough, cc, sheen, temni: zatemnitev, ao(p, n) → faktor }
  function poliraj(nast = {}, seznam) {
    seznam = seznam || deli;
    const N = 128, teks = {}, obdelane = new Set(), hsl = {}, c = new THREE.Color(), bel = new THREE.Color(1, 1, 1);
    const per = (x, y, P, s) => { // periodičen šum vrednosti (ploščica brez šiva)
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      const h = (a, b) => hash(((xi + a) % P + P) % P, ((yi + b) % P + P) % P, s);
      return h(0, 0) * (1 - u) * (1 - v) + h(1, 0) * u * (1 - v) + h(0, 1) * (1 - u) * v + h(1, 1) * u * v;
    };
    const vrste = {
      zrna: (x, y) => 0.5 * per(x * 16, y * 16, 16, 1) + 0.3 * Math.pow(per(x * 32, y * 32, 32, 2), 2) + 0.2 * per(x * 64, y * 64, 64, 3),
      gube: (x, y) => 0.6 * (1 - Math.abs(2 * per(x * 8, y * 8, 8, 4) - 1)) + 0.25 * per(x * 24, y * 24, 24, 5) + 0.15 * per(x * 64, y * 64, 64, 6),
      fino: (x, y) => 0.6 * per(x * 32, y * 32, 32, 7) + 0.4 * per(x * 64, y * 64, 64, 8),
      vlakna: (x, y) => 0.55 * per(x * 4, y * 48, 4, 9) + 0.3 * per(x * 8, y * 96, 8, 10) + 0.15 * per(x * 32, y * 64, 32, 11),
    };
    function tekstura(vrsta, rep) {
      const kl = vrsta + rep;
      if (teks[kl]) return teks[kl];
      if (!teks[vrsta]) {
        const H = new Float32Array(N * N), d = new Uint8Array(N * N * 4), f = vrste[vrsta];
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) H[j * N + i] = f(i / N, j / N);
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          const dx = (H[j * N + (i + 1) % N] - H[j * N + (i + N - 1) % N]) * 6, dy = (H[((j + 1) % N) * N + i] - H[((j + N - 1) % N) * N + i]) * 6;
          const l = Math.hypot(dx, dy, 1), k = (j * N + i) * 4;
          d[k] = (-dx / l * 0.5 + 0.5) * 255; d[k + 1] = (-dy / l * 0.5 + 0.5) * 255; d[k + 2] = (1 / l * 0.5 + 0.5) * 255; d[k + 3] = 255;
        }
        const t = new THREE.DataTexture(d, N, N, THREE.RGBAFormat);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
        t.needsUpdate = true;
        odpad.push(t);
        teks[vrsta] = t;
      }
      const t = teks[vrsta].clone();
      t.repeat.set(rep[0], rep[1]); t.needsUpdate = true;
      odpad.push(t);
      return (teks[kl] = t);
    }
    function poglobi(col, moc) { // nasičenost gor, svetlost dol (pastel → barva znanstvene ilustracije)
      col.getHSL(hsl);
      const s = hsl.s < 0.06 ? hsl.s : Math.min(1, hsl.s * (1 + 0.2 * moc) + 0.03 * moc);
      const l = hsl.l > 0.42 ? hsl.l - (hsl.l - 0.42) * 0.3 * moc : hsl.l * (1 - 0.03 * moc);
      return col.setHSL(hsl.h, s, l);
    }
    function uvIzSmeri(g) { // manjkajoči uv: krogelna projekcija okoli središča geometrije
      g.computeBoundingBox();
      const s = g.boundingBox.getCenter(new THREE.Vector3()), p = g.attributes.position, uv = new Float32Array(p.count * 2), v = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).sub(s);
        const r = v.length() || 1;
        uv[i * 2] = Math.atan2(v.z, v.x) / (2 * Math.PI) + 0.5; uv[i * 2 + 1] = Math.acos(Math.max(-1, Math.min(1, v.y / r))) / Math.PI;
      }
      g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    }
    function obdelajGeo(g, o, m) { // barve oglišč: poglobitev, lise, zatemnitev v vdolbinah in na notranjih stenah
      if (obdelane.has(g)) return;
      obdelane.add(g);
      if (!g.attributes.uv || (o.uv === "smer" && !m.map)) uvIzSmeri(g);
      const p = g.attributes.position, nrm = g.attributes.normal;
      if (!(o.lisa || o.ao || m.side === THREE.BackSide || m.vertexColors)) return;
      let col = g.attributes.color;
      if (!col) { col = new THREE.BufferAttribute(new Float32Array(p.count * 3).fill(1), 3); g.setAttribute("color", col); }
      const P = new THREE.Vector3(), Nn = new THREE.Vector3(), f = o.f || 3, zn = m.side === THREE.BackSide;
      for (let i = 0; i < p.count; i++) {
        P.fromBufferAttribute(p, i);
        if (nrm) Nn.fromBufferAttribute(nrm, i);
        c.fromBufferAttribute(col, i);
        if (m.vertexColors && o.ton !== 0) poglobi(c, o.ton == null ? 1 : o.ton);
        let k = 1;
        if (o.lisa) k *= 1 + o.lisa * fbm(P.x * f + 11, P.y * f + 5, P.z * f + 3);
        if (zn) k *= 0.84 + 0.12 * (P.y / (Math.hypot(P.x, P.y, P.z) || 1));
        if (o.ao) k *= o.ao(P, Nn);
        c.multiplyScalar(k);
        col.setXYZ(i, c.r, c.g, c.b);
      }
      col.needsUpdate = true;
    }
    const mati = new Map();
    for (const d of seznam) for (const x of d.meshes) x.traverse((y) => { if (y.isMesh && y.material && !mati.has(y.material)) mati.set(y.material, d.id); });
    group.traverse((y) => { if (y.isMesh && y.material && !mati.has(y.material)) mati.set(y.material, null); });
    for (const [m, id] of mati) {
      if (!m.isMeshPhysicalMaterial) continue;
      const o = Object.assign({}, nast["*"] || {}, (id && nast[id]) || {});
      const ton = o.ton == null ? 1 : o.ton, zn = m.side === THREE.BackSide;
      const meshes = [];
      group.traverse((y) => { if (y.isMesh && y.material === m) meshes.push(y); });
      const geos = meshes.map((y) => y.geometry);
      if (!m.vertexColors) poglobi(m.color, ton);
      if (o.temni) m.color.multiplyScalar(o.temni);
      if (zn) m.color.multiplyScalar(0.88);
      m.roughness = o.rough != null ? o.rough : Math.min(0.74, Math.max(0.44, m.roughness * 0.55 + 0.3 + (zn ? 0.1 : 0)));
      m.clearcoat = o.cc != null ? o.cc : Math.min(0.5, m.clearcoat * 0.55);
      m.clearcoatRoughness = 0.2;
      m.sheen = o.sheen != null ? o.sheen : Math.max(m.sheen, 0.4);
      m.sheenRoughness = 0.45;
      const sc = m.vertexColors ? c.set(id ? seznam.find((d) => d.id === id).barva : 0xffffff) : c.copy(m.color);
      m.sheenColor = sc.clone().lerp(bel, 0.4).multiplyScalar(0.7);
      m.envMapIntensity = 0.9;
      if (o.lisa || o.ao || zn) m.vertexColors = true;
      for (const g of geos) obdelajGeo(g, o, m);
      if (o.tex !== null) {
        let rep = o.rep;
        if (!rep) {
          const g = geos[0]; g.computeBoundingSphere();
          const n = Math.max(1, Math.round(g.boundingSphere.radius * 9));
          rep = [2 * n, n];
        }
        m.normalMap = tekstura(o.tex || "zrna", rep);
        const k = o.k != null ? o.k : 0.3;
        m.normalScale.set(k, k);
      }
      m.userData.pol = (g) => obdelajGeo(g, o, m);
      m.needsUpdate = true;
    }
  }
  // Drobna zrnca v citoplazmi (točke brez trikotnikov); tocke(i) → Vector3 ali null.
  function zrnca(n, tocke, barva, velikost, razp = 0.35) {
    const pos = [], col = [], b = new THREE.Color(barva), c = new THREE.Color();
    for (let i = 0, p = 0; i < n && p < n * 20; p++) {
      const v = tocke(p);
      if (!v) continue;
      i++;
      pos.push(v.x, v.y, v.z);
      c.copy(b).multiplyScalar(1 - razp / 2 + razp * hash(p * 0.37, 3.1, 9.7));
      col.push(c.r, c.g, c.b);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    const S = 32, d = new Uint8Array(S * S * 4);
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
      const r = Math.hypot(i + 0.5 - S / 2, j + 0.5 - S / 2) / (S / 2), k = (j * S + i) * 4, a = Math.max(0, 1 - r);
      d[k] = d[k + 1] = d[k + 2] = 255 * (0.55 + 0.45 * Math.sqrt(a)); d[k + 3] = r < 0.9 ? 255 : 0;
    }
    const t = new THREE.DataTexture(d, S, S, THREE.RGBAFormat);
    t.magFilter = THREE.LinearFilter; t.needsUpdate = true;
    const m = new THREE.PointsMaterial({ size: velikost, map: t, alphaTest: 0.5, vertexColors: true, sizeAttenuation: true });
    odpad.push(t, m);
    const pt = new THREE.Points(g, m);
    pt.raycast = () => {};
    return pt;
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
  // lipidni dvosloj: temni plasti glav fosfolipidov, svetlejša sredica iz repov
  function DVOSLOJ(glave, repi) { return [[0, 0.3, glave], [0.3, 0.7, repi], [0.7, 1, glave]]; }

  // drobna zrnca v citoplazmi (beljakovinski kompleksi, glikogen): notranjost ni enolična ploskev
  const zrn = zrnca(hi ? 4200 : 1800, () => {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    const d = smer.length();
    if (d > 0.9 || vIzrezu(smer, { x: 0.01, y: -0.01, z: -0.01 }) || smer.distanceTo(J) < RJ + 0.03) return null;
    if (d > oblika(smer.clone().normalize()) * DM - 0.02) return null;
    return smer.clone();
  }, 0xb88a70, 0.013, 0.5);
  group.add(zrn);

  poliraj({
    membrana: { tex: "zrna", rep: [28, 14], k: 0.3, lisa: 0.14, f: 2.4, sheen: 0.7, temni: 0.93 },
    citoplazma: { tex: "fino", rep: [10, 5], k: 0.25, lisa: 0.22, f: 3.5 },
    jedro: { tex: "zrna", rep: [16, 8], k: 0.4, lisa: 0.12, f: 5 },
    nukleoplazma: { tex: "fino", rep: [6, 3], k: 0.3, lisa: 0.2, f: 7 },
    "jedrna-ovojnica": { k: 0.2 },
    jedrce: { tex: "gube", rep: [4, 2], k: 0.5 },
    "zrnati-er": { tex: "fino", rep: [6, 6], k: 0.35 },
    "gladki-er": { tex: "fino", rep: [2, 1], k: 0.3 },
    golgi: { tex: "fino", rep: [4, 4], k: 0.35 },
    mitohondrij: { tex: "fino", rep: [3, 2], k: 0.25 },
    citoskelet: { tex: null },
  });

  return {
    group,
    deli,
    nadzor,
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
