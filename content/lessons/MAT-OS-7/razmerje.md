---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Z bratom izdelata leseno klop za šolski sejem. Za les si dal $12$ €, brat $18$ €. Klop prodata za $45$ €. Kako si denar pošteno razdelita? Če vsak dobi polovico, dobi brat premalo, saj je dal več. Pošteno je, da denar razdelita tako, kot sta prispevala: na vsakih $12$ € tvojega denarja pride $18$ € bratovega.

Takšno primerjavo dveh količin imenujemo **razmerje**. Z njim zidar meša malto, mizar načrtuje mere police, slikopleskar meša barvo za ograjo. Odgovor za klop izračunaš v razlagi: najprej razmerje **okrajšaš**, nato znesek **razdeliš v danem razmerju**.

## Razlaga

**1. Razmerje in njegova člena.** Prispevka primerjamo z dvopičjem: $12 : 18$, beremo »$12$ proti $18$«. To je razmerje tvojega prispevka proti bratovemu. Na splošno razmerje količin $a$ in $b$ zapišemo $a : b$. Števili $a$ in $b$ sta **člena razmerja**: $a$ je prvi člen, $b$ drugi člen.

Vrstni red je pomemben. Razmerje bratovega prispevka proti tvojemu je $18 : 12$, ne $12 : 18$.

*Preveri:* v škatli je $7$ vijakov in $10$ žebljev. Kakšno je razmerje žebljev proti vijakom? (Odgovor: $10 : 7$.)

**2. Vrednost razmerja.** Če prvi člen delimo z drugim, dobimo **vrednost razmerja**: vrednost razmerja $a : b$ je $\dfrac{a}{b}$. Vrednost razmerja $12 : 18$ je $\dfrac{12}{18} = \dfrac{2}{3}$, torej je tvoj prispevek dve tretjini bratovega. Vrednost razmerja pove, kolikokrat je ena količina večja ali manjša od druge.

*Preveri:* kolikšna je vrednost razmerja $3 : 4$? (Odgovor: $\dfrac{3}{4} = 0{,}75$.)

**3. Razširjanje in krajšanje.** Vrednost razmerja je ulomek, zato razmerje razširjamo in krajšamo kot ulomek. Oba člena pomnožimo ali delimo z **istim** številom $k$, različnim od $0$. Vrednost razmerja se ne spremeni:

$$a : b = (a \cdot k) : (b \cdot k), \quad k \neq 0$$

$$a : b = (a : k) : (b : k), \quad k \neq 0$$

V drugi vrstici znak »:« v oklepaju pomeni deljenje, zunaj oklepajev pa razmerje.

:::premisli
Nik pravi: »Če obema členoma razmerja $2 : 3$ prištejem $1$, dobim enako razmerje $3 : 4$.« Ima prav? Napovej, nato primerjaj vrednosti.
---
Nima. Vrednost $2 : 3$ je $\dfrac{2}{3} \approx 0{,}67$, vrednost $3 : 4$ pa $\dfrac{3}{4} = 0{,}75$. Prištevanje spremeni razmerje. Barva iz $2$ lončkov modre in $3$ lončkov rumene je drugačna kot iz $3$ lončkov modre in $4$ lončkov rumene. Člena smeš le množiti ali deliti z istim številom.
:::

**4. Okrajšano razmerje.** Razmerje je **okrajšano** (do konca), ko sta člena naravni števili brez skupnega delitelja, večjega od $1$. Takim številom rečemo **tuji števili**. Razmerje okrajšamo v enem koraku tako, da oba člena delimo z njunim **največjim skupnim deliteljem**, ki ga zapišemo $D(a, b)$:

$$12 : 18 = (12 : 6) : (18 : 6) = 2 : 3, \quad \text{ker je } D(12, 18) = 6.$$

Pri klopi to pomeni: na vsaka $2$ evra, ki si ju dal ti, je brat dal $3$ evre.

*Preveri:* okrajšaj $16 : 24$. (Odgovor: $D(16, 24) = 8$, zato $2 : 3$.)

**5. Razmerje količin z enotami.** Ko primerjamo istovrstni količini (dolžino z dolžino, maso z maso), ju najprej zapišemo v **isti enoti**. Enoti se pokrajšata, zato je razmerje samo število:

$$50\,\text{cm} : 2\,\text{m} = 50\,\text{cm} : 200\,\text{cm} = 50 : 200 = 1 : 4$$

*Preveri:* okrajšaj $30\,\text{cm} : 1{,}5\,\text{m}$. (Odgovor: $30 : 150 = 1 : 5$.)

**6. Razmerje z ulomki ali decimalnimi števili.** Člena najprej razširimo, da postaneta naravni števili, nato razmerje okrajšamo:

- decimalni števili razširimo z $10$, $100$ …: $0{,}6 : 1{,}5 = 6 : 15 = 2 : 5$,
- ulomke razširimo z najmanjšim skupnim večkratnikom imenovalcev: $\dfrac{2}{3} : \dfrac{5}{6} = 4 : 5$ (razširili smo s $6$: $\dfrac{2}{3} \cdot 6 = 4$ in $\dfrac{5}{6} \cdot 6 = 5$).

*Preveri:* okrajšaj $\dfrac{1}{2} : \dfrac{3}{4}$. (Odgovor: razširimo s $4$ in dobimo $2 : 3$.)

**7. Deljenje v danem razmerju.** Zdaj razdeliva $45$ € za klop. Prispevka sta v razmerju $2 : 3$. Denar si predstavljaj kot trak iz $2 + 3 = 5$ enakih delov:

:::risba skica
opis: Trak za 45 evrov je razdeljen na 5 enakih delov po 9 evrov. Prva 2 dela sta modra in označena »ti: 2 dela = 18 €«, naslednji 3 deli so oranžni in označeni »brat: 3 deli = 27 €«.
območje: 0; 0 .. 10; 3
pravokotnik: 0; 1 .. 2; 2 | modra
pravokotnik: 2; 1 .. 4; 2 | modra
pravokotnik: 4; 1 .. 6; 2 | oranžna
pravokotnik: 6; 1 .. 8; 2 | oranžna
pravokotnik: 8; 1 .. 10; 2 | oranžna
napis: 1; 1,5 | 9 € | sredina
napis: 3; 1,5 | 9 € | sredina
napis: 5; 1,5 | 9 € | sredina
napis: 7; 1,5 | 9 € | sredina
napis: 9; 1,5 | 9 € | sredina
napis: 2; 2,5 | ti: 2 dela = 18 € | sredina
napis: 7; 2,5 | brat: 3 deli = 27 € | sredina
napis: 5; 0,4 | skupaj 45 € | sredina
:::

En del je $45 : 5 = 9$ evrov. Ti dobiš $2 \cdot 9 = 18$ evrov, brat $3 \cdot 9 = 27$ evrov. Preverimo: $18 + 27 = 45$ in $18 : 27 = 2 : 3$.

Na splošno količino $c$ razdelimo v razmerju $a : b$ takole:

| Korak | Kaj narediš |
|---|---|
| 1. | Seštej člena: vseh delov je $a + b$. |
| 2. | En del: $c : (a + b)$. |
| 3. | Prvi dobi $a$ delov, drugi $b$ delov. |
| 4. | Preveri, ali je vsota delov enaka $c$. |

:::premisli
Kolikšen del vseh $45$ € dobiš ti: $\dfrac{2}{3}$ zneska ali kaj drugega? Napovej s pomočjo traku.
---
$\dfrac{2}{5}$ zneska, ker dobiš $2$ od $5$ enakih delov: $\dfrac{2}{5} \cdot 45 = 18$. Ulomek $\dfrac{2}{3}$ pove le, kolikšen je tvoj del v primerjavi z bratovim ($18$ je $\dfrac{2}{3}$ od $27$).
:::

Enako deliš v razmerju s tremi členi, na primer $a : b : d$, le delov je $a + b + d$. Pri razmerju $a : b$ prvi dobi $\dfrac{a}{a + b}$ celote, drugi pa $\dfrac{b}{a + b}$ celote.

Preizkusi še v simulaciji »Razmerje pri mešanju soka«: sok in vodo nastavi najprej v razmerju $1 : 3$, nato $2 : 6$. Opazuj, da je barva v vrču obakrat enaka. Nato z drsnikom »skupaj« nastavi $800\,\text{mL}$ in preberi, koliko je soka in koliko vode ($200\,\text{mL}$ in $600\,\text{mL}$).

## Rešeni primeri

### Primer 1 (lažji)

Okvir za sliko ima stranici dolgi $45\,\text{cm}$ in $60\,\text{cm}$. Zapiši okrajšano razmerje krajše stranice proti daljši.

**Podatki:** krajša stranica $45\,\text{cm}$; daljša stranica $60\,\text{cm}$
**Iščemo:** okrajšano razmerje krajše stranice proti daljši

:::formula
Okrajšanje: oba člena delimo z največjim skupnim deliteljem: $a : b = \big(a : D(a,b)\big) : \big(b : D(a,b)\big)$
:::

**Rešitev:**

1. Obe dolžini sta v centimetrih, zato je razmerje $45 : 60$.
2. Delitelji števila $45$: $1, 3, 5, 9, 15, 45$. Delitelji števila $60$: $1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60$. Največji skupni delitelj je $D(45, 60) = 15$.
3. Oba člena delimo s $15$: $45 : 15 = 3$ in $60 : 15 = 4$.
4. Števili $3$ in $4$ sta tuji, zato je razmerje okrajšano do konca.
5. Odgovor: stranici sta v razmerju $3 : 4$; na vsake $3$ dele krajše stranice pridejo $4$ deli daljše.

### Primer 2 (srednji)

Mizar razreže letev, dolgo $3{,}6\,\text{m}$, na dva kosa v razmerju $4 : 5$. Kako dolga sta kosa?

**Podatki:** dolžina letve $3{,}6\,\text{m}$; razmerje kosov $4 : 5$
**Iščemo:** dolžino krajšega in daljšega kosa

:::formula
Deljenje v razmerju $a : b$: en del $= c : (a + b)$; prvi kos $= a \cdot$ en del, drugi kos $= b \cdot$ en del
:::

**Rešitev:**

1. Pretvorimo v centimetre, da računamo z naravnimi števili: $3{,}6\,\text{m} = 360\,\text{cm}$.
2. Vseh delov je $4 + 5 = 9$.
3. En del: $360\,\text{cm} : 9 = 40\,\text{cm}$.
4. Krajši kos: $4 \cdot 40\,\text{cm} = 160\,\text{cm}$. Daljši kos: $5 \cdot 40\,\text{cm} = 200\,\text{cm}$.
5. Preverimo: $160\,\text{cm} + 200\,\text{cm} = 360\,\text{cm}$ in $160 : 200 = 4 : 5$.
6. Odgovor: kosa sta dolga $160\,\text{cm}$ ($1{,}6\,\text{m}$) in $200\,\text{cm}$ ($2\,\text{m}$).

### Primer 3 (težji: poznaš le količino ene sestavine)

Za zeleno barvo za ograjo zmešaš modro in rumeno barvo v razmerju $3 : 5$. Imaš $1{,}2\,\text{l}$ modre barve in jo želiš porabiti vso. Koliko rumene barve potrebuješ in koliko zelene barve dobiš?

**Podatki:** razmerje modra : rumena $= 3 : 5$; modre barve je $1{,}2\,\text{l}$
**Iščemo:** prostornino rumene barve in prostornino zelene barve

:::formula
Znani del je $a$ delov, zato je en del $=$ znani del $: a$. Drugi del $= b \cdot$ en del, skupaj $(a + b) \cdot$ en del.
:::

**Rešitev:**

1. Pretvorimo v mililitre: $1{,}2\,\text{l} = 1200\,\text{ml}$.
2. Celote tu ne poznamo. Poznamo modro barvo, ki so $3$ deli. En del: $1200\,\text{ml} : 3 = 400\,\text{ml}$.
3. Rumena barva je $5$ delov: $5 \cdot 400\,\text{ml} = 2000\,\text{ml}$.
4. Zelene barve je $3 + 5 = 8$ delov: $8 \cdot 400\,\text{ml} = 3200\,\text{ml}$.
5. Preverimo: $1200 : 2000 = 3 : 5$ in $1200\,\text{ml} + 2000\,\text{ml} = 3200\,\text{ml}$.
6. Odgovor: potrebuješ $2\,\text{l}$ rumene barve in dobiš $3{,}2\,\text{l}$ zelene barve.

### Primer 4 – zdaj ti

Tri sestre si razdelijo $650$ € v razmerju $\dfrac{1}{2} : \dfrac{1}{3} : \dfrac{1}{4}$. Koliko evrov dobi vsaka?

**Podatki:** vsota $650$ €; razmerje $\dfrac{1}{2} : \dfrac{1}{3} : \dfrac{1}{4}$
**Iščemo:** znesek prve, druge in tretje sestre

:::formula
Razmerje z ulomki razširimo z najmanjšim skupnim večkratnikom imenovalcev. Nato: en del $=$ vsota $: (a + b + d)$.
:::

**Rešitev:**

1. Imenovalci so $2$, $3$ in $4$. Njihov najmanjši skupni večkratnik je $v(2, 3, 4) = 12$.
2. Vse člene pomnožimo z $12$: $\dfrac{1}{2} \cdot 12 = 6$, $\dfrac{1}{3} \cdot 12 = 4$, $\dfrac{1}{4} \cdot 12 = 3$. Razmerje je $6 : 4 : 3$.
3. Vseh delov je $6 + 4 + 3 = 13$.
4. Izračunaj sam en del in znesek vsake sestre, nato preveri:

:::premisli
Koliko je en del in koliko dobi vsaka sestra?
---
En del: $650 : 13 = 50$, torej $50$ €. Prva sestra dobi $6 \cdot 50 = 300$ €, druga $4 \cdot 50 = 200$ €, tretja $3 \cdot 50 = 150$ €. Preverba: $300 + 200 + 150 = 650$.
:::

## Pogoste napake

- **Različne enote.** Razmerje $50\,\text{cm} : 2\,\text{m}$ ni $50 : 2 = 25 : 1$. Količini morata biti v isti enoti, zato najprej pretvori: $50\,\text{cm} : 200\,\text{cm} = 1 : 4$.
- **Zamenjan vrstni red.** Če naloga sprašuje razmerje bratovega prispevka proti tvojemu, odgovor $2 : 3$ ni pravilen, pravilno je $3 : 2$. Člene vedno zapiši v vrstnem redu, kot ga navaja besedilo.
- **Deliš z napačnim številom delov.** Pri deljenju $35$ bonbonov v razmerju $3 : 4$ ne računaš $35 : 3$ ali $35 : 4$. Celoto sestavljajo vsi deli, zato deliš z $3 + 4 = 7$: en del je $5$, prvi dobi $15$, drugi $20$ bonbonov. Obratno, kadar poznaš le količino ene sestavine (na primer $3$ dele), deliš s $3$, ne z vsoto delov.
- **Razmerje zamenjaš z ulomkom celote.** V razmerju $2 : 3$ prvi del ni $\dfrac{2}{3}$ celote, ampak $\dfrac{2}{2 + 3} = \dfrac{2}{5}$ celote. Ulomek $\dfrac{2}{3}$ pove le, kolikšen je prvi del v primerjavi z drugim.
- **Člene odštevaš, prištevaš ali ne okrajšaš do konca.** Razmerje $12 : 18$ ni enako $6 : 12$ (od obeh členov smo odšteli $6$), saj je $12 : 18 = 2 : 3$, $6 : 12$ pa $1 : 2$. Člena smeš le **deliti** ali **množiti** z istim številom. Razmerje $4 : 6$ je pravilno, a ni okrajšano do konca, ker imata $4$ in $6$ še skupni delitelj $2$.

## Povzetek

- Razmerje $a : b$ beremo »$a$ proti $b$«; $a$ in $b$ sta člena razmerja, vrstni red je pomemben.
- Vrednost razmerja $a : b$ je $\dfrac{a}{b}$.
- Razširjanje in krajšanje: $a : b = (a \cdot k) : (b \cdot k) = (a : k) : (b : k)$, $k \neq 0$.
- Okrajšano razmerje: oba člena delimo z $D(a, b)$; člena sta nato tuji naravni števili.
- Količine primerjamo v isti enoti; decimalna števila in ulomke najprej spremenimo v naravna števila.
- Deljenje $c$ v razmerju $a : b$: en del je $c : (a + b)$, dela sta $a$ in $b$ delov.
- Če poznaš le količino, ki ustreza $a$ delom, je en del ta količina $: a$.

## Drugače: Na sliki

Predstavljaj si vrsto kozarcev enake velikosti. Malinovec mešaš iz sirupa in vode v razmerju $1 : 5$. Postaviš en kozarec sirupa (temno rdeč) in pet kozarcev vode (prozornih). Vseh kozarcev je šest. Ko vse zliješ v vrč, je v vrču šest enakih delov in en del od šestih je sirup.

Če želiš več pijače, k vsakemu kozarcu sirupa dodaš novih pet kozarcev vode: dva rdeča in deset prozornih, tri rdeči in petnajst prozornih. Vrsta kozarcev se podaljša, vzorec pa ostane enak: en rdeč na pet prozornih. Zato je malinovec enako sladek. To je razširjanje razmerja: $1 : 5 = 2 : 10 = 3 : 15$.

Pri deljenju v razmerju naredi obratno: celotno količino razdeli na toliko enakih kozarcev, kolikor je vseh delov, nato jih preštej za vsako sestavino.

## Drugače: Iz vsakdanjega življenja

Razmerja uporabljaš pogosteje, kot misliš:

- **Kuhanje.** Za riž vzameš riž in vodo v razmerju približno $1 : 2$. Za eno skodelico riža dve skodelici vode, za tri skodelice riža šest skodelic vode.
- **Gradnja.** Zidar meša cement in pesek na primer v razmerju $1 : 3$. Če ima $20$ lopat mešanice, je vseh delov $1 + 3 = 4$, en del je $5$ lopat: $5$ lopat cementa in $15$ lopat peska.
- **Delitev denarja.** Če Jure za skupno darilo prispeva $10$ €, Tina pa $15$ €, je razmerje prispevkov $10 : 15 = 2 : 3$. Če darilo prodata naprej za $30$ €, je pošteno, da si denar razdelita v istem razmerju: Jure $12$ €, Tina $18$ €.

V vseh primerih razmerje pove, kako so deli med seboj povezani, ne glede na to, koliko je celota.

## Drugače: Korak za korakom s številkami

Okrajšaj razmerje $0{,}48\,\text{kg} : 600\,\text{g}$.

1. Količini pretvori v isto enoto: $0{,}48\,\text{kg} = 480\,\text{g}$. Razmerje je $480 : 600$.
2. Če je potrebno, odpravi decimalna mesta (tu jih ni več).
3. Poišči največji skupni delitelj: $480 = 2^5 \cdot 3 \cdot 5$, $600 = 2^3 \cdot 3 \cdot 5^2$, zato je $D(480, 600) = 2^3 \cdot 3 \cdot 5 = 120$.
4. Deli oba člena s $120$: $480 : 120 = 4$, $600 : 120 = 5$.
5. Okrajšano razmerje je $4 : 5$.
6. Preveri: vrednost $\dfrac{480}{600} = 0{,}8$ in $\dfrac{4}{5} = 0{,}8$ sta enaki.

Če ne najdeš takoj največjega skupnega delitelja, lahko krajšaš postopoma: $480 : 600 = 48 : 60 = 4 : 5$ (najprej z $10$, nato z $12$).

## Drugače: Bolj natančno

Razmerje $a : b$ dveh pozitivnih števil ima vrednost $\dfrac{a}{b}$. Dve razmerji sta enaki natanko tedaj, ko imata enako vrednost. Zato razširjanje in krajšanje razmerja delujeta enako kot pri ulomkih: $\dfrac{a \cdot k}{b \cdot k} = \dfrac{a}{b}$ za vsak $k \neq 0$.

Drugi člen ne sme biti $0$, ker z nič ne moremo deliti. Okrajšana oblika je enolična: če sta člena tuji naravni števili, je razmerje že v najpreprostejši obliki in druge take oblike ni.

Pri razmerju treh količin $a : b : d$ ena sama vrednost ne zadošča, ker hkrati primerjamo tri pare. Vse člene zato vedno množimo ali delimo z **istim** številom. Krajšamo jih z največjim skupnim deliteljem vseh treh: $8 : 12 : 20 = 2 : 3 : 5$, ker je $D(8, 12, 20) = 4$.

Pri deljenju količine $c$ v razmerju $a : b$ dobi prvi del $\dfrac{a}{a + b} \cdot c$, drugi pa $\dfrac{b}{a + b} \cdot c$. Ulomka se seštejeta v $1$, zato vsota obeh delov res znaša $c$.

## Preveri se

? Trak kaže, koliko vedrov cementa in peska je zidar stresel v mešalnik. Kakšno je okrajšano razmerje cementa proti pesku?
:::risba skica
opis: Trak iz 6 enakih delov. Prva 2 dela sta siva in označena »cement«, naslednji 4 deli so oranžni in označeni »pesek«. Vsak del je eno vedro.
območje: 0; 0 .. 12; 3
pravokotnik: 0; 1 .. 2; 2 | siva
pravokotnik: 2; 1 .. 4; 2 | siva
pravokotnik: 4; 1 .. 6; 2 | oranžna
pravokotnik: 6; 1 .. 8; 2 | oranžna
pravokotnik: 8; 1 .. 10; 2 | oranžna
pravokotnik: 10; 1 .. 12; 2 | oranžna
napis: 2; 2,5 | cement | sredina
napis: 8; 2,5 | pesek | sredina
napis: 6; 0,4 | vsak del je eno vedro | sredina
:::
- $2 : 1$
~ Zamenjal si vrstni red: prvi je cement, ker je v vprašanju naveden prvi.
- $1 : 3$
~ To je del cementa v vsej mešanici ($2$ od $6$ vedrov), ne razmerje cementa proti pesku.
- $2 : 4$
~ Razmerje je pravilno, a ni okrajšano do konca: $2$ in $4$ imata skupni delitelj $2$.
+ $1 : 2$
> Cementa sta $2$ vedra, peska $4$ vedra: $2 : 4 = 1 : 2$, ker je $D(2, 4) = 2$.

? Luka okrajša razmerje $24 : 36$ tako, da od obeh členov odšteje $12$, in dobi $12 : 24$. Zakaj to ni prav?
- Ker bi moral od obeh členov odšteti $6$.
~ Odštevanje istega števila nikoli ne ohrani razmerja, ne glede na to, katero število odšteješ.
+ Ker smeš oba člena le množiti ali deliti z istim številom; $12 : 24 = 1 : 2$, $24 : 36$ pa je $2 : 3$.
- Rezultat je pravilen, le okrajšan ni do konca.
~ Rezultat ni pravilen: vrednost $\dfrac{12}{24} = \dfrac{1}{2}$ ni enaka $\dfrac{24}{36} = \dfrac{2}{3}$.
> Pri odštevanju se vrednost razmerja spremeni. Pravilno: $D(24, 36) = 12$, zato $24 : 36 = 2 : 3$.

? Za malto zmešaš apno in pesek v razmerju $1 : 3$. Porabil si $45\,\text{kg}$ peska. Koliko kilogramov apna potrebuješ?
= 15 kg | 0
~ 11,25 | Razdelil si $45\,\text{kg}$ na $1 + 3 = 4$ dele, a $45\,\text{kg}$ je samo pesek, ne vsa malta.
~ 135 | Zamenjal si vlogi: apna je manj kot peska, zato $45$ deliš s $3$, ne množiš.
> Pesek so $3$ deli, zato je en del $45 : 3 = 15$, torej $15\,\text{kg}$. Apno je en del: $15\,\text{kg}$.

? Mizar razreže $1\,\text{m}$ dolgo letev na dva kosa v razmerju $1 : 2$. Približno koliko centimetrov meri daljši kos? Zaokroži na cele centimetre.
= 67 cm | 1
~ 33 | To je krajši kos ($1$ del), vprašanje pa sprašuje po daljšem ($2$ dela).
~ 50 | Delil si $100$ z drugim členom $2$. Deliš z vsoto delov $1 + 2 = 3$.
> En del je $100 : 3 \approx 33{,}3\,\text{cm}$, daljši kos ima $2$ dela: $\dfrac{2}{3} \cdot 100 \approx 66{,}7$, torej približno $67\,\text{cm}$.

? Za beton zmešaš cement, pesek in gramoz v razmerju $1 : 2 : 3$. Koliko kilogramov gramoza je v $1200\,\text{kg}$ betonske mešanice?
- $400\,\text{kg}$
~ Mešanico si razdelil na tri enake dele, kot da je vsake sestavine enako.
- $200\,\text{kg}$
~ To je en del, torej masa cementa. Gramoz so $3$ deli.
- $720\,\text{kg}$
~ Delil si z $2 + 3 = 5$ in pozabil na cement, ki je tudi del mešanice: $1200 : 5 \cdot 3 = 720$.
+ $600\,\text{kg}$
> Vseh delov je $1 + 2 + 3 = 6$, en del je $1200 : 6 = 200$, gramoz pa $3 \cdot 200 = 600$, torej $600\,\text{kg}$.

:::simboli
a, b | člena razmerja | | | $a : b$ beremo »a proti b«
d | tretji člen razmerja | | | pri razmerju $a : b : d$
k | število, s katerim množimo ali delimo oba člena | | | $k \neq 0$
D | največji skupni delitelj | | | po deljenju z $D(a, b)$ sta člena tuji števili
c | količina, ki jo delimo v razmerju | | | en del je $c : (a + b)$
v | najmanjši skupni večkratnik | | | $v(2, 3, 4) = 12$
:::

<<RACUN
vrednost: 12/18 | 2/3
vrednost: 45/(2+3) | 9
vrednost: 2*9 | 18
vrednost: 3*9 | 27
vrednost: 45/60 | 3/4
vrednost: 360/(4+5) | 40
vrednost: 4*40 | 160
vrednost: 5*40 | 200
vrednost: 1200/3 | 400
vrednost: 5*400 | 2000
vrednost: 8*400 | 3200
vrednost: 650/(6+4+3) | 50
vrednost: 2/4 | 1/2
vrednost: 45/3 | 15
vrednost: 100*2/3 | 66.7
vrednost: 1200/(1+2+3)*3 | 600
>>
