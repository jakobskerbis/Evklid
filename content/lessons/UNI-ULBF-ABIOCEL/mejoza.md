---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dve vsakdanji situaciji.

**Darilni paket.** Trgovina ponuja paket po izbiri. Izdelki so razvrščeni v 23 kategorij, v vsaki sta dva enakovredna izdelka: temna ali mlečna čokolada, zeleni ali črni čaj in tako naprej. V paket gre iz vsake kategorije natanko en izdelek. Različnih paketov je $2^{23}$, to je več kot 8 milijonov. Dva kupca skoraj nikoli ne odneseta enakega.

**Skupno darilo.** Ana in Bor kupita darilo za $46$ €. Vsak prinese polovico, $23$ €. Če bi vsak prinesel cel znesek, bi na blagajni ležalo $92$ €, dvakrat preveč.

Situaciji sta videti različni, skriva pa se v njiju ista zamisel: **vsak prinese le polovico, a to polovico sestavi po izbiri.** Tako vsota ostane prava, kombinacij pa je ogromno.

Natanko to naredi tvoje telo, ko tvori spolne celice. Telesna celica ima 46 kromosomov, to je 23 parov. Jajčece in semenčica dobita vsak po 23 kromosomov, iz vsakega para enega. Zigota ima spet 46. Delitev, ki to omogoči, je **mejoza**.

## Razlaga

**Najprej en konkreten primer.** Vzemimo celico z le štirimi kromosomi: dvema dolgima in dvema kratkima. En dolgi in en kratki sta od matere, druga dva od očeta. Kromosoma enake dolžine z istimi geni na istih mestih sta **homologna kromosoma**. Celica z dvema garniturama kromosomov je **diploidna**, pišemo $2n = 4$. Celica z eno garnituro je **haploidna**, $n = 2$.

**Korak 1: podvojitev.** Kot pred mitozo se v fazi S podvoji DNA. Vsak kromosom ima zdaj dve enaki **sestrski kromatidi**, povezani v centromeri. Kromosomov je še vedno 4, kromatid pa 8.

**Korak 2: homologa se poiščeta.** V profazi I se dolgi materin in dolgi očetov kromosom tesno vzporedno združita (**sinapsa**). Enako naredita kratka. Nastaneta dva **bivalenta**; vsak ima štiri kromatide, zato mu rečemo tudi tetrada. Tega v mitozi ni.

**Korak 3: prekrižanje.** Dokler sta homologa spojena, si **nesestrski kromatidi** (ena materina, ena očetova) izmenjata istoležna odseka. Mesto izmenjave je pod mikroskopom vidno kot križ, **hiazma**. Temu procesu rečemo **prekrižanje** (crossing over). Po njem je kromatida mešanica materinih in očetovih alelov.

**Korak 4: mejoza I.** V metafazi I se na ekvatorialno ravnino postavijo *bivalenti*, ne posamezni kromosomi. V anafazi I gresta homologa narazen, sestrski kromatidi pa ostaneta skupaj. Vsaka hčerinska celica dobi en dolgi in en kratki kromosom. Ima 2 kromosoma, vsakega z dvema kromatidama.

:::premisli
Celica po mejozi I ima 2 kromosoma, vendar ima vsak še dve kromatidi. Je haploidna ali diploidna? Napovej, nato preberi.
---
Haploidna, $n = 2$. Kromosome štejemo po centromerah, ne po kromatidah. Celica ima iz vsakega homolognega para le enega, torej eno garnituro.
:::

**Korak 5: mejoza II.** Brez nove podvojitve DNA sledi delitev, ki je videti kot mitoza: v anafazi II se ločijo sestrske kromatide. Iz dveh celic nastanejo štiri. Vsaka ima 2 kromosoma z eno kromatido.

**Pregled v tabeli.** $C$ je količina DNA ene haploidne garniture z eno kromatido.

| Stanje celice | Kromosomov | Kromatid na kromosom | DNA |
|---|---|---|---|
| G1 pred mejozo | 4 | 1 | 2C |
| profaza I (po S) | 4 | 2 | 4C |
| po mejozi I | 2 | 2 | 2C |
| po mejozi II | 2 | 1 | 1C |

**Posplošitev 1: redukcija.** Število kromosomov se zmanjša v mejozi I, ko se ločijo homologi. Zato je mejoza I **redukcijska delitev**: iz $2n$ nastane $n$. Mejoza II ne spremeni števila kromosomov, loči le kromatide; imenujemo jo **ekvacijska delitev**. Pri človeku: $2n = 46$, gamete imajo $n = 23$.

**Posplošitev 2: neodvisna razporeditev.** V metafazi I je vsak bivalent obrnjen naključno: materin homolog je lahko na eni ali na drugi strani. Usmeritev enega bivalenta ne vpliva na drugega. Pri dveh parih sta v metafazi I možni dve razporeditvi, vsaka pa da dve vrsti gamet. Skupaj so to $2^2 = 4$ različne kombinacije kromosomov v gametah. Pri $n$ parih je kombinacij $2^n$. To je darilni paket iz uvoda: kategorija je homologni par, izdelek je materin ali očetov kromosom.

:::premisli
Zakaj bi bilo prekrižanje med *sestrskima* kromatidama za raznolikost nekoristno?
---
Sestrski kromatidi sta nastali s podvojitvijo iste molekule DNA, zato sta enaki. Izmenjava enakih odsekov ne ustvari nove kombinacije alelov. Novo prinese le izmenjava med materino in očetovo kromatido.
:::

**Posplošitev 3: rekombinacija.** Gamete se razlikujejo iz dveh razlogov. Prvi je neodvisna razporeditev celih kromosomov. Drugi je prekrižanje, ki premeša alele *znotraj* kromosoma. Oboje skupaj imenujemo **rekombinacija**. Tretji vir raznolikosti je oploditev: naključna gameta enega starša se sreča z naključno gameto drugega.

**Pomen za spolno razmnoževanje.** Mejoza reši dve nalogi. Brez redukcije bi se število kromosomov v vsaki generaciji podvojilo, kot pri Ani in Boru, ki bi oba prinesla cel znesek. Z rekombinacijo pa so potomci genetsko različni, kar populaciji omogoča prilagajanje na bolezni in spremembe okolja.

## Rešeni primeri

### Primer 1: štetje po fazah

Vinska mušica ima v telesnih celicah $2n = 8$. Koliko kromosomov in koliko kromatid ima ena celica po mejozi I in koliko ena celica po mejozi II?

**Podatki:** $2n = 8$; delitev je mejoza
**Iščemo:** število kromosomov in kromatid po mejozi I in po mejozi II

:::formula
Mejoza I: $2n \to n$, vsak kromosom ima 2 kromatidi.
Mejoza II: $n \to n$, vsak kromosom ima 1 kromatido.
:::

**Rešitev:**

1. Haploidno število: $n = \dfrac{8}{2} = 4$, ker se v mejozi I ločijo homologi.
2. Po mejozi I: 4 kromosomi, vsak z dvema kromatidama, torej $4 \cdot 2 = 8$ kromatid.
3. Po mejozi II se ločijo sestrske kromatide, zato ostanejo 4 kromosomi s po eno kromatido: 4 kromatide.
4. Odgovor: po mejozi I ima celica 4 kromosome in 8 kromatid, po mejozi II 4 kromosome in 4 kromatide.

### Primer 2: od darilnega paketa do gamet

Trgovina sestavlja pakete iz 4 kategorij, v vsaki sta dva izdelka, v paket gre po eden iz kategorije. Koliko je različnih paketov? Koliko genetsko različnih gamet lahko zaradi neodvisne razporeditve tvori vinska mušica ($n = 4$) in koliko človek ($n = 23$)? Prekrižanje zanemari.

**Podatki:** 4 kategorije po 2 izdelka; mušica $n = 4$; človek $n = 23$; brez prekrižanja
**Iščemo:** število paketov in število kombinacij kromosomov v gametah

:::formula
Število kombinacij $= 2^n$, kjer je $n$ število parov.
:::

**Rešitev:**

1. Paketi: pri vsaki kategoriji sta 2 izbiri, izbire so neodvisne, zato se množijo: $2 \cdot 2 \cdot 2 \cdot 2 = 16$.
2. Mušica: 4 homologni pari, vsak se v metafazi I usmeri na 2 načina: $2^4 = 16$ kombinacij.
3. Človek: $2^{23} = 8388608$ kombinacij.
4. Odgovor: paketov je 16, mušica tvori 16 različnih kombinacij, človek več kot 8,3 milijona. S prekrižanjem jih je v resnici še bistveno več.

### Primer 3: od števila kombinacij nazaj do kromosomov

Pri neki vrsti ribe lahko samica samo zaradi neodvisne razporeditve homologov tvori $4096$ različnih kombinacij kromosomov v jajčecih. Koliko kromosomov ima njena telesna celica? Koliko bivalentov in koliko kromatid je v celici v metafazi I?

**Podatki:** število kombinacij $= 4096$; brez prekrižanja
**Iščemo:** $2n$, število bivalentov in kromatid v metafazi I

:::formula
$2^n = 4096$; v metafazi I je $n$ bivalentov, vsak ima 4 kromatide.
:::

**Rešitev:**

1. Iščemo eksponent: $2^{12} = 4096$, zato je $n = 12$.
2. Telesna celica je diploidna: $2n = 2 \cdot 12 = 24$ kromosomov.
3. V metafazi I je vsak homologni par en bivalent: 12 bivalentov.
4. DNA je že podvojena, vsak od 24 kromosomov ima 2 kromatidi: $24 \cdot 2 = 48$ kromatid.
5. Odgovor: telesna celica ima 24 kromosomov; v metafazi I je 12 bivalentov in 48 kromatid.

### Primer 4: zdaj ti

Človeška celica v fazi G1 vsebuje $6{,}4\,\mathrm{pg}$ DNA. Koliko DNA je v celici v profazi I, koliko v celici po mejozi I in koliko v semenčici?

**Podatki:** DNA v G1 $= 6{,}4\,\mathrm{pg}$ (to je $2C$)
**Iščemo:** DNA v profazi I, po mejozi I in v gameti

:::formula
Faza S: $2C \to 4C$; mejoza I: $4C \to 2C$; mejoza II: $2C \to 1C$
:::

**Rešitev:**

1. V fazi S se DNA podvoji: $2 \cdot 6{,}4 = 12{,}8$, torej $12{,}8\,\mathrm{pg}$ v profazi I.
2. Mejoza I razdeli to količino med dve celici: $\dfrac{12{,}8}{2} = 6{,}4$, torej $6{,}4\,\mathrm{pg}$.
3. Mejoza II sledi brez nove faze S. Zadnji korak naredi sam:

:::premisli
Koliko DNA ima semenčica?
---
$\dfrac{6{,}4\,\mathrm{pg}}{2} = 3{,}2\,\mathrm{pg}$, to je $1C$, polovica količine v celici G1. Po oploditvi ima zigota spet $6{,}4\,\mathrm{pg}$.
:::

## Pogoste napake

- **»Mejoza I je kot mitoza, le dvakrat zapored.«** Kdor tako misli, v anafazi I loči sestrske kromatide. V resnici gresta v anafazi I narazen homologna kromosoma, kromatidi pa ostaneta skupaj. Zato se število kromosomov prepolovi že v mejozi I.
- **Štetje kromatid namesto kromosomov.** Po mejozi I celica s $4$ kromosomi kaže $8$ kromatid, zato jo kdo razglasi za diploidno. Kromosome štej po centromerah; pomembno je, ali je iz vsakega para eden ali oba.
- **»Pred mejozo II se DNA spet podvoji.«** Ne: med mejozo I in II ni faze S. Prav zato iz $4C$ pridemo do $1C$ in ne nazaj do $2C$.
- **»Prekrižanje poteka med sestrskima kromatidama.«** Te so enake, izmenjava ne bi spremenila ničesar. Rekombinacijo da izmenjava med nesestrskima kromatidama homolognih kromosomov.
- **»Štiri celice iz iste mejoze so enake.«** Zaradi prekrižanja in naključne usmeritve bivalentov se gamete razlikujejo, tudi če nastanejo iz iste celice.

## Povzetek

- Mejoza iz ene diploidne celice ($2n$) da štiri haploidne ($n$); DNA se podvoji le enkrat, celica se deli dvakrat.
- Mejoza I je redukcijska: ločijo se homologni kromosomi. Mejoza II je ekvacijska: ločijo se sestrske kromatide.
- V profazi I se homologa združita v bivalent; med nesestrskima kromatidama poteka prekrižanje (hiazme).
- Rekombinacija = neodvisna razporeditev bivalentov ($2^n$ kombinacij) + prekrižanje. Pri človeku $2^{23} \approx 8{,}4 \cdot 10^6$ kombinacij že brez prekrižanja.
- Pomen: stalno število kromosomov iz generacije v generacijo in genetska raznolikost potomcev.

## Drugače: Z analogijo

Predstavljaj si omaro z 23 pari rokavic. V vsakem paru je ena rokavica od babice in ena od dedka; obe sta za isto roko in istega kroja, razlikujeta se v barvi.

1. **Faza S:** vsako rokavico fotokopiraš, kopija ostane speta z izvirnikom (sestrski kromatidi).
2. **Profaza I:** rokavici istega para položiš drugo na drugo in jima zamenjaš koščke vzorca (prekrižanje). Zdaj ima babičina rokavica tudi dedkove proge.
3. **Mejoza I:** iz vsakega para daš eno spetko v levo škatlo, drugo v desno. Katera gre levo, določi met kovanca, posebej za vsak par.
4. **Mejoza II:** v vsaki škatli razpneš spetke in razdeliš izvirnik in kopijo v dve manjši škatli.

Na koncu imaš štiri škatle, v vsaki po 23 rokavic, iz vsakega para ena. Nobeni dve škatli nista nujno enaki. Analogija ima mejo: kopija in izvirnik po prekrižanju nista več povsem enaka, ker si je le eden od njiju zamenjal košček.

## Drugače: Bolj natančno

**Profaza I** je dolga in jo delimo na leptoten (kromosomi se začnejo zgoščevati), zigoten (homologi se začnejo spajati), pahiten (sinapsa je popolna, poteka prekrižanje), diploten (homologi se razmikajo, hiazme so vidne) in diakinezo. Homologa drži skupaj **sinaptonemski kompleks**, beljakovinska »zadrga«.

**Zakaj gredo v mejozi I narazen homologi?** Kinetohora sestrskih kromatid (mesti, kjer se pripne delitveno vreteno) sta usmerjena k istemu polu. **Kohezin**, beljakovina, ki drži sestrski kromatidi skupaj, se ob krakih v anafazi I razgradi, ob centromeri pa ga zaščiti beljakovina šugošin. Hiazme do anafaze I držijo homologa skupaj in zagotovijo pravilno napetost na delitvenem vretenu. Ob centromeri se kohezin razgradi šele v anafazi II.

**Napake.** Če se homologa v anafazi I ali sestrski kromatidi v anafazi II ne ločita (**nerazdružitev**), nastanejo gamete z $n + 1$ in $n - 1$ kromosomi. Zigota je tedaj **aneuploidna**, ima napačno število kromosomov, npr. trisomija 21 pri Downovem sindromu.

**Spol in organizmi.** Pri spermatogenezi nastanejo štiri semenčice. Pri oogenezi nastane eno jajčece in polarna telesca; primarna oocita pri človeku obstane v profazi I že pred rojstvom in mejozo I dokonča šele tik pred ovulacijo. Pri rastlinah mejoza ne da gamet, ampak spore; gamete nastanejo kasneje z mitozo v gametofitu.

## Preveri se

? Na preparatu iz profaze I vidiš dva homologna kromosoma, tesno spojena, z dvema mestoma, kjer se kromatidi križata. Kako imenujemo ta mesta?
- centromera
~ Centromera povezuje sestrski kromatidi istega kromosoma; križanje med homologoma je drugo mesto.
+ hiazma
- kinetohor
~ Kinetohor je beljakovinska struktura, na katero se pripne delitveno vreteno, ne mesto izmenjave.
- bivalent
~ Bivalent je cel par homologov skupaj; vprašanje sprašuje po mestu križanja na njem.
> Hiazma je vidni znak prekrižanja: tam sta si nesestrski kromatidi izmenjali odseka.

? Kateri vrstni red dogodkov v mejozi je pravilen?
- parjenje homologov → podvojitev DNA → ločitev sestrskih kromatid → ločitev homologov
~ DNA se podvoji pred mejozo (faza S), homologi pa se ločijo pred kromatidami, ne po njih.
+ podvojitev DNA → parjenje homologov in prekrižanje → ločitev homologov → ločitev sestrskih kromatid
- podvojitev DNA → ločitev sestrskih kromatid → parjenje homologov → ločitev homologov
~ To je miselnost »mejoza I = mitoza«. V mejozi I gredo narazen homologi, kromatide šele v mejozi II.
> Najprej faza S, v profazi I sinapsa in prekrižanje, v anafazi I ločitev homologov, v anafazi II ločitev sestrskih kromatid.

? Kaj se zgodi, če se en par homolognih kromosomov v anafazi I ne loči?
- Nič, napako popravi mejoza II, ker loči kromatide.
~ Mejoza II loči sestrski kromatidi, ne more pa premakniti celega kromosoma v drugo celico.
- Vse gamete imajo en kromosom manj.
~ Kromosom ne izgine: oba homologa gresta v isto celico, zato imajo nekatere gamete enega preveč.
+ Polovica gamet ima en kromosom preveč ($n + 1$), polovica enega premalo ($n - 1$).
> To je nerazdružitev. Gameta $n + 1$ po oploditvi da trisomijo (npr. trisomijo 21), gameta $n - 1$ monosomijo.

? Koruza ima $2n = 20$. Koliko kromosomov in kromatid ima celica po mejozi I?
- 20 kromosomov in 40 kromatid
~ Tako je v profazi I; v mejozi I se homologi ločijo in število kromosomov prepolovi.
+ 10 kromosomov in 20 kromatid
- 10 kromosomov in 10 kromatid
~ Tako je šele po mejozi II. Po mejozi I ima vsak kromosom še dve sestrski kromatidi.
> Mejoza I je redukcijska: $n = 10$, vsak kromosom ima 2 kromatidi, skupaj $20$ kromatid.

? Celica v G1 vsebuje $10\,\mathrm{pg}$ DNA. Koliko DNA ima celica v profazi II?
- $5\,\mathrm{pg}$
~ To je količina v gameti po mejozi II. V profazi II se kromatide še niso ločile.
- $20\,\mathrm{pg}$
~ Toliko ima celica v profazi I. Mejoza I je to količino že razdelila na dve celici.
+ $10\,\mathrm{pg}$
> Faza S: $10 \to 20\,\mathrm{pg}$; mejoza I: $20 \to 10\,\mathrm{pg}$. Celica v profazi II ima $10\,\mathrm{pg}$ ($2C$), čeprav je haploidna.

:::simboli
n | število kromosomov v haploidni garnituri | | – | diploidna celica ima 2n kromosomov
C | količina DNA ene haploidne garniture | | pg | z eno kromatido na kromosom
:::
