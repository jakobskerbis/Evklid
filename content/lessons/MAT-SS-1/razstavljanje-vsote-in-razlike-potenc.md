---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

V 17. stoletju je v Parizu živel menih Marin Mersenne. Pisal je o glasbi in zvoku: raziskoval je, kako je višina tona strune odvisna od njene dolžine, napetosti in debeline. Hkrati so ga zanimala števila oblike $2^n - 1$, na primer $3$, $7$, $31$, $127$, $1023$. Za katere $n$ je tako število praštevilo?

Pri takem vprašanju ne pomaga deliti na slepo. Pomaga pa opazka, da se $2^n - 1$ včasih razstavi kot izraz, ne le kot število. Če je $n = 10$, je $2^{10} - 1 = 1023$, in že brez deljenja lahko pokažemo, da ga delita $3$ in $31$.

Razliko kvadratov $a^2 - b^2$ že znaš razstaviti. Zdaj gremo korak višje: vsoto in razliko kubov, na višji ravni pa še $a^n \pm b^n$ za poljuben $n$. Uporabiš jih pri razstavljanju, krajšanju ulomkov, računanju na pamet in dokazovanju deljivosti.

## Razlaga

**1. Kocka brez kocke.** Predstavljaj si leseno kocko z robom $a$, iz katere v enem kotu izrežemo manjšo kocko z robom $b$. Ostane telo s prostornino $a^3 - b^3$. To telo razrežemo na tri plošče, ki so vse debele $a - b$:

| plošča | ploskev | prostornina |
|---|---|---|
| zgornja | $a \times a$ | $a^2(a - b)$ |
| sprednja | $a \times b$ | $ab(a - b)$ |
| stranska | $b \times b$ | $b^2(a - b)$ |

Če plošče položimo drugo ob drugo, vidimo samo še tri ploskve enake debeline:

:::risba skica
opis: Tri ploskve, ki jih dobimo, ko kocko z robom a brez kocke z robom b razrežemo na plošče. Levo kvadrat a krat a, na sredini pravokotnik a krat b, desno kvadrat b krat b. Vse tri plošče so debele a minus b.
območje: -1; -1 .. 14; 5
enota: 20
pravokotnik: 0; 0 .. 4; 4 | modra
pravokotnik: 5; 0 .. 9; 3 | oranžna
pravokotnik: 10; 0 .. 13; 3 | zelena
napis: 2; 2 | a^2 | sredina | debelo
napis: 7; 1,5 | ab | sredina | debelo
napis: 11,5; 1,5 | b^2 | sredina | debelo
napis: 2; -0,2 | a | pod
napis: 7; -0,2 | a | pod
napis: 11,5; -0,2 | b | pod
napis: -0,2; 2 | a | levo
napis: 4,5; 1,5 | b | sredina
napis: 9,5; 1,5 | b | sredina
podnapis: Vse tri plošče so debele a − b.
:::

Skupna debelina je skupni faktor. Ko ga izpostavimo, dobimo **razliko kubov**:

$$a^3 - b^3 = (a - b)(a^2 + ab + b^2)$$

Preizkus s številkami: pri $a = 4$ in $b = 3$ je $64 - 27 = 37$ in $(4 - 3)(16 + 12 + 9) = 37$.

:::premisli
Napovej, ne da bi množil: na katera dva faktorja razpade $999 = 10^3 - 1^3$?
---
$a = 10$, $b = 1$: $(10 - 1)(100 + 10 + 1) = 9 \cdot 111 = 999$.
:::

**2. Vsota kubov.** Za vsoto kubov ne potrebujemo nove slike, dovolj so znaki. Ker je $(-b)^3 = -b^3$, je $a^3 + b^3 = a^3 - (-b)^3$. V razliko kubov vstavimo $-b$ namesto $b$:

$$a^3 + b^3 = (a + b)(a^2 - ab + b^2)$$

Prvi oklepaj postane $a + b$, v drugem pa se spremeni le srednji člen: $a \cdot (-b) = -ab$. Za znake si zapomni: v prvem oklepaju **isti** znak kot v nalogi, srednji člen **nasprotni**, zadnji člen **vedno plus**.

Drugega oklepaja $a^2 \pm ab + b^2$ z realnimi števili ne razstavimo naprej. To ni kvadrat dvočlenika: srednji člen je $ab$, pri kvadratu pa bi bil $2ab$.

**3. Kje se zmotimo.** Razlika kubov ni isto kot kub razlike: $a^3 - b^3 \neq (a - b)^3$, saj ima $(a - b)^3$ štiri člene. Pri $a = 2$, $b = 1$ dobiš $8 - 1 = 7$, a $(2 - 1)^3 = 1$. Prav tako drugi oklepaj ni $(a - b)^2$ ali $(a + b)^2$.

**4. Vzorec za vse potence (višja raven).** Razstavimo še $a^4 - b^4$, $a^5 - b^5$ in opazujmo drugi faktor:

| $n$ | $a^n - b^n = (a - b) \cdot (\ldots)$ |
|---|---|
| $2$ | $a + b$ |
| $3$ | $a^2 + ab + b^2$ |
| $4$ | $a^3 + a^2b + ab^2 + b^3$ |
| $5$ | $a^4 + a^3b + a^2b^2 + ab^3 + b^4$ |

Potence $a$ padajo po ena, potence $b$ rastejo po ena, vseh členov je $n$, vsi imajo znak plus. Za vsak naravni $n$ velja

$$a^n - b^n = (a - b)(a^{n-1} + a^{n-2}b + \ldots + ab^{n-2} + b^{n-1})$$

Zakaj? Zmnoži oklepaja. Ko z $a$ pomnožiš drugi oklepaj, dobiš $a^n, a^{n-1}b, \ldots, ab^{n-1}$. Ko ga pomnožiš z $-b$, dobiš $-a^{n-1}b, \ldots, -ab^{n-1}, -b^n$. Vsi vmesni členi se v parih izničijo, ostaneta le $a^n$ in $-b^n$.

S tem tudi krajšamo: $\dfrac{x^5 - 1}{x - 1} = x^4 + x^3 + x^2 + x + 1$ za $x \neq 1$.

**5. Vsota lihih potenc (višja raven).** Kot pri kubih vstavimo $-b$ namesto $b$. Če je $n$ lih, je $(-b)^n = -b^n$, znaki v drugem oklepaju pa se izmenjujejo:

$$a^n + b^n = (a + b)(a^{n-1} - a^{n-2}b + \ldots - ab^{n-2} + b^{n-1})$$

Na primer $a^5 + b^5 = (a + b)(a^4 - a^3b + a^2b^2 - ab^3 + b^4)$.

:::premisli
Zakaj obrazec za $a^n + b^n$ velja le za lih $n$? Kaj gre narobe pri $n = 2$?
---
Pri sodem $n$ je $(-b)^n = +b^n$, zato vstavljanje $-b$ v $a^n - b^n$ spet da $a^n - b^n$, ne vsote. Še preizkus: če je $a + b$ faktor, mora biti izraz enak $0$, kadar je $a + b = 0$. Pri $a = 1$, $b = -1$ bi faktor $a + b$ dal $0$, vsota $1^2 + (-1)^2 = 2$ pa ni $0$, zato $a + b$ ni faktor $a^2 + b^2$.
:::

**6. Sode potence.**

(višja raven) Izraza $a^2 + b^2$ in $a^4 + b^4$ s faktorjem $a + b$ ali $a - b$ ne razstavimo: isti preizkus z $a = 1$, $b = \pm 1$ da $2 \neq 0$. Izraza $a^2 + b^2$ z realnimi števili sploh ne razstavimo; $a^4 + b^4$ se da razstaviti le z drugačnim, zahtevnejšim prijemom, ki ga tu ne potrebujemo.

Pri razliki sodih potenc **najprej uporabi razliko kvadratov**. Razstavimo $x^6 - 1$ na dva načina:

- kot razlika kvadratov: $x^6 - 1 = (x^3 - 1)(x^3 + 1)$, nato vsak oklepaj kot razlika oziroma vsota kubov:
  $$x^6 - 1 = (x - 1)(x^2 + x + 1)(x + 1)(x^2 - x + 1)$$
- kot razlika kubov $(x^2)^3 - 1^3$: dobimo $(x^2 - 1)(x^4 + x^2 + 1) = (x - 1)(x + 1)(x^4 + x^2 + 1)$. Zadnji faktor je videti dokončen, a ni: $x^4 + x^2 + 1 = (x^2 + x + 1)(x^2 - x + 1)$.

Prva pot takoj pride do konca, druga skrije dva faktorja v enem.

## Rešeni primeri

### Primer 1 (lažji): razlika kubov

Razstavi $8x^3 - 27$.

**Podatki:** izraz $8x^3 - 27$
**Iščemo:** razcep na faktorje

:::formula
$a^3 - b^3 = (a - b)(a^2 + ab + b^2)$
:::

**Rešitev:**

1. Prepoznamo kuba: $8x^3 = (2x)^3$ in $27 = 3^3$, zato $a = 2x$, $b = 3$.
2. Prvi faktor: $a - b = 2x - 3$.
3. Drugi faktor: $a^2 = 4x^2$, $ab = 6x$, $b^2 = 9$, vsi s plusom.
4. Odgovor: $8x^3 - 27 = (2x - 3)(4x^2 + 6x + 9)$.

### Primer 2: najprej izpostavi

Razstavi $2a^4 + 54a$.

**Podatki:** izraz $2a^4 + 54a$
**Iščemo:** popoln razcep

:::formula
izpostavljanje, nato $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$
:::

**Rešitev:**

1. Skupni faktor obeh členov je $2a$, ker je $D(2, 54) = 2$ in $a$ nastopa vsaj na prvo potenco: $2a(a^3 + 27)$.
2. V oklepaju je vsota kubov: $27 = 3^3$.
3. $a^3 + 27 = (a + 3)(a^2 - 3a + 9)$; srednji člen ima nasprotni znak.
4. Faktor $a^2 - 3a + 9$ je drugi oklepaj obrazca za vsoto kubov, zato se z realnimi števili ne razstavi naprej.
5. Odgovor: $2a^4 + 54a = 2a(a + 3)(a^2 - 3a + 9)$.

### Primer 3 (težji): ohišje zvočnika

Mizar izdela ohišje za nizkotonski zvočnik v obliki kocke. Zunanji rob meri $32\,\mathrm{cm}$, v notranjosti je kockasta votlina z robom $30\,\mathrm{cm}$. Koliko kubičnih centimetrov lesa porabi? Računaj brez računala.

**Podatki:** zunanji rob $a = 32\,\mathrm{cm}$, notranji rob $b = 30\,\mathrm{cm}$
**Iščemo:** prostornino lesa $V$

:::formula
$V = a^3 - b^3 = (a - b)(a^2 + ab + b^2)$
:::

**Rešitev:**

1. Les je razlika prostornin dveh kock, torej razlika kubov.
2. $a - b = 2\,\mathrm{cm}$.
3. $a^2 = 1024$, $ab = 960$, $b^2 = 900$; vsota je $2884$.
4. $V = 2 \cdot 2884 = 5768\,\mathrm{cm^3}$.
5. Odgovor: mizar porabi $5768\,\mathrm{cm^3}$ lesa. Množenje $32 \cdot 32 \cdot 32$ in $30 \cdot 30 \cdot 30$ smo nadomestili z lažjimi kvadrati.

### Primer 4: Mersennovo število – zdaj ti

Pokaži, da je $2^{10} - 1 = 1023$ deljivo s $3$ in z $31$.

**Podatki:** število $2^{10} - 1$
**Iščemo:** razcep, iz katerega se vidita delitelja $3$ in $31$

:::formula
$a^2 - b^2 = (a - b)(a + b)$
:::

**Rešitev:**

1. Eksponent je sod, zato najprej razlika kvadratov: $2^{10} - 1 = (2^5)^2 - 1^2$.
2. Torej $2^{10} - 1 = (2^5 - 1)(2^5 + 1) = 31 \cdot 33$.
3. Iz tega razcepa sam preberi oba delitelja, nato preveri:

:::premisli
Zakaj sta $3$ in $31$ delitelja števila $1023$?
---
$31$ je prvi faktor, drugi faktor pa je $33 = 3 \cdot 11$. Torej je $1023 = 3 \cdot 11 \cdot 31$.

(višja raven) Do $3$ prideš tudi drugače: $2^{10} - 1 = 4^5 - 1^5 = (4 - 1)(4^4 + 4^3 + 4^2 + 4 + 1) = 3 \cdot 341$.
:::

## Pogoste napake

- **Kub vsote namesto vsote kubov.** »$a^3 + b^3 = (a + b)^3$.« Napačno: $(a + b)^3$ ima še člena $3a^2b$ in $3ab^2$. Pri $a = b = 1$ je levo $2$, desno $8$. Popravek: $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$.
- **Kvadrat v drugem oklepaju.** »$a^3 - b^3 = (a - b)(a - b)^2$« ali »$(a - b)(a + b)^2$«. Napačno, saj je srednji člen $ab$, ne $2ab$. Pri $13^3 - 12^3$ prvo da $1$, drugo $625$, prav pa je $469$. Popravek: drugi oklepaj je $a^2 + ab + b^2$.
- **Napačen znak srednjega člena.** »$x^3 + 8 = (x + 2)(x^2 + 2x + 4)$.« Napačno: ta zmnožek da $x^3 + 4x^2 + 8x + 8$. Popravek: pri vsoti kubov je srednji člen negativen, $(x + 2)(x^2 - 2x + 4)$.
- **Obrazec za vsoto pri sodi potenci (višja raven).** »$a^4 + b^4 = (a + b)(a^3 - a^2b + ab^2 - b^3)$.« Napačno: desno je $a^4 - b^4$. Popravek: $a^n + b^n$ s faktorjem $a + b$ razstavimo le pri lihem $n$.
- **Nedokončan razcep.** Pri $x^6 - 1$ prek kubov se ustaviš pri $x^4 + x^2 + 1$. Popravek: pri sodem eksponentu začni z razliko kvadratov ali pa preveri, ali se zadnji faktor da še razstaviti.

## Povzetek

- Razlika kubov: $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$. Vsota kubov: $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$.
- Znaki: v prvem oklepaju isti kot v nalogi, srednji člen nasprotni, zadnji vedno plus. Drugi oklepaj se z realnimi števili ne razstavi naprej.
- $a^3 \pm b^3 \neq (a \pm b)^3$, drugi oklepaj ni $(a \pm b)^2$.
- Postopek: najprej izpostavi skupni faktor, nato prepoznaj kube ($8x^3 = (2x)^3$), na koncu preizkus z množenjem.
- (višja raven) $a^n - b^n = (a - b)(a^{n-1} + a^{n-2}b + \ldots + b^{n-1})$ za vsak $n$; $a^n + b^n = (a + b)(a^{n-1} - a^{n-2}b + \ldots + b^{n-1})$ le za lih $n$.
- (višja raven) $a^2 + b^2$ in $a^4 + b^4$ nimata faktorja $a \pm b$. Uporaba: krajšanje ulomkov, npr. $\dfrac{x^5 - 1}{x - 1}$.
- Pri razliki sodih potenc najprej razlika kvadratov ($x^6 - 1$). Deljivost: $2^{10} - 1 = 31 \cdot 33$, $1001 = 7 \cdot 11 \cdot 13$.

## Ponovitev

**Formule**
- $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ (priloga)
- $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$ (priloga)
- $a^2 - b^2 = (a - b)(a + b)$ (na pamet)
- $a^n - b^n = (a - b)(a^{n-1} + \ldots + b^{n-1})$ (priloga, višja raven)
- $a^n + b^n = (a + b)(a^{n-1} - \ldots + b^{n-1})$ le za lih $n$ (priloga, višja raven)

**Postopek**
1. Najprej izpostavi skupni faktor.
2. Prepoznaj kube in zapiši $a$ in $b$, npr. $8x^3 = (2x)^3$, $27 = 3^3$.
3. Pri sodem eksponentu začni z razliko kvadratov.
4. Vstavi v obrazec: v prvem oklepaju znak naloge, srednji člen nasproten, zadnji vedno plus.
5. Drugi oklepaj $a^2 \pm ab + b^2$ pusti, z realnimi števili se ne razstavi naprej.
6. Preveri z množenjem.

**Pazi na**
- $a^3 + b^3 \neq (a + b)^3$: prav je $(a + b)(a^2 - ab + b^2)$.
- Srednji člen je $ab$ z nasprotnim znakom, ne $2ab$: $x^3 + 8 = (x + 2)(x^2 - 2x + 4)$.
- Nedokončan razcep: $x^6 - 1$ razstavi najprej kot razliko kvadratov $(x^3 - 1)(x^3 + 1)$, nato vsak oklepaj s kubi.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Razstavi izraz $(x + 1)^3 - 8$ in drugi faktor zapiši kot urejen tričlenik.

**Rešitev:**

1. Izraz je razlika kubov $a^3 - b^3$, kjer je $a = x + 1$ in $b = 2$, saj je $8 = 2^3$.
2. Po obrazcu: $(x + 1)^3 - 2^3 = \big[(x + 1) - 2\big]\big[(x + 1)^2 + 2(x + 1) + 4\big]$.
3. Poenostavimo: prvi faktor je $x - 1$, drugi $x^2 + 2x + 1 + 2x + 2 + 4 = x^2 + 4x + 7$.
4. Preizkus pri $x = 2$: izvirni izraz je $27 - 8 = 19$, razcep pa $1 \cdot (4 + 8 + 7) = 19$.
5. Odgovor: $(x + 1)^3 - 8 = (x - 1)(x^2 + 4x + 7)$.

**Točkovanje:** 1 točka za prepoznavo razlike kubov z $a = x + 1$ in $b = 2$, 1 točka za pravilno zapisan obrazec, 1 točka za poenostavljen razcep $(x - 1)(x^2 + 4x + 7)$.

### Naloga 2: krajša strukturirana naloga, 6 točk, pola 1 (brez računala)

Dana sta izraza $A = 8x^3 + 1$ in $B = 4x^2 - 1$.

a) Razstavi izraz $A$. (2 točki)
b) Razstavi izraz $B$ in zapiši skupni faktor izrazov $A$ in $B$. (2 točki)
c) Okrajšaj ulomek $\dfrac{A}{B}$, zapiši, za katere $x$ je definiran, in izračunaj njegovo vrednost pri $x = 2$. (2 točki)

**Rešitev:**

1. a) $8x^3 = (2x)^3$ in $1 = 1^3$, zato je $A$ vsota kubov: $A = (2x + 1)(4x^2 - 2x + 1)$.
2. b) $4x^2 = (2x)^2$, zato je $B$ razlika kvadratov: $B = (2x - 1)(2x + 1)$.
3. b) Skupni faktor je $2x + 1$.
4. c) Ulomek je definiran, ko je $B \neq 0$, torej za $x \neq \dfrac{1}{2}$ in $x \neq -\dfrac{1}{2}$.
5. c) Okrajšamo s skupnim faktorjem: $\dfrac{A}{B} = \dfrac{(2x + 1)(4x^2 - 2x + 1)}{(2x - 1)(2x + 1)} = \dfrac{4x^2 - 2x + 1}{2x - 1}$.
6. c) Pri $x = 2$: $\dfrac{16 - 4 + 1}{3} = \dfrac{13}{3}$. Preizkus z izvirnim ulomkom: $\dfrac{64 + 1}{16 - 1} = \dfrac{65}{15} = \dfrac{13}{3}$.
7. Odgovor: $A = (2x + 1)(4x^2 - 2x + 1)$, $B = (2x - 1)(2x + 1)$, skupni faktor je $2x + 1$; $\dfrac{A}{B} = \dfrac{4x^2 - 2x + 1}{2x - 1}$ za $x \neq \pm\dfrac{1}{2}$, pri $x = 2$ je vrednost $\dfrac{13}{3}$.

**Točkovanje:** a) 1 točka za prepoznavo kubov $(2x)^3$ in $1^3$, 1 točka za razcep $(2x + 1)(4x^2 - 2x + 1)$; b) 1 točka za razcep $B$, 1 točka za skupni faktor $2x + 1$; c) 1 točka za okrajšan ulomek s pogojem $x \neq \pm\dfrac{1}{2}$, 1 točka za vrednost $\dfrac{13}{3}$.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Obravnavamo izraze oblike $x^n - 2^n$ in $x^n + 2^n$, kjer je $n$ naravno število.

a) Razstavi izraz $x^5 - 32$ na linearni faktor in faktor četrte stopnje. (2 točki)
b) Razstavi izraz $x^5 + 32$ na linearni faktor in faktor četrte stopnje. (2 točki)
c) Z razcepoma iz a) in b) brez računanja potenc utemelji, da sta števili $7^5 - 32$ in $3^5 + 32$ deljivi s $5$. (2 točki)
d) Razstavi izraz $x^8 - 256$ na štiri faktorje s celimi koeficienti. (2 točki)
e) Utemelji, da $x - 2$ in $x + 2$ nista faktorja izraza $x^4 + 16$. (2 točki)

**Rešitev:**

1. a) $32 = 2^5$, zato po obrazcu za $a^n - b^n$ z $a = x$, $b = 2$, $n = 5$: $x^5 - 32 = (x - 2)(x^4 + 2x^3 + 4x^2 + 8x + 16)$.
2. b) Eksponent $5$ je lih, zato velja obrazec za vsoto lihih potenc z izmenjujočimi se znaki: $x^5 + 32 = (x + 2)(x^4 - 2x^3 + 4x^2 - 8x + 16)$.
3. c) V razcep iz a) vstavimo $x = 7$: $7^5 - 32 = 5 \cdot (7^4 + 2 \cdot 7^3 + 4 \cdot 7^2 + 8 \cdot 7 + 16)$. Drugi faktor je celo število, zato je $7^5 - 32$ deljivo s $5$.
4. c) V razcep iz b) vstavimo $x = 3$: $3^5 + 32 = 5 \cdot (3^4 - 2 \cdot 3^3 + 4 \cdot 3^2 - 8 \cdot 3 + 16)$. Drugi faktor je celo število, zato je tudi $3^5 + 32$ deljivo s $5$.
5. d) Eksponent je sod, zato začnemo z razliko kvadratov: $x^8 - 256 = (x^4 - 16)(x^4 + 16)$.
6. d) Nadaljujemo z razliko kvadratov: $x^4 - 16 = (x^2 - 4)(x^2 + 4) = (x - 2)(x + 2)(x^2 + 4)$. Torej $x^8 - 256 = (x - 2)(x + 2)(x^2 + 4)(x^4 + 16)$.
7. e) Če bi bil $x - c$ faktor izraza, bi bila vrednost izraza pri $x = c$ enaka $0$, saj bi bil tedaj ta faktor $0$.
8. e) Pri $x = 2$ in pri $x = -2$ je $x^4 + 16 = 16 + 16 = 32 \neq 0$, zato niti $x - 2$ niti $x + 2$ ni faktor izraza $x^4 + 16$.
9. Odgovor: $x^5 - 32 = (x - 2)(x^4 + 2x^3 + 4x^2 + 8x + 16)$, $x^5 + 32 = (x + 2)(x^4 - 2x^3 + 4x^2 - 8x + 16)$, števili $7^5 - 32$ in $3^5 + 32$ imata faktor $5$, $x^8 - 256 = (x - 2)(x + 2)(x^2 + 4)(x^4 + 16)$, izraz $x^4 + 16$ pri $x = \pm 2$ ni enak $0$.

**Točkovanje:** a) 1 točka za faktor $x - 2$, 1 točka za pravilen drugi faktor; b) 1 točka za faktor $x + 2$, 1 točka za drugi faktor s pravilnimi izmenjujočimi se znaki; c) 1 točka za utemeljitev deljivosti števila $7^5 - 32$, 1 točka za utemeljitev deljivosti števila $3^5 + 32$; d) 1 točka za $(x^4 - 16)(x^4 + 16)$, 1 točka za razcep na štiri faktorje; e) 1 točka za merilo (vrednost pri $x = \pm 2$ bi morala biti $0$), 1 točka za izračun $32 \neq 0$ in sklep.

### Ustno vprašanje 1

:::premisli
Izpelji obrazec za razstavljanje razlike kubov $a^3 - b^3$ in iz njega še obrazec za vsoto kubov.
---
Velja $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$, kar potrdimo z množenjem: $a^3 + a^2b + ab^2 - a^2b - ab^2 - b^3 = a^3 - b^3$. Ker je $(-b)^3 = -b^3$, lahko vsoto zapišemo kot razliko $a^3 + b^3 = a^3 - (-b)^3$. V obrazec za razliko kubov vstavimo $-b$ namesto $b$ in dobimo $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$. Drugi faktor $a^2 \pm ab + b^2$ z realnimi števili ne razstavimo naprej.
:::

### Ustno vprašanje 2

:::premisli
(višja raven) Zapiši obrazec za razstavljanje izraza $a^n - b^n$ za naravno število $n$ in ga utemelji z množenjem.
---
Velja $a^n - b^n = (a - b)(a^{n-1} + a^{n-2}b + \ldots + ab^{n-2} + b^{n-1})$. V drugem faktorju je $n$ členov, potence $a$ padajo, potence $b$ rastejo, vsi členi imajo znak plus. Ko drugi faktor pomnožimo z $a$, dobimo člene od $a^n$ do $ab^{n-1}$, ko ga pomnožimo z $-b$, pa člene od $-a^{n-1}b$ do $-b^n$. Vsi vmesni členi se v parih odštejejo, zato ostane le $a^n - b^n$.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Pojasni, za katere naravne eksponente $n$ lahko izraz $a^n + b^n$ razstavimo s faktorjem $a + b$, in navedi primer, ko to ni mogoče.
---
Izraz $a^n + b^n$ ima faktor $a + b$, kadar je eksponent $n$ lih. Pri lihem $n$ je $(-b)^n = -b^n$, zato je $a^n + b^n = a^n - (-b)^n$ in obrazec za razliko potenc da $a^n + b^n = (a + b)(a^{n-1} - a^{n-2}b + \ldots - ab^{n-2} + b^{n-1})$. Če bi bil $a + b$ faktor, bi moral biti izraz enak $0$ pri $b = -a$. Pri sodem $n$ je $(-a)^n = a^n$, zato ima izraz pri $b = -a$ vrednost $2a^n$, ki za $a \neq 0$ ni $0$, in $a + b$ ni faktor; tak primer je $a^2 + b^2$, ki pri $a = 1$ in $b = -1$ da $2$.
:::

## Drugače: Z analogijo (višja raven)

Drugi oklepaj pri $a^n - b^n$ je kot dva glasova v zboru, ki se gibljeta v nasprotnih smereh. Sopran začne visoko ($a^{n-1}$) in se spušča po en ton, bas začne na dnu ($b^0$) in se dviga po en ton. Na vsakem koraku je vsota obeh »višin« (eksponentov) enaka $n - 1$:

$$a^3 - b^3 = (a - b)(a^2 b^0 + a^1 b^1 + a^0 b^2)$$

Pri vsoti lihih potenc se doda še metronom: znaki gredo izmenično plus, minus, plus … in zadnji udarec je vedno plus. Pri sodi potenci je členov sodo mnogo, zadnji udarec pade na minus in zmnožek je spet $a^n - b^n$. Zato ta zapis za $a^n + b^n$ ne deluje.

## Drugače: Iz vsakdanjega življenja

Vzemi poljubno trimestno število, npr. $254$, in ga zapiši dvakrat zapored: $254254$. Tako število je vedno deljivo s $7$, $11$ in $13$. Zakaj?

1. $254254 = 254 \cdot 1001$.
2. $1001 = 10^3 + 1^3$ je vsota kubov.
3. $10^3 + 1 = (10 + 1)(100 - 10 + 1) = 11 \cdot 91$.
4. $91 = 7 \cdot 13$, torej $1001 = 7 \cdot 11 \cdot 13$.

Podobno razlika kubov $999 = 10^3 - 1 = 9 \cdot 111$ pove, da je $999$ deljivo s $111$, in ker je $111 = 3 \cdot 37$, je $999 = 27 \cdot 37$. Obrazca za kube sta torej tudi orodje za računanje na pamet in triki s števili.

## Preveri se

? Kateri izraz ne spada zraven? Trije so vsota ali razlika kubov dveh enočlenikov s celimi koeficienti, eden ni.
- $x^3 - 8$
~ $8 = 2^3$, zato je to razlika kubov: $(x - 2)(x^2 + 2x + 4)$.
- $27 + y^3$
~ $27 = 3^3$, to je vsota kubov: $(3 + y)(9 - 3y + y^2)$.
+ $x^3 + 9$
- $64a^3 - 1$
~ $64a^3 = (4a)^3$ in $1 = 1^3$, to je razlika kubov.
> $9$ ni kub celega števila, zato $x^3 + 9$ ne razstavimo s celimi koeficienti. Ostali trije so: $8 = 2^3$, $27 = 3^3$, $64a^3 = (4a)^3$.

? (brez računala) Z razliko kubov izračunaj $13^3 - 12^3$.
= 469
~ 1 | To je $(13 - 12)^3$. Razlika kubov ni kub razlike.
~ 625 | Drugi oklepaj si zapisal kot $(13 + 12)^2$. Srednji člen je $13 \cdot 12$, ne $2 \cdot 13 \cdot 12$.
~ 25 | Drugi oklepaj si zapisal kot $13 + 12$, kot pri razliki kvadratov. Drugi oklepaj je $13^2 + 13 \cdot 12 + 12^2$.
> $(13 - 12)(169 + 156 + 144) = 1 \cdot 469 = 469$.

? (višja raven) Zakaj $a^4 + b^4$ ne razstavimo s faktorjem $a + b$?
- Ker $4$ ni praštevilo.
~ Odločilno je, ali je eksponent sod, ne ali je praštevilo. Tudi $a^9 + b^9$ (eksponent $9$ ni praštevilo) ima faktor $a + b$.
+ Ker je $(-b)^4 = b^4$; pri $a = 1$, $b = -1$ je $a + b = 0$, izraz pa je $2$, zato $a + b$ ni faktor.
- Ker vsote potenc nikoli ne razstavimo.
~ Vsoto lihih potenc razstavimo, npr. $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$.
> Če bi bil $a + b$ faktor, bi bil izraz enak $0$ povsod, kjer je $a + b = 0$. Pri sodem eksponentu to ne velja.

? Ana razstavlja $x^6 - 64$ v štirih korakih:

| korak | zapis |
|---|---|
| 1 | $x^6 - 64 = (x^3 - 8)(x^3 + 8)$ |
| 2 | $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$ |
| 3 | $x^3 + 8 = (x + 2)(x^2 + 2x + 4)$ |
| 4 | $x^6 - 64 = (x - 2)(x^2 + 2x + 4)(x + 2)(x^2 + 2x + 4)$ |

Vpiši številko koraka, v katerem je prva napaka.
= 3
~ 1 | Korak 1 je pravilen: $x^6 - 64 = (x^3)^2 - 8^2$ je razlika kvadratov.
~ 2 | Korak 2 je pravilen: pri razliki kubov so v drugem oklepaju sami plusi.
~ 4 | Korak 4 le prepiše prejšnja koraka; napaka je nastala že prej.
> Pri vsoti kubov ima srednji člen nasprotni znak: $x^3 + 8 = (x + 2)(x^2 - 2x + 4)$.

? Razvrsti korake razstavljanja izraza $3x^4 - 3x$ v pravilni vrstni red.
1. Izpostavi skupni faktor: $3x(x^3 - 1)$.
2. Prepoznaj razliko kubov: $x^3 - 1^3$.
3. Uporabi obrazec: $3x(x - 1)(x^2 + x + 1)$.
4. Preveri, ali se kak faktor da še razstaviti.
5. Naredi preizkus z množenjem.
> Najprej vedno izpostavimo, nato obrazec, na koncu pregled faktorjev in preizkus: $3x^4 - 3x = 3x(x - 1)(x^2 + x + 1)$.

<<RACUN
enako: a^3-b^3 | (a-b)*(a^2+a*b+b^2)
enako: a^3+b^3 | (a+b)*(a^2-a*b+b^2)
vrednost: 4^3-3^3 | 37
vrednost: 9*111 | 999
enako: a^5+b^5 | (a+b)*(a^4-a^3*b+a^2*b^2-a*b^3+b^4)
enako: a^4-b^4 | (a-b)*(a^3+a^2*b+a*b^2+b^3)
enako: x^6-1 | (x-1)*(x^2+x+1)*(x+1)*(x^2-x+1)
enako: x^4+x^2+1 | (x^2+x+1)*(x^2-x+1)
enako: 8*x^3-27 | (2*x-3)*(4*x^2+6*x+9)
enako: 2*a^4+54*a | 2*a*(a+3)*(a^2-3*a+9)
vrednost: 32^3-30^3 | 5768
vrednost: 2^10-1 | 1023
vrednost: 31*33 | 1023
vrednost: 13^3-12^3 | 469
enako: x^6-64 | (x-2)*(x^2+2*x+4)*(x+2)*(x^2-2*x+4)
enako: 3*x^4-3*x | 3*x*(x-1)*(x^2+x+1)
vrednost: 7*11*13 | 1001
enako: (x+1)^3-8 | (x-1)*(x^2+4*x+7)
vrednost: 3^3-8 | 19
enako: 8*x^3+1 | (2*x+1)*(4*x^2-2*x+1)
enako: 4*x^2-1 | (2*x-1)*(2*x+1)
enako: (8*x^3+1)/(4*x^2-1) | (4*x^2-2*x+1)/(2*x-1)
vrednost: (4*2^2-2*2+1)/(2*2-1) | 13/3
vrednost: (8*2^3+1)/(4*2^2-1) | 13/3
enako: x^5-32 | (x-2)*(x^4+2*x^3+4*x^2+8*x+16)
enako: x^5+32 | (x+2)*(x^4-2*x^3+4*x^2-8*x+16)
vrednost: 7^5-32 | 5*3355
vrednost: 7^4+2*7^3+4*7^2+8*7+16 | 3355
vrednost: 3^5+32 | 5*55
vrednost: 3^4-2*3^3+4*3^2-8*3+16 | 55
enako: x^8-256 | (x^4-16)*(x^4+16)
enako: x^8-256 | (x-2)*(x+2)*(x^2+4)*(x^4+16)
vrednost: (-2)^4+16 | 32
>>

:::simboli
a | osnova prve potence | | | v Primeru 3 zunanji rob kocke
b | osnova druge potence | | | v Primeru 3 notranji rob kocke
n | eksponent | | | naravno število
x | spremenljivka | | |
V | prostornina lesa | V = a^3 - b^3 | cm^3 |
A, B | dana izraza, ki ju razstavimo in iz njiju sestavimo ulomek | A = 8x^3 + 1, B = 4x^2 - 1 | |
c | število, pri katerem preverimo, ali je $x - c$ faktor | | |
:::
