// Drevo »3D svet« (j 13. 11. 2026, osnutek »3D svet kot drevo«): zbirka se odpre na štirih predmetih, tap na vejo
// pokaže njene podveje, zadnja veja pokaže modele. Ikone vej so izrisi Cycles v slogu aplikacije
// (public/3d/ikone-drevo/<slog>/<id>.webp, scripts/3d-ikone-drevo/, docs/3d.md »Ikone vej drevesa«).
// Vsak model iz public/3d/modeli/<področje>/index.js mora biti vsaj v eni veji (test/3d-drevo.test.js); model, ki ga
// drevo še ne pozna, zbirka pokaže pod »Novo v 3D svetu«, da ni nikoli skrit.

// Barve skupin (ista paleta kot ikone sloga Čist).
export const BARVE = { bio: "#2fb36b", kem: "#9b6cf0", fiz: "#3d8bfd", mat: "#f0a020" };

// Slogi, za katere obstaja nabor ikon; Igriv in neznan slog uporabita Čist.
export const SLOGI_IKON = ["cist", "antik", "renesansa", "bagdad", "indija", "egipt"];
export const slogIkon = (slog) => (SLOGI_IKON.includes(slog) ? slog : "cist");
export const ikonaVeje = (id, slog) => `/3d/ikone-drevo/${slogIkon(slog)}/${id}.webp`;

// Veja: { id, otroci: [veje] } ali { id, modeli: [id modela] } ali { id, povezava: "atlas" }; sk (skupina) le na vrhu.
export const DREVO = [
  {
    id: "biologija",
    sk: "bio",
    otroci: [
      {
        id: "telo",
        otroci: [
          { id: "atlas", povezava: "atlas" },
          {
            id: "organi",
            otroci: [
              { id: "glava", modeli: ["organ-mozgani", "organ-oko", "organ-mreznica"] },
              { id: "prsni-kos", modeli: ["organ-srce", "organ-pljuca", "organ-mesicki"] },
              { id: "trebuh", modeli: ["organ-jetra", "organ-jetrni-reznjic", "organ-ledvica", "organ-nefron"] },
            ],
          },
          {
            id: "celice-telesa",
            otroci: [
              { id: "kri", modeli: ["celica-eritrocit", "celica-levkociti", "celica-trombocit"] },
              { id: "misice", modeli: ["celica-gladka-misicna", "celica-skeletno-misicno-vlakno", "celica-srcna-misicna"] },
              { id: "zivci", modeli: ["celica-nevron", "celica-palicica-cepek"] },
              {
                id: "druge-celice",
                otroci: [
                  { id: "tkiva", modeli: ["celica-epitelna", "celica-casasta", "celica-osteocit", "celica-mascobna"] },
                  { id: "spolne", modeli: ["celica-spermij", "celica-jajcece"] },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "mikrobi",
        otroci: [
          { id: "celica-blizu", modeli: ["celica-zivalska", "celica-rastlinska", "celice-primerjava"] },
          { id: "bakterije-glive", modeli: ["celica-bakterijska", "celica-kvasovka"] },
          { id: "virusi", modeli: ["virus-bakteriofag-t4", "virus-sars-cov-2", "virus-hiv"] },
          { id: "enocelicarji", modeli: ["celica-ameba", "celica-paramecij", "celica-evglena"] },
        ],
      },
      {
        id: "rastline",
        otroci: [
          { id: "list", modeli: ["celica-palisadna", "celica-zapiralka", "fotosinteza"] },
          { id: "korenina", modeli: ["celica-koreninski-lasek", "celica-ksilem-floem"] },
        ],
      },
      { id: "procesi", modeli: ["mitoza", "mejoza", "sinteza-beljakovin", "fotosinteza"] },
    ],
  },
  {
    id: "kemija",
    sk: "kem",
    otroci: [
      { id: "atom", modeli: ["atom", "orbitale", "periodni-sistem"] },
      { id: "molekule-kristali", modeli: ["molekule", "kristali"] },
      { id: "molekule-zivljenja", modeli: ["dnk", "beljakovina"] },
    ],
  },
  {
    id: "fizika-vesolje",
    sk: "fiz",
    otroci: [
      { id: "polja", modeli: ["elektricno-polje", "magnetno-polje"] },
      { id: "vesolje", modeli: ["soncni-sistem", "letni-casi", "lunine-mene", "mrki"] },
    ],
  },
  { id: "matematika", sk: "mat", modeli: ["telesa", "graf-ploskev"] },
];

// Pot iz naslova (»biologija/telo/organi«) v seznam vej od vrha; neznan del pot odreže (stara ali pokvarjena povezava).
export function poPoti(pot) {
  const veje = [];
  let raven = DREVO;
  for (const id of String(pot || "").split("/").filter(Boolean)) {
    const v = raven?.find((x) => x.id === id);
    if (!v || !v.otroci && !v.modeli) break;
    veje.push(v);
    raven = v.otroci;
  }
  return veje;
}

// Vsi modeli pod vejo (atlas šteje kot eden); obstaja = množica id-jev, ki jih strežnik res ima (manjkajoče ne štejemo).
export function modeliVeje(v, obstaja = null) {
  const out = new Set();
  const pojdi = (x) => {
    if (x.povezava) out.add(x.povezava);
    for (const m of x.modeli || []) if (!obstaja || obstaja.has(m)) out.add(m);
    for (const o of x.otroci || []) pojdi(o);
  };
  pojdi(v);
  return [...out];
}

// Vsi modeli v drevesu (brez povezav, kot je atlas).
export function vsiModeliDrevesa() {
  const out = new Set();
  const pojdi = (x) => {
    for (const m of x.modeli || []) out.add(m);
    for (const o of x.otroci || []) pojdi(o);
  };
  DREVO.forEach(pojdi);
  return out;
}

// Vse veje (za preizkus ikon in prevodov).
export function vseVeje() {
  const out = [];
  const pojdi = (x) => {
    out.push(x.id);
    for (const o of x.otroci || []) pojdi(o);
  };
  DREVO.forEach(pojdi);
  return out;
}
