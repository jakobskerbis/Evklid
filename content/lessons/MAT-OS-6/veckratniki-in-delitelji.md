---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika v aplikaciji za glasbo na telefonu sestavlja ritem za šolski bend. Kitica pesmi traja $24$ dob (udarcev, ki jih šteješ ob poslušanju). Aplikacija jo razdeli na **takte**, v vsakem taktu je enako število dob. Če zadnji takt ostane nepopoln, aplikacija javi napako. Koliko dob ima lahko takt, da se kitica razdeli brez ostanka?

Hkrati mora Nika nastaviti bas boben, ki udari na vsako četrto dobo. Na katerih dobah ga bo slišati? Na prvo vprašanje odgovorijo **delitelji** števila $24$, na drugo **večkratniki** števila $4$. Na koncu bo Nika uglasila še bas kitaro, pri tem pa ji bo prav prišel kratek zapis produkta, **potenca**.

## Razlaga

**1. Udarci bobna na premici.** Narišimo dobe kitice na številsko premico. Boben začne pri $0$ in vsakič skoči za $4$ dobe naprej:

:::risba premica
opis: Številska premica od 0 do 24 z oznakami na vsake 4 enote. Šest enakih skokov po 4: od 0 do 4, do 8, do 12, do 16, do 20 in do 24. Na teh številih udari boben.
od: 0
do: 24
oznake: 4
skok: 0 -> 4
skok: 4 -> 8
skok: 8 -> 12
skok: 12 -> 16
skok: 16 -> 20
skok: 20 -> 24
:::

Boben udari na dobah $4, 8, 12, 16, 20, 24$. To so števila iz poštevanke števila $4$: $4 \cdot 1$, $4 \cdot 2$, $4 \cdot 3$ in tako naprej. Imenujemo jih **večkratniki** števila $4$.

Če bi bila pesem daljša, bi boben skakal naprej brez konca. Večkratnikov je zato **neskončno mnogo**. Najmanjši večkratnik števila $4$ je $4$ sam.

:::premisli
Ali boben udari na dobi $30$? Napovej s pogledom na skoke, nato preveri z deljenjem.
---
Ne. $30 : 4 = 7$, ostanek $2$. Skoki pristanejo na $28$ in nato na $32$, dobo $30$ preskočijo. Število je večkratnik števila $4$ samo, če se deljenje s $4$ izide brez ostanka.
:::

**2. Takti kot pravokotniki.** Zdaj razporedimo $24$ dob v vrste, vsaka vrsta je en takt. Pri taktu s $4$ dobami dobimo $6$ vrst:

:::risba mreža
opis: Pravokotnik iz 24 kvadratkov: 6 vrst po 4 kvadratke. Vsaka vrsta je takt s 4 dobami.
vrstic: 6
stolpcev: 4
spodaj: 4 dobe v taktu
desno: 6 taktov
:::

Pravokotnik se izide, ker je $24 = 4 \cdot 6$. Iz $24$ kvadratkov lahko sestaviš še druge pravokotnike. Vsak da en par:

| dob v taktu | taktov | zapis |
|---|---|---|
| $1$ ali $24$ | $24$ ali $1$ | $24 = 1 \cdot 24$ |
| $2$ ali $12$ | $12$ ali $2$ | $24 = 2 \cdot 12$ |
| $3$ ali $8$ | $8$ ali $3$ | $24 = 3 \cdot 8$ |
| $4$ ali $6$ | $6$ ali $4$ | $24 = 4 \cdot 6$ |

S $5$ dobami v taktu ne gre: $24 : 5 = 4$, ostanek $4$, zadnji takt bi bil nepopoln. Števila, s katerimi se $24$ deli brez ostanka, so **delitelji** števila $24$. Teh je **končno mnogo**: med njimi sta vedno $1$ in število samo, noben pa ni večji od števila.

V simulaciji spodaj (»Delitelji kot pravokotniki«) nastavi število na $24$, nato na $13$. Opazi: $24$ zložiš v več pravokotnikov, $13$ pa samo v eno vrsto, ker ima le delitelja $1$ in $13$.

**3. Ena enakost, dve imeni.** Zapis $24 = 4 \cdot 6$ pove dvoje hkrati: $24$ je večkratnik števila $4$ in $4$ je delitelj števila $24$. Večkratnike dobiš z množenjem, zato niso manjši od števila. Delitelje dobiš z deljenjem, zato niso večji od števila.

**4. Zapis z znaki.** Število $a$ je večkratnik števila $b$, če je $a = b \cdot n$ za neko naravno število $n$. Tedaj je $b$ delitelj števila $a$. Množico večkratnikov označimo z $V$, množico deliteljev z $D$:

$$V_4 = \{4, 8, 12, 16, 20, 24, \dots\}$$

$$D_{24} = \{1, 2, 3, 4, 6, 8, 12, 24\}$$

**5. Kako najdeš vse delitelje.** Delitelji pridejo v parih, kot stranici pravokotnika. Preizkušaj $1, 2, 3, \dots$ in ob vsakem deljenju, ki se izide, zapiši oba faktorja. Za $36$:

$$36 = 1 \cdot 36 = 2 \cdot 18 = 3 \cdot 12 = 4 \cdot 9 = 6 \cdot 6$$

Število $5$ ne deli števila $36$ (ostanek $1$). Pri $6 \cdot 6$ se faktorja srečata, zato končaš. Večji kandidati bi dali le pare, ki jih že imaš, na primer $9 \cdot 4$. Torej: $D_{36} = \{1, 2, 3, 4, 6, 9, 12, 18, 36\}$.

**6. Potenca: kratek zapis produkta.** Struna A na bas kitari niha $55$-krat na sekundo, rečemo $55$ hercev ($\mathrm{Hz}$). Ton, ki je **oktavo višji**, niha dvakrat hitreje. Nika gre po oktavah navzgor:

| oktav višje | frekvenca v Hz | zapis |
|---|---|---|
| $1$ | $110$ | $55 \cdot 2$ |
| $2$ | $220$ | $55 \cdot 2 \cdot 2$ |
| $3$ | $440$ | $55 \cdot 2 \cdot 2 \cdot 2$ |

Ton $440\,\mathrm{Hz}$ je ton glasbenih vilic, s katerim uglašujemo instrumente. Produkt enakih faktorjev $2 \cdot 2 \cdot 2$ zapišemo krajše kot $2^3$, torej $440 = 55 \cdot 2^3$. Na splošno:

$$a^n = \underbrace{a \cdot a \cdot \ldots \cdot a}_{n \text{ faktorjev}}$$

Število $a$ je **osnova**, $n$ je **eksponent** in pove, koliko enakih faktorjev množimo. Zapis $2^3$ beremo »dva na tretjo«; $a^2$ je tudi kvadrat, $a^3$ pa kub števila $a$. Velja $a^1 = a$. Milijon, ki ima šest ničel, je $10^6$.

Eksponent ni faktor: $2^3 = 2 \cdot 2 \cdot 2 = 8$, ne $2 \cdot 3 = 6$. Potenco izračunaš **pred množenjem**. Vrstni red je: oklepaji, potence, množenje in deljenje, seštevanje in odštevanje. Zato je $3 \cdot 2^3 = 3 \cdot 8 = 24$, $(3 \cdot 2)^3$ pa je $6^3 = 216$.

:::premisli
Lana trdi, da sta $2^5$ in $5^2$ enako veliki, ker sta v obeh zapisih isti števili. Ima prav? Napovej, nato izračunaj.
---
Nima. $2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32$, $5^2 = 5 \cdot 5 = 25$. Osnova in eksponent imata različni vlogi, zato ju ne smeš zamenjati. Med različnimi naravnimi števili se izide le pri enem paru: $2^4 = 4^2 = 16$.
:::

## Rešeni primeri

### Primer 1: večkratniki in delitelji

Zapiši prvih šest večkratnikov števila $7$ in vse delitelje števila $28$.

**Podatki:** število $7$ (prvih šest večkratnikov), število $28$ (vsi delitelji)
**Iščemo:** prvih šest elementov množice $V_7$ in množico $D_{28}$

:::formula
Večkratniki števila $b$: $b \cdot 1,\ b \cdot 2,\ b \cdot 3,\ \dots$; delitelje števila $a$ iščemo kot pare $a = b \cdot c$.
:::

**Rešitev:**

1. Število $7$ množimo z $1, 2, 3, 4, 5, 6$, ker so večkratniki števila iz poštevanke: $7, 14, 21, 28, 35, 42$.
2. Delitelje števila $28$ iščemo v parih: $28 = 1 \cdot 28 = 2 \cdot 14 = 4 \cdot 7$.
3. Števili $3$ in $5$ ne delita $28$ (ostanka $1$ in $3$), prav tako ne $6$. Delitelji, večji od $6$, imajo partnerja, manjšega od $6$, in te pare že imamo ($7$ s $4$, $14$ z $2$, $28$ z $1$). Zato končamo.
4. Odgovor: $V_7 = \{7, 14, 21, 28, 35, 42, \dots\}$ in $D_{28} = \{1, 2, 4, 7, 14, 28\}$. Število $28$ je hkrati večkratnik števila $7$, $7$ pa delitelj števila $28$.

### Primer 2: potence

a) Produkt $7 \cdot 7 \cdot 7 \cdot 7$ zapiši s potenco in izračunaj. b) Izračunaj $2^5$, $5^2$ in $3 \cdot 2^3$.

**Podatki:** a) produkt $7 \cdot 7 \cdot 7 \cdot 7$; b) izrazi $2^5$, $5^2$ in $3 \cdot 2^3$
**Iščemo:** a) zapis s potenco in vrednost; b) vrednosti treh izrazov

:::formula
$a^n$ je produkt $n$ enakih faktorjev $a$; potenco računamo pred množenjem.
:::

**Rešitev:**

1. a) Faktor $7$ se ponovi štirikrat, zato je osnova $7$ in eksponent $4$: $7 \cdot 7 \cdot 7 \cdot 7 = 7^4$.
2. a) Množimo po korakih: $7 \cdot 7 = 49$, $49 \cdot 7 = 343$, $343 \cdot 7 = 2\,401$.
3. b) $2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32$ in $5^2 = 5 \cdot 5 = 25$, zato $2^5 \ne 5^2$.
4. b) V $3 \cdot 2^3$ je najprej na vrsti potenca: $2^3 = 8$, nato $3 \cdot 8 = 24$.
5. Odgovor: a) $7^4 = 2\,401$; b) $32$; $25$ in $24$.

### Primer 3: pevski zbor

Pevski zbor ima $36$ pevcev. Zborovodja jih želi postaviti v enako dolge vrste, da nihče ne ostane sam. V vsaki vrsti naj bo vsaj $3$ in največ $12$ pevcev. Koliko pevcev je lahko v vrsti in koliko vrst nastane?

**Podatki:** $36$ pevcev, enako dolge vrste, v vrsti od $3$ do $12$ pevcev
**Iščemo:** možno število pevcev v vrsti in število vrst

:::formula
Število pevcev v vrsti mora biti delitelj števila $36$; število vrst je količnik $36 : (\text{pevcev v vrsti})$.
:::

**Rešitev:**

1. V vrsti mora biti delitelj števila $36$, sicer bi zadnja vrsta ostala nepopolna.
2. Delitelji v parih: $36 = 1 \cdot 36 = 2 \cdot 18 = 3 \cdot 12 = 4 \cdot 9 = 6 \cdot 6$, torej $D_{36} = \{1, 2, 3, 4, 6, 9, 12, 18, 36\}$.
3. Med $3$ in $12$ so delitelji $3, 4, 6, 9, 12$.
4. Za vsakega izračunaj še število vrst, nato preveri:

:::premisli
Koliko vrst nastane pri $3$, $4$, $6$, $9$ in $12$ pevcih v vrsti? Napovej odgovor iz parov v koraku 2, ne da bi delil, nato preveri.
---
$36 : 3 = 12$, $36 : 4 = 9$, $36 : 6 = 6$, $36 : 9 = 4$, $36 : 12 = 3$. Zbor lahko stoji v $12$, $9$, $6$, $4$ ali $3$ vrstah. Število vrst je vedno partner iz para.
:::

## Pogoste napake

- **Pozabljena $1$ in število samo.** Za $20$ nekdo zapiše $\{2, 4, 5, 10\}$, ker se mu zdita $1$ in $20$ »prelahka«. A $20 : 1 = 20$ in $20 : 20 = 1$ se izideta. Pravilno: $D_{20} = \{1, 2, 4, 5, 10, 20\}$.
- **Zamenjava večkratnikov in deliteljev.** »Večkratniki števila $6$ so $1, 2, 3, 6$.« To so delitelji, dobiš jih z deljenjem. Večkratnike dobiš z množenjem in niso manjši od števila: $6, 12, 18, \dots$
- **Pozabljen partner.** Pri $36$ nekdo najde $1, 2, 3, 4, 6$ in se ustavi. Vsak delitelj ima par: iz $36 = 4 \cdot 9$ je delitelj tudi $9$. Ob vsakem deljenju zapiši še količnik.
- **Eksponent kot faktor.** »$2^3 = 2 \cdot 3 = 6$.« Eksponent pove, koliko enakih faktorjev pišeš: $2^3 = 2 \cdot 2 \cdot 2 = 8$.
- **Potenca za množenjem.** »$3 \cdot 2^3 = 6^3 = 216$.« Potenca je na vrsti pred množenjem: $3 \cdot 2^3 = 3 \cdot 8 = 24$. Najprej množiš le, če je produkt v oklepaju.

## Povzetek

- Večkratniki števila $b$ so $b \cdot 1, b \cdot 2, b \cdot 3, \dots$ (množica $V_b$); neskončno jih je, najmanjši je $b$.
- Delitelji števila $a$ so števila, s katerimi se $a$ deli brez ostanka (množica $D_a$); končno jih je, vedno sta med njimi $1$ in $a$.
- Iz $a = b \cdot n$ sledi: $a$ je večkratnik števila $b$, $b$ je delitelj števila $a$.
- Delitelje iščeš v parih, dokler se faktorja ne srečata: $36 = 1 \cdot 36 = 2 \cdot 18 = 3 \cdot 12 = 4 \cdot 9 = 6 \cdot 6$.
- Potenca $a^n$ je produkt $n$ enakih faktorjev $a$ (osnova $a$, eksponent $n$); $2^3 = 8$, ne $6$; $2^5 \ne 5^2$.
- Vrstni red: oklepaji, potence, množenje in deljenje, seštevanje in odštevanje.

## Drugače: Z analogijo

**Večkratniki so kot koraki po ploščicah.** Če stopiš vedno na vsako tretjo ploščico, stopiš na $3, 6, 9, 12, \dots$ Na ploščico $10$ ne stopiš nikoli, ker $10$ ni večkratnik števila $3$.

**Delitelji so kot rezanje traku.** Trak, dolg $24\,\mathrm{cm}$, režeš na enake kose s celimi centimetri. Kosi so lahko dolgi $1, 2, 3, 4, 6, 8, 12$ ali $24\,\mathrm{cm}$, to so delitelji števila $24$. S kosi po $5\,\mathrm{cm}$ bi ostalo $4\,\mathrm{cm}$.

**Eksponent je kot ponavljalni znak v notah.** Ponavljalni znak pove, kolikokrat zaigraš isti del, da ga ni treba pisati večkrat. Eksponent pove, kolikokrat zapišeš isti faktor: $2^5$ pomeni pet faktorjev $2$, torej $2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32$.

## Drugače: Iz vsakdanjega življenja

**Plačevanje.** Če imaš samo bankovce po $20$ €, lahko plačaš $20$ €, $40$ €, $60$ € … To so večkratniki števila $20$. Zneska $70$ € z njimi ne plačaš brez vračila.

**Pravična delitev.** $24$ bonbonov razdeliš brez ostanka med $2, 3, 4, 6, 8, 12$ ali $24$ otrok, ker so to delitelji števila $24$. Med $5$ otrok ne gre: $24 : 5 = 4$, ostanek $4$.

**Hitra rast potenc.** List papirja prepogneš: po enem pregibu sta $2$ plasti, po dveh $4$, po treh $8$, po štirih $16 = 2^4$. Šahovnica ima $8$ vrst po $8$ polj, torej $8^2 = 64$ polj.

## Preveri se

? Tri od teh števil so delitelji števila $20$, eno ne spada zraven. Katero?
- $1$
~ Morda se ti zdi $1$ »prelahek« delitelj. A $20 : 1 = 20$ brez ostanka; $1$ deli vsako število.
- $5$
~ Morda te zmoti, da je $5$ liho, $20$ pa sodo. Liho število lahko deli sodo: $20 = 5 \cdot 4$.
- $20$
~ Vsako število deli samo sebe: $20 : 20 = 1$.
+ $40$
> $D_{20} = \{1, 2, 4, 5, 10, 20\}$. Število $40 = 20 \cdot 2$ je večkratnik števila $20$, ne delitelj.

? Bas boben udarja na dobah, kamor pristanejo skoki na premici. Prvi udarec je na prvem pristanku. Na kateri dobi je **deveti** udarec?
:::risba premica
opis: Številska premica od 0 do 18 z oznakami na vsake 3 enote. Šest enakih skokov po 3: od 0 do 3, do 6, do 9, do 12, do 15 in do 18.
od: 0
do: 18
oznake: 3
skok: 0 -> 3
skok: 3 -> 6
skok: 6 -> 9
skok: 9 -> 12
skok: 12 -> 15
skok: 15 -> 18
:::
= 27
~ 12 | Devetici si prištel $3$. Udarci so večkratniki števila $3$, zato množiš: $3 \cdot 9$.
~ 24 | To je osmi udarec, $3 \cdot 8$. Deveti je en skok naprej.
~ 30 | To je deseti udarec, $3 \cdot 10$.
> Skoki so dolgi $3$, udarci so na večkratnikih števila $3$: deveti je na dobi $3 \cdot 9 = 27$.

? Frekvenca tona je $55 \cdot 2^3\,\mathrm{Hz}$. Eksponent povečaš za $1$. Kaj se zgodi s frekvenco?
- Poveča se za $1\,\mathrm{Hz}$.
~ Eksponent ni pribitek: večji eksponent pomeni en faktor več, ne enico več.
- Poveča se za $2\,\mathrm{Hz}$.
~ Osnovo $2$ si prištel. Dodatni faktor $2$ pomeni množenje z $2$.
+ Podvoji se: ton je oktavo višji.
> $55 \cdot 2^4 = 55 \cdot 16 = 880$, kar je dvakrat $440$. En faktor $2$ več podvoji vrednost.

? Lana računa $5 + 2 \cdot 3^2$. Korak 1: $3^2 = 9$. Korak 2: $5 + 2 = 7$. Korak 3: $7 \cdot 9 = 63$. Kateri korak je napačen?
- Korak 1
~ $3^2 = 3 \cdot 3 = 9$ je pravilno. Napačno bi bilo $3 \cdot 2 = 6$.
+ Korak 2
- Korak 3
~ $7 \cdot 9 = 63$ je pravilno izračunano, a napaka je nastala korak prej.
- Vsi koraki so pravilni.
~ Seštevanje pred množenjem krši vrstni red operacij.
> Po potenci pride množenje, šele nato seštevanje: $2 \cdot 9 = 18$, nato $5 + 18 = 23$.

? Razvrsti korake iskanja vseh deliteljev števila $30$.
1. Preizkusi $1$: $30 = 1 \cdot 30$, zapiši $1$ in $30$.
2. Preizkusi $2$ in $3$: zapiši pare $2 \cdot 15$ in $3 \cdot 10$.
3. Preizkusi $4$: ostanek je $2$, zato $4$ ni delitelj.
4. Preizkusi $5$: zapiši par $5 \cdot 6$.
5. Naslednji kandidat $6$ je že partner, zato končaj: $D_{30} = \{1, 2, 3, 5, 6, 10, 15, 30\}$.
> Kandidate preizkušaš od najmanjšega navzgor in zapisuješ cele pare. Ko prideš do števila, ki je že partner, si našel vse.

:::simboli
V_4, V_7 | množica večkratnikov števila | | | $V_4$: večkratniki števila $4$
D_{24}, D_{28}, D_{36} | množica deliteljev števila | | | $D_{24}$: delitelji števila $24$
a | število (večkratnik), v potenci osnova | a = b \cdot n | | v $a^n$ osnova potence
b | delitelj števila $a$ | | | $a : b$ se izide brez ostanka
c | drugi delitelj iz para | | | v $a = b \cdot c$
n | naravno število; v potenci eksponent | | | število enakih faktorjev
:::

<<RACUN
vrednost: 7*6 | 42
vrednost: 4*6 | 24
vrednost: 7^4 | 2401
vrednost: 2^5 | 32
vrednost: 5^2 | 25
vrednost: 3*2^3 | 24
vrednost: (3*2)^3 | 216
vrednost: 55*2^3 | 440
vrednost: 55*2^4 | 880
vrednost: 36/3 | 12
vrednost: 36/4 | 9
vrednost: 36/9 | 4
vrednost: 36/12 | 3
vrednost: 3*9 | 27
vrednost: 5+2*3^2 | 23
vrednost: 2^4 | 16
>>
