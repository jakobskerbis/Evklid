// Učne poti po učnih načrtih (OŠ in gimnazija).
//
// OSNUTEK: razporeditev po razredih/letnikih je sestavljena po učnih načrtih
// Zavoda RS za šolstvo in običajnih učbenikih. Uradni učni načrt za OŠ
// matematiko cilje v 3. obdobju navaja skupaj za 7.–9. razred, zato naj
// razporeditev preveri učitelj. Popravke vnašaj kar tukaj.
//
// Oblika: { "<predmet>-<OS|SS>-<razred/letnik>": { label, units: [[sklop, [tema | cilji, ...]], ...] } }
// Tema je zapisana kot "Naslov | kratki cilji".

export const PATHS = {
  // ------------------------------------------------------------ OŠ MATEMATIKA
  "MAT-OS-6": {
    label: "Matematika, 6. razred",
    units: [
      ["Naravna števila", [
        "Zapis in urejanje velikih števil | bere, zapiše in uredi števila do milijona in več, zaokrožuje",
        "Računske operacije in lastnosti | računa s številskimi izrazi z oklepaji, uporablja računske zakone",
        "Deljivost | pravila deljivosti z 2, 3, 5, 9, 10, soda in liha števila",
        "Večkratniki in delitelji | poišče večkratnike in delitelje, prepozna potence kot zapis produkta",
      ]],
      ["Ulomki in decimalna števila", [
        "Ulomek kot del celote | prikaže ulomek na liku in številski premici",
        "Desetiški ulomki in decimalna števila | pretvarja med zapisi, ureja decimalna števila",
        "Računanje z decimalnimi števili | sešteva, odšteva, množi in deli decimalna števila",
      ]],
      ["Enačbe in neenačbe", [
        "Preproste enačbe | reši enačbo s sklepanjem ali preizkušanjem",
        "Preproste neenačbe | poišče rešitve v množici naravnih števil",
        "Sklepni račun | rešuje naloge s povezanimi količinami s tabelo",
      ]],
      ["Geometrija", [
        "Osnovni geometrijski pojmi | točka, premica, poltrak, daljica, vzporednice, pravokotnice",
        "Kot | nariše, izmeri in razvrsti kote",
        "Krog in krožnica | središče, polmer, premer, tetiva",
        "Osnovne konstrukcije | simetrala daljice, simetrala kota, pravokotnica",
        "Simetrija | zrcaljenje čez premico, simetrični liki",
      ]],
      ["Merjenje", [
        "Merske enote | pretvarja dolžinske, masne, časovne, prostorninske enote",
        "Obseg in ploščina pravokotnika in kvadrata | izračuna in uporabi v besedilnih nalogah",
        "Kocka in kvader | mreža, površina, prostornina",
      ]],
      ["Obdelava podatkov", [
        "Množice in diagrami | razvrsti elemente z Euler-Vennovim in Carrollovim diagramom, na primerih uporablja pojme element, množica, presek in unija",
        "Prikazi podatkov | preglednica, stolpčni in črtični prikaz, branje prikazov",
        "Kombinatorične situacije | drevesni prikaz, preštevanje možnosti",
      ]],
    ],
  },
  "MAT-OS-7": {
    label: "Matematika, 7. razred",
    units: [
      ["Deljivost", [
        "Praštevila in razcep | razcep na prafaktorje",
        "Največji skupni delitelj in najmanjši skupni večkratnik | uporaba pri ulomkih in besedilnih nalogah",
      ]],
      ["Ulomki", [
        "Razširjanje in krajšanje ulomkov | enakovredni ulomki, okrajšan ulomek",
        "Primerjanje in urejanje ulomkov | z enakimi in različnimi imenovalci",
        "Seštevanje in odštevanje ulomkov | tudi mešana števila",
        "Množenje in deljenje ulomkov | obratna vrednost, sestavljeni računi",
        "Ulomki v besedilnih nalogah | del celote, celota iz dela",
      ]],
      ["Sorazmerja in odstotki", [
        "Razmerje | okrajšanje razmerja, deljenje v danem razmerju",
        "Premo sorazmerje | tabela, graf, sklepni račun",
        "Obratno sorazmerje | prepozna in uporabi v nalogah",
        "Odstotni račun | delež, osnova, odstotek; popusti in podražitve",
      ]],
      ["Koti", [
        "Vrste kotov in pari kotov | sokota, sovršna kota, kota z vzporednimi kraki",
        "Računanje s koti | stopinje in minute",
      ]],
      ["Trikotnik", [
        "Vrste trikotnikov in notranji koti | vsota notranjih kotov, zunanji koti",
        "Konstrukcije trikotnikov | izreki o skladnosti, načrtovanje iz podatkov",
        "Značilne točke trikotnika | višine, težiščnice, očrtana in včrtana krožnica",
        "Obseg in ploščina trikotnika | izračun in besedilne naloge",
      ]],
      ["Štirikotniki", [
        "Vrste štirikotnikov | paralelogram, romb, trapez, deltoid, lastnosti",
        "Konstrukcije štirikotnikov | načrtovanje iz podanih podatkov",
        "Obseg in ploščina štirikotnikov | paralelogram, trapez, romb, deltoid",
      ]],
      ["Obdelava podatkov", [
        "Aritmetična sredina | izračun in pomen",
        "Tortni prikaz | branje in risanje",
      ]],
    ],
  },
  "MAT-OS-8": {
    label: "Matematika, 8. razred",
    units: [
      ["Racionalna števila", [
        "Cela števila | številska premica, nasprotna števila, absolutna vrednost",
        "Računanje s celimi števili | seštevanje, odštevanje, množenje, deljenje",
        "Racionalna števila | urejanje in računanje, številski izrazi",
      ]],
      ["Potence", [
        "Potence z naravnimi eksponenti | zapis, računanje, pravila za množenje in deljenje",
        "Zapis z desetiškimi potencami | zelo velika in zelo majhna števila",
      ]],
      ["Kvadriranje in korenjenje", [
        "Kvadrat števila | kvadriranje, ocenjevanje",
        "Kvadratni koren | korenjenje, delni koreni, ocena brez računala",
        "Realna števila | iracionalna števila, številska premica",
      ]],
      ["Pitagorov izrek", [
        "Pitagorov izrek | izračun neznane stranice pravokotnega trikotnika",
        "Uporaba Pitagorovega izreka | diagonale, višine, besedilne naloge",
      ]],
      ["Izrazi", [
        "Algebrski izrazi | zapis, vrednost izraza, podobni členi",
        "Množenje izrazov | množenje vsote, dvočlenikov",
        "Razstavljanje | izpostavljanje skupnega faktorja",
      ]],
      ["Enačbe", [
        "Linearne enačbe | formalno reševanje, preizkus",
        "Besedilne naloge z enačbami | zapis enačbe iz besedila",
      ]],
      ["Krog in večkotniki", [
        "Obseg in ploščina kroga | število π, obrazca",
        "Krožni lok in krožni izsek | dolžina loka, ploščina izseka",
        "Večkotniki | notranji koti, diagonale, pravilni večkotniki",
      ]],
    ],
  },
  "MAT-OS-9": {
    label: "Matematika, 9. razred",
    units: [
      ["Linearna funkcija", [
        "Koordinatni sistem in odvisnost količin | branje in risanje grafov",
        "Linearna funkcija | predpis y = kx + n, smerni koeficient, začetna vrednost",
        "Graf linearne funkcije | risanje, ničla, presečišča z osema",
        "Premica v ravnini | vzporednost, enačba premice skozi točki",
      ]],
      ["Enačbe in neenačbe", [
        "Linearne enačbe z ulomki | odpravljanje ulomkov, preizkus",
        "Linearne neenačbe | reševanje in zapis rešitve na premici",
        "Besedilne naloge | zapis in reševanje enačbe",
      ]],
      ["Podobnost", [
        "Podobni trikotniki | razmerje podobnosti, izreki o podobnosti",
        "Talesov izrek | uporaba pri deljenju daljice in nalogah",
      ]],
      ["Geometrijska telesa", [
        "Točke, premice in ravnine v prostoru | opiše medsebojno lego točk, premic in ravnin v prostoru, pravokotnost premice na ravnino, razdalja točke od ravnine",
        "Prizma | mreža, površina, prostornina",
        "Valj | površina, prostornina, valj kot vrtenina",
        "Piramida | plašč, površina, prostornina, višine",
        "Stožec | površina, prostornina, stožec kot vrtenina",
        "Krogla | površina in prostornina",
      ]],
      ["Obdelava podatkov", [
        "Statistična raziskava | zbiranje, prikaz, srednje vrednosti (povprečje, mediana, modus)",
        "Verjetnost | poskus, dogodek, preprosta verjetnost",
      ]],
      ["Priprava na NPZ", [
        "Mešane naloge NPZ | ponovitev vseh sklopov OŠ",
      ]],
    ],
  },

  // ------------------------------------------------------------ OŠ FIZIKA
  "FIZ-OS-8": {
    label: "Fizika, 8. razred",
    units: [
      ["Uvod v fiziko", [
        "Fizikalne količine in enote | merjenje, mednarodni sistem enot, pretvarjanje",
        "Merske napake | večkratno merjenje, povprečje",
      ]],
      ["Svetloba", [
        "Širjenje svetlobe | svetila, premočrtno širjenje, senca",
        "Odboj svetlobe | odbojni zakon, ravno zrcalo",
        "Lom svetlobe | lom na meji snovi, leče (zbiralna, razpršilna)",
      ]],
      ["Pogled v vesolje", [
        "Nebo in Osončje | gibanje Zemlje in Lune, Lunine mene, mrki",
      ]],
      ["Sile", [
        "Sila in merjenje sile | vzmetna tehtnica, enota N",
        "Teža in masa | gravitacijska sila, g = 9,81 N/kg",
        "Sestavljanje sil in ravnovesje | rezultanta, ravnovesje dveh sil",
        "Trenje in upor | od česa sta odvisna",
      ]],
      ["Gostota, tlak, vzgon", [
        "Gostota | ρ = m/V, merjenje gostote",
        "Tlak | p = F/S, tlak v tekočinah, hidrostatični tlak",
        "Vzgon | plavanje in potapljanje teles",
      ]],
      ["Gibanje", [
        "Enakomerno gibanje | hitrost, pot, čas, graf s(t) in v(t)",
        "Pospešeno gibanje | pospešek, enakomerno pospešeno gibanje",
      ]],
    ],
  },
  "FIZ-OS-9": {
    label: "Fizika, 9. razred",
    units: [
      ["Sila in gibanje", [
        "Newtonovi zakoni | zakon o ravnovesju, F = m·a, zakon o vzajemnem učinku",
        "Prosti pad | pospešek g, padanje teles",
      ]],
      ["Delo in energija", [
        "Delo | A = F·s, enota J",
        "Kinetična in potencialna energija | izračun, pretvarjanje energije",
        "Moč in izkoristek | P = A/t",
      ]],
      ["Toplota", [
        "Temperatura in notranja energija | termometri, temperaturne lestvice",
        "Toplota | Q = m·c·ΔT, specifična toplota",
        "Prenos toplote | prevajanje, konvekcija, sevanje",
      ]],
      ["Elektrika", [
        "Električni naboj | elektrenje, sile med naboji",
        "Električni tok in napetost | merjenje, ampermeter, voltmeter",
        "Električni krog | zaporedna in vzporedna vezava",
        "Upor in Ohmov zakon | U = R·I",
        "Električno delo in moč | P = U·I, poraba energije doma",
      ]],
      ["Magnetizem", [
        "Magneti in magnetno polje | Zemljino magnetno polje, kompas",
        "Elektromagnet | magnetno polje tuljave",
      ]],
      ["Fizika in okolje", [
        "Fizika v sodobnih napravah | z znanjem fizike razloži delovanje izbrane sodobne naprave (GPS, laser, sončna celica, jedrska elektrarna)",
      ]],
    ],
  },

  // ------------------------------------------------------------ OŠ KEMIJA
  // ------------------------------------------------------------ OŠ NARAVOSLOVJE
  // Predmetnik OŠ: v 6. in 7. razredu je naravoslovje, fizika in kemija pa od 8. razreda.
  // Razporeditev po učnem načrtu za naravoslovje (ZRSŠ); OSNUTEK, naj preveri učitelj.
  // »=> POT/tema«: tema vzame naloge (in lekcijo) iz osnovne teme fizike ali kemije.
  "NAR-OS-6": {
    label: "Naravoslovje, 6. razred",
    units: [
      ["Raziskovanje v naravoslovju", [
        "Naravoslovni postopki | opazovanje, merjenje, poskus, zapis in prikaz rezultatov",
        "Merjenje | dolžina, masa, prostornina, temperatura, enote in pretvarjanje => FIZ-OS-8/fizikalne-kolicine-in-enote",
        "Mikroskop in celica | delo z mikroskopom, rastlinska celica, celica kot osnovna enota živega",
      ]],
      ["Snovi", [
        "Lastnosti snovi | barva, vonj, trdota, gostota, topnost, prevodnost, prepoznavanje snovi => KEM-OS-8/snovi-in-njihove-lastnosti",
        "Agregatna stanja | trdno, tekoče, plinasto; taljenje, strjevanje, izparevanje, kondenzacija",
        "Zmesi in čiste snovi | homogene in heterogene zmesi, raztopine",
        "Ločevanje zmesi | sejanje, dekantiranje, filtriranje, izparevanje, destilacija, kromatografija",
      ]],
      ["Energija", [
        "Oblike energije | energija in pretvorbe, Sonce kot vir energije, obnovljivi in neobnovljivi viri",
        "Toplota in temperatura | merjenje temperature, segrevanje in ohlajanje snovi",
        "Prenos toplote | prevajanje, konvekcija, sevanje; toplotni prevodniki in izolatorji => FIZ-OS-9/prenos-toplote",
      ]],
      ["Rastline", [
        "Zgradba rastline | korenina, steblo, list, cvet in njihove naloge",
        "Fotosinteza in celično dihanje | kaj rastlina potrebuje za rast, nastanek kisika in hrane",
        "Prevajanje vode in snovi | vsrkavanje vode, transpiracija, listne reže",
        "Razmnoževanje rastlin | opraševanje, oploditev, plodovi in semena, nespolno razmnoževanje",
        "Razvrščanje rastlin | mahovi, praprotnice, semenke; določevalni ključ",
      ]],
      ["Organizmi in okolje", [
        "Raznolikost organizmov | značilnosti živih bitij, kraljestva, glive in mikroorganizmi",
        "Rastline in okolje | prilagoditve rastlin na okolje, pomen rastlin za druge organizme",
      ]],
    ],
  },
  "NAR-OS-7": {
    label: "Naravoslovje, 7. razred",
    units: [
      ["Snovi", [
        "Zgradba snovi | snovi so iz delcev, gibanje delcev, difuzija",
        "Elementi in spojine | čiste snovi, kemijski simboli pogostih elementov",
        "Raztopine | topilo, topljenec, topnost, nasičena raztopina, masni delež => KEM-OS-9/raztopine",
        "Kisle in bazične raztopine | indikatorji, pH lestvica, kisline in baze v vsakdanjem življenju => KEM-OS-8/ph-lestvica",
        "Fizikalne in kemijske spremembe | gorenje, rjavenje, nastanek novih snovi",
      ]],
      ["Živali", [
        "Zgradba in delovanje živali | celice, tkiva, organi, organski sistemi",
        "Prehranjevanje in prebava | načini prehranjevanja, prebavila",
        "Dihanje in krvni obtok | izmenjava plinov, škrge in pljuča, kri",
        "Gibanje in opora | okostje, mišice, gibanje v vodi, na kopnem in v zraku",
        "Čutila in živčevje | odziv na dražljaje, čutila",
        "Razmnoževanje in razvoj | spolno razmnoževanje, razvoj s preobrazbo in brez nje",
        "Razvrščanje živali | nevretenčarji in vretenčarji, določevalni ključ",
      ]],
      ["Ekosistemi", [
        "Ekosistem | živi in neživi dejavniki, življenjski prostor in združba",
        "Prehranjevalne verige in spleti | proizvajalci, porabniki, razkrojevalci",
        "Kroženje snovi in pretok energije | kroženje vode in ogljika, energija v ekosistemu",
        "Kopenski in vodni ekosistemi | gozd, travnik, ribnik, morje; prilagoditve organizmov",
        "Človek in okolje | onesnaževanje, varovanje narave in biotske raznovrstnosti",
      ]],
    ],
  },

  "KEM-OS-8": {
    label: "Kemija, 8. razred",
    units: [
      ["Kemija je svet snovi", [
        "Varno delo v laboratoriju | znaki za nevarnost, pravila",
        "Snovi in njihove lastnosti | čiste snovi in zmesi, ločevanje zmesi",
      ]],
      ["Zgradba atoma in periodni sistem", [
        "Zgradba atoma | protoni, nevtroni, elektroni, vrstno in masno število",
        "Periodni sistem | skupine, periode, kovine in nekovine",
        "Razporeditev elektronov | lupine, zunanji elektroni",
      ]],
      ["Povezovanje delcev", [
        "Ionska vez | nastanek ionov, ionske spojine",
        "Kovalentna vez | molekule, Lewisove formule",
        "Formule spojin | zapis in poimenovanje preprostih spojin",
      ]],
      ["Kemijske reakcije", [
        "Kemijska reakcija | reaktanti, produkti, zakon o ohranitvi mase",
        "Urejanje kemijskih enačb | koeficienti",
        "Energija pri reakcijah | eksotermne in endotermne reakcije",
      ]],
      ["Elementi v periodnem sistemu", [
        "Kovine | lastnosti, alkalijske in zemeljskoalkalijske kovine",
        "Nekovine | halogeni, žlahtni plini",
      ]],
      ["Kisline, baze, soli", [
        "Kisline in baze | lastnosti, indikatorji",
        "pH lestvica | merjenje in pomen",
        "Nevtralizacija in soli | nastanek soli",
      ]],
    ],
  },
  "KEM-OS-9": {
    label: "Kemija, 9. razred",
    units: [
      ["Množina snovi in raztopine", [
        "Množina snovi | mol, molska masa, n = m/M",
        "Računanje z množino snovi | masa, množina, število delcev",
        "Raztopine | masni delež, masna koncentracija",
      ]],
      ["Ogljikovodiki", [
        "Ogljik in organske spojine | zgradba, vezi, formule",
        "Alkani, alkeni, alkini | poimenovanje, lastnosti, izomerija",
        "Nafta in zemeljski plin | goriva, gorenje",
      ]],
      ["Kisikove organske spojine", [
        "Alkoholi | etanol, lastnosti, vpliv na zdravje",
        "Karboksilne kisline in estri | ocetna kislina, estri",
      ]],
      ["Dušikove organske spojine", [
        "Amini in aminokisline | zgradba in pomen",
      ]],
      ["Biološko pomembne spojine", [
        "Ogljikovi hidrati | glukoza, škrob, celuloza",
        "Maščobe | zgradba in pomen",
        "Beljakovine | zgradba in pomen",
      ]],
      ["Polimeri", [
        "Polimeri | naravni in sintetični, plastika in okolje",
      ]],
    ],
  },

  // ------------------------------------------------------------ OŠ BIOLOGIJA
  // Po UN Biologija za OŠ (8. razred 52 ur, 9. razred 64 ur); sklopi A–N.
  "BIO-OS-8": {
    label: "Biologija, 8. razred",
    units: [
      ["Biologija kot veda", [
        "Biologija in raziskovanje | kaj preučuje biologija, ravni organizacije od celice do biosfere, raziskovalno vprašanje, poskus in kontrolna skupina",
      ]],
      ["Celica in dedovanje", [
        "Celica pod mikroskopom | mikroskopiranje, deli celice pod svetlobnim mikroskopom, celice človeka, rastlin, gliv in bakterij",
        "Celični organeli | jedro, celična membrana, kloroplast, mitohondrij, izmenjava snovi skozi membrano, enotna zgradba celic",
        "DNA in dedna informacija | DNA v jedru, zapis z zaporedjem nukleotidov, enak zapis pri vseh organizmih, geni očeta in matere",
        "Celična delitev | rast celice, podvojitev DNA, mitoza, razvoj iz oplojene jajčne celice, rast tkiv",
      ]],
      ["Zgradba in delovanje človeka", [
        "Od celice do organizma | specializacija celic, tkiva, organi, organski sistemi, osnovne življenjske funkcije",
        "Bolezni in zdravje | okužbe z bakterijami, virusi in zajedavci, poškodbe, dedne bolezni, obramba telesa, skrb za zdravje",
        "Prebavila in prehrana | deli prebavne cevi, prebavni sokovi in encimi, jetra, trebušna slinavka, vsrkavanje, uravnotežena prehrana",
        "Dihala | pljučno in celično dihanje, vdih in izdih, izmenjava plinov v pljučih, bolezni dihal, kajenje, prva pomoč",
        "Kri in krvožilje | naloge krvi, krvne celice, žile, srce, telesni in pljučni krvni obtok, limfa, krvne skupine, cepljenje",
        "Izločala | ledvice, nastanek seča, vzdrževanje notranjega okolja, dializa",
        "Živčevje in hormoni | živčna celica, osrednje in obkrajno živčevje, refleks, žleze z notranjim izločanjem, hipofiza",
        "Čutila | oko in vid, napake vida, uho, sluh in ravnotežje, okus in voh",
        "Okostje in mišice | kosti in sklepi, hrbtenica in drža, vrste mišičnih celic, antagonistične mišice, pomen gibanja",
        "Koža | zgradba in naloge kože, uravnavanje telesne temperature, čutila v koži, UV-sevanje in opekline",
        "Razmnoževanje človeka | spolni organi, spolne celice in mejoza, menstrualni ciklus, oploditev, nosečnost, puberteta, spolno prenosljive bolezni",
      ]],
    ],
  },
  "BIO-OS-9": {
    label: "Biologija, 9. razred",
    units: [
      ["Biologija in raziskovanje", [
        "Biologija in družba | biologija kot temelj medicine, kmetijstva in biotehnologije, temeljna in uporabna znanost",
        "Načrtovanje poskusa | raziskovalno vprašanje, spremenljivke in kontrolirani pogoji, ponovljivost, graf, linearna in nelinearna odvisnost",
      ]],
      ["Kemija živih sistemov", [
        "Snovi v živih bitjih | ogljik, elementi C, H, O, N, P, S, voda in soli, ogljikovi hidrati, maščobe, beljakovine, DNA, reakcije v organizmih",
      ]],
      ["Dedovanje", [
        "Kromosomi in geni | kromosom iz DNA in beljakovin, gen kot odsek DNA, podvojevanje DNA, mitoza in mejoza, odkritje zgradbe DNA",
        "Dedovanje lastnosti | alela, dominantno in recesivno, homozigot in heterozigot, genotip in fenotip, križanje, vpliv okolja",
        "Dedovanje pri človeku | lastnosti enega in več genov, barvna slepota, hemofilija, rodovnik, kromosomske analize, Downov sindrom",
      ]],
      ["Biotehnologija", [
        "Biotehnologija | kvasovke in mikroorganizmi, gensko spremenjeni organizmi, kloniranje, izvorne celice, etična vprašanja",
      ]],
      ["Evolucija", [
        "Naravni izbor | genetska variabilnost, mutacije, naravni izbor, prilagoditve, odpornost na antibiotike, geografska izolacija",
        "Zgodovina življenja | starost Zemlje, fosili, nastanek življenja, cianobakterije in kisik, množična izumrtja, izvor človeka",
      ]],
      ["Razvrščanje organizmov", [
        "Sistematika | vrsta, rod, družina, red, razred, deblo, dvodelno latinsko ime, Linné, evolucijsko drevo",
      ]],
      ["Biotska pestrost, biomi in biosfera", [
        "Biotska pestrost | genska, vrstna in ekosistemska pestrost, preproste metode ugotavljanja, biotska pestrost Slovenije",
        "Ekosistemi in biomi | zgradba in delovanje ekosistema, sukcesija, biomi, biosfera, vpliv organizmov na planet",
      ]],
      ["Vpliv človeka na naravo in okolje", [
        "Človek in okolje | varstvo narave in okolja, ogrožene vrste, onesnaževanje, ozonska luknja, globalno segrevanje, trajnostni razvoj",
      ]],
    ],
  },

  // ------------------------------------------------------------ GIMNAZIJA MATEMATIKA
  "MAT-SS-1": {
    label: "Matematika, 1. letnik",
    units: [
      ["Množice in števila", [
        "Osnove logike | izjave in logične povezave (negacija, konjunkcija, disjunkcija, implikacija, ekvivalenca), pravilnostne tabele, tavtologija, enakovredne izjave",
        "Množice | operacije z množicami, Vennov diagram",
        "Naravna in cela števila | deljivost, praštevila, D in v",
        "Racionalna števila | ulomki, decimalni zapis, urejenost",
        "Realna števila in intervali | absolutna vrednost, intervali",
      ]],
      ["Izrazi", [
        "Potence z naravnimi in celimi eksponenti | pravila za računanje",
        "Algebrski izrazi | množenje, kvadrat in kub dvočlenika",
        "Razstavljanje izrazov | izpostavljanje, razlika kvadratov, Vietovo pravilo",
        "Ulomljeni izrazi | krajšanje, seštevanje, množenje",
      ]],
      ["Linearna funkcija, enačbe in neenačbe", [
        "Linearna funkcija | graf, smerni koeficient, ničla",
        "Linearne enačbe | tudi z ulomki in parametrom",
        "Linearne neenačbe | rešitve kot intervali",
        "Sistemi linearnih enačb | zamenjalni in nasprotni koeficienti, grafično",
      ]],
      ["Geometrija v ravnini", [
        "Osnovni geometrijski pojmi | premice, koti, vzporednost",
        "Trikotnik | skladnost, značilne točke",
        "Štirikotniki in krog | lastnosti, ploščine",
        "Pravokotni koordinatni sistem v ravnini | razdalja med točkama, razpolovišče daljice, ploščina trikotnika z oglišči v koordinatah",
      ]],
      ["Statistika", [
        "Obdelava podatkov | srednje vrednosti, mere razpršenosti, prikazi",
      ]],
    ],
  },
  "MAT-SS-2": {
    label: "Matematika, 2. letnik",
    units: [
      ["Potence in koreni", [
        "Koreni | pravila za računanje, delno korenjenje, racionalizacija",
        "Potence z racionalnimi eksponenti | zveza s koreni",
      ]],
      ["Kompleksna števila", [
        "Kompleksna števila | računanje, konjugirano število, absolutna vrednost",
      ]],
      ["Funkcije", [
        "Funkcije in njihove lastnosti | definicijsko območje, zaloga vrednosti, ničle, naraščanje in padanje, sodost in lihost, injektivnost, sestavljena in inverzna funkcija",
        "Transformacije grafov | vzporedni premik, zrcaljenje čez osi in raztezanje grafa funkcije",
        "Potenčna in korenska funkcija | grafi in lastnosti potenčnih funkcij s celim eksponentom, korenska funkcija kot inverzna funkcija, modeliranje",
      ]],
      ["Kvadratna funkcija", [
        "Kvadratna funkcija | oblike zapisa, teme, ničle, graf",
        "Kvadratna enačba | diskriminanta, Vietove formule",
        "Kvadratna neenačba | reševanje z grafom",
      ]],
      ["Eksponentna in logaritemska funkcija", [
        "Eksponentna funkcija | graf, lastnosti",
        "Eksponentne enačbe | enačenje osnov, uvedba nove spremenljivke",
        "Logaritem | pravila za računanje, prehod na novo osnovo",
        "Logaritemska funkcija in enačbe | graf, definicijsko območje",
      ]],
      ["Podobnost in kotne funkcije", [
        "Podobnost | podobni trikotniki, Evklidov in višinski izrek",
        "Kotne funkcije v pravokotnem trikotniku | sin, cos, tan, uporaba",
      ]],
    ],
  },
  "MAT-SS-3": {
    label: "Matematika, 3. letnik",
    units: [
      ["Kotne funkcije", [
        "Kotne funkcije poljubnega kota | enotska krožnica, radiani",
        "Grafi kotnih funkcij | perioda, amplituda, premiki",
        "Adicijski izreki | dvojni koti, preoblikovanje izrazov",
        "Trigonometrijske enačbe | splošne rešitve",
        "Sinusni in kosinusni izrek | reševanje poljubnega trikotnika",
      ]],
      ["Vektorji", [
        "Vektorji v ravnini in prostoru | seštevanje, množenje s skalarjem",
        "Skalarni produkt | kot med vektorjema, pravokotnost",
      ]],
      ["Polinomi in racionalne funkcije", [
        "Polinomi | deljenje, Hornerjev algoritem, ničle",
        "Graf polinoma | ničle in njihova stopnja, obnašanje v neskončnosti",
        "Racionalne funkcije | poli, asimptote, graf",
      ]],
      ["Stožnice", [
        "Krožnica | enačba, lega premice in krožnice",
        "Elipsa, hiperbola, parabola | enačbe in grafi",
      ]],
      ["Geometrijska telesa", [
        "Površina in prostornina teles | prizma, piramida, valj, stožec, krogla",
      ]],
    ],
  },
  "MAT-SS-4": {
    label: "Matematika, 4. letnik",
    units: [
      ["Zaporedja in vrste", [
        "Matematična indukcija | dokaže trditev za vsa naravna števila s popolno indukcijo (vsote, deljivost, neenakosti)",
        "Zaporedja | lastnosti, limita zaporedja",
        "Aritmetično in geometrijsko zaporedje | splošni člen, vsota",
        "Geometrijska vrsta | konvergenca, vsota",
        "Obrestni račun | navadno in obrestno obrestovanje",
      ]],
      ["Odvod", [
        "Limita in zveznost funkcije | računanje limit",
        "Odvod | definicija, pravila odvajanja",
        "Uporaba odvoda | tangenta, naraščanje, ekstremi, ekstremalni problemi",
      ]],
      ["Integral", [
        "Nedoločeni integral | osnovni integrali, uvedba nove spremenljivke",
        "Določeni integral | ploščina, prostornina vrtenine",
      ]],
      ["Kombinatorika in verjetnost", [
        "Kombinatorika | permutacije, variacije, kombinacije",
        "Verjetnost | dogodki, verjetnost vsote in produkta, pogojna verjetnost",
        "Statistika | normalna porazdelitev (VR), obdelava podatkov",
      ]],
      ["Priprava na maturo", [
        "Mešane maturitetne naloge | ponovitev vseh letnikov",
      ]],
    ],
  },

  // ------------------------------------------------------------ GIMNAZIJA FIZIKA
  "FIZ-SS-1": {
    label: "Fizika, 1. letnik",
    units: [
      ["Merjenje", [
        "Fizikalne količine in enote | SI, predpone, pretvarjanje",
        "Merske napake | absolutna in relativna napaka, zapis rezultata",
      ]],
      ["Kinematika", [
        "Premo enakomerno gibanje | grafi s(t), v(t)",
        "Enakomerno pospešeno gibanje | enačbe gibanja, grafi",
        "Prosti pad in navpični met | gibanje v gravitacijskem polju",
        "Vektorji v kinematiki | sestavljanje hitrosti, vodoravni met",
      ]],
      ["Dinamika", [
        "Sile | vrste sil, sestavljanje in razstavljanje",
        "Prožnost | Hookov zakon, prožnostni koeficient, zaporedna in vzporedna vezava vzmeti",
        "Newtonovi zakoni | uporaba pri gibanju teles",
        "Navor in ravnovesje | navor sile, ročica, ravnovesje togega telesa, težišče, vzvod",
        "Trenje | lepenje, drsenje, klanec",
        "Gibalna količina | izrek o gibalni količini, trki",
      ]],
      ["Delo in energija", [
        "Delo in moč | delo sile, moč",
        "Energija | kinetična, potencialna, prožnostna, ohranitev energije",
      ]],
      ["Tekočine", [
        "Tlak in vzgon | hidrostatični tlak, Arhimedov zakon",
      ]],
    ],
  },
  "FIZ-SS-2": {
    label: "Fizika, 2. letnik",
    units: [
      ["Kroženje in gravitacija", [
        "Enakomerno kroženje | obodna hitrost, centripetalni pospešek",
        "Gravitacijski zakon | gibanje planetov in satelitov",
      ]],
      ["Toplota", [
        "Temperatura in raztezanje | linearni in prostorninski razteznostni koeficient",
        "Plinska enačba | idealni plin, plinski zakoni",
        "Notranja energija in toplota | specifična toplota, fazni prehodi",
        "Prevajanje toplote in sevanje | toplotni tok, toplotna prevodnost, Stefanov zakon sevanja",
        "Termodinamika | prvi zakon, toplotni stroji, izkoristek",
      ]],
      ["Elektrika", [
        "Električni naboj in Coulombov zakon | sila med naboji",
        "Električno polje | jakost polja, napetost, kondenzator",
        "Električni tok | tok, upor, Ohmov zakon",
        "Električna vezja | Kirchhoffova zakona, zaporedna in vzporedna vezava, moč",
      ]],
    ],
  },
  "FIZ-SS-3": {
    label: "Fizika, 3. letnik",
    units: [
      ["Magnetizem", [
        "Magnetno polje | gostota magnetnega polja, polje tokovodnika",
        "Magnetna sila | sila na tokovodnik in na naboj",
        "Indukcija | inducirana napetost, Lenzovo pravilo, transformator",
        "Izmenični tok in nihajni krog | sinusna napetost, efektivna vrednost, električni nihajni krog, lastna frekvenca",
      ]],
      ["Nihanje in valovanje", [
        "Nihanje | nihalo na vzmeti, matematično nihalo, energija",
        "Valovanje | valovna dolžina, frekvenca, hitrost, interferenca",
        "Zvok | jakost, Dopplerjev pojav",
      ]],
      ["Optika", [
        "Elektromagnetno valovanje | nastanek, spekter, hitrost svetlobe, c = λν",
        "Geometrijska optika | odboj, lom, popolni odboj, leče",
        "Valovna optika | uklon, interferenca, polarizacija",
      ]],
    ],
  },
  "FIZ-SS-4": {
    label: "Fizika, 4. letnik",
    units: [
      ["Moderna fizika", [
        "Fotoefekt in foton | energija fotona, izstopno delo",
        "Atom | energijski nivoji, spektri",
        "Jedro in radioaktivnost | razpadi, razpolovni čas, jedrska energija",
      ]],
      ["Astronomija", [
        "Osončje in gibanje planetov | telesa v Osončju, Keplerjevi zakoni, gravitacija in kroženje planetov",
        "Zvezde in vesolje | izsev, Stefanov in Wienov zakon, temperatura zvezd, fuzija v zvezdah, razdalje v vesolju",
      ]],
      ["Priprava na maturo", [
        "Mešane maturitetne naloge | ponovitev vseh letnikov",
      ]],
    ],
  },

  // ------------------------------------------------------------ GIMNAZIJA KEMIJA
  "KEM-SS-1": {
    label: "Kemija, 1. letnik",
    units: [
      ["Zgradba snovi", [
        "Zgradba atoma | izotopi, elektronska konfiguracija",
        "Periodni sistem | periodične lastnosti, elektronegativnost",
        "Kemijske vezi | ionska, kovalentna, kovinska, polarnost",
        "Medmolekulske sile | vodikova vez, vpliv na lastnosti",
      ]],
      ["Kemijsko računanje", [
        "Množina snovi | mol, molska masa, Avogadrova konstanta",
        "Stehiometrija | računanje iz kemijskih enačb, prebitni reaktant",
        "Plini | molska prostornina, plinska enačba",
        "Raztopine | masni delež, množinska koncentracija, redčenje",
      ]],
      ["Kemijske reakcije", [
        "Urejanje enačb | vrste reakcij",
        "Energija pri reakcijah | entalpija, eksotermne in endotermne reakcije",
      ]],
    ],
  },
  "KEM-SS-2": {
    label: "Kemija, 2. letnik",
    units: [
      ["Hitrost in ravnotežje", [
        "Hitrost reakcij | dejavniki, katalizatorji",
        "Kemijsko ravnotežje | konstanta ravnotežja, Le Chatelierjevo načelo",
      ]],
      ["Kisline in baze", [
        "Kisline in baze | Brønsted-Lowryjeva teorija, konjugirani pari",
        "pH | računanje pH močnih kislin in baz",
        "Šibke kisline in baze | konstanta kislosti, pufri",
        "Titracija | nevtralizacija, računanje",
      ]],
      ["Redoks in elektrokemija", [
        "Oksidacijska števila | določanje",
        "Redoks reakcije | urejanje s polreakcijami",
        "Galvanski členi in elektroliza | standardni potencial",
      ]],
      ["Elementi v periodnem sistemu", [
        "Lastnosti elementov v periodnem sistemu | kovine, nekovine in polkovine, trendi lastnosti, kislost in bazičnost oksidov",
        "Alkalijske kovine in halogeni | reakcije z vodo in kisikom, halogenidi, izpodrivanje halogenov",
        "Elementi v bioloških sistemih | biogeni elementi (C, H, O, N, P, S, Ca, Fe) in njihove spojine v živih bitjih",
      ]],
    ],
  },
  "KEM-SS-3": {
    label: "Kemija, 3. letnik",
    units: [
      ["Organska kemija", [
        "Ogljikovodiki | alkani, alkeni, alkini, areni, poimenovanje",
        "Izomerija | strukturna in stereoizomerija",
        "Halogenoalkani in alkoholi | lastnosti, reakcije",
        "Karbonilne spojine | aldehidi in ketoni",
        "Karboksilne kisline in derivati | estri, amidi",
        "Dušikove organske spojine | amini, amidi, aminokisline, bazičnost aminov",
        "Organske reakcije | adicija, substitucija, eliminacija",
      ]],
      ["Biološko pomembne spojine", [
        "Ogljikovi hidrati, lipidi, beljakovine | zgradba in lastnosti",
        "Polimeri | polimerizacija, polikondenzacija",
      ]],
    ],
  },
  "KEM-SS-4": {
    label: "Kemija, 4. letnik",
    units: [
      ["Priprava na maturo", [
        "Splošna in anorganska kemija | ponovitev",
        "Organska kemija | ponovitev",
        "Kemijsko računanje | mešane računske naloge",
      ]],
    ],
  },
  // ------------------------------------------------------------ GIMNAZIJA BIOLOGIJA
  // Po UN Biologija za gimnazijo: obvezni program 210 ur (70 ur na letnik) po priporočeni vertikali
  // od celice do biosfere (A, C, D → E, F → F, G), v 4. letniku maturitetni program (L–O) in izbirni sklopi (H–K).
  // Šola lahko vrstni red sklopov prilagodi.
  "BIO-SS-1": {
    label: "Biologija, 1. letnik",
    units: [
      ["Življenje na Zemlji", [
        "Značilnosti življenja | ravni organizacije od molekule do biosfere, enotnost in raznolikost živega, zgradba, delovanje in evolucija",
        "Raziskovanje v biologiji | raziskovalno vprašanje in hipoteza, poskus s kontrolo, odvisna in neodvisna spremenljivka, prikaz podatkov, modeli",
      ]],
      ["Zgradba in delovanje celice", [
        "Snovi v celici | voda, anorganske snovi, ogljikovi hidrati, lipidi in fosfolipidi, aminokisline in beljakovine, makromolekule iz gradnikov",
        "Biotska membrana | zgradba membrane, izbirna prepustnost, difuzija, osmoza, aktivni transport, velikost celice",
        "Prokariontska in evkariontska celica | bakterijska, rastlinska, živalska in glivna celica, organeli in njihove naloge, endosimbioza, virusi",
        "Encimi in ATP | presnova, encimi, aktivno mesto, model ključ in ključavnica, vpliv temperature in pH, ATP kot prenašalec energije",
        "Celično dihanje in vrenje | glikoliza, aerobno dihanje v mitohondriju, mlečnokislinsko in alkoholno vrenje, nastanek ATP",
        "Fotosinteza | fotosintezna barvila, pretvorba svetlobne energije, vezava CO2, kisik iz vode, kloroplast",
        "Od DNA do beljakovine | zgradba DNA in RNA, podvojevanje DNA, genetski kod, prepis in prevod, uravnavanje izražanja genov",
        "Celični cikel in mitoza | spremembe kromosomov v celičnem ciklu, faze mitoze, diferenciacija, delitev rakavih celic",
      ]],
      ["Geni in dedovanje", [
        "Geni, aleli in mutacije | gen in alel, homozigot in heterozigot, genske, kromosomske in genomske mutacije, mutageni, genotip, fenotip in okolje",
        "Mejoza in spolno razmnoževanje | potek mejoze, haploidno in diploidno stanje, prekrižanje, oploditev, primerjava z mitozo, kloniranje",
        "Mendlovo dedovanje | monohibridno in dihibridno križanje, Punnettov kvadrat, deleži genotipov in fenotipov, nepopolna dominanca",
        "Genska tehnologija | umetni izbor, genski inženiring, prenos genov, gensko spremenjeni organizmi, koristi in tveganja",
      ]],
    ],
  },
  "BIO-SS-2": {
    label: "Biologija, 2. letnik",
    units: [
      ["Evolucija", [
        "Nastanek in razvoj življenja | nastanek Zemlje, kemijska evolucija, prvi organizmi, fotosinteza in kisik, endosimbiontska teorija, prehod na kopno",
        "Mehanizmi evolucije | variabilnost, mutacije in rekombinacije, naravni izbor deluje na fenotip, genski sklad, migracije, umetni izbor, odpornost",
        "Nastanek vrst | definicija vrste, reproduktivna izolacija, speciacija, izumrtje, adaptacije",
        "Dokazi evolucije | fosili, homologija in analogija, konvergenca in divergenca, embriologija, biogeografija, molekulski dokazi, evolucija človeka",
        "Sistem organizmov | vrsta, dvodelno ime, sistematske kategorije, arheje, bakterije in evkarionti, glavne skupine rastlin in živali",
      ]],
      ["Temeljne lastnosti organizmov", [
        "Življenjski problemi organizmov | ločenost od okolja, energija, notranje okolje, enoceličnost in večceličnost, diferenciacija, negativna povratna zanka",
      ]],
      ["Bakterije in glive", [
        "Bakterije | bakterijska celica, nespolno razmnoževanje, presnovna raznolikost, vezava dušika, pomen v ekosistemih in za človeka, antibiotiki",
        "Glive | glivna celica, kvasovke, plesni in gobe, razkrojevalci, zajedavci, lišaji in mikoriza, pomen za človeka",
      ]],
      ["Rastline", [
        "Zgradba rastline | rastlinska celica, tkiva, korenina, steblo in list, zgradba in naloge organov",
        "Prehrana in transport pri rastlinah | fotosinteza in dihanje v rastlini, mineralne snovi, listne reže, transpiracija, prevajanje vode in organskih snovi",
        "Rast in razmnoževanje rastlin | rastni vršički, sekundarna rast in les, cvet, opraševanje, seme in kalitev, razširjanje semen, vegetativno razmnoževanje",
        "Odzivi rastlin na okolje | rastlinski hormoni, odzivi na svetlobo in patogene, preživetje neugodnih razmer, odnosi z drugimi organizmi",
      ]],
      ["Človek in živali: snovi in energija", [
        "Prehrana in prebava | potrebne snovi, prebavna cev in žleze, uravnotežena prehrana, motnje hranjenja, prebava pri drugih živalih",
        "Dihanje | ventilacija, izmenjava plinov z difuzijo, pljučni mehurčki, bolezni dihal, škrge in vzdušnice",
        "Kri in obtočila | sestava krvi, srce in žile, krvni obtok, bolezni srca in ožilja, transport pri drugih živalih",
        "Izločala | dušikove spojine, ledvice in nefron, osmoregulacija, amonijak, sečnina in sečna kislina",
      ]],
    ],
  },
  "BIO-SS-3": {
    label: "Biologija, 3. letnik",
    units: [
      ["Uravnavanje delovanja organizma", [
        "Hormonski sistem | hormoni in tarčne celice, receptorji, ščitnica, trebušna slinavka in inzulin, endokrine bolezni",
        "Živčna celica in sinapsa | zgradba nevrona, mirovni potencial, akcijski potencial, mielin, kemična sinapsa, psihoaktivne snovi",
        "Živčevje in vedenje | osrednje in obkrajno živčevje, hrbtenjača in refleks, deli možganov, živčevje pri živalih, vedenje",
        "Čutila | dražljaji in receptorji, oko in uho, zaznavanje v možganih, čutila drugih živali, evolucija očesa",
      ]],
      ["Zaščita, opora in gibanje", [
        "Koža in krovne strukture | zgradba in naloge kože, primerjava z drugimi živalmi, škodljivost UV-sevanja",
        "Opora in gibanje | zunanje, notranje in hidrostatsko ogrodje, kost, hrustanec in kite, skeletna mišica, aktin in miozin",
        "Imunski sistem | pregrade, nespecifična in specifična obramba, protitelesa, aktivna in pasivna imunizacija, alergije, avtoimunske bolezni, AIDS",
      ]],
      ["Razmnoževanje in razvoj", [
        "Razmnoževanje živali in človeka | nespolno in spolno razmnoževanje, spolni organi, hormonsko uravnavanje, nastanek spolnih celic, oploditev, kontracepcija",
        "Razvoj živali in človeka | ontogeneza, diferenciacija, razvoj zarodka, ličinke in preobrazba, rast, puberteta in staranje",
      ]],
      ["Ekologija", [
        "Ekologija in ekosistem | populacija, združba, biotop, habitat, ekološka niša, biom, biosfera, ekologija in varstvo okolja",
        "Ekološki dejavniki in niša | abiotski dejavniki, krivulja strpnosti, generalisti in specialisti, prilagoditve",
        "Populacije | rodnost, smrtnost, priseljevanje in odseljevanje, gostota, starostna sestava, rast in nihanje populacije",
        "Odnosi med vrstami | plenilstvo, tekmovanje, zajedavstvo, mutualizem in simbioza, ločevanje niš",
        "Pretok energije in kroženje snovi | primarna proizvodnja, prehranjevalni splet, trofične ravni, energijska piramida, kroženje ogljika in vode",
        "Sukcesija in biotska pestrost | razvoj ekosistema, klimaksna združba, genska, vrstna in ekosistemska pestrost, ključne vrste",
        "Človek in ekosistemi | naravni viri, onesnaževanje, invazivne vrste, izumiranje, rdeči seznam, zavarovana območja, Natura 2000",
      ]],
    ],
  },
  "BIO-SS-4": {
    label: "Biologija, 4. letnik (matura)",
    units: [
      ["Kako deluje znanost", [
        "Znanstvena metoda | spreminjanje znanstvenih razlag, recenzija in objava, opazovanje in poskus, kvalitativni in kvantitativni podatki, verodostojnost virov",
        "Statistika v biologiji | povprečje, standardni odklon, standardna napaka, korelacija, t-test, hi-kvadrat test",
      ]],
      ["Biologija celice", [
        "Beljakovine in celični signali | zgradba in oblika beljakovin, fosforilacija in kinaze, receptorji, G-beljakovina in cAMP, kalcij kot sekundarni prenašalec",
        "Energetika celice | mitohondrij in kloroplast, prenos elektronov, protonski gradient, ATP-sintaza, absorpcijski spekter, omejujoči dejavniki fotosinteze, C3 in CAM",
        "Endocitoza in eksocitoza | endomembranski sistem, endoplazemski retikel, Golgijev aparat, lizosomi, vezikli, izločanje",
        "Molekularna genetika | podvojevalne vilice, tipi RNA, univerzalni genetski kod, mutacije in beljakovine, operon, uravnavanje genov pri evkariontih",
      ]],
      ["Fiziologija človeka", [
        "Mišice med naporom | aktin, miozin, Ca2+ in ATP, anaerobni metabolizem, srčni utrip in dihanje med naporom",
        "Homeostaza | receptor, center in efektor, negativna povratna zanka, antagonistično uravnavanje, telesna temperatura, voda v telesu",
        "Imunost in krvne skupine | patogeni, celice imunskega sistema, sistem ABO, kodominanca, Rh, transfuzija in presaditve",
        "Geni in razvoj človeka | določanje spola, diferenciacija, rak, zarodne celice, kloni, genska diagnostika",
      ]],
      ["Ekologija, biotska pestrost in evolucija", [
        "Nastanek življenja | abiogeni nastanek organskih snovi, poskus Millerja in Ureyja, svet RNA, membrane in prve celice",
        "Populacijska genetika | Hardy-Weinbergovo ravnovesje, pogostost alelov in genotipov, evolucijski dejavniki, akomodacija in adaptacija",
        "Speciacija in filogenija | geografska in ekološka izolacija, predoploditvene in poporoditvene pregrade, kladogram, molekulska ura, tri domene",
        "Evolucija človeka | skupni prednik, hominidi, razvoj možganov, kulturna evolucija, umetni izbor, vpliv sodobnega načina življenja",
      ]],
      ["Izbirni sklopi", [
        "Biotehnologija in mikrobiologija | arheje, bakterije, praživali, virusi, presnova mikroorganizmov, mikroorganizmi v ekosistemu, biotehnološka uporaba",
        "Biološke osnove zdravega življenja | uravnotežena prehrana, esencialne snovi, vitamini, maščobe in holesterol, telesna dejavnost, zdrav življenjski slog",
        "Vedenje živali | etologija, refleksi in ustaljeni vzorci vedenja, ključni dražljaji, nagon in motivacija, kineze in taksije, učenje",
        "Človek in naravni viri | energija in snovi za človeka, gojene rastline in udomačene živali, rastlinske surovine, obnovljivi viri, trajnostna raba",
      ]],
    ],
  },

  // ------------------------------------------------------------ TEKMOVANJA
  // Dodatne teme za tekmovanja in olimpijade (Kenguru, Vegovo, Stefanovo,
  // Preglovo priznanje, izbirna tekmovanja za olimpijade). Niso del učnega
  // načrta, zato niso privzeta pot nobenega razreda; učenec jih izbere sam.
  "MAT-TEK-OS": {
    label: "Matematika, tekmovanja OŠ (Kenguru, Vegovo)",
    units: [
      ["Logika in strategije", [
        "Logične naloge in sklepanje | resnične in lažne izjave, tabele možnosti, izključevanje",
        "Parnost in invariante | kaj se pri koraku ne spremeni, parnost, barvanje polj",
        "Dirichletovo načelo | predalčno načelo, n + 1 predmetov v n predalih",
        "Igre in zmagovalne strategije | simetrija, položaji zmage in poraza, igre s kupčki",
      ]],
      ["Števila", [
        "Deljivost in ostanki | pravila deljivosti, ostanki pri deljenju, zadnja števka",
        "Praštevila in delitelji v nalogah | število deliteljev, razcep, D in v v tekmovalnih nalogah",
        "Številske uganke in zapisi | mesta števk, kriptogrami, zaporedja in vzorci",
        "Enačbe s celoštevilskimi rešitvami | preproste diofantske enačbe iz besedila, preizkušanje in omejevanje",
      ]],
      ["Kombinatorika", [
        "Preštevanje možnosti | pravilo produkta in vsote, drevesni prikaz, sistematično naštevanje",
        "Razporeditve in izbire | permutacije, izbiranje brez vrstnega reda, štetje po dopolnilu",
        "Štetje poti in likov | poti po mreži, štetje trikotnikov in pravokotnikov na sliki",
      ]],
      ["Geometrija", [
        "Lovljenje kotov | koti ob vzporednicah, enakokraki trikotniki, vsote kotov v likih",
        "Ploščine z razrezom in dopolnjevanjem | razrez, premik delov, polovice, mreže",
        "Pitagorov izrek v tekmovalnih nalogah | razdalje v mreži, kvadrati na stranicah, pravokotni trikotniki v likih",
        "Simetrija, vrtenje in tlakovanje | zrcaljenje, vrtenje, sestavljanje likov",
      ]],
      ["Besedilne naloge", [
        "Delo, hitrost in mešanice | skupno delo, povprečna hitrost, srečevanje, mešanice",
        "Starosti, ure in koledar | odnosi med starostmi, kazalca ure, dnevi v tednu",
        "Ocenjevanje in Fermijeve naloge | ocena velikosti, zaokroževanje, razumne enote",
      ]],
    ],
  },
  "MAT-TEK-SS": {
    label: "Matematika, tekmovanja SŠ (Vegovo, olimpijada)",
    units: [
      ["Teorija števil", [
        "Deljivost, D in v, Evklidov algoritem | Bézoutova enakost, lastnosti največjega skupnega delitelja",
        "Kongruence | modularna aritmetika, ostanki potenc, kvadratni ostanki",
        "Mali Fermatov in Eulerjev izrek | red elementa, uporaba pri potencah in deljivosti",
        "Diofantske enačbe | linearne in nelinearne, razcep, omejevanje, neskončni spust",
        "Praštevila in eksponent praštevila | p-adična valuacija, Legendrova formula, LTE v osnovni obliki",
      ]],
      ["Algebra", [
        "Neenakosti med sredinami | AM-GM, kvadratna in harmonična sredina, kdaj velja enakost",
        "Cauchy-Schwarzeva neenakost in urejanje | Cauchy-Schwarz, neenakost urejanja, Čebišev",
        "Polinomi in Vietove formule | ničle, deljenje polinomov, Vietove formule, simetrične funkcije",
        "Funkcijske enačbe | substitucije, injektivnost, Cauchyjeva enačba",
        "Zaporedja, rekurzije in indukcija | linearne rekurzije, popolna indukcija, krepka indukcija",
      ]],
      ["Kombinatorika", [
        "Štetje z bijekcijami | dvojno štetje, bijekcije, vključitve in izključitve",
        "Dirichletovo načelo | predalčno načelo in njegove posplošitve",
        "Invariante in monovariante | parnost, barvanje, količine, ki se ne spremenijo ali monotono spreminjajo",
        "Ekstremalni princip | največji ali najmanjši element, neskončni spust",
        "Grafi in barvanja | točke in povezave, stopnja točke, Ramseyjeve naloge v osnovni obliki",
      ]],
      ["Geometrija", [
        "Koti v krožnici in tetivni štirikotniki | obodni in središčni kot, pogoji tetivnosti",
        "Potenca točke in radikalna os | potenca točke, sekante in tangente, radikalna os",
        "Podobnost, Menelaj in Ceva | razmerja na stranicah, Menelajev in Cevov izrek",
        "Značilne točke trikotnika | ortocenter, težišče, središči krožnic, Eulerjeva premica",
        "Geometrijske neenakosti in ekstremi | trikotniška neenakost, zrcaljenje, najkrajše poti",
      ]],
    ],
  },
  "FIZ-TEK-OS": {
    label: "Fizika, tekmovanja OŠ (Stefanovo)",
    units: [
      ["Merjenje in grafi", [
        "Branje in risanje grafov gibanja | graf poti in hitrosti, naklon, ploščina pod grafom",
        "Ocenjevanje in merske napake | ocena vrednosti, odčitek, povprečje in odstopanje",
      ]],
      ["Gibanje in sile", [
        "Sestavljeno gibanje in povprečna hitrost | več odsekov, srečevanje, dohitevanje",
        "Sile, ravnovesje in vzvod | sestavljanje sil, vzvod, škripec, ravnovesje",
        "Tlak in vzgon v nalogah | hidrostatični tlak, vezne posode, plavanje, gostota",
      ]],
      ["Energija in toplota", [
        "Delo, energija in izkoristek | pretvorbe energije, moč, izkoristek naprav",
        "Toplotne bilance | mešanje vode, segrevanje in taljenje, kalorimetrija",
      ]],
      ["Svetloba", [
        "Zrcala in leče v nalogah | konstrukcija slik, ravno zrcalo, zbiralna leča",
      ]],
      ["Elektrika", [
        "Vezja z več porabniki | zaporedna in vzporedna vezava, Ohmov zakon, merjenje",
        "Električna energija in moč v gospodinjstvu | kWh, strošek, moč naprav",
      ]],
      ["Eksperimentalne naloge", [
        "Načrtovanje poskusa in obdelava meritev | spremenljivke, tabela, graf, sklep",
      ]],
    ],
  },
  "FIZ-TEK-SS": {
    label: "Fizika, tekmovanja SŠ (Stefanovo, olimpijada)",
    units: [
      ["Mehanika", [
        "Poševni met in gibanje v ravnini | sestavljanje gibanj, domet, najvišja točka",
        "Newtonovi zakoni s trenjem in klanci | sile na klancu, trenje, vrvi in škripci",
        "Gibalna količina in trki | ohranitev gibalne količine, prožni in neprožni trki",
        "Vrtenje in navor | navor, ravnovesje togega telesa, vztrajnostni moment v osnovni obliki",
        "Gravitacija in kroženje | centripetalni pospešek, Keplerjevi zakoni, sateliti",
        "Nihanje in valovanje | nihalo, vzmet, valovna dolžina, stoječe valovanje",
      ]],
      ["Toplota", [
        "Idealni plin in termodinamika | plinska enačba, delo plina, prvi zakon termodinamike",
      ]],
      ["Elektrika in magnetizem", [
        "Elektrostatika | Coulombov zakon, električno polje, potencial, kondenzator",
        "Tokokrogi s Kirchhoffovimi pravili | zanke in vozlišča, notranji upor, moč",
        "Magnetno polje in Lorentzova sila | sila na vodnik in naboj, gibanje naboja v polju",
      ]],
      ["Optika in metode", [
        "Geometrijska optika | lom, popolni odboj, leče in zrcala, optične naprave",
        "Ocenjevanje in dimenzijska analiza | enote, red velikosti, preverjanje rezultatov",
      ]],
    ],
  },
  "KEM-TEK-OS": {
    label: "Kemija, tekmovanja OŠ (Preglovo)",
    units: [
      ["Snovi in zgradba", [
        "Lastnosti snovi in ločevanje zmesi | gostota, topnost, postopki ločevanja v nalogah",
        "Zgradba atoma in periodni sistem v nalogah | izotopi, elektronska razporeditev, trendi",
        "Kemijske vezi in formule spojin | ionske in kovalentne spojine, poimenovanje, formule",
      ]],
      ["Kemijsko računanje", [
        "Urejanje enačb in množina snovi | koeficienti, mol, molska masa",
        "Računanje mas iz enačb | masa reaktanta in produkta, prebitek, izkoristek v osnovni obliki",
        "Raztopine in masni delež | masni delež, redčenje, mešanje raztopin",
      ]],
      ["Reakcije in snovi", [
        "Kisline, baze in soli v nalogah | indikatorji, nevtralizacija, nastanek soli",
        "Organske spojine v nalogah | prepoznavanje skupin, izomeri, lastnosti",
        "Eksperimentalne in opazovalne naloge | opazovanje poskusa, sklepanje, varnost",
      ]],
    ],
  },
  "KEM-TEK-SS": {
    label: "Kemija, tekmovanja SŠ (Preglovo, olimpijada)",
    units: [
      ["Kemijsko računanje", [
        "Stehiometrija z omejitvenim reaktantom in izkoristkom | omejitveni reaktant, izkoristek, čistost vzorca",
        "Plini in plinska enačba | molski volumen, splošna plinska enačba, zmesi plinov",
        "Termokemija | reakcijska entalpija, Hessov zakon, kalorimetrija",
      ]],
      ["Ravnotežja", [
        "Kemijsko ravnotežje | konstanta ravnotežja, Le Chatelierovo načelo, računanje sestave",
        "Kisline, baze, pH in pufri | močne in šibke kisline, Ka, pH pufra, titracijska krivulja",
        "Redoks reakcije in elektrokemija | urejanje redoks enačb, galvanski člen, standardni potenciali",
      ]],
      ["Zgradba in organska kemija", [
        "Zgradba atoma in periodne lastnosti | kvantna števila, ionizacijska energija, elektronegativnost",
        "Kemijska vez in geometrija molekul | Lewisove strukture, VSEPR, polarnost, hibridizacija",
        "Organska kemija: reakcijski mehanizmi | substitucija, adicija, eliminacija, stereokemija",
        "Analizna kemija: titracije | kislinsko-bazne in redoks titracije, računanje iz volumnov",
      ]],
    ],
  },
};
