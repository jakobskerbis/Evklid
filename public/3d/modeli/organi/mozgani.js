// Možgani v 3D (»Organi v 3D«): model iz Z-Anatomy (CC BY-SA 4.0), deli in besedila v ../organi-3d/mozgani.json.
// Gradi ga skupni graditelj organov iz GLB (public/3d/organ.js, docs/3d.md »Organi iz GLB«).
export const info = {
  id: "organ-mozgani",
  naslov: "Možgani",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Veliki možgani z režnji, mali možgani in možgansko deblo; prerez po sredini pokaže žuljevo telo in talamus.",
  merilo: { m: 0.17, oznaka: "17 cm" },
};
export const organ = "mozgani";
export const zgradi = (THREE, ctx) => ctx.organ(organ);
