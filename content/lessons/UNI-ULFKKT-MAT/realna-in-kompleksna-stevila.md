---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vsa matematična analiza, ki jo boš spoznal v prvem letniku, stoji na **realnih številih**. Pojmi, kot so limita, zveznost, odvod in integral, delujejo zato, ker realna števila nimajo »lukenj«: vsako zaporedje, ki se zgošča, ima limito med realnimi števili. Zato je prav, da natančneje pogledamo, kaj realna števila so in katere lastnosti uporabljamo.

Realna števila pa niso dovolj za reševanje vseh enačb. Enačba $x^2 + 1 = 0$ nima realne rešitve. Ko dodamo število $i$ z lastnostjo $i^2 = -1$, dobimo **kompleksna števila**, v katerih ima vsaka polinomska enačba rešitev. Kompleksna števila niso le matematična zanimivost: z njimi elegantno opišemo nihanje, valovanje, izmenični tok, rešitve diferencialnih enačb in kvantno mehaniko. Inženirji z njimi računajo impedanco, kemiki jih srečajo pri valovnih funkcijah in spektroskopiji.

Pot gre od realnih h kompleksnim številom; na koncu boš poznal:

- lastnosti realnih števil, ki jih potrebujemo v analizi,
- **računanje s kompleksnimi števili** v algebrski obliki,
- **polarno obliko** kompleksnega števila in **Eulerjevo formulo**,
- računanje potenc in **$n$-tih korenov** kompleksnih števil.

## Razlaga

**1. Številske množice.** Naravna števila $\mathbb{N} = \{1, 2, 3, \dots\}$ razširimo z ničlo in negativnimi števili v cela števila $\mathbb{Z}$, nato z ulomki v racionalna števila $\mathbb{Q} = \{\frac{p}{q} : p \in \mathbb{Z},\ q \in \mathbb{N}\}$. Racionalna števila imajo končen ali periodičen decimalni zapis. Števila, kot so $\sqrt{2}$, $\pi$ in $e$, niso racionalna (so **iracionalna**); skupaj z racionalnimi tvorijo **realna števila** $\mathbb{R}$. Velja $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}$.

**Trditev.** $\sqrt{2}$ ni racionalno število. *Dokaz (s protislovjem).* Recimo, da je $\sqrt{2} = \frac{p}{q}$ z okrajšanim ulomkom ($p, q \in \mathbb{N}$ tuji). Tedaj je $p^2 = 2q^2$, zato je $p^2$ sod in s tem tudi $p$ (kvadrat lihega števila je lih). Pišemo $p = 2m$ in dobimo $4m^2 = 2q^2$, torej $q^2 = 2m^2$ in je sod tudi $q$. Števili $p$ in $q$ sta obe sodi, kar nasprotuje okrajšanosti ulomka. $\square$

**2. Lastnosti realnih števil.** Realna števila so **urejen obseg**: seštevamo, množimo, odštevamo in delimo (razen z $0$) po znanih pravilih, poleg tega pa za vsaki dve števili velja $a < b$, $a = b$ ali $a > b$, urejenost pa je usklajena z računskimi operacijami. Ključna dodatna lastnost je **polnost**.

**Definicija.** Naj bo $A \subseteq \mathbb{R}$ neprazna. Število $M$ je **zgornja meja** množice $A$, če je $a \le M$ za vsak $a \in A$; množica je **navzgor omejena**, če ima kakšno zgornjo mejo. Število $s$ je **natančna zgornja meja** ali **supremum**, $s = \sup A$, če je
(i) $s$ zgornja meja množice $A$ in
(ii) za vsak $\varepsilon > 0$ obstaja $a \in A$ z $a > s - \varepsilon$ (nobeno manjše število ni zgornja meja).
Če $\sup A$ pripada $A$, je to **maksimum**. Analogno definiramo **infimum** (natančno spodnjo mejo) in minimum. Primer: $\sup\,(0, 1) = 1$, maksimuma pa interval $(0, 1)$ nima.

**Aksiom o supremumu (polnost).** Vsaka neprazna navzgor omejena množica realnih števil ima supremum v $\mathbb{R}$. Racionalna števila te lastnosti nimajo: množica $\{x \in \mathbb{Q} : x^2 < 2\}$ je navzgor omejena (z $2$), njen supremum v $\mathbb{R}$ pa je iracionalni $\sqrt{2}$. Vsaka racionalna zgornja meja $q$ je zato večja od $\sqrt{2}$, med $\sqrt{2}$ in $q$ pa leži manjše racionalno število, ki je tudi zgornja meja; najmanjše racionalne zgornje meje torej ni.

**Absolutna vrednost** je $|x| = x$ za $x \ge 0$ in $|x| = -x$ za $x < 0$; $|x|$ je razdalja števila $x$ od $0$, $|a - b|$ pa razdalja med $a$ in $b$. Velja **trikotniška neenakost** $|a + b| \le |a| + |b|$. *Dokaz:* seštejemo $-|a| \le a \le |a|$ in $-|b| \le b \le |b|$ v $-(|a| + |b|) \le a + b \le |a| + |b|$, kar je natanko $|a + b| \le |a| + |b|$. Neenačbo $|x - a| < r$ rešijo natanko števila na intervalu $(a - r, a + r)$, to je **okolica** točke $a$.

**3. Kompleksna števila.** **Imaginarna enota** $i$ je število z lastnostjo $i^2 = -1$. **Kompleksno število** v **algebrski obliki** je

$$z = a + bi, \qquad a, b \in \mathbb{R}.$$

Število $a = \operatorname{Re} z$ je **realni del**, $b = \operatorname{Im} z$ pa **imaginarni del** (realno število, brez $i$). Dve kompleksni števili sta enaki, če imata enaka realna in enaka imaginarna dela. Množico vseh kompleksnih števil označimo s $\mathbb{C}$. V elektrotehniki imaginarno enoto pogosto označijo z $j$, ker je $i$ rezervirana za tok.

**Računske operacije.** Računamo kot z dvočleniki in upoštevamo $i^2 = -1$:

- $(a + bi) \pm (c + di) = (a \pm c) + (b \pm d)i$,
- $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$.

Potence enote se ponavljajo s periodo $4$: $i^1 = i$, $i^2 = -1$, $i^3 = -i$, $i^4 = 1$.

**Konjugirano število** k $z = a + bi$ je $\bar z = a - bi$. Velja $z \bar z = a^2 + b^2$, kar je realno in nenegativno. **Absolutna vrednost** (modul) je $|z| = \sqrt{a^2 + b^2} = \sqrt{z \bar z}$. Za vse $z, w \in \mathbb{C}$ velja

$$\overline{z \pm w} = \bar z \pm \bar w, \qquad \overline{zw} = \bar z\,\bar w, \qquad |zw| = |z|\,|w|, \qquad \operatorname{Re} z = \frac{z + \bar z}{2}, \qquad \operatorname{Im} z = \frac{z - \bar z}{2i}.$$

Pravilo $\overline{zw} = \bar z\,\bar w$ preverimo z razpisom: za $z = a + bi$, $w = c + di$ sta obe strani enaki $(ac - bd) - (ad + bc)i$. Od tod $|zw|^2 = zw\,\overline{zw} = z\bar z\,w\bar w = |z|^2|w|^2$. Pri **deljenju** ulomek razširimo s konjugiranim imenovalcem:

$$\frac{a + bi}{c + di} = \frac{(a + bi)(c - di)}{c^2 + d^2}.$$

**Kompleksna ravnina.** Število $z = a + bi$ predstavimo s točko $(a, b)$ v **kompleksni (Gaussovi) ravnini**: vodoravna os je realna, navpična imaginarna. Seštevanje ustreza seštevanju vektorjev, konjugiranje zrcaljenju čez realno os, $|z|$ pa razdalji od izhodišča.

**Množice v kompleksni ravnini.** Ker je $|z - w|$ razdalja med točkama $z$ in $w$, lahko z enačbami in neenačbami opišemo like. Enačba $|z - i| = 2$ opisuje krožnico s središčem v točki $i$ in polmerom $2$, neenačba $|z - i| < 2$ pa notranjost tega kroga. Enačba $|z - 1| = |z + 1|$ opisuje točke, ki so enako oddaljene od $1$ in $-1$, torej imaginarno os. Pogoj $\operatorname{Re} z > 0$ pomeni desno polravnino. Takšen geometrijski pogled pogosto prihrani dolgo računanje.

**4. Polarni zapis.** Točko $(a, b)$ lahko podamo tudi z razdaljo $r = |z|$ od izhodišča in kotom $\varphi$, ki ga daljica od izhodišča do $z$ oklepa s pozitivno realno osjo. Kot $\varphi$ je **argument** števila $z$, $\varphi = \arg z$. Ker je $a = r\cos\varphi$ in $b = r\sin\varphi$, je

$$z = r(\cos\varphi + i\sin\varphi).$$

Argument je določen do večkratnika $2\pi$ natančno; **glavno vrednost** izberemo na intervalu $(-\pi, \pi]$ ali $[0, 2\pi)$. Izračunamo ga iz $\cos\varphi = \frac{a}{r}$, $\sin\varphi = \frac{b}{r}$. Formula $\tan\varphi = \frac{b}{a}$ sama ne zadošča: kvadrant moramo določiti iz predznakov $a$ in $b$.

**5. Eulerjeva formula.** Za vsak realni $\varphi$ velja

$$e^{i\varphi} = \cos\varphi + i\sin\varphi.$$

Zato je polarni zapis krajše $z = r e^{i\varphi}$ (eksponentna oblika). Za $\varphi = \pi$ dobimo znamenito enakost $e^{i\pi} + 1 = 0$. Število $e^{i\varphi}$ leži na enotski krožnici; ko $\varphi$ narašča, kroži okoli izhodišča.

**Množenje in deljenje v polarni obliki.** Iz pravil za potence sledi

$$r_1 e^{i\varphi_1} \cdot r_2 e^{i\varphi_2} = r_1 r_2\, e^{i(\varphi_1 + \varphi_2)}, \qquad \frac{r_1 e^{i\varphi_1}}{r_2 e^{i\varphi_2}} = \frac{r_1}{r_2}\, e^{i(\varphi_1 - \varphi_2)}.$$

Pri množenju se absolutni vrednosti pomnožita, argumenta pa seštejeta. Množenje z $i = e^{i\pi/2}$ je vrtenje za $90^\circ$ v pozitivni smeri.

:::premisli
Kaj se zgodi s točko $z$, če jo pomnožimo z $-i$? In kaj, če jo dvakrat zapored pomnožimo z $i$?
---
$-i = e^{-i\pi/2}$, zato je to vrtenje za $90^\circ$ v smeri urinega kazalca. Dvakratno množenje z $i$ je vrtenje za $180^\circ$: točka preide v $-z$, kar se ujema z $i^2 = -1$.
:::

**6. Potence (de Moivrova formula).** **Izrek.** Za $z = r(\cos\varphi + i\sin\varphi)$ in vsak naravni $n$ je

$$z^n = r^n e^{in\varphi} = r^n(\cos n\varphi + i\sin n\varphi).$$

*Dokaz z indukcijo.* Za $n = 1$ formula velja. Če velja za $n$, je po pravilu za množenje (absolutni vrednosti se množita, argumenta seštejeta) $z^{n+1} = z^n \cdot z = r^n r\,(\cos(n\varphi + \varphi) + i\sin(n\varphi + \varphi))$, kar je formula za $n + 1$. Formula velja tudi za cele $n$, saj je $z^{-1} = r^{-1}e^{-i\varphi}$ za $z \neq 0$.

**7. Koreni.** **Izrek.** Naj bo $z = r e^{i\varphi} \neq 0$ in $n \in \mathbb{N}$. Potem ima enačba $w^n = z$ natanko $n$ različnih rešitev

$$w_k = \sqrt[n]{r}\, e^{i\frac{\varphi + 2k\pi}{n}}, \qquad k = 0, 1, \dots, n - 1.$$

*Izpeljava.* Iščemo $w = \rho e^{i\psi}$. Iz $\rho^n e^{in\psi} = re^{i\varphi}$ sledi $\rho^n = r$ (enaki absolutni vrednosti) in $n\psi = \varphi + 2k\pi$ za neki $k \in \mathbb{Z}$ (argumenta se ujemata do večkratnika $2\pi$). Torej $\rho = \sqrt[n]{r}$, $\psi = \frac{\varphi + 2k\pi}{n}$; $k$ in $k + n$ dasta isto število, za $k = 0, 1, \dots, n - 1$ pa se argumenti razlikujejo za manj kot $2\pi$, zato so ta števila različna; rešitev je torej natanko $n$.

Vsi koreni ležijo na krožnici s polmerom $\sqrt[n]{r}$ in tvorijo oglišča pravilnega $n$-kotnika. Posebej imajo **$n$-ti koreni enote** ($w^n = 1$) argumente $\frac{2k\pi}{n}$.

:::premisli
Ali ima enačba $w^4 = -1$ kakšno realno rešitev? Kje ležijo njene rešitve?
---
Realne nima, ker je četrta potenca realnega števila nenegativna. Iz $-1 = e^{i\pi}$ dobimo argumente $\frac{\pi}{4} + \frac{k\pi}{2}$, torej $45^\circ$, $135^\circ$, $225^\circ$ in $315^\circ$: oglišča kvadrata na enotski krožnici, nobeno na oseh.
:::

**8. Osnovni izrek algebre.** **Izrek.** Vsak polinom $p(z) = a_nz^n + \dots + a_1z + a_0$ stopnje $n \ge 1$ s kompleksnimi koeficienti ima v $\mathbb{C}$ vsaj eno ničlo. Posledica: $p(z) = a_n(z - z_1)(z - z_2)\cdots(z - z_n)$, kjer so $z_1, \dots, z_n$ ničle, šteto z večkratnostjo (ko najdemo ničlo $z_1$, delimo z $z - z_1$ in ponovimo na polinomu stopnje $n - 1$).

**Trditev.** Če ima $p$ realne koeficiente in je $p(z_0) = 0$, je tudi $p(\bar z_0) = 0$. *Dokaz:* ker je konjugiranje usklajeno z vsoto in produktom in je $\bar a_k = a_k$, je $p(\bar z_0) = \sum a_k\bar z_0^{\,k} = \overline{\sum a_kz_0^k} = \overline{p(z_0)} = \bar 0 = 0$. Nerealne ničle realnega polinoma torej nastopajo v konjugiranih parih, par pa da realni kvadratni faktor $(z - z_0)(z - \bar z_0) = z^2 - 2\operatorname{Re} z_0\, z + |z_0|^2$. Kvadratna enačba z negativno diskriminanto ima rešitvi $z = \frac{-b \pm i\sqrt{-D}}{2a}$; na primer $z^2 + 2z + 5 = 0$ ima $D = -16$ in rešitvi $z = -1 \pm 2i$.

## Rešeni primeri

### Primer 1 (lažji)

Dani sta števili $z = 3 + 4i$ in $w = 1 - 2i$. Izračunaj $z + w$, $z \cdot w$, $\frac{z}{w}$ in $|z|$.

**Podatki:** $z = 3 + 4i$, $w = 1 - 2i$
**Iščemo:** $z + w$, $zw$, $\frac{z}{w}$, $|z|$

:::formula
$(a + bi)(c + di) = (ac - bd) + (ad + bc)i$; $\dfrac{z}{w} = \dfrac{z \bar w}{|w|^2}$; $|a + bi| = \sqrt{a^2 + b^2}$.
:::

**Rešitev:**

1. Vsota: $z + w = (3 + 1) + (4 - 2)i = 4 + 2i$.
2. Produkt: $zw = 3 - 6i + 4i - 8i^2 = 3 - 2i + 8 = 11 - 2i$.
3. Kvocient: $\bar w = 1 + 2i$, $|w|^2 = 1 + 4 = 5$. Števec: $(3 + 4i)(1 + 2i) = 3 + 6i + 4i + 8i^2 = -5 + 10i$. Torej $\frac{z}{w} = \frac{-5 + 10i}{5} = -1 + 2i$.
4. Preizkus kvocienta: $(-1 + 2i)(1 - 2i) = -1 + 2i + 2i - 4i^2 = 3 + 4i = z$.
5. Absolutna vrednost: $|z| = \sqrt{9 + 16} = 5$.
6. Odgovor: $z + w = 4 + 2i$, $zw = 11 - 2i$, $\frac{z}{w} = -1 + 2i$, $|z| = 5$.

### Primer 2

Zapiši $z = 1 + i\sqrt{3}$ v polarni in eksponentni obliki ter izračunaj $z^6$.

**Podatki:** $z = 1 + i\sqrt{3}$, eksponent $n = 6$
**Iščemo:** $r$, $\varphi$ in $z^6$

:::formula
$r = \sqrt{a^2 + b^2}$, $\cos\varphi = \dfrac{a}{r}$, $\sin\varphi = \dfrac{b}{r}$; de Moivre: $z^n = r^n e^{in\varphi}$.
:::

**Rešitev:**

1. $r = \sqrt{1 + 3} = 2$.
2. $\cos\varphi = \frac{1}{2}$, $\sin\varphi = \frac{\sqrt{3}}{2}$; obe vrednosti sta pozitivni, zato je $\varphi$ v prvem kvadrantu: $\varphi = \frac{\pi}{3}$.
3. Polarna oblika: $z = 2\left(\cos\frac{\pi}{3} + i\sin\frac{\pi}{3}\right) = 2e^{i\pi/3}$.
4. Potenca: $z^6 = 2^6 e^{i \cdot 6 \cdot \pi/3} = 64\, e^{2\pi i}$.
5. Ker je $e^{2\pi i} = \cos 2\pi + i\sin 2\pi = 1$, je $z^6 = 64$.
6. Odgovor: $z = 2e^{i\pi/3}$ in $z^6 = 64$. Računanje z binomsko formulo bi bilo precej daljše.

### Primer 3 (težji)

Reši enačbo $z^3 = -8$ v kompleksnih številih in rešitve nariši v kompleksni ravnini. Polinom $z^3 + 8$ razcepi na linearne faktorje nad $\mathbb{C}$ in na nerazcepne faktorje nad $\mathbb{R}$ ter izračunaj ploščino trikotnika, katerega oglišča so rešitve.

**Podatki:** enačba $z^3 = -8$, stopnja $n = 3$, polinom $z^3 + 8$
**Iščemo:** vse tri rešitve $z_0$, $z_1$, $z_2$, razcep nad $\mathbb{C}$ in nad $\mathbb{R}$, ploščino $S$ trikotnika

:::formula
$w_k = \sqrt[n]{r}\, e^{i\frac{\varphi + 2k\pi}{n}}$, $k = 0, 1, \dots, n - 1$, kjer je $z = r e^{i\varphi}$; $(z - z_0)(z - \bar z_0) = z^2 - 2\operatorname{Re} z_0\, z + |z_0|^2$; ploščina enakostraničnega trikotnika s stranico $l$ je $S = \frac{\sqrt{3}}{4}l^2$.
:::

**Rešitev:**

1. Desna stran v polarni obliki: $-8$ leži na negativni realni osi, zato $r = 8$, $\varphi = \pi$, torej $-8 = 8e^{i\pi}$.
2. Absolutna vrednost rešitev: $\sqrt[3]{8} = 2$.
3. $k = 0$: $z_0 = 2e^{i\pi/3} = 2\left(\frac{1}{2} + i\frac{\sqrt{3}}{2}\right) = 1 + i\sqrt{3}$.
4. $k = 1$: $z_1 = 2e^{i\pi} = -2$.
5. $k = 2$: $z_2 = 2e^{i5\pi/3} = 2\left(\frac{1}{2} - i\frac{\sqrt{3}}{2}\right) = 1 - i\sqrt{3}$.
6. Preizkus: $(-2)^3 = -8$; iz Primera 2 je $(1 + i\sqrt{3})^3 = 2^3 e^{i\pi} = -8$.
7. Na sliki so rešitve oglišča enakostraničnega trikotnika, včrtanega v krožnico s polmerom $2$; $z_0$ in $z_2$ sta konjugirani par, kot mora biti pri realni enačbi.
8. Razcep nad $\mathbb{C}$ (osnovni izrek algebre, vodilni koeficient $1$): $z^3 + 8 = (z + 2)(z - 1 - i\sqrt{3})(z - 1 + i\sqrt{3})$.
9. Nad $\mathbb{R}$ združimo konjugirani par: $\operatorname{Re} z_0 = 1$, $|z_0|^2 = 4$, zato $(z - z_0)(z - \bar z_0) = z^2 - 2z + 4$ in $z^3 + 8 = (z + 2)(z^2 - 2z + 4)$. Kvadratni faktor ima diskriminanto $4 - 16 = -12 < 0$, zato je nad $\mathbb{R}$ nerazcepen. Preizkus z razpisom: $(z + 2)(z^2 - 2z + 4) = z^3 - 2z^2 + 4z + 2z^2 - 4z + 8 = z^3 + 8$ ✓.
10. Ploščina: stranica je $l = |z_0 - z_2| = |2i\sqrt{3}| = 2\sqrt{3}$, zato $S = \frac{\sqrt{3}}{4} \cdot 12 = 3\sqrt{3} \approx 5{,}20$.
11. Odgovor: rešitve so $z_0 = 1 + i\sqrt{3}$, $z_1 = -2$ in $z_2 = 1 - i\sqrt{3}$; $z^3 + 8 = (z + 2)(z^2 - 2z + 4)$ nad $\mathbb{R}$; trikotnik ima ploščino $3\sqrt{3} \approx 5{,}20$.

## Pogoste napake

- **$\operatorname{Im}(a + bi) = bi$.** Imaginarni del je realno število $b$, brez $i$. Za $z = 3 - 4i$ je $\operatorname{Im} z = -4$.
- **$|a + bi| = a + b$ ali $\sqrt{a^2 - b^2}$.** Pravilno je $\sqrt{a^2 + b^2}$. Za $-5 + 12i$ je $|z| = 13$.
- **Napačen kvadrant argumenta.** Za $z = -1 - i$ je $\arctan\frac{-1}{-1} = \frac{\pi}{4}$, a število leži v tretjem kvadrantu: $\arg z = -\frac{3\pi}{4}$ (ali $\frac{5\pi}{4}$).
- **Pozabljeni koreni.** Enačba $z^4 = 16$ nima le rešitev $\pm 2$, temveč še $\pm 2i$. Enačba $z^n = w$ ima vedno $n$ različnih rešitev, ko je $w \neq 0$.
- **$\sqrt{-4}\sqrt{-9} = \sqrt{36} = 6$.** Pravilo $\sqrt{a}\sqrt{b} = \sqrt{ab}$ v kompleksnem ne velja: $\sqrt{-4} = 2i$, $\sqrt{-9} = 3i$, produkt je $6i^2 = -6$.
- **Deljenje brez konjugiranja.** $\frac{1}{a + bi} \neq \frac{1}{a} + \frac{1}{bi}$. Razširi s konjugiranim imenovalcem.
- **Kompleksna števila urejamo po velikosti.** Izraz $2 + i < 3$ nima smisla; primerjamo lahko le absolutne vrednosti.

## Povzetek

- $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}$; $\mathbb{R}$ je poln urejen obseg (aksiom o supremumu).
- $z = a + bi$, $i^2 = -1$, $\operatorname{Re} z = a$, $\operatorname{Im} z = b$, $\bar z = a - bi$, $|z| = \sqrt{a^2 + b^2}$, $z\bar z = |z|^2$.
- Deljenje: razširimo s konjugiranim imenovalcem.
- Polarni zapis: $z = r(\cos\varphi + i\sin\varphi) = re^{i\varphi}$; Eulerjeva formula $e^{i\varphi} = \cos\varphi + i\sin\varphi$.
- Pri množenju se absolutni vrednosti množita, argumenta seštevata; $z^n = r^n e^{in\varphi}$.
- $n$-ti koreni: $\sqrt[n]{r}\, e^{i(\varphi + 2k\pi)/n}$, $k = 0, \dots, n - 1$; oglišča pravilnega $n$-kotnika.

## Za izpit

Znati moraš povedati:

- definicijo zgornje meje, supremuma in infimuma (oba pogoja) ter aksiom o supremumu; razliko med supremumom in maksimumom;
- dokaz, da $\sqrt{2}$ ni racionalno število, in dokaz trikotniške neenakosti;
- lastnosti konjugiranja in absolutne vrednosti kompleksnih števil ($\overline{zw} = \bar z\bar w$, $|zw| = |z||w|$);
- de Moivrovo formulo z dokazom z indukcijo in izpeljavo formule za $n$-te korene;
- osnovni izrek algebre in dokaz, da so nerealne ničle realnega polinoma v konjugiranih parih.

### Naloga 1

Poišči vsa kompleksna števila $z$, za katera velja $z^3 = 4\bar z$, in jih nariši v kompleksni ravnini. Nato izračunaj $w = \dfrac{(1 + i)^{10}}{(1 - i\sqrt{3})^6}$ in ga zapiši v algebrski obliki.

**Rešitev:**

1. Vzamemo absolutno vrednost obeh strani: $|z|^3 = 4|\bar z| = 4|z|$, torej $|z|\,(|z|^2 - 4) = 0$ in $|z| = 0$ ali $|z| = 2$.
2. $|z| = 0$ da rešitev $z = 0$.
3. Za $|z| = 2$ pišemo $z = 2e^{i\varphi}$, $\bar z = 2e^{-i\varphi}$: $8e^{3i\varphi} = 8e^{-i\varphi}$, torej $e^{4i\varphi} = 1$.
4. Od tod $4\varphi = 2k\pi$, $\varphi = \frac{k\pi}{2}$ za $k = 0, 1, 2, 3$ (druge vrednosti $k$ ponovijo ista števila): $z = 2$, $2i$, $-2$, $-2i$.
5. Preizkus za $z = 2i$: $(2i)^3 = -8i$ in $4 \cdot \overline{2i} = 4 \cdot (-2i) = -8i$ ✓.
6. Števec: $1 + i = \sqrt{2}\,e^{i\pi/4}$, zato $(1 + i)^{10} = (\sqrt{2})^{10}e^{i10\pi/4} = 32\,e^{i5\pi/2} = 32\,e^{i\pi/2} = 32i$.
7. Imenovalec: $|1 - i\sqrt{3}| = 2$, število je v četrtem kvadrantu z argumentom $-\frac{\pi}{3}$, zato $(1 - i\sqrt{3})^6 = 64\,e^{-2\pi i} = 64$.
8. $w = \frac{32i}{64} = \frac{i}{2}$.
9. Odgovor: rešitve enačbe so $0$, $2$, $2i$, $-2$ in $-2i$ (izhodišče in oglišča kvadrata na krožnici s polmerom $2$); $w = \frac{1}{2}i$.

### Naloga 2

Natančno navedi definicijo supremuma množice $A \subseteq \mathbb{R}$. Za množico $A = \left\{\frac{n}{n + 1} : n \in \mathbb{N}\right\}$ določi $\sup A$ in $\inf A$ ter utemelji, ali sta to maksimum oziroma minimum. Utemelji še, ali ima vsaka neprazna navzgor omejena podmnožica $\mathbb{Q}$ supremum v $\mathbb{Q}$.

**Rešitev:**

1. Definicija: $s = \sup A$, če je (i) $a \le s$ za vsak $a \in A$ in (ii) za vsak $\varepsilon > 0$ obstaja $a \in A$ z $a > s - \varepsilon$.
2. Ker je $\frac{n}{n + 1} = 1 - \frac{1}{n + 1} < 1$, je $1$ zgornja meja; pogoj (i) velja za $s = 1$.
3. Pogoj (ii): neenakost $1 - \frac{1}{n + 1} > 1 - \varepsilon$ je ekvivalentna $n + 1 > \frac{1}{\varepsilon}$, tak $n \in \mathbb{N}$ pa obstaja (naravna števila niso navzgor omejena). Torej $\sup A = 1$.
4. Enačba $\frac{n}{n + 1} = 1$ nima rešitve, zato $1 \notin A$ in $A$ nima maksimuma.
5. Zaporedje je naraščajoče: $\frac{n + 1}{n + 2} - \frac{n}{n + 1} = \frac{1}{(n + 1)(n + 2)} > 0$. Najmanjši element je $\frac{1}{2}$ pri $n = 1$, zato $\inf A = \min A = \frac{1}{2}$.
6. Za $\mathbb{Q}$ odgovor ni pritrdilen: $B = \{x \in \mathbb{Q} : x^2 < 2\}$ je neprazna in navzgor omejena z $2$, njen supremum v $\mathbb{R}$ je $\sqrt{2}$, ki ni racionalen. Vsaka racionalna zgornja meja $q$ je torej večja od $\sqrt{2}$, med njima pa leži racionalno število $q' < q$, ki je tudi zgornja meja, zato v $\mathbb{Q}$ najmanjše zgornje meje ni.
7. Odgovor: $\sup A = 1$ (ni maksimum), $\inf A = \min A = \frac{1}{2}$; $\mathbb{Q}$ nima lastnosti polnosti.

### Naloga 3

Dokaži, da je za polinom $p$ z realnimi koeficienti z ničlo $z_0$ ničla tudi $\bar z_0$, in utemelji, zakaj ima vsak realni polinom lihe stopnje vsaj eno realno ničlo. Poišči vse ničle polinoma $p(z) = z^3 - 3z^2 + 7z - 5$, če veš, da je $1 + 2i$ njegova ničla.

**Rešitev:**

1. Dokaz: $p(\bar z_0) = \sum_k a_k\bar z_0^{\,k} = \overline{\sum_k a_kz_0^k} = \overline{p(z_0)} = 0$, ker je $\bar a_k = a_k$ ter $\overline{z + w} = \bar z + \bar w$ in $\overline{zw} = \bar z\bar w$.
2. Po osnovnem izreku algebre ima polinom stopnje $n$ natanko $n$ ničel (z večkratnostjo). Nerealne ničle nastopajo v parih $z_0, \bar z_0$, zato jih je sodo mnogo; pri lihem $n$ mora biti vsaj ena ničla realna.
3. Preizkus: $(1 + 2i)^2 = -3 + 4i$, $(1 + 2i)^3 = -11 - 2i$, zato $p(1 + 2i) = -11 - 2i + 9 - 12i + 7 + 14i - 5 = 0$ ✓.
4. Tudi $1 - 2i$ je ničla; njun faktor je $(z - 1 - 2i)(z - 1 + 2i) = z^2 - 2z + 5$.
5. Deljenje: $p(z) = (z^2 - 2z + 5)(z - 1)$; razpis $z^3 - z^2 - 2z^2 + 2z + 5z - 5 = z^3 - 3z^2 + 7z - 5$ ✓.
6. Odgovor: ničle so $1$, $1 + 2i$ in $1 - 2i$.

## Drugače: Na sliki

Nariši kompleksno ravnino z realno osjo vodoravno in imaginarno navpično. Število $3 + 4i$ je točka $(3, 4)$; njena razdalja od izhodišča je $5$ (pravokotni trikotnik s katetama $3$ in $4$). Konjugirano število $3 - 4i$ je zrcalna slika čez realno os.

Množenje z $i$ zavrti točko za $90^\circ$ v nasprotni smeri urinega kazalca: $i(3 + 4i) = -4 + 3i$, točka se iz prvega kvadranta premakne v drugi. Množenje z $2e^{i\pi/3}$ točko zavrti za $60^\circ$ in jo oddalji od izhodišča na dvojno razdaljo.

Rešitve enačbe $z^6 = 1$ so oglišča pravilnega šestkotnika na enotski krožnici, z oglišči pri kotih $0^\circ$, $60^\circ$, $120^\circ$, $180^\circ$, $240^\circ$ in $300^\circ$. Eno oglišče je vedno pri $1$.

## Drugače: Uporaba v stroki

**Izmenični tok in impedanca.** V tokokrogu z izmenično napetostjo upornik, tuljava in kondenzator povzročajo različne fazne zamike. Inženirji jih združijo v kompleksno **impedanco** $Z = R + iX$. Za upornik z $R = 30\,\Omega$ in tuljavo z reaktanco $X_L = 40\,\Omega$ je $Z = (30 + 40i)\,\Omega$, njena absolutna vrednost $|Z| = 50\,\Omega$ in fazni kot $\varphi = \arctan\frac{40}{30} \approx 53{,}1^\circ$. Pri efektivni napetosti $230\,\mathrm{V}$ teče tok $\frac{230\,\mathrm{V}}{50\,\Omega} = 4{,}6\,\mathrm{A}$, ki za napetostjo zaostaja za $53{,}1^\circ$.

**Elektrokemijska impedančna spektroskopija.** V elektrokemijskem laboratoriju (korozija, baterije, senzorji) na elektrodo vsiljujemo majhno izmenično napetost in merimo kompleksno impedanco pri različnih frekvencah. Kondenzator ima impedanco $Z_C = \frac{1}{i\omega C} = -\frac{i}{\omega C}$. Za dvojno plast s $C = 10\,\mu\mathrm{F}$ pri $f = 1\,\mathrm{kHz}$ je $\omega = 2\pi f \approx 6283\,\mathrm{s^{-1}}$ in $|Z_C| \approx 15{,}9\,\Omega$; zaporedno z uporom elektrolita $20\,\Omega$ dobimo $Z \approx (20 - 15{,}9i)\,\Omega$, $|Z| \approx 25{,}6\,\Omega$ in fazni kot okoli $-38{,}5^\circ$. Meritve rišemo v kompleksni ravnini (Nyquistov diagram) in iz oblike krivulje razberemo nadomestno vezje.

**Spektroskopija in Fourierova analiza.** Signal pri NMR in FTIR je vsota nihanj $A\cos(\omega t + \delta)$, ki jih zapišemo kot realne dele $Ae^{i(\omega t + \delta)}$. Fourierova transformacija, ki iz signala izračuna spekter, deluje s kompleksnimi eksponenti; absolutna vrednost da jakost, argument pa fazo, ki jo pri obdelavi spektra popravljamo.

**Dinamika procesov.** Pri dušenem nihanju ali pri regulaciji reaktorja dobimo karakteristično enačbo, na primer $\lambda^2 + 2\lambda + 5 = 0$ z rešitvama $\lambda = -1 \pm 2i$. Realni del $-1$ pove, kako hitro nihanje zamira (negativen realni del pomeni stabilen sistem), imaginarni del $2$ pa kotno frekvenco nihanja.

## Drugače: Korak za korakom s številkami

Pretvorimo $z = -2 + 2i$ v polarno obliko in izračunajmo $z^4$.

1. **Absolutna vrednost.** $r = \sqrt{(-2)^2 + 2^2} = \sqrt{8} = 2\sqrt{2} \approx 2{,}828$.
2. **Kvadrant.** Realni del je negativen, imaginarni pozitiven: drugi kvadrant.
3. **Argument.** $\cos\varphi = \frac{-2}{2\sqrt{2}} = -\frac{\sqrt{2}}{2}$, $\sin\varphi = \frac{\sqrt{2}}{2}$, torej $\varphi = \frac{3\pi}{4}$ (to je $135^\circ$).
4. **Polarna oblika.** $z = 2\sqrt{2}\, e^{i3\pi/4}$.
5. **Potenca.** $z^4 = (2\sqrt{2})^4 e^{i \cdot 3\pi} = 64\, e^{i3\pi}$.
6. **Poenostavitev.** $e^{i3\pi} = e^{i\pi} = -1$, ker se kot razlikuje za $2\pi$. Torej $z^4 = -64$.
7. **Preizkus algebrsko.** $z^2 = (-2 + 2i)^2 = 4 - 8i + 4i^2 = -8i$, $z^4 = (-8i)^2 = 64i^2 = -64$.

## Drugače: Bolj natančno

**Konstrukcija $\mathbb{C}$.** Kompleksna števila lahko vpeljemo brez »skrivnostnega« $i$: so urejeni pari realnih števil $(a, b)$ z operacijama $(a, b) + (c, d) = (a + c, b + d)$ in $(a, b)(c, d) = (ac - bd, ad + bc)$. Preverimo lahko, da je to obseg; par $(a, 0)$ identificiramo z realnim številom $a$, par $(0, 1)$ pa označimo z $i$. Tedaj je $i^2 = (0, 1)(0, 1) = (-1, 0) = -1$. Obseg $\mathbb{C}$ ni urejen: v urejenem obsegu je vsak kvadrat nenegativen, zato bi bilo $-1 = i^2 \ge 0$, kar je protislovje.

**Trikotniška neenakost** velja tudi v $\mathbb{C}$: $|z + w| \le |z| + |w|$. Dokaz: $|z + w|^2 = (z + w)(\bar z + \bar w) = |z|^2 + |w|^2 + 2\operatorname{Re}(z\bar w) \le |z|^2 + |w|^2 + 2|z||w| = (|z| + |w|)^2$.

**Utemeljitev Eulerjeve formule.** Eksponentno funkcijo za kompleksne argumente definiramo z vrsto $e^z = \sum_{n \ge 0} \frac{z^n}{n!}$. Vstavimo $z = i\varphi$ in ločimo sode in lihe potence; ker je $i^{2k} = (-1)^k$, dobimo

$$e^{i\varphi} = \sum_{k \ge 0} \frac{(-1)^k \varphi^{2k}}{(2k)!} + i\sum_{k \ge 0} \frac{(-1)^k \varphi^{2k+1}}{(2k + 1)!} = \cos\varphi + i\sin\varphi,$$

kjer smo prepoznali Taylorjevi vrsti kosinusa in sinusa. Iz $e^{z + w} = e^z e^w$ sledi pravilo o seštevanju argumentov pri množenju, iz tega pa adicijska izreka za sinus in kosinus.

## Preveri se

? Koliko je $i^{2026}$?
+ $-1$
- $1$
~ $i^n = 1$ velja pri ostanku $0$ pri deljenju s $4$; tu je ostanek $2$.
- $i$
~ $i^n = i$ velja pri ostanku $1$.
- $-i$
~ $i^n = -i$ velja pri ostanku $3$.
> Potence $i$ se ponavljajo s periodo $4$. Ker je $2026 = 4 \cdot 506 + 2$, je $i^{2026} = i^2 = -1$.

? Kolikšna je absolutna vrednost števila $z = -5 + 12i$?
- $7$
~ To je $a + b$; modul je $\sqrt{a^2 + b^2}$.
+ $13$
- $\sqrt{119}$
~ To je $\sqrt{12^2 - 5^2}$; kvadrata se seštejeta.
> $|z| = \sqrt{(-5)^2 + 12^2} = \sqrt{25 + 144} = \sqrt{169} = 13$.

? Koliko je $e^{i\pi/2}$?
+ $i$
- $-1$
~ To je $e^{i\pi}$; kot $\frac{\pi}{2}$ je le četrt obrata.
- $1$
~ To je $e^{0} = e^{2\pi i}$.
> Po Eulerjevi formuli je $e^{i\pi/2} = \cos\frac{\pi}{2} + i\sin\frac{\pi}{2} = 0 + i \cdot 1 = i$.

? Koliko različnih kompleksnih rešitev ima enačba $z^4 = 16$?
- $1$
~ Realna rešitev $2$ ni edina.
- $2$
~ To sta le realni rešitvi $\pm 2$; manjkata $\pm 2i$.
+ $4$
> Enačba $z^n = w$ z $w \neq 0$ ima $n$ različnih rešitev; tu so to $2$, $2i$, $-2$ in $-2i$.

:::simboli
z | kompleksno število | z = a + bi | |
a | realni del števila z | a = \operatorname{Re} z | |
b | imaginarni del števila z | b = \operatorname{Im} z | | realno število, brez i
i | imaginarna enota | i^2 = -1 | |
c | realni del drugega števila c + di | | |
d | imaginarni del drugega števila c + di | | | pri deljenju c + di ≠ 0
r | absolutna vrednost (modul) števila z | r = \sqrt{a^2 + b^2} | | razdalja od izhodišča, r = |z|
\varphi | argument števila z | \cos\varphi = \frac{a}{r} | | kot s pozitivnim delom realne osi
e | Eulerjevo število | | | e ≈ 2,718
r_1, r_2 | absolutni vrednosti obeh faktorjev | | |
\varphi_1, \varphi_2 | argumenta obeh faktorjev | | | pri množenju se seštejeta
n | stopnja potence oziroma korena | | | naravno število
w_k | k-ti izmed n-tih korenov števila z | w_k = \sqrt[n]{r}\, e^{i\frac{\varphi + 2k\pi}{n}} | | ležijo na krožnici s polmerom ⁿ√r
k | zaporedna številka korena | | | k = 0, 1, …, n − 1
w | kompleksno število (delitelj) | | | w ≠ 0
\bar w | konjugirano število k w | \bar w = c - di | | za w = c + di; imaginarnemu delu spremenimo predznak
S | ploščina trikotnika z oglišči v rešitvah enačbe | S = \frac{\sqrt{3}}{4}l^2 | | enakostranični trikotnik
l | stranica trikotnika | | |
:::
