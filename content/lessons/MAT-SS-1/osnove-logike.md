---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka. Na gradbišče pripeljejo štiri škatle ploščic. Vsaka ima dve nalepki: na eni strani škatle piše prostor, na nasprotni strani vrsta ploščic. Delovodja je postavil pravilo:

> Če je škatla za kopalnico, so v njej nedrseče ploščice.

Škatle stojijo tako, da pri vsaki vidiš le eno nalepko:

1. »kopalnica«
2. »dnevna soba«
3. »nedrseče«
4. »gladke«

Katere škatle moraš obrniti, da preveriš, ali se je dobavitelj držal pravila? Nobene ne obračaj odveč. Odgovor zapiši, preden bereš naprej.

Večina ljudi tu zgreši, ker so besede »če«, »ali« in »ni« v vsakdanjem jeziku ohlapne. Logika jih natančno opredeli. Z njo pravilno bereš izreke v matematiki, pa tudi pravila, navodila in pogodbe.

## Razlaga

**1. Izjava.** Izjava je poved, za katero lahko rečemo, da je **pravilna** (P) ali **nepravilna** (N), nikoli oboje hkrati. »Opeka je iz žgane gline« je pravilna izjava. »$2 + 3 = 6$« je nepravilna izjava. »Prinesi metro!« in »Je malta že suha?« nista izjavi: ukaz in vprašanje nista ne pravilna ne nepravilna. Izjave označujemo z velikimi črkami $A$, $B$, $C$.

*Preveri:* ali je »Vsak trikotnik ima štiri kote.« izjava? (Da, nepravilna izjava.)

**2. Negacija.** Negacija izjave $A$ je izjava »ni res, da $A$«. Pišemo $\neg A$ in beremo »ne $A$«. Negacija ima vedno nasprotno vrednost kot $A$.

Pazi pri besedi »vsi«. Da izjava »Vsi vijaki so pocinkani« ne drži, zadošča en sam nepocinkan vijak. Njena negacija je zato »Vsaj en vijak ni pocinkan«.

*Preveri:* kaj je negacija izjave »Deska je krajša od $2\,\text{m}$«? (»Deska ni krajša od $2\,\text{m}$«, torej je dolga $2\,\text{m}$ ali več.)

**3. Konjunkcija.** Z veznikom »in« sestavimo **konjunkcijo** $A \wedge B$. Je pravilna le, kadar sta pravilni **obe** izjavi. Zidar sme ometavati, če »je zid suh in je zunaj vsaj $5\,^\circ\text{C}$«; brez enega pogoja ne sme.

**4. Disjunkcija.** Z veznikom »ali« sestavimo **disjunkcijo** $A \vee B$. Je pravilna, kadar je pravilna **vsaj ena** izjava, tudi kadar sta pravilni obe (vključni »ali«). Navodilo »Ploščico prirežeš z rezalnikom ali z brusilko« ne prepoveduje, da uporabiš oboje.

Obe povezavi zapišemo v **pravilnostno tabelo**, kjer je v vsaki vrstici ena možnost za $A$ in $B$:

| $A$ | $B$ | $A \wedge B$ | $A \vee B$ |
|---|---|---|---|
| P | P | P | P |
| P | N | N | P |
| N | P | N | P |
| N | N | N | N |

*Preveri:* izjava $A$ je pravilna, $B$ nepravilna. Kakšna je $A \vee B$? (Pravilna, ker je pravilna vsaj ena.)

**5. Implikacija.** Poved »če $A$, potem $B$« je **implikacija** $A \Rightarrow B$. Izjavi $A$ rečemo **predpostavka**, izjavi $B$ **posledica**. Implikacija je kot obljuba: »Če bo jutri suho, bomo betonirali.« Obljubo prelomiš le, če je jutri suho in ne betonirate. Če dežuje, je ne moreš prelomiti, karkoli naredite. Zato:

> Implikacija $A \Rightarrow B$ je nepravilna samo, kadar je $A$ pravilna in $B$ nepravilna. V vseh drugih vrsticah je pravilna.

**6. Ekvivalenca.** Poved »$A$ natanko tedaj, ko $B$« je **ekvivalenca** $A \Leftrightarrow B$. Je pravilna, kadar imata $A$ in $B$ **enako** vrednost (obe P ali obe N).

| $A$ | $B$ | $A \Rightarrow B$ | $A \Leftrightarrow B$ |
|---|---|---|---|
| P | P | P | P |
| P | N | N | N |
| N | P | P | N |
| N | N | P | P |

:::premisli
Zdaj reši uganko z začetka. Pravilo je $A \Rightarrow B$, kjer je $A$ »škatla je za kopalnico« in $B$ »ploščice so nedrseče«. Katere škatle moraš obrniti in zakaj ne drugih?
---
Obrneš škatli 1 (»kopalnica«) in 4 (»gladke«). Pravilo krši le kopalniška škatla z gladkimi ploščicami ($A$ = P, $B$ = N). Le pri teh dveh škatlah je to mogoče. Škatla 2 ima $A$ = N, škatla 3 pa $B$ = P: tam je implikacija pravilna ne glede na drugo stran.
:::

**7. Sestavljene izjave.** Povezave lahko nizamo, na primer $\neg A \vee B$. Oklepaji povedo vrstni red; brez njih najprej računamo $\neg$, nato $\wedge$, za njo $\vee$, nato $\Rightarrow$ in na koncu $\Leftrightarrow$. Tako $\neg A \vee B$ pomeni $(\neg A) \vee B$, ne $\neg(A \vee B)$. Pravilnostno tabelo izpolnjujemo stolpec za stolpcem, od notranjih delov navzven.

Koliko vrstic potrebujemo? Vsaka izjava ima 2 možni vrednosti. Pri dveh izjavah je možnosti $2 \cdot 2 = 4$, pri treh pa $2^3 = 8$. Za $n$ izjav je vrstic

$$2^n$$

*Preveri:* koliko vrstic ima tabela izjave $(A \vee B) \wedge \neg C$? (Tri izjave, torej 8.)

**8. Tavtologija.** Sestavljena izjava, ki je pravilna v **vseh** vrsticah tabele, je **tavtologija**. Primer je $A \vee \neg A$: »Deska je ravna ali ni ravna.« Izjava, ki je nepravilna v vseh vrsticah, je **protislovje**, na primer $A \wedge \neg A$.

**9. Enakovredne izjave.** Izjavi sta **enakovredni**, če imata v vsaki vrstici tabele enako vrednost. Pišemo $\equiv$. Pomembna primera:

$$A \Rightarrow B \;\equiv\; \neg A \vee B$$

$$A \Rightarrow B \;\equiv\; \neg B \Rightarrow \neg A$$

Izjavi $\neg B \Rightarrow \neg A$ rečemo **kontrapozicija** implikacije. Izjava $B \Rightarrow A$ je **obrat** implikacije.

:::premisli
Napovej, preden preveriš: ali je obrat $B \Rightarrow A$ enakovreden implikaciji $A \Rightarrow B$? Poišči vrstico, ki odloči.
---
Ni enakovreden. V vrstici $A$ = N, $B$ = P je $A \Rightarrow B$ pravilna, $B \Rightarrow A$ pa nepravilna (predpostavka $B$ je pravilna, posledica $A$ ne). Ena različna vrstica zadošča. Nedrseče ploščice gredo lahko tudi na teraso, zato iz »nedrseče« ne sledi »kopalnica«.
:::

V simulaciji spodaj »Pravilnostne tabele in enakovredne izjave« izberi za izjavo 1 $A \Rightarrow B$, za izjavo 2 pa najprej $B \Rightarrow A$, nato $\neg B \Rightarrow \neg A$. Opazuj, v katerih vrsticah se stolpca razlikujeta.

## Rešeni primeri

### Primer 1: vrednost sestavljenih izjav

Mizar meri desko. Izjava $A$: »Deska je dolga $2\,\text{m}$.« je pravilna, izjava $B$: »Deska je iz hrastovine.« pa nepravilna. Določi vrednost izjav $A \wedge B$, $A \vee B$, $\neg A \Rightarrow B$ in $A \Leftrightarrow B$.

**Podatki:** $A$ = P, $B$ = N
**Iščemo:** vrednosti izjav $A \wedge B$, $A \vee B$, $\neg A \Rightarrow B$, $A \Leftrightarrow B$

:::formula
$A \wedge B$ je P le, ko sta obe P. $A \vee B$ je P, ko je vsaj ena P. $X \Rightarrow Y$ je N le pri $X$ = P, $Y$ = N. $A \Leftrightarrow B$ je P, ko imata enako vrednost.
:::

**Rešitev:**

1. $A \wedge B$: ena izjava je N, zato je konjunkcija **N**.
2. $A \vee B$: $A$ je P, to zadošča, zato je disjunkcija **P**.
3. $\neg A$ je N, ker je $A$ pravilna. Implikacija z nepravilno predpostavko je vedno pravilna, zato je $\neg A \Rightarrow B$ **P**.
4. $A \Leftrightarrow B$: vrednosti sta različni, zato je ekvivalenca **N**.
5. Odgovor: $A \wedge B$ in $A \Leftrightarrow B$ sta nepravilni, $A \vee B$ in $\neg A \Rightarrow B$ sta pravilni.

### Primer 2: ali je izjava tavtologija

Ali je izjava $(A \wedge B) \Rightarrow A$ tavtologija? Pomen: »Če je zid suh in raven, potem je zid suh.«

**Podatki:** izjava $(A \wedge B) \Rightarrow A$ z dvema izjavama $A$ in $B$
**Iščemo:** ali je izjava pravilna v vseh vrsticah tabele

:::formula
Tabela ima $2^2 = 4$ vrstice. $X \Rightarrow Y$ je N le pri $X$ = P, $Y$ = N.
:::

**Rešitev:**

1. Dve izjavi pomenita 4 vrstice: PP, PN, NP, NN.
2. Najprej notranji del $A \wedge B$, nato implikacijo s posledico $A$:

| $A$ | $B$ | $A \wedge B$ | $(A \wedge B) \Rightarrow A$ |
|---|---|---|---|
| P | P | P | P |
| P | N | N | P |
| N | P | N | P |
| N | N | N | P |

3. Predpostavka $A \wedge B$ je pravilna le v prvi vrstici, tam pa je pravilna tudi posledica $A$. V ostalih vrsticah je predpostavka N, zato je implikacija P.
4. Odgovor: zadnji stolpec ima same P, zato je $(A \wedge B) \Rightarrow A$ tavtologija.

### Primer 3: pravilo na gradbišču

Delovodja je izobesil pravilo: »Če je zunaj pod $5\,^\circ\text{C}$, ne betoniramo.« Sodelavec reče: »Torej: če ne betoniramo, je zunaj pod $5\,^\circ\text{C}$.« Ali je sodelavčeva poved enakovredna pravilu? Katera poved pa pravilu res je enakovredna?

**Podatki:** $A$: »zunaj je pod $5\,^\circ\text{C}$«, $B$: »betoniramo«; pravilo »če $A$, potem ne $B$«; sodelavec »če ne $B$, potem $A$«
**Iščemo:** ali sta povedi enakovredni in poved, enakovredna pravilu

:::formula
$X \Rightarrow Y \;\equiv\; \neg Y \Rightarrow \neg X$ (kontrapozicija). Obrat $Y \Rightarrow X$ v splošnem ni enakovreden.
:::

**Rešitev:**

1. Zapišemo s simboli. Pravilo je $A \Rightarrow \neg B$. Sodelavec trdi $\neg B \Rightarrow A$, kar je obrat pravila.
2. Iščemo vrstico, kjer se razlikujeta. Vzemimo $A$ = N in $B$ = N: toplo je, a ne betoniramo, ker dežuje. Potem je $\neg B$ = P.
3. Pravilo $A \Rightarrow \neg B$ ima predpostavko N, zato je pravilno.
4. Sodelavčeva poved $\neg B \Rightarrow A$ ima predpostavko P in posledico N, zato je nepravilna. Povedi torej nista enakovredni.
5. Enakovredna je kontrapozicija: $\neg(\neg B) \Rightarrow \neg A$, torej $B \Rightarrow \neg A$.
6. Odgovor: sodelavec se moti. Pravilu je enakovredna poved »Če betoniramo, zunaj ni pod $5\,^\circ\text{C}$.«

### Primer 4: zdaj ti

Zidar reče: »Ni res, da je zid suh in raven.« Ali to pomeni isto kot »Zid ni suh ali zid ni raven«? Preveri, ali velja $\neg(A \wedge B) \equiv \neg A \vee \neg B$.

**Podatki:** $A$: »zid je suh«, $B$: »zid je raven«; izjavi $\neg(A \wedge B)$ in $\neg A \vee \neg B$
**Iščemo:** ali imata izjavi v vseh vrsticah enako vrednost

:::formula
Izjavi sta enakovredni, če se njuna stolpca ujemata v vseh $2^2 = 4$ vrsticah.
:::

**Rešitev:**

1. $A \wedge B$ je P le v vrstici PP. Negacija vrednosti obrne, zato ima $\neg(A \wedge B)$ v vrsticah PP, PN, NP, NN vrednosti N, P, P, P.
2. Za drugo izjavo potrebuješ $\neg A$ in $\neg B$. V vrstici PP sta obe N, zato je $\neg A \vee \neg B$ tam N.
3. Izpolni še vrstice PN, NP in NN ter primerjaj stolpca.

:::premisli
Kakšne vrednosti ima $\neg A \vee \neg B$ v vrsticah PN, NP in NN? Sta izjavi enakovredni?
---
V vrstici PN je $\neg B$ = P, v NP je $\neg A$ = P, v NN sta obe P. Disjunkcija je zato v vseh treh vrsticah P. Stolpec je N, P, P, P, enak kot pri $\neg(A \wedge B)$. Izjavi sta enakovredni. To je eno od **De Morganovih pravil**: negacija konjunkcije je disjunkcija negacij.
:::

## Pogoste napake

- **»Vsi« zanikaš z »noben«.** Za kršitev »Vsi vijaki so pocinkani« zadošča en vijak. Negacija je »Vsaj en vijak ni pocinkan«, ne »Noben vijak ni pocinkan«.
- **»Ali« razumeš izključno.** Misliš, da je $A \vee B$ nepravilna, kadar sta pravilni obe. V matematiki je »ali« vključni: nepravilna je samo pri $A$ = N, $B$ = N.
- **Implikacija z nepravilno predpostavko je »nepravilna«.** Ko predpostavka ne drži, obljube ne prelomiš, zato je implikacija pravilna.
- **Obrat je isto kot implikacija.** Iz »če $A$, potem $B$« ne sledi »če $B$, potem $A$«. Enakovredna je le kontrapozicija $\neg B \Rightarrow \neg A$.
- **Negacijo »razdeliš« brez menjave veznika.** $\neg(A \wedge B)$ ni $\neg A \wedge \neg B$. Pri negaciji se »in« zamenja z »ali«: $\neg(A \wedge B) \equiv \neg A \vee \neg B$.

## Povzetek

- Izjava je poved, ki je pravilna (P) ali nepravilna (N).
- $\neg A$ ima nasprotno vrednost. $A \wedge B$ je P le, ko sta obe P. $A \vee B$ je P, ko je vsaj ena P (vključni »ali«).
- $A \Rightarrow B$ je N le pri $A$ = P, $B$ = N. $A \Leftrightarrow B$ je P, ko imata enako vrednost.
- Pravilnostna tabela za $n$ izjav ima $2^n$ vrstic.
- Tavtologija je pravilna v vseh vrsticah (npr. $A \vee \neg A$), protislovje v nobeni.
- Enakovredni izjavi ($\equiv$) se ujemata v vseh vrsticah: $A \Rightarrow B \equiv \neg B \Rightarrow \neg A \equiv \neg A \vee B$; obrat $B \Rightarrow A$ ni enakovreden.
- De Morgan: $\neg(A \wedge B) \equiv \neg A \vee \neg B$ in $\neg(A \vee B) \equiv \neg A \wedge \neg B$.

## Ponovitev

**Formule**
- $A \wedge B$ je P le, ko sta obe P (na pamet)
- $A \vee B$ je N le, ko sta obe N (vključni »ali«) (na pamet)
- $A \Rightarrow B$ je N le pri $A$ = P, $B$ = N (na pamet)
- $A \Leftrightarrow B$ je P, ko imata enako vrednost (na pamet)
- $A \Rightarrow B \equiv \neg B \Rightarrow \neg A \equiv \neg A \vee B$ (na pamet)
- $\neg(A \wedge B) \equiv \neg A \vee \neg B$, $\neg(A \vee B) \equiv \neg A \wedge \neg B$ (na pamet)

**Postopek**
1. Za $n$ izjav napiši tabelo z $2^n$ vrsticami.
2. Dodaj stolpec za vsak delni izraz, od notranjih oklepajev navzven.
3. Stolpce izpolni po pravilih veznikov.
4. Vse P: tavtologija; vse N: protislovje; enaka stolpca: enakovredni izjavi.

**Pazi na**
- Negacija »vsi so« je »vsaj en ni«, ne »noben ni«.
- Implikacija z nepravilno predpostavko je pravilna.
- Obrat $B \Rightarrow A$ ni enakovreden $A \Rightarrow B$; enakovredna je le kontrapozicija.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Izjavi $A$ in $C$ sta nepravilni, izjava $B$ pa je pravilna. Določi logično vrednost izjave $\neg A \wedge B \Rightarrow C \vee \neg B$.

**Rešitev:**

1. Po vrstnem redu operacij (najprej $\neg$, nato $\wedge$, $\vee$ in šele nato $\Rightarrow$) izjavo beremo kot $(\neg A \wedge B) \Rightarrow (C \vee \neg B)$.
2. Predpostavka: $\neg A$ je P in $B$ je P, zato je $\neg A \wedge B$ pravilna (P).
3. Posledica: $C$ je N in $\neg B$ je N, zato je $C \vee \neg B$ nepravilna (N).
4. Implikacija s pravilno predpostavko in nepravilno posledico je nepravilna.
5. Odgovor: izjava $\neg A \wedge B \Rightarrow C \vee \neg B$ je nepravilna (N).

**Točkovanje:** 1 točka za pravilno postavljene oklepaje (vrstni red operacij), 1 točka za vrednosti predpostavke (P) in posledice (N), 1 točka za končno vrednost N.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Naj bosta $A$ in $B$ poljubni izjavi.

a) Sestavi pravilnostno tabelo za izjavi $\neg(A \Rightarrow B)$ in $A \wedge \neg B$. (2 točki)
b) Ali sta izjavi iz a) enakovredni? Odgovor utemelji. (1 točka)
c) Naj bo $A$ izjava »Piha močan veter«, $B$ pa izjava »Trajekt ostane v pristanišču«. Z besedami zapiši izjavo $A \Rightarrow B$ in njeno negacijo, pri čemer v negaciji ne uporabiš besed »ni res, da«. (2 točki)
d) Ali je izjava $(A \Rightarrow B) \vee (B \Rightarrow A)$ tavtologija? Odgovor utemelji. (2 točki)

**Rešitev:**

1. a) Tabela ima $2^2 = 4$ vrstice. Implikacija $A \Rightarrow B$ je nepravilna le v vrstici $A$ = P, $B$ = N (po vrsticah P, N, P, P), zato je $\neg(A \Rightarrow B)$ pravilna le v tej vrstici. Negacija $\neg B$ je po vrsticah N, P, N, P, zato je $A \wedge \neg B$ pravilna le pri $A$ = P, $B$ = N:

| $A$ | $B$ | $\neg(A \Rightarrow B)$ | $A \wedge \neg B$ |
|---|---|---|---|
| P | P | N | N |
| P | N | P | P |
| N | P | N | N |
| N | N | N | N |

2. b) Stolpca izjav $\neg(A \Rightarrow B)$ in $A \wedge \neg B$ se ujemata v vseh štirih vrsticah (N, P, N, N), zato sta izjavi enakovredni: $\neg(A \Rightarrow B) \equiv A \wedge \neg B$.
3. c) Implikacija $A \Rightarrow B$: »Če piha močan veter, trajekt ostane v pristanišču.«
4. c) Po b) je negacija enakovredna izjavi $A \wedge \neg B$: »Piha močan veter in trajekt ne ostane v pristanišču.«
5. d) Sestavimo tabelo obeh implikacij:

| $A$ | $B$ | $A \Rightarrow B$ | $B \Rightarrow A$ |
|---|---|---|---|
| P | P | P | P |
| P | N | N | P |
| N | P | P | N |
| N | N | P | P |

6. d) V vsaki vrstici je pravilna vsaj ena od obeh implikacij, zato je disjunkcija $(A \Rightarrow B) \vee (B \Rightarrow A)$ v vseh štirih vrsticah pravilna (P, P, P, P) in je tavtologija. Razlog: $A \Rightarrow B$ je nepravilna le pri $A$ = P in $B$ = N, takrat pa je $B \Rightarrow A$ pravilna.
7. Odgovor: izjavi $\neg(A \Rightarrow B)$ in $A \wedge \neg B$ sta enakovredni; negacija je »Piha močan veter in trajekt ne ostane v pristanišču«; izjava $(A \Rightarrow B) \vee (B \Rightarrow A)$ je tavtologija.

**Točkovanje:** a) 1 točka za stolpec $\neg(A \Rightarrow B)$, 1 točka za stolpec $A \wedge \neg B$; b) 1 točka za sklep o enakovrednosti z utemeljitvijo (ujemanje v vseh vrsticah); c) 1 točka za implikacijo z besedami, 1 točka za pravilno negacijo; d) 1 točka za vrednosti obeh implikacij v vseh vrsticah ali razmislek o edini vrstici, v kateri je $A \Rightarrow B$ nepravilna, 1 točka za sklep, da je izjava tavtologija.

### Ustno vprašanje 1

:::premisli
Koliko vrstic ima pravilnostna tabela sestavljene izjave z $n$ enostavnimi izjavami? Odgovor utemelji.
---
Pravilnostna tabela sestavljene izjave z $n$ enostavnimi izjavami ima $2^n$ vrstic. Vsaka enostavna izjava je lahko pravilna ali nepravilna, torej ima dve možni vrednosti. Vsaka nova izjava število vrstic podvoji, saj vsako dosedanjo kombinacijo vzamemo enkrat z vrednostjo P in enkrat z vrednostjo N.
:::

### Ustno vprašanje 2

:::premisli
Kaj je tavtologija? Navedi primer in pojasni, kako preverimo, ali je izjava tavtologija.
---
Tavtologija je sestavljena izjava, ki je pravilna pri vseh vrednostih enostavnih izjav, iz katerih je sestavljena. Primer je izjava $A \vee \neg A$, saj je vedno pravilna izjava $A$ ali njena negacija. Tavtologijo preverimo s pravilnostno tabelo. V stolpcu izjave so v vseh vrsticah same P. Izjava, ki je nepravilna v vseh vrsticah, je protislovje, na primer $A \wedge \neg A$.
:::

### Ustno vprašanje 3

:::premisli
Kaj sta obrat in kontrapozicija implikacije $A \Rightarrow B$? Kateri od njiju je implikaciji enakovreden?
---
Obrat implikacije $A \Rightarrow B$ je izjava $B \Rightarrow A$, kontrapozicija pa izjava $\neg B \Rightarrow \neg A$. Kontrapozicija je implikaciji enakovredna, saj sta obe nepravilni le pri $A$ = P in $B$ = N. Obrat ni enakovreden, ker je pri $A$ = N in $B$ = P implikacija $A \Rightarrow B$ pravilna, obrat $B \Rightarrow A$ pa nepravilen. Na enakovrednosti implikacije in kontrapozicije temelji posredni dokaz.
:::

## Drugače: Na sliki

Predstavljaj si delavnico z lučjo in dvema stikaloma. Stikalo $A$ je vklopljeno, ko je izjava $A$ pravilna, in luč sveti, ko je sestavljena izjava pravilna.

```
Konjunkcija A ∧ B (zaporedno):
  vir ──[A]──[B]── luč

Disjunkcija A ∨ B (vzporedno):
        ┌──[A]──┐
  vir ──┤       ├── luč
        └──[B]──┘
```

- **Zaporedno:** luč sveti le, če sta vklopljeni obe stikali. To je $A \wedge B$.
- **Vzporedno:** luč sveti, če je vklopljeno vsaj eno stikalo, tudi obe. To je $A \vee B$.
- **Negacija** je stikalo, ki deluje narobe: ko ga vklopiš, prekine tok.

Implikacijo si nariši kot tabelo s štirimi polji in prečrtaj samo polje »$A$ = P, $B$ = N«. Pri uganki obrneš ravno škatli, ki bi lahko padli v to polje.

## Drugače: Bolj natančno

- **Izjavna forma.** Poved »$x + 2 = 5$« ni izjava, dokler ne veš, kaj je $x$: pri $x = 3$ je pravilna, pri $x = 4$ nepravilna.
- **Vse povezave iz treh.** Implikacijo in ekvivalenco lahko zapišemo samo z $\neg$, $\wedge$ in $\vee$: velja $A \Rightarrow B \equiv \neg A \vee B$ in $A \Leftrightarrow B \equiv (A \Rightarrow B) \wedge (B \Rightarrow A)$. Ekvivalenca je torej implikacija v obe smeri.
- **Zakaj kontrapozicija.** Izrek »če $A$, potem $B$« lahko dokažemo tudi tako, da pokažemo: če $B$ ne drži, ne drži niti $A$. Na tem temelji posredni dokaz.

## Preveri se

? Katera trditev o implikaciji $A \Rightarrow B$ je pravilna?
+ Nepravilna je samo, kadar je $A$ pravilna in $B$ nepravilna.
- Nepravilna je vedno, kadar je $A$ nepravilna.
~ Z nepravilno predpostavko implikacije ne moreš prelomiti, zato je takrat pravilna.
- Pravilna je samo, kadar sta $A$ in $B$ obe pravilni.
~ To je lastnost konjunkcije $A \wedge B$, ne implikacije.
- Pravilna je samo, kadar imata $A$ in $B$ enako vrednost.
~ To je lastnost ekvivalence $A \Leftrightarrow B$. Implikacija je pravilna tudi pri $A$ = N, $B$ = P.
> Implikacija je kot obljuba: prelomljena je samo, če predpostavka drži, posledica pa ne.

? (brez računala) Koliko vrstic ima pravilnostna tabela izjave $(A \wedge B) \Rightarrow C$?
= 8
~ 6 | To je $2 \cdot 3$. Vsaka izjava število vrstic podvoji, zato računaš $2^3$, ne $2 \cdot 3$.
~ 3 | Preštel si samo izjave. Vrstic je toliko, kolikor je vseh kombinacij vrednosti.
~ 4 | Štiri vrstice ima tabela z dvema izjavama. Tu so tri: $A$, $B$ in $C$.
> Tri izjave, vsaka P ali N: $2^3 = 8$ vrstic.

? Jure je preverjal, ali velja $\neg(A \wedge B) \equiv \neg A \wedge \neg B$. Zapisal je: »Pri $A$ = P in $B$ = P sta obe izjavi N, torej sta enakovredni.« Kje je napaka?
- Napake ni, izjavi sta res enakovredni.
~ Negacija »razdeljena« brez menjave veznika ne da enakovredne izjave. Pravilno je $\neg(A \wedge B) \equiv \neg A \vee \neg B$.
+ Preveril je samo eno vrstico. Pri $A$ = P, $B$ = N je $\neg(A \wedge B)$ pravilna, $\neg A \wedge \neg B$ pa nepravilna.
- Pri $A$ = P in $B$ = P je $\neg(A \wedge B)$ pravilna, ne nepravilna.
~ $A \wedge B$ je tu pravilna, negacija pa jo obrne v nepravilno. To vrstico je Jure izračunal prav.
> Stolpca enakovrednih izjav se ujemata v vseh štirih vrsticah. Ena različna vrstica že pove, da izjavi nista enakovredni.

? Primerjaj implikacijo $A \Rightarrow B$ z njenim obratom $B \Rightarrow A$ in s kontrapozicijo $\neg B \Rightarrow \neg A$. Kaj velja?
- Implikaciji je enakovreden samo obrat $B \Rightarrow A$.
~ Obrat se razlikuje v vrstici $A$ = N, $B$ = P: tam je $A \Rightarrow B$ pravilna, $B \Rightarrow A$ pa ne.
+ Implikaciji je enakovredna samo kontrapozicija $\neg B \Rightarrow \neg A$.
- Enakovredna sta ji oba.
~ Kontrapozicija je, obrat pa ne: v vrstici $A$ = N, $B$ = P se razlikuje.
- Nobena ni enakovredna, ker so črke v drugem vrstnem redu.
~ Odloča ujemanje stolpcev v vseh vrsticah, ne vrstni red črk. Pri kontrapoziciji se stolpca ujemata.
> Kontrapozicija je nepravilna le pri $B$ = N in $A$ = P, tako kot implikacija. Obrat pa je nepravilen pri $A$ = N, $B$ = P.

? Na vratih delavnice piše: »Če delaš z brusilko, nosiš zaščitna očala.« Kdo krši pravilo?
- Tine, ki ne brusi, a nosi očala.
~ Tine ne brusi, zato je predpostavka nepravilna in pravila ne more kršiti. Očala so mu dovoljena.
- Ana, ki ne brusi in nima očal.
~ Predpostavka je nepravilna, zato je implikacija pravilna. Pravilo velja le za tiste, ki brusijo.
+ Luka, ki brusi brez očal.
- Luka in Ana, ker sta oba brez očal.
~ Gledaš samo posledico. Ana ne brusi, zato je predpostavka nepravilna in pravila ne krši.
> Implikacija je nepravilna samo pri predpostavki P in posledici N: Luka brusi (P), očal nima (N).

? (brez računala) V koliko vrsticah pravilnostne tabele je izjava $(A \vee B) \Rightarrow C$ nepravilna?
= 3
~ 1 | Upošteval si le vrstico $A$ = P, $B$ = P. Disjunkcija $A \vee B$ je pravilna v treh od štirih kombinacij $A$ in $B$.
~ 4 | To so vse vrstice s $C$ = N. Pri $A$ = N in $B$ = N je predpostavka nepravilna, zato je implikacija tam pravilna.
~ 5 | To je število vrstic, v katerih je izjava pravilna. Vprašanje sprašuje po nepravilnih.
> Implikacija je nepravilna le, ko je predpostavka $A \vee B$ pravilna (to je v $3$ od $4$ kombinacij $A$ in $B$) in posledica $C$ nepravilna. Takih vrstic je $3 \cdot 1 = 3$, od vseh $2^3 = 8$.

<<RACUN
vrednost: 2^2 | 4
vrednost: 2^3 | 8
>>

:::simboli
A, B, C | izjava | | | pravilna (P) ali nepravilna (N)
X, Y | poljubna (sestavljena) izjava | | | 
n | število izjav | | | tabela ima $2^n$ vrstic
:::
