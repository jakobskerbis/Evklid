// Živalska celica v prerezu: odrezan osmi del pokaže notranjost (jedro, organeli, citoskelet).
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "celica-zivalska",
  naslov: "Živalska celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Evkariontska celica brez celične stene in kloroplastov. Odrezan del pokaže jedro in organele; organelov je zaradi preglednosti manj kot v resnici.",
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

  // ---------- celična membrana in citoplazma ----------
  const R = 0.97;
  const oblika = (d) => R * (1 + 0.035 * fbm(d.x * 1.6 + 3, d.y * 1.6, d.z * 1.6) - 0.02);
  const mem = lupina(oblika, q(112), q(64));
  const memMat = mat(0xd88aa2, { roughness: 0.32, clearcoat: 1, side: THREE.FrontSide });
  const memOut = new THREE.Mesh(mem.odprta, memMat);
  const citMat = mat(0xf1c9b6, { roughness: 0.75, clearcoat: 0.1, sheen: 0.2, side: THREE.BackSide });
  const citIn = new THREE.Mesh(mem.odprta.clone().scale(0.985, 0.985, 0.985), citMat);
  const memRob = new THREE.Mesh(rob(oblika, 0.018, q(40)), memMat);
  const pokrov = new THREE.Mesh(mem.pokrov, memMat);
  pokrov.visible = false;
  group.add(memOut, citIn, memRob, pokrov);
  del("membrana", "Celična membrana", "Tanka prožna meja celice iz dveh plasti maščob; odloča, katere snovi vstopijo in izstopijo.", "#d88aa2", [memOut, memRob, pokrov], [-0.2, 0.45, 0.85]);
  del("citoplazma", "Citoplazma", "Želatinasta tekočina, ki napolnjuje celico; v njej plavajo organeli in poteka veliko kemijskih reakcij.", "#f1c9b6", [citIn], [0.55, -0.5, -0.35]);

  // ---------- jedro ----------
  const RJ = 0.36, J = new THREE.Vector3(0.04, 0.0, -0.04);
  const oblJ = (d) => RJ * (1 + 0.04 * sum(d.x * 2 + 9, d.y * 2, d.z * 2));
  const jl = lupina(oblJ, q(80), q(48));
  const jMat = mat(0x7a68d8, { roughness: 0.34 });
  const jOut = new THREE.Mesh(jl.odprta, jMat);
  const nukMat = mat(0xb9a8ff, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide });
  const jIn = new THREE.Mesh(jl.odprta.clone().scale(0.95, 0.95, 0.95), nukMat);
  const jRob = new THREE.Mesh(rob(oblJ, 0.012, q(28)), jMat);
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
  del("jedro", "Jedro", "Največji organel; v njem je DNK z navodili za delovanje in delitev celice.", "#7a68d8", [jOut, jRob, jPokrov], [J.x - 0.2, J.y + 0.32, J.z + 0.12]);
  del("jedrna-ovojnica", "Jedrna ovojnica in pore", "Dvojna membrana okoli jedra; skozi jedrne pore potujejo snovi med jedrom in citoplazmo.", "#5440b0", [pore], [J.x + 0.1, J.y + 0.2, J.z + 0.32]);
  del("nukleoplazma", "Nukleoplazma", "Tekočina v notranjosti jedra, v kateri sta kromatin in jedrce.", "#b9a8ff", [jIn], [J.x - 0.12, J.y + 0.08, J.z + 0.1]);

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
  // Zrnati ER: valoviti listi okoli jedra (nadaljujejo jedrno ovojnico).
  const erGeo = [];
  const erTocke = [];
  for (let s = 0; s < 4; s++) {
    const rr = RJ + 0.07 + s * 0.055;
    const g = new THREE.SphereGeometry(rr, q(60), q(26), Math.PI * 0.62, Math.PI * 1.15, Math.PI * 0.3, Math.PI * 0.45);
    const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const d = v.clone().normalize();
      v.multiplyScalar(1 + 0.06 * Math.sin(d.x * 14 + s) * Math.cos(d.y * 11 - s * 2));
      p.setXYZ(i, v.x, v.y, v.z);
      if (i % 5 === 0) erTocke.push(v.clone());
    }
    g.computeVertexNormals();
    erGeo.push(g);
  }
  const erMat = mat(0x5b8fe0, { roughness: 0.45, side: THREE.DoubleSide });
  const zer = new THREE.Mesh(zdruzi(erGeo), erMat);
  zer.position.copy(J);
  zer.rotation.set(0.3, -0.4, 0.2);
  group.add(zer);
  zer.updateMatrix();
  del("zrnati-er", "Zrnati endoplazemski retikulum", "Sistem membranskih listov z ribosomi; v njem nastajajo beljakovine, ki gredo iz celice ali v membrane.", "#5b8fe0", [zer],
    new THREE.Vector3(-RJ - 0.12, -0.05, 0.12).applyEuler(zer.rotation).add(J).toArray());

  // Gladki ER: prepletene cevke ob zrnatem ER.
  const ger = [];
  for (let i = 0; i < (hi ? 14 : 8); i++) {
    const zac = new THREE.Vector3(-0.3 + rnd() * 0.35, 0.42 + rnd() * 0.18, -0.4 + rnd() * 0.4);
    const pts = [zac];
    for (let s = 0; s < 5; s++) pts.push(pts[s].clone().add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.14)));
    ger.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(30), 0.016, q(7), false));
  }
  const gladki = new THREE.Mesh(zdruzi(ger), mat(0x3fbfae, { roughness: 0.4 }));
  group.add(gladki);
  del("gladki-er", "Gladki endoplazemski retikulum", "Cevke brez ribosomov; v njih nastajajo maščobe in se razstrupljajo snovi.", "#3fbfae", [gladki], [-0.12, 0.55, -0.2]);

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
  del("ribosomi", "Ribosomi", "Drobna zrnca, ki po navodilih iz DNK sestavljajo beljakovine; nekateri prosto plavajo, drugi sedijo na zrnatem ER.", "#2b3f8f", [rib], [0.3, 0.55, 0.45]);

  // ---------- Golgijev aparat ----------
  const golGeo = [];
  for (let i = 0; i < 6; i++) {
    const t = new THREE.TorusGeometry(0.26 - i * 0.022, 0.016, q(10), q(48), Math.PI * (0.78 - i * 0.05));
    t.scale(1, 1, 3.2);
    t.rotateZ(Math.PI * (0.11 + i * 0.025));
    golGeo.push(t);
  }
  const vez = [];
  for (let i = 0; i < 9; i++) {
    const a = rnd() * Math.PI * 0.9, rr = 0.2 + rnd() * 0.12;
    const s = new THREE.SphereGeometry(0.022 + rnd() * 0.012, q(14), q(10));
    s.translate(Math.cos(a) * rr + 0.08, Math.sin(a) * rr, (rnd() - 0.5) * 0.12);
    vez.push(s);
  }
  const golgi = new THREE.Mesh(zdruzi(golGeo.concat(vez)), mat(0xf2c94c, { roughness: 0.35 }));
  golgi.position.set(-0.5, 0.34, 0.24);
  golgi.scale.setScalar(0.85);
  golgi.rotation.set(-0.9, -0.5, 0.6);
  group.add(golgi);
  del("golgi", "Golgijev aparat", "Kup sploščenih mešičkov; beljakovine dodela, zapakira v mehurčke in jih pošlje naprej.", "#f2c94c", [golgi], [-0.52, 0.4, 0.3]);

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
    return zdruzi([zun, not, ...kr], [0xe8743b, 0xf5a96e, ...kr.map(() => 0xffc58a)]);
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
    o.position.copy(smer); o.rotation.copy(e); o.scale.setScalar(0.85 + rnd() * 0.4); o.updateMatrix(); mit.setMatrixAt(k++, o.matrix);
  }
  group.add(mit);
  const mitT = mitPol.reduce((a, m) => (vIzrezu(m.p) || m.p.z > a.z ? m.p : a), mitPol[0].p);
  del("mitohondrij", "Mitohondrij", "Elektrarna celice: pri celičnem dihanju iz glukoze in kisika pridobi energijo (ATP). Notranja membrana je nagubana v kriste.", "#e8743b", [mit], mitT.toArray());

  // ---------- lizosomi in peroksisomi ----------
  function kroglice(n, polmer, barva, opcije, izogni) {
    const m = new THREE.InstancedMesh(new THREE.SphereGeometry(polmer, q(18), q(12)), mat(barva, opcije), n);
    const tocke = [];
    let i = 0;
    while (i < n) {
      smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).multiplyScalar(0.85);
      if (smer.length() > 0.82 || smer.distanceTo(J) < RJ + 0.12 || izogni(smer)) continue;
      tocke.push(smer.clone());
      o.position.copy(smer); o.rotation.set(0, 0, 0); o.scale.setScalar(0.75 + rnd() * 0.5); o.updateMatrix(); m.setMatrixAt(i++, o.matrix);
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
  del("citoskelet", "Citoskelet", "Mreža beljakovinskih vlaken in cevk; celici daje obliko, po njej se premikajo organeli in mehurčki.", "#c9d6f2", [cito], [-0.6, 0.35, 0.45]);

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

  return {
    group,
    deli,
    nadzor,
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
