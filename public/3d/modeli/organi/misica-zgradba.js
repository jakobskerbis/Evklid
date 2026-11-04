// Zgradba skeletne mišice v petih ravneh: mišica s kitama → mišični snop → mišično vlakno → miofibrila → sarkomera.
// Pogodba: docs/3d.md. Model mišičnega vlakna kot celice je v področju »celice«; tu je zgradba organa.
//
// Mere: mišica (podobna dvoglavi nadlaktni) ≈ 30 cm s kitama, trebuh ≈ 5,5 cm debel; snop ≈ 1 mm; vlakno ≈ 80 µm
// (premer 10–100 µm, jedra ob robu ≈ 12 × 4 µm); miofibrila ≈ 1 µm; sarkomera 2,0–2,5 µm, debeli (miozinski)
// filament 1,6 µm, tanki (aktinski) ≈ 1,0 µm od Z-črte, razmik debelih filamentov ≈ 42 nm (Huxley in Hanson 1954;
// Gordon, Huxley in Julian 1966, J Physiol 184, 170; Alberts, Molecular Biology of the Cell, 7. izd.).
// Poenostavitve: v snopu in vlaknu je manj vlaken in miofibril kot v resnici, miofibrile so nekoliko debelejše;
// v sarkomeri so razmiki med filamenti in njihova debelina povečani petkrat, dolžine pa so prave.

export const info = {
  id: "organ-misica-zgradba",
  naslov: "Zgradba skeletne mišice",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Od mišice s kitama do sarkomere v petih korakih povečave. Drsnik »Krčenje« skrajša sarkomere: aktinski filamenti zdrsnejo med miozinske, dolžina filamentov pa ostane enaka. V sarkomeri so razmiki med filamenti povečani.",
  merilo: { m: 0.256, oznaka: "26 cm" },
};

// Dolžine v µm (za test): debeli filament, tanki filament, sarkomera sproščena in skrčena.
export const SARKOMERA = { debeli: 1.6, tanki: 1.0, Lsprosceno: 2.5, Lskrceno: 2.0 };
export const dolzinaSarkomere = (k) => SARKOMERA.Lsprosceno - (SARKOMERA.Lsprosceno - SARKOMERA.Lskrceno) * Math.min(1, Math.max(0, k));
export function pasovi(L) {
  return { A: SARKOMERA.debeli, I: L - SARKOMERA.debeli, H: Math.max(0, L - 2 * SARKOMERA.tanki), prekrivanje: Math.max(0, SARKOMERA.tanki - (L - SARKOMERA.debeli) / 2) };
}

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


// Progast vzorec sarkomer po osi x (v koordinatah predmeta): Z-črta, pas I, pas A s svetlejšim območjem H in M-črto.
function progeMat(THREE, p, uni, odmik, rez = false) {
  const m = new THREE.MeshPhysicalMaterial({ ...p, side: rez ? THREE.DoubleSide : THREE.FrontSide });
  const u = { uL: uni, uOdmik: { value: odmik } };
  const obc = (s) => {
    s.uniforms.uL = u.uL; s.uniforms.uOdmik = u.uOdmik;
    s.vertexShader = s.vertexShader.replace("#include <common>", "#include <common>\nvarying float vOsX;").replace("#include <begin_vertex>", "#include <begin_vertex>\n#ifdef USE_INSTANCING\n\tvOsX = (instanceMatrix * vec4(position, 1.0)).x;\n#else\n\tvOsX = position.x;\n#endif");
    s.fragmentShader = s.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vOsX;\nuniform float uL;\nuniform float uOdmik;").replace("#include <color_fragment>", `#include <color_fragment>
	{
		float L = uL;
		float xx = mod(vOsX - uOdmik, L);
		float zd = min(xx, L - xx);
		float md = abs(xx - 0.5 * L);
		float w = max(fwidth(vOsX), 1e-4);
		float aPas = 1.0 - smoothstep(0.8 - w, 0.8 + w, md);
		float hPas = 1.0 - smoothstep(max(0.0, 0.5 * L - 1.0) - w, max(0.0, 0.5 * L - 1.0) + w, md);
		float zCrta = 1.0 - smoothstep(0.035 - w, 0.035 + w, zd);
		float mCrta = 1.0 - smoothstep(0.02 - w, 0.02 + w, md);
		// pas A temen (miozin), pas I svetel (samo aktin), območje H nekoliko svetlejše, črti Z in M temni
		float f = 1.0 - 0.56 * aPas + 0.2 * hPas * aPas - 0.16 * mCrta - 0.62 * zCrta;
		diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.94, 0.93), 0.3 * (1.0 - aPas) * (1.0 - zCrta)) * f;
	}`);
    if (rez) s.fragmentShader = s.fragmentShader.replace("#include <opaque_fragment>", "#include <opaque_fragment>\n\tif (!gl_FrontFacing) gl_FragColor = vec4(diffuseColor.rgb * 0.8, gl_FragColor.a);");
  };
  const kljuc = rez ? "evklid-proge-kapa" : "evklid-proge";
  const klon = function () { const c = THREE.MeshPhysicalMaterial.prototype.clone.call(this); c.onBeforeCompile = obc; c.customProgramCacheKey = () => kljuc; c.clone = klon; c.userData.proge = u; return c; };
  m.onBeforeCompile = obc; m.customProgramCacheKey = () => kljuc; m.clone = klon; m.userData.proge = u;
  return m;
}

// Voronojeve celice v krogu (polmer 1): konveksni mnogokotniki, skrčeni za režo in zaobljeni.
function celiceKroga(n, reza, seme, rob = 0.97) {
  let s = seme;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  let tocke = [];
  while (tocke.length < n) { const x = rnd() * 2 - 1, y = rnd() * 2 - 1; if (x * x + y * y < 0.85) tocke.push([x, y]); }
  const obod = Array.from({ length: 48 }, (_, i) => [rob * Math.cos((i / 48) * Math.PI * 2), rob * Math.sin((i / 48) * Math.PI * 2)]);
  const celica = (i) => {
    let poly = obod;
    const [px, py] = tocke[i];
    for (let j = 0; j < tocke.length; j++) {
      if (j === i) continue;
      const [qx, qy] = tocke[j], nx = qx - px, ny = qy - py, c = (qx * qx + qy * qy - px * px - py * py) / 2;
      const out = [];
      for (let k = 0; k < poly.length; k++) {
        const a = poly[k], b = poly[(k + 1) % poly.length];
        const da = a[0] * nx + a[1] * ny - c, db = b[0] * nx + b[1] * ny - c;
        if (da <= 0) out.push(a);
        if ((da < 0) !== (db < 0)) { const t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
      }
      poly = out;
    }
    return poly;
  };
  for (let it = 0; it < 4; it++) tocke = tocke.map((_, i) => { const p = celica(i); return [p.reduce((a, q) => a + q[0], 0) / p.length, p.reduce((a, q) => a + q[1], 0) / p.length]; });
  return tocke.map((_, i) => {
    let p = celica(i);
    const cx = p.reduce((a, q) => a + q[0], 0) / p.length, cy = p.reduce((a, q) => a + q[1], 0) / p.length;
    const vel = Math.sqrt(p.reduce((a, q) => a + (q[0] - cx) ** 2 + (q[1] - cy) ** 2, 0) / p.length);
    const f = Math.max(0.3, 1 - reza / vel);
    p = p.map((q) => [cx + (q[0] - cx) * f, cy + (q[1] - cy) * f]);
    for (let r = 0; r < 2; r++) { const o = []; for (let k = 0; k < p.length; k++) { const a = p[k], b = p[(k + 1) % p.length]; o.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } p = o; }
    return { p, c: [cx, cy], vel };
  });
}

// Zaprta prizma vzdolž x: prerez poly (y, z) pomnožen s skala(x), od x0 do x1.
function prizma(THREE, poly, x0, x1, skala, n = 24) {
  const m = poly.length, pos = [], idx = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n, s = skala(x);
    for (const [y, z] of poly) pos.push(x, y * s, z * s);
  }
  for (let i = 0; i < n; i++) for (let k = 0; k < m; k++) {
    const a = i * m + k, b = i * m + ((k + 1) % m), c = a + m, d = b + m;
    idx.push(a, b, c, b, d, c);
  }
  const plasc = new THREE.BufferGeometry();
  plasc.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  plasc.setIndex(idx); plasc.computeVertexNormals();
  const pok = [];
  for (const [x, sg] of [[x0, -1], [x1, 1]]) {
    const s = skala(x), p = [], ii = [];
    const cy = poly.reduce((a, q) => a + q[0], 0) / m, cz = poly.reduce((a, q) => a + q[1], 0) / m;
    p.push(x, cy * s, cz * s);
    for (const [y, z] of poly) p.push(x, y * s, z * s);
    for (let k = 0; k < m; k++) { const a = 1 + k, b = 1 + ((k + 1) % m); if (sg > 0) ii.push(0, b, a); else ii.push(0, a, b); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    g.setIndex(ii); g.computeVertexNormals();
    pok.push(g);
  }
  return zdruzi(THREE, [plasc, ...pok]);
}

// ---------------------------------------------------------------- model
export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  const gibanje = ctx.gibanje !== false;
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const X = V(1, 0, 0);
  const group = new THREE.Group();
  group.name = "organ-misica-zgradba";
  const geos = [], mats = [];
  const mesh = (g, m, parent) => { geos.push(g); const o = new THREE.Mesh(g, m); parent.add(o); return o; };
  const kmat = (p, nivo) => { const m = kapa(THREE, p); mats.push(m); nivo.mats.push(m); return m; };
  const mat = (p, nivo, Tip = THREE.MeshPhysicalMaterial) => { const m = new Tip(p); mats.push(m); nivo.mats.push(m); return m; };
  const uL = { value: SARKOMERA.Lsprosceno };
  let L = SARKOMERA.Lsprosceno;
  const nivoji = Array.from({ length: 5 }, () => ({ g: new THREE.Group(), vsebina: new THREE.Group(), mats: [], deli: [], skala: 1, enota: 1, fokus: V(0, 0, 0) }));
  for (const n of nivoji) n.g.add(n.vsebina);
  let seme = 3;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) / 2147483647);
  const RAD = visoka ? 16 : 10;
  const T = (n, p) => p.clone().applyMatrix4(n.vsebina.matrix).toArray();

  // ================================================================ 1. mišica s kitama (cm)
  const n1 = nivoji[0];
  n1.enota = 0.01;
  const xr = 9.2, Rmax = 2.75;
  const profil = (x) => Math.max(0.42, Rmax * Math.pow(Math.max(0, 1 - (x / xr) ** 2), 0.7));
  const x0rez = 1.6;
  const trebuh1 = new THREE.Group();
  n1.vsebina.add(trebuh1);
  // ovojnica mišice (epimizij): lupina z debelino
  const mEpi = kmat({ color: "#b8484a", roughness: 0.42, sheen: 0.8, sheenColor: new THREE.Color("#ffb0a8"), sheenRoughness: 0.4, clearcoat: 0.45, clearcoatRoughness: 0.25 }, n1);
  const epiG = ljupina(THREE, new THREE.LineCurve3(V(-xr - 0.2, 0, 0), V(xr + 0.2, 0, 0)), { n: visoka ? 70 : 40, rad: visoka ? 48 : 28, r: (u) => profil(-xr - 0.2 + u * (2 * xr + 0.4)), debelina: 0.13 });
  const epimizij = mesh(epiG, mEpi, trebuh1);
  // vezivo med snopi (perimizij) zapolni notranjost ovojnice
  const mPeri = kmat({ color: "#efd9cf", roughness: 0.5, sheen: 0.5, sheenColor: new THREE.Color("#fff3ee") }, n1);
  const periG = cev(THREE, new THREE.LineCurve3(V(-xr - 0.15, 0, 0), V(xr + 0.15, 0, 0)), { n: visoka ? 60 : 36, rad: visoka ? 40 : 24, r: (u) => profil(-xr - 0.15 + u * (2 * xr + 0.3)) - 0.15, pokrovi: true });
  const perimizij = mesh(periG, mPeri, trebuh1);
  // mišični snopi: Voronojeve celice prereza, raztegnjene po trebuhu; spredaj nad prerezom izstopajo različno daleč
  const snopi = celiceKroga(visoka ? 26 : 18, 0.045, 17, 0.9);
  const mSnop = kmat({ color: "#c2363d", roughness: 0.42, sheen: 0.7, sheenColor: new THREE.Color("#ff9e96"), clearcoat: 0.35, clearcoatRoughness: 0.3 }, n1);
  const skalaSnop = (x) => profil(x) - 0.17;
  const zadaj = [], spredaj = [];
  let fokus1 = V(x0rez + 1, 0, 0), naj = -1;
  for (const s of snopi) {
    const front = s.c[1] > 0.05;
    if (front) {
      const konec = x0rez + 0.25 + rnd() * 1.3;
      spredaj.push(prizma(THREE, s.p, -xr, konec, skalaSnop, visoka ? 34 : 20));
      const r = Math.hypot(s.c[0], s.c[1]);
      if (konec > naj && r > 0.35) { naj = konec; fokus1 = V(konec, s.c[0] * skalaSnop(konec), s.c[1] * skalaSnop(konec)); }
    } else zadaj.push(prizma(THREE, s.p, -xr, xr, skalaSnop, visoka ? 40 : 24));
  }
  const snopiZadaj = mesh(zdruzi(THREE, zadaj), mSnop, trebuh1);
  const mSnopS = kmat({ color: "#c2363d", roughness: 0.42, sheen: 0.7, sheenColor: new THREE.Color("#ff9e96"), clearcoat: 0.35, clearcoatRoughness: 0.3 }, n1);
  const snopiSpredaj = mesh(zdruzi(THREE, spredaj), mSnopS, trebuh1);
  // kiti: čvrsti, svetleči
  const mKita = kmat({ color: "#e9e3d6", roughness: 0.28, sheen: 0.7, sheenColor: new THREE.Color("#ffffff"), clearcoat: 0.7, clearcoatRoughness: 0.2 }, n1);
  const kitaG = (smer) => {
    const a = V(smer * (xr - 1.2), 0, 0), b = V(smer * (xr + 2.4), 0.08 * smer, 0), c = V(smer * (xr + 5.6), 0.25 * smer, 0.1);
    return cev(THREE, new THREE.CatmullRomCurve3([a, b, c]), { n: visoka ? 30 : 18, rad: RAD, r: (u, ang) => (0.62 - 0.12 * u) * (1 + 0.28 * Math.cos(2 * ang)), pokrovi: true });
  };
  const kitaL = mesh(kitaG(-1), mKita, n1.vsebina), kitaD = mesh(kitaG(1), mKita, n1.vsebina);
  n1.rez = [new THREE.Plane(V(-1, 0, 0), x0rez), new THREE.Plane(V(0, 0, -1), 0)];
  n1.fokus0 = fokus1;
  n1.deli = [
    { id: "kita", ime: "Kita", opis: "Čvrst trak iz kolagenskih vlaken, ki mišico pritrdi na kost in nanjo prenese silo.", barva: "#e9e3d6", meshes: [kitaL, kitaD], mm: V(-xr - 3.2, -0.15, 0.6) },
    { id: "ovojnica-misice", ime: "Ovojnica mišice", opis: "Plast čvrstega veziva, ki obdaja celo mišico in jo loči od sosednjih mišic.", barva: "#b8484a", meshes: [epimizij], mm: V(-3.5, 1.2, Rmax * 0.95) },
    { id: "snopi", ime: "Mišični snopi", opis: "Mišica je sestavljena iz snopov; vsak snop je skupina mišičnih vlaken v svoji ovojnici.", barva: "#c2363d", meshes: [snopiSpredaj, snopiZadaj], mm: V(x0rez + 0.6, 0.6, 1.2) },
    { id: "vezivo-snopov", ime: "Ovojnice snopov", opis: "Vezivo med snopi, po katerem do mišičnih vlaken potekajo žile in živci.", barva: "#efd9cf", meshes: [perimizij], mm: V(x0rez, -1.3, 0.25) },
  ];

  // ================================================================ 2. mišični snop (mm)
  const n2 = nivoji[1];
  n2.enota = 0.001;
  const RS = 0.5, XS = 1.6, x2rez = 0.45;
  const trebuh2 = new THREE.Group();
  n2.vsebina.add(trebuh2);
  const mPeri2 = kmat({ color: "#eedbd2", roughness: 0.45, sheen: 0.6, sheenColor: new THREE.Color("#fff3ee"), clearcoat: 0.25 }, n2);
  const ovoj2 = mesh(ljupina(THREE, new THREE.LineCurve3(V(-XS, 0, 0), V(XS, 0, 0)), { n: 8, rad: visoka ? 48 : 28, r: (u, a) => RS * (1 + 0.06 * Math.cos(3 * a) + 0.04 * Math.sin(5 * a)), debelina: 0.035 }), mPeri2, trebuh2);
  const mEndo = kmat({ color: "#f3e3dc", roughness: 0.5, sheen: 0.5, sheenColor: new THREE.Color("#fff6f2") }, n2);
  const endo = mesh(cev(THREE, new THREE.LineCurve3(V(-XS + 0.04, 0, 0), V(XS - 0.04, 0, 0)), // krajše od vlaken: na koncih se vidijo prerezana vlakna
     { n: 4, rad: visoka ? 40 : 24, r: (u, a) => RS * (1 + 0.06 * Math.cos(3 * a) + 0.04 * Math.sin(5 * a)) - 0.036, pokrovi: true }), mEndo, trebuh2);
  const vlakna = celiceKroga(visoka ? 46 : 30, 0.022, 29, 0.88);
  const mVl = kmat({ color: "#c73a40", roughness: 0.4, sheen: 0.7, sheenColor: new THREE.Color("#ffa49c"), clearcoat: 0.4, clearcoatRoughness: 0.28 }, n2);
  const vz = [], vs = [];
  let fokus2 = V(x2rez + 0.3, 0, 0), naj2 = -1;
  for (const s of vlakna) {
    const sk = () => RS - 0.04;
    if (s.c[1] > 0.04) {
      const konec = x2rez + 0.08 + rnd() * 0.55;
      vs.push(prizma(THREE, s.p, -XS + 0.02, konec, sk, 2));
      if (konec > naj2 && Math.hypot(...s.c) > 0.3 && Math.hypot(...s.c) < 0.7) { naj2 = konec; fokus2 = V(konec, s.c[0] * sk(), s.c[1] * sk()); }
    } else vz.push(prizma(THREE, s.p, -XS + 0.02, XS - 0.02, sk, 2));
  }
  const vlaknaZ = mesh(zdruzi(THREE, vz), mVl, trebuh2);
  const mVlS = kmat({ color: "#c73a40", roughness: 0.4, sheen: 0.7, sheenColor: new THREE.Color("#ffa49c"), clearcoat: 0.4, clearcoatRoughness: 0.28 }, n2);
  const vlaknaS = mesh(zdruzi(THREE, vs), mVlS, trebuh2);
  // kapilare v vezivu med vlakni (v ogliščih celic)
  const kapPts = [];
  for (const s of vlakna) for (const q of s.p.filter((_, i) => i % 6 === 0)) { const r = Math.hypot(q[0], q[1]); if (r < 0.86 && !kapPts.some((o) => Math.hypot(o[0] - q[0], o[1] - q[1]) < 0.12)) kapPts.push(q); }
  const mKap2 = kmat({ color: "#d9353b", roughness: 0.35, clearcoat: 0.6 }, n2);
  const kapG2 = kapPts.slice(0, visoka ? 22 : 12).map((q) => {
    const sk = RS - 0.04, y = q[0] * sk, z = q[1] * sk;
    const g = cev(THREE, new THREE.CatmullRomCurve3([V(-XS + 0.03, y, z), V(-0.5, y + 0.006, z - 0.004), V(0.6, y - 0.005, z + 0.004), V(XS - 0.03, y, z)]), { n: 16, rad: 6, r: () => 0.0065, pokrovi: true });
    g.deleteAttribute("os");
    return g;
  });
  const kapilare2 = mesh(zdruzi(THREE, kapG2), mKap2, trebuh2);
  n2.rez = [new THREE.Plane(V(-1, 0, 0), x2rez), new THREE.Plane(V(0, 0, -1), 0)];
  n2.rezLevo = new THREE.Plane(X.clone(), XS - 0.06);
  n2.fokus0 = fokus2;
  n2.deli = [
    { id: "ovojnica-snopa", ime: "Ovojnica snopa", opis: "Vezivna ovojnica, ki skupaj drži več deset do več sto mišičnih vlaken.", barva: "#eedbd2", meshes: [ovoj2], mm: V(-0.6, 0.15, RS * 1.02) },
    { id: "vlakna", ime: "Mišična vlakna", opis: "Dolge mišične celice, ki se lahko skrčijo; v enem snopu jih je veliko vzporedno.", barva: "#c73a40", meshes: [vlaknaS, vlaknaZ], mm: V(x2rez + 0.25, 0.12, 0.2) },
    { id: "vezivo-vlaken", ime: "Vezivo med vlakni", opis: "Tanka plast veziva okoli vsakega vlakna, v kateri so kapilare in živčna vlakna.", barva: "#f3e3dc", meshes: [endo], mm: V(x2rez, -0.3, 0.01) },
    { id: "kapilare", ime: "Kapilare", opis: "Najtanjše žile med vlakni, ki mišičnim celicam prinašajo kisik in glukozo.", barva: "#d9353b", meshes: [kapilare2], mm: V(-0.9, kapPts[0][0] * (RS - 0.04), kapPts[0][1] * (RS - 0.04)) },
  ];

  // ================================================================ 3. mišično vlakno (µm)
  const n3 = nivoji[2];
  n3.enota = 1e-6;
  const RV = 40, XV = 110, x3rez = 22;
  const vlakno3 = new THREE.Group();
  n3.vsebina.add(vlakno3);
  const mSarko = progeMat(THREE, { color: "#d0565a", roughness: 0.38, sheen: 0.7, sheenColor: new THREE.Color("#ffb4ac"), clearcoat: 0.45, clearcoatRoughness: 0.25 }, uL, 0, true);
  mats.push(mSarko); n3.mats.push(mSarko);
  const sarkolema = mesh(ljupina(THREE, new THREE.LineCurve3(V(-XV, 0, 0), V(XV, 0, 0)), { n: 6, rad: visoka ? 56 : 32, r: () => RV, debelina: 1.2 }), mSarko, vlakno3);
  // jedra: podolgovata, tik pod sarkolemo (vlakno je ena celica z mnogo jedri)
  const mJedro = kmat({ color: "#6d4fb3", roughness: 0.35, sheen: 0.5, sheenColor: new THREE.Color("#c8b4ff"), clearcoat: 0.5 }, n3);
  const jedraG = [];
  for (let i = 0; i < (visoka ? 34 : 22); i++) {
    const x = -XV + 8 + ((2 * XV - 16) * (i + rnd() * 0.6)) / (visoka ? 34 : 22);
    const a = rnd() * Math.PI * 2;
    if (a > 0.1 && a < Math.PI - 0.1 && x > x3rez - 8) continue; // ne v izrezu
    const g = elipsoidGeo(THREE, V(x, (RV - 1.6) * Math.cos(a), (RV - 1.6) * Math.sin(a)), [6.5, 2.2, 2.2], visoka ? 16 : 10, new THREE.Quaternion().setFromAxisAngle(X, a));
    jedraG.push(g);
  }
  const jedra = mesh(zdruzi(THREE, jedraG), mJedro, vlakno3);
  // miofibrile: šesterokotno zložene, v register poravnane (zato je vlakno progasto)
  const mMio = progeMat(THREE, { color: "#d96a6c", roughness: 0.36, sheen: 0.6, sheenColor: new THREE.Color("#ffc2bc"), clearcoat: 0.4 }, uL, 0);
  mats.push(mMio); n3.mats.push(mMio);
  const RM = 1.7, DM = 3.9;
  const mioG = new THREE.CylinderGeometry(RM, RM, 2 * XV - 2, visoka ? 10 : 7, 1, false);
  mioG.rotateZ(Math.PI / 2);
  geos.push(mioG);
  const mioPoz = [];
  for (let i = -12; i <= 12; i++) for (let j = -12; j <= 12; j++) {
    const y = (i + j * 0.5) * DM, z = j * DM * 0.866;
    if (Math.hypot(y, z) > RV - 3.2) continue;
    // spredaj (z > 0) miofibrile segajo čez rez za nekaj celih sarkomer; zadaj tečejo do konca vlakna
    const x1 = z > 1 ? x3rez + Math.round((0.8 + rnd() * 9) / 2.5) * 2.5 : XV - 1;
    mioPoz.push([x1, y, z]);
  }
  const miofibrile3 = new THREE.InstancedMesh(mioG, mMio, mioPoz.length);
  {
    const m = new THREE.Matrix4();
    const x0 = -XV + 1, d0 = 2 * XV - 2;
    mioPoz.forEach(([x1, y, z], i) => { m.makeScale((x1 - x0) / d0, 1, 1); m.setPosition((x0 + x1) / 2, y, z); miofibrile3.setMatrixAt(i, m); });
  }
  vlakno3.add(miofibrile3);
  const fokus3 = (() => { const p = mioPoz.filter((q) => q[2] > 6 && Math.abs(q[1]) < 12).sort((a, b) => b[0] - a[0])[0] || [0, 0, 10]; return V(p[0], p[1], p[2]); })();
  n3.rez = [new THREE.Plane(V(-1, 0, 0), x3rez), new THREE.Plane(V(0, 0, -1), 0)];
  n3.rezLevo = new THREE.Plane(X.clone(), XV - 2);
  n3.rezDesno = new THREE.Plane(V(-1, 0, 0), XV);
  n3.fokus0 = fokus3;
  n3.deli = [
    { id: "sarkolema", ime: "Sarkolema", opis: "Celična membrana mišičnega vlakna; po njej se širi električni signal iz živca, ki sproži krčenje.", barva: "#d0565a", meshes: [sarkolema], mm: V(-55, RV * 0.5, RV * 0.87) },
    { id: "jedra", ime: "Jedra", opis: "Mišično vlakno je ena sama dolga celica z mnogo jedri, ki ležijo tik pod membrano.", barva: "#6d4fb3", meshes: [jedra], mm: (() => { const p = jedraG[2].attributes.position; return V(p.getX(0), 0, 0).add(V(0, 0, 0)); })() },
    { id: "miofibrile", ime: "Miofibrile", opis: "Tanke nitke, ki zapolnjujejo vlakno; svetli in temni pasovi sosednjih miofibril se ujemajo, zato je mišica progasta.", barva: "#d96a6c", meshes: [miofibrile3], mm: V(x3rez + 4, 8, 14) },
  ];
  {
    // točka jeder: na najbližjem jedru, ki ga vidimo spredaj zgoraj
    let best = null;
    for (const g of jedraG) {
      g.computeBoundingSphere();
      const c = g.boundingSphere.center;
      if (c.z > 5 && (!best || c.y > best.y)) best = c.clone();
    }
    if (best) n3.deli[1].mm = best.multiplyScalar(1.02);
    else n3.deli[1].mm = V(-60, RV, 0);
  }

  // ================================================================ 4. miofibrile (µm)
  const n4 = nivoji[3];
  n4.enota = 1e-6;
  const RF = 0.5, NSAR = 4;
  const mFib = progeMat(THREE, { color: "#e0777a", roughness: 0.35, sheen: 0.6, sheenColor: new THREE.Color("#ffc8c2"), clearcoat: 0.45, clearcoatRoughness: 0.25 }, uL, 0);
  mats.push(mFib); n4.mats.push(mFib);
  const fibG = new THREE.CylinderGeometry(RF, RF, 1, visoka ? 28 : 16, 1, false);
  fibG.rotateZ(Math.PI / 2);
  geos.push(fibG);
  const fibPoz = [[0, 0, 0.0], ...Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + 0.3; return [-1, 1.25 * Math.cos(a), 1.25 * Math.sin(a) - 0.25]; })].filter((p) => p[2] < 0.6);
  const fibrile = new THREE.InstancedMesh(fibG, mFib, fibPoz.length);
  n4.vsebina.add(fibrile);
  // Z-črte na sredinski miofibrili (tanke ploščice, ki se premikajo s krčenjem)
  const mZ4 = kmat({ color: "#3b2a55", roughness: 0.4, clearcoat: 0.3 }, n4);
  const zG4 = new THREE.CylinderGeometry(RF * 1.04, RF * 1.04, 0.07, visoka ? 28 : 16);
  zG4.rotateZ(Math.PI / 2);
  geos.push(zG4);
  const zcrte4 = new THREE.InstancedMesh(zG4, mZ4, NSAR + 1);
  n4.vsebina.add(zcrte4);
  // oklepaji pasov pod miofibrilo: sarkomera, pas A, pas I
  const mOkl = (c) => kmat({ color: c, roughness: 0.4, clearcoat: 0.3 }, n4);
  const oklG = new THREE.BoxGeometry(1, 0.1, 0.1);
  geos.push(oklG);
  const oklS = mesh(oklG, mOkl("#f3f0e8"), n4.vsebina), oklA = mesh(oklG, mOkl("#8d6fe0"), n4.vsebina), oklI1 = mesh(oklG, mOkl("#9fd7f2"), n4.vsebina), oklI2 = mesh(oklG, mOkl("#9fd7f2"), n4.vsebina);
  const yOkl = -1.9, zOkl = 0.75; // pod snopom in pred njim, da jih miofibrile ne zakrijejo
  const n4dol = () => NSAR * L;
  function postaviN4() {
    const m = new THREE.Matrix4(), Ld = n4dol();
    fibPoz.forEach(([dx, y, z], i) => { m.makeScale(Ld + (i ? -0.2 : 0), 1, 1); m.setPosition(dx * 0 + (i ? -0.1 : 0), y, z); fibrile.setMatrixAt(i, m); });
    fibrile.instanceMatrix.needsUpdate = true;
    for (let k = 0; k <= NSAR; k++) { m.makeTranslation(-Ld / 2 + k * L, 0, 0); zcrte4.setMatrixAt(k, m); }
    zcrte4.instanceMatrix.needsUpdate = true;
    // izbrana sarkomera: druga z leve (med Z-črtama)
    const z0 = -Ld / 2 + L, z1 = z0 + L, sr = (z0 + z1) / 2, I2 = (L - SARKOMERA.debeli) / 2;
    oklS.scale.set(L, 1, 1); oklS.position.set(sr, yOkl - 0.22, zOkl);
    oklA.scale.set(SARKOMERA.debeli, 1, 1); oklA.position.set(sr, yOkl, zOkl);
    oklI1.scale.set(Math.max(0.01, 2 * I2), 1, 1); oklI1.position.set(z0, yOkl, zOkl);
    oklI2.scale.set(Math.max(0.01, 2 * I2), 1, 1); oklI2.position.set(z1, yOkl, zOkl);
    n4.deli[1].mm.set(sr, yOkl - 0.22, zOkl);
    n4.deli[2].mm.set(-Ld / 2 + 2 * L, RF + 0.05, 0.1);
    n4.deli[3].mm.set(sr, yOkl, zOkl + 0.05);
    n4.deli[4].mm.set(z1, yOkl, zOkl + 0.05);
    n4.fokus0 = V(sr, 0, 0);
  }
  // pas A je temen zaradi miozina; v progastem vzorcu: odmik 0 → Z-črte na celih večkratnikih L
  n4.deli = [
    { id: "miofibrila", ime: "Miofibrila", opis: "Nitka v mišičnem vlaknu, debela okoli 1 µm, sestavljena iz zaporedja sarkomer.", barva: "#e0777a", meshes: [fibrile], mm: V(-1.2, 0.45, 0.25) },
    { id: "sarkomera", ime: "Sarkomera", opis: "Del miofibrile med dvema Z-črtama; je osnovna enota, ki se skrči.", barva: "#f3f0e8", meshes: [oklS], mm: V() },
    { id: "z-crta", ime: "Z-črta", opis: "Pregrada, na katero so pritrjeni aktinski filamenti; Z-črti omejujeta sarkomero.", barva: "#3b2a55", meshes: [zcrte4], mm: V() },
    { id: "pas-a", ime: "Pas A (temni pas)", opis: "Temni pas, kjer ležijo miozinski filamenti; med krčenjem ostane enako dolg (1,6 µm).", barva: "#8d6fe0", meshes: [oklA], mm: V() },
    { id: "pas-i", ime: "Pas I (svetli pas)", opis: "Svetli pas samo z aktinom ob Z-črti; med krčenjem se skrajša.", barva: "#9fd7f2", meshes: [oklI1, oklI2], mm: V() },
  ];
  n4.rez = null;

  // ================================================================ 5. sarkomera (µm; prečno povečano 5 ×)
  const n5 = nivoji[4];
  n5.enota = 1e-6;
  const P = 5, RD = 0.0075 * P, RT = 0.0036 * P, DD = 0.042 * P;
  const debeli = [[0, 0]];
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; debeli.push([DD * Math.cos(a), DD * Math.sin(a)]); }
  const tanki = [];
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
    const by = (i + j * 0.5) * DD, bz = j * DD * 0.866;
    for (const [oy, oz] of [[DD / 2, (DD * 0.866) / 3], [0, (DD * 0.866 * 2) / 3]]) {
      const y = by + oy, z = bz + oz;
      if (Math.hypot(y, z) < DD * 1.32 && !tanki.some((q) => Math.hypot(q[0] - y, q[1] - z) < 1e-3)) tanki.push([y, z]);
    }
  }
  const mMioz = kmat({ color: "#8f6fe6", roughness: 0.35, sheen: 0.5, sheenColor: new THREE.Color("#d8c8ff"), clearcoat: 0.5 }, n5);
  const mGlava = mat({ color: "#a98bf2", roughness: 0.35, sheen: 0.5, sheenColor: new THREE.Color("#e6dcff"), clearcoat: 0.5 }, n5);
  const mAkt = kmat({ color: "#5fd0c0", roughness: 0.35, sheen: 0.5, sheenColor: new THREE.Color("#c8fff6"), clearcoat: 0.5 }, n5);
  const mZ5 = kmat({ color: "#3a2a58", roughness: 0.45, clearcoat: 0.3 }, n5);
  const mM5 = kmat({ color: "#c9b8ff", roughness: 0.4, clearcoat: 0.3 }, n5);
  // debeli filamenti (miozin) z glavami; v sredini je gola cona brez glav
  const debG = zdruzi(THREE, debeli.map(([y, z]) => { const g = cev(THREE, new THREE.LineCurve3(V(-0.8, y, z), V(0.8, y, z)), { n: 4, rad: visoka ? 10 : 7, r: () => RD, pokrovi: true }); g.deleteAttribute("os"); return g; }));
  const debFil = mesh(debG, mMioz, n5.vsebina);
  const glave = [];
  const KRONA = visoka ? 0.0429 : 0.0858;
  for (const [y, z] of debeli) for (const sg of [-1, 1]) {
    let k = 0;
    for (let x = 0.08; x < 0.79; x += KRONA, k++) for (let h = 0; h < (visoka ? 3 : 2); h++) {
      const a = k * 0.7 + (h * Math.PI * 2) / (visoka ? 3 : 2);
      glave.push({ x: sg * x, y, z, a, sg, faza: rnd() * Math.PI * 2 });
    }
  }
  const glavaG = new THREE.SphereGeometry(1, visoka ? 8 : 6, visoka ? 6 : 4);
  geos.push(glavaG);
  const glaveM = new THREE.InstancedMesh(glavaG, mGlava, glave.length);
  n5.vsebina.add(glaveM);
  // tanki filamenti (aktin): zviti dvojni niz, pritrjeni na Z-črto; levi in desni se premikata
  const zLevo = new THREE.Group(), zDesno = new THREE.Group();
  n5.vsebina.add(zLevo, zDesno);
  const aktG = (sg) => zdruzi(THREE, tanki.map(([y, z], i) => {
    const g = cev(THREE, new THREE.LineCurve3(V(0, y, z), V(-sg * SARKOMERA.tanki, y, z)), { n: visoka ? 112 : 56, rad: visoka ? 7 : 5, r: (u, a) => RT * (0.82 + 0.22 * Math.cos(2 * a + u * SARKOMERA.tanki * 2 * Math.PI / 0.072 + i)), pokrovi: true });
    g.deleteAttribute("os");
    return g;
  }));
  const aktL = mesh(aktG(-1), mAkt, zLevo), aktD = mesh(aktG(1), mAkt, zDesno);
  const RZ = DD * 1.75;
  const zPlG = new THREE.CylinderGeometry(RZ, RZ, 0.035, 6);
  zPlG.rotateZ(Math.PI / 2);
  const zPl = (grp) => mesh(zPlG.clone(), mZ5, grp);
  geos.push(zPlG);
  const zl = zPl(zLevo), zd = zPl(zDesno);
  // M-črta: povezave med debelimi filamenti v sredini
  const mG = zdruzi(THREE, debeli.slice(1).map(([y, z]) => { const g = cev(THREE, new THREE.LineCurve3(V(0, 0, 0), V(0, y, z)), { n: 2, rad: 6, r: () => RD * 0.45, pokrovi: true }); g.deleteAttribute("os"); return g; }).concat(debeli.slice(1).map(([y, z], i) => { const [y2, z2] = debeli[1 + ((i + 1) % 6)]; const g = cev(THREE, new THREE.LineCurve3(V(0, y, z), V(0, y2, z2)), { n: 2, rad: 6, r: () => RD * 0.45, pokrovi: true }); g.deleteAttribute("os"); return g; })));
  const mCrta = mesh(mG, mM5, n5.vsebina);
  // oklepaji pasov pod sarkomero
  const yO5 = -RZ - 0.09;
  const ok5 = (c) => mesh(new THREE.BoxGeometry(1, 0.035, 0.035), kmat({ color: c, roughness: 0.4, clearcoat: 0.3 }, n5), n5.vsebina);
  const okA5 = ok5("#8f6fe6"), okI5a = ok5("#9fd7f2"), okI5b = ok5("#9fd7f2"), okH5 = ok5("#f2e27a");
  function postaviN5() {
    zLevo.position.x = -L / 2; zDesno.position.x = L / 2;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    const premik = (SARKOMERA.Lsprosceno - L) / 2;
    glave.forEach((g, i) => {
      // glava miozina se nagne proti Z-črti; ob drsenju naredi zavesljaje (en zavesljaj ≈ 10 nm)
      const zamah = 0.5 + 0.35 * Math.sin((premik / 0.01) * 0.6 + g.faza);
      const r = RD + RT * 0.9;
      const p = V(g.x + g.sg * 0.008, g.y + r * Math.cos(g.a), g.z + r * Math.sin(g.a));
      e.set(g.a, 0, g.sg * zamah, "XYZ"); q.setFromEuler(e);
      m.compose(p, q, V(0.016, RT * 0.95, RT * 0.95));
      glaveM.setMatrixAt(i, m);
    });
    glaveM.instanceMatrix.needsUpdate = true;
    const pv = pasovi(L);
    okA5.scale.x = pv.A; okA5.position.set(0, yO5, 0);
    for (const [o, sg] of [[okI5a, -1], [okI5b, 1]]) { o.scale.x = Math.max(0.005, pv.I / 2); o.position.set(sg * (L / 2 - pv.I / 4), yO5, 0); }
    okH5.scale.x = Math.max(0.005, pv.H); okH5.position.set(0, yO5 - 0.05, 0); okH5.visible = pv.H > 0.004;
    n5.deli[0].mm.set(-L / 2, RZ * 0.85, 0.02);
    n5.deli[4].mm.set(-L / 2 + pv.I / 4, yO5, 0.02);
    n5.deli[6].mm.set(0, yO5 - 0.05, 0.02);
    n5.deli[2].mm.set(-L / 2 + SARKOMERA.tanki * 0.6, tanki[0][0], tanki[0][1] + RT);
  }
  n5.deli = [
    { id: "z-crta", ime: "Z-črta", opis: "Mreža beljakovin, na katero so pritrjeni aktinski filamenti; ob krčenju se Z-črti približata.", barva: "#3a2a58", meshes: [zl, zd], mm: V() },
    { id: "miozin", ime: "Miozinski filament (debeli)", opis: "Debeli filament iz miozina, dolg 1,6 µm; njegove glave se oprimejo aktina in ga potegnejo proti sredini.", barva: "#8f6fe6", meshes: [debFil, glaveM], mm: V(0.45, DD * 0.5, RD + 0.02) },
    { id: "aktin", ime: "Aktinski filament (tanki)", opis: "Tanki filament iz aktina, pritrjen na Z-črto; med krčenjem zdrsne med miozinske, sam pa se ne skrajša.", barva: "#5fd0c0", meshes: [aktL, aktD], mm: V() },
    { id: "pas-a", ime: "Pas A", opis: "Območje miozinskih filamentov (1,6 µm); med krčenjem ostane enako dolgo.", barva: "#8f6fe6", meshes: [okA5], mm: V(0.35, yO5, 0.02) },
    { id: "pas-i", ime: "Pas I", opis: "Območje samo z aktinom ob Z-črti; med krčenjem se skrajša.", barva: "#9fd7f2", meshes: [okI5a, okI5b], mm: V() },
    { id: "m-crta", ime: "M-črta", opis: "Sredina sarkomere, kjer so miozinski filamenti povezani med seboj.", barva: "#c9b8ff", meshes: [mCrta], mm: V(0, DD, 0.02) },
    { id: "obmocje-h", ime: "Območje H", opis: "Sredinski del pasu A brez aktina; ob krčenju se zoži in lahko izgine.", barva: "#f2e27a", meshes: [okH5], mm: V() },
  ];
  n5.rez = null;
  n5.fokus0 = V(0, 0, 0);

  // ================================================================ postavitev nivojev v enotsko kroglo
  const okviri = [
    { c: V(0, 0, 0), R: 12.8, rot: [0.16, -0.38, 0.0] },
    { c: V(0, 0, 0), R: 1.6, rot: [0.15, -0.55, 0] },
    { c: V(0, 0, 0), R: 116, rot: [0.15, -0.55, 0] },
    { c: V(0, -0.6, 0), R: 5.4, rot: [0.12, -0.3, 0] },
    { c: V(0, -0.12, 0), R: 1.24, rot: [0.1, -0.35, 0] },
  ];
  nivoji.forEach((n, i) => {
    const o = okviri[i];
    n.skala = 1 / o.R;
    n.vsebina.scale.setScalar(n.skala);
    n.vsebina.rotation.set(...o.rot);
    n.vsebina.position.set(0, 0, 0);
    n.vsebina.updateMatrix();
    n.vsebina.position.copy(o.c.clone().applyMatrix4(n.vsebina.matrix).negate());
    n.vsebina.updateMatrix();
    for (const d of n.deli) d.tocka = [0, 0, 0];
  });
  // prerezi v svetovnih koordinatah nivoja (skupina nivoja je v izhodišču, ko je nivo izbran)
  function rezi() {
    for (const n of nivoji) {
      n.g.updateMatrixWorld(true);
      const mx = n.vsebina.matrixWorld;
      n.svetRez = n.rez ? n.rez.map((p) => p.clone().applyMatrix4(mx)) : null;
    }
    const z1 = nivoji[0].svetRez, z2 = nivoji[1].svetRez, z3 = nivoji[2].svetRez;
    for (const m of [mEpi, mPeri, mSnop]) { m.clippingPlanes = z1; m.clipIntersection = true; }
    for (const m of [mPeri2, mEndo, mVl, mKap2]) { m.clippingPlanes = z2; m.clipIntersection = true; }
    for (const m of [mSarko]) { m.clippingPlanes = z3; m.clipIntersection = true; }
    mMio.clippingPlanes = [n3.rezDesno.clone().applyMatrix4(nivoji[2].vsebina.matrixWorld)];
    for (const m of mats) m.needsUpdate = true;
  }

  // ================================================================ krčenje in prehodi
  const stanje = { k: 0, nivo: 0, od: 0, do: 0, cilj: 0, e: 1, smer: 1 };
  const ZOOM = 5;
  function uporabiKrcenje() {
    L = dolzinaSarkomere(stanje.k);
    uL.value = L;
    const s = L / SARKOMERA.Lsprosceno, r = Math.sqrt(1 / s);
    trebuh1.scale.set(s, r, r);
    kitaL.position.x = -xr * (s - 1); kitaD.position.x = xr * (s - 1);
    trebuh2.scale.set(1, r, r);
    vlakno3.scale.set(1, r, r);
    postaviN4();
    postaviN5();
    for (const n of nivoji) for (const d of n.deli) d.tocka.splice(0, 3, ...T(n, d.mm));
    // točke prvih treh nivojev sledijo obliki
    const t1 = nivoji[0].deli;
    t1[0].tocka.splice(0, 3, ...T(nivoji[0], V(-xr * s - 3.2, -0.15, 0.6)));
    t1[1].tocka.splice(0, 3, ...T(nivoji[0], V(-3.5 * s, 1.2 * r, Rmax * 0.95 * r)));
    t1[2].tocka.splice(0, 3, ...T(nivoji[0], V((x0rez + 0.6) * s, 0.6 * r, 1.2 * r)));
    t1[3].tocka.splice(0, 3, ...T(nivoji[0], V(x0rez * s, -1.3 * r, 0.25)));
  }
  const prozornost = (n, a) => {
    for (const m of n.mats) {
      const t = a < 0.999;
      if (m.transparent !== t) { m.transparent = t; m.needsUpdate = true; }
      m.opacity = a;
      m.depthWrite = true;
    }
  };
  function prikazi() {
    // e: 0 = grob nivo (od manjše številke), 1 = podroben nivo; prehod je povečava v fokus grobega nivoja
    const a = Math.min(stanje.od, stanje.do), b = Math.max(stanje.od, stanje.do);
    group.clear();
    if (stanje.e >= 1 || a === b) {
      const n = nivoji[stanje.do];
      n.g.scale.setScalar(1); n.g.position.set(0, 0, 0);
      prozornost(n, 1);
      group.add(n.g);
      return;
    }
    const t = stanje.smer > 0 ? stanje.e : 1 - stanje.e;
    const e = t * t * (3 - 2 * t);
    const na = nivoji[a], nb = nivoji[b];
    const f = new THREE.Vector3().fromArray(T(na, na.fokus0));
    const Sa = Math.pow(ZOOM, e);
    na.g.scale.setScalar(Sa);
    na.g.position.copy(f).multiplyScalar(-e * Sa);
    const Sb = Math.pow(ZOOM, e - 1);
    nb.g.scale.setScalar(Sb);
    nb.g.position.copy(f).multiplyScalar((1 - e) * Sa);
    const oa = 1 - s01(0.35, 0.95, e), ob = s01(0.05, 0.6, e);
    prozornost(na, oa);
    prozornost(nb, ob);
    // povsem prozornega nivoja ne rišemo (in ne šteje v okvir)
    if (oa > 0.002) group.add(na.g);
    if (ob > 0.002) group.add(nb.g);
  }
  let zadnjiKorak = -1e9;
  const zdaj = () => (typeof performance !== "undefined" ? performance.now() : Date.now());
  // Prehod gre po eno raven naenkrat (mišica → snop → … ), da je povečava vedno 5-kratna in razumljiva.
  function naslednjiKorak() {
    stanje.od = stanje.do;
    stanje.do = stanje.od + Math.sign(stanje.cilj - stanje.od);
    stanje.smer = stanje.do > stanje.od ? 1 : -1;
    stanje.e = 0;
  }
  function izberiNivo(i) {
    stanje.cilj = i;
    if (!gibanje || zdaj() - zadnjiKorak > 400) {
      // brez gibanja ali med premorom: takoj na izbrano raven
      stanje.od = stanje.do = i; stanje.e = 1;
    } else if (stanje.e >= 1) {
      if (i === stanje.do) return;
      naslednjiKorak();
    } else if (Math.sign(i - stanje.od) !== stanje.smer || i === stanje.od) {
      // obrat sredi prehoda: vrnemo se po isti poti
      const d = stanje.do; stanje.do = stanje.od; stanje.od = d; stanje.smer = -stanje.smer; stanje.e = 1 - stanje.e;
    }
    prikazi();
  }

  const IMENA = [["misica", "Mišica"], ["snop", "Snop"], ["vlakno", "Vlakno"], ["miofibrila", "Miofibrila"], ["sarkomera", "Sarkomera"]];
  const nadzor = [
    { tip: "izbira", id: "raven", oznaka: "Raven", moznosti: IMENA, vrednost: "misica", ob: (v) => { const i = IMENA.findIndex((x) => x[0] === v); izberiNivo(i < 0 ? 0 : i); } },
    { tip: "drsnik", id: "krcenje", oznaka: "Krčenje", min: 0, max: 1, korak: 0.01, vrednost: 0, ob: (v) => { stanje.k = Math.min(1, Math.max(0, Number(v) || 0)); uporabiKrcenje(); } },
    { tip: "izpis", id: "sarkomera", oznaka: "Sarkomera", vrednost: () => { const p = pasovi(L), f = (x) => x.toFixed(2).replace(".", ","); return `${f(L)} µm · pas A ${f(p.A)} µm · pas I ${f(p.I)} µm · območje H ${f(p.H)} µm`; } },
  ];
  const zac = ctx.zacetek || {};
  const zi = IMENA.findIndex((x) => x[0] === zac.raven);
  if (zi >= 0) { stanje.nivo = stanje.od = stanje.do = stanje.cilj = zi; nadzor[0].vrednost = IMENA[zi][0]; }
  if (zac.krcenje != null && Number.isFinite(Number(zac.krcenje))) { stanje.k = Math.min(1, Math.max(0, Number(zac.krcenje))); nadzor[1].vrednost = stanje.k; }
  rezi();
  uporabiKrcenje();
  prikazi();

  return {
    group,
    get deli() { return nivoji[stanje.do].deli; },
    nadzor,
    get merilo() { const n = nivoji[stanje.do]; const m = (2 / n.skala) * n.enota; return { m, oznaka: m >= 0.01 ? `${Math.round(m * 100)} cm` : m >= 1e-3 ? `${String(Math.round(m * 1e4) / 10).replace(".", ",")} mm` : `${String(Math.round(m * 1e7) / 10).replace(".", ",")} µm` }; },
    korak(t, dt) {
      zadnjiKorak = zdaj();
      if (stanje.e < 1) {
        const trajanje = Math.abs(stanje.cilj - stanje.od) > 1 ? 0.9 : 1.3;
        stanje.e = Math.min(1, stanje.e + Math.min(dt, 0.1) / trajanje);
        if (stanje.e >= 1 && stanje.do !== stanje.cilj) naslednjiKorak();
        prikazi();
      }
    },
    dispose() {
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
    },
  };
}
