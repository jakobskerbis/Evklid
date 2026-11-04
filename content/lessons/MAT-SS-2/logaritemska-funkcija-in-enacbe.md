---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika programira aplikacijo za uglaševanje kitare. Mikrofon izmeri frekvenco strune $\nu$, zaslon pa mora pokazati, za koliko oktav je ton nad tonom A s frekvenco $440\,\mathrm{Hz}$ ali pod njim. Iz eksponentne funkcije Nika ve, da se frekvenca z vsako oktavo podvoji: ton, ki je $x$ oktav nad A, ima frekvenco $440 \cdot 2^x\,\mathrm{Hz}$. Aplikacija pa dobi frekvenco in mora najti $x$. Potrebuje torej obratno pot: od frekvence nazaj do eksponenta.

Ta obratna pot je logaritem, zapisan kot funkcija: $x = \log_2 \dfrac{\nu}{440\,\mathrm{Hz}}$. Struna A na kitari zveni pri $110\,\mathrm{Hz}$ in aplikacija pokaže $-2$, dve oktavi niže. Kaj pa naj pokaže, ko je v sobi tiho in mikrofon ne zazna ničesar? Na to vprašanje odgovori definicijsko območje, kako se prikaz spreminja z višino tona, pa pokaže graf.

## Razlaga

**1. Od oktav do tabele.** Na klaviaturi so oktave enako široke, frekvence pa se ne povečujejo za enak korak, temveč se podvajajo. Preberimo to v tabeli:

| frekvenca $\nu$ [Hz] | oktave nad A |
|---|---|
| $110$ | $-2$ |
| $220$ | $-1$ |
| $440$ | $0$ |
| $880$ | $1$ |
| $1760$ | $2$ |

V levem stolpcu vsak korak navzdol pomnoži z $2$, v desnem pa prišteje $1$. Množenje na levi se spremeni v seštevanje na desni. Desni stolpec je eksponent, zato je to delo logaritma.

:::premisli
Koliko oktav nad A je ton s frekvenco $3520\,\mathrm{Hz}$? In kaj bi morala aplikacija pokazati pri $0\,\mathrm{Hz}$?
---
Ker je $3520 : 440 = 8 = 2^3$, je ton $3$ oktave nad A. Pri $0\,\mathrm{Hz}$ ni nobenega odgovora: potenca $2^x$ je vedno pozitivna, zato nobeno število oktav ne da frekvence $0$. Logaritem nič (in negativnega števila) ne obstaja.
:::

**2. Od tabele do grafa.** Izpustimo glasbo in vzemimo kar $y = \log_2 x$. Vrednosti preberemo iz potenc števila $2$:

| $x$ | $\log_2 x$ |
|---|---|
| $\frac{1}{2}$ | $-1$ |
| $1$ | $0$ |
| $2$ | $1$ |
| $4$ | $2$ |
| $8$ | $3$ |

To je tabela funkcije $y = 2^x$, le da sta stolpca zamenjana. Točka $(2, 4)$ na grafu $y = 2^x$ zato preide v točko $(4, 2)$ na grafu $y = \log_2 x$. Predstavljaj si list, na katerem je narisan graf $y = 2^x$ in črtkana premica $y = x$ (simetrala lihih kvadrantov). Če list prepogneš po črtkani premici, se graf odtisne na drugo stran in nastane graf $y = \log_2 x$. Vodoravna asimptota $y = 0$ eksponentne funkcije se pri tem spremeni v navpično asimptoto $x = 0$.

Funkciji, ki druga drugi »izničita« učinek, imenujemo **obratni (inverzni) funkciji**: velja $\log_a a^x = x$ in $a^{\log_a x} = x$ za $x > 0$. Grafa obratnih funkcij sta vedno zrcalna čez premico $y = x$.

**3. Definicija.** Naj bo $a > 0$ in $a \ne 1$. Funkcijo

$$f(x) = \log_a x$$

imenujemo **logaritemska funkcija** z osnovo $a$. Ker je logaritem definiran le za pozitivna števila, je njeno **definicijsko območje** (množica vseh $x$, za katere je funkcija definirana) $D_f = (0, \infty)$. Njena **zaloga vrednosti** je $Z_f = \mathbb{R}$: logaritem je lahko poljubno realno število.

**4. Lastnosti.** Lastnosti so odvisne od tega, ali je osnova večja ali manjša od $1$:

| lastnost | $a > 1$ | $0 < a < 1$ |
|---|---|---|
| $D_f$ | $(0, \infty)$ | $(0, \infty)$ |
| $Z_f$ | $\mathbb{R}$ | $\mathbb{R}$ |
| monotonost | narašča | pada |
| ničla | $x = 1$ | $x = 1$ |
| točka | $(a, 1)$ | $(a, 1)$ |
| asimptota | $x = 0$ | $x = 0$ |
| $f(x) < 0$ | na $(0, 1)$ | na $(1, \infty)$ |
| $f(x) > 0$ | na $(1, \infty)$ | na $(0, 1)$ |

Graf vsake logaritemske funkcije gre skozi točko $(1, 0)$, ker je $\log_a 1 = 0$. Os $y$ je **navpična asimptota**: pri $a > 1$ se graf, ko gre $x$ proti $0$, spušča neomejeno navzdol in se osi $y$ približuje, a je nikoli ne doseže. Osi $y$ graf ne seka, ker $0$ ni v definicijskem območju. Za $x > 1$ graf pri $a > 1$ narašča vse počasneje, a ni navzgor omejen: $\log_2 x = 10$ doseže šele pri $x = 1024$.

Grafa funkcij $y = \log_a x$ in $y = \log_{\frac{1}{a}} x$ sta simetrična glede na os $x$, ker je $\log_{\frac{1}{a}} x = -\log_a x$: iz $a^y = x$ sledi $\left(\frac{1}{a}\right)^{-y} = x$. V simulaciji spodaj (»Logaritemska funkcija«) spremeni osnovo z $2$ na $\frac{1}{2}$ in opazuj: graf se prezrcali čez os $x$, točka $(1, 0)$ pa ostane na mestu.

**5. Premiki grafa.** Funkcijo $g(x) = \log_a (x - p) + q$ dobimo iz $y = \log_a x$ s premikom za $p$ v smeri osi $x$ in za $q$ v smeri osi $y$:

- asimptota je premica $x = p$,
- definicijsko območje je $(p, \infty)$, ker mora veljati $x - p > 0$,
- točka $(1, 0)$ preide v $(1 + p, q)$.

Pazi na znak: pri $\log_2 (x - 3)$ se graf premakne za $3$ **v desno**.

:::premisli
Kje je asimptota grafa $y = \log_2 (x + 3)$ in kam se premakne točka $(1, 0)$? Napovej, preden računaš.
---
Asimptota je $x = -3$, točka $(1, 0)$ pa preide v $(-2, 0)$. Tu je $p = -3$, ker je $x + 3 = x - (-3)$, zato se graf premakne za $3$ v levo. Preizkus: $\log_2 (-2 + 3) = \log_2 1 = 0$.
:::

**6. Definicijsko območje sestavljene funkcije.** Če je pod logaritmom izraz, zahtevamo, da je ta izraz **strogo pozitiven**. Za $f(x) = \log_3 (6 - 2x)$ rešimo neenačbo $6 - 2x > 0$ in dobimo $x < 3$, torej $D_f = (-\infty, 3)$. Če je pod logaritmom kvadratni izraz, rešimo kvadratno neenačbo. Pri $\log (x^2 - x - 6)$ ima izraz $(x - 3)(x + 2)$ ničli $-2$ in $3$; parabola je odprta navzgor, zato je izraz pozitiven zunaj ničel in $D = (-\infty, -2) \cup (3, \infty)$.

**7. Logaritemske enačbe.** V logaritemski enačbi je neznanka v logaritmandu (ali v osnovi). Ker je logaritemska funkcija strogo monotona, nobene vrednosti ne zavzame dvakrat, zato iz enakosti logaritmov z isto osnovo sledi enakost logaritmandov. Glavni tipi:

- $\log_a A = c$: po definiciji zapišemo $A = a^c$.
- $\log_a A = \log_a B$: sklepamo $A = B$.
- Več logaritmov z isto osnovo: s pravili jih **združimo** v en logaritem, na primer $\log_a A + \log_a B = \log_a (A \cdot B)$, nato nadaljujemo kot zgoraj.
- V enačbi nastopata $\log_a x$ in $(\log_a x)^2$: uvedemo **novo neznanko** $t = \log_a x$ in rešimo kvadratno enačbo.

**8. Preizkus je obvezen.** Pri združevanju logaritmov se definicijsko območje lahko razširi (v Primeru 2 izraz $(x + 3)(x - 1)$ obstaja tudi pri $x = -7$), zato lahko dobimo »rešitev«, pri kateri prvotni logaritmi niso definirani. Zato **pred** reševanjem zapišemo pogoje (vsi logaritmandi so pozitivni), **po** reševanju pa vsako rešitev preverimo.

## Rešeni primeri

### Primer 1 (lažji)

Dana je funkcija $f(x) = \log_3 (x - 2) + 1$. Določi njeno definicijsko območje, enačbo asimptote, ničlo in presečišče z osjo $y$ ter izračunaj vrednosti v točkah $x = 3$, $x = 5$ in $x = 11$.

**Podatki:** $f(x) = \log_3 (x - 2) + 1$; osnova $a = 3$, premik $p = 2$ v smeri osi $x$, $q = 1$ v smeri osi $y$; točke $x = 3$, $x = 5$, $x = 11$
**Iščemo:** $D_f$, asimptoto, ničlo, presečišče z osjo $y$ ter $f(3)$, $f(5)$, $f(11)$

:::formula
$g(x) = \log_a (x - p) + q$: $\;D_g = (p, \infty)$, asimptota $x = p$; $\;\log_a A = c \iff A = a^c$
:::

**Rešitev:**

1. Logaritmand mora biti pozitiven: $x - 2 > 0$, torej $x > 2$ in $D_f = (2, \infty)$.
2. Asimptota je navpična premica $x = 2$.
3. Ničla: $\log_3 (x - 2) + 1 = 0$, torej $\log_3 (x - 2) = -1$. Po definiciji je $x - 2 = 3^{-1} = \dfrac{1}{3}$ in $x = \dfrac{7}{3}$.
4. Presečišča z osjo $y$ ni, ker $x = 0$ ni v definicijskem območju.
5. Vrednosti: $f(3) = \log_3 1 + 1 = 1$, $f(5) = \log_3 3 + 1 = 2$, $f(11) = \log_3 9 + 1 = 3$.
6. Ker je $a = 3 > 1$, funkcija strogo narašča.
7. Odgovor: $D_f = (2, \infty)$, asimptota je $x = 2$, ničla je $x = \dfrac{7}{3}$, presečišča z osjo $y$ ni; $f(3) = 1$, $f(5) = 2$ in $f(11) = 3$.

### Primer 2 (srednji)

Reši enačbo $\log_2 (x + 3) + \log_2 (x - 1) = 5$.

**Podatki:** enačba $\log_2 (x + 3) + \log_2 (x - 1) = 5$, osnova $a = 2$
**Iščemo:** vse realne rešitve $x$

:::formula
$\log_a A + \log_a B = \log_a (A \cdot B)$; $\;\log_a C = c \iff C = a^c$
:::

**Rešitev:**

1. Pogoja: $x + 3 > 0$ in $x - 1 > 0$. Oba hkrati veljata za $x > 1$.
2. Logaritma združimo: $\log_2 \big((x + 3)(x - 1)\big) = 5$.
3. Po definiciji: $(x + 3)(x - 1) = 2^5 = 32$.
4. Odpravimo oklepaje: $x^2 + 2x - 3 = 32$, torej $x^2 + 2x - 35 = 0$.
5. Razcepimo: $(x + 7)(x - 5) = 0$, zato je $x_1 = 5$ in $x_2 = -7$.
6. Pogoj $x > 1$ izpolnjuje le $x = 5$. Pri $x = -7$ bi bil $\log_2 (-4)$, ki ni definiran.
7. Preizkus: $\log_2 8 + \log_2 4 = 3 + 2 = 5$. ✓
8. Odgovor: enačba ima eno rešitev, $x = 5$.

### Primer 3 (težji): uglaševalnik

Nikina aplikacija pokaže, za koliko poltonov $k$ je ton nad tonom A s frekvenco $440\,\mathrm{Hz}$ (oktava ima $12$ poltonov). a) Kaj pokaže, ko zazveni struna A s frekvenco $110\,\mathrm{Hz}$? b) Ton E je $7$ poltonov nad A. Pri kateri frekvenci aplikacija pokaže $k = 7$?

**Podatki:** $\nu_0 = 440\,\mathrm{Hz}$, $12$ poltonov v oktavi, a) $\nu = 110\,\mathrm{Hz}$, b) $k = 7$
**Iščemo:** a) število poltonov $k$, b) frekvenco $\nu$

:::formula
$k = 12 \log_2 \dfrac{\nu}{\nu_0}$; $\;\log_a A = c \iff A = a^c$
:::

**Rešitev:**

1. Pogoj: $\nu > 0$, saj je logaritem definiran le za pozitivne logaritmande. Ničelne ali negativne frekvence aplikacija ne more prikazati.
2. a) Razmerje je $\dfrac{110}{440} = \dfrac{1}{4} = 2^{-2}$, zato je $\log_2 \dfrac{1}{4} = -2$.
3. a) Pomnožimo z $12$: $12 \cdot (-2) = -24$. Ton je $24$ poltonov oziroma dve oktavi pod A.
4. b) Enačbo $12 \log_2 \dfrac{\nu}{440} = 7$ delimo z $12$: $\log_2 \dfrac{\nu}{440} = \dfrac{7}{12}$.
5. b) Po definiciji logaritma je $\dfrac{\nu}{440} = 2^{\frac{7}{12}} \approx 1{,}4983$; osnova $2$ se potencira, desna stran je eksponent.
6. b) Pomnožimo z $440$: $\nu \approx 440 \cdot 1{,}4983 \approx 659{,}3\,\mathrm{Hz}$, kar je pozitivno in ustreza pogoju.
7. Odgovor: pri struni A aplikacija pokaže $k = -24$, vrednost $k = 7$ pa pri frekvenci približno $659{,}3\,\mathrm{Hz}$ (ton E).

### Primer 4 – zdaj ti

Reši enačbo $(\log x)^2 - \log x^3 + 2 = 0$.

**Podatki:** enačba $(\log x)^2 - \log x^3 + 2 = 0$ z desetiškim logaritmom
**Iščemo:** vse realne rešitve $x$

:::formula
$\log_a x^n = n \log_a x$ (za $x > 0$); nova neznanka $t = \log x$; $\;\log x = c \iff x = 10^c$
:::

**Rešitev:**

1. Pogoj: $x > 0$ (tedaj je tudi $x^3 > 0$).
2. Drugi člen preoblikujemo: $\log x^3 = 3 \log x$. Enačba se glasi $(\log x)^2 - 3\log x + 2 = 0$.
3. Uvedemo novo neznanko $t = \log x$: $t^2 - 3t + 2 = 0$.
4. Razcepimo: $(t - 1)(t - 2) = 0$, zato je $t_1 = 1$ in $t_2 = 2$.
5. Zdaj ti: iz $t_1$ in $t_2$ izračunaj $x$, preveri pogoj in naredi preizkus.

:::premisli
Kateri sta rešitvi in ali obe prestaneta preizkus?
---
Iz $\log x = 1$ sledi $x = 10^1 = 10$, iz $\log x = 2$ pa $x = 10^2 = 100$. Obe sta pozitivni. Preizkus za $x = 10$: $1^2 - \log 1000 + 2 = 1 - 3 + 2 = 0$. Za $x = 100$: $2^2 - \log 10^6 + 2 = 4 - 6 + 2 = 0$. Rešitvi enačbe sta $x = 10$ in $x = 100$.
:::

## Pogoste napake

- **Rešitev brez preizkusa.** V Primeru 2 kvadratna enačba da tudi $x = -7$. Ko logaritme združimo, izraz $\log_2 \big((x + 3)(x - 1)\big)$ obstaja tudi pri $x = -7$, prvotna enačba pa ne. Pravilno: na začetku zapiši pogoje in na koncu vsako rešitev preveri v **prvotni** enačbi.
- **Logaritem vsote razbit na vsoto.** $\log_2 (x + 3) = \log_2 x + \log_2 3$ ne velja. Pravilo $\log_a A + \log_a B = \log_a (AB)$ govori o **produktu** pod logaritmom; za vsoto $x + 3$ pod logaritmom pravila ni, zato tak logaritem pustimo cel.
- **Napačna pot od logaritma do potence.** Iz $\log_3 (2x + 1) = 2$ ne sledi $2x + 1 = 3 \cdot 2$ ali $2x + 1 = 2^3$. Osnova se potencira, desna stran je eksponent: $2x + 1 = 3^2 = 9$, torej $x = 4$.
- **Premik v napačno smer.** Graf $y = \log_2 (x + 3)$ ni premaknjen v desno. Asimptoto najdeš tako, da logaritmand izenačiš z nič: $x + 3 = 0$, torej $x = -3$; graf je premaknjen za $3$ v levo in $D = (-3, \infty)$.
- **Kvadrat logaritma zamenjan z logaritmom kvadrata.** $(\log x)^2$ ni enako $\log x^2 = 2\log x$. Pri substituciji $t = \log x$ je $(\log x)^2 = t^2$, $\log x^3$ pa je $3t$.

## Povzetek

- $f(x) = \log_a x$, $a > 0$, $a \ne 1$; $D_f = (0, \infty)$, $Z_f = \mathbb{R}$.
- Graf je zrcalna slika grafa $y = a^x$ čez premico $y = x$; gre skozi $(1, 0)$ in $(a, 1)$, os $y$ je navpična asimptota.
- Za $a > 1$ funkcija strogo narašča, za $0 < a < 1$ strogo pada.
- $g(x) = \log_a (x - p) + q$: asimptota $x = p$, $D_g = (p, \infty)$.
- Definicijsko območje: izraz pod logaritmom mora biti strogo pozitiven.
- Enačbe: $\log_a A = c \Rightarrow A = a^c$; $\;\log_a A = \log_a B \Rightarrow A = B$; po potrebi $t = \log_a x$.
- Na začetku zapiši pogoje, na koncu naredi preizkus.

## Drugače: Z analogijo

Logaritem je kot števec prepogibov. List papirja je debel $0{,}1\,\mathrm{mm}$; vsak prepogib debelino podvoji. Eksponentna funkcija odgovori na vprašanje »Kako debel je kup po $x$ prepogibih?«, logaritemska pa na obratno: »Kolikokrat moram prepogniti, da dobim dano debelino?«. Za $0{,}8\,\mathrm{mm}$ je odgovor $\log_2 8 = 3$.

Analogija pokaže tudi definicijsko območje. Debelina je vedno pozitivna, zato vprašanje »kolikokrat do debeline $0$« nima odgovora. Za debelino $0{,}05\,\mathrm{mm}$ bi morali list enkrat »odpogniti«, zato je odgovor negativen: $\log_2 \frac{1}{2} = -1$. Kup z vsakim prepogibom zraste bolj, zato je za vsak dodatni milimeter treba vse manj prepogibov: graf logaritma narašča vse bolj položno.

## Drugače: Iz vsakdanjega življenja

Zamisli si igro: prijatelj si izmisli celo število med $1$ in $1\,000\,000$, ti pa ugibaš, on pa odgovarja le »več« ali »manj«. Najboljša strategija je, da vsakič vprašaš po sredini intervala in tako število možnosti razpoloviš. Po $n$ vprašanjih ostane približno $\dfrac{1\,000\,000}{2^n}$ možnosti. Igra je končana, ko ostane ena, torej ko je $2^n \ge 1\,000\,000$. Rešitev je $n \ge \log_2 1\,000\,000 \approx 19{,}93$, torej zadošča $20$ vprašanj.

Pri $1000$ številih zadošča $10$ vprašanj, pri milijardi pa le $30$. To je značilnost logaritemske funkcije: ko se $x$ tisočkrat poveča, se $\log_2 x$ poveča le za približno $10$. Graf narašča, a vse bolj položno. Na tem počasnem naraščanju temeljijo iskanje po slovarju, iskanje po urejenih podatkih v računalniku in logaritemske lestvice, kot je magnituda potresa, kjer potres z magnitudo za $1$ večjo pomeni desetkrat večjo amplitudo nihanja tal.

## Drugače: Bolj natančno

**Zakaj je logaritemska funkcija dobro definirana obratna funkcija.** Za $a > 0$, $a \ne 1$ je funkcija $x \mapsto a^x$ strogo monotona, zato nobene vrednosti ne zavzame dvakrat, njena zaloga vrednosti pa je $(0, \infty)$. Vsakemu $y > 0$ torej pripada natanko en $x$ z $a^x = y$. Zato ima obratno funkcijo z definicijskim območjem $(0, \infty)$ in zalogo vrednosti $\mathbb{R}$. To je $\log_a x$. Ker sta grafa obratnih funkcij zrcalna glede na $y = x$, obratna funkcija podeduje monotonost: pri $a > 1$ narašča, pri $0 < a < 1$ pada.

**Injektivnost in sklep $A = B$.** Iz $\log_a A = \log_a B$ sledi $A = B$ ravno zato, ker strogo monotona funkcija nobene vrednosti ne zavzame dvakrat. Obratni sklep zahteva previdnost: iz $A = B$ sledi $\log_a A = \log_a B$ le, če sta $A$ in $B$ pozitivna.

**Pravila spremenijo definicijsko območje.** Izraz $\log x^2$ je definiran za vsak $x \ne 0$, izraz $2 \log x$ pa le za $x > 0$. Splošno velja $\log x^2 = 2 \log |x|$. Enačba $\log x^2 = 2$ ima zato rešitvi $x = 10$ in $x = -10$, enačba $2\log x = 2$ pa le $x = 10$. Če bi prvo enačbo slepo preoblikoval v drugo, bi rešitev $x = -10$ **izgubil**. Pri združevanju logaritmov (Primer 2) pa se lahko pojavi **odvečna** rešitev. Zato so pogoji in preizkus del pravilne rešitve, ne le dodatek.

## Preveri se

? Katera trditev o funkciji $f(x) = \log_2 x$ **ne** drži?
- Definicijsko območje je $(0, \infty)$.
~ To drži: logaritem obstaja le za pozitivna števila. Morda si pomislil, da sme biti $x$ poljuben, kot pri $2^x$.
- Graf gre skozi točko $(1, 0)$.
~ To drži, ker je $\log_2 1 = 0$. Točko $(0, 1)$ ima eksponentna funkcija, ne logaritemska.
- Os $y$ je navpična asimptota.
~ To drži: graf se osi $y$ približuje, a je ne doseže. Vodoravno asimptoto ima eksponentna funkcija.
+ Graf seka os $y$ v točki $(0, 1)$.
> Graf osi $y$ ne seka, ker $x = 0$ ni v definicijskem območju. Točka $(0, 1)$ leži na grafu $y = 2^x$; po zrcaljenju čez $y = x$ postane $(1, 0)$.

? Pri reševanju $\log x + \log (x - 3) = 1$ dobimo $x = 5$ in $x = -2$. Zakaj $x = -2$ ni rešitev?
+ Ker pri $x = -2$ izraza $\log (-2)$ in $\log (-5)$ nista definirana.
- Ker logaritem nikoli ne more biti negativen.
~ Logaritem je lahko negativen ($\log 0{,}1 = -1$); negativen ne sme biti logaritmand.
- Ker smo se pri razcepu $x^2 - 3x - 10$ zmotili.
~ Razcep $(x - 5)(x + 2)$ je pravilen; $x = -2$ res reši kvadratno enačbo, ne pa prvotne.
- Ker ima kvadratna enačba vedno le eno pravo rešitev.
~ Kvadratna enačba ima lahko dve rešitvi. Tu odpade le zato, ker je pogoj $x > 3$.
> Pogoj je $x > 3$. Pri združevanju v $\log \big(x(x - 3)\big)$ se definicijsko območje razširi, zato se pojavi odvečna rešitev $-2$. Preizkus v prvotni enačbi jo izloči.

? Maja določa definicijsko območje funkcije $f(x) = \log (x^2 - 4)$. Kateri korak je napačen?
1) $x^2 - 4 > 0$; 2) $(x - 2)(x + 2) > 0$; 3) parabola je odprta navzgor, zato je izraz pozitiven med ničlama; 4) $D_f = (-2, 2)$.
- korak 1
~ Korak 1 je pravilen: logaritmand mora biti strogo pozitiven.
- korak 2
~ Razcep razlike kvadratov je pravilen.
+ korak 3
- korak 4
~ Korak 4 le zapiše, kar sledi iz koraka 3. Napaka je prej, v koraku 3.
> Parabola, odprta navzgor, je med ničlama pod osjo $x$: pri $x = 0$ je $0 - 4 = -4 < 0$. Izraz je pozitiven zunaj ničel, zato je $D_f = (-\infty, -2) \cup (2, \infty)$.

? Katera je rešitev enačbe $\log_3 (2x + 1) = 2$?
- $x = 2{,}5$
~ To dobiš iz $2x + 1 = 3 \cdot 2$. Osnova se ne množi z desno stranjo, temveč potencira.
- $x = 1$
~ To dobiš iz $2x + 1 = 3$, kot da bi bila vrednost logaritma $1$, ne $2$.
+ $x = 4$
- $x = 3{,}5$
~ To dobiš iz $2x + 1 = 2^3$: osnovo in eksponent si zamenjal.
> Po definiciji je $2x + 1 = 3^2 = 9$, zato je $x = 4$. Preizkus: $\log_3 9 = 2$.

? Nikin uglaševalnik računa $k = 12 \log_2 \dfrac{\nu}{440\,\mathrm{Hz}}$ in pokaže $k = -12$. Kolikšna je frekvenca tona?
- $428\,\mathrm{Hz}$
~ Od $440$ si odštel $12$. Logaritem šteje množenja z $2$, ne korakov po $1\,\mathrm{Hz}$.
+ $220\,\mathrm{Hz}$
- $880\,\mathrm{Hz}$
~ Negativen $k$ pomeni ton pod A, zato frekvenca ni večja od $440\,\mathrm{Hz}$.
- Take frekvence ni, ker je $k$ negativen.
~ Negativen je lahko logaritem, ne logaritmand: frekvenca je pozitivna, le manjša od $440\,\mathrm{Hz}$.
> Iz $12 \log_2 \dfrac{\nu}{440} = -12$ sledi $\log_2 \dfrac{\nu}{440} = -1$ in $\dfrac{\nu}{440} = 2^{-1}$, torej $\nu = 220\,\mathrm{Hz}$: ena oktava pod A.

:::simboli
f | logaritemska funkcija | f(x) = \log_a x | |
x | spremenljivka (neznanka) | | | pri $\log_a x$ je $x > 0$
a | osnova logaritma | | | $a > 0$, $a \ne 1$
D_f, D_g | definicijsko območje funkcije | D_g = (p, \infty) | |
Z_f | zaloga vrednosti funkcije | | |
g | premaknjena logaritemska funkcija | g(x) = \log_a (x - p) + q | |
p | premik grafa v smeri osi $x$ | | | asimptota je $x = p$
q | premik grafa v smeri osi $y$ | | |
A, B, C | izrazi z neznanko pod logaritmom | | | morajo biti pozitivni
c | vrednost logaritma | | | $\log_a A = c$ pomeni $A = a^c$
n | eksponent | | |
t | nova neznanka | t = \log x | |
k | število poltonov nad tonom A | k = 12 \log_2 \frac{\nu}{\nu_0} | – | negativno pod tonom A
\nu | frekvenca tona | | Hz | $\nu > 0$
\nu_0 | frekvenca tona A | | Hz | $440\,\mathrm{Hz}$
:::
