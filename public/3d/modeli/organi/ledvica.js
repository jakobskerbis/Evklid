// Ledvica v 3D (»Organi v 3D«): model iz HuBMAP HRA (CC BY 4.0) in Z-Anatomy (CC BY-SA 4.0), deli in besedila v ../organi-3d/ledvica.json.
// Gradi ga skupni graditelj organov iz GLB (public/3d/organ.js, docs/3d.md »Organi iz GLB«).
export const info = {
  id: "organ-ledvica",
  naslov: "Ledvica",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Ovojnica, skorja, piramide in papile, sečevod in ledvični žili; prerez pokaže skorjo in sredico.",
  merilo: { m: 0.12, oznaka: "12 cm" },
};
export const organ = "ledvica";
export const zgradi = (THREE, ctx) => ctx.organ(organ);
