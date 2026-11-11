---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Od prvih razredov rišeš črte, kvadrate in pravokotnike, z ravnilom meriš dolžine, pri obsegu in ploščini pravokotnika pa računaš z dolžinami stranic. Besede, kot so »črta«, »rob« ali »vogal«, so v vsakdanjem pogovoru dovolj dobre, v matematiki pa ne: vsaka beseda mora imeti natančen pomen, da vsi mislimo isto.

V tej lekciji spoznaš osnovne gradnike geometrije: **točko**, **premico**, **poltrak** in **daljico**, ter dva pomembna odnosa med premicama: **vzporednost** in **pravokotnost**. Uporabljamo jih povsod, kjer je treba nekaj natančno narisati: pri načrtu hiše, zemljevidu ali računalniški grafiki. Z njimi bomo opisovali tudi kote, krožnice in konstrukcije v naslednjih temah. Pri računanju z dolžinami daljic uporabiš ulomke, decimalna števila in enačbe.

## Razlaga

**1. Točka.** Točka je osnovni pojem: nima velikosti, ima samo **lego**. Narisana pikica je le sled svinčnika. Točke označimo z velikimi tiskanimi črkami: $A$, $B$, $C$. Vse, kar rišemo v tej lekciji, leži v **ravnini**, to je ravna ploskev, ki se v mislih neomejeno širi na vse strani. List papirja ali šolska tabla sta njena dela.

**2. Premica.** Premica je ravna črta brez začetka in konca: v mislih se neomejeno nadaljuje v obe smeri. Označimo jo z majhno tiskano črko ($p$, $q$, $r$) ali z imenoma dveh točk na njej: premica $AB$. Dva pravila veljata vedno:

- skozi dve različni točki gre **natanko ena** premica,
- skozi eno točko jih gre **neskončno mnogo**.

**3. Točka in premica.** Točka lahko leži na premici ali ne. Zapišemo $A \in p$ (»$A$ leži na $p$«) in $D \notin p$ (»$D$ ne leži na $p$«).

**4. Poltrak.** Točka $O$ na premici razdeli premico na dva dela. Vsak ima začetek v $O$ in se neomejeno nadaljuje v eno smer. Vsakemu pravimo **poltrak**: del premice z začetkom, a brez konca. Poltrak $AB$ ima začetek v $A$ in poteka skozi $B$ naprej. Vrstni red črk zato šteje: poltrak $AB$ in poltrak $BA$ sta različna, ker začneta v različnih točkah. Poltraka z isto začetno točko, ki skupaj sestavljata premico, sta **nasprotna**.

**5. Daljica.** Daljica je del premice med dvema točkama, ki ju imenujemo **krajišči**. Ima začetek in konec, zato ima **dolžino**, ki jo izmerimo z ravnilom. Daljico med $A$ in $B$ imenujemo daljica $AB$, njeno dolžino zapišemo $|AB|$. Ker daljice ne usmerjamo, je $|AB| = |BA|$. Pri merjenju krajišče $A$ poravnaj z oznako $0$ na ravnilu in preberi oznako pri $B$. Dolžino zapišemo z enoto: $|AB| = 4{,}5\,\text{cm}$.

| pojem | začetek | konec | dolžina |
|---|---|---|---|
| premica | ne | ne | neskončna, ni merljiva |
| poltrak | da | ne | neskončna, ni merljiva |
| daljica | da | da | končna, merljiva |

Za daljice veljata dve pravili:

- Če točka $C$ leži na daljici $AB$ (med $A$ in $B$), je $|AB| = |AC| + |CB|$.
- **Razpolovišče** daljice $AB$ je točka $M$ na daljici, ki je enako oddaljena od obeh krajišč: $|AM| = |MB| = \dfrac{|AB|}{2}$. Daljico razdeli na dve enaki polovici.

**6. Dve premici v ravnini.** Dve različni premici imata največ eno skupno točko, saj gre skozi dve različni točki le ena premica. Zato velja natanko ena izmed možnosti:

- imata **natanko eno skupno točko**: premici se **sekata**, skupni točki pravimo **presečišče**,
- nimata nobene skupne točke: premici sta **vzporedni**.

**7. Vzporednici.** Premici $p$ in $q$ sta vzporedni, če ležita v isti ravnini in nimata skupne točke, kakor koli ju podaljšamo. Zapišemo $p \parallel q$. Vzporednici sta povsod enako narazen. Velja:

- skozi točko $T$, ki ne leži na premici $p$, gre **natanko ena** vzporednica s $p$,
- če je $a \parallel b$ in $b \parallel c$ (premici $a$ in $c$ sta različni), je tudi $a \parallel c$.

Vzporednico skozi $T$ narišemo z geotrikotnikom in ravnilom (glej »Korak za korakom«).

**8. Pravokotnici.** Premici sta **pravokotni**, če se sekata in v presečišču tvorita **pravi kot**, tak, kot ga ima vogal lista ali geotrikotnika (kote bomo spoznali v naslednji temi). Zapišemo $p \perp q$. Pravokotnici nista nujno vodoravna in navpična: če list zasukaš, ostaneta pravokotni.

- Skozi dano točko gre **natanko ena** pravokotnica na dano premico (točka je na premici ali zunaj nje).
- Če sta premici vzporedni in je tretja pravokotna na eno izmed njiju, je pravokotna tudi na drugo: iz $a \parallel b$ in $c \perp a$ sledi $c \perp b$.

Pravokotnico skozi točko $T$ narišemo z vogalom (pravim kotom) geotrikotnika, ki ga drsimo po premici $p$.

**9. Razdalje.** Razdalja med dvema točkama je dolžina daljice med njima. **Razdalja točke od premice** je dolžina pravokotne daljice od točke do premice, to je najkrajša pot do nje. **Razdalja med vzporednicama** je razdalja katere koli točke ene od druge premice in je povsod enaka.

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
3. c) Poltrak z začetkom v $B$ skozi $A$ je poltrak $BA$, skozi $C$ pa poltrak $BC$.
4. Poltraka nista enaka: začneta v isti točki $B$, a tečeta v nasprotnih smereh in skupaj sestavljata premico $p$ (nasprotna poltraka).
5. Odgovor: tri daljice ($AB$, $BC$, $AC$); poltraka $BA$ in $BC$ nista enaka.

### Primer 2 (srednji)

Daljica $AB$ je dolga $15\,\text{cm}$. Točka $C$ leži na daljici $AB$ tako, da je $|AC|$ enaka $\dfrac{2}{5}$ dolžine $|AB|$. Točka $M$ je razpolovišče daljice $CB$. Izračunaj $|AC|$, $|CB|$, $|CM|$ in $|AM|$.

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

V isti ravnini so premice $a$, $b$, $c$ in $d$. Vemo, da je $a \parallel b$, $c \perp a$ in $d \parallel c$. Razdalja med vzporednicama $a$ in $b$ je $4\,\text{cm}$. Točka $T$ leži na premici $a$. a) Kakšen je odnos med $c$ in $b$? b) Kakšen je odnos med $d$ in $a$ ter med $d$ in $b$? c) Kolikšna je razdalja točke $T$ od premice $b$?

**Podatki:** vse premice ležijo v isti ravnini, $a \parallel b$, $c \perp a$, $d \parallel c$, razdalja med $a$ in $b$ je $4\,\text{cm}$, $T \in a$
**Iščemo:** odnos premic $c$ in $b$, odnos premic $d$ in $a$ ter $d$ in $b$, razdaljo točke $T$ od $b$

:::formula
Če je $a \parallel b$ in $c \perp a$, je $c \perp b$. Če je $d \parallel c$ in $c \perp a$, je $d \perp a$. Razdalja med vzporednicama je povsod enaka.
:::

**Rešitev:**

1. Skico narišemo tako, da sta $a$ in $b$ dve vodoravni črti, $4\,\text{cm}$ narazen.
2. a) Premica $c$ je pravokotna na $a$, zato jo seka pod pravim kotom. Ker je $b$ vzporedna z $a$, $c$ seka tudi $b$ pod pravim kotom, torej $c \perp b$.
3. b) Premica $d$ je vzporedna s $c$, zato ima glede na $a$ in $b$ isto lego kot $c$: $d \perp a$ in $d \perp b$.
4. c) Točka $T$ leži na $a$, razdalja med vzporednicama pa je povsod enaka, zato je razdalja $T$ od $b$ enaka $4\,\text{cm}$.
5. Odgovor: $c \perp b$, $d \perp a$, $d \perp b$ in razdalja $T$ od $b$ je $4\,\text{cm}$.

## Pogoste napake

- **»Premica ima konec.«** Na papirju narišemo le del premice, zato se zdi, da ima konca. Razlog: papir je omejen, premica ni. Pravilno: če sta označeni krajišči, gre za daljico. Premico narišemo s puščicama ali kot črto, ki sega čez označeni točki.
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

## Drugače: Na sliki

Poglej premico, poltrak in daljico, narisane eno pod drugo (pike $A$ in $B$ sta isti):

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

Premica ima puščici na obeh koncih, poltrak samo eno, daljica nobene. Odnose med dvema premicama si lahko zapomniš s tremi znaki, ki jih poznaš:

| znak | kaj narišeš | odnos premic |
|---|---|---|
| = | dve črti, ki tečeta vštric | vzporedni |
| + | ena vodoravna, ena navpična črta | pravokotni (sekata se pod pravim kotom) |
| X | dve črti, ki se križata, a ne pod pravim kotom | sekata se, a nista pravokotni |

V zvezku s kvadratno mrežo vse to vidiš na papirju. Vse vodoravne črte mreže so med seboj vzporedne, prav tako vse navpične. Vsaka vodoravna črta je pravokotna na vsako navpično. Razmik med sosednjima vodoravnima črtama je povsod enak, to je razdalja med vzporednicama.

## Drugače: Iz vsakdanjega življenja

**Točka.** Na zemljevidu je kraj, na primer Ljubljana, majhna pika: pokaže lego, ne velikosti. Prav to je točka.

**Poltrak.** Žarek svetlobe iz laserskega kazalnika se začne pri kazalniku in gre naravnost naprej, dokler ga kaj ne ustavi. Podoben je poltraku: ima začetek, konca pa si v mislih ne predstavljaš.

**Daljica.** Napeta vrvica, rob mize, svinčnik: vse to so daljice, saj imajo jasna krajišča in jih lahko izmeriš.

**Vzporednici.** Tirnici na železnici, črti na robu ceste, strune na kitari, letve na ograji. Tirnici morata biti povsod enako narazen, sicer bi vlak iztiril.

**Pravokotnici.** Vogal sobe, kjer se stena sreča s tlemi, okenski okvir, križišče ulic v mrežasto zgrajenem mestu.

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
4. Preveri: izmeri razdaljo med $p$ in $q$ na dveh mestih. Če dobiš obakrat $3\,\text{cm}$, je $q \parallel p$. Če dobiš $3\,\text{cm}$ in $3{,}4\,\text{cm}$, premici nista vzporedni.

**Postopek C: pravokotnica skozi točko.** Isto točko $T$ povežemo s $p$ tako, da je črta pravokotna na $p$.

1. Stranico ob pravem kotu geotrikotnika položi na $p$.
2. Geotrikotnik drsi po $p$, dokler druga stranica ob pravem kotu ne gre skozi $T$. Po njej potegni črto do $p$.
3. Dolžina te črte je razdalja točke $T$ od premice $p$: $3\,\text{cm}$.

## Drugače: Bolj natančno

**Osnovni pojmi.** Točke, premice in ravnine ne definiramo z drugimi pojmi, ampak jih sprejmemo kot osnovne in določimo, kako se obnašajo. Taka pravila, na primer »skozi dve različni točki gre natanko ena premica«, so **aksiomi**. Iz njih izpeljemo vse druge trditve.

**Daljica in poltrak kot množici točk.** Daljica $AB$ vsebuje krajišči $A$ in $B$ ter vse točke premice med njima. Poltrak $AB$ vsebuje daljico $AB$ in vse točke premice za $B$. V nekaterih učbenikih daljico zapišejo kot $[AB]$, poltrak kot $[AB$, dolžino pa kot $|AB|$ ali $d(A, B)$.

**Neskončno točk, a končna dolžina.** Daljica ima končno dolžino, pa vendar neskončno mnogo točk: med vsakima dvema točkama je še razpolovišče, torej še ena točka, in tako naprej. Dolžina zato ni število točk, ampak mera.

**Aksiom o vzporednicah.** Trditev, da gre skozi točko zunaj premice natanko ena vzporednica, ravninska geometrija sprejme kot aksiom (enakovreden je Evklidovemu petemu postulatu). Iz nje izpeljemo na primer, da je premica, pravokotna na eno od dveh vzporednic, pravokotna tudi na drugo.

**Zakaj pravokotna razdalja?** Razdaljo točke od premice merimo po pravokotni daljici, ker je ta najkrajša od vseh daljic od točke do premice. Zakaj je tako, spoznaš v 8. razredu s Pitagorovim izrekom.

## Preveri se

? Koliko premic gre skozi dve različni točki $A$ in $B$?
- nobena
+ natanko ena
- natanko dve
- neskončno mnogo
> Skozi dve različni točki gre natanko ena premica, premica $AB$. Neskončno mnogo premic gre skozi eno samo točko.

? Kje ima začetek poltrak $AB$?
+ v točki $A$
- v točki $B$
- v razpolovišču daljice $AB$
- poltrak nima začetka
> Poltrak $AB$ se začne v prvi navedeni točki $A$ in poteka skozi $B$ naprej. Poltrak $BA$ bi imel začetek v $B$.

? Daljica $AB$ je dolga $9\,\text{cm}$, $M$ je njeno razpolovišče. Koliko je $|AM|$?
- $3\,\text{cm}$
+ $4{,}5\,\text{cm}$
- $9\,\text{cm}$
- $18\,\text{cm}$
> Razpolovišče deli daljico na dve enaki polovici: $|AM| = 9\,\text{cm} : 2 = 4{,}5\,\text{cm}$. Odgovor $18\,\text{cm}$ dobiš, če dolžino podvojiš.

? V ravnini je $a \perp b$ in $b \parallel c$ (premici $b$ in $c$ sta različni). Kaj velja za premici $a$ in $c$?
+ $a \perp c$
- $a \parallel c$
- $a$ in $c$ sovpadata
- Tega ne moremo ugotoviti.
> Premica, ki je pravokotna na eno od dveh vzporednic, je pravokotna tudi na drugo, zato $a \perp c$.

:::simboli
X, Y | točki | | | XY je daljica ali poltrak s krajiščem X
p | premica | | | X ∈ p: točka X leži na premici p
A, B | krajišči daljice AB | | | dolžino daljice zapišemo z navpičnicama: ∣AB∣
C | točka na daljici AB | | | ∣AB∣ = ∣AC∣ + ∣CB∣
M | razpolovišče daljice | | | enako oddaljeno od obeh krajišč
a, b, c, d | premice v isti ravnini | | | ∥ vzporedni, ⊥ pravokotni
:::
