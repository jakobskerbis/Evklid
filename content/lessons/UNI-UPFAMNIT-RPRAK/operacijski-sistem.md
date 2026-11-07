---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na začetku šestdesetih let 20. stoletja je bil računalnik na univerzi en sam, velik in drag. Fiziki in inženirji so svoje programe oddali na luknjanih karticah, operater jih je naložil v vrsto in rezultate so dobili čez nekaj ur, pogosto naslednji dan. Ena pozabljena vejica je pomenila izgubljen dan. Fernando Corbató je z ekipo na MIT zato razvil sistem CTSS, enega prvih sistemov z **dodeljevanjem časa** (time-sharing): računalnik je v hitrem zaporedju preklapljal med več uporabniki, ki so sedeli za terminali, in vsak je imel občutek, da ima stroj zase.

Ideja, da en procesor razdeli svoj čas med več programov, je jedro vsakega operacijskega sistema, od telefona do računalnika, ki v fizikalnem laboratoriju bere detektor. Ko razumeš procese, razporejanje, naprave in datoteke, razumeš, zakaj meritev včasih »zamudi« podatek, zakaj ukaz v lupini čaka in kako izbrati sistem za poskus, ki ne sme izgubiti niti enega dogodka.

## Razlaga

### 1. Mamljiva ideja: programi tečejo hkrati in sami

Ko na prenosniku hkrati teče brskalnik, glasba in program za zajem meritev, se zdi: vsak program teče sam zase, neposredno na procesorju, in sam govori z diskom in zaslonom. Če ima računalnik eno jedro, naj bi programi tekli »res hkrati«.

Obe trditvi sta napačni. Jedro procesorja v vsakem trenutku izvaja ukaze **enega** programa. Vtis hkratnosti nastane, ker se programi izmenjujejo vsakih nekaj milisekund. Programi pa tudi ne smejo neposredno upravljati diska ali omrežne kartice: če bi dva programa hkrati pisala na isto mesto na disku, bi uničila podatke drug drugemu. Za oboje skrbi **operacijski sistem**.

**Definicija.** *Operacijski sistem* (OS) je programska oprema, ki upravlja vire računalnika (procesor, pomnilnik, naprave, datoteke) in jih programom ponuja prek enotnih, varnih storitev. Njegov osrednji del je **jedro** (kernel), ki teče v **jedrnem načinu** procesorja in sme izvajati privilegirane ukaze. Uporabniški programi tečejo v **uporabniškem načinu**.

Program za storitev jedra prosi s **sistemskim klicem**: odpri datoteko, preberi podatke, ustvari nov proces. Ob klicu procesor preklopi v jedrni način, jedro opravi delo in vrne rezultat. Ukazna lupina, ki jo spoznaš v naslednji lekciji, je navaden uporabniški program, ki za vsak ukaz kliče jedro.

### 2. Procesi

**Definicija.** *Proces* je program v izvajanju. Poleg kode ima svoje podatke, sklad, stanje registrov (tudi programski števec) in odprte datoteke. Jedro o vsakem procesu hrani **nadzorni blok procesa** (PCB) z identifikatorjem PID, stanjem, prioriteto in shranjenimi registri.

Isti program lahko teče kot več procesov: dve okni istega urejevalnika sta dva procesa z isto kodo in različnimi podatki.

Proces v življenju menja **stanja**:

- *nov*: jedro ga ustvarja;
- *pripravljen*: lahko bi tekel, čaka na procesor;
- *teče*: njegove ukaze izvaja procesor;
- *čaka* (blokiran): čaka na dogodek, na primer konec branja z diska;
- *končan*.

Poleg prehodov nov → pripravljen in teče → končan so med ostalimi stanji le štirje prehodi: razporejevalnik izbere pripravljen proces (pripravljen → teče); proces porabi svoj čas ali ga prekine pomembnejši (teče → pripravljen); proces zahteva vhod ali izhod (teče → čaka); dogodek se zgodi (čaka → pripravljen). Iz stanja »čaka« proces nikoli ne skoči neposredno v »teče«.

Ko jedro zamenja proces na procesorju, shrani registre starega v njegov PCB in naloži registre novega. To je **preklop konteksta**. Traja nekaj mikrosekund, v tem času pa noben uporabniški program ne napreduje.

:::premisli
Program za zajem meritev v zanki bere vrednosti z merilne kartice in jih piše v datoteko. V katerih stanjih ga boš videl, če ga opazuješ dalj časa, in v katerem bo največ časa?
---
Videl ga boš v stanjih teče, čaka in pripravljen. Največ časa bo v stanju čaka: branje kartice in pisanje na disk trajata veliko dlje od obdelave nekaj števil, med čakanjem pa jedro procesor da drugim procesom.
:::

### 3. Razporejanje procesorja

Kateri pripravljeni proces naj teče naslednji? To odloča **razporejevalnik** (scheduler). Merila za oceno razporejanja:

- **čas čakanja**: koliko časa proces preživi v stanju pripravljen;
- **čas obdelave** (turnaround): od prihoda do konca;
- **odzivni čas**: od prihoda do prvega teka; pomemben za interaktivne programe;
- **izkoriščenost** procesorja in **prepustnost** (končani procesi na časovno enoto).

Za proces s prihodom $t_\mathrm{p}$, trajanjem $b$ (čas, ki ga potrebuje na procesorju) in koncem $t_\mathrm{k}$ velja

$$t_\mathrm{o} = t_\mathrm{k} - t_\mathrm{p}$$

$$t_\mathrm{č} = t_\mathrm{o} - b$$

Glavni algoritmi:

- **FCFS** (kdor prej pride, prej melje): procesi tečejo po vrsti prihoda do konca. Preprost, a kratki procesi lahko dolgo čakajo za dolgim (*učinek konvoja*).
- **SJF** (najkrajši najprej): izbere proces z najkrajšim trajanjem. Predkupna različica **SRTF** prekine tekoči proces, če pride nov z manjšim preostankom.
- **Prioritetno razporejanje**: teče proces z najvišjo prioriteto. Nevarnost je **stradanje** procesov z nizko prioriteto; zdravilo je *staranje*, postopno višanje prioritete čakajočih.
- **Krožno razporejanje** (round robin, RR): vsak proces dobi časovno rezino (kvant) $q$; če v njej ne konča, gre na konec vrste. Dober odzivni čas, a več preklopov.

**Izrek (optimalnost SJF).** Če so vsi procesi pripravljeni ob istem času in jih izvajamo do konca brez prekinjanja, ima razpored po naraščajočem trajanju najmanjši povprečni čas čakanja med vsemi razporedi.

**Dokaz.** Vzemimo poljuben razpored, v katerem neposredno zaporedna procesa $X$ in $Y$ tečeta v vrstnem redu $X$, $Y$, čeprav je $b_X > b_Y$. Zamenjajmo ju. Procesi pred njima in za njima čakajo enako dolgo, saj se skupni čas $b_X + b_Y$ ne spremeni. Proces $Y$ zdaj čaka $b_X$ manj, proces $X$ pa $b_Y$ več. Skupni čas čakanja se spremeni za $b_Y - b_X < 0$, torej se zmanjša. Razporedov je končno mnogo, zato optimalen obstaja. Ta ne more imeti takega para, sicer bi ga zamenjava še izboljšala. Zaporedje brez sosednjega para z $b_X > b_Y$ pa je urejeno po naraščajočem trajanju. Vsi taki razporedi se razlikujejo le v vrstnem redu procesov z enakim trajanjem in imajo enak skupni čas čakanja. ∎

V praksi trajanja ne poznamo vnaprej. Sistemi ga ocenjujejo iz preteklih izvajanj, sodobni Linux pa uporablja razporejanje, ki procesom pravično deli čas in daje prednost tistim, ki so malo porabili.

:::premisli
Pri krožnem razporejanju zelo povečamo kvant $q$, tako da je daljši od vseh procesov. Na kateri algoritem se RR prelevi? Kaj pa, če je $q$ zelo majhen, primerljiv s preklopom konteksta?
---
Pri velikem $q$ vsak proces konča v prvi rezini, zato RR postane FCFS. Pri zelo majhnem $q$ je odziv odličen, a procesor večino časa porabi za preklope konteksta in skoraj nič za koristno delo.
:::

### 4. Naprave

Naprave (disk, tipkovnica, merilna kartica, omrežje) so mnogo počasnejše od procesorja. Jedro z njimi govori prek **gonilnikov**, programov, ki poznajo podrobnosti posamezne naprave in jih skrijejo za enoten vmesnik. Kako izvemo, da je naprava končala?

- **Poizvedovanje** (polling): procesor v zanki sprašuje napravo, ali je pripravljena. Preprosto, a zapravlja procesorski čas.
- **Prekinitve**: naprava, ko konča, pošlje procesorju signal. Procesor prekine trenutno delo, izvede kratko obdelavo prekinitve v jedru in nadaljuje. Proces, ki je čakal, postane pripravljen.
- **DMA** (neposreden dostop do pomnilnika): naprava sama prenese velik blok podatkov v pomnilnik in sproži eno prekinitev na koncu, ne ene na vsak bajt.

Jedro uporablja tudi **medpomnilnike** (buffer): podatki z naprave se zbirajo v pomnilniku, program pa jih bere v večjih kosih. Tako hitri izbruhi podatkov ne gredo v izgubo, če program trenutno ne teče.

### 5. Datoteke

**Definicija.** *Datoteka* je poimenovano zaporedje bajtov na trajnem pomnilniku. *Datotečni sistem* je del OS, ki datoteke organizira v **drevo imenikov**, hrani njihove **metapodatke** (velikost, lastnik, pravice, čas spremembe, lega na disku) in jim dodeljuje prostor.

Pot do datoteke je lahko **absolutna**, od korena drevesa (`/home/ana/meritve/run1.csv`), ali **relativna**, od trenutnega imenika (`meritve/run1.csv`).

Disk je razdeljen na **bloke** enake velikosti, pogosto $4096\,\mathrm{B}$. Datoteka zasede celo število blokov, zato zadnji blok navadno ni poln. Število blokov je

$$n_\mathrm{b} = \left\lceil \frac{s}{B} \right\rceil$$

kjer je $s$ velikost datoteke, $B$ velikost bloka, $\lceil\,\rceil$ pa zaokroževanje navzgor.

Sistemi tipa Unix ločijo **pravice** za lastnika, skupino in ostale. Vsaka trojka pove branje (`r`), pisanje (`w`) in izvajanje (`x`). Pravice `rwxr-x---` pomenijo: lastnik sme vse, skupina brati in izvajati, ostali nič. Zapišemo jih tudi osmiško, vsako trojko kot vsoto $r = 4$, $w = 2$, $x = 1$: zgornji primer je $750$.

## Rešeni primeri

### Primer 1: vrstni red pri FCFS

Na računalniku ob poskusu so ob času $0$ pripravljeni trije procesi: analiza spektra potrebuje $24\,\mathrm{ms}$, branje detektorja $3\,\mathrm{ms}$ in zapis v datoteko $3\,\mathrm{ms}$ procesorskega časa. Izračunaj povprečni čas čakanja pri FCFS, če prispejo v vrstnem redu analiza, branje, zapis, in če prispejo v obratnem redu dolžin.

**Podatki:** $b_\mathrm{A} = 24\,\mathrm{ms}$, $b_\mathrm{B} = 3\,\mathrm{ms}$, $b_\mathrm{Z} = 3\,\mathrm{ms}$, vsi prispejo ob $t = 0$
**Iščemo:** povprečni čas čakanja $\bar{t}$ v obeh vrstnih redih

:::formula
Pri FCFS proces čaka, dokler ne končajo vsi pred njim: $t_\mathrm{č} = t_\mathrm{o} - b$; $\bar{t} = \dfrac{t_{\mathrm{č},1} + t_{\mathrm{č},2} + t_{\mathrm{č},3}}{3}$
:::

**Rešitev:**

1. Vrstni red A, B, Z: analiza čaka $0$, branje $24$, zapis $24 + 3 = 27\,\mathrm{ms}$.
2. $\bar{t} = \dfrac{0 + 24 + 27}{3} = 17\,\mathrm{ms}$.
3. Vrstni red B, Z, A: čakanja $0$, $3$ in $6\,\mathrm{ms}$, zato $\bar{t} = \dfrac{0 + 3 + 6}{3} = 3\,\mathrm{ms}$.
4. Odgovor: povprečni čas čakanja je $17\,\mathrm{ms}$ oziroma $3\,\mathrm{ms}$. Ista opravila pri FCFS dajo zelo različen rezultat glede na vrstni red; drugi red je ravno SJF.

### Primer 2: krožno razporejanje

Ista tri opravila razporejamo krožno s kvantom $q = 4\,\mathrm{ms}$ v vrstnem redu analiza, branje, zapis. Določi razpored, povprečni čas čakanja in povprečni odzivni čas. Preklope konteksta zanemari.

**Podatki:** $b_\mathrm{A} = 24\,\mathrm{ms}$, $b_\mathrm{B} = 3\,\mathrm{ms}$, $b_\mathrm{Z} = 3\,\mathrm{ms}$, $q = 4\,\mathrm{ms}$, vsi ob $t = 0$
**Iščemo:** razpored, $\bar{t}$ in povprečni odzivni čas $\bar{t}_\mathrm{r}$

:::formula
$t_\mathrm{o} = t_\mathrm{k} - t_\mathrm{p}$, $t_\mathrm{č} = t_\mathrm{o} - b$; odzivni čas je čas do prvega teka
:::

**Rešitev:**

1. Razpored: A $0$–$4$, B $4$–$7$ (konča, ker potrebuje le $3$), Z $7$–$10$ (konča), nato A sam od $10$ do $30$.
2. Konci: A ob $30$, B ob $7$, Z ob $10\,\mathrm{ms}$. Čakanja: A $30 - 24 = 6$, B $7 - 3 = 4$, Z $10 - 3 = 7\,\mathrm{ms}$.
3. $\bar{t} = \dfrac{6 + 4 + 7}{3} \approx 5{,}67\,\mathrm{ms}$.
4. Odzivni časi: A $0$, B $4$, Z $7\,\mathrm{ms}$, povprečje $\dfrac{11}{3} \approx 3{,}67\,\mathrm{ms}$.
5. Odgovor: povprečni čas čakanja je okoli $5{,}7\,\mathrm{ms}$, odziv okoli $3{,}7\,\mathrm{ms}$. To je mnogo bolje od FCFS z dolgim procesom spredaj ($17\,\mathrm{ms}$), čeprav nihče ni vedel, katero opravilo je kratko.

### Primer 3 (izpitna raven): procesi z različnimi prihodi

Štirje procesi prispejo ob različnih časih (v ms): A ob $0$ s trajanjem $8$, B ob $1$ s $4$, C ob $2$ z $9$ in D ob $3$ s $5$. Za FCFS, nepredkupni SJF in SRTF določi razpored in povprečni čas čakanja. Kateri algoritem je najboljši po tem merilu?

**Podatki:** $(t_\mathrm{p}; b)$: A $(0; 8)$, B $(1; 4)$, C $(2; 9)$, D $(3; 5)$, vse v ms
**Iščemo:** razpored in $\bar{t}$ za FCFS, SJF in SRTF

:::formula
$t_\mathrm{č} = t_\mathrm{k} - t_\mathrm{p} - b$; $\bar{t} = \dfrac{1}{4}\sum t_\mathrm{č}$
:::

**Rešitev:**

1. FCFS: A $0$–$8$, B $8$–$12$, C $12$–$21$, D $21$–$26$. Čakanja: A $0$, B $12 - 1 - 4 = 7$, C $21 - 2 - 9 = 10$, D $26 - 3 - 5 = 18$. Povprečje $\dfrac{35}{4} = 8{,}75\,\mathrm{ms}$.
2. SJF brez prekinjanja: ob $0$ je pripravljen le A, teče do $8$. Takrat čakajo B ($4$), C ($9$), D ($5$): najprej B $8$–$12$, nato D $12$–$17$, nato C $17$–$26$.
3. Čakanja pri SJF: A $0$, B $8 - 1 = 7$, D $12 - 3 = 9$, C $17 - 2 = 15$. Povprečje $\dfrac{31}{4} = 7{,}75\,\mathrm{ms}$.
4. SRTF: ob $1$ pride B s $4$, A ima preostanek $7$, zato B prekine A. B $1$–$5$. Ob $5$ so preostanki A $7$, C $9$, D $5$: D $5$–$10$, nato A $10$–$17$, nato C $17$–$26$.
5. Čakanja pri SRTF: A $17 - 0 - 8 = 9$, B $5 - 1 - 4 = 0$, C $26 - 2 - 9 = 15$, D $10 - 3 - 5 = 2$. Povprečje $\dfrac{9 + 0 + 15 + 2}{4} = 6{,}5\,\mathrm{ms}$.
6. Odgovor: FCFS $8{,}75\,\mathrm{ms}$, SJF $7{,}75\,\mathrm{ms}$, SRTF $6{,}5\,\mathrm{ms}$. Najboljši je SRTF, ker kratkim procesom dovoli, da prehitijo dolge tudi med tekom. Cena so dodatni preklopi in nevarnost stradanja dolgega procesa C.

### Primer 4: zdaj ti

Merilni sistem shrani $1000$ datotek s po $10\,000\,\mathrm{B}$ podatkov na disk z bloki po $4096\,\mathrm{B}$. Koliko prostora na disku zasedejo in koliko ga je neizkoriščenega?

**Podatki:** $N = 1000$ datotek, $s = 10\,000\,\mathrm{B}$, $B = 4096\,\mathrm{B}$
**Iščemo:** zasedeni prostor in neizkoriščeni prostor

:::formula
$n_\mathrm{b} = \left\lceil \dfrac{s}{B} \right\rceil$; zasedeno $= N\,n_\mathrm{b}\,B$
:::

**Rešitev:**

1. Bloki na datoteko: $\dfrac{10\,000}{4096} \approx 2{,}44$, navzgor zaokroženo $n_\mathrm{b} = 3$.
2. Izračunaj zasedeni prostor vseh datotek in razliko do dejanske velikosti podatkov.

:::premisli
Koliko je zasedenega in koliko neizkoriščenega prostora?
---
Ena datoteka zasede $3 \cdot 4096 = 12\,288\,\mathrm{B}$, neizkoriščenih je $2288\,\mathrm{B}$. Vseh $1000$ zasede $12\,288\,000\,\mathrm{B}$ (okoli $12{,}3\,\mathrm{MB}$), od tega je okoli $2{,}3\,\mathrm{MB}$ ali $19\,\%$ neizkoriščeno. Pri mnogo majhnih datotekah je bolje meritve zbirati v manj večjih datotek.
:::

## Pogoste napake

- **»Na enem jedru programi tečejo hkrati.«** Tečejo izmenično; hkratnost je navidezna. Resnično vzporedno tečejo le na več jedrih.
- **»Proces je isto kot program.«** Program je datoteka s kodo, proces je ta koda v izvajanju s svojimi podatki in stanjem. En program lahko teče kot več procesov.
- **»Iz čakanja proces takoj teče.«** Ko dogodek nastopi, proces postane pripravljen in čaka, da ga razporejevalnik izbere.
- **»Krožno razporejanje je vedno najboljše.«** RR ima dober odziv, a pri dolgih paketnih opravilih slabši povprečni čas čakanja kot SJF in več preklopov.
- **»Datoteka zasede toliko, kolikor je velika.«** Zasede celo število blokov, zato majhne datoteke zapravijo veliko prostora.

## Povzetek

- OS upravlja vire in jih ponuja programom. Jedro teče v jedrnem načinu; programi ga kličejo s sistemskimi klici.
- Proces je program v izvajanju s PCB. Stanja: nov, pripravljen, teče, čaka, končan. Preklop konteksta stane čas.
- Merila razporejanja: čas čakanja, čas obdelave, odzivni čas, izkoriščenost. $t_\mathrm{o} = t_\mathrm{k} - t_\mathrm{p}$, $t_\mathrm{č} = t_\mathrm{o} - b$.
- FCFS (konvoj), SJF (optimalen povprečni čas čakanja, dokaz z zamenjavo), SRTF, prioritetno (stradanje, staranje), RR s kvantom $q$.
- Naprave: gonilniki, poizvedovanje, prekinitve, DMA, medpomnilniki.
- Datoteke: drevo imenikov, absolutne in relativne poti, metapodatki, bloki $n_\mathrm{b} = \lceil s/B \rceil$, pravice `rwx` in osmiški zapis.

## Za izpit

Znati moraš povedati:

- definicijo OS, jedra, jedrnega in uporabniškega načina ter sistemskega klica;
- definicijo procesa, vsebino PCB, stanja in dovoljene prehode;
- merila in algoritme razporejanja ter izrek o optimalnosti SJF z dokazom;
- razliko med poizvedovanjem, prekinitvami in DMA;
- zgradbo datotečnega sistema, dodeljevanje blokov in pravice.

### Naloga 1

Za procese iz Primera 3 (A $(0; 8)$, B $(1; 4)$, C $(2; 9)$, D $(3; 5)$) uporabi krožno razporejanje s kvantom $q = 3\,\mathrm{ms}$. Novo prispeli proces gre v vrsto pred proces, ki mu je ravno potekla rezina. (a) Določi razpored, povprečni čas čakanja in povprečni odzivni čas. (b) Primerjaj s SRTF. (c) Vsak preklop konteksta med različnima procesoma traja $0{,}5\,\mathrm{ms}$. Kolikšen delež časa porabi procesor za preklope?

**Rešitev:**

1. Ob $0$ teče A $0$–$3$. Medtem prispejo B, C, D, zato je vrsta B, C, D, A.
2. B $3$–$6$, C $6$–$9$, D $9$–$12$, A $12$–$15$, B $15$–$16$ (konča), C $16$–$19$, D $19$–$21$ (konča), A $21$–$23$ (konča), C $23$–$26$ (konča).
3. Čakanja: A $23 - 0 - 8 = 15$, B $16 - 1 - 4 = 11$, C $26 - 2 - 9 = 15$, D $21 - 3 - 5 = 13$. Povprečje $\dfrac{54}{4} = 13{,}5\,\mathrm{ms}$.
4. Odzivni časi: A $0$, B $3 - 1 = 2$, C $6 - 2 = 4$, D $9 - 3 = 6$; povprečje $3\,\mathrm{ms}$.
5. (b) SRTF: čakanje $6{,}5\,\mathrm{ms}$, odzivi A $0$, B $0$, C $15$, D $2$, povprečje $\dfrac{17}{4} = 4{,}25\,\mathrm{ms}$. RR ima dvakrat daljše čakanje, a krajši povprečni odziv in noben proces ne čaka na prvi tek dlje od $6\,\mathrm{ms}$.
6. (c) V razporedu je $10$ rezin, zato $9$ preklopov: $9 \cdot 0{,}5 = 4{,}5\,\mathrm{ms}$. Skupni čas je $26 + 4{,}5 = 30{,}5\,\mathrm{ms}$, delež preklopov $\dfrac{4{,}5}{30{,}5} \approx 0{,}148$, torej okoli $15\,\%$.
7. Odgovor: RR s $q = 3\,\mathrm{ms}$ da povprečno čakanje $13{,}5\,\mathrm{ms}$ in odziv $3\,\mathrm{ms}$; s preklopi porabi okoli $15\,\%$ časa za režijo, zato je tako majhen kvant pri teh procesih predrag.

### Naloga 2

Natančno navedi izrek o optimalnosti SJF z vsemi pogoji in ga dokaži. Utemelji, zakaj izrek ne velja, če procesi prispejo ob različnih časih in jih ne smemo prekinjati.

**Rešitev:**

1. Izrek: če so vsi procesi pripravljeni ob istem času in tečejo brez prekinjanja, ima razpored po naraščajočem trajanju najmanjši povprečni čas čakanja.
2. Dokaz z zamenjavo sosednjih procesov $X$, $Y$ z $b_X > b_Y$: drugi procesi čakajo enako, $Y$ čaka $b_X$ manj, $X$ pa $b_Y$ več, skupno čakanje se zmanjša za $b_X - b_Y > 0$. Razpored brez takega para je urejen po trajanju.
3. Pri različnih prihodih razporejevalnik ne pozna prihodnjih procesov. Primer 3: SJF ob $0$ zažene A ($8\,\mathrm{ms}$), ker je edini, čeprav ob $1$ pride krajši B. Če bi procesor ob $0$ pustili $1\,\mathrm{ms}$ prazen in začeli z B, bi bilo povprečje lahko manjše.
4. Preverimo: B $1$–$5$, D $5$–$10$, A $10$–$18$, C $18$–$27$ da čakanja $0$, $2$, $10$, $16$, povprečje $7\,\mathrm{ms}$, kar je manj od $7{,}75\,\mathrm{ms}$ pri SJF. Zamenjava sosedov tu ni dovoljena, ker proces ne more teči pred svojim prihodom.
5. Zato pri različnih prihodih nepredkupni SJF ni nujno optimalen; s prekinjanjem pa je glede povprečnega čakanja optimalen SRTF.

### Naloga 3

Program za zajem podatkov izvede sistemski klic za branje $1\,\mathrm{MB}$ meritev z diska. Opiši korak za korakom, kaj se zgodi, katera stanja zavzame proces in katere dele OS pri tem uporabi. Utemelji, zakaj je DMA tu boljši od prekinitve za vsak bajt.

**Rešitev:**

1. Program izvede sistemski klic `read`; procesor preklopi v jedrni način.
2. Jedro preveri pravice in poišče bloke datoteke v metapodatkih datotečnega sistema. Če podatki niso že v medpomnilniku, gonilnik diska naroči branje.
3. Proces gre iz stanja teče v stanje čaka; razporejevalnik izbere drug pripravljen proces.
4. Disk z DMA prenese bloke neposredno v pomnilnik in ob koncu sproži eno prekinitev.
5. Obdelava prekinitve proces premakne v stanje pripravljen. Ko ga razporejevalnik izbere, teče naprej; jedro mu kopira podatke in vrne iz sistemskega klica.
6. DMA: pri prekinitvi za vsak bajt bi bilo $10^6$ prekinitev; če vsaka stane okoli $1\,\mu\mathrm{s}$, bi procesor porabil okoli $1\,\mathrm{s}$ le za obdelavo prekinitev. Z DMA je ena prekinitev na prenos, procesor pa medtem dela drugo.

## Drugače: Korak za korakom s številkami

Merilna kartica vsako milisekundo pripravi nov podatek. Primerjajmo poizvedovanje in prekinitve.

1. *Poizvedovanje:* program vsakih $10\,\mu\mathrm{s}$ preveri kartico, vsako preverjanje stane $1\,\mu\mathrm{s}$. Delež procesorja: $\frac{1}{10} = 10\,\%$, ne glede na to, ali je podatek pripravljen.
2. V eni milisekundi je $100$ preverjanj, le eno najde podatek: $99$ jih je zaman.
3. *Prekinitve:* obdelava ene prekinitve stane $5\,\mu\mathrm{s}$, prekinitev je ena na milisekundo. Delež: $\frac{5}{1000} = 0{,}5\,\%$.
4. Prekinitve so torej dvajsetkrat cenejše.
5. A če bi kartica podatek pripravila vsake $4\,\mu\mathrm{s}$, bi prekinitve porabile več časa, kot je na voljo: $\frac{5}{4} > 1$. Pri zelo hitrih napravah zato uporabimo DMA ali poizvedovanje v kratkih izbruhih.

## Drugače: Uporaba v stroki

- *Zajem podatkov v fiziki.* Pri poskusih, kjer detektor odda tisoče dogodkov na sekundo, uporabljajo sisteme za delo v realnem času, ki zagotovijo, da se obdelava prekinitve začne v znanem najdaljšem času. Navaden namizni OS tega ne zagotavlja.
- *Strežniki in gruče.* Razporejevalniki opravil na računskih gručah (fiziki z njimi poganjajo simulacije) uporabljajo prioritete in kvote, podobne razporejanju procesov, le na ravni celih računalnikov.
- *Telefoni.* Mobilni OS proces v ozadju pogosto zamrzne ali konča, da varčuje z baterijo; zato aplikacija za merjenje v ozadju potrebuje posebno dovoljenje.
- *Varnost.* Ločitev jedrnega in uporabniškega načina ter pravice datotek preprečijo, da bi napaka v enem programu pokvarila podatke drugega uporabnika.

## Drugače: Bolj natančno

Poleg procesorja jedro upravlja tudi **pomnilnik**. Vsak proces vidi svoj **navidezni naslovni prostor**, ki ga jedro s pomočjo strojne enote MMU preslika v fizični pomnilnik po straneh (pogosto $4\,\mathrm{KiB}$). Zato proces ne more brati pomnilnika drugega procesa, strani, ki jih trenutno ne potrebuje, pa so lahko na disku.

Znotraj procesa lahko teče več **niti**. Niti si delijo pomnilnik in odprte datoteke, vsaka ima svoj sklad in registre. Preklop med nitmi istega procesa je cenejši od preklopa med procesi, deljeni podatki pa zahtevajo usklajevanje (ključavnice), sicer nastanejo **tekmovalna stanja**.

Sodobni razporejevalniki ne poznajo trajanj vnaprej. Algoritem z več vrstami s povratno zvezo (MLFQ) da novemu procesu visoko prioriteto in kratek kvant; če ves kvant porabi, ga premakne v nižjo vrsto z daljšim kvantom. Interaktivni procesi, ki hitro zaspijo v čakanju na vhod, tako ostanejo zgoraj, dolgi računski procesi pa se pogreznejo navzdol, kar približno posnema SJF brez poznavanja trajanj.

## Preveri se

? Katero stanje ne sodi med stanja procesa?
- pripravljen
~ Proces je pripravljen, ko lahko teče in čaka le na procesor.
- čaka
~ V stanju čaka je proces, ki čaka na dogodek, na primer na disk.
+ prevajan
- teče
~ V stanju teče procesor izvaja ukaze procesa.
> Prevajanje je pretvorba izvorne kode v strojno, preden program sploh obstaja kot proces; stanja so nov, pripravljen, teče, čaka, končan.

? Trije procesi s trajanji $6$, $2$ in $4\,\mathrm{ms}$ so pripravljeni ob času $0$ in tečejo po FCFS v tem vrstnem redu. Kolikšen je povprečni čas čakanja?
- $4\,\mathrm{ms}$
~ To je povprečno trajanje procesov, ne čakanja.
+ $\frac{14}{3} \approx 4{,}67\,\mathrm{ms}$
- $\frac{8}{3} \approx 2{,}67\,\mathrm{ms}$
~ To je povprečje pri SJF (vrstni red $2$, $4$, $6$); pri FCFS gre prvi najdaljši.
> Čakanja so $0$, $6$ in $6 + 2 = 8\,\mathrm{ms}$, vsota $14$, povprečje $\frac{14}{3}\,\mathrm{ms}$.

? Pri krožnem razporejanju kvant zmanjšaš z $20$ na $1\,\mathrm{ms}$, preklop konteksta pa traja $0{,}1\,\mathrm{ms}$. Kaj se zgodi?
- Procesor opravi več koristnega dela, ker so procesi hitreje na vrsti.
~ Hitrejše menjavanje izboljša odziv, a ne koristnega dela; ta se zmanjša zaradi preklopov.
+ Odzivni čas se izboljša, a delež časa za preklope naraste z okoli $0{,}5\,\%$ na okoli $9\,\%$.
- Nič, ker je preklop zanemarljivo kratek.
~ $0{,}1\,\mathrm{ms}$ je pri kvantu $1\,\mathrm{ms}$ že desetina rezine, kar ni zanemarljivo.
> Delež preklopa je $\frac{0{,}1}{20{,}1} \approx 0{,}5\,\%$ oziroma $\frac{0{,}1}{1{,}1} \approx 9\,\%$.

? Študent opiše branje z diska: »1) Proces izvede sistemski klic. 2) Proces gre v stanje čaka. 3) Disk sproži prekinitev, ko konča. 4) Proces takoj spet teče.« Kateri korak je napačen?
- Korak 1.
~ Branje z diska res zahteva sistemski klic, ker naprave upravlja jedro.
- Korak 2.
~ Med branjem proces res čaka in ne porablja procesorja.
- Korak 3.
~ Konec prenosa disk res sporoči s prekinitvijo.
+ Korak 4.
> Po prekinitvi proces postane pripravljen; teče šele, ko ga izbere razporejevalnik.

? Program za zajem meritev občasno izgubi podatke, ko na istem računalniku nekdo zažene veliko simulacijo. Kaj je najverjetnejši vzrok?
- Simulacija prepiše datoteko z meritvami.
~ Pravice datotek in ločeni naslovni prostori preprečijo, da bi en proces pisal v datoteko drugega brez dovoljenja.
+ Zajem dlje časa ne pride na vrsto, medpomnilnik merilne kartice se napolni in novi podatki se izgubijo.
- Disk ne more hkrati pisati dveh datotek.
~ Jedro pisanja razvrsti in jih izvede zaporedno; disk ne izgubi podatkov zaradi dveh datotek.
> Rešitev je višja prioriteta procesa za zajem, večji medpomnilnik ali OS za delo v realnem času.

:::simboli
t_\mathrm{o} | čas obdelave | t_\mathrm{o} = t_\mathrm{k} - t_\mathrm{p} | ms
t_\mathrm{k} | čas konca procesa | | ms
t_\mathrm{p} | čas prihoda procesa | | ms
t_\mathrm{č} | čas čakanja | t_\mathrm{č} = t_\mathrm{o} - b | ms
b | trajanje procesa na procesorju | | ms
\bar{t} | povprečni čas čakanja | | ms
t_{\mathrm{č},1}, t_{\mathrm{č},2}, t_{\mathrm{č},3} | časi čakanja posameznih procesov | | ms
n_\mathrm{b} | število blokov datoteke | n_\mathrm{b} = \lceil s/B \rceil | –
s | velikost datoteke | | B
B | velikost bloka | | B
N | število datotek | | –
q | kvant (časovna rezina) | | ms
:::
