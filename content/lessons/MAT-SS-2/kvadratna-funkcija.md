---
stanje: osnutek
demo: graf
avtor: AI
---

## Zakaj se tega učimo

Šolska vremenska postaja je v jasnem pomladnem dnevu merila temperaturo zraka. Vrednosti so poenostavljene, da bo računanje lažje:

| ura | temperatura |
|---|---|
| 8.00 | $11\,^\circ\text{C}$ |
| 12.00 | $19\,^\circ\text{C}$ |
| 16.00 | $19\,^\circ\text{C}$ |
| 20.00 | $11\,^\circ\text{C}$ |

Sošolec Jaka trdi: »Najvišja temperatura dneva je bila $19\,^\circ\text{C}$, ob 12.00 ali ob 16.00. Višje nismo izmerili.« Ima prav?

:::risba graf
opis: Štiri meritve temperature kot točke v koordinatnem sistemu: (8, 11), (12, 19), (16, 19) in (20, 11). Točki ob 12.00 in 16.00 sta enako visoko, pri 19 °C; med njima ni nobene meritve.
x: 6 .. 22 | 2 | ura
y: 0 .. 24 | 4 | °C
točka: 8; 11 | (8, 11) | desno
točka: 12; 19 | (12, 19) | nad levo
točka: 16; 19 | (16, 19) | nad desno
točka: 20; 11 | (20, 11) | levo
podnapis: Meritve vremenske postaje: kaj se je dogajalo med 12.00 in 16.00?
:::

Točke ležijo na krivulji, ki se dviga, doseže vrh in se nato spet spušča. Tak potek dobro opiše **parabola**, graf **kvadratne funkcije**. Njen vrh ali dno se imenuje **teme**. Ko ga boš znal poiskati, boš Jaki znal odgovoriti. Po paraboli leti tudi košarkarska žoga (Primer 2).

## Razlaga

**1. Definicija.** Kvadratna funkcija je funkcija s predpisom

$$f(x) = ax^2 + bx + c, \qquad a, b, c \in \mathbb{R},\ a \ne 0.$$

Število $a$ je **vodilni koeficient**, $b$ **linearni koeficient**, $c$ **prosti člen**. Pogoj $a \ne 0$ je nujen: pri $a = 0$ dobimo linearno funkcijo. Definicijsko območje je $\mathbb{R}$.

*Preveri:* ali je $f(x) = (x - 1)^2 - x^2$ kvadratna funkcija? (Ne: člen $x^2$ se odšteje, ostane $f(x) = -2x + 1$.)

**2. Osnovna parabola.** Najpreprostejša kvadratna funkcija je $f(x) = x^2$:

| $x$ | $x^2$ |
|---|---|
| $-3$ | $9$ |
| $-2$ | $4$ |
| $-1$ | $1$ |
| $0$ | $0$ |
| $1$ | $1$ |
| $2$ | $4$ |
| $3$ | $9$ |

Vrednosti pri $x$ in $-x$ so enake, zato je graf simetričen glede na os $y$ (taki funkciji pravimo soda). Teme je izhodišče $(0, 0)$, najnižja točka grafa.

**3. Vpliv koeficienta $a$.**

- $a > 0$: parabola je odprta **navzgor**, teme je najnižja točka (minimum).
- $a < 0$: parabola je odprta **navzdol**, teme je najvišja točka (maksimum).
- $|a| > 1$: parabola je ožja od $y = x^2$; $|a| < 1$: parabola je širša.

Zakaj? Množenje z $a$ pomnoži vsako vrednost funkcije: namesto $1$, $4$, $9$ iz tabele dobimo pri $a = 2$ vrednosti $2$, $8$, $18$. To je razteg v smeri osi $y$. Na sliki je $a = 2$: označena točka $(1; a)$ (podpičje, ker je $a$ lahko decimalno število) je na dvakratni višini črtkane parabole $y = x^2$, zato je graf ožji. V aplikaciji premikaj drsnik $a$ pod sliko in opazuj to točko: pri $a = 0{,}5$ je na polovici višine, graf je širši; pri $a = -1$ je pod osjo $x$, graf se prezrcali. Pri $a = 0$ parabola izgine v vodoravno premico, zato definicija zahteva $a \ne 0$. Teme ves čas ostane v izhodišču.

:::risba graf
opis: Graf funkcije y = ax² in za primerjavo črtkana parabola y = x², obe s temenom v izhodišču. V aplikaciji se a spreminja z drsnikom od −3 do 3; izbrano je a = {a}. Na grafu je označena točka (1; {a}).
x: -4 .. 4
y: -6 .. 6
enako: da
drsnik: a | -3 .. 3 | 0,5 | 2 | vodilni koeficient a
f: x^2 | siva črtkano
f: a*x^2 | modra
črta: 1; a -> 3,6; a | siva črtkano
točka: 1; a | | | oranžna
napis: 2,9; a + 0,45*(4*a + 1)/abs(4*a + 1) | (1; {a}) | sredina
podnapis: y = ax² pri a = {a}; označena je točka (1; {a}), črtkano je y = x²
:::

*Preveri:* je $y = -0{,}5x^2$ ožja ali širša od $y = x^2$? (Širša, ker je $|a| = 0{,}5 < 1$; odprta je navzdol.)

**4. Tri oblike zapisa.**

- **splošna** $f(x) = ax^2 + bx + c$: takoj preberemo presečišče z osjo $y$, točko $(0, c)$;
- **temenska** $f(x) = a(x - p)^2 + q$: takoj preberemo teme $T(p, q)$;
- **ničelna** $f(x) = a(x - x_1)(x - x_2)$: takoj preberemo ničli $x_1$ in $x_2$.

V vseh treh oblikah je $a$ isto število. Ničelna oblika obstaja v realnih številih samo, če ima funkcija realne ničle.

Ista funkcija ima lahko vse tri zapise, na primer $x^2 - 2x - 3 = (x - 1)^2 - 4 = (x + 1)(x - 3)$. Na sliki vsaka oblika pokaže svoje točke: splošna presečišče $(0, -3)$, temenska teme $T(1, -4)$, ničelna ničli $-1$ in $3$.

:::risba graf
opis: Parabola y = x² − 2x − 3 z označenimi točkami: presečišče z osjo y (0, −3), teme T(1, −4) ter ničli (−1, 0) in (3, 0).
x: -4 .. 6
y: -6 .. 6 | 2
f: x^2 - 2*x - 3 | modra
točka: 0; -3 | (0, −3) | levo
točka: 1; -4 | T(1, −4) | pod desno
točka: -1; 0 | −1 | pod levo | oranžna
točka: 3; 0 | 3 | pod desno | oranžna
podnapis: Ena parabola, trije zapisi: vsak takoj pokaže druge točke
:::

*Preveri:* kaj takoj prebereš iz $f(x) = 3(x + 1)(x - 4)$? (Ničli $-1$ in $4$.)

**5. Teme.** Graf funkcije $f(x) = a(x - p)^2 + q$ dobimo tako, da parabolo $y = ax^2$ premaknemo za $p$ v smeri osi $x$ in za $q$ v smeri osi $y$. Teme je $T(p, q)$, **simetrijska os** je navpična premica $x = p$. Pazi na predznak: pri $(x - 2)^2$ je $p = 2$, pri $(x + 2)^2 = (x - (-2))^2$ pa $p = -2$.

Kje pa je teme, če je funkcija v splošni obliki? Poskusimo na $f(x) = x^2 - 6x + 5$. Pri $x = 0$ je $f(0) = 5$. Enako vrednost dobimo še tam, kjer je $x^2 - 6x = x(x - 6)$ spet enako $0$, torej pri $x = 6$. Točki $(0, 5)$ in $(6, 5)$ sta enako visoko, zato leži simetrijska os na sredini med njima, pri $x = 3$. Teme je $T(3, f(3)) = T(3, -4)$.

:::risba graf
opis: Parabola y = x² − 6x + 5. Točki (0, 5) in (6, 5) sta enako visoko in povezani s črtkano vodoravno črto. Na sredini med njima je črtkana navpična simetrijska os x = 3, na njej je teme T(3, −4).
x: -2 .. 8
y: -6 .. 8 | 2
f: x^2 - 6*x + 5 | modra
črta: 0; 5 -> 6; 5 | oranžna črtkano
črta: 3; -6 -> 3; 8 | siva črtkano
napis: 3; 7 | x = 3 | desno
točka: 0; 5 | (0, 5) | levo | oranžna
točka: 6; 5 | (6, 5) | desno | oranžna
točka: 3; -4 | T(3, −4) | pod desno
podnapis: Os x = 3 je na sredini med enako visokima točkama
:::

Sklep drži, ker je graf res premaknjena parabola $y = x^2$: $x^2 - 6x + 5 = (x^2 - 6x + 9) - 9 + 5 = (x - 3)^2 - 4$. Da to velja za vsako kvadratno funkcijo, pokaže dopolnjevanje do popolnega kvadrata (Drugače: Bolj natančno).

Enako sklepamo v splošnem, v dveh korakih:

- Izraz $ax^2 + bx = x(ax + b)$ je enak $0$ pri $x = 0$ in pri $x = -\dfrac{b}{a}$; tam je vrednost funkcije obakrat $c$.
- Os je na sredini med tema številoma (pri $b = 0$ sovpadeta v $x = 0$, kjer je teme). Pri metu iz Primera 2 sta to $0$ in $4{,}8$, sredina je $2{,}4$.

Zato velja

$$p = -\frac{b}{2a}, \qquad q = f(p).$$

Če temperaturo iz uvoda opišemo s parabolo, sta enaki vrednosti ob 12.00 in 16.00 enako daleč od osi, zato je os ob 14.00. Ker sta meritvi ob 8.00 in 20.00 nižji, je parabola odprta navzdol in je tam vrh, torej je bilo takrat topleje kot $19\,^\circ\text{C}$. Po tem modelu se Jaka moti; koliko je bilo, izračunaš v Primeru 3.

:::premisli
Parabolo $y = 2x^2$ premaknemo tako, da ima teme $T(-1, 4)$. Napovej brez računanja: ali nova parabola seka os $x$?
---
Ne seka. Ker je $a = 2 > 0$, je parabola odprta navzgor in teme je njena najnižja točka. Ta leži pri $y = 4$, nad osjo $x$, zato je ves graf nad osjo.
:::

*Preveri:* kje je teme $f(x) = x^2 - 4x + 1$? ($p = 2$, $q = f(2) = 4 - 8 + 1 = -3$, torej $T(2, -3)$.)

**6. Ničle.** Ničla je vrednost $x$, pri kateri je $f(x) = 0$; tam graf seka ali se dotika osi $x$. Splošni obrazec sledi v lekciji Kvadratna enačba; za zdaj jih iščemo na dva načina:

- **iz temenske oblike**: rešimo $a(x - p)^2 + q = 0$, torej $(x - p)^2 = -\dfrac{q}{a}$, in korenimo (ne pozabi na $\pm$);
- **z razstavljanjem**, kot znaš iz 1. letnika: $x^2 - 5x + 6 = (x - 2)(x - 3)$, ničli sta $2$ in $3$. Pri $a \ne 1$ najprej izpostavi $a$: $2x^2 - 10x + 12 = 2(x^2 - 5x + 6)$.

Iz lege temena in smeri odprtosti vidiš, koliko realnih ničel je: če sta $a$ in $q$ različno predznačena, sta dve; če je $q = 0$, je ena (dvojna, teme leži na osi $x$); če sta $a$ in $q$ enako predznačena, realnih ničel ni. Pri dvojni ničli je ničelna oblika $f(x) = a(x - x_1)^2$.

Na sliki je $a = 1$, $p = 1$ in $q = -4$, ista parabola kot v 4. točki: teme $T(1, -4)$ leži pod osjo $x$, ničli $x_1 = -1$ in $x_2 = 3$ (točki na osi $x$) sta enako daleč od črtkane osi. Pod sliko sta izpisani; enaki števili pomenita dvojno ničlo, znak »/« pa, da realnih ničel ni ali da je graf pri $a = 0$ vodoravna premica brez temena. V aplikaciji poskusi:

1. Dviguj $q$ proti $0$: ničli se bližata druga drugi, pri $q = 0$ se zlijeta v temenu (na sliki ostane le točka T), pri $q > 0$ izgineta.
2. Nastavi $a = -1$: ničli se vrneta, ker se kraka zdaj spuščata proti osi.
3. Premikaj $p$: ničli potujeta skupaj z osjo, razdalja med njima ostane enaka.

:::risba graf
opis: Graf funkcije y = a(x − p)² + q; pri a ≠ 0 je to parabola s temenom T({p}, {q}) in črtkano simetrijsko osjo x = {p}, teme je označeno s T, ničli sta točki na osi x; pri a = 0 je graf vodoravna premica brez temena in osi. V aplikaciji se a, p in q spreminjajo z drsniki; izbrano je a = {a}, p = {p} in q = {q}. Ničli sta {p - sqrt(-q/a)} in {p + sqrt(-q/a)}; enaki števili pomenita dvojno ničlo, »/« pomeni, da realnih ničel ni ali graf ni parabola.
x: -6 .. 6 | 2
y: -6 .. 6 | 2
enako: da
drsnik: a | -2 .. 2 | 0,5 | 1 | vodilni koeficient a
drsnik: p | -2 .. 2 | 1 | 1 | prva koordinata temena p
drsnik: q | -4 .. 4 | 1 | -4 | druga koordinata temena q
f: a*(x - p)^2 + q | modra
črta: p + 0/a; -6 -> p + 0/a; 6 | siva črtkano
točka: p - sqrt(-q/a); 0 | | | oranžna
točka: p + sqrt(-q/a); 0 | | | oranžna
točka: p + 0/a; q
napis: p + 0,45; q - 0,6*a/abs(a) | T | sredina
podnapis: a = {a}, p = {p}, q = {q}; ničli: {p - sqrt(-q/a)} in {p + sqrt(-q/a)}
:::

:::premisli
Funkciji $f(x) = -2(x - 1)^2 + 8$ in $g(x) = 2(x - 1)^2 + 8$ imata isto teme. Napovej, kje graf $f$ seka os $x$, in pojasni, zakaj graf $g$ osi ne seka.
---
Obe imata teme $T(1, 8)$ nad osjo $x$. Parabola $f$ je odprta navzdol, njena kraka se spuščata in os $x$ presečeta dvakrat, pri $x = -1$ in $x = 3$. Parabola $g$ je odprta navzgor, teme je njena najnižja točka, zato je ves graf nad osjo.
:::

*Preveri:* kateri sta ničli $f(x) = (x - 1)^2 - 3$? (Iz $x - 1 = \pm\sqrt{3}$ sledi $x_1 = 1 - \sqrt{3}$ in $x_2 = 1 + \sqrt{3}$; ničli nista vedno celi števili.)

**7. Lastnosti.** Za $a > 0$ funkcija pada na intervalu $(-\infty, p]$ in narašča na $[p, \infty)$, zaloga vrednosti je $[q, \infty)$. Za $a < 0$ je obratno: narašča na $(-\infty, p]$, pada na $[p, \infty)$, zaloga vrednosti je $(-\infty, q]$. Na risbi Primera 1 to vidiš: graf pada do $x = 1$, nato narašča, najmanjša vrednost je $-8$.

*Preveri:* kakšna je zaloga vrednosti $f(x) = -(x - 2)^2 + 9$? ($(-\infty, 9]$, ker je $a < 0$.)

## Rešeni primeri

### Primer 1 (lažji)

Dana je funkcija $f(x) = 2(x - 1)^2 - 8$. Zapiši teme, smer odprtosti, presečišče z osjo $y$, ničle in zalogo vrednosti.

**Podatki:** predpis v temenski obliki $f(x) = 2(x - 1)^2 - 8$, torej $a = 2$, $p = 1$, $q = -8$
**Iščemo:** teme $T$, smer odprtosti, presečišče z osjo $y$, ničli $x_1$, $x_2$, zalogo vrednosti $Z_f$

:::formula
Temenska oblika $f(x) = a(x - p)^2 + q$, teme $T(p, q)$; ničle iz $f(x) = 0$
:::

**Rešitev:**

1. Teme: $T(1, -8)$. Ker je $a = 2 > 0$, je parabola odprta navzgor in ožja od $y = x^2$.
2. Presečišče z osjo $y$: $f(0) = 2(0 - 1)^2 - 8 = 2 - 8 = -6$, torej točka $(0, -6)$.
3. Ničle: $2(x - 1)^2 - 8 = 0$, $(x - 1)^2 = 4$, $x - 1 = \pm 2$. Dobimo $x_1 = -1$ in $x_2 = 3$.
4. Preverjanje: $f(3) = 2 \cdot 4 - 8 = 0$ in $f(-1) = 2 \cdot 4 - 8 = 0$. Ničli sta simetrični glede na os $x = 1$.
5. Zaloga vrednosti: najmanjša vrednost je $q = -8$, zato $Z_f = [-8, \infty)$.
6. Za graf dodamo še zrcalno točko presečišča glede na os $x = 1$, točko $(2, -6)$, in skozi vseh pet točk narišemo parabolo.
7. Odgovor: teme $T(1, -8)$, odprta navzgor, presečišče $(0, -6)$, ničli $-1$ in $3$, $Z_f = [-8, \infty)$.

:::risba graf
opis: Parabola y = 2(x − 1)² − 8 skozi pet točk: teme T(1, −8), ničli (−1, 0) in (3, 0), presečišče z osjo y (0, −6) in njegova zrcalna točka (2, −6). Črtkana simetrijska os je x = 1.
x: -3 .. 5
y: -10 .. 6 | 2
f: 2*(x - 1)^2 - 8 | modra
črta: 1; -10 -> 1; 6 | siva črtkano
točka: 1; -8 | T(1, −8) | pod desno
točka: -1; 0 | −1 | pod levo | oranžna
točka: 3; 0 | 3 | pod desno | oranžna
točka: 0; -6 | (0, −6) | levo
točka: 2; -6 | (2, −6) | desno
podnapis: Pet točk za graf: teme, ničli, presečišče z osjo y in njegova zrcalna točka
:::

### Primer 2 (srednji): prosti met

Košarkar izvaja prosti met. Po pravilih FIBA je obroč $3{,}05\,\text{m}$ nad tlemi. Črta prostih metov je $4{,}225\,\text{m}$ pred sredino obroča; iztegnjene roke segajo dobrih $0{,}2\,\text{m}$ čez črto, zato žoga odleti $4\,\text{m}$ pred sredino obroča, na višini $2{,}25\,\text{m}$. Njeno višino v metrih opiše model $h(x) = -0{,}25x^2 + 1{,}2x + 2{,}25$, kjer je $x$ vodoravna razdalja od mesta meta v metrih. Kje in kako visoko je žoga najvišje? Pri katerih $x$ je na višini obroča?

**Podatki:** $h(x) = -0{,}25x^2 + 1{,}2x + 2{,}25$, torej $a = -0{,}25$, $b = 1{,}2$, $c = 2{,}25$; višina obroča $3{,}05\,\text{m}$, sredina obroča pri $x = 4\,\text{m}$
**Iščemo:** teme $T(p, q)$, temensko obliko in razdalje $x$, pri katerih je $h(x) = 3{,}05$

:::formula
$p = -\dfrac{b}{2a}$, $q = h(p)$, $h(x) = a(x - p)^2 + q$
:::

**Rešitev:**

1. Prva koordinata temena: $p = -\dfrac{1{,}2}{2 \cdot (-0{,}25)} = 2{,}4$.
2. Druga koordinata: $q = h(2{,}4) = -0{,}25 \cdot 2{,}4^2 + 1{,}2 \cdot 2{,}4 + 2{,}25 = 3{,}69$. Ker je $a < 0$, je teme najvišja točka.
3. Temenska oblika: $h(x) = -0{,}25(x - 2{,}4)^2 + 3{,}69$. Kontrola s prostim členom: $h(0) = -0{,}25 \cdot 5{,}76 + 3{,}69 = 2{,}25$, višina izmeta.
4. Višina obroča: enačba $-0{,}25(x - 2{,}4)^2 + 3{,}69 = 3{,}05$ da $(x - 2{,}4)^2 = 2{,}56$, torej $x - 2{,}4 = \pm 1{,}6$. Rešitvi sta $x = 0{,}8$ in $x = 4$, simetrični glede na os $x = 2{,}4$.
5. Pri $x = 0{,}8$ se žoga še dviga (funkcija narašča na $[0; 2{,}4]$), pri $x = 4$ pa pada: od temena se spusti za $3{,}69 - 3{,}05 = 0{,}64\,\text{m}$ in pade v koš od zgoraj.
6. Odgovor: žoga je najvišje $2{,}4\,\text{m}$ od mesta meta, na višini $3{,}69\,\text{m}$. Na višini obroča je pri $0{,}8\,\text{m}$ in pri $4\,\text{m}$, kjer pade skozi obroč.

:::risba graf
opis: Pot žoge kot parabola od točke meta (0; 2,25) čez teme T(2,4; 3,69) do obroča v točki (4; 3,05). Črtkana vodoravna črta na višini obroča 3,05 m seka parabolo že v točki (0,8; 3,05). Vodoravna os je razdalja od mesta meta v metrih, navpična višina v metrih.
x: 0 .. 5 | 1 | x (m)
y: 0 .. 5 | 1 | h (m)
enako: da
f: -0,25*x^2 + 1,2*x + 2,25 | modra | 0 .. 4
črta: 0; 3,05 -> 4; 3,05 | oranžna črtkano
točka: 0; 2,25 | met | desno
točka: 2,4; 3,69 | T(2,4; 3,69) | nad
točka: 0,8; 3,05 | (0,8; 3,05) | pod desno | oranžna
točka: 4; 3,05 | obroč | desno | oranžna
podnapis: Žoga je najvišje 2,4 m od mesta meta, 1,6 m pred košem
:::

### Primer 3 (težji): najtoplejša ura dneva

Temperaturo iz uvoda med 8.00 in 20.00 opišemo s kvadratno funkcijo $f(t)$, kjer je $t$ ura dneva in $f(t)$ temperatura v $^\circ\text{C}$. Izračunaj, kdaj in kolikšna je bila najvišja temperatura in kdaj je bilo $16\,^\circ\text{C}$.

**Podatki:** $f(8) = 11$, $f(12) = 19$, $f(16) = 19$, $f(20) = 11$ ($t$ v urah, $f(t)$ v $^\circ\text{C}$); iskana temperatura $16\,^\circ\text{C}$
**Iščemo:** teme $T(p, q)$, koeficient $a$ in čase, ko je $f(t) = 16$

:::formula
$f(t) = a(t - p)^2 + q$; enaki vrednosti $f(t_1) = f(t_2)$ ležita simetrično glede na os: $p = \dfrac{t_1 + t_2}{2}$
:::

**Rešitev:**

1. Ker je $f(12) = f(16)$, je simetrijska os na sredini: $p = \dfrac{12 + 16}{2} = 14$.
2. Torej $f(t) = a(t - 14)^2 + q$. Točka $(12, 19)$ da enačbo $4a + q = 19$, točka $(8, 11)$ pa enačbo $36a + q = 11$.
3. Drugo enačbo odštejemo od prve: $-32a = 8$, zato $a = -0{,}25$. Nato $q = 19 - 4 \cdot (-0{,}25) = 20$.
4. Model je $f(t) = -0{,}25(t - 14)^2 + 20$. Kontrola s četrto meritvijo: $f(20) = -0{,}25 \cdot 36 + 20 = 11$.
5. Temperatura $16\,^\circ\text{C}$: $-0{,}25(t - 14)^2 + 20 = 16$, torej $(t - 14)^2 = 16$ in $t - 14 = \pm 4$. Dobimo $t = 10$ in $t = 18$.
6. Odgovor: po modelu je bilo najtopleje ob 14.00, $20\,^\circ\text{C}$, zato Jaka nima prav; $16\,^\circ\text{C}$ je bilo ob 10.00 in ob 18.00.
7. Meja modela: velja le med 8.00 in 20.00. Za polnoč bi dal $f(0) = -0{,}25 \cdot 196 + 20 = -29$, torej nesmiselnih $-29\,^\circ\text{C}$. Tudi resnična temperatura je v jasnem dnevu najvišja navadno med 14. in 16. uro, a njen potek ni natančno parabola.

:::risba graf
opis: Parabola skozi štiri meritve (8, 11), (12, 19), (16, 19) in (20, 11) s temenom T(14, 20) na črtkani simetrijski osi pri 14.00. Črtkana vodoravna črta pri 16 °C seka parabolo ob 10.00 in 18.00.
x: 6 .. 22 | 2 | ura
y: 0 .. 24 | 4 | °C
f: -0,25*(x - 14)^2 + 20 | modra | 8 .. 20
črta: 14; 0 -> 14; 24 | siva črtkano
črta: 10; 16 -> 18; 16 | oranžna črtkano
točka: 8; 11
točka: 12; 19
točka: 16; 19
točka: 20; 11
točka: 14; 20 | T(14, 20) | nad desno
točka: 10; 16 | (10, 16) | nad levo | oranžna
točka: 18; 16 | (18, 16) | nad desno | oranžna
podnapis: Vrh leži med meritvama ob 12.00 in 16.00, višje od obeh
:::

### Primer 4 – zdaj ti

Parabola ima teme v točki $T(3, -2)$ in poteka skozi točko $A(1, 6)$. Zapiši predpis kvadratne funkcije v temenski, splošni in ničelni obliki.

**Podatki:** teme $T(3, -2)$, torej $p = 3$, $q = -2$; točka na grafu $A(1, 6)$, torej $f(1) = 6$
**Iščemo:** koeficient $a$ in predpis $f(x)$ v vseh treh oblikah

:::formula
$f(x) = a(x - p)^2 + q$; koordinate točke na grafu zadoščajo predpisu: $f(1) = 6$
:::

**Rešitev:**

1. Vstavimo teme: $f(x) = a(x - 3)^2 - 2$.
2. Vstavimo točko $A$: $6 = a(1 - 3)^2 - 2 = 4a - 2$, zato $4a = 8$ in $a = 2$.
3. Temenska oblika: $f(x) = 2(x - 3)^2 - 2$.
4. Splošna oblika: $2(x^2 - 6x + 9) - 2 = 2x^2 - 12x + 18 - 2 = 2x^2 - 12x + 16$.
5. Zdaj ti: iz temenske oblike poišči ničli in zapiši ničelno obliko.

:::premisli
Kateri sta ničli in kakšna je ničelna oblika?
---
Iz $2(x - 3)^2 = 2$ sledi $(x - 3)^2 = 1$ in $x - 3 = \pm 1$, torej $x_1 = 2$ in $x_2 = 4$. Ničelna oblika je $f(x) = 2(x - 2)(x - 4)$. Kontrola: $f(1) = 2 \cdot (-1) \cdot (-3) = 6$.
:::

## Pogoste napake

- **Napačen predznak v temenu.** Pri $f(x) = (x + 3)^2 - 1$ teme ni $(3, -1)$. Razlog: v temenski obliki je $x - p$, zato $x + 3 = x - (-3)$ in $p = -3$. Pravilno: $T(-3, -1)$. Kontrola: pri $x = p$ je oklepaj enak $0$.
- **Zamenjava $c$ in $q$.** Prosti člen $c$ je vrednost funkcije pri $x = 0$, ne pri temenu. Pri metu na koš iz Primera 2 je $c = 2{,}25$ višina, s katere žoga odleti, najvišja točka pa je $q = 3{,}69$. Razlog za zmedo: pri $b = 0$ sta enaka. Pravilno: $q$ vedno izračunaj kot $f(p)$.
- **Pozabljen $\pm$ pri korenjenju.** Iz $(x - 1)^2 = 4$ nekateri dobijo le $x = 3$. Razlog: enačba $(x - 1)^2 = 4$ ima dve rešitvi za oklepaj: $2$ in $-2$. Pravilno: $x - 1 = \pm 2$, torej $x = 3$ ali $x = -1$.
- **Napaka pri $p = -\dfrac{b}{2a}$.** Pri $f(x) = 2x^2 - 12x + 16$ je $b = -12$, zato $p = -\dfrac{-12}{4} = 3$, ne $-3$. Pravilno: $b$ vstavi z njegovim predznakom v oklepaju.
- **$-x^2$ in $(-x)^2$.** Pri $f(x) = -x^2 + 4x + 5$ je $f(-1) = -(-1)^2 - 4 + 5 = -1 - 4 + 5 = 0$, ne $1 - 4 + 5 = 2$. Razlog: najprej kvadriramo, nato upoštevamo minus pred členom.

## Povzetek

- Kvadratna funkcija: $f(x) = ax^2 + bx + c$, $a \ne 0$; graf je parabola.
- $a > 0$: odprta navzgor (minimum v temenu); $a < 0$: odprta navzdol (maksimum v temenu).
- Temenska oblika $f(x) = a(x - p)^2 + q$, teme $T(p, q)$, simetrijska os $x = p$.
- Iz splošne oblike: $p = -\dfrac{b}{2a}$, $q = f(p)$; presečišče z osjo $y$ je $(0, c)$.
- Ničelna oblika $f(x) = a(x - x_1)(x - x_2)$; ničle so rešitve enačbe $f(x) = 0$.
- Dve realni ničli, če sta $a$ in $q$ različnih predznakov; ena pri $q = 0$; nobene, če sta enakih predznakov.
- Zaloga vrednosti: $[q, \infty)$ za $a > 0$, $(-\infty, q]$ za $a < 0$.
- Ničli (in vsak par enako visokih točk) ležita simetrično glede na os: $p = \dfrac{x_1 + x_2}{2}$. Za $a > 0$ funkcija pada do $p$, nato narašča; za $a < 0$ obratno.

## Drugače: Z analogijo

Predstavljaj si parabolo $y = x^2$ kot črko U, narisano na prozorni foliji z dnom v izhodišču. Vsak parameter temenske oblike naredi s to folijo nekaj drugega:

- Najprej $a$ folijo **raztegne ali stisne** v navpični smeri. Pri $a = 2$ je vsaka točka dvakrat dlje od osi $x$, zato je parabola videti ožja. Pri negativnem $a$ se U **prezrcali** čez os $x$.
- Nato $p$ folijo **premakne levo ali desno**. Pri $(x - 2)^2$ gre dno v desno na $x = 2$, saj je oklepaj enak nič ravno pri $x = 2$.
- Nazadnje $q$ folijo **premakne gor ali dol**. Pri $q = 3$ se dno dvigne na višino $3$.

Vrstni red je pomemben: če bi folijo najprej dvignil za $q$ in jo šele nato raztegnil, bi dno pristalo na višini $a \cdot q$.

## Drugače: Bolj natančno

Temensko obliko dobimo iz splošne z **dopolnjevanjem do popolnega kvadrata**. Za $a \ne 0$ izpostavimo $a$, torej $ax^2 + bx = a\left(x^2 + \dfrac{b}{a}x\right)$, ter v oklepaju prištejemo in odštejemo kvadrat polovice koeficienta pri $x$:

$$ax^2 + bx + c = a\left[\left(x + \frac{b}{2a}\right)^2 - \frac{b^2}{4a^2}\right] + c$$

$$ax^2 + bx + c = a\left(x + \frac{b}{2a}\right)^2 - \frac{b^2}{4a} + c$$

Od tod je $p = -\dfrac{b}{2a}$ in $q = c - \dfrac{b^2}{4a}$, kar se ujema s $q = f(p)$.

**Simetrija.** Za poljuben $d$ velja $f(p + d) = ad^2 + q = f(p - d)$. Točki, ki sta enako oddaljeni od $p$, imata torej enako vrednost; premica $x = p$ je simetrijska os.

**Ekstrem.** Ker je $(x - p)^2 \ge 0$ in je enak nič samo pri $x = p$, za $a > 0$ velja $f(x) \ge q$ z enakostjo samo v temenu, zato je $q$ najmanjša vrednost. Za $a < 0$ je $f(x) \le q$, $q$ je največja vrednost.

**Število ničel.** Iz $(x - p)^2 = -\dfrac{q}{a}$ sledi: desna stran je pozitivna natanko tedaj, ko sta $a$ in $q$ različno predznačena; takrat sta ničli $x_{1,2} = p \pm \sqrt{-\dfrac{q}{a}}$, simetrični glede na $p$. Zato je $p = \dfrac{x_1 + x_2}{2}$: prva koordinata temena je aritmetična sredina ničel.

## Preveri se

? Z grafa odčitaj teme in smer odprtosti. Kateri predpis pripada paraboli?
:::risba graf
opis: Parabola, odprta navzdol, s temenom T(−1, 2). Skozi os y gre v točki (0, 1).
x: -5 .. 3
y: -6 .. 4 | 1
f: -(x + 1)^2 + 2 | modra
točka: -1; 2 | T | nad
točka: 0; 1
:::
- $f(x) = -(x - 1)^2 + 2$
~ Predznak v oklepaju si prebral naravnost. Teme je pri $x = -1$, zato je v oklepaju $x - (-1) = x + 1$.
- $f(x) = (x + 1)^2 + 2$
~ Parabola je odprta navzdol, zato je $a < 0$. Tvoj predpis da pri $x = 0$ vrednost $3$, ne $1$.
+ $f(x) = -(x + 1)^2 + 2$
- $f(x) = -(x + 1)^2 + 1$
~ $1$ je vrednost pri $x = 0$ (prosti člen $c$), ne višina temena. V temenu je $q = 2$.
> Z mreže odčitaš teme $T(-1, 2)$ in točko $(0, 1)$. Teme da $f(x) = a(x + 1)^2 + 2$. Iz $f(0) = a + 2 = 1$ sledi $a = -1$.

? Tri žoge letijo po parabolah $f$, $g$ in $k$. Razvrsti jih po največji višini, ki jo žoga doseže, od najnižje do najvišje.
1. $g(x) = -(x - 1)^2 + 7$
2. $k(x) = -2x^2 + 8$
3. $f(x) = -x^2 + 4x + 5$
> Največja vrednost je $q$. Pri $g$ je $q = 7$, pri $k$ je $q = 8$, pri $f$ je $p = 2$ in $q = f(2) = -4 + 8 + 5 = 9$. Prosti člen $5$ pri $f$ je le vrednost pri $x = 0$, vodilni koeficient $-2$ pri $k$ pa parabolo zoži, ne zniža.

? Ana je iskala ničle $f(x) = 2(x - 3)^2 - 18$ takole: $(x - 3)^2 = 9$, nato $x - 3 = 3$ in $x = 6$. Kje je napaka?
- Ničla je $x = 3$, ker je tam oklepaj enak $0$.
~ Pri $x = 3$ je $f(3) = -18$: to je teme, ne ničla.
+ Pozabila je na $\pm$; druga ničla je $x = 0$.
- Napake ni, kvadratna funkcija ima vedno natanko eno ničlo.
~ Ničli sta lahko dve, ena ali nobena. Tu je teme pod osjo, parabola pa odprta navzgor, zato sta dve.
> Iz $(x - 3)^2 = 9$ sledi $x - 3 = \pm 3$, torej $x_1 = 0$ in $x_2 = 6$. Kontrola: $f(0) = 2 \cdot 9 - 18 = 0$.

? Parabola ima ničli $-2$ in $4$. Kolikšna je prva koordinata $p$ njenega temena?
= 1 | 0
~ 3 | To je polovica razdalje med ničlama. Teme je na sredini med njima: $p = \dfrac{-2 + 4}{2}$.
~ 2 | Ničli si seštel, a vsote nisi delil z $2$.
~ -1 | Predznak je napačen: sredina med $-2$ in $4$ je desno od $0$.
> Ničli ležita simetrično glede na os, zato je $p = \dfrac{x_1 + x_2}{2} = \dfrac{-2 + 4}{2} = 1$.

? Kolikšna je druga koordinata $q$ temena parabole $f(x) = -x^2 - 6x + 7$?
= 16 | 0
~ -20 | V obrazec si vstavil $b = 6$ namesto $b = -6$ in dobil $p = 3$. Pravilno je $p = -\dfrac{-6}{2 \cdot (-1)} = -3$.
~ 34 | Računal si $(-3)^2 = 9$ in pozabil minus pred členom: $-x^2$ je pri $x = -3$ enako $-9$.
~ 7 | $7$ je prosti člen $c$, vrednost pri $x = 0$, ne v temenu.
> $p = -\dfrac{-6}{2 \cdot (-1)} = -3$ in $q = f(-3) = -9 + 18 + 7 = 16$.

? Kolikšna je najmanjša vrednost funkcije $f(x) = 2(x + 1)(x - 5)$?
= -18 | 0
~ -10 | To je $f(0)$, prosti člen $c$. Najmanjša vrednost je v temenu, ne pri $x = 0$.
~ -9 | Pozabil si vodilni koeficient $a = 2$ pred oklepajema.
~ 2 | To je $p$, sredina med ničlama. Vprašanje išče $q = f(p)$.
~ 18 | Predznak: $f(2) = 2 \cdot 3 \cdot (-3)$ je negativno.
> Ničli sta $-1$ in $5$, zato je $p = \dfrac{-1 + 5}{2} = 2$. Ker je $a = 2 > 0$, je najmanjša vrednost $q = f(2) = 2 \cdot 3 \cdot (-3) = -18$.

? Funkcija $f(x) = (x - 1)^2 - 4$ ima teme $T(1, -4)$ in ničli $-1$ in $3$. Kaj se zgodi, če vodilni koeficient spremenimo z $1$ na $-1$ in dobimo $g(x) = -(x - 1)^2 - 4$?
+ Teme ostane $T(1, -4)$, parabola se obrne navzdol in nima več realnih ničel.
- Teme se prezrcali v $(1, 4)$, ničli ostaneta $-1$ in $3$.
~ To velja za $-f(x) = -(x - 1)^2 + 4$, kjer se spremeni tudi predznak $q$. Tu ostane $q = -4$.
- Parabola se obrne navzdol, ničli ostaneta $-1$ in $3$.
~ Parabola se obrne okoli temena, ki ostane pod osjo $x$. Kraka gresta navzdol in osi ne dosežeta več.
> $p$ in $q$ se ne spremenita, zato teme ostane. Zdaj sta $a$ in $q$ oba negativna: teme je najvišja točka in leži pod osjo $x$, zato realnih ničel ni.

:::simboli
f | kvadratna funkcija | f(x) = ax^2 + bx + c | | v Primeru 3 temperatura v $^\circ\text{C}$
x | neodvisna spremenljivka | | | v Primeru 2 vodoravna razdalja od mesta meta v m
a | vodilni koeficient | | | $a \ne 0$; pri $a > 0$ je parabola odprta navzgor
b | linearni koeficient | | |
c | prosti člen | | | presečišče z osjo $y$ je $(0, c)$
p | prva koordinata temena | p = -\frac{b}{2a} | | simetrijska os je $x = p$
q | druga koordinata temena | q = f(p) | |
T | teme parabole | | |
x_1, x_2 | ničli funkcije | | | teme je na sredini: $p = \frac{x_1 + x_2}{2}$
h | višina žoge nad tlemi | | m | v Primeru 2, odvisna od razdalje $x$
Z_f | zaloga vrednosti | | |
t | ura dneva | | h | v Primeru 3; $14$ pomeni 14.00
g, k | drugi kvadratni funkciji | | | v »premisli« in kvizu
d | odmik od simetrijske osi | | |
A | točka na grafu | | | v Primeru 4
t_1, t_2 | uri z enako temperaturo | | h | $p = \frac{t_1 + t_2}{2}$
:::
