// Pljuča v 3D (»Organi v 3D«): model iz Z-Anatomy (CC BY-SA 4.0), deli in besedila v ../organi-3d/pljuca.json.
// Gradi ga skupni graditelj organov iz GLB (public/3d/organ.js, docs/3d.md »Organi iz GLB«).
export const info = {
  id: "organ-pljuca",
  naslov: "Pljuča",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Pet pljučnih režnjev, sapnik, bronhiji in pljučne žile; prerez pokaže bronhije in žile v pljučnem tkivu.",
  merilo: { m: 0.27, oznaka: "27 cm" },
};
export const organ = "pljuca";
export const zgradi = (THREE, ctx) => ctx.organ(organ);
