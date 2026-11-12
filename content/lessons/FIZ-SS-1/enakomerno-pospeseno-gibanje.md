---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V tehničnih podatkih kompaktnega električnega avta (VW ID.3 s 150 kW) piše: od $0$ do $100\,\mathrm{km/h}$ v $7{,}3\,\mathrm{s}$. Koliko ceste potrebuje za to? Hiter račun z znano formulo: $100\,\mathrm{km/h}$ je približno $27{,}8\,\mathrm{m/s}$, krat $7{,}3\,\mathrm{s}$ da okoli $200\,\mathrm{m}$. Ob stalnem pospešku bi bila pot približno pol manjša. Kje je napaka? Namig: avto je imel $27{,}8\,\mathrm{m/s}$ šele čisto na koncu.

Kadar se hitrost spreminja, potrebuješ novo količino: **pospešek**. Pove, kako hitro se hitrost spreminja. Tvoj telefon ga meri ves čas: senzor pospeška v njem šteje korake in obrne sliko, ko telefon zasučeš.

Najpreprostejši primer je **enakomerno pospešeno gibanje**: hitrost se v vsaki sekundi spremeni za enako vrednost. Tako približno speljujejo avti, vlaki in električni skiroji, tako zavirajo vozila in tako padajo telesa. Z enačbami te lekcije vnaprej izračunaš, kako hitro se bo telo gibalo, kje bo po določenem času in kako dolgo zavorno pot potrebuje.

## Razlaga

**Dva na stezi.** Ana se na strel požene iz blokov. Isti hip jo s kolesom prehiti Bor, ki vozi ves čas s $4\,\mathrm{m/s}$. Trener označi, kje je kdo ob vsaki polni sekundi. Borove lege:

:::risba premica
opis: Borove lege na stezi ob časih 0, 1, 2, 3 in 4 sekunde: 0, 4, 8, 12 in 16 metrov. Vsi štirje skoki so enako dolgi, po 4 metre.
od: 0
do: 16
oznake: 4
točka: 0
točka: 4
točka: 8
točka: 12
točka: 16
skok: 0 -> 4 | 4 m
skok: 4 -> 8 | 4 m
skok: 8 -> 12 | 4 m
skok: 12 -> 16 | 4 m
podnapis: Bor: lega v metrih ob 0, 1, 2, 3 in 4 s; vsako sekundo enak skok
:::

Anine lege ob istih časih:

:::risba premica
opis: Anine lege na stezi ob časih 0, 1, 2, 3 in 4 sekunde: 0, 1, 4, 9 in 16 metrov. Skoki so vse daljši: 1, 3, 5 in 7 metrov.
od: 0
do: 16
oznake: ne
oznaka: 0 | 0
oznaka: 1 | 1
oznaka: 4 | 4
oznaka: 9 | 9
oznaka: 16 | 16
točka: 0
točka: 1
točka: 4
točka: 9
točka: 16
skok: 0 -> 1 | 1 m
skok: 1 -> 4 | 3 m
skok: 4 -> 9 | 5 m
skok: 9 -> 16 | 7 m
podnapis: Ana: lega v metrih ob 0, 1, 2, 3 in 4 s; vsako sekundo daljši skok
:::

Borovi skoki so enaki, to je enakomerno gibanje, ki ga že poznaš. Anini skoki rastejo. Trener ji je meril tudi hitrost:

| $t\,(\mathrm{s})$ | $v\,(\mathrm{m/s})$ | pot v sekundi (m) | skupna pot (m) |
|---|---|---|---|
| $0$ | $0$ | – | $0$ |
| $1$ | $2$ | $1$ | $1$ |
| $2$ | $4$ | $3$ | $4$ |
| $3$ | $6$ | $5$ | $9$ |
| $4$ | $8$ | $7$ | $16$ |

Drugi stolpec raste vsakič za enako, za $2\,\mathrm{m/s}$. Pri Ani torej ni stalna hitrost, ampak njeno spreminjanje. Skupne poti so $1$, $4$, $9$, $16$, kvadrati časov.

Hitrost obeh narišemo v odvisnosti od časa. Borov graf je vodoravna premica, Anin poševna:

:::risba graf
opis: Graf hitrosti v odvisnosti od časa. Borova hitrost je črtkana vodoravna premica pri 4 m/s. Anina hitrost je premica iz izhodišča do 8 m/s pri 4 s. Pod Anino premico je od 0 do 3 s osenčen trikotnik z osnovnico 3 s in višino 6 m/s; navpični črti pri 1 s in 2 s ga razdelita na tri pasove s ploščinami 1 m, 3 m in 5 m. Skupna ploščina je 9 m, kar je Anina pot v prvih treh sekundah.
x: 0 .. 4 | 1 | t [s]
y: 0 .. 8 | 2 | v [m/s]
lik: 0; 0 -> 3; 0 -> 3; 6 | zelena
črta: 0; 4 -> 4; 4 | siva črtkano
f: 2*x | modra | 0 .. 4
črta: 1; 0 -> 1; 2 | zelena
črta: 2; 0 -> 2; 4 | zelena
napis: 0,72; 0,35 | 1 m | sredina
napis: 1,5; 1,1 | 3 m | sredina
napis: 2,5; 1,8 | 5 m | sredina
podnapis: Pasovi pod Anino premico: 1 m + 3 m + 5 m = 9 m
napis: 0,5; 4,6 | Bor | sredina
napis: 3,3; 7,4 | Ana | sredina
:::

Pri enakomernem gibanju je pot ploščina pod grafom $v(t)$. Za Bora je to pravokotnik: v $3\,\mathrm{s}$ prevozi $3 \cdot 4 = 12\,\mathrm{m}$. Enako velja za Ano. V zelo kratkem času se hitrost skoraj ne spremeni, zato je ozek pas pod premico skoraj pravokotnik $v \cdot \Delta t$, torej pot v tem času. Ožji ko so pasovi, bolj natančno to velja, vsi skupaj pa zapolnijo lik pod premico. Na sliki so trije široki pasovi, po eden za vsako sekundo: njihove ploščine so $1$, $3$ in $5\,\mathrm{m}$, prav stolpec »pot v sekundi«. Skupaj je to trikotnik: $\dfrac{3\,\mathrm{s} \cdot 6\,\mathrm{m/s}}{2} = 9\,\mathrm{m}$, točno kot v tabeli.

:::premisli
Napovej s slike: kdaj je Ana enako hitra kot Bor in kdaj ga ujame? Je to isti trenutek?
---
Ni. Enako hitra sta pri $2\,\mathrm{s}$, kjer se grafa sekata. Takrat je Ana še zadaj: njen trikotnik meri $4\,\mathrm{m}$, Borov pravokotnik $8\,\mathrm{m}$. Ujame ga, ko sta ploščini enaki, pri $4\,\mathrm{s}$: $\dfrac{4 \cdot 8}{2} = 16\,\mathrm{m}$ in $4 \cdot 4 = 16\,\mathrm{m}$.
:::

Iz tabele in slike zdaj sestavimo enačbe.

**1. Pospešek.** Pospešek $a$ pove, za koliko se hitrost spremeni v eni sekundi:

$$a = \frac{\Delta v}{\Delta t} = \frac{v - v_0}{t}$$

Enota je $\mathrm{m/s^2}$. Anin pospešek je $2\,\mathrm{m/s^2}$: hitrost se ji vsako sekundo poveča za $2\,\mathrm{m/s}$. Na grafu $v(t)$ je pospešek naklon premice.

**2. Enakomerno pospešeno gibanje** je gibanje po premici s **stalnim pospeškom**. Če ima pospešek nasprotno smer kot hitrost, telo zavira (hitrost se manjša). Tedaj v računih pišemo negativen pospešek. Njegovi velikosti rečemo tudi pojemek.

**3. Enačba za hitrost.** Iz definicije pospeška dobimo:

$$v = v_0 + a\,t$$

kjer je $v_0$ začetna hitrost (ob $t = 0$). Telo ima na začetku $v_0$, nato vsako sekundo pridobi še $a$.

**4. Enačba za prepotovano pot.** Če ima telo začetno hitrost, je lik pod grafom $v(t)$ sestavljen iz dveh delov. Na sliki je $v_0 = 2\,\mathrm{m/s}$, $a = 2\,\mathrm{m/s^2}$ in $t = 3\,\mathrm{s}$:

:::risba graf
opis: Graf hitrosti v odvisnosti od časa za telo z začetno hitrostjo. V aplikaciji se z drsniki spreminjajo začetna hitrost, pospešek in čas; izbrano je v₀ = {v} m/s, a = {a} m/s² in t = {t} s. Lik pod premico do časa t je sestavljen iz spodnjega pravokotnika s stranicama t in v₀, ploščina {v*t} m, in trikotnika nad njim z osnovnico t in višino a krat t, ploščina {a*t*t/2} m. Skupna pot je {v*t + a*t*t/2} m.
x: 0 .. 5 | 1 | t [s]
y: 0 .. 16 | 2 | v [m/s]
drsnik: v | 0 .. 4 | 1 | 2 | začetna hitrost v₀ (m/s)
drsnik: a | 0 .. 3 | 0,5 | 2 | pospešek a (m/s²)
drsnik: t | 1 .. 4 | 1 | 3 | čas t (s)
pravokotnik: 0; 0 .. t; v | siva
lik: 0; v -> t; v -> t; v + a*t | zelena
f: v + a*x | modra | 0 .. 4
napis: 1,3; 15 | pravokotnik {v*t} m | sredina
napis: 1,3; 13 | trikotnik {a*t*t/2} m | sredina
podnapis: Pot = pravokotnik {v*t} m + trikotnik {a*t*t/2} m = {v*t + a*t*t/2} m
:::

Pravokotnik je pot, ki bi jo telo naredilo s stalno hitrostjo $v_0$: $2 \cdot 3 = 6\,\mathrm{m}$. Trikotnik je dodatek zaradi pospeševanja. Njegova osnovnica je $t$, višina pa pridobljena hitrost $a\,t$, zato je ploščina $\dfrac{t \cdot a\,t}{2} = \dfrac{a\,t^2}{2}$, tu $\dfrac{3 \cdot 6}{2} = 9\,\mathrm{m}$. Skupaj $15\,\mathrm{m}$. Splošno:

$$s = v_0\,t + \frac{a\,t^2}{2}$$

V aplikaciji premikaj drsnike pod sliko. Povečuj $v_0$: raste samo pravokotnik. Povečuj $a$: premica postane strmejša in raste samo trikotnik. Pri $v_0 = 0$ pravokotnik izgine in ostane $s = \dfrac{a t^2}{2}$, kot pri Ani.

Isto pove povprečna hitrost. Ker hitrost narašča enakomerno, je $\bar v = \dfrac{v_0 + v}{2}$ in $s = \bar v \cdot t$. Zdaj rešimo uganko iz uvoda: povprečna hitrost je polovica končne, zato je ob stalnem pospešku $s \approx \dfrac{27{,}8 \cdot 7{,}3}{2} \approx 101\,\mathrm{m}$. Njegov pospešek je $\dfrac{27{,}8}{7{,}3} \approx 3{,}8\,\mathrm{m/s^2}$. Resničen avto ne pospešuje povsem enakomerno, zato je $101\,\mathrm{m}$ ocena.

**5. Enačba brez časa.** Pot je povprečna hitrost krat čas, čas pa iz enačbe za hitrost izrazimo kot $t = \dfrac{v - v_0}{a}$. Torej je $s = \dfrac{v_0 + v}{2} \cdot \dfrac{v - v_0}{a}$. Zmnožek vsote in razlike da $v^2 - v_0^2$, zato:

$$v^2 = v_0^2 + 2\,a\,s$$

Uporabna je, kadar čas ni podan ali ni zahtevan.

**6. Grafi gibanja.** Novo gibanje postavimo ob staro:

| | enakomerno | enakomerno pospešeno |
|---|---|---|
| stalna količina | hitrost $v$ | pospešek $a$ |
| graf $v(t)$ | vodoravna premica | poševna premica |
| lik pod $v(t)$ | pravokotnik | pravokotnik + trikotnik |
| graf $s(t)$ | premica | parabola |

Graf $a(t)$ je pri enakomerno pospešenem gibanju vodoravna premica. Graf $s(t)$ je parabola, pri $a > 0$ odprta navzgor. Slika kaže Anino pot $s = t^2$ in črtkano Borovo pot $s = 4t$:

:::risba graf
opis: Graf poti v odvisnosti od časa. Borova pot je črtkana premica s = 4t. Anina pot je parabola s = a t²/2; v aplikaciji se z drsnikoma spreminjata pospešek a in čas t, izbrano je a = {a} m/s² in t = {t} s. Na paraboli je označena točka pri času {t} s in poti {a*t*t/2} m, skozi njo gre kratka tangenta. Naklon tangente je trenutna hitrost {a*t} m/s.
x: 0 .. 6 | 1 | t [s]
y: 0 .. 40 | 5 | s [m]
drsnik: a | 1 .. 3 | 0,5 | 2 | pospešek a (m/s²)
drsnik: t | 1 .. 4 | 1 | 2 | čas t (s)
črta: 0; 0 -> 6; 24 | siva črtkano
f: a*x*x/2 | modra | 0 .. 5
črta: t - 0,5; a*t*t/2 - a*t/2 -> t + 1; a*t*t/2 + a*t | oranžna debelo
točka: t; a*t*t/2 | | desno | oranžna
napis: 1,5; 37 | Ana: polna črta | sredina
napis: 1,5; 33 | Bor: črtkana črta | sredina
podnapis: Ana pri a = {a} m/s² in t = {t} s: pot {a*t*t/2} m, hitrost {a*t} m/s
:::

Kratka debela daljica je tangenta: premica, ki se krivulje v tej točki le dotakne in je tam enako strma. V zelo kratkem času okoli te točke je gibanje skoraj enakomerno, zato je naklon tangente trenutna hitrost. Pri $t = 2\,\mathrm{s}$ je vzporedna Borovi premici: Ana je takrat enako hitra kot Bor, $4\,\mathrm{m/s}$, a je še $4\,\mathrm{m}$ za njim ($4\,\mathrm{m}$ proti $8\,\mathrm{m}$). V aplikaciji premikaj čas do $4\,\mathrm{s}$ in opazuj, kako tangenta postaja strmejša. Pri $4\,\mathrm{s}$ se grafa sekata: Ana Bora ujame pri $16\,\mathrm{m}$ in je takrat dvakrat hitrejša od njega. Nato povečaj pospešek: parabola je strmejša, presečišče pride prej.

:::premisli
Ana teče iz mirovanja s stalnim pospeškom. Kolikokrat daljšo pot preteče, če teče dvakrat dlje časa? Zakaj ne dvakrat?
---
Štirikrat. Pri dvojnem času je dvakrat večja tudi končna hitrost, zato ima trikotnik pod $v(t)$ dvakrat daljšo osnovnico in dvakrat večjo višino. V formuli $s = \dfrac{a t^2}{2}$ se to vidi kot kvadrat časa.
:::

V simulaciji spodaj, »Enakomerno pospešeno gibanje«, nastavi $v_0 = 10\,\mathrm{m/s}$ in $a = -2{,}5\,\mathrm{m/s^2}$. Napovej: po koliko sekundah se vozilo ustavi? Pritisni »Vozi« in izberi graf $v(t)$: premica pada in pri $10 : 2{,}5 = 4\,\mathrm{s}$ doseže ničlo. Pike na cesti (lega vsako sekundo) so vse bolj skupaj: $8{,}75\,\mathrm{m}$; $6{,}25\,\mathrm{m}$; $3{,}75\,\mathrm{m}$; $1{,}25\,\mathrm{m}$ (opis pod simulacijo velja za pospeševanje). Pri $4\,\mathrm{s}$ pritisni »Ustavi«: takrat je hitrost nič in vozilo stoji. Če pustiš teči naprej, pelje vzvratno, ker pospešek ostane enak.

**7. Postopek reševanja.** Zapiši, kaj je podano ($v_0$, $v$, $a$, $t$, $s$), kaj iščeš, in izberi enačbo, v kateri nastopajo natanko te količine. Enote pretvori v $\mathrm{m}$ in $\mathrm{s}$ (npr. $\mathrm{km/h}$ deli s $3{,}6$).

## Rešeni primeri

### Primer 1: električni skiro spelje

Električni skiro spelje iz mirovanja in pospešuje z $1{,}5\,\mathrm{m/s^2}$. Kolikšna je hitrost in prepotovana pot po $4{,}0\,\mathrm{s}$?

**Podatki:** $v_0 = 0$, $a = 1{,}5\,\mathrm{m/s^2}$, $t = 4{,}0\,\mathrm{s}$
**Iščemo:** hitrost $v$ in pot $s$ po $4{,}0\,\mathrm{s}$

:::formula
$v = v_0 + a\,t$, $s = v_0\,t + \dfrac{a\,t^2}{2}$
:::

**Rešitev:**

1. Hitrost: $v = v_0 + at = 0 + 1{,}5 \cdot 4{,}0 = 6{,}0\,\mathrm{m/s}$. Vsako sekundo pridobi $1{,}5\,\mathrm{m/s}$, to pa štirikrat.
2. Pot (ker je $v_0 = 0$, ostane samo trikotnik): $s = \dfrac{a t^2}{2} = \dfrac{1{,}5 \cdot 16}{2} = 12\,\mathrm{m}$.
3. Preverimo s povprečno hitrostjo: $\bar v = \dfrac{0 + 6{,}0}{2} = 3{,}0\,\mathrm{m/s}$, $s = 3{,}0 \cdot 4{,}0 = 12\,\mathrm{m}$. ✓
4. Odgovor: po $4{,}0\,\mathrm{s}$ ima skiro hitrost $6{,}0\,\mathrm{m/s}$ (to je $21{,}6\,\mathrm{km/h}$) in prevozi $12\,\mathrm{m}$.

### Primer 2: zaviranje

Kolesar vozi s hitrostjo $36\,\mathrm{km/h}$ in enakomerno zavira, dokler se ne ustavi po $4{,}0\,\mathrm{s}$. Kolikšen je pospešek in kolikšna je zavorna pot?

**Podatki:** $v_0 = 36\,\mathrm{km/h}$, $v = 0$ (ustavi se), $t = 4{,}0\,\mathrm{s}$
**Iščemo:** pospešek $a$ in zavorno pot $s$

:::formula
$a = \dfrac{v - v_0}{t}$, $s = v_0\,t + \dfrac{a\,t^2}{2}$ (hitrost najprej pretvorimo iz $\mathrm{km/h}$ v $\mathrm{m/s}$: delimo s $3{,}6$)
:::

**Rešitev:**

1. Pretvorba: $36\,\mathrm{km/h} = 36 : 3{,}6 = 10\,\mathrm{m/s}$. Torej $v_0 = 10\,\mathrm{m/s}$, $v = 0$, $t = 4{,}0\,\mathrm{s}$.
2. Pospešek: $a = \dfrac{v - v_0}{t} = \dfrac{0 - 10}{4{,}0} = -2{,}5\,\mathrm{m/s^2}$. Predznak je negativen, ker kolesar zavira.
3. Pot: $s = v_0 t + \dfrac{a t^2}{2} = 10 \cdot 4{,}0 + \dfrac{(-2{,}5)\cdot 16}{2} = 40 - 20 = 20\,\mathrm{m}$.
4. Preverimo s povprečno hitrostjo: $\bar v = \dfrac{10 + 0}{2} = 5\,\mathrm{m/s}$, $s = 5 \cdot 4{,}0 = 20\,\mathrm{m}$. ✓
5. Odgovor: pospešek je $-2{,}5\,\mathrm{m/s^2}$ (kolesar zavira), zavorna pot pa $20\,\mathrm{m}$.

### Primer 3: pot brez podanega časa

Vlak se pelje s hitrostjo $20\,\mathrm{m/s}$ in na razdalji $500\,\mathrm{m}$ pospeši na $30\,\mathrm{m/s}$. Kolikšen je pospešek in koliko časa traja pospeševanje?

**Podatki:** $v_0 = 20\,\mathrm{m/s}$, $v = 30\,\mathrm{m/s}$, $s = 500\,\mathrm{m}$
**Iščemo:** pospešek $a$ in čas pospeševanja $t$

:::formula
Enačba brez časa $v^2 = v_0^2 + 2\,a\,s$, nato $t = \dfrac{v - v_0}{a}$
:::

**Rešitev:**

1. Časa ne poznamo, zato izberemo enačbo brez $t$.
2. Iz $v^2 = v_0^2 + 2as$ izrazimo: $a = \dfrac{v^2 - v_0^2}{2s} = \dfrac{900 - 400}{1000} = 0{,}50\,\mathrm{m/s^2}$.
3. Čas iz enačbe za hitrost: $t = \dfrac{v - v_0}{a} = \dfrac{30 - 20}{0{,}50} = 20\,\mathrm{s}$.
4. Preverimo s potjo: $s = \dfrac{v_0 + v}{2}\, t = 25 \cdot 20 = 500\,\mathrm{m}$. ✓
5. Odgovor: vlak pospešuje z $0{,}50\,\mathrm{m/s^2}$, pospeševanje traja $20\,\mathrm{s}$.

### Primer 4 – zdaj ti: kri ob utripu

Kri v glavni arteriji (aorti) ob utripu doseže le okoli $1\,\mathrm{m/s}$, avto iz uvoda pa $27{,}8\,\mathrm{m/s}$ pri pospešku $3{,}8\,\mathrm{m/s^2}$. Kdo pospešuje močneje? Ob utripu srca kri v $0{,}10\,\mathrm{s}$ pospeši iz mirovanja do $1{,}0\,\mathrm{m/s}$ (tipična ultrazvočna meritev pri zdravem odraslem). Privzemi, da je pospešek stalen. Kolikšen je in koliko daleč se kri premakne v tem času?

**Podatki:** $v_0 = 0$, $v = 1{,}0\,\mathrm{m/s}$, $t = 0{,}10\,\mathrm{s}$; pospešek avta $3{,}8\,\mathrm{m/s^2}$
**Iščemo:** pospešek krvi $a$, primerjavo z avtom in pot $s$

:::formula
$a = \dfrac{v - v_0}{t}$, nato $s = \dfrac{a\,t^2}{2}$ (ker je $v_0 = 0$)
:::

**Rešitev:**

1. Pospešek: $a = \dfrac{1{,}0 - 0}{0{,}10} = 10\,\mathrm{m/s^2}$. To je več kot dvakrat toliko kot pri avtu ($3{,}8\,\mathrm{m/s^2}$), čeprav je kri veliko počasnejša.
2. Ker kri začne iz mirovanja, odpade člen $v_0 t$; ostane $s = \dfrac{a t^2}{2}$.
3. Vstavi in izračunaj sam, nato preveri:

:::premisli
Koliko je $s = \dfrac{10 \cdot 0{,}10^2}{2}$ in koliko je to v centimetrih?
---
$s = 0{,}050\,\mathrm{m} = 5{,}0\,\mathrm{cm}$. Pospešek je velik, a traja tako kratko, da kri pride le nekaj centimetrov. Preveri s povprečno hitrostjo: $0{,}5\,\mathrm{m/s} \cdot 0{,}10\,\mathrm{s} = 0{,}050\,\mathrm{m}$.
:::

## Pogoste napake

- **Velik pospešek pomeni veliko hitrost.** Napačno: »Kri pospešuje z $10\,\mathrm{m/s^2}$, torej teče z $10\,\mathrm{m/s}$.« Pospešek pove, koliko se hitrost spremeni v sekundi, ne kolikšna je. Popravek: končno hitrost dobiš z $v = v_0 + a t$, pri kratkem $t$ je lahko majhna.
- **Pot kot končna hitrost krat čas.** Napačno: »Avto doseže $27{,}8\,\mathrm{m/s}$ v $7{,}3\,\mathrm{s}$, torej prevozi okoli $200\,\mathrm{m}$.« Končno hitrost ima le zadnji hip. Ista napaka je $s = a t^2$ brez polovice. Popravek: množi s povprečno hitrostjo $\dfrac{v_0 + v}{2}$; polovica je ploščina trikotnika pod $v(t)$.
- **Pozabljen predznak pospeška.** Napačno: pri zaviranju vstaviš $a = +2{,}5\,\mathrm{m/s^2}$. Iz $v = v_0 + at$ potem hitrost raste, čeprav kolesar zavira. Popravek: če za pozitivno smer vzameš smer vožnje, je pri zaviranju $a$ negativen.
- **Pot raste sorazmerno s časom.** Napačno: »V dvakrat daljšem času dvakrat daljša pot«, kot pri enakomernem gibanju. Tu se hitrost med potjo veča, zato pot pri $v_0 = 0$ raste s kvadratom časa. Popravek: dvojni čas pomeni štirikratno pot.
- **Napačno branje grafa.** Napačno: »Na Aninem grafu $v(t)$ pri $3\,\mathrm{s}$ odčitam $6$, torej je pospešek $6\,\mathrm{m/s^2}$.« Odčitana vrednost je hitrost; pospešek je naklon premice, $2\,\mathrm{m/s^2}$. Pot je ploščina pod $v(t)$, ne pod $s(t)$. Popravek: najprej preberi, katera količina je na navpični osi.

## Povzetek

- Enakomerno pospešeno gibanje ima stalen pospešek $a = \dfrac{\Delta v}{\Delta t}$, enota $\mathrm{m/s^2}$.
- Hitrost: $v = v_0 + at$.
- Pot: $s = v_0 t + \dfrac{a t^2}{2}$, pri $v_0 = 0$ je $s = \dfrac{a t^2}{2}$.
- Brez časa: $v^2 = v_0^2 + 2as$.
- Graf $a(t)$ je vodoravna premica, $v(t)$ je premica z naklonom $a$, $s(t)$ je parabola.
- Ploščina pod grafom $v(t)$ je prepotovana pot: pravokotnik $v_0 t$ in trikotnik $\dfrac{a t^2}{2}$.
- Pri zaviranju je pospešek negativen; zavorna pot raste s kvadratom začetne hitrosti.

## Drugače: Na sliki

Zaviranje je na grafu $v(t)$ padajoča premica. Zavorna pot je trikotnik pod njo. Slika kaže dve vozili, ki zavirata z enakim pospeškom $-2{,}5\,\mathrm{m/s^2}$: prvo iz $10\,\mathrm{m/s}$ (črtkano), drugo iz $20\,\mathrm{m/s}$.

:::risba graf
opis: Graf hitrosti v odvisnosti od časa pri zaviranju s pospeškom −2,5 m/s². Črtkana premica pada z 10 m/s na nič v 4 s; trikotnik pod njo ima ploščino 20 m. Druga premica pada z začetne hitrosti, ki se v aplikaciji nastavi z drsnikom; izbrano je {v} m/s. Do ničle pade v {2*v/5} s, osenčeni trikotnik pod njo ima ploščino {v*v/5} m, to je zavorna pot.
x: 0 .. 8 | 1 | t [s]
y: 0 .. 20 | 5 | v [m/s]
drsnik: v | 5 .. 20 | 2,5 | 20 | začetna hitrost v₀ (m/s)
lik: 0; 0 -> 0; v -> 2*v/5; 0 | zelena
črta: 0; v -> 2*v/5; 0 | modra debelo
črta: 0; 10 -> 4; 0 | siva črtkano
napis: 5,5; 18 | polna črta: {v*v/5} m | sredina
napis: 5,5; 15,5 | črtkana črta: 20 m | sredina
podnapis: Zavorna pot pri v₀ = {v} m/s: {v*v/5} m; pri 10 m/s (črtkano): 20 m
:::

Premici sta vzporedni, ker je pospešek enak. Vozilo z dvojno hitrostjo zavira dvakrat dlje ($8\,\mathrm{s}$ namesto $4\,\mathrm{s}$). Njegov trikotnik je dvakrat širši in dvakrat višji, zato ima štirikrat večjo ploščino: $\dfrac{8 \cdot 20}{2} = 80\,\mathrm{m}$ proti $\dfrac{4 \cdot 10}{2} = 20\,\mathrm{m}$.

V aplikaciji z drsnikom zmanjšuj začetno hitrost. Pri $15\,\mathrm{m/s}$ je zavorna pot $45\,\mathrm{m}$, pri $5\,\mathrm{m/s}$ le $5\,\mathrm{m}$. Opazi, da se pot krči veliko hitreje kot hitrost. Pri $10\,\mathrm{m/s}$ se premici pokrijeta.

## Drugače: Iz vsakdanjega življenja

Hitrost in pospešek sta kot **višina otroka** in **to, koliko zraste v enem letu**. Dojenček je majhen, a raste zelo hitro; odrasel je visok, a ne raste več. Velika višina ne pomeni hitre rasti in obratno. Kri v aorti je dojenček v tej primerjavi: majhna hitrost, velik pospešek. Avto pri stalnih $130\,\mathrm{km/h}$ na avtocesti je odrasel: velika hitrost, pospešek nič.

Ko na semaforju zasveti zelena, voznik pospeši. Vozilo, ki pospešuje z $2\,\mathrm{m/s^2}$, ima po prvi sekundi $2\,\mathrm{m/s}$ (približno $7\,\mathrm{km/h}$), po drugi $4\,\mathrm{m/s}$ in tako naprej. Hitrost raste enakomerno, pot pa vse hitreje, saj vozilo vsako naslednjo sekundo prevozi več kot prejšnjo.

Zaviranje je enak pojav v obratni smeri in ima pomembno posledico. Zavorna pot je $s = \dfrac{v_0^2}{2|a|}$, začetna hitrost v njej nastopa kvadratno. Avto, ki na suhi cesti zavira s pojemkom okoli $7\,\mathrm{m/s^2}$, potrebuje iz $50\,\mathrm{km/h}$ (okoli $14\,\mathrm{m/s}$) približno $14\,\mathrm{m}$, iz $100\,\mathrm{km/h}$ (okoli $28\,\mathrm{m/s}$) pa približno $55\,\mathrm{m}$, torej štirikrat več. Zraven pride še reakcijska pot: dokler voznik ne pritisne zavore, vozi avto enakomerno, $s = v \cdot t$. Zato je pri večji hitrosti varnostna razdalja tako pomembna.

## Drugače: Bolj natančno

Enačba $s = v_0 t + \dfrac{a t^2}{2}$ v resnici da **premik**, to je spremembo lege, ne nujno prepotovane poti. Razlika se pokaže, ko se telo ustavi in obrne.

Vozilo iz simulacije ima $v_0 = 10\,\mathrm{m/s}$ in $a = -2{,}5\,\mathrm{m/s^2}$. Po $6\,\mathrm{s}$ enačba da

$$s = 10 \cdot 6 + \frac{(-2{,}5) \cdot 36}{2} = 60 - 45 = 15\,\mathrm{m}$$

Vozilo je torej $15\,\mathrm{m}$ pred izhodiščem. Prevozilo pa je več. Do ustavitve pri $4\,\mathrm{s}$ je naredilo $20\,\mathrm{m}$ naprej. V naslednjih $2\,\mathrm{s}$ je iz mirovanja peljalo nazaj: $\dfrac{2{,}5 \cdot 2^2}{2} = 5\,\mathrm{m}$. Premik je $20 - 5 = 15\,\mathrm{m}$, prepotovana pot pa $20 + 5 = 25\,\mathrm{m}$.

Na grafu $v(t)$ leži ta drugi del pod časovno osjo; njegova ploščina se pri premiku odšteje. Dokler se smer gibanja ne obrne, sta premik in pot enaka. Tako je v vseh primerih te lekcije.

## Preveri se

? Telo spelje iz mirovanja s pospeškom $4\,\mathrm{m/s^2}$. Katera vrsta kaže njegovo skupno pot po $1\,\mathrm{s}$, $2\,\mathrm{s}$ in $3\,\mathrm{s}$?
+ $2\,\mathrm{m}$, $8\,\mathrm{m}$, $18\,\mathrm{m}$
- $4\,\mathrm{m}$, $8\,\mathrm{m}$, $12\,\mathrm{m}$
~ To so vrednosti $a t$, torej hitrosti v $\mathrm{m/s}$. Tako bi rasla pot pri stalni hitrosti.
- $4\,\mathrm{m}$, $16\,\mathrm{m}$, $36\,\mathrm{m}$
~ To je $a t^2$ brez polovice. Polovica pride iz ploščine trikotnika pod $v(t)$.
- $2\,\mathrm{m}$, $4\,\mathrm{m}$, $6\,\mathrm{m}$
~ Prva vrednost je prava, a pot ne raste sorazmerno s časom, ampak s kvadratom časa.
> $s = \dfrac{a t^2}{2} = 2t^2$: dobimo $2\,\mathrm{m}$, $8\,\mathrm{m}$ in $18\,\mathrm{m}$. Skoki med vrednostmi rastejo, ker je telo vse hitrejše.

? Kri v aorti ob utripu pospešuje s približno $10\,\mathrm{m/s^2}$, doseže pa le okoli $1\,\mathrm{m/s}$. Zakaj to ni protislovje?
- Ker pospešek $10\,\mathrm{m/s^2}$ pomeni hitrost $10\,\mathrm{m/s}$, podatek o hitrosti je torej napačen.
~ Pospešek ni hitrost. Pove le, kako hitro se hitrost spreminja.
- Ker kri v vsaki sekundi preteče $10\,\mathrm{m}$, a po ozki žili.
~ To bi opisovalo stalno hitrost $10\,\mathrm{m/s}$, ne pospeška.
+ Ker pospeševanje traja le okoli $0{,}1\,\mathrm{s}$, v tem času pa hitrost zraste samo za $1\,\mathrm{m/s}$.
- Ker je pri majhnih hitrostih pospešek vedno velik.
~ Pospešek in hitrost nista povezana tako: telo je lahko počasno in ima pospešek nič.
> Pospešek $a = \dfrac{\Delta v}{\Delta t}$ pove, za koliko bi se hitrost spremenila v eni sekundi. Ker pospeševanje traja $0{,}1\,\mathrm{s}$, kri pridobi le $10 \cdot 0{,}1 = 1\,\mathrm{m/s}$.

? Graf $v(t)$ je premica od $2\,\mathrm{m/s}$ pri $t = 0$ do $10\,\mathrm{m/s}$ pri $4\,\mathrm{s}$. Kolikšna sta pospešek in pot v teh $4\,\mathrm{s}$?
- $2{,}5\,\mathrm{m/s^2}$ in $40\,\mathrm{m}$
~ To sta končna hitrost, deljena s časom, in končna hitrost krat čas. Šteje sprememba hitrosti, pot pa je ploščina pod premico.
- $2\,\mathrm{m/s^2}$ in $16\,\mathrm{m}$
~ Pospešek je prav, a $16\,\mathrm{m}$ je samo trikotnik. Manjka pravokotnik $v_0 t = 8\,\mathrm{m}$.
- $10\,\mathrm{m/s^2}$ in $24\,\mathrm{m}$
~ $10$ je hitrost, odčitana z grafa. Pospešek je naklon premice.
+ $2\,\mathrm{m/s^2}$ in $24\,\mathrm{m}$
> Naklon: $a = \dfrac{10 - 2}{4} = 2\,\mathrm{m/s^2}$. Ploščina: pravokotnik $2 \cdot 4 = 8\,\mathrm{m}$ in trikotnik $\dfrac{4 \cdot 8}{2} = 16\,\mathrm{m}$, skupaj $24\,\mathrm{m}$.

? Mestni avtobus spelje s pospeškom okoli $1\,\mathrm{m/s^2}$. Približno koliko poti potrebuje, da doseže $50\,\mathrm{km/h}$ (to je okoli $14\,\mathrm{m/s}$)?
- približno $14\,\mathrm{m}$
~ $14$ je čas pospeševanja v sekundah ($v : a$), ne pot.
- približno $200\,\mathrm{m}$
~ To je končna hitrost krat čas, $14 \cdot 14$. Avtobus ima $14\,\mathrm{m/s}$ šele na koncu, povprečna hitrost je polovična.
+ približno $100\,\mathrm{m}$
- približno $1250\,\mathrm{m}$
~ Tu je hitrost ostala v $\mathrm{km/h}$: $\dfrac{50^2}{2}$. Najprej jo pretvori v $\mathrm{m/s}$.
> Pospeševanje traja $14\,\mathrm{s}$, povprečna hitrost je $7\,\mathrm{m/s}$, torej $s \approx 7 \cdot 14 = 98\,\mathrm{m}$. Enako da $s = \dfrac{v^2}{2a}$.

? Trije kolesarji enakomerno zavirajo do ustavitve. A: $v_0 = 10\,\mathrm{m/s}$, $a = -5\,\mathrm{m/s^2}$. B: $v_0 = 20\,\mathrm{m/s}$, $a = -5\,\mathrm{m/s^2}$. C: $v_0 = 10\,\mathrm{m/s}$, $a = -2{,}5\,\mathrm{m/s^2}$. Razvrsti zavorne poti od najkrajše do najdaljše.
- A, B, C
~ Tako razvrstiš, če meniš, da polovični pojemek pri C podaljša pot bolj kot dvojna hitrost pri B. Polovični pojemek pot podvoji ($20\,\mathrm{m}$), dvojna hitrost pa jo početveri ($40\,\mathrm{m}$).
+ A, C, B
- C, A, B
~ Pri C je pojemek manjši, zato kolesar zavira dlje, ne krajše.
- A in C enako, nato B
~ Pri enaki začetni hitrosti in polovičnem pojemku je zavorna pot dvakrat daljša, ne enaka.
> Iz $v^2 = v_0^2 + 2as$ pri $v = 0$ dobimo $s = \dfrac{v_0^2}{2|a|}$: A $10\,\mathrm{m}$, C $20\,\mathrm{m}$, B $40\,\mathrm{m}$. Dvojna hitrost pri B štirikrat podaljša pot.

:::simboli
a | pospešek | a = \dfrac{v - v_0}{t} | m/s^2
v | hitrost ob času t | v = v_0 + a\,t | m/s
v_0 | začetna hitrost | | m/s | hitrost ob t = 0
t | čas | t = \dfrac{v - v_0}{a} | s
\bar v | povprečna hitrost | \bar v = \dfrac{v_0 + v}{2} | m/s
s | pot | s = v_0\,t + \dfrac{a\,t^2}{2} | m | pri gibanju v eno smer enaka premiku
\Delta v | sprememba hitrosti | \Delta v = v - v_0 | m/s
\Delta t | čas, v katerem se hitrost spremeni | | s
:::
