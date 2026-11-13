// Univerzitetni študijski programi 1. stopnje (UN) in enoviti magistrski (EMŠ, le prvi letniki) ter njihovi predmeti.
//
// Predmetniki so povzeti po javno objavljenih dokumentih fakultet (zbrano
// 27.–28. 10. 2026; glej PROGRAMS[*].source). Zajeti so obvezni predmeti z
// vsebino iz matematike, fizike, kemije, mehanike in inženirstva. Ostale
// naravoslovne fakultete in strokovni predmeti (biologija, geologija,
// računalništvo, ekonomija) so v university-extra.js; jeziki, praksa in
// zaključno delo niso zajeti.
// Vsebine predmetov (teme) so sestavljene po poglavju »Vsebina« učnih načrtov
// in običajnih učbenikih; pred javno objavo naj jih preveri asistent ali
// študent višjega letnika. Popravke vnašaj kar tukaj.
//
// Znane negotovosti: UL FMF Matematika je po predmetniku 2018/19 (novejša
// stran programa ni strojno berljiva); 3. letnik UM FKKT Kemijsko inženirstvo
// je iz slabo berljivega PDF-ja.
//
// Teme so zapisane kot "Naslov | kratki cilji", tako kot v curriculum-data.js.
// Isti naslov teme v več predmetih pomeni isto vsebino: generatorji nalog
// (server/practice/generators/uni.js) se nanjo vežejo po naslovu, zato
// naslovov ne spreminjaj brez generatorjev.

import { EXTRA_FACULTIES } from "./university-extra.js";
import { COURSE_EXTENSIONS } from "./university-razsiritve.js";

// ============================================================ vsebine (sklopi)

// ---------------------------------------------------------------- matematika

const MAT_1 = [
  ["Števila in funkcije", [
    "Realna in kompleksna števila | računanje s kompleksnimi števili, polarni zapis, Eulerjeva formula, koreni",
    "Elementarne funkcije | lastnosti, inverzne funkcije, eksponentna, logaritemska in krožne funkcije",
  ]],
  ["Limite in zveznost", [
    "Zaporedja in limite | konvergenca, monotona in omejena zaporedja, število e",
    "Limita in zveznost funkcije | računanje limit, nedoločeni izrazi, zveznost",
  ]],
  ["Odvod", [
    "Odvod funkcije | pravila odvajanja, verižno pravilo, odvod v točki, tangenta",
    "Uporaba odvoda | ekstremi, potek funkcije, L'Hospitalovo pravilo, Taylorjev polinom",
  ]],
  ["Integral", [
    "Nedoločeni integral | substitucija, integracija po delih, racionalne funkcije",
    "Določeni integral | Newton-Leibnizova formula, ploščine, prostornine, povprečna vrednost",
  ]],
  ["Linearna algebra", [
    "Vektorji | skalarni, vektorski in mešani produkt, kot med vektorjema, premica in ravnina",
    "Matrike in determinante | računanje z matrikami, inverzna matrika, determinanta",
    "Sistemi linearnih enačb | Gaussova eliminacija, rang, rešljivost",
  ]],
];

const MAT_2 = [
  ["Vrste", [
    "Vrste | številske vrste, geometrijska vrsta, kriteriji konvergence, potenčne vrste",
  ]],
  ["Funkcije več spremenljivk", [
    "Parcialni odvodi | parcialni odvodi, totalni diferencial, gradient, verižno pravilo",
    "Ekstremi funkcij več spremenljivk | stacionarne točke, Hessejeva matrika, vezani ekstremi",
    "Večkratni integrali | dvojni in trojni integral, polarne, cilindrične in sferne koordinate",
  ]],
  ["Diferencialne enačbe", [
    "Diferencialne enačbe prvega reda | ločljive in linearne enačbe, začetni problem, modeli rasti in razpada",
    "Linearne diferencialne enačbe drugega reda | homogene s konstantnimi koeficienti, nastavek za partikularno rešitev",
  ]],
  ["Linearna algebra in statistika", [
    "Lastne vrednosti in lastni vektorji | karakteristični polinom, diagonalizacija",
    "Verjetnost in statistika | porazdelitve, povprečje, standardni odklon, linearna regresija",
  ]],
];

// UM FKKT: Matematika A (z), B (l), C (2. letnik)
const MAT_A = [MAT_1[0], MAT_1[1], MAT_1[2], MAT_1[3]];
const MAT_B = [MAT_1[4], MAT_2[0], MAT_2[1]];
const MAT_C = [MAT_2[2], MAT_2[3], ["Transformacije", [
  "Laplaceova transformacija | lastnosti, inverzna transformacija, reševanje linearnih diferencialnih enačb",
]]];

// Analiza in navadne diferencialne enačbe (UL FS)
const ANALIZA_NDE = [
  ["Funkcije in limite", [
    "Elementarne funkcije | lastnosti, inverzne funkcije, eksponentna, logaritemska in krožne funkcije",
    "Limita in zveznost funkcije | računanje limit, nedoločeni izrazi, zveznost",
  ]],
  ["Odvod", [
    "Odvod funkcije | pravila odvajanja, verižno pravilo, odvod v točki, tangenta",
    "Uporaba odvoda | ekstremi, potek funkcije, L'Hospitalovo pravilo, Taylorjev polinom",
  ]],
  ["Integral", [
    "Nedoločeni integral | substitucija, integracija po delih, racionalne funkcije",
    "Določeni integral | Newton-Leibnizova formula, ploščine, prostornine, povprečna vrednost",
  ]],
  ["Vrste", [
    "Vrste | številske vrste, geometrijska vrsta, kriteriji konvergence, potenčne vrste",
  ]],
  ["Navadne diferencialne enačbe", [
    "Diferencialne enačbe prvega reda | ločljive in linearne enačbe, začetni problem, modeli rasti in razpada",
    "Linearne diferencialne enačbe drugega reda | homogene s konstantnimi koeficienti, nastavek za partikularno rešitev",
    "Sistemi diferencialnih enačb | linearni sistemi, prevedba enačbe višjega reda na sistem",
  ]],
];

// Linearna algebra in vektorska analiza (UL FS)
const LA_VA = [
  ["Linearna algebra", [
    "Vektorji | skalarni, vektorski in mešani produkt, kot med vektorjema, premica in ravnina",
    "Matrike in determinante | računanje z matrikami, inverzna matrika, determinanta",
    "Sistemi linearnih enačb | Gaussova eliminacija, rang, rešljivost",
    "Lastne vrednosti in lastni vektorji | karakteristični polinom, diagonalizacija",
  ]],
  ["Funkcije več spremenljivk", [
    "Parcialni odvodi | parcialni odvodi, totalni diferencial, gradient, verižno pravilo",
    "Večkratni integrali | dvojni in trojni integral, polarne, cilindrične in sferne koordinate",
  ]],
  ["Vektorska analiza", [
    "Gradient, divergenca in rotor | skalarna in vektorska polja, operator nabla",
    "Krivuljni in ploskovni integrali | delo sile, pretok, Gaussov in Stokesov izrek",
  ]],
];

// Integralske transformacije in Fourierova analiza (UL FS)
const INTEG_FOURIER = [
  ["Fourierova analiza", [
    "Potenčne in Fourierove vrste | enakomerna konvergenca, konvergenčni polmer, Fourierova vrsta",
    "Fourierova transformacija | spekter signala, konvolucija, Parsevalova enakost",
  ]],
  ["Laplaceova transformacija", [
    "Laplaceova transformacija | lastnosti, inverzna transformacija, reševanje linearnih diferencialnih enačb",
    "Prenosne funkcije | odziv linearnega sistema, poli in stabilnost",
  ]],
];

// Parcialne diferencialne enačbe, kompleksna analiza in optimizacija (UL FS)
const PDE_KOMPL_OPT = [
  ["Parcialne diferencialne enačbe", [
    "Parcialne diferencialne enačbe | separacija spremenljivk, difuzijska in valovna enačba",
  ]],
  ["Kompleksna analiza", [
    "Holomorfne funkcije | Cauchy-Riemannove enačbe, elementarne kompleksne funkcije",
    "Laurentova vrsta in residuumi | singularnosti, izrek o residuih, računanje integralov",
  ]],
  ["Optimizacija", [
    "Optimizacija z vezmi | Lagrangeovi multiplikatorji, Kuhn-Tuckerjevi pogoji",
    "Linearno programiranje | simpleksna metoda, dualnost, grafična rešitev",
  ]],
];

const ANALIZA_1 = [
  ["Osnove", [
    "Množice in realna števila | supremum in infimum, aksiom o polnosti, matematična indukcija",
    "Realna in kompleksna števila | računanje s kompleksnimi števili, polarni zapis, Eulerjeva formula, koreni",
  ]],
  ["Zaporedja in vrste", [
    "Zaporedja in limite | konvergenca, monotona in omejena zaporedja, Cauchyjeva zaporedja, število e",
    "Vrste | številske vrste, geometrijska vrsta, kriteriji konvergence, absolutna konvergenca",
  ]],
  ["Funkcije", [
    "Limita in zveznost funkcije | definicija ε-δ, lastnosti zveznih funkcij na zaprtem intervalu",
    "Elementarne funkcije | lastnosti, inverzne funkcije, eksponentna, logaritemska in krožne funkcije",
  ]],
  ["Odvod", [
    "Odvod funkcije | definicija, pravila odvajanja, verižno pravilo, odvod v točki",
    "Uporaba odvoda | Lagrangeov izrek, ekstremi, L'Hospitalovo pravilo, Taylorjeva formula",
  ]],
  ["Integral", [
    "Nedoločeni integral | substitucija, integracija po delih, racionalne funkcije",
    "Določeni integral | Riemannov integral, osnovni izrek analize, uporaba",
    "Posplošeni integral | integrali na neomejenih intervalih in neomejenih funkcij, konvergenca",
  ]],
];

// Analiza 2 (FiMa) oziroma Analiza 2a (Matematika): funkcije več spremenljivk
const ANALIZA_2A = [
  ["Funkcije več spremenljivk", [
    "Parcialni odvodi | parcialni odvodi, diferenciabilnost, gradient, verižno pravilo",
    "Ekstremi funkcij več spremenljivk | stacionarne točke, Hessejeva matrika, vezani ekstremi",
    "Izrek o implicitni funkciji | inverzne preslikave, Jacobijeva matrika",
    "Večkratni integrali | dvojni in trojni integral, zamenjava spremenljivk, Jacobijeva determinanta",
  ]],
  ["Metrični prostori", [
    "Metrični in topološki prostori | odprte in zaprte množice, zveznost, kompaktnost",
  ]],
];

// Analiza 2b (Matematika): vrste funkcij in diferencialne enačbe
const ANALIZA_2B = [
  ["Funkcijska zaporedja in vrste", [
    "Potenčne in Fourierove vrste | enakomerna konvergenca, konvergenčni polmer, Fourierova vrsta",
  ]],
  ["Diferencialne enačbe", [
    "Diferencialne enačbe prvega reda | ločljive in linearne enačbe, začetni problem, eksistenca rešitve",
    "Linearne diferencialne enačbe drugega reda | homogene s konstantnimi koeficienti, nastavek za partikularno rešitev",
    "Sistemi diferencialnih enačb | linearni sistemi, prevedba enačbe višjega reda na sistem",
  ]],
];

// Analiza 3: vektorska analiza in mera
const ANALIZA_3 = [
  ["Vektorska analiza", [
    "Gradient, divergenca in rotor | skalarna in vektorska polja, operator nabla",
    "Krivuljni in ploskovni integrali | delo sile, pretok, Gaussov in Stokesov izrek",
  ]],
  ["Mera in integral", [
    "Lebesgueova mera in integral | merljive funkcije, izreki o konvergenci",
  ]],
  ["Diferencialne enačbe", [
    "Potenčne in Fourierove vrste | enakomerna konvergenca, konvergenčni polmer, Fourierova vrsta",
    "Linearne diferencialne enačbe drugega reda | homogene s konstantnimi koeficienti, nastavek za partikularno rešitev",
  ]],
];

const ALGEBRA_1 = [
  ["Vektorji in matrike", [
    "Vektorji | skalarni, vektorski in mešani produkt, kot med vektorjema, premica in ravnina",
    "Matrike in determinante | računanje z matrikami, inverzna matrika, determinanta in njene lastnosti",
    "Sistemi linearnih enačb | Gaussova eliminacija, rang, rešljivost",
  ]],
  ["Vektorski prostori", [
    "Vektorski prostori | podprostori, linearna neodvisnost, baza, dimenzija",
    "Linearne preslikave | jedro in slika, matrika preslikave, prehod med bazami",
  ]],
  ["Spektralna teorija", [
    "Lastne vrednosti in lastni vektorji | karakteristični polinom, diagonalizacija",
    "Skalarni produkt in ortogonalnost | norma, Gram-Schmidtov postopek, ortogonalna projekcija",
  ]],
];

const ALGEBRA_2 = [
  ["Linearne preslikave", [
    "Sebiadjungirane in ortogonalne preslikave | spektralni izrek, kvadratne forme",
    "Jordanova forma | minimalni polinom, korenski podprostori",
  ]],
  ["Algebrske strukture", [
    "Grupe | podgrupe, homomorfizmi, permutacije",
    "Kolobarji in polinomi | deljivost polinomov, ničle, polja",
  ]],
];

const LOGIKA = [
  ["Logika", [
    "Izjavni račun | izjave, resničnostne tabele, tavtologije, sklepanje",
    "Predikatni račun | kvantifikatorji, negacija izjav s kvantifikatorji",
  ]],
  ["Množice", [
    "Množice in operacije | podmnožice, unija, presek, potenčna množica, kartezični produkt",
    "Relacije in funkcije | ekvivalenčne in urejenostne relacije, injektivnost, surjektivnost",
    "Moč množic | števne in neštevne množice",
  ]],
];

const DISKRETNA = [
  ["Kombinatorika", [
    "Kombinatorika | pravilo produkta, permutacije, kombinacije, binomski koeficienti, vključitve in izključitve",
    "Rekurzivne enačbe | linearne rekurzije, rodovne funkcije",
  ]],
  ["Grafi", [
    "Grafi | poti in cikli, drevesa, Eulerjevi in Hamiltonovi grafi, barvanje",
  ]],
];

const DISKRETNE_STRUKTURE = [...LOGIKA, ...DISKRETNA];

const TOPOLOGIJA = [
  ["Topološki prostori", [
    "Metrični in topološki prostori | odprte in zaprte množice, zveznost, kompaktnost",
    "Povezanost in separacijski aksiomi | komponente, Hausdorffovi prostori",
  ]],
];

const VERJETNOST_1 = [
  ["Verjetnost", [
    "Klasična verjetnost | kombinatorika, pogojna verjetnost, neodvisnost, Bayesova formula",
    "Slučajne spremenljivke in porazdelitve | binomska, Poissonova, enakomerna, eksponentna, normalna",
    "Pričakovana vrednost in disperzija | lastnosti, kovarianca",
    "Limitni izreki | zakon velikih števil, centralni limitni izrek",
  ]],
];

const STATISTIKA = [
  ["Statistika", [
    "Verjetnost in statistika | vzorec, povprečje, standardni odklon, linearna regresija",
    "Statistično sklepanje | intervali zaupanja, preizkušanje domnev",
    "Cenilke | metoda največjega verjetja, nepristranskost",
  ]],
];

const VERJ_STAT = [...VERJETNOST_1, STATISTIKA[0]];

const VERJ_MERA = [
  ["Verjetnost z mero", [
    "Lebesgueova mera in integral | merljive funkcije, izreki o konvergenci",
    "Pogojno matematično upanje | σ-algebre, martingali",
  ]],
];

const SLUC_PROC = [
  ["Slučajni procesi", [
    "Markovske verige | prehodna matrika, stacionarna porazdelitev, absorpcijska stanja",
    "Poissonov proces | eksponentni časi, prihodi",
    "Brownovo gibanje | lastnosti, uporaba v financah",
  ]],
];

const NUMERIKA = [
  ["Numerične metode", [
    "Reševanje nelinearnih enačb | bisekcija, Newtonova metoda, konvergenca",
    "Numerično reševanje sistemov | LU razcep, iterativne metode, napake",
    "Interpolacija in aproksimacija | Lagrangeov polinom, metoda najmanjših kvadratov",
    "Numerično integriranje | trapezno in Simpsonovo pravilo, ocena napake",
    "Numerično reševanje diferencialnih enačb | Eulerjeva metoda, metode Runge-Kutta",
  ]],
];
const NUMERIKA_1 = [["Numerične metode", NUMERIKA[0][1].slice(0, 3)]];
const NUMERIKA_2 = [["Numerične metode", [...NUMERIKA[0][1].slice(3), "Lastne vrednosti numerično | potenčna metoda, QR"]]];

const KOMPLEKSNA = [
  ["Kompleksna analiza", [
    "Holomorfne funkcije | Cauchy-Riemannove enačbe, elementarne kompleksne funkcije",
    "Kompleksna integracija | Cauchyjev izrek in formula",
    "Laurentova vrsta in residuumi | singularnosti, izrek o residuih, računanje integralov",
  ]],
];

const OPTIM = [
  ["Optimizacijske metode", [
    "Linearno programiranje | simpleksna metoda, dualnost, grafična rešitev",
    "Celoštevilsko programiranje | vejitev in omejevanje",
    "Optimizacija na grafih | najkrajše poti, najcenejše vpeto drevo, pretoki",
  ]],
];

const OPER_RAZ = [
  ["Operacijske raziskave", [
    "Dinamično programiranje | Bellmanova enačba, najkrajše poti",
    "Teorija čakalnih vrst | Poissonovi prihodi, sistem M/M/1",
    "Markovske verige | prehodna matrika, stacionarna porazdelitev, absorpcijska stanja",
  ]],
];

const TEORIJA_IGER = [
  ["Teorija iger", [
    "Matrične igre | sedlo, mešane strategije, minimax",
    "Nashevo ravnovesje | igre v normalni obliki, dominirane strategije",
  ]],
];

const FINMAT = [
  ["Obresti", [
    "Obrestni račun | navadno in obrestno obrestovanje, efektivna obrestna mera, zvezno obrestovanje",
  ]],
  ["Rente in posojila", [
    "Rente in amortizacija | sedanja in končna vrednost rente, anuiteta, amortizacijski načrt",
    "Obveznice in donosnost | cena obveznice, donosnost do dospetja, trajanje",
  ]],
  ["Vrednotenje", [
    "Binomski model vrednotenja opcij | brezarbitražna cena, replikacija",
  ]],
];

// ---------------------------------------------------------------- fizika

const FIZ_1 = [
  ["Kinematika in dinamika", [
    "Kinematika | premo in krivo gibanje, poševni met, kroženje",
    "Newtonovi zakoni in sile | trenje, sile pri kroženju, gravitacija",
    "Delo, energija in gibalna količina | izrek o kinetični energiji, ohranitveni zakoni, trki",
  ]],
  ["Togo telo in tekočine", [
    "Vrtenje togega telesa | navor, vztrajnostni moment, vrtilna količina",
    "Kontinuitetna in Bernoullijeva enačba | hidrostatika, tok idealne tekočine",
  ]],
  ["Nihanje in toplota", [
    "Harmonično nihanje | nihajni čas, nihalo na vijačni vzmeti, matematično nihalo, dušenje",
    "Idealni plin in kinetična teorija | plinska enačba, notranja energija, toplotne kapacitete",
    "Prvi zakon termodinamike | delo, toplota, notranja energija, izotermne in adiabatne spremembe",
    "Drugi zakon termodinamike | entropija, toplotni stroji, Carnotov izkoristek",
  ]],
];

const FIZ_2 = [
  ["Elektrika", [
    "Elektrostatika | Coulombov zakon, električno polje, potencial, kondenzator",
    "Električni tok in vezja | Ohmov zakon, Kirchhoffova zakona, RC vezje",
  ]],
  ["Magnetizem", [
    "Magnetno polje in indukcija | Lorentzova sila, Amperov zakon, indukcijski zakon",
  ]],
  ["Valovanje in optika", [
    "Valovanje | valovna enačba, stoječe valovanje, zvok, Dopplerjev pojav",
    "Geometrijska in valovna optika | lom, leče, interferenca, uklon",
  ]],
  ["Moderna fizika", [
    "Fotoni in atomi | fotoefekt, de Brogliejeva valovna dolžina, energijski nivoji",
  ]],
];

const KLASICNA_FIZIKA = [
  ["Mehanika", [
    "Kinematika | premo in krivo gibanje, poševni met, kroženje",
    "Newtonovi zakoni in sile | trenje, sile pri kroženju, gravitacija",
    "Delo, energija in gibalna količina | izrek o kinetični energiji, ohranitveni zakoni, trki",
    "Vrtenje togega telesa | navor, vztrajnostni moment, vrtilna količina",
  ]],
  ["Nihanje in valovanje", [
    "Harmonično nihanje | nihajni čas, nihalo na vijačni vzmeti, matematično nihalo, dušenje",
    "Valovanje | valovna enačba, stoječe valovanje, zvok, Dopplerjev pojav",
  ]],
  ["Termodinamika", [
    "Idealni plin in kinetična teorija | plinska enačba, notranja energija, toplotne kapacitete",
    "Prvi zakon termodinamike | delo, toplota, notranja energija, izotermne in adiabatne spremembe",
    "Drugi zakon termodinamike | entropija, toplotni stroji, Carnotov izkoristek",
  ]],
  ["Elektrika in magnetizem", [
    "Elektrostatika | Coulombov zakon, električno polje, potencial, kondenzator",
    "Električni tok in vezja | Ohmov zakon, Kirchhoffova zakona, RC vezje",
    "Magnetno polje in indukcija | Lorentzova sila, Amperov zakon, indukcijski zakon",
  ]],
  ["Optika", [
    "Geometrijska in valovna optika | lom, leče, interferenca, uklon",
  ]],
];

// Matematika III (FMF Fizika): vektorska analiza in diferencialne enačbe
const MAT_3_FIZ = [
  ["Vektorska analiza", [
    "Gradient, divergenca in rotor | skalarna in vektorska polja, operator nabla, krivočrtne koordinate",
    "Krivuljni in ploskovni integrali | delo sile, pretok, Gaussov in Stokesov izrek",
  ]],
  ["Diferencialne enačbe", [
    "Linearne diferencialne enačbe drugega reda | homogene s konstantnimi koeficienti, nastavek za partikularno rešitev",
    "Sistemi diferencialnih enačb | linearni sistemi, prevedba enačbe višjega reda na sistem",
  ]],
];

// Matematika IV (FMF Fizika): Fourier, PDE, kompleksna analiza
const MAT_4_FIZ = [
  ["Metode matematične fizike", [
    "Potenčne in Fourierove vrste | Fourierova vrsta, Fourierova transformacija",
    "Parcialne diferencialne enačbe | separacija spremenljivk, difuzijska in valovna enačba",
    "Posebne funkcije | Legendrovi polinomi, Besslove funkcije",
  ]],
  ["Kompleksna analiza", [
    "Holomorfne funkcije | Cauchy-Riemannove enačbe, elementarne kompleksne funkcije",
    "Laurentova vrsta in residuumi | singularnosti, izrek o residuih, računanje integralov",
  ]],
];

const MATFIZ_1 = [
  ["Vektorska analiza", [
    "Gradient, divergenca in rotor | skalarna in vektorska polja, operator nabla, krivočrtne koordinate",
    "Krivuljni in ploskovni integrali | delo sile, pretok, Gaussov in Stokesov izrek",
  ]],
  ["Metode matematične fizike", [
    "Potenčne in Fourierove vrste | Fourierova vrsta, Fourierova transformacija",
    "Parcialne diferencialne enačbe | separacija spremenljivk, difuzijska in valovna enačba",
    "Posebne funkcije | Legendrovi polinomi, Besslove funkcije",
  ]],
];

const KLAS_MEH = [
  ["Analitična mehanika", [
    "Lagrangeov formalizem | posplošene koordinate, Lagrangeove enačbe, vezi",
    "Centralne sile in Keplerjev problem | efektivni potencial, orbite",
    "Majhna nihanja | lastni načini, sklopljena nihala",
    "Hamiltonov formalizem | Hamiltonove enačbe, ohranitveni zakoni",
  ]],
];

// Mehanika 1 (FMF Matematika)
const MEHANIKA_1 = [
  ["Mehanika", [
    "Kinematika | premo in krivo gibanje, poševni met, kroženje",
    "Newtonovi zakoni in sile | trenje, sile pri kroženju, gravitacija",
    "Delo, energija in gibalna količina | izrek o kinetični energiji, ohranitveni zakoni, trki",
    "Lagrangeov formalizem | posplošene koordinate, Lagrangeove enačbe, vezi",
    "Centralne sile in Keplerjev problem | efektivni potencial, orbite",
  ]],
];

const EM_POLJE = [
  ["Elektromagnetno polje", [
    "Elektrostatika | Coulombov zakon, električno polje, potencial, kondenzator",
    "Magnetostatika | Biot-Savartov zakon, Amperov zakon, vektorski potencial",
    "Maxwellove enačbe | diferencialna in integralska oblika, ohranitev naboja",
    "Elektromagnetno valovanje | ravni val, Poyntingov vektor, odboj in lom",
  ]],
];

const MODERNA_1 = [
  ["Relativnost in kvanti", [
    "Posebna teorija relativnosti | Lorentzove transformacije, relativistična energija in gibalna količina",
    "Fotoni in atomi | fotoefekt, de Brogliejeva valovna dolžina, energijski nivoji",
    "Uvod v kvantno mehaniko | valovna funkcija, načelo nedoločenosti, delec v neskončni potencialni jami",
  ]],
  ["Atomi", [
    "Vodikov atom in kvantna števila | energijski nivoji, orbitale, spektri",
    "Spin in večelektronski atomi | Paulijevo načelo, periodni sistem, Zeemanov pojav",
  ]],
];

const MODERNA_2 = [
  ["Jedra in delci", [
    "Jedrska fizika | vezavna energija, radioaktivni razpad, razpolovni čas, aktivnost",
    "Osnovni delci | standardni model, ohranitveni zakoni",
  ]],
  ["Snov", [
    "Molekule in trdna snov | molekulske vezi, pasovna struktura, polprevodniki",
  ]],
];

const KVANTNA = [
  ["Kvantna mehanika", [
    "Uvod v kvantno mehaniko | valovna funkcija, načelo nedoločenosti, delec v neskončni potencialni jami",
    "Harmonski oscilator | lastne energije, posebne lastnosti",
    "Vrtilna količina in vodikov atom | kvantna števila, sferne harmonike",
    "Spin | Paulijeve matrike, sestavljanje vrtilnih količin",
    "Perturbacijska teorija | časovno neodvisna, variacijska metoda",
  ]],
];

const STAT_TERMO = [
  ["Statistična termodinamika", [
    "Boltzmannova porazdelitev | mikrostanja, entropija, temperatura",
    "Particijska funkcija | termodinamske količine iz particijske funkcije",
    "Kvantni plini | Fermi-Diracova in Bose-Einsteinova statistika",
  ]],
];

const VERJ_FIZ = [
  ["Verjetnost v fiziki", [
    "Klasična verjetnost | kombinatorika, pogojna verjetnost, neodvisnost, Bayesova formula",
    "Slučajne spremenljivke in porazdelitve | binomska, Poissonova, enakomerna, eksponentna, normalna",
    "Statistična obdelava rezultatov | povprečje, standardni odklon, interval zaupanja, značilne števke",
  ]],
];

const FTS = [
  ["Fizika trdne snovi", [
    "Kristalne strukture | osnovna celica, gostota zloga, ionski kristali",
    "Rentgenska difrakcija | Braggov zakon, recipročna mreža",
    "Fononi in toplotna kapaciteta | Debyev model",
    "Pasovna struktura | prevodniki, polprevodniki, izolatorji",
  ]],
];

const OPTIKA = [
  ["Optika", [
    "Geometrijska in valovna optika | lom, leče, interferenca, uklon",
    "Polarizacija | Malusov zakon, Brewstrov kot",
    "Elektromagnetno valovanje | ravni val, Poyntingov vektor, odboj in lom",
  ]],
];

// ---------------------------------------------------------------- kemija

const SPL_KEM = [
  ["Zgradba snovi", [
    "Zgradba atoma | elektronska konfiguracija, kvantna števila, orbitale",
    "Periodni sistem in periodične lastnosti | ionizacijska energija, elektronegativnost, polmeri",
    "Kemijska vez | ionska in kovalentna vez, VSEPR, hibridizacija, medmolekulske sile",
  ]],
  ["Stehiometrija in raztopine", [
    "Stehiometrija | množina snovi, omejujoči reaktant, izkoristek, empirična formula",
    "Plini | splošna plinska enačba, parcialni tlaki, Daltonov zakon",
    "Raztopine | koncentracije, redčenje, koligativne lastnosti",
  ]],
  ["Ravnotežja", [
    "Kemijsko ravnotežje | konstanta ravnotežja, Le Chatelierovo načelo",
    "Kisline in baze | pH močnih in šibkih kislin in baz, pufri",
    "Topnost | topnostni produkt, obarjanje",
  ]],
  ["Energija in redoks", [
    "Termokemija | reakcijska entalpija, Hessov zakon, tvorbene entalpije",
    "Redoks reakcije in elektrokemija | oksidacijska števila, urejanje redoks enačb, elektrodni potenciali",
  ]],
];

// Kemijsko računanje (UM FKKT)
const KEM_RACUNANJE = [
  ["Kemijsko računanje", [
    "Stehiometrija | množina snovi, omejujoči reaktant, izkoristek, empirična formula",
    "Plini | splošna plinska enačba, parcialni tlaki, Daltonov zakon",
    "Raztopine | koncentracije, redčenje, koligativne lastnosti",
    "Kisline in baze | pH močnih in šibkih kislin in baz, pufri",
    "Termokemija | reakcijska entalpija, Hessov zakon, tvorbene entalpije",
  ]],
];

const ANORG = [
  ["Kemija elementov", [
    "Vodik in elementi s-bloka | lastnosti, spojine, reakcije",
    "Elementi p-bloka | halogeni, halkogeni, dušikova skupina, ogljikova skupina",
    "Prehodni elementi | oksidacijska stanja, barvne spojine, kataliza",
  ]],
  ["Strukture", [
    "Koordinacijske spojine | ligandi, nomenklatura, izomerija, teorija kristalnega polja",
    "Kristalne strukture | osnovna celica, gostota zloga, ionski kristali",
  ]],
];

// Zgradba in lastnosti trdnin (UL FKKT)
const TRDNINE = [
  ["Zgradba trdnin", [
    "Kristalne strukture | osnovna celica, gostota zloga, ionski kristali",
    "Rentgenska difrakcija | Braggov zakon, recipročna mreža",
    "Vezi v trdninah | kovinska, ionska, kovalentna vez, mrežna energija, Born-Haberjev cikel",
  ]],
  ["Lastnosti trdnin", [
    "Pasovna struktura | prevodniki, polprevodniki, izolatorji",
    "Napake v kristalih | točkaste napake, nestehiometrija, difuzija",
  ]],
];

const ANAL_1 = [
  ["Osnove kvantitativne analize", [
    "Statistična obdelava rezultatov | povprečje, standardni odklon, interval zaupanja, značilne števke",
  ]],
  ["Ravnotežja v analizni kemiji", [
    "Kisline in baze | pH močnih in šibkih kislin in baz, pufri",
    "Kislinsko-bazne titracije | titracijske krivulje, ekvivalentna točka, indikatorji",
    "Topnost | topnostni produkt, obarjanje, gravimetrija",
    "Kompleksometrija | konstante tvorbe, titracije z EDTA",
    "Redoks titracije | manganometrija, jodometrija",
  ]],
];

const ANAL_2 = [
  ["Instrumentalne metode", [
    "Spektrometrične metode | Beer-Lambertov zakon, UV-VIS, atomska absorpcijska spektrometrija",
    "Elektroanalizne metode | potenciometrija, Nernstova enačba, ionoselektivne elektrode",
    "Kromatografske metode | plinska in tekočinska kromatografija, ločljivost, umeritvena krivulja",
  ]],
];

const ORG_1 = [
  ["Zgradba organskih molekul", [
    "Zgradba in vezi organskih molekul | hibridizacija, resonanca, funkcionalne skupine",
    "Nomenklatura organskih spojin | pravila IUPAC v slovenščini",
    "Stereokemija | kiralnost, konfiguracija R/S, diastereomeri",
  ]],
  ["Reakcije", [
    "Alkani, alkeni in alkini | adicije, Markovnikovo pravilo, radikalske reakcije",
    "Nukleofilne substitucije in eliminacije | mehanizmi SN1, SN2, E1, E2",
    "Aromatske spojine | aromatičnost, elektrofilna aromatska substitucija",
  ]],
];

const ORG_2 = [
  ["Spojine s kisikom in dušikom", [
    "Alkoholi, etri in amini | priprava, reakcije, bazičnost aminov",
    "Karbonilne spojine | aldehidi in ketoni, nukleofilna adicija, aldolna reakcija",
    "Karboksilne kisline in derivati | estri, amidi, nukleofilna acilna substitucija",
  ]],
  ["Določanje strukture", [
    "Spektroskopija organskih spojin | IR, NMR, masna spektrometrija",
  ]],
];

const ORG_1_2 = [...ORG_1, ORG_2[0]]; // enosemestrska Organska kemija (UL FKKT KI)

const ORG_3 = [
  ["Napredna organska kemija", [
    "Periciklične reakcije | Diels-Alderjeva reakcija, Woodward-Hoffmannova pravila",
    "Heterociklične spojine | piridin, pirol, furan, reaktivnost",
    "Sintezna strategija | retrosinteza, zaščitne skupine, tvorba vezi C–C",
  ]],
];

const ORG_SINTEZA = [
  ["Organska sinteza", [
    "Sintezna strategija | retrosinteza, zaščitne skupine, tvorba vezi C–C",
    "Oksidacije in redukcije v organski sintezi | reagenti, selektivnost",
    "Organokovinski reagenti | Grignardovi reagenti, katalizirane reakcije",
  ]],
];

const ORG_ANALIZA = [
  ["Organska analiza", [
    "Spektroskopija organskih spojin | IR, NMR, masna spektrometrija",
    "Določanje strukture iz spektrov | stopnja nenasičenosti, kombinacija metod",
  ]],
];

const SPEKTROSKOPIJA = [
  ["Spektroskopija", [
    "Molekulska spektroskopija | rotacijski in vibracijski spektri",
    "Spektrometrične metode | Beer-Lambertov zakon, UV-VIS, atomska absorpcijska spektrometrija",
    "Spektroskopija organskih spojin | IR, NMR, masna spektrometrija",
  ]],
];

const STRUKTURA_AM = [
  ["Struktura atomov in molekul", [
    "Uvod v kvantno mehaniko | valovna funkcija, načelo nedoločenosti, delec v neskončni potencialni jami",
    "Vodikov atom in kvantna števila | energijski nivoji, orbitale, spektri",
    "Molekulske orbitale | metoda LCAO, MO diagrami dvoatomnih molekul, vezni red",
    "Molekulska spektroskopija | rotacijski in vibracijski spektri",
  ]],
];

const FIZKEM_1 = [
  ["Plini in termodinamika", [
    "Plini | splošna plinska enačba, parcialni tlaki, Daltonov zakon",
    "Realni plini | van der Waalsova enačba, kompresibilnostni faktor",
    "Prvi zakon termodinamike | delo, toplota, notranja energija, izotermne in adiabatne spremembe",
    "Termokemija | reakcijska entalpija, Hessov zakon, Kirchhoffov zakon",
    "Drugi zakon termodinamike | entropija, toplotni stroji, Carnotov izkoristek",
  ]],
  ["Ravnotežja", [
    "Gibbsova energija in kemijsko ravnotežje | ΔG = ΔH − TΔS, zveza med ΔG° in K, van 't Hoffova enačba",
    "Fazna ravnotežja | fazni diagrami, Clausius-Clapeyronova enačba",
    "Raztopine | koncentracije, redčenje, koligativne lastnosti",
  ]],
];

const FIZKEM_2 = [
  ["Kinetika", [
    "Kemijska kinetika | hitrostni zakoni, red reakcije, razpolovni čas",
    "Arrheniusova enačba | aktivacijska energija, teorija trkov",
  ]],
  ["Elektrokemija", [
    "Elektrokemija | galvanski členi, Nernstova enačba, elektroliza",
  ]],
  ["Zgradba molekul", [
    "Uvod v kvantno mehaniko | valovna funkcija, načelo nedoločenosti, delec v neskončni potencialni jami",
    "Molekulska spektroskopija | rotacijski in vibracijski spektri",
  ]],
];

const FIZKEM = [...FIZKEM_1, FIZKEM_2[0], FIZKEM_2[1]]; // celoletna Fizikalna kemija (UL FKKT)

const KEM_TERMO = [
  ["Termodinamika", [
    "Plini | splošna plinska enačba, parcialni tlaki, Daltonov zakon",
    "Prvi zakon termodinamike | delo, toplota, notranja energija, izotermne in adiabatne spremembe",
    "Termokemija | reakcijska entalpija, Hessov zakon, Kirchhoffov zakon",
    "Drugi zakon termodinamike | entropija, toplotni stroji, Carnotov izkoristek",
    "Gibbsova energija in kemijsko ravnotežje | ΔG = ΔH − TΔS, zveza med ΔG° in K, van 't Hoffova enačba",
    "Fazna ravnotežja | fazni diagrami, Clausius-Clapeyronova enačba",
  ]],
];

const BIOKEM_TEMELJI = [
  ["Biomolekule", [
    "Aminokisline in proteini | kislinsko-bazne lastnosti, zgradba proteinov",
    "Ogljikovi hidrati in lipidi | zgradba, vloga v celici",
    "Nukleinske kisline | zgradba DNA in RNA, podvajanje",
  ]],
  ["Encimi", [
    "Encimska kinetika | Michaelis-Mentenova enačba, inhibicija",
  ]],
];

const BIOKEM = [
  ["Encimi in presnova", [
    "Encimska kinetika | Michaelis-Mentenova enačba, inhibicija",
    "Bioenergetika | ATP, redoks potenciali v celici, sklopljene reakcije",
    "Presnova | glikoliza, citratni cikel, oksidativna fosforilacija",
  ]],
  ["Biomolekule", [
    "Aminokisline in proteini | kislinsko-bazne lastnosti, zgradba proteinov",
    "Nukleinske kisline | zgradba DNA in RNA, podvajanje",
  ]],
];

const BIOKEM_UVOD = [BIOKEM_TEMELJI[0], BIOKEM[0]]; // Biokemija in uvod v vede o življenju (UM)

const STRUKT_BIOMOL = [
  ["Struktura bioloških molekul", [
    "Zgradba proteinov | sekundarne strukture, Ramachandranov diagram, zvijanje",
    "Nukleinske kisline | zgradba DNA in RNA, podvajanje",
    "Rentgenska difrakcija | Braggov zakon, recipročna mreža",
  ]],
];

const ENCIMATIKA = [
  ["Encimatika", [
    "Encimska kinetika | Michaelis-Mentenova enačba, inhibicija",
    "Inhibicija encimov | kompetitivna in nekompetitivna inhibicija, Lineweaver-Burkov diagram",
    "Mehanizmi encimske katalize | kislinsko-bazna in kovalentna kataliza, alosterija",
  ]],
];

const SPEKTRO_BIOKEM = [
  ["Spektroskopske metode v biokemiji", [
    "Spektrometrične metode | Beer-Lambertov zakon, UV-VIS, atomska absorpcijska spektrometrija",
    "Fluorescenca in cirkularni dikroizem | kvantni izkoristek, sekundarna struktura",
    "Spektroskopija organskih spojin | IR, NMR, masna spektrometrija",
  ]],
];

// ---------------------------------------------------------------- inženirstvo

const BILANCE = [
  ["Bilance procesov", [
    "Snovne bilance | bilance sestavin, mešanje tokov, recikel, stopnja pretvorbe",
    "Energijske bilance | odprti sistemi, entalpija toka",
    "Plini | splošna plinska enačba, parcialni tlaki, Daltonov zakon",
  ]],
];

const OSN_INZ = [
  ["Osnove inženirstva", [
    "Enote in dimenzijska analiza | pretvorbe, brezdimenzijska števila",
    "Snovne bilance | bilance sestavin, mešanje tokov, recikel, stopnja pretvorbe",
    "Energijske bilance | odprti sistemi, entalpija toka",
  ]],
];

const MEH_TEKOCIN = [
  ["Mehanika tekočin", [
    "Hidrostatika | tlak v tekočini, sile na ploskve, vzgon",
    "Kontinuitetna in Bernoullijeva enačba | hidrostatika, tok idealne tekočine",
    "Viskoznost in Reynoldsovo število | laminarni in turbulentni tok",
    "Tlačne izgube v ceveh | Darcy-Weisbachova enačba, lokalne izgube",
  ]],
];

const PRENOS_TOPLOTE = [
  ["Prenos toplote", [
    "Prevod toplote | Fourierov zakon, večplastne stene, toplotni upor",
    "Konvekcija in prestop toplote | toplotna prestopnost, brezdimenzijska števila",
    "Sevanje | Stefan-Boltzmannov zakon, emisivnost",
    "Toplotni prenosniki | logaritemska srednja temperaturna razlika",
  ]],
];

const PRENOS_SNOVI = [
  ["Prenos snovi", [
    "Difuzija in prenos snovi | Fickov zakon, snovna prestopnost",
    "Absorpcija in ekstrakcija | porazdelitveni koeficient, bilance",
  ]],
];

const PRENOS = [...PRENOS_TOPLOTE, PRENOS_SNOVI[0]];

const KI_1 = [...OSN_INZ, MEH_TEKOCIN[0]];
const KI_2 = [...PRENOS_TOPLOTE, PRENOS_SNOVI[0], ["Ločevanje", ["Destilacija | ravnotežne stopnje, McCabe-Thiele"]]];
const OSN_KI = [BILANCE[0], MEH_TEKOCIN[0], PRENOS_TOPLOTE[0]];

const KI_TERMO = [
  ["Kemijsko inženirska termodinamika", [
    "Energijske bilance | odprti sistemi, entalpija toka",
    "Termodinamske lastnosti čistih snovi | parni tlak, Antoinova enačba, tabele",
    "Fazna ravnotežja zmesi | Raoultov zakon, Henryjev zakon, diagrami T-x-y",
    "Gibbsova energija in kemijsko ravnotežje | ΔG = ΔH − TΔS, zveza med ΔG° in K, van 't Hoffova enačba",
  ]],
];

const KRT = [
  ["Kemijska reakcijska tehnika", [
    "Reakcijska hitrost in stehiometrija | konverzija, hitrostni zakoni",
    "Šaržni reaktor | čas reakcije za dano konverzijo",
    "Pretočni reaktorji | idealni mešalni (CSTR) in cevni reaktor, zadrževalni čas",
    "Neizotermni reaktorji | energijska bilanca reaktorja",
  ]],
];

const SEPARACIJE = [
  ["Separacijski procesi", [
    "Destilacija | ravnotežne stopnje, McCabe-Thiele",
    "Absorpcija in ekstrakcija | porazdelitveni koeficient, bilance",
    "Filtracija in sedimentacija | Stokesov zakon",
  ]],
];
const SEP_1 = [["Separacijska tehnika", [SEPARACIJE[0][1][2], "Mehanske operacije | mletje, sejanje, mešanje", SEPARACIJE[0][1][1]]]];
const SEP_2 = [["Separacijska tehnika", [SEPARACIJE[0][1][0], "Kristalizacija in sušenje | bilance, ravnotežja", "Membranski procesi | pretok, selektivnost"]]];

const PRODUKTNO = [
  ["Produktno inženirstvo", [
    "Načrtovanje produktov | specifikacije, izbor sestavin, formulacije",
    "Lastnosti disperzij | emulzije, suspenzije, reologija",
  ]],
];

const DIN_PROCESOV = [
  ["Dinamika procesov", [
    "Dinamika procesov prvega reda | časovna konstanta, odziv na stopnico",
    "Laplaceova transformacija | lastnosti, inverzna transformacija, reševanje linearnih diferencialnih enačb",
    "Prenosne funkcije | odziv linearnega sistema, poli in stabilnost",
    "Regulacija | PID regulator, stabilnost zaprte zanke",
  ]],
];

const OPTIMIRANJE = [
  ["Optimiranje procesov", [
    "Optimizacija z vezmi | Lagrangeovi multiplikatorji, Kuhn-Tuckerjevi pogoji",
    "Linearno programiranje | simpleksna metoda, dualnost, grafična rešitev",
  ]],
];

const PROC_TEHNIKA = [BILANCE[0], MEH_TEKOCIN[0], PRENOS_TOPLOTE[0]];

const GORENJE = [
  ["Gorenje in požar", [
    "Stehiometrija gorenja | potreba po zraku, sestava dimnih plinov, kurilnost",
    "Meje eksplozivnosti in plamenišče | koncentracijske meje, Le Chatelierova formula",
    "Sevanje | Stefan-Boltzmannov zakon, emisivnost",
    "Prvi zakon termodinamike | delo, toplota, notranja energija, izotermne in adiabatne spremembe",
  ]],
];

// ---------------------------------------------------------------- strojništvo

const STATIKA = [
  ["Statika", [
    "Sile in momenti | rezultanta sil, moment sile, dvojica sil",
    "Ravnotežje togega telesa | reakcije podpor, prostoležeči nosilec, konzola",
    "Paličja | metoda vozlišč, metoda prereza",
    "Trenje | Coulombovo trenje, lepenje",
  ]],
  ["Kinematika", [
    "Kinematika | premo in krivo gibanje, poševni met, kroženje",
    "Kinematika togega telesa | ravninsko gibanje, trenutni pol hitrosti",
  ]],
];

const TRDNOST = [
  ["Trdnost", [
    "Napetosti in deformacije | Hookov zakon, natezni preizkus, dopustna napetost",
    "Osna obremenitev | raztezek palice, toplotne napetosti",
    "Upogib nosilcev | prečne sile in upogibni momenti, upogibna napetost",
    "Torzija | strižna napetost v okrogli gredi, zasuk",
    "Uklon | Eulerjeva kritična sila",
  ]],
];

const TERMO_FS = [
  ["Osnove", [
    "Idealni plin in kinetična teorija | plinska enačba, notranja energija, toplotne kapacitete",
    "Prvi zakon termodinamike | delo, toplota, notranja energija, izotermne in adiabatne spremembe",
    "Drugi zakon termodinamike | entropija, toplotni stroji, Carnotov izkoristek",
  ]],
  ["Uporaba", [
    "Krožni procesi | Ottov, Dieslov, Jouleov in Rankinov proces",
    "Vlažen zrak | absolutna in relativna vlažnost, Mollierov diagram",
  ]],
];

const DINAMIKA = [
  ["Dinamika", [
    "Newtonovi zakoni in sile | trenje, sile pri kroženju, gravitacija",
    "Delo, energija in gibalna količina | izrek o kinetični energiji, ohranitveni zakoni, trki",
    "Vrtenje togega telesa | navor, vztrajnostni moment, vrtilna količina",
    "Harmonično nihanje | nihajni čas, nihalo na vijačni vzmeti, matematično nihalo, dušenje",
    "Majhna nihanja | lastni načini, sklopljena nihala",
  ]],
];

const KOV_MAT = [
  ["Kovinski materiali", [
    "Kristalna zgradba kovin | kristalne mreže, napake v kristalih",
    "Fazni diagrami | binarni diagrami, vzvodno pravilo, diagram Fe-C",
    "Toplotna obdelava jekel | kaljenje, popuščanje, žarjenje",
    "Mehanske lastnosti materialov | natezni preizkus, trdota, žilavost",
  ]],
];

const NEKOV_MAT = [
  ["Nekovinski materiali", [
    "Polimeri | zgradba, termoplasti in duromeri, lastnosti",
    "Keramika in kompoziti | zgradba, lastnosti, uporaba",
  ]],
];

const MATERIALI = [...KOV_MAT, ...NEKOV_MAT];

const ELEKTRO = [
  ["Elektrotehnika", [
    "Električni tok in vezja | Ohmov zakon, Kirchhoffova zakona, RC vezje",
    "Izmenični tokovi | kazalci, impedanca, delovna in jalova moč",
    "Električni stroji | transformator, enosmerni in asinhronski motor",
  ]],
];

const STROJNI_EL = [
  ["Strojni elementi", [
    "Vijačne zveze | sila v vijaku, pritezni moment, trdnostni preračun",
    "Gredi in ležaji | dimenzioniranje na upogib in torzijo, življenjska doba ležaja",
    "Zobniki | prestavno razmerje, modul, sile na zobu",
    "Torzija | strižna napetost v okrogli gredi, zasuk",
  ]],
];

// Torzija je že v Trdnosti, zato je tu izpuščena (naslovi tem v predmetu morajo biti enolični).
const STROJNI_GRADBENI = [TRDNOST[0], ["Strojni elementi", STROJNI_EL[0][1].filter((t) => !t.startsWith("Torzija"))]];

const METODE_NUM_MOD = [
  ["Numerično modeliranje", [
    "Numerično reševanje diferencialnih enačb | Eulerjeva metoda, metode Runge-Kutta",
    "Metoda končnih elementov | diskretizacija, togostna matrika, palični element",
    "Numerično reševanje sistemov | LU razcep, iterativne metode, napake",
  ]],
];

const HIDRAVLIKA = [
  ["Hidravlika in pnevmatika", [
    "Hidrostatika | tlak v tekočini, sile na ploskve, vzgon",
    "Tlačne izgube v ceveh | Darcy-Weisbachova enačba, lokalne izgube",
    "Hidravlični valji in črpalke | sila, hitrost, pretok, hidravlična moč",
  ]],
];

const ENERGETSKI = [
  ["Energetski stroji in naprave", [
    "Krožni procesi | Ottov, Dieslov, Jouleov in Rankinov proces",
    "Vlažen zrak | absolutna in relativna vlažnost, Mollierov diagram",
    "Toplotni prenosniki | logaritemska srednja temperaturna razlika",
    "Črpalke in turbine | moč, izkoristek, višina črpanja",
  ]],
];

const OBDELAVA_PODATKOV = [
  ["Obdelava in vrednotenje podatkov", [
    "Statistična obdelava rezultatov | povprečje, standardni odklon, interval zaupanja, značilne števke",
    "Interpolacija in aproksimacija | Lagrangeov polinom, metoda najmanjših kvadratov",
    "Statistično sklepanje | intervali zaupanja, preizkušanje domnev",
  ]],
];

// Vsebinski bloki po imenu (za dodatne fakultete v university-extra.js).
const BLOCKS = { MAT_1, MAT_2, MAT_A, MAT_B, MAT_C, ANALIZA_NDE, LA_VA, INTEG_FOURIER, PDE_KOMPL_OPT, ANALIZA_1, ANALIZA_2A, ANALIZA_2B, ANALIZA_3, ALGEBRA_1, ALGEBRA_2, LOGIKA, DISKRETNA, DISKRETNE_STRUKTURE, TOPOLOGIJA, VERJETNOST_1, STATISTIKA, VERJ_STAT, VERJ_MERA, SLUC_PROC, NUMERIKA, NUMERIKA_1, NUMERIKA_2, KOMPLEKSNA, OPTIM, OPER_RAZ, TEORIJA_IGER, FINMAT, FIZ_1, FIZ_2, KLASICNA_FIZIKA, MAT_3_FIZ, MAT_4_FIZ, MATFIZ_1, KLAS_MEH, MEHANIKA_1, EM_POLJE, MODERNA_1, MODERNA_2, KVANTNA, STAT_TERMO, VERJ_FIZ, FTS, OPTIKA, SPL_KEM, KEM_RACUNANJE, ANORG, TRDNINE, ANAL_1, ANAL_2, ORG_1, ORG_2, ORG_1_2, ORG_3, ORG_SINTEZA, ORG_ANALIZA, SPEKTROSKOPIJA, STRUKTURA_AM, FIZKEM_1, FIZKEM_2, FIZKEM, KEM_TERMO, BIOKEM_TEMELJI, BIOKEM, BIOKEM_UVOD, STRUKT_BIOMOL, ENCIMATIKA, SPEKTRO_BIOKEM, BILANCE, OSN_INZ, MEH_TEKOCIN, PRENOS_TOPLOTE, PRENOS_SNOVI, PRENOS, KI_1, KI_2, OSN_KI, KI_TERMO, KRT, SEPARACIJE, SEP_1, SEP_2, PRODUKTNO, DIN_PROCESOV, OPTIMIRANJE, PROC_TEHNIKA, GORENJE, STATIKA, TRDNOST, TERMO_FS, DINAMIKA, KOV_MAT, NEKOV_MAT, MATERIALI, ELEKTRO, STROJNI_EL, STROJNI_GRADBENI, METODE_NUM_MOD, HIDRAVLIKA, ENERGETSKI, OBDELAVA_PODATKOV };

// ============================================================ fakultete

export const FACULTIES = {
  "UL-FKKT": "UL Fakulteta za kemijo in kemijsko tehnologijo",
  "UL-FS": "UL Fakulteta za strojništvo",
  "UL-FMF": "UL Fakulteta za matematiko in fiziko",
  "UM-FKKT": "UM Fakulteta za kemijo in kemijsko tehnologijo",
};

export const UNIVERSITIES = {
  UL: "Univerza v Ljubljani",
  UM: "Univerza v Mariboru",
  UP: "Univerza na Primorskem",
  UNG: "Univerza v Novi Gorici",
};

export const FAC_SHORT = { "UL-FKKT": "UL FKKT", "UL-FS": "UL FS", "UL-FMF": "UL FMF", "UM-FKKT": "UM FKKT" };

// Predmeti po fakultetah: koda -> [ime predmeta, predmet aplikacije (MAT|FIZ|KEM), vsebina].
// Isti predmet pri več programih iste fakultete je zapisan enkrat.
const COURSES = {
  "UL-FKKT": {
    MAT: ["Matematika", "MAT", [...MAT_1, ...MAT_2]],
    MAT1: ["Matematika I", "MAT", MAT_1],
    MAT2: ["Matematika II", "MAT", MAT_2],
    FIZ: ["Fizika", "FIZ", [...FIZ_1, ...FIZ_2]],
    FIZ1: ["Fizika I", "FIZ", FIZ_1],
    FIZ2: ["Fizika II", "FIZ", FIZ_2],
    KEMIJA: ["Kemija", "KEM", SPL_KEM],
    SPLKEM: ["Splošna kemija", "KEM", SPL_KEM],
    ANORG: ["Anorganska kemija", "KEM", ANORG],
    TRDNINE: ["Zgradba in lastnosti trdnin", "KEM", TRDNINE],
    ANAL1: ["Analizna kemija I", "KEM", ANAL_1],
    ANAL2: ["Analizna kemija II", "KEM", ANAL_2],
    ORG1: ["Organska kemija I", "KEM", ORG_1],
    ORG2: ["Organska kemija II", "KEM", ORG_2],
    ORG3: ["Organska kemija III", "KEM", ORG_3],
    ORG: ["Organska kemija", "KEM", ORG_1_2],
    ORGANAL: ["Organska analiza", "KEM", ORG_ANALIZA],
    FIZKEM: ["Fizikalna kemija", "KEM", FIZKEM],
    STRUKT: ["Struktura atomov in molekul", "KEM", STRUKTURA_AM],
    SPEKTRO: ["Spektroskopija", "KEM", SPEKTROSKOPIJA],
    INSTR: ["Instrumentalne metode", "KEM", ANAL_2],
    INSTRANAL: ["Instrumentalne metode analize", "KEM", ANAL_2],
    BIOLKEM: ["Biološka kemija", "KEM", BIOKEM],
    OSNKI: ["Osnove kemijskega inženirstva", "KEM", OSN_KI],
    TEMBIOKEM: ["Temelji biokemije", "KEM", BIOKEM_TEMELJI],
    BIOKEM: ["Biokemija", "KEM", BIOKEM],
    STRUKTBIO: ["Osnove strukture bioloških molekul", "KEM", STRUKT_BIOMOL],
    SPEKTROBIO: ["Spektroskopske metode v biokemiji", "KEM", SPEKTRO_BIOKEM],
    ENCIM: ["Encimatika", "KEM", ENCIMATIKA],
    OSNINZ: ["Osnove inženirstva", "FIZ", OSN_INZ],
    KI1: ["Kemijsko inženirstvo I", "FIZ", KI_1],
    KI2: ["Kemijsko inženirstvo II", "FIZ", KI_2],
    KEMTERMO: ["Kemijska termodinamika", "KEM", KEM_TERMO],
    MEHFLU: ["Mehanika fluidov", "FIZ", MEH_TEKOCIN],
    MATINZ: ["Materiali za inženirje", "KEM", MATERIALI],
    KVANT: ["Kvantna mehanika", "FIZ", KVANTNA],
    PRENOS: ["Prenos toplote in snovi", "FIZ", PRENOS],
    KRI: ["Kemijsko reakcijsko inženirstvo", "KEM", KRT],
    KITERMO: ["Kemijsko inženirska termodinamika", "KEM", KI_TERMO],
    PRODUKT: ["Kemijsko produktno inženirstvo", "KEM", PRODUKTNO],
    SEPAR: ["Separacijski procesi", "KEM", SEPARACIJE],
    NUMVAR: ["Numerična in računalniška orodja v varnosti", "MAT", NUMERIKA],
    STROJGRAD: ["Strojni in gradbeni elementi", "FIZ", STROJNI_GRADBENI],
    PROCTEH: ["Osnove procesne tehnike", "FIZ", PROC_TEHNIKA],
    OSNMAT: ["Osnove materialov", "KEM", MATERIALI],
    GORENJE: ["Gorenje in dinamika požarov", "KEM", GORENJE],
    STATVAR: ["Statistika varnosti", "MAT", VERJ_STAT],
    ELEKTROVAR: ["Elektrotehnika in varnost", "FIZ", ELEKTRO],
  },
  "UL-FS": {
    ANDE: ["Analiza in navadne diferencialne enačbe", "MAT", ANALIZA_NDE],
    FIZ: ["Fizika", "FIZ", FIZ_1],
    STATKIN: ["Statika in kinematika", "FIZ", STATIKA],
    LAVA: ["Linearna algebra in vektorska analiza", "MAT", LA_VA],
    TRDNOST: ["Trdnost", "FIZ", TRDNOST],
    NEKOVMAT: ["Nekovinski materiali – RRP", "KEM", NEKOV_MAT],
    TERMO: ["Termodinamika", "FIZ", TERMO_FS],
    KOVMAT: ["Kovinski materiali – RRP", "KEM", KOV_MAT],
    ELEKTRO: ["Elektrotehnika", "FIZ", ELEKTRO],
    INTFOUR: ["Integralske transformacije in Fourierova analiza", "MAT", INTEG_FOURIER],
    DINAMIKA: ["Dinamika togih teles", "FIZ", DINAMIKA],
    TEKOCINE: ["Statika in dinamika tekočin", "FIZ", MEH_TEKOCIN],
    NUMERIKA: ["Numerične metode", "MAT", NUMERIKA],
    STROJEL1: ["Strojni elementi 1 – RRP", "FIZ", STROJNI_EL],
    PDEKOMPL: ["Parcialne diferencialne enačbe, kompleksna analiza in optimizacija", "MAT", PDE_KOMPL_OPT],
    PRENOS: ["Prenos toplote", "FIZ", PRENOS_TOPLOTE],
    NUMMOD: ["Metode numeričnega modeliranja", "MAT", METODE_NUM_MOD],
    HIDRAVLIKA: ["Hidravlika in pnevmatika – RRP", "FIZ", HIDRAVLIKA],
    ENERGETSKI: ["Energetski stroji in naprave – RRP", "FIZ", ENERGETSKI],
    PODATKI: ["Obdelava in vrednotenje podatkov", "MAT", OBDELAVA_PODATKOV],
  },
  "UL-FMF": {
    ANALIZA1: ["Analiza 1", "MAT", ANALIZA_1],
    ALGEBRA1: ["Algebra 1", "MAT", ALGEBRA_1],
    LOGIKA: ["Logika in množice", "MAT", LOGIKA],
    FIZIKA1: ["Fizika 1", "FIZ", FIZ_1],
    ANALIZA2A: ["Analiza 2a", "MAT", ANALIZA_2A],
    ANALIZA2B: ["Analiza 2b", "MAT", ANALIZA_2B],
    ALGEBRA2: ["Algebra 2", "MAT", ALGEBRA_2],
    DISKRETNA1: ["Diskretna matematika 1", "MAT", DISKRETNA],
    TOPOLOGIJA: ["Splošna topologija", "MAT", TOPOLOGIJA],
    FIZIKA2: ["Fizika 2", "FIZ", FIZ_2],
    ANALIZA3: ["Analiza 3", "MAT", ANALIZA_3],
    ANALIZA4: ["Analiza 4", "MAT", KOMPLEKSNA],
    UVODNUM: ["Uvod v numerične metode", "MAT", NUMERIKA],
    VERJETNOST: ["Verjetnost", "MAT", VERJETNOST_1],
    STATISTIKA: ["Statistika", "MAT", STATISTIKA],
    MEHANIKA1: ["Mehanika 1", "FIZ", MEHANIKA_1],
    DISKRETNE: ["Diskretne strukture", "MAT", DISKRETNE_STRUKTURE],
    ANALIZA2: ["Analiza 2", "MAT", ANALIZA_2A],
    OPTIM: ["Optimizacijske metode", "MAT", OPTIM],
    ANALIZA3F: ["Analiza 3", "MAT", [...ANALIZA_2B, ANALIZA_3[0]]],
    VERJ1: ["Verjetnost 1", "MAT", VERJETNOST_1],
    NUM1: ["Numerične metode 1", "MAT", NUMERIKA_1],
    VERJSTAT: ["Verjetnost in statistika", "MAT", VERJ_STAT],
    FINMAT1: ["Finančna matematika 1", "MAT", FINMAT],
    OPERRAZ: ["Operacijske raziskave", "MAT", OPER_RAZ],
    NUM2: ["Numerične metode 2", "MAT", NUMERIKA_2],
    VERJMERA: ["Verjetnost z mero", "MAT", VERJ_MERA],
    IGRE: ["Teorija iger", "MAT", TEORIJA_IGER],
    STAT1: ["Statistika 1", "MAT", STATISTIKA],
    SLUCPROC: ["Slučajni procesi 1", "MAT", SLUC_PROC],
    KLASFIZ: ["Klasična fizika", "FIZ", KLASICNA_FIZIKA],
    MAT1: ["Matematika I", "MAT", MAT_1],
    KEMIJA1: ["Kemija I", "KEM", SPL_KEM],
    MAT2: ["Matematika II", "MAT", MAT_2],
    MODERNA1: ["Moderna fizika I", "FIZ", MODERNA_1],
    VERJFIZ: ["Verjetnost v fiziki", "FIZ", VERJ_FIZ],
    MAT3: ["Matematika III", "MAT", MAT_3_FIZ],
    STATTERMO: ["Statistična termodinamika", "FIZ", STAT_TERMO],
    MODERNA2: ["Moderna fizika II", "FIZ", MODERNA_2],
    MAT4: ["Matematika IV", "MAT", MAT_4_FIZ],
    KLASMEH: ["Klasična mehanika", "FIZ", KLAS_MEH],
    MATFIZ: ["Matematična fizika I", "FIZ", MATFIZ_1],
    NUMERIKA: ["Numerične metode", "MAT", NUMERIKA],
    EMPOLJE: ["Elektromagnetno polje", "FIZ", EM_POLJE],
    KVANT: ["Kvantna mehanika", "FIZ", KVANTNA],
    FTS: ["Fizika trdne snovi", "FIZ", FTS],
    OPTIKA: ["Optika", "FIZ", OPTIKA],
  },
  "UM-FKKT": {
    MATA: ["Matematika A", "MAT", MAT_A],
    MATB: ["Matematika B", "MAT", MAT_B],
    MATC: ["Matematika C", "MAT", MAT_C],
    SPLKEM: ["Splošna kemija", "KEM", SPL_KEM],
    FIZ1: ["Fizika I", "FIZ", FIZ_1],
    FIZ2: ["Fizika II", "FIZ", FIZ_2],
    ANORG: ["Anorganska kemija", "KEM", ANORG],
    ANAL1: ["Analizna kemija I", "KEM", ANAL_1],
    ANAL2: ["Analizna kemija II", "KEM", ANAL_2],
    KEMRAC: ["Kemijsko računanje", "KEM", KEM_RACUNANJE],
    BILANCE: ["Procesne bilance", "KEM", BILANCE],
    FIZKEM1: ["Fizikalna kemija I", "KEM", FIZKEM_1],
    FIZKEM2: ["Fizikalna kemija II", "KEM", FIZKEM_2],
    ORG1: ["Organska kemija I", "KEM", ORG_1],
    ORG2: ["Organska kemija II", "KEM", ORG_2],
    MEHFLU1: ["Mehanika fluidov I", "FIZ", MEH_TEKOCIN],
    PRENOST: ["Prenos toplote", "FIZ", PRENOS_TOPLOTE],
    PRENOSS: ["Prenos snovi", "KEM", PRENOS_SNOVI],
    SEP1: ["Separacijska tehnika I", "KEM", SEP_1],
    SEP2: ["Separacijska tehnika II", "KEM", SEP_2],
    SEPTEH: ["Separacijska tehnika", "KEM", SEPARACIJE],
    TERMO: ["Termodinamika", "KEM", KEM_TERMO],
    ORGSINT: ["Organska sinteza", "KEM", ORG_SINTEZA],
    BIOKEMUVOD: ["Biokemija in uvod v vede o življenju", "KEM", BIOKEM_UVOD],
    KRT1: ["Kemijska reakcijska tehnika I", "KEM", KRT],
    ORGANAL: ["Organska analiza", "KEM", ORG_ANALIZA],
    DINPROC: ["Dinamika procesov", "MAT", DIN_PROCESOV],
    OPTIM: ["Optimiranje procesov", "MAT", OPTIMIRANJE],
  },
};

// Programi: obvezni predmeti po letnikih (1., 2., 3. letnik) in izbirni z naravoslovno vsebino.
export const PROGRAMS = {
  "UL-FKKT-KEM": {
    faculty: "UL-FKKT",
    name: "Kemija",
    source: "https://fkkt.uni-lj.si/fileadmin/user_upload/Studentski_referat/Zborniki/2026-2027/1000373_Kemija.pdf",
    sourceYear: "2026/27",
    years: [
      ["MAT", "FIZ", "SPLKEM", "ANORG", "TRDNINE", "ANAL1"],
      ["ANAL2", "ORG1", "FIZKEM", "STRUKT", "ORG2", "SPEKTRO"],
      ["ORG3", "ORGANAL", "INSTR", "BIOLKEM", "OSNKI"],
    ],
  },
  "UL-FKKT-BIO": {
    faculty: "UL-FKKT",
    name: "Biokemija",
    source: "https://fkkt.uni-lj.si/fileadmin/user_upload/Studentski_referat/Zborniki/2026-2027/1000371_Biokemija.pdf",
    sourceYear: "2026/27",
    years: [
      ["MAT", "FIZ", "SPLKEM", "ANORG", "ORG1", "TEMBIOKEM"],
      ["ORG2", "FIZKEM", "BIOKEM", "INSTRANAL", "STRUKTBIO"],
      ["SPEKTROBIO", "ENCIM"],
    ],
  },
  "UL-FKKT-KI": {
    faculty: "UL-FKKT",
    name: "Kemijsko inženirstvo",
    source: "https://fkkt.uni-lj.si/fileadmin/user_upload/Studentski_referat/Zborniki/2026-2027/1000372_Kemijsko_inzenirstvo.pdf",
    sourceYear: "2026/27",
    years: [
      ["MAT", "FIZ", "SPLKEM", "OSNINZ", "ANORG", "KI1"],
      ["MAT2", "ORG", "KEMTERMO", "INSTRANAL", "KI2", "MEHFLU", "MATINZ", "KVANT"],
      ["PRENOS", "KRI", "KITERMO", "PRODUKT", "SEPAR"],
    ],
  },
  "UL-FKKT-TV": {
    faculty: "UL-FKKT",
    name: "Tehniška varnost",
    source: "https://fkkt.uni-lj.si/fileadmin/user_upload/Studentski_referat/Zborniki/2026-2027/1000370_Tehniska_varnost.pdf",
    sourceYear: "2026/27",
    years: [
      ["MAT1", "FIZ1", "KEMIJA", "MAT2", "FIZ2"],
      ["NUMVAR", "STROJGRAD", "PROCTEH", "OSNMAT", "GORENJE"],
      ["STATVAR", "ELEKTROVAR"],
    ],
  },
  "UL-FS-RRP": {
    faculty: "UL-FS",
    name: "Strojništvo – razvojno raziskovalni program",
    source: "https://www.fs.uni-lj.si/studij/studij-1-stopnje/un/predmetnik-2023-2024/",
    sourceYear: "2023/24; 1. letnik potrjen z zbornikom 2026/27",
    years: [
      ["ANDE", "FIZ", "STATKIN", "LAVA", "TRDNOST", "NEKOVMAT", "TERMO", "KOVMAT", "ELEKTRO"],
      ["INTFOUR", "DINAMIKA", "TEKOCINE", "NUMERIKA", "STROJEL1", "PDEKOMPL", "PRENOS"],
      ["NUMMOD", "HIDRAVLIKA", "ENERGETSKI", "PODATKI"],
    ],
  },
  "UL-FMF-MAT": {
    faculty: "UL-FMF",
    name: "Matematika",
    source: "https://www.fmf.uni-lj.si/sl/studij-matematike/programi/1mate/2025/",
    sourceYear: "2018/19; novejši predmetnik še ni preverjen",
    years: [
      ["ANALIZA1", "ALGEBRA1", "LOGIKA", "FIZIKA1"],
      ["ANALIZA2A", "ANALIZA2B", "ALGEBRA2", "DISKRETNA1", "TOPOLOGIJA", "FIZIKA2"],
      ["ANALIZA3", "ANALIZA4", "UVODNUM", "VERJETNOST", "STATISTIKA", "MEHANIKA1"],
    ],
  },
  "UL-FMF-FIMA": {
    faculty: "UL-FMF",
    name: "Finančna matematika",
    source: "https://www.fmf.uni-lj.si/documents/1414/1000403_Finan%C4%8Dna_matematika.pdf",
    sourceYear: "2025/26",
    years: [
      ["ANALIZA1", "ALGEBRA1", "DISKRETNE", "ANALIZA2", "OPTIM"],
      ["ANALIZA3F", "VERJ1", "NUM1", "VERJSTAT", "FINMAT1", "OPERRAZ", "NUM2"],
      ["VERJMERA", "IGRE", "STAT1", "SLUCPROC"],
    ],
  },
  "UL-FMF-FIZ": {
    faculty: "UL-FMF",
    name: "Fizika",
    source: "https://www.fmf.uni-lj.si/documents/343/1000406_Fizika.pdf",
    sourceYear: "smer Fizika; 1. letnik je skupen vsem smerem",
    years: [
      ["KLASFIZ", "MAT1", "KEMIJA1", "MAT2"],
      ["MODERNA1", "VERJFIZ", "MAT3", "STATTERMO", "MODERNA2", "MAT4", "KLASMEH"],
      ["EMPOLJE", "KVANT", "FTS"],
    ],
    electives: ["MATFIZ", "NUMERIKA", "OPTIKA"],
  },
  "UM-FKKT-KEM": {
    faculty: "UM-FKKT",
    name: "Kemija",
    source: "https://www.fkkt.um.si/wp-content/uploads/2025/09/Predmetnik-1.-stopnja-UN-KE.pdf",
    sourceYear: "2025/26",
    years: [
      ["MATA", "SPLKEM", "FIZ1", "MATB", "ANORG", "ANAL1", "FIZ2", "KEMRAC"],
      ["MATC", "FIZKEM1", "ORG1", "ANAL2", "ORG2", "FIZKEM2"],
      ["TERMO", "ORGSINT", "BIOKEMUVOD", "SEPTEH", "KRT1", "ORGANAL"],
    ],
    electives: ["PRENOST", "PRENOSS"],
  },
  "UM-FKKT-KI": {
    faculty: "UM-FKKT",
    name: "Kemijsko inženirstvo",
    source: "https://www.fkkt.um.si/wp-content/uploads/2025/09/Predmetnik-1.-stopnja-UN-KI.pdf",
    sourceYear: "2025/26; 3. letnik še ni preverjen",
    years: [
      ["MATA", "SPLKEM", "FIZ1", "MATB", "ANORG", "ANAL1", "FIZ2", "BILANCE"],
      ["MATC", "FIZKEM1", "ORG1", "MEHFLU1", "PRENOST", "ANAL2", "PRENOSS", "SEP1", "ORG2", "FIZKEM2"],
      ["TERMO", "SEP2", "KRT1", "DINPROC", "OPTIM"],
    ],
  },
};

// Dodatne fakultete in predmeti (zbrani predmetniki naravoslovnih fakultet).
// Predmet: [ime, predmet, [imena blokov], [[sklop, [teme]]]]; programi kot zgoraj.
// Pri že obstoječi fakulteti se predmeti dodajo, letniki istega programa pa združijo.
for (const fac of EXTRA_FACULTIES) {
  FACULTIES[fac.id] ||= fac.name;
  FAC_SHORT[fac.id] ||= fac.short;
  COURSES[fac.id] ||= {};
  for (const [code, [name, subject, blocks, units]] of Object.entries(fac.courses)) {
    const content = [...blocks.flatMap((b) => {
      if (!BLOCKS[b]) throw new Error(`university-extra: neznan blok ${b}`);
      return BLOCKS[b];
    }), ...units];
    if (COURSES[fac.id][code]) throw new Error(`university-extra: podvojen predmet ${fac.id} ${code}`);
    COURSES[fac.id][code] = [name, subject, content];
  }
  for (const [id, p] of Object.entries(fac.programs)) {
    const old = PROGRAMS[id];
    if (!old) {
      PROGRAMS[id] = { faculty: fac.id, ...p };
      continue;
    }
    // replace: preverjen celoten predmetnik zamenja prejšnjega.
    if (p.replace) {
      Object.assign(old, { years: p.years, electives: p.electives || [] }, p.source ? { source: p.source } : {}, p.sourceYear ? { sourceYear: p.sourceYear } : {});
      continue;
    }
    p.years.forEach((codes, i) => (old.years[i] = [...(old.years[i] || []), ...codes.filter((c) => !(old.years[i] || []).includes(c))]));
    old.electives = [...(old.electives || []), ...(p.electives || [])];
  }
}

const courseKey = (fac, code) => `UNI-${fac.replace("-", "")}-${code}`;

// Razširitve po učnih načrtih: teme v obstoječi sklop (po naslovu) ali nov sklop na konec.
// Bloki so skupni več predmetom, zato predmet dobi svojo kopijo sklopov.
for (const [key, extra] of Object.entries(COURSE_EXTENSIONS)) {
  const [fac, code] = Object.keys(COURSES).flatMap((f) => Object.keys(COURSES[f]).map((c) => [f, c])).find(([f, c]) => courseKey(f, c) === key) || [];
  if (!fac) throw new Error(`university-razsiritve: neznan predmet ${key}`);
  const course = COURSES[fac][code];
  const units = course[2].map(([title, topics]) => [title, [...topics]]);
  // Neobvezno: { after: "naslov teme" } vstavi teme za to temo, { before: "naslov sklopa" } nov sklop pred ta sklop.
  for (const [title, topics, { after, before } = {}] of extra) {
    const unit = units.find(([t]) => t === title);
    if (unit) {
      const at = after ? unit[1].findIndex((t) => t.split(" | ")[0] === after) : -1;
      if (after && at < 0) throw new Error(`university-razsiritve: ${key} nima teme ${after}`);
      unit[1].splice(at < 0 ? unit[1].length : at + 1, 0, ...topics);
    } else {
      const at = before ? units.findIndex(([t]) => t === before) : -1;
      if (before && at < 0) throw new Error(`university-razsiritve: ${key} nima sklopa ${before}`);
      units.splice(at < 0 ? units.length : at, 0, [title, [...topics]]);
    }
  }
  COURSES[fac][code] = [course[0], course[1], units];
}

// Poti za curriculum.js: ena pot na predmet fakultete.
export const UNI_PATHS = {};
for (const [fac, courses] of Object.entries(COURSES)) {
  for (const [code, [name, subject, units]] of Object.entries(courses)) {
    UNI_PATHS[courseKey(fac, code)] = { label: `${name} (${FAC_SHORT[fac]})`, subject, school: "UNI", faculty: fac, units };
  }
}

// Oznaka programa in ključi poti po letnikih (+ izbirni).
for (const p of Object.values(PROGRAMS)) {
  p.label = `${FAC_SHORT[p.faculty]} – ${p.name} (${p.degree || "UN"})`;
  p.courseKeys = p.years.map((codes) => codes.map((c) => courseKey(p.faculty, c)));
  p.electiveKeys = (p.electives || []).map((c) => courseKey(p.faculty, c));
  for (const k of [...p.courseKeys.flat(), ...p.electiveKeys]) {
    if (!UNI_PATHS[k]) throw new Error(`university-data: program ${p.name} navaja neznan predmet ${k}`);
  }
}
