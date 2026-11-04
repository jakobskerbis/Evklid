// Katera kartica lista s formulami ima skico: ključ »<list>|<ime kartice>« (ime kot v content/formulas/*.md).
// Skica se naloži šele, ko je kartica vidna.
export const SKICE = {
  "MAT-SS|Pravokotni trikotnik": () => import("./pravokotni-trikotnik.js"),
};

export function skicaZa(list, ime) {
  return SKICE[`${list}|${String(ime || "").trim()}`] || null;
}
