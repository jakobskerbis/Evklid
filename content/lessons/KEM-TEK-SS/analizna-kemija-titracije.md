---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ema na zemljevidu riše pot do baznega tabora pod Everestom. Najvišja točka trekinga bo nad $5000\,\mathrm{m}$, zato ji je zdravnica svetovala, naj nekaj tednov pred odhodom jemlje železo. Tablete je kupila med prestopanjem na letališču, a navodila so v pisavi, ki je ne zna prebrati. Koliko železa je res v eni tableti?

V šolskem laboratoriju ima bireto, raztopino kalijevega permanganata in nekaj ur časa. Tehtnica ji ne pomaga, saj tableta vsebuje tudi škrob in polnila. Pomaga pa ji **titracija**: postopek, pri katerem iz porabljenega volumna raztopine z znano koncentracijo izračunaš, koliko snovi je v vzorcu. Na tekmovanjih je to ena najpogostejših računskih nalog analizne kemije.

## Razlaga

**Mamljiva zamisel 1: »Šibka kislina porabi manj baze.«** Ocetna kislina je v raztopini $0{,}10\,\mathrm{mol/L}$ disociirana le okoli $1\,\%$. Zato se zdi, da bo za nevtralizacijo dovolj manj $\mathrm{NaOH}$ kot za enako koncentrirano $\mathrm{HCl}$.

:::premisli
V eni erlenmajerici je $20{,}0\,\mathrm{mL}$ $\mathrm{HCl}$, v drugi $20{,}0\,\mathrm{mL}$ $\mathrm{CH_3COOH}$, obe $0{,}10\,\mathrm{mol/L}$. Koliko mL $\mathrm{NaOH}$ s koncentracijo $0{,}10\,\mathrm{mol/L}$ porabiš za vsako? Napovej.
---
Za obe $20{,}0\,\mathrm{mL}$. Ko $\mathrm{OH^-}$ odstrani $\mathrm{H_3O^+}$, se ravnotežje disociacije pomakne v desno in nove molekule kisline oddajo proton. Na koncu zreagirajo vse.
:::

**Popravek: titracija šteje molekule, ne ionov.** Ko titrant porabi prosti $\mathrm{H_3O^+}$, ravnotežje sproti dobavi novega, zato reakcija teče do konca. Zato ni pomembno, koliko je kislina disociirana, ampak koliko je je vsega. Raztopina z znano koncentracijo v bireti je **titrant** (T), snov v vzorcu je **analit** (A). Množino titranta dobiš iz porabe:

$$n_\mathrm{T} = c_\mathrm{T} \cdot V_\mathrm{T}$$

**Točka ekvivalence** je trenutek, ko je titranta dodano natanko po stehiometriji. Če po urejeni enačbi $a$ delcev A reagira s $t$ delci T, velja:

$$n_\mathrm{A} = \frac{a}{t} \cdot n_\mathrm{T}$$

$$c_\mathrm{A} = \frac{n_\mathrm{A}}{V_\mathrm{A}}$$

**Mamljiva zamisel 2: »V točki ekvivalence je raztopina nevtralna.«** Ekvivalenca pomeni *stehiometrično*, ne *pH 7*. Pri titraciji ocetne kisline v ekvivalenci ostane raztopina $\mathrm{CH_3COONa}$. Acetatni ion je šibka baza, zato je pH nad 7.

| titracija | pH v ekvivalenci | indikator |
|---|---|---|
| močna kislina, močna baza | $7$ | fenolftalein ali metiloranž |
| šibka kislina, močna baza | nad 7 (okoli $8{,}7$) | fenolftalein |
| šibka baza, močna kislina | pod 7 (okoli $5{,}3$) | metiloranž |
| $\mathrm{Fe^{2+}}$ s $\mathrm{KMnO_4}$ | (redoks) | $\mathrm{KMnO_4}$ sam |

**Titracijska krivulja** kaže pH v odvisnosti od dodanega volumna titranta; blizu ekvivalence pH skoraj navpično poskoči. **Indikator** spremeni barvo v ozkem območju pH. Izbereš takega, čigar območje leži na navpičnem delu krivulje, sicer barva preskoči prezgodaj ali prepozno. Trenutek, ko indikator spremeni barvo, je **končna točka**; dober indikator jo postavi skoraj na točko ekvivalence.

V simulaciji spodaj »Titracijska krivulja« izberi najprej »HCl (močna kislina) z NaOH«, nato »CH₃COOH (šibka kislina) z NaOH«. Opazi, da je skok pri obeh pri istem volumnu, pri ocetni kislini pa je krajši in višje. Nato preizkusi metiloranž na ocetni kislini: barva se spremeni, ko kislina še ni nevtralizirana.

**Mamljiva zamisel 3: »Razmerje je vedno $1 : 1$.«** Pri $\mathrm{H_2SO_4}$ z $\mathrm{NaOH}$ je razmerje $1 : 2$. Pri redoks titracijah štejemo elektrone. V kisli raztopini $\mathrm{MnO_4^-}$ sprejme pet elektronov, $\mathrm{Fe^{2+}}$ odda enega:

$$\mathrm{MnO_4^-} + 5\,\mathrm{Fe^{2+}} + 8\,\mathrm{H^+} \rightarrow \mathrm{Mn^{2+}} + 5\,\mathrm{Fe^{3+}} + 4\,\mathrm{H_2O}$$

Vijolični permanganat se sproti razbarva v skoraj brezbarvni $\mathrm{Mn^{2+}}$. Ko zmanjka $\mathrm{Fe^{2+}}$, prva odvečna kapljica obarva raztopino rožnato. Titrant je hkrati indikator.

:::premisli
Zakaj raztopino železa pred titracijo s permanganatom nakisamo z žveplovo(VI) kislino in ne s klorovodikovo?
---
$\mathrm{MnO_4^-}$ je dovolj močan oksidant, da oksidira tudi $\mathrm{Cl^-}$ v $\mathrm{Cl_2}$. Del permanganata bi se porabil za klorid, poraba bi bila prevelika in izračunana množina železa previsoka. Sulfat se ne oksidira.
:::

**Alikvot.** Pogosto vzorec raztopiš v bučki, npr. $100{,}0\,\mathrm{mL}$, in s pipeto odvzameš le del, npr. $25{,}00\,\mathrm{mL}$ (**alikvot**). Rezultat titracije velja za alikvot; za cel vzorec ga pomnožiš s faktorjem ($V_\mathrm{b}$ je volumen bučke, $V_\mathrm{p}$ volumen alikvota):

$$f = \frac{V_\mathrm{b}}{V_\mathrm{p}}$$

## Rešeni primeri

### Primer 1 (lažji): kis s tržnice

Ema je na grški tržnici kupila kis z razmazano etiketo. Razredčila ga je desetkrat. $20{,}00\,\mathrm{mL}$ razredčenega kisa je ob fenolftaleinu porabilo $16{,}40\,\mathrm{mL}$ $\mathrm{NaOH}$ s koncentracijo $0{,}1000\,\mathrm{mol/L}$. Kolikšna je koncentracija ocetne kisline v kisu?

**Podatki:** $V_\mathrm{A} = 20{,}00\,\mathrm{mL}$, $c_\mathrm{T} = 0{,}1000\,\mathrm{mol/L}$, $V_\mathrm{T} = 16{,}40\,\mathrm{mL}$, redčenje $10$-kratno, $M(\mathrm{CH_3COOH}) = 60{,}05\,\mathrm{g/mol}$
**Iščemo:** $c$ ocetne kisline v nerazredčenem kisu

:::formula
$\mathrm{CH_3COOH} + \mathrm{NaOH} \rightarrow \mathrm{CH_3COONa} + \mathrm{H_2O}$, razmerje $1 : 1$, zato $c_\mathrm{A} = \dfrac{c_\mathrm{T} \cdot V_\mathrm{T}}{V_\mathrm{A}}$
:::

**Rešitev:**

1. Razmerje je $1 : 1$, prostornini sta v istih enotah, zato se mL pokrajšajo.
2. $c_\mathrm{A} = \dfrac{0{,}1000 \cdot 16{,}40}{20{,}00} = 0{,}08200\,\mathrm{mol/L}$ v razredčenem kisu.
3. Pred redčenjem je bila desetkrat večja: $0{,}8200\,\mathrm{mol/L}$.
4. Masna koncentracija: $0{,}8200 \cdot 60{,}05 = 49{,}24\,\mathrm{g/L}$, torej okoli $4{,}9\,\mathrm{g}$ kisline v $100\,\mathrm{mL}$.

Odgovor: kis vsebuje $0{,}8200\,\mathrm{mol/L}$ ocetne kisline, kar je običajen namizni kis.

### Primer 2: kolikšen je pH v točki ekvivalence

Pri titraciji iz Primera 1 je v erlenmajerici ob ekvivalenci $36{,}40\,\mathrm{mL}$ raztopine ($20{,}00\,\mathrm{mL}$ vzorca in $16{,}40\,\mathrm{mL}$ baze). Kolikšen je pH tam in zakaj je fenolftalein (prehod $8{,}2$ do $10$) pravi izbor? $K_\mathrm{a}(\mathrm{CH_3COOH}) = 1{,}8 \cdot 10^{-5}$.

**Podatki:** $c_\mathrm{T} = 0{,}1000\,\mathrm{mol/L}$, $V_\mathrm{T} = 16{,}40\,\mathrm{mL}$, $V = 36{,}40\,\mathrm{mL}$, $K_\mathrm{a} = 1{,}8 \cdot 10^{-5}$, $K_\mathrm{w} = 1{,}0 \cdot 10^{-14}$
**Iščemo:** pH v točki ekvivalence

:::formula
$K_\mathrm{b} = \dfrac{K_\mathrm{w}}{K_\mathrm{a}}$; $[\mathrm{OH^-}] \approx \sqrt{K_\mathrm{b} \cdot c}$; $\mathrm{pH} = 14 - \mathrm{pOH}$
:::

**Rešitev:**

1. Vsa kislina je postala acetat: $n = 0{,}1000 \cdot 0{,}01640 = 1{,}640 \cdot 10^{-3}\,\mathrm{mol}$.
2. $c = \dfrac{1{,}640 \cdot 10^{-3}\,\mathrm{mol}}{0{,}03640\,\mathrm{L}} = 0{,}04505\,\mathrm{mol/L}$; prostornina se je med titracijo povečala.
3. $K_\mathrm{b} = \dfrac{1{,}0 \cdot 10^{-14}}{1{,}8 \cdot 10^{-5}} = 5{,}56 \cdot 10^{-10}$.
4. $[\mathrm{OH^-}] = \sqrt{5{,}56 \cdot 10^{-10} \cdot 0{,}04505} = 5{,}00 \cdot 10^{-6}\,\mathrm{mol/L}$, $\mathrm{pOH} = 5{,}30$, $\mathrm{pH} = 8{,}70$.

Odgovor: pH je $8{,}70$, kar leži v območju fenolftaleina. Metiloranž bi postal rumen že pri pH $4{,}4$, ko je nevtralizirana šele okoli tretjina kisline.

### Primer 3 (težji): železo za višino

Ema raztopi eno tableto v razredčeni $\mathrm{H_2SO_4}$ in raztopino v bučki dopolni do $100{,}0\,\mathrm{mL}$. Za $25{,}00\,\mathrm{mL}$ te raztopine porabi $8{,}95\,\mathrm{mL}$ $\mathrm{KMnO_4}$ s koncentracijo $0{,}01000\,\mathrm{mol/L}$. Koliko mg železa ($\mathrm{Fe^{2+}}$) je v tableti?

**Podatki:** $V_\mathrm{b} = 100{,}0\,\mathrm{mL}$, $V_\mathrm{p} = 25{,}00\,\mathrm{mL}$, $c_\mathrm{T} = 0{,}01000\,\mathrm{mol/L}$, $V_\mathrm{T} = 8{,}95\,\mathrm{mL}$, $M(\mathrm{Fe}) = 55{,}85\,\mathrm{g/mol}$
**Iščemo:** masa železa v tableti

:::formula
$n_\mathrm{T} = c_\mathrm{T} \cdot V_\mathrm{T}$; $n_\mathrm{A} = 5 \cdot n_\mathrm{T}$; cela tableta $f \cdot n_\mathrm{A}$; $m = n \cdot M$
:::

**Rešitev:**

1. $n_\mathrm{T} = 0{,}01000\,\mathrm{mol/L} \cdot 0{,}00895\,\mathrm{L} = 8{,}95 \cdot 10^{-5}\,\mathrm{mol}$ permanganata.
2. Vsak $\mathrm{MnO_4^-}$ oksidira pet $\mathrm{Fe^{2+}}$: $n_\mathrm{A} = 5 \cdot 8{,}95 \cdot 10^{-5} = 4{,}475 \cdot 10^{-4}\,\mathrm{mol}$ v alikvotu.
3. Faktor alikvota je $f = \dfrac{100{,}0}{25{,}00} = 4$. Dokončaj sam: množina železa v celi tableti in njegova masa v mg.

:::premisli
Koliko mg železa je v tableti?
---
$n = 4 \cdot 4{,}475 \cdot 10^{-4} = 1{,}790 \cdot 10^{-3}\,\mathrm{mol}$, $m = 1{,}790 \cdot 10^{-3}\,\mathrm{mol} \cdot 55{,}85\,\mathrm{g/mol} = 0{,}100\,\mathrm{g} = 100\,\mathrm{mg}$ (tri veljavna mesta, kot jih ima poraba $8{,}95\,\mathrm{mL}$).
:::

## Pogoste napake

- **»Šibka kislina porabi manj titranta.«** Disociacija ne vpliva na porabo: ravnotežje sproti dobavlja nove protone. Računaš s celotno koncentracijo kisline, ne s $[\mathrm{H_3O^+}]$.
- **»V ekvivalenci je pH 7.«** Le pri močni kislini in močni bazi. Kdor za ocetno kislino vzame metiloranž, konča prezgodaj in dobi prenizko koncentracijo.
- **Razmerje $1 : 1$ brez enačbe.** Pri $\mathrm{H_2SO_4}$ dobiš dvakrat preveliko koncentracijo, pri $\mathrm{Fe^{2+}}$ s permanganatom petkrat premajhno množino železa. Najprej uredi enačbo, nato beri razmerje.
- **Pozabljen alikvot ali redčenje.** Titriral si le četrtino raztopine, odgovor pa velja za cel vzorec. Na koncu se vprašaj: »Za kateri volumen velja moj $n$?«
- **Mešanje mL in L.** V $c_\mathrm{A} = \dfrac{c_\mathrm{T} V_\mathrm{T}}{V_\mathrm{A}}$ se enoti volumna pokrajšata le, če sta obe v mL ali obe v L. Pri $n = c \cdot V$ pa mora biti $V$ v litrih.

## Povzetek

- Titracija meri volumen titranta; iz njega $n_\mathrm{T} = c_\mathrm{T} \cdot V_\mathrm{T}$ in po enačbi reakcije $n_\mathrm{A} = \dfrac{a}{t} n_\mathrm{T}$.
- Šibka in močna kislina z enako množino porabita enako baze.
- Točka ekvivalence je stehiometrična; pH tam je 7 le pri močni kislini z močno bazo. Indikator izbereš po navpičnem delu krivulje.
- Permanganometrija: $\mathrm{MnO_4^-} : \mathrm{Fe^{2+}} = 1 : 5$, nakisamo z $\mathrm{H_2SO_4}$, titrant je sam indikator.
- Pri alikvotu rezultat pomnožiš s $f = \dfrac{V_\mathrm{b}}{V_\mathrm{p}}$.

## Drugače: Kot zgodba

Ema je krivuljo titracije ocetne kisline narisala kot višinski profil poti na svojem zemljevidu. Na začetku se pot hitro dvigne s pH $2{,}9$, potem sledi dolga, skoraj ravna planota: to je pufer, kjer dodana baza le spreminja razmerje med kislino in acetatom. Na polovici planote je višina točno $\mathrm{p}K_\mathrm{a}$.

Nato pride stena. Na nekaj desetinkah mililitra pH poskoči za več enot. Na sredini stene je točka ekvivalence. Indikator je kot smerokaz: postavljen mora biti na steni. Če ga postaviš na planoto (metiloranž pri ocetni kislini), ti pokaže cilj, preden si sploh prišel do stene.

Pri permanganatu Ema ne potrebuje smerokaza. Vsaka kapljica se razbarva, dokler je v bučki še $\mathrm{Fe^{2+}}$. Ko ga zmanjka, se rožnata barva obdrži, in pot je končana.

## Drugače: Korak za korakom s številkami

Primer: $10{,}00\,\mathrm{mL}$ $\mathrm{H_2SO_4}$ porabi $15{,}00\,\mathrm{mL}$ $\mathrm{NaOH}$ s koncentracijo $0{,}1200\,\mathrm{mol/L}$.

1. Uredi enačbo: $\mathrm{H_2SO_4} + 2\,\mathrm{NaOH} \rightarrow \mathrm{Na_2SO_4} + 2\,\mathrm{H_2O}$. Razmerje $a : t = 1 : 2$.
2. Množina titranta: $n_\mathrm{T} = 0{,}1200 \cdot 0{,}01500 = 1{,}800 \cdot 10^{-3}\,\mathrm{mol}$.
3. Množina analita: $n_\mathrm{A} = \dfrac{1}{2} \cdot 1{,}800 \cdot 10^{-3} = 9{,}000 \cdot 10^{-4}\,\mathrm{mol}$.
4. Koncentracija: $c_\mathrm{A} = \dfrac{9{,}000 \cdot 10^{-4}\,\mathrm{mol}}{0{,}01000\,\mathrm{L}} = 0{,}09000\,\mathrm{mol/L}$.
5. Preveri: brez faktorja $\dfrac{1}{2}$ bi dobil $0{,}1800\,\mathrm{mol/L}$, kar je dvakrat preveč.

## Preveri se

? Kaj od naštetega ne sodi med kislinsko-bazne indikatorje?
- fenolftalein
~ Fenolftalein je kislinsko-bazni indikator (prehod pri pH $8{,}2$ do $10$); rožnata barva te morda spomni na permanganat.
- metiloranž
~ Metiloranž spremeni barvo pri pH $3{,}1$ do $4{,}4$, zato je kislinsko-bazni indikator.
+ kalijev permanganat
- bromtimol modro
~ Bromtimol modro spremeni barvo okoli pH 7, uporablja se pri močni kislini z močno bazo.
> $\mathrm{KMnO_4}$ je redoks titrant, ki je sam svoj indikator. Ostali trije spremenijo barvo glede na pH.

? Krivulja kaže titracijo $20{,}00\,\mathrm{mL}$ šibke kisline z $\mathrm{NaOH}$ s koncentracijo $0{,}100\,\mathrm{mol/L}$. Z grafa odčitaj volumen v točki ekvivalence in izračunaj koncentracijo kisline (v mol/L).
:::risba graf
opis: Titracijska krivulja šibke kisline. Vodoravna os je prostornina dodanega NaOH od 0 do 26 mL, navpična os pH od 0 do 14. Krivulja začne pri pH 3,0, pri 6 mL je pH 4,74, nato se položno dviga do pH 6,5 pri 11,8 mL. Pri 12 mL je pH 8,7 in krivulja navpično skoči do 10,8 pri 12,2 mL, nato se položi in pri 25 mL doseže pH 12,5.
x: 0 .. 26 | 2 | V(NaOH) / mL
y: 0 .. 14 | 2 | pH
črta: 0; 2,99 -> 1; 3,7 -> 2; 4,05 -> 4; 4,44 -> 6; 4,74 -> 8; 5,05 -> 10; 5,44 -> 11; 5,79 -> 11,8; 6,52 -> 12; 8,66 -> 12,2; 10,79 -> 13; 11,48 -> 15; 11,93 -> 20; 12,3 -> 25; 12,46 | modra debelo
točka: 6; 4,74 | A | nad levo
točka: 12; 8,66 | B | desno
:::
= 0,0600 | 0,0010
~ 0,0300 | Odčital si točko A pri $6\,\mathrm{mL}$, to je polovična nevtralizacija ($\mathrm{pH} = \mathrm{p}K_\mathrm{a}$), ne ekvivalenca.
~ 0,167 | Prostornini si zamenjal: $c_\mathrm{A} = \dfrac{c_\mathrm{T} V_\mathrm{T}}{V_\mathrm{A}}$, vzorec je v imenovalcu.
> Ekvivalenca je na sredini skoka (točka B) pri $12{,}0\,\mathrm{mL}$: $c = \dfrac{0{,}100 \cdot 12{,}0}{20{,}00} = 0{,}0600\,\mathrm{mol/L}$.

? Bireto si pred polnjenjem spral le z destilirano vodo, ne s titrantom. Kako to vpliva na izračunano koncentracijo analita?
- Nič, voda ne reagira.
~ Voda res ne reagira, a razredči titrant. Šteje množina titranta v porabljenem volumnu.
+ Izračunana koncentracija bo previsoka.
- Izračunana koncentracija bo prenizka.
~ Razredčeni titrant ima v vsakem mL manj snovi, zato ga porabiš več, ne manj.
> Kapljice vode razredčijo titrant. Za isto množino ga porabiš večji volumen, v računu pa uporabiš staro koncentracijo, zato je $n_\mathrm{T}$ in s tem $c_\mathrm{A}$ previsok.

? Luka računa železo: $25{,}00\,\mathrm{mL}$ raztopine $\mathrm{Fe^{2+}}$ porabi $10{,}00\,\mathrm{mL}$ $\mathrm{KMnO_4}$ s $c = 0{,}0200\,\mathrm{mol/L}$. V katerem koraku se je Luka zmotil?
(1) $n(\mathrm{MnO_4^-}) = 0{,}0200 \cdot 0{,}01000 = 2{,}00 \cdot 10^{-4}\,\mathrm{mol}$. (2) $n(\mathrm{Fe^{2+}}) = n(\mathrm{MnO_4^-}) = 2{,}00 \cdot 10^{-4}\,\mathrm{mol}$. (3) $c = \dfrac{n}{0{,}02500\,\mathrm{L}}$.
- korak (1)
~ Množina titranta je pravilna: $c \cdot V$ z volumnom v litrih.
+ korak (2)
- korak (3)
~ Deljenje z volumnom vzorca v litrih je pravilno; napačna je že množina, ki jo deli.
> En $\mathrm{MnO_4^-}$ sprejme $5$ elektronov, en $\mathrm{Fe^{2+}}$ odda $1$, zato $n(\mathrm{Fe^{2+}}) = 5 \cdot 2{,}00 \cdot 10^{-4} = 1{,}00 \cdot 10^{-3}\,\mathrm{mol}$.

? Razvrsti korake titracije v pravilni vrstni red.
1. Bireto speri z malo titranta.
2. Bireto napolni s titrantom.
3. Odčitaj začetni volumen na bireti.
4. Ob mešanju dodajaj titrant vzorcu z indikatorjem, dokler barva ne ostane spremenjena.
5. Odčitaj končni volumen in izračunaj porabo.
> Spiranje s titrantom mora biti pred polnjenjem, sicer ostanki vode titrant razredčijo. Začetni volumen odčitaš šele na polni bireti. Titriraš do obstojne spremembe barve; poraba je razlika med končnim in začetnim odčitkom.

<<RACUN
vrednost: 0.1000*16.40/20.00 | 0.08200
vrednost: 0.08200*10 | 0.8200
vrednost: 0.8200*60.05 | 49.24
molska: CH3COOH | 60.05
kemija: CH3COOH + NaOH -> CH3COONa + H2O
vrednost: 0.1000*0.01640 | 1.640e-3
vrednost: 1.640e-3/0.03640 | 0.04505
vrednost: 1.0e-14/1.8e-5 | 5.56e-10
vrednost: sqrt(5.56e-10*0.04505) | 5.00e-6
vrednost: 14+log(sqrt(5.56e-10*0.04505), 10) | 8.70
kemija: MnO4- + 5 Fe2+ + 8 H+ -> Mn2+ + 5 Fe3+ + 4 H2O
vrednost: 0.01000*0.00895 | 8.95e-5
vrednost: 5*8.95e-5 | 4.475e-4
vrednost: 4*4.475e-4 | 1.790e-3
vrednost: 1.790e-3*55.85 | 0.100
kemija: H2SO4 + 2 NaOH -> Na2SO4 + 2 H2O
vrednost: 0.1200*0.01500 | 1.800e-3
vrednost: 1.800e-3/2/0.01000 | 0.09000
vrednost: 0.100*12.0/20.00 | 0.0600
vrednost: 5*0.0200*0.01000 | 1.00e-3
kemija: 2 MnO4- + 10 Cl- + 16 H+ -> 2 Mn2+ + 5 Cl2 + 8 H2O
>>

:::simboli
n_\mathrm{T} | množina titranta | n_\mathrm{T} = c_\mathrm{T} \cdot V_\mathrm{T} | mol
c_\mathrm{T} | koncentracija titranta | | mol/L
V_\mathrm{T} | porabljeni volumen titranta | | L
n_\mathrm{A} | množina analita | n_\mathrm{A} = \dfrac{a}{t} \cdot n_\mathrm{T} | mol
a | koeficient analita v enačbi reakcije | | –
t | koeficient titranta v enačbi reakcije | | –
c_\mathrm{A} | koncentracija analita | c_\mathrm{A} = \dfrac{n_\mathrm{A}}{V_\mathrm{A}} | mol/L
V_\mathrm{A} | volumen vzorca (analita) | | L
f | faktor alikvota | f = \dfrac{V_\mathrm{b}}{V_\mathrm{p}} | –
V_\mathrm{b} | volumen bučke | | mL
V_\mathrm{p} | volumen pipete (alikvota) | | mL
K_\mathrm{a} | konstanta kisline | | – | ocetna kislina $1{,}8 \cdot 10^{-5}$
K_\mathrm{b} | konstanta baze (acetat) | K_\mathrm{b} = \dfrac{K_\mathrm{w}}{K_\mathrm{a}} | –
K_\mathrm{w} | ionski produkt vode | | – | $1{,}0 \cdot 10^{-14}$ pri $25\,\mathrm{°C}$
\mathrm{OH^-} | hidroksidni ion | | – | $[\mathrm{OH^-}] \approx \sqrt{K_\mathrm{b} \cdot c}$ v mol/L
c | koncentracija acetata v točki ekvivalence | | mol/L
\mathrm{pH} | pH | \mathrm{pH} = 14 - \mathrm{pOH} | –
\mathrm{pOH} | pOH | \mathrm{pOH} = -\log [\mathrm{OH^-}] | –
n | množina | n = c \cdot V | mol | v Primeru 3 železo v celi tableti: $n = f \cdot n_\mathrm{A}$
m | masa | m = n \cdot M | g
M | molska masa | | g/mol
:::
