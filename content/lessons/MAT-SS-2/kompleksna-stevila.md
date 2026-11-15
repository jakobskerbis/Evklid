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

**Grafično.** Števili narišemo kot puščici iz izhodišča. Puščici $z_1$ in $z_2$ napenjata paralelogram, vsota $z_1 + z_2$ pa je njegova diagonala iz izhodišča (pravilo paralelograma). Enako dobimo, če puščico $z_2$ prestavimo na konec puščice $z_1$. Razlika je vsota z nasprotnim številom: $z_1 - z_2 = z_1 + (-z_2)$. Število $-z_2$ je zrcalna slika $z_2$ čez izhodišče. Puščica $z_1 - z_2$ je vzporedna daljici od točke $z_2$ do točke $z_1$ in enako dolga, zato je $|z_1 - z_2|$ razdalja med točkama. Risba je v primeru 1.

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

**Obratna vrednost.** Obratna vrednost števila $z \ne 0$ je število, ki da v produktu z $z$ število $1$. Označimo jo z $\dfrac{1}{z}$, torej $z \cdot \dfrac{1}{z} = 1$. Izračunamo jo kot vsak količnik: razširimo s $\bar{z}$ in imenovalec postane $z \cdot \bar{z} = a^2 + b^2$:

$$\frac{1}{a + bi} = \frac{a - bi}{a^2 + b^2}$$

Na primer $\dfrac{1}{3 + 4i} = \dfrac{3 - 4i}{25} = \dfrac{3}{25} - \dfrac{4}{25}\,i$. Preizkus: $(3 + 4i)(3 - 4i) = 9 + 16 = 25$, deljeno s $25$ je $1$. Posebej je $\dfrac{1}{i} = -i$, saj je $i \cdot (-i) = -i^2 = 1$. Pozor: $\dfrac{1}{3 + 4i}$ ni $\dfrac{1}{3} + \dfrac{1}{4}\,i$, ulomka ne smeš razdeliti po členih imenovalca.

V simulaciji spodaj (»Kompleksna števila v ravnini«) izberi množenje in točko $w$ postavi v $(0, 1)$, torej $w = i$. Premikaj točko $z$ in opazuj: $z \cdot w$ je vedno $z$, zasukan za pravi kot v levo, z enako absolutno vrednostjo. Nato izberi $\bar{z}$ in poglej zrcaljenje čez realno os.

**8. Kvadratne enačbe s kompleksnimi rešitvami.** Enačba $x^2 = -9$ v realnih številih nima rešitve, v kompleksnih ima dve: $x_{1,2} = \pm 3i$, saj je $(3i)^2 = (-3i)^2 = 9i^2 = -9$. Tako rešimo vsako kvadratno enačbo z realnimi koeficienti, pri kateri po dopolnitvi do popolnega kvadrata na desni ostane negativno število. Ker je $(x - 3)^2 = x^2 - 6x + 9$, enačbo $x^2 - 6x + 13 = 0$ zapišemo kot $(x - 3)^2 + 4 = 0$, torej $(x - 3)^2 = -4$. Od tod je $x - 3 = 2i$ ali $x - 3 = -2i$.

Rešitvi $x_{1,2} = 3 \pm 2i$ sta konjugirani, $x_2 = \bar{x}_1$, v ravnini zrcalni čez realno os. Tako je pri vsaki kvadratni enačbi z realnimi koeficienti, ki nima realnih rešitev. Vsota in produkt konjugiranih števil sta realna: $(3 + 2i) + (3 - 2i) = 6$ in $(3 + 2i)(3 - 2i) = 9 + 4 = 13$. Zato ima produkt $(x - 3 - 2i)(x - 3 + 2i) = x^2 - 6x + 13$ realne koeficiente. Splošni obrazec za rešitve spoznaš v lekciji o kvadratni enačbi.

## Rešeni primeri

### Primer 1 (lažji)

Dani sta števili $z_1 = 3 + 2i$ in $z_2 = 1 - 4i$. Izračunaj $z_1 + z_2$, $z_1 - z_2$ in $z_1 \cdot z_2$. Vsoto in razliko določi še grafično.

**Podatki:** $z_1 = 3 + 2i$, $z_2 = 1 - 4i$
**Iščemo:** vsoto $z_1 + z_2$, razliko $z_1 - z_2$ (računsko in grafično) in produkt $z_1 \cdot z_2$

:::formula
$(a + bi) \pm (c + di) = (a \pm c) + (b \pm d)i$; množimo kot dvočlenika in upoštevamo $i^2 = -1$; grafično: pravilo paralelograma, $z_1 - z_2 = z_1 + (-z_2)$
:::

**Rešitev:**

1. Vsota: $(3 + 2i) + (1 - 4i) = (3 + 1) + (2 - 4)i = 4 - 2i$.
2. Razlika: $(3 + 2i) - (1 - 4i) = (3 - 1) + (2 + 4)i = 2 + 6i$.
3. Produkt: $(3 + 2i)(1 - 4i) = 3 - 12i + 2i - 8i^2 = 3 - 10i + 8 = 11 - 10i$.
4. Grafično: puščici $z_1$ in $z_2$ napenjata paralelogram, njegova diagonala iz izhodišča se konča v točki $4 - 2i$. Za razliko narišemo $-z_2 = -1 + 4i$ in s puščico $z_1$ napnemo drugi paralelogram. Njegova diagonala se konča v točki $2 + 6i$. Oba rezultata se ujemata z računom.

:::risba graf
opis: Kompleksna ravnina. Modri puščici iz izhodišča kažeta v z₁ = 3 + 2i in z₂ = 1 − 4i, oranžna v −z₂ = −1 + 4i. Črtkani paralelogram z oglišči 0, z₁, 4 − 2i in z₂ ima zeleno diagonalo do z₁ + z₂ = 4 − 2i. Črtkani paralelogram z oglišči 0, −z₂, 2 + 6i in z₁ ima rdečo diagonalo do z₁ − z₂ = 2 + 6i.
x: -3 .. 6 | 1 | Re
y: -5 .. 7 | 1 | Im
enako: da
črta: 3; 2 -> 4; -2 -> 1; -4 | siva črtkano
črta: -1; 4 -> 2; 6 -> 3; 2 | siva črtkano
puščica: 0; 0 -> 3; 2 | | | modra
puščica: 0; 0 -> 1; -4 | | | modra
puščica: 0; 0 -> -1; 4 | | | oranžna
puščica: 0; 0 -> 4; -2 | | | zelena
puščica: 0; 0 -> 2; 6 | | | rdeča
točka: 3; 2 | z_1 | desno
točka: 1; -4 | z_2 | desno
točka: -1; 4 | −z_2 | levo
točka: 4; -2 | z_1 + z_2 | desno
točka: 2; 6 | z_1 − z_2 | desno
:::

5. Odgovor: $z_1 + z_2 = 4 - 2i$, $z_1 - z_2 = 2 + 6i$ in $z_1 \cdot z_2 = 11 - 10i$.

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
- Deljenje: ulomek razširimo s številom, konjugiranim imenovalcu. Obratna vrednost: $\dfrac{1}{a + bi} = \dfrac{a - bi}{a^2 + b^2}$.
- Grafično: vsota je diagonala paralelograma s stranicama $z_1$ in $z_2$; $z_1 - z_2 = z_1 + (-z_2)$.
- Kvadratna enačba z realnimi koeficienti brez realnih rešitev ima dve konjugirani kompleksni rešitvi.
- Absolutna vrednost: $|z| = \sqrt{a^2 + b^2}$ je razdalja točke $(a, b)$ od izhodišča v kompleksni ravnini.
- Enakost: $a + bi = c + di$ natanko tedaj, ko je $a = c$ in $b = d$.

## Ponovitev

**Formule**
- $i^2 = -1$, $z = a + bi$, $\mathrm{Re}\,z = a$, $\mathrm{Im}\,z = b$ (na pamet)
- $\bar{z} = a - bi$, $\;z \cdot \bar{z} = a^2 + b^2$ (na pamet)
- $|z| = \sqrt{a^2 + b^2}$ (na pamet)
- $\dfrac{1}{a + bi} = \dfrac{a - bi}{a^2 + b^2}$ (na pamet)
- potence $i$ se ponavljajo s periodo $4$: $i, -1, -i, 1$ (na pamet)

**Postopek**
1. Seštevaj ločeno realna in imaginarna dela.
2. Množi kot dvočlenika in zamenjaj $i^2$ z $-1$.
3. Pri deljenju razširi ulomek s številom, konjugiranim imenovalcu.
4. Rezultat zapiši v obliki $a + bi$.
5. Pri enačbi izenači realna dela in imaginarna dela.

**Pazi na**
- $i^2 = -1$, ne $1$: zato je $-8i^2 = +8$.
- $\mathrm{Im}\,z$ je realno število brez $i$: za $4 - 7i$ je $-7$.
- Konjugiraš le imaginarni del: $\overline{3 + 2i} = 3 - 2i$.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Dano je število $z = 2 + i^{23}$. Izračunaj obratno vrednost $\dfrac{1}{z}$ in jo zapiši v obliki $a + bi$.

**Rešitev:**

1. Ker je $23 = 5 \cdot 4 + 3$, je $i^{23} = \left(i^4\right)^5 \cdot i^3 = 1 \cdot (-i) = -i$. Torej je $z = 2 - i$.
2. Ulomek razširimo s številom, konjugiranim imenovalcu: $\dfrac{1}{2 - i} = \dfrac{2 + i}{(2 - i)(2 + i)}$, imenovalec je $2^2 + 1^2 = 5$.
3. $\dfrac{1}{z} = \dfrac{2 + i}{5} = \dfrac{2}{5} + \dfrac{1}{5}\,i$.
4. Odgovor: $\dfrac{1}{z} = \dfrac{2}{5} + \dfrac{1}{5}\,i$.

**Točkovanje:** 1 točka za $i^{23} = -i$ (oziroma $z = 2 - i$), 1 točka za razširitev s številom $2 + i$ in imenovalec $5$, 1 točka za $\frac{2}{5} + \frac{1}{5}\,i$.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dana je enačba $x^2 - 4x + 13 = 0$.

a) Reši enačbo v množici kompleksnih števil. (2 točki)
b) Rešitev s pozitivnim imaginarnim delom označi z $z_1$, drugo z $z_2$. Opiši, kje v kompleksni ravnini ležita in kako sta povezani, ter izračunaj njuni absolutni vrednosti. (2 točki)
c) Izračunaj količnik $\dfrac{z_1}{z_2}$ v obliki $a + bi$ in njegovo absolutno vrednost. (3 točke)

**Rešitev:**

1. a) Diskriminanta: $D = (-4)^2 - 4 \cdot 1 \cdot 13 = 16 - 52 = -36$, zato je $\sqrt{D} = \sqrt{-36} = 6i$.
2. a) $x_{1,2} = \dfrac{4 \pm 6i}{2} = 2 \pm 3i$.
3. b) $z_1 = 2 + 3i$ je točka $(2, 3)$, $z_2 = 2 - 3i$ je točka $(2, -3)$. Števili sta konjugirani, $z_2 = \bar{z}_1$, zato sta točki zrcalni glede na realno os.
4. b) $|z_1| = |z_2| = \sqrt{2^2 + 3^2} = \sqrt{13}$; zrcaljenje razdalje od izhodišča ne spremeni.
5. c) Ulomek razširimo s številom $2 + 3i$, ki je konjugirano imenovalcu: števec $(2 + 3i)^2 = 4 + 12i + 9i^2 = -5 + 12i$, imenovalec $(2 - 3i)(2 + 3i) = 4 + 9 = 13$.
6. c) $\dfrac{z_1}{z_2} = \dfrac{-5 + 12i}{13} = -\dfrac{5}{13} + \dfrac{12}{13}\,i$.
7. c) $\left|\dfrac{z_1}{z_2}\right| = \dfrac{\sqrt{25 + 144}}{13} = \dfrac{13}{13} = 1$. To se ujema z $\dfrac{|z_1|}{|z_2|} = \dfrac{\sqrt{13}}{\sqrt{13}} = 1$.
8. Odgovor: $z_1 = 2 + 3i$, $z_2 = 2 - 3i$; točki sta zrcalni glede na realno os, $|z_1| = |z_2| = \sqrt{13}$; $\dfrac{z_1}{z_2} = -\dfrac{5}{13} + \dfrac{12}{13}\,i$ z absolutno vrednostjo $1$.

**Točkovanje:** a) 1 točka za $D = -36$, 1 točka za rešitvi $2 \pm 3i$; b) 1 točka za lego točk in zrcaljenje čez realno os (konjugirani števili), 1 točka za $|z_1| = |z_2| = \sqrt{13}$; c) 1 točka za razširitev s številom $2 + 3i$ in imenovalec $13$, 1 točka za $-\frac{5}{13} + \frac{12}{13}\,i$, 1 točka za absolutno vrednost $1$.

### Ustno vprašanje 1

:::premisli
Kaj je konjugirano število kompleksnega števila $z = a + bi$, kaj pomeni v kompleksni ravnini in koliko je produkt $z \cdot \bar{z}$?
---
Konjugirano število je $\bar{z} = a - bi$: realni del ostane, imaginarni del spremeni predznak. V kompleksni ravnini je $\bar{z}$ zrcalna slika točke $z$ čez realno os. Produkt je $z \cdot \bar{z} = a^2 + b^2$, torej realno nenegativno število, enako $|z|^2$. Zato pri deljenju ulomek razširimo s številom, konjugiranim imenovalcu, da imenovalec postane realen.
:::

### Ustno vprašanje 2

:::premisli
Izpelji pravilo za računanje potenc imaginarne enote $i^n$, kjer je $n$ naravno število.
---
Po definiciji je $i^1 = i$ in $i^2 = -1$. Od tod je $i^3 = i^2 \cdot i = -i$ in $i^4 = \left(i^2\right)^2 = 1$. Ker je $i^4 = 1$, za $n = 4k + r$ velja $i^n = \left(i^4\right)^k \cdot i^r = i^r$, zato se potence ponavljajo s periodo $4$. Vrednost $i^n$ je odvisna le od ostanka $r$ pri deljenju $n$ s $4$: ostankom $0, 1, 2, 3$ pripadajo vrednosti $1, i, -1, -i$.
:::

### Ustno vprašanje 3

:::premisli
Pojasni, zakaj vpeljemo kompleksna števila, in navedi primer kvadratne enačbe z realnimi koeficienti, ki ima rešitve le v množici kompleksnih števil.
---
Kvadrat vsakega realnega števila je nenegativen, zato enačba $x^2 = -1$ v realnih številih nima rešitve. Vpeljemo imaginarno enoto $i$ z lastnostjo $i^2 = -1$ in kompleksna števila $a + bi$, v katerih ima vsaka kvadratna enačba rešitev. Primer je enačba $x^2 + 4 = 0$ z rešitvama $x = 2i$ in $x = -2i$. Kvadratna enačba z realnimi koeficienti in negativno diskriminanto ima vedno dve konjugirani kompleksni rešitvi.
:::

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

? Z risbe odčitaj števili $z_1$ in $z_2$. Koliko je imaginarni del razlike $z_1 - z_2$?
:::risba graf
opis: Kompleksna ravnina z mrežo. Točka z₁ leži 2 enoti desno in 3 enote nad izhodiščem, točka z₂ leži 4 enote desno in 1 enoto pod izhodiščem. Iz izhodišča do obeh točk vodita puščici.
x: -1 .. 5 | 1 | Re
y: -2 .. 4 | 1 | Im
enako: da
puščica: 0; 0 -> 2; 3 | | | modra
puščica: 0; 0 -> 4; -1 | | | modra
točka: 2; 3 | z_1 | desno
točka: 4; -1 | z_2 | pod
:::
= 4
~ -4 | Izračunal si $z_2 - z_1$. Pri razliki $z_1 - z_2$ od $z_1$ odštejemo $z_2$.
~ 2 | To je imaginarni del vsote, $3 + (-1)$. Pri razliki odšteješ: $3 - (-1) = 4$.
> Z risbe: $z_1 = 2 + 3i$, $z_2 = 4 - i$. Razlika je $z_1 - z_2 = -2 + 4i$, zato je imaginarni del $4$. Grafično: puščica od $z_2$ do $z_1$ gre $2$ enoti levo in $4$ enote navzgor.

? (brez računala) Obratno vrednost števila $z = 1 - 2i$ zapiši v obliki $a + bi$. Koliko je $b$?
= 0,4
~ -0,4 | V števec si napisal $z$ namesto konjugiranega števila $\bar{z} = 1 + 2i$.
~ 2 | Pozabil si deliti z $z \cdot \bar{z} = 1 + 4 = 5$.
~ -0,5 | Ulomek si razdelil po členih, $\dfrac{1}{1} + \dfrac{1}{-2}\,i$. Tako obratne vrednosti ne dobiš.
> $\dfrac{1}{1 - 2i} = \dfrac{1 + 2i}{(1 - 2i)(1 + 2i)} = \dfrac{1 + 2i}{5} = \dfrac{1}{5} + \dfrac{2}{5}\,i$, torej $b = 0{,}4$.

? (brez računala) Kvadratna enačba $x^2 + px + q = 0$ z realnima koeficientoma $p$ in $q$ ima rešitev $x_1 = 2 + 5i$. Koliko je $q$?
= 29
~ -21 | Računal si $(2 + 5i)(2 - 5i) = 4 - 25$, kot da bi bilo $i^2 = 1$. Pravilno je $4 - 25i^2 = 4 + 25$.
~ -4 | To je koeficient $p$ (enačba je $x^2 - 4x + 29 = 0$). Sprašujemo po prostem členu $q$.
> Ker sta koeficienta realna, je druga rešitev konjugirana, $x_2 = 2 - 5i$. Velja $(x - 2 - 5i)(x - 2 + 5i) = x^2 - 4x + 29$, zato je $q = (2 + 5i)(2 - 5i) = 2^2 + 5^2 = 29$.

:::simboli
i | imaginarna enota | i^2 = -1 | |
z | kompleksno število | z = a + bi | |
\bar{z} | konjugirano število | \bar{z} = a - bi | | zrcalna slika $z$ čez realno os
a | realni del | a = \mathrm{Re}\,z | |
b | imaginarni del | b = \mathrm{Im}\,z | | realno število, ne $bi$
c | realni del drugega števila | | |
d | imaginarni del drugega števila | | |
z_1, z_2 | kompleksni števili (v primeru 3 premika) | | | pri deljenju $z_2 \ne 0$
w | drugo kompleksno število: v primeru 2 količnik, v simulaciji drugi faktor | | |
n | eksponent potence $i^n$ | | | naravno število
k | količnik pri deljenju eksponenta $n$ s $4$ | n = 4k + r | |
r | ostanek pri deljenju eksponenta $n$ s $4$ | | | $0$, $1$, $2$ ali $3$
x | neznanka kvadratne enačbe | | |
x_1, x_2 | rešitvi kvadratne enačbe | | | pri realnih koeficientih in nerealnih rešitvah je $x_2 = \bar{x}_1$
p, q | realna koeficienta kvadratne enačbe $x^2 + px + q = 0$ | | | $q = x_1 x_2$
D | diskriminanta kvadratne enačbe | | | v enačbi $x^2 - 4x + 13 = 0$ je $D = -36$
:::

<<RACUN
vrednost: I^23 | -I
enako: 1/(2-I) | 2/5+I/5
vrednost: (-4)^2-4*1*13 | -36
enako: (x-2-3*I)*(x-2+3*I) | x^2-4*x+13
vrednost: (4+sqrt(-36))/2 | 2+3*I
enako: (2+3*I)^2 | -5+12*I
enako: (2+3*I)/(2-3*I) | -5/13+12*I/13
vrednost: abs(2+3*I) | sqrt(13)
vrednost: abs(-5/13+12*I/13) | 1
enako: (x-2*I)*(x+2*I) | x^2+4
enako: (3+2*I)+(1-4*I) | 4-2*I
enako: (3+2*I)-(1-4*I) | 2+6*I
enako: (3+2*I)+(-1+4*I) | 2+6*I
enako: 1/(3+4*I) | 3/25-4*I/25
enako: 1/I | -I
enako: (x-3)^2 | x^2-6*x+9
enako: (x-3)^2+4 | x^2-6*x+13
vrednost: (3+2*I)^2-6*(3+2*I)+13 | 0
vrednost: (3*I)^2 | -9
enako: (x-3-2*I)*(x-3+2*I) | x^2-6*x+13
enako: (2+3*I)-(4-I) | -2+4*I
enako: 1/(1-2*I) | 1/5+2*I/5
enako: (x-2-5*I)*(x-2+5*I) | x^2-4*x+29
>>
