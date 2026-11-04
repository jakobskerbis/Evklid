// Kost v prerezu: stegnenica mladostnika (z rastnima ploščicama) in povečan osteon. Pogodba: docs/3d.md.
//
// Mere iz anatomskih virov (Gray's Anatomy, 42. izd., ur. Standring 2020; Clarke 2008, Clin J Am Soc Nephrol 3, S131;
// Cowin, Bone Mechanics Handbook 2001): stegnenica ≈ 43 cm, premer glavice ≈ 4,6 cm, kot med vratom in telesom
// ≈ 125°, telo ≈ 2,7 cm debelo s steno kompaktne kostnine ≈ 6 mm, sklepni hrustanec 2–3 mm, osteon ≈ 0,2 mm
// (Haversov kanal ≈ 50 µm, lamele 3–7 µm), lakune ≈ 20 × 10 µm. Oblika kosti je gladka približna oblika.
// Pokostnica in rastna ploščica sta debelejši kot v resnici (≈ 1,5 mm in 3 mm), da se vidita; gredice gobaste
// kostnine so redkejše in debelejše, lamele osteona manj številne.

export const info = {
  id: "organ-kost",
  naslov: "Kost v prerezu",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Stegnenica mladostnika z odrezano četrtino: sklepni hrustanec, pokostnica, kompaktna in gobasta kostnina, rdeči in rumeni kostni mozeg ter rastni ploščici. Povečava pokaže osteone s Haversovim kanalom, lamelami in kostnimi celicami.",
  merilo: { m: 0.44, oznaka: "44 cm" },
};

export const MERE = { dolzina: 43, kotVratu: 125, stena: 0.6, osteon: 0.2 };

// ---------------------------------------------------------------- orodja (brez uvozov)
const s01 = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - (h * h * k) / 4; };
const smax = (a, b, k) => -smin(-a, -b, k);

function elipsoid(x, y, z, c, r) {
  const dx = (x - c[0]) / r[0], dy = (y - c[1]) / r[1], dz = (z - c[2]) / r[2];
  return (Math.sqrt(dx * dx + dy * dy + dz * dz) - 1) * Math.min(r[0], r[1], r[2]);
}
const ROBOVI = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
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


// Gladka ploskev iz mreže vrednosti (»surface nets«), normale iz gradienta mreže.
function ploskevMreze(THREE, val, nx, ny, nz, lo, h, obdrzi = null) {
  const at = (i, j, k) => val[i + nx * (j + ny * k)];
  const cx = nx - 1, cy = ny - 1, cz = nz - 1;
  const vid = new Int32Array(cx * cy * cz).fill(-1);
  const pos = [], nor = [];
  const cv = new Float32Array(8);
  const grad = (i, j, k, o) => {
    const i0 = Math.max(0, i - 1), i1 = Math.min(cx, i + 1), j0 = Math.max(0, j - 1), j1 = Math.min(cy, j + 1), k0 = Math.max(0, k - 1), k1 = Math.min(cz, k + 1);
    o[0] = (at(i1, j, k) - at(i0, j, k)) / (i1 - i0); o[1] = (at(i, j1, k) - at(i, j0, k)) / (j1 - j0); o[2] = (at(i, j, k1) - at(i, j, k0)) / (k1 - k0);
  };
  const g = [0, 0, 0];
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
    sx /= n; sy /= n; sz /= n;
    vid[i + cx * (j + cy * k)] = pos.length / 3;
    pos.push(lo[0] + (i + sx) * h, lo[1] + (j + sy) * h, lo[2] + (k + sz) * h);
    let nx_ = 0, ny_ = 0, nz_ = 0;
    for (let c = 0; c < 8; c++) {
      const dx = c & 1, dy = (c >> 1) & 1, dz = (c >> 2) & 1;
      const w = (dx ? sx : 1 - sx) * (dy ? sy : 1 - sy) * (dz ? sz : 1 - sz);
      grad(i + dx, j + dy, k + dz, g);
      nx_ += w * g[0]; ny_ += w * g[1]; nz_ += w * g[2];
    }
    const l = Math.hypot(nx_, ny_, nz_) || 1;
    nor.push(nx_ / l, ny_ / l, nz_ / l);
  }
  const cel = (i, j, k) => vid[i + cx * (j + cy * k)];
  const idx = [];
  const P = (v) => [pos[3 * v], pos[3 * v + 1], pos[3 * v + 2]];
  function quad(a, b, c, d, os, znotraj) {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    const pa = P(a), pc = P(c), pb = P(b), pd = P(d);
    if (obdrzi && !obdrzi((pa[0] + pc[0]) / 2, (pa[1] + pc[1]) / 2, (pa[2] + pc[2]) / 2)) return;
    const u = [pc[0] - pa[0], pc[1] - pa[1], pc[2] - pa[2]], v = [pd[0] - pb[0], pd[1] - pb[1], pd[2] - pb[2]];
    const nn = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    if ((nn[os] > 0) === znotraj) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c);
  }
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const v0 = at(i, j, k) < 0;
    if (i < cx && j > 0 && k > 0 && j < cy && k < cz && v0 !== (at(i + 1, j, k) < 0)) quad(cel(i, j - 1, k - 1), cel(i, j, k - 1), cel(i, j, k), cel(i, j - 1, k), 0, v0);
    if (j < cy && i > 0 && k > 0 && i < cx && k < cz && v0 !== (at(i, j + 1, k) < 0)) quad(cel(i - 1, j, k - 1), cel(i - 1, j, k), cel(i, j, k), cel(i, j, k - 1), 1, v0);
    if (k < cz && i > 0 && j > 0 && i < cx && j < cy && v0 !== (at(i, j, k + 1) < 0)) quad(cel(i - 1, j - 1, k), cel(i, j - 1, k), cel(i, j, k), cel(i - 1, j, k), 2, v0);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  geo.setIndex(idx);
  return geo;
}

// ---------------------------------------------------------------- model
export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const Y = V(0, 1, 0);
  const group = new THREE.Group();
  group.name = "organ-kost";
  const kostG = new THREE.Group(), osteonG = new THREE.Group();
  const geos = [], mats = [];
  const mesh = (g, m, parent) => { geos.push(g); const o = new THREE.Mesh(g, m); parent.add(o); return o; };
  const kmat = (p) => { const m = kapa(THREE, p); mats.push(m); return m; };
  const mat = (p, Tip = THREE.MeshPhysicalMaterial) => { const m = new Tip(p); mats.push(m); return m; };

  // ================================================================ stegnenica (cm; x proti sredini telesa, z naprej)
  const nd = V(0.82, 0.57, 0.2).normalize(); // os vratu
  const Hc = V(4.1, 17.85, 1.0), RG = 2.3; // glavica
  const N0 = V(0.25, 14.7, 0.1);
  const kapsula = (x, y, z, a, b, r) => {
    const abx = b.x - a.x, aby = b.y - a.y, abz = b.z - a.z;
    const t = Math.min(1, Math.max(0, ((x - a.x) * abx + (y - a.y) * aby + (z - a.z) * abz) / (abx * abx + aby * aby + abz * abz)));
    return Math.hypot(x - a.x - abx * t, y - a.y - aby * t, z - a.z - abz * t) - r;
  };
  function kostSDF(x, y, z) {
    const yc = Math.max(-17.5, Math.min(15.5, y));
    const cz = 0.5 * (1 - (yc / 17) ** 2) - 0.25, cx = -0.15 * (yc / 17);
    const r = 1.35 + 0.42 * s01(5, 15.5, yc) + 1.0 * s01(-9.5, -17.5, yc);
    const dx = x - cx, dz = z - cz;
    let d = Math.hypot(dx, y - yc, dz * 1.04) - r;
    const kot = Math.atan2(dx, -dz); // 0 = zadaj (linea aspera)
    d -= 0.28 * Math.exp(-((kot / 0.32) ** 2)) * s01(-13, -6, y) * (1 - s01(6, 12, y));
    d = smin(d, kapsula(x, y, z, N0, Hc, 1.5), 1.3);
    d = smin(d, Math.hypot(x - Hc.x, y - Hc.y, z - Hc.z) - RG, 0.6);
    d = smin(d, elipsoid(x, y, z, [-1.85, 16.4, -0.35], [1.55, 2.3, 1.75]), 1.4);
    d = smin(d, elipsoid(x, y, z, [1.3, 12.7, -0.95], [0.8, 1.0, 0.75]), 0.9);
    d = smin(d, elipsoid(x, y, z, [0.0, -18.2, -0.3], [3.4, 2.6, 2.1]), 1.6);
    d = smin(d, elipsoid(x, y, z, [2.15, -20.6, -0.55], [1.35, 2.0, 2.6]), 0.9);
    d = smin(d, elipsoid(x, y, z, [-2.1, -20.4, -0.5], [1.4, 2.0, 2.6]), 0.9);
    d = smin(d, elipsoid(x, y, z, [3.35, -19.5, -0.4], [0.6, 0.9, 0.9]), 0.7);
    d = smin(d, elipsoid(x, y, z, [-3.35, -19.3, -0.4], [0.6, 0.9, 0.9]), 0.7);
    d = smax(d, -elipsoid(x, y, z, [0.0, -21.6, -2.0], [0.85, 2.0, 1.7]), 0.5); // medčvrščna jama
    d = smax(d, -elipsoid(x, y, z, [0.0, -19.4, 2.55], [0.95, 2.4, 0.75]), 0.6); // žleb za pogačico
    return d;
  }
  const h = visoka ? 0.27 : 0.4;
  const lo = [-4.4, -23.2, -3.8], hi = [6.9, 20.7, 3.9];
  const nx = Math.ceil((hi[0] - lo[0]) / h) + 1, ny = Math.ceil((hi[1] - lo[1]) / h) + 1, nz = Math.ceil((hi[2] - lo[2]) / h) + 1;
  const N = nx * ny * nz;
  const Bv = new Float32Array(N), M = new Float32Array(N);
  const ncRez = V(-0.24, 0, 0.97).normalize(); // čelna ravnina skozi telo in glavico
  // sklepne ploskve (negativno = pokrito s hrustancem)
  const maska = (x, y, z) => {
    const px = x - Hc.x, py = y - Hc.y, pz = z - Hc.z;
    const m1 = Math.max(Math.hypot(px, py, pz) - 2.8, -(px * nd.x + py * nd.y + pz * nd.z + 0.55));
    let m2 = Math.min(y + 19.7, Math.max(y + 17.4, 0.9 - z));
    m2 = Math.min(m2, Math.max(y + 18.4, z + 1.7));
    return Math.min(m1, m2);
  };
  {
    let q = 0;
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++, q++) {
      const x = lo[0] + i * h, y = lo[1] + j * h, z = lo[2] + k * h;
      Bv[q] = kostSDF(x, y, z); M[q] = maska(x, y, z);
    }
  }
  const polje = (f) => {
    const a = new Float32Array(N);
    let q = 0;
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++, q++) a[q] = f(Bv[q], M[q], lo[0] + i * h, lo[1] + j * h, lo[2] + k * h);
    return a;
  };
  const stena = (y) => 0.16 + 0.44 * s01(-15.5, -9.5, y) * (1 - s01(8, 13.5, y)); // debelina kompaktne kostnine
  const notr = (b, y) => b + stena(y); // < 0 v notranjosti (mozeg, gobasta kostnina)
  const ploscica = (x, y, z) => {
    const c1 = Hc.clone().addScaledVector(nd, -1.35);
    const px = x - c1.x, py = y - c1.y, pz = z - c1.z, dd = px * nd.x + py * nd.y + pz * nd.z;
    const perp = Math.hypot(px - dd * nd.x, py - dd * nd.y, pz - dd * nd.z);
    const g1 = Math.abs(dd - 0.07 * perp * perp) - 0.15;
    const n2 = V(-0.55, 1, 0).normalize();
    const g2 = Math.max(Math.abs((x + 1.75) * n2.x + (y - 15.9) * n2.y) - 0.13, -(x + 0.2));
    const g3 = Math.abs(y - (-18.0 - 0.32 * Math.cos(1.35 * x) + 0.12 * z)) - 0.15;
    return Math.min(g1, g2, g3);
  };
  const votlina = (b, y) => smax(notr(b, y) + 0.04, Math.abs(y + 1.0) - 9.6, 1.6);
  const fKomp = polje((b, m, x, y) => Math.max(b, -notr(b, y)));
  const fHrust = polje((b, m) => Math.max(b - 0.26, 0.035 - b, m));
  const fPokost = polje((b, m) => Math.max(b - 0.17, 0.03 - b, -m - 0.05));
  const fVot = polje((b, m, x, y) => votlina(b, y));
  const fPlosc = polje((b, m, x, y, z) => Math.max(ploscica(x, y, z), notr(b, y) + 0.04));
  const fGob = polje((b, m, x, y, z) => Math.max(notr(b, y) + 0.04, -votlina(b, y) + 0.04, -ploscica(x, y, z) + 0.04));

  // materiali: zunaj osvetljeno, prerezana ploskev enakomerne barve
  const mKomp = kmat({ color: "#efe3c8", roughness: 0.62, clearcoat: 0.08 });
  const mHrust = kmat({ color: "#cfe2ee", roughness: 0.22, clearcoat: 0.9, clearcoatRoughness: 0.12, sheen: 0.5, sheenColor: new THREE.Color("#f2fbff") });
  const mPokost = kmat({ color: "#ecc9b8", roughness: 0.45, sheen: 0.7, sheenColor: new THREE.Color("#fff0e8"), clearcoat: 0.35, clearcoatRoughness: 0.3 });
  const mVot = kmat({ color: "#f0c95c", roughness: 0.35, sheen: 0.5, sheenColor: new THREE.Color("#fff3c4"), clearcoat: 0.5 });
  const mPlosc = kmat({ color: "#93bde8", roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.15 });
  const mGob = kmat({ color: "#b3313c", roughness: 0.4, sheen: 0.4, sheenColor: new THREE.Color("#ff8f8f"), clearcoat: 0.4 });
  const mGred = mat({ color: "#f3e8d2", roughness: 0.55, clearcoat: 0.1 });

  const regija = (y) => (y > 11.5 ? 0 : y < -15.5 ? 2 : 1);
  const kompakt = [0, 1, 2].map((r) => mesh(ploskevMreze(THREE, fKomp, nx, ny, nz, lo, h, (x, y) => regija(y) === r), mKomp, kostG));
  const pokost = [0, 1, 2].map((r) => mesh(ploskevMreze(THREE, fPokost, nx, ny, nz, lo, h, (x, y) => regija(y) === r), mPokost, kostG));
  const hrustanec = mesh(ploskevMreze(THREE, fHrust, nx, ny, nz, lo, h), mHrust, kostG);
  const rumeni = mesh(ploskevMreze(THREE, fVot, nx, ny, nz, lo, h), mVot, kostG);
  const plosce = mesh(ploskevMreze(THREE, fPlosc, nx, ny, nz, lo, h), mPlosc, kostG);
  const rdeci = mesh(ploskevMreze(THREE, fGob, nx, ny, nz, lo, h), mGob, kostG);

  // gredice gobaste kostnine ob prerezanih ploskvah (mreža točk, povezanih s sosedi)
  const vzorec = (f, x, y, z) => {
    const fi = (x - lo[0]) / h, fj = (y - lo[1]) / h, fk = (z - lo[2]) / h;
    const i = Math.floor(fi), j = Math.floor(fj), k = Math.floor(fk);
    if (i < 0 || j < 0 || k < 0 || i >= nx - 1 || j >= ny - 1 || k >= nz - 1) return 1;
    const tx = fi - i, ty = fj - j, tz = fk - k;
    let v = 0;
    for (let c = 0; c < 8; c++) {
      const dx = c & 1, dy = (c >> 1) & 1, dz = (c >> 2) & 1;
      v += f[(i + dx) + nx * ((j + dy) + ny * (k + dz))] * (dx ? tx : 1 - tx) * (dy ? ty : 1 - ty) * (dz ? tz : 1 - tz);
    }
    return v;
  };
  let seme = 11;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) / 2147483647);
  const KG = visoka ? 0.42 : 0.6;
  const tocke = [];
  for (let x = -4.2; x < 6.7; x += KG) for (let y = -22.8; y < 20.3; y += KG) for (let z = -3.6; z < 3.7; z += KG) {
    const p = V(x + (rnd() - 0.5) * KG * 0.8, y + (rnd() - 0.5) * KG * 0.8, z + (rnd() - 0.5) * KG * 0.8);
    const dc = p.dot(ncRez);
    const obPrerezu = (p.x <= 0 && p.x > -0.75 && dc > 0) || (dc <= 0 && dc > -0.75 && p.x > 0);
    if (!obPrerezu) continue;
    if (vzorec(fGob, p.x, p.y, p.z) > -0.05) continue;
    tocke.push(p);
  }
  const palice = [];
  for (let a = 0; a < tocke.length; a++) {
    const bliz = [];
    for (let b = a + 1; b < tocke.length; b++) { const d = tocke[a].distanceTo(tocke[b]); if (d < KG * 1.55) bliz.push([d, b]); }
    bliz.sort((u, v) => u[0] - v[0]);
    for (const [, b] of bliz.slice(0, 2)) palice.push([tocke[a], tocke[b]]);
  }
  const palG = new THREE.CylinderGeometry(1, 1, 1, visoka ? 6 : 5, 1, true);
  palG.translate(0, 0.5, 0);
  geos.push(palG);
  const vozG = new THREE.IcosahedronGeometry(1, 0);
  geos.push(vozG);
  const gredice = new THREE.InstancedMesh(palG, mGred, Math.max(1, palice.length));
  const vozli = new THREE.InstancedMesh(vozG, mGred, Math.max(1, tocke.length));
  {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), d = V(0, 0, 0);
    palice.forEach(([a, b], i) => {
      d.subVectors(b, a); const L = d.length();
      q.setFromUnitVectors(Y, d.normalize());
      const r = (visoka ? 0.045 : 0.06) * (0.8 + rnd() * 0.5);
      m.compose(a, q, V(r, L, r));
      gredice.setMatrixAt(i, m);
    });
    tocke.forEach((p, i) => { const r = (visoka ? 0.07 : 0.09) * (0.8 + rnd() * 0.4); m.compose(p, q.identity(), V(r, r, r)); vozli.setMatrixAt(i, m); });
    gredice.count = palice.length; vozli.count = tocke.length;
  }
  kostG.add(gredice, vozli);

  // prerez: odstranjena sprednja notranja četrtina; pokostnica odmaknjena 0,9 cm dlje (vidi se gola kost)
  const rezA = new THREE.Plane(V(-1, 0, 0), 0), rezB = new THREE.Plane(ncRez.clone().negate(), 0);
  const pokA = new THREE.Plane(V(-1, 0, 0), -0.9), pokB = new THREE.Plane(ncRez.clone().negate(), -0.9);

  // ================================================================ osteoni (mm)
  const OH = 0.3, BX = 0.32, BZ = 0.24;
  const osteoni = [
    { x: 0.12, z: 0.08, r: 0.115, n: 7, junak: true },
    { x: -0.13, z: 0.12, r: 0.1, n: 6 },
    { x: -0.05, z: -0.125, r: 0.105, n: 6 },
    { x: 0.2, z: -0.145, r: 0.09, n: 5 },
    { x: -0.235, z: -0.07, r: 0.075, n: 5 },
    { x: 0.35, z: 0.0, r: 0.08, n: 5 },
    { x: 0.02, z: 0.27, r: 0.09, n: 5 },
  ];
  const RK = 0.026; // Haversov kanal
  const seg = visoka ? 48 : 28;
  const ekstr = (oblika, h0, h1) => {
    const g = new THREE.ExtrudeGeometry(oblika, { depth: h1 - h0, bevelEnabled: false, curveSegments: seg, steps: 1 });
    g.rotateX(-Math.PI / 2); g.translate(0, h0, 0);
    return g;
  };
  const krog = (x, z, r, luknja = 0) => {
    const s = new THREE.Shape(); s.absarc(x, -z, r, 0, Math.PI * 2, false);
    if (luknja > 0) { const p = new THREE.Path(); p.absarc(x, -z, luknja, 0, Math.PI * 2, true); s.holes.push(p); }
    return s;
  };
  // medosteonska kostnina: kvader z luknjami za osteone
  const okvir = new THREE.Shape();
  // levi in zadnji rob sta prava stena (z = -BZ je v obliki y = +BZ), desni in sprednji sta prerezana
  okvir.moveTo(-BX, -0.45); okvir.lineTo(0.5, -0.45); okvir.lineTo(0.5, BZ); okvir.lineTo(-BX, BZ); okvir.lineTo(-BX, -0.45);
  for (const o of osteoni) { const p = new THREE.Path(); p.absarc(o.x, -o.z, o.r, 0, Math.PI * 2, true); okvir.holes.push(p); }
  const mMed = kmat({ color: "#e3d3b3", roughness: 0.6, clearcoat: 0.1 });
  const medG = ekstr(okvir, -OH, OH);
  const medosteon = mesh(medG, mMed, osteonG);
  // lamele: vsaka je obroč z debelino; barve se izmenjujejo
  const lamGeo = [], kanGeo = [], zileGeo = { a: [], v: [], z: [] }, lakune = [], kanalcki = [];
  const svetla = new THREE.Color("#f4ebd8"), temna = new THREE.Color("#dfcfae");
  for (const o of osteoni) {
    const dr = (o.r - RK) / o.n;
    for (let k = 0; k < o.n; k++) {
      const r0 = RK + k * dr, r1 = r0 + dr;
      const vrh = o.junak ? OH + 0.035 * (o.n - k) : OH;
      const g = ekstr(krog(o.x, o.z, r1, r0), -OH, vrh);
      const c = k % 2 ? temna : svetla, arr = [];
      for (let i = 0; i < g.attributes.position.count; i++) arr.push(c.r, c.g, c.b);
      g.setAttribute("color", new THREE.Float32BufferAttribute(arr, 3));
      lamGeo.push(g);
      // lakune z osteociti med lamelami (na zunanji ploskvi lamele) in kanalčki
      if (k < o.n - 1 || o.junak) {
        const nObod = Math.max(5, Math.round((2 * Math.PI * r1) / 0.045));
        const vrste = o.junak ? Math.max(1, Math.round((vrh - OH + (k === o.n - 1 ? 0.12 : 0.02)) / 0.05)) : 0;
        for (let a = 0; a < nObod; a++) {
          const fi = ((a + (k % 2) * 0.5) / nObod) * Math.PI * 2;
          // na vrhu bloka (vidne pikice)
          lakune.push({ p: V(o.x + r1 * Math.cos(fi), OH + (o.junak ? vrh - OH : 0) - 0.002, o.z + r1 * Math.sin(fi)), fi, vrh: true });
          for (let v = 0; v < vrste; v++) {
            const y = vrh - 0.03 - v * 0.05;
            if (y < OH - 0.01) break;
            lakune.push({ p: V(o.x + r1 * Math.cos(fi + v * 0.4), y, o.z + r1 * Math.sin(fi + v * 0.4)), fi: fi + v * 0.4, vrh: false });
          }
        }
      }
    }
    kanGeo.push(ekstr(krog(o.x, o.z, RK), -OH, OH + (o.junak ? 0.16 : 0.004)));
    const dv = o.junak ? 0.42 : 0.04;
    zileGeo.a.push(cev(THREE, new THREE.LineCurve3(V(o.x - 0.008, -OH, o.z), V(o.x - 0.008, OH + dv, o.z + 0.004)), { n: 2, rad: 10, r: () => 0.0075, pokrovi: true }));
    zileGeo.v.push(cev(THREE, new THREE.LineCurve3(V(o.x + 0.009, -OH, o.z - 0.003), V(o.x + 0.009, OH + dv * 0.86, o.z - 0.003)), { n: 2, rad: 10, r: () => 0.0095, pokrovi: true }));
    zileGeo.z.push(cev(THREE, new THREE.LineCurve3(V(o.x, -OH, o.z + 0.012), V(o.x, OH + dv * 0.72, o.z + 0.012)), { n: 2, rad: 8, r: () => 0.0045, pokrovi: true }));
  }
  const mLam = kmat({ color: "#ffffff", vertexColors: true, roughness: 0.5, clearcoat: 0.2, sheen: 0.3, sheenColor: new THREE.Color("#fffaf0") });
  const lamele = mesh(zdruzi(THREE, lamGeo), mLam, osteonG);
  const mKanal = kmat({ color: "#6e2a2a", roughness: 0.6 });
  const kanali = mesh(zdruzi(THREE, kanGeo), mKanal, osteonG);
  const mArt = kmat({ color: "#e03c3c", roughness: 0.35, clearcoat: 0.6 });
  const mVen = kmat({ color: "#4c70d6", roughness: 0.35, clearcoat: 0.6 });
  const mZiv = kmat({ color: "#f2d46a", roughness: 0.4, clearcoat: 0.4 });
  const zile = [mesh(zdruzi(THREE, zileGeo.a), mArt, osteonG), mesh(zdruzi(THREE, zileGeo.v), mVen, osteonG), mesh(zdruzi(THREE, zileGeo.z), mZiv, osteonG)];
  // osteociti v lakunah: sploščeni elipsoidi, dolgi okoli 20 µm
  const mCel = mat({ color: "#7d4fa8", roughness: 0.4, clearcoat: 0.4 });
  const celG = new THREE.SphereGeometry(1, visoka ? 8 : 6, visoka ? 6 : 4);
  geos.push(celG);
  const osteociti = new THREE.InstancedMesh(celG, mCel, lakune.length);
  {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    lakune.forEach((l, i) => {
      if (l.vrh) { e.set(0, -l.fi, 0); q.setFromEuler(e); m.compose(l.p, q, V(0.006, 0.004, 0.011)); }
      else { e.set(0, -l.fi, 0); q.setFromEuler(e); m.compose(l.p, q, V(0.004, 0.011, 0.007)); }
      osteociti.setMatrixAt(i, m);
    });
  }
  osteonG.add(osteociti);
  // kanalčki: tanke črte med sosednjimi lakunami in proti kanalu; kolagenska vlakna na izstopajočih lamelah
  const kp = [];
  for (let a = 0; a < lakune.length; a++) {
    const A = lakune[a].p;
    let n = 0;
    for (let b = a + 1; b < lakune.length && n < 4; b++) {
      const B = lakune[b].p;
      if (lakune[a].vrh !== lakune[b].vrh) continue;
      if (A.distanceTo(B) < 0.04) { kp.push(A.x, A.y, A.z, B.x, B.y, B.z); n++; }
    }
    for (let s = 0; s < 3; s++) {
      const fi = lakune[a].fi + (s - 1) * 0.6, d = 0.006 + rnd() * 0.008;
      if (lakune[a].vrh) kp.push(A.x, A.y + 0.001, A.z, A.x + d * Math.cos(fi + 1.5), A.y + 0.001, A.z + d * Math.sin(fi + 1.5));
      else kp.push(A.x, A.y, A.z, A.x + d * Math.cos(fi + 1.5) * 0.4, A.y + (s - 1) * 0.012, A.z + d * Math.sin(fi + 1.5) * 0.4);
    }
  }
  const kanG = new THREE.BufferGeometry();
  kanG.setAttribute("position", new THREE.Float32BufferAttribute(kp, 3));
  geos.push(kanG);
  const mKan = mat({ color: "#6d4a8c", transparent: true, opacity: 0.9 }, THREE.LineBasicMaterial);
  const kanalckiL = new THREE.LineSegments(kanG, mKan);
  osteonG.add(kanalckiL);
  const vp = [];
  {
    const o = osteoni[0], dr = (o.r - RK) / o.n;
    for (let k = 0; k < o.n; k++) {
      const r1 = RK + (k + 1) * dr + 0.0008, vrh = OH + 0.035 * (o.n - k), smer = k % 2 ? 1 : -1;
      for (let a = 0; a < 26; a++) {
        const f0 = (a / 26) * Math.PI * 2;
        for (let y = OH + 0.002; y < vrh - 0.004; y += 0.006) {
          const f1 = f0 + smer * 0.18, y1 = Math.min(vrh - 0.002, y + 0.006);
          vp.push(o.x + r1 * Math.cos(f0 + smer * (y - OH) * 30), y, o.z + r1 * Math.sin(f0 + smer * (y - OH) * 30));
          vp.push(o.x + r1 * Math.cos(f0 + smer * (y1 - OH) * 30), y1, o.z + r1 * Math.sin(f0 + smer * (y1 - OH) * 30));
          void f1;
        }
      }
    }
  }
  const vlG = new THREE.BufferGeometry();
  vlG.setAttribute("position", new THREE.Float32BufferAttribute(vp, 3));
  geos.push(vlG);
  const mVl = mat({ color: "#c9b48c", transparent: true, opacity: 0.55 }, THREE.LineBasicMaterial);
  osteonG.add(new THREE.LineSegments(vlG, mVl));
  const rOst = [new THREE.Plane(V(-1, 0, 0), BX), new THREE.Plane(V(0, 0, -1), BZ)];

  // ================================================================ pogledi
  const stanje = { pogled: "kost", prerez: true };
  let skala = 1;
  const vsebina = new THREE.Group();
  group.add(vsebina);
  const svetRez = { a: rezA.clone(), b: rezB.clone(), pa: pokA.clone(), pb: pokB.clone(), o: rOst.map((p) => p.clone()) };
  const T = (p) => p.clone().applyMatrix4(vsebina.matrix).toArray();
  function postavi() {
    vsebina.clear();
    const kost = stanje.pogled === "kost";
    if (kost) {
      vsebina.add(kostG);
      const c = V(1.2, -1.25, 0), R = 21.9;
      skala = 1 / R;
      vsebina.scale.setScalar(skala);
      vsebina.rotation.set(0, -0.35, 0);
      vsebina.position.set(0, 0, 0);
      vsebina.updateMatrix();
      vsebina.position.copy(c.clone().applyMatrix4(vsebina.matrix).negate());
    } else {
      vsebina.add(osteonG);
      const c = V(0, 0.06, 0), R = 0.62;
      skala = 1 / R;
      vsebina.scale.setScalar(skala);
      vsebina.rotation.set(0, -0.25, 0);
      vsebina.position.set(0, 0, 0);
      vsebina.updateMatrix();
      vsebina.position.copy(c.clone().applyMatrix4(vsebina.matrix).negate());
    }
    vsebina.updateMatrix();
    vsebina.updateMatrixWorld(true);
    svetRez.a.copy(rezA).applyMatrix4(vsebina.matrix); svetRez.b.copy(rezB).applyMatrix4(vsebina.matrix);
    svetRez.pa.copy(pokA).applyMatrix4(vsebina.matrix); svetRez.pb.copy(pokB).applyMatrix4(vsebina.matrix);
    svetRez.o.forEach((p, i) => p.copy(rOst[i]).applyMatrix4(vsebina.matrix));
    const pr = stanje.prerez;
    for (const m of [mKomp, mHrust, mVot, mPlosc, mGob, mGred]) { m.clippingPlanes = pr ? [svetRez.a, svetRez.b] : null; m.clipIntersection = true; }
    mPokost.clippingPlanes = pr ? [svetRez.pa, svetRez.pb] : null; mPokost.clipIntersection = true;
    for (const m of [mMed, mLam, mKanal, mArt, mVen, mZiv, mCel, mKan]) m.clippingPlanes = svetRez.o;
    gredice.visible = vozli.visible = rdeci.visible = rumeni.visible = plosce.visible = pr;
    for (const m of mats) m.needsUpdate = true;
    izberiDele();
  }

  const vsiDeli = [
    { id: "epifiza-zgornja", ime: "Zgornja epifiza", opis: "Razširjeni zgornji konec stegnenice z glavico, ki se z medenico zgiba v kolčnem sklepu.", barva: "#ecc9b8", meshes: [pokost[0]], mm: V(-2.6, 17.2, 0.2), p: "kost" },
    { id: "diafiza", ime: "Diafiza", opis: "Dolgo votlo telo kosti, ki je kot cev hkrati lahko in zelo trdno.", barva: "#e3b9a6", meshes: [pokost[1]], mm: V(-1.25, 4, 0.45), p: "kost" },
    { id: "epifiza-spodnja", ime: "Spodnja epifiza", opis: "Razširjeni spodnji konec stegnenice z dvema čvrščema, ki sta del kolenskega sklepa.", barva: "#d9ab98", meshes: [pokost[2]], mm: V(-3.3, -19.4, 0.6), p: "kost" },
    { id: "hrustanec", ime: "Sklepni hrustanec", opis: "Gladka, spolzka plast hrustanca na sklepnih ploskvah, ki zmanjša trenje in blaži udarce.", barva: "#cfe2ee", meshes: [hrustanec], mm: Hc.clone().addScaledVector(V(0.5, 0.8, -0.35).normalize(), RG + 0.2), p: "kost" },
    { id: "pokostnica", ime: "Pokostnica", opis: "Tanka čvrsta ovojnica kosti z žilami in živci; iz nje kost raste v debelino in se po zlomu zaceli.", barva: "#ecc9b8", meshes: pokost, mm: V(0.1, -6, 1.75), p: "kost", prerez: true },
    { id: "kompaktna", ime: "Kompaktna kostnina", opis: "Gosta in trda kostnina, ki tvori debelo steno diafize in tanko lupino epifiz.", barva: "#efe3c8", meshes: kompakt, mm: V(0.02, -3, 1.1), p: "kost", prerez: true },
    { id: "gobasta", ime: "Gobasta kostnina", opis: "Mreža tankih kostnih gredic, razporejenih v smeri obremenitve, zato je kost trdna in lahka.", barva: "#f3e8d2", meshes: [gredice, vozli], mm: Hc.clone().addScaledVector(nd, -0.4).add(V(0, 0.2, -0.95)), p: "kost", prerez: true },
    { id: "rdeci-mozeg", ime: "Rdeči kostni mozeg", opis: "Mehko tkivo med gredicami gobaste kostnine, v katerem nastajajo krvne celice in krvne ploščice.", barva: "#b3313c", meshes: [rdeci], mm: V(0.02, -20.2, -0.1), p: "kost", prerez: true },
    { id: "rumeni-mozeg", ime: "Rumeni kostni mozeg", opis: "Večinoma maščevje v votlini diafize; pri majhnih otrocih je tudi tu še rdeči kostni mozeg.", barva: "#f0c95c", meshes: [rumeni], mm: V(0.02, 2, -0.2), p: "kost", prerez: true },
    { id: "rastna-ploscica", ime: "Rastna ploščica", opis: "Plast hrustanca med epifizo in diafizo, kjer kost raste v dolžino; ob koncu odraščanja okosteni.", barva: "#93bde8", meshes: [plosce], mm: V(0.02, -18.0 - 0.32, 0.4), p: "kost", prerez: true },
    { id: "osteon", ime: "Osteon", opis: "Osnovna enota kompaktne kostnine: valj iz kostnih lamel okoli Haversovega kanala, debel okoli 0,2 mm.", barva: "#f4ebd8", meshes: [lamele], mm: V(0.12 + 0.11, OH + 0.04, 0.08 + 0.02), p: "osteon" },
    { id: "haversov-kanal", ime: "Haversov kanal", opis: "Kanal v sredini osteona, po katerem potekajo krvne žile in živec.", barva: "#6e2a2a", meshes: [kanali], mm: V(0.12, OH + 0.14, 0.08), p: "osteon" },
    { id: "zile-kanala", ime: "Krvne žile in živec", opis: "Arteriola in venula v Haversovem kanalu prinašata kostnim celicam kisik in hranila ter odnašata odpadne snovi.", barva: "#e03c3c", meshes: zile, mm: V(0.115, OH + 0.38, 0.082), p: "osteon" },
    { id: "lamele", ime: "Lamele", opis: "Tanke koncentrične plasti kostnine; kolagenska vlakna v sosednjih lamelah potekajo v različnih smereh, zato je kost trdna.", barva: "#dfcfae", meshes: [lamele], mm: V(0.12 - 0.06, OH + 0.12, 0.08 + 0.03), p: "osteon", brezIzbire: true },
    { id: "osteociti", ime: "Osteociti v lakunah", opis: "Kostne celice, ujete v drobnih votlinicah (lakunah) med lamelami; vzdržujejo kostnino.", barva: "#7d4fa8", meshes: [osteociti], mm: V(0.12 + 0.07, OH + 0.12, 0.08 + 0.05), p: "osteon" },
    { id: "kanalcki", ime: "Kanalčki", opis: "Drobni kanalčki, po katerih se osteociti povezujejo med seboj in s Haversovim kanalom ter dobivajo hrano.", barva: "#6d4a8c", meshes: [kanalckiL], mm: V(-0.13 + 0.06, OH + 0.003, 0.12 - 0.04), p: "osteon" },
    { id: "medosteonska", ime: "Medosteonske lamele", opis: "Ostanki starih osteonov med novimi, saj se kost vse življenje razgrajuje in znova gradi.", barva: "#e3d3b3", meshes: [medosteon], mm: V(0.27, OH, -0.03), p: "osteon" },
  ];
  for (const d of vsiDeli) d.tocka = [0, 0, 0];
  let deli = [];
  function izberiDele() {
    deli = vsiDeli.filter((d) => d.p === stanje.pogled && (!d.prerez || stanje.prerez));
    for (const d of deli) d.tocka.splice(0, 3, ...T(d.mm));
  }

  const nadzor = [
    { tip: "izbira", id: "pogled", oznaka: "Povečava", moznosti: [["kost", "Stegnenica"], ["osteon", "Osteon (≈ 300 ×)"]], vrednost: "kost", ob: (v) => { stanje.pogled = v === "osteon" ? "osteon" : "kost"; postavi(); } },
    { tip: "stikalo", id: "prerez", oznaka: "Prerez", vrednost: true, vidno: () => stanje.pogled === "kost", ob: (v) => { stanje.prerez = !!v; postavi(); } },
  ];
  const zac = ctx.zacetek || {};
  if (zac.pogled === "osteon") { stanje.pogled = "osteon"; nadzor[0].vrednost = "osteon"; }
  if (zac.prerez === false || zac.prerez === "false" || zac.prerez === "0") { stanje.prerez = false; nadzor[1].vrednost = false; }
  postavi();

  return {
    group,
    get deli() { return deli; },
    nadzor,
    get merilo() {
      if (stanje.pogled === "kost") return { m: 2 / skala / 100, oznaka: `${Math.round(2 / skala)} cm` };
      return { m: 2 / skala / 1000, oznaka: `${String(Math.round(20 / skala) / 10).replace(".", ",")} mm` };
    },
    dispose() {
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
    },
  };
}
