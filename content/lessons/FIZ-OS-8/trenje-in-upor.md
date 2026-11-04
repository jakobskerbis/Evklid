---
stanje: osnutek
demo: klada
avtor: AI
---

## Zakaj se tega učimo

Dve sceni iz enega sobotnega nakupa.

V trgovini potiskaš po tleh zaboj s šestimi plastenkami vode. Prazen zaboj zdrsne že ob rahlem sunku. Poln se upira, potiskati moraš precej močneje.

Nato pelješ domov s kolesom novo kartonsko škatlo, privezano pokonci na prtljažnik. Ko pospešiš po klancu navzdol, čutiš, kako te zrak vleče nazaj. Brez škatle je ta vlek precej šibkejši.

Prizora sta videti čisto različna: enkrat tla, drugič zrak. Skupno jima je nekaj, kar te vsak dan stane moči, včasih pa tudi denarja: snov, ki se je telo dotika, **nasprotuje gibanju**. Ob tleh tej sili rečemo **trenje**, v zraku ali vodi **upor**. Ugotovili bomo, od česa je odvisna ena in od česa druga.

## Razlaga

**Puščice na zaboju.** Nariši zaboj na tleh. Desno od njega puščica tvoje sile, s katero vlečeš. Ob spodnjem robu, kjer se zaboj dotika tal, puščica v nasprotno smer: to je **sila trenja**. Vedno leži ob stični ploskvi in kaže nasproti drsenju (ali nasproti smeri, v katero bi telo zdrsnilo).

Ploskvi nista nikoli povsem gladki. Pod povečevalnim steklom ima vsaka drobne grbinice, ki se zatikajo med grbinice druge ploskve. Bolj ko telo pritiska na podlago, globlje se grbinice zataknejo.

**Meritev s silomerom.** Na zaboj pripnemo silomer in ga vlečemo po tleh trgovine tako, da drsi enakomerno, brez sunkov. Takrat sta vlečna sila in sila trenja v ravnovesju, zato silomer kaže ravno silo trenja. Nato v zaboj dodajamo plastenke:

| teža zaboja $F_g$ [N] | sila trenja $F_{tr}$ [N] | $F_{tr} : F_g$ |
|---|---|---|
| 20 | 8 | 0,4 |
| 40 | 16 | 0,4 |
| 60 | 24 | 0,4 |

Dvakrat težji zaboj, dvakrat večje trenje. Trikrat težji, trikrat večje. Razmerje v zadnjem stolpcu je ves čas enako.

:::premisli
Prazen zaboj (prva vrstica tabele: teža $20\,\mathrm{N}$, trenje $8\,\mathrm{N}$) obrnemo na ozko stranico, tako da se tal dotika le pol toliko ploskve kot prej. Kaj bo pokazal silomer? Napovej, preden pogledaš.
---
Spet približno $8\,\mathrm{N}$. Na manjšo ploskev zaboj pritiska z enako silo kot prej na večjo, saj se teža ni spremenila. Na vsak kvadratni centimeter pritiska močneje, a takih centimetrov je manj; učinka se izravnata. Trenje je od ploščine stika skoraj neodvisno.
:::

**Kaj še vpliva.** Isti zaboj potegnemo po treh podlagah. Po gladkih ploščicah je trenje manjše kot po gumijasti preprogi pri vhodu, po zaledenelem parkirišču pa skoraj izgine. Trenje je torej odvisno od **vrste in hrapavosti obeh ploskev**.

**Od mirovanja do drsenja.** V simulaciji spodaj (Trenje pri vlečenju klade) počasi večaj vlečno silo. Opazuj, da klada najprej miruje, čeprav jo vlečeš. Sila, ki jo drži na mestu, je **sila lepenja**; raste skupaj s tvojo silo do neke največje vrednosti. Ko tvoja sila preseže to največjo vrednost, klada zdrsne, in od tedaj za vlečenje zadošča malo manjša sila. Največja sila lepenja je zato večja od sile trenja pri drsenju: poln zaboj je najtežje *premakniti*, potem gre lažje.

**Kotaljenje.** Nakupovalni voziček s polnim nakupom tehta več kot zaboj vode, a ga potiskaš z lahkoto. Kolesa se kotalijo, ne drsijo. **Kotalno trenje** je pri enaki teži mnogokrat manjše od drsnega.

**Upor.** Zrak in voda ne pritiskata na telo kot tla, telo ju mora med gibanjem odrivati vstran. Sila upora je odvisna:

- od **hitrosti**: pri dvakrat večji hitrosti je upor približno štirikrat večji;
- od **velikosti čelne ploskve**, ki jo telo obrača v smer gibanja (škatla pokonci, kolesar vzravnan);
- od **oblike**: zaobljeno, podolgovato telo (kaplja, riba) ima manjši upor kot ploščato;
- od **snovi okoli telesa**: v vodi je upor veliko večji kot v zraku.

Od teže pa upor ni odvisen. Prazna in polna škatla enake oblike imata pri isti hitrosti enak upor.

:::premisli
Kolesar s škatlo na prtljažniku pospeši z $10\,\mathrm{km/h}$ na $30\,\mathrm{km/h}$. Kolikokrat večji je približno zračni upor? Zakaj ne trikrat?
---
Približno devetkrat ($3 \cdot 3 = 9$). Pri večji hitrosti telo v vsaki sekundi odrine več zraka, in vsak delček zraka odrine hitreje. Oba učinka se pomnožita.
:::

**Simboli na koncu.** Razmerje iz tabele imenujemo **koeficient trenja** $k_{tr}$. Je število brez enote in pove, kako »oprijemljivi« sta ploskvi. Sila, s katero telo pravokotno pritiska na podlago, je **pritisna sila** $F_N$. Na vodoravnih tleh je enaka teži, $F_N = F_g$. Tako dobimo:

$$F_{tr} = k_{tr} \cdot F_N$$

Za les na lesu je $k_{tr}$ okoli $0{,}3$, za gumo na suhem betonu okoli $0{,}7$, za kovino na ledu le okoli $0{,}05$.

## Rešeni primeri

### Primer 1: paket plenic

Paket plenic s težo $90\,\mathrm{N}$ porineš po tleh trgovine. Koeficient trenja med kartonom in ploščicami je $0{,}3$. S kolikšno silo moraš potiskati, da paket drsi enakomerno?

**Podatki:** $F_g = 90\,\mathrm{N}$, $k_{tr} = 0{,}3$, tla so vodoravna
**Iščemo:** silo trenja $F_{tr}$ (enako veliko mora biti tvoja sila)

:::formula
$F_{tr} = k_{tr} \cdot F_N$, na vodoravnih tleh $F_N = F_g$
:::

**Rešitev:**

1. Tla so vodoravna, zato paket pritiska nanje s celo težo: $F_N = 90\,\mathrm{N}$.
2. $F_{tr} = 0{,}3 \cdot 90\,\mathrm{N} = 27\,\mathrm{N}$.
3. Pri enakomernem drsenju sta tvoja sila in trenje v ravnovesju, torej sta enako veliki.
4. Odgovor: potiskati moraš s silo $27\,\mathrm{N}$.

### Primer 2: voziček na blagajni

Polni nakupovalni voziček potiskaš proti blagajni s silo $35\,\mathrm{N}$. Kotalno trenje in upor skupaj nasprotujeta gibanju s silo $20\,\mathrm{N}$. Kolikšna je rezultanta in kaj se zgodi z vozičkom? S kolikšno silo bi ga moral potiskati, da bi se peljal enakomerno?

**Podatki:** $F = 35\,\mathrm{N}$ (naprej), $F_{tr} = 20\,\mathrm{N}$ (nazaj)
**Iščemo:** rezultanto $R$ in silo za enakomerno gibanje

:::formula
Sili v nasprotnih smereh: $R = F - F_{tr}$, v smeri večje sile
:::

**Rešitev:**

1. Sili ležita na isti premici in kažeta nasprotno, zato ju odštejemo: $R = 35\,\mathrm{N} - 20\,\mathrm{N} = 15\,\mathrm{N}$.
2. Rezultanta kaže naprej, v smer večje sile, zato voziček pospešuje.
3. Za enakomerno vožnjo morata biti sili v ravnovesju, $R = 0$; tvoja sila mora biti enaka trenju, $20\,\mathrm{N}$.
4. Odgovor: rezultanta je $15\,\mathrm{N}$ naprej in voziček pospešuje. Enakomerno bi se peljal pri sili $20\,\mathrm{N}$.

### Primer 3: škatla z moko

Na pultu porineš kartonsko škatlo s težo $50\,\mathrm{N}$. Ko drsi enakomerno, silomer kaže $15\,\mathrm{N}$. Nato vanjo zložiš še $3\,\mathrm{kg}$ moke. Kolikšna bo sila trenja zdaj?

**Podatki:** $F_{g1} = 50\,\mathrm{N}$, $F_{tr1} = 15\,\mathrm{N}$, dodana masa $m = 3\,\mathrm{kg}$, $g = 9{,}81\,\mathrm{N/kg}$
**Iščemo:** novo silo trenja $F_{tr2}$

:::formula
$k_{tr} = \dfrac{F_{tr}}{F_N}$, nato $F_{tr2} = k_{tr} \cdot F_{N2}$
:::

**Rešitev:**

1. Iz prve meritve dobimo koeficient, saj se podlaga in karton nista spremenila: $k_{tr} = \dfrac{15\,\mathrm{N}}{50\,\mathrm{N}} = 0{,}3$.
2. Teža moke, ker formula za trenje potrebuje silo, ne mase: $F_g = 3\,\mathrm{kg} \cdot 9{,}81\,\mathrm{N/kg} = 29{,}43\,\mathrm{N}$.
3. Nova pritisna sila: $F_{N2} = 50\,\mathrm{N} + 29{,}43\,\mathrm{N} = 79{,}43\,\mathrm{N}$.
4. $F_{tr2} = 0{,}3 \cdot 79{,}43\,\mathrm{N} \approx 23{,}8\,\mathrm{N}$.
5. Odgovor: sila trenja naraste na približno $23{,}8\,\mathrm{N}$.

### Primer 4: zdaj ti

Paket mineralne vode ima maso $9\,\mathrm{kg}$. Potiskaš ga po ploščicah, koeficient trenja je $0{,}25$. Kolikšna je sila trenja? Zaokroži na eno decimalko.

**Podatki:** $m = 9\,\mathrm{kg}$, $k_{tr} = 0{,}25$, $g = 9{,}81\,\mathrm{N/kg}$
**Iščemo:** silo trenja $F_{tr}$

:::formula
$F_g = m \cdot g$, nato $F_{tr} = k_{tr} \cdot F_N$ z $F_N = F_g$
:::

**Rešitev:**

1. Najprej teža, ker je dana masa: $F_g = 9\,\mathrm{kg} \cdot 9{,}81\,\mathrm{N/kg} = 88{,}29\,\mathrm{N}$.
2. Tla so vodoravna, zato je $F_N = 88{,}29\,\mathrm{N}$.
3. Zadnji korak izračunaj sam:

:::premisli
Koliko je $F_{tr} = 0{,}25 \cdot 88{,}29\,\mathrm{N}$?
---
$F_{tr} \approx 22{,}1\,\mathrm{N}$ (natančno $22{,}0725\,\mathrm{N}$).
:::

## Pogoste napake

- **»Širša ploskev, večje trenje.«** Zdi se, da se večja ploskev bolj »prime«. A na večjo ploskev se ista teža razporedi na več mesta, zato vsak del pritiska šibkeje. Trenje je odvisno od pritisne sile in vrste ploskev, ne od ploščine stika.
- **Masa namesto teže.** Kdor v $F_{tr} = k_{tr} \cdot F_N$ vstavi $9\,\mathrm{kg}$, dobi $2{,}25$ in misli, da so to newtoni. Pritisna sila je sila v N. Maso najprej pomnoži z $g$.
- **»Trenje je vedno $k_{tr} \cdot F_N$.«** Tudi ko zaboj s težo $100\,\mathrm{N}$ ($k_{tr} = 0{,}3$) le rahlo potisneš s $5\,\mathrm{N}$ in se ne premakne? Takrat ga drži lepenje, ki je enako tvoji sili, $5\,\mathrm{N}$. Formula velja za drsenje.
- **»Trenje je samo škodljivo.«** Brez trenja ne bi mogel hoditi, kolo ne bi zaviralo, tekoči trak na blagajni ne bi nosil izdelkov. Trenje zmanjšamo tam, kjer nas ovira (kolesa, olje), in povečamo tam, kjer ga potrebujemo (profil na čevljih).
- **»Težje telo ima večji zračni upor.«** Upor je odvisen od hitrosti, čelne ploskve in oblike. Težo upoštevamo pri trenju ob tleh, pri uporu zraka pa ne.

## Povzetek

- Trenje je sila ob stični ploskvi dveh teles; kaže nasproti drsenju.
- Sila trenja: $F_{tr} = k_{tr} \cdot F_N$. Odvisna je od pritisne sile (na vodoravnih tleh $F_N = F_g$) in od vrste ter hrapavosti ploskev, skoraj nič od ploščine stika.
- Lepenje drži mirujoče telo; največje lepenje je večje od trenja pri drsenju. Kotalno trenje je mnogo manjše od drsnega.
- Upor zraka ali vode raste s hitrostjo (pri dvakratni hitrosti približno štirikrat), s čelno ploskvijo in je odvisen od oblike; v vodi je večji kot v zraku. Od teže ni odvisen.
- Pri enakomernem gibanju je vlečna sila v ravnovesju s trenjem in uporom.

## Drugače: Z analogijo

Trenje je kot dve krtači za čevlje, ki ju položiš eno na drugo s ščetinami skupaj. Če ju vlečeš narazen brez pritiska, zdrsneta zlahka. Če zgornjo pritisneš z dlanjo, se ščetine globoko prepletejo in vlečenje je težko. Pritisk je pritisna sila $F_N$, gostota in trdota ščetin pa sta kot vrsta ploskev, ki jo opiše $k_{tr}$.

Upor je kot prerivanje skozi gnečo na prvi dan razprodaje. Če hodiš počasi, se ljudem umikaš brez truda. Če tečeš, zadeneš v vsaki sekundi več ljudi in vsakega močneje. Če neseš široke vrečke, odrivaš več ljudi naenkrat. Hitrost in širina, ne teža vrečk, odločata, kako težko greš skozi.

Prispodoba ima mejo: ploskve nimajo ščetin, so le hrapave, in zrak niso ljudje, ki bi se sami umikali.

## Drugače: Iz vsakdanjega življenja

- **Strešni kovček na avtu.** Na avtocesti poveča čelno ploskev, zato poraba goriva zraste, pogosto za desetino ali več. Na dolgi poti na morje to pomeni nekaj evrov več za gorivo. Kdor ga ne potrebuje, ga sname.
- **Tekoči trak na blagajni.** Ko se gumijast trak zažene, lepenje potegne vrečo pomaranč s seboj, da ne obstane na mestu.
- **Nakupovalni voziček.** Kolesa spremenijo drsenje v kotaljenje. Poln voziček zato potisneš z nekaj deset newtoni, čeprav tehta več kot sto newtonov.
- **Kolesar se skloni.** Zmanjša čelno ploskev in s tem zračni upor, zato pri isti moči vozi hitreje.
- **Zimske gume in pesek na pločniku.** Oba povečata trenje, da avto zavira in pešec ne zdrsne.

## Preveri se

? Ko se tekoči trak na blagajni zažene, se vreča pomaranč odpelje z njim in po traku ne zdrsne. Katera sila jo potegne s seboj?
- Zračni upor
~ Zračni upor deluje nasproti gibanju, zato bi vrečo zaviral, ne pa vlekel naprej.
+ Sila lepenja med vrečo in trakom
- Sila trenja pri drsenju
~ Vreča po traku ne drsi, miruje glede nanj. Mirujoče telo drži lepenje.
- Teža vreče
~ Teža kaže navpično navzdol, vrečo pa je treba potegniti vodoravno, v smeri traku.
> Vreča glede na trak miruje, zato jo s seboj potegne lepenje, ki deluje ob stični ploskvi in preprečuje zdrs.

? Isti kolesar pelje z enako hitrostjo. Uredi primere od **najmanjšega** do **največjega** zračnega upora: A sklonjen brez prtljage, B vzravnan brez prtljage, C vzravnan s škatlo pokonci na prtljažniku.
- C, B, A
~ To je vrstni red od največjega do najmanjšega. Škatla poveča čelno ploskev, zato ima C največji upor.
- A, C, B
~ Škatla pokonci ne zmanjša upora, ampak ga poveča, ker poveča čelno ploskev.
+ A, B, C
- Vsi imajo enak upor, ker je hitrost enaka.
~ Hitrost je le en vpliv. Pri isti hitrosti odloča še čelna ploskev, ki je pri vseh treh različna.
> Upor raste s čelno ploskvijo: sklonjen kolesar ima najmanjšo, vzravnan večjo, vzravnan s škatlo največjo.

? Zaboj vode, ki leži na široki stranici, obrneš na ozko stranico. Masa ostane enaka. Kaj se zgodi s silo trenja pri drsenju po istih tleh?
- Poveča se, ker je pritisk na tla večji.
~ Na vsak kvadratni centimeter res pritiska močneje, a takih centimetrov je manj. Skupna pritisna sila je enaka.
- Zmanjša se, ker je stična ploskev manjša.
~ Trenje ni odvisno od ploščine stika, ampak od pritisne sile in vrste ploskev.
+ Ostane skoraj enaka.
> Pritisna sila (teža) in vrsta ploskev se nista spremenili, zato je $F_{tr} = k_{tr} \cdot F_N$ enak.

? Škatla s težo $150\,\mathrm{N}$ drsi po tleh, koeficient trenja je $0{,}2$. Kolikšna je sila trenja?
- $750\,\mathrm{N}$
~ To je $150 : 0{,}2$. Koeficient trenja pomnožiš s pritisno silo, ne deliš z njim.
- $150\,\mathrm{N}$
~ To je cela teža. Trenje je le del pritisne sile, kolikor pove koeficient.
+ $30\,\mathrm{N}$
> $F_{tr} = k_{tr} \cdot F_N = 0{,}2 \cdot 150\,\mathrm{N} = 30\,\mathrm{N}$.

? Zaboj z maso $20\,\mathrm{kg}$ drsi po vodoravnih tleh, $k_{tr} = 0{,}3$. Kolikšna je sila trenja? ($g = 9{,}81\,\mathrm{N/kg}$)
- $6\,\mathrm{N}$
~ Vstavil si maso v kilogramih. Pritisna sila je teža: najprej $m \cdot g$.
- $196{,}2\,\mathrm{N}$
~ To je teža zaboja, pritisna sila. Pomnožiti jo moraš še s koeficientom trenja.
+ $58{,}9\,\mathrm{N}$
> $F_N = F_g = 20\,\mathrm{kg} \cdot 9{,}81\,\mathrm{N/kg} = 196{,}2\,\mathrm{N}$, nato $F_{tr} = 0{,}3 \cdot 196{,}2\,\mathrm{N} \approx 58{,}9\,\mathrm{N}$.

:::simboli
F_{tr} | sila trenja | F_{tr} = k_{tr} \cdot F_N | N | kaže nasproti drsenju
k_{tr} | koeficient trenja | k_{tr} = \dfrac{F_{tr}}{F_N} | – | odvisen od vrste ploskev
F_N | pritisna sila (pravokotno na podlago) | | N | na vodoravnih tleh $F_N = F_g$
F_g | teža | F_g = m \cdot g | N
m | masa | | kg
g | gravitacijski pospešek | | N/kg | na Zemlji $9{,}81\,\mathrm{N/kg}$
F | sila, s katero potiskaš | | N
R | rezultanta | R = F - F_{tr} | N | sili v nasprotnih smereh
F_{g1} | teža prazne škatle | | N
F_{tr1} | sila trenja prazne škatle | | N
F_{N2} | pritisna sila polne škatle | | N
F_{tr2} | sila trenja polne škatle | F_{tr2} = k_{tr} \cdot F_{N2} | N
:::
