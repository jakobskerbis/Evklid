// Organi iz GLB (»Organi v 3D«, docs/3d.md): graditelj public/3d/modeli/organi/<ime>.js vrne ctx.organ("<ime>"), ta
// modul pa naloži public/3d/modeli/organi-3d/<ime>.json (deli, tkiva, pogledi, besedilo »Podrobnosti organa«) in
// <ime>.glb (računalnik) ali <ime>-telefon.glb (nizka kakovost). Vozlišča GLB nosijo ime objekta Z-Anatomy in dodatke
// { tkivo, del }; ob nalaganju jih združimo po (del, tkivo, stran), da je klicev risanja malo (≈ 15–40 na organ).
// Videz tkiv: MeshPhysicalMaterial z zapečeno okolico (COLOR_0), proceduralno zrnatostjo, reliefom (visoka), mehko
// presevnostjo ob robu (občutek vlažnega, živega tkiva) in lakom. Prerez: ravnine rezanja (clippingPlanes) in pokrovi
// (zadnje ploskve iste mreže v barvi reza), zato je stena polna, nikoli tanka kot papir.
// Izbira s tapom in zakritje točk gresta prek grobe kopije mreže (gručenje oglišč), ne prek 300 000 trikotnikov.
import { GLTFLoader } from "/vendor/three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from "/vendor/three/examples/jsm/utils/BufferGeometryUtils.js";
import { THREE } from "./scena.js";
import { seznamDatotek } from "./modeli.js";
import { prostorOrgana, brezPregrad } from "./organ-prostor.js";
import { barvniNacin, nastaviBarvniNacin, ucnaBarva } from "./barve.js";

const BAZA = new URL("./modeli/organi-3d/", import.meta.url).href;
const scene = new Map(); // url → Promise<THREE.Group> (surova scena glTF)
const zdruzeno = new Map(); // url → Promise<{ kosi, polmer, sredisce }>

// Splošni nalagalnik GLB za graditelje (ctx.naloziGLB): kvantizirani GLB brez meshopt (deluje tudi v lekcijah, kjer
// CSP ne dovoli WebAssembly). Vrne surovo sceno; isti naslov se naloži enkrat.
export function naloziGLB(url, napredek = null) {
  if (!scene.has(url)) {
    // Teksture prek <img> (TextureLoader): privzeti ImageBitmapLoader bere blob: s fetch, kar CSP (connect-src 'self') prepove;
    // img-src blob: je dovoljen.
    const nalagalnik = new GLTFLoader().register((parser) => {
      parser.textureLoader = new THREE.TextureLoader(parser.options.manager);
      return { name: "org-teksture" };
    });
    const p = nalagalnik.loadAsync(url, (e) => napredek?.(e.loaded, e.total || 0)).then((g) => g.scene);
    p.catch(() => scene.delete(url));
    scene.set(url, p);
  }
  return scene.get(url);
}

async function naslov(datoteka) {
  const { datoteke = {} } = await seznamDatotek();
  const d = datoteke[`organi-3d/${datoteka}`];
  return { url: `${BAZA}${datoteka}${d?.v ? `?v=${d.v}` : ""}`, bajtov: d?.b || 0 };
}

// Atribut v Float32 (kvantizirani GLB: normalizirana cela števila, raztezek v matriki vozlišča).
function vFloat(a, n, velikost) {
  const out = new Float32Array(n * velikost);
  const get = [a.getX, a.getY, a.getZ, a.getW];
  for (let i = 0; i < n; i++) for (let c = 0; c < velikost; c++) out[i * velikost + c] = c < a.itemSize ? get[c].call(a, i) : 1;
  return new THREE.BufferAttribute(out, velikost);
}
function ploskaKopija(mesh) {
  const g = mesh.geometry;
  const n = g.attributes.position.count;
  const o = new THREE.BufferGeometry();
  o.setAttribute("position", vFloat(g.attributes.position, n, 3));
  if (g.attributes.normal) o.setAttribute("normal", vFloat(g.attributes.normal, n, 3));
  if (g.attributes.color) o.setAttribute("color", vFloat(g.attributes.color, n, 3));
  else o.setAttribute("color", new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3));
  // UV zapečenih tekstur (organ brez tekstur: ničle, da se kosi lahko združijo)
  o.setAttribute("uv", g.attributes.uv ? vFloat(g.attributes.uv, n, 2) : new THREE.BufferAttribute(new Float32Array(n * 2), 2));
  // Tangente iz izvoza (MikkTSpace, enake kot pri peki normalne mape); brez njih three računa tangente iz odvodov.
  if (g.attributes.tangent) o.setAttribute("tangent", vFloat(g.attributes.tangent, n, 4));
  const idx = g.index ? g.index.array : Uint32Array.from({ length: n }, (_, i) => i);
  o.setIndex(new THREE.BufferAttribute(Uint32Array.from(idx), 1));
  mesh.updateWorldMatrix(true, false);
  o.applyMatrix4(mesh.matrixWorld);
  if (!g.attributes.normal) o.computeVertexNormals();
  // Pečena normalna mapa brez tangent v GLB (izvoz brez tangent, manjša datoteka): tangente po ogliščih iz UV (kot
  // MikkTSpace pri peki), sicer jih three računa iz odvodov in na šivih UV otokov (cevi žil) nastanejo črte (pregled #461).
  else if (!g.attributes.tangent && g.attributes.uv && mesh.material?.normalMap) o.computeTangents();
  return o;
}
const stranImena = (ime) => (/\.l$/.test(ime) ? "l" : /\.r$/.test(ime) ? "r" : "s");

// Groba kopija za žarke: oglišča v celici velikosti `c` se združijo (≈ 10× manj trikotnikov).
function groba(g, c) {
  const p = g.attributes.position.array;
  const idx = g.index.array;
  const kljuci = new Map();
  const nova = [];
  const preslikava = new Uint32Array(p.length / 3);
  for (let i = 0; i < p.length / 3; i++) {
    const k = `${Math.round(p[i * 3] / c)},${Math.round(p[i * 3 + 1] / c)},${Math.round(p[i * 3 + 2] / c)}`;
    let j = kljuci.get(k);
    if (j === undefined) {
      j = nova.length / 3;
      kljuci.set(k, j);
      nova.push(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]);
    }
    preslikava[i] = j;
  }
  const tri = [];
  for (let i = 0; i < idx.length; i += 3) {
    const a = preslikava[idx[i]], b = preslikava[idx[i + 1]], d = preslikava[idx[i + 2]];
    if (a !== b && b !== d && a !== d) tri.push(a, b, d);
  }
  const o = new THREE.BufferGeometry();
  o.setAttribute("position", new THREE.Float32BufferAttribute(nova, 3));
  o.setIndex(tri);
  o.computeBoundingSphere();
  o.computeBoundingBox();
  return o;
}

// Naloži in združi: kosi = [{ del, tkivo, stran, geo, groba, vozlisca }], vse v enotah, kjer je polmer organa 1.
function pripravi(url, napredek) {
  if (!zdruzeno.has(url)) {
    const p = naloziGLB(url, napredek).then((koren) => {
      const skupine = new Map();
      let teksture = null; // zapečene teksture (osnovna barva kot množilnik, normalna mapa), skupne vsem vozliščem
      koren.updateMatrixWorld(true);
      koren.traverse((o) => {
        if (!o.isMesh) return;
        if (!teksture && (o.material?.map || o.material?.normalMap)) {
          // PBR (peka.py): aoMap in roughnessMap sta ista slika ORM (R senca okolice, G hrapavost); map je prava
          // osnovna barva (podatki.pbr), pri starejši peki pa množilnik barve tkiva.
          teksture = {
            map: o.material.map || null,
            normalMap: o.material.normalMap || null,
            normalScale: o.material.normalScale.clone(),
            orm: o.material.aoMap || o.material.roughnessMap || null,
          };
        }
        // Ime in dodatki so na vozlišču; GLTFLoader ga pri več primitivih ovije v skupino.
        const v = o.userData?.tkivo ? o : o.parent;
        const ime = v.userData?.name || v.name || o.name; // izvirno ime (three iz imena odstrani pike)
        const tkivo = v.userData?.tkivo || "tkivo";
        const del = v.userData?.del || "";
        const k = `${del}|${tkivo}|${stranImena(ime)}`;
        if (!skupine.has(k)) skupine.set(k, { del, tkivo, stran: stranImena(ime), geos: [], vozlisca: [] });
        if (v.userData?.stik) skupine.get(k).stik = true;
        skupine.get(k).geos.push(ploskaKopija(o));
        skupine.get(k).vozlisca.push(ime);
      });
      const kosi = [...skupine.values()].map((s) => {
        const geo = s.geos.length === 1 ? s.geos[0] : mergeGeometries(s.geos, false);
        if (s.geos.length > 1) for (const g of s.geos) g.dispose();
        // deli iste žile s steno (extras »stik«): brez pregrade na stiku, sicer se v prerezu vidi črtkan drugi obroč
        const brez = s.stik && s.geos.length > 1 ? brezPregrad(geo.attributes.position.array, geo.index.array) : null;
        if (brez) geo.setIndex(new THREE.BufferAttribute(brez, 1));
        return { del: s.del, tkivo: s.tkivo, stran: s.stran, geo, vozlisca: s.vozlisca };
      });
      const box = new THREE.Box3();
      for (const k of kosi) {
        k.geo.computeBoundingBox();
        box.union(k.geo.boundingBox);
      }
      const sredisce = box.getCenter(new THREE.Vector3());
      let r2 = 0;
      for (const k of kosi) {
        const a = k.geo.attributes.position.array;
        for (let i = 0; i < a.length; i += 3) r2 = Math.max(r2, (a[i] - sredisce.x) ** 2 + (a[i + 1] - sredisce.y) ** 2 + (a[i + 2] - sredisce.z) ** 2);
      }
      const polmer = Math.sqrt(r2) || 1;
      const m = new THREE.Matrix4().makeScale(1 / polmer, 1 / polmer, 1 / polmer).multiply(new THREE.Matrix4().makeTranslation(-sredisce.x, -sredisce.y, -sredisce.z));
      for (const k of kosi) {
        k.geo.applyMatrix4(m);
        k.geo.computeBoundingSphere();
        k.groba = groba(k.geo, 0.022);
      }
      // Surova kvantizirana scena ni več potrebna (kosi so ploske kopije): sprostimo jo, da v pomnilniku ne držimo
      // vsakega organa dvakrat (teksture ostanejo v `teksture`).
      koren.traverse((o) => o.geometry?.dispose());
      scene.delete(url);
      return { kosi, polmer, sredisce, teksture };
    });
    p.catch(() => zdruzeno.delete(url));
    zdruzeno.set(url, p);
  }
  return zdruzeno.get(url);
}

// ---------- materiali ----------
const GLSL_SUM = `
float orgHash(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float orgSum(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(orgHash(i),orgHash(i+vec3(1,0,0)),f.x), mix(orgHash(i+vec3(0,1,0)),orgHash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(orgHash(i+vec3(0,0,1)),orgHash(i+vec3(1,0,1)),f.x), mix(orgHash(i+vec3(0,1,1)),orgHash(i+vec3(1,1,1)),f.x),f.y), f.z); }
`;
const fl = (x) => (Number.isInteger(x) ? `${x}.0` : String(x));
const vec3 = (c) => {
  const b = new THREE.Color(c);
  return `vec3(${fl(+b.r.toFixed(4))}, ${fl(+b.g.toFixed(4))}, ${fl(+b.b.toFixed(4))})`;
};

// Material s pomnjenim videzom tudi v kopiji (pregledovalnik ob izbiri dela material klonira in mu doda sij).
function ohraniSencilnik(m) {
  const clone = m.clone.bind(m);
  m.clone = () => {
    const c = clone();
    c.onBeforeCompile = m.onBeforeCompile;
    c.customProgramCacheKey = m.customProgramCacheKey;
    ohraniSencilnik(c);
    return c;
  };
  return m;
}

// t = nastavitve tkiva iz JSON: barva, hrap (hrapavost), lak, lakHrap, sijaj (sheen), sijajBarva, rob (presevnost ob
// robu), robBarva, ao (moč zapečene sence 0–1), aoExp (kontrast sence, privzeto 1,6), zrno (barvna zrnatost), relief, f (frekvenca šuma v enotah organa),
// lise (velike tople lise), prosojnost (1 = neprozorno), fresnel (prozorno spredaj, mlečno ob robu), dvostransko,
// znotraj (iz dela v »deli«, ne iz tkiva: cev z enojno steno, npr. aorta; vidna z obeh strani, notranjost pomnožena s tem faktorjem, brez pokrova reza in presevnosti),
// prepustnost (transmission, samo visoka), masca/mascaBarva (rumena maščoba v brazdah, kjer je zapečena senca globoka), senca/sencaBarva (topel temnejši
// odtenek v gubah, kot prekrvljeno tkivo v globini).
// Skorja iz MRI (COLOR_0.g = globina brazde 0 vrh … 1 dno, COLOR_0.b = krajevna globina, 0,5 = rob brazde): brazde/brazdeBarva (globoke brazde temnejše in bolj rdeče),
// vrh/vrhBarva (krone vijug svetlejše), lise2/lise2Barva/lise2F (drobnejše lise), zile (moč), zileBarva, zileBarva2,
// zileSirina (polovična širina v metrih), zileRaven (globina, ob kateri tečejo): tanke žilice mehke možganske ovojnice, ki
// sledijo brazdam (izočrta globine) in redke veje čez vijuge (izočrta zvitega šuma), ostre pri vsaki povečavi, brez tekstur.
// vrstni (renderOrder), brezGlobine (ne piše globine), brezIzbire (dotik gre skozi): ozadje v prerezu.
// studio (pregledovalnik: studioNaprave, ne na šibkih napravah): moker lak na svežem neprosojnem tkivu (lak ≥ 0,45, ne
// »suho«) poenoten na 0,6–0,8 s hrapavostjo 0,15–0,3 (mehki dolgi odsevi softboksov namesto ostrih belih pik), in poceni
// presevnost brez prepustnosti (transmission): maščoba v brazdah in tanki dvostranski listi (zaklopke) dobijo svetlobo
// okolja z zadnje strani (presevnost, privzeto 0,45 maščoba in 0,35 listi; 0 = brez). Pokrov reza ostane MeshBasic.
// izh: središče škatle modela v metrih GLB (mere tkiv v metrih so glede na izhodišče GLB, organ-prostor.js).
function materialTkiva(t, visoka, ravnine, tex = null, merilo = 1, studio = false, izh = [0, 0, 0]) {
  t = { ...t };
  const prosojno = (t.prosojnost ?? 1) < 1;
  const mokro = studio && !prosojno && (t.lak ?? 0) >= 0.45 && !t.suho;
  const omeji = (v, a, b) => Math.min(b, Math.max(a, v));
  const presevnoList = studio && !prosojno && t.dvostransko ? t.presevnost ?? 0.35 : 0;
  // PBR: maščoba je v pečeni barvi (t.masca se spodaj izklopi, senčilnik nima orgMas) → brez presevnosti maščobe
  const presevnoMasca = studio && t.masca && !(tex?.pbr && t.tekstura !== false) ? t.mascaPresevnost ?? 0.45 : 0;
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(t.barva || "#cccccc"),
    roughness: t.hrap ?? 0.45,
    metalness: 0,
    clearcoat: mokro ? omeji(t.lak, 0.6, 0.8) : t.lak ?? 0,
    clearcoatRoughness: mokro ? omeji(t.lakHrap ?? 0.25, 0.15, 0.3) : t.lakHrap ?? 0.25,
    // Telefon (kakovost nizka): manj sijaja; pri PBR še manj (tretjina), ker ima šibek telefon sicer skoraj enak
    // fizikalni senčilnik kot računalnik (pregled kode #461).
    sheen: visoka ? t.sijaj ?? 0 : (t.sijaj ?? 0) * (tex?.pbr ? 0.3 : 0.6),
    sheenColor: new THREE.Color(t.sijajBarva || t.barva || "#ffffff"),
    sheenRoughness: t.sijajHrap ?? 0.45,
    specularIntensity: t.spekular ?? 1,
    ior: t.ior ?? 1.4,
    vertexColors: true,
    transparent: prosojno,
    opacity: t.prosojnost ?? 1,
    depthWrite: (!prosojno || !!t.globina) && !t.brezGlobine,
    side: t.dvostransko || t.znotraj ? THREE.DoubleSide : THREE.FrontSide,
  });
  m.userData.mokro = mokro;
  if (visoka && t.prepustnost) {
    m.transmission = t.prepustnost;
    m.thickness = t.debelina ?? 0.05;
    m.transparent = false;
    m.depthWrite = true;
  }
  if (ravnine && !t.brezReza) m.clippingPlanes = ravnine.seznam;
  m.clipIntersection = !!ravnine?.presek;
  // Zapečene teksture: osnovna barva je množilnik barve tkiva (gube temnejše, žilice), normalna mapa nosi drobni relief;
  // isto mapo dobi lak (mokri odsevi sledijo gubam).
  const pbr = !!(tex?.pbr && t.tekstura !== false);
  if (tex?.map && t.tekstura !== false) m.map = tex.map;
  if (pbr) {
    // Pečena osnovna barva je prava barva tkiva: barva iz JSON je samo odtenek (privzeto bela, `odtenek`).
    m.color.set(t.odtenek || "#ffffff");
    m.userData.pbrBarva = t.odtenek || "#ffffff"; // pogledi (uporabi) ohranijo odtenek namesto barve tkiva
    if (tex.orm) {
      m.aoMap = tex.orm; // R: senca okolice (Cycles, z žarki po vsem organu)
      m.aoMapIntensity = t.aoTekstura ?? 1;
      m.roughnessMap = tex.orm; // G: hrapavost (maščoba bolj mat, endokard in zaklopke bolj sijoči)
      m.roughness = t.hrapMnozilnik ?? 1;
      // Vlažna plast (lak) sledi isti hrapavosti (three bere G): maščoba ostane mat, endokard sije; `lakHrap` je pri
      // PBR množilnik. Šibek lak z mehkejšim odsevom in zmanjšan zrcalni odboj podlage: vlažno, ne plastično.
      m.clearcoatRoughnessMap = tex.orm;
      m.clearcoatRoughness = t.lakHrap ?? 0.6;
    }
  }
  if (tex?.normalMap && t.tekstura !== false) {
    m.normalMap = tex.normalMap;
    m.normalScale.copy(tex.normalScale).multiplyScalar(t.normala ?? 1);
    // Lak z normalno mapo samo na računalniku: telefon prihrani vzorčenje in izračun druge normale (lak je tam gladek).
    if (m.clearcoat > 0 && (visoka || !pbr)) {
      m.clearcoatNormalMap = tex.normalMap;
      m.clearcoatNormalScale.copy(tex.normalScale).multiplyScalar((t.normala ?? 1) * 0.6);
    }
  }
  const f = t.f ?? 14;
  // S pečenimi teksturami so zrno, relief, lise, maščoba in senca že v slikah: senčilnik jih ne dodaja še enkrat.
  const zrno = pbr ? 0 : t.zrno ?? 0.08;
  const relief = pbr ? 0 : visoka ? t.relief ?? 0.5 : 0;
  if (pbr) t = { ...t, lise: 0, lise2: 0, masca: 0, senca: 0, aoExp: t.aoExp ?? 1.6, ao: t.aoPbr ?? 0.35 };
  // ↑ PBR: senca okolice je že v aoMap (Cycles) in v zaslonskem GTAO, zato barva oglišč COLOR_0 doda le šibko senco
  // (`aoPbr`, privzeto 0,35); `ao` tkiva (0,8–0,9) velja samo za modele brez pečenih tekstur.
  const rob = t.rob ?? 0.12;
  const ao = t.ao ?? 0.85;
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vOrgPos;\nvarying float vOrgAO;\nvarying vec2 vOrgD;")
      .replace(
        "#include <color_vertex>",
        `#include <color_vertex>
        #if defined( USE_COLOR )
          vOrgAO = pow( clamp( color.r, 0.0, 1.0 ), 0.4545 );
          vOrgD = color.gb;
        #else
          vOrgAO = 1.0;
          vOrgD = vec2( 0.0 );
        #endif`,
      )
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvOrgPos = position;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vOrgPos;\nvarying float vOrgAO;\nvarying vec2 vOrgD;\n${GLSL_SUM}`)
      .replace(
        "#include <color_fragment>",
        `float orgAO = mix( 1.0, pow( vOrgAO, ${fl(t.aoExp ?? 1.6)} ), ${fl(ao)} );
        diffuseColor.rgb *= orgAO;${t.znotraj ? ` if ( !gl_FrontFacing ) diffuseColor.rgb *= ${fl(t.znotraj)}; // notranjost cevi (žile) temnejša` : ""} // barve oglišč so podatki (R senca okolice, G globina brazde), ne množilnik barve
        float orgFw = length( fwidth( vOrgPos ) );
        float orgLod = clamp( 1.5 - orgFw * ${fl(f)} * 2.0, 0.0, 1.0 );
        float orgZ = mix( 0.5, orgSum( vOrgPos * ${fl(f)} ), orgLod ) * 0.6 + mix( 0.5, orgSum( vOrgPos * ${fl(f * 3.7)} ), clamp( 1.5 - orgFw * ${fl(f * 3.7)} * 2.0, 0.0, 1.0 ) ) * 0.4;
        diffuseColor.rgb *= 1.0 - ${fl(zrno)} * 0.5 + ${fl(zrno)} * orgZ;
        ${t.lise ? `float orgL = orgSum( vOrgPos * 2.6 + 3.1 ); diffuseColor.rgb *= mix( vec3( 1.0 ), ${vec3(t.liseBarva || "#ffd9c8")}, ${fl(t.lise)} * smoothstep( 0.35, 0.8, orgL ) );` : ""}
        ${t.lise2 ? `float orgM = orgSum( vOrgPos * ${fl(t.lise2F ?? 9)} + 9.0 ) * 0.65 + orgSum( vOrgPos * ${fl((t.lise2F ?? 9) * 2.7)} + 2.0 ) * 0.35; diffuseColor.rgb *= mix( vec3( 1.0 ), ${vec3(t.lise2Barva || "#d9b0aa")}, ${fl(t.lise2)} * smoothstep( 0.4, 0.75, orgM ) );` : ""}
        ${t.vrh ? `diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(t.vrhBarva || "#ecc9bb")} * mix( 0.8, 1.0, vOrgAO ), ${fl(t.vrh)} * smoothstep( ${fl((t.vrhMeja || [0.47, 0.3])[0])}, ${fl((t.vrhMeja || [0.47, 0.3])[1])}, vOrgD.y ) ); // krone vijug` : ""}
        ${t.brazde ? `diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(t.brazdeBarva || "#7a2228")} * mix( 0.6, 1.0, vOrgAO ), ${fl(t.brazde)} * smoothstep( ${fl((t.brazdeMeja || [0.52, 0.68])[0])}, ${fl((t.brazdeMeja || [0.52, 0.68])[1])}, vOrgD.y ) ); // globoke brazde` : ""}
        ${t.zile && !t.mreznicaZile ? zileGLSL(t, merilo) : ""}
        ${t.mreznicaZile ? mreznicaGLSL(t, merilo, izh) : ""}
        ${t.sarenica ? sarenicaGLSL(t, merilo, izh) : ""}
        float orgListi = 0.0;
        ${t.listi ? listiGLSL(t, merilo, izh) : ""}
        ${t.senca ? `diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(t.sencaBarva || "#6a1f1f")} * vOrgAO, ${fl(t.senca)} * smoothstep( 0.95, 0.35, vOrgAO ) ); // topla globina v gubah` : ""}
        ${
          t.masca
            ? `float orgLob = smoothstep( 0.35, 0.75, orgSum( vOrgPos * ${fl(t.mascaF ?? 70)} ) * 0.7 + orgSum( vOrgPos * ${fl((t.mascaF ?? 70) * 2.3)} + 5.0 ) * 0.3 ); // režnjiči maščobe
        float orgMas = ${fl(t.masca)} * smoothstep( ${fl(t.mascaMeja ?? 0.8)}, ${fl((t.mascaMeja ?? 0.8) - 0.35)}, vOrgAO ) * ( 0.75 + 0.5 * orgZ )${t.mascaZunaj ? " * smoothstep( 0.015, 0.1, vOrgD.x )" : ""};
        diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(t.mascaBarva || "#e7c46e")} * mix( 0.75, 1.0, vOrgAO ) * ( 0.86 + 0.24 * orgLob ), clamp( orgMas, 0.0, 1.0 ) ); // maščoba v brazdah (samo zunaj: mascaZunaj)`
            : ""
        }
        ${ravnine?.temnenje && !t.brezReza ? temnenjeGLSL(ravnine.temnenje, merilo, t.kljuc) : ""}`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = clamp( roughnessFactor + ( orgZ - 0.5 ) * 0.18 + ( 1.0 - vOrgAO ) * ${pbr ? "0.08" : "0.25"}, 0.04, 1.0 );`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
        ${
          relief > 0
            ? `{
          float orgH = orgZ * ${(0.012 * relief / f).toExponential(3)} - orgListi * ${((t.listiRazmik ?? 0.0025) * merilo * 0.12).toExponential(3)};
          vec3 orgDx = dFdx( -vViewPosition ); vec3 orgDy = dFdy( -vViewPosition );
          vec3 orgR1 = cross( orgDy, normal ); vec3 orgR2 = cross( normal, orgDx );
          float orgDet = dot( orgDx, orgR1 ) * faceDirection;
          vec3 orgG = sign( orgDet ) * ( dFdx( orgH ) * orgR1 + dFdy( orgH ) * orgR2 );
          normal = normalize( abs( orgDet ) * normal - orgG );
        }`
            : ""
        }`,
      )
      .replace(
        "#include <aomap_fragment>",
        `#include <aomap_fragment>
        {
          float orgNV = saturate( dot( geometryNormal, geometryViewDir ) );
          float orgAOo = mix( 1.0, vOrgAO, ${fl(t.aoOkolje ?? 1)} ); // aoOkolje 0: brez zapečene sence v okolici (enakomerna mrežnica)
          float orgSO = saturate( pow( orgNV + orgAOo, exp2( -16.0 * material.roughness - 1.0 ) ) - 1.0 + orgAOo );
          reflectedLight.indirectSpecular *= orgSO;
          reflectedLight.indirectDiffuse *= mix( 1.0, orgAOo, 0.5 );
        }`,
      )
      .replace(
        "#include <opaque_fragment>",
        `float orgFr = 1.0 - saturate( abs( dot( normalize( normal ), normalize( vViewPosition ) ) ) );
        outgoingLight += ${vec3(t.robBarva || t.barva || "#ffffff")} * ${fl(rob)} * pow( orgFr, 1.8 ) * mix( 1.0, vOrgAO, ${fl(t.aoOkolje ?? 1)} );
        ${
          presevnoList || presevnoMasca
            ? `#ifdef USE_ENVMAP
        { vec3 orgZadaj = getIBLIrradiance( -normal ) * RECIPROCAL_PI; // svetloba okolja z zadnje strani (presevnost)
          ${presevnoList ? `outgoingLight += diffuseColor.rgb * ${vec3(t.robBarva || "#fff2e8")} * ${fl(presevnoList)} * orgZadaj * mix( 0.6, 1.0, vOrgAO );` : ""}
          ${presevnoMasca ? `outgoingLight += ${vec3(t.mascaBarva || "#e7c46e")} * ${fl(presevnoMasca)} * clamp( orgMas, 0.0, 1.0 ) * ( orgZadaj * 0.7 + 0.3 * pow( orgFr, 1.5 ) );` : ""}
        }
        #endif`
            : ""
        }
        ${t.fresnel ? `diffuseColor.a = mix( diffuseColor.a, 1.0, ${fl(t.fresnel)} * pow( orgFr, 2.5 ) );` : ""}
        #include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => `org-${presevnoList}-${presevnoMasca}-${m.map ? "t" : ""}${pbr ? "p" : ""}${t.barva}-${f}-${zrno}-${relief}-${rob}-${ao}-${t.lise || 0}-${t.fresnel || 0}-${t.masca || 0}-${t.senca || 0}-${t.aoExp ?? 1.6}-${t.lise2 || 0}-${t.vrh || 0}-${t.brazde || 0}-${t.zile || 0}-${t.listi || 0}-${t.aoOkolje ?? 1}-${t.mreznicaZile ? 1 : 0}-${t.sarenica ? 1 : 0}-${t.mascaZunaj ? 1 : 0}-${t.mascaMeja ?? 0.8}-${t.znotraj || 0}`;
  return ohraniSencilnik(m);
}

// Žilice mehke možganske ovojnice (samo senčilnik, enako na telefonu in računalniku): izočrte, širina v metrih,
// gladke prek fwidth (ostre pri vsaki povečavi), pri drobnem pogledu pojenjajo, da ne migetajo.
function zileGLSL(t, merilo) {
  const hw = (t.zileSirina ?? 0.0003) * merilo;
  return `{
          vec3 zP = vOrgPos;
          float zPix = max( 0.5 * ( length( dFdx( zP ) ) + length( dFdy( zP ) ) ), 1e-7 );
          float zW = ${hw.toExponential(3)} * mix( 0.45, 1.5, orgSum( zP * 4.0 + 31.0 ) ) / zPix; // debelejša debla, tanjše veje
          float zA = clamp( zW / 0.7, 0.0, 1.0 ); zW = max( zW, 0.7 );
          float zLv = ${fl(t.zileRaven ?? 0.53)} + 0.06 * ( orgSum( zP * 5.0 + 11.0 ) - 0.5 ) + 0.03 * ( orgSum( zP * 19.0 + 5.0 ) - 0.5 );
          float zD = vOrgD.y - zLv;
          float zL1 = 1.0 - smoothstep( zW - 0.6, zW + 0.6, abs( zD ) / max( length( vec2( dFdx( zD ), dFdy( zD ) ) ), 1e-6 ) );
          float zGk = length( vec2( dFdx( vOrgD.y ), dFdy( vOrgD.y ) ) ) / zPix; // strmina krajevne globine na enoto organa
          zL1 *= smoothstep( 0.4, 0.55, orgSum( zP * 6.5 + 23.0 ) ) * smoothstep( 1.5, 4.0, zGk ); // ne na ravnih ploskvah
          vec3 zQ = zP * ${fl(t.zileF ?? 24)} + 1.7 * vec3( orgSum( zP * 6.0 ), orgSum( zP * 6.0 + 3.7 ), orgSum( zP * 6.0 + 7.1 ) );
          float zN = orgSum( zQ ) - 0.5;
          float zW2 = zW * 0.6;
          float zL2 = 1.0 - smoothstep( zW2 - 0.5, zW2 + 0.6, abs( zN ) / max( length( vec2( dFdx( zN ), dFdy( zN ) ) ), 1e-6 ) );
          zL2 *= smoothstep( 0.45, 0.62, orgSum( zP * 3.2 + 41.0 ) ) * mix( 0.45, 1.0, smoothstep( 0.42, 0.55, vOrgD.y ) ) * 0.8;
          float zL = max( zL1, zL2 ) * zA;
          vec3 zB = mix( ${vec3(t.zileBarva || "#8a1f2a")}, ${vec3(t.zileBarva2 || "#57223f")}, smoothstep( 0.35, 0.65, orgSum( zP * 2.3 + 17.0 ) ) );
          diffuseColor.rgb = mix( diffuseColor.rgb, zB * mix( 0.6, 1.0, vOrgAO ), ${fl(t.zile)} * zL );
        }`;
}

// Žile mrežnice: iz vidnega diska (papile) žarkovno proti robu, zvite s šumom, z izmenično svetlejšimi arterijami in
// temnejšimi venami, tanjše z oddaljenostjo, brez žil v rumeni pegi. mreznicaZile: { disk, sredisce, fovea } v metrih
// (glTF osi, glede na središče organa), zileSirina (polovična širina ob disku, metri), zile (moč).
function mreznicaGLSL(t, merilo, izh) {
  const z = t.mreznicaZile;
  const v3 = (a) => `vec3( ${a.map((x, i) => fl(+((x - izh[i]) * merilo).toFixed(5))).join(", ")} )`;
  const hw = (t.zileSirina ?? 0.00009) * merilo;
  return `{
          vec3 rG = ${v3(z.sredisce)};
          vec3 ra = normalize( ${v3(z.disk)} - rG );
          vec3 rf = normalize( ${v3(z.fovea)} - rG );
          vec3 rb = normalize( cross( ra, abs( ra.y ) < 0.9 ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 ) ) );
          vec3 rd = cross( ra, rb );
          vec3 rv = normalize( vOrgPos - rG );
          float rc = acos( clamp( dot( rv, ra ), -1.0, 1.0 ) );
          float rth = atan( dot( rv, rd ), dot( rv, rb ) ) / 6.2832;
          float rth2 = atan( -dot( rv, rd ), -dot( rv, rb ) ) / 6.2832; // šiv na nasprotni strani: za odvod brez skoka
          float rPix = max( 0.5 * ( length( dFdx( vOrgPos ) ) + length( dFdy( vOrgPos ) ) ), 1e-7 );
          float rWarp = ( ( orgSum( vOrgPos * 7.0 ) - 0.5 ) * 0.07 + ( orgSum( vOrgPos * 21.0 + 4.0 ) - 0.5 ) * 0.015 ) * min( rc, 0.7 );
          float rFa = acos( clamp( dot( rv, rf ), -1.0, 1.0 ) );
          // rumena pega (temnejša, rjavkasto rdeča) z jamico v sredini, vidni disk (bledo rumen, svetlejša izkopanina)
          diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(z.pegaBarva || "#a4452c")}, 0.55 * ( 1.0 - smoothstep( 0.05, 0.16, rFa ) ) + 0.25 * ( 1.0 - smoothstep( 0.0, 0.03, rFa ) ) );
          float rDk = 1.0 - smoothstep( ${fl(z.diskKot ?? 0.085)} - fwidth( rc ) - 0.01, ${fl(z.diskKot ?? 0.085)} + fwidth( rc ), rc );
          diffuseColor.rgb = mix( diffuseColor.rgb, mix( ${vec3(z.diskBarva || "#f0cf9c")}, vec3( 1.0, 0.96, 0.86 ), 1.0 - smoothstep( 0.0, 0.045, rc ) ), rDk );
          float rMask = smoothstep( 0.08, 0.12, rc ) * ( 1.0 - smoothstep( 1.6, 2.1, rc ) ) * smoothstep( 0.16, 0.34, rFa );
          float rL = 0.0; float rTip = 0.0;
          for ( int i = 0; i < 2; i++ ) {
            float n = 6.0; // 6 glavnih žil; druga skupina so veje med njimi, ki se začnejo dlje od diska
            float f = ( rth + rWarp * ( i == 0 ? 1.0 : -0.8 ) + ( i == 0 ? 0.0 : 0.5 / 6.0 ) ) * n;
            float f2 = ( rth2 + rWarp * ( i == 0 ? 1.0 : -0.8 ) ) * n;
            float g = max( min( length( vec2( dFdx( f ), dFdy( f ) ) ), length( vec2( dFdx( f2 ), dFdy( f2 ) ) ) ), 1e-6 );
            float w = ${hw.toExponential(3)} * ( i == 0 ? 1.0 : 0.55 ) * mix( 1.0, 0.35, smoothstep( 0.2, 1.9, rc ) ) / rPix;
            float a = clamp( w / 0.6, 0.0, 1.0 ); w = max( w, 0.6 );
            float l = ( 1.0 - smoothstep( w - 0.5, w + 0.6, abs( fract( f + 0.5 ) - 0.5 ) / g ) ) * a;
            if ( i == 1 ) l *= smoothstep( 0.5, 0.85, rc ) * 0.7;
            if ( l > rL ) { rL = l; rTip = mod( floor( f + 0.5 ), 2.0 ); }
          }
          rL *= rMask;
          vec3 rB = mix( ${vec3(t.zileBarva || "#a3241f")}, ${vec3(t.zileBarva2 || "#6e1418")}, rTip );
          diffuseColor.rgb = mix( diffuseColor.rgb, rB, ${fl(t.zile ?? 0.8)} * rL );
        }`;
}

// Šarenica: žarkasta vlakna (strome) okoli zenice, svetlejši venec (collarette), temnejši rob ob zenici in limbalni
// obroč. sarenica: { sredisce, os (smer naprej), polmer } v metrih; vlakna (število), barve venecBarva, robBarva.
function sarenicaGLSL(t, merilo, izh) {
  const z = t.sarenica;
  // smer: vektor smeri (brez izhodišča in merila), sicer točka v prostoru organa
  const v3 = (a, smer = false) => `vec3( ${a.map((x, i) => fl(+(smer ? x : (x - izh[i]) * merilo).toFixed(5))).join(", ")} )`;
  return `{
          vec3 iA = normalize( ${v3(z.os, true)} );
          vec3 iD = vOrgPos - ${v3(z.sredisce)}; iD -= iA * dot( iD, iA );
          float iR = length( iD ) / ${fl(+(z.polmer * merilo).toFixed(5))};
          vec3 iB = normalize( cross( iA, abs( iA.y ) < 0.9 ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 ) ) );
          float iTh = atan( dot( iD, cross( iA, iB ) ), dot( iD, iB ) ) / 6.2832;
          float iF = iTh * ${fl(z.vlakna ?? 110)} + 1.5 * orgSum( vOrgPos * 60.0 ) + 3.0 * iR;
          float iW = fwidth( iF );
          float iV = ( 0.5 + 0.5 * cos( 6.2832 * iF ) ) * ( 1.0 - smoothstep( 0.3, 0.6, iW ) );
          float iV2 = 0.5 + 0.5 * cos( 6.2832 * ( iTh * ${fl((z.vlakna ?? 110) * 0.37)} + 2.5 * orgSum( vOrgPos * 25.0 + 3.0 ) ) );
          vec3 iC = diffuseColor.rgb * ( 0.78 + 0.34 * iV * mix( 0.6, 1.0, iV2 ) );
          iC = mix( iC, ${vec3(z.venecBarva || "#b88a52")}, 0.45 * smoothstep( 0.32, 0.42, iR ) * ( 1.0 - smoothstep( 0.46, 0.6, iR ) ) * ( 0.6 + 0.4 * iV ) );
          iC *= mix( 1.0, 0.55, smoothstep( 0.82, 0.98, iR ) ); // limbalni obroč
          iC *= mix( 1.0, 0.7, 1.0 - smoothstep( 0.2, 0.3, iR ) ); // temni rob ob zenici
          diffuseColor.rgb = iC;
        }`;
}

// Lističi malih možganov (folia): plasti sploščenih elipsoidov okoli središča (široko v x in z), zato na bočni in zadnji
// ploskvi tečejo vodoravno kot vodoravna fisura, zgoraj in spodaj v krogih;
// listi = moč, listiSredisce [x, y, z] v metrih (glTF osi, glede na središče organa), listiRazmik v metrih. Žleb potemni
// barvo in je vdolbina v normali (orgListi), pri drobnem pogledu pojenja.
function listiGLSL(t, merilo, izh) {
  const c = (t.listiSredisce || [0, 0, 0]).map((x, i) => (x - izh[i]) * merilo);
  const per = (t.listiRazmik ?? 0.0025) * merilo;
  return `{
          vec3 lC = vec3( ${fl(+c[0].toFixed(5))}, ${fl(+c[1].toFixed(5))}, ${fl(+c[2].toFixed(5))} );
          float lF = length( ( vOrgPos - lC ) * vec3( 0.45, 1.0, 0.4 ) ) / ${per.toExponential(3)} + 0.35 * orgSum( vOrgPos * 18.0 );
          float lW = fwidth( lF );
          float lD = abs( fract( lF ) - 0.5 ) * 2.0; // 0 sredi lističa, 1 v žlebu
          orgListi = smoothstep( 0.68 - lW, 0.98 + lW, lD ) * ( 1.0 - smoothstep( 0.25, 0.5, lW ) );
          diffuseColor.rgb *= 1.0 - ${fl(t.listi)} * orgListi;
        }`;
}

// Globina votlin v prerezu (prerez.temnenje: { razdalja m, moc 0–1, odprtost }): ploskve dlje za ravnino reza so
// temnejše (votlina prekata ima globino kot pri pravem razrezanem srcu: rob reza svetel, dno votline v senci). Z
// `odprtost` (G barve oglišč: zunaj 1, votline 0) velja samo za notranjost votlin, zunanjost ob zasuku ostane svetla.
function temnenjeGLSL(o, merilo, tkivo) {
  return `#if NUM_CLIPPING_PLANES > 0
        { float orgGl = 1e9;
          for ( int i = 0; i < NUM_CLIPPING_PLANES; i ++ ) orgGl = min( orgGl, abs( clippingPlanes[ i ].w - dot( vClipPosition, clippingPlanes[ i ].xyz ) ) );
          float orgT = 1.0 - exp( - orgGl / ${fl(+((o.razdalja ?? 0.03) * merilo).toPrecision(4))} );
          float orgVo = ${o.odprtost ? "1.0 - smoothstep( 0.05, 0.4, vOrgD.x )" : "1.0"}; // 1 = stena votline
          ${o.endokard && (o.endokardTkiva || []).includes(tkivo) ? `diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(o.endokard)} * ( 0.75 + 0.5 * dot( diffuseColor.rgb, vec3( 0.6, 0.3, 0.1 ) ) / max( 0.05, dot( ${vec3(o.endokard)}, vec3( 0.6, 0.3, 0.1 ) ) ) * 0.5 ), ${fl(o.endokardMoc ?? 0.5)} * orgVo ); // bled sijoč endokard (pod njim rdeča mišica)` : ""}
          diffuseColor.rgb *= 1.0 - ${fl(o.moc ?? 0.6)} * orgT * orgVo; }
        #endif`;
}

// Pokrov reza (j 6. 11.: »najboljši približek pravemu srcu, razrezanemu na pol«): zadnje ploskve iste mreže, a
// osvetljene kot ravna rezna ploskev. Za vsak piksel poiščemo točko na ravnini reza vzdolž pogleda (ne zadnje ploskve, ki
// je globlje), zato vzorec vlaken leži na ravnini in se pri vrtenju ne premika; normala je normala ravnine (proti kameri),
// iz vzorca vlaken pa izbočenost (bump), da luč riše snope vlaken. Mat (hrap ~0,6) z rahlim vlažnim lakom.
// t: rez (barva), rezVlakna (gostota vlaken), rezPore/rezPoreMoc (gobasto tkivo), rezHrap, rezLak, rezRelief.
// Prostorska tekstura reza (srce: scripts/atlas/srce_ct.py volumen, tkivo scripts/atlas/vhp/tkivo.py): `vol` = { tex, meta,
// tkivo, lo, k, tkK } (lo, k, tkK v enotah modela). RGB = smer mišičnih vlaken, A = maščoba; tkivo = kocki pravega tkiva
// (Visible Woman, Courtesy of the U.S. National Library of Medicine) za miokard in maščobo, zrcaljeno ponovljeni. Vzorec je
// odvisen samo od točke v prostoru, zato je rez v vsaki ravnini enak in enako oster (čelni, bočni, prečni, prosti).
// Vlakna: šum v ravnini, pravokotni na vlakno (vzdolž vlakna stalen): rez vzdolž vlaken kaže proge, prečni rez pike.
const GLSL_VOL = `
uniform sampler2D orgVol; uniform vec3 orgVolN; uniform vec2 orgVolP; uniform vec3 orgVolLo; uniform float orgVolK;
uniform sampler2D orgTk; uniform float orgTkK;
vec4 orgVolumen( vec3 p ) {
  vec3 g = clamp( ( p - orgVolLo ) / orgVolK - 0.5, vec3( 0.0 ), orgVolN - 1.0 );
  float z0 = floor( g.z ), fz = g.z - z0, z1 = min( z0 + 1.0, orgVolN.z - 1.0 );
  vec2 pl = orgVolN.xy + 2.0, vel = orgVolP * pl, xy = g.xy + 1.5;
  vec2 a = ( vec2( mod( z0, orgVolP.x ), floor( z0 / orgVolP.x ) ) * pl + xy ) / vel;
  vec2 b = ( vec2( mod( z1, orgVolP.x ), floor( z1 / orgVolP.x ) ) * pl + xy ) / vel;
  return mix( texture2D( orgVol, a ), texture2D( orgVol, b ), fz );
}
vec3 orgTkivo( vec3 p, float blok ) {
  vec3 g = abs( fract( p / orgTkK * 0.5 ) * 2.0 - 1.0 ) * 47.0;
  float z0 = floor( g.z ), fz = g.z - z0, z1 = min( z0 + 1.0, 47.0 );
  vec2 vel = vec2( 800.0, 300.0 ), xy = g.xy + 1.5;
  vec2 a = ( vec2( mod( z0, 8.0 ) + blok * 8.0, floor( z0 / 8.0 ) ) * 50.0 + xy ) / vel;
  vec2 b = ( vec2( mod( z1, 8.0 ) + blok * 8.0, floor( z1 / 8.0 ) ) * 50.0 + xy ) / vel;
  return mix( texture2D( orgTk, a ).rgb, texture2D( orgTk, b ).rgb, fz );
}
`;

function materialPokrova(t, ravnine, merilo = 1, vol = null) {
  const n = ravnine.seznam.length;
  vol = t.rezVolumen && vol ? vol : null;
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(t.rez || t.barva || "#cccccc"),
    roughness: t.rezHrap ?? 0.62,
    metalness: 0,
    clearcoat: t.rezLak ?? 0.18,
    clearcoatRoughness: 0.45,
    side: THREE.BackSide,
    clippingPlanes: ravnine.seznam,
    clipIntersection: !!ravnine.presek,
  });
  const relief = (t.rezRelief ?? 0.00012) * merilo;
  const vlCt = t.rezVlaknaCt ?? 1400; // gostota vlaken (1/m) v teksturi CT
  const sumMoc = t.rezSum ?? 1; // moč lis in zrnatosti pokrova (srce n11: enakomeren vlažen miokard, ne »šmirgl«)
  m.onBeforeCompile = (sh) => {
    sh.uniforms.orgRav = { value: ravnine.seznam.map((p) => new THREE.Vector4(p.normal.x, p.normal.y, p.normal.z, p.constant)) };
    if (vol) {
      const v = vol.meta;
      Object.assign(sh.uniforms, {
        orgVol: { value: vol.tex }, orgVolN: { value: new THREE.Vector3(...v.n) }, orgVolP: { value: new THREE.Vector2(...v.ploscice) },
        orgVolLo: { value: new THREE.Vector3(...vol.lo) }, orgVolK: { value: vol.k }, orgTk: { value: vol.tkivo }, orgTkK: { value: vol.tkK },
      });
    }
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vOrgW;" + (vol ? "\nvarying vec3 vOrgM; varying vec3 vOrgCm;" : ""))
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvOrgW = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;" +
          (vol ? "\nvOrgM = transformed; vOrgCm = ( inverse( modelMatrix ) * vec4( cameraPosition, 1.0 ) ).xyz;" : ""),
      );
    const pars = `#include <common>\nvarying vec3 vOrgW;\nuniform mat4 projectionMatrix;\nuniform vec4 orgRav[ ${n} ];\nvec3 orgQ; vec3 orgNw; float orgH;\n${GLSL_SUM}${
      vol ? `\nvarying vec3 vOrgM; varying vec3 vOrgCm; vec3 orgQm; vec4 orgV4;\n${GLSL_VOL}` : ""
    }`;
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", pars)
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
        { // najbližja ravnina in točka na njej vzdolž pogleda
          float orgDm = 1e9; vec4 orgP = orgRav[ 0 ];
          for ( int i = 0; i < ${n}; i ++ ) { float dd = abs( dot( orgRav[ i ].xyz, vOrgW ) + orgRav[ i ].w ); if ( dd < orgDm ) { orgDm = dd; orgP = orgRav[ i ]; } }
          vec3 orgS = vOrgW - cameraPosition;
          float orgDen = dot( orgP.xyz, orgS );
          float orgT = abs( orgDen ) > 1e-6 ? clamp( - ( dot( orgP.xyz, cameraPosition ) + orgP.w ) / orgDen, 0.0, 1.0 ) : 1.0;
          orgQ = cameraPosition + orgS * orgT;
          orgNw = - orgP.xyz;
${
            vol
              ? `
          orgQm = vOrgCm + ( vOrgM - vOrgCm ) * orgT; // ista točka v enotah modela (afina preslikava ohrani razmerje)
          orgV4 = orgVolumen( orgQm );
          #ifndef USE_LOGDEPTHBUF
          // Točka ravnine je v steni (|vlakno| > 0,5) ali v maščobi (A > 0,15; n11: »luske maščobe zunaj obrisa« – maščoba
          // brez vlaken je bila narisana na globini zadnje ploskve): pokrov na globini ravnine, zato so žile v maščobi
          // in dno papilarnih mišic za ravnino skriti (kot pri pravem rezu). Sicer (votlina; A ≈ 1 = venčna žila v maščobi,
          // katere prerez nariše njen pokrov) ostane globina zadnje ploskve.
          { vec4 orgC = projectionMatrix * viewMatrix * vec4( orgQ, 1.0 );
            gl_FragDepth = ( length( orgV4.rgb * 2.0 - 1.0 ) > 0.5 || orgV4.a > 0.15 ) && orgV4.a < 0.8 ? clamp( ( orgC.z / orgC.w ) * 0.5 + 0.5, 0.0, 1.0 ) : gl_FragCoord.z; }
          #endif`
              : ""
          }
          // vlakna: snopi, ki menjajo smer (zvito polje), prekinjeni; drobna vlakna od blizu; lise krvi in vezivnih pretinov
          vec3 orgSm = normalize( vec3( 0.4, 1.0, 0.25 ) + 0.9 * ( vec3( orgSum( orgQ * 3.1 ), orgSum( orgQ * 3.1 + 7.0 ), orgSum( orgQ * 3.1 + 13.0 ) ) - 0.5 ) );
          float orgV = 0.5 + 0.5 * sin( dot( orgQ, orgSm ) * ${fl(t.rezVlakna || 0)} + 9.0 * orgSum( orgQ * 22.0 ) + 3.0 * orgSum( orgQ * 90.0 ) );
          float orgV2 = 0.5 + 0.5 * sin( dot( orgQ, orgSm ) * ${fl((t.rezVlakna || 0) * 3.3)} + 5.0 * orgSum( orgQ * 160.0 ) );
          float orgFw = length( fwidth( orgQ ) );
          float orgLod = clamp( 2.0 - orgFw * ${fl(t.rezVlakna || 1)}, 0.0, 1.0 ), orgLod2 = clamp( 2.0 - orgFw * ${fl((t.rezVlakna || 1) * 3.3)}, 0.0, 1.0 ); // ožje od ~4 px zbledi (brez moiréja)
          orgH = ${t.rezVlakna ? "mix( 0.5, orgV, orgLod ) * 0.7 + mix( 0.5, orgV2, orgLod2 ) * 0.3" : "0.5"};
        }`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        diffuseColor.rgb *= 1.0 - ${fl(0.12 * sumMoc)} + ${fl(0.24 * sumMoc)} * orgSum( orgQ * 60.0 ) * orgSum( orgQ * 13.0 );
        diffuseColor.rgb *= 1.0 - ${fl(0.09 * sumMoc)} * ( orgSum( orgQ * 7.0 ) - 0.5 ) * 2.0; // večje lise (prekrvavitev)
        ${t.rezVlakna && !vol ? "diffuseColor.rgb *= 0.9 + 0.2 * orgH;" : ""}${
          vol && t.rezRavna
            ? "" // učne barve: enobarven pokrov (globina ravnine ostane)
            : vol
            ? `
        { // pravo tkivo (Visible Woman) in smer vlaken iz CT: miokard rdeče rjav z vlakni, maščoba rumena z režnjiči
          vec3 orgF = orgV4.rgb * 2.0 - 1.0; float orgFl = length( orgF ); orgF = orgFl > 0.2 ? orgF / orgFl : vec3( 0.0, 1.0, 0.0 );
          vec3 orgPq = orgQm - orgF * dot( orgQm, orgF );
          float orgFw2 = length( fwidth( orgQm ) );
          float orgS1 = orgSum( orgPq * ${fl(+(vlCt / merilo).toPrecision(4))} ), orgS2 = orgSum( orgPq * ${fl(+((vlCt * 3.2) / merilo).toPrecision(4))} );
          float orgL1 = clamp( 2.0 - orgFw2 * ${fl(+((vlCt * 3) / merilo).toPrecision(4))}, 0.0, 1.0 ), orgL2 = clamp( 2.0 - orgFw2 * ${fl(+((vlCt * 9.6) / merilo).toPrecision(4))}, 0.0, 1.0 );
          float orgVl = mix( 0.5, orgS1, orgL1 ) * 0.6 + mix( 0.5, orgS2, orgL2 ) * 0.4;
          vec3 orgMi = ${vec3(t.rez || "#7a2a20")} * mix( vec3( 1.0 ), orgTkivo( orgQm, 0.0 ) / ${vec3(t.rezTkivoMio || "#5d3125")}, ${fl(t.rezTkivoMoc ?? 1)} );
          vec3 orgMaT = orgTkivo( orgQm, 1.0 );
          vec3 orgMa = ${vec3(t.rezMasca || "#d8b060")} * orgMaT / ${vec3(t.rezTkivoMasca || "#af9361")};
          orgMi *= ${fl(1 - 0.14 * (t.rezVlaknaMoc ?? 1))} + ${fl(0.28 * (t.rezVlaknaMoc ?? 1))} * orgVl;
          float orgFa = smoothstep( 0.17, 0.37, orgV4.a ); // A: maščoba 0–0,6, venčna žila 1
          diffuseColor.rgb = mix( orgMi, orgMa, orgFa );
          orgH = mix( orgVl, clamp( orgMaT.g / ${fl(+(new THREE.Color(t.rezTkivoMasca || "#af9361").g).toPrecision(4))} * 0.5, 0.0, 1.0 ), orgFa );
        }`
            : ""
        }${
          t.rezPore
            ? `\n { float orgPw = length( fwidth( orgQ ) ) * 2.0; // pore (pljučna goba): temne luknjice in svetli pretini; manjše od ~2 px zbledijo (brez migetanja)
 float orgPo = mix( 0.5, orgSum( orgQ * ${fl(t.rezPore)} ), clamp( 1.5 - orgPw * ${fl(t.rezPore)}, 0.0, 1.0 ) ) * 0.65 + mix( 0.5, orgSum( orgQ * ${fl(t.rezPore * 2.3)} ), clamp( 1.5 - orgPw * ${fl(t.rezPore * 2.3)}, 0.0, 1.0 ) ) * 0.35;
 diffuseColor.rgb *= 1.0 - ${fl(t.rezPoreMoc ?? 0.4)} * smoothstep( 0.52, 0.66, orgPo ) + 0.12 * ( 1.0 - smoothstep( 0.2, 0.4, orgPo ) ); orgH = mix( orgH, 1.0 - orgPo, 0.7 ); }`
            : ""
        }`,
      )
      .replace(
        "#include <normal_fragment_begin>",
        `#include <normal_fragment_begin>
        { // ravna rezna ploskev: normala ravnine (v prostoru pogleda, proti kameri) + izbočenost vlaken
          vec3 orgN = normalize( ( viewMatrix * vec4( orgNw, 0.0 ) ).xyz );
          if ( dot( orgN, vViewPosition ) < 0.0 ) orgN = - orgN;
          vec3 orgQv = ( viewMatrix * vec4( orgQ, 1.0 ) ).xyz;
          vec3 orgDx = dFdx( orgQv ), orgDy = dFdy( orgQv );
          vec3 orgR1 = cross( orgDy, orgN ), orgR2 = cross( orgN, orgDx );
          float orgDet = dot( orgDx, orgR1 );
          float orgHh = orgH * ${relief.toExponential(3)};
          vec3 orgG = sign( orgDet ) * ( dFdx( orgHh ) * orgR1 + dFdy( orgHh ) * orgR2 );
          normal = abs( orgDet ) > 1e-12 ? normalize( abs( orgDet ) * orgN - orgG ) : orgN;
          nonPerturbedNormal = orgN;
        }`,
      );
  };
  m.customProgramCacheKey = () => `org-pokrov2-${t.rez || t.barva}-${t.rezVlakna || 0}-${t.rezPore || 0}-${t.rezPoreMoc ?? ""}-${n}-${relief}-${vol ? `v${t.rezMasca || ""}${vlCt}${t.rezRavna ? "r" : ""}${t.rezTkivoMoc ?? ""}${t.rezVlaknaMoc ?? ""}` : ""}-${sumMoc}`;
  return m;
}

// Privzeta točka dela: zunanje oglišče blizu premice iz središča organa skozi središče dela.
function privzetaTocka(kosi) {
  const s = new THREE.Vector3();
  let n = 0;
  for (const k of kosi) {
    const a = k.geo.attributes.position.array;
    for (let i = 0; i < a.length; i += 3 * 7) {
      s.x += a[i];
      s.y += a[i + 1];
      s.z += a[i + 2];
      n++;
    }
  }
  if (!n) return [0, 0, 0];
  s.divideScalar(n);
  const d = s.lengthSq() > 1e-6 ? s.clone().normalize() : new THREE.Vector3(0, 0, 1);
  let naj = null;
  let najV = -Infinity;
  const v = new THREE.Vector3();
  for (const k of kosi) {
    const a = k.geo.attributes.position.array;
    for (let i = 0; i < a.length; i += 3 * 3) {
      v.set(a[i], a[i + 1], a[i + 2]);
      const vzd = v.dot(d);
      const pravo = v.clone().addScaledVector(d, -vzd).length();
      const ocena = vzd - 1.5 * pravo;
      if (ocena > najV) {
        najV = ocena;
        naj = v.clone();
      }
    }
  }
  return naj ? naj.toArray().map((x) => +x.toFixed(4)) : s.toArray();
}

// ---------- graditelj ----------
// ctx: { kakovost, gibanje, napredek(delež) } iz pregledovalnika. Vrne model po pogodbi (docs/3d.md) z dodatki
// postavitev: "organ" in podrobnosti: { naslov, odseki: [{ naslov, besedilo }] }.
export async function zgradiOrgan(ime, ctx = {}) {
  const visoka = ctx.kakovost === "visoka";
  const studio = !!ctx.studio && !!ctx.okolje;
  const okolje = studio ? ctx.okolje("studio").catch(() => null) : null; // HDRI se nalaga hkrati z modelom
  const podatki = await fetch(`${BAZA}${ime}.json`).then((r) => {
    if (!r.ok) throw new Error(`${ime}.json: ${r.status}`);
    return r.json();
  });
  let vir = await naslov(`${ime}${visoka ? "" : "-telefon"}.glb`);
  let pripravljeno;
  const napredek = (b, skupaj) => ctx.napredek?.(Math.min(1, b / (skupaj || vir.bajtov || b * 2)));
  try {
    pripravljeno = await pripravi(vir.url, napredek);
  } catch (err) {
    if (!visoka) throw err;
    vir = await naslov(`${ime}-telefon.glb`); // podrobnega ni: telefonski model
    pripravljeno = await pripravi(vir.url, napredek);
  }
  await okolje; // brez preskoka sobe → studio po prvem prikazu
  const { kosi, polmer, sredisce } = pripravljeno;
  // Metri organa (koordinate GLB) → enote modela: model je prestavljen v središče svoje škatle (organ-prostor.js).
  const prostor = prostorOrgana(sredisce, polmer);
  // prostorska tekstura reza (podatki.prerez.volumen): smer vlaken in maščoba + kocki pravega tkiva (Visible Woman, NLM)
  const pv = podatki.prerez?.volumen;
  let vol = null;
  if (pv) {
    // Ne čakamo: teksturi reza (≈ 0,8 MB) se naložita v ozadju po GLB, prvi prikaz (celota) je zato hitrejši (telefon
    // 4G: ocena n9 4,8 s). Do naložitve vzorčenje vrne 0 (pokrov kot brez stene, nekaj sto ms, samo če je prerez že vklopljen).
    const nalozi = (ime, srgb = false) => {
      const tx = new THREE.TextureLoader().load(`${BAZA}${ime}`, undefined, undefined, (e) => console.warn("organ: prostorska tekstura reza ni naložena", e));
      tx.flipY = false;
      tx.generateMipmaps = false;
      tx.minFilter = THREE.LinearFilter;
      tx.magFilter = THREE.LinearFilter;
      tx.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; // tkivo: fotografija (linearne vrednosti kot barve iz JSON)
      return tx;
    };
    const s0 = prostor.s;
    vol = { tex: nalozi(pv.slika), tkivo: nalozi(pv.tkivo || `${ime}-tkivo.png`, true), meta: pv, lo: prostor.tocka(pv.lo), k: pv.korak * s0, tkK: (pv.tkivoMera ?? 0.016) * s0 };
  }
  const teksture = pripravljeno.teksture ? { ...pripravljeno.teksture, pbr: !!podatki.pbr } : null;
  if (teksture?.orm) teksture.orm.channel = 0; // aoMap bere isti UV kot ostale mape (three privzeto: uv1 za aoMap v starejših)
  const s = prostor.s; // metri organa → enote modela
  const group = new THREE.Group();
  group.name = ime;
  group.userData.merilo = s; // metri organa → enote modela (preizkusi: merilne črte, posnetki-organa.cjs MERE=1)
  // Luči organa (poleg studijske svetlobe kompleta): topla glavna luč za ostre vlažne odseve in zadnja luč za obris.
  for (const l of podatki.luci || [{ smer: [0.5, 1, 0.8], moc: 1.1, barva: "#fff1e6" }, { smer: [-0.7, 0.4, -1], moc: 0.6, barva: "#ffd8d0" }]) {
    const d = new THREE.DirectionalLight(new THREE.Color(l.barva || "#ffffff"), (l.moc ?? 1) * (visoka ? 1 : 1.1));
    d.position.set(...l.smer).normalize().multiplyScalar(5);
    group.add(d);
  }

  // Ravnine prereza (v enotah organa v metrih; pretvorimo v enote modela). Skupina ostane v izhodišču brez vrtenja.
  const prerez = podatki.prerez || null;
  const ravnine = prerez?.ravnine
    ? {
        seznam: prerez.ravnine.map((r) => {
          const p = prostor.ravnina(r.n, r.d || 0);
          return new THREE.Plane(new THREE.Vector3(...p.n), p.d);
        }),
        presek: !!prerez.presek,
        temnenje: prerez.temnenje || null,
      }
    : null;
  const brezRavnin = { seznam: [], presek: false };
  if (ravnine) ravnine.prazno = [];

  const materiali = new Map();
  const pokrovi = new Map();
  const ucni = new Map(); // id dela → { mat, pokrov }: »Učne barve« (barve.js)
  // Del z »znotraj« (žila z enojno steno, npr. aorta) dobi svoj material tkiva: venčne žile istega tkiva so zaprte cevi.
  const znotrajDela = new Map((podatki.deli || []).filter((d) => d.znotraj).map((d) => [d.id, d.znotraj]));
  const mat = (tkivo, del) => {
    const zn = znotrajDela.get(del);
    const kljuc = zn ? `${tkivo}#z` : tkivo;
    if (!materiali.has(kljuc)) materiali.set(kljuc, materialTkiva({ ...(podatki.tkiva?.[tkivo] || {}), kljuc: tkivo, ...(zn ? { znotraj: zn } : {}) }, visoka, ravnine || brezRavnin, teksture, s, studio, prostor.sredisce));
    return materiali.get(kljuc);
  };
  const proxyMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const meshi = [];
  for (const k of kosi) {
    const tk = podatki.tkiva?.[k.tkivo] || {};
    const mesh = new THREE.Mesh(k.geo, mat(k.tkivo, k.del));
    mesh.renderOrder = tk.vrstni ?? 0;
    mesh.name = `${k.del}|${k.tkivo}|${k.stran}`;
    mesh.userData = { del: k.del, tkivo: k.tkivo, stran: k.stran };
    const proxy = new THREE.Mesh(k.groba, proxyMat);
    // Žarki: groba kopija, brez skritih mrež in brez odrezanega dela v prerezu.
    mesh.raycast = function (rc, zadetki) {
      if (tk.brezIzbire) return;
      for (let x = this; x; x = x.parent) if (!x.visible) return;
      // Skoraj prozorna tkiva (roženica, steklovina) ne zakrivajo točk in se ne izbirajo z dotikom (dotik gre skozi).
      if (this.material.transparent && this.material.opacity < 0.15) return;
      proxy.matrixWorld.copy(this.matrixWorld);
      const tmp = [];
      THREE.Mesh.prototype.raycast.call(proxy, rc, tmp);
      const rav = this.material.clippingPlanes || [];
      for (const h of tmp) {
        if (rav.length) {
          const zunaj = rav.map((p) => p.distanceToPoint(h.point) < 0);
          if (this.material.clipIntersection ? zunaj.every(Boolean) : zunaj.some(Boolean)) continue;
        }
        h.object = this;
        zadetki.push(h);
      }
    };
    group.add(mesh);
    meshi.push(mesh);
    const t = podatki.tkiva?.[k.tkivo] || {};
    // brez pokrova reza: notranje strukture, ki se sekajo s steno (trabekule, papilarne mišice …), sicer drobir na rezu
    if (ravnine && !t.brezReza && !t.dvostransko && !znotrajDela.has(k.del) && (t.prosojnost ?? 1) >= 1 && !(prerez.brezPokrova || []).includes(k.del)) {
      if (!pokrovi.has(k.tkivo)) pokrovi.set(k.tkivo, materialPokrova(t, ravnine, s, vol));
      const p = new THREE.Mesh(k.geo, pokrovi.get(k.tkivo));
      p.raycast = () => {};
      p.renderOrder = tk.vrstni ? tk.vrstni - 0.5 : -1; // pokrov pred svojo mrežo (in za ozadjem z manjšim vrstnim redom)
      p.userData = { pokrov: true, tkivo: k.tkivo, stran: k.stran, del: k.del };
      mesh.add(p);
    }
  }

  // Pogledi: celota in prerez (ali polovica). Vsak ima smer kamere, skrite strani/tkiva in točke (≤ 6).
  const pogledi = podatki.pogledi || { celota: {} };
  let pogled = "celota";
  const vPrerezu = () => pogled !== "celota";
  function uporabi() {
    const p = pogledi[pogled] || {};
    const skrijStran = p.skrijStran || null;
    const skrijTkiva = new Set(p.skrijTkiva || []);
    const skrijDele = new Set(p.skrijDele || []);
    const rezi = vPrerezu() && !!ravnine && p.rez !== false;
    for (const m of meshi) {
      m.visible = m.userData.stran !== skrijStran && !skrijTkiva.has(m.userData.tkivo) && !skrijDele.has(m.userData.del);
      for (const c of m.children) c.visible = rezi;
    }
    // Nastavitve tkiv za ta pogled (npr. temna zenica: žilnica dvostransko in temnejša, leča skrita).
    const nast = p.tkiva || {};
    for (const [kljuc, mm] of materiali) {
      const tk = kljuc.replace(/#z$/, "");
      const t = podatki.tkiva?.[tk] || {};
      const o = nast[tk] || {};
      mm.color.set(o.barva || mm.userData.pbrBarva || t.barva || "#cccccc");
      if (o.svetlost) mm.color.multiplyScalar(o.svetlost); // npr. prerez: svetlejši vlažen endokard v votlinah (pravo srce)
      mm.userData.osnova ||= { sheen: mm.sheen, clearcoat: mm.clearcoat };
      mm.sheen = o.sijaj ?? mm.userData.osnova.sheen;
      mm.clearcoat = o.lak ?? mm.userData.osnova.clearcoat;
      const op = o.prosojnost ?? t.prosojnost ?? 1;
      const side = o.dvostransko ?? (t.dvostransko || kljuc !== tk) ? THREE.DoubleSide : THREE.FrontSide;
      if (mm.opacity !== op || mm.side !== side) {
        if (!mm.transmission) mm.transparent = op < 1;
        mm.opacity = op;
        mm.side = side;
        mm.needsUpdate = true;
      }
    }
    if (ravnine) {
      for (const mm of [...materiali.values(), ...[...ucni.values()].flatMap((u) => [u.mat, u.pokrov])]) {
        if (!mm.clippingPlanes?.length && !mm.userData.rezan) continue;
        mm.userData.rezan = true;
        mm.clippingPlanes = rezi ? ravnine.seznam : [];
        mm.needsUpdate = true;
      }
    }
    // Pregledovalnik pri izbiri klonira material: kopije sledijo prerezu prek tega poslušalca.
    ctx.prerez?.(rezi);
  }

  // Deli: vsak del iz JSON z mrežami, ki jih ima ta model; točka iz JSON ali privzeta.
  // Skupina (»skupina« v delu): skupni del (npr. venčne arterije) obsega tudi mreže svojih posameznih delov (LAD, …),
  // zato ga OŠ izbere kot celoto (tap), SŠ in študij pa vsako žilo posebej; vsi deli so na vseh ravneh v seznamu.
  const otroci = new Map();
  for (const d of podatki.deli || []) if (d.skupina) otroci.set(d.skupina, [...(otroci.get(d.skupina) || []), d.id]);
  const vsiDeli = (podatki.deli || [])
    .map((d) => {
      const ids = new Set([d.id, ...(otroci.get(d.id) || [])]);
      const moje = meshi.filter((m) => ids.has(m.userData.del));
      if (!moje.length) return null;
      const privzeta = d.tocka ? prostor.tocka(d.tocka) : privzetaTocka(kosi.filter((k) => ids.has(k.del)));
      return { d, moje, privzeta };
    })
    .filter(Boolean);
  const tockaZa = (x) => {
    const t = x.d.tocke?.[pogled];
    return t ? prostor.tocka(t) : x.privzeta;
  };
  let deliPogleda = [];
  // Barvni način (barve.js): učne barve zamenjajo material vsake mreže z enobarvnim po delu (relief normalne mape
  // ostane), pokrov reza dobi temnejšo barvo dela; naravne vrnejo pečene materiale tkiv.
  const poId = new Map((podatki.deli || []).map((d) => [d.id, d]));
  const imaUcne = (podatki.deli || []).length > 1;
  let ucne = false;
  const ucniZa = (id, tkivo) => {
    const kljuc = `${id}|${tkivo}`;
    if (!ucni.has(kljuc)) {
      const c = new THREE.Color(ucnaBarva(poId.get(id), poId));
      const rezi = vPrerezu() && !!ravnine;
      const mat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0, normalMap: teksture?.normalMap || null, clippingPlanes: rezi ? ravnine.seznam : [] });
      if (teksture?.normalScale) mat.normalScale.copy(teksture.normalScale).multiplyScalar(0.6);
      mat.userData.rezan = !!ravnine;
      // Stene s prostorsko teksturo reza (srce): pokrov na globini ravnine kot v naravnih barvah, sicer bi notranji deli
      // (prevodni sistem, dno papilarnih mišic, venčne veje) v pretinu silili skozi rez kot raznobarvni drobci (ocena n9).
      const tk = podatki.tkiva?.[tkivo] || {};
      const pokrov =
        ravnine && vol && tk.rezVolumen
          ? materialPokrova({ ...tk, rez: `#${c.clone().multiplyScalar(0.62).getHexString()}`, rezVlakna: 0, rezRavna: true }, ravnine, s, vol)
          : new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(0.62), side: THREE.BackSide, clippingPlanes: ravnine ? ravnine.seznam : [], clipIntersection: !!ravnine?.presek });
      ucni.set(kljuc, { mat, pokrov });
    }
    return ucni.get(kljuc);
  };
  function barve(n) {
    ucne = imaUcne && n === "ucne";
    for (const m of meshi) {
      const u = ucne ? ucniZa(m.userData.del, m.userData.tkivo) : null;
      m.material = u ? u.mat : mat(m.userData.tkivo, m.userData.del);
      for (const c of m.children) if (c.userData.pokrov) c.material = u ? u.pokrov : pokrovi.get(m.userData.tkivo);
    }
    if (ravnine) uporabi();
  }
  const sestavi = () => {
    const p = pogledi[pogled] || {};
    const tocke = new Set(p.tocke || []);
    deliPogleda = vsiDeli
      .filter((x) => x.moje.some((m) => m.visible))
      .map((x) => ({
        id: x.d.id,
        ime: x.d.ime,
        la: x.d.la,
        sinonimi: x.d.sinonimi, // skupine.js delPoImenu (»mitralna zaklopka« → Jadrasti zaklopki)
        opis: x.d.opis,
        barva: (ucne ? ucnaBarva(x.d, poId) : x.d.barva) || "#6E9BFF",
        meshes: x.moje.filter((m) => m.visible),
        tocka: tockaZa(x),
        skrijTocko: !tocke.has(x.d.id),
        povecava: x.d.povecava, // id modela za »Poglej pod povečavo« (npr. mrežnica → organ-mreznica)
        opisOs: x.d.opisOs, // razlaga po ravni (raven.js): OŠ preprosto, študij podrobneje
        opisStudij: x.d.opisStudij,
        skupina: x.d.skupina,
      }));
  };
  uporabi();
  barve(barvniNacin(ctx.raven === 1 ? "ucne" : "naravne"));
  sestavi();

  const nadzor = [];
  if (imaUcne) {
    nadzor.push({
      tip: "stikalo",
      id: "ucne-barve",
      oznaka: ctx.t?.("a3.teachColors") || "Učne barve",
      vrednost: ucne,
      ob: (v) => {
        barve(nastaviBarvniNacin(v ? "ucne" : "naravne"));
        sestavi();
      },
    });
  }
  if (pogledi.prerez) {
    nadzor.push({
      tip: "stikalo",
      id: "prerez",
      oznaka: ctx.t?.(podatki.prerezOznaka || "a3.cut") || "Prerez",
      vrednost: false,
      ponastaviPogled: true,
      ob: (v) => {
        pogled = v ? "prerez" : "celota";
        uporabi();
        sestavi();
      },
    });
  }

  const smer = (p) => (pogledi[p]?.pogled || [0.35, 0.3, 1]).slice();
  // Okvir pogleda: središče (metri organa) in polmer (1 = cel organ), npr. zrklo brez mišic večje in na sredini.
  const okvir = (p) => {
    const o = pogledi[p]?.okvir || podatki.okvir || {};
    // brez središča v JSON: središče škatle modela (izhodišče enot modela); vse v metrih GLB (organ-prostor.js)
    let c = (o.sredisce || prostor.sredisce).slice();
    // Prerez z eno ravnino: središče kadra na ravnini reza, da merilo (na globini cilja) velja za rezno ploskev. Prej je
    // bilo srce 3,5 cm pred rezom in stena na sliki ~20 % tanjša od merila (ocena srca n9: »LV 5–7 mm«).
    const rv = prerez?.ravnine;
    if (p !== "celota" && !pogledi[p]?.okvir?.sredisce && rv?.length === 1 && !prerez.presek) {
      const n = new THREE.Vector3(...rv[0].n).normalize();
      const k = n.dot(new THREE.Vector3(...c)) + (rv[0].d || 0) / new THREE.Vector3(...rv[0].n).length();
      c = c.map((x, i) => x - n.getComponent(i) * k);
    }
    return { sredisce: prostor.tocka(c), polmer: o.polmer ?? 1 };
  };
  return {
    group,
    get deli() {
      return deliPogleda;
    },
    nadzor,
    postavitev: "organ",
    okolje: studio ? "studio" : undefined,
    podrobnosti: podatki.podrobnosti || null,
    merilo: { m: 2 * polmer, oznaka: "" },
    mere: podatki.mere || null, // legenda s pravimi merami (pregledovalnik)
    pogled: () => smer(pogled),
    okvir: () => okvir(pogled),
    ao: () => !vPrerezu() || !ravnine,
    vozlisca: kosi.flatMap((k) => k.vozlisca),
    dispose() {
      for (const m of materiali.values()) m.dispose();
      for (const m of pokrovi.values()) m.dispose();
      if (vol) (vol.tex.dispose(), vol.tkivo.dispose());
      for (const u of ucni.values()) (u.mat.dispose(), u.pokrov.dispose());
      proxyMat.dispose();
      // Geometrija ostane v predpomnilniku (»Ponastavi« zgradi znova brez prenosa).
    },
  };
}
