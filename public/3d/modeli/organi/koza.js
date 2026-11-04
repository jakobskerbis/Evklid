// Koža v prerezu: kocka kože z dlačico (4 × 2,5 mm, globoka 3,6 mm). Pogodba: docs/3d.md.
//
// Mere (mm) iz učbenikov histologije (Junqueira's Basic Histology, 16. izd.; Ross & Pawlina, Histology, 8. izd.;
// Kanitakis 2002, Eur J Dermatol 12, 390): povrhnjica 0,07–0,2 mm (tu 0,2 mm), roževinasta plast 0,01–0,05 mm,
// usnjica 1–2 mm, bradavice usnjice ≈ 0,1–0,2 mm narazen, Meissnerjeva telesca 0,08–0,15 mm, Pacinijeva telesca
// ≈ 1 × 0,6 mm, klobčič žleze znojnice ≈ 0,4 mm, žleza lojnica 0,2–0,5 mm, premer dlake 0,04–0,08 mm,
// arteriole in venule 0,05–0,15 mm. Maščobne celice so narisane približno trikrat večje (v resnici 0,05–0,15 mm),
// kapilare nekoliko debelejše, da se vidijo. Kocka je odprta na sprednji in desni strani (prerez).

export const info = {
  id: "organ-koza",
  naslov: "Koža v prerezu",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Košček kože s povrhnjico, usnjico in podkožjem: dlaka z lasnim mešičkom, žlezi lojnica in znojnica, žile in čutila za dotik, pritisk in bolečino. Stikalo pokaže, kako se koža odzove na mraz in vročino. Maščobne celice so povečane.",
  merilo: { m: 0.007, oznaka: "7 mm" },
};

// Debeline plasti (mm) za preverbe v testu.
export const PLASTI = { povrhnjica: 0.2, rozevinasta: 0.05, usnjica: 1.75, podkozje: 1.65 };

// ---------------------------------------------------------------- orodja (brez uvozov)
const s01 = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// Cev s spremenljivim polmerom r(u, kot) vzdolž krivulje (vzporedni prenos okvirjev). Atribut »os« = točka na osi.
function cev(THREE, krivulja, { n = 48, rad = 12, r = () => 1, pokrovi = false } = {}) {
  const fr = krivulja.computeFrenetFrames(n, false);
  const L = krivulja.getLength();
  const pos = [], nor = [], uv = [], os = [], idx = [];
  const P = new THREE.Vector3(), D = new THREE.Vector3();
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    krivulja.getPointAt(u, P);
    const T = fr.tangents[i], N = fr.normals[i], B = fr.binormals[i];
    const u0 = Math.max(0, u - 0.002), u1 = Math.min(1, u + 0.002);
    for (let j = 0; j <= rad; j++) {
      const a = (j / rad) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      D.set(0, 0, 0).addScaledVector(N, ca).addScaledVector(B, sa);
      const rr = r(u, a);
      const dr = (r(u1, a) - r(u0, a)) / ((u1 - u0) * L);
      pos.push(P.x + D.x * rr, P.y + D.y * rr, P.z + D.z * rr);
      const nx = D.x - dr * T.x, ny = D.y - dr * T.y, nz = D.z - dr * T.z, l = Math.hypot(nx, ny, nz) || 1;
      nor.push(nx / l, ny / l, nz / l);
      uv.push(u, j / rad);
      os.push(P.x, P.y, P.z);
    }
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < rad; j++) {
    const a = i * (rad + 1) + j, b = a + rad + 1;
    idx.push(a, a + 1, b, b, a + 1, b + 1);
  }
  if (pokrovi) {
    for (const [i, s] of [[0, -1], [n, 1]]) {
      krivulja.getPointAt(i / n, P);
      const T = fr.tangents[i], c = pos.length / 3;
      pos.push(P.x, P.y, P.z); nor.push(T.x * s, T.y * s, T.z * s); uv.push(i / n, 0.5); os.push(P.x, P.y, P.z);
      const z = pos.length / 3;
      for (let j = 0; j <= rad; j++) {
        const v = i * (rad + 1) + j;
        pos.push(pos[3 * v], pos[3 * v + 1], pos[3 * v + 2]); nor.push(T.x * s, T.y * s, T.z * s); uv.push(i / n, j / rad); os.push(P.x, P.y, P.z);
      }
      for (let j = 0; j < rad; j++) if (s > 0) idx.push(c, z + j, z + j + 1); else idx.push(c, z + j + 1, z + j);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute("os", new THREE.Float32BufferAttribute(os, 3));
  g.setIndex(idx);
  return g;
}

// Cev z debelo steno (zunanja in notranja ploskev ter obroča na koncih): v prerezu se vidi poln rob.
function ljupina(THREE, krivulja, { n = 48, rad = 12, r = () => 1, debelina = 0.2 } = {}) {
  const zun = cev(THREE, krivulja, { n, rad, r });
  const not = cev(THREE, krivulja, { n, rad, r: (u, a) => Math.max(0.02, r(u, a) - (typeof debelina === "function" ? debelina(u) : debelina)) });
  const ni = not.index.array, nn = not.attributes.normal.array;
  for (let i = 0; i < ni.length; i += 3) { const t = ni[i + 1]; ni[i + 1] = ni[i + 2]; ni[i + 2] = t; }
  for (let i = 0; i < nn.length; i++) nn[i] = -nn[i];
  const fr = krivulja.computeFrenetFrames(n, false);
  const pos = [], nor = [], uv = [], os = [], idx = [];
  const zp = zun.attributes.position.array, np = not.attributes.position.array;
  for (const [i, sg] of [[0, -1], [n, 1]]) {
    const T = fr.tangents[i], b = pos.length / 3;
    for (let j = 0; j <= rad; j++) {
      const k = 3 * (i * (rad + 1) + j);
      pos.push(zp[k], zp[k + 1], zp[k + 2], np[k], np[k + 1], np[k + 2]);
      for (let m = 0; m < 2; m++) { nor.push(T.x * sg, T.y * sg, T.z * sg); uv.push(i / n, j / rad); os.push(0, 0, 0); }
    }
    for (let j = 0; j < rad; j++) {
      const a = b + 2 * j, c = a + 2;
      if (sg > 0) idx.push(a, a + 1, c, c, a + 1, c + 1); else idx.push(a, c, a + 1, c, c + 1, a + 1);
    }
  }
  const obroc = new THREE.BufferGeometry();
  obroc.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  obroc.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  obroc.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  obroc.setAttribute("os", new THREE.Float32BufferAttribute(os, 3));
  obroc.setIndex(idx);
  return zdruzi(THREE, [zun, not, obroc]);
}

// Združi geometrije (indeksirane ali ne) s skupnimi atributi v eno.
function zdruzi(THREE, geos) {
  geos = geos.filter(Boolean);
  const imena = Object.keys(geos[0].attributes).filter((k) => geos.every((g) => g.attributes[k]));
  const izhod = {}, idx = [];
  for (const k of imena) izhod[k] = [];
  let zamik = 0;
  for (const g of geos) {
    const n = g.attributes.position.count;
    for (const k of imena) { const a = g.attributes[k]; for (let i = 0; i < a.count * a.itemSize; i++) izhod[k].push(a.array[i]); }
    if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(g.index.array[i] + zamik);
    else for (let i = 0; i < n; i++) idx.push(i + zamik);
    zamik += n;
  }
  const out = new THREE.BufferGeometry();
  for (const k of imena) out.setAttribute(k, new THREE.Float32BufferAttribute(izhod[k], geos[0].attributes[k].itemSize));
  out.setIndex(idx);
  return out;
}

// Elipsoid kot geometrija (središče, polmeri, orientacija iz osi).
function elipsoidGeo(THREE, c, r, seg = 20, q = null) {
  const g = new THREE.SphereGeometry(1, seg, Math.max(8, Math.round(seg * 0.7)));
  g.scale(r[0], r[1], r[2]);
  if (q) g.applyQuaternion(q);
  g.translate(c.x, c.y, c.z);
  g.deleteAttribute("uv");
  return g;
}

// Material: zunaj fizikalni, prerezana ploskev (zadnja stran) enakomerne barve, da je videti kot poln prerez.
function kapa(THREE, p) {
  const m = new THREE.MeshPhysicalMaterial({ ...p, side: THREE.DoubleSide });
  const obc = (s) => {
    s.fragmentShader = s.fragmentShader.replace("#include <opaque_fragment>", "#include <opaque_fragment>\n\tif (!gl_FrontFacing) gl_FragColor = vec4(diffuseColor.rgb * 0.8, gl_FragColor.a);");
  };
  const klon = function () {
    const c = THREE.MeshPhysicalMaterial.prototype.clone.call(this);
    c.onBeforeCompile = obc; c.customProgramCacheKey = () => "evklid-kapa"; c.clone = klon;
    return c;
  };
  m.onBeforeCompile = obc; m.customProgramCacheKey = () => "evklid-kapa"; m.clone = klon;
  return m;
}


// ---------------------------------------------------------------- model
export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  const gibanje = ctx.gibanje !== false;
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const Y = V(0, 1, 0);
  const group = new THREE.Group();
  group.name = "organ-koza";
  const vsebina = new THREE.Group();
  group.add(vsebina);
  const geos = [], mats = [];
  const mesh = (g, m, parent = vsebina) => { geos.push(g); const o = new THREE.Mesh(g, m); parent.add(o); return o; };
  const kmat = (p) => { const m = kapa(THREE, p); mats.push(m); return m; };
  const mat = (p, Tip = THREE.MeshPhysicalMaterial) => { const m = new Tip(p); mats.push(m); return m; };

  // ---------- meje kocke in plasti (y navzgor, površje kože pri y ≈ 0)
  const X0 = -2.0, X1 = 2.0, Z0 = -1.25, Z1 = 1.25, DNO = -3.6;
  const LAMBDA = 0.22; // razmik bradavic usnjice
  const S0 = (x, z) => { const a = Math.sin((Math.PI * (x + 0.35 * Math.sin(z * 2.1))) / 0.62), b = Math.sin((Math.PI * (z * 0.8 + x * 0.55)) / 0.71); return -0.014 * (Math.exp(-(a * a) / 0.03) + Math.exp(-(b * b) / 0.03)); };
  const bradavice = (x, z) => Math.cos((2 * Math.PI * x) / LAMBDA) * Math.cos((2 * Math.PI * z) / LAMBDA);
  const S3 = (x, z) => -0.19 + 0.05 * bradavice(x, z); // meja povrhnjica / usnjica
  const S1 = (x, z) => S0(x, z) - PLASTI.rozevinasta;
  const S2 = (x, z) => S3(x, z) + 0.032; // vrh zarodne plasti
  const PAP = (x, z) => -0.45 + 0.02 * Math.sin(x * 3.1 + z * 2.3); // bradavičasta / mrežasta plast usnjice
  const DER = (x, z) => -1.95 + 0.04 * Math.sin(x * 1.7 - z * 2.2); // usnjica / podkožje

  // Zaprta plast med dvema ploskvama y = zg(x,z) in y = sp(x,z) (zgornja, spodnja ploskev in štiri stene).
  function plast(zg, sp, nx, nz, vrst = 3) {
    const deli = [];
    const mreza = (f, gor) => {
      const pos = [], idx = [];
      for (let k = 0; k <= nz; k++) for (let i = 0; i <= nx; i++) { const x = X0 + ((X1 - X0) * i) / nx, z = Z0 + ((Z1 - Z0) * k) / nz; pos.push(x, f(x, z), z); }
      for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) {
        const a = k * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
        if (gor) idx.push(a, c, b, b, c, d); else idx.push(a, b, c, b, d, c);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx); g.computeVertexNormals();
      return g;
    };
    deli.push(mreza(zg, true), mreza(sp, false));
    const stena = (n, tocka, zunaj) => {
      const pos = [], idx = [];
      for (let i = 0; i <= n; i++) {
        const [x, z] = tocka(i / n), a = zg(x, z), b = sp(x, z);
        for (let r = 0; r <= vrst; r++) pos.push(x, b + ((a - b) * r) / vrst, z);
      }
      for (let i = 0; i < n; i++) for (let r = 0; r < vrst; r++) {
        const a = i * (vrst + 1) + r, b = a + vrst + 1;
        if (zunaj) idx.push(a, b, a + 1, b, b + 1, a + 1); else idx.push(a, a + 1, b, b, a + 1, b + 1);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx); g.computeVertexNormals();
      return g;
    };
    deli.push(
      stena(nx, (t) => [X0 + (X1 - X0) * t, Z1], true),
      stena(nx, (t) => [X0 + (X1 - X0) * t, Z0], false),
      stena(nz, (t) => [X1, Z0 + (Z1 - Z0) * t], false),
      stena(nz, (t) => [X0, Z0 + (Z1 - Z0) * t], true),
    );
    return zdruzi(THREE, deli);
  }
  const fino = visoka ? [80, 50] : [44, 27], grobo = visoka ? [40, 25] : [22, 14];
  const gRoz = plast(S0, S1, ...grobo);
  const gZiv = plast(S1, S2, ...fino);
  const gZar = plast(S2, S3, ...fino);
  const gPap = plast(S3, PAP, ...fino);
  const gMre = plast(PAP, DER, ...grobo, 4);
  const gPod = plast(DER, () => DNO, ...grobo, 4);

  const kozaBarva = new THREE.Color("#e9b49b");
  const mRoz = kmat({ color: "#e8bfa4", roughness: 0.62, sheen: 0.8, sheenColor: new THREE.Color("#fff0e4"), sheenRoughness: 0.5, clearcoat: 0.12, clearcoatRoughness: 0.5 });
  const mZiv = kmat({ color: "#e7a48e", roughness: 0.5, sheen: 0.5, sheenColor: new THREE.Color("#ffd2c0") });
  const mZar = kmat({ color: "#a8654f", roughness: 0.5, sheen: 0.4, sheenColor: new THREE.Color("#e8a68c") });
  const mPap = kmat({ color: "#f4aaa4", roughness: 0.5, sheen: 0.5, sheenColor: new THREE.Color("#ffe0dc") });
  const mMre = kmat({ color: "#efbfb2", roughness: 0.55, sheen: 0.5, sheenColor: new THREE.Color("#fff2ec") });
  const mPod = kmat({ color: "#f4e2b6", roughness: 0.5, sheen: 0.6, sheenColor: new THREE.Color("#fff7d8"), clearcoat: 0.2 });
  const roz = mesh(gRoz, mRoz), ziv = mesh(gZiv, mZiv), zar = mesh(gZar, mZar), pap = mesh(gPap, mPap), mre = mesh(gMre, mMre), pod = mesh(gPod, mPod);

  // Prerez: odprta sprednja in desna stran kocke.
  const rezi = [new THREE.Plane(V(0, 0, -1), Z1 - 0.02), new THREE.Plane(V(-1, 0, 0), X1 - 0.02)];
  const svetRezi = rezi.map((p) => p.clone());

  // ---------- dlake: lasni mešiček z dlako, žleza lojnica, mišica dvigalka dlake
  const mMesicek = kmat({ color: "#e9c2a8", roughness: 0.45, sheen: 0.6, sheenColor: new THREE.Color("#fff0e6"), clearcoat: 0.3 });
  const mDlaka = kmat({ color: "#4a3022", roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  const mCebulica = kmat({ color: "#c98b78", roughness: 0.45, sheen: 0.5, sheenColor: new THREE.Color("#ffd2c4"), clearcoat: 0.3 });
  const mLojnica = kmat({ color: "#f2dc8c", roughness: 0.4, sheen: 0.6, sheenColor: new THREE.Color("#fff6cc"), clearcoat: 0.45 });
  const mMisica = kmat({ color: "#c94e4a", roughness: 0.45, sheen: 0.5, sheenColor: new THREE.Color("#ff9d92"), clearcoat: 0.3 });
  const DOLZ = 2.3; // dolžina mešička
  const dlake = [
    { x: -0.25, z: 1.18, dolz: DOLZ, nad: 1.55, glavna: true },
    { x: -1.4, z: -0.4, dolz: 1.9, nad: 1.3 },
    { x: 1.0, z: -0.75, dolz: 2.0, nad: 1.4 },
  ];
  const RAD = visoka ? 14 : 9;
  const mesicekGeo = (L) => ljupina(THREE, new THREE.LineCurve3(V(0, 0.02, 0), V(0, -L + 0.12, 0)), { n: 18, rad: RAD, r: (u) => 0.095 + 0.03 * s01(0.6, 1, u), debelina: (u) => 0.045 + 0.025 * s01(0.6, 1, u) });
  const dlakaGeo = (L, nad) => cev(THREE, new THREE.CatmullRomCurve3([V(0, -L + 0.08, 0), V(0, -L * 0.5, 0), V(0, 0, 0), V(0.01, nad * 0.5, 0), V(0.04, nad, 0)]), { n: 40, rad: visoka ? 10 : 7, r: (u) => 0.038 * (1 - 0.65 * s01(0.75, 1, u)) + 0.012 * (1 - s01(0, 0.08, u)), pokrovi: true });
  const cebulicaGeo = (L) => elipsoidGeo(THREE, V(0, -L + 0.08, 0), [0.17, 0.2, 0.17], visoka ? 22 : 14);
  const lojnicaGeo = (s) => zdruzi(THREE, [
    elipsoidGeo(THREE, V(0.2 * s, -0.55 * s, 0.02), [0.12 * s, 0.15 * s, 0.11 * s], visoka ? 18 : 12),
    elipsoidGeo(THREE, V(0.27 * s, -0.74 * s, -0.04), [0.11 * s, 0.12 * s, 0.1 * s], visoka ? 18 : 12),
    elipsoidGeo(THREE, V(0.16 * s, -0.8 * s, 0.07), [0.09 * s, 0.1 * s, 0.09 * s], visoka ? 16 : 10),
    (() => { const g = cev(THREE, new THREE.LineCurve3(V(0.14 * s, -0.5 * s, 0), V(0.03, -0.42 * s, 0)), { n: 3, rad: 8, r: () => 0.035 * s, pokrovi: true }); g.deleteAttribute("uv"); g.deleteAttribute("os"); return g; })(),
  ]);
  const kotMraz = (75 * Math.PI) / 180, kotToplo = (35 * Math.PI) / 180;
  const skupine = [];
  const mesickiM = [], dlakeM = [], lojniceM = [];
  for (const d of dlake) {
    const g = new THREE.Group();
    g.position.set(d.x, S0(d.x, d.z), d.z);
    vsebina.add(g);
    const mm = mesh(mesicekGeo(d.dolz), mMesicek, g);
    const dl = mesh(dlakaGeo(d.dolz, d.nad), mDlaka, g);
    const cb = mesh(cebulicaGeo(d.dolz), mCebulica, g);
    const sc = d.dolz / DOLZ;
    const lj = mesh(lojnicaGeo(sc), mLojnica, g);
    mesickiM.push(mm, cb); dlakeM.push(dl); lojniceM.push(lj);
    // dermalna papila (z žilico) na dnu čebulice
    if (d.glavna) d.papila = mesh(elipsoidGeo(THREE, V(0, -d.dolz + 0.02, 0), [0.06, 0.09, 0.06], 14), kmat({ color: "#d4605a", roughness: 0.45, clearcoat: 0.3 }), g);
    d.g = g;
    d.priponka = V(0.1, -1.05 * sc, 0); // pritrdišče mišice na mešičku (lokalno)
    d.misicaZg = V(d.x + 0.85 * sc, -0.32, d.z - 0.02); // drugi konec v bradavičasti plasti usnjice
    skupine.push(g);
  }
  // mišice dvigalke: cevi med mešičkom in usnjico, ob vsaki spremembi kota znova zgrajene
  const misiceMesh = new THREE.Mesh(new THREE.BufferGeometry(), mMisica);
  vsebina.add(misiceMesh);

  // ---------- žleze znojnice: klobčič globoko v usnjici, izvodilo do pore
  const mZnojnica = kmat({ color: "#a9b8f0", roughness: 0.38, sheen: 0.5, sheenColor: new THREE.Color("#e6ecff"), clearcoat: 0.45 });
  const mIzvod = kmat({ color: "#8fd0f0", roughness: 0.35, sheen: 0.5, sheenColor: new THREE.Color("#e2f6ff"), clearcoat: 0.5 });
  const znojnice = [{ c: V(1.25, -1.82, 0.92), pora: V(1.5, 0, 0.98) }, { c: V(-0.95, -1.88, -0.6), pora: V(-0.75, 0, -0.45) }];
  const klobcicGeo = [], izvodGeo = [], izvodK = [];
  for (const z of znojnice) {
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * Math.PI * 2, R = 0.16 + 0.065 * Math.cos(3 * t);
      pts.push(z.c.clone().add(V(R * Math.cos(2 * t), 0.075 * Math.sin(3 * t) + 0.03 * Math.sin(5 * t), R * Math.sin(2 * t))));
    }
    klobcicGeo.push(cev(THREE, new THREE.CatmullRomCurve3(pts, true), { n: visoka ? 220 : 130, rad: visoka ? 8 : 6, r: () => 0.036 }));
    // izvodilo: iz klobčiča navzgor skozi usnjico, skozi povrhnjico zavito kot vijak
    const zac = pts[20].clone();
    const ip = [zac, zac.clone().add(V(0.02, 0.2, 0.01)), z.c.clone().lerp(z.pora, 0.5).add(V(0, -0.65, 0)), z.pora.clone().add(V(-0.03, -0.42, 0)), z.pora.clone().add(V(0, -0.23, 0))];
    for (let i = 1; i <= 16; i++) { const f = i / 16, a = f * Math.PI * 2 * 3; ip.push(z.pora.clone().add(V(0.035 * Math.cos(a), -0.23 + 0.23 * f, 0.035 * Math.sin(a)))); }
    const k = new THREE.CatmullRomCurve3(ip);
    izvodK.push(k);
    izvodGeo.push(cev(THREE, k, { n: visoka ? 90 : 56, rad: visoka ? 8 : 6, r: () => 0.024 }));
  }
  const klobcic = mesh(zdruzi(THREE, klobcicGeo.map((g) => (g.deleteAttribute("os"), g))), mZnojnica);
  const izvodilo = mesh(zdruzi(THREE, izvodGeo.map((g) => (g.deleteAttribute("os"), g))), mIzvod);
  // kapljice znoja na porah in kapljice v izvodilih
  const NKAP = 2 + 14;
  const kapM = mat({ color: "#bfe6ff", roughness: 0.05, transmission: 0, clearcoat: 1, clearcoatRoughness: 0.05, metalness: 0, transparent: true, opacity: 0.82, sheen: 0.3 });
  const kapG = new THREE.SphereGeometry(1, visoka ? 20 : 12, visoka ? 14 : 8);
  geos.push(kapG);
  const kaplje = new THREE.InstancedMesh(kapG, kapM, NKAP);
  kaplje.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  kaplje.frustumCulled = false;
  vsebina.add(kaplje);

  // ---------- krvne žile: globoka in površinska mreža, kapilarne zanke v bradavicah
  const mArt = kmat({ color: "#d83a3a", roughness: 0.35, sheen: 0.4, sheenColor: new THREE.Color("#ff9a8a"), clearcoat: 0.55, clearcoatRoughness: 0.2 });
  const mVen = kmat({ color: "#4a6fd0", roughness: 0.35, sheen: 0.4, sheenColor: new THREE.Color("#a8c0ff"), clearcoat: 0.55, clearcoatRoughness: 0.2 });
  const mKap = mat({ color: "#ffffff", vertexColors: true, roughness: 0.4, clearcoat: 0.4 });
  const zila = (pts, r, n = visoka ? 40 : 30, rad = visoka ? 10 : 6) => cev(THREE, new THREE.CatmullRomCurve3(pts), { n, rad, r: typeof r === "function" ? r : () => r, pokrovi: true });
  const zArt = 1.0, zVen = 0.76, yGlob = -1.97, yPov = -0.53;
  const artGeo = [
    zila([V(-1.5, -3.5, 1.02), V(-1.45, -2.8, 1.03), V(-1.3, yGlob, zArt), V(0, yGlob + 0.02, zArt + 0.02), V(1.0, yGlob + 0.04, zArt), V(2.2, yGlob, zArt + 0.02)], (u) => 0.075 - 0.02 * u, 60),
    zila([V(-1.3, yGlob, zArt), V(-1.95, yGlob + 0.02, zArt - 0.02)], 0.06, 8),
  ];
  const venGeo = [
    zila([V(-1.15, -3.5, 0.72), V(-1.12, -2.8, 0.74), V(-1.0, yGlob - 0.02, zVen), V(0.2, yGlob, zVen + 0.02), V(1.15, yGlob + 0.02, zVen), V(2.2, yGlob, zVen + 0.02)], (u) => 0.095 - 0.025 * u, 60),
    zila([V(-1.0, yGlob - 0.02, zVen), V(-1.95, yGlob, zVen - 0.02)], 0.075, 8),
  ];
  for (const x of [-1.05, 0.3, 1.45]) {
    artGeo.push(zila([V(x, yGlob, zArt), V(x + 0.05, -1.3, zArt + 0.02), V(x + 0.1, yPov - 0.02, zArt)], 0.04, 24));
    artGeo.push(zila([V(x - 0.62, yPov, zArt), V(x + 0.1, yPov - 0.02, zArt), V(x + 0.62, yPov + 0.01, zArt)], 0.026, 24));
    venGeo.push(zila([V(x + 0.18, yGlob, zVen), V(x + 0.22, -1.3, zVen - 0.02), V(x + 0.26, yPov - 0.02, zVen)], 0.05, 24));
    venGeo.push(zila([V(x - 0.5, yPov, zVen), V(x + 0.26, yPov - 0.02, zVen), V(x + 0.75, yPov + 0.01, zVen)], 0.033, 24));
  }
  const arteriola = mesh(zdruzi(THREE, artGeo), mArt);
  const venula = mesh(zdruzi(THREE, venGeo), mVen);
  // kapilarne zanke v bradavicah ob sprednjem prerezu (barva od rdeče do modre)
  const zPap = 5 * LAMBDA;
  const kapGeo = [];
  const prosto = (x) => Math.abs(x - dlake[0].x - 0.15) > 0.3 && Math.abs(x - 1.5) > 0.12;
  for (let k = Math.ceil(X0 / LAMBDA); k * LAMBDA < X1 - 0.05; k++) {
    const x = k * LAMBDA;
    if (x < X0 + 0.05 || !prosto(x)) continue;
    const vrh = S3(x, zPap) - 0.03;
    const g = zila([V(x - 0.03, yPov, zArt), V(x - 0.03, -0.32, zPap - 0.04), V(x - 0.022, vrh - 0.03, zPap), V(x, vrh, zPap), V(x + 0.022, vrh - 0.03, zPap), V(x + 0.03, -0.32, zPap - 0.06), V(x + 0.04, yPov, zVen)], 0.0135, 30, visoka ? 6 : 5);
    const n = g.attributes.position.count, uv = g.attributes.uv, c = [];
    const ra = new THREE.Color("#e04848"), rv = new THREE.Color("#5f6fe0"), t = new THREE.Color();
    for (let i = 0; i < n; i++) { t.copy(ra).lerp(rv, s01(0.35, 0.75, uv.getX(i))); c.push(t.r, t.g, t.b); }
    g.setAttribute("color", new THREE.Float32BufferAttribute(c, 3));
    kapGeo.push(g);
  }
  const kapilare = mesh(zdruzi(THREE, kapGeo), mKap);
  // radialno krčenje in širjenje žil: položaj = os + (izvirni − os) · k
  const zilne = [arteriola, venula, kapilare].map((m) => ({ m, pos0: Float32Array.from(m.geometry.attributes.position.array), os: m.geometry.attributes.os.array }));

  // ---------- živci in čutila
  const mZivec = kmat({ color: "#f2d46a", roughness: 0.42, sheen: 0.5, sheenColor: new THREE.Color("#fff6c8"), clearcoat: 0.3 });
  const mProsti = mat({ color: "#ffe27a", roughness: 0.4, emissive: new THREE.Color("#ffcf40"), emissiveIntensity: 0.15, clearcoat: 0.3 });
  const mMeiss = kmat({ color: "#f1c6d8", roughness: 0.35, sheen: 0.6, sheenColor: new THREE.Color("#fff0f6"), clearcoat: 0.6 });
  const mPac = kmat({ color: "#ffffff", vertexColors: true, roughness: 0.35, sheen: 0.6, sheenColor: new THREE.Color("#fff6ee"), clearcoat: 0.7, clearcoatRoughness: 0.2 });
  const zY = -2.07, zZ = 0.5;
  const pacC = V(-0.72, -2.78, Z1), pacOs = V(0.45, 1, 0).normalize(), pacR = [0.3, 0.55];
  const meissX = [-1.32, -0.44, 0.66, 1.1].filter((x) => prosto(x) || x === 1.1);
  const zivecGeo = [
    zila([V(-1.95, zY, zZ), V(-1.0, zY + 0.03, zZ + 0.05), V(0, zY, zZ), V(1.0, zY + 0.03, zZ + 0.05), V(1.95, zY, zZ)], 0.05, 50),
    zila([V(-0.95, zY + 0.02, zZ + 0.04), V(-1.0, -2.25, 0.85), pacC.clone().addScaledVector(pacOs, -0.62), pacC.clone().addScaledVector(pacOs, -0.4)], 0.022, 24),
  ];
  for (const x of meissX) {
    const tip = V(x, S3(x, zPap) - 0.12, zPap);
    zivecGeo.push(zila([V(x - 0.15, zY + 0.02, zZ + 0.02), V(x - 0.1, -1.2, 0.8), V(x - 0.02, -0.36, zPap - 0.05), tip.clone().add(V(0, -0.05, 0))], 0.016, 30));
  }
  const prostiGeo = [];
  for (const x of [-1.7, -0.08, 0.92]) {
    const zac = V(x, zY + 0.02, zZ + 0.03), raz = V(x + 0.05, -0.36, 1.12);
    zivecGeo.push(zila([zac, V(x + 0.03, -1.2, 0.85), raz], 0.016, 30));
    for (const [dx, dz] of [[-0.06, 0.02], [0.03, 0.05], [0.07, -0.02]]) {
      const yv = S1(x + dx, 1.12 + dz) - 0.04;
      prostiGeo.push(cev(THREE, new THREE.CatmullRomCurve3([raz, V(x + 0.05 + dx * 0.5, -0.24, 1.12 + dz * 0.5), V(x + 0.05 + dx, yv - 0.06, 1.12 + dz), V(x + 0.05 + dx * 1.2, yv, 1.12 + dz)]), { n: 16, rad: 6, r: (u) => 0.011 - 0.005 * u, pokrovi: true }));
    }
  }
  const zivec = mesh(zdruzi(THREE, zivecGeo), mZivec);
  const prosti = mesh(zdruzi(THREE, prostiGeo), mProsti);
  const meissner = mesh(zdruzi(THREE, meissX.map((x) => elipsoidGeo(THREE, V(x, S3(x, zPap) - 0.1, zPap), [0.035, 0.07, 0.035], visoka ? 16 : 10))), mMeiss);
  // Pacinijevo telesce: plasti kot pri čebuli (prerezano po sredini), v sredini živčni končič
  const pacGeo = [];
  const qPac = new THREE.Quaternion().setFromUnitVectors(Y, pacOs);
  const barvePac = ["#f3e6d6", "#e6c9b4", "#f3e6d6", "#e6c9b4", "#f6ead9"];
  [1, 0.8, 0.6, 0.42, 0.25].forEach((f, i) => {
    const g = elipsoidGeo(THREE, pacC, [pacR[0] * f, pacR[1] * (0.35 + 0.65 * f), pacR[0] * f], visoka ? 32 : 20, qPac);
    const c = new THREE.Color(barvePac[i]), arr = [];
    for (let k = 0; k < g.attributes.position.count; k++) arr.push(c.r, c.g, c.b);
    g.setAttribute("color", new THREE.Float32BufferAttribute(arr, 3));
    pacGeo.push(g);
  });
  const pacini = mesh(zdruzi(THREE, pacGeo), mPac);
  const pacKoncic = mesh(cev(THREE, new THREE.LineCurve3(pacC.clone().addScaledVector(pacOs, -0.42), pacC.clone().addScaledVector(pacOs, 0.18)), { n: 6, rad: 8, r: () => 0.02, pokrovi: true }), mProsti);

  // ---------- maščobne celice v podkožju (ob prerezanih stranicah)
  const mMast = mat({ color: "#f3cf6e", roughness: 0.3, sheen: 0.5, sheenColor: new THREE.Color("#fff3c0"), clearcoat: 0.6, clearcoatRoughness: 0.18 });
  const celG = new THREE.IcosahedronGeometry(1, visoka ? 1 : 0);
  geos.push(celG);
  let seme = 7;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) / 2147483647);
  const celice = [];
  const KORAK = 0.31;
  const ovira = (p) => p.distanceTo(pacC) < 0.68 || (Math.hypot(p.x + 1.48, p.z - 1.02) < 0.24) || (Math.hypot(p.x + 1.13, p.z - 0.73) < 0.26);
  for (let y = DNO + 0.17; y < -2.08; y += KORAK * 0.86) for (let x = X0 + 0.15; x < X1; x += KORAK) for (let z = Z0 + 0.15; z < Z1; z += KORAK) {
    if (!(z > Z1 - 0.75 || x > X1 - 0.75)) continue;
    const p = V(x + (rnd() - 0.5) * 0.09, y + (rnd() - 0.5) * 0.07, z + (rnd() - 0.5) * 0.09);
    if (p.y > DER(p.x, p.z) - 0.17 || ovira(p)) continue;
    celice.push(p);
  }
  const mast = new THREE.InstancedMesh(celG, mMast, celice.length);
  {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    celice.forEach((p, i) => {
      e.set(rnd() * 6, rnd() * 6, rnd() * 6); q.setFromEuler(e);
      const r = 0.145 + rnd() * 0.03;
      m.compose(p, q, V(r * (0.9 + rnd() * 0.2), r * (0.85 + rnd() * 0.2), r * (0.9 + rnd() * 0.2)));
      mast.setMatrixAt(i, m);
    });
  }
  vsebina.add(mast);

  // ---------- postavitev v enotsko kroglo
  const box = new THREE.Box3(V(X0, DNO, Z0), V(X1, 1.6, Z1));
  const sred = box.getCenter(new THREE.Vector3());
  const R = Math.max(...[V(X0, DNO, Z0), V(X1, DNO, Z1), V(X1, DNO, Z0), V(X0, DNO, Z1), V(1.0, 1.5, Z1)].map((p) => p.distanceTo(sred)));
  const skala = 1 / R;
  vsebina.scale.setScalar(skala);
  vsebina.position.copy(sred).multiplyScalar(-skala);
  vsebina.updateMatrix();
  svetRezi.forEach((p, i) => p.copy(rezi[i]).applyMatrix4(vsebina.matrix));
  const vRezu = [mRoz, mZiv, mZar, mPap, mMre, mPod, mMesicek, mCebulica, mLojnica, mMisica, mZnojnica, mIzvod, mArt, mVen, mKap, mZivec, mProsti, mMeiss, mPac, mMast, mDlaka];
  for (const m of vRezu) m.clippingPlanes = svetRezi;
  dlake.forEach((d) => d.papila && (d.papila.material.clippingPlanes = svetRezi));
  const T = (p) => p.clone().applyMatrix4(vsebina.matrix).toArray();

  // ---------- odziv na mraz in toploto (s = 0 mrzlo, 1 toplo)
  const stanje = { cilj: 0, s: 0, t: 0 };
  const kozaMraz = new THREE.Color("#e3bba8"), kozaToplo = new THREE.Color("#efa892");
  const zivMraz = new THREE.Color("#e0a898"), zivToplo = new THREE.Color("#ee9580");
  // mehurček kurje polti okoli glavne dlake (premik zgornjih plasti)
  const zgornje = [gRoz, gZiv, gZar, gPap].map((g) => ({ g, y0: Float32Array.from(g.attributes.position.array) }));
  const polt = (x, z) => dlake.reduce((v, d) => v + Math.exp(-((x - d.x - 0.18) ** 2 + (z - d.z) ** 2) / 0.05), 0);
  const tockaMisice = { a: V(), b: V() };
  function uporabi() {
    const s = stanje.s;
    const kot = kotMraz + (kotToplo - kotMraz) * s;
    for (const d of dlake) d.g.rotation.z = kot - Math.PI / 2;
    vsebina.updateMatrixWorld(true);
    // mišice dvigalke: krajše in debelejše, ko so skrčene
    const mg = [];
    for (const d of dlake) {
      const a = d.priponka.clone().applyMatrix4(d.g.matrix), b = d.misicaZg;
      const sr = a.clone().lerp(b, 0.5).add(V(0.04, -0.06, 0));
      const g = cev(THREE, new THREE.CatmullRomCurve3([a, sr, b]), { n: 16, rad: visoka ? 10 : 7, r: (u) => (0.032 + 0.016 * (1 - s)) * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, Math.max(0, u * 1.05)))) + 0.006, pokrovi: true });
      g.deleteAttribute("os");
      mg.push(g);
      if (d.glavna) { tockaMisice.a.copy(a); tockaMisice.b.copy(b); }
    }
    misiceMesh.geometry.dispose();
    misiceMesh.geometry = zdruzi(THREE, mg);
    // kurja polt: koža okoli dlake se dvigne, ko je mrzlo
    const dv = 0.05 * (1 - s);
    for (const { g, y0 } of zgornje) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const y = y0[3 * i + 1]; if (y > -0.5) p.array[3 * i + 1] = y + dv * polt(y0[3 * i], y0[3 * i + 2]) * s01(-0.5, -0.4, y); }
      p.needsUpdate = true;
    }
    // žile: mraz zoži (0,6 ×), toplota razširi (1,35 ×)
    const k = 0.6 + 0.75 * s;
    for (const { m, pos0, os } of zilne) {
      const p = m.geometry.attributes.position.array;
      for (let i = 0; i < p.length; i++) p[i] = os[i] + (pos0[i] - os[i]) * k;
      m.geometry.attributes.position.needsUpdate = true;
    }
    mRoz.color.copy(kozaMraz).lerp(kozaToplo, s);
    mZiv.color.copy(zivMraz).lerp(zivToplo, s);
    kapljice();
  }
  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion();
  function kapljice() {
    const s = stanje.s, t = stanje.t;
    let i = 0;
    for (const z of znojnice) {
      const r = 0.13 * s01(0.4, 1, s);
      const p = z.pora.clone(); p.y = S0(p.x, p.z) + r * 0.25;
      m4.compose(p, q4, V(r * 1.15 + 1e-4, r * 0.55 + 1e-4, r * 1.15 + 1e-4));
      kaplje.setMatrixAt(i++, m4);
    }
    for (let j = 0; j < NKAP - 2; j++) {
      const z = j % 2, k = izvodK[z];
      const u = (((j >> 1) / ((NKAP - 2) / 2)) + (gibanje ? t * 0.18 : 0)) % 1;
      const p = k.getPointAt(u);
      const r = s > 0.5 ? 0.017 * s01(0.5, 1, s) : 0;
      m4.compose(p, q4, V(r + 1e-4, r + 1e-4, r + 1e-4));
      kaplje.setMatrixAt(i++, m4);
    }
    kaplje.instanceMatrix.needsUpdate = true;
    kaplje.visible = s > 0.02;
  }
  let zadnjiKorak = -1e9;
  const zdaj = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

  const deli = [
    { id: "rozevinasta", ime: "Roževinasta plast", opis: "Zgornja plast povrhnjice iz odmrlih, poroženelih celic, ki kožo varuje pred vodo, poškodbami in mikrobi.", barva: "#e8bfa4", meshes: [roz], tocka: T(V(-1.55, 0.02, -0.4)) },
    { id: "povrhnjica", ime: "Povrhnjica", opis: "Zunanja plast kože brez krvnih žil; nove celice nastajajo spodaj in se pomikajo proti površju, kjer odmrejo.", barva: "#e7a48e", meshes: [ziv], tocka: T(V(X1 - 0.02, -0.1, 0.45)) },
    { id: "zarodna", ime: "Zarodna plast", opis: "Najgloblja plast povrhnjice, kjer se celice ves čas delijo; v njej so tudi celice z barvilom melaninom.", barva: "#a8654f", meshes: [zar], tocka: T(V(-0.95, -0.17, Z1 - 0.02)) },
    { id: "usnjica", ime: "Usnjica", opis: "Debela in prožna plast iz kolagenskih in elastičnih vlaken, v kateri so žile, živci, žleze in lasni mešički.", barva: "#e9cfc4", meshes: [pap, mre], tocka: T(V(X1 - 0.02, -1.05, -0.6)) },
    { id: "podkozje", ime: "Podkožje", opis: "Najgloblja plast z maščevjem, ki telo toplotno izolira, blaži udarce in shranjuje energijo.", barva: "#f4e2b6", meshes: [pod], tocka: T(V(X1 - 0.02, -3.2, -0.9)) },
    { id: "mascobne-celice", ime: "Maščobne celice", opis: "Velike okrogle celice, ki so skoraj v celoti napolnjene s kapljico maščobe.", barva: "#f3cf6e", meshes: [mast], tocka: T(celice.reduce((b, p) => (p.z > b.z - 0.05 && Math.abs(p.x - 0.6) < Math.abs(b.x - 0.6) ? p : b), celice[0]).clone().setZ(Z1 - 0.1)) },
    { id: "dlaka", ime: "Dlaka (las)", opis: "Nitka iz poroženelih celic, ki raste iz lasnega mešička; del nad kožo je že odmrl, zato striženje ne boli.", barva: "#7a5238", meshes: dlakeM, tocka: [0, 0, 0], sledi: () => V(0, 1.0, 0).applyMatrix4(dlake[0].g.matrix) },
    { id: "lasni-mesicek", ime: "Lasni mešiček", opis: "Vdolbina povrhnjice globoko v usnjico, v kateri raste dlaka; v čebulici na dnu se celice delijo.", barva: "#e9c2a8", meshes: mesickiM, tocka: [0, 0, 0], sledi: () => V(0, -1.65, 0.05).applyMatrix4(dlake[0].g.matrix) },
    { id: "misica-dvigalka", ime: "Mišica dvigalka dlake", opis: "Drobna gladka mišica, ki se ob mrazu ali strahu skrči, dvigne dlako in naredi »kurjo polt«.", barva: "#c94e4a", meshes: [misiceMesh], tocka: [0, 0, 0], sledi: () => tockaMisice.a.clone().lerp(tockaMisice.b, 0.5) },
    { id: "lojnica", ime: "Žleza lojnica", opis: "Izloča loj, ki maže dlako in kožo, da ostaneta mehki in ne prepuščata vode.", barva: "#f2dc8c", meshes: lojniceM, tocka: [0, 0, 0], sledi: () => V(0.26, -0.68, 0.08).applyMatrix4(dlake[0].g.matrix) },
    { id: "znojnica", ime: "Žleza znojnica", opis: "Zvita cevka globoko v usnjici, ki izloča znoj; ko znoj izhlapeva, kožo ohlaja.", barva: "#a9b8f0", meshes: [klobcic], tocka: T(znojnice[0].c.clone().add(V(0.05, 0.05, 0.25))) },
    { id: "izvodilo", ime: "Izvodilo znojnice", opis: "Tanek kanalček, po katerem znoj priteče skozi poro na površje kože.", barva: "#8fd0f0", meshes: [izvodilo], tocka: T(izvodK[0].getPointAt(0.55)) },
    { id: "arteriola", ime: "Arteriola", opis: "Drobna arterija, ki v kožo prinaša kri s kisikom; ob mrazu se zoži, ob vročini razširi.", barva: "#d83a3a", meshes: [arteriola], tocka: T(V(-0.4, yGlob + 0.03, zArt + 0.05)) },
    { id: "venula", ime: "Venula", opis: "Drobna vena, ki iz kože odvaja kri z manj kisika nazaj proti srcu.", barva: "#4a6fd0", meshes: [venula], tocka: T(V(0.75, yGlob + 0.01, zVen + 0.06)) },
    { id: "kapilare", ime: "Kapilare", opis: "Najtanjše žile, ki v zankah segajo v bradavice usnjice in celicam oddajajo kisik in hranila.", barva: "#e04848", meshes: [kapilare], tocka: T(V(-0.66, -0.3, zPap)) },
    { id: "zivec", ime: "Živec", opis: "Snop živčnih vlaken, ki signale čutil v koži vodi v hrbtenjačo in možgane.", barva: "#f2d46a", meshes: [zivec], tocka: T(V(0.4, zY + 0.02, zZ + 0.06)) },
    { id: "meissner", ime: "Meissnerjevo telesce", opis: "Čutilo za rahel dotik v bradavicah usnjice; največ jih je v blazinicah prstov in na ustnicah.", barva: "#f1c6d8", meshes: [meissner], tocka: T(V(meissX[1], S3(meissX[1], zPap) - 0.1, zPap)) },
    { id: "pacini", ime: "Pacinijevo telesce", opis: "Veliko čutilo iz mnogih plasti kot pri čebuli, ki zazna močan pritisk in tresljaje.", barva: "#e6c9b4", meshes: [pacini, pacKoncic], tocka: T(pacC.clone()) },
    { id: "prosti-koncici", ime: "Prosti živčni končiči", opis: "Goli končiči živčnih vlaken, ki segajo v povrhnjico in zaznavajo bolečino, toploto in mraz.", barva: "#ffe27a", meshes: [prosti], tocka: T(V(-0.03, -0.16, 1.15)) },
  ];
  const sledi = deli.filter((d) => d.sledi);
  const posodobiTocke = () => { for (const d of sledi) d.tocka.splice(0, 3, ...T(d.sledi())); };

  const nadzor = [
    { tip: "stikalo", id: "toplo", oznaka: "Mrzlo / toplo", vrednost: false, ob: (v) => {
      stanje.cilj = v ? 1 : 0;
      if (!gibanje || zdaj() - zadnjiKorak > 400) { stanje.s = stanje.cilj; uporabi(); posodobiTocke(); }
    } },
    { tip: "izpis", id: "stanje", oznaka: "Koža", vrednost: () => (stanje.cilj ? "toplo: znojnice izločajo znoj, žile se razširijo, koža oddaja več toplote" : "mrzlo: dlake se dvignejo (kurja polt), žile se zožijo, koža oddaja manj toplote") },
  ];
  const zac = ctx.zacetek || {};
  if (zac.toplo === true || zac.toplo === "true" || zac.toplo === "1") { nadzor[0].vrednost = true; stanje.cilj = stanje.s = 1; }
  uporabi();
  posodobiTocke();

  return {
    group,
    deli,
    nadzor,
    merilo: { m: (2 / skala) / 1000, oznaka: `${String(Math.round((20 / skala)) / 10).replace(".", ",")} mm` },
    korak(t, dt) {
      zadnjiKorak = zdaj();
      stanje.t += Math.min(dt, 0.1);
      if (Math.abs(stanje.s - stanje.cilj) > 1e-3) {
        const d = Math.min(dt, 0.1) / 1.4;
        stanje.s += Math.sign(stanje.cilj - stanje.s) * Math.min(d, Math.abs(stanje.cilj - stanje.s));
        uporabi();
        posodobiTocke();
      } else if (stanje.s > 0.5) kapljice();
    },
    dispose() {
      misiceMesh.geometry.dispose();
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
    },
  };
}
