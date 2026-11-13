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
import { presekMreze } from "./organ-presek.js";
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
        // obsegi indeksov posameznih vozlišč v združeni mreži (pravi presek reza se računa za vsako zaprto telo posebej)
        let zac = 0;
        let obsegi = s.geos.map((g) => [(zac += g.index.count) - g.index.count, g.index.count]); // [začetek, število]
        // tangente ima vsa skupina ali nobena mreža (mešano: mergeGeometries vrne null)
        if (s.geos.some((g) => g.attributes.tangent) && !s.geos.every((g) => g.attributes.tangent)) for (const g of s.geos) g.deleteAttribute("tangent");
        const geo = s.geos.length === 1 ? s.geos[0] : mergeGeometries(s.geos, false);
        if (s.geos.length > 1) for (const g of s.geos) g.dispose();
        // deli iste žile s steno (extras »stik«): brez pregrade na stiku, sicer se v prerezu vidi črtkan drugi obroč
        const brez = s.stik && s.geos.length > 1 ? brezPregrad(geo.attributes.position.array, geo.index.array) : null;
        if (brez) (geo.setIndex(new THREE.BufferAttribute(brez, 1)), (obsegi = null));
        return { del: s.del, tkivo: s.tkivo, stran: s.stran, geo, vozlisca: s.vozlisca, obsegi };
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
// Celični šum (Worley): x = razdalja do najbližjega jedra, y = do drugega (y − x = 0 na steni med celicama), z = naključno
// število celice. Za režnjiče (jetra, pljuča), pljučno gobo in ledvična telesca; samo v senčilnikih, ki ga uporabijo.
const GLSL_CEL = `
vec3 orgH3(vec3 p){ p = vec3(dot(p,vec3(127.1,311.7,74.7)), dot(p,vec3(269.5,183.3,246.1)), dot(p,vec3(113.5,271.9,124.6))); return fract(sin(p)*43758.5453); }
vec3 orgCel(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); float d1 = 8.0; float d2 = 8.0; float id = 0.0;
  for(int a=-1;a<=1;a++) for(int b=-1;b<=1;b++) for(int c=-1;c<=1;c++){ vec3 g = vec3(float(a),float(b),float(c)); vec3 o = orgH3(i+g); vec3 r = g + o - f; float d = dot(r,r);
    if(d<d1){ d2 = d1; d1 = d; id = o.x; } else if(d<d2){ d2 = d; } }
  return vec3(sqrt(d1), sqrt(d2), id); }
`;
// Plasti celičnega vzorca (tkivo.celice na površini, tkivo.rezCelice na pokrovu reza; predmet ali seznam): mera (velikost
// celice v metrih), moc/stena/sirina (stene med celicami: vezivni pretini režnjičev, stene mešičkov), jedroMoc/jedro/jedroR
// (pika sredi celice: centralna vena, zračni prostor, ledvično telesce), ton (vsaka celica malo svetlejša ali temnejša),
// zvitost (nepravilne oblike), relief (površina: stene vdolbene, metri) oziroma vdolbina (pokrov: jedra vdolbena 0–1),
// samoVisoka (plast samo na računalniku). Vzorec, ožji od ~3 pikslov, zbledi (brez migetanja).
function celiceGLSL(plasti, merilo, P, visoka, visina) {
  return []
    .concat(plasti || [])
    .filter((c) => visoka || !c.samoVisoka)
    .map((c, i) => {
      const k = 1 / ((c.mera ?? 0.001) * merilo);
      const r = c.jedroR ?? 0.3;
      return `{
          vec3 cX = ${P} * ${fl(+k.toPrecision(5))} + ${fl(i * 7.3)};
          float cLod = clamp( 1.7 - length( fwidth( cX ) ) * 2.4, 0.0, 1.0 );
          if ( cLod > 0.0 ) {
            ${c.zvitost ? `cX += ${fl(c.zvitost)} * ( vec3( orgSum( cX * 1.9 ), orgSum( cX * 1.9 + 5.2 ), orgSum( cX * 1.9 + 9.7 ) ) - 0.5 );` : ""}
            vec3 cC = orgCel( cX );
            float cRob = ( 1.0 - smoothstep( 0.0, ${fl(c.sirina ?? 0.12)}, cC.y - cC.x ) ) * cLod;
            float cJed = ( 1.0 - smoothstep( ${fl(r * 0.45)}, ${fl(r)}, cC.x ) ) * cLod;
            diffuseColor.rgb *= 1.0 + ${fl(c.ton ?? 0)} * ( cC.z - 0.5 ) * cLod;
            ${c.moc ? `diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(c.stena || "#ffffff")}, ${fl(c.moc)} * cRob );` : ""}
            ${c.jedroMoc ? `diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(c.jedro || "#000000")}, ${fl(c.jedroMoc)} * cJed );` : ""}
            ${visina(c, "cRob", "cJed", "cLod")}
          }
        }`;
    })
    .join("\n");
}

const fl = (x) => (Number.isInteger(x) ? `${x}.0` : String(x));
const vec3 = (c) => {
  const b = new THREE.Color(c);
  return `vec3(${fl(+b.r.toFixed(4))}, ${fl(+b.g.toFixed(4))}, ${fl(+b.b.toFixed(4))})`;
};

// zamik (tkivo ali pogled, krog 10): globinski zamik notranje plasti, ki se tik pod površino dotika zunanje (žilnica
// pod beločnico na poenostavljeni mreži telefona: črne pikice v beločnici); zunanja plast tam zmaga v testu globine.
function zamakni(m, z) {
  m.polygonOffset = z > 0;
  m.polygonOffsetFactor = z;
  m.polygonOffsetUnits = z;
}

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
// zileSirina (polovična širina v metrih), zileRaven (globina, ob kateri tečejo), zileMaska (frekvenca zaplat z vejami čez vijuge; majhen organ, npr. beločnica: večja): tanke žilice mehke možganske ovojnice, ki
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
  // zrcalo (prozorna tkiva, roženica): odsev okolja in luči ni pomnožen s prosojnostjo (prej je bila roženica pri
  // prosojnosti 0,04 nevidna, brez bleščice: »luknja« namesto kupole); mešanje s predzmnoženo alfo
  if (prosojno && t.zrcalo) {
    m.blending = THREE.CustomBlending;
    m.blendSrc = THREE.OneFactor;
    m.blendDst = THREE.OneMinusSrcAlphaFactor;
    m.blendSrcAlpha = THREE.OneFactor;
    m.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;
  }
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
  // mapa: false (samo PBR): tkivo brez pečene osnovne barve (barva iz JSON kot pri modelih brez tekstur), pečena senca
  // okolice, hrapavost in normalna mapa ostanejo. Za tkiva, kjer je pečena barva enobarvna ali slabo berljiva (žile).
  const brezMape = pbr && t.mapa === false;
  if (tex?.map && t.tekstura !== false && !brezMape) m.map = tex.map;
  if (pbr) {
    // Pečena osnovna barva je prava barva tkiva: barva iz JSON je samo odtenek (privzeto bela, `odtenek`).
    const osnova = brezMape ? t.barva || "#cccccc" : t.odtenek || "#ffffff";
    m.color.set(osnova);
    m.userData.pbrBarva = osnova; // pogledi (uporabi) ohranijo odtenek namesto barve tkiva
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
  // detajl: true (samo PBR): pečene mape tega organa so gladke (enobarvne, ravna normalna mapa), zato proceduralni
  // zrno, relief, lise in senca ostanejo tudi ob teksturah (možgani, pljuča, ledvica, jetra, oko).
  const det = pbr && !!t.detajl;
  const zrno = pbr && !det ? 0 : t.zrno ?? 0.08;
  const relief = pbr && !det ? 0 : visoka ? t.relief ?? 0.5 : 0;
  if (pbr) t = { ...t, ...(det ? {} : { lise: 0, lise2: 0, masca: 0, senca: 0 }), aoExp: t.aoExp ?? 1.6, ao: t.aoPbr ?? 0.35 };
  const celice = celiceGLSL(t.celice, merilo, "vOrgPos", visoka, (c, rob) => (c.relief ? `orgCelH += ${rob} * ${((c.relief ?? 0) * merilo).toExponential(3)};` : ""));
  // ↑ PBR: senca okolice je že v aoMap (Cycles) in v zaslonskem GTAO, zato barva oglišč COLOR_0 doda le šibko senco
  // (`aoPbr`, privzeto 0,35); `ao` tkiva (0,8–0,9) velja samo za modele brez pečenih tekstur.
  const rob = t.rob ?? 0.12;
  const ao = t.ao ?? 0.85;
  m.onBeforeCompile = (sh) => {
    if (t.foto) sh.uniforms.orgFoto = { value: fotoSlika(t.foto.slika) };
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
      .replace("#include <common>", `#include <common>\nvarying vec3 vOrgPos;\nvarying float vOrgAO;\nvarying vec2 vOrgD;\n${t.foto ? "uniform sampler2D orgFoto;\n" : ""}${GLSL_SUM}${celice || t.konec ? GLSL_CEL : ""}`)
      .replace(
        "#include <color_fragment>",
        `${t.kita ? kitaGLSL(t.kita) : "float orgKita = 0.0;"}
        float orgAO = mix( 1.0, pow( vOrgAO, ${fl(t.aoExp ?? 1.6)} ), ${fl(ao)} * ( 1.0 - ${fl(t.kita?.aoMoc ?? 0)} * orgKita ) ); // kita.aoMoc: brez temnega obrisa ob robu kite
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
        ${t.foto ? fotoGLSL(t, merilo, izh) : ""}
        ${t.limbus ? limbusGLSL(t, merilo, izh, "barva") : ""}
        ${t.konec ? konecGLSL(t, merilo, izh) : ""}
        float orgListi = 0.0;
        float orgCelH = 0.0;
        ${celice}
        ${t.listi ? listiGLSL(t, merilo, izh) : ""}
        ${t.senca ? `diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(t.sencaBarva || "#6a1f1f")} * vOrgAO, ${fl(t.senca)} * smoothstep( 0.95, 0.35, vOrgAO )${t.kita?.aoMoc ? ` * ( 1.0 - orgKita )` : ""} ); // topla globina v gubah` : ""}
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
        roughnessFactor = clamp( roughnessFactor + ( orgZ - 0.5 ) * 0.18 + ( 1.0 - vOrgAO ) * ${pbr ? "0.08" : "0.25"}, 0.04, 1.0 );${
          t.kita ? `\n        roughnessFactor = mix( roughnessFactor, ${fl(t.kita.hrap ?? 0.32)}, orgKita );` : ""
        }`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
        ${
          relief > 0
            ? `{
          float orgH = orgZ * ${(0.012 * relief / f).toExponential(3)} - orgListi * ${((t.listiRazmik ?? 0.0025) * merilo * 0.12).toExponential(3)} - orgCelH;
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
        `#include <aomap_fragment>${t.kita ? `\n        #ifdef USE_CLEARCOAT\n        material.clearcoat *= 1.0 - ${fl(1 - (t.kita.lak ?? 0.5))} * orgKita;\n        #endif` : ""}
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
        outgoingLight += ${t.kita ? `mix( ${vec3(t.robBarva || t.barva || "#ffffff")} * ${fl(rob)}, ${vec3(t.kita.robBarva || "#ffffff")} * ${fl(t.kita.rob ?? 0.1)}, orgKita )` : `${vec3(t.robBarva || t.barva || "#ffffff")} * ${fl(rob)}`} * pow( orgFr, 1.8 ) * mix( 1.0, vOrgAO, ${fl(t.aoOkolje ?? 1)} );
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
        ${t.limbus ? limbusGLSL(t, merilo, izh, "alfa") : ""}
        ${prosojno && t.zrcalo ? "outgoingLight -= totalDiffuse * ( 1.0 - diffuseColor.a ); // zrcalo: razpršeno × alfa, odsev cel (predzmnožena alfa)" : ""}
        #include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => `org-${presevnoList}-${presevnoMasca}-${m.map ? "t" : ""}${pbr ? "p" : ""}${t.barva}-${f}-${zrno}-${relief}-${rob}-${ao}-${t.lise || 0}-${t.fresnel || 0}-${t.masca || 0}-${t.senca || 0}-${t.aoExp ?? 1.6}-${t.lise2 || 0}-${t.vrh || 0}-${t.brazde || 0}-${t.zile || 0}${t.zile ? `/${t.zileMaska ?? ""}/${t.zileF ?? ""}/${t.zileSirina ?? ""}/${t.zileBarva || ""}` : ""}-${t.listi || 0}-${t.aoOkolje ?? 1}-${t.mreznicaZile ? 1 : 0}-${t.sarenica ? 1 : 0}-${t.mascaZunaj ? 1 : 0}-${t.mascaMeja ?? 0.8}-${t.znotraj || 0}${t.zrcalo ? "-zr" : ""}${t.kita ? `-ki${JSON.stringify(t.kita)}` : ""}${t.limbus ? `-l${JSON.stringify(t.limbus)}` : ""}${t.foto ? `-fo${JSON.stringify(t.foto)}` : ""}${t.konec ? `-k${JSON.stringify(t.konec)}` : ""}${celice ? `-c${JSON.stringify(t.celice)}/${merilo}/${izh.join(",")}` : ""}${ravnine?.temnenje && !t.brezReza ? `-t${JSON.stringify(ravnine.temnenje)}/${t.kljuc || ""}` : ""}`;
  return ohraniSencilnik(m);
}

// kita (tkivo mišice, krog 10): kita ob narastišču je v pečeni barvi bela (recept »kita«, atribut KITA). Ista snov kot
// mišica (lak, rob, hrapavost) jo je risala kot sivkasto sijočo ploščo z rožnatim robom ob beločnici. Delež kite iz
// nasičenosti teksture (bela kita malo, rdeča mišica zelo nasičena: meja [s0, s1]) prevzame barvo, hrapavost, lak in
// rob beločnice, zato se pero kite zlije z beločnico. { barva, hrap, lak (delež laka mišice), rob, robBarva, meja, moc }
function kitaGLSL(k) {
  const [s0, s1] = k.meja || [0.3, 0.55];
  return `float orgKita = 0.0;
        { vec3 kC = diffuseColor.rgb; float kMx = max( max( kC.r, kC.g ), kC.b ); float kMn = min( min( kC.r, kC.g ), kC.b );
          orgKita = ${fl(k.moc ?? 1)} * ( 1.0 - smoothstep( ${fl(s0)}, ${fl(s1)}, ( kMx - kMn ) / max( kMx, 1e-4 ) ) ) * smoothstep( 0.04, 0.16, kMx );
          float kL = dot( kC, vec3( 0.2126, 0.7152, 0.0722 ) );
          diffuseColor.rgb = mix( kC, ${vec3(k.barva || "#efe9e1")} * clamp( kL / ${fl(k.svetlost ?? 0.6)}, 0.85, 1.08 ), orgKita ); }`;
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
          zL2 *= smoothstep( 0.45, 0.62, orgSum( zP * ${fl(t.zileMaska ?? 3.2)} + 41.0 ) ) * mix( 0.45, 1.0, smoothstep( 0.42, 0.55, vOrgD.y ) ) * 0.8;
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
          { // krog 10 (ocena: »redke žile, ne obkrožajo rumene pege«): žilne arkade. Kot okoli diska se v smeri pege
            // razmakne (B: največ na razdalji pege), zato se žile, ki izstopijo proti pegi, v loku ognejo makuli.
            float thF = atan( dot( rf, rd ), dot( rf, rb ) ) / 6.2832; float rcF = acos( clamp( dot( rf, ra ), -1.0, 1.0 ) );
            float dth = fract( rth - thF + 0.5 ) - 0.5;
            float rB = ${fl(z.arkade ?? 0.65)} * exp( - pow( ( rc - rcF ) / ( 0.75 * rcF ), 2.0 ) ) * smoothstep( 0.05, 0.4 * rcF, rc ) * ( 1.0 - smoothstep( 0.1, 0.24, abs( dth ) ) );
            rth -= dth * rB; rth2 -= dth * rB;
          }
          // rumena pega (temnejša, rjavkasto rdeča) z jamico v sredini, vidni disk (bledo rumen, svetlejša izkopanina)
          diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(z.pegaBarva || "#a4452c")}, 0.55 * ( 1.0 - smoothstep( 0.05, 0.16, rFa ) ) + 0.25 * ( 1.0 - smoothstep( 0.0, 0.03, rFa ) ) );
          float rDk = 1.0 - smoothstep( ${fl(z.diskKot ?? 0.085)} - fwidth( rc ) - 0.01, ${fl(z.diskKot ?? 0.085)} + fwidth( rc ), rc );
          diffuseColor.rgb = mix( diffuseColor.rgb, mix( ${vec3(z.diskBarva || "#f0cf9c")}, vec3( 1.0, 0.96, 0.86 ), 1.0 - smoothstep( 0.0, 0.045, rc ) ), rDk );
          float rMask = smoothstep( 0.08, 0.12, rc ) * ( 1.0 - smoothstep( 1.6, 2.1, rc ) ) * smoothstep( 0.16, 0.34, rFa );
          float rL = 0.0; float rTip = 0.0;
          for ( int i = 0; i < 2; i++ ) {
            float n = ${fl(z.zil ?? 6)}; // glavne žile; druga skupina so veje med njimi, ki se začnejo dlje od diska
            float f = ( rth + rWarp * ( i == 0 ? 1.0 : -0.8 ) + ( i == 0 ? 0.0 : 0.5 / n ) ) * n;
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

// Limbus roženice (tkivo.limbus { sredisce, os, r0, r1 (m), barva, moc }): obod roženice od r0 do r1 postopno
// neprosojen v barvi prehoda v beločnico (sivkasto bel obroč), znotraj r0 prozorna kupola. del: "barva" | "alfa".
function limbusGLSL(t, merilo, izh, del) {
  const z = t.limbus;
  const v3 = (a, smer = false) => `vec3( ${a.map((x, i) => fl(+(smer ? x : (x - izh[i]) * merilo).toFixed(5))).join(", ")} )`;
  const r = `{ vec3 lA = normalize( ${v3(z.os, true)} ); vec3 lD = vOrgPos - ${v3(z.sredisce)}; lD -= lA * dot( lD, lA );
          float lT = smoothstep( ${fl(+(z.r0 * merilo).toFixed(6))}, ${fl(+(z.r1 * merilo).toFixed(6))}, length( lD ) ); lT *= lT;`;
  return del === "barva"
    ? `${r} diffuseColor.rgb = mix( diffuseColor.rgb, ${z.barva2 ? `mix( ${vec3(z.barva || "#e6e3dd")}, ${vec3(z.barva2)}, smoothstep( 0.45, 1.0, lT ) )` : vec3(z.barva || "#e6e3dd")}, lT ); }`
    : `${r} diffuseColor.a = mix( diffuseColor.a, ${fl(z.moc ?? 0.9)}, lT ); }`;
}

// Prerezan konec živca (tkivo.konec { sredisce, os, polmer } v metrih, oko-dodelava.mjs): na ravnem pokrovu konca
// ovojnice (trda ovojnica, pajčevnica, mehka ovojnica) kot obroči in snopiči živčnih vlaken z vezivnimi pretini. Brez
// osrednje arterije in vene mrežnice (krog 11): ti vstopita v živec ≈ 10 mm za zrklom, konec pri vidnem kanalu ju nima.
function konecGLSL(t, merilo, izh) {
  const z = t.konec;
  const v3 = (a, smer = false) => `vec3( ${a.map((x, i) => fl(+(smer ? x : (x - izh[i]) * merilo).toFixed(5))).join(", ")} )`;
  const R = fl(+(z.polmer * merilo).toFixed(6));
  return `{
          vec3 kA = normalize( ${v3(z.os, true)} ); vec3 kD = vOrgPos - ${v3(z.sredisce)};
          float ka = dot( kD, kA ); vec3 kR = kD - kA * ka; float kr = length( kR ) / ${R};
          if ( abs( ka ) < ${fl(+(0.00006 * merilo).toFixed(7))} && kr < 0.999 ) {
            float kw = max( fwidth( kr ), 1e-4 );
            vec3 cX = kR / ${fl(+(0.00042 * merilo).toFixed(6))};
            cX += 0.35 * vec3( orgSum( cX * 0.7 ), orgSum( cX * 0.7 + 3.0 ), 0.0 );
            vec3 ce = orgCel( cX );
            float kL = clamp( 1.6 - length( fwidth( cX ) ) * 2.0, 0.0, 1.0 );
            float sept = ( 1.0 - smoothstep( 0.0, 0.14, ce.y - ce.x ) ) * kL;
            vec3 kc = mix( vec3( 0.86, 0.82, 0.72 ), vec3( 0.93, 0.90, 0.82 ), mix( 0.5, ce.z, kL ) );
            kc = mix( kc, vec3( 0.98, 0.96, 0.92 ), 0.75 * sept );
            float pia = smoothstep( 0.76 - kw, 0.76 + kw, kr ), arach = smoothstep( 0.80 - kw, 0.80 + kw, kr ) * ( 1.0 - smoothstep( 0.86 - kw, 0.86 + kw, kr ) ), dura = smoothstep( 0.86 - kw, 0.86 + kw, kr );
            kc = mix( kc, vec3( 0.95, 0.91, 0.86 ), pia );
            kc = mix( kc, vec3( 0.72, 0.58, 0.52 ), arach );
            kc = mix( kc, vec3( 0.91, 0.88, 0.83 ) * ( 0.94 + 0.12 * orgSum( vOrgPos * ${fl(+(1 / (0.0002 * merilo)).toPrecision(4))} ) ), dura );
            diffuseColor.rgb = kc;
          }
        }`;
}

// Fotografska tekstura, projicirana na tkivo (tkivo.foto, samo naravne barve): slika čelnega pogleda (oko: šarenica in
// žilice beločnice iz »Realistic Human Eye«, Alexander Antipov, CC BY 4.0, gl. viri.json). foto: { slika (datoteka v
// organi-3d/), sredisce, os (smer naprej), uvSredisce [u, v] (v od spodaj), moc }, in
//  - nacin "disk" (šarenica): ravninska projekcija vzdolž osi; `polmer` (m) ustreza `uvPolmer` (delež širine slike);
//  - nacin "krogla" (beločnica): kot od osi okoli `sredisce` (središče zrkla) kot0..kot1 (rad) ustreza uvPolmeru uv0..uv1,
//    zadnjih `pojenja` rad slika pojenja v barvo tkiva.
// zasuk (rad) zavrti sliko okoli osi; odtenek [r, g, b] pomnoži barvo slike.
const fotoSlike = new Map();
function fotoSlika(ime) {
  if (!fotoSlike.has(ime)) {
    const tx = new THREE.TextureLoader().load(`${BAZA}${ime}`, undefined, undefined, (e) => console.warn("organ: fotografska tekstura ni naložena", e));
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.anisotropy = 4;
    fotoSlike.set(ime, tx);
  }
  return fotoSlike.get(ime);
}
function fotoGLSL(t, merilo, izh) {
  const z = t.foto;
  const v3 = (a, smer = false) => `vec3( ${a.map((x, i) => fl(+(smer ? x : (x - izh[i]) * merilo).toFixed(5))).join(", ")} )`;
  const uv = z.uvSredisce || [0.5, 0.5], od = z.odtenek || [1, 1, 1], zas = z.zasuk ?? 0;
  const osnova = `vec3 fA = normalize( ${v3(z.os, true)} ); vec3 fP = vOrgPos - ${v3(z.sredisce)};
          vec3 fB = normalize( cross( abs( fA.y ) < 0.9 ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 ), fA ) ); vec3 fC = cross( fA, fB );
          vec3 fD = fP - fA * dot( fP, fA ); vec2 fS = vec2( dot( fD, fB ), dot( fD, fC ) );
          fS = mat2( ${fl(+Math.cos(zas).toFixed(5))}, ${fl(+Math.sin(zas).toFixed(5))}, ${fl(+(-Math.sin(zas)).toFixed(5))}, ${fl(+Math.cos(zas).toFixed(5))} ) * fS;`;
  const konec = `vec3 fT = texture2D( orgFoto, vec2( ${fl(uv[0])}, ${fl(uv[1])} ) + fUv ).rgb * vec3( ${od.map(fl).join(", ")} );
          diffuseColor.rgb = mix( diffuseColor.rgb, fT, fW );`;
  if (z.nacin === "krogla")
    return `{ ${osnova}
          float fK = acos( clamp( dot( normalize( fP ), fA ), -1.0, 1.0 ) );
          float fR = mix( ${fl(z.uv0)}, ${fl(z.uv1)}, ( fK - ${fl(z.kot0)} ) / ${fl(+(z.kot1 - z.kot0).toFixed(5))} );
          vec2 fUv = normalize( fS + 1e-9 ) * fR;
          float fW = ${fl(z.moc ?? 1)} * ( 1.0 - smoothstep( ${fl(+(z.kot1 - (z.pojenja ?? 0.3)).toFixed(5))}, ${fl(z.kot1)}, fK ) );
          ${konec} }`;
  return `{ ${osnova}
          vec2 fUv = fS * ${fl(+(z.uvPolmer / (z.polmer * merilo)).toPrecision(6))};
          float fW = ${fl(z.moc ?? 1)};
          ${konec} }`;
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
          // medialna ploskev polobel ob sredini (vidna v prerezu ob črvu): lupine elipsoidov jo sekajo skoraj vzporedno,
          // zato so bile tam goste vodoravne proge kot stopnice (ocena r5) – tam lističi pojenjajo
          vec3 lN = normalize( cross( dFdx( vOrgPos ), dFdy( vOrgPos ) ) );
          orgListi *= 1.0 - smoothstep( 0.3, 0.6, abs( lN.x ) ) * ( 1.0 - smoothstep( ${fl(+(0.018 * merilo).toPrecision(4))}, ${fl(+(0.03 * merilo).toPrecision(4))}, abs( vOrgPos.x - lC.x ) ) );
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
const CELICA_VLAKEN = 0.006; // m: celica s stalno smerjo vlaken na pokrovu reza (materialPokrova)
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

// Delež stene (R) in drugih polnih teles s pokrovom, npr. venčnih žil (G), iz mreže: rezine kot pri orgVolumen (svoja
// mreža vokslov, lahko gostejša).
const GLSL_STENA = `
uniform sampler2D orgSt; uniform vec3 orgStN; uniform vec2 orgStP; uniform vec3 orgStLo; uniform float orgStK;
vec4 orgSt3;
vec4 orgStena( vec3 p ) {
  vec3 g = clamp( ( p - orgStLo ) / orgStK - 0.5, vec3( 0.0 ), orgStN - 1.0 );
  float z0 = floor( g.z ), fz = g.z - z0, z1 = min( z0 + 1.0, orgStN.z - 1.0 );
  vec2 pl = orgStN.xy + 2.0, vel = orgStP * pl, xy = g.xy + 1.5;
  vec2 a = ( vec2( mod( z0, orgStP.x ), floor( z0 / orgStP.x ) ) * pl + xy ) / vel;
  vec2 b = ( vec2( mod( z1, orgStP.x ), floor( z1 / orgStP.x ) ) * pl + xy ) / vel;
  return mix( texture2D( orgSt, a ), texture2D( orgSt, b ), fz );
}
`;

// rezCelice (plasti celičnega vzorca, glej celiceGLSL): jetrni režnjiči, pljučna goba, ledvična telesca v skorji.
// rezZarki { sredisce [m], sredisce2 [m] (neobvezno: os od sredisce do sredisce2 namesto točke), visina (relief prog 0–1), gostota, moc, barva, notranja, notranjaMoc, r0, r1 [m] }: žarkaste proge iz središča (ledvične
// piramide: zbiralca tečejo proti papili v ledvičnem sinusu) in svetlejša notranja sredica bliže središču (r0 → r1).
// izh: središče škatle modela v metrih GLB (kot pri materialTkiva).
// rezPiramide { seznam: [[vrh x, y, z, os x, y, z, dolžina, tangens polkota, polmer vrha] …] (metri GLB), barva (zunanja
// sredica), notranja (notranja sredica proti papili), proge, gostota, moc, val (valovitost obrisa, m), zile (ločne žile ob
// osnovi 0–1), sinus { kapsule: [[a x, y, z, b x, y, z, r] …] (m), barva, pretini, zile, mera, zileMera } }: ledvične piramide kot stožci v prostoru
// (rez v ravnini je njihov pravi presek) na ploskvi skorje; med njimi ostanejo ledvični stebri. sinus: maščoba ledvičnega
// sinusa in hilusa (unija kapsul okoli daljic a–b) s prerezanimi vejami žil; del in osnovaDel: dela za učne barve. Brez teh nastavitev se pokrov ne spremeni.
// presek (pravi presek, rezPresek): { robBarva, luknjaBarva (barvi obrobe in zapolnjenih lukenj; atribut orgVr), slika:
// { uniform, c0, lo, mera, U, V } (naslikana rezna ploskev, tkivo.rezSlika: RGB barva, A moč) }.
function materialPokrova(t, ravnine, merilo = 1, vol = null, izh = [0, 0, 0], presek = null) {
  const n = ravnine.seznam.length;
  vol = t.rezVolumen && vol ? vol : null;
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(t.rez || t.barva || "#cccccc"),
    roughness: t.rezHrap ?? 0.62,
    metalness: 0,
    clearcoat: t.rezLak ?? 0.18,
    clearcoatRoughness: t.rezLakHrap ?? 0.45,
    sheen: t.rezSijaj ?? 0,
    sheenColor: new THREE.Color(t.rezSijajBarva || "#ffffff"),
    sheenRoughness: 0.5,
    specularIntensity: t.rezSpekular ?? 1,
    side: THREE.BackSide,
    clippingPlanes: ravnine.seznam,
    clipIntersection: !!ravnine.presek,
  });
  // kamera v prostoru modela: nastavi jo mreža pokrova pred risanjem (kameraModela), ne senčilnik za vsako oglišče
  if (vol) m.orgKamera = { value: new THREE.Vector3() };
  const relief = (t.rezRelief ?? 0.00012) * merilo;
  const vlCt = t.rezVlaknaCt ?? 1400; // gostota vlaken (1/m) v teksturi CT
  const rezCelice = celiceGLSL(t.rezCelice, merilo, "orgQ", true, (c, rob, jed, lod) => (c.vdolbina ? `orgH = mix( orgH, 1.0 - ${jed}, ${fl(c.vdolbina)} * ${lod} );` : ""));
  const zarki = t.rezZarki || null;
  const pir = t.rezPiramide?.seznam?.length ? t.rezPiramide : null;
  const tm = (p) => p.map((x, i) => fl(+((x - izh[i]) * merilo).toFixed(5))).join(", "); // točka v metrih GLB → enote modela
  const dm = (x) => fl(+(x * merilo).toPrecision(5)); // dolžina v metrih → enote modela
  const dm2 = (k) => fl(+(k / merilo).toPrecision(5)); // prostorska frekvenca (1/m) → 1/enoto modela
  const vr = !!presek && !!(presek.robBarva || presek.luknjaBarva);
  const sl = presek?.slika || null;
  const sumMoc = t.rezSum ?? 1; // moč lis in zrnatosti pokrova (srce n11: enakomeren vlažen miokard, ne »šmirgl«)
  // vol.stena (prerez.volumen.stena, scripts/atlas/rez-stena.mjs): delež voksla v polni steni, izračunan iz končne
  // mreže (ne iz CT). Rob pokrova se zato ujema z obrisom mreže; prej je bil stopničast, kjer se mreža (endokard,
  // premaknjen v votlino, relief maščobe) in tekstura CT nista ujemali (»luske« ob robu reza).
  const st = vol?.stena || null;
  // rezPlasti (tkivo, krog 8): plasti stene v milimetrih iz predznačene razdalje (stena.sdf, rez-stena.mjs); namesto rezEndokard
  const pl = st?.sdf && t.rezPlasti ? t.rezPlasti : null;
  // rezZamik (krog 11): pokrov tkiva pred sosednjim pokrovom (negativno: vidni živec čez kanal beločnice)
  if (t.rezZamik) { m.polygonOffset = true; m.polygonOffsetFactor = t.rezZamik; m.polygonOffsetUnits = t.rezZamik; }
  m.onBeforeCompile = (sh) => {
    sh.uniforms.orgRav = { value: ravnine.seznam.map((p) => new THREE.Vector4(p.normal.x, p.normal.y, p.normal.z, p.constant)) };
    if (vol) {
      const v = vol.meta;
      Object.assign(sh.uniforms, {
        orgVol: { value: vol.tex }, orgVolN: { value: new THREE.Vector3(...v.n) }, orgVolP: { value: new THREE.Vector2(...v.ploscice) },
        orgVolLo: { value: new THREE.Vector3(...vol.lo) }, orgVolK: { value: vol.k }, orgTk: { value: vol.tkivo }, orgTkK: { value: vol.tkK },
      });
      if (st) Object.assign(sh.uniforms, { orgSt: { value: st.tex }, orgStN: { value: new THREE.Vector3(...st.n) }, orgStP: { value: new THREE.Vector2(...st.ploscice) }, orgStLo: { value: new THREE.Vector3(...st.lo) }, orgStK: { value: st.k } });
    }
    if (sl) sh.uniforms.orgSl = sl.uniform;
    if (vol) sh.uniforms.orgCmU = m.orgKamera;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vOrgW;" + (vr ? "\nattribute float orgVr; varying float vOrgVr;" : "") + (vol ? "\nvarying vec3 vOrgM; varying vec3 vOrgCm; uniform vec3 orgCmU;" : ""))
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvOrgW = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;" +
          (vr ? "\nvOrgVr = orgVr;" : "") +
          (vol ? "\nvOrgM = transformed; vOrgCm = orgCmU;" : ""),
      );
    const pars = `#include <common>\nvarying vec3 vOrgW;\nuniform mat4 projectionMatrix;\nuniform vec4 orgRav[ ${n} ];\nvec3 orgQ; vec3 orgNw; float orgH; float orgEndo = 0.0;\n${vr ? "varying float vOrgVr;\n" : ""}${sl ? "uniform sampler2D orgSl;\n" : ""}${GLSL_SUM}${rezCelice || pir?.sinus ? GLSL_CEL : ""}${
      vol ? `\nvarying vec3 vOrgM; varying vec3 vOrgCm; vec3 orgQm; vec4 orgV4;\n${GLSL_VOL}${st ? GLSL_STENA : ""}` : ""
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
            ${st ? "orgSt3 = orgStena( orgQm );" : ""}
            gl_FragDepth = ${st ? "orgSt3.x > 0.5 && orgSt3.y < 0.5" : "( length( orgV4.rgb * 2.0 - 1.0 ) > 0.5 || orgV4.a > 0.15 ) && orgV4.a < 0.8"} ? clamp( ( orgC.z / orgC.w ) * 0.5 + 0.5, 0.0, 1.0 ) : gl_FragCoord.z; }
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
        float orgSl = clamp( 2.0 - length( fwidth( orgQ ) ) * 240.0, 0.0, 1.0 ); // drobni šum (60) zbledi, ko je celica pod ~3 px
        diffuseColor.rgb *= 1.0 - ${fl(0.12 * sumMoc)} + ${fl(0.24 * sumMoc)} * mix( 0.5, orgSum( orgQ * 60.0 ), orgSl ) * orgSum( orgQ * 13.0 );
        diffuseColor.rgb *= 1.0 - ${fl(0.09 * sumMoc)} * ( orgSum( orgQ * 7.0 ) - 0.5 ) * 2.0; // večje lise (prekrvavitev)
        ${t.rezVlakna && !vol ? "diffuseColor.rgb *= 0.9 + 0.2 * orgH;" : ""}${
          t.rezSnopi // krog 11: vzdolžno prerezan živec – snopiči vlaken vzdolž osi (rezSnopi { os, sirina (m), moc })
            ? `
 { vec3 sO = normalize( vec3( ${t.rezSnopi.os.map((x) => fl(+x.toFixed(4))).join(", ")} ) ); vec3 sP = normalize( cross( sO, orgNw ) );
 float sx = dot( orgQ, sP ) * ${dm2(1 / (t.rezSnopi.sirina ?? 0.00035))} + 1.2 * orgSum( orgQ * ${dm2(250)} ); float sw = fwidth( sx );
 float sl = smoothstep( 0.04, 0.2 + sw, abs( fract( sx ) - 0.5 ) );
 diffuseColor.rgb *= mix( 1.0, ${fl(1 - (t.rezSnopi.moc ?? 0.16))} + ${fl(t.rezSnopi.moc ?? 0.16)} * sl, clamp( 2.0 - sw * 2.0, 0.0, 1.0 ) ); }`
            : ""
        }${
          vol && t.rezRavna
            ? "" // učne barve: enobarven pokrov (globina ravnine ostane)
            : vol
            ? `
        { // pravo tkivo (Visible Woman) in smer vlaken iz CT: miokard rdeče rjav z vlakni, maščoba rumena z režnjiči
          vec3 orgF = orgV4.rgb * 2.0 - 1.0; float orgFl = length( orgF ); orgF = orgFl > 0.2 ? orgF / orgFl : vec3( 0.0, 1.0, 0.0 );
          vec3 orgNm0 = normalize( cross( dFdx( orgQm ), dFdy( orgQm ) ) );
          // Vzorec vlaken: šum v koordinatah, stisnjenih vzdolž vlakna. Smer vlakna se od piksla do piksla rahlo spreminja,
          // projekcija absolutne lege (ročica več cm) pa to spremembo pomnoži – prej je nastala pravilna mreža svetlih pik
          // (krog 7). Zato je smer stalna znotraj celice ${CELICA_VLAKEN * 1000} mm (vzorčena v središču celice na ravnini reza), ročica je
          // razdalja do središča celice, dve zamaknjeni mreži celic pa se prelivata (utež 0 na robu celice = brez šivov).
          // rezVlaknaOs (vzdolžna os organa): kjer vlakno ravnino prebada, se vzorec raztegne vzdolž osi (snopi, ne pike).
          ${t.rezVlaknaOs ? `vec3 orgOs = vec3( ${t.rezVlaknaOs.map((x) => fl(+x.toFixed(4))).join(", ")} ); orgOs = normalize( orgOs - orgNm0 * dot( orgOs, orgNm0 ) );` : ""}
          float orgFw2 = length( fwidth( orgQm ) );
          float orgS1 = 0.0, orgS2 = 0.0, orgWs = 0.0, orgW2 = 0.0;
          for ( int orgI = 0; orgI < 2; orgI ++ ) {
            vec3 orgCg = orgQm / ${dm(CELICA_VLAKEN)} + float( orgI ) * 0.5;
            vec3 orgCf = fract( orgCg ), orgCt = 1.0 - abs( 2.0 * orgCf - 1.0 );
            float orgCw = orgCt.x * orgCt.y * orgCt.z + 1e-4;
            vec3 orgCc = ( floor( orgCg ) + 0.5 - float( orgI ) * 0.5 ) * ${dm(CELICA_VLAKEN)};
            orgCc -= orgNm0 * dot( orgCc - orgQm, orgNm0 );
            vec3 orgFc = orgVolumen( orgCc ).rgb * 2.0 - 1.0; float orgFcl = length( orgFc ); orgFc = orgFcl > 0.2 ? orgFc / orgFcl : orgF;
            ${
              t.rezVlaknaOs
                ? `vec3 orgFp = orgFc - orgNm0 * dot( orgFc, orgNm0 ); orgFp = normalize( orgFp * ( dot( orgFp, orgOs ) < 0.0 ? -1.0 : 1.0 ) + 0.6 * orgOs );
            vec3 orgPq = orgQm - orgFp * dot( orgQm - orgCc, orgFp ) * 0.93;`
                : "vec3 orgPq = orgQm - orgFc * dot( orgQm - orgCc, orgFc );"
            }
            orgS1 += orgCw * ( orgSum( orgPq * ${fl(+(vlCt / merilo).toPrecision(4))} ) - 0.5 ); orgS2 += orgCw * ( orgSum( orgPq * ${fl(+((vlCt * 3.2) / merilo).toPrecision(4))} ) - 0.5 );
            orgWs += orgCw; orgW2 += orgCw * orgCw;
          }
          orgWs = 1.0 / mix( orgWs, sqrt( orgW2 ), 0.7 ); // preliv dveh neodvisnih vzorcev ohrani kontrast
          orgS1 = clamp( 0.5 + orgS1 * orgWs, 0.0, 1.0 ); orgS2 = clamp( 0.5 + orgS2 * orgWs, 0.0, 1.0 );
          float orgL1 = clamp( 2.0 - orgFw2 * ${fl(+((vlCt * 4) / merilo).toPrecision(4))}, 0.0, 1.0 ), orgL2 = clamp( 2.0 - orgFw2 * ${fl(+((vlCt * 19.2) / merilo).toPrecision(4))}, 0.0, 1.0 ); // celica šuma pod ~3 px zbledi (mrežni šum ob Nyquistu nariše pravilno mrežo pik, krog 7)
          float orgVl = mix( 0.5, orgS1, orgL1 ) * 0.6 + mix( 0.5, orgS2, orgL2 ) * 0.4;
          // višina za izbočenost: odvod dFdx/dFdy je stalen v bloku 2 × 2 piksla, zato vzorec, ožji od ~8 px, nariše mrežo
          // svetlih pik (krog 7); za normalo vzamemo samo širše pasove (barva ohrani drobna vlakna)
          float orgVlH = mix( 0.5, orgS1, clamp( 2.0 - orgFw2 * ${fl(+((vlCt * 8) / merilo).toPrecision(4))}, 0.0, 1.0 ) ) * 0.6 + mix( 0.5, orgS2, clamp( 2.0 - orgFw2 * ${fl(+((vlCt * 25.6) / merilo).toPrecision(4))}, 0.0, 1.0 ) ) * 0.4;
          float orgTkL = clamp( orgTkK / ( 96.0 * max( orgFw2, 1e-9 ) ) - 1.0, 0.0, 1.0 ); // kocka tkiva: 48 vzorcev na rob
          vec3 orgMi = ${vec3(t.rez || "#7a2a20")} * mix( vec3( 1.0 ), orgTkivo( orgQm, 0.0 ) / ${vec3(t.rezTkivoMio || "#5d3125")}, ${fl(t.rezTkivoMoc ?? 1)} );
          vec3 orgMaT = orgTkivo( orgQm, 1.0 );
          vec3 orgMa = ${vec3(t.rezMasca || "#d8b060")} * orgMaT / ${vec3(t.rezTkivoMasca || "#af9361")};
          orgMi *= ${fl(1 - 0.14 * (t.rezVlaknaMoc ?? 1))} + ${fl(0.28 * (t.rezVlaknaMoc ?? 1))} * orgVl;
          float orgFa = smoothstep( ${fl((t.rezMascaMeja || [0.17, 0.37])[0])}, ${fl((t.rezMascaMeja || [0.17, 0.37])[1])}, orgV4.a )${st ? " * ( 1.0 - smoothstep( 0.25, 0.6, orgSt3.z ) )" : ""}; // A: maščoba 0–0,6, venčna žila 1; stena.b: papilarne mišice in trabekule v votlini niso maščoba
          ${
            pl
              ? `// rezPlasti: razdalja v steni (stena.sdf, m) in stran najbližje površine (A: 1 epikard, 0 endokard)
          float orgDd = ( orgSt3.x - 0.5 ) * ${dm(2 * st.sdf)};
          float orgEp = smoothstep( 0.3, 0.7, orgSt3.w );
          // maščoba samo pod epikardom (do mascaGlobina), mehak prehod v mišico (ne obrobljena lisa)
          orgFa *= orgEp * ( 1.0 - smoothstep( ${dm((pl.mascaGlobina ?? 0.006) * 0.6)}, ${dm(pl.mascaGlobina ?? 0.006)}, orgDd ) );`
              : ""
          }
          diffuseColor.rgb = mix( orgMi, orgMa, orgFa );
          ${
            pl
              ? `{ // plasti stene na rezu (krog 8, slog-vzor srce-prerez-1): endokard tanka bleda sijoča črta, pod njim svetlejši
          // subendokardni pas, sredina stene temnejša z vlakni, epikard tanka prosojna bleda plast nad mišico ali maščobo
          float orgAa = max( fwidth( orgDd ), ${dm(0.00004)} );
          // krog 9 (ocena: »bledi zavihki stene levega preddvora na rezu telefona«): tanka stena preddvorov (1–2 mm) je
          // tanjša od voksla razdalje, zato je razdalja ponekod globoko negativna (»zunaj stene«), čeprav mreža steno
          // ima; tam bi bil cel pokrov endokard + subendokard (bled zavihek). Pod −0,3 mm plasti ugasnejo, ostane mišica.
          float orgZn = smoothstep( ${dm(-0.0006)}, ${dm(-0.0003)}, orgDd );
          float orgLe = ( 1.0 - smoothstep( ${dm(pl.endo?.sirina ?? 0.00025)} - orgAa, ${dm(pl.endo?.sirina ?? 0.00025)} + orgAa, orgDd ) ) * ( 1.0 - orgEp ) * orgZn;
          float orgLs = ( 1.0 - smoothstep( ${dm((pl.subendo?.sirina ?? 0.0012) * 0.35)}, ${dm(pl.subendo?.sirina ?? 0.0012)}, orgDd ) ) * ( 1.0 - orgEp ) * orgZn;
          float orgLp = ( 1.0 - smoothstep( ${dm(pl.epi?.sirina ?? 0.0003)} - orgAa, ${dm(pl.epi?.sirina ?? 0.0003)} + orgAa, orgDd ) ) * orgEp * orgZn;
          diffuseColor.rgb *= 1.0 - ${fl(pl.globina ?? 0.2)} * smoothstep( ${dm(pl.globinaOd ?? 0.0008)}, ${dm(pl.globinaDo ?? 0.004)}, orgDd ) * ( 1.0 - orgFa );
          diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(pl.subendo?.barva || "#c06a5e")}, ${fl(pl.subendo?.moc ?? 0.3)} * orgLs * ( 1.0 - orgFa ) );
          diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(pl.endo?.barva || "#efd2c6")}, ${fl(pl.endo?.moc ?? 0.75)} * orgLe );
          diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(pl.epi?.barva || "#efd8c8")}, ${fl(pl.epi?.moc ?? 0.5)} * orgLp );
          orgEndo = max( orgLe, orgLp * 0.6 ); }`
              : ""
          }
          ${
            st && t.rezEndokard && !pl
              ? `{ // rezEndokard { barva, moc, sirina (m), globina }: tanka bleda sijoča črta endokarda/epikarda ob robu stene (delež
          // stene 0,5–1 ob robu voksla) in mehko senčenje v globino stene (4 vzorci deleža stene ± sirina v ravnini reza):
          // sredina stene temnejša, ob votlini svetlejša – rezna ploskev ni enakomerna nalepka
          vec3 orgEa = normalize( cross( orgNm0, vec3( 0.31, 0.77, 0.55 ) ) ), orgEb = cross( orgNm0, orgEa );
          float orgEs = ${dm(t.rezEndokard.sirina ?? 0.0022)};
          float orgE4 = 0.25 * ( orgStena( orgQm + orgEa * orgEs ).x + orgStena( orgQm - orgEa * orgEs ).x + orgStena( orgQm + orgEb * orgEs ).x + orgStena( orgQm - orgEb * orgEs ).x );
          float orgEl = ( 1.0 - smoothstep( 0.6, 0.93, orgSt3.x ) ) * ( 1.0 - orgFa );
          diffuseColor.rgb *= 1.0 - ${fl(t.rezEndokard.globina ?? 0.22)} * smoothstep( 0.55, 1.0, orgE4 );
          diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(t.rezEndokard.barva || "#e9b9a8")}, ${fl(t.rezEndokard.moc ?? 0.6)} * orgEl );
          orgEndo = orgEl; }`
              : ""
          }
          orgH = mix( orgVlH, mix( 0.5, clamp( orgMaT.g / ${fl(+(new THREE.Color(t.rezTkivoMasca || "#af9361").g).toPrecision(4))} * 0.5, 0.0, 1.0 ), orgTkL ), orgFa );
        }`
            : ""
        }${
          t.rezPore
            ? `\n { float orgPw = length( fwidth( orgQ ) ) * 2.0; // pore (pljučna goba): temne luknjice in svetli pretini; manjše od ~2 px zbledijo (brez migetanja)
 float orgPo = mix( 0.5, orgSum( orgQ * ${fl(t.rezPore)} ), clamp( 1.5 - orgPw * ${fl(t.rezPore)}, 0.0, 1.0 ) ) * 0.65 + mix( 0.5, orgSum( orgQ * ${fl(t.rezPore * 2.3)} ), clamp( 1.5 - orgPw * ${fl(t.rezPore * 2.3)}, 0.0, 1.0 ) ) * 0.35;
 diffuseColor.rgb *= 1.0 - ${fl(t.rezPoreMoc ?? 0.4)} * smoothstep( 0.52, 0.66, orgPo ) + 0.12 * ( 1.0 - smoothstep( 0.2, 0.4, orgPo ) ); orgH = mix( orgH, 1.0 - orgPo, 0.7 ); }`
            : ""
        }${
          zarki
            ? `\n { vec3 zA = vec3( ${(zarki.sredisce || [0, 0, 0]).map((x, i) => fl(+((x - izh[i]) * merilo).toFixed(5))).join(", ")} ); // žarkaste proge (ledvične piramide)
 vec3 zB = vec3( ${(zarki.sredisce2 || zarki.sredisce || [0, 0, 0]).map((x, i) => fl(+((x - izh[i]) * merilo).toFixed(5))).join(", ")} ) - zA; // sredisce2: os (daljica) namesto točke
 vec3 zD = orgQ - zA - zB * clamp( dot( orgQ - zA, zB ) / max( dot( zB, zB ), 1e-9 ), 0.0, 1.0 ); float zR = length( zD );
 vec3 zX = zD / max( zR, 1e-5 ) * ${fl(zarki.gostota ?? 90)};
 float zLod = clamp( 1.7 - length( fwidth( zX ) ) * 2.2, 0.0, 1.0 );
 float zS = mix( 0.5, orgSum( zX ) * 0.55 + orgSum( zX * 2.9 + 3.0 ) * 0.45, zLod );
 diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(zarki.notranja || "#d9a08c")}, ${fl(zarki.notranjaMoc ?? 0)} * ( 1.0 - smoothstep( ${fl(+((zarki.r0 ?? 0.01) * merilo).toFixed(5))}, ${fl(+((zarki.r1 ?? 0.02) * merilo).toFixed(5))}, zR ) ) );
 diffuseColor.rgb = mix( diffuseColor.rgb * ${fl(1 - (zarki.moc ?? 0.4) * 0.35)}, ${vec3(zarki.barva || "#e0a090")}, ${fl(zarki.moc ?? 0.4)} * smoothstep( 0.4, 0.72, zS ) );
 orgH = mix( orgH, zS, ${fl(zarki.visina ?? 0.6)} * zLod ); }`
            : ""
        }${rezCelice ? `\n${rezCelice}` : ""}${
          pir
            ? `\n { // ledvične piramide (stožci) in maščoba sinusa
 float pD = 1e9; vec3 pDir = vec3( 0.0, 1.0, 0.0 ); float pT = 0.0;
 vec3 pW = orgQ + ${dm(pir.val ?? 0.0012)} * ( vec3( orgSum( orgQ * ${dm2(260)} ), orgSum( orgQ * ${dm2(260)} + 4.1 ), orgSum( orgQ * ${dm2(260)} + 8.3 ) ) - 0.5 );
${pir.seznam
  .map(
    (c) => ` { vec3 q = pW - vec3( ${tm(c.slice(0, 3))} ); vec3 u = vec3( ${c.slice(3, 6).map((x) => fl(+x.toFixed(4))).join(", ")} ); float t = dot( q, u ); float r = length( q - t * u ); float R = length( q );
   float dS = r - ( ${dm(c[8] ?? 0.0015)} + max( t, 0.0 ) * ${fl(c[7] ?? 0.45)} ); float dK = R - ${dm(c[6])}; float pH = max( ${dm(pir.zaobljeno ?? 0)} - abs( dS - dK ), 0.0 );
   float d = max( max( dS, dK ) + pH * pH * ${fl(0.25 / Math.max(dm(pir.zaobljeno ?? 0), 1e-9))}, - t - ${dm(c[8] ?? 0.0015)} ); // zaobljeno: zaobljen stik stranice in osnove piramide (m)
   if ( d < pD ) { pD = d; pDir = q / max( R, 1e-5 ); pT = R / ${dm(c[6])}; } }`,
  )
  .join("\n")}
 float pAa = max( length( fwidth( orgQ ) ), ${dm(pir.mehko ?? 0.00012)} ); // mehko: širina mehkega prehoda sredica–skorja (m)
 float pM = 1.0 - smoothstep( - pAa, pAa, pD );
 vec3 pX = pDir * ${fl(pir.gostota ?? 46)};
 float pLod = clamp( 1.7 - length( fwidth( pX ) ) * 2.2, 0.0, 1.0 ) * pM;
 float pS = mix( 0.5, orgSum( pX ) * 0.55 + orgSum( pX * 2.9 + 3.0 ) * 0.45, pLod );
 vec3 pC = mix( ${vec3(pir.notranja || "#d9a58f")}, ${vec3(pir.barva || "#8f3b33")}, smoothstep( ${fl(pir.notranjaR0 ?? 0.3)}, ${fl(pir.notranjaR1 ?? 0.72)}, pT ) );
 pC = mix( pC * ${fl(1 - (pir.moc ?? 0.5) * 0.3)}, ${vec3(pir.proge || "#d08a76")}, ${fl(pir.moc ?? 0.5)} * smoothstep( 0.4, 0.72, pS ) * smoothstep( 0.1, 0.45, pT ) );
 pC *= 0.93 + 0.14 * orgSum( orgQ * ${dm2(1500)} );
${
  pir.sinus
    ? ` { float sD = 1e9; // maščoba ledvičnega sinusa in hilusa (unija kapsul) s prerezanimi žilami
${pir.sinus.kapsule.map((c) => `   { vec3 sA = vec3( ${tm(c.slice(0, 3))} ); vec3 sB = vec3( ${tm(c.slice(3, 6))} ) - sA; sD = min( sD, length( pW - sA - sB * clamp( dot( pW - sA, sB ) / max( dot( sB, sB ), 1e-9 ), 0.0, 1.0 ) ) - ${dm(c[6])} ); }`).join("\n")}
   float sM = ( 1.0 - smoothstep( - pAa, pAa, sD ) ) * ( 1.0 - pM );
   if ( sM > 0.0 ) {
     vec3 fX = orgQ * ${dm2(1 / (pir.sinus.mera ?? 0.0016))}; fX += 0.6 * ( vec3( orgSum( fX * 1.9 ), orgSum( fX * 1.9 + 5.2 ), orgSum( fX * 1.9 + 9.7 ) ) - 0.5 );
     vec3 fC = orgCel( fX );
     vec3 sC = ${vec3(pir.sinus.barva || "#e0c27c")} * ( 0.88 + 0.24 * fC.z );
     sC = mix( sC, ${vec3(pir.sinus.pretini || "#b89a5a")}, 0.5 * ( 1.0 - smoothstep( 0.0, 0.1, fC.y - fC.x ) ) * clamp( 1.7 - length( fwidth( fX ) ) * 2.4, 0.0, 1.0 ) );
     ${
       pir.sinus.zile
         ? `vec3 vX = orgQ * ${dm2(1 / (pir.sinus.zileMera ?? 0.0055))} + 3.7; vec3 vC = orgCel( vX );
     if ( vC.z < ${fl(pir.sinus.zile)} ) { // prerezane veje: arterija (debela rdeča stena, okrogla) ali vena (tanka modrikasta stena, širša svetlina)
       float vA = step( 0.5, fract( vC.z * 13.7 ) ); float vR = 0.13 + 0.12 * fract( vC.z * 7.3 ) + 0.05 * ( 1.0 - vA ); float vE = length( fwidth( vX ) );
       float vO = 1.0 - smoothstep( vR - vE, vR + vE, vC.x ); float vL = 1.0 - smoothstep( vR * mix( 0.8, 0.55, vA ) - vE, vR * mix( 0.8, 0.55, vA ) + vE, vC.x );
       sC = mix( sC, mix( ${vec3(pir.sinus.vena || "#4d4a86")}, ${vec3(pir.sinus.arterija || "#b23a30")}, vA ), vO );
       sC = mix( sC, mix( ${vec3(pir.sinus.venaSvetlina || "#221631")}, ${vec3(pir.sinus.arterijaSvetlina || "#3d0c0c")}, vA ), vL );
       orgH = mix( orgH, 0.5 - 0.5 * vL, sM );
     }`
         : ""
     }
     diffuseColor.rgb = mix( diffuseColor.rgb, sC, sM );
   } }`
    : ""
}
 diffuseColor.rgb = mix( diffuseColor.rgb, pC, pM );
 orgH = mix( orgH, mix( 0.5, pS, ${fl(pir.visina ?? 0.35)} ), pM );
 ${
   pir.zile
     ? `{ float pV = ( 1.0 - smoothstep( ${dm(0.00025)}, ${dm(0.00055)}, abs( pD ) ) ) * smoothstep( 0.6, 0.75, pT ) * smoothstep( 0.6, 0.7, orgSum( pW * ${dm2(700)} ) ); // ločne žile ob osnovi piramid
 diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(pir.zileBarva || "#5e1414")}, ${fl(pir.zile)} * pV ); }`
     : ""
 } }`
            : ""
        }${
          sl
            ? `\n { // naslikana rezna ploskev (rezSlika): barva iz slike v koordinatah ravnine, A = moč
 vec2 sUv = ( vec2( dot( orgQ, vec3( ${sl.U.map((x) => fl(+x.toFixed(6))).join(", ")} ) ), dot( orgQ, vec3( ${sl.V.map((x) => fl(+x.toFixed(6))).join(", ")} ) ) ) / ${fl(+merilo.toPrecision(7))} + vec2( ${fl(+(sl.c0[0] - sl.lo[0]).toFixed(6))}, ${fl(+(sl.c0[1] - sl.lo[1]).toFixed(6))} ) ) / vec2( ${fl(sl.mera[0])}, ${fl(sl.mera[1])} );
 vec4 sT = texture2D( orgSl, vec2( sUv.x, 1.0 - sUv.y ) );
 float sIn = step( 0.0, sUv.x ) * step( sUv.x, 1.0 ) * step( 0.0, sUv.y ) * step( sUv.y, 1.0 ) * sT.a;
 ${t.rezSlika?.izrez ? "if ( sIn < 0.5 ) discard; sIn = 1.0; // izrez: zunaj naslikanega obrisa ploskve ni (nazobčan obris listov, razpoke)" : ""}
 diffuseColor.rgb = mix( diffuseColor.rgb, sT.rgb * ( 0.94 + 0.12 * orgSum( orgQ * ${dm2(1200)} ) ), sIn );
 orgH = mix( orgH, dot( sT.rgb, vec3( 0.333 ) ), sIn * ${fl(t.rezSlika?.visina ?? 0.5)} ); }`
            : ""
        }${
          vr
            ? `\n if ( vOrgVr > 1.5 ) { diffuseColor.rgb = ${vec3(presek.luknjaBarva || "#200808")}; orgH = 0.0; } else if ( vOrgVr > 0.5 ) { diffuseColor.rgb = ${vec3(presek.robBarva || t.rez || "#cccccc")}; orgH = 0.6; }`
            : ""
        }`,
      )
      .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>${st && (t.rezEndokard || pl) ? `\n roughnessFactor = mix( roughnessFactor, ${fl(pl?.endoHrap ?? 0.22)}, orgEndo );` : ""}`)
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
  m.customProgramCacheKey = () => `org-pokrov7-${st ? "s" : ""}${pl ? `p${JSON.stringify(pl)}${st.sdf}` : ""}${t.rezEndokard ? JSON.stringify(t.rezEndokard) : ""}-${vol && t.rezRavna ? "" : t.rez || t.barva}-${(t.rezVlaknaOs || []).join("_")}-${t.rezVlakna || 0}-${t.rezPore || 0}-${t.rezPoreMoc ?? ""}-${n}-${relief}-${vol ? `v${t.rezMasca || ""}${(t.rezMascaMeja || []).join("_")}${vlCt}${t.rezRavna ? "r" : ""}${t.rezTkivoMoc ?? ""}${t.rezVlaknaMoc ?? ""}` : ""}-${sumMoc}${rezCelice ? `-c${JSON.stringify(t.rezCelice)}` : ""}${zarki ? `-z${JSON.stringify(zarki)}` : ""}${pir ? `-p${JSON.stringify(pir)}` : ""}${vr ? `-r${presek.robBarva || ""}${presek.luknjaBarva || ""}` : ""}${sl ? `-s${JSON.stringify([sl.c0, sl.lo, sl.mera, sl.U, sl.V, t.rezSlika?.visina, t.rezSlika?.izrez])}` : ""}${t.rezSnopi ? `-sn${JSON.stringify(t.rezSnopi)}` : ""}`;
  return m;
}

// Notranjost prerezane votline (tkivo.rezVotlina { barva, hrap, lak, globina [m], senca, sencaMoc, okolje, vrsta }):
// zadnje ploskve mreže, osvetljene kot vlažna notranja stena (ledvični meh in čašice: v votlino se vidi), z globino temnejše.
// Ploskve drugih tkiv na ravnini reza v obrisu votline zakrije nevidna maska (zgradiOrgan), zato je votlina odprta.
function materialVotline(v, ravnina, merilo) {
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(v.barva || "#e6d3c2"),
    roughness: v.hrap ?? 0.36,
    metalness: 0,
    clearcoat: v.lak ?? 0.6,
    clearcoatRoughness: 0.18,
    envMapIntensity: v.okolje ?? 0.55,
    side: THREE.BackSide,
    clippingPlanes: [ravnina],
  });
  const g = (v.globina ?? 0.006) * merilo;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.orgRv = { value: new THREE.Vector4(ravnina.normal.x, ravnina.normal.y, ravnina.normal.z, ravnina.constant) };
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vOrgW;")
      .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvOrgW = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vOrgW;\nuniform vec4 orgRv;\n${GLSL_SUM}`)
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        { float orgGl = clamp( ( dot( orgRv.xyz, vOrgW ) + orgRv.w ) / ${g.toExponential(4)}, 0.0, 1.0 ); // globina za ravnino reza
          diffuseColor.rgb *= 0.92 + 0.16 * orgSum( vOrgW * ${fl(+(900 / merilo).toPrecision(4))} );
          diffuseColor.rgb = mix( diffuseColor.rgb, ${vec3(v.senca || "#7a4a3c")}, ${fl(v.sencaMoc ?? 0.75)} * smoothstep( 0.0, 1.0, orgGl ) ); }`,
      );
  };
  m.customProgramCacheKey = () => `org-votlina-${JSON.stringify(v)}-${g}`;
  return m;
}

// Pokrov s prostorsko teksturo: položaj kamere v prostoru modela (uniform orgCmU) pred risanjem mreže.
const obratna = new THREE.Matrix4();
function kameraModela(renderer, scena, kamera, geo, material) {
  if (material.orgKamera) material.orgKamera.value.setFromMatrixPosition(kamera.matrixWorld).applyMatrix4(obratna.copy(this.matrixWorld).invert());
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
  const volCaka = []; // prostorske teksture reza: prenos ob prvem prerezu
  if (pv) {
    // Ne čakamo: teksturi reza (≈ 0,8 MB) se naložita v ozadju po GLB, prvi prikaz (celota) je zato hitrejši (telefon
    // 4G: ocena n9 4,8 s). Do naložitve vzorčenje vrne 0 (pokrov kot brez stene, nekaj sto ms, samo če je prerez že vklopljen).
    const nalozi = (ime, srgb = false) => {
      const tx = new THREE.Texture(); // prazna do prvega prereza (volCaka): celota teh slik ne potrebuje
      volCaka.push({ tx, pot: ime });
      tx.flipY = false;
      tx.generateMipmaps = false;
      tx.minFilter = THREE.LinearFilter;
      tx.magFilter = THREE.LinearFilter;
      tx.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; // tkivo: fotografija (linearne vrednosti kot barve iz JSON)
      return tx;
    };
    const s0 = prostor.s;
    vol = { tex: nalozi(pv.slika), tkivo: nalozi(pv.tkivo || `${ime}-tkivo.png`, true), meta: pv, lo: prostor.tocka(pv.lo), k: pv.korak * s0, tkK: (pv.tkivoMera ?? 0.016) * s0 };
    // delež stene iz mreže (rez-stena.mjs): telefon ima svojo mrežo, zato svojo sliko (stena.telefon)
    const ps = pv.stena;
    if (ps) vol.stena = { tex: nalozi((!visoka && ps.telefon) || ps.slika), n: ps.n, ploscice: ps.ploscice, lo: prostor.tocka(ps.lo), k: ps.korak * s0, sdf: ps.sdf || 0 };
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
  const preseki = new Map(); // tkivo → material pravega preseka (tkivo.rezPresek)
  const presekGeo = [];
  const leniRez = []; // gradnja presekov in votlin posameznih kosov, izvede se ob prvem prerezu
  const enaRavnina0 = !!ravnine && ravnine.seznam.length === 1 && !ravnine.presek;
  const votline = new Map(); // tkivo → material notranjosti votline (tkivo.rezVotlina)
  const maskaMat = new THREE.MeshBasicMaterial({ colorWrite: false, side: THREE.DoubleSide }); // samo globina: odprtina votline v ploskvah reza
  const slike = []; // naslikane rezne ploskve (tkivo.rezSlika): naložijo se ob prvem prerezu
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
    // Pravi presek (tkivo.rezPresek: { vrsta, polno, ovoj, trak, povecaj, rob [m], robBarva, luknjaBarva, samoRob }; ena ravnina): zapolnjen obris preseka na ravnini reza namesto
    // pokrova iz zadnjih ploskev, za vsako vozlišče GLB (zaprto telo) posebej. vrsta = vrstni red plasti (višja je bliže
    // gledalcu: sredica čez skorjo, meh čez oboje); polno = brez lukenj; ovoj = izbočena ovojnica preseka (podlaga: maščoba
    // ledvičnega sinusa pod skorjo, sredico in mehom).
    // Geometrija pravega preseka in votlin nastane šele ob prvem prerezu (leniRez; pregled krog 3: ob nalaganju je
    // presek vseh vozlišč zadrževal glavno nit, celota pa ga ne potrebuje).
    if (enaRavnina0 && (t.rezPresek || t.rezVotlina)) leniRez.push(() => {
    let presek = null;
    const enaRavnina = ravnine && ravnine.seznam.length === 1 && !ravnine.presek;
    const trianguliraj = (obris, luknje) => THREE.ShapeUtils.triangulateShape(obris.map((q) => new THREE.Vector2(q[0], q[1])), luknje.map((l) => l.map((q) => new THREE.Vector2(q[0], q[1]))));
    const deliMreze = () => ((idx) => (k.obsegi || [[0, idx.length]]).map(([a, st]) => idx.subarray(a, a + st)))(k.geo.index.array);
    if (enaRavnina && t.rezPresek) {
      const rav = ravnine.seznam[0];
      const n = rav.normal.toArray();
      // robBarva: obroba v svoji barvi (stena žile, ovojnica); luknjaBarva: zapolnjene luknje (temna svetlina cevi z dvojno
      // steno); samoRob: brez ploskve (stena votline, glej rezVotlina)
      const r = presekMreze(k.geo.attributes.position.array, deliMreze(), n, rav.constant, {
        polno: !!t.rezPresek.polno,
        ovoj: !!t.rezPresek.ovoj,
        trak: !!t.rezPresek.trak,
        luknje: !!t.rezPresek.luknjaBarva,
        brezPloskve: !!t.rezPresek.samoRob,
        stena: (t.rezPresek.stena || 0) * s, // ozek obris brez lukenj je stena (vzdolž prerezana odprta cev), ne svetlina (m)
        skleni: (t.rezPresek.skleni || 0) * s, // odprtina v mreži (hilus): obris se sklene z ravno črto do te širine (m)
        povecaj: t.rezPresek.povecaj ?? 1,
        rob: (t.rezPresek.rob ?? 0) * s, // metri → enote modela
        trianguliraj,
      });
      if (r) {
        // malenkost pred ravnino (na odrezani strani), plasti druga pred drugo: brez migetanja globine
        const odmik = -(0.0004 + 0.0004 * (t.rezPresek.vrsta ?? 0));
        // svetlina cevi (vrsta 2) malenkost pred obrobami: stena sosednje veje iste žile ne riše črt čez svetlino (stik vej)
        for (let i = 0; i < r.polozaji.length; i += 3) for (let c = 0; c < 3; c++) r.polozaji[i + c] += n[c] * (r.vrste[i / 3] === 2 ? odmik - 0.00015 : odmik);
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(r.polozaji, 3));
        g.setAttribute("normal", new THREE.BufferAttribute(Float32Array.from({ length: r.polozaji.length }, (_, i) => -n[i % 3]), 3));
        g.setAttribute("orgVr", new THREE.BufferAttribute(r.vrste, 1));
        g.setIndex(r.indeksi);
        presekGeo.push(g);
        if (!preseki.has(k.tkivo)) {
          // naslikana rezna ploskev (rezSlika { slika, lo [m, koordinati ravnine], mera [m], izrez, visina }): tekstura se naloži ob prvem prerezu
          let slika = null;
          if (t.rezSlika) {
            const prazna = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
            prazna.needsUpdate = true;
            slika = { uniform: { value: prazna }, U: r.os.U, V: r.os.V, c0: [0, 1].map((i) => prostor.sredisce.reduce((a, x, c) => a + x * (i ? r.os.V : r.os.U)[c], 0)), lo: t.rezSlika.lo, mera: t.rezSlika.mera };
            slike.push({ uniform: slika.uniform, prazna, pot: t.rezSlika.slika, tex: null });
          }
          const pm = materialPokrova(t, ravnine, s, null, prostor.sredisce, { robBarva: t.rezPresek.robBarva, luknjaBarva: t.rezPresek.luknjaBarva, slika });
          pm.clippingPlanes = [];
          pm.side = THREE.DoubleSide;
          preseki.set(k.tkivo, pm);
        }
        presek = new THREE.Mesh(g, preseki.get(k.tkivo));
        presek.raycast = () => {};
        presek.renderOrder = (tk.vrstni ?? 0) + 0.01 * (t.rezPresek.vrsta ?? 0);
        presek.userData = { pokrov: true, presek: true, tkivo: k.tkivo, stran: k.stran, del: k.del };
        mesh.add(presek);
      }
    }
    // Odprta votlina (tkivo.rezVotlina, ena ravnina): notranjost mreže (zadnje ploskve, osvetljene) in nevidna maska v obrisu
    // preseka, ki v globino zapiše ravnino reza malo pred ploskvami drugih tkiv (vrsta nižja od maske) – tam ostane odprtina.
    // Vrstni red risanja: notranjost in mreža votline (−3), maska (−2), nato pokrovi in ploskve reza.
    if (enaRavnina && t.rezVotlina) {
      const rav = ravnine.seznam[0];
      const n = rav.normal.toArray();
      if (!votline.has(k.tkivo)) votline.set(k.tkivo, materialVotline(t.rezVotlina, rav, s));
      const v = new THREE.Mesh(k.geo, votline.get(k.tkivo));
      v.raycast = () => {};
      v.renderOrder = -3;
      v.userData = { pokrov: true, votlina: true, tkivo: k.tkivo, stran: k.stran, del: k.del };
      mesh.add(v);
      mesh.renderOrder = -3;
      const r = presekMreze(k.geo.attributes.position.array, deliMreze(), n, rav.constant, { polno: true, trianguliraj });
      if (r) {
        const odmik = -(0.0004 + 0.0004 * (t.rezVotlina.vrsta ?? (t.rezPresek?.vrsta ?? 0) - 0.5));
        for (let i = 0; i < r.polozaji.length; i += 3) for (let c = 0; c < 3; c++) r.polozaji[i + c] += n[c] * odmik;
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(r.polozaji, 3));
        g.setIndex(r.indeksi);
        presekGeo.push(g);
        const maska = new THREE.Mesh(g, maskaMat);
        maska.raycast = () => {};
        maska.renderOrder = -2;
        maska.userData = { pokrov: true, maska: true, tkivo: k.tkivo, stran: k.stran, del: k.del };
        mesh.add(maska);
      }
    }
    });
    if (!(enaRavnina0 && (t.rezPresek || t.rezVotlina)) && ravnine && !t.brezReza && !t.dvostransko && !znotrajDela.has(k.del) && (t.prosojnost ?? 1) >= 1 && !(prerez.brezPokrova || []).includes(k.del)) {
      if (!pokrovi.has(k.tkivo)) pokrovi.set(k.tkivo, materialPokrova(t, ravnine, s, vol, prostor.sredisce));
      const p = new THREE.Mesh(k.geo, pokrovi.get(k.tkivo));
      p.raycast = () => {};
      p.renderOrder = tk.vrstni ? tk.vrstni - 0.5 : -1; // pokrov pred svojo mrežo (in za ozadjem z manjšim vrstnim redom)
      p.userData = { pokrov: true, tkivo: k.tkivo, stran: k.stran, del: k.del };
      p.onBeforeRender = kameraModela;
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
    // skupina v skrijDele skrije tudi svoje posamezne dele (venčne arterije → LAD, cirkumfleksna …; prej so ostali vidni)
    for (const d of podatki.deli || []) if (d.skupina && skrijDele.has(d.skupina)) skrijDele.add(d.id);
    const rezi = vPrerezu() && !!ravnine && p.rez !== false;
    if (rezi && leniRez.length) {
      for (const f of leniRez.splice(0)) f();
      if (ucne) barvePokrovov();
    }
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
      mm.userData.osnova.lakHrap ??= mm.clearcoatRoughness;
      mm.clearcoat = o.lak ?? mm.userData.osnova.clearcoat;
      mm.clearcoatRoughness = o.lakHrap ?? mm.userData.osnova.lakHrap; // npr. prerez: gladek moker endokard
      if (mm.aoMap) mm.aoMapIntensity = o.aoTekstura ?? t.aoTekstura ?? 1; // pogled lahko omili pečeno senco (prerez: ploskve, ki jih je pri peki zakrivala odrezana polovica)
      zamakni(mm, o.zamik ?? t.zamik ?? 0);
      const op = o.prosojnost ?? t.prosojnost ?? 1;
      const side = o.dvostransko ?? (t.dvostransko || kljuc !== tk) ? THREE.DoubleSide : THREE.FrontSide;
      if (mm.opacity !== op || mm.side !== side) {
        if (!mm.transmission) mm.transparent = op < 1;
        mm.opacity = op;
        mm.side = side;
        mm.needsUpdate = true;
      }
    }
    // Učne barve: iste zastavice tkiva in nastavitve pogleda kot naravni material (prosojnost, stran, svetlost).
    for (const u of ucni.values()) {
      const t = podatki.tkiva?.[u.tkivo] || {};
      const o = nast[u.tkivo] || {};
      u.mat.color.copy(u.barva);
      if (o.ucnaBarva) u.mat.color.set(o.ucnaBarva); // pogled: npr. temna notranjost zrkla skozi zenico tudi v učnih barvah
      if (o.svetlost) u.mat.color.multiplyScalar(o.svetlost);
      zamakni(u.mat, o.zamik ?? t.zamik ?? 0);
      const op = o.ucnaProsojnost ?? t.ucnaProsojnost ?? o.prosojnost ?? t.prosojnost ?? 1; // ucnaProsojnost: roženica v učnih barvah vidna
      const side = o.dvostransko ?? (t.dvostransko || znotrajDela.has(u.id)) ? THREE.DoubleSide : THREE.FrontSide;
      if (u.mat.opacity !== op || u.mat.side !== side) {
        u.mat.transparent = op < 1 || !!u.mat.userData.rob;
        u.mat.opacity = op;
        u.mat.side = side;
        u.mat.needsUpdate = true;
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
    // naslikane rezne ploskve: prenos šele ob prvem prerezu (celota jih ne potrebuje)
    if (rezi) {
      for (const c of volCaka.splice(0)) new THREE.ImageLoader().load(`${BAZA}${c.pot}`, (img) => { c.tx.image = img; c.tx.needsUpdate = true; }, undefined, (e) => console.warn("organ: prostorska tekstura reza ni naložena", e));
      for (const sl of slike) {
        if (sl.tex) continue;
        sl.tex = new THREE.TextureLoader().load(`${BAZA}${sl.pot}`, (tx) => (sl.uniform.value = tx), undefined, (e) => console.warn("organ: slika reza ni naložena", e));
        sl.tex.colorSpace = THREE.SRGBColorSpace;
        sl.tex.flipY = false; // vrstica 0 slike = največji y ravnine (senčilnik bere 1 − y)
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
      // Učni material ohrani zastavice tkiva (pregled krog 3): prosojnost (roženica, steklovina: šarenica ostane vidna in
      // dotik gre skozi), dvostransko (lističi zaklopk, žile z enojno steno), brezReza (tkivo se v prerezu ne reže) in
      // globino kot naravni material. Prosojnost, stran in nastavitve pogleda nastavi uporabi().
      const tk = podatki.tkiva?.[tkivo] || {};
      const narava = mat(tkivo, id);
      const reze = !!ravnine && !tk.brezReza;
      // ucnaGladko (tkivo): brez normalne teksture (šarenica ne »plastelin«); ucnaRob [a0, a1]: prosojnost po Fresnelu
      // (roženica: obarvan rob kupole, sredina skoraj prozorna, zenica ostane črna; krog 11)
      const umat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0, normalMap: tk.ucnaGladko ? null : teksture?.normalMap || null, clippingPlanes: rezi && reze ? ravnine.seznam : [], depthWrite: narava.depthWrite });
      if (teksture?.normalScale && !tk.ucnaGladko) umat.normalScale.copy(teksture.normalScale).multiplyScalar(0.6);
      if (tk.ucnaRob) {
        const [a0, a1] = tk.ucnaRob;
        umat.transparent = true;
        umat.userData.rob = true;
        umat.onBeforeCompile = (sh) => {
          sh.fragmentShader = sh.fragmentShader.replace("#include <opaque_fragment>", `diffuseColor.a *= mix( ${fl(a0)}, ${fl(a1)}, pow( 1.0 - abs( dot( normal, normalize( vViewPosition ) ) ), 2.0 ) );\n#include <opaque_fragment>`);
        };
        umat.customProgramCacheKey = () => `ucna-rob-${a0}-${a1}`;
      }
      umat.userData.rezan = reze;
      // Stene s prostorsko teksturo reza (srce): pokrov na globini ravnine kot v naravnih barvah, sicer bi notranji deli
      // (prevodni sistem, dno papilarnih mišic, venčne veje) v pretinu silili skozi rez kot raznobarvni drobci (ocena n9).
      const pokrov =
        ravnine && vol && tk.rezVolumen
          ? materialPokrova({ ...tk, rez: `#${c.clone().multiplyScalar(0.62).getHexString()}`, rezVlakna: 0, rezRavna: true }, ravnine, s, vol, prostor.sredisce)
          : new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(0.62), side: THREE.BackSide, clippingPlanes: ravnine ? ravnine.seznam : [], clipIntersection: !!ravnine?.presek });
      // pravi presek (rezPresek): enobarvna ploskev na ravnini, brez rezanja
      // piramide na ploskvi skorje (rezPiramide.del): v učnih barvah enobarvne v barvi svojega dela
      let presek;
      if (tk.rezPiramide?.seznam?.length && tk.rezPresek && enaRavnina0) {
        const hex = (b, k = 0.62) => `#${new THREE.Color(b).multiplyScalar(k).getHexString()}`;
        const cp = hex(ucnaBarva(poId.get(tk.rezPiramide.del) || poId.get(id), poId));
        const cs = tk.rezPiramide.sinus ? hex(ucnaBarva(poId.get(tk.rezPiramide.sinus.del) || poId.get(id), poId)) : null;
        presek = materialPokrova(
          { rez: tk.rezPiramide.osnovaDel ? hex(ucnaBarva(poId.get(tk.rezPiramide.osnovaDel) || poId.get(id), poId)) : hex(c), rezSum: 0, rezHrap: 1, rezLak: 0, rezRelief: 0, rezPiramide: { ...tk.rezPiramide, barva: cp, notranja: cp, proge: cp, moc: 0, zile: 0, visina: 0, sinus: cs ? { ...tk.rezPiramide.sinus, barva: cs, pretini: cs, zile: 0 } : null } },
          ravnine, s, null, prostor.sredisce,
        );
        presek.clippingPlanes = [];
        presek.side = THREE.DoubleSide;
      } else presek = new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(0.62), side: THREE.DoubleSide });
      ucni.set(kljuc, { mat: umat, pokrov, presek, tkivo, id, barva: c.clone() });
    }
    return ucni.get(kljuc);
  };
  // materiali pokrovov in presekov po barvnem načinu (tudi za ploskve, zgrajene ob prvem prerezu)
  function barvePokrovov() {
    for (const m of meshi) {
      const u = ucne ? ucniZa(m.userData.del, m.userData.tkivo) : null;
      for (const c of m.children) if (c.userData.pokrov && !c.userData.maska && !c.userData.votlina) c.material = c.userData.presek ? (u ? u.presek : preseki.get(m.userData.tkivo)) : u ? u.pokrov : pokrovi.get(m.userData.tkivo);
    }
  }
  function barve(n) {
    ucne = imaUcne && n === "ucne";
    for (const m of meshi) {
      const u = ucne ? ucniZa(m.userData.del, m.userData.tkivo) : null;
      m.material = u ? u.mat : mat(m.userData.tkivo, m.userData.del);
      for (const c of m.children) if (c.userData.pokrov && !c.userData.maska && !c.userData.votlina) c.material = c.userData.presek ? (u ? u.presek : preseki.get(m.userData.tkivo)) : u ? u.pokrov : pokrovi.get(m.userData.tkivo);
    }
    uporabi(); // tudi brez prereza: prosojnost in stran učnih materialov
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
    // polmerTelefon: ožje pokončno platno telefona (kakovost nizka) potrebuje širši kader (škripec, roženica ob robu)
    return { sredisce: prostor.tocka(c), polmer: (!visoka && o.polmerTelefon) || o.polmer || 1 };
  };
  return {
    group,
    get deli() {
      return deliPogleda;
    },
    steviloDelov: vsiDeli.length, // vsi deli modela (števec v seznamu se ob prerezu ne spreminja)
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
      if (vol) (vol.tex.dispose(), vol.tkivo.dispose(), vol.stena?.tex.dispose());
      for (const u of ucni.values()) (u.mat.dispose(), u.pokrov.dispose(), u.presek.dispose());
      for (const m of preseki.values()) m.dispose();
      for (const g of presekGeo) g.dispose();
      for (const m of votline.values()) m.dispose();
      maskaMat.dispose();
      for (const sl of slike) (sl.prazna.dispose(), sl.tex?.dispose());
      proxyMat.dispose();
      // Geometrija ostane v predpomnilniku (»Ponastavi« zgradi znova brez prenosa).
    },
  };
}
