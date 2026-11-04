// Uho (desno, pogled od spredaj): zunanje, srednje in notranje uho v pravih merah. Pogodba: docs/3d.md.
//
// Mere (mm) iz učbeniških in anatomskih virov (Gray's Anatomy, 42. izd., ur. Standring 2020; Erixon in sod. 2009,
// Otol Neurotol 30, 14, za polžek): sluhovod ≈ 25 mm dolg in 7 mm širok, bobnič ≈ 9 × 8 mm, nagnjen proti osi
// sluhovoda, kladivce ≈ 8 mm, nakovalce ≈ 7 mm, stremence ≈ 3,3 mm (ploščica 3 × 1,4 mm), polžek 9 mm širok in
// 5 mm visok z 2¾ zavoja, polkrožne cevi s premerom loka ≈ 6,5 mm, Evstahijeva cev ≈ 36 mm, nagnjena za ≈ 33°.
// Koordinate v mm: x proti sredini glave (medialno), y navzgor, z naprej. Oblika uhlja je narisana na oko.
// Zvok je upočasnjen, nihanje bobniča in koščic pa močno povečano (v resnici so premiki manjši od 1 µm).

export const info = {
  id: "organ-uho",
  naslov: "Uho",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Desno uho v prerezu: uhelj in sluhovod, bobnič s tremi slušnimi koščicami, polžek z 2¾ zavoja in tri polkrožne cevi. Gumb »Zvok« pokaže pot zvoka do slušnega živca (upočasnjeno, nihanje je močno povečano).",
  merilo: { m: 0.09, oznaka: "9 cm" },
};

// Podatki za preverbe v testu.
export const MERE = { zavojiPolzka: 2.75, sluhovod: 25, stremence: 3.3, evstahijevaCev: 36 };

// ---------------------------------------------------------------- orodja (brez uvozov)
const s01 = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - (h * h * k) / 4; };
const smax = (a, b, k) => -smin(-a, -b, k);

function elipsoid(x, y, z, c, r) {
  const dx = (x - c[0]) / r[0], dy = (y - c[1]) / r[1], dz = (z - c[2]) / r[2];
  return (Math.sqrt(dx * dx + dy * dy + dz * dz) - 1) * Math.min(r[0], r[1], r[2]);
}
// Gladka ploskev iz predznačene razdalje (»surface nets«): negativno = znotraj. Normale iz gradienta.
const ROBOVI = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
function ploskev(THREE, f, lo, hi, h, obdrzi = null) {
  const nx = Math.ceil((hi[0] - lo[0]) / h) + 1, ny = Math.ceil((hi[1] - lo[1]) / h) + 1, nz = Math.ceil((hi[2] - lo[2]) / h) + 1;
  const val = new Float32Array(nx * ny * nz);
  let q = 0;
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) val[q++] = f(lo[0] + i * h, lo[1] + j * h, lo[2] + k * h);
  const at = (i, j, k) => val[i + nx * (j + ny * k)];
  const cx = nx - 1, cy = ny - 1, cz = nz - 1;
  const vid = new Int32Array(cx * cy * cz).fill(-1);
  const pos = [];
  const cv = new Float32Array(8);
  for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) {
    let m = 0;
    for (let c = 0; c < 8; c++) { cv[c] = at(i + (c & 1), j + ((c >> 1) & 1), k + ((c >> 2) & 1)); if (cv[c] < 0) m |= 1 << c; }
    if (m === 0 || m === 255) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, b] of ROBOVI) {
      if ((cv[a] < 0) === (cv[b] < 0)) continue;
      const t = cv[a] / (cv[a] - cv[b]);
      sx += (a & 1) + t * ((b & 1) - (a & 1)); sy += ((a >> 1) & 1) + t * (((b >> 1) & 1) - ((a >> 1) & 1)); sz += ((a >> 2) & 1) + t * (((b >> 2) & 1) - ((a >> 2) & 1));
      n++;
    }
    vid[i + cx * (j + cy * k)] = pos.length / 3;
    pos.push(lo[0] + (i + sx / n) * h, lo[1] + (j + sy / n) * h, lo[2] + (k + sz / n) * h);
  }
  const cel = (i, j, k) => vid[i + cx * (j + cy * k)];
  const idx = [];
  const P = (v) => [pos[3 * v], pos[3 * v + 1], pos[3 * v + 2]];
  function quad(a, b, c, d, os, znotraj) {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    const pa = P(a), pc = P(c), pb = P(b), pd = P(d);
    const u = [pc[0] - pa[0], pc[1] - pa[1], pc[2] - pa[2]], v = [pd[0] - pb[0], pd[1] - pb[1], pd[2] - pb[2]];
    const nrm = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const ok = (nrm[os] > 0) === znotraj;
    if (obdrzi) {
      const sx = (pa[0] + pc[0]) / 2, sy = (pa[1] + pc[1]) / 2, sz = (pa[2] + pc[2]) / 2;
      if (!obdrzi(sx, sy, sz)) return;
    }
    if (ok) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c);
  }
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const v0 = at(i, j, k) < 0;
    if (i < cx && j > 0 && k > 0 && j < cy && k < cz && v0 !== (at(i + 1, j, k) < 0)) quad(cel(i, j - 1, k - 1), cel(i, j, k - 1), cel(i, j, k), cel(i, j - 1, k), 0, v0);
    if (j < cy && i > 0 && k > 0 && i < cx && k < cz && v0 !== (at(i, j + 1, k) < 0)) quad(cel(i - 1, j, k - 1), cel(i - 1, j, k), cel(i, j, k), cel(i, j, k - 1), 1, v0);
    if (k < cz && i > 0 && j > 0 && i < cx && j < cy && v0 !== (at(i, j, k + 1) < 0)) quad(cel(i - 1, j - 1, k), cel(i, j - 1, k), cel(i, j, k), cel(i - 1, j, k), 2, v0);
  }
  const nor = new Float32Array(pos.length);
  const e = h * 0.5;
  for (let v = 0; v < pos.length; v += 3) {
    const x = pos[v], y = pos[v + 1], z = pos[v + 2];
    const gx = f(x + e, y, z) - f(x - e, y, z), gy = f(x, y + e, z) - f(x, y - e, z), gz = f(x, y, z + e) - f(x, y, z - e);
    const l = Math.hypot(gx, gy, gz) || 1;
    nor[v] = gx / l; nor[v + 1] = gy / l; nor[v + 2] = gz / l;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}

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
  const X = V(1, 0, 0), Y = V(0, 1, 0), Z = V(0, 0, 1);
  const group = new THREE.Group();
  group.name = "organ-uho";
  const vsebina = new THREE.Group(); // koordinate v mm
  group.add(vsebina);
  const zunanji = new THREE.Group(), srednji = new THREE.Group(), notranji = new THREE.Group(), tkivo = new THREE.Group();
  const geos = [], mats = [];
  const mesh = (g, m, parent) => { geos.push(g); const o = new THREE.Mesh(g, m); parent.add(o); return o; };
  const mat = (p, Tip = THREE.MeshPhysicalMaterial) => { const m = new Tip(p); mats.push(m); return m; };

  const koza = mat({ color: "#e2a08a", roughness: 0.5, sheen: 0.7, sheenColor: new THREE.Color("#ffc9b5"), sheenRoughness: 0.45, clearcoat: 0.18, clearcoatRoughness: 0.45, side: THREE.DoubleSide });
  const kozaNotri = kapa(THREE, { color: "#cf8574", roughness: 0.45, sheen: 0.5, sheenColor: new THREE.Color("#ffb7a3"), clearcoat: 0.3, clearcoatRoughness: 0.35 });
  mats.push(kozaNotri);
  const opna = mat({ color: "#d8cdd2", roughness: 0.3, sheen: 0.6, sheenColor: new THREE.Color("#fff3f6"), clearcoat: 0.8, clearcoatRoughness: 0.2, side: THREE.DoubleSide });
  const kost = mat({ color: "#ecdfc4", roughness: 0.62, clearcoat: 0.08 });
  const sluznica = mat({ color: "#d88d8b", roughness: 0.45, sheen: 0.6, sheenColor: new THREE.Color("#ffc4c0"), clearcoat: 0.35, clearcoatRoughness: 0.3, side: THREE.DoubleSide, transparent: true, opacity: 1 });
  const evst = kapa(THREE, { color: "#d99a92", roughness: 0.45, sheen: 0.5, sheenColor: new THREE.Color("#ffc9c2"), clearcoat: 0.35 });
  mats.push(evst);
  const preddvorM = mat({ color: "#9dc5ea", roughness: 0.3, sheen: 0.5, sheenColor: new THREE.Color("#e3f1ff"), clearcoat: 0.7, clearcoatRoughness: 0.2 });
  const cevM = mat({ color: "#84d0c3", roughness: 0.3, sheen: 0.5, sheenColor: new THREE.Color("#e0fff9"), clearcoat: 0.7, clearcoatRoughness: 0.2, side: THREE.DoubleSide });
  const ampulaM = mat({ color: "#f0b65e", roughness: 0.32, sheen: 0.5, sheenColor: new THREE.Color("#fff0d0"), clearcoat: 0.7, clearcoatRoughness: 0.2 });
  const polzekM = kapa(THREE, { color: "#ffffff", vertexColors: true, roughness: 0.32, sheen: 0.5, sheenColor: new THREE.Color("#f4e8ff"), clearcoat: 0.7, clearcoatRoughness: 0.2 });
  mats.push(polzekM);
  const kanalM = mat({ color: "#ffffff", vertexColors: true, roughness: 0.3, clearcoat: 0.6, sheen: 0.4, sheenColor: new THREE.Color("#dbe6ff") });
  const sluhM = mat({ color: "#f1d26a", roughness: 0.45, sheen: 0.4, sheenColor: new THREE.Color("#fff6c8"), clearcoat: 0.25, emissive: new THREE.Color("#ffd84a"), emissiveIntensity: 0 });
  const ravnM = mat({ color: "#cfe07a", roughness: 0.45, sheen: 0.4, sheenColor: new THREE.Color("#f7ffd0"), clearcoat: 0.25, emissive: new THREE.Color("#e6ff6a"), emissiveIntensity: 0 });
  const sencnicaM = kapa(THREE, { color: "#e9dcc2", roughness: 0.7, clearcoat: 0.05 });
  const mehkoM = kapa(THREE, { color: "#e0a391", roughness: 0.5, sheen: 0.6, sheenColor: new THREE.Color("#ffc9b5"), clearcoat: 0.15 });
  mats.push(sencnicaM, mehkoM);

  // ---------- zunanje uho: uhelj in sluhovod
  const E = V(-25, 2, 1); // vhod v sluhovod
  const R0 = 3.4;
  const obris = new THREE.CatmullRomCurve3(
    [[2, 18], [-2, 30], [-10, 37], [-17, 33], [-21, 22], [-22, 10], [-19, -3], [-14, -12], [-10, -21], [-4, -25], [1, -19], [3, -8], [7, -2], [6, 4], [3, 10]].map(([u, v]) => V(u, v, 0)),
    true, "centripetal",
  );
  const NT = visoka ? 132 : 84, NQ = visoka ? 30 : 18;
  const O = obris.getSpacedPoints(NT).slice(0, NT);
  const jZarez = O.reduce((b, p, i) => (p.distanceTo(V(3, -8, 0)) < O[b].distanceTo(V(3, -8, 0)) ? i : b), 0);
  const kot = (d) => ((d % 360) + 360) % 360;
  const razlika = (a, b) => { const d = Math.abs(kot(a) - kot(b)); return Math.min(d, 360 - d); };
  const nagib = (15 * Math.PI) / 180;
  const vSvet = (u, v, d) => {
    const ur = u * Math.cos(nagib) - v * Math.sin(nagib), vr = u * Math.sin(nagib) + v * Math.cos(nagib);
    return E.clone().addScaledVector(Z, ur).addScaledVector(Y, vr).addScaledVector(X, -d);
  };
  const globina = (q, th) => {
    const A = 3 + 10 * Math.pow(Math.max(0, Math.cos(((th - 160) * Math.PI) / 180)), 1.2);
    let f = s01(0.33, 0.64, q) - 0.18 * Math.exp(-(((q - 0.85) / 0.07) ** 2)) + 0.1 * Math.exp(-(((q - 0.66) / 0.06) ** 2));
    const wl = Math.exp(-((razlika(th, 268) / 20) ** 2));
    f = f * (1 - wl) + wl * 0.65 * s01(0.25, 0.95, q);
    let d = A * f;
    d += 4.5 * Math.exp(-((razlika(th, 352) / 24) ** 2)) * s01(0.1, 0.85, q); // tragus
    d += 2.2 * Math.exp(-((razlika(th, 236) / 16) ** 2)) * Math.exp(-(((q - 0.62) / 0.14) ** 2)); // antitragus
    const wp = th > 300 || th < 82 ? 1 : 0; // pritrditev na glavo
    if (wp) d *= 1 - 0.85 * s01(0.55, 1, q) * Math.min(1, Math.min(razlika(th, 340), razlika(th, 82)) / 18);
    return d;
  };
  {
    const pos = [];
    for (let i = 0; i <= NQ; i++) {
      const q = i / NQ;
      for (let j = 0; j < NT; j++) {
        const o = O[j], R = Math.hypot(o.x, o.y), th = kot((Math.atan2(o.y, o.x) * 180) / Math.PI);
        const r = R0 + q * (R - R0);
        const p = vSvet((o.x / R) * r, (o.y / R) * r, globina(q, th));
        pos.push(p.x, p.y, p.z);
      }
    }
    const idx = [];
    for (let i = 0; i < NQ; i++) for (let j = 0; j < NT; j++) {
      const a = i * NT + j, b = i * NT + ((j + 1) % NT), c = a + NT, d = b + NT;
      idx.push(a, c, b, b, c, d);
    }
    const sprednja = new THREE.BufferGeometry();
    sprednja.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    sprednja.setIndex(idx);
    sprednja.computeVertexNormals();
    // zadnja ploskev uhlja: hrustanec s kožo je debel 2–3 mm (mečica debelejša)
    const nf = pos.length / 3, nrm = sprednja.attributes.normal.array;
    let sx = 0;
    for (let i = 0; i < nf; i++) sx += nrm[3 * i];
    const smer = sx < 0 ? 1 : -1;
    const vse = pos.slice();
    for (let i = 0; i <= NQ; i++) for (let j = 0; j < NT; j++) {
      const k = i * NT + j, o = O[j], th = kot((Math.atan2(o.y, o.x) * 180) / Math.PI);
      const deb = 2.2 + 1.3 * Math.exp(-((razlika(th, 268) / 20) ** 2));
      vse.push(pos[3 * k] + smer * nrm[3 * k] * deb, pos[3 * k + 1] + smer * nrm[3 * k + 1] * deb, pos[3 * k + 2] + smer * nrm[3 * k + 2] * deb);
    }
    const vi = idx.slice();
    for (let i = 0; i < idx.length; i += 3) vi.push(idx[i] + nf, idx[i + 2] + nf, idx[i + 1] + nf);
    for (const i of [0, NQ]) for (let j = 0; j < NT; j++) {
      const a = i * NT + j, b = i * NT + ((j + 1) % NT);
      if (i === 0) vi.push(a, b, a + nf, b, b + nf, a + nf); else vi.push(a, a + nf, b, b, a + nf, b + nf);
    }
    const ploskevUhlja = new THREE.BufferGeometry();
    ploskevUhlja.setAttribute("position", new THREE.Float32BufferAttribute(vse, 3));
    ploskevUhlja.setIndex(vi);
    ploskevUhlja.computeVertexNormals();
    // zavihan rob (uhljev rob in mečica)
    const rob = [];
    for (let j = 0; j <= jZarez; j++) {
      const o = O[j], R = Math.hypot(o.x, o.y), th = kot((Math.atan2(o.y, o.x) * 180) / Math.PI);
      const rr = R - 1.3;
      rob.push(vSvet((o.x / R) * rr, (o.y / R) * rr, globina(1, th) + 0.9));
    }
    const robK = new THREE.CatmullRomCurve3(rob, false, "centripetal");
    const robG = cev(THREE, robK, {
      n: visoka ? 140 : 80, rad: visoka ? 12 : 8,
      r: (u) => 0.4 + 1.6 * s01(0, 0.08, u) + 0.9 * Math.exp(-(((u - 0.72) / 0.1) ** 2)) - 1.5 * s01(0.86, 1, u),
    });
    robG.deleteAttribute("uv"); robG.deleteAttribute("os");
    const uhelj = mesh(zdruzi(THREE, [ploskevUhlja, robG]), koza, zunanji);
    uhelj.name = "uhelj";
  }
  // sluhovod: zunanja tretjina hrustančna, notranji dve tretjini v kosti; konča se poševno na bobniču
  const Cd = V(-1.5, 0.35, 0.3); // središče bobniča
  const nb = V(-1, -0.7, 0.3).normalize(); // normala bobniča (gleda navzven, navzdol in naprej)
  const sluhovodK = new THREE.CatmullRomCurve3([E, V(-21, 2.6, 0.2), V(-15, 3.0, -0.6), V(-9, 1.8, 0), V(-4, 0.7, 0.4), V(2.5, -0.5, 0.2)]);
  const rSluh = (u) => R0 + 0.25 * Math.exp(-(((u - 0.12) / 0.1) ** 2)) - 0.45 * Math.exp(-(((u - 0.45) / 0.12) ** 2));
  const NS = visoka ? 80 : 48, RS = visoka ? 28 : 18;
  const sluhG = ljupina(THREE, sluhovodK, { n: NS, rad: RS, r: (u, a) => rSluh(u) * (1 + 0.08 * Math.cos(2 * a)), debelina: 0.9 });
  const robBobnica = [];
  {
    const p = sluhG.attributes.position, fr = sluhovodK.computeFrenetFrames(NS, false);
    const t = new THREE.Vector3(), w = new THREE.Vector3();
    const uvs = sluhG.attributes.uv;
    for (let k = 0; k < p.count; k++) {
      const i = Math.round(uvs.getX(k) * NS);
      w.fromBufferAttribute(p, k);
      const dpl = w.clone().sub(Cd).dot(nb);
      if (dpl < 0) { t.copy(fr.tangents[i]); w.addScaledVector(t, -dpl / t.dot(nb)); p.setXYZ(k, w.x, w.y, w.z); }
    }
    for (let j = 0; j < RS; j++) robBobnica.push(new THREE.Vector3().fromBufferAttribute(p, NS * (RS + 1) + j));
  }
  sluhG.deleteAttribute("os");
  const sluhovod = mesh(sluhG, kozaNotri, zunanji);

  // ---------- srednje uho: bobnič, koščice, votlina, Evstahijeva cev
  const NK = visoka ? 10 : 6;
  const bobnicG = new THREE.BufferGeometry();
  const bobnicOsnova = [], bobnicS = [];
  {
    const pos = [], idx = [];
    const ume = Cd.clone().addScaledVector(nb, -2.0);
    pos.push(ume.x, ume.y, ume.z); bobnicS.push(0);
    for (let k = 1; k <= NK; k++) {
      const s = k / NK;
      for (let j = 0; j < RS; j++) {
        const p = Cd.clone().lerp(robBobnica[j], s).addScaledVector(nb, -2.0 * Math.pow(1 - s, 1.6));
        pos.push(p.x, p.y, p.z); bobnicS.push(s);
      }
    }
    for (let j = 0; j < RS; j++) idx.push(0, 1 + j, 1 + ((j + 1) % RS));
    for (let k = 1; k < NK; k++) for (let j = 0; j < RS; j++) {
      const a = 1 + (k - 1) * RS + j, b = 1 + (k - 1) * RS + ((j + 1) % RS), c = a + RS, d = b + RS;
      idx.push(a, c, b, b, c, d);
    }
    // bobnič je debel okoli 0,1 mm; tu 0,3 mm, da se v prerezu vidi
    const nv = pos.length / 3;
    for (let i = 0; i < nv; i++) { pos.push(pos[3 * i] - nb.x * 0.3, pos[3 * i + 1] - nb.y * 0.3, pos[3 * i + 2] - nb.z * 0.3); bobnicS.push(bobnicS[i]); }
    const m = idx.length;
    for (let i = 0; i < m; i += 3) idx.push(idx[i] + nv, idx[i + 2] + nv, idx[i + 1] + nv);
    for (let j = 0; j < RS; j++) {
      const a = 1 + (NK - 1) * RS + j, b = 1 + (NK - 1) * RS + ((j + 1) % RS);
      idx.push(a, b, a + nv, b, b + nv, a + nv);
    }
    bobnicG.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    bobnicG.setIndex(idx);
    bobnicG.computeVertexNormals();
    bobnicOsnova.push(...pos);
  }
  const bobnic = mesh(bobnicG, opna, srednji);

  // koščice
  const gor = Y.clone().addScaledVector(nb, -Y.dot(nb)).normalize(); // »gor« v ravnini bobniča
  const zgornjiRob = robBobnica.reduce((b, p) => (p.y > b.y ? p : b), robBobnica[0]);
  const naBobnicu = (s, odmik) => Cd.clone().lerp(zgornjiRob, s).addScaledVector(nb, -2.0 * Math.pow(1 - s, 1.6) - odmik);
  const N1 = zgornjiRob.clone().addScaledVector(nb, -1.6).addScaledVector(Y, 1.0);
  const H = N1.clone().add(V(0.4, 2.0, 0)); // glavica kladivca
  const kladivceG = zdruzi(THREE, [
    cev(THREE, new THREE.CatmullRomCurve3([naBobnicu(0.02, 0.35), naBobnicu(0.35, 0.4), naBobnicu(0.62, 0.42), naBobnicu(0.86, 0.45), N1, H]), {
      n: 40, rad: 10, r: (u) => 0.32 + 0.12 * s01(0, 0.2, u) + 0.12 * Math.exp(-(((u - 0.66) / 0.06) ** 2)) + 0.25 * s01(0.75, 1, u), pokrovi: true,
    }),
    elipsoidGeo(THREE, H.clone().add(V(0, 0.2, 0)), [1.25, 1.6, 1.15], 22),
    cev(THREE, new THREE.LineCurve3(N1.clone().add(V(0.2, 0.4, 0)), N1.clone().add(V(0.4, 0.6, 1.5))), { n: 4, rad: 8, r: (u) => 0.22 - 0.14 * u, pokrovi: true }),
    cev(THREE, new THREE.LineCurve3(naBobnicu(0.86, 0.2), naBobnicu(0.86, 0.2).addScaledVector(nb, 0.5)), { n: 2, rad: 8, r: () => 0.38, pokrovi: true }),
  ]);
  const Ib = H.clone().add(V(0.5, -0.2, -2.1)); // telo nakovalca
  const F = V(6.5, 1.4, -2.2); // ploščica stremenca v ovalnem okencu
  const Sh = F.clone().add(V(-3.2, 0, 0)); // glavica stremenca
  const nakovalceG = zdruzi(THREE, [
    elipsoidGeo(THREE, Ib, [1.25, 1.55, 1.15], 22),
    cev(THREE, new THREE.CatmullRomCurve3([Ib, Ib.clone().add(V(0.2, 0.3, -1.6)), Ib.clone().add(V(0.35, 0.5, -3.3))]), { n: 12, rad: 10, r: (u) => 0.8 - 0.55 * u, pokrovi: true }),
    cev(THREE, new THREE.CatmullRomCurve3([Ib, Ib.clone().add(V(0.6, -1.6, 0.2)), V(2.3, 3.0, -2.0), V(2.75, 1.7, -2.15), Sh.clone().add(V(-0.45, 0.05, 0))]), { n: 28, rad: 10, r: (u) => 0.55 - 0.25 * s01(0, 0.6, u) + 0.12 * s01(0.85, 1, u), pokrovi: true }),
  ]);
  const krak = (dz) => new THREE.CatmullRomCurve3([Sh.clone().add(V(0.35, 0, 0)), Sh.clone().add(V(1.4, 0, dz * 1.15)), F.clone().add(V(-0.2, 0, dz * 1.25))]);
  const qPl = new THREE.Quaternion();
  const stremenceG = zdruzi(THREE, [
    elipsoidGeo(THREE, Sh, [0.5, 0.45, 0.45], 14),
    cev(THREE, krak(1), { n: 16, rad: 8, r: () => 0.2 }),
    cev(THREE, krak(-1), { n: 16, rad: 8, r: () => 0.2 }),
    elipsoidGeo(THREE, F.clone().add(V(-0.1, 0, 0)), [0.18, 0.7, 1.5], 22, qPl),
  ]);
  const kladivce = mesh(kladivceG, kost, srednji);
  const nakovalce = mesh(nakovalceG, kost, srednji);
  const stremence = mesh(stremenceG, kost, srednji);
  // vrtišče kladivca in nakovalca (os skozi glavico kladivca in kratki krak nakovalca) za nihanje
  const vrtisce = H.clone().lerp(Ib.clone().add(V(0.35, 0.5, -3.3)), 0.5);
  const osVrtenja = Ib.clone().add(V(0.35, 0.5, -3.3)).sub(H).normalize();
  const vzvod = new THREE.Group(); // kladivce + nakovalce
  srednji.add(vzvod); vzvod.add(kladivce, nakovalce);

  // bobnična votlina: zrak, sluznica (gladka ploskev, luknja tam, kjer je bobnič)
  const pd = (x, y, z) => (x - Cd.x) * nb.x + (y - Cd.y) * nb.y + (z - Cd.z) * nb.z;
  const votlinaF = (x, y, z) => {
    let d = elipsoid(x, y, z, [2.4, 0.8, -0.6], [3.4, 5.0, 5.6]);
    d = smin(d, elipsoid(x, y, z, [0.3, 7.6, -0.9], [3.6, 2.7, 4.2]), 2.2);
    d = smin(d, elipsoid(x, y, z, [2.8, -3.2, 0.2], [2.4, 2.0, 3.6]), 1.6);
    d = smin(d, elipsoid(x, y, z, [3.0, -1.0, 5.2], [1.8, 1.8, 2.4]), 1.5);
    return smax(d, pd(x, y, z) + 0.15, 0.6);
  };
  const votlinaG = ploskev(THREE, votlinaF, [-6, -7, -8], [8, 12, 9], visoka ? 0.32 : 0.48, (x, y, z) => {
    const pp = V(x, y, z).sub(Cd), dpl = pp.dot(nb);
    const r = pp.addScaledVector(nb, -dpl).length();
    return !(dpl > -2.6 && r < 4.6);
  });
  const votlina = mesh(votlinaG, sluznica, srednji);
  // Evstahijeva cev: kostni del ozek, hrustančni se proti žrelu razširi
  const es = V(3.0, -1.2, 6.6), ed = V(0.55, -0.55, 0.63).normalize();
  const evK = new THREE.CatmullRomCurve3([es.clone().add(V(-0.4, 0.2, -1.6)), es, es.clone().addScaledVector(ed, 12).add(V(-0.6, 0.6, 0)), es.clone().addScaledVector(ed, 24).add(V(0.4, -0.4, 0.5)), es.clone().addScaledVector(ed, 36)]);
  const evG = ljupina(THREE, evK, { debelina: 0.4, n: visoka ? 60 : 36, rad: visoka ? 16 : 10, r: (u) => 1.1 - 0.5 * s01(0.05, 0.3, u) + 1.0 * s01(0.4, 0.95, u) + 1.3 * s01(0.9, 1, u) });
  evG.deleteAttribute("os");
  const evstahijeva = mesh(evG, evst, srednji);

  // ---------- notranje uho: preddvor, polkrožne cevi z ampulami, polžek, živca
  const Vc = V(8.3, 1.6, -2.2);
  const preddvorG = zdruzi(THREE, [
    elipsoidGeo(THREE, Vc, [1.9, 2.3, 2.7], visoka ? 28 : 18),
    elipsoidGeo(THREE, Vc.clone().add(V(0.3, 0.9, -0.7)), [1.5, 1.6, 2.0], visoka ? 22 : 14), // mešiček (utrikel)
    elipsoidGeo(THREE, Vc.clone().add(V(0.4, -1.1, 0.9)), [1.3, 1.4, 1.4], visoka ? 22 : 14), // vrečica (sakul)
  ]);
  const preddvor = mesh(preddvorG, preddvorM, notranji);
  const ha = V(-1, 0, 1).normalize(), hp = V(-1, 0, -1).normalize(), L = V(-1, 0, 0), Pz = V(0, -0.5, -0.866);
  const rLoka = 3.2;
  const lok = (O, e1, e2, a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => { const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; return O.clone().addScaledVector(e1, rLoka * Math.cos(a)).addScaledVector(e2, rLoka * Math.sin(a)); });
  const Oa = Vc.clone().add(V(0, 4.0, 0));
  const K = Vc.clone().addScaledVector(ha, -1.1).add(V(0, 1.23, 0)); // skupni krak
  const Op = K.clone().addScaledVector(hp, 1.6).add(V(0, -2.77, 0));
  const Ol = Vc.clone().addScaledVector(L, 2.6).addScaledVector(Pz, 0.3).add(V(0, 0.8, 0));
  const vVestibul = (p, f = 0.45) => Vc.clone().lerp(p, f);
  const kanali = [
    { ime: "sprednja", t: lok(Oa, ha, Y, -60, 240, 18) },
    { ime: "zadnja", t: lok(Op, hp, Y, 120, -170, 20) },
    { ime: "stranska", t: lok(Ol, L, Pz, -120, 130, 18) },
  ];
  const cevGeo = [], ampGeo = [], ampTocke = [];
  for (const k of kanali) {
    const t = k.t;
    const pts = [vVestibul(t[0]), ...t, vVestibul(t[t.length - 1])];
    if (k.ime === "zadnja") pts[pts.length - 1] = vVestibul(t[t.length - 1], 0.55);
    if (k.ime === "sprednja") pts[pts.length - 1] = K.clone().add(V(0.25, -0.9, -0.1));
    const kr = new THREE.CatmullRomCurve3(pts);
    // ampula na sprednjem koncu sprednje in stranske, na spodnjem koncu zadnje cevi
    const uA = k.ime === "zadnja" ? 0.9 : 0.1;
    cevGeo.push(cev(THREE, kr, { n: visoka ? 70 : 44, rad: visoka ? 12 : 8, r: () => 0.42 }));
    const pa = kr.getPointAt(uA), ta = kr.getTangentAt(uA);
    ampGeo.push(elipsoidGeo(THREE, pa, [0.95, 0.95, 1.35], visoka ? 18 : 12, new THREE.Quaternion().setFromUnitVectors(Z, ta)));
    ampTocke.push(pa);
  }
  // skupni krak do preddvora
  cevGeo.push(cev(THREE, new THREE.CatmullRomCurve3([K.clone().add(V(0.25, -0.9, -0.1)), K.clone().add(V(0.25, -1.6, -0.1)), vVestibul(K, 0.3)]), { n: 10, rad: visoka ? 12 : 8, r: () => 0.5 }));
  const cevi = mesh(zdruzi(THREE, cevGeo.map((g) => (g.deleteAttribute("os"), g))), cevM, notranji);
  const ampule = mesh(zdruzi(THREE, ampGeo), ampulaM, notranji);

  // polžek: spirala z 2¾ zavoja okoli vretena
  const Bc = V(10.6, -0.6, 2.6), aP = V(-0.75, -0.2, 0.62).normalize();
  const e1 = Vc.clone().sub(Bc); e1.addScaledVector(aP, -e1.dot(aP)).normalize();
  const e2 = new THREE.Vector3().crossVectors(aP, e1).normalize();
  if (e2.x > 0) e2.negate();
  const FI = MERE.zavojiPolzka * 2 * Math.PI;
  const rho = (f) => 3.5 * Math.pow(0.9 / 3.5, f / FI);
  const vis = (f) => 0.5 + 3.6 * Math.pow(f / FI, 1.1);
  const tocPolz = (f, dr = 0, dh = 0) => Bc.clone().addScaledVector(aP, vis(f) + dh).addScaledVector(e1, (rho(f) + dr) * Math.cos(f)).addScaledVector(e2, (rho(f) + dr) * Math.sin(f));
  const NSP = 90;
  const spirala = Array.from({ length: NSP + 1 }, (_, i) => tocPolz((FI * i) / NSP));
  const polzK = new THREE.CatmullRomCurve3([Vc.clone().add(V(0.6, -0.9, 1.5)), ...spirala]);
  const rPolz = (u) => 1.05 - 0.55 * Math.pow(u, 0.8);
  const NPZ = visoka ? 260 : 150, RPZ = visoka ? 16 : 10;
  const polzG = ljupina(THREE, polzK, { n: NPZ, rad: RPZ, r: (u) => rPolz(u), debelina: (u) => 0.24 * rPolz(u) });
  {
    // vrh polžka zapremo s kapico
    const apex = spirala[NSP], ta = polzK.getTangentAt(1);
    polzG.userData.kapica = elipsoidGeo(THREE, apex, [0.5, 0.5, 0.5], 12, new THREE.Quaternion().setFromUnitVectors(Z, ta));
  }
  const polzU = new Float32Array(polzG.attributes.position.count);
  for (let i = 0; i < polzU.length; i++) polzU[i] = polzG.attributes.uv.getX(i);
  const POLZ_BARVA = new THREE.Color("#c7a3e2"), VAL_BARVA = new THREE.Color("#ffc23d"); // val v polžku: topla barva, ki se jasno loči od vijoličnega polžka
  const polzBarve = new Float32Array(polzG.attributes.position.count * 3);
  for (let i = 0; i < polzU.length; i++) POLZ_BARVA.toArray(polzBarve, i * 3);
  polzG.setAttribute("color", new THREE.BufferAttribute(polzBarve, 3));
  polzG.deleteAttribute("os");
  const kap = polzG.userData.kapica;
  const kapBarve = new Float32Array(kap.attributes.position.count * 3);
  for (let i = 0; i < kap.attributes.position.count; i++) POLZ_BARVA.toArray(kapBarve, i * 3);
  kap.setAttribute("color", new THREE.BufferAttribute(kapBarve, 3));
  const polzek = mesh(polzG, polzekM, notranji);
  const polzKapica = mesh(kap, polzekM, notranji);
  // notranjost polžka (vidna v prerezu): polžev kanal, vreteno in kostna spiralna lamela
  const kanalPts = Array.from({ length: NSP + 1 }, (_, i) => { const f = (FI * i) / NSP; return tocPolz(f, 0.38 * rPolz(i / NSP), 0.05); });
  const kanalK = new THREE.CatmullRomCurve3(kanalPts);
  const kanalG = cev(THREE, kanalK, { n: visoka ? 220 : 120, rad: visoka ? 10 : 7, r: (u) => 0.36 * rPolz(u), pokrovi: true });
  const kanalU = kanalG.attributes.uv;
  const kanalBarve = new Float32Array(kanalG.attributes.position.count * 3);
  const KANAL_BARVA = new THREE.Color("#6f9bff");
  for (let i = 0; i < kanalG.attributes.position.count; i++) KANAL_BARVA.toArray(kanalBarve, i * 3);
  kanalG.setAttribute("color", new THREE.BufferAttribute(kanalBarve, 3));
  kanalG.deleteAttribute("os");
  const polzevKanal = mesh(kanalG, kanalM, notranji);
  const vretenoProfil = [V(0.001, 0, 0), V(1.5, 0, 0), V(1.2, 1.2, 0), V(0.8, 2.6, 0), V(0.45, 3.8, 0), V(0.25, 4.4, 0), V(0.001, 4.5, 0)].map((p) => new THREE.Vector2(p.x, p.y));
  const vretenoG = new THREE.LatheGeometry(vretenoProfil, visoka ? 24 : 14);
  vretenoG.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(Y, aP));
  vretenoG.translate(Bc.x, Bc.y, Bc.z);
  vretenoG.deleteAttribute("uv");
  const lamelaPos = [], lamelaIdx = [];
  const NL = 120;
  for (let i = 0; i <= NL; i++) {
    const f = (FI * i) / NL, u = i / NL;
    const rm = Math.max(0.3, 1.4 - 0.25 * (vis(f) - 0.5));
    const a = Bc.clone().addScaledVector(aP, vis(f)).addScaledVector(e1, rm * Math.cos(f)).addScaledVector(e2, rm * Math.sin(f));
    const b = tocPolz(f, 0.1 * rPolz(u), -0.05);
    lamelaPos.push(a.x, a.y, a.z, b.x, b.y, b.z);
    if (i < NL) lamelaIdx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 1, 2 * i + 3, 2 * i + 2);
  }
  const lamelaG = new THREE.BufferGeometry();
  lamelaG.setAttribute("position", new THREE.Float32BufferAttribute(lamelaPos, 3));
  lamelaG.setIndex(lamelaIdx);
  lamelaG.computeVertexNormals();
  const vretenoM = mat({ color: "#efe3c9", roughness: 0.6, side: THREE.DoubleSide });
  const vreteno = mesh(zdruzi(THREE, [vretenoG, lamelaG]), vretenoM, notranji);

  // živca: slušni iz vretena polžka, ravnotežni iz preddvora in ampul; skupaj gresta proti možganskemu deblu
  const sluhG2 = cev(THREE, new THREE.CatmullRomCurve3([Bc.clone().addScaledVector(aP, 1.2), Bc.clone().addScaledVector(aP, -0.6), V(14, 0.2, 1.0), V(18, 0.9, 0.1), V(21.5, 1.25, -0.3)]), { n: 40, rad: 12, r: (u) => 0.42 + 0.14 * s01(0, 0.3, u), pokrovi: true }); // premer ≈ 1 mm
  sluhG2.deleteAttribute("os");
  const slusni = mesh(sluhG2, sluhM, notranji);
  const ravnGeo = [
    cev(THREE, new THREE.CatmullRomCurve3([Vc.clone().add(V(1.0, 0.3, 0)), Vc.clone().add(V(2.4, 0.4, 0.2)), V(13.5, 2.0, -1.0), V(17.5, 2.0, -0.4), V(21.5, 2.25, -0.4)]), { n: 36, rad: 10, r: () => 0.48, pokrovi: true }),
    cev(THREE, new THREE.CatmullRomCurve3([ampTocke[0], ampTocke[0].clone().lerp(Vc, 0.5).add(V(1.4, 0.5, 0)), Vc.clone().add(V(2.4, 0.4, 0.2))]), { n: 16, rad: 6, r: () => 0.2 }),
    cev(THREE, new THREE.CatmullRomCurve3([ampTocke[2], ampTocke[2].clone().lerp(Vc, 0.5).add(V(1.6, 0.2, 0)), Vc.clone().add(V(2.4, 0.4, 0.2))]), { n: 16, rad: 6, r: () => 0.2 }),
    cev(THREE, new THREE.CatmullRomCurve3([ampTocke[1], ampTocke[1].clone().lerp(Vc, 0.5).add(V(1.4, -0.3, 0)), Vc.clone().add(V(2.4, 0.4, 0.2))]), { n: 16, rad: 6, r: () => 0.2 }),
  ];
  const ravnotezni = mesh(zdruzi(THREE, ravnGeo.map((g) => (g.deleteAttribute("os"), g))), ravnM, notranji);

  // ---------- tkivo okoli (vidno v prerezu): koža s podkožjem in senčnica
  const sluhVzorec = sluhovodK.getSpacedPoints(48);
  const luknja = (x, y, z, dodatek) => {
    if (x > 1 || Math.abs(y - 2) > 8 || Math.abs(z) > 8) return 99;
    let best = 1e9;
    for (let i = 0; i < sluhVzorec.length - 1; i++) {
      const a = sluhVzorec[i], b = sluhVzorec[i + 1];
      const abx = b.x - a.x, aby = b.y - a.y, abz = b.z - a.z;
      const t = Math.min(1, Math.max(0, ((x - a.x) * abx + (y - a.y) * aby + (z - a.z) * abz) / (abx * abx + aby * aby + abz * abz)));
      const dx = x - a.x - abx * t, dy = y - a.y - aby * t, dz = z - a.z - abz * t;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) - rSluh((i + t) / (sluhVzorec.length - 1)) - dodatek;
      if (d < best) best = d;
    }
    return best;
  };
  const hT = visoka ? 0.7 : 1.0;
  // del glave: koža s podkožjem (≈ 7 mm) na krogli glave, pod njo kost; omejeno z gladkim elipsoidom
  const glava = (x, y, z) => Math.hypot(x - 70, y, z);
  const meja = (x, y, z) => elipsoid(x, y, z, [-2, 0.8, -0.5], [27, 15.5, 15.5]);
  const mehkoG = ploskev(THREE, (x, y, z) => { const g = glava(x, y, z); return smax(smax(smax(g - 95, 87.9 - g, 0.4), meja(x, y, z), 2.5), -luknja(x, y, z, 0.25), 0.5); }, [-27, -17, -17], [-12, 18, 16], hT);
  const sencnicaG = ploskev(THREE, (x, y, z) => smax(smax(glava(x, y, z) - 87.7, meja(x, y, z), 2.5), -luknja(x, y, z, 0.25), 0.5), [-20, -17, -17], [26, 18, 16], hT);
  const mehko = mesh(mehkoG, mehkoM, tkivo);
  const sencnica = mesh(sencnicaG, sencnicaM, tkivo);

  // ---------- zvočni valovi v sluhovodu
  const valG = new THREE.TorusGeometry(1, 0.07, 6, visoka ? 48 : 32);
  const valM = mat({ color: "#7fb4ff", transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }, THREE.MeshBasicMaterial);
  const NV = 5;
  const valovi = new THREE.InstancedMesh(valG, valM, NV);
  valovi.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  valovi.frustumCulled = false;
  valovi.visible = false;
  geos.push(valG);
  zunanji.add(valovi);

  vsebina.add(zunanji, srednji, notranji, tkivo);

  // ---------- pogledi, prerez, merilo
  // povečano notranje uho: prerez polžka skozi vreteno je obrnjen proti gledalcu (kot na sliki v učbeniku)
  const ZASUK_NOTRANJE = -0.55;
  const stanje = { prikaz: "celo", prerez: true, zvok: -1, staticno: false };
  const ravnPrerez = new THREE.Plane(V(0, 0, -1), 0); // obdrži zadnjo polovico (z ≤ 0)
  const nPol = V(-0.187, 0.27, 0.943); nPol.addScaledVector(aP, -nPol.dot(aP)).normalize();
  const ravnPolz = new THREE.Plane(nPol.clone().negate(), nPol.dot(Bc));
  const svetPrerez = ravnPrerez.clone(), svetPolz = ravnPolz.clone();
  let srediste = V(0, 0, 0), merSkala = 1;
  // Središče in polmer v koordinatah vsebine (mm); vsebina je takrat brez preslikave.
  const okvir = (objekti) => {
    const box = new THREE.Box3(), v = new THREE.Vector3();
    const tocke = [];
    for (const o of objekti) o.traverse((m) => {
      if (!m.isMesh || m.isInstancedMesh) return;
      const p = m.geometry.attributes.position;
      for (let i = 0; i < p.count; i += 2) { v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld); box.expandByPoint(v); tocke.push(v.x, v.y, v.z); }
    });
    const c = box.getCenter(new THREE.Vector3());
    let R = 0;
    for (let i = 0; i < tocke.length; i += 3) R = Math.max(R, Math.hypot(tocke[i] - c.x, tocke[i + 1] - c.y, tocke[i + 2] - c.z));
    return { c, R };
  };
  const zasuk = (42 * Math.PI) / 180;
  function postavi() {
    const celo = stanje.prikaz === "celo";
    vsebina.clear();
    if (celo) vsebina.add(zunanji, srednji, notranji);
    else vsebina.add(notranji);
    if (celo && stanje.prerez) vsebina.add(tkivo);
    stremence.removeFromParent();
    (celo ? srednji : notranji).add(stremence);
    vsebina.position.set(0, 0, 0); vsebina.rotation.set(0, 0, 0); vsebina.scale.setScalar(1);
    group.updateMatrixWorld(true);
    const { c, R } = celo ? okvir([zunanji, srednji, notranji]) : okvir([preddvor, cevi, ampule, polzek]);
    srediste = c; merSkala = (celo ? 1 : 0.92) / R;
    vsebina.scale.setScalar(merSkala);
    vsebina.rotation.set(0, celo ? zasuk : ZASUK_NOTRANJE, 0);
    vsebina.position.set(0, 0, 0);
    vsebina.updateMatrix();
    const cc = c.clone().applyMatrix4(vsebina.matrix);
    vsebina.position.copy(cc.negate());
    vsebina.updateMatrix();
    vsebina.updateMatrixWorld(true);
    svetPrerez.copy(ravnPrerez).applyMatrix4(vsebina.matrix);
    svetPolz.copy(ravnPolz).applyMatrix4(vsebina.matrix);
    const pr = stanje.prerez;
    for (const m of [mehkoM, sencnicaM, sluznica, kozaNotri]) m.clippingPlanes = pr && celo ? [svetPrerez] : null;
    for (const m of [polzekM, kanalM, vretenoM]) m.clippingPlanes = pr ? [svetPolz] : null;
    polzevKanal.visible = vreteno.visible = pr;
    sluznica.opacity = pr || !celo ? 1 : 0.22;
    sluznica.depthWrite = sluznica.opacity === 1;
    sluznica.transparent = sluznica.opacity < 1;
    for (const m of mats) m.needsUpdate = true;
    for (const d of vsiDeli) d.tocka.splice(0, 3, ...d.mm.clone().applyMatrix4(vsebina.matrix).toArray());
  }

  const vsiDeli = [
    { id: "uhelj", ime: "Uhelj", opis: "Hrustančni del uha, prekrit s kožo, ki zbira zvok in ga usmerja v sluhovod.", barva: "#f0a58c", meshes: [zunanji.children[0]], mm: vSvet(-15, 26, globina(0.66, 140)), pogled: "celo" },
    { id: "sluhovod", ime: "Sluhovod", opis: "Okoli 2,5 cm dolg kanal do bobniča; žleze v koži sluhovoda izločajo ušesno maslo, ki lovi prah.", barva: "#e07f6b", meshes: [sluhovod], mm: sluhovodK.getPointAt(0.42).add(V(0, -2.6, -1.2)), pogled: "celo" },
    { id: "bobnic", ime: "Bobnič", opis: "Tanka napeta opna med zunanjim in srednjim ušesom, ki zaniha, ko jo zadenejo zvočni valovi.", barva: "#d9ccd3", meshes: [bobnic], mm: Cd.clone().addScaledVector(nb, -0.6).addScaledVector(gor, -2.6), pogled: "celo" },
    { id: "kladivce", ime: "Kladivce", opis: "Prva slušna koščica: z ročajem je priraslo na bobnič in prevzame njegovo nihanje.", barva: "#f2e2bf", meshes: [kladivce], mm: H.clone().add(V(-0.6, 0.9, 0.6)), pogled: "celo" },
    { id: "nakovalce", ime: "Nakovalce", opis: "Srednja slušna koščica, ki nihanje prenese s kladivca na stremence.", barva: "#e8d6a8", meshes: [nakovalce], mm: Ib.clone().add(V(0.4, 0.4, -1.0)), pogled: "celo" },
    { id: "stremence", ime: "Stremence", opis: "Najmanjša kost v telesu (okoli 3 mm), ki s ploščico v ovalnem okencu potiska tekočino v notranjem ušesu.", barva: "#dcc690", meshes: [stremence], mm: Sh.clone().add(V(1.4, 0.4, 0)), pogled: "oba" },
    { id: "votlina", ime: "Bobnična votlina", opis: "Z zrakom napolnjen prostor srednjega ušesa, v katerem so tri slušne koščice.", barva: "#e3918c", meshes: [votlina], mm: V(3.6, -3.4, -1.5), pogled: "celo" },
    { id: "evstahijeva", ime: "Evstahijeva cev", opis: "Povezuje srednje uho z žrelom in izenačuje tlak na obeh straneh bobniča, zato nam ob požiranju »poči« v ušesih.", barva: "#e7a59b", meshes: [evstahijeva], mm: evK.getPointAt(0.62), pogled: "celo" },
    { id: "polzek", ime: "Polžek", opis: "S tekočino napolnjena spiralna cev z 2¾ zavoja, v kateri čutnice spremenijo nihanje v živčne signale.", barva: "#c7a3e2", meshes: [polzek, polzKapica], mm: tocPolz(Math.PI * 0.9, 0.9), pogled: "oba" },
    { id: "polzev-kanal", ime: "Polžev kanal s Cortijevim organom", opis: "Srednji kanal polžka; v njem so čutnice z dlačicami, ki zaznajo valovanje tekočine.", barva: "#6f9bff", meshes: [polzevKanal], mm: tocPolz(Math.PI * 2.2, 0.38), pogled: "notranje", prerez: true },
    { id: "polkrozne-cevi", ime: "Polkrožne cevi", opis: "Tri s tekočino napolnjene cevi v treh med seboj pravokotnih ravninah, ki zaznavajo vrtenje glave.", barva: "#84d0c3", meshes: [cevi], mm: Oa.clone().addScaledVector(Y, rLoka), pogled: "oba" },
    { id: "ampule", ime: "Ampule", opis: "Razširjeni konci polkrožnih cevi s čutnicami, ki zaznajo, ko se tekočina ob vrtenju glave premakne.", barva: "#f0b65e", meshes: [ampule], mm: ampTocke[2].clone(), pogled: "notranje" },
    { id: "preddvor", ime: "Preddvor", opis: "Osrednji del notranjega ušesa z dvema mešičkoma, ki zaznavata lego glave in pospešeno gibanje.", barva: "#9dc5ea", meshes: [preddvor], mm: Vc.clone().add(V(-0.4, -1.8, -1.2)), pogled: "notranje" },
    { id: "slusni-zivec", ime: "Slušni živec", opis: "Del slušnega in ravnotežnega živca, ki signale iz polžka prevaja v možgane, kjer jih zaznamo kot zvok.", barva: "#f1d26a", meshes: [slusni], mm: V(17, 0.6, 0.4), pogled: "oba" },
    { id: "ravnotezni-zivec", ime: "Ravnotežni živec", opis: "Del slušnega in ravnotežnega živca, ki prevaja signale iz preddvora in polkrožnih cevi v možgane za ravnotežje.", barva: "#cfe07a", meshes: [ravnotezni], mm: V(15.5, 2.0, -0.8), pogled: "notranje" },
    { id: "sencnica", ime: "Senčnica", opis: "Kost lobanje, v kateri sta srednje in notranje uho varno skriti; notranje uho leži v njenem najtršem delu, skalnici.", barva: "#e9dcc2", meshes: [sencnica], mm: V(4, 11.5, -6), pogled: "celo", prerez: true },
    { id: "koza", ime: "Koža in podkožje", opis: "Mehko tkivo glave okoli vhoda v sluhovod; zunanji del sluhovoda ima hrustančno ogrodje.", barva: "#e0a391", meshes: [mehko], mm: V(-20.5, -9, -5), pogled: "celo", prerez: true },
  ];
  for (const d of vsiDeli) d.tocka = [0, 0, 0];
  let deli = [];
  const izberiDele = () => {
    const celo = stanje.prikaz === "celo";
    // drobne dele notranjega ušesa pokažemo le v povečanem pogledu, da se točke v celem ušesu ne prekrivajo
    deli = vsiDeli.filter((d) => (d.pogled === "oba" || d.pogled === (celo ? "celo" : "notranje")) && (!d.prerez || stanje.prerez));
  };

  // ---------- zvok: valovi, nihanje bobniča in koščic, valovanje tekočine v polžku, signal po živcu
  const TRAJANJE = 5.2;
  const pot = (u, out) => {
    if (u >= 0) return sluhovodK.getPointAt(Math.min(1, u * 0.93), out);
    return out.copy(E).addScaledVector(X, (u / 0.35) * 16).addScaledVector(Y, (u / 0.35) * -1.5);
  };
  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), p4 = new THREE.Vector3(), s4 = new THREE.Vector3(), t4 = new THREE.Vector3();
  const pBob = bobnicG.attributes.position;
  let zadnjiKorak = -1e9;
  const zdaj = () => (typeof performance !== "undefined" ? performance.now() : Date.now());
  function nastaviZvok(t) {
    // t < 0: mirovanje
    const tece = t >= 0;
    const st = stanje.staticno;
    valovi.visible = tece;
    let odmik = 0;
    if (tece) {
      for (let i = 0; i < NV; i++) {
        const u = st ? -0.25 + i * 0.27 : -0.35 + t * 0.62 - i * 0.2;
        const vid = u >= -0.35 && u <= 1;
        const uu = Math.max(-0.35, Math.min(1, u));
        pot(uu, p4);
        if (uu >= 0) t4.copy(sluhovodK.getTangentAt(Math.min(1, uu * 0.93))); else t4.copy(X);
        q4.setFromUnitVectors(Z, t4);
        const r = uu >= 0 ? rSluh(uu * 0.93) * 0.88 : R0 * 0.88 + (-uu / 0.35) * 6;
        const sv = vid ? 1 - s01(0.85, 1, u) : 0;
        s4.set(r * sv, r * sv, r * sv);
        m4.compose(p4, q4, s4);
        valovi.setMatrixAt(i, m4);
      }
      valovi.instanceMatrix.needsUpdate = true;
      const ovoj = st ? 1 : s01(0.75, 1.1, t) * (1 - s01(3.2, 4.2, t));
      odmik = st ? 0.35 : 0.45 * ovoj * Math.sin(2 * Math.PI * 2.2 * (t - 0.75));
    }
    // bobnič se upogne (sredina najbolj)
    for (let i = 0; i < pBob.count; i++) {
      const w = odmik * Math.pow(1 - bobnicS[i], 1.2);
      pBob.setXYZ(i, bobnicOsnova[3 * i] - nb.x * w, bobnicOsnova[3 * i + 1] - nb.y * w, bobnicOsnova[3 * i + 2] - nb.z * w);
    }
    pBob.needsUpdate = true;
    bobnicG.computeVertexNormals();
    // kladivce in nakovalce se zavrtita kot vzvod, stremence potiska kot bat
    const kotV = odmik / 6.5;
    vzvod.position.copy(vrtisce).negate().applyAxisAngle(osVrtenja, kotV).add(vrtisce);
    vzvod.quaternion.setFromAxisAngle(osVrtenja, kotV);
    const potisk = kotV * (H.y - Sh.y) * 0.95;
    stremence.position.set(potisk, 0, 0);
    // val po polžku od ovalnega okenca proti vrhu; največji odmik je na mestu, ki ustreza višini tona
    const cB = polzG.attributes.color, cK = kanalG.attributes.color;
    const fronta = st ? 0.62 : Math.min(1, Math.max(0, (t - 1.1) / 1.5));
    const ovoj2 = !tece ? 0 : st ? 1 : s01(1.0, 1.3, t) * (1 - s01(3.6, 4.4, t));
    const vrh = 0.48;
    const jakost = (u) => {
      if (ovoj2 === 0 || u > fronta + 0.03) return 0;
      const A = u < vrh ? 0.25 + 0.75 * Math.pow(u / vrh, 2) : Math.exp(-(((u - vrh) / 0.06) ** 2));
      const val = 0.5 + 0.5 * Math.cos(2 * Math.PI * (u / 0.075 - (st ? 0 : 2.2 * t)));
      return ovoj2 * A * (0.35 + 0.65 * val) * (1 - s01(fronta - 0.01, fronta + 0.03, u));
    };
    for (let i = 0; i < polzU.length; i++) {
      const j = jakost(polzU[i]);
      cB.setXYZ(i, POLZ_BARVA.r + (VAL_BARVA.r - POLZ_BARVA.r) * j * 1.2, POLZ_BARVA.g + (VAL_BARVA.g - POLZ_BARVA.g) * j * 1.2, POLZ_BARVA.b + (VAL_BARVA.b - POLZ_BARVA.b) * j * 1.2);
    }
    cB.needsUpdate = true;
    for (let i = 0; i < cK.count; i++) {
      const j = jakost(kanalU.getX(i));
      cK.setXYZ(i, KANAL_BARVA.r + j * 0.9, KANAL_BARVA.g + j * 0.7, KANAL_BARVA.b + j * 0.2);
    }
    cK.needsUpdate = true;
    sluhM.emissiveIntensity = !tece ? 0 : st ? 0.55 : 0.75 * s01(2.2, 2.6, t) * (1 - s01(3.8, 4.6, t));
  }

  function zacniZvok() {
    if (stanje.zvok >= 0 && stanje.staticno) { stanje.zvok = -1; stanje.staticno = false; nastaviZvok(-1); return; }
    const premika = gibanje && zdaj() - zadnjiKorak < 400;
    stanje.staticno = !premika;
    stanje.zvok = 0;
    nastaviZvok(0);
  }

  const nadzor = [
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["celo", "Celo uho"], ["notranje", "Notranje uho (povečano)"]], vrednost: "celo",
      ob: (v) => { stanje.prikaz = v === "notranje" ? "notranje" : "celo"; postavi(); izberiDele(); } },
    { tip: "stikalo", id: "prerez", oznaka: "Prerez", vrednost: true, ob: (v) => { stanje.prerez = !!v; postavi(); izberiDele(); } },
    { tip: "gumb", id: "zvok", oznaka: "Zvok", ob: zacniZvok },
  ];
  const zac = ctx.zacetek || {};
  if (zac.prikaz === "notranje") { stanje.prikaz = "notranje"; nadzor[0].vrednost = "notranje"; }
  if (zac.prerez === false || zac.prerez === "false" || zac.prerez === "0") { stanje.prerez = false; nadzor[1].vrednost = false; }
  postavi();
  izberiDele();
  nastaviZvok(-1);

  return {
    group,
    get deli() { return deli; },
    nadzor,
    get merilo() {
      const m = 2 / merSkala / 1000;
      return { m, oznaka: m >= 0.01 ? `${String(Math.round(m * 1000) / 10).replace(".", ",")} cm` : `${String(Math.round(m * 10000) / 10).replace(".", ",")} mm` };
    },
    korak(t, dt) {
      zadnjiKorak = zdaj();
      if (stanje.zvok < 0 || stanje.staticno) return;
      if (!gibanje) return;
      stanje.zvok += Math.min(dt, 0.1);
      if (stanje.zvok > TRAJANJE) { stanje.zvok = -1; nastaviZvok(-1); return; }
      nastaviZvok(stanje.zvok);
    },
    dispose() {
      for (const g of geos) g.dispose();
      for (const m of mats) { m.map?.dispose(); m.dispose(); }
    },
  };
}
