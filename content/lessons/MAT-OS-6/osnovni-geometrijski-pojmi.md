---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec Luka riše načrt domače kuhinje. Rob pulta in rob police nad njim nariše kot dve črti, ki se na listu nikjer ne srečata. Ponosno reče: »Rob pulta je premica. Robova se ne sekata, torej sta vzporedna.«

Ima prav? Obe trditvi zvenita smiselno, a prva je napačna, druga pa je prenagljen sklep. Rob pulta ima začetek in konec, premica pa ju nima. Dve črti, ki se na listu ne srečata, se lahko srečata zunaj lista. Da se o tem dogovorimo brez prepira, potrebujemo besede z natančnim pomenom: **točka**, **premica**, **poltrak**, **daljica**, **vzporednici** in **pravokotnici**.

## Razlaga

**1. Točka.** Točka je osnovni pojem: nima velikosti, ima samo **lego**. Točke označimo z velikimi tiskanimi črkami: $A$, $B$, $C$. Vse, kar tu rišemo, leži v **ravnini**, to je ravna ploskev, ki se v mislih neomejeno širi na vse strani. List papirja ali šolska tabla sta njena dela.

**2. Premica.** Premica je ravna črta brez začetka in konca: v mislih se neomejeno nadaljuje v obe smeri. Označimo jo z majhno tiskano črko ($p$, $q$, $r$) ali z imenoma dveh točk na njej: premica $AB$.

Poskusi: nariši točko $A$ in skozi njo z ravnilom potegni ravne črte. Narišeš jih lahko, kolikor hočeš. Dodaj točko $B$ in poskusi potegniti dve različni ravni črti skozi obe točki. Ne gre: vse se prekrijejo. Dve pravili veljata vedno:

- skozi dve različni točki gre **natanko ena** premica,
- skozi eno točko jih gre **neskončno mnogo**.

**3. Točka in premica.** Točka lahko leži na premici ali ne. Zapišemo $A \in p$ (»$A$ leži na $p$«) in $D \notin p$ (»$D$ ne leži na $p$«).

**4. Poltrak.** Točka $O$ razdeli premico na dva **poltraka**: vsak ima začetek v $O$, konca pa nima. Poltrak $AB$ ima začetek v $A$ in poteka skozi $B$ naprej. Vrstni red črk zato šteje: poltrak $AB$ in poltrak $BA$ sta različna, ker se začneta v različnih točkah. Poltraka z isto začetno točko, ki skupaj sestavljata premico, sta **nasprotna**.

**5. Daljica.** Daljica je del premice med dvema točkama, ki ju imenujemo **krajišči**. Ima začetek in konec, zato ima **dolžino**, ki jo izmerimo z ravnilom. Daljico med $A$ in $B$ imenujemo daljica $AB$, njeno dolžino zapišemo $|AB|$. Daljica $AB$ in daljica $BA$ sta ista daljica, zato je $|AB| = |BA|$.

Pri merjenju krajišče $A$ poravnaj z oznako $0$ na ravnilu in preberi oznako pri $B$. Dolžino zapišemo z enoto: $|AB| = 4{,}5\,\text{cm}$.

Na sliki so vsi trije pojmi skozi isti točki $A$ in $B$. Puščica pomeni, da se črta tam nadaljuje brez konca.

:::risba skica
opis: Premica, poltrak in daljica, narisani eno pod drugo skozi isti točki A in B. Premica p ima puščici na obeh koncih, poltrak AB samo za točko B, daljica AB je med A in B brez puščic.
območje: 0; 0,2 .. 10; 3,6
napis: 0,1; 2,8 | premica p | desno
napis: 0,1; 1,7 | poltrak AB | desno
napis: 0,1; 0,6 | daljica AB | desno
črta: 5,9; 2,8 -> 3; 2,8 | puščica
črta: 5,9; 2,8 -> 9,8; 2,8 | puščica
črta: 4,2; 1,7 -> 9,8; 1,7 | puščica
črta: 4,2; 0,6 -> 7,6; 0,6
točka: 4,2; 2,8 | A | nad
točka: 7,6; 2,8 | B | nad
točka: 4,2; 1,7 | A | nad
točka: 7,6; 1,7 | B | nad
točka: 4,2; 0,6 | A | nad
točka: 7,6; 0,6 | B | nad
:::

| pojem | začetek | konec | merljiva |
|---|---|---|---|
| premica | ne | ne | ne |
| poltrak | da | ne | ne |
| daljica | da | da | da |

Za daljice veljata dve pravili:

- Če točka $C$ leži na daljici $AB$ (med $A$ in $B$), je $|AB| = |AC| + |CB|$.
- **Razpolovišče** daljice $AB$ je točka $M$ na daljici, ki je enako oddaljena od obeh krajišč: $|AM| = |MB| = \dfrac{|AB|}{2}$. Daljico razdeli na dve enaki polovici.

Koliko daljic določajo točke na premici? Dve točki določata eno daljico. Tri točke $A$, $B$, $C$ določajo tri: $AB$, $BC$ in $AC$. Tretja točka je dodala dve novi daljici, toliko, kolikor točk je že bilo.

:::premisli
Na premico dodaš še četrto točko $D$. Koliko daljic določajo štiri točke? Napovej po vzorcu, nato preštej.
---
Šest. Točka $D$ se poveže s tremi prejšnjimi, zato k trem daljicam dodamo tri: $3 + 3 = 6$. To so $AB$, $AC$, $AD$, $BC$, $BD$ in $CD$.
:::

**6. Dve premici v ravnini.** Dve različni premici imata največ eno skupno točko.

:::premisli
Zakaj se dve različni premici ne moreta sekati v dveh točkah?
---
Skozi dve različni točki gre natanko ena premica. Če bi imeli premici dve skupni točki, bi obe šli skozi isti dve točki in bi bili ena in ista premica.
:::

Zato velja natanko ena izmed možnosti:

- imata **natanko eno skupno točko**: premici se **sekata**, skupni točki pravimo **presečišče**,
- nimata nobene skupne točke: premici sta **vzporedni**.

**7. Vzporednici.** Premici $p$ in $q$ sta vzporedni, če ležita v isti ravnini in nimata skupne točke, kakor koli ju podaljšamo. Zapišemo $p \parallel q$. Vzporednici sta povsod enako narazen. Velja:

- skozi točko $T$, ki ne leži na premici $p$, gre **natanko ena** vzporednica s $p$,
- če je $a \parallel b$ in $b \parallel c$ (premici $a$ in $c$ sta različni), je tudi $a \parallel c$.

Vzporednico skozi $T$ narišemo z geotrikotnikom in ravnilom (glej »Korak za korakom«).

**8. Pravokotnici.** Premici sta **pravokotni**, če se sekata in v presečišču tvorita **pravi kot**, tak, kot ga ima vogal lista ali geotrikotnika (kote bomo spoznali v naslednji temi). Zapišemo $p \perp q$.

- Skozi dano točko gre **natanko ena** pravokotnica na dano premico (točka je na premici ali zunaj nje).
- Če sta premici vzporedni in je tretja pravokotna na eno izmed njiju, je pravokotna tudi na drugo: iz $a \parallel b$ in $c \perp a$ sledi $c \perp b$.

Pravokotnico skozi točko $T$ narišemo z geotrikotnikom: eno stranico ob pravem kotu položimo na $p$ in geotrikotnik drsimo po $p$, dokler druga stranica ob pravem kotu ne gre skozi $T$.

**9. Razdalje.** Razdalja med dvema točkama je dolžina daljice med njima. **Razdalja točke od premice** je dolžina pravokotne daljice od točke do premice, to je najkrajša pot do nje. **Razdalja med vzporednicama**: izberi katero koli točko na eni in izmeri njeno razdaljo od druge. Ker sta vzporednici povsod enako narazen, dobiš vedno isto število.

## Rešeni primeri

### Primer 1 (lažji)

Na premici $p$ ležijo točke $A$, $B$ in $C$ v tem vrstnem redu (točka $B$ je med $A$ in $C$). Točka $D$ ne leži na premici $p$. a) Z znaki zapiši, katere točke ležijo na $p$ in katera ne. b) Naštej vse daljice, ki jih določajo točke $A$, $B$ in $C$. c) Poimenuj poltraka z začetkom v $B$, ki potekata skozi $A$ oziroma skozi $C$. Sta enaka?

**Podatki:** točke $A$, $B$, $C$ ležijo na premici $p$ v tem vrstnem redu, $B$ je med $A$ in $C$, točka $D$ ne leži na $p$
**Iščemo:** zapis lege točk, imena vseh daljic, imeni poltrakov z začetkom v $B$

:::formula
$X \in p$ (točka leži na premici), $X \notin p$ (ne leži). Daljica $XY$ ima krajišči $X$ in $Y$. Poltrak $XY$ se začne v $X$ in poteka skozi $Y$.
:::

**Rešitev:**

1. a) $A \in p$, $B \in p$, $C \in p$ in $D \notin p$.
2. b) Vsak par točk določa eno daljico: daljica $AB$, daljica $BC$ in daljica $AC$. Skupaj so tri.
3. c) Poltrak z začetkom v $B$ skozi $A$ je poltrak $BA$, skozi $C$ pa poltrak $BC$. Nista enaka: začneta se v isti točki, a tečeta v nasprotnih smereh (nasprotna poltraka).
4. Odgovor: tri daljice ($AB$, $BC$, $AC$); poltraka $BA$ in $BC$ nista enaka.

### Primer 2 (srednji)

Mama na pultu razvalja trak testa za okras pite. Njegov rob $AB$ je dolg $15\,\text{cm}$. Prvi rez naredi v točki $C$ na robu, tako da je $|AC|$ enaka $\dfrac{2}{5}$ dolžine $|AB|$. Drugi rez naredi v razpolovišču $M$ daljice $CB$. Izračunaj $|AC|$, $|CB|$, $|CM|$ in $|AM|$.

**Podatki:** $|AB| = 15\,\text{cm}$, $C$ leži na daljici $AB$, $|AC| = \dfrac{2}{5}$ od $|AB|$, $M$ je razpolovišče daljice $CB$
**Iščemo:** $|AC|$, $|CB|$, $|CM|$ in $|AM|$

:::formula
Del celote: $\dfrac{2}{5}$ od $|AB|$ je $(|AB| : 5) \cdot 2$. Če $C$ leži na daljici $AB$: $|AB| = |AC| + |CB|$. Razpolovišče $M$ daljice $CB$: $|CM| = \dfrac{|CB|}{2}$.
:::

**Rešitev:**

1. Ena petina daljice $AB$ je $15 : 5 = 3\,\text{cm}$, zato je $|AC| = 2 \cdot 3\,\text{cm} = 6\,\text{cm}$.
2. Točka $C$ leži na daljici $AB$, zato je $|CB| = |AB| - |AC| = 15\,\text{cm} - 6\,\text{cm} = 9\,\text{cm}$.
3. Točka $M$ razpolovi daljico $CB$: $|CM| = 9\,\text{cm} : 2 = 4{,}5\,\text{cm}$.
4. Točka $M$ leži na daljici $CB$, zato $|AM| = |AC| + |CM| = 6\,\text{cm} + 4{,}5\,\text{cm} = 10{,}5\,\text{cm}$.
5. Preverimo: $|AB| - |MB| = 15\,\text{cm} - 4{,}5\,\text{cm} = 10{,}5\,\text{cm}$. Ujema se.
6. Odgovor: $|AC| = 6\,\text{cm}$, $|CB| = 9\,\text{cm}$, $|CM| = 4{,}5\,\text{cm}$, $|AM| = 10{,}5\,\text{cm}$.

### Primer 3 (težji)

Na steni za štedilnikom so stiki med ploščicami ravne črte. Opišemo jih s premicami. V isti ravnini so premice $a$, $b$, $c$ in $d$. Vemo, da je $a \parallel b$, $c \perp a$ in $d \parallel c$. Razdalja med vzporednicama $a$ in $b$ je $4\,\text{cm}$. Točka $T$ leži na premici $a$. a) Kakšen je odnos med $c$ in $b$? b) Kakšen je odnos med $d$ in $a$ ter med $d$ in $b$? c) Kolikšna je razdalja točke $T$ od premice $b$?

**Podatki:** vse premice ležijo v isti ravnini, $a \parallel b$, $c \perp a$, $d \parallel c$, razdalja med $a$ in $b$ je $4\,\text{cm}$, $T \in a$
**Iščemo:** odnos premic $c$ in $b$, odnos premic $d$ in $a$ ter $d$ in $b$, razdaljo točke $T$ od $b$

:::formula
Če je $a \parallel b$ in $c \perp a$, je $c \perp b$. Če je $d \parallel c$ in $c \perp a$, je $d \perp a$. Razdalja med vzporednicama je povsod enaka.
:::

**Rešitev:**

1. a) Premica $c$ je pravokotna na $a$, zato jo seka pod pravim kotom. Ker je $b$ vzporedna z $a$, $c$ seka tudi $b$ pod pravim kotom, torej $c \perp b$.
2. b) Premica $d$ je vzporedna s $c$, torej ima isto smer. Ker $c$ seka $a$ in $b$ pod pravim kotom, ju tako seka tudi $d$: $d \perp a$ in $d \perp b$.
3. c) Točka $T$ leži na $a$, razdalja med vzporednicama pa je povsod enaka, zato je razdalja $T$ od $b$ enaka $4\,\text{cm}$.
4. Odgovor: $c \perp b$, $d \perp a$, $d \perp b$ in razdalja $T$ od $b$ je $4\,\text{cm}$.

### Primer 4 – zdaj ti

Valjar za testo je dolg $42\,\text{cm}$. Na vsakem koncu ima ročaj, dolg $8\,\text{cm}$. Valjar narišemo kot daljico $AB$, ročaja kot daljici $AC$ in $DB$. Kako dolg je srednji del $CD$, s katerim valjamo? Kako daleč od konca $A$ je sredina tega dela?

**Podatki:** $|AB| = 42\,\text{cm}$, $|AC| = 8\,\text{cm}$, $|DB| = 8\,\text{cm}$, točke $A$, $C$, $D$, $B$ so na daljici v tem vrstnem redu
**Iščemo:** $|CD|$ in $|AM|$, kjer je $M$ razpolovišče daljice $CD$

:::formula
$|AB| = |AC| + |CD| + |DB|$ in $|CM| = \dfrac{|CD|}{2}$
:::

**Rešitev:**

1. Od celega valjarja odštejemo oba ročaja: $|CD| = 42\,\text{cm} - 8\,\text{cm} - 8\,\text{cm} = 26\,\text{cm}$.
2. Točka $M$ razpolovi daljico $CD$. Izračunaj $|CM|$, nato še $|AM| = |AC| + |CM|$.

:::premisli
Koliko sta $|CM|$ in $|AM|$? Kaj opaziš, če primerjaš $|AM|$ s polovico valjarja?
---
$|CM| = 26\,\text{cm} : 2 = 13\,\text{cm}$ in $|AM| = 8\,\text{cm} + 13\,\text{cm} = 21\,\text{cm}$. To je ravno $42\,\text{cm} : 2$: ker sta ročaja enaka, je sredina valjarja hkrati sredina srednjega dela.
:::

## Pogoste napake

- **»Rob pulta je premica.«** Razlog: rob je raven in premica tudi. A rob ima dve krajišči, premica pa nobenega. Pravilno: kar ima dve krajišči, je daljica. Premico na papirju narišemo le kot kos s puščicama ali kot črto, ki sega čez označeni točki.
- **Poltraka $AB$ in $BA$ sta enaka.** Razlog: oba vsebujeta točki $A$ in $B$. Pravilno: poltrak se začne v prvi črki. Poltrak $AB$ gre od $A$ skozi $B$, poltrak $BA$ pa od $B$ skozi $A$.
- **»Ne sekata se, torej sta vzporedni.«** Razlog: na listu se premici morda ne srečata, zunaj lista pa se. Pravilno: izmeri razdaljo med premicama na dveh različnih mestih. Če je povsod enaka, sta vzporedni, sicer ne.
- **»Pravokotni premici sta vodoravna in navpična.«** Razlog: tako ju vidimo v zvezku. Pravilno: pravokotnost se pozna po pravem kotu, ne po legi na listu. Preveri z vogalom geotrikotnika; obe premici sta lahko poševni.
- **Napačno merjenje daljice.** Razlog: začetek ravnila ni vedno oznaka $0$, pred njo je pogosto še prazen rob. Pravilno: krajišče $A$ postavi na oznako $0$, dolžino preberi pri $B$. Če začneš pri $1$, odštej: $7{,}5 - 1 = 6{,}5$.

## Povzetek

- Točka ima samo lego. Premica je ravna in neomejena v obe smeri; skozi dve različni točki gre natanko ena. Zapis: $A \in p$ (točka leži na premici), $D \notin p$ (ne leži).
- Poltrak $AB$ ima začetek v $A$ in poteka skozi $B$; poltraka $AB$ in $BA$ sta različna.
- Daljica $AB$ je del premice med krajiščema, njena dolžina je $|AB| = |BA|$. Če $C$ leži na daljici $AB$, je $|AB| = |AC| + |CB|$.
- Razpolovišče $M$ daljice $AB$: $|AM| = |MB| = \dfrac{|AB|}{2}$.
- Dve različni premici se sekata v eni točki ali pa sta vzporedni ($p \parallel q$, brez skupne točke).
- Pravokotni premici ($p \perp q$) se sekata pod pravim kotom. Če je $a \parallel b$ in $c \perp a$, je $c \perp b$.
- Skozi točko zunaj premice gre natanko ena vzporednica in natanko ena pravokotnica. Razdalja točke od premice je dolžina pravokotne daljice.

## Drugače: Korak za korakom s številkami

**Postopek A: dolžini dveh delov daljice.** Točka $T$ leži na daljici $AB$ z $|AB| = 24\,\text{cm}$. Daljica $TB$ je za $6\,\text{cm}$ daljša od daljice $AT$. Koliko sta dolgi?

1. Neznano dolžino označimo: $|AT| = x$.
2. Potem je $|TB| = x + 6$ (v centimetrih).
3. Ker $T$ leži na daljici $AB$, je $|AT| + |TB| = |AB|$, torej $x + x + 6 = 24$.
4. Dvakrat $x$ je $2 \cdot x$, zato $2 \cdot x + 6 = 24$. S sklepanjem: $2 \cdot x = 24 - 6 = 18$ in $x = 18 : 2 = 9$.
5. $|AT| = 9\,\text{cm}$ in $|TB| = 9 + 6 = 15\,\text{cm}$.
6. Preverimo: $9 + 15 = 24$ in $15 - 9 = 6$. Res.

**Postopek B: vzporednica skozi točko.** Točka $T$ je $3\,\text{cm}$ od premice $p$.

1. Geotrikotnik položi s stranico na $p$.
2. Ob drugo stranico geotrikotnika prisloni ravnilo in ga drži pri miru.
3. Geotrikotnik drsi po ravnilu, dokler stranica, ki je bila na $p$, ne gre skozi $T$. Po njej potegni črto $q$.
4. Preveri: razdalja med $p$ in $q$ mora biti na dveh različnih mestih $3\,\text{cm}$. Če dobiš $3\,\text{cm}$ in $3{,}4\,\text{cm}$, premici nista vzporedni.

## Drugače: Kot zgodba

V kuhinji živijo štirje prijatelji. **Točka** je drobtina na pultu: pomembno je le, kje leži. **Daljica** je rob deske za rezanje: ima dva konca, zato lahko vsak izmeri, da je dolga $40\,\text{cm}$. **Poltrak** je žarek svetilke na telefonu, s katerim iščeš žlico pod omaro. Začne se pri telefonu in gre naravnost naprej. **Premica** pa se ne ustavi nikjer: teče čez pult, skozi steno in naprej v obe smeri. Vedno vidimo le njen kos.

Nekega dne se predal zatika. Mojster pogleda vodili, po katerih drsi. »Nista vzporedni,« reče, »spredaj sta $2\,\text{mm}$ bolj narazen kot zadaj.« Ko ju naravna, da sta povsod enako narazen, predal spet drsi gladko. Nato z vogalom geotrikotnika preveri, ali sta stranica in dno omarice pravokotna.

## Preveri se

? Katera trditev drži?
- Skozi eno točko gre natanko ena premica.
~ Skozi eno točko lahko potegneš poljubno mnogo premic. Natanko ena gre šele skozi dve različni točki.
+ Skozi dve različni točki gre natanko ena premica.
- Poltrak $AB$ in poltrak $BA$ sta isti poltrak.
~ Poltrak se začne v prvi črki: $AB$ v točki $A$, $BA$ v točki $B$. Tečeta v nasprotni smeri.
- Premici, ki se na listu ne sekata, sta vzporedni.
~ Na listu vidiš le del premic, zunaj lista se lahko sekata. Vzporedni sta, če sta povsod enako narazen.
> Skozi dve različni točki gre natanko ena premica, premica $AB$. Skozi eno točko jih gre neskončno mnogo.

? Na premici je pet točk, kot kaže slika. Koliko različnih daljic določajo?
:::risba skica
opis: Premica s puščicama na obeh koncih. Na njej je od leve proti desni pet točk: A, B, C, D in E.
območje: 0; 0 .. 10; 1,6
črta: 5; 0,6 -> 0,2; 0,6 | puščica
črta: 5; 0,6 -> 9,8; 0,6 | puščica
točka: 1,2; 0,6 | A | nad
točka: 3,1; 0,6 | B | nad
točka: 5; 0,6 | C | nad
točka: 6,9; 0,6 | D | nad
točka: 8,8; 0,6 | E | nad
:::
= 10
~ 4 | Preštel si samo daljice med sosednjima točkama ($AB$, $BC$, $CD$, $DE$). Štejejo tudi daljice, kot sta $AC$ in $AE$.
~ 5 | Preštel si točke, ne daljic. Vsak par točk določa eno daljico.
~ 20 | Daljici $AB$ in $BA$ si štel kot dve. To je ista daljica.
> Iz $A$ gredo štiri daljice, iz $B$ še tri nove, iz $C$ dve, iz $D$ ena: $4 + 3 + 2 + 1 = 10$.

? Miha meri rob deske za rezanje. Krajišče $A$ postavi na oznako $1\,\text{cm}$, krajišče $B$ je pri oznaki $7{,}5\,\text{cm}$. Zapiše $|AB| = 7{,}5\,\text{cm}$. Kje je napaka?
+ Ni začel pri $0$. Pravilno je $7{,}5\,\text{cm} - 1\,\text{cm} = 6{,}5\,\text{cm}$.
- Napake ni: dolžina je oznaka pri krajišču $B$.
~ To velja le, če je $A$ na oznaki $0$. Miha je začel pri $1$, zato je prišteval centimeter, ki ga deska nima.
- Prišteti bi moral še $1\,\text{cm}$, torej $8{,}5\,\text{cm}$.
~ Med oznakama $0$ in $1$ ni deske. Ta centimeter je treba odšteti, ne prišteti.
- Roba ni mogoče izmeriti, ker je premica.
~ Rob deske ima dve krajišči, zato je daljica in ima dolžino.
> Ravnilo meri od oznake $0$. Če začneš pri $1\,\text{cm}$, ta centimeter odšteješ: $|AB| = 6{,}5\,\text{cm}$.

? Skozi isti točki $A$ in $B$ narišeš premico $AB$, poltrak $AB$ in daljico $AB$. Katera primerjava je pravilna?
- Poltrak je krajši od premice, zato ga lahko izmerimo.
~ Poltrak ima začetek, konca pa ne. Neomejen je, zato ga ne moremo izmeriti.
+ Samo daljica ima dve krajišči, zato ima edina dolžino.
- Premica je najdaljša, ker ima dve krajišči.
~ Premica nima nobenega krajišča. Dve krajišči ima daljica.
- Poltrak $AB$ in daljica $AB$ sta enaka, ker se oba začneta v $A$.
~ Daljica se v $B$ konča, poltrak pa se za $B$ nadaljuje brez konca.
> Premica nima krajišč, poltrak ima eno (začetek), daljica dve. Zato lahko izmerimo samo daljico.

? Na steni v kuhinji je rob police $p$ pravokoten na navpični rob omare $o$. Rob druge police $q$ je vzporeden s $p$. Vsi robovi ležijo v isti ravnini. Kakšen je rob $q$ glede na rob $o$?
+ $q \perp o$
- $q \parallel o$
~ Zamenjal si odnosa. Premica $q$ ima smer premice $p$, ta pa seka $o$ pod pravim kotom.
- $q$ in $o$ se sekata, a ne pod pravim kotom.
~ Vzporedni premici imata isto smer, zato $o$ seka $q$ pod istim kotom kot $p$, torej pod pravim.
- Tega ne moremo ugotoviti.
~ Lahko: premica, ki je pravokotna na eno od dveh vzporednic, je pravokotna tudi na drugo.
> Iz $p \parallel q$ in $o \perp p$ sledi $o \perp q$. Zato so police med seboj vzporedne in vse pravokotne na rob omare.

<<RACUN
vrednost: 15/5*2 | 6
vrednost: 15-6 | 9
vrednost: 9/2 | 4.5
vrednost: 6+4.5 | 10.5
vrednost: 15-4.5 | 10.5
vrednost: 42-8-8 | 26
vrednost: 26/2 | 13
vrednost: 8+13 | 21
vrednost: 42/2 | 21
resi: x+x+6=24 | x | 9
vrednost: 3+3 | 6
vrednost: 4+3+2+1 | 10
vrednost: 7.5-1 | 6.5
>>

:::simboli
X, Y | točki | | | $XY$ je daljica ali poltrak s krajiščem $X$
p | premica | | | $X \in p$: točka $X$ leži na premici $p$
A, B | krajišči daljice $AB$ | | | dolžino zapišemo z navpičnicama: $|AB|$
C | točka na daljici $AB$ | | | $|AB| = |AC| + |CB|$
D | še ena točka | | | v primeru 1 ne leži na $p$ ($D \notin p$), pri valjarju je konec srednjega dela
M | razpolovišče daljice | | | enako oddaljeno od obeh krajišč
a, b, c, d | premice v isti ravnini | | | $\parallel$ vzporedni, $\perp$ pravokotni
:::
