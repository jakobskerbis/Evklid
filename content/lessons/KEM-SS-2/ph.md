---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. Na vesoljski postaji je vsak liter vode dragocen. Astronavtka ima $1\,\text{L}$ raztopine klorovodikove kisline s pH $2$. Za poskus potrebuje raztopino s pH $4$. Koliko vode mora dodati?

Ugibaj, preden bereš naprej. Večina reče »še en liter«, saj se zdi, da je $4$ dvakrat $2$. Odgovor je presenetljiv: dodati mora $99\,\text{L}$ vode. Razlog za to se skriva v tem, kako je pH sploh definiran.

Isto število srečaš daleč od Zemlje. Kapljice v oblakih Venere so iz koncentrirane žveplove kisline, zato mora sonda, ki leti skoznje, prenesti zelo kislo okolje. Za ocean pod ledom Saturnove lune Enkelad pa nekatere ocene kažejo, da je bazičen. Kemiki kislost ali bazičnost raztopin opišejo z enim številom, pH, ki v večini vodnih raztopin leži med $0$ in $14$. Danes se naučiš, kako to število izračunaš za raztopine močnih kislin in baz.

## Razlaga

Lestvico zgradimo po kosih. Za vsakim kosom je kratek preizkus z odgovorom.

**1. Kos: oksonijevi ioni iz močne kisline.** Pri kislinah in bazah si spoznal, da kislina odda proton vodi. Nastanejo **oksonijevi ioni** $\mathrm{H_3O^+}$ (pogosto jih na kratko pišemo kot $\mathrm{H^+}$). **Močna kislina**, na primer $\mathrm{HCl}$ ali $\mathrm{HNO_3}$, odda proton popolnoma:

$$\mathrm{HCl + H_2O \rightarrow H_3O^+ + Cl^-}$$

Iz vsake molekule $\mathrm{HCl}$ nastane en oksonijev ion. Zato pri enoprotonski močni kislini velja $[\mathrm{H_3O^+}] = c(\text{kisline})$. Oglati oklepaji pomenijo množinsko koncentracijo v $\text{mol/L}$.

*Preizkus:* koliko je $[\mathrm{H_3O^+}]$ v raztopini $\mathrm{HNO_3}$ s $c = 0{,}01\,\text{mol/L}$? *Odgovor: $0{,}01\,\text{mol/L} = 10^{-2}\,\text{mol/L}$.*

**2. Kos: od potence do pH.** Koncentracije oksonijevih ionov segajo od približno $1$ do $10^{-14}\,\text{mol/L}$. S tolikimi ničlami je nerodno računati. Zato uporabimo **desetiški logaritem**: $\log 10^{x} = x$. Logaritem pove, na katero potenco moraš dvigniti $10$, da dobiš dano število. **pH** je definiran kot

$$\mathrm{pH} = -\log\,[\mathrm{H_3O^+}]$$

Minus je tam zato, da so vrednosti pozitivne: $-\log 10^{-3} = -(-3) = 3$.

*Preizkus:* $[\mathrm{H_3O^+}] = 10^{-5}\,\text{mol/L}$. Koliko je pH? *Odgovor: $5$.*

**3. Kos: lestvica in faktor deset.** Oglej si, kaj se dogaja vzdolž lestvice:

| pH | $[\mathrm{H_3O^+}]$ v $\text{mol/L}$ | vrsta raztopine |
|---|---|---|
| $1$ | $10^{-1} = 0{,}1$ | močno kisla |
| $2$ | $10^{-2} = 0{,}01$ | kisla |
| $4$ | $10^{-4} = 0{,}0001$ | kisla |
| $7$ | $10^{-7}$ | nevtralna |
| $12$ | $10^{-12}$ | bazična |

Pri $\mathrm{pH} < 7$ je raztopina kisla, pri $\mathrm{pH} = 7$ nevtralna, pri $\mathrm{pH} > 7$ bazična (vse pri $25\,^\circ\mathrm{C}$). Ko se pH poveča za $1$, je oksonijevih ionov **desetkrat manj**. Od pH $2$ do pH $4$ se koncentracija zmanjša $10 \cdot 10 = 100$-krat. Prav zato mora astronavtka iz uganke $1\,\text{L}$ razredčiti do $100\,\text{L}$, torej dodati $99\,\text{L}$ vode.

V simulaciji spodaj (»pH lestvica«) nastavi drsnik na pH $3$ in si zapiši $[\mathrm{H_3O^+}]$. Nato ga premakni na pH $4$. Opazuj eksponent: zmanjša se natanko za ena, koncentracija pa pade na desetino.

:::premisli
Astronavtka $1\,\text{L}$ raztopine s pH $2$ razredči samo do $2\,\text{L}$. Napovej: bo pH $4$, $3$ ali nekaj med $2$ in $3$?
---
Med $2$ in $3$. Koncentracija se le razpolovi: $[\mathrm{H_3O^+}] = 0{,}005\,\text{mol/L}$, $\mathrm{pH} = -\log 0{,}005 \approx 2{,}30$. Za en cel korak pH bi morala raztopino razredčiti desetkrat.
:::

**4. Kos: voda in pOH.** Iz poglavja o ravnotežju veš, da voda v majhni meri reagira sama s seboj: $\mathrm{2H_2O \rightleftharpoons H_3O^+ + OH^-}$. Pri $25\,^\circ\mathrm{C}$ je ravnotežni **ionski produkt vode**

$$K_w = [\mathrm{H_3O^+}] \cdot [\mathrm{OH^-}] = 10^{-14}$$

To velja v vsaki vodni raztopini. Če je enega iona več, je drugega ustrezno manj. Po vzoru pH definiramo **pOH** $= -\log[\mathrm{OH^-}]$. Iz ionskega produkta sledi

$$\mathrm{pH} + \mathrm{pOH} = 14$$

*Preizkus:* raztopina ima pOH $3$. Koliko je pH? *Odgovor: $14 - 3 = 11$, raztopina je bazična.*

**5. Kos: močne baze.** **Močne baze**, na primer $\mathrm{NaOH}$ in $\mathrm{KOH}$, v vodi popolnoma disociirajo: $\mathrm{NaOH \rightarrow Na^+ + OH^-}$. Zato je $[\mathrm{OH^-}] = c(\text{baze})$. Barijev hidroksid $\mathrm{Ba(OH)_2}$ ima dve hidroksidni skupini, zato da dvakrat več ionov: $[\mathrm{OH^-}] = 2 \cdot c$. Pri bazi gre račun v dveh korakih: najprej pOH, nato $\mathrm{pH} = 14 - \mathrm{pOH}$.

*Preizkus:* koliko je pH raztopine $\mathrm{KOH}$ s $c = 10^{-2}\,\text{mol/L}$? *Odgovor: $\mathrm{pOH} = 2$, $\mathrm{pH} = 12$.*

:::premisli
Kislino s pH $5$ razredčimo tisočkrat, nato še enkrat tisočkrat. Ali dobimo pH $11$? Zakaj?
---
Ne. Razredčena kislina ne more postati bazična, saj ji ne dodamo nobenih ionov $\mathrm{OH^-}$. Ko kisline skoraj ni več, odločajo ioni iz vode same, zato se pH le približuje $7$ (z nižje strani).
:::

**6. Kos: koncentracije, ki niso potence števila 10.** Pri $c = 0{,}002\,\text{mol/L}$ uporabiš kalkulator: $\mathrm{pH} = -\log 0{,}002 \approx 2{,}70$. Ocena za kontrolo: $0{,}002$ leži med $10^{-3}$ in $10^{-2}$, zato mora biti pH med $2$ in $3$. Pot nazaj je **obratni račun**: $[\mathrm{H_3O^+}] = 10^{-\mathrm{pH}}\,\text{mol/L}$.

## Rešeni primeri

### Primer 1 (lažji): tesnilo za Venero

Tesnila za sondo, ki bo letela skozi kisle oblake Venere, najprej preizkusijo v raztopini $\mathrm{HCl}$ s koncentracijo $0{,}0010\,\text{mol/L}$. Kolikšen je pH te raztopine?

**Podatki:** $c(\mathrm{HCl}) = 0{,}0010\,\text{mol/L}$, $\mathrm{HCl}$ je močna enoprotonska kislina
**Iščemo:** $\mathrm{pH}$

:::formula
$[\mathrm{H_3O^+}] = c(\mathrm{HCl})$, $\quad \mathrm{pH} = -\log[\mathrm{H_3O^+}]$
:::

**Rešitev:**

1. $\mathrm{HCl}$ odda proton popolnoma, zato je $[\mathrm{H_3O^+}] = 0{,}0010\,\text{mol/L} = 10^{-3}\,\text{mol/L}$.
2. $\mathrm{pH} = -\log 10^{-3} = 3{,}00$.
3. Kontrola: pH je manjši od $7$, kar se za kislino spodobi.
4. Odgovor: raztopina ima pH $3{,}00$.

### Primer 2: baza z dvema hidroksidnima skupinama

V laboratoriju za vesoljske materiale pripravijo raztopino $\mathrm{Ba(OH)_2}$ s koncentracijo $0{,}0025\,\text{mol/L}$. Kolikšen je pH?

**Podatki:** $c(\mathrm{Ba(OH)_2}) = 0{,}0025\,\text{mol/L}$, močna baza, dva iona $\mathrm{OH^-}$ na formulsko enoto
**Iščemo:** $\mathrm{pH}$

:::formula
$[\mathrm{OH^-}] = 2 \cdot c$, $\quad \mathrm{pOH} = -\log[\mathrm{OH^-}]$, $\quad \mathrm{pH} = 14 - \mathrm{pOH}$
:::

**Rešitev:**

1. Disociacija: $\mathrm{Ba(OH)_2 \rightarrow Ba^{2+} + 2\,OH^-}$. Iz ene formulske enote nastaneta dva hidroksidna iona.
2. $[\mathrm{OH^-}] = 2 \cdot 0{,}0025\,\text{mol/L} = 0{,}005\,\text{mol/L}$.
3. $\mathrm{pOH} = -\log 0{,}005 \approx 2{,}30$.
4. $\mathrm{pH} = 14 - 2{,}30 = 11{,}70$.
5. Kontrola: baza, pH nad $7$. Ustreza.
6. Odgovor: raztopina ima pH $11{,}70$.

### Primer 3 (težji): model Enkeladovega oceana

Raziskovalci želijo v laboratoriju posnemati bazični ocean Enkelada. Potrebujejo $250\,\text{mL}$ raztopine $\mathrm{NaOH}$ s pH $11{,}00$. Koliko gramov $\mathrm{NaOH}$ morajo raztopiti? ($M(\mathrm{NaOH}) = 40{,}0\,\text{g/mol}$)

**Podatki:** $\mathrm{pH} = 11{,}00$, $V = 250\,\text{mL} = 0{,}250\,\text{L}$, $M = 40{,}0\,\text{g/mol}$
**Iščemo:** maso $m(\mathrm{NaOH})$

:::formula
$\mathrm{pOH} = 14 - \mathrm{pH}$, $\quad [\mathrm{OH^-}] = 10^{-\mathrm{pOH}}$

$n = c \cdot V$, $\quad m = n \cdot M$
:::

**Rešitev:**

1. Vprašanje je obrnjeno: iz pH iščemo snov. Najprej pOH: $\mathrm{pOH} = 14 - 11{,}00 = 3{,}00$.
2. $[\mathrm{OH^-}] = 10^{-3}\,\text{mol/L}$. Ker $\mathrm{NaOH}$ popolnoma disociira, je tudi $c(\mathrm{NaOH}) = 10^{-3}\,\text{mol/L}$.
3. Množina: $n = 0{,}001\,\text{mol/L} \cdot 0{,}250\,\text{L} = 0{,}00025\,\text{mol}$. Prostornino smo pretvorili v litre, ker je koncentracija v $\text{mol/L}$.
4. Masa: $m = 0{,}00025\,\text{mol} \cdot 40\,\text{g/mol} = 0{,}01\,\text{g}$.
5. Odgovor: raztopiti morajo $0{,}010\,\text{g}$ ($10\,\text{mg}$) $\mathrm{NaOH}$. Tako majhno maso v praksi raje odmerijo iz bolj koncentrirane raztopine.

### Primer 4 – zdaj ti

Na vesoljski postaji $10{,}0\,\text{mL}$ raztopine $\mathrm{HCl}$ s koncentracijo $0{,}10\,\text{mol/L}$ razredčijo z vodo do $500\,\text{mL}$. Kolikšen je pH nove raztopine?

**Podatki:** $V_1 = 10{,}0\,\text{mL}$, $c_1 = 0{,}10\,\text{mol/L}$, $V_2 = 500\,\text{mL}$
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
$c_2 = \dfrac{0{,}10 \cdot 10{,}0}{500}\,\text{mol/L} = 0{,}0020\,\text{mol/L}$ in $\mathrm{pH} = -\log 0{,}0020 \approx 2{,}70$. Raztopino smo razredčili $50$-krat, zato je pH zrasel z $1{,}00$ na $2{,}70$, za manj kot dve enoti.
:::

## Pogoste napake

- **Izgubljen minus.** Kdor računa $\log 10^{-3} = -3$ in tam ostane, dobi negativen pH za navadno razredčeno kislino. Definicija ima minus: $\mathrm{pH} = -\log[\mathrm{H_3O^+}]$, zato je pH $3$.
- **pOH namesto pH.** Pri bazi je $-\log[\mathrm{OH^-}]$ šele pOH. Kdor se tu ustavi, za bazo dobi pH pod $7$, kar je nesmiselno. Popravek: $\mathrm{pH} = 14 - \mathrm{pOH}$.
- **Pozabljeni drugi ion $\mathrm{OH^-}$.** Pri $\mathrm{Ba(OH)_2}$ ali $\mathrm{Ca(OH)_2}$ je $[\mathrm{OH^-}] = 2 \cdot c$, ne $c$. Formulo baze vedno preberi do konca.
- **Linearno razmišljanje.** »pH $4$ je dvakrat pH $2$, torej je kisline polovico manj.« Napačno: lestvica je logaritemska. Vsaka enota pomeni faktor $10$, dve enoti faktor $100$.
- **Mililitri v $c = n/V$.** Prostornino v mililitrih vstaviš v obrazec za $\text{mol/L}$ in dobiš koncentracijo, ki je tisočkrat premajhna. Pred računom pretvori v litre.

## Povzetek

- $\mathrm{pH} = -\log[\mathrm{H_3O^+}]$ in $\mathrm{pOH} = -\log[\mathrm{OH^-}]$; obratno $[\mathrm{H_3O^+}] = 10^{-\mathrm{pH}}$.
- Pri $25\,^\circ\mathrm{C}$: $[\mathrm{H_3O^+}] \cdot [\mathrm{OH^-}] = 10^{-14}$, torej $\mathrm{pH} + \mathrm{pOH} = 14$.
- pH pod $7$ kislo, $7$ nevtralno, nad $7$ bazično.
- Močna enoprotonska kislina: $[\mathrm{H_3O^+}] = c$. Močna baza: $[\mathrm{OH^-}] = c$ oziroma $2c$ pri dveh skupinah $\mathrm{OH}$.
- Pri bazi najprej pOH, nato $\mathrm{pH} = 14 - \mathrm{pOH}$.
- Ena enota pH pomeni desetkratno razliko v koncentraciji oksonijevih ionov.

## Drugače: Na sliki

Predstavljaj si pH lestvico kot stopnice, ki vodijo navzdol v klet. Vsaka stopnica ni enako visoka po koncentraciji, ampak vsaka koncentracijo **deli z deset**:

```
pH 1   | 0,1 mol/L        ##########
pH 2   | 0,01 mol/L       #
pH 3   | 0,001 mol/L      (desetina vrstice višje)
  ⋮
pH 7   | 0,0000001 mol/L  nevtralno
```

Stolpec za pH $2$ je že desetkrat krajši od stolpca za pH $1$, stolpca za pH $3$ pa skoraj ne vidiš več. Na navadni lestvici bi bilo vse od pH $3$ naprej stisnjeno v ničlo. Logaritem stopnice razporedi enakomerno, da lahko na isti trak spraviš Venerine kisle oblake in bazično vodo Enkelada.

## Drugače: Bolj natančno

**Od kod $\mathrm{pH} + \mathrm{pOH} = 14$.** Logaritmiramo ionski produkt vode in uporabimo pravilo $\log(a \cdot b) = \log a + \log b$:

$$\log[\mathrm{H_3O^+}] + \log[\mathrm{OH^-}] = -14$$

Ko pomnožimo z $-1$, dobimo $\mathrm{pH} + \mathrm{pOH} = 14$. V čisti vodi sta koncentraciji enaki, $10^{-7}\,\text{mol/L}$, zato je pH $7$.

**Meje preprostega računa.** Pri zelo razredčeni kislini ($c \approx 10^{-7}\,\text{mol/L}$ ali manj) ioni iz vode niso več zanemarljivi. Raztopina $\mathrm{HCl}$ s $c = 10^{-8}\,\text{mol/L}$ nima pH $8$, ampak približno $6{,}98$: iz ravnotežja $x \cdot (x - 10^{-8}) = 10^{-14}$ dobimo $x \approx 1{,}05 \cdot 10^{-7}\,\text{mol/L}$. Tudi $K_w$ je odvisen od temperature: pri višji temperaturi je večji, zato je nevtralni pH tam nekoliko pod $7$. Pri šibkih kislinah in bazah popolna disociacija ne velja; to obravnava naslednje poglavje.

**Zaokroževanje.** Pri pH je število decimalk enako številu značilnih mest koncentracije: $c = 2{,}0 \cdot 10^{-3}\,\text{mol/L}$ (dve značilni mesti) da pH $2{,}70$ (dve decimalki).

## Preveri se

? Katera trditev je pravilna (pri $25\,^\circ\mathrm{C}$)?
- Raztopina s pH $8$ je rahlo kisla.
~ Meja je pri $7$: vse nad $7$ je bazično. Morda si pomislil, da manjše število pomeni manj kisline.
+ Nižji pH pomeni večjo koncentracijo oksonijevih ionov.
- pH baze izračunamo kot $-\log[\mathrm{OH^-}]$.
~ To je pOH. pH dobiš šele z $\mathrm{pH} = 14 - \mathrm{pOH}$.
- Raztopina s pH $3$ ima trikrat več $\mathrm{H_3O^+}$ kot raztopina s pH $1$.
~ Lestvica ni linearna, pa tudi smer je obrnjena: pH $3$ ima $100$-krat **manj** ionov kot pH $1$.
> Zaradi minusa v $\mathrm{pH} = -\log[\mathrm{H_3O^+}]$ večja koncentracija da manjši pH.

? Kolikšen je pH raztopine $\mathrm{HCl}$ s koncentracijo $0{,}040\,\text{mol/L}$?
- $-1{,}40$
~ To je $\log 0{,}040$ brez minusa iz definicije pH.
+ $1{,}40$
- $12{,}60$
~ Kislino si obravnaval kot bazo in rezultat odštel od $14$.
> $[\mathrm{H_3O^+}] = 0{,}040\,\text{mol/L}$, $\mathrm{pH} = -\log 0{,}040 \approx 1{,}40$. Kontrola: $0{,}040$ je med $10^{-2}$ in $10^{-1}$, zato je pH med $1$ in $2$.

? Tina je izračunala pH raztopine $\mathrm{Ba(OH)_2}$ s $c = 0{,}010\,\text{mol/L}$ takole: $[\mathrm{OH^-}] = 0{,}010\,\text{mol/L}$, $\mathrm{pOH} = 2$, $\mathrm{pH} = 12$. Kje je napaka?
- V koraku $\mathrm{pH} = 14 - \mathrm{pOH}$; pravilno bi bilo $\mathrm{pH} = \mathrm{pOH}$.
~ Za bazo pOH in pH nista enaka, vsota je $14$. Ta korak je Tina naredila prav.
- Napake ni, pH je $12$.
~ Ta račun velja za $\mathrm{NaOH}$, ki ima eno skupino $\mathrm{OH}$. $\mathrm{Ba(OH)_2}$ jih ima dve.
+ $[\mathrm{OH^-}]$ je $0{,}020\,\text{mol/L}$, zato je pH približno $12{,}30$.
> $\mathrm{Ba(OH)_2 \rightarrow Ba^{2+} + 2\,OH^-}$, torej $[\mathrm{OH^-}] = 0{,}020\,\text{mol/L}$, $\mathrm{pOH} \approx 1{,}70$ in $\mathrm{pH} \approx 12{,}30$.

? Primerjaj raztopini s pH $2$ in pH $4$. Kaj velja za koncentraciji oksonijevih ionov?
- Raztopina s pH $4$ ima dvakrat več $\mathrm{H_3O^+}$.
~ Večji pH pomeni manj ionov, in razmerje ni $4 : 2$, ker lestvica ni linearna.
- Raztopina s pH $2$ ima dvakrat več $\mathrm{H_3O^+}$.
~ Smer je prava, faktor pa ne: vsaka enota pH pomeni faktor $10$, ne prištevanja.
+ Raztopina s pH $2$ ima $100$-krat več $\mathrm{H_3O^+}$.
> $10^{-2}\,\text{mol/L}$ proti $10^{-4}\,\text{mol/L}$: razlika dveh enot pomeni $10 \cdot 10 = 100$.

? Želodčni sok vsebuje klorovodikovo kislino in ima pH okoli $2{,}0$. Kolikšna je približno koncentracija $\mathrm{HCl}$, če upoštevamo samo to kislino?
- $2{,}0\,\text{mol/L}$
~ pH ni koncentracija, ampak negativni eksponent: $[\mathrm{H_3O^+}] = 10^{-2}$.
- $100\,\text{mol/L}$
~ Pozabil si minus v eksponentu: $10^{+2}$ namesto $10^{-2}$.
+ $0{,}010\,\text{mol/L}$
- $10^{-12}\,\text{mol/L}$
~ To bi bila $[\mathrm{OH^-}]$. Pri kislini $\mathrm{pH} = 2$ pomeni neposredno $[\mathrm{H_3O^+}] = 10^{-2}\,\text{mol/L}$.
> Obratni račun: $[\mathrm{H_3O^+}] = 10^{-\mathrm{pH}} = 10^{-2}\,\text{mol/L}$. Ker je $\mathrm{HCl}$ močna kislina, je $c(\mathrm{HCl}) \approx 0{,}010\,\text{mol/L}$.

:::simboli
\mathrm{pH} | pH vrednost | \mathrm{pH} = -\log\,[\mathrm{H_3O^+}] | – | pri 25 °C velja pH + pOH = 14
\mathrm{pOH} | pOH vrednost | \mathrm{pOH} = -\log[\mathrm{OH^-}] | –
K_w | ionski produkt vode | K_w = [\mathrm{H_3O^+}] \cdot [\mathrm{OH^-}] | – | pri 25 °C 10⁻¹⁴; odvisen od temperature
c | množinska koncentracija kisline ali baze | | mol/L | oglati oklepaji [ ] pomenijo koncentracijo iona
n | množina snovi | n = c \cdot V | mol
V | prostornina raztopine | | L
m | masa raztopljene snovi | m = n \cdot M | g
M | molska masa | | g/mol
c_1 | koncentracija pred redčenjem | | mol/L
c_2 | koncentracija po redčenju | c_2 = \dfrac{c_1 \cdot V_1}{V_2} | mol/L
V_1 | prostornina raztopine pred redčenjem | | L | V₁ in V₂ v isti enoti
V_2 | prostornina raztopine po redčenju | | L
:::
