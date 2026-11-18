---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka. Vesoljska sonda pošilja proti Zemlji kode iz štirih znakov. Vsak znak je A, B ali C. Zaradi kontrole napak mora biti znakov A **sodo mnogo** (nič, dva ali štirje). Koliko je takih kod? Poskusi, preden bereš naprej.

Ročno gre po primerih. Brez A je kod $2^4 = 16$. Z dvema A izberemo njuni mesti na $\binom{4}{2} = 6$ načinov, preostali mesti zapolnimo z B ali C na $2^2 = 4$ načine, kar da $24$ kod. S štirimi A je koda ena sama. Skupaj $41$.

Pri dolžini $10$ bi bilo primerov šest, pri dolžini $100$ pa enainpetdeset. Obstaja krajša pot: vse odgovore hkrati zapakiramo v eno funkcijo in dobimo formulo $\frac{3^n + 1}{2}$. Za $n = 10$ to da $29\,525$ kod brez enega samega primera.

Orodje za to je **eksponentna rodovna funkcija**. Zraven spoznaš **Catalanova števila**, ki štejejo presenetljivo veliko struktur: profile leta rakete, pravilne oklepaje, triangulacije mnogokotnikov.

## Razlaga

**Znano orodje: navadna rodovna funkcija.** Zaporedju $a_0, a_1, a_2, \dots$ priredimo formalno potenčno vrsto
$$A(x) = \sum_{n \ge 0} a_n x^n.$$
Spremenljivka $x$ je le obešalnik za člene. Za konvergenco nam ni mar, z vrstami računamo kot s polinomi.

Zaporedju samih enic pripada $\frac{1}{1-x}$. Bistvo je produkt:
$$A(x)B(x) = \sum_{n} \Big(\sum_{k=0}^{n} a_k b_{n-k}\Big) x^n.$$
Če $a_k$ šteje načine za prvi del velikosti $k$, $b_m$ pa za drugi del velikosti $m$, koeficient produkta šteje vse razdelitve $n$ **enakih** enot na dva dela. Primer: $n$ enakih rezervoarjev goriva razdelimo med dva modula postaje. Vsak modul dobi poljubno mnogo rezervoarjev na en način, to je $\frac{1}{1-x}$, zato produkt $\frac{1}{(1-x)^2}$ da $n+1$ načinov.

**Kje navadna odpove.** Pri kodah iz uganke mesta niso enaka: prvo mesto je drugo kot tretje. Ko kodo razdelimo na »mesta z A« in »ostala mesta«, moramo izbrati še, *katera* mesta dobijo A. To je dodatni faktor $\binom{n}{k}$, ki ga navadni produkt ne pozna. Takim objektom pravimo **označeni**.

**Novo orodje: eksponentna rodovna funkcija.** Člene delimo s fakulteto:
$$\hat A(x) = \sum_{n \ge 0} a_n \frac{x^n}{n!}.$$
Pri produktu dveh takih vrst se pri $\frac{x^n}{n!}$ pojavi
$$\sum_{k=0}^{n} \frac{n!}{k!\,(n-k)!}\, a_k b_{n-k} = \sum_{k=0}^{n} \binom{n}{k} a_k b_{n-k}.$$
Binomski koeficient pride sam od sebe. To je **binomska konvolucija**: izberi, katerih $k$ od $n$ oznak gre v prvi del, nato oba dela zgradi neodvisno.

Primerjava drug ob drugem:

| | navadna | eksponentna |
|---|---|---|
| vrsta | $\sum a_n x^n$ | $\sum a_n \frac{x^n}{n!}$ |
| $a_n = 1$ | $\frac{1}{1-x}$ | $e^x$ |
| produkt | $\sum a_k b_{n-k}$ | $\sum \binom{n}{k} a_k b_{n-k}$ |
| objekti | neoznačeni | označeni |
| branje $a_n$ | koeficient pri $x^n$ | $n! \cdot$ koeficient pri $x^n$ |

**Rešitev uganke.** Del z A ima sodo mnogo mest, ki jih zapolnimo na en sam način: $1 + \frac{x^2}{2!} + \frac{x^4}{4!} + \dots = \cosh x = \frac{e^x + e^{-x}}{2}$. Na vsakem ostalem mestu je B ali C, torej $2^m$ možnosti: $\sum 2^m \frac{x^m}{m!} = e^{2x}$. Produkt:
$$\frac{e^x + e^{-x}}{2}\, e^{2x} = \frac{e^{3x} + e^{x}}{2}.$$
Ker je $e^{cx} = \sum c^n \frac{x^n}{n!}$, preberemo $a_n = \frac{3^n + 1}{2}$. Za $n = 4$ dobimo $41$, kot pri ročnem štetju.

:::premisli
Kaj pa, če zahtevamo **liho** mnogo A? Napovej eksponentno rodovno funkcijo in število kod dolžine $4$.
---
Liho mnogo: $x + \frac{x^3}{3!} + \dots = \sinh x = \frac{e^x - e^{-x}}{2}$. Produkt z $e^{2x}$ je $\frac{e^{3x} - e^x}{2}$, torej $a_n = \frac{3^n - 1}{2}$ in $a_4 = 40$. Kontrola: $41 + 40 = 81 = 3^4$, vse kode.
:::

**Catalanova števila: profil leta rakete.** Testna raketa se vsako minuto dvigne ali spusti za en nivo. Začne in konča na tleh, pod tla ne gre. Tak profil dolžine $2n$ je **Dyckova pot** z $n$ dvigi (G) in $n$ spusti (D). Njihovo število je **Catalanovo število** $C_n$. Za $n = 3$ je poti pet:

- GDGDGD, GDGGDD, GGDDGD, GGDGDD, GGGDDD.

Tu ni oznak, ki bi jih premešali, zato se vrnemo k **navadni** funkciji. Vsako neprazno pot razbijemo pri **prvi vrnitvi na tla**: pot $= $ G $P_1$ D $P_2$. Del $P_1$ ima $k$ dvigov in leži en nivo višje, $P_2$ ima preostalih $n-1-k$. Dela se le zlepita, mest ne izbiramo. Torej
$$C_n = \sum_{k=0}^{n-1} C_k\, C_{n-1-k}, \qquad C_0 = 1.$$
V jeziku rodovnih funkcij: $C(x) = 1 + x\,C(x)^2$. Faktor $x$ šteje dodani par G…D. Kvadratna enačba v $C(x)$ da
$$C(x) = \frac{1 - \sqrt{1 - 4x}}{2x}.$$

:::premisli
Kvadratna enačba ima dve rešitvi, s $+$ in z $-$ pred korenom. Zakaj vzamemo minus?
---
Pri $x \to 0$ je števec s plusom blizu $2$, ulomek pa raste kot $\frac{1}{x}$. To ni potenčna vrsta. Z minusom je števec $2x + \dots$ in $C(0) = 1 = C_0$, kot mora biti.
:::

Razvoj korena s posplošenim binomskim izrekom (račun je v »Drugače: Bolj natančno«) da zaključeno obliko
$$C_n = \frac{1}{n+1}\binom{2n}{n}.$$
Prva števila: $1, 1, 2, 5, 14, 42, 132, 429$. Ista števila štejejo pravilna zaporedja $n$ parov oklepajev, triangulacije konveksnega $(n+2)$-kotnika in rokovanja $2n$ ljudi okoli mize brez križanja rok.

## Rešeni primeri

### Primer 1 (lažji): osem minut leta

Testni let rakete traja $8$ minut. Vsako minuto se raketa dvigne ali spusti za en nivo, začne in konča na tleh in nikoli ne gre pod tla. Koliko je možnih profilov leta?

**Podatki:** trajanje $2n = 8$ minut, korak $\pm 1$ nivo, začetek in konec na tleh, nikoli pod tlemi; $C_0 = 1$, $C_1 = 1$, $C_2 = 2$, $C_3 = 5$
**Iščemo:** število profilov $C_4$

:::formula
$C_n = \sum_{k=0}^{n-1} C_k C_{n-1-k}$, kontrola $C_n = \dfrac{1}{n+1}\dbinom{2n}{n}$
:::

**Rešitev:**

1. Dvigov je toliko kot spustov, zato $n = 4$.
2. Razbijemo pri prvi vrnitvi na tla: $C_4 = C_0C_3 + C_1C_2 + C_2C_1 + C_3C_0$.
3. Vstavimo: $1 \cdot 5 + 1 \cdot 2 + 2 \cdot 1 + 5 \cdot 1 = 14$.
4. Kontrola z zaključeno obliko: $\binom{8}{4} = 70$ in $\dfrac{70}{5} = 14$.
5. Odgovor: raketa ima $14$ možnih profilov leta.

### Primer 2: koda s parnostjo

Sonda pošilja kode dolžine $6$ iz znakov A, B, C. Znakov A mora biti sodo mnogo, znakov B liho mnogo, C je poljubno mnogo. Koliko je takih kod?

**Podatki:** dolžina $n = 6$; A sodo-krat, B liho-krat, C poljubno-krat; mesta so razločljiva
**Iščemo:** število kod $a_6$

:::formula
Eksponentne rodovne funkcije: sodo $\to \cosh x$, liho $\to \sinh x$, poljubno $\to e^x$; $a_n = n! \cdot [x^n]$ produkta
:::

**Rešitev:**

1. Mesta so označena, zato množimo eksponentne funkcije: $\cosh x \cdot \sinh x \cdot e^x$.
2. Prva dva faktorja: $\frac{(e^x + e^{-x})(e^x - e^{-x})}{4} = \frac{e^{2x} - e^{-2x}}{4}$.
3. Pomnožimo z $e^x$: $\frac{e^{3x} - e^{-x}}{4}$.
4. Preberemo $a_n = \frac{3^n - (-1)^n}{4}$, ker $e^{cx}$ prispeva $c^n$.
5. Kontrola pri $n = 1$: $\frac{3 + 1}{4} = 1$, edina koda je »B«. Formula je smiselna.
6. Za $n = 6$: $\dfrac{729 - 1}{4} = 182$.
7. Odgovor: kod je $182$.

### Primer 3 (težji): rokovanje pod kupolo

Deset astronavtov stoji okoli okroglega okna razgledne kupole. Vsak se hkrati rokuje z natanko enim drugim, roke pa se nad oknom ne smejo križati. Na koliko načinov se lahko razdelijo v pare?

**Podatki:** $2n = 10$ oseb na krogu, vsak v natanko enem paru, brez križanja; $C_0, \dots, C_4 = 1, 1, 2, 5, 14$
**Iščemo:** število razdelitev v pare

:::formula
Ista rekurzija kot pri Dyckovih poteh: $C_n = \sum_{k=0}^{n-1} C_k C_{n-1-k}$
:::

**Rešitev:**

1. Opazujemo astronavta $1$. Njegov par razdeli ostale na dve strani, ki se med seboj ne smeta rokovati.
2. Na vsaki strani mora biti sodo mnogo ljudi, sicer bi kdo ostal brez para. Par astronavta $1$ porabi dve osebi, ostane jih $8$, torej $4$ pari. Če je na eni strani $k$ parov, je na drugi $4 - k$.
3. Vsaka stran je spet enaka naloga, zato je število razdelitev $\sum_{k=0}^{4} C_k C_{4-k} = C_5$.
4. Izračun: $1 \cdot 14 + 1 \cdot 5 + 2 \cdot 2 + 5 \cdot 1 + 14 \cdot 1 = 42$.
5. Kontrola: $\binom{10}{5} = 252$ in $\dfrac{252}{6} = 42$.
6. Odgovor: astronavti se lahko razdelijo na $42$ načinov.

### Primer 4: zdaj ti

Pet različnih satelitov razporedimo na dve orbiti, nizko in visoko. Vsaka orbita mora dobiti vsaj en satelit. Koliko je razporeditev?

**Podatki:** $n = 5$ označenih satelitov, $2$ različni orbiti, vsaka orbita vsaj $1$ satelit
**Iščemo:** število razporeditev $a_5$

:::formula
Neprazna množica označenih objektov: $e^x - 1$; dve orbiti: $(e^x - 1)^2$
:::

**Rešitev:**

1. Na eno orbito gre $k \ge 1$ satelitov na en način, zato $\frac{x}{1!} + \frac{x^2}{2!} + \dots = e^x - 1$.
2. Sateliti so označeni, torej množimo: $(e^x - 1)^2 = e^{2x} - 2e^x + 1$.
3. Preberi $a_n$ in vstavi $n = 5$.

:::premisli
Koliko je $a_5$?
---
$a_n = 2^n - 2$ za $n \ge 1$, torej $a_5 = 32 - 2 = 30$. Vsak satelit izbere orbito ($2^5$), odštejemo dve razporeditvi s prazno orbito.
:::

## Pogoste napake

- **Navadna funkcija pri označenih objektih.** »Kodo sestavim iz A-dela in ostanka, torej zmnožim navadni funkciji.« Tako dobiš $\sum a_k b_{n-k}$ in šteješ le, *koliko* je A, ne *kje* so. Za $n = 3$ in sodo mnogo A dobiš $8 + 2 = 10$ namesto $14$. Popravek: če so mesta ali objekti razločljivi, množi eksponentne funkcije.
- **Pozabljen $n!$.** Koeficient pri $x^n$ v $\frac{e^{3x}+e^x}{2}$ je $\frac{3^n+1}{2\,n!}$, kar v splošnem ni niti celo število. Popravek: $a_n = n! \cdot [x^n]$. Če dobiš ulomek, kjer šteješ, si pozabil fakulteto.
- **Napačen imenovalec pri Catalanu.** $\frac{1}{n}\binom{2n}{n}$ da za $n = 6$ vrednost $154$ namesto $132$. Popravek: imenovalec je $n+1$; preveri na $C_1 = 1$.
- **Zamik indeksov.** $C_n = \sum_{k=0}^{n} C_k C_{n-k}$ je napačno: dodani par G…D porabi en par, zato dela skupaj nosita $n-1$ parov. Napačna formula da $C_1 = 2C_1$, kar je nesmisel. Tudi: pot dolžine $2n$ ustreza $C_n$, ne $C_{2n}$.
- **Plus pred korenom.** Rešitev $\frac{1+\sqrt{1-4x}}{2x}$ pri $x = 0$ eksplodira, zato ni rodovna funkcija zaporedja.

## Povzetek

- Navadna rodovna funkcija $\sum a_n x^n$: produkt je konvolucija $\sum a_k b_{n-k}$, za neoznačene objekte.
- Eksponentna rodovna funkcija $\sum a_n \frac{x^n}{n!}$: produkt je binomska konvolucija $\sum \binom{n}{k} a_k b_{n-k}$, za označene objekte (kode, razporeditve).
- Gradniki: $e^x$ (poljubno mnogo), $\cosh x$ (sodo), $\sinh x$ (liho), $e^x - 1$ (vsaj en); $a_n = n! \cdot [x^n]$.
- Catalanova števila: $C_0 = 1$, $C_n = \sum_{k=0}^{n-1} C_k C_{n-1-k}$, $C(x) = \frac{1-\sqrt{1-4x}}{2x}$, $C_n = \frac{1}{n+1}\binom{2n}{n}$.
- $C_n$ šteje Dyckove poti dolžine $2n$, pravilne oklepaje z $n$ pari, triangulacije $(n+2)$-kotnika, nekrižna rokovanja $2n$ oseb.

## Za izpit

Znati moraš povedati:
- definicijo navadne in eksponentne rodovne funkcije zaporedja $(a_n)$ ter kako iz vsake prebereš $a_n$;
- formulo za koeficiente produkta dveh navadnih in dveh eksponentnih rodovnih funkcij (konvolucija, binomska konvolucija) z izpeljavo in kombinatoričnim pomenom;
- kdaj uporabiš katero funkcijo (neoznačeni in označeni objekti) ter gradnike $e^x$, $\cosh x$, $\sinh x$, $e^x - 1$;
- definicijo Dyckove poti in izpeljavo rekurzije $C_n = \sum_{k=0}^{n-1} C_k C_{n-1-k}$ z razbitjem pri prvi vrnitvi na tla;
- izpeljavo $C(x) = \frac{1-\sqrt{1-4x}}{2x}$ iz $C(x) = 1 + x\,C(x)^2$ z utemeljitvijo predznaka in zaključeno obliko $C_n = \frac{1}{n+1}\binom{2n}{n}$;
- vsaj tri družine objektov, ki jih šteje $C_n$.

### Naloga 1

Sonda pošilja kode dolžine $n$ iz znakov A, B, C, D. Znakov A mora biti sodo mnogo, znakov B sodo mnogo, znak C se mora pojaviti vsaj enkrat, znakov D je poljubno mnogo. (a) Zapiši eksponentno rodovno funkcijo števila kod $a_n$. (b) Izpelji zaključeno formulo za $a_n$ pri $n \ge 1$ in jo preveri pri $n = 1$ in $n = 2$. (c) Izračunaj $a_6$.

**Rešitev:**

1. Mesta v kodi so razločljiva, zato množimo eksponentne funkcije: A in B vsak $\cosh x$, C da $e^x - 1$, D da $e^x$. Torej $\hat A(x) = \cosh^2 x \cdot (e^x - 1) \cdot e^x$.
2. Kvadrat: $\cosh^2 x = \frac{(e^x + e^{-x})^2}{4} = \frac{e^{2x} + 2 + e^{-2x}}{4}$.
3. Zadnja faktorja: $(e^x - 1)\,e^x = e^{2x} - e^x$.
4. Zmnožimo člen za členom: $\hat A(x) = \frac{e^{4x} - e^{3x} + 2e^{2x} - 2e^{x} + 1 - e^{-x}}{4}$.
5. Ker $e^{cx}$ prispeva $c^n$, konstanta $1$ pa le k členu $n = 0$, je za $n \ge 1$: $a_n = \frac{4^n - 3^n + 2^{n+1} - 2 - (-1)^n}{4}$.
6. Kontrola pri $n = 1$: $\frac{4 - 3 + 4 - 2 + 1}{4} = 1$, edina koda je »C«. Pri $n = 2$: $\frac{16 - 9 + 8 - 2 - 1}{4} = 3$, kode so CC, CD in DC.
7. Za $n = 6$: $\frac{4096 - 729 + 128 - 2 - 1}{4} = \frac{3492}{4} = 873$.
8. Odgovor: $\hat A(x) = \cosh^2 x\,(e^x - 1)\,e^x$, $a_n = \frac{4^n - 3^n + 2^{n+1} - 2 - (-1)^n}{4}$ za $n \ge 1$ in $a_6 = 873$.

### Naloga 2

Testni let rakete traja $12$ minut. Vsako minuto se raketa dvigne ali spusti za en nivo, začne in konča na tleh in nikoli ne gre pod tla. Koliko je profilov leta, pri katerih se raketa med letom natanko dvakrat dotakne tal (začetka in konca ne štejemo)? Nalogo reši z rodovno funkcijo $C(x)$.

**Rešitev:**

1. Dolžina poti je $2n = 12$, torej $n = 6$. Dva vmesna dotika razrežeta pot na tri zaporedne kose; vsak kos se tal dotakne le na začetku in koncu.
2. Tak kos ima obliko G $P$ D, kjer je $P$ poljubna Dyckova pot. Par G…D prispeva faktor $x$, zato je rodovna funkcija kosov $x\,C(x)$.
3. Kosi se le zlepijo (objekti so neoznačeni), zato je rodovna funkcija iskanih poti $\big(x\,C(x)\big)^3 = x^3 C(x)^3$. Iščemo koeficient pri $x^6$, to je koeficient pri $x^3$ v $C(x)^3$.
4. Iz $C(x) = 1 + x\,C(x)^2$ sledi $C(x)^2 = \frac{C(x) - 1}{x}$, zato je koeficient pri $x^m$ v $C(x)^2$ enak $C_{m+1}$: $1, 2, 5, 14$ za $m = 0, 1, 2, 3$.
5. $C(x)^3 = C(x) \cdot C(x)^2$, zato je koeficient pri $x^3$ konvolucija: $C_0 \cdot 14 + C_1 \cdot 5 + C_2 \cdot 2 + C_3 \cdot 1$.
6. Izračun: $1 \cdot 14 + 1 \cdot 5 + 2 \cdot 2 + 5 \cdot 1 = 28$.
7. Odgovor: takih profilov je $28$ (od vseh $C_6 = 132$).

### Naloga 3

Natančno navedi definicijo eksponentne rodovne funkcije. Izpelji formulo za koeficiente produkta dveh eksponentnih rodovnih funkcij in utemelji njen kombinatorični pomen. Z njo utemelji enakost $\sum_{k=0}^{n} \binom{n}{k} = 2^n$.

**Rešitev:**

1. Definicija: eksponentna rodovna funkcija zaporedja $(a_n)_{n \ge 0}$ je formalna potenčna vrsta $\hat A(x) = \sum_{n \ge 0} a_n \frac{x^n}{n!}$. Člen $a_n$ je $n!$-kratnik koeficienta pri $x^n$.
2. Produkt: $\hat A(x)\hat B(x) = \sum_{k \ge 0}\sum_{m \ge 0} a_k b_m \frac{x^{k+m}}{k!\,m!}$. Zberemo člene s $k + m = n$: koeficient pri $x^n$ je $\sum_{k=0}^{n} \frac{a_k b_{n-k}}{k!\,(n-k)!}$.
3. Da dobimo koeficient pri $\frac{x^n}{n!}$, pomnožimo z $n!$: $c_n = \sum_{k=0}^{n} \frac{n!}{k!\,(n-k)!}\, a_k b_{n-k} = \sum_{k=0}^{n} \binom{n}{k} a_k b_{n-k}$. Torej je $\hat A(x)\hat B(x)$ eksponentna rodovna funkcija zaporedja $(c_n)$.
4. Pomen: strukturo na $n$ oznakah sestavimo tako, da izberemo, katerih $k$ oznak dobi prvi del ($\binom{n}{k}$ načinov), na njih zgradimo strukturo prve vrste ($a_k$ načinov), na preostalih $n - k$ oznakah pa strukturo druge vrste ($b_{n-k}$ načinov). Seštejemo po vseh $k$. Zato produkt šteje urejene pare struktur na razbitju označene množice na dva dela.
5. Uporaba: za $a_n = b_n = 1$ je $\hat A(x) = \hat B(x) = e^x$. Produkt je $e^x \cdot e^x = e^{2x} = \sum_{n \ge 0} 2^n \frac{x^n}{n!}$, po formuli iz koraka 3 pa je njegov koeficient $c_n = \sum_{k=0}^{n} \binom{n}{k}$.
6. Dve formalni potenčni vrsti sta enaki natanko tedaj, ko se ujemata v vseh koeficientih, zato $\sum_{k=0}^{n} \binom{n}{k} = 2^n$. Kombinatorično: vsaka od $n$ oznak gre v prvi ali v drugi del.

## Drugače: Na sliki

Dyckovo pot nariši kot gorovje: dvig je »/«, spust »\«. Pot GDGGDD:

:::risba skica
opis: Dyckova pot GDGGDD kot gorovje nad tlemi. Pot gre skozi točke (0, 0), (1, 1), (2, 0), (3, 1), (4, 2), (5, 1), (6, 0). Po prvem dvigu in spustu se pri x = 2 prvič vrne na tla, nato sledi gorovje GGDD z vrhom na višini 2.
območje: -0,6; -0,8 .. 6,6; 2,8
enota: 40
črta: -0,4; 0 -> 6,4; 0 | siva
črta: 0; 0 -> 1; 1 -> 2; 0 -> 3; 1 -> 4; 2 -> 5; 1 -> 6; 0 | modra debelo
točka: 0; 0 | začetek | pod
točka: 2; 0 | prva vrnitev | pod | oranžna
točka: 6; 0 | konec | pod
napis: 0,5; 0,5 | G | nad levo
napis: 1,5; 0,5 | D | nad desno
napis: 2,5; 0,5 | G | nad levo
napis: 3,5; 1,5 | G | nad levo
napis: 4,5; 1,5 | D | nad desno
napis: 5,5; 0,5 | D | nad desno
podnapis: Pot GDGGDD: prva vrnitev na tla je po dveh korakih
:::

Razbitje pri prvi vrnitvi na tla vidiš takoj. Prvi »/« in »\«, kjer se gorovje prvič dotakne tal, objemata gorovje $P_1$, dvignjeno za en nivo. Desno od tega stoji gorovje $P_2$. Tu je $P_1$ prazen, $P_2$ pa je GGDD.

Isto sliko lahko narišeš za triangulacije. Petkotnik ima $C_3 = 5$ triangulacij: izberi oglišče, iz katerega potegneš obe diagonali. Vsako od petih oglišč da eno. Pri šestkotniku jih je že $14$; nariši nekaj in preveri, da se diagonale nikoli ne sekajo.

## Drugače: Uporaba v stroki

**Sklad v prevajalniku in urejanje s skladom.** Računalnik vmesne rezultate in klice funkcij hrani na skladu: »potisni« je G, »vzemi« je D. S praznega sklada ne moreš vzeti ničesar, zato pot ne gre pod tla. Če na sklad po vrsti potisneš elemente $1, 2, \dots, n$ in jih vmes jemlješ, lahko na izhodu dobiš natanko $C_n$ različnih vrstnih redov (Knuth); pri treh elementih pet od šestih, le $3, 1, 2$ ni dosegljiv. Ista števila štejejo dvojiška drevesa z $n$ vozlišči, torej možna razčlenitvena drevesa izraza z $n$ operatorji: pri $n = 10$ jih mora razčlenjevalnik razločiti že $16\,796$.

**Prepletanje dveh procesov.** Prvi proces izvede $k$ korakov, drugi $n-k$, vsak v svojem vrstnem redu, razvrščevalnik pa ju poljubno prepleta. Možnih prepletanj je $\binom{n}{k}$: izbereš le, katera mesta v skupnem zaporedju dobi prvi proces. Natanko to doda eksponentni produkt. Navadni produkt pa ustreza zaporednemu izvajanju, najprej prvi proces, nato drugi, brez prepletanja. Pri preverjanju sočasnih programov je to bistveno: že dva procesa s po $10$ koraki imata $\binom{20}{10} = 184\,756$ prepletanj, pri daljših procesih pa jih je toliko, da jih orodja ne preizkušajo vseh, ampak jih vzorčijo ali enakovredna združujejo.

## Drugače: Bolj natančno

Posplošeni binomski izrek da $\sqrt{1-4x} = \sum_{n \ge 0} \binom{1/2}{n}(-4x)^n$. Za $n \ge 1$ je $\binom{1/2}{n} = \frac{(-1)^{n-1}}{2^{2n-1}\,n}\binom{2n-2}{n-1}$ (v števcu $\frac12 \cdot (-\frac12) \cdots (\frac32 - n)$ izpostavi $2^{-n}$ in dopolni produkt lihih števil do fakultete), zato se koeficient poenostavi v $-\frac{2}{n}\binom{2n-2}{n-1}$. Zato je
$$\frac{1 - \sqrt{1-4x}}{2x} = \sum_{n \ge 1} \frac{1}{n}\binom{2n-2}{n-1} x^{n-1} = \sum_{m \ge 0} \frac{1}{m+1}\binom{2m}{m} x^m.$$

Formalne potenčne vrste tvorijo kolobar; $\frac{1}{1-x}$ je inverz $1-x$ v tem kolobarju, ne vsota konvergentne vrste. Za eksponentne funkcije velja »eksponentna formula«: če $\hat B(x)$ šteje povezane označene strukture, $e^{\hat B(x)}$ šteje vse strukture, ki so disjunktne unije povezanih.

## Preveri se

? Kaj velja za eksponentno rodovno funkcijo zaporedja $(a_n)$?
- $a_n$ je koeficient pri $x^n$.
~ To velja za navadno rodovno funkcijo. Pri eksponentni je $a_n$ koeficient pri $\frac{x^n}{n!}$.
+ $a_n$ je $n!$-kratnik koeficienta pri $x^n$.
- Zaporedju samih enic pripada $\frac{1}{1-x}$.
~ To je navadna rodovna funkcija. Eksponentna za same enice je $e^x$.
> $\hat A(x) = \sum a_n \frac{x^n}{n!}$, zato je koeficient pri $x^n$ enak $\frac{a_n}{n!}$ in $a_n = n! \cdot [x^n]$.

? Primerjaj: (I) $n$ enakih rezervoarjev razdeliš med dva modula; (II) $n$ oštevilčenih satelitov razdeliš med dve orbiti. Katera izbira funkcij je prava?
+ (I) navadna, (II) eksponentna.
- (I) eksponentna, (II) navadna.
~ Obrnjeno: enaki rezervoarji so neoznačeni, oštevilčeni sateliti pa označeni.
- Obe navadni, saj gre obakrat za razdelitev na dva dela.
~ Razdelitev je podobna, a pri satelitih izbiraš še, *kateri* gredo na prvo orbito. Ta $\binom{n}{k}$ da le eksponentni produkt.
> (I): $\frac{1}{(1-x)^2}$ da $n+1$ razdelitev. (II): $e^x \cdot e^x = e^{2x}$ da $2^n$ razporeditev.

? Študent iz $C(x) = 1 + x\,C(x)^2$ zapiše $C(x) = \frac{1 + \sqrt{1-4x}}{2x}$. Kje je napaka?
- Enačba bi morala biti $C(x) = 1 + C(x)^2$.
~ Faktor $x$ je pravilen: šteje dodani par G…D. Brez njega se velikosti delov ne seštejejo pravilno.
+ Napačen predznak: s plusom izraz pri $x \to 0$ raste kot $\frac{1}{x}$ in ni potenčna vrsta s $C_0 = 1$.
- Napake ni, obe rešitvi kvadratne enačbe sta enakovredni.
~ Algebrsko obstajata obe, a le ena je potenčna vrsta s $C(0) = 1$. Kombinatorika izbere njo.
> Z minusom je števec $1 - (1 - 2x - \dots) = 2x + \dots$, zato $C(0) = 1$.

? Koliko je pravilnih zaporedij s $6$ pari oklepajev?
- $924$
~ To je $\binom{12}{6}$, vsa zaporedja s šestimi »(« in šestimi »)«, tudi taka, ki »zaprejo«, preden odprejo.
- $154$
~ To je $\frac{1}{6}\binom{12}{6}$. Imenovalec je $n+1 = 7$, ne $n$.
+ $132$
> $C_6 = \frac{1}{7}\binom{12}{6} = \frac{924}{7} = 132$.

? Teleskop pošlje zaporedje treh meritev, vsaka je označena z A, B ali C. Kontrola zahteva sodo mnogo oznak A. Koliko zaporedij je dopustnih?
- $10$
~ Tako dobiš z navadnim produktom ($8 + 2$): šteješ, koliko je A, ne kje so. Mesta meritev so razločljiva.
- $13$
~ Polovica od $27$ ni celo število. Sodih zaporedij je za eno več kot lihih: $\frac{27+1}{2}$.
+ $14$
> $\frac{e^{3x}+e^x}{2}$ da $\frac{3^3+1}{2} = 14$. Ročno: brez A $8$, z dvema A $3 \cdot 2 = 6$.

:::simboli
A | navadna rodovna funkcija zaporedja (aₙ) | A(x) = \sum_{n \ge 0} a_n x^n
\hat{A} | eksponentna rodovna funkcija zaporedja (aₙ) | \hat A(x) = \sum_{n \ge 0} a_n \frac{x^n}{n!}
B | rodovna funkcija zaporedja (bₙ)
x | formalna spremenljivka | | | le »obešalnik« za člene
a_n, a_k | člen zaporedja (število objektov velikosti n) | | | aₖ za prvi del velikosti k
b | člen zaporedja (bₙ) | | | bₘ za drugi del velikosti m
n | velikost objekta (indeks člena)
k, m | velikosti delov pri sestavljanju | | | k + m = n
C_n, C_k, C_{n-1-k} | Catalanovo število | C_n = \sum_{k=0}^{n-1} C_k\, C_{n-1-k} | | kontrola: Cₙ = (2n)! / (n! (n + 1)!)
C_0 | začetno Catalanovo število | C_0 = 1
C | rodovna funkcija Catalanovih števil | C(x) = 1 + x\,C(x)^2
e | Eulerjevo število | | | e ≈ 2,718
:::
