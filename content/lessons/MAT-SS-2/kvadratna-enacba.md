---
stanje: preverjeno
demo: graf
avtor: AI
---

## Zakaj se tega učimo

Poskus za doma: vrzi žogo navpično navzgor in s štoparico na telefonu izmeri, koliko časa je v zraku, preden jo spet ujameš. Recimo, da izmeriš $1{,}0\,\text{s}$. Iz fizike sledi, da je višina žoge nad roko po času $t$ (v sekundah) približno $h(t) = 4{,}9t - 4{,}9t^2$ metrov.

Kdaj je žoga $1\,\text{m}$ nad roko? Iz $4{,}9t - 4{,}9t^2 = 1$ dobiš enačbo $4{,}9t^2 - 4{,}9t + 1 = 0$. Tega tričlenika ne razstaviš na pamet. In ali žoga sploh doseže $1{,}5\,\text{m}$?

Potrebuješ obrazec, ki reši vsako kvadratno enačbo, in število, ki že pred reševanjem pove, ali rešitev obstaja. Enako računajo pri vesoljskih poletih: na Luni je težni pospešek približno šestkrat manjši kot na Zemlji, zato bi isti met žogo dvignil približno šestkrat više.

## Razlaga

**1. Splošna oblika.** Kvadratna enačba je enačba, ki jo lahko zapišemo v **splošni obliki**

$$ax^2 + bx + c = 0, \qquad a, b, c \in \mathbb{R},\ a \ne 0.$$

Število $a$ je vodilni koeficient, $b$ linearni koeficient, $c$ prosti člen. Rešitve enačbe so natanko ničle kvadratne funkcije $f(x) = ax^2 + bx + c$. Preden prebereš koeficiente, prenesi vse člene na levo, da je na desni $0$.

*Preveri:* kateri so $a$, $b$, $c$ pri $3x = 5 - 2x^2$? (Enačba se glasi $2x^2 + 3x - 5 = 0$, torej $a = 2$, $b = 3$, $c = -5$.)

**2. Nepopolne enačbe.** Če je $b = 0$ ali $c = 0$, obrazca ne potrebuješ.

- $c = 0$: izpostavi $x$. Iz $ax^2 + bx = 0$ sledi $x(ax + b) = 0$, torej $x_1 = 0$ in $x_2 = -\dfrac{b}{a}$.
- $b = 0$: iz $ax^2 + c = 0$ sledi $x^2 = -\dfrac{c}{a}$. Če je desna stran pozitivna, korenimo: enačba $x^2 = 9$ da $x_{1,2} = \pm 3$. Če je negativna, sta rešitvi kompleksni: enačba $x^2 = -9$ da $x_{1,2} = \pm 3i$.

*Preveri:* reši $x^2 = 5x$. (Iz $x(x - 5) = 0$ sledi $x_1 = 0$ in $x_2 = 5$; z $x$ ne deli.)

**3. Diskriminanta in obrazec.** Za vsako kvadratno enačbo izračunamo **diskriminanto**

$$D = b^2 - 4ac$$

in rešitve po obrazcu

$$x_{1,2} = \frac{-b \pm \sqrt{D}}{2a}.$$

Ulomkova črta je pod celotnim števcem $-b \pm \sqrt{D}$. Od kod obrazec izhaja, piše v razdelku »Bolj natančno«.

Žoga iz uvoda: v enačbi $4{,}9t^2 - 4{,}9t + 1 = 0$ je $a = 4{,}9$, $b = -4{,}9$, $c = 1$.

$$D = 4{,}9^2 - 4 \cdot 4{,}9 \cdot 1 = 24{,}01 - 19{,}6 = 4{,}41$$

Ker je $\sqrt{4{,}41} = 2{,}1$, sta rešitvi $t_{1,2} = \dfrac{4{,}9 \pm 2{,}1}{9{,}8}$, torej $t_1 \approx 0{,}29\,\text{s}$ in $t_2 \approx 0{,}71\,\text{s}$. Na višini $1\,\text{m}$ je žoga dvakrat: grede gor in grede dol.

*Preveri:* koliko je $D$ pri $x^2 + 2x - 3 = 0$? ($D = 4 + 12 = 16$.)

:::premisli
Ali žoga doseže $1{,}5\,\text{m}$? Napovej predznak diskriminante enačbe $4{,}9t^2 - 4{,}9t + 1{,}5 = 0$, nato preveri.
---
Ne doseže. $D = 24{,}01 - 4 \cdot 4{,}9 \cdot 1{,}5 = 24{,}01 - 29{,}4 = -5{,}39 < 0$, zato realnega časa ni. Žoga se dvigne le do približno $1{,}2\,\text{m}$.
:::

**4. Kaj pove diskriminanta.**

| Diskriminanta | Rešitve | Graf $f(x) = ax^2 + bx + c$ |
|---|---|---|
| $D > 0$ | dve različni realni | seka os $x$ v dveh točkah |
| $D = 0$ | ena dvojna realna, $x_1 = x_2 = -\dfrac{b}{2a}$ | teme leži na osi $x$ |
| $D < 0$ | dve konjugirano kompleksni | ne seka osi $x$ |

V simulaciji spodaj (»Kvadratna enačba in diskriminanta«) nastavi $a = 1$ in $b = -2$, nato spreminjaj samo $c$. Parabola se premika gor in dol. Opazuj, pri kateri vrednosti $c$ se teme ravno dotakne osi $x$: tam je $D = 0$.

*Preveri:* koliko realnih rešitev ima $x^2 - 6x + 9 = 0$? ($D = 36 - 36 = 0$: ena dvojna, $x = 3$.)

**5. Negativna diskriminanta.** Pri $D < 0$ realnih rešitev ni, v kompleksnih pa sta dve. Negativno število $D$ ima kvadratna korena $\pm i\sqrt{-D}$, saj je $\left(i\sqrt{-D}\right)^2 = i^2 \cdot (-D) = D$. Zato

$$x_{1,2} = \frac{-b \pm i\sqrt{-D}}{2a}.$$

Rešitvi se razlikujeta le v predznaku imaginarnega dela, torej sta konjugirani kompleksni števili.

*Preveri:* reši $x^2 + 2x + 5 = 0$. ($D = -16$, $x_{1,2} = \dfrac{-2 \pm 4i}{2} = -1 \pm 2i$.)

**6. Vietovi formuli.** Za rešitvi $x_1$ in $x_2$ enačbe $ax^2 + bx + c = 0$ velja

$$x_1 + x_2 = -\frac{b}{a}, \qquad x_1 \cdot x_2 = \frac{c}{a}.$$

Formuli veljata tudi za dvojno rešitev (štejemo jo dvakrat) in za kompleksni rešitvi. Uporabljamo ju za:

- **preverjanje** rešitev,
- **sestavljanje enačbe** z danima rešitvama: $x^2 - (x_1 + x_2)x + x_1 x_2 = 0$,
- **razcep tričlenika**: $ax^2 + bx + c = a(x - x_1)(x - x_2)$, kar je ničelna oblika kvadratne funkcije,
- računanje izrazov, kot sta $x_1^2 + x_2^2$ ali $\dfrac{1}{x_1} + \dfrac{1}{x_2}$, brez reševanja enačbe.

:::premisli
Enačba $x^2 - 10x + 21 = 0$ ima celoštevilski rešitvi. Ju uganeš brez obrazca? Zakaj ti pri tem pomagata Vietovi formuli?
---
Rešitvi sta $3$ in $7$. Po Vietu iščeš dve števili z vsoto $10$ in produktom $21$; med celimi delitelji števila $21$ ustreza le par $3$ in $7$.
:::

*Preveri:* katera enačba z vodilnim koeficientom $1$ ima rešitvi $1$ in $4$? ($x^2 - 5x + 4 = 0$.)

**7. Postopek reševanja.** Enačbo preoblikuj v splošno obliko, preberi $a$, $b$, $c$, izračunaj $D$, iz predznaka $D$ ugotovi vrsto rešitev, uporabi obrazec in preveri z Vietovima formulama.

## Rešeni primeri

### Primer 1 (lažji)

Reši enačbo $x^2 - 2x - 15 = 0$ in rešitvi preveri z Vietovima formulama.

**Podatki:** enačba $x^2 - 2x - 15 = 0$, torej $a = 1$, $b = -2$, $c = -15$
**Iščemo:** rešitvi $x_1$ in $x_2$

:::formula
$D = b^2 - 4ac$, $\; x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$, $\; x_1 + x_2 = -\dfrac{b}{a}$, $\; x_1 x_2 = \dfrac{c}{a}$
:::

**Rešitev:**

1. Diskriminanta: $D = (-2)^2 - 4 \cdot 1 \cdot (-15) = 4 + 60 = 64$. Ker je $D > 0$, sta rešitvi dve realni.
2. $\sqrt{D} = 8$, zato $x_{1,2} = \dfrac{2 \pm 8}{2}$.
3. $x_1 = \dfrac{2 + 8}{2} = 5$ in $x_2 = \dfrac{2 - 8}{2} = -3$.
4. Preverjanje: $x_1 + x_2 = 2 = -\dfrac{-2}{1}$ in $x_1 x_2 = -15 = \dfrac{-15}{1}$.
5. Odgovor: rešitvi enačbe sta $x_1 = 5$ in $x_2 = -3$.

### Primer 2 (srednji)

Ugotovi, kakšne rešitve ima enačba $2x^2 + 4x + 5 = 0$, in jih izračunaj v množici kompleksnih števil. Kaj to pomeni za graf funkcije $f(x) = 2x^2 + 4x + 5$?

**Podatki:** enačba $2x^2 + 4x + 5 = 0$, torej $a = 2$, $b = 4$, $c = 5$; funkcija $f(x) = 2x^2 + 4x + 5$
**Iščemo:** vrsto rešitev, rešitvi $x_1$ in $x_2$ v $\mathbb{C}$, lego grafa glede na os $x$

:::formula
$D = b^2 - 4ac$; pri $D < 0$: $\; x_{1,2} = \dfrac{-b \pm i\sqrt{-D}}{2a}$
:::

**Rešitev:**

1. $D = 4^2 - 4 \cdot 2 \cdot 5 = 16 - 40 = -24 < 0$. Realnih rešitev ni, v $\mathbb{C}$ sta dve konjugirano kompleksni.
2. $\sqrt{-D} = \sqrt{24} = \sqrt{4 \cdot 6} = 2\sqrt{6}$.
3. $x_{1,2} = \dfrac{-4 \pm 2\sqrt{6}\, i}{4} = -1 \pm \dfrac{\sqrt{6}}{2}\, i$.
4. Preverjanje z Vietovima formulama: vsota je $-1 + (-1) = -2 = -\dfrac{4}{2}$; produkt konjugiranih števil je $(m + ni)(m - ni) = m^2 + n^2$, tu $(-1)^2 + \left(\dfrac{\sqrt{6}}{2}\right)^2 = 1 + \dfrac{6}{4} = \dfrac{5}{2}$, kar je $\dfrac{c}{a}$.
5. Graf: $a = 2 > 0$, teme je pri $x = -\dfrac{4}{4} = -1$, $f(-1) = 2 - 4 + 5 = 3 > 0$. Parabola je odprta navzgor in v celoti leži nad osjo $x$.
6. Odgovor: rešitvi sta $x_{1,2} = -1 \pm \dfrac{\sqrt{6}}{2}\, i$; ker sta nerealni, graf funkcije $f$ ne seka osi $x$.

### Primer 3 (težji): kamen na Luni

Astronavt na Luni vrže kamen navpično navzgor z začetno hitrostjo $3{,}24\,\text{m/s}$. Težni pospešek na Luni je $1{,}62\,\text{m/s}^2$, zato je višina kamna nad roko po času $t$ enaka $h(t) = 3{,}24t - 0{,}81t^2$ (v metrih, $t$ v sekundah). Kdaj je kamen $2{,}43\,\text{m}$ nad roko? Ali doseže $4\,\text{m}$?

**Podatki:** $v_0 = 3{,}24\,\text{m/s}$, $g = 1{,}62\,\text{m/s}^2$, $h(t) = 3{,}24t - 0{,}81t^2$, višini $h_1 = 2{,}43\,\text{m}$ in $h_2 = 4\,\text{m}$
**Iščemo:** čase $t$, ko je $h(t) = h_1$; ali je višina $h_2$ kdaj dosežena

:::formula
$h(t) = v_0 t - \dfrac{g}{2}t^2$; enačba $h(t) = h_1$ v splošni obliki: $\dfrac{g}{2}t^2 - v_0 t + h_1 = 0$; $\; D = b^2 - 4ac$, $\; t_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$
:::

**Rešitev:**

1. Enačbo $3{,}24t - 0{,}81t^2 = 2{,}43$ preoblikujemo v $0{,}81t^2 - 3{,}24t + 2{,}43 = 0$, torej $a = 0{,}81$, $b = -3{,}24$, $c = 2{,}43$.
2. Diskriminanta: $D = 3{,}24^2 - 4 \cdot 0{,}81 \cdot 2{,}43 = 10{,}4976 - 7{,}8732 = 2{,}6244$. Ker je $D > 0$, je kamen na tej višini dvakrat.
3. $\sqrt{D} = 1{,}62$ in $2a = 1{,}62$, zato $t_{1,2} = \dfrac{3{,}24 \pm 1{,}62}{1{,}62}$: $t_1 = 1\,\text{s}$ in $t_2 = 3\,\text{s}$.
4. Preverjanje z Vietom: $t_1 + t_2 = 4$, kar je $\dfrac{3{,}24}{0{,}81}$, in $t_1 t_2 = 3$, kar je $\dfrac{2{,}43}{0{,}81}$.
5. Višina $4\,\text{m}$ da enačbo $0{,}81t^2 - 3{,}24t + 4 = 0$ z diskriminanto $D = 10{,}4976 - 4 \cdot 0{,}81 \cdot 4 = 10{,}4976 - 12{,}96 = -2{,}4624$. Ker je $D < 0$, realnega časa ni. (Najvišjo točko dobimo pri $D = 0$: iz $10{,}4976 = 4 \cdot 0{,}81 \cdot h$ sledi $h = 3{,}24\,\text{m}$.)
6. Odgovor: kamen je $2{,}43\,\text{m}$ nad roko po $1\,\text{s}$ (grede gor) in po $3\,\text{s}$ (grede dol); višine $4\,\text{m}$ ne doseže.

### Primer 4 – zdaj ti

Naj bosta $x_1$ in $x_2$ rešitvi enačbe $x^2 - 7x + 3 = 0$. Brez reševanja enačbe izračunaj $x_1^2 + x_2^2$ in sestavi kvadratno enačbo z vodilnim koeficientom $1$, katere rešitvi sta $x_1^2$ in $x_2^2$.

**Podatki:** enačba $x^2 - 7x + 3 = 0$, torej $a = 1$, $b = -7$, $c = 3$; nova enačba ima vodilni koeficient $1$ in rešitvi $x_1^2$, $x_2^2$
**Iščemo:** vrednost $x_1^2 + x_2^2$ in novo enačbo

:::formula
$x_1 + x_2 = -\dfrac{b}{a}$, $\; x_1 x_2 = \dfrac{c}{a}$, $\; x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2$; enačba z rešitvama $y_1$, $y_2$: $\; y^2 - (y_1 + y_2)y + y_1 y_2 = 0$
:::

**Rešitev:**

1. Vietovi formuli: $x_1 + x_2 = 7$, $x_1 x_2 = 3$. (Ker je $D = 49 - 12 = 37 > 0$, sta rešitvi realni.)
2. Iz $(x_1 + x_2)^2 = x_1^2 + 2x_1 x_2 + x_2^2$ sledi $x_1^2 + x_2^2 = 7^2 - 2 \cdot 3 = 49 - 6 = 43$. To je vsota novih rešitev.
3. Zdaj ti: izračunaj produkt novih rešitev $x_1^2 \cdot x_2^2$ in sestavi enačbo.

:::premisli
Kolikšen je produkt $x_1^2 x_2^2$ in katera je iskana enačba?
---
$x_1^2 x_2^2 = (x_1 x_2)^2 = 3^2 = 9$, zato je enačba $y^2 - 43y + 9 = 0$. Preverjanje s približki: $x_1 \approx 6{,}54$ in $x_2 \approx 0{,}46$, torej $x_1^2 \approx 42{,}79$ in $x_2^2 \approx 0{,}21$; vsota je $43$, produkt približno $9$.
:::

## Pogoste napake

- **Koeficienti iz enačbe, ki ni v splošni obliki.** Pri $x^2 = 3x + 4$ ni $c = 4$. Razlog: obrazec velja le za obliko $ax^2 + bx + c = 0$. Pravilno: najprej prenesi vse na levo, $x^2 - 3x - 4 = 0$, šele nato preberi $a = 1$, $b = -3$, $c = -4$.
- **Napaka s predznakom pri $b^2$ in $-b$.** Pri $b = -3$ je $b^2 = (-3)^2 = 9$, ne $-9$, in $-b = 3$. Razlog: kvadrat negativnega števila je pozitiven. Pravilno: negativen $b$ vedno vstavi v oklepaj.
- **Ulomkova črta le pod korenom.** Zapis $-b \pm \dfrac{\sqrt{D}}{2a}$ je napačen. Razlog: z $2a$ delimo celoten števec. Pravilno: $x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$.
- **Deljenje z neznanko.** Iz $x^2 = 3x$ nekateri delijo z $x$ in dobijo samo $x = 3$. Razlog: z $x$ smemo deliti le, če $x \ne 0$, zato rešitev $x = 0$ izgubiš. Pravilno: $x^2 - 3x = 0$, $x(x - 3) = 0$, $x_1 = 0$, $x_2 = 3$.
- **Vietova formula brez minusa** in sklep »ni rešitve«. Vsota rešitev je $-\dfrac{b}{a}$, ne $\dfrac{b}{a}$. Pri $D < 0$ pa ni res, da enačba nima rešitev: v $\mathbb{R}$ jih nima, v $\mathbb{C}$ ima dve konjugirani.

## Povzetek

- Kvadratna enačba: $ax^2 + bx + c = 0$, $a \ne 0$; rešitve so ničle funkcije $f(x) = ax^2 + bx + c$.
- Diskriminanta $D = b^2 - 4ac$; rešitve $x_{1,2} = \dfrac{-b \pm \sqrt{D}}{2a}$.
- $D > 0$: dve različni realni rešitvi; $D = 0$: ena dvojna realna; $D < 0$: dve konjugirano kompleksni.
- Nepopolne enačbe rešuj z izpostavljanjem ($c = 0$) ali s korenjenjem ($b = 0$), ne deli z $x$.
- Vietovi formuli: $x_1 + x_2 = -\dfrac{b}{a}$, $x_1 x_2 = \dfrac{c}{a}$.
- Razcep: $ax^2 + bx + c = a(x - x_1)(x - x_2)$; enačba z rešitvama $x_1$, $x_2$: $x^2 - (x_1 + x_2)x + x_1 x_2 = 0$.

## Drugače: Na sliki

Reševanje kvadratne enačbe si lahko predstavljaš kot vprašanje: **kje parabola $y = ax^2 + bx + c$ prečka os $x$?** Diskriminanta je takrat kot napoved, ki jo izrečeš, še preden pogledaš graf.

Predstavljaj si parabolo, odprto navzgor, ki jo počasi dvigaš (povečuješ $c$). Dokler je njeno teme pod osjo $x$, kraka sekata os $x$ v dveh točkah, $D > 0$. Ko dvigaš naprej, se presečišči bližata simetrijski osi, dokler se ne zlijeta v eno točko: teme se osi ravno dotakne, $D = 0$. Če parabolo dvigneš še više, lebdi nad osjo in presečišč ni več, $D < 0$. Rešitvi takrat »zbežita« iz realne premice v kompleksno ravnino, kjer ležita simetrično nad in pod realno osjo, saj sta konjugirani.

Na grafu vidiš tudi Vietovo formulo za vsoto: ničli sta simetrični glede na os $x = -\dfrac{b}{2a}$, zato je njuna vsota dvakratnik te vrednosti, $-\dfrac{b}{a}$. Pri $D < 0$ simetrijska os ostane, ničel pa ni: realni del obeh kompleksnih rešitev je ravno $-\dfrac{b}{2a}$.

## Drugače: Korak za korakom s številkami

Reši enačbo $x(3x + 4) = 2 - x$.

1. **Odpravi oklepaje:** $3x^2 + 4x = 2 - x$.
2. **Vse na levo stran:** $3x^2 + 4x + x - 2 = 0$, torej $3x^2 + 5x - 2 = 0$.
3. **Preberi koeficiente:** $a = 3$, $b = 5$, $c = -2$.
4. **Diskriminanta:** $D = 5^2 - 4 \cdot 3 \cdot (-2) = 25 + 24 = 49$. Ker je $D > 0$, pričakujemo dve realni rešitvi. Ker je $49 = 7^2$, bosta racionalni.
5. **Obrazec:** $x_{1,2} = \dfrac{-5 \pm 7}{6}$, torej $x_1 = \dfrac{2}{6} = \dfrac{1}{3}$ in $x_2 = \dfrac{-12}{6} = -2$.
6. **Preverjanje z Vietom:** $x_1 + x_2 = \dfrac{1}{3} - 2 = -\dfrac{5}{3} = -\dfrac{b}{a}$ in $x_1 x_2 = -\dfrac{2}{3} = \dfrac{c}{a}$.
7. **Preverjanje v prvotni enačbi** za $x = -2$: v oklepaju je $3 \cdot (-2) + 4 = -2$, leva stran je $-2 \cdot (-2) = 4$, desna $2 - (-2) = 4$. Za $x = \dfrac{1}{3}$: leva stran $\dfrac{1}{3} \cdot 5 = \dfrac{5}{3}$, desna $2 - \dfrac{1}{3} = \dfrac{5}{3}$. Obe rešitvi ustrezata.
8. **Razcep:** $3x^2 + 5x - 2 = 3\left(x - \dfrac{1}{3}\right)(x + 2) = (3x - 1)(x + 2)$.

## Drugače: Bolj natančno

**Izpeljava obrazca.** Enačbo $ax^2 + bx + c = 0$ delimo z $a \ne 0$ in dopolnimo do popolnega kvadrata:

$$x^2 + \frac{b}{a}x + \frac{c}{a} = 0 \;\Longrightarrow\; \left(x + \frac{b}{2a}\right)^2 = \frac{b^2 - 4ac}{4a^2} = \frac{D}{4a^2}.$$

Imenovalec $4a^2$ je pozitiven, zato je predznak desne strani enak predznaku $D$. Pri $D \ge 0$ korenimo: $x + \dfrac{b}{2a} = \pm \dfrac{\sqrt{D}}{2a}$, od koder dobimo obrazec. Pri $D < 0$ korenimo v $\mathbb{C}$: negativno število $\dfrac{D}{4a^2}$ ima kvadratna korena $\pm \dfrac{i\sqrt{-D}}{2a}$.

**Dokaz Vietovih formul.** Seštejemo rešitvi iz obrazca: korena se odštejeta, $x_1 + x_2 = \dfrac{-2b}{2a} = -\dfrac{b}{a}$. Za produkt uporabimo razliko kvadratov:

$$x_1 x_2 = \frac{(-b)^2 - D}{4a^2} = \frac{b^2 - b^2 + 4ac}{4a^2} = \frac{c}{a}.$$

**Razcep.** Iz Vietovih formul sledi $a(x - x_1)(x - x_2) = a\left(x^2 - (x_1 + x_2)x + x_1 x_2\right) = ax^2 + bx + c$. Kvadratni tričlenik z $D \ge 0$ se torej razcepi na linearna faktorja z realnimi koeficienti, pri $D < 0$ pa samo v $\mathbb{C}$. Zato ima kvadratna enačba z realnimi koeficienti v $\mathbb{C}$ vedno dve rešitvi, če dvojno rešitev štejemo dvakrat.

## Preveri se

? Graf funkcije $f(x) = ax^2 + bx + c$ se osi $x$ le dotakne, v eni sami točki. Kaj velja za enačbo $ax^2 + bx + c = 0$?
- $D > 0$, enačba ima dve različni realni rešitvi.
~ Dve različni realni rešitvi pomenita dve presečišči z osjo $x$, tu pa je točka ena.
+ $D = 0$, enačba ima eno dvojno realno rešitev.
- $D < 0$, enačba nima nobene rešitve.
~ Pri $D < 0$ parabola osi sploh ne doseže. Poleg tega ima enačba takrat v $\mathbb{C}$ dve rešitvi.
> Dotikališče je teme na osi $x$: $x_1 = x_2 = -\dfrac{b}{2a}$. To se zgodi natanko pri $D = 0$.

? Oceni rešitvi enačbe $x^2 - 7x + 3 = 0$, če veš, da je $\sqrt{37} \approx 6$.
- približno $-6{,}5$ in $-0{,}5$
~ V obrazcu je $-b$: pri $b = -7$ je $-b = 7$, ne $-7$.
- približno $10$ in $4$
~ Z $2$ si delil le koren, ne celega števca. Ulomkova črta je pod $-b \pm \sqrt{D}$.
+ približno $6{,}5$ in $0{,}5$
> $D = 49 - 12 = 37$, $x_{1,2} = \dfrac{7 \pm \sqrt{37}}{2} \approx \dfrac{7 \pm 6}{2}$, torej približno $6{,}5$ in $0{,}5$. Vsota $7$ se ujema z Vietom.

? Zakaj ima enačba $ax^2 + bx + c = 0$ vedno dve različni realni rešitvi, kadar imata $a$ in $c$ različna predznaka?
- Ker je takrat $b$ gotovo pozitiven.
~ O predznaku $b$ ta pogoj ne pove ničesar; $b$ je lahko tudi $0$ ali negativen.
- Trditev ne drži, saj lahko velik $b$ naredi $D$ negativen.
~ V $D$ nastopa $b^2$, ki ni nikoli negativen, zato $D$ lahko le poveča.
+ Ker je takrat $-4ac > 0$, $b^2$ pa ni negativen, zato je $D > 0$.
> Pri različnih predznakih je $ac < 0$, zato $-4ac > 0$ in $D = b^2 - 4ac > 0$. Produkt rešitev $\dfrac{c}{a}$ je negativen: ena rešitev je pozitivna, druga negativna.

? Katera enačba ima rešitvi $2$ in $-5$?
+ $x^2 + 3x - 10 = 0$
- $x^2 - 3x - 10 = 0$
~ Vsoto $-3$ si vstavil brez minusa iz Vietove formule. Linearni člen je $-(x_1 + x_2)x = +3x$.
- $x^2 + 3x + 10 = 0$
~ Produkt rešitev je $2 \cdot (-5) = -10$, ne $10$.
> Vsota rešitev je $-3$, produkt $-10$, zato $x^2 - (-3)x + (-10) = x^2 + 3x - 10 = 0$.

? Na Marsu je težni pospešek $3{,}72\,\text{m/s}^2$. Kamen, vržen navpično navzgor s hitrostjo $10\,\text{m/s}$, je po času $t$ na višini $h(t) = 10t - 1{,}86t^2$ metrov. Ali doseže $15\,\text{m}$?
- Da, dvakrat, saj ima vsaka kvadratna enačba dve rešitvi.
~ Dve rešitvi ima v $\mathbb{C}$, čas pa mora biti realen. Pri $D < 0$ realnega časa ni.
- Da, enkrat, ker je to njegova najvišja točka.
~ Najvišja točka bi pomenila $D = 0$, tu pa je $D$ negativen.
+ Ne, ker ima enačba $1{,}86t^2 - 10t + 15 = 0$ negativno diskriminanto.
> $D = 10^2 - 4 \cdot 1{,}86 \cdot 15 = 100 - 111{,}6 = -11{,}6 < 0$. Realnega časa ni; kamen se dvigne le do približno $13{,}4\,\text{m}$.

:::simboli
a | vodilni koeficient (pri $x^2$) | | | $a \ne 0$
b | linearni koeficient (pri $x$) | | |
c | prosti člen | | |
x | neznanka | | |
D | diskriminanta | D = b^2 - 4ac | | $D > 0$: dve realni, $D = 0$: ena dvojna, $D < 0$: kompleksni
x_{1,2} | rešitvi kvadratne enačbe | x_{1,2} = \frac{-b \pm \sqrt{D}}{2a} | |
x_1, x_2 | prva in druga rešitev | | | $x_1 + x_2 = -\frac{b}{a}$, $x_1 x_2 = \frac{c}{a}$
i | imaginarna enota | i^2 = -1 | |
y | neznanka nove enačbe | | |
y_1, y_2 | rešitvi nove enačbe | | |
t | čas | | s
t_{1,2} | časa, ko je telo na dani višini | t_{1,2} = \frac{-b \pm \sqrt{D}}{2a} | s
h | višina nad roko | h(t) = v_0 t - \frac{g}{2}t^2 | m
h_1 | dana višina | | m
h_2 | višina, za katero preverjamo, ali je dosežena | | m
v_0 | začetna hitrost | | m/s
g | težni pospešek | | m/s^2 | na Luni $1{,}62\,\mathrm{m/s^2}$
:::
