---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Učiteljica glasbe napiše na tablo uganko: »Skladbo sem razdelila na $4$ enako dolge kitice. Vsaka ima $8$ taktov. Koliko taktov ima cela skladba?« Nato doda: »V zapisu uganke bo deljenje, a do odgovora pridete z množenjem. In odgovor bo večji od vseh števil, ki jih vidite.«

Zveni narobe. Kako lahko deljenje pripelje do večjega števila? Zapišimo uganko: neznano število taktov razdelimo na $4$ dele in dobimo $8$. Če z $x$ označimo število taktov, je to $x : 4 = 8$. Odgovor je $32$ taktov, ker je $32 : 4 = 8$. Učiteljica je imela prav.

Takemu zapisu rečemo enačba. Z njo najdeš neznano število, ko poznaš rezultat računa: koliko skladb je na seznamu, koliko taktov ima pesem, koliko stane ena struna.

## Razlaga

Začnimo z mislijo, ki se ponudi skoraj vsakemu. V zapisu $x + 5 = 12$ vidiš plus, zato seštej: $5 + 12 = 17$. Je $x = 17$?

Preveri. Namesto $x$ vstavi $17$: $17 + 5 = 22$. To ni $12$. Misel »naredi, kar piše« je torej napačna. Kaj gre narobe?

**Enačba** je zapis, v katerem sta dva izraza povezana z znakom $=$, v enem pa je **neznanka**, črka za neznano število (navadno $x$). Znak $=$ pomeni, da imata obe strani enako vrednost. Enačba je kot tehtnica v ravnovesju:

```
   [ x ] + 5 kroglic   |   12 kroglic
  ────────────────────┴────────────────────
              ravnovesje
```

**Rešitev enačbe** je število, ki ga vstaviš namesto neznanke, da obe strani dasta isto. Plus v enačbi ne pove, kaj moraš narediti ti. Pove, kaj se je zgodilo z neznanim številom: nekdo mu je prištel $5$ in dobil $12$.

**Sklepanje.** Da najdeš neznano število, greš nazaj. Če je nekdo prištel $5$ in dobil $12$, mu $5$ odvzemi: $x = 12 - 5 = 7$. Na tehtnici z obeh strani odvzameš $5$ kroglic in ravnovesje ostane. Tako uporabiš **obratno računsko operacijo**: seštevanje in odštevanje sta obratni, prav tako množenje in deljenje.

| v enačbi | obratno | primer |
|---|---|---|
| $+$ | $-$ | $x + 5 = 12$, $x = 12 - 5 = 7$ |
| $-$ | $+$ | $x - 4 = 9$, $x = 9 + 4 = 13$ |
| $\cdot$ | $:$ | $3 \cdot x = 18$, $x = 18 : 3 = 6$ |
| $:$ | $\cdot$ | $x : 4 = 8$, $x = 8 \cdot 4 = 32$ |

Zadnja vrstica razloži uganko iz uvoda.

:::premisli
Pri $x - 4 = 9$ napovej, preden računaš: bo rešitev večja ali manjša od $9$? Zakaj?
---
Večja. Od neznanega števila smo vzeli $4$ in ostalo jih je še $9$, torej jih je bilo prej več: $x = 9 + 4 = 13$.
:::

**Preizkus.** Vsako rešitev vstavi v prvotno enačbo in izračunaj obe strani. Pri $x = 7$: leva stran $7 + 5 = 12$, desna stran $12$. Enaki sta, rešitev je prava. Prav preizkus je razkril, da $17$ ni rešitev.

**Preizkušanje.** Včasih sklepanje ni očitno, na primer pri $3 \cdot x + 2 = 20$. Tedaj vstavljaš števila in gledaš, kdaj se strani ujemata:

| $x$ | $3 \cdot x + 2$ | enako $20$? |
|---|---|---|
| $4$ | $14$ | premalo |
| $5$ | $17$ | premalo |
| $6$ | $20$ | da |

Rešitev je $x = 6$. Pametno preizkušanje ne ugiba na slepo. Iz vsakega poskusa razbereš, v katero smer naprej.

:::premisli
Pri $3 \cdot x + 2 = 20$ si poskusil $x = 4$ in dobil $14$. Ali naj naslednjič poskusiš večje ali manjše število? Zakaj?
---
Večje. Leva stran ($14$) je premajhna, z večjim $x$ pa leva stran raste, ker $3 \cdot x$ postane večje.
:::

V simulaciji spodaj (»Enačba kot tehtnica«) je na tehtnici enačba $2 \cdot x + 3 = 11$ (tam zapisana kot $2x + 3 = 11$). Z drsnikom »preizkusi x =« poišči $x$, pri katerem je tehtnica v ravnovesju. Nato z obeh strani odvzemi po $1$ in opazuj, da tehtnica ostane v ravnovesju. Premisli, kaj bi se zgodilo, če bi odvzel le z ene strani.

## Rešeni primeri

### Primer 1: seznam skladb

Maja je imela na seznamu za zabavo nekaj skladb. Dodala je še $5$ in zdaj jih ima $17$. Koliko skladb je imela na začetku?

**Podatki:** dodala je $5$ skladb, skupaj jih je $17$; enačba $x + 5 = 17$
**Iščemo:** začetno število skladb $x$

:::formula
neznani seštevanec = vsota $-$ znani seštevanec
:::

**Rešitev:**

1. Neznanemu številu je bilo prišteto $5$, zato gremo nazaj z odštevanjem: $x = 17 - 5 = 12$.
2. Preizkus: $12 + 5 = 17$, drži.
3. Odgovor: Maja je imela na začetku $12$ skladb.

### Primer 2: takti in dobe

V skladbi ima vsak takt $4$ dobe. Bobnar je v celi skladbi udaril na $96$ dob, na vsako enkrat. Koliko taktov ima skladba?

**Podatki:** $4$ dobe v taktu, skupaj $96$ dob; enačba $4 \cdot x = 96$
**Iščemo:** število taktov $x$

:::formula
neznani faktor = zmnožek $:$ znani faktor
:::

**Rešitev:**

1. Število taktov je bilo pomnoženo s $4$, zato gremo nazaj z deljenjem: $x = 96 : 4 = 24$.
2. Preizkus: $4 \cdot 24 = 96$, drži.
3. Odgovor: skladba ima $24$ taktov.

### Primer 3: vstopnice za koncert

Za koncert kupiš $2$ enaki vstopnici in plačaš še $3\,\text{€}$ za rezervacijo. Skupaj plačaš $27\,\text{€}$. Koliko stane ena vstopnica?

**Podatki:** $2$ vstopnici po $x$ evrov, rezervacija $3\,\text{€}$, skupaj $27\,\text{€}$; enačba $2 \cdot x + 3 = 27$
**Iščemo:** ceno ene vstopnice $x$

:::formula
preizkušanje: vstavljaj $x$, dokler ni $2 \cdot x + 3 = 27$; ali sklepanje nazaj: najprej $-3$, nato $:2$
:::

**Rešitev:**

1. Preizkusimo okroglo število $10$: $2 \cdot 10 + 3 = 23$. Premalo, zato večje.
2. $x = 11$: $2 \cdot 11 + 3 = 25$. Še vedno premalo.
3. $x = 12$: $2 \cdot 12 + 3 = 27$. Drži.
4. Sklepanje nazaj potrdi: brez rezervacije je $27 - 3 = 24\,\text{€}$ za dve vstopnici, ena pa $24 : 2 = 12\,\text{€}$.
5. Odgovor: ena vstopnica stane $12\,\text{€}$.

### Primer 4: zdaj ti

Komplet $6$ enakih strun za kitaro stane $10{,}80\,\text{€}$. Koliko stane ena struna?

**Podatki:** $6$ strun, skupaj $10{,}80\,\text{€}$; enačba $6 \cdot x = 10{,}8$
**Iščemo:** ceno ene strune $x$

:::formula
neznani faktor = zmnožek $:$ znani faktor
:::

**Rešitev:**

1. V enačbi je množenje s $6$, obratna operacija je deljenje s $6$.
2. Izračunaj sam in naredi preizkus:

:::premisli
Napovej najprej: stane ena struna več ali manj kot $2\,\text{€}$? Zakaj? Nato izračunaj $x$.
---
Manj, ker bi $6$ strun po $2\,\text{€}$ stalo $12\,\text{€}$, kar je več kot $10{,}80\,\text{€}$. Natančno: $x = 10{,}8 : 6 = 1{,}8$, ena struna stane $1{,}80\,\text{€}$. Preizkus: $6 \cdot 1{,}8 = 10{,}8$.
:::

## Pogoste napake

- **»Naredim, kar piše.«** Pri $x + 5 = 12$ učenec sešteje in dobi $17$. Plus pove, kaj se je zgodilo z $x$, ne kaj moraš narediti ti. Pojdi nazaj z obratno operacijo: $12 - 5 = 7$.
- **Odštevanje pri minusu.** Pri $x - 4 = 9$ učenec računa $9 - 4 = 5$. Toda od $x$ smo vzeli $4$ in ostalo je $9$, torej je bil $x$ večji: $9 + 4 = 13$.
- **Deljenje pri deljenju.** Pri $x : 4 = 8$ učenec računa $8 : 4 = 2$. Preizkus $2 : 4$ ni $8$. Pravilno: $x = 8 \cdot 4 = 32$.
- **Ustavljanje na pol poti.** Pri $5 \cdot x + 8 = 43$ učenec odšteje $8$ in zapiše $x = 35$. To je šele $5 \cdot x$. Treba je še deliti s $5$: $x = 7$.
- **Rešitev je število na desni.** »Pri $x + 5 = 17$ je rešitev $17$.« Rešitev je število, ki ga vstaviš za $x$. Vedno naredi preizkus.

## Povzetek

- Enačba ima znak $=$ in neznanko; obe strani imata enako vrednost, kot tehtnica v ravnovesju.
- Rešitev je število, ki ga vstaviš za neznanko, da enakost drži.
- Sklepanje: greš nazaj z obratno operacijo. Plus in minus sta obratna, krat in deljeno tudi.
- Pri $x - a = b$ je $x = b + a$, pri $x : a = b$ je $x = b \cdot a$. Rešitev je tu večja od $b$ (pri deljenju, če je $a$ večji od $1$).
- Preizkušanje: vstavljaš števila in iz vsakega poskusa razbereš, ali naprej večje ali manjše.
- Pri dveh operacijah ($2 \cdot x + 3 = 27$) gremo nazaj v obratnem vrstnem redu: najprej $-3$, nato $:2$.
- Vsako rešitev preveri s preizkusom v prvotni enačbi.

## Drugače: Kot zgodba

Bobnar Tim si je zamislil skrivno število. Od njega je odštel $5$. Kar je ostalo, je razdelil na $3$ enake dele. En del je bil $4$. Katero število si je zamislil?

Zgodbo zavrti nazaj, kot posnetek, ki teče vzvratno. Zadnje dejanje odpraviš prvo.

- Na koncu je delil s $3$ in dobil $4$. Pred deljenjem je bilo torej $4 \cdot 3 = 12$.
- Pred tem je odštel $5$. Preden je odštel, je bilo $12 + 5 = 17$.

Tim si je zamislil $17$. Preveri naprej: $17 - 5 = 12$, $12 : 3 = 4$. Zgodba se ujema.

Vsaka enačba je taka kratka zgodba. Neznanka je skrivno število, računske operacije so dejanja, desna stran je konec zgodbe.

## Drugače: Korak za korakom s številkami

Recept za sklepanje, primer $x - 6 = 10$:

| korak | kaj narediš | rezultat |
|---|---|---|
| 1 | katera operacija je ob $x$? | minus $6$ |
| 2 | obratna operacija | plus $6$ |
| 3 | uporabi jo na desni strani | $10 + 6 = 16$ |
| 4 | preizkus | $16 - 6 = 10$, drži |

Recept za preizkušanje, primer $3 \cdot x = 21$, možnosti $5$, $6$, $7$, $8$:

| $x$ | $3 \cdot x$ | enako $21$? |
|---|---|---|
| $5$ | $15$ | premalo |
| $6$ | $18$ | premalo |
| $7$ | $21$ | da |

Rešitev je $x = 7$. Števila $8$ ni treba preizkusiti: dalo bi $24$, kar je že preveč.

## Preveri se

? Maja ima po dodanih $5$ skladbah na seznamu $17$ skladb: $x + 5 = 17$. Kaj je rešitev te enačbe?
- Število $17$, ker stoji na desni strani.
~ $17$ je vrednost desne strani. Rešitev je število, ki ga vstaviš za $x$.
- Črka $x$.
~ $x$ je neznanka, oznaka za iskano število. Rešitev je število, ki ga $x$ predstavlja.
+ Število $12$, ker je $12 + 5 = 17$.
- Število $22$, ker je $17 + 5 = 22$.
~ Seštel si, ker je v enačbi plus. Preizkus $22 + 5 = 27$ pokaže, da to ni rešitev.
> Rešitev je število, pri katerem obe strani dasta isto: $12 + 5 = 17$.

? Razvrsti enačbe po velikosti rešitve, od najmanjše do največje: A: $x + 6 = 10$, B: $x - 6 = 10$, C: $x : 2 = 10$, D: $5 \cdot x = 10$.
+ D, A, B, C
- B, C, A, D
~ Tako dobiš, če narediš, kar piše ($10 - 6$, $10 : 2$, $10 + 6$, $10 \cdot 5$). Uporabiti moraš obratne operacije.
- C, B, A, D
~ To je vrstni red od največje do najmanjše. Rešitve so D $2$, A $4$, B $16$, C $20$.
- A, D, B, C
~ Pri D je rešitev $10 : 5 = 2$, kar je manj kot $4$ pri A.
> Rešitve: D $x = 10 : 5 = 2$, A $x = 10 - 6 = 4$, B $x = 10 + 6 = 16$, C $x = 10 \cdot 2 = 20$.

? Kaj se zgodi z rešitvijo enačbe $x + 3 = 10$, če desno stran povečamo na $12$?
- Rešitev se zmanjša za $2$.
~ Večja vsota pri istem seštevancu $3$ pomeni večji $x$, ne manjšega.
- Rešitev ostane enaka.
~ Rešitev je odvisna od desne strani: $10 - 3 = 7$, a $12 - 3 = 9$.
+ Rešitev se poveča za $2$.
> Prej $x = 10 - 3 = 7$, zdaj $x = 12 - 3 = 9$. Rešitev se poveča za toliko kot desna stran.

? Melodijo razdelimo na $3$ enake fraze, vsaka ima $7$ taktov: $x : 3 = 7$. Koliko taktov ima melodija?
- $4$
~ To je $7 - 3$. V enačbi je deljenje, njegova obratna operacija je množenje.
- $10$
~ To je $7 + 3$. Obratna operacija deljenja je množenje, ne seštevanje.
+ $21$
- približno $2{,}3$
~ To je $7 : 3$. Naredil si, kar piše; preizkus $2{,}3 : 3$ ni $7$.
> $x = 7 \cdot 3 = 21$. Preizkus: $21 : 3 = 7$.

? Glasbena šola zaračuna $8\,\text{€}$ vpisnine in $x$ evrov za vsako uro. Za $5$ ur z vpisnino plačaš $43\,\text{€}$: $5 \cdot x + 8 = 43$. Koliko stane ena ura?
- $35\,\text{€}$
~ To je šele cena petih ur ($43 - 8$). Deliti moraš še s $5$.
- $10{,}20\,\text{€}$
~ Vpisnino si prištel ($43 + 8 = 51$). Vpisnina je bila prišteta, zato jo odštej.
+ $7\,\text{€}$
- $8{,}60\,\text{€}$
~ To je $43 : 5$, kot da vpisnine ni. Najprej odštej $8$, nato deli s $5$.
> $5 \cdot x = 43 - 8 = 35$, $x = 35 : 5 = 7$. Preizkus: $5 \cdot 7 + 8 = 43$.

:::simboli
x | neznanka | | | število, ki ga iščemo
:::
