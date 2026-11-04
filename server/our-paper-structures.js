// Zgradba izvirnih pol RIC, ki jim sledijo naše pole (content/exam-papers): samo število nalog, točke po delih in
// opis vrste naloge s svojimi besedami, nikoli besedilo RIC (j 30. 10. 2026). Preverja jo scripts/check-paper.js.
// topics: kratek opis vsebine dela; format: open | choice | fill | construct | table.
import fs from "node:fs";
import path from "node:path";

const INLINE = {
  "NPZ9-MAT-2026-redni": {
    points: 50,
    minutes: 60,
    tasks: [
      [1, 1, 1, 1, 2],
      [1, 1, 1, 3],
      [2, 4],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 2, 2],
      [3, 1],
      [1, 1, 2, 2],
      [1, 2, 2],
    ],
    topics: [
      "Računanje brez računala: a) odštevanje celih števil z negativnim rezultatom; b) množenje decimalnih števil; c) celo število in ulomek; d) deljenje celega števila z ulomkom; e) vrstni red računskih operacij z decimalnimi števili.",
      "Deleži: a–c) osenčeni del lika v mreži (slika) zapiši z odstotki, z decimalno številko, z okrajšanim ulomkom; d) besedilna naloga: dve leti zapored se znesek poveča za isti odstotek (obrestovanje).",
      "Enačbe: a) linearna enačba z negativno rešitvijo in izbira množic števil (N, Z, Q, R), v katere rešitev spada (format choice ali open); b) linearna enačba z ulomki in preizkus.",
      "Merske enote in čas: a) tri pretvorbe (masa, dolžina, ploščina), vsaka 1 točka (trije deli a, b, c); b) dopolni vsoto prostornin v različnih enotah (del d); c) trajanje dogodka iz začetne in končne ure (del e).",
      "Izrazi s spremenljivkami: seštevanje podobnih členov; množenje enočlenikov s potencami; enočlenik krat dvočlenik; kvadrat dvočlenika; produkt dveh dvočlenikov; razlika kvadratov.",
      "Pravilni večkotnik z dano stranico (skica): a) notranji kot; b) obseg; c) ploščina kot točna vrednost (s korenom); d) načrtovanje lika na dani stranici (construct).",
      "Vzorec likov v kvadratni mreži (slika treh členov): a) preglednica: število elementov za 1., 2., 3., 5. in n-ti člen; b) izbira ene pravilne trditve o razmerjih ploščin, diagonal in obsegov (choice).",
      "Geometrijsko telo iz vsakdanjega življenja (skica, npr. prizma s trapezno osnovno ploskvijo): a) obkroži ime telesa (choice); b) obkroži lik osnovne ploskve (choice); c) ploščina ene ploskve; d) prostornina.",
      "Prikaz s stolpci (slika) za 7 dni: a) branje: dnevi nad dano mejo; b) besedilni račun iz enega stolpca (npr. število × dolžina); c) aritmetična sredina 7 podatkov iz preglednice.",
    ],
  },
  "NPZ9-MAT-2025-redni": {
    points: 50,
    minutes: 60,
    tasks: [
      [1, 1, 1, 1, 2],
      [1, 1, 1, 1, 1, 1],
      [2, 2, 2],
      [1, 1, 1, 1, 2],
      [1, 1, 1, 1],
      [3, 1],
      [2, 4],
      [1, 1, 1, 3],
      [6],
    ],
    topics: [
      "Računanje brez računala: a) seštevanje ulomkov z različnima imenovalcema; b) odštevanje z negativnim številom ali ulomkom; c) potenca negativnega decimalnega števila v produktu; d) deljenje decimalnih števil; e) vrstni red operacij s potenco.",
      "Dan je seznam desetih naravnih števil: a) najmanjše praštevilo; b) število z natanko tremi delitelji; c) vsi večkratniki danega števila; d) število, ki je vrednost dane potence; e) največje število razcepi na prafaktorje; f) število z največjo nasprotno vrednostjo.",
      "Zapisi deleža: a) odstotek kot decimalna številka in okrajšan ulomek; b) decimalna številka (večja od 1) kot ulomek in odstotek; c) ulomek kot decimalna številka in odstotek. Vsak del ima dva zapisa po 1 točko.",
      "Pravokotni trikotnik z danimi stranicami (pitagorejska trojica, slika): a) obkroži pravilno izjavo o višini na stranico (choice); b) lega središča očrtane krožnice (choice); c) načrtaj simetralo stranice (construct); d) zapiši Pitagorov izrek za ta trikotnik; e) ploščina.",
      "Merske enote: pri vsakem delu obkroži vse količine, enake dani (choice z več pravilnimi): a) dolžina; b) čas; c) prostornina; d) vsota dveh ploščin.",
      "Kvadrat, razdeljen na dele z dolžinama x in y (slika), en del osenčen: a) ploščina osenčenega dela pri danih x in y; b) algebrski izraz za obseg osenčenega dela.",
      "Algebra: a) izraz po besedilu (npr. zmnožek vsote in razlike) zapiši in poenostavi; b) enačba z oklepaji in kvadrati, ki se poenostavi v linearno, s preizkusom.",
      "Preglednica izbir učencev enega razreda (skupaj 25): a) koliko je izbralo eno ali drugo možnost; b) verjetnost kot ulomek; c) verjetnost v odstotkih; d) besedilna naloga: znesek, razdeljen na manj ljudi, cena na osebo se poveča za koliko.",
      "Sestavljeno telo (kocka in pravilna tristrana enakoroba prizma, skica): koliko litrov materiala, zaokroženo na dve decimalki (en del za 6 točk, postopek po korakih).",
    ],
  },
};

// Zgradbe v content/exam-papers/structures/<id>.json (enaka vsebina, tasks: [{ pola?, section?, n, points: [..],
// format, topic, figure? }]) dopolnijo zgornje.
const DIR = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "content", "exam-papers", "structures");
function fromFiles() {
  const out = {};
  try {
    for (const f of fs.readdirSync(DIR)) if (f.endsWith(".json")) {
      const s = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
      out[s.id || f.slice(0, -5)] = s;
    }
  } catch {
    /* brez datotek */
  }
  return out;
}
export const PAPER_STRUCTURES = { ...INLINE, ...fromFiles() };
