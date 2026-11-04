// Oko v 3D (»Organi v 3D«): zrklo iz HuBMAP HRA (CC BY 4.0), mišice in vidni živec iz Z-Anatomy (CC BY-SA 4.0); deli in besedila v ../organi-3d/oko.json.
// Gradi ga skupni graditelj organov iz GLB (public/3d/organ.js, docs/3d.md »Organi iz GLB«).
export const info = {
  id: "organ-oko",
  naslov: "Oko",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Zrklo s plastmi stene, roženico, šarenico, lečo in steklovino ter očesne mišice; prerez pokaže debelino sten.",
  merilo: { m: 0.024, oznaka: "2,4 cm" },
};
export const organ = "oko";
export const zgradi = (THREE, ctx) => ctx.organ(organ);
