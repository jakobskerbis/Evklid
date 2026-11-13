// Slovenski državni izpiti kot poskusni izpit na čas: NPZ (6. in 9. razred) in splošna matura.
// Teme so iz slovenskih učnih poti (naloge v slovenščini), sklop = razred ali letnik.
// Vir formata: RIC, Predmetni izpitni katalog za splošno maturo – Matematika (2021 in naprej,
// https://www.ric.si/mma/M-MAT-2021/2019082714564660/): pola 1 (brez računala) in 2 po 90 minut in 40 %,
// ustni 20 %; OR: 8 kratkih nalog do 3 točke + 6 krajših strukturiranih po 5–8 točk = 60 točk na polo.
// Fizika (M-FIZ-2021): pola 1 = 35 vprašanj izbirnega tipa, 90 min, 35 %; pola 2 90 min, 45 %; vaje 20 %.
// Kemija (M-KEM-2020, https://www.ric.si/mma/M-KEM-2020/2018083013280493/): pola 1 = 35 nalog izbirnega tipa
// (do 2019 jih je bilo 40), 90 min, 35 %; pola 2 90 min, 45 %; vaje 20 %.
// Biologija (M-BIO-2021): pola 1 = 40 nalog izbirnega tipa, 90 min, 40 %; pola 2 90 min, 40 %; vaje 20 %.
// NPZ: vsak preizkus traja 60 minut (RIC).
// Poklicna matura – matematika (tretji predmet): RIC, Predmetni izpitni katalog za poklicno maturo 2026 –
// matematika (https://www.ric.si/mma/PIK-MAT-2026_popravljen.pdf/2025100613375221/, stran predmeta
// https://www.ric.si/poklicna-matura/predmeti/tretji-predmet/matematika/): ena izpitna pola, 120 minut, 70 točk
// (70 %), ustni izpit 30 %; 1. del = 11 krajših nalog (7 × 4, 2 × 5, 2 × 6 točk = 50), 2. del = 3 sestavljene
// izbirne naloge po 10 točk, kandidat reši 2. Ena raven (brez OR/VR).
import { PATHS } from "./curriculum-data.js";
import { group } from "./exam-helpers.js";

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Sklopi izpita iz celih učnih poti: en sklop na razred/letnik, vse teme poti.
// Ime, ki se v izpitu ponovi (ista tema v dveh letnikih), dobi oznako razreda.
function unitsFrom(keys, title) {
  const seen = new Set();
  return keys.map((key) => {
    const grade = key.split("-")[2];
    const topics = PATHS[key].units.flatMap(([, list]) =>
      list.map((line) => {
        const [name, goals = ""] = line.split("=>")[0].split("|").map((x) => x.trim());
        const label = seen.has(name) ? `${name} (${title(grade)})` : name;
        seen.add(name);
        return `${label} | ${goals} => ${key}/${slug(name)}`;
      }),
    );
    return [title(grade), topics];
  });
}
// Sklopi iz izbranih tem učnih poti (»MAT-SS-2/Kvadratna funkcija«): za izpit, ki ne zajame vse snovi letnika.
function unitsPick(spec) {
  return spec.map(([title, refs]) => [
    title,
    refs.map((ref) => {
      const [key, name] = ref.split("/");
      const line = PATHS[key].units.flatMap(([, list]) => list).find((l) => l.split("|")[0].trim() === name);
      if (!line) throw new Error(`${ref}: tema ne obstaja`);
      const goals = (line.split("=>")[0].split("|")[1] || "").trim();
      return `${name} | ${goals} => ${key}/${slug(name)}`;
    }),
  ]);
}
const razred = (g) => `${g}. razred`;
const letnik = (g) => `${g}. letnik`;

export const EXAMS_SI = {
  NPZ6: {
    name: "NPZ 6. razred",
    full: "Nacionalno preverjanje znanja v 6. razredu",
    country: "Slovenija",
    systems: ["SI"],
    track: "OSNOVNA_SOLA",
    forLevel: [6, 6],
    board: true,
    about:
      "NPZ iz matematike v 6. razredu traja 60 minut in je pisni preizkus z večinoma odprtimi nalogami: rešuješ jih po korakih, del točk dobiš tudi za postopek. Rezultat ne vpliva na oceno. Poskusni preizkus je iz snovi 6. razreda, na čas in v enem poskusu.",
    subjects: {
      MAT: {
        units: unitsFrom(["MAT-OS-6"], razred),
        mock: { minutes: 45, groups: [group(6, "numeric", 1, 2), group(5, "numeric", 2, 3), group(2, "numeric", 3, 4)] },
      },
    },
  },
  NPZ9: {
    name: "NPZ 9. razred",
    full: "Nacionalno preverjanje znanja v 9. razredu",
    country: "Slovenija",
    systems: ["SI"],
    track: "OSNOVNA_SOLA",
    forLevel: [7, 9],
    board: true,
    about:
      "NPZ v 9. razredu je iz slovenščine, matematike in tretjega predmeta, ki ga vsako leto določi minister (med možnimi so fizika, kemija in biologija). Vsak preizkus traja 60 minut, naloge so večinoma odprte in točkovane po korakih. Pri vpisu na srednje šole z omejitvijo lahko rezultat šteje pri izbiri. Poskusni preizkus zajame snov od 6. do 9. razreda.",
    subjects: {
      MAT: {
        units: unitsFrom(["MAT-OS-6", "MAT-OS-7", "MAT-OS-8", "MAT-OS-9"], razred),
        mock: { minutes: 60, groups: [group(6, "numeric", 1, 2), group(6, "numeric", 2, 3), group(3, "numeric", 3, 5)] },
      },
      FIZ: {
        units: unitsFrom(["FIZ-OS-8", "FIZ-OS-9"], razred),
        mock: { minutes: 45, groups: [group(5, "choice", 1, 1), group(5, "numeric", 2, 2), group(3, "numeric", 3, 4)] },
      },
      KEM: {
        units: unitsFrom(["KEM-OS-8", "KEM-OS-9"], razred),
        mock: { minutes: 45, groups: [group(5, "choice", 1, 1), group(5, "numeric", 2, 2), group(3, "numeric", 3, 4)] },
      },
      BIO: {
        units: unitsFrom(["BIO-OS-8", "BIO-OS-9"], razred),
        mock: { minutes: 45, groups: [group(8, "choice", 1, 1), group(5, "choice", 2, 2), group(2, "numeric", 3, 3)] },
      },
    },
  },
  MATURA: {
    name: "Splošna matura",
    full: "Splošna matura (gimnazija)",
    country: "Slovenija",
    systems: ["SI"],
    track: "SREDNJA_SOLA",
    forLevel: [10, 13],
    board: true,
    about:
      "Matematika: izpitna pola 1 (brez računala) in pola 2 po 90 minut (vsaka 40 % ocene) ter ustni izpit (20 %); na osnovni ravni ima pola 8 kratkih nalog (do 3 točke) in 6 krajših strukturiranih nalog (5–8 točk). Fizika in kemija: pola 1 ima 35 vprašanj izbirnega tipa (90 minut), pola 2 (90 minut) strukturirane naloge. Biologija: pola 1 ima 40 vprašanj izbirnega tipa (90 minut), pola 2 (90 minut) strukturirane naloge. Pri fiziki, kemiji in biologiji 20 % ocene prinesejo laboratorijske vaje. Poskusni izpit je polovica izpitne pole 1 na čas. Pred maturo preveri veljavni predmetni izpitni katalog (RIC).",
    subjects: {
      MAT: {
        units: unitsFrom(["MAT-SS-1", "MAT-SS-2", "MAT-SS-3", "MAT-SS-4"], letnik),
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 2), group(4, "numeric", 2, 3), group(3, "numeric", 3, 6)] },
      },
      FIZ: {
        units: unitsFrom(["FIZ-SS-1", "FIZ-SS-2", "FIZ-SS-3", "FIZ-SS-4"], letnik),
        mock: { minutes: 45, groups: [group(6, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "choice", 3, 1)] },
      },
      KEM: {
        units: unitsFrom(["KEM-SS-1", "KEM-SS-2", "KEM-SS-3", "KEM-SS-4"], letnik),
        mock: { minutes: 45, groups: [group(6, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "choice", 3, 1)] },
      },
      BIO: {
        units: unitsFrom(["BIO-SS-1", "BIO-SS-2", "BIO-SS-3", "BIO-SS-4"], letnik),
        mock: { minutes: 45, groups: [group(7, "choice", 1, 1), group(9, "choice", 2, 1), group(4, "choice", 3, 1)] },
      },
    },
  },
  // Teme so iz poti srednje šole, ki jih zajame katalog poklicne mature (sklopi kot v katalogu). Brez kompleksnih
  // števil, vektorjev, stožnic, limite, geometrijske vrste, integrala in trigonometrijskih enačb (jih ni v katalogu).
  POKLICNA: {
    name: "Poklicna matura",
    full: "Poklicna matura – matematika (tretji predmet)",
    country: "Slovenija",
    systems: ["SI"],
    track: "SREDNJA_SOLA",
    forLevel: [10, 13],
    board: true,
    about:
      "Matematika je pri poklicni maturi eden od predmetov, ki jih lahko izbereš kot tretji predmet. Pisni izpit je ena izpitna pola (120 minut, 70 % ocene): v 1. delu je 11 krajših obveznih nalog (50 točk), v 2. delu izbereš in rešiš 2 od 3 sestavljenih nalog (po 10 točk). Ustni izpit prinese 30 % ocene. Pri pisnem izpitu je dovoljeno računalo, formule so priložene poli. Poskusni izpit je 1. del izpitne pole na čas. Pred maturo preveri veljavni predmetni izpitni katalog (RIC).",
    subjects: {
      MAT: {
        units: unitsPick([
          ["Številske množice", ["MAT-SS-1/Naravna in cela števila", "MAT-SS-1/Racionalna števila", "MAT-SS-1/Realna števila in intervali", "MAT-SS-1/Potence z naravnimi in celimi eksponenti", "MAT-SS-1/Algebrski izrazi", "MAT-SS-1/Razstavljanje izrazov", "MAT-SS-1/Ulomljeni izrazi", "MAT-SS-2/Koreni", "MAT-SS-2/Potence z racionalnimi eksponenti"]],
          ["Geometrija", ["MAT-SS-1/Osnovni geometrijski pojmi", "MAT-SS-1/Trikotnik", "MAT-SS-1/Štirikotniki in krog", "MAT-SS-2/Podobnost", "MAT-SS-2/Kotne funkcije v pravokotnem trikotniku", "MAT-SS-3/Sinusni in kosinusni izrek", "MAT-SS-3/Površina in prostornina teles"]],
          ["Algebrske funkcije in enačbe", ["MAT-SS-1/Linearna funkcija", "MAT-SS-1/Linearne enačbe", "MAT-SS-1/Linearne neenačbe", "MAT-SS-1/Sistemi linearnih enačb", "MAT-SS-2/Kvadratna funkcija", "MAT-SS-2/Kvadratna enačba", "MAT-SS-2/Kvadratna neenačba", "MAT-SS-3/Polinomi", "MAT-SS-3/Graf polinoma", "MAT-SS-3/Racionalne funkcije"]],
          ["Transcendentne funkcije in enačbe", ["MAT-SS-2/Eksponentna funkcija", "MAT-SS-2/Eksponentne enačbe", "MAT-SS-2/Logaritem", "MAT-SS-2/Logaritemska funkcija in enačbe", "MAT-SS-3/Kotne funkcije poljubnega kota", "MAT-SS-3/Grafi kotnih funkcij", "MAT-SS-3/Adicijski izreki"]],
          ["Zaporedja", ["MAT-SS-4/Zaporedja", "MAT-SS-4/Aritmetično in geometrijsko zaporedje", "MAT-SS-4/Obrestni račun"]],
          ["Obdelava podatkov", ["MAT-SS-1/Obdelava podatkov"]],
          ["Diferencialni račun", ["MAT-SS-4/Odvod", "MAT-SS-4/Uporaba odvoda"]],
          ["Kombinatorika in verjetnost", ["MAT-SS-4/Kombinatorika", "MAT-SS-4/Verjetnost"]],
        ]),
        // 1. del izpitne pole: 11 krajših nalog (7 × 4, 2 × 5, 2 × 6 točk); 85 minut ≈ 50/70 od 120 minut.
        mock: { minutes: 85, groups: [group(7, "numeric", 1, 4), group(2, "numeric", 2, 5), group(2, "numeric", 3, 6)] },
      },
    },
  },
};
