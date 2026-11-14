# Matura iz matematike: katalog in lekcije

Vir: *Predmetni izpitni katalog za splošno maturo 2026 – matematika* (RIC, izvirni PDF `M-MAT-2026.pdf` s strani
<https://www.ric.si/splosna-matura/predmeti/matematika/>; po navedbi RIC velja tudi za maturo 2027 in 2028),
poglavje 4 »Izpitne vsebine in cilji«. Vsebine in cilji so povzeti po vrsti in z besedami kataloga; ta preglednica
ni nadomestilo za katalog.

**Raven.** Katalog z znakom ⇨ označi vsebine in cilje, ki se preverjajo samo na višji ravni. Tu: **OR+VR** = osnovna in
višja raven, **VR** = samo višja raven. Znak je bil pobran iz PDF-ja (pisava Wingdings, 87 oznak) in preverjen na
sliki strani.

**Lekcija.** Pot do lekcije v `content/lessons/`. »manjka« = vsebina ni razložena v nobeni lekciji MAT-SS; »delno« =
omenjena, a ne razložena v obsegu kataloga (opomba pove, kaj manjka); »OŠ« = snov osnovne šole, ki je lekcije MAT-SS ne
razlagajo posebej.

**Izpit (poglavje 3).** Shema je na obeh ravneh enaka: izpitna pola 1 (90 min, brez računala, 40 %), izpitna pola 2
(90 min, z osnovnim računalom, 40 %), obe s prilogo s formulami; ustni izpit (3 vprašanja po 6 točk + 2 točki za
korektno matematično izražanje, 20 %). Osnovna raven: na vsaki poli 8 kratkih nalog (do 3 točke, skupaj 20) in 6
krajših strukturiranih nalog (5–8 točk, skupaj 40). Višja raven: na vsaki poli 6 krajših strukturiranih nalog
(5–8 točk, skupaj 40) in 2 strukturirani nalogi (9–11 točk, skupaj 20).


## Povzetek pokritosti

Postavk (vsebin in ciljev): 513. Pokrito (»da«): 432, delno: 76, manjka: 0, snov OŠ: 5. Od tega samo višja raven: 87 postavk (da 75, delno 12, manjka 0).

Pokritost sta ocenila dva pregledovalca (Opus) z branjem lekcij (13. 11. 2026); »delno« pove, kaj manjka. Postavke z opombo »C3« so dopolnjene z novimi lekcijami ali dopolnitvami lekcij (točka C3, vsi štirje letniki: 14. 11. 2026); opomba »C4« pomeni dopolnitev ob nalogah za maturo.

### Manjka

Nobena postavka kataloga ne manjka več: zadnje so dopolnjene v točki C3 (14. 11. 2026).

## Oznaka višje ravni v lekcijah

Del lekcije, ki ga katalog preverja samo na višji ravni, ima v naslovu bloka, primera ali razdelka »Drugače« oznako »(višja raven)« (`**5. Enačbe s parametrom (višja raven).**`, `### Primer 3 (težji, višja raven)`, `## Drugače: Kot zgodba (višja raven)`). Vprašanje v »Preveri se«, alineja ali odstavek se začne z »(višja raven)«. Lekcija, ki je v celoti snov višje ravni (`MAT-SS-4/matematicna-indukcija`), ima to zapisano v prvi vrstici. Normalna porazdelitev je po katalogu 2026 za obe ravni, zato v `MAT-SS-4/statistika` nima oznake. Ustno spraševanje oznako izpusti (`server/ustno.js`, `brezOznakeRavni`).

## Po sklopih

### 4.1 Osnove logike

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Izjave in povezave med njimi | OR+VR | `MAT-SS-1/osnove-logike` | da |
| Sestavljene izjave | OR+VR | `MAT-SS-1/osnove-logike` | da |
| Vrstni red operacij | OR+VR | `MAT-SS-1/osnove-logike` | da – blok 7: prednost ¬, ∧, ∨, ⇒, ⇔ |
| Tavtologija | OR+VR | `MAT-SS-1/osnove-logike` | da |
| Enakovredne izjave | OR+VR | `MAT-SS-1/osnove-logike` | da |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| zapiše izjavo | OR+VR | `MAT-SS-1/osnove-logike` | da |
| določi logično vrednost izjave | OR+VR | `MAT-SS-1/osnove-logike` | da |
| zapiše sestavljeno izjavo s simboli | OR+VR | `MAT-SS-1/osnove-logike` | da |
| izračuna logično vrednost sestavljene izjave pri vseh vrednostih enostavnih izjav | OR+VR | `MAT-SS-1/osnove-logike` | da |
| ugotovi enakovrednost dveh izjav | OR+VR | `MAT-SS-1/osnove-logike` | da |


### 4.2 Množice

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Osnovni pojmi: element, množica, pripadnost elementa množici, podmnožica, prazna množica, univerzalna množica | OR+VR | `MAT-SS-1/mnozice` | da |
| Simbolni zapisi | OR+VR | `MAT-SS-1/mnozice` | da |
| Vennov diagram | OR+VR | `MAT-SS-1/mnozice` | da |
| Presek, unija, razlika, komplement množic | OR+VR | `MAT-SS-1/mnozice` | da |
| Lastnosti operacij z množicami | **VR** | `MAT-SS-1/mnozice` | da – blok 6 Pravila; De Morgan tudi v premisli (vr. 59) in Primeru 2 |
| Potenčna množica | OR+VR | `MAT-SS-1/mnozice`, `MAT-SS-1/kartezicni-produkt-in-potencna-mnozica` | da – C3 (14. 11. 2026) |
| Kartezični produkt množic | OR+VR | `MAT-SS-1/kartezicni-produkt-in-potencna-mnozica` | da – C3 (14. 11. 2026) |
| Moč množice | OR+VR | `MAT-SS-1/mnozice` | da |
| Moč potenčne množice | **VR** | `MAT-SS-1/mnozice`, `MAT-SS-1/kartezicni-produkt-in-potencna-mnozica` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| pozna osnovne pojme in s simboli označuje odnose med elementi in množicami | OR+VR | `MAT-SS-1/mnozice` | da |
| uporablja različne načine predstavitev množic | OR+VR | `MAT-SS-1/mnozice` | da – naštevanje, opis z lastnostjo, Vennov diagram |
| računa z množicami | OR+VR | `MAT-SS-1/mnozice` | da |
| poišče potenčno množico končne množice | OR+VR | `MAT-SS-1/mnozice`, `MAT-SS-1/kartezicni-produkt-in-potencna-mnozica` | da – C3 (14. 11. 2026) |
| nariše graf kartezičnega produkta dveh množic | OR+VR | `MAT-SS-1/kartezicni-produkt-in-potencna-mnozica` | da – C3 (14. 11. 2026) |
| uporablja formule za moč unije dveh ali treh množic ter moč kartezičnega produkta končnih množic | OR+VR | `MAT-SS-1/mnozice`, `MAT-SS-1/kartezicni-produkt-in-potencna-mnozica` | da – C3 (14. 11. 2026) |


### 4.3.1 Naravna števila in cela števila

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Računske operacije in njihove lastnosti | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | delno – zakoni (zamenljivost, združevalnost) niso izrecno navedeni |
| Praštevila in sestavljena števila | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | da |
| Matematična indukcija | **VR** | `MAT-SS-4/matematicna-indukcija` | da – cela lekcija |
| Desetiški mestni zapis | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | OŠ – uporabljen pri merilih deljivosti (7316 = 73·100 + 16) |
| Kriteriji deljivosti z 2, 3, 4, 5, 6, 8, 9 in 10 | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | da |
| Relacija deljivosti | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | da |
| Največji skupni delitelj in najmanjši skupni večkratnik | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | da |
| Osnovni izrek o deljenju | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | da |
| Evklidov algoritem in zveza med D in v | **VR** | `MAT-SS-1/naravna-in-cela-stevila` | da – blok 8, Primer 4, Bolj natančno; D·v = a·b tudi v bloku 7 |
| Desetiški številski sestav | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | OŠ |
| Dvojiški številski sestav | **VR** | `MAT-SS-1/dvojiski-stevilski-sestav` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| pozna pomen naravnih števil in razloge za vpeljavo celih števil ter primere njihove uporabe | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | da |
| uporablja računske operacije v množici naravnih in celih števil in na primerih utemelji njihove lastnosti | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | delno – lastnosti operacij niso utemeljene na primerih |
| predstavi naravna in cela števila na številski premici | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | da |
| induktivno sklepa, posplošuje, posplošitev dokaže ali ovrže in dokazuje z matematično indukcijo | **VR** | `MAT-SS-4/matematicna-indukcija` | da – posploševanje (Primer 3) in ovržba (vprašanja) vključeni |
| uporablja desetiški mestni zapis celega števila | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | OŠ |
| utemelji in uporablja osnovne kriterije za deljivost | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | da – utemeljitev za 4 (premisli) in 9 (Bolj natančno) |
| pozna in uporablja lastnosti relacije deljivosti | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | da |
| določi največji skupni delitelj in najmanjši skupni večkratnik dveh ali več celih števil | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | da |
| uporablja osnovni izrek o deljenju celih števil | OR+VR | `MAT-SS-1/naravna-in-cela-stevila` | da |
| uporablja Evklidov algoritem za iskanje največjega skupnega delitelja | **VR** | `MAT-SS-1/naravna-in-cela-stevila` | da |
| v problemskih nalogah uporablja zvezo D·v = a·b | **VR** | `MAT-SS-1/naravna-in-cela-stevila` | da – Primer 4 in Primer 2; besedilne naloge z D·v ni |
| pretvarja med desetiškim in dvojiškim številskim sestavom | **VR** | `MAT-SS-1/dvojiski-stevilski-sestav` | da – C3 (14. 11. 2026) |


### 4.3.2 Racionalna števila

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Računske operacije in njihove lastnosti | OR+VR | `MAT-SS-1/racionalna-stevila` | delno – zakoni računskih operacij niso izrecno navedeni |
| Desetiški zapis racionalnih števil | OR+VR | `MAT-SS-1/racionalna-stevila` | da |
| Deleži in odstotki | OR+VR | `MAT-SS-1/racionalna-stevila`, `MAT-SS-4/obrestni-racun` | delno – deleži da; odstotki le mimogrede (obresti) |
| Procentni račun | OR+VR | `MAT-SS-4/obrestni-racun` | delno – osnovni procentni račun (osnova, delež, povečanje) ni posebej razložen |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| pozna in utemelji razloge za vpeljavo racionalnih števil | OR+VR | `MAT-SS-1/racionalna-stevila`, `MAT-SS-1/naravna-in-cela-stevila` | da |
| predstavi racionalna števila na številski premici | OR+VR | `MAT-SS-1/racionalna-stevila` | da – blok 6 Urejenost |
| računa z racionalnimi števili | OR+VR | `MAT-SS-1/racionalna-stevila` | da |
| uporablja in utemelji decimalni zapis racionalnega števila ter razlikuje med desetiškimi in nedesetiškimi ulomki | OR+VR | `MAT-SS-1/racionalna-stevila` | da – blok 4: imenovalec le 2 in 5 |
| računa z decimalnimi števili | OR+VR | `MAT-SS-1/racionalna-stevila` | OŠ |
| uporablja deleže in odstotke ter procentni račun v nalogah iz vsakdanjega življenja in spretno uporablja računalo | OR+VR | `MAT-SS-4/obrestni-racun` | delno – odstotki le pri obrestih; uporaba računala ni prikazana |


### 4.3.3 Realna števila

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Iracionalna števila | OR+VR | `MAT-SS-1/realna-stevila-in-intervali` | da |
| Realna števila na številski premici | OR+VR | `MAT-SS-1/realna-stevila-in-intervali` | da |
| Intervali | OR+VR | `MAT-SS-1/realna-stevila-in-intervali` | da |
| Končni decimalni približki | OR+VR | `MAT-SS-1/realna-stevila-in-intervali`, `MAT-SS-1/priblizki-ter-absolutna-in-relativna-napaka` | da – C3 (14. 11. 2026) |
| Absolutna vrednost realnega števila in njene lastnosti | OR+VR | `MAT-SS-1/realna-stevila-in-intervali` | da |
| Enačbe z absolutno vrednostjo | OR+VR | `MAT-SS-1/realna-stevila-in-intervali` | delno – pravilo \|x−c\| = r razloženo, brez rešenega primera ali naloge |
| Neenačbe z absolutno vrednostjo | **VR** | `MAT-SS-1/realna-stevila-in-intervali` | da – blok 5, Primer 3, oba Drugače, vprašanji |
| Absolutna in relativna napaka | OR+VR | `MAT-SS-1/priblizki-ter-absolutna-in-relativna-napaka` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| pozna in utemelji razloge za vpeljavo realnih števil | OR+VR | `MAT-SS-1/realna-stevila-in-intervali` | da |
| navede nekaj primerov iracionalnih števil | OR+VR | `MAT-SS-1/realna-stevila-in-intervali` | da |
| konstruira nekatere kvadratne korene kot primere iracionalnih števil z uporabo Pitagorovega izreka | OR+VR | `MAT-SS-1/realna-stevila-in-intervali`, `MAT-SS-2/koreni` | delno – le √2 kot diagonala; konstrukcije drugih korenov ni |
| interpretira številsko premico kot realno os | OR+VR | `MAT-SS-1/realna-stevila-in-intervali` | da |
| zaokrožuje decimalna števila | OR+VR | `MAT-SS-1/osnovni-geometrijski-pojmi` | OŠ – zaokroževanje le mimogrede (vprašanje o stopinjah) |
| poveže geometrijsko in analitično predstavitev absolutne vrednosti realnih števil | OR+VR | `MAT-SS-1/realna-stevila-in-intervali` | da |
| poenostavlja izraze z absolutno vrednostjo ter reši preproste enačbe | OR+VR | `MAT-SS-1/realna-stevila-in-intervali` | delno – izrazi s spremenljivko in reševanje enačb brez primerov |
| reši preproste neenačbe z absolutno vrednostjo realnih števil | **VR** | `MAT-SS-1/realna-stevila-in-intervali` | da |
| primerja pomen absolutne in relativne napake ter oceni absolutno in relativno napako vsote, razlike, produkta in kvocienta dveh podatkov | OR+VR | `MAT-SS-1/priblizki-ter-absolutna-in-relativna-napaka` | da – C3 (14. 11. 2026) |


### 4.3.4 Kompleksna števila

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Geometrijska predstavitev kompleksnih števil v ravnini | OR+VR | `MAT-SS-2/kompleksna-stevila` | da |
| Računske operacije in njihove lastnosti | OR+VR | `MAT-SS-2/kompleksna-stevila` | da |
| Reševanje enačb z realnimi koeficienti | OR+VR | `MAT-SS-2/kvadratna-enacba`, `MAT-SS-2/kompleksna-stevila` | da |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| pozna in utemelji razloge za vpeljavo kompleksnih števil | OR+VR | `MAT-SS-2/kompleksna-stevila` | da |
| predstavi kompleksno število v kompleksni ravnini | OR+VR | `MAT-SS-2/kompleksna-stevila` | da |
| analitično in grafično sešteva in odšteva kompleksna števila | OR+VR | `MAT-SS-2/kompleksna-stevila` | da |
| množi kompleksna števila | OR+VR | `MAT-SS-2/kompleksna-stevila` | da |
| izpelje pravilo za računanje potenc števila i | OR+VR | `MAT-SS-2/kompleksna-stevila` | da |
| poišče povezavo med analitičnim in geometrijskim pomenom konjugiranega števila | OR+VR | `MAT-SS-2/kompleksna-stevila` | da |
| poišče povezavo med analitičnim in geometrijskim pomenom absolutne vrednosti kompleksnega števila | OR+VR | `MAT-SS-2/kompleksna-stevila` | da |
| izpelje in uporablja pravilo za deljenje kompleksnih števil | OR+VR | `MAT-SS-2/kompleksna-stevila` | da |
| izračuna obratno vrednost kompleksnega števila | OR+VR | `MAT-SS-2/kompleksna-stevila` | delno – 1/z ni posebej obravnavan, le splošno deljenje |
| poišče tudi kompleksne rešitve enačbe | OR+VR | `MAT-SS-2/kvadratna-enacba` | da – D < 0 in x² = −9 |


### 4.4 Algebrski izrazi, enačbe in neenačbe

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Računske operacije z izrazi | OR+VR | `MAT-SS-1/algebrski-izrazi` | da |
| Potenciranje izrazov | OR+VR | `MAT-SS-1/algebrski-izrazi` | da |
| Razstavljanje izrazov | OR+VR | `MAT-SS-1/razstavljanje-izrazov` | da |
| Računanje z ulomki | OR+VR | `MAT-SS-1/ulomljeni-izrazi` | da |
| Enačbe in neenačbe | OR+VR | `MAT-SS-1/linearne-enacbe`, `MAT-SS-1/linearne-neenacbe` | da |
| Linearna enačba | OR+VR | `MAT-SS-1/linearne-enacbe` | da |
| Razcepna enačba | OR+VR | `MAT-SS-2/kvadratna-enacba`, `MAT-SS-1/razstavljanje-izrazov` | delno – le omemba »produkt je 0« in x(ax + b) = 0 |
| Linearna enačba s parametrom | **VR** | `MAT-SS-1/linearne-enacbe` | da – parameter mimogrede tudi v Drugače: Na sliki, Kot zgodba, Bolj natančno |
| Linearna neenačba | OR+VR | `MAT-SS-1/linearne-neenacbe` | da |
| Linearna neenačba s parametrom | **VR** | `MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| primerja in razlikuje zapis in pomen izraza in enačbe ter spremenljivke in neznanke | OR+VR | `MAT-SS-1/algebrski-izrazi`, `MAT-SS-1/linearne-enacbe` | delno – izraz/enačba in spremenljivka/neznanka nista izrecno primerjana |
| sešteva in množi algebrske izraze | OR+VR | `MAT-SS-1/algebrski-izrazi` | da |
| uporablja in utemelji pravili za kvadrat in kub dvočlenika | OR+VR | `MAT-SS-1/algebrski-izrazi` | da |
| s pomočjo Pascalovega trikotnika določi pravila za višje potence dvočlenika in jih tudi uporablja | OR+VR | `MAT-SS-4/binomski-izrek` | da – C3 (14. 11. 2026) |
| prepozna in uporablja ustrezni način razstavljanja danega izraza: izpostavljanje, razlika kvadratov, vsota in razlika kubov, Viètovo pravilo, razstavljanje štiričlenikov | OR+VR | `MAT-SS-1/razstavljanje-izrazov`, `MAT-SS-1/razstavljanje-vsote-in-razlike-potenc` | da – C3 (14. 11. 2026) |
| razstavi izraze aⁿ ± bⁿ | **VR** | `MAT-SS-1/razstavljanje-vsote-in-razlike-potenc` | da – C3 (14. 11. 2026) |
| računa z algebrskimi ulomki (vse štiri računske operacije in izrazi z oklepaji) | OR+VR | `MAT-SS-1/ulomljeni-izrazi` | da |
| uporablja pravila za tvorbo ekvivalentnih enačb in enačbe spretno rešuje | OR+VR | `MAT-SS-1/linearne-enacbe` | da |
| prepozna in reši linearno enačbo | OR+VR | `MAT-SS-1/linearne-enacbe` | da |
| prepozna in reši razcepne enačbe | OR+VR | `MAT-SS-2/kvadratna-enacba` | delno – ni posebne razlage ali vaj za razcepne enačbe |
| spretno izraža neznanke iz različnih fizikalnih ali kemijskih enačb | OR+VR | `MAT-SS-1/sistemi-linearnih-enacb`, `MAT-SS-2/funkcije-in-njihove-lastnosti` | delno – izražanje iz formul le mimogrede (Fahrenheit); ni vaj s fizikalnimi formulami |
| obravnava linearne enačbe s parametrom | **VR** | `MAT-SS-1/linearne-enacbe` | da |
| uporablja pravila za tvorbo ekvivalentnih neenačb ter korake reševanja neenačb utemelji | OR+VR | `MAT-SS-1/linearne-neenacbe` | da |
| prepozna in reši linearno neenačbo | OR+VR | `MAT-SS-1/linearne-neenacbe` | da |
| obravnava preproste linearne neenačbe s parametrom | **VR** | `MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom` | da – C3 (14. 11. 2026) |


### 4.5 Potence in koreni

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Potence z naravnim eksponentom | OR+VR | `MAT-SS-1/potence-z-naravnimi-in-celimi-eksponenti` | da |
| Potence s celim eksponentom | OR+VR | `MAT-SS-1/potence-z-naravnimi-in-celimi-eksponenti` | da |
| n-ti koreni | OR+VR | `MAT-SS-2/koreni` | da |
| Potence z racionalnim eksponentom | OR+VR | `MAT-SS-2/potence-z-racionalnimi-eksponenti` | da |
| Iracionalne enačbe | **VR** | `MAT-SS-2/iracionalne-enacbe` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| utemelji in uporablja pravila za računanje s potencami z naravnim eksponentom | OR+VR | `MAT-SS-1/potence-z-naravnimi-in-celimi-eksponenti` | da |
| utemelji in uporablja pravila za računanje s potencami s celim eksponentom in jih primerja s pravili za potence z naravnim eksponentom | OR+VR | `MAT-SS-1/potence-z-naravnimi-in-celimi-eksponenti` | da |
| razloži pomen zapisov a⁻¹ in a⁻ⁿ | OR+VR | `MAT-SS-1/potence-z-naravnimi-in-celimi-eksponenti` | da |
| uporablja pravila za računanje s kvadratnimi koreni | OR+VR | `MAT-SS-2/koreni` | da |
| reši kvadratno enačbo x² = a, a > 0, z razstavljanjem in s korenjenjem | OR+VR | `MAT-SS-2/kvadratna-enacba` | delno – korenjenje da; reševanje z razstavljanjem (razlika kvadratov) ni prikazano |
| primerja in utemeljuje reševanje preprostih enačb xⁿ = a (a ∈ ℝ, n ∈ ℕ) v množici realnih števil s korenjenjem in z razstavljanjem | OR+VR | `MAT-SS-2/koreni`, `MAT-SS-2/iracionalne-enacbe` | da – C3 (14. 11. 2026) |
| razloži in uporablja zvezo √(x²) = \|x\| | OR+VR | `MAT-SS-2/koreni` | da |
| računa kubične korene realnih števil natančno (na pamet) in z računalom | OR+VR | `MAT-SS-2/koreni` | delno – na pamet da; računanje z računalom ni prikazano |
| razlikuje med določilnimi pogoji za obstoj n-tega korena realnega števila (glede na korenski eksponent in korenjenec) | OR+VR | `MAT-SS-2/koreni` | da |
| spretno uporablja računalo za računanje n-tih korenov | OR+VR | `MAT-SS-2/koreni` | delno – uporaba računala za n-te korene ni prikazana |
| preoblikuje zapis n-tega korena v zapis potence z racionalnim eksponentom | OR+VR | `MAT-SS-2/potence-z-racionalnimi-eksponenti` | da |
| povezuje in primerja reševanje nalog z n-timi koreni z reševanjem s potencami z racionalnim eksponentom | OR+VR | `MAT-SS-2/potence-z-racionalnimi-eksponenti` | da |
| prepozna iracionalno enačbo ter reši in utemelji korake pri reševanju iracionalnih enačb in interpretira rezultate | **VR** | `MAT-SS-2/iracionalne-enacbe` | da – C3 (14. 11. 2026) |


### 4.6 Geometrija v ravnini in prostoru

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Točke, premice in krožnice v ravnini | OR+VR | `MAT-SS-1/osnovni-geometrijski-pojmi`, `MAT-SS-1/stirikotniki-in-krog` | da |
| Razdalja, daljica, nosilka daljice, simetrala, poltrak, kot | OR+VR | `MAT-SS-1/osnovni-geometrijski-pojmi` | da – izraz »nosilka« ni uporabljen |
| Vrste kotov in odnosi med koti | OR+VR | `MAT-SS-1/osnovni-geometrijski-pojmi` | da |
| Trikotnik, večkotnik | OR+VR | `MAT-SS-1/trikotnik` | delno – večkotniki (vsota kotov, diagonale n-kotnika) manjkajo |
| Znamenite točke trikotnika | OR+VR | `MAT-SS-1/trikotnik` | da |
| Togi premiki in skladnost | OR+VR | `MAT-SS-1/trikotnik`, `MAT-SS-1/togi-premiki` | da – C3 (14. 11. 2026) |
| Vzporedni premik, zrcaljenje, vrtež, orientacija trikotnika | OR+VR | `MAT-SS-1/togi-premiki` | da – C3 (14. 11. 2026) |
| Pravokotna projekcija | OR+VR | `MAT-SS-1/osnovni-geometrijski-pojmi`, `MAT-SS-3/skalarni-produkt` | delno – le razdalja točke od premice in projekcija vektorja |
| Središčni in obodni koti | OR+VR | `MAT-SS-1/stirikotniki-in-krog` | da |
| Kot v polkrogu | OR+VR | `MAT-SS-1/trikotnik`, `MAT-SS-1/stirikotniki-in-krog` | da – Talesov izrek |
| Središčni razteg, podobnost | OR+VR | `MAT-SS-2/podobnost` | delno – podobnost da; središčni razteg manjka |
| Izreki v pravokotnem trikotniku | OR+VR | `MAT-SS-2/podobnost`, `MAT-SS-1/trikotnik` | da – Pitagorov, Evklidov, višinski izrek |
| Paralelogram, romb, trapez | OR+VR | `MAT-SS-1/stirikotniki-in-krog` | da |
| Načrtovalne naloge | OR+VR | `MAT-SS-1/nacrtovalne-naloge` | da – C3 (14. 11. 2026) |
| Kosinusni in sinusni izrek | OR+VR | `MAT-SS-3/sinusni-in-kosinusni-izrek` | da |
| Množice točk v prostoru | **VR** | `MAT-SS-3/premice-in-ravnine-v-prostoru` | da – C3 (14. 11. 2026) |
| Vzporednost in pravokotnost premic in ravnin v prostoru | OR+VR | `MAT-SS-3/premice-in-ravnine-v-prostoru` | da – C3 (14. 11. 2026) |
| Pravokotna projekcija premice na ravnino | OR+VR | `MAT-SS-3/premice-in-ravnine-v-prostoru` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| usvoji pojme elementarne evklidske geometrije | OR+VR | `MAT-SS-1/osnovni-geometrijski-pojmi`, `MAT-SS-1/trikotnik` | da |
| razvije geometrijsko predstavo in skozi prakso spozna temeljne standarde matematične teorije | OR+VR | `MAT-SS-1/osnovni-geometrijski-pojmi`, `MAT-SS-1/trikotnik`, `MAT-SS-1/stirikotniki-in-krog` | da – splošni cilj; utemeljitve in dokazi v lekcijah |
| pozna definicije in uporablja lastnosti geometrijskih likov | OR+VR | `MAT-SS-1/stirikotniki-in-krog`, `MAT-SS-1/trikotnik` | da |
| uporablja zveze med notranjimi in zunanjimi koti trikotnika ter odnose med stranicami in koti trikotnika | OR+VR | `MAT-SS-1/trikotnik` | da |
| uporablja zvezo med obodnim in središčnim kotom nad istim lokom | OR+VR | `MAT-SS-1/stirikotniki-in-krog` | da |
| zna ločiti med skladnima in podobnima trikotnikoma | OR+VR | `MAT-SS-1/trikotnik`, `MAT-SS-2/podobnost` | da |
| uporabi izreke v pravokotnem trikotniku | OR+VR | `MAT-SS-2/podobnost`, `MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku` | da |
| načrta geometrijske like z geometrijskim orodjem | OR+VR | `MAT-SS-1/nacrtovalne-naloge` | da – C3 (14. 11. 2026) |
| (načrta geometrijske like) tudi s programi za dinamično geometrijo | **VR** | `MAT-SS-1/nacrtovalne-naloge` | da – C3 (14. 11. 2026) |
| usvoji in uporablja zveze med stranicami in koti v poljubnem trikotniku, pri tem uporablja kosinusni in sinusni izrek | OR+VR | `MAT-SS-3/sinusni-in-kosinusni-izrek` | da |
| preiskuje geometrijske probleme z uporabo IKT | OR+VR | `MAT-SS-1/trikotnik`, `MAT-SS-1/stirikotniki-in-krog`, `MAT-SS-1/osnovni-geometrijski-pojmi` | da – simulacije za raziskovanje (značilne točke, obodni kot) |
| razvije predstave o odnosih med točkami, premicami in ravninami v prostoru | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles`, `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | delno – odnosi premic in ravnin v prostoru niso obravnavani |


### 4.7 Geometrijski liki in telesa

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Ploščine geometrijskih likov, Heronova formula | OR+VR | `MAT-SS-1/stirikotniki-in-krog`, `MAT-SS-1/trikotnik`, `MAT-SS-1/heronova-formula-ter-polmera-ocrtanega-in-vcrtanega-kroga` | da – C3 (14. 11. 2026) |
| Polmer trikotniku včrtanega in očrtanega kroga | OR+VR | `MAT-SS-1/trikotnik`, `MAT-SS-3/sinusni-in-kosinusni-izrek` | da – r = S/s, 2R iz sinusnega izreka |
| Geometrijska telesa: prizma, valj, piramida, stožec, krogla | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles` | da |
| Površina in prostornina pokončne prizme, valja, piramide, stožca in krogle | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles` | da |
| Cavalierijevo pravilo | **VR** | `MAT-SS-3/povrsina-in-prostornina-teles` | delno – le v Drugače: Bolj natančno; brez naloge |
| Poševna telesa | **VR** | `MAT-SS-3/posevna-telesa-in-vrtenine` | da – C3 (14. 11. 2026) |
| Vrtenine | **VR** | `MAT-SS-4/doloceni-integral`, `MAT-SS-3/posevna-telesa-in-vrtenine` | da – C3 (14. 11. 2026) |
| Geometrijski matematični problemi | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles` | da |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| razvije in izboljša geometrijsko predstavo | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles` | da – splošni cilj |
| uporablja obrazce za izražanje posameznih količin | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles` | da |
| kritično oceni in presodi dobljene vrednosti ter pazi na merske enote | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles` | da |
| uporabi usvojeno znanje ravninske geometrije ter rešuje probleme v povezavi s polmerom trikotniku včrtanega in očrtanega kroga | OR+VR | `MAT-SS-1/trikotnik` | da |
| opiše geometrijsko telo | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles` | da |
| uporabi usvojeno znanje kotnih funkcij in geometrije na modelih geometrijskih teles | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles` | delno – v telesih le Pitagorov izrek, kotnih funkcij ni |
| rešuje geometrijske probleme v povezavi s površino in prostornino teles ter kritično oceni in presodi dobljene rezultate ter merske enote | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles` | da |
| rešuje geometrijske probleme s poševnimi telesi | **VR** | `MAT-SS-3/posevna-telesa-in-vrtenine` | da – C3 (14. 11. 2026) |
| določi os vrtenja in analizira nastalo vrtenino glede na izbiro osi | **VR** | `MAT-SS-3/posevna-telesa-in-vrtenine` | da – C3 (14. 11. 2026) |
| rešuje probleme v povezavi s prostornino rotacijskih teles | **VR** | `MAT-SS-4/doloceni-integral`, `MAT-SS-3/posevna-telesa-in-vrtenine` | da – C3 (14. 11. 2026) |
| prepozna geometrijski problem, ga predstavi, ugotovi, s katerimi pojmi, spremenljivkami in zvezami ga lahko rešuje, problem reši, rešitve predstavi in razmisli o njihovi smiselnosti | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles`, `MAT-SS-4/mesane-maturitetne-naloge` | da – splošni cilj |
| pri reševanju geometrijskih problemov samostojno izbere in uporablja ustrezne strategije in povezuje vsebine iz ravninske in prostorske geometrije | OR+VR | `MAT-SS-3/povrsina-in-prostornina-teles`, `MAT-SS-1/trikotnik` | da – splošni cilj |
| rešuje geometrijske probleme z uporabo trigonometrije | OR+VR | `MAT-SS-3/sinusni-in-kosinusni-izrek`, `MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku` | da |


### 4.8 Vektorji v ravnini in prostoru

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Opredelitev vektorjev | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | da |
| Seštevanje, množenje s skalarjem (sile) – grafična interpretacija | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | da |
| Kolinearnost, koplanarnost – grafična interpretacija | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru`, `MAT-SS-3/vektorji-v-geometriji` | da – C3 (14. 11. 2026) |
| Razvoj vektorjev po bazi (razstavljanje sile na komponente), pravokotna projekcija – grafična interpretacija | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru`, `MAT-SS-3/skalarni-produkt` | delno – grafično razstavljanje sile na dani smeri ni prikazano |
| Linearna kombinacija vektorjev | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | da |
| Linearna neodvisnost vektorjev | **VR** | `MAT-SS-3/vektorji-v-geometriji` | da – C3 (14. 11. 2026) |
| Baza v ravnini in prostoru | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | delno – le standardna baza i, j, k v Bolj natančno |
| Pravokotni koordinatni sistem v ravnini in prostoru; krajevni vektor točke | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | delno – krajevni vektor točke ni vpeljan |
| Zapis vektorja s koordinatami (komponentami) | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | da |
| Računske operacije z vektorji, zapisanimi s koordinatami (komponentami) | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | da |
| Pravokotna projekcija vektorja na drug vektor | OR+VR | `MAT-SS-3/skalarni-produkt` | delno – le »senca« \|b\|cosφ; brez računa projekcije v primeru |
| Skalarni produkt, kot med vektorjema in dolžina vektorja | OR+VR | `MAT-SS-3/skalarni-produkt`, `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | da |
| Uporaba vektorskega računa v trikotniku in paralelogramu, razmerja, težišče | **VR** | `MAT-SS-3/vektorji-v-geometriji` | da – C3 (14. 11. 2026) |
| Povezava med skalarnim produktom in kosinusnim izrekom | OR+VR | `MAT-SS-3/skalarni-produkt` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| nariše vektorje, grafično sešteva in razstavlja vektorje ter množi vektorje s skalarjem | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | da |
| usvoji računanje z vektorji na grafičnem in računskem nivoju | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | da |
| presodi kolinearnost in koplanarnost vektorjev | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru`, `MAT-SS-3/vektorji-v-geometriji` | da – C3 (14. 11. 2026) |
| presodi linearno neodvisnost vektorjev | **VR** | `MAT-SS-3/vektorji-v-geometriji` | da – C3 (14. 11. 2026) |
| računa z vektorji, zapisanimi s koordinatami (komponentami) | OR+VR | `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | da |
| izračuna kot med vektorjema, dolžino vektorja in pravokotno projekcijo vektorja | OR+VR | `MAT-SS-3/skalarni-produkt` | delno – kot in dolžina da; projekcija brez naloge |
| utemelji pravokotnost in vzporednost vektorjev | OR+VR | `MAT-SS-3/skalarni-produkt`, `MAT-SS-3/vektorji-v-ravnini-in-prostoru` | da |
| razume pravokotnost v prostoru | OR+VR | `MAT-SS-3/skalarni-produkt` | delno – le skalarni produkt v 3D; pravokotnost premic/ravnin ne |


### 4.9 Pravokotni koordinatni sistem v ravnini

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Množice točk v ravnini | OR+VR | `MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini` | delno – le kvadranti; območja ob pogojih (x ≥ a, \|y\| < b) manjkajo |
| Razdalja med točkama v koordinatni ravnini | OR+VR | `MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini` | da |
| Ploščina trikotnika | OR+VR | `MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini` | da |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| uporablja pravokotni koordinatni sistem v ravnini | OR+VR | `MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini` | da |
| odčita in nariše množico točk v koordinatni ravnini ob danih pogojih | OR+VR | `MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini` | delno – risanje množic točk ob pogojih manjka |
| uporablja zvezo med urejenimi pari števil in točkami na ravnini | OR+VR | `MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini` | da |
| izračuna razdaljo med točkama, izračuna ploščino trikotnika ter uporabi formuli v matematičnih problemih | OR+VR | `MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini` | da |


### 4.10 Funkcije (splošno)

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Definicija funkcije | OR+VR | `MAT-SS-2/funkcije-in-njihove-lastnosti` | da |
| Definicija realne funkcije in lastnosti realnih funkcij realne spremenljivke (injektivnost, surjektivnost, bijektivnost, naraščanje, padanje, sodost, lihost …) | OR+VR | `MAT-SS-2/funkcije-in-njihove-lastnosti` | delno – surjektivnost in bijektivnost manjkata |
| Sestavljene funkcije (kompozitum) funkcij | OR+VR | `MAT-SS-2/funkcije-in-njihove-lastnosti` | da |
| Inverzna funkcija | OR+VR | `MAT-SS-2/funkcije-in-njihove-lastnosti` | da |
| Transformacije v ravnini | OR+VR | `MAT-SS-2/transformacije-grafov` | da |
| Limita funkcije | OR+VR | `MAT-SS-4/limita-in-zveznost-funkcije` | da |
| Posebni primeri limit | OR+VR | `MAT-SS-4/limita-in-zveznost-funkcije` | da – sin x / x, 0/0, 1/x |
| Zveznost funkcije | OR+VR | `MAT-SS-4/limita-in-zveznost-funkcije` | da |
| Lastnosti zveznih funkcij na zaprtem intervalu | **VR** | `MAT-SS-4/zvezne-funkcije-in-bisekcija` | da – C3 (14. 11. 2026) |
| Iskanje ničel z uporabo tehnologije | **VR** | `MAT-SS-4/zvezne-funkcije-in-bisekcija` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| usvoji in uporablja pojem funkcije | OR+VR | `MAT-SS-2/funkcije-in-njihove-lastnosti` | da |
| usvoji in uporablja pojme: definicijsko območje in zaloga vrednosti funkcije, injektivna, surjektivna, bijektivna funkcija | OR+VR | `MAT-SS-2/funkcije-in-njihove-lastnosti` | delno – surjektivnost in bijektivnost manjkata |
| nariše, analizira graf funkcije s pomočjo vzporednega premika in raztega | OR+VR | `MAT-SS-2/transformacije-grafov` | da |
| uporablja vzporedni premik, zrcaljenja in raztege pri reševanju problemskih nalog | OR+VR | `MAT-SS-2/transformacije-grafov` | da |
| ugotovi obstoj inverzne funkcije na preprostih primerih, zapiše njen predpis in nariše graf inverzne funkcije k dani funkciji | OR+VR | `MAT-SS-2/funkcije-in-njihove-lastnosti` | da |
| analizira predpis in nariše graf funkcije z absolutno vrednostjo | **VR** | `MAT-SS-2/transformacije-grafov`, `MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije` | da – C3 (14. 11. 2026) |
| nariše graf stopničaste funkcije | OR+VR | `MAT-SS-2/grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije` | da – C3 (14. 11. 2026) |
| razloži pojem limite v dani točki na ustrezno izbranih primerih, ki so grafične, tabelarične ali analitične prezentacije funkcij | OR+VR | `MAT-SS-4/limita-in-zveznost-funkcije` | da |
| izračuna limito funkcije in razloži pomen dobljene limitne vrednosti | OR+VR | `MAT-SS-4/limita-in-zveznost-funkcije` | da |
| razloži pomen limite v neskončnosti | OR+VR | `MAT-SS-4/limita-in-zveznost-funkcije` | da |
| loči limito funkcije v neskončnosti od neskončne limite | OR+VR | `MAT-SS-4/limita-in-zveznost-funkcije` | da |
| uporablja limito pri računanju asimptot funkcij | OR+VR | `MAT-SS-4/limita-in-zveznost-funkcije`, `MAT-SS-3/racionalne-funkcije` | da |
| prepozna zveznost funkcije, ki je podana s svojim grafom | OR+VR | `MAT-SS-4/limita-in-zveznost-funkcije` | da |
| razloži zveznost s predpisom podane funkcije | **VR** | `MAT-SS-4/limita-in-zveznost-funkcije` | da – Primer 3; vprašanje vr. 219 mejno (definicija zveznosti) |
| poišče intervale, na katerih je dana funkcija zvezna | OR+VR | `MAT-SS-4/limita-in-zveznost-funkcije` | delno – le trditev o zveznosti elementarnih funkcij, brez naloge |
| sklepa o lastnostih konkretne zvezne funkcije na zaprtem intervalu | **VR** | `MAT-SS-4/zvezne-funkcije-in-bisekcija` | da – C3 (14. 11. 2026) |
| poišče ničlo ali točko na krivulji na predvideno natančnost z uporabo tehnologije | **VR** | `MAT-SS-4/zvezne-funkcije-in-bisekcija` | da – C3 (14. 11. 2026) |


### 4.10.1 Linearna funkcija

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Definicija in lastnosti linearne funkcije, graf linearne funkcije | OR+VR | `MAT-SS-1/linearna-funkcija` | da |
| Enačbe premice v ravnini | OR+VR | `MAT-SS-1/linearna-funkcija`, `MAT-SS-1/enacbe-premice-in-kot-med-premicama` | da – C3 (14. 11. 2026) |
| Kot med premicama | OR+VR | `MAT-SS-1/enacbe-premice-in-kot-med-premicama` | da – C3 (14. 11. 2026) |
| Linearna enačba | OR+VR | `MAT-SS-1/linearne-enacbe` | da |
| Linearna neenačba | OR+VR | `MAT-SS-1/linearne-neenacbe` | da |
| Sistem linearnih enačb | OR+VR | `MAT-SS-1/sistemi-linearnih-enacb` | da |
| Gaussova eliminacijska metoda | **VR** | `MAT-SS-1/gaussova-metoda-in-sistemi-linearnih-neenacb` | da – C3 (14. 11. 2026) |
| Sistem linearnih neenačb | **VR** | `MAT-SS-1/gaussova-metoda-in-sistemi-linearnih-neenacb` | da – C3 (14. 11. 2026) |
| Modeliranje preprostih primerov iz vsakdanjega življenja z linearno funkcijo | OR+VR | `MAT-SS-1/linearna-funkcija`, `MAT-SS-1/linearne-enacbe` | da |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| zapiše predpis za linearne funkcije in nariše graf | OR+VR | `MAT-SS-1/linearna-funkcija` | da |
| pozna in uporabi pomen koeficientov v linearni funkciji | OR+VR | `MAT-SS-1/linearna-funkcija` | da |
| interpretira in uporablja graf linearne funkcije v praktičnih situacijah | OR+VR | `MAT-SS-1/linearna-funkcija` | da |
| izračuna kot med premicama | OR+VR | `MAT-SS-1/enacbe-premice-in-kot-med-premicama` | da – C3 (14. 11. 2026) |
| pozna pomen različnih oblik enačbe premice | OR+VR | `MAT-SS-1/linearna-funkcija`, `MAT-SS-1/enacbe-premice-in-kot-med-premicama` | da – C3 (14. 11. 2026) |
| v besedilu prepozna linearen odnos in zapiše linearno enačbo | OR+VR | `MAT-SS-1/linearne-enacbe` | da |
| rešuje linearne enačbe | OR+VR | `MAT-SS-1/linearne-enacbe` | da |
| obravnava preproste linearne enačbe, neenačbe in sisteme linearnih enačb | **VR** | `MAT-SS-1/linearne-enacbe`, `MAT-SS-1/linearne-neenacbe`, `MAT-SS-1/sistemi-linearnih-enacb`, `MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom` | da – C3 (14. 11. 2026) |
| izrazi problem kot sistem enačb in ga reši | OR+VR | `MAT-SS-1/sistemi-linearnih-enacb` | da |
| reši preproste probleme iz vsakdanjega življenja in jih ustrezno interpretira | OR+VR | `MAT-SS-1/linearne-enacbe`, `MAT-SS-1/linearne-neenacbe`, `MAT-SS-1/sistemi-linearnih-enacb` | da |
| modelira preproste probleme iz vsakdanjega življenja z linearno funkcijo | OR+VR | `MAT-SS-1/linearna-funkcija` | da |


### 4.10.2 Potenčna funkcija

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Definicija in lastnosti potenčne funkcije z naravnim eksponentom | OR+VR | `MAT-SS-2/potencna-in-korenska-funkcija` | da |
| Definicija in lastnosti potenčne funkcije z negativnim celim eksponentom | OR+VR | `MAT-SS-2/potencna-in-korenska-funkcija` | da |
| Modeliranje primerov iz vsakdanjega življenja s potenčno funkcijo | OR+VR | `MAT-SS-2/potencna-in-korenska-funkcija` | da – Primer 3 (zabojnik), Primer 4 (plošča), kviz s kocko |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| prepozna potenčno odvisnost in jo razlikuje od drugih odvisnosti (premosorazmernost …) | OR+VR | `MAT-SS-2/potencna-in-korenska-funkcija` | delno – ni primerjave s premim sorazmerjem; le kviz s tabelo vrednosti |
| nariše in analizira graf potenčne funkcije s pomočjo transformacij | OR+VR | `MAT-SS-2/potencna-in-korenska-funkcija`, `MAT-SS-2/transformacije-grafov` | da |
| zapiše in modelira realistične pojave s potenčno funkcijo in jih kritično izbere | OR+VR | `MAT-SS-2/potencna-in-korenska-funkcija` | delno – le podani geometrijski modeli; kritične izbire modela ni |


### 4.10.3 Korenska funkcija

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Definicija, lastnosti in graf korenske funkcije | OR+VR | `MAT-SS-2/potencna-in-korenska-funkcija` | da |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| obravnava korensko funkcijo kot inverzno funkcijo k potenčni funkciji | OR+VR | `MAT-SS-2/potencna-in-korenska-funkcija` | da |


### 4.10.4 Kvadratna funkcija

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Definicija, lastnosti in graf kvadratne funkcije | OR+VR | `MAT-SS-2/kvadratna-funkcija` | da |
| Načini podajanja predpisa kvadratne funkcije | OR+VR | `MAT-SS-2/kvadratna-funkcija` | da |
| Uporaba kvadratne funkcije – ekstremalni problemi | **VR** | `MAT-SS-2/kvadratna-funkcija`, `MAT-SS-4/uporaba-odvoda` | delno – le teme v Primerih 2–3; sestavljanje funkcije šele v uporaba-odvoda Primer 3 |
| Viètovi pravili | OR+VR | `MAT-SS-2/kvadratna-enacba` | da |
| Kvadratna enačba | OR+VR | `MAT-SS-2/kvadratna-enacba` | da |
| Presečišče parabole in premice | OR+VR | `MAT-SS-2/kvadratna-funkcija`, `MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb` | da – C3 (14. 11. 2026) |
| Presečišče dveh parabol | OR+VR | `MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb` | da – C3 (14. 11. 2026) |
| Kvadratna neenačba | OR+VR | `MAT-SS-2/kvadratna-neenacba` | da |
| Sistem kvadratnih neenačb | **VR** | `MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb` | da – C3 (14. 11. 2026) |
| Modeliranje primerov iz vsakdanjega življenja s kvadratno funkcijo | **VR** | `MAT-SS-2/kvadratna-funkcija`, `MAT-SS-2/kvadratna-neenacba`, `MAT-SS-2/kvadratna-enacba` | da – model iz meritev v kvadratna-funkcija Primer 3; mešano z OR, brez oznake |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| zapiše kvadratno funkcijo pri različnih podatkih in nariše graf | OR+VR | `MAT-SS-2/kvadratna-funkcija` | da |
| interpretira in uporabi graf kvadratne funkcije v praktičnih situacijah | OR+VR | `MAT-SS-2/kvadratna-funkcija` | da |
| reši kvadratno enačbo in neenačbo | OR+VR | `MAT-SS-2/kvadratna-enacba`, `MAT-SS-2/kvadratna-neenacba` | da |
| prevede problem v enačbo ali neenačbo in ga reši | OR+VR | `MAT-SS-2/kvadratna-neenacba`, `MAT-SS-2/kvadratna-enacba` | da |
| bere matematično besedilo, ga analizira in predstavi | OR+VR | `MAT-SS-2/kvadratna-funkcija`, `MAT-SS-2/kvadratna-neenacba` | da – splošni cilj; besedilne naloge v Primerih 3 |
| zapiše in modelira primere iz vsakdanjega življenja s kvadratno funkcijo | **VR** | `MAT-SS-2/kvadratna-funkcija` | da – kvadratna-funkcija Primer 3 (model temperature); mešano z OR, brez oznake |


### 4.10.5 Eksponentna funkcija

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Definicija, lastnosti in graf eksponentne funkcije | OR+VR | `MAT-SS-2/eksponentna-funkcija` | da |
| Eksponentne enačbe | OR+VR | `MAT-SS-2/eksponentne-enacbe` | da |
| Grafično reševanje eksponentne neenačbe | **VR** | `MAT-SS-2/eksponentna-funkcija`, `MAT-SS-2/eksponentne-enacbe` | delno – le »kje je g(x) < 0« v Primeru 4; grafična metoda ni razložena |
| Eksponentna rast | OR+VR | `MAT-SS-2/eksponentna-funkcija` | da |
| Modeliranje realističnih pojavov z eksponentno funkcijo | OR+VR | `MAT-SS-2/eksponentna-funkcija`, `MAT-SS-2/eksponentne-enacbe`, `MAT-SS-2/logaritem` | da |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| razlikuje, prepozna eksponentno odvisnost od drugih vrst odvisnosti | OR+VR | `MAT-SS-2/eksponentna-funkcija` | da |
| pozna in uporablja lastnosti eksponentne funkcije | OR+VR | `MAT-SS-2/eksponentna-funkcija` | da |
| nariše graf eksponentne funkcije | OR+VR | `MAT-SS-2/eksponentna-funkcija` | da |
| uporabi vzporedne premike in raztege grafa eksponentne funkcije | OR+VR | `MAT-SS-2/eksponentna-funkcija`, `MAT-SS-2/transformacije-grafov` | da |
| primerja potenčno in eksponentno rast | OR+VR | `MAT-SS-2/eksponentna-funkcija` | delno – le v Pogostih napakah (2^x proti x²) in kvizu |
| prepozna in reši eksponentne enačbe | OR+VR | `MAT-SS-2/eksponentne-enacbe` | da |
| zapiše in modelira primere iz vsakdanjega življenja z eksponentno funkcijo | OR+VR | `MAT-SS-2/eksponentna-funkcija`, `MAT-SS-2/eksponentne-enacbe` | da |


### 4.10.6 Logaritemska funkcija

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Definicija, lastnosti in graf logaritemske funkcije | OR+VR | `MAT-SS-2/logaritemska-funkcija-in-enacbe` | da |
| Logaritem in pravila za računanje z logaritmi | OR+VR | `MAT-SS-2/logaritem` | da |
| Desetiški in naravni logaritem | OR+VR | `MAT-SS-2/logaritem` | da |
| Prehod k novi osnovi | **VR** | `MAT-SS-2/logaritem` | da – blok 6 (višja raven); Primer 3 b) ga uporablja |
| Logaritemske enačbe | OR+VR | `MAT-SS-2/logaritemska-funkcija-in-enacbe` | da |
| Branje logaritemske skale | **VR** | `MAT-SS-2/logaritem` | delno – pH in decibeli; branje logaritemske skale na osi grafa manjka |
| Modeliranje primerov iz vsakdanjega življenja z logaritemsko funkcijo | **VR** | `MAT-SS-2/logaritem`, `MAT-SS-2/logaritemska-funkcija-in-enacbe` | delno – modeli podani (uglaševalnik, pH, dB); sestavljanja modela ni |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| pozna in uporablja lastnosti logaritemske funkcije | OR+VR | `MAT-SS-2/logaritemska-funkcija-in-enacbe` | da |
| nariše graf logaritemske funkcije | OR+VR | `MAT-SS-2/logaritemska-funkcija-in-enacbe` | da |
| uporablja zvezo med eksponentno in logaritemsko funkcijo | OR+VR | `MAT-SS-2/logaritemska-funkcija-in-enacbe`, `MAT-SS-2/logaritem` | da |
| uporabi vzporedne premike in raztege grafa logaritemske funkcije | OR+VR | `MAT-SS-2/logaritemska-funkcija-in-enacbe`, `MAT-SS-2/transformacije-grafov` | delno – le premiki; raztegi logaritemske funkcije niso obravnavani |
| uporablja pravila za računanje z logaritmi | OR+VR | `MAT-SS-2/logaritem` | da |
| spozna število e in naravni logaritem | OR+VR | `MAT-SS-2/eksponentna-funkcija`, `MAT-SS-2/logaritem` | delno – e in ln le definirana; ni izvora števila e ne vaj |
| prepozna in reši logaritemske enačbe | OR+VR | `MAT-SS-2/logaritemska-funkcija-in-enacbe` | da |
| primerja eksponentno in logaritemsko rast | OR+VR | `MAT-SS-2/logaritemska-funkcija-in-enacbe` | delno – le omemba počasnega naraščanja; neposredne primerjave z eksponentno ni |
| zapiše in modelira primere iz vsakdanjega življenja z logaritemsko funkcijo | **VR** | `MAT-SS-2/logaritem`, `MAT-SS-2/logaritemska-funkcija-in-enacbe` | delno – modeli podani; sestavljanja logaritemskega modela ni |


### 4.10.7 Polinomska funkcija

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Definicija, lastnosti in graf polinomske funkcije | OR+VR | `MAT-SS-3/polinomi`, `MAT-SS-3/graf-polinoma` | da |
| Računske operacije s polinomi | OR+VR | `MAT-SS-1/algebrski-izrazi`, `MAT-SS-3/polinomi` | da – seštevanje, množenje v algebrski-izrazi; deljenje v polinomi |
| Osnovni izrek o deljenju polinomov | OR+VR | `MAT-SS-3/polinomi` | da |
| Ničle polinomske funkcije | OR+VR | `MAT-SS-3/polinomi`, `MAT-SS-3/graf-polinoma` | da |
| Osnovni izrek algebre in posledice | OR+VR | `MAT-SS-3/polinomi` | delno – le »največ n ničel« v Bolj natančno; osnovni izrek algebre ni naveden |
| Hornerjev algoritem | OR+VR | `MAT-SS-3/polinomi` | da |
| Analiza grafa polinomske funkcije | OR+VR | `MAT-SS-3/graf-polinoma` | da |
| Polinomske enačbe | OR+VR | `MAT-SS-3/polinomi` | da |
| Polinomske neenačbe | OR+VR | `MAT-SS-3/graf-polinoma` | da |
| Metoda bisekcije | **VR** | `MAT-SS-4/zvezne-funkcije-in-bisekcija` | da – C3 (14. 11. 2026) |
| Modeliranje realističnih pojavov s polinomi | **VR** | `MAT-SS-3/graf-polinoma`, `MAT-SS-3/polinomi` | delno – modeli podani (temperatura, jezero, sonda); sestavljanje modela manjka |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| linearno in kvadratno funkcijo prepozna kot posebna primera polinomske funkcije | OR+VR | `MAT-SS-3/polinomi` | delno – ni izrecne povezave z linearno in kvadratno funkcijo |
| računa s polinomi | OR+VR | `MAT-SS-1/algebrski-izrazi`, `MAT-SS-3/polinomi` | da |
| uporablja osnovni izrek o deljenju polinomov | OR+VR | `MAT-SS-3/polinomi` | da |
| uporablja izrek o deljenju polinoma z linearnim polinomom | OR+VR | `MAT-SS-3/polinomi` | da |
| uporablja Hornerjev algoritem za iskanje ničel polinomske funkcije | OR+VR | `MAT-SS-3/polinomi` | da |
| v problemskih nalogah uporablja lastnosti polinomov | OR+VR | `MAT-SS-3/polinomi`, `MAT-SS-3/graf-polinoma` | da |
| nariše in interpretira graf polinomske funkcije | OR+VR | `MAT-SS-3/graf-polinoma` | da |
| uporablja metodo bisekcije | **VR** | `MAT-SS-4/zvezne-funkcije-in-bisekcija` | da – C3 (14. 11. 2026) |
| reši polinomske enačbe in neenačbe | OR+VR | `MAT-SS-3/polinomi`, `MAT-SS-3/graf-polinoma` | da |


### 4.10.8 Racionalna funkcija

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Definicija, lastnosti in graf racionalne funkcije | OR+VR | `MAT-SS-3/racionalne-funkcije` | da |
| Ničle, poli in asimptote | OR+VR | `MAT-SS-3/racionalne-funkcije` | da |
| Racionalne enačbe | OR+VR | `MAT-SS-3/racionalne-funkcije` | delno – le Primer 3 in kviz; postopek reševanja ni razložen |
| Racionalne neenačbe | **VR** | `MAT-SS-3/racionalne-neenacbe` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| pozna in uporablja lastnosti racionalnih funkcij | OR+VR | `MAT-SS-3/racionalne-funkcije` | da |
| nariše in interpretira graf racionalne funkcije | OR+VR | `MAT-SS-3/racionalne-funkcije` | da |
| reši racionalne enačbe | OR+VR | `MAT-SS-3/racionalne-funkcije` | delno – le Primer 3 in kviz; postopek reševanja ni razložen |
| reši racionalne neenačbe | **VR** | `MAT-SS-3/racionalne-neenacbe` | da – C3 (14. 11. 2026) |


### 4.10.9 Kotne funkcije

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Definicije in lastnosti kotnih funkcij v pravokotnem trikotniku | OR+VR | `MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku` | da |
| Definicije kotnih funkcij na enotski krožnici | OR+VR | `MAT-SS-3/kotne-funkcije-poljubnega-kota` | da |
| Lastnosti in grafi kotnih funkcij | OR+VR | `MAT-SS-3/grafi-kotnih-funkcij` | da |
| Transformacije grafov kotnih funkcij | OR+VR | `MAT-SS-3/grafi-kotnih-funkcij` | da |
| Adicijski izreki | OR+VR | `MAT-SS-3/adicijski-izreki` | da |
| Problemske naloge | OR+VR | `MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku`, `MAT-SS-3/sinusni-in-kosinusni-izrek`, `MAT-SS-3/adicijski-izreki` | da |
| Faktorizacija in razčlenitev produkta | **VR** | `MAT-SS-3/adicijski-izreki` | da – C3 (14. 11. 2026) |
| Računanje vrednosti krožnih funkcij | OR+VR | `MAT-SS-3/trigonometrijske-enacbe` | delno – definiran le arcsin; arccos in arctan le uporabljena |
| Grafi in lastnosti krožnih funkcij | **VR** | `MAT-SS-3/krozne-funkcije` | da – C3 (14. 11. 2026) |
| Trigonometrijske enačbe | OR+VR | `MAT-SS-3/trigonometrijske-enacbe` | da |
| Kotne funkcije v tehniki in naravoslovju | **VR** | `MAT-SS-3/grafi-kotnih-funkcij`, `MAT-SS-3/trigonometrijske-enacbe` | da – dolžina dneva, izmenična napetost; mešano z OR, brez oznake |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| zapiše in uporabi kotne funkcije v pravokotnem trikotniku | OR+VR | `MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku` | da |
| izpelje vrednosti kotnih funkcij za kote 0°, 30°, 45°, 60°, 90° | OR+VR | `MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku`, `MAT-SS-3/kotne-funkcije-poljubnega-kota` | da |
| izpelje in uporabi zveze med kotnimi funkcijami istega kota | OR+VR | `MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku` | da |
| uporablja računalo | OR+VR | `MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku`, `MAT-SS-3/trigonometrijske-enacbe` | da |
| uporablja vrednosti kotnih funkcij za poljubne kote | OR+VR | `MAT-SS-3/kotne-funkcije-poljubnega-kota` | da |
| pozna in uporabi lastnosti kotnih funkcij | OR+VR | `MAT-SS-3/kotne-funkcije-poljubnega-kota`, `MAT-SS-3/grafi-kotnih-funkcij` | da |
| pozna in razloži pojme na različnih reprezentacijah (tabela vrednosti, graf, na enotski krožnici, analitično) | OR+VR | `MAT-SS-3/kotne-funkcije-poljubnega-kota`, `MAT-SS-3/grafi-kotnih-funkcij` | da |
| uporabi transformacije grafov kotnih funkcij | OR+VR | `MAT-SS-3/grafi-kotnih-funkcij` | da |
| nariše in interpretira grafe kotnih funkcij | OR+VR | `MAT-SS-3/grafi-kotnih-funkcij` | da |
| uporabi adicijske izreke | OR+VR | `MAT-SS-3/adicijski-izreki` | da |
| uporabi kotne funkcije dvojnih kotov | OR+VR | `MAT-SS-3/adicijski-izreki` | da |
| uporablja kotne funkcije dvojnih kotov pri trigonometrijskih enačbah in problemskih nalogah | OR+VR | `MAT-SS-3/trigonometrijske-enacbe`, `MAT-SS-3/adicijski-izreki` | da |
| uporablja kotne funkcije polovičnih kotov pri trigonometrijskih enačbah in problemskih nalogah | **VR** | `MAT-SS-3/trigonometrijske-enacbe` | da – C3 (14. 11. 2026) |
| faktorizira izraze in jih zna uporabiti pri enačbah | **VR** | `MAT-SS-3/trigonometrijske-enacbe` | da – C3 (14. 11. 2026) |
| računa vrednosti krožnih funkcij | OR+VR | `MAT-SS-3/trigonometrijske-enacbe`, `MAT-SS-3/skalarni-produkt` | delno – arkus le prek kalkulatorja; arccos, arctan niso definirani |
| skicira graf krožne funkcije | **VR** | `MAT-SS-3/krozne-funkcije` | da – C3 (14. 11. 2026) |
| reši trigonometrijsko enačbo | OR+VR | `MAT-SS-3/trigonometrijske-enacbe` | da |
| interpretira in analizira analitične rešitve glede na dani problem | OR+VR | `MAT-SS-3/trigonometrijske-enacbe` | da |
| uporabi kotne funkcije v problemskih situacijah, kjer je treba izračunati kot | OR+VR | `MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku`, `MAT-SS-3/sinusni-in-kosinusni-izrek`, `MAT-SS-3/skalarni-produkt` | da |
| rešuje preproste, sestavljene, avtentične in izvirne probleme | OR+VR | `MAT-SS-3/trigonometrijske-enacbe`, `MAT-SS-3/grafi-kotnih-funkcij`, `MAT-SS-3/sinusni-in-kosinusni-izrek` | da – splošni cilj |


### 4.11 Stožnice

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Algebrski zapis krivulj II. reda | OR+VR | `MAT-SS-3/kroznica`, `MAT-SS-3/elipsa-hiperbola-parabola` | delno – splošna enačba 2. stopnje ni obravnavana; le splošna oblika krožnice |
| Krožnica v središčni in premaknjeni legi | OR+VR | `MAT-SS-3/kroznica` | da |
| Elipsa v središčni in premaknjeni legi | OR+VR | `MAT-SS-3/elipsa-hiperbola-parabola`, `MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente` | da – C3 (14. 11. 2026) |
| Hiperbola v središčni legi | OR+VR | `MAT-SS-3/elipsa-hiperbola-parabola` | da |
| Parabola v temenski legi | OR+VR | `MAT-SS-3/elipsa-hiperbola-parabola` | da |
| Hiperbola in parabola v premaknjeni legi | **VR** | `MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente` | da – C3 (14. 11. 2026) |
| Tangente stožnic | **VR** | `MAT-SS-3/kroznica`, `MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| poišče primere stožnic v naravi | OR+VR | `MAT-SS-3/elipsa-hiperbola-parabola` | da |
| primerja in uporablja analitično in geometrijsko definicijo stožnice | OR+VR | `MAT-SS-3/elipsa-hiperbola-parabola` | da |
| interpretira krožnico kot poseben primer elipse | OR+VR | `MAT-SS-3/elipsa-hiperbola-parabola` | da |
| izpelje enačbe elipse iz enačbe krožnice z raztegom vzdolž izbrane osi | **VR** | `MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente` | da – C3 (14. 11. 2026) |
| analizira enačbo in grafično predstavi krožnice in elipse v središčni in v premaknjeni legi | OR+VR | `MAT-SS-3/kroznica`, `MAT-SS-3/elipsa-hiperbola-parabola`, `MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente` | da – C3 (14. 11. 2026) |
| analizira enačbo in grafično predstavi hiperbole in parabole v temenski legi | OR+VR | `MAT-SS-3/elipsa-hiperbola-parabola` | da |
| analizira različne oblike enačbe parabole | OR+VR | `MAT-SS-3/elipsa-hiperbola-parabola` | delno – le y² = 2px in x² = 2py; druge smeri odprtosti manjkajo |
| konstruira stožnice | **VR** | `MAT-SS-3/elipsa-hiperbola-parabola` | delno – le elipsa z vrvico; konstrukcije hiperbole in parabole manjkajo |
| nariše stožnico tudi z uporabo primernega računalniškega programa | **VR** | `MAT-SS-3/elipsa-hiperbola-parabola` | delno – simulacija le za opazovanje vsote razdalj, ne za risanje stožnic |
| analizira grafično predstavitev hiperbole in parabole v premaknjeni legi | **VR** | `MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente` | da – C3 (14. 11. 2026) |
| analizira enačbo hiperbole in parabole v premaknjeni legi | **VR** | `MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente` | da – C3 (14. 11. 2026) |
| analitično in grafično obravnava tangento stožnice | **VR** | `MAT-SS-3/kroznica`, `MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente` | da – C3 (14. 11. 2026) |
| analitično in grafično določi presečišča stožnice s premico in določi presečišča stožnic v središčni legi | OR+VR | `MAT-SS-3/kroznica` | delno – le premica–krožnica; druge stožnice s premico in med sabo manjkajo |
| utemelji smiselnost rezultatov pri analitični obravnavi presečišč | OR+VR | `MAT-SS-3/kroznica` | da |
| rešuje problemske naloge (stožnice) | **VR** | `MAT-SS-3/elipsa-hiperbola-parabola`, `MAT-SS-3/kroznica` | da – Primera 3, 4 (ogledalo, antena); mešano z OR, brez oznake |


### 4.12 Zaporedja in vrste

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Definicija zaporedja | OR+VR | `MAT-SS-4/zaporedja` | da |
| Lastnosti zaporedij (končno, neskončno, monotonost, omejenost, konvergentnost …) | OR+VR | `MAT-SS-4/zaporedja` | da – končno/neskončno zaporedje ni posebej omenjeno |
| Aritmetično zaporedje | OR+VR | `MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje` | da |
| Geometrijsko zaporedje | OR+VR | `MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje` | da |
| Vsota prvih n členov aritmetičnega zaporedja in vsota členov geometrijskega zaporedja | OR+VR | `MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje` | da |
| Limita zaporedja | OR+VR | `MAT-SS-4/zaporedja` | da |
| Vrste | OR+VR | `MAT-SS-4/geometrijska-vrsta` | da – le geometrijska vrsta; delne vsote in konvergenca na njej |
| Konvergenca geometrijske vrste | OR+VR | `MAT-SS-4/geometrijska-vrsta` | da |
| Obrestni račun | OR+VR | `MAT-SS-4/obrestni-racun` | da |
| Anuitete | OR+VR | `MAT-SS-4/anuitete-in-amortizacijski-nacrt` | da – C3 (14. 11. 2026) |
| Amortizacijski načrt | OR+VR | `MAT-SS-4/anuitete-in-amortizacijski-nacrt` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| navede primer, induktivno sklepa, posplošuje in nadaljuje zaporedje | OR+VR | `MAT-SS-4/zaporedja`, `MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje` | delno – ni vaj z nadaljevanjem zaporedja po vzorcu |
| najde in zapiše zvezo med členi zaporedja | OR+VR | `MAT-SS-4/zaporedja`, `MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje` | da |
| zapiše člene zaporedja pri danih začetnih členih in rekurzivni formuli | OR+VR | `MAT-SS-4/zaporedja` | da |
| ugotovi in analizira lastnosti različno predstavljenih zaporedij (številske predstavitve, grafični prikaz, analitični zapis …) | OR+VR | `MAT-SS-4/zaporedja` | da |
| bere in ponazori različno podana oziroma predstavljena zaporedja | OR+VR | `MAT-SS-4/zaporedja` | da |
| uporabi lastnosti zaporedij | OR+VR | `MAT-SS-4/zaporedja` | da |
| napove in izračuna limito zaporedja | OR+VR | `MAT-SS-4/zaporedja` | da |
| razlikuje vrsto od zaporedja | OR+VR | `MAT-SS-4/geometrijska-vrsta` | da |
| razlikuje pojma konvergentne in divergentne vrste | OR+VR | `MAT-SS-4/geometrijska-vrsta` | da |
| izračuna vsoto n členov zaporedja | OR+VR | `MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje` | da |
| izračuna vsoto geometrijske vrste | OR+VR | `MAT-SS-4/geometrijska-vrsta` | da |
| razlikuje navadno in obrestno obrestovanje | OR+VR | `MAT-SS-4/obrestni-racun` | da |
| razlikuje med konformno in relativno obrestno mero | OR+VR | `MAT-SS-4/obrestni-racun` | delno – relativna le v Bolj natančno; konformna obrestna mera manjka |
| uporabi načelo ekvivalence glavnic | OR+VR | `MAT-SS-4/anuitete-in-amortizacijski-nacrt` | da – C3 (14. 11. 2026) |
| poišče realne primere obrestovanja, napove pričakovanja in se odloči na osnovi simulativnih izračunov | OR+VR | `MAT-SS-4/obrestni-racun` | da – uganka z bankama A in B, primerjalna tabela |
| izračuna anuiteto in izdela amortizacijski načrt | OR+VR | `MAT-SS-4/anuitete-in-amortizacijski-nacrt` | da – C3 (14. 11. 2026) |


### 4.13 Diferencialni račun

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Diferenčni količnik, odvod, geometrijski pomen odvoda | OR+VR | `MAT-SS-4/odvod` | da |
| Pravila za odvajanje, odvodi osnovnih funkcij | OR+VR | `MAT-SS-4/odvod` | da |
| Uporaba odvoda | OR+VR | `MAT-SS-4/uporaba-odvoda` | da |
| Ekstremi, naraščanje in padanje funkcije | OR+VR | `MAT-SS-4/uporaba-odvoda` | da |
| Drugi odvod funkcije | **VR** | `MAT-SS-4/drugi-odvod-prevoj-in-konveksnost` | da – C3 (14. 11. 2026) |
| Prevoj, konveksnost in konkavnost funkcije | **VR** | `MAT-SS-4/drugi-odvod-prevoj-in-konveksnost` | da – C3 (14. 11. 2026) |
| Zveznost odvedljivih funkcij | **VR** | `MAT-SS-4/odvedljivost-in-implicitni-odvod` | da – C3 (14. 11. 2026) |
| Ekstremalni problemi | OR+VR | `MAT-SS-4/uporaba-odvoda` | da |
| Modeliranje realnih problemov in njihovo reševanje z uporabo metod diferencialnega računa | **VR** | `MAT-SS-4/uporaba-odvoda`, `MAT-SS-4/odvod` | da – Primer 3 (spletna trgovina), Primer 4 (škatla); mešano z OR, brez oznake |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| opiše pojme diferencialnega računa z uporabo grafičnih, številskih ali analitičnih prezentacij | OR+VR | `MAT-SS-4/odvod` | da |
| izračuna vrednost diferenčnega količnika | OR+VR | `MAT-SS-4/odvod` | da |
| izračuna limito diferenčnega količnika | OR+VR | `MAT-SS-4/odvod` | da |
| razloži geometrijski pomen odvoda | OR+VR | `MAT-SS-4/odvod`, `MAT-SS-4/uporaba-odvoda` | da |
| izpelje preprosta pravila odvajanja z uporabo definicije odvoda | **VR** | `MAT-SS-4/odvod` | delno – le vzorec za x², x³ (blok 3); izpeljave pravil za vsoto, produkt manjkajo |
| izpelje odvode funkcij z uporabo pravil za odvajanje | **VR** | `MAT-SS-4/odvod` | delno – tabela odvodov brez izpeljav, npr. (tan x)' ni izpeljan |
| odvaja elementarne funkcije in kompozitum funkcij | OR+VR | `MAT-SS-4/odvod` | da |
| računa odvod implicitno podanih funkcij | **VR** | `MAT-SS-4/odvedljivost-in-implicitni-odvod` | da – C3 (14. 11. 2026) |
| ugotovi točke (ne)odvedljivosti iz grafa | OR+VR | `MAT-SS-4/odvedljivost-in-implicitni-odvod` | da – C3 (14. 11. 2026) |
| povezuje lastnosti funkcij in njen odvod (napoveduje lastnosti, skicira graf …) | OR+VR | `MAT-SS-4/uporaba-odvoda` | da |
| zapiše enačbi tangente in normale v dani točki krivulje | OR+VR | `MAT-SS-4/uporaba-odvoda` | da – C3 (14. 11. 2026) |
| izračuna presečni kot med krivuljama | OR+VR | `MAT-SS-4/uporaba-odvoda` | da – C3 (14. 11. 2026) |
| analizira funkcijo z odvodom (razloži ekstreme, določi intervale naraščanja in padanja) in nariše graf | OR+VR | `MAT-SS-4/uporaba-odvoda` | da |
| poveže pojma zveznosti in odvedljivosti funkcije na danem intervalu | **VR** | `MAT-SS-4/limita-in-zveznost-funkcije`, `MAT-SS-4/odvod` | delno – zveznost in odvedljivost obravnavani ločeno; povezave ni |
| reši preprost ekstremalni problem | OR+VR | `MAT-SS-4/uporaba-odvoda` | da |
| reši realen ekstremalni problem in ga ustrezno interpretira | **VR** | `MAT-SS-4/uporaba-odvoda` | da |


### 4.14 Integralski račun

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Nedoločeni integral (primitivna funkcija) | OR+VR | `MAT-SS-4/nedoloceni-integral` | da |
| Lastnosti nedoločenega integrala | OR+VR | `MAT-SS-4/nedoloceni-integral` | da |
| Uvedba nove spremenljivke | **VR** | `MAT-SS-4/nedoloceni-integral` | da |
| Integracija »per partes« | **VR** | `MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij` | da – C3 (14. 11. 2026) |
| Integracija racionalnih funkcij | **VR** | `MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij` | da – C3 (14. 11. 2026) |
| Določeni integral | OR+VR | `MAT-SS-4/doloceni-integral` | da |
| Lastnosti določenega integrala | OR+VR | `MAT-SS-4/doloceni-integral` | delno – le predznak in deljenje v ničlah; aditivnost, zamenjava mej manjkata |
| Zveza med določenim in nedoločenim integralom | OR+VR | `MAT-SS-4/doloceni-integral` | da |
| Uporaba določenega integrala: ploščine | OR+VR | `MAT-SS-4/doloceni-integral` | da – ploščina med krivuljama le formula, brez primera |
| Uporaba določenega integrala: prostornine vrtenin | **VR** | `MAT-SS-4/doloceni-integral` | da |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| razloži zvezo med odvodom funkcije in nedoločenim integralom | OR+VR | `MAT-SS-4/nedoloceni-integral` | da |
| pozna tabelo osnovnih integralov in njeno povezavo s tabelo odvodov | OR+VR | `MAT-SS-4/nedoloceni-integral` | da |
| uporablja lastnosti nedoločenega integrala | OR+VR | `MAT-SS-4/nedoloceni-integral` | da |
| integrira z uvedbo nove spremenljivke | **VR** | `MAT-SS-4/nedoloceni-integral` | da |
| integrira »per partes« | **VR** | `MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij` | da – C3 (14. 11. 2026) |
| integrira racionalne funkcije (z razcepom na parcialne ulomke) | **VR** | `MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij` | da – C3 (14. 11. 2026) |
| pozna geometrijski pomen določenega integrala | OR+VR | `MAT-SS-4/doloceni-integral` | da |
| uporablja lastnosti določenega integrala | OR+VR | `MAT-SS-4/doloceni-integral` | delno – le predznak in deljenje v ničlah; aditivnost, zamenjava mej manjkata |
| uporabi zvezo med določenim in nedoločenim integralom | OR+VR | `MAT-SS-4/doloceni-integral` | da |
| reši preproste matematične in realne probleme | OR+VR | `MAT-SS-4/doloceni-integral`, `MAT-SS-4/nedoloceni-integral` | da |


### 4.15 Kombinatorika

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Osnovni izrek kombinatorike, kombinatorično drevo | OR+VR | `MAT-SS-4/kombinatorika` | da |
| Pravilo vsote | OR+VR | `MAT-SS-4/kombinatorika` | da – C3 (14. 11. 2026) |
| Permutacije | OR+VR | `MAT-SS-4/kombinatorika` | da |
| Permutacije s ponavljanjem | OR+VR | `MAT-SS-4/kombinatorika` | da – C3 (14. 11. 2026) |
| Variacije | OR+VR | `MAT-SS-4/kombinatorika` | da |
| Variacije s ponavljanjem | OR+VR | `MAT-SS-4/kombinatorika` | da |
| Kombinacije | OR+VR | `MAT-SS-4/kombinatorika` | da |
| Binomski izrek | OR+VR | `MAT-SS-4/binomski-izrek` | da – C3 (14. 11. 2026) |
| Pascalov trikotnik | OR+VR | `MAT-SS-4/binomski-izrek` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| izračuna n! | OR+VR | `MAT-SS-4/kombinatorika` | da |
| loči posamezne kombinatorične pojme | OR+VR | `MAT-SS-4/kombinatorika` | da |
| izračuna vrednost binomskega simbola | OR+VR | `MAT-SS-4/kombinatorika` | da |
| razvije potenco dvočlenika | OR+VR | `MAT-SS-1/algebrski-izrazi`, `MAT-SS-4/binomski-izrek` | da – C3 (14. 11. 2026) |


### 4.16 Verjetnostni račun

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Osnovni pojmi verjetnostnega računa: poskus, dogodek, vzorčni prostor | OR+VR | `MAT-SS-4/verjetnost` | da – C4 (14. 11. 2026) |
| Računanje z dogodki | OR+VR | `MAT-SS-4/verjetnost` | da |
| Subjektivna verjetnost, empirična verjetnost, matematična verjetnost, verjetnost dogodka | OR+VR | `MAT-SS-4/verjetnost` | delno – klasična navedena kot znana, empirična s simulacijo; subjektivna manjka |
| Računanje verjetnosti nasprotnih dogodkov, vsote dogodkov | OR+VR | `MAT-SS-4/verjetnost` | da |
| Pogojna verjetnost | **VR** | `MAT-SS-4/verjetnost` | da |
| Verjetnost produkta, neodvisna dogodka | **VR** | `MAT-SS-4/verjetnost`, `MAT-SS-4/mesane-maturitetne-naloge` | da |
| Zaporedje neodvisnih poskusov | **VR** | `MAT-SS-4/verjetnost`, `MAT-SS-4/mesane-maturitetne-naloge`, `MAT-SS-4/zaporedje-neodvisnih-poskusov` | da – C3 (14. 11. 2026) |
| Normalna porazdelitev | OR+VR | `MAT-SS-4/statistika` | da – v lekciji napačno označena kot višja raven |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| zapiše dogodke in računa z njimi | OR+VR | `MAT-SS-4/verjetnost` | da |
| poišče vse dogodke nekega poskusa | OR+VR | `MAT-SS-4/verjetnost` | delno – naštevanje vseh dogodkov poskusa manjka |
| razlikuje med subjektivno, empirično in matematično verjetnostjo | OR+VR | `MAT-SS-4/verjetnost` | delno – subjektivna verjetnost manjka |
| razume in poveže empirično in matematično verjetnost | OR+VR | `MAT-SS-4/verjetnost` | delno – le simulacija relativne frekvence v enem odstavku |
| pozna in uporablja definicijo matematične verjetnosti | OR+VR | `MAT-SS-4/verjetnost` | delno – klasična definicija le navedena kot že znana, brez razlage |
| iz danih verjetnosti posameznih dogodkov računa verjetnosti drugih dogodkov | OR+VR | `MAT-SS-4/verjetnost` | da |
| loči med pojmoma nezdružljiva in neodvisna dogodka | **VR** | `MAT-SS-4/verjetnost` | da |
| uporablja vzorčni prostor | OR+VR | `MAT-SS-4/verjetnost` | da – C4 (14. 11. 2026) |


### 4.17 Statistika

| Vsebina | Raven | Lekcija | Pokritost |
|---|---|---|---|
| Osnovni statistični pojmi | OR+VR | `MAT-SS-1/obdelava-podatkov` | delno – vzorec in populacija le v Bolj natančno |
| Vrste podatkov | OR+VR | `MAT-SS-1/obdelava-podatkov` | delno – le omemba kategorij v povratni informaciji kviza |
| Zbiranje podatkov | OR+VR | `MAT-SS-4/statisticna-naloga` | da – C3 (14. 11. 2026) |
| Urejanje in strukturiranje podatkov | OR+VR | `MAT-SS-1/obdelava-podatkov` | da – frekvenčna tabela, razredi, razredna sredina |
| Prikazovanje podatkov (stolpčni, pozicijski, tortni diagram, histogram, razsevni diagram, linijski in krivuljni diagram, škatla z brki) | OR+VR | `MAT-SS-1/obdelava-podatkov`, `MAT-SS-4/statistika` | delno – manjkajo pozicijski, razsevni, linijski in krivuljni diagram |
| Aritmetična sredina, mediana, modus | OR+VR | `MAT-SS-1/obdelava-podatkov`, `MAT-SS-4/statistika` | da |
| Variacijski razmik, standardni odklon, medčetrtinski razmik | OR+VR | `MAT-SS-1/obdelava-podatkov`, `MAT-SS-4/statistika` | da |
| Statistična naloga | OR+VR | `MAT-SS-4/statisticna-naloga` | da – C3 (14. 11. 2026) |

| Cilj (kandidat …) | Raven | Lekcija | Pokritost |
|---|---|---|---|
| loči med preučevano značilnostjo (spremenljivko), enoto, vrednostjo spremenljivke, vzorcem, populacijo | OR+VR | `MAT-SS-1/obdelava-podatkov` | delno – vzorec, populacija le v Bolj natančno; brez vaj |
| prepozna preučevano značilnost enote | OR+VR | `MAT-SS-1/obdelava-podatkov` | delno – le definicija spremenljivke; brez vaj |
| razlikuje med opisnimi ali kvalitativnimi podatki, vrstnimi ali ordinalnimi ter številskimi ali kvantitativnimi podatki | OR+VR | `MAT-SS-1/obdelava-podatkov` | delno – vrste podatkov (opisni, vrstni, številski) niso razložene |
| zbere podatke, jih uredi in strukturira | OR+VR | `MAT-SS-1/obdelava-podatkov`, `MAT-SS-4/statisticna-naloga` | da – C3 (14. 11. 2026) |
| izbere ustrezni diagram za prikaz podatkov | OR+VR | `MAT-SS-1/obdelava-podatkov` | da |
| bere, izdela in interpretira statistične diagrame | OR+VR | `MAT-SS-1/obdelava-podatkov`, `MAT-SS-4/statistika` | da |
| razvija kritični odnos do interpretacije rezultatov | OR+VR | `MAT-SS-1/obdelava-podatkov`, `MAT-SS-4/statistika` | da – splošni cilj; kviza o plačah in povprečni porabi |
| pozna in uporablja različne načine povzemanja podatkov | OR+VR | `MAT-SS-1/obdelava-podatkov`, `MAT-SS-4/statistika` | da |
| izbere primeren način povzemanja podatkov glede na vrsto podatkov | OR+VR | `MAT-SS-1/obdelava-podatkov`, `MAT-SS-4/statistika` | delno – izbira glede na osamelce; izbira glede na vrsto podatkov manjka |
| izračuna, oceni in interpretira srednjo vrednost, modus in mediano kot mere osredinjenosti podatkov | OR+VR | `MAT-SS-1/obdelava-podatkov`, `MAT-SS-4/statistika` | da |
| ocenjuje preproste povezave med statističnimi spremenljivkami | OR+VR | `MAT-SS-4/statisticna-naloga` | da – C3 (14. 11. 2026) |
| izračuna, oceni in interpretira variacijski razmik, standardni odklon in medčetrtinski razmik kot mere razpršenosti podatkov | OR+VR | `MAT-SS-1/obdelava-podatkov`, `MAT-SS-4/statistika` | da |
| uporabi znanje o delu s podatki v celovitem postopku empiričnega preiskovanja (izbere temo, postavi preiskovalno vprašanje, zbere podatke, jih uredi in strukturira, analizira, prikaže in interpretira rezultate) | OR+VR | `MAT-SS-4/statisticna-naloga` | da – C3 (14. 11. 2026) |

