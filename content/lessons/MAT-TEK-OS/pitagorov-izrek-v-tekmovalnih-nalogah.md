---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi iz kuhinje pekač in šiviljski meter. Izmeri obe stranici pekača in še diagonalo, od kota do nasprotnega kota. Pri velikem pekaču $30\,\text{cm} \times 40\,\text{cm}$ dobiš diagonalo natanko $50\,\text{cm}$, ne $70\,\text{cm}$.

Diagonala je torej krajša od vsote stranic, a daljša od vsake posebej. Kako jo izračunati brez merjenja? Odgovor je Pitagorov izrek, ki ga poznaš iz šole. Na tekmovanjih pa je skrit: v mreži, v kvadratih, ki stojijo na stranicah, ali v liku, kjer moraš pravokotni trikotnik šele najti.

## Razlaga

**1. Meritve, ki ne izdajo vzorca.** Trije pekači iz omare:

| stranica $a$ | stranica $b$ | diagonala $d$ |
|---|---|---|
| $30\,\text{cm}$ | $40\,\text{cm}$ | $50\,\text{cm}$ |
| $12\,\text{cm}$ | $16\,\text{cm}$ | $20\,\text{cm}$ |
| $20\,\text{cm}$ | $21\,\text{cm}$ | $29\,\text{cm}$ |

Vsota $a + b$ ni $d$, razlika tudi ne. Pravilo se bolj jasno pokaže na mreži.

**2. Nagnjeni kvadrati na karirastem papirju.** Na mreži nariši kvadrat, katerega vsaka stranica gre $a$ kvadratkov vodoravno in $b$ kvadratkov navpično; par $(a, b)$ je **korak** stranice. Ploščino izračunaš z dopolnjevanjem iz prejšnje lekcije: okvir je kvadrat s stranico $a + b$, v kotih pa so štirje pravokotni trikotniki s katetama $a$ in $b$.

| korak $(a, b)$ | okvir $(a + b)^2$ | 4 kotni trikotniki | ploščina kvadrata |
|---|---|---|---|
| $(1, 1)$ | $4$ | $2$ | $2$ |
| $(2, 1)$ | $9$ | $4$ | $5$ |
| $(3, 1)$ | $16$ | $6$ | $10$ |
| $(3, 2)$ | $25$ | $12$ | $13$ |

Primerjaj zadnji stolpec s koraki: $1 + 1 = 2$, $4 + 1 = 5$, $9 + 1 = 10$, $9 + 4 = 13$.

:::premisli
Napovej ploščino nagnjenega kvadrata s korakom $(4, 3)$, preden računaš z okvirjem. Kolikšna je njegova stranica?
---
Po vzorcu $4^2 + 3^2 = 16 + 9 = 25$. Z okvirjem: $49 - 24 = 25$. Stranica je $5$, ker je $5 \cdot 5 = 25$. To je isti trikotnik $3$–$4$–$5$ kot pri pekaču $30 \times 40$.
:::

**3. Ime pravila.** Stranica nagnjenega kvadrata je **hipotenuza** kotnega pravokotnega trikotnika s **katetama** $a$ in $b$ (kateti oklepata pravi kot, hipotenuza mu leži nasproti in je najdaljša). Če hipotenuzo označimo s $c$, vzorec pravi:

$$c^2 = a^2 + b^2$$

To je **Pitagorov izrek**. Povedano s ploščinami: kvadrat na hipotenuzi ima toliko ploščine kot oba kvadrata na katetah skupaj. Tekmovalne naloge pogosto podajo kar ploščine kvadratov; takrat korena sploh ne potrebuješ.

**4. Razdalje v mreži.** Za točki na mreži preštej, koliko kvadratkov sta narazen vodoravno ($\Delta x$) in navpično ($\Delta y$). Ravna razdalja je $d = \sqrt{\Delta x^2 + \Delta y^2}$. Pot po črtah mreže je $\Delta x + \Delta y$ in je daljša, razen kadar točki ležita na isti mrežni črti.

**5. Pitagorejske trojice.** Celoštevilske trojice, ki ustrezajo izreku, se splača znati na pamet: $3$–$4$–$5$, $5$–$12$–$13$, $8$–$15$–$17$, $7$–$24$–$25$, $20$–$21$–$29$ in njihovi večkratniki ($6$–$8$–$10$, $30$–$40$–$50$). Prihranijo čas in so dober namig, da si na pravi poti. Velja tudi obrat: če je $c^2 = a^2 + b^2$, je kot nasproti $c$ pravi. Kuhinjski monter tako preveri vogal pulta: na eni steni označi $60\,\text{cm}$, na drugi $80\,\text{cm}$; če sta oznaki $100\,\text{cm}$ narazen, je vogal pravi.

:::premisli
Ali je trikotnik s stranicami $7$, $8$ in $9$ pravokoten? Napovej, nato utemelji z izrekom.
---
Velja $7^2 + 8^2 = 113$, a $9^2 = 81$. Enakost ne velja, zato trikotnik ni pravokoten (kot nasproti $9$ je oster). Izrek velja samo za pravokotne trikotnike.
:::

**6. Skriti pravokotni trikotniki.** V likih jih najdeš tako, da potegneš črto, ki ustvari pravi kot: višino enakokrakega trikotnika (razpolovi osnovnico), diagonalo pravokotnika, diagonalo osnovne ploskve kvadra. V simulaciji spodaj »Pitagorov izrek v likih« izberi *Diagonala kvadra*: opazi, da potrebuješ izrek dvakrat, najprej za dno, nato z višino. V simulaciji »Najkrajša pot« premikaj točko na premici in poišči najkrajšo pot. Zvijača z zrcaljenjem (Primer 4) spremeni zlomljeno pot v ravno črto, njeno dolžino pa izračunaš s Pitagorovim izrekom.

## Rešeni primeri

### Primer 1 (lažji): muha na kuhinjskih ploščicah

Tla v kuhinji so iz kvadratnih ploščic s stranico $25\,\text{cm}$. Muha sedi v oglišču ploščice in odleti naravnost v oglišče, ki je $6$ ploščic bolj desno in $8$ ploščic više. Koliko centimetrov preleti?

**Podatki:** stranica ploščice $25\,\text{cm}$; $\Delta x = 6$ ploščic, $\Delta y = 8$ ploščic
**Iščemo:** razdaljo $d$

:::formula
$d = \sqrt{\Delta x^2 + \Delta y^2}$
:::

**Rešitev:**

1. Vodoravni in navpični premik sta kateti, let je hipotenuza.
2. $d^2 = 6^2 + 8^2 = 36 + 64 = 100$, torej $d = 10$ ploščic (trojica $6$–$8$–$10$).
3. Pretvorimo v centimetre: $10 \cdot 25 = 250$.
4. Odgovor: muha preleti $250\,\text{cm} = 2{,}5\,\text{m}$.

### Primer 2: piškoti ob kosu peciva

Na pladnju leži kos peciva v obliki pravokotnega trikotnika. Ob vsako stranico slaščičar položi kvadraten piškot, katerega stranica je natanko enaka tej stranici trikotnika. Največji piškot ima ploščino $169\,\text{cm}^2$, najmanjši $25\,\text{cm}^2$. Kolikšna je ploščina srednjega piškota in kolikšna ploščina peciva?

**Podatki:** $p_{\text{največji}} = 169\,\text{cm}^2$, $p_{\text{najmanjši}} = 25\,\text{cm}^2$; trikotnik je pravokoten
**Iščemo:** $p_{\text{srednji}}$ in ploščino trikotnika $p$

:::formula
Kvadrati na stranicah: $p_c = p_a + p_b$; trikotnik: $p = \dfrac{a \cdot b}{2}$
:::

**Rešitev:**

1. Največji piškot leži ob hipotenuzi, ker je ta najdaljša stranica.
2. Srednji piškot: $169 - 25 = 144$, ker je kvadrat na hipotenuzi vsota obeh drugih.
3. Kateti: $a = 5\,\text{cm}$ (ker $5 \cdot 5 = 25$) in $b = 12\,\text{cm}$ (ker $12 \cdot 12 = 144$).
4. Pecivo: $p = \dfrac{5 \cdot 12}{2} = 30$.
5. Odgovor: srednji piškot ima $144\,\text{cm}^2$, pecivo pa $30\,\text{cm}^2$.

### Primer 3 (težji): kuhalnica v škatli

Kuhalnica je dolga $30\,\text{cm}$. Ali gre v zaprto škatlo z notranjimi merami $12\,\text{cm} \times 16\,\text{cm} \times 21\,\text{cm}$, če jo smemo postaviti tudi poševno?

**Podatki:** dolžina kuhalnice $l = 30\,\text{cm}$; škatla $12\,\text{cm} \times 16\,\text{cm} \times 21\,\text{cm}$
**Iščemo:** najdaljšo daljico v škatli (telesno diagonalo $D$) in primerjavo z $l$

:::formula
Dvakrat Pitagora: $d^2 = a^2 + b^2$, nato $D^2 = d^2 + c^2$
:::

**Rešitev:**

1. Najdaljša daljica v škatli povezuje nasprotni oglišči: to je telesna diagonala.
2. Diagonala dna: $d^2 = 12^2 + 16^2 = 144 + 256 = 400$, torej $d = 20\,\text{cm}$.
3. Diagonala dna in navpični rob $21\,\text{cm}$ oklepata pravi kot, zato: $D^2 = 20^2 + 21^2 = 400 + 441 = 841$, torej $D = 29\,\text{cm}$.
4. Primerjamo: $29\,\text{cm} < 30\,\text{cm}$.
5. Odgovor: kuhalnica v škatlo ne gre, niti poševno; za $1\,\text{cm}$ je predolga.

### Primer 4 – zdaj ti: najkrajša pot mimo pulta

Kuharica stoji v točki $A$, ki je $3\,\text{m}$ od ravnega roba pulta. Krožnik mora položiti na pult in nato iti do točke $B$, ki je $5\,\text{m}$ od istega roba. Pravokotni projekciji točk $A$ in $B$ na rob pulta sta $6\,\text{m}$ narazen. Kolikšna je najkrajša pot $A \to$ pult $\to B$?

**Podatki:** razdalja $A$ do roba $3\,\text{m}$; $B$ do roba $5\,\text{m}$; projekciji $6\,\text{m}$ narazen
**Iščemo:** najkrajšo dolžino poti

:::formula
Zrcaljenje: $B$ prezrcalimo čez rob v $B'$; najkrajša pot je $|AB'| = \sqrt{6^2 + (3 + 5)^2}$
:::

**Rešitev:**

1. Za vsako točko $P$ na robu je $PB = PB'$, zato je pot $A \to P \to B$ enako dolga kot $A \to P \to B'$.
2. Ta je najkrajša, ko je ravna. $B'$ je $5\,\text{m}$ na drugi strani roba, zato je navpična razlika $3 + 5 = 8$, vodoravna pa $6$.
3. Izračunaj $|AB'|$ sam.

:::premisli
Kolikšna je najkrajša pot?
---
$|AB'|^2 = 6^2 + 8^2 = 36 + 64 = 100$, torej $10\,\text{m}$. Spet trojica $6$–$8$–$10$.
:::

## Pogoste napake

**Seštevanje stranic namesto kvadratov.** »Kateti $3$ in $4$, torej hipotenuza $7$.« Tako izračunaš pot po robovih, ne ravne poti. Popravek: kvadriraj, seštej, šele nato koreni: $\sqrt{9 + 16} = 5$.

**Seštevanje pri obratni nalogi.** Znani sta hipotenuza $25$ in kateta $7$, pa izračunaš $25^2 + 7^2$. Hipotenuza je najdaljša, zato mora biti iskana kateta krajša. Popravek: $b^2 = c^2 - a^2$.

**Pozabljen koren ali prezgoden koren.** Iz $d^2 = 100$ zapišeš $d = 100$, ali pa že vmes zaokrožiš koren in na koncu dobiš napačno trojico. Popravek: računaj s kvadrati do konca in koreni samo enkrat, na koncu.

**Krak namesto višine.** Pri enakokrakem trikotniku s krakom $13$ in osnovnico $10$ vzameš $13$ za višino. Krak je hipotenuza skritega trikotnika; višina je kateta: $\sqrt{13^2 - 5^2} = 12$.

**Izrek v nepravokotnem trikotniku.** Pitagorov izrek velja le, kadar je pravi kot. Če ga ni, ga ustvari s pomožno črto.

## Povzetek

V pravokotnem trikotniku je $c^2 = a^2 + b^2$; $c$ je hipotenuza, nasproti pravega kota.

- Kvadrat na hipotenuzi ima ploščino enako vsoti ploščin kvadratov na katetah; pogosto zadostujejo ploščine brez korenov.
- Razdalja v mreži: $d = \sqrt{\Delta x^2 + \Delta y^2}$; pot po črtah $\Delta x + \Delta y$ je daljša (razen na isti mrežni črti).
- Obratna naloga: $b^2 = c^2 - a^2$.
- Trojice: $3$–$4$–$5$, $5$–$12$–$13$, $8$–$15$–$17$, $7$–$24$–$25$, $20$–$21$–$29$ in večkratniki.
- Skriti pravokotni trikotniki: višina enakokrakega trikotnika, diagonala pravokotnika, telesna diagonala kvadra (dvakrat izrek), najkrajša pot z zrcaljenjem.

## Drugače: Korak za korakom s številkami

Enakokraki trikotnik ima kraka po $17\,\text{cm}$ in osnovnico $16\,\text{cm}$. Kolikšna je ploščina?

1. Nariši višino na osnovnico. Razpolovi jo: $16 : 2 = 8$.
2. Skriti pravokotni trikotnik ima hipotenuzo $17$ (krak) in kateto $8$.
3. Kvadriraj: $17^2 = 289$, $8^2 = 64$.
4. Odštej, ker iščeš kateto: $289 - 64 = 225$.
5. Koreni: $15 \cdot 15 = 225$, višina je $15\,\text{cm}$ (trojica $8$–$15$–$17$).
6. Ploščina: $\dfrac{16 \cdot 15}{2} = 120$, torej $120\,\text{cm}^2$.

## Drugače: Kot zgodba

Luka pomaga babici pri peki. Babica reče: »Ta dolgi lopar ne gre v pekač, ki je $30$ na $40$.« Lopar meri $45\,\text{cm}$. Luka ga hoče postaviti po dolgem, pa je pekač dolg le $40\,\text{cm}$.

»Kaj pa poševno?« pomisli. Diagonalo pekača izmeri z metrom: $50\,\text{cm}$. Lopar gre noter.

Zvečer na karirast papir nariše trikotnik s katetama $3$ in $4$ kvadratke in na vsako stranico postavi kvadrat. Prešteje: $9$ in $16$, na hipotenuzi pa z dopolnjevanjem $25$. »Aha,« pravi, »$9 + 16 = 25$, polovica pekača $30 \times 40$ pa je le desetkrat večji trikotnik $3$–$4$–$5$.« Naslednji dan babici pokaže, da bi diagonalo lahko izračunal, še preden je vzel meter v roke.

## Preveri se

? Katera trojica stranic $a$, $b$, $c$ opisuje pravokotni trikotnik?
- $2$, $3$, $5$
~ Velja $2 + 3 = 5$, a izrek govori o kvadratih. Tak »trikotnik« je celo ploščat.
- $7$, $8$, $9$
~ Zaporedna števila kot $3$, $4$, $5$ niso dovolj: $49 + 64 = 113 \ne 81$.
+ $6$, $8$, $10$
- $5$, $12$, $17$
~ $5 + 12 = 17$, kar spet sešteje stranice; prava trojica je $5$–$12$–$13$.
> $36 + 64 = 100 = 10^2$; to je trojica $3$–$4$–$5$, pomnožena z $2$.

? Na oko oceni: kvadratna deska za rezanje ima stranico $10\,\text{cm}$. Koliko približno meri njena diagonala?
- $20\,\text{cm}$
~ To je vsota stranic, pot okoli vogala. Diagonala je bližnjica, zato krajša.
+ približno $14\,\text{cm}$
- $10\,\text{cm}$
~ Diagonala je hipotenuza in je daljša od vsake katete.
- $200\,\text{cm}$
~ To je $d^2 = 100 + 100$, pozabil si koreniti.
> $d^2 = 200$; ker je $14^2 = 196$, je $d \approx 14{,}1\,\text{cm}$.

? Na mreži gre pot od $(0, 0)$ do $(3, 4)$. Zakaj je ravna razdalja $5$, čeprav je treba narediti $3 + 4 = 7$ korakov?
- Ker se diagonalni koraki štejejo kot pol koraka.
~ V mreži ni »polovičnih« korakov; ravna črta sploh ne gre po črtah mreže.
+ Ker je $7$ dolžina poti po črtah (dveh katet), ravna črta pa je hipotenuza: $\sqrt{9 + 16} = 5$.
- Ker je ravna razdalja vedno za $2$ krajša od poti po mreži.
~ To velja le slučajno tu. Od $(0, 0)$ do $(1, 1)$ je pot $2$, ravna razdalja pa $\sqrt{2} \approx 1{,}4$.
> Pot po črtah je vsota katet, ravna črta je hipotenuza. Hipotenuza je vedno krajša od vsote katet.

? Hipotenuza pravokotnega trikotnika meri $25\,\text{cm}$, ena kateta $7\,\text{cm}$. Koliko meri druga kateta?
- $18\,\text{cm}$
~ Odšteti moraš kvadrate, ne stranic: $25 - 7 = 18$ ne upošteva izreka.
- približno $26\,\text{cm}$
~ Kvadrata si seštel, kot da je $25$ kateta. Kateta mora biti krajša od hipotenuze.
+ $24\,\text{cm}$
> $b^2 = 625 - 49 = 576$, $b = 24\,\text{cm}$ (trojica $7$–$24$–$25$).

? Trikoten piškotni model je enakokrak: kraka merita $13\,\text{cm}$, osnovnica $10\,\text{cm}$. Kolikšna je ploščina piškota?
- $65\,\text{cm}^2$
~ Krak si vzel za višino ($\dfrac{10 \cdot 13}{2}$). Krak je poševen; višina je kateta skritega trikotnika.
- $120\,\text{cm}^2$
~ Višina $12$ je prava, a pozabil si deliti z $2$.
+ $60\,\text{cm}^2$
> Polovica osnovnice $5$, višina $\sqrt{169 - 25} = 12$, ploščina $\dfrac{10 \cdot 12}{2} = 60\,\text{cm}^2$.

:::simboli
a, b | kateti pravokotnega trikotnika | | | pri pravokotniku ali škatli stranici (robova) osnovne ploskve
c | hipotenuza | c^2 = a^2 + b^2 | | pri škatli tretji rob (višina)
d | diagonala (ravna razdalja v mreži) | d = \sqrt{\Delta x^2 + \Delta y^2} | |
x | vodoravna lega v mreži (v kvadratkih) | | |
y | navpična lega v mreži (v kvadratkih) | | |
p_a, p_b | ploščini kvadratov nad katetama | | |
p_c | ploščina kvadrata nad hipotenuzo | p_c = p_a + p_b | |
p | ploščina trikotnika | p = \frac{a \cdot b}{2} | |
D | telesna diagonala škatle | D^2 = d^2 + c^2 | |
A, B | začetna in končna točka poti | | |
B' | zrcalna slika točke B čez rob pulta | | | razdalja AB′ je dolžina najkrajše poti
:::
