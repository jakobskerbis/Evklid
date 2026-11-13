// Srce v 3D (»Organi v 3D«): model iz Z-Anatomy (CC BY-SA 4.0), deli in besedila v ../organi-3d/srce.json.
// Gradi ga skupni graditelj organov iz GLB (public/3d/organ.js, docs/3d.md »Organi iz GLB«).
export const info = {
  id: "organ-srce",
  naslov: "Srce",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Štirje srčni prostori, zaklopke, aorta in venčne žile; prerez odpre srce in pokaže prekate in preddvora.",
  merilo: { m: 0.13, oznaka: "13 cm" },
};
export const organ = "srce";
export const zgradi = (THREE, ctx) => ctx.organ(organ);
