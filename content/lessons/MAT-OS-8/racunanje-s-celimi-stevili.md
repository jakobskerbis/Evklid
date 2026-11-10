---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi telefon in zapiši, koliko odstotkov baterije ima zdaj. Petnajst minut glej video, nato zapiši novo stanje. Še četrt ure ga polni in na koncu četrt ure uporabljaj navigacijo. Vsakič izračunaj **spremembo**: končno stanje minus začetno.

Takole je izšlo Nini:

| dejavnost | začetek | konec | sprememba |
|---|---|---|---|
| video | $83\,\%$ | $77\,\%$ | $-6$ |
| polnjenje | $77\,\%$ | $89\,\%$ | $+12$ |
| navigacija | $89\,\%$ | $80\,\%$ | $-9$ |

Spremembe so cela števila: padec je negativen, porast pozitiven. Koliko se je baterija spremenila v vseh 45 minutah? Da odgovoriš, moraš znati sešteti $-6$, $12$ in $-9$. Pravila za tak račun boš odkril sam iz nekaj primerov, nato jih bomo zapisali.

## Razlaga

**Seštevanje: kaj opaziš?** Najprej sestavi dva padca, video in navigacijo. Baterija je padla za $6$ in še za $9$, skupaj za $15$. Torej $(-6) + (-9) = -15$.

Zdaj video in polnjenje. Padec za $6$ in porast za $12$: porast je večji, zato baterija na koncu pridobi $6$. Torej $(-6) + 12 = 6$. Pri polnjenju in navigaciji je porast $12$ in padec $9$, ostane $12 + (-9) = 3$.

Na številski premici je to vidno kot skoki. Seštevanje pozitivnega števila je skok v desno, seštevanje negativnega skok v levo:

:::risba premica
opis: Številska premica od −15 do 0. Lok je skok za 9 v levo, od −6 do −15.
od: -15
do: 0
oznake: ne
oznaka: -15 | −15
oznaka: -6 | −6
oznaka: 0 | 0
skok: -6 -> -15 | skok za 9 v levo
:::

Iz teh primerov sledi pravilo. Pri **enakih predznakih** absolutni vrednosti seštejemo in predznak obdržimo. Pri **različnih predznakih** manjšo absolutno vrednost odštejemo od večje, rezultat pa dobi predznak števila z večjo absolutno vrednostjo. Vseh 45 minut skupaj: $(-6) + 12 + (-9) = -3$. Res, iz $83\,\%$ smo prišli na $80\,\%$.

V simulaciji spodaj (Računanje s celimi števili) nastavi račun, v katerem prišteješ negativno število, na primer $3 + (-5)$. Opazuj, v katero smer skoči točka in kje pristane glede na $0$.

**Odštevanje: vzorec v stolpcu.** Spremembo smo računali kot »konec minus začetek«. Pri videu je to $77 - 83 = -6$. Kaj pa, ko odštevamo negativno število? Poglej stolpec, v katerem se odštevanec vsakič zmanjša za $1$:

$5 - 2 = 3$, $5 - 1 = 4$, $5 - 0 = 5$, $5 - (-1) = 6$, $5 - (-2) = 7$.

:::premisli
Kaj pride v naslednji vrstici, $5 - (-3)$? Napovej iz vzorca, nato pomisli, kateremu seštevanju je enako.
---
$8$. Rezultat se vsakič poveča za $1$. Enak rezultat da $5 + 3$, torej odšteti $-3$ pomeni prišteti $3$.
:::

Isto opazimo pri $5 - 3 = 2$ in $5 + (-3) = 2$. Odštevanje je vedno seštevanje **nasprotnega števila**:

$$a - b = a + (-b)$$

Zato $(-4) - 3 = (-4) + (-3) = -7$ in $(-6) - (-10) = (-6) + 10 = 4$.

**Množenje: še en vzorec.** Baterija med igranjem vsakih $10$ minut pade za $3$ odstotne točke. V $40$ minutah, to so štiri desetminutni deli, pade za $4 \cdot (-3) = -12$. Pozitivno število krat negativno da negativno.

Kaj pa negativno krat negativno? Spet si pomagaj s stolpcem, kjer se prvi faktor zmanjšuje za $1$:

| račun | rezultat |
|---|---|
| $3 \cdot (-2)$ | $-6$ |
| $2 \cdot (-2)$ | $-4$ |
| $1 \cdot (-2)$ | $-2$ |
| $0 \cdot (-2)$ | $0$ |
| $(-1) \cdot (-2)$ | ? |

Rezultat se v vsaki vrstici poveča za $2$.

:::premisli
Koliko je $(-1) \cdot (-2)$ in koliko $(-2) \cdot (-2)$, če vzorec nadaljuješ? Kaj to pomeni pri bateriji, ki vsakih $10$ minut pade za $3$, če vprašaš, koliko je imela pred $20$ minutami?
---
$(-1)\cdot(-2) = 2$ in $(-2)\cdot(-2) = 4$. Pri bateriji: pred $20$ minutami pomeni $-2$ desetminutna dela, zato $(-2)\cdot(-3) = 6$. Takrat je imela $6$ odstotnih točk več kot zdaj.
:::

Pravilo za **predznak zmnožka**: enaka predznaka dasta pozitiven zmnožek, različna predznaka negativnega. Absolutni vrednosti zmnožimo kot običajno. Kar koli pomnožimo z $0$, dobimo $0$.

**Deljenje.** Deljenje preverimo z množenjem. Ker je $4 \cdot (-3) = -12$, velja $(-12) : 4 = -3$. Ker je $(-3) \cdot 4 = -12$, velja $(-12) : (-3) = 4$. Za predznak količnika torej velja isto pravilo kot za zmnožek. Z $0$ ne delimo: števila, ki bi pomnoženo z $0$ dalo na primer $5$, ni.

**Vrstni red.** V daljšem računu najprej izračunamo oklepaje, nato množenje in deljenje, na koncu seštevanje in odštevanje, vse od leve proti desni. Negativno število ob računskem znaku pišemo v oklepaju: $5 + (-3)$, ne $5 + -3$.

## Rešeni primeri

### Primer 1 (lažji): seštevanje in odštevanje

Telefon je čez noč ostal v avtu in se ohladil na $-7\,^\circ\mathrm{C}$. V žepu se segreje za $12\,^\circ\mathrm{C}$. Izračunaj njegovo novo temperaturo, nato pa še računa $3 - 10$ in $(-6) - (-10)$.

**Podatki:** začetna temperatura $-7\,^\circ\mathrm{C}$, segrevanje za $12\,^\circ\mathrm{C}$; računa $3 - 10$ in $(-6) - (-10)$
**Iščemo:** novo temperaturo telefona in vrednosti obeh računov

:::formula
Seštevanje z različnima predznakoma: večja absolutna vrednost minus manjša, predznak števila z večjo absolutno vrednostjo.
Odštevanje: $a - b = a + (-b)$
:::

**Rešitev:**

1. $(-7) + 12$: predznaka sta različna, $12 - 7 = 5$. Večjo absolutno vrednost ima $12$, zato je rezultat pozitiven: $(-7) + 12 = 5$.
2. $3 - 10 = 3 + (-10)$, ker odštevanje zamenjamo s prištevanjem nasprotnega. Različna predznaka: $10 - 3 = 7$, predznak od $-10$, torej $3 - 10 = -7$.
3. $(-6) - (-10) = (-6) + 10 = 4$, ker je nasprotno število od $-10$ število $10$.
4. Odgovor: telefon ima $5\,^\circ\mathrm{C}$; računa data $-7$ in $4$.

### Primer 2: množenje in deljenje

Izračunaj štiri račune: $(-7)\cdot 6$, $(-5)\cdot(-9)$, $(-48) : 6$ in $(-72) : (-8)$.

**Podatki:** računi $(-7)\cdot 6$, $(-5)\cdot(-9)$, $(-48) : 6$, $(-72) : (-8)$
**Iščemo:** zmnožka in količnika

:::formula
Enaka predznaka dasta $+$, različna predznaka dasta $-$ (pri množenju in pri deljenju).
:::

**Rešitev:**

1. $(-7)\cdot 6$: predznaka sta različna, zato je zmnožek negativen; $7 \cdot 6 = 42$, torej $-42$.
2. $(-5)\cdot(-9)$: predznaka sta enaka, zato je zmnožek pozitiven; $5 \cdot 9 = 45$.
3. $(-48) : 6$: različna predznaka, količnik je negativen; $48 : 6 = 8$, torej $-8$.
4. $(-72) : (-8)$: enaka predznaka, količnik je pozitiven; $72 : 8 = 9$.
5. Preizkus deljenja z množenjem: $(-8)\cdot 6 = -48$ in $9 \cdot (-8) = -72$.
6. Odgovor: rezultati so $-42$, $45$, $-8$ in $9$.

### Primer 3 (težji): baterija med igro in polnjenjem

Telefon ima $41\,\%$ baterije. Med igranjem vsakih $10$ minut pade za $3$ odstotne točke, med polnjenjem pa vsakih $10$ minut naraste za $8$. Miha igra $50$ minut, nato telefon polni $30$ minut. Koliko baterije ima na koncu?

**Podatki:** začetek $41\,\%$; igra: sprememba $-3$ na $10\,\mathrm{min}$, trajanje $50\,\mathrm{min}$; polnjenje: sprememba $+8$ na $10\,\mathrm{min}$, trajanje $30\,\mathrm{min}$
**Iščemo:** končno stanje baterije

:::formula
skupna sprememba $=$ število delov $\cdot$ sprememba v enem delu
končno stanje $=$ začetno stanje $+$ vse spremembe
:::

**Rešitev:**

1. Igra traja $5$ desetminutnih delov, zato je sprememba $5 \cdot (-3) = -15$ (različna predznaka, negativno).
2. Polnjenje traja $3$ dele: $3 \cdot 8 = 24$.
3. Spremembe prištejemo začetku: $41 + (-15) + 24 = 50$.
4. Preverimo smiselnost: igra je odvzela manj, kot je polnjenje dodalo, zato mora biti konec nad $41\,\%$.
5. Odgovor: na koncu ima telefon $50\,\%$ baterije.

### Primer 4 – zdaj ti

Izračunaj $(-3)\cdot(-4) - 2\cdot(5 - 9) + (-20) : 4$.

**Podatki:** izraz $(-3)\cdot(-4) - 2\cdot(5 - 9) + (-20) : 4$
**Iščemo:** vrednost izraza

:::formula
Vrstni red: oklepaji, nato množenje in deljenje, nato seštevanje in odštevanje.
Odštevanje: $a - b = a + (-b)$
:::

**Rešitev:**

1. Oklepaj: $5 - 9 = -4$.
2. Množenje in deljenje: $(-3)\cdot(-4) = 12$, $2 \cdot (-4) = -8$, $(-20) : 4 = -5$.
3. Izraz je zdaj $12 - (-8) + (-5)$. Odštevanje zamenjaj s prištevanjem nasprotnega števila in izračunaj sam.

:::premisli
Napovej, ali bo $12 - (-8) + (-5)$ več ali manj kot $12$, nato izračunaj.
---
Več, ker odštevanje $-8$ doda $8$, $-5$ pa odvzame le $5$. $12 + 8 + (-5) = 20 + (-5) = 15$. Vrednost izraza je $15$.
:::

## Pogoste napake

- **»Minus in minus je plus« tudi pri seštevanju.** Kdo zapiše $(-3) + (-4) = 7$, ker si je zapomnil le kratek stavek. Pri seštevanju dveh negativnih števil gremo dvakrat v levo, zato $(-3) + (-4) = -7$. Pravilo o dveh minusih velja le za množenje in deljenje.
- **Odšteti negativno, kot da bi bilo pozitivno.** $5 - (-3) = 2$ je napačno, ker je odštevanec obravnavan kot $3$. Odštevanje negativnega števila je prištevanje nasprotnega: $5 - (-3) = 5 + 3 = 8$.
- **Predznak od pozitivnega števila.** Pri $(-9) + 5$ kdo napiše $4$ ali vzame predznak kar od $5$. Odločilna je večja absolutna vrednost, to je $9$, zato $(-9) + 5 = -4$.
- **Računanje od leve proti desni brez vrstnega reda.** $2 + 3 \cdot (-4)$ ni $5 \cdot (-4) = -20$. Množenje ima prednost: $2 + (-12) = -10$.
- **Napačen predznak količnika.** $(-12) : (-3) = -4$ je napačno, ker so minus prepisali iz deljenca. Preizkus z množenjem pokaže: $(-4)\cdot(-3) = 12$, ne $-12$. Pravilno je $4$.

## Povzetek

- Odštevanje je seštevanje nasprotnega števila: $a - b = a + (-b)$.
- Seštevanje: enaka predznaka, absolutni vrednosti seštejemo, predznak ostane. Različna predznaka, absolutni vrednosti odštejemo, predznak ima število z večjo absolutno vrednostjo.
- Množenje in deljenje: enaka predznaka dasta $+$, različna dasta $-$.
- Z $0$ ne delimo.
- Vrstni red: oklepaji, množenje in deljenje, seštevanje in odštevanje.

## Drugače: Korak za korakom s številkami

Vsak račun s celimi števili rešiš v štirih korakih:

1. Odštevanje zamenjaj s prištevanjem nasprotnega števila.
2. Poglej, ali sta predznaka enaka.
3. Računaj z absolutnimi vrednostmi.
4. Določi predznak po pravilu.

Tabela predznakov pri množenju in deljenju:

| prvo število | drugo število | rezultat |
|---|---|---|
| $+$ | $+$ | $+$ |
| $-$ | $-$ | $+$ |
| $+$ | $-$ | $-$ |
| $-$ | $+$ | $-$ |

Uporaba na izrazu $(-15) - (-6)\cdot 3 + (-12) : (-4)$:

1. Množenje: $(-6)\cdot 3 = -18$ (različna predznaka).
2. Deljenje: $(-12) : (-4) = 3$ (enaka predznaka).
3. Izraz: $(-15) - (-18) + 3$.
4. Odštevanje v seštevanje: $(-15) + 18 + 3$.
5. $(-15) + 18 = 3$, nato $3 + 3 = 6$.

Rezultat je $6$.

## Drugače: Kot zgodba

Ana pride v trgovski center z avtom in parkira v kleti, v nadstropju $-2$. Stopi v dvigalo in se pelje $7$ nadstropij gor: $(-2) + 7 = 5$. V petem nadstropju je trgovina s telefoni.

Ko kupi polnilnik, se spomni, da je pozabila vrečko v avtu. Pelje se $9$ nadstropij dol: $5 - 9 = -4$. Ups, to je prenizko! Avto je v $-2$. Za koliko je zgrešila? Razlika je $(-2) - (-4) = (-2) + 4 = 2$, torej mora $2$ nadstropji gor.

Dvigalo med vožnjo dol vsako sekundo prevozi $-1$ nadstropje. Po $3$ sekundah je sprememba $3 \cdot (-1) = -3$. Kje je bilo dvigalo $3$ sekunde *pred* tem trenutkom? Čas nazaj je $-3$, zato sprememba $(-3)\cdot(-1) = 3$: bilo je $3$ nadstropja višje. Tako se v zgodbi pokaže, zakaj negativno krat negativno da pozitivno: vrtimo film nazaj, dvigalo pa se je peljalo dol.

## Preveri se

? Katera tabela pravilno kaže predznak rezultata pri množenju?
- $(-)\cdot(-) = -$ in $(+)\cdot(-) = -$
~ Tako misli, kdor meni, da en sam minus »okuži« ves račun. Enaka predznaka dasta plus.
+ $(-)\cdot(-) = +$ in $(+)\cdot(-) = -$
- $(-)\cdot(-) = +$ in $(+)\cdot(-) = +$
~ Različna predznaka dasta minus: $3 \cdot (-2) = -6$, kar je pri bateriji padec.
> Enaka predznaka dasta pozitiven zmnožek, različna negativnega. Velja tudi za deljenje.

? Oceni brez natančnega računanja: koliko je približno $(-49)\cdot 21$?
- približno $1000$
~ Absolutna vrednost je prava, predznak pa ne: predznaka sta različna, zato je zmnožek negativen.
+ približno $-1000$
- približno $-70$
~ To je približno $(-49) + (-21)$; pri množenju se absolutni vrednosti zmnožita.
> $-49 \approx -50$ in $21 \approx 20$, $(-50)\cdot 20 = -1000$. Natančno je $-1029$.

? Zakaj je $5 - (-3) = 8$?
- Ker je minus krat minus plus.
~ Tu ni množenja. Pravilo o dveh minusih velja za množenje in deljenje, pri odštevanju pa zamenjamo odštevanje s prištevanjem nasprotnega.
- Ker odštejemo $3$ od $5$ in dobimo $8$.
~ $5 - 3 = 2$, ne $8$. Odštevanec je $-3$, ne $3$.
+ Ker odšteti število pomeni prišteti njegovo nasprotno število, $5 + 3 = 8$.
> Vzorec $5 - 1 = 4$, $5 - 0 = 5$, $5 - (-1) = 6$, … pokaže, da se rezultat veča, ko odštevamo vse manjša števila. Splošno: $a - b = a + (-b)$.

? S katerim številom moraš pomnožiti $-4$, da dobiš $28$?
- $7$
~ $(-4)\cdot 7 = -28$, različna predznaka dasta negativen zmnožek.
+ $-7$
- $32$
~ To je $28 - (-4)$; iskali smo faktor, ne razlike.
> Iščemo $28 : (-4) = -7$. Preizkus: $(-4)\cdot(-7) = 28$, enaka predznaka dasta pozitiven zmnožek.

? Baterija tablice v $4$ urah filma pade skupno za $36$ odstotnih točk, vsako uro enako. Kolikšna je sprememba na uro?
- $+9$
~ Baterija pada, zato je sprememba negativna.
- $-32$
~ To je $(-36) + 4$; skupni padec razdelimo na $4$ enake dele, torej delimo.
+ $-9$
- $-144$
~ To je $(-36)\cdot 4$, kar bi bil padec v $16$ urah, ne v eni.
> Skupna sprememba je $-36$, razdelimo jo na $4$ ure: $(-36) : 4 = -9$ odstotnih točk na uro.

:::simboli
a | celo število (zmanjševanec) | |  | 
b | celo število (odštevanec) | |  | $-b$ je nasprotno število števila $b$
:::
