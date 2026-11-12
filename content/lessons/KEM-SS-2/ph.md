---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. Na vesoljski postaji je vsak liter vode dragocen. Astronavtka ima $1\,\text{L}$ raztopine klorovodikove kisline s pH $2$. Za poskus potrebuje raztopino s pH $4$. Koliko vode mora dodati?

Ugibaj, preden bereš naprej. Marsikdo bi rekel »še en liter«: ker je $4$ dvakrat toliko kot $2$, se zdi, da je treba prostornino podvojiti. Odgovor je presenetljiv: dodati mora $99\,\text{L}$ vode. Razlog za to se skriva v tem, kako je pH sploh definiran.

Isto število srečaš daleč od Zemlje. Kapljice v oblakih Venere so iz koncentrirane žveplove kisline, zato mora sonda, ki leti skoznje, prenesti zelo kislo okolje. Za ocean pod ledom Saturnove lune Enkelad pa nekatere ocene kažejo, da je bazičen. Kemiki kislost ali bazičnost raztopin opišejo z enim številom, pH, ki v večini vodnih raztopin leži med $0$ in $14$. Danes se naučiš, kako to število izračunaš za raztopine močnih kislin in baz.

## Razlaga

Lestvico zgradimo po kosih. Za vsakim kosom je kratek preizkus z odgovorom.

**1. kos: oksonijevi ioni iz močne kisline.** Pri kislinah in bazah si spoznal, da kislina odda proton vodi. Nastanejo **oksonijevi ioni** $\mathrm{H_3O^+}$ (pogosto jih na kratko pišemo kot $\mathrm{H^+}$). **Močna kislina**, na primer $\mathrm{HCl}$ ali $\mathrm{HNO_3}$, odda proton popolnoma:

$$\mathrm{HCl + H_2O \rightarrow H_3O^+ + Cl^-}$$

Iz vsake molekule $\mathrm{HCl}$ nastane en oksonijev ion. Zato pri enoprotonski močni kislini velja $[\mathrm{H_3O^+}] = c(\text{kisline})$. Oglati oklepaji pomenijo množinsko koncentracijo v $\text{mol/L}$. Pri žveplovi kislini $\mathrm{H_2SO_4}$ to ne gre tako preprosto: popolnoma odda le prvi proton, drugega le delno, zato $[\mathrm{H_3O^+}]$ ni $2c$.

*Preizkus:* koliko je $[\mathrm{H_3O^+}]$ v raztopini $\mathrm{HNO_3}$ s $c = 0{,}01\,\text{mol/L}$? *Odgovor: $0{,}01\,\text{mol/L} = 10^{-2}\,\text{mol/L}$.*

**2. kos: od potence do pH.** Koncentracije oksonijevih ionov segajo od približno $1$ do $10^{-14}\,\text{mol/L}$. S tolikimi ničlami je nerodno računati. Zato uporabimo **desetiški logaritem**: $\log 10^{x} = x$. Logaritem pove, na katero potenco moraš dvigniti $10$, da dobiš dano število:

| število | kot potenca | $\log$ |
|---|---|---|
| $100$ | $10^{2}$ | $2$ |
| $0{,}001$ | $10^{-3}$ | $-3$ |
| $0{,}0020$ | $10^{-2{,}70}$ | $-2{,}70$ |

Zadnjo vrstico da kalkulator: tipka »log«, nato $0{,}0020$. Rezultat je smiseln: $0{,}0020$ leži med $0{,}001$ in $0{,}01$, zato je njegov logaritem med $-3$ in $-2$. **pH** je definiran kot

$$\mathrm{pH} = -\log\,[\mathrm{H_3O^+}]$$

Minus je tam zato, da so vrednosti pozitivne: $-\log 10^{-3} = -(-3) = 3$.

*Preizkus:* $[\mathrm{H_3O^+}] = 10^{-5}\,\text{mol/L}$. Koliko je pH? *Odgovor: $5$.*

**3. kos: lestvica in faktor deset.** Oglej si, kaj se dogaja vzdolž lestvice:

| pH | $[\mathrm{H_3O^+}]$ v $\text{mol/L}$ | vrsta raztopine |
|---|---|---|
| $1$ | $10^{-1} = 0{,}1$ | močno kisla |
| $2$ | $10^{-2} = 0{,}01$ | kisla |
| $4$ | $10^{-4} = 0{,}0001$ | kisla |
| $7$ | $10^{-7}$ | nevtralna |
| $12$ | $10^{-12}$ | bazična |

Pri $\mathrm{pH} < 7$ je raztopina kisla, pri $\mathrm{pH} = 7$ nevtralna, pri $\mathrm{pH} > 7$ bazična (vse pri $25\,^\circ\mathrm{C}$). Ko se pH poveča za $1$, je oksonijevih ionov **desetkrat manj**. Od pH $2$ do pH $4$ se koncentracija zmanjša $10 \cdot 10 = 100$-krat. Prav zato mora astronavtka iz uganke $1\,\text{L}$ razredčiti do $100\,\text{L}$, torej dodati $99\,\text{L}$ vode.

Na lestvici je to videti kot kratek skok za dve enoti, čeprav se za njim skriva faktor $100$:

:::risba premica
opis: Lestvica pH od 0 do 14. Od 0 do 7 je raztopina kisla, pri 7 nevtralna, od 7 do 14 bazična. Lok od pH 2 do pH 4 kaže redčenje iz uganke: oksonijevih ionov je 100-krat manj.
od: 0
do: 14
interval: 0 .. 7 | | oranžna
interval: 7 .. 14 | | modra
interval: 10 .. 14 | bazično | modra
točka: 7 | nevtralno
skok: 2 -> 4 | 100-krat manj H_3O^+
interval: 0 .. 2 | kislo | oranžna
:::

V aplikaciji v simulaciji »pH lestvica« nastavi drsnik na pH $3$ in si zapiši $[\mathrm{H_3O^+}]$. Preden ga premakneš na pH $4$, napovej novo koncentracijo. Nato preveri: pri pH $3$ je $10^{-3}\,\text{mol/L}$, pri pH $4$ pa $10^{-4}\,\text{mol/L}$. Eksponent se zmanjša natanko za ena, koncentracija pade na desetino.

:::premisli
Astronavtka $1\,\text{L}$ raztopine s pH $2$ razredči samo do $2\,\text{L}$. Napovej: bo pH $4$, $3$ ali nekaj med $2$ in $3$?
---
Med $2$ in $3$. Koncentracija se le razpolovi: $[\mathrm{H_3O^+}] = 0{,}0050\,\text{mol/L}$, $\mathrm{pH} = -\log 0{,}0050 \approx 2{,}30$. Za en cel korak pH bi morala raztopino razredčiti desetkrat.
:::

**4. kos: voda in pOH.** Voda v majhni meri reagira sama s seboj (**avtoprotoliza vode**): $\mathrm{2H_2O \rightleftharpoons H_3O^+ + OH^-}$. To je ravnotežje, kakršno poznaš iz poglavja o kemijskem ravnotežju. Vode je toliko, da se njena koncentracija praktično ne spreminja, zato je v konstanti ne pišemo. Pri $25\,^\circ\mathrm{C}$ je **ionski produkt vode**

$$K_w = [\mathrm{H_3O^+}] \cdot [\mathrm{OH^-}] = 10^{-14}$$

To velja v vsaki vodni raztopini. Če je enega iona več, je drugega ustrezno manj. Po vzoru pH definiramo **pOH** $= -\log[\mathrm{OH^-}]$. Pri množenju potenc se eksponenti seštejejo, na primer $10^{-3} \cdot 10^{-11} = 10^{-14}$. Eksponenta sta ravno $-\mathrm{pH}$ in $-\mathrm{pOH}$, zato iz ionskega produkta sledi

$$\mathrm{pH} + \mathrm{pOH} = 14$$

Slika kaže to povezavo za raztopino s pH $3$. Na navpični osi je eksponent koncentracije: $-3$ pomeni $10^{-3}\,\text{mol/L}$. Polna črta velja za $\mathrm{H_3O^+}$, črtkana za $\mathrm{OH^-}$. Pri pH $3$ je $[\mathrm{H_3O^+}] = 10^{-3}\,\text{mol/L}$ in $[\mathrm{OH^-}] = 10^{-11}\,\text{mol/L}$, eksponenta se seštejeta v $-14$.

:::risba graf
opis: Dve premici nad lestvico pH od 0 do 14. Na navpični osi je eksponent koncentracije v mol/L. Polna premica za oksonijeve ione pada od 0 do −14, črtkana za hidroksidne ione raste od −14 do 0; sekata se pri pH 7. V aplikaciji drsnik premika pH od 1 do 13. Izbrano je pH = {p}: eksponent pri oksonijevih ionih je {-p}, pri hidroksidnih {p-14}, pOH je {14-p}.
x: 0 .. 14 | 2 | pH
y: -14 .. 0 | 2 | eksponent
višina: 230
drsnik: p | 1 .. 13 | 1 | 3 | pH raztopine
f: -x | oranžna debelo
f: x - 14 | modra črtkano
napis: 10; -4 | OH^- | nad levo | modra
napis: 10; -10 | H_3O^+ | pod levo | oranžna
črta: p; -p -> p; p - 14 | siva črtkano
točka: p; -p | | | oranžna
točka: p; p - 14 | | | modra
podnapis: pH = {p}, pOH = {14-p}; eksponenta: {-p} in {p-14}
:::

V aplikaciji premikaj drsnik pod sliko od pH $3$ proti $7$ in naprej do $12$. Preden prideš do pH $12$, napovej oba eksponenta. Opazuj obe piki: ko se ena spusti za eno enoto, se druga za eno dvigne, vsota eksponentov pa ostane $-14$. Pri pH $7$ se piki srečata: obeh ionov je enako, raztopina je nevtralna.

*Preizkus:* raztopina ima pOH $3$. Koliko je pH? *Odgovor: $14 - 3 = 11$, raztopina je bazična.*

**5. kos: močne baze.** **Močne baze**, na primer $\mathrm{NaOH}$ in $\mathrm{KOH}$, v vodi popolnoma disociirajo: $\mathrm{NaOH \rightarrow Na^+ + OH^-}$. Zato je $[\mathrm{OH^-}] = c(\text{baze})$. Barijev hidroksid $\mathrm{Ba(OH)_2}$ ima dve hidroksidni skupini, zato da dvakrat več ionov: $[\mathrm{OH^-}] = 2 \cdot c$. Pri bazi gre račun v dveh korakih: najprej pOH, nato $\mathrm{pH} = 14 - \mathrm{pOH}$.

*Preizkus:* koliko je pH raztopine $\mathrm{KOH}$ s $c = 10^{-2}\,\text{mol/L}$? *Odgovor: $\mathrm{pOH} = 2$, $\mathrm{pH} = 12$.*

:::premisli
Kislino s pH $5$ razredčimo tisočkrat, nato še enkrat tisočkrat. Ali dobimo pH $11$? Zakaj?
---
Ne. Voda, s katero redčimo, prinese enako ionov $\mathrm{H_3O^+}$ kot $\mathrm{OH^-}$, zato $\mathrm{OH^-}$ nikoli ne prevladajo. Ko kisline skoraj ni več, odločajo ioni iz vode same, zato se pH le približuje $7$ (od spodaj).
:::

**6. kos: koncentracije, ki niso potence števila 10.** Pri $c = 0{,}0020\,\text{mol/L}$ uporabiš kalkulator: $\mathrm{pH} = -\log 0{,}0020 \approx 2{,}70$. Ocena za kontrolo: $0{,}0020$ leži med $10^{-3}$ in $10^{-2}$, zato mora biti pH med $2$ in $3$. Pot nazaj je **obratni račun**: $[\mathrm{H_3O^+}] = 10^{-\mathrm{pH}}\,\text{mol/L}$. Za pH $2{,}70$ vtipkaš $10^{-2{,}70}$ in dobiš približno $0{,}0020\,\text{mol/L}$.

Kako se pH spreminja s koncentracijo močne enoprotonske kisline, kaže krivulja $\mathrm{pH} = -\log c$. Označena je raztopina iz uganke: $c = 0{,}01\,\text{mol/L}$, pH $2{,}00$.

:::risba graf
opis: Krivulja pH = −log c za močno enoprotonsko kislino, c od 0 do 0,1 mol/L. Pri majhnih koncentracijah je krivulja strma, pri večjih položna. V aplikaciji drsnik spreminja koncentracijo. Izbrano je c = {c} mol/L, točka na krivulji ima pH = {-log(c):.2}.
x: 0 .. 0,14 | 0,02 | c (mol/L)
y: 0 .. 4 | 1 | pH
drsnik: c | 0,005 .. 0,1 | 0,005 | 0,01 | koncentracija kisline c v mol/L
f: -log(x) | modra | 0,0002 .. 0,1
črta: c; 0 -> c; -log(c) -> 0; -log(c) | oranžna črtkano
točka: c; -log(c) | pH = {-log(c):.2} | nad desno | oranžna
podnapis: c = {c} mol/L, pH = {-log(c):.2}
:::

V aplikaciji z drsnikom pod sliko koncentracijo razpolovi na $0{,}005\,\text{mol/L}$: pH zraste z $2{,}00$ na $2{,}30$. Nato pojdi na $0{,}1\,\text{mol/L}$ in jo razpolovi na $0{,}05\,\text{mol/L}$: pH zraste z $1{,}00$ na $1{,}30$. Razpolovitev pomeni deljenje z $2$, logaritem pa deljenje spremeni v odštevanje: $-\log\frac{c}{2} = -\log c + \log 2$. Zato razpolovitev pH vedno dvigne za enakih $\log 2 \approx 0{,}30$.

Kaj pa, če obakrat odvzameš enako, $0{,}005\,\text{mol/L}$? Napovej, nato preveri na krivulji. Enak odvzem ne pomeni enakega premika: zmanjšanje za $0{,}005\,\text{mol/L}$ pri $0{,}01\,\text{mol/L}$ dvigne pH za $0{,}30$, pri $0{,}1\,\text{mol/L}$ pa le za približno $0{,}02$. Zato je krivulja na levi strma, na desni položna.

## Rešeni primeri

### Primer 1 (lažji): želodčni sok

Želodčni sok vsebuje klorovodikovo kislino, njegov pH je običajno med $1{,}5$ in $3{,}5$. Vzorec ima $c(\mathrm{HCl}) = 0{,}030\,\text{mol/L}$. Kolikšen je pH vzorca in ali leži v običajnem območju?

**Podatki:** $c(\mathrm{HCl}) = 0{,}030\,\text{mol/L}$, $\mathrm{HCl}$ je močna enoprotonska kislina
**Iščemo:** $\mathrm{pH}$

:::formula
$[\mathrm{H_3O^+}] = c(\mathrm{HCl})$, $\quad \mathrm{pH} = -\log[\mathrm{H_3O^+}]$
:::

**Rešitev:**

1. $\mathrm{HCl}$ odda proton popolnoma, zato je $[\mathrm{H_3O^+}] = 0{,}030\,\text{mol/L}$.
2. Ocena pred računom: $0{,}030$ leži med $10^{-2}$ in $10^{-1}$, zato bo pH med $1$ in $2$.
3. $\mathrm{pH} = -\log 0{,}030 \approx 1{,}52$.
4. Kontrola: pH je med $1$ in $2$, kot pričakujemo, in tik nad spodnjo mejo $1{,}5$.
5. Odgovor: vzorec ima pH $1{,}52$, kar je še v običajnem območju želodčnega soka.

### Primer 2: baza z dvema hidroksidnima skupinama

V šolskem laboratoriju pripravijo raztopino $\mathrm{Ba(OH)_2}$ s koncentracijo $0{,}0025\,\text{mol/L}$. Kolikšen je pH?

**Podatki:** $c(\mathrm{Ba(OH)_2}) = 0{,}0025\,\text{mol/L}$, močna baza, dva iona $\mathrm{OH^-}$ na formulsko enoto
**Iščemo:** $\mathrm{pH}$

:::formula
$[\mathrm{OH^-}] = 2 \cdot c$, $\quad \mathrm{pOH} = -\log[\mathrm{OH^-}]$, $\quad \mathrm{pH} = 14 - \mathrm{pOH}$
:::

**Rešitev:**

1. Disociacija: $\mathrm{Ba(OH)_2 \rightarrow Ba^{2+} + 2\,OH^-}$. Iz ene formulske enote nastaneta dva hidroksidna iona.
2. $[\mathrm{OH^-}] = 2 \cdot 0{,}0025\,\text{mol/L} = 0{,}0050\,\text{mol/L}$.
3. $\mathrm{pOH} = -\log 0{,}0050 \approx 2{,}30$. Ocena: $0{,}0050$ leži med $10^{-3}$ in $10^{-2}$, zato je pOH med $2$ in $3$.
4. $\mathrm{pH} = 14 - 2{,}30 = 11{,}70$.
5. Kontrola: baza, pH nad $7$. Ustreza.
6. Odgovor: raztopina ima pH $11{,}70$.

### Primer 3 (težji): model Enkeladovega oceana

Raziskovalci želijo v laboratoriju posnemati bazični ocean Enkelada. Objavljene ocene iz podatkov sonde Cassini se razlikujejo: prejšnje ocene so bile okoli pH $8$ do $9$, ena iz leta 2015 okoli $11$ do $12$, analiza iz leta 2025 pa daje $10{,}1$ do $11{,}6$. Potrebujejo $250\,\text{mL}$ raztopine $\mathrm{NaOH}$ s pH $11{,}00$. Koliko gramov $\mathrm{NaOH}$ morajo raztopiti? ($M(\mathrm{NaOH}) = 40{,}0\,\text{g/mol}$)

**Podatki:** $\mathrm{pH} = 11{,}00$, $V = 250\,\text{mL} = 0{,}250\,\text{L}$, $M = 40{,}0\,\text{g/mol}$, $\mathrm{NaOH}$ je močna baza, $25\,^\circ\mathrm{C}$
**Iščemo:** maso $m(\mathrm{NaOH})$

:::formula
$\mathrm{pOH} = 14 - \mathrm{pH}$, $\quad [\mathrm{OH^-}] = 10^{-\mathrm{pOH}}$

$n = c \cdot V$, $\quad m = n \cdot M$
:::

**Rešitev:**

1. Vprašanje je obrnjeno: iz pH iščemo snov. Najprej pOH: $\mathrm{pOH} = 14 - 11{,}00 = 3{,}00$.
2. $[\mathrm{OH^-}] = 10^{-3}\,\text{mol/L}$. Ker $\mathrm{NaOH}$ popolnoma disociira, je tudi $c(\mathrm{NaOH}) = 10^{-3}\,\text{mol/L}$.
3. Množina: $n = 0{,}001\,\text{mol/L} \cdot 0{,}250\,\text{L} = 0{,}00025\,\text{mol}$. Prostornino smo pretvorili v litre, ker je koncentracija v $\text{mol/L}$.
4. Masa: $m = 0{,}00025\,\text{mol} \cdot 40{,}0\,\text{g/mol} = 0{,}010\,\text{g}$.
5. Odgovor: raztopiti morajo $0{,}010\,\text{g}$ ($10\,\text{mg}$) $\mathrm{NaOH}$. Izbrani pH $11{,}00$ leži znotraj ocene $10{,}1$ do $11{,}6$. Tako majhno maso v praksi raje odmerijo iz bolj koncentrirane raztopine.

### Primer 4 – zdaj ti

Na vesoljski postaji $15{,}0\,\text{mL}$ raztopine $\mathrm{HCl}$ s koncentracijo $0{,}10\,\text{mol/L}$ razredčijo z vodo do $500\,\text{mL}$. Kolikšen je pH nove raztopine?

**Podatki:** $V_1 = 15{,}0\,\text{mL}$, $c_1 = 0{,}10\,\text{mol/L}$, $V_2 = 500\,\text{mL}$, $\mathrm{HCl}$ je močna enoprotonska kislina
**Iščemo:** $\mathrm{pH}$ razredčene raztopine

:::formula
$c_1 \cdot V_1 = c_2 \cdot V_2$, $\quad \mathrm{pH} = -\log c_2$
:::

**Rešitev:**

1. Množina kisline se pri redčenju ne spremeni, spremeni se le prostornina.
2. $c_2 = \dfrac{c_1 \cdot V_1}{V_2}$. Enoti mL se pokrajšata, zato pretvorba ni potrebna.
3. Izračunaj $c_2$ in nato pH sam, potem preveri:

:::premisli
Koliko sta $c_2$ in pH?
---
$c_2 = \dfrac{0{,}10 \cdot 15{,}0}{500}\,\text{mol/L} = 0{,}0030\,\text{mol/L}$ in $\mathrm{pH} = -\log 0{,}0030 \approx 2{,}52$. Raztopino smo razredčili približno $33$-krat, zato je pH zrasel z $1{,}00$ na $2{,}52$: za $\log 33 \approx 1{,}52$, torej manj kot dve enoti.
:::

## Pogoste napake

- **Izgubljen minus.** Kdor računa $\log 10^{-3} = -3$ in tam ostane, dobi negativen pH za navadno razredčeno kislino. Definicija ima minus: $\mathrm{pH} = -\log[\mathrm{H_3O^+}]$, zato je pH $3$.
- **pOH namesto pH.** Pri bazi je $-\log[\mathrm{OH^-}]$ šele pOH. Kdor se tu ustavi, za bazo dobi pH pod $7$, kar je nesmiselno. Popravek: $\mathrm{pH} = 14 - \mathrm{pOH}$.
- **Pozabljeni drugi ion $\mathrm{OH^-}$.** Pri $\mathrm{Ba(OH)_2}$ ali $\mathrm{Ca(OH)_2}$ je $[\mathrm{OH^-}] = 2 \cdot c$, ne $c$. Formulo baze vedno preberi do konca.
- **Linearno razmišljanje.** »pH $4$ je dvakrat pH $2$, torej je kisline polovico manj.« Napačno: lestvica je logaritemska. Vsaka enota pomeni faktor $10$, dve enoti faktor $100$.
- **Mililitri v $n = c \cdot V$.** Kdor v Primeru 3 vstavi $250$ namesto $0{,}250\,\text{L}$, dobi $10\,\text{g}$ namesto $0{,}010\,\text{g}$. Pri koncentraciji v $\text{mol/L}$ prostornino vedno pretvori v litre.

## Povzetek

- $\mathrm{pH} = -\log[\mathrm{H_3O^+}]$ in $\mathrm{pOH} = -\log[\mathrm{OH^-}]$; obratno $[\mathrm{H_3O^+}] = 10^{-\mathrm{pH}}$.
- Pri $25\,^\circ\mathrm{C}$: $[\mathrm{H_3O^+}] \cdot [\mathrm{OH^-}] = 10^{-14}$, torej $\mathrm{pH} + \mathrm{pOH} = 14$.
- pH pod $7$ kislo, $7$ nevtralno, nad $7$ bazično.
- Močna enoprotonska kislina: $[\mathrm{H_3O^+}] = c$. Močna baza: $[\mathrm{OH^-}] = c$ oziroma $2c$ pri dveh skupinah $\mathrm{OH}$.
- Pri bazi najprej pOH, nato $\mathrm{pH} = 14 - \mathrm{pOH}$.
- Ena enota pH pomeni desetkratno razliko v koncentraciji oksonijevih ionov.

## Drugače: Na sliki

Predstavljaj si pH lestvico kot stopnice. Vsaka stopnica više pomeni **desetkrat manj** oksonijevih ionov:

```
pH 1   | 0,1 mol/L        ##########
pH 2   | 0,01 mol/L       #
pH 3   | 0,001 mol/L      (desetina vrstice višje)
  ⋮
pH 7   | 0,0000001 mol/L  nevtralno
```

Stolpec za pH $2$ je že desetkrat krajši od stolpca za pH $1$, stolpca za pH $3$ pa skoraj ne vidiš več. Na navadni lestvici bi bilo vse od pH $3$ naprej stisnjeno v ničlo. Logaritem stopnice razporedi enakomerno, da lahko na isti trak spraviš želodčni sok in bazično vodo Enkelada.

## Drugače: Bolj natančno

**Od kod $\mathrm{pH} + \mathrm{pOH} = 14$.** Logaritmiramo ionski produkt vode in uporabimo pravilo $\log(a \cdot b) = \log a + \log b$:

$$\log[\mathrm{H_3O^+}] + \log[\mathrm{OH^-}] = -14$$

Ko pomnožimo z $-1$, dobimo $\mathrm{pH} + \mathrm{pOH} = 14$. V čisti vodi sta koncentraciji enaki, $10^{-7}\,\text{mol/L}$, zato je pH $7$.

**Meje preprostega računa.** Pri zelo razredčeni kislini ($c \approx 10^{-7}\,\text{mol/L}$ ali manj) ioni iz vode niso več zanemarljivi. Raztopina $\mathrm{HCl}$ s $c = 10^{-8}\,\text{mol/L}$ nima pH $8$, ampak približno $6{,}98$: označimo $x = [\mathrm{H_3O^+}]$. Kislina prispeva $10^{-8}\,\text{mol/L}$, preostali oksonijevi ioni nastanejo iz vode, vsak skupaj z enim $\mathrm{OH^-}$. Zato je $[\mathrm{OH^-}] = x - 10^{-8}$ in iz ionskega produkta $x \cdot (x - 10^{-8}) = 10^{-14}$ dobimo $x \approx 1{,}05 \cdot 10^{-7}\,\text{mol/L}$.

Slika kaže kislino s pH $5$, ki jo zaporedoma redčimo po desetkrat. Po treh redčenjih je $c = 10^{-8}\,\text{mol/L}$ in pH $6{,}98$. Preprost račun (črtkana črta) bi po šestih redčenjih dal pH $11$, resnična krivulja pa se zravna tik pod $7$.

:::risba graf
opis: Kislino s pH 5 redčimo po desetkrat. Na vodoravni osi je število desetkratnih redčenj od 0 do 6, na navpični pH od 4 do 12. Črtkana premica preprostega računa raste od 5 do 11. Vodoravna črta označuje pH 7. Polna krivulja resničnega pH gre skozi 6,0 pri enem redčenju, 6,79 pri dveh in 6,98 pri treh, nato se zravna tik pod 7.
x: 0 .. 6 | 1 | redčenja
y: 4 .. 12 | 1 | pH
višina: 230
f: 5 + x | siva črtkano
f: -log((10^(-5-x) + sqrt(10^(-10-2*x) + 4*10^(-14)))/2) | modra debelo
črta: 0; 7 -> 6; 7 | siva
napis: 0,2; 7 | pH 7 | nad desno | siva
točka: 3; 6,98 | 6,98 | pod desno | modra
točka: 6; 11 | preprost račun: 11 | nad levo | siva
točka: 6; 7 | skoraj 7 | nad levo | modra
podnapis: Polna črta: resnični pH. Črtkana črta: preprost račun.
:::

Na drugem koncu pH zdrsne pod ničlo: pri $c = 2\,\text{mol/L}$ je $-\log 2 \approx -0{,}30$. Negativen pH ni napaka; pomeni le, da lestvica od $0$ do $14$ velja za večino raztopin, ne za vse. Zelo koncentrirane kisline, kakršna je v oblakih Venere, so zunaj nje, račun s koncentracijo pa je pri njih le približen.

Tudi $K_w$ je odvisen od temperature: pri višji temperaturi je večji, zato je nevtralni pH tam nekoliko pod $7$. Pri šibkih kislinah in bazah popolna disociacija ne velja; to obravnava naslednje poglavje.

**Zaokroževanje.** Pri pH je število decimalk enako številu značilnih mest koncentracije: $c = 2{,}0 \cdot 10^{-3}\,\text{mol/L}$ (dve značilni mesti) da pH $2{,}70$ (dve decimalki).

## Preveri se

? Katera trditev je pravilna (pri $25\,^\circ\mathrm{C}$)?
- Raztopina s pH $8$ je rahlo kisla.
~ Meja je pri $7$: vse nad $7$ je bazično. Morda si zamenjal strani lestvice: kisle so raztopine pod $7$.
+ Nižji pH pomeni večjo koncentracijo oksonijevih ionov.
- pH baze izračunamo kot $-\log[\mathrm{OH^-}]$.
~ To je pOH. pH dobiš šele z $\mathrm{pH} = 14 - \mathrm{pOH}$.
- Raztopina $\mathrm{HCl}$ s $c = 10^{-3}\,\text{mol/L}$ ima pH $-3$.
~ Izgubil si minus iz definicije: $\log 10^{-3} = -3$, pH pa je $-\log 10^{-3} = 3$.
> Zaradi minusa v $\mathrm{pH} = -\log[\mathrm{H_3O^+}]$ večja koncentracija da manjši pH.

? Koliko gramov $\mathrm{NaOH}$ ($M = 40{,}0\,\text{g/mol}$) potrebuješ za $500\,\text{mL}$ raztopine s pH $12{,}00$?
- $200\,\text{g}$
~ Prostornino si vstavil v mililitrih: $0{,}010 \cdot 500 \cdot 40{,}0$. V $n = c \cdot V$ mora biti $V$ v litrih.
- $0{,}40\,\text{g}$
~ To je masa za $1\,\text{L}$: množil si $c \cdot M$ in prostornino izpustil.
+ $0{,}20\,\text{g}$
- $2{,}0 \cdot 10^{-11}\,\text{g}$
~ Za koncentracijo baze si vzel $[\mathrm{H_3O^+}] = 10^{-12}\,\text{mol/L}$ namesto $[\mathrm{OH^-}]$.
> $\mathrm{pOH} = 14 - 12{,}00 = 2{,}00$, zato je $c(\mathrm{NaOH}) = [\mathrm{OH^-}] = 0{,}010\,\text{mol/L}$. Množina je $0{,}010 \cdot 0{,}500 = 0{,}0050\,\text{mol}$, masa pa $0{,}0050 \cdot 40{,}0 = 0{,}20\,\text{g}$.

? Tina je izračunala pH raztopine $\mathrm{Ba(OH)_2}$ s $c = 0{,}010\,\text{mol/L}$ takole: $[\mathrm{OH^-}] = 0{,}010\,\text{mol/L}$, $\mathrm{pOH} = 2$, $\mathrm{pH} = 12$. Kje je napaka?
+ $[\mathrm{OH^-}]$ je $0{,}020\,\text{mol/L}$, zato je pH približno $12{,}30$.
- $[\mathrm{OH^-}]$ je $0{,}0050\,\text{mol/L}$, zato je pH približno $11{,}70$.
~ Koncentracije nisi množil z $2$, ampak delil. Vsaka formulska enota da dva iona, ne pol iona.
- Napake ni, pH je $12$.
~ Ta račun velja za $\mathrm{NaOH}$, ki ima eno skupino $\mathrm{OH}$. $\mathrm{Ba(OH)_2}$ jih ima dve.
> $\mathrm{Ba(OH)_2 \rightarrow Ba^{2+} + 2\,OH^-}$, torej $[\mathrm{OH^-}] = 0{,}020\,\text{mol/L}$, $\mathrm{pOH} \approx 1{,}70$ in $\mathrm{pH} \approx 12{,}30$.

? Razvrsti raztopine po naraščajočem pH: $\mathrm{HCl}$ ($0{,}010\,\text{mol/L}$), $\mathrm{NaOH}$ ($0{,}010\,\text{mol/L}$) in $\mathrm{Ba(OH)_2}$ ($0{,}0050\,\text{mol/L}$).
- $\mathrm{HCl} < \mathrm{Ba(OH)_2} < \mathrm{NaOH}$
~ Pri $\mathrm{Ba(OH)_2}$ si vzel $[\mathrm{OH^-}] = c$ in dobil pH $11{,}70$. Vsaka formulska enota da dva iona.
- $\mathrm{NaOH} = \mathrm{Ba(OH)_2} < \mathrm{HCl}$
~ Pri bazah si se ustavil pri pOH $2$. pH baze je $14 - \mathrm{pOH} = 12$.
- $\mathrm{HCl} < \mathrm{NaOH} < \mathrm{Ba(OH)_2}$
~ Dve skupini $\mathrm{OH}$ še ne pomenita višjega pH: $2 \cdot 0{,}0050 = 0{,}010\,\text{mol/L}$, enako kot pri $\mathrm{NaOH}$.
+ $\mathrm{HCl} < \mathrm{NaOH} = \mathrm{Ba(OH)_2}$
> $\mathrm{HCl}$: pH $2$. $\mathrm{NaOH}$: $[\mathrm{OH^-}] = 0{,}010\,\text{mol/L}$, pOH $2$, pH $12$. $\mathrm{Ba(OH)_2}$: $[\mathrm{OH^-}] = 2 \cdot 0{,}0050 = 0{,}010\,\text{mol/L}$, torej prav tako pH $12$.

? Želodčni sok ima pH okoli $2{,}0$. Popiješ toliko vode, da se njegova prostornina potroji. Kolikšen je pH takoj zatem (druge vplive zanemarimo)?
- $6{,}0$
~ Potrojil si pH. Potroji se prostornina, koncentracija pa pade na tretjino.
+ približno $2{,}5$
- približno $0{,}67$
~ pH si delil s $3$. Na tretjino pade koncentracija, pH pa se spremeni le za $\log 3 \approx 0{,}48$.
- približno $1{,}5$
~ Premik je prave velikosti, smer pa ne: redčenje zmanjša $[\mathrm{H_3O^+}]$, zato pH zraste.
> $[\mathrm{H_3O^+}]$ pade z $0{,}010$ na približno $0{,}0033\,\text{mol/L}$, $\mathrm{pH} = -\log 0{,}0033 \approx 2{,}48$. Za celo enoto pH bi moral prostornino podeseteriti.

:::simboli
\mathrm{pH} | pH vrednost | \mathrm{pH} = -\log\,[\mathrm{H_3O^+}] | – | pri 25 °C velja pH + pOH = 14
\mathrm{pOH} | pOH vrednost | \mathrm{pOH} = -\log[\mathrm{OH^-}] | –
K_w | ionski produkt vode | K_w = [\mathrm{H_3O^+}] \cdot [\mathrm{OH^-}] | – | pri 25 °C 10⁻¹⁴; odvisen od temperature; pišemo brez enote
c | množinska koncentracija kisline ali baze | | mol/L | oglati oklepaji [ ] pomenijo koncentracijo iona
n | množina snovi | n = c \cdot V | mol
V | prostornina raztopine | | L
m | masa raztopljene snovi | m = n \cdot M | g
M | molska masa | | g/mol
c_1 | koncentracija pred redčenjem | | mol/L
c_2 | koncentracija po redčenju | c_2 = \dfrac{c_1 \cdot V_1}{V_2} | mol/L
V_1 | prostornina raztopine pred redčenjem | | L | $V_1$ in $V_2$ v isti enoti, lahko tudi mL
V_2 | prostornina raztopine po redčenju | | L | $V_1$ in $V_2$ v isti enoti, lahko tudi mL
:::
