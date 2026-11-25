// Naloge maturitetnega poskusa (lab-matura.js, docs/laboratorij.md »Maturitetni poskus«): vsaka v public/sim/matura/<ključ>.js.
import labCo2 from "./matura/lab-co2.js";
import labElektroliza from "./matura/lab-elektroliza.js";
import labGrelnik from "./matura/lab-grelnik.js";
import labHitrost from "./matura/lab-hitrost.js";
import labHooke from "./matura/lab-hooke.js";
import labLom from "./matura/lab-lom.js";
import labNewton2 from "./matura/lab-newton2.js";
import labOhm from "./matura/lab-ohm.js";
import labProstiPad from "./matura/lab-prosti-pad.js";
import labTitracija from "./matura/lab-titracija.js";

export const MATURA = {
  "lab-titracija": labTitracija,
  "lab-ohm": labOhm,
  "lab-prosti-pad": labProstiPad,
  "lab-newton2": labNewton2,
  "lab-co2": labCo2,
  "lab-hooke": labHooke,
  "lab-grelnik": labGrelnik,
  "lab-elektroliza": labElektroliza,
  "lab-lom": labLom,
  "lab-hitrost": labHitrost,
};
export const imaMaturo = (key) => Object.hasOwn(MATURA, key);
