// Vaja po razlagi iz generatorjev (P1-3, del A; j 25. 11. 2026, načrt treh prioritet): po razlagi učenec dobi gumb
// »Podobna naloga«, ki odpre nalogo iz Vadnice za isto temo. Nalogo ustvari generator in odgovor preveri koda
// (server/practice/check.js prek progress.answer), zato vaje ne izmisli model in rezultat šteje v napredek in šibke
// točke kot vsaka naloga iz Vadnice (P1-4).
// Inštruktor gumb zahteva z blokom <<ODPRI vaja="tema">> (server/odpri.js). Pravilo v pozivu, kdaj ga napisati, doda
// profil B (#539); do tedaj je stikalo EVKLID_VAJA_PO_RAZLAGI izklopljeno in gumba ni.
// Tema se išče kot pri gumbu za lekcijo: najprej natančno ime teme učenčeve stopnje (topicForName), sicer ena izmed
// prvih treh lekcij, ki ima v naslovu vsaj dve tretjini besed iz poizvedbe. Tema brez generatorja → nič (gumba ni);
// nikoli napačna tema.
// Nadomesti: nič. Podobne naloge si je do zdaj izmislil model v odgovoru; ta modul jih ne podvaja, ampak preusmeri v
// obstoječo Vadnico (progress.nextPractice), ki ostane edino mesto za naloge.
import { rankLessons, topicForName, terms } from "./lekcija-za-vprasanje.js";
import { hasGenerator } from "./practice/index.js";
import { getTopic } from "./curriculum.js";

export const vajaVklopljena = () => process.env.EVKLID_VAJA_PO_RAZLAGI === "1";

/** Tema učenčeve stopnje z generatorjem nalog za poizvedbo (ime teme ali snovi) ali null. */
export function temaZVajo(q, settings) {
  const besede = new Set(terms(q));
  if (!besede.size) return null;
  const natancna = topicForName(q, settings);
  const kandidati = natancna ? [natancna] : rankLessons(q, settings).slice(0, 3).filter((r) => r.inTitle >= Math.ceil((besede.size * 2) / 3)).map((r) => r.d.id);
  for (const id of kandidati) {
    if (!hasGenerator(id)) continue;
    const tema = getTopic(id);
    if (tema) return { topicId: id, title: tema.name || tema.title || id };
  }
  return null;
}
