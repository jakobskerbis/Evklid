---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pišeš aplikacijo za telefon, ki na zaslonu riše zvočni signal $y = \sin x$. Program naj izpiše tudi ploščino lika med krivuljo in osjo $x$ na intervalu $[0, 2\pi]$. Prva misel je hitra: »To je kar določeni integral. $\int_0^{2\pi} \sin x\,dx = 0$, torej lik nima ploščine.«

Na zaslonu pa jasno vidiš dva loka, enega nad osjo in enega pod njo. Nekaj ni v redu. Do konca lekcije boš znal povedati, kaj, in izračunal pravo ploščino.

Ista ideja kot pri ploščini pomaga še pri dveh vprašanjih iz razvoja naprav. Koliko prostora zavzame zaobljeno ohišje zvočnika? Kako dolg je ukrivljen rob zaslona? Odgovor vsakič dobiš tako, da obliko razrežeš na tanke koščke in jih z integralom sešteješ.

## Razlaga

**1. blok: ploščina pod grafom.** Iz prejšnje teme veš: če je $f(x) \ge 0$ na $[a, b]$, je
$$A = \int_a^b f(x)\,dx$$
ploščina lika med grafom, osjo $x$ in navpičnicama $x = a$, $x = b$. Lik razrežemo na navpične trakove širine $dx$ in višine $f(x)$; integral sešteje njihove ploščine.

*Hitro preverjanje:* kolikšna je ploščina pod $y = x^2$ na $[0, 3]$? (Odgovor: $\left[\frac{x^3}{3}\right]_0^3 = 9$.)

**2. blok: ko gre graf pod os.** Kjer je $f(x) < 0$, ima trak »višino« $f(x)$, ki je negativna. Integral tak kos šteje z minusom. Pri sinusu je $\int_0^{\pi} \sin x\,dx = 2$ in $\int_{\pi}^{2\pi} \sin x\,dx = -2$. Vsota je $0$, ker se kosa izničita, ne zato, ker ploščine ni.

Ploščina je vedno pozitivna, zato vzamemo absolutno vrednost:
$$A = \int_a^b |f(x)|\,dx.$$
V praksi poiščemo ničle $f$, interval razdelimo nanje in seštejemo absolutne vrednosti posameznih integralov. Za sinus: $A = 2 + |-2| = 4$. Prva misel iz uvoda je s tem ovržena.

:::premisli
Napovej, koliko vrne $\int_{-1}^{1} x^3\,dx$ in kolikšna je ploščina lika med $y = x^3$ in osjo $x$ na $[-1, 1]$.
---
Integral je $0$, ker je $x^3$ liha funkcija in se kosa levo in desno od $0$ izničita. Ploščina pa je $2 \cdot \int_0^1 x^3\,dx = 2 \cdot \frac{1}{4} = \frac{1}{2}$.
:::

**3. blok: ploščina med dvema krivuljama.** Naj bo na $[a, b]$ graf $f$ nad grafom $g$. Trak ima zdaj višino $f(x) - g(x)$, zato
$$A = \int_a^b \big(f(x) - g(x)\big)\,dx.$$
Meji $a$ in $b$ sta pogosto presečišči krivulj: rešiš enačbo $f(x) = g(x)$. Katera krivulja je zgoraj, preveriš z eno točko med presečiščema. Lega glede na os $x$ tu ni pomembna, šteje samo razlika.

*Hitro preverjanje:* ploščina med $y = x$ in $y = x^2$ na $[0, 1]$? (Odgovor: $\frac{1}{2} - \frac{1}{3} = \frac{1}{6}$; zgoraj je $y = x$.)

**4. blok: rotacijska telesa.** Graf $f \ge 0$ na $[a, b]$ zavrtimo okoli osi $x$. Nastane **rotacijsko telo**, na primer ohišje zvočnika ali gumb. Telo razrežemo na tanke ploščice, pravokotne na os. Ploščica pri $x$ je valj s polmerom $f(x)$ in debelino $dx$, zato ima prostornino $\pi f(x)^2\,dx$. Seštevek:
$$V = \pi \int_a^b f(x)^2\,dx.$$
Če je telo votlo in je notranja stena opisana z $g$ ($0 \le g \le f$), je ploščica obroč, njena ploščina pa $\pi(f^2 - g^2)$:
$$V = \pi \int_a^b \big(f(x)^2 - g(x)^2\big)\,dx.$$

*Hitro preverjanje:* kaj dobiš, če zavrtiš $y = r$ na $[0, h]$? (Odgovor: $\pi r^2 h$, prostornina valja.)

:::premisli
Oblikovalec povsod podvoji višino profila $f$. Kolikokrat se poveča ploščina pod grafom in kolikokrat prostornina rotacijskega telesa?
---
Ploščina se podvoji, prostornina pa poveča štirikrat. V formuli za prostornino je $f^2$, ker je presek krog in je ploščina kroga sorazmerna s kvadratom polmera.
:::

**5. blok: dolžina loka.** Krivuljo $y = f(x)$ razrežemo na kratke koščke. Na koščku se $x$ spremeni za $dx$, $y$ pa približno za $f'(x)\,dx$. Košček je skoraj raven, zato po Pitagorovem izreku meri
$$\sqrt{dx^2 + \big(f'(x)\,dx\big)^2} = \sqrt{1 + f'(x)^2}\,dx.$$
Seštevek je dolžina loka:
$$L = \int_a^b \sqrt{1 + f'(x)^2}\,dx.$$
V formuli je odvod $f'$, ne $f$, ker dolžino določa naklon, ne višina.

*Hitro preverjanje:* dolžina $y = \frac{3}{4}x$ na $[0, 4]$? (Odgovor: $4 \cdot \sqrt{1 + \frac{9}{16}} = 4 \cdot \frac{5}{4} = 5$, kar je hipotenuza trikotnika $3$–$4$–$5$.)

**Vse skupaj v tabeli.** Vsaka uporaba je isti postopek z drugačno rezino:

| Kaj računamo | Tanka rezina | Prispevek rezine |
|---|---|---|
| ploščina med $f$ in $g$ | pravokotnik | $(f - g)\,dx$ |
| prostornina vrtenine | valj ali obroč | $\pi(f^2 - g^2)\,dx$ |
| dolžina loka | poševna daljica | $\sqrt{1 + f'^2}\,dx$ |

## Rešeni primeri

### Primer 1: ikona aplikacije

Ikona aplikacije ima obliko lika med premico $y = 2x$ in parabolo $y = x^2$. Enota na obeh oseh je $1\,\mathrm{cm}$. Kolikšna je ploščina ikone?

**Podatki:** $f(x) = 2x$, $g(x) = x^2$, enota $1\,\mathrm{cm}$
**Iščemo:** ploščino $A$ lika med krivuljama

:::formula
$A = \displaystyle\int_a^b \big(f(x) - g(x)\big)\,dx$, kjer je $f$ zgoraj
:::

**Rešitev:**

1. Presečišči: $x^2 = 2x \Rightarrow x(x - 2) = 0$, torej $a = 0$, $b = 2$.
2. Kdo je zgoraj: pri $x = 1$ je $2x = 2$ in $x^2 = 1$, zato je premica nad parabolo.
3. $A = \int_0^2 (2x - x^2)\,dx = \left[x^2 - \frac{x^3}{3}\right]_0^2 = 4 - \frac{8}{3} = \frac{4}{3}$.
4. Odgovor: ikona ima ploščino $\frac{4}{3}\,\mathrm{cm^2} \approx 1{,}33\,\mathrm{cm^2}$.

### Primer 2: ohišje zvočnika

Profil ohišja majhnega zvočnika je graf $y = \sqrt{x}$ za $0 \le x \le 4$ (v centimetrih). Ohišje nastane z vrtenjem profila okoli osi $x$. Kolikšna je prostornina ohišja?

**Podatki:** $f(x) = \sqrt{x}$, $a = 0\,\mathrm{cm}$, $b = 4\,\mathrm{cm}$, vrtenje okoli osi $x$
**Iščemo:** prostornino $V$

:::formula
$V = \pi \displaystyle\int_a^b f(x)^2\,dx$
:::

**Rešitev:**

1. Kvadriramo profil: $f(x)^2 = (\sqrt{x})^2 = x$. Kvadrat je dobrodošel, ker koren izgine.
2. $V = \pi \int_0^4 x\,dx = \pi \left[\frac{x^2}{2}\right]_0^4 = 8\pi$.
3. Številsko: $8\pi \approx 25{,}13$.
4. Odgovor: ohišje ima prostornino $8\pi\,\mathrm{cm^3} \approx 25{,}1\,\mathrm{cm^3}$.

### Primer 3: trak za ukrivljen zaslon (obratno vprašanje)

Rob ukrivljenega zaslona ima profil $y = \frac{2}{3}x^{3/2}$ (v centimetrih), ki se začne pri $x = 0$. Proizvajalec ima tesnilni trak dolžine $\frac{14}{3}\,\mathrm{cm}$ in ga bo nalepil vzdolž roba od $x = 0$ naprej. Do katerega $x = b$ seže trak?

**Podatki:** $f(x) = \frac{2}{3}x^{3/2}$, začetek $a = 0$, dolžina traku $L = \frac{14}{3}\,\mathrm{cm}$
**Iščemo:** končno točko $b$

:::formula
$L = \displaystyle\int_a^b \sqrt{1 + f'(x)^2}\,dx$, nato iz $L(b)$ izrazimo $b$
:::

**Rešitev:**

1. Odvod: $f'(x) = \frac{2}{3} \cdot \frac{3}{2} x^{1/2} = \sqrt{x}$, zato $1 + f'(x)^2 = 1 + x$.
2. Dolžina do točke $b$: $L(b) = \int_0^b \sqrt{1 + x}\,dx = \frac{2}{3}\left[(1 + x)^{3/2}\right]_0^b = \frac{2}{3}\left((1 + b)^{3/2} - 1\right)$.
3. Enačba $\frac{2}{3}\left((1 + b)^{3/2} - 1\right) = \frac{14}{3}$ da $(1 + b)^{3/2} = 8$.
4. Potenciramo na $\frac{2}{3}$: $1 + b = 8^{2/3} = 4$, torej $b = 3$.
5. Preizkus smiselnosti: ravna daljica od $(0, 0)$ do $(3, 2\sqrt{3})$ meri $\sqrt{21} \approx 4{,}58$, kar je malo manj od $\frac{14}{3} \approx 4{,}67$. Lok je res nekoliko daljši od tetive.
6. Odgovor: trak seže do $x = 3\,\mathrm{cm}$.

### Primer 4: zdaj ti

Aplikacija nariše signal $y = x^3 - 4x$ na $[-2, 2]$. Kolikšna je ploščina lika med signalom in osjo $x$?

**Podatki:** $f(x) = x^3 - 4x$, $a = -2$, $b = 2$
**Iščemo:** ploščino $A$

:::formula
$A = \displaystyle\int_a^b |f(x)|\,dx$; interval razdelimo v ničlah $f$
:::

**Rešitev:**

1. Ničle: $x^3 - 4x = x(x - 2)(x + 2) = 0$, torej $x = -2$, $0$, $2$.
2. Na $[-2, 0]$: $\int_{-2}^{0} (x^3 - 4x)\,dx = \left[\frac{x^4}{4} - 2x^2\right]_{-2}^{0} = 0 - (4 - 8) = 4$.
3. Izračunaj še integral na $[0, 2]$ in sestavi ploščino.

:::premisli
Kolikšna je ploščina?
---
$\int_0^2 (x^3 - 4x)\,dx = (4 - 8) - 0 = -4$, graf je tam pod osjo. Ploščina je $A = 4 + |-4| = 8$. Integral čez cel interval bi dal $0$, enako napako kot prva misel v uvodu.
:::

## Pogoste napake

- **Integral enačimo s ploščino.** »$\int_{-2}^{2} (x^3 - 4x)\,dx = 0$, torej je ploščina $0$.« Kosi pod osjo se štejejo negativno in odštejejo od kosov nad osjo. Popravek: poišči ničle, integriraj po delih in seštej absolutne vrednosti.
- **Spodnja minus zgornja.** Kdor računa $\int (g - f)\,dx$, dobi negativno »ploščino« ali pa zamenja meje, da znak popravi na slepo. Popravek: s točko med presečiščema preveri, kdo je zgoraj, in odštevaj zgornja minus spodnja.
- **Pozabljen kvadrat pri vrtenini.** $V = \pi \int f\,dx$ je napačno, ker je presek krog s ploščino $\pi f^2$. Prav tako je narobe $\pi \left(\int f\,dx\right)^2$: kvadriramo funkcijo, ne integrala.
- **Obroč kot kvadrat razlike.** Pri votlem telesu ni $\pi \int (f - g)^2\,dx$, ker ploščina obroča ni $\pi(f - g)^2$. Prav je $\pi(f^2 - g^2)$: velik krog minus luknja.
- **$f$ namesto $f'$ v dolžini loka.** $\int \sqrt{1 + f^2}\,dx$ meša višino z naklonom. Vodoravna premica $y = 5$ ima na $[0, 1]$ dolžino $1$, ne $\sqrt{26}$. Popravek: pod korenom je vedno odvod.

## Povzetek

- Ploščina med $f$ (zgoraj) in $g$ (spodaj) na $[a, b]$: $A = \int_a^b (f - g)\,dx$; meje so pogosto presečišča.
- Določeni integral ni ploščina, kadar graf seka os; ploščina je $\int_a^b |f|\,dx$, računamo po delih med ničlami.
- Vrtenina okoli osi $x$: $V = \pi \int_a^b f^2\,dx$, votla: $V = \pi \int_a^b (f^2 - g^2)\,dx$.
- Dolžina loka: $L = \int_a^b \sqrt{1 + f'^2}\,dx$; lok je vedno vsaj tako dolg kot tetiva.
- Skupna ideja: razreži na tanke rezine, zapiši prispevek ene rezine, integriraj.

## Drugače: Na sliki

Predstavljaj si tri slike, narisane ena pod drugo.

- **Ploščina.** Med dvema krivuljama stoji pokončen ozek pravokotnik. Spodnji rob se dotika $g$, zgornji $f$, širina je $dx$. Ko ga premikaš od $a$ do $b$, pobarva cel lik.
- **Vrtenina.** Isti pravokotnik se zavrti okoli osi $x$ in postane tanek kovanec s polmerom $f(x)$. Če je spodaj še $g$, ima kovanec luknjo s polmerom $g(x)$, kot podložka. Kup kovancev od $a$ do $b$ je telo.
- **Lok.** Na krivulji je kratek poševen odsek. Pod njim je pravokoten trikotnik: vodoravna kateta $dx$, navpična $f'(x)\,dx$, hipotenuza je odsek. Nanizane hipotenuze dajo krivuljo.

Pri vseh treh je integral le stroj, ki sešteje neskončno mnogo tankih kosov. Razlikuje se samo to, kaj je en kos.

## Drugače: Bolj natančno

**Ploščina.** Naj bosta $f, g$ zvezni na $[a, b]$ in $f \ge g$. Za delitev $a = x_0 < x_1 < \dots < x_n = b$ in točke $\xi_i \in [x_{i-1}, x_i]$ je $\sum_i \big(f(\xi_i) - g(\xi_i)\big)\Delta x_i$ ploščina unije pravokotnikov. Ko gre najdaljši $\Delta x_i$ proti $0$, ta Riemannova vsota konvergira k $\int_a^b (f - g)\,dx$, zato ploščino lika tako definiramo.

**Prostornina.** Ploščica na $[x_{i-1}, x_i]$ leži med valjema s polmeroma $m_i = \min f$ in $M_i = \max f$ na tem podintervalu. Prostornina telesa je torej med $\sum \pi m_i^2 \Delta x_i$ in $\sum \pi M_i^2 \Delta x_i$. Obe vsoti sta spodnja in zgornja Darbouxova vsota za $\pi f^2$ in konvergirata k $\pi \int_a^b f^2\,dx$.

**Dolžina loka.** Naj bo $f$ zvezno odvedljiva. Dolžino definiramo kot supremum dolžin včrtanih lomljenk. Odsek med $\big(x_{i-1}, f(x_{i-1})\big)$ in $\big(x_i, f(x_i)\big)$ meri $\sqrt{\Delta x_i^2 + \Delta y_i^2}$. Po Lagrangeovem izreku je $\Delta y_i = f'(\xi_i)\Delta x_i$ za neki $\xi_i$, zato je dolžina lomljenke $\sum \sqrt{1 + f'(\xi_i)^2}\,\Delta x_i$, Riemannova vsota za $\sqrt{1 + f'^2}$. Ker je $\sqrt{1 + f'^2} \ge 1$, sledi $L \ge b - a$; ker je odsek najkrajša pot, je $L$ tudi vsaj dolžina tetive.

## Preveri se

? Katera trditev je pravilna?
- $\int_a^b f(x)\,dx$ je vedno ploščina lika med grafom $f$ in osjo $x$.
~ Velja le, če je $f \ge 0$ na $[a, b]$. Kosi pod osjo prispevajo negativno.
+ Če je $f \ge g$ na $[a, b]$, je ploščina lika med grafoma $\int_a^b (f - g)\,dx$, ne glede na to, ali grafa sekata os $x$.
- Prostornina vrtenine okoli osi $x$ je $\pi$-kratnik ploščine pod grafom.
~ To bi bilo $\pi \int f\,dx$. Presek je krog s ploščino $\pi f^2$, zato je v integralu kvadrat.
> Šteje samo višina traku $f - g$, ki je pozitivna, kjerkoli leži lik glede na os.

? Kolikšna je ploščina lika med parabolo $y = x^2$ in premico $y = 4$?
- $\frac{16}{3}$
~ To je $\int_{-2}^{2} x^2\,dx$, ploščina pod parabolo. Iskani lik je nad parabolo in pod premico.
+ $\frac{32}{3}$
- $-\frac{32}{3}$
~ Odšteval si zgornja od spodnje ($x^2 - 4$). Ploščina ne more biti negativna.
> Presečišči sta $x = \pm 2$, premica je zgoraj: $\int_{-2}^{2} (4 - x^2)\,dx = 16 - \frac{16}{3} = \frac{32}{3}$.

? Kje je napaka? »Zavrtimo $y = 2x$ na $[0, 1]$ okoli osi $x$. $V = \pi \int_0^1 2x\,dx = \pi$.«
+ V integralu manjka kvadrat: pravilno je $\pi \int_0^1 4x^2\,dx = \frac{4\pi}{3}$.
- Meji sta napačni, integrirati bi morali od $0$ do $2$.
~ Meje so vrednosti $x$, ki so dane: $[0, 1]$. Število $2$ je polmer na koncu, ne meja.
- Napake ni, prostornina stožca je res $\pi$.
~ Stožec s polmerom $2$ in višino $1$ ima $V = \frac{1}{3}\pi \cdot 2^2 \cdot 1 = \frac{4\pi}{3}$.
> Presek pri $x$ je krog s polmerom $2x$ in ploščino $\pi(2x)^2$. Rezultat se ujema s formulo za stožec.

? Primerjaj dolžino loka parabole $y = x^2$ od $(0, 0)$ do $(1, 1)$ in dolžino daljice med istima točkama.
+ Lok je daljši od daljice.
- Daljica je daljša od loka.
~ Daljica je najkrajša pot med točkama, zato ne more biti daljša od nobene krivulje.
- Sta enako dolga, ker imata enaki krajišči.
~ Enaki krajišči ne pomenita enake dolžine; lok se ukrivi in prehodi več.
> Daljica meri $\sqrt{2} \approx 1{,}41$, lok $\int_0^1 \sqrt{1 + 4x^2}\,dx \approx 1{,}48$.

? Inženir želi izračunati, koliko kovinske letve potrebuje za ukrivljen rob ohišja telefona s profilom $y = f(x)$, $a \le x \le b$. Kateri integral uporabi?
- $\int_a^b f(x)\,dx$
~ To je ploščina pod robom, ne njegova dolžina.
- $\pi \int_a^b f(x)^2\,dx$
~ To je prostornina telesa, ki nastane z vrtenjem profila.
- $\int_a^b \sqrt{1 + f(x)^2}\,dx$
~ Pod korenom mora biti odvod. Dolžino določa naklon, ne višina.
+ $\int_a^b \sqrt{1 + f'(x)^2}\,dx$
> Dolžina letve je dolžina loka. Vsak kratek košček je hipotenuza trikotnika s katetama $dx$ in $f'(x)\,dx$.

:::simboli
A | ploščina lika | A = \int_a^b \big(f(x) - g(x)\big)\,dx | | pod osjo x integriramo absolutno vrednost f
a, b | meji integracije (krajišči intervala)
f | funkcija (zgornja krivulja) | | | pri vrtenini funkcija, ki jo vrtimo
g | funkcija (spodnja krivulja) | | | graf f leži nad grafom g
f' | odvod funkcije f | | | določa naklon krivulje
x | neodvisna spremenljivka
d | oznaka diferenciala (dx) v integralu
V | prostornina vrtenine okoli osi x | V = \pi \int_a^b f(x)^2\,dx
L | dolžina loka krivulje | L = \int_a^b \sqrt{1 + f'(x)^2}\,dx
:::
