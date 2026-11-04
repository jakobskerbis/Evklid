// Katera kartica lista s formulami ima skico: ključ »<list>|<ime kartice>« (ime kot v content/formulas/*.md).
// Skica se naloži šele, ko je kartica vidna.
export const SKICE = {
  "MAT-SS|Realna števila in intervali": () => import("./intervali.js"),
  "MAT-SS|Kompleksna števila": () => import("./kompleksna.js"),
  "MAT-SS|Množice, operacije": () => import("./mnozice.js"),
  "MAT-SS|Moč množice": () => import("./moc-mnozice.js"),
  "MAT-SS|Pravokotni trikotnik": () => import("./pravokotni-trikotnik.js"),
  "MAT-SS|Zveze": () => import("./zveze.js"),
  "MAT-SS|Periodičnost": () => import("./periodicnost.js"),
  "MAT-SS|Sinusna krivulja": () => import("./sinusna.js"),
  "MAT-SS|Krožne funkcije": () => import("./krozne.js"),
};

export function skicaZa(list, ime) {
  return SKICE[`${list}|${String(ime || "").trim()}`] || null;
}
