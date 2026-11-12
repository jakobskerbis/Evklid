---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Antibiotik nobene bakterije ne naredi odporne. Pa vendar je po zdravljenju z antibiotikom v telesu pogosto več odpornih bakterij kot pred njim. Zveni kot protislovje: zdravilo ubija bakterije, a povzroči, da so bakterije »močnejše«.

Zato zdravnica antibiotika ne predpiše brez potrebe (na viruse, ki povzročajo prehlad, sploh ne deluje) in te opozori, da moraš predpisano zdravljenje končati, tudi če se počutiš bolje. Okužbe z odpornimi bakterijami so danes eden največjih problemov bolnišnic.

Protislovje razreši ena ideja: **evolucija ne spreminja posameznika, ampak sestavo populacije.** Ko razumeš, kako se ta sestava spreminja, razumeš tudi odpornost, rejo psov in to, zakaj se nekatere dedne bolezni ohranjajo stoletja.

## Razlaga

**Mamljiva, a napačna razlaga.** Večina ljudi bi rekla: »Bakterije se na antibiotik navadijo, tako kot se mi navadimo na mraz.« Po tej razlagi bi antibiotik v bakteriji sprožil spremembo, ta pa bi se prenesla na potomce. Tako je razmišljal že Lamarck v začetku 19. stoletja: lastnosti, pridobljene med življenjem, naj bi se dedovale.

Razlaga je napačna, ker sprememba v telesu ne spremeni DNA. Mišice, ki jih natreniraš, ne preidejo na tvoje otroke. Pravilno sliko sestavimo v petih korakih.

:::premisli
Če bi imela »razlaga z navajanjem« prav, kaj bi pričakoval: ali so v populaciji bakterij, ki antibiotika ni nikoli srečala, že odporne bakterije?
---
Po razlagi z navajanjem jih ne bi bilo. Poskusi (npr. Lederbergov iz leta 1952) pa so pokazali, da odporne bakterije obstajajo že prej. Antibiotik jih ne ustvari, le razkrije in pusti preživeti.
:::

**1. Variabilnost.** **Populacija** so osebki iste vrste, ki živijo na istem območju in se med seboj razmnožujejo. Osebki v njej niso enaki: razlikujejo se po višini, krvni skupini, občutljivosti za zdravila. Tem razlikam pravimo **variabilnost**. Brez nje evolucija ne more potekati, saj ni ničesar, med čimer bi narava »izbirala«.

**2. Mutacije in rekombinacije.** Različne oblike istega gena imenujemo **aleli**. Novi aleli nastanejo z **mutacijami**, naključnimi spremembami DNA, na primer napakami pri podvajanju. Mutacija nastane ne glede na to, ali bi organizmu koristila. Večina je nevtralnih ali škodljivih, redka je koristna, a le ob določenih pogojih.

**Rekombinacije** novih alelov ne ustvarijo, ampak obstoječe premešajo v nove kombinacije. Pri spolnem razmnoževanju se to zgodi na tri načine: pri prekrižanju (crossing-over) med mejozo, pri naključni razporeditvi kromosomov v spolne celice (gamete) in pri naključni oploditvi. Zato si bratje in sestre niso enaki. Bakterije se razmnožujejo nespolno, a si lahko izmenjajo koščke DNA (plazmide), tudi tiste z aleli za odpornost.

**3. Naravni izbor deluje na fenotip.** **Genotip** je zapis alelov v osebku, **fenotip** so njegove izražene lastnosti. Antibiotik »ne vidi« DNA, deluje na beljakovine in celično steno, torej na fenotip. Preživijo in se razmnožijo tisti, katerih fenotip v danem okolju deluje bolje. Temu pravimo **naravni izbor**.

Ker izbor vidi le fenotip, se **recesivni** alel (izrazi se le, če ga ima osebek dvakrat) lahko skriva v **heterozigotih** (osebkih z dvema različnima aleloma), ki so zdravi. Izbor ga zato odstranjuje zelo počasi.

**4. Genski sklad.** **Genski sklad** so vsi aleli vseh osebkov populacije. Opišemo ga s **pogostostjo alelov**: kolikšen delež vseh alelov nekega gena je določen alel. **Evolucija je sprememba pogostosti alelov v genskem skladu iz generacije v generacijo.** Posameznik se ne razvija, razvija se populacija.

**5. Dejavniki, ki spremenijo genski sklad:**

| Dejavnik | Kaj naredi | Primer iz medicine |
|---|---|---|
| mutacija | doda nov alel | bakterija dobi alel za encim, ki razgradi penicilin |
| naravni izbor | poveča delež alelov z boljšim fenotipom | antibiotik ubije občutljive, odporne ostanejo |
| migracija | priseljenci prinesejo ali odnesejo alele (pretok genov) | bolnik prenese odporne bakterije v drugo bolnišnico |
| genski zdrs | naključno spremeni pogostost v majhni populaciji | po močnem zdravljenju preživi le peščica bakterij, ne nujno najboljših |

Simulacija spodaj »Genski sklad: zdrs in izbor« prikazuje pogostost $p$ alela A skozi generacije. Izberi $N = 20$ in nekajkrat pritisni »10 generacij«, nato enako ponovi z $N = 1000$. Preden pritisneš, napovej, v kateri populaciji bo $p$ bolj naključno skakal, in napoved preveri. Nato vklopi izbor proti aa in opazuj, kako počasi pada delež alela a, ko postane redek.

**Umetni izbor.** Kadar o tem, kdo se razmnoži, odloča človek, govorimo o **umetnem izboru**. Tako so iz volka nastale pasme psov, iz divjega zelja pa brokoli, cvetača in ohrovt. Mehanizem je enak kot pri naravnem izboru, le »izbiralec« je drug. Odpornost na antibiotike je pravzaprav naravni izbor, ki ga sproži človek: antibiotik smo v okolje prinesli mi.

**Odpornost** se ne pojavlja le pri bakterijah. Žuželke postanejo odporne na insekticide, virusi HIV na protivirusna zdravila, rakave celice na kemoterapijo. Povsod velja isto: v pestri populaciji zdravilo preživijo redki, ki se nato namnožijo.

:::premisli
Zakaj zdravniki okužbo s HIV zdravijo s kombinacijo treh zdravil hkrati, ne z enim?
---
Za odpornost na vsako zdravilo je potrebna druga mutacija. Če ima mutacijo za eno zdravilo, recimo, en virus na $10$ milijonov, je verjetnost, da ima en virus vse tri hkrati, $10^{-7} \cdot 10^{-7} \cdot 10^{-7} = 10^{-21}$. Takega virusa v telesu praktično ni, zato izbor nima česa izbrati.
:::

## Rešeni primeri

### Primer 1: pogostost alela za prebavo mleka

Sposobnost odraslih, da prebavljajo laktozo, določa dominantni alel L; ljudje z genotipom ll laktoze kot odrasli ne prebavljajo. V vzorcu $100$ ljudi je $36$ LL, $48$ Ll in $16$ ll. Kolikšna je pogostost alela L?

**Podatki:** $100$ ljudi: $36$ LL, $48$ Ll, $16$ ll; vsak človek ima dva alela tega gena
**Iščemo:** pogostost alela L, $p$

:::formula
$p = \dfrac{\text{število alelov L}}{\text{število vseh alelov}}$
:::

**Rešitev:**

1. Vseh alelov je dvakrat toliko kot ljudi, ker ima vsak dva: $2 \cdot 100 = 200$.
2. Homozigot LL (dva enaka alela) prispeva dva alela L, heterozigot enega: $2 \cdot 36 + 48 = 120$.
3. $p = \dfrac{120}{200} = 0{,}6$.
4. Odgovor: pogostost alela L je $0{,}6$ ($60\,\%$ alelov v genskem skladu).

### Primer 2: kako odporne bakterije prevladajo

V okuženem tkivu je milijarda ($10^9$) bakterij. Alel za odpornost ima ena bakterija na $10$ milijonov. Antibiotik ubije vse občutljive, odporne pa se delijo na dvoje vsakih $30$ minut. Koliko odpornih bakterij je pred zdravljenjem in koliko jih je po $5$ urah?

**Podatki:** $N = 10^9$ bakterij, delež odpornih $\dfrac{1}{10^7}$, čas delitve $30\,\mathrm{min}$, čas $5\,\mathrm{h}$
**Iščemo:** število odpornih pred zdravljenjem in po $5\,\mathrm{h}$

:::formula
$N_\mathrm{odp} = N \cdot \text{delež}$, nato $N_\mathrm{po} = N_\mathrm{odp} \cdot 2^n$, kjer je $n$ število delitev
:::

**Rešitev:**

1. Pred zdravljenjem: $\dfrac{10^9}{10^7} = 100$ odpornih bakterij. To je le $0{,}00001\,\%$ populacije.
2. Število delitev: $5\,\mathrm{h} = 300\,\mathrm{min}$, $\dfrac{300}{30} = 10$, ker se vsakih $30$ minut število podvoji.
3. Po $5$ urah: $100 \cdot 2^{10} = 102\,400$ bakterij.
4. Odgovor: pred zdravljenjem je bilo $100$ odpornih bakterij; po $5$ urah jih je $102\,400$ in so vse odporne. Antibiotik ni ustvaril nobene nove, spremenil je le sestavo populacije.

### Primer 3: zakaj recesivna bolezen ne izgine

V populaciji $1000$ ljudi je $810$ AA, $180$ Aa in $10$ aa. Genotip aa povzroča hudo recesivno bolezen; bolniki pred razvojem medicine niso imeli otrok. Kolikšna je pogostost alela a, kolikšen delež alelov a je skrit v zdravih heterozigotih in kolikšna bi bila pogostost a, če aa ne bi imeli potomcev?

**Podatki:** $810$ AA, $180$ Aa, $10$ aa (skupaj $1000$ ljudi); aa nimajo potomcev
**Iščemo:** pogostost $q$ alela a pred izborom, delež alelov a v heterozigotih in $q$ po izboru

:::formula
$q = \dfrac{\text{število alelov a}}{\text{število vseh alelov}}$
:::

**Rešitev:**

1. Aleli a: vsak Aa ima enega, vsak aa dva: $180 + 2 \cdot 10 = 200$. Vseh alelov je $2 \cdot 1000 = 2000$, zato $q = \dfrac{200}{2000} = 0{,}1$.
2. V heterozigotih je $\dfrac{180}{200} = 0{,}9$, torej $90\,\%$ vseh alelov a. Ti ljudje so zdravi, zato jih izbor ne »vidi«.
3. Izbor odstrani le $10$ bolnikov. Preostane $990$ ljudi in $180$ alelov a. Izračunaj novo pogostost sam.

:::premisli
Kolikšna je nova pogostost $q$ in kaj pove o hitrosti izbora?
---
Vseh alelov je $2 \cdot 990 = 1980$, zato $q = \dfrac{180}{1980} \approx 0{,}091$. Pogostost pade le z $0{,}1$ na približno $0{,}091$: izbor deluje na fenotip, večina alelov a pa je skrita v zdravih nosilcih.
:::

## Pogoste napake

- **»Bakterije se na antibiotik navadijo.«** Mamljivo, ker se tudi telo navadi na napor. A antibiotik ne spremeni DNA bakterije. Odporne bakterije so obstajale že prej (mutacija), antibiotik je le pobil druge.
- **»Odporen postane bolnik.«** Na antibiotik je odporna bakterija, ne človek. Človek, ki pogosto jemlje antibiotike, nosi več odpornih bakterij, njegovo telo pa se ni spremenilo.
- **»Mutacija nastane, ko jo organizem potrebuje.«** Mutacije so naključne glede na potrebe. Koristna je lahko le po naključju, ker se okolje spremeni (pride antibiotik).
- **»Naravni izbor hitro odstrani vse škodljive alele.«** Izbor deluje na fenotip. Recesivni aleli se skrivajo v zdravih heterozigotih, zato ostajajo v genskem skladu dolgo, kot kaže primer 3.
- **»Evolucija se zgodi posamezniku.«** Posameznik ima vse življenje iste alele. Spreminja se pogostost alelov v populaciji iz generacije v generacijo.

## Povzetek

- Variabilnost (razlike med osebki) je pogoj za evolucijo.
- Mutacije so edini vir novih alelov in so naključne; rekombinacije (prekrižanje, razporeditev kromosomov, oploditev) obstoječe alele premešajo.
- Naravni izbor deluje na fenotip; recesivni aleli se skrivajo v heterozigotih.
- Genski sklad so vsi aleli populacije; evolucija je sprememba pogostosti alelov.
- Genski sklad spreminjajo mutacije, naravni izbor, migracije (pretok genov) in genski zdrs (naključje v majhnih populacijah).
- Umetni izbor: izbira človek (pasme, sorte). Odpornost na antibiotike je izbor, ki ga sproži človek: zdravilo ne ustvari odpornih, ampak pobije občutljive.

## Drugače: Kot zgodba

Leta 1928 je Alexander Fleming odkril penicilin, v štiridesetih letih pa je penicilin rešil tisoče ranjencev. Ko je leta 1945 prejel Nobelovo nagrado, je opozoril: kdor bo jemal premalo penicilina, bo vzgojil bakterije, ki ga preživijo.

Zamisli si Majo z vnetjem mandljev. V njenem grlu živi milijarda bakterij. Skoraj vse so občutljive za penicilin, nekaj sto pa jih ima zaradi davne mutacije alel za encim, ki penicilin razgradi. Maja začne jemati tablete. Občutljive bakterije umirajo na tisoče. Po treh dneh se počuti dobro in tablete pospravi v predal.

Kdo je ostal? Najbolj odporni. Zdaj nimajo več tekmecev za hrano in prostor, zato se hitro namnožijo. Ko se vnetje vrne, je populacija v Majinem grlu drugačna: večina bakterij je odpornih. Maja se ni spremenila, njene bakterije se tudi niso »naučile«. Spremenila se je sestava populacije.

Ko Maja kihne v čakalnici, del teh bakterij preide na druge ljudi. To je migracija: aleli za odpornost vstopijo v nov genski sklad.

## Drugače: Korak za korakom s številkami

Začnemo s $1000$ občutljivimi in $10$ odpornimi bakterijami. Vsak dan antibiotik ubije $90\,\%$ občutljivih, odpornih ne. Preživele se do naslednjega dne podvojijo.

| Dan | Občutljive | Odporne | Delež odpornih |
|---|---|---|---|
| 0 | $1000$ | $10$ | $\approx 1\,\%$ |
| 1 | $200$ | $20$ | $\approx 9\,\%$ |
| 2 | $40$ | $40$ | $50\,\%$ |
| 3 | $8$ | $80$ | $\approx 91\,\%$ |

Račun za dan 1: občutljivih ostane $10\,\%$ od $1000$, to je $100$, podvojijo se na $200$. Odporne se le podvojijo: $10 \cdot 2 = 20$. Delež: $\dfrac{20}{220} \approx 0{,}09$.

Kaj pove tabela? Odpornih je vsak dan le dvakrat več, delež pa skoči z $1\,\%$ na $91\,\%$. Če zdravljenje prekineš drugi dan, je že polovica bakterij odpornih, občutljive pa niso povsem pobite. Model je poenostavljen: v telesu peščico preostalih bakterij običajno odstrani imunski sistem. Bistvo pa drži: vsako zdravljenje z antibiotikom je izbor v korist odpornih, zato ga jemljemo le, kadar je res potreben, in tako, kot je predpisano.

## Preveri se

? Biologinja reče: »V genskem skladu te populacije komarjev se je povečala pogostost alela za odpornost na insekticid.« Kaj je genski sklad?
- Geni enega komarja, ki je preživel škropljenje.
~ En osebek ima le dva alela vsakega gena. Genski sklad se nanaša na celotno populacijo.
+ Vsi aleli vseh osebkov populacije.
- Vsi komarji, ki so odporni na insekticid.
~ To je del populacije, ne njeni aleli. Genski sklad vključuje tudi alele občutljivih osebkov.
> Genski sklad so vsi aleli vseh osebkov populacije. Evolucija je sprememba pogostosti alelov v njem.

? Kateri vrstni red pravilno opiše nastanek odporne populacije bakterij?
- antibiotik → bakterije se spremenijo → odporne se namnožijo
~ To je Lamarckova razlaga. Antibiotik ne spremeni DNA; odporni aleli morajo obstajati že prej.
+ naključna mutacija → antibiotik ubije občutljive → odporne se namnožijo
- odporne se namnožijo → naključna mutacija → antibiotik ubije občutljive
~ Odporne se ne morejo namnožiti, preden alel za odpornost sploh obstaja (mutacija) in preden izbor odstrani tekmece.
> Najprej nastane alel z naključno mutacijo, nato izbor (antibiotik) pusti preživeti odporne, ti se namnožijo in spremenijo sestavo populacije.

? Tomaž po dveh dneh preneha jemati antibiotik, ker se počuti bolje. Kaj se zgodi s populacijo bakterij v njegovem grlu?
- Bakterije se naučijo, da jih antibiotik ne more ubiti.
~ Bakterije se ne učijo in antibiotik njihove DNA ne spremeni. Spremeni se, katere preživijo.
- Bolnik postane odporen na antibiotik in mu ta naslednjič ne bo pomagal.
~ Odporne so bakterije, ne bolnik. Telo bolnika se na antibiotik ne prilagodi.
+ Preživijo najbolj odporne bakterije, ki se namnožijo, zato se delež odpornih v populaciji poveča.
> Prekinjeno zdravljenje pobije le najbolj občutljive. Preživeli imajo manj tekmecev, zato se njihov delež poveča.

? V vzorcu $100$ ljudi je $49$ BB, $42$ Bb in $9$ bb. Kolikšna je pogostost alela B?
- $0{,}49$
~ To je le delež ljudi BB. Šteti moraš alele: tudi vsak Bb ima en alel B.
- $0{,}91$
~ To je delež ljudi, ki imajo vsaj en B. Šteti moraš alele, ne ljudi.
+ $0{,}7$
> Alelov B je $2 \cdot 49 + 42 = 140$, vseh alelov $200$, zato $p = \dfrac{140}{200} = 0{,}7$.

? Po zdravljenju ostane $20$ odpornih bakterij, ki se delijo na dvoje vsakih $20$ minut. Koliko jih je po $160$ minutah?
- $320$
~ To je $20 \cdot 8 \cdot 2$: $2^8$ si zamenjal z $2 \cdot 8$. Pri vsaki od $8$ delitev se število podvoji, zato je faktor $2^8 = 256$.
- $3200$
~ To je $20 \cdot 160$: čas ni število delitev. Najprej izračunaj, kolikokrat se bakterije delijo.
+ $5120$
> Delitev je $\dfrac{160}{20} = 8$, zato $20 \cdot 2^8 = 20 \cdot 256 = 5120$.

:::simboli
p | pogostost alela L | p = \dfrac{\text{število alelov L}}{\text{število vseh alelov}} | – | v simulaciji pogostost alela A; med 0 in 1
q | pogostost alela a | q = \dfrac{\text{število alelov a}}{\text{število vseh alelov}} | – | med 0 in 1
N | število bakterij v populaciji | | – | v simulaciji velikost populacije
N_{\mathrm{odp}} | število odpornih bakterij na začetku | N_\mathrm{odp} = N \cdot \text{delež} | –
N_{\mathrm{po}} | število odpornih bakterij po razmnoževanju | N_\mathrm{po} = N_\mathrm{odp} \cdot 2^n | –
n | število delitev | | – | ena delitev podvoji število bakterij
:::
