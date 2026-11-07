// Barvni način 3D modelov (j, 6. 11.): »Naravne barve« = realistične, učbeniške (pečene teksture: aorta nasičeno
// rdeča, pljučne vene rdeče-vijolične, vene brez modre) in »Učne barve« = visok kontrast (arterije rdeče, vene modre,
// vsak del svoja barva; legenda = seznam delov ob modelu z enakimi barvami). Skupno za vse 3D organe (organ.js) in atlas
// telesa (atlas.js: ucnaBarvaTkiva po razredu tkiva in sistemu);
// izbira velja za vse modele in ostane v brskalniku (localStorage, samo udobje).
const KLJUC = "evklid.barve3d";
let nacin = null;

// privzeto: brez shranjene izbire (OŠ: učne barve, enako v celoti in prerezu; ostali: naravne)
export function barvniNacin(privzeto = "naravne") {
  if (nacin) return nacin;
  let v = null;
  try {
    v = localStorage.getItem(KLJUC);
  } catch {}
  return v === "ucne" || v === "naravne" ? (nacin = v) : privzeto === "ucne" ? "ucne" : "naravne";
}

export function nastaviBarvniNacin(n) {
  nacin = n === "ucne" ? "ucne" : "naravne";
  try {
    localStorage.setItem(KLJUC, nacin);
  } catch {}
  return nacin;
}

// Učna barva dela: »ucnaBarva« dela, sicer barva skupine (posamezna venčna žila = barva venčnih arterij), sicer »barva«.
export function ucnaBarva(d, poId = new Map()) {
  if (!d) return "#9aa4b2";
  return d.ucnaBarva || (d.skupina && poId.get(d.skupina)?.ucnaBarva) || d.barva || "#9aa4b2";
}

// Učne barve atlasa po razredu tkiva (tkiva.js) in sistemu: arterije rdeče, vene modre, živci rumeni, limfa zelena,
// kosti svetle, mišice rdeče; vsak organ svoj jasen odtenek (po imenu), da se sosednji organi ločijo.
const UCNE_RAZREDI = { kost: "#efe3c2", zob: "#fbf8ee", misica: "#cf3f37", zivec: "#f2c400", koza: "#f1c7a6", hrustanec: "#7fb3e0", vez: "#b9c6d6" };
const UCNE_SISTEMI = { sklepi: "#7fb3e0", limfni: "#2fae5a", zivcevje: "#f2c400", koza: "#f1c7a6", okostje: "#efe3c2", misice: "#cf3f37" };
export function ucnaBarvaTkiva(razred, row = {}) {
  const mat = String(row.material || "");
  if (/^Arter/i.test(mat)) return "#e0242c";
  if (/^Vein/i.test(mat)) return "#2a5fd6";
  if (/^Lymph/i.test(mat)) return "#2fae5a";
  if (row.sistem === "organi") {
    let h = 2166136261;
    const k = String(row.ime || row.id || "").replace(/\.[lr]$/i, "");
    for (let i = 0; i < k.length; i++) h = Math.imul(h ^ k.charCodeAt(i), 16777619);
    const hue = Math.round(((h >>> 0) % 360));
    return `hsl(${hue}, 62%, 55%)`;
  }
  return UCNE_RAZREDI[razred] || UCNE_SISTEMI[row.sistem] || "#c08a80";
}
