---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Na zemljevidu meri pot od parkirišča do razglednika $3\,\mathrm{km}$. Navzgor hodiš s hitrostjo $3\,\mathrm{km/h}$. Prijateljica vpraša: »Kako hitro moraš iti nazaj, da bo povprečna hitrost cele poti $6\,\mathrm{km/h}$?« Skoraj vsak odgovori $9\,\mathrm{km/h}$, saj je povprečje števil $3$ in $9$ ravno $6$.

Presenetljivo: ne gre, tudi če bi nazaj tekel kot gepard. Za $6\,\mathrm{km}$ s povprečjem $6\,\mathrm{km/h}$ imaš na voljo natanko eno uro, to uro pa si porabil že za vzpon.

Če greš nazaj s hitrostjo $v$, porabiš za vso pot $1 + \frac{3}{v}$ ur. Povprečna hitrost je pot, deljena s časom: $\bar v = \dfrac{6}{1 + \frac{3}{v}}$. Ko ulomek razširimo z $v$, dobimo

$$\bar v(v) = \frac{6v}{v + 3}.$$

Pri $v = 9\,\mathrm{km/h}$ dobiš le $4{,}5\,\mathrm{km/h}$. Pri $v = 300\,\mathrm{km/h}$ dobiš približno $5{,}94\,\mathrm{km/h}$. Vrednost se številu $6$ vedno bolj približuje, a ga nikoli ne doseže. Premici $y = 6$, ki se ji graf tako približuje, rečemo **asimptota**. Funkciji, ki je količnik dveh polinomov, pa rečemo **racionalna funkcija**. Srečaš jo povsod, kjer nekaj deliš: pri povprečni hitrosti, času vožnje, ceni na kilometer.

## Razlaga

**Najprej en primer do konca.** Izraz iz uvoda zdaj vzemimo kot funkcijo na vseh realnih številih, kjer ga lahko izračunamo, tudi na negativnih, ki pri hoji nimajo pomena:

$$f(x) = \frac{6x}{x + 3}$$

*Kje ni definirana.* Z ničlo ne smemo deliti, zato mora biti $x + 3 \ne 0$, torej $x \ne -3$. Definicijsko območje je $\mathbb{R} \setminus \{-3\}$.

*Ničla.* Ulomek je enak $0$, ko je števec $0$, imenovalec pa ne. To je pri $x = 0$.

*Blizu $-3$.* Vstavimo nekaj števil tik ob $-3$:

| $x$ | $x + 3$ | $f(x)$ |
|---|---|---|
| $-3{,}1$ | $-0{,}1$ | $186$ |
| $-3{,}01$ | $-0{,}01$ | $1806$ |
| $-2{,}99$ | $0{,}01$ | $-1794$ |
| $-2{,}9$ | $0{,}1$ | $-174$ |

Števec ostaja blizu $-18$, imenovalec pa postaja vedno manjši. Količnik je zato po absolutni vrednosti ogromen. Levo od $-3$ sta števec in imenovalec negativna, zato gre graf v $+\infty$. Desno je imenovalec pozitiven in graf gre v $-\infty$. Mestu $x = -3$ rečemo **pol**, navpični premici $x = -3$ pa **navpična asimptota**: graf se ji poljubno približa, a je nikoli ne doseže.

*Daleč levo in desno.* $f(1000) \approx 5{,}982$ in $f(-1000) \approx 6{,}018$. Razlog vidiš, če števec in imenovalec delimo z $x$: $f(x) = \dfrac{6}{1 + \frac{3}{x}}$. Ko $|x|$ raste, gre $\frac{3}{x}$ proti $0$ in $f(x)$ proti $6$. Premica $y = 6$ je **vodoravna asimptota**. Desno se ji graf bliža od spodaj, levo od zgoraj.

*Slika.* Graf ima dve veji. Desna pride iz $-\infty$ tik ob premici $x = -3$, gre skozi izhodišče in se od spodaj bliža premici $y = 6$. Leva veja leži nad $y = 6$ in se ob $x = -3$ dviga v $+\infty$. Pri hoji je smiseln le del desne veje za $x > 0$, in prav ta del odgovori na uganko.

**Posplošitev.** Racionalna funkcija je količnik dveh polinomov:

$$f(x) = \frac{p(x)}{q(x)}$$

Tu $q$ ni ničelni polinom. Definirana je povsod razen v ničlah imenovalca.

**Ničle, poli in luknje.** Najprej števec in imenovalec razcepi ter okrajšaj skupne faktorje. Po krajšanju so ničle funkcije ničle števca, poli pa ničle imenovalca. Če je $c$ ničla obeh, faktor $(x - c)$ okrajšaš. Če ga po krajšanju v imenovalcu ni več, namesto pola ostane v grafu le prazna točka, **luknja**. Funkcija tam še vedno ni definirana.

**Stopnja pola.** Če je v imenovalcu faktor $(x - c)^m$, je $c$ pol stopnje $m$. Velja isto kot pri ničlah polinoma: pri lihi stopnji ima graf na obeh straneh pola nasproten predznak (ena veja $+\infty$, druga $-\infty$), pri sodi stopnji gresta obe veji v isto smer.

:::premisli
Pol $2$ funkcije $g(x) = \dfrac{1}{(x - 2)^2}$ je sode stopnje, zato gresta veji ob njem v isto smer. V katero, $+\infty$ ali $-\infty$? Odgovori brez računanja.
---
Na obeh straneh gre v $+\infty$. Imenovalec je kvadrat, torej pozitiven in zelo majhen, števec $1$ pa pozitiven. Pol $2$ je sode stopnje, zato predznak ob njem ostane enak.
:::

**Asimptote iz deljenja.** Pri prvem primeru je pomagalo deljenje z $x$. Splošno števec delimo z imenovalcem, kot znaš iz lekcije o polinomih: $p(x) = q(x)\,k(x) + r(x)$, stopnja ostanka $r$ je manjša od stopnje $q$. Potem je

$$f(x) = k(x) + \frac{r(x)}{q(x)}$$

Ulomek $\frac{r(x)}{q(x)}$ gre za velike $|x|$ proti $0$, zato se graf bliža grafu količnika $k$. Za vodoravno asimptoto zadošča primerjava stopenj:

- Števec nižje stopnje: $y = 0$, npr. $\frac{5}{x + 4}$.
- Enaki stopnji: $y = \frac{a_n}{b_n}$, npr. $\frac{6x}{x + 3}$ ima $y = 6$.
- Števec višji za $1$: poševna asimptota $y = k(x)$, npr. $\frac{x^2 + 1}{x}$ ima $y = x$.

Tu sta $a_n$ in $b_n$ vodilna koeficienta števca in imenovalca. Če je števec višji za $2$ ali več, se graf daleč zunaj obnaša kot polinom $k$, asimptote v obliki premice pa ni.

:::premisli
Ali lahko graf seka svojo vodoravno asimptoto? Preveri pri $h(x) = \dfrac{2x^2 - 2x}{x^2 + 1}$ in $x = -1$.
---
Lahko. Asimptota je $y = 2$ (enaki stopnji, $\frac{2}{1}$), in $h(-1) = \frac{2 + 2}{1 + 1} = 2$. Vodoravna asimptota opisuje le obnašanje daleč levo in desno. Navpične pa graf ne more sekati, ker funkcija na njej ni definirana.
:::

**Postopek.** (1) Definicijsko območje. (2) Razcep in krajšanje, luknje. (3) Ničle in poli s stopnjami. (4) Asimptote. (5) Presečišče z osjo $y$, $f(0)$, in predznaki na intervalih med ničlami in poli. (6) Skica.

Preveri se še v simulaciji »Racionalna funkcija: poli in asimptote«. Premikaj ničlo proti polu, dokler je ne postaviš točno nanj. Kaj se zgodi z grafom in z navpično asimptoto? Nato ničlo spet odmakni od pola, nastavi stopnjo pola na $2$ in opazuj, kam gresta veji ob polu in kam se premakne vodoravna asimptota.

**Racionalne enačbe.** Enačbi, v kateri neznanka nastopa v imenovalcu, rečemo **racionalna enačba**. Vprašanje iz uvoda obrnimo: s kolikšno hitrostjo $v$ moraš sestopiti, da bo povprečna hitrost $5\,\mathrm{km/h}$? Rešiti moramo $\dfrac{6v}{v + 3} = 5$.

1. *Pogoji.* Z ničlo ne smemo deliti, zato $v + 3 \ne 0$, torej $v \ne -3$. Pogoje zapiši, preden karkoli preoblikuješ.
2. *Odpravimo ulomke.* Obe strani pomnožimo s skupnim imenovalcem $v + 3$: $6v = 5(v + 3) = 5v + 15$.
3. *Rešimo* enačbo brez ulomkov: $v = 15$.
4. *Preizkus.* Število $15$ ustreza pogoju $v \ne -3$. Res: $\frac{6 \cdot 15}{18} = 5$. Sestopiti moraš s hitrostjo $15\,\mathrm{km/h}$.

Pri več ulomkih vse imenovalce najprej razcepi. **Najmanjši skupni imenovalec** vsebuje vsak faktor tolikokrat, kolikorkrat se največkrat pojavi v enem imenovalcu. Pogoji izločijo ničle vseh imenovalcev. Preostala realna števila tvorijo definicijsko območje enačbe.

Zakaj je preizkus nujen? Množenje z izrazom, ki je lahko enak $0$, ni ekvivalentno preoblikovanje. Pomnožena enačba ima vse rešitve prvotne, lahko pa še kakšno več. Število, ki reši pomnoženo enačbo, a je ničla kakega imenovalca, je **navidezna rešitev** in jo zavržemo. Primer: $\dfrac{x}{x - 2} = \dfrac{2}{x - 2}$, pogoj $x \ne 2$. Po množenju z $x - 2$ dobimo $x = 2$, kar pogoj prepoveduje. Enačba nima rešitve. Na grafu vidiš isto: razlika leve in desne strani je $\frac{x - 2}{x - 2}$, torej premica $y = 1$ z luknjo pri $x = 2$, ki osi $x$ nikjer ne seka.

Tudi uganka iz uvoda je racionalna enačba. Iz $\dfrac{6v}{v + 3} = 6$ po množenju dobimo $6v = 6v + 18$, torej $0 = 18$. To ne velja za noben $v$, zato povprečja $6\,\mathrm{km/h}$ res ne dosežeš: $y = 6$ je vodoravna asimptota, ki je graf nikjer ne doseže.

## Rešeni primeri

### Primer 1: ena ničla, en pol

Določi definicijsko območje, ničle, pole, asimptote in presečišče z osjo $y$ funkcije $f(x) = \dfrac{2x - 4}{x + 1}$ ter jo skiciraj.

**Podatki:** $f(x) = \dfrac{2x - 4}{x + 1}$
**Iščemo:** definicijsko območje, ničle, pole, asimptote, $f(0)$, skico

:::formula
Ničle: $p(x) = 0$; poli: $q(x) = 0$; pri enakih stopnjah $y = \dfrac{a_n}{b_n}$
:::

**Rešitev:**

1. Imenovalec: $x + 1 \ne 0$, torej $x \ne -1$; $D_f = \mathbb{R} \setminus \{-1\}$.
2. Števec je $2(x - 2)$, skupnega faktorja z imenovalcem ni, krajšati ni kaj.
3. Ničla: $2x - 4 = 0$, $x = 2$. Pol: $x = -1$, stopnje $1$, zato veji ob njem na nasprotnih straneh.
4. Stopnji števca in imenovalca sta obe $1$, vodilna koeficienta $2$ in $1$: vodoravna asimptota $y = 2$. Navpična asimptota: $x = -1$.
5. $f(0) = \dfrac{-4}{1} = -4$, presečišče z osjo $y$ je $(0, -4)$.
6. Predznaki: za $x < -1$ pozitiven, med $-1$ in $2$ negativen, za $x > 2$ pozitiven. Ob polu: $f(-1{,}1) = 62$, $f(-0{,}9) = -58$, torej levo $+\infty$, desno $-\infty$.
7. Odgovor: leva veja leži nad $y = 2$ in se ob $x = -1$ dviga v $+\infty$. Desna veja pride iz $-\infty$, gre skozi $(0, -4)$ in $(2, 0)$ ter se od spodaj bliža premici $y = 2$.

### Primer 2: pol ali luknja?

Določi pole, luknje, ničle in asimptote funkcije $f(x) = \dfrac{x^2 - 4}{x^2 - x - 2}$.

**Podatki:** $f(x) = \dfrac{x^2 - 4}{x^2 - x - 2}$
**Iščemo:** pole, luknje, ničle, asimptote

:::formula
Razcep, nato krajšanje skupnega faktorja $(x - c)$; pri enakih stopnjah $y = \dfrac{a_n}{b_n}$
:::

**Rešitev:**

1. Razcep: $x^2 - 4 = (x - 2)(x + 2)$ in $x^2 - x - 2 = (x - 2)(x + 1)$.
2. Definicijsko območje: $x \ne 2$ in $x \ne -1$, ker sta to ničli imenovalca.
3. Krajšanje: $f(x) = \dfrac{x + 2}{x + 1}$ za $x \ne 2$. Faktor $(x - 2)$ je izginil, zato je pri $x = 2$ luknja, ne pol. Njena višina je $\frac{2 + 2}{2 + 1} = \frac{4}{3}$.
4. Po krajšanju: ničla $x = -2$ (števec), pol $x = -1$ (imenovalec), stopnje $1$.
5. Prvotni stopnji sta obe $2$, vodilna koeficienta $1$ in $1$: vodoravna asimptota $y = 1$. Še $f(0) = \frac{2}{1} = 2$.
6. Odgovor: pol in navpična asimptota pri $x = -1$, luknja v točki $\left(2, \frac{4}{3}\right)$, ničla $-2$, vodoravna asimptota $y = 1$.

### Primer 3: čoln proti toku in nazaj

Razdaljo med pristaniščema na reki odčitaš z zemljevida: $12\,\mathrm{km}$. Čoln pluje do tja proti toku in nato nazaj. Reka teče s hitrostjo $3\,\mathrm{km/h}$, $v$ je hitrost čolna v mirni vodi. Zapiši skupni čas $t(v)$, razloži njegov pol in asimptoto ter ugotovi, kako hitro mora čoln pluti, da pot tja in nazaj traja $3\,\mathrm{h}$.

**Podatki:** $s = 12\,\mathrm{km}$ (v vsako smer), $u = 3\,\mathrm{km/h}$ (hitrost reke), želeni skupni čas $3\,\mathrm{h}$
**Iščemo:** $t(v)$, pol in asimptoto, hitrost $v$ za čas $3\,\mathrm{h}$

:::formula
$t(v) = \dfrac{s}{v - u} + \dfrac{s}{v + u}$
:::

**Rešitev:**

1. Proti toku pluje s hitrostjo $v - 3$, zato porabi $\dfrac{12}{v - 3}$ ur; nazaj s tokom $\dfrac{12}{v + 3}$ ur.
2. Skupni imenovalec: $t(v) = \dfrac{12(v + 3) + 12(v - 3)}{(v - 3)(v + 3)} = \dfrac{24v}{v^2 - 9}$.
3. Pola sta $v = 3$ in $v = -3$; smisel ima le $v > 3$. Pri $v$ tik nad $3$ se čoln proti toku komaj premika, zato čas raste čez vse meje.
4. Števec ima nižjo stopnjo kot imenovalec, asimptota je $t = 0$: zelo hiter čoln porabi zelo malo časa. Za primer $t(5) = \dfrac{120}{16} = 7{,}5\,\mathrm{h}$.
5. Pogoj $\dfrac{24v}{v^2 - 9} = 3$ pomnožimo z $v^2 - 9$: $24v = 3v^2 - 27$, po deljenju s $3$ dobimo $v^2 - 8v - 9 = 0$.
6. Zdaj ti: reši kvadratno enačbo in izberi rešitev, ki ima v nalogi smisel.

:::premisli
Kolikšna je hitrost $v$?
---
$v^2 - 8v - 9 = (v - 9)(v + 1) = 0$, torej $v = 9$ ali $v = -1$. Hitrost mora biti večja od $3\,\mathrm{km/h}$, zato je $v = 9\,\mathrm{km/h}$. Preizkus: $t(9) = \dfrac{216}{72} = 3\,\mathrm{h}$.
:::

### Primer 4: racionalna enačba z navidezno rešitvijo

Reši enačbo $\dfrac{x}{x - 1} - \dfrac{2}{x + 1} = \dfrac{4}{x^2 - 1}$.

**Podatki:** enačba $\dfrac{x}{x - 1} - \dfrac{2}{x + 1} = \dfrac{4}{x^2 - 1}$
**Iščemo:** vse realne rešitve

:::formula
Pogoji: imenovalci $\ne 0$; obe strani pomnožimo z najmanjšim skupnim imenovalcem; preizkus s pogoji
:::

**Rešitev:**

1. Razcep: $x^2 - 1 = (x - 1)(x + 1)$. Najmanjši skupni imenovalec je $(x - 1)(x + 1)$.
2. Pogoji: $x \ne 1$ in $x \ne -1$.
3. Pomnožimo s $(x - 1)(x + 1)$: $x(x + 1) - 2(x - 1) = 4$.
4. Odpravimo oklepaje: $x^2 + x - 2x + 2 = 4$, torej $x^2 - x - 2 = 0$.
5. Razcep: $(x - 2)(x + 1) = 0$, kandidata sta $x = 2$ in $x = -1$.
6. Preizkus s pogoji: $x = -1$ je ničla imenovalca, zato je navidezna rešitev. Za $x = 2$: leva stran je $\frac{2}{1} - \frac{2}{3} = \frac{4}{3}$, desna $\frac{4}{3}$.
7. Odgovor: enačba ima eno rešitev, $x = 2$.

## Pogoste napake

- **Pol zamenjaš z ničlo.** Pri $f(x) = \dfrac{x - 5}{x + 2}$ kdo reče, da je pol $5$. Ničle dá števec, pole imenovalec: ničla je $5$, pol $-2$.
- **Ne okrajšaš.** Ni vsaka ničla imenovalca pol. V primeru 2 je pri $x = 2$ le luknja, ker se faktor $(x - 2)$ okrajša. Popravek: najprej razcepi in okrajšaj, šele nato išči pole.
- **Asimptota iz prostih členov ali vedno $y = 0$.** Pri $\dfrac{3x + 1}{x - 2}$ asimptota ni $y = -\frac{1}{2}$ (prosta člena) in ne $y = 0$, ampak $y = 3$. Pri enakih stopnjah deliš vodilna koeficienta.
- **»Graf asimptote nikoli ne seka.«** To velja za navpično, kjer funkcija ni definirana. Vodoravno lahko seka, kot $h(-1) = 2$ v razlagi.
- **Rešitev enačbe brez smisla v nalogi.** Pri čolnu je $v = -1$ rešitev enačbe, ne pa naloge. Vedno preveri, katere vrednosti dovoljuje vsebina.
- **Brez pogojev pri racionalni enačbi.** V primeru 4 kvadratna enačba da tudi $x = -1$, ki pa je ničla imenovalca. Popravek: pogoje zapiši na začetku in vsako rešitev na koncu preveri z njimi.

## Povzetek

- Racionalna funkcija: $f(x) = \dfrac{p(x)}{q(x)}$, definirana povsod razen v ničlah imenovalca.
- Po krajšanju: ničle iz števca, poli iz imenovalca; okrajšan skupni faktor pusti luknjo.
- Pol lihe stopnje: veji na nasprotnih straneh; pol sode stopnje: obe v isto smer. Pri polu je navpična asimptota.
- Vodoravna asimptota: števec nižji $\Rightarrow y = 0$; enaki stopnji $\Rightarrow y = \frac{a_n}{b_n}$; števec višji za $1$ $\Rightarrow$ poševna asimptota (količnik pri deljenju).
- Graf vodoravno asimptoto lahko seka, navpične nikoli.
- Racionalna enačba: pogoji (imenovalci $\ne 0$), množenje z najmanjšim skupnim imenovalcem, rešitev, preizkus. Kandidat, ki je ničla kakega imenovalca, je navidezna rešitev.

## Ponovitev

**Formule**
- $f(x) = \dfrac{p(x)}{q(x)}$, $D_f$: vsi $x$ s $q(x) \ne 0$ (na pamet)
- po krajšanju: ničle iz $p$, poli iz $q$ (na pamet)
- števec nižje stopnje: vodoravna asimptota $y = 0$ (na pamet)
- enaki stopnji: vodoravna asimptota $y = \frac{a_n}{b_n}$ (na pamet)
- števec višji za $1$: poševna asimptota $y = k(x)$, $k$ je količnik $p : q$ (na pamet)

**Postopek**
1. Določi definicijsko območje.
2. Števec in imenovalec razcepi in okrajšaj; skupni faktor da luknjo.
3. Poišči ničle in pole s stopnjami.
4. Določi asimptote.
5. Izračunaj $f(0)$ in predznake na intervalih ter skiciraj graf.
6. Pri racionalni enačbi zapiši pogoje in vsako rešitev preveri z njimi.

**Pazi na**
- Ničle dá števec, pole imenovalec.
- Najprej okrajšaj: okrajšan faktor da luknjo, ne pola.
- Pri enakih stopnjah deliš vodilna koeficienta, ne prostih členov.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Zapišite enačbi obeh asimptot grafa funkcije $f(x) = \dfrac{x^2 - 3x + 4}{x - 1}$.

**Rešitev:**

1. Imenovalec je enak $0$ pri $x = 1$. Števec tam ni $0$, saj je $1 - 3 + 4 = 2$, zato je $x = 1$ pol in premica $x = 1$ navpična asimptota.
2. Števec delimo z imenovalcem: količnik je $x - 2$, ostanek $2$, saj je $x^2 - 3x + 4 = (x - 1)(x - 2) + 2$. Torej je $f(x) = x - 2 + \dfrac{2}{x - 1}$.
3. Ulomek $\dfrac{2}{x - 1}$ gre za velike $|x|$ proti $0$, zato se graf bliža premici $y = x - 2$. Asimptota je poševna, ker je stopnja števca za $1$ višja od stopnje imenovalca.
4. Odgovor: navpična asimptota je $x = 1$, poševna asimptota je $y = x - 2$.

**Točkovanje:** 1 točka za navpično asimptoto $x = 1$, 1 točka za deljenje (količnik $x - 2$ in ostanek $2$), 1 točka za poševno asimptoto $y = x - 2$.

### Naloga 2: krajša strukturirana naloga, 8 točk, pola 1 (brez računala)

Dana je funkcija $f(x) = \dfrac{x^2 - 4x + 3}{x^2 - 2x}$.

a) Zapišite definicijsko območje funkcije $f$ ter izračunajte njene ničle in pole. (2 točki)
b) Zapišite enačbe vseh asimptot grafa funkcije $f$. (2 točki)
c) Izračunajte koordinati točke, v kateri graf funkcije $f$ seka svojo vodoravno asimptoto. (2 točki)
d) Narišite graf funkcije $f$. (2 točki)

**Rešitev:**

1. a) Razcepimo: $x^2 - 4x + 3 = (x - 1)(x - 3)$ in $x^2 - 2x = x(x - 2)$. Skupnega faktorja ni, zato krajšati ni kaj.
2. a) Imenovalec je $0$ pri $x = 0$ in $x = 2$, zato je $D_f = \mathbb{R} \setminus \{0, 2\}$. Ničli sta $x = 1$ in $x = 3$, pola $x = 0$ in $x = 2$, oba stopnje $1$.
3. b) Navpični asimptoti sta $x = 0$ in $x = 2$. Števec in imenovalec imata stopnjo $2$ in vodilna koeficienta $1$ in $1$, zato je vodoravna asimptota $y = \frac{1}{1} = 1$.
4. c) Rešimo enačbo $\dfrac{x^2 - 4x + 3}{x^2 - 2x} = 1$. Za $x \in D_f$ jo pomnožimo z $x^2 - 2x$ in dobimo $x^2 - 4x + 3 = x^2 - 2x$.
5. c) Kvadratna člena se odštejeta: $-2x = -3$, torej $x = \frac{3}{2}$. To število je v $D_f$, zato je presečišče $\left(\frac{3}{2}, 1\right)$.
6. d) Predznaki na intervalih (testna števila $-1$, $\frac{1}{2}$, $\frac{3}{2}$, $\frac{5}{2}$, $4$): $f$ je pozitivna na $(-\infty, 0)$, $(1, 2)$ in $(3, \infty)$, negativna na $(0, 1)$ in $(2, 3)$. Z osjo $y$ se graf ne seka, ker je $0$ pol.
7. d) Oba pola sta lihe stopnje, zato graf ob vsakem zamenja predznak. Leva veja leži nad premico $y = 1$, se ji daleč levo bliža od zgoraj in se ob $x = 0$ dviga v $+\infty$. Srednja veja pride iz $-\infty$ desno od $x = 0$, gre skozi $(1, 0)$ in $\left(\frac{3}{2}, 1\right)$ ter se ob $x = 2$ dviga v $+\infty$. Desna veja pride iz $-\infty$ desno od $x = 2$, gre skozi $(3, 0)$ in se od spodaj bliža premici $y = 1$.
8. Odgovor: $D_f = \mathbb{R} \setminus \{0, 2\}$, ničli $1$ in $3$, pola $0$ in $2$; asimptote $x = 0$, $x = 2$ in $y = 1$; graf seka vodoravno asimptoto v točki $\left(\frac{3}{2}, 1\right)$.

**Točkovanje:** a) 1 točka za $D_f$, 1 točka za ničli in pola; b) 1 točka za navpični asimptoti, 1 točka za vodoravno asimptoto $y = 1$; c) 1 točka za enačbo $f(x) = 1$, preoblikovano v $x^2 - 4x + 3 = x^2 - 2x$, 1 točka za točko $\left(\frac{3}{2}, 1\right)$; d) 1 točka za pravilen potek vej ob polih in asimptotah, 1 točka za ničle, presečišče z asimptoto in pravilne predznake.

### Ustno vprašanje 1

:::premisli
Kaj je racionalna funkcija in kako določimo njeno definicijsko območje, ničle in pole?
---
Racionalna funkcija je količnik dveh polinomov $f(x) = \frac{p(x)}{q(x)}$, kjer $q$ ni ničelni polinom. Definirana je za vsa realna števila razen ničel imenovalca. Ko števec in imenovalec razcepimo in okrajšamo skupne faktorje, so ničle funkcije ničle števca, poli pa ničle imenovalca. Če se faktor $(x - c)$ iz imenovalca povsem okrajša, ima graf pri $x = c$ luknjo in ne pola.
:::

### Ustno vprašanje 2

:::premisli
Pojasni, kako iz stopenj števca in imenovalca racionalne funkcije določiš njeno vodoravno ali poševno asimptoto.
---
Števec delimo z imenovalcem in dobimo $f(x) = k(x) + \frac{r(x)}{q(x)}$, kjer ima ostanek $r$ nižjo stopnjo kot imenovalec $q$. Ulomek $\frac{r(x)}{q(x)}$ gre za velike $|x|$ proti $0$, zato se graf funkcije bliža grafu količnika $k$. Če ima števec nižjo stopnjo kot imenovalec, je asimptota $y = 0$. Pri enakih stopnjah je asimptota $y = \frac{a_n}{b_n}$, kjer sta $a_n$ in $b_n$ vodilna koeficienta števca in imenovalca. Če je stopnja števca za $1$ višja, je asimptota poševna premica $y = k(x)$.
:::

### Ustno vprašanje 3

:::premisli
Navedi primer racionalne funkcije, pri kateri ničla imenovalca ni pol, in pojasni, kaj je tam na grafu.
---
Primer je $f(x) = \frac{x^2 - 1}{x - 1}$, ki pri $x = 1$ ni definirana. Po krajšanju je $f(x) = x + 1$ za $x \ne 1$, faktor $(x - 1)$ v imenovalcu torej ne ostane. Graf je premica $y = x + 1$ brez točke $(1, 2)$, ki ji rečemo luknja. Pol z navpično asimptoto bi nastal le, če bi ničla imenovalca ostala tudi po krajšanju.
:::

## Drugače: Z analogijo

**Pol je tekoči trak v nasprotno smer.** Na letališču hodiš po tekočem traku, ki pelje nazaj. Če trak pelje skoraj tako hitro, kot hodiš, se komaj premikaš in do konca potrebuješ celo večnost. Ko se hitrost traku približa tvoji, čas raste čez vse meje. Tako se obnaša $\frac{12}{v - 3}$ pri $v$ tik nad $3$.

**Vodoravna asimptota je cena taksija na kilometer.** Taksi zaračuna $4\,€$ ob vstopu in $0{,}80\,€$ za vsak kilometer. Pri kratki vožnji je cena na kilometer visoka, ker se vstopnina razdeli na malo kilometrov. Pri $100\,\mathrm{km}$ je že $0{,}84\,€$ na kilometer. Nikoli pa ne pade pod $0{,}80\,€$: vstopnina se razredči, ne izgine. Funkcija $\frac{4 + 0{,}8x}{x}$ ima asimptoto $y = 0{,}8$.

**Luknja je zaprt mostiček.** Cesta teče naprej v isti smeri, manjka le en sam meter. Pri polu pa se cesta ob prepadu dvigne v nebo ali spusti v globino.

## Drugače: Bolj natančno

**Asimptota kot količnik.** Po izreku o deljenju je $p(x) = q(x)\,k(x) + r(x)$ in stopnja $r$ manjša od stopnje $q$. Zato je $f(x) - k(x) = \frac{r(x)}{q(x)}$. Če števec in imenovalec tega ulomka delimo z najvišjo potenco $x$ v imenovalcu, gre števec proti $0$, imenovalec pa proti vodilnemu koeficientu $q$. Razlika med grafom $f$ in grafom $k$ torej izgine, ko gre $|x| \to \infty$. Primer: $\frac{x^2 + 1}{x} = x + \frac{1}{x}$, razlika do premice $y = x$ je $\frac{1}{x}$.

**Pol in njegova stopnja.** Če je po krajšanju $f(x) = \dfrac{g(x)}{(x - c)^m}$ in $g(c) \ne 0$, je $|f(x)|$ blizu $c$ poljubno velik, saj je števec blizu $g(c)$, imenovalec pa blizu $0$. Predznak $g$ je blizu $c$ stalen, $(x - c)^m$ pa zamenja predznak natanko pri lihem $m$. Od tod pravilo o vejah ob polu.

**Natančna definicija.** Premica je asimptota grafa, če gre razdalja točke na grafu do premice proti $0$, ko se točka po grafu oddaljuje v neskončnost. Ta definicija zajame navpične, vodoravne in poševne asimptote hkrati.

## Preveri se

? Čas vožnje proti toku je $t(v) = \dfrac{12}{v - 3}$. Kaj pomeni, da je $v = 3$ pol te funkcije?
- Pri $v = 3$ je čas vožnje enak $0$.
~ To bi bila ničla funkcije. Ničle dá števec, $v = 3$ pa je ničla imenovalca.
+ Funkcija tam ni definirana, za $v$ tik nad $3$ pa čas raste čez vse meje.
- Pri $v = 3$ graf seka svojo vodoravno asimptoto.
~ Vodoravna asimptota je $t = 0$; pri polu $v = 3$ je navpična asimptota, tam pa funkcija sploh ni definirana.
> Pol je ničla imenovalca, ki se ne okrajša: imenovalec gre proti $0$, količnik pa po absolutni vrednosti čez vse meje.

? Uredi funkcije po vrednosti vodoravne asimptote od najmanjše do največje: $f(x) = \dfrac{3x + 1}{x - 2}$, $g(x) = \dfrac{x^2}{2x^2 + 1}$, $h(x) = \dfrac{5}{x + 4}$.
+ $h$, $g$, $f$
- $f$, $g$, $h$
~ To dobiš, če deliš proste člene ($-\frac{1}{2}$, $0$, $\frac{5}{4}$). Pri enakih stopnjah deliš vodilna koeficienta.
- $g$, $f$, $h$
~ Pri $h$ je števec nižje stopnje kot imenovalec, zato je asimptota $y = 0$, ne $y = 5$.
> Asimptote: $h$ ima $y = 0$ (števec nižji), $g$ ima $y = \frac{1}{2}$, $f$ ima $y = 3$.

? Kaj se zgodi z grafom $f(x) = \dfrac{x - a}{x - 1}$, ko število $a$ premakneš točno na $1$?
- Pol pri $x = 1$ ostane, ker je $1$ še vedno ničla imenovalca.
~ Pozabil si okrajšati: $\frac{x - 1}{x - 1} = 1$ za $x \ne 1$, pol izgine.
+ Graf postane premica $y = 1$ z luknjo pri $x = 1$.
- Funkcija je povsod enaka $0$, ker je ničla števca enaka $1$.
~ Števec je $0$ le pri $x = 1$, tam pa je $0$ tudi imenovalec. Drugod je ulomek enak $1$.
> Števec in imenovalec imata isti faktor $(x - 1)$. Po krajšanju ostane $f(x) = 1$, ki pa pri $x = 1$ ni definirana: luknja namesto pola.

? Taksi zaračuna $4\,€$ ob vstopu in $0{,}80\,€$ na kilometer. Cena na kilometer za vožnjo $x$ kilometrov je $\dfrac{4 + 0{,}8x}{x}$ (v evrih). Kateri vrednosti se bliža pri zelo dolgih vožnjah?
- $4\,€$
~ To je vstopnina. Pri dolgi vožnji se razdeli na veliko kilometrov, zato njen delež na kilometer pada proti $0$.
- $0\,€$
~ Asimptota je $y = 0$ le, če je števec nižje stopnje. Tu sta stopnji enaki.
+ $0{,}80\,€$
- $4{,}80\,€$
~ To je cena na kilometer pri vožnji $1\,\mathrm{km}$, ne pri dolgih vožnjah.
> Stopnji števca in imenovalca sta $1$, vodilna koeficienta $0{,}8$ in $1$, zato je asimptota $y = 0{,}8$.

? Čoln pluje $20\,\mathrm{km}$ proti toku reke, ki teče s $4\,\mathrm{km/h}$. Čas je $t(v) = \dfrac{20}{v - 4}$. Pri kateri hitrosti $v$ čoln v mirni vodi porabi $2\,\mathrm{h}$? Vpiši jo v $\mathrm{km/h}$.
= 14 km/h | 0,01
~ 10 | To je $v - 4$, hitrost čolna glede na breg. Prišteti moraš še hitrost reke.
~ 44 | To je $20 \cdot 2 + 4$. Iz $\frac{20}{v - 4} = 2$ sledi $v - 4 = \frac{20}{2}$, ne $20 \cdot 2$.
> $\dfrac{20}{v - 4} = 2$, torej $v - 4 = 10$ in $v = 14\,\mathrm{km/h}$.

? (brez računala) Reši enačbo $\dfrac{x}{x - 3} - \dfrac{1}{x} = \dfrac{3}{x^2 - 3x}$. Vpiši njeno rešitev.
= 1 | 0
~ 0 | Število $0$ reši pomnoženo enačbo $x^2 - x = 0$, a je ničla imenovalcev $x$ in $x^2 - 3x$: navidezna rešitev.
~ 3 | Pri $x = 3$ je imenovalec $x - 3$ enak $0$. Pogoja sta $x \ne 0$ in $x \ne 3$.
> Pogoja: $x \ne 0$, $x \ne 3$. Množimo z $x(x - 3)$: $x^2 - (x - 3) = 3$, torej $x^2 - x = 0$ in $x = 0$ ali $x = 1$. Število $0$ je ničla imenovalca, ostane $x = 1$.

<<RACUN
resi: 6*v/(v+3)=5 | v | 15
resi: x/(x-2)=2/(x-2) | x | none
resi: 6*v/(v+3)=6 | v | none
resi: x/(x-1)-2/(x+1)=4/(x^2-1) | x | 2
resi: x^2-x-2=0 | x | -1, 2
resi: x/(x-3)-1/x=3/(x^2-3*x) | x | 1
resi: x^2-x=0 | x | 0, 1
enako: (x^2-3*x+4)/(x-1) | x-2+2/(x-1)
limita: (x^2-3*x+4)/(x-1)-(x-2) | x | oo | 0
enako: (x^2-4*x+3)/(x^2-2*x) | (x-1)*(x-3)/(x*(x-2))
resi: x^2-4*x+3=0 | x | 1, 3
resi: x^2-2*x=0 | x | 0, 2
limita: (x^2-4*x+3)/(x^2-2*x) | x | oo | 1
resi: (x^2-4*x+3)/(x^2-2*x)=1 | x | 3/2
enako: (x^2-1)/(x-1) | x+1
>>

:::simboli
\bar v | povprečna hitrost na poti tja in nazaj | \bar v = \frac{6v}{v + 3} | km/h
v | hitrost (v uvodu hitrost sestopa, v primeru 3 hitrost čolna v mirni vodi) | | km/h
f | racionalna funkcija | f(x) = \frac{p(x)}{q(x)} |
x | neodvisna spremenljivka | |
y | vrednost funkcije (os $y$), v enačbi asimptote | |
p | polinom v števcu | |
q | polinom v imenovalcu | |
k | količnik pri deljenju $p$ s $q$ | | | če je stopnje največ $1$, je njegov graf asimptota
r | ostanek pri deljenju $p$ s $q$ | | | stopnja manjša od stopnje $q$
a_n | vodilni koeficient števca | |
b_n | vodilni koeficient imenovalca | |
c | ničla imenovalca | q(c) = 0 | | pol; če se faktor $(x - c)$ iz imenovalca povsem okrajša, luknja
m | stopnja pola $c$ | | | eksponent faktorja $(x - c)^m$ v imenovalcu
t | čas plovbe | t(v) = \frac{24v}{v^2 - 9} | h | zveza velja za skupni čas tja in nazaj v primeru 3
s | pot v eno smer | | km
u | hitrost reke | | km/h
:::
