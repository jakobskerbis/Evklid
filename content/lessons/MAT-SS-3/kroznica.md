---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Nika načrtuje kolesarski izlet. Na zemljevid je narisala mrežo s kvadratki po $1\,\mathrm{km}$, izhodišče je domača vas. Razgledni stolp z oddajnikom stoji v točki $S(3, 2)$, njegov signal seže $5\,\mathrm{km}$ daleč. Cesta, po kateri bo kolesarila, na zemljevidu leži na premici $y = x - 2$.

Nika bi rada vedela dvoje. Ali bo na cesti sploh imela signal? In če ga bo, na katerem delu ceste?

Rob območja signala je **krožnica**: vse točke, ki so od stolpa oddaljene natanko $5\,\mathrm{km}$. Ko krožnico zapišeš z enačbo, postane Nikino vprašanje račun. Isti račun uporabljajo navigacijske naprave, ki iz razdalj do oddajnikov določijo, kje si.

## Razlaga

**1. Mamljiva bližnjica.** Marsikdo bi za krožnico s središčem $S(3, 2)$ in polmerom $5$ napisal kar $(x + 3)^2 + (y + 2)^2 = 5$. To je napačno, in to dvakrat. Preverimo s točko, ki zagotovo leži na krožnici: $(8, 2)$ je $5$ enot desno od središča. V napačno enačbo vstavimo: $(8 + 3)^2 + (2 + 2)^2 = 11^2 + 4^2 = 137$, kar ni $5$. Točka, ki bi morala ustrezati, ne ustreza.

**2. Popravek iz razdalje.** Krožnica s središčem $S(p, q)$ in polmerom $r$ je množica vseh točk $T(x, y)$ ravnine, ki so od $S$ oddaljene za $r$. Razdaljo poznaš iz vektorjev: to je dolžina vektorja $\overrightarrow{ST} = (x - p,\; y - q)$. Ta dolžina mora biti enaka polmeru:

$$r = \sqrt{(x - p)^2 + (y - q)^2}$$

Obe strani kvadriramo in dobimo **enačbo krožnice v središčni obliki**:

$$(x - p)^2 + (y - q)^2 = r^2$$

Zdaj vidiš obe napaki iz bližnjice. V oklepaju je **minus** koordinata središča, ker računamo razliko $x - p$. Na desni je **kvadrat** polmera, ker smo kvadrirali razdaljo. Za Nikin stolp je pravilna enačba $(x - 3)^2 + (y - 2)^2 = 25$. Točka $(8, 2)$ zdaj ustreza: $5^2 + 0^2 = 25$.

Če je središče v izhodišču, sta $p$ in $q$ enaka $0$ in ostane enačba $x^2 + y^2 = r^2$.

:::premisli
Kaj opisuje enačba $x^2 + y^2 = 0$? In kaj enačba $x^2 + y^2 = -4$?
---
Prva le eno točko, izhodišče $(0, 0)$: vsota dveh kvadratov je $0$ samo, če sta oba $0$. Druga ne opisuje nobene točke, ker vsota kvadratov ne more biti negativna. Krožnica je le, ko je desna stran pozitivna.
:::

**3. Splošna oblika.** Če v središčni obliki odpraviš oklepaje in vse preneseš na levo, dobiš **splošno obliko** $x^2 + y^2 + Dx + Ey + F = 0$. Iz nje središča ne prebereš takoj. Pomagaš si z **dopolnjevanjem do popolnega kvadrata**: k $x^2 + Dx$ dodaš in odvzameš kvadrat polovice koeficienta. Tako je na primer $x^2 - 6x = (x - 3)^2 - 9$. Enako narediš pri $y$.

Če to narediš s splošnima $D$ in $E$, dobiš: središče je v točki $S\!\left(-\frac{D}{2}, -\frac{E}{2}\right)$ in velja $r^2 = \frac{D^2}{4} + \frac{E^2}{4} - F$. Krožnica obstaja le, če je ta vrednost pozitivna.

Enačba krožnice je enačba druge stopnje v $x$ in $y$, zato krožnico imenujemo **krivulja drugega reda**. Krivulje drugega reda so tudi elipsa, hiperbola in parabola iz naslednje lekcije. Krožnico prepoznaš po tem, da imata $x^2$ in $y^2$ enak koeficient in ni člena z $xy$. Enačbo $2x^2 + 2y^2 - 8x = 0$ najprej deliš z $2$: $x^2 + y^2 - 4x = 0$. Dopolnjevanje do kvadrata da $(x - 2)^2 + y^2 = 4$.

**4. Kje leži točka.** Koordinate točke vstaviš v levo stran središčne oblike in rezultat primerjaš z $r^2$. Manj pomeni, da je točka znotraj kroga. Enako pomeni, da leži na krožnici. Več pomeni, da je zunaj.

**5. Premica in krožnica.** Premica in krožnica imata lahko dve, eno ali nobene skupne točke. Skupne točke so rešitve sistema obeh enačb. Iz enačbe premice izraziš $y$ in ga vstaviš v enačbo krožnice. Dobiš kvadratno enačbo za $x$. Njena diskriminanta pove lego, ne da bi enačbo sploh rešil. Isto pove razdalja $d$ od središča do premice, ki jo primerjaš s polmerom $r$:

| diskriminanta | premica | $d$ in $r$ |
|---|---|---|
| $> 0$ | sekanta | $d < r$ |
| $= 0$ | tangenta | $d = r$ |
| $< 0$ | mimobežnica | $d > r$ |

Sekanta ima s krožnico dve skupni točki, tangenta eno, mimobežnica nobene.

Zadnji stolpec si predstavljaj s sliko: iz središča spustiš pravokotnico na premico. Če je ta krajša od polmera, premica gre skozi notranjost kroga in krožnico seka dvakrat. Če je enaka polmeru, se je le dotakne.

**6. Tangenta (višja raven).** Tangenta se krožnice dotakne v točki $T$ in je pravokotna na polmer $ST$. Vektor $\overrightarrow{ST}$ je zato normala tangente: skalarni produkt med $\overrightarrow{ST}$ in vsakim vektorjem vzdolž tangente je $0$.

V simulaciji spodaj »Enačba krožnice« povleci središče $S$ v izhodišče in opazuj, kako se poenostavi zapis enačbe. Nato vklopi tangento in premikaj točko $T$: tangenta ostane pravokotna na polmer.

:::premisli
Premica gre skozi središče krožnice. Koliko skupnih točk ima s krožnico? Zakaj ti tega ni treba računati?
---
Natanko dve. Razdalja od središča do premice je $d = 0$, kar je manj od vsakega polmera, zato je premica sekanta. Presečišči sta krajišči premera.
:::

**7. Presečišča z drugimi krivuljami.** Skupne točke krožnice s katerokoli krivuljo iščeš enako kot s premico: rešiš sistem obeh enačb. Enako dobiš presečišča premice s parabolo $y = ax^2 + bx + c$ ali s hiperbolo $y = \frac{k}{x}$ in presečišča dveh stožnic, tudi elipse in hiperbole iz naslednje lekcije. Dve krivulji drugega reda imata lahko do štiri skupne točke.

- Pri paraboli $y = ax^2$ izraziš $x^2 = \frac{y}{a}$ in ga vstaviš v enačbo krožnice. Dobiš kvadratno enačbo za $y$.
- Pri dveh krožnicah enačbi odšteješ. Kvadrata se odštejeta in ostane premica skozi obe presečišči. Nato nadaljuješ kot v bloku 5.

Vsako rešitev utemelji. Pri paraboli rešitev za $y$, pri kateri je $x^2$ negativen, ne da nobene točke. Rešitev s pozitivnim $x^2$ da dve točki, simetrični glede na os $y$, rešitev z $x^2 = 0$ eno samo. Primerjaj s skico: koliko presečišč vidiš, toliko jih mora dati račun.

## Rešeni primeri

### Primer 1 (lažji): ali je vas v dosegu

Na zemljevidu z mrežo v kilometrih stoji oddajnik v točki $S(-2, 3)$, njegov doseg je $4\,\mathrm{km}$. Zapiši enačbo roba območja. Ali je vas $A(1, 6)$ v dosegu?

**Podatki:** središče $S(-2, 3)$, polmer $r = 4\,\mathrm{km}$, točka $A(1, 6)$
**Iščemo:** enačbo krožnice in lego točke $A$

:::formula
$(x - p)^2 + (y - q)^2 = r^2$; lego točke dobiš s primerjavo leve strani z $r^2$.
:::

**Rešitev:**

1. Vstavimo $p = -2$ in $q = 3$. Minus in minus dasta plus, zato: $(x + 2)^2 + (y - 3)^2 = 16$ je enačba roba.
2. Za točko $A$ izračunamo levo stran: $(1 + 2)^2 + (6 - 3)^2 = 18$.
3. Primerjamo: $18$ je več od $r^2 = 16$, torej je $A$ zunaj kroga.
4. Odgovor: rob območja je krožnica $(x + 2)^2 + (y - 3)^2 = 16$; vas $A$ ni v dosegu, a je blizu roba ($\sqrt{18} \approx 4{,}24\,\mathrm{km}$ od oddajnika).

### Primer 2: iz splošne oblike

Določi središče in polmer krožnice z enačbo $x^2 + y^2 - 6x + 4y - 12 = 0$.

**Podatki:** splošna oblika $x^2 + y^2 - 6x + 4y - 12 = 0$
**Iščemo:** središče $S$ in polmer $r$

:::formula
Dopolnjevanje do popolnega kvadrata: $x^2 + Dx = \left(x + \frac{D}{2}\right)^2 - \frac{D^2}{4}$
:::

**Rešitev:**

1. Člene z $x$: $x^2 - 6x = (x - 3)^2 - 9$, ker je polovica od $-6$ enaka $-3$.
2. Člene z $y$: $y^2 + 4y = (y + 2)^2 - 4$, ker je polovica od $4$ enaka $2$.
3. Vstavimo v enačbo: $(x - 3)^2 - 9 + (y + 2)^2 - 4 - 12 = 0$.
4. Števila prenesemo na desno, desna stran je $9 + 4 + 12 = 25$, torej enačba $(x - 3)^2 + (y + 2)^2 = 25$.
5. Odgovor: središče je $S(3, -2)$, polmer je $r = \sqrt{25} = 5$.

### Primer 3 (težji): Nikina cesta

Vrnimo se k Niki. Signal stolpa v $S(3, 2)$ seže $5\,\mathrm{km}$, cesta leži na premici $y = x - 2$ (mreža v kilometrih). Kje Nika vstopi v območje signala in kje izstopi? Koliko kilometrov ceste ima signal?

**Podatki:** krožnica $(x - 3)^2 + (y - 2)^2 = 25$, premica $y = x - 2$
**Iščemo:** presečišči $P_1$, $P_2$ in dolžino $s$ ceste med njima

:::formula
Vstavi $y$ iz premice v enačbo krožnice; dolžina daljice $P_1 P_2$ je $s = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.
:::

**Rešitev:**

1. Vstavimo $y = x - 2$, tedaj je $y - 2 = x - 4$ in dobimo enačbo $(x - 3)^2 + (x - 4)^2 = 25$.
2. Odpravimo oklepaje: $x^2 - 6x + 9 + x^2 - 8x + 16 = 25$, torej enačba $2x^2 - 14x = 0$.
3. Izpostavimo: $2x(x - 7) = 0$, rešitvi sta $x_1 = 0$ in $x_2 = 7$. Dve rešitvi pomenita sekanto.
4. Pripadajoča $y$ iz premice: $y_1 = 0 - 2 = -2$ in $y_2 = 7 - 2 = 5$. Presečišči sta $P_1(0, -2)$ in $P_2(7, 5)$.
5. Preverimo $P_2$ v enačbi krožnice: $4^2 + 3^2 = 25$. Drži.
6. Dolžina: $s = \sqrt{7^2 + 7^2} = \sqrt{98} \approx 9{,}9$, ker se $x$ in $y$ oba spremenita za $7$.
7. Odgovor: Nika vstopi v območje signala v točki $(0, -2)$ in izstopi v $(7, 5)$; signal ima na približno $9{,}9\,\mathrm{km}$ ceste.

### Primer 4 – zdaj ti

V bližini stolpa iz Primera 3 pelje še gozdna pot po premici $4x + 3y = 43$. Ali ima pot s krožnico $(x - 3)^2 + (y - 2)^2 = 25$ dve, eno ali nobene skupne točke?

**Podatki:** krožnica $(x - 3)^2 + (y - 2)^2 = 25$, premica $4x + 3y = 43$
**Iščemo:** lego premice glede na krožnico

:::formula
Vstavi $y$ v enačbo krožnice in poglej predznak diskriminante kvadratne enačbe.
:::

**Rešitev:**

1. Iz premice: $y = \frac{43 - 4x}{3}$, zato je $y - 2 = \frac{37 - 4x}{3}$.
2. Vstavimo in pomnožimo z $9$, da odpravimo ulomek: dobimo enačbo $9(x - 3)^2 + (37 - 4x)^2 = 225$.
3. Odpravimo oklepaje in uredimo: $25x^2 - 350x + 1225 = 0$; delimo s $25$ in dobimo enačbo $x^2 - 14x + 49 = 0$.
4. Izračunaj diskriminanto in povej, kakšna je premica. Če je skupna točka, jo poišči.

:::premisli
Kakšna je diskriminanta in kaj pove?
---
Diskriminanta je $14^2 - 4 \cdot 49 = 0$, zato je premica tangenta. Rešitev je $x = 7$, iz premice $y = 5$. Pot se območja signala le dotakne v točki $(7, 5)$. Preveriš lahko s skalarnim produktom: $\overrightarrow{ST} = (4, 3)$ je pravokoten na smer premice $(3, -4)$, ker je $4 \cdot 3 + 3 \cdot (-4) = 0$.
:::

### Primer 5: krožnica in parabola

Določi skupne točke krožnice $x^2 + y^2 = 25$ in parabole $y = \frac{4}{9}x^2$. Utemelji, zakaj ena od rešitev računa ne da točke.

**Podatki:** krožnica $x^2 + y^2 = 25$, parabola $y = \frac{4}{9}x^2$
**Iščemo:** skupne točke krožnice in parabole

:::formula
Iz parabole $x^2 = \frac{9y}{4}$ vstavi v enačbo krožnice; vsak $y$ da točke le, če je $x^2 \ge 0$.
:::

**Rešitev:**

1. Iz enačbe parabole: $x^2 = \frac{9y}{4}$.
2. Vstavimo v krožnico in pomnožimo s $4$: $9y + 4y^2 = 100$, torej enačba $4y^2 + 9y - 100 = 0$.
3. Diskriminanta: $9^2 + 4 \cdot 4 \cdot 100 = 1681 = 41^2$, zato $y = \frac{-9 \pm 41}{8}$. Rešitvi sta $y_1 = 4$ in $y_2 = -6{,}25$.
4. Pri $y_1 = 4$ je $x^2 = 9$, torej $x = 3$ ali $x = -3$.
5. Pri $y_2 = -6{,}25$ bi bil $x^2$ negativen. Ta rešitev ne da točke: parabola ne seže pod os $x$, krožnica pa sploh ne seže do $y = -6{,}25$.
6. Preizkus za $(3, 4)$: $3^2 + 4^2 = 25$ in $\frac{4}{9} \cdot 9 = 4$.

:::risba graf
opis: Krožnica s središčem v izhodišču in polmerom 5 ter parabola y = 4x²/9 s temenom v izhodišču, odprta navzgor. Sekata se v točkah P₁(3, 4) in P₂(−3, 4). Spodaj krožnica seže le do y = −5.
x: -7 .. 7 | 1 | x
y: -6 .. 9 | 1 | y
enako: da
krog: 0; 0 | 5 | modra debelo
f: 4/9*x^2 | oranžna debelo | -4,5 .. 4,5
točka: 3; 4 | P_1 | desno
točka: -3; 4 | P_2 | levo
:::

7. Odgovor: krožnica in parabola imata dve skupni točki, $P_1(3, 4)$ in $P_2(-3, 4)$. Rešitev $y = -6{,}25$ ne ustreza, ker bi zahtevala $x^2 < 0$.

## Pogoste napake

- **Napačen predznak središča.** Iz $(x + 2)^2 + (y - 3)^2 = 16$ kdo prebere $S(2, -3)$. V enačbi je razlika $x - p$, zato $x + 2$ pomeni $p = -2$. Pravilno: $S(-2, 3)$.
- **Polmer namesto kvadrata polmera.** Iz $(x - 1)^2 + y^2 = 9$ kdo prebere $r = 9$. Na desni je $r^2$, zato je $r = 3$. Obratno: pri $r = 4$ na desno napiši $16$, ne $4$.
- **Pri dopolnjevanju pozabiš odvzeti dodano.** Kdor $x^2 - 6x$ zamenja kar z $(x - 3)^2$, je k enačbi skrivaj prištel $9$. Prištevek moraš odšteti: $(x - 3)^2 - 9$.
- **Napačen predznak prostega člena.** Ko $F$ preneseš na desno, se predznak spremeni: $r^2 = \frac{D^2}{4} + \frac{E^2}{4} - F$. Kdor prišteje $F$, dobi prevelik ali premajhen polmer.
- **Vsaka enačba z $x^2 + y^2$ je krožnica.** Ni res: če je desna stran po dopolnjevanju $0$ ali negativna, dobiš le točko ali nič.

## Povzetek

- Krožnica s središčem $S(p, q)$ in polmerom $r$: $(x - p)^2 + (y - q)^2 = r^2$. Izhaja iz pogoja, da je razdalja točke od središča enaka $r$.
- V oklepaju je minus koordinata središča, na desni kvadrat polmera.
- Splošno obliko $x^2 + y^2 + Dx + Ey + F = 0$ prevedeš v središčno z dopolnjevanjem do popolnega kvadrata; krožnica je le, če je desna stran pozitivna.
- Lega točke: levo stran primerjaj z $r^2$ (manj znotraj, enako na krožnici, več zunaj).
- Lega premice: vstavi premico v krožnico; diskriminanta pozitivna – sekanta, $0$ – tangenta, negativna – mimobežnica. Enako pove primerjava razdalje $d$ središča od premice s polmerom.
- Tangenta je pravokotna na polmer v dotikališču.
- Krožnica je krivulja drugega reda. Presečišča z drugo krivuljo dobiš kot rešitve sistema; vsako rešitev preveri (pri $x^2 < 0$ ni točke).

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Daljica $AB$ s krajiščema $A(-1, 4)$ in $B(5, -4)$ je premer krožnice. Zapiši enačbo krožnice v središčni obliki.

**Rešitev:**

1. Središče je razpolovišče premera: $S\left(\frac{-1 + 5}{2}, \frac{4 + (-4)}{2}\right) = S(2, 0)$.
2. Dolžina premera je $|AB| = \sqrt{6^2 + (-8)^2} = \sqrt{100} = 10$, zato je polmer $r = 5$.
3. Odgovor: enačba krožnice je $(x - 2)^2 + y^2 = 25$.

**Točkovanje:** 1 točka za središče $S(2, 0)$, 1 točka za polmer $r = 5$, 1 točka za enačbo krožnice.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dani sta krožnica z enačbo $x^2 + y^2 + 4x - 2y - 20 = 0$ in premica z enačbo $x + y = 4$.

a) Določi središče $S$ in polmer krožnice. (2 točki)
b) Izračunaj presečišči $P_1$ in $P_2$ krožnice in premice. (3 točke)
c) Izračunaj ploščino trikotnika $S P_1 P_2$. (2 točki)

**Rešitev:**

1. a) Dopolnimo do popolnih kvadratov: $x^2 + 4x = (x + 2)^2 - 4$ in $y^2 - 2y = (y - 1)^2 - 1$.
2. a) Enačba postane $(x + 2)^2 - 4 + (y - 1)^2 - 1 - 20 = 0$ oziroma $(x + 2)^2 + (y - 1)^2 = 25$. Središče je $S(-2, 1)$, polmer $r = 5$.
3. b) Iz enačbe premice izrazimo $y = 4 - x$, zato je $y - 1 = 3 - x$. Vstavimo v enačbo krožnice: $(x + 2)^2 + (3 - x)^2 = 25$.
4. b) Odpravimo oklepaje: $x^2 + 4x + 4 + 9 - 6x + x^2 = 25$, torej $2x^2 - 2x - 12 = 0$ oziroma $x^2 - x - 6 = 0$.
5. b) Razstavimo: $(x - 3)(x + 2) = 0$, zato $x_1 = 3$ in $x_2 = -2$. Iz premice $y_1 = 1$ in $y_2 = 6$. Presečišči sta $P_1(3, 1)$ in $P_2(-2, 6)$.
6. c) Točki $S$ in $P_1$ imata enako ordinato, zato je $SP_1$ vzporedna z osjo $x$; točki $S$ in $P_2$ imata enako absciso, zato je $SP_2$ vzporedna z osjo $y$. Kot pri $S$ je pravi, kateti sta polmera dolžine $5$.
7. c) Ploščina: $\frac{5 \cdot 5}{2} = \frac{25}{2}$.
8. Odgovor: a) $S(-2, 1)$, $r = 5$; b) $P_1(3, 1)$ in $P_2(-2, 6)$; c) ploščina trikotnika je $\frac{25}{2}$ kvadratne enote.

**Točkovanje:** a) 1 točka za dopolnjevanje do popolnih kvadratov, 1 točka za središče in polmer; b) 1 točka za kvadratno enačbo po vstavljanju, 1 točka za obe abscisi, 1 točka za obe presečišči; c) 1 točka za utemeljitev pravega kota pri $S$ (ali drug pravilen postopek za ploščino), 1 točka za ploščino $\frac{25}{2}$.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dani sta krožnica z enačbo $x^2 + y^2 - 2x + 4y - 20 = 0$ in točka $A(8, -1)$.

a) Določi središče $S$ in polmer krožnice ter pokaži, da točka $A$ leži zunaj krožnice. (2 točki)
b) Pokaži, da točka $T(4, 2)$ leži na krožnici. Zapiši enačbo tangente na krožnico v točki $T$ in preveri, da gre skozi točko $A$. (3 točke)
c) Iz točke $A$ poteka še ena tangenta na krožnico. Zapiši njeno enačbo in izračunaj njeno dotikališče $B$. (3 točke)
d) Utemelji, da sta tangenti iz točke $A$ pravokotni, in izračunaj ploščino štirikotnika $ATSB$. (2 točki)

**Rešitev:**

1. a) Dopolnimo: $x^2 - 2x = (x - 1)^2 - 1$ in $y^2 + 4y = (y + 2)^2 - 4$, zato je enačba $(x - 1)^2 + (y + 2)^2 = 25$. Središče je $S(1, -2)$, polmer $r = 5$.
2. a) Za točko $A$: $(8 - 1)^2 + (-1 + 2)^2 = 49 + 1 = 50$. Ker je $50 > 25$, točka $A$ leži zunaj krožnice.
3. b) Za točko $T$: $(4 - 1)^2 + (2 + 2)^2 = 9 + 16 = 25$, zato $T$ leži na krožnici.
4. b) Tangenta je pravokotna na polmer $ST$, zato je $\overrightarrow{ST} = (3, 4)$ njen normalni vektor. Enačba tangente: $3(x - 4) + 4(y - 2) = 0$ oziroma $3x + 4y = 20$.
5. b) Preizkus za $A$: $3 \cdot 8 + 4 \cdot (-1) = 24 - 4 = 20$. Tangenta gre skozi $A$.
6. c) Navpična premica $x = 8$ je od središča oddaljena $8 - 1 = 7 > 5$, zato ni tangenta. Iščemo premico $y + 1 = k(x - 8)$ oziroma $kx - y - 8k - 1 = 0$.
7. c) Na premici je $y + 2 = kx - 8k + 1$. Vstavimo v enačbo krožnice: $(x - 1)^2 + (kx - 8k + 1)^2 = 25$, po ureditvi $(k^2 + 1)x^2 - 2(8k^2 - k + 1)x + 64k^2 - 16k - 23 = 0$.
8. c) Premica je tangenta natanko tedaj, ko je diskriminanta te kvadratne enačbe enaka $0$. Njena četrtina je $(8k^2 - k + 1)^2 - (k^2 + 1)(64k^2 - 16k - 23) = -24k^2 + 14k + 24$, zato $12k^2 - 7k - 12 = 0$. Rešitvi sta $k = \frac{7 \pm 25}{24}$, torej $k = \frac43$ in $k = -\frac34$. (Enako enačbo da pogoj, da je razdalja središča od premice enaka polmeru: $(1 - 7k)^2 = 25(k^2 + 1)$.)
9. c) Smerni koeficient $-\frac34$ ima tangenta iz b). Druga tangenta je $y + 1 = \frac43(x - 8)$ oziroma $4x - 3y = 35$.
10. c) Dotikališče: iz $y = \frac{4x - 35}{3}$ je $y + 2 = \frac{4x - 29}{3}$. Vstavimo v enačbo krožnice in pomnožimo z $9$: $9(x - 1)^2 + (4x - 29)^2 = 225$, torej $25x^2 - 250x + 625 = 0$ oziroma $(x - 5)^2 = 0$. Dvojna rešitev $x = 5$ da $y = \frac{20 - 35}{3} = -5$, zato je $B(5, -5)$.
11. d) Produkt smernih koeficientov je $\frac43 \cdot \left(-\frac34\right) = -1$, zato sta tangenti pravokotni.
12. d) Štirikotnik $ATSB$ ima pravi kot pri $A$ ter prava kota pri $T$ in $B$, ker je tangenta pravokotna na polmer. Zato je pravokotnik. Ker je $|ST| = |SB| = 5$, je kvadrat s stranico $5$. Ploščina je $25$.
13. Odgovor: a) $S(1, -2)$, $r = 5$, $A$ je zunaj; b) tangenta $3x + 4y = 20$; c) tangenta $4x - 3y = 35$ z dotikališčem $B(5, -5)$; d) ploščina štirikotnika $ATSB$ je $25$ kvadratnih enot.

**Točkovanje:** a) 1 točka za središče in polmer, 1 točka za utemeljitev, da je $A$ zunaj; b) 1 točka za preizkus, da $T$ leži na krožnici, 1 točka za normalo $\overrightarrow{ST}$ (ali smerni koeficient tangente $-\frac34$), 1 točka za enačbo tangente s preizkusom za $A$; c) 1 točka za pogoj tangentnosti (diskriminanta enaka $0$ ali razdalja središča od premice enaka polmeru), 1 točka za $k = \frac43$ in enačbo druge tangente, 1 točka za dotikališče $B(5, -5)$; d) 1 točka za utemeljitev pravokotnosti, 1 točka za ploščino $25$.

### Ustno vprašanje 1

:::premisli
Izpelji enačbo krožnice s središčem $S(p, q)$ in polmerom $r$.
---
Krožnica je množica vseh točk ravnine, ki so od središča $S(p, q)$ oddaljene za $r$. Za točko $T(x, y)$ je ta razdalja dolžina vektorja $\overrightarrow{ST} = (x - p, y - q)$, torej $\sqrt{(x - p)^2 + (y - q)^2}$. Iz pogoja $\sqrt{(x - p)^2 + (y - q)^2} = r$ s kvadriranjem dobimo $(x - p)^2 + (y - q)^2 = r^2$. Kvadriranje ne doda novih rešitev, ker sta obe strani nenegativni. Če je središče v izhodišču, je enačba $x^2 + y^2 = r^2$.
:::

### Ustno vprašanje 2

:::premisli
Navedi primer enačbe oblike $x^2 + y^2 + Dx + Ey + F = 0$, ki ne opisuje krožnice, in pojasni, kako to ugotoviš.
---
Primer je enačba $x^2 + y^2 - 2x + 5 = 0$. Z dopolnjevanjem do popolnega kvadrata jo preoblikujemo v $(x - 1)^2 + y^2 = -4$. Vsota kvadratov ne more biti negativna, zato tej enačbi ne ustreza nobena točka. V splošnem enačba opisuje krožnico le, če je $\frac{D^2}{4} + \frac{E^2}{4} - F > 0$; če je ta vrednost $0$, opisuje eno samo točko.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Kako zapišeš enačbo tangente na krožnico v dani točki krožnice in zakaj postopek deluje?
---
Tangenta krožnice je pravokotna na polmer v dotikališču $T$. Zato je vektor $\overrightarrow{ST}$ od središča do dotikališča normalni vektor tangente. Za središče $S(p, q)$ in dotikališče $T(x_0, y_0)$ je zato enačba tangente $(x_0 - p)(x - x_0) + (y_0 - q)(y - y_0) = 0$, saj je skalarni produkt vektorja $\overrightarrow{ST}$ in vektorja od $T$ do poljubne točke $(x, y)$ tangente enak $0$. Enakovredno je tangenta premica, ki je od središča oddaljena natanko $r$, oziroma premica, pri kateri ima kvadratna enačba sistema s krožnico dvojno rešitev.
:::

## Drugače: Kot zgodba

Stara gozdarka Meta je v gozdu zabila kol in nanj privezala kozo z vrvjo dolžine $5\,\mathrm{m}$. Koza je popasla vso travo, do katere je segla. Ko je Meta zjutraj pogledala, je bil v travi popasen krog, njegov rob pa točno krožnica: vsaka točka roba je bila $5\,\mathrm{m}$ od kola.

Meta je kol vpisala v svoj zemljevid kot $S(3, 2)$. Za vsako točko roba je veljalo, da sta vodoravni in navpični odmik od kola kateti pravokotnega trikotnika s hipotenuzo $5$. Po Pitagorovem izreku je zato $(x - 3)^2 + (y - 2)^2 = 25$.

Čez travnik je vodila ravna steza. Meta je hotela vedeti, ali bo koza dosegla stezo. Če je bila steza od kola bližje kot $5\,\mathrm{m}$, jo je koza prečkala na dveh mestih. Če je bila natanko $5\,\mathrm{m}$ daleč, se je je koza komaj dotaknila. Če je bila dlje, je koza sploh ni dosegla. To so sekanta, tangenta in mimobežnica.

## Drugače: Korak za korakom s številkami

Naloga: lega premice $y = x + 1$ in krožnice $x^2 + y^2 = 13$.

1. Iz premice je $y$ že izražen: $y = x + 1$.
2. Vstavimo v krožnico in dobimo enačbo $x^2 + (x + 1)^2 = 13$.
3. Kvadriramo: $x^2 + x^2 + 2x + 1 = 13$, to je enačba $2x^2 + 2x - 12 = 0$.
4. Delimo z $2$: enačba $x^2 + x - 6 = 0$.
5. Diskriminanta: $1^2 - 4 \cdot (-6) = 25$, pozitivna, torej sekanta.
6. Rešitvi: $x_1 = 2$ in $x_2 = -3$ (preveri: $2 \cdot (-3) = -6$, $2 + (-3) = -1$).
7. Iz premice: $y_1 = 3$, $y_2 = -2$. Presečišči sta $(2, 3)$ in $(-3, -2)$.
8. Preizkus: $2^2 + 3^2 = 13$ in $(-3)^2 + (-2)^2 = 13$. Obe točki ležita na krožnici.

## Preveri se

? Katera enačba izstopa, ker ne opisuje krožnice?
- $(x - 2)^2 + y^2 = 9$
~ To je krožnica s središčem $(2, 0)$ in polmerom $3$; manjkajoči $q$ pomeni $q = 0$.
- $x^2 + y^2 - 4x = 0$
~ Dopolnjevanje da $(x - 2)^2 + y^2 = 4$, kar je krožnica s polmerom $2$. Prosti člen $0$ ne pomeni, da krožnice ni.
+ $(x + 1)^2 + (y - 3)^2 = -4$
- $x^2 + y^2 + 2y = 3$
~ Dopolnjevanje da $x^2 + (y + 1)^2 = 4$, krožnica s središčem $(0, -1)$.
> Vsota kvadratov ne more biti negativna, zato enačbi $(x + 1)^2 + (y - 3)^2 = -4$ ne ustreza nobena točka.

? Določi središče in polmer krožnice $x^2 + y^2 + 8x - 2y + 8 = 0$.
- $S(4, -1)$, $r = 3$
~ Predznaka središča sta zamenjana: $x^2 + 8x = (x + 4)^2 - 16$ pomeni $p = -4$.
- $S(-4, 1)$, $r = 9$
~ $9$ je $r^2$, ne $r$. Polmer je koren desne strani.
+ $S(-4, 1)$, $r = 3$
- $S(-4, 1)$, $r = 5$
~ Tu je bil $8$ na desni prištet namesto odštet. Ko $+8$ preneseš na desno, dobiš $-8$.
> $(x + 4)^2 - 16 + (y - 1)^2 - 1 + 8 = 0$, torej $(x + 4)^2 + (y - 1)^2 = 9$ in $r = 3$.

? Ko vstaviš premico v enačbo krožnice, dobiš kvadratno enačbo z negativno diskriminanto. Kaj to pomeni?
- Premica je tangenta.
~ Tangenta da diskriminanto $0$ (ena dvojna rešitev), ne negativne.
- Premica gre skozi središče krožnice.
~ Premica skozi središče je vedno sekanta, diskriminanta je takrat pozitivna.
+ Premica in krožnica nimata skupnih točk.
- Napaka v računu, ker premica krožnico vedno seka.
~ Premica lahko gre tudi mimo krožnice; negativna diskriminanta je takrat pravilen rezultat.
> Brez realnih rešitev sistema ni skupnih točk: premica je mimobežnica, razdalja središča od premice je večja od polmera.

? Luka išče središče in polmer krožnice $x^2 + y^2 - 10x + 6y + 9 = 0$. Korak 1: $x^2 - 10x = (x - 5)^2 - 25$. Korak 2: $y^2 + 6y = (y + 3)^2 - 9$. Korak 3: $(x - 5)^2 + (y + 3)^2 = 25 + 9 + 9 = 43$. Korak 4: $S(5, -3)$, $r = \sqrt{43}$. Kateri korak je napačen?
- Korak 1
~ Polovica od $-10$ je $-5$, njen kvadrat $25$ je pravilno odštet.
- Korak 2
~ Polovica od $6$ je $3$, kvadrat $9$ je pravilno odštet.
+ Korak 3
- Korak 4
~ Središče $S(5, -3)$ je prebrano pravilno; napačen je le polmer, ki izhaja iz koraka 3.
> Prosti člen $+9$ se pri prenosu na desno spremeni v $-9$: desna stran je $25 + 9 - 9 = 25$, zato je $r = 5$.

? Dron ima doseg $3\,\mathrm{km}$ od vzletišča v izhodišču zemljevida (mreža v km). Ali doseže kmetijo v točki $(2, 2)$?
- Ne, ker je $2 + 2 = 4$ več od $3$.
~ Razdalja ni vsota koordinat. Sešteješ kvadrata in primerjaš z $r^2$.
+ Da, ker je $2^2 + 2^2 = 8$ manj od $3^2 = 9$.
- Kmetija leži točno na robu dosega.
~ Na robu bi bila, če bi bilo $x^2 + y^2 = 9$; tu je $8$.
> Kmetija je $\sqrt{8} \approx 2{,}83\,\mathrm{km}$ od vzletišča, torej znotraj kroga z enačbo roba $x^2 + y^2 = 9$.

? Koliko skupnih točk imata krožnica $x^2 + y^2 = 25$ in hiperbola $y = \frac{12}{x}$? Vpiši število (brez računala).
= 4
~ 2 | Upošteval si le pozitivna $x$. Za $x = -3$ in $x = -4$ dobiš točki na drugi veji hiperbole.
~ 0 | Kvadratna enačba za $x^2$ ima rešitvi $9$ in $16$, obe pozitivni.
> Vstavimo $y = \frac{12}{x}$ in pomnožimo z $x^2$: $x^4 - 25x^2 + 144 = 0$, torej $x^2 = 9$ ali $x^2 = 16$. Točke so $(3, 4)$, $(4, 3)$, $(-3, -4)$ in $(-4, -3)$.

<<RACUN
vrednost: sqrt((5+1)^2 + (-4-4)^2) | 10
enako: (x-2)^2 + y^2 - 25 | x^2 - 4*x + y^2 - 21
enako: (x+2)^2 + (y-1)^2 - 25 | x^2 + y^2 + 4*x - 2*y - 20
enako: (x+2)^2 + (3-x)^2 - 25 | 2*x^2 - 2*x - 12
resi: x^2 - x - 6 = 0 | x | -2, 3
vrednost: 5*5/2 | 25/2
enako: (x-1)^2 + (y+2)^2 - 25 | x^2 + y^2 - 2*x + 4*y - 20
vrednost: (8-1)^2 + (-1+2)^2 | 50
vrednost: (4-1)^2 + (2+2)^2 | 25
enako: 3*(x-4) + 4*(y-2) | 3*x + 4*y - 20
vrednost: 3*8 + 4*(-1) | 20
enako: (x-1)^2 + (k*x-8*k+1)^2 - 25 | (k^2+1)*x^2 - 2*(8*k^2-k+1)*x + 64*k^2 - 16*k - 23
enako: (8*k^2-k+1)^2 - (k^2+1)*(64*k^2-16*k-23) | -24*k^2 + 14*k + 24
resi: 12*k^2 - 7*k - 12 = 0 | k | -3/4, 4/3
resi: (1-7*k)^2 = 25*(k^2+1) | k | -3/4, 4/3
enako: 9*(x-1)^2 + (4*x-29)^2 - 225 | 25*(x-5)^2
vrednost: (5-1)^2 + (-5+2)^2 | 25
enako: 3*(y+1) - 4*(x-8) | 3*y - 4*x + 35
vrednost: (4/3)*(-3/4) | -1
enako: (x-1)^2 + y^2 + 4 | x^2 + y^2 - 2*x + 5
enako: (2*x^2 + 2*y^2 - 8*x)/2 | (x-2)^2 + y^2 - 4
enako: 4*(9*y/4 + y^2 - 25) | 4*y^2 + 9*y - 100
vrednost: 9^2 + 4*4*100 | 1681
resi: 4*y^2 + 9*y - 100 = 0 | y | -25/4, 4
vrednost: 9*4/4 | 9
vrednost: 3^2 + 4^2 | 25
vrednost: 4/9*9 | 4
enako: x^2*(x^2 + (12/x)^2 - 25) | x^4 - 25*x^2 + 144
resi: z^2 - 25*z + 144 = 0 | z | 9, 16
>>

:::simboli
x, y | koordinati točke na krožnici | | | v primerih v km
p, q | koordinati središča $S$ | | | $S(p, q)$
r | polmer krožnice | r = \sqrt{(x - p)^2 + (y - q)^2} | | razdalja točke krožnice od središča
D, E, F | koeficienti splošne oblike | | | $x^2 + y^2 + Dx + Ey + F = 0$
P_1, P_2 | presečišči premice in krožnice | | |
x_1, x_2 | abscisi presečišč | | |
y_1, y_2 | ordinati presečišč | | |
s | dolžina ceste med presečiščema | s = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} | km | dolžina tetive
:::
