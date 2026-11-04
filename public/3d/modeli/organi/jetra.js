// Jetra z žolčnikom v 3D (»Organi v 3D«): model iz Z-Anatomy (CC BY-SA 4.0), deli in besedila v ../organi-3d/jetra.json.
// Gradi ga skupni graditelj organov iz GLB (public/3d/organ.js, docs/3d.md »Organi iz GLB«).
export const info = {
  id: "organ-jetra",
  naslov: "Jetra z žolčnikom",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Jetrni režnji, žolčnik, žolčevod, portalna vena in jetrne žile; prerez pokaže notranjost režnjev in meje med jetrnimi segmenti.",
  merilo: { m: 0.22, oznaka: "22 cm" },
};
export const organ = "jetra";
export const zgradi = (THREE, ctx) => ctx.organ(organ);
