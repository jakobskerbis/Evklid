---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na zemljevidu poišči otočje Galápagos. Leži na ekvatorju, približno $1000\,\mathrm{km}$ zahodno od Južne Amerike. Leta $1835$ je tja priplula ladja Beagle z mladim naravoslovcem Charlesom Darwinom. Ptice, ki jih je prinesel domov, so pokazale nekaj nenavadnega: ščinkavci z različnih otokov imajo različne kljune, debele za trda semena ali tanke za žuželke.

Druga zgodba je bližja: zdravnica ti zaradi bakterijskega vnetja predpiše antibiotik za sedem dni. Po treh dneh te nič več ne boli. Zakaj ga moraš jemati do konca? In zakaj bolnišnice vse pogosteje najdejo bakterije, ki jih ne ubije skoraj noben antibiotik?

Za obema zgodbama je isti pojav. Živa bitja iste vrste se malo razlikujejo, okolje pa odloči, katera bodo imela potomce. Darwin je temu rekel **naravni izbor**.

## Razlaga

Najprej en primer od začetka do konca, nato iz njega pravilo.

**Suša na otoku.** Na majhnem otoku živi $1200$ ščinkavcev iste vrste. $300$ ptic ima debelejši kljun, $900$ tanjšega. Nekega leta skoraj ne dežuje. Mehkih semen zmanjka, ostanejo trda. Debel kljun jih stre, tanek komaj.

Do konca suše preživi $60\,\%$ ptic z debelim kljunom in le $10\,\%$ ptic s tankim:

- z debelim kljunom: $300 \cdot 0{,}6 = 180$,
- s tankim kljunom: $900 \cdot 0{,}1 = 90$,
- skupaj: $180 + 90 = 270$.

Pred sušo je bil debel kljun pri $\dfrac{300}{1200} = 0{,}25$, torej pri četrtini ptic. Po suši je pri $\dfrac{180}{270} \approx 0{,}67$, torej pri dveh tretjinah.

:::risba stolpci
opis: Število ščinkavcev pred sušo in po njej. Pred sušo 300 z debelim in 900 s tankim kljunom. Po suši 180 z debelim in 90 s tankim kljunom.
podnapis: Ščinkavci pred sušo in po njej
os: število ptic
korak: 200
stolpec: debel, prej | 300
stolpec: tanek, prej | 900
stolpec: debel, po | 180
stolpec: tanek, po | 90
:::

Tako se je zgodilo zares: na otoku Daphne Major sta zakonca Grant leta $1977$ izmerila, da so sušo preživeli predvsem ščinkavci z debelejšim kljunom.

:::premisli
Kakšne kljune bodo imeli mladiči, ki se bodo izvalili po suši? Napovej in povej zakaj.
---
Več mladičev bo imelo debel kljun kot pred sušo. Debelina kljuna je dedna, starši pa so zdaj večinoma debelokljuni.
:::

Iz primera razberemo korake, ki veljajo za vsa živa bitja.

**Korak 1: genetska variabilnost.** Ptice so se razlikovale že pred sušo. Razlikam med osebki iste vrste, ki so zapisane v genih, rečemo **genetska variabilnost**. Delno izvira iz mejoze in oploditve, ki vsakič premešata alele.

**Korak 2: mutacije.** Od kod pa sploh novi aleli? Nastanejo z **mutacijo**, spremembo v zaporedju baz DNA. Primer: odsek ATGCCA se ob napaki pri podvajanju DNA spremeni v ATGTCA. Mutacije nastajajo naključno, tudi zaradi UV svetlobe ali sevanja. Večina nima učinka ali škodi, redke koristijo. Mutacija ne nastane zato, ker bi jo organizem potreboval. Pri živalih se deduje le mutacija v spolni celici.

**Korak 3: naravni izbor.** Suša ni ustvarila debelih kljunov, le izbrala je ptice, ki so jih že imele. Naravni izbor deluje, kadar velja vse naslednje:

1. Rodi se več potomcev, kot jih lahko preživi.
2. Osebki se med seboj razlikujejo.
3. Razlike so dedne.
4. Osebki z ugodno lastnostjo pogosteje preživijo in imajo več potomcev.

Posledica: ugodni aleli so iz roda v rod pogostejši. Spreminja se **populacija**, vsi osebki iste vrste na enem območju, ne posamezna ptica.

**Korak 4: prilagoditev.** **Prilagoditev** je dedna lastnost, ki osebku v njegovem okolju poveča možnost, da preživi in ima potomce. Debel kljun je prilagoditev na sušo, bela zimska dlaka planinskega zajca prilagoditev na sneg. Prilagoditev velja za določeno okolje: v deževnem letu je lahko prednost prav tanek kljun.

**Korak 5: odpornost na antibiotike.** Pri bakterijah gre enako, le hitreje, saj se lahko delijo vsakih $20\,\mathrm{min}$. Med milijardami bakterij jih ima nekaj po naključju mutacijo, zaradi katere jim antibiotik ne škodi. Antibiotik ubije občutljive, odporne se namnožijo. Če zdravljenje prekineš prezgodaj, ostanejo prav najmanj občutljive, zato antibiotik jemlji, kot naroči zdravnik. Proti virusom, na primer pri prehladu, ne deluje.

:::premisli
Sošolec reče: »Bakterije so se navadile na antibiotik, tako kot se jaz navadim na mrzlo vodo v bazenu.« Ali to natančno opiše, kaj se je zgodilo? V čem se primera razlikujeta?
---
Ne. Posamezna bakterija se ne navadi. Odporne bakterije so imele mutacijo že pred zdravljenjem, po naključju. Antibiotik je le pobil občutljive, zato so ostale in se namnožile odporne.
:::

**Korak 6: geografska izolacija.** Na Galápagos je veter nekoč zanesel nekaj ščinkavcev s celine. Njihovi potomci so se razširili na več otokov, med katerimi je morje, zato se ptice z različnih otokov ne srečujejo in ne parijo. Morje, gorovje ali reka, ki loči dele populacije, povzroči **geografsko izolacijo**.

:::risba skica
opis: Shema zemljevida, ne v merilu. Levo je celina Južne Amerike. Puščica, dolga približno 1000 km, vodi s celine do otoka A. Z otoka A vodita krajši puščici do otokov B in C. Na otoku A imajo ščinkavci debel kljun, na otoku B tanek, na otoku C srednji.
območje: 0; 0 .. 12; 7
enota: 24
lik: 0,2; 0,5 -> 2,5; 0,5 -> 3; 3,5 -> 2,4; 6,5 -> 0,2; 6,5 | siva
napis: 1,4; 3,5 | celina | sredina
puščica: 3,2; 4,2 -> 6,9; 4,9 | 1000 km | nad
krog: 8; 5 | 0,9 | zelena
napis: 8; 5 | A | sredina | debelo
napis: 8; 6,1 | debel | nad
krog: 10,6; 3 | 0,8 | zelena
napis: 10,6; 3 | B | sredina | debelo
napis: 10,6; 2 | tanek | pod
krog: 7,6; 2,1 | 0,7 | zelena
napis: 7,6; 2,1 | C | sredina | debelo
napis: 7,6; 1,2 | srednji | pod
puščica: 8,8; 4,5 -> 9,9; 3,5
puščica: 7,9; 4 -> 7,7; 2,9
:::

Na vsakem otoku nastajajo druge mutacije, okolje pa izbira drugače. Po mnogo rodovih se populaciji z dveh otokov tako razlikujeta, da se tudi ob ponovnem srečanju ne moreta več pariti ali pa imata neplodne potomce. Takrat sta to dve **vrsti**. Vrsto namreč sestavljajo osebki, ki se med seboj parijo in imajo plodne potomce. Na Galápagosu je tako iz prednikov s celine nastalo več kot ducat vrst ščinkavcev.

V simulaciji spodaj »Mutacija, naravni izbor, izolacija« razvrsti primere v tri skupine. Opazuj, ali se je spremenila DNA, je izbiralo okolje ali je populacijo nekaj ločilo.

## Rešeni primeri

### Primer 1 (lažji): odporne bakterije že čakajo

V vnetem grlu je $2 \cdot 10^8$ bakterij. Mutacija, zaradi katere je bakterija odporna proti antibiotiku, se po naključju pojavi pri približno eni bakteriji od $10^7$. Koliko odpornih bakterij je v grlu že pred prvo tableto?

**Podatki:** $N = 2 \cdot 10^8$, ena odporna na $k = 10^7$ bakterij
**Iščemo:** število odpornih bakterij $N_\mathrm{odp}$

:::formula
$N_\mathrm{odp} = \dfrac{N}{k}$
:::

**Rešitev:**

1. V vsaki skupini po $10^7$ bakterij je ena odporna.
2. $N_\mathrm{odp} = \dfrac{2 \cdot 10^8}{10^7} = 2 \cdot 10 = 20$.
3. Antibiotik ubije občutljive bakterije, na teh $20$ pa ne deluje.
4. Odgovor: v grlu je že pred zdravljenjem približno $20$ odpornih bakterij. Antibiotik jih ni ustvaril.

### Primer 2: planinski zajec in krajše zime

Planinski zajec živi tudi v Julijskih Alpah. Pobeli, ko se dnevi skrajšajo, ne glede na sneg. Recimo, da je zajec bel $170$ dni na leto. Zaradi toplejših zim sneg zapade pozneje in na njegovem območju leži le še $140$ dni. Nekaj zajcev v populaciji ima drug alel in pobeli $20$ dni pozneje. Koliko dni je bel zajec na kopnih tleh pri običajnih in koliko pri poznih zajcih? Kaj se bo zgodilo s populacijo?

**Podatki:** običajni zajec bel $170$ dni, sneg $140$ dni, pozni zajci pobelijo $20$ dni pozneje
**Iščemo:** dneve na kopnem za oba tipa zajcev in spremembo populacije

:::formula
dnevi na kopnem = dnevi z belo dlako − dnevi s snegom; v populaciji postane pogostejši alel, ki osebku poveča možnost preživetja
:::

**Rešitev:**

1. Običajni zajec je na kopnih tleh bel $170 - 140 = 30$ dni. Plenilci ga tam hitro opazijo.
2. Pozni zajec je bel $170 - 20 = 150$ dni, na kopnem torej $150 - 140 = 10$ dni.
3. Pozni zajci so plenilcem vidni trikrat manj dni, zato jih več preživi in imajo več mladičev z alelom za pozno belenje.
4. Odgovor: običajni zajec je bel na kopnem $30$ dni, pozni $10$ dni. Iz roda v rod bo poznih zajcev vse več. Brez tega alela bi bilo zajcev le vse manj, saj izbor izbira samo med razlikami, ki že obstajajo.

### Primer 3 (težji): kuščarji, ki so se preselili

Na zemljevidu južne Dalmacije sta dva otočka, Pod Kopište in Pod Mrčaru. Leta $1971$ so raziskovalci s prvega na drugega prenesli $5$ parov primorske kuščarice. Po približno $36$ letih so imeli kuščarji na Pod Mrčaru večje glave in močnejši ugriz ter so jedli veliko več rastlin, ki jih je tam več kot žuželk. Predpostavi, da en rod kuščarjev traja približno $1{,}2$ leta. Koliko rodov je minilo, kaj pojasni spremembo in ali je nastala nova vrsta?

**Podatki:** $5$ parov ($10$ kuščarjev), čas $t = 36$ let, en rod $T = 1{,}2$ leta, na novem otoku več rastlinske hrane
**Iščemo:** število rodov $r$, razlago spremembe, odgovor o novi vrsti

:::formula
$r = \dfrac{t}{T}$; nova vrsta nastane, ko se osebka ločenih populacij ne moreta več pariti in imeti plodnih potomcev
:::

**Rešitev:**

1. Število rodov: $r = \dfrac{36\,\mathrm{let}}{1{,}2\,\mathrm{leta}} = 30$.
2. Rastline so trde. Kuščarji z večjo glavo in močnejšim ugrizom so jih laže jedli, zato so imeli več potomcev. To je naravni izbor.
3. Morje loči kuščarje na Pod Mrčaru od populacije na Pod Kopištu. To je geografska izolacija.
4. Populaciji se razlikujeta, a ni znano, da se ne bi mogli več pariti. Za to je navadno potrebnih veliko več rodov.
5. Odgovor: minilo je okoli $30$ rodov. Večjo glavo pojasni naravni izbor ob novi hrani. Nova vrsta še ni nastala.

### Primer 4 – zdaj ti: ko zdravljenje prekineš

Nadaljuj Primer 1. Po dveh dneh zdravljenja so v grlu ostale le odporne bakterije, recimo $20$. Bolnik takrat antibiotik opusti. Odporne bakterije se delijo vsakih $20\,\mathrm{min}$. Koliko jih je po $3$ urah?

**Podatki:** $N_0 = 20$, $t_\mathrm{d} = 20\,\mathrm{min}$, $t = 3\,\mathrm{h} = 180\,\mathrm{min}$
**Iščemo:** število bakterij $N$

:::formula
$n = \dfrac{t}{t_\mathrm{d}}$, nato $N = N_0 \cdot 2^n$ (iz lekcije o biotehnologiji)
:::

**Rešitev:**

1. Število delitev: $n = \dfrac{180\,\mathrm{min}}{20\,\mathrm{min}} = 9$.
2. Devet podvojitev: $2^9 = 512$.
3. Izračunaj $N$ sam in razmisli, kaj to pomeni za zdravljenje.

:::premisli
Koliko odpornih bakterij je v grlu po $3$ urah? Ali bo isti antibiotik zdaj pomagal?
---
$N = 20 \cdot 512 = 10\,240$. Vse so potomke odpornih, zato isti antibiotik nanje ne bo deloval. Zdravnik bo moral izbrati drugega.
:::

## Pogoste napake

- **»Žirafa je iztegovala vrat, zato so imeli mladiči daljšega.«** Kar osebek pridobi med življenjem, se ne deduje. Žirafe z daljšim vratom so se rodile takšne in pogosteje imele potomce.
- **»Bakterije se navadijo na antibiotik«** ali celo **»jaz sem postal odporen na antibiotik«**. Odporne postanejo bakterije, ne človek. Odporne bakterije so imele mutacijo že prej, antibiotik jih je le izbral.
- **»Mutacija nastane, ker jo organizem potrebuje.«** Mutacije so naključne. Okolje šele potem izbere redke, ki koristijo.
- **»Pri naravnem izboru preživi najmočnejši.«** Preživi in ima potomce tisti, ki se najbolje ujema z okoljem. Pozni zajec ni močnejši, le manj opazen.
- **»Žival se med življenjem razvije v novo vrsto.«** Spreminja se populacija skozi rodove, posameznik ima vse življenje enake gene.

## Povzetek

- Genetska variabilnost: osebki iste vrste se razlikujejo v alelih.
- Mutacija je naključna sprememba v zaporedju baz DNA in vir novih alelov. Večina je nevtralnih ali škodljivih.
- Naravni izbor: več potomcev, kot jih preživi; razlike so dedne; osebki z ugodno lastnostjo imajo več potomcev. Ugodni aleli postanejo pogostejši v populaciji, ne v posamezniku.
- Prilagoditev je dedna lastnost, ki v določenem okolju poveča preživetje in število potomcev (debel kljun v suši, bela dlaka na snegu).
- Odpornost na antibiotike: bakterije z naključno mutacijo preživijo zdravljenje in se namnožijo.
- Geografska izolacija (morje, gorovje, reka) loči populacije. V mnogo rodovih se tako razlikujejo, da se ne morejo več pariti: nastane nova vrsta (ščinkavci na Galápagosu).

## Drugače: Z analogijo

**Sito.** Pesek z zrni različnih velikosti stresi skozi sito. Zrna so variabilnost populacije, sito je okolje. Sito ne naredi novega zrna, le izbira med obstoječimi; nova zrna prinesejo mutacije. Če zamenjaš sito, na primer suho leto z deževnim, gredo skozi druga zrna.

**Narečja.** Slovenija je majhna, a ima več kot $40$ narečij. Gore so nekoč ločevale doline, zato so se besede v vsaki spreminjale po svoje. Prekmurec in Primorec se v narečju težko razumeta, čeprav je jezik istega izvora. Pri vrstah se namesto besed spreminjajo aleli. Primerjava ima mejo: jezika se lahko naučiš, genov ne.

## Drugače: Bolj natančno

Biologi naravni izbor opišejo s **pogostostjo alela**: kolikšen delež vseh alelov nekega gena v populaciji je prav ta alel. Po suši se je povečala pogostost alelov za debel kljun. Ni dovolj, da osebek preživi: šteje, koliko potomcev pusti.

Kadar novo populacijo osnuje le nekaj osebkov, kot $10$ kuščarjev na Pod Mrčaru, nosijo le majhen del alelov stare populacije, zato je nova populacija drugačna tudi brez izbora. Temu rečemo **učinek ustanovitelja**.

Bakterije si odpornost lahko tudi podajo: gen zanjo je pogosto na plazmidu, ki ga bakterija preda sosednji, celo drugi vrsti. Zato se odpornost širi hitreje kot samo z mutacijami.


## Preveri se

? V jamah Krasa živi človeška ribica. Nima delujočih oči, zelo dobro pa zazna vonj in tresljaje v vodi. Kaj od naštetega je pri njej **prilagoditev**?
- To, da se je naučila živeti v temi in zato so njeni mladiči slepi.
~ Kar osebek pridobi ali se nauči med življenjem, se ne deduje. Prilagoditev je dedna lastnost.
- Katerakoli mutacija v njeni DNA.
~ Večina mutacij nima učinka ali škodi.
+ Dedno izostren čut za vonj, s katerim v temi najde hrano.
- To, da so jame ločene od rek na površju.
~ To je lastnost okolja, ki lahko povzroči geografsko izolacijo. Prilagoditev je lastnost živega bitja.
> Prilagoditev je dedna lastnost, ki osebku v njegovem okolju poveča možnost preživetja in potomcev. V popolni temi vonj nadomesti vid.

? Razvrsti korake nastanka nove vrste ščinkavcev od prvega do zadnjega.
1. Veter s celine na otok zanese nekaj ščinkavcev.
2. Ptice se razširijo na več otokov, morje jih loči.
3. Na vsakem otoku nastajajo druge mutacije in okolje izbira drugače.
4. Po mnogo rodovih se populacije na otokih močno razlikujejo.
5. Ptice z različnih otokov se ne morejo več pariti in imeti plodnih potomcev.
> Najprej izolacija, nato mutacije in izbor skozi mnogo rodov. Nova vrsta nastane šele, ko se populaciji ne moreta več uspešno pariti.

? Kaj se zgodi, če bolnik z bakterijskim vnetjem antibiotik opusti prezgodaj, takoj ko se počuti bolje?
- Nič, ker so takrat vse bakterije že mrtve.
~ Bakterij je manj, a ne nič. Ostale so najmanj občutljive.
- Bolnik sam postane odporen na antibiotik.
~ Odporne postanejo bakterije, ne človek.
- Bakterije se med zdravljenjem navadijo na antibiotik in zato mutirajo.
~ Mutacije so naključne. Antibiotik le izbere bakterije, ki so odporne že od prej.
+ Preživijo predvsem najbolj odporne bakterije in se namnožijo, zato isti antibiotik naslednjič slabše deluje.
> Antibiotik je okolje, ki izbira. Če ga opustiš prezgodaj, ostanejo najmanj občutljive bakterije.

? Na otoku je vulkanski pepel prekril tla s temno plastjo. Stolpci kažejo, koliko temnih in svetlih hroščev je bilo pred poletjem in po njem, ko so jih lovile ptice. Kolikšen odstotek hroščev je po poletju temnih?
:::risba stolpci
opis: Število hroščev na otoku s temnimi tlemi. Pred poletjem 200 temnih in 600 svetlih. Po poletju 180 temnih in 300 svetlih.
podnapis: Hrošči pred poletjem in po njem
os: število hroščev
korak: 100
stolpec: temni, prej | 200
stolpec: svetli, prej | 600
stolpec: temni, po | 180
stolpec: svetli, po | 300
:::
= 37,5 % | 0,5
~ 25 | To je delež temnih pred poletjem, $\dfrac{200}{800}$. Vprašanje sprašuje po poletju.
~ 62,5 | To je odstotek svetlih hroščev po poletju. Temnih je $180$ od $480$.
~ 90 | To je odstotek temnih, ki so preživeli, $\dfrac{180}{200}$. Iščeš delež temnih med vsemi hrošči po poletju.
> Po poletju je vseh hroščev $180 + 300 = 480$, temnih $\dfrac{180}{480} = 0{,}375$, torej $37{,}5\,\%$ (prej $25\,\%$).

? V kulturi je $5 \cdot 10^8$ bakterij. Odporna proti antibiotiku je po naključju ena od milijona ($10^6$). Koliko bakterij preživi, ko kulturo zalijemo z antibiotikom?
- $0$
~ Antibiotik ubije le občutljive. Odporne, ki so bile tam že prej, preživijo.
- $5 \cdot 10^8$
~ To bi veljalo, če bi se vse bakterije navadile na antibiotik. Preživijo le tiste z mutacijo.
- $5 \cdot 10^{14}$
~ Množil si namesto delil. Ena od milijona pomeni, da število deliš z $10^6$.
+ $500$
> $\dfrac{5 \cdot 10^8}{10^6} = 5 \cdot 10^2 = 500$. Vsi njihovi potomci so odporni.

:::simboli
N_\mathrm{odp} | število odpornih bakterij | N_\mathrm{odp} = \dfrac{N}{k} | – |
N | število bakterij | N = N_0 \cdot 2^n | – | v Primeru 1 vse bakterije v grlu
k | na koliko bakterij pride ena odporna | | – |
N_0 | začetno število bakterij | | – |
n | število delitev | n = \dfrac{t}{t_\mathrm{d}} | – |
t | čas | | min | v Primeru 3 v letih
t_\mathrm{d} | čas ene delitve | | min |
r | število rodov | r = \dfrac{t}{T} | – |
T | trajanje enega rodu | | leto |
:::

<<RACUN
vrednost: 300*0.6 | 180
vrednost: 900*0.1 | 90
vrednost: 180+90 | 270
vrednost: 300/1200 | 0.25
vrednost: 180/270 | 0.67
vrednost: 2*10^8/10^7 | 20
vrednost: 170-140 | 30
vrednost: 170-20 | 150
vrednost: 150-140 | 10
vrednost: 36/1.2 | 30
vrednost: 180/20 | 9
vrednost: 2^9 | 512
vrednost: 20*2^9 | 10240
vrednost: 180/480 | 0.375
vrednost: 200/800 | 0.25
vrednost: 300/480 | 0.625
vrednost: 180/200 | 0.9
vrednost: 5*10^8/10^6 | 500
>>
