---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Laboratorij za celične kulture testira novo zdravilo proti raku. Rakave celice gojijo v dveh posodah: v eni z zdravilom, v drugi brez. Po šestih urah ima posoda z zdravilom skoraj enako število celic kot na začetku, a pod mikroskopom je v njej skoraj tretjina celic okroglih, s kromosomi, zbranimi v sredini. V posodi brez zdravila je takih celic le nekaj odstotkov. Kaj je zdravilo naredilo? In kako iz preštetih celic sploh ugotoviš, koliko časa celica preživi v posamezni fazi?

Odgovor da celični cikel. Ko poznaš njegove faze in kontrolne točke, iz enega mikroskopskega preparata in ene meritve s pretočnim citometrom izračunaš trajanje faz, iz deleža celic v mitozi pa prepoznaš, kje zdravilo cikel ustavi.

## Razlaga

### 1. Cikel kot ura

**Definicija.** *Celični cikel* je zaporedje dogodkov od nastanka celice z delitvijo do njene lastne delitve. Razdelimo ga na **interfazo** (G1, S, G2) in **fazo M** (mitoza in citokineza). Čas enega obrata je *generacijski čas* $T$.

Predstavljaj si cikel kot številčnico ure. Za tipično človeško celico v kulturi z $T = 24\,\mathrm{h}$ so faze razporejene približno takole:

| faza | kaj se zgodi | trajanje |
|---|---|---|
| G1 | rast celice | $\approx 11\,\mathrm{h}$ |
| S | podvojitev DNA | $\approx 8\,\mathrm{h}$ |
| G2 | priprava | $\approx 4\,\mathrm{h}$ |
| M | delitev | $\approx 1\,\mathrm{h}$ |

V G1 celica raste in izdeluje beljakovine ter organele, v G2 se pripravlja na delitev, faza M obsega mitozo in citokinezo. Mitoza je na uri le kratek izsek, interfaza pa skoraj ves krog. Zato je v vsakem preparatu večina celic v interfazi. Celice, ki se ne delijo več (nevroni, večina mišičnih celic), izstopijo iz G1 v mirovno fazo **G0**. Jetrne celice so v G0, a se ob poškodbi jeter vrnejo v cikel.

Kaj se zgodi z DNA? Količino DNA v jedru diploidne celice v G1 označimo z $2C$. V fazi S se vsaka molekula DNA podvoji, zato ima celica v G2 količino $4C$. Število kromosomov se pri tem **ne spremeni**: kromosom ima po fazi S dve **sestrski kromatidi**, ki ju skupaj drži beljakovinski kompleks **kohezin**. Človeška celica ima v G1 in v G2 po $46$ kromosomov, kromatid pa v G1 $46$ in v G2 $92$.

### 2. Mitoza na slikah

Mitozo opišemo s petimi zaporednimi slikami, kot jih vidiš v svetlobnem mikroskopu.

1. **Profaza.** Kromatin se zgosti v vidne kromosome, vsak iz dveh kromatid. Centrosoma, podvojena v interfazi, se razmakneta proti poloma in med njima začne rasti **delitveno vreteno** iz mikrotubulov.
2. **Prometafaza.** Jedrna ovojnica razpade. Na centromeri vsake kromatide je **kinetohor**, na katerega se pripnejo mikrotubuli vretena. Sestrski kinetohori se pripnejo na nasprotna pola.
3. **Metafaza.** Kromosomi se uredijo v **ekvatorialno ravnino** sredi celice. To je trenutek, ko so kromosomi najbolj zgoščeni in jih najlaže preštejemo.
4. **Anafaza.** Encim **separaza** razcepi kohezin. Sestrski kromatidi se ločita in vsaka postane samostojen kromosom. Mikrotubuli kinetohorov se krajšajo in vlečejo kromosome k poloma (anafaza A), pola pa se razmikata (anafaza B).
5. **Telofaza.** Okoli obeh skupin kromosomov nastane nova jedrna ovojnica, kromosomi se razgostijo, vreteno razpade.

**Citokineza** razdeli citoplazmo. Pri živalski celici pod membrano v ravnini nekdanjega ekvatorja nastane **kontraktilni obroč** iz aktina in miozina II. Obroč se zateguje kot vrvica na vrečki, nastane **brazda** in celica se zažme na dve. Rastlinska celica ima togo steno in se ne more zažeti. Mikrotubuli med jedroma tvorijo **fragmoplast**, ob katerem se zlivajo vezikli iz Golgijevega aparata. Nastane **celična plošča**, ki raste od sredine navzven, dokler se ne zlije s staro steno.

:::premisli
Celica gre skozi mitozo, citokineza pa se ne zgodi. Napovej, kakšno celico dobiš in koliko kromosomov ima.
---
Dobiš eno celico z dvema jedroma, vsako jedro ima polno diploidno število kromosomov ($46$ pri človeku). Takšne dvojedrne celice nastajajo naravno, na primer v jetrih in v mišici srca.
:::

### 3. Kontrolne točke in pogon cikla

Cikel poganjajo **ciklinsko odvisne kinaze** (CDK). Kinaza je dejavna le, ko se nanjo veže ustrezen **ciklin**. Ciklini se v ciklu sintetizirajo in razgradijo, zato se aktivnost kinaz dviga in pada kot valovi:

- ciklin D s CDK4/6 in ciklin E s CDK2 sprožita prehod G1 → S;
- ciklin A s CDK2 vodi fazo S;
- ciklin B s CDK1 (dejavnik MPF) sproži vstop v mitozo.

**Definicija.** *Kontrolna točka* je mehanizem, ki ustavi cikel, dokler ni izpolnjen pogoj za naslednji korak.

| kontrolna točka | kaj preveri |
|---|---|
| G1/S (točka R) | velikost, rastni dejavniki, poškodbe DNA |
| G2/M | ali je DNA podvojena in nepoškodovana |
| metafaza/anafaza | ali so vsi kinetohori pripeti na vreteno |

Na točki **G1/S** se odloči, ali se bo celica delila. Ciklin D-CDK4/6 fosforilira beljakovino **Rb**, ki zato sprosti prepisni dejavnik **E2F**. Ta vklopi gene za fazo S. Če je DNA poškodovana, se kopiči beljakovina **p53**, ki vklopi zaviralec **p21**. Ta zavre CDK in cikel obstane, dokler popravljalni encimi ne odpravijo poškodbe.

Na točki **G2/M** celica preveri, ali je DNA vsa podvojena in nepoškodovana. Če ni, ostane CDK1 zavrta in celica ne vstopi v mitozo.

**Kontrolna točka vretena** (prehod metafaza-anafaza) je najbolj natančna. Vsak kinetohor, ki ni pravilno pripet, oddaja signal, ki zavira kompleks **APC/C**. Ko so pripeti vsi, APC/C označi z ubikvitinom zaviralec separaze **sekurin** in ciklin B. Oba se razgradita v proteasomu: separaza razcepi kohezin in nastopi anafaza, upad ciklina B pa celico popelje iz mitoze. En sam nepripet kinetohor zadošča, da se anafaza ne začne.

:::premisli
Zdravila taksani stabilizirajo mikrotubule, zato se vreteno ne more pravilno krčiti in pripenjati kinetohorov. V kateri fazi se bodo kopičile celice in zakaj prav tam?
---
Kopičile se bodo v mitozi, v metafazi oziroma prometafazi. Kontrolna točka vretena zaznava nepravilno pripete kinetohore in zavira APC/C, zato se separaza ne aktivira in anafaza se ne začne. To je odgovor na uganko z začetka: zdravilo je ustavilo celice v mitozi.
:::

### 4. Od štetja do časa

Kako izmerimo trajanje faz, če celice ne moremo opazovati 24 ur? Pomagamo si s **populacijo**. V kulturi, ki se deli nesinhrono, je delež celic v neki fazi približno sorazmeren s trajanjem te faze. Če je celic v mitozi $4\,\%$, celica v mitozi preživi približno $4\,\%$ cikla.

**Definicija.** *Mitotski indeks* je delež celic v mitozi:

$$I_\mathrm{M} = \frac{N_\mathrm{M}}{N}$$

Trajanje faze ocenimo z

$$t_\mathrm{f} = f \cdot T$$

kjer je $f$ delež celic v tej fazi. To je približek. V rastoči kulturi je mladih celic več kot starih, ker iz vsake delitve nastaneta dve; natančnejša formula je v razdelku »Bolj natančno«.

Generacijski čas dobimo iz rasti kulture. Če se celice delijo, se njihovo število vsak $T$ podvoji:

$$N = N_0 \cdot 2^{t/T}$$

Delež celic v G1, S in G2+M izmerimo s **pretočnim citometrom**: DNA obarvamo s fluorescentnim barvilom, ki se veže sorazmerno s količino DNA, in vsaki celici izmerimo svetlost. Histogram ima vrh pri $2C$ (G1), vrh pri $4C$ (G2 in M) in vmes plato (S).

## Rešeni primeri

### Primer 1: mitotski indeks iz preparata

Na obarvanem preparatu konice korenine čebule prešteješ $1000$ celic, od teh je $42$ v mitozi. Generacijski čas celic je $24\,\mathrm{h}$. Kolikšen je mitotski indeks in koliko časa traja mitoza?

**Podatki:** $N = 1000$, $N_\mathrm{M} = 42$, $T = 24\,\mathrm{h}$
**Iščemo:** mitotski indeks $I_\mathrm{M}$ in trajanje mitoze $t_\mathrm{M}$

:::formula
$I_\mathrm{M} = \dfrac{N_\mathrm{M}}{N}$ in $t_\mathrm{M} = I_\mathrm{M} \cdot T$
:::

**Rešitev:**

1. $I_\mathrm{M} = \dfrac{42}{1000} = 0{,}042$, torej $4{,}2\,\%$.
2. $t_\mathrm{M} = 0{,}042 \cdot 24\,\mathrm{h} \approx 1{,}0\,\mathrm{h}$.
3. Odgovor: mitotski indeks je $4{,}2\,\%$, mitoza traja okoli eno uro. Zato moraš za zanesljiv indeks prešteti veliko celic: med stotimi so v mitozi le kakšne štiri.

### Primer 2: generacijski čas iz štetja celic

V kulturo nasadiš $2{,}0 \cdot 10^5$ celic. Po $96\,\mathrm{h}$ jih z avtomatskim števcem našteješ $3{,}2 \cdot 10^6$. Kolikšen je generacijski čas?

**Podatki:** $N_0 = 2{,}0 \cdot 10^5$, $N = 3{,}2 \cdot 10^6$, $t = 96\,\mathrm{h}$
**Iščemo:** generacijski čas $T$

:::formula
$N = N_0 \cdot 2^{t/T}$, torej $T = \dfrac{t}{\log_2 (N/N_0)}$
:::

**Rešitev:**

1. Razmerje: $\dfrac{N}{N_0} = \dfrac{3{,}2 \cdot 10^6}{2{,}0 \cdot 10^5} = 16$.
2. Število podvojitev: $\log_2 16 = 4$, ker je $2^4 = 16$.
3. $T = \dfrac{96\,\mathrm{h}}{4} = 24\,\mathrm{h}$.
4. Odgovor: celice se podvojijo vsakih $24\,\mathrm{h}$. Račun velja, če se delijo vse celice in nobena ne odmre.

### Primer 3 (izpitna raven): trajanje vseh faz in učinek zdravila

Kultura raste z $1{,}0 \cdot 10^5$ na $8{,}0 \cdot 10^5$ celic v $72\,\mathrm{h}$. Pretočni citometer izmeri $20\,000$ celic: $11\,000$ jih ima $2C$, $3000$ jih ima $4C$, ostale so vmes. Na preparatu je mitotski indeks $4\,\%$. (a) Izračunaj generacijski čas in trajanje G1, S, G2 in M. (b) Kulturi dodaš zdravilo, ki prepreči nastanek vretena. Oceni, kolikšen delež celic bo v mitozi po $6\,\mathrm{h}$.

**Podatki:** $N_0 = 1{,}0 \cdot 10^5$, $N = 8{,}0 \cdot 10^5$, $t = 72\,\mathrm{h}$, $N_\mathrm{c} = 20\,000$, $N_{2C} = 11\,000$, $N_{4C} = 3000$, $I_\mathrm{M} = 0{,}04$, čas z zdravilom $t_\mathrm{z} = 6\,\mathrm{h}$
**Iščemo:** $T$, $t_\mathrm{G1}$, $t_\mathrm{S}$, $t_\mathrm{G2}$, $t_\mathrm{M}$ in delež celic v mitozi po $6\,\mathrm{h}$

:::formula
$T = \dfrac{t}{\log_2 (N/N_0)}$; $t_\mathrm{f} = f \cdot T$
:::

**Rešitev:**

1. Rast: $N/N_0 = 8$, kar so $3$ podvojitve, zato $T = 72\,\mathrm{h}/3 = 24\,\mathrm{h}$.
2. Deleži iz citometra: G1 $= 11\,000/20\,000 = 0{,}55$; G2+M $= 3000/20\,000 = 0{,}15$; S $= 1 - 0{,}55 - 0{,}15 = 0{,}30$.
3. Trajanja: $t_\mathrm{G1} = 0{,}55 \cdot 24 = 13{,}2\,\mathrm{h}$; $t_\mathrm{S} = 0{,}30 \cdot 24 = 7{,}2\,\mathrm{h}$; G2 in M skupaj $0{,}15 \cdot 24 = 3{,}6\,\mathrm{h}$.
4. Citometer ne loči G2 od M, ker imata obe $4C$. Mitozo ločimo z mikroskopom: $t_\mathrm{M} = 0{,}04 \cdot 24 = 0{,}96\,\mathrm{h}$, zato $t_\mathrm{G2} = 3{,}6 - 0{,}96 = 2{,}64\,\mathrm{h}$.
5. (b) Brez vretena kontrolna točka vretena celice ustavi v mitozi, iz nje ne izstopi nobena. V $6\,\mathrm{h}$ v mitozo vstopijo vse celice, ki so imele do nje manj kot $6\,\mathrm{h}$: približno $6/24 = 0{,}25$ vseh. K njim prištejemo $0{,}04$, ki so že bile v mitozi.
6. Odgovor: $T = 24\,\mathrm{h}$; G1 traja okoli $13{,}2\,\mathrm{h}$, S $7{,}2\,\mathrm{h}$, G2 $2{,}6\,\mathrm{h}$ in M okoli $1\,\mathrm{h}$. Po $6\,\mathrm{h}$ z zdravilom bo v mitozi okoli $29\,\%$ celic. To je slika iz uvodne uganke.

### Primer 4: zdaj ti

Za poskus potrebuješ $1{,}0 \cdot 10^8$ celic, imaš pa jih $1{,}0 \cdot 10^6$. Generacijski čas je $20\,\mathrm{h}$. Koliko časa moraš celice gojiti?

**Podatki:** $N_0 = 1{,}0 \cdot 10^6$, $N = 1{,}0 \cdot 10^8$, $T = 20\,\mathrm{h}$
**Iščemo:** čas gojenja $t$

:::formula
$t = T \cdot \log_2 \dfrac{N}{N_0}$
:::

**Rešitev:**

1. Razmerje je $\dfrac{N}{N_0} = 100$.
2. Izračunaj število podvojitev in čas.

:::premisli
Koliko podvojitev je potrebnih in koliko je to ur?
---
$\log_2 100 = \dfrac{\ln 100}{\ln 2} \approx 6{,}64$ podvojitve, zato $t \approx 6{,}64 \cdot 20\,\mathrm{h} \approx 133\,\mathrm{h}$, kar je okoli $5{,}5$ dneva.
:::

## Pogoste napake

- **»V fazi S se podvoji število kromosomov.«** Podvoji se DNA, kromosomov pa je še vedno $46$; vsak ima zdaj dve kromatidi. Število kromosomov se podvoji šele v anafazi, ko se kromatidi ločita.
- **»Interfaza je mirovanje.«** V interfazi celica raste, sintetizira beljakovine, podvaja DNA in centrosom. Miruje le celica v G0, pa še ta opravlja svojo nalogo v tkivu.
- **»Mitoza in celična delitev sta isto.«** Mitoza je delitev jedra, citokineza delitev citoplazme. Lahko se zgodi mitoza brez citokineze, nastane dvojedrna celica.
- **»Delež celic v fazi je trajanje faze.«** Delež je brez enote; trajanje dobiš šele, ko ga pomnožiš z generacijskim časom. Tudi tako je le približek za nesinhrono kulturo.
- **»Kromatide se ločijo, ker jih vreteno raztrga.«** Vreteno vleče, a kromatidi ostaneta skupaj, dokler separaza ne razcepi kohezina. Vlek brez razcepa celico ustavi v metafazi.

## Povzetek

- Celični cikel: G1 (rast), S (podvojevanje DNA, $2C \to 4C$), G2 (priprava), M (mitoza in citokineza). Iz G1 lahko celica izstopi v G0.
- Mitoza: profaza, prometafaza (razpad ovojnice, pripenjanje na kinetohore), metafaza (ekvatorialna ravnina), anafaza (separaza razcepi kohezin, kromatidi gresta k poloma), telofaza.
- Citokineza: pri živalih kontraktilni obroč aktina in miozina, pri rastlinah fragmoplast in celična plošča.
- Pogon: ciklini in CDK. Kontrolne točke: G1/S (Rb, E2F, p53, p21), G2/M (podvojena, nepoškodovana DNA), vreteno (vsi kinetohori pripeti, APC/C, sekurin, separaza).
- Merjenje: $I_\mathrm{M} = N_\mathrm{M}/N$, $t_\mathrm{f} \approx f T$, $N = N_0 \cdot 2^{t/T}$; citometer loči $2C$, S in $4C$.

## Za izpit

Znati moraš povedati:

- faze celičnega cikla in mitoze v pravem vrstnem redu, z dogodki in številom kromosomov ter kromatid v vsaki;
- kako potekata citokineza živalske in rastlinske celice in zakaj sta različni;
- vse tri kontrolne točke: kaj preverijo in s katerimi molekulami ustavijo cikel;
- vlogo kohezina, separaze, sekurina in APC/C pri prehodu v anafazo;
- kako iz mitotskega indeksa, rasti kulture in citometrije izračunaš trajanje faz.

### Naloga 1

Kultura zraste s $5{,}0 \cdot 10^4$ na $4{,}0 \cdot 10^5$ celic v $66\,\mathrm{h}$. Citometer pokaže $50\,\%$ celic v G1, $35\,\%$ v S in $15\,\%$ v G2+M, mitotski indeks je $5\,\%$. (a) Izračunaj generacijski čas in trajanje vseh štirih faz s približkom $t_\mathrm{f} = f T$. (b) Za zadnjo fazo cikla v rastoči kulturi velja natančna zveza $t_\mathrm{M} = T \log_2 (1 + I_\mathrm{M})$. Izračunaj $t_\mathrm{M}$ še tako in povej, za koliko odstotkov se približek zmoti.

**Rešitev:**

1. $N/N_0 = 8$, torej $3$ podvojitve in $T = 66/3 = 22\,\mathrm{h}$.
2. $t_\mathrm{G1} = 0{,}50 \cdot 22 = 11\,\mathrm{h}$, $t_\mathrm{S} = 0{,}35 \cdot 22 = 7{,}7\,\mathrm{h}$, G2+M $= 0{,}15 \cdot 22 = 3{,}3\,\mathrm{h}$.
3. $t_\mathrm{M} = 0{,}05 \cdot 22 = 1{,}1\,\mathrm{h}$, zato $t_\mathrm{G2} = 3{,}3 - 1{,}1 = 2{,}2\,\mathrm{h}$.
4. (b) $t_\mathrm{M} = 22 \cdot \log_2 1{,}05 = 22 \cdot 0{,}0704 \approx 1{,}55\,\mathrm{h}$.
5. Približek $1{,}1\,\mathrm{h}$ je za $1 - 1{,}1/1{,}55 \approx 0{,}29$, torej okoli $29\,\%$ premajhen.
6. Odgovor: $T = 22\,\mathrm{h}$; G1 $11\,\mathrm{h}$, S $7{,}7\,\mathrm{h}$, G2 $2{,}2\,\mathrm{h}$, M $1{,}1\,\mathrm{h}$ po približku in $1{,}55\,\mathrm{h}$ natančno. Približek podceni trajanje zadnje faze, ker je v rastoči kulturi starih celic manj, kot bi jih bilo pri enakomerni porazdelitvi.

### Naloga 2

Natančno opiši kontrolno točko vretena. Utemelji, zakaj je ločitev sestrskih kromatid nepovratna in zakaj mora celica pred njo počakati na pripetje **vseh** kinetohorov, ne le večine.

**Rešitev:**

1. Nepripeti ali napačno pripeti kinetohori oddajajo signal, ki zavira APC/C skupaj z njegovim aktivatorjem.
2. Ko so vsi kinetohori pripeti in napeti na nasprotna pola, zaviranje preneha. APC/C označi sekurin in ciklin B z ubikvitinom, proteasom ju razgradi.
3. Brez sekurina je separaza aktivna in razcepi kohezin. Kohezina celica med mitozo ne more več sestaviti nazaj, razgradnja beljakovin je nepovratna: ločeni kromatidi se ne moreta več povezati.
4. Če bi celica začela anafazo z enim nepripetim kinetohorom, bi obe kromatidi tega kromosoma lahko odšli k istemu polu. Ena hčerinska celica bi imela kromosom preveč, druga premalo (**aneuploidija**). Zato zadošča en sam nepripet kinetohor, da se anafaza ne začne.
5. Upad ciklina B hkrati zniža aktivnost CDK1 in omogoči telofazo in citokinezo.

### Naloga 3

Celica ima diploidno število $2n = 8$ in v G1 $3{,}0\,\mathrm{pg}$ DNA v jedru. Za G1, G2, metafazo, anafazo (cela celica) in vsako hčerinsko celico po citokinezi navedi število kromosomov, število kromatid in količino DNA.

**Rešitev:**

1. G1: $8$ kromosomov, $8$ kromatid, $3{,}0\,\mathrm{pg}$ ($2C$).
2. G2: DNA se je podvojila, kromosomov je še $8$, kromatid $16$, DNA $6{,}0\,\mathrm{pg}$ ($4C$).
3. Metafaza: enako kot G2, $8$ kromosomov s po dvema kromatidama, $6{,}0\,\mathrm{pg}$.
4. Anafaza: kromatidi sta se ločili, vsaka je kromosom: $16$ kromosomov, $16$ kromatid, še vedno $6{,}0\,\mathrm{pg}$ v eni celici.
5. Hčerinska celica: $8$ kromosomov, $8$ kromatid, $3{,}0\,\mathrm{pg}$, enako kot materinska celica v G1.

## Drugače: Z analogijo

Celični cikel je kot tiskanje in vezava knjige v dveh izvodih.

- G1: tiskarna kupi papir in preveri, ali je naročilo sploh potrjeno (točka R).
- S: vsako stran natisne dvakrat in obe kopiji spne s sponko (kohezin).
- G2: kontrolor preveri, ali so natisnjene vse strani in brez napak.
- Mitoza: vsak par strani pripne na dve tekoči traki, ki gresta v nasprotni smeri. Šele ko je na traka pripet prav vsak par, delavec naenkrat prereže vse sponke (separaza).
- Citokineza: dva kupa ločijo v dve škatli.

Če bi delavec prerezal sponke, ko bi bil en par še nepripet, bi obe kopiji te strani lahko končali v isti škatli. Ena knjiga bi imela stran dvakrat, druga je ne bi imela. To je aneuploidija.

## Drugače: Uporaba v stroki

- *Kariotipizacija.* V genetskem laboratoriju limfocite spodbudijo k delitvi in dodajo kolhicin, ki prepreči nastanek vretena. Celice obstanejo v metafazi, kjer so kromosomi najbolj zgoščeni, zato jih lahko preštejejo in uredijo v kariogram.
- *Onkologija.* Patologi barvajo beljakovino Ki-67, ki je prisotna v vseh fazah razen G0. Delež obarvanih jeder pove, kako hitro tumor raste, in vpliva na izbiro zdravljenja.
- *Zdravila.* Taksani in vinka alkaloidi delujejo na mikrotubule in ustavijo celice v mitozi; zaviralci CDK4/6 ustavijo celice v G1 in se uporabljajo pri nekaterih vrstah raka dojke. Stranski učinki (izpadanje las, manj krvnih celic) prizadenejo tkiva, kjer se celice hitro delijo.
- *Biotehnologija.* Pri proizvodnji beljakovin v bioreaktorju spremljajo generacijski čas celic, da ugotovijo, kdaj kultura preide iz rasti v fazo, ko celice največ proizvajajo.

## Drugače: Bolj natančno

V nesinhroni kulturi, ki raste eksponentno, je porazdelitev celic po starosti $a$ (čas od zadnje delitve) padajoča: celic s starostjo $a$ je sorazmerno $2^{-a/T}$. Novih celic je dvakrat več kot tistih tik pred delitvijo. Delež celic s starostjo med $a_1$ in $a_2$ je zato

$$f = 2^{1 - a_1/T} - 2^{1 - a_2/T}$$

Za zadnjo fazo ($a_2 = T$, $a_1 = T - t_\mathrm{M}$) sledi $f = 2^{t_\mathrm{M}/T} - 1$, torej $t_\mathrm{M} = T \log_2 (1 + f)$. Za majhne $f$ je to približno $1{,}44 \cdot f T$, zato preprosti približek $t = fT$ zadnjo fazo podceni za okoli $30\,\%$, prvo fazo G1 pa preceni. Pri tkivih, kjer se večina celic ne deli, so odstopanja še večja, ker se del celic sploh ne giblje po ciklu (rastni delež).

## Preveri se

? Oceni brez kalkulatorja: v nesinhroni kulturi z generacijskim časom $30\,\mathrm{h}$ je v mitozi $2\,\%$ celic. Koliko časa približno traja mitoza?
- Okoli $2\,\mathrm{h}$.
~ Odstotek ni čas: delež celic moraš pomnožiti z generacijskim časom.
+ Okoli $0{,}6\,\mathrm{h}$, torej dobrih pol ure.
- Okoli $15\,\mathrm{h}$.
~ To je $30/2$: generacijski čas je deljen z odstotkom, namesto da bi ga pomnožil z deležem $0{,}02$.
> $t_\mathrm{M} \approx 0{,}02 \cdot 30\,\mathrm{h} = 0{,}6\,\mathrm{h}$. Natančnejša zveza iz razdelka »Bolj natančno« da $30\,\mathrm{h} \cdot \log_2 1{,}02 \approx 0{,}86\,\mathrm{h}$.

? Človeška celica ima v G1 $46$ kromosomov. Koliko kromatid ima ista celica v metafazi mitoze?
- $46$
~ To je število kromosomov; po fazi S ima vsak kromosom dve kromatidi.
- $23$
~ Polovično število je značilno za gamete po mejozi, ne za mitozo.
+ $92$
> V fazi S se DNA podvoji: $46$ kromosomov po $2$ kromatidi je $92$ kromatid.

? Celica ima okvarjen gen za p53, poleg tega ji obsevanje poškoduje DNA. Kaj se najverjetneje zgodi?
- Celica se ustavi v G1, dokler poškodbe niso popravljene.
~ Ustavitev v G1 je naloga p53 in p21; brez p53 je ni.
+ Celica nadaljuje cikel in poškodovano DNA prenese na hčerinske celice.
- Celica takoj vstopi v anafazo, ker se kontrolna točka vretena izklopi.
~ Kontrolna točka vretena preverja pripetje kinetohorov, ne poškodb DNA, in ni odvisna od p53.
> Brez p53 se ne vklopi p21, CDK niso zavrte in celica gre v fazo S kljub poškodbi. Kontrolna točka G2/M jo lahko še za kratek čas zadrži, a brez p53 ta zaustavitev ne traja dovolj dolgo. Zato so okvare p53 pogoste pri raku.

? Kulturi z generacijskim časom $24\,\mathrm{h}$ dodaš zdravilo, ki ustavi celice v mitozi, in jo po $24\,\mathrm{h}$ izmeriš s pretočnim citometrom. Kateri izid (deleži celic z $2C$, vmes in s $4C$) ustreza tej kulturi?
- $2C$: $55\,\%$; vmes: $30\,\%$; $4C$: $15\,\%$
~ To je običajna nesinhrona kultura brez zdravila, kot v Primeru 3.
- $2C$: $90\,\%$; vmes: $5\,\%$; $4C$: $5\,\%$
~ Kopičenje pri $2C$ pomeni zaustavitev v G1, na primer z zaviralcem CDK4/6.
+ $2C$: $5\,\%$; vmes: $5\,\%$; $4C$: $90\,\%$
> Celice, ustavljene v mitozi, imajo podvojeno DNA ($4C$). V enem generacijskem času pride do mitoze skoraj vsaka celica in tam obstane.

? Bolnik med kemoterapijo s taksanom izgubi lase, koža na rokah pa se mu ne spremeni opazno. Zakaj prav lasje?
- Taksan se veže na keratin v laseh.
~ Taksan deluje na mikrotubule v celicah, ki se delijo, ne na keratin.
+ Celice v lasnih mešičkih se zelo hitro delijo, zato jih zdravilo, ki ustavi mitozo, najbolj prizadene.
- Lasje so iz mrtvih celic, zato jih zdravilo lažje raztopi.
~ Steblo lasu je res iz mrtvih celic, a lasje izpadajo, ker se ustavi delitev živih celic v mešičku.
> Zdravila, ki ustavijo mitozo, prizadenejo vsa tkiva s hitro delitvijo: lasne mešičke, kostni mozeg, sluznico črevesa.

:::simboli
I_\mathrm{M} | mitotski indeks | I_\mathrm{M} = \frac{N_\mathrm{M}}{N} | –
N_\mathrm{M} | število celic v mitozi | | –
N | število celic | N = N_0 \cdot 2^{t/T} | –
N_0 | začetno število celic | | –
t_\mathrm{f} | trajanje faze | t_\mathrm{f} = f \cdot T | h
t_\mathrm{M} | trajanje mitoze | t_\mathrm{M} = I_\mathrm{M} \cdot T | h
f | delež celic v fazi | | –
T | generacijski čas | T = \frac{t}{\log_2 (N/N_0)} | h
t | čas rasti kulture | t = T \cdot \log_2 \frac{N}{N_0} | h
a_1, a_2 | starost celice na začetku in koncu faze | | h | čas od zadnje delitve
:::
