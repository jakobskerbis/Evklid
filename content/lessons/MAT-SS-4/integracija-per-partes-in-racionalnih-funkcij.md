---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Integracijo »per partes« in z razcepom na parcialne ulomke matura preverja samo na višji ravni.*

Leta 1569 je flamski kartograf Gerardus Mercator izdal zemljevid sveta, na katerem je pot s stalno smerjo po kompasu ravna črta. Pomorščak je smer plovbe lahko kar odčital z ravnilom. Da bi karta ohranila kote, je moral Mercator vzporednike proti poloma razmikati vse bolj.

Kako daleč od ekvatorja mora biti kateri vzporednik? Natančne tabele je pozneje izračunal angleški matematik Edward Wright: sešteval je zelo veliko majhnih koščkov, minuto za minuto zemljepisne širine. Danes bi rekli, da je računal integral. V 17. stoletju se je izkazalo, da ima ta integral preprosto obliko z logaritmom. V dokazu, ki ga je leta 1670 objavil Isaac Barrow, je ključni korak razcep ulomka na dva preprostejša, **parcialna ulomka**.

To je ena od dveh metod te lekcije. Druga, **per partes** (po delih), je pravilo za odvod produkta, prebrano nazaj. Obe rešita integrale, pri katerih osnovna tabela odpove.

## Razlaga

**1. Mamljiva bližnjica.** Vsoto integriramo po členih. Ali lahko tako ravnamo tudi s produktom? Poskusimo pri $\int x\,e^x\,dx$:

$\int x\,dx \cdot \int e^x\,dx = \frac{x^2}{2}\,e^x$ (napačno).

Preizkus z odvajanjem po pravilu za produkt: $\left(\frac{x^2}{2}\,e^x\right)' = x\,e^x + \frac{x^2}{2}\,e^x$. Dobili smo en člen preveč. Integral produkta **ni** produkt integralov, prav tako kot odvod produkta ni produkt odvodov.

**2. Popravilo: pravilo za produkt nazaj.** Za funkciji $u$ in $v$ velja

$$(u\,v)' = u'\,v + u\,v'$$

Integrirajmo obe strani: $u\,v = \int u'\,v\,dx + \int u\,v'\,dx$. Ko drugi integral izrazimo, dobimo formulo **per partes**:

$$\int u\,v'\,dx = u\,v - \int u'\,v\,dx$$

Integral produkta zamenjamo z drugim integralom. Metoda se splača, kadar je novi integral lažji od prvotnega.

**3. Prvi integral do konca.** Pri $\int x\,e^x\,dx$ izberemo $u = x$ in $v' = e^x$. Potem je $u' = 1$ in $v = e^x$:

$$\int x\,e^x\,dx = x\,e^x - \int e^x\,dx = x\,e^x - e^x + C$$

Preizkus: $(x\,e^x - e^x)' = e^x + x\,e^x - e^x = x\,e^x$. Pravilno.

**4. Kako izbrati $u$.** Za $u$ vzemi del, ki se z odvajanjem poenostavi: polinom (stopnja se zmanjša) ali $\ln x$ (postane $\frac{1}{x}$). Za $v'$ vzemi del, ki ga znaš integrirati in se pri tem ne zaplete: $e^x$, $\sin x$, $\cos x$.

:::premisli
Kaj bi se zgodilo pri $\int x\,e^x\,dx$, če bi izbral obratno, $u = e^x$ in $v' = x$? Napovej, preden računaš.
---
Dobil bi $v = \frac{x^2}{2}$ in $\int x\,e^x\,dx = \frac{x^2}{2}\,e^x - \int \frac{x^2}{2}\,e^x\,dx$. Enakost je pravilna, a novi integral ima višjo potenco $x$ kot prvotni, zato je težji. Izbira $u$ odloči, ali račun teče proti koncu ali stran od njega.
:::

**5. Skriti produkt.** Za $\int \ln x\,dx$ v tabeli ni pravila. Zapišemo ga kot $\int \ln x \cdot 1\,dx$ in izberemo $u = \ln x$, $v' = 1$. Potem je $u' = \frac{1}{x}$ in $v = x$:

$$\int \ln x\,dx = x \ln x - \int x \cdot \frac{1}{x}\,dx = x \ln x - x + C$$

**6. Dva koraka.** Pri $\int x^2\,e^x\,dx$ se $x^2$ po prvem koraku zmanjša v $2x$, novi integral $\int 2x\,e^x\,dx$ pa rešiš še enkrat per partes. Tako je v Primeru 4.

**7. Druga mamljiva bližnjica.** Pri ulomkih se ponuja: $\int \frac{dx}{x^2 - 1} = \ln\lvert x^2 - 1\rvert + C$ (napačno). Odvod desne strani je $\frac{2x}{x^2 - 1}$, ne $\frac{1}{x^2 - 1}$. Logaritem imenovalca dobiš le, ko je v števcu odvod imenovalca.

Popravilo je **razcep na parcialne ulomke**. Imenovalec razcepimo, $x^2 - 1 = (x - 1)(x + 1)$, in iščemo števili $A$ in $B$, da velja

$$\frac{1}{x^2 - 1} = \frac{A}{x - 1} + \frac{B}{x + 1}$$

Pomnožimo z $(x - 1)(x + 1)$ in dobimo $1 = A(x + 1) + B(x - 1)$. Pri $x = 1$ ostane $1 = 2A$, torej $A = \frac{1}{2}$. Pri $x = -1$ ostane $1 = -2B$, torej $B = -\frac{1}{2}$. Vsak parcialni ulomek integriramo v logaritem:

$$\int \frac{dx}{x^2 - 1} = \frac{1}{2} \ln\lvert x - 1\rvert - \frac{1}{2} \ln\lvert x + 1\rvert + C$$

Pomagaj si s tabelo; $k$ in $a$ sta realni števili:

| ulomek | primitivna funkcija |
|---|---|
| $\frac{1}{x - a}$ | $\ln\lvert x - a\rvert$ |
| $\frac{k}{x - a}$ | $k \ln\lvert x - a\rvert$ |
| $\frac{1}{a - x}$ | $-\ln\lvert a - x\rvert$ (pozor na minus) |

Minus v zadnji vrstici pride iz nove spremenljivke $t = a - x$, $dt = -dx$.

**8. Najprej deljenje.** Razcep zgoraj deluje, kadar je stopnja števca manjša od stopnje imenovalca.

:::premisli
Zakaj nastavek $\frac{A}{x - 1} + \frac{B}{x + 1}$ ne more biti enak $\frac{x^2 + 1}{x^2 - 1}$, ne glede na izbiro $A$ in $B$?
---
Za zelo velike $x$ gre vsota $\frac{A}{x - 1} + \frac{B}{x + 1}$ proti $0$, ulomek $\frac{x^2 + 1}{x^2 - 1}$ pa proti $1$. Pri enaki stopnji števca in imenovalca se v ulomku »skriva« celi del, ki ga najprej izločimo z deljenjem.
:::

Števec zapišemo kot $(x^2 - 1) + 2$, zato deljenje da $\frac{x^2 + 1}{x^2 - 1} = 1 + \frac{2}{x^2 - 1}$. Razcep ostanka je dvakratnik razcepa iz točke 7: $\frac{2}{x^2 - 1} = \frac{1}{x - 1} - \frac{1}{x + 1}$. Zato je

$$\int \frac{x^2 + 1}{x^2 - 1}\,dx = x + \ln\lvert x - 1\rvert - \ln\lvert x + 1\rvert + C$$

Ne glede na metodo velja isto kot prej: vsak rezultat preveriš z odvajanjem.

## Rešeni primeri

### Primer 1 (lažji): polinom krat sinus

Izračunaj $\int x \sin x\,dx$.

**Podatki:** integrand $x \sin x$
**Iščemo:** nedoločeni integral $\int x \sin x\,dx$

:::formula
$\int u\,v'\,dx = u\,v - \int u'\,v\,dx$
:::

**Rešitev:**

1. Izberemo $u = x$ (z odvajanjem postane $1$) in $v' = \sin x$.
2. Potem je $u' = 1$ in $v = -\cos x$, ker je $(-\cos x)' = \sin x$.
3. Vstavimo: $\int x \sin x\,dx = -x \cos x - \int (-\cos x)\,dx = -x \cos x + \int \cos x\,dx$.
4. Zadnji integral je v tabeli: $\int \cos x\,dx = \sin x + C$.
5. Preizkus: $(-x \cos x + \sin x)' = -\cos x + x \sin x + \cos x = x \sin x$.
6. Odgovor: $\int x \sin x\,dx = -x \cos x + \sin x + C$.

### Primer 2: ulomek z dvema linearnima faktorjema

Izračunaj $\int \frac{x + 5}{x^2 + x - 2}\,dx$.

**Podatki:** integrand $\frac{x + 5}{x^2 + x - 2}$; stopnja števca je $1$, stopnja imenovalca $2$
**Iščemo:** nedoločeni integral

:::formula
$\frac{x + 5}{(x - 1)(x + 2)} = \frac{A}{x - 1} + \frac{B}{x + 2}$, nato $\int \frac{k}{x - a}\,dx = k \ln\lvert x - a\rvert + C$
:::

**Rešitev:**

1. Deljenje ni potrebno, ker je stopnja števca manjša.
2. Razcep imenovalca: $x^2 + x - 2 = (x - 1)(x + 2)$, ker sta ničli $1$ in $-2$ (preizkus: $1 + 1 - 2 = 0$ in $4 - 2 - 2 = 0$).
3. Pomnožimo nastavek z imenovalcem: $x + 5 = A(x + 2) + B(x - 1)$.
4. Pri $x = 1$: $6 = 3A$, torej $A = 2$. Pri $x = -2$: $3 = -3B$, torej $B = -1$.
5. Integriramo po členih: $\int \frac{2}{x - 1}\,dx - \int \frac{1}{x + 2}\,dx = 2\ln\lvert x - 1\rvert - \ln\lvert x + 2\rvert + C$.
6. Preizkus: odvod je $\frac{2}{x - 1} - \frac{1}{x + 2}$; na skupnem imenovalcu je števec $2(x + 2) - (x - 1) = x + 5$.
7. Odgovor: $\int \frac{x + 5}{x^2 + x - 2}\,dx = 2\ln\lvert x - 1\rvert - \ln\lvert x + 2\rvert + C$.

### Primer 3 (težji): vzporednik na Mercatorjevi karti

Na Mercatorjevi karti, narisani v merilu globusa s polmerom $R = 10\,\mathrm{cm}$, je vzporednik z zemljepisno širino $\varphi$ oddaljen od ekvatorja $y = R \cdot F(\sin\varphi)$. Pri tem je $F$ tista primitivna funkcija za $\frac{1}{1 - s^2}$, za katero je $F(0) = 0$. Kako daleč od ekvatorja je na karti vzporednik $46^\circ$ (približno Ljubljana)? Primerjaj z dolžino loka od ekvatorja do tega vzporednika na globusu.

**Podatki:** $R = 10\,\mathrm{cm}$, $\varphi = 46^\circ$, $y = R \cdot F(\sin\varphi)$, $F'(s) = \frac{1}{1 - s^2}$, $F(0) = 0$
**Iščemo:** funkcijo $F$, razdaljo $y$ na karti, lok na globusu

:::formula
$\frac{1}{1 - s^2} = \frac{A}{1 - s} + \frac{B}{1 + s}$; $\int \frac{ds}{1 - s} = -\ln\lvert 1 - s\rvert + C$; lok $= R \cdot \varphi$ ($\varphi$ v radianih)
:::

**Rešitev:**

1. Imenovalec: $1 - s^2 = (1 - s)(1 + s)$.
2. Nastavek pomnožimo z imenovalcem: $1 = A(1 + s) + B(1 - s)$. Pri $s = 1$: $A = \frac{1}{2}$; pri $s = -1$: $B = \frac{1}{2}$.
3. Integriramo, pozorno pri minusu: $F(s) = -\frac{1}{2}\ln\lvert 1 - s\rvert + \frac{1}{2}\ln\lvert 1 + s\rvert + C$, kar združimo v $F(s) = \frac{1}{2}\ln\left\lvert\frac{1 + s}{1 - s}\right\rvert + C$.
4. Pogoj $F(0) = 0$: $\frac{1}{2}\ln 1 + C = C$, torej $C = 0$.
5. Vstavimo $s = \sin 46^\circ \approx 0{,}7193$; ulomek je $\frac{1 + \sin 46^\circ}{1 - \sin 46^\circ} \approx 6{,}126$.
6. Na karti: $y = 10\,\mathrm{cm} \cdot \frac{1}{2}\ln 6{,}126 \approx 9{,}06\,\mathrm{cm}$.
7. Na globusu: $46^\circ = \frac{46\pi}{180} \approx 0{,}8029$, lok $= 10\,\mathrm{cm} \cdot 0{,}8029 \approx 8{,}03\,\mathrm{cm}$.
8. Odgovor: vzporednik $46^\circ$ je na karti $9{,}06\,\mathrm{cm}$ od ekvatorja, na globusu pa le $8{,}03\,\mathrm{cm}$. Karta proti poloma vzporednike razmika, zato so Grenlandija in druga severna ozemlja na njej videti večja, kot so.

### Primer 4 – zdaj ti: dvakrat per partes

Izračunaj $\int x^2\,e^x\,dx$.

**Podatki:** integrand $x^2\,e^x$; od prej $\int x\,e^x\,dx = x\,e^x - e^x + C$
**Iščemo:** nedoločeni integral

:::formula
$\int u\,v'\,dx = u\,v - \int u'\,v\,dx$, dvakrat zapored
:::

**Rešitev:**

1. Izberemo $u = x^2$, $v' = e^x$, torej $u' = 2x$ in $v = e^x$.
2. $\int x^2\,e^x\,dx = x^2\,e^x - \int 2x\,e^x\,dx = x^2\,e^x - 2\int x\,e^x\,dx$.
3. Dokončaj sam: vstavi znani $\int x\,e^x\,dx$, pazi na oklepaj in rezultat preveri z odvajanjem.

:::premisli
Kaj dobiš?
---
$\int x^2\,e^x\,dx = x^2\,e^x - 2(x\,e^x - e^x) + C = (x^2 - 2x + 2)\,e^x + C$. Preizkus: odvod je $(2x - 2)\,e^x + (x^2 - 2x + 2)\,e^x = x^2\,e^x$. Kdor pozabi oklepaj, dobi $-2e^x$ namesto $+2e^x$ in preizkus ne uspe.
:::

## Pogoste napake

- **»Integral produkta je produkt integralov.«** $\int x\,e^x\,dx \ne \frac{x^2}{2}\,e^x$: odvod desne strani ima člen $\frac{x^2}{2}\,e^x$ preveč. Pri produktu uporabi per partes (ali novo spremenljivko, če je en faktor odvod notranje funkcije drugega).
- **Napačna izbira $u$.** Z $u = e^x$ in $v' = x$ se potenca $x$ poveča in novi integral je težji. Za $u$ izberi polinom ali $\ln x$, ker se z odvajanjem poenostavita.
- **Izgubljeni minusi.** Pri $v' = \sin x$ je $v = -\cos x$, ne $\cos x$. Pred novim integralom je minus, ki se pri dveh korakih razširi na cel oklepaj. In $\int \frac{dx}{1 - x} = -\ln\lvert 1 - x\rvert + C$, ker je odvod notranje funkcije $1 - x$ enak $-1$.
- **»Integral ulomka je logaritem imenovalca.«** $\int \frac{dx}{x^2 - 1}$ ni $\ln\lvert x^2 - 1\rvert + C$, ker v števcu ni odvoda $2x$. Najprej razcepi na parcialne ulomke, nato integriraj vsakega posebej.
- **Razcep brez deljenja.** Če je stopnja števca enaka ali večja od stopnje imenovalca, nastavek $\frac{A}{x - a} + \frac{B}{x - b}$ ne more uspeti. Najprej deli polinoma, nato razcepi ostanek.

## Povzetek

- Integral produkta ni produkt integralov; rezultat vedno preveri z odvajanjem.
- Per partes: $\int u\,v'\,dx = u\,v - \int u'\,v\,dx$; izhaja iz pravila za odvod produkta.
- Za $u$ izberi del, ki se z odvajanjem poenostavi (polinom, $\ln x$), za $v'$ del, ki ga znaš integrirati ($e^x$, $\sin x$, $\cos x$, tudi $1$).
- $\int x\,e^x\,dx = (x - 1)e^x + C$, $\int x \sin x\,dx = -x\cos x + \sin x + C$, $\int \ln x\,dx = x\ln x - x + C$; pri $x^2$ per partes dvakrat.
- Racionalna funkcija: če je stopnja števca vsaj tolikšna kot stopnja imenovalca, najprej deli; imenovalec razcepi na različne linearne faktorje; $\frac{A}{x - a} + \frac{B}{x - b}$; $A$ in $B$ dobiš z vstavljanjem ničel imenovalca.
- $\int \frac{k}{x - a}\,dx = k\ln\lvert x - a\rvert + C$, pri $\frac{1}{a - x}$ pa pride minus.

## Za maturo

### Naloga 1 (višja raven): krajša strukturirana naloga, 6 točk, pola 1 (brez računala)

Oba integrala izračunaj z integracijo per partes.

a) Izračunaj $\int (2x + 1)\,e^x\,dx$. (3 točke)

b) Izračunaj $\int x\ln x\,dx$ za $x > 0$. (3 točke)

**Rešitev:**

1. a) Izberemo $u = 2x + 1$, ker se z odvajanjem poenostavi, in $v' = e^x$. Potem je $u' = 2$ in $v = e^x$.
2. a) $\int (2x + 1)\,e^x\,dx = (2x + 1)\,e^x - \int 2e^x\,dx = (2x + 1)\,e^x - 2e^x + C = (2x - 1)\,e^x + C$.
3. a) Preizkus: $\bigl((2x - 1)\,e^x\bigr)' = 2e^x + (2x - 1)\,e^x = (2x + 1)\,e^x$.
4. b) Izberemo $u = \ln x$, ker se z odvajanjem poenostavi v $\frac{1}{x}$, in $v' = x$. Potem je $u' = \frac{1}{x}$ in $v = \frac{x^2}{2}$.
5. b) $\int x\ln x\,dx = \frac{x^2}{2}\ln x - \int \frac{x^2}{2} \cdot \frac{1}{x}\,dx = \frac{x^2}{2}\ln x - \int \frac{x}{2}\,dx$.
6. b) Ker je $\int \frac{x}{2}\,dx = \frac{x^2}{4}$, je $\int x\ln x\,dx = \frac{x^2}{2}\ln x - \frac{x^2}{4} + C$.
7. Odgovor: a) $\int (2x + 1)\,e^x\,dx = (2x - 1)\,e^x + C$; b) $\int x\ln x\,dx = \frac{x^2}{2}\ln x - \frac{x^2}{4} + C$.

**Točkovanje:** a) 1 točka za izbiro $u = 2x + 1$, $v' = e^x$ ter $u' = 2$, $v = e^x$, 1 točka za pravilno vstavljeno formulo per partes, 1 točka za rezultat s konstanto $C$; b) 1 točka za izbiro $u = \ln x$, $v' = x$ ter $u'$ in $v$, 1 točka za $\frac{x^2}{2}\ln x - \int \frac{x}{2}\,dx$, 1 točka za rezultat s konstanto $C$.

### Naloga 2 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dana je funkcija $f(x) = \dfrac{x^2 + x - 4}{x^2 - 2x - 3}$.

a) Zapiši definicijsko območje funkcije $f$ in pokaži, da je $f(x) = 1 + \dfrac{3x - 1}{x^2 - 2x - 3}$. (2 točki)

b) Ulomek $\dfrac{3x - 1}{x^2 - 2x - 3}$ razcepi na parcialne ulomke. (3 točke)

c) Izračunaj $\int f(x)\,dx$. (3 točke)

d) Na intervalu $(3, \infty)$ poišči tisto primitivno funkcijo $G$ funkcije $f$, za katero je $G(4) = 4$. (2 točki)

**Rešitev:**

1. a) Imenovalec razcepimo: $x^2 - 2x - 3 = (x - 3)(x + 1)$, zato je $D_f = \mathbb{R} \setminus \{-1, 3\}$.
2. a) Stopnji števca in imenovalca sta enaki, zato najprej delimo: $x^2 + x - 4 = (x^2 - 2x - 3) + (3x - 1)$, torej $f(x) = 1 + \dfrac{3x - 1}{x^2 - 2x - 3}$.
3. b) Nastavek $\dfrac{3x - 1}{(x - 3)(x + 1)} = \dfrac{A}{x - 3} + \dfrac{B}{x + 1}$ pomnožimo z imenovalcem: $3x - 1 = A(x + 1) + B(x - 3)$.
4. b) Pri $x = 3$: $8 = 4A$, torej $A = 2$. Pri $x = -1$: $-4 = -4B$, torej $B = 1$.
5. b) $\dfrac{3x - 1}{x^2 - 2x - 3} = \dfrac{2}{x - 3} + \dfrac{1}{x + 1}$.
6. c) $\int f(x)\,dx = \int \left(1 + \dfrac{2}{x - 3} + \dfrac{1}{x + 1}\right) dx = x + 2\ln\lvert x - 3\rvert + \ln\lvert x + 1\rvert + C$.
7. d) Na intervalu $(3, \infty)$ sta $x - 3$ in $x + 1$ pozitivna, zato je $G(x) = x + 2\ln(x - 3) + \ln(x + 1) + C$.
8. d) $G(4) = 4 + 2\ln 1 + \ln 5 + C = 4 + \ln 5 + C$; iz $G(4) = 4$ sledi $C = -\ln 5$.
9. Odgovor: a) $D_f = \mathbb{R} \setminus \{-1, 3\}$; b) $\dfrac{2}{x - 3} + \dfrac{1}{x + 1}$; c) $x + 2\ln\lvert x - 3\rvert + \ln\lvert x + 1\rvert + C$; d) $G(x) = x + 2\ln(x - 3) + \ln(x + 1) - \ln 5$.

**Točkovanje:** a) 1 točka za razcep imenovalca in definicijsko območje, 1 točka za deljenje; b) 1 točka za nastavek in enačbo $3x - 1 = A(x + 1) + B(x - 3)$, 1 točka za $A = 2$, 1 točka za $B = 1$; c) 1 točka za člen $x$, 1 točka za $2\ln\lvert x - 3\rvert$, 1 točka za $\ln\lvert x + 1\rvert$ in konstanto $C$; d) 1 točka za $G(4) = 4 + \ln 5 + C$, 1 točka za $C = -\ln 5$ in zapis funkcije $G$.

### Ustno vprašanje 1

:::premisli
(višja raven) Izpelji formulo za integracijo per partes in pojasni, kako izbereš funkcijo $u$.
---
Izhajamo iz pravila za odvod produkta $(uv)' = u'v + uv'$. Ko obe strani integriramo, dobimo $uv = \int u'v\,dx + \int uv'\,dx$, od koder izrazimo $\int uv'\,dx = uv - \int u'v\,dx$. Za $u$ izberemo faktor, ki se z odvajanjem poenostavi, na primer polinom ali $\ln x$. Za $v'$ izberemo faktor, ki ga znamo integrirati, na primer $e^x$, $\sin x$ ali $\cos x$. Izbira je dobra, če je novi integral $\int u'v\,dx$ lažji od prvotnega.
:::

### Ustno vprašanje 2

:::premisli
(višja raven) Opiši postopek integriranja racionalne funkcije z razcepom na parcialne ulomke in ga pokaži na integralu $\int \frac{dx}{x(x + 1)}$.
---
Če stopnja števca ni manjša od stopnje imenovalca, najprej delimo polinoma in razcepimo le ostanek. Imenovalec razcepimo na linearne faktorje; če sta to različna faktorja $x - a$ in $x - b$, ulomek zapišemo kot vsoto parcialnih ulomkov $\frac{A}{x - a} + \frac{B}{x - b}$. Koeficienta $A$ in $B$ dobimo, ko enakost pomnožimo z imenovalcem in vstavimo ničli imenovalca. Pri $\frac{1}{x(x + 1)}$ dobimo $1 = A(x + 1) + Bx$, torej $A = 1$ in $B = -1$. Vsak parcialni ulomek integriramo v logaritem: $\int \frac{dx}{x(x + 1)} = \ln\lvert x\rvert - \ln\lvert x + 1\rvert + C$.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Navedi primer integrala, ki ga izračunamo s per partes, čeprav integrand ni zapisan kot produkt, in pojasni postopek.
---
Tak primer je $\int \ln x\,dx$ za $x > 0$, ki ga zapišemo kot $\int \ln x \cdot 1\,dx$. Izberemo $u = \ln x$ in $v' = 1$, zato je $u' = \frac{1}{x}$ in $v = x$. Po formuli per partes je $\int \ln x\,dx = x\ln x - \int x \cdot \frac{1}{x}\,dx = x\ln x - x + C$.
:::

## Drugače: Kot zgodba

Popotnica pride na mejo z bankovcem, ki ga v novi državi nihče ne sprejme: to je integral $\int u\,v'\,dx$. V menjalnici »per partes« dobi dvoje: gotovino $u\,v$, ki jo lahko porabi takoj, in nov bankovec $\int u'\,v\,dx$. Menjava se splača le, če je novi bankovec lažje porabiti od starega.

Pri $\int x\,e^x\,dx$ menjalnica vzame $x$ in vrne $1$; z $e^x$ ni težav, saj se pri integriranju ne spremeni. Nov bankovec $\int e^x\,dx$ sprejmejo povsod. Pri $\int x^2\,e^x\,dx$ mora menjati dvakrat: $x^2$ postane $2x$, nato $2$. Kdor pa v menjalnico prinese napačni del ($u = e^x$), dobi nazaj $\frac{x^2}{2}$, bankovec, ki je težji od prvega.

Pri $\int \ln x\,dx$ popotnica sploh nima para. Menjalničar ji posodi nevidni $1$, ki postane $x$, in $\ln x$ se spremeni v $\frac{1}{x}$. Skupaj dasta $1$, najlažji bankovec od vseh.

## Drugače: Korak za korakom s številkami

Vsak rezultat lahko preveriš tudi s števili, brez simbolnega odvajanja.

1. Trdimo, da je $F(x) = (x - 1)\,e^x$ primitivna funkcija za $f(x) = x\,e^x$. Potem mora biti naklon $F$ pri $x = 1$ enak $f(1) = e \approx 2{,}718$.
2. Izračunamo $F$ malo levo in desno: $F(1{,}01) = 0{,}01 \cdot e^{1{,}01} \approx 0{,}02746$, $F(0{,}99) = -0{,}01 \cdot e^{0{,}99} \approx -0{,}02691$.
3. Naklon sekante: $\frac{0{,}02746 + 0{,}02691}{0{,}02} \approx 2{,}72$. To se ujema z $e$.
4. Razcep iz Primera 2 preverimo pri $x = 3$. Levo: $\frac{3 + 5}{9 + 3 - 2} = \frac{8}{10} = 0{,}8$.
5. Desno: $\frac{2}{3 - 1} - \frac{1}{3 + 2} = 1 - 0{,}2 = 0{,}8$. Vrednosti se ujemata.
6. Če se pri preizkusu števili ne ujemata, je napaka v $A$, $B$ ali v predznaku.

## Preveri se

? Razvrsti korake integriranja racionalne funkcije z različnimi linearnimi faktorji v imenovalcu.
1. Primerjaj stopnji števca in imenovalca; če števec nima manjše stopnje, deli polinoma.
2. Imenovalec razcepi na linearne faktorje.
3. Zapiši nastavek s parcialnimi ulomki in določi $A$ in $B$.
4. Vsak parcialni ulomek integriraj v logaritem.
5. Rezultat preveri z odvajanjem.
> Deljenje je prvo, ker nastavek deluje le pri manjši stopnji števca. Razcep imenovalca določi nastavek, iz koeficientov dobiš logaritme, preizkus pa ujame napake v predznaku.

? Trije od teh integralov se rešijo s per partes, en ne (zanj zadošča nova spremenljivka). Kateri je izjema?
- $\int x\,e^x\,dx$
~ To je tipičen per partes: $u = x$ se z odvajanjem poenostavi v $1$.
- $\int \ln x\,dx$
~ Produkta ne vidiš, a je skrit: $\ln x \cdot 1$ z $u = \ln x$ in $v' = 1$.
+ $\int 2x\,e^{x^2}\,dx$
- $\int x^2 \cos x\,dx$
~ Potrebuje dva koraka per partes ($x^2 \to 2x \to 2$), a je še vedno per partes.
> Pri $\int 2x\,e^{x^2}\,dx$ je $2x$ odvod notranje funkcije $x^2$. Z $t = x^2$, $dt = 2x\,dx$ dobiš $\int e^t\,dt = e^{x^2} + C$.

? (brez računala) Velja $\frac{3x + 1}{(x - 1)(x + 1)} = \frac{A}{x - 1} + \frac{B}{x + 1}$. Koliko je $A$?
= 2
~ 1 | To je $B$: pri $x = -1$ dobiš $-2 = -2B$. Za $A$ vstavi $x = 1$.
~ 4 | To je samo števec pri $x = 1$. Iz $3x + 1 = A(x + 1) + B(x - 1)$ pri $x = 1$ sledi $4 = 2A$.
> Pomnožimo z imenovalcem: $3x + 1 = A(x + 1) + B(x - 1)$. Pri $x = 1$ je $4 = 2A$, torej $A = 2$ (in pri $x = -1$ je $B = 1$).

? Pri $\int x\,e^x\,dx$ nekdo izbere $u = e^x$ in $v' = x$. Kaj je posledica te izbire?
- Rezultat je napačen, $\frac{x^2}{2}\,e^x + C$.
~ To je bližnjica »produkt integralov«. Formula per partes da pravilno enakost pri vsaki izbiri; vprašanje je le, ali je novi integral lažji.
+ Novi integral $\int \frac{x^2}{2}\,e^x\,dx$ je težji od prvotnega, zato račun ne pride do konca.
- Račun je krajši, ker je $e^x$ sam svoj odvod.
~ $e^x$ se pri odvajanju res ne spremeni, a $x$ se pri integriranju poveča v $\frac{x^2}{2}$. Integral postane težji, ne lažji.
> Per partes se splača, ko se $u$ z odvajanjem poenostavi. Pri $u = x$ dobiš $u' = 1$ in lahek integral $\int e^x\,dx$.

? Dijak je izračunal $\int \frac{2}{1 - x^2}\,dx$ v štirih korakih. Vpiši številko koraka, v katerem je napaka.

| korak | zapis |
|---|---|
| 1 | $1 - x^2 = (1 - x)(1 + x)$ |
| 2 | $\frac{2}{1 - x^2} = \frac{1}{1 - x} + \frac{1}{1 + x}$ |
| 3 | $\int \frac{dx}{1 - x} = \ln\lvert 1 - x\rvert + C$ |
| 4 | vsota: $\ln\lvert 1 - x\rvert + \ln\lvert 1 + x\rvert + C$ |

= 3
~ 2 | Korak 2 je pravilen: na skupnem imenovalcu je števec $(1 + x) + (1 - x) = 2$.
~ 4 | Korak 4 le sešteje, kar je dobil prej. Napaka nastane že pri integriranju posameznega ulomka.
> Odvod $\ln\lvert 1 - x\rvert$ je $\frac{-1}{1 - x}$, zato je $\int \frac{dx}{1 - x} = -\ln\lvert 1 - x\rvert + C$. Pravilni rezultat je $\ln\lvert 1 + x\rvert - \ln\lvert 1 - x\rvert + C$.

<<RACUN
odvod: x^2/2*exp(x) | x | x*exp(x)+x^2/2*exp(x)
integral: x*exp(x) | x | x*exp(x)-exp(x)
odvod: x*exp(x)-exp(x) | x | x*exp(x)
integral: ln(x) | x | x*ln(x)-x
odvod: x*ln(x)-x | x | ln(x)
odvod: ln(x^2-1) | x | 2*x/(x^2-1)
enako: 1/(x^2-1) | (1/2)/(x-1)-(1/2)/(x+1)
odvod: (1/2)*ln(x-1)-(1/2)*ln(x+1) | x | 1/(x^2-1)
enako: (x^2+1)/(x^2-1) | 1+1/(x-1)-1/(x+1)
odvod: x+ln(x-1)-ln(x+1) | x | (x^2+1)/(x^2-1)
integral: x*sin(x) | x | -x*cos(x)+sin(x)
odvod: -x*cos(x)+sin(x) | x | x*sin(x)
enako: (x+5)/(x^2+x-2) | 2/(x-1)-1/(x+2)
odvod: 2*ln(x-1)-ln(x+2) | x | (x+5)/(x^2+x-2)
enako: 1/(1-s^2) | (1/2)/(1-s)+(1/2)/(1+s)
odvod: (1/2)*ln((1+s)/(1-s)) | s | 1/(1-s^2)
vrednost: 10*(1/2)*ln((1+sin(46°))/(1-sin(46°))) | 9.06
vrednost: 10*46*pi/180 | 8.03
integral: x^2*exp(x) | x | (x^2-2*x+2)*exp(x)
odvod: (x^2-2*x+2)*exp(x) | x | x^2*exp(x)
integral: 2*x*exp(x^2) | x | exp(x^2)
enako: (3*x+1)/((x-1)*(x+1)) | 2/(x-1)+1/(x+1)
enako: 2/(1-x^2) | 1/(1-x)+1/(1+x)
odvod: ln(1+x)-ln(1-x) | x | 2/(1-x^2)
integral: (2*x+1)*exp(x) | x | (2*x-1)*exp(x)
odvod: (2*x-1)*exp(x) | x | (2*x+1)*exp(x)
integral: x*ln(x) | x | x^2/2*ln(x)-x^2/4
enako: x^2+x-4 | (x^2-2*x-3)+(3*x-1)
enako: (x^2+x-4)/(x^2-2*x-3) | 1+(3*x-1)/(x^2-2*x-3)
enako: (3*x-1)/(x^2-2*x-3) | 2/(x-3)+1/(x+1)
integral: (x^2+x-4)/(x^2-2*x-3) | x | x+2*ln(x-3)+ln(x+1)
vrednost: 4+2*ln(4-3)+ln(4+1)-ln(5) | 4
enako: 1/(x*(x+1)) | 1/x-1/(x+1)
integral: 1/(x*(x+1)) | x | ln(x)-ln(x+1)
>>

:::simboli
u | prvi faktor (ki ga odvajamo) | | | izberi del, ki se z odvajanjem poenostavi
v | primitivna funkcija drugega faktorja | v = \int v'\,dx | | 
u' | odvod funkcije $u$ | | | 
v' | drugi faktor (ki ga integriramo) | | | 
x | spremenljivka integracije | | | 
d | oznaka diferenciala v $dx$ in $ds$ | | | 
e | Eulerjevo število | | – | $e \approx 2{,}718$
C | integracijska konstanta | | | poljubno realno število
A, B | koeficienta parcialnih ulomkov | | | dobiš ju z vstavljanjem ničel imenovalca
k | konstanta v števcu parcialnega ulomka | | | 
a | ničla imenovalca | | | 
R | polmer globusa v merilu karte | | cm | 
\varphi | zemljepisna širina | | ° | 
y | razdalja vzporednika od ekvatorja na karti | y = R \cdot F(\sin\varphi) | cm | 
F | primitivna funkcija za $\frac{1}{1 - s^2}$ | F(s) = \frac{1}{2}\ln\left\lvert\frac{1 + s}{1 - s}\right\rvert | | $F(0) = 0$
s | sinus zemljepisne širine | s = \sin\varphi | – | 
:::
