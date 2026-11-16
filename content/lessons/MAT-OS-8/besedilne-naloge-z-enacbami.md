---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V trgovini kupiš tri enake zvezke in en svinčnik za 1,20 €. Plačaš 7,20 €. Koliko stane en zvezek? Verjetno boš to izračunal kar na pamet: od 7,20 € odšteješ svinčnik in ostanek razdeliš na tri dele, torej zvezek stane 2 €. Ko pa so podatki bolj prepleteni (starosti, ki se s časom spreminjajo, stranice, ki so odvisne ena od druge), ugibanje ne gre več.

Linearne enačbe že znaš reševati. Zdaj se naučiš drugega, pogosto težjega dela: kako iz besedila **sestaviš** enačbo. To je most med matematiko in resničnim svetom. Inženirji, ekonomisti in fiziki vsak dan prevajajo opise v enačbe.

## Razlaga

**1. Iz besed v izraze.** Besedilna naloga je zgodba, v kateri je eno število neznano. To število označimo s črko, najpogosteje z $x$, in mu rečemo **neznanka**. Druge količine iz zgodbe zapišemo z **izrazi**, ki vsebujejo $x$.

Recimo, da ima Ana $x$ evrov. Tabela kaže, kako besedne zveze prevedeš v izraze:

| Besedilo | Izraz za Bora |
|---|---|
| Bor ima za $5$ evrov več kot Ana. | $x + 5$ |
| Bor ima za $5$ evrov manj kot Ana. | $x - 5$ |
| Bor ima trikrat toliko kot Ana. | $3x$ |
| Bor ima pol toliko kot Ana. | $\dfrac{x}{2}$ |

Pazi na razliko: »za $3$ več« pomeni prištevanje ($x + 3$), »trikrat toliko« (pogovorno tudi »trikrat več«) pa množenje ($3x$).

:::premisli
Bor ima za $5$ evrov manj kot Ana, ki ima $x$ evrov. Sošolec zapiše $5 - x$. Zakaj to ni prav?
---
Od Aninega denarja moraš odvzeti $5$, torej $x - 5$. Izraz $5 - x$ pomeni, da od $5$ odvzameš Anin denar. Če ima Ana $20$ evrov, ima Bor $15$ evrov, izraz $5 - 20$ pa da $-15$.
:::

**2. Od izrazov do enačbe.** Enačba nastane, ko v besedilu najdeš stavek, ki pove, da sta dve količini **enaki**. Take stavke pogosto prepoznaš po besedah »je«, »dobimo«, »skupaj imata«, »meri«. Ta stavek zapišeš z enačajem.

Primer: »Ana in Bor imata skupaj $36$ evrov. Bor ima trikrat toliko kot Ana.« Izraza sta $x$ (Ana) in $3x$ (Bor). Enakost pove stavek »skupaj imata $36$«:

$$x + 3x = 36$$

En pogoj iz besedila (»trikrat toliko«) smo porabili za izraz $3x$, drugega (»skupaj $36$«) za enačbo.

**3. Postopek v šestih korakih.**

1. Preberi besedilo in ugotovi, kaj iščeš.
2. Izberi neznanko in zapiši, kaj pomeni, npr. $x$ … Anin denar v evrih.
3. Druge količine izrazi z $x$.
4. Poišči enakost in zapiši enačbo.
5. Reši enačbo.
6. Naredi preizkus **v besedilu** in odgovori s celim stavkom.

V našem primeru: $4x = 36$, zato $x = 9$. Ana ima $9$ evrov, Bor $27$ evrov. Preizkus: $9 + 27 = 36$ in $27 = 3 \cdot 9$. Oba pogoja iz besedila veljata.

Preizkus delamo v besedilu, ne le v enačbi. Če si enačbo sestavil napačno, bo njena rešitev preizkus v tej isti enačbi prestala, besedila pa ne bo izpolnila.

:::premisli
Pri nalogi o številu učencev v razredu dobiš $x = 24{,}5$. Kaj to pomeni?
---
Število učencev mora biti naravno število, zato $24{,}5$ ni smiseln odgovor. Najverjetneje si se zmotil pri sestavljanju ali reševanju enačbe, zato preveri vsak korak. Če je vse prav, naloga nima rešitve. Rešitev enačbe mora vedno ustrezati tudi pomenu v besedilu.
:::

**4. Preizkusi v simulaciji.** V simulaciji spodaj (»Od besedila do enačbe«) izberi »Vsota dveh števil« in nastavi »x (skrito)« na $9$, »kolikokrat« na $3$ in »za koliko več« na $0$. Dobiš nalogo o Ani in Boru z vsoto $36$. Preden pogledaš enačbo pod trakom, jo zapiši sam. Nato nastavi »za koliko več« na $4$. Opazi: na traku se pojavi košček $4$, v enačbi člen $+\,4$ ($4x + 4 = 40$), število trakov $x$ pa ostane $4$.

## Rešeni primeri

### Primer 1 (lažji)

Mislim si število. Če ga potrojim in rezultatu prištejem $7$, dobim $34$. Katero število si mislim?

**Podatki:** število potrojimo, nato prištejemo $7$; rezultat je $34$
**Iščemo:** mišljeno število $x$

:::formula
Operacije zapišemo v istem vrstnem redu kot v besedilu: $3x + 7 = 34$
:::

**Rešitev:**

1. Neznanka: $x$ … mišljeno število. Zakaj: prav to število iščemo.
2. »Potrojim« da $3x$, »prištejem $7$« da $3x + 7$. Zakaj: sledimo vrstnemu redu iz besedila.
3. »Dobim $34$« je enakost: $3x + 7 = 34$.
4. Na obeh straneh odštejemo $7$: $3x = 27$. Delimo s $3$: $x = 9$.
5. Preizkus v besedilu: $9 \cdot 3 = 27$ in $27 + 7 = 34$. Drži.
6. Odgovor: mislim si število $9$.

### Primer 2 (srednji)

Obseg pravokotnika je $54\,\text{cm}$. Dolžina je za $7\,\text{cm}$ daljša od širine. Koliko merita stranici?

**Podatki:** $o = 54\,\text{cm}$, dolžina $a$ je za $7\,\text{cm}$ daljša od širine $b$
**Iščemo:** dolžino $a$ in širino $b$

:::formula
Obseg pravokotnika: $o = 2a + 2b$
:::

**Rešitev:**

1. Neznanka: $x$ … širina v cm. Zakaj širina: dolžino potem preprosto izrazimo, $a = x + 7$.
2. Obseg je vsota vseh štirih stranic, zato: $2(x + 7) + 2x = 54$.
3. Odpravimo oklepaj: $2x + 14 + 2x = 54$. Združimo podobne člene: $4x + 14 = 54$.
4. Odštejemo $14$: $4x = 40$. Delimo s $4$: $x = 10$.
5. Širina je $10\,\text{cm}$, dolžina $10 + 7 = 17\,\text{cm}$. Zakaj ta korak: naloga sprašuje po obeh stranicah.
6. Preizkus: $17 - 10 = 7$ in $2 \cdot 17 + 2 \cdot 10 = 54$. Oba pogoja držita.
7. Odgovor: pravokotnik je dolg $17\,\text{cm}$ in širok $10\,\text{cm}$.

### Primer 3 (težji)

Oče je trikrat starejši od sina. Čez $12$ let bo le dvakrat starejši od sina. Koliko sta stara danes?

**Podatki:** danes je oče $3$-krat starejši od sina; čez $12$ let bo $2$-krat starejši; čas $12$ let
**Iščemo:** današnjo starost sina in očeta

:::formula
Čez $t$ let je **vsak** starejši za $t$ let. Pogoj čez $12$ let: (oče $+ 12$) $= 2 \cdot$ (sin $+ 12$)
:::

**Rešitev:**

1. Neznanka: $x$ … sinova današnja starost v letih. Oče je danes star $3x$.
2. Starosti uredimo v tabelo. Zakaj: tako ne pozabimo, da se postarata oba.

| | danes | čez 12 let |
|---|---|---|
| sin | $x$ | $x + 12$ |
| oče | $3x$ | $3x + 12$ |

3. Drugi pogoj velja za desni stolpec: $3x + 12 = 2(x + 12)$. Oklepaj je nujen, ker podvojimo celotno sinovo starost.
4. Odpravimo oklepaj: $3x + 12 = 2x + 24$.
5. Odštejemo $2x$ in $12$: $x = 12$. Oče je star $3 \cdot 12 = 36$ let.
6. Preizkus v besedilu: danes $36 = 3 \cdot 12$. Čez $12$ let bo oče star $48$, sin $24$ let, in $48 = 2 \cdot 24$. Drži.
7. Odgovor: sin je star $12$ let, oče $36$ let.

### Primer 4: zdaj ti

Vsota treh zaporednih naravnih števil je $72$. Katera so ta števila? (**Zaporedna** naravna števila si sledijo brez vrzeli, na primer $7$, $8$, $9$.)

**Podatki:** tri zaporedna naravna števila, njihova vsota je $72$
**Iščemo:** vsa tri števila

:::formula
Zaporedna števila: $x$, $\;x + 1$, $\;x + 2$
:::

**Rešitev:**

1. Neznanka: $x$ … najmanjše število. Naslednji sta $x + 1$ in $x + 2$, ker se zaporedni števili razlikujeta za $1$.
2. Enačba: $x + (x + 1) + (x + 2) = 72$, po združevanju $3x + 3 = 72$.
3. Enačbo reši sam in zapiši vsa tri števila.

:::premisli
Katera tri števila dobiš?
---
$3x = 69$, $x = 23$. Števila so $23$, $24$ in $25$. Preizkus: $23 + 24 + 25 = 72$.
:::

## Pogoste napake

- **Obrnjeno odštevanje.** »Bor ima za $5$ manj kot Ana« zapišeš kot $5 - x$. To je napačno, ker od Aninega zneska odvzamemo $5$, ne obratno. Popravek: $x - 5$. Preveri z enim številom: če ima Ana $20$, mora imeti Bor $15$.
- **»Za 3 več« in »trikrat toliko« zamenjaš.** Zapišeš $3x$ namesto $x + 3$ ali obratno. »Za« pomeni prištevanje ali odštevanje, »-krat« pa množenje. Popravek: preveri izraz z enim številom.
- **Manjkajoč oklepaj.** »Število zmanjšamo za $4$ in rezultat podvojimo« zapišeš kot $2x - 4$. Tako najprej podvojiš in šele nato odšteješ. Popravek: $2(x - 4)$; oklepaj ohrani vrstni red iz besedila. Enako pri starostih: pravilno je $2(x + 12)$, ne $2x + 12$.
- **Čas prišteješ le eni osebi.** Pri starostih zapišeš $3x + 12 = 2x$, kot da se sin ne postara. Čez $12$ let je vsak starejši za $12$. Popravek: tabela »danes, čez $t$ let« za vsako osebo.
- **Odgovor je samo $x$.** Ko dobiš $x = 10$, napišeš le širino, čeprav naloga sprašuje po obeh stranicah. Popravek: preberi vprašanje še enkrat in iz $x$ izračunaj vse iskane količine.

## Povzetek

- Neznanka ($x$) je količina, ki jo iščemo; vedno zapiši, kaj pomeni in v kateri enoti.
- »Za $a$ več / manj« pomeni $x + a$ / $x - a$; »$a$-krat toliko« pomeni $a \cdot x$.
- Kadar operacija velja za cel rezultat, uporabi oklepaj: $2(x - 4)$.
- En pogoj iz besedila porabiš za izražanje drugih količin, drugega za enačbo.
- Postopek: neznanka, izrazi, enačba, rešitev, preizkus v besedilu, odgovor v stavku.
- Pri starostih se čez $t$ let vsak postara za $t$ let.
- Rešitev mora biti smiselna (naravno število ljudi, pozitivna dolžina).

## Drugače: Na sliki

Količine si lahko predstaviš s **trakovi** enake dolžine. En trak pomeni neznanko $x$.

:::risba skica
opis: Trakovi enake dolžine, vsak pomeni x. Ana ima en trak, Bor tri trakove, skupaj so štirje trakovi, ki merijo 36.
območje: 0; 0 .. 9; 3,3
napis: 0,1; 2,7 | Ana: | desno
napis: 0,1; 1,65 | Bor: | desno
napis: 0,1; 0,6 | Skupaj: | desno
pravokotnik: 2; 2,35 .. 3; 3,05
pravokotnik: 2; 1,3 .. 3; 2 | oranžna
pravokotnik: 3; 1,3 .. 4; 2 | oranžna
pravokotnik: 4; 1,3 .. 5; 2 | oranžna
pravokotnik: 2; 0,25 .. 3; 0,95
pravokotnik: 3; 0,25 .. 4; 0,95 | oranžna
pravokotnik: 4; 0,25 .. 5; 0,95 | oranžna
pravokotnik: 5; 0,25 .. 6; 0,95 | oranžna
napis: 2,5; 2,7 | x
napis: 2,5; 1,65 | x
napis: 3,5; 1,65 | x
napis: 4,5; 1,65 | x
napis: 2,5; 0,6 | x
napis: 3,5; 0,6 | x
napis: 4,5; 0,6 | x
napis: 5,5; 0,6 | x
napis: 6,1; 0,6 | = 36 | desno | debelo
:::

Bor ima trikrat toliko kot Ana, zato ima tri trakove. Skupaj so štirje trakovi, ki merijo $36$. En trak je torej $36 : 4 = 9$. To je natanko enačba $4x = 36$.

Pri pravokotniku iz primera 2 si nariši obe stranici kot trakova. Dolžina je trak $x$ in še košček $7$. Obseg sestavljajo štirje trakovi $x$ in dva koščka $7$, kar je $4x + 14 = 54$. Slika ti pomaga, da ne pozabiš nobenega dela.

## Drugače: Iz vsakdanjega življenja

Taksi zaračuna 3 € ob vstopu in 1,20 € za vsak prevožen kilometer. Za vožnjo si plačal 15 €. Koliko kilometrov si prevozil?

Razmišljaj kot pri računu v trgovini. Del zneska je stalen (3 €), del pa je odvisen od kilometrov. Če z $x$ označiš število kilometrov, je cena

$$3 + 1{,}2x = 15$$

Odšteješ stalni del: $1{,}2x = 12$, nato deliš: $x = 10$. Prevozil si $10\,\text{km}$.

Takšne enačbe so skrite v mnogih računih: naročnina za telefon in cena na minuto, vstopnina za bazen in cena na uro, dostava in cena na kos. Vedno je en del stalen, drugi pa raste z neznanko.

## Drugače: Korak za korakom s številkami

Če ne veš, kako začeti, enačbo »odkrij« s poskušanjem. Vzemi pravokotnik iz primera 2 (dolžina za $7\,\text{cm}$ daljša od širine) in poskusi nekaj širin:

| širina $b$ | dolžina $a$ | obseg $o$ |
|---|---|---|
| $8$ | $15$ | $46$ |
| $9$ | $16$ | $50$ |
| $10$ | $17$ | $54$ |

Kako si izračunal obseg? Vsakič enako: $2 \cdot (b + 7) + 2 \cdot b$. Ko širino zamenjaš z $x$, dobiš izraz $2(x + 7) + 2x$, in ker mora biti obseg $54$, dobiš enačbo.

Opazi še: ko se širina poveča za $1$, se obseg poveča za $4$. To je koeficient $4$ v enačbi $4x + 14 = 54$. Poskušanje ti torej pokaže, kako enačba nastane; reševanje enačbe pa je hitrejše, ker ne ugibaš.

## Drugače: Bolj natančno

Neznanka ima vedno **smiselne vrednosti**: število ljudi je naravno število, dolžina je pozitivna. Rešitev enačbe, ki tega ne izpolnjuje, ni rešitev naloge.

Kot neznanko lahko izbereš katerokoli iskano količino; rezultat bo enak, enačba pa morda težja. Pri očetu in sinu vzemi $y$ … očetova starost. Sin je star $\dfrac{y}{3}$ in čez $12$ let velja:

$$y + 12 = 2\left(\frac{y}{3} + 12\right)$$

Odpraviš oklepaj: $y + 12 = \dfrac{2y}{3} + 24$, zato $\dfrac{y}{3} = 12$ in $y = 36$. Dobiš isto, a z ulomki. Zato za neznanko izberi količino, s katero se druge izrazijo brez ulomkov.

Pri eni neznanki potrebuješ toliko pogojev, da lahko zapišeš eno enačbo. Če pogoj manjka (na primer samo »oče je trikrat starejši«), ima naloga neskončno mnogo rešitev.

## Preveri se

? Kaj narediš na koncu, ko rešiš enačbo iz besedilne naloge?
- Nič več, rešitev enačbe je že odgovor.
~ Rešitev $x$ je le število. Pogosto naloga sprašuje še po drugih količinah, rešitev pa mora tudi ustrezati besedilu.
- Rešitev vstavim v enačbo.
~ Če je enačba napačno sestavljena, bo preizkus v njej vseeno uspel. Preverjati moraš pogoje iz besedila.
+ Preverim rešitev v besedilu in odgovorim s celim stavkom.
> Preizkus v besedilu odkrije tudi napako pri sestavljanju enačbe. Odgovor v stavku poskrbi, da navedeš vse iskane količine.

? Število $x$ zmanjšamo za $4$ in rezultat podvojimo. Kateri izraz to opisuje?
- $2x - 4$
~ Tu najprej podvojiš in šele nato odšteješ. Ker podvojimo rezultat, potrebuješ oklepaj.
+ $2(x - 4)$
- $4 - 2x$
~ Obrnil si odštevanje. Od števila odštejemo $4$, ne obratno.
> Najprej $x - 4$, nato celoten rezultat pomnožimo z $2$: $2(x - 4)$.

? Oče je danes $4$-krat starejši od sina, ki je star $x$ let. Čez $5$ let bo $3$-krat starejši. Katera enačba to opisuje?
- $4x + 5 = 3x + 5$
~ Manjka oklepaj: $3$-krat moraš vzeti celotno sinovo starost čez $5$ let, torej $3(x + 5)$.
- $4x = 3(x + 5)$
~ Postaral si le sina. Čez $5$ let je tudi oče star $4x + 5$.
+ $4x + 5 = 3(x + 5)$
> Čez $5$ let sta oba starejša za $5$. Rešitev je $x = 10$: sin $10$ let, oče $40$ let, čez $5$ let $45 = 3 \cdot 15$.

? Mislim si število. Če mu prištejem $8$ in vsoto razpolovim, dobim $11$. Katero število si mislim?
- $6$
~ Zapisal si $\dfrac{x}{2} + 8 = 11$, torej si najprej razpolovil. Razpolovimo vsoto: $\dfrac{x + 8}{2} = 11$.
- $30$
~ Pri obratnem računanju si $8$ prištel namesto odštel: $22 + 8$. Pravilno je $22 - 8$.
+ $14$
> $\dfrac{x + 8}{2} = 11$, zato $x + 8 = 22$ in $x = 14$. Preizkus: $14 + 8 = 22$, polovica je $11$.

? Dolžina pravokotnika je dvakrat daljša od širine, obseg je $36\,\text{cm}$. Kolikšna je širina?
- $9\,\text{cm}$
~ Obseg si delil s $4$, kot da je pravokotnik kvadrat. Stranici nista enaki.
- $12\,\text{cm}$
~ V enačbo si zapisal le dve stranici ($x + 2x = 36$) ali pa navedel dolžino. Obseg je vsota vseh štirih stranic.
+ $6\,\text{cm}$
> Širina $x$, dolžina $2x$: $2 \cdot 2x + 2x = 36$, $6x = 36$, $x = 6$. Širina je $6\,\text{cm}$, dolžina $12\,\text{cm}$.

:::simboli
x | neznanka | | | število, ki ga iščemo
y | očetova starost (neznanka) | | | sin je star y/3
o | obseg pravokotnika | o = 2a + 2b |
a | dolžina pravokotnika | | | za 7 cm daljša od širine
b | širina pravokotnika | |
t | število let (»čez t let«) | | | vsak je čez t let starejši za t
:::
