// Mitoza: živalska celica z 2n = 4 kromosomi se razdeli na dve enaki hčerinski celici.
// 3D model po pogodbi v docs/3d.md (gradnik ne uvaža ničesar, THREE dobi kot argument).
// Vse stanje je čista funkcija poteka p (0 … 9), zato lahko učenec drsnik poljubno vleče.

export const info = {
  id: "mitoza",
  naslov: "Mitoza",
  podrocje: "procesi",
  predmet: "BIO",
  opis: "Živalska celica z 2n = 4 kromosomi se korak za korakom razdeli na dve enaki hčerinski celici: interfaza, profaza, prometafaza, metafaza, anafaza, telofaza in citokineza. Poenostavljeno: človeška celica ima 2n = 46 kromosomov.",
  merilo: { m: 30e-6, oznaka: "30 µm" },
  poskusi: "z »Naprej« pojdi do anafaze in preštej kromosome na vsakem polu celice.",
};

const MN_KROMOSOM = ["kromosom", "kromosoma", "kromosomi", "kromosomov"];
const MN_KROMATIDA = ["kromatida", "kromatidi", "kromatide", "kromatid"];
const mn = (n, b) => { const m = n % 100; return n + " " + (m === 1 ? b[0] : m === 2 ? b[1] : m === 3 || m === 4 ? b[2] : b[3]); };
const KR4 = mn(4, MN_KROMOSOM), KT4 = mn(4, MN_KROMATIDA), KT8 = mn(8, MN_KROMATIDA), KR8 = mn(8, MN_KROMOSOM);

// [ime faze, kaj se dogaja, število kromosomov in kromatid]
const FAZE = [
  ["Interfaza: faza G1", "Celica raste in opravlja svoje delo; kromosomi so razviti v tanke niti kromatina, vsak iz ene same kromatide.", `2n = ${KR4}, ${KT4}`],
  ["Interfaza: faza S", "DNK se podvoji: ob vsaki niti nastane enaka sestrska kromatida, podvoji se tudi centrosom.", `2n = ${KR4}; DNK se podvaja (4 → 8 kromatid)`],
  ["Interfaza: faza G2", "Celica raste naprej in se pripravlja na delitev; vsak kromosom ima zdaj dve enaki sestrski kromatidi.", `2n = ${KR4}, ${KT8}`],
  ["Profaza", "Kromatin se zvija (kondenzira) v vidne kromosome, jedrce izgine, centrosoma se razmikata in začne rasti delitveno vreteno.", `2n = ${KR4}, ${KT8}`],
  ["Prometafaza", "Jedrna ovojnica razpade, niti vretena se s kinetohori pripnejo na kromosome in jih premikajo proti sredini celice.", `2n = ${KR4}, ${KT8}`],
  ["Metafaza", "Kromosomi so urejeni v ekvatorialni ravnini; sestrski kromatidi vsakega kromosoma sta pripeti na nasprotna pola.", `2n = ${KR4}, ${KT8}`],
  ["Anafaza", "Povezava pri centromeri popusti, sestrski kromatidi se ločita in potujeta k nasprotnima poloma, celica se podaljša.", `${KR8} z eno kromatido, 4 na vsakem polu`],
  ["Telofaza", "Na vsakem polu je enak komplet kromosomov, ki se razvijajo v kromatin; okoli njih nastaneta novi jedrni ovojnici in jedrci.", `${KR8} v dveh nastajajočih jedrih, v vsakem 2n = 4`],
  ["Citokineza", "Cepitvena brazda se poglablja, dokler se citoplazma ne razdeli med dve hčerinski celici.", `Vsaka hčerinska celica: 2n = ${KR4}, ${KT4}`],
];
const KONEC = ["Konec: dve hčerinski celici", "Nastali sta dve hčerinski celici z enakimi kromosomi, kot jih je imela materinska celica (2n = 4).", `Vsaka od 2 celic: 2n = ${KR4}, ${KT4}`];

export function zgradi(THREE, ctx = {}) {
  const V3 = THREE.Vector3;
  const visoka = ctx.kakovost !== "nizka";
  const gibanje = ctx.gibanje !== false;
  const zac = ctx.zacetek || {};
  const group = new THREE.Group();
  group.name = "mitoza";
  const smeti = [];
  const hr = (x) => { smeti.push(x); return x; };
  const fiz = (o) => hr(new THREE.MeshPhysicalMaterial(o));
  const N = FAZE.length;

  // ---------- pomožne funkcije
  const cl = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const sm = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
  const ramp = (p, a, b) => sm((p - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  let seme = 20261104;
  const rnd = () => (seme = (seme * 16807) % 2147483647) / 2147483647;
  const _m = new THREE.Matrix4(), _m2 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = new V3(), _s = new V3(), _d = new V3();
  const _q3 = new THREE.Quaternion(), _p3 = new V3(), _s3 = new V3();
  const _y = new V3(0, 1, 0), _x = new V3(1, 0, 0);
  const NIC = new THREE.Matrix4().makeScale(0, 0, 0);

  // prosojnost po Fresnelu: rob membrane je bolj neprosojen kot sredina (kot milni mehurček)
  function fresnel(mat, kljuc, a0, a1, pw, deb = 0) {
    const u = { a0: { value: a0 }, a1: { value: a1 }, pw: { value: pw } };
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uA0 = u.a0; sh.uniforms.uA1 = u.a1; sh.uniforms.uPw = u.pw;
      sh.fragmentShader = "uniform float uA0;\nuniform float uA1;\nuniform float uPw;\n" + sh.fragmentShader.replace(
        "#include <opaque_fragment>",
        "{ float frs = pow(1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0), uPw); diffuseColor.a = mix(uA0, uA1, frs); }\n#include <opaque_fragment>");
      // deb: ista ploskev, zamaknjena za deb navznoter (notranja plast debele membrane)
      if (deb) sh.vertexShader = `const float uDeb = ${deb.toFixed(4)};\n` + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed -= objectNormal * uDeb;");
    };
    mat.customProgramCacheKey = () => "evklid-fresnel-" + kljuc;
    return u;
  }
  // nevidni deli se ne dajo izbrati; prosojne ovojnice pustijo prednost notranjim delom
  function izbirno(o, zamik = 0) {
    const osnova = Object.getPrototypeOf(o).raycast;
    o.raycast = function (rc, izid) {
      for (let x = this; x; x = x.parent) if (!x.visible) return;
      if (this.isInstancedMesh && this.count === 0) return;
      const n = izid.length;
      osnova.call(this, rc, izid);
      if (zamik) for (let i = n; i < izid.length; i++) izid[i].distance += zamik;
    };
    return o;
  }
  const VELIKA = new THREE.Sphere(new V3(), 1.1);
  function dinamicno(o) { o.frustumCulled = false; if (o.geometry && !o.isInstancedMesh) o.geometry.boundingSphere = VELIKA.clone(); return o; }
  function instance(geo, mat, n) {
    const m = new THREE.InstancedMesh(geo, mat, n);
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    m.frustumCulled = false;
    m.count = 0;
    m.boundingSphere = VELIKA.clone();
    return m;
  }

  // ---------- mere (enota = polmer enotske krogle; celica s premerom 18 µm ima polmer 0,6)
  const R0 = 0.6;                 // materinska celica
  const RH = R0 * Math.cbrt(0.5); // hčerinska celica (enaka skupna prostornina): 0,476
  const CH = 0.49;                // središče hčerinske celice na osi x
  const RJ = 0.26, RJH = 0.2;     // polmer jedra materinske in hčerinske celice

  // ---------- celična membrana: dve polovici, ki se v citokinezi zažmeta vsaka v svojo celico
  const nT = visoka ? 60 : 34, nF = visoka ? 72 : 40;
  const KOSOV = 2, vKos = (nT + 1) * nF;
  const memPos = new Float32Array(KOSOV * vKos * 3), memNor = new Float32Array(KOSOV * vKos * 3);
  const memIdx = [];
  for (let k = 0; k < KOSOV; k++) {
    const o = k * vKos;
    for (let i = 0; i < nT; i++) for (let j = 0; j < nF; j++) {
      const a = o + i * nF + j, b = o + i * nF + ((j + 1) % nF), c = a + nF, d = b + nF;
      memIdx.push(a, c, b, b, c, d);
    }
  }
  const memGeo = hr(new THREE.BufferGeometry());
  memGeo.setAttribute("position", new THREE.BufferAttribute(memPos, 3).setUsage(THREE.DynamicDrawUsage));
  memGeo.setAttribute("normal", new THREE.BufferAttribute(memNor, 3).setUsage(THREE.DynamicDrawUsage));
  memGeo.setIndex(memIdx);
  memGeo.setDrawRange(0, memIdx.length);
  const memMat = fiz({ color: "#F4B6A2", roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2, sheen: 1, sheenColor: new THREE.Color("#FFD5C8"), sheenRoughness: 0.35, transparent: true, depthWrite: false, side: THREE.FrontSide });
  fresnel(memMat, "membrana", 0.07, 0.7, 2.4);
  // notranja plast: ista ploskev, zamaknjena navznoter, da ima membrana na robu vidno debelino
  const memNMat = fiz({ color: "#F6BCA8", roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.3, sheen: 0.7, sheenColor: new THREE.Color("#FFD5C8"), sheenRoughness: 0.4, transparent: true, depthWrite: false, side: THREE.FrontSide });
  fresnel(memNMat, "membrana-n", 0.035, 0.62, 3.0, 0.014);
  const citMat = fiz({ color: "#F7D2B6", roughness: 0.85, transparent: true, depthWrite: false, side: THREE.BackSide });
  fresnel(citMat, "citoplazma", 0.13, 0.2, 1.0);
  const membrana = izbirno(dinamicno(new THREE.Mesh(memGeo, memMat)), 20);
  const citoplazma = izbirno(dinamicno(new THREE.Mesh(memGeo, citMat)), 30);
  const membranaN = izbirno(dinamicno(new THREE.Mesh(memGeo, memNMat)), 20);
  membrana.renderOrder = 8; membranaN.renderOrder = 6; citoplazma.renderOrder = 4;
  group.add(citoplazma, membranaN, membrana);

  // profil osno simetrične oblike: gladka unija dveh krogel (središči ±c, polmer r, zglajenost k)
  const prX = new Float32Array(nT + 1), prR = new Float32Array(nT + 1), prNX = new Float32Array(nT + 1), prNR = new Float32Array(nT + 1);
  const cosF = new Float32Array(nF), sinF = new Float32Array(nF);
  for (let j = 0; j < nF; j++) { cosF[j] = Math.cos((2 * Math.PI * j) / nF); sinF[j] = Math.sin((2 * Math.PI * j) / nF); }
  let pc = 0, pr = R0, pk = 0.2, gx = 0, gq = 0;
  function F(x, q) {
    const a = Math.sqrt((x - pc) * (x - pc) + q * q) - pr, b = Math.sqrt((x + pc) * (x + pc) + q * q) - pr;
    const h = cl(0.5 + (0.5 * (b - a)) / pk);
    return b + (a - b) * h - pk * h * (1 - h);
  }
  function gradF(x, q) {
    const da = Math.sqrt((x - pc) * (x - pc) + q * q) || 1e-9, db = Math.sqrt((x + pc) * (x + pc) + q * q) || 1e-9;
    const h = cl(0.5 + (0.5 * (db - da)) / pk);
    gx = (h * (x - pc)) / da + ((1 - h) * (x + pc)) / db;
    gq = (h * q) / da + ((1 - h) * q) / db;
    const l = Math.hypot(gx, gq) || 1; gx /= l; gq /= l;
  }
  function profil(c, r, k) {
    pc = c; pr = r; pk = Math.max(k, 1e-4);
    let w = 0;
    if (F(0, 0) < 0) { let lo = 0, hi = 1.2; for (let i = 0; i < 26; i++) { const m = (lo + hi) / 2; if (F(0, m) < 0) lo = m; else hi = m; } w = lo; }
    for (let i = 0; i <= nT; i++) {
      const th = (Math.PI * i) / nT, dx = Math.cos(th), dq = Math.sin(th);
      const tMax = Math.min(dx < -1e-6 ? c / -dx : 9, 1.6);
      let x, q;
      if (F(c + dx * tMax, dq * tMax) < 0) { x = 0; q = w; } // za ravnino x = 0: točka na robu brazde
      else {
        let lo = 0, hi = tMax;
        for (let it = 0; it < 26; it++) { const m = (lo + hi) / 2; if (F(c + dx * m, dq * m) < 0) lo = m; else hi = m; }
        x = c + dx * lo; q = dq * lo;
      }
      gradF(x, q);
      prX[i] = x; prR[i] = q; prNX[i] = gx; prNR[i] = gq;
    }
    return w;
  }
  // kos membrane: izhodišče O, os A, pravokotnici U, W (desnosučni sistem), sg = stran (+1 / -1)
  function pisiKos(k, ox, oy, oz, ax, ay, az, ux, uy, uz, wx, wy, wz, sg) {
    let o = k * vKos * 3;
    for (let i = 0; i <= nT; i++) {
      const x = prX[i] * sg, q = prR[i], nx = prNX[i] * sg, nq = prNR[i];
      for (let j = 0; j < nF; j++) {
        const cf = cosF[j], sf = sinF[j] * sg;
        const rx = ux * cf + wx * sf, ry = uy * cf + wy * sf, rz = uz * cf + wz * sf;
        memPos[o] = ox + ax * x + rx * q; memPos[o + 1] = oy + ay * x + ry * q; memPos[o + 2] = oz + az * x + rz * q;
        memNor[o] = ax * nx + rx * nq; memNor[o + 1] = ay * nx + ry * nq; memNor[o + 2] = az * nx + rz * nq;
        o += 3;
      }
    }
  }

  // ---------- organeli v citoplazmi: mitohondriji, zrnati ER, Golgijev aparat, ribosomi (umirjene barve, v ozadju)
  // Vsak organel pripada eni polovici celice (sg = ±1) in po citokinezi ostane v »svoji« hčerinski celici;
  // med delitvijo se umaknejo iz območja delitvenega vretena (okoli osi x).
  const _o = new V3(), _o2 = new V3(), _d2 = new V3(), _z = new V3(0, 0, 1), _qo = new THREE.Quaternion();
  const smer = (x, y, z) => new V3(x, y, z).normalize();
  const G_DIR = [smer(-0.5, 0.78, 0.38), smer(-0.62, 0.66, 0.42), smer(0.55, 0.72, -0.42)]; // Golgi: mati, leva, desna hči (desni je zadaj, da ne zakrije jedra)
  const C_DIR = smer(-0.07, 0.355, 0.12);
  // smer privzete kamere (azimut 35°, višina 20°): pred jedrom (v tej smeri) ni organelov, da ne zakrijejo kromosomov
  const KAM = smer(Math.sin(0.611) * Math.cos(0.349), Math.sin(0.349), Math.cos(0.611) * Math.cos(0.349));
  const G_Q = G_DIR.map((d) => {
    const n = d.clone().negate(), t1 = new V3().crossVectors(d, _z);
    if (t1.lengthSq() < 1e-4) t1.set(1, 0, 0);
    t1.normalize();
    return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(t1, new V3().crossVectors(n, t1), n));
  });
  function nakSmer() { let x, y, z, l; do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; z = rnd() * 2 - 1; l = Math.hypot(x, y, z); } while (l > 1 || l < 0.05); return new V3(x / l, y / l, z / l); }
  // sploščena membranska vrečka (cisterna): zgornja in spodnja ploskev se stikata v zaobljenem robu (vidna debelina)
  function blazina(nR, nA, ax, ay, K, deb, oblika, napih) {
    const v = [], idx = [];
    const rob = (f) => 1 + oblika * (0.6 * Math.sin(3 * f + 1.3) + 0.4 * Math.sin(5 * f + 0.4));
    const h = (r) => deb * (1 + napih * r ** 6) * Math.sqrt(Math.max(0, 1 - r ** 6));
    const pt = (r, f, sg, dz = 0) => {
      const R = rob(f) * r, x = Math.cos(f) * R * ax, y = Math.sin(f) * R * ay;
      return [x, y, -0.5 * K * (x * x + y * y) + 0.06 * Math.sin(4 * x + 1) * Math.sin(5 * y + 2) + sg * (h(r) + dz)];
    };
    const dodaj = (r, f, sg) => { v.push(...pt(r, f, sg)); return v.length / 3 - 1; };
    const vrh = [], dno = [], t0 = dodaj(0, 0, 1), d0 = dodaj(0, 0, -1);
    for (let i = 1; i <= nR; i++) {
      const r = Math.sin((Math.PI / 2) * (i / nR)), a = [], b = [];
      for (let j = 0; j < nA; j++) { const f = (2 * Math.PI * j) / nA, it = dodaj(r, f, 1); a.push(it); b.push(i === nR ? it : dodaj(r, f, -1)); }
      vrh.push(a); dno.push(b);
    }
    for (let j = 0; j < nA; j++) {
      const j1 = (j + 1) % nA;
      idx.push(t0, vrh[0][j], vrh[0][j1], d0, dno[0][j1], dno[0][j]);
      for (let i = 0; i < nR - 1; i++) {
        idx.push(vrh[i][j], vrh[i + 1][j], vrh[i][j1], vrh[i][j1], vrh[i + 1][j], vrh[i + 1][j1]);
        idx.push(dno[i][j], dno[i][j1], dno[i + 1][j], dno[i][j1], dno[i + 1][j1], dno[i + 1][j]);
      }
    }
    const g = hr(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    g.setIndex(idx); g.computeVertexNormals();
    g.userData.pt = pt;
    return g;
  }

  // mitohondriji: rahlo upognjene kapsule, svetle pregrade nakazujejo kriste
  const NMI = visoka ? 16 : 11;
  const miGeo = hr(new THREE.CapsuleGeometry(0.5, 1.5, visoka ? 4 : 3, visoka ? 12 : 8, visoka ? 4 : 2));
  { const pa = miGeo.attributes.position; for (let i = 0; i < pa.count; i++) { const y = pa.getY(i); pa.setX(i, pa.getX(i) + 0.09 * (y * y - 1.2)); } }
  const miPl = document.createElement("canvas"); miPl.width = 128; miPl.height = 256;
  {
    const g = miPl.getContext("2d");
    const gr = g.createLinearGradient(0, 0, 128, 0);
    gr.addColorStop(0, "#A9563F"); gr.addColorStop(0.5, "#C46A4E"); gr.addColorStop(1, "#A9563F");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 256);
    g.lineCap = "round";
    for (let i = 0; i < 10; i++) {
      const y0 = 34 + i * 19.5 + (rnd() - 0.5) * 6, x0 = rnd() * 128, len = 70 + rnd() * 40, ph = rnd() * 6;
      for (const [col, dy, lw] of [["rgba(60,20,14,0.5)", 3.5, 6], ["#F3BC97", 0, 3.6]]) {
        g.strokeStyle = col; g.lineWidth = lw;
        for (const ox of [0, -128]) {
          g.beginPath();
          for (let x = 0; x <= len; x += 4) { const yy = y0 + dy + 4 * Math.sin(x * 0.09 + ph); x === 0 ? g.moveTo(x0 + ox + x, yy) : g.lineTo(x0 + ox + x, yy); }
          g.stroke();
        }
      }
    }
  }
  const miTex = hr(new THREE.CanvasTexture(miPl)); miTex.colorSpace = THREE.SRGBColorSpace; miTex.wrapS = THREE.RepeatWrapping;
  const miMat = fiz({ map: miTex, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.35, sheen: 0.5, sheenColor: new THREE.Color("#FFC9A8"), sheenRoughness: 0.45 });
  const mito = izbirno(instance(miGeo, miMat, NMI));
  mito.count = NMI;
  const miOff = new Float32Array(NMI * 3), miAx = new Float32Array(NMI * 3), miS = new Float32Array(NMI), miL = new Float32Array(NMI), miSg = new Int8Array(NMI);
  let miTock = 0, miBest = -9;
  for (let i = 0; i < NMI; i++) {
    let d, sg;
    // izmenično v levi in desni polovici, da dobita obe hčerinski celici enako mitohondrijev
    sg = i & 1 ? 1 : -1;
    do { d = nakSmer(); rnd(); }
    while (d.x * sg < 0.08 || d.dot(KAM) > 0.7 || d.dot(G_DIR[0]) > 0.84 || d.dot(C_DIR) > 0.9 || d.dot(G_DIR[sg > 0 ? 2 : 1]) > 0.84);
    const rad = 0.68 + 0.2 * rnd();
    miOff[i * 3] = d.x * rad; miOff[i * 3 + 1] = d.y * rad; miOff[i * 3 + 2] = d.z * rad; miSg[i] = sg;
    const a = nakSmer(); miAx[i * 3] = a.x; miAx[i * 3 + 1] = a.y; miAx[i * 3 + 2] = a.z;
    miS[i] = 0.034 + 0.008 * rnd(); miL[i] = 0.8 + 0.5 * rnd();
    mito.setColorAt(i, new THREE.Color().setScalar(0.88 + 0.16 * rnd()));
    if (sg > 0 && d.z - 0.5 * Math.abs(d.y) > miBest) { miBest = d.z - 0.5 * Math.abs(d.y); miTock = i; }
  }
  group.add(mito);

  // zrnati endoplazemski retikulum: pari vzporednih cistern okoli jedra (ne pred jedrom, da ne zakrijejo kromosomov)
  const NER = visoka ? 12 : 8, NRP = visoka ? 16 : 10;
  const erGeo = blazina(visoka ? 6 : 5, visoka ? 22 : 16, 1, 0.66, 0.36, 0.05, 0.16, 0.3);
  const erMat = fiz({ color: "#7FA8BC", roughness: 0.45, clearcoat: 0.45, clearcoatRoughness: 0.35, sheen: 0.4, sheenColor: new THREE.Color("#D6EEF6"), sheenRoughness: 0.4 });
  const erMesh = izbirno(instance(erGeo, erMat, NER));
  erMesh.count = NER;
  const erDir = [], erDirH = [], erQH = [], erF = new Float32Array(NER), erS = new Float32Array(NER), erSg = new Int8Array(NER), erQ = [], erR = [], erM = [];
  let erTock = 0, erBest = -9;
  {
    const kand = [], NKAND = 240;
    for (let i = 0; i < NKAND; i++) {
      const y = 1 - (2 * (i + 0.5)) / NKAND, rr = Math.sqrt(1 - y * y), f = i * 2.39996;
      const d = new V3(Math.cos(f) * rr, y, Math.sin(f) * rr);
      if (Math.abs(d.dot(KAM)) < 0.22 && d.dot(G_DIR[0]) < 0.74 && d.dot(C_DIR) < 0.87) kand.push(d);
    }
    for (let i = 0; i < NER; i++) {
      // pari izmenično v levi in desni polovici, da dobi vsaka hčerinska celica svoj ER
      const par = i >> 1, sg = par & 1 ? 1 : -1, NP = NER / 2, mp = (NP - (par & 1) + 1) >> 1;
      const kp = kand.filter((e) => e.x * sg > 0.12), kg = kp.filter((e) => e.dot(G_DIR[sg > 0 ? 2 : 1]) < 0.6), kq = kg.length >= mp ? kg : kp.length ? kp : kand;
      const d = kq[Math.floor((((par >> 1) + 0.5) * kq.length) / mp)].clone();
      if (i & 1) d.add(nakSmer().multiplyScalar(0.06)).normalize();
      rnd();
      erDir.push(d); erF[i] = i & 1 ? 1.25 : 1.12; erS[i] = (0.09 + 0.022 * rnd()) * (i & 1 ? 1.05 : 1); erSg[i] = sg;
      erR.push(new THREE.Quaternion().setFromAxisAngle(_z, rnd() * 6.283));
      erQ.push(new THREE.Quaternion().setFromUnitVectors(_z, d).multiply(erR[i]));
      // v hčerinski celici: vrečka, ki bi zadela v Golgijev aparat, se preseli na spodnjo stran jedra
      const dh = d.dot(G_DIR[sg > 0 ? 2 : 1]) > 0.6 ? new V3(d.x, -d.y, d.z) : d;
      erDirH.push(dh); erQH.push(new THREE.Quaternion().setFromUnitVectors(_z, dh).multiply(erR[i]));
      erM.push(new THREE.Matrix4());
      if (sg > 0 && d.z > erBest) { erBest = d.z; erTock = i; }
    }
  }
  group.add(erMesh);

  // ribosomi: prosti v citoplazmi in pripeti na ER (zelo povečani)
  const NG = visoka ? 240 : 120, NRIB = NG + NER * NRP;
  const zrnGeo = hr(new THREE.IcosahedronGeometry(1, 0));
  const zrnMat = fiz({ color: "#A383BC", roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.4, sheen: 0.3, sheenColor: new THREE.Color("#E6D4F4") });
  const zrna = izbirno(instance(zrnGeo, zrnMat, NRIB));
  zrna.count = NRIB;
  const zOff = new Float32Array(NG * 3), zVel = new Float32Array(NG), zSg = new Int8Array(NG), zQ = [];
  let zTock = 0;
  for (let g = 0; g < NG; g++) {
    const d = nakSmer(), rad = 0.5 + 0.42 * Math.cbrt(rnd());
    zOff[g * 3] = d.x * rad; zOff[g * 3 + 1] = d.y * rad; zOff[g * 3 + 2] = d.z * rad;
    zVel[g] = 0.0036 + 0.0014 * rnd();
    zSg[g] = zOff[g * 3] + (rnd() - 0.5) * 0.5 >= 0 ? 1 : -1;
    zQ.push(new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28)));
    if (zSg[g] > 0 && d.z > 0.5 && d.y < -0.3 && !zTock) zTock = g;
  }
  const erRib = new Float32Array(NER * NRP * 3);
  for (let i = 0; i < NER * NRP; i++) {
    const v = erGeo.userData.pt(0.15 + 0.75 * Math.sqrt(rnd()), rnd() * 6.283, rnd() < 0.6 ? 1 : -1, 0.06);
    erRib[i * 3] = v[0]; erRib[i * 3 + 1] = v[1]; erRib[i * 3 + 2] = v[2];
  }
  group.add(zrna);

  // Golgijev aparat: kup ukrivljenih cistern ob centrosomu (konveksna stran cis proti jedru) in mešički ob robovih
  const NCIS = visoka ? 5 : 4, NVZ = visoka ? 30 : 18;
  const golGeo = blazina(4, visoka ? 20 : 14, 1, 0.42, 0.5, 0.045, 0.05, 0.6);
  const golMat = fiz({ roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.3, sheen: 0.6, sheenColor: new THREE.Color("#FFE7B8"), sheenRoughness: 0.4 });
  const golgi = izbirno(instance(golGeo, golMat, 3 * NCIS));
  golgi.count = 3 * NCIS;
  const GOL_W = [], GOL_COL = [], GOL_RAD = [0.4, 0.31, 0.31], GOL_SK = [1, 0.8, 0.8];
  for (let c = 0; c < NCIS; c++) {
    const t = c / (NCIS - 1), mid = 1 - 0.14 * Math.sin(Math.PI * t); // srednje cisterne malo temnejše (zasenčene)
    GOL_W.push(0.088 * (1 - 0.22 * t * t));
    GOL_COL.push(new THREE.Color("#CFC680").lerp(new THREE.Color("#E39A5C"), t).multiplyScalar(mid));
    golgi.setColorAt(c, GOL_COL[c]);
  }
  const vzGeo = hr(new THREE.IcosahedronGeometry(1, 1));
  const mesicki = izbirno(instance(vzGeo, golMat, NVZ));
  mesicki.count = NVZ;
  const vzL = new Float32Array(NVZ * 3), vzOff = new Float32Array(NVZ * 3), vzSg = new Int8Array(NVZ), vzR = new Float32Array(NVZ);
  for (let i = 0; i < NVZ; i++) {
    const tip = i % 3, sd = rnd() < 0.5 ? -1 : 1;
    if (tip < 2) { vzL[i * 3] = sd * 0.088 * (0.95 + 0.35 * rnd()); vzL[i * 3 + 1] = (rnd() - 0.5) * 0.06; vzL[i * 3 + 2] = -0.045 + 0.08 * rnd(); }
    else { vzL[i * 3] = (rnd() - 0.5) * 0.12; vzL[i * 3 + 1] = (rnd() - 0.5) * 0.05; vzL[i * 3 + 2] = rnd() < 0.7 ? -0.06 - 0.03 * rnd() : 0.055 + 0.02 * rnd(); }
    const d = nakSmer(), rad = 0.55 + 0.32 * rnd();
    vzOff[i * 3] = d.x * rad; vzOff[i * 3 + 1] = d.y * rad; vzOff[i * 3 + 2] = d.z * rad;
    vzSg[i] = i & 1 ? 1 : -1; vzOff[i * 3] = vzSg[i] * Math.abs(vzOff[i * 3]); vzR[i] = 0.0065 + 0.003 * rnd();
    mesicki.setColorAt(i, new THREE.Color("#E3B070").multiplyScalar(0.9 + 0.15 * rnd()));
  }
  group.add(golgi, mesicki);
  const _gc = new V3();
  // središče Golgijevega kupa s (0 = mati, 1 = leva, 2 = desna hči) v _gc
  function golgiSredisce(s) { const hx = s === 0 ? 0 : s === 1 ? -CH : CH; _gc.copy(G_DIR[s]).multiplyScalar(GOL_RAD[s]); _gc.x += hx; return _gc; }

  // skupno stanje za organele (nastavi posodobi)
  let cCel = 0, rCel = R0, vrW = 0, tCas = 0, osvezeno = false;
  const nihaj = (i, k) => Math.sin(tCas * (0.35 + 0.06 * ((i * 7 + k * 3) % 5)) + i * 1.7 + k * 2.1);
  // točka v polovici celice s središčem (ox, 0, 0): umik iz vretena, nato ostane rob od membrane; izid v _o
  function vCelico(x, y, z, ox, rob, marg = 0) {
    if (vrW > 0) {
      const q = Math.hypot(y, z), qm = (0.22 + marg) * Math.max(0, 1 - (x / (0.66 + marg)) ** 2);
      if (qm > 0 && q < 0.6) {
        const qn = lerp(q, qm + q * (1 - qm / 0.6), vrW);
        if (q > 1e-5) { y *= qn / q; z *= qn / q; } else y = qn;
      }
    }
    if (F(x, Math.hypot(y, z)) > -rob) {
      let lo = 0, hi = 1;
      for (let it = 0; it < 10; it++) { const m = (lo + hi) / 2; if (F(ox + (x - ox) * m, Math.hypot(y, z) * m) > -rob) hi = m; else lo = m; }
      x = ox + (x - ox) * lo; y *= lo; z *= lo;
    }
    _o.set(x, y, z);
  }
  function organeli() {
    const zs = rCel / R0, K = R0 * zs;
    // mitohondriji: dolga os vzporedna z membrano
    for (let i = 0; i < NMI; i++) {
      const ox = miSg[i] * cCel, a = 0.012;
      vCelico(ox + miOff[i * 3] * K + a * nihaj(i, 0), miOff[i * 3 + 1] * K + a * nihaj(i, 1), miOff[i * 3 + 2] * K + a * nihaj(i, 2), ox, 0.04, 0.04);
      _d.set(_o.x - ox, _o.y, _o.z).normalize();
      _d2.set(miAx[i * 3] + 0.25 * nihaj(i, 3), miAx[i * 3 + 1], miAx[i * 3 + 2]).cross(_d);
      if (_d2.lengthSq() < 0.01) _d2.set(1, 0, 0).cross(_d);
      _d2.normalize();
      _q.setFromUnitVectors(_y, _d2); _s.set(miS[i], miS[i] * miL[i], miS[i]);
      mito.setMatrixAt(i, _m.compose(_o, _q, _s));
    }
    mito.instanceMatrix.needsUpdate = true;
    mito.getMatrixAt(miTock, _m); _o2.setFromMatrixPosition(_m); setT(DELI.mitohondrij.tocka, _o2.x, _o2.y, _o2.z);

    // ER: okoli jedra (mati ali hči); med delitvijo razdrobljen ob robu celice
    const fr = ramp(p, 3.2, 4.2) * (1 - ramp(p, 7.5, 8.5)), hc = ramp(p, 6.5, 7.5);
    for (let i = 0; i < NER; i++) {
      const sg = erSg[i], d = hc < 0.5 ? erDir[i] : erDirH[i], rj = lerp(RJ, RJH, hc) * erF[i], hx = hc * sg * CH;
      let x = hx + d.x * rj, y = d.y * rj, z = d.z * rj;
      _qo.copy(hc < 0.5 ? erQ[i] : erQH[i]);
      if (fr > 0) {
        const ox = sg * cCel, k = K * 0.84;
        const e = erDir[i];
        vCelico(ox + e.x * k, e.y * k, e.z * k, ox, 0.035, 0.07);
        x = lerp(x, _o.x, fr); y = lerp(y, _o.y, fr); z = lerp(z, _o.z, fr);
        _d.set(_o.x - ox, _o.y, _o.z).normalize();
        _q.setFromUnitVectors(_z, _d).multiply(erR[i]);
        _qo.slerp(_q, fr);
      }
      _o.set(x, y, z); _s.setScalar(erS[i] * lerp(lerp(1, 0.8, hc), 0.55, fr));
      erM[i].compose(_o, _qo, _s);
      erMesh.setMatrixAt(i, erM[i]);
      for (let j = 0; j < NRP; j++) {
        const b = (i * NRP + j) * 3;
        _o2.set(erRib[b], erRib[b + 1], erRib[b + 2]).applyMatrix4(erM[i]);
        _s.setScalar(0.0042);
        zrna.setMatrixAt(NG + i * NRP + j, _m.compose(_o2, zQ[j], _s));
      }
    }
    erMesh.instanceMatrix.needsUpdate = true;
    _o.setFromMatrixPosition(erM[erTock]); setT(DELI.er.tocka, _o.x, _o.y, _o.z);

    // prosti ribosomi
    for (let g = 0; g < NG; g++) {
      const ox = zSg[g] * cCel, a = 0.004;
      vCelico(ox + zOff[g * 3] * K + a * nihaj(g, 0), zOff[g * 3 + 1] * K + a * nihaj(g, 1), zOff[g * 3 + 2] * K + a * nihaj(g, 2), ox, 0.025);
      const v = zVel[g];
      _s.set(v * 1.25, v, v);
      zrna.setMatrixAt(g, _m.compose(_o, zQ[g], _s));
    }
    zrna.instanceMatrix.needsUpdate = true;
    zrna.getMatrixAt(zTock, _m); _o2.setFromMatrixPosition(_m); setT(DELI.ribosomi.tocka, _o2.x, _o2.y, _o2.z);

    // Golgijev aparat: v profazi razpade na mešičke, v telofazi se ob vsakem jedru sestavi znova
    const gm = 1 - ramp(p, 3.0, 3.9), gd = ramp(p, 7.6, 8.6);
    let ng = 0; // le vidne cisterne (nevidne se ne rišejo)
    for (let s = 0; s < 3; s++) {
      const vis = s === 0 ? gm : gd;
      golgiSredisce(s);
      for (let c = 0; c < NCIS; c++) {
        if (vis < 0.01) continue;
        const k = ng++;
        const off = (c - (NCIS - 1) / 2) * 0.017 * GOL_SK[s], raz = (1 - vis) * 0.03;
        _o.copy(_gc).addScaledVector(G_DIR[s], -off + raz * (c - (NCIS - 1) / 2));
        _s.setScalar(GOL_W[c] * GOL_SK[s] * (0.25 + 0.75 * vis));
        golgi.setMatrixAt(k, _m.compose(_o, G_Q[s], _s)); golgi.setColorAt(k, GOL_COL[c]);
      }
    }
    golgi.count = ng; golgi.instanceMatrix.needsUpdate = true; if (golgi.instanceColor) golgi.instanceColor.needsUpdate = true;
    const sc = ramp(p, 3.0, 4.0) * (1 - ramp(p, 7.6, 8.6));
    for (let i = 0; i < NVZ; i++) {
      const sg = vzSg[i], s = p < 6 ? 0 : sg > 0 ? 2 : 1, a = 0.004, sk = GOL_SK[s];
      golgiSredisce(s);
      _o2.set(vzL[i * 3] * sk, vzL[i * 3 + 1] * sk, vzL[i * 3 + 2] * sk).applyQuaternion(G_Q[s]).add(_gc);
      if (sc > 0) {
        const ox = sg * cCel;
        vCelico(ox + vzOff[i * 3] * K, vzOff[i * 3 + 1] * K, vzOff[i * 3 + 2] * K, ox, 0.03);
        _o2.lerp(_o, sc);
      }
      _o2.x += a * nihaj(i + 50, 0); _o2.y += a * nihaj(i + 50, 1); _o2.z += a * nihaj(i + 50, 2);
      _s.setScalar(vzR[i] * sk);
      mesicki.setMatrixAt(i, _m.compose(_o2, _q.identity(), _s));
    }
    mesicki.instanceMatrix.needsUpdate = true;
    golgiSredisce(p < 6 ? 0 : 2); setT(DELI.golgi.tocka, _gc.x, _gc.y, _gc.z);
  }

  // ---------- jedro: ovojnica s porami, ki razpade na koščke in se spet sestavi
  const TW = visoka ? 512 : 256, TH = TW / 2;
  function platno(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  const aPl = platno(TW, TH), aCtx = aPl.getContext("2d");
  const bPl = platno(TW, TH), bCtx = bPl.getContext("2d");
  {
    const NV = 38, vt = [], vv = [];
    for (let i = 0; i < NV; i++) {
      const y = 1 - (2 * (i + 0.5)) / NV, rr = Math.sqrt(1 - y * y), f = i * 2.39996 + rnd() * 0.6;
      vt.push(Math.cos(f) * rr, y, Math.sin(f) * rr); vv.push(0.18 + 0.8 * rnd());
    }
    const img = aCtx.createImageData(TW, TH), d = img.data;
    for (let py = 0; py < TH; py++) {
      const th = (Math.PI * (py + 0.5)) / TH, st = Math.sin(th), ct = Math.cos(th);
      for (let px = 0; px < TW; px++) {
        const ph = (2 * Math.PI * (px + 0.5)) / TW;
        const x = -Math.cos(ph) * st, y = ct, z = Math.sin(ph) * st;
        let d1 = 9, d2 = 9, i1 = 0;
        for (let i = 0; i < NV; i++) {
          const dd = (x - vt[i * 3]) ** 2 + (y - vt[i * 3 + 1]) ** 2 + (z - vt[i * 3 + 2]) ** 2;
          if (dd < d1) { d2 = d1; d1 = dd; i1 = i; } else if (dd < d2) d2 = dd;
        }
        const raz = Math.sqrt(d2) - Math.sqrt(d1);
        const v = raz < 0.035 ? 0.1 : vv[i1];
        const o = (py * TW + px) * 4;
        d[o] = raz < 0.035 ? 0 : Math.round(255 * cl(1 - (raz - 0.035) / 0.05)); d[o + 1] = d[o + 2] = Math.round(v * 255); d[o + 3] = 255;
      }
    }
    aCtx.putImageData(img, 0, 0);
    bCtx.fillStyle = "#cfcbe2"; bCtx.fillRect(0, 0, TW, TH);
    const NP = visoka ? 300 : 170, rp = TW / 260;
    for (let i = 0; i < NP; i++) {
      const y = rnd() * 2 - 1, f = rnd() * 6.2832;
      const th = Math.acos(y), sth = Math.max(0.2, Math.sin(th));
      const px = (f / 6.2832) * TW, py = (th / Math.PI) * TH;
      for (const ox of [-TW, 0, TW]) {
        aCtx.fillStyle = "#000"; aCtx.beginPath(); aCtx.ellipse(px + ox, py, rp / sth, rp, 0, 0, 6.2832); aCtx.fill();
        bCtx.strokeStyle = "#ffffff"; bCtx.lineWidth = rp * 0.9; bCtx.beginPath(); bCtx.ellipse(px + ox, py, (rp * 1.5) / sth, rp * 1.5, 0, 0, 6.2832); bCtx.stroke();
      }
    }
  }
  const aTex = hr(new THREE.CanvasTexture(aPl));
  const bTex = hr(new THREE.CanvasTexture(bPl)); bTex.colorSpace = THREE.SRGBColorSpace;
  const jedroGeo = hr(new THREE.SphereGeometry(1, visoka ? 64 : 36, visoka ? 40 : 22));
  const ovojMat = fiz({ color: "#B7A6FF", map: bTex, alphaMap: aTex, alphaTest: 0.03, roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.3, sheen: 0.6, sheenColor: new THREE.Color("#E4DCFF"), transparent: true, depthWrite: false, side: THREE.DoubleSide });
  fresnel(ovojMat, "ovojnica", 0.17, 0.85, 1.8);
  // med razpadom so robovi koščkov svetlejši (prerez obeh membran)
  const ovojLom = { value: 0 };
  {
    const prej = ovojMat.onBeforeCompile;
    ovojMat.onBeforeCompile = (sh) => {
      prej(sh);
      sh.uniforms.uLom = ovojLom;
      sh.fragmentShader = "uniform float uLom;\n" + sh.fragmentShader.replace("#include <alphatest_fragment>", "#include <alphatest_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.98, 1.0), 0.8 * uLom * texture2D(alphaMap, vAlphaMapUv).r);");
    };
  }
  // vsako jedro ima zunanjo in notranjo membrano (instanci i in n + i), vmes je perinuklearni prostor
  const ovojnica = izbirno(instance(jedroGeo, ovojMat, 4), 10);
  const OVOJ_N = 0.92, BELA = new THREE.Color(1, 1, 1), OVOJ_NB = new THREE.Color(0.8, 0.76, 0.92);
  for (let i = 0; i < 4; i++) ovojnica.setColorAt(i, BELA);
  ovojnica.renderOrder = 3;
  group.add(ovojnica);
  const OVOJ_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.6, 0.3, 0.2));

  // jedrce: rahlo grudasta krogla
  const jcGeo = hr(new THREE.SphereGeometry(1, visoka ? 30 : 18, visoka ? 20 : 12));
  {
    const pa = jcGeo.attributes.position;
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
      const f = 1 + 0.1 * Math.sin(5 * x + 1) * Math.sin(4 * y + 2) * Math.sin(6 * z) + 0.06 * Math.sin(9 * x + 7 * z);
      pa.setXYZ(i, x * f, y * f, z * f);
    }
    jcGeo.computeVertexNormals();
  }
  const jcMat = fiz({ color: "#6E4FD0", roughness: 0.55, clearcoat: 0.4, sheen: 0.5, sheenColor: new THREE.Color("#B9A4FF") });
  const jedrca = izbirno(instance(jcGeo, jcMat, 2));
  group.add(jedrca);

  // ---------- kromosomi: 2 homologna para (dolg in kratek), materin (M) in očetov (O)
  const BARVA_M = new THREE.Color("#FF6B7C"), BARVA_O = new THREE.Color("#4DA6FF");
  const KR = [
    { oz: "1M", mati: true, L: 0.29, sc: 0.42, r: 0.021, T: [-0.42, 0.2, 0.12], rad: 0.36, aPro: 0.55, psi: 0.5 },
    { oz: "1O", mati: false, L: 0.29, sc: 0.42, r: 0.021, T: [0.38, -0.22, 0.14], rad: 0.36, aPro: -0.95, psi: 3.64 },
    { oz: "2M", mati: true, L: 0.18, sc: 0.31, r: 0.02, T: [0.24, 0.42, -0.16], rad: 0.3, aPro: 2.1, psi: 2.07 },
    { oz: "2O", mati: false, L: 0.18, sc: 0.31, r: 0.02, T: [-0.27, -0.38, -0.2], rad: 0.3, aPro: 1.25, psi: 5.21 },
  ];
  const NS = visoka ? 96 : 56, NR = visoka ? 12 : 7, KC = visoka ? 4 : 2;
  const NK = 8, OBR = NS + 2 * KC, vKr = OBR * NR + 2;
  // niti kromatina (v enotah polmera jedra) in odmik sestrske niti
  const nit = new Float32Array(4 * NS * 3), odm = new Float32Array(4 * NS * 3);
  for (let j = 0; j < 4; j++) {
    const kr = KR[j], dl = kr.L / 0.25, kom = [], kom2 = [];
    for (let a = 0; a < 3; a++) for (let c = 0; c < 4; c++) kom.push([a, (1.1 + c * 1.45 + rnd() * 0.8) * (0.7 + 0.6 * dl), rnd() * 6.283, 1 / (1 + c * 0.8)]);
    for (let a = 0; a < 3; a++) for (let c = 0; c < 2; c++) kom2.push([a, 3 + c * 4 + rnd() * 2, rnd() * 6.283, 1]);
    let mx = 0, mx2 = 0;
    for (let i = 0; i < NS; i++) {
      const s = i / (NS - 1), b = (j * NS + i) * 3;
      for (const [a, f, ph, am] of kom) nit[b + a] += am * Math.sin(6.2832 * f * s + ph);
      for (const [a, f, ph, am] of kom2) odm[b + a] += am * Math.sin(6.2832 * f * s + ph);
      mx = Math.max(mx, Math.hypot(nit[b], nit[b + 1], nit[b + 2]));
      mx2 = Math.max(mx2, Math.hypot(odm[b], odm[b + 1], odm[b + 2]));
    }
    for (let i = 0; i < NS * 3; i++) { nit[j * NS * 3 + i] *= kr.rad / mx; odm[j * NS * 3 + i] *= 0.075 / mx2; }
  }
  // geometrija vseh 16 … 8 kromatid v enem kosu (en klic risanja), barve po ogliščih
  const kPos = new Float32Array(NK * vKr * 3), kNor = new Float32Array(NK * vKr * 3), kCol = new Float32Array(NK * vKr * 3);
  const kIdx = [];
  for (let k = 0; k < NK; k++) {
    const v0 = k * vKr, t0 = v0, o0 = v0 + 1, t1 = v0 + 1 + OBR * NR;
    for (let a = 0; a < NR; a++) kIdx.push(t0, o0 + ((a + 1) % NR), o0 + a);
    for (let i = 0; i < OBR - 1; i++) for (let a = 0; a < NR; a++) {
      const A = o0 + i * NR + a, B = o0 + i * NR + ((a + 1) % NR), C = A + NR, D = B + NR;
      kIdx.push(A, B, C, B, D, C);
    }
    const ol = o0 + (OBR - 1) * NR;
    for (let a = 0; a < NR; a++) kIdx.push(t1, ol + a, ol + ((a + 1) % NR));
    const bar = KR[k >> 1].mati ? BARVA_M : BARVA_O;
    for (let v = 0; v < vKr; v++) { kCol[(v0 + v) * 3] = bar.r; kCol[(v0 + v) * 3 + 1] = bar.g; kCol[(v0 + v) * 3 + 2] = bar.b; }
  }
  const krGeo = hr(new THREE.BufferGeometry());
  krGeo.setAttribute("position", new THREE.BufferAttribute(kPos, 3).setUsage(THREE.DynamicDrawUsage));
  krGeo.setAttribute("normal", new THREE.BufferAttribute(kNor, 3).setUsage(THREE.DynamicDrawUsage));
  krGeo.setAttribute("color", new THREE.BufferAttribute(kCol, 3));
  // senčenje v pregibu med sestrskima kromatidama in ob centromeri (namesto prave zasenčenosti okolice)
  const kAo = new Float32Array(NK * vKr).fill(1);
  krGeo.setAttribute("ao", new THREE.BufferAttribute(kAo, 1).setUsage(THREE.DynamicDrawUsage));
  krGeo.setIndex(kIdx);
  krGeo.setDrawRange(0, kIdx.length);
  const krMat = fiz({ vertexColors: true, roughness: 0.38, clearcoat: 0.45, clearcoatRoughness: 0.35, sheen: 0.18, sheenColor: new THREE.Color("#ffe6ee"), sheenRoughness: 0.6 });
  krMat.onBeforeCompile = (sh) => {
    sh.vertexShader = "attribute float ao;\nvarying float vAo;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvAo = ao;");
    sh.fragmentShader = "varying float vAo;\n" + sh.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.rgb *= vAo;");
  };
  krMat.customProgramCacheKey = () => "evklid-kromosomi-ao";
  const kromosomi = izbirno(dinamicno(new THREE.Mesh(krGeo, krMat)));
  group.add(kromosomi);

  // stanje vsake kromatide (k = 2 · kromosom + sestra)
  const sX = new Float32Array(NK * NS), sY = new Float32Array(NK * NS), sZ = new Float32Array(NK * NS), sR = new Float32Array(NK * NS);
  const kKap = new Float32Array(NK), kTc = new Float32Array(NK * 3), kTs = new Float32Array(NK), kRep = new Float32Array(NK), kOw = new Float32Array(NK), kSkrij = new Float32Array(NK);
  const kAoC = new Float32Array(NK), sK = new Float32Array(NK * NS), kC = new Float32Array(NK * 3), kY = new Float32Array(NK * 3), kS = new Float32Array(NK * 3), kM = new Float32Array(NK * 3), kB = new Float32Array(NK);
  const R_NIT = 0.0055;

  function vzorci(k) {
    const j = k >> 1, sis = k & 1, kr = KR[j], b0 = k * NS;
    const kapR = kKap[k], kap = sm(kapR), vij = 4 * kapR * (1 - kapR);
    const Cx = kC[k * 3], Cy = kC[k * 3 + 1], Cz = kC[k * 3 + 2];
    const Yx = kY[k * 3], Yy = kY[k * 3 + 1], Yz = kY[k * 3 + 2];
    const Sx = kS[k * 3], Sy = kS[k * 3 + 1], Sz = kS[k * 3 + 2];
    const Mx = kM[k * 3], My = kM[k * 3 + 1], Mz = kM[k * 3 + 2];
    const Zx = Yy * Sz - Yz * Sy, Zy = Yz * Sx - Yx * Sz, Zz = Yx * Sy - Yy * Sx;
    const tcx = kTc[k * 3], tcy = kTc[k * 3 + 1], tcz = kTc[k * 3 + 2], ts = kTs[k];
    const T = kr.T, rep = kRep[k], ow = kOw[k] * (sis ? 0.5 : -0.5), d0 = kr.r * 0.62, dA = kr.r * 1.08;
    const om = (2 * Math.PI * kr.L) / 0.022;
    for (let i = 0; i < NS; i++) {
      const s = i / (NS - 1), b = (j * NS + i) * 3;
      const fr = rep > 0 ? sm((rep * 1.25 - s) / 0.12) : 0;
      const tx = tcx + ts * (T[0] + nit[b] + odm[b] * fr * ow);
      const ty = tcy + ts * (T[1] + nit[b + 1] + odm[b + 1] * fr * ow);
      const tz = tcz + ts * (T[2] + nit[b + 2] + odm[b + 2] * fr * ow);
      let rN = R_NIT;
      if (kSkrij[k]) rN *= lerp(0.78, 1, fr);
      const u = (s - kr.sc) * kr.L, au = Math.abs(u);
      const be = kB[k] * (0.3 + 0.7 * Math.min(1, au / 0.08)), cb = Math.cos(be), sb = Math.sin(be);
      const lat = (dA - d0) * sm(au / 0.035) + 0.09 * au;
      const w = vij * 0.008, c = Math.cos(om * s) * w, sn = Math.sin(om * s) * w;
      const rx = Cx + Yx * u * cb - Mx * au * sb + Sx * lat + Sx * c + Zx * sn;
      const ry = Cy + Yy * u * cb - My * au * sb + Sy * lat + Sy * c + Zy * sn;
      const rz = Cz + Yz * u * cb - Mz * au * sb + Sz * lat + Sz * c + Zz * sn;
      sX[b0 + i] = tx + (rx - tx) * kap;
      sY[b0 + i] = ty + (ry - ty) * kap;
      sZ[b0 + i] = tz + (rz - tz) * kap;
      const zoz = Math.exp(-((u / 0.016) ** 2)), rR = kr.r * (1 - 0.4 * zoz);
      sK[b0 + i] = kap * zoz;
      sR[b0 + i] = rN + (rR - rN) * kap;
    }
  }
  function pisiCev(k) {
    const b0 = k * NS;
    let o = k * vKr * 3;
    let nx = 0, ny = 0, nz = 0, tx0 = 0, ty0 = 0, tz0 = 0, nx0 = 0, ny0 = 0, nz0 = 0, bx0 = 0, by0 = 0, bz0 = 0;
    const Sx = kS[k * 3], Sy = kS[k * 3 + 1], Sz = kS[k * 3 + 2], aoC = kAoC[k];
    let aoK = 0;
    const tocka = (x, y, z, ex, ey, ez) => {
      kPos[o] = x; kPos[o + 1] = y; kPos[o + 2] = z; kNor[o] = ex; kNor[o + 1] = ey; kNor[o + 2] = ez;
      const pr = Math.max(0, -(ex * Sx + ey * Sy + ez * Sz));
      kAo[o / 3] = (1 - 0.5 * aoC * pr * pr) * (1 - 0.3 * aoK);
      o += 3;
    };
    const obroc = (cx, cy, cz, r, tx, ty, tz, Nx, Ny, Nz, Bx, By, Bz, ca, sa) => {
      for (let a = 0; a < NR; a++) {
        const an = (2 * Math.PI * a) / NR, co = Math.cos(an), si = Math.sin(an);
        const ex = co * Nx + si * Bx, ey = co * Ny + si * By, ez = co * Nz + si * Bz;
        tocka(cx + ex * r * ca, cy + ey * r * ca, cz + ez * r * ca, ex * ca + tx * sa, ey * ca + ty * sa, ez * ca + tz * sa);
      }
    };
    // tangente in vzporedno prenesen okvir
    const T = _tang;
    for (let i = 0; i < NS; i++) {
      const a = Math.max(0, i - 1), c = Math.min(NS - 1, i + 1);
      let x = sX[b0 + c] - sX[b0 + a], y = sY[b0 + c] - sY[b0 + a], z = sZ[b0 + c] - sZ[b0 + a];
      const l = Math.hypot(x, y, z) || 1;
      T[i * 3] = x / l; T[i * 3 + 1] = y / l; T[i * 3 + 2] = z / l;
    }
    // začetna normala
    {
      const x = T[0], y = T[1], z = T[2];
      if (Math.abs(y) < 0.9) { nx = -z * 0 + 0; nx = z; ny = 0; nz = -x; } else { nx = 0; ny = -z; nz = y; }
      const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    }
    const Nn = _norm;
    for (let i = 0; i < NS; i++) {
      const tx = T[i * 3], ty = T[i * 3 + 1], tz = T[i * 3 + 2];
      const dd = nx * tx + ny * ty + nz * tz;
      nx -= tx * dd; ny -= ty * dd; nz -= tz * dd;
      const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
      Nn[i * 3] = nx; Nn[i * 3 + 1] = ny; Nn[i * 3 + 2] = nz;
    }
    const okvir = (i) => {
      tx0 = T[i * 3]; ty0 = T[i * 3 + 1]; tz0 = T[i * 3 + 2];
      nx0 = Nn[i * 3]; ny0 = Nn[i * 3 + 1]; nz0 = Nn[i * 3 + 2];
      bx0 = ty0 * nz0 - tz0 * ny0; by0 = tz0 * nx0 - tx0 * nz0; bz0 = tx0 * ny0 - ty0 * nx0;
    };
    // kapica na začetku
    okvir(0);
    aoK = sK[b0];
    let r = sR[b0], cx = sX[b0], cy = sY[b0], cz = sZ[b0];
    tocka(cx - tx0 * r, cy - ty0 * r, cz - tz0 * r, -tx0, -ty0, -tz0);
    for (let kk = KC; kk >= 1; kk--) {
      const al = ((kk / (KC + 1)) * Math.PI) / 2, sa = Math.sin(al);
      obroc(cx - tx0 * r * sa, cy - ty0 * r * sa, cz - tz0 * r * sa, r, tx0, ty0, tz0, nx0, ny0, nz0, bx0, by0, bz0, Math.cos(al), -sa);
    }
    for (let i = 0; i < NS; i++) {
      okvir(i);
      aoK = sK[b0 + i];
      obroc(sX[b0 + i], sY[b0 + i], sZ[b0 + i], sR[b0 + i], tx0, ty0, tz0, nx0, ny0, nz0, bx0, by0, bz0, 1, 0);
    }
    okvir(NS - 1);
    r = sR[b0 + NS - 1]; cx = sX[b0 + NS - 1]; cy = sY[b0 + NS - 1]; cz = sZ[b0 + NS - 1];
    for (let kk = 1; kk <= KC; kk++) {
      const al = ((kk / (KC + 1)) * Math.PI) / 2, sa = Math.sin(al);
      obroc(cx + tx0 * r * sa, cy + ty0 * r * sa, cz + tz0 * r * sa, r, tx0, ty0, tz0, nx0, ny0, nz0, bx0, by0, bz0, Math.cos(al), sa);
    }
    tocka(cx + tx0 * r, cy + ty0 * r, cz + tz0 * r, tx0, ty0, tz0);
  }
  const _tang = new Float32Array(NS * 3), _norm = new Float32Array(NS * 3);

  // centromere in kinetohori
  const cenGeo = hr(new THREE.SphereGeometry(1, 16, 12));
  const cenMat = fiz({ color: "#F3ECFF", roughness: 0.35, clearcoat: 0.8, sheen: 0.5 });
  const centromere = izbirno(instance(cenGeo, cenMat, NK));
  const kinMat = fiz({ color: "#FFD84A", roughness: 0.35, clearcoat: 0.6, emissive: new THREE.Color("#3a2c00") });
  const kinetohori = izbirno(instance(cenGeo, kinMat, NK));
  group.add(centromere, kinetohori);

  // ---------- centrosoma: vsak z dvema pravokotnima centriolama (9 trojčkov mikrotubulov)
  const NC = 2, LC = 0.042, RC = 0.0105;
  const cTriGeo = hr(new THREE.BoxGeometry(1, 1, 1));
  const cTriMat = fiz({ color: "#F6EEDC", roughness: 0.45, clearcoat: 0.5 });
  const centriole = izbirno(instance(cTriGeo, cTriMat, NC * 18));
  const pcmMat = fiz({ color: "#FFE19A", roughness: 0.6, transparent: true, depthWrite: false, emissive: new THREE.Color("#4a3500") });
  fresnel(pcmMat, "pcm", 0.05, 0.42, 1.6);
  const pcm = izbirno(instance(hr(new THREE.SphereGeometry(1, 20, 14)), pcmMat, NC), 5);
  pcm.renderOrder = 5;
  group.add(centriole, pcm);
  const lokCen = [];
  for (let c = 0; c < 2; c++) for (let b = 0; b < 9; b++) {
    const a = (2 * Math.PI * b) / 9, m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromAxisAngle(_y, -a + 0.55);
    m.compose(new V3(RC * Math.cos(a), 0, RC * Math.sin(a)), q, new V3(0.0032, LC, 0.0085));
    if (c === 1) m.premultiply(new THREE.Matrix4().makeRotationZ(Math.PI / 2)).premultiply(new THREE.Matrix4().makeTranslation(RC + LC * 0.5 + 0.004, -LC * 0.36, 0));
    lokCen.push(m);
  }
  const cenPos = new Float32Array(NC * 3), cenSk = new Float32Array(NC);
  const cenQ = [new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0.7, 0.2)), new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.5, 2.1, 0.6))];

  // ---------- delitveno vreteno: tanke cevke (en klic risanja)
  const NAST = visoka ? 14 : 9, NPOL = visoka ? 10 : 7, NKIN = 2;
  const NFIB = 2 * NAST + 2 * NPOL + NK * NKIN;
  const vrGeo = hr(new THREE.CylinderGeometry(1, 1, 1, visoka ? 6 : 4, 1, true));
  const vrMat = fiz({ color: "#A8F0D2", roughness: 0.4, transparent: true, opacity: 0.78, depthWrite: false, emissive: new THREE.Color("#0e3a2a") });
  const vreteno = izbirno(instance(vrGeo, vrMat, NFIB), 2);
  vreteno.renderOrder = 5;
  group.add(vreteno);
  const astDir = new Float32Array(2 * NAST * 3), astLen = new Float32Array(2 * NAST), polJit = new Float32Array(2 * NPOL * 3);
  for (let i = 0; i < 2 * NAST; i++) {
    let x, y, z, l; do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; z = rnd() * 2 - 1; l = Math.hypot(x, y, z); } while (l > 1 || l < 0.1);
    astDir[i * 3] = x / l; astDir[i * 3 + 1] = y / l; astDir[i * 3 + 2] = z / l; astLen[i] = 0.06 + 0.06 * rnd();
  }
  for (let i = 0; i < 2 * NPOL; i++) {
    const a = rnd() * 6.283, rr = 0.25 + 0.75 * Math.sqrt(rnd());
    polJit[i * 3] = Math.cos(a) * rr; polJit[i * 3 + 1] = Math.sin(a) * rr; polJit[i * 3 + 2] = 0.48 + 0.16 * rnd();
  }

  // ---------- cepitvena brazda: krčljivi obroč (aktin in miozin) tik pod membrano
  const NU = visoka ? 72 : 40, NVr = visoka ? 8 : 5;
  const obPos = new Float32Array(NU * NVr * 3), obNor = new Float32Array(NU * NVr * 3), obIdx = [];
  for (let i = 0; i < NU; i++) for (let j = 0; j < NVr; j++) {
    const a = i * NVr + j, b = ((i + 1) % NU) * NVr + j, c = i * NVr + ((j + 1) % NVr), d = ((i + 1) % NU) * NVr + ((j + 1) % NVr);
    obIdx.push(a, b, c, b, d, c);
  }
  const obGeo = hr(new THREE.BufferGeometry());
  obGeo.setAttribute("position", new THREE.BufferAttribute(obPos, 3).setUsage(THREE.DynamicDrawUsage));
  obGeo.setAttribute("normal", new THREE.BufferAttribute(obNor, 3).setUsage(THREE.DynamicDrawUsage));
  obGeo.setIndex(obIdx);
  const obMat = fiz({ color: "#FF9A52", roughness: 0.4, clearcoat: 0.5, sheen: 0.4, emissive: new THREE.Color("#3a1600") });
  const brazda = izbirno(dinamicno(new THREE.Mesh(obGeo, obMat)));
  group.add(brazda);
  function pisiObroc(R, tr) {
    let o = 0;
    for (let i = 0; i < NU; i++) {
      const u = (2 * Math.PI * i) / NU, cu = Math.cos(u), su = Math.sin(u);
      for (let j = 0; j < NVr; j++) {
        const v = (2 * Math.PI * j) / NVr, cv = Math.cos(v), sv = Math.sin(v);
        obPos[o] = tr * sv; obPos[o + 1] = cu * (R + tr * cv); obPos[o + 2] = su * (R + tr * cv);
        obNor[o] = sv; obNor[o + 1] = cu * cv; obNor[o + 2] = su * cv;
        o += 3;
      }
    }
    obGeo.attributes.position.needsUpdate = true; obGeo.attributes.normal.needsUpdate = true;
  }

  // ---------- oznake kromosomov
  // velikost oznake sledi velikosti modela na zaslonu, a ostane berljiva (17–26 px visoka)
  const _cp = new V3(), _sp = new V3(), _vel = new THREE.Vector2();
  function velikostOznake(renderer, scene, camera) {
    if (!camera.isPerspectiveCamera) return;
    renderer.getSize(_vel);
    const H = _vel.y || 800, tf = 2 * Math.tan((camera.fov * Math.PI) / 360);
    _cp.setFromMatrixPosition(camera.matrixWorld); _sp.setFromMatrixPosition(this.matrixWorld);
    const enota = H / (tf * (_cp.distanceTo(_sp) || 1));
    const sy = (cl(0.05 * enota, 17, 26) * tf) / H;
    this.scale.set(sy * 2, sy, 1);
    this.updateMatrixWorld();
  }
  // M = od matere, O = od očeta; 1 = dolgi par, 2 = kratki par
  const oznake = [], oznMat = [], oznTex = {};
  for (const kr of KR) {
    const c = platno(128, 64), g = c.getContext("2d");
    g.fillStyle = "rgba(11,15,22,0.82)";
    g.beginPath(); g.roundRect ? g.roundRect(4, 6, 120, 52, 26) : g.rect(4, 6, 120, 52); g.fill();
    g.lineWidth = 5; g.strokeStyle = kr.mati ? "#FF6B7C" : "#4DA6FF"; g.stroke();
    g.fillStyle = "#ffffff"; g.font = "600 34px 'Instrument Sans', system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(kr.oz, 64, 33);
    const t = hr(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; oznTex[kr.oz] = t;
  }
  for (let k = 0; k < NK; k++) {
    const m = hr(new THREE.SpriteMaterial({ map: oznTex[KR[k >> 1].oz], transparent: true, depthTest: false, depthWrite: false, sizeAttenuation: false }));
    const s = new THREE.Sprite(m); s.scale.set(0.044, 0.022, 1); s.renderOrder = 20; s.visible = false;
    s.raycast = () => {};
    s.onBeforeRender = velikostOznake;
    oznake.push(s); oznMat.push(m); group.add(s);
  }

  // ---------- smeri, okvirji kromosomov
  const vc = new V3(Math.sin(0.61) * Math.cos(0.35), Math.sin(0.35), Math.cos(0.61) * Math.cos(0.35));
  const desno = new V3(vc.z, 0, -vc.x).normalize(), gor = new V3().crossVectors(vc, desno).normalize();
  const qPro = [], qMet = [], cPro = [], cMet = [];
  for (const kr of KR) {
    const Y = gor.clone().multiplyScalar(Math.cos(kr.aPro)).addScaledVector(desno, Math.sin(kr.aPro));
    const X = gor.clone().multiplyScalar(-Math.sin(kr.aPro)).addScaledVector(desno, Math.cos(kr.aPro));
    qPro.push(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, new V3().crossVectors(X, Y))));
    const ps = kr.psi + 0.45;
    const Y2 = new V3(0, Math.cos(ps), Math.sin(ps)), X2 = new V3(1, 0, 0);
    qMet.push(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X2, Y2, new V3().crossVectors(X2, Y2))));
    cPro.push(new V3(kr.T[0], kr.T[1], kr.T[2]).multiplyScalar(RJ * 0.72));
    cMet.push(new V3(0, 0.15 * Math.cos(kr.psi), 0.15 * Math.sin(kr.psi)));
  }
  const _qa = new THREE.Quaternion(), _vx = new V3(), _vy = new V3(), _c = new V3();

  // ---------- deli (izbirni)
  const tc = (x = 0, y = 0, z = 0) => [x, y, z];
  const DELI = {
    membrana: { id: "membrana", ime: "Celična membrana", opis: "Tanka ovojnica iz lipidov in beljakovin (v modelu debelejša), ki obdaja celico; pri citokinezi se zažame in razdeli na dve celici.", barva: "#F4B6A2", meshes: [membrana, membranaN], tocka: tc() },
    citoplazma: { id: "citoplazma", ime: "Citoplazma", opis: "Poltekoča notranjost celice, v kateri plavajo organeli; v modelu je organelov veliko manj kot v pravi celici, da so kromosomi bolje vidni.", barva: "#E9B48C", meshes: [citoplazma], tocka: tc() },
    jedro: { id: "jedro", ime: "Jedro in jedrna ovojnica", opis: "Dvojna membrana s porami (razmik med membranama je v modelu povečan) obdaja DNK; v prometafazi razpade na koščke, v telofazi se okoli vsake skupine kromosomov spet sestavi.", barva: "#B7A6FF", meshes: [ovojnica], tocka: tc() },
    jedrce: { id: "jedrce", ime: "Jedrce", opis: "Gosto območje v jedru, kjer nastajajo deli ribosomov; v profazi izgine in se v telofazi spet pojavi.", barva: "#6E4FD0", meshes: [jedrca], tocka: tc() },
    kromosomi: { id: "kromosomi", ime: "Kromosomi", opis: "Nosijo dedni zapis (DNK); podvojen kromosom ima dve enaki sestrski kromatidi. Rdeči z oznako M so od matere, modri z oznako O od očeta, 1 in 2 sta homologna para.", barva: "#FF6B7C", meshes: [kromosomi], tocka: tc() },
    centromera: { id: "centromera", ime: "Centromera", opis: "Zoženi del kromosoma, kjer sta sestrski kromatidi povezani do anafaze; na njej sta kinetohora.", barva: "#F3ECFF", meshes: [centromere], tocka: tc() },
    kinetohor: { id: "kinetohor", ime: "Kinetohor", opis: "Beljakovinska ploščica ob centromeri, na katero se pripnejo niti vretena; vsaka sestrska kromatida ima svojega, obrnjenega k nasprotnemu polu.", barva: "#FFD84A", meshes: [kinetohori], tocka: tc() },
    centrosom: { id: "centrosom", ime: "Centrosom s centriolama", opis: "Iz njega rastejo mikrotubuli; v fazi S se podvoji, nato centrosoma odpotujeta na nasprotna pola celice. Centrioli sta v modelu povečani.", barva: "#FFE19A", meshes: [centriole, pcm], tocka: tc() },
    vreteno: { id: "vreteno", ime: "Delitveno vreteno", opis: "Snop mikrotubulov med poloma: eni se pripnejo na kinetohore in vlečejo kromatide, drugi se prekrivajo na sredini ali segajo v citoplazmo.", barva: "#A8F0D2", meshes: [vreteno], tocka: tc() },
    mitohondrij: { id: "mitohondrij", ime: "Mitohondrij", opis: "Organel, v katerem celično dihanje sprošča energijo iz hrane; svetle pregrade nakazujejo nagubano notranjo membrano (kriste), pri delitvi pa se mitohondriji razporedijo med obe hčerinski celici.", barva: "#C46A4E", meshes: [mito], tocka: tc() },
    er: { id: "er", ime: "Zrnati endoplazemski retikulum", opis: "Sistem sploščenih membranskih vrečk okoli jedra, posejan z ribosomi, ki izdelujejo beljakovine; med delitvijo se umakne k robu celice (v modelu je prikazanih le nekaj vrečk).", barva: "#8DB3C4", meshes: [erMesh], tocka: tc() },
    golgi: { id: "golgi", ime: "Golgijev aparat", opis: "Kup sploščenih membranskih vrečk ob centrosomu, ki beljakovine dodela, razvrsti in jih v mešičkih pošlje naprej; med delitvijo razpade na mešičke in se v vsaki hčerinski celici spet sestavi.", barva: "#D9A55E", meshes: [golgi, mesicki], tocka: tc() },
    ribosomi: { id: "ribosomi", ime: "Ribosomi", opis: "Drobna zrnca, na katerih nastajajo beljakovine: nekateri prosto plavajo v citoplazmi, drugi sedijo na endoplazemskem retikulumu; v modelu so močno povečani in jih je veliko manj kot v pravi celici.", barva: "#A383BC", meshes: [zrna], tocka: tc() },
    brazda: { id: "brazda", ime: "Cepitvena brazda", opis: "Obroč beljakovinskih vlaken (aktina in miozina) pod membrano se krči in celico zažame v dve hčerinski celici.", barva: "#FF9A52", meshes: [brazda], tocka: tc() },
  };
  const VRSTNI = ["membrana", "citoplazma", "jedro", "jedrce", "kromosomi", "centromera", "kinetohor", "centrosom", "vreteno", "brazda", "mitohondrij", "er", "golgi", "ribosomi"];
  const prisoten = {};
  let deliKljuc = "", deliSeznam = [];
  const setT = (t, x, y, z) => { t[0] = x; t[1] = y; t[2] = z; };

  // ---------- glavna posodobitev: vse iz p
  let p = 0;
  function posodobi() {
    // celica raste v G1
    const Rc = R0 * (0.93 + 0.07 * ramp(p, 0, 0.95));
    const sig = sm(cl((p - 6.3) / (8.93 - 6.3)));
    const kz = lerp(0.24, 0.015, sig);
    const c = CH * sig, r = lerp(Rc - kz / 4, RH, sig);
    const w = profil(c, r, kz);
    pisiKos(0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1);
    pisiKos(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, -1);
    memGeo.attributes.position.needsUpdate = true; memGeo.attributes.normal.needsUpdate = true;
    {
      const i = Math.round(nT * 0.32), j = Math.round(nF * 0.2);
      const o = (i * nF + j) * 3; setT(DELI.membrana.tocka, memPos[o], memPos[o + 1], memPos[o + 2]);
    }
    cCel = c; rCel = r;
    setT(DELI.citoplazma.tocka, c + 0.5 * r, -0.42 * r, 0.3 * r);

    // ---- faze kot zvezni parametri
    const rep = ramp(p, 1.05, 1.95);
    const dup = ramp(p, 1.25, 1.85);
    const kap = ramp(p, 3.0, 3.85) * (1 - ramp(p, 7.15, 8.45));
    const brk = ramp(p, 3.9, 4.45);
    const rot = ramp(p, 4.0, 4.95), cong = ramp(p, 4.2, 5.15);
    const ana = ramp(p, 6.0, 6.9), tel = ramp(p, 6.95, 7.7);
    const refo = ramp(p, 7.2, 7.95);
    const cs = ramp(p, 3.0, 4.3), polB = ramp(p, 6.15, 7.0), cT = ramp(p, 7.3, 8.4);
    const ga = ramp(p, 3.1, 3.9), gp = ramp(p, 3.95, 4.55), gk = ramp(p, 4.15, 4.8), ugas = 1 - ramp(p, 7.05, 7.75);
    const kv = ramp(p, 3.85, 4.2) * (1 - ramp(p, 7.1, 7.6));
    const loceni = p >= 6;

    // ---- jedrna ovojnica in jedrce
    let th, n = 0;
    _q.copy(OVOJ_Q);
    if (p < 6) {
      th = brk;
      if (th < 0.985) { _p.set(0, 0, 0); _s.setScalar(RJ * (0.97 + 0.03 * ramp(p, 0, 0.95))); ovojnica.setMatrixAt(0, _m.compose(_p, _q, _s)); n = 1; }
      setT(DELI.jedro.tocka, 0.08, RJ * 0.72, RJ * 0.68);
    } else {
      th = 1 - refo;
      if (th < 0.985) for (let i = 0; i < 2; i++) { _p.set(i ? CH : -CH, 0, 0); _s.setScalar(RJH * (0.8 + 0.2 * refo)); ovojnica.setMatrixAt(i, _m.compose(_p, _q, _s)); n = 2; }
      setT(DELI.jedro.tocka, CH + 0.05, RJH * 0.72, RJH * 0.68);
    }
    for (let i = 0; i < n; i++) {
      ovojnica.getMatrixAt(i, _m2); _m2.decompose(_p3, _q3, _s3); _s3.multiplyScalar(OVOJ_N);
      ovojnica.setMatrixAt(n + i, _m2.compose(_p3, _q3, _s3));
      ovojnica.setColorAt(i, BELA); ovojnica.setColorAt(n + i, OVOJ_NB);
    }
    ovojnica.count = 2 * n; ovojnica.instanceMatrix.needsUpdate = true; ovojnica.instanceColor.needsUpdate = true;
    ovojLom.value = th > 0.004 ? sm(th * 5) : 0;
    ovojMat.alphaTest = 0.03 + 0.97 * th;
    prisoten.jedro = n > 0;
    const jcM = 1 - ramp(p, 3.05, 3.6), jcH = ramp(p, 7.65, 8.45);
    n = 0;
    if (p < 6 && jcM > 0.01) { _p.set(0.03, -0.05, -0.1); _s.setScalar(0.052 * jcM); jedrca.setMatrixAt(n++, _m.compose(_p, OVOJ_Q, _s)); setT(DELI.jedrce.tocka, 0.03, -0.05, -0.1); }
    if (p >= 6 && jcH > 0.01) for (const sg of [-1, 1]) { _p.set(sg * CH + 0.02, -0.04, -0.08); _s.setScalar(0.04 * jcH); jedrca.setMatrixAt(n++, _m.compose(_p, OVOJ_Q, _s)); setT(DELI.jedrce.tocka, CH + 0.02, -0.04, -0.08); }
    jedrca.count = n; jedrca.instanceMatrix.needsUpdate = true;
    prisoten.jedrce = n > 0;

    // ---- centrosoma (A gre na levi pol, B na desnega)
    const A0x = -0.07, A0y = 0.355, A0z = 0.12;
    for (let i = 0; i < 2; i++) {
      let x, y, z;
      const a0 = Math.atan2(A0y, A0x + (i ? 0.06 : 0)), a1 = i ? 0 : Math.PI;
      const ang = lerp(a0, a1, cs), rad = lerp(0.37, 0.47, cs);
      x = rad * Math.cos(ang); y = rad * Math.sin(ang); z = lerp(A0z + (i ? -0.02 : 0), 0, cs);
      if (i && cs === 0) { x = lerp(A0x, A0x + 0.06, dup); y = lerp(A0y, A0y + 0.0, dup); z = lerp(A0z, A0z - 0.02, dup); }
      const sg = i ? 1 : -1;
      x += sg * 0.09 * polB;
      x = lerp(x, sg * 0.53, cT); y = lerp(y, 0.25, cT); z = lerp(z, 0.1, cT);
      cenPos[i * 3] = x; cenPos[i * 3 + 1] = y; cenPos[i * 3 + 2] = z;
      cenSk[i] = i ? sm(dup * 1.4) : 1;
    }
    for (let i = 0; i < NC; i++) {
      _p.set(cenPos[i * 3], cenPos[i * 3 + 1], cenPos[i * 3 + 2]); _s.setScalar(cenSk[i]);
      _m2.compose(_p, cenQ[i], _s);
      for (let b = 0; b < 18; b++) centriole.setMatrixAt(i * 18 + b, _m.multiplyMatrices(_m2, lokCen[b]));
      _s.setScalar(0.04 * cenSk[i]); pcm.setMatrixAt(i, _m.compose(_p, cenQ[i], _s));
    }
    centriole.count = NC * 18; pcm.count = NC;
    centriole.instanceMatrix.needsUpdate = true; pcm.instanceMatrix.needsUpdate = true;
    setT(DELI.centrosom.tocka, cenPos[0], cenPos[1], cenPos[2]);
    prisoten.centrosom = true;

    // ---- kromatide
    for (let j = 0; j < 4; j++) {
      _qa.slerpQuaternions(qPro[j], qMet[j], rot);
      _vx.set(1, 0, 0).applyQuaternion(_qa); _vy.set(0, 1, 0).applyQuaternion(_qa);
      _c.copy(cPro[j]).lerp(cMet[j], cong);
      const kr = KR[j], d0 = kr.r * 0.62;
      for (let sis = 0; sis < 2; sis++) {
        const k = j * 2 + sis, sg = sis ? 1 : -1;
        let cx = _c.x + _vx.x * sg * d0, cy = _c.y + _vx.y * sg * d0, cz = _c.z + _vx.z * sg * d0;
        if (ana > 0) {
          cx = sg * lerp(d0, 0.355, ana); cy = _c.y * (1 - 0.4 * ana); cz = _c.z * (1 - 0.4 * ana);
        }
        if (tel > 0) {
          const hx = sg * CH + RJH * 0.62 * kr.T[0], hy = RJH * 0.62 * kr.T[1], hz = RJH * 0.62 * kr.T[2];
          cx = lerp(cx, hx, tel); cy = lerp(cy, hy, tel); cz = lerp(cz, hz, tel);
        }
        kC[k * 3] = cx; kC[k * 3 + 1] = cy; kC[k * 3 + 2] = cz;
        kY[k * 3] = _vy.x; kY[k * 3 + 1] = _vy.y; kY[k * 3 + 2] = _vy.z;
        kS[k * 3] = _vx.x * sg; kS[k * 3 + 1] = _vx.y * sg; kS[k * 3 + 2] = _vx.z * sg;
        kM[k * 3] = sg; kM[k * 3 + 1] = 0; kM[k * 3 + 2] = 0;
        kB[k] = 0.8 * sm(ana * 2.2) * (1 - 0.7 * tel);
        kKap[k] = kap; kAoC[k] = kap * (1 - ana);
        if (p < 6) { kTc[k * 3] = 0; kTc[k * 3 + 1] = 0; kTc[k * 3 + 2] = 0; kTs[k] = RJ; kRep[k] = rep; kOw[k] = 1; kSkrij[k] = sis; }
        else { kTc[k * 3] = sg * CH; kTc[k * 3 + 1] = 0; kTc[k * 3 + 2] = 0; kTs[k] = RJH; kRep[k] = 0; kOw[k] = 0; kSkrij[k] = 0; }
        vzorci(k);
        pisiCev(k);
        // centromera (kroglica med sestrama) in kinetohor (na zunanji strani, proti polu)
        const rc = kr.r * 0.6;
        const ce = sm((kap - 0.45) / 0.4);
        _p.set(cx - kS[k * 3] * d0 * 0.55, cy - kS[k * 3 + 1] * d0 * 0.55, cz - kS[k * 3 + 2] * d0 * 0.55);
        _s.setScalar(rc * ce * (loceni ? 0.85 : 1));
        centromere.setMatrixAt(k, ce > 0.01 ? _m.compose(_p, _q.identity(), _s) : NIC);
        _d.set(kS[k * 3], kS[k * 3 + 1], kS[k * 3 + 2]);
        _p.set(cx + _d.x * kr.r * 0.55, cy + _d.y * kr.r * 0.55, cz + _d.z * kr.r * 0.55);
        _q.setFromUnitVectors(_x, _d); _s.set(0.006 * kv, 0.013 * kv, 0.013 * kv);
        kinetohori.setMatrixAt(k, kv > 0.01 ? _m.compose(_p, _q, _s) : NIC);
        _kin[k * 3] = _p.x; _kin[k * 3 + 1] = _p.y; _kin[k * 3 + 2] = _p.z;
      }
    }
    krGeo.attributes.position.needsUpdate = true; krGeo.attributes.normal.needsUpdate = true; krGeo.attributes.ao.needsUpdate = true;
    centromere.count = NK; kinetohori.count = NK;
    centromere.instanceMatrix.needsUpdate = true; kinetohori.instanceMatrix.needsUpdate = true;
    prisoten.kromosomi = true;
    prisoten.centromera = kap > 0.6;
    prisoten.kinetohor = kv > 0.3;
    {
      const k = 0, b = k * NS + Math.round(NS * 0.8);
      setT(DELI.kromosomi.tocka, sX[b], sY[b], sZ[b]);
      setT(DELI.centromera.tocka, kC[3 * 2], kC[3 * 2 + 1], kC[3 * 2 + 2]);
      setT(DELI.kinetohor.tocka, _kin[3 * 3], _kin[3 * 3 + 1], _kin[3 * 3 + 2]);
    }

    // ---- oznake kromosomov
    for (let k = 0; k < NK; k++) {
      const sis = k & 1;
      let a = sm((kap - 0.55) / 0.3);
      if (sis && !loceni) a = 0;
      const s = oznake[k];
      s.visible = a > 0.02;
      if (!s.visible) continue;
      oznMat[k].opacity = a;
      const b = k * NS + NS - 1, b2 = k * NS + NS - 7;
      let dx = sX[b] - sX[b2], dy = sY[b] - sY[b2], dz = sZ[b] - sZ[b2];
      const l = Math.hypot(dx, dy, dz) || 1;
      let ox = sX[b] + (dx / l) * 0.04, oy = sY[b] + (dy / l) * 0.04, oz = sZ[b] + (dz / l) * 0.04;
      if (!loceni) { ox += kS[k * 3] * 0.02; oy += kS[k * 3 + 1] * 0.02; oz += kS[k * 3 + 2] * 0.02; }
      s.position.set(ox, oy, oz);
    }

    // ---- vreteno
    let f = 0;
    const PAx = cenPos[0], PAy = cenPos[1], PAz = cenPos[2], PBx = cenPos[3], PBy = cenPos[4], PBz = cenPos[5];
    const cev = (ax, ay, az, bx, by, bz, rad) => {
      _d.set(bx - ax, by - ay, bz - az);
      const L = _d.length();
      if (L < 0.004) return;
      _d.multiplyScalar(1 / L); _q.setFromUnitVectors(_y, _d);
      _p.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2); _s.set(rad, L, rad);
      vreteno.setMatrixAt(f++, _m.compose(_p, _q, _s));
    };
    const RF = 0.0027;
    for (let pol = 0; pol < 2; pol++) {
      const px = pol ? PBx : PAx, py = pol ? PBy : PAy, pz = pol ? PBz : PAz;
      const qx = pol ? PAx : PBx, qy = pol ? PAy : PBy, qz = pol ? PAz : PBz;
      const pl = Math.hypot(px, py, pz) || 1;
      // astralni mikrotubuli
      const la = ga * ugas;
      if (la > 0.01) for (let i = 0; i < NAST; i++) {
        const b = (pol * NAST + i) * 3;
        let dx = (px / pl) * 1.1 + astDir[b], dy = (py / pl) * 1.1 + astDir[b + 1], dz = (pz / pl) * 1.1 + astDir[b + 2];
        const l = Math.hypot(dx, dy, dz) || 1, L = astLen[pol * NAST + i] * la;
        cev(px, py, pz, px + (dx / l) * L, py + (dy / l) * L, pz + (dz / l) * L, RF);
      }
      // polarni (prekrivajoči se) mikrotubuli
      const lp = gp * ugas;
      if (lp > 0.01) {
        const ex = qx - px, ey = qy - py, ez = qz - pz, dist = Math.hypot(ex, ey, ez) || 1;
        for (let i = 0; i < NPOL; i++) {
          const b = (pol * NPOL + i) * 3, L = dist * polJit[b + 2] * 1.12 * lp;
          const jy = polJit[b] * 0.11, jz = polJit[b + 1] * 0.11;
          const tx = px + (ex / dist) * L, ty = py + (ey / dist) * L + jy * Math.sin((Math.PI * L) / dist), tz = pz + (ez / dist) * L + jz * Math.sin((Math.PI * L) / dist);
          cev(px, py, pz, tx, ty, tz, RF);
        }
      }
      // kinetohorni mikrotubuli: s tega pola na kinetohore kromatid, obrnjenih k njemu
      const lk = gk * ugas;
      if (lk > 0.01) for (let k = 0; k < NK; k++) {
        if ((k & 1) !== pol) continue;
        for (let v = 0; v < NKIN; v++) {
          const o = (v - 0.5) * 0.008;
          const tx = _kin[k * 3], ty = _kin[k * 3 + 1] + kY[k * 3 + 1] * o, tz = _kin[k * 3 + 2] + kY[k * 3 + 2] * o;
          cev(px, py, pz, lerp(px, tx, lk), lerp(py, ty, lk), lerp(pz, tz, lk), RF * 1.15);
        }
      }
    }
    vreteno.count = f; vreteno.instanceMatrix.needsUpdate = true;
    prisoten.vreteno = f > 6;
    setT(DELI.vreteno.tocka, lerp(PBx, 0, 0.45), lerp(PBy, 0, 0.45) + 0.05, lerp(PBz, 0, 0.45));

    // ---- brazda
    const vb = ramp(sig, 0.33, 0.5) * cl(w / 0.03);
    brazda.visible = vb > 0.02;
    if (brazda.visible) pisiObroc(Math.max(0.001, w - 0.01 * vb), 0.0085 * vb);
    prisoten.brazda = brazda.visible;
    setT(DELI.brazda.tocka, 0, w * 0.7, w * 0.7);
    prisoten.membrana = prisoten.citoplazma = true;
    vrW = ramp(p, 3.4, 4.4) * (1 - ramp(p, 7.4, 8.4));
    organeli(); osvezeno = true;
    prisoten.mitohondrij = prisoten.er = prisoten.golgi = prisoten.ribosomi = true;
  }
  const _kin = new Float32Array(NK * 3);

  // ---------- nadzor in predvajanje
  const SEK = 3.4; // sekund na fazo pri predvajanju
  let igra = false, cilj = null, cakaj = 0;
  const dPotek = { tip: "drsnik", id: "potek", oznaka: "Potek", min: 0, max: N, korak: 0.01, vrednost: 0, ob: (v) => { ustavi(); cilj = null; nastavi(Number(v)); } };
  const dPredvajaj = { tip: "stikalo", id: "predvajaj", oznaka: "Predvajaj", vrednost: false, ob: (v) => { igra = !!v; dPredvajaj.vrednost = igra; cilj = null; cakaj = 0; if (igra && p >= N - 0.001) nastavi(0); } };
  function ustavi() { igra = false; dPredvajaj.vrednost = false; }
  function nastavi(v) { p = cl(Number.isFinite(v) ? v : 0, 0, N); dPotek.vrednost = Math.round(p * 100) / 100; posodobi(); }
  function premakni(t) { ustavi(); t = cl(t, 0, N); if (gibanje) cilj = t; else { cilj = null; nastavi(t); } }
  const indeks = () => (p >= N - 1e-6 ? -1 : Math.min(N - 1, Math.floor(p + 1e-6)));
  const faza = () => { const i = indeks(); return i < 0 ? KONEC : FAZE[i]; };
  const nadzor = [
    dPotek,
    { tip: "gumb", id: "nazaj", oznaka: "Nazaj", ob: () => { const b = cilj ?? p; premakni(Math.max(0, Math.ceil(b - 0.02) - 1)); } },
    { tip: "gumb", id: "naprej", oznaka: "Naprej", ob: () => { const b = cilj ?? p; premakni(Math.min(N, Math.floor(b + 0.02) + 1)); } },
    dPredvajaj,
    { tip: "izpis", id: "faza", oznaka: "Faza", vrednost: () => { const i = indeks(); return i < 0 ? KONEC[0] : `${FAZE[i][0]} (${i + 1}/${N})`; } },
    { tip: "izpis", id: "dogajanje", oznaka: "Kaj se dogaja", vrednost: () => faza()[1] },
    { tip: "izpis", id: "stevilo", oznaka: "Kromosomi in kromatide", vrednost: () => faza()[2] },
    { tip: "izpis", id: "oznake", oznaka: "Oznake", vrednost: () => "M (rdeči): od matere · O (modri): od očeta · 1 in 2: homologna para" },
  ];

  nastavi(Number(zac.potek ?? 0));
  if (zac.predvajaj === true || zac.predvajaj === "true" || zac.predvajaj === 1) dPredvajaj.ob(true);

  const rezultat = {
    group,
    get deli() {
      const kljuc = VRSTNI.filter((id) => prisoten[id]).join(",");
      if (kljuc !== deliKljuc) { deliKljuc = kljuc; deliSeznam = VRSTNI.filter((id) => prisoten[id]).map((id) => DELI[id]); }
      return deliSeznam;
    },
    nadzor,
    korak(t, dt) {
      dt = Math.min(Math.max(dt || 0, 0), 0.1);
      if (cilj !== null) {
        const d = cilj - p;
        if (Math.abs(d) < 0.004) { nastavi(cilj); cilj = null; }
        else nastavi(p + d * (1 - Math.exp(-dt * 5)) + Math.sign(d) * Math.min(Math.abs(d), dt * 0.35));
      } else if (igra) {
        if (gibanje) {
          const np = p + dt / SEK;
          if (np >= N) { nastavi(N); ustavi(); } else nastavi(np);
        } else {
          cakaj += dt;
          if (cakaj >= 2.5) { cakaj = 0; const t2 = Math.min(N, Math.floor(p + 0.02) + 1); nastavi(t2); if (t2 >= N) ustavi(); }
        }
      }
      // organeli rahlo lebdijo tudi med mirovanjem (le če je gibanje dovoljeno)
      if (gibanje) { tCas += dt; if (!osvezeno) organeli(); }
      osvezeno = false;
    },
    dispose() {
      for (const x of smeti) x.dispose?.();
      for (const o of [zrna, mito, erMesh, golgi, mesicki, ovojnica, jedrca, centromere, kinetohori, centriole, pcm, vreteno]) o.dispose?.();
    },
  };
  return rezultat;
}
