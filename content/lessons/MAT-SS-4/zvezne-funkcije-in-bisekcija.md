---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Lastnosti zveznih funkcij na zaprtem intervalu in bisekcijo matura preverja samo na višji ravni.*

Na bencinski črpalki števec pri tankanju teče od $0$ € do $60$ €. Ali je v nekem trenutku kazal točno $35$ €? Seveda: gorivo teče brez prekinitve, zato števec ne more preskočiti nobenega zneska.

Druga zgodba. Z avtom se pelješ od doma na nadmorski višini $300\,\mathrm{m}$ do smučišča na $1500\,\mathrm{m}$. Si bil kdaj točno na $1000\,\mathrm{m}$? Tudi tu je odgovor da, čeprav cesta vmes pada in se vzpenja.

Primera sta si na videz tuja, ideja je ista. Količina, ki se spreminja brez skokov, mora na poti od začetne do končne vrednosti doseči vsako vmesno vrednost. Na tej misli stoji ena najpreprostejših metod za reševanje enačb, ki jih ne znaš rešiti s formulo. Z njo boš izračunal celo skrite obresti pri nakupu na obroke.

## Razlaga

**1. Mamljiva, a napačna ideja.** Marsikdo sklepa: »Če je vrednost na začetku negativna in na koncu pozitivna, je bila vmes enaka $0$.« Preveri to na stanju bančnega računa. Zjutraj je na njem $-30$ € (dovoljeni minus). Opoldne pride plača $80$ € in stanje je $+50$ €. Bilo je negativno, nato pozitivno, a nikoli točno $0$ €.

:::risba graf
opis: Stanje računa v evrih v odvisnosti od časa v urah. Od 0 do 12 ur je stanje ves čas −30 €, ob 12. uri skoči na +50 € in tam ostane do 20. ure. Vrednosti 0 graf nikjer ne doseže.
x: 0 .. 20 | 4 | čas [h]
y: -40 .. 60 | 20 | stanje [€]
črta: 0; -30 -> 12; -30 | modra debelo
črta: 12; 50 -> 20; 50 | modra debelo
krog: 12; -30 | 0,3 | modra
točka: 12; 50
napis: 6; -30 | −30 € | nad
napis: 16; 50 | +50 € | pod
:::

Graf ima pri $12$ urah **skok**. Denar se na račun ne pretaka postopoma, ampak pride naenkrat. Ideja »vmes je bila nič« torej ni napačna, le pogoj ji manjka: funkcija ne sme skakati.

**2. Popravljena trditev.** Funkcija $f$ je **zvezna na zaprtem intervalu** $[a, b]$, če je zvezna v vsaki točki tega intervala; njen graf nad $[a, b]$ narišeš, ne da bi dvignil svinčnik. Za tako funkcijo velja **izrek o ničli**:

$$f(a) \cdot f(b) < 0 \;\Rightarrow\; f(c) = 0 \text{ za vsaj en } c \in (a, b)$$

Pogoj $f(a) \cdot f(b) < 0$ je kratek zapis za »vrednosti na krajiščih imata različna predznaka«. Pozor na besedo **vsaj**: ničel je lahko tudi več.

:::premisli
Funkcija $f(x) = x^2 - 1$ ima na krajiščih intervala $[-2, 2]$ vrednosti $f(-2) = 3$ in $f(2) = 3$, torej enak predznak. Ali to pomeni, da na $[-2, 2]$ nima ničle?
---
Ne. Ničli sta $x = -1$ in $x = 1$. Graf se spusti pod os in se vrne. Izrek pove samo, kaj velja pri različnih predznakih; pri enakih ne pove ničesar.
:::

**3. Vse vmesne vrednosti.** Izrek o ničli je poseben primer splošnejše lastnosti. Zvezna funkcija na $[a, b]$ zavzame **vsako vrednost med $f(a)$ in $f(b)$**. To je natanko primer črpalke: števec od $0$ € do $60$ € pokaže vsak znesek vmes.

V simulaciji spodaj izberi funkcijo »skok«. Na intervalu $[0, 2]$ je $f(0) = 0$ in $f(2) = 3$. Poišči na grafu točko z vrednostjo $1{,}5$. Opazi, da je ni: levi del se konča tik pod $1$, desni se začne pri $2$.

**4. Največja in najmanjša vrednost.** Zvezna funkcija na **zaprtem** intervalu $[a, b]$ na njem doseže najmanjšo vrednost $m$ in največjo vrednost $M$. Zato zavzame vse vrednosti od $m$ do $M$ in nobene zunaj.

Oba pogoja, zveznost in zaprt interval, sta nujna. Funkcija $f(x) = x$ na odprtem intervalu $(0, 1)$ je zvezna, a največje vrednosti nima: $0{,}9$; $0{,}99$; $0{,}999$ … so vse dosežene, $1$ pa ne. Funkcija $f(x) = \frac{1}{x}$ pa na $[-1, 1]$ ni zvezna, ker v $0$ ni definirana; blizu $0$ raste čez vse meje in največje vrednosti nima.

**5. Bisekcija.** Enačbe $x^3 + x - 3 = 0$ ne znaš rešiti s formulo. Izrek o ničli pa ti da načrt. Velja $f(1) = -1 < 0$ in $f(2) = 7 > 0$, torej je ničla na $[1, 2]$. Interval razpoloviš v sredini $c = \frac{a + b}{2}$ in izračunaš $f(c)$. Obdržiš tisto polovico, na kateri se predznak zamenja. Postopek ponavljaš. Tej metodi rečemo **bisekcija** (razpolavljanje).

Po vsakem koraku je interval pol krajši. Po $n$ korakih ima dolžino

$$d_n = \frac{b - a}{2^n}$$

Ničlo poznaš na **natančnost** $d_n$: ne veš točno, kje je, veš pa, da je v intervalu te dolžine.

:::premisli
Začneš na intervalu dolžine $1$. Koliko korakov bisekcije potrebuješ, da bo interval krajši od $0{,}001$?
---
$10$ korakov. $2^{9} = 512$ je še premalo ($\frac{1}{512} > 0{,}001$), $2^{10} = 1024$ pa zadošča. Vsak korak razpolovi interval, zato tri decimalke stanejo približno $10$ korakov.
:::

**6. Tehnologija.** Računanje vrednosti na roke je počasno. Pomagaš si na dva načina.

- **Žepno računalo s tabelo vrednosti:** vpišeš $f(x)$, začetek, konec in korak. Najprej s korakom $0{,}1$ poiščeš, kje se predznak zamenja, nato na tem odseku s korakom $0{,}01$. Vsaka nova tabela da eno decimalko več. Mnoga računala imajo tudi ukaz za reševanje enačbe.
- **Program za risanje grafov:** narišeš graf in z ukazom za ničlo ali presečišče odčitaš točko. Število decimalk nastaviš sam.

Rezultat na $k$ decimalk je zanesljiv šele, ko se obe krajišči končnega intervala zaokrožita na isto število. Na iskanje ničle prevedeš tudi druge naloge. Točka na krivulji, na primer tam, kjer je $f(x) = 2$, je ničla funkcije $f(x) - 2$. Presečišče grafov $f$ in $g$ je ničla razlike $f - g$.

## Rešeni primeri

### Primer 1: kaj vemo brez računanja ničel

Funkcija $f(x) = x^3 - 3x + 1$ je dana na intervalu $[0, 2]$. Kaj lahko o njej povemo z izreki o zveznih funkcijah?

**Podatki:** $f(x) = x^3 - 3x + 1$, interval $[0, 2]$
**Iščemo:** število ničel na $[0, 2]$ in katere vrednosti funkcija zagotovo zavzame

:::formula
Izrek o ničli: $f$ zvezna na $[a, b]$ in $f(a) \cdot f(b) < 0$ ⇒ ničla na $(a, b)$. Zvezna funkcija na $[a, b]$ doseže najmanjšo in največjo vrednost.
:::

**Rešitev:**

1. Polinom je zvezna funkcija na vseh realnih številih, torej tudi na $[0, 2]$.
2. Vrednosti: $f(0) = 1$, $f(1) = 1 - 3 + 1 = -1$, $f(2) = 8 - 6 + 1 = 3$.
3. Na $[0, 1]$ se predznak zamenja, zato je tam vsaj ena ničla. Enako na $[1, 2]$.
4. Polinom tretje stopnje ima največ $3$ ničle, na $[0, 2]$ pa vsaj $2$.
5. Funkcija doseže najmanjšo vrednost $m \le -1$ in največjo $M \ge 3$. Zavzame vse vrednosti od $-1$ do $3$, na primer tudi $2$.
6. Odgovor: na $[0, 2]$ ima $f$ vsaj dve ničli (eno na $(0, 1)$, drugo na $(1, 2)$) in zavzame vsako vrednost med $-1$ in $3$.

:::risba graf
opis: Graf funkcije f(x) = x³ − 3x + 1 na intervalu od 0 do 2. V točki 0 je vrednost 1, v točki 1 je −1, v točki 2 je 3. Graf seka os x enkrat med 0 in 1 ter enkrat med 1 in 2.
x: -0,5 .. 2,5 | 0,5
y: -2 .. 4 | 1
f: x^3 - 3*x + 1 | modra | 0 .. 2
točka: 0; 1 | (0, 1) | desno
točka: 1; -1 | (1, −1) | pod
točka: 2; 3 | (2, 3) | levo
:::

### Primer 2: bisekcija s tabelo

Z bisekcijo poišči ničlo funkcije $f(x) = x^3 + x - 3$ na intervalu $[1, 2]$ na eno decimalko natančno.

**Podatki:** $f(x) = x^3 + x - 3$, začetni interval $[1, 2]$, natančnost na eno decimalko
**Iščemo:** približek ničle

:::formula
Sredina intervala: $c = \dfrac{a + b}{2}$. Obdrži polovico, kjer imata vrednosti na krajiščih različna predznaka.
:::

**Rešitev:**

1. Preverimo pogoj: $f(1) = -1 < 0$, $f(2) = 7 > 0$. Funkcija je zvezna, ničla je na $[1, 2]$.
2. Računamo po korakih. Ker je $f(a) < 0$ in $f(b) > 0$, pri $f(c) > 0$ zamenjamo $b$, pri $f(c) < 0$ pa $a$.

| korak | $[a, b]$ | $c$ | $f(c)$ |
|---|---|---|---|
| 1 | $[1; 2]$ | $1{,}5$ | $1{,}875 > 0$ |
| 2 | $[1; 1{,}5]$ | $1{,}25$ | $\approx 0{,}203 > 0$ |
| 3 | $[1; 1{,}25]$ | $1{,}125$ | $\approx -0{,}451 < 0$ |
| 4 | $[1{,}125; 1{,}25]$ | $1{,}1875$ | $\approx -0{,}138 < 0$ |
| 5 | $[1{,}1875; 1{,}25]$ | $1{,}21875$ | $\approx 0{,}029 > 0$ |

3. Po petem koraku ostane interval $[1{,}1875; 1{,}21875]$, dolg $\frac{1}{32} = 0{,}03125$.
4. Obe krajišči se na eno decimalko zaokrožita na $1{,}2$. Po četrtem koraku je bil interval $[1{,}1875; 1{,}25]$ in to še ni veljalo: $1{,}25$ bi dal $1{,}3$.
5. Odgovor: ničla je $x \approx 1{,}2$.

### Primer 3: skrite obresti pri nakupu na obroke

Prenosnik stane $1000$ €. Trgovina ponuja plačilo v treh letnih obrokih po $370$ €, prvi obrok čez eno leto. Kolikšna je letna obrestna mera $p$, na desetinko odstotka?

**Podatki:** dolg $G_0 = 1000$ €, $3$ obroki po $a = 370$ € na koncu vsakega leta, obrestno obrestovanje
**Iščemo:** obrestno mero $p$ (na $0{,}1$ %)

:::formula
Po vsakem letu se dolg pomnoži z $r = 1 + \dfrac{p}{100}$ in zmanjša za obrok. Po tretjem obroku je dolg $0$:
$((1000r - 370)r - 370)r - 370 = 0$
:::

**Rešitev:**

1. Razčlenimo levo stran: $1000r^3 - 370r^2 - 370r - 370 = 0$. Delimo z $10$ in dobimo $f(r) = 100r^3 - 37r^2 - 37r - 37 = 0$.
2. Enačba tretje stopnje nima lepe rešitve. Iščemo med $0$ % in $10$ %: $f(1) = -11 < 0$ in $f(1{,}1) \approx 10{,}63 > 0$.
3. Štirje koraki bisekcije: $f(1{,}05) = -0{,}88 < 0$, $f(1{,}075) \approx 4{,}70 > 0$, $f(1{,}0625) \approx 1{,}86 > 0$, $f(1{,}05625) \approx 0{,}48 > 0$. Ostane $[1{,}05; 1{,}05625]$, torej je $p$ med $5$ % in $5{,}625$ %.
4. Nadaljujemo s tabelo na računalu od $1{,}05$ s korakom $0{,}001$: $f(1{,}054) \approx -0{,}011 < 0$ in $f(1{,}055) \approx 0{,}21 > 0$.
5. Za desetinko odstotka preverimo meji zaokroževanja $p = 5{,}35$ % in $p = 5{,}45$ %: $f(1{,}0535) \approx -0{,}12 < 0$ in $f(1{,}0545) \approx 0{,}098 > 0$. Ničla je na $(1{,}0535; 1{,}0545)$.
6. Preizkus z $r = 1{,}054$: dolgovi po letih so $684$ €, približno $350{,}94$ € in skoraj $0$ €.
7. Odgovor: skrita letna obrestna mera je približno $5{,}4$ %. Na obroke plačaš $1110$ € namesto $1000$ €.

### Primer 4 – zdaj ti: točka na krivulji s tabelo

Na krivulji $y = x^3 - 3x + 1$ poišči točko z $y = 2$, ki ima $x$ na intervalu $[1, 2]$. Abscisa naj bo na dve decimalki.

**Podatki:** krivulja $y = x^3 - 3x + 1$, ordinata $y = 2$, interval $[1, 2]$, natančnost dve decimalki
**Iščemo:** točko $T(x, 2)$

:::formula
Točka z $y = 2$ je ničla funkcije $g(x) = x^3 - 3x + 1 - 2 = x^3 - 3x - 1$.
:::

**Rešitev:**

1. Tabela s korakom $0{,}1$: $g(1{,}8) = -0{,}568 < 0$, $g(1{,}9) = 0{,}159 > 0$. Ničla je na $[1{,}8; 1{,}9]$.
2. Tabela s korakom $0{,}01$: $g(1{,}87) \approx -0{,}071 < 0$, $g(1{,}88) \approx 0{,}005 > 0$.
3. Na dve decimalki je to lahko $1{,}87$ ali $1{,}88$. Odloči sam: izračunaj $g(1{,}875)$ in zapiši točko.

:::premisli
Koliko je $g(1{,}875)$ in katera je iskana točka?
---
$g(1{,}875) \approx -0{,}033 < 0$, zato je ničla na $(1{,}875; 1{,}88)$ in se zaokroži na $1{,}88$. Točka je $T(1{,}88; 2)$.
:::

## Pogoste napake

- **»Različna predznaka, torej ničla« brez zveznosti.** Kdor tako sklepa pri $f(x) = \frac{1}{x}$ na $[-1, 1]$, išče ničlo, ki je ni: funkcija v $0$ ni definirana in skoči. Najprej preveri, da je funkcija na $[a, b]$ zvezna.
- **»Natanko ena ničla«.** Izrek zagotovi **vsaj** eno ničlo. Funkcija iz primera 1 ima na $[0, 2]$ dve. Število ničel ugotoviš šele z več vrednostmi ali grafom.
- **»Enaka predznaka, torej ni ničle«.** $x^2 - 1$ ima na $[-2, 2]$ na obeh krajiščih vrednost $3$ in vseeno dve ničli. Iz enakih predznakov ne sklepaš ničesar.
- **Napačna polovica pri bisekciji.** Nekateri obdržijo polovico, kjer je $f(c) > 0$, ne glede na drugo krajišče. Obdrži polovico, kjer imata **krajišči** različna predznaka; sicer se oddaljiš od ničle.
- **Prezgodnji konec.** Interval dolžine $0{,}0625$ še ne pomeni ene pravilne decimalke (primer 2 po četrtem koraku). Ustaviš se, ko se obe krajišči zaokrožita enako.

## Povzetek

- $f$ je zvezna na $[a, b]$, če je zvezna v vsaki točki; graf je brez skokov in lukenj.
- Zvezna funkcija na $[a, b]$ doseže najmanjšo in največjo vrednost ter zavzame vse vrednosti vmes.
- Izrek o ničli: $f$ zvezna na $[a, b]$ in $f(a) \cdot f(b) < 0$ ⇒ vsaj ena ničla na $(a, b)$.
- Pri enakih predznakih ali brez zveznosti izrek ne pove ničesar.
- Bisekcija: $c = \frac{a + b}{2}$, obdrži polovico z različnima predznakoma; po $n$ korakih je dolžina $\frac{b - a}{2^n}$.
- S tehnologijo: tabela vrednosti s čedalje manjšim korakom ali ukaz za ničlo oz. presečišče v programu za grafe. Točka na krivulji ali presečišče = ničla razlike.

## Za maturo

### Naloga 1 (višja raven): krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dana je funkcija $f(x) = x^3 - 4x + 1$.

a) Utemelji, da ima enačba $x^3 - 4x + 1 = 0$ natanko tri realne rešitve, in za vsako zapiši interval med zaporednima celima številoma, na katerem leži. (3 točke)
b) Z dvema korakoma bisekcije, začenši na intervalu $[0, 1]$, zoži interval, na katerem leži ena od ničel. (2 točki)
c) Utemelji, da $f$ na intervalu $[0, 2]$ doseže najmanjšo vrednost $m$, in pokaži, da je $m \le -2$. (2 točki)

**Rešitev:**

1. a) $f$ je polinom, zato je zvezna na vseh realnih številih. Vrednosti: $f(-3) = -27 + 12 + 1 = -14$, $f(-2) = -8 + 8 + 1 = 1$, $f(0) = 1$, $f(1) = 1 - 4 + 1 = -2$, $f(2) = 8 - 8 + 1 = 1$.
2. a) Predznak se zamenja na intervalih $[-3, -2]$, $[0, 1]$ in $[1, 2]$, zato ima $f$ po izreku o ničli na vsakem od njih vsaj eno ničlo.
3. a) Polinom tretje stopnje ima največ $3$ ničle, zato ima enačba natanko tri rešitve, po eno na vsakem od teh intervalov.
4. b) Prvi korak: $c_1 = 0{,}5$ in $f(0{,}5) = 0{,}125 - 2 + 1 = -0{,}875 < 0$. Ker je $f(0) > 0$, obdržimo $[0; 0{,}5]$.
5. b) Drugi korak: $c_2 = 0{,}25$ in $f(0{,}25) = \frac{1}{64} - 1 + 1 = \frac{1}{64} > 0$. Ker je $f(0{,}5) < 0$, obdržimo $[0{,}25; 0{,}5]$.
6. c) $f$ je zvezna na zaprtem intervalu $[0, 2]$, zato na njem doseže najmanjšo vrednost $m$. Ker je $1 \in [0, 2]$, je $m \le f(1) = -2$.
7. Odgovor: a) rešitve ležijo na $(-3, -2)$, $(0, 1)$ in $(1, 2)$; b) ničla je na $[0{,}25; 0{,}5]$; c) najmanjša vrednost obstaja in velja $m \le -2$.

**Točkovanje:** a) 1 točka za vrednosti s tremi menjavami predznaka, 1 točka za uporabo izreka o ničli z omembo zveznosti, 1 točka za sklep »natanko tri« (polinom tretje stopnje ima največ tri ničle); b) 1 točka za prvi korak (interval $[0; 0{,}5]$) in 1 točka za drugi korak (interval $[0{,}25; 0{,}5]$); c) 1 točka za utemeljitev z zveznostjo na zaprtem intervalu in 1 točka za $m \le f(1) = -2$.

### Naloga 2 (višja raven): strukturirana naloga, 10 točk, pola 2 (z računalom)

Dani sta krivulji $y = 2^x$ in $y = 3 - x^2$.

a) Pokaži, da je $x = 1$ abscisa enega od presečišč krivulj, in zapiši funkcijo $h$, katere ničle so abscise vseh presečišč. (2 točki)
b) Utemelji, da imata krivulji presečišče z absciso na intervalu $[-2, -1]$. (2 točki)
c) Naredi tri korake bisekcije na intervalu $[-2, -1]$. Vrednosti funkcije zaokroži na tri decimalke. (3 točke)
d) Z računalom (na primer s tabelo vrednosti) določi absciso tega presečišča, zaokroženo na dve decimalki. Zaokrožitev utemelji z vrednostmi funkcije $h$. (2 točki)
e) Koliko korakov bisekcije, začenši na $[-2, -1]$, najmanj potrebujemo, da bo interval krajši od $0{,}005$? (1 točka)

**Rešitev:**

1. a) Pri $x = 1$ je $2^1 = 2$ in $3 - 1^2 = 2$, zato je $T(1, 2)$ presečišče. Abscise presečišč so rešitve enačbe $2^x = 3 - x^2$, torej ničle funkcije $h(x) = 2^x + x^2 - 3$.
2. b) $h$ je vsota zveznih funkcij, zato je zvezna. $h(-2) = 0{,}25 + 4 - 3 = 1{,}25 > 0$ in $h(-1) = 0{,}5 + 1 - 3 = -1{,}5 < 0$, zato ima $h$ po izreku o ničli na $(-2, -1)$ vsaj eno ničlo.
3. c) Ker je $h(a) > 0$ in $h(b) < 0$, pri $h(c) < 0$ zamenjamo $b$, pri $h(c) > 0$ pa $a$.

| korak | $[a, b]$ | $c$ | $h(c)$ |
|---|---|---|---|
| 1 | $[-2; -1]$ | $-1{,}5$ | $\approx -0{,}396 < 0$ |
| 2 | $[-2; -1{,}5]$ | $-1{,}75$ | $\approx 0{,}360 > 0$ |
| 3 | $[-1{,}75; -1{,}5]$ | $-1{,}625$ | $\approx -0{,}035 < 0$ |

4. c) Po tretjem koraku ostane interval $[-1{,}75; -1{,}625]$.
5. d) Tabela s korakom $0{,}1$: $h(-1{,}7) \approx 0{,}198 > 0$ in $h(-1{,}6) \approx -0{,}110 < 0$. Tabela s korakom $0{,}01$: $h(-1{,}64) \approx 0{,}0105 > 0$ in $h(-1{,}63) \approx -0{,}0200 < 0$, zato je ničla na $(-1{,}64; -1{,}63)$.
6. d) Meja zaokroževanja: $h(-1{,}635) \approx -0{,}0048 < 0$, zato je ničla na $(-1{,}64; -1{,}635)$ in se zaokroži na $-1{,}64$.
7. e) Po $n$ korakih je dolžina $\frac{1}{2^n}$. Potrebujemo $2^n > 200$: $2^7 = 128$ je premalo, $2^8 = 256$ zadošča, torej $8$ korakov.
8. Odgovor: a) $h(x) = 2^x + x^2 - 3$; b) $h(-2) > 0$ in $h(-1) < 0$, zato je na $(-2, -1)$ ničla; c) po treh korakih bisekcije je abscisa na $[-1{,}75; -1{,}625]$; d) abscisa presečišča na $[-2, -1]$ je $x \approx -1{,}64$; e) za dolžino pod $0{,}005$ je potrebnih $8$ korakov.

**Točkovanje:** a) 1 točka za preverjanje presečišča $T(1, 2)$ in 1 točka za $h(x) = 2^x + x^2 - 3$ (ali $3 - x^2 - 2^x$); b) 1 točka za vrednosti $h(-2)$ in $h(-1)$ z različnima predznakoma in 1 točka za utemeljitev z zveznostjo in izrekom o ničli; c) 1 točka za vsakega od treh pravilno izvedenih korakov (sredina, predznak, nov interval); d) 1 točka za interval $(-1{,}64; -1{,}63)$ z vrednostma $h$ različnih predznakov in 1 točka za preverjanje meje $-1{,}635$ (ali drugo pravilno utemeljitev zaokrožitve) in rezultat $x \approx -1{,}64$; e) 1 točka za $8$ korakov.

### Ustno vprašanje 1

:::premisli
(višja raven) Povej izrek o ničli zvezne funkcije in pojasni, zakaj sta oba pogoja izreka nujna.
---
Če je funkcija $f$ zvezna na zaprtem intervalu $[a, b]$ in velja $f(a) \cdot f(b) < 0$, ima $f$ na odprtem intervalu $(a, b)$ vsaj eno ničlo. Brez zveznosti izrek ne velja, saj lahko funkcija z negativne vrednosti skoči na pozitivno in ničle ne doseže, kot funkcija, ki je na $[-1, 1]$ enaka $-1$ za $x < 0$ in $1$ za $x \ge 0$. Brez pogoja o različnih predznakih sklep prav tako ne velja: $f(x) = x^2 + 1$ je na $[-1, 1]$ zvezna, na krajiščih ima enaka predznaka in nima ničle, funkcija $x^2$ pa ima na istem intervalu pri enakih predznakih ničlo, zato izrek v tem primeru ne pove ničesar. Izrek zagotavlja vsaj eno ničlo, ne natanko ene.
:::

### Ustno vprašanje 2

:::premisli
(višja raven) Kaj velja za vrednosti zvezne funkcije na zaprtem intervalu? Navedi primer, ki pokaže, da je zaprtost intervala potrebna.
---
Zvezna funkcija na zaprtem intervalu $[a, b]$ na njem doseže najmanjšo vrednost $m$ in največjo vrednost $M$. Zavzame tudi vsako vrednost med $m$ in $M$, posebej vsako vrednost med $f(a)$ in $f(b)$. Na odprtem intervalu zvezna funkcija najmanjše ali največje vrednosti ne doseže nujno: funkcija $f(x) = x$ je na $(0, 1)$ zvezna, a največje vrednosti nima, ker vrednosti $1$ ne doseže.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Opiši metodo bisekcije za iskanje ničle in pojasni, kako natančno poznamo ničlo po $n$ korakih.
---
Začnemo z intervalom $[a, b]$, na katerem je $f$ zvezna in ima na krajiščih vrednosti različnih predznakov. Izračunamo sredino $c = \frac{a + b}{2}$ in vrednost $f(c)$, nato obdržimo tisto polovico, na kateri imata krajišči vrednosti različnih predznakov. Vsak korak interval razpolovi, zato je po $n$ korakih njegova dolžina $\frac{b - a}{2^n}$ in ničlo poznamo na to natančnost. Ko se obe krajišči zaokrožita na isto število, je ničla na toliko decimalk določena.
:::

## Drugače: Kot zgodba

Maja igra igro iz televizijske oddaje: uganiti mora ceno kolesa. Ve le, da je cena cel znesek v evrih, višja od $200$ € in največ $264$ €. Maja vpraša: »Je dražje od $232$ €?« »Da.« Cena je zdaj med $233$ € in $264$ €. Naslednje vprašanje zastavi spet na sredini: »Je dražje od $248$ €?« »Ne.« Ostane le še $233$ € do $248$ €.

Vsak odgovor prepolovi seznam možnih cen. Na začetku je $64$ možnosti, po šestih vprašanjih ostane ena, ker je $\frac{64}{2^6} = 1$. Kdor bi ugibal ceno za ceno, bi potreboval do $64$ vprašanj.

Bisekcija je natanko to. Seznam cen je interval, odgovor »da« ali »ne« je predznak $f(c)$, prava cena je ničla. Pri funkcijah igra deluje le, če ničle ni mogoče »preskočiti«, in to zagotavlja zveznost.

## Drugače: Korak za korakom s številkami

Bisekcija za $f(x) = x^3 - 2x - 5$ na $[2, 3]$:

1. Krajišči: $f(2) = -1 < 0$, $f(3) = 16 > 0$. Funkcija je polinom, torej zvezna; ničla je na $[2, 3]$.
2. Sredina $2{,}5$: $f(2{,}5) = 5{,}625 > 0$. Predznak se zamenja med $2$ in $2{,}5$: nov interval $[2; 2{,}5]$.
3. Sredina $2{,}25$: $f(2{,}25) \approx 1{,}89 > 0$. Nov interval $[2; 2{,}25]$.
4. Sredina $2{,}125$: $f(2{,}125) \approx 0{,}35 > 0$. Nov interval $[2; 2{,}125]$, dolg $0{,}125$.
5. Za eno decimalko še ni dovolj: $2$ in $2{,}125$ se zaokrožita na $2{,}0$ in $2{,}1$. Nadaljuj, dokler se krajišči ne ujemata.

## Preveri se

? Funkcija $f$ je zvezna na $[1, 4]$, $f(1) = -2$ in $f(4) = 5$. Katera trditev zagotovo velja?
- $f$ ima na $(1, 4)$ natanko eno ničlo.
~ Izrek zagotovi vsaj eno ničlo; graf lahko os seka trikrat ali večkrat.
+ $f$ na $[1, 4]$ zavzame vrednost $3$.
- Največja vrednost $f$ na $[1, 4]$ je $5$.
~ Največja vrednost je vsaj $5$, lahko pa je večja: graf se lahko vmes dvigne nad $5$.
- $f$ je na $[1, 4]$ naraščajoča.
~ Zveznost ne pove ničesar o naraščanju; graf lahko vmes tudi pada.
> Zvezna funkcija zavzame vsako vrednost med $f(1) = -2$ in $f(4) = 5$, torej tudi $3$.

? Na grafu je funkcija $f$ na $[0, 4]$ z $f(0) = -3$ in $f(4) = 4$. Kaj se zgodi, če na $[0, 4]$ uporabiš bisekcijo?
:::risba graf
opis: Graf funkcije na intervalu od 0 do 4. Od x = 0 do tik pred x = 2 je premica od (0, −3) do (2, −1), pri x = 2 je prazen krožec na višini −1. Pri x = 2 je polna točka na višini 2, od tam premica naraste do (4, 4). Os x graf nikjer ne seka.
x: 0 .. 4 | 1
y: -4 .. 5 | 1
f: x - 3 | modra | 0 .. 2
f: x | modra | 2 .. 4
krog: 2; -1 | 0,08 | modra
točka: 2; 2 | (2, 2) | levo
točka: 0; -3 | (0, −3) | desno
točka: 4; 4 | (4, 4) | levo
:::
- Bisekcija najde ničlo $x = 2$.
~ $f(2) = 2$, ne $0$. Intervali se res krčijo proti $2$, a tam je skok, ne ničla.
- Bisekcija ne more začeti, ker je $f(2) > 0$.
~ Prvi korak je povsem običajen: $f(2) > 0$ pomeni, da obdržiš $[0, 2]$.
+ Intervali se krčijo proti $x = 2$, kjer funkcija skoči; ničle ni.
- Najde ničlo $x = 3$.
~ $f(3) = 3$. Bisekcija po prvem koraku obdrži $[0, 2]$ in točke $3$ sploh ne obravnava.
> Pogoj zveznosti ni izpolnjen. Bisekcija vrne točko, kjer se predznak zamenja, to pa je tu skok pri $x = 2$.

? Razvrsti korake bisekcije po vrsti.
1. Preveri, da je $f$ zvezna na $[a, b]$ in da imata $f(a)$ in $f(b)$ različna predznaka.
2. Izračunaj sredino $c = \frac{a + b}{2}$.
3. Izračunaj $f(c)$ in določi njen predznak.
4. Obdrži polovico, na kateri imata krajišči različna predznaka.
5. Ponavljaj, dokler se krajišči ne zaokrožita na isto število.
> Brez prvega koraka ne veš, ali ničla sploh obstaja. Koraki 2 do 4 se ponavljajo, zadnji pove, kdaj nehaš.

? (brez računala) Bisekcijo začneš na intervalu $[2, 3]$. Najmanj koliko korakov potrebuješ, da bo interval krajši od $0{,}01$?
= 7
~ 6 | Po $6$ korakih je dolžina $\frac{1}{64} \approx 0{,}016$, kar je še več od $0{,}01$.
~ 100 | Tako bi bilo, če bi interval vsakič skrajšal za stotinko. Bisekcija ga razpolovi.
> Dolžina po $n$ korakih je $\frac{1}{2^n}$. Potrebuješ $2^n > 100$: $2^6 = 64$ je premalo, $2^7 = 128$ zadošča.

? Za $f(x) = x^3 + 2x - 5$ na $[1, 2]$ naredi bisekcijo. Kolikšna je tretja sredina $c_3$?
= 1,375 | 0,0001
~ 1,875 | Obdržal si polovico $[c, b]$, kjer sta obe vrednosti pozitivni, namesto tiste, kjer se predznak zamenja.
~ 1,25 | To je druga sredina. Naredi še en korak.
~ 1,3125 | To je že sredina po tretjem koraku, četrta po vrsti.
> $f(1) = -2$, $f(2) = 7$; $f(1{,}5) = 1{,}375 > 0$ → $[1; 1{,}5]$; $f(1{,}25) \approx -0{,}547 < 0$ → $[1{,}25; 1{,}5]$; tretja sredina je $c_3 = 1{,}375$.

<<RACUN
vrednost: 2^3-3*2+1 | 3
vrednost: 1.5^3+1.5-3 | 1.875
vrednost: 1.25^3+1.25-3 | 0.203
vrednost: 1.125^3+1.125-3 | -0.451
vrednost: 1.1875^3+1.1875-3 | -0.138
vrednost: 1.21875^3+1.21875-3 | 0.029
vrednost: 100*1.1^3-37*1.1^2-37*1.1-37 | 10.63
vrednost: 100*1.05^3-37*1.05^2-37*1.05-37 | -0.88
vrednost: 100*1.075^3-37*1.075^2-37*1.075-37 | 4.70
vrednost: 100*1.0535^3-37*1.0535^2-37*1.0535-37 | -0.12
vrednost: 100*1.0545^3-37*1.0545^2-37*1.0545-37 | 0.098
vrednost: ((1000*1.054-370)*1.054-370) | 350.94
vrednost: 1.875^3-3*1.875-1 | -0.033
vrednost: 1.88^3-3*1.88-1 | 0.005
vrednost: 2.25^3-2*2.25-5 | 1.89
vrednost: 1/2^7 | 0.0078125
vrednost: 1.5^3+2*1.5-5 | 1.375
vrednost: 1.25^3+2*1.25-5 | -0.547
vrednost: 1.375^3+2*1.375-5 | 0.350
vrednost: (-3)^3-4*(-3)+1 | -14
vrednost: 1^3-4*1+1 | -2
vrednost: 0.5^3-4*0.5+1 | -0.875
vrednost: 0.25^3-4*0.25+1 | 0.015625
vrednost: 2^(-2)+(-2)^2-3 | 1.25
vrednost: 2^(-1)+(-1)^2-3 | -1.5
vrednost: 2^(-1.5)+1.5^2-3 | -0.396
vrednost: 2^(-1.75)+1.75^2-3 | 0.360
vrednost: 2^(-1.625)+1.625^2-3 | -0.035
vrednost: 2^(-1.7)+1.7^2-3 | 0.198
vrednost: 2^(-1.6)+1.6^2-3 | -0.110
vrednost: 2^(-1.64)+1.64^2-3 | 0.0105
vrednost: 2^(-1.63)+1.63^2-3 | -0.0200
vrednost: 2^(-1.635)+1.635^2-3 | -0.0048
vrednost: 1/2^8 | 0.00390625
>>

:::simboli
f | funkcija | | | zvezna na $[a, b]$
a, b | krajišči intervala | | |
c | sredina intervala oz. ničla | c = \frac{a + b}{2} | |
d_n | dolžina intervala po $n$ korakih | d_n = \frac{b - a}{2^n} | |
n | število korakov bisekcije | | |
r | obrestovalni faktor | r = 1 + \frac{p}{100} | – |
p | letna obrestna mera | | \% | v odstotkih
g | pomožna funkcija, katere ničlo iščemo | g(x) = x^3 - 3x - 1 | |
h | razlika funkcij, katere ničle so abscise presečišč krivulj | | |
x | neodvisna spremenljivka | | |
y | ordinata točke na krivulji | | |
:::
