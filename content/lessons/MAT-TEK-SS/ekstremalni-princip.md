---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na festivalu se pomeri osem glasbenih skupin. Vsaka igra z vsako po en dvoboj, občinstvo izbere zmagovalca, neodločenih izidov ni. Rezultati so lahko čisto zmedeni: skupina A premaga B, B premaga C, C pa premaga A. Najboljše skupine morda sploh ni.

In vendar velja nekaj presenetljivega. Na **vsakem** takem festivalu, ne glede na izide, obstaja skupina, ki lahko za vsako drugo skupino reče: »Premagali smo vas, ali pa smo premagali nekoga, ki je premagal vas.« Takšni skupini rečemo **kralj** turnirja.

Zveni preveč lepo, da bi bilo res. Dokaz pa je kratek, če pogledaš pravo skupino: tisto z **največ zmagami**. To je ekstremalni princip. Med končno mnogo možnostmi izbereš največjo ali najmanjšo. Nato pokažeš: če trditev ne bi veljala, bi obstajala še bolj skrajna možnost, kar ni mogoče.

## Razlaga

**En turnir, štiri skupine.** Začnimo s konkretnimi izidi. Vsak par skupin je odigral en dvoboj, skupaj $\frac{4 \cdot 3}{2} = 6$ dvobojev:

| skupina | premagala je | zmage |
|---|---|---|
| A | B, C | $2$ |
| B | C, D | $2$ |
| C | D | $1$ |
| D | A | $1$ |

Nobena skupina ni premagala vseh. Vzemimo skupino z največ zmagami, recimo A, in preverimo vse druge. B in C je A premagala neposredno. Z D je izgubila, a A je premagala B, B pa je premagala D. Za vsako skupino ima A torej zmago neposredno ali v dveh korakih: A je kralj.

:::premisli
Bi bila kralj tudi katera skupina z najmanj zmagami, C ali D? Napovej, nato preveri v tabeli.
---
D je kralj: premagala je A, A pa je premagala B in C. C ni kralj: premagala je samo D, D pa ni premagala B. Najmanj zmag torej včasih deluje, včasih ne. Zanesljiva izbira je samo tista, pri kateri dokaz deluje vedno: največ zmag.
:::

**Od primera k dokazu.** Naj ima skupina X največ zmag, $m$. Recimo, da X ni kralj. Potem obstaja skupina Y, ki je X ne doseže niti v dveh korakih. Torej X ni premagala Y, in ker neodločenih izidov ni, je Y premagala X. Poleg tega nobena od $m$ skupin, ki jih je premagala X, ni premagala Y, zato je Y premagala vse te. Y ima tako vsaj $m + 1$ zmag, več kot X. To nasprotuje izbiri X. Torej je X kralj.

**Splošni recept.** Ekstremalni princip ima vedno enake tri korake:

1. Izberi skrajni objekt: največji element, točko z največ povezavami, najdaljšo pot, najmanjšo rešitev. Obstajati mora, zato preveri, da je možnosti končno mnogo.
2. Predpostavi, da trditev zanj ne velja.
3. Iz tega sestavi objekt, ki je še bolj skrajen. To je protislovje z izbiro v 1. koraku.

V simulaciji spodaj »Stopnje točk v grafu« s klikom na dve točki dodajaj povezave, dokler nima vsaka točka vsaj treh povezav (število v točki pove, koliko jih ima). Nato poišči najdaljšo pot, torej zaporedje povezanih točk brez ponavljanja. Opazi, da so vsi sosedi njene končne točke že na poti.

**Neskončni spust.** V prejšnji lekciji je monovarianta, ki je nenegativno celo število, zagotovila, da se postopek konča. Neskončni spust je ista misel, obrnjena v dokaz, da nekaj **ne obstaja**. Zaporedje pozitivnih celih števil ne more strogo padati v nedogled. Če iz vsake rešitve naloge znaš sestaviti manjšo, rešitve ni.

Lep primer prihaja iz glasbe. V enakomerni uglasitvi je oktava razdeljena na $12$ enakih poltonov. Vsak polton pomnoži frekvenco z istim faktorom $f$, po $12$ poltonih pa se frekvenca podvoji. Tritonus obsega $6$ poltonov, pol oktave. Če ga zaigraš dvakrat zapored, dobiš oktavo, zato velja $f^6 \cdot f^6 = 2$ in tritonus pomnoži frekvenco z $\sqrt{2}$. Ton, ki je tritonus nad $440\,\mathrm{Hz}$, ima frekvenco približno $440 \cdot 1{,}4142 \approx 622{,}3\,\mathrm{Hz}$. Čista kvinta ima razmerje frekvenc $3 : 2$, razmerje dveh celih števil. Ali ga ima tudi tritonus?

Recimo, da je $\sqrt{2} = \frac{p}{q}$ za pozitivni celi števili $p$ in $q$. Med vsemi takimi zapisi izberemo tistega z najmanjšim $p$. Kvadriramo in dobimo enačbo $p^2 = 2q^2$. Desna stran je soda, kvadrat lihega števila pa je lih, zato je $p$ sod: $p = 2r$. Vstavimo in dobimo $4r^2 = 2q^2$, torej enačbo $q^2 = 2r^2$. Zdaj je tudi $\sqrt{2} = \frac{q}{r}$, pri tem pa je $q < p$, ker je $q = \frac{p}{\sqrt{2}}$. Našli smo zapis z manjšim števcem, kar nasprotuje izbiri. Tritonus v enakomerni uglasitvi nima razmerja celih števil.

:::premisli
Poskusi isti dokaz za $\sqrt{4} = \frac{p}{q}$. Kje se spust ustavi in zakaj?
---
Dobimo enačbo $p^2 = 4q^2$, zato je $p$ sod, $p = 2r$. Vstavimo in dobimo enačbo $4r^2 = 4q^2$, torej $r = q$. Ulomek $\frac{q}{r}$ je zdaj enak $1$, ne $\sqrt{4}$, zato nismo dobili novega zapisa z manjšim števcem. O sodosti $q$ ne izvemo ničesar. Spust se ustavi že v prvem koraku, kar je prav: $\sqrt{4} = \frac{2}{1}$ res je ulomek.
:::

## Rešeni primeri

### Primer 1 (lažji): zvočniki v krogu

Okrog plesišča stoji v krogu $12$ zvočnikov. Tonski mojster je nastavil glasnosti tako, da je glasnost vsakega zvočnika enaka povprečju glasnosti njegovih dveh sosedov. Dokaži, da so vsi zvočniki nastavljeni enako glasno.

**Podatki:** $12$ zvočnikov v krogu, glasnosti $g_1, g_2, \dots, g_{12}$; vsaka je povprečje sosednjih dveh
**Iščemo:** dokaz, da so vse glasnosti enake

:::formula
Pogoj za vsak $i$ (indeksi v krogu, $g_0 = g_{12}$ in $g_{13} = g_1$): $g_i = \frac{g_{i-1} + g_{i+1}}{2}$. Ekstremni objekt: zvočnik z največjo glasnostjo $M$.
:::

**Rešitev:**

1. Glasnosti je končno mnogo, zato je ena od njih največja. Naj bo $M = g_i$.
2. Oba soseda imata glasnost največ $M$. Njuno povprečje je enako $M$ samo, če sta obe enaki $M$. Če bi bila ena manjša, bi bilo povprečje manjše od $M$.
3. Torej sta tudi soseda nastavljena na $M$. Ker ima zdaj glasnost $M$ tudi sosed, isti sklep velja zanj: tudi njegov naslednji sosed ima glasnost $M$.
4. Korak za korakom gremo okrog kroga in pridemo do vseh $12$ zvočnikov.
5. Odgovor: vsi zvočniki imajo glasnost $M$, torej so enako glasni.

### Primer 2: dueti na glasbenem taboru

Na glasbenem taboru je $12$ glasbenikov. Vsak je igral v duetu z vsaj $3$ drugimi. Dokaži, da lahko nekaj glasbenikov, vsaj $4$, sede v krog tako, da je vsak igral v duetu z obema sosedoma.

**Podatki:** $12$ glasbenikov; vsak je igral v duetu z vsaj $3$ drugimi
**Iščemo:** krog vsaj $4$ glasbenikov, kjer je vsak igral z obema sosedoma

:::formula
Ekstremni objekt: najdaljša pot $v_1, v_2, \dots, v_k$. Vsi sosedi krajišča $v_1$ ležijo na tej poti.
:::

**Rešitev:**

1. Glasbenike narišemo kot točke, duet kot povezavo. Stopnja točke je število njenih povezav, tu vsaj $3$.
2. Pot je zaporedje različnih točk, v katerem sta zaporedni točki povezani. Točk je končno mnogo, zato je tudi poti končno mnogo in ena je najdaljša: $v_1, v_2, \dots, v_k$.
3. Vsak sosed točke $v_1$ leži na poti. Če kateri ne bi, bi ga dodali pred $v_1$ in dobili daljšo pot.
4. Točka $v_1$ ima vsaj $3$ različne sosede med $v_2, \dots, v_k$. Njihovi indeksi so različni in vsaj $2$, zato je največji izmed njih vsaj $4$. Označimo ga z $j$.
5. Glasbeniki $v_1, v_2, \dots, v_j$ sedejo v krog v tem vrstnem redu. Zaporedna sta povezana po poti, zadnji $v_j$ pa je sosed prvega $v_1$. V grafu je tak sklenjen krog točk cikel.
6. Odgovor: v krogu je $j \ge 4$ glasbenikov in vsak je igral z obema sosedoma.

### Primer 3 (težji): spust z ostanki pri deljenju s $3$

Ali obstajajo pozitivna cela števila $x$, $y$ in $z$, za katera velja enačba $x^2 + y^2 = 3z^2$?

**Podatki:** enačba $x^2 + y^2 = 3z^2$; $x, y, z$ pozitivna cela števila
**Iščemo:** ali rešitev obstaja

:::formula
Kvadrat celega števila da pri deljenju s $3$ ostanek $0$ ali $1$. Ekstremni objekt: rešitev z najmanjšim $z$.
:::

**Rešitev:**

1. Zakaj samo $0$ ali $1$: število oblike $3t$ ima kvadrat $9t^2$, število oblike $3t \pm 1$ pa kvadrat $9t^2 \pm 6t + 1$, ki da ostanek $1$.
2. Recimo, da rešitve obstajajo, in vzemimo tisto z najmanjšim $z$.
3. Desna stran $3z^2$ je deljiva s $3$. Ostanka $x^2$ in $y^2$ sta $0$ ali $1$, vsota ostankov je deljiva s $3$ le, če sta oba $0$. Torej sta $x$ in $y$ deljiva s $3$: $x = 3a$, $y = 3b$.
4. Vstavimo: $9a^2 + 9b^2 = 3z^2$, zato velja enačba $z^2 = 3(a^2 + b^2)$. Tudi $z^2$ je deljiv s $3$, zato je po 1. koraku $z$ deljiv s $3$: $z = 3c$.
5. Vstavimo še to: $9c^2 = 3(a^2 + b^2)$, torej velja enačba $a^2 + b^2 = 3c^2$.
6. Števila $a$, $b$, $c$ so pozitivna cela in rešijo isto enačbo, pri tem je $c = \frac{z}{3} < z$. To nasprotuje izbiri najmanjšega $z$.
7. Odgovor: pozitivnih celih rešitev ni. Edina celoštevilska rešitev je $x = y = z = 0$.

### Primer 4: zdaj ti

Dokaži, da enačba $x^3 + 2y^3 = 4z^3$ nima rešitve v pozitivnih celih številih.

**Podatki:** enačba $x^3 + 2y^3 = 4z^3$; $x, y, z$ pozitivna cela števila
**Iščemo:** dokaz, da rešitve ni

:::formula
Kub lihega števila je lih. Ekstremni objekt: rešitev z najmanjšim $z$.
:::

**Rešitev:**

1. Recimo, da rešitev obstaja, in vzemimo tisto z najmanjšim $z$.
2. Iz enačbe $x^3 = 4z^3 - 2y^3$ je $x^3$ sod, zato je $x$ sod: $x = 2a$. Vstavimo: $8a^3 + 2y^3 = 4z^3$, po deljenju z $2$ dobimo enačbo $4a^3 + y^3 = 2z^3$.
3. Zdaj je $y^3$ sod, zato $y = 2b$. Vstavimo: $4a^3 + 8b^3 = 2z^3$, po deljenju z $2$ dobimo enačbo $2a^3 + 4b^3 = z^3$.
4. Naredi zadnja dva koraka sam: kaj sledi za $z$ in kako se dokaz konča?

:::premisli
Kaj sledi za $z$ in kje je protislovje?
---
$z^3$ je sod, zato je $z = 2c$. Iz $2a^3 + 4b^3 = 8c^3$ po deljenju z $2$ dobimo enačbo $a^3 + 2b^3 = 4c^3$. Trojica $a$, $b$, $c$ je spet rešitev v pozitivnih celih številih, pri tem pa je $c = \frac{z}{2} < z$. To nasprotuje izbiri najmanjšega $z$, zato rešitve ni.
:::

## Pogoste napake

- **Ekstrem v neskončni množici.** »Vzemimo najmanjše pozitivno racionalno število« ali »največje število na intervalu $(0, 1)$«: takih ni. Pred izbiro vedno preveri, da je možnosti končno mnogo ali da gre za pozitivna cela števila.
- **Napačen ekstrem.** Pri kralju turnirja skupina z najmanj zmagami ne deluje vedno (v tabeli zgoraj C ni kralj). Izberi ekstrem, pri katerem predpostavka »trditev ne velja« ustvari še bolj skrajen objekt.
- **»Ekstrem je en sam.«** Skupin z največ zmagami je lahko več. Dokaz mora delovati za katero koli izbrano.
- **Spust brez pravega padanja.** Nova rešitev mora biti spet pozitivna in strogo manjša. Pri $\sqrt{4}$ novi ulomek $\frac{q}{r}$ ni več enak $\sqrt{4}$, pri $x^2 + y^2 = 3z^2$ pa trojica $0, 0, 0$ preide sama vase. Zato zahtevamo pozitivne rešitve.
- **»Najdaljša pot gre skozi vse točke.«** Ni nujno. Uporabljamo le, da je ni mogoče podaljšati, zato so vsi sosedi krajišča na njej.

## Povzetek

- Ekstremalni princip: izberi največji ali najmanjši objekt, predpostavi, da trditev zanj ne velja, in sestavi še bolj skrajnega.
- Največji in najmanjši element obstajata v končni neprazni množici, najmanjši tudi v vsaki neprazni množici pozitivnih celih števil, ne pa nujno v neskončni množici realnih ali racionalnih števil.
- Kralj turnirja: skupina z največ zmagami premaga vsako drugo neposredno ali v dveh korakih.
- Najdaljša pot v grafu: vsi sosedi krajišča ležijo na poti. Če ima vsaka točka stopnjo vsaj $d \ge 2$, obstaja cikel z vsaj $d + 1$ točkami.
- Neskončni spust: iz vsake pozitivne celoštevilske rešitve sestavi strogo manjšo, zato rešitve ni. Primeri: $\sqrt{2}$ ni ulomek, $x^2 + y^2 = 3z^2$ in $x^3 + 2y^3 = 4z^3$ nimata pozitivnih rešitev.

## Drugače: Z analogijo

**Najnižja tipka klavirja.** Klavir ima $88$ tipk. Igraš melodijo, ki se z vsakim tonom spusti vsaj za polton. Prej ali slej prideš do najnižje tipke in naprej ne gre. Če ti nekdo trdi, da njegova melodija na klavirju pada v nedogled, mu ne verjameš, ne da bi jo slišal. Tak je neskončni spust: pozitivna cela števila so kot tipke, najnižja je $1$.

**Kje analogija šepa.** Tipk je končno mnogo, pozitivnih celih števil pa neskončno. Padati v nedogled vseeno ne moreš, ker je spodaj meja $1$.

## Drugače: Bolj natančno

**Načelo dobre urejenosti.** Vsaka neprazna množica naravnih števil ima najmanjši element. To načelo je enakovredno popolni indukciji. Dokaz z najmanjšim protiprimerom je le drugače zapisana indukcija: če bi trditev kje odpovedala, vzameš najmanjši $n$, kjer odpove, in z manjšimi primeri, kjer še velja, pokažeš, da velja tudi pri $n$.

**Kdaj ekstrem obstaja.** Končna neprazna množica realnih števil ima največji in najmanjši element. Neprazna množica pozitivnih celih števil ima vedno najmanjšega, največjega pa ne nujno. Na intervalu $(0, 1)$ ni ne največjega ne najmanjšega števila.

## Preveri se

? Kaj je v dokazu, da ima vsak turnir brez neodločenih izidov kralja, ekstremni objekt, ki ga izberemo?
- Skupina, ki je premagala vse druge.
~ Take skupine morda ni: pri ciklu A premaga B, B premaga C, C premaga A, nobena ne premaga vseh.
- Skupina z najmanj zmagami.
~ Ne deluje vedno: v tabeli iz razlage ima C najmanj zmag, a ni kralj.
+ Katera koli skupina z največ zmagami.
- Edina skupina z največ zmagami.
~ Skupin z največ zmagami je lahko več. Dokaz deluje za katero koli izmed njih, enoličnosti ne potrebuje.
> Če skupina z največ zmagami ne bi bila kralj, bi skupina, ki je ne doseže, imela več zmag od nje.

? Razvrsti korake dokaza, da $\sqrt{2}$ ni ulomek, v pravilni vrstni red.
1. Recimo, da je $\sqrt{2} = \frac{p}{q}$, in izberimo zapis z najmanjšim $p$.
2. S kvadriranjem dobimo enačbo $p^2 = 2q^2$, zato je $p$ sod.
3. Zapišemo $p = 2r$ in dobimo enačbo $q^2 = 2r^2$.
4. Torej je $\sqrt{2} = \frac{q}{r}$ in $q < p$.
5. To nasprotuje izbiri najmanjšega $p$.
> Najprej izbira skrajnega objekta, nato sklepi, ki dajo manjši števec, na koncu protislovje z izbiro.

? Kaj se zgodi s trditvijo o kralju, če na turnirju dovolimo tudi neodločene dvoboje?
- Ostane resnična, dokaz je enak.
~ Dokaz uporabi sklep »X ni premagala Y, torej je Y premagala X«. Pri neodločenih izidih ta sklep ne velja več.
+ Lahko odpove: če so vsi dvoboji neodločeni, ni nobena skupina premagala nobene.
- Kralj je potem skupina z najmanj neodločenimi izidi.
~ Število neodločenih izidov ne nadomesti zmag. Pri samih neodločenih izidih kralja sploh ni.
> Brez neodločenih izidov vsak dvoboj nekdo dobi. Le zato iz »X ni premagala Y« sledi »Y je premagala X«.

? Na festivalu je $8$ skupin, vsaka igra z vsako en dvoboj brez neodločenih izidov. Najmanj koliko zmag zagotovo ima skupina z največ zmagami?
= 4 | 0,1
~ 3,5 | To je povprečje $\frac{28}{8}$. Zmag je celo število, največje število je vsaj povprečje, zato vsaj $4$.
~ 3 | Če bi imele vse največ $3$ zmage, bi bilo zmag največ $24$, dvobojev pa je $28$.
~ 28 | To je število vseh dvobojev, ne zmag ene skupine.
> Dvobojev je $\frac{8 \cdot 7}{2} = 28$, vsak da eno zmago. Povprečje je $3{,}5$, največje število zmag je vsaj povprečje in celo, zato vsaj $4$. Mogoče je, da imajo štiri skupine po $4$ in štiri po $3$ zmage.

? Na taboru je vsak glasbenik igral v duetu z vsaj $4$ drugimi. Dokaz z najdaljšo potjo iz Primera 2 spet da krog, v katerem je vsak igral z obema sosedoma. Najmanj koliko glasbenikov je zagotovo v tem krogu?
= 5
~ 4 | Krajišče ima vsaj $4$ sosede z indeksi od $2$ naprej, zato je največji indeks vsaj $5$, ne $4$.
> Krajišče $v_1$ najdaljše poti ima vsaj $4$ sosede, vsi so na poti z različnimi indeksi od $2$ naprej. Največji je vsaj $5$, zato krog $v_1, \dots, v_j$ obsega vsaj $5$ glasbenikov.

<<RACUN
vrednost: 4*3/2 | 6
vrednost: 2+2+1+1 | 6
vrednost: 440*sqrt(2) | 622.3
enako: (2*r)^2 | 4*r^2
enako: 9*t^2+6*t+1 | (3*t+1)^2
enako: 9*t^2-6*t+1 | (3*t-1)^2
enako: (3*a)^2+(3*b)^2 | 9*(a^2+b^2)
enako: (2*a)^3 | 8*a^3
enako: (2*b)^3 | 8*b^3
enako: (2*c)^3 | 8*c^3
enako: (3*c)^2 | 9*c^2
vrednost: 8*7/2 | 28
vrednost: 28/8 | 3.5
vrednost: 4*4+4*3 | 28
vrednost: 8*3 | 24
>>

:::simboli
g_i | glasnost $i$-tega zvočnika | g_i = \frac{g_{i-1} + g_{i+1}}{2} | | pogoj iz Primera 1
g_{i-1}, g_{i+1} | glasnosti obeh sosedov | | |
M | največja glasnost | | |
v_1, v_k | krajišči najdaljše poti | | |
i | zaporedna številka zvočnika | | |
g_0, g_{12} | glasnost dvanajstega zvočnika | | | $g_0$ in $g_{12}$ sta isti zvočnik
g_1, g_{13} | glasnost prvega zvočnika | | | $g_{13}$ in $g_1$ sta isti zvočnik
v_2 | druga točka najdaljše poti | | |
z | tretja neznanka v enačbi | | |
:::
