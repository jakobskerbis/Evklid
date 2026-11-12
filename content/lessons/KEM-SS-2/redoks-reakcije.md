---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Konec 18. stoletja je francoski kemik Antoine Lavoisier pokazal, da pri gorenju snov veže kisik iz zraka. Z meritvami toplote, ki jo oddajajo živali, je prišel še dlje: tudi **dihanje** je počasno gorenje. Hrana se v telesu »zažge« s kisikom, le brez plamena. Takrat je beseda **oksidacija** pomenila prav to: vezavo kisika.

Pozneje so kemiki opazili reakcije, ki se obnašajo enako, kisika pa v njih ni. Železo v telesu prehaja med $\mathrm{Fe^{2+}}$ in $\mathrm{Fe^{3+}}$. Vitamin C odstrani jod iz rjave jodove tinkture, ki jo poznaš iz prve pomoči. Skupno vsem tem reakcijam so našli šele, ko so spoznali elektron: **ena snov elektrone odda, druga jih sprejme**.

Danes v farmacevtskem laboratoriju tako preverjajo, ali tableta proti slabokrvnosti res vsebuje toliko železa, kot piše na škatlici. Za račun potrebujejo pravilno urejeno enačbo. Ureditev take enačbe po korakih je cilj te lekcije.

## Razlaga

**Premica oksidacijskih števil.** Oksidacijska števila že znaš določiti. Postavi jih na številsko premico. Ko atom elektron odda, se njegovo število pomakne za $1$ v desno. Ko elektron sprejme, se pomakne za $1$ v levo.

Vzemimo reakcijo, s katero v laboratoriju merijo železo v tableti: ion $\mathrm{Fe^{2+}}$ zmešamo z vijoličnim permanganatnim ionom $\mathrm{MnO_4^-}$. V njem ima mangan število $+7$ (iz $x + 4 \cdot (-2) = -1$). Po reakciji imamo $\mathrm{Fe^{3+}}$ in $\mathrm{Mn^{2+}}$.

:::risba premica
opis: Številska premica oksidacijskih števil od 0 do 7. Kratek lok gre od 2 do 3: železo odda en elektron. Dolg lok gre od 7 do 2: mangan sprejme pet elektronov.
od: 0
do: 7
skok: 2 -> 3 | Fe odda 1 e⁻
skok: 7 -> 2 | Mn sprejme 5 e⁻
podnapis: Dolžina skoka je število prenesenih elektronov.
:::

Na sliki je vse, kar potrebujemo. Železo se premakne za en korak v desno, mangan za pet korakov v levo. Mangan torej potrebuje pet elektronov, vsak ion železa pa da le enega. Zato mora na vsak $\mathrm{MnO_4^-}$ reagirati pet ionov $\mathrm{Fe^{2+}}$.

**Imena.** Premik v desno (oddajanje elektronov, oksidacijsko število naraste) je **oksidacija**. Premik v levo (sprejemanje elektronov, število pade) je **redukcija**. Reakciji, v kateri se elektroni prenesejo z ene snovi na drugo, rečemo **redoks reakcija**.

Snov, ki drugi vzame elektrone, je **oksidant**; sama se pri tem reducira. Snov, ki elektrone da, je **reducent**; sama se oksidira. Permanganat je oksidant, $\mathrm{Fe^{2+}}$ je reducent.

:::premisli
Ali bi lahko v raztopini potekala sama oksidacija $\mathrm{Fe^{2+}}$ brez redukcije česa drugega? Zakaj?
---
Ne. Elektroni ne morejo ostati prosti v raztopini. Vsak elektron, ki ga železo odda, mora nekdo sprejeti, zato oksidacijo vedno spremlja redukcija.
:::

**Polreakcije.** Oba premika zapišemo vsakega posebej, z elektroni $\mathrm{e^-}$ kot delci. Taki enačbi rečemo **polreakcija**. Pri preprosti reakciji cinka z bakrovimi ioni sta to:

| polreakcija | enačba | elektroni |
|---|---|---|
| oksidacija | $\mathrm{Zn \rightarrow Zn^{2+} + 2\,e^-}$ | desno |
| redukcija | $\mathrm{Cu^{2+} + 2\,e^- \rightarrow Cu}$ | levo |

V simulaciji spodaj »Redoks: kovina v raztopini soli« postavi cink v raztopino bakrove soli, nato še baker v raztopino cinkove soli. Opazi, da se baker izloča le v prvem primeru: cink elektrone odda rad, baker pa ne.

**Postopek urejanja v kisli raztopini.** Permanganat ima kisik, ki se v produktih pojavi v vodi. Zato potrebujemo nekaj več korakov. Ion $\mathrm{H_3O^+}$ zaradi preglednosti pišemo kar kot $\mathrm{H^+}$.

1. Določi oksidacijska števila in poišči, kaj se oksidira in kaj reducira.
2. Zapiši obe polreakciji in uredi vse atome razen O in H.
3. Kisik uredi z dodajanjem $\mathrm{H_2O}$.
4. Vodik uredi z dodajanjem $\mathrm{H^+}$.
5. Naboj uredi z dodajanjem $\mathrm{e^-}$.
6. Polreakciji pomnoži, da je oddanih elektronov toliko kot sprejetih.
7. Seštej, krajšaj enake delce na obeh straneh in preveri atome ter naboj.

Za permanganat začnemo z zapisom $\mathrm{MnO_4^- \rightarrow Mn^{2+}}$; mangan je že urejen. Na levi so štirje atomi O, zato desno dodamo $4\,\mathrm{H_2O}$. Ti prinesejo osem atomov H, zato levo dodamo $8\,\mathrm{H^+}$. Naboj levo je $-1 + 8 = 7$, desno $2$.

:::premisli
Koliko elektronov moraš dodati na levo stran, da bo naboj enak? Se število ujema s sliko na premici?
---
Pet: $-1 + 8 - 5 = 2$. Polreakcija je $\mathrm{MnO_4^- + 8\,H^+ + 5\,e^- \rightarrow Mn^{2+} + 4\,H_2O}$. Enako pove dolgi lok na premici od $+7$ do $+2$.
:::

Polreakcija železa je $\mathrm{Fe^{2+} \rightarrow Fe^{3+} + e^-}$. Pomnožimo jo s $5$, da odda pet elektronov. Seštevek:

$$\mathrm{MnO_4^- + 5\,Fe^{2+} + 8\,H^+ \rightarrow Mn^{2+} + 5\,Fe^{3+} + 4\,H_2O}$$

Preverimo naboj: levo $-1 + 10 + 8 = 17$, desno $2 + 15 = 17$.

## Rešeni primeri

### Primer 1: bakrena žica v raztopini srebrovih ionov

Raztopina srebrovega nitrata se v medicini uporablja za jedkanje bradavic. Bakreno žico potopimo v to raztopino. Na žici se izloča srebro, raztopina pomodri zaradi ionov $\mathrm{Cu^{2+}}$. Uredi enačbo.

**Podatki:** reaktanta $\mathrm{Cu}$ in $\mathrm{Ag^+}$, produkta $\mathrm{Cu^{2+}}$ in $\mathrm{Ag}$
**Iščemo:** urejeno enačbo redoks reakcije

:::formula
Oddani elektroni = sprejeti elektroni
:::

**Rešitev:**

1. Oksidacija (baker iz $0$ v $+2$): $\mathrm{Cu \rightarrow Cu^{2+} + 2\,e^-}$.
2. Redukcija (srebro iz $+1$ v $0$): $\mathrm{Ag^+ + e^- \rightarrow Ag}$.
3. Baker odda dva elektrona, srebrov ion sprejme enega, zato redukcijo pomnožimo z $2$: $\mathrm{2\,Ag^+ + 2\,e^- \rightarrow 2\,Ag}$.
4. Seštejemo, elektroni se pokrajšajo: $\mathrm{Cu + 2\,Ag^+ \rightarrow Cu^{2+} + 2\,Ag}$.
5. Preverimo naboj: levo $2 \cdot 1 = 2$, desno tudi $2$.
6. Odgovor: $\mathrm{Cu + 2\,Ag^+ \rightarrow Cu^{2+} + 2\,Ag}$; baker je reducent, srebrov ion oksidant.

### Primer 2: vitamin C in jod

Vitamin C (askorbinska kislina, $\mathrm{C_6H_8O_6}$) razbarva raztopino joda. Nastanejo dehidroaskorbinska kislina $\mathrm{C_6H_6O_6}$, jodidni ioni in $\mathrm{H^+}$. Uredi enačbo s polreakcijami.

**Podatki:** $\mathrm{C_6H_8O_6}$ in $\mathrm{I_2}$ reagirata v $\mathrm{C_6H_6O_6}$, $\mathrm{I^-}$ in $\mathrm{H^+}$
**Iščemo:** urejeno enačbo

:::formula
Koraki: atomi razen O in H → $\mathrm{H_2O}$ → $\mathrm{H^+}$ → $\mathrm{e^-}$ → enako število elektronov → seštevek
:::

**Rešitev:**

1. Jod gre iz $0$ v $-1$, torej se reducira: $\mathrm{I_2 + 2\,e^- \rightarrow 2\,I^-}$.
2. Pri vitaminu C sta ogljik in kisik že urejena (po šest atomov na vsaki strani). Desno manjkata dva atoma H, dodamo $\mathrm{2\,H^+}$: $\mathrm{C_6H_8O_6 \rightarrow C_6H_6O_6 + 2\,H^+}$.
3. Naboj levo $0$, desno $2$; desno dodamo dva elektrona: $\mathrm{C_6H_8O_6 \rightarrow C_6H_6O_6 + 2\,H^+ + 2\,e^-}$. Elektroni so desno, torej je to oksidacija.
4. Obe polreakciji imata po dva elektrona, množiti ni treba. Seštejemo: $\mathrm{C_6H_8O_6 + I_2 \rightarrow C_6H_6O_6 + 2\,I^- + 2\,H^+}$.
5. Odgovor: zgornja enačba; vitamin C je reducent. Oksidacijskih števil ogljika nam sploh ni bilo treba računati, naboj je povedal vse.

### Primer 3: koliko železa je v tableti

Tableto proti slabokrvnosti raztopimo v razredčeni žveplovi kislini in titriramo z raztopino $\mathrm{KMnO_4}$ s koncentracijo $0{,}0200\,\mathrm{mol/L}$. Do točke ekvivalence (prva obstojna rožnata barva) porabimo $11{,}6\,\mathrm{mL}$. Koliko miligramov železa je v tableti?

**Podatki:** $c = 0{,}0200\,\mathrm{mol/L}$, $V = 11{,}6\,\mathrm{mL} = 0{,}0116\,\mathrm{L}$, $M(\mathrm{Fe}) = 55{,}85\,\mathrm{g/mol}$
**Iščemo:** maso železa $m(\mathrm{Fe})$

:::formula
$n(\mathrm{MnO_4^-}) = c \cdot V$; iz urejene enačbe $n(\mathrm{Fe^{2+}}) = 5 \cdot n(\mathrm{MnO_4^-})$; $m = n \cdot M$
:::

**Rešitev:**

1. Najprej enačba. Iz razlage: $\mathrm{MnO_4^- + 5\,Fe^{2+} + 8\,H^+ \rightarrow Mn^{2+} + 5\,Fe^{3+} + 4\,H_2O}$. Razmerje je $1 : 5$.
2. Množina permanganata: $0{,}0200 \cdot 0{,}0116 = 0{,}000232$, torej $n(\mathrm{MnO_4^-}) = 2{,}32 \cdot 10^{-4}\,\mathrm{mol}$.
3. Vsak permanganat sprejme pet elektronov, vsak železov ion odda enega: $5 \cdot 0{,}000232 = 0{,}00116$, torej $n(\mathrm{Fe^{2+}}) = 1{,}16 \cdot 10^{-3}\,\mathrm{mol}$.
4. Masa: $0{,}00116 \cdot 55{,}85 = 0{,}064786$, torej $m(\mathrm{Fe}) \approx 0{,}0648\,\mathrm{g}$.
5. Odgovor: tableta vsebuje okoli $64{,}8\,\mathrm{mg}$ železa. Brez urejene enačbe bi lahko vzeli razmerje $1 : 1$ in dobili petkrat premalo.

### Primer 4: zdaj ti

Vodikov peroksid $\mathrm{H_2O_2}$ (razkužilo za rane) v kisli raztopini oksidira jodidne ione $\mathrm{I^-}$ v jod $\mathrm{I_2}$. Pri tem nastane voda. Uredi enačbo.

**Podatki:** $\mathrm{H_2O_2}$, $\mathrm{I^-}$ in $\mathrm{H^+}$ reagirajo v $\mathrm{I_2}$ in $\mathrm{H_2O}$
**Iščemo:** urejeno enačbo

:::formula
Oddani elektroni = sprejeti elektroni; na koncu preveri atome in naboj
:::

**Rešitev:**

1. Oksidacija: $\mathrm{2\,I^- \rightarrow I_2 + 2\,e^-}$.
2. Redukcija: kisik gre iz $-1$ v $-2$. Dva atoma O dasta desno dve vodi. Te imata štiri atome H, $\mathrm{H_2O_2}$ le dva, zato levo dodamo $\mathrm{2\,H^+}$. Naboj levo je potem $2$, desno $0$, zato levo dodamo še dva elektrona: $\mathrm{H_2O_2 + 2\,H^+ + 2\,e^- \rightarrow 2\,H_2O}$.
3. Primerjaj število elektronov, seštej in preveri sam.

:::premisli
Kakšna je urejena enačba?
---
Elektronov je na obeh straneh po dva, zato le seštejemo: $\mathrm{H_2O_2 + 2\,I^- + 2\,H^+ \rightarrow I_2 + 2\,H_2O}$. Naboj: levo $-2 + 2 = 0$, desno $0$.
:::

## Pogoste napake

- **»Oksidant se oksidira.«** Ime zavaja. Oksidant *povzroči* oksidacijo druge snovi, ker ji vzame elektrone; sam jih sprejme in se reducira. Pomagaj si s stavkom: oksidant je kot tat elektronov, okraden je reducent.
- **Urejeni so atomi, naboj pa ne.** Zapis $\mathrm{Cu + Ag^+ \rightarrow Cu^{2+} + Ag}$ ima na obeh straneh enake atome, a naboj levo je $1$, desno $2$. Elektroni ne izginejo, zato mora biti naboj na obeh straneh enak.
- **Kisik dodan kot $\mathrm{O_2}$ ali $\mathrm{O^{2-}}$.** V vodni raztopini kisik uredimo z vodo, vodik pa z $\mathrm{H^+}$. Ionov $\mathrm{O^{2-}}$ v vodi ni.
- **Elektroni na napačni strani.** Pri oksidaciji so elektroni produkt (desno), pri redukciji reaktant (levo). Preveri: na strani z več pozitivnega naboja dodaš elektrone.
- **Pozabljeno množenje.** Če polreakciji samo sešteješ, ostanejo v enačbi elektroni. V končni enačbi elektronov ni.

## Povzetek

- Oksidacija: oddajanje elektronov, oksidacijsko število naraste. Redukcija: sprejemanje elektronov, število pade. Vedno potekata skupaj.
- Oksidant sprejme elektrone in se reducira; reducent odda elektrone in se oksidira.
- Polreakcija zapiše en del z elektroni: $\mathrm{Fe^{2+} \rightarrow Fe^{3+} + e^-}$.
- Urejanje v kisli raztopini: atomi razen O in H, nato O z $\mathrm{H_2O}$, H z $\mathrm{H^+}$, naboj z $\mathrm{e^-}$; polreakciji pomnoži do enakega števila elektronov in seštej.
- Permanganat in železo: $\mathrm{MnO_4^- + 5\,Fe^{2+} + 8\,H^+ \rightarrow Mn^{2+} + 5\,Fe^{3+} + 4\,H_2O}$, razmerje $1 : 5$ za titracijo.
- Končna enačba ima urejene atome in naboj ter nima elektronov.

## Drugače: Z analogijo

Redoks reakcija je kot nakazilo denarja. Elektroni so evri, ki gredo z enega računa na drugega.

- Reducent je plačnik: denar mu odteče (oksidacija).
- Oksidant je prejemnik: denar mu priteče (redukcija).
- Polreakciji sta izpiska obeh računov. Na enem piše »odšlo $5$ €«, na drugem »prišlo $5$ €«.

Banka ne dovoli, da bi denar izginil ali nastal iz nič. Zato morata biti izpiska usklajena. Če en ion $\mathrm{MnO_4^-}$ »zaračuna« pet elektronov, ion $\mathrm{Fe^{2+}}$ pa plača le enega, mora plačati pet ionov železa. Množenje polreakcij je natanko to usklajevanje izpiskov.

## Drugače: Iz vsakdanjega življenja

Redoks reakcije te obdajajo:

- **Rana in peroksid.** Ko vodikov peroksid zapeni na rani, se razkraja v vodo in kisik. Isti element, kisik, se pri tem hkrati reducira (v vodo) in oksidira (v $\mathrm{O_2}$).
- **Porjavelo jabolko.** Snovi v razrezanem jabolku se oksidirajo s kisikom. Če ga pokapljaš z limoninim sokom, vitamin C odda elektrone prej in jabolko ostane svetlejše.
- **Alkotest.** Starejši alkotesti so imeli oranžne kristale, ki ob alkoholu v izdihanem zraku pozelenijo. Alkohol se oksidira, krom se reducira.
- **Dihanje.** Glukoza se v celicah po korakih oksidira do $\mathrm{CO_2}$, kisik se reducira do vode. Lavoisier je imel prav: dihanje je počasno gorenje.

## Preveri se

? Vitamin C kot antioksidant v telesu odda elektrone škodljivim delcem. Kaj velja zanj?
- Vitamin C je oksidant, ker se oksidira.
~ Oksidant elektrone sprejme in se reducira. Kdor elektrone odda, je reducent.
+ Vitamin C se oksidira, zato je reducent.
- Vitamin C se reducira, saj preprečuje oksidacijo.
~ Oksidacijo drugih snovi prepreči tako, da se oksidira sam: elektrone odda, ne sprejme.
> Kdor elektrone odda, se oksidira in je reducent. Vitamin C »žrtvuje« svoje elektrone, da jih ne izgubijo druge molekule.

? Katera reakcija **ni** redoks reakcija?
- $\mathrm{2\,Mg + O_2 \rightarrow 2\,MgO}$
~ Magnezij gre iz $0$ v $+2$, kisik iz $0$ v $-2$. To je klasična redoks reakcija.
- $\mathrm{Zn + 2\,H^+ \rightarrow Zn^{2+} + H_2}$
~ Kislina tu ne oddaja protona bazi: cink odda elektrone, vodik jih sprejme ($+1$ v $0$).
+ $\mathrm{H^+ + OH^- \rightarrow H_2O}$
- $\mathrm{2\,H_2O_2 \rightarrow 2\,H_2O + O_2}$
~ Snov je ena, a kisik v njej gre iz $-1$ hkrati v $-2$ in v $0$. Oksidacijska števila se spremenijo.
> Pri nevtralizaciji ostanejo vsa oksidacijska števila enaka (H $+1$, O $-2$), prenese se proton, ne elektron.

? Zakaj polreakciji pred seštevanjem pomnožimo tako, da imata enako število elektronov?
- Da bo na obeh straneh enako število atomov kisika.
~ Kisik uredimo že prej, z vodo. Množenje uskladi elektrone, ne kisika.
+ Ker elektroni ne ostanejo prosti: kolikor jih reducent odda, toliko jih mora oksidant sprejeti.
- Ker morata oksidant in reducent vedno reagirati v razmerju $1 : 1$.
~ Prav zaradi različnega števila elektronov razmerje pogosto ni $1 : 1$, npr. permanganat in železo $1 : 5$.
> Prenos elektronov je kot nakazilo: oddano mora biti enako sprejetemu. Zato elektroni v končni enačbi izginejo.

? Koliko elektronov sprejme en ion $\mathrm{MnO_4^-}$, ko v kisli raztopini nastane $\mathrm{Mn^{2+}}$?
- $7$
~ $+7$ je oksidacijsko število mangana na začetku, ne sprememba. Šteje premik od $+7$ do $+2$.
+ $5$
- $2$
~ $2+$ je naboj produkta. Šteti moraš, za koliko se oksidacijsko število zmanjša.
- $8$
~ $8$ je število ionov $\mathrm{H^+}$ v polreakciji, ne elektronov.
> Mangan gre iz $+7$ v $+2$, kar je pet korakov: $\mathrm{MnO_4^- + 8\,H^+ + 5\,e^- \rightarrow Mn^{2+} + 4\,H_2O}$.

? Dijak ureja reakcijo aluminija z bakrovimi ioni. (1) $\mathrm{Al \rightarrow Al^{3+} + 3\,e^-}$ (2) $\mathrm{Cu^{2+} + 2\,e^- \rightarrow Cu}$ (3) Seštevek: $\mathrm{Al + Cu^{2+} \rightarrow Al^{3+} + Cu}$. Kateri korak je napačen?
- korak (1)
~ Aluminij gre iz $0$ v $+3$ in odda tri elektrone; ti so pravilno desno.
- korak (2)
~ Bakrov ion sprejme dva elektrona; ti so pravilno levo.
+ korak (3)
- noben, enačba je pravilna
~ Atomi se res ujemajo, naboj pa ne: levo $2$, desno $3$.
> Oddanih elektronov je $3$, sprejetih $2$. Prvo polreakcijo pomnožimo z $2$, drugo s $3$: $\mathrm{2\,Al + 3\,Cu^{2+} \rightarrow 2\,Al^{3+} + 3\,Cu}$.

:::simboli
n | množina snovi (permanganata ali železovih ionov) | n = c \cdot V | mol | $n(\mathrm{Fe^{2+}}) = 5 \cdot n(\mathrm{MnO_4^-})$
c | množinska koncentracija raztopine KMnO₄ | | mol/L
V | porabljena prostornina raztopine KMnO₄ | | L
m | masa železa | m = n \cdot M | g
M | molska masa železa | | g/mol
\mathrm{e^-} | elektron | | – | v končni enačbi ga ni
:::
