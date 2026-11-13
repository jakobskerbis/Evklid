---
stanje: preverjeno
demo: kompleksna
avtor: AI
---

## Zakaj se tega učimo

Nika je na planinskem taboru dobila zemljevid in listek: »Od tabora pojdi naravnost do točke, ki je $3\,\text{km}$ vzhodno in $4\,\text{km}$ severno. Tam se obrni za pravi kot v levo in prehodi enako dolgo pot v novi smeri. Tam je zaklad.« Preden se odpravi, bi rada vedela, kje bo končala in koliko je od tam zračne črte do tabora.

Na zemljevidu ima vsaka točka dve koordinati, vzhod–zahod in sever–jug. Če par zapišemo kot eno samo število, postanejo premiki, zasuki in razdalje navadni računi. Za to pa potrebujemo število, ki ga med realnimi ni. Pri korenih si videl, da nobeno realno število na kvadrat ne da $-1$. Izkazalo se bo, da zasuk za pravi kot opišemo z množenjem s takim številom. Tako nastanejo **kompleksna števila**. Z njimi elektrotehniki računajo izmenični tok, inženirji pa obdelujejo zvok in sliko. Nikin zaklad poiščemo v primeru 3.

## Razlaga

**1. Zemljevid kot ravnina števil.** Številsko premico že poznaš: pozitivna števila so desno od $0$, negativna levo. Položi jo na zemljevid tako, da kaže proti vzhodu, ničla pa je v taboru. Skozi tabor nariši še navpično premico proti severu. Točko, ki je $3$ enote vzhodno in $4$ severno, zapišemo kot eno število $3 + 4i$. Črka $i$ pove, da štejemo $4$ v smeri proti severu.

| točka na zemljevidu | število |
|---|---|
| $3$ vzhodno, $4$ severno | $3 + 4i$ |
| $2$ zahodno, $1$ južno | $-2 - i$ |
| $5$ vzhodno, na vodoravni osi | $5$ |
| $3$ severno, na navpični osi | $3i$ |

Zdaj isto s simboli. **Kompleksno število** je $z = a + bi$, kjer sta $a$ in $b$ realni števili. Število $a$ je **realni del** ($\mathrm{Re}\,z = a$), $b$ pa **imaginarni del** ($\mathrm{Im}\,z = b$). Pozor: imaginarni del je realno število $b$, ne $bi$. Vodoravna os je **realna os**, navpična **imaginarna os**, vsa ravnina pa **kompleksna** ali **Gaussova ravnina**. Množico kompleksnih števil označimo z $\mathbb{C}$.

- Pri $b = 0$ je $z = a$ realno število na realni osi. Zato je $\mathbb{R} \subset \mathbb{C}$.
- Pri $a = 0$ in $b \ne 0$ je $z = bi$ **čisto imaginarno** število, na primer $3i$.
- Števili sta **enaki**, če pomenita isto točko: $a + bi = c + di$ natanko tedaj, ko je $a = c$ in $b = d$.

**2. Zasuk v levo je množenje z $i$.** Stoj v taboru in glej proti točki $1$, to je proti vzhodu. Zasuk za pravi kot v levo te obrne proti severu, k točki $i$. Dogovorimo se, da tak zasuk zapišemo kot množenje s številom $i$: $1 \cdot i = i$. Še en zasuk v levo te obrne proti zahodu, k točki $-1$. Dva zasuka sta $i \cdot i$, rezultat pa je $-1$:

$$i^2 = -1$$

Število $i$ imenujemo **imaginarna enota**. Ni realno, saj je kvadrat vsakega realnega števila nenegativen. Po štirih zasukih spet gledaš proti vzhodu, zato se potence števila $i$ ponavljajo s periodo $4$:

| ostanek $n$ pri deljenju s $4$ | $i^n$ | smer |
|---|---|---|
| $0$ | $1$ | vzhod |
| $1$ | $i$ | sever |
| $2$ | $-1$ | zahod |
| $3$ | $-i$ | jug |

:::premisli
Nika začne gledati proti vzhodu in se $27$-krat zasuka v levo. Kam gleda na koncu? Koliko je torej $i^{27}$?
---
Proti jugu. Ker je $27 = 6 \cdot 4 + 3$, šest polnih krogov ničesar ne spremeni, ostanejo trije zasuki. Zato je $i^{27} = i^{24} \cdot i^3 = 1 \cdot (-i) = -i$.
:::

**3. Seštevanje je premik za premikom.** Greš najprej za $3 + 4i$, nato za $-1 + 2i$ ($1$ zahodno in $2$ severno). Končaš v točki $2 + 6i$. Na sliki puščico drugega premika prestaviš na konec prve. Računsko posebej seštejemo realna in posebej imaginarna dela:

$$(a + bi) \pm (c + di) = (a \pm c) + (b \pm d)\,i$$

**4. Množenje.** Ker je $i$ število, množimo kot dvočlenika, vsak člen z vsakim, nato $i^2$ zamenjamo z $-1$:

$$(a + bi)(c + di) = (ac - bd) + (ad + bc)\,i$$

Formule si ni treba zapomniti, dovolj je množiti kot dvočlenika. Primer: $i(3 + 4i) = 3i + 4i^2 = -4 + 3i$. Točka $3 + 4i$ se je zasukala za pravi kot v levo, nasproti urinemu kazalcu.

**5. Konjugirano število je zrcalna slika.** Zrcali točko čez realno os, to je čez os vzhod–zahod. Iz $3 + 4i$ dobiš $3 - 4i$. To je **konjugirano število**:

$$\bar{z} = a - bi$$

Spremeni se samo predznak imaginarnega dela: $\overline{3 + 2i} = 3 - 2i$, $\overline{-4i} = 4i$, $\overline{5} = 5$. Velja $z + \bar{z} = 2a$. Pri produktu se mešana člena $-abi$ in $+abi$ odštejeta:

$$z \cdot \bar{z} = (a + bi)(a - bi) = a^2 - b^2 i^2$$

$$z \cdot \bar{z} = a^2 + b^2$$

Produkt števila s konjugiranim je zato vedno realen in nenegativen.

**6. Absolutna vrednost je zračna razdalja.** Točka $a + bi$, izhodišče in točka $a$ na realni osi tvorijo pravokotni trikotnik s katetama $|a|$ in $|b|$. Razdalja točke od izhodišča je hipotenuza. Imenujemo jo **absolutna vrednost** in jo izračunamo po Pitagorovem izreku:

$$|z| = \sqrt{a^2 + b^2}$$

Na primer $|3 - 4i| = \sqrt{9 + 16} = 5$. Za realno število se ujema z znano absolutno vrednostjo: $|-7| = \sqrt{49} = 7$. Ker je $a^2 + b^2 = z \cdot \bar{z}$, velja tudi $|z| = \sqrt{z \cdot \bar{z}}$. Zrcaljenje razdalje ne spremeni, zato je $|\bar{z}| = |z|$. Velja še $|z_1 \cdot z_2| = |z_1| \cdot |z_2|$ in $\left|\dfrac{z_1}{z_2}\right| = \dfrac{|z_1|}{|z_2|}$.

:::premisli
Ali je $|3 + 4i|$ enako $|3| + |4i|$? Najprej napovej, nato izračunaj in razloži s sliko.
---
Ni. $|3| + |4i| = 3 + 4 = 7$, $|3 + 4i| = 5$. Pot $3$ proti vzhodu in nato $4$ proti severu je ovinek po katetah. Zračna črta je hipotenuza in je krajša. Absolutna vrednost vsote v splošnem ni vsota absolutnih vrednosti.
:::

**7. Deljenje.** Ulomek razširimo s številom, konjugiranim **imenovalcu**. Imenovalec postane realen, $c^2 + d^2$, nato ulomek razdelimo na realni in imaginarni del (za $c + di \ne 0$):

$$\frac{a + bi}{c + di} = \frac{(a + bi)(c - di)}{c^2 + d^2}$$

To je isti postopek kot racionalizacija imenovalca s konjugiranim izrazom pri korenih.

V simulaciji spodaj (»Kompleksna števila v ravnini«) izberi množenje in točko $w$ postavi v $(0, 1)$, torej $w = i$. Premikaj točko $z$ in opazuj: $z \cdot w$ je vedno $z$, zasukan za pravi kot v levo, z enako absolutno vrednostjo. Nato izberi $\bar{z}$ in poglej zrcaljenje čez realno os.

## Rešeni primeri

### Primer 1 (lažji)

Dani sta števili $z_1 = 3 + 2i$ in $z_2 = 1 - 4i$. Izračunaj $z_1 + z_2$, $z_1 - z_2$ in $z_1 \cdot z_2$.

**Podatki:** $z_1 = 3 + 2i$, $z_2 = 1 - 4i$
**Iščemo:** vsoto $z_1 + z_2$, razliko $z_1 - z_2$ in produkt $z_1 \cdot z_2$

:::formula
$(a + bi) \pm (c + di) = (a \pm c) + (b \pm d)i$; množimo kot dvočlenika in upoštevamo $i^2 = -1$
:::

**Rešitev:**

1. Vsota: $(3 + 2i) + (1 - 4i) = (3 + 1) + (2 - 4)i = 4 - 2i$.
2. Razlika: $(3 + 2i) - (1 - 4i) = (3 - 1) + (2 + 4)i = 2 + 6i$.
3. Produkt: $(3 + 2i)(1 - 4i) = 3 - 12i + 2i - 8i^2 = 3 - 10i + 8 = 11 - 10i$.
4. Odgovor: $z_1 + z_2 = 4 - 2i$, $z_1 - z_2 = 2 + 6i$ in $z_1 \cdot z_2 = 11 - 10i$.

### Primer 2 (srednji)

Izračunaj količnik $w = \dfrac{1 + 8i}{2 + i}$ in nato njegovo absolutno vrednost $|w|$.

**Podatki:** števec $1 + 8i$, imenovalec $2 + i$
**Iščemo:** količnik $w$ v obliki $a + bi$ in $|w|$

:::formula
$\dfrac{z_1}{z_2} = \dfrac{z_1 \cdot \bar{z}_2}{z_2 \cdot \bar{z}_2}$, $\;(c + di)(c - di) = c^2 + d^2$, $\;|a + bi| = \sqrt{a^2 + b^2}$
:::

**Rešitev:**

1. Imenovalcu konjugirano število je $2 - i$. Ulomek razširimo z njim.
2. Imenovalec: $(2 + i)(2 - i) = 2^2 + 1^2 = 5$.
3. Števec: $(1 + 8i)(2 - i) = 2 - i + 16i - 8i^2 = 2 + 15i + 8 = 10 + 15i$.
4. Količnik: $w = \dfrac{10 + 15i}{5} = 2 + 3i$.
5. Preverjanje: $(2 + 3i)(2 + i) = 4 + 2i + 6i + 3i^2 = 1 + 8i$. Ujema se.
6. Absolutna vrednost: $|w| = \sqrt{2^2 + 3^2} = \sqrt{13} \approx 3{,}61$. Drugače: $\dfrac{|1 + 8i|}{|2 + i|} = \dfrac{\sqrt{65}}{\sqrt{5}} = \sqrt{13}$.
7. Odgovor: $w = 2 + 3i$ in $|w| = \sqrt{13}$.

### Primer 3 (težji): Nikin zaklad

Nika gre od tabora naravnost do točke, ki je $3\,\text{km}$ vzhodno in $4\,\text{km}$ severno. Tam se obrne za pravi kot v levo in prehodi enako dolgo pot v novi smeri. Kje je zaklad glede na tabor, koliko je do tabora zračne črte in koliko poti je Nika prehodila?

**Podatki:** prvi premik $z_1 = 3 + 4i$ (v km; vzhod je realna, sever imaginarna smer), drugi premik je enako dolg in zasukan za pravi kot v levo
**Iščemo:** lego zaklada $z$, zračno razdaljo $|z|$ in prehojeno pot

:::formula
zasuk za pravi kot v levo: $z_2 = i \cdot z_1$; $\;z = z_1 + z_2$; $\;|z| = \sqrt{a^2 + b^2}$
:::

**Rešitev:**

1. Drugi premik: $z_2 = i(3 + 4i) = 3i + 4i^2 = -4 + 3i$, ker množenje z $i$ zasuka v levo. Nika gre torej $4\,\text{km}$ proti zahodu in $3\,\text{km}$ proti severu.
2. Lega zaklada je vsota premikov: $z = (3 + 4i) + (-4 + 3i) = -1 + 7i$.
3. Zračna razdalja: $|z| = \sqrt{(-1)^2 + 7^2} = \sqrt{50} \approx 7{,}07$, torej približno $7{,}07\,\text{km}$.
4. Vsak premik je dolg $|3 + 4i| = \sqrt{9 + 16} = 5$, pot je zato $5\,\text{km} + 5\,\text{km} = 10\,\text{km}$. To je več od zračne razdalje, kot mora biti pri ovinku.
5. Odgovor: zaklad je $1\,\text{km}$ zahodno in $7\,\text{km}$ severno od tabora, zračne črte do tabora je približno $7{,}07\,\text{km}$, Nika pa je prehodila $10\,\text{km}$.

### Primer 4 – zdaj ti

Poišči kompleksno število $z$, za katero velja $(1 + i)\,z + 3\bar{z} = 10 - i$. Izračunaj še $|z|$.

**Podatki:** enačba $(1 + i)\,z + 3\bar{z} = 10 - i$
**Iščemo:** število $z$ in njegovo absolutno vrednost $|z|$

:::formula
$z = a + bi$, $\;\bar{z} = a - bi$; kompleksni števili sta enaki, ko se ujemata realna in imaginarna dela
:::

**Rešitev:**

1. Pišemo $z = a + bi$, kjer sta $a$ in $b$ realni neznanki. Potem je $\bar{z} = a - bi$.
2. $(1 + i)(a + bi) = a + bi + ai + bi^2 = (a - b) + (a + b)i$.
3. $3\bar{z} = 3a - 3bi$.
4. Vsota leve strani: $(a - b + 3a) + (a + b - 3b)i = (4a - b) + (a - 2b)i$.
5. Izenačimo z desno stranjo $10 - i$, ker sta števili enaki le, če se ujemata oba dela: realna dela $4a - b = 10$, imaginarna dela $a - 2b = -1$.
6. Reši ta sistem dveh linearnih enačb, izračunaj $|z|$ in naredi preizkus.

:::premisli
Kolikšna sta $a$ in $b$, kaj je $z$ in koliko je $|z|$?
---
Iz druge enačbe je $a = 2b - 1$. Vstavimo v prvo: $4(2b - 1) - b = 10$, torej $7b = 14$ in $b = 2$, nato $a = 2 \cdot 2 - 1 = 3$. Torej je $z = 3 + 2i$ in $|z| = \sqrt{3^2 + 2^2} = \sqrt{13} \approx 3{,}61$. Preizkus: $(1 + i)(3 + 2i) = 3 + 2i + 3i - 2 = 1 + 5i$ in $3(3 - 2i) = 9 - 6i$, vsota je $10 - i$.
:::

## Pogoste napake

- **$i^2 = 1$.** Ko množiš, rad pozabiš, da je $i^2 = -1$. Napačno: $(3 + 2i)(1 - 4i) = 3 - 10i - 8$. Pravilno: $-8i^2 = -8 \cdot (-1) = +8$, zato je rezultat $11 - 10i$.
- **Imaginarni del z $i$.** Za $z = 4 - 7i$ je $\mathrm{Im}\,z = -7$, ne $-7i$. Imaginarni del je realno število pred $i$, s predznakom vred.
- **Konjugiranje realnega dela.** $\overline{3 + 2i} = -3 - 2i$ je napačno. Spremeni se samo predznak imaginarnega dela: $\overline{3 + 2i} = 3 - 2i$. Zrcaljenje čez realno os točke ne premakne levo ali desno. Število $-3 - 2i$ je nasprotno število.
- **Absolutna vrednost brez kvadratov ali z $i$.** Napačno: $|3 - 4i| = 3 - 4 = -1$ ali $\sqrt{3^2 + (-4i)^2} = \sqrt{9 - 16}$, kar ni niti realno. V formulo vstaviš realni števili $a = 3$ in $b = -4$, oba kvadrata sta pozitivna: $|3 - 4i| = \sqrt{3^2 + (-4)^2} = 5$. Absolutna vrednost je razdalja, zato nikoli ni negativna.
- **Pravilo za korene pri negativnih številih.** »$i^2 = \sqrt{-1} \cdot \sqrt{-1} = \sqrt{(-1)(-1)} = \sqrt{1} = 1$« je napačen sklep. Pravilo $\sqrt{a}\sqrt{b} = \sqrt{ab}$ velja le za $a, b \ge 0$. Raje računaj z $i$ in upoštevaj $i^2 = -1$.

## Povzetek

- Imaginarna enota: $i^2 = -1$; kompleksno število $z = a + bi$, $\mathrm{Re}\,z = a$, $\mathrm{Im}\,z = b$ ($a, b \in \mathbb{R}$).
- Kompleksno število $a + bi$ je točka $(a, b)$ v kompleksni ravnini: realna os vodoravno, imaginarna navpično.
- Seštevamo in odštevamo ločeno realna in imaginarna dela (premik za premikom); množimo kot dvočlenika in upoštevamo $i^2 = -1$. Množenje z $i$ zasuka točko za pravi kot v levo.
- Potence $i$ se ponavljajo s periodo $4$: $i, -1, -i, 1$.
- Konjugirano število $\bar{z} = a - bi$ je zrcalna slika čez realno os; $z \cdot \bar{z} = a^2 + b^2$.
- Deljenje: ulomek razširimo s številom, konjugiranim imenovalcu.
- Absolutna vrednost: $|z| = \sqrt{a^2 + b^2}$ je razdalja točke $(a, b)$ od izhodišča v kompleksni ravnini.
- Enakost: $a + bi = c + di$ natanko tedaj, ko je $a = c$ in $b = d$.

## Drugače: Z analogijo

Pri korenih si računal z izrazi, kot je $3 + 2\sqrt{5}$. S $\sqrt{5}$ si ravnal kot s črko in šele na koncu upošteval $\left(\sqrt{5}\right)^2 = 5$. S številom $i$ ravnaš enako, le pravilo je $i^2 = -1$.

- **Seštevanje.** Kot $(1 + 2\sqrt{5}) + (3 - \sqrt{5}) = 4 + \sqrt{5}$ velja tudi $(1 + 2i) + (3 - i) = 4 + i$. Združiš istovrstne člene.
- **Konjugirani par.** $(3 + \sqrt{5})(3 - \sqrt{5}) = 9 - 5 = 4$ in $(3 + i)(3 - i) = 9 - i^2 = 10$. Mešana člena se v obeh primerih odštejeta, ostane število brez korena oziroma brez $i$.
- **Deljenje.** Pri korenih razširiš s konjugiranim izrazom, da iz imenovalca izgine koren. Pri kompleksnih številih razširiš s številom, konjugiranim imenovalcu, da iz imenovalca izgine $i$.

Kje analogija neha veljati: $\sqrt{5}$ je realno število in leži na številski premici med $2$ in $3$. Število $i$ na premici nima mesta, ker je njegov kvadrat negativen. Zato dobi svojo, imaginarno os.

## Drugače: Iz vsakdanjega življenja

**Letalo in veter.** Letalo leti s hitrostjo $400\,\text{km/h}$ proti vzhodu, veter pa ga nosi s hitrostjo $30\,\text{km/h}$ proti severu. Hitrosti se seštejeta kot kompleksni števili: $400 + 30i$. Glede na tla letalo zato potuje malo severno od vzhoda s hitrostjo $\sqrt{400^2 + 30^2}\,\text{km/h} \approx 401\,\text{km/h}$, to je z absolutno vrednostjo vsote.

**Izmenični tok.** Pri izmeničnem toku ima porabnik **impedanco**, ki jo elektrotehniki zapišejo kot kompleksno število: realni del je navadni upor, imaginarni del pa opisuje vpliv tuljav in kondenzatorjev. Ker črko $i$ uporabljajo za tok, imaginarno enoto pišejo z $j$. Za upor $30\,\Omega$ in imaginarni del $40\,\Omega$ je velikost impedance $\sqrt{30^2 + 40^2}\,\Omega = 50\,\Omega$, torej ravno absolutna vrednost.

## Drugače: Bolj natančno

Kompleksno število lahko strogo definiramo kot **urejeni par** realnih števil $(a, b)$, kjer seštevamo po komponentah, množimo pa po pravilu

$$(a, b) \cdot (c, d) = (ac - bd,\ ad + bc).$$

Pari oblike $(a, 0)$ se obnašajo natanko kot realna števila, par $(0, 1)$ pa označimo z $i$. Po pravilu je $(0, 1) \cdot (0, 1) = (-1, 0)$, torej $i^2 = -1$. Tako »skrivnostni« $i$ ni nič drugega kot točka $(0, 1)$ in vsa pravila računanja izpeljemo iz definicije.

**Lastnosti konjugiranja.** Z računom preveriš, da velja $\overline{z_1 + z_2} = \bar{z}_1 + \bar{z}_2$ in $\overline{z_1 \cdot z_2} = \bar{z}_1 \cdot \bar{z}_2$. Od tod sledi pravilo za absolutno vrednost produkta: $|z_1 z_2|^2 = z_1 z_2 \cdot \bar{z}_1 \bar{z}_2 = \left(z_1 \bar{z}_1\right)\left(z_2 \bar{z}_2\right) = |z_1|^2 |z_2|^2$.

**Kompleksnih števil ne urejamo.** Pri realnih številih je kvadrat vsakega neničelnega števila pozitiven. Če bi za kompleksna števila veljala ista pravila urejanja, bi bila pozitivna $1 = 1^2$ in $-1 = i^2$, zato tudi njuna vsota $0$, kar ni mogoče. Zato zapis $3 + i < 2 + 5i$ nima smisla. Primerjamo lahko le absolutne vrednosti, ki so realna števila.

## Preveri se

? Tri trditve o številu $z = 4 - 7i$ so pravilne, ena je napačna in ne spada zraven. Katera?
- $\mathrm{Re}\,z = 4$
~ Ta trditev drži: realni del je število brez $i$.
+ $\mathrm{Im}\,z = -7i$
- $\bar{z} = 4 + 7i$
~ Ta trditev drži: pri konjugiranju se spremeni le predznak imaginarnega dela, realni del $4$ ostane.
- $|z| = \sqrt{65}$
~ Ta trditev drži: $|z| = \sqrt{4^2 + (-7)^2} = \sqrt{16 + 49} = \sqrt{65}$. Kvadrat števila $-7$ je pozitiven.
> Imaginarni del je realno število pred $i$, s predznakom vred: $\mathrm{Im}\,z = -7$, ne $-7i$.

? Koliko je $(2 - i)^2$?
- $5$
~ Zapisal si $4 - i^2$ in izpustil mešani člen $-4i$. Kvadrat dvočlenika ima tri člene.
- $5 - 4i$
~ Upošteval si $i^2 = 1$. Ker je $i^2 = -1$, je $4 - 4i + i^2 = 3 - 4i$.
+ $3 - 4i$
- $3 + 4i$
~ Mešani člen $2 \cdot 2 \cdot (-i) = -4i$ je negativen, ker je imaginarni del števila $2 - i$ enak $-1$.
> $(2 - i)^2 = 4 - 4i + i^2 = 4 - 4i - 1 = 3 - 4i$.

? Ulomek $\dfrac{3 + 4i}{1 - 2i}$ razširiš s številom $1 + 2i$. Kaj je posledica?
- Števec postane realno število.
~ Število $1 + 2i$ je konjugirano imenovalcu, ne števcu $3 + 4i$. Realen postane imenovalec.
+ Imenovalec postane realno število $5$, zato lahko ločiš realni in imaginarni del.
- Imenovalec postane $1 - 4 = -3$.
~ Upošteval si $i^2 = 1$. Pravilno je $(1 - 2i)(1 + 2i) = 1 - 4i^2 = 1 + 4 = 5$.
- Vrednost ulomka se spremeni.
~ Števec in imenovalec pomnožiš z istim številom, kar je množenje z $1$. Vrednost ostane enaka, spremeni se le zapis.
> $(1 - 2i)(1 + 2i) = 1^2 + 2^2 = 5$. Produkt števila s konjugiranim je realen, zato je $\dfrac{3 + 4i}{1 - 2i} = \dfrac{-5 + 10i}{5} = -1 + 2i$.

? Učenec računa $(2 + 3i)(1 - i)$ v korakih: (1) $2 - 2i + 3i - 3i^2$, (2) $2 + i - 3i^2$, (3) $2 + i - 3$, (4) $-1 + i$. V katerem koraku je napaka?
- v koraku (1)
~ Korak je pravilen: vsak člen z vsakim da $2$, $-2i$, $3i$ in $-3i^2$.
- v koraku (2)
~ Korak je pravilen: $-2i + 3i = i$.
+ v koraku (3)
- v koraku (4)
~ Korak (4) pravilno nadaljuje korak (3), saj je $2 - 3 = -1$. Napaka je nastala prej.
> Ker je $i^2 = -1$, je $-3i^2 = +3$. Pravilno je $2 + i + 3 = 5 + i$.

? Pohodnik se od koče premakne $6\,\text{km}$ proti zahodu in $8\,\text{km}$ proti severu, torej za $z = -6 + 8i$. Koliko je od koče oddaljen zračne črte?
- $14\,\text{km}$
~ Seštel si dolžini katet, $6 + 8$. To je pot po ovinku, zračna črta je hipotenuza.
- $2\,\text{km}$
~ Seštel si $-6 + 8$ brez kvadriranja. Absolutna vrednost je $\sqrt{a^2 + b^2}$.
- približno $5{,}29\,\text{km}$
~ Računal si $(-6)^2 = -36$ in dobil $\sqrt{-36 + 64} = \sqrt{28}$. Kvadrat negativnega števila je pozitiven.
+ $10\,\text{km}$
> $|-6 + 8i| = \sqrt{(-6)^2 + 8^2} = \sqrt{36 + 64} = \sqrt{100} = 10$, torej $10\,\text{km}$.

:::simboli
i | imaginarna enota | i^2 = -1 | |
z | kompleksno število | z = a + bi | |
\bar{z} | konjugirano število | \bar{z} = a - bi | | zrcalna slika $z$ čez realno os
a | realni del | a = \mathrm{Re}\,z | |
b | imaginarni del | b = \mathrm{Im}\,z | | realno število, ne $bi$
c | realni del drugega števila | | |
d | imaginarni del drugega števila | | |
z_1, z_2 | kompleksni števili (v primeru 3 premika) | | | pri deljenju $z_2 \ne 0$
:::
