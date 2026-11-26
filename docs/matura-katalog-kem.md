# Matura iz kemije: katalog in lekcije

Vir: *Predmetni izpitni katalog za splošno maturo – kemija* (RIC, določil Strokovni svet RS za splošno izobraževanje
17. 6. 2021, uporablja se od spomladanskega roka 2023; po RIC-ovem pregledu *Maturitetni izpitni katalog za splošno
maturo 2027* je podlaga za izpit tudi v letu 2027), poglavje 4 »Izpitne vsebine in cilji« in poglavje 6
»Laboratorijske vaje«. Vsebine in cilji so povzeti po vrsti in s parafrazo besedila kataloga; ta preglednica ni
nadomestilo za katalog. Primerov nalog iz poglavja 5 ne povzemamo.

**Izpit (poglavje 3).** Ena raven. Izpitna pola 1: 90 minut, 35 nalog izbirnega tipa (22 iz splošne in anorganske,
13 iz organske kemije), 35 % ocene. Izpitna pola 2: 90 minut, 15 nalog zaprtega in polodprtega tipa (10 splošna in
anorganska, 5 organska, po 2–6 točk), 45 % ocene. Pripomočki: računalo, priloga je periodni sistem. Notranji del:
laboratorijske vaje s poročili, 20 % ocene (1. sklop 12 ur, 2. sklop 8 ur; vsaj 6 ur organske kemije).

**Splošno in posebno znanje.** Katalog v poglavju 4 pove, da zunanji del preverja »splošno in posebno znanje«,
laboratorijske vaje pa še izbirno, vendar v preglednicah poglavja 4 nobene vsebine ali cilja ne označi kot posebno
znanje: v PDF-ju ni posebnih znakov, poševni tisk je uporabljen le za simbol konstante *K*, krepki tisk le za naslove
vsebin (preverjeno s `pdftohtml -xml` na straneh 11–25). Zato preglednice tu nimajo stolpca »posebno«; vse postavke
veljajo za vse kandidate.

**Številčenje.** Sklopi 4.1–4.20 so številke kataloga. Katalog ciljev ne številči; oznaka 4.x.n je naša (n-ti cilj
sklopa po vrstnem redu v katalogu) in služi le za sklicevanje v razdelku »Vrzeli za 4. letnik«.

**Lekcija.** Pot do lekcije v `content/lessons/` brez `.md`. Ocenjene so lekcije KEM-SS-1 do KEM-SS-4 (34 lekcij).
KEM-OS-8/9 (osnovna šola) in KEM-TEK-SS (tekmovalni sklop za Preglovo priznanje in olimpijado, ni del poti splošne
gimnazije) sta navedena le, kadar sta edino pokritje.

**Pokritost.**
- »da« – razloženo v lekciji v obsegu gimnazije, z vsaj enim rešenim primerom ali vprašanjem v »Preveri se« na ravni
  mature (pri računskih ciljih obvezno računski primer ali vprašanje);
- »delno – …« – omenjeno ali razloženo le deloma; opomba pove, kaj točno manjka;
- »manjka« – v nobeni lekciji KEM-SS ni razloženo;
- »OŠ« – razloženo le na ravni osnovne šole (KEM-OS-8/9).

Pokritost sta ocenila dva pregledovalca (Opus) z branjem lekcij (26. 11. 2026).

Ocena je bila narejena z branjem lekcij (iskanje pojmov z `grep` in branje razdelkov »Razlaga«, »Rešeni primeri«,
»Drugače« in »Preveri se«), 25. 11. 2026. Pri dvomu je postavka ocenjena kot »delno«.


## Povzetek pokritosti

Postavk (ciljev kataloga): 244. Pokrito (»da«): 115 (47,1 %), delno: 86 (35,2 %), manjka: 39 (16,0 %), snov OŠ: 4 (1,6 %).

| Sklop | Postavk | da | delno | manjka | OŠ |
|---|---|---|---|---|---|
| 4.1 Uvod v varno eksperimentalno delo | 6 | 0 | 1 | 3 | 2 |
| 4.2 Delci (gradniki) snovi | 14 | 10 | 3 | 1 | 0 |
| 4.3 Povezovanje delcev (gradnikov) | 22 | 6 | 13 | 3 | 0 |
| 4.4 Množina snovi | 7 | 5 | 2 | 0 | 0 |
| 4.5 Kemijska reakcija | 18 | 8 | 5 | 3 | 2 |
| 4.6 Raztopine | 11 | 1 | 3 | 7 | 0 |
| 4.7 Hitrost kemijskih reakcij | 9 | 7 | 2 | 0 | 0 |
| 4.8 Kemijsko ravnotežje | 14 | 11 | 3 | 0 | 0 |
| 4.9 Ravnotežja v vodnih raztopinah | 24 | 14 | 8 | 2 | 0 |
| 4.10 Reakcije oksidacije in redukcije | 8 | 5 | 2 | 1 | 0 |
| 4.11 Elementi v periodnem sistemu | 3 | 1 | 0 | 2 | 0 |
| 4.12 Alkalijske kovine in halogeni | 8 | 4 | 4 | 0 | 0 |
| 4.13 Elementi in spojine v bioloških sistemih in sodobnih tehnologijah | 8 | 0 | 5 | 3 | 0 |
| 4.14 Zgradba in poimenovanje organskih spojin | 12 | 7 | 4 | 1 | 0 |
| 4.15 Osnove organskih reakcij | 6 | 1 | 4 | 1 | 0 |
| 4.16 Ogljikovodiki | 11 | 6 | 4 | 1 | 0 |
| 4.17 Halogenirani ogljikovodiki | 5 | 3 | 1 | 1 | 0 |
| 4.18 Organske kisikove spojine | 35 | 14 | 15 | 6 | 0 |
| 4.19 Organske dušikove spojine | 18 | 9 | 5 | 4 | 0 |
| 4.20 Polimeri | 5 | 3 | 2 | 0 | 0 |
| **Skupaj** | **244** | **115** | **86** | **39** | **4** |

Splošna in anorganska kemija (4.1–4.13): 152 postavk, da 72, delno 51, manjka 25, OŠ 4. Organska kemija (4.14–4.20):
92 postavk, da 43, delno 35, manjka 14. Najšibkejši so sklopi 4.1, 4.6, 4.11, 4.13 in 4.3 (kristali, oblika molekul);
v organskem delu aromatske substitucije, mehanizmi (4.15) in biomolekule (4.18, 4.19).

Laboratorijske vaje (poglavje 6.2, 37 naslovov): pokrito 15, delno 18, manjka 3, samo OŠ 1 (podrobno spodaj).
Lekcije o pisanju poročila in o laboratorijskih veščinah iz poglavij 6.1 in 6.3 ni.

### Manjka

Postavke, ki jih ne razloži nobena lekcija KEM-SS:

- **4.1** razlikovanje konstante in spremenljivke ter eksperimentalni pogoji (4.1.1); parametri izpostavljenosti
  nevarnim snovem (odmerek, trajanje, pogostost, način vstopa) (4.1.5); pomen LD50 (4.1.6).
- **4.2** primerjava velikosti atoma in njegovega iona (4.2.12).
- **4.3** kristalinične in amorfne snovi (4.3.13); alotropija, diamant in grafit (4.3.19); strukturi NaCl in CsCl
  (4.3.22).
- **4.5** standardna tvorbena entalpija elementov in standardno stanje (4.5.13); razlika med standardno tvorbeno in
  standardno reakcijsko entalpijo (4.5.15); izračun standardne reakcijske entalpije iz tvorbenih entalpij (4.5.16).
  (Izračun je le v tekmovalnem KEM-TEK-SS/termokemija.)
- **4.6** definicija topnosti (4.6.1); vpliv temperature na topnost trdnih snovi (4.6.2); nasičene in nenasičene
  raztopine (4.6.3); odčitavanje diagrama topnosti in pretvorba v masni delež (4.6.5); topnost iz masnega deleža
  nasičene raztopine (4.6.6); topnost plinov, vpliv temperature in tlaka ter posledice za okolje (4.6.10); hidratacija
  pri raztapljanju ionskih in molekulskih kristalov (4.6.11).
- **4.9** definicija elektrolita (4.9.9); ionske reakcije na submikroskopski ravni (4.9.22).
- **4.10** Faradayev zakon in izračuni pri elektrolizi (4.10.8).
- **4.11** značilnosti prehodnih elementov (uporabnost, različna oksidacijska števila, barve spojin) (4.11.2);
  zgradba koordinacijskih spojin, centralni atom ali ion in ligandi (4.11.3).
- **4.13** pridobivanje aluminija iz boksita (4.13.1); silicijeve spojine za steklo in cement (4.13.7); pojem
  nanotehnologija (4.13.8).
- **4.14** hibridizacija ogljikovih atomov (4.14.2) (le v tekmovalnem KEM-TEK-SS/kemijska-vez-in-geometrija-molekul).
- **4.15** pojmi substrat, reagent, intermediat, produkt, reakcijski pogoji (4.15.4).
- **4.16** elektrofilne substitucije na benzenu (nitriranje, sulfoniranje, halogeniranje, alkiliranje, aciliranje) in
  imena produktov (4.16.9).
- **4.17** reaktivnost halogeniranih ogljikovodikov glede na vrsto halogena (4.17.3).
- **4.18** razlika med alkoholi in fenoli (4.18.3); nukleofilne adicije na karbonilno skupino (HCN oz. NaCN/H⁺,
  NaHSO₃) in adicije z eliminacijo (amini, hidrazini, 2,4-dinitrofenilhidrazin) (4.18.14); umiljivi in neumiljivi lipidi (4.18.28); žarkost maščob (4.18.32); tetraciklični skelet steroidov
  (4.18.33); delovanje površinsko aktivnih snovi (4.18.34).
- **4.19** delitev aminokislin (nevtralne, kisle, bazične, alifatske, aromatske, heterociklične) (4.19.5);
  kromatografija aminokislin (4.19.10); izoelektrična točka (4.19.12); pomen esencialnih aminokislin (4.19.18).


## Po sklopih

### 4.1 Uvod v varno eksperimentalno delo

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Varno delo v šolskem laboratoriju* – 4.1.1 razlikuje konstanto in spremenljivko, definira eksperimentalne pogoje (temperatura, tlak) | – | manjka |
| 4.1.2 pozna osnovne laboratorijske pripomočke in jih zna uporabiti | `KEM-SS-2/titracija` | delno – opisani so le polnilna pipeta, bireta in erlenmajerica; pregled pripomočkov (merilna bučka, merilni valj, čaše, lij, hladilnik …) manjka |
| 4.1.3 pozna osnovne tehnike: tehtanje z digitalno tehtnico, merjenje prostornine, Bunsenov gorilnik, ločevanje zmesi | `KEM-OS-8/snovi-in-njihove-lastnosti` | OŠ – filtriranje, destilacija, izparevanje le na ravni OŠ; Bunsenov gorilnik, ekstrakcija, sublimacija, kromatografija manjkajo |
| *Osnove toksikologije* – 4.1.4 slikovne in črkovne oznake nevarnih snovi, piktogrami GHS | `KEM-OS-8/varno-delo-v-laboratoriju` | OŠ – piktogrami GHS, H- in P-stavki le na ravni OŠ |
| 4.1.5 parametri izpostavljenosti (odmerek, trajanje, pogostost, način vstopa) in ustrezna zaščitna oprema | – | manjka (zaščitna oprema le v KEM-OS-8) |
| 4.1.6 razume pomen LD50 | – | manjka |

### 4.2 Delci (gradniki) snovi

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Osnovni delci v atomu* – 4.2.1 razloži zgradbo atoma glede na porazdelitev mase in naboja | `KEM-SS-1/zgradba-atoma` | da |
| 4.2.2 določi število osnovnih delcev v atomih, ionih in molekulah | `KEM-SS-1/zgradba-atoma` | da |
| 4.2.3 prepozna proton, nevtron, elektron po relativnem naboju in masi | `KEM-SS-1/zgradba-atoma` | da |
| 4.2.4 pomen vrstnega in masnega števila | `KEM-SS-1/zgradba-atoma` | da |
| *Izotopi* – 4.2.5 definicija izotopa in razlike med izotopi | `KEM-SS-1/zgradba-atoma` | da |
| 4.2.6 izračuna relativno atomsko maso iz izotopske sestave | `KEM-SS-1/zgradba-atoma` | da – Primer 2 in dve vprašanji |
| *Zgradba elektronske ovojnice* – 4.2.7 elektronske konfiguracije atomov in ionov reprezentativnih elementov, daljši in krajši zapis (z žlahtnim plinom) ter grafični zapis | `KEM-SS-1/zgradba-atoma` | delno – daljši zapis, ion (Primer 3) in predalčki da; krajši zapis z žlahtnim plinom ([Ne] 3s¹) manjka |
| 4.2.8 opredeli lupine, podlupine, orbitale in valenčne elektrone | `KEM-SS-1/zgradba-atoma` | da |
| 4.2.9 razlika med osnovnim in vzbujenim stanjem | `KEM-SS-1/zgradba-atoma` | delno – prehod elektrona pri plamenski reakciji je opisan, pojma »osnovno« in »vzbujeno stanje« nista poimenovana ne preverjena |
| *Periodičnost lastnosti* – 4.2.10 pomen period in skupin | `KEM-SS-1/periodni-sistem` | da |
| 4.2.11 spreminjanje atomskega polmera po periodah in skupinah | `KEM-SS-1/periodni-sistem`, `KEM-SS-2/lastnosti-elementov-v-periodnem-sistemu` | da |
| 4.2.12 primerja velikost atomov in njihovih ionov | – | manjka |
| 4.2.13 nastanek ionov in povezava z ionizacijsko energijo | `KEM-SS-2/lastnosti-elementov-v-periodnem-sistemu`, `KEM-SS-2/alkalijske-kovine-in-halogeni` | delno – ionizacijska energija je definirana; zakaj Na tvori Na⁺, Mg pa Mg²⁺ (zaporedne ionizacijske energije) ni razloženo |
| 4.2.14 pomen ionizacijske energije, spreminjanje prve IE po periodah in skupinah | `KEM-SS-1/periodni-sistem`, `KEM-SS-2/lastnosti-elementov-v-periodnem-sistemu` | da |

### 4.3 Povezovanje delcev (gradnikov)

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Ionska vez, kovalentna vez* – 4.3.1 razlikuje ionsko, nepolarno in polarno kovalentno vez, lastnosti snovi glede na tip vezi | `KEM-SS-1/kemijske-vezi` | da |
| 4.3.2 opredeli značaj vezi iz elektronegativnosti | `KEM-SS-1/kemijske-vezi`, `KEM-SS-1/periodni-sistem` | da |
| 4.3.3 povezava med jakostjo, energijo in dolžino vezi | `KEM-SS-1/energija-pri-reakcijah` | delno – povprečne energije vezi (H–H, O=O, O–H) in »močnejše vezi sprostijo več energije« le pri računu ΔH; dolžina vezi in primerjava enojne, dvojne, trojne vezi manjkata |
| *Strukturne formule molekul* – 4.3.4 strukturne formule preprostih molekul (H₂, N₂, halogeni, H₂O, CO₂, NH₃, BeCl₂, BF₃, CH₄, etan, eten, etin), oblika, koti, vezni in nevezni pari, polarnost | `KEM-SS-1/kemijske-vezi`, `KEM-SS-3/ogljikovodiki` | delno – Lewisove formule H₂O, Cl₂, N₂, CO₂ in organske molekule da; BeCl₂ in BF₃ manjkata, obliki NH₃ (piramida) in H₂O (kotna) z koti nista obravnavani; preglednica kotov le za alkan, alken, alkin |
| 4.3.5 poveže model snovi z njeno formulo | `KEM-SS-1/kemijske-vezi` | delno – modelov (kroglice, paličice, prostorski) ni v nalogah; le CCl₄ opisno |
| 4.3.6 razloži razliko v kotih z odboji elektronskih parov | `KEM-SS-3/karbonilne-spojine` | delno – odboj elektronskih oblakov (trikotna planarna oblika, 120°) le pri karbonilni skupini v »Bolj natančno«; vpliv neveznih parov na kote (CH₄, NH₃, H₂O) manjka (sicer le v tekmovalnem KEM-TEK-SS) |
| 4.3.7 razlikuje polarnost vezi in molekule | `KEM-SS-1/kemijske-vezi` | da |
| *Nomenklatura IUPAC binarnih spojin* – 4.3.8 formule in imena binarnih spojin | `KEM-SS-2/oksidacijska-stevila`, `KEM-OS-8/formule-spojin` | delno – imena se uporabljajo (železov(III) oksid, ogljikov dioksid), pravila (Stockov zapis, grške predpone) v KEM-SS niso razložena |
| *Molekulske vezi* – 4.3.9 sile med molekulami glede na polarnost (orientacijske, indukcijske, disperzijske) in vpliv na fizikalne lastnosti | `KEM-SS-1/medmolekulske-sile` | delno – disperzijske in orientacijske (dipol-dipol) da; indukcijske sile (dipol–induciran dipol) manjkajo |
| 4.3.10 opredeli polarizabilnost molekul | `KEM-SS-1/medmolekulske-sile` | delno – »več elektronov, močnejše disperzijske sile« je razloženo, pojem polarizabilnost ni |
| *Vodikova vez* – 4.3.11 opredeli in prikaže vodikove vezi (tudi pri organskih spojinah) | `KEM-SS-1/medmolekulske-sile`, `KEM-SS-3/halogenoalkani-in-alkoholi` | da |
| 4.3.12 vpliv vodikovih vezi na fizikalne lastnosti | `KEM-SS-1/medmolekulske-sile` | da |
| *Vrste kristalov* – 4.3.13 kristalinične in amorfne snovi, primeri amorfnih (steklo, plastika, škrob) | – | manjka |
| 4.3.14 vrste kristalov glede na delce v mreži in tip vezi | `KEM-SS-1/kemijske-vezi` | delno – ionski kristal da; molekulski, kovalentni (atomski) in kovinski kristal niso opredeljeni kot vrste kristalov |
| 4.3.15 iz formule uvrsti snov v vrsto kristala | `KEM-SS-1/kemijske-vezi` | delno – le ionsko proti molekulskemu; kovalentni kristali (diamant, SiO₂) manjkajo |
| 4.3.16 primerja privlačne sile v ionskih, molekulskih in kovalentnih kristalih in vpliv na lastnosti | `KEM-SS-1/kemijske-vezi`, `KEM-SS-1/medmolekulske-sile` | delno – sol proti sladkorju da; kovalentni kristal ni vključen |
| 4.3.17 razlike v lastnostih različnih vrst kristalov | `KEM-SS-1/kemijske-vezi` | delno – ionski in kovinski da, pregled vseh štirih vrst manjka |
| 4.3.18 kovinska vez in njen vpliv na lastnosti kovin | `KEM-SS-1/kemijske-vezi` | da |
| 4.3.19 alotropija, struktura, lastnosti in uporaba diamanta in grafita | – | manjka (grafit le kot elektroda in izjema pri prevodnosti) |
| *Urejena zgradba trdnih snovi* – 4.3.20 koordinacijsko število v ionskih in kovinskih kristalih | `KEM-SS-1/kemijske-vezi` | delno – »vsak Na⁺ obkroža šest Cl⁻«, pojem koordinacijsko število in kovinski kristali manjkajo |
| 4.3.21 zgradba kristalov na submikroskopski ravni | `KEM-SS-1/kemijske-vezi` | delno – le dvodimenzionalna shema NaCl |
| 4.3.22 razlike med strukturama NaCl in CsCl | – | manjka |

### 4.4 Množina snovi

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Relativne mase in molska masa* – 4.4.1 definiciji relativne molekulske mase in molske mase, razlika med njima | `KEM-SS-1/mnozina-snovi` | delno – molska masa definirana; Mr kot razmerje z 1/12 mase ¹²C in razlika (brez enote proti g/mol) le posredno v »Bolj natančno« |
| 4.4.2 izračuna molsko maso večatomnih elementov in spojin | `KEM-SS-1/mnozina-snovi` | da |
| *Množina in Avogadrova konstanta* – 4.4.3 preračunava množino, maso in število delcev | `KEM-SS-1/mnozina-snovi` | da |
| 4.4.4 število atomov, molekul in ionov v dani količini snovi | `KEM-SS-1/mnozina-snovi` | da |
| *Karakteristične lastnosti plinov* – 4.4.5 značilne lastnosti plinov | `KEM-SS-1/plini` | delno – razdalje med delci da; stisljivost, zapolnitev prostora, difuzija niso obravnavane |
| *Molska prostornina* – 4.4.6 opiše stanje plina s p, V, n, T | `KEM-SS-1/plini` | da |
| 4.4.7 izračuna količino plina in molsko prostornino | `KEM-SS-1/plini` | da |

### 4.5 Kemijska reakcija

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Snovna sprememba* – 4.5.1 opredeli kemijsko reakcijo kot snovno spremembo | `KEM-OS-8/kemijska-reakcija` | OŠ |
| 4.5.2 razbere in prikaže snovne spremembe v submikroskopskih prikazih | `KEM-SS-1/urejanje-enacb` | delno – štetje atomov v tabeli; naloge s submikroskopskimi (delčnimi) prikazi reakcij manjkajo |
| 4.5.3 kvalitativni in kvantitativni pomen kemijskih enačb | `KEM-SS-1/stehiometrija` | da |
| 4.5.4 prepozna kemijsko reakcijo | `KEM-OS-8/kemijska-reakcija` | OŠ |
| 4.5.5 urejena enačba z označenimi agregatnimi stanji | `KEM-SS-1/urejanje-enacb`, `KEM-SS-1/energija-pri-reakcijah` | delno – urejanje da; oznake (s), (l), (g), (aq) niso razložene, le uporabljene v termokemiji |
| 4.5.6 formule elementov, ki so pri sobnih pogojih večatomne molekule | `KEM-SS-1/urejanje-enacb`, `KEM-SS-1/kemijske-vezi` | delno – H₂, O₂, N₂, Cl₂ se uporabljajo; seznam (H₂, N₂, O₂, F₂, Cl₂, Br₂, I₂, P₄, S₈) in pravilo manjkata |
| 4.5.7 množinska razmerja iz enačbe, kvantitativno vrednotenje | `KEM-SS-1/stehiometrija`, `KEM-SS-4/kemijsko-racunanje` | da |
| 4.5.8 ugotovi reaktant v presežku | `KEM-SS-1/stehiometrija`, `KEM-SS-4/kemijsko-racunanje` | da |
| *Energijska sprememba* – 4.5.9 opredeli reakcije kot energijske spremembe | `KEM-SS-1/energija-pri-reakcijah` | da |
| 4.5.10 razlikuje eksotermne in endotermne reakcije | `KEM-SS-1/energija-pri-reakcijah` | da |
| 4.5.11 predznak spremembe entalpije | `KEM-SS-1/energija-pri-reakcijah` | da |
| 4.5.12 energijske spremembe pri prekinitvi in nastanku vezi | `KEM-SS-1/energija-pri-reakcijah` | da |
| 4.5.13 standardna tvorbena entalpija elementov, pomen standardnega stanja | – | manjka |
| 4.5.14 zapiše termokemijsko enačbo za tvorbeno oz. reakcijsko entalpijo | `KEM-SS-1/energija-pri-reakcijah` | delno – termokemijska enačba za reakcijsko entalpijo da; zapis tvorbene reakcije (1 mol produkta iz elementov v standardnem stanju) manjka |
| 4.5.15 razlika med standardno tvorbeno in standardno reakcijsko entalpijo | – | manjka |
| 4.5.16 izračuna standardno reakcijsko entalpijo iz standardnih tvorbenih entalpij | – | manjka (le KEM-TEK-SS/termokemija) |
| 4.5.17 energijski diagram, odčita aktivacijsko energijo in ΔH | `KEM-SS-1/energija-pri-reakcijah`, `KEM-SS-2/hitrost-reakcij` | da |
| 4.5.18 gorenje (eksotermno), fotosinteza (endotermna), življenjski primeri | `KEM-SS-1/energija-pri-reakcijah` | delno – gorenje in hladilna obloga da; fotosinteza manjka |

### 4.6 Raztopine

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Sestava raztopin* – 4.6.1 definicija topnosti snovi | – | manjka |
| 4.6.2 vpliv temperature na topnost trdnih snovi | – | manjka |
| 4.6.3 nasičene in nenasičene raztopine | – | manjka |
| 4.6.4 sestava raztopin na submikroskopski ravni | `KEM-SS-1/raztopine` | delno – slika s »pikicami« v razdelku »Na sliki«, brez nalog |
| 4.6.5 odčita topnost iz diagrama topnosti in jo preračuna v masni delež | – | manjka |
| 4.6.6 izračuna topnost iz masnega deleža v nasičeni raztopini | – | manjka |
| 4.6.7 definira in izračuna sestavo raztopin | `KEM-SS-1/raztopine` | da – masni delež in množinska koncentracija |
| 4.6.8 pretvarja masni delež, množinsko in masno koncentracijo | `KEM-SS-1/raztopine`, `KEM-SS-2/titracija` | delno – masna koncentracija le v titraciji; pretvorba w ↔ c prek gostote manjka |
| 4.6.9 sprememba sestave pri redčenju, koncentriranju in mešanju | `KEM-SS-1/raztopine` | delno – redčenje da; koncentriranje (izparevanje) in mešanje dveh raztopin manjkata |
| 4.6.10 vpliv temperature in tlaka na topnost plinov in vplivi na okolje | – | manjka |
| *Raztapljanje* – 4.6.11 procesi pri raztapljanju ionskih in molekulskih kristalov (hidratacija) | – | manjka |

### 4.7 Hitrost kemijskih reakcij

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Hitrost reakcije* – 4.7.1 pojem hitrosti, izraz za hitrost | `KEM-SS-2/hitrost-reakcij` | da |
| 4.7.2 iz diagrama odčita spreminjanje količine snovi s časom | `KEM-SS-2/hitrost-reakcij` | da |
| 4.7.3 izračuna povprečno hitrost v časovnem intervalu | `KEM-SS-2/hitrost-reakcij` | da |
| *Vplivi na hitrost* – 4.7.4 vpliv koncentracije, temperature, površine | `KEM-SS-2/hitrost-reakcij` | da |
| 4.7.5 vpliv katalizatorja na potek reakcije | `KEM-SS-2/hitrost-reakcij` | da – pojma homogena in heterogena kataliza (vsebina) nista poimenovana |
| 4.7.6 encimi kot biokatalizatorji | `KEM-SS-2/hitrost-reakcij` | delno – dve povedi (katalaza, amilaza) brez primera ali vprašanja; pomen encimov pri biokemijskih reakcijah ni razložen |
| 4.7.7 avtomobilski katalizator in procesi v njem | `KEM-SS-2/hitrost-reakcij` | delno – le Pt in CO → CO₂; redukcija NOₓ, oksidacija ogljikovodikov in enačbe manjkajo |
| *Teorija trkov* – 4.7.8 reakcija kot posledica trkov, aktivacijska energija | `KEM-SS-2/hitrost-reakcij` | da – aktivirani kompleks da; stopnje in mehanizem reakcije (vsebina) le omenjeni |
| 4.7.9 povezava aktivacijske energije in hitrosti | `KEM-SS-2/hitrost-reakcij` | da |

### 4.8 Kemijsko ravnotežje

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Kemijsko ravnotežje* – 4.8.1 obojesmernost reakcij | `KEM-SS-2/kemijsko-ravnotezje` | da |
| 4.8.2 ravnotežje kot dinamičen proces | `KEM-SS-2/kemijsko-ravnotezje` | da |
| 4.8.3 enačba ravnotežne reakcije z agregatnimi stanji | `KEM-SS-2/kemijsko-ravnotezje` | da |
| 4.8.4 izraz za Kc in njen pomen | `KEM-SS-2/kemijsko-ravnotezje` | da |
| 4.8.5 razlika med homogenim in heterogenim ravnotežjem | `KEM-SS-2/kemijsko-ravnotezje` | delno – primer z apnencem (trdnine niso v K) da; pojma homogeno in heterogeno ravnotežje nista poimenovana ne primerjana |
| 4.8.6 K je odvisna od temperature | `KEM-SS-2/kemijsko-ravnotezje` | da |
| 4.8.7 izračuna K iz ravnotežnih količin in oceni položaj | `KEM-SS-2/kemijsko-ravnotezje` | da |
| 4.8.8 iz K izračuna ravnotežne količine | `KEM-SS-2/kemijsko-ravnotezje` | da |
| 4.8.9 ravnotežne količine pri vzpostavljanju ravnotežja | `KEM-SS-2/kemijsko-ravnotezje` | da – Primer 4 (začetne in ravnotežne koncentracije) |
| 4.8.10 položaj ravnotežja na submikroskopski ravni | `KEM-SS-2/kemijsko-ravnotezje` | delno – le simulacija; nalog s submikroskopskimi prikazi ni |
| 4.8.11 pomen ravnotežnih reakcij v industriji, okolju in organizmih | `KEM-SS-2/kemijsko-ravnotezje` | delno – sinteza amoniaka in apnenica da; okolje in organizmi manjkajo |
| *Dejavniki* – 4.8.12 dejavniki, ki vplivajo na položaj ravnotežja | `KEM-SS-2/kemijsko-ravnotezje` | da |
| 4.8.13 vpliv tlaka (prostornine), temperature in koncentracij | `KEM-SS-2/kemijsko-ravnotezje` | da |
| 4.8.14 Le Chatelierovo načelo na primerih | `KEM-SS-2/kemijsko-ravnotezje` | da |

### 4.9 Ravnotežja v vodnih raztopinah

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Protolitska ravnotežja* – 4.9.1 Brønstedova definicija kislin in baz | `KEM-SS-2/kisline-in-baze` | da |
| 4.9.2 enačbe protolitskih reakcij | `KEM-SS-2/kisline-in-baze` | da |
| 4.9.3 formule in imena pomembnejših kislin (tudi oksokislin), baz, soli (tudi hidrogensoli in kristalohidratov) in ionov | `KEM-SS-2/kisline-in-baze`, `KEM-SS-2/oksidacijska-stevila` | delno – posamezne kisline in ioni se pojavijo; sistematični pregled oksokislin, hidrogensoli (NaHCO₃, NaHSO₄) in kristalohidratov (CuSO₄·5H₂O) manjka |
| 4.9.4 konjugirana kislina in baza | `KEM-SS-2/kisline-in-baze` | da |
| 4.9.5 izraz za Ka in Kb, pomen | `KEM-SS-2/sibke-kisline-in-baze` | da |
| 4.9.6 oceni jakost kislin in baz iz Ka in Kb | `KEM-SS-2/sibke-kisline-in-baze` | da |
| 4.9.7 položaj ravnotežja v raztopinah kislin in baz na submikroskopski ravni | `KEM-SS-2/kisline-in-baze`, `KEM-SS-2/sibke-kisline-in-baze` | delno – slike prenosa protona da; delčni prikazi močne proti šibki kislini v nalogah manjkajo |
| 4.9.8 pomen ionskega produkta vode Kw | `KEM-SS-2/ph` | da |
| 4.9.9 opredeli elektrolit | – | manjka |
| 4.9.10 jakost, koncentracija in zgradba elektrolita ter električna prevodnost | `KEM-SS-1/kemijske-vezi`, `KEM-SS-4/splosna-in-anorganska-kemija` | delno – prevodnost trdne in raztopljene soli proti sladkorju (Primer, vprašanje) in HCl, ki v vodi tvori ione, da; močni in šibki elektroliti ter vpliv koncentracije na prevodnost manjkajo |
| 4.9.11 pomen kislin in baz v življenju, kisel dež | `KEM-SS-4/splosna-in-anorganska-kemija`, `KEM-SS-2/lastnosti-elementov-v-periodnem-sistemu` | da |
| *pH in indikatorji* – 4.9.12 definicija pH, pH močnih kislin in baz | `KEM-SS-2/ph` | da |
| 4.9.13 barve fenolftaleina, lakmusa in metiloranža glede na pH | `KEM-SS-2/titracija` | delno – fenolftalein in metiloranž da; lakmus manjka |
| 4.9.14 iz pH izračuna koncentracijo oz. sestavo raztopin močnih kislin in baz | `KEM-SS-2/ph` | da |
| 4.9.15 primerja pH in lastnosti raztopin (koncentracija, moč, potreben titrant) | `KEM-SS-2/ph`, `KEM-SS-2/sibke-kisline-in-baze`, `KEM-SS-2/titracija` | da |
| *Titracije* – 4.9.16 enačba nevtralizacije in kemijsko računanje | `KEM-SS-2/titracija` | da |
| 4.9.17 spreminjanje pH pri titraciji močne kisline z močno bazo | `KEM-SS-2/titracija` | da |
| 4.9.18 titracijska krivulja in ekvivalentna točka | `KEM-SS-2/titracija` | da |
| 4.9.19 izbira indikatorja | `KEM-SS-2/titracija` | da |
| *Ionske reakcije* – 4.9.20 vzroki za potek ionskih reakcij, ionska enačba z agregatnimi stanji, računanje | `KEM-SS-1/urejanje-enacb`, `KEM-SS-2/titracija`, `KEM-SS-2/elementi-v-bioloskih-sistemih` | delno – nevtralizacija H₃O⁺ + OH⁻, dvojna zamenjava (AgCl) in obarjanje Fe²⁺ + H₂S → FeS z računom mase (Primer 3) da; trije vzroki (oborina, plin, slabo disociirana snov), pravila topnosti in ionski zapis z agregatnimi stanji manjkajo |
| 4.9.21 razloži, zakaj ionske reakcije potekajo | `KEM-SS-1/urejanje-enacb`, `KEM-SS-2/elementi-v-bioloskih-sistemih` | delno – le omemba, da pri dvojni zamenjavi nastane oborina ali voda in da je obarjanje nastanek netopne snovi; razlaga (odstranitev ionov iz raztopine) manjka |
| 4.9.22 potek ionskih reakcij na submikroskopski ravni | – | manjka |
| *Protoliza ionov soli* – 4.9.23 kislost oz. bazičnost raztopin soli kot posledica protolize | `KEM-SS-2/titracija` | delno – le acetat v točki ekvivalence; NH₄Cl, Na₂CO₃ in sistematično pravilo manjkajo |
| 4.9.24 enačba protolitske reakcije ionov soli | `KEM-SS-2/titracija`, `KEM-SS-2/kisline-in-baze` | delno – acetatni ion (titracija) in obe reakciji HCO₃⁻ z vodo (Primer 3 v `KEM-SS-2/kisline-in-baze`) da; NH₄⁺, CO₃²⁻ in povezava enačbe s pH raztopine soli manjkajo |

### 4.10 Reakcije oksidacije in redukcije

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Oksidacija in redukcija* – 4.10.1 določi oksidacijsko število | `KEM-SS-2/oksidacijska-stevila` | da |
| 4.10.2 prepozna redoks reakcijo, oksidant, reducent, število elektronov | `KEM-SS-2/redoks-reakcije` | da |
| 4.10.3 uredi enostavne redoks enačbe in računa z njimi | `KEM-SS-2/redoks-reakcije` | da |
| *Redoks vrsta* – 4.10.4 smer reakcij, razvrščanje oksidantov in reducentov | `KEM-SS-2/galvanski-cleni-in-elektroliza`, `KEM-SS-2/redoks-reakcije`, `KEM-SS-2/alkalijske-kovine-in-halogeni` | da |
| *Galvanski člen* – 4.10.5 zgradba in delovanje galvanskega člena (baterije, akumulatorji, gorivne celice) | `KEM-SS-2/galvanski-cleni-in-elektroliza` | delno – Daniellov člen da; baterije, akumulator in gorivna celica le omenjeni brez zgradbe in reakcij |
| 4.10.6 napetost člena iz standardnih potencialov | `KEM-SS-2/galvanski-cleni-in-elektroliza` | da |
| *Elektroliza* – 4.10.7 elektroliza taline binarne spojine in vodne raztopine binarne soli, reakcije na elektrodah | `KEM-SS-2/galvanski-cleni-in-elektroliza` | delno – raztopina CuCl₂ in voda da; elektroliza taline (NaCl, Al₂O₃) in tekmovanje z vodo (NaCl(aq), KI(aq)) manjkata |
| 4.10.8 Faradayev zakon za izračun različnih veličin | – | manjka |

### 4.11 Elementi v periodnem sistemu

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Področja v periodnem sistemu* – 4.11.1 reakcije kovinskih in nekovinskih oksidov z vodo | `KEM-SS-2/lastnosti-elementov-v-periodnem-sistemu` | da – področja s, p, d, f niso poimenovana |
| *Prehodni elementi in koordinacijske spojine* – 4.11.2 značilnosti prehodnih elementov (uporabnost, različna oksidacijska števila, barve spojin) | – | manjka |
| 4.11.3 zgradba koordinacijskih spojin, centralni atom oz. ion in ligandi iz formule ali imena | – | manjka |

### 4.12 Alkalijske kovine in halogeni

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Alkalijske kovine* – 4.12.1 reakcije s kisikom in z vodo | `KEM-SS-2/alkalijske-kovine-in-halogeni` | da |
| 4.12.2 reakcije alkalijskih oksidov z vodo | `KEM-SS-2/alkalijske-kovine-in-halogeni`, `KEM-SS-2/lastnosti-elementov-v-periodnem-sistemu` | da – enačbe za peroksid in superoksid z vodo manjkajo |
| 4.12.3 fizikalne lastnosti v primerjavi z drugimi kovinami | `KEM-SS-2/alkalijske-kovine-in-halogeni` | delno – mehke in lahke da; nizka tališča in gostote ob primerjavi z npr. Fe, Cu manjkajo |
| 4.12.4 barvi plamena natrija in kalija | `KEM-SS-2/alkalijske-kovine-in-halogeni` | delno – barve v preglednici, povzetku in laboratorijski simulaciji; ni rešenega primera ne vprašanja v »Preveri se« |
| *Halogeni* – 4.12.5 viri halogenov v naravi, pridobivanje klora z elektrolizo | `KEM-SS-2/galvanski-cleni-in-elektroliza` | delno – anodna oksidacija 2 Cl⁻ → Cl₂ le pri elektrolizi raztopine CuCl₂; viri halogenov v naravi in industrijska elektroliza NaCl manjkajo |
| 4.12.6 fizikalne in kemijske lastnosti F, Cl, Br, I | `KEM-SS-2/alkalijske-kovine-in-halogeni` | da |
| 4.12.7 relativna reaktivnost halogenov kot oksidantov | `KEM-SS-2/alkalijske-kovine-in-halogeni` | da |
| 4.12.8 reakcije halogenov z vodikom, lastnosti vodnih raztopin vodikovih halogenidov | `KEM-SS-2/kemijsko-ravnotezje`, `KEM-SS-2/sibke-kisline-in-baze` | delno – H₂ + I₂ ⇌ 2 HI le kot primer ravnotežja, HF kot šibka kislina le v vprašanju; reakcije drugih halogenov z vodikom in primerjava kislosti HF, HCl, HBr, HI manjkajo |

### 4.13 Lastnosti izbranih elementov in spojin v bioloških sistemih in sodobnih tehnologijah

Opomba: lekcija `KEM-SS-2/elementi-v-bioloskih-sistemih` obravnava biogene elemente (C, H, O, N, P, S, Ca, Fe), ciljev tega
sklopa pa skoraj ne pokrije.

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Pridobivanje kovin iz rud* – 4.13.1 vir aluminija, pridobivanje iz boksita | – | manjka |
| *Anorganske spojine v življenju* – 4.13.2 lastnosti H₂SO₄, H₃PO₄, HNO₃ (in NH₃) | `KEM-SS-2/kisline-in-baze`, `KEM-SS-2/ph`, `KEM-SS-3/halogenoalkani-in-alkoholi` | delno – H₂SO₄ in HNO₃ le kot močni kislini in dehidratacijsko sredstvo; H₃PO₄ manjka; oksidativnost HNO₃ in konc. H₂SO₄, higroskopnost, uporaba niso obravnavane |
| 4.13.3 klorove oksokisline, formule in imena njihovih soli | `KEM-SS-2/oksidacijska-stevila`, `KEM-SS-2/kisline-in-baze` | delno – le perklorat; HClO, HClO₂, HClO₃ in hipoklorit, klorit, klorat manjkajo |
| 4.13.4 sestava umetnih gnojil, priprava dušikovih in fosforjevih spojin | `KEM-SS-2/elementi-v-bioloskih-sistemih`, `KEM-SS-2/kemijsko-ravnotezje` | delno – sečnina, nitrati in sinteza amoniaka (ravnotežje) da; Ostwaldov postopek, fosfatna gnojila, NPK manjkajo |
| 4.13.5 onesnaževanje zaradi gnojil in dušikovih oksidov | `KEM-SS-4/splosna-in-anorganska-kemija` | delno – dušikovi oksidi kot vzrok kislega dežja (povzetek, vprašanje o NO iz strele) da; evtrofikacija, nitrati v podtalnici in smog manjkajo |
| *Elementi v modernih tehnologijah* – 4.13.6 silicij kot polprevodnik | `KEM-SS-2/lastnosti-elementov-v-periodnem-sistemu` | delno – ena poved (»iz njega izdelujejo čipe«) |
| 4.13.7 silicijeve spojine za steklo in cement | – | manjka |
| 4.13.8 pojem nanotehnologija | – | manjka |

### 4.14 Zgradba molekul organskih spojin in njihovo poimenovanje

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Imena in formule* – 4.14.1 elementna sestava organskih spojin | `KEM-SS-3/ogljikovodiki`, `KEM-SS-2/elementi-v-bioloskih-sistemih` | da |
| 4.14.2 hibridizacija ogljikovih atomov | – | manjka (le KEM-TEK-SS) |
| 4.14.3 delitev po skeletu (ciklične/aciklične, nasičene/nenasičene, alifatske/aromatske) | `KEM-SS-3/ogljikovodiki` | delno – nasičene, nenasičene, ciklične in areni da; sistematična delitev in pojem alifatski manjkata |
| 4.14.4 empirične, molekulske, strukturne, racionalne in skeletne formule | `KEM-SS-3/ogljikovodiki`, `KEM-SS-4/organska-kemija` | delno – molekulske, strukturne, racionalne da; empirična le v KEM-SS-4/organska-kemija; skeletna (črtna) formula manjka |
| 4.14.5 splošne formule organskih spojin | `KEM-SS-3/ogljikovodiki`, `KEM-SS-3/halogenoalkani-in-alkoholi` | da |
| 4.14.6 imena IUPAC iz strukture in obratno (alkani do aminokislin, etri, estri, amini, amidi, nitrili) | `KEM-SS-3/ogljikovodiki`, `KEM-SS-3/halogenoalkani-in-alkoholi`, `KEM-SS-3/karbonilne-spojine`, `KEM-SS-3/karboksilne-kisline-in-derivati`, `KEM-SS-3/dusikove-organske-spojine` | delno – alkani, alkeni, alkini, halogenoalkani, alkoholi, aldehidi, ketoni, kisline, estri, amini, amidi da; etri (le metoksimetan omenjen), nitrili, substituirani benzeni in aminokisline (sistematična imena) manjkajo |
| 4.14.7 imena in strukture funkcionalnih skupin (hidroksilna, karbonilna, karboksilna, estrska, etrska, amidna, amino, halogeno, nitro, ciano) | `KEM-SS-4/organska-kemija`, lekcije KEM-SS-3 | delno – nitro in ciano manjkata |
| *Izomerija* – 4.14.8 verižna, položajna, funkcionalna, geometrijska izomerija | `KEM-SS-3/izomerija` | da |
| 4.14.9 vrsta izomerije med pari spojin | `KEM-SS-3/izomerija` | da |
| 4.14.10 centri kiralnosti | `KEM-SS-3/izomerija` | da |
| 4.14.11 formule in imena izomerov iz molekulske formule | `KEM-SS-3/izomerija` | da |
| 4.14.12 možni izomeri (tudi geometrijski in optični) iz molekulske formule | `KEM-SS-3/izomerija` | da |

### 4.15 Osnove organskih reakcij

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Prekinitev vezi in vrste delcev* – 4.15.1 iz zapisa prepozna elektrofile, nukleofile, radikale | `KEM-SS-3/organske-reakcije` | delno – pojmi le v razdelku »Bolj natančno«, brez nalog prepoznavanja |
| 4.15.2 heterolitska in homolitska prekinitev vezi C–Y, karbokation, karboanion, radikal | `KEM-SS-3/organske-reakcije` | delno – le razcep Cl₂ na radikala in alkilni radikal v »Bolj natančno«; pojma homolitska in heterolitska prekinitev, karbokation in karboanion manjkajo |
| *Reakcijska shema* – 4.15.3 napiše reakcijsko shemo | `KEM-SS-3/organske-reakcije` | delno – enačbe s pogoji da; zapis sheme (reagent in pogoji nad puščico, večstopenjske sheme) ni razložen |
| 4.15.4 pojmi substrat, reagent, intermediat, produkt, reakcijski pogoji | – | manjka |
| *Razdelitev organskih reakcij* – 4.15.5 vrsta in mehanizem iz narave substrata in reagenta | `KEM-SS-3/organske-reakcije` | delno – vrste da; mehanizmi (radikalska, elektrofilna, nukleofilna) le v »Bolj natančno«; oksidacija in redukcija kot vrsti organskih reakcij nista vključeni v razdelitev |
| 4.15.6 splošen zapis adicije, substitucije, eliminacije in tipi spojin | `KEM-SS-3/organske-reakcije` | da |

### 4.16 Ogljikovodiki

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Alkani in cikloalkani* – 4.16.1 vrelišča z dolžino verige, kateri alkani so plini | `KEM-SS-3/ogljikovodiki`, `KEM-SS-4/organska-kemija` | da |
| 4.16.2 vpliv razvejenosti na vrelišče | `KEM-SS-3/izomerija`, `KEM-SS-4/organska-kemija` | da |
| 4.16.3 nereaktivnost alkanov s kislinami, bazami, oksidanti, reducenti | `KEM-SS-3/ogljikovodiki` | delno – omenjena, ne razložena (nepolarne vezi C–H, C–C) |
| 4.16.4 radikalsko halogeniranje in vpliv zgradbe substrata na produkte | `KEM-SS-3/organske-reakcije` | delno – potek v »Bolj natančno«; vpliv zgradbe (primarni, sekundarni, terciarni H, zmes izomerov) manjka |
| *Alkeni, cikloalkeni, alkini* – 4.16.5 elektrofilne adicije HX, vode, Br₂, Cl₂ | `KEM-SS-3/organske-reakcije` | delno – na eten in propen (Markovnikovo pravilo) da; adicije na alkine in cikloalkene manjkajo |
| 4.16.6 katalitsko hidrogeniranje | `KEM-SS-3/organske-reakcije`, `KEM-SS-4/organska-kemija` | da – Primer 1 (propen + H₂, nikljev katalizator), utrjevanje olj; hidrogeniranje trojne vezi le v splošni definiciji adicije |
| *Aromatske spojine* – 4.16.7 struktura benzena, prepozna formulo arena | `KEM-SS-3/ogljikovodiki` | da |
| 4.16.8 razlika v reaktivnosti arenov in alkenov | `KEM-SS-3/ogljikovodiki` | da |
| 4.16.9 elektrofilne substitucije na benzenu (nitriranje, sulfoniranje, halogeniranje, alkiliranje, aciliranje), imena produktov | – | manjka |
| *Ogljikovodiki kot gorivo* – 4.16.10 naravni viri, energija, surovina za industrijo, vpliv na okolje | `KEM-SS-3/ogljikovodiki` | delno – zemeljski plin in jeklenka da; nafta, frakcionirna destilacija, surovina za petrokemijo, učinek tople grede manjkajo |
| 4.16.11 enačba popolne oksidacije in računanje | `KEM-SS-1/urejanje-enacb`, `KEM-SS-4/organska-kemija`, `KEM-SS-1/plini` | da |

### 4.17 Halogenirani ogljikovodiki

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Reakcije* – 4.17.1 nukleofilna substitucija (bazična hidroliza, reakcija z amoniakom) | `KEM-SS-3/halogenoalkani-in-alkoholi`, `KEM-SS-3/organske-reakcije` | delno – bazična hidroliza da; reakcija z amoniakom (nastanek amina) manjka |
| 4.17.2 eliminacije vodikovih halogenidov | `KEM-SS-3/halogenoalkani-in-alkoholi`, `KEM-SS-3/organske-reakcije` | da |
| *Lastnosti in uporaba* – 4.17.3 reaktivnost glede na vrsto halogena | – | manjka (jakost vezi C–F do C–I) |
| 4.17.4 lastnosti (vrelišče, topnost v vodi) | `KEM-SS-3/halogenoalkani-in-alkoholi` | da |
| 4.17.5 vpliv na okolje (freoni, ozonska luknja) | `KEM-SS-3/halogenoalkani-in-alkoholi` | da |

### 4.18 Organske kisikove spojine

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Fizikalne lastnosti* – 4.18.1 primerja vrelišča | `KEM-SS-3/halogenoalkani-in-alkoholi`, `KEM-SS-3/karbonilne-spojine`, `KEM-SS-3/karboksilne-kisline-in-derivati` | da |
| 4.18.2 topnost v vodi in nepolarnih topilih | `KEM-SS-3/halogenoalkani-in-alkoholi`, `KEM-SS-3/karbonilne-spojine` | da |
| *Alkoholi in fenoli* – 4.18.3 razlika med alkoholi in fenoli | – | manjka |
| 4.18.4 nastanek alkoholatov in fenolatov (Na, NaOH) | `KEM-SS-3/halogenoalkani-in-alkoholi` | delno – alkoholat z natrijem da; fenolat in razlika pri NaOH manjkata |
| 4.18.5 razvrsti alkohole na primarne, sekundarne, terciarne | `KEM-SS-3/halogenoalkani-in-alkoholi` | da |
| 4.18.6 nastanek etanola s fermentacijo | `KEM-SS-3/karbonilne-spojine` | delno – le omemba v uvodu (etanol in etanal nastajata pri vrenju sladkorjev v sadju); enačba alkoholnega vrenja in vloga kvasovk manjkata |
| 4.18.7 sinteze alkoholov iz kisikovih spojin in alkenov | `KEM-SS-3/organske-reakcije`, `KEM-SS-3/karbonilne-spojine`, `KEM-SS-3/halogenoalkani-in-alkoholi` | da – hidratacija alkena, redukcija karbonila, hidroliza halogenoalkana |
| 4.18.8 dehidriranje alkoholov do etrov oz. alkenov | `KEM-SS-3/halogenoalkani-in-alkoholi` | delno – do alkena da; do etra (presežek alkohola, nižja temperatura) manjka |
| 4.18.9 oksidacija do karbonilnih spojin in karboksilnih kislin | `KEM-SS-3/halogenoalkani-in-alkoholi`, `KEM-SS-3/karbonilne-spojine` | da |
| 4.18.10 substitucija alkoholov do alkil halogenidov | `KEM-SS-3/halogenoalkani-in-alkoholi` | delno – le vrstica v preglednici reakcij (alkohol + HBr → bromoalkan) in povzetek; enačba, primer in vprašanje manjkajo |
| 4.18.11 nastanek estrov | `KEM-SS-3/karboksilne-kisline-in-derivati` | da |
| 4.18.12 pomen in razširjenost metanola, etanola, glicerola | `KEM-SS-3/halogenoalkani-in-alkoholi`, `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – glicerol le kot del maščob; strupenost metanola in uporaba niso obravnavane |
| *Aldehidi in ketoni* – 4.18.13 nastanek iz alkoholov, karboksilnih kislin in alkinov | `KEM-SS-3/karbonilne-spojine` | delno – iz alkoholov da; iz karboksilnih kislin in iz alkinov (hidratacija) manjka |
| 4.18.14 adicije (NaCN/H⁺, NaHSO₃) in adicije z eliminacijo (amini, hidrazini, 2,4-dinitrofenilhidrazin) | – | manjka |
| 4.18.15 produkti oksidacije in redukcije karbonilne skupine | `KEM-SS-3/karbonilne-spojine` | da |
| 4.18.16 oksidacija aldehidov in ketonov, Tollensov in Fehlingov reagent | `KEM-SS-3/karbonilne-spojine` | da |
| *Karboksilne kisline in derivati* – 4.18.17 nastanek iz primarnih alkoholov in aldehidov | `KEM-SS-3/karbonilne-spojine`, `KEM-SS-3/halogenoalkani-in-alkoholi` | da |
| 4.18.18 reakcijske sheme nastanka derivatov in medsebojnih pretvorb | `KEM-SS-3/karboksilne-kisline-in-derivati` | delno – soli, estri, amidi da; kislinski kloridi, anhidridi, nitrili in shema pretvorb manjkajo |
| *Ogljikovi hidrati* – 4.18.19 delitev po številu monosaharidnih enot | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | da |
| 4.18.20 delitev monosaharidov po številu C in vrsti karbonilne skupine (aldoze, ketoze) | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – glukoza z aldehidno in fruktoza s ketonsko skupino da; pojmi aldoza, ketoza, pentoza, heksoza manjkajo |
| 4.18.21 formuli glukoze in fruktoze v ciklični in aciklični obliki | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – opisno; Fischerjeva in Haworthova formula, furanoza in piranoza niso narisane |
| 4.18.22 saharoza in laktoza | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – saharoza (in maltoza) da; laktoza manjka |
| 4.18.23 monosaharidni enoti disaharida, glikozidna vez | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – saharoza in maltoza da; laktoza in zapis glikozidne vezi (1→4, 1→2) manjkata |
| 4.18.24 polisaharidi (škrob, glikogen, celuloza): povezava, oblika verige, pomen | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | da |
| 4.18.25 reakcija s Fehlingovim in Tollensovim reagentom | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | da |
| 4.18.26 produkti hidrolize škroba | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | da |
| 4.18.27 dokaz škroba z jodovico | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – ena poved (modro-črna barva) brez primera ali vprašanja |
| *Lipidi* – 4.18.28 umiljivi in neumiljivi lipidi | – | manjka |
| 4.18.29 struktura trigliceridov in voskov | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – trigliceridi da; voski manjkajo |
| 4.18.30 fizikalne lastnosti trigliceridov | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | da |
| 4.18.31 pomen maščob v prehrani | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – le energijska vrednost; esencialne maščobne kisline, topnost vitaminov manjkajo |
| 4.18.32 občutljivost maščob na kisik, svetlobo, toploto (žarkost) | – | manjka |
| 4.18.33 tetraciklični skelet steroidov | – | manjka |
| 4.18.34 delovanje površinsko aktivnih snovi | – | manjka |
| 4.18.35 mila in detergenti, razlika v strukturi in biološki razgradljivosti | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine`, `KEM-SS-3/karboksilne-kisline-in-derivati` | delno – umiljenje in milo da; detergenti in biorazgradljivost manjkajo |

### 4.19 Organske dušikove spojine

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Amini* – 4.19.1 bazičnost aminov | `KEM-SS-3/dusikove-organske-spojine` | da |
| 4.19.2 reakcije aminov s kislinami | `KEM-SS-3/dusikove-organske-spojine` | da |
| 4.19.3 primarni, sekundarni, terciarni amini | `KEM-SS-3/dusikove-organske-spojine` | da |
| *Proteinogene aminokisline* – 4.19.4 osnovna struktura | `KEM-SS-3/dusikove-organske-spojine` | da |
| 4.19.5 delitev na nevtralne, kisle, bazične, alifatske, aromatske, heterociklične | – | manjka |
| 4.19.6 kisle in bazične lastnosti aminokislin | `KEM-SS-3/dusikove-organske-spojine` | da |
| 4.19.7 dipolarna struktura in agregatno stanje | `KEM-SS-3/dusikove-organske-spojine` | da |
| 4.19.8 struktura v kislem, nevtralnem in bazičnem okolju | `KEM-SS-3/dusikove-organske-spojine` | da – Primer 2 (glicin) |
| 4.19.9 dokazni reakciji: biuretska in ninhidrinski test | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – biuretska da; ninhidrinski test manjka |
| 4.19.10 kromatografija aminokislin | – | manjka |
| 4.19.11 splošna formula D- in L-aminokisline | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine`, `KEM-SS-3/izomerija` | delno – »v živih bitjih le L« v »Bolj natančno«; Fischerjev zapis D/L manjka |
| 4.19.12 izoelektrična točka in ocena njene vrednosti | – | manjka |
| *Proteini* – 4.19.13 reakcijska shema nastanka peptida | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – nastanek peptidne vezi z besedami in računom mas (Primer 3); shema s strukturnimi formulami manjka |
| 4.19.14 iz formule peptida ugotovi aminokisline | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – brez naloge z dano formulo tri- ali tetrapeptida |
| 4.19.15 lastnosti peptidne oz. amidne vezi | `KEM-SS-3/dusikove-organske-spojine`, `KEM-SS-3/karboksilne-kisline-in-derivati` | da |
| 4.19.16 zgradba proteinov (zaporedje, zvijanje, konjugirani proteini) | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – primarna do kvartarna zgradba da; konjugirani proteini (nebeljakovinski del) manjkajo |
| 4.19.17 pomen strukture za funkcijo, denaturacija | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | da |
| 4.19.18 pomen beljakovin in esencialnih aminokislin v prehrani | – | manjka |

### 4.20 Polimeri

| Vsebina ali cilj (kataloga) | Lekcija | Pokritost |
|---|---|---|
| *Polimerizacija* – 4.20.1 adicijska in kondenzacijska polimerizacija, sheme | `KEM-SS-3/polimeri` | da |
| 4.20.2 razlika v strukturi monomerov | `KEM-SS-3/polimeri` | da |
| 4.20.3 iz strukture polimera sklepa na monomere | `KEM-SS-3/polimeri` | da |
| *Naravni polimeri* – 4.20.4 strukturne značilnosti (kavčuk, škrob, celuloza, svila, volna, usnje) | `KEM-SS-3/polimeri`, `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – škrob, celuloza, beljakovine da; kavčuk (poliizopren) manjka |
| *Sintezni polimeri* – 4.20.5 adicijski in kondenzacijski polimeri, lastnosti, uporaba | `KEM-SS-3/polimeri` | delno – PE, PP, PVC, PS, najlon, PET da; teflon in polietri manjkajo |


## Laboratorijske vaje

Katalog (6.2) navaja 37 naslovov; učitelj izbere deset. Laboratorijsko delo se v aplikaciji ne more opraviti, lahko pa
lekcija razloži ozadje, potek, varnost in račun vaje, da učenec pripravi in napiše poročilo. Ocena velja za to ozadje.

| Št. | Vaja (kataloga) | Lekcija | Pokritost ozadja |
|---|---|---|---|
| 1 | Laboratorijski pripomočki za ločevanje zmesi (sublimacija, destilacija, ekstrakcija, filtracija, kromatografija) | `KEM-OS-8/snovi-in-njihove-lastnosti` | OŠ – filtracija in destilacija; sublimacija, ekstrakcija, kromatografija manjkajo |
| 2 | Zgradba atoma – osnovno in vzbujeno stanje (plamenske reakcije, plinske sijalke) | `KEM-SS-1/zgradba-atoma`, `KEM-SS-2/alkalijske-kovine-in-halogeni` | delno – plamenska reakcija (tudi simulacija) da; vzbujeno stanje in črtni spektri sijalk ne |
| 3 | Zgradba atoma in periodni sistem (lastnosti oksidov in hidridov) | `KEM-SS-2/lastnosti-elementov-v-periodnem-sistemu` | delno – oksidi da; hidridi ne |
| 4 | Določitev formule spojine (voda v kristalohidratu) | `KEM-SS-4/organska-kemija` | delno – empirična formula organske spojine; kristalohidrat manjka |
| 5 | Molska prostornina plina (elektroliza vode v Hofmannovem aparatu) | `KEM-SS-1/plini`, `KEM-SS-2/galvanski-cleni-in-elektroliza` | delno – Hofmannov aparat le omenjen, račun manjka |
| 6 | Stehiometrija (termični razkroj KMnO₄, titracija vitamina C) | `KEM-SS-1/stehiometrija`, `KEM-SS-2/redoks-reakcije` | da |
| 7 | Kemijska reakcija in energija (Fe + CuSO₄) | `KEM-SS-1/energija-pri-reakcijah` | delno – kalorimetrični račun (Q = m·c·ΔT) manjka |
| 8 | Molekulske sile (izhlapevanje, izparilna toplota) | `KEM-SS-1/medmolekulske-sile` | da |
| 9 | Lastnosti trdnih snovi (tališče, raztapljanje, prevodnost) | `KEM-SS-1/kemijske-vezi` | delno – vrste kristalov in prevodnost raztopin nepopolni (4.3, 4.9.10) |
| 10 | Priprava raztopin (w, γ, c, redčenje, koncentriranje, nasičene raztopine, gostota) | `KEM-SS-1/raztopine` | delno – nasičene raztopine, koncentriranje, gostota manjkajo |
| 11 | Vplivi na hitrost reakcije – kvalitativno | `KEM-SS-2/hitrost-reakcij` | da |
| 12 | Hitrost reakcije – kvantitativno (Na₂S₂O₃ + HCl, razpad H₂O₂) | `KEM-SS-2/hitrost-reakcij` | da |
| 13 | Kemijsko ravnotežje (vplivi na položaj) | `KEM-SS-2/kemijsko-ravnotezje` | da |
| 14 | Kisline in baze v vodnih raztopinah (pH, protoliza ionov soli, indikatorji) | `KEM-SS-2/ph`, `KEM-SS-2/sibke-kisline-in-baze`, `KEM-SS-2/titracija` | delno – protoliza soli, lakmus, naravni indikatorji manjkajo |
| 15 | Nevtralizacijska titracija | `KEM-SS-2/titracija` | da |
| 16 | Ionske reakcije (nastanek oborin) | `KEM-SS-1/urejanje-enacb`, `KEM-SS-2/elementi-v-bioloskih-sistemih` | delno – AgCl pri dvojni zamenjavi in obarjanje FeS z računom; pravila topnosti in ionski zapis manjkajo |
| 17 | Prevodnost raztopin (elektroliti, neelektroliti) | `KEM-SS-1/kemijske-vezi` | delno – raztopina soli prevaja, sladkorja ne; pojma elektrolit in neelektrolit ter močni in šibki elektroliti manjkajo |
| 18 | Redoks reakcije (redoks titracija) | `KEM-SS-2/redoks-reakcije` | da – permanganat in železo |
| 19 | Redoks vrsta (kovine, vodik, halogeni) | `KEM-SS-2/galvanski-cleni-in-elektroliza`, `KEM-SS-2/redoks-reakcije`, `KEM-SS-2/alkalijske-kovine-in-halogeni` | da |
| 20 | Galvanski člen | `KEM-SS-2/galvanski-cleni-in-elektroliza` | da |
| 21 | Elektroliza vodnih raztopin (KI, NaNO₃, H₂SO₄) | `KEM-SS-2/galvanski-cleni-in-elektroliza` | delno – napoved produktov, ko pri elektrodi tekmuje voda, manjka |
| 22 | Koordinacijske spojine (Co, Ni, Cu, Ag kompleksi) | – | manjka |
| 23 | Lastnosti tehnološko pomembnih anorganskih spojin (H₂SO₄, NH₃, HNO₃, H₃PO₄) | `KEM-SS-2/ph`, `KEM-SS-2/sibke-kisline-in-baze` | delno – H₂SO₄ in HNO₃ kot močni kislini, NH₃ kot šibka baza; posebne lastnosti (oksidativnost, higroskopnost) in H₃PO₄ manjkajo |
| 24 | Alkalijske kovine in halogeni | `KEM-SS-2/alkalijske-kovine-in-halogeni` | da |
| 25 | Določanje neznane anorganske soli | – | manjka |
| 26 | Analiza vode in prsti (pH, ioni, kisik, trdota vode) | – | manjka |
| 27 | Vpliv strukture na lastnosti organskih spojin | `KEM-SS-3/halogenoalkani-in-alkoholi`, `KEM-SS-3/karbonilne-spojine`, `KEM-SS-3/izomerija` | da |
| 28 | Tipi organskih reakcij | `KEM-SS-3/organske-reakcije` | da |
| 29 | Ogljikovodiki (priprava in lastnosti metana, etena, etina) | `KEM-SS-3/ogljikovodiki` | delno – lastnosti da; laboratorijska priprava (npr. etin iz CaC₂) manjka |
| 30 | Alkoholi (lastnosti in reaktivnost) | `KEM-SS-3/halogenoalkani-in-alkoholi` | da |
| 31 | Dokazne reakcije aldehidov, ketonov in ogljikovih hidratov | `KEM-SS-3/karbonilne-spojine`, `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | da |
| 32 | Lipidi (sinteza mila) | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine`, `KEM-SS-3/karboksilne-kisline-in-derivati` | delno – umiljenje da; delovanje mila (micele) manjka |
| 33 | Aminokisline (dokazne reakcije, kromatografija) | `KEM-SS-3/dusikove-organske-spojine` | delno – lastnosti da; ninhidrin in kromatografija manjkata |
| 34 | Beljakovine (denaturacija, biuretska reakcija) | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | da |
| 35 | Sinteza organske spojine (aspirin, paracetamol, metiloranž, estri) | `KEM-SS-3/karboksilne-kisline-in-derivati` | delno – esterifikacija in izkoristek da; aspirin, paracetamol, azo barvilo ne |
| 36 | Kvalitativno določanje neznane organske spojine | lekcije KEM-SS-3 | delno – posamezni dokazi (bromovica, dikromat, Fehling, Tollens, jodovica, biuret) raztreseni; sistematičen postopek in dokaz fenolov manjkata |
| 37 | Kvalitativno razlikovanje živil (reducenti, barvila, škrob, beljakovine) | `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine` | delno – jodovica, Fehling, biuret da; barvila ne |

Povzetek: da 15, delno 18, manjka 3, OŠ 1.

**Laboratorijske veščine (6.1, 6.3).** Navajanje virov in načrtovanje preprostega poskusa, izbrane tehnike, opazovanje
in zapis meritev, kritično vrednotenje rezultatov in virov napak, predlogi izboljšav, varnost in odnos do okolja ter
sestava poročila (naslov, cilj, inventar, opis in varnostni ukrepi, meritve, računi, rezultati, ovrednotenje): nobena
lekcija tega ne razloži. Ker poročila nosijo 20 % ocene, je to vrzel, ki jo pokrije predlagana lekcija
`KEM-SS-4/laboratorijske-vaje-in-porocila`.


## Vrzeli za 4. letnik

Predlog zapira vse postavke z oceno »manjka« in »delno«. Prednost je določena po teži na izpitu (pola 1 ima 22 nalog
iz splošne in anorganske ter 13 iz organske kemije), po tem, ali gre za računske cilje (pola 2), in po številu
odprtih postavk. Kjer učni načrt snov jasno uči prej (1. ali 2. letnik), je lekcija predlagana v tem letniku;
snov za pripravo na maturo in anorganska kemija po skupinah gresta v KEM-SS-4. Velikost: 6–12 postavk na lekcijo,
kot obstoječe lekcije. Vse nove lekcije pišeta in pregledata Opus (ali Fable), preverba s `scripts/check-lesson.js`.

### Prednost 1 (veliko izpitnih nalog, računski cilji)

1. **`KEM-SS-1/topnost-in-sestava-raztopin`** – *Topnost in sestava raztopin* (nova lekcija). Zapira 4.6.1, 4.6.2,
   4.6.3, 4.6.4, 4.6.5, 4.6.6, 4.6.8, 4.6.9, 4.6.10, 4.6.11 (10 postavk) ter ozadje vaje 10. Vsebina: topnost in
   diagram topnosti, nasičena raztopina, topnost ↔ masni delež, pretvorbe w ↔ c ↔ γ z gostoto, koncentriranje in
   mešanje raztopin, topnost plinov (T, p, kisik v vodi, gazirane pijače), hidratacija ionov in molekul.
   `KEM-SS-1/raztopine` ostane uvodna lekcija.
2. **`KEM-SS-2/ionske-reakcije-in-elektroliti`** – *Elektroliti in ionske reakcije* (nova lekcija). Zapira 4.9.3,
   4.9.9, 4.9.10, 4.9.20, 4.9.21, 4.9.22, 4.9.23, 4.9.24, 4.9.13 (lakmus) (9 postavk) ter ozadje vaj 14, 16, 17.
   Vsebina: elektrolit in prevodnost, trije vzroki ionskih reakcij, pravila topnosti, ionski zapis z (aq)/(s),
   računi z oborino, protoliza ionov soli (NH₄Cl, Na₂CO₃, CH₃COONa), imena oksokislin, hidrogensoli, kristalohidratov.
3. **Dopolnitev `KEM-SS-1/energija-pri-reakcijah`** – *Standardne tvorbene entalpije* (dopolnitev obstoječe lekcije,
   nov blok in rešeni primer). Zapira 4.5.13, 4.5.14, 4.5.15, 4.5.16, 4.5.18 (5 postavk) ter ozadje vaje 7
   (kalorimetrija Q = m·c·ΔT). Če lekcija s tem preseže dolžino, nova lekcija `KEM-SS-1/standardne-entalpije`.
4. **`KEM-SS-1/oblika-in-polarnost-molekul`** – *Oblika molekul in sile med njimi* (nova lekcija). Zapira 4.3.3,
   4.3.4, 4.3.5, 4.3.6, 4.3.8, 4.3.9, 4.3.10 (7 postavk). Vsebina: model odboja elektronskih parov za BeCl₂, BF₃, CH₄,
   NH₃, H₂O, CO₂, koti, vezni in nevezni pari, energija in dolžina enojne, dvojne, trojne vezi, indukcijske sile in
   polarizabilnost, pravila imen binarnih spojin. Hibridizacija ostane v organskem delu (predlog 11).
5. **`KEM-SS-1/kristali-in-trdne-snovi`** – *Kristali in trdne snovi* (nova lekcija). Zapira 4.3.13, 4.3.14, 4.3.15,
   4.3.16, 4.3.17, 4.3.19, 4.3.20, 4.3.21, 4.3.22 (9 postavk) ter ozadje vaje 9. Vsebina: kristalinične in amorfne
   snovi, ionski, molekulski, kovalentni, kovinski kristal, uvrščanje po formuli, alotropija (diamant, grafit),
   koordinacijsko število, NaCl proti CsCl.
6. **`KEM-SS-2/elektroliza-in-faradayev-zakon`** – *Elektroliza in Faradayev zakon* (nova lekcija; elektroliza se
   uči v 2. letniku skupaj z redoks reakcijami). Zapira 4.10.5, 4.10.7, 4.10.8 (3 postavke) ter ozadje vaj 5 in 21.
   Vsebina: elektroliza talin, tekmovanje vode pri raztopinah (NaCl, KI, NaNO₃, H₂SO₄), Faradayev zakon z računi,
   baterije, svinčev akumulator, gorivna celica. Majhno število postavk, a veliko računskih nalog za polo 2;
   industrijska uporaba (Al, klor) je v predlogu 7.

### Prednost 2 (anorganska kemija po skupinah, sklop, ki ga zdaj skoraj ni)

7. **`KEM-SS-4/anorganske-snovi-v-industriji-in-okolju`** – *Anorganske snovi v industriji in okolju* (nova lekcija).
   Zapira 4.13.1, 4.13.2, 4.13.3, 4.13.4, 4.13.5, 4.13.6, 4.13.7, 4.13.8, 4.12.5, 4.7.7 (10 postavk) ter ozadje vaj
   23 in 26. Vsebina: Al iz boksita (Bayer, elektroliza taline s kriolitom), kloralkalna elektroliza, H₂SO₄
   (kontaktni postopek), NH₃ (Haber-Bosch), HNO₃ (Ostwald), H₃PO₄ in fosfati, NPK gnojila, evtrofikacija in NOₓ,
   klorove oksokisline in soli, avtomobilski katalizator, silicij, steklo, cement, nanotehnologija.
8. **`KEM-SS-4/prehodni-elementi-in-koordinacijske-spojine`** – *Prehodni elementi in koordinacijske spojine* (nova
   lekcija). Zapira 4.11.1 (področja s, p, d, f), 4.11.2, 4.11.3, 4.2.13 (zaporedne ionizacijske energije, ioni
   Fe²⁺/Fe³⁺, Cu⁺/Cu²⁺) (4 postavke, a obsežna tema) ter ozadje vaj 22 in 25. Vsebina: lega in lastnosti prehodnih
   kovin, več oksidacijskih števil, barve, centralni ion, ligandi, koordinacijsko število v kompleksu, branje formul in
   imen ([Cu(NH₃)₄]²⁺, [Fe(CN)₆]³⁻, [Ag(NH₃)₂]⁺ v Tollensovem reagentu), dokazovanje kationov s kompleksi.
9. **Dopolnitev `KEM-SS-2/alkalijske-kovine-in-halogeni`** – *Vodikovi halogenidi in lastnosti alkalijskih kovin*
   (dopolnitev). Zapira 4.12.3, 4.12.4, 4.12.8 (3 postavke; viri halogenov in elektroliza klora so v predlogu 7):
   primerjava tališč in gostot s Fe in Cu, vprašanje o barvah plamena, H₂ + X₂, HF kot šibka in HCl, HBr, HI kot
   močne kisline. Enačbe peroksida in superoksida z vodo (opomba k 4.12.2).
10. **Dopolnitev `KEM-SS-1/zgradba-atoma` in `KEM-SS-1/periodni-sistem`** – *Konfiguracije in velikost ionov*
    (dopolnitev). Zapira 4.2.7 (krajši zapis z žlahtnim plinom), 4.2.9 (osnovno in vzbujeno stanje, ozadje vaje 2),
    4.2.12 (polmer kationa in aniona) (3 postavke).

### Prednost 3 (organska kemija)

11. **`KEM-SS-3/zgradba-organskih-molekul-in-mehanizmi`** – *Hibridizacija, formule in mehanizmi* (nova lekcija na
    začetku organskega dela). Zapira 4.14.2, 4.14.3, 4.14.4, 4.14.6 (etri, nitrili, substituirani benzeni), 4.14.7,
    4.15.1, 4.15.2, 4.15.3, 4.15.4, 4.15.5 (10 postavk). Vsebina: sp³, sp², sp, delitev skeletov, skeletne in empirične
    formule, funkcionalni skupini nitro in ciano, homolitska in heterolitska prekinitev, karbokation, karboanion,
    radikal, substrat, reagent, intermediat, zapis reakcijske sheme.
12. **`KEM-SS-3/areni-in-fenoli`** – *Areni in fenoli* (nova lekcija). Zapira 4.16.9, 4.18.3, 4.18.4 ter dopolni
    4.16.3, 4.16.4, 4.16.5, 4.16.10, 4.17.1, 4.17.3 (9 postavk) in ozadje vaje 29. Vsebina: pet elektrofilnih
    substitucij na benzenu in imena produktov, fenol proti alkoholu, fenolati, dokaz s FeCl₃; v drugem delu ogljikovodiki
    in halogenoalkani: nereaktivnost alkanov, selektivnost radikalskega halogeniranja, adicije na alkine in
    cikloalkene, nafta in učinek tople grede, reakcija halogenoalkana z amoniakom in reaktivnost po vrsti halogena. Če je preobsežna, se drugi del razdeli kot dopolnitev `KEM-SS-3/ogljikovodiki` in
    `KEM-SS-3/halogenoalkani-in-alkoholi`.
13. **Dopolnitev `KEM-SS-3/karbonilne-spojine` in `KEM-SS-3/karboksilne-kisline-in-derivati`** – *Nukleofilne
    adicije in derivati kislin* (dopolnitev obeh). Zapira 4.18.6, 4.18.8, 4.18.12, 4.18.13, 4.18.14, 4.18.18
    (6 postavk). Vsebina: fermentacija, etri iz alkoholov, pomen metanola, etanola, glicerola, nastanek karbonilov iz
    kislin in alkinov, adicije HCN in NaHSO₃, reakcija s hidrazini in 2,4-DNFH, kislinski kloridi, anhidridi, nitrili,
    shema medsebojnih pretvorb.
14. **`KEM-SS-3/ogljikovi-hidrati-in-lipidi`** – *Ogljikovi hidrati in lipidi* (nova lekcija, nadomesti prva dva dela
    `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine`). Zapira 4.18.20, 4.18.21, 4.18.22, 4.18.23, 4.18.27, 4.18.28,
    4.18.29, 4.18.31, 4.18.32, 4.18.33, 4.18.34, 4.18.35 (12 postavk) ter ozadje vaj 32 in 37. Vsebina: aldoze, ketoze,
    Fischerjeva in Haworthova formula, furanoza, piranoza, laktoza, glikozidne vezi, dokaz škroba z jodovico (vprašanje),
    umiljivi in neumiljivi lipidi,
    voski, steroidi, žarkost, površinsko aktivne snovi (micele), mila proti detergentom in biorazgradljivost.
15. **`KEM-SS-3/aminokisline-in-beljakovine`** – *Aminokisline in beljakovine* (nova lekcija, nadomesti tretji del
    `KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine`; obstoječa lekcija se nato skrči na pregled biomolekul ali se
    umakne – odloči j). Zapira 4.19.5, 4.19.9, 4.19.10, 4.19.11, 4.19.12, 4.19.13, 4.19.14, 4.19.16, 4.19.18 (9 postavk)
    ter ozadje vaj 33 in 34. Vsebina: delitev aminokislin, izoelektrična točka, ninhidrin, papirna kromatografija (Rf),
    D/L v Fischerjevem zapisu, shema nastanka in hidrolize peptida, konjugirani proteini, esencialne aminokisline.
16. **Dopolnitev `KEM-SS-3/polimeri`** – *Kavčuk, teflon, polietri* (manjša dopolnitev). Zapira 4.20.4, 4.20.5
    (2 postavki).

### Prednost 4 (laboratorij in priprava na izpit)

17. **`KEM-SS-1/varno-eksperimentalno-delo`** – *Varno eksperimentalno delo in osnove toksikologije* (nova lekcija;
    sklop 4.1 se po učnem načrtu uči na začetku 1. letnika). Zapira 4.1.1, 4.1.2, 4.1.3, 4.1.4, 4.1.5, 4.1.6
    (6 postavk) ter ozadje vaje 1. Vsebina: spremenljivka in konstanta, pripomočki in tehnike (tehtanje, merjenje
    prostornine, Bunsenov gorilnik, ločevanje zmesi, kromatografija, ekstrakcija), GHS, H- in P-stavki, odmerek,
    izpostavljenost, LD50.
18. **`KEM-SS-4/laboratorijske-vaje-in-porocila`** – *Laboratorijske vaje in poročilo za maturo* (nova lekcija).
    Zapira veščine iz 6.1 in sestavo poročila iz 6.3 ter ozadje vaj 4, 25, 26, 35, 36: načrt poskusa in viri,
    zapis meritev, napake in negotovost, kritično ovrednotenje, kvalitativna analiza (neznana sol, neznana organska
    spojina), trdota vode, primer celotnega poročila.
19. **Drobne dopolnitve obstoječih lekcij** (brez nove lekcije): `KEM-SS-1/mnozina-snovi` (4.4.1 Mr proti M),
    `KEM-SS-1/plini` (4.4.5 lastnosti plinov), `KEM-SS-1/urejanje-enacb` (4.5.2 delčni prikazi, 4.5.5 agregatna
    stanja, 4.5.6 večatomni elementi), `KEM-SS-2/kemijsko-ravnotezje` (4.8.5 homogeno in heterogeno, 4.8.10 delčni
    prikaz, 4.8.11 okolje in organizmi), `KEM-SS-2/hitrost-reakcij` (4.7.6 encimi z vprašanjem; homogena in
    heterogena kataliza, stopnje reakcije kot opombi k 4.7.5 in 4.7.8), `KEM-SS-2/sibke-kisline-in-baze` (4.9.7
    delčni prikaz), `KEM-SS-3/halogenoalkani-in-alkoholi` (4.18.10 enačba alkohol + HX z vprašanjem). Skupaj
    11 postavk.
20. **`KEM-SS-4/mesane-maturitetne-naloge`** – *Mešane maturitetne naloge* (nova lekcija). **Manjka:** fizika ima
    `FIZ-SS-4/mesane-maturitetne-naloge`, kemija nima nič podobnega. Tri obstoječe lekcije KEM-SS-4
    (`splosna-in-anorganska-kemija`, `organska-kemija`, `kemijsko-racunanje`) so tematski pregledi s po 7 vprašanji,
    ne posnemajo pa zgradbe izpita. Predlog: naloge v obliki pole 1 (izbirni tip, razmerje 22 : 13 med splošno in
    anorgansko ter organsko kemijo, vse vsebine kataloga) in pole 2 (zaprti in polodprti tip: dopolnjevanje,
    nadomeščanje napačnih trditev, urejanje, reakcijske sheme, interpretacija grafa, računi po 2–6 točk), z navedbo
    sklopa kataloga pri vsaki nalogi in pregledom, iz katerega sklopa je bila napaka. Naloge morajo biti izvirne
    (ne prepisane iz poglavja 5 kataloga ali iz izpitnih pol RIC).

### Učinek predloga

Ob izvedbi predlogov 1–19 se pokritost dvigne s 115 »da« na 242 od 244: vse »manjka« in »delno« ter postavki 4.1.3 in
4.1.4 (zdaj le OŠ, zapre ju predlog 17). Ostaneta 4.5.1 in 4.5.4 (kemijska reakcija kot snovna sprememba), ki ju
zadošča pokriti v OŠ ali z enim stavkom v `KEM-SS-1/urejanje-enacb`. Najprej naj gredo predlogi 1, 2, 3 in 6 (računske naloge za polo 2), nato 7 in 8 (sklopa
4.11 in 4.13 sta zdaj skoraj prazna), nato 4 in 5 ter organski del. Pred pisanjem lekcij v KEM-SS-4 velja preveriti,
ali `server/curriculum-data.js` za KEM-SS-4 pričakuje točno tri lekcije (vrstni red in dolžina poti učenja).
