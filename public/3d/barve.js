// Barvni način 3D modelov (j, 6. 11.): »Naravne barve« = realistične, učbeniške (pečene teksture: aorta nasičeno
// rdeča, pljučne vene rdeče-vijolične, vene brez modre) in »Učne barve« = visok kontrast (arterije rdeče, vene modre,
// vsak del svoja barva; legenda = seznam delov ob modelu z enakimi barvami). Skupno za vse 3D organe (organ.js);
// izbira velja za vse modele in ostane v brskalniku (localStorage, samo udobje).
const KLJUC = "evklid.barve3d";
let nacin = null;

export function barvniNacin() {
  if (nacin) return nacin;
  try {
    nacin = localStorage.getItem(KLJUC) === "ucne" ? "ucne" : "naravne";
  } catch {
    nacin = "naravne";
  }
  return nacin;
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
