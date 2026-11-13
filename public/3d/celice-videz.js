// Skupni videz 3D celic (docs/3d.md »Videz celic«): ciljni videz je znanstvena ilustracija v slogu upodobitve
// (Cinema 4D + Redshift, Astra): steklena prosojna membrana s svetlim robom, nasičene barve, vlažna kiparjena površina,
// gosti drobni deli (ribosomi, beljakovine, vlakna) in temno vijoličen oder. Vse je proceduralno v kodi (brez tekstur
// in prenosov), drobni deli so primerki (InstancedMesh) ali točke, zato telefon ostane tekoč.
// Graditelji celic uvozijo ta modul in mu dajo THREE iz kompleta (modul sam ne uvaža three, zato deluje tudi v testih).
//
//   import { videzCelic, BARVE } from "../../celice-videz.js";
//   const V = videzCelic(THREE, { hi, odpad });
//   V.steklo(material, { a: 0.3 })    → steklena membrana (prosojna, svetel rob, mavrični odsev; tap gre skozi njo)
//   V.poliraj(group, deli, nast)      → vlažna površina z reliefom, poglobljene barve (glej opis pri funkciji)
//   V.pike(tocke, barva, velikost)    → sijoče kroglice iz točk (ribosomi, zrnca), brez trikotnikov
//   V.vlakna(krivulje, r, barva)      → sijoča vlakna citoskeleta (ena mreža)
//   V.posej(mesh, n, sito)            → naključne točke na površini mreže (po ploščini), z normalo
//   V.beljakovine(tocke, barva, r)    → beljakovine na membrani (kepice, primerki)
//   V.ravenFaks(deli, { … })          → stikalo »Podrobnosti za faks« (faks deli, besedila; glej opis pri funkciji)
//   V.zdruzi(geos, barve)             → ena geometrija iz več

// Skupna paleta: isti organel ima v vseh celicah isto barvo (j: vse povsod usklajeno).
export const BARVE = {
  membrana: "#b8c3ff", // steklena membrana (odtenek; glavno barvo da rob in odsev)
  membranaRob: "#9fb4ff",
  dvosloj: "#e9a7c4",
  beljakovine: "#8f62f2",
  citoplazma: "#2c2458",
  jedro: "#8a3ef0",
  nukleoplazma: "#c48bff",
  kromatin: "#5b22c4",
  jedrce: "#37128c",
  ovojnica: "#6b36d6",
  zer: "#4d61d9",
  zerSvetel: "#8fa3ff",
  ger: "#4fa6ff",
  ribosomi: "#ffc94a",
  golgi: "#f0a12c",
  golgiSvetel: "#ffd36b",
  mitohondrij: "#e29424",
  krista: "#ffd67e",
  lizosom: "#1fc8bd",
  peroksisom: "#6ed98a",
  mesicki: "#41d3e6",
  citoskelet: "#ffd84a",
  aktin: "#ffb347",
  centrosom: "#ffcf3a",
  kloroplast: "#3eb33f",
  tilakoid: "#1f7d2c",
  skrob: "#f3ead2",
  vakuola: "#22b5c9",
  stena: "#8cc63f",
  stenaTemna: "#5b8f22",
  dnk: "#ff6fb1",
  rnk: "#ff9b4a",
  mascoba: "#ffd34a",
  glikogen: "#d9c4ff",
  hemoglobin: "#d8222f",
  mielin: "#f2ead8",
  kost: "#efe3c8",
  sluz: "#a8d8ff",
  bicek: "#f6e7b8",
  // podrobnosti za faks (V.ravenFaks)
  intermediarni: "#ff7f6e",
  lamina: "#ff8f80",
  glikokaliks: "#7ff0b2",
  endosom: "#f5a3c8",
  klatrin: "#ff6a3d",
  plastoglobul: "#ffe066",
};

// »Barve kot v učbeniku« (j, 12. 11.): klasične barve šolskih slik celice, svetlejše in bolj razločne med seboj. Ključ je
// id dela (enaki id-ji v vseh celicah); celica lahko doda svoje (posebne) v V.barveUcbenika.
export const BARVE_UCBENIK = {
  membrana: "#e8809a", "celicna-membrana": "#e8809a", citoplazma: "#f5d6b8", jedro: "#9a6fe0", nukleoplazma: "#cdb8f5",
  "jedrna-ovojnica": "#5e40bd", kromatin: "#4a2fa3", jedrce: "#2f1e80", "zrnati-er": "#4f95e8", "gladki-er": "#35c4b0",
  ribosomi: "#1d2c80", golgi: "#f5d23c", mitohondrij: "#ea5f3a", mitohondriji: "#ea5f3a", lizosom: "#68c24a",
  lizosomi: "#68c24a", peroksisom: "#bcd83a", centrosom: "#28b8dc", citoskelet: "#8fa3cc", mesicki: "#f8de72",
  kloroplast: "#35a83a", kloroplasti: "#35a83a", vakuola: "#86d4f2", "osrednja-vakuola": "#86d4f2", tonoplast: "#4aa8d8",
  stena: "#5c9e2e", "celicna-stena": "#5c9e2e", plazmodezme: "#a3c95a", nukleoid: "#e46aa6", plazmid: "#f29ac2",
  plazmidi: "#f29ac2", bicek: "#c9a46a", bicki: "#c9a46a", pili: "#d9c08a", kapsula: "#d8e6a0", migetalke: "#c9a46a",
  "skrobna-zrna": "#f2ecd6", "krcljiva-vakuola": "#7ccdf0", "prebavna-vakuola": "#e2b36c",
  // deli, ki jih doda »Podrobnosti za faks«
  mikrotubuli: "#6f8fd0", "aktinski-filamenti": "#d08a5a", "intermediarni-filamenti": "#e07a5f", "jedrna-lamina": "#f2a28f",
  "membranske-beljakovine": "#8a5fc9", glikokaliks: "#7fcf8f", endosomi: "#e98fb8", "klatrinski-mesicki": "#e8743b",
  mtdna: "#e46aa6", "kloroplastna-dna": "#e46aa6", plastoglobuli: "#f0d060",
};

export function videzCelic(THREE, { hi = true, odpad = [] } = {}) {
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
  let seme = 11;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;

  const GLSL = `
float zvH(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float zvS(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(zvH(i), zvH(i + vec3(1, 0, 0)), f.x), mix(zvH(i + vec3(0, 1, 0)), zvH(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(zvH(i + vec3(0, 0, 1)), zvH(i + vec3(1, 0, 1)), f.x), mix(zvH(i + vec3(0, 1, 1)), zvH(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
vec3 zvRelief(vec3 n, float h, float fd){ // naklon normale iz odvodov višine po zaslonu (kot bumpMap, brez teksture)
  vec3 dx = dFdx(-vViewPosition), dy = dFdy(-vViewPosition), r1 = cross(dy, n), r2 = cross(n, dx);
  float det = dot(dx, r1) * fd;
  return normalize(abs(det) * n - sign(det) * (dFdx(h) * r1 + dFdy(h) * r2)); }`;
  // Isti šum kot zvS v senčilniku (za točke, ki se morajo ujemati z odprtinami `luknje`).
  const fr = (x) => x - Math.floor(x);
  function zvH(x, y, z) {
    x = fr(x * 0.3183099 + 0.1) * 17; y = fr(y * 0.3183099 + 0.2) * 17; z = fr(z * 0.3183099 + 0.3) * 17;
    return fr(x * y * z * (x + y + z));
  }
  function zvS(x, y, z) {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    let fx = x - ix, fy = y - iy, fz = z - iz;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
    const l = (a, b, t) => a + (b - a) * t, h = (a, b, c) => zvH(ix + a, iy + b, iz + c);
    return l(l(l(h(0, 0, 0), h(1, 0, 0), fx), l(h(0, 1, 0), h(1, 1, 0), fx), fy), l(l(h(0, 0, 1), h(1, 0, 1), fx), l(h(0, 1, 1), h(1, 1, 1), fx), fy), fz);
  }
  // Ali je točka (v koordinatah mreže) v odprtini materiala z možnostjo `luknje`.
  const vLuknji = (p, lu) => zvS(p.x * lu.f, p.y * lu.f, p.z * lu.f) * 0.7 + zvS(p.x * lu.f * 2.3 + 4, p.y * lu.f * 2.3 + 4, p.z * lu.f * 2.3 + 4) * 0.3 > lu.prag;
  const F = (x) => (Number.isInteger(x) ? x + ".0" : String(+(+x).toPrecision(4)));
  const V3 = (c) => { const b = new THREE.Color(c); return `vec3(${F(b.r)}, ${F(b.g)}, ${F(b.b)})`; };
  const VRSTE = { zrna: 0, gube: 1, fino: 2, vlakna: 3 };

  // Senčilniku doda relief (šum višine → nagnjena normala), senco v kotanjah, mehko presevnost roba in pri steklu
  // svetel rob (fresnel), ki je tudi manj prozoren. o = { vr: 0 zrna | 1 gube | 2 fino | 3 vlakna (vzdolž x), rf: gostota
  // na enoto, k: moč, b: senca v kotanjah, s: presevnost roba, steklo: { a, rob, rk, re } | null, brez: true = brez reliefa,
  // luknje: { f: gostota, prag: 0 … 1 } = okrogle odprtine (fenestracije ER, pore) z odrezom fragmentov po šumu }.
  // Komplet izbrani del obarva na kopiji materiala, zato kopija dobi isti dodatek (clone sicer izgubi onBeforeCompile).
  function sencilo(m, o) {
    const rf = o.rf || 30, Fr = F(rf), K = F(0.1 * (o.k ?? 0.6) / rf), B = F(o.b ?? 0.16), S = F(o.s ?? 0.14);
    const sk = o.vr === 3 ? `vec3(${F(rf * 0.14)}, ${Fr}, ${Fr})` : Fr;
    const osnova = o.vr === 1 ? "(1.0 - abs(2.0 * zvS(zp) - 1.0))" : "zvS(zp)";
    const st = o.steklo;
    const brez = !!o.brez, lu = o.luknje;
    m.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vZp;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvZp = transformed;\n#ifdef USE_INSTANCING\nvZp = (instanceMatrix * vec4(transformed, 1.0)).xyz;\n#endif");
      let fs = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vZp;" + GLSL);
      if (lu) fs = fs.replace("#include <clipping_planes_fragment>", `#include <clipping_planes_fragment>
          if (zvS(vZp * ${F(lu.f)}) * 0.7 + zvS(vZp * ${F(lu.f * 2.3)} + 4.0) * 0.3 > ${F(lu.prag)}) discard;`);
      if (!brez) {
        fs = fs.replace("#include <color_fragment>", `#include <color_fragment>
          vec3 zp = vZp * ${sk};
          float zw = length(fwidth(zp));
          float zn = mix(0.5, ${osnova}, clamp(1.6 - zw * 1.8, 0.0, 1.0));
          ${hi ? "zn = zn * 0.62 + mix(0.5, zvS(mat3(0.8, 0.36, -0.48, -0.6, 0.48, -0.64, 0.0, 0.8, 0.6) * zp * 2.7 + 7.0), clamp(1.6 - zw * 4.9, 0.0, 1.0)) * 0.38;" : ""}
          diffuseColor.rgb *= 1.0 - ${B} + ${B} * 1.35 * zn;`)
          .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor + (zn - 0.5) * 0.18, 0.04, 1.0);")
          .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>\nnormal = zvRelief(normal, zn * ${K}, faceDirection);`);
      }
      fs = fs.replace("#include <opaque_fragment>", `float zfr = 1.0 - abs(dot(normal, normalize(vViewPosition)));
          outgoingLight += diffuseColor.rgb * ${S} * pow(zfr, 1.6);
          ${st ? `float zrb = pow(1.0 - abs(dot(nonPerturbedNormal, normalize(vViewPosition))), ${F(st.re ?? 2.2)});
          outgoingLight += ${V3(st.rob)} * zrb * ${F(st.rk ?? 1.1)};
          diffuseColor.a = clamp(${F(st.a)} + (1.0 - ${F(st.a)}) * zrb * 0.85, 0.0, 1.0);` : ""}
          #include <opaque_fragment>`);
      sh.fragmentShader = fs;
    };
    const kl = `cv|${sk}|${o.vr || 0}|${K}|${B}|${S}|${hi}|${brez}|${lu ? lu.f + "," + lu.prag : ""}|${st ? [st.a, st.rob, st.rk, st.re].join(",") : ""}`;
    m.customProgramCacheKey = () => kl;
    m.clone = function () { const c = new this.constructor().copy(this); sencilo(c, o); return c; };
    m.userData.cv = o;
    m.needsUpdate = true;
    return m;
  }

  // Steklena membrana: prozorna sredina, svetel moder rob, lak in (pri visoki kakovosti) mavrični odsev tanke plasti.
  // Tap gre skozi steklo do dela za njim (userData.skozi, public/3d/izbira.js). o = { a: prosojnost sredine (0 … 1),
  // rob: barva roba, rk: moč roba, rf/k: relief, dvostransko: true za tanke opne brez notranje ploskve }.
  function steklo(m, o = {}) {
    m.transparent = true;
    m.opacity = 1;
    // Čisto steklo skoraj nima razpršene svetlobe: barvo dajo rob, odsevi in rahel odtenek. Sicer bi močno osvetljena
    // ploskev tudi pri majhni prekrivnosti pobelila vse, kar je za njo.
    m.color.multiplyScalar(o.difuzno ?? 0.12);
    m.depthWrite = false;
    m.roughness = o.rough ?? 0.14;
    m.metalness = 0;
    m.clearcoat = 1;
    m.clearcoatRoughness = 0.06;
    m.sheen = 0;
    m.envMapIntensity = 1.25;
    if (hi && "iridescence" in m) {
      m.iridescence = o.iri ?? 0.65;
      m.iridescenceIOR = 1.32;
      if ("iridescenceThicknessMaximum" in m) { m.iridescenceThicknessMinimum = 160; m.iridescenceThicknessMaximum = 520; }
      else m.iridescenceThicknessRange = [160, 520];
    }
    if (o.dvostransko) { m.side = THREE.DoubleSide; m.forceSinglePass = true; }
    m.userData.skozi = true;
    m.userData.steklo = true;
    return sencilo(m, { vr: VRSTE[o.tex || "zrna"], rf: o.rf || 16, k: o.k ?? 0.9, b: o.b ?? 0.1, s: o.s ?? 0.25, brez: o.brez,
      steklo: { a: o.a ?? 0.28, rob: o.rob || BARVE.membranaRob, rk: o.rk ?? 1.0, re: o.re ?? 2.2 } });
  }

  // Poglobi barvo: nasičenost gor, svetlost rahlo dol (pastel → barva znanstvene ilustracije).
  const hsl = {};
  function poglobi(col, moc) {
    col.getHSL(hsl);
    const s = hsl.s < 0.06 ? hsl.s : Math.min(1, hsl.s * (1 + 0.2 * moc) + 0.03 * moc);
    const l = hsl.l > 0.42 ? hsl.l - (hsl.l - 0.42) * 0.3 * moc : hsl.l * (1 - 0.03 * moc);
    return col.setHSL(hsl.h, s, l);
  }

  // Vlažen videz vseh materialov skupine. nast[idDela] (in nast["*"] za vse) = { tex: "zrna" | "gube" | "fino" | "vlakna"
  // | null (brez reliefa), rf: gostota reliefa, k: moč, b: senca v kotanjah, s: presevnost roba, lisa: barvne lise, f: gostota
  // lis, ton: 0 … 1 poglobitev barve, rough, cc, ccr, sheen, temni: zatemnitev, ao(p, n) → faktor svetlosti v oglišču }.
  // Steklene materiale (V.steklo) in ploskve prereza (userData.rez) pusti pri miru.
  function poliraj(group, deli, nast = {}) {
    const obdelane = new Set(), c = new THREE.Color(), bel = new THREE.Color(1, 1, 1);
    function obdelajGeo(g, o, m) {
      if (obdelane.has(g)) return;
      obdelane.add(g);
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
    for (const d of deli) for (const x of d.meshes) x.traverse((y) => { if (y.isMesh && y.material && !mati.has(y.material)) mati.set(y.material, d.id); });
    group.traverse((y) => { if (y.isMesh && y.material && !mati.has(y.material)) mati.set(y.material, null); });
    for (const [m, id] of mati) {
      if (!m.isMeshPhysicalMaterial || m.userData.rez || m.userData.steklo || m.userData.cv) continue;
      const o = Object.assign({}, nast["*"] || {}, (id && nast[id]) || {});
      const ton = o.ton == null ? 1 : o.ton, zn = m.side === THREE.BackSide;
      const meshes = [];
      group.traverse((y) => { if (y.isMesh && y.material === m) meshes.push(y); });
      if (!m.vertexColors) poglobi(m.color, ton);
      if (o.temni) m.color.multiplyScalar(o.temni);
      if (zn) m.color.multiplyScalar(0.88);
      m.roughness = o.rough != null ? o.rough : Math.min(0.62, Math.max(0.3, m.roughness * 0.5 + 0.24 + (zn ? 0.1 : 0)));
      m.clearcoat = o.cc != null ? o.cc : zn ? 0.3 : 0.75;
      m.clearcoatRoughness = o.ccr != null ? o.ccr : 0.1;
      m.sheen = o.sheen != null ? o.sheen : Math.max(m.sheen, 0.45);
      m.sheenRoughness = 0.42;
      const d = id && deli.find((x) => x.id === id);
      const sc = m.vertexColors ? c.set(d ? d.barva : 0xffffff) : c.copy(m.color);
      m.sheenColor = sc.clone().lerp(bel, 0.45).multiplyScalar(0.75);
      m.envMapIntensity = 1.05;
      if (o.lisa || o.ao || zn) m.vertexColors = true;
      for (const y of meshes) obdelajGeo(y.geometry, o, m);
      if (o.tex !== null) sencilo(m, { vr: VRSTE[o.tex || "zrna"], rf: o.rf || (o.tex === "fino" ? 70 : 36), k: o.k, b: o.b, s: o.s ?? (zn ? 0.06 : 0.14) });
      m.needsUpdate = true;
    }
  }

  // Sprite osvetljene kroglice (razpršena svetloba z leve zgoraj + bel odsev): točke so videti kot sijoče kroglice.
  let kroglaTex = null;
  function kroglaTeks() {
    if (kroglaTex) return kroglaTex;
    const S = 64, d = new Uint8Array(S * S * 4), L = [-0.45, 0.55, 0.7], ln = Math.hypot(...L);
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
      const x = (i + 0.5 - S / 2) / (S / 2), y = (S / 2 - j - 0.5) / (S / 2), r2 = x * x + y * y, k = (j * S + i) * 4;
      if (r2 >= 1) { d[k + 3] = 0; continue; }
      const z = Math.sqrt(1 - r2), dif = Math.max(0, (x * L[0] + y * L[1] + z * L[2]) / ln);
      const spec = Math.pow(Math.max(0, (x * -0.3 + y * 0.45 + z * 0.84)), 28) * 0.9;
      const rim = Math.pow(1 - z, 3) * 0.25;
      const v = Math.min(1, 0.32 + 0.78 * dif + rim);
      d[k] = Math.min(255, 255 * (v + spec)); d[k + 1] = Math.min(255, 255 * (v + spec)); d[k + 2] = Math.min(255, 255 * (v + spec));
      d[k + 3] = 255;
    }
    kroglaTex = new THREE.DataTexture(d, S, S, THREE.RGBAFormat);
    kroglaTex.magFilter = THREE.LinearFilter;
    kroglaTex.minFilter = THREE.LinearFilter;
    kroglaTex.needsUpdate = true;
    odpad.push(kroglaTex);
    return kroglaTex;
  }
  // Sijoče kroglice iz točk (ribosomi, zrnca, glikogen): tocke = [Vector3 | [x, y, z]], velikost v enotah modela,
  // razp = razpon svetlosti posameznih kroglic. Ne lovijo tapa (raycast izklopljen), razen ce je lovi: true.
  function pike(tocke, barva, velikost, razp = 0.3, o = {}) {
    const pos = new Float32Array(tocke.length * 3), col = new Float32Array(tocke.length * 3), b = new THREE.Color(barva), c = new THREE.Color();
    tocke.forEach((t, i) => {
      const x = t.isVector3 ? t.x : t[0], y = t.isVector3 ? t.y : t[1], z = t.isVector3 ? t.z : t[2];
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      c.copy(b).multiplyScalar(1 - razp / 2 + razp * hash(i * 0.37, 3.1, 9.7));
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const m = new THREE.PointsMaterial({ size: velikost, map: kroglaTeks(), alphaTest: 0.5, vertexColors: true, sizeAttenuation: true });
    odpad.push(m);
    const pt = new THREE.Points(g, m);
    if (!o.lovi) pt.raycast = () => {};
    else if (o.prag) { // ožji prag zadetka kot privzetih 0,02 (goste drobne točke ne prestrežejo tapa na sosednji del)
      pt.raycast = (rc, zadetki) => {
        const t = rc.params.Points.threshold;
        rc.params.Points.threshold = o.prag;
        try { THREE.Points.prototype.raycast.call(pt, rc, zadetki); } finally { rc.params.Points.threshold = t; }
      };
    }
    return pt;
  }

  // Združi geometrije (z indeksom ali brez) v eno; po želji pobarva vsako z barvo oglišč.
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

  // Sijoča vlakna (mikrotubuli, aktin, vmesni filamenti): krivulje → ena mreža tankih cevk z rahlim lastnim sijem,
  // da so vidna tudi v senci (kot v ciljnem videzu). o = { seg: odseki na krivuljo, rad: robovi prereza, sij: 0 … 1, opacity }.
  function vlakna(krivulje, r, barva, o = {}) {
    const seg = o.seg || (hi ? 28 : 14), rad = o.rad || (hi ? 5 : 3);
    const g = zdruzi(krivulje.map((k) => new THREE.TubeGeometry(k, seg, typeof r === "function" ? r() : r, rad, false)));
    const c = new THREE.Color(barva);
    const m = new THREE.MeshPhysicalMaterial({ color: c, emissive: c.clone().multiplyScalar(o.sij ?? 0.35), roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.15 });
    if (o.opacity != null && o.opacity < 1) { m.transparent = true; m.opacity = o.opacity; m.depthWrite = false; }
    m.userData.cv = { vlakna: true };
    odpad.push(m);
    return new THREE.Mesh(g, m);
  }

  // n naključnih točk na površini mreže (verjetnost po ploščini trikotnikov), v koordinatah starša mreže
  // (upošteva mesh.matrix). sito(p, n) → false zavrne točko. Vrne [{ p, n }].
  function posej(mesh, n, sito) {
    const g = mesh.geometry, p = g.attributes.position, ix = g.index, tri = ix ? ix.count / 3 : p.count / 3;
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
    const kum = new Float64Array(tri);
    let vsota = 0;
    const v = (t, k) => (ix ? ix.getX(t * 3 + k) : t * 3 + k);
    for (let t = 0; t < tri; t++) {
      a.fromBufferAttribute(p, v(t, 0)); b.fromBufferAttribute(p, v(t, 1)); c.fromBufferAttribute(p, v(t, 2));
      vsota += e1.subVectors(b, a).cross(e2.subVectors(c, a)).length() / 2;
      kum[t] = vsota;
    }
    mesh.updateMatrix();
    const M = mesh.matrix, N = new THREE.Matrix3().getNormalMatrix(M), out = [];
    for (let poskus = 0; out.length < n && poskus < n * 30; poskus++) {
      const x = rnd() * vsota;
      let lo = 0, hi2 = tri - 1;
      while (lo < hi2) { const m = (lo + hi2) >> 1; if (kum[m] < x) lo = m + 1; else hi2 = m; }
      a.fromBufferAttribute(p, v(lo, 0)); b.fromBufferAttribute(p, v(lo, 1)); c.fromBufferAttribute(p, v(lo, 2));
      let u = rnd(), w = rnd();
      if (u + w > 1) { u = 1 - u; w = 1 - w; }
      const P = a.clone().addScaledVector(e1.subVectors(b, a), u).addScaledVector(e2.subVectors(c, a), w);
      const Nn = e1.subVectors(b, a).cross(e2.subVectors(c, a)).normalize();
      P.applyMatrix4(M); Nn.applyMatrix3(N).normalize();
      if (sito && !sito(P, Nn)) continue;
      out.push({ p: P, n: Nn.clone() });
    }
    return out;
  }

  // Beljakovine na membrani: kepice (rahlo nepravilne, različno velike), postavljene na točke iz posej(), pokončno na
  // površino. r = polmer kepice; o = { visina: raztezek vzdolž normale, razp: razpon velikosti }.
  function beljakovine(tocke, barva, r, o = {}) {
    const g = new THREE.IcosahedronGeometry(r, hi ? 1 : 0);
    const p = g.attributes.position, w = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { w.fromBufferAttribute(p, i); w.multiplyScalar(1 + 0.22 * sum(w.x / r * 1.7 + 3, w.y / r * 1.7, w.z / r * 1.7)); p.setXYZ(i, w.x, w.y * (o.visina ?? 1.5), w.z); }
    g.computeVertexNormals();
    const m = new THREE.MeshPhysicalMaterial({ color: barva, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.12, sheen: 0.5, sheenColor: new THREE.Color(barva).lerp(new THREE.Color(1, 1, 1), 0.5) });
    odpad.push(m);
    const im = new THREE.InstancedMesh(g, m, tocke.length);
    const ob = new THREE.Object3D(), gor = new THREE.Vector3(0, 1, 0), c = new THREE.Color(), raz = o.razp ?? 0.5;
    tocke.forEach((t, i) => {
      ob.position.copy(t.p);
      ob.quaternion.setFromUnitVectors(gor, t.n);
      ob.rotateY(rnd() * 6.28);
      ob.scale.setScalar(1 - raz / 2 + raz * rnd());
      ob.updateMatrix();
      im.setMatrixAt(i, ob.matrix);
      const k = 0.85 + 0.3 * rnd();
      im.setColorAt(i, c.setRGB(k, k, k));
    });
    return im;
  }

  // Stikalo »Barve kot v učbeniku«: zamenja barve delov (materiali, pike točk in barva v seznamu delov) s klasičnimi
  // barvami iz BARVE_UCBENIK (+ posebne[idDela]) in nazaj. Pokliči ga na koncu zgradi(), po V.poliraj; izbira se zapomni
  // za vse celice (localStorage evklid.3d.ucbenik). Vrne element nadzora (stikalo) za nadzor[].
  function barveUcbenika(deli, posebne = {}) {
    const KLJUC = "evklid.3d.ucbenik";
    let vklop = false;
    try { vklop = globalThis.localStorage?.getItem(KLJUC) === "1"; } catch {}
    // Izvirne barve po materialu (en material je lahko v več delih) in po id-ju dela (graditelj lahko dele zgradi znova).
    // Kopija materiala za izbrani del (pregledovalnik: material.clone(), userData se kopira) kaže na izvirnik z ucbIzv.
    const izvMat = new WeakMap(), izvBarva = new Map(), poUuid = new Map(), srednja = new WeakMap(), t = new THREE.Color(), c = new THREE.Color();
    const izvirnik = (m) => {
      if (!m.userData.ucbIzv) { m.userData.ucbIzv = m.uuid; poUuid.set(m.uuid, m); }
      return poUuid.get(m.userData.ucbIzv) || m;
    };
    for (const d of deli) for (const x of d.meshes) x.traverse((o) => { if (o.material?.color && !Array.isArray(o.material)) izvirnik(o.material); });
    function povprecje(g, kljuc = g) { // povprečna barva oglišč ali primerkov (material dobi razmerje cilj / povprečje)
      if (srednja.has(kljuc)) return srednja.get(kljuc);
      const a = g.attributes.color, m = new THREE.Color(1, 1, 1);
      if (a && a.count) {
        let r = 0, gg = 0, b = 0;
        for (let i = 0; i < a.count; i++) { r += a.getX(i); gg += a.getY(i); b += a.getZ(i); }
        m.setRGB(Math.max(0.05, r / a.count), Math.max(0.05, gg / a.count), Math.max(0.05, b / a.count));
      }
      srednja.set(kljuc, m);
      return m;
    }
    function nastavi(v) {
      for (const d of deli) {
        const cilj = posebne[d.id] || BARVE_UCBENIK[d.id];
        if (!cilj) continue;
        if (!izvBarva.has(d.id)) izvBarva.set(d.id, d.barva);
        d.barva = v ? cilj : izvBarva.get(d.id);
        for (const x of d.meshes) x.traverse((o) => {
          const m0 = o.material;
          if (!m0 || !m0.color || Array.isArray(m0) || (!o.isMesh && !o.isPoints) || m0.userData.rez) return;
          const m = izvirnik(m0), kopija = m !== m0; // kopija izbranega dela: barva kot izvirnik, sij izbire ostane
          if (!izvMat.has(m)) izvMat.set(m, { color: m.color.clone(), emissive: m.emissive ? m.emissive.clone() : null });
          const iz = izvMat.get(m);
          if (!v) {
            for (const y of kopija ? [m, m0] : [m]) y.color.copy(iz.color);
            if (iz.emissive) m.emissive.copy(iz.emissive);
            return;
          }
          t.set(cilj);
          // barve oglišč in barve primerkov (InstancedMesh.instanceColor) množijo barvo materiala: cilj delimo z njunim povprečjem
          const p = new THREE.Color(1, 1, 1);
          if (m.vertexColors && o.geometry?.attributes.color) p.multiply(povprecje(o.geometry));
          if (o.isInstancedMesh && o.instanceColor) p.multiply(povprecje({ attributes: { color: o.instanceColor } }, o));
          c.setRGB(Math.min(3, t.r / p.r), Math.min(3, t.g / p.g), Math.min(3, t.b / p.b));
          if (m.userData.steklo) c.multiplyScalar(0.25);
          m.color.copy(c);
          if (kopija) m0.color.copy(c);
          if (iz.emissive && (iz.emissive.r + iz.emissive.g + iz.emissive.b) > 0.01) m.emissive.copy(t).multiplyScalar(0.18);
        });
      }
    }
    const el = {
      tip: "stikalo", id: "ucbenik", oznaka: "Barve kot v učbeniku", vrednost: vklop,
      ob(v) {
        el.vrednost = !!v;
        nastavi(el.vrednost);
        try { globalThis.localStorage?.setItem(KLJUC, el.vrednost ? "1" : "0"); } catch {}
      },
    };
    if (vklop) nastavi(true);
    return el;
  }

  // Stikalo »Podrobnosti za faks« (id `faks`, docs/3d.md »Podrobnosti za faks«). Izklopljeno pusti celico tako, kot je
  // za OŠ in SŠ; faks lekcije ga vklopijo z zacetek: { faks: true }. Vklop pokaže mreže `mreze`, doda dele `dodaj`
  // ([{ ...del, za: id dela, za katerim stoji na seznamu }]), zamenja dele `zamenjaj` ({ id: [novi deli] }, npr. citoskelet →
  // mikrotubuli, aktinski in intermediarni filamenti) in besedila `opisi` ({ id: { ime?, opis } }). Seznam `deli` se
  // spremeni na mestu (pregledovalnik ga po ob() prebere znova). ob(v) graditelja teče na koncu (vidnost, geometrija);
  // ucbenik() vrne stikalo barveUcbenika, ki po preklopu znova pobarva dele, ki so prišli ali odšli.
  function ravenFaks(deli, { mreze = [], dodaj = [], zamenjaj = {}, opisi = {}, ob = null, ucbenik = null } = {}) {
    const osnovni = deli.slice(), besedila = new Map();
    for (const d of osnovni) if (opisi[d.id]) besedila.set(d.id, { ime: d.ime, opis: d.opis });
    for (const d of [...dodaj, ...Object.values(zamenjaj).flat()]) if (opisi[d.id]) besedila.set(d.id, { ime: d.ime, opis: d.opis });
    function nastavi(v) {
      const nov = [], ids = new Set(osnovni.map((d) => d.id));
      for (const d of osnovni) {
        nov.push(...(v && zamenjaj[d.id] ? zamenjaj[d.id] : [d]));
        if (v) nov.push(...dodaj.filter((x) => x.za === d.id));
      }
      if (v) { // za drugim dodanim delom (npr. klatrinske jamice za glikokaliksom), sicer na konec
        const ostali = dodaj.filter((x) => !ids.has(x.za));
        for (let n = ostali.length; n && ostali.length; n--) {
          for (const x of [...ostali]) {
            const i = nov.findIndex((d) => d.id === x.za);
            if (i < 0) continue;
            let j = i + 1;
            while (j < nov.length && dodaj.includes(nov[j]) && nov[j].za === x.za) j++;
            nov.splice(j, 0, x);
            ostali.splice(ostali.indexOf(x), 1);
          }
        }
        nov.push(...ostali);
      }
      for (const d of nov) {
        for (const m of d.meshes) m.userData.del = d.id;
        const b = besedila.get(d.id);
        if (b) Object.assign(d, v ? { ime: opisi[d.id].ime || b.ime, opis: opisi[d.id].opis } : b);
      }
      deli.splice(0, deli.length, ...nov);
      for (const m of mreze) m.visible = v;
      ob?.(v);
      const u = ucbenik?.();
      if (u) u.ob(u.vrednost);
    }
    const el = {
      tip: "stikalo", id: "faks", oznaka: "Podrobnosti za faks", vrednost: false,
      ob(v) { el.vrednost = !!v; nastavi(el.vrednost); },
    };
    for (const m of mreze) m.visible = false;
    return el;
  }

  // Lipidni dvosloj v prerezu, narisan v senčilniku (kot pri živalski celici): glave fosfolipidov (kroglice), po dva
  // valovita repa, ponekod beljakovina čez ves dvosloj. Geometrija potrebuje atribut aRez = (s: dolžina vzdolž roba,
  // t: 0 zunaj … 1 znotraj); D = debelina v enotah modela. o = { glave, repi, beljakovina: barve (sRGB), delez: delež
  // beljakovin 0 … 1 }. Brez dodatnih trikotnikov; material ima userData.rez (poliraj ga pusti pri miru).
  function dvoslojMat(D, o = {}) {
    const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.46, clearcoat: 0.55, clearcoatRoughness: 0.18, sheen: 0.3, sheenColor: new THREE.Color(0xdcd6ff), side: THREE.DoubleSide });
    m.userData.rez = true;
    odpad.push(m);
    const Df = F(D), Cg = new THREE.Color(o.glave || "#8057e6"), Ct = new THREE.Color(o.repi || "#c7c2f2"), Cb = new THREE.Color(o.beljakovina || "#fab33d");
    const v3 = (c) => `vec3(${F(c.r)}, ${F(c.g)}, ${F(c.b)})`, Ct2 = Ct.clone().lerp(new THREE.Color(1, 1, 1), 0.7), pr = F(1 - (o.delez ?? 0.18));
    function dodaj(m) {
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec2 aRez;\nvarying vec2 vRez;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRez = aRez;");
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vRez;" + GLSL)
          .replace("#include <color_fragment>", `#include <color_fragment>
            float D = ${Df}, y = vRez.y * D, s = vRez.x, aa = max(fwidth(s), 1e-5);
            float h = 0.25 * D, xl = (fract(s / h) - 0.5) * h, ci = floor(s / h);
            float bx = s / (4.0 * h), bl = (fract(bx) - 0.5) * 4.0 * h, jeB = step(${pr}, zvH(vec3(floor(bx), 3.1, 7.7)));
            float rh = 0.115 * D, d1 = length(vec2(xl, y - 0.13 * D)), d2 = length(vec2(xl, y - 0.87 * D)), dg = min(d1, d2);
            float gl = smoothstep(rh + aa, rh - aa, dg);
            float yy = min(y, D - y), wig = 0.02 * D * sin(yy / D * 38.0 + ci * 1.7), rp = 0.0;
            for (int k = 0; k < 2; k++) {
              float xt = abs(xl - (float(k) * 2.0 - 1.0) * 0.045 * D - wig);
              rp = max(rp, smoothstep(0.021 * D + aa, 0.021 * D - aa, xt) * smoothstep(0.2 * D, 0.23 * D, yy) * smoothstep(0.49 * D, 0.46 * D, yy));
            }
            vec3 bv = mix(${v3(Ct)}, ${v3(Ct2)}, rp);
            bv = mix(bv, ${v3(Cg)} * (0.72 + 0.45 * (1.0 - dg / rh)), gl);
            float pd = length(vec2(bl / (1.75 * h), (y - 0.5 * D) / (0.55 * D))), pa = fwidth(pd), pm = jeB * smoothstep(1.0 + pa, 1.0 - pa, pd);
            bv = mix(bv, ${v3(Cb)} * (0.7 + 0.4 * (1.0 - pd)), pm);
            bv *= 1.0 - 0.4 * (1.0 - smoothstep(0.0, 0.04, min(vRez.y, 1.0 - vRez.y)));
            diffuseColor.rgb = bv;
            float zh = (gl * (1.0 - pm) * sqrt(max(0.0, 1.0 - dg * dg / (rh * rh))) * 0.5 + pm * sqrt(max(0.0, 1.0 - pd * pd)) * 0.8 + rp * 0.12) * D * 0.2;`)
          .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal = zvRelief(normal, zh, faceDirection);");
      };
      m.customProgramCacheKey = () => ["kit-dvosloj", Df, o.glave, o.repi, o.beljakovina, pr].join("|");
      m.clone = function () { const c = new this.constructor().copy(this); dodaj(c); return c; };
    }
    dodaj(m);
    return m;
  }
  // Ploskev prereza plasti med zunanjo fZ(smer) in notranjo fN(smer) na robovih odrezanega osmega dela (x < 0, y > 0,
  // z > 0) z atributom aRez za dvoslojMat. loki = [t → smer] (privzeto trije loki osmine).
  const LOKI_OSMINE = [
    (t) => new THREE.Vector3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)),
    (t) => new THREE.Vector3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0),
    (t) => new THREE.Vector3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)),
  ];
  function prerezDvosloj(fZ, fN, seg, loki = LOKI_OSMINE) {
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

  return { GLSL, vLuknji, barveUcbenika, ravenFaks, hash, sum, fbm, rnd, sencilo, steklo, poglobi, poliraj, pike, zdruzi, vlakna, posej, beljakovine, dvoslojMat, prerezDvosloj, BARVE, BARVE_UCBENIK };
}
