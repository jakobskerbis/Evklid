---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dolgo so ljudje račune zapisovali z besedami: »k dvema prištej trikrat štiri«. Tak zapis je dolg, a besede same povedo, kaj izračunaš najprej. Ko so matematiki začeli pisati z znaki, so morali znake tudi izumiti. V 17. stoletju je angleški matematik William Oughtred za množenje uporabil križec $\times$. Nemški matematik Gottfried Wilhelm Leibniz je raje pisal piko, ker se mu je križec mešal s črko $x$, za deljenje pa je uporabljal dvopičje. Pri nas še danes pišemo $3 \cdot 4$ in $12 : 3$.

S kratkimi znaki pa je prišlo novo vprašanje. Kaj pomeni $2 + 3 \cdot 4$? Anja računa od leve: $2 + 3 = 5$, nato $5 \cdot 4 = 20$. Luka najprej pomnoži: $3 \cdot 4 = 12$, nato $2 + 12 = 14$. Če bi vsak bral po svoje, se ne bi razumeli ne ljudje ne računalniki. Zato velja **dogovor o vrstnem redu računskih operacij**. Po njem ima prav Luka.

Druga polovica lekcije so **računski zakoni**. Z njimi račun preurediš tako, da ga izračunaš na pamet in z manj napakami.

## Razlaga

**1. En primer iz glasbe.** Pesem se začne s predtaktom, ki ima $2$ dobi. Sledijo $3$ takti po $4$ dobe. Koliko dob je to? Takti dajo $3 \cdot 4 = 12$ dob, s predtaktom vred $2 + 12 = 14$ dob. Če to zapišemo v en izraz, $2 + 3 \cdot 4$, mora biti njegova vrednost $14$. Množenje torej izračunamo **pred** seštevanjem.

Kaj pa, če bi bilo $2 + 3 = 5$ taktov po $4$ dobe? Takrat najprej seštejemo, nato množimo. To zapišemo z **oklepajem**: $(2 + 3) \cdot 4 = 5 \cdot 4 = 20$. Oklepaj pove: »to izračunaj najprej«.

**2. Imena.** Vsaka operacija ima svoja imena za števila. V tabeli si sledijo v istem vrstnem redu kot $a$, $b$ in $c$:

| Račun | Imena |
|---|---|
| $a + b = c$ | seštevanca, vsota |
| $a - b = c$ | zmanjševanec, odštevanec, razlika |
| $a \cdot b = c$ | faktorja, produkt (zmnožek) |
| $a : b = c$ | deljenec, delitelj, količnik |

Seštevanje in odštevanje sta obratni operaciji (ena razveljavi, kar naredi druga), prav tako množenje in deljenje. Zato račun preizkusiš z obratno operacijo: iz $6 \cdot 7 = 42$ sledi $42 : 7 = 6$. Računamo z naravnimi števili in ničlo, zato je razlika $a - b$ mogoča le, kadar je $a \ge b$, količnik $a : b$ pa je naravno število le, kadar se deljenje izide.

**3. Številski izraz.** Zapis iz števil, računskih znakov in oklepajev je **številski izraz**, na primer $5 + 6 \cdot 4 - 18 : 3$. Število, ki ga dobimo, ko izraz izračunamo, je **vrednost izraza**.

**4. Vrstni red računskih operacij.** Iz primera s takti nastane pravilo:

1. Najprej računamo v **oklepajih**; pri oklepajih v oklepajih začnemo pri notranjih.
2. Nato **množimo in delimo**.
3. Nazadnje **seštevamo in odštevamo**.
4. Operacije iste stopnje (množenje in deljenje ali seštevanje in odštevanje) računamo **od leve proti desni**.

Množenje torej nima prednosti pred deljenjem, seštevanje ne pred odštevanjem:

$$24 : 6 \cdot 2 = 4 \cdot 2 = 8$$

$$20 - 8 + 3 = 12 + 3 = 15$$

:::premisli
Koliko je $36 : 6 : 2$? Sošolec je dobil $12$. Napovej svoj rezultat, nato poišči, kje se je sošolec zmotil.
---
$36 : 6 = 6$, nato $6 : 2 = 3$. Število $12$ dobiš, če najprej izračunaš $6 : 2 = 3$ in nato $36 : 3$. Tako bi računal od desne, operaciji iste stopnje pa gresta od leve.
:::

**5. Več oklepajev.** Izraz z oklepaji v oklepajih rešuješ od znotraj navzven. Zunanji oklepaj pogosto zapišemo kot oglati, $[\;]$, da se vidi, kateri par spada skupaj. V vsakem koraku izračunaj en del, ostalo prepiši:

$$50 - [12 + 3 \cdot (7 - 4)] = 50 - [12 + 3 \cdot 3]$$

$$50 - [12 + 3 \cdot 3] = 50 - [12 + 9] = 50 - 21 = 29$$

**6. Zamenjalni in združevalni zakon.** Seštej $8 + 5$ in nato $5 + 8$: obakrat dobiš $13$. Izračunaj $(7 + 5) + 15 = 27$ in $7 + (5 + 15) = 7 + 20 = 27$. Ista izkušnja velja za vsa števila in tudi za množenje.

**Zamenjalni zakon** (seštevanje in množenje):

$$a + b = b + a$$

$$a \cdot b = b \cdot a$$

**Združevalni zakon** (seštevanje in množenje):

$$(a + b) + c = a + (b + c)$$

$$(a \cdot b) \cdot c = a \cdot (b \cdot c)$$

Skupaj povesta: v računu, ki ima samo seštevanja ali samo množenja, smeš števila poljubno zamenjati in združiti. Zato je $(5 \cdot 4) \cdot 9 = 5 \cdot (4 \cdot 9) = 5 \cdot 36 = 180$.

**7. Razčlenjevalni zakon.** V orkestru so $3$ vrste stolov. V vsaki vrsti sedijo $4$ violinisti in $5$ violistov.

:::risba skica
opis: Pravokotnik iz kvadratkov s 3 vrstami. Levi del, 4 kvadratke širok, so violine (3 krat 4 je 12). Desni del, 5 kvadratkov širok in črtkan, so viole (3 krat 5 je 15). Skupaj 3 vrste po 9, to je 27 stolov.
območje: 0; -1 .. 9; 4
enota: 30
mreža: da
pravokotnik: 0; 0 .. 4; 3 | modra debelo
pravokotnik: 4; 0 .. 9; 3 | oranžna črtkano
napis: 2; -0,5 | 4 violine | sredina
napis: 6,5; -0,5 | 5 viol | sredina
napis: 4,5; 3,5 | 3 vrste po 4 + 5 stolov | sredina
:::

Stole preštejemo na dva načina. Po vrstah: $3 \cdot (4 + 5) = 3 \cdot 9 = 27$. Po delih: $3 \cdot 4 + 3 \cdot 5 = 12 + 15 = 27$. Rezultat je enak, zato velja **razčlenjevalni zakon**:

$$a \cdot (b + c) = a \cdot b + a \cdot c$$

$$a \cdot (b - c) = a \cdot b - a \cdot c$$

Drugi zapis uporabljamo, ko je $b \ge c$. S faktorjem pomnožimo **vsak** člen v oklepaju. Zakon beremo tudi od desne proti levi. Temu pravimo **izpostavljanje skupnega faktorja**: $37 \cdot 8 + 37 \cdot 2 = 37 \cdot (8 + 2) = 37 \cdot 10 = 370$.

V simulaciji spodaj (**Množenje s pravokotniki (razčlenjevanje)**) razdeli eno stranico pravokotnika na dva dela. Opazuj, da je kvadratkov v obeh delih skupaj vedno toliko kot v celem pravokotniku.

:::premisli
Ali velja tudi $(10 + 3) \cdot 6 = 10 \cdot 6 + 3 \cdot 6$, kjer je oklepaj na levi strani? Zakaj?
---
Velja. Po zamenjalnem zakonu je $(10 + 3) \cdot 6 = 6 \cdot (10 + 3)$, to pa je po razčlenjevalnem zakonu $6 \cdot 10 + 6 \cdot 3 = 78$. Na sliki bi pravokotnik le obrnil na bok.
:::

**8. Odštevanje in deljenje.** Zanju zamenjalni in združevalni zakon **ne veljata**:

- $8 - 3 = 5$, a $3 - 8$ med naravnimi števili ni mogoče; $12 : 4 = 3$, a $4 : 12$ ni naravno število.
- $(20 - 8) - 4 = 8$, a $20 - (8 - 4) = 16$.
- $(24 : 6) : 2 = 2$, a $24 : (6 : 2) = 8$.

**9. Števili $0$ in $1$.**

- $a + 0 = a$ in $a - 0 = a$; $a \cdot 1 = a$ in $a : 1 = a$.
- $a \cdot 0 = 0$, in kadar je $a \ne 0$, tudi $0 : a = 0$.
- **Z ničlo ne delimo.** Izraz $a : 0$ nima pomena.

**10. Računanje na pamet.** Dva prijema: najprej zmnoži faktorja, ki dasta okroglo število, $4 \cdot 37 \cdot 25 = 37 \cdot (4 \cdot 25) = 37 \cdot 100 = 3\,700$; ali število razbij, $12 \cdot 15 = 12 \cdot (10 + 5) = 120 + 60 = 180$.

## Rešeni primeri

### Primer 1 (lažji)

Izračunaj vrednost izraza $5 + 6 \cdot 4 - 18 : 3$.

**Podatki:** izraz $5 + 6 \cdot 4 - 18 : 3$ (brez oklepajev)
**Iščemo:** vrednost izraza

:::formula
Najprej $\cdot$ in $:$ od leve proti desni, nato $+$ in $-$ od leve proti desni.
:::

**Rešitev:**

1. Oklepajev ni, zato najprej množimo in delimo: $6 \cdot 4 = 24$ in $18 : 3 = 6$.
2. Izraz je zdaj $5 + 24 - 6$.
3. Od leve proti desni: $5 + 24 = 29$, nato $29 - 6 = 23$.
4. Odgovor: vrednost izraza je $23$.
5. Kdor računa le od leve, dobi $5 + 6 = 11$, $11 \cdot 4 = 44$, $44 - 18 = 26$ in nato $26 : 3$, kar se ne izide. To je znak, da vrstni red ni pravi.

### Primer 2 (srednji)

Izračunaj vrednost izraza $(48 - 3 \cdot 6) : 5 + 2 \cdot (9 - 4)$.

**Podatki:** izraz $(48 - 3 \cdot 6) : 5 + 2 \cdot (9 - 4)$ z dvema oklepajema
**Iščemo:** vrednost izraza

:::formula
Oklepaji (v njih spet po vrstnem redu), nato $\cdot$ in $:$, nazadnje $+$ in $-$.
:::

**Rešitev:**

1. Prvi oklepaj: najprej množenje, $3 \cdot 6 = 18$, nato $48 - 18 = 30$.
2. Drugi oklepaj: $9 - 4 = 5$.
3. Izraz je zdaj $30 : 5 + 2 \cdot 5$.
4. Deljenje in množenje: $30 : 5 = 6$ in $2 \cdot 5 = 10$.
5. Seštevanje: $6 + 10 = 16$.
6. Odgovor: vrednost izraza je $16$. Preizkus deljenja: $6 \cdot 5 = 30$.

### Primer 3 (težji): nakup inštrumentov

Glasbena šola je kupila $4$ kitare po $125$ evrov in $4$ ukulele po $25$ evrov. Zapiši en številski izraz za ceno nakupa in ga izračunaj na pamet.

**Podatki:** $4$ kitare po $125$ €, $4$ ukulele po $25$ €
**Iščemo:** izraz za ceno in njegovo vrednost

:::formula
$a \cdot b + a \cdot c = a \cdot (b + c)$
:::

**Rešitev:**

1. Kitare stanejo $4 \cdot 125$, ukulele $4 \cdot 25$, zato je izraz $4 \cdot 125 + 4 \cdot 25$. Oklepaj ni potreben, ker množenje računamo pred seštevanjem.
2. Faktor $4$ je v obeh členih, zato ga izpostavimo: $4 \cdot 125 + 4 \cdot 25 = 4 \cdot (125 + 25)$.
3. V oklepaju je okroglo število: $125 + 25 = 150$, zato $4 \cdot 150 = 600$.
4. Preizkus po delih: $4 \cdot 125 = 500$, $4 \cdot 25 = 100$, $500 + 100 = 600$.
5. Odgovor: šola je plačala $600$ €.

### Primer 4: zdaj ti

Koncertna dvorana ima $6$ vrst po $99$ sedežev. Koliko sedežev ima? Računaj na pamet.

**Podatki:** $6$ vrst, $99$ sedežev v vrsti
**Iščemo:** število vseh sedežev

:::formula
$a \cdot (b - c) = a \cdot b - a \cdot c$
:::

**Rešitev:**

1. Število sedežev je $6 \cdot 99$.
2. Število $99$ je blizu $100$, zato zapišemo $99 = 100 - 1$ in dobimo $6 \cdot (100 - 1)$.
3. Uporabi razčlenjevalni zakon in izračunaj sam, nato preveri:

:::premisli
Koliko je $6 \cdot (100 - 1)$?
---
$6 \cdot 100 - 6 \cdot 1 = 600 - 6 = 594$ sedežev. Kdor zapiše $6 \cdot 100 - 1 = 599$, je s $6$ pomnožil le prvi člen.
:::

## Pogoste napake

- **Strogo od leve proti desni.** Pri $7 + 3 \cdot 5$ nekdo računa $10 \cdot 5 = 50$. Množenje ima prednost pred seštevanjem. Pravilno: $3 \cdot 5 = 15$, nato $7 + 15 = 22$.
- **Množenje pred deljenjem.** Pri $24 : 6 \cdot 2$ nekdo najprej izračuna $6 \cdot 2 = 12$ in dobi $2$. Množenje in deljenje sta iste stopnje, zato gremo od leve: $24 : 6 = 4$, $4 \cdot 2 = 8$. Enako pri $20 - 8 + 3 = 15$, ne $9$.
- **Zakoni za odštevanje in deljenje.** »Oklepaj lahko prestavim, kamor hočem.« Zamenjalni in združevalni zakon veljata le za seštevanje in množenje: $(20 - 8) - 4 = 8$, a $20 - (8 - 4) = 16$.
- **Razčlenjevanje samo prvega člena.** Pri $3 \cdot (4 + 5)$ nekdo zapiše $3 \cdot 4 + 5 = 17$. S faktorjem pomnožimo vsak člen: $3 \cdot 4 + 3 \cdot 5 = 27$. Preizkus: $3 \cdot 9 = 27$.
- **Napake z ničlo.** »$7 \cdot 0 = 7$« ali »$7 : 0 = 0$«. Produkt z ničlo je $0$. Deliti z ničlo ne moremo, ker ni števila, ki bi ga pomnožil z $0$ in dobil $7$. Velja le $0 : 7 = 0$.

## Povzetek

- Imena: seštevanca, vsota; zmanjševanec, odštevanec, razlika; faktorja, produkt; deljenec, delitelj, količnik.
- Vrstni red: oklepaji (od znotraj navzven), nato $\cdot$ in $:$, nazadnje $+$ in $-$; operacije iste stopnje od leve proti desni.
- Zamenjalni zakon: $a + b = b + a$, $a \cdot b = b \cdot a$; združevalni: $(a + b) + c = a + (b + c)$, $(a \cdot b) \cdot c = a \cdot (b \cdot c)$. Za odštevanje in deljenje ne veljata.
- Razčlenjevalni zakon: $a \cdot (b + c) = a \cdot b + a \cdot c$ in $a \cdot (b - c) = a \cdot b - a \cdot c$; obratno branje je izpostavljanje.
- $a + 0 = a$, $a \cdot 1 = a$, $a \cdot 0 = 0$; z ničlo ne delimo.
- Rezultat preizkusi z obratno operacijo ali z računom po drugi poti.

## Drugače: Z analogijo

Oklepaj v računu je kot **ponavljalni znak** v notah. Del med dvema ponavljalnima znakoma zaigraš dvakrat. Recimo, da je med njima kitica s $3$ takti in refren s $5$ takti. Zaigraš $2 \cdot (3 + 5) = 2 \cdot 8 = 16$ taktov.

Isto število dobiš, če posebej preštevaš: kitico igraš dvakrat, $2 \cdot 3 = 6$ taktov, refren dvakrat, $2 \cdot 5 = 10$ taktov, skupaj $16$. To je razčlenjevalni zakon: ponovi se **vse**, kar je med znakoma, ne le prvi del.

Če ponavljalnih znakov ni, se ponovi le tisto, pred čimer piše »$2 \cdot$«. Zato je $2 \cdot 3 + 5 = 11$ taktov: kitica dvakrat, refren enkrat. Oklepaj torej ni okras, ampak spremeni, kaj zaigraš.

## Drugače: Bolj natančno

**Zakaj ima množenje prednost?** Množenje je skrajšano seštevanje enakih členov: $3 \cdot 4 = 4 + 4 + 4$. Zato je $2 + 3 \cdot 4 = 2 + (4 + 4 + 4) = 14$, kot pri taktih. Vrstni red je dogovor, ki se ujema s tem pomenom.

**Zakaj velja razčlenjevalni zakon?** $3 \cdot (4 + 5)$ je $(4 + 5) + (4 + 5) + (4 + 5)$. Z zamenjalnim in združevalnim zakonom člene preuredimo v $4 + 4 + 4 + 5 + 5 + 5 = 3 \cdot 4 + 3 \cdot 5$. Isti razmislek deluje za poljubna števila.

**Odštevanje vsote in razlike.** Kdor odšteje vsoto, odšteje vsak člen: $20 - (8 + 5) = 7$ in $20 - 8 - 5 = 7$. Kdor odšteje razliko, odšteje premalo, zato drugi člen prišteje nazaj: $20 - (8 - 5) = 17$ in $20 - 8 + 5 = 17$.

**Zakaj ne delimo z ničlo?** $12 : 3 = 4$ pomeni $4 \cdot 3 = 12$. Če bi bilo $12 : 0$ neko število, bi moralo dati $12$, ko ga pomnožimo z $0$. Vsak produkt z ničlo pa je $0$, zato takega števila ni.

**Kalkulator.** Nekateri preprosti žepni kalkulatorji izračunajo vsako operacijo takoj, ko jo vtipkaš, in pri $2 + 3 \cdot 4$ pokažejo $20$. Šolski znanstveni kalkulatorji upoštevajo dogovor in pokažejo $14$. Preizkusi svojega; po potrebi si pomagaj z oklepaji.

## Preveri se

? Kateri izraz ima drugačno vrednost kot ostali trije?
- $2 + 3 \cdot 4$
~ Vrednost je $2 + 12 = 14$, enako kot pri $3 \cdot 4 + 2$ in $2 + 12$. Množenje pride pred seštevanjem.
- $3 \cdot 4 + 2$
~ Vrednost je $12 + 2 = 14$. Zamenjalni zakon dovoli, da $2$ prišteješ na koncu.
+ $(2 + 3) \cdot 4$
- $2 + 12$
~ To je $14$, kar dobiš iz $2 + 3 \cdot 4$, ko izračunaš množenje.
> Oklepaj zahteva, da najprej seštejemo: $5 \cdot 4 = 20$. Ostali trije izrazi imajo vrednost $14$.

? Izračunaj vrednost izraza $(14 - 2 \cdot 3) \cdot 5 - 6$.
= 34
~ 40 | Pozabil si zadnji korak: od $40$ moraš še odšteti $6$.
~ 174 | V oklepaju si najprej odštel ($14 - 2 = 12$). Tudi v oklepaju je množenje pred odštevanjem.
> V oklepaju: $2 \cdot 3 = 6$, $14 - 6 = 8$. Nato $8 \cdot 5 = 40$ in $40 - 6 = 34$.

? V izrazu $20 - 8 - 4$ okoli $8 - 4$ postavimo oklepaj: $20 - (8 - 4)$. Kaj se zgodi z vrednostjo?
- Ostane enaka, ker oklepaji pri odštevanju ne spremenijo ničesar.
~ Združevalni zakon pri odštevanju ne velja. Vrednost se spremeni z $8$ na $16$.
+ Poveča se, ker od $20$ zdaj odštejemo le $4$, ne $12$.
- Zmanjša se, ker zdaj odštevamo dvakrat.
~ Odštevamo še vedno enkrat od $20$, le manjše število: $8 - 4 = 4$.
> $20 - 8 - 4 = 12 - 4 = 8$, $20 - (8 - 4) = 20 - 4 = 16$. Oklepaj spremeni, koliko zares odštejemo.

? Rok je računal $24 : 4 \cdot 3 + 2$ takole: (1) $4 \cdot 3 = 12$; (2) $24 : 12 = 2$; (3) $2 + 2 = 4$. Kje se je prvič zmotil?
+ korak (1)
- korak (2)
~ Deljenje $24 : 12 = 2$ je izračunano prav, a $12$ je nastalo iz napačnega koraka (1).
- korak (3)
~ Seštevanje je pravilno; napaka je nastala prej.
- nobeden, vrednost je $4$
~ Množenje in deljenje sta iste stopnje, zato gremo od leve. Vrednost je $20$.
> Najprej od leve: $24 : 4 = 6$, nato $6 \cdot 3 = 18$ in $18 + 2 = 20$.

? Razvrsti korake postopka za izračun izraza z oklepaji.
1. Izračunaj, kar je v notranjih oklepajih.
2. Izračunaj, kar je v zunanjih oklepajih.
3. Zunaj oklepajev množi in deli od leve proti desni.
4. Nato seštevaj in odštevaj od leve proti desni.
5. Preizkusi rezultat z obratno operacijo ali z računom po drugi poti.
> Oklepaji najprej (od znotraj navzven), nato operacije višje stopnje, nazadnje seštevanje in odštevanje; preizkus na koncu.

<<RACUN
vrednost: 2+3*4 | 14
vrednost: (2+3)*4 | 20
vrednost: 24/6*2 | 8
vrednost: 20-8+3 | 15
vrednost: 36/6/2 | 3
vrednost: 50-(12+3*(7-4)) | 29
vrednost: 3*(4+5) | 27
vrednost: 3*4+3*5 | 27
vrednost: 37*8+37*2 | 370
vrednost: 4*37*25 | 3700
vrednost: 12*15 | 180
vrednost: 5+6*4-18/3 | 23
vrednost: (48-3*6)/5+2*(9-4) | 16
vrednost: 4*125+4*25 | 600
vrednost: 6*99 | 594
vrednost: (14-2*3)*5-6 | 34
vrednost: 20-(8-4) | 16
vrednost: 24/4*3+2 | 20
vrednost: 2*(3+5) | 16
enako: a*(b+c) | a*b+a*c
enako: a*(b-c) | a*b-a*c
>>

:::simboli
a, b, c | poljubna števila | | | zakoni veljajo za vsa števila
:::
