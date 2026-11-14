---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Racionalne neenačbe matura preverja samo na višji ravni.*

Reši $\frac{1}{x} < 1$. Videti je lahko: pomnožiš z $x$ in dobiš $1 < x$. Zdaj vstavi $x = -2$. Velja $\frac{1}{-2} = -0{,}5$, kar je manj kot $1$. Število $-2$ torej neenačbo reši, čeprav ni večje od $1$. Na videz pravilno računanje je izgubilo cel kup rešitev.

Kje se je zalomilo? Odgovor je glavna misel te teme. Potreboval jo boš tudi pri zvoku: ko reševalno vozilo s sireno pelje proti tebi, slišiš višji ton, kot ga sirena oddaja. Razmerje frekvenc je ulomek, v katerem je hitrost vozila v imenovalcu. Vprašanje »Kdaj slišim ton vsaj pol tona višje?« je racionalna neenačba. Z napačnim množenjem dobiš tudi hitrosti, pri katerih formula ne pomeni ničesar.

## Razlaga

Vzemimo isto neenačbo $\frac{1}{x} < 1$ in jo rešimo do konca. Šele nato iz nje izluščimo postopek.

**1. Kje je bila past.** Pri množenju s pozitivnim številom znak neenačbe ostane, pri množenju z negativnim se obrne. Predznaka $x$ ne poznamo, zato z njim **ne smemo množiti**. Raje vse prenesemo na eno stran, da je na drugi $0$:

$$\frac{1}{x} - 1 < 0$$

Nato zapišemo levo stran kot en ulomek:

$$\frac{1 - x}{x} < 0$$

Zdaj sprašujemo le še po **predznaku** ulomka.

**2. Tabela predznakov.** Ulomek lahko zamenja predznak le tam, kjer je števec ali imenovalec enak $0$. Ničla števca, $x = 1$, je **ničla** ulomka. Ničla imenovalca, $x = 0$, je **pol**: tam ulomek ni definiran. Ti dve števili razdelita realno os na tri intervale. Na vsakem je predznak stalen, zato zadošča eno testno število.

| interval | $1 - x$ | $x$ | $\frac{1 - x}{x}$ |
|---|---|---|---|
| $(-\infty, 0)$ | $+$ | $-$ | $-$ |
| $(0, 1)$ | $+$ | $+$ | $+$ |
| $(1, \infty)$ | $-$ | $+$ | $-$ |

Iščemo negativne vrednosti: $x \in (-\infty, 0) \cup (1, \infty)$. Pri $x = 1$ je ulomek $0$, kar ni manj od $0$; pri $x = 0$ ga sploh ni. Naivno množenje je izgubilo vsa negativna števila.

**3. Isto na grafu.** Neenačba $f(x) < 0$ za $f(x) = \frac{1 - x}{x}$ sprašuje, kje leži graf pod osjo $x$.

:::risba graf
opis: Graf funkcije f(x) = (1 − x)/x. Navpična asimptota je os y (pol 0), vodoravna asimptota je y = −1. Graf seka os x pri x = 1. Levo od 0 je ves graf pod osjo x (znak minus), med 0 in 1 nad njo (znak plus), desno od 1 spet pod njo (znak minus).
x: -4 .. 4
y: -6 .. 4
f: (1-x)/x | modra | -4 .. -0,25
f: (1-x)/x | modra | 0,25 .. 4
črta: -4; -1 -> 4; -1 | črtkano siva
točka: 1; 0 | 1 | nad
napis: -2; 2 | − | sredina | debelo
napis: 0,6; 3,5 | + | desno | debelo
napis: 2,5; 2 | − | sredina | debelo
:::

Graf seka os $x$ v ničli, ob polu skoči z ene strani osi na drugo. Tabela predznakov je torej le zapis tega, kar pokaže graf racionalne funkcije.

**4. Splošni postopek.** Neenačbi, v kateri je neznanka v imenovalcu, rečemo **racionalna neenačba**. Vsako prevedemo na obliko

$$\frac{p(x)}{q(x)} > 0$$

(ali z $<$, $\ge$, $\le$), kjer sta $p$ in $q$ polinoma. Koraki:

1. Vse člene prenesi na eno stran, na drugi naj ostane $0$. Ne množi z izrazom neznanega predznaka.
2. Zapiši levo stran kot en ulomek.
3. Razstavi števec in imenovalec. Poišči ničle (iz števca) in pole (iz imenovalca).
4. Izpolni tabelo predznakov: vrstice so intervali, stolpci faktorji, zadnji stolpec ulomek.
5. Izberi intervale s pravim predznakom in odloči o krajiščih.

Kadar je faktorjev več, v en stolpec zapiši predznak celega števca, v drugega predznak celega imenovalca. Tako tabela ostane pregledna, ne glede na število intervalov.

**5. Krajišča.** Pri $<$ in $>$ so vsa krajišča odprta. Pri $\le$ in $\ge$ ničle vključiš, saj je ulomek tam $0$. Polov ne vključiš **nikoli**: tam ulomek ne obstaja.

:::premisli
Pri $\frac{x - 2}{x + 1} \ge 0$ je $-1$ pol, $2$ pa ničla. Zapiši rešitev kot unijo intervalov, preden pogledaš. Pri katerem krajišču uporabiš oglati oklepaj?
---
Ulomek je pozitiven levo od $-1$ in desno od $2$ (preizkus: $x = -2$ da $4$, $x = 0$ da $-2$, $x = 3$ da $\frac{1}{4}$). Vključiš ničlo $2$: ulomek je tam $0$ in $0 \ge 0$ drži. Pola $-1$ ne, ker imenovalec tam postane $0$. Rešitev je $(-\infty, -1) \cup [2, \infty)$.
:::

**6. Dvojne ničle in poli sode stopnje.** Iz grafa polinoma veš, da se graf ob ničli sode stopnje osi le dotakne in predznak ostane. Enako velja za pol sode stopnje: obe veji gresta v isto smer. Zato se predznaki v tabeli ne izmenjujejo samodejno. Vsak faktor obravnavaj posebej: $(x - 2)^2$ je povsod nenegativen.

:::premisli
Sošolec pri $\frac{(x - 2)^2}{x + 3} > 0$ po intervalih od desne kar izmenično piše $+$, $-$, $+$. Katera intervala obravnava napačno in kakšna je prava rešitev?
---
Faktor $(x - 2)^2$ pri $x = 2$ ne zamenja predznaka. Ulomek je za vse $x > -3$ pozitiven, razen pri $x = 2$, kjer je $0$. Rešitev je $(-3, 2) \cup (2, \infty)$. Izmenično pisanje od desne bi interval $(-3, 2)$ napačno izločilo in $(-\infty, -3)$ napačno vzelo.
:::

V simulaciji spodaj (»Predznak racionalne funkcije«) nastavi $a = 1$, ničlo $2$, pol $-1$ in stopnjo pola $1$. Graf je nad osjo levo od $-1$ in desno od $2$. Nato stopnjo pola preklopi na $2$. Opazi, da graf ob polu ostane na isti strani osi: tam se predznak ne zamenja več.

## Rešeni primeri

### Primer 1 (lažji): na desni ni $0$

Reši neenačbo $\frac{x + 5}{x - 1} \ge 2$.

**Podatki:** $\frac{x + 5}{x - 1} \ge 2$, $x \in \mathbb{R}$
**Iščemo:** vse $x$, ki ustrezajo neenačbi

:::formula
Oblika $\dfrac{p(x)}{q(x)} \ge 0$; ničle vključimo, pole izločimo.
:::

**Rešitev:**

1. Prenesemo na eno stran: $\frac{x + 5}{x - 1} - 2 \ge 0$. Z $x - 1$ ne množimo, ker ne poznamo njegovega predznaka.
2. En ulomek: $\frac{x + 5 - 2(x - 1)}{x - 1} = \frac{7 - x}{x - 1} \ge 0$.
3. Ničla $x = 7$, pol $x = 1$.
4. Tabela predznakov:

| interval | $7 - x$ | $x - 1$ | ulomek |
|---|---|---|---|
| $(-\infty, 1)$ | $+$ | $-$ | $-$ |
| $(1, 7)$ | $+$ | $+$ | $+$ |
| $(7, \infty)$ | $-$ | $+$ | $-$ |

5. Ulomek je pozitiven na $(1, 7)$. Ničlo $7$ vključimo, ker velja $\ge$; pol $1$ izločimo.
6. Preizkus: pri $x = 3$ je $\frac{8}{2} = 4 \ge 2$. Pri $x = 0$ je $\frac{5}{-1} = -5$, kar ni $\ge 2$, čeprav bi »pomnožena« neenačba ($x + 5 \ge 2x - 2$, torej $x \le 7$) število $0$ sprejela.
7. Odgovor: $x \in (1, 7]$.

:::risba premica
opis: Številska premica od −1 do 9. Rešitev je interval od 1 do 7. Pri 1 je prazna pika (pol, ni vključen), pri 7 polna pika (ničla, vključena).
od: -1
do: 9
interval: 1 .. 7 | rešitev
točka: 1 | pol | prazna
točka: 7 | ničla
:::

### Primer 2: dvojna ničla

Reši neenačbo $\frac{x^2 - 4x + 4}{x^2 - 9} < 0$.

**Podatki:** $\frac{x^2 - 4x + 4}{x^2 - 9} < 0$
**Iščemo:** vse $x$, ki ustrezajo neenačbi

:::formula
Razcep: $x^2 - 4x + 4 = (x - 2)^2$ in $x^2 - 9 = (x - 3)(x + 3)$; faktor sode stopnje ne zamenja predznaka.
:::

**Rešitev:**

1. Na desni je že $0$, levo je en ulomek. Razstavimo: $\frac{(x - 2)^2}{(x - 3)(x + 3)} < 0$.
2. Ničla $x = 2$ je dvojna. Pola sta $x = -3$ in $x = 3$.
3. Tabela predznakov (imenovalec obravnavamo kot celoto):

| interval | $(x - 2)^2$ | $x^2 - 9$ | ulomek |
|---|---|---|---|
| $(-\infty, -3)$ | $+$ | $+$ | $+$ |
| $(-3, 2)$ | $+$ | $-$ | $-$ |
| $(2, 3)$ | $+$ | $-$ | $-$ |
| $(3, \infty)$ | $+$ | $+$ | $+$ |

4. Pri $x = 2$ se predznak ne zamenja, ker je ničla dvojna. Tam je ulomek $0$, kar ni $< 0$, zato $2$ izločimo.
5. Odgovor: $x \in (-3, 2) \cup (2, 3)$.

### Primer 3 (težji): sirena za pol tona višje

Sirena reševalnega vozila oddaja ton s frekvenco $f_0$. Stojiš ob cesti, vozilo pa s stalno hitrostjo $v$ (v $\mathrm{m/s}$) pelje naravnost proti tebi. Po Dopplerjevem pojavu za izvor, ki se približuje mirujočemu poslušalcu, slišiš frekvenco $f$, za katero velja $\frac{f}{f_0} = \frac{340}{340 - v}$; $340\,\mathrm{m/s}$ je hitrost zvoka. Ton je približno pol tona višji, ko je razmerje frekvenc $\frac{17}{16}$. Kako hitro mora vozilo peljati, da je slišani ton vsaj pol tona višji?

**Podatki:** $\frac{f}{f_0} = \frac{340}{340 - v}$; hitrost zvoka $340\,\mathrm{m/s}$; pogoj $\frac{f}{f_0} \ge \frac{17}{16}$; $v \ge 0$
**Iščemo:** hitrosti $v$, ki ustrezajo pogoju

:::formula
$\dfrac{340}{340 - v} \ge \dfrac{17}{16}$
:::

**Rešitev:**

1. Na eno stran: $\frac{340}{340 - v} - \frac{17}{16} \ge 0$.
2. Skupni imenovalec je $16(340 - v)$. Števec: $16 \cdot 340 - 17(340 - v) = 5440 - 5780 + 17v = 17v - 340$.
3. Neenačba je $\frac{17v - 340}{16(340 - v)} \ge 0$. Ničla $v = 20$, pol $v = 340$.
4. Tabela predznakov:

| interval | $17v - 340$ | $16(340 - v)$ | ulomek |
|---|---|---|---|
| $(-\infty, 20)$ | $-$ | $+$ | $-$ |
| $(20, 340)$ | $+$ | $+$ | $+$ |
| $(340, \infty)$ | $+$ | $-$ | $-$ |

5. Rešitev neenačbe je $[20, 340)$; vsa ta števila so pozitivna, zato pogoj $v \ge 0$ ne spremeni ničesar.
6. Pretvorba: $20\,\mathrm{m/s} = 20 \cdot 3{,}6\,\mathrm{km/h} = 72\,\mathrm{km/h}$.
7. Odgovor: vozilo mora peljati s hitrostjo vsaj $20\,\mathrm{m/s}$ ($72\,\mathrm{km/h}$) in manj kot hitrost zvoka. Množenje z $340 - v$ bi dalo $v \ge 20$ in sprejelo tudi $v > 340$, kjer je razmerje negativno in nima smisla.

### Primer 4 – zdaj ti

Reši neenačbo $\frac{x}{x + 2} > \frac{1}{x}$.

**Podatki:** $\frac{x}{x + 2} > \frac{1}{x}$
**Iščemo:** vse $x$, ki ustrezajo neenačbi

:::formula
Na eno stran, skupni imenovalec $x(x + 2)$, nato tabela predznakov; neenačba je stroga.
:::

**Rešitev:**

1. Na eno stran in en ulomek: $\frac{x}{x + 2} - \frac{1}{x} = \frac{x^2 - x - 2}{x(x + 2)} > 0$.
2. Števec razstavimo: $x^2 - x - 2 = (x - 2)(x + 1)$. Ničli sta $-1$ in $2$, pola $-2$ in $0$.
3. Predznaka števca in imenovalca po intervalih:

| interval | $(x - 2)(x + 1)$ | $x(x + 2)$ |
|---|---|---|
| $(-\infty, -2)$ | $+$ | $+$ |
| $(-2, -1)$ | $+$ | $-$ |
| $(-1, 0)$ | $-$ | $-$ |
| $(0, 2)$ | $-$ | $+$ |
| $(2, \infty)$ | $+$ | $+$ |

4. Določi sam predznak ulomka in zapiši rešitev.

:::premisli
Kje je ulomek pozitiven in katera krajišča vzameš?
---
Ulomek je pozitiven, kjer imata števec in imenovalec enak predznak: na $(-\infty, -2)$, $(-1, 0)$ in $(2, \infty)$. Neenačba je stroga, zato so vsa krajišča odprta. Rešitev: $x \in (-\infty, -2) \cup (-1, 0) \cup (2, \infty)$.
:::

## Pogoste napake

- **Množenje z imenovalcem.** Iz $\frac{1}{x} < 1$ narediš $1 < x$. Pri negativnem $x$ bi se znak moral obrniti, zato izgubiš vse negativne rešitve. Vedno prenesi na eno stran in uporabi tabelo predznakov.
- **Tabela pred prenosom.** Pri $\frac{x + 5}{x - 1} \ge 2$ v tabelo vzameš ničlo $-5$ in pol $1$, kot da bi bila na desni $0$. Tabela pove, kje je ulomek večji od $0$, ne od $2$. Najprej odštej $2$ in dobi novi števec $7 - x$.
- **Pol v rešitvi.** Pri $\ge$ zapišeš $[1, 7]$, ker je »neenačba nestroga«. Nestrogi znak vključi le ničle. Pol vedno ostane odprt, ker ulomek tam ne obstaja.
- **Samodejno izmenični predznaki.** Predznake po intervalih pišeš $+, -, +, -$ brez razmisleka. Ob ničli ali polu sode stopnje se predznak ne zamenja. Za vsak faktor posebej določi predznak.
- **Dvojna ničla pri strogi neenačbi.** Pri $\frac{(x - 2)^2}{x^2 - 9} < 0$ zapišeš $(-3, 3)$. V $x = 2$ je ulomek $0$, kar ni $< 0$, zato točko $2$ izločiš.

## Povzetek

- Z izrazom neznanega predznaka neenačbe ne množimo; vse prenesemo na eno stran, da je na drugi $0$.
- Levo stran zapišemo kot en ulomek $\frac{p(x)}{q(x)}$ in razstavimo. Ničle števca so ničle, ničle imenovalca so poli.
- Predznak se lahko zamenja le v ničli ali polu, pa še to le pri lihi stopnji. Na vsakem intervalu zadošča eno testno število.
- Tabela predznakov: vrstice so intervali, stolpci faktorji in ulomek.
- Pri $\le$, $\ge$ ničle vključimo, pri $<$, $>$ ne. Polov ne vključimo nikoli.
- Rešitev $f(x) > 0$ so tisti $x$, kjer je graf racionalne funkcije nad osjo $x$.

## Za maturo

### Naloga 1 (višja raven): krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Dani sta funkciji $g(x) = \dfrac{x + 3}{x - 1}$ in $h(x) = x + 3$.

a) Izračunaj koordinate presečišč grafov funkcij $g$ in $h$. (2 točki)
b) Reši neenačbo $g(x) \ge h(x)$. (4 točke)
c) Zapiši vse $x$, pri katerih leži graf funkcije $g$ pod grafom funkcije $h$. (1 točka)

**Rešitev:**

1. a) Za $x \ne 1$ rešimo enačbo $\dfrac{x + 3}{x - 1} = x + 3$. Pri enačbi smemo pomnožiti z $x - 1 \ne 0$: $x + 3 = (x + 3)(x - 1)$.
2. a) Vse na eno stran in izpostavimo $x + 3$ (z njim ne delimo, da ne izgubimo rešitve): $(x + 3)(x - 1 - 1) = 0$, torej $(x + 3)(x - 2) = 0$. Rešitvi sta $x = -3$ in $x = 2$; $h(-3) = 0$, $h(2) = 5$. Presečišči sta $(-3, 0)$ in $(2, 5)$.
3. b) Prenesemo na eno stran: $\dfrac{x + 3}{x - 1} - (x + 3) \ge 0$. Z $x - 1$ ne množimo, ker ne poznamo njegovega predznaka.
4. b) En ulomek: $\dfrac{x + 3 - (x + 3)(x - 1)}{x - 1} = \dfrac{(x + 3)(2 - x)}{x - 1} \ge 0$. Ničli sta $-3$ in $2$, pol je $1$.
5. b) Tabela predznakov:

| interval | $(x + 3)(2 - x)$ | $x - 1$ | ulomek |
|---|---|---|---|
| $(-\infty, -3)$ | $-$ | $-$ | $+$ |
| $(-3, 1)$ | $+$ | $-$ | $-$ |
| $(1, 2)$ | $+$ | $+$ | $+$ |
| $(2, \infty)$ | $-$ | $+$ | $-$ |

6. b) Ulomek je pozitiven na $(-\infty, -3)$ in $(1, 2)$. Ničli $-3$ in $2$ vključimo, ker velja $\ge$; pol $1$ izločimo. Rešitev: $x \in (-\infty, -3] \cup (1, 2]$.
7. c) Graf $g$ leži pod grafom $h$, kjer je $g(x) < h(x)$, torej kjer je ulomek iz koraka 4 negativen. V $-3$ in $2$ sta vrednosti enaki, v $1$ funkcija $g$ ni definirana, zato so vsa krajišča odprta: $x \in (-3, 1) \cup (2, \infty)$.
8. Odgovor: a) $(-3, 0)$ in $(2, 5)$; b) $x \in (-\infty, -3] \cup (1, 2]$; c) $x \in (-3, 1) \cup (2, \infty)$.

**Točkovanje:** a) 1 točka za enačbo $(x + 3)(x - 2) = 0$ z obema rešitvama, 1 točka za obe presečišči; b) 1 točka za zapis z enim ulomkom $\dfrac{(x + 3)(2 - x)}{x - 1} \ge 0$, 1 točka za ničli in pol, 1 točka za pravilne predznake na intervalih, 1 točka za rešitev s pravilnimi krajišči; c) 1 točka za $(-3, 1) \cup (2, \infty)$.

### Naloga 2 (višja raven): strukturirana naloga, 10 točk, pola 2 (z računalom)

Koncentracija zdravila v krvi $t$ ur po zaužitju je $c(t) = \dfrac{30t}{t^2 + 9}$ (v $\mathrm{mg/L}$), $t \ge 0$.

a) Izračunaj koncentracijo zdravila $1$ uro in $6$ ur po zaužitju. (2 točki)
b) Zapiši enačbo vodoravne asimptote grafa funkcije $c$ in pojasni, kaj pove o koncentraciji. (2 točki)
c) Zdravilo učinkuje, ko je koncentracija vsaj $2{,}5\,\mathrm{mg/L}$. Z reševanjem neenačbe določi, od kdaj do kdaj zdravilo učinkuje in koliko časa. Čase zaokroži na celo minuto. (4 točke)
d) Z reševanjem neenačbe $c(t) \le 5$ utemelji, da koncentracija nikoli ne preseže $5\,\mathrm{mg/L}$, in zapiši, kdaj je enaka $5\,\mathrm{mg/L}$. (2 točki)

**Rešitev:**

1. a) $c(1) = \dfrac{30}{1 + 9} = 3$ in $c(6) = \dfrac{180}{36 + 9} = 4$. Koncentraciji sta $3\,\mathrm{mg/L}$ in $4\,\mathrm{mg/L}$.
2. b) Števec ima stopnjo $1$, imenovalec stopnjo $2$, zato je vodoravna asimptota $c = 0$ (os $t$). Po dolgem času se koncentracija bliža $0$: zdravilo se iz krvi izloči.
3. c) Rešujemo $\dfrac{30t}{t^2 + 9} \ge 2{,}5$. Na eno stran in en ulomek: $\dfrac{30t - 2{,}5(t^2 + 9)}{t^2 + 9} = \dfrac{-2{,}5(t^2 - 12t + 9)}{t^2 + 9} \ge 0$.
4. c) Imenovalec $t^2 + 9$ je vedno pozitiven (polov ni), zato je predznak ulomka enak predznaku števca. Delimo z $-2{,}5$ in obrnemo znak: $t^2 - 12t + 9 \le 0$.
5. c) Ničli: $t_{1,2} = \dfrac{12 \pm \sqrt{144 - 36}}{2} = 6 \pm 3\sqrt{3}$, torej $t_1 \approx 0{,}8038$ in $t_2 \approx 11{,}1962$. Parabola je odprta navzgor, zato je izraz nepozitiven med ničlama: $t \in [6 - 3\sqrt{3}, 6 + 3\sqrt{3}]$.
6. c) Pretvorba v minute: $0{,}8038 \cdot 60 \approx 48{,}2$ in $0{,}1962 \cdot 60 \approx 11{,}8$. Zdravilo učinkuje od približno $48\,\mathrm{min}$ do približno $11\,\mathrm{h}\ 12\,\mathrm{min}$ po zaužitju.
7. c) Trajanje: $t_2 - t_1 = 6\sqrt{3} \approx 10{,}3923\,\mathrm{h}$ in $0{,}3923 \cdot 60 \approx 23{,}5$, torej približno $10\,\mathrm{h}\ 24\,\mathrm{min}$.
8. d) $c(t) - 5 = \dfrac{30t - 5(t^2 + 9)}{t^2 + 9} = \dfrac{-5(t - 3)^2}{t^2 + 9}$.
9. d) Števec je kvadrat, pomnožen z $-5$, zato ni pozitiven; imenovalec je pozitiven. Torej je $c(t) - 5 \le 0$ oziroma $c(t) \le 5$ za vsak $t \ge 0$. Ničla $t = 3$ je dvojna, zato predznak tam ostane enak; enakost velja le pri $t = 3$, preizkus $c(3) = \frac{90}{18} = 5$.
10. Odgovor: a) $3\,\mathrm{mg/L}$ in $4\,\mathrm{mg/L}$; b) $c = 0$, zdravilo se sčasoma izloči; c) zdravilo učinkuje od $48\,\mathrm{min}$ do $11\,\mathrm{h}\ 12\,\mathrm{min}$ po zaužitju, približno $10\,\mathrm{h}\ 24\,\mathrm{min}$; d) koncentracija nikoli ne preseže $5\,\mathrm{mg/L}$, enaka je $5\,\mathrm{mg/L}$ natanko $3$ ure po zaužitju.

**Točkovanje:** a) 1 točka za $c(1) = 3\,\mathrm{mg/L}$, 1 točka za $c(6) = 4\,\mathrm{mg/L}$; b) 1 točka za asimptoto $c = 0$, 1 točka za pomen; c) 1 točka za neenačbo $t^2 - 12t + 9 \le 0$ z utemeljitvijo, da je imenovalec pozitiven, 1 točka za ničli $6 \pm 3\sqrt{3}$, 1 točka za interval od $48\,\mathrm{min}$ do $11\,\mathrm{h}\ 12\,\mathrm{min}$, 1 točka za trajanje $10\,\mathrm{h}\ 24\,\mathrm{min}$; d) 1 točka za zapis $c(t) - 5 = \dfrac{-5(t - 3)^2}{t^2 + 9}$, 1 točka za sklep $c(t) \le 5$ in čas $3\,\mathrm{h}$.

### Ustno vprašanje 1

:::premisli
(višja raven) Opiši postopek reševanja racionalne neenačbe in pojasni, zakaj je ne smemo pomnožiti z imenovalcem.
---
Imenovalec vsebuje neznanko, zato njegovega predznaka ne poznamo; pri množenju z negativnim izrazom bi se znak neenačbe obrnil in bi lahko izgubili ali dodali rešitve. Zato vse člene prenesemo na eno stran, da je na drugi $0$, in levo stran zapišemo kot en ulomek $\frac{p(x)}{q(x)}$. Števec in imenovalec razstavimo ter poiščemo ničle in pole, ki razdelijo realno os na intervale. S tabelo predznakov določimo predznak ulomka na vsakem intervalu in izberemo intervale s pravim predznakom. Pri nestrogi neenačbi ničle vključimo, polov pa nikoli.
:::

### Ustno vprašanje 2

:::premisli
(višja raven) Utemelji, zakaj racionalna funkcija lahko spremeni predznak le v ničlah in polih, in pojasni, kdaj ga v takšni točki ne spremeni.
---
Polinoma v števcu in imenovalcu sta zvezni funkciji, zato lahko zamenjata predznak le tam, kjer sta enaka $0$. Med dvema sosednjima ničlama ali poloma je zato predznak ulomka stalen in ga določimo z enim testnim številom. Če je $c$ ničla ali pol stopnje $m$, ulomek vsebuje faktor $(x - c)^m$, ostali faktorji pa v $c$ ne zamenjajo predznaka; pri lihi stopnji $m$ ta faktor v $c$ zamenja predznak, zato ga zamenja tudi ulomek. Pri sodi stopnji je faktor $(x - c)^m$ na obeh straneh točke $c$ pozitiven, zato predznak ulomka ostane enak.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Navedi primer racionalne neenačbe z eno ničlo in enim polom ter pojasni, katera krajišča spadajo v rešitev.
---
Primer je $\frac{x + 2}{x - 1} \ge 0$ z ničlo $-2$ in polom $1$. Ulomek je pozitiven levo od $-2$ in desno od $1$, med njima pa negativen. Ničlo $-2$ vključimo, ker je ulomek tam $0$, neenačba pa je nestroga. Pola $1$ ne vključimo, ker je tam imenovalec $0$ in ulomek ne obstaja, zato je rešitev $(-\infty, -2] \cup (1, \infty)$.
:::

## Drugače: Z analogijo

Predstavljaj si dolg hodnik z lučjo in več stikali vzdolž stene. Hodiš od leve proti desni. Vsak linearni faktor je stikalo: ko greš mimo njegove ničle (ali pola), stikalo preklopi in predznak se obrne. Faktor $(x - 2)^2$ je kot dvojno stikalo, ki ga pritisneš dvakrat zapored: luč ostane taka, kot je bila.

Predznak ulomka je stanje luči: o njem odloča, koliko faktorjev je trenutno negativnih. Pri lihem številu je ulomek negativen, pri sodem pozitiven. Pol pa je mesto, kjer v hodniku manjka del tal: stikalo ob njem preklopiš, stati na njem pa ne moreš. Zato pol nikoli ni v rešitvi.

## Drugače: Bolj natančno

Zakaj je predznak na intervalu stalen? Polinom $p$ je zvezen: njegov graf je nepretrgana krivulja. Če bi med dvema sosednjima ničlama zamenjal predznak, bi moral os $x$ prečkati še nekje vmes, torej bi imel še eno ničlo. Enako velja za $q$. Ulomek $\frac{p}{q}$ zato zamenja predznak le v ničlah $p$ ali $q$.

Množiti smemo z izrazom, za katerega **vemo**, da je pozitiven. Za $q(x) \ne 0$ je $q(x)^2 > 0$, zato je
$\frac{p(x)}{q(x)} > 0$ enakovredno $p(x) \cdot q(x) > 0$. Racionalna neenačba se tako prevede na polinomsko, ki jo rešiš z grafom polinoma. Pri $\ge$ velja $p(x) \cdot q(x) \ge 0$ in hkrati $q(x) \ne 0$: drugi pogoj izloči pole.

Pri Primeru 1 to da $(7 - x)(x - 1) \ge 0$ in $x \ne 1$. Parabola z ničlama $1$ in $7$ je odprta navzdol, nenegativna je na $[1, 7]$; brez pola ostane $(1, 7]$.

## Preveri se

? (brez računala) Koliko celih števil reši neenačbo $\frac{x + 3}{x - 2} \le 0$?
= 5
~ 6 | Vključil si pol $2$. Tam je imenovalec $0$, ulomek ne obstaja.
~ 4 | Izpustil si ničlo $-3$. Pri $\le$ je ulomek $0$ dovoljen.
> Ničla $-3$, pol $2$; ulomek je nepozitiven na $[-3, 2)$. Cela števila: $-3$, $-2$, $-1$, $0$, $1$.

? Pri neenačbi $\frac{x - 4}{x + 1} \ge 0$ je $x = -1$ pol. Kaj to pomeni za rešitev?
- $-1$ je v rešitvi, ker je neenačba nestroga.
~ Nestrogi znak vključi le ničle števca, kjer je ulomek $0$. Pri polu ulomka sploh ni.
+ $-1$ ni v rešitvi, ker je tam imenovalec $0$ in ulomek ne obstaja.
- $-1$ je ničla ulomka, ker je tam vrednost $0$.
~ Ničle da števec ($x = 4$). Pri $x = -1$ je $0$ imenovalec, ne ulomek.
> Pol je ničla imenovalca. Rešitev je $(-\infty, -1) \cup [4, \infty)$: ničla $4$ je vključena, pol $-1$ ne.

? Na sliki je graf $f(x) = \dfrac{(x - 1)^2}{4(x + 2)}$. Rešitev neenačbe $f(x) \ge 0$ je $(-2, \infty)$. Kaj se zgodi z rešitvijo, če $\ge$ zamenjaš z $>$?
:::risba graf
opis: Graf funkcije f(x) = (x − 1)²/(4(x + 2)). Navpična asimptota je pri x = −2. Levo od −2 je graf pod osjo x. Desno od −2 je nad osjo, pri x = 1 se osi x le dotakne (f(1) = 0) in nato spet ostane nad njo.
x: -6 .. 4
y: -8 .. 4
f: (x-1)^2/(4*(x+2)) | modra | -6 .. -2,4
f: (x-1)^2/(4*(x+2)) | modra | -1,5 .. 4
črta: -2; -8 -> -2; 4 | črtkano siva
točka: 1; 0 | 1 | pod
:::
- Nič se ne spremeni.
~ Pri $x = 1$ se graf osi le dotakne, $f(1) = 0$. Ker $0 > 0$ ne drži, točka $1$ izpade.
+ Izpade le $x = 1$, rešitev je $(-2, 1) \cup (1, \infty)$.
- Izpadeta $x = 1$ in $x = -2$.
~ $-2$ ni bil v rešitvi nikoli, ker je pol. Izpade le ničla.
- Rešitev postane $(1, \infty)$.
~ Ničla sode stopnje ne zamenja predznaka: tudi med $-2$ in $1$ je graf nad osjo.
> Graf se osi dotakne v dvojni ničli $1$ in ostane nad njo. Stroga neenačba izloči le točko, kjer je $f(x) = 0$.

? Rešitev neenačbe $\frac{x + 6}{x} \ge 4$ je interval $(0, b]$. Koliko je $b$?
= 2
~ -6 | Vzel si ničlo prvotnega števca $x + 6$. Najprej odštej $4$, šele nato iščeš ničlo.
~ 1,2 | Narobe si združil števec: $x + 6 - 4x = 6 - 3x$, ne $6 - 5x$.
> $\frac{x + 6}{x} - 4 = \frac{6 - 3x}{x} \ge 0$. Ničla $2$ (vključena), pol $0$ (izločen), pozitivno med njima: $(0, 2]$.

? Razvrsti korake reševanja racionalne neenačbe.
1. Vse člene prenesi na eno stran, da je na drugi $0$.
2. Levo stran zapiši kot en ulomek.
3. Razstavi števec in imenovalec, poišči ničle in pole.
4. Izpolni tabelo predznakov po intervalih.
5. Izberi intervale s pravim predznakom in odloči o krajiščih.
> Tabela ima smisel šele, ko primerjaš en sam ulomek z $0$. Krajišča določiš na koncu: ničle po znaku neenačbe, poli nikoli.

<<RACUN
vrednost: 1/(-2) | -0.5
enako: 1/x-1 | (1-x)/x
neenacba: 1/x<1 | x | (-oo, 0) U (1, oo)
neenacba: (x-2)/(x+1)>=0 | x | (-oo, -1) U [2, oo)
neenacba: (x-2)^2/(x+3)>0 | x | (-3, 2) U (2, oo)
enako: (x+5)/(x-1)-2 | (7-x)/(x-1)
neenacba: (x+5)/(x-1)>=2 | x | (1, 7]
enako: x^2-4*x+4 | (x-2)^2
neenacba: (x^2-4*x+4)/(x^2-9)<0 | x | (-3, 2) U (2, 3)
enako: 340/(340-v)-17/16 | (17*v-340)/(16*(340-v))
neenacba: 340/(340-v)>=17/16 | v | [20, 340)
vrednost: 20*3.6 | 72
enako: x/(x+2)-1/x | (x^2-x-2)/(x*(x+2))
neenacba: x/(x+2)>1/x | x | (-oo, -2) U (-1, 0) U (2, oo)
neenacba: (x-4)/(x+1)>=0 | x | (-oo, -1) U [4, oo)
neenacba: (x-1)^2/(4*(x+2))>0 | x | (-2, 1) U (1, oo)
neenacba: (x+3)/(x-2)<=0 | x | [-3, 2)
neenacba: (x+6)/x>=4 | x | (0, 2]
resi: (x+3)/(x-1)=x+3 | x | -3, 2
enako: (x+3)/(x-1)-(x+3) | (x+3)*(2-x)/(x-1)
neenacba: (x+3)/(x-1)>=x+3 | x | (-oo, -3] U (1, 2]
neenacba: (x+3)/(x-1)<x+3 | x | (-3, 1) U (2, oo)
vrednost: 30*1/(1^2+9) | 3
vrednost: 30*6/(6^2+9) | 4
limita: 30*t/(t^2+9) | t | oo | 0
enako: 30*t/(t^2+9)-2.5 | -2.5*(t^2-12*t+9)/(t^2+9)
neenacba: 30*t/(t^2+9)>=5/2 | t | [6-3*sqrt(3), 6+3*sqrt(3)]
vrednost: (6-3*sqrt(3))*60 | 48.2
vrednost: 6*sqrt(3) | 10.3923
enako: 30*t/(t^2+9)-5 | -5*(t-3)^2/(t^2+9)
neenacba: 30*t/(t^2+9)<=5 | t | (-oo, oo)
neenacba: (x+2)/(x-1)>=0 | x | (-oo, -2] U (1, oo)
>>

:::simboli
x | neznanka | |
p | števec, polinom | |
q | imenovalec, polinom | | | njegove ničle so poli
f | racionalna funkcija $f(x)$; v Primeru 3 slišana frekvenca | | | v Primeru 3: $f = f_0 \cdot \frac{340}{340 - v}$, enota Hz
f_0 | frekvenca sirene | | Hz
v | hitrost vozila | | m/s | proti poslušalcu
:::
