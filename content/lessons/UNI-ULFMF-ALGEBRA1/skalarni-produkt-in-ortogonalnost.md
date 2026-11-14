---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na začetku 19. stoletja so astronomi izgubili komaj odkrito Cerero, ko je izginila v soju Sonca. Carl Friedrich Gauss je iz peščice netočnih meritev izračunal tir, ki se jim najbolj prilega, in Cerero so znova našli blizu mesta, ki ga je napovedal. Njegova metoda najmanjših kvadratov je v jeziku tega poglavja **ortogonalna projekcija**: izbere točko podprostora, ki je meritvam najbližja, tako kot konec sence poševne palice pod navpično svetilko leži na tleh najbliže njenemu vrhu. Enak račun danes potegne premico trenda skozi serijo bolnikovih meritev krvnega tlaka. Zanj potrebujemo dolžine in kote, ki jih vektorski prostor doslej ni poznal; prinese jih **skalarni produkt**. Iz njega dobimo normo, ortogonalnost, projekcije in Gram-Schmidtov postopek, ki iz poljubne baze naredi pravokotno.

## Razlaga

### Skalarni produkt v $\mathbb{R}^n$: rezultat ni vektor

Mamljivo je pričakovati, da je produkt dveh vektorjev spet vektor, na primer zmnožki po komponentah. Skalarni produkt te zmnožke še sešteje. Za $x = (x_1, \dots, x_n)$ in $y = (y_1, \dots, y_n)$ je standardni skalarni produkt

$$\langle x, y \rangle = x_1 y_1 + x_2 y_2 + \dots + x_n y_n .$$

Rezultat je število, ne vektor. Za $x = (1, 2)$ in $y = (3, -1)$ je $\langle x, y \rangle = 3 - 2 = 1$.

### Splošna definicija

Naj bo $V$ realen vektorski prostor. **Skalarni produkt** je preslikava $\langle \cdot , \cdot \rangle : V \times V \to \mathbb{R}$, ki za vse $u, v, w \in V$ in $\alpha \in \mathbb{R}$ zadošča:

- simetričnost: $\langle u, v \rangle = \langle v, u \rangle$,
- linearnost v prvem faktorju: $\langle \alpha u + w, v \rangle = \alpha \langle u, v \rangle + \langle w, v \rangle$,
- pozitivna definitnost: $\langle v, v \rangle \ge 0$, enakost velja le za $v = 0$.

Prostoru s skalarnim produktom rečemo **vektorski prostor s skalarnim produktom**. Zgled poleg $\mathbb{R}^n$: na polinomih stopnje največ $n$ je

$$\langle p, q \rangle = \int_0^1 p(x)\, q(x)\, dx$$

skalarni produkt. Pozitivna definitnost velja, ker je $\int_0^1 p^2\,dx > 0$ za vsak neničelni polinom. V kompleksnem prostoru namesto simetričnosti zahtevamo $\langle u, v \rangle = \overline{\langle v, u \rangle}$.

### Norma: dolžina, ki ni linearna

**Norma** (dolžina) vektorja je

$$\|v\| = \sqrt{\langle v, v \rangle}.$$

V $\mathbb{R}^2$ je to Pitagorov izrek: $\|(3, 4)\| = \sqrt{9 + 16} = 5$. Hitro se zdi, da se norma obnaša kot linearna preslikava. Ne: $\|{-2}v\| = 2\|v\|$, ne $-2\|v\|$, dolžina vsote pa je lahko krajša od vsote dolžin. Norma ima tri lastnosti:

- $\|v\| \ge 0$ in $\|v\| = 0$ le za $v = 0$,
- $\|\alpha v\| = |\alpha| \, \|v\|$ (absolutna vrednost!),
- trikotniška neenakost $\|u + v\| \le \|u\| + \|v\|$.

Vektor z normo $1$ je **enotski**. Iz vsakega $v \ne 0$ ga dobimo z **normiranjem**: $\dfrac{v}{\|v\|}$.

### Cauchy-Schwarzeva neenakost in kot

Za vse $u, v$ velja

$$|\langle u, v \rangle| \le \|u\| \, \|v\| .$$

Zato je za neničelna $u, v$ količnik $\dfrac{\langle u, v \rangle}{\|u\|\,\|v\|}$ med $-1$ in $1$, in **kot** $\varphi \in [0, \pi]$ med vektorjema definiramo s

$$\cos \varphi = \frac{\langle u, v \rangle}{\|u\| \, \|v\|} .$$

### Ortogonalnost

Vektorja sta **ortogonalna** (pravokotna), $u \perp v$, če je $\langle u, v \rangle = 0$. Za ortogonalna vektorja velja Pitagorov izrek:

$$\|u + v\|^2 = \|u\|^2 + \|v\|^2 .$$

Množica vektorjev je **ortogonalna**, če sta vsaka dva različna med seboj ortogonalna. Če so vsi še enotski, je **ortonormirana**. Za ortonormirano bazo $e_1, \dots, e_n$ so koeficienti razvoja kar skalarni produkti: $v = \langle v, e_1 \rangle e_1 + \dots + \langle v, e_n \rangle e_n$. Sistema enačb ni treba reševati.

:::premisli
Ali je vsaka ortogonalna množica neničelnih vektorjev $u_1, \dots, u_k$ linearno neodvisna? Zakaj? Namig: enakost $\alpha_1 u_1 + \dots + \alpha_k u_k = 0$ skalarno pomnoži z $u_j$.
---
Da. Po množenju z $u_j$ vsi členi razen enega izginejo: $\alpha_j \langle u_j, u_j \rangle = 0$. Ker je $u_j \ne 0$, je $\langle u_j, u_j \rangle > 0$, torej $\alpha_j = 0$. To velja za vsak $j$. Obratno ne velja: neodvisna vektorja nista nujno pravokotna.
:::

### Projekcija na vektor: deliti z $\|u\|$ ali z $\|u\|^2$?

Prva misel je, da senco $v$ na $u$ dobimo tako, da $\langle v, u \rangle u$ delimo z dolžino $\|u\|$. Popravi jo en sam pogoj: ostanek mora biti pravokoten na $u$. Naj bo $u \ne 0$. Vektor $v$ razstavimo na del vzdolž $u$ in del, pravokoten na $u$. Slika v besedah:

```
        v
       /|
      / |  v − p   (pravokotno na u)
     /  |
    o---+--------> u
      p
```

Del vzdolž $u$ je $p = \lambda u$. Iz pogoja $\langle v - \lambda u, u \rangle = 0$ dobimo $\lambda = \dfrac{\langle v, u \rangle}{\langle u, u \rangle}$, torej

$$\operatorname{proj}_u v = \frac{\langle v, u \rangle}{\langle u, u \rangle}\, u .$$

V imenovalcu je $\langle u, u \rangle = \|u\|^2$, ne $\|u\|$. Za enotski $u$ se formula skrajša v $\langle v, u \rangle u$.

### Projekcija na podprostor

Senco na podprostor bi radi dobili kot vsoto senc na vektorje, ki ga razpenjajo. To deluje le, če so med seboj pravokotni. Naj ima podprostor $W$ **ortogonalno** bazo $u_1, \dots, u_k$. Ortogonalna projekcija $v$ na $W$ je

$$\operatorname{proj}_W v = \sum_{j=1}^{k} \frac{\langle v, u_j \rangle}{\langle u_j, u_j \rangle}\, u_j .$$

Ostanek $v - \operatorname{proj}_W v$ je pravokoten na vsak vektor iz $W$. Projekcija je tudi **najbližja točka** podprostora: za vsak $w \in W$ velja $\|v - w\| \ge \|v - \operatorname{proj}_W v\|$. To je senca palice iz uvoda. Formula zahteva ortogonalno bazo. Pri neortogonalni bazi se posamezne sence prekrivajo in vsota ni projekcija.

### Gram-Schmidtov postopek

Kako dobimo ortogonalno bazo? Iz baze $v_1, \dots, v_k$ podprostora $W$ gradimo po vrsti:

- $u_1 = v_1$,
- $u_2 = v_2 - \operatorname{proj}_{u_1} v_2$,
- $u_3 = v_3 - \operatorname{proj}_{u_1} v_3 - \operatorname{proj}_{u_2} v_3$,
- in tako naprej: od $v_m$ odštejemo projekcije na **že dobljene** $u_1, \dots, u_{m-1}$.

Vsak $u_m$ je pravokoten na vse prejšnje, ker smo mu odvzeli vse dele v njihovih smereh. Za vsak $m$ velja $\operatorname{Lin}\{u_1, \dots, u_m\} = \operatorname{Lin}\{v_1, \dots, v_m\}$. Na koncu lahko vsak $u_m$ normiramo, $e_m = u_m / \|u_m\|$, in dobimo ortonormirano bazo. Vmes smemo $u_m$ pomnožiti z neničelnim številom, da se znebimo ulomkov; pravokotnost ostane.

:::premisli
Kaj se zgodi v Gram-Schmidtovem postopku, če so $v_1, \dots, v_k$ linearno odvisni, na primer $v_2 = 2 v_1$? Napovej, preden računaš.
---
Dobimo $u_2 = 2v_1 - \dfrac{\langle 2v_1, v_1 \rangle}{\langle v_1, v_1 \rangle} v_1 = 0$. Ničelni $u_m$ pomeni, da je $v_m$ v linearni ogrinjači prejšnjih. Postopek tako odkrije odvisnost; tak vektor izpustimo.
:::

## Rešeni primeri

### Primer 1 (lažji): norma in kot

V $\mathbb{R}^3$ s standardnim skalarnim produktom sta $u = (1, 2, 2)$ in $v = (3, 0, 4)$. Izračunaj normi in kot med njima.

**Podatki:** $u = (1, 2, 2)$, $v = (3, 0, 4)$, standardni skalarni produkt
**Iščemo:** $\|u\|$, $\|v\|$ in kot $\varphi$

:::formula
$\|v\| = \sqrt{\langle v, v \rangle}$, $\quad \cos \varphi = \dfrac{\langle u, v \rangle}{\|u\|\,\|v\|}$
:::

**Rešitev:**

1. Skalarni produkt: $\langle u, v \rangle = 1 \cdot 3 + 2 \cdot 0 + 2 \cdot 4 = 11$.
2. Normi: $\|u\| = \sqrt{1 + 4 + 4} = 3$ in $\|v\| = \sqrt{9 + 0 + 16} = 5$.
3. Kosinus kota: $\cos \varphi = \dfrac{11}{3 \cdot 5} \approx 0{,}733$. Pozitiven je, zato je kot oster.
4. $\varphi = \arccos 0{,}733 \approx 42{,}8^\circ$.
5. Odgovor: $\|u\| = 3$, $\|v\| = 5$, kot med vektorjema je približno $42{,}8^\circ$.

### Primer 2: projekcija na premico

Medicinska sestra trikrat izmeri bolnikovo telesno temperaturo; odčitki nad $36\,^\circ\text{C}$ so $3$, $1$ in $2$ desetinke stopinje, kar zapišemo kot vektor $v = (3, 1, 2)$. Poišči ortogonalno projekcijo $v$ na premico skozi izhodišče s smernim vektorjem $u = (1, 1, 1)$ ter razdaljo točke $v$ do te premice.

**Podatki:** $v = (3, 1, 2)$, $u = (1, 1, 1)$, standardni skalarni produkt
**Iščemo:** $p = \operatorname{proj}_u v$ in razdaljo $\|v - p\|$

:::formula
$\operatorname{proj}_u v = \dfrac{\langle v, u \rangle}{\langle u, u \rangle}\, u$
:::

**Rešitev:**

1. $\langle v, u \rangle = 3 + 1 + 2 = 6$ in $\langle u, u \rangle = 3$.
2. $p = \dfrac{6}{3}(1, 1, 1) = (2, 2, 2)$.
3. Ostanek: $v - p = (1, -1, 0)$.
4. Preizkus pravokotnosti: $\langle v - p, u \rangle = 1 - 1 + 0 = 0$. Ostanek je res pravokoten na premico.
5. Razdalja: $\|v - p\| = \sqrt{1 + 1 + 0} = \sqrt{2} \approx 1{,}41$.
6. Odgovor: projekcija je $(2, 2, 2)$, razdalja točke do premice je $\sqrt{2}$. Projekcija na $(1, 1, 1)$ v vsako komponento zapiše povprečje meritev: $\tfrac{3 + 1 + 2}{3} = 2$ desetinki.

### Primer 3 (težji): najbližja točka ravnine

Ravnina $W \subset \mathbb{R}^3$ je razpeta na $v_1 = (1, 1, 0)$ in $v_2 = (1, 0, 1)$. Katera točka ravnine je najbližja točki $b = (1, 2, 3)$ in kako daleč je?

**Podatki:** $W = \operatorname{Lin}\{v_1, v_2\}$, $v_1 = (1, 1, 0)$, $v_2 = (1, 0, 1)$, $b = (1, 2, 3)$
**Iščemo:** $p = \operatorname{proj}_W b$ in razdaljo $\|b - p\|$

:::formula
Najprej Gram-Schmidt: $u_1 = v_1$, $u_2 = v_2 - \dfrac{\langle v_2, u_1 \rangle}{\langle u_1, u_1 \rangle} u_1$.

Nato $p = \dfrac{\langle b, u_1 \rangle}{\langle u_1, u_1 \rangle} u_1 + \dfrac{\langle b, u_2 \rangle}{\langle u_2, u_2 \rangle} u_2$.
:::

**Rešitev:**

1. $v_1$ in $v_2$ nista pravokotna, ker je $\langle v_1, v_2 \rangle = 1$. Formule za projekcijo zato še ne smemo uporabiti.
2. Gram-Schmidt: $u_1 = (1, 1, 0)$, $\langle u_1, u_1 \rangle = 2$, torej $u_2 = (1, 0, 1) - \tfrac{1}{2}(1, 1, 0) = \left(\tfrac12, -\tfrac12, 1\right)$.
3. Ulomkov se znebimo: vzamemo $u_2 = (1, -1, 2)$. Preizkus: $\langle u_1, u_2 \rangle = 1 - 1 + 0 = 0$.
4. Koeficienta: $\langle b, u_1 \rangle = 3$, $\langle b, u_2 \rangle = 1 - 2 + 6 = 5$, $\langle u_2, u_2 \rangle = 6$.
5. $p = \tfrac{3}{2}(1, 1, 0) + \tfrac{5}{6}(1, -1, 2) = \left(\tfrac{7}{3}, \tfrac{2}{3}, \tfrac{5}{3}\right)$.
6. Ostanek: $b - p = \left(-\tfrac43, \tfrac43, \tfrac43\right) = \tfrac43(-1, 1, 1)$. Pravokoten je na $u_1$ in $u_2$, kar je preizkus.
7. Razdalja: $\|b - p\| = \tfrac{4}{3}\sqrt{3} \approx 2{,}31$.
8. Odgovor: najbližja točka je $\left(\tfrac73, \tfrac23, \tfrac53\right)$, oddaljena $\tfrac{4}{\sqrt3} \approx 2{,}31$.

### Primer 4 – zdaj ti: ortonormirana baza polinomov

V prostoru polinomov stopnje največ $1$ s skalarnim produktom $\langle p, q \rangle = \int_0^1 p(x) q(x)\, dx$ ortonormiraj bazo $v_1 = 1$, $v_2 = x$.

**Podatki:** $v_1 = 1$, $v_2 = x$, $\langle p, q \rangle = \int_0^1 p q \, dx$
**Iščemo:** ortonormirano bazo $e_1, e_2$

:::formula
$u_2 = v_2 - \dfrac{\langle v_2, u_1 \rangle}{\langle u_1, u_1 \rangle} u_1$, $\quad e_m = \dfrac{u_m}{\|u_m\|}$
:::

**Rešitev:**

1. $u_1 = 1$ in $\langle 1, 1 \rangle = \int_0^1 1\, dx = 1$, zato je $e_1 = 1$ že enotski.
2. $\langle x, 1 \rangle = \int_0^1 x\, dx = \tfrac12$, torej $u_2 = x - \tfrac12$.
3. Izračunaj $\|u_2\|$ in normiraj $u_2$, nato preveri:

:::premisli
Koliko je $\|x - \tfrac12\|$ in kaj je $e_2$?
---
$\|u_2\|^2 = \int_0^1 \left(x - \tfrac12\right)^2 dx = \tfrac{1}{12}$, torej $\|u_2\| = \tfrac{1}{2\sqrt3}$. Zato je $e_2 = 2\sqrt3\left(x - \tfrac12\right) = \sqrt3\,(2x - 1)$. Preizkus: $\int_0^1 3(2x-1)^2\,dx = 3 \cdot \tfrac13 = 1$.
:::

## Pogoste napake

- **Deljenje z $\|u\|$ namesto z $\|u\|^2$.** Napačno: $\operatorname{proj}_u v = \dfrac{\langle v, u \rangle}{\|u\|} u$. Tako dobljen vektor je $\|u\|$-krat predolg, razen če je $u$ enotski. Pravilno: delimo z $\langle u, u \rangle$ ali najprej normiramo $u$.
- **Pozabljeno deljenje sploh.** Kdor vzame $\langle v, u \rangle u$ z neenotskim $u$, dobi napačno dolžino. Preizkus: ostanek $v - p$ mora biti pravokoten na $u$.
- **Projekcija na neortogonalno bazo.** Vsota projekcij na $v_1$ in $v_2$, ki nista pravokotna, ni projekcija na $\operatorname{Lin}\{v_1, v_2\}$, ker se sence prekrivajo. Najprej Gram-Schmidt.
- **Odštevanje projekcij na stare vektorje.** V Gram-Schmidtu od $v_3$ odštejemo projekciji na $u_1$ in $u_2$, ne na $v_1$ in $v_2$. Drugače $u_3$ ni pravokoten na $u_2$.
- **Norma je linearna.** $\|u + v\| = \|u\| + \|v\|$ velja le, če kažeta vektorja v isto smer, in $\|{-2}v\| = 2\|v\|$, ne $-2\|v\|$.

## Povzetek

- Skalarni produkt je simetričen, linearen v prvem faktorju in pozitivno definiten. Standardni v $\mathbb{R}^n$: $\langle x, y \rangle = \sum x_i y_i$.
- Norma $\|v\| = \sqrt{\langle v, v \rangle}$; Cauchy-Schwarz $|\langle u, v \rangle| \le \|u\|\,\|v\|$; kot $\cos\varphi = \dfrac{\langle u, v \rangle}{\|u\|\,\|v\|}$.
- $u \perp v \iff \langle u, v \rangle = 0$. Ortogonalni neničelni vektorji so linearno neodvisni.
- $\operatorname{proj}_u v = \dfrac{\langle v, u \rangle}{\langle u, u \rangle} u$; projekcija na $W$ je vsota takih členov po **ortogonalni** bazi in je najbližja točka $W$.
- Gram-Schmidt: od $v_m$ odštej projekcije na že dobljene $u_1, \dots, u_{m-1}$, na koncu normiraj.

## Drugače: Na sliki

Nariši vektor $v$ kot puščico in premico skozi izhodišče v smeri $u$. Iz konice $v$ spusti pravokotnico na premico. Nastane pravokotni trikotnik:

- ena kateta je projekcija $p$ (senca na premici),
- druga kateta je ostanek $v - p$ (pravokotnica),
- hipotenuza je $v$.

Zato velja $\|v\|^2 = \|p\|^2 + \|v - p\|^2$, in noben drug vektor na premici ni bliže konici $v$: vsaka poševna daljica do premice je hipotenuza in je daljša od pravokotnice.

Gram-Schmidt je zaporedje takih slik. Drugi vektor »poravnaš« tako, da mu odrežeš senco na prvega. Tretjemu odrežeš sence na prva dva, in ostane le del, ki štrli iz ravnine prvih dveh.

## Drugače: Korak za korakom s številkami

Gram-Schmidt za $v_1 = (1, 1, 0)$, $v_2 = (1, 0, 1)$, $v_3 = (0, 1, 1)$ v tabeli:

| korak | od česa odštejemo | rezultat | $\langle u, u\rangle$ |
|---|---|---|---|
| $u_1$ | nič | $(1, 1, 0)$ | $2$ |
| $u_2$ | $\tfrac12 u_1$ | $\left(\tfrac12, -\tfrac12, 1\right)$ | $\tfrac32$ |
| $u_3$ | $\tfrac12 u_1$ in $\tfrac13 u_2$ | $\left(-\tfrac23, \tfrac23, \tfrac23\right)$ | $\tfrac43$ |

Koeficienta za $u_3$: $\dfrac{\langle v_3, u_1 \rangle}{\langle u_1, u_1 \rangle} = \dfrac{1}{2}$ in $\dfrac{\langle v_3, u_2 \rangle}{\langle u_2, u_2 \rangle} = \dfrac{1/2}{3/2} = \dfrac13$.

Preizkus po vsakem koraku: novi vektor skalarno pomnoži z vsemi prejšnjimi. Vsi produkti morajo biti $0$. Na koncu deli vsak $u_m$ z $\sqrt{\langle u_m, u_m \rangle}$.

## Drugače: Bolj natančno

**Cauchy-Schwarz.** Za $v = 0$ je trditev očitna. Sicer za vsak $t \in \mathbb{R}$ velja

$$0 \le \|u - t v\|^2 = \|u\|^2 - 2t\langle u, v\rangle + t^2 \|v\|^2 .$$

Kvadratni polinom v $t$ je nenegativen, zato nima dveh različnih realnih ničel, zato je diskriminanta $4\langle u, v \rangle^2 - 4\|u\|^2\|v\|^2 \le 0$. Enakost velja natanko tedaj, ko sta $u$ in $v$ linearno odvisna.

**Trikotniška neenakost.** $\|u + v\|^2 = \|u\|^2 + 2\langle u, v\rangle + \|v\|^2 \le \|u\|^2 + 2\|u\|\|v\| + \|v\|^2 = (\|u\| + \|v\|)^2$.

**Projekcija je najbližja točka.** Naj bo $p = \operatorname{proj}_W v$ in $w \in W$. Ker je $v - p \perp W$ in $p - w \in W$, po Pitagori

$$\|v - w\|^2 = \|v - p\|^2 + \|p - w\|^2 \ge \|v - p\|^2,$$

z enakostjo le za $w = p$. Projekcija je torej enolična in ni odvisna od izbire ortogonalne baze $W$.

**Ortogonalni komplement.** $W^\perp = \{v : \langle v, w \rangle = 0 \text{ za vse } w \in W\}$ je podprostor. V končnorazsežnem prostoru je $V = W \oplus W^\perp$, saj je $v = \operatorname{proj}_W v + (v - \operatorname{proj}_W v)$. Preslikava $P\colon v \mapsto \operatorname{proj}_W v$ je linearna, velja $P^2 = P$, lastni vrednosti pa sta $1$ (na $W$) in $0$ (na $W^\perp$).

**Matrična oblika.** Če so stolpci matrike $Q$ ortonormirana baza $W \subseteq \mathbb{R}^n$, je matrika projekcije $Q Q^{\mathsf T}$. Gram-Schmidt v matrični obliki je razcep $A = QR$ z zgornjetrikotno $R$.

## Preveri se

? Kako je definirana norma, ki jo določa skalarni produkt?
- $\|v\| = \langle v, v \rangle$
~ Manjka koren. Za $v = (3, 4)$ bi dobil $25$ namesto dolžine $5$.
+ $\|v\| = \sqrt{\langle v, v \rangle}$
- $\|v\| = |v_1| + |v_2| + \dots + |v_n|$
~ To je sicer tudi norma na $\mathbb{R}^n$, a je ne dobimo iz skalarnega produkta; za $(3, 4)$ da $7$, ne $5$.
> Norma je koren skalarnega produkta vektorja s samim sabo; v $\mathbb{R}^n$ je to običajna dolžina po Pitagori.

? Kolikšna je projekcija $v = (4, 2)$ na smer $u = (1, 1)$?
- $(6, 6)$
~ To je $\langle v, u \rangle u$ brez deljenja; $u$ ni enotski, zato je treba deliti z $\langle u, u \rangle = 2$.
- $\left(\tfrac{6}{\sqrt2}, \tfrac{6}{\sqrt2}\right)$
~ Tu je deljeno z $\|u\|$ namesto z $\|u\|^2$. Vektor je $\sqrt2$-krat predolg.
+ $(3, 3)$
> $\langle v, u \rangle = 6$, $\langle u, u \rangle = 2$, torej $\operatorname{proj}_u v = 3(1, 1) = (3, 3)$. Preizkus: $v - p = (1, -1) \perp (1, 1)$.

? Vektorja $v_1, v_2$ nista ortogonalna. Ali je $\operatorname{proj}_{v_1} b + \operatorname{proj}_{v_2} b$ projekcija $b$ na $\operatorname{Lin}\{v_1, v_2\}$?
- Da, projekcija na podprostor je vedno vsota projekcij na bazne vektorje.
~ To velja le za ortogonalno bazo. Pri poševni bazi se sence prekrivajo in del $b$ šteješ dvakrat.
+ Ne, najprej moramo z Gram-Schmidtom dobiti ortogonalno bazo.
- Da, a le če sta $v_1$ in $v_2$ enotska.
~ Enotskost ni dovolj; ključna je pravokotnost. Za enotska poševna vektorja vsota še vedno ni projekcija.
> Formula $\sum \frac{\langle b, u_j \rangle}{\langle u_j, u_j \rangle} u_j$ zahteva $\langle u_i, u_j \rangle = 0$ za $i \ne j$; sicer ostanek ni pravokoten na podprostor.

? Gram-Schmidt za $v_1 = (1, 0, 1)$, $v_2 = (2, 1, 0)$: kaj je $u_2$?
- $(0, 1, -2)$
~ Odšteto je $\langle v_2, v_1 \rangle v_1 = 2v_1$ brez deljenja z $\langle v_1, v_1 \rangle = 2$. Preizkus: $\langle (0,1,-2), v_1 \rangle = -2 \ne 0$.
+ $(1, 1, -1)$
- $(2, 1, 0)$
~ $v_2$ bi ostal nespremenjen le, če bi bil že pravokoten na $v_1$, a $\langle v_2, v_1 \rangle = 2$.
> $\langle v_2, v_1 \rangle = 2$, $\langle v_1, v_1 \rangle = 2$, zato $u_2 = (2, 1, 0) - (1, 0, 1) = (1, 1, -1)$; res je $\langle u_2, v_1 \rangle = 0$.

? Zakaj je ortogonalna projekcija $p$ vektorja $v$ na $W$ točka podprostora, ki je najbližja $v$?
- Ker je $p$ med vsemi vektorji iz $W$ najkrajši.
~ Najkrajši vektor v $W$ je ničelni. Šteje razdalja do $v$, ne dolžina $p$.
- Ker ima $p$ enako normo kot $v$.
~ Projekcija je v splošnem krajša od $v$: $\|p\|^2 = \|v\|^2 - \|v - p\|^2$.
+ Ker je $v - p$ pravokoten na $W$, zato po Pitagori $\|v - w\|^2 = \|v - p\|^2 + \|p - w\|^2$ za vsak $w \in W$.
> Drugi člen je nenegativen in enak $0$ le za $w = p$, zato je $p$ edina najbližja točka.

:::simboli
x, y | vektorja v ℝⁿ | | | v ⟨p, q⟩ je x spremenljivka polinomov
x_1, x_2, x_n | komponente vektorja x
y_1, y_2, y_n | komponente vektorja y
p, q | polinoma v skalarnem produktu ⟨p, q⟩ | | | v primerih 2 in 3 ter v dokazu najbližje točke je p projekcija vektorja
d | oznaka diferenciala (dx) v integralu
u, v | vektorja prostora s skalarnim produktom
w | poljuben vektor podprostora W
\varphi | kot med vektorjema u in v | \cos \varphi = \frac{\langle u, v \rangle}{\lVert u \rVert \, \lVert v \rVert} | | φ ∈ [0, π]
W | podprostor z ortogonalno bazo u₁, …, uₖ
u_1, u_2, u_j, u_m | ortogonalni vektorji (baza podprostora W) | u_m = v_m - \sum_{j<m} \operatorname{proj}_{u_j} v_m | | v Gram-Schmidtovem postopku u₁ = v₁
v_1, v_2 | vektorji začetne baze podprostora W
e_m | normirani vektor ortonormirane baze | e_m = \frac{u_m}{\lVert u_m \rVert}
j | indeks člena vsote
k | razsežnost podprostora W (število baznih vektorjev)
t | realni parameter v dokazu Cauchy-Schwarzeve neenakosti
b | dana točka, ki jo projiciramo na W
:::
