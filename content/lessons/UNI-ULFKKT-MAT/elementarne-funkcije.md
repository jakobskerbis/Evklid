---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka. Vsaka stena med usmerjevalnikom in telefonom oslabi signal Wi-Fi približno na polovico. Skozi koliko sten mora signal, da pade pod en odstotek začetne moči? S poskušanjem najdeš $2^{-6} \approx 1{,}6\,\%$ in $2^{-7} \approx 0{,}78\,\%$, torej sedem sten. Obratno vprašanje, koliko sten ustreza dani moči, pa reši šele inverz eksponentne funkcije, logaritem: $\log_2 100 \approx 6{,}64$. Takšne odvisnosti zapišemo s peščico **elementarnih funkcij**: s potencami in koreni, polinomi, racionalnimi funkcijami, eksponentno in logaritemsko funkcijo ter s kotnimi (krožnimi) funkcijami in njihovimi inverzi.

V gimnaziji si te funkcije že spoznal, večinoma na konkretnih primerih. Na univerzi jih potrebujemo bolj natančno, ker nanje gradimo limite, odvode, integrale in diferencialne enačbe. Zato moramo vedeti:

- kje je funkcija definirana in katere vrednosti zavzame,
- katere lastnosti ima (monotonost, sodost, periodičnost, omejenost),
- kdaj ima **inverzno funkcijo** in kako jo izračunamo,
- kako se obnašajo eksponentna, logaritemska in krožne funkcije ter njihovi inverzi.

Kdor te funkcije zanesljivo pozna, kasneje veliko lažje odvaja, integrira in razume modele v kemiji, biologiji in tehniki.

## Razlaga

**1. Funkcija.** Funkcija $f\colon A \to B$ je predpis, ki vsakemu elementu $x \in A$ priredi natanko en element $f(x) \in B$. Množica $A$ je **definicijsko območje** $D_f$, množica vseh dejanskih vrednosti $f(A) = \{f(x) : x \in A\}$ pa **zaloga vrednosti** $Z_f$. Kadar je funkcija podana samo s formulo, za $D_f$ vzamemo največjo množico realnih števil, za katere ima formula smisel. Pri tem pazimo na tri pogoje: imenovalec ne sme biti $0$, pod sodim korenom mora biti nenegativno število, argument logaritma mora biti pozitiven.

**Graf** funkcije je množica točk $\{(x, f(x)) : x \in D_f\}$ v ravnini. Navpična premica seka graf funkcije največ enkrat.

**2. Lastnosti funkcij.**

- **Injektivnost:** $f\colon A \to B$ je injektivna, če za vse $x_1, x_2 \in A$ iz $x_1 \neq x_2$ sledi $f(x_1) \neq f(x_2)$. Vsaka vodoravna premica seka graf največ enkrat.
- **Surjektivnost:** $Z_f = B$, torej za vsak $y \in B$ obstaja $x \in A$ z $f(x) = y$.
- **Bijektivnost:** funkcija je hkrati injektivna in surjektivna.
- **Monotonost:** naj bo $I \subseteq D_f$ (običajno interval). $f$ je na $I$ **naraščajoča**, če za vse $x_1, x_2 \in I$ iz $x_1 < x_2$ sledi $f(x_1) \le f(x_2)$, in **strogo naraščajoča**, če sledi $f(x_1) < f(x_2)$. Podobno definiramo (strogo) padajočo funkcijo.
- **Sodost in lihost:** naj bo $D_f$ simetrično glede na $0$ (iz $x \in D_f$ sledi $-x \in D_f$). Tedaj je $f$ **soda**, če je $f(-x) = f(x)$ za vse $x \in D_f$ (graf je simetričen glede na os $y$), in **liha**, če je $f(-x) = -f(x)$ za vse $x \in D_f$ (graf je simetričen glede na izhodišče).
- **Periodičnost:** $f$ je periodična s periodo $\omega > 0$, če za vse $x \in D_f$ velja $x + \omega \in D_f$ in $f(x + \omega) = f(x)$. Najmanjšo tako $\omega$, če obstaja, imenujemo **osnovna perioda**.
- **Omejenost:** $f$ je omejena, če obstaja $M$, da je $|f(x)| \le M$ za vse $x \in D_f$.

**Premiki in raztegi grafa.** Iz grafa $y = f(x)$ hitro narišemo sorodne grafe. Graf $y = f(x - a)$ je premaknjen za $a$ v desno, graf $y = f(x) + b$ za $b$ navzgor. Graf $y = c \cdot f(x)$ je navpično raztegnjen s faktorjem $c$, graf $y = f(kx)$ pa vodoravno stisnjen s faktorjem $k$ (za $k > 1$). Graf $y = -f(x)$ je zrcaljen čez os $x$, graf $y = f(-x)$ čez os $y$. Tako na primer graf $y = 2\sin(3x) + 1$ dobimo iz sinusoide, ki jo stisnemo na periodo $\frac{2\pi}{3}$, raztegnemo na amplitudo $2$ in dvignemo za $1$.

**3. Kompozitum in inverzna funkcija.** **Kompozitum** funkcij je $(g \circ f)(x) = g(f(x))$: najprej deluje $f$, nato $g$. Na primer za $f(x) = x^2 + 1$ in $g(x) = \ln x$ je $(g \circ f)(x) = \ln(x^2 + 1)$. Kompozitum ni komutativen: $(f \circ g)(x) = (\ln x)^2 + 1$ je druga funkcija.

**Izrek.** Funkcija $f\colon A \to B$ ima **inverzno funkcijo** $f^{-1}\colon B \to A$ natanko tedaj, ko je bijektivna. (Surjektivnost zagotovi, da ima vsak $y \in B$ vsaj eno prasliko, injektivnost pa, da je ta ena sama.) Za bijektivno $f\colon D_f \to Z_f$ je torej $f^{-1}\colon Z_f \to D_f$ in velja

$$f^{-1}(f(x)) = x \ \text{za } x \in D_f, \qquad f(f^{-1}(y)) = y \ \text{za } y \in Z_f.$$

Definicijsko območje in zaloga vrednosti zamenjata vlogi. Graf $f^{-1}$ je zrcalna slika grafa $f$ čez premico $y = x$. Inverzno funkcijo izračunamo tako, da v enačbi $y = f(x)$ izrazimo $x$ z $y$, nato spremenljivki preimenujemo. Pozor: $f^{-1}(x)$ ni isto kot $\frac{1}{f(x)}$.

:::premisli
Zakaj funkcija $x^2$ na vsem $\mathbb{R}$ nima inverza?
---
Vodoravna premica $y = 4$ seka graf v točkah $x = -2$ in $x = 2$. Inverz bi moral številu $4$ prirediti dve vrednosti, funkcija pa vsakemu argumentu priredi natanko eno.
:::

Injektivnost najlaže pokažemo z monotonostjo.

**Izrek.** Naj bo $f\colon D \to \mathbb{R}$ strogo naraščajoča. Tedaj je $f$ injektivna, njen inverz $f^{-1}\colon f(D) \to D$ pa je prav tako strogo naraščajoč. (Enako za strogo padajočo.)

*Dokaz.* Naj bo $x_1 \neq x_2$, recimo $x_1 < x_2$. Tedaj je $f(x_1) < f(x_2)$, torej $f(x_1) \neq f(x_2)$, zato je $f$ injektivna. Naj bosta $y_1 < y_2$ iz $f(D)$ in $x_i = f^{-1}(y_i)$. Če bi bilo $x_1 \ge x_2$, bi zaradi monotonosti veljalo $y_1 = f(x_1) \ge f(x_2) = y_2$, kar je protislovje. Torej $x_1 < x_2$. $\square$

Kadar $f$ ni injektivna, jo **zožimo** na interval, na katerem je strogo monotona. Tako dobimo $\sqrt{x}$ kot inverz funkcije $x^2$, zožene na $[0, \infty)$.

**4. Potence, polinomi, racionalne funkcije.** Potenčna funkcija $x^n$ je za sodi $n$ soda, za lihi $n$ liha. **Polinom** stopnje $n$ je $p(x) = a_n x^n + \dots + a_1 x + a_0$ z $a_n \neq 0$; definiran je na vsem $\mathbb{R}$ in ima največ $n$ realnih ničel. **Racionalna funkcija** je kvocient polinomov $\frac{p(x)}{q(x)}$; definirana je povsod razen v ničlah imenovalca, kjer ima pole (graf ob navpični asimptoti zbeži proti $\pm\infty$) ali luknje, če se ničla imenovalca okrajša s števcem.

**5. Eksponentna funkcija.** Za osnovo $a > 0$, $a \neq 1$, je $f(x) = a^x$ definirana na $\mathbb{R}$, njena zaloga vrednosti je $(0, \infty)$. Za $a > 1$ je strogo naraščajoča, za $0 < a < 1$ strogo padajoča. Vedno gre skozi točko $(0, 1)$. Pravila: $a^{x+y} = a^x a^y$, $(a^x)^y = a^{xy}$, $a^{-x} = \frac{1}{a^x}$. Posebno vlogo ima **naravna eksponentna funkcija** $e^x$ z osnovo $e \approx 2{,}718$, ki jo bomo srečali pri odvodih: je edina eksponentna funkcija, ki je sama sebi enaka po odvajanju.

**6. Logaritemska funkcija.** Pravilo pride za vzorcem. Zapiši nekaj potenc števila $2$:

| $n$ | $2^n$ |
|---|---|
| $1$ | $2$ |
| $2$ | $4$ |
| $3$ | $8$ |
| $4$ | $16$ |
| $5$ | $32$ |

Zmnoži dve vrednosti iz desnega stolpca, na primer $4 \cdot 8 = 32$, in poglej eksponenta: $2 + 3 = 5$. Množenje vrednosti ustreza seštevanju eksponentov. Funkcija, ki vrednosti $2^n$ vrne eksponent $n$, torej množenje spremeni v seštevanje.

:::premisli
Koliko je $\log_2 (8 \cdot 16)$, ne da bi množil?
---
$3 + 4 = 7$, ker je $8 = 2^3$ in $16 = 2^4$. Res je $2^7 = 128 = 8 \cdot 16$.
:::

Ta funkcija je **logaritem**: $\log_a x$ je inverz eksponentne funkcije $a^x$:

$$y = \log_a x \iff a^y = x, \qquad x > 0.$$

Zato je $D = (0, \infty)$ in $Z = \mathbb{R}$, graf gre skozi $(1, 0)$. Za $a > 0$, $a \neq 1$, $x, y > 0$ in $r \in \mathbb{R}$ veljajo pravila $\log_a(xy) = \log_a x + \log_a y$, $\log_a \frac{x}{y} = \log_a x - \log_a y$, $\log_a x^r = r \log_a x$ in prehod na drugo osnovo $\log_a x = \frac{\ln x}{\ln a}$.

*Izpeljava.* Naj bo $u = \log_a x$ in $v = \log_a y$, torej $a^u = x$ in $a^v = y$. Tedaj je $a^{u+v} = a^u a^v = xy$, zato $\log_a(xy) = u + v$. Iz $x^r = (a^u)^r = a^{ru}$ sledi $\log_a x^r = r\log_a x$, kvocient pa sledi iz $\frac{x}{y} = x \cdot y^{-1}$ in $\log_a y^{-1} = -\log_a y$. Za prehod na drugo osnovo enakost $x = a^{\log_a x}$ logaritmiramo z $\ln$: $\ln x = \log_a x \cdot \ln a$, delimo z $\ln a \neq 0$. $\square$ Naravni logaritem je $\ln x = \log_e x$, desetiški pa $\log x = \log_{10} x$. Velja $e^{\ln x} = x$ za $x > 0$ in $\ln e^x = x$ za vse $x$.

**7. Krožne (kotne) funkcije.** Na enotski krožnici točka pri kotu $x$ (v radianih) ima koordinati $(\cos x, \sin x)$. Funkciji $\sin$ in $\cos$ sta definirani na $\mathbb{R}$, zaloga vrednosti je $[-1, 1]$, perioda je $2\pi$. Sinus je lih, kosinus sod. Velja $\sin^2 x + \cos^2 x = 1$. Tangens $\tan x = \frac{\sin x}{\cos x}$ ni definiran v točkah $x = \frac{\pi}{2} + k\pi$, $k \in \mathbb{Z}$, ima periodo $\pi$ in je lih; kotangens $\cot x = \frac{\cos x}{\sin x}$ ni definiran v $x = k\pi$. V analizi kote vedno merimo v radianih: $180^\circ = \pi\,\mathrm{rad}$.

**8. Ciklometrične (krožne inverzne) funkcije.** Krožne funkcije niso injektivne, zato jih pred obratom zožimo:

- $\arcsin\colon [-1, 1] \to [-\frac{\pi}{2}, \frac{\pi}{2}]$ je inverz sinusa, zoženega na $[-\frac{\pi}{2}, \frac{\pi}{2}]$,
- $\arccos\colon [-1, 1] \to [0, \pi]$ je inverz kosinusa, zoženega na $[0, \pi]$,
- $\arctan\colon \mathbb{R} \to (-\frac{\pi}{2}, \frac{\pi}{2})$ je inverz tangensa, zoženega na $(-\frac{\pi}{2}, \frac{\pi}{2})$.

Zato je na primer $\arcsin(\sin x) = x$ samo za $x \in [-\frac{\pi}{2}, \frac{\pi}{2}]$, $\sin(\arcsin x) = x$ pa velja za vse $x \in [-1, 1]$.

**Trditev.** Za vsak $x \in [-1, 1]$ velja $\arcsin x + \arccos x = \frac{\pi}{2}$ in $\cos(\arcsin x) = \sqrt{1 - x^2}$.

*Dokaz.* Naj bo $\alpha = \arcsin x$, torej $\alpha \in [-\frac{\pi}{2}, \frac{\pi}{2}]$ in $\sin\alpha = x$. Kot $\frac{\pi}{2} - \alpha$ leži v $[0, \pi]$ in $\cos(\frac{\pi}{2} - \alpha) = \sin\alpha = x$; ker je $\arccos x$ edini kot iz $[0, \pi]$ s kosinusom $x$, je $\arccos x = \frac{\pi}{2} - \alpha$. Ker je $\alpha \in [-\frac{\pi}{2}, \frac{\pi}{2}]$, je $\cos\alpha \ge 0$; iz $\cos^2\alpha = 1 - \sin^2\alpha = 1 - x^2$ zato sledi $\cos(\arcsin x) = \sqrt{1 - x^2}$. $\square$

**9. Hiperbolične funkcije.** Pri verižnicah, v termodinamiki in pri reševanju diferencialnih enačb srečamo še $\operatorname{sh} x = \frac{e^x - e^{-x}}{2}$ (liha) in $\operatorname{ch} x = \frac{e^x + e^{-x}}{2}$ (soda), za kateri za vse $x \in \mathbb{R}$ velja $\operatorname{ch}^2 x - \operatorname{sh}^2 x = 1$. Dokaz: $\operatorname{ch}^2 x - \operatorname{sh}^2 x = \frac{(e^{2x} + 2 + e^{-2x}) - (e^{2x} - 2 + e^{-2x})}{4} = \frac{4}{4} = 1$.

**Elementarne funkcije** so vse funkcije, ki jih dobimo iz konstant, potenc, eksponentne, logaritemske, krožnih in ciklometričnih funkcij s končno mnogo seštevanji, odštevanji, množenji, deljenji in kompozitumi.

## Rešeni primeri

### Primer 1 (lažji)

Določi definicijsko območje funkcije $f(x) = \ln(4 - x^2) + \sqrt{x + 1}$.

**Podatki:** $f(x) = \ln(4 - x^2) + \sqrt{x + 1}$
**Iščemo:** definicijsko območje $D_f$

:::formula
Argument logaritma mora biti pozitiven: $4 - x^2 > 0$. Pod sodim korenom mora biti nenegativno število: $x + 1 \ge 0$. $D_f$ je presek obeh množic.
:::

**Rešitev:**

1. Logaritem: $4 - x^2 > 0 \iff x^2 < 4 \iff -2 < x < 2$, torej $x \in (-2, 2)$.
2. Koren: $x + 1 \ge 0 \iff x \ge -1$, torej $x \in [-1, \infty)$.
3. Presek, ker morata oba pogoja veljati hkrati: $(-2, 2) \cap [-1, \infty) = [-1, 2)$.
4. Preizkus: $f(-1) = \ln 3 + 0$ obstaja, $x = 2$ pa da $\ln 0$, ki ne obstaja.
5. Odgovor: definicijsko območje je $D_f = [-1, 2)$.

### Primer 2

Pokaži, da je funkcija $f(x) = \dfrac{2x + 1}{x - 3}$ injektivna, in izračunaj njeno inverzno funkcijo. Določi definicijsko območje in zalogo vrednosti obeh funkcij.

**Podatki:** $f(x) = \dfrac{2x + 1}{x - 3}$, $D_f = \mathbb{R} \setminus \{3\}$
**Iščemo:** $f^{-1}(x)$, $D_{f^{-1}}$ in $Z_{f^{-1}}$

:::formula
Iz $y = f(x)$ izrazimo $x$; nato zamenjamo oznaki. Velja $D_{f^{-1}} = Z_f$ in $Z_{f^{-1}} = D_f$.
:::

**Rešitev:**

1. Zapišemo $y = \dfrac{2x + 1}{x - 3}$ in pomnožimo z $x - 3$: $y(x - 3) = 2x + 1$.
2. Uredimo: $yx - 3y = 2x + 1$, torej $x(y - 2) = 3y + 1$.
3. Za $y \neq 2$ dobimo natanko eno rešitev $x = \dfrac{3y + 1}{y - 2}$. Ker ima vsaka vrednost $y$ največ en $x$, je $f$ injektivna. Vrednosti $y = 2$ funkcija ne zavzame (enačba $0 = 7$ nima rešitve), zato je $Z_f = \mathbb{R} \setminus \{2\}$.
4. Preimenujemo spremenljivki, da je $x$ spet neodvisna spremenljivka: $f^{-1}(x) = \dfrac{3x + 1}{x - 2}$.
5. Preizkus: $f(4) = \frac{9}{1} = 9$ in $f^{-1}(9) = \frac{28}{7} = 4$.
6. Odgovor: $f^{-1}(x) = \dfrac{3x + 1}{x - 2}$, $D_{f^{-1}} = \mathbb{R} \setminus \{2\}$ in $Z_{f^{-1}} = \mathbb{R} \setminus \{3\}$. Graf $f$ ima navpično asimptoto $x = 3$ in vodoravno $y = 2$, graf $f^{-1}$ pa ravno obratno.

### Primer 3 (težji)

Pri reakciji prvega reda množinska koncentracija reaktanta pada po zakonu $c(t) = c_0 e^{-kt}$, a $c_0$ in $k$ nista znana. V laboratoriju izmerimo $c = 0{,}64\,\mathrm{mol/L}$ ob $t_1 = 5\,\mathrm{min}$ in $c = 0{,}32\,\mathrm{mol/L}$ ob $t_2 = 20\,\mathrm{min}$. Določi konstanto hitrosti $k$, razpolovni čas in začetno koncentracijo $c_0$, izrazi čas kot funkcijo koncentracije (z definicijskim območjem) in izračunaj, kdaj koncentracija pade na $0{,}08\,\mathrm{mol/L}$.

**Podatki:** $c(t) = c_0 e^{-kt}$, $c(t_1) = 0{,}64\,\mathrm{mol/L}$ pri $t_1 = 5\,\mathrm{min}$, $c(t_2) = 0{,}32\,\mathrm{mol/L}$ pri $t_2 = 20\,\mathrm{min}$, končna koncentracija $c = 0{,}08\,\mathrm{mol/L}$
**Iščemo:** $k$, razpolovni čas $t_{1/2}$, $c_0$, inverzno funkcijo $t(c)$ in čas $t$, ko je $c = 0{,}08\,\mathrm{mol/L}$

:::formula
Kvocient meritev: $\dfrac{c(t_1)}{c(t_2)} = e^{k(t_2 - t_1)}$. Logaritem je inverz eksponentne funkcije: $e^{u} = v \iff u = \ln v$. Torej iz $c = c_0 e^{-kt}$ sledi $t = \dfrac{1}{k} \ln \dfrac{c_0}{c}$ in $t_{1/2} = \dfrac{\ln 2}{k}$.
:::

**Rešitev:**

1. Meritvi delimo, da se neznani $c_0$ okrajša: $\dfrac{c(t_1)}{c(t_2)} = \dfrac{c_0 e^{-kt_1}}{c_0 e^{-kt_2}} = e^{k(t_2 - t_1)}$, torej $e^{15k} = \dfrac{0{,}64}{0{,}32} = 2$ ($k$ v $\mathrm{min^{-1}}$).
2. Logaritmiramo, ker je $\ln$ inverz funkcije $e^x$: $15k = \ln 2$, zato $k = \dfrac{0{,}6931}{15\,\mathrm{min}} \approx 0{,}0462\,\mathrm{min^{-1}}$.
3. Razpolovni čas: iz $\frac{c_0}{2} = c_0 e^{-kt_{1/2}}$ sledi $t_{1/2} = \dfrac{\ln 2}{k} = 15\,\mathrm{min}$. To kažeta že meritvi: v $15\,\mathrm{min}$ je koncentracija padla na polovico. Neodvisen je od $c_0$.
4. Začetna koncentracija iz prve meritve: $c_0 = c(t_1)\, e^{kt_1}$, kjer je $e^{5k} = 2^{5/15} = 2^{1/3} \approx 1{,}260$, torej $c_0 \approx 0{,}64 \cdot 1{,}260\,\mathrm{mol/L} \approx 0{,}806\,\mathrm{mol/L}$.
5. Inverzna funkcija: iz $\frac{c}{c_0} = e^{-kt}$ z logaritmiranjem $t(c) = \dfrac{1}{k} \ln \dfrac{c_0}{c}$. Ker je $c(t)$ za $t \ge 0$ strogo padajoča z zalogo vrednosti $(0, c_0]$, je $t(c)$ definirana za $0 < c \le c_0$.
6. Za $c = 0{,}08\,\mathrm{mol/L}$: $\dfrac{1}{k} = \dfrac{15\,\mathrm{min}}{\ln 2} \approx 21{,}64\,\mathrm{min}$ in $\ln\dfrac{0{,}806}{0{,}08} \approx 2{,}310$, torej $t \approx 21{,}64 \cdot 2{,}310\,\mathrm{min} \approx 50{,}0\,\mathrm{min}$.
7. Preizkus brez kalkulatorja: od $0{,}32$ do $0{,}08\,\mathrm{mol/L}$ koncentracija pade na četrtino, torej v dveh razpolovnih časih: $20\,\mathrm{min} + 2 \cdot 15\,\mathrm{min} = 50\,\mathrm{min}$ ✓.
8. Odgovor: $k \approx 0{,}0462\,\mathrm{min^{-1}}$, razpolovni čas je $15\,\mathrm{min}$, začetna koncentracija približno $0{,}806\,\mathrm{mol/L}$, $t(c) = \frac{1}{k}\ln\frac{c_0}{c}$ za $0 < c \le c_0$, koncentracija $0{,}08\,\mathrm{mol/L}$ pa je dosežena po $50\,\mathrm{min}$.

### Primer 4 – zdaj ti

Telefon se pri hitrem polnjenju polni po modelu $Q(t) = 100\,\% \cdot \left(1 - e^{-t/30}\right)$, kjer je $t$ čas v minutah od začetka polnjenja prazne baterije. Izrazi čas kot funkcijo napolnjenosti in izračunaj, kdaj je baterija napolnjena do $80\,\%$.

**Podatki:** $Q(t) = 100\,\% \cdot \left(1 - e^{-t/30}\right)$, $t$ v minutah, ciljna napolnjenost $Q = 80\,\%$
**Iščemo:** inverzno funkcijo $t(Q)$ in čas $t$ pri $Q = 80\,\%$

:::formula
$e^{u} = v \iff u = \ln v$ za $v > 0$.
:::

**Rešitev:**

1. Delimo s $100\,\%$ in osamimo eksponentno funkcijo: $e^{-t/30} = 1 - \frac{Q}{100\,\%}$.
2. Logaritmiramo, ker je $\ln$ inverz funkcije $e^x$: $-\frac{t}{30} = \ln\left(1 - \frac{Q}{100\,\%}\right)$, torej $t(Q) = -30\,\mathrm{min} \cdot \ln\left(1 - \frac{Q}{100\,\%}\right)$.
3. Vstavi $Q = 80\,\%$ in razmisli, za katere $Q$ je $t(Q)$ sploh definiran.

:::premisli
Kdaj je baterija napolnjena do $80\,\%$ in kaj model pove o $100\,\%$?
---
$t = -30\,\mathrm{min} \cdot \ln 0{,}2 = 30\,\mathrm{min} \cdot \ln 5 \approx 48{,}3\,\mathrm{min}$. Funkcija $t(Q)$ je definirana le za $0 \le Q < 100\,\%$: pri $Q = 100\,\%$ bi dobili $\ln 0$, ki ne obstaja, zato baterija v tem modelu polna nikoli ne postane, le vse počasneje se ji približuje.
:::

## Pogoste napake

- **Zamenjava $f^{-1}(x)$ in $\frac{1}{f(x)}$.** Za $f(x) = e^x$ je $f^{-1}(x) = \ln x$, ne $e^{-x}$. Oznaka $^{-1}$ pri funkciji pomeni obrat, ne recipročne vrednosti.
- **Pozabljeno zoževanje.** Študent zapiše, da je $\sqrt{x}$ inverz $x^2$ na vsem $\mathbb{R}$. Funkcija $x^2$ na $\mathbb{R}$ ni injektivna, zato inverza nima; zožiti jo moramo na $[0, \infty)$.
- **Napačna pravila za logaritme.** $\ln(x + y) \neq \ln x + \ln y$ in $\ln(xy) \neq \ln x \cdot \ln y$. Pravilno: $\ln(xy) = \ln x + \ln y$; za vsoto ni preproste formule. Pazi tudi na osnovo: pri podvajanju je število korakov $\log_2 \frac{N}{N_0}$, ne $\ln \frac{N}{N_0}$.
- **$\arcsin(\sin x) = x$ za vse $x$.** To velja le za $x \in [-\frac{\pi}{2}, \frac{\pi}{2}]$. Na primer $\arcsin(\sin \frac{5\pi}{6}) = \frac{\pi}{6}$.
- **Koti v stopinjah.** V analizi so argumenti krožnih funkcij v radianih. Kalkulator naj bo nastavljen na RAD.
- **Pozabljeni pogoji pri $D_f$.** Pri $\ln(x - 1)$ mora biti $x > 1$, ne $x \ge 1$; pri $\frac{1}{\sqrt{x}}$ mora biti $x > 0$.

## Povzetek

- Funkcija vsakemu $x \in D_f$ priredi natanko eno vrednost; $Z_f$ je množica vseh vrednosti.
- Lastnosti: injektivnost, surjektivnost, monotonost, sodost ($f(-x) = f(x)$), lihost ($f(-x) = -f(x)$), periodičnost, omejenost.
- Bijektivna funkcija ima inverz $f^{-1}$; $D$ in $Z$ zamenjata vlogi, graf se zrcali čez $y = x$. Neinjektivno funkcijo prej zožimo.
- $a^x$: $D = \mathbb{R}$, $Z = (0, \infty)$; $\log_a x$ je njen inverz z $D = (0, \infty)$, $Z = \mathbb{R}$.
- $\sin$, $\cos$: perioda $2\pi$, zaloga $[-1, 1]$; $\tan$: perioda $\pi$. Kote merimo v radianih.
- $\arcsin\colon [-1,1] \to [-\frac{\pi}{2}, \frac{\pi}{2}]$, $\arccos\colon [-1,1] \to [0, \pi]$, $\arctan\colon \mathbb{R} \to (-\frac{\pi}{2}, \frac{\pi}{2})$.

## Za izpit

Znati moraš povedati:

- definicijo funkcije, definicijskega območja, zaloge vrednosti ter injektivnosti, surjektivnosti in bijektivnosti;
- izrek: $f\colon A \to B$ ima inverz natanko tedaj, ko je bijektivna; izrek o strogo monotoni funkciji in njenem inverzu z dokazom;
- definiciji $a^x$ in $\log_a x$ s pogoji $a > 0$, $a \neq 1$, $x > 0$ ter izpeljavo pravil za logaritme in prehoda na drugo osnovo;
- definicije $\arcsin$, $\arccos$, $\arctan$ z definicijskimi območji in zalogami vrednosti ter dokaz $\arcsin x + \arccos x = \frac{\pi}{2}$;
- definiciji $\operatorname{sh}$ in $\operatorname{ch}$ ter dokaz $\operatorname{ch}^2 x - \operatorname{sh}^2 x = 1$.

### Naloga 1

Dana je funkcija $f(x) = 1 + 2\arcsin\dfrac{x - 3}{2}$. Določi $D_f$ in $Z_f$, utemelji, da je $f$ injektivna, izračunaj $f^{-1}$ z definicijskim območjem in zalogo vrednosti ter reši enačbo $f(x) = 1 + \frac{\pi}{2}$.

**Rešitev:**

1. $\arcsin$ je definiran na $[-1, 1]$: $-1 \le \frac{x - 3}{2} \le 1 \iff 1 \le x \le 5$, torej $D_f = [1, 5]$.
2. Ko $x$ preteče $[1, 5]$, preteče $u = \frac{x - 3}{2}$ ves interval $[-1, 1]$, zato $\arcsin u$ preteče $[-\frac{\pi}{2}, \frac{\pi}{2}]$ in $Z_f = [1 - \pi, 1 + \pi] \approx [-2{,}14;\ 4{,}14]$.
3. Funkciji $u = \frac{x - 3}{2}$ in $\arcsin$ sta strogo naraščajoči, zato je kompozitum strogo naraščajoč in po izreku iz razlage injektiven. Kot preslikava $D_f \to Z_f$ je torej bijektivna.
4. Iz $y = 1 + 2\arcsin\frac{x - 3}{2}$ sledi $\arcsin\frac{x - 3}{2} = \frac{y - 1}{2}$; za $y \in Z_f$ leži desna stran v $[-\frac{\pi}{2}, \frac{\pi}{2}]$. Na obeh straneh uporabimo $\sin$ in $\sin(\arcsin u) = u$: $\frac{x - 3}{2} = \sin\frac{y - 1}{2}$ in $x = 3 + 2\sin\frac{y - 1}{2}$.
5. Preimenujemo spremenljivki: $f^{-1}(x) = 3 + 2\sin\dfrac{x - 1}{2}$, $D_{f^{-1}} = [1 - \pi, 1 + \pi]$, $Z_{f^{-1}} = [1, 5]$.
6. Enačba: $x = f^{-1}\left(1 + \frac{\pi}{2}\right) = 3 + 2\sin\frac{\pi}{4} = 3 + \sqrt{2} \approx 4{,}414$, kar leži v $D_f$.
7. Preizkus: $f(4) = 1 + 2\arcsin\frac{1}{2} = 1 + \frac{\pi}{3}$ in $f^{-1}\left(1 + \frac{\pi}{3}\right) = 3 + 2\sin\frac{\pi}{6} = 4$ ✓.
8. Odgovor: $D_f = [1, 5]$, $Z_f = [1 - \pi, 1 + \pi]$, $f^{-1}(x) = 3 + 2\sin\frac{x - 1}{2}$ na $[1 - \pi, 1 + \pi]$ z zalogo $[1, 5]$, rešitev enačbe je $x = 3 + \sqrt{2}$.

### Naloga 2

Natančno navedi, kdaj ima funkcija $f\colon A \to B$ inverzno funkcijo. Dokaži, da je $\operatorname{sh}\colon \mathbb{R} \to \mathbb{R}$ bijektivna, izpelji formulo za njen inverz $\operatorname{arsh}$ in izračunaj $\operatorname{arsh}\frac{3}{4}$.

**Rešitev:**

1. $f\colon A \to B$ ima inverz $f^{-1}\colon B \to A$ natanko tedaj, ko je bijektivna, torej injektivna in surjektivna.
2. Injektivnost: $e^x$ strogo narašča, $e^{-x}$ strogo pada, zato $\operatorname{sh} x = \frac{e^x - e^{-x}}{2}$ strogo narašča in je po izreku iz razlage injektivna.
3. Surjektivnost: za dani $y \in \mathbb{R}$ rešimo $\frac{e^x - e^{-x}}{2} = y$. Pomnožimo z $2e^x \neq 0$: $e^{2x} - 2y\,e^x - 1 = 0$, kar je kvadratna enačba $t^2 - 2yt - 1 = 0$ za $t = e^x$.
4. Rešitvi sta $t = y \pm \sqrt{y^2 + 1}$. Ker je $\sqrt{y^2 + 1} > |y|$, je $y - \sqrt{y^2 + 1} < 0$ in odpade (saj $e^x > 0$), $y + \sqrt{y^2 + 1} > 0$ pa je dopustna. Za vsak $y$ torej obstaja $x = \ln\left(y + \sqrt{y^2 + 1}\right)$ z $\operatorname{sh} x = y$, zato je $\operatorname{sh}$ surjektivna in s tem bijektivna.
5. Preimenujemo spremenljivki: $\operatorname{arsh} x = \ln\left(x + \sqrt{x^2 + 1}\right)$ za vse $x \in \mathbb{R}$.
6. $\operatorname{arsh}\frac{3}{4} = \ln\left(\frac{3}{4} + \sqrt{\frac{9}{16} + 1}\right) = \ln\left(\frac{3}{4} + \frac{5}{4}\right) = \ln 2 \approx 0{,}693$.
7. Preizkus: $\operatorname{sh}(\ln 2) = \frac{2 - \frac{1}{2}}{2} = \frac{3}{4}$ ✓. Odgovor: $\operatorname{arsh} x = \ln\left(x + \sqrt{x^2 + 1}\right)$ in $\operatorname{arsh}\frac{3}{4} = \ln 2$.

## Drugače: Na sliki

Nariši v isti koordinatni sistem premico $y = x$, graf $y = e^x$ in graf $y = \ln x$. Graf $e^x$ leži nad osjo $x$, gre skozi točko $(0, 1)$ in se na levi približuje osi $x$ (vodoravna asimptota $y = 0$). Graf $\ln x$ je njegova zrcalna slika čez premico $y = x$: leži desno od osi $y$, gre skozi $(1, 0)$ in se pri $x \to 0^+$ spušča proti $-\infty$ (navpična asimptota $x = 0$).

Enako velja za vsak par funkcija in njen inverz. Točka $(a, b)$ na grafu $f$ ustreza točki $(b, a)$ na grafu $f^{-1}$:

| $x$ | $e^x$ |
|---|---|
| $-1$ | $0{,}368$ |
| $0$ | $1$ |
| $1$ | $2{,}718$ |
| $2$ | $7{,}389$ |

Iz preglednice preberemo točke za $\ln x$: $(0{,}368;\ -1)$; $(1;\ 0)$; $(2{,}718;\ 1)$; $(7{,}389;\ 2)$.

Pri sinusu si predstavljaj valovito črto med $-1$ in $1$. Za $\arcsin$ izreži samo kos od $-\frac{\pi}{2}$ do $\frac{\pi}{2}$, kjer sinus strogo narašča, in ga prezrcali čez $y = x$. Dobiš kratko krivuljo od točke $(-1, -\frac{\pi}{2})$ do točke $(1, \frac{\pi}{2})$.

## Drugače: Uporaba v stroki

**pH-meter.** $\mathrm{pH} = -\log [\mathrm{H_3O^+}]$ (koncentracija v $\mathrm{mol/L}$), inverz je $[\mathrm{H_3O^+}] = 10^{-\mathrm{pH}}$. Steklena elektroda da napetost, ki je po Nernstovi enačbi linearna v pH, pri $25\,^\circ\mathrm{C}$ približno $59\,\mathrm{mV}$ na enoto pH. Zato pH-meter umerimo z dvema pufroma: logaritem spremeni desetkratne spremembe koncentracije v enake korake napetosti.

**Aktivacijska energija.** Konstanta hitrosti sledi Arrheniusovi enačbi $k = A\,e^{-E_a/(RT)}$. Logaritmiramo: $\ln k = \ln A - \frac{E_a}{R}\cdot\frac{1}{T}$. Meritve $k$ pri več temperaturah v grafu $\ln k$ proti $\frac{1}{T}$ ležijo na premici z naklonom $-\frac{E_a}{R}$; tako $E_a$ odčitamo iz linearne regresije.

**Spektrofotometrija.** Prepustnost raztopine $\frac{I}{I_0} = 10^{-\varepsilon l c}$ pada eksponentno s koncentracijo, absorbanca $\log\frac{I_0}{I} = \varepsilon l c$ pa je linearna (Beer-Lambertov zakon). Zato umeritvena premica podaja absorbanco, ne prepustnosti.

**Bioreaktor.** V eksponentni fazi je $N(t) = N_0 \cdot 2^{t/T}$ z generacijskim časom $T$. Čas do želene gostote celic da inverz $t = T \log_2 \frac{N}{N_0}$: od $10^6$ do $10^9$ celic pri $T = 20\,\mathrm{min}$ traja $20\,\mathrm{min} \cdot \log_2 1000 \approx 199\,\mathrm{min}$, dobre $3$ ure.

## Drugače: Korak za korakom s številkami

Izračunajmo vrednosti in lastnosti funkcije $f(x) = \arctan(2x)$.

1. **Definicijsko območje.** $\arctan$ je definiran na vsem $\mathbb{R}$, $2x$ tudi, zato $D_f = \mathbb{R}$.
2. **Zaloga vrednosti.** Ker $2x$ zavzame vsa realna števila, $f$ zavzame vse vrednosti $\arctan$: $Z_f = (-\frac{\pi}{2}, \frac{\pi}{2})$. Funkcija je omejena z $\frac{\pi}{2} \approx 1{,}571$.
3. **Lihost.** $f(-x) = \arctan(-2x) = -\arctan(2x) = -f(x)$, ker je $\arctan$ lih. Graf je simetričen glede na izhodišče.
4. **Nekaj vrednosti.** $f(0) = 0$, $f(\frac{1}{2}) = \arctan 1 = \frac{\pi}{4} \approx 0{,}785$, $f(-\frac{1}{2}) = -\frac{\pi}{4}$.
5. **Monotonost.** $2x$ in $\arctan$ sta strogo naraščajoči, zato je kompozitum strogo naraščajoč in injektiven.
6. **Inverz.** $y = \arctan(2x) \iff \tan y = 2x$ za $y \in (-\frac{\pi}{2}, \frac{\pi}{2})$, torej $f^{-1}(x) = \frac{1}{2} \tan x$ na intervalu $(-\frac{\pi}{2}, \frac{\pi}{2})$.
7. **Preizkus.** $f^{-1}(\frac{\pi}{4}) = \frac{1}{2} \tan \frac{\pi}{4} = \frac{1}{2}$, kar ustreza koraku 4.

## Drugače: Bolj natančno

**Definicija potence z realnim eksponentom.** Za racionalni $r = \frac{p}{q}$ definiramo $a^r = \sqrt[q]{a^p}$. Za iracionalni $x$ definiramo $a^x$ kot limito $a^{r_n}$, kjer je $(r_n)$ zaporedje racionalnih števil z limito $x$. Ta definicija je dobra, ker je $r \mapsto a^r$ monotona funkcija na $\mathbb{Q}$, realna števila pa so polna. Na podoben način (z vrsto $e^x = \sum_{n \ge 0} \frac{x^n}{n!}$) eksponentno funkcijo pogosto vpeljemo na začetku analize; logaritem je tedaj definiran kot njen inverz.

**Razcep na sodi in lihi del.** Vsako funkcijo na simetričnem območju lahko zapišemo kot vsoto sode in lihe:

$$f(x) = \underbrace{\frac{f(x) + f(-x)}{2}}_{\text{soda}} + \underbrace{\frac{f(x) - f(-x)}{2}}_{\text{liha}}.$$

Za $f(x) = e^x$ sta to ravno $\operatorname{ch} x$ in $\operatorname{sh} x$. Razcep je enoličen: če je $f = g + h$ z $g$ sodo in $h$ liho, je $f(-x) = g(x) - h(x)$, od koder $g$ in $h$ izrazimo z zgornjima formulama.

## Preveri se

? Koliko je $\log_2 8 + \ln e^3$?
- $5$
~ Verjetno si $\log_2 8$ vzel kot $2$; logaritem je eksponent $y$, pri katerem je $2^y = 8$, to pa je $3$.
+ $6$
- $9$
~ Delna rezultata $3$ in $3$ si zmnožil, naloga pa ju sešteva.
> $\log_2 8 = 3$, ker je $2^3 = 8$, in $\ln e^3 = 3$. Vsota je $6$.

? Koliko je $\arcsin\left(\sin \frac{5\pi}{6}\right)$?
- $\frac{5\pi}{6}$
~ $\arcsin(\sin x) = x$ velja le za $x \in [-\frac{\pi}{2}, \frac{\pi}{2}]$, $\frac{5\pi}{6}$ pa je zunaj tega intervala.
+ $\frac{\pi}{6}$
- $-\frac{\pi}{6}$
~ Sinus kota $\frac{5\pi}{6}$ je pozitiven, zato je pozitiven tudi njegov $\arcsin$.
> $\sin \frac{5\pi}{6} = \frac{1}{2}$, $\arcsin$ pa vrne kot iz $[-\frac{\pi}{2}, \frac{\pi}{2}]$, torej $\arcsin \frac{1}{2} = \frac{\pi}{6}$.

? Katera funkcija je liha?
+ $f(x) = x^3 - \sin x$
- $f(x) = x^2 + \cos x$
~ Oba člena sta soda, zato je vsota soda: $f(-x) = f(x)$.
- $f(x) = e^x$
~ $e^{-x}$ ni enako $-e^x$, saj je $e^x$ vedno pozitiven; funkcija ni ne soda ne liha.
> $(-x)^3 - \sin(-x) = -x^3 + \sin x = -(x^3 - \sin x)$. Druga funkcija je soda, $e^x$ pa ni ne soda ne liha.

? Kaj je inverzna funkcija funkcije $f(x) = e^{2x} + 1$?
+ $f^{-1}(x) = \frac{1}{2}\ln(x - 1)$ za $x > 1$
- $f^{-1}(x) = \ln\frac{x - 1}{2}$ za $x > 1$
~ Faktor $2$ stoji v eksponentu, zato deliš z njim šele po logaritmiranju: iz $e^{2x} = y - 1$ sledi $2x = \ln(y - 1)$.
- $f^{-1}(x) = \frac{1}{e^{2x} + 1}$
~ To je recipročna vrednost $\frac{1}{f(x)}$; oznaka $^{-1}$ pri funkciji pomeni obrat.
> Iz $y = e^{2x} + 1$ sledi $e^{2x} = y - 1$ in $x = \frac{1}{2}\ln(y - 1)$. Recipročna vrednost $\frac{1}{f(x)}$ ni inverz.

? Aplikacija za telefon ima $2000$ uporabnikov, njihovo število pa se vsak teden podvoji: $N(t) = 2000 \cdot 2^t$ ($t$ v tednih). Po koliko tednih ima $64\,000$ uporabnikov?
- po $32$ tednih
~ $32$ je razmerje $\frac{N}{N_0}$; število tednov je eksponent, pri katerem je $2^t = 32$.
+ po $5$ tednih
- po približno $3{,}47$ tedna
~ To je $\ln 32$; pri podvajanju potrebuješ $\log_2 32 = \frac{\ln 32}{\ln 2}$.
> $2^t = \frac{64\,000}{2000} = 32$, zato je $t = \log_2 32 = 5$ tednov.

:::simboli
f | funkcija | |
x | neodvisna spremenljivka (argument) | |
y | vrednost funkcije | y = f(x) |
D_f | definicijsko območje funkcije f | |
Z_f | zaloga vrednosti funkcije f | |
D_{f^{-1}} | definicijsko območje inverzne funkcije | D_{f^{-1}} = Z_f |
Z_{f^{-1}} | zaloga vrednosti inverzne funkcije | Z_{f^{-1}} = D_f |
a | osnova eksponentne funkcije in logaritma | | | a > 0, a ≠ 1; pri premikih grafa premik v desno
e | Eulerjevo število | | | e ≈ 2,718; osnova naravnega logaritma
u | eksponent pri osnovi e | u = \ln v |
v | pozitivna vrednost potence e^u | | | v > 0
c | množinska koncentracija reaktanta | c = c_0 e^{-kt} | mol/L | pri raztegih grafa faktor c
c_0 | začetna koncentracija reaktanta | | mol/L
k | konstanta hitrosti reakcije | | min^{-1} | pri grafih faktor stiskanja; k ∈ ℤ pri periodah
t | čas | t = \frac{1}{k} \ln \frac{c_0}{c} | min
Q | napolnjenost baterije (v odstotkih) | Q(t) = 100\,\% \cdot (1 - e^{-t/30}) | | v primeru 4
:::
