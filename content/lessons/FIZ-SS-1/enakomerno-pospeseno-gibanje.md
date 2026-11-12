---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ob vsakem utripu srca kri v tvoji glavni arteriji (aorti) pospeši bolj kot dober športni avto. Zveni napačno, saj kri teče le s hitrostjo okoli $1\,\mathrm{m/s}$, avto pa drvi s $100\,\mathrm{km/h}$. A kri doseže svoj $1\,\mathrm{m/s}$ iz mirovanja v približno desetinki sekunde. Avto potrebuje za $100\,\mathrm{km/h}$, to je približno $28\,\mathrm{m/s}$, kar $3\,\mathrm{s}$. V vsaki sekundi bi kri pridobila okoli $10\,\mathrm{m/s}$ hitrosti, avto pa le okoli $9\,\mathrm{m/s}$.

Paradoks se razreši, ko ločiš dve količini: **kako hitro** se nekaj giblje in **kako hitro se hitrost spreminja**. Druga je pospešek, tema te lekcije.

Pri enakomernem gibanju že znaš: hitrost je stalna, pot izračunaš kot $s = v \cdot t$. V resnici pa se le redko gibljemo s stalno hitrostjo. Avtomobil na semaforju pospešuje, kamen v prostem padu se vedno hitreje giblje, kolo pred križiščem zavira.

Najpreprostejši primer spreminjanja hitrosti je **enakomerno pospešeno gibanje**: hitrost se v vsaki sekundi spremeni za enako vrednost. Z njim opišemo zaviranje vozil (in s tem varnostno razdaljo), prosti pad, met navzdol in številne druge pojave. Z enačbami lahko vnaprej izračunaš, kako hitro se bo telo gibalo in kje bo po določenem času.

## Razlaga

**Tekačica na startu.** Ana na strel požene iz blokov. Trener ji vsako sekundo izmeri hitrost, pot v zadnji sekundi in skupno pot (obe poti v metrih). V prvih štirih sekundah dobi:

| $t\,(\mathrm{s})$ | $v\,(\mathrm{m/s})$ | v sekundi | skupaj |
|---|---|---|---|
| $0$ | $0$ | – | $0$ |
| $1$ | $2$ | $1$ | $1$ |
| $2$ | $4$ | $3$ | $4$ |
| $3$ | $6$ | $5$ | $9$ |
| $4$ | $8$ | $7$ | $16$ |

Drugi stolpec raste vsakič za enako, za $2\,\mathrm{m/s}$. Tretji stolpec pa ni stalen: vsako sekundo Ana preteče več, ker je hitrejša. Skupne poti so $1$, $4$, $9$, $16$, kvadrati časov.

Hitrost narišemo v odvisnosti od časa. Točke ležijo na premici, pot do $3\,\mathrm{s}$ pa je ploščina osenčenega trikotnika pod njo:

:::risba graf
opis: Graf hitrosti tekačice v odvisnosti od časa. Premica gre iz izhodišča do 8 m/s pri 4 s. Pod premico je od 0 do 3 s osenčen trikotnik z osnovnico 3 s in višino 6 m/s; njegova ploščina je 9 m, kar je pot v prvih treh sekundah.
x: 0 .. 4 | 1 | t [s]
y: 0 .. 8 | 2 | v [m/s]
lik: 0; 0 -> 3; 0 -> 3; 6 | ozadje zelena
f: 2*x | modra | 0 .. 4
napis: 2,2; 1,3 | 9 m | sredina
:::

Ploščina trikotnika je $\dfrac{3\,\mathrm{s} \cdot 6\,\mathrm{m/s}}{2} = 9\,\mathrm{m}$, točno kot v tabeli. Enako kot pri enakomernem gibanju je pot ploščina pod grafom $v(t)$, le da je lik zdaj trikotnik.

:::premisli
Kolikšno skupno pot bo Ana pretekla v $5\,\mathrm{s}$, če pospešuje enako naprej? Napovej iz vzorca v zadnjem stolpcu.
---
$25\,\mathrm{m}$. Skupne poti so kvadrati časov ($5^2 = 25$). Tudi ploščina trikotnika se ujema: $\dfrac{5 \cdot 10}{2} = 25$.
:::

Iz tabele in slike zdaj sestavimo enačbe.

**1. Pospešek.** Pospešek $a$ pove, za koliko se hitrost spremeni v eni sekundi:

$$a = \frac{\Delta v}{\Delta t} = \frac{v - v_0}{t}$$

Enota je $\mathrm{\frac{m}{s^2}}$. Pospešek $2\,\mathrm{\frac{m}{s^2}}$ pomeni, da se hitrost vsako sekundo poveča za $2\,\mathrm{\frac{m}{s}}$.

**2. Enakomerno pospešeno gibanje** je gibanje po premici s **stalnim pospeškom**. Če ima pospešek nasprotno smer kot hitrost, telo zavira (hitrost se manjša). Tedaj v računih pišemo negativen pospešek.

**3. Enačba za hitrost.** Iz definicije pospeška dobimo:

$$v = v_0 + a\,t$$

kjer je $v_0$ začetna hitrost (ob $t = 0$).

**4. Enačba za prepotovano pot.** Hitrost narašča enakomerno, zato je povprečna hitrost aritmetična sredina začetne in končne: $\bar v = \dfrac{v_0 + v}{2}$. Pot je $s = \bar v \cdot t$. Ko vstavimo $v = v_0 + at$, dobimo:

$$s = v_0\,t + \frac{a\,t^2}{2}$$

Če se telo začne gibati iz mirovanja ($v_0 = 0$), je $s = \dfrac{a t^2}{2}$.

**5. Enačba brez časa.** Iz obeh enačb izločimo $t$ in dobimo:

$$v^2 = v_0^2 + 2\,a\,s$$

Uporabna je, kadar čas ni podan ali ni zahtevan.

**6. Grafi gibanja.**

- **Graf $a(t)$:** vodoravna premica (pospešek je stalen).
- **Graf $v(t)$:** premica. Njen naklon je pospešek $a$, presečišče z navpično osjo je $v_0$. **Ploščina pod grafom** med $0$ in $t$ je prepotovana pot $s$.
- **Graf $s(t)$:** parabola (pri $a > 0$ odprta navzgor). Naklon tangente v dani točki je trenutna hitrost.

:::premisli
Ana teče iz mirovanja s stalnim pospeškom. Kolikokrat daljšo pot preteče, če teče dvakrat dlje časa? Zakaj ne dvakrat?
---
Štirikrat. Pri dvojnem času je dvakrat večja tudi končna hitrost, zato ima trikotnik pod $v(t)$ dvakrat daljšo osnovnico in dvakrat večjo višino. V formuli $s = \dfrac{a t^2}{2}$ se to vidi kot kvadrat časa.
:::

V simulaciji spodaj, »Enakomerno pospešeno gibanje«, nastavi $v_0 = 0$ in $a = 2\,\mathrm{m/s^2}$, pritisni »Vozi« in izberi graf $v(t)$: dobiš Anino premico. Nato preklopi na $x(t)$ (lega je tam $x$) in opazuj, kako se krivulja vse bolj strmo dviga. Za konec nastavi $v_0 = 10\,\mathrm{m/s}$ in $a = -2{,}5\,\mathrm{m/s^2}$: premica $v(t)$ pada, telo zavira.

**7. Postopek reševanja.** Zapiši, kaj je podano ($v_0$, $v$, $a$, $t$, $s$), kaj iščeš, in izberi enačbo, v kateri nastopajo natanko te količine. Enote pretvori v $\mathrm{m}$ in $\mathrm{s}$ (npr. $\mathrm{km/h}$ deli s $3{,}6$).

## Rešeni primeri

### Primer 1: zagon avtomobila

Avto spelje iz mirovanja in pospešuje z $2{,}0\,\mathrm{\frac{m}{s^2}}$. Kolikšna je hitrost in prepotovana pot po $5{,}0\,\mathrm{s}$?

**Podatki:** $v_0 = 0$, $a = 2{,}0\,\mathrm{\frac{m}{s^2}}$, $t = 5{,}0\,\mathrm{s}$
**Iščemo:** hitrost $v$ in pot $s$ po $5{,}0\,\mathrm{s}$

:::formula
$v = v_0 + a\,t$, $s = v_0\,t + \dfrac{a\,t^2}{2}$
:::

**Rešitev:**

1. Hitrost: $v = v_0 + at = 0 + 2{,}0 \cdot 5{,}0 = 10\,\mathrm{\frac{m}{s}}$.
2. Pot (ker je $v_0 = 0$): $s = \dfrac{a t^2}{2} = \dfrac{2{,}0 \cdot 25}{2} = 25\,\mathrm{m}$.
3. Preverimo s povprečno hitrostjo: $\bar v = \dfrac{0 + 10}{2} = 5\,\mathrm{\frac{m}{s}}$, $s = 5 \cdot 5{,}0 = 25\,\mathrm{m}$. ✓
4. Odgovor: po $5{,}0\,\mathrm{s}$ ima avto hitrost $10\,\mathrm{\frac{m}{s}}$ in prevozi $25\,\mathrm{m}$.

### Primer 2: zaviranje

Kolesar vozi s hitrostjo $36\,\mathrm{\frac{km}{h}}$ in enakomerno zavira, dokler se ne ustavi po $4{,}0\,\mathrm{s}$. Kolikšen je pospešek in kolikšna je zavorna pot?

**Podatki:** $v_0 = 36\,\mathrm{\frac{km}{h}}$, $v = 0$ (ustavi se), $t = 4{,}0\,\mathrm{s}$
**Iščemo:** pospešek $a$ in zavorno pot $s$

:::formula
$a = \dfrac{v - v_0}{t}$, $s = v_0\,t + \dfrac{a\,t^2}{2}$ (hitrost najprej pretvorimo iz $\mathrm{km/h}$ v $\mathrm{m/s}$: delimo s $3{,}6$)
:::

**Rešitev:**

1. Pretvorba: $36\,\mathrm{km/h} = 36 : 3{,}6 = 10\,\mathrm{\frac{m}{s}}$. Torej $v_0 = 10\,\mathrm{\frac{m}{s}}$, $v = 0$, $t = 4{,}0\,\mathrm{s}$.
2. Pospešek: $a = \dfrac{v - v_0}{t} = \dfrac{0 - 10}{4{,}0} = -2{,}5\,\mathrm{\frac{m}{s^2}}$. Predznak je negativen, ker kolesar zavira.
3. Pot: $s = v_0 t + \dfrac{a t^2}{2} = 10 \cdot 4{,}0 + \dfrac{(-2{,}5)\cdot 16}{2} = 40 - 20 = 20\,\mathrm{m}$.
4. Preverimo s povprečno hitrostjo: $\bar v = \dfrac{10 + 0}{2} = 5\,\mathrm{\frac{m}{s}}$, $s = 5 \cdot 4{,}0 = 20\,\mathrm{m}$. ✓
5. Odgovor: pospešek je $-2{,}5\,\mathrm{\frac{m}{s^2}}$ (kolesar zavira), zavorna pot pa $20\,\mathrm{m}$.

### Primer 3: pot brez podanega časa

Vlak se pelje s hitrostjo $20\,\mathrm{\frac{m}{s}}$ in na razdalji $100\,\mathrm{m}$ pospeši na $30\,\mathrm{\frac{m}{s}}$. Kolikšen je pospešek in koliko časa traja pospeševanje?

**Podatki:** $v_0 = 20\,\mathrm{\frac{m}{s}}$, $v = 30\,\mathrm{\frac{m}{s}}$, $s = 100\,\mathrm{m}$
**Iščemo:** pospešek $a$ in čas pospeševanja $t$

:::formula
Enačba brez časa $v^2 = v_0^2 + 2\,a\,s$, nato $t = \dfrac{v - v_0}{a}$
:::

**Rešitev:**

1. Časa ne poznamo, zato izberemo enačbo brez $t$.
2. Iz $v^2 = v_0^2 + 2as$ izrazimo: $a = \dfrac{v^2 - v_0^2}{2s} = \dfrac{900 - 400}{200} = 2{,}5\,\mathrm{\frac{m}{s^2}}$.
3. Čas iz enačbe za hitrost: $t = \dfrac{v - v_0}{a} = \dfrac{30 - 20}{2{,}5} = 4{,}0\,\mathrm{s}$.
4. Preverimo s potjo: $s = \dfrac{v_0 + v}{2}\, t = 25 \cdot 4{,}0 = 100\,\mathrm{m}$. ✓
5. Odgovor: vlak pospešuje z $2{,}5\,\mathrm{\frac{m}{s^2}}$, pospeševanje traja $4{,}0\,\mathrm{s}$.

### Primer 4 – zdaj ti: kri ob utripu

Ob utripu srca kri v aorti v $0{,}10\,\mathrm{s}$ pospeši iz mirovanja do $1{,}0\,\mathrm{\frac{m}{s}}$. Privzemi, da je pospešek stalen. Kolikšen je pospešek in koliko daleč se kri premakne v tem času?

**Podatki:** $v_0 = 0$, $v = 1{,}0\,\mathrm{\frac{m}{s}}$, $t = 0{,}10\,\mathrm{s}$
**Iščemo:** pospešek $a$ in pot $s$

:::formula
$a = \dfrac{v - v_0}{t}$, nato $s = \dfrac{a\,t^2}{2}$ (ker je $v_0 = 0$)
:::

**Rešitev:**

1. Pospešek: $a = \dfrac{1{,}0 - 0}{0{,}10} = 10\,\mathrm{\frac{m}{s^2}}$. To je številka iz paradoksa na začetku.
2. Ker kri začne iz mirovanja, odpade člen $v_0 t$; ostane $s = \dfrac{a t^2}{2}$.
3. Vstavi in izračunaj sam, nato preveri:

:::premisli
Koliko je $s = \dfrac{10 \cdot 0{,}10^2}{2}$ in koliko je to v centimetrih?
---
$s = 0{,}05\,\mathrm{m} = 5\,\mathrm{cm}$. Pospešek je velik, a traja tako kratko, da kri pride le nekaj centimetrov. Preveri s povprečno hitrostjo: $0{,}5\,\mathrm{\frac{m}{s}} \cdot 0{,}10\,\mathrm{s} = 0{,}05\,\mathrm{m}$.
:::

## Pogoste napake

- **Velik pospešek pomeni veliko hitrost.** Napačno: »Kri pospešuje z $10\,\mathrm{\frac{m}{s^2}}$, torej teče z $10\,\mathrm{\frac{m}{s}}$.« Pospešek pove, koliko se hitrost spremeni v sekundi, ne kolikšna je. Popravek: končno hitrost dobiš z $v = v_0 + a t$, pri kratkem $t$ je lahko majhna.
- **Pozabljen predznak pospeška.** Napačno: pri zaviranju vstaviš $a = +2{,}5\,\mathrm{\frac{m}{s^2}}$. Iz $v = v_0 + at$ potem hitrost raste, čeprav kolesar zavira. Popravek: kadar se hitrost manjša, je $a$ negativen.
- **Napačna formula za pot.** Napačno: $s = v_0 t + a t^2$ ali $s = a t$, ali pa kvadriraš produkt $a t$. Polovica pride iz ploščine trikotnika pod $v(t)$, kvadrira se samo $t$. Popravek: $s = v_0 t + \dfrac{a t^2}{2}$.
- **Pot raste sorazmerno s časom.** Napačno: »V dvakrat daljšem času dvakrat daljša pot«, kot pri enakomernem gibanju. Tu se hitrost med potjo veča, zato pot pri $v_0 = 0$ raste s kvadratom časa. Popravek: dvojni čas pomeni štirikratno pot.
- **Mešanje grafov in enot.** Napačno: naklon $v(t)$ imaš za hitrost, ploščino pod $s(t)$ za pot ali v enačbo vstaviš $\mathrm{km/h}$. Naklon $v(t)$ je pospešek, pot je ploščina pod $v(t)$. Popravek: beri, kaj je na navpični osi, in $\mathrm{km/h}$ najprej deli s $3{,}6$.

## Povzetek

- Enakomerno pospešeno gibanje ima stalen pospešek $a = \dfrac{\Delta v}{\Delta t}$, enota $\mathrm{\frac{m}{s^2}}$.
- Hitrost: $v = v_0 + at$.
- Pot: $s = v_0 t + \dfrac{a t^2}{2}$, pri $v_0 = 0$ je $s = \dfrac{a t^2}{2}$.
- Brez časa: $v^2 = v_0^2 + 2as$.
- Graf $a(t)$ je vodoravna premica, $v(t)$ je premica z naklonom $a$, $s(t)$ je parabola.
- Ploščina pod grafom $v(t)$ je prepotovana pot.
- Pri zaviranju je pospešek negativen.

## Drugače: Na sliki

Predstavljaj si graf $v(t)$ za avto, ki spelje iz mirovanja z $2\,\mathrm{\frac{m}{s^2}}$. Premica gre iz izhodišča navzgor: pri $1\,\mathrm{s}$ je $2\,\mathrm{\frac{m}{s}}$, pri $2\,\mathrm{s}$ je $4\,\mathrm{\frac{m}{s}}$, pri $5\,\mathrm{s}$ je $10\,\mathrm{\frac{m}{s}}$.

- **Naklon** premice je $\dfrac{10}{5} = 2\,\mathrm{\frac{m}{s^2}}$, torej pospešek.
- **Ploščina** pod premico od $0$ do $5\,\mathrm{s}$ je pravokotni trikotnik s katetama $5\,\mathrm{s}$ in $10\,\mathrm{\frac{m}{s}}$: $\dfrac{5 \cdot 10}{2} = 25\,\mathrm{m}$. To je ravno prepotovana pot.

Če ima telo začetno hitrost $v_0$, je lik pod premico trapez: pravokotnik višine $v_0$ in trikotnik nad njim. Zato pot sestavljata dva člena: $v_0 t$ (pravokotnik) in $\dfrac{a t^2}{2}$ (trikotnik).

Graf $s(t)$ je parabola: v prvi sekundi telo prepotuje malo, v naslednjih vedno več, zato se krivulja vse bolj strmo dviguje.

## Drugače: Z analogijo

Hitrost in pospešek sta kot **višina otroka** in **to, koliko zraste v enem letu**. Dojenček je majhen, a raste zelo hitro; odrasel je visok, a sploh ne raste več. Velika višina ne pomeni hitre rasti in obratno.

- Hitrost $v$ je kot višina: koliko je nekaj zdaj.
- Pospešek $a$ je kot letna rast: za koliko se višina spremeni v enoti časa. Zato ima enoto »$\mathrm{m/s}$ na sekundo«, torej $\mathrm{m/s^2}$.
- Enakomerno pospešeno gibanje je otrok, ki vsako leto zraste za enako. Njegova višina na grafu je premica, tako kot $v(t)$.
- Zaviranje je kot krčenje: rast je negativna, višina se manjša.

Kri v aorti je dojenček v tej primerjavi: majhna hitrost, a velik pospešek. Avto na avtocesti pri stalni hitrosti je odrasel: velika hitrost, pospešek nič.

## Drugače: Iz vsakdanjega življenja

Ko na semaforju zelena zasveti, voznik pospeši. Vozilo, ki pospešuje z $2\,\mathrm{\frac{m}{s^2}}$, ima po prvi sekundi $2\,\mathrm{\frac{m}{s}}$ (približno $7\,\mathrm{km/h}$), po drugi $4\,\mathrm{\frac{m}{s}}$ in tako naprej. Hitrost raste enakomerno, pot pa vse hitreje, saj vsako naslednjo sekundo vozilo prevozi več kot prejšnjo.

Zaviranje je enak pojav v obratni smeri. Zato ima pot zaviranja pomembno posledico: pri dvakratni začetni hitrosti in enakem pojemku je zavorna pot **štirikrat** daljša, ker je zavorna pot $s = \dfrac{v_0^2}{2|a|}$ in v njej začetna hitrost nastopa kvadratno. Če kolesar zavira z $2{,}5\,\mathrm{\frac{m}{s^2}}$ iz $10\,\mathrm{\frac{m}{s}}$, potrebuje $20\,\mathrm{m}$; iz $20\,\mathrm{\frac{m}{s}}$ pa $80\,\mathrm{m}$. Zato je pri večji hitrosti varnostna razdalja tako pomembna.

## Drugače: Korak za korakom s številkami

Telo ima $v_0 = 3\,\mathrm{\frac{m}{s}}$ in $a = 2\,\mathrm{\frac{m}{s^2}}$. Poglejmo tabelo za prve 4 sekunde:

| $t\,(\mathrm{s})$ | $v = 3 + 2t\,(\mathrm{\frac{m}{s}})$ | $s = 3t + t^2\,(\mathrm{m})$ |
|---|---|---|
| 0 | 3 | 0 |
| 1 | 5 | 4 |
| 2 | 7 | 10 |
| 3 | 9 | 18 |
| 4 | 11 | 28 |

(Pot: $s = v_0 t + \dfrac{a t^2}{2} = 3t + t^2$.)

Opazuj:

- Hitrost narašča za $2\,\mathrm{\frac{m}{s}}$ v vsaki sekundi (stalen pospešek).
- Poti v posameznih sekundah so $4$, $6$, $8$, $10\,\mathrm{m}$. Povečujejo se za $2\,\mathrm{m}$, ker hitrost raste.
- Preveri za $t = 4\,\mathrm{s}$ s povprečno hitrostjo: $\bar v = \dfrac{3 + 11}{2} = 7\,\mathrm{\frac{m}{s}}$, $s = 7 \cdot 4 = 28\,\mathrm{m}$. ✓

## Drugače: Bolj natančno

Enačbo za pot lahko izpeljemo iz grafa $v(t)$. Pot je ploščina pod grafom med $0$ in $t$. Lik je trapez z osnovnicama $v_0$ in $v$ ter višino $t$:

$$s = \frac{v_0 + v}{2}\, t$$

Vstavimo $v = v_0 + at$:

$$s = \frac{v_0 + v_0 + at}{2}\, t = v_0 t + \frac{a t^2}{2}$$

Enačbo brez časa dobimo tako, da iz $v = v_0 + at$ izrazimo $t = \dfrac{v - v_0}{a}$ in vstavimo v $s = \dfrac{v_0 + v}{2}\, t$:

$$s = \frac{(v_0 + v)(v - v_0)}{2a} = \frac{v^2 - v_0^2}{2a}$$

Od tod $v^2 = v_0^2 + 2as$.

Pri tej izpeljavi smo privzeli, da je gibanje po premici in da se smer gibanja ne obrne. Če se telo ustavi in nato vrne (npr. met navzgor), $s$ pomeni **premik** (spremembo lege), ne celotne prepotovane poti.

## Preveri se

? Avto spelje iz mirovanja in pospešuje s $3\,\mathrm{\frac{m}{s^2}}$. Kolikšna je njegova hitrost po $4\,\mathrm{s}$?
- $7\,\mathrm{\frac{m}{s}}$
~ To je vsota $3 + 4$. Pospešek pove spremembo hitrosti v vsaki sekundi, zato ga množiš s časom.
+ $12\,\mathrm{\frac{m}{s}}$
- $24\,\mathrm{\frac{m}{s}}$
~ To je $\dfrac{a t^2}{2}$, prepotovana pot v metrih, ne hitrost.
- $0{,}75\,\mathrm{\frac{m}{s}}$
~ To je količnik $a / t$. Hitrost raste s časom, zato ne deliš.
> $v = v_0 + at = 0 + 3 \cdot 4 = 12\,\mathrm{\frac{m}{s}}$.

? Telo se začne gibati iz mirovanja s pospeškom $2\,\mathrm{\frac{m}{s^2}}$. Kolikšno pot prepotuje v $6\,\mathrm{s}$?
- $12\,\mathrm{m}$
~ To je $a t$, končna hitrost v $\mathrm{m/s}$, ne pot.
- $72\,\mathrm{m}$
~ To je $a t^2$ brez deljenja z $2$. Polovica pride iz ploščine trikotnika pod $v(t)$.
+ $36\,\mathrm{m}$
- $6\,\mathrm{m}$
~ Tu čas ni kvadriran. Pot raste s kvadratom časa.
> $s = \dfrac{a t^2}{2} = \dfrac{2 \cdot 36}{2} = 36\,\mathrm{m}$.

? V knjigi o srcu piše: »Kri v aorti ob utripu pospešuje s približno $10\,\mathrm{\frac{m}{s^2}}$.« Kaj pomeni ta podatek?
- Kri teče s hitrostjo $10\,\mathrm{\frac{m}{s}}$.
~ Pospešek ni hitrost. Kri teče le okoli $1\,\mathrm{\frac{m}{s}}$, ker pospešuje samo desetinko sekunde.
- Kri v vsaki sekundi preteče $10\,\mathrm{m}$.
~ To bi opisovalo stalno hitrost $10\,\mathrm{\frac{m}{s}}$, ne pospeška.
+ Hitrost krvi se, dokler pospešuje, poveča za $10\,\mathrm{\frac{m}{s}}$ v vsaki sekundi, v desetinki sekunde torej za $1\,\mathrm{\frac{m}{s}}$.
- Srce utripne $10$-krat na sekundo.
~ Pospešek nima zveze s številom utripov; njegova enota $\mathrm{m/s^2}$ govori o spremembi hitrosti.
> Pospešek $a = \dfrac{\Delta v}{\Delta t}$ pove, za koliko se hitrost spremeni v eni sekundi. Ker pospeševanje traja $0{,}1\,\mathrm{s}$, kri pridobi le $1\,\mathrm{\frac{m}{s}}$.

? Trije kolesarji enakomerno zavirajo do ustavitve. A: $v_0 = 10\,\mathrm{\frac{m}{s}}$, $a = -5\,\mathrm{\frac{m}{s^2}}$. B: $v_0 = 20\,\mathrm{\frac{m}{s}}$, $a = -5\,\mathrm{\frac{m}{s^2}}$. C: $v_0 = 10\,\mathrm{\frac{m}{s}}$, $a = -2{,}5\,\mathrm{\frac{m}{s^2}}$. Razvrsti zavorne poti od najkrajše do najdaljše.
- A, B, C
~ Tako razvrstiš, če gledaš samo začetno hitrost. Manjši pojemek pri C podaljša pot.
+ A, C, B
- C, A, B
~ Pri C je pojemek manjši, zato kolesar zavira dlje, ne krajše.
- A in C enako, nato B
~ Pri enaki začetni hitrosti in polovičnem pojemku je zavorna pot dvakrat daljša, ne enaka.
> Iz $v^2 = v_0^2 + 2as$ pri $v = 0$ dobimo $s = \dfrac{v_0^2}{2|a|}$: A $10\,\mathrm{m}$, C $20\,\mathrm{m}$, B $40\,\mathrm{m}$. Dvojna hitrost pri B štirikrat podaljša pot.

? Ana spelje iz mirovanja s stalnim pospeškom. V prvih $2\,\mathrm{s}$ preteče $4\,\mathrm{m}$. Kaj se zgodi s skupno potjo, če teče s tem pospeškom $4\,\mathrm{s}$?
- Podvoji se, na $8\,\mathrm{m}$.
~ Tako bi bilo pri stalni hitrosti. Ana med tekom pospešuje, zato preteče vsako sekundo več.
- Poveča se za $12\,\mathrm{m}$, torej je trikrat večja.
~ Za $12\,\mathrm{m}$ se res poveča, a skupna pot je $4 + 12 = 16\,\mathrm{m}$, torej štirikrat večja.
+ Postane štirikrat večja, $16\,\mathrm{m}$.
> Pri $v_0 = 0$ je $s = \dfrac{a t^2}{2}$: dvojni čas da štirikratno pot. Iz $4\,\mathrm{m}$ v $2\,\mathrm{s}$ sledi $a = 2\,\mathrm{\frac{m}{s^2}}$, v $4\,\mathrm{s}$ pa $s = 16\,\mathrm{m}$.

:::simboli
a | pospešek | a = \dfrac{v - v_0}{t} | m/s^2
v | hitrost ob času t | v = v_0 + a\,t | m/s
v_0 | začetna hitrost | | m/s | hitrost ob t = 0
t | čas | t = \dfrac{v - v_0}{a} | s
s | pot | s = v_0\,t + \dfrac{a\,t^2}{2} | m
:::
