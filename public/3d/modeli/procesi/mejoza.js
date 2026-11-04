// Mejoza: iz diploidne živalske celice (2n = 4) nastanejo štiri genetsko različne haploidne celice (n = 2).
// 3D model po pogodbi v docs/3d.md (gradnik ne uvaža ničesar, THREE dobi kot argument).
// Vse stanje je čista funkcija poteka p (0 … 12) in izbrane lege parov, zato lahko učenec drsnik poljubno vleče.

export const info = {
  id: "mejoza",
  naslov: "Mejoza",
  podrocje: "procesi",
  predmet: "BIO",
  opis: "Iz ene diploidne celice (2n = 4) nastanejo štiri genetsko različne haploidne celice (n = 2): parjenje homolognih kromosomov, prekrižanje, neodvisna razporeditev v metafazi I, mejoza I in mejoza II. Poenostavljeno: človeška celica ima 2n = 46 kromosomov.",
  merilo: { m: 30e-6, oznaka: "30 µm" },
};

const MN_KROMOSOM = ["kromosom", "kromosoma", "kromosomi", "kromosomov"];
const MN_KROMATIDA = ["kromatida", "kromatidi", "kromatide", "kromatid"];
const mn = (n, b) => { const m = n % 100; return n + " " + (m === 1 ? b[0] : m === 2 ? b[1] : m === 3 || m === 4 ? b[2] : b[3]); };
const KR4 = mn(4, MN_KROMOSOM), KR2 = mn(2, MN_KROMOSOM), KT2 = mn(2, MN_KROMATIDA), KT4 = mn(4, MN_KROMATIDA), KT8 = mn(8, MN_KROMATIDA);

// [ime faze, kaj se dogaja, število kromosomov in kromatid]
const FAZE = [
  ["Interfaza: faza G1", "Celica raste; vsak kromosom je ena nit kromatina, homologna kromosoma (od matere in od očeta) pa sta enako dolga in nosita enake gene.", `2n = ${KR4}, ${KT4}`],
  ["Interfaza: faza S", "DNK se podvoji, zato ima vsak kromosom dve sestrski kromatidi; podvoji se tudi centrosom.", `2n = ${KR4}; DNK se podvaja (4 → 8 kromatid)`],
  ["Interfaza: faza G2", "Celica se pripravlja na mejozo; vsak kromosom ima dve enaki sestrski kromatidi.", `2n = ${KR4}, ${KT8}`],
  ["Profaza I: parjenje", "Kromosomi se kondenzirajo, homologna kromosoma se tesno zložita drug ob drugega v bivalent (tetrado s štirimi kromatidami).", `2n = ${KR4} v dveh bivalentih, ${KT8}`],
  ["Profaza I: prekrižanje", "Nesestrski kromatidi homolognih kromosomov si izmenjata dela (prekrižanje ali crossing-over); stik ostane viden kot hiazma, jedrna ovojnica razpade.", `2n = ${KR4} v dveh bivalentih, ${KT8}`],
  ["Metafaza I", "Bivalenta se uredita v ekvatorialni ravnini, vsak homologni kromosom je pripet na en pol; lega vsakega para je naključna (2² = 4 možne razporeditve).", `2n = ${KR4} v dveh bivalentih, ${KT8}`],
  ["Anafaza I", "Homologna kromosoma se ločita in potujeta k nasprotnima poloma, sestrski kromatidi pa ostaneta skupaj.", `${KR4}, ${KT8}: na vsak pol gresta 2 kromosoma z dvema kromatidama`],
  ["Telofaza I in citokineza", "Nastaneta dve haploidni celici (n = 2), v katerih ima vsak kromosom še dve kromatidi.", `Vsaka nova celica: n = ${KR2}, ${KT4}`],
  ["Profaza II", "Brez ponovnega podvajanja DNK se v vsaki celici oblikuje novo delitveno vreteno, pravokotno na prejšnje.", `Vsaka celica: n = ${KR2}, ${KT4}`],
  ["Metafaza II", "Kromosomi se v vsaki celici uredijo v ekvatorialni ravnini, sestrski kromatidi sta pripeti na nasprotna pola.", `Vsaka celica: n = ${KR2}, ${KT4}`],
  ["Anafaza II", "Sestrski kromatidi se ločita in potujeta k nasprotnima poloma; zaradi prekrižanja nista več povsem enaki.", `Vsaka celica: ${KR4} z eno kromatido, 2 na vsakem polu`],
  ["Telofaza II in citokineza", "Okoli kromosomov nastanejo jedra, celici se razdelita in nastanejo štiri haploidne celice.", `Vsaka nova celica: n = ${KR2}, ${KT2}`],
];
const KONEC = ["Konec: štiri haploidne celice", "Iz ene diploidne celice so nastale štiri genetsko različne haploidne celice (n = 2), iz katerih se razvijejo spolne celice.", `Vsaka od 4 celic: n = ${KR2}, ${KT2}`];

export function zgradi(THREE, ctx = {}) {
  const V3 = THREE.Vector3;
  const visoka = ctx.kakovost !== "nizka";
  const gibanje = ctx.gibanje !== false;
  const zac = ctx.zacetek || {};
  const group = new THREE.Group();
  group.name = "mejoza";
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
  const _y = new V3(0, 1, 0), _x = new V3(1, 0, 0);
  const NIC = new THREE.Matrix4().makeScale(0, 0, 0);

  // prosojnost po Fresnelu: rob membrane je bolj neprosojen kot sredina (kot milni mehurček)
  function fresnel(mat, kljuc, a0, a1, pw) {
    const u = { a0: { value: a0 }, a1: { value: a1 }, pw: { value: pw } };
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uA0 = u.a0; sh.uniforms.uA1 = u.a1; sh.uniforms.uPw = u.pw;
      sh.fragmentShader = "uniform float uA0;\nuniform float uA1;\nuniform float uPw;\n" + sh.fragmentShader.replace(
        "#include <opaque_fragment>",
        "{ float frs = pow(1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0), uPw); diffuseColor.a = mix(uA0, uA1, frs); }\n#include <opaque_fragment>");
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

  // ---------- celična membrana: v mejozi I dve polovici (os x), v mejozi II štiri četrtine (os y v vsaki celici)
  const nT = visoka ? 48 : 30, nF = visoka ? 64 : 36;
  const KOSOV = 6, vKos = (nT + 1) * nF, iKos = nT * nF * 6;
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
  memGeo.setDrawRange(0, 2 * iKos);
  const memMat = fiz({ color: "#F4B6A2", roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2, sheen: 1, sheenColor: new THREE.Color("#FFD5C8"), sheenRoughness: 0.35, transparent: true, depthWrite: false, side: THREE.FrontSide });
  fresnel(memMat, "membrana", 0.07, 0.7, 2.4);
  const citMat = fiz({ color: "#F7D2B6", roughness: 0.85, transparent: true, depthWrite: false, side: THREE.BackSide });
  fresnel(citMat, "citoplazma", 0.13, 0.2, 1.0);
  const membrana = izbirno(dinamicno(new THREE.Mesh(memGeo, memMat)), 20);
  const citoplazma = izbirno(dinamicno(new THREE.Mesh(memGeo, citMat)), 30);
  membrana.renderOrder = 8; citoplazma.renderOrder = 4;
  group.add(citoplazma, membrana);

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

  // ---------- citoplazma: drobna zrnca (nakazani organeli)
  const NG = visoka ? 90 : 45;
  const zrnGeo = hr(new THREE.IcosahedronGeometry(1, 1));
  const zrnMat = fiz({ color: "#C98E6A", roughness: 0.6, clearcoat: 0.3, clearcoatRoughness: 0.4, sheen: 0.3, sheenColor: new THREE.Color("#F2C7A8") });
  const zrna = izbirno(instance(zrnGeo, zrnMat, NG));
  zrna.count = NG;
  const zOff = new Float32Array(NG * 3), zVel = new Float32Array(NG), zSg = new Int8Array(NG), zSgY = new Int8Array(NG), zQ = [];
  for (let g = 0; g < NG; g++) {
    let x, y, z, l;
    do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; z = rnd() * 2 - 1; l = Math.hypot(x, y, z); } while (l > 1 || l < 0.05);
    const rad = 0.52 + 0.4 * Math.cbrt(rnd());
    zOff[g * 3] = (x / l) * rad; zOff[g * 3 + 1] = (y / l) * rad; zOff[g * 3 + 2] = (z / l) * rad;
    zVel[g] = 0.0045 + 0.0055 * rnd();
    zSg[g] = zOff[g * 3] + (rnd() - 0.5) * 0.5 >= 0 ? 1 : -1;
    zSgY[g] = zOff[g * 3 + 1] + (rnd() - 0.5) * 0.5 >= 0 ? 1 : -1;
    zQ.push(new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28)));
  }
  group.add(zrna);

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
        d[o] = d[o + 1] = d[o + 2] = Math.round(v * 255); d[o + 3] = 255;
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
  const jedroGeo = hr(new THREE.SphereGeometry(1, visoka ? 48 : 30, visoka ? 30 : 18));
  const ovojMat = fiz({ color: "#B7A6FF", map: bTex, alphaMap: aTex, alphaTest: 0.03, roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.3, sheen: 0.6, sheenColor: new THREE.Color("#E4DCFF"), transparent: true, depthWrite: false, side: THREE.DoubleSide });
  fresnel(ovojMat, "ovojnica", 0.22, 0.85, 1.8);
  const ovojnica = izbirno(instance(jedroGeo, ovojMat, 4), 10);
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
  const jedrca = izbirno(instance(jcGeo, jcMat, 4));
  group.add(jedrca);

  // ---------- kromosomi: 2 homologna para (dolg in kratek), materin (M) in očetov (O)
  const BARVA_M = new THREE.Color("#FF6B7C"), BARVA_O = new THREE.Color("#4DA6FF");
  const KR = [
    { oz: "1M", mati: true, L: 0.29, sc: 0.42, r: 0.021, T: [-0.42, 0.2, 0.12], rad: 0.36, aPro: 0.55, xs: 0.74, xw: 0.24 },
    { oz: "1O", mati: false, L: 0.29, sc: 0.42, r: 0.021, T: [0.38, -0.22, 0.14], rad: 0.36, aPro: -0.95, xs: 0.74, xw: 0.24 },
    { oz: "2M", mati: true, L: 0.18, sc: 0.31, r: 0.02, T: [0.24, 0.42, -0.16], rad: 0.3, aPro: 2.1, xs: 0.68, xw: 0.26 },
    { oz: "2O", mati: false, L: 0.18, sc: 0.31, r: 0.02, T: [-0.27, -0.38, -0.2], rad: 0.3, aPro: 1.25, xs: 0.68, xw: 0.26 },
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
  }
  // barve po vzorcih: notranja (nesestrska) kromatida po prekrižanju dobi distalni del homologa
  function barvaj(k, izmenjano) {
    const kr = KR[k >> 1], lastna = kr.mati ? BARVA_M : BARVA_O, tuja = kr.mati ? BARVA_O : BARVA_M;
    let o = k * vKr * 3;
    const pisi = (i) => {
      const s = i / (NS - 1), b = izmenjano && (k & 1) && s > kr.xs ? tuja : lastna;
      kCol[o] = b.r; kCol[o + 1] = b.g; kCol[o + 2] = b.b; o += 3;
    };
    pisi(0);
    for (let kk = 0; kk < KC; kk++) for (let a = 0; a < NR; a++) pisi(0);
    for (let i = 0; i < NS; i++) for (let a = 0; a < NR; a++) pisi(i);
    for (let kk = 0; kk < KC; kk++) for (let a = 0; a < NR; a++) pisi(NS - 1);
    pisi(NS - 1);
  }
  for (let k = 0; k < NK; k++) barvaj(k, false);
  const krGeo = hr(new THREE.BufferGeometry());
  krGeo.setAttribute("position", new THREE.BufferAttribute(kPos, 3).setUsage(THREE.DynamicDrawUsage));
  krGeo.setAttribute("normal", new THREE.BufferAttribute(kNor, 3).setUsage(THREE.DynamicDrawUsage));
  krGeo.setAttribute("color", new THREE.BufferAttribute(kCol, 3));
  krGeo.setIndex(kIdx);
  krGeo.setDrawRange(0, kIdx.length);
  const krMat = fiz({ vertexColors: true, roughness: 0.38, clearcoat: 0.45, clearcoatRoughness: 0.35, sheen: 0.18, sheenColor: new THREE.Color("#ffe6ee"), sheenRoughness: 0.6 });
  const kromosomi = izbirno(dinamicno(new THREE.Mesh(krGeo, krMat)));
  group.add(kromosomi);

  // stanje vsake kromatide (k = 2 · kromosom + sestra)
  const sX = new Float32Array(NK * NS), sY = new Float32Array(NK * NS), sZ = new Float32Array(NK * NS), sR = new Float32Array(NK * NS);
  const kKap = new Float32Array(NK), kTc = new Float32Array(NK * 3), kTs = new Float32Array(NK), kRep = new Float32Array(NK), kOw = new Float32Array(NK), kSkrij = new Float32Array(NK);
  const kC = new Float32Array(NK * 3), kY = new Float32Array(NK * 3), kS = new Float32Array(NK * 3), kM = new Float32Array(NK * 3), kB = new Float32Array(NK);
  const R_NIT = 0.0055;
  // prekrižanje: kD = vektor do partnerske (nesestrske) kromatide, kZb = smer odmika pri križanju
  const kD = new Float32Array(NK * 3), kZb = new Float32Array(NK * 3), kAl = new Float32Array(NK), kAp = new Float32Array(NK);
  let izmenjano = false;

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
    const al = kAl[k], ap = kAp[k], ima = (k & 1) && (izmenjano ? ap > 0 : al > 0), xb = kr.xs - kr.xw / 2;
    const Dx = kD[k * 3], Dy = kD[k * 3 + 1], Dz = kD[k * 3 + 2];
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
      let qx = 0, qy = 0, qz = 0;
      if (ima) {
        const g = sm((s - xb) / kr.xw);
        if (izmenjano) { const t = Math.min(g, 1 - g) * ap; qx = Dx * t; qy = Dy * t; qz = Dz * t; }
        else {
          const t = g * al, z = Math.exp(-(((s - kr.xs) / (kr.xw * 0.45)) ** 2)) * 0.03 * Math.sin(Math.PI * al);
          qx = Dx * t + kZb[k * 3] * z; qy = Dy * t + kZb[k * 3 + 1] * z; qz = Dz * t + kZb[k * 3 + 2] * z;
        }
      }
      const rx = Cx + Yx * u * cb - Mx * au * sb + Sx * lat + Sx * c + Zx * sn + qx;
      const ry = Cy + Yy * u * cb - My * au * sb + Sy * lat + Sy * c + Zy * sn + qy;
      const rz = Cz + Yz * u * cb - Mz * au * sb + Sz * lat + Sz * c + Zz * sn + qz;
      sX[b0 + i] = tx + (rx - tx) * kap;
      sY[b0 + i] = ty + (ry - ty) * kap;
      sZ[b0 + i] = tz + (rz - tz) * kap;
      const rR = kr.r * (1 - 0.4 * Math.exp(-((u / 0.016) ** 2)));
      sR[b0 + i] = rN + (rR - rN) * kap;
    }
  }
  function pisiCev(k) {
    const b0 = k * NS;
    let o = k * vKr * 3;
    let nx = 0, ny = 0, nz = 0, tx0 = 0, ty0 = 0, tz0 = 0, nx0 = 0, ny0 = 0, nz0 = 0, bx0 = 0, by0 = 0, bz0 = 0;
    const tocka = (x, y, z, ex, ey, ez) => { kPos[o] = x; kPos[o + 1] = y; kPos[o + 2] = z; kNor[o] = ex; kNor[o + 1] = ey; kNor[o + 2] = ez; o += 3; };
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
    let r = sR[b0], cx = sX[b0], cy = sY[b0], cz = sZ[b0];
    tocka(cx - tx0 * r, cy - ty0 * r, cz - tz0 * r, -tx0, -ty0, -tz0);
    for (let kk = KC; kk >= 1; kk--) {
      const al = ((kk / (KC + 1)) * Math.PI) / 2, sa = Math.sin(al);
      obroc(cx - tx0 * r * sa, cy - ty0 * r * sa, cz - tz0 * r * sa, r, tx0, ty0, tz0, nx0, ny0, nz0, bx0, by0, bz0, Math.cos(al), -sa);
    }
    for (let i = 0; i < NS; i++) {
      okvir(i);
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

  // ---------- centrosomi: vsak z dvema pravokotnima centriolama (9 trojčkov mikrotubulov)
  const NC = 4, LC = 0.042, RC = 0.0105;
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
  const cenQ = [[0.4, 0.7, 0.2], [-0.5, 2.1, 0.6], [1.1, -0.4, 0.3], [0.2, 1.4, -0.9]].map(([a, b, c]) => new THREE.Quaternion().setFromEuler(new THREE.Euler(a, b, c)));

  // ---------- delitveno vreteno: tanke cevke (en klic risanja)
  const NAST = visoka ? 14 : 9, NPOL = visoka ? 10 : 7, NKIN = 2;
  const NFIB = 4 * NAST + 4 * NPOL + NK * NKIN;
  const vrGeo = hr(new THREE.CylinderGeometry(1, 1, 1, visoka ? 6 : 4, 1, true));
  const vrMat = fiz({ color: "#A8F0D2", roughness: 0.4, transparent: true, opacity: 0.78, depthWrite: false, emissive: new THREE.Color("#0e3a2a") });
  const vreteno = izbirno(instance(vrGeo, vrMat, NFIB), 2);
  vreteno.renderOrder = 5;
  group.add(vreteno);
  const astDir = new Float32Array(4 * NAST * 3), astLen = new Float32Array(4 * NAST), polJit = new Float32Array(4 * NPOL * 3);
  for (let i = 0; i < 4 * NAST; i++) {
    let x, y, z, l; do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; z = rnd() * 2 - 1; l = Math.hypot(x, y, z); } while (l > 1 || l < 0.1);
    astDir[i * 3] = x / l; astDir[i * 3 + 1] = y / l; astDir[i * 3 + 2] = z / l; astLen[i] = 0.06 + 0.06 * rnd();
  }
  for (let i = 0; i < 4 * NPOL; i++) {
    const a = rnd() * 6.283, rr = 0.25 + 0.75 * Math.sqrt(rnd());
    polJit[i * 3] = Math.cos(a) * rr; polJit[i * 3 + 1] = Math.sin(a) * rr; polJit[i * 3 + 2] = 0.48 + 0.16 * rnd();
  }

  // ---------- cepitvena brazda: krčljivi obroč (aktin in miozin) tik pod membrano
  const NU = visoka ? 72 : 40, NVr = visoka ? 8 : 5, NOB = 3, vOb = NU * NVr;
  const obPos = new Float32Array(NOB * vOb * 3), obNor = new Float32Array(NOB * vOb * 3), obIdx = [];
  for (let r = 0; r < NOB; r++) for (let i = 0; i < NU; i++) for (let j = 0; j < NVr; j++) {
    const o = r * vOb, a = o + i * NVr + j, b = o + ((i + 1) % NU) * NVr + j, c = o + i * NVr + ((j + 1) % NVr), d = o + ((i + 1) % NU) * NVr + ((j + 1) % NVr);
    obIdx.push(a, b, c, b, d, c);
  }
  const obGeo = hr(new THREE.BufferGeometry());
  obGeo.setAttribute("position", new THREE.BufferAttribute(obPos, 3).setUsage(THREE.DynamicDrawUsage));
  obGeo.setAttribute("normal", new THREE.BufferAttribute(obNor, 3).setUsage(THREE.DynamicDrawUsage));
  obGeo.setIndex(obIdx);
  const obMat = fiz({ color: "#FF9A52", roughness: 0.4, clearcoat: 0.5, sheen: 0.4, emissive: new THREE.Color("#3a1600") });
  const brazda = izbirno(dinamicno(new THREE.Mesh(obGeo, obMat)));
  group.add(brazda);
  // obroč r: središče O, os A, pravokotnici U in W, polmer R, debelina tr (0 = skrit)
  function pisiObroc(r, ox, oy, oz, ax, ay, az, ux, uy, uz, wx, wy, wz, R, tr) {
    let o = r * vOb * 3;
    for (let i = 0; i < NU; i++) {
      const u = (2 * Math.PI * i) / NU, cu = Math.cos(u), su = Math.sin(u);
      const ex = ux * cu + wx * su, ey = uy * cu + wy * su, ez = uz * cu + wz * su;
      for (let j = 0; j < NVr; j++) {
        const v = (2 * Math.PI * j) / NVr, cv = Math.cos(v), sv = Math.sin(v), q = R + tr * cv;
        obPos[o] = ox + ex * q + ax * tr * sv; obPos[o + 1] = oy + ey * q + ay * tr * sv; obPos[o + 2] = oz + ez * q + az * tr * sv;
        obNor[o] = ex * cv + ax * sv; obNor[o + 1] = ey * cv + ay * sv; obNor[o + 2] = ez * cv + az * sv;
        o += 3;
      }
    }
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

  // ---------- obris bivalenta (tetrade) in označba hiazme
  const haloMat = fiz({ color: "#E6DEFF", roughness: 0.5, transparent: true, depthWrite: false, emissive: new THREE.Color("#2a2350") });
  const haloU = fresnel(haloMat, "bivalent", 0.0, 0.3, 2.2);
  const halo = izbirno(instance(hr(new THREE.CapsuleGeometry(0.5, 1, visoka ? 8 : 4, visoka ? 28 : 14)), haloMat, 2), 15);
  halo.renderOrder = 6;
  const hiaMat = fiz({ color: "#FFF1C9", roughness: 0.3, clearcoat: 0.6, emissive: new THREE.Color("#7a5a14") });
  const hiazme = izbirno(instance(hr(new THREE.TorusGeometry(1, 0.12, 8, visoka ? 40 : 20)), hiaMat, 2));
  group.add(halo, hiazme);

  // ---------- smeri, okvirji
  const vc = new V3(Math.sin(0.61) * Math.cos(0.35), Math.sin(0.35), Math.cos(0.61) * Math.cos(0.35));
  const desno = new V3(vc.z, 0, -vc.x).normalize(), gor = new V3().crossVectors(vc, desno).normalize();
  const _z = new V3(), _mb = new THREE.Matrix4();
  function okvirQ(q, X, Y) { _z.crossVectors(X, Y); _mb.makeBasis(X, Y, _z); return q.setFromRotationMatrix(_mb); }
  const vRavnini = (a) => [gor.clone().multiplyScalar(-Math.sin(a)).addScaledVector(desno, Math.cos(a)), gor.clone().multiplyScalar(Math.cos(a)).addScaledVector(desno, Math.sin(a))];
  // posamezni kromosomi v zgodnji profazi I (še neparjeni, vsak v svojem območju jedra)
  const qProK = [], cProK = [];
  for (const kr of KR) {
    const [X, Y] = vRavnini(kr.aPro);
    qProK.push(okvirQ(new THREE.Quaternion(), X, Y));
    cProK.push(new V3(kr.T[0], kr.T[1], kr.T[2]).multiplyScalar(RJ * 0.72));
  }
  // bivalenta: 0 = dolgi par (1M, 1O), 1 = kratki par (2M, 2O)
  const BIV = [
    { a: 0.12, cPro: desno.clone().multiplyScalar(-0.105).addScaledVector(gor, 0.0), cMet: new V3(0, 0.0, 0.15), t: 0.0 },
    { a: -0.3, cPro: desno.clone().multiplyScalar(0.115).addScaledVector(gor, -0.03), cMet: new V3(0, -0.05, -0.14), t: 0.3 },
  ];
  for (const b of BIV) {
    const [X, Y] = vRavnini(b.a);
    b.qPro = okvirQ(new THREE.Quaternion(), X, Y);
    const Ym = new V3(0, Math.cos(b.t), Math.sin(b.t));
    b.qMet = [okvirQ(new THREE.Quaternion(), new V3(1, 0, 0), Ym), okvirQ(new THREE.Quaternion(), new V3(-1, 0, 0), Ym)];
  }
  // mejoza II: dolgi kromosom na z = +0,085, kratki na z = -0,085; pri dolgem gre notranja kromatida gor, pri kratkem dol
  const Z2 = [0.1, 0.1, -0.1, -0.1], SY2 = [1, 1, -1, -1];
  const q2 = SY2.map((s) => okvirQ(new THREE.Quaternion(), new V3(0, s, 0), new V3(1, 0, 0)));
  const TEL1 = [[0.05, 0.06], [0.05, 0.06], [-0.05, -0.06], [-0.05, -0.06]];
  const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion(), _qc = new THREE.Quaternion();
  const _bx = new V3(), _by = new V3(), _bz = new V3(), _bc = new V3(), _sg = new V3(), _vx = new V3(), _vy = new V3();
  // stanje kromosomov (j): središče, os sester Σ, dolžinska os, smer kinetohora, pol v MI
  const chC = new Float32Array(12), chS = new Float32Array(12), chY = new Float32Array(12), chK = new Float32Array(12), chZ = new Float32Array(12), chDir = new Float32Array(4);
  const RQ = R0 * Math.cbrt(0.25), CQ = 0.39, RJQ = 0.15; // celice po mejozi II: polmer 0,378
  const _kin = new Float32Array(NK * 3), kinPol = new Int8Array(NK);

  // ---------- deli (izbirni)
  const tc = (x = 0, y = 0, z = 0) => [x, y, z];
  const DELI = {
    membrana: { id: "membrana", ime: "Celična membrana", opis: "Tanka ovojnica iz lipidov in beljakovin, ki obdaja celico; v mejozi se zažame dvakrat, zato nastanejo štiri celice.", barva: "#F4B6A2", meshes: [membrana], tocka: tc() },
    citoplazma: { id: "citoplazma", ime: "Citoplazma", opis: "Poltekoča notranjost celice, v kateri so organeli; v modelu so organeli nakazani le kot drobna zrnca.", barva: "#E9B48C", meshes: [citoplazma, zrna], tocka: tc() },
    jedro: { id: "jedro", ime: "Jedro in jedrna ovojnica", opis: "Dvojna membrana s porami obdaja DNK; v profazi I razpade, po mejozi I se pri mnogih živalih za kratek čas obnovi, ob koncu mejoze II pa nastanejo štiri nova jedra.", barva: "#B7A6FF", meshes: [ovojnica], tocka: tc() },
    jedrce: { id: "jedrce", ime: "Jedrce", opis: "Gosto območje v jedru, kjer nastajajo deli ribosomov; med delitvijo izgine in se v novih jedrih spet pojavi.", barva: "#6E4FD0", meshes: [jedrca], tocka: tc() },
    kromosomi: { id: "kromosomi", ime: "Kromosomi", opis: "Nosijo dedni zapis (DNK); podvojen kromosom ima dve sestrski kromatidi. Rdeči z oznako M so od matere, modri z oznako O od očeta; po prekrižanju imata nekatere kromatide dele obeh barv.", barva: "#FF6B7C", meshes: [kromosomi], tocka: tc() },
    bivalent: { id: "bivalent", ime: "Bivalent (tetrada)", opis: "Par homolognih kromosomov, ki se v profazi I tesno zložita drug ob drugega; skupaj imata štiri kromatide.", barva: "#E6DEFF", meshes: [halo], tocka: tc() },
    hiazma: { id: "hiazma", ime: "Hiazma (mesto prekrižanja)", opis: "Mesto, kjer sta si nesestrski kromatidi homolognih kromosomov izmenjali dela DNK; do anafaze I drži homologna kromosoma skupaj.", barva: "#FFF1C9", meshes: [hiazme], tocka: tc() },
    centromera: { id: "centromera", ime: "Centromera", opis: "Zoženi del kromosoma, kjer sta sestrski kromatidi povezani vse do anafaze II.", barva: "#F3ECFF", meshes: [centromere], tocka: tc() },
    kinetohor: { id: "kinetohor", ime: "Kinetohor", opis: "Beljakovinska ploščica ob centromeri, na katero se pripnejo niti vretena; v mejozi I sta kinetohora sestrskih kromatid obrnjena k istemu polu, v mejozi II k nasprotnima poloma.", barva: "#FFD84A", meshes: [kinetohori], tocka: tc() },
    centrosom: { id: "centrosom", ime: "Centrosom s centriolama", opis: "Iz njega rastejo mikrotubuli vretena; centrosoma se razmakneta na pola celice. Poenostavljeno: v mejozi II je na vsakem polu spet centrosom z dvema centriolama, ki sta v modelu povečani.", barva: "#FFE19A", meshes: [centriole, pcm], tocka: tc() },
    vreteno: { id: "vreteno", ime: "Delitveno vreteno", opis: "Snop mikrotubulov med poloma; v mejozi I vleče narazen homologna kromosoma, v mejozi II pa sestrski kromatidi.", barva: "#A8F0D2", meshes: [vreteno], tocka: tc() },
    brazda: { id: "brazda", ime: "Cepitvena brazda", opis: "Obroč beljakovinskih vlaken (aktina in miozina) pod membrano se krči in celico zažame; v mejozi se to zgodi dvakrat.", barva: "#FF9A52", meshes: [brazda], tocka: tc() },
  };
  const VRSTNI = ["membrana", "citoplazma", "jedro", "jedrce", "kromosomi", "bivalent", "hiazma", "centromera", "kinetohor", "centrosom", "vreteno", "brazda"];
  const prisoten = {};
  let deliKljuc = "", deliSeznam = [];
  const setT = (t, x, y, z) => { t[0] = x; t[1] = y; t[2] = z; };

  // ---------- glavna posodobitev: vse iz p in lege
  let p = 0, lega = zac.lega === "navzkriz" ? "navzkriz" : "enako";
  function posodobi() {
    const li = lega === "navzkriz" ? 1 : 0;
    const Rc = R0 * (0.93 + 0.07 * ramp(p, 0, 0.95));
    const sig1 = sm(cl((p - 6.3) / (7.93 - 6.3))), sig2 = sm(cl((p - 10.35) / (11.93 - 10.35)));
    const cellx = lerp(CH, 0.43, sig2), c2 = CQ * sig2;
    let w = 0, c1 = 0;
    // ---- membrana in zrnca
    if (p < 8) {
      const kz = lerp(0.24, 0.015, sig1); c1 = CH * sig1;
      w = profil(c1, lerp(Rc - kz / 4, RH, sig1), kz);
      pisiKos(0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1);
      pisiKos(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, -1);
      memGeo.setDrawRange(0, 2 * iKos);
      const i = Math.round(nT * 0.32), j = Math.round(nF * 0.2), o = (i * nF + j) * 3;
      setT(DELI.membrana.tocka, memPos[o], memPos[o + 1], memPos[o + 2]);
    } else {
      const kz = lerp(0.2, 0.015, sig2);
      w = profil(c2, lerp(RH - kz / 4, RQ, sig2), kz);
      for (let sx = -1; sx <= 1; sx += 2) for (let sy = -1; sy <= 1; sy += 2) pisiKos(2 + (sx > 0 ? 2 : 0) + (sy > 0 ? 1 : 0), sx * cellx, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, sy);
      memGeo.setDrawRange(2 * iKos, 4 * iKos);
      const i = Math.round(nT * 0.3), j = Math.round(nF * 0.2), o = ((5 * vKos) + i * nF + j) * 3;
      setT(DELI.membrana.tocka, memPos[o], memPos[o + 1], memPos[o + 2]);
    }
    memGeo.attributes.position.needsUpdate = true; memGeo.attributes.normal.needsUpdate = true;
    const zs = (p < 8 ? lerp(Rc, RH, sig1) : lerp(RH, RQ, sig2)) / R0;
    for (let g = 0; g < NG; g++) {
      const sx = zSg[g], sy = zSgY[g];
      const ox = p < 8 ? sx * c1 : sx * cellx, oy = p < 8 ? 0 : sy * c2;
      let x = ox + zOff[g * 3] * R0 * zs, y = oy + zOff[g * 3 + 1] * R0 * zs, z = zOff[g * 3 + 2] * R0 * zs;
      zSx = sx; zCx = cellx;
      if (Fp(x, y, z) > -0.03) {
        let lo = 0, hi = 1;
        for (let it = 0; it < 10; it++) { const m = (lo + hi) / 2; if (Fp(ox + (x - ox) * m, oy + (y - oy) * m, z * m) > -0.03) hi = m; else lo = m; }
        x = ox + (x - ox) * lo; y = oy + (y - oy) * lo; z *= lo;
      }
      const v = zVel[g];
      _p.set(x, y, z); _s.set(v * 1.9, v, v);
      zrna.setMatrixAt(g, _m.compose(_p, zQ[g], _s));
    }
    zrna.instanceMatrix.needsUpdate = true;
    if (p < 8) setT(DELI.citoplazma.tocka, c1 + 0.5 * RH, -0.4 * RH, 0.3 * RH);
    else setT(DELI.citoplazma.tocka, cellx + 0.25, c2 + 0.12, 0.2);

    // ---- faze kot zvezni parametri
    const rep = ramp(p, 1.05, 1.95), dup = ramp(p, 1.25, 1.85);
    const kap = ramp(p, 3.0, 3.7) * (1 - ramp(p, 11.15, 11.95));
    const pair = ramp(p, 3.3, 3.95), dipl = ramp(p, 4.5, 4.9);
    const alfa = ramp(p, 4.05, 4.45), alfa2 = 1 - ramp(p, 6.0, 6.2);
    const move = ramp(p, 5.0, 5.55), psi = (Math.PI / 2) * ramp(p, 5.0, 5.5);
    const ana1 = ramp(p, 6.0, 6.85), tel1 = ramp(p, 6.95, 7.6);
    const rot2 = ramp(p, 8.3, 9.0), pro2 = ramp(p, 8.4, 9.15);
    const ana2 = ramp(p, 10.0, 10.85), tel2 = ramp(p, 10.95, 11.6);
    const kv = ramp(p, 4.6, 4.9) * (1 - ramp(p, 7.1, 7.5)) + ramp(p, 8.5, 8.85) * (1 - ramp(p, 11.1, 11.5));
    const novoIzm = p >= 4.45;
    if (novoIzm !== izmenjano) { izmenjano = novoIzm; for (let k = 1; k < NK; k += 2) barvaj(k, izmenjano); krGeo.attributes.color.needsUpdate = true; }

    // ---- jedrna ovojnica in jedrce
    let th, n = 0;
    if (p < 6) {
      th = ramp(p, 4.55, 4.98);
      if (th < 0.985) { _p.set(0, 0, 0); _s.setScalar(RJ * (0.97 + 0.03 * ramp(p, 0, 0.95))); ovojnica.setMatrixAt(n++, _m.compose(_p, OVOJ_Q, _s)); }
      setT(DELI.jedro.tocka, 0.08, RJ * 0.72, RJ * 0.68);
    } else if (p < 10) {
      const nas = ramp(p, 7.25, 7.8);
      th = 1 - nas * (1 - ramp(p, 8.1, 8.5));
      if (th < 0.985) for (let sx = -1; sx <= 1; sx += 2) { _p.set(sx * 0.475, 0, 0); _s.setScalar(RJH * (0.85 + 0.15 * nas)); ovojnica.setMatrixAt(n++, _m.compose(_p, OVOJ_Q, _s)); }
      setT(DELI.jedro.tocka, 0.475 + 0.05, RJH * 0.72, RJH * 0.68);
    } else {
      const nas = ramp(p, 11.2, 11.8);
      th = 1 - nas;
      if (th < 0.985) for (let sx = -1; sx <= 1; sx += 2) for (let sy = -1; sy <= 1; sy += 2) { _p.set(sx * cellx, sy * c2, 0); _s.setScalar(RJQ * (0.85 + 0.15 * nas)); ovojnica.setMatrixAt(n++, _m.compose(_p, OVOJ_Q, _s)); }
      setT(DELI.jedro.tocka, cellx + 0.04, c2 + RJQ * 0.72, RJQ * 0.68);
    }
    ovojnica.count = n; ovojnica.instanceMatrix.needsUpdate = true;
    ovojMat.alphaTest = 0.03 + 0.97 * th;
    prisoten.jedro = n > 0;
    const jcM = 1 - ramp(p, 3.05, 3.6), jcH = ramp(p, 11.55, 12);
    n = 0;
    if (p < 6 && jcM > 0.01) { _p.set(0.03, -0.05, -0.1); _s.setScalar(0.052 * jcM); jedrca.setMatrixAt(n++, _m.compose(_p, OVOJ_Q, _s)); setT(DELI.jedrce.tocka, 0.03, -0.05, -0.1); }
    if (p >= 10 && jcH > 0.01) for (let sx = -1; sx <= 1; sx += 2) for (let sy = -1; sy <= 1; sy += 2) {
      _p.set(sx * cellx + 0.02, sy * c2 - 0.03, -0.06); _s.setScalar(0.034 * jcH); jedrca.setMatrixAt(n++, _m.compose(_p, OVOJ_Q, _s));
      setT(DELI.jedrce.tocka, cellx + 0.02, c2 - 0.03, -0.06);
    }
    jedrca.count = n; jedrca.instanceMatrix.needsUpdate = true;
    prisoten.jedrce = n > 0;

    // ---- centrosomi: A (0) in B (1) za mejozo I; v profazi II nastaneta A' (2) in B' (3)
    const cs = ramp(p, 3.1, 4.9), polB = ramp(p, 6.15, 7.0), cT1 = ramp(p, 7.2, 8.0);
    const dup2 = ramp(p, 8.0, 8.3), mv2 = ramp(p, 8.3, 8.95), polB2 = ramp(p, 10.15, 11.0), cT2 = ramp(p, 11.3, 12);
    const A0x = -0.07, A0y = 0.355, A0z = 0.12;
    for (let i = 0; i < 4; i++) {
      const sg = i % 2 ? 1 : -1, spodaj = i >= 2;
      let x, y, z;
      if (!spodaj) {
        const a0 = Math.atan2(A0y, A0x + (i ? 0.06 : 0)), a1 = i ? 0 : Math.PI;
        const ang = lerp(a0, a1, cs), rad = lerp(0.37, 0.47, cs);
        x = rad * Math.cos(ang); y = rad * Math.sin(ang); z = lerp(A0z + (i ? -0.02 : 0), 0, cs);
        if (i && cs === 0) { x = lerp(A0x, A0x + 0.06, dup); y = A0y; z = lerp(A0z, A0z - 0.02, dup); }
        x += sg * 0.06 * polB;
        x = lerp(x, sg * 0.5, cT1); y = lerp(y, 0.2, cT1); z = lerp(z, 0.12, cT1);
        x = lerp(x, sg * cellx, mv2); y = lerp(y, 0.27, mv2); z = lerp(z, 0, mv2);
        y += 0.05 * polB2;
        x = lerp(x, sg * (cellx + 0.05), cT2); y = lerp(y, c2 + 0.17, cT2); z = lerp(z, 0.08, cT2);
      } else {
        x = sg * 0.5 + 0.05 * dup2 * sg; y = 0.2 - 0.04 * dup2; z = 0.12;
        x = lerp(x, sg * cellx, mv2); y = lerp(y, -0.27, mv2); z = lerp(z, 0, mv2) + 0.24 * Math.sin(Math.PI * mv2);
        y -= 0.05 * polB2;
        x = lerp(x, sg * (cellx + 0.05), cT2); y = lerp(y, -(c2 + 0.17), cT2); z = lerp(z, 0.08, cT2);
      }
      cenPos[i * 3] = x; cenPos[i * 3 + 1] = y; cenPos[i * 3 + 2] = z;
      cenSk[i] = i === 0 ? 1 : i === 1 ? sm(dup * 1.4) : p < 8 ? 0 : sm(dup2 * 1.4);
    }
    const nc = p < 8 ? 2 : 4;
    for (let i = 0; i < nc; i++) {
      _p.set(cenPos[i * 3], cenPos[i * 3 + 1], cenPos[i * 3 + 2]); _s.setScalar(cenSk[i]);
      _m2.compose(_p, cenQ[i], _s);
      for (let b = 0; b < 18; b++) centriole.setMatrixAt(i * 18 + b, _m.multiplyMatrices(_m2, lokCen[b]));
      _s.setScalar(0.04 * cenSk[i]); pcm.setMatrixAt(i, _m.compose(_p, cenQ[i], _s));
    }
    centriole.count = nc * 18; pcm.count = nc;
    centriole.instanceMatrix.needsUpdate = true; pcm.instanceMatrix.needsUpdate = true;
    setT(DELI.centrosom.tocka, cenPos[0], cenPos[1], cenPos[2]);
    prisoten.centrosom = true;

    // ---- kromosomi: središča in okvirji (j = 0: 1M, 1: 1O, 2: 2M, 3: 2O)
    const h0 = KR[0].r * 1.08 + KR[0].r * 1.05, cP = Math.cos(psi), sP = Math.sin(psi);
    for (let b = 0; b < 2; b++) {
      const B = BIV[b];
      const qM = B.qMet[b === 1 ? li : 0];
      _vx.set(1, 0, 0).applyQuaternion(qM);
      if (p < 6) { _qa.slerpQuaternions(B.qPro, qM, move); _bc.copy(B.cPro).lerp(B.cMet, move); }
      else { _qa.copy(qM); _bc.copy(B.cMet); }
      _bx.set(1, 0, 0).applyQuaternion(_qa); _by.set(0, 1, 0).applyQuaternion(_qa); _bz.set(0, 0, 1).applyQuaternion(_qa);
      const h = h0 + 0.025 * (p < 6 ? dipl : 1) + 0.02 * (p < 6 ? move : 1);
      for (let hom = 0; hom < 2; hom++) {
        const j = 2 * b + hom, hs = hom ? 1 : -1, o = j * 3;
        const dir = Math.sign(_vx.x * hs);
        chDir[j] = dir;
        let Cx = _bc.x + _bx.x * hs * h, Cy = _bc.y + _bx.y * hs * h, Cz = _bc.z + _bx.z * hs * h;
        if (p < 6) {
          // Σ = os, ob kateri ležita sestri: najprej v vrsti (ψ = 0), v metafazi I ena za drugo (ψ = 90°)
          _sg.set(_bx.x * -hs * cP + _bz.x * sP, _bx.y * -hs * cP + _bz.y * sP, _bx.z * -hs * cP + _bz.z * sP);
          if (pair < 1) {
            okvirQ(_qb, _sg, _by);
            _qc.slerpQuaternions(qProK[j], _qb, pair);
            _sg.set(1, 0, 0).applyQuaternion(_qc); _vy.set(0, 1, 0).applyQuaternion(_qc);
            const c = cProK[j];
            Cx = lerp(c.x, Cx, pair); Cy = lerp(c.y, Cy, pair); Cz = lerp(c.z, Cz, pair);
          } else _vy.copy(_by);
          chK[o] = _bx.x * hs; chK[o + 1] = _bx.y * hs; chK[o + 2] = _bx.z * hs;
        } else {
          // mejoza I se konča, kromosomi se obrnejo za mejozo II (sestri vzdolž osi y)
          okvirQ(_qb, _bz, _by);
          _qc.slerpQuaternions(_qb, q2[j], rot2);
          _sg.set(1, 0, 0).applyQuaternion(_qc); _vy.set(0, 1, 0).applyQuaternion(_qc);
          Cx = lerp(Cx, dir * 0.32, ana1); Cy *= 1 - 0.4 * ana1; Cz *= 1 - 0.4 * ana1;
          Cx = lerp(Cx, dir * 0.475, tel1); Cy = lerp(Cy, TEL1[j][0], tel1); Cz = lerp(Cz, TEL1[j][1], tel1);
          Cx = lerp(Cx, dir * cellx, pro2); Cy = lerp(Cy, 0, pro2); Cz = lerp(Cz, Z2[j], pro2);
          Cz *= 1 - 0.4 * ana2;
          chK[o] = dir; chK[o + 1] = 0; chK[o + 2] = 0;
        }
        chC[o] = Cx; chC[o + 1] = Cy; chC[o + 2] = Cz;
        chS[o] = _sg.x; chS[o + 1] = _sg.y; chS[o + 2] = _sg.z;
        chY[o] = _vy.x; chY[o + 1] = _vy.y; chY[o + 2] = _vy.z;
        chZ[o] = _bz.x; chZ[o + 1] = _bz.y; chZ[o + 2] = _bz.z;
      }
    }
    // ---- kromatide (k = 2j + sestra; sestra 1 je notranja, ta sodeluje pri prekrižanju)
    for (let j = 0; j < 4; j++) {
      const kr = KR[j], d0 = kr.r * 0.62, o = j * 3;
      for (let sis = 0; sis < 2; sis++) {
        const k = j * 2 + sis, sg = sis ? 1 : -1, ko = k * 3;
        const Sx = chS[o] * sg, Sy = chS[o + 1] * sg, Sz = chS[o + 2] * sg;
        let dd = d0;
        if (p >= 10) dd = lerp(d0, 0.24, ana2);
        let cx = chC[o] + Sx * dd, cy = chC[o + 1] + Sy * dd, cz = chC[o + 2] + Sz * dd;
        const sy = Sy >= 0 ? 1 : -1, sx = chDir[j];
        if (tel2 > 0) {
          const hx = sx * cellx + RJQ * 0.62 * kr.T[0], hy = sy * c2 + RJQ * 0.62 * kr.T[1], hz = RJQ * 0.62 * kr.T[2];
          cx = lerp(cx, hx, tel2); cy = lerp(cy, hy, tel2); cz = lerp(cz, hz, tel2);
        }
        kC[ko] = cx; kC[ko + 1] = cy; kC[ko + 2] = cz;
        kY[ko] = chY[o]; kY[ko + 1] = chY[o + 1]; kY[ko + 2] = chY[o + 2];
        kS[ko] = Sx; kS[ko + 1] = Sy; kS[ko + 2] = Sz;
        if (p < 8) { kM[ko] = sx; kM[ko + 1] = 0; kM[ko + 2] = 0; kB[k] = 0.7 * sm(ana1 * 2.2) * (1 - tel1); }
        else { kM[ko] = Sx; kM[ko + 1] = Sy; kM[ko + 2] = Sz; kB[k] = 0.75 * sm(ana2 * 2.2) * (1 - 0.7 * tel2); }
        kKap[k] = kap;
        if (p < 10) { kTc[ko] = 0; kTc[ko + 1] = 0; kTc[ko + 2] = 0; kTs[k] = RJ; kRep[k] = rep; kOw[k] = 1; kSkrij[k] = sis; }
        else { kTc[ko] = sx * cellx; kTc[ko + 1] = sy * c2; kTc[ko + 2] = 0; kTs[k] = RJQ; kRep[k] = 0; kOw[k] = 0; kSkrij[k] = 0; }
        // pol, h kateremu je obrnjen kinetohor
        kinPol[k] = p < 8 ? (sx < 0 ? 0 : 1) : (sx < 0 ? (sy > 0 ? 0 : 2) : (sy > 0 ? 1 : 3));
      }
    }
    // prekrižanje med notranjima kromatidama vsakega bivalenta
    for (let k = 1; k < NK; k += 2) {
      const j = k >> 1, jp = j ^ 1, kr = KR[j], o = j * 3, op = jp * 3, ko = k * 3;
      const lat = kr.r * 1.08 + 0.09 * Math.abs((kr.xs - kr.sc) * kr.L);
      kD[ko] = chC[op] + chS[op] * lat - (chC[o] + chS[o] * lat);
      kD[ko + 1] = chC[op + 1] + chS[op + 1] * lat - (chC[o + 1] + chS[o + 1] * lat);
      kD[ko + 2] = chC[op + 2] + chS[op + 2] * lat - (chC[o + 2] + chS[o + 2] * lat);
      const zs2 = KR[j].mati ? 1 : -1;
      kZb[ko] = chZ[o] * zs2; kZb[ko + 1] = chZ[o + 1] * zs2; kZb[ko + 2] = chZ[o + 2] * zs2;
      kAl[k] = p < 4 ? 0 : alfa; kAp[k] = alfa2;
    }
    for (let k = 0; k < NK; k++) {
      const j = k >> 1, kr = KR[j], d0 = kr.r * 0.62, ko = k * 3, sep = p >= 10;
      vzorci(k);
      pisiCev(k);
      const ce = sm((kap - 0.45) / 0.4);
      _p.set(kC[ko] - kS[ko] * d0 * 0.55, kC[ko + 1] - kS[ko + 1] * d0 * 0.55, kC[ko + 2] - kS[ko + 2] * d0 * 0.55);
      _s.setScalar(kr.r * 0.6 * ce * (sep ? 0.85 : 1));
      centromere.setMatrixAt(k, ce > 0.01 ? _m.compose(_p, _q.identity(), _s) : NIC);
      // kinetohor: v mejozi I proti polu homologa, v mejozi II proti polu svoje strani
      const t = p < 8 ? 0 : rot2;
      _d.set(lerp(chK[j * 3], kS[ko], t), lerp(chK[j * 3 + 1], kS[ko + 1], t), lerp(chK[j * 3 + 2], kS[ko + 2], t));
      if (_d.lengthSq() < 1e-6) _d.set(kS[ko], kS[ko + 1], kS[ko + 2]);
      _d.normalize();
      _p.set(kC[ko] + _d.x * kr.r * 0.62, kC[ko + 1] + _d.y * kr.r * 0.62, kC[ko + 2] + _d.z * kr.r * 0.62);
      _q.setFromUnitVectors(_x, _d); _s.set(0.006 * kv, 0.013 * kv, 0.013 * kv);
      kinetohori.setMatrixAt(k, kv > 0.01 ? _m.compose(_p, _q, _s) : NIC);
      _kin[ko] = _p.x; _kin[ko + 1] = _p.y; _kin[ko + 2] = _p.z;
    }
    krGeo.attributes.position.needsUpdate = true; krGeo.attributes.normal.needsUpdate = true;
    centromere.count = NK; kinetohori.count = NK;
    centromere.instanceMatrix.needsUpdate = true; kinetohori.instanceMatrix.needsUpdate = true;
    prisoten.kromosomi = true;
    prisoten.centromera = kap > 0.6;
    prisoten.kinetohor = kv > 0.3;
    {
      const b = 0 * NS + Math.round(NS * 0.3);
      setT(DELI.kromosomi.tocka, sX[b], sY[b], sZ[b]);
      setT(DELI.centromera.tocka, kC[4 * 3], kC[4 * 3 + 1], kC[4 * 3 + 2]);
      setT(DELI.kinetohor.tocka, _kin[2 * 3], _kin[2 * 3 + 1], _kin[2 * 3 + 2]);
    }

    // ---- obris bivalenta in hiazmi
    const hv = ramp(p, 3.8, 4.0) * (1 - ramp(p, 5.9, 6.05));
    haloU.a1.value = 0.3 * hv;
    n = 0;
    if (hv > 0.01) for (let b = 0; b < 2; b++) {
      const kr = KR[2 * b], jm = 2 * b * 3, jo = (2 * b + 1) * 3;
      _bx.set(chC[jo] - chC[jm], chC[jo + 1] - chC[jm + 1], chC[jo + 2] - chC[jm + 2]);
      const dist = _bx.length() || 1e-3; _bx.multiplyScalar(1 / dist);
      _by.set(chY[jm], chY[jm + 1], chY[jm + 2]);
      _bz.crossVectors(_bx, _by).normalize(); _by.crossVectors(_bz, _bx);
      _mb.makeBasis(_bx, _by, _bz); _q.setFromRotationMatrix(_mb);
      const off = (0.5 - kr.sc) * kr.L;
      _p.set((chC[jm] + chC[jo]) / 2 + _by.x * off, (chC[jm + 1] + chC[jo + 1]) / 2 + _by.y * off, (chC[jm + 2] + chC[jo + 2]) / 2 + _by.z * off);
      _s.set(dist + 2 * (kr.r * 1.1 * cP + kr.r) + 0.05, (kr.L + 0.06) / 2, 2 * (kr.r * 1.1 * sP + kr.r) + 0.05);
      halo.setMatrixAt(n++, _m.compose(_p, _q, _s));
      if (b === 0) setT(DELI.bivalent.tocka, _p.x + _bz.x * _s.z * 0.5, _p.y + _bz.y * _s.z * 0.5, _p.z + _bz.z * _s.z * 0.5);
    }
    halo.count = n; halo.instanceMatrix.needsUpdate = true;
    prisoten.bivalent = hv > 0.3;
    const xv = ramp(p, 4.42, 4.6) * cl(alfa2 * 1.5);
    n = 0;
    if (xv > 0.01) for (let b = 0; b < 2; b++) {
      const kr = KR[2 * b], i = Math.round(kr.xs * (NS - 1)), a = (4 * b + 1) * NS + i, c = (4 * b + 3) * NS + i;
      _p.set((sX[a] + sX[c]) / 2, (sY[a] + sY[c]) / 2, (sZ[a] + sZ[c]) / 2);
      _d.set(chZ[6 * b], chZ[6 * b + 1], chZ[6 * b + 2]).normalize();
      _q.setFromUnitVectors(_zOs, _d); _s.setScalar(0.034 * xv);
      hiazme.setMatrixAt(n++, _m.compose(_p, _q, _s));
      if (b === 0) setT(DELI.hiazma.tocka, _p.x, _p.y, _p.z);
    }
    hiazme.count = n; hiazme.instanceMatrix.needsUpdate = true;
    prisoten.hiazma = xv > 0.3;

    // ---- oznake kromosomov (na koncu kratke ročice, ki ohrani svojo barvo)
    for (let k = 0; k < NK; k++) {
      const sis = k & 1;
      let a = sm((kap - 0.55) / 0.3);
      if (sis && p < 10) a = 0;
      const s = oznake[k];
      s.visible = a > 0.02;
      if (!s.visible) continue;
      oznMat[k].opacity = a;
      const b = k * NS, b2 = k * NS + 6;
      const dx = sX[b] - sX[b2], dy = sY[b] - sY[b2], dz = sZ[b] - sZ[b2];
      const l = Math.hypot(dx, dy, dz) || 1;
      let ox = sX[b] + (dx / l) * 0.04, oy = sY[b] + (dy / l) * 0.04, oz = sZ[b] + (dz / l) * 0.04;
      if (p < 10) { ox += kS[k * 3] * 0.02; oy += kS[k * 3 + 1] * 0.02; oz += kS[k * 3 + 2] * 0.02; }
      s.position.set(ox, oy, oz);
    }

    // ---- vreteno (v mejozi I eno, v mejozi II dve)
    let f = 0;
    const cev = (ax, ay, az, bx, by, bz, rad) => {
      _d.set(bx - ax, by - ay, bz - az);
      const L = _d.length();
      if (L < 0.004) return;
      _d.multiplyScalar(1 / L); _q.setFromUnitVectors(_y, _d);
      _p.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2); _s.set(rad, L, rad);
      vreteno.setMatrixAt(f++, _m.compose(_p, _q, _s));
    };
    const RF = 0.0027, MI = p < 8;
    const ga = MI ? ramp(p, 3.3, 4.2) : ramp(p, 8.35, 8.9), gp = MI ? ramp(p, 4.6, 5.1) : ramp(p, 8.5, 9.0);
    const gk = MI ? ramp(p, 5.05, 5.5) : ramp(p, 9.0, 9.45), ugas = MI ? 1 - ramp(p, 7.0, 7.6) : 1 - ramp(p, 10.9, 11.5);
    const pari = MI ? 1 : 2;
    for (let par = 0; par < pari; par++) {
      const pa = MI ? 0 : par, pb = MI ? 1 : par + 2;
      const mx = (cenPos[pa * 3] + cenPos[pb * 3]) / 2, my = (cenPos[pa * 3 + 1] + cenPos[pb * 3 + 1]) / 2, mz = (cenPos[pa * 3 + 2] + cenPos[pb * 3 + 2]) / 2;
      for (let s2 = 0; s2 < 2; s2++) {
        const pol = s2 ? pb : pa, dru = s2 ? pa : pb;
        const px = cenPos[pol * 3], py = cenPos[pol * 3 + 1], pz = cenPos[pol * 3 + 2];
        const qx = cenPos[dru * 3], qy = cenPos[dru * 3 + 1], qz = cenPos[dru * 3 + 2];
        let ux = px - mx, uy = py - my, uz = pz - mz;
        if (MI && cs < 1) { ux = px; uy = py; uz = pz; }
        const ul = Math.hypot(ux, uy, uz) || 1;
        const la = ga * ugas;
        if (la > 0.01) for (let i = 0; i < NAST; i++) {
          const b = (pol * NAST + i) * 3;
          const dx = (ux / ul) * 1.1 + astDir[b], dy = (uy / ul) * 1.1 + astDir[b + 1], dz = (uz / ul) * 1.1 + astDir[b + 2];
          const l = Math.hypot(dx, dy, dz) || 1, L = astLen[pol * NAST + i] * la * (MI ? 1 : 0.8);
          cev(px, py, pz, px + (dx / l) * L, py + (dy / l) * L, pz + (dz / l) * L, RF);
        }
        const lp = gp * ugas;
        if (lp > 0.01) {
          const ex = qx - px, ey = qy - py, ez = qz - pz, dist = Math.hypot(ex, ey, ez) || 1;
          // dve pravokotnici na os vretena
          let nx = -ey, ny = ex, nz = 0;
          if (Math.hypot(nx, ny) < 1e-4) { nx = 0; ny = -ez; nz = ey; }
          const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
          const bx = (ey * nz - ez * ny) / dist, by = (ez * nx - ex * nz) / dist, bz = (ex * ny - ey * nx) / dist;
          const amp = MI ? 0.11 : 0.07;
          for (let i = 0; i < NPOL; i++) {
            const b = (pol * NPOL + i) * 3, L = dist * polJit[b + 2] * 1.12 * lp, sw = Math.sin((Math.PI * L) / dist) * amp;
            const ja = polJit[b] * sw, jb = polJit[b + 1] * sw;
            cev(px, py, pz, px + (ex / dist) * L + nx * ja + bx * jb, py + (ey / dist) * L + ny * ja + by * jb, pz + (ez / dist) * L + nz * ja + bz * jb, RF);
          }
        }
        const lk = gk * ugas;
        if (lk > 0.01) for (let k = 0; k < NK; k++) {
          if (kinPol[k] !== pol) continue;
          for (let v = 0; v < NKIN; v++) {
            const oo = (v - 0.5) * 0.008;
            const tx = _kin[k * 3] + kY[k * 3] * oo, ty = _kin[k * 3 + 1] + kY[k * 3 + 1] * oo, tz = _kin[k * 3 + 2] + kY[k * 3 + 2] * oo;
            cev(px, py, pz, lerp(px, tx, lk), lerp(py, ty, lk), lerp(pz, tz, lk), RF * 1.15);
          }
        }
      }
    }
    vreteno.count = f; vreteno.instanceMatrix.needsUpdate = true;
    prisoten.vreteno = f > 6;
    if (MI) setT(DELI.vreteno.tocka, lerp(cenPos[3], 0, 0.45), lerp(cenPos[4], 0, 0.45) + 0.05, lerp(cenPos[5], 0, 0.45));
    else setT(DELI.vreteno.tocka, cellx + 0.05, 0.15, 0.03);

    // ---- brazda (obroč 0 v mejozi I, obroča 1 in 2 v mejozi II)
    const vb1 = MI ? ramp(sig1, 0.33, 0.5) * cl(w / 0.03) : 0, vb2 = MI ? 0 : ramp(sig2, 0.33, 0.5) * cl(w / 0.03);
    brazda.visible = vb1 > 0.02 || vb2 > 0.02;
    if (brazda.visible) {
      pisiObroc(0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, vb1 > 0.02 ? Math.max(0.001, w - 0.01 * vb1) : 0, vb1 > 0.02 ? 0.0085 * vb1 : 0);
      for (let r = 1; r <= 2; r++) pisiObroc(r, (r === 1 ? -1 : 1) * cellx, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, vb2 > 0.02 ? Math.max(0.001, w - 0.01 * vb2) : 0, vb2 > 0.02 ? 0.0085 * vb2 : 0);
      obGeo.attributes.position.needsUpdate = true; obGeo.attributes.normal.needsUpdate = true;
    }
    prisoten.brazda = brazda.visible;
    if (MI) setT(DELI.brazda.tocka, 0, w * 0.7, w * 0.7);
    else setT(DELI.brazda.tocka, cellx + w * 0.7, 0, w * 0.7);
    prisoten.membrana = prisoten.citoplazma = true;
  }
  const _zOs = new V3(0, 0, 1);
  let zSx = 1, zCx = 0;
  const Fp = (X, Y, Z) => (p < 8 ? F(X, Math.hypot(Y, Z)) : F(Y, Math.hypot(X - zSx * zCx, Z)));

  // ---------- nadzor in predvajanje
  const SEK = 3.4; // sekund na fazo pri predvajanju
  let igra = false, cilj = null, cakaj = 0;
  const dPotek = { tip: "drsnik", id: "potek", oznaka: "Potek", min: 0, max: N, korak: 0.01, vrednost: 0, ob: (v) => { ustavi(); cilj = null; nastavi(Number(v)); } };
  const dPredvajaj = { tip: "stikalo", id: "predvajaj", oznaka: "Predvajaj", vrednost: false, ob: (v) => { igra = !!v; dPredvajaj.vrednost = igra; cilj = null; cakaj = 0; if (igra && p >= N - 0.001) nastavi(0); } };
  const dLega = {
    tip: "izbira", id: "lega", oznaka: "Lega parov v metafazi I",
    moznosti: [["enako", "1M in 2M na isti strani"], ["navzkriz", "1M in 2M na nasprotnih straneh"]],
    vrednost: lega, vidno: () => p >= 4, ob: (v) => { lega = v === "navzkriz" ? "navzkriz" : "enako"; dLega.vrednost = lega; posodobi(); },
  };
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
    dLega,
    { tip: "izpis", id: "faza", oznaka: "Faza", vrednost: () => { const i = indeks(); return i < 0 ? KONEC[0] : `${FAZE[i][0]} (${i + 1}/${N})`; } },
    { tip: "izpis", id: "dogajanje", oznaka: "Kaj se dogaja", vrednost: () => faza()[1] },
    { tip: "izpis", id: "stevilo", oznaka: "Kromosomi in kromatide", vrednost: () => faza()[2] },
    { tip: "izpis", id: "oznake", oznaka: "Oznake", vrednost: () => "M (rdeči): od matere · O (modri): od očeta · 1 in 2: homologna para" },
  ];

  nastavi(Number(zac.potek ?? 0));
  if (zac.predvajaj === true || zac.predvajaj === "true" || zac.predvajaj === 1) dPredvajaj.ob(true);

  return {
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
    },
    dispose() {
      for (const x of smeti) x.dispose?.();
      for (const o of [zrna, ovojnica, jedrca, centromere, kinetohori, centriole, pcm, vreteno, halo, hiazme]) o.dispose?.();
    },
  };
}
