---
stanje: osnutek
demo: pitagora
avtor: AI
---

## Zakaj se tega učimo

Zidar mora postaviti vogal lope pod pravim kotom, kotnika pa nima pri roki. Ima le vrv, na kateri vozli razdelijo dolžino na $12$ enakih delov. Vrv bo napel v trikotnik tako, da bodo oglišča ravno v vozlih.

**Uganka, preden bereš naprej:** na katere tri dele mora razdeliti $12$ enot, da bo imel trikotnik pravi kot? Nariši nekaj možnosti na karirast papir ali poskusi z vrvico in ravnilom.

Trikotnik $4$, $4$, $4$ je enakostraničen, vsi njegovi koti merijo $60^\circ$. Trikotnik $2$, $5$, $5$ je ozek in koničast. Pravi kot dobiš pri delitvi $3$, $4$, $5$: kot med stranicama s $3$ in $4$ deli je pravi.

Gradbeniki ta trik uporabljajo še danes. Na eni steni odmerijo $60\,\text{cm}$, na drugi $80\,\text{cm}$. Če je razdalja med oznakama natanko $100\,\text{cm}$, je vogal pravi.

Zakaj delujejo ravno števila $3$, $4$ in $5$? Odgovor da **Pitagorov izrek**. Z njim izračunaš tretjo stranico pravokotnega trikotnika, ne da bi jo izmeril: dolžino poševne letve na vratih, strešnega trama ali lestve ob zidu.

## Razlaga

Izrek bomo zgradili po kosih. Za vsakim kosom je kratko vprašanje, s katerim preveriš, ali ga razumeš.

**1. Kateti in hipotenuza.** Pravokotni trikotnik ima en pravi kot. Stranici, ki ta kot oklepata, se imenujeta **kateti** (običajno $a$ in $b$). Stranica, ki leži pravemu kotu nasproti, je **hipotenuza** ($c$). Hipotenuza je vedno najdaljša stranica trikotnika.

*Preveri:* V trikotniku iz uganke (stranice $3$, $4$, $5$), katera stranica je hipotenuza? *Odgovor:* stranica s $5$ deli, ker leži nasproti pravega kota.

**2. Kvadrati nad stranicami.** Nad vsako stranico nariši kvadrat, obrnjen navzven. Kvadrat nad stranico $3$ ima ploščino $3^2 = 9$, kvadrat nad stranico $4$ ploščino $4^2 = 16$, kvadrat nad stranico $5$ pa $5^2 = 25$. Opazi: $9 + 16 = 25$.

Enako se zgodi pri drugih pravokotnih trikotnikih. Hipotenuzo smo izmerili z ravnilom:

| kateta $a$ | kateta $b$ | $a^2 + b^2$ | izmerjena $c$ |
|---|---|---|---|
| $3$ | $4$ | $9 + 16 = 25$ | $5$ |
| $6$ | $8$ | $36 + 64 = 100$ | $10$ |
| $5$ | $12$ | $25 + 144 = 169$ | $13$ |

V vsaki vrstici je vsota v tretjem stolpcu natanko kvadrat izmerjene hipotenuze: $25 = 5^2$, $100 = 10^2$, $169 = 13^2$.

V simulaciji spodaj (Pitagorov izrek s kvadrati) nastavi kateti na $6$ in $8$ ter vklopi »pokaži enotske kvadratke«. Preštej: kvadrata nad katetama imata skupaj natanko toliko kvadratkov kot kvadrat nad hipotenuzo.

*Preveri:* Kvadrata nad katetama imata ploščini $25\,\text{cm}^2$ in $144\,\text{cm}^2$. Kolikšna je ploščina kvadrata nad hipotenuzo? *Odgovor:* $169\,\text{cm}^2$.

**3. Izrek.** Kar smo opazili, velja v vsakem pravokotnem trikotniku. Vsota kvadratov katet je enaka kvadratu hipotenuze:

$$a^2 + b^2 = c^2$$

Izrek govori o ploščinah kvadratov. Dva manjša kvadrata skupaj sta tako velika kot veliki kvadrat.

:::premisli
Ali za dolžine velja tudi $a + b = c$? Napovej za trikotnik $3$, $4$, $5$, preden pogledaš.
---
Ne velja: $3 + 4 = 7$, hipotenuza pa meri le $5$. Pot ob obeh katetah je ovinek, hipotenuza pa je ravna bližnjica med istima ogliščema, zato je krajša. Enakost velja za ploščine kvadratov, ne za dolžine stranic.
:::

**4. Ko iščemo hipotenuzo.** Iz izreka dobimo $c^2$, torej ploščino kvadrata nad hipotenuzo. Stranica kvadrata je kvadratni koren njegove ploščine, zato na koncu korenimo:

$$c = \sqrt{a^2 + b^2}$$

*Preveri:* Kateti merita $6$ in $8$. Koliko je $c^2$ in koliko $c$? *Odgovor:* $c^2 = 100$, $c = \sqrt{100} = 10$.

**5. Ko iščemo kateto.** Kvadrat hipotenuze je vsota obeh kvadratov katet. Če od njega odvzamemo kvadrat znane katete, ostane kvadrat neznane. Nato korenimo:

$$a = \sqrt{c^2 - b^2}$$

:::premisli
Hipotenuza meri $10\,\text{cm}$, ena kateta $6\,\text{cm}$. Ali bi lahko druga kateta merila $12\,\text{cm}$? Odgovori brez računanja in povej, zakaj.
---
Ne more. Hipotenuza je najdaljša stranica, zato je vsaka kateta krajša od $10\,\text{cm}$. Račun to potrdi: $10^2 - 6^2 = 64$, druga kateta meri $8\,\text{cm}$. Če pri kateti dobiš več kot pri hipotenuzi, si kvadrata seštel namesto odštel.
:::

*Preveri:* Hipotenuza meri $13$, ena kateta $12$. Koliko meri druga? *Odgovor:* $\sqrt{169 - 144} = \sqrt{25} = 5$.

**6. Rezultat ni vedno celo število.** Pri katetah $1$ in $1$ dobimo $c^2 = 2$ in $c = \sqrt{2}$. To je iracionalno število, zato ga zapišemo približno: $c \approx 1{,}41$. V delavnici rezultat zaokrožimo na milimeter ali centimeter, kolikor natančno pač meri meter.

*Preveri:* Kateti merita $1\,\text{m}$ in $2\,\text{m}$. Med katerima celima številoma leži hipotenuza? *Odgovor:* $c = \sqrt{5}$; ker je $4 < 5 < 9$, je $c$ med $2$ in $3$.

**7. Izrek velja tudi obratno.** Če za tri dolžine velja $a^2 + b^2 = c^2$ (in je $c$ najdaljša), je trikotnik pravokoten. To je zidarski trik iz uvoda: $60^2 + 80^2 = 3600 + 6400 = 10\,000 = 100^2$, torej je vogal pravi. Če enakost ne velja, kot ni pravi.

*Preveri:* Ali ima trikotnik s stranicami $4$, $5$ in $6$ pravi kot? *Odgovor:* ne, ker je $16 + 25 = 41$, $6^2$ pa je $36$.

## Rešeni primeri

### Primer 1: poševna letev na vratcih

Vrtna vratca so široka $80\,\text{cm}$ in visoka $150\,\text{cm}$. Da se ne povesijo, mizar čeznje pribije poševno letev od enega vogala do nasprotnega. Kako dolga mora biti letev?

**Podatki:** širina $a = 80\,\text{cm}$, višina $b = 150\,\text{cm}$, vogali vratc so pravi koti
**Iščemo:** dolžino letve $c$

:::formula
Letev je hipotenuza: $c = \sqrt{a^2 + b^2}$
:::

**Rešitev:**

1. Širina in višina oklepata pravi kot, zato sta kateti; letev jima leži nasproti in je hipotenuza.
2. Kvadrata katet: $80^2 = 6400$ in $150^2 = 22\,500$.
3. Seštejemo, ker iščemo hipotenuzo: $c^2 = 6400 + 22\,500 = 28\,900$.
4. Korenimo, ker iščemo $c$ in ne $c^2$: $c = \sqrt{28\,900} = 170\,\text{cm}$.
5. Preverimo smiselnost: $170\,\text{cm}$ je več kot vsaka kateta, kot mora biti.
6. Odgovor: letev mora biti dolga $170\,\text{cm}$.

### Primer 2: lestev ob zidu

Pleskar prisloni ob zid $2{,}5\,\text{m}$ dolgo lestev. Njeno spodnje krajišče je $0{,}7\,\text{m}$ od zida. Kako visoko na zidu sega lestev?

**Podatki:** dolžina lestve $c = 2{,}5\,\text{m}$, razdalja od zida $a = 0{,}7\,\text{m}$, zid stoji pravokotno na tla
**Iščemo:** višino $b$, do katere sega lestev

:::formula
Iščemo kateto: $b = \sqrt{c^2 - a^2}$
:::

**Rešitev:**

1. Skica: zid, tla in lestev tvorijo pravokotni trikotnik. Pravi kot je med zidom in tlemi.
2. Lestev leži nasproti pravega kota, zato je hipotenuza. Višina na zidu je kateta.
3. Kvadrata: $2{,}5^2 = 6{,}25$ in $0{,}7^2 = 0{,}49$.
4. Odštejemo, ker iščemo kateto: $b^2 = 6{,}25 - 0{,}49 = 5{,}76$.
5. Korenimo: $b = \sqrt{5{,}76} = 2{,}4\,\text{m}$.
6. Odgovor: lestev sega $2{,}4\,\text{m}$ visoko.

### Primer 3: strešni tram

Hiša je široka $9{,}6\,\text{m}$. Streha ima dve enaki strmini, ki se stikata v slemenu. Sleme je na sredini, $1{,}4\,\text{m}$ nad vrhom zidov. Tesar potrebuje tram od slemena do roba zida in še $0{,}6\,\text{m}$ čez rob, da streha moli čez zid. Kako dolg mora biti tram?

**Podatki:** širina hiše $9{,}6\,\text{m}$, sleme na sredini, višina slemena $b = 1{,}4\,\text{m}$, previs čez zid $0{,}6\,\text{m}$
**Iščemo:** dolžino trama

:::formula
Del trama do roba zida: $c = \sqrt{a^2 + b^2}$, kjer je $a$ polovica širine hiše. Nato prištejemo previs.
:::

**Rešitev:**

1. Sleme je na sredini, zato je vodoravna kateta polovica širine: $a = 9{,}6 : 2 = 4{,}8\,\text{m}$.
2. Navpična kateta je višina slemena, $b = 1{,}4\,\text{m}$. Pravi kot je pod slemenom, kjer se navpičnica sreča z vodoravnico.
3. Kvadrata: $4{,}8^2 = 23{,}04$ in $1{,}4^2 = 1{,}96$.
4. $c^2 = 23{,}04 + 1{,}96 = 25$, zato $c = \sqrt{25} = 5\,\text{m}$.
5. Prištejemo previs, ki ni del trikotnika: $5 + 0{,}6 = 5{,}6\,\text{m}$.
6. Odgovor: tram mora biti dolg $5{,}6\,\text{m}$.

### Primer 4: zdaj ti

Zidar zakoliči temelje vrtne ute, velike $3\,\text{m} \times 5\,\text{m}$. Vogale preveri z diagonalo. Kolikšna mora biti diagonala, če so vsi vogali pravi? Rezultat zaokroži na centimeter.

**Podatki:** stranici pravokotnika $a = 3\,\text{m}$, $b = 5\,\text{m}$, vogali so pravi
**Iščemo:** dolžino diagonale $c$

:::formula
Diagonala razdeli pravokotnik na dva pravokotna trikotnika, zato je $c = \sqrt{a^2 + b^2}$.
:::

**Rešitev:**

1. Stranici pravokotnika sta kateti, diagonala je hipotenuza.
2. $c^2 = 3^2 + 5^2 = 9 + 25 = 34$.
3. Število $34$ ni popoln kvadrat. Koreni sam, zaokroži in preveri s kvadriranjem:

:::premisli
Napovej najprej: ali je $c = \sqrt{34}$ bližje $5$ ali $6$? Nato ga izračunaj in zaokroži na centimeter.
---
$c \approx 5{,}83\,\text{m}$. Ker je $25 < 34 < 36$, leži koren med $5$ in $6$, bližje $6$. Preizkus: $5{,}83^2 = 33{,}9889$, kar je zelo blizu $34$. Če zidar izmeri $5{,}83\,\text{m}$, so vogali pravi.
:::

## Pogoste napake

- **Hipotenuza na napačnem mestu.** Učenec misli: »Podani sta $5$ in $13$, zato je $c = \sqrt{5^2 + 13^2}$.« Napaka je v tem, da $13$ ni nujno kateta. Najprej poišči pravi kot; stranica nasproti njega je $c$, ne glede na to, kako je narisana ali katera je podana zadnja.
- **Pozabljen koren.** Učenec dobi $c^2 = 100$ in zapiše $c = 100$. To je ploščina kvadrata nad hipotenuzo, ne dolžina. Na koncu vedno korenimo: $c = 10$.
- **Seštevanje pri kateti.** Učenec po navadi sešteje: $13^2 + 5^2 = 194$. Tako dobi kateto, daljšo od hipotenuze, kar je nemogoče. Ko iščeš kateto, kvadrata odšteješ.
- **Koren vsote razbit na vsoto.** Učenec piše $\sqrt{5^2 + 12^2} = 5 + 12 = 17$. Koren vsote ni vsota korenov: $\sqrt{25 + 144} = \sqrt{169} = 13$.
- **Izrek pri trikotniku brez pravega kota.** Učenec računa $c$ s Pitagorovim izrekom v enakostraničnem trikotniku. Izrek velja samo, če je en kot pravi; drugače $a^2 + b^2$ ni enako $c^2$.

## Povzetek

- Pravokotni trikotnik: kateti $a$ in $b$ oklepata pravi kot, hipotenuza $c$ leži nasproti njega in je najdaljša.
- Pitagorov izrek: $a^2 + b^2 = c^2$. Govori o ploščinah kvadratov nad stranicami.
- Hipotenuza: $c = \sqrt{a^2 + b^2}$. Kateta: $a = \sqrt{c^2 - b^2}$. Na koncu vedno korenimo.
- Rezultat je lahko iracionalen ($\sqrt{2} \approx 1{,}41$); zapišemo ga z $\approx$ in zaokrožimo.
- Obrat: če za tri dolžine velja $a^2 + b^2 = c^2$, je trikotnik pravokoten (zidarsko pravilo $3$, $4$, $5$).
- Pri besedilnih nalogah najprej nariši skico in označi pravi kot.

## Drugače: Na sliki

Predstavljaj si, da so kvadrati nad stranicami tlakovani s ploščicami velikosti $1 \times 1$. Nad kateto $3$ je kvadrat iz $3 \cdot 3 = 9$ ploščic, nad kateto $4$ kvadrat iz $16$ ploščic. Vseh $25$ ploščic lahko preložiš tako, da natanko pokrijejo kvadrat nad hipotenuzo, ki ima stranico $5$.

Izrek torej najprej govori o **ploščinah**: dva manjša kvadrata skupaj sta tako velika kot veliki. Dolžino stranice dobiš šele, ko ploščino koreniš.

V simulaciji Pitagorov izrek s kvadrati premikaj drsnika za kateti in opazuj števila kvadratkov. Kvadrata nad katetama imata skupaj vedno toliko kvadratkov kot kvadrat nad hipotenuzo. Pri katetah $1$ in $1$ je teh kvadratkov $2$, hipotenuza pa ni celo število.

## Drugače: Bolj natančno

**Zakaj izrek velja za vsak pravokotni trikotnik?** Vzemi štiri enake pravokotne trikotnike s katetama $a$ in $b$ ter dva enaka velika kvadrata s stranico $a + b$.

- V prvi veliki kvadrat postavi trikotnike v vse štiri vogale tako, da hipotenuze v sredini omejijo nagnjen kvadrat. Nepokrit ostane kvadrat s stranico $c$, torej ploščina $c^2$.
- V drugem velikem kvadratu sestavi po dva trikotnika v pravokotnik $a \times b$ in oba pravokotnika položi v nasprotna vogala. Nepokrita ostaneta kvadrata s stranicama $a$ in $b$, torej ploščina $a^2 + b^2$.

Oba velika kvadrata sta enaka in v obeh pokrivajo štirje enaki trikotniki enako ploščino. Zato je tudi nepokrita ploščina enaka: $a^2 + b^2 = c^2$.

**Pitagorejske trojice.** Celoštevilske trojice, za katere izrek velja, so na primer $3, 4, 5$; $5, 12, 13$; $8, 15, 17$; $7, 24, 25$. Velja tudi za njihove večkratnike, npr. $6, 8, 10$ ali $60, 80, 100$. Zato zidarji lahko namesto $3$, $4$, $5$ odmerijo $60\,\text{cm}$, $80\,\text{cm}$ in $100\,\text{cm}$.

## Preveri se

? Katera trditev o pravokotnem trikotniku je pravilna?
+ Hipotenuza leži nasproti pravega kota in je najdaljša stranica.
- Hipotenuza je stranica, ki je na skici narisana poševno.
~ Skico lahko zasukamo. Hipotenuzo določa pravi kot: leži mu nasproti.
- Pitagorov izrek velja za vsak trikotnik.
~ Izrek velja samo za trikotnike s pravim kotom. Npr. pri $4$, $5$, $6$ je $16 + 25 \ne 36$.
- Za dolžine stranic velja $a + b = c$.
~ Enakost velja za kvadrate: $a^2 + b^2 = c^2$. Pri $3$, $4$, $5$ je $3 + 4 = 7$, ne $5$.
> Pravi kot oklepata kateti, hipotenuza mu leži nasproti. Ker je $c^2 = a^2 + b^2$ večje od $a^2$ in od $b^2$, je $c$ najdaljša stranica.

? Hipotenuza meri $13\,\text{cm}$, ena kateta $5\,\text{cm}$. Koliko meri druga kateta?
- $8\,\text{cm}$
~ To je $13 - 5$. Odštevamo kvadrate, ne dolžin: $13^2 - 5^2$.
- približno $13{,}9\,\text{cm}$
~ To je $\sqrt{13^2 + 5^2}$. Pri kateti kvadrata odštejemo; kateta ne more biti daljša od hipotenuze.
+ $12\,\text{cm}$
- $144\,\text{cm}$
~ To je kvadrat iskane katete. Na koncu moraš še koreniti.
> $b^2 = 13^2 - 5^2 = 169 - 25 = 144$, $b = \sqrt{144} = 12\,\text{cm}$.

? Jure je izračunal hipotenuzo: $c = \sqrt{5^2 + 12^2} = 5 + 12 = 17$. Kje je napaka?
- Kvadrata bi moral odšteti, ne sešteti.
~ Jure išče hipotenuzo, zato je seštevanje kvadratov pravilno.
+ Korena vsote ne smemo razbiti na vsoto; prav je $\sqrt{169} = 13$.
- Pozabil je koreniti.
~ Jure ni pozabil koreniti, ampak je korenil napačno: koren je razbil na vsoto.
- Napake ni, hipotenuza meri $17$.
~ Preveri: $5^2 + 12^2 = 169$, $17^2 = 289$. Števili nista enaki, zato $17$ ne more biti prav.
> $\sqrt{5^2 + 12^2} = \sqrt{25 + 144} = \sqrt{169} = 13$. Velja $\sqrt{a^2 + b^2} \ne a + b$.

? Trikotnik A ima stranice $6$, $8$, $10$, trikotnik B pa $5$, $6$, $8$. Kaj velja?
+ A je pravokoten, B ni.
- Oba sta pravokotna, ker je v obeh $8$ ali $10$ najdaljša stranica.
~ Najdaljša stranica obstaja v vsakem trikotniku. Odloča enakost $a^2 + b^2 = c^2$.
- B je pravokoten, ker je $5 + 6 > 8$.
~ $5 + 6 > 8$ pove le, da trikotnik obstaja. Za pravi kot potrebujemo enakost kvadratov.
- Nobeden ni pravokoten.
~ Pri A je $36 + 64 = 100 = 10^2$, zato ima A pravi kot.
> A: $6^2 + 8^2 = 100 = 10^2$, pravokoten. B: $5^2 + 6^2 = 61$, $8^2 = 64$, ni pravokoten.

? Mizar izdeluje pravokoten okvir s stranicama $60\,\text{cm}$ in $80\,\text{cm}$. Kolikšna mora biti diagonala, da so vogali pravi?
- $140\,\text{cm}$
~ To je vsota stranic. Diagonala je bližnjica, zato je krajša od $60 + 80$.
+ $100\,\text{cm}$
- $10\,000\,\text{cm}$
~ To je $c^2$, ploščina kvadrata nad diagonalo. Na koncu korenimo: $\sqrt{10\,000} = 100$.
- približno $52{,}9\,\text{cm}$
~ To je $\sqrt{80^2 - 60^2}$. Diagonala je hipotenuza, zato kvadrata seštejemo.
> $c^2 = 60^2 + 80^2 = 3600 + 6400 = 10\,000$, $c = 100\,\text{cm}$. Če mizar izmeri drugačno diagonalo, okvir ni pravokoten.

:::simboli
a, b | kateta pravokotnega trikotnika | | | kateti oklepata pravi kot
c | hipotenuza | c = \sqrt{a^2 + b^2} | | leži nasproti pravega kota, najdaljša stranica
:::
