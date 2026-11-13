---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Na teniškem turnirju na izpadanje začne $128$ igralcev. Po vsakem krogu ostane polovica: $64$, $32$, … v finalu $2$, na koncu en zmagovalec. Koliko krogov odigrajo? Ker je $128 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2$, je krogov sedem, za vsako dvojko eden.

Druga igra: igralno kocko vržeš trikrat zapored. Vsak met ima $6$ izidov, zato je vseh možnih zaporedij $6 \cdot 6 \cdot 6 = 216$.

Situaciji sta videti različni, saj se v prvi število igralcev manjša, v drugi število izidov raste. Obe pa skrivata isto: zmnožek enakih faktorjev. Tak zmnožek zapišemo krajše kot **potenco**. S potencami zapišemo tudi zelo velika in zelo majhna števila, na primer razdaljo do Sonca $1{,}5 \cdot 10^{11}\,\text{m}$ in premer atoma približno $10^{-10}\,\text{m}$.

## Razlaga

Vsako pravilo spodaj najprej preizkusimo na enem konkretnem računu, šele nato ga zapišemo splošno.

**1. Potenca z naravnim eksponentom.** Na turnirju smo sedem enakih faktorjev $2$ zapisali krajše kot $2^7 = 128$, pri kocki pa $6^3 = 216$. Enako zapišemo zmnožek poljubno mnogo enakih faktorjev:

$$a^n = \underbrace{a \cdot a \cdot \ldots \cdot a}_{n\ \text{faktorjev}}$$

Število $a$ je **osnova**, naravno število $n$ je **eksponent**, rezultat pa je **vrednost potence**. Beremo »$a$ na $n$«. Posebej velja $a^1 = a$. Primeri: $2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32$, $\left(\dfrac{2}{3}\right)^3 = \dfrac{2}{3} \cdot \dfrac{2}{3} \cdot \dfrac{2}{3} = \dfrac{8}{27}$ in $0{,}1^2 = 0{,}1 \cdot 0{,}1 = 0{,}01$.

**2. Predznak potence.** Predznak vrednosti potence določita osnova in eksponent:

| Osnova | Eksponent | Predznak potence | Primer |
|---|---|---|---|
| pozitivna | poljuben | pozitiven | $2^3 = 8$ |
| negativna | sod | pozitiven | $(-2)^4 = 16$ |
| negativna | lih | negativen | $(-2)^3 = -8$ |

Pazi na oklepaje. Pri $(-2)^4$ je osnova $-2$ in rezultat je $16$. Pri $-2^4$ potenciramo samo število $2$, minus pa je predznak rezultata: $-2^4 = -(2^4) = -16$. Vrstni red računskih operacij je: oklepaji, potenciranje, množenje in deljenje, nazadnje seštevanje in odštevanje. Na primer $3 + 2 \cdot 4^2 = 3 + 2 \cdot 16 = 35$.

:::premisli
Koliko sta $(-1)^{2025}$ in $-1^{2026}$? Napovej brez računanja.
---
Obe sta $-1$. Pri $(-1)^{2025}$ je osnova negativna, eksponent pa lih. Pri $-1^{2026}$ ni oklepaja: potenciramo samo $1$ in dobimo $1$, minus pa ostane pred rezultatom.
:::

**3. Pravila za naravne eksponente.** Izračunajmo najprej en primer, $2^3 \cdot 2^2$. Prva potenca ima tri faktorje, druga dva, skupaj jih je pet: $(2 \cdot 2 \cdot 2) \cdot (2 \cdot 2) = 2^5$. Eksponenta sta se seštela. Na podoben način izpeljemo ostala pravila. Za $a \neq 0$, $b \neq 0$ ter naravni števili $m$ in $n$ velja:

| Pravilo | Zapis | Primer |
|---|---|---|
| množenje potenc z isto osnovo | $a^m \cdot a^n = a^{m+n}$ | $3^4 \cdot 3^2 = 3^6$ |
| deljenje potenc z isto osnovo ($m > n$) | $a^m : a^n = a^{m-n}$ | $5^7 : 5^4 = 5^3$ |
| potenca potence | $(a^m)^n = a^{m \cdot n}$ | $(2^3)^2 = 2^6$ |
| potenca zmnožka | $(a \cdot b)^n = a^n \cdot b^n$ | $(2 \cdot 5)^3 = 2^3 \cdot 5^3$ |
| potenca količnika | $\left(\dfrac{a}{b}\right)^n = \dfrac{a^n}{b^n}$ | $\left(\dfrac{3}{2}\right)^2 = \dfrac{9}{4}$ |

Pravili za množenje in deljenje veljata samo, kadar imata potenci **isto osnovo**. Če osnovi nista enaki, ju najprej zapišemo kot potenci iste osnove, na primer $4 = 2^2$, $8 = 2^3$, $9 = 3^2$, $27 = 3^3$. Za vsoto in razliko potenc takega pravila ni: $a^m + a^n$ v splošnem ne moremo zapisati kot eno potenco, $(a + b)^n$ pa ni enako $a^n + b^n$.

**4. Ničta potenca.** Za $a \neq 0$ definiramo $a^0 = 1$. Zakaj prav tako? Pravilo za deljenje želimo ohraniti tudi za enaka eksponenta: $a^3 : a^3 = a^{3-3} = a^0$. Količnik dveh enakih števil pa je $1$, zato mora biti $a^0 = 1$. Na turnirju to pomeni: po sedmih krogih ostane $2^7 : 2^7 = 2^0 = 1$ igralec, zmagovalec. Torej $7^0 = 1$, $(-4)^0 = 1$ in $\left(\dfrac{2}{3}\right)^0 = 1$. Izraz $0^0$ ni definiran.

**5. Negativni eksponent.** Za $a \neq 0$ in naravno število $n$ definiramo

$$a^{-n} = \frac{1}{a^n}.$$

Razlog: izračunajmo $a^2 : a^5$. Po pravilu za deljenje je rezultat $a^{2-5} = a^{-3}$. Če pa ulomek $\dfrac{a \cdot a}{a \cdot a \cdot a \cdot a \cdot a}$ skrajšamo, dobimo $\dfrac{1}{a^3}$. Obe poti se ujemata, če je $a^{-3} = \dfrac{1}{a^3}$. Negativni eksponent torej **ne naredi števila negativnega**, ampak vzame obratno vrednost. Primeri: $2^{-3} = \dfrac{1}{8}$, $10^{-2} = \dfrac{1}{100} = 0{,}01$ in $(-2)^{-3} = \dfrac{1}{(-2)^3} = -\dfrac{1}{8}$.

Tabela nadaljuje vzorec s turnirja: vsak korak navzdol po eksponentu vrednost razpolovi.

| $n$ | $2^n$ |
|---|---|
| $3$ | $8$ |
| $2$ | $4$ |
| $1$ | $2$ |
| $0$ | $1$ |
| $-1$ | $\dfrac{1}{2}$ |
| $-2$ | $\dfrac{1}{4}$ |
| $-3$ | $\dfrac{1}{8}$ |

V simulaciji spodaj »Potence s celimi eksponenti« nastavi osnovo $2$ in eksponent premikaj od $4$ do $-3$. Opazuj, da se vrednost na vsakem koraku razpolovi, a nikoli ne postane $0$ ali negativna.

:::premisli
Kaj je večje, $10^{-3}$ ali $10^{-6}$? Napovej, nato utemelji.
---
$10^{-3} = \dfrac{1}{1000} = 0{,}001$ je večje od $10^{-6} = \dfrac{1}{1\,000\,000}$. Večji imenovalec da manjši ulomek, zato pri osnovi $10$ bolj negativen eksponent pomeni manjše število.
:::

Pri ulomku osnovo obrnemo, ker je obratna vrednost ulomka $\dfrac{a}{b}$ prav ulomek $\dfrac{b}{a}$: $\left(\dfrac{a}{b}\right)^{-n} = \left(\dfrac{b}{a}\right)^n$, na primer $\left(\dfrac{2}{3}\right)^{-2} = \left(\dfrac{3}{2}\right)^2 = \dfrac{9}{4}$. Faktor z negativnim eksponentom lahko prestaviš iz števca v imenovalec (ali obratno), če eksponentu spremeniš predznak: $\dfrac{1}{a^{-n}} = a^n$ in $\dfrac{a^{-n}}{b^{-m}} = \dfrac{b^m}{a^n}$.

**6. Vsa pravila za cele eksponente.** Z ničto potenco in negativnimi eksponenti je potenca $a^n$ definirana za vsako celo število $n$ (pri $a \neq 0$). Vsa pravila iz tretje točke zdaj veljajo za poljubna cela eksponenta $m$ in $n$. Rezultat deljenja tako lahko zapišemo tudi, ko je $m < n$: $5^4 : 5^7 = 5^{-3} = \dfrac{1}{125}$. Pa še en primer: $3^5 \cdot 3^{-7} = 3^{5-7} = 3^{-2} = \dfrac{1}{9}$.

**7. Potence števila 10 in znanstveni zapis.** Potence števila $10$ so zelo preproste: $10^3 = 1000$ (tri ničle), $10^{-3} = \dfrac{1}{1000} = 0{,}001$ (tri decimalna mesta). **Znanstveni zapis** števila je oblika

$$a \cdot 10^n, \qquad 1 \le a < 10, \quad n \in \mathbb{Z}.$$

Na primer $3\,500\,000 = 3{,}5 \cdot 10^6$ in $0{,}00042 = 4{,}2 \cdot 10^{-4}$. Pri množenju ločeno množimo števila in ločeno potence števila $10$: $(3 \cdot 10^5) \cdot (2 \cdot 10^{-2}) = 6 \cdot 10^3$. Če dobimo $a \ge 10$, popravimo zapis: $12 \cdot 10^3 = 1{,}2 \cdot 10^4$.

**8. Postopek poenostavljanja.** Zapomni si zaporedje korakov: (1) vse osnove zapiši kot potence iste osnove, (2) uporabi pravili za potenco potence in potenco zmnožka, (3) pri množenju eksponente seštej, pri deljenju odštej, (4) po potrebi rezultat zapiši brez negativnih eksponentov, (5) preizkusi z majhnim številom.

## Rešeni primeri

### Primer 1 (lažji)

Izračunaj vrednosti potenc $(-2)^3$, $-2^4$, $4^{-2}$ in $\left(\dfrac{2}{3}\right)^{-2}$.

**Podatki:** osnove in eksponenti: $(-2)^3$, $-2^4$, $4^{-2}$, $\left(\dfrac{2}{3}\right)^{-2}$
**Iščemo:** vrednosti vseh štirih potenc

:::formula
$a^n = a \cdot a \cdot \ldots \cdot a$ ($n$ faktorjev), $a^{-n} = \dfrac{1}{a^n}$, $\left(\dfrac{a}{b}\right)^{-n} = \left(\dfrac{b}{a}\right)^n$
:::

**Rešitev:**

1. $(-2)^3 = (-2) \cdot (-2) \cdot (-2) = 4 \cdot (-2) = -8$. Osnova je negativna, eksponent lih, zato je rezultat negativen.
2. Pri $-2^4$ potenciramo samo število $2$: $-2^4 = -(2 \cdot 2 \cdot 2 \cdot 2) = -16$.
3. $4^{-2} = \dfrac{1}{4^2} = \dfrac{1}{16}$.
4. $\left(\dfrac{2}{3}\right)^{-2} = \left(\dfrac{3}{2}\right)^2 = \dfrac{3^2}{2^2} = \dfrac{9}{4}$.
5. Odgovor: $(-2)^3 = -8$, $-2^4 = -16$, $4^{-2} = \dfrac{1}{16}$ in $\left(\dfrac{2}{3}\right)^{-2} = \dfrac{9}{4}$.

### Primer 2 (srednji)

Poenostavi in izračunaj vrednost izraza $\dfrac{9^2 \cdot 3^{-3}}{27^{-1}}$.

**Podatki:** števec $9^2 \cdot 3^{-3}$, imenovalec $27^{-1}$; osnove $9$, $3$ in $27$, eksponenti $2$, $-3$ in $-1$
**Iščemo:** vrednost izraza

:::formula
$(a^m)^n = a^{m \cdot n}$, $a^m \cdot a^n = a^{m+n}$, $a^m : a^n = a^{m-n}$
:::

**Rešitev:**

1. Vse osnove zapišemo kot potence števila $3$: $9 = 3^2$ in $27 = 3^3$.
2. Potenca potence: $9^2 = (3^2)^2 = 3^4$ in $27^{-1} = (3^3)^{-1} = 3^{-3}$.
3. Števec: $3^4 \cdot 3^{-3} = 3^{4 + (-3)} = 3^1$.
4. Izraz je zdaj $3^1 : 3^{-3} = 3^{1 - (-3)} = 3^4 = 81$.
5. Preizkus brez pravil: $9^2 = 81$ in $3^{-3} = \dfrac{1}{27}$, zato je števec $81 \cdot \dfrac{1}{27} = 3$. Imenovalec je $27^{-1} = \dfrac{1}{27}$ in $3 : \dfrac{1}{27} = 3 \cdot 27 = 81$.
6. Odgovor: vrednost izraza je $81$.

### Primer 3 (teniške žogice)

Na velikem teniškem turnirju porabijo približno $5{,}5 \cdot 10^4$ žogic. Ena žogica ima maso približno $5{,}8 \cdot 10^{-2}\,\text{kg}$. Kolikšna je skupna masa vseh žogic? Rezultat zapiši v znanstvenem zapisu in v tonah.

**Podatki:** število žogic $N = 5{,}5 \cdot 10^4$, masa ene žogice $m_0 = 5{,}8 \cdot 10^{-2}\,\text{kg}$
**Iščemo:** skupno maso $M$

:::formula
$M = N \cdot m_0$ in $10^m \cdot 10^n = 10^{m+n}$
:::

**Rešitev:**

1. Skupna masa je število žogic, pomnoženo z maso ene žogice: $M = 5{,}5 \cdot 10^4 \cdot 5{,}8 \cdot 10^{-2}\,\text{kg}$.
2. Ker smemo faktorje preurediti, zmnožimo najprej števili: $5{,}5 \cdot 5{,}8 = 31{,}9$.
3. Potenci imata isto osnovo, zato eksponenta seštejemo: $10^{4} \cdot 10^{-2} = 10^{4 + (-2)} = 10^{2}$. Dobimo $M = 31{,}9 \cdot 10^2\,\text{kg}$.
4. Ker je $31{,}9 \ge 10$, zapis popravimo: $31{,}9 = 3{,}19 \cdot 10^1$, zato je $M = 3{,}19 \cdot 10^3\,\text{kg}$.
5. Ker je $10^3\,\text{kg} = 1\,\text{t}$, je $M = 3{,}19\,\text{t}$.
6. Odgovor: podatki imajo dve veljavni mesti, zato žogice skupaj tehtajo približno $3{,}2 \cdot 10^3\,\text{kg}$, to je okoli $3{,}2$ tone.

### Primer 4 – zdaj ti

Poenostavi izraz $\left(\dfrac{2a^3b^{-2}}{a^{-1}b}\right)^{-2}$ in ga zapiši brez negativnih eksponentov. Velja $a \neq 0$ in $b \neq 0$.

**Podatki:** izraz $\left(\dfrac{2a^3b^{-2}}{a^{-1}b}\right)^{-2}$, pogoja $a \neq 0$ in $b \neq 0$
**Iščemo:** enostavnejši izraz brez negativnih eksponentov

:::formula
$a^m : a^n = a^{m-n}$, $(a \cdot b)^n = a^n \cdot b^n$, $(a^m)^n = a^{m \cdot n}$, $a^{-n} = \dfrac{1}{a^n}$
:::

**Rešitev:**

1. Najprej poenostavimo ulomek v oklepaju, vsako osnovo posebej. Število $2$ ostane. Za $a$ je $a^3 : a^{-1} = a^{3 - (-1)} = a^4$. Za $b$ je $b^{-2} : b^1 = b^{-2-1} = b^{-3}$. Oklepaj je enak $2a^4b^{-3}$.
2. Potenco $-2$ uporabimo na vsakem faktorju: $(2a^4b^{-3})^{-2} = 2^{-2} \cdot (a^4)^{-2} \cdot (b^{-3})^{-2}$.
3. Izračunaj vse tri potence, zapiši rezultat brez negativnih eksponentov in ga preizkusi za $a = 1$, $b = 2$.

:::premisli
Kaj dobiš in ali se preizkus ujema?
---
$2^{-2} = \dfrac{1}{4}$, $(a^4)^{-2} = a^{-8}$ in $(b^{-3})^{-2} = b^6$, torej $\dfrac{1}{4} \cdot a^{-8} \cdot b^6 = \dfrac{b^6}{4a^8}$. Preizkus za $a = 1$, $b = 2$: oklepaj je $\dfrac{2 \cdot 2^{-2}}{2} = \dfrac{1}{4}$ in $\left(\dfrac{1}{4}\right)^{-2} = 16$, rezultat pa $\dfrac{2^6}{4} = \dfrac{64}{4} = 16$.
:::

## Pogoste napake

- **Minus in oklepaj: »$-3^2 = 9$«.** Razlog: minus pred potenco ni del osnove, če ni oklepaja, potenciranje pa je na vrsti pred predznakom minus. Pravilno: $-3^2 = -(3 \cdot 3) = -9$, medtem ko je $(-3)^2 = (-3) \cdot (-3) = 9$.
- **Seštevanje in množenje eksponentov zamenjaš: »$2^3 \cdot 2^4 = 2^{12}$« ali »$2^3 \cdot 2^4 = 4^7$«.** Razlog: pri $2^3 \cdot 2^4$ imaš skupaj $3 + 4 = 7$ faktorjev dvojk, osnova pa ostane $2$. Pravilno: $2^3 \cdot 2^4 = 2^7 = 128$. Eksponente množiš samo pri potenci potence: $(2^3)^4 = 2^{12}$.
- **Potenca vsote: »$(a + b)^n = a^n + b^n$«.** Razlog: pravilo velja za zmnožek, za vsoto ne. Preizkus s številkami: $(2 + 3)^2 = 25$, vendar $2^2 + 3^2 = 13$. Pravilno: najprej izračunaj vsoto v oklepaju in jo šele nato potenciraj. Kako vsoto v oklepaju razviješ, se naučiš v naslednji temi.
- **Negativni eksponent da negativno število: »$2^{-3} = -8$« ali »$2^{-3} = -\dfrac{1}{8}$«.** Razlog: negativni eksponent pomeni obratno vrednost, predznaka rezultata ne spremeni. Pravilno: $2^{-3} = \dfrac{1}{2^3} = \dfrac{1}{8}$. Ničta potenca prav tako ni $0$: $5^0 = 1$.
- **Eksponent velja za več, kot mora: »$3 \cdot 2^2 = 6^2$« ali »$2a^{-3} = \dfrac{1}{2a^3}$«.** Razlog: eksponent se nanaša samo na osnovo tik pred njim. Pravilno: $3 \cdot 2^2 = 3 \cdot 4 = 12$, medtem ko je $6^2 = 36$. In $2a^{-3} = 2 \cdot \dfrac{1}{a^3} = \dfrac{2}{a^3}$.

## Povzetek

- $a^n$ je zmnožek $n$ faktorjev $a$; $a$ je osnova, $n$ je eksponent. Predznak: negativna osnova in lih eksponent dasta negativen rezultat; $-2^4 \neq (-2)^4$.
- Za $a \neq 0$ velja $a^0 = 1$ in $a^{-n} = \dfrac{1}{a^n}$; negativni eksponent pomeni obratno vrednost, ne negativnega števila. $\left(\dfrac{a}{b}\right)^{-n} = \left(\dfrac{b}{a}\right)^n$.
- Isti osnovi: $a^m \cdot a^n = a^{m+n}$ in $a^m : a^n = a^{m-n}$ (eksponente seštevamo oziroma odštevamo).
- Potenca potence: $(a^m)^n = a^{m \cdot n}$ (eksponente množimo).
- Potenca zmnožka in količnika: $(a \cdot b)^n = a^n \cdot b^n$ in $\left(\dfrac{a}{b}\right)^n = \dfrac{a^n}{b^n}$. Za vsoto takega pravila ni: $(a + b)^n \neq a^n + b^n$.
- Pravila veljajo za vsa cela števila $m$ in $n$, osnove pa morajo biti različne od $0$. Izraz $0^0$ ni definiran.
- Znanstveni zapis: $a \cdot 10^n$ z $1 \le a < 10$ in celim $n$.

## Drugače: Z analogijo

Predstavljaj si stolpnico, v kateri je v vsakem nadstropju zapisana potenca števila $10$. V pritličju (nadstropje $0$) piše $10^0 = 1$. Vsako nadstropje navzgor pomnoži z $10$, zato v 3. nadstropju piše $10^3 = 1000$. Vsako nadstropje navzdol, v klet, deli z $10$, zato v 2. kleti (nadstropje $-2$) piše $10^{-2} = 0{,}01$.

- **Množenje je vožnja navzgor.** Iz 3. nadstropja se pelješ 2 nadstropji gor in prideš v 5.: $10^{3} \cdot 10^{2} = 10^{5}$. Eksponenta se seštejeta, ker se seštejeta poti.
- **Deljenje je vožnja navzdol.** Iz 5. nadstropja se pelješ 7 nadstropij dol in prideš v 2. klet: $10^5 : 10^7 = 10^{-2}$.
- **Potenca potence so enake vožnje.** $(10^2)^3$ pomeni trikrat po 2 nadstropji gor, skupaj $2 \cdot 3 = 6$ nadstropij: $10^6$.
- **Klet ni negativno število.** Tudi v kleti so zapisana pozitivna števila, le manjša od $1$.

Analogija ima mejo: vsota $10^2 + 10^3 = 1100$ ni nobena vožnja, zato tudi ni ena potenca števila $10$.

## Drugače: Korak za korakom s številkami

Poenostavimo izraz $\dfrac{(2^{-1})^3 \cdot 4^2}{2^{-5}}$ po korakih in vsak korak preverimo.

| Korak | Kaj naredim | Rezultat |
|---|---|---|
| 1 | Izberem skupno osnovo $2$ in zapišem $4 = 2^2$ | $\dfrac{(2^{-1})^3 \cdot (2^2)^2}{2^{-5}}$ |
| 2 | Potenca potence: eksponente zmnožim | $\dfrac{2^{-3} \cdot 2^{4}}{2^{-5}}$ |
| 3 | Števec: eksponente seštejem, $-3 + 4 = 1$ | $\dfrac{2^{1}}{2^{-5}}$ |
| 4 | Deljenje: eksponente odštejem, $1 - (-5) = 6$ | $2^{6}$ |
| 5 | Izračunam potenco | $2^6 = 64$ |

Preizkus brez pravil: $(2^{-1})^3 = \left(\dfrac{1}{2}\right)^3 = \dfrac{1}{8}$ in $4^2 = 16$, zato je števec $\dfrac{16}{8} = 2$. Imenovalec je $2^{-5} = \dfrac{1}{32}$. Količnik je $2 : \dfrac{1}{32} = 2 \cdot 32 = 64$. Rezultata se ujemata.

Najpogostejša past je četrti korak: odštevanje negativnega eksponenta je prištevanje. Zato je $1 - (-5) = 6$ in ne $-4$. Kadar v izrazu nastopa črka, jo za preizkus nadomestiš z majhnim številom, na primer $a = 2$, in primerjaš vrednost izraza pred poenostavitvijo in po njej.

## Drugače: Bolj natančno

**Definicija po korakih.** Potenco z naravnim eksponentom določimo rekurzivno: $a^1 = a$ in $a^{n+1} = a^n \cdot a$. Iz definicije sledi pravilo za množenje: $a^m$ ima $m$ faktorjev, $a^n$ jih ima $n$, zmnožek pa $m + n$. Pravilo $(a \cdot b)^n = a^n \cdot b^n$ sledi iz tega, da pri množenju faktorje lahko poljubno preurejamo in združujemo: v zmnožku $n$ parov $a \cdot b$ prestavimo vse $a$ naprej in vse $b$ nazaj.

**Ničta potenca in negativni eksponent nista izrek, ampak dogovor.** Dogovorimo se tako, da pravila ostanejo v veljavi. Če naj velja $a^n \cdot a^0 = a^{n+0} = a^n$, mora biti $a^0 = 1$. Če naj velja $a^n \cdot a^{-n} = a^0 = 1$, je $a^{-n}$ obratna vrednost potence $a^n$, torej $\dfrac{1}{a^n}$. Pri $a = 0$ ta dogovor odpove: $0^{-1}$ bi bilo $\dfrac{1}{0}$, deljenje z ničlo pa ni mogoče. Izraz $0^0$ je še bolj zapleten, saj bi po pravilu $a^0 = 1$ moral biti $1$, po pravilu $0^n = 0$ pa $0$, zato mu v tej temi ne pripišemo vrednosti.

**Predznak.** Splošno je $(-a)^n = (-1)^n \cdot a^n$, kjer je $(-1)^n$ enak $1$ pri sodem in $-1$ pri lihem $n$.

**Rast in padanje.** Pri osnovi $a > 1$ večji eksponent pomeni večjo potenco: $2^{-3} < 2^2$, saj je $\dfrac{1}{8} < 4$. Pri osnovi $0 < a < 1$ je ravno obratno: $\left(\dfrac{1}{2}\right)^{-3} = 8$ je večje od $\left(\dfrac{1}{2}\right)^2 = \dfrac{1}{4}$. V tej temi imamo samo cele eksponente. Potence z ulomki v eksponentu so posebna, kasnejša snov.

## Preveri se

? Ključavnica na omarici v garderobi ima $4$ kolesca, vsako s števkami od $0$ do $9$. Vseh kombinacij je $10^4$. Kaj v tem zapisu pove eksponent $4$?
- Koliko števk je na vsakem kolescu.
~ To pove osnova $10$: vsako kolesce da $10$ možnosti.
+ Koliko enakih faktorjev $10$ zmnožimo, torej koliko je kolesc.
- Koliko je vseh kombinacij.
~ Število vseh kombinacij je vrednost potence, $10^4 = 10\,000$, ne eksponent.
- S katerim številom pomnožimo $10$.
~ $10^4$ ni $10 \cdot 4 = 40$. Eksponent pove število enakih faktorjev.
> Eksponent šteje enake faktorje: $10^4 = 10 \cdot 10 \cdot 10 \cdot 10$, en faktor za vsako kolesce.

? Uredi od najmanjšega do največjega: $2^{-3}$, $2^0$, $(-2)^3$, $-2^2$.
- $2^{-3} < (-2)^3 < -2^2 < 2^0$
~ Negativni eksponent ne da negativnega števila: $2^{-3} = \dfrac{1}{8} > 0$.
- $(-2)^3 < 2^{-3} < 2^0 < -2^2$
~ Brez oklepaja potenciramo samo $2$, zato je $-2^2 = -4$, ne $4$.
- $(-2)^3 < -2^2 < 2^0 < 2^{-3}$
~ Ničta potenca ni $0$: $2^0 = 1$, kar je več od $\dfrac{1}{8}$.
+ $(-2)^3 < -2^2 < 2^{-3} < 2^0$
> $(-2)^3 = -8$, $-2^2 = -4$, $2^{-3} = \dfrac{1}{8}$ in $2^0 = 1$.

? Turnir na izpadanje z $2^n$ igralci ima $n$ krogov. Kaj se zgodi s številom igralcev, če turnir podaljšamo za en krog, da je igralcev $2^{n+1}$?
- Poveča se za $1$.
~ Za $1$ se poveča eksponent, ne vrednost: $2^{n+1}$ ni $2^n + 1$.
+ Podvoji se.
- Poveča se za $2$.
~ $2^{n+1} = 2^n \cdot 2$: dodani faktor $2$ množi, ne prišteva.
- Kvadrira se.
~ Kvadrat bi bil $(2^n)^2 = 2^{2n}$: eksponent bi se podvojil, ne povečal za $1$.
> $2^{n+1} = 2^n \cdot 2$, torej je igralcev dvakrat več, na primer $128$ namesto $64$.

? Koliko je $\left(\dfrac{2}{5}\right)^{-2}$?
- $\dfrac{4}{25}$
~ Pozabiš obrniti ulomek. Negativni eksponent pomeni obratno vrednost.
+ $\dfrac{25}{4}$
- $-\dfrac{4}{25}$
~ Negativni eksponent ne naredi rezultata negativnega, ulomek pa je treba obrniti.
- $\dfrac{5}{2}$
~ Ulomek si obrnil, a pozabil kvadrirati.
> $\left(\dfrac{2}{5}\right)^{-2} = \left(\dfrac{5}{2}\right)^2 = \dfrac{25}{4}$.

? Koliko je $\dfrac{2^3 \cdot 2^{-5}}{2^{-4}}$?
- $\dfrac{1}{64}$
~ Pri deljenju odšteješ $-4$, kar je prištevanje: $-2 - (-4) = 2$, ne $-6$.
+ $4$
- $-4$
~ Negativni eksponenti ne dajo negativnega rezultata: potenca pozitivne osnove je vedno pozitivna.
> Števec: $2^{3 + (-5)} = 2^{-2}$. Deljenje: $2^{-2 - (-4)} = 2^2 = 4$.

:::simboli
a | osnova potence | | | v znanstvenem zapisu število z $1 \le a < 10$
b | osnova druge potence | | |
n | eksponent | | | naravno ali celo število
m | eksponent druge potence | | |
N | število žogic | | – |
m_0 | masa ene žogice | | kg |
M | skupna masa žogic | M = N \cdot m_0 | kg |
:::
