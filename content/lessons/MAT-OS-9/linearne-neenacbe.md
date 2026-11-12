---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Prva zgodba: na počitnicah se voziš s turističnim avtobusom. Vstop stane $2\,€$, vsak prevožen kilometer še $0{,}50\,€$. V žepu imaš $8\,€$. Kako daleč se lahko pelješ?

Druga zgodba: družina se z avtom odpravlja na pot. V rezervoarju je $45$ litrov goriva, avto porabi $0{,}06$ litra na kilometer. Oče želi, da v rezervoarju ostane vsaj $9$ litrov rezerve. Kako dolgo pot lahko načrtujejo na zemljevidu?

Zgodbi sta videti različni, skrivata pa isto idejo. V obeh ne iščemo ene same razdalje, ampak **vse razdalje do neke meje**. Z avtobusom se lahko pelješ $5\,\text{km}$ ali $10\,\text{km}$, oboje je prav. Tak pogoj zapišemo z **neenačbo**. Rešujemo jo skoraj tako kot enačbo. Skoraj: eno pravilo je novo in prav ob njem nastane največ napak.

## Razlaga

**1. Kaj je neenačba.** Neenačba je zapis, v katerem sta dva izraza povezana z enim od znakov:

- $<$ (manjše), $>$ (večje),
- $\le$ (manjše ali enako), $\ge$ (večje ali enako).

Znaka $<$ in $>$ sta **stroga**, znaka $\le$ in $\ge$ **nestroga**. Za avtobus velja: cena vožnje mora biti manjša ali enaka $8\,€$. Če z $x$ označimo število kilometrov, je to **linearna neenačba** $2+0{,}5x \le 8$.

**2. Rešitev neenačbe.** Rešitev je vsako število, ki da ob vstavitvi v neenačbo pravilno (resnično) neenakost. Neenačba $x<4$ ima rešitve $3$; $0$; $-5$; $3{,}9$ in še neskončno mnogo drugih. Število $4$ ni rešitev, ker $4<4$ ne drži.

**3. Skušnjava: »Neenačbo rešujem natanko tako kot enačbo.«** Pri avtobusu to deluje. Od obeh strani odštejemo $2$ in dobimo $0{,}5x \le 6$. Obe strani delimo z $0{,}5$ in dobimo $x \le 12$. Preizkus: pri $x=10$ je cena $2+5=7$, kar ne presega $8$. Pri $x=14$ je cena $2+7=9$, kar je preveč. Pelješ se lahko največ $12\,\text{km}$.

Rešitve se res ne spremenijo, če na obeh straneh **prištejemo ali odštejemo** isto število ali če obe strani **pomnožimo ali delimo z istim pozitivnim številom**.

**4. Kje skušnjava odpove.** Na enak način reši neenačbo $-2x<6$. Delimo z $-2$ kot pri enačbi in dobimo $x<-3$. Preverimo s številom $-4$, ki naj bi bilo rešitev: $-2\cdot(-4)=8$, $8<6$ pa ne drži.

:::premisli
Ali je $x=0$ rešitev neenačbe $-2x<6$? Kaj to pove o odgovoru $x<-3$?
---
Je: $-2\cdot 0=0$ in $0<6$ drži. Število $0$ pa ni manjše od $-3$, zato odgovor $x<-3$ ne more biti pravilen. Rešitve ležijo ravno na drugi strani števila $-3$.
:::

Popravek: pravilna rešitev je $x>-3$. Pravilo se glasi: **če obe strani pomnožimo ali delimo z negativnim številom, se znak neenačbe obrne.** Znak $<$ postane $>$, $\le$ postane $\ge$ in obratno.

Zakaj? Vzemi pravilno neenakost $2<5$ in obe strani pomnoži z $-1$. Dobiš $-2$ in $-5$. Množenje z $-1$ vsako število prezrcali čez $0$ na premici, zato se levo in desno zamenjata: $-5$ je zdaj levo od $-2$, torej $-2>-5$. Vrstni red se je obrnil, zato se mora obrniti tudi znak.

**5. Zapis rešitve na številski premici.** Rešitev $x>-3$ narišemo tako:

:::risba premica
opis: Številska premica od −6 do 4. Pri −3 je prazen krogec, pobarvan je del premice desno od −3: to so rešitve neenačbe x > −3. Pobarvani del se nadaljuje v desno brez konca.
od: -6
do: 4
interval: -3 .. 4 | x > −3 | modra
točka: -3 | −3 | prazna
:::

- Pri **strogi** neenakosti ($<$, $>$) je na meji **prazen krogec**: meja ni rešitev.
- Pri **nestrogi** neenakosti ($\le$, $\ge$) je na meji **poln krogec**: meja je rešitev.
- Pobarvamo del premice, kjer so rešitve: pri $x>a$ desno od $a$, pri $x<a$ levo od $a$.

:::premisli
Avtobusna neenačba ima rešitev $x \le 12$. Kakšen krogec narišeš pri $12$? Ali pri avtobusu res pobarvaš vso premico levo od $12$?
---
Poln krogec, ker je znak nestrog: pri $12\,\text{km}$ plačaš točno $8\,€$, kar še gre. Pobarvaš levo od $12$, ker so rešitve manjše razdalje. V resnici razdalja ne more biti negativna, zato pri avtobusu pobarvamo samo od $0$ do $12$.
:::

**6. Postopek reševanja.**

1. Odpravi oklepaje in ulomke (ulomke tako kot pri enačbah: z najmanjšim skupnim večkratnikom imenovalcev, ki je pozitiven, zato se znak ne obrne).
2. Člene z neznanko zberi na eno stran, ostale na drugo.
3. Deli s številom pred $x$. Če je negativno, obrni znak.
4. Rešitev zapiši kot neenačbo in jo nariši na premici.
5. Preizkusi z enim številom iz rešitve in enim zunaj nje.

V srednji šoli boš rešitev zapisoval tudi z intervalom, na primer $x>-3$ kot $(-3, \infty)$.

V simulaciji spodaj (Linearne neenačbe) nastavi $a=-2$ (število pred $x$ v izrazu $ax+b$). Z drsnikom »preizkusi x« preveri števila levo in desno od meje in opazuj, na kateri strani so rešitve.

## Rešeni primeri

### Primer 1 (lažji)

Reši neenačbo $x+5>9$ in rešitev nariši na številski premici.

**Podatki:** neenačba $x+5>9$
**Iščemo:** vse rešitve $x$ in zapis na premici

:::formula
Če na obeh straneh odštejemo isto število, se znak ne spremeni.
:::

**Rešitev:**

1. Na obeh straneh odštejemo $5$, da ostane $x$ sam: $x+5-5>9-5$.
2. Dobimo $x>4$.
3. Na premici: prazen krogec pri $4$, ker je znak strog; pobarvano desno, ker so rešitve večje od $4$.
4. Preizkus: pri $x=5$ je $5+5=10>9$, drži. Pri $x=4$ dobimo $9>9$, kar ne drži, zato je krogec prazen.
5. Odgovor: rešitve so vsa števila, večja od $4$.

### Primer 2

Reši neenačbo $3x-7 \le 8$ in rešitev nariši na številski premici.

**Podatki:** neenačba $3x-7 \le 8$
**Iščemo:** vse rešitve $x$ in zapis na premici

:::formula
Prištevanje in deljenje s pozitivnim številom znaka ne spremenita.
:::

**Rešitev:**

1. Prištejemo $7$, da se znebimo $-7$ ob členu z $x$: $3x \le 15$.
2. Delimo s $3$. Ker je $3$ pozitivno, se znak ne obrne: $x \le 5$.
3. Na premici: poln krogec pri $5$, ker je znak nestrog; pobarvano levo.
4. Preizkus: pri $x=5$ je $3\cdot 5-7=8 \le 8$, drži. Pri $x=0$ je $-7 \le 8$, drži. Pri $x=6$ je $11 \le 8$, ne drži.
5. Odgovor: rešitve so vsa števila, manjša ali enaka $5$.

### Primer 3 (težji): gorivo za izlet

Rešimo drugo zgodbo z začetka. V rezervoarju je $45$ litrov goriva, avto porabi $0{,}06$ litra na kilometer. Na koncu poti mora ostati vsaj $9$ litrov. Koliko kilometrov je lahko dolga pot?

**Podatki:** začetno gorivo $45\,\text{L}$; poraba $0{,}06\,\text{L}$ na km; ostati mora vsaj $9\,\text{L}$
**Iščemo:** vse dolžine poti $x$ (v km), pri katerih ostane dovolj goriva

:::formula
Ostanek goriva je $45-0{,}06x$ litrov in mora biti vsaj $9$: $45-0{,}06x \ge 9$
:::

**Rešitev:**

1. Zapišemo neenačbo, ker mora biti ostanek »vsaj« $9$, torej $\ge 9$: $45-0{,}06x \ge 9$.
2. Odštejemo $45$ na obeh straneh: $-0{,}06x \ge -36$.
3. Delimo z $-0{,}06$. Število je negativno, zato se znak obrne: $x \le 600$.
4. Na premici: poln krogec pri $600$, pobarvano levo. Pot ne more biti negativna, zato velja $0 \le x \le 600$.
5. Preizkus: pri $x=600$ ostane $45-36=9$ litrov, točno dovolj. Pri $x=700$ ostanejo samo $3$ litri, premalo.
6. Odgovor: pot je lahko dolga največ $600\,\text{km}$.

Če bi pozabil obrniti znak, bi dobil $x \ge 600$. To bi pomenilo, da je kratka pot prepovedana, dolga pa dovoljena, kar je očitno nesmiselno.

### Primer 4 – zdaj ti

Reši neenačbo $5-2x<3x+15$ in rešitev nariši na številski premici.

**Podatki:** neenačba $5-2x<3x+15$
**Iščemo:** vse rešitve $x$ in zapis na premici

:::formula
Pri deljenju z negativnim številom obrni znak.
:::

**Rešitev:**

1. Člene z $x$ zberemo na levi, zato na obeh straneh odštejemo $3x$: $5-5x<15$.
2. Odštejemo $5$ na obeh straneh: $-5x<10$.
3. Dokončaj sam: deli s številom pred $x$, odloči o znaku in nariši rešitev na premici.

:::premisli
Kakšna je rešitev in kako jo narišeš?
---
Delimo z $-5$, ki je negativno, zato obrnemo znak: $x>-2$. Na premici je prazen krogec pri $-2$ (znak je strog), pobarvano je desno. Preizkus: pri $x=0$ je $5<15$, drži; pri $x=-3$ je levo $11$, desno $6$, in $11<6$ ne drži.
:::

## Pogoste napake

- **Pozabljen obrat znaka.** Učenec misli: »Neenačba je kot enačba.« Iz $-3x>12$ zapiše $x>-4$. Preizkus z $x=0$ pokaže napako: $0>12$ ne drži, $0$ pa je večje od $-4$. Pravilno: delimo z $-3$ in obrnemo znak, $x<-4$.
- **Obrat znaka ob napačnem minusu.** Učenec pri $2x>-6$ obrne znak, ker vidi negativno število na desni, in dobi $x<-3$. Znak se obrne samo pri množenju ali deljenju z negativnim številom. Tu delimo s pozitivnim $2$, zato je $x>-3$. Pri prištevanju in odštevanju se znak nikoli ne obrne.
- **Napačen krogec.** Učenec pri $x \le 5$ nariše prazen krogec, »ker je meja«. Število $5$ pa je rešitev, saj $5 \le 5$ drži. Pri $<$ in $>$ je krogec prazen, pri $\le$ in $\ge$ poln.
- **Napačna smer barvanja.** Učenec pri $-2<x$ pobarva levo, ker je znak $<$ »obrnjen v levo«. Rešitve so števila, večja od $-2$, torej desno. Preveri z enim številom, na primer $0$.
- **Zamenjava strani brez obrata.** Učenec zapiše $-2<x$ kot $x<-2$. Zamenjati strani pomeni tudi zamenjati smer znaka: $-2<x$ je isto kot $x>-2$.

## Povzetek

- Neenačba ima običajno neskončno mnogo rešitev.
- Prištevanje, odštevanje ter množenje in deljenje s pozitivnim številom ne spremenijo znaka.
- Množenje ali deljenje z **negativnim** številom **obrne** znak.
- Strogi znaki ($<$, $>$): na premici prazen krogec. Nestrogi znaki ($\le$, $\ge$): poln krogec.
- Rešitev zapišemo kot neenačbo in jo pobarvamo na številski premici.
- Rešitev preizkusimo z enim številom iz rešitve in enim zunaj nje.

## Drugače: Kot zgodba

Maja si za izlet izposodi električno kolo. Baterija je polna ($100\,\%$), na vsak kilometer porabi $4\,\%$. Maja hoče, da ji ostane vsaj $20\,\%$ za vsak primer. Zapiše:

$$100-4x \ge 20$$

Odšteje $100$ in dobi $-4x \ge -80$. Deli z $-4$ in v naglici zapiše $x \ge 20$. Brat pogleda čez ramo: »Torej lahko prevoziš $1000$ kilometrov, $5$ pa ne?« Maja preizkusi $x=5$: ostane $100-20=80\,\%$, kar je več kot $20\,\%$. Pet kilometrov je torej rešitev, njen zapis pa pravi, da ni. Spomni se: delila je z negativnim številom, znak se obrne. Pravilno je $x \le 20$.

Na koncu se spomni še, da se mora vrniti. Pot tja in nazaj je dvakrat daljša, zato je koča lahko oddaljena največ $10\,\text{km}$. Na zemljevidu v merilu $1 : 100\,000$ je $1\,\text{cm}$ enak $1\,\text{km}$, zato z ravnilom išče koče največ $10\,\text{cm}$ od izposojevalnice (po zračni črti; cesta je navadno daljša).

## Drugače: Korak za korakom s številkami

Reši $-4x+6 \ge 18$.

| Korak | Zapis | Kaj smo naredili |
|---|---|---|
| 1 | $-4x+6 \ge 18$ | začetna neenačba |
| 2 | $-4x \ge 12$ | odštejemo $6$, znak ostane |
| 3 | $x \le -3$ | delimo z $-4$, znak se obrne |
| 4 | poln krogec pri $-3$ | znak je nestrog, pobarvamo levo |

:::risba premica
opis: Številska premica od −7 do 2. Pri −3 je poln krogec, pobarvan je del premice levo od −3: to so rešitve neenačbe x ≤ −3. Pobarvani del se nadaljuje v levo brez konca.
od: -7
do: 2
interval: -7 .. -3 | x ≤ −3 | modra
točka: -3 | −3 | polno
:::

Preizkus s tremi števili:

| $x$ | $-4x+6$ | $\ge 18$? |
|---|---|---|
| $-5$ | $26$ | da |
| $-3$ | $18$ | da |
| $0$ | $6$ | ne |

Števili $-5$ in $-3$ sta v rešitvi $x \le -3$, število $0$ pa ne. Vse se ujema.

## Drugače: Bolj natančno

Zakaj se pri množenju z negativnim številom znak obrne? Neenakost $a<b$ pomeni, da je razlika $b-a$ pozitivna. Naj bo $c<0$. Potem je

$$bc-ac=(b-a)\cdot c$$

Produkt pozitivnega števila $b-a$ in negativnega števila $c$ je negativen, torej $bc-ac<0$ in $bc<ac$. Iz $a<b$ torej sledi $ac>bc$: znak se je obrnil.

Pri prištevanju je drugače: $(b+c)-(a+c)=b-a>0$, zato ostane $a+c<b+c$, ne glede na to, ali je $c$ pozitiven ali negativen.

## Preveri se

? Pri načrtovanju pohoda na zemljevidu velja: pot $d$ (v km) je lahko dolga **največ** $12\,\text{km}$. Kateri zapis to pove?
- $d<12$
~ »Največ $12$« pomeni, da je tudi točno $12\,\text{km}$ dovoljeno. Strogi znak $<$ bi $12$ izključil.
+ $d \le 12$
- $d \ge 12$
~ $d \ge 12$ pomeni »vsaj $12$«, torej $12$ ali več. Mi pa želimo $12$ ali manj.
> »Največ $12$« pomeni »manjše ali enako $12$«: $d \le 12$. Na premici je pri $12$ poln krogec.

? Kateri vrstni red korakov pravilno reši $4-2x \ge 10$?
+ Odštej $4$ → $-2x \ge 6$ → deli z $-2$ in obrni znak → $x \le -3$
- Odštej $4$ → $-2x \ge 6$ → deli z $-2$ → $x \ge -3$
~ Pri deljenju z negativnim številom $-2$ je treba znak obrniti. Preizkus z $x=0$: $4 \ge 10$ ne drži, $0$ pa je večje od $-3$.
- Prištej $2x$ → $4 \ge 10+2x$ → odštej $10$ → $-6 \ge 2x$ → deli z $2$ in obrni znak → $x \ge -3$
~ Delimo s pozitivnim $2$, zato znaka ne obrnemo. Iz $-6 \ge 2x$ sledi $-3 \ge x$, torej $x \le -3$.
> Odštejemo $4$: $-2x \ge 6$. Delimo z negativnim $-2$ in obrnemo znak: $x \le -3$. Preizkus z $x=-3$: $4+6=10 \ge 10$, drži.

? Kaj se zgodi, če obe strani neenačbe $3x>-12$ delimo s $3$?
+ Znak ostane, rešitev je $x>-4$.
- Znak se obrne, ker je $-12$ negativno, rešitev je $x<-4$.
~ Pomembno je, s katerim številom delimo, ne kakšna števila so v neenačbi. Delimo s pozitivnim $3$.
- Znak se obrne, ker se pri deljenju znak vedno obrne.
~ Znak se obrne samo pri množenju ali deljenju z negativnim številom.
> Delimo s pozitivnim številom $3$, zato znak ostane: $x>-4$. Preizkus z $x=0$: $0>-12$, drži.

? Kako na številski premici narišeš rešitev neenačbe $-3x<12$?
- prazen krogec pri $-4$, pobarvano levo
~ To je slika za $x<-4$: pri deljenju z $-3$ znak ni bil obrnjen.
- poln krogec pri $-4$, pobarvano desno
~ Znak je strog, zato $-4$ ni rešitev in krogec je prazen. Preveri: $-3\cdot(-4)=12$, $12<12$ ne drži.
+ prazen krogec pri $-4$, pobarvano desno
- prazen krogec pri $4$, pobarvano desno
~ Pri deljenju se je izgubil predznak: $\dfrac{12}{-3}=-4$, ne $4$.
> Delimo z $-3$ in obrnemo znak: $x>-4$. Znak je strog, zato prazen krogec, rešitve so desno od $-4$.

? Do koče je $40\,\text{km}$. Kolesar vozi s hitrostjo $16\,\text{km/h}$, zato mu po $t$ urah ostane $40-16t$ kilometrov. Koliko časa mora voziti, da mu ostane največ $8\,\text{km}$?
- $t \le 2$
~ Pri deljenju z $-16$ znak ni bil obrnjen. Po eni uri mu ostane še $24\,\text{km}$, kar je več kot $8$.
- $t \ge 3$
~ Število $8$ je prešlo na levo stran brez spremembe predznaka: $40+8 \le 16t$, torej $16t \ge 48$. Pravilno je $40-8 \le 16t$, torej $16t \ge 32$.
+ $t \ge 2$
> $40-16t \le 8$; odštejemo $40$: $-16t \le -32$; delimo z $-16$ in obrnemo znak: $t \ge 2$. Po $2$ urah mu ostane točno $8\,\text{km}$.

:::simboli
x | neznanka | |
a, b | števili, za kateri velja $a < b$ | |
c | število, s katerim množimo | | | $c < 0$ obrne znak neenakosti
:::
