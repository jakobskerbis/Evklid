---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tina z družino načrtuje štiridnevno potovanje po Italiji. Vsak dan se bodo odpeljali do naslednjega kampa: nekaj kilometrov po avtocesti, nato pa še $35\,\text{km}$ po ozkih obalnih cestah. Koliko meri avtocestni del, še ne vedo, zato ga Tina na zemljevidu označi kar s črko $x$.

Oče jo prosi za izraz, ki pove, koliko kilometrov bodo prevozili v štirih dneh. Tina zapiše $4 \cdot (x + 35)$. Brat Miha jo popravi: »To je isto kot $4x + 35$.«

Ima Miha prav? Odgovor se skriva v pravilu, kako odpravimo oklepaj, ko izraz množimo z vsoto. To pravilo potrebuješ povsod, kjer je oklepaj: pri ploščinah likov s stranicami, zapisanimi z izrazi, pri enačbah in pri razstavljanju, ki pride takoj za to temo.

## Razlaga

**Najprej s števili.** Recimo, da avtocestni del meri $250\,\text{km}$. Dnevna pot je $250 + 35 = 285\,\text{km}$, v štirih dneh pa $4 \cdot 285 = 1140\,\text{km}$.

Isto razdaljo lahko seštejemo tudi po delih: štirikrat avtocesta in štirikrat obalne ceste. To je $4 \cdot 250 + 4 \cdot 35 = 1000 + 140 = 1140$. Rezultat je enak, ker smo vsak del poti šteli štirikrat.

Mihov izraz pa pri $x = 250$ da $4 \cdot 250 + 35 = 1035$.

:::premisli
Miha je dobil $1035\,\text{km}$ namesto $1140\,\text{km}$. Za koliko se je zmotil in kateri del poti je izpustil?
---
Za $1140 - 1035 = 105$ kilometrov. Obalne ceste je štel le en dan namesto štiri. Manjkajo tri vožnje po $35\,\text{km}$, $3 \cdot 35 = 105$.
:::

**Posplošimo.** Kar velja za $250$, velja za vsako število $x$:

$$4 \cdot (x + 35) = 4x + 140$$

To je **zakon o razčlenjevanju** (distributivnost). Vsoto pomnožimo s številom ali izrazom tako, da z njim pomnožimo **vsak člen** vsote in produkte seštejemo:

$$a(b + c) = ab + ac \qquad a(b - c) = ab - ac$$

Izraz z enim samim členom, na primer $4$, $3x$ ali $-2ab$, je **enočlenik**. Dva enočlenika zmnožimo tako, da posebej zmnožimo koeficiente in posebej spremenljivke: $3x \cdot 2x = 6x^2$, ker je $3 \cdot 2 = 6$ in $x \cdot x = x^2$.

**Dva oklepaja, spet s števili.** Na Tininem zemljevidu je kamp kvadrat s stranico $50\,\text{m}$. Lastnik ga bo povečal: v eno smer za $20\,\text{m}$, v drugo za $10\,\text{m}$. Nova parcela meri $70\,\text{m}$ krat $60\,\text{m}$, njena ploščina pa je $70 \cdot 60 = 4200\,\text{m}^2$.

Ko razdelimo obe stranici ($70$ na $50$ in $20$, $60$ na $50$ in $10$), razpade parcela na štiri pravokotnike:

| | $50$ | $10$ |
|---|---|---|
| $50$ | $2500$ | $500$ |
| $20$ | $1000$ | $200$ |

Vsota delov je $2500 + 500 + 1000 + 200 = 4200$, enako kot prej.

**Posplošimo.** Naj ima stari kamp stranico $x$. Nova parcela meri $x + 20$ krat $x + 10$. Tabela ostane enaka, le $50$ zamenja $x$:

| | $x$ | $10$ |
|---|---|---|
| $x$ | $x^2$ | $10x$ |
| $20$ | $20x$ | $200$ |

$$(x + 20)(x + 10) = x^2 + 10x + 20x + 200$$

Na koncu združimo **podobne člene** (člene z enakim črkovnim delom): $10x + 20x = 30x$. Ploščina je $x^2 + 30x + 200$.

Izrazu z dvema členoma, kot sta $x + 20$ ali $a - 3$, pravimo **dvočlenik**. Dva dvočlenika zmnožimo tako, da vsak člen prvega pomnožimo z vsakim členom drugega:

$$(a + b)(c + d) = ac + ad + bc + bd$$

Štirje produkti so štirje deli pravokotnika. V simulaciji spodaj (Množenje izrazov s pravokotniki) spreminjaj stranici pravokotnika. Opazi, da sta dela s samim $x$ vedno dva in da se v rezultatu združita v en člen.

:::premisli
Napovej, preden računaš: ali je $(x + 3)^2$ enako $x^2 + 9$? Preveri z $x = 1$.
---
Ni. $(x + 3)^2 = (x + 3)(x + 3) = x^2 + 3x + 3x + 9 = x^2 + 6x + 9$. Pri $x = 1$ je $(1 + 3)^2 = 16$, izraz $x^2 + 9$ pa da le $10$. Na sliki manjkata dva pravokotnika $3x$.
:::

**Predznaki.** Razlika je vsota z negativnim členom: $x - 3 = x + (-3)$. Predznak zato vedno vzamemo skupaj s členom, ki mu sledi. Množimo po znanem pravilu: enaka predznaka dasta plus, različna minus.

$$(x - 3)(x + 2) = x^2 + 2x - 3x - 6 = x^2 - x - 6$$

Minus pred oklepajem pomeni množenje z $-1$. Vsem členom v oklepaju zamenja predznak: $-(4a^2 - 4a) = -4a^2 + 4a$.

## Rešeni primeri

### Primer 1 (lažji): enočlenik krat vsota

Zmnoži $3x \cdot (2x + 5)$.

**Podatki:** enočlenik $3x$, vsota $2x + 5$
**Iščemo:** produkt brez oklepaja

:::formula
$a(b + c) = ab + ac$
:::

**Rešitev:**

1. S $3x$ pomnožimo vsak člen v oklepaju: $3x \cdot 2x + 3x \cdot 5$.
2. Prvi produkt: $3 \cdot 2 = 6$ in $x \cdot x = x^2$, torej $6x^2$.
3. Drugi produkt: $3x \cdot 5 = 15x$, ker se množi samo koeficient.
4. Preizkus z $x = 1$: levo $3 \cdot (2 + 5) = 21$, desno $6 + 15 = 21$.
5. Odgovor: $3x \cdot (2x + 5) = 6x^2 + 15x$.

### Primer 2: dvočlenika z minusom

Zmnoži in poenostavi $(x + 5)(x - 4)$.

**Podatki:** dvočlenika $x + 5$ in $x - 4$
**Iščemo:** poenostavljen produkt

:::formula
$(a + b)(c + d) = ac + ad + bc + bd$
:::

**Rešitev:**

1. $x$ pomnožimo z obema členoma drugega oklepaja: $x \cdot x + x \cdot (-4) = x^2 - 4x$.
2. $5$ pomnožimo z obema členoma: $5 \cdot x + 5 \cdot (-4) = 5x - 20$, ker plus krat minus da minus.
3. Zapišemo vse štiri produkte: $x^2 - 4x + 5x - 20$.
4. Združimo podobna člena: $-4x + 5x = x$, dobimo $x^2 + x - 20$.
5. Preizkus z $x = 2$: levo $(2 + 5)(2 - 4) = -14$, desno $4 + 2 - 20 = -14$.
6. Odgovor: $(x + 5)(x - 4) = x^2 + x - 20$.

### Primer 3 (težji): zemljevid z legendo

Turistični zemljevid Pirana je pravokotnik s stranicama $(x + 8)\,\text{cm}$ in $(x + 5)\,\text{cm}$. V kotu je legenda, pravokotnik s stranicama $x\,\text{cm}$ in $3\,\text{cm}$. Zapiši ploščino lista brez legende kot izraz brez oklepajev. Koliko meri pri $x = 20$?

**Podatki:** stranici lista $(x + 8)\,\text{cm}$ in $(x + 5)\,\text{cm}$; legenda $x\,\text{cm}$ krat $3\,\text{cm}$; $x = 20$
**Iščemo:** ploščino $p$ brez legende (izraz in vrednost)

:::formula
$p = (x + 8)(x + 5) - 3x$
:::

**Rešitev:**

1. Ploščina celega lista, vsak člen z vsakim: $(x + 8)(x + 5) = x^2 + 5x + 8x + 40 = x^2 + 13x + 40$.
2. Odštejemo ploščino legende $3x$: $x^2 + 13x + 40 - 3x = x^2 + 10x + 40$.
3. Vstavimo $x = 20$: $20^2 + 10 \cdot 20 + 40 = 400 + 200 + 40 = 640$.
4. Preizkus brez izraza: list meri $28 \cdot 25 = 700\,\text{cm}^2$, legenda $20 \cdot 3 = 60\,\text{cm}^2$, razlika $700 - 60 = 640$.
5. Odgovor: za zemljevid ostane $(x^2 + 10x + 40)\,\text{cm}^2$, pri $x = 20$ je to $640\,\text{cm}^2$.

### Primer 4: zdaj ti

Zmnoži in poenostavi $(2a - 3)(a + 5) - 4a(a - 1)$.

**Podatki:** izraz $(2a - 3)(a + 5) - 4a(a - 1)$
**Iščemo:** poenostavljen izraz

:::formula
Vsak člen z vsakim: $(m + n)(k + l) = mk + ml + nk + nl$; minus pred oklepajem: $-(m - n) = -m + n$
:::

**Rešitev:**

1. Prvi produkt, vsak člen z vsakim: $2a \cdot a + 2a \cdot 5 - 3 \cdot a - 3 \cdot 5 = 2a^2 + 10a - 3a - 15$.
2. Združimo: $2a^2 + 7a - 15$.
3. Drugi produkt: $4a(a - 1) = 4a^2 - 4a$.
4. Pred njim je minus, zato obema členoma zamenjamo predznak: $-4a^2 + 4a$.
5. Zdaj ti: v izrazu $2a^2 + 7a - 15 - 4a^2 + 4a$ združi podobne člene.

:::premisli
Kaj dobiš? Rezultat preveri še z $a = 2$.
---
$-2a^2 + 11a - 15$, ker je $2a^2 - 4a^2 = -2a^2$ in $7a + 4a = 11a$. Preizkus z $a = 2$: levo $(4 - 3)(2 + 5) - 8 \cdot 1 = -1$, desno $-8 + 22 - 15 = -1$.
:::

## Pogoste napake

- **Pomnožen le prvi člen.** »$4(x + 35) = 4x + 35$.« Število pred oklepajem pomnoži celo vsoto, torej vsak njen del, sicer del poti izgubiš. Popravek: od števila pred oklepajem nariši lok do vsakega člena; lokov mora biti toliko, kot je členov.
- **Samo prvi s prvim in zadnji z zadnjim.** »$(x + 3)(x + 4) = x^2 + 12$.« Tako dobiš le dva od štirih delov pravokotnika, manjkata $4x$ in $3x$. Popravek: pri dveh dvočlenikih preštej produkte, biti morajo štirje. Ista napaka je »$(x + 3)^2 = x^2 + 9$«.
- **Izgubljen minus.** »Zadnji člen produkta $(x - 3)(x + 2)$ je $+6$.« Ni, ker je $-3 \cdot 2 = -6$. Popravek: predznak prepiši skupaj s členom, šele nato množi.
- **Minus pred oklepajem zamenja le prvi predznak.** »$5 - (x - 3) = 5 - x - 3$.« Odšteti moraš celoten oklepaj, zato se zamenjajo vsi predznaki: $5 - x + 3 = 8 - x$. Popravek: najprej prepiši oklepaj z obrnjenimi predznaki, nato računaj.
- **Združevanje nepodobnih členov.** »$x^2 + 7x = 8x^2$« ali »$x \cdot x = 2x$«. Člena $x^2$ in $x$ nista podobna, $x \cdot x$ pa je $x^2$. Popravek: seštevaš le člene z enakim črkovnim delom.

## Povzetek

- Vsota krat enočlenik: $a(b + c) = ab + ac$; pomnožimo vsak člen v oklepaju.
- Enočlenika množimo tako, da posebej množimo koeficiente in posebej spremenljivke: $3x \cdot 2x = 6x^2$.
- Dvočlenik krat dvočlenik: $(a + b)(c + d) = ac + ad + bc + bd$ (vsak člen z vsakim, štirje produkti).
- Na sliki: pravokotnik s stranicama $a + b$ in $c + d$ razpade na štiri dele.
- Predznak spada k členu za njim; minus pred oklepajem zamenja predznake vseh členov.
- Na koncu združimo podobne člene in rezultat preverimo z vstavljanjem števila.

## Drugače: Z analogijo

Množenje dvočlenikov je kot štetje poti na zemljevidu. Iz Ljubljane do Kopra lahko greš po $2$ različnih cestah ali z $1$ vlakom. Iz Kopra do Pirana te pelje $3$ avtobusne linije, lahko pa izbereš še eno od $2$ kolesarskih poti.

Vsako izbiro za prvi del poti lahko združiš z vsako izbiro za drugi del. Vseh poti je zato $(2 + 1)(3 + 2) = 15$.

Poti lahko preštejemo tudi po skupinah:

- cesta, nato avtobus: $2 \cdot 3 = 6$
- cesta, nato kolo: $2 \cdot 2 = 4$
- vlak, nato avtobus: $1 \cdot 3 = 3$
- vlak, nato kolo: $1 \cdot 2 = 2$

Skupaj $6 + 4 + 3 + 2 = 15$. Tudi če bi bilo cest $a$, vlakov $b$, avtobusov $c$ in kolesarskih poti $d$, bi bile skupine iste: $ac + ad + bc + bd$. Kdor eno skupino izpusti, pozabi nekaj poti, tako kot pri množenju pozabi člen.

## Drugače: Bolj natančno

Pravilo za dvočlenike izhaja iz razčlenjevanja. Oklepaj $(c + d)$ označimo z eno črko, $m = c + d$. Potem je

$$(a + b) \cdot m = a \cdot m + b \cdot m.$$

Nazaj vstavimo $m = c + d$ in še enkrat razčlenimo:

$$a(c + d) + b(c + d) = ac + ad + bc + bd.$$

Isti zakon smo uporabili dvakrat: najprej za cel oklepaj, nato za vsak del posebej. Zato pravilo »vsak z vsakim« velja za vsa števila, ne le za tista, s katerimi smo ga preizkusili.

Ker je $a - b = a + (-b)$, pravilo velja tudi za razlike, le predznak ostane pri členu. Pri treh členih v enem oklepaju je produktov $2 \cdot 3 = 6$, pravilo pa je isto.

## Preveri se

? Kateri izraz **ni** enak $2(x + 5)$?
- $2x + 10$
~ Ta je enak: z $2$ pomnožimo oba člena, $2 \cdot x$ in $2 \cdot 5$.
+ $2x + 5$
- $(x + 5) + (x + 5)$
~ Ta je enak: dvakrat vsota je vsota, prišteta sama sebi, kar da $2x + 10$.
- $10 + 2x$
~ Ta je enak: le vrstni red členov je drugačen, seštevanje pa je zamenljivo.
> V $2x + 5$ je z $2$ pomnožen samo prvi člen. Pravilno je $2x + 10$.

? Ko zmnožiš $(x + 4)(x + 6)$, dobiš $x^2 + bx + 24$. Koliko je $b$?
- $24$
~ $24$ je produkt $4 \cdot 6$, to je zadnji člen. Člen z $x$ nastane iz $x \cdot 6$ in $4 \cdot x$.
+ $10$
- $0$
~ Tako bi bilo, če bi množil le prvi s prvim in zadnji z zadnjim. Manjkata produkta $6x$ in $4x$.
- $2$
~ To je razlika $6 - 4$. Oba produkta, $6x$ in $4x$, imata plus, zato ju seštejemo.
> $x \cdot 6 + 4 \cdot x = 6x + 4x = 10x$, torej je $b = 10$.

? Kvadratno igrišče ob kampu ima stranico $x$. Obe stranici podaljšajo za $3$. Za koliko se zaradi tega poveča ploščina igrišča?
- za $9$
~ To je le kvadratek v kotu, $3 \cdot 3$. Pozabil si oba pravokotnika ob straneh, kot pri napaki $(x + 3)^2 = x^2 + 9$.
- za $3x + 9$
~ Upošteval si le en pravokotnik ob strani. Podaljšani sta obe stranici, zato sta pravokotnika $3x$ dva.
+ za $6x + 9$
- za $6x$
~ Pravokotnika ob straneh si upošteval, pozabil pa si kvadratek $3 \cdot 3$ v kotu.
> $(x + 3)(x + 3) = x^2 + 3x + 3x + 9 = x^2 + 6x + 9$. Od tega je $x^2$ staro igrišče, povečanje je $6x + 9$.

? Luka računa $4 - 3(x - 2)$. Korak 1: $4 - 3x - 6$. Korak 2: $-2 - 3x$. Kateri korak je napačen?
+ Korak 1: $-3 \cdot (-2)$ je $+6$, ne $-6$.
- Korak 2: $4 - 6$ ni $-2$.
~ $4 - 6$ je res $-2$. Korak 2 je pravilno izračunan iz koraka 1, napaka je prej.
- Noben, rezultat je pravilen.
~ Preizkus z $x = 0$: prvotni izraz da $4 + 6 = 10$, Lukov rezultat pa $-2$. Nekje je napaka.
- Korak 1: $3$ bi moral pomnožiti le $x$.
~ Število pred oklepajem pomnoži vsak člen v oklepaju, tudi $-2$.
> Pred oklepajem je $-3$: $-3 \cdot x = -3x$ in $-3 \cdot (-2) = +6$. Pravilno je $4 - 3x + 6 = 10 - 3x$.

? Na izlet v Postojno gre $n$ učencev in $2$ učitelja. Vsak plača vstopnico $c$ evrov in $4$ evre za avtobus. Kateri izraz pove, koliko plačajo vsi skupaj?
+ $nc + 4n + 2c + 8$
- $nc + 8$
~ Pomnožil si le prvi s prvim in zadnji z zadnjim. Učenci plačajo tudi avtobus ($4n$), učitelja pa tudi vstopnico ($2c$).
- $nc + 4n + 2$
~ Učitelja si le prištel. Tudi onadva plačata vstopnico in avtobus: $2c + 8$.
- $n + 2c + 8$
~ Učence si le prištel, nisi pa pomnožil njihovega števila s ceno $c + 4$.
> Oseb je $n + 2$, vsaka plača $c + 4$ evrov: $(n + 2)(c + 4) = nc + 4n + 2c + 8$.

:::simboli
x | neznana dolžina | | | avtocestni del poti, stranica kampa ali zemljevida
a, b, c, d | poljubna števila (členi) | | | vsak člen prvega oklepaja z vsakim drugega
m, n, k, l | poljubna števila (členi) | | | minus pred oklepajem: −(m − n) = −m + n
p | ploščina zemljevida brez legende | p = (x + 8)(x + 5) - 3x |
:::
