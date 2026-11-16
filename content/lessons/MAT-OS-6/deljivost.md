---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka iz kuhinje. Babica je posušila $738$ sliv. Ima $9$ enakih kozarcev in v vsakega želi dati enako število sliv, tako da nobena ne ostane. Se ji bo izšlo?

Ne deli. Poskusi uganiti samo z enim namigom: $7 + 3 + 8 = 18$.

Če si rekel »da«, imaš prav: v vsak kozarec gre $82$ sliv. Kako pa lahko vsota števk kaj pove o deljenju? Na koncu te lekcije boš znal za $2$, $3$, $5$, $9$ in $10$ ugotoviti, ali se deljenje izide, samo s pogledom na števke. To pride prav pri delitvi piškotov na pladnje, jajc v škatle ali receptov za več ljudi.

## Razlaga

Pravila zgradimo eno za drugim. Za vsakim je kratek preizkus z odgovorom.

**1. Deljivo, večkratnik.** Število $a$ je **deljivo** s številom $b$, če pri deljenju $a : b$ ni ostanka. Primer: $18 : 6 = 3$, ostanka ni, zato je $18$ deljivo s $6$. Pravimo tudi, da je $18$ **večkratnik** števila $6$. Pri $20 : 6 = 3$ pa ostaneta $2$, zato $20$ ni deljivo s $6$.

*Preizkus:* $24$ jajc daš v škatle po $6$. Ostane kakšno jajce? *Odgovor: ne, $24 : 6 = 4$, torej je $24$ deljivo s $6$.*

**2. Soda in liha števila.** Ko pogrinjaš mizo, daš vilice in nože v pare. Če je predmetov $8$, dobiš $4$ pare. Pri $7$ predmetih eden ostane sam. Števila, ki jih lahko razdelimo v pare (so deljiva z $2$), so **soda**: $0, 2, 4, 6, 8, 10, \dots$ Ostala so **liha**: $1, 3, 5, 7, 9, \dots$ Tudi $0$ je sodo, ker je $0 : 2 = 0$ brez ostanka.

*Preizkus:* je $15$ sodo ali liho? *Odgovor: liho, en predmet ostane brez para.*

**3. Deljivost z 10.** Vsaka desetica je deljiva z $10$, prav tako vsaka stotica in tisočica. Število $4\,370 = 4\,000 + 300 + 70$ je zato deljivo z $10$. Pri $4\,373$ pa ostanejo $3$ enice. Pravilo: število je deljivo z $10$, če se **konča na $0$**.

**4. Deljivost s 5 in z 2.** Ker je $10 = 2 \cdot 5$, so vse desetice deljive tudi s $5$ in z $2$. O deljivosti odloča samo še **zadnja števka**:

| deljivo z | zadnja števka mora biti | primer |
|---|---|---|
| $10$ | $0$ | $570$ |
| $5$ | $0$ ali $5$ | $265$, $340$ |
| $2$ | $0, 2, 4, 6$ ali $8$ (soda) | $3\,478$ |

*Preizkus:* je $575$ deljivo s $5$? Z $10$? *Odgovor: s $5$ da (konča se na $5$), z $10$ ne.*

V simulaciji spodaj (»Pravila deljivosti v stotičnem kvadratu«) nastavi drsnik »deljivo z« na $5$, nato na $10$. Opazuj obarvana polja: pri obeh tvorijo navpične stolpce, ker odloča le zadnja števka.

:::premisli
Število je deljivo z $2$ in tudi s $5$. Napovej: ali je zagotovo deljivo z $10$?
---
Da. Deljivo z $2$ pomeni sodo zadnjo števko, deljivo s $5$ pomeni zadnjo števko $0$ ali $5$. Obema pogojema hkrati ustreza le $0$, to pa je ravno pravilo za $10$.
:::

**5. Deljivost s 3.** Tu zadnja števka ne pomaga: $13$ ni deljivo s $3$, $33$ pa je, čeprav se obe končata na $3$. Pomaga **vsota števk**, to je vsota vseh števk števila. Pravilo: število je deljivo s $3$, če je vsota njegovih števk deljiva s $3$. Primer: pri $1\,245$ je vsota $1 + 2 + 4 + 5 = 12$, $12$ je deljivo s $3$, zato je deljivo tudi $1\,245$.

*Preizkus:* je $72$ deljivo s $3$? *Odgovor: da, $7 + 2 = 9$, $9$ pa je deljivo s $3$.*

:::premisli
Zakaj pri deljivosti s $3$ ne moremo pogledati samo zadnje števke, kot pri $5$?
---
Ker $10$ ni deljivo s $3$. Desetice zato niso »varne«: vsaka pri deljenju s $3$ pusti ostanek $1$. Te ostanke moramo prešteti, in vsota števk prav to naredi.
:::

**6. Deljivost z 9.** Pravilo je enako kot pri $3$, le z $9$: število je deljivo z $9$, če je vsota števk deljiva z $9$. Pri babičinih slivah je $7 + 3 + 8 = 18 = 2 \cdot 9$, zato je $738$ deljivo z $9$.

Vsako število, deljivo z $9$, je deljivo tudi s $3$, ker je $9 = 3 \cdot 3$. Obratno ne velja: $12$ je deljivo s $3$, z $9$ pa ne.

*Preizkus:* je $1\,236$ deljivo z $9$? *Odgovor: vsota je $12$, ki ni deljiva z $9$, zato ne. S $3$ pa je deljivo.*

## Rešeni primeri

### Primer 1 (lažji): vrečke s sadjem

Kuhinja šolske menze dobi $348$ jabolk, $1\,275$ orehov in $4\,090$ lešnikov. Katere količine lahko brez ostanka pakira v vrečke po $2$, po $5$ oziroma po $10$?

**Podatki:** količine $348$, $1\,275$ in $4\,090$; velikosti vrečk $2$, $5$ in $10$
**Iščemo:** katere količine so deljive z $2$, s $5$ in z $10$

:::formula
Za $2$, $5$ in $10$ odloča samo zadnja števka: soda za $2$, $0$ ali $5$ za $5$, $0$ za $10$.
:::

**Rešitev:**

1. $348$ se konča na $8$, ki je soda. Deljivo je z $2$, s $5$ in z $10$ pa ne, ker se ne konča na $0$ ali $5$.
2. $1\,275$ se konča na $5$. Deljivo je s $5$, z $2$ ne (zadnja števka je liha), z $10$ ne (ni $0$).
3. $4\,090$ se konča na $0$, zato je deljivo z $2$, s $5$ in z $10$.
4. Odgovor: jabolka gredo v vrečke po $2$, orehi v vrečke po $5$, lešniki v vrečke po $2$, $5$ ali $10$.

### Primer 2: piškoti v škatlah

Pekarna je spekla tri serije piškotov: $5\,241$, $7\,326$ in $4\,805$ kosov. Katere serije lahko zloži v škatle po $3$ in katere v škatle po $9$?

**Podatki:** serije $5\,241$, $7\,326$ in $4\,805$ piškotov; škatle po $3$ in po $9$
**Iščemo:** katera števila so deljiva s $3$ oziroma z $9$

:::formula
Deljivo s $3$ (z $9$), če je vsota števk deljiva s $3$ (z $9$).
:::

**Rešitev:**

1. $5\,241$: $5 + 2 + 4 + 1 = 12$. $12$ je deljivo s $3$, z $9$ ne. Serija gre v škatle po $3$, ne po $9$.
2. $7\,326$: $7 + 3 + 2 + 6 = 18$. $18$ je deljivo s $3$ in z $9$. Serija gre v obe vrsti škatel.
3. $4\,805$: $4 + 8 + 0 + 5 = 17$. $17$ ni deljivo ne s $3$ ne z $9$.
4. Preizkus za drugo serijo: $9 \cdot 814 = 7\,326$, torej se deljenje $7\,326 : 9 = 814$ res izide.
5. Odgovor: v škatle po $3$ gresta prva in druga serija, v škatle po $9$ samo druga.

### Primer 3 (težji): zamazano naročilo

Na listku z naročilom krofov je zadnja števka zamazana: $47*$. Kuharica ve dvoje: krofe so zložili na pladnje po $3$ in nobeden ni ostal, število krofov pa je sodo. Koliko krofov so naročili?

**Podatki:** število $47*$, deljivo s $3$, sodo
**Iščemo:** števko $*$ in število krofov

:::formula
Deljivo s $3$: vsota števk deljiva s $3$. Sodo: zadnja števka soda.
:::

**Rešitev:**

1. Vsota znanih števk: $4 + 7 = 11$. Vsa vsota je $11 + *$.
2. Večkratniki števila $3$ med $11$ in $20$ so $12$, $15$ in $18$. Večje vsote ne pridejo v poštev, ker je $*$ ena sama števka (največ $9$).
3. Zato je $*$ lahko $1$, $4$ ali $7$, saj $11 + 1 = 12$, $11 + 4 = 15$ in $11 + 7 = 18$.
4. Od števk $1$, $4$ in $7$ je soda samo $4$.
5. Preizkus: $3 \cdot 158 = 474$, torej je $474$ res deljivo s $3$.
6. Odgovor: naročili so $474$ krofov.

### Primer 4 – zdaj ti

V shrambi je $3*5$ kock sladkorja, srednja števka je zbrisana. Kocke lahko brez ostanka razdelimo v $9$ skodelic. Katera števka manjka in koliko kock gre v vsako skodelico?

**Podatki:** število $3*5$, deljivo z $9$; $9$ skodelic
**Iščemo:** števko $*$ in število kock v skodelici

:::formula
Deljivo z $9$: vsota števk deljiva z $9$.
:::

**Rešitev:**

1. Vsota znanih števk: $3 + 5 = 8$. Vsa vsota je $8 + *$.
2. Najbližji večkratnik števila $9$ je $9$; naslednji, $18$, bi zahteval $* = 10$, kar ni števka.
3. Določi $*$ in izračunaj, koliko kock gre v skodelico, nato preveri:

:::premisli
Katera je števka $*$ in koliko kock je v vsaki skodelici?
---
$* = 1$, ker je $8 + 1 = 9$. Kock je $315$ in $315 : 9 = 35$, saj je $9 \cdot 35 = 315$. V vsako skodelico gre $35$ kock.
:::

## Pogoste napake

- **Vsota števk pri 2, 5 ali 10.** Kdor pri $25$ sešteje $2 + 5 = 7$ in sklepa, da $25$ ni deljivo s $5$, se zmoti. Pri teh deliteljih šteje le zadnja števka, ker so desetice že deljive.
- **Zadnja števka pri 3.** »$1\,243$ se konča na $3$, torej je deljivo s $3$.« Ni: vsota števk je $10$, ta ni deljiva s $3$. Pri $3$ in $9$ seštej vse števke.
- **Zamenjava 5 in 10.** $45$ se konča na $5$, zato je deljivo s $5$, z $10$ pa ne. Za $10$ mora biti zadnja števka $0$.
- **Iz 3 sklepamo na 9.** »Vsota števk $12$ je deljiva s $3$, torej je število deljivo tudi z $9$.« Ne velja, $12$ ni deljivo z $9$. Velja le obratno: iz $9$ sledi $3$.
- **Nič ni sodo.** Število $0$ je sodo, ker je $0 : 2 = 0$ brez ostanka.

## Povzetek

- Število je deljivo z $b$, če pri deljenju z $b$ ni ostanka; tako število je večkratnik števila $b$.
- Soda števila so deljiva z $2$ in se končajo na $0, 2, 4, 6, 8$; liha se končajo na $1, 3, 5, 7, 9$. Tudi $0$ je sodo.
- Z $2$: zadnja števka soda. S $5$: zadnja števka $0$ ali $5$. Z $10$: zadnja števka $0$.
- S $3$: vsota števk deljiva s $3$. Z $9$: vsota števk deljiva z $9$.
- Deljivo z $9$ pomeni tudi deljivo s $3$; deljivo z $10$ pomeni tudi deljivo z $2$ in s $5$. Obratno ne velja vedno.

## Drugače: Na sliki

Predstavljaj si stotični kvadrat: števila od $1$ do $100$ v vrstah po deset.

:::risba mreža
opis: Prve tri vrste stotičnega kvadrata: števila od 1 do 30, po deset v vsaki vrsti. V prvi vrsti so 1 do 10, v drugi 11 do 20, v tretji 21 do 30.
vrstic: 3
stolpcev: 10
številke: da
:::

Večkratniki števila $10$ so vsi v zadnjem stolpcu. Večkratniki števila $5$ so v petem in zadnjem stolpcu. Soda števila zapolnijo vsak drugi stolpec. Vzorec je pokončen, ker se v vsakem stolpcu zadnja števka ne spreminja.

Večkratniki števila $9$ pa tvorijo poševno črto: $9, 18, 27, 36, \dots$ Do $81$ se v vsaki naslednji vrsti premaknejo za eno polje v levo. Do $90$ je pri vseh vsota števk $9$. Večkratniki števila $3$ tvorijo več takih poševnih črt. Zato pri $3$ in $9$ ne gledamo stolpca, ampak vsoto števk.

## Drugače: Bolj natančno

**Zakaj pri 2, 5 in 10 šteje le zadnja števka.** Vsako število razstavimo na desetice in enice, na primer $3\,478 = 3\,470 + 8$. Del $3\,470$ je večkratnik števila $10$, zato je deljiv z $2$, s $5$ in z $10$. Odloča samo še zadnja števka $8$.

**Zakaj pri 3 in 9 šteje vsota števk.** Števila $10$, $100$, $1\,000$ so za $1$ večja od $9$, $99$, $999$, ki so vsa deljiva z $9$ (in s $3$). Vzemimo $348$ in uporabimo razčlenjevalni zakon:

$$348 = 3 \cdot 100 + 4 \cdot 10 + 8$$

$$= 3 \cdot (99 + 1) + 4 \cdot (9 + 1) + 8$$

$$= \underbrace{3 \cdot 99 + 4 \cdot 9}_{\text{deljivo z } 9} + \underbrace{(3 + 4 + 8)}_{\text{vsota števk}}$$

Prvi del je $297 + 36 = 333$ in je deljiv z $9$. O deljivosti z $9$ (ali s $3$) zato odloča le vsota števk $3 + 4 + 8 = 15$. Ker je $15$ deljivo s $3$, z $9$ pa ne, je $348$ deljivo s $3$ ($348 : 3 = 116$), z $9$ pa ne.

## Preveri se

? Katera trditev je pravilna?
- Vsako število, deljivo s $3$, je deljivo tudi z $9$.
~ Velja obratno. $12$ je deljivo s $3$, z $9$ pa ne.
+ Število, ki se konča na $0$, je deljivo z $2$, s $5$ in z $10$.
- Število $0$ je liho.
~ $0 : 2 = 0$ brez ostanka, zato je $0$ sodo.
- Število je deljivo s $3$, če se konča na $3$.
~ Pri $3$ zadnja števka ne odloča: $13$ ni deljivo s $3$. Seštej vse števke.
> Če se število konča na $0$, je večkratnik števila $10$, $10$ pa je deljivo z $2$ in s $5$.

? Katero števko moraš vstaviti namesto $*$, da bo število $52*$ deljivo z $9$?
- $7$
~ $7$ je vsota znanih števk $5 + 2$. Iščemo števko, ki to vsoto dopolni do večkratnika števila $9$.
- $9$
~ Pri $9$ ne odloča zadnja števka. Vsota $5 + 2 + 9 = 16$ ni deljiva z $9$.
+ $2$
- $5$
~ Vsota $5 + 2 + 5 = 12$ je deljiva s $3$, z $9$ pa ne. Zamenjal si pravili za $3$ in $9$.
> Vsota znanih števk je $5 + 2 = 7$. Do $9$ manjkata $2$, zato je $* = 2$. Preizkus: $9 \cdot 58 = 522$.

? Nik je zapisal: »Število $1\,243$ se konča na $3$, zato je deljivo s $3$.« Kje je napaka?
- Napake ni, sklep je pravilen.
~ Preveri z vsoto števk: $1 + 2 + 4 + 3 = 10$, kar ni deljivo s $3$.
+ Pri $3$ ne odloča zadnja števka, ampak vsota števk, ta pa je $10$.
- Napaka je le v tem, da je število liho.
~ Liho število je lahko deljivo s $3$, na primer $15$. Sodost tu ni pomembna.
> Za $3$ seštejemo vse števke: $1 + 2 + 4 + 3 = 10$. Ker $10$ ni deljivo s $3$, tudi $1\,243$ ni.

? Primerjaj števili $2\,340$ in $2\,345$. Kaj velja?
- Obe sta deljivi z $10$.
~ Za $10$ mora biti zadnja števka $0$. $2\,345$ se konča na $5$.
- Obe sta sodi.
~ Soda je zadnja števka le pri $2\,340$. $2\,345$ se konča na liho števko $5$.
+ Obe sta deljivi s $5$, z $10$ pa samo $2\,340$.
> Obe se končata na $0$ ali $5$, zato sta deljivi s $5$. Za $10$ potrebuješ zadnjo števko $0$, kar ima le $2\,340$.

? Za sladico imaš $135$ jagod in $9$ gostov. Ali lahko vsak gost dobi enako število jagod, ne da bi kakšna ostala?
- Ne, ker se $135$ ne konča na $9$.
~ Pri $9$ ne gledamo zadnje števke, ampak vsoto števk.
- Ne, ker je $135$ liho število.
~ Liho število je lahko deljivo z $9$; sodost pove le, ali je deljivo z $2$.
+ Da, vsak dobi $15$ jagod.
- Da, vsak dobi $45$ jagod.
~ To je $135 : 3$. Gostov je $9$, zato deli z $9$, ne s $3$.
> Vsota števk je $1 + 3 + 5 = 9$, zato je $135$ deljivo z $9$: $135 : 9 = 15$.

:::simboli
a | število, ki ga delimo (deljenec) | | | deljivo je z $b$, če pri $a : b$ ni ostanka
b | število, s katerim delimo (delitelj) | | | $a$ je večkratnik števila $b$
:::
