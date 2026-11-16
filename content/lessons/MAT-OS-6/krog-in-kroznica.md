---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Kako bi okrog znamenja na koži narisal mejo, ki je povsod enako daleč od njegove sredine, na primer $1\,\text{cm}$? To mora znati dermatologinja, preden sumljivo znamenje izreže. V drugi ambulanti optik posveti v oko in izmeri zenico: čez sredino meri $4\,\text{mm}$.

Na videz nimata nič skupnega: prvo je črta na koži, drugo črna odprtina v očesu. Obe pa skrivata isto idejo. Obstaja ena sama sredinska točka, rob pa je od nje povsod enako oddaljen. Pri znamenju poznamo razdaljo od sredine do roba, pri zenici razdaljo čez sredino. Kako sta ti dve dolžini povezani?

Odgovor dajo štirje pojmi: **središče, polmer, premer in tetiva**. Z njimi boš risal s šestilom, pozneje pa računal obseg in ploščino kroga.

## Razlaga

**1. Slika.** Na risbi so vsi štirje pojmi hkrati. Razložili jih bomo po vrsti.

:::risba skica
opis: Krožnica s središčem S. Navpična daljica AB gre skozi S od vrha do dna krožnice: to je premer. Daljica SC gre iz S vodoravno desno do krožnice: to je polmer. Daljica DE povezuje dve točki na levi strani krožnice in ne gre skozi S: to je tetiva. Točka T leži desno zgoraj, zunaj krožnice.
območje: 0; 0 .. 10; 6
krog: 5; 3 | 2,5 | modra
črta: 5; 5,5 -> 5; 0,5 | oranžna
črta: 5; 3 -> 7,5; 3 | zelena
črta: 2,83; 4,25 -> 3,75; 0,83 | rdeča
točka: 5; 3 | S | levo
točka: 5; 5,5 | A | desno
točka: 5; 0,5 | B | desno
točka: 7,5; 3 | C | desno
točka: 2,83; 4,25 | D | levo
točka: 3,75; 0,83 | E | levo
točka: 9; 4,6 | T | levo
:::

| Na sliki | Ime | Oznaka |
|---|---|---|
| pika v sredini | središče | $S$ |
| črta okoli $S$ | krožnica | $k$ |
| črta od $S$ do $C$ | polmer | $r$ |
| črta od $D$ do $E$ | tetiva | $DE$ |
| črta $A$–$S$–$B$ | premer | $d$ |

**2. Krožnica in krog.** Okrogla (modra) črta okoli $S$ je **krožnica**: vse njene točke so od točke $S$ oddaljene enako, natanko za izbrano razdaljo. Točka $S$ je **središče**. Krožnica je samo črta, rob. Če ji dodamo še vse točke znotraj nje, dobimo **krog**, torej ploskev. Okrogel obliž je krog, njegov rob je krožnica.

**3. Polmer.** **Polmer** je daljica od središča do točke na krožnici, na sliki $SC$. Tudi njeno dolžino imenujemo polmer in jo označimo z $r$. Vsi polmeri iste krožnice so enako dolgi, kot špice pri kolesu.

**4. Tetiva in premer.** **Tetiva** je daljica, ki povezuje dve točki na krožnici, na sliki $DE$. **Premer** je tetiva, ki gre skozi središče, na sliki $AB$. Njegovo dolžino označimo z $d$.

Dve točki na krožnici, na primer $D$ in $E$, razdelita krožnico na dva dela. Imenujemo ju **krožna loka**.

V simulaciji spodaj (»Krog, krožnica in premica«) izberi »Premica in krožnica« in premico povleci tako, da seka krožnico. Nato jo počasi premikaj proti središču. Opazuj, kako se tetiva daljša in kdaj postane premer.

:::premisli
Primerjaj ravno pot od $D$ do $E$ z ovinkom od $D$ do $S$ in naprej do $E$. Katera tetiva je najdaljša možna in zakaj ne more biti nobena daljša?
---
Najdaljša je premer. Pot od $D$ do $E$ čez središče je dolga $r + r$. Ravna daljica $DE$ je najkrajša pot med točkama, zato ni daljša od $r + r$. Enako dolga je le, če gre skozi $S$, torej če je premer.
:::

**5. Od slike do zveze.** Na sliki premer $AB$ sestavljata dva polmera, $SA$ in $SB$. Zato je premer dvakrat daljši od polmera:

$$d = 2r$$

$$r = \frac{d}{2}$$

Pri zenici s premerom $4\,\text{mm}$ je torej polmer $2\,\text{mm}$.

**6. Risanje s šestilom.** Razmik med iglo in svinčnikom z ravnilom nastavi na polmer. Iglo zapiči v središče in svinčnik zavrti okrog nje. Igla in razmik se ne smeta premakniti, sicer točke niso enako oddaljene od središča.

:::premisli
Zenico s premerom $4\,\text{mm}$ želiš narisati povečano, s premerom $4\,\text{cm}$. Kaj dobiš, če šestilo razpreš na $4\,\text{cm}$?
---
Krožnico s polmerom $4\,\text{cm}$, torej s premerom $8\,\text{cm}$: dvakrat preveliko. Šestilo meri polmer, zato ga razpreš na $4\,\text{cm} : 2 = 2\,\text{cm}$.
:::

**7. Lega točke.** Točko $T$ primerjamo s krožnico tako, da razdaljo $|ST|$ (dolžino daljice $ST$) primerjamo s polmerom:

| Razdalja | Lega točke $T$ |
|---|---|
| $\lvert ST\rvert < r$ | v krogu, znotraj krožnice |
| $\lvert ST\rvert = r$ | na krožnici |
| $\lvert ST\rvert > r$ | zunaj kroga |

Na sliki je $T$ dlje od $S$ kot $C$, zato leži zunaj kroga.

**8. Zapis.** Krožnico s središčem $S$ in polmerom $r$ zapišemo $k(S, r)$. Na primer $k(S, 3\,\text{cm})$ je krožnica s središčem $S$ in polmerom $3\,\text{cm}$.

## Rešeni primeri

### Primer 1 (lažji)

Okrogla elektroda za EKG, ki jo medicinska sestra prilepi na prsni koš, ima polmer $2{,}4\,\text{cm}$. Kolikšen je njen premer?

**Podatki:** $r = 2{,}4\,\text{cm}$
**Iščemo:** premer $d$

:::formula
$d = 2r$
:::

**Rešitev:**

1. Premer sestavljata dva polmera: $d = 2 \cdot 2{,}4\,\text{cm} = 4{,}8\,\text{cm}$.
2. Preizkus: $4{,}8\,\text{cm} : 2 = 2{,}4\,\text{cm}$, kar je res polmer.
3. Odgovor: premer elektrode je $4{,}8\,\text{cm}$.

### Primer 2 (srednji)

Okrogla petrijevka v bolnišničnem laboratoriju ima premer $9\,\text{cm}$. Kolikšen je njen polmer v milimetrih? Kako dolga je najdaljša ravna poteza, ki jo laborantka lahko potegne po dnu od roba do roba?

**Podatki:** $d = 9\,\text{cm}$, $1\,\text{cm} = 10\,\text{mm}$
**Iščemo:** polmer $r$ v $\text{mm}$ in dolžino najdaljše tetive

:::formula
$r = \dfrac{d}{2}$; najdaljša tetiva je premer
:::

**Rešitev:**

1. Pretvorimo enote: $9\,\text{cm} = 90\,\text{mm}$ (množimo z $10$).
2. Polmer je polovica premera: $r = \dfrac{90\,\text{mm}}{2} = 45\,\text{mm}$.
3. Poteza od roba do roba je tetiva. Najdaljša tetiva je premer, torej $90\,\text{mm}$.
4. Preizkus: $2 \cdot 45\,\text{mm} = 90\,\text{mm}$.
5. Odgovor: polmer petrijevke je $45\,\text{mm}$, najdaljša poteza meri $90\,\text{mm}$.

### Primer 3 (težji): zdaj ti

Dermatologinja okrog znamenja s središčem $S$ zariše krožnico s premerom $2\,\text{cm}$; kar je v krogu, bo izrezala. Pegica $A$ je od $S$ oddaljena $0{,}6\,\text{cm}$, pegica $B$ $1\,\text{cm}$, pegica $C$ pa $1{,}3\,\text{cm}$. Kje leži vsaka pegica? Ali lahko naredi raven rez od roba do roba, dolg $2{,}2\,\text{cm}$?

**Podatki:** $d = 2\,\text{cm}$; $|SA| = 0{,}6\,\text{cm}$; $|SB| = 1\,\text{cm}$; $|SC| = 1{,}3\,\text{cm}$; rez od roba do roba $2{,}2\,\text{cm}$
**Iščemo:** lego pegic $A$, $B$, $C$ in ali tak rez obstaja

:::formula
$r = \dfrac{d}{2}$; primerjaj $\lvert ST\rvert$ z $r$; nobena tetiva ni daljša od $d$
:::

**Rešitev:**

1. Polmer: $r = \dfrac{2\,\text{cm}}{2} = 1\,\text{cm}$. S polmerom primerjamo razdalje, ker meri od središča do roba.
2. Pegica $A$: $0{,}6\,\text{cm} < 1\,\text{cm}$, zato leži v krogu in bo izrezana.
3. Pegica $B$: $1\,\text{cm} = 1\,\text{cm}$, zato leži na krožnici, natanko na črti reza.
4. Za pegico $C$ in za rez odloči sam, nato preveri:

:::premisli
Kje leži pegica $C$? Ali obstaja rez od roba do roba, dolg $2{,}2\,\text{cm}$?
---
$1{,}3\,\text{cm} > 1\,\text{cm}$, zato je $C$ zunaj kroga in ostane. Rez od roba do roba je tetiva. Najdaljša tetiva je premer, $2\,\text{cm}$. Ker je $2{,}2\,\text{cm} > 2\,\text{cm}$, takega reza ni.
:::

## Pogoste napake

- **Mešanje kroga in krožnice.** Razlog: v vsakdanjem govoru obe besedi pomenita »nekaj okroglega«. Pravilno: krožnica je samo črta (rob), krog je rob skupaj z notranjostjo. Točka znotraj kroga ni na krožnici.
- **Zamenjava polmera in premera.** Razlog: obe daljici sta pri krožnici. Pri premeru $4\,\text{mm}$ nekdo zapiše polmer $8\,\text{mm}$. Pravilno: $d = 2r$, premer je daljši. Iz premera dobiš polmer z deljenjem z $2$, iz polmera premer z množenjem z $2$. Šestilo vedno nastavi na polmer.
- **»Vsaka tetiva je premer.«** Razlog: obe sta daljici med točkama na krožnici. Pravilno: premer je le tetiva skozi središče. Vsaka druga tetiva je krajša od premera.
- **»Polmer je daljica od roba do roba.«** Razlog: pogled ostane na robu, središče spregledaš. Pravilno: polmer se vedno začne v središču. Daljica od roba do roba je tetiva.
- **»Večji polmer, premer zraste le malo.«** Razlog: nekdo k premeru prišteje, kar je dodal polmeru. Pravilno: premer je vedno dvakratnik polmera. Če polmer podvojiš, se podvoji tudi premer; če polmer povečaš za $1\,\text{cm}$, se premer poveča za $2\,\text{cm}$.

## Povzetek

- **Krožnica** $k(S, r)$ je črta iz vseh točk, ki so od središča $S$ oddaljene za $r$. **Krog** je krožnica skupaj z notranjostjo.
- **Polmer** je daljica od središča do točke na krožnici; vsi polmeri so enako dolgi.
- **Tetiva** je daljica med dvema točkama na krožnici, **premer** je tetiva skozi središče.
- $d = 2r$ in $r = \dfrac{d}{2}$. Premer je najdaljša tetiva.
- Lega točke $T$: $\lvert ST\rvert < r$ v krogu, $\lvert ST\rvert = r$ na krožnici, $\lvert ST\rvert > r$ zunaj kroga.
- Šestilo nastavimo na polmer, igla je v središču.

## Drugače: Z analogijo

Krog je kot pašnik koze, privezane na količek.

- **Količek** je središče $S$.
- **Napeta vrv** je polmer: kamorkoli koza gre, vrv je enako dolga.
- Kjer koza hodi z napeto vrvjo, pusti v travi sled: to je **krožnica**.
- Vsa trava, ki jo lahko popase, je **krog**.
- Dve kozi z enako dolgima vrvema na istem količku se postavita na nasprotni strani. Narazen sta za dve dolžini vrvi: to je **premer**, $d = 2r$.
- Ravna steza med dvema točkama na robu pašnika je **tetiva**. Najdaljša je tista, ki gre čez količek, torej čez sredino.

Analogija ima mejo: vrv se povesi, polmer pa je vedno raven in natanko enako dolg.

## Drugače: Iz vsakdanjega življenja

- **Kolo.** Os je središče, vsaka špica polmer, rob pnevmatike krožnica. Kolo se vrti mirno, ker je rob povsod enako daleč od osi.
- **Pica.** Rez čez sredino je premer, rez mimo sredine tetiva. Rez čez sredino razdeli pico na dve enaki polovici in je najdaljši.
- **Ruter z dosegom $15\,\text{m}$.** Telefon na razdalji $12\,\text{m}$ je v krogu dosega, na $15\,\text{m}$ na robu, na $20\,\text{m}$ zunaj. To je lega točke glede na krožnico.
- **Zenica.** V temi se zenica razširi, na svetlem zoži. Premer se spreminja, oblika pa ostane krog s središčem na sredini.

## Preveri se

? Na sliki je krožnica s središčem $S$. Katera daljica je tetiva, ki ni premer?
:::risba skica
opis: Krožnica s središčem S. Daljica SF gre iz S desno navzgor do krožnice. Daljica AB gre navpično skozi S od vrha do dna krožnice. Daljica DE povezuje dve točki na levi strani krožnice in ne gre skozi S.
območje: 0; 0 .. 10; 6
krog: 5; 3 | 2,5 | modra
črta: 5; 3 -> 7,17; 4,25
črta: 5; 5,5 -> 5; 0,5
črta: 2,83; 4,25 -> 3,75; 0,83
točka: 5; 3 | S | levo
točka: 7,17; 4,25 | F | desno
točka: 5; 5,5 | A | desno
točka: 5; 0,5 | B | desno
točka: 2,83; 4,25 | D | levo
točka: 3,75; 0,83 | E | levo
:::
- $SF$
~ $SF$ ima eno krajišče v središču, zato je polmer. Tetiva ima obe krajišči na krožnici.
- $AB$
~ $AB$ je tetiva, a gre skozi središče, zato je premer.
+ $DE$
> $DE$ povezuje dve točki na krožnici in ne gre skozi $S$: je tetiva, ki ni premer.

? Po cepljenju je rdečina na koži okrogla. Zdravnica izmeri, da je rob od sredine oddaljen $2{,}5\,\text{cm}$. Kolikšen je premer rdečine?
= 5 cm
~ 1,25 | Razpolovil si polmer. Premer je dvakrat daljši od polmera, zato množiš z $2$.
~ 2,5 | To je polmer, razdalja od sredine do roba. Premer gre čez vso rdečino.
> Razdalja od sredine do roba je polmer: $d = 2r = 2 \cdot 2{,}5\,\text{cm} = 5\,\text{cm}$.

? Narisati želiš krožnico s premerom $6\,\text{cm}$. Razvrsti korake po vrsti.
1. Izračunaj polmer: $6\,\text{cm} : 2 = 3\,\text{cm}$.
2. Z ravnilom razpri šestilo na $3\,\text{cm}$.
3. Iglo šestila zapiči v središče $S$.
4. Svinčnik zavrti okrog igle, ne da bi premaknil iglo.
> Šestilo meri polmer, zato najprej izračunaš polmer. Nato nastaviš razmik, zapičiš iglo v središče in zavrtiš.

? Kaj se zgodi s premerom krožnice, če njen polmer podvojiš?
- Ostane enak.
~ Premer je sestavljen iz dveh polmerov, zato se spremeni skupaj s polmerom.
- Poveča se le za toliko, za kolikor se je povečal polmer.
~ Povečata se oba polmera, ki sestavljata premer, zato premer zraste za dvakrat toliko.
+ Podvoji se.
- Početveri se.
~ Premer je $2r$: če $r$ podvojiš, se $2r$ podvoji, ne početveri.
> $d = 2r$. Če je nov polmer $2r$, je nov premer $2 \cdot 2r = 4r$, kar je dvakrat več kot prej $2r$.

? Najdaljša ravna črta, ki jo lahko narišeš po okroglem obližu, meri $7\,\text{cm}$. Koliko centimetrov je rob obliža oddaljen od njegovega središča?
= 3,5 cm
~ 7 | $7\,\text{cm}$ je najdaljša tetiva, torej premer. Razdalja od središča do roba je polmer, polovica premera.
~ 14 | Podvojil si premer. Polmer dobiš z deljenjem z $2$.
> Najdaljša tetiva je premer, $d = 7\,\text{cm}$. Rob je od središča oddaljen za polmer: $r = \dfrac{7\,\text{cm}}{2} = 3{,}5\,\text{cm}$.

<<RACUN
vrednost: 2*2.4 | 4.8
vrednost: 90/2 | 45
vrednost: 2*45 | 90
vrednost: 2/2 | 1
vrednost: 4/2 | 2
vrednost: 2*4 | 8
vrednost: 2*2.5 | 5
vrednost: 6/2 | 3
vrednost: 7/2 | 3.5
enote: 9*cm | 90*mm
>>

:::simboli
S | središče krožnice | | | vse točke krožnice so od $S$ enako daleč
r | polmer | r = \frac{d}{2} | | razdalja od središča do krožnice
d | premer | d = 2r | | najdaljša tetiva
k | krožnica | | | zapis $k(S, r)$
T | točka, ki jo primerjamo s krožnico | | | $\lvert ST\rvert < r$: v krogu; $= r$: na krožnici; $> r$: zunaj
:::
