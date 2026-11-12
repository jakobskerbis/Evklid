---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poskus za doma: palačinko ali tortiljo dvakrat prereži z ravnim nožem, tako da se reza sekata. Nastanejo štirje kosi s konicami v isti točki. Izmeri kote pri konicah s kotomerom. Kosa, ki ležita nasproti, imata enako velik kot. Kosa drug ob drugem pa imata skupaj vedno $180^\circ$, ne glede na to, kako poševno si rezal.

Nato na rešetko v pečici, katere žice so vzporedne, položi raven nož poševno čez dve žici. Pri obeh žicah nastane enak »šop« kotov. Zakaj je tako in kdaj to ne velja več? Odgovor je v osnovnih pojmih geometrije: premica, kot, vzporednost. Z njimi bomo pozneje računali kote v trikotnikih in štirikotnikih.

## Razlaga

**1. Točka, premica, ravnina.** To so **osnovni (neopredeljeni) pojmi**: ne definiramo jih, ampak jih opišemo z lastnostmi. Točko označimo z veliko črko ($A$, $B$, $C$), premico z malo črko ($p$, $q$) ali z dvema njenima točkama ($AB$). Premica je ravna in neomejena na obeh straneh. Velja:

- skozi dve različni točki gre natanko ena premica,
- dve različni premici imata največ eno skupno točko.

**2. Poltrak in daljica.** Točka $A$ na premici jo razdeli na dva **poltraka** z izhodiščem $A$. Del premice med točkama $A$ in $B$ (z obema krajiščema) je **daljica** $AB$. Njeno dolžino označimo $|AB|$, razdalja med točkama $A$ in $B$ je prav ta dolžina. Razlika je v koncih: premica nima krajišča, poltrak ima eno, daljica dve. Zato lahko izmerimo samo dolžino daljice. Rez noža po pici od roba do roba je daljica, ne premica. **Razpolovišče** daljice je točka na njej, ki je enako oddaljena od obeh krajišč.

**3. Medsebojna lega dveh premic v ravnini.** Pri sistemih linearnih enačb si videl, da se dve premici v koordinatnem sistemu sekata, sta vzporedni ali sovpadata. Enake tri možnosti veljajo za vsaki dve premici v ravnini, tudi brez koordinat. Lego zdaj ugotovimo brez računa, s skupnimi točkami:

| Lega | Opis | Zapis |
|---|---|---|
| sekata se | imata natanko eno skupno točko | |
| pravokotni sta | sekata se pod pravim kotom | $p \perp q$ |
| vzporedni sta | ležita v isti ravnini in nimata skupnih točk | $p \parallel q$ |
| sovpadata | imata vse točke skupne (je ista premica) | $p = q$ |

**Aksiom o vzporednici:** skozi točko, ki ne leži na dani premici, poteka natanko ena vzporednica k tej premici. Vzporednost je zamenljiva: če je $p \parallel q$, je tudi $q \parallel p$. Če sta premici $p$ in $q$ vzporedni s tretjo premico $r$, sta vzporedni tudi med seboj (ali pa sovpadata). Pravokotni premici sta poseben primer sekajočih se premic. Tudi pravokotnica je ena sama: skozi vsako točko poteka natanko ena pravokotnica na dano premico.

:::premisli
Premici $p$ in $q$ sta obe pravokotni na premico $r$ (vse tri ležijo v isti ravnini). Kakšna je lega $p$ in $q$? Napovej in utemelji.
---
Sta vzporedni (ali sovpadata). Če bi se sekali v točki $T$, bi skozi $T$ potekali dve različni pravokotnici na $r$, skozi točko pa gre na dano premico samo ena pravokotnica.
:::

**4. Razdalja točke od premice.** Najkrajša pot od točke $T$ do premice $p$ je po pravokotnici na $p$ skozi $T$. Dolžina te daljice je **razdalja točke od premice**. Vsaka točka premice $q \parallel p$ je od $p$ enako oddaljena, ta razdalja je **razdalja med vzporednicama**.

**5. Simetrala daljice.** **Simetrala daljice** je premica, ki je pravokotna na daljico in gre skozi njeno razpolovišče. Vse njene točke so enako oddaljene od obeh krajišč.

**6. Kot.** **Kot** je del ravnine, ki ga omejujeta dva poltraka s skupnim izhodiščem. Poltraka sta **kraka** kota, skupna točka je **vrh**. Kote označimo z grškimi črkami $\alpha, \beta, \gamma$ ali s tremi točkami, npr. $\angle AVB$ (vrh $V$ je v sredini). Kote merimo v **stopinjah**, polni kot meri $360^\circ$. **Simetrala kota** je poltrak z izhodiščem v vrhu kota, ki kot razpolovi.

| Vrsta kota | Velikost |
|---|---|
| ničelni | $0^\circ$ |
| ostri | med $0^\circ$ in $90^\circ$ |
| pravi | $90^\circ$ |
| topi | med $90^\circ$ in $180^\circ$ |
| iztegnjeni | $180^\circ$ |
| izbočeni | med $180^\circ$ in $360^\circ$ |
| polni | $360^\circ$ |

**7. Stopinje, minute, sekunde.** Kot pri času, kjer ima ura $60$ minut, delimo stopinjo na $60$ kotnih minut, minuto pa na $60$ kotnih sekund: $1^\circ = 60'$, $1' = 60''$. Tako kot $1\,\text{h}\,30\,\text{min}$ ni $1{,}3\,\text{h}$, tudi to ni decimalni zapis: kot $37^\circ 42'$ je $37^\circ$ in še $42$ minut, torej $37{,}7^\circ$ (ker je $42 : 60 = 0{,}7$), ne $37{,}42^\circ$. Pri seštevanju vsakih $60$ minut prenesemo v eno stopinjo: $48^\circ 35' + 27^\circ 40' = 75^\circ 75' = 76^\circ 15'$. Pri odštevanju si po potrebi »izposodimo« stopinjo: $90^\circ = 89^\circ 60'$.

**8. Pari kotov.**

- **Sovršna kota** nastaneta ob presečišču dveh premic in ležita nasproti. Sta *enaka*.
- **Sokota** (sosednja kota na premici) imata skupen krak, druga dva kraka pa tvorita premico. Njuna vsota je $180^\circ$.
- **Komplementarna (dopolnilna) kota** imata vsoto $90^\circ$: $\alpha + \beta = 90^\circ$.
- **Suplementarna kota** imata vsoto $180^\circ$ (sokota sta torej suplementarna).

Če se dve premici sekata in je en kot $\alpha$, sta dva kota enaka $\alpha$, druga dva pa $180^\circ - \alpha$.

**9. Koti ob prečnici vzporednic.** Premica $t$, ki seka vzporednici $p$ in $q$, je njuna **prečnica**. Nastane osem kotov, ki so največ dveh velikosti (pri $t \perp p$ so vsi pravi). Pari:

| Par kotov | Lega | Odnos pri $p \parallel q$ |
|---|---|---|
| **istoležna** | na isti strani prečnice, oba nad ali oba pod svojo premico | enaka |
| **izmenična** | oba med vzporednicama (ali oba zunaj), na nasprotnih straneh prečnice | enaka |
| **notranja na isti strani prečnice** | med vzporednicama, na isti strani prečnice | vsota $180^\circ$ |

Velja tudi **obrat**: če sta istoležna ali izmenična kota enaka (ali kota na isti strani prečnice suplementarna), sta premici vzporedni. Pazi: ta pravila veljajo *samo*, če sta premici vzporedni.

V simulaciji spodaj »Koti ob premicah« izberi »Vzporednici in prečnica« in premikaj drsnik »kot α«. Opazuj, kateri koti ostanejo enaki, ko prečnico vrtiš, in katera dva skupaj vedno merita $180^\circ$.

:::premisli
Na rešetki pečice je ena žica malo zasukana, zato ni vzporedna sosednji. Nož ju seka. Ali sta istoležna kota še enaka?
---
Ne. Istoležna kota sta enaka *zato*, ker sta premici vzporedni. Po obratu pravila bi enaka istoležna kota pomenila, da sta žici vzporedni, kar pa nista. Razlika med kotoma pove, za koliko je žica nagnjena.
:::

## Rešeni primeri

### Primer 1 (lažji)

Pico razrežeš z dvema ravnima rezoma, ki se sekata v eni točki. Kot pri konici najmanjšega kosa meri $54^\circ$. Koliko merijo koti pri konicah ostalih treh kosov?

**Podatki:** reza ležita na premicah, ki se sekata; en kot je $\alpha = 54^\circ$

**Iščemo:** velikosti ostalih treh kotov

:::formula
Sovršna kota sta enaka. Sokota imata vsoto $180^\circ$: $\beta = 180^\circ - \alpha$.
:::

**Rešitev:**

1. Sovršni kot kota $\alpha$ je enak: $\gamma = \alpha = 54^\circ$.
2. Sokot kota $\alpha$: $\beta = 180^\circ - 54^\circ = 126^\circ$.
3. Četrti kot je sovršen kotu $\beta$: $\delta = \beta = 126^\circ$.
4. Preizkus: $54^\circ + 126^\circ + 54^\circ + 126^\circ = 360^\circ$, kar je polni kot okoli točke.
5. Odgovor: ostali trije kosi imajo pri konici kote $54^\circ$, $126^\circ$ in $126^\circ$.

### Primer 2 (srednji)

Kot $\alpha$ meri $37^\circ 42'$. Izračunaj kot, ki ga $\alpha$ dopolni do pravega kota (komplementarni kot), in sokot kota $\alpha$.

**Podatki:** $\alpha = 37^\circ 42'$

**Iščemo:** komplementarni kot $\beta$ in sokot $\gamma$ kota $\alpha$

:::formula
$\beta = 90^\circ - \alpha$ in $\gamma = 180^\circ - \alpha$, pri čemer $1^\circ = 60'$.
:::

**Rešitev:**

1. Pravi kot zapišemo v minutah: $90^\circ = 89^\circ 60'$.
2. $\beta = 89^\circ 60' - 37^\circ 42' = 52^\circ 18'$.
3. Iztegnjeni kot: $180^\circ = 179^\circ 60'$.
4. $\gamma = 179^\circ 60' - 37^\circ 42' = 142^\circ 18'$.
5. Preizkus: $37^\circ 42' + 52^\circ 18' = 89^\circ 60' = 90^\circ$ in $37^\circ 42' + 142^\circ 18' = 179^\circ 60' = 180^\circ$.
6. Odgovor: komplementarni kot meri $52^\circ 18'$, sokot pa $142^\circ 18'$.

### Primer 3 (težji, baklava)

Baklavo v pekaču najprej razrežeš z vzporednimi rezi, nato še s poševnim rezom $t$. Dva sosednja vzporedna reza imenujmo $p$ in $q$. Kota $\alpha$ in $\beta$ sta notranja kota na isti strani reza $t$ ($\alpha$ pri $p$, $\beta$ pri $q$). Kot $\alpha$ je za $40^\circ$ večji od kota $\beta$. Izračunaj $\alpha$ in $\beta$ ter kot $\gamma$, ki je izmenični kot kota $\beta$.

**Podatki:** $p \parallel q$, prečnica $t$; $\alpha$ in $\beta$ notranja kota na isti strani prečnice; $\alpha = \beta + 40^\circ$; $\gamma$ je izmenični kot kota $\beta$

**Iščemo:** $\alpha$, $\beta$ in $\gamma$

:::formula
Notranja kota na isti strani prečnice vzporednic: $\alpha + \beta = 180^\circ$. Izmenična kota vzporednic sta enaka.
:::

**Rešitev:**

1. Iz vzporednosti sledi $\alpha + \beta = 180^\circ$. Iz besedila je $\alpha - \beta = 40^\circ$. To je sistem dveh linearnih enačb.
2. Enačbi seštejemo: $2\alpha = 220^\circ$, torej $\alpha = 110^\circ$.
3. $\beta = 180^\circ - 110^\circ = 70^\circ$.
4. Izmenična kota sta enaka, zato je $\gamma = \beta = 70^\circ$.
5. Preizkus: $110^\circ + 70^\circ = 180^\circ$ in $110^\circ - 70^\circ = 40^\circ$. Kot $\gamma$ leži pri $p$ in skupaj z $\alpha$ tvori sokota: $110^\circ + 70^\circ = 180^\circ$.
6. Odgovor: $\alpha = 110^\circ$, $\beta = 70^\circ$ in $\gamma = 70^\circ$. Kosi ob rezu $t$ imajo kota $70^\circ$ in $110^\circ$.

### Primer 4 – zdaj ti

Žice na rešetki pečice so vzporedne. Čeznje poševno položiš nož. Pri prvi žici je en kot med nožem in žico trikrat tolikšen kot njegov sokot. Koliko merita ta dva kota in koliko meri istoležni kot večjega kota pri drugi žici?

**Podatki:** žici $p \parallel q$, nož je prečnica; pri $p$ sta sokota $x$ in $3x$
**Iščemo:** $x$, $3x$ in istoležni kot kota $3x$ pri $q$

:::formula
Sokota: $x + 3x = 180^\circ$. Istoležna kota ob vzporednicah sta enaka.
:::

**Rešitev:**

1. Sokota skupaj merita $180^\circ$, zato velja enačba $x + 3x = 180^\circ$.
2. Člene združimo: $4x = 180^\circ$.
3. Izračunaj $x$ in $3x$ sam, nato poišči še istoležni kot.

:::premisli
Koliko merijo $x$, $3x$ in istoležni kot pri drugi žici?
---
$x = 180^\circ : 4 = 45^\circ$ in $3x = 135^\circ$. Preizkus: $45^\circ + 135^\circ = 180^\circ$. Ker sta žici vzporedni, meri istoležni kot pri drugi žici prav tako $135^\circ$.
:::

## Pogoste napake

- **Zamenjaš komplementarna in suplementarna kota.** Komplementarna imata vsoto $90^\circ$, suplementarna $180^\circ$. Razlog: obe besedi zveneta podobno. Pomagaj si z abecedo: **K** je pred **S**, tako kot $90^\circ$ pred $180^\circ$. Pravilno: najprej preveri, ali iščeš dopolnilo do $90^\circ$ ali do $180^\circ$.
- **Minute obravnavaš kot decimalke.** Če zapišeš $37^\circ 42' = 37{,}42^\circ$, narediš napako, saj ima stopinja $60$ minut. Pravilno: $42' = \dfrac{42}{60}^\circ = 0{,}7^\circ$, torej $37^\circ 42' = 37{,}7^\circ$.
- **Uporabiš lastnosti kotov na prečnici, čeprav premici nista vzporedni.** Razlog: na sliki sta premici videti skoraj vzporedni. Izmenična in istoležna kota sta enaka le pri vzporednicah. Pravilno: najprej preveri, ali je v nalogi podano $p \parallel q$ ali se vzporednost da utemeljiti.
- **Sovršna kota zamenjaš s sokotoma.** Sovršna kota sta enaka, sokota imata vsoto $180^\circ$. Razlog: oboje je kot ob istem presečišču. Pravilno: sovršna ležita nasproti (skupen je le vrh), sokota se dotikata z enim krakom.

## Povzetek

- Skozi dve različni točki gre natanko ena premica; skozi točko zunaj premice gre natanko ena vzporednica.
- Premici v ravnini: sekata se, sta vzporedni ($p \parallel q$) ali sovpadata. Pravokotnost: $p \perp q$.
- Razdalja točke od premice je dolžina pravokotnice. Simetrala daljice je pravokotna na daljico skozi razpolovišče.
- Vrste kotov: ostri $<90^\circ$, pravi $90^\circ$, topi med $90^\circ$ in $180^\circ$, iztegnjeni $180^\circ$, polni $360^\circ$. Veljata $1^\circ = 60'$ in $1' = 60''$.
- Sovršna kota sta enaka. Sokota: $\alpha + \beta = 180^\circ$. Komplementarna kota: $\alpha + \beta = 90^\circ$.
- Pri $p \parallel q$ in prečnici: istoležna in izmenična kota sta enaka, notranja kota na isti strani imata vsoto $180^\circ$.
- Veljajo tudi obrati teh pravil.

## Drugače: Na sliki

Nariši dve vodoravni vzporedni črti, $p$ zgoraj in $q$ spodaj, ter poševno prečnico $t$. Okoli vsakega presečišča oštevilči kote: pri $p$ je kot $1$ nad $p$ desno od $t$, kot $2$ pod $p$ desno, kot $3$ pod $p$ levo, kot $4$ nad $p$ levo. Pri $q$ so v istem vrstnem redu koti $5, 6, 7, 8$. Naj bo kot $1$ enak $65^\circ$:

| Pri $p$ | Pri $q$ | Velikost |
|---|---|---|
| $1$, $3$ | $5$, $7$ | $65^\circ$ |
| $2$, $4$ | $6$, $8$ | $115^\circ$ |

Kota $1$ in $3$ sta sovršna, kota $1$ in $2$ sokota. Kota $1$ in $5$ sta istoležna, kota $3$ in $5$ izmenična. Kota $2$ in $5$ sta notranja na isti strani prečnice: $115^\circ + 65^\circ = 180^\circ$. Če premici ne bi bili vzporedni, bi bila kota $1$ in $5$ različna, zato z merjenjem kotov preveriš vzporednost.

## Drugače: Iz vsakdanjega življenja

Kuhinja je polna kotov:

- **Kuhinjske škarje.** Ko jih odpreš, rezili ležita na dveh sekajočih se premicah. Kot med rezilma je sovršen kotu med ročajema.
- **Ploščice na steni.** Vodoravne fuge so vzporedne med seboj, navpične prav tako. Vodoravna in navpična fuga sta pravokotni.
- **Rešetka v pečici.** Žice so vzporednice. Vsak raven predmet, ki leži poševno čeznje, je prečnica, zato so istoležni koti pri vseh žicah enaki.
- **Kuhinjska ura.** Ob štirih kazalca oklepata $4 \cdot 30^\circ = 120^\circ$ (topi kot), ob treh $90^\circ$ (pravi kot), ob šestih $180^\circ$ (iztegnjeni kot).

## Drugače: Bolj natančno

V geometriji trditve dokazujemo iz že znanih. Za zgled dokažimo, da sta sovršna kota enaka. Naj se premici sekata in naj bodo koti po vrsti $\alpha, \beta, \gamma, \delta$. Ker je $\alpha$ sokot kota $\beta$, je $\alpha + \beta = 180^\circ$. Ker je $\gamma$ sokot kota $\beta$, je $\gamma + \beta = 180^\circ$. Odštejemo: $\alpha = \gamma$. Enakost torej sledi že iz tega, da iztegnjeni kot meri $180^\circ$.

Lastnosti kotov ob prečnici izhajajo iz **aksioma o vzporednici**, ki ga je v nekoliko drugačni obliki zapisal že Evklid. V ravnini, v kateri velja, so istoležni koti ob vzporednicah enaki. Iz tega z uporabo sovršnih kotov izpeljemo izmenične in vsote notranjih kotov.

## Preveri se

? Okoli presečišča dveh premic zapišemo kote po vrsti, v smeri urinega kazalca. Kateri zapis je mogoč?
- $40^\circ$, $140^\circ$, $140^\circ$, $40^\circ$
~ Sosednja kota $140^\circ$ in $140^\circ$ bi bila sokota z vsoto $280^\circ$. Enaka sta sovršna kota, ki ležita nasproti, ne drug ob drugem.
+ $40^\circ$, $140^\circ$, $40^\circ$, $140^\circ$
- $40^\circ$, $50^\circ$, $40^\circ$, $50^\circ$
~ Sokota imata vsoto $180^\circ$, ne $90^\circ$. Tu so zamenjani suplementarni in komplementarni koti.
- $40^\circ$, $140^\circ$, $60^\circ$, $120^\circ$
~ Sosednja kota res merita skupaj $180^\circ$, a nasprotna kota $40^\circ$ in $60^\circ$ bi morala biti enaka, ker sta sovršna.
> Nasprotna (sovršna) kota sta enaka, sosednja (sokota) imata vsoto $180^\circ$: $40^\circ + 140^\circ = 180^\circ$.

? Koliko stopinj je kot $25^\circ 50'$, zaokroženo na desetinko stopinje?
- $25{,}5^\circ$
~ Minute niso decimalke: $50'$ ni $0{,}50^\circ$, ker ima stopinja $60$ minut, ne $100$.
+ $25{,}8^\circ$
- $26^\circ$
~ To je zaokroženo na cele stopinje, ne na desetinke: $\dfrac{50}{60}^\circ \approx 0{,}83^\circ$, zato je $25^\circ 50' \approx 25{,}8^\circ$.
> $50' = \dfrac{50}{60}^\circ \approx 0{,}83^\circ$, torej je $25^\circ 50' \approx 25{,}8^\circ$.

? Zakaj sta sovršna kota vedno enaka?
- Ker sta premici vzporedni.
~ Za sovršna kota vzporednost ni potrebna: nastaneta ob presečišču dveh poljubnih premic. Vzporednost potrebujemo pri kotih ob prečnici.
- Ker sta oba ostra.
~ Sovršna kota sta lahko tudi topa ali prava. Vrsta kota ni razlog za enakost.
+ Ker je vsak od njiju sokot istega kota, zato oba merita $180^\circ$ minus isto število.
> Če je $\alpha + \beta = 180^\circ$ in $\gamma + \beta = 180^\circ$, je $\alpha = 180^\circ - \beta = \gamma$.

? Kot in njegov komplementarni kot se razlikujeta za $20^\circ$. Koliko meri večji od njiju?
- $100^\circ$
~ To bi veljalo za suplementarna kota z vsoto $180^\circ$. Komplementarna kota imata vsoto $90^\circ$.
+ $55^\circ$
- $35^\circ$
~ To je manjši kot. Vprašanje sprašuje po večjem.
- $70^\circ$
~ To je $90^\circ - 20^\circ$: razliko odšteješ od vsote, namesto da bi rešil sistem. Kota $70^\circ$ in $20^\circ$ se razlikujeta za $50^\circ$.
> Velja $x + y = 90^\circ$ in $x - y = 20^\circ$. Seštejemo: $2x = 110^\circ$, $x = 55^\circ$, $y = 35^\circ$.

? Žice na rešetki pečice so vzporedne, ravna paličica jih seka. Pri prvi žici meri en notranji kot $72^\circ$. Koliko meri notranji kot na isti strani paličice pri sosednji žici?
- $72^\circ$
~ Enaka sta istoležna in izmenična kota. Notranja kota na isti strani prečnice sta suplementarna.
+ $108^\circ$
- $18^\circ$
~ To je dopolnilo do $90^\circ$. Notranja kota na isti strani prečnice dopolnjujeta do $180^\circ$.
> Pri vzporednicah imata notranja kota na isti strani prečnice vsoto $180^\circ$: $180^\circ - 72^\circ = 108^\circ$.

:::simboli
\alpha | dani kot | | ° | v Primeru 3 notranji kot pri $p$
\beta | sokot ali komplementarni kot kota $\alpha$ | \beta = 180^\circ - \alpha | ° | komplementarni kot: $\beta = 90^\circ - \alpha$; v Primeru 3 notranji kot pri $q$
\gamma | sovršni kot, sokot ali izmenični kot | | ° | odvisno od primera
x | manjši od dveh sokotov (Primer 4) | | ° |
:::
