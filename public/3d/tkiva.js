// Materiali tkiv za atlas telesa: ime materiala Z-Anatomy (atlas-strukture.json → material) → razred senčenja in barva.
// Razredov je malo (kost, hrustanec, zob, vlakna, mišica, vlažno tkivo, živec, steklo, koža), barvo nosi vsak del
// posebej (barva primerka v BatchedMesh), zato je klicev risanja malo: plast × razred.
import { THREE } from "./scena.js";

// Razredi senčenja (MeshPhysicalMaterial). Pri nizki kakovosti brez sijaja (sheen) in laka (clearcoat): hitreje.
const RAZREDI = {
  kost: { roughness: 0.68, clearcoat: 0.04, clearcoatRoughness: 0.6, zrno: 1 },
  hrustanec: { roughness: 0.3, clearcoat: 0.4, clearcoatRoughness: 0.35, sheen: 0.45, sheenColor: "#d6e8ff", sheenRoughness: 0.45 },
  zob: { roughness: 0.16, clearcoat: 0.9, clearcoatRoughness: 0.12 },
  vlakno: { roughness: 0.38, sheen: 1, sheenColor: "#ffffff", sheenRoughness: 0.32, clearcoat: 0.22, clearcoatRoughness: 0.35 },
  misica: { roughness: 0.5, sheen: 0.75, sheenColor: "#ff9a8c", sheenRoughness: 0.42, clearcoat: 0.14, clearcoatRoughness: 0.45, zrno: 2 },
  vlazno: { roughness: 0.36, clearcoat: 0.6, clearcoatRoughness: 0.22, sheen: 0.25, sheenColor: "#ffd0c8", sheenRoughness: 0.5 },
  zivec: { roughness: 0.4, sheen: 0.7, sheenColor: "#fff2b8", sheenRoughness: 0.4, clearcoat: 0.3, clearcoatRoughness: 0.3 },
  steklo: { roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.05, prosojno: 0.32 },
  koza: { roughness: 0.55, sheen: 0.55, sheenColor: "#ffd9c7", sheenRoughness: 0.5, clearcoat: 0.08, clearcoatRoughness: 0.5, prosojno: 0.5 },
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
  Fascia: ["vlakno", "#d8c3ae"],
  Artery: ["vlazno", "#c3262c"],
  Vein: ["vlazno", "#2f5ba8"],
  // Pljučna arterija nosi kri brez kisika (modro), pljučne vene kri s kisikom (rdeče).
  "Pulmonary artery": ["vlazno", "#3a64b8"],
  "Pulmonary vein": ["vlazno", "#c9343a"],
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

// Skupni dodatek senčilnikom: zrno kosti in mišice (prostorski šum), prosojnost za zatemnitev in rentgen
// (rob se ob rentgenu poudari kot steklo). uAlfa: 1 = običajno; uRob: 0 … 1 (rentgen); uSvetlost: 1 = običajno,
// manj = zatemnjeno (ostali deli, ko je en izbran); uObroba: modra obroba izbranega dela.
const GLSL_SUM = `
float evkHash(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float evkSum(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(evkHash(i+vec3(0,0,0)),evkHash(i+vec3(1,0,0)),f.x), mix(evkHash(i+vec3(0,1,0)),evkHash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(evkHash(i+vec3(0,0,1)),evkHash(i+vec3(1,0,1)),f.x), mix(evkHash(i+vec3(0,1,1)),evkHash(i+vec3(1,1,1)),f.x),f.y), f.z); }
`;

export function ustvariMaterial(razred, kakovost, skupno) {
  const r = RAZREDI[razred] || RAZREDI.vlazno;
  const visoka = kakovost === "visoka";
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: r.roughness,
    metalness: 0,
    clearcoat: visoka || razred === "zob" || razred === "steklo" ? r.clearcoat || 0 : 0,
    clearcoatRoughness: r.clearcoatRoughness ?? 0.3,
    sheen: visoka ? r.sheen || 0 : 0,
    sheenColor: new THREE.Color(r.sheenColor || "#ffffff"),
    sheenRoughness: r.sheenRoughness ?? 0.5,
    envMapIntensity: 1,
  });
  m.userData.razred = razred;
  m.userData.osnovaProsojnost = r.prosojno ?? 1;
  if (r.prosojno) {
    m.transparent = true;
    m.opacity = r.prosojno;
    m.depthWrite = false;
  }
  const uniforms = { uAlfa: skupno.uAlfa, uRob: skupno.uRob, uSvetlost: skupno.uSvetlost, uObroba: skupno.uObroba || { value: 0 } };
  const zrno = r.zrno || 0;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vEvkPos;")
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
      .replace("#include <common>", `#include <common>\nvarying vec3 vEvkPos;\nuniform float uAlfa;\nuniform float uRob;\nuniform float uSvetlost;\nuniform float uObroba;\n${GLSL_SUM}`)
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        ${zrno === 1 ? "float evkZ = evkSum(vEvkPos * 90.0) * 0.6 + evkSum(vEvkPos * 340.0) * 0.4; diffuseColor.rgb *= 0.9 + 0.13 * evkZ;" : ""}
        ${zrno === 2 ? "float evkZ = evkSum(vEvkPos * vec3(160.0, 40.0, 160.0)); diffuseColor.rgb *= 0.92 + 0.12 * evkZ;" : ""}`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        ${zrno ? "roughnessFactor = clamp(roughnessFactor + (evkZ - 0.5) * 0.14, 0.04, 1.0);" : ""}`,
      )
      .replace(
        "#include <opaque_fragment>",
        `float evkFr = 1.0 - abs(dot(normalize(normal), normalize(vViewPosition)));
        outgoingLight *= uSvetlost;
        outgoingLight += vec3(0.43, 0.61, 1.0) * pow(evkFr, 2.4) * uObroba;
        outgoingLight = mix(outgoingLight, outgoingLight * 0.35 + vec3(0.42, 0.6, 0.95) * pow(evkFr, 1.6) * 0.9, uRob);
        diffuseColor.a *= mix(uAlfa, 1.0, uRob * pow(evkFr, 2.2) * 0.85);
        #include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => `evk-${zrno}`;
  return m;
}
