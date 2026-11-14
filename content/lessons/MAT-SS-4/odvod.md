---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Sošolec Matic segreva olje v ponvi in na vsako minuto pogleda termometer. Temperatura v prvih desetih minutah se dobro ujema z modelom

$$T(t) = 20 + 20t - t^2$$

kjer je $t$ čas v minutah in $T$ temperatura v $^\circ\mathrm{C}$. Po $10$ minutah ima olje $120\,^\circ\mathrm{C}$.

Matic trdi: »Hitrost segrevanja v enem trenutku ne obstaja. V trenutku ne mine nič časa in temperatura se ne spremeni, zato je hitrost $\frac{0}{0}$, to pa je nesmisel. Smiselna je le povprečna hitrost: $\frac{120 - 20}{10} = 10$ stopinj na minuto. S to hitrostjo se je olje segrevalo ves čas.«

Ali ima prav? Za kuharja ni vseeno: če se olje v nekem trenutku segreva hitro, bo česen v ponvi v hipu zažgan. Ta lekcija bo Maticovo trditev razsodila. Orodje, ki ga potrebujemo, je **odvod**: hitrost spremembe v trenutku. Na njem stoji vse, kar sledi: ekstremi, risanje grafov in integral.

## Razlaga

**1. Vedno krajši časovni razmiki.** Opazujmo trenutek $t = 4$, ko ima olje $T(4) = 84\,^\circ\mathrm{C}$. Povprečna hitrost segrevanja od $4$ do $4 + h$ minut je sprememba temperature, deljena s časom:

$$\frac{T(4 + h) - T(4)}{h}$$

Temu ulomku rečemo **diferenčni količnik**. Izračunajmo ga za vedno krajše razmike $h$:

| $h$ [min] | $T(4 + h)$ [$^\circ$C] | povprečna hitrost [$^\circ$C/min] |
|---|---|---|
| $1$ | $95$ | $11$ |
| $0{,}1$ | $85{,}19$ | $11{,}9$ |
| $0{,}01$ | $84{,}1199$ | $11{,}99$ |

Povprečne hitrosti se bližajo $12$. Algebra to potrdi: $T(4 + h) - T(4) = 12h - h^2$, zato je diferenčni količnik $12 - h$, ta pa ima pri $h \to 0$ limito $12$.

Maticov »$\frac{0}{0}$« je torej nedoločeni izraz iz prejšnje lekcije, ne nesmisel. Limita obstaja: v trenutku $t = 4$ se olje segreva s hitrostjo $12\,^\circ\mathrm{C/min}$, kar je več od povprečja $10$.

**2. Odvod.** Kar smo naredili z oljem, naredimo s poljubno funkcijo $f$ v točki $a$:

$$f'(a) = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h}$$

Število $f'(a)$ je **odvod** funkcije $f$ v točki $a$. Če limita obstaja, je $f$ v točki $a$ **odvedljiva**.

Na grafu je diferenčni količnik smerni koeficient **sekante**, premice skozi točki $(a, f(a))$ in $(a + h, f(a + h))$. Ko gre $h \to 0$, se druga točka po grafu pomika k prvi in sekanta se zavrti v **tangento**. Odvod $f'(a)$ je smerni koeficient tangente v točki $(a, f(a))$.

V simulaciji spodaj (»Od sekante do tangente«) izberi $x^2$, postavi točko na $x = 1$ in zmanjšuj $h$ proti $0$. Opazuj, kateri vrednosti se bliža naklon sekante.

**3. Iščemo vzorec.** Za $f(x) = x^2$ je $(a + h)^2 - a^2 = 2ah + h^2$. Diferenčni količnik je $2a + h$, njegova limita pa $2a$. Za $f(x) = x^3$ podobno: $(a + h)^3 - a^3 = 3a^2 h + 3a h^2 + h^3$, po deljenju s $h$ je diferenčni količnik $3a^2 + 3ah + h^2$, njegova limita pa $3a^2$.

| $a$ | $f'(a)$ za $x^2$ | $f'(a)$ za $x^3$ |
|---|---|---|
| $1$ | $2$ | $3$ |
| $2$ | $4$ | $12$ |
| $3$ | $6$ | $27$ |

Vidiš vzorec? Eksponent »skoči« pred potenco, nova potenca pa je za ena manjša: $(x^2)' = 2x$, $(x^3)' = 3x^2$.

:::premisli
Po tem vzorcu napovej odvod funkcije $f(x) = x^4$ v točki $a = 2$.
---
Po vzorcu je $(x^4)' = 4x^3$, zato je $f'(2) = 4 \cdot 2^3 = 32$. Z diferenčnim količnikom dobiš isto: $(2 + h)^4 - 16 = 32h + 24h^2 + 8h^3 + h^4$.
:::

Vzorec velja v splošnem in mu rečemo **pravilo za potenco**:

$$(x^n)' = n\,x^{n-1}$$

Velja tudi za negativne in racionalne eksponente, na primer $\left(\frac{1}{x}\right)' = (x^{-1})' = -\frac{1}{x^2}$. Posebna primera: $x' = 1$ in odvod konstante je $0$, saj je graf konstante vodoravna premica.

**4. Odvod kot funkcija.** Za vsak $x$ lahko izračunamo $f'(x)$. Tako dobimo novo funkcijo $f'$, **odvod funkcije** $f$. Postopku rečemo **odvajanje**.

**5. Konstanta in vsota.** Iz pravil za limite sledi:

$$(c \cdot f)' = c \cdot f' \qquad (f + g)' = f' + g'$$

Konstantni faktor ostane, vsoto odvajamo člen za členom. Olje: $T'(t) = 0 + 20 - 2t = 20 - 2t$. Pri $t = 4$ dobimo $20 - 8 = 12$, kar se ujema s tabelo.

Zdaj lahko Maticu odgovorimo. Na začetku se olje segreva s hitrostjo $T'(0) = 20\,^\circ\mathrm{C/min}$, ob $t = 10$ pa je $T'(10) = 0$ in segrevanje se ustavi. Hitrost v trenutku obstaja in se ves čas spreminja; $10\,^\circ\mathrm{C/min}$ je le povprečje.

**6. Produkt, kvocient, sestavljena funkcija.** Pri produktu je skušnjava velika: zmnoži odvoda. Preizkusi to sam.

:::premisli
Velja $x^2 = x \cdot x$. Koliko je $x' \cdot x'$? Ali je to enako $(x^2)'$? Kaj iz tega sklepaš?
---
$x' \cdot x' = 1 \cdot 1 = 1$, pravi odvod pa je $(x^2)' = 2x$. Odvod produkta torej ni produkt odvodov. Pravilo spodaj da $1 \cdot x + x \cdot 1 = 2x$, kar je prav.
:::

Prava pravila so:

$$(f \cdot g)' = f' \cdot g + f \cdot g'$$

$$\left(\frac{f}{g}\right)' = \frac{f' \cdot g - f \cdot g'}{g^2}$$

Pri **sestavljeni funkciji** $f(g(x))$ ločimo zunanjo funkcijo $f$ in notranjo $g$. Odvajamo zunanjo (notranjo pustimo pri miru) in pomnožimo z odvodom notranje:

$$\bigl(f(g(x))\bigr)' = f'(g(x)) \cdot g'(x)$$

**7. Odvodi elementarnih funkcij.** Izpeljemo jih z definicijo in limitami; pri $\sin x$ potrebujemo $\lim\limits_{h \to 0} \frac{\sin h}{h} = 1$ iz prejšnje lekcije.

| funkcija | odvod |
|---|---|
| $x^n$ | $n\,x^{n-1}$ |
| $\sin x$ | $\cos x$ |
| $\cos x$ | $-\sin x$ |
| $e^x$ | $e^x$ |
| $\ln x$ | $\frac{1}{x}$ |

## Rešeni primeri

### Primer 1: odvod po definiciji

Izračunaj odvod funkcije $f(x) = x^2 + 3x$ v točki $a = 1$ po definiciji. Rezultat preveri s pravili.

**Podatki:** $f(x) = x^2 + 3x$, $a = 1$
**Iščemo:** $f'(1)$

:::formula
$f'(a) = \lim\limits_{h \to 0} \dfrac{f(a + h) - f(a)}{h}$
:::

**Rešitev:**

1. $f(1) = 1 + 3 = 4$.
2. $f(1 + h) = (1 + h)^2 + 3(1 + h) = 4 + 5h + h^2$, ko kvadriramo dvočlenik in seštejemo.
3. Diferenčni količnik: $\dfrac{4 + 5h + h^2 - 4}{h} = \dfrac{5h + h^2}{h} = 5 + h$ (krajšamo $h$, ker je $h \ne 0$).
4. Limita pri $h \to 0$: $5$.
5. Preizkus s pravili: $f'(x) = 2x + 3$, pri $x = 1$ je to $2 + 3 = 5$.
6. Odgovor: $f'(1) = 5$; tangenta na graf v točki $(1, 4)$ ima smerni koeficient $5$.

### Primer 2: pravilo za kvocient

Odvajaj $f(x) = \dfrac{2x + 1}{x - 3}$ in izračunaj $f'(4)$.

**Podatki:** $f(x) = \dfrac{2x + 1}{x - 3}$, točka $x = 4$
**Iščemo:** $f'(x)$ in $f'(4)$

:::formula
$\left(\dfrac{u}{v}\right)' = \dfrac{u' \cdot v - u \cdot v'}{v^2}$ z $u = 2x + 1$ in $v = x - 3$
:::

**Rešitev:**

1. Odvoda delov: $u' = 2$, $v' = 1$.
2. Števec: $2(x - 3) - (2x + 1) \cdot 1 = 2x - 6 - 2x - 1 = -7$.
3. Torej $f'(x) = \dfrac{-7}{(x - 3)^2}$.
4. Pri $x = 4$: $f'(4) = \dfrac{-7}{1^2} = -7$.
5. Odgovor: $f'(x) = -\dfrac{7}{(x - 3)^2}$ in $f'(4) = -7$. Ker je odvod povsod negativen, funkcija na vsakem delu definicijskega območja pada.

### Primer 3: pekač se ohlaja

Pekač vzameš iz pečice. Njegova temperatura v prvih $10$ minutah je $T(t) = 180 - 30t + 1{,}5t^2$ ($t$ v minutah, $T$ v $^\circ\mathrm{C}$). Kako hitro se pekač ohlaja takoj, ko ga vzameš ven? V katerem trenutku se ohlaja s hitrostjo $12\,^\circ\mathrm{C}$ na minuto in kolikšna je takrat njegova temperatura?

**Podatki:** $T(t) = 180 - 30t + 1{,}5t^2$, $0 \le t \le 10\,\mathrm{min}$, hitrost ohlajanja $12\,^\circ\mathrm{C/min}$
**Iščemo:** $T'(0)$, trenutek $t$, ko je $T'(t) = -12\,^\circ\mathrm{C/min}$, in $T(t)$ v tem trenutku

:::formula
$T'(t)$ s pravilom za potenco in vsoto; ohlajanje pomeni $T'(t) < 0$.
:::

**Rešitev:**

1. Odvajamo člen za členom: $T'(t) = -30 + 3t$.
2. Na začetku: $T'(0) = -30$. Predznak minus pomeni, da temperatura pada.
3. Ohlajanje s hitrostjo $12\,^\circ\mathrm{C/min}$ pomeni $T'(t) = -12$: $-30 + 3t = -12$, torej $3t = 18$ in $t = 6$.
4. Temperatura takrat: $T(6) = 180 - 180 + 54 = 54$.
5. Odgovor: takoj po tem, ko ga vzameš iz pečice, se pekač ohlaja s hitrostjo $30\,^\circ\mathrm{C/min}$. Po $6$ minutah se ohlaja s hitrostjo $12\,^\circ\mathrm{C/min}$ in ima $54\,^\circ\mathrm{C}$.

### Primer 4: zadnji korak je tvoj

Izračunaj $f'(1)$ za $f(x) = (x^2 + 1)^3$.

**Podatki:** $f(x) = (x^2 + 1)^3$, točka $x = 1$
**Iščemo:** $f'(1)$

:::formula
$\bigl(f(g(x))\bigr)' = f'(g(x)) \cdot g'(x)$: zunanja funkcija je tretja potenca, notranja $x^2 + 1$.
:::

**Rešitev:**

1. Odvod zunanje funkcije (notranjo pustimo): $3(x^2 + 1)^2$.
2. Odvod notranje funkcije: $(x^2 + 1)' = 2x$.
3. Oba dela zmnoži, šele nato vstavi $x = 1$. Napovej rezultat in ga primerjaj:

:::premisli
Koliko je $f'(1)$?
---
$f'(x) = 3(x^2 + 1)^2 \cdot 2x = 6x(x^2 + 1)^2$. Pri $x = 1$: $6 \cdot 1 \cdot 2^2 = 24$.
:::

## Pogoste napake

- **Odvod produkta kot produkt odvodov.** Kdor piše $(x^2 \sin x)' = 2x \cos x$, je odvajal vsak faktor posebej. Že pri $x \cdot x$ to odpove ($1 \ne 2x$). Prav je $2x \sin x + x^2 \cos x$.
- **Zamenjan vrstni red pri kvocientu.** V števcu je $u' v - u v'$; obrnjen vrstni red da nasproten predznak. Tudi kvadrat $v^2$ v imenovalcu rad izgine. Pomaga besedilo pravila: »odvod zgoraj krat spodaj minus zgoraj krat odvod spodaj, deljeno s spodaj na kvadrat«.
- **Pozabljen notranji odvod.** $\bigl((x^2 + 1)^3\bigr)' = 3(x^2 + 1)^2$ je nepopolno: manjka faktor $2x$. Pri sestavljeni funkciji se vedno vprašaj, kaj je »znotraj«.
- **Najprej vstaviš, nato odvajaš.** Pri $f(x) = x^2$ je $f(2) = 4$ in $(4)' = 0$, a $f'(2) = 4$. Najprej odvajaj funkcijo, šele nato vstavi točko. Iz istega razloga je $(x^2 + 7)' = 2x$, ne $2x + 7$: konstanta ima odvod $0$.
- **Povprečna hitrost namesto odvoda.** $\frac{120 - 20}{10}$ je povprečje čez $10$ minut, ne hitrost v trenutku. Hitrost v trenutku je $T'(t)$.

## Povzetek

- Odvod v točki: $f'(a) = \lim\limits_{h \to 0} \dfrac{f(a + h) - f(a)}{h}$, limita diferenčnih količnikov.
- Pomen: hitrost spremembe v trenutku; smerni koeficient tangente na graf.
- $(x^n)' = n x^{n-1}$, odvod konstante je $0$; $(\sin x)' = \cos x$, $(\cos x)' = -\sin x$, $(e^x)' = e^x$, $(\ln x)' = \frac{1}{x}$.
- $(c f)' = c f'$, $(f + g)' = f' + g'$.
- $(f g)' = f' g + f g'$, $\left(\frac{f}{g}\right)' = \dfrac{f' g - f g'}{g^2}$, $\bigl(f(g(x))\bigr)' = f'(g(x)) \cdot g'(x)$.
- Najprej odvajaj, nato vstavi točko. $f' > 0$: funkcija narašča, $f' < 0$: pada.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Odvajaj funkcijo $f(x) = x^2 e^{2x}$ in določi vse $x$, za katere je $f'(x) = 0$.

**Rešitev:**

1. Po pravilu za produkt: $f'(x) = (x^2)' \cdot e^{2x} + x^2 \cdot (e^{2x})'$.
2. Po pravilu za sestavljeno funkcijo je $(e^{2x})' = e^{2x} \cdot 2$, zato $f'(x) = 2x\,e^{2x} + 2x^2 e^{2x} = 2x(x + 1)\,e^{2x}$.
3. Ker je $e^{2x} > 0$ za vsak $x$, je $f'(x) = 0$ natanko tedaj, ko je $2x(x + 1) = 0$.
4. Odgovor: $f'(x) = 2x(x + 1)\,e^{2x}$; odvod je enak $0$ pri $x = 0$ in pri $x = -1$.

**Točkovanje:** 1 točka za uporabo pravila za produkt, 1 točka za pravilni odvod $(e^{2x})' = 2e^{2x}$, 1 točka za obe rešitvi $x = 0$ in $x = -1$.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dana je funkcija $f(x) = \dfrac{4}{x}$.

a) Izračunaj diferenčni količnik funkcije $f$ na intervalu $[1, 4]$ in pojasni, kaj to število pomeni na grafu funkcije. (2 točki)
b) Po definiciji odvoda izračunaj $f'(2)$. (3 točke)
c) Zapiši enačbo tangente na graf funkcije $f$ v točki z absciso $2$. V kakšni legi sta ta tangenta in sekanta skozi točki grafa z abscisama $1$ in $4$? Odgovor utemelji. (2 točki)

**Rešitev:**

1. a) $f(1) = 4$ in $f(4) = 1$, zato je diferenčni količnik $\dfrac{f(4) - f(1)}{4 - 1} = \dfrac{1 - 4}{3} = -1$.
2. a) To je smerni koeficient sekante skozi točki $(1, 4)$ in $(4, 1)$ grafa, torej povprečna sprememba funkcije na intervalu $[1, 4]$.
3. b) $\dfrac{f(2 + h) - f(2)}{h} = \dfrac{\frac{4}{2 + h} - 2}{h} = \dfrac{4 - 4 - 2h}{h(2 + h)} = \dfrac{-2}{2 + h}$ (krajšamo $h \ne 0$).
4. b) $f'(2) = \lim\limits_{h \to 0} \dfrac{-2}{2 + h} = -1$.
5. c) $f(2) = 2$, zato je tangenta $y = 2 - 1 \cdot (x - 2) = -x + 4$.
6. c) Sekanta iz a) je $y = 4 - (x - 1) = -x + 5$. Premici imata enak smerni koeficient $-1$, zato sta vzporedni.
7. Odgovor: diferenčni količnik je $-1$ (smerni koeficient sekante), $f'(2) = -1$, tangenta $y = -x + 4$ je vzporedna s sekanto $y = -x + 5$.

**Točkovanje:** a) 1 točka za vrednost $-1$, 1 točka za pomen (smerni koeficient sekante skozi točki $(1, 4)$ in $(4, 1)$); b) 1 točka za zapis diferenčnega količnika, 1 točka za poenostavitev na $\frac{-2}{2 + h}$, 1 točka za limito $-1$; c) 1 točka za enačbo tangente, 1 točka za ugotovitev, da sta premici vzporedni (enaka smerna koeficienta).

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

a) Z definicijo odvoda pokaži, da za $x > 0$ velja $(\sqrt{x})' = \dfrac{1}{2\sqrt{x}}$. (3 točke)
b) Iz odvodov funkcij $\sin x$ in $\cos x$ izpelji odvod funkcije $\tan x$. (3 točke)
c) Izračunaj $f'(4)$ za funkcijo $f(x) = \sqrt{x^2 + 9}$. (2 točki)
d) Poišči vse točke na grafu funkcije $g(x) = \tan x$, $-\frac{\pi}{2} < x < \frac{\pi}{2}$, v katerih ima tangenta smerni koeficient $4$. (2 točki)

**Rešitev:**

1. a) Diferenčni količnik je $\dfrac{\sqrt{x + h} - \sqrt{x}}{h}$. Razširimo ga z $\sqrt{x + h} + \sqrt{x}$: $\dfrac{(x + h) - x}{h\,(\sqrt{x + h} + \sqrt{x})} = \dfrac{1}{\sqrt{x + h} + \sqrt{x}}$.
2. a) Ko gre $h \to 0$, gre $\sqrt{x + h} \to \sqrt{x}$, zato je limita enaka $\dfrac{1}{2\sqrt{x}}$. Torej $(\sqrt{x})' = \dfrac{1}{2\sqrt{x}}$.
3. b) $\tan x = \dfrac{\sin x}{\cos x}$. Po pravilu za kvocient: $(\tan x)' = \dfrac{\cos x \cdot \cos x - \sin x \cdot (-\sin x)}{\cos^2 x} = \dfrac{\cos^2 x + \sin^2 x}{\cos^2 x}$.
4. b) Ker je $\sin^2 x + \cos^2 x = 1$, je $(\tan x)' = \dfrac{1}{\cos^2 x}$ (za $\cos x \ne 0$).
5. c) Sestavljena funkcija z notranjo funkcijo $x^2 + 9$: $f'(x) = \dfrac{1}{2\sqrt{x^2 + 9}} \cdot 2x = \dfrac{x}{\sqrt{x^2 + 9}}$.
6. c) $f'(4) = \dfrac{4}{\sqrt{16 + 9}} = \dfrac{4}{5}$.
7. d) Pogoj $\dfrac{1}{\cos^2 x} = 4$ da $\cos^2 x = \dfrac{1}{4}$. Na intervalu $\left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$ je $\cos x > 0$, zato $\cos x = \dfrac{1}{2}$ in $x = \pm\dfrac{\pi}{3}$.
8. d) $\tan\dfrac{\pi}{3} = \sqrt{3}$ in $\tan\left(-\dfrac{\pi}{3}\right) = -\sqrt{3}$.
9. Odgovor: $(\sqrt{x})' = \frac{1}{2\sqrt{x}}$, $(\tan x)' = \frac{1}{\cos^2 x}$, $f'(4) = \frac{4}{5}$; iskani točki sta $\left(\frac{\pi}{3}, \sqrt{3}\right)$ in $\left(-\frac{\pi}{3}, -\sqrt{3}\right)$.

**Točkovanje:** a) 1 točka za zapis diferenčnega količnika, 1 točka za razširitev in krajšanje, 1 točka za limito; b) 1 točka za pravilo za kvocient, 1 točka za pravilna odvoda sinusa in kosinusa v števcu, 1 točka za poenostavitev s $\sin^2 x + \cos^2 x = 1$; c) 1 točka za $f'(x)$, 1 točka za $f'(4) = \frac{4}{5}$; d) 1 točka za $x = \pm\frac{\pi}{3}$, 1 točka za obe točki z ordinatama.

### Ustno vprašanje 1

:::premisli
Kako je definiran odvod funkcije $f$ v točki $a$ in kaj pomeni na grafu funkcije?
---
Odvod funkcije $f$ v točki $a$ je limita diferenčnega količnika: $f'(a) = \lim\limits_{h \to 0} \frac{f(a + h) - f(a)}{h}$, če ta limita obstaja. Diferenčni količnik je smerni koeficient sekante skozi točki $(a, f(a))$ in $(a + h, f(a + h))$ grafa. Ko gre $h$ proti $0$, se sekanta zavrti v tangento, zato je $f'(a)$ smerni koeficient tangente na graf v točki $(a, f(a))$. Odvod pove tudi, kako hitro se funkcija spreminja v točki $a$.
:::

### Ustno vprašanje 2

:::premisli
Zapiši pravilo za odvod sestavljene funkcije in ga uporabi na funkciji $\sin(x^2)$.
---
Pri sestavljeni funkciji $f(g(x))$ je $f$ zunanja in $g$ notranja funkcija. Če je $g$ odvedljiva v $x$ in $f$ odvedljiva v $g(x)$, velja $\bigl(f(g(x))\bigr)' = f'(g(x)) \cdot g'(x)$: odvajamo zunanjo funkcijo, notranjo pustimo nespremenjeno, in pomnožimo z odvodom notranje funkcije. Pri $\sin(x^2)$ je zunanja funkcija sinus, notranja pa $x^2$. Zato je $\bigl(\sin(x^2)\bigr)' = \cos(x^2) \cdot 2x$.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Z definicijo odvoda izpelji pravilo za odvod vsote dveh funkcij, ki sta v točki $a$ odvedljivi.
---
Diferenčni količnik vsote je $\frac{(f + g)(a + h) - (f + g)(a)}{h}$. Členi se preuredijo v vsoto $\frac{f(a + h) - f(a)}{h} + \frac{g(a + h) - g(a)}{h}$. Ker sta $f$ in $g$ v $a$ odvedljivi, imata ulomka pri $h \to 0$ limiti $f'(a)$ in $g'(a)$. Limita vsote je vsota limit, zato je $(f + g)'(a) = f'(a) + g'(a)$.
:::

## Drugače: Korak za korakom s številkami

Odvod funkcije $f(x) = x^3$ v točki $a = 2$ lahko »ujameš« s kalkulatorjem.

1. Izračunaj $f(2) = 8$.
2. Izberi $h = 0{,}1$: $f(2{,}1) = 9{,}261$, diferenčni količnik je $\dfrac{9{,}261 - 8}{0{,}1} = 12{,}61$.
3. Izberi $h = 0{,}01$: $f(2{,}01) = 8{,}120601$, količnik je $12{,}0601$.
4. Izberi $h = 0{,}001$: količnik je $12{,}006001$.
5. Opazuj števke: pred decimalno vejico ostane $12$, za njo pa je vse več ničel.
6. Sklep: $f'(2) = 12$. Pravilo da isto: $3 \cdot 2^2 = 12$.

Tako lahko preveriš vsak odvod, ki ga izračunaš s pravili: če se količnik pri majhnem $h$ ne bliža tvojemu rezultatu, si se nekje zmotil.

## Drugače: Kot zgodba

Kuharica Mojca uči vajenca cvreti krofe. »Kako hitro se segreva olje?« ga vpraša. Vajenec pogleda termometer zdaj in čez deset minut: »Deset stopinj na minuto.«

»To je povprečje,« reče Mojca. »Krofe moram dati v olje točno takrat, ko se segrevanje umiri. Kako hitro se segreva *zdaj*?«

Vajenec meri na minuto, nato na deset sekund, nato na sekundo. Številke se vsakič malo spremenijo, a vedno manj. »Krajši ko je razmik, bolj se ustalijo,« opazi.

»Prav,« se nasmehne Mojca. »Številu, h kateremu se ustalijo, rečemo hitrost v trenutku. Matematiki ji pravijo odvod. Razmika ne smeš skrčiti na nič, ker bi delil z nič. Lahko pa ga krčiš v nedogled in pogledaš, kam to pelje. To je limita.«

Vajenec čez nekaj minut pokaže termometer: »Zdaj se skoraj ne segreva več.« Odvod temperature je blizu nič in krofi gredo v olje.

## Preveri se

? Katera trditev o odvodu $f'(a)$ je pravilna?
- $f'(a)$ je vrednost funkcije v točki $a$.
~ To je $f(a)$. Odvod pove, kako hitro se vrednost spreminja, ne kolikšna je.
+ $f'(a)$ je smerni koeficient tangente na graf v točki $(a, f(a))$.
- $f'(a)$ je diferenčni količnik $\dfrac{f(a + 1) - f(a)}{1}$.
~ To je povprečna hitrost na razmiku $h = 1$. Odvod je limita takih količnikov, ko gre $h \to 0$.
> Odvod je limita smernih koeficientov sekant, ko gre $h \to 0$, torej smerni koeficient tangente.

? Koliko je $f'(1)$ za $f(x) = 4x^3 - 2x + 7$?
- $9$
~ To je $f(1) = 4 - 2 + 7$. Vrednost funkcije ni odvod.
- $17$
~ Konstanta $7$ je ostala. Njen odvod je $0$.
- $0$
~ Tako dobiš, če najprej vstaviš $x = 1$ in nato odvajaš število. Najprej odvajaj, nato vstavi.
+ $10$
> $f'(x) = 12x^2 - 2$, zato je $f'(1) = 12 - 2 = 10$.

? Ana je zapisala: $(x^2 \sin x)' = 2x \cos x$. Kje je napaka?
- Odvod $\sin x$ je $-\cos x$, ne $\cos x$.
~ Minus se pojavi pri odvodu kosinusa: $(\cos x)' = -\sin x$. Odvod sinusa je $\cos x$.
+ Odvoda faktorjev je zmnožila; po pravilu za produkt je prav $2x \sin x + x^2 \cos x$.
- Napake ni, odvoda $x^2$ in $\sin x$ sta pravilna.
~ Odvoda sta res pravilna, a odvod produkta ni produkt odvodov (preveri na $x \cdot x$).
> $(f g)' = f' g + f g'$ z $f = x^2$ in $g = \sin x$ da $2x \sin x + x^2 \cos x$.

? Primerjaj $f(x) = x^2$ in $g(x) = x^3$ pri $x = 0{,}5$. Katera funkcija tam hitreje narašča?
- $g$, ker kubična funkcija vedno narašča hitreje.
~ To velja šele za večje $x$. Pri majhnih $x$ je $x^3$ bolj položna.
- $g$, ker je $g'(0{,}5) = 3 \cdot 0{,}5 = 1{,}5$.
~ Pri pravilu za potenco se potenca zmanjša za ena, ne izgine: $g'(x) = 3x^2$.
+ $f$, ker je $f'(0{,}5) = 1$ in $g'(0{,}5) = 0{,}75$.
> $f'(x) = 2x$ da $1$, $g'(x) = 3x^2$ da $3 \cdot 0{,}25 = 0{,}75$. Večji odvod pomeni hitrejše naraščanje.

? Mleko v loncu se segreva po modelu $T(t) = 10 + 12t - 0{,}5t^2$ ($t$ v minutah, $T$ v $^\circ\mathrm{C}$). Kako hitro se segreva pri $t = 4$?
- $50\,^\circ\mathrm{C/min}$
~ To je temperatura $T(4) = 50\,^\circ\mathrm{C}$, ne hitrost.
- $10\,^\circ\mathrm{C/min}$
~ To je povprečna hitrost od $0$ do $4$ minut: $\frac{50 - 10}{4}$. V trenutku je drugačna.
+ $8\,^\circ\mathrm{C/min}$
> $T'(t) = 12 - t$, zato je $T'(4) = 8\,^\circ\mathrm{C/min}$.

:::simboli
T | temperatura |  | °C | v razlagi olje: $T(t) = 20 + 20t - t^2$; v Primeru 3 pekač, v kvizu mleko
t | čas |  | min |
f | funkcija |  |  |
a | točka, v kateri odvajamo |  |  |
h | dolžina razmika (prirastek) |  |  | gre proti $0$
f' | odvod funkcije $f$ | f'(a) = \lim_{h \to 0} \dfrac{f(a+h) - f(a)}{h} |  |
x | neodvisna spremenljivka |  |  |
n | eksponent potence |  |  |
c | konstanta |  |  |
g | druga (pri sestavljeni notranja) funkcija |  |  |
u | števec ulomka |  |  |
v | imenovalec ulomka |  |  |
:::

<<RACUN
odvod: x^2*exp(2*x) | x | 2*x*(x+1)*exp(2*x)
resi: 2*x*(x+1)=0 | x | -1, 0
vrednost: (4/4-4/1)/(4-1) | -1
enako: (4/(2+h)-2)/h | -2/(2+h)
limita: (4/(2+h)-2)/h | h | 0 | -1
odvod: 4/x | x | -4/x^2
enako: 2-(x-2) | -x+4
enako: 4-(x-1) | -x+5
limita: (sqrt(4+h)-sqrt(4))/h | h | 0 | 1/4
enako: ((4+h)-4)/(h*(sqrt(4+h)+2)) | 1/(sqrt(4+h)+2)
odvod: tan(x) | x | 1/cos(x)^2
odvod: sqrt(x^2+9) | x | x/sqrt(x^2+9)
vrednost: 4/sqrt(4^2+9) | 4/5
vrednost: 1/cos(pi/3)^2 | 4
vrednost: tan(pi/3) | sqrt(3)
>>
