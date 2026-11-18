---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Prva situacija. Pot od parkirišča do planinske koče je na zemljevidu dolga $30\,\text{km}$. Prvih $6\,\text{km}$ se pelješ z gondolo, preostanek razdeliš na $3$ enako dolge dnevne etape. Koliko kilometrov prehodiš na dan?

Druga situacija. Družina za izlet z vlakom plača skupaj $30\,\text{€}$: $3$ enake vozovnice in $6\,\text{€}$ za parkiranje ob postaji. Koliko stane ena vozovnica?

Nalogi sta videti različni: prva govori o kilometrih, druga o evrih. Ko pa neznano število označiš z $x$, obe opiše **ista enačba**:

$$3x + 6 = 30$$

Kdor jo zna rešiti, odgovori na obe vprašanji hkrati. Z istim postopkom rešiš tudi enačbe, pri katerih ugibanje ne pomaga več, na primer $2(x - 3) - 4 = 5x + 2(1 - x)$. S **preizkusom** pa sam preveriš, ali je rešitev prava, brez rešitev na koncu knjige.

## Razlaga

**1. Mamljiva bližnjica.** Jan reši enačbo $3x + 6 = 30$ v enem zamahu: »Delim s $3$ in dobim $x + 6 = 10$, torej $x = 4$.« Videti je hitro in pametno. Preverimo: $3 \cdot 4 + 6 = 18$, desna stran pa je $30$. Rešitev ni prava.

Kje se je zalomilo? Jan je s $3$ delil samo člen $3x$, števila $6$ pa ne. Ko delimo stran enačbe, delimo **celo** stran: $(3x + 6) : 3 = x + 2$.

:::premisli
Kakšno enačbo bi Jan dobil, če bi s $3$ pravilno delil celo levo in celo desno stran? Koliko je potem $x$?
---
$x + 2 = 10$, torej $x = 8$. Preizkus: $3 \cdot 8 + 6 = 30$. ✓ Dnevna etapa je dolga $8\,\text{km}$, vozovnica stane $8\,\text{€}$.
:::

**2. Enačba kot tehtnica.** Predstavljaj si tehtnico v ravnovesju. Na levi skledi so $3$ enake vrečke, vsaka tehta $x$, in še $6$ uteži po $1\,\text{kg}$. Na desni skledi je $30$ uteži. Ravnovesje ostane, če z **obema skledama** naredimo isto:

- na obeh straneh prištejemo ali odštejemo isto število ali isti člen z $x$,
- obe strani pomnožimo ali delimo z istim številom, ki ni $0$.

Takim korakom pravimo **ekvivalentna preoblikovanja**: enačba se spremeni, rešitev ostane ista. Na tehtnici z obeh skled odvzamemo $6$ uteži in ostane $3x = 24$. Nato vsebino obeh skled razdelimo na $3$ enake dele: $x = 8$.

**3. Kaj je linearna enačba.** Enačbi, v kateri je neznanka $x$ le v prvi potenci (brez $x^2$ in brez $x$ v imenovalcu), pravimo **linearna enačba**. **Rešitev** enačbe je število, ki enačbo spremeni v resnično enakost. Enačba $3x + 6 = 30$ je linearna, njena rešitev je $8$.

**4. Druga bližnjica: »prenesi čez enačaj«.** Pogosto slišiš: »Število prenesi na drugo stran in mu spremeni predznak.« Iz $x + 4 = 9$ tako dobiš $x = 9 - 4 = 5$. To je le kratek zapis odštevanja $4$ na obeh straneh. Kdor pozabi, od kod pravilo, hitro zapiše $x = 9 + 4$. Zato v rešitvah vedno povemo, kaj naredimo z obema stranema.

**5. Formalni postopek.** Pri zahtevnejših enačbah gremo vedno po istih korakih:

1. Odpravi oklepaje: z zunanjim faktorjem pomnoži vsak člen v oklepaju.
2. Na vsaki strani posebej združi podobne člene.
3. Člene z $x$ spravi na eno stran, števila na drugo (na obeh straneh prištej ali odštej).
4. Obe strani deli s koeficientom pri $x$.
5. Naredi preizkus.

**6. Preizkus.** Rešitev vstavi v **prvotno** enačbo. Posebej izračunaj levo in posebej desno stran. Če sta enaki, je rešitev prava. Če nista, je nekje v postopku napaka, četudi je vsak korak videti pravilen.

V simulaciji spodaj (»Reševanje enačb s tehtnico«) enačbo reši z gumbi. Nato z drsnikom »preizkusi x =« nastavi dobljeno število. Tehtnica je v ravnovesju le pri pravi rešitvi, pri vsakem drugem $x$ se nagne. To je preizkus na tehtnici.

:::premisli
Neža je rešila enačbo in dobila $x = 3$. Preizkus je naredila v vmesni enačbi iz drugega koraka in drži. Ali je s tem gotovo, da je $x = 3$ rešitev prvotne enačbe? Zakaj?
---
Ni gotovo. Če se je zmotila že v prvem koraku, je vmesna enačba napačna in $x = 3$ reši le njo. Preizkus v prvotni enačbi preveri vse korake hkrati.
:::

**7. Ko $x$ izgine.** Včasih se členi z $x$ pri preoblikovanju v celoti odštejejo.

- Ostane resnična enakost, na primer $5 = 5$: vsako število je rešitev, enačba ima **neskončno mnogo rešitev**.
- Ostane neresnična enakost, na primer $3 = 7$: enačba **nima rešitve**.

## Rešeni primeri

### Primer 1 (lažji): vožnja s taksijem

Taksi z letališča zaračuna $5\,\text{€}$ za začetek vožnje in $3\,\text{€}$ za vsak kilometer. Vožnja do hotela je stala $20\,\text{€}$. Število prevoženih kilometrov $x$ opiše enačba $3x + 5 = 20$. Kako dolga je bila vožnja?

**Podatki:** začetna cena $5\,\text{€}$, $3\,\text{€}$ na kilometer, skupaj $20\,\text{€}$; enačba $3x + 5 = 20$
**Iščemo:** število kilometrov $x$

:::formula
Na obeh straneh naredimo isto: najprej odštejemo $5$, nato delimo s koeficientom $3$.
:::

**Rešitev:**

1. Na obeh straneh odštejemo $5$, da ostane člen z $x$ sam: $3x = 20 - 5 = 15$.
2. Obe strani delimo s $3$: $x = 15 : 3 = 5$.
3. Preizkus v prvotni enačbi: levo $3 \cdot 5 + 5 = 20$, desno $20$. ✓
4. Odgovor: vožnja je bila dolga $5\,\text{km}$.

### Primer 2: neznanka na obeh straneh

Reši enačbo $5x - 7 = 2x + 8$ in naredi preizkus.

**Podatki:** enačba $5x - 7 = 2x + 8$
**Iščemo:** rešitev $x$ in preizkus

:::formula
Člene z $x$ na eno stran, števila na drugo, nato obe strani deli s koeficientom pri $x$.
:::

**Rešitev:**

1. Na obeh straneh odštejemo $2x$, da so členi z $x$ le na levi: $3x - 7 = 8$.
2. Na obeh straneh prištejemo $7$, da je število le na desni: $3x = 15$.
3. Obe strani delimo s $3$: $x = 5$.
4. Preizkus: levo $5 \cdot 5 - 7 = 18$, desno $2 \cdot 5 + 8 = 18$. ✓
5. Odgovor: rešitev je $x = 5$.

### Primer 3 (težji): kdaj imata izraza enako vrednost

Za katero število $x$ imata izraza $2(x - 3) - 4$ in $5x + 2(1 - x)$ enako vrednost? Rešitev preizkusi.

**Podatki:** izraza $2(x - 3) - 4$ in $5x + 2(1 - x)$
**Iščemo:** število $x$, pri katerem sta vrednosti izrazov enaki

:::formula
Izraza izenačimo: $2(x - 3) - 4 = 5x + 2(1 - x)$.

Nato: oklepaji, podobni členi, $x$ na eno stran, deljenje s koeficientom, preizkus.
:::

**Rešitev:**

1. Odpravimo oklepaje, vsak člen pomnožimo: $2x - 6 - 4 = 5x + 2 - 2x$.
2. Na vsaki strani združimo podobne člene: $2x - 10 = 3x + 2$.
3. Na obeh straneh odštejemo $3x$: $-x - 10 = 2$.
4. Na obeh straneh prištejemo $10$: $-x = 12$.
5. Obe strani pomnožimo z $-1$, da se znebimo minusa: $x = -12$.
6. Preizkus. Levo: $2 \cdot (-15) - 4 = -34$. Desno: $5 \cdot (-12) + 2 \cdot 13 = -60 + 26 = -34$. ✓
7. Odgovor: izraza imata enako vrednost pri $x = -12$; oba sta tedaj enaka $-34$.

### Primer 4 – zdaj ti

Reši enačbo $4(x + 2) = 2x + 20$ in naredi preizkus.

**Podatki:** enačba $4(x + 2) = 2x + 20$
**Iščemo:** rešitev $x$ in preizkus

:::formula
Oklepaj, člene z $x$ na eno stran, deljenje s koeficientom, preizkus v prvotni enačbi.
:::

**Rešitev:**

1. Odpravimo oklepaj: $4x + 8 = 2x + 20$.
2. Na obeh straneh odštejemo $2x$ in $8$: $2x = 12$.
3. Zadnji korak in preizkus naredi sam, nato preveri:

:::premisli
Koliko je $x$? Kaj pokaže preizkus?
---
$x = 12 : 2 = 6$. Preizkus: levo $4 \cdot (6 + 2) = 32$, desno $2 \cdot 6 + 20 = 32$. ✓
:::

## Pogoste napake

- **Deliš samo en člen.** Iz $3x + 6 = 30$ ne sledi $x + 6 = 10$. Deliti moraš celo stran. Lažje je najprej odšteti $6$ in šele nato deliti: $3x = 24$, $x = 8$.
- **Oklepaja ne zmnožiš do konca.** $2(x - 3)$ je $2x - 6$, ne $2x - 3$. Z $2$ pomnožiš vsak člen v oklepaju.
- **Napačen predznak pri prenosu.** Iz $x + 4 = 9$ ne sledi $x = 9 + 4$. »Prenos« je v resnici odštevanje $4$ na obeh straneh: $x = 9 - 4 = 5$.
- **Pri $-x = 12$ izgubiš minus.** Rešitev je $x = -12$, ne $x = 12$. Obe strani pomnoži z $-1$.
- **Preizkus v spremenjeni enačbi.** Tak preizkus spregleda napako iz zgodnjega koraka. Rešitev vedno vstavi v prvotno enačbo.

## Povzetek

- Linearna enačba ima neznanko le v prvi potenci. Rešitev je število, ki enačbo spremeni v resnično enakost.
- Ekvivalentna preoblikovanja: na obeh straneh prištej, odštej, pomnoži ali deli z istim številom (ne z $0$). Rešitev ostane ista.
- Deli in množi vedno celo stran, ne le en člen.
- Postopek: oklepaji, podobni členi, $x$ na eno stran in števila na drugo, deljenje s koeficientom pri $x$.
- »Prenos čez enačaj« je kratek zapis istega koraka na obeh straneh; zato se predznak spremeni.
- Preizkus: rešitev vstavi v prvotno enačbo in posebej izračunaj levo ter desno stran.
- Če $x$ izgine: resnična enakost pomeni neskončno mnogo rešitev, neresnična pomeni, da rešitve ni.

## Drugače: Kot zgodba

Mina in dedek sta v planinski koči našla staro tehtnico z dvema skledama. Na levo sta dala $2$ enaka nahrbtnika in $5$ kilogramskih uteži, na desno en tak nahrbtnik in $9$ uteži. Tehtnica je obstala v ravnovesju. »Koliko tehta en nahrbtnik?« je vprašala Mina.

Dedek je z vsake sklede vzel po en nahrbtnik. Tehtnica se ni premaknila: levo sta ostala nahrbtnik in $5$ uteži, desno $9$ uteži. »Zdaj pa še uteži,« je rekel in z obeh skled vzel po $5$ uteži. Levo je ostal sam nahrbtnik, desno $4$ uteži. En nahrbtnik torej tehta $4\,\text{kg}$.

Za preizkus je Mina vse vrnila nazaj: levo $2 \cdot 4 + 5 = 13$, desno $4 + 9 = 13$. Ravnovesje. Dedek se je nasmehnil: »Če bi uteži vzela le z ene sklede, bi se tehtnica nagnila. In tvoj odgovor bi bil napačen, še preden bi ga izrekla.«

V jeziku enačb je to $2x + 5 = x + 9$, nato $x + 5 = 9$ in nazadnje $x = 4$.

## Drugače: Korak za korakom s številkami

Reši $\dfrac{x}{2} + 3 = \dfrac{x}{4} + 5$.

| Korak | Kaj naredimo | Rezultat |
|---|---|---|
| 1 | Odpravimo ulomke: obe strani pomnožimo s $4$ (skupni imenovalec) | $4 \cdot \dfrac{x}{2} + 4 \cdot 3 = 4 \cdot \dfrac{x}{4} + 4 \cdot 5$ |
| 2 | Izračunamo | $2x + 12 = x + 20$ |
| 3 | Odštejemo $x$ na obeh straneh | $x + 12 = 20$ |
| 4 | Odštejemo $12$ na obeh straneh | $x = 8$ |
| 5 | Preizkus, leva stran | $\dfrac{8}{2} + 3 = 4 + 3 = 7$ |
| 6 | Preizkus, desna stran | $\dfrac{8}{4} + 5 = 2 + 5 = 7$ |

Obe strani sta $7$, zato je $x = 8$ rešitev.

Opomba: s $4$ moramo pomnožiti vsak člen, tudi tistega brez ulomka.

## Drugače: Bolj natančno

Zakaj smemo na obeh straneh narediti isto? Če sta dve števili enaki, sta enaki tudi, ko jima prištejemo isto število $c$: iz $A = B$ sledi $A + c = B + c$. Enako velja za množenje: iz $A = B$ sledi $A \cdot c = B \cdot c$.

Rešitev pri tem ne izgubimo, ker gre vsak korak tudi **nazaj**. Prištevanje $c$ razveljavimo z odštevanjem $c$, množenje s $c \ne 0$ pa z deljenjem s $c$. Zato imata enačbi pred korakom in po njem iste rešitve. Prav zato zahtevamo $c \ne 0$: množenje z $0$ bi vsako enačbo spremenilo v $0 = 0$ in tega koraka ne moremo razveljaviti.

Splošna enačba $ax + b = c$ za $a \ne 0$: odštejemo $b$ in dobimo $ax = c - b$, nato delimo z $a$:

$$x = \frac{c - b}{a}$$

## Preveri se

? Mojca reši enačbo $3x + 5 = 20$ in dobi $x = 5$. Nato izračuna $3 \cdot 5 + 5 = 20$ in primerja z desno stranjo. Kako se imenuje ta zadnji korak?
- ekvivalentno preoblikovanje
~ Ekvivalentno preoblikovanje spremeni enačbo, na primer odšteje $5$ na obeh straneh. Mojca enačbe ne spreminja, ampak vanjo vstavlja rešitev.
+ preizkus
- združevanje podobnih členov
~ Podobne člene združujemo med reševanjem, na primer $5x - 2x = 3x$. Tu pa vstavljamo število.
- odpravljanje oklepajev
~ V enačbi $3x + 5 = 20$ ni oklepajev.
> Preizkus: rešitev vstavimo v prvotno enačbo in primerjamo levo in desno stran.

? V katerem vrstnem redu rešiš enačbo $2(x + 1) + x = 14$?
+ odpravi oklepaj, združi podobne člene, odštej $2$ na obeh straneh, deli s $3$, preizkus
- deli z $2$, odpravi oklepaj, odštej $1$ na obeh straneh, preizkus
~ Z $2$ bi moral deliti celo levo stran, tudi člen $x$ zunaj oklepaja. To je napaka »deliš samo en člen«.
- odpravi oklepaj, deli s $3$, odštej $2$ na obeh straneh, preizkus
~ Izpustil si združevanje podobnih členov: po odpravi oklepaja je na levi $2x + 2 + x$, koeficienta $3$ še ni. S koeficientom deliš šele, ko je člen z $x$ sam na svoji strani.
- preizkus, odpravi oklepaj, združi podobne člene, deli s $3$
~ Preizkus je zadnji korak: najprej potrebuješ rešitev, ki jo vstaviš.
> $2x + 2 + x = 14$, $3x + 2 = 14$, $3x = 12$, $x = 4$. Preizkus: $2 \cdot (4 + 1) + 4 = 14$. ✓

? Kaj se zgodi, ko pri enačbi $2x + 4 = 2x + 9$ na obeh straneh odšteješ $2x$?
- Dobiš $x = 0$.
~ Ko $x$ izgine, ne smeš sklepati, da je $x = 0$. Poglej, kakšna enakost ostane.
- Dobiš resnično enakost, zato je rešitev neskončno mnogo.
~ $4 = 9$ ni resnično. Neskončno mnogo rešitev bi bilo pri enakosti, kot je $4 = 4$.
+ Dobiš $4 = 9$, kar ne drži, zato enačba nima rešitve.
> Po odštevanju $2x$ ostane $4 = 9$. Ta enakost ne drži za noben $x$, zato enačba nima rešitve.

? Kolikšna je rešitev enačbe $4x - 9 = 11$?
- $x = \dfrac{1}{2}$
~ $9$ si odštel namesto prištel: $4x = 11 - 9 = 2$. Na obeh straneh moraš prišteti $9$.
- $x = 20$
~ To je $4x$, ne $x$. Na koncu moraš obe strani deliti s $4$.
+ $x = 5$
- $x = -5$
~ Oba člena si prenesel z napačnim predznakom: $4x = -9 - 11 = -20$. Na obeh straneh moraš prišteti $9$.
> Na obeh straneh prištejemo $9$: $4x = 20$, nato delimo s $4$: $x = 5$. Preizkus: $4 \cdot 5 - 9 = 11$. ✓

? Kolikšna je rešitev enačbe $2(x - 3) = x + 4$?
- $x = 7$
~ Oklepaja nisi zmnožil do konca: $2x - 3 = x + 4$. Pravilno je $2x - 6$.
- $x = -2$
~ $6$ si prenesel brez spremembe predznaka: $x = 4 - 6$. Na obeh straneh moraš prišteti $6$.
+ $x = 10$
- $x = \dfrac{10}{3}$
~ Člen $x$ si prenesel z napačnim predznakom: $2x + x = 10$. Na obeh straneh moraš odšteti $x$.
> $2x - 6 = x + 4$; odštejemo $x$: $x - 6 = 4$; prištejemo $6$: $x = 10$. Preizkus: $2 \cdot (10 - 3) = 14$ in $10 + 4 = 14$. ✓

:::simboli
x | neznanka | x = \frac{c - b}{a} | | rešitev enačbe ax + b = c
a | koeficient pri neznanki | | | a ≠ 0
b | prosti člen na levi strani | |
c | desna stran enačbe | | | v A + c = B + c poljubno število
:::
