// Graf funkcije dveh spremenljivk z = f(x, y): ploskev, plastnice, prerez y = c, točka in gradient (pogodba v docs/3d.md).
// Matematične osi (x, y, z) preslikamo v prizor kot (x → X, y → −Z, z → Y), da ostane sistem desnosučen.
export const info = {
  id: "graf-ploskev",
  naslov: "Graf funkcije dveh spremenljivk",
  podrocje: "matematika",
  predmet: "MAT",
  opis: "Ploskev z = f(x, y) za osem značilnih funkcij: plastnice na ploskvi in na tleh, prerez y = c, vrednost in gradient v izbrani točki.",
  merilo: { m: 1, oznaka: "enote na oseh" },
};

// viridis (barvno slepim prijazna zaporedna lestvica), sRGB
const VIRIDIS = ["#440154", "#472d7b", "#3b528b", "#2c728e", "#21918c", "#28ae80", "#5ec962", "#addc30", "#fde725"];
const PISAVA = '"Instrument Sans", system-ui, sans-serif';
const NB = " ";

// število v slovenskem zapisu z največ d decimalkami (odvečne ničle odrežemo)
function st(x, d = 2) {
  if (!Number.isFinite(x)) return "—";
  if (Math.abs(x) < 0.5 * 10 ** -d) x = 0;
  let s = Math.abs(x).toFixed(d);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return (x < 0 ? "−" : "") + s.replace(".", ",");
}
// člen s koeficientom: k·s (1·s → s, −1·s → −s)
function clen(k, s, prvi) {
  if (Math.abs(k) < 1e-12) return "";
  const a = Math.abs(k), z = k < 0 ? "−" : "+";
  const t = Math.abs(a - 1) < 1e-12 && s ? s : st(a, 3) + (s ? "·" + s : "");
  return prvi ? (k < 0 ? "−" : "") + t : ` ${z} ${t}`;
}
function vsota(cleni) { // [[k, s], ...]
  let out = "", prvi = true;
  for (const [k, s] of cleni) { const c = clen(k, s, prvi); if (c) { out += c; prvi = false; } }
  return out || "0";
}
const fakt = (k, s) => (Math.abs(k) < 1e-12 ? "0" : Math.abs(k - 1) < 1e-12 ? s : Math.abs(k + 1) < 1e-12 ? "−" + s : st(k, 3) + "·" + s);
const arg = (b, s) => (Math.abs(b - 1) < 1e-12 ? " " + s : Math.abs(b + 1) < 1e-12 ? "(−" + s + ")" : "(" + st(b) + s + ")");

// Funkcije: vrednost, gradient (analitično), zapis in prerez y = c.
const FUNKCIJE = {
  paraboloid: {
    oznaka: "x² + y²", rabi: "ab",
    f: (x, y, a, b) => a * x * x + b * y * y,
    g: (x, y, a, b, o) => { o[0] = 2 * a * x; o[1] = 2 * b * y; return true; },
    zapis: (a, b) => vsota([[a, "x²"], [b, "y²"]]),
    rez: (a, b, c) => vsota([[a, "x²"], [b * c * c, ""]]),
  },
  sedlo: {
    oznaka: "x² − y² (sedlo)", rabi: "ab",
    f: (x, y, a, b) => a * x * x - b * y * y,
    g: (x, y, a, b, o) => { o[0] = 2 * a * x; o[1] = -2 * b * y; return true; },
    zapis: (a, b) => vsota([[a, "x²"], [-b, "y²"]]),
    rez: (a, b, c) => vsota([[a, "x²"], [-b * c * c, ""]]),
  },
  xy: {
    oznaka: "x · y", rabi: "a",
    f: (x, y, a) => a * x * y,
    g: (x, y, a, b, o) => { o[0] = a * y; o[1] = a * x; return true; },
    zapis: (a) => fakt(a, "x·y"),
    rez: (a, b, c) => fakt(a * c, "x"),
  },
  sincos: {
    oznaka: "sin x · cos y", rabi: "ab",
    f: (x, y, a, b) => a * Math.sin(b * x) * Math.cos(b * y),
    g: (x, y, a, b, o) => { o[0] = a * b * Math.cos(b * x) * Math.cos(b * y); o[1] = -a * b * Math.sin(b * x) * Math.sin(b * y); return true; },
    zapis: (a, b) => fakt(a, `sin${arg(b, "x")} · cos${arg(b, "y")}`),
    rez: (a, b, c) => fakt(a * Math.cos(b * c), `sin${arg(b, "x")}`),
  },
  gauss: {
    oznaka: "e^(−x² − y²)", rabi: "ab", bPoz: true,
    f: (x, y, a, b) => a * Math.exp(-b * (x * x + y * y)),
    g: (x, y, a, b, o) => { const e = a * Math.exp(-b * (x * x + y * y)); o[0] = -2 * b * x * e; o[1] = -2 * b * y * e; return true; },
    zapis: (a, b) => fakt(a, Math.abs(b - 1) < 1e-12 ? "e^(−x² − y²)" : `e^(−${st(b)}·(x² + y²))`),
    rez: (a, b, c) => fakt(a * Math.exp(-b * c * c), Math.abs(b - 1) < 1e-12 ? "e^(−x²)" : `e^(−${st(b)}x²)`),
  },
  stozec: {
    oznaka: "√(x² + y²) (stožec)", rabi: "a",
    f: (x, y, a) => a * Math.hypot(x, y),
    g: (x, y, a, b, o) => { const r = Math.hypot(x, y); if (r < 1e-9) { o[0] = o[1] = 0; return Math.abs(a) < 1e-12; } o[0] = (a * x) / r; o[1] = (a * y) / r; return true; },
    zapis: (a) => fakt(a, "√(x² + y²)"),
    rez: (a, b, c) => fakt(a, Math.abs(c) < 1e-12 ? "|x|" : `√(x² + ${st(c * c)})`),
  },
  valovi: {
    oznaka: "sin √(x² + y²)", rabi: "ab",
    f: (x, y, a, b) => a * Math.sin(b * Math.hypot(x, y)),
    g: (x, y, a, b, o) => { const r = Math.hypot(x, y); if (r < 1e-9) { o[0] = o[1] = 0; return Math.abs(a * b) < 1e-12; } const k = (a * b * Math.cos(b * r)) / r; o[0] = k * x; o[1] = k * y; return true; },
    zapis: (a, b) => fakt(a, `sin(${Math.abs(b - 1) < 1e-12 ? "" : st(b) + "·"}√(x² + y²))`),
    rez: (a, b, c) => fakt(a, `sin(${Math.abs(b - 1) < 1e-12 ? "" : st(b) + "·"}${Math.abs(c) < 1e-12 ? "|x|" : `√(x² + ${st(c * c)})`})`),
  },
  ravnina: {
    oznaka: "a·x + b·y (ravnina)", rabi: "ab",
    f: (x, y, a, b) => a * x + b * y,
    g: (x, y, a, b, o) => { o[0] = a; o[1] = b; return true; },
    zapis: (a, b) => vsota([[a, "x"], [b, "y"]]),
    rez: (a, b, c) => vsota([[a, "x"], [b * c, ""]]),
  },
};
const MOZNOSTI = Object.entries(FUNKCIJE).map(([k, v]) => [k, v.oznaka]);

function lepKorak(raz, n) { // »lep« korak (1, 2, 2,5, 5 · 10^k) za približno n razdelkov
  const g = raz / n, p = 10 ** Math.floor(Math.log10(g)), m = g / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}

export function zgradi(THREE, ctx) {
  const { Vector3, Color, Matrix4, Quaternion } = THREE;
  const visoka = ctx.kakovost !== "nizka";
  const N = visoka ? 120 : 64; // celice mreže na stranico
  const zac = ctx.zacetek || {};
  const stevilo = (k, lo, hi, def) => { const x = Number(zac[k]); return zac[k] != null && Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : def; };
  const bool = (k, def) => (zac[k] == null ? def : zac[k] === true || zac[k] === "1" || zac[k] === "true");
  const S = {
    fn: FUNKCIJE[zac.fn] ? zac.fn : "paraboloid",
    a: stevilo("a", -2, 2, 1), b: stevilo("b", -2, 2, 1), L: stevilo("L", 1, 6, 3),
    plastnice: bool("plastnice", false), prerez: bool("prerez", false), c: stevilo("c", -6, 6, 0.5),
    x0: stevilo("x0", -6, 6, 1), y0: stevilo("y0", -6, 6, -1), gradient: bool("gradient", false),
  };

  // okvir v prizoru
  const WH = 0.54, YT = 0.41, YB = -0.23, YF = -0.41; // pol širine, vrh, dno ploskve, tla
  const group = new THREE.Group(); group.name = "graf-ploskev";

  // ---------- materiali ----------
  const mPloskev = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.55, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.45, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const mMreza = new THREE.LineBasicMaterial({ color: "#0B0F16", transparent: true, opacity: 0.32, depthWrite: false });
  const mStena = new THREE.MeshStandardMaterial({ color: "#161D2B", roughness: 0.9, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2 });
  const mCrte = new THREE.LineBasicMaterial({ color: "#8FA2C7", transparent: true, opacity: 0.22, depthWrite: false });
  const mOs = new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.4 });
  const mPlastS = new THREE.LineBasicMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.85 });
  const mPlastT = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 });
  const mRavnina = new THREE.MeshBasicMaterial({ color: "#FF6FA5", transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false });
  const mRavninaRob = new THREE.LineBasicMaterial({ color: "#FF8DB8", transparent: true, opacity: 0.6 });
  const mTocka = new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.3, emissive: "#30384a" });

  const praviMesh = (g, m, ro = 0) => { const o = new THREE.Mesh(g, m); o.renderOrder = ro; o.frustumCulled = false; return o; };

  // ---------- ploskev ----------
  const nv = (N + 1) * (N + 1);
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(nv * 3), pBar = new Float32Array(nv * 3), zv = new Float64Array(nv);
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(pBar, 3));
  pGeo.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
  { const idx = []; for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1; idx.push(a, c, b, b, c, d); } pGeo.setIndex(idx); }
  const ploskev = praviMesh(pGeo, mPloskev, 0); group.add(ploskev);
  // redka mreža na ploskvi (vsaka k-ta črta), za občutek oblike
  const K = Math.max(1, Math.round(N / 12));
  const mrezaGeo = new THREE.BufferGeometry(); mrezaGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(26 * N * 6), 3));
  const mreza = new THREE.LineSegments(mrezaGeo, mMreza); mreza.renderOrder = 1; mreza.frustumCulled = false; group.add(mreza);

  // ---------- okvir: tla in dve steni ----------
  const stenaGeo = new THREE.BufferGeometry();
  stenaGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
    -WH, YF, WH, WH, YF, WH, WH, YF, -WH, -WH, YF, WH, WH, YF, -WH, -WH, YF, -WH, // tla
    -WH, YF, -WH, WH, YF, -WH, WH, YT, -WH, -WH, YF, -WH, WH, YT, -WH, -WH, YT, -WH, // zadnja stena (y = L)
    -WH, YF, WH, -WH, YF, -WH, -WH, YT, -WH, -WH, YF, WH, -WH, YT, -WH, -WH, YT, WH, // leva stena (x = −L)
  ]), 3));
  stenaGeo.computeVertexNormals();
  const stene = praviMesh(stenaGeo, mStena, -2); group.add(stene);
  const crteGeo = new THREE.BufferGeometry(); crteGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(200 * 6), 3));
  const crte = new THREE.LineSegments(crteGeo, mCrte); crte.renderOrder = -1; crte.frustumCulled = false; group.add(crte);

  // ---------- cevi (osi, oznake, prerez, točka) in puščice ----------
  const cevGeo = new THREE.CylinderGeometry(1, 1, 1, visoka ? 8 : 6, 1, true);
  const stozecGeo = new THREE.ConeGeometry(1, 1, visoka ? 18 : 10); stozecGeo.translate(0, -0.5, 0); // konica v izhodišču
  const nova = (geo, mat, n) => { const m = new THREE.InstancedMesh(geo, mat, n); m.count = 0; m.frustumCulled = false; m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3); return m; };
  const osi = nova(cevGeo, mOs, 64), puscice = nova(stozecGeo, mOs, 8);
  const mPrerez = new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.35 });
  const prerezCevi = nova(cevGeo, mPrerez, 2 * (N + 1) + 8);
  const mTockaCev = new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.35 });
  const tockaCevi = nova(cevGeo, mTockaCev, 48), tockaPusc = nova(stozecGeo, mTockaCev, 4);
  const tocka = new THREE.InstancedMesh(new THREE.SphereGeometry(1, visoka ? 20 : 12, visoka ? 14 : 8), mTocka, 2); tocka.frustumCulled = false;
  group.add(osi, puscice, prerezCevi, tockaCevi, tockaPusc, tocka);
  const ravGeo = new THREE.PlaneGeometry(2 * WH, YT - YF); ravGeo.translate(0, (YT + YF) / 2, 0);
  const ravnina = praviMesh(ravGeo, mRavnina, 5);
  ravnina.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([new Vector3(-WH, YF, 0), new Vector3(WH, YF, 0), new Vector3(WH, YT, 0), new Vector3(-WH, YT, 0)]), mRavninaRob));
  group.add(ravnina);

  // ---------- plastnice ----------
  const MAXP = visoka ? 24000 : 12000;
  const plSGeo = new THREE.BufferGeometry(); plSGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAXP * 6), 3));
  const plTGeo = new THREE.BufferGeometry(); plTGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAXP * 6), 3));
  plTGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(MAXP * 6), 3));
  const plastS = new THREE.LineSegments(plSGeo, mPlastS), plastT = new THREE.LineSegments(plTGeo, mPlastT);
  plastS.renderOrder = 2; plastT.renderOrder = -1; plastS.frustumCulled = plastT.frustumCulled = false;
  group.add(plastS, plastT);

  // ---------- besedila: ena tekstura (atlas), štirikotniki obrnjeni proti kameri ----------
  const atlas = document.createElement("canvas"); atlas.width = 1024; atlas.height = 1024;
  const atlasTex = new THREE.CanvasTexture(atlas); atlasTex.colorSpace = THREE.SRGBColorSpace; atlasTex.generateMipmaps = true; atlasTex.minFilter = THREE.LinearMipmapLinearFilter; atlasTex.anisotropy = 4;
  const vs = `attribute vec2 kot; varying vec2 vUv;
    void main() { vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float sc = length(vec3(modelMatrix[0][0], modelMatrix[0][1], modelMatrix[0][2]));
      mv.xy += kot * sc; gl_Position = projectionMatrix * mv; }`;
  const fs = `uniform sampler2D map; uniform float opacity; varying vec2 vUv;
    void main() { vec4 c = texture2D(map, vUv); if (c.a < 0.03) discard; gl_FragColor = vec4(c.rgb, c.a * opacity); }`;
  const besediloMat = (globina) => new THREE.ShaderMaterial({ uniforms: { map: { value: atlasTex }, opacity: { value: 1 } }, vertexShader: vs, fragmentShader: fs, transparent: true, depthWrite: false, depthTest: globina });
  const MAXB = 80;
  const besGeo = (n) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 12), 3));
    g.setAttribute("kot", new THREE.BufferAttribute(new Float32Array(n * 8), 2));
    g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(n * 8), 2));
    const idx = []; for (let i = 0; i < n; i++) idx.push(4 * i, 4 * i + 1, 4 * i + 2, 4 * i, 4 * i + 2, 4 * i + 3); g.setIndex(idx);
    return g;
  };
  const besedilaSpredaj = praviMesh(besGeo(MAXB), besediloMat(false), 10); // osi: vedno berljive
  const besedilaGlobina = praviMesh(besGeo(MAXB), besediloMat(true), -0.5); // napisi plastnic na tleh (pred ploskvijo)
  group.add(besedilaSpredaj, besedilaGlobina);

  // legenda (sprite z barvno lestvico)
  const legPlatno = document.createElement("canvas"); legPlatno.width = 200; legPlatno.height = 420;
  const legTex = new THREE.CanvasTexture(legPlatno); legTex.colorSpace = THREE.SRGBColorSpace;
  const legenda = new THREE.Sprite(new THREE.SpriteMaterial({ map: legTex, transparent: true, depthWrite: false }));
  legenda.scale.set(0.23, 0.483, 1); legenda.position.set(WH + 0.2, 0.13, -0.3); legenda.renderOrder = 11; group.add(legenda);

  // ---------- pomožne ----------
  const _a = new Vector3(), _b = new Vector3(), _c = new Vector3(), _d = new Vector3(), _s = new Vector3(), _q = new Quaternion(), _m = new Matrix4(), _col = new Color();
  const Y = new Vector3(0, 1, 0), gr = [0, 0];
  const viridisLin = VIRIDIS.map((h) => new Color(h)); // Color(hex) pretvori sRGB v linearni prostor
  const viridisSRGB = VIRIDIS;
  function barva(t, out) {
    t = 0.06 + 0.94 * Math.min(1, Math.max(0, t));
    const f = t * (viridisLin.length - 1), i = Math.min(viridisLin.length - 2, Math.floor(f));
    return out.copy(viridisLin[i]).lerp(viridisLin[i + 1], f - i);
  }
  const _cs = new Vector3(), _cm = new Vector3(), _ps = new Vector3();
  function cev(im, i, a, b, r, barvaHex) {
    _cs.subVectors(b, a); const L = _cs.length();
    if (L < 1e-9) _m.makeScale(0, 0, 0);
    else { _cm.addVectors(a, b).multiplyScalar(0.5); _q.setFromUnitVectors(Y, _cs.divideScalar(L)); _m.compose(_cm, _q, _s.set(r, L, r)); }
    im.setMatrixAt(i, _m); im.setColorAt(i, _col.set(barvaHex));
  }
  function puscica(im, i, konica, smer, dolz, r, barvaHex) {
    _q.setFromUnitVectors(Y, _ps.copy(smer).normalize()); _m.compose(konica, _q, _s.set(r, dolz, r));
    im.setMatrixAt(i, _m); im.setColorAt(i, _col.set(barvaHex));
  }
  const zakljuci = (im, n) => { im.count = n; im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.computeBoundingSphere?.(); };

  // ---------- stanje in preslikave ----------
  let zlo = 0, zhi = 1, zmin = 0, zmax = 1, zKorak = 1, nivoji = [], gradMax = 1;
  const F = () => FUNKCIJE[S.fn];
  const bEf = () => (F().bPoz ? Math.max(0.1, S.b) : S.b);
  const fX = (x) => (x / S.L) * WH, fZ = (y) => (-y / S.L) * WH;
  const fY = (z) => YB + ((z - zlo) / (zhi - zlo)) * (YT - YB);
  const svet = (x, y, z, out) => out.set(fX(x), fY(z), fZ(y));
  const cx = () => Math.max(-S.L, Math.min(S.L, S.c));
  const tockaXY = () => [Math.max(-S.L, Math.min(S.L, S.x0)), S.prerez ? cx() : Math.max(-S.L, Math.min(S.L, S.y0))];

  // ---------- besedila ----------
  const bes = []; // {t, p: Vector3, h, barva, spredaj, x: poravnava −1/0/1}
  function dodajBes(t, p, h, barvaHex, spredaj = true, por = 0) { bes.push({ t, p: p.clone(), h, barva: barvaHex, spredaj, por }); }
  function narisiBesedila() {
    const g = atlas.getContext("2d");
    const fsz = 40, vrst = 54;
    const mere = [];
    if (g) {
      g.clearRect(0, 0, atlas.width, atlas.height);
      g.font = `600 ${fsz}px ${PISAVA}`; g.textBaseline = "middle"; g.lineJoin = "round";
    }
    let x = 4, y = 4;
    for (const b of bes) {
      const w = g ? Math.ceil(g.measureText(b.t).width) + 16 : b.t.length * 22;
      if (x + w > atlas.width) { x = 4; y += vrst + 4; }
      if (y + vrst > atlas.height) { mere.push(null); continue; }
      if (g) {
        g.strokeStyle = "rgba(11,15,22,0.85)"; g.lineWidth = 6; g.strokeText(b.t, x + 8, y + vrst / 2);
        g.fillStyle = b.barva; g.fillText(b.t, x + 8, y + vrst / 2);
      }
      mere.push([x, y, w, vrst]); x += w + 4;
    }
    atlasTex.needsUpdate = true;
    for (const [mesh, spredaj] of [[besedilaSpredaj, true], [besedilaGlobina, false]]) {
      const geo = mesh.geometry, P = geo.attributes.position.array, Kt = geo.attributes.kot.array, U = geo.attributes.uv.array;
      let n = 0;
      bes.forEach((b, i) => {
        const m = mere[i]; if (!m || b.spredaj !== spredaj || n >= MAXB) return;
        const [ax, ay, w, h] = m, hw = (b.h * w) / h, hh = b.h;
        const ox = b.por === 0 ? -hw / 2 : b.por < 0 ? 0 : -hw;
        const kot = [[ox, -hh / 2], [ox + hw, -hh / 2], [ox + hw, hh / 2], [ox, hh / 2]];
        const uv = [[ax / atlas.width, 1 - (ay + h) / atlas.height], [(ax + w) / atlas.width, 1 - (ay + h) / atlas.height], [(ax + w) / atlas.width, 1 - ay / atlas.height], [ax / atlas.width, 1 - ay / atlas.height]];
        for (let k = 0; k < 4; k++) { P.set([b.p.x, b.p.y, b.p.z], (4 * n + k) * 3); Kt.set(kot[k], (4 * n + k) * 2); U.set(uv[k], (4 * n + k) * 2); }
        n++;
      });
      geo.setDrawRange(0, n * 6); geo.attributes.position.needsUpdate = geo.attributes.kot.needsUpdate = geo.attributes.uv.needsUpdate = true;
      geo.computeBoundingSphere(); mesh.visible = n > 0;
    }
  }
  function narisiLegendo() {
    const g = legPlatno.getContext("2d"); if (!g) { legTex.needsUpdate = true; return; }
    const W = legPlatno.width, H = legPlatno.height, x0 = 20, y0 = 44, bw = 28, bh = H - 80;
    g.clearRect(0, 0, W, H);
    g.fillStyle = "rgba(11,15,22,0.78)"; g.strokeStyle = "rgba(110,155,255,0.6)"; g.lineWidth = 3;
    g.beginPath(); g.roundRect ? g.roundRect(2, 2, W - 4, H - 4, 18) : g.rect(2, 2, W - 4, H - 4); g.fill(); g.stroke();
    const grad = g.createLinearGradient(0, y0 + bh, 0, y0);
    for (let i = 0; i <= 20; i++) { const t = i / 20, f = (0.06 + 0.94 * t) * (VIRIDIS.length - 1), k = Math.min(VIRIDIS.length - 2, Math.floor(f)); const c0 = new Color(viridisSRGB[k]), c1 = new Color(viridisSRGB[k + 1]); grad.addColorStop(t, "#" + c0.lerp(c1, f - k).getHexString()); }
    g.fillStyle = grad; g.fillRect(x0, y0, bw, bh);
    g.font = `italic 600 34px ${PISAVA}`; g.fillStyle = "#E8EDF7"; g.textBaseline = "middle"; g.fillText("z", x0 + 4, 21);
    g.font = `600 33px ${PISAVA}`;
    const n = Math.round((zhi - zlo) / zKorak), korak = Math.max(1, Math.ceil(n / 6));
    for (let i = 0; i <= n; i += korak) {
      const z = zlo + i * zKorak, yy = y0 + bh - (i / n) * bh;
      g.fillStyle = "#E8EDF7"; g.fillRect(x0 + bw, yy - 1.5, 10, 3); g.fillText(st(z), x0 + bw + 14, yy);
    }
    legTex.needsUpdate = true;
  }

  // ---------- izračun ----------
  function obnovi() {
    const fn = F(), a = S.a, b = bEf(), L = S.L;
    // vrednosti na mreži
    zmin = Infinity; zmax = -Infinity; gradMax = 0;
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
      const x = -L + (2 * L * i) / N, y = L - (2 * L * j) / N; // vrstica j = 0 je zadaj (y = L)
      const z = fn.f(x, y, a, b); zv[j * (N + 1) + i] = z;
      if (z < zmin) zmin = z; if (z > zmax) zmax = z;
      if (fn.g(x, y, a, b, gr)) gradMax = Math.max(gradMax, Math.hypot(gr[0], gr[1]));
    }
    let raz = zmax - zmin;
    if (raz < 1e-9) { zlo = zmin - 1; zhi = zmax + 1; zKorak = lepKorak(2, 4); zlo = Math.floor(zlo / zKorak) * zKorak; zhi = Math.ceil(zhi / zKorak) * zKorak; }
    else { zKorak = lepKorak(raz, 5); zlo = Math.floor(zmin / zKorak + 1e-9) * zKorak; zhi = Math.ceil(zmax / zKorak - 1e-9) * zKorak; if (zhi - zlo < 1e-12) zhi = zlo + zKorak; }
    // ploskev
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
      const k = j * (N + 1) + i, x = -L + (2 * L * i) / N, y = L - (2 * L * j) / N, z = zv[k];
      pPos[3 * k] = fX(x); pPos[3 * k + 1] = fY(z); pPos[3 * k + 2] = fZ(y);
      barva((z - zlo) / (zhi - zlo), _col); pBar[3 * k] = _col.r; pBar[3 * k + 1] = _col.g; pBar[3 * k + 2] = _col.b;
    }
    pGeo.attributes.position.needsUpdate = pGeo.attributes.color.needsUpdate = true; pGeo.computeVertexNormals(); pGeo.computeBoundingSphere();
    // redka mreža
    {
      const P = mrezaGeo.attributes.position.array; let n = 0;
      const put = (k1, k2) => { P.set([pPos[3 * k1], pPos[3 * k1 + 1], pPos[3 * k1 + 2], pPos[3 * k2], pPos[3 * k2 + 1], pPos[3 * k2 + 2]], n * 6); n++; };
      for (let l = 0; l <= N; l += K) for (let i = 0; i < N && n < 26 * N - 1; i++) { put(l * (N + 1) + i, l * (N + 1) + i + 1); put(i * (N + 1) + l, (i + 1) * (N + 1) + l); }
      mrezaGeo.setDrawRange(0, n * 2); mrezaGeo.attributes.position.needsUpdate = true; mrezaGeo.computeBoundingSphere();
      mreza.visible = !S.plastnice;
      // s plastnicami ali gradientom je ploskev rahlo prosojna, da se vidijo tla pod njo
      const pros = S.plastnice || S.gradient;
      if (mPloskev.transparent !== pros) { mPloskev.transparent = pros; mPloskev.opacity = pros ? 0.8 : 1; mPloskev.needsUpdate = true; }
      ploskev.renderOrder = pros ? 1 : 0;
    }
    bes.length = 0;
    osiInMreza();
    plastniceIzracun();
    prerezIzracun();
    tockaIzracun();
    narisiBesedila();
    narisiLegendo();
    api.deli = deli();
  }

  function oznakaX() { const L = S.L; return L <= 1.5 ? 0.5 : L <= 4 ? 1 : 2; }
  function osiInMreza() {
    const L = S.L, kx = oznakaX();
    const P = crteGeo.attributes.position.array; let n = 0;
    const crta = (x1, y1, z1, x2, y2, z2) => { if (n < 200) P.set([x1, y1, z1, x2, y2, z2], 6 * n++); };
    // mreža na tleh in stenah na mestih oznak
    for (let v = Math.ceil(-L / kx) * kx; v <= L + 1e-9; v += kx) {
      const X = fX(v), Z = fZ(v);
      crta(X, YF, WH, X, YF, -WH); crta(-WH, YF, Z, WH, YF, Z); // tla
      crta(X, YF, -WH, X, YT, -WH); // zadnja stena: navpične
      crta(-WH, YF, Z, -WH, YT, Z); // leva stena
    }
    for (let i = 0; zlo + i * zKorak <= zhi + 1e-9; i++) { const Yz = fY(zlo + i * zKorak); crta(-WH, Yz, -WH, WH, Yz, -WH); crta(-WH, Yz, -WH, -WH, Yz, WH); }
    crteGeo.setDrawRange(0, n * 2); crteGeo.attributes.position.needsUpdate = true; crteGeo.computeBoundingSphere();
    // osi ob robovih okvirja s puščicami
    let ni = 0, np = 0;
    const r = 0.0045, rt = 0.003, BEL = "#E8EDF7";
    const ex = 0.08; // podaljšek osi za puščico
    // x: sprednji rob tal (y = −L)
    cev(osi, ni++, _a.set(-WH, YF, WH), _b.set(WH + ex, YF, WH), r, BEL); puscica(puscice, np++, _a.set(WH + ex + 0.045, YF, WH), _b.set(1, 0, 0), 0.05, 0.016, BEL);
    // y: desni rob tal (x = L), proti −Z
    cev(osi, ni++, _a.set(WH, YF, WH), _b.set(WH, YF, -WH - ex), r, BEL); puscica(puscice, np++, _a.set(WH, YF, -WH - ex - 0.045), _b.set(0, 0, -1), 0.05, 0.016, BEL);
    // z: navpični rob v sprednjem levem kotu (tam ga ploskev ne zakrije)
    cev(osi, ni++, _a.set(-WH, YB, WH), _b.set(-WH, YT + ex * 0.6, WH), r, BEL); puscica(puscice, np++, _a.set(-WH, YT + ex * 0.6 + 0.045, WH), _b.set(0, 1, 0), 0.05, 0.016, BEL);
    // robovi okvirja (tanjši)
    const RB = "#5A6A8C";
    cev(osi, ni++, _a.set(-WH, YF, -WH), _b.set(WH, YF, -WH), rt * 0.6, RB); cev(osi, ni++, _a.set(-WH, YF, -WH), _b.set(-WH, YF, WH), rt * 0.6, RB);
    cev(osi, ni++, _a.set(-WH, YF, -WH), _b.set(-WH, YT, -WH), rt * 0.6, RB); cev(osi, ni++, _a.set(-WH, YF, WH), _b.set(-WH, YB, WH), rt * 0.6, RB);
    // oznake in številke
    const hN = 0.07;
    for (let v = Math.ceil(-L / kx - 1e-9) * kx; v <= L + 1e-9; v += kx) {
      const X = fX(v), Z = fZ(v);
      cev(osi, ni++, _a.set(X, YF, WH), _b.set(X, YF, WH + 0.025), rt, BEL);
      dodajBes(st(v), _a.set(X, YF - 0.012, WH + 0.075), hN, "#C9D4EA");
      cev(osi, ni++, _a.set(WH, YF, Z), _b.set(WH + 0.025, YF, Z), rt, BEL);
      if (v > -L + 1e-9) dodajBes(st(v), _a.set(WH + 0.045, YF - 0.012, Z), hN, "#C9D4EA", true, -1);
    }
    for (let i = 0; zlo + i * zKorak <= zhi + 1e-9; i++) {
      const z = zlo + i * zKorak, Yz = fY(z);
      cev(osi, ni++, _a.set(-WH, Yz, WH), _b.set(-WH - 0.025, Yz, WH), rt, BEL);
      dodajBes(st(z), _a.set(-WH - 0.04, Yz, WH), hN, "#C9D4EA", true, 1);
    }
    zakljuci(osi, ni); zakljuci(puscice, np);
    dodajBes("x", _a.set(WH + ex + 0.08, YF, WH), 0.088, "#FFFFFF");
    dodajBes("y", _a.set(WH, YF, -WH - ex - 0.08), 0.088, "#FFFFFF");
    dodajBes("z", _a.set(-WH, YT + ex * 0.6 + 0.08, WH), 0.088, "#FFFFFF");
  }

  // plastnice: pohod po trikotnikih iste triangulacije kot ploskev (črte ležijo točno na ploskvi)
  function plastniceIzracun() {
    nivoji = [];
    plastS.visible = plastT.visible = false;
    if (!S.plastnice || zmax - zmin < 1e-9) return;
    const korak = lepKorak(zmax - zmin, 9);
    for (let k = Math.ceil(zmin / korak - 1e-9); k * korak <= zmax + 1e-9; k++) { const z = k * korak; if (z > zmin + 1e-9 * (1 + Math.abs(z)) && z < zmax - 1e-9 * (1 + Math.abs(z))) nivoji.push(z); }
    nivoji.korak = korak;
    const PS = plSGeo.attributes.position.array, PT = plTGeo.attributes.position.array, CT = plTGeo.attributes.color.array;
    let n = 0;
    const najboljse = nivoji.map(() => null);
    const ytla = YF + 0.002;
    const tri = (i0, i1, i2) => {
      const z0 = zv[i0], z1 = zv[i1], z2 = zv[i2];
      const lo = Math.min(z0, z1, z2), hi = Math.max(z0, z1, z2);
      for (let l = 0; l < nivoji.length; l++) {
        const h = nivoji[l]; if (h < lo || h >= hi || n >= MAXP) continue;
        let m = 0; const pts = [_a, _b];
        const rob = (ia, ib, za, zb) => {
          if ((za < h) === (zb < h) || m >= 2) return;
          const t = (h - za) / (zb - za), p = pts[m++];
          p.set(pPos[3 * ia] + (pPos[3 * ib] - pPos[3 * ia]) * t, pPos[3 * ia + 1] + (pPos[3 * ib + 1] - pPos[3 * ia + 1]) * t, pPos[3 * ia + 2] + (pPos[3 * ib + 2] - pPos[3 * ia + 2]) * t);
        };
        rob(i0, i1, z0, z1); rob(i1, i2, z1, z2); rob(i2, i0, z2, z0);
        if (m < 2) continue;
        PS.set([_a.x, _a.y, _a.z, _b.x, _b.y, _b.z], 6 * n);
        PT.set([_a.x, ytla, _a.z, _b.x, ytla, _b.z], 6 * n);
        barva((h - zlo) / (zhi - zlo), _col); _col.offsetHSL(0, 0, 0.08);
        CT.set([_col.r, _col.g, _col.b, _col.r, _col.g, _col.b], 6 * n);
        n++;
        // mesto za napis: točka, ki je najbolj spredaj desno (najbolje vidna)
        const ocena = _a.x - _a.z * 0.6 + (_a.z > 0.9 * WH || _a.x > 0.9 * WH ? -5 : 0);
        if (!najboljse[l] || ocena > najboljse[l][0]) najboljse[l] = [ocena, _a.x, _a.z];
      }
    };
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1; tri(a, c, b); tri(b, c, d); }
    plSGeo.setDrawRange(0, n * 2); plTGeo.setDrawRange(0, n * 2);
    plSGeo.attributes.position.needsUpdate = plTGeo.attributes.position.needsUpdate = plTGeo.attributes.color.needsUpdate = true;
    plSGeo.computeBoundingSphere(); plTGeo.computeBoundingSphere();
    plastS.visible = plastT.visible = n > 0;
    const vsak = nivoji.length > 8 ? 2 : 1;
    nivoji.forEach((h, l) => {
      if (l % vsak || !najboljse[l]) return;
      barva((h - zlo) / (zhi - zlo), _col); _col.offsetHSL(0, 0, 0.15);
      dodajBes(st(h), _a.set(najboljse[l][1], YF + 0.02, najboljse[l][2]), 0.058, "#" + _col.convertLinearToSRGB().getHexString(), false);
    });
  }

  let rezZ = 0;
  function prerezIzracun() {
    ravnina.visible = false; zakljuci(prerezCevi, 0);
    if (!S.prerez) return;
    const fn = F(), a = S.a, b = bEf(), L = S.L, c = cx(), M = N + 0; // vzorci vzdolž x
    ravnina.position.set(0, 0, fZ(c)); ravnina.visible = true;
    let ni = 0;
    const ROZ = "#FF6FA5";
    const zid = -WH + 0.004;
    for (let i = 0; i < M; i++) {
      const x1 = -L + (2 * L * i) / M, x2 = -L + (2 * L * (i + 1)) / M;
      const z1 = fn.f(x1, c, a, b), z2 = fn.f(x2, c, a, b);
      cev(prerezCevi, ni++, svet(x1, c, z1, _a), svet(x2, c, z2, _b), 0.0065, ROZ);
      cev(prerezCevi, ni++, _a.set(fX(x1), fY(z1), zid), _b.set(fX(x2), fY(z2), zid), 0.005, ROZ);
    }
    zakljuci(prerezCevi, ni);
    const zk = fn.f(L, c, a, b);
    dodajBes("y = " + st(c), _a.set(WH - 0.02, Math.min(YT - 0.02, fY(zk) + 0.05), zid + 0.01), 0.062, "#FF9CC4", true, 1);
  }

  function tockaIzracun() {
    const fn = F(), a = S.a, b = bEf();
    const [x0, y0] = tockaXY(), z0 = fn.f(x0, y0, a, b);
    svet(x0, y0, z0, _a);
    _m.compose(_a, _q.identity(), _s.setScalar(0.022)); tocka.setMatrixAt(0, _m);
    _m.compose(_b.set(_a.x, YF + 0.004, _a.z), _q, _s.set(0.012, 0.004, 0.012)); tocka.setMatrixAt(1, _m);
    tocka.instanceMatrix.needsUpdate = true; tocka.computeBoundingSphere?.();
    // črtkana spustna črta do tal
    let ni = 0;
    const dol = _a.y - YF, crt = 0.022;
    for (let t = 0; t < dol - 1e-4 && ni < 40; t += 2 * crt) cev(tockaCevi, ni++, _c.set(_a.x, _a.y - t, _a.z), _d.set(_a.x, Math.max(YF, _a.y - t - crt), _a.z), 0.003, "#E8EDF7");
    let np = 0;
    if (S.gradient && fn.g(x0, y0, a, b, gr)) {
      const gx = gr[0], gy = gr[1], gl = Math.hypot(gx, gy);
      if (gl > 1e-9) {
        const OR = "#FFA94D";
        // na tleh: vektor ∇f v ravnini xy (dolžina sorazmerna z |∇f|)
        const len = Math.max(0.05, (0.26 * gl) / Math.max(gl, gradMax));
        const dx = gx / gl, dz = -gy / gl;
        const zac0 = new Vector3(_a.x, YF + 0.006, _a.z), kon = new Vector3(_a.x + dx * len, YF + 0.006, _a.z + dz * len);
        const smer = new Vector3(dx, 0, dz);
        cev(tockaCevi, ni++, zac0, _c.copy(kon).addScaledVector(smer, -0.035), 0.0055, OR);
        puscica(tockaPusc, np++, kon, smer, 0.04, 0.016, OR);
        // na ploskvi: smer najhitrejšega vzpona (dx, dy, |∇f|²) v merilu prizora
        const sx = WH / S.L, sz = (YT - YB) / (zhi - zlo);
        const v = new Vector3(gx * sx, gl * gl * sz, -gy * sx).normalize();
        // dvignemo jo malo nad ploskev (v smeri normale), da je ne zakrije
        const nrm = new Vector3(-gx * sx * sz / (sx * sx), 1, gy * sx * sz / (sx * sx)).normalize();
        _a.addScaledVector(nrm, 0.008);
        const k2 = _c.copy(_a).addScaledVector(v, 0.17);
        cev(tockaCevi, ni++, _a, _d.copy(k2).addScaledVector(v, -0.035), 0.0055, OR);
        puscica(tockaPusc, np++, k2.clone(), v, 0.04, 0.016, OR);
        dodajBes("∇f", kon.clone().add(new Vector3(0, 0.04, 0)), 0.062, "#FFC48A", true);
      }
    }
    zakljuci(tockaCevi, ni); zakljuci(tockaPusc, np);
    dodajBes("T", _c.copy(_a).add(_d.set(0.035, 0.045, 0)), 0.07, "#FFFFFF", true);
  }

  // ---------- besedila v nadzoru ----------
  const fmtTocka = (x, y) => `${st(x)}; ${st(y)}`;
  function izpisFunkcije() {
    const fn = F(), a = S.a, b = bEf(), L = S.L;
    let s = `z = ${fn.zapis(a, b)}, x, y ∈ [${st(-L)}, ${st(L)}]`;
    if (fn.bPoz && S.b < 0.1) s += " (tu mora biti b > 0, zato b = 0,1)";
    return s;
  }
  function izpisTocke() {
    const fn = F(), [x0, y0] = tockaXY();
    let s = `T(${fmtTocka(x0, y0)}): z = f(${fmtTocka(x0, y0)}) = ${st(fn.f(x0, y0, S.a, bEf()), 3)}`;
    if (S.prerez) s += " (T leži v prerezu, y₀ = c)";
    if (Math.abs(S.x0) > S.L + 1e-9 || (!S.prerez && Math.abs(S.y0) > S.L + 1e-9)) s += " (T je omejena na območje)";
    return s;
  }
  function izpisGradienta() {
    if (!S.gradient) return "vklopi »Gradient«";
    const fn = F(), [x0, y0] = tockaXY();
    if (!fn.g(x0, y0, S.a, bEf(), gr)) return "v tej točki (konica v izhodišču) gradient ne obstaja";
    const gl = Math.hypot(gr[0], gr[1]);
    return `∇f = (∂z/∂x; ∂z/∂y) = (${st(gr[0])}; ${st(gr[1])}), |∇f| = ${st(gl)}${gl < 1e-9 ? " (vodoravna tangentna ravnina)" : "; puščica kaže smer najhitrejšega naraščanja"}`;
  }
  function izpisPlastnic() {
    if (!S.plastnice) return "vklopi »Plastnice«";
    if (zmax - zmin < 1e-9) return `ploskev je vodoravna (z = ${st(zmin)}), zato plastnic ni`;
    if (!nivoji.length) return "na tem območju ni plastnic";
    const pr = nivoji.slice(0, 3).map((z) => st(z)).join("; ");
    return `z = ${pr}${nivoji.length > 3 ? "; …; " + st(nivoji[nivoji.length - 1]) : ""} (enak korak ${st(nivoji.korak)})`;
  }
  function izpisPrereza() {
    if (!S.prerez) return "vklopi »Prerez y = c«";
    const c = cx();
    return `y = ${st(c)}: z = ${F().rez(S.a, bEf(), c)}${Math.abs(S.c) > S.L + 1e-9 ? " (c je omejen na območje)" : ""}`;
  }

  // ---------- deli ----------
  function deli() {
    const fn = F(), a = S.a, b = bEf(), L = S.L, d = [];
    const tk = (v) => [v.x, v.y, v.z];
    const xs = 0.45 * L, ys = -0.35 * L;
    d.push({ id: "ploskev", ime: "Ploskev (graf funkcije)", opis: "Vsaki točki (x, y) na tleh pripada točka ploskve na višini z = f(x, y); barva pove višino, kot na zemljevidu.", barva: "#21918c", meshes: [ploskev], tocka: tk(svet(xs, ys, fn.f(xs, ys, a, b), _a)) });
    d.push({ id: "osi", ime: "Koordinatne osi", opis: "Osi x, y in z s številkami; narisane so ob robovih okvirja, da jih ploskev ne zakrije, os z pa je lahko v drugem merilu kot osi x in y.", barva: "#E8EDF7", meshes: [osi, puscice], tocka: [WH * 0.5, YF, WH] });
    if (S.plastnice && nivoji.length) d.push({ id: "plastnice", ime: "Plastnice", opis: "Črte, ki povezujejo točke z enako višino z; na tleh so narisane kot na zemljevidu in gostejše so tam, kjer je ploskev bolj strma.", barva: "#5ec962", meshes: [stene], tocka: [WH * 0.6, YF, WH * 0.6] });
    if (S.prerez) {
      const c = cx();
      d.push({ id: "prerez", ime: "Prerez y = c", opis: "Ravnina y = c seka ploskev v krivulji z = f(x, c); ista krivulja je na zadnji steni narisana kot običajen graf funkcije ene spremenljivke.", barva: "#FF6FA5", meshes: [prerezCevi, ravnina], tocka: tk(svet(-0.5 * L, c, fn.f(-0.5 * L, c, a, b), _a)) });
    }
    const [x0, y0] = tockaXY();
    d.push({ id: "tocka", ime: "Točka T", opis: S.gradient ? "Izbrana točka na ploskvi; oranžna puščica na tleh je gradient ∇f, na ploskvi pa kaže smer, v kateri se najhitreje vzpenjamo." : "Izbrana točka na ploskvi; njena višina je vrednost funkcije z = f(x₀, y₀).", barva: "#FFFFFF", meshes: [tocka], tocka: tk(svet(x0, y0, fn.f(x0, y0, a, b), _a)) });
    return d;
  }

  // ---------- nadzor ----------
  const ob = (k) => (v) => { S[k] = v; obnovi(); };
  const api = {
    group,
    deli: [],
    nadzor: [
      { tip: "izbira", id: "fn", oznaka: "Funkcija z = f(x, y)", moznosti: MOZNOSTI, vrednost: S.fn, ob: ob("fn") },
      { tip: "drsnik", id: "a", oznaka: "Parameter a", min: -2, max: 2, korak: 0.1, vrednost: S.a, ob: ob("a") },
      { tip: "drsnik", id: "b", oznaka: "Parameter b", min: -2, max: 2, korak: 0.1, vrednost: S.b, ob: ob("b"), vidno: () => F().rabi === "ab" },
      { tip: "drsnik", id: "L", oznaka: "Območje: |x|, |y| ≤", min: 1, max: 6, korak: 0.5, vrednost: S.L, ob: ob("L") },
      { tip: "izpis", id: "funkcija", oznaka: "Funkcija", vrednost: izpisFunkcije },
      { tip: "stikalo", id: "plastnice", oznaka: "Plastnice", vrednost: S.plastnice, ob: ob("plastnice") },
      { tip: "izpis", id: "plastniceIzpis", oznaka: "Višine plastnic", vrednost: izpisPlastnic, vidno: () => S.plastnice },
      { tip: "stikalo", id: "prerez", oznaka: "Prerez y = c", vrednost: S.prerez, ob: ob("prerez") },
      { tip: "drsnik", id: "c", oznaka: "c (lega prereza)", min: -6, max: 6, korak: 0.1, vrednost: S.c, ob: ob("c"), vidno: () => S.prerez },
      { tip: "izpis", id: "prerezIzpis", oznaka: "Krivulja prereza", vrednost: izpisPrereza, vidno: () => S.prerez },
      { tip: "drsnik", id: "x0", oznaka: "x₀ (točka T)", min: -6, max: 6, korak: 0.1, vrednost: S.x0, ob: ob("x0") },
      { tip: "drsnik", id: "y0", oznaka: "y₀ (točka T)", min: -6, max: 6, korak: 0.1, vrednost: S.y0, ob: ob("y0"), vidno: () => !S.prerez },
      { tip: "izpis", id: "tockaIzpis", oznaka: "Vrednost v točki", vrednost: izpisTocke },
      { tip: "stikalo", id: "gradient", oznaka: "Gradient", vrednost: S.gradient, ob: ob("gradient") },
      { tip: "izpis", id: "gradientIzpis", oznaka: "Gradient v točki", vrednost: izpisGradienta, vidno: () => S.gradient },
    ],
    merilo: () => null,
    dispose() {
      const geos = new Set(), mats = new Set();
      group.traverse((o) => { if (o.geometry) geos.add(o.geometry); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => mats.add(x)); });
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
      atlasTex.dispose(); legTex.dispose();
    },
  };
  obnovi();
  return api;
}
