// Naloge maturitetnega poskusa (lab-matura.js, docs/laboratorij.md »Maturitetni poskus«): vsaka v public/sim/matura/<ključ>.js.
import labNewton2 from "./matura/lab-newton2.js";
import labOhm from "./matura/lab-ohm.js";
import labProstiPad from "./matura/lab-prosti-pad.js";
import labTitracija from "./matura/lab-titracija.js";
import labHooke from "./matura/lab-hooke.js";
import labLom from "./matura/lab-lom.js";
import labGrelnik from "./matura/lab-grelnik.js";

export const MATURA = {
  "lab-newton2": labNewton2,
  "lab-ohm": labOhm,
  "lab-prosti-pad": labProstiPad,
  "lab-titracija": labTitracija,
  "lab-hooke": labHooke,
  "lab-lom": labLom,
  "lab-grelnik": labGrelnik,
};
export const imaMaturo = (key) => Object.hasOwn(MATURA, key);
