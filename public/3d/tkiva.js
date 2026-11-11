// Materiali tkiv za atlas telesa: ime materiala Z-Anatomy (atlas-strukture.json → material) → razred senčenja in barva.
// Razredov je malo (kost, hrustanec, zob, vlakna, ovojnica, mišica, vlažno tkivo, žila, živec, steklo, koža), barvo nosi
// vsak del posebej (barva primerka v BatchedMesh), zato je klicev risanja malo: plast × razred. Modeli imajo zapečeno
// okluzijo v pregibih (barva oglišč COLOR_0, siva 0,4–1): zatemni barvo in odboje okolja. Podrobnost površine (pore
// kosti, vlakna mišic in kit, mehka lisavost organov, pore kože) je proceduralni šum v senčilniku, brez tekstur; relief
// (motena normala iz odvodov višine) samo pri visoki kakovosti, na telefonu le rahla barvna zrnatost.
import { THREE } from "./scena.js";

// Razredi senčenja (MeshPhysicalMaterial). Pri nizki kakovosti brez sijaja (sheen) in laka (clearcoat): hitreje.
// d = podrobnost: f = frekvenca šuma v ciklih na meter (x, y, z; vlakna so podolgovata po višini telesa), f2 = druga
// oktava, b = barvna zrnatost, r = moč reliefa, t = topel/hladen odtenek v velikih lisah, s = mehka presevnost na robu.
const RAZREDI = {
  kost: { roughness: 0.74, clearcoat: 0.05, clearcoatRoughness: 0.6, sheen: 0.15, sheenColor: "#fff1d6", sheenRoughness: 0.7, d: { f: [95, 95, 95], f2: 380, b: 0.13, r: 0.75, t: 0.06 } },
  hrustanec: { roughness: 0.26, clearcoat: 0.5, clearcoatRoughness: 0.25, sheen: 0.6, sheenColor: "#d6e8ff", sheenRoughness: 0.4, d: { f: [60, 60, 60], b: 0.05, r: 0.12, s: 0.22 } },
  zob: { roughness: 0.16, clearcoat: 0.9, clearcoatRoughness: 0.12 },
  vlakno: { roughness: 0.36, sheen: 1, sheenColor: "#ffffff", sheenRoughness: 0.3, clearcoat: 0.25, clearcoatRoughness: 0.3, d: { f: [900, 70, 900], b: 0.07, r: 0.55 } },
  ovojnica: { roughness: 0.3, sheen: 0.9, sheenColor: "#fff6ee", sheenRoughness: 0.35, clearcoat: 0.35, clearcoatRoughness: 0.25, prosojno: 0.34, robna: true, d: { f: [700, 90, 700], b: 0.05, r: 0.3 } },
  misica: { roughness: 0.48, sheen: 0.8, sheenColor: "#ff9a8c", sheenRoughness: 0.4, clearcoat: 0.18, clearcoatRoughness: 0.4, d: { f: [380, 30, 380], b: 0.15, r: 0.9, s: 0.1 } },
  vlazno: { roughness: 0.34, clearcoat: 0.75, clearcoatRoughness: 0.16, sheen: 0.3, sheenColor: "#ffd0c8", sheenRoughness: 0.5, d: { f: [45, 45, 45], f2: 170, b: 0.09, r: 0.28, t: 0.04, s: 0.14 } },
  // Žile: vlažen sijaj, a zmeren lak (tanke cevke bi sicer odbijale samo okolje in bile sive namesto modre/rdeče).
  zila: { roughness: 0.3, clearcoat: 0.45, clearcoatRoughness: 0.2, sheen: 0.15, sheenColor: "#ffd6d6", sheenRoughness: 0.4, d: { f: [120, 120, 120], b: 0.05, r: 0.12, s: 0.16 } },
  zivec: { roughness: 0.34, sheen: 0.9, sheenColor: "#fff2b8", sheenRoughness: 0.3, clearcoat: 0.35, clearcoatRoughness: 0.25, d: { f: [800, 80, 800], b: 0.06, r: 0.35 } },
  steklo: { roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.05, prosojno: 0.32 },
  koza: { roughness: 0.52, sheen: 0.6, sheenColor: "#ffd9c7", sheenRoughness: 0.45, clearcoat: 0.1, clearcoatRoughness: 0.45, prosojno: 0.5, d: { f: [300, 300, 300], f2: 1100, b: 0.05, r: 0.22, t: 0.03, s: 0.2 } },
};
export const IMENA_RAZREDOV = Object.keys(RAZREDI);

const MISICE = {
  Abductor: "#b03a33", Adductor: "#9e2f2e", Biarticular: "#a93830", Depressor: "#a1342f", Diaphragm: "#9a2c2a",
  Extension: "#ad3b34", "Extension hand/foot": "#b1403a", "Extensor extremities": "#a73631", "External rotation": "#9f302d",
  Flexion: "#aa3532", "Flexion fingers": "#b4423b", "Flexion hand/foot": "#a3332f", Ingestion: "#b24b45",
  "Internal rotator": "#9c2e2b", Levator: "#a63a33", Masticator: "#a02f2c", "Orbicularis/Constrictor": "#b44a44",
  Phonation: "#b6524a", Superficial: "#a8362f", Trapezius: "#a3352f",
};

// Natančna imena materialov → [razred, barva]. Številke za imenom (Bone-3, Nerve-5) so odtenki iste skupine.
const TOCNO = {
  Bone: ["kost", "#e8dcc4"],
  Suture: ["kost", "#cdbd9b"],
  Teeth: ["zob", "#f3efe4"],
  "Teeth-roots": ["kost", "#e4d5b2"],
  Cartilage: ["hrustanec", "#a9c7df"],
  Nail: ["zob", "#ead3c6"],
  Ligament: ["vlakno", "#d7d4c9"],
  Tendon: ["vlakno", "#e3e1d7"],
  "Articular capsule": ["vlakno", "#cbc3b3"],
  Bursa: ["hrustanec", "#c9d6dc"],
  Fat: ["vlazno", "#e6c463"],
  Fascia: ["ovojnica", "#e6d6c6"],
  Artery: ["zila", "#c3262c"],
  Vein: ["zila", "#2f5ba8"],
  // Pljučna arterija nosi kri brez kisika (modro), pljučne vene kri s kisikom (rdeče).
  "Pulmonary artery": ["zila", "#3a64b8"],
  "Pulmonary vein": ["zila", "#c9343a"],
  Nerve: ["zivec", "#e8c547"],
  Nucleus: ["vlazno", "#c98e9a"],
  "Nucleus (afferent fibers)": ["vlazno", "#7fa7d9"],
  "Nucleus (efferent fibers)": ["vlazno", "#d9776f"],
  Brain: ["vlazno", "#d9a6a3"],
  "Frontal lobe": ["vlazno", "#dcaaa3"],
  "Parietal lobe": ["vlazno", "#d3a2a8"],
  "Temporal lobe": ["vlazno", "#d8ab9f"],
  Insula: ["vlazno", "#cf9f9e"],
  "Interlobar sulci": ["vlazno", "#b98a88"],
  Cerebellum: ["vlazno", "#c8908c"],
  "Brain-Inner": ["vlazno", "#c9a8a2"],
  "White matter": ["vlazno", "#ece5d8"],
  LCR: ["steklo", "#9ccbea"],
  Eye: ["zob", "#f0ede6"],
  Cornea: ["steklo", "#dbeeff"],
  Iris: ["vlazno", "#5e7fa0"],
  Mucosa: ["vlazno", "#d88b8a"],
  "Mucosa of stomach": ["vlazno", "#d98a7c"],
  Gland: ["vlazno", "#d9a46c"],
  Organ: ["vlazno", "#b9564c"],
  Lymph: ["vlazno", "#78bd66"],
  Bronchi: ["hrustanec", "#e3bcb2"],
  Lung: ["vlazno", "#e6a19e"],
  Intestine: ["vlazno", "#d99a83"],
  Gallbladder: ["vlazno", "#5f9040"],
  Ductus: ["vlazno", "#a3bf5c"],
  Peritoneum: ["steklo", "#e8c8b8"],
  Skin: ["koza", "#e5b79e"],
  "Skin-in": ["koza", "#d6a08a"],
  Black: ["vlakno", "#2b2521"],
};

// Organi po imenu (material »Organ« je skupen): jetra, vranica, ledvica, srce …
const ORGANI = [
  [/liver|hepat/i, "#8f3c30"],
  [/spleen|splen/i, "#7d2e3b"],
  [/kidney|renal|ren\b/i, "#8b3a34"],
  [/heart|ventric|atri(um|al)|myocard/i, "#a8302e"],
  [/tongue/i, "#c8676a"],
  [/pancrea/i, "#e0b07a"],
  [/thyroid|parathyroid/i, "#b8564e"],
  [/bladder/i, "#d9a08a"],
  [/esophag|oesophag|stomach|gastr/i, "#d4867a"],
  [/colon|cecum|caecum|rectum|appendix|intestin|jejun|ile(um|al)|duoden/i, "#d99a83"],
  [/testis|epididym|penis|prostat|uter|ovar|vagin/i, "#d39a9a"],
];

// Odtenek iz imena (enak ob vsakem nalaganju): rahla razlika med sosednjimi deli iste skupine.
function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

export function tkivo(row) {
  const mat = String(row.material || "");
  const osnova = mat.replace(/[-'"]+\d*'*$/, "").replace(/-\d+$/, "").trim();
  let razred = "vlazno";
  let barva = "#c08a80";
  if (MISICE[mat] || MISICE[osnova]) {
    razred = "misica";
    barva = MISICE[mat] || MISICE[osnova];
  } else if (TOCNO[mat]) [razred, barva] = TOCNO[mat];
  else if (TOCNO[osnova]) [razred, barva] = TOCNO[osnova];
  else if (/^Skin/.test(mat)) [razred, barva] = TOCNO.Skin;
  else if (row.sistem === "okostje" || /^Bone/.test(mat) || !mat) [razred, barva] = TOCNO.Bone;
  else if (row.sistem === "misice") [razred, barva] = ["misica", "#a8362f"];
  if (row.sistem === "organi" || razred === "vlazno") {
    const o = ORGANI.find(([re]) => re.test(row.ime || row.id || ""));
    if (o && row.sistem === "organi") barva = o[1];
  }
  // Odtenki: zaporedna številka materiala (Bone-3) in ime dela premakneta svetlost za nekaj odstotkov.
  const c = new THREE.Color(barva);
  const hsl = {};
  c.getHSL(hsl);
  const st = Number((mat.match(/-(\d+)/) || [])[1] || 0);
  const j = (hash(row.id || mat) - 0.5) * (razred === "kost" ? 0.035 : 0.06) + (st ? ((st % 5) - 2) * 0.012 : 0);
  c.setHSL(hsl.h + (razred === "misica" ? (hash(row.ime || "") - 0.5) * 0.012 : 0), hsl.s, Math.min(0.95, Math.max(0.05, hsl.l + j)));
  return { razred, barva: c };
}

// Skupni dodatek senčilnikom: podrobnost površine (prostorski šum), zapečena okluzija, prosojnost za zatemnitev in
// rentgen (rob se ob rentgenu poudari kot steklo). uAlfa: 1 = običajno; uRob: 0 … 1 (rentgen); uSvetlost: 1 = običajno,
// manj = zatemnjeno (ostali deli, ko je en izbran); uObroba: modra obroba izbranega dela.
const GLSL_SUM = `
float evkHash(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float evkSum(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(evkHash(i+vec3(0,0,0)),evkHash(i+vec3(1,0,0)),f.x), mix(evkHash(i+vec3(0,1,0)),evkHash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(evkHash(i+vec3(0,0,1)),evkHash(i+vec3(1,0,1)),f.x), mix(evkHash(i+vec3(0,1,1)),evkHash(i+vec3(1,1,1)),f.x),f.y), f.z); }
`;
const fl = (x) => (Number.isInteger(x) ? `${x}.0` : String(x));
const v3 = (a) => `vec3(${a.map(fl).join(", ")})`;

export function ustvariMaterial(razred, kakovost, skupno) {
  const r = RAZREDI[razred] || RAZREDI.vlazno;
  const visoka = kakovost === "visoka";
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: r.roughness,
    metalness: 0,
    clearcoat: visoka || razred === "zob" || razred === "steklo" || razred === "zila" ? r.clearcoat || 0 : 0,
    clearcoatRoughness: r.clearcoatRoughness ?? 0.3,
    sheen: visoka ? r.sheen || 0 : 0,
    sheenColor: new THREE.Color(r.sheenColor || "#ffffff"),
    sheenRoughness: r.sheenRoughness ?? 0.5,
    envMapIntensity: 1,
    vertexColors: true, // zapečena okluzija (COLOR_0); atlas doda belo, kjer je model nima
  });
  m.userData.razred = razred;
  m.userData.osnovaProsojnost = r.prosojno ?? 1;
  if (r.robna) {
    m.side = THREE.DoubleSide; // tanka opna: vidni obe steni, smer normal (zrcaljeni izvoz) ni pomembna
    m.userData.dvostransko = true;
  }
  if (r.prosojno) {
    m.transparent = true;
    m.opacity = r.prosojno;
    m.depthWrite = false;
  }
  const uniforms = { uAlfa: skupno.uAlfa, uRob: skupno.uRob, uSvetlost: skupno.uSvetlost, uObroba: skupno.uObroba || { value: 0 } };
  const d = r.d || null;
  // Telefon: samo ena oktava barvne zrnatosti pri kosti in mišici (kot prej); računalnik: vse z reliefom.
  const zrno = d && (visoka || razred === "kost" || razred === "misica");
  const relief = zrno && visoka && d.r > 0;
  const f2 = visoka && d?.f2 ? d.f2 : 0;
  const f1 = d ? Math.max(...d.f) : 1;
  // Ko en slikovni element pokrije več kot ~pol cikla, šum zbledi proti povprečju (brez migotanja na daljavo).
  const visina = !zrno
    ? ""
    : `float evkFw = length(fwidth(vEvkPos));
       float evkLod = clamp(1.6 - evkFw * ${fl(f1)} * 1.8, 0.0, 1.0);
       float evkZ = mix(0.5, evkSum(vEvkPos * ${v3(d.f)}), evkLod);
       ${f2 ? `evkZ = evkZ * 0.62 + mix(0.5, evkSum(vEvkPos * ${fl(f2)}), clamp(1.6 - evkFw * ${fl(f2)} * 2.4, 0.0, 1.0)) * 0.38;` : ""}`;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vEvkPos;\nvarying float vEvkAO;")
      .replace(
        "#include <color_vertex>",
        `#include <color_vertex>
        #if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
          vEvkAO = color.r;
        #else
          vEvkAO = 1.0;
        #endif`,
      )
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
        vec4 evkP = vec4( transformed, 1.0 );
        #ifdef USE_BATCHING
          evkP = batchingMatrix * evkP;
        #endif
        vEvkPos = ( modelMatrix * evkP ).xyz;`,
      );
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vEvkPos;\nvarying float vEvkAO;\nuniform float uAlfa;\nuniform float uRob;\nuniform float uSvetlost;\nuniform float uObroba;\n${GLSL_SUM}`)
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        diffuseColor.rgb *= mix( 1.0, vEvkAO, 0.75 ) / max( vEvkAO, 0.05 ); // zapečena okluzija v barvi le 75 %
        ${visina}
        ${zrno ? `diffuseColor.rgb *= 1.0 - ${fl(d.b)} * 0.5 + ${fl(d.b)} * evkZ;` : ""}
        ${zrno && d.t && visoka ? `float evkT = evkSum(vEvkPos * 9.0); diffuseColor.rgb *= mix(vec3(1.0), vec3(1.0 + ${fl(d.t)}, 1.0, 1.0 - ${fl(d.t * 1.6)}), evkT);` : ""}`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        ${zrno ? "roughnessFactor = clamp(roughnessFactor + (evkZ - 0.5) * 0.14, 0.04, 1.0);" : ""}`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
        ${
          relief
            ? `{
          // Relief iz odvodov višine po zaslonu (kot bumpMap, a brez teksture): višina v metrih ~ moč / najvišja frekvenca,
          // tako je naklon (moč) neodvisen od velikosti zrn.
          float evkH = evkZ * ${(0.1 * d.r / Math.max(f1, f2 || 0)).toExponential(3)};
          vec3 evkDx = dFdx( -vViewPosition ); vec3 evkDy = dFdy( -vViewPosition );
          vec3 evkR1 = cross( evkDy, normal ); vec3 evkR2 = cross( normal, evkDx );
          float evkDet = dot( evkDx, evkR1 ) * faceDirection;
          vec3 evkG = sign( evkDet ) * ( dFdx( evkH ) * evkR1 + dFdy( evkH ) * evkR2 );
          normal = normalize( abs( evkDet ) * normal - evkG );
        }`
            : ""
        }`,
      )
      .replace(
        "#include <aomap_fragment>",
        `#include <aomap_fragment>
        {
          // Zapečena okluzija: barva je že zatemnjena (barva oglišč), tu še odboji okolja v pregibih.
          float evkNV = saturate( dot( geometryNormal, geometryViewDir ) );
          float evkSO = saturate( pow( evkNV + vEvkAO, exp2( -16.0 * material.roughness - 1.0 ) ) - 1.0 + vEvkAO );
          reflectedLight.indirectSpecular *= evkSO;
          reflectedLight.indirectDiffuse *= mix( 1.0, vEvkAO, 0.35 );
        }`,
      )
      .replace(
        "#include <opaque_fragment>",
        `float evkFr = 1.0 - abs(dot(normalize(normal), normalize(vViewPosition)));
        ${d?.s && visoka ? `outgoingLight += diffuseColor.rgb * ${fl(d.s)} * pow(evkFr, 1.6) * vEvkAO; // mehka presevnost na robu` : ""}
        ${r.robna ? "diffuseColor.a *= 0.14 + 0.86 * pow(evkFr, 2.0); // tanka ovojnica: prozorna od spredaj, mlečna ob robu" : ""}
        outgoingLight *= uSvetlost;
        outgoingLight += vec3(0.43, 0.61, 1.0) * pow(evkFr, 2.4) * uObroba;
        outgoingLight = mix(outgoingLight, outgoingLight * 0.35 + vec3(0.42, 0.6, 0.95) * pow(evkFr, 1.6) * 0.9, uRob);
        diffuseColor.a *= mix(uAlfa, 1.0, uRob * pow(evkFr, 2.2) * 0.85);
        #include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => `evk-${razred}-${visoka ? "v" : "n"}`;
  return m;
}

// ---------- prerez ----------
// Prerez kot pravi rez telesa (kot pokrovi v organ.js): hrbtne ploskve zaprtih mrež v barvi reza. Ko je ravnina rezanja
// vklopljena, se skozi odrezano mrežo vidi njena oddaljena notranja stena; narisana enakomerno v barvi reza deluje kot
// polna rezna ploskev. Barva = barva dela (barva primerka) × k, pomešana proti beli za »bela« (bledi živci, kite);
// vzorec: »kost« (slonokoščena kost z gobastimi porami, v njih rdečkasto rumen mozeg), »vlakna« (snopi vlaken,
// podolgovati po višini telesa: v vodoravnem rezu pikice, v navpičnem proge), »lise« (mehka lisavost organov).
// potisk (m): pokrov je narisan toliko bližje kameri (le globina, ne lega na zaslonu), da ga ne prekrije sosed, ki se
// z delom v modelu prekriva za milimeter ali dva (preponska kupola v dnu pljuč, jetra); tanki deli (žile, živci) brez,
// sicer bi neprerezani prosevali skozi polnilo.
// null = brez pokrova: prosojni razredi (ovojnica, steklo, koža) ostanejo dvostranski kot prej.
export const REZ = {
  kost: { k: 1, bela: 0.08, vzorec: "kost" },
  hrustanec: { k: 0.94, bela: 0.12, vzorec: "lise" },
  zob: { k: 1, bela: 0.2 },
  vlakno: { k: 0.94, bela: 0.18, vzorec: "vlakna" },
  ovojnica: null,
  misica: { k: 0.74, vzorec: "vlakna" },
  vlazno: { k: 0.8, vzorec: "lise" },
  zila: { k: 0.82, potisk: 0 },
  zivec: { k: 1, bela: 0.38, vzorec: "vlakna", potisk: 0 },
  steklo: null,
  koza: null,
};
// Polnilo telesa v prerezu: podkožno maščevje in vezivo (toplo bledo rumeno-rožnato, lisasto) med deli.
export const POLNILO = { mascoba: "#e0bd85", vezivo: "#d6a690" };

// Skupno senčilom reza: točka na ravnini rezanja vzdolž žarka iz kamere (vzorec leži ravno v rezu, ne na oddaljeni
// steni) in šum, ki zbledi, ko slikovni element pokrije več kot pol cikla (brez migetanja na daljavo).
const GLSL_REZ = `${GLSL_SUM}
uniform vec4 uRez;
vec3 evkTockaReza( vec3 p ) {
  vec3 d = p - cameraPosition;
  float dn = dot( uRez.xyz, d );
  float s = abs( dn ) > 1e-6 ? -( dot( uRez.xyz, cameraPosition ) + uRez.w ) / dn : 1.0;
  return cameraPosition + d * clamp( s, 0.0, 1.0 );
}
float evkSumL( vec3 p, vec3 f, float fw ) { return mix( 0.5, evkSum( p * f ), clamp( 1.6 - fw * max( f.x, max( f.y, f.z ) ) * 1.8, 0.0, 1.0 ) ); }
`;
const VZORCI = {
  kost: `float evkGr = evkSumL( evkR, vec3( 34.0 ), evkFw );
    float evkPo = evkSumL( evkR, vec3( 230.0 ), evkFw ) * 0.62 + evkSumL( evkR, vec3( 560.0 ), evkFw ) * 0.38;
    float evkMo = smoothstep( 0.46, 0.64, evkPo ) * smoothstep( 0.25, 0.6, evkGr );
    diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.74, 0.42, 0.26 ), evkMo * 0.7 );
    diffuseColor.rgb *= 0.95 + 0.1 * evkSumL( evkR, vec3( 900.0 ), evkFw );`,
  vlakna: `diffuseColor.rgb *= 0.86 + 0.26 * evkSumL( evkR, vec3( 420.0, 32.0, 420.0 ), evkFw );
    diffuseColor.rgb *= 0.95 + 0.1 * evkSumL( evkR, vec3( 95.0, 14.0, 95.0 ), evkFw );`,
  lise: `diffuseColor.rgb *= 0.9 + 0.2 * evkSumL( evkR, vec3( 60.0 ), evkFw ) * evkSumL( evkR, vec3( 13.0 ), evkFw );`,
};
const POTISK = 0.003;
function senciloReza(m, { uniforms, barva, kljuc, potisk = 0 }) {
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vEvkPos;").replace(
      "#include <project_vertex>",
      `#include <project_vertex>
      vec4 evkP = vec4( transformed, 1.0 );
      #ifdef USE_BATCHING
        evkP = batchingMatrix * evkP;
      #endif
      vEvkPos = ( modelMatrix * evkP ).xyz;
      ${potisk ? `gl_Position = projectionMatrix * vec4( mvPosition.xyz - normalize( mvPosition.xyz ) * ${fl(potisk)}, 1.0 );` : ""}`,
    );
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vEvkPos;\nuniform float uSvetlost;\n${GLSL_REZ}`)
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        vec3 evkR = evkTockaReza( vEvkPos );
        float evkFw = length( fwidth( evkR ) );
        ${barva}
        diffuseColor.rgb *= uSvetlost;`,
      );
  };
  m.customProgramCacheKey = () => kljuc;
  return m;
}

// Pokrov reza za razred: zadnje ploskve, rezane z isto ravnino. Nariše se za polnilom telesa: kjer je del prerezan,
// ga prekrije, ostali deli za ravnino pa padejo na globinskem preizkusu za svojimi sprednjimi ploskvami.
// uniforms: { uSvetlost, uRez }.
export function materialReza(razred, uniforms, ravnine) {
  const r = REZ[razred];
  if (!r) return null;
  const m = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.BackSide,
    clippingPlanes: ravnine,
  });
  m.userData.rez = razred;
  const barva = `diffuseColor.rgb = mix( diffuseColor.rgb * ${fl(r.k)}, vec3( 0.97, 0.95, 0.9 ), ${fl(r.bela || 0)} );
        ${r.vzorec ? VZORCI[r.vzorec] : ""}`;
  return senciloReza(m, { uniforms, barva, kljuc: `evk-rez-${razred}`, potisk: r.potisk ?? POTISK });
}

// Točka ravnine je v telesu, če žarek od nje stran od kamere prečka zunanjo ploskev kože liho mnogokrat (bit 1
// šablone, materialParnosti). Polnilo ne piše globine: pokrovi prerezanih delov (za ravnino) ga nato prekrijejo.
export function materialPolnila(uniforms) {
  const m = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    depthWrite: false,
    stencilWrite: true,
    stencilRef: 1,
    stencilFuncMask: 1,
    stencilWriteMask: 0,
    stencilFunc: THREE.EqualStencilFunc,
  });
  const c = (h) => {
    const x = new THREE.Color(h);
    return `vec3( ${fl(+x.r.toFixed(4))}, ${fl(+x.g.toFixed(4))}, ${fl(+x.b.toFixed(4))} )`;
  };
  const barva = `float evkLi = evkSumL( evkR, vec3( 60.0 ), evkFw ) * 0.55 + evkSumL( evkR, vec3( 170.0 ), evkFw ) * 0.45;
        diffuseColor.rgb = mix( ${c(POLNILO.mascoba)}, ${c(POLNILO.vezivo)}, smoothstep( 0.38, 0.72, evkLi ) * 0.6 );
        diffuseColor.rgb *= 0.95 + 0.08 * evkSumL( evkR, vec3( 420.0 ), evkFw );`;
  return senciloReza(m, { uniforms, barva, kljuc: "evk-polnilo" });
}

// Parnost prečkanj kože za ravnino (vsaka ploskev obrne bit 1 šablone; brez barve in globine).
export function materialParnosti(ravnine) {
  return new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
    clippingPlanes: ravnine,
    stencilWrite: true,
    stencilRef: 1,
    stencilWriteMask: 1,
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilFail: THREE.InvertStencilOp,
    stencilZFail: THREE.InvertStencilOp,
    stencilZPass: THREE.InvertStencilOp,
  });
}
