---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Poleti alge na ribniku vsak teden podvojijo površino, ki jo prekrivajo. Danes pokrivajo $1\,\text{m}^2$, čez $x$ tednov torej $2^x\,\text{m}^2$. Kdaj bodo pokrivale $5\,\text{m}^2$? Rešiti moramo enačbo $2^x = 5$.

Tu odpove vse, kar znaš iz eksponentnih enačb: števila $5$ ne moreš zapisati kot potenco števila $2$, zato enačenje osnov ne gre. Ima enačba sploh rešitev?

Alge se za to ne zmenijo. Po dveh tednih pokrivajo $4\,\text{m}^2$, po treh $8\,\text{m}^2$, vmes pa površina raste brez skokov. Nekje med drugim in tretjim tednom torej pokrijejo natanko $5\,\text{m}^2$; graf $y = 2^x$ res seka premico $y = 5$ med $x = 2$ in $x = 3$. To število potrebuje ime in zapis: imenujemo ga **logaritem**, pišemo $\log_2 5$.

Logaritem odgovori na vprašanje: **»Na katero potenco moram dvigniti osnovo, da dobim dano število?«** V naravi ga srečaš pri kislosti dežja (pH), moči potresov in glasnosti grmenja (decibeli). Ko spoznaš **pravila za računanje** in **prehod na novo osnovo**, boš to število tudi izračunal.

## Razlaga

**1. Definicija.** Naj bo $a > 0$, $a \ne 1$ in $b > 0$. **Logaritem** števila $b$ z osnovo $a$ je eksponent, na katerega moramo potencirati $a$, da dobimo $b$:

$$\log_a b = x \iff a^x = b.$$

Število $a$ imenujemo **osnova**, število $b$ pa **logaritmand**. Na primer $\log_2 32 = 5$, ker je $2^5 = 32$, in $\log_3 \dfrac{1}{9} = -2$, ker je $3^{-2} = \dfrac{1}{9}$. Logaritem je torej **eksponent**; to si zapomni, ker iz tega sledi vse ostalo.

**2. Pogoji.** Osnova mora biti pozitivna in različna od $1$. Pri $a \le 0$ potenca $a^x$ ni realno število za vse realne $x$ (na primer $(-4)^{\frac{1}{2}} = \sqrt{-4}$), pri $a = 1$ pa je $1^x = 1$ za vsak $x$, zato $1^x = 5$ nima rešitve. Logaritmand mora biti **pozitiven**, ker je $a^x > 0$ za vsak $x$. Izrazi $\log_2 0$, $\log_2 (-4)$ in $\log_1 5$ niso definirani. Logaritem sam pa je lahko negativen, nič ali pozitiven.

**3. Posebni vrednosti in osnovni zvezi.** Iz definicije neposredno sledi:

$$\log_a 1 = 0, \qquad \log_a a = 1, \qquad \log_a a^x = x, \qquad a^{\log_a b} = b.$$

Zadnji dve zvezi povesta, da potenciranje z osnovo $a$ in logaritmiranje z osnovo $a$ »izničita« drugo drugo.

**4. Posebni osnovi.** Logaritem z osnovo $10$ imenujemo **desetiški logaritem** in ga pišemo brez osnove: $\log b = \log_{10} b$. Velja $\log 1000 = 3$, $\log 1 = 0$, $\log 0{,}01 = -2$. Logaritem z osnovo $\mathrm{e} \approx 2{,}718$ je **naravni logaritem**, pišemo $\ln b = \log_{\mathrm{e}} b$. Za ti dve osnovi ima vsako žepno računalo tipki »log« in »ln«.

:::premisli
Brez računala napovej: je $\log_2 5$ bliže $2$ ali $3$?
---
Bliže $2$. Na sredini med $2$ in $3$ bi bila potenca $2^{2{,}5} = \sqrt{32} \approx 5{,}66$, kar je že več od $5$. Zato je $\log_2 5 < 2{,}5$.
:::

**5. Pravila za računanje: postavi jih ob pravila za potence.** Logaritem je eksponent, zato vsako pravilo za potence z isto osnovo da pravilo za logaritme. Za $a > 0$, $a \ne 1$, $x, y > 0$ in realno število $n$ (pri korenu je $n$ naravno, $n \ge 2$):

- $a^u \cdot a^v = a^{u+v}$, zato $\log_a (xy) = \log_a x + \log_a y$;
- $\dfrac{a^u}{a^v} = a^{u-v}$, zato $\log_a \dfrac{x}{y} = \log_a x - \log_a y$;
- $\left(a^u\right)^n = a^{nu}$, zato $\log_a x^n = n \cdot \log_a x$;
- $\sqrt[n]{a^u} = a^{\frac{u}{n}}$, zato $\log_a \sqrt[n]{x} = \dfrac{1}{n} \log_a x$.

Primeri po vrsti: $\log_2 (4 \cdot 8) = 2 + 3 = 5$, $\;\log 50 - \log 5 = \log 10 = 1$, $\;\log_3 9^5 = 5 \cdot 2 = 10$, $\;\log_2 \sqrt{8} = \dfrac{3}{2}$.

Primerjaj pare. Pri potencah eksponenta $u$ in $v$ vidiš, ker stojita desno zgoraj ob osnovi. Pri logaritmih sta skrita: $u = \log_a x$, $v = \log_a y$. Pravilo je isto, le vsaka računska operacija se pri logaritmih spusti za stopnjo nižje. Množenje števil postane seštevanje logaritmov, deljenje odštevanje, potenciranje pa množenje z eksponentom.

Dokaz prvega pravila: označimo $u = \log_a x$ in $v = \log_a y$, torej $x = a^u$, $y = a^v$. Potem je $x \cdot y = a^{u+v}$ in po definiciji $\log_a (xy) = u + v$.

Pravila uporabljamo v obe smeri: izraz **razčlenimo** (logaritem produkta zapišemo kot vsoto) ali **združimo** (vsoto logaritmov zapišemo kot en logaritem).

:::premisli
Zakaj za $\log_a (x + y)$ ni pravila? Namig: znaš vsoto $a^u + a^v$ zapisati kot eno potenco?
---
Ne znaš: $2^1 + 2^3 = 10$, eksponenta za $10$ ($\log_2 10 \approx 3{,}32$) pa iz $1$ in $3$ ne dobiš s preprostim računom. Ker za vsoto potenc ni pravila, ga ni niti za logaritem vsote. Na primer $\log 20 \approx 1{,}30$, $\log 10 + \log 10 = 2$.
:::

**6. Prehod na novo osnovo (višja raven).** Logaritem z osnovo $a$ lahko izrazimo z logaritmi s katerokoli drugo osnovo $c$ ($c > 0$, $c \ne 1$):

$$\log_a b = \frac{\log_c b}{\log_c a}.$$

Izpeljava: naj bo $x = \log_a b$, torej $a^x = b$. Obe strani logaritmiramo z osnovo $c$ in uporabimo pravilo za potenco: $x \cdot \log_c a = \log_c b$. Delimo z $\log_c a$ (ki ni $0$, ker je $a \ne 1$) in dobimo formulo.

Primerjaj z eksponentnimi enačbami: tam smo obe strani zapisali z **isto osnovo**. Tu pa logaritem z neugodno osnovo zamenjamo s kvocientom dveh logaritmov z **osnovo, ki jo izberemo sami**. Najpogosteje vzamemo $c = 10$ ali $c = \mathrm{e}$:

$$\log_a b = \frac{\log b}{\log a} = \frac{\ln b}{\ln a}.$$

Tako izračunamo tudi število z začetka: $\log_2 5 = \dfrac{\log 5}{\log 2} \approx \dfrac{0{,}69897}{0{,}30103} \approx 2{,}3219$. Preizkus: $2^{2{,}3219} \approx 5{,}000$. Alge torej pokrijejo $5\,\text{m}^2$ po približno $2{,}32$ tedna, to je po približno $16$ dneh. Rešitev torej obstaja, z računalom pa jo izračunaš na nekaj decimalk natančno.

Posledica formule je še zveza $\log_a b \cdot \log_b a = 1$, na primer $\log_2 8 \cdot \log_8 2 = 3 \cdot \dfrac{1}{3} = 1$.

**7. Računanje z naravnim logaritmom.** Za $\ln$ veljajo vse zveze iz blokov 3 in 5, le osnova je $\mathrm{e}$:

$$\ln 1 = 0, \qquad \ln \mathrm{e} = 1, \qquad \ln \mathrm{e}^x = x, \qquad \mathrm{e}^{\ln b} = b.$$

Na primer $\ln \mathrm{e}^5 = 5$, $\;\ln \dfrac{1}{\mathrm{e}^2} = -2$ in $\mathrm{e}^{\ln 7} = 7$. Enačbo $\mathrm{e}^x = b$ rešimo v enem koraku, $x = \ln b$: iz $\mathrm{e}^x = 20$ sledi $x = \ln 20 \approx 3{,}00$. Enačbo z drugo osnovo, na primer $3^x = 20$, logaritmiramo z $\ln$: $x \ln 3 = \ln 20$, zato je $x = \dfrac{\ln 20}{\ln 3} \approx 2{,}73$.

**8. Logaritemska skala (višja raven).** Na navadni osi imajo enako oddaljene oznake enako **razliko** ($0, 1, 2, 3$), na **logaritemski skali** pa enak **količnik** ($1, 10, 100, 1000$). Razmik med sosednjima je **dekada**. Število $b$ leži $\log b$ dekade desno od oznake $1$: oznaka $2$ pri $\log 2 \approx 0{,}30$ dekade (ne na devetini), oznaka $5$ pri $\log 5 \approx 0{,}70$ dekade.

:::risba premica
opis: Logaritemska skala od 1 do 100. Glavne oznake 1, 10 in 100 so enako oddaljene, razdalja med sosednjima je ena dekada. Vmesne oznake 2, 3 in 5 ležijo 0,30; 0,48 in 0,70 dekade desno od oznake 1, oznake 20, 30 in 50 pa enako daleč desno od oznake 10. Oranžna točka na sredini med 10 in 100 pripada številu približno 31,6.
od: 0
do: 2
korak: 1
oznake: ne
oznaka: 0 | 1
oznaka: 0,301 | 2
oznaka: 0,477 | 3
oznaka: 0,699 | 5
oznaka: 1 | 10
oznaka: 1,301 | 20
oznaka: 1,477 | 30
oznaka: 1,699 | 50
oznaka: 2 | 100
točka: 1,5 | ≈ 31,6 | oranžna
podnapis: Na logaritemski skali so enako oddaljena števila z enakim količnikom
:::

Točka, ki leži $t$ dekade desno od oznake $10^n$, pripada številu $10^{n + t}$. Sredina med $10$ in $100$ je zato $10^{1{,}5} \approx 31{,}6$, ne $55$. Tako beremo tudi os grafa z logaritemsko skalo: izmerimo razdaljo točke od zadnje glavne oznake v dekadah in potenciramo. Taka os pride prav, ko podatki segajo čez več velikostnih redov.

**9. Sestavljanje logaritemskega modela (višja raven).** Zveza je logaritemska, kadar se ob vsakem **množenju** $x$ z istim faktorjem $y$ **spremeni za isti korak**. (Pri eksponentni zvezi isti korak pri $x$ pomnoži $y$ z istim faktorjem.) Model je

$$y = A + B \log x.$$

Postopek: preveri, da enaki količniki dajo enake razlike; iz dveh podatkov izračunaj $A$ in $B$; model preveri s tretjim. Tako nastane pH: ko se $c$ podeseteri, pH pade za $1$, pri $c = 1\,\text{mol/L}$ pa je $0$, torej $B = -1$ in $A = 0$. Na grafu z logaritemsko vodoravno osjo je model **premica**.

## Rešeni primeri

### Primer 1 (lažji)

Po definiciji izračunaj: a) $\log_2 32$, b) $\log_3 \dfrac{1}{9}$, c) $\log_4 8$, d) $\log 0{,}001$.

**Podatki:** logaritmi $\log_2 32$, $\log_3 \dfrac{1}{9}$, $\log_4 8$ in $\log 0{,}001$ (desetiški)
**Iščemo:** vrednost vsakega logaritma

:::formula
$\log_a b = x \iff a^x = b$; $\;\dfrac{1}{a^n} = a^{-n}$, $\;a^{\frac{m}{n}} = \sqrt[n]{a^m}$
:::

**Rešitev:**

1. a) Iščemo $x$, za katerega je $2^x = 32$. Ker je $32 = 2^5$, je $\log_2 32 = 5$.
2. b) Iščemo $x$, za katerega je $3^x = \dfrac{1}{9}$. Ker je $\dfrac{1}{9} = 3^{-2}$, je $\log_3 \dfrac{1}{9} = -2$.
3. c) Iščemo $x$, za katerega je $4^x = 8$. Obe števili zapišemo s potenco števila $2$: $2^{2x} = 2^3$, zato je $2x = 3$ in $x = \dfrac{3}{2}$. Preizkus: $4^{\frac{3}{2}} = \left(\sqrt{4}\right)^3 = 2^3 = 8$.
4. d) Iščemo $x$, za katerega je $10^x = 0{,}001 = \dfrac{1}{1000} = 10^{-3}$, torej $\log 0{,}001 = -3$.
5. Odgovor: $\log_2 32 = 5$, $\log_3 \dfrac{1}{9} = -2$, $\log_4 8 = \dfrac{3}{2}$ in $\log 0{,}001 = -3$.

### Primer 2 (srednji)

Brez računala izračunaj: a) $\log_6 9 + \log_6 4$, b) $2\log_3 6 - \log_3 4$.

**Podatki:** izraza $\log_6 9 + \log_6 4$ in $2\log_3 6 - \log_3 4$
**Iščemo:** vrednost vsakega izraza

:::formula
$\log_a x + \log_a y = \log_a (xy)$, $\;\log_a x - \log_a y = \log_a \dfrac{x}{y}$, $\;n \log_a x = \log_a x^n$
:::

**Rešitev:**

1. a) Posamezna logaritma nista »lepi« števili, vsota pa je: $\log_6 9 + \log_6 4 = \log_6 (9 \cdot 4) = \log_6 36$.
2. Ker je $6^2 = 36$, je $\log_6 36 = 2$.
3. b) Najprej koeficient $2$ prenesemo v eksponent: $2\log_3 6 = \log_3 6^2 = \log_3 36$.
4. Nato uporabimo pravilo za razliko: $\log_3 36 - \log_3 4 = \log_3 \dfrac{36}{4} = \log_3 9 = 2$.
5. Preverjanje z računalom: $\log_6 9 \approx 1{,}2263$ in $\log_6 4 \approx 0{,}7737$, vsota je $2{,}0000$.
6. Odgovor: vrednost obeh izrazov je $2$.

### Primer 3 (težji)

Znano je $\log 2 \approx 0{,}3010$ in $\log 3 \approx 0{,}4771$. Brez tipke »log« na računalu izračunaj a) $\log 72$ in b) $\log_6 24$. Rezultat b) zaokroži na tri decimalke.

**Podatki:** $\log 2 \approx 0{,}3010$, $\log 3 \approx 0{,}4771$; izraza $\log 72$ in $\log_6 24$; zaokrožimo na tri decimalke
**Iščemo:** približni vrednosti $\log 72$ in $\log_6 24$

:::formula
$\log (xy) = \log x + \log y$, $\;\log x^n = n \log x$, $\;\log_a b = \dfrac{\log b}{\log a}$
:::

**Rešitev:**

1. a) Število $72$ razcepimo na prafaktorje: $72 = 8 \cdot 9 = 2^3 \cdot 3^2$.
2. $\log 72 = \log 2^3 + \log 3^2 = 3\log 2 + 2\log 3 \approx 3 \cdot 0{,}3010 + 2 \cdot 0{,}4771 = 0{,}9030 + 0{,}9542 = 1{,}8572$.
3. b) Prehod na desetiški logaritem: $\log_6 24 = \dfrac{\log 24}{\log 6}$.
4. Razcepimo: $24 = 2^3 \cdot 3$ in $6 = 2 \cdot 3$. Zato je $\log 24 = 3\log 2 + \log 3 \approx 0{,}9030 + 0{,}4771 = 1{,}3801$ in $\log 6 = \log 2 + \log 3 \approx 0{,}7781$.
5. $\log_6 24 \approx \dfrac{1{,}3801}{0{,}7781} \approx 1{,}7737$, zaokroženo $1{,}774$.
6. Smiselnost: $6^1 = 6$ in $6^2 = 36$, število $24$ leži vmes, zato mora biti $\log_6 24$ med $1$ in $2$. Ujema se.
7. Odgovor: $\log 72 \approx 1{,}857$ in $\log_6 24 \approx 1{,}774$.

### Primer 4 – zdaj ti: tlak v ozračju

Zračni tlak z višino pada: na vsak kilometer višine se zmanjša na približno $88\,\%$ prejšnje vrednosti. Pri tleh je $1013\,\text{hPa}$, zato je na višini $h$ (v km) tlak približno $p = 1013 \cdot 0{,}88^h$ hektopaskalov. Vremenoslovci rišejo posebne karte za plast s tlakom $500\,\text{hPa}$. Na kateri višini je ta plast?

**Podatki:** tlak pri tleh $p_0 = 1013\,\text{hPa}$, faktor $0{,}88$ na kilometer, iskani tlak $p = 500\,\text{hPa}$
**Iščemo:** višino $h$ v kilometrih

:::formula
$p = p_0 \cdot 0{,}88^h$; $\;a^x = b \iff x = \log_a b$; $\;\log_a b = \dfrac{\log b}{\log a}$
:::

**Rešitev:**

1. Enačba: $1013 \cdot 0{,}88^h = 500$. Delimo s $1013$: $0{,}88^h = \dfrac{500}{1013} \approx 0{,}4936$.
2. Po definiciji je $h = \log_{0{,}88} 0{,}4936$. Take tipke ni, zato preidemo na desetiški logaritem: $h = \dfrac{\log 0{,}4936}{\log 0{,}88}$.
3. Zdaj ti: izračunaj kvocient na dve decimalki in preveri smiselnost.

:::premisli
Na kateri višini je plast s tlakom $500\,\text{hPa}$?
---
$\log 0{,}4936 \approx -0{,}3066$ in $\log 0{,}88 \approx -0{,}0555$. Oba logaritma sta negativna (logaritmanda sta manjša od $1$), kvocient je pozitiven: $h \approx 5{,}52$. Smiselnost: $0{,}88^5 \approx 0{,}53$ in $0{,}88^6 \approx 0{,}46$, iskani $0{,}4936$ leži vmes, zato je $h$ med $5$ in $6$. Odgovor: plast s tlakom $500\,\text{hPa}$ je na višini približno $5{,}5\,\text{km}$.
:::

### Primer 5: naravni logaritem

Brez računala izračunaj a) $\ln \mathrm{e}^3 + \ln \dfrac{1}{\mathrm{e}}$ in b) $\mathrm{e}^{2\ln 3}$. Z računalom reši c) enačbo $\mathrm{e}^{2x - 1} = 5$; rezultat zaokroži na dve decimalki.

**Podatki:** izraza $\ln \mathrm{e}^3 + \ln \dfrac{1}{\mathrm{e}}$ in $\mathrm{e}^{2\ln 3}$; enačba $\mathrm{e}^{2x - 1} = 5$; zaokrožimo na dve decimalki
**Iščemo:** vrednosti izrazov in rešitev $x$

:::formula
$\ln \mathrm{e}^x = x$, $\;\mathrm{e}^{\ln b} = b$, $\;n \ln x = \ln x^n$; $\;\mathrm{e}^x = b \iff x = \ln b$
:::

**Rešitev:**

1. a) $\ln \mathrm{e}^3 = 3$ in $\ln \dfrac{1}{\mathrm{e}} = \ln \mathrm{e}^{-1} = -1$, vsota je $3 - 1 = 2$.
2. b) Koeficient $2$ prenesemo v eksponent: $2\ln 3 = \ln 3^2 = \ln 9$.
3. b) Zato je $\mathrm{e}^{2\ln 3} = \mathrm{e}^{\ln 9} = 9$.
4. c) Po definiciji je $2x - 1 = \ln 5$, zato je $x = \dfrac{1 + \ln 5}{2}$.
5. c) Z računalom: $\ln 5 \approx 1{,}6094$ in $x \approx \dfrac{2{,}6094}{2} \approx 1{,}3047$, zaokroženo $1{,}30$.
6. Preizkus: $2 \cdot 1{,}3047 - 1 = 1{,}6094$ in $\mathrm{e}^{1{,}6094} \approx 5{,}000$.
7. Odgovor: a) $2$; b) $9$; c) $x \approx 1{,}30$.

### Primer 6 (višja raven): hitrost hoje v mestih

Tabela kaže izmišljene podatke o povprečni hitrosti hoje pešcev v štirih mestih:

| prebivalci $P$ | hitrost $v$ [m/s] |
|---|---|
| $1000$ | $1{,}10$ |
| $10\,000$ | $1{,}25$ |
| $100\,000$ | $1{,}40$ |
| $1\,000\,000$ | $1{,}55$ |

a) Sestavi model za $v$ v odvisnosti od $P$. b) Kolikšna je $v$ v mestu s $300\,000$ prebivalci? c) Vodoravna os grafa je logaritemska. Mesto M leži $0{,}3$ dekade desno od oznake $10^4$. Koliko prebivalcev ima in kolikšna je tam $v$?

:::risba graf
opis: Graf z logaritemsko vodoravno osjo P: oznake 10³, 10⁴, 10⁵ in 10⁶ prebivalcev so enako oddaljene. Navpična os kaže hitrost hoje v metrih na sekundo od 0,9 do 1,7. Štiri izmerjene točke (10³; 1,10), (10⁴; 1,25), (10⁵; 1,40) in (10⁶; 1,55) ležijo na isti premici. Oranžna točka M leži 0,3 dekade desno od oznake 10⁴, na premici pri hitrosti približno 1,3; črtkani črti jo povežeta z obema osema.
x: 2,5 .. 6,5 | 1 | P
y: 0,9 .. 1,7 | 0,1 | v
oznake: ne
oznakax: 3 | 10^3
oznakax: 4 | 10^4
oznakax: 5 | 10^5
oznakax: 6 | 10^6
oznakay: 1 | 1,0
oznakay: 1,2 | 1,2
oznakay: 1,4 | 1,4
oznakay: 1,6 | 1,6
f: 0.65 + 0.15*x | modra
točka: 3; 1,1
točka: 4; 1,25
točka: 5; 1,4
točka: 6; 1,55
črta: 4,3; 0,9 -> 4,3; 1,295 -> 2,5; 1,295 | oranžna črtkano
točka: 4,3; 1,295 | M | nad levo | oranžna
podnapis: Hitrost hoje v m/s; vodoravna os ima logaritemsko skalo
:::

**Podatki:** tabela štirih parov $(P, v)$; $P = 300\,000$; M leži $0{,}3$ dekade desno od oznake $10^4$
**Iščemo:** a) model $v(P)$, b) $v(300\,000)$, c) $P$ in $v$ za mesto M

:::formula
$v = A + B \log P$; točka $t$ dekade desno od oznake $10^n$ pripada številu $10^{n + t}$
:::

**Rešitev:**

1. a) Ko se $P$ pomnoži z $10$, se $v$ poveča za $0{,}15\,\mathrm{m/s}$: enak količnik, enaka razlika. Model je torej $v = A + B \log P$.
2. a) Iz prvih dveh vrstic: $A + 3B = 1{,}10$ in $A + 4B = 1{,}25$. Odštejemo: $B = 0{,}15$, nato $A = 1{,}10 - 0{,}45 = 0{,}65$.
3. a) Preizkus z zadnjo vrstico: $0{,}65 + 0{,}15 \cdot 6 = 1{,}55$. Model je $v = 0{,}65 + 0{,}15 \log P$ (v $\mathrm{m/s}$).
4. b) $\log 300\,000 \approx 5{,}4771$, zato je $v \approx 0{,}65 + 0{,}15 \cdot 5{,}4771 \approx 1{,}47\,\mathrm{m/s}$.
5. c) M leži pri $\log P = 4 + 0{,}3 = 4{,}3$, zato je $P = 10^{4{,}3} \approx 19\,953$, približno $20\,000$ prebivalcev (ker je $\log 2 \approx 0{,}30$, je to faktor $2$ nad $10^4$).
6. c) Točke ležijo na premici, ker je $v$ linearna funkcija števila $\log P$. Pri M je $v = 0{,}65 + 0{,}15 \cdot 4{,}3 \approx 1{,}3\,\mathrm{m/s}$.
7. Odgovor: a) $v = 0{,}65 + 0{,}15 \log P$; b) približno $1{,}47\,\mathrm{m/s}$; c) približno $20\,000$ prebivalcev in hitrost približno $1{,}3\,\mathrm{m/s}$.

## Pogoste napake

- **Logaritem vsote.** $\log (x + y) = \log x + \log y$ ne velja. Pravilo za vsoto logaritmov govori o **produktu**: $\log x + \log y = \log (xy)$. Preizkus: $\log (10 + 10) = \log 20 \approx 1{,}30$, $\log 10 + \log 10 = 2$. Za logaritem vsote ni posebnega pravila.
- **Kvocient logaritmov namesto logaritma kvocienta.** $\dfrac{\log x}{\log y}$ ni enako $\log \dfrac{x}{y}$. Prvi izraz je po prehodu na novo osnovo $\log_y x$, drugi pa $\log x - \log y$. Primer: $\dfrac{\log 100}{\log 10} = 2$, a $\log \dfrac{100}{10} = 1$.
- **Zamenjana števec in imenovalec pri prehodu (višja raven).** $\log_2 8 = \dfrac{\log 2}{\log 8} = \dfrac{1}{3}$ je napačno. Logaritmand gre v števec, osnova v imenovalec: $\log_2 8 = \dfrac{\log 8}{\log 2} = 3$. Hitri preizkus smiselnosti: $2^3 = 8$.
- **Kvadrat logaritma in logaritem kvadrata.** $\left(\log x\right)^2$ ni isto kot $\log x^2$. Pravilo $\log x^2 = 2\log x$ velja le, ko je eksponent na logaritmandu. Za $x = 1000$: $\left(\log 1000\right)^2 = 9$, $\log 1000^2 = 6$.
- **Logaritem ničle ali negativnega števila.** $\log_2 0 = 0$ ali $\log_3 (-9) = -2$ ni res. Logaritmand mora biti pozitiven, ker nobena potenca s pozitivno osnovo ni $0$ ali negativna. Pazi tudi: $\log_a 1 = 0$, ne $1$, ker je $a^0 = 1$.

## Povzetek

**Definicija** ($a > 0$, $a \ne 1$, $b > 0$):

$$\log_a b = x \iff a^x = b$$

- **Logaritem je eksponent.**

$$\log_a 1 = 0, \quad \log_a a = 1$$

$$\log_a a^x = x, \quad a^{\log_a b} = b$$

- **Desetiški**: $\log b = \log_{10} b$.
- **Naravni**: $\ln b = \log_{\mathrm{e}} b$.

**Pravila:**

$$\log_a (xy) = \log_a x + \log_a y$$

$$\log_a \frac{x}{y} = \log_a x - \log_a y$$

$$\log_a x^n = n \log_a x$$

$$\log_a \sqrt[n]{x} = \frac{1}{n}\log_a x$$

- Za logaritem vsote ali razlike ni pravila.

**Prehod na novo osnovo** (višja raven):

$$\log_a b = \frac{\log_c b}{\log_c a} = \frac{\log b}{\log a}$$

## Ponovitev

**Formule**
- $\log_a b = x \iff a^x = b$; $a > 0$, $a \ne 1$, $b > 0$ (na pamet)
- $\log_a 1 = 0$, $\;\log_a a = 1$, $\;a^{\log_a b} = b$ (na pamet)
- $\log_a (xy) = \log_a x + \log_a y$ (na pamet)
- $\log_a \dfrac{x}{y} = \log_a x - \log_a y$ (na pamet)
- $\log_a x^n = n \log_a x$ (na pamet)
- (višja raven) prehod na novo osnovo: $\log_a b = \dfrac{\log_c b}{\log_c a}$ (priloga, višja raven)

**Postopek**
1. Preveri pogoje: osnova pozitivna in različna od $1$, logaritmand pozitiven.
2. Če se da, logaritem zapiši kot eksponent: $a^x = b$.
3. Vsoto in razliko logaritmov z isto osnovo združi v en logaritem.
4. Eksponent logaritmanda prenesi pred logaritem.
5. Pri različnih osnovah uporabi prehod na novo osnovo (višja raven).

**Pazi na**
- $\log (x + y) \ne \log x + \log y$: za vsoto pravila ni.
- $\dfrac{\log x}{\log y}$ ni $\log \dfrac{x}{y}$, ampak $\log_y x$.
- $\left(\log x\right)^2 \ne \log x^2$: pred logaritem gre le eksponent logaritmanda.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Brez računala izračunajte vrednost izraza $\log_2 24 + \log_2 \dfrac{2}{3} - \log_5 \sqrt{5}$.

**Rešitev:**

1. Logaritma z osnovo $2$ združimo: $\log_2 24 + \log_2 \dfrac{2}{3} = \log_2 \left(24 \cdot \dfrac{2}{3}\right) = \log_2 16 = 4$.
2. Ker je $\sqrt{5} = 5^{\frac{1}{2}}$, je $\log_5 \sqrt{5} = \dfrac{1}{2}$.
3. Vrednost izraza je $4 - \dfrac{1}{2} = \dfrac{7}{2}$.
4. Odgovor: vrednost izraza je $\dfrac{7}{2}$.

**Točkovanje:** 1 točka za združitev v $\log_2 16$ (ali $\log_2 16 = 4$); 1 točka za $\log_5 \sqrt{5} = \dfrac{1}{2}$; 1 točka za rezultat $\dfrac{7}{2}$.

### Naloga 2: krajša strukturirana naloga, 8 točk, pola 2 (z računalom)

Glasnost zvoka $L$ v decibelih izračunamo po formuli $L = 10 \log \dfrac{I}{I_0}$, kjer je $I$ jakost zvoka v $\mathrm{W/m^2}$, $I_0 = 10^{-12}\,\mathrm{W/m^2}$ pa jakost zvoka na pragu slišnosti.

a) Kolikšna je glasnost pogovora z jakostjo $I = 10^{-6}\,\mathrm{W/m^2}$? (2 točki)
b) Kolikšna je glasnost sesalnika z jakostjo $I = 3{,}2 \cdot 10^{-5}\,\mathrm{W/m^2}$? Rezultat zaokrožite na desetinko decibela. (2 točki)
c) Kolikšna je jakost zvoka z glasnostjo $85\,\mathrm{dB}$? Rezultat zapišite na tri veljavna mesta. (2 točki)
d) Za koliko decibelov se poveča glasnost, če jakost zvoka povečamo za faktor $5$? Rezultat zaokrožite na desetinko decibela. (2 točki)

**Rešitev:**

1. a) $\dfrac{I}{I_0} = \dfrac{10^{-6}}{10^{-12}} = 10^6$, zato je $L = 10 \log 10^6 = 10 \cdot 6 = 60\,\mathrm{dB}$.
2. b) $\dfrac{I}{I_0} = \dfrac{3{,}2 \cdot 10^{-5}}{10^{-12}} = 3{,}2 \cdot 10^7$.
3. b) $L = 10 \log \left(3{,}2 \cdot 10^7\right) = 10 \left(\log 3{,}2 + 7\right) \approx 10 \cdot 7{,}50515 \approx 75{,}05$, zaokroženo $75{,}1\,\mathrm{dB}$.
4. c) Iz $10 \log \dfrac{I}{I_0} = 85$ sledi $\log \dfrac{I}{I_0} = 8{,}5$ in po definiciji logaritma $\dfrac{I}{I_0} = 10^{8{,}5}$.
5. c) $I = 10^{-12} \cdot 10^{8{,}5} = 10^{-3{,}5} \approx 3{,}162 \cdot 10^{-4}$, zaokroženo $3{,}16 \cdot 10^{-4}\,\mathrm{W/m^2}$.
6. d) Pri jakosti $5I$ je glasnost $10 \log \dfrac{5I}{I_0} = 10 \log 5 + 10 \log \dfrac{I}{I_0}$, kar je za $10 \log 5$ več kot prej.
7. d) $10 \log 5 \approx 10 \cdot 0{,}69897 \approx 6{,}99$, zaokroženo $7{,}0\,\mathrm{dB}$, ne glede na začetno jakost.
8. Odgovor: a) $60\,\mathrm{dB}$; b) $75{,}1\,\mathrm{dB}$; c) $3{,}16 \cdot 10^{-4}\,\mathrm{W/m^2}$; d) za približno $7{,}0\,\mathrm{dB}$.

**Točkovanje:** a) 1 točka za $\dfrac{I}{I_0} = 10^6$; 1 točka za $60\,\mathrm{dB}$; b) 1 točka za vstavljeno razmerje $3{,}2 \cdot 10^7$; 1 točka za $75{,}1\,\mathrm{dB}$; c) 1 točka za $\dfrac{I}{I_0} = 10^{8{,}5}$; 1 točka za $3{,}16 \cdot 10^{-4}\,\mathrm{W/m^2}$; d) 1 točka za uporabo pravila za logaritem produkta (razlika $10 \log 5$); 1 točka za $7{,}0\,\mathrm{dB}$.

### Naloga 3 (višja raven): strukturirana naloga, 11 točk, pola 1 (brez računala)

Naj bo $r = \log_2 3$.

a) Z $r$ izrazite $\log_2 18$ in $\log_2 \dfrac{9}{16}$. (2 točki)
b) Z $r$ izrazite $\log_3 2$ in $\log_{18} 12$. (3 točke)
c) Z $r$ izrazite $\log_8 \sqrt{27}$. (2 točki)
d) Pokažite, da je $\log_2 3 \cdot \log_3 4 \cdot \log_4 5 \cdot \log_5 6 \cdot \log_6 7 \cdot \log_7 8 = 3$. (2 točki)
e) Na logaritemski skali leži oznaka vsakega števila, večjega od $1$, toliko centimetrov desno od oznake števila $1$, kolikor je njegov logaritem z osnovo $2$. Z $r$ izrazite, kje ležita oznaki števil $3$ in $12$, in ugotovite, katero število ima oznako natanko na sredini med njima. (2 točki)

**Rešitev:**

1. a) $\log_2 18 = \log_2 (2 \cdot 3^2) = \log_2 2 + 2\log_2 3 = 1 + 2r$.
2. a) $\log_2 \dfrac{9}{16} = \log_2 3^2 - \log_2 2^4 = 2r - 4$.
3. b) S prehodom na osnovo $2$: $\log_3 2 = \dfrac{\log_2 2}{\log_2 3} = \dfrac{1}{r}$.
4. b) $\log_{18} 12 = \dfrac{\log_2 12}{\log_2 18} = \dfrac{\log_2 (2^2 \cdot 3)}{1 + 2r} = \dfrac{2 + r}{1 + 2r}$, kjer smo imenovalec vzeli iz a).
5. c) $\sqrt{27} = 3^{\frac{3}{2}}$ in $8 = 2^3$, zato je $\log_8 \sqrt{27} = \dfrac{\log_2 3^{\frac{3}{2}}}{\log_2 8} = \dfrac{\frac{3}{2}r}{3} = \dfrac{r}{2}$.
6. d) Vsak faktor zapišemo z desetiškimi logaritmi: $\log_k (k + 1) = \dfrac{\log (k + 1)}{\log k}$ za $k = 2, 3, \ldots, 7$.
7. d) Produkt je $\dfrac{\log 3}{\log 2} \cdot \dfrac{\log 4}{\log 3} \cdot \dfrac{\log 5}{\log 4} \cdot \dfrac{\log 6}{\log 5} \cdot \dfrac{\log 7}{\log 6} \cdot \dfrac{\log 8}{\log 7}$. Vsak števec se okrajša z imenovalcem naslednjega faktorja.
8. d) Ostane $\dfrac{\log 8}{\log 2} = \log_2 8 = 3$, kar smo želeli pokazati.
9. e) Oznaka števila $3$ leži $\log_2 3 = r$ centimetrov desno od oznake števila $1$, oznaka števila $12$ pa $\log_2 12 = 2 + r$ centimetrov (kot v b)).
10. e) Sredina med oznakama leži $\dfrac{r + (2 + r)}{2} = 1 + r$ centimetrov desno od oznake števila $1$. Ker je $1 + r = \log_2 2 + \log_2 3 = \log_2 6$, je tam oznaka števila $6$, ne aritmetične sredine $\dfrac{3 + 12}{2} = 7{,}5$.
11. Odgovor: a) $1 + 2r$ in $2r - 4$; b) $\dfrac{1}{r}$ in $\dfrac{2 + r}{1 + 2r}$; c) $\dfrac{r}{2}$; d) produkt je enak $3$; e) oznaki ležita $r$ in $2 + r$ centimetrov desno od oznake števila $1$, na sredini med njima je oznaka števila $6$.

**Točkovanje:** a) 1 točka za $1 + 2r$; 1 točka za $2r - 4$; b) 1 točka za $\log_3 2 = \dfrac{1}{r}$; 1 točka za prehod $\log_{18} 12 = \dfrac{\log_2 12}{\log_2 18}$; 1 točka za $\dfrac{2 + r}{1 + 2r}$; c) 1 točka za prehod na osnovo $2$ z $\log_2 \sqrt{27} = \dfrac{3}{2}r$; 1 točka za $\dfrac{r}{2}$; d) 1 točka za zapis faktorjev s prehodom na skupno osnovo; 1 točka za krajšanje do $\log_2 8 = 3$; e) 1 točka za legi $r$ in $2 + r$; 1 točka za število $6$ z utemeljitvijo $1 + r = \log_2 6$.

### Ustno vprašanje 1

:::premisli
Definiraj logaritem števila $b$ z osnovo $a$ in navedi pogoje, ki jih morata izpolnjevati $a$ in $b$.
---
Logaritem števila $b$ z osnovo $a$ je eksponent $x$, na katerega moramo potencirati $a$, da dobimo $b$: $\log_a b = x \iff a^x = b$. Osnova mora biti pozitivna in različna od $1$. Logaritmand $b$ mora biti pozitiven, ker je potenca s pozitivno osnovo vedno pozitivna. Sam logaritem je lahko poljubno realno število.
:::

### Ustno vprašanje 2

:::premisli
Dokaži pravilo za logaritem produkta $\log_a (xy) = \log_a x + \log_a y$ za pozitivni števili $x$ in $y$.
---
Označimo $u = \log_a x$ in $v = \log_a y$. Po definiciji logaritma je $x = a^u$ in $y = a^v$. Po pravilu za množenje potenc z isto osnovo je $xy = a^u \cdot a^v = a^{u+v}$. Po definiciji logaritma je zato $\log_a (xy) = u + v = \log_a x + \log_a y$.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Izpelji formulo za prehod na novo osnovo logaritma in pojasni, zakaj jo potrebujemo pri računalu.
---
Naj bo $x = \log_a b$, torej $a^x = b$. Obe strani logaritmiramo z novo osnovo $c$, kjer je $c > 0$ in $c \ne 1$, in po pravilu za logaritem potence dobimo $x \cdot \log_c a = \log_c b$. Ker je $a \ne 1$, je $\log_c a \ne 0$, zato smemo deliti in dobimo $\log_a b = \dfrac{\log_c b}{\log_c a}$. Računalo ima navadno le desetiški in naravni logaritem, zato s to formulo izračunamo logaritem s poljubno osnovo.
:::

## Drugače: Na sliki

Nariši tabelo potenc števila $2$ in jo beri v obe smeri:

| eksponent $x$ | potenca $2^x$ |
|---|---|
| $-2$ | $\frac{1}{4}$ |
| $-1$ | $\frac{1}{2}$ |
| $0$ | $1$ |
| $1$ | $2$ |
| $2$ | $4$ |
| $3$ | $8$ |
| $4$ | $16$ |
| $5$ | $32$ |

Če bereš od leve proti desni, potenciraš. Če bereš od desne proti levi, logaritmiraš: levo od $16$ piše eksponent $4$, zato je $\log_2 16 = 4$. Število $5$ v desnem stolpcu manjka, leži med $4$ in $8$, zato je $\log_2 5$ med $2$ in $3$.

Enako lahko narediš na grafu funkcije $y = 2^x$: namesto da od osi $x$ greš navpično do krivulje, greš z osi $y$ (pri višini $5$) vodoravno do krivulje in nato navpično navzdol na os $x$. Prebrana abscisa, približno $2{,}32$, je $\log_2 5$. Če graf prezrcališ čez simetralo lihih kvadrantov $y = x$, dobiš krivuljo, s katere logaritme bereš kar navpično. To pokaže interaktivna simulacija spodaj (»Logaritem kot obratna funkcija«).

## Drugače: Iz vsakdanjega življenja

**Kislost (pH).** Kemiki kislost raztopine opišejo s številom $\mathrm{pH} = -\log c$, kjer je $c$ množinska koncentracija oksonijevih ionov $\mathrm{H_3O^+}$ v $\text{mol/L}$. Pri $c = 0{,}001\,\text{mol/L} = 10^{-3}\,\text{mol/L}$ je $\mathrm{pH} = -(-3) = 3$, podobno kot pri kisu. Čista voda ima $c = 10^{-7}\,\text{mol/L}$ in $\mathrm{pH} = 7$. Nekoliko kisel je že čist dež ($\mathrm{pH} \approx 5{,}6$), kisli dež pa ima pH še nižji. Ker je lestvica logaritemska, je raztopina s $\mathrm{pH} = 3$ **desetkrat** bolj kisla od raztopine s $\mathrm{pH} = 4$, ne le malo bolj.

**Decibeli.** Glasnost zvoka v decibelih izračunamo po $L = 10 \log \dfrac{I}{I_0}$, kjer je $I$ jakost zvoka, $I_0$ pa jakost na pragu slišnosti. Če jakost podvojiš (na primer dva enaka zvočnika namesto enega), se glasnost poveča za $10 \log 2 \approx 3\,\text{dB}$, ne za dvakrat. Tu deluje pravilo za logaritem produkta: $\log \dfrac{2I}{I_0} = \log 2 + \log \dfrac{I}{I_0}$.

Logaritme uporabljamo povsod, kjer se količine razlikujejo za veliko velikostnih redov, saj jih stisnejo na pregledno lestvico.

## Drugače: Korak za korakom s številkami

**Razčleni $\log_a \dfrac{x^3 \sqrt{y}}{z^2}$ za $x, y, z > 0$.**

1. Kvocient: $\log_a \left(x^3 \sqrt{y}\right) - \log_a z^2$.
2. Produkt v števcu: $\log_a x^3 + \log_a \sqrt{y} - \log_a z^2$.
3. Potence: $\sqrt{y} = y^{\frac{1}{2}}$, zato dobimo $3\log_a x + \dfrac{1}{2}\log_a y - 2\log_a z$.

**Izračunaj $\log_3 20$ z računalom (višja raven).**

1. Če ima računalo le »log« in »ln«, uporabimo prehod na novo osnovo: $\log_3 20 = \dfrac{\log 20}{\log 3}$.
2. $\log 20 \approx 1{,}30103$ in $\log 3 \approx 0{,}47712$.
3. Delimo: $\dfrac{1{,}30103}{0{,}47712} \approx 2{,}7268$.
4. Preverimo smiselnost: $3^2 = 9 < 20 < 27 = 3^3$, zato mora biti rezultat med $2$ in $3$.
5. Z naravnim logaritmom dobimo isto: $\dfrac{\ln 20}{\ln 3} \approx \dfrac{2{,}99573}{1{,}09861} \approx 2{,}7268$.

## Drugače: Bolj natančno

**Logaritem je dobro definiran.** Za $a > 0$, $a \ne 1$ je funkcija $x \mapsto a^x$ strogo monotona in njena zaloga vrednosti je interval $(0, \infty)$. Zato za vsak $b > 0$ obstaja **natanko en** $x$, da je $a^x = b$. Prav to število označimo z $\log_a b$. Obstoj zagotavlja zaloga vrednosti, enoličnost pa monotonost. Za $a = 1$ bi bila enačba $1^x = b$ rešljiva le pri $b = 1$, in to s poljubnim $x$, zato osnova $1$ ni dovoljena.

**Dokaz pravila za potenco.** Naj bo $u = \log_a x$, torej $x = a^u$. Potem je $x^n = \left(a^u\right)^n = a^{nu}$, zato je $\log_a x^n = nu = n\log_a x$. Pravilo za kvocient dobimo iz pravil za produkt in potenco: $\log_a \dfrac{x}{y} = \log_a \left(x \cdot y^{-1}\right) = \log_a x - \log_a y$.

**Posledice prehoda na novo osnovo (višja raven).** Če v formuli vzamemo $c = b$ (za $b \ne 1$), dobimo $\log_a b = \dfrac{1}{\log_b a}$. Prav tako velja $\log_{a^k} b = \dfrac{1}{k}\log_a b$, na primer $\log_4 8 = \dfrac{1}{2}\log_2 8 = \dfrac{3}{2}$, kar se ujema s Primerom 1. Ker so logaritmi z osnovo $a$ sorazmerni logaritmom z osnovo $c$ ($\log_a b = \dfrac{1}{\log_c a} \cdot \log_c b$ za vsak $b > 0$), je na računalu dovolj ena sama osnova.

## Preveri se

? Katera trditev je pravilna za vse $x, y > 0$?
- $\log (x + y) = \log x + \log y$
~ Pravilo za vsoto logaritmov govori o produktu. Za logaritem vsote pravila ni: $\log 20 \approx 1{,}30$, $\log 10 + \log 10 = 2$.
+ $\log (xy) = \log x + \log y$
- $\dfrac{\log x}{\log y} = \log \dfrac{x}{y}$
~ Kvocient logaritmov je po prehodu na novo osnovo $\log_y x$, ne logaritem kvocienta: $\dfrac{\log 100}{\log 10} = 2$, $\log 10 = 1$.
- $(\log x)^2 = 2\log x$
~ Eksponent smeš prestaviti pred logaritem le, če je na logaritmandu: $\log x^2 = 2\log x$. Za $x = 1000$ je $(\log x)^2 = 9$, $2\log x = 6$.
> Logaritem produkta je vsota logaritmov, ker se pri množenju potenc z isto osnovo eksponenta seštejeta.

? Koliko je $\log_2 12 - \log_2 3$?
- $\log_2 9$
~ Razlika logaritmov ni logaritem razlike $12 - 3$, ampak logaritem kvocienta.
+ $2$
- $4$
~ $\dfrac{12}{3} = 4$ je logaritmand. Treba je še logaritmirati: $\log_2 4 = 2$.
- $\log_2 36$
~ Logaritmanda si zmnožil; to velja za vsoto logaritmov, ne za razliko.
> Razlika logaritmov je logaritem kvocienta: $\log_2 \dfrac{12}{3} = \log_2 4 = 2$.

? Sošolka je računala (napačno): $\log_3 (9 \cdot 27) = \log_3 9 \cdot \log_3 27 = 2 \cdot 3 = 6$. Kje je napaka?
- $\log_3 27$ ni $3$
~ Je: $3^3 = 27$. Napaka je že v prvem koraku.
+ logaritem produkta je vsota logaritmov, pravilno $2 + 3 = 5$
- napake ni, rezultat je $6$
~ Preveri: $3^6 = 729$, $9 \cdot 27 = 243 = 3^5$. Rezultat $6$ je napačen.
- napaka je v $2 \cdot 3$, prav je $2^3 = 8$
~ Logaritmov ne potenciramo med seboj. Težava ni v računanju, ampak v napačnem pravilu.
> $\log_3 (9 \cdot 27) = \log_3 9 + \log_3 27 = 2 + 3 = 5$; res je $3^5 = 243 = 9 \cdot 27$.

? Primerjaj $\log_2 7$ in $\log_3 7$. Kaj velja?
+ $\log_2 7 > \log_3 7$
- $\log_2 7 < \log_3 7$
~ Večja osnova ne pomeni večjega logaritma. Večjo osnovo moraš dvigniti na manjšo potenco, da dobiš isto število.
- sta enaka, ker je logaritmand isti
~ Logaritem je odvisen tudi od osnove: $\log_2 4 = 2$, $\log_4 4 = 1$.
- brez računala ju ni mogoče primerjati
~ Dovolj je oceniti: $2^2 < 7 < 2^3$ in $3^1 < 7 < 3^2$.
> $\log_2 7$ je med $2$ in $3$, $\log_3 7$ pa med $1$ in $2$. Prehod na novo osnovo: $\log_2 7 \approx 2{,}807$, $\log_3 7 \approx 1{,}771$.

? Kislost dežja meri $\mathrm{pH} = -\log c$, kjer je $c$ koncentracija oksonijevih ionov. Čist dež ima $\mathrm{pH} = 5{,}6$, kisli dež nad onesnaženim mestom pa $\mathrm{pH} = 4{,}6$. Kolikokrat večja je $c$ v kislem dežju?
- za $1$ večja, saj se pH razlikuje le za $1$
~ Lestvica je logaritemska: razlika logaritmov $1$ pomeni kvocient števil $10$, ne razlike $1$.
- $\dfrac{5{,}6}{4{,}6} \approx 1{,}2$-krat
~ Deliti ne smeš pH-jev, ker sta logaritma. Kvocient koncentracij dobiš iz razlike logaritmov.
+ $10$-krat
- $100$-krat
~ $100$-kratna bi bila pri razliki pH za $2$, ker je $\log 100 = 2$.
> Naj bo $c_1$ koncentracija v kislem, $c_2$ pa v čistem dežju: $\log c_1 - \log c_2 = -4{,}6 + 5{,}6 = 1$, torej $\log \dfrac{c_1}{c_2} = 1$ in $\dfrac{c_1}{c_2} = 10$.

? (brez računala) Koliko je $\ln \mathrm{e}^4 + \mathrm{e}^{\ln 3} - \ln 1$?
= 7 | 0
~ 6 | Upošteval si $\ln 1 = 1$. Pravilno je $\ln 1 = 0$, ker je $\mathrm{e}^0 = 1$.
~ 8 | Upošteval si $\ln 1 = -1$. Pravilno je $\ln 1 = 0$, ker je $\mathrm{e}^0 = 1$.
> $\ln \mathrm{e}^4 = 4$, $\mathrm{e}^{\ln 3} = 3$ in $\ln 1 = 0$, zato je vrednost $4 + 3 - 0 = 7$.

? (višja raven) Na logaritemski skali so oznake $1$, $10$, $100$ in $1000$ med seboj oddaljene $3\,\text{cm}$. Točka leži $2{,}1\,\text{cm}$ desno od oznake $10$. Kateremu številu pripada? Rezultat zaokroži na celo število.
= 50 | 1
~ 73 | Skalo si bral kot navadno: $10 + 0{,}7 \cdot 90 = 73$. Na logaritemski skali $0{,}7$ dekade pomeni faktor $10^{0{,}7}$.
~ 1,7 | To je $\log b$; treba je še potencirati: $10^{1{,}7}$.
> $2{,}1\,\text{cm}$ je $\dfrac{2{,}1}{3} = 0{,}7$ dekade. Točka leži pri $\log b = 1 + 0{,}7 = 1{,}7$, zato je $b = 10^{1{,}7} \approx 50$.

? (višja raven) Velja $y = A + B \log x$. Pri $x = 10$ je $y = 7$, pri $x = 100$ pa $y = 11$. Koliko je $y$ pri $x = 50$? Rezultat zaokroži na dve decimalki.
= 9,80 | 0,01
~ 8,78 | Interpoliral si linearno v $x$, model pa je linearen v $\log x$.
> Iz $A + B = 7$ in $A + 2B = 11$ sledi $B = 4$ in $A = 3$. Zato je $y = 3 + 4 \log 50 \approx 3 + 4 \cdot 1{,}6990 \approx 9{,}80$.

:::simboli
a | osnova logaritma | | | $a > 0$, $a \ne 1$
b | logaritmand | | | $b > 0$
x | logaritem števila $b$ (eksponent) | x = \log_a b | | v pravilih in v modelu $y = A + B \log x$ (blok 9) poljubno pozitivno število
y | pozitivno število | | | v modelu $y = A + B \log x$ (blok 9) odvisna količina
c | nova osnova | | | $c > 0$, $c \ne 1$; pri pH koncentracija $\mathrm{H_3O^+}$ v mol/L
n | realno število (eksponent) | | | pri korenu naravno, $n \ge 2$
m | eksponent v potenci | | |
u | eksponent potence z osnovo $a$ | u = \log_a x | | 
p | zračni tlak na višini $h$ | p = p_0 \cdot 0{,}88^h | hPa |
p_0 | zračni tlak pri tleh | | hPa | $1013\,\mathrm{hPa}$
h | nadmorska višina | | km |
L | glasnost zvoka | L = 10 \log \frac{I}{I_0} | dB |
I | jakost zvoka | | W/m² |
I_0 | jakost zvoka na pragu slišnosti | | W/m² | $10^{-12}\,\mathrm{W/m^2}$
r | okrajšava za $\log_2 3$ (Za maturo, naloga 3) | r = \log_2 3 | |
k | osnova faktorja v produktu (Za maturo, naloga 3 d) | | | $k = 2, 3, \ldots, 7$
\mathrm{e} | osnova naravnega logaritma | | | $\mathrm{e} \approx 2{,}718$
t | število dekad desno od glavne oznake na logaritemski skali | | |
A, B | parametra logaritemskega modela | y = A + B \log x | |
P | število prebivalcev mesta | | |
v | eksponent potence z osnovo $a$ ($v = \log_a y$); v Primeru 6 povprečna hitrost hoje v m/s | | | v Primeru 6 je $v = 0{,}65 + 0{,}15 \log P$
:::

<<RACUN
vrednost: 24*2/3 | 16
vrednost: log(24, 2)+log(2/3, 2)-log(sqrt(5), 5) | 7/2
vrednost: 10*log(10^(-6)/10^(-12), 10) | 60
vrednost: 3.2*10^(-5)/10^(-12) | 3.2*10^7
vrednost: 10*log(3.2*10^(-5)/10^(-12), 10) | 75.05
vrednost: 10^(-12)*10^8.5 | 3.162*10^(-4)
vrednost: 10*log(5, 10) | 6.99
enako: log(18, 2) | 1+2*log(3, 2)
enako: log(9/16, 2) | 2*log(3, 2)-4
enako: log(2, 3) | 1/log(3, 2)
enako: log(12, 18) | (2+log(3, 2))/(1+2*log(3, 2))
enako: log(sqrt(27), 8) | log(3, 2)/2
vrednost: log(3, 2)*log(4, 3)*log(5, 4)*log(6, 5)*log(7, 6)*log(8, 7) | 3
enako: log(12, 2) | 2+log(3, 2)
enako: (log(3, 2)+log(12, 2))/2 | log(6, 2)
vrednost: (3+12)/2 | 7.5
vrednost: log(20) | 3.00
resi: 3^x=20 | x | 2.73
vrednost: log(exp(3))+log(1/exp(1)) | 2
vrednost: exp(2*log(3)) | 9
vrednost: (1+log(5))/2 | 1.3047
resi: exp(2*x-1)=5 | x | 1.30
vrednost: log(2, 10) | 0.301
vrednost: log(3, 10) | 0.477
vrednost: log(5, 10) | 0.699
vrednost: 10^1.5 | 31.6
vrednost: 1.25-1.10 | 0.15
vrednost: 1.10-3*0.15 | 0.65
vrednost: 0.65+0.15*log(1000000, 10) | 1.55
vrednost: 0.65+0.15*log(300000, 10) | 1.47
vrednost: 10^4.3 | 19952.6
vrednost: 0.65+0.15*4.3 | 1.295
vrednost: log(exp(4))+exp(log(3))-log(1) | 7
vrednost: 10^(1+2.1/3) | 50.1
vrednost: 3+4*log(50, 10) | 9.80
>>
