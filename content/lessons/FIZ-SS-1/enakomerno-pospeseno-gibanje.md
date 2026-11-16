---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V tehničnih podatkih kompaktnega električnega avta (VW ID.3 Pro Performance, 150 kW) piše: od $0$ do $100\,\mathrm{km/h}$ v $7{,}3\,\mathrm{s}$. Koliko ceste potrebuje za to? Hiter račun z znano formulo: $100\,\mathrm{km/h}$ je približno $27{,}8\,\mathrm{m/s}$, krat $7{,}3\,\mathrm{s}$ da okoli $200\,\mathrm{m}$. V resnici prevozi le okoli polovico tega. Kje je napaka? Namig: avto je imel $27{,}8\,\mathrm{m/s}$ šele čisto na koncu.

Kadar se hitrost spreminja, potrebuješ novo količino: **pospešek**. Pove, kako hitro se hitrost spreminja. Tvoj telefon ga meri ves čas: senzor pospeška v njem šteje korake in obrne sliko, ko telefon zasučeš.

Najpreprostejši primer je **enakomerno pospešeno gibanje**: hitrost se v vsaki sekundi spremeni za enako vrednost. Tako približno speljujejo avti, vlaki in električni skiroji, tako zavirajo vozila in tako padajo telesa. Z enačbami te lekcije vnaprej izračunaš hitrost, lego in zavorno pot.

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

| $t\,[\mathrm{s}]$ | $v\,[\mathrm{m/s}]$ | pot v sekundi [m] | skupna pot [m] |
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
opis: Graf hitrosti v odvisnosti od časa za telo z začetno hitrostjo. V aplikaciji se z drsniki spreminjajo začetna hitrost, pospešek in čas; izbrano je v₀ = {v} m/s, a = {a} m/s² in t = {t} s. Lik pod premico do časa t je sestavljen iz spodnjega pravokotnika s stranicama t in v₀, ploščina {v*t} m, in trikotnika nad njim z osnovnico t in višino a krat t, ploščina {a*t*t/2} m. Skupna pot je {v*t + a*t*t/2} m. Črtkana vodoravna črta od 0 do t kaže povprečno hitrost {v + a*t/2} m/s.
x: 0 .. 5 | 1 | t [s]
y: 0 .. 20 | 4 | v [m/s]
drsnik: v | 0 .. 4 | 1 | 2 | začetna hitrost v₀ (m/s)
drsnik: a | 0 .. 3 | 0,5 | 2 | pospešek a (m/s²)
drsnik: t | 1 .. 4 | 1 | 3 | čas t (s)
pravokotnik: 0; 0 .. t; v | siva
lik: 0; v -> t; v -> t; v + a*t | zelena
f: v + a*x | modra | 0 .. 4
črta: 0; v + a*t/2 -> t; v + a*t/2 | oranžna črtkano
napis: 1,8; 19 | pravokotnik spodaj: {v*t} m | sredina
napis: 1,8; 17,3 | trikotnik zgoraj: {a*t*t/2} m | sredina
napis: 1,8; 15,6 | povprečje: {v + a*t/2} m/s | sredina
podnapis: Pot = pravokotnik {v*t} m + trikotnik {a*t*t/2} m = {v*t + a*t*t/2} m; črtkano: povprečna hitrost
:::

Pravokotnik je pot, ki bi jo telo naredilo s stalno hitrostjo $v_0$: $2 \cdot 3 = 6\,\mathrm{m}$. Trikotnik je dodatek zaradi pospeševanja. Njegova osnovnica je $t$, višina pa pridobljena hitrost $a\,t$, zato je ploščina $\dfrac{t \cdot a\,t}{2} = \dfrac{a\,t^2}{2}$, tu $\dfrac{3 \cdot 6}{2} = 9\,\mathrm{m}$. Skupaj $15\,\mathrm{m}$. Splošno:

$$s = v_0\,t + \frac{a\,t^2}{2}$$

V aplikaciji premikaj drsnike pod sliko. Povečuj $v_0$: raste samo pravokotnik. Povečuj $a$: premica postane strmejša in raste samo trikotnik. Pri $v_0 = 0$ pravokotnik izgine in ostane $s = \dfrac{a t^2}{2}$, kot pri Ani.

Isto pove povprečna hitrost. Ker hitrost narašča enakomerno, je $\bar v = \dfrac{v_0 + v}{2}$ in $s = \bar v \cdot t$. Na sliki je $\bar v$ črtkana črta pri $5\,\mathrm{m/s}$. Pravokotnik pod njo, $5 \cdot 3 = 15\,\mathrm{m}$, ima enako ploščino kot lik pod premico: vrh trikotnika nad črtkano črto ravno zapolni vrzel pod njo na začetku. Zdaj rešimo uganko iz uvoda: povprečna hitrost je polovica končne, zato je ob stalnem pospešku $s \approx \dfrac{27{,}8 \cdot 7{,}3}{2} \approx 101\,\mathrm{m}$. Pospešek avta je $\dfrac{27{,}8}{7{,}3} \approx 3{,}8\,\mathrm{m/s^2}$. Resničen avto na začetku pospešuje močneje, zato prevozi nekaj več; $101\,\mathrm{m}$ je ocena.

**5. Enačba brez časa.** Pot je povprečna hitrost krat čas, čas pa iz enačbe za hitrost izrazimo kot $t = \dfrac{v - v_0}{a}$. Torej je $s = \dfrac{v_0 + v}{2} \cdot \dfrac{v - v_0}{a}$. Zmnožek vsote in razlike da $v^2 - v_0^2$, zato:

$$v^2 = v_0^2 + 2\,a\,s$$

Uporabna je, kadar čas ni podan ali ni zahtevan. Pri ustavljanju je $v = 0$, zato je zavorna pot $s = \dfrac{v_0^2}{2|a|}$: dvojna hitrost, štirikratna zavorna pot.

**6. Grafi gibanja.** Novo gibanje postavimo ob staro:

| | enakomerno | enakomerno pospešeno |
|---|---|---|
| stalna količina | hitrost $v$ | pospešek $a$ |
| graf $v(t)$ | vodoravna premica | poševna premica |
| lik pod $v(t)$ | pravokotnik | pravokotnik + trikotnik |
| graf $s(t)$ | premica | parabola |

Graf $a(t)$ je pri enakomerno pospešenem gibanju vodoravna premica; ploščina pod njo, $a\,t$, je sprememba hitrosti. Graf $s(t)$ je parabola: krivulja, ki je pri $a > 0$ vse strmejša (graf kvadratne odvisnosti). Slika kaže Anino pot $s = t^2$ in črtkano Borovo pot $s = 4t$:

:::risba graf
opis: Graf poti v odvisnosti od časa. Borova pot je črtkana premica s = 4t. Anina pot je parabola s = a t²/2; v aplikaciji se z drsnikoma spreminjata pospešek a in čas t, izbrano je a = {a} m/s² in t = {t} s. Na paraboli je označena točka pri času {t} s in poti {a*t*t/2} m, skozi njo gre kratka tangenta. Naklon tangente je trenutna hitrost {a*t} m/s.
x: 0 .. 8 | 1 | t [s]
y: 0 .. 40 | 5 | s [m]
drsnik: a | 1 .. 3 | 0,5 | 2 | pospešek a (m/s²)
drsnik: t | 1 .. 4 | 1 | 2 | čas t (s)
črta: 0; 0 -> 8; 32 | siva črtkano
f: a*x*x/2 | modra | 0 .. 8
črta: t - 0,5; a*t*t/2 - a*t/2 -> t + 1; a*t*t/2 + a*t | oranžna debelo
točka: t; a*t*t/2 | | desno | oranžna
napis: 1,9; 37 | Ana (polna) | sredina
napis: 1,9; 33 | Bor (črtkana) | sredina
napis: 1,9; 29 | tangenta (debela) | sredina
podnapis: Ana pri a = {a} m/s² in t = {t} s: pot {a*t*t/2} m, hitrost {a*t} m/s
:::

Kratka debela daljica je tangenta: premica, ki se krivulje v tej točki le dotakne in je tam enako strma. V zelo kratkem času okoli te točke je gibanje skoraj enakomerno, zato je naklon tangente trenutna hitrost. Pri $t = 2\,\mathrm{s}$ je vzporedna Borovi premici: Ana je takrat enako hitra kot Bor, $4\,\mathrm{m/s}$, a je še $4\,\mathrm{m}$ za njim ($4\,\mathrm{m}$ proti $8\,\mathrm{m}$). V aplikaciji premikaj čas do $4\,\mathrm{s}$ in opazuj, kako tangenta postaja strmejša. Pri $4\,\mathrm{s}$ se grafa sekata: Ana Bora ujame pri $16\,\mathrm{m}$ in je takrat dvakrat hitrejša od njega. Nato spreminjaj pospešek: pri večjem je parabola strmejša in presečišče pride prej, pri $1\,\mathrm{m/s^2}$ Ana Bora ujame šele pri $8\,\mathrm{s}$.

:::premisli
Ana teče iz mirovanja s stalnim pospeškom. Kolikokrat daljšo pot preteče, če teče dvakrat dlje časa? Zakaj ne dvakrat?
---
Štirikrat. Pri dvojnem času je dvakrat večja tudi končna hitrost, zato ima trikotnik pod $v(t)$ dvakrat daljšo osnovnico in dvakrat večjo višino. V formuli $s = \dfrac{a t^2}{2}$ se to vidi kot kvadrat časa.
:::

V simulaciji spodaj, »Enakomerno pospešeno gibanje«, nastavi $v_0 = 10\,\mathrm{m/s}$ in $a = -2{,}5\,\mathrm{m/s^2}$. Napovej: po koliko sekundah se vozilo ustavi? Pritisni »Vozi« in izberi graf $v(t)$ (graf poti je v simulaciji označen z $x(t)$): premica pada in pri $10 : 2{,}5 = 4\,\mathrm{s}$ doseže ničlo. Pike na cesti (lega vsako sekundo) so vse bolj skupaj: $8{,}75\,\mathrm{m}$; $6{,}25\,\mathrm{m}$; $3{,}75\,\mathrm{m}$; $1{,}25\,\mathrm{m}$ (stavek pod simulacijo, da so pike vse bolj narazen, velja le pri pospeševanju). Pritisni »Ustavi«, ko je izpis nad cesto pri $t = 4{,}0\,\mathrm{s}$: hitrost je tedaj približno $0$, vozilo stoji. Če pustiš teči naprej, pelje vzvratno, ker pospešek ostane enak.

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
4. Preverimo na grafu $v(t)$ spodaj: premica pade z $10\,\mathrm{m/s}$ na $0$ v $4{,}0\,\mathrm{s}$, njen naklon je pospešek $-2{,}5\,\mathrm{m/s^2}$. Ploščina trikotnika pod njo je pot: $\dfrac{4{,}0 \cdot 10}{2} = 20\,\mathrm{m}$. ✓

5. Odgovor: pospešek je $-2{,}5\,\mathrm{m/s^2}$ (kolesar zavira), zavorna pot pa $20\,\mathrm{m}$.

:::risba graf
opis: Graf hitrosti kolesarja v odvisnosti od časa. Premica pada z 10 m/s ob času 0 na 0 m/s pri 4 s. Trikotnik pod njo je osenčen, njegova ploščina 20 m je zavorna pot.
x: 0 .. 5 | 1 | t [s]
y: 0 .. 12 | 2 | v [m/s]
lik: 0; 0 -> 0; 10 -> 4; 0 | zelena
črta: 0; 10 -> 4; 0 | modra debelo
napis: 1,2; 2,6 | 20 m | sredina
:::

### Primer 3: zavorna pot s testa

Na testu nemškega avtomobilskega kluba ADAC je VW ID.3 GTX, močnejši brat avta iz uvoda, pri polnem zaviranju iz $100\,\mathrm{km/h}$ ustavil na $35{,}2\,\mathrm{m}$ (povprečje desetih zaviranj). Privzemi, da je bil pospešek stalen. Kolikšen je bil in koliko časa je trajalo zaviranje?

**Podatki:** $v_0 = 100\,\mathrm{km/h} = 27{,}8\,\mathrm{m/s}$, $v = 0$ (ustavi se), $s = 35{,}2\,\mathrm{m}$
**Iščemo:** pospešek $a$ in čas zaviranja $t$

:::formula
Enačba brez časa $v^2 = v_0^2 + 2\,a\,s$, nato $t = \dfrac{v - v_0}{a}$
:::

**Rešitev:**

1. Časa ne poznamo, zato izberemo enačbo brez $t$.
2. Ker je $v = 0$, iz $0 = v_0^2 + 2as$ izrazimo: $a = -\dfrac{v_0^2}{2s} = -\dfrac{27{,}8^2}{2 \cdot 35{,}2} \approx -11{,}0\,\mathrm{m/s^2}$. Predznak je negativen, ker avto zavira.
3. Čas iz enačbe za hitrost: $t = \dfrac{v - v_0}{a} = \dfrac{0 - 27{,}8}{-11{,}0} \approx 2{,}53\,\mathrm{s}$.
4. Preverimo s povprečno hitrostjo: $s = \dfrac{v_0 + v}{2}\, t = 13{,}9 \cdot 2{,}53 \approx 35{,}2\,\mathrm{m}$. ✓
5. Odgovor: pospešek je $-11{,}0\,\mathrm{m/s^2}$, zaviranje traja okoli $2{,}5\,\mathrm{s}$. Avto torej zavira skoraj trikrat močneje, kot pospešuje ($3{,}8\,\mathrm{m/s^2}$).

### Primer 4 – zdaj ti: kri ob utripu

Ob utripu srca kri v glavni arteriji (aorti) v $0{,}10\,\mathrm{s}$ pospeši iz mirovanja do $1{,}0\,\mathrm{m/s}$ (zaokrožena tipična meritev z Dopplerjevim ultrazvokom pri zdravem odraslem). Privzemi, da je pospešek stalen; izračunal boš torej povprečnega. Kolikšen je in koliko daleč se kri premakne v tem času? Avto iz uvoda je dosegel $27{,}8\,\mathrm{m/s}$ s pospeškom $3{,}8\,\mathrm{m/s^2}$. Napovej, preden računaš: kdo pospešuje močneje?

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
$s = 0{,}050\,\mathrm{m} = 5{,}0\,\mathrm{cm}$. Pospešek je velik, a traja tako kratko, da kri pride le nekaj centimetrov. Preveri s povprečno hitrostjo: $0{,}50\,\mathrm{m/s} \cdot 0{,}10\,\mathrm{s} = 0{,}050\,\mathrm{m}$.
:::

## Pogoste napake

- **Velik pospešek pomeni veliko hitrost.** Napačno: »Kri pospešuje z $10\,\mathrm{m/s^2}$, torej teče z $10\,\mathrm{m/s}$.« Pospešek pove, koliko se hitrost spremeni v sekundi, ne kolikšna je. Popravek: končno hitrost dobiš z $v = v_0 + a t$, pri kratkem $t$ je lahko majhna.
- **Pot kot končna hitrost krat čas.** Napačno: »Avto doseže $27{,}8\,\mathrm{m/s}$ v $7{,}3\,\mathrm{s}$, torej prevozi okoli $200\,\mathrm{m}$.« Končno hitrost ima le zadnji hip. Ista napaka je $s = a t^2$ brez polovice. Popravek: množi s povprečno hitrostjo $\dfrac{v_0 + v}{2}$; polovica je ploščina trikotnika pod $v(t)$.
- **Pozabljen predznak pospeška.** Napačno: pri zaviranju vstaviš $a = +2{,}5\,\mathrm{m/s^2}$. Iz $v = v_0 + at$ potem hitrost raste, čeprav kolesar zavira. Popravek: če za pozitivno smer vzameš smer vožnje, je pri zaviranju $a$ negativen.
- **Pot raste sorazmerno s časom.** Napačno: »V dvakrat daljšem času dvakrat daljša pot«, kot pri enakomernem gibanju. Tu se hitrost med potjo veča, zato pot pri $v_0 = 0$ raste s kvadratom časa. Popravek: iz mirovanja dvojni čas pomeni štirikratno pot.
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

V aplikaciji z drsnikom zmanjšuj začetno hitrost. Pri $15\,\mathrm{m/s}$ je zavorna pot $45\,\mathrm{m}$, pri $5\,\mathrm{m/s}$ le $5\,\mathrm{m}$. Opazi, da se pot krči veliko hitreje kot hitrost.

## Drugače: Iz vsakdanjega življenja

Hitrost in pospešek sta kot **višina otroka** in **to, koliko zraste v enem letu**. Dojenček je majhen, a raste zelo hitro; odrasel je visok, a ne raste več. Velika višina ne pomeni hitre rasti in obratno. Kri v aorti je dojenček v tej primerjavi: majhna hitrost, velik pospešek. Avto pri stalnih $130\,\mathrm{km/h}$ na avtocesti je odrasel: velika hitrost, pospešek nič.

Zaviranje je enak pojav v obratni smeri. V zavorni poti $s = \dfrac{v_0^2}{2|a|}$ začetna hitrost nastopa kvadratno. Avto iz Primera 3 je iz $100\,\mathrm{km/h}$ potreboval $35{,}2\,\mathrm{m}$. Iz $50\,\mathrm{km/h}$ bi pri enakem pojemku potreboval le četrtino tega, $8{,}8\,\mathrm{m}$. Zraven pride še reakcijska pot: dokler voznik ne pritisne zavore, vozi avto enakomerno, $s = v \cdot t$. Zato je pri večji hitrosti varnostna razdalja tako pomembna.

Enakomerno pospešeno je tudi padanje. Telo, ki ga spustiš, pospešuje s približno $9{,}8\,\mathrm{m/s^2}$: po $1\,\mathrm{s}$ ima okoli $10\,\mathrm{m/s}$ in pade okoli $5\,\mathrm{m}$. Več v lekciji o prostem padu.

## Drugače: Bolj natančno

Enačba $s = v_0 t + \dfrac{a t^2}{2}$ v resnici da **premik**, to je spremembo lege, ne nujno prepotovane poti. Razlika se pokaže, ko se telo ustavi in obrne.

Vozilo iz simulacije ima $v_0 = 10\,\mathrm{m/s}$ in $a = -2{,}5\,\mathrm{m/s^2}$. Po $6\,\mathrm{s}$ enačba da

$$s = 10 \cdot 6 + \frac{(-2{,}5) \cdot 36}{2} = 60 - 45 = 15\,\mathrm{m}$$

Vozilo je torej $15\,\mathrm{m}$ pred izhodiščem. Prevozilo pa je več. Do ustavitve pri $4\,\mathrm{s}$ je naredilo $20\,\mathrm{m}$ naprej. V naslednjih $2\,\mathrm{s}$ je iz mirovanja peljalo nazaj: $\dfrac{2{,}5 \cdot 2^2}{2} = 5\,\mathrm{m}$. Premik je $20 - 5 = 15\,\mathrm{m}$, prepotovana pot pa $20 + 5 = 25\,\mathrm{m}$.

Na grafu $v(t)$ leži ta drugi del pod časovno osjo; njegova ploščina se pri premiku odšteje. Dokler se smer gibanja ne obrne, sta premik in pot enaka.

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

? Avto A vozi po avtocesti stalno s $30\,\mathrm{m/s}$. Avto B je pravkar speljal: ima šele $2\,\mathrm{m/s}$, a je vsako sekundo hitrejši. Kateri ima večji pospešek in zakaj?
- Avto A, ker je njegova hitrost veliko večja.
~ Velika hitrost ni velik pospešek. Hitrost avta A se ne spreminja, zato je njegov pospešek nič.
+ Avto B, ker se spreminja samo njegova hitrost.
- Oba enakega, ker oba vozita naprej po ravni cesti.
~ Smer vožnje pospeška ne določa. Odloča, ali se hitrost spreminja.
- Avto A, ker v vsaki sekundi prevozi več poti.
~ Pot v eni sekundi je hitrost. Pospešek pove, za koliko se hitrost v sekundi spremeni.
> Pospešek $a = \dfrac{\Delta v}{\Delta t}$ meri spreminjanje hitrosti. Pri avtu A je $\Delta v = 0$, torej $a = 0$, čeprav je hiter.

? Z grafa $v(t)$ odčitaj: kolikšno pot prevozi telo v prvih $4\,\mathrm{s}$?
:::risba graf
opis: Graf hitrosti v odvisnosti od časa. Premica gre od 2 m/s ob času 0 do 10 m/s pri 4 s.
x: 0 .. 4 | 1 | t [s]
y: 0 .. 10 | 2 | v [m/s]
f: 2 + 2*x | modra | 0 .. 4
točka: 0; 2
točka: 4; 10
:::
= 24 m | 0,5
~ 40 | To je končna hitrost krat čas, $10 \cdot 4$. Telo ima $10\,\mathrm{m/s}$ šele na koncu; pot je ploščina pod premico.
~ 16 | To je samo trikotnik $\dfrac{4 \cdot 8}{2}$. Manjka pravokotnik pod njim, $2 \cdot 4 = 8\,\mathrm{m}$.
~ 8 | To je samo pravokotnik $v_0 t$. Prištej še trikotnik nad njim, $16\,\mathrm{m}$.
~ 2 | To je naklon premice, torej pospešek v $\mathrm{m/s^2}$, ne pot.
> Ploščina pod premico: pravokotnik $2 \cdot 4 = 8\,\mathrm{m}$ in trikotnik $\dfrac{4 \cdot 8}{2} = 16\,\mathrm{m}$, skupaj $24\,\mathrm{m}$. Enako da povprečna hitrost: $6 \cdot 4 = 24\,\mathrm{m}$.

? Graf kaže pot telesa, ki spelje iz mirovanja. Z grafa $s(t)$ odčitaj: kolikšno pot naredi telo v tretji sekundi, torej med $2\,\mathrm{s}$ in $3\,\mathrm{s}$?
:::risba graf
opis: Graf poti v odvisnosti od časa od 0 do 4 s. Krivulja se začne v izhodišču in je vse strmejša: pri 1 s je pot 1 m, pri 2 s 4 m, pri 3 s 9 m in pri 4 s 16 m.
x: 0 .. 4 | 1 | t [s]
y: 0 .. 16 | 2 | s [m]
f: x*x | modra | 0 .. 4
:::
= 5 m | 0,3
~ 9 | To je skupna pot od začetka do $3\,\mathrm{s}$. Odštej pot, ki jo je telo naredilo do $2\,\mathrm{s}$.
~ 3 | To je pot v drugi sekundi, med $1\,\mathrm{s}$ in $2\,\mathrm{s}$. Tretja sekunda traja od $2\,\mathrm{s}$ do $3\,\mathrm{s}$.
~ 4 | To je pot do $2\,\mathrm{s}$. Odčitaj še pot pri $3\,\mathrm{s}$ in izračunaj razliko.
> Pri $2\,\mathrm{s}$ odčitamo $4\,\mathrm{m}$, pri $3\,\mathrm{s}$ pa $9\,\mathrm{m}$. V tretji sekundi telo naredi $9 - 4 = 5\,\mathrm{m}$, več kot v drugi ($3\,\mathrm{m}$), ker je hitrejše.

? Avto vozi s $20\,\mathrm{m/s}$ in začne enakomerno zavirati. Po $3\,\mathrm{s}$ ima še $8\,\mathrm{m/s}$. Kolikšen je njegov pospešek, če je pozitivna smer smer vožnje?
= -4 m/s² | 0,05
~ 4 | Velikost je prava, predznak ne. Hitrost se manjša, zato je pospešek negativen.
~ -12 | To je sprememba hitrosti $8 - 20$ v $\mathrm{m/s}$. Deli jo še s časom.
~ 2,7 | Delil si končno hitrost s časom. V števcu mora biti sprememba hitrosti $v - v_0$.
> $a = \dfrac{v - v_0}{t} = \dfrac{8 - 20}{3} = -4\,\mathrm{m/s^2}$. Preizkus: $v = 20 + (-4) \cdot 3 = 8\,\mathrm{m/s}$.

? Štirje avti enakomerno zavirajo do ustavitve. Razvrsti jih po zavorni poti, od najkrajše do najdaljše.
1. $v_0 = 10\,\mathrm{m/s}$, $a = -5\,\mathrm{m/s^2}$
2. $v_0 = 10\,\mathrm{m/s}$, $a = -2{,}5\,\mathrm{m/s^2}$
3. $v_0 = 20\,\mathrm{m/s}$, $a = -5\,\mathrm{m/s^2}$
4. $v_0 = 20\,\mathrm{m/s}$, $a = -2{,}5\,\mathrm{m/s^2}$
> Iz $v^2 = v_0^2 + 2as$ pri $v = 0$ dobimo $s = \dfrac{v_0^2}{2|a|}$: poti so $10\,\mathrm{m}$, $20\,\mathrm{m}$, $40\,\mathrm{m}$ in $80\,\mathrm{m}$. Polovični pojemek pot podvoji, dvojna hitrost pa jo početveri; zato dvojna hitrost šteje več.

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
