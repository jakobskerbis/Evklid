---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Delavka medonosne čebele, ki piči sesalca, navadno umre: želo z zalustmi ostane v koži in se iztrga iz zadka. Večina delavk v panju se nikoli ne razmnoži. Na prvi pogled je to v nasprotju z naravnim izborom, ki naj bi nagrajeval osebke z več potomci. Gen, ki osebek žrtvuje, bi moral izginiti v nekaj generacijah. Pa ne izgine: mravlje, čebele, ose in termiti so med najuspešnejšimi živalmi na Zemlji.

Na kolesarski dirki je podobna slika vsakdanja. Pomočnik vozi v vetru, nosi bidone in čaka kapetana po defektu. Sam skoraj nikoli ne zmaga. Pri športu je razlog jasen: pomočnik dobi plačo in del nagrade. Kaj pa »dobi« sterilna delavka? Odgovor sta dala sorodstvena selekcija in Hamiltonovo pravilo. Z njima razložimo opozorilne klice, pomočnike pri gnezdu in kolonije z eno samo matico.

## Razlaga

**Konkreten primer.** Mlada samica ptice ima pred sezono dve možnosti. Če gnezdi sama, bo kot neizkušena vzgojila v povprečju $1$ mladiča. Če ostane doma in pomaga staršem, ti zaradi njene pomoči vzgojijo $3$ mladiče več. To so njeni polni bratje in sestre.

Kaj se izplača z vidika njenih genov? Lastni mladič nosi polovico njenih genov, torej šteje $1 \cdot 0{,}5 = 0{,}5$ »genske točke«. Polni brat ali sestra ima z njo v povprečju prav tako polovico genov, skupaj $3 \cdot 0{,}5 = 1{,}5$ točke. Pomoč pri gnezdu prinese trikrat več kopij njenih genov v naslednjo generacijo kot samostojno gnezdenje.

:::premisli
Recimo, da je mati to leto dobila novega partnerja, zato so mladiči le polbratje in polsestre pomočnice. Ali se pomoč še vedno izplača?
---
Da. Polsorojenec nosi četrtino njenih genov: $3 \cdot 0{,}25 = 0{,}75$ točke, kar je še vedno več od $0{,}5$ za lastnega mladiča. Prednost se zmanjša, ne izgine.
:::

**Od primera k pojmom.** V primeru smo uporabili tri ideje, ki jih zdaj poimenujemo.

**Altruizem** (v biološkem smislu) je vedenje, pri katerem izvajalec zmanjša svojo neposredno uspešnost (število lastnih potomcev), prejemniku pa jo poveča. Namen ali občutki pri tem niso pomembni, štejejo posledice za razmnoževanje. Hamilton je socialne interakcije razvrstil po učinku na oba udeleženca:

| | prejemnik pridobi | prejemnik izgubi |
|---|---|---|
| **izvajalec pridobi** | sodelovanje (vzajemna korist) | sebičnost |
| **izvajalec izgubi** | altruizem | zloba (spite) |

**Koeficient sorodnosti** $r$ je verjetnost, da ima sorodnik na nekem mestu v genomu isti alel kot jaz, podedovan od skupnega prednika. Pri diploidnih živalih velja: starš in potomec $0{,}5$, polna sorojenca $0{,}5$, polsorojenca $0{,}25$, teta in nečakinja $0{,}25$, bratranca $0{,}125$.

**Sorodstvena selekcija** je izbor genov prek uspeha sorodnikov, ki nosijo kopije istih genov. Osebek genov ne prenaša le z lastnimi potomci (*neposredna uspešnost*), ampak tudi s pomočjo sorodnikom (*posredna uspešnost*). Vsota obeh je **celokupna uspešnost** (*inclusive fitness*).

**Hamiltonovo pravilo.** Gen za altruistično vedenje se v populaciji širi, če velja

$$rB > C.$$

Tu je $C$ število lastnih potomcev, ki jih izvajalec izgubi, $B$ število dodatnih potomcev prejemnika, $r$ pa sorodnost med izvajalcem in prejemnikom. $B$ in $C$ morata biti v isti »valuti« (potomci ali življenja). Znan je Haldanov izrek, da bi dal življenje za dva brata ali osem bratrancev: $2 \cdot 0{,}5 = 1$ in $8 \cdot 0{,}125 = 1$, kar je ravno meja.

Živali ne računajo. Pravilo opisuje, kateri geni se širijo. V praksi osebki sorodnike prepoznajo po posrednih znakih: kdo je odraščal v istem gnezdu, kako diši, kako se oglaša.

**Altruizem med nesorodniki.** Tudi nesorodniki si včasih pomagajo, če se usluga vrne. To je **vzajemni altruizem**: netopirji vampirji delijo kri s sosedom, ki jim je pomagal prejšnjo noč. Deluje le pri osebkih, ki se pogosto srečujejo in si zapomnijo, kdo je goljufal.

**Evsocialnost** je najvišja stopnja socialnosti. Izpolnjeni morajo biti trije pogoji:

1. skupna skrb za zarod,
2. prekrivanje vsaj dveh odraslih generacij v koloniji,
3. delitev razmnoževalnega dela: nekateri osebki se razmnožujejo, drugi so (skoraj) neplodni.

Evsocialni so mnogi kožekrilci (mravlje, nekatere čebele in ose), vsi termiti, goli peskar (*Heterocephalus glaber*) in nekatere vrste kozic.

**Haplodiploidija.** Pri kožekrilcih se samice razvijejo iz oplojenih jajčec (diploidne), samci iz neoplojenih (haploidni). Oče ima en sam niz kromosomov, zato vse hčere od njega dobijo enako polovico genoma. Na očetovi polovici imata sestri zagotovo isti alel, na materini le v polovici primerov. Sestri sta si zato v sorodu z $r = 0{,}75$, s hčerjo pa bi bila delavka le $0{,}5$. Vzgoja sester bi tako prinesla več kopij genov kot vzgoja hčera.

:::premisli
Matica se pari z dvema samcema in vsak oplodi polovico jajčec. Napovej: ali so delavke v povprečju še vedno bolj sorodne sestram kot lastnim hčeram?
---
Ne. Sestri z istim očetom imata $r = 0{,}75$, sestri z različnima očetoma pa le $0{,}25$ (ista mati, različna očeta). Povprečje je $\dfrac{0{,}75 + 0{,}25}{2} = 0{,}5$, enako kot do hčere. Prednost haplodiploidije izgine že pri dveh očetih.
:::

## Rešeni primeri

### Primer 1: karta »Opozorilni klic«

Na vajah igrate namizno igro »Genska liga«. Igralec je veverica, ki opazi kanjo. Karta »Opozorilni klic« mu pove: klic poveča tveganje, da ga ujamejo, kar ga v povprečju stane $0{,}2$ potomca. Polna sestra, ki ji klic reši življenje, ima zato v povprečju $0{,}6$ potomca več. Ali se igranje karte izplača?

**Podatki:** $C = 0{,}2$ potomca, $B = 0{,}6$ potomca, prejemnik je polna sestra
**Iščemo:** ali velja Hamiltonovo pravilo

:::formula
$rB > C$, polni sorojenci: $r = 0{,}5$
:::

**Rešitev:**

1. Sorodnost s polno sestro: $r = 0{,}5$.
2. Posredna korist: $rB = 0{,}5 \cdot 0{,}6 = 0{,}3$.
3. Primerjamo s ceno: $0{,}3 > 0{,}2$. Posredna korist je večja od izgube, zato pravilo velja.
4. Odgovor: karta se izplača, gen za opozorilni klic se v tem primeru širi.

### Primer 2: najmanjša korist

Samica veverice s klicem opozori polsestro. Cena klica je $0{,}3$ potomca. Kolikšna mora biti vsaj korist za polsestro, da se klic izplača?

**Podatki:** $C = 0{,}3$ potomca, prejemnik je polsestra
**Iščemo:** najmanjšo korist $B$

:::formula
$rB > C \;\Rightarrow\; B > \dfrac{C}{r}$
:::

**Rešitev:**

1. Polsestri imata le enega skupnega starša, zato $r = 0{,}25$.
2. Neenačbo delimo z $r$ (pozitivno število, znak ostane): $B > \dfrac{0{,}3}{0{,}25} = 1{,}2$.
3. Preizkus na meji: $0{,}25 \cdot 1{,}2 = 0{,}3$, kar je ravno enako $C$.
4. Odgovor: polsestra mora zaradi klica dobiti več kot $1{,}2$ potomca. Ker je cena le $0{,}3$, mora biti korist več kot štirikrat večja od cene.

### Primer 3: sestre ali hčere pri čebelah

Delavka kožekrilca ima izbiro: lahko vzgoji $4$ sestre (matica se je parila z enim samcem) ali, če bi se razmnoževala sama, $3$ hčere. Kaj ji prinese več kopij genov?

**Podatki:** $4$ sestre, $3$ hčere, haplodiploidija, en oče
**Iščemo:** sorodnost med sestrama in primerjavo »genskih točk«

:::formula
$r_{\text{sestra}} = 0{,}5 \cdot 1 + 0{,}5 \cdot 0{,}5$, točke $= r \cdot \text{število osebkov}$
:::

**Rešitev:**

1. Polovico genoma delavka dobi od očeta. Oče je haploiden, zato ima sestra na tej polovici zagotovo isti alel (verjetnost $1$).
2. Drugo polovico dobi od matice; ta je diploidna, zato je verjetnost istega alela $0{,}5$.
3. $r_{\text{sestra}} = 0{,}5 \cdot 1 + 0{,}5 \cdot 0{,}5 = 0{,}75$.
4. Sestre: $4 \cdot 0{,}75 = 3$ točke. Hčere: $3 \cdot 0{,}5 = 1{,}5$ točke.
5. Odgovor: vzgoja sester prinese dvakrat več kopij genov kot lastne hčere.

### Primer 4: zdaj ti

V resnici kolonija ne vzgaja le sester, ampak tudi brate (samce za parjenje). Delavka lahko vzgoji $4$ sestre in $4$ brate ($r_{\text{brat}} = 0{,}25$) ali pa sama $8$ potomcev ($r = 0{,}5$ za vsakega). Kaj se ji bolj izplača?

**Podatki:** $4$ sestre z $r = 0{,}75$; $4$ bratje z $r = 0{,}25$; $8$ lastnih potomcev z $r = 0{,}5$
**Iščemo:** primerjavo »genskih točk«

:::formula
točke $= \sum r \cdot \text{število osebkov}$
:::

**Rešitev:**

1. Sestre: $4 \cdot 0{,}75 = 3$ točke.
2. Izračunaj še točke bratov, njihovo vsoto in točke lastnih potomcev, nato primerjaj.

:::premisli
Kdo zmaga: sestre in bratje skupaj ali lastni potomci?
---
Bratje: $4 \cdot 0{,}25 = 1$ točka, skupaj $3 + 1 = 4$. Lastni potomci: $8 \cdot 0{,}5 = 4$ točke. Izid je izenačen: pri razmerju spolov $1 : 1$ haplodiploidija sama ne da prednosti.
:::

## Pogoste napake

- **»Za dobro vrste.«** Študent razloži, da se delavke žrtvujejo, ker to koristi vrsti. Toda gen, ki osebek žrtvuje za *katerikoli* osebek vrste, bi izpodrinili sebični aleli. Altruizem se širi zato, ker pomoč dobijo nosilci istih alelov, torej sorodniki. Pomembna je sorodnost $r$, ne pripadnost vrsti.
- **$r$ kot delež skupnih genov.** »Človek in šimpanz imata skupnih $98\,\%$ genov, torej $r = 0{,}98$.« Ne: $r$ meri verjetnost istega alela *zaradi skupnega nedavnega prednika*, nad povprečjem populacije. Za brata je $0{,}5$, ne $0{,}999$.
- **Primerjava $B$ s $C$ brez $r$.** »Korist $3$ je večja od cene $1$, zato se vedno izplača.« Pri bratrancu je $rB = 0{,}125 \cdot 3$, kar je manj od $1$. Korist moraš vedno pomnožiti s sorodnostjo.
- **»Haplodiploidija razloži evsocialnost.«** Termiti in goli peskarji so diploidni in evsocialni, mnogo haplodiploidnih os pa ni. Poleg tega so bratje delavki sorodni le z $0{,}25$, matice pa se pogosto parijo z več samci. Danes imata večjo težo izvorna monogamija matic in ekološki pogoji (dragoceno gnezdo, ki ga je vredno braniti).
- **»Žival oceni sorodnost in se odloči.«** Hamiltonovo pravilo opisuje izbor genov čez generacije, ne zavestnega računa. Mehanizmi so preprosti: domačnost, vonj, skupno gnezdo.

## Povzetek

- Biološki altruizem: izvajalec izgubi lastne potomce, prejemnik pridobi.
- Koeficient sorodnosti $r$: verjetnost istega alela zaradi skupnega prednika (sorojenca $0{,}5$, polsorojenca $0{,}25$, bratranca $0{,}125$).
- Sorodstvena selekcija: geni se širijo tudi prek sorodnikov; celokupna uspešnost = neposredna + posredna.
- Hamiltonovo pravilo: altruizem se širi, če $rB > C$.
- Vzajemni altruizem pomaga razložiti pomoč med nesorodniki, ki se ponovno srečujejo.
- Evsocialnost: skupna skrb za zarod, prekrivanje generacij, delitev razmnoževanja. Pri kožekrilcih sestre $r = 0{,}75$ (haplodiploidija), a to ni edina razlaga.

## Drugače: Z analogijo

Kolesarska ekipa na veliki dirki je kot družina pri gnezdu. Kapetan je »razmnoževalec«: le on lahko osvoji skupno zmago. Pomočniki so »delavke«: vozijo v vetru, da kapetan prihrani moči.

- **Cena $C$:** pomočnik izgubi lastne možnosti za etapno zmago.
- **Korist $B$:** kapetan ima več možnosti za končno zmago.
- **Sorodnost $r$:** delež skupne nagrade, ki pripade pomočniku. Pri ekipi je to pogodba, pri živalih skupni aleli.

Pomočnik bo garal, če je njegov delež pri kapetanovi zmagi večji od tega, kar bi dobil sam. Natanko to pove $rB > C$.

Kje analogija odpove: kolesar se zavestno odloča in naslednje leto lahko postane kapetan. Delavka mravlje je pogosto trajno neplodna, njeno vedenje pa je izbor genov, ne pogodba.

## Drugače: Bolj natančno

**Računanje $r$ po rodovniku.** Za vsako pot med osebkoma prek skupnega prednika preštej korake $L$ (od enega osebka do prednika in naprej do drugega). Pri diploidnih organizmih brez parjenja v sorodstvu velja

$$r = \sum_{\text{poti}} \left(\tfrac{1}{2}\right)^{L}.$$

Polna sorojenca imata dve poti (prek matere in prek očeta) dolžine $2$: $r = 2 \cdot \tfrac{1}{4} = 0{,}5$. Bratranca imata dve poti dolžine $4$: $r = 2 \cdot \tfrac{1}{16} = 0{,}125$.

**Asimetrija pri haplodiploidiji.** Mati je sinu sorodna z $0{,}5$, sin materi pa z $1$, ker ima samo njene gene. Delavka je sestri sorodna z $0{,}75$, bratu z $0{,}25$.

**Več očetov.** Če se matica pari s $k$ samci, ki enako prispevajo, je povprečna sorodnost med delavkami

$$\bar r = 0{,}25 + \frac{0{,}5}{k}.$$

Pri $k = 1$ je $0{,}75$, pri $k = 2$ je $0{,}5$, pri $k = 10$ le $0{,}3$. Pri medonosni čebeli je matica parjena s številnimi troti, pa je kolonija vseeno evsocialna. Evsocialnost se je razvila pri prednikih z monogamnimi maticami; poznejše večkratno parjenje je že obstoječo kolonijo le ohranilo.

**Razmerje spolov.** Ker delavke sestre »cenijo« trikrat bolj kot brate ($0{,}75 : 0{,}25$), bi z vidika delavk optimalna naložba v spola znašala $3 : 1$ v korist samic, z vidika matice pa $1 : 1$. Trivers in Hare sta pri mravljah res našla naložbe, ki se približajo razmerju $3 : 1$. To je eden močnejših dokazov, da sorodnost oblikuje vedenje delavk.

**Hamiltonovo pravilo v valuti genov.** Izvajalec izgubi $C$ lastnih potomcev, ki nosijo po $0{,}5$ njegovih genov. Prejemnik dobi $B$ potomcev, ki so izvajalcu sorodni z $0{,}5\,r$. Pogoj $0{,}5\,rB > 0{,}5\,C$ je enakovreden $rB > C$.

## Preveri se

? Pri golih peskarjih se v koloniji razmnožuje ena sama samica, več generacij skupaj skrbi za mladiče, večina osebkov pa se nikoli ne razmnoži. Kateri pojem opisuje tako organizacijo?
- vzajemni altruizem
~ Vzajemni altruizem je izmenjava uslug med (pogosto nesorodnimi) osebki, ne zgradba kolonije s kastami.
- sorodstvena selekcija
~ Sorodstvena selekcija je mehanizem, ki lahko razloži nastanek kolonije, ne ime za samo organizacijo.
+ evsocialnost
- haplodiploidija
~ Haplodiploidija je način določanja spola pri kožekrilcih. Goli peskarji so diploidni.
> Izpolnjeni so vsi trije pogoji evsocialnosti: skupna skrb za zarod, prekrivanje generacij in delitev razmnoževalnega dela.

? Razvrsti sorodnike diploidne živali po koeficientu sorodnosti od največjega do najmanjšega.
+ polna sestra > polsestra = nečakinja > bratranec
- polna sestra = polsestra > nečakinja > bratranec
~ Polsestra ima le enega skupnega starša, zato je njena sorodnost pol manjša: $0{,}25$, ne $0{,}5$.
- bratranec > nečakinja > polsestra > polna sestra
~ Vrstni red je obrnjen. Bolj oddaljen sorodnik ima manjši $r$, saj se z vsakim korakom verjetnost razpolovi.
- polna sestra > nečakinja > polsestra > bratranec
~ Nečakinja in polsestra sta enako sorodni: obe imata $r = 0{,}25$.
> Vrednosti: polna sestra $0{,}5$, polsestra $0{,}25$, nečakinja $0{,}25$, bratranec $0{,}125$.

? Kaj se zgodi s prednostjo, ki jo haplodiploidija daje vzgoji sester, če se matica pari z več samci?
- Ostane enaka, ker so vse delavke hčere iste matice.
~ Sorodnost prek matice res ostane, a sestre z drugim očetom so ji sorodne le z $0{,}25$.
+ Zmanjša se; že pri dveh enako uspešnih očetih je povprečna sorodnost med sestrami $0{,}5$, enako kot do hčere.
- Poveča se, ker je v koloniji večja genska pestrost.
~ Genska pestrost lahko koloniji koristi (npr. pri odpornosti), a povprečna sorodnost med delavkami pade, ne zraste.
> Povprečje je $0{,}25 + \dfrac{0{,}5}{k}$; pri $k = 2$ je $0{,}5$. Prednost sester pred hčerami izgine.

? Samica s klicem opozori polsestro. Klic jo stane $1$ potomca, polsestri prinese $3$ potomce več. Ali Hamiltonovo pravilo napove, da se tak klic širi?
- Da, ker je korist $3$ večja od cene $1$.
~ Korist je treba pomnožiti s sorodnostjo. Primerjava $B > C$ velja le za $r = 1$.
+ Ne, ker je $rB = 0{,}75$ manj od $C = 1$.
- Da, ker je $rB = 1{,}5$ večje od $C = 1$.
~ Tako dobiš z $r = 0{,}5$, kar velja za polno sestro. Polsestra ima $r = 0{,}25$.
> $rB = 0{,}25 \cdot 3 = 0{,}75 < 1$. Za polno sestro bi se klic izplačal, za polsestro ne.

? Pomoč bratrancu stane izvajalca $0{,}5$ potomca. Kolikšno korist $B$ mora bratranec vsaj dobiti, da se pomoč izplača?
- več kot $0{,}0625$
~ Tako dobiš, če pomnožiš $C \cdot r$. Iz $rB > C$ sledi deljenje: $B > \dfrac{C}{r}$.
- več kot $1$
~ To bi veljalo za polnega sorojenca ($r = 0{,}5$), ne za bratranca.
+ več kot $4$
> $B > \dfrac{C}{r} = \dfrac{0{,}5}{0{,}125} = 4$ potomci.

:::simboli
r | koeficient sorodnosti | r = \sum_{\text{poti}} \left(\tfrac{1}{2}\right)^{L} | – | od 0 do 1
B | korist: dodatni potomci prejemnika | | – | v isti »valuti« kot C
C | cena: izgubljeni lastni potomci izvajalca | | – | v isti »valuti« kot B
L | število korakov poti prek skupnega prednika | | – | štejemo za vsako pot posebej
k | število samcev, s katerimi se matica pari | | – | samci enako prispevajo
\bar{r} | povprečna sorodnost med delavkami | \bar{r} = 0{,}25 + \frac{0{,}5}{k} | – | pri k = 1 je 0,75
r_{\text{sestra}} | sorodnost med sestrama pri haplodiploidiji | r_{\text{sestra}} = 0{,}5 \cdot 1 + 0{,}5 \cdot 0{,}5 | – | 0,75
:::
