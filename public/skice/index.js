// Katera kartica lista s formulami ima skico: ključ »<list>|<ime kartice>« (ime kot v content/formulas/*.md).
// Skica se naloži šele, ko je kartica vidna.
// Ista skica z drugo nastavitvijo (npr. lik ali krožnici): naloži modul in mu poda opcije.
const z = (nalozi, opcije) => () => nalozi().then((m) => ({ default: (host) => m.default(host, opcije) }));

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
  "MAT-SS|Potenčna in korenska funkcija": () => import("./potencna.js"),
  "MAT-SS|Temenska oblika": () => import("./kvadratna.js"),
  "MAT-SS|Definicija": () => import("./eksponentna.js"), // edina kartica »Definicija« na listu (Eksponentna funkcija in logaritmi)
  "MAT-SS|Skalarni produkt": () => import("./vektorja.js"),
  "MAT-SS|Razdalja točk": () => import("./tocke.js"),
  "MAT-SS|Krožnica": () => import("./kroznica.js"),
  "MAT-SS|Elipsa": () => import("./elipsa.js"),
  "MAT-SS|Hiperbola": () => import("./hiperbola.js"),
  "MAT-SS|Parabola": () => import("./parabola.js"),
  "MAT-SS|Premica": () => import("./linearna.js"),
  "MAT-OS|Linearna funkcija": () => import("./linearna-os.js"),
  "MAT-SS|Sinusni izrek": () => import("./sinusni.js"),
  "MAT-SS|Kosinusni izrek": () => import("./kosinusni.js"),
  "MAT-SS|Polmera": z(() => import("./trikotnik.js"), { krozici: true }),
  "MAT-OS|Trikotnik": () => import("./trikotnik.js"),
  "MAT-OS|Enakostranični trikotnik": () => import("./enakostranicni.js"),
  "MAT-OS|Pitagorov izrek": () => import("./pitagora.js"),
  "MAT-OS|Diagonale $n$-kotnika": () => import("./nkotnik.js"),
  "MAT-OS|Krožni lok, izsek": () => import("./izsek.js"),
  ...Object.fromEntries(["Kvadrat", "Pravokotnik", "Paralelogram", "Romb", "Trapez", "Deltoid"].map((ime) => [`MAT-OS|${ime}`, z(() => import("./liki.js"), ime.toLowerCase())])),
};

// Ime kartice brez TeX ločil: »Diagonale $n$-kotnika« (v .md) = »Diagonale n-kotnika« (vidno besedilo).
const brezTex = (t) => String(t || "").replace(/\$/g, "").replace(/\s+/g, " ").trim();
const PO_IMENU = new Map(Object.entries(SKICE).map(([k, v]) => [brezTex(k), v]));

export function skicaZa(list, ime) {
  return PO_IMENU.get(`${list}|${brezTex(ime)}`) || null;
}
