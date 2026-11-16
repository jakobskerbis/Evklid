---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nobena meritev ni popolnoma natančna. Če petkrat stehtaš isti vzorec, dobiš pet malo različnih vrednosti. Če posadiš deset semen, jih ne vzklije vedno enako število. Dve laboratorijski meritvi se razlikujeta, ker na rezultat vpliva veliko drobnih, nenadzorovanih vzrokov. Takšne pojave imenujemo **slučajni**, orodji za njihov opis pa sta **verjetnostni račun** in **statistika**.

Verjetnostni račun iz znanega modela napove, kako pogosti bodo posamezni izidi. Statistika gre v obratno smer: iz izmerjenih podatkov (**vzorca**) sklepa o lastnostih celotne **populacije** in pove, kako zanesljiv je ta sklep.

Spoznali bomo:

- slučajne spremenljivke in njihove **porazdelitve** (binomsko, Poissonovo, normalno),
- **povprečje**, **varianco** in **standardni odklon** vzorca,
- **linearno regresijo**: kako skozi meritve položimo najboljšo premico in kako dobro se jim prilega.

To znanje potrebuješ pri vsaki laboratorijski vaji, pri umeritvenih krivuljah, pri poskusih v biologiji in pri kontroli kakovosti.

## Razlaga

**1. Dogodki in verjetnost.** **Poskus** je postopek z negotovim izidom (met kocke, kalitev semena, meritev). Množico vseh izidov označimo z $\Omega$, **dogodek** je podmnožica $\Omega$. *Definicija.* **Verjetnost** je preslikava, ki vsakemu dogodku $A$ priredi število $P(A) \in [0, 1]$, tako da je $P(\Omega) = 1$ in $P(A \cup B) = P(A) + P(B)$, kadar sta $A$ in $B$ **nezdružljiva** ($A \cap B = \emptyset$); enako velja za števno mnogo paroma nezdružljivih dogodkov. Iz tega sledi $P(\bar A) = 1 - P(A)$ za nasprotni dogodek (ker sta $A$ in $\bar A$ nezdružljiva in $A \cup \bar A = \Omega$), za poljubna dogodka pa

$$P(A \cup B) = P(A) + P(B) - P(A \cap B).$$

*Dokaz:* $A \cup B$ je unija nezdružljivih dogodkov $A$ in $B \setminus A$, dogodek $B$ pa unija nezdružljivih $A \cap B$ in $B \setminus A$; zato je $P(A \cup B) = P(A) + P(B \setminus A) = P(A) + P(B) - P(A \cap B)$.

Pri enako verjetnih izidih je **klasična** verjetnost $P(A) = \frac{\text{število ugodnih izidov}}{\text{število vseh izidov}}$. Če je $P(B) > 0$, je **pogojna verjetnost** $P(A \mid B) = \frac{P(A \cap B)}{P(B)}$. Dogodka sta **neodvisna**, če je $P(A \cap B) = P(A)\,P(B)$; pri $P(B) > 0$ je to isto kot $P(A \mid B) = P(A)$.

**2. Slučajna spremenljivka.** **Slučajna spremenljivka** $X$ vsakemu izidu priredi število: število vzklilih semen, maso tablete, število razpadov v eni sekundi. Je **diskretna**, če zavzame le končno ali števno mnogo vrednosti $x_1, x_2, \dots$ z verjetnostmi $p_i = P(X = x_i)$, $\sum p_i = 1$. Je **zvezna**, če jo opiše **gostota** $f(x) \ge 0$ z $\int_{-\infty}^{\infty} f(x)\,dx = 1$; tedaj je $P(a \le X \le b) = \int_a^b f(x)\,dx$.

**3. Pričakovana vrednost in varianca.** **Pričakovana vrednost** je teoretično povprečje:

$$E(X) = \sum_i x_i\, p_i \quad\text{oziroma}\quad E(X) = \int_{-\infty}^{\infty} x f(x)\, dx.$$

Označimo jo tudi z $\mu$. **Varianca** meri razpršenost okoli $\mu$, **standardni odklon** je njen koren:

$$D(X) = \sigma^2 = E\big((X - \mu)^2\big) = E(X^2) - \mu^2, \qquad \sigma = \sqrt{D(X)}.$$

Standardni odklon ima isto enoto kot $X$, zato ga lažje razložimo. Pričakovana vrednost je linearna, $E(aX + b) = aE(X) + b$, zato je $E\big((X - \mu)^2\big) = E(X^2) - 2\mu E(X) + \mu^2 = E(X^2) - \mu^2$. Podobno sledi $D(aX + b) = a^2 D(X)$; za **neodvisni** $X$ in $Y$ velja še $D(X + Y) = D(X) + D(Y)$.

:::premisli
Temperatura ima standardni odklon $\sigma = 2\,^\circ\mathrm{C}$. Kolikšen je $\sigma$, če iste vrednosti zapišeš v kelvinih ($T = t + 273{,}15$) in kolikšen v stopinjah Fahrenheita ($t_F = 1{,}8\,t + 32$)?
---
Iz $D(aX + b) = a^2 D(X)$ sledi $\sigma(aX + b) = |a|\,\sigma$. Premik $b$ razpršenosti ne spremeni: v kelvinih je $\sigma = 2\,\mathrm{K}$. Faktor $1{,}8$ jo raztegne: $\sigma = 3{,}6\,^\circ\mathrm{F}$.
:::

**4. Pomembne porazdelitve.**

- **Binomska porazdelitev** $B(n, p)$: poskus z dvema izidoma (uspeh z verjetnostjo $p$) ponovimo $n$-krat neodvisno, $X$ je število uspehov.
$$P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k}, \qquad E(X) = np, \qquad \sigma^2 = np(1 - p).$$
Vsako zaporedje izidov s $k$ uspehi ima zaradi neodvisnosti verjetnost $p^k(1 - p)^{n - k}$, takih zaporedij pa je $\binom{n}{k}$ (izberemo mesta uspehov).
- **Poissonova porazdelitev** s parametrom $\lambda > 0$: število redkih dogodkov v danem času ali prostoru (razpadi jeder, mutacije, klici v centrali).
$$P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}, \quad k = 0, 1, 2, \dots, \qquad E(X) = \sigma^2 = \lambda.$$
Res: $E(X) = \sum_{k \ge 1} k\,\frac{\lambda^k e^{-\lambda}}{k!} = \lambda \sum_{k \ge 1} \frac{\lambda^{k-1} e^{-\lambda}}{(k - 1)!} = \lambda$, ker je zadnja vsota vsota vseh verjetnosti.
- **Normalna (Gaussova) porazdelitev** $N(\mu, \sigma)$ z gostoto
$$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, e^{-\frac{(x - \mu)^2}{2\sigma^2}}.$$
Graf je zvonasta krivulja, simetrična okoli $\mu$. S **standardizacijo** $Z = \frac{X - \mu}{\sigma}$ dobimo standardno normalno porazdelitev $N(0, 1)$, katere porazdelitvena funkcija $\Phi(z) = P(Z \le z)$ je tabelirana. Po pravilih iz točke 3 je $E(Z) = 0$ in $D(Z) = 1$. Ker je $X \le b$ natanko tedaj, ko je $Z \le \frac{b - \mu}{\sigma}$, je $P(a \le X \le b) = \Phi\big(\frac{b - \mu}{\sigma}\big) - \Phi\big(\frac{a - \mu}{\sigma}\big)$ in zaradi simetrije zvona $\Phi(-z) = 1 - \Phi(z)$. Velja **pravilo 68–95–99,7**: na intervalu $\mu \pm \sigma$ leži približno $68\,\%$, na $\mu \pm 2\sigma$ približno $95\,\%$ in na $\mu \pm 3\sigma$ približno $99{,}7\,\%$ vrednosti.

Normalna porazdelitev je tako pomembna zaradi **centralnega limitnega izreka**. Naj bodo $X_1, \dots, X_n$ neodvisne in enako porazdeljene z $E(X_i) = \mu$ in končno varianco $D(X_i) = \sigma^2$, njihovo povprečje pa je $\bar X = \frac{1}{n}\sum X_i$. Potem za vsak $z$ velja $P\Big(\frac{\bar X - \mu}{\sigma/\sqrt n} \le z\Big) \to \Phi(z)$, ko gre $n \to \infty$. Vsota (in povprečje) mnogih neodvisnih slučajnih vplivov je torej približno normalno porazdeljena, ne glede na porazdelitev posameznih vplivov. Zato so meritve pogosto normalno razpršene okoli prave vrednosti.

**5. Vzorec in opisna statistika.** Iz populacije izberemo **vzorec** $x_1, x_2, \dots, x_n$. Populacijskih $\mu$ in $\sigma$ ne poznamo, ocenimo ju z vzorčnimi količinami:

$$\bar x = \frac{1}{n}\sum_{i=1}^n x_i, \qquad s^2 = \frac{1}{n - 1}\sum_{i=1}^n (x_i - \bar x)^2, \qquad s = \sqrt{s^2}.$$

$\bar x$ je **vzorčno povprečje**, $s$ **vzorčni standardni odklon**. Delimo z $n - 1$, ne z $n$, ker so odmiki merjeni od $\bar x$, ki je sam izračunan iz istih podatkov: vsota odmikov je vedno $0$, zato je neodvisnih odmikov le $n - 1$ (**prostostne stopnje**). Delitev z $n - 1$ da **nepristransko** oceno $\sigma^2$: povprečje $s^2$ čez vse možne vzorce je natanko $\sigma^2$.

Natančnost povprečja opisuje **standardna napaka povprečja** $s_{\bar x} = \frac{s}{\sqrt n}$: več meritev naredimo, bolj zanesljivo je povprečje. Utemeljitev: za neodvisne meritve $X_i$ z varianco $\sigma^2$ je $D(\bar X) = \frac{1}{n^2}\sum D(X_i) = \frac{\sigma^2}{n}$. Sredino podatkov lahko opišemo tudi z **mediano** (srednjo vrednostjo urejenih podatkov), ki je manj občutljiva za osamelce, razpršenost pa še z **razponom** $x_{\max} - x_{\min}$.

**6. Linearna regresija.** Merimo pare $(x_i, y_i)$, na primer koncentracijo in absorbanco. Če točke ležijo približno na premici, iščemo premico $y = kx + n$, za katero je vsota kvadratov navpičnih odstopanj najmanjša (**metoda najmanjših kvadratov**):

$$F(k, n) = \sum_{i=1}^n (y_i - kx_i - n)^2 \to \min.$$

V minimumu sta parcialna odvoda nič. Enačba $F_n = -2\sum (y_i - kx_i - n) = 0$ da $\bar y = k\bar x + n$, enačba $F_k = -2\sum x_i(y_i - kx_i - n) = 0$ pa po vstavljanju $n = \bar y - k\bar x$ še naklon:

$$k = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sum (x_i - \bar x)^2} = \frac{n\sum x_i y_i - \sum x_i \sum y_i}{n\sum x_i^2 - \left(\sum x_i\right)^2}, \qquad n = \bar y - k\bar x.$$

Premica gre vedno skozi **težišče** podatkov $(\bar x, \bar y)$. (Pozor: črka $n$ tu pomeni začetno vrednost premice, v vsotah pa število meritev. V tabelah pogosto pišejo $y = a + bx$.)

Kako dobro premica opisuje podatke, pove **Pearsonov korelacijski koeficient**

$$r = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sqrt{\sum (x_i - \bar x)^2 \sum (y_i - \bar y)^2}}, \qquad -1 \le r \le 1.$$

Neenakost $|r| \le 1$ je Cauchy-Schwarzeva neenakost $|\vec u \cdot \vec v| \le |\vec u|\,|\vec v|$ za vektorja odmikov $(x_i - \bar x)$ in $(y_i - \bar y)$. Pri $r = \pm 1$ ležijo vse točke na premici, pri $r \approx 0$ linearne povezave ni. Predznak $r$ je enak predznaku naklona. Kvadrat $r^2$ (**determinacijski koeficient**) pove, kolikšen delež razpršenosti $y$ pojasni premica. Korelacija ne pomeni vzročnosti: dve količini lahko naraščata skupaj, ker obe povzroča tretja.

:::premisli
Vse $y_i$ pomnožimo s $1000$ (npr. zamenjamo enoto). Kako se spremenita naklon $k$ in korelacijski koeficient $r$?
---
V formuli za $k$ se s $1000$ pomnoži le števec, zato je naklon $1000$-krat večji. Pri $r$ se s $1000$ pomnožita števec in imenovalec (prek $\sqrt{\sum (y_i - \bar y)^2}$), zato se $r$ ne spremeni: je brez enote in meri le, kako tesno točke ležijo ob premici.
:::

## Rešeni primeri

### Primer 1 (lažji)

Študent je petkrat stehtal isto tableto in dobil $4{,}8\,\mathrm{g}$; $5{,}1\,\mathrm{g}$; $5{,}0\,\mathrm{g}$; $4{,}9\,\mathrm{g}$ in $5{,}2\,\mathrm{g}$. Izračunaj povprečje, vzorčni standardni odklon in standardno napako povprečja.

**Podatki:** $n = 5$; $x_1 = 4{,}8\,\mathrm{g}$, $x_2 = 5{,}1\,\mathrm{g}$, $x_3 = 5{,}0\,\mathrm{g}$, $x_4 = 4{,}9\,\mathrm{g}$, $x_5 = 5{,}2\,\mathrm{g}$
**Iščemo:** povprečje $\bar x$, standardni odklon $s$ in standardno napako $s_{\bar x}$

:::formula
$\bar x = \frac{1}{n}\sum x_i$, $s = \sqrt{\frac{1}{n - 1}\sum (x_i - \bar x)^2}$, $s_{\bar x} = \frac{s}{\sqrt n}$
:::

**Rešitev:**

1. Vsota: $4{,}8 + 5{,}1 + 5{,}0 + 4{,}9 + 5{,}2 = 25{,}0\,\mathrm{g}$, povprečje $\bar x = \frac{25{,}0\,\mathrm{g}}{5} = 5{,}00\,\mathrm{g}$.
2. Odmiki od povprečja: $-0{,}2$; $0{,}1$; $0$; $-0{,}1$; $0{,}2$ (v gramih). Njihova vsota je $0$, kar je preizkus.
3. Kvadrati odmikov: $0{,}04 + 0{,}01 + 0 + 0{,}01 + 0{,}04 = 0{,}10\,\mathrm{g^2}$.
4. Varianca: $s^2 = \frac{0{,}10\,\mathrm{g^2}}{5 - 1} = 0{,}025\,\mathrm{g^2}$, standardni odklon $s = \sqrt{0{,}025}\,\mathrm{g} = 0{,}158\,\mathrm{g}$.
5. Standardna napaka: $s_{\bar x} = \frac{0{,}158\,\mathrm{g}}{\sqrt 5} = 0{,}071\,\mathrm{g}$.
6. Odgovor: povprečna masa je $5{,}00\,\mathrm{g}$, standardni odklon posamezne meritve $0{,}16\,\mathrm{g}$, standardna napaka povprečja $0{,}07\,\mathrm{g}$; rezultat zapišemo kot $(5{,}00 \pm 0{,}07)\,\mathrm{g}$.

### Primer 2

Verjetnost, da seme vzklije, je $0{,}8$, semena kalijo neodvisno. Posadimo $10$ semen. Kolikšna je verjetnost, da jih vzklije natanko $8$, in kolikšna, da jih vzklije vsaj $9$? Koliko semen v povprečju vzklije in kolikšen je standardni odklon?

**Podatki:** $n = 10$ semen, verjetnost kalitve $p = 0{,}8$, neodvisnost
**Iščemo:** $P(X = 8)$, $P(X \ge 9)$, pričakovano vrednost $E(X)$ in standardni odklon $\sigma$

:::formula
$X \sim B(n, p)$: $P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k}$, $E(X) = np$, $\sigma = \sqrt{np(1 - p)}$
:::

**Rešitev:**

1. Število vzklilih semen je binomsko porazdeljeno, $X \sim B(10;\ 0{,}8)$.
2. $P(X = 8) = \binom{10}{8} \cdot 0{,}8^8 \cdot 0{,}2^2 = 45 \cdot 0{,}16777 \cdot 0{,}04 = 0{,}302$.
3. $P(X = 9) = \binom{10}{9} \cdot 0{,}8^9 \cdot 0{,}2 = 10 \cdot 0{,}13422 \cdot 0{,}2 = 0{,}268$.
4. $P(X = 10) = 0{,}8^{10} = 0{,}107$.
5. $P(X \ge 9) = 0{,}2684 + 0{,}1074 = 0{,}3758 \approx 0{,}376$.
6. $E(X) = 10 \cdot 0{,}8 = 8$ semen, $\sigma = \sqrt{10 \cdot 0{,}8 \cdot 0{,}2} = \sqrt{1{,}6} = 1{,}26$ semena.
7. Odgovor: natanko $8$ semen vzklije z verjetnostjo $0{,}302$, vsaj $9$ z verjetnostjo $0{,}376$; v povprečju vzklije $8$ semen s standardnim odklonom $1{,}26$.

### Primer 3 (težji)

Za umeritveno premico smo izmerili absorbanco $A$ raztopin z masnimi koncentracijami $\gamma = 0$, $1$, $2$, $3$ in $4\,\mathrm{mg/L}$ in dobili $A = 0{,}02$; $0{,}21$; $0{,}39$; $0{,}62$; $0{,}80$. Določi regresijsko premico $A = k\gamma + n$, korelacijski koeficient in delež razpršenosti absorbanc, ki ga pojasni premica. Neznani vzorec smo pred meritvijo razredčili: $2{,}00\,\mathrm{mL}$ vzorca smo dopolnili do $10{,}0\,\mathrm{mL}$, razredčena raztopina pa je imela absorbanco $0{,}50$. Kolikšna je masna koncentracija v prvotnem vzorcu in zakaj je bila razredčitev potrebna?

**Podatki:** $\gamma_i = 0;\ 1;\ 2;\ 3;\ 4\,\mathrm{mg/L}$, $A_i = 0{,}02;\ 0{,}21;\ 0{,}39;\ 0{,}62;\ 0{,}80$, $A_\mathrm{vz} = 0{,}50$, število meritev $5$, $V_1 = 2{,}00\,\mathrm{mL}$, $V_2 = 10{,}0\,\mathrm{mL}$
**Iščemo:** naklon $k$, začetno vrednost $n$, korelacijski koeficient $r$, $r^2$, koncentracijo razredčene raztopine $\gamma_\mathrm{vz}$ in prvotnega vzorca $\gamma_0$

:::formula
$k = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sum (x_i - \bar x)^2}$, $n = \bar y - k\bar x$, $r = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sqrt{\sum (x_i - \bar x)^2 \sum (y_i - \bar y)^2}}$, $\gamma_0 = \gamma_\mathrm{vz} \cdot \frac{V_2}{V_1}$
:::

**Rešitev:**

1. Povprečji: $\bar\gamma = \frac{0 + 1 + 2 + 3 + 4}{5} = 2\,\mathrm{mg/L}$, $\bar A = \frac{2{,}04}{5} = 0{,}408$.
2. Odmiki $\gamma_i - \bar\gamma$: $-2, -1, 0, 1, 2$; vsota kvadratov $S_{xx} = 4 + 1 + 0 + 1 + 4 = 10$.
3. Odmiki $A_i - \bar A$: $-0{,}388$; $-0{,}198$; $-0{,}018$; $0{,}212$; $0{,}392$.
4. Mešana vsota: $S_{xy} = (-2)(-0{,}388) + (-1)(-0{,}198) + 0 + 1 \cdot 0{,}212 + 2 \cdot 0{,}392 = 0{,}776 + 0{,}198 + 0{,}212 + 0{,}784 = 1{,}970$.
5. Naklon: $k = \frac{1{,}970}{10} = 0{,}197\,\mathrm{L/mg}$; začetna vrednost: $n = 0{,}408 - 0{,}197 \cdot 2 = 0{,}014$.
6. Vsota kvadratov odmikov $A$: $S_{yy} = 0{,}150544 + 0{,}039204 + 0{,}000324 + 0{,}044944 + 0{,}153664 = 0{,}38868$.
7. Korelacijski koeficient: $r = \frac{1{,}970}{\sqrt{10 \cdot 0{,}38868}} = \frac{1{,}970}{1{,}9715} = 0{,}9992$.
8. Neznani vzorec: $\gamma_\mathrm{vz} = \frac{A_\mathrm{vz} - n}{k} = \frac{0{,}50 - 0{,}014}{0{,}197\,\mathrm{L/mg}} = 2{,}47\,\mathrm{mg/L}$.
9. Determinacijski koeficient: $r^2 = \frac{S_{xy}^2}{S_{xx}S_{yy}} = \frac{1{,}970^2}{10 \cdot 0{,}38868} = 0{,}9985$, premica pojasni $99{,}85\,\%$ razpršenosti absorbanc.
10. Razredčitev: masa snovi se ne spremeni, $\gamma_0 V_1 = \gamma_\mathrm{vz} V_2$, faktor je $\frac{10{,}0\,\mathrm{mL}}{2{,}00\,\mathrm{mL}} = 5$, zato $\gamma_0 = 5 \cdot 2{,}467\,\mathrm{mg/L} = 12{,}3\,\mathrm{mg/L}$.
11. Zakaj razredčitev: nerazredčen vzorec bi imel absorbanco približno $0{,}197 \cdot 12{,}3 + 0{,}014 = 2{,}44$, kar je daleč nad največjo umeritveno vrednostjo $0{,}80$; tam premica ne velja več (in tudi fotometer meri nenatančno).
12. Odgovor: premica je $A = 0{,}197\,\mathrm{L/mg} \cdot \gamma + 0{,}014$, $r = 0{,}9992$ in $r^2 = 0{,}9985$ (zelo dobra linearnost), razredčena raztopina ima $2{,}47\,\mathrm{mg/L}$, prvotni vzorec pa $12{,}3\,\mathrm{mg/L}$.

## Pogoste napake

- **Deljenje z $n$ namesto z $n - 1$.** Pri vzorčnem standardnem odklonu delimo z $n - 1$. V Primeru 1 bi deljenje s $5$ dalo $0{,}141\,\mathrm{g}$ namesto $0{,}158\,\mathrm{g}$. Na kalkulatorju sta to tipki $\sigma_{n-1}$ (ali $s_x$) in $\sigma_n$.
- **Zamenjava standardnega odklona in standardne napake.** $s$ opisuje razpršenost posameznih meritev, $s/\sqrt n$ pa negotovost povprečja.
- **Binomska porazdelitev brez binomskega koeficienta.** $P(X = 8) \neq 0{,}8^8 \cdot 0{,}2^2$, ker je osem uspehov med desetimi poskusi mogoče razporediti na $\binom{10}{8} = 45$ načinov.
- **»Vsaj« izračunan kot »natanko«.** $P(X \ge 9) = P(X = 9) + P(X = 10)$. Pri »vsaj en« je hitreje $1 - P(X = 0)$.
- **Verjetnost točke pri zvezni spremenljivki.** Za zvezno $X$ je $P(X = a) = 0$; smiselna je le verjetnost intervala.
- **Napovedovanje zunaj območja meritev.** Umeritvena premica velja le med najmanjšo in največjo umeritveno koncentracijo; pri večjih koncentracijah odvisnost pogosto ni več linearna.
- **Velik $r$ pomeni vzročnost.** Število štorkelj in število rojstev v regijah sta lahko korelirani, ker oboje raste z velikostjo regije.

## Povzetek

- Verjetnost: $0 \le P(A) \le 1$, $P(\bar A) = 1 - P(A)$, neodvisnost $P(A \cap B) = P(A)P(B)$.
- Pričakovana vrednost $\mu = E(X)$, varianca $\sigma^2 = E(X^2) - \mu^2$, standardni odklon $\sigma$.
- Binomska $B(n, p)$: $E = np$, $\sigma^2 = np(1 - p)$. Poissonova: $E = \sigma^2 = \lambda$. Normalna $N(\mu, \sigma)$: standardizacija $Z = \frac{X - \mu}{\sigma}$, pravilo $68$–$95$–$99{,}7$.
- Vzorec: $\bar x = \frac{1}{n}\sum x_i$, $s = \sqrt{\frac{1}{n - 1}\sum (x_i - \bar x)^2}$, standardna napaka $\frac{s}{\sqrt n}$.
- Linearna regresija: $k = \frac{S_{xy}}{S_{xx}}$, $n = \bar y - k\bar x$; premica gre skozi $(\bar x, \bar y)$; kakovost opisuje $r$ oziroma $r^2$.

## Za izpit

Znati moraš povedati:

- definicijo verjetnosti, pogojne verjetnosti in neodvisnosti ter izpeljavo $P(\bar A) = 1 - P(A)$ in $P(A \cup B) = P(A) + P(B) - P(A \cap B)$;
- definiciji pričakovane vrednosti in variance (diskretno in zvezno) ter izpeljavo $D(X) = E(X^2) - \mu^2$, $E(aX + b)$ in $D(aX + b)$;
- binomsko, Poissonovo in normalno porazdelitev s pogoji uporabe, izpeljavo $E(X) = np$ in $D(X) = np(1 - p)$ ter standardizacijo;
- centralni limitni izrek z vsemi pogoji, $D(\bar X) = \frac{\sigma^2}{n}$ in zakaj pri $s^2$ delimo z $n - 1$;
- metodo najmanjših kvadratov z izpeljavo $n = \bar y - k\bar x$ in $k = \frac{S_{xy}}{S_{xx}}$ ter pomen $r$ in $r^2$.

### Naloga 1

Stroj polni zavitke, masa polnila je normalno porazdeljena s standardnim odklonom $\sigma = 4\,\mathrm{g}$, sredino $\mu$ pa lahko nastavimo. Na zavitku piše $500\,\mathrm{g}$. (a) Na katero vrednost $\mu$ moramo nastaviti stroj, da bo lažjih od $500\,\mathrm{g}$ le $1\,\%$ zavitkov? (b) Kontrolor pri tej nastavitvi naključno vzame $20$ zavitkov. Kolikšna je verjetnost, da je med njimi vsaj en prelahek? (c) Kolikšna je verjetnost, da je povprečna masa $4$ naključnih zavitkov manjša od $505\,\mathrm{g}$? Uporabi $\Phi(2{,}33) = 0{,}9901$ in $\Phi(2{,}16) = 0{,}9846$.

**Rešitev:**

1. (a) Zahtevamo $P(X < 500) = \Phi\big(\frac{500 - \mu}{4}\big) = 0{,}01$. Ker je $\Phi(-2{,}33) = 1 - 0{,}9901 = 0{,}0099 \approx 0{,}01$, mora biti $\frac{500 - \mu}{4} = -2{,}33$.
2. Od tod $\mu = 500 + 2{,}33 \cdot 4 = 509{,}3\,\mathrm{g}$.
3. (b) Zavitki so neodvisni, vsak je prelahek z verjetnostjo $p = 0{,}01$, zato je število prelahkih $Y \sim B(20;\ 0{,}01)$.
4. Prek nasprotnega dogodka: $P(Y \ge 1) = 1 - P(Y = 0) = 1 - 0{,}99^{20} = 1 - 0{,}818 = 0{,}182$. (Poissonov približek z $\lambda = 0{,}2$ da $1 - e^{-0{,}2} = 0{,}181$.)
5. (c) Vsota (in zato povprečje) neodvisnih normalnih spremenljivk je spet normalna; povprečje $4$ mas ima $E(\bar X) = 509{,}32\,\mathrm{g}$ in $\sigma_{\bar X} = \frac{4\,\mathrm{g}}{\sqrt 4} = 2\,\mathrm{g}$.
6. Standardizacija: $z = \frac{505 - 509{,}32}{2} = -2{,}16$, torej $P(\bar X < 505) = \Phi(-2{,}16) = 1 - 0{,}9846 = 0{,}0154$.
7. Odgovor: (a) $\mu = 509{,}3\,\mathrm{g}$; (b) vsaj en prelahek zavitek med $20$ z verjetnostjo $0{,}182$; (c) povprečje štirih je pod $505\,\mathrm{g}$ z verjetnostjo $0{,}015$, čeprav je posamezen zavitek pod $505\,\mathrm{g}$ precej pogosteje.

### Naloga 2

Natančno navedi definicijo pričakovane vrednosti in variance diskretne slučajne spremenljivke. Izpelji, da za $X \sim B(n, p)$ velja $E(X) = np$ in $D(X) = np(1 - p)$.

**Rešitev:**

1. Če $X$ zavzame vrednosti $x_i$ z verjetnostmi $p_i$, je $E(X) = \sum_i x_i p_i$ (če vrsta absolutno konvergira) in $D(X) = E\big((X - \mu)^2\big)$ z $\mu = E(X)$.
2. Zapišemo $X = X_1 + X_2 + \dots + X_n$, kjer je $X_i = 1$, če je $i$-ti poskus uspel, in $X_i = 0$ sicer; $X_i$ so neodvisne.
3. $E(X_i) = 1 \cdot p + 0 \cdot (1 - p) = p$ in, ker je $X_i^2 = X_i$, tudi $E(X_i^2) = p$, zato $D(X_i) = E(X_i^2) - E(X_i)^2 = p - p^2 = p(1 - p)$.
4. Zaradi linearnosti pričakovane vrednosti je $E(X) = \sum E(X_i) = np$.
5. Ker so $X_i$ neodvisne, se variance seštevajo: $D(X) = \sum D(X_i) = np(1 - p)$.
6. Preizkus s Primerom 2: $B(10;\ 0{,}8)$ ima $E(X) = 8$ in $D(X) = 1{,}6$, kar se ujema.

### Naloga 3

Utemelji, ali velja: (a) dva nezdružljiva dogodka s pozitivnima verjetnostma sta neodvisna; (b) če sta dogodka $A$ in $B$ neodvisna, sta neodvisna tudi $A$ in $\bar B$.

**Rešitev:**

1. (a) Ne velja. Za nezdružljiva dogodka je $P(A \cap B) = P(\emptyset) = 0$, za neodvisnost pa bi moralo biti $P(A)P(B) = 0$, kar pri pozitivnih verjetnostih ni res.
2. Primer: met kocke, $A$ = »pade $6$«, $B$ = »pade $1$«: $P(A \cap B) = 0 \neq \frac{1}{6} \cdot \frac{1}{6} = \frac{1}{36}$. Nezdružljiva dogodka sta celo močno odvisna: če se zgodi $B$, se $A$ zagotovo ne.
3. (b) Velja. Dogodek $A$ je unija nezdružljivih $A \cap B$ in $A \cap \bar B$, zato $P(A \cap \bar B) = P(A) - P(A \cap B)$.
4. Zaradi neodvisnosti $A$ in $B$: $P(A \cap \bar B) = P(A) - P(A)P(B) = P(A)\big(1 - P(B)\big) = P(A)P(\bar B)$.
5. Odgovor: (a) ne velja, (b) velja.

## Drugače: Na sliki

**Histogram.** Če velikokrat izmerimo isto količino in meritve razvrstimo v razrede, dobimo histogram. Pri mnogo meritvah se njegovi stolpci približajo zvonasti krivulji normalne porazdelitve. Vrh zvona je pri $\mu$, prevojni točki krivulje pa sta natanko pri $\mu - \sigma$ in $\mu + \sigma$. Večji $\sigma$ pomeni nižji in širši zvon; ploščina pod krivuljo je vedno $1$.

**Binomska porazdelitev** $B(10;\ 0{,}8)$ je narisana s stolpci pri $k = 0, 1, \dots, 10$. Najvišji stolpec je pri $k = 8$ ($0{,}302$), sosednja pri $k = 7$ ($0{,}201$) in $k = 9$ ($0{,}268$). Porazdelitev je nagnjena v levo, ker $p$ ni $\frac{1}{2}$.

**Razsevni diagram.** Pri regresiji narišemo točke $(x_i, y_i)$ in premico skozi njih. Navpične daljice od točk do premice so **ostanki**; metoda najmanjših kvadratov poišče premico, pri kateri je vsota kvadratov dolžin teh daljic najmanjša. Če ostanki kažejo vzorec (na primer najprej pozitivni, nato negativni, nato spet pozitivni), odvisnost ni linearna, četudi je $r$ blizu $1$.

## Drugače: Uporaba v stroki

**Kontrola kakovosti.** Pri proizvodnji tablet z nazivno maso je masa približno normalno porazdeljena; zunaj pasu $\mu \pm 3\sigma$ je le okoli $0{,}3\,\%$ tablet. Na **kontrolni karti** rišemo povprečja vzorcev po $n$ tablet z mejama $\mu \pm 3\frac{\sigma}{\sqrt n}$: pri $\sigma = 10\,\mathrm{mg}$ in $n = 4$ je to $\mu \pm 15\,\mathrm{mg}$. Točka zunaj mej sproži pregled stroja.

**Štetje razpadov.** Števec v eni sekundi v povprečju zazna $3$ razpade. Število razpadov je Poissonovo porazdeljeno z $\lambda = 3$, zato je verjetnost, da v neki sekundi ne zazna nobenega, $e^{-3} = 0{,}050$, za natanko en razpad pa $3e^{-3} = 0{,}149$. Ker je $\sigma = \sqrt\lambda$, ima meritev z $N$ preštetimi sunki relativno negotovost približno $\frac{1}{\sqrt N}$: za $1\,\%$ natančnost moramo prešteti $10\,000$ sunkov.

**Meja zaznavnosti.** V instrumentalni analizi mejo zaznavnosti ocenimo kot koncentracijo, ki ustreza trikratnemu standardnemu odklonu signala slepega vzorca: $\gamma_\mathrm{LOD} = \frac{3s_\mathrm{slepi}}{k}$. Z naklonom iz Primera 3 in $s_\mathrm{slepi} = 0{,}004$ je $\gamma_\mathrm{LOD} = \frac{3 \cdot 0{,}004}{0{,}197\,\mathrm{L/mg}} \approx 0{,}061\,\mathrm{mg/L}$.

**Genetika.** Pri križanju $Aa \times Aa$ je verjetnost recesivnega fenotipa $\frac{1}{4}$, število recesivnih potomcev med $20$ je $B(20;\ 0{,}25)$ z $E = 5$. Če jih dobimo $12$ ali več, je verjetnost tega po modelu le okoli $0{,}0009$, zato je Mendlov model za ta gen vprašljiv (morda starša nista oba heterozigota ali je napaka pri določanju fenotipa).

## Drugače: Korak za korakom s številkami

Masa tablet je normalno porazdeljena s $\mu = 500\,\mathrm{mg}$ in $\sigma = 10\,\mathrm{mg}$. Kolikšen delež tablet ima maso nad $520\,\mathrm{mg}$ in kolikšen med $480\,\mathrm{mg}$ in $520\,\mathrm{mg}$?

1. **Standardizacija:** $z = \frac{520 - 500}{10} = 2$ in $z = \frac{480 - 500}{10} = -2$.
2. **Tabela:** $\Phi(2) = 0{,}9772$.
3. **Nad $520\,\mathrm{mg}$:** $P(X > 520) = 1 - \Phi(2) = 1 - 0{,}9772 = 0{,}0228$, to je $2{,}3\,\%$.
4. **Simetrija:** $\Phi(-2) = 1 - \Phi(2) = 0{,}0228$.
5. **Med mejama:** $P(480 < X < 520) = \Phi(2) - \Phi(-2) = 0{,}9772 - 0{,}0228 = 0{,}9544$, to je $95{,}4\,\%$.
6. **Preizkus s pravilom:** na intervalu $\mu \pm 2\sigma$ je približno $95\,\%$ vrednosti, kar se ujema.

## Drugače: Bolj natančno

**Aksiomi verjetnosti (Kolmogorov).** Verjetnostni prostor je trojica $(\Omega, \mathcal F, P)$, kjer je $\mathcal F$ družina dogodkov ($\sigma$-algebra), $P\colon \mathcal F \to [0, 1]$ pa zadošča $P(\Omega) = 1$ in $P\left(\bigcup_i A_i\right) = \sum_i P(A_i)$ za vsako zaporedje paroma nezdružljivih dogodkov. Slučajna spremenljivka je merljiva funkcija $X\colon \Omega \to \mathbb R$, njena porazdelitvena funkcija pa $F(x) = P(X \le x)$.

**Zakaj $n - 1$.** Naj bodo $X_1, \dots, X_n$ neodvisne z $E(X_i) = \mu$ in $D(X_i) = \sigma^2$. Tedaj je $E(\bar X) = \mu$ in $D(\bar X) = \frac{\sigma^2}{n}$, od koder sledi standardna napaka $\frac{\sigma}{\sqrt n}$. Iz razčlenitve $\sum (X_i - \mu)^2 = \sum (X_i - \bar X)^2 + n(\bar X - \mu)^2$ dobimo
$$E\left(\sum (X_i - \bar X)^2\right) = n\sigma^2 - n \cdot \frac{\sigma^2}{n} = (n - 1)\sigma^2,$$
zato je $E(S^2) = \sigma^2$ natanko pri deljenju z $n - 1$.

**Izpeljava regresije.** Normalni enačbi $F_n = -2\sum (y_i - kx_i - n) = 0$ in $F_k = -2\sum x_i(y_i - kx_i - n) = 0$ dasta $n = \bar y - k\bar x$ (premica gre skozi težišče) in po vstavljanju $k = \frac{S_{xy}}{S_{xx}}$. Hessejeva matrika funkcije $F$ je $2\begin{bmatrix} \sum x_i^2 & \sum x_i \\ \sum x_i & n \end{bmatrix}$ z determinanto $4nS_{xx} > 0$, če niso vsi $x_i$ enaki, zato je najdena točka minimum. Pri tem velja $r^2 = 1 - \frac{\sum (y_i - \hat y_i)^2}{S_{yy}}$, kjer je $\hat y_i = kx_i + n$; v Primeru 3 je $r^2 = 0{,}9985$.

**Binomska in Poissonova.** Če gre $n \to \infty$ in $p \to 0$ tako, da je $np = \lambda$ konstanten, gre $\binom{n}{k} p^k (1 - p)^{n - k} \to \frac{\lambda^k e^{-\lambda}}{k!}$. Zato Poissonova porazdelitev opisuje redke dogodke med zelo mnogimi priložnostmi. Pri velikem $np(1 - p)$ (praktično nad $9$) pa binomsko porazdelitev dobro aproksimira normalna z $\mu = np$ in $\sigma = \sqrt{np(1 - p)}$ (Moivre-Laplaceov izrek, poseben primer centralnega limitnega izreka).

**Intervali zaupanja.** Za normalno populacijo z neznanim $\sigma$ je $\frac{\bar X - \mu}{S/\sqrt n}$ porazdeljena po Studentovi porazdelitvi $t$ z $n - 1$ prostostnimi stopnjami. Interval zaupanja za $\mu$ je $\bar x \pm t_{n-1}\, \frac{s}{\sqrt n}$, kjer je $t_{n-1}$ tabelirana vrednost (pri $95\,\%$ in $n = 5$ je $t_4 = 2{,}78$).

## Preveri se

? Vzorec meritev je $2$, $4$, $4$, $6$. Kolikšen je vzorčni standardni odklon (z deljenjem z $n - 1$)?
- $1{,}41$
+ $1{,}63$
- $2{,}67$
- $4{,}00$
> $\bar x = 4$, odmiki $-2, 0, 0, 2$, vsota kvadratov $8$, $s^2 = \frac{8}{3} = 2{,}67$, $s = 1{,}63$. Vrednost $1{,}41$ dobimo z deljenjem s $4$; $2{,}67$ je varianca, ne standardni odklon.

? Kolikšen delež vrednosti normalno porazdeljene spremenljivke leži približno na intervalu $\mu \pm 2\sigma$?
- $68\,\%$
+ $95\,\%$
- $99{,}7\,\%$
- $50\,\%$
> Pravilo $68$–$95$–$99{,}7$: na $\mu \pm \sigma$ je $68\,\%$, na $\mu \pm 2\sigma$ $95\,\%$, na $\mu \pm 3\sigma$ $99{,}7\,\%$ vrednosti.

? Slučajna spremenljivka je porazdeljena binomsko z $n = 20$ in $p = 0{,}25$. Kolikšna je njena pričakovana vrednost?
- $4$
+ $5$
- $3{,}75$
- $15$
> $E(X) = np = 20 \cdot 0{,}25 = 5$. Število $3{,}75 = np(1 - p)$ je varianca.

? Pri regresiji smo dobili korelacijski koeficient $r = -0{,}95$. Kaj to pomeni?
- odvisnosti med količinama skoraj ni
+ med količinama je močna linearna povezava, ko $x$ narašča, $y$ pada
- sprememba $x$ dokazano povzroča spremembo $y$
- premica pojasni $5\,\%$ razpršenosti $y$
> $|r|$ blizu $1$ pomeni močno linearno povezavo, negativni predznak pomeni negativen naklon. Premica pojasni $r^2 = 0{,}9025$, torej okoli $90\,\%$ razpršenosti; vzročnosti korelacija ne dokazuje.

:::simboli
E | pričakovana vrednost | E(X) = \sum_i x_i\, p_i | |
X | slučajna spremenljivka | | | vsakemu izidu priredi število
i | indeks vrednosti oziroma meritve | | |
x_i | i-ta vrednost (podatek) | | | v regresiji neodvisna spremenljivka, npr. koncentracija
p_i | verjetnost vrednosti xᵢ | p_i = P(X = x_i) | | Σ pᵢ = 1
x | vrednost zvezne slučajne spremenljivke | | |
f | gostota verjetnosti | | | f(x) ≥ 0 in ∫ f(x) dx = 1
d | oznaka diferenciala (dx) | | |
D | varianca | D(X) = E\big((X - \mu)^2\big) = E(X^2) - \mu^2 | |
\sigma | standardni odklon | \sigma = \sqrt{D(X)} | |
\mu | pričakovana vrednost porazdelitve | \mu = E(X) | |
P | verjetnost | | | število med 0 in 1
k | število uspehov (vrednost X) | | | v regresiji y = kx + n smerni koeficient
n | število ponovitev poskusa oziroma meritev | | | v regresiji y = kx + n začetna vrednost
p | verjetnost uspeha v enem poskusu | | |
\lambda | parameter Poissonove porazdelitve | | | E(X) = σ² = λ
e | Eulerjevo število | | | e ≈ 2,718
\bar x | vzorčno povprečje | \bar x = \frac{1}{n}\sum x_i | |
s | vzorčni standardni odklon | s = \sqrt{\frac{1}{n - 1}\sum (x_i - \bar x)^2} | |
F | vsota kvadratov navpičnih odstopanj od premice | F(k, n) = \sum_{i=1}^n (y_i - kx_i - n)^2 | | drugje porazdelitvena funkcija F(x) = P(X ≤ x)
y_i | izmerjena vrednost pri xᵢ (npr. absorbanca) | | |
\bar y | povprečje vrednosti yᵢ | \bar y = \frac{1}{n}\sum y_i | |
r | korelacijski koeficient | r = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sqrt{\sum (x_i - \bar x)^2 \sum (y_i - \bar y)^2}} | | -1 ≤ r ≤ 1
X_i | neodvisne slučajne spremenljivke (posamezne meritve) | | | E(Xᵢ) = μ, D(Xᵢ) = σ²
\bar X | povprečje slučajnih spremenljivk Xᵢ | \bar X = \frac{1}{n}\sum X_i | | njegova pričakovana vrednost je μ
s_{\bar x} | standardna napaka povprečja | s_{\bar x} = \frac{s}{\sqrt n} | |
B | binomska porazdelitev B(n, p) | | | v P(A ∪ B) oznaka dogodka
A | dogodek | | | v Primeru 3 absorbanca
\gamma_\mathrm{vz} | masna koncentracija razredčenega vzorca | \gamma_\mathrm{vz} = \frac{A_\mathrm{vz} - n}{k} | mg/L |
\gamma_0 | masna koncentracija prvotnega vzorca | \gamma_0 = \gamma_\mathrm{vz} \cdot \frac{V_2}{V_1} | mg/L |
V_1 | prostornina odpipetiranega vzorca | | mL |
V_2 | prostornina po razredčitvi | | mL |
Z | standardizirana slučajna spremenljivka | Z = \frac{X - \mu}{\sigma} | | porazdeljena N(0, 1)
\Phi | porazdelitvena funkcija N(0, 1) | \Phi(z) = P(Z \le z) | |
:::
