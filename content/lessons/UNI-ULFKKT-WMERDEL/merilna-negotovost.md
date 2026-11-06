---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Do sredine sedemdesetih let 20. stoletja so čas v šprintu na 100 m merili ročno. Ob cilju je stalo več časomerilcev s štoparicami. Za istega tekača so pogosto ustavili različne čase, zato so rezultat zaokrožili na desetinko sekunde.

Ko so uvedli elektronsko merjenje, se je pokazala še druga težava. Ročni časi niso bili le razpršeni, ampak so bili praviloma tudi *prekratki*. Časomerilec je štoparico sprožil šele, ko je zagledal blisk pištole, ustavil pa jo je pogosto malo prezgodaj, ko je pričakoval prihod tekača. Od leta 1977 svetovna atletska zveza rekorde v šprintu priznava le z elektronskim merjenjem.

V tej zgodbi sta skrita oba pojma, ki ju potrebuje vsak merilec: **raztros** ponovljenih meritev in **sistematični zamik** celotnega merilnika. Podobno težavo so imeli meroslovni laboratoriji: isto količino so izmerili vsak po svoje in negotovost poročali na različne načine. Zato je leta 1993 izšel mednarodni *Vodnik za izražanje merilne negotovosti* (GUM). Po njem danes poročajo tudi meritve hrupa, prahu in mikroklime na delovnem mestu.

Tam je ocena negotovosti odločilna. Raven hrupa $84\,\mathrm{dB}$ ali $86\,\mathrm{dB}$ odloča, ali je zgornja opozorilna vrednost $85\,\mathrm{dB}$ presežena in mora delodajalec izvesti program tehničnih in organizacijskih ukrepov. Rezultat brez negotovosti zato ni uporaben.

## Razlaga

**1. Oblak meritev na številski premici.** Trener isti posnetek teka petkrat izmeri z ročno štoparico. Dobi $11{,}32$; $11{,}18$; $11{,}25$; $11{,}41$ in $11{,}24\,\mathrm{s}$. Vrišimo jih na premico (en znak je $0{,}01\,\mathrm{s}$):

```
11,1      11,2      11,3      11,4      11,5  t [s]
|---------|---------|---------|---------|
        •     ••      •        •
                  ▲ povprečje 11,28
         [-----------------]  povprečje ± s
```

Točke tvorijo oblak. Njegova sredina je **povprečje** $\bar{x}$, njegova širina pa je **raztros**. Raztros meri **standardni odmik** $s$: približno dve tretjini meritev leži znotraj pasu $\bar{x} \pm s$.

**2. Ponovljivost.** Če isti merilec z istim merilnikom po istem postopku v kratkem času ponavlja meritev, je raztros mera za **ponovljivost**. Ožji oblak pomeni boljšo ponovljivost. Kadar meritve ponovijo drugi merilci, z drugimi merilniki ali drug dan, govorimo o **obnovljivosti**. Raztros je takrat običajno večji.

Povprečje več meritev je zanesljivejše od ene same. Natančno to pove izrek.

**Izrek (negotovost povprečja).** Naj bodo $X_1, \dots, X_n$ neodvisne slučajne spremenljivke z enakim pričakovanjem $\mu$ in enako disperzijo $\sigma^2$. Potem ima povprečje $\bar{X}$ pričakovanje $\mu$ in standardni odmik $\sigma/\sqrt{n}$.

*Dokaz.* Pričakovanje je linearno: $E(\bar{X}) = \frac{1}{n}\sum E(X_i) = \mu$. Disperzije neodvisnih spremenljivk se seštevajo, konstanta pa pride iz disperzije v kvadratu: $D(\bar{X}) = \frac{1}{n^2}\sum D(X_i) = \frac{\sigma^2}{n}$. Korenimo. ∎

Ker $\sigma$ ne poznamo, jo ocenimo s $s$ (formula je v točki 6). Imenovalec $n - 1$ tam popravi to, da smo $\bar{x}$ izračunali iz istih podatkov; tako $s^2$ v povprečju zadene $\sigma^2$ (je nepristranska cenilka). Negotovost povprečja je zato $s/\sqrt{n}$. Pogoj neodvisnosti je bistven: zamik, skupen vsem meritvam, se s povprečenjem ne zmanjša.

:::premisli
Trener želi negotovost povprečja razpoloviti. Koliko meritev mora opraviti namesto 5 in kaj se pri tem zgodi s širino oblaka $s$?
---
Širina oblaka ostane približno enaka, saj je to lastnost štoparice in trenerjeve roke. Negotovost povprečja pa se deli z $\sqrt{n}$, zato je pri 20 meritvah približno pol manjša kot pri 5: štirikrat več meritev za pol manjšo negotovost.
:::

**3. Kalibracija premakne cel oblak.** Ponavljanje ne pokaže, ali je oblak na pravem mestu. Štoparica, ki vedno zamudi $0{,}1\,\mathrm{s}$, da lep, ozek oblak, a zamaknjen. Tak stalen zamik je **sistematični pogrešek**: tisti del merilnega pogreška (razlike med izmerjeno in pravo vrednostjo), ki pri ponovljenih meritvah ostane enak ali se spreminja predvidljivo. Del, ki se od meritve do meritve nepredvidljivo spreminja, je **naključni pogrešek**.

Sistematični pogrešek odkrije le **kalibracija**: primerjava merilnika z **etalonom**, to je virom z znano vrednostjo in znano negotovostjo. Merilnik hrupa na primer priključimo na zvočni kalibrator, ki daje natanko $94{,}0\,\mathrm{dB}$. Če merilnik pokaže $94{,}4\,\mathrm{dB}$, sedi njegov oblak $0{,}4\,\mathrm{dB}$ desno od prave vrednosti. **Popravek** je razlika med referenco in odčitkom, tu $-0{,}4\,\mathrm{dB}$. Prištejemo ga vsem nadaljnjim odčitkom.

:::premisli
Štoparica vedno zamudi $0{,}1\,\mathrm{s}$. Trener opravi sto meritev namesto petih. Ali je povprečje zdaj bližje pravemu času?
---
Ne. Ponovitve zmanjšajo negotovost povprečja, a vse nosijo isti zamik. Povprečje je zdaj zelo natančno določeno, a še vedno zamaknjeno za $0{,}1\,\mathrm{s}$. Zamik vidiš šele, ko merilnik primerjaš z znano vrednostjo.
:::

**4. Dve poti do negotovosti.** **Standardna negotovost** $u(x)$ je negotovost rezultata $x$, izražena kot standardni odmik porazdelitve vrednosti, ki jih količini še smemo pripisati. Prispevek, ki ga ocenimo iz raztrosa ponovljenih meritev, je **ocena tipa A**. Prispevek iz drugih podatkov, na primer iz kalibracijskega lista, tolerance proizvajalca ali ločljivosti prikazovalnika, je **ocena tipa B**. Kadar je znana le meja $\pm a$, znotraj katere je vsaka vrednost enako verjetna (**pravokotna** ali enakomerna porazdelitev), je standardna negotovost $a/\sqrt{3}$.

*Izpeljava.* Naj bo $X$ enakomerno porazdeljena na $[\mu - a, \mu + a]$; gostota je tam $1/(2a)$. S $t = x - \mu$ je $D(X) = \int_{-a}^{a} \frac{t^2}{2a}\,\mathrm{d}t = \frac{1}{2a} \cdot \frac{2a^3}{3} = \frac{a^2}{3}$, torej $u = a/\sqrt{3}$. Ločljivost prikazovalnika $\delta$ da mejo $a = \delta/2$ in prispevek $\delta/(2\sqrt{3})$.

**5. Proračun negotovosti.** Vse prispevke zberemo v tabelo, imenovano **proračun negotovosti**. Vrednosti so iz meritve hrupa v primeru 3:

| vir | tip | $u$ [dB] |
|---|---|---|
| ponovljivost | A | $0{,}33$ |
| kalibrator | B | $0{,}17$ |
| merilnik | B | $0{,}70$ |

Neodvisni prispevki se ne seštevajo naravnost: seštejemo njihove kvadrate in vsoto korenimo. Velik prispevek zato prevlada, majhni skoraj ne vplivajo. Dobimo **kombinirano standardno negotovost** $u_c$. Splošno pravilo je zakon razširjanja negotovosti.

**Izrek (zakon razširjanja negotovosti).** Naj bo rezultat $y = f(x_1, \dots, x_N)$, kjer je $f$ odvedljiva, vhodne količine $x_i$ so med seboj neodvisne in njihove negotovosti $u(x_i)$ tako majhne, da je $f$ na tem območju približno linearna. Potem je v linearnem približku $u_c^2(y) = \sum_i c_i^2\, u^2(x_i)$ s koeficienti občutljivosti $c_i = \partial f / \partial x_i$, izračunanimi v točki najboljših ocen vhodov.

*Dokaz.* Taylorjev razvoj prvega reda da $y - y_0 \approx \sum_i c_i (x_i - x_{i,0})$, torej linearno kombinacijo neodvisnih slučajnih spremenljivk. Za tako kombinacijo velja $D\big(\sum c_i X_i\big) = \sum c_i^2 D(X_i)$, ker so kovariance enake 0. ∎

Pri vsoti popravkov so vsi $c_i = 1$, zato seštejemo kvadrate. Pri produktu ali kvocientu, na primer $y = x_1/(x_2 x_3)$, je $c_1 = y/x_1$, $c_2 = -y/x_2$, $c_3 = -y/x_3$. Ko enačbo delimo z $y^2$, se seštevajo kvadrati **relativnih** negotovosti: $(u_c/y)^2 = \sum (u_i/x_i)^2$. Če vhoda $x_i$ in $x_j$ nista neodvisna, dobimo za vsak tak par ($i < j$) še člen $2 c_i c_j\, r_{ij}\, u_i u_j$ s korelacijskim koeficientom $r_{ij}$.

Kombinirano negotovost pomnožimo s **faktorjem pokritja** $k$, običajno $k = 2$, in dobimo **razširjeno negotovost** $U$. Interval $\bar{x} \pm U$ zajame pravo vrednost s približno $95\,\%$ verjetnostjo, če je porazdelitev rezultata približno normalna in ocena $u_c$ temelji na dovolj podatkih.

**6. Simboli na koncu.** Vse zgornje slike zapišemo z enačbami:

$$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}$$

$$s = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n - 1}}$$

$$u_A = \frac{s}{\sqrt{n}} \qquad u_B = \frac{a}{\sqrt{3}}$$

$$u_c = \sqrt{u_1^2 + u_2^2 + u_3^2}$$

$$u_c^2(y) = \sum_i c_i^2\, u^2(x_i)$$

$$U = k \cdot u_c$$

**7. Poročilo o meritvah.** Rezultat brez konteksta ni preverljiv. Poročilo zato vsebuje:

- merjeno količino, mesto, datum in pogoje (delovni proces, temperatura, trajanje),
- merilnik, njegovo serijsko številko, datum kalibracije in uporabljeni popravek,
- postopek ali standard in število ponovitev,
- rezultat v obliki $\bar{x} \pm U$ z enoto in navedenim $k$,
- primerjavo z mejno vrednostjo, ki upošteva negotovost.

$U$ zaokrožimo na eno ali dve veljavni mesti, rezultat pa na isto decimalno mesto kot $U$.

## Rešeni primeri

### Primer 1: ponovljivost ročne štoparice

Trener petkrat izmeri čas istega teka na posnetku: $11{,}32$; $11{,}18$; $11{,}25$; $11{,}41$ in $11{,}24\,\mathrm{s}$. Določi povprečje, standardni odmik in negotovost povprečja.

**Podatki:** $n = 5$; $x_i$: $11{,}32$; $11{,}18$; $11{,}25$; $11{,}41$; $11{,}24\,\mathrm{s}$
**Iščemo:** $\bar{x}$, $s$ in $u_A$

:::formula
$\bar{x} = \dfrac{\sum x_i}{n}$, $\quad s = \sqrt{\dfrac{\sum (x_i - \bar{x})^2}{n - 1}}$, $\quad u_A = \dfrac{s}{\sqrt{n}}$
:::

**Rešitev:**

1. Vsota je $56{,}40\,\mathrm{s}$, zato $\bar{x} = 56{,}40 / 5 = 11{,}28\,\mathrm{s}$.
2. Odmiki od povprečja so $0{,}04$; $-0{,}10$; $-0{,}03$; $0{,}13$ in $-0{,}04\,\mathrm{s}$. Njihovi kvadrati dajo vsoto $0{,}031\,\mathrm{s^2}$.
3. Delimo z $n - 1 = 4$, ker smo povprečje izračunali iz istih podatkov: $s = \sqrt{0{,}031 / 4} \approx 0{,}088\,\mathrm{s}$.
4. Negotovost povprečja: $u_A = 0{,}088 / \sqrt{5} \approx 0{,}039\,\mathrm{s}$.
5. Odgovor: povprečni čas je $11{,}28\,\mathrm{s}$, posamezna meritev raztrosi za približno $0{,}09\,\mathrm{s}$, standardna negotovost povprečja pa je približno $0{,}04\,\mathrm{s}$.

### Primer 2: popravek iz kalibracije

Pred meritvijo hrupa merilnik priključimo na kalibrator z ravnijo $94{,}0\,\mathrm{dB}$. Merilnik pokaže $94{,}4\,\mathrm{dB}$. Na delovnem mestu nato odčitamo $87{,}6\,\mathrm{dB}$. Proizvajalec za kalibrator navaja toleranco $\pm 0{,}3\,\mathrm{dB}$. Določi popravljeno raven in prispevek kalibratorja k negotovosti.

**Podatki:** $L_\mathrm{ref} = 94{,}0\,\mathrm{dB}$, $L_\mathrm{kal} = 94{,}4\,\mathrm{dB}$, $L_\mathrm{odč} = 87{,}6\,\mathrm{dB}$, $a = 0{,}3\,\mathrm{dB}$
**Iščemo:** popravek $K$, popravljeno raven $L$ in $u_B$

:::formula
$K = L_\mathrm{ref} - L_\mathrm{kal}$, $\quad L = L_\mathrm{odč} + K$, $\quad u_B = \dfrac{a}{\sqrt{3}}$
:::

**Rešitev:**

1. Popravek: $K = 94{,}0 - 94{,}4 = -0{,}4\,\mathrm{dB}$. Merilnik kaže preveč, zato je popravek negativen.
2. Popravljena raven: $L = 87{,}6 - 0{,}4 = 87{,}2\,\mathrm{dB}$.
3. Toleranca pove le mejo, zato uporabimo pravokotno porazdelitev: $u_B = 0{,}3 / \sqrt{3} \approx 0{,}17\,\mathrm{dB}$.
4. Odgovor: popravljena raven je $87{,}2\,\mathrm{dB}$, kalibrator prispeva standardno negotovost približno $0{,}17\,\mathrm{dB}$.

### Primer 3: od proračuna do poročila

Na delovnem mestu ob stiskalnici opravimo šest meritev ravni hrupa. Po popravku je povprečje $83{,}9\,\mathrm{dB}$, standardni odmik pa $0{,}8\,\mathrm{dB}$. Kalibrator ima toleranco $\pm 0{,}3\,\mathrm{dB}$ (pravokotna porazdelitev), merilnik sam prispeva standardno negotovost $0{,}70\,\mathrm{dB}$. (a) Zapiši rezultat za poročilo ($k = 2$). (b) Ali lahko trdimo, da je hrup pod zgornjo opozorilno vrednostjo $85\,\mathrm{dB}$? Do katerega povprečja bi to lahko trdili pri enaki negotovosti? (c) Kolikšna bi smela biti največ standardna negotovost merilnika, da bi pri izmerjenem povprečju skladnost lahko potrdili?

**Podatki:** $n = 6$, $\bar{x} = 83{,}9\,\mathrm{dB}$, $s = 0{,}8\,\mathrm{dB}$, $a_\mathrm{kal} = 0{,}3\,\mathrm{dB}$, $u_\mathrm{m} = 0{,}70\,\mathrm{dB}$, $k = 2$, opozorilna vrednost $85\,\mathrm{dB}$
**Iščemo:** $\bar{x} \pm U$, odločitev, največje dopustno povprečje in največji $u_\mathrm{m}$

:::formula
$u_A = \dfrac{s}{\sqrt{n}}$, $\quad u_\mathrm{kal} = \dfrac{a_\mathrm{kal}}{\sqrt{3}}$

$u_c = \sqrt{u_A^2 + u_\mathrm{kal}^2 + u_\mathrm{m}^2}$, $\quad U = k \cdot u_c$
:::

**Rešitev:**

1. Tip A: $u_A = 0{,}8 / \sqrt{6} \approx 0{,}33\,\mathrm{dB}$. Tip B za kalibrator: $u_\mathrm{kal} = 0{,}3 / \sqrt{3} \approx 0{,}17\,\mathrm{dB}$.
2. Kombinirana negotovost (vsi popravki se seštevajo, zato $c_i = 1$): $u_c = \sqrt{0{,}33^2 + 0{,}17^2 + 0{,}70^2} \approx 0{,}79\,\mathrm{dB}$. Prevlada merilnik.
3. Razširjena: $U = 2 \cdot 0{,}79 = 1{,}58\,\mathrm{dB}$, zaokroženo $1{,}6\,\mathrm{dB}$.
4. V poročilo zapišemo $L = (83{,}9 \pm 1{,}6)\,\mathrm{dB}$, $k = 2$. Interval sega od $82{,}3$ do $85{,}5\,\mathrm{dB}$.
5. Interval vsebuje $85\,\mathrm{dB}$, zato ne moremo trditi, da je hrup pod opozorilno vrednostjo.
6. Zgornji rob intervala mora ležati pod mejo: $\bar{x} + 1{,}6 < 85$, torej $\bar{x} < 85 - 1{,}6 = 83{,}4\,\mathrm{dB}$.
7. Pri $\bar{x} = 83{,}9\,\mathrm{dB}$ mora veljati $U < 85 - 83{,}9 = 1{,}1\,\mathrm{dB}$, torej $u_c < 1{,}1 / 2 = 0{,}55\,\mathrm{dB}$.
8. Iz $u_A^2 + u_\mathrm{kal}^2 + u_\mathrm{m}^2 < 0{,}55^2$ sledi $u_\mathrm{m} < \sqrt{0{,}55^2 - 0{,}33^2 - 0{,}17^2} \approx 0{,}41\,\mathrm{dB}$.
9. Odgovor: rezultat je $(83{,}9 \pm 1{,}6)\,\mathrm{dB}$, $k = 2$; skladnosti z opozorilno vrednostjo ne moremo potrditi. Potrdili bi jo lahko pri povprečju pod $83{,}4\,\mathrm{dB}$ ali z merilnikom, katerega standardna negotovost je pod približno $0{,}41\,\mathrm{dB}$.

:::premisli
Ali bi skladnost potrdili, če bi namesto 6 opravili 12 meritev?
---
Ne. $u_A = 0{,}8/\sqrt{12} \approx 0{,}23\,\mathrm{dB}$, $u_c = \sqrt{0{,}23^2 + 0{,}17^2 + 0{,}70^2} \approx 0{,}76\,\mathrm{dB}$ in $U \approx 1{,}5\,\mathrm{dB}$. Interval še vedno sega do $85{,}4\,\mathrm{dB}$, ker prevlada merilnik, ne ponovljivost.
:::

## Pogoste napake

- **»Več ponovitev odpravi vsako napako.«** Ponovitve zmanjšajo le naključni del. Zamaknjen merilnik ostane zamaknjen, zato ga je treba kalibrirati in upoštevati popravek.
- **Standardni odmik namesto negotovosti povprečja.** Kdor za negotovost povprečja vzame kar $s$, pozabi, da je povprečje zanesljivejše od posamezne meritve. Pravilno je $u_A = s/\sqrt{n}$. Velja tudi obratno: $u_A$ ni raztros posameznih meritev.
- **Seštevanje naravnost.** $0{,}33 + 0{,}17 + 0{,}70 = 1{,}20\,\mathrm{dB}$ precenjuje negotovost, saj neodvisni prispevki redko vsi hkrati kažejo v isto smer. Seštevamo kvadrate in korenimo.
- **Toleranca kot standardna negotovost.** Meja $\pm a$ ni standardna negotovost. Pri enakomerni porazdelitvi jo delimo s $\sqrt{3}$.
- **Odločanje samo po povprečju.** Povprečje $83{,}9\,\mathrm{dB}$ je pod $85\,\mathrm{dB}$, a interval $\pm U$ mejo prečka. Poročilo mora to povedati.

## Povzetek

- Ponovljivost opisuje raztros meritev v enakih pogojih; meri jo standardni odmik $s$, negotovost povprečja je $u_A = s/\sqrt{n}$.
- Kalibracija s primerjavo z etalonom odkrije sistematični zamik; popravek $K$ = referenca − odčitek.
- Tip A iz ponovitev, tip B iz kalibracijskega lista, tolerance ali ločljivosti ($a/\sqrt{3}$).
- Neodvisne prispevke seštevamo v kvadratih: $u_c = \sqrt{\sum u_i^2}$; razširjena negotovost $U = k \cdot u_c$, običajno $k = 2$.
- Poročilo navede merilnik in kalibracijo, postopek, pogoje, rezultat $\bar{x} \pm U$ s $k$ in primerjavo z mejno vrednostjo, ki upošteva $U$.

## Za izpit

Znati moraš povedati:

- natančne definicije: standardna negotovost, ocena tipa A in tipa B, ponovljivost in obnovljivost, sistematični in naključni pogrešek, popravek, kombinirana in razširjena negotovost s faktorjem pokritja;
- izrek o negotovosti povprečja s pogoji (neodvisnost, enaka disperzija) in dokaz, da je standardni odmik povprečja $\sigma/\sqrt{n}$;
- izpeljavo $u = a/\sqrt{3}$ za pravokotno porazdelitev in prispevek ločljivosti $\delta/(2\sqrt{3})$;
- zakon razširjanja negotovosti s pogoji (neodvisni vhodi, linearni približek), njegov dokaz, posebna primera vsote in produkta ter člen za korelirane vhode;
- kdaj interval $\bar{x} \pm 2u_c$ pomeni približno $95\,\%$ in kako z njim odločimo o skladnosti z mejno vrednostjo.

### Naloga 1

Osebni vzorčevalnik prahu deluje $480\,\mathrm{min}$ s pretokom $2{,}0\,\mathrm{L/min}$. Proizvajalec za pretok navaja toleranco $\pm 5\,\%$ (pravokotna porazdelitev), negotovost časa zanemarimo. Masa prahu na filtru je povprečje štirih ponovljenih določitev, $2{,}40\,\mathrm{mg}$, njihov standardni odmik je $0{,}10\,\mathrm{mg}$. (a) Izpelji formulo za relativno negotovost koncentracije $c = m/(qt)$ in zapiši rezultat s $k = 2$. (b) Ali je mejna vrednost $3{,}0\,\mathrm{mg/m^3}$ (podatek naloge) zanesljivo upoštevana? (c) Kolikšna sme biti največ toleranca pretoka $\pm p$, da relativna razširjena negotovost ne preseže $5\,\%$?

**Rešitev:**

1. Prostornina zraka: $V = qt = 2{,}0 \cdot 480 = 960\,\mathrm{L} = 0{,}960\,\mathrm{m^3}$, koncentracija $c = 2{,}40 / 0{,}960 = 2{,}50\,\mathrm{mg/m^3}$.
2. Koeficienta občutljivosti sta $\partial c/\partial m = 1/(qt) = c/m$ in $\partial c/\partial q = -m/(q^2 t) = -c/q$. Ker sta $m$ in $q$ neodvisna, zakon razširjanja da $\big(u(c)/c\big)^2 = \big(u(m)/m\big)^2 + \big(u(q)/q\big)^2$.
3. Tip A za maso: $u(m) = 0{,}10 / \sqrt{4} = 0{,}05\,\mathrm{mg}$, relativno $0{,}05 / 2{,}40 \approx 0{,}021$.
4. Tip B za pretok: $u(q)/q = 0{,}05 / \sqrt{3} \approx 0{,}029$.
5. $u(c)/c = \sqrt{0{,}021^2 + 0{,}029^2} \approx 0{,}036$, zato $u(c) = 0{,}036 \cdot 2{,}50 = 0{,}09\,\mathrm{mg/m^3}$ in $U = 2 \cdot 0{,}09 = 0{,}18\,\mathrm{mg/m^3}$.
6. Rezultat $(2{,}50 \pm 0{,}18)\,\mathrm{mg/m^3}$, $k = 2$. Interval sega do $2{,}68\,\mathrm{mg/m^3}$, kar je pod $3{,}0\,\mathrm{mg/m^3}$, zato je mejna vrednost zanesljivo upoštevana.
7. Za (c): $U/c \le 0{,}05$ pomeni $u(c)/c \le 0{,}025$, torej $u(q)/q \le \sqrt{0{,}025^2 - 0{,}021^2} \approx 0{,}0136$.
8. Pri pravokotni porazdelitvi je $p = \sqrt{3} \cdot 0{,}0136 \approx 0{,}024$.
9. Odgovor: koncentracija je $(2{,}50 \pm 0{,}18)\,\mathrm{mg/m^3}$ in je zanesljivo pod mejo; za relativno $U$ do $5\,\%$ bi potrebovali črpalko s toleranco pretoka največ približno $\pm 2{,}4\,\%$.

### Naloga 2

Natančno navedi izrek o negotovosti povprečja in ga dokaži. Nato utemelji, ali lahko v primeru 3 negotovost rezultata s ponavljanjem meritev poljubno zmanjšamo.

**Rešitev:**

1. Izrek: naj bodo $X_1, \dots, X_n$ neodvisne z enakim pričakovanjem $\mu$ in disperzijo $\sigma^2$; potem je $E(\bar{X}) = \mu$ in standardni odmik $\bar{X}$ je $\sigma/\sqrt{n}$.
2. Dokaz: $E(\bar{X}) = \frac{1}{n} \sum E(X_i) = \mu$ zaradi linearnosti. Zaradi neodvisnosti je $D\big(\sum X_i\big) = n\sigma^2$, zato $D(\bar{X}) = n\sigma^2/n^2 = \sigma^2/n$.
3. Z večanjem $n$ gre $u_A = s/\sqrt{n}$ proti 0, ker $s$ ostane približno enak.
4. Prispevka tipa B (kalibrator in merilnik) sta od $n$ neodvisna: $u_c \ge \sqrt{0{,}17^2 + 0{,}70^2} \approx 0{,}72\,\mathrm{dB}$, torej $U \ge 2 \cdot 0{,}72 = 1{,}44\,\mathrm{dB}$.
5. Odgovor: ne. Ponavljanje zmanjša le naključni del; negotovost ostane vsaj približno $1{,}4\,\mathrm{dB}$, zmanjšamo jo le z natančnejšim merilnikom in kalibratorjem.

### Naloga 3

Raven hrupa ob stroju izmerimo pred namestitvijo zvočne zapore ($92{,}3\,\mathrm{dB}$) in po njej ($84{,}1\,\mathrm{dB}$), z istim merilnikom isti dan. Vsaka raven ima negotovost tipa A $0{,}20\,\mathrm{dB}$, merilnik prispeva $0{,}70\,\mathrm{dB}$; privzemi, da je njegov zamik pri obeh ravneh enak. Utemelji, ali je negotovost razlike $\Delta L$ enaka $\sqrt{2\,(0{,}20^2 + 0{,}70^2)}$, in zapiši $\Delta L \pm U$ ($k = 2$).

**Rešitev:**

1. Model: $L_i = L_{i,\mathrm{prava}} + \delta + e_i$, kjer je $\delta$ skupni zamik merilnika, $e_1$ in $e_2$ pa sta neodvisna naključna dela.
2. Razlika: $\Delta L = L_1 - L_2 = (L_{1,\mathrm{prava}} - L_{2,\mathrm{prava}}) + e_1 - e_2$; zamik $\delta$ se odšteje. Z razširitvijo zakona za korelirane vhode: prispevka merilnika sta popolnoma korelirana ($r = 1$, $c_1 = 1$, $c_2 = -1$), zato člen $2 \cdot 1 \cdot (-1) \cdot 0{,}70 \cdot 0{,}70 = -0{,}98$ izniči $0{,}70^2 + 0{,}70^2$.
3. Ostane $u(\Delta L) = \sqrt{0{,}20^2 + 0{,}20^2} \approx 0{,}28\,\mathrm{dB}$ in $U = 2 \cdot 0{,}28 = 0{,}56 \approx 0{,}6\,\mathrm{dB}$.
4. $\Delta L = 92{,}3 - 84{,}1 = 8{,}2\,\mathrm{dB}$.
5. Predlagana formula da $\sqrt{2\,(0{,}20^2 + 0{,}70^2)} \approx 1{,}03\,\mathrm{dB}$ in $U \approx 2{,}1\,\mathrm{dB}$, kar je napačno, ker vhoda nista neodvisna.
6. Odgovor: ne; zapora zniža hrup za $(8{,}2 \pm 0{,}6)\,\mathrm{dB}$, $k = 2$.

## Drugače: Z analogijo

Predstavljaj si pikado. Vsaka puščica je ena meritev, središče tarče je prava vrednost.

- Puščice tesno skupaj, a v zgornjem levem kotu: dobra ponovljivost, velik sistematični zamik. Igralec ima mirno roko, a krivo nameri. Pomaga »kalibracija« merka.
- Puščice razpršene po vsej tarči, a okrog središča: slaba ponovljivost, brez zamika. Povprečje vseh puščic je blizu središča, a za to potrebuješ veliko metov.
- Puščice tesno skupaj na sredini: to je cilj dobrega merilnika.

Razširjena negotovost je krog okrog povprečja puščic, v katerem s $95\,\%$ verjetnostjo leži središče. Analogija ima mejo: pri meritvi središča tarče ne vidimo. Prav zato potrebujemo etalon.

## Drugače: Uporaba v stroki

Akreditiran laboratorij (SIST EN ISO/IEC 17025) mora oceniti negotovost svojih meritev; kadar v poročilu izjavi skladnost z mejno vrednostjo, mora navesti negotovost in pravilo odločanja, po katerem rezultat primerja z mejo. Pri meritvah hrupa po SIST EN ISO 9612 merilec preveri merilnik s kalibratorjem pred serijo meritev in po njej; če se odčitka razlikujeta za več kot $0{,}5\,\mathrm{dB}$, serijo zavrže. Za merilnik razreda 1 standard navaja prav prispevek $0{,}7\,\mathrm{dB}$ iz primera 3.

Pri vzorčenju prahu pretok črpalke pred vzorčenjem in po njem preverijo s kalibriranim merilnikom pretoka. SIST EN 482 zahteva, da razširjena negotovost postopka v območju od polovice do dvakratnika mejne vrednosti ne preseže $30\,\%$. V industrijski kontroli kakovosti mejo sprejemljivosti zožijo za $U$ (varovalni pas), da izdelek zunaj tolerance ne preide kot dober.

## Preveri se

? Kaj od naštetega **ne** sodi med vire ocene negotovosti tipa B?
- toleranca kalibratorja, ki jo navaja proizvajalec
~ Toleranca je podatek iz dokumentacije, ne iz ponovitev, zato je tipična ocena tipa B.
+ raztros šestih zaporednih meritev na istem mestu
- ločljivost prikazovalnika $0{,}1\,\mathrm{dB}$
~ Ločljivost je znana meja zaokroževanja ($\pm 0{,}05\,\mathrm{dB}$), torej ocena tipa B.
- negotovost iz kalibracijskega lista merilnika
~ Kalibracijski list je zunanji podatek; njegovo negotovost uporabimo kot oceno tipa B.
> Raztros ponovljenih meritev obdelamo statistično, zato je to ocena tipa A.

? Pri devetih meritvah prahu je standardni odmik $0{,}6\,\mathrm{mg/m^3}$. Kolikšna je standardna negotovost povprečja?
- $0{,}6\,\mathrm{mg/m^3}$
~ To je raztros posamezne meritve. Povprečje devetih meritev je zanesljivejše, zato delimo s $\sqrt{9}$.
+ $0{,}2\,\mathrm{mg/m^3}$
- $0{,}067\,\mathrm{mg/m^3}$
~ Delil si z $n = 9$ namesto s $\sqrt{n} = 3$.
> $u_A = \dfrac{s}{\sqrt{n}} = \dfrac{0{,}6}{3} = 0{,}2\,\mathrm{mg/m^3}$.

? Merilec namesto 4 opravi 16 ponovitev, vse drugo ostane enako. Kaj je posledica?
- Negotovost tipa A in sistematični zamik se oba razpolovita.
~ Ponovitve ne vplivajo na zamik merilnika; tega odpravi le popravek iz kalibracije.
- Standardni odmik $s$ se razpolovi.
~ $s$ je širina oblaka in je lastnost postopka; z več meritvami ostane približno enak.
+ Negotovost povprečja $u_A$ se približno razpolovi, zamik ostane.
> $\sqrt{16}/\sqrt{4} = 2$, zato je $u_A$ pol manjša; sistematični del se ne spremeni.

? Študent napiše proračun: (1) $u_A = 0{,}3\,\mathrm{dB}$, (2) $u_\mathrm{kal} = 0{,}4\,\mathrm{dB}$, (3) $u_c = 0{,}3 + 0{,}4 = 0{,}7\,\mathrm{dB}$, (4) $U = 2 \cdot u_c$. Kateri korak je napačen?
- korak (1)
~ $u_A$ je podan kot rezultat ocene tipa A; s tem ni nič narobe.
+ korak (3)
- korak (4)
~ $U = k \cdot u_c$ s $k = 2$ je pravilno; napaka je prej.
- noben, proračun je pravilen
~ Neodvisni prispevki se ne seštevajo naravnost, zato je eden od korakov napačen.
> Prispevke seštejemo v kvadratih: $u_c = \sqrt{0{,}3^2 + 0{,}4^2} = 0{,}5\,\mathrm{dB}$, nato $U = 1{,}0\,\mathrm{dB}$.

? V poročilu piše: koncentracija prahu $(4{,}6 \pm 0{,}8)\,\mathrm{mg/m^3}$, $k = 2$; mejna vrednost je $5\,\mathrm{mg/m^3}$. Kaj je pravilen zaključek?
- Mejna vrednost je zagotovo upoštevana, ker je $4{,}6 < 5$.
~ Povprečje je pod mejo, a interval sega do $5{,}4\,\mathrm{mg/m^3}$, torej čez mejo.
- Mejna vrednost je zagotovo presežena.
~ Interval sega tudi pod mejo (od $3{,}8$), zato preseganja ne moremo trditi.
+ Skladnosti ni mogoče potrditi; potrebne so dodatne meritve ali manjša negotovost.
> Interval $3{,}8$ do $5{,}4\,\mathrm{mg/m^3}$ vsebuje mejno vrednost, zato odločitev ni zanesljiva.

:::simboli
\bar{x} | povprečje meritev | \bar{x} = \frac{x_1 + \dots + x_n}{n} | | enota kot merjena količina
x_i, x_1, x_2, x_n | posamezne meritve | | | enota kot merjena količina
n | število ponovitev | | – |
s | standardni odmik (raztros) | s = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n-1}} | | meri ponovljivost
u_A | standardna negotovost tipa A | u_A = \frac{s}{\sqrt{n}} | | negotovost povprečja
u_B | standardna negotovost tipa B | u_B = \frac{a}{\sqrt{3}} | | iz tolerance, kalibracije, ločljivosti
a | polširina meje (toleranca) | | | vrednost znotraj $\pm a$
u_c | kombinirana standardna negotovost | u_c = \sqrt{u_1^2 + u_2^2 + u_3^2} | |
u_1, u_2, u_3 | posamezni prispevki k negotovosti | | |
U | razširjena negotovost | U = k \cdot u_c | | interval $\bar{x} \pm U$
k | faktor pokritja | | – | običajno 2, približno $95\,\%$
K | popravek iz kalibracije | K = L_\mathrm{ref} - L_\mathrm{kal} | dB |
L_\mathrm{ref} | raven kalibratorja (referenca) | | dB |
L_\mathrm{kal} | odčitek merilnika na kalibratorju | | dB |
L_\mathrm{odč} | odčitek na delovnem mestu | | dB |
L | popravljena raven hrupa | L = L_\mathrm{odč} + K | dB |
u_\mathrm{kal} | prispevek kalibratorja | | dB |
u_\mathrm{m} | prispevek merilnika | | dB |
a_\mathrm{kal} | toleranca kalibratorja | u_\mathrm{kal} = \frac{a_\mathrm{kal}}{\sqrt{3}} | dB |
y | rezultat, izračunan iz vhodnih količin | y = f(x_1, \dots, x_N) | |
c_i | koeficient občutljivosti | c_i = \frac{\partial f}{\partial x_i} | |
u | standardna negotovost | u = \frac{a}{\sqrt{3}} | | pri pravokotni porazdelitvi
i | indeks meritve ali vhodne količine | | – |
:::
