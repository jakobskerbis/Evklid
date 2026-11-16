// Razširitve predmetov po uradnih učnih načrtih (vsebina po tednih predavanj).
// Ključ je pot predmeta (UNI-<fakulteta>-<koda>); vsak vnos doda teme v obstoječi sklop z istim
// naslovom ali nov sklop na konec. Obstoječih tem ne preimenujemo, ker so nanje vezane lekcije.
// Tretji element vnosa je neobvezen: { after: tema } ali { before: sklop } določi mesto.
// UL FKKT 1. letnik Kemija: učni načrti 2026/27 (1000373_Kemija_Ucni_nacrti_2026-2027.pdf), 30. 10. 2026.
export const COURSE_EXTENSIONS = {
  "UNI-ULFKKT-SPLKEM": [
    [
      "Zgradba snovi",
      [
        "Teorija molekulskih orbital | vezne in protivezne orbitale, MO-diagrami dvoatomnih molekul, red vezi, delokalizirane molekulske orbitale",
        "Strukturne formule in nomenklatura anorganskih spojin | Lewisove strukturne formule, resonančne strukture, imenovanje oksidov, kislin, baz in soli"
      ]
    ],
    [
      "Ravnotežja",
      [
        "Protoliza ionov, indikatorji in titracija | kislinske in bazične lastnosti ionov, pH raztopin soli, kislinsko-bazni indikatorji, titracijska krivulja, ekvivalentna točka"
      ]
    ],
    [
      "Energija in redoks",
      [
        "Elektrokemija | zgradba galvanskega člena, standardna celična napetost, Nernstova enačba, elektroliza, Faradayev zakon",
        "Kemijska kinetika | hitrost reakcije, red reakcije in razpolovni čas, vpliv koncentracije in temperature, aktivacijska energija, homogena in heterogena kataliza"
      ]
    ],
    [
      "Agregatna stanja in disperzni sistemi",
      [
        "Trdne snovi | amorfne in kristalinične snovi, ionski, kovalentni, kovinski in molekulski kristali, polprevodniki, tekoči kristali",
        "Koloidni sistemi | prave in koloidne raztopine, delitev disperznih sistemov, Tyndallov pojav, stabilnost in koagulacija koloidov"
      ]
    ],
    [
      "Koordinacijske spojine",
      [
        "Zgradba in izomerija koordinacijskih spojin | centralni atom in ligandi, koordinacijsko število, geometrija, nomenklatura, geometrijska in optična izomerija",
        "Kemijska vez v koordinacijskih spojinah | razcep d-orbital v kristalnem polju, nizkospinski in visokospinski kompleksi, magnetne lastnosti, barva koordinacijskih ionov"
      ]
    ]
  ],
  "UNI-ULFKKT-ANORG": [
    [
      "Sistematika elementov, kisik in halogeni",
      [
        "Periodni sistem kot osnova sistematike | trendi po skupinah in periodah, kovinski in nekovinski značaj, oksidacijska stanja, kislinsko-bazni značaj oksidov",
        "Kisik, voda in vodikov peroksid | alotropija kisika, oksidi, peroksidi in superoksidi, protolitske reakcije oksidnega, peroksidnega in superoksidnega iona, lastnosti vodikovega peroksida, nomenklatura",
        "Elementi 17. skupine | vodikovi halogenidi, oksidi, oksokisline in oksosoli, medhalogenske spojine, disproporcionacija in vpliv sinteznih pogojev na ravnotežje"
      ],
      {
        "before": "Kemija elementov"
      }
    ],
    [
      "Kemija glavnih skupin",
      [
        "Elementi 16. skupine | vodikove spojine, protoliza sulfidnega iona, oksidi in oksospojine žvepla, selena in telurja, homogena in heterogena kataliza pri sintezi žveplove kisline, halogenidi",
        "Elementi 15. skupine | vodikove spojine, sinteza amoniaka in vpliv pogojev ter katalizatorja na ravnotežje in hitrost, oksidi in oksospojine, halogenidi in sulfidi",
        "Elementi 14. skupine | vodikove spojine, oksidi, oksospojine in soli, Boudouardovo ravnotežje, halogenidi in sulfidi, ogljikov dioksid v vodni raztopini, silikati",
        "Elementi 13. skupine | bor in borani, razlaga strukture boranov s kombinacijo teorije VV in MO, aluminij in njegove spojine, galij, indij in talij",
        "Elementi 18. skupine | lastnosti žlahtnih plinov, ksenonovi fluoridi in oksidi, zgradba in reaktivnost spojin žlahtnih plinov"
      ]
    ],
    [
      "Prehodni elementi in jedrske reakcije",
      [
        "Druga in tretja vrsta prehodnih elementov | primerjava s prvo vrsto, višja oksidacijska stanja, oksidi, hidroksidi in oksokisline, pregled po skupinah",
        "Lantanoidi in aktinoidi | elektronska konfiguracija, lantanoidna kontrakcija, oksidacijska stanja, lastnosti in uporaba",
        "Jedrske reakcije | radioaktivni razpad, razpolovni čas, jedrska cepitev in zlivanje, umetno pridobljeni elementi"
      ]
    ]
  ],
  "UNI-ULFKKT-TRDNINE": [
    [
      "Lastnosti trdnin",
      [
        "Mehanske lastnosti trdnin | trdota, razkolnost, elastičnost in plastičnost, vpliv vezi in strukture",
        "Optične in magnetne lastnosti trdnin | barva in absorpcija svetlobe, lomni količnik, dia-, para- in feromagnetizem, izvor lastnosti v zgradbi"
      ]
    ],
    [
      "Osnove kristalografije",
      [
        "Kristalni sistemi in Bravaisove mreže | amorfne in kristalinične trdnine, periodičnost, kristalna mreža, centriranost, sedem kristalnih sistemov",
        "Simetrija kristalov | simetrijski elementi, kombinacije simetrijskih elementov, točkovne skupine, prostorske skupine",
        "Kristalne ravnine in Millerjevi indeksi | kristalne ravnine, Millerjevi indeksi, medravninska razdalja, zveza z Braggovo enačbo"
      ],
      {
        "before": "Zgradba trdnin"
      }
    ],
    [
      "Strukturni tipi anorganskih trdnin",
      [
        "Kristalna zgradba kovin | najgostejša sklada, osnovna celica in gostota kovine, strukture elementov, substitucijske in intersticijske zlitine, povezava med strukturo in lastnostmi",
        "Strukturni tipi ionskih spojin | strukture AX, AX2, ABX3 in A2BX4, koordinacijski poliedri, razmerje ionskih polmerov, spreminjanje lastnosti z zamenjavo ionov",
        "Silikati | tetraeder SiO4, otočni, verižni, plastni in ogrodni silikati, povezava med strukturo in lastnostmi"
      ]
    ],
    [
      "Difrakcijske metode in mikroskopija",
      [
        "Sipanje sevanja in uklonska slika | rentgenski žarki, nevtroni in pospešeni elektroni, sipanje na elektronih in atomih, interferenca, uklonska slika monokristala in polikristaliničnega materiala, interpretacija uklonske slike",
        "Praškovna rentgenska difrakcija | praškovni difraktogram, kvalitativna in kvantitativna fazna analiza, indeksiranje, natančno določanje parametrov osnovne celice",
        "Elektronska mikroskopija trdnin | vrstična in presevna elektronska mikroskopija, ločljivost, morfologija delcev, elektronska difrakcija"
      ]
    ]
  ],
  "UNI-ULFKKT-ANAL1": [
    [
      "Osnove kvantitativne analize",
      [
        "Analizni proces in priprava vzorca | cilji analizne kemije, faze analize, izbira metode, vzorčenje in priprava vzorca",
        "Umerjanje in parametri analizne metode | umeritvena krivulja, občutljivost, selektivnost, meja zaznave, sistematske in naključne napake"
      ]
    ],
    [
      "Sistematična obravnava ravnotežij",
      [
        "Masna bilanca in porazdelitveni diagrami | homogena in heterogena ravnotežja, masna bilanca, električna nevtralnost, delež zvrsti, porazdelitveni diagrami",
        "Vplivi na topnost | vpliv pH, kompleksiranja z ligandi, tujih elektrolitov in topila na topnost, aktivnostni koeficienti"
      ]
    ],
    [
      "Gravimetrija, titrimetrija in separacije",
      [
        "Gravimetrična analiza | nastanek in rast oborine, vplivi na kristalizacijo, koprecipitacija, koloidne oborine, značilne aplikacije",
        "Osnove titrimetrije | standardne raztopine in primarni standardi, indikacija končne točke, titracijske napake",
        "Obarjalne titracije | titracijske krivulje, argentometrija, Mohrova, Volhardova in Fajansova metoda",
        "Titracije poliprotičnih in amfiprotičnih snovi | titracije poliprotičnih kislin in baz, amfiprotične zvrsti, pufrska kapaciteta, titracije v nevodnih medijih",
        "Separacijski postopki v analizni kemiji | obarjalne separacije, kontrola pH pri ločevanju, kompleksiranje in maskiranje"
      ]
    ]
  ],
  "UNI-ULFKKT-MAT": [
    [
      "Odvod",
      [
        "Diferencial in izreki o povprečni vrednosti | diferencial in linearna aproksimacija, višji odvodi, Rollejev izrek, Lagrangeov izrek",
        "Ciklometrične, hiperbolične in area funkcije | definicije in grafi, odvodi, konveksnost in prevoji, uporaba pri risanju grafov",
        "Parametrično podane krivulje | parametrizacija krivulje, odvod parametrično podane funkcije, tangenta, primeri krivulj"
      ]
    ],
    [
      "Integral",
      [
        "Izlimitirani integrali | neomejeni interval, neomejena funkcija, konvergenca, primerjalni kriterij",
        "Ločna dolžina, površina vrtenine in težišče | ločna dolžina krivulje, površina vrtenine, težišče, vztrajnostni moment"
      ]
    ],
    [
      "Vrste",
      [
        "Taylorjeva vrsta | Taylorjeva formula z ostankom, razvoj e^x, razvoja sin x in cos x, razvoj ln(1+x), binomska vrsta, ocena napake"
      ]
    ],
    [
      "Linearna algebra",
      [
        "Vektorski prostori R^n in C^n | linearna neodvisnost, podprostori, baza in dimenzija, koordinatni sistem v prostoru",
        "Matrike kot linearne preslikave | linearna preslikava in njena matrika, kompozitum in produkt matrik, zasuki in zrcaljenja, Cramerjeve formule"
      ]
    ],
    [
      "Funkcije več spremenljivk",
      [
        "Implicitne funkcije in Taylorjeva formula | funkcija dveh spremenljivk in njen graf, odvajanje implicitno podane funkcije, Taylorjeva formula za funkcijo dveh spremenljivk, kvadratna aproksimacija"
      ]
    ],
    [
      "Diferencialne enačbe",
      [
        "Homogene enačbe in znižanje reda | homogena diferencialna enačba prvega reda, substitucija y = xu, znižanje reda pri enačbah drugega reda"
      ]
    ],
    [
      // Za lastnimi vrednostmi, ker sistem rešujemo z njimi (pregled #494).
      "Linearna algebra in statistika",
      [
        "Sistemi linearnih diferencialnih enačb | sistemi prvega reda s konstantnimi koeficienti, reševanje z lastnimi vrednostmi, zaporedne kemijske reakcije, uporaba v kemiji"
      ],
      { after: "Lastne vrednosti in lastni vektorji" }
    ],
    [
      "Linearna algebra in statistika",
      [
        "Normalna porazdelitev in vzorčenje | populacija in vzorec, predstavitev podatkov, opisne statistike, normalna porazdelitev, standardizacija"
      ]
    ]
  ],
  "UNI-ULFKKT-FIZ": [
    [
      "Kinematika in dinamika",
      [
        "Gibanje težišča in sila curka | sistem točkastih teles, težišče, izrek o gibanju težišča, izrek o gibalni količini, sila curka",
        "Prožnost in prožnostna energija | Hookov zakon, prožnostni modul, raztezek in stisk, prožnostna energija"
      ]
    ],
    [
      "Nihanje in toplota",
      [
        "Vsiljeno in sklopljeno nihanje | vsiljeno nihanje in resonanca, sklopljena nihala, lastna nihanja, nihanja molekul, spekter nihanja"
      ],
      {
        "after": "Harmonično nihanje"
      }
    ],
    [
      "Elektrika",
      [
        "Gaussov zakon in električni dipol | električni pretok, Gaussov zakon, polje električnega dipola, Poissonova enačba",
        "Prevodniki in dielektriki v električnem polju | izoliran prevodnik v polju, influenca, dielektrik v polju, kapaciteta kondenzatorja z dielektrikom",
        "Izmenični tokovi | enosmerni in izmenični tok, efektivna vrednost, izmenični tok skozi ohmski upor in kondenzator, električno delo in moč, merjenje toka in napetosti"
      ]
    ],
    [
      "Magnetizem",
      [
        "Sila na vodnik in magnetni moment | gostota magnetnega polja, sila na vodnik v magnetnem polju, magnetni navor na tokovno zanko, magnetni moment, biomagnetna orientacija s kristali magnetita",
        "Induktivnost in električni nihajni krog | magnetno polje ravnega vodnika in tuljave, induktivnost tuljave, izmenični tok skozi tuljavo, nihajni krog, dušeno nihanje"
      ]
    ],
    [
      "Valovanje in optika",
      [
        "Energijski tok valovanja in akustika | longitudinalno in transverzalno valovanje, gostota energijskega toka, spekter valovanja, jakost zvoka, osnove akustike",
        "Elektromagnetno valovanje in fotometrija | nastanek elektromagnetnega valovanja, hitrost svetlobe, svetlobni energijski tok, absorpcija svetlobe, fotometrija, spekter svetlobe",
        "Oko in optične naprave | enačba zrcal in leč, oko, napake vida in korekcija, povečevalno steklo, mikroskop"
      ]
    ],
    [
      "Moderna fizika",
      [
        "Sevanje | črno telo, Stefanov zakon, Wienov zakon, spekter sevanja",
        "Uklon elektronov in Bohrov model atoma | uklonska slika curka elektronov, valovna narava delcev, Bohrov model vodikovega atoma, spektralne črte"
      ]
    ]
  ],
  "UNI-ULFKKT-NPRSAK": [
    [
      "Priprava raztopin in računi",
      [
        "Plini in plinske zmesi | splošna plinska enačba, merjenje prostornine plina, parcialni tlak, množinski in prostorninski deleži, povprečna molska masa plinske zmesi",
        "Gostota in mešanje raztopin | priprava raztopin iz trdnih topljencev, merjenje gostote tekočin, masni delež in množinska koncentracija, mešanje raztopin",
        "Nevtralizacija in titracije | reakcije med kislinami in bazami, ekvivalentna točka, indikatorji, standardizacija raztopine, določanje mase amonijevega klorida v raztopini"
      ]
    ],
    [
      "Ravnotežja v poskusih",
      [
        "Določanje ravnotežne konstante | ravnotežne koncentracije iz meritev, tabela začetnih in ravnotežnih množin, izračun Kc, ocena napake meritve",
        "Protolitska ravnotežja v raztopinah soli | protolitske reakcije ionov soli, pH raztopin soli, kislost in bazičnost raztopin soli, konjugirani pari kislin in baz",
        "Ionske reakcije in amfoterne snovi | ionske enačbe, obarjalne reakcije, amfoterni hidroksidi, raztapljanje oborin v kislinah in bazah"
      ]
    ],
    [
      "Sinteze anorganskih spojin",
      [
        "Sinteza in karakterizacija bakrovih spojin | sinteza CuI, sinteza K2[Cu(C2O4)2]·2H2O, stehiometrija sinteze, izkoristek, karakterizacija produkta"
      ]
    ]
  ],
  "UNI-ULFKKT-NMOVZ": [
    [
      "Energija in presnova",
      [
        "Encimska kinetika in inhibicija | enačba Michaelisa in Mentenove, Km in vmax, Lineweaver-Burkov diagram, kompetitivna in nekompetitivna inhibicija, koencimi"
      ]
    ],
    [
      "Celični procesi",
      [
        "Celična smrt, oksidativni stres in rak | apoptoza in nekroza, reaktivne kisikove zvrsti, antioksidanti, nastanek raka",
        "Molekularni motorji | citoskelet, miozin, kinezin in dinein, pretvorba kemijske energije ATP v gibanje"
      ]
    ],
    [
      "Biotehnologija in zdravje",
      [
        "Protitelesa in imunski odgovor | zgradba protiteles, prirojena in pridobljena imunost, vezava antigena, uporaba protiteles v diagnostiki"
      ]
    ],
    [
      "Organizmi, evolucija in okolje",
      [
        "Evolucija in filogenija | naravni izbor, nastanek vrst, filogenetsko drevo, tri domene življenja",
        "Organizmi in okolje | ekosistem, prehranjevalne verige, kroženje snovi, odnosi med organizmi"
      ]
    ]
  ]
};
