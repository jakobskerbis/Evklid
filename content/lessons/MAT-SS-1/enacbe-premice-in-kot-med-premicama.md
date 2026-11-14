---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na poti na počitnice ob cesti stoji znak »vzpon 12 %«. To pomeni, da se cesta na $100\,\text{m}$ vodoravne razdalje dvigne za $12\,\text{m}$. Doma je klančina v garažo, ki se na $4\,\text{m}$ vodoravne razdalje dvigne za $60\,\text{cm}$. Katera je bolj strma? In koliko stopinj je to, če bi strmino meril s kotomerom?

Enaka vprašanja si zastavlja tesar, ko riše ostrešje, ali mizar, ko pritrdi poševno oporo pod polico. Na načrtu v koordinatnem sistemu je vsaka letev del **premice**. Premico lahko zapišemo z več enačbami. Vsaka hitro pove nekaj drugega: naklon, presečišči z osema ali točko, skozi katero gre. Iz enačb potem izračunamo tudi kot med dvema letvama.

## Razlaga

**1. Eksplicitna oblika.** Iz linearne funkcije že poznaš zapis

$$y = kx + n$$

Tu je $k$ smerni koeficient (za koliko se $y$ spremeni, ko se $x$ poveča za $1$), $n$ pa začetna vrednost: premica seka os $y$ v točki $(0, n)$. Zapisu rečemo **eksplicitna oblika** enačbe premice, ker je $y$ izražen sam.

*Hitri preizkus:* kje premica $y = -2x + 5$ seka os $y$? (V točki $(0, 5)$.)

**2. Splošna oblika.** Enačbo lahko zapišemo tudi tako, da so vsi členi na levi:

$$ax + by + c = 0$$

To je **splošna** (implicitna) oblika; $a$, $b$ in $c$ so realna števila, $a$ in $b$ nista hkrati $0$. Premica $y = 2x + 3$ ima splošno obliko $2x - y + 3 = 0$.

Nazaj pridemo tako, da izrazimo $y$. Če je $b \neq 0$, dobimo $k = -\dfrac{a}{b}$ in $n = -\dfrac{c}{b}$.

Če je $b = 0$, ostane npr. $x - 4 = 0$, torej $x = 4$. To je **navpična premica** skozi vse točke z absciso $4$. Eksplicitne oblike nima: ko se premikaš po njej, se $x$ sploh ne spremeni, zato smernega koeficienta ni.

*Hitri preizkus:* koliko je $k$ pri premici $6x + 2y - 1 = 0$? ($k = -\dfrac{6}{2} = -3$.)

**3. Odsekovna oblika.** Premica $2x + 3y = 6$ seka os $x$ pri $x = 3$ (vstavi $y = 0$) in os $y$ pri $y = 2$ (vstavi $x = 0$). Ti števili sta **odseka** na oseh. Če enačbo delimo s $6$, dobimo $\dfrac{x}{3} + \dfrac{y}{2} = 1$. Splošno:

$$\frac{x}{m} + \frac{y}{n} = 1$$

To je **odsekovna oblika**: $m$ je odsek na osi $x$, $n$ odsek na osi $y$. Na desni mora stati $1$. Premica skozi izhodišče in premica, vzporedna kateri od osi, te oblike nimata.

*Hitri preizkus:* kje seka osi premica $\dfrac{x}{-5} + \dfrac{y}{4} = 1$? (V točkah $(-5, 0)$ in $(0, 4)$.)

**4. Premica skozi točko in skozi dve točki.** Če poznaš smerni koeficient $k$ in eno točko $T(x_1, y_1)$ na premici, zapiši

$$y - y_1 = k(x - x_1)$$

Če vstaviš točko $T$ ($x = x_1$, $y = y_1$), je leva stran $0$ in desna tudi, zato premica res gre skozi $T$. Pri dveh točkah najprej izračunaš $k = \dfrac{y_2 - y_1}{x_2 - x_1}$, nato uporabiš eno od točk. Če je $x_1 = x_2$, je premica navpična: $x = x_1$.

*Hitri preizkus:* katera premica gre skozi $T(1, 4)$ in ima $k = 3$? ($y - 4 = 3(x - 1)$, torej $y = 3x + 1$.)

**5. Vzporednost in pravokotnost.** Vzporedni premici sta enako strmi:

$$k_1 = k_2$$

Pravokotni premici pa imata smerna koeficienta, katerih produkt je $-1$:

$$k_1 \cdot k_2 = -1$$

Premica $y = 2x$ je torej pravokotna na $y = -\dfrac{1}{2}x + 4$, ker je $2 \cdot \left(-\dfrac{1}{2}\right) = -1$. Izjema: navpična premica $x = \text{konst.}$ je pravokotna na vsako vodoravno premico $y = n$.

:::premisli
Premica ima $k = 3$. Napovej smerni koeficient pravokotnice nanjo, preden pogledaš. Zakaj ni $-3$?
---
$k_2 = -\dfrac{1}{3}$, saj $3 \cdot \left(-\dfrac{1}{3}\right) = -1$. Pri $-3$ bi bil produkt $-9$: premica bi le padala enako strmo, kot prva narašča, pravega kota pa ne bi bilo.
:::

**6. Naklonski kot.** Kot $\alpha$, ki ga premica oklepa s pozitivnim delom osi $x$, je **naklonski kot**; velja $0^\circ \le \alpha < 180^\circ$. Pri naraščajoči premici je oster, pri padajoči top.

Pri $k = \dfrac{3}{4}$ greš od točke na premici $4$ enote v desno in $3$ enote navzgor. Nastane pravokotni trikotnik:

:::risba graf
opis: Premica y = 3/4 x skozi izhodišče. Črtkani pravokotni trikotnik ima vodoravno kateto od (0, 0) do (4, 0), dolgo 4, in navpično kateto od (4, 0) do (4, 3), dolgo 3. Pri izhodišču je naklonski kot α.
x: -1 .. 5 | 1 | x
y: -1 .. 4 | 1 | y
enako: da
f: 3/4*x | modra | -1 .. 5
črta: 0; 0 -> 4; 0 -> 4; 3 | oranžna črtkano
pravikot: 4; 0 | 0; 0 | 4; 3
napis: 2; 0 | 4 | pod
napis: 4; 1,5 | 3 | desno
napis: 0,9; 0,3 | α | desno
:::

Kateto nasproti kota $\alpha$ (dvig) delimo s kateto ob kotu $\alpha$ (pomik). To razmerje imenujemo **tangens** kota: $\tan\alpha = \dfrac{3}{4}$. Pri večjem trikotniku z enakim kotom se obe kateti povečata v istem razmerju, zato je tangens odvisen le od kota. In to razmerje je ravno smerni koeficient:

$$k = \tan\alpha$$

Kot iz $k$ dobiš na računalu s tipko $\tan^{-1}$ (pogosto SHIFT in tan). Računalo mora biti nastavljeno na stopinje (DEG). Tu: $\alpha = \tan^{-1} 0{,}75 \approx 36{,}87^\circ$. Pri $k < 0$ računalo vrne negativen kot; naklonski kot je takrat $180^\circ$ minus kot, ki ga dobiš za $|k|$ (npr. pri $k = -1$ je $\alpha = 180^\circ - 45^\circ = 135^\circ$).

Nekaj vrednosti velja zapomniti (dobimo jih iz enakokrakega pravokotnega trikotnika in iz polovice enakostraničnega trikotnika). Pri $k = 1$ sta dvig in pomik enaka, trikotnik je enakokrak in zato $\alpha = 45^\circ$:

| $k$ | $\alpha$ |
|---|---|
| $0$ | $0^\circ$ |
| $\frac{\sqrt{3}}{3}$ | $30^\circ$ |
| $1$ | $45^\circ$ |
| $\sqrt{3}$ | $60^\circ$ |
| $-1$ | $135^\circ$ |

*Hitri preizkus:* cesta z vzponom $12\,\%$ ima $k = 0{,}12$. Koliko stopinj je to? ($\tan^{-1} 0{,}12 \approx 6{,}84^\circ$; klančina v garažo ima $k = \dfrac{0{,}6}{4} = 0{,}15$ in $\alpha \approx 8{,}53^\circ$, torej je bolj strma.)

**7. Kot med premicama.** Premici, ki se sekata, oklepata dva para kotov. **Kot med premicama** $\varphi$ je manjši od njiju, zato $0^\circ \le \varphi \le 90^\circ$. Izračunamo ga iz smernih koeficientov:

$$\tan\varphi = \left|\frac{k_2 - k_1}{1 + k_1 k_2}\right|$$

Za $y = 2x$ in $y = -x + 1$: $\tan\varphi = \left|\dfrac{-1 - 2}{1 + 2 \cdot (-1)}\right| = 3$, zato $\varphi \approx 71{,}57^\circ$. Enako dobiš iz naklonskih kotov: $\alpha_1 \approx 63{,}43^\circ$, $\alpha_2 = 135^\circ$, razlika je $71{,}57^\circ$. Če bi bila razlika večja od $90^\circ$, bi jo odšteli od $180^\circ$.

Posebni primeri:

- vzporedni premici ($k_1 = k_2$): $\varphi = 0^\circ$;
- pravokotni premici ($1 + k_1 k_2 = 0$): ulomek ni definiran, $\varphi = 90^\circ$;
- ena premica je navpična: formule ne moremo uporabiti; navpična premica ima naklonski kot $90^\circ$, zato je $\varphi = |90^\circ - \alpha|$.

:::premisli
Zakaj je v formuli za $\tan\varphi$ absolutna vrednost? Kaj bi dobil brez nje, če bi premici zamenjal?
---
Brez nje bi zamenjava $k_1$ in $k_2$ spremenila predznak ulomka, kot pa je med premicama vedno isti. Absolutna vrednost poskrbi, da dobimo pozitiven tangens, torej oster kot med $0^\circ$ in $90^\circ$.
:::

V simulaciji spodaj (»Premica skozi dve točki«) premikaj eno od točk tako, da sta točki na isti navpičnici. Opazi, da smerni koeficient izgine in enačba postane oblike $x = \text{konst.}$

## Rešeni primeri

### Primer 1: iz splošne v druge oblike

Premica ima enačbo $3x - 4y + 12 = 0$. Zapiši jo v eksplicitni in odsekovni obliki. Koliko sta $k$ in $n$ ter kje premica seka osi?

**Podatki:** $3x - 4y + 12 = 0$, torej $a = 3$, $b = -4$, $c = 12$
**Iščemo:** eksplicitno obliko, odsekovno obliko, $k$, $n$, odseka

:::formula
$y = kx + n$ in $\dfrac{x}{m} + \dfrac{y}{n} = 1$
:::

**Rešitev:**

1. Izrazimo $y$: $4y = 3x + 12$, zato $y = \dfrac{3}{4}x + 3$. Torej $k = \dfrac{3}{4}$, $n = 3$.
2. Za odsekovno obliko prenesemo prosti člen na desno: $3x - 4y = -12$.
3. Delimo z $-12$, da je na desni $1$: $\dfrac{x}{-4} + \dfrac{y}{3} = 1$.
4. Preizkus: pri $y = 0$ iz prvotne enačbe dobimo $3x + 12 = 0$, torej $x = -4$.
5. Odgovor: $y = \dfrac{3}{4}x + 3$ in $\dfrac{x}{-4} + \dfrac{y}{3} = 1$; premica seka os $x$ v $(-4, 0)$ in os $y$ v $(0, 3)$.

### Primer 2: skozi dve točki in pravokotnica

Premica $p$ gre skozi točki $A(-1, 2)$ in $B(3, 10)$. Zapiši enačbo premice $p$ in enačbo premice $q$, ki gre skozi $A$ in je pravokotna na $p$. Premico $q$ zapiši v splošni obliki.

**Podatki:** $A(-1, 2)$, $B(3, 10)$, $q \perp p$, $A$ leži na $q$
**Iščemo:** enačbo premice $p$ in splošno obliko premice $q$

:::formula
$k = \dfrac{y_2 - y_1}{x_2 - x_1}$, $y - y_1 = k(x - x_1)$, $k_1 \cdot k_2 = -1$
:::

**Rešitev:**

1. Smerni koeficient premice $p$: $k_1 = \dfrac{10 - 2}{3 - (-1)} = \dfrac{8}{4} = 2$.
2. Skozi $A$: $y - 2 = 2(x + 1)$, torej $p\colon y = 2x + 4$. Preizkus z $B$: $2 \cdot 3 + 4 = 10$.
3. Pravokotnica ima $k_2 = -\dfrac{1}{2}$, ker mora biti $2 \cdot k_2 = -1$.
4. Skozi $A$: $y - 2 = -\dfrac{1}{2}(x + 1)$. Pomnožimo z $2$: $2y - 4 = -x - 1$.
5. Vse prenesemo na levo: $x + 2y - 3 = 0$. Preizkus z $A$: $-1 + 4 - 3 = 0$.
6. Odgovor: $p\colon y = 2x + 4$, $q\colon x + 2y - 3 = 0$.

### Primer 3: kot pri slemenu strehe

Tesar nariše prečni prerez strehe v koordinatnem sistemu z enoto $1\,\text{m}$. Leva strešina gre od $(0, 0)$ do slemena $(4, 3)$, desna od slemena do $(10, 0)$. Zapiši enačbi strešin, izračunaj kot med premicama in kot, ki ga strešini oklepata pri slemenu.

**Podatki:** $O(0, 0)$, sleme $S(4, 3)$, $D(10, 0)$, enota $1\,\text{m}$
**Iščemo:** enačbi strešin, kot med premicama $\varphi$, kot pri slemenu

:::formula
$\tan\varphi = \left|\dfrac{k_2 - k_1}{1 + k_1 k_2}\right|$, $k = \tan\alpha$
:::

**Rešitev:**

1. Leva strešina: $k_1 = \dfrac{3}{4} = 0{,}75$ in gre skozi izhodišče, zato $y = 0{,}75x$.
2. Desna strešina: $k_2 = \dfrac{0 - 3}{10 - 4} = -0{,}5$; skozi $S$: $y - 3 = -0{,}5(x - 4)$, torej $y = -0{,}5x + 5$.
3. $\tan\varphi = \left|\dfrac{-0{,}5 - 0{,}75}{1 + 0{,}75 \cdot (-0{,}5)}\right| = \dfrac{1{,}25}{0{,}625} = 2$, zato $\varphi \approx 63{,}43^\circ$.
4. Formula da oster kot. Pri slemenu pa je streha »odprta« navzdol in kot je top: sokot, $180^\circ - 63{,}43^\circ = 116{,}57^\circ$.
5. Preizkus z naklonskima kotoma: $\alpha_1 = \tan^{-1} 0{,}75 \approx 36{,}87^\circ$, desna strešina pada pod kotom $\tan^{-1} 0{,}5 \approx 26{,}57^\circ$; to sta kota trikotnika ob tleh, zato je po vsoti kotov v trikotniku kot pri slemenu $180^\circ - 36{,}87^\circ - 26{,}57^\circ = 116{,}56^\circ$ (razlika v zadnji decimalki je zaradi zaokroževanja).
6. Odgovor: strešini ležita na $y = 0{,}75x$ in $y = -0{,}5x + 5$; kot med premicama je približno $63{,}43^\circ$, pri slemenu pa strešini oklepata približno $116{,}57^\circ$.

### Primer 4: zdaj ti

Mizar pritrdi poševno oporo pod polico. Na skici (enota $1\,\text{dm}$) je stena os $y$, opora pa gre od $(0, 0)$ do $(3, 4)$. Kolikšen kot oklepa opora s steno?

**Podatki:** stena $x = 0$, opora od $(0, 0)$ do $(3, 4)$, enota $1\,\text{dm}$
**Iščemo:** kot $\varphi$ med oporo in steno

:::formula
$k = \tan\alpha$; pri navpični premici $\varphi = |90^\circ - \alpha|$
:::

**Rešitev:**

1. Stena je navpična premica $x = 0$, zato formule s $k_1$ in $k_2$ ne moremo uporabiti.
2. Opora: $k = \dfrac{4}{3}$.
3. Izračunaj naklonski kot opore in nato kot s steno.

:::premisli
Koliko sta $\alpha$ in $\varphi$?
---
$\alpha = \tan^{-1} \dfrac{4}{3} \approx 53{,}13^\circ$, zato $\varphi = 90^\circ - 53{,}13^\circ = 36{,}87^\circ$. Opora oklepa s steno približno $36{,}87^\circ$.
:::

## Pogoste napake

- **Smerni koeficient iz splošne oblike brez minusa.** »Pri $3x - 4y + 12 = 0$ je $k = 3$.« Število ob $x$ je $a$, ne $k$; $y$ še ni izražen. Popravek: izrazi $y$ ali uporabi $k = -\dfrac{a}{b}$; tu $k = \dfrac{3}{4}$.
- **Odsekovna oblika brez deljenja.** »$2x + 3y = 6$ je $\dfrac{x}{2} + \dfrac{y}{3} = 1$.« Koeficienta nista odseka. Odseka dobiš z vstavljanjem $y = 0$ in $x = 0$ ali z deljenjem z desno stranjo: $\dfrac{x}{3} + \dfrac{y}{2} = 1$.
- **Pravokotnica z napačnim $k$.** »Pravokotnica na $k = 2$ ima $k = -2$« (ali $\dfrac{1}{2}$). Popravek: vzemi obratno vrednost in spremeni predznak, $k_2 = -\dfrac{1}{k_1}$; preveri, da je $k_1 k_2 = -1$.
- **Računalo v radianih ali obrnjeno razmerje.** $\tan^{-1} 0{,}08$ v načinu RAD da $0{,}08$, ne $4{,}57^\circ$. Kdor deli pomik z dvigom, dobi kot, ki pravega dopolni do $90^\circ$. Popravek: način DEG, $k$ je vedno dvig deljeno s pomikom.
- **Kot med premicama kot vsota ali prevelika razlika.** Naklonskih kotov ne seštevamo, razlika nad $90^\circ$ pa še ni kot med premicama. Popravek: vzemi $|\alpha_2 - \alpha_1|$, in če je več kot $90^\circ$, $180^\circ$ minus to.

## Povzetek

- Eksplicitna oblika $y = kx + n$; splošna $ax + by + c = 0$ (pri $b \neq 0$ je $k = -\frac{a}{b}$, pri $b = 0$ navpična premica $x = \text{konst.}$ brez $k$); odsekovna $\frac{x}{m} + \frac{y}{n} = 1$ ($m$, $n$ odseka na oseh).
- Premica skozi točko: $y - y_1 = k(x - x_1)$; skozi dve točki najprej $k = \frac{y_2 - y_1}{x_2 - x_1}$.
- Vzporedni premici: $k_1 = k_2$; pravokotni: $k_1 \cdot k_2 = -1$.
- Naklonski kot: $k = \tan\alpha$, $0^\circ \le \alpha < 180^\circ$; na računalu $\tan^{-1}$ v stopinjah (DEG).
- Kot med premicama: $\tan\varphi = \left|\frac{k_2 - k_1}{1 + k_1 k_2}\right|$, $0^\circ \le \varphi \le 90^\circ$; pri navpični premici uporabi naklonska kota.

## Drugače: Na sliki

Streha iz Primera 3 na sliki:

:::risba graf
opis: Prečni prerez strehe. Leva strešina gre od (0, 0) do slemena S (4, 3), desna od S do (10, 0). Pri slemenu je topi kot 116,57°. Siva črtkana črta podaljša levo strešino čez sleme; med podaljškom in desno strešino je ostri kot 63,43°.
x: 0 .. 10 | 1 | x (m)
y: 0 .. 4 | 1 | y (m)
enako: da
črta: 0; 0 -> 4; 3 -> 10; 0 | modra debelo
črta: 4; 3 -> 5,2; 3,9 | siva črtkano
točka: 4; 3 | S | levo
napis: 4; 2,6 | 116,57° | pod
napis: 5,2; 3,3 | 63,43° | desno
:::

Ko se dve premici sekata, nastanejo štirje koti: dva enaka topa in dva enaka ostra. Ostri in topi kot se dopolnjujeta do $180^\circ$. Formula za $\tan\varphi$ vedno vrne ostrega (podaljšek leve strešine in desna strešina). Katerega od obeh potrebuješ, pove šele slika: tesar pri slemenu meri topega.

Smerni koeficient na sliki vidiš kot stopnico: $1$ v desno in $k$ navzgor. Pri levi strešini je stopnica $1$ v desno in $0{,}75$ gor, pri desni $1$ v desno in $0{,}5$ dol.

## Drugače: Bolj natančno

**Zakaj $k_1 k_2 = -1$.** Stopnica premice s smernim koeficientom $k$ je »$1$ desno, $k$ gor«. Če jo zavrtiš za $90^\circ$, postane »$k$ levo, $1$ gor«. Nova premica ima torej smerni koeficient $\dfrac{1}{-k} = -\dfrac{1}{k}$, in res je $k \cdot \left(-\dfrac{1}{k}\right) = -1$.

**Od kod formula za kot.** Kot med premicama je razlika naklonskih kotov, $\varphi = |\alpha_2 - \alpha_1|$ (oziroma $180^\circ$ minus to). Iz $\tan\alpha_1 = k_1$ in $\tan\alpha_2 = k_2$ pride formula za $\tan\varphi$ po pravilu za tangens razlike kotov, ki ga spoznaš v 2. letniku pri kotnih funkcijah.

**Katera oblika zajame vse premice.** Samo splošna. Eksplicitna izpusti navpične premice, odsekovna pa še premice skozi izhodišče in vodoravne premice. Zato v nalogah, kjer premica »lahko je karkoli«, raje začni s splošno obliko $ax + by + c = 0$.

## Preveri se

? Z grafa odčitaj, kje premica seka osi. Katera je njena odsekovna oblika?
:::risba graf
opis: Padajoča premica, ki seka os x v točki A (3, 0) in os y v točki B (0, 2).
x: -1 .. 4 | 1 | x
y: -1 .. 3 | 1 | y
enako: da
f: -2/3*x + 2 | modra | -1 .. 4
točka: 3; 0 | A | nad
točka: 0; 2 | B | desno
:::
+ $\dfrac{x}{3} + \dfrac{y}{2} = 1$
- $\dfrac{x}{2} + \dfrac{y}{3} = 1$
~ Odseka si zamenjal: pod $x$ sodi odsek na osi $x$ (točka $A$), pod $y$ odsek na osi $y$.
- $3x + 2y = 1$
~ Odseka nista koeficienta, ampak imenovalca: $\dfrac{x}{m} + \dfrac{y}{n} = 1$.
- $\dfrac{x}{3} - \dfrac{y}{2} = 1$
~ Ta premica bi sekala os $y$ pri $-2$, a na grafu je $B$ nad osjo $x$.
> Odseka sta $m = 3$ in $n = 2$, zato $\dfrac{x}{3} + \dfrac{y}{2} = 1$.

? Zakaj formule $\tan\varphi = \left|\dfrac{k_2 - k_1}{1 + k_1 k_2}\right|$ ne moremo uporabiti za premici $y = 2x$ in $y = -\dfrac{1}{2}x + 3$?
- Ker sta premici vzporedni, zato se ne sekata.
~ Vzporedni bi bili pri $k_1 = k_2$. Tu je $k_1 \cdot k_2 = -1$, kar je pogoj za pravokotnost.
+ Ker je $1 + k_1 k_2 = 0$: premici sta pravokotni in $\varphi = 90^\circ$.
- Ker ima ena od premic negativen smerni koeficient.
~ Negativen $k$ v formuli ni težava, zato je tam absolutna vrednost.
> $1 + 2 \cdot \left(-\dfrac{1}{2}\right) = 0$, z $0$ ne delimo. Tangens kota $90^\circ$ ne obstaja, premici pa sta pravokotni.

? Klančina za voziček se na $5\,\text{m}$ vodoravne razdalje dvigne za $40\,\text{cm}$. Izračunaj njen naklonski kot v stopinjah, zaokrožen na dve decimalki.
= 4,57 ° | 0,05
~ 0,08 | To je smerni koeficient, ne kot; ali pa je bilo računalo v radianih. Uporabi $\tan^{-1}$ v načinu DEG.
~ 85,43 | Delil si pomik z dvigom. Smerni koeficient je dvig deljeno s pomikom.
~ 82,87 | Centimetrov nisi pretvoril v metre: $\dfrac{40}{5} = 8$ ni pravi $k$.
> $k = \dfrac{0{,}4\,\text{m}}{5\,\text{m}} = 0{,}08$, $\alpha = \tan^{-1} 0{,}08 \approx 4{,}57^\circ$.

? Za katero vrednost $a$ je premica $ax + 2y - 6 = 0$ vzporedna premici $y = 3x + 1$?
- $a = 6$
~ Pozabil si minus: iz $2y = -ax + 6$ sledi $k = -\dfrac{a}{2}$.
+ $a = -6$
- $a = -\dfrac{2}{3}$
~ To bi dobil, če bi bil $k = -\dfrac{2}{a}$; ulomek je obrnjen.
- $a = \dfrac{2}{3}$
~ To je pogoj za pravokotnost ($k = -\dfrac{1}{3}$), vzporedni premici pa imata enaka $k$.
> $k = -\dfrac{a}{2} = 3$, torej $a = -6$. Premica je $-6x + 2y - 6 = 0$ oziroma $y = 3x + 3$.

? (brez računala) Mizar ima na skici dve letvi, ki ležita na premicah $y = x$ in $y = \sqrt{3}\,x$. Kolikšen kot v stopinjah oklepata letvi? Uporabi tabelo naklonskih kotov iz razlage.
= 15 °
~ 105 | Naklonska kota si seštel. Kot med premicama je razlika.
~ 75 | To je $180^\circ - 105^\circ$; najprej si kota napačno seštel.
~ 60 | To je samo naklonski kot druge letve.
> $\alpha_1 = 45^\circ$ ($k = 1$), $\alpha_2 = 60^\circ$ ($k = \sqrt{3}$), zato $\varphi = 60^\circ - 45^\circ = 15^\circ$.

<<RACUN
resi: 3*x-4*y+12=0 | y | 3*x/4+3
resi: 3*x+12=0 | x | -4
vrednost: (10-2)/(3-(-1)) | 2
resi: y-2=-(x+1)/2 | y | -x/2+3/2
resi: y=0.75*x, y=-0.5*x+5 | x, y | x=4, y=3
vrednost: abs((-0.5-0.75)/(1+0.75*(-0.5))) | 2
vrednost: atan(2)*180/pi | 63.43
vrednost: 180-atan(2)*180/pi | 116.57
vrednost: atan(0.75)*180/pi | 36.87
vrednost: atan(0.5)*180/pi | 26.57
vrednost: atan(4/3)*180/pi | 53.13
vrednost: 90-atan(4/3)*180/pi | 36.87
vrednost: atan(0.12)*180/pi | 6.84
vrednost: atan(0.15)*180/pi | 8.53
vrednost: atan(3)*180/pi | 71.57
vrednost: atan(0.08)*180/pi | 4.57
resi: -a/2=3 | a | -6
vrednost: atan(sqrt(3))*180/pi-atan(1)*180/pi | 15
>>

:::simboli
x, y | koordinati točke na premici | | 
k | smerni koeficient | k = \tan\alpha | | dvig pri pomiku za $1$ v desno
n | začetna vrednost oz. odsek na osi $y$ | | | 
a, b, c | koeficienta in prosti člen splošne oblike | | | $a$ in $b$ nista oba $0$
m | odsek na osi $x$ | | | 
x_1, y_1 | koordinati dane točke $T$ | | | 
x_2, y_2 | koordinati druge točke | | | 
k_1, k_2 | smerna koeficienta prve in druge premice | | | 
\alpha | naklonski kot | \tan\alpha = k | ° | $0^\circ \le \alpha < 180^\circ$
\varphi | kot med premicama | | ° | $0^\circ \le \varphi \le 90^\circ$
\alpha_1, \alpha_2 | naklonska kota prve in druge premice | | ° | 
:::
