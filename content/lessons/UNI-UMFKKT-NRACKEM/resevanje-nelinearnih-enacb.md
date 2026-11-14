---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Enačba $10\,t\,e^{-t/2} = 2$ je videti preprostejša od kvadratne. Pa vendar zanjo ne obstaja formula, ki bi $t$ izrazila s korenom, logaritmom ali katero drugo funkcijo s kalkulatorja. Program s petnajstimi vrsticami jo kljub temu reši na deset decimalk, in to v štirih korakih. Brez formule, z **ugibanjem, ki se samo popravlja**.

Od kod enačba? Bolnik zaužije tableto. Koncentracija zdravila v krvni plazmi je približno

$$c(t) = 10\,t\,e^{-t/2},$$

kjer je $t$ čas v urah, $c$ pa v $\mathrm{mg/L}$. Zdravilo deluje le, ko je $c \ge 2\,\mathrm{mg/L}$. Farmacevt mora vedeti, kdaj koncentracija pade pod to mejo, da predpiše čas naslednjega odmerka. Odgovor je rešitev zgornje enačbe.

Podobne enačbe dajo pH šibke kisline ali prostornina realnega plina po van der Waalsu. Rešuješ jih z dvema metodama, ki ju sprogramiraš z zankami in funkcijami: **bisekcijo** in **Newtonovo metodo**.

## Razlaga

**Prva skušnjava: osamimo neznanko.** Iz $10\,t\,e^{-t/2} = 2$ dobimo $t = 0{,}2\,e^{t/2}$. Videti je, kot da smo $t$ izrazili, a $t$ je še vedno na obeh straneh. Vsak drug poskus se konča enako, ker je $t$ hkrati pred eksponentno funkcijo in v njenem eksponentu. Enačba je **nelinearna**: v linearni bi neznanka nastopala le kot $k \cdot t$ (konstanta krat $t$), tu pa stoji tudi v eksponentu.

Popravek je v drugačnem vprašanju. Vse prenesemo na eno stran:

$$f(t) = 10\,t\,e^{-t/2} - 2 = 0.$$

Iščemo **ničlo** funkcije $f$, torej $t$, pri katerem je $f(t) = 0$. Vrednost $f(t)$ pa znamo izračunati za vsak $t$. To je dovolj.

**Slika v besedah.** Koncentracija od $0$ hitro naraste, pri $t = 2\,\mathrm{h}$ doseže vrh $c \approx 7{,}36\,\mathrm{mg/L}$ in nato počasi upada. Graf $f$ je isti graf, premaknjen za $2$ navzdol. Os $t$ seka dvakrat: kmalu po zaužitju (zdravilo začne delovati) in nekaj ur pozneje (neha delovati).

**Druga skušnjava: isti predznak pomeni, da ničle ni.** Če ima zvezna funkcija na krajiščih intervala $[a, b]$ **različna predznaka**, mora graf vmes vsaj enkrat prečkati os. To zagotavlja izrek o vmesnih vrednostih (Bolzanov izrek). Obrat pa ne velja.

:::premisli
Velja $f(0) = -2$ in $f(12) \approx -1{,}70$, obe vrednosti sta negativni. Koliko ničel ima $f$ na $[0, 12]$? Pomagaj si s sliko v besedah zgoraj.
---
Sta celo dve, pri $t \approx 0{,}22\,\mathrm{h}$ in $t \approx 7{,}15\,\mathrm{h}$. Graf se vmes dvigne nad os in se vrne pod njo. Enak predznak na krajiščih pomeni le, da ne vemo ničesar: ničel je lahko nič, ena (kjer se graf osi le dotakne), dve ali več.
:::

**Bisekcija (metoda razpolavljanja).** Vzamemo interval, na katerem $f$ zamenja predznak, na primer $[6, 8]$: $f(6) \approx 0{,}987 > 0$ in $f(8) \approx -0{,}535 < 0$. Izračunamo vrednost v sredini $m = \frac{a+b}{2}$. Ohranimo tisto polovico, kjer se predznak še menja. Interval se v vsakem koraku razpolovi, ničla pa je ves čas ujeta v njem.

| korak | interval | sredina $m$ | $f(m)$ |
|---|---|---|---|
| 1 | $[6;\ 8]$ | $7$ | $+0{,}114$ |
| 2 | $[7;\ 8]$ | $7{,}5$ | $-0{,}236$ |
| 3 | $[7;\ 7{,}5]$ | $7{,}25$ | $-0{,}068$ |
| 4 | $[7;\ 7{,}25]$ | $7{,}125$ | $+0{,}021$ |

Po štirih korakih vemo, da je ničla v $[7{,}125;\ 7{,}25]$. Bisekcija je počasna, a **zanesljiva**: če je $f$ zvezna in sta predznaka na začetku različna, vedno pride do ničle.

**Tretja skušnjava: hitrejša metoda je vedno boljša.** Newtonova (tangentna) metoda začne z enim **začetnim približkom** $x_0$. V točki $(x_0, f(x_0))$ potegnemo tangento na graf in pogledamo, kje seka os $x$. To presečišče je novi približek:

$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}.$$

Blizu dotikališča se tangenta grafu dobro prilega, zato je njeno presečišče z osjo pogosto skoraj ničla. Za naš $f$ je $f'(t) = 10\,e^{-t/2}\left(1 - \frac{t}{2}\right)$. Iz $t_0 = 8$ dobimo $t_1 \approx 7{,}0268$, $t_2 \approx 7{,}1519$, $t_3 \approx 7{,}1543$, kar je že pravilno na štiri decimalke.

A Newtonova metoda ima ceno. Potrebuje odvod, nima ujetega intervala in lahko odpove.

:::premisli
Kaj se zgodi, če Newtonovo metodo začnemo pri $t_0 = 2$, ravno ob vrhu koncentracije?
---
Pri vrhu je $f'(2) = 0$: tangenta je vodoravna in osi nikoli ne seka. V formuli delimo z nič, program se ustavi z napako. Že blizu vrha je $f'$ majhen in naslednji približek odleti zelo daleč.
:::

**Konvergenca.** Metoda **konvergira**, če se zaporedje približkov $x_0, x_1, x_2, \dots$ čedalje bolj približuje ničli $r$. Kako hitro, pove obnašanje napake $e_n = |x_n - r|$:

- **Bisekcija: linearna konvergenca.** Širina intervala se v vsakem koraku razpolovi. Za eno decimalko več potrebuješ približno $3{,}3$ koraka, ker je $2^{3{,}3} \approx 10$.
- **Newton: kvadratična konvergenca.** Blizu ničle je nova napaka sorazmerna s kvadratom stare, $e_{n+1} \approx C\,e_n^2$. Število pravilnih decimalk se v vsakem koraku približno podvoji.

Ker metoda ničle ne zadene točno, program potrebuje **ustavitveni pogoj**: zanko končamo, ko je popravek $|x_{n+1} - x_n|$ (pri bisekciji širina intervala) manjši od izbrane **tolerance** $\varepsilon$. Pri Newtonu dodamo še največje dovoljeno število korakov, sicer se zanka lahko vrti v nedogled.

```python
from math import exp

def f(t):
    return 10*t*exp(-t/2) - 2

def df(t):
    return 10*exp(-t/2)*(1 - t/2)

def bisekcija(f, a, b, tol):
    if f(a)*f(b) > 0:
        raise ValueError("f(a) in f(b) morata imeti različna predznaka")
    while b - a > tol:
        m = (a + b)/2
        if f(a)*f(m) <= 0:
            b = m        # ničla je v levi polovici
        else:
            a = m        # ničla je v desni polovici
    return (a + b)/2

def newton(f, df, x, tol, max_korakov=50):
    for k in range(max_korakov):
        popravek = f(x)/df(x)
        x = x - popravek
        if abs(popravek) < tol:
            return x
    raise RuntimeError("Newtonova metoda ni konvergirala")

print(bisekcija(f, 6, 8, 1e-6), newton(f, df, 8, 1e-10))
```

V praksi metodi pogosto združimo: nekaj korakov bisekcije za varen interval, nato Newton za hitro natančnost.

## Rešeni primeri

### Primer 1: bisekcija na roke

Koncentracija zdravila je $c(t) = 10\,t\,e^{-t/2}$ ($t$ v urah, $c$ v $\mathrm{mg/L}$). Najmanjša učinkovita koncentracija je $2\,\mathrm{mg/L}$. Z dvema korakoma bisekcije na intervalu $[6, 8]$ zoži interval, v katerem koncentracija pade pod mejo.

**Podatki:** $c(t) = 10\,t\,e^{-t/2}$, meja $c = 2\,\mathrm{mg/L}$, začetni interval $[6\,\mathrm{h},\ 8\,\mathrm{h}]$, $2$ koraka
**Iščemo:** interval širine $0{,}5\,\mathrm{h}$, ki vsebuje ničlo $f(t) = c(t) - 2$

:::formula
$m = \dfrac{a+b}{2}$; obdržimo polovico, na kateri imata krajišči različna predznaka $f$.
:::

**Rešitev:**

1. Preverimo začetek: $f(6) \approx +0{,}987$, $f(8) \approx -0{,}535$. Predznaka sta različna, zato je ničla v $[6, 8]$.
2. Prvi korak: $m = \frac{6 + 8}{2} = 7$, $f(7) \approx +0{,}114$. Ker je $f(7)$ pozitiven kot $f(6)$, je sprememba predznaka v desni polovici: nov interval $[7, 8]$.
3. Drugi korak: $m = \frac{7 + 8}{2} = 7{,}5$, $f(7{,}5) \approx -0{,}236$. Zdaj je negativen kot $f(8)$, zato ostane leva polovica: $[7;\ 7{,}5]$.
4. Odgovor: koncentracija pade pod $2\,\mathrm{mg/L}$ med $7$ in $7{,}5$ urami po zaužitju.

### Primer 2: trije Newtonovi koraki

Za isto zdravilo poišči trenutek, ko koncentracija pade pod $2\,\mathrm{mg/L}$, z Newtonovo metodo. Začni pri $t_0 = 8\,\mathrm{h}$ in naredi tri korake.

**Podatki:** $f(t) = 10\,t\,e^{-t/2} - 2$, $f'(t) = 10\,e^{-t/2}\left(1 - \frac{t}{2}\right)$, $t_0 = 8\,\mathrm{h}$, $3$ koraki
**Iščemo:** približek $t_3$ in čas v urah in minutah

:::formula
$t_{n+1} = t_n - \dfrac{f(t_n)}{f'(t_n)}$
:::

**Rešitev:**

1. $f(8) \approx -0{,}53475$, $f'(8) \approx -0{,}54947$, količnik $\approx 0{,}97321$, zato $t_1 \approx 8 - 0{,}97321 = 7{,}02679 \approx 7{,}0268$. Prvi skok je velik, ker smo daleč od ničle.
2. $f(7{,}0268) \approx 0{,}09367$, $f'(7{,}0268) \approx -0{,}74888$, količnik $\approx -0{,}12507$, zato $t_2 \approx 7{,}0268 + 0{,}12507 \approx 7{,}1519$. Predznak $f$ se je obrnil: tangenta nas je vrgla malo čez ničlo in zdaj se vračamo.
3. $f(7{,}1519) \approx 0{,}00173$, $f'(7{,}1519) \approx -0{,}72098$, količnik $\approx -0{,}00240$, zato $t_3 \approx 7{,}1519 + 0{,}00240 \approx 7{,}1543$. Popravek je že tako majhen, da se četrta decimalka ne bo več spremenila.
4. Pretvorba: $0{,}1543 \cdot 60 \approx 9{,}3$ minute.
5. Odgovor: koncentracija pade pod mejo približno $7{,}154\,\mathrm{h}$, torej $7$ ur in $9$ minut po zaužitju. Bisekcija bi za enako natančnost potrebovala več kot deset korakov.

### Primer 3: koliko korakov zanke?

Funkcijo `bisekcija` iz razlage pokličemo na intervalu $[6, 8]$. Klinični farmacevt želi čas na minuto natančno, raziskovalec v laboratoriju pa na sekundo. Koliko razpolovitev potrebuje vsak? Zanka se ustavi, ko je širina intervala manjša ali enaka toleranci.

**Podatki:** začetna širina $b - a = 2\,\mathrm{h}$, toleranca $\varepsilon_1 = 1\,\mathrm{min} = \frac{1}{60}\,\mathrm{h}$, $\varepsilon_2 = 1\,\mathrm{s} = \frac{1}{3600}\,\mathrm{h}$
**Iščemo:** najmanjše število korakov $n_1$ in $n_2$

:::formula
Po $n$ korakih je širina $\dfrac{b-a}{2^n}$; zahtevamo $\dfrac{b-a}{2^n} \le \varepsilon$, torej $2^n \ge \dfrac{b-a}{\varepsilon}$.
:::

**Rešitev:**

1. Na minuto: $2^n \ge \dfrac{2}{1/60} = 120$. Ker je $2^6 = 64$ premalo in $2^7 = 128$ dovolj, je $n_1 = 7$.
2. Preverimo: $\dfrac{2\,\mathrm{h}}{128} \approx 0{,}0156\,\mathrm{h} \approx 0{,}94\,\mathrm{min}$, kar je pod eno minuto.
3. Na sekundo: $2^n \ge \dfrac{2}{1/3600} = 7200$. Ker je $2^{12} = 4096$ premalo in $2^{13} = 8192$ dovolj, je $n_2 = 13$.
4. Odgovor: farmacevt potrebuje $7$ korakov, raziskovalec $13$. Šestdesetkrat večja natančnost stane le $6$ korakov več, ker je $2^6 = 64 \approx 60$.

### Primer 4 – zdaj ti: kdaj zdravilo začne delovati

Isti bolnik, isto zdravilo. Poišči prvo ničlo, ko koncentracija kmalu po zaužitju preseže $2\,\mathrm{mg/L}$. Začni pri $t_0 = 0$ in naredi dva Newtonova koraka.

**Podatki:** $f(t) = 10\,t\,e^{-t/2} - 2$, $f'(t) = 10\,e^{-t/2}\left(1 - \frac{t}{2}\right)$, $t_0 = 0\,\mathrm{h}$, $2$ koraka
**Iščemo:** $t_2$ v urah in v minutah

:::formula
$t_{n+1} = t_n - \dfrac{f(t_n)}{f'(t_n)}$
:::

**Rešitev:**

1. $f(0) = -2$, $f'(0) = 10$, zato $t_1 = 0 - \frac{-2}{10} = 0{,}2$.
2. V $t_1 = 0{,}2$ je $f(0{,}2) \approx -0{,}19033$ in $f'(0{,}2) \approx 8{,}14354$.
3. Izračunaj $t_2$ in ga pretvori v minute, nato preveri:

:::premisli
Koliko je $t_2$ in koliko minut je to?
---
$t_2 = 0{,}2 - \dfrac{-0{,}19033}{8{,}14354} \approx 0{,}2 + 0{,}02337 \approx 0{,}2234\,\mathrm{h}$, kar je $0{,}2234 \cdot 60 \approx 13{,}4$ minute. Zdravilo začne delovati približno $13$ minut po zaužitju. Naslednji korak bi dal $0{,}22367$, popravek je le še $0{,}0003\,\mathrm{h}$, približno sekunda.
:::

## Pogoste napake

- **»Na krajiščih je isti predznak, torej ničle ni.«** Na $[0, 12]$ sta obe vrednosti negativni, ničli pa sta dve. Različna predznaka zagotavljata vsaj eno ničlo; enaka predznaka ne povesta ničesar. Pred bisekcijo si funkcijo tabeliraj ali nariši v preglednici.
- **»Newton vedno najde ničlo, ki je najbližje začetku.«** Iz $t_0 = 12$ tangenta, ki je skoraj vodoravna, pošlje približek na $t_1 \approx -1{,}74$, torej pred zaužitje. Metoda nato konvergira k ničli $0{,}22\,\mathrm{h}$, ne k bližnji $7{,}15\,\mathrm{h}$. Začni blizu ničle, ki jo iščeš, na primer z intervalom iz bisekcije.
- **Obrnjen predznak ali obrnjen ulomek.** $x_{n+1} = x_n + \frac{f}{f'}$ ali $x_n - \frac{f'}{f}$ približke odnaša stran od ničle. Tangenta seka os v $x_n - \frac{f(x_n)}{f'(x_n)}$; preveri na $x^2 - 2$ z $x_0 = 1$, kjer moraš dobiti $1{,}5$.
- **»Deset korakov bisekcije je deset decimalk.«** Korak napako le razpolovi, za decimalko jih potrebuješ okoli $3{,}3$. Deset korakov da približno tri decimalke, ker je $2^{10} = 1024$.
- **»Metoda je konvergirala, torej je rezultat točen.«** Rezultat je točen le do tolerance. Zanka brez zgornje meje korakov pa se lahko, ko metoda ne konvergira, vrti v nedogled.

## Povzetek

- Nelinearne enačbe zapišemo kot $f(x) = 0$ in iščemo ničlo numerično, ko formule ni.
- Bisekcija: začni z $[a, b]$, kjer $f(a)$ in $f(b)$ nimata istega predznaka; razpolavljaj in obdrži polovico s spremembo predznaka. Po $n$ korakih je širina $\frac{b-a}{2^n}$. Zanesljiva, linearna konvergenca.
- Newtonova metoda: $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$. Potrebuje odvod in dober začetni približek; blizu ničle kvadratična konvergenca (decimalke se podvajajo). Odpove pri $f'(x_n) \approx 0$ ali lahko skoči k drugi ničli.
- Ustavitveni pogoj: popravek oziroma širina intervala pod toleranco in največje število korakov.
- Primer: zdravilo s $c(t) = 10\,t\,e^{-t/2}$ deluje od približno $0{,}22\,\mathrm{h}$ do $7{,}15\,\mathrm{h}$ po zaužitju.

## Drugače: Kot zgodba

Na urgenci dežurata dve specializantki, Maja in Nina. Primarij jima naroči, naj ugotovita, kdaj bo zdravilo nehalo delovati.

Maja je previdna. Ve, da ob šestih urah zdravilo še deluje, ob osmih ne več. Vpraša laboratorij: »Kaj pa ob sedmih?« Še deluje. »Ob pol osmih?« Ne več. Vsak odgovor ji razpolovi negotovost, kot pri igri »ugani število med 1 in 1000«, kjer z desetimi vprašanji vedno zmaga. Nikoli se ne zmoti, a za minutno natančnost potrebuje sedem vprašanj.

Nina je drznejša. Pogleda, kako hitro koncentracija ob osmih upada, in reče: »Če bi padala s to hitrostjo, bi bila na meji eno uro prej.« Preveri, popravi, in po treh popravkih ima čas na sekundo natančno. Naslednji dan pa isto oceno začne pri dvanajstih urah. Ker je tam krivulja skoraj ravna, njena ocena »izračuna«, da je meja padla že pred zaužitjem. Šele čez nekaj korakov pristane, a pri napačnem odgovoru: kdaj je zdravilo *začelo* delovati.

Maja je bisekcija, Nina Newtonova metoda. Najboljša je ekipa: Maja za grobo oceno, Nina za natančnost.

## Drugače: Korak za korakom s številkami

Tabela napak za ničlo $r \approx 7{,}154304$ (iz Newtona začnemo pri $8$, bisekcijo na $[6, 8]$):

| $n$ | širina pri bisekciji | Newton $t_n$ | napaka Newtona |
|---|---|---|---|
| 0 | $2$ | $8$ | $0{,}85$ |
| 1 | $1$ | $7{,}0268$ | $0{,}13$ |
| 2 | $0{,}5$ | $7{,}1519$ | $0{,}0024$ |
| 3 | $0{,}25$ | $7{,}1543$ | $9 \cdot 10^{-7}$ |
| 4 | $0{,}125$ | $7{,}154304$ | $1 \cdot 10^{-13}$ |

Kaj opaziš:

1. Stolpec bisekcije se vsakič razpolovi, enakomerno in predvidljivo.
2. Pri Newtonu se eksponent napake približno podvoji: $10^{-3}$, nato $10^{-7}$, nato $10^{-13}$.
3. Po štirih korakih ima Newton napako $10^{-13}$, blizu natančnosti računalnika, bisekcija pa šele pri širini $0{,}125\,\mathrm{h}$.

V preglednici: stolpec A $t_n$, B $f(t_n)$, C $f'(t_n)$, naslednja celica v A pa $t_n - f(t_n)/f'(t_n)$. Formulo povleci navzdol in opazuj, kdaj se števke ustalijo.

## Drugače: Bolj natančno

*Bisekcija.* Če je $f$ zvezna na $[a, b]$ in je $f(a)\,f(b) < 0$, po Bolzanovem izreku obstaja $r \in (a, b)$ s $f(r) = 0$. Sredine $m_n$ zadoščajo $|m_n - r| \le \frac{b-a}{2^{n+1}}$, zato $m_n \to r$.

*Newton.* Naj bo $f$ dvakrat zvezno odvedljiva, $f(r) = 0$ in $f'(r) \ne 0$. Taylorjev razvoj okoli $x_n$ da

$$x_{n+1} - r = \frac{f''(\xi_n)}{2 f'(x_n)}\,(x_n - r)^2$$

za neki $\xi_n$ med $x_n$ in $r$. Zato obstaja okolica ničle, v kateri metoda konvergira, in sicer kvadratično: $e_{n+1} \approx \left|\frac{f''(r)}{2f'(r)}\right| e_n^2$. Za naš primer je $\left|\frac{f''(r)}{2f'(r)}\right| \approx 0{,}153$ in $0{,}153 \cdot 0{,}0024^2 \approx 9 \cdot 10^{-7}$, kar se ujema s tabelo. Pri večkratni ničli ($f'(r) = 0$) je konvergenca le linearna.

## Preveri se

? Program za izračun časa delovanja zdravila izpiše »Newtonova metoda je konvergirala«. Kaj to pomeni?
- Dobili smo točno vrednost ničle, brez kakršne koli napake.
~ Numerična metoda ničle skoraj nikoli ne zadene točno; ustavi se, ko je popravek manjši od tolerance.
+ Približki so se ustalili: zadnji popravek je bil manjši od izbrane tolerance.
- Funkcija ima na krajiščih intervala različna predznaka.
~ To je začetni pogoj za bisekcijo, ne pomen konvergence. Newton sploh ne dela z intervalom.
- Zanka je izvedla vse dovoljene korake.
~ Ravno nasprotno: če zmanjka korakov, metoda ni konvergirala in program javi napako.
> Konvergenca pomeni, da se zaporedje približkov približuje ničli; v programu to prepoznamo po tem, da je popravek $|x_{n+1} - x_n|$ padel pod toleranco.

? Ničlo na $[6, 8]$ iščemo na $10^{-6}\,\mathrm{h}$ natančno. Newton začne pri $t_0 = 8$. Razvrsti postopke od najmanj do največ izračunanih korakov.
- Bisekcija, Newton, tabeliranje s korakom $10^{-6}$
~ Bisekcija je zanesljiva, a linearna: potrebuje $21$ korakov, Newton pa le okoli $4$.
+ Newton, bisekcija, tabeliranje s korakom $10^{-6}$
- Newton, tabeliranje s korakom $10^{-6}$, bisekcija
~ Tabeliranje s korakom $10^{-6}$ na intervalu dolžine $2$ pomeni dva milijona vrednosti; to je daleč največ.
> Newton potrebuje okoli $4$ korake (decimalke se podvajajo), bisekcija $21$ (ker je $2^{21} \ge 2 \cdot 10^6$), tabeliranje pa $2 \cdot 10^6$ izračunov.

? Kaj se zgodi, če Newtonovo metodo za $f(t) = 10\,t\,e^{-t/2} - 2$ začnemo pri $t_0 = 12$, kjer je krivulja skoraj ravna?
- Hitro konvergira k najbližji ničli $t \approx 7{,}15$.
~ Newton ne išče najbližje ničle; skoraj vodoravna tangenta ga vrže daleč stran.
+ Prvi korak skoči na $t_1 \approx -1{,}74$, nato metoda konvergira k drugi ničli $t \approx 0{,}22$.
- Metoda se takoj ustavi, ker je $f'(12) = 0$.
~ Odvod je ničeln le pri vrhu, $t = 2$. Pri $t = 12$ je majhen, $f'(12) \approx -0{,}124$, zato je skok ogromen, deljenja z nič pa ni.
> $t_1 = 12 - \frac{-1{,}703}{-0{,}124} \approx -1{,}74$. Od tam metoda konvergira, a k ničli $0{,}22\,\mathrm{h}$. Konvergenca ni zagotovljena k ničli, ki jo želimo.

? Z Newtonovo metodo rešujemo $x^2 - 2 = 0$ in začnemo pri $x_0 = 1$. Koliko je $x_1$?
- $0{,}5$
~ To dobiš z obrnjenim predznakom, $x_0 + \frac{f}{f'}$. Pravilno se popravek odšteje.
- $3$
~ To dobiš z obrnjenim ulomkom, $x_0 - \frac{f'}{f} = 1 - \frac{2}{-1}$.
+ $1{,}5$
> $f(1) = -1$, $f'(1) = 2$, zato $x_1 = 1 - \frac{-1}{2} = 1{,}5$. Naslednji koraki dajo $1{,}41667$ in $1{,}414216$, kar je $\sqrt{2}$.

? Bisekcijo začnemo na $[0, 1]$. Koliko korakov potrebujemo, da je širina intervala največ $0{,}001$?
- $3$
~ En korak ne prinese cele decimalke, le razpolovi interval. Za decimalko je treba okoli $3{,}3$ koraka.
- $1000$
~ To bi bilo tabeliranje s korakom $0{,}001$. Bisekcija vsakič prepolovi interval, zato natančnost raste eksponentno, kot $2^n$.
+ $10$
> $2^n \ge \frac{1}{0{,}001} = 1000$. Ker je $2^9 = 512$ premalo in $2^{10} = 1024$ dovolj, je $n = 10$.

:::simboli
c | koncentracija zdravila v krvi | | mg/L | v zgledu $c(t) = 10\,t\,e^{-t/2}$; deluje pri $c \ge 2\,\mathrm{mg/L}$
t | čas od zaužitja | | h
e | Eulerjevo število | | | e ≈ 2,718
f | funkcija, katere ničlo iščemo | | | v zgledu f(t) = c(t) − 2
f' | odvod funkcije f
f'' | drugi odvod funkcije f
x_n | n-ti približek ničle
x_{n+1} | naslednji približek (Newtonova metoda) | x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}
t_n | n-ti približek časa | | h
t_{n+1} | naslednji približek časa | t_{n+1} = t_n - \frac{f(t_n)}{f'(t_n)} | h
r | ničla (točna rešitev enačbe) | | | napaka približka je razdalja med xₙ in r
\xi_n | vmesna točka med xₙ in r
a, b | krajišči intervala z ničlo | | | f(a) in f(b) imata različna predznaka
m | sredina intervala (bisekcija) | m = \frac{a+b}{2}
n | število korakov (zaporedna številka približka)
\varepsilon | toleranca (dovoljena napaka) | | | ustavitveni pogoj
:::
