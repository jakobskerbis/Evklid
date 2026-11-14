---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Glasbenik ves čas računa z ulomki, čeprav o tem ne razmišlja. Takt štiri četrtine ravno zapolnijo polovinka in dve četrtinki: $\dfrac{1}{2} + \dfrac{1}{4} + \dfrac{1}{4} = 1$.

Druga situacija je videti povsem drugačna. Skupina v studiu še ni izbrala tempa. Tempo $t$ pove, koliko udarcev zaigrajo v eni minuti, zato en udarec traja $\dfrac{60}{t}\,\text{s}$, pol udarca pa $\dfrac{30}{t}\,\text{s}$. Bobnar zaigra udarec in še pol udarca. Kako dolgo to traja? Skupaj $\dfrac{60}{t} + \dfrac{30}{t} = \dfrac{90}{t}$ sekund, pri tempu $120$ torej $0{,}75\,\text{s}$.

V prvi situaciji so samo števila, v drugi je v imenovalcu črka. Ideja pa je ista: ulomka z enakim imenovalcem seštejemo tako, da seštejemo števca. Izrazom s spremenljivko v imenovalcu, kot je $\dfrac{90}{t}$, pravimo **ulomljeni izrazi**. Zanje veljajo pravila, ki jih poznaš za ulomke. Novo je le opozorilo: pri $t = 0$ izraz $\dfrac{60}{t}$ nima vrednosti, ker z $0$ ne delimo.

Ključno orodje je razstavljanje na faktorje iz prejšnje teme. Ulomka ne moreš okrajšati, dokler števca in imenovalca ne razstaviš. Zato boš ves čas izpostavljal, uporabljal razliko kvadratov in Vietovo pravilo. Ulomljeni izrazi te čakajo tudi pri linearnih enačbah in funkcijah.

## Razlaga

**1. Najprej en primer do konca.** Bobnar zaigra en udarec v tempu $t$, nato še en udarec v dvakrat hitrejšem tempu $2t$. Koliko časa trajata skupaj?

$$\frac{60}{t} + \frac{60}{2t} = \frac{120}{2t} + \frac{60}{2t} = \frac{180}{2t} = \frac{90}{t}$$

Najprej velja pogoj $t \neq 0$, sicer imenovalca nimata pomena. Prvi ulomek smo razširili z $2$, da sta imenovalca enaka. Nato smo sešteli števca. Na koncu smo okrajšali faktor $2$. Preizkus pri $t = 60$: udarca trajata $1\,\text{s}$ in $0{,}5\,\text{s}$, skupaj $1{,}5\,\text{s}$, in res je $\dfrac{90}{60} = 1{,}5$.

V tem enem računu so že vsi koraki: pogoji, razširjanje, seštevanje in krajšanje. Spodaj jih posplošimo enega za drugim.

**2. Kaj je ulomljeni izraz.** Ulomljeni izraz je količnik $\dfrac{A}{B}$ dveh algebrskih izrazov, pri čemer imenovalec $B$ vsebuje spremenljivko. Ulomek ni definiran, kadar je imenovalec enak $0$. Zato vsak ulomljeni izraz zahteva **pogoje**: vrednosti spremenljivke, pri katerih je imenovalec $0$, izločimo. Imenovalec razstavimo in poiščemo vrednosti, pri katerih je kateri od faktorjev enak $0$.

| Izraz | Imenovalec | Pogoji |
|---|---|---|
| $\dfrac{3}{x-5}$ | $x-5$ | $x \neq 5$ |
| $\dfrac{x}{x^2-4}$ | $(x-2)(x+2)$ | $x \neq 2$, $x \neq -2$ |
| $\dfrac{1}{x^2+x}$ | $x(x+1)$ | $x \neq 0$, $x \neq -1$ |
| $\dfrac{2}{x^2+1}$ | $x^2 + 1$ | ni pogojev |

Pri zadnjem izrazu je $x^2 + 1 \ge 1$, zato imenovalec ni nikoli $0$.

V simulaciji spodaj (»Ulomljeni izraz in definicijsko območje«) je izraz $\dfrac{x^2 - a^2}{x - a}$. Nastavi $a = 2$ in postavi preizkusni $x$ točno na $2$. Opazi, da izraz tam ni definiran: graf je povsod drugje premica $y = x + 2$, v točki $(2, 4)$ pa ima luknjo.

**3. Krajšanje.** Števec in imenovalec smemo deliti z istim izrazom $C \neq 0$:

$$\frac{A \cdot C}{B \cdot C} = \frac{A}{B}.$$

Krajšamo lahko samo **faktorje** (dele produkta), nikoli **členov** (delov vsote). Zato je prvi korak vedno razstavljanje. Postopek:

1. Razstavi števec in imenovalec.
2. Iz imenovalca prvotnega izraza zapiši pogoje.
3. Okrajšaj enake faktorje.
4. Zapiši rezultat in pogoje.

Primer: $\dfrac{x^2-9}{x^2+3x} = \dfrac{(x-3)(x+3)}{x(x+3)} = \dfrac{x-3}{x}$, pogoja sta $x \neq 0$ in $x \neq -3$. Pri potencah uporabiš znana pravila: $\dfrac{a^5}{a^2} = a^3$ za $a \neq 0$. Faktorja $a - b$ in $b - a$ sta nasprotna, saj je $b - a = -(a - b)$. Zato je $\dfrac{a-b}{b-a} = -1$ za $a \neq b$.

:::premisli
Okrajšani izraz $\dfrac{x-3}{x}$ ima pri $x = -3$ vrednost $2$. Kaj pa prvotni $\dfrac{x^2-9}{x^2+3x}$? Zakaj pogoj $x \neq -3$ ostane?
---
Prvotni izraz pri $x = -3$ da $\dfrac{0}{0}$, kar ni definirano. Izraza sta enaka le tam, kjer sta oba definirana. Zato pogoje vedno pišemo iz prvotnega imenovalca, preden krajšamo.
:::

**4. Množenje in deljenje.** Ulomke množimo števec s števcem in imenovalec z imenovalcem:

$$\frac{A}{B} \cdot \frac{C}{D} = \frac{A \cdot C}{B \cdot D}.$$

Deljenje je množenje z obratnim ulomkom: $\dfrac{A}{B} : \dfrac{C}{D} = \dfrac{A}{B} \cdot \dfrac{D}{C}$, pri čemer mora biti tudi $C \neq 0$. Najprej razstavi vse števce in imenovalce, nato okrajšaj navzkriž (faktor v števcu enega ulomka s faktorjem v imenovalcu drugega), šele nazadnje množi. Primer:

$$\frac{2x}{x-1} \cdot \frac{x^2-1}{4x^2} = \frac{2x}{x-1} \cdot \frac{(x-1)(x+1)}{4x^2} = \frac{x+1}{2x}.$$

Okrajšali smo $x-1$ in $2x$, saj je $4x^2 = 2x \cdot 2x$. Pogoja sta $x \neq 1$ in $x \neq 0$.

**5. Seštevanje in odštevanje.** Ulomka z enakim imenovalcem seštejemo (odštejemo) števca:

$$\frac{A}{C} \pm \frac{B}{C} = \frac{A \pm B}{C}.$$

Kadar sta imenovalca različna, ju najprej pretvorimo na **skupni imenovalec**. Ta je najmanjši skupni večkratnik imenovalcev. Imenovalce razstavimo in vzamemo vsak faktor, ki se pojavi, z največjim eksponentom, s katerim nastopa. Postopek:

1. Razstavi imenovalce in zapiši pogoje.
2. Določi skupni imenovalec.
3. Vsak ulomek razširi z manjkajočimi faktorji (števec in imenovalec pomnožiš z istim izrazom).
4. Seštej ali odštej števce. Pri odštevanju drugi števec vedno zapiši v oklepaju.
5. Poenostavi števec in preveri, ali je mogoče krajšanje.

Primer: $\dfrac{1}{x} + \dfrac{1}{x+2} = \dfrac{(x+2) + x}{x(x+2)} = \dfrac{2x+2}{x(x+2)} = \dfrac{2(x+1)}{x(x+2)}$, pogoja sta $x \neq 0$ in $x \neq -2$.

:::premisli
Pri $\dfrac{1}{x} + \dfrac{1}{x^2}$ vzemi za skupni imenovalec kar zmnožek $x \cdot x^2 = x^3$. Ali je rezultat napačen? Zakaj je vseeno boljši $x^2$?
---
Ker je $x^2$ že deljiv z $x$, je to najmanjši skupni večkratnik. Z njim takoj dobiš $\dfrac{x+1}{x^2}$. Z $x^3$ dobiš $\dfrac{x^2+x}{x^3}$, ki ga moraš še okrajšati z $x$, da prideš do istega rezultata.
:::

## Rešeni primeri

### Primer 1 (lažji)

Okrajšaj ulomljeni izraz $\dfrac{3x+6}{x^2-4}$ in zapiši, za katere vrednosti $x$ je definiran.

**Podatki:** izraz $\dfrac{3x+6}{x^2-4}$
**Iščemo:** okrajšani izraz in vrednosti $x$, pri katerih je izraz definiran

:::formula
$\dfrac{A \cdot C}{B \cdot C} = \dfrac{A}{B}$ za $C \neq 0$; $\quad ab + ac = a(b+c)$; $\quad a^2 - b^2 = (a-b)(a+b)$
:::

**Rešitev:**

1. Števec: $3x + 6 = 3(x+2)$.
2. Imenovalec (razlika kvadratov): $x^2 - 4 = (x-2)(x+2)$.
3. Imenovalec ne sme biti $0$, zato je $x \neq 2$ in $x \neq -2$.
4. Okrajšamo faktor $x+2$: $\dfrac{3(x+2)}{(x-2)(x+2)} = \dfrac{3}{x-2}$.
5. Preizkus pri $x = 3$: $\dfrac{9+6}{9-4} = \dfrac{15}{5} = 3$ in $\dfrac{3}{3-2} = 3$.
6. Odgovor: $\dfrac{3x+6}{x^2-4} = \dfrac{3}{x-2}$ za $x \neq 2$ in $x \neq -2$. Pogoj $x \neq -2$ ostane, čeprav ga okrajšani ulomek ne zahteva.

### Primer 2 (srednji)

Poenostavi izraz $\dfrac{x}{x^2-9} - \dfrac{2}{x+3}$.

**Podatki:** izraz $\dfrac{x}{x^2-9} - \dfrac{2}{x+3}$ (razlika dveh ulomkov z različnima imenovalcema)
**Iščemo:** en sam poenostavljen ulomek in pogoje zanj

:::formula
$\dfrac{A}{C} - \dfrac{B}{C} = \dfrac{A - B}{C}$; skupni imenovalec je najmanjši skupni večkratnik imenovalcev.
:::

**Rešitev:**

1. Razstavimo: $x^2 - 9 = (x-3)(x+3)$. Pogoja: $x \neq 3$ in $x \neq -3$.
2. Skupni imenovalec je $(x-3)(x+3)$. Prvi ulomek ostane, drugega razširimo z $x-3$: $\dfrac{2}{x+3} = \dfrac{2(x-3)}{(x-3)(x+3)}$.
3. Odštejemo, drugi števec je v oklepaju: $\dfrac{x - 2(x-3)}{(x-3)(x+3)}$.
4. Števec: $x - 2(x-3) = x - 2x + 6 = 6 - x$.
5. Rezultata $\dfrac{6-x}{(x-3)(x+3)}$ ni mogoče krajšati, ker števec $6 - x$ ni enak nobenemu od faktorjev imenovalca (niti njegovemu nasprotnemu).
6. Preizkus pri $x = 1$: $\dfrac{1}{1-9} - \dfrac{2}{4} = -\dfrac{1}{8} - \dfrac{4}{8} = -\dfrac{5}{8}$ in $\dfrac{6-1}{(1-3)(1+3)} = \dfrac{5}{-8} = -\dfrac{5}{8}$.
7. Odgovor: izraz je enak $\dfrac{6-x}{(x-3)(x+3)}$ za $x \neq 3$ in $x \neq -3$.

### Primer 3 (težji)

Poenostavi izraz $\left(\dfrac{x}{x-2} - \dfrac{4}{x^2-2x}\right) \cdot \dfrac{x^2-4x+4}{x^2+4x+4}$.

**Podatki:** izraz $\left(\dfrac{x}{x-2} - \dfrac{4}{x^2-2x}\right) \cdot \dfrac{x^2-4x+4}{x^2+4x+4}$ (razlika v oklepaju, pomnožena z ulomkom)
**Iščemo:** poenostavljen ulomek in pogoje zanj

:::formula
$\dfrac{A}{B} \cdot \dfrac{C}{D} = \dfrac{A \cdot C}{B \cdot D}$; $\quad a^2 - b^2 = (a-b)(a+b)$; $\quad a^2 \pm 2ab + b^2 = (a \pm b)^2$
:::

**Rešitev:**

1. Razstavimo imenovalce in števce: $x^2 - 2x = x(x-2)$, $x^2 - 4x + 4 = (x-2)^2$, $x^2 + 4x + 4 = (x+2)^2$.
2. Pogoji: $x \neq 0$, $x \neq 2$ (iz $x(x-2)$) in $x \neq -2$ (iz $(x+2)^2$).
3. Oklepaj: skupni imenovalec je $x(x-2)$. Prvi ulomek razširimo z $x$: $\dfrac{x}{x-2} = \dfrac{x^2}{x(x-2)}$. Torej $\dfrac{x^2 - 4}{x(x-2)}$.
4. Števec je razlika kvadratov: $x^2 - 4 = (x-2)(x+2)$. Okrajšamo faktor $x-2$: $\dfrac{(x-2)(x+2)}{x(x-2)} = \dfrac{x+2}{x}$.
5. Množimo: $\dfrac{x+2}{x} \cdot \dfrac{(x-2)^2}{(x+2)^2}$. Okrajšamo $x+2$ in dobimo $\dfrac{(x-2)^2}{x(x+2)}$.
6. Preizkus pri $x = 3$: oklepaj je $3 - \dfrac{4}{3} = \dfrac{5}{3}$, drugi ulomek je $\dfrac{1}{25}$, produkt $\dfrac{5}{75} = \dfrac{1}{15}$. Rezultat: $\dfrac{(3-2)^2}{3 \cdot 5} = \dfrac{1}{15}$.
7. Odgovor: izraz je enak $\dfrac{(x-2)^2}{x(x+2)}$ za $x \neq 0$, $x \neq 2$ in $x \neq -2$.

### Primer 4: zdaj ti

Pesem se začne z uvodom, v katerem bobnar zaigra $40$ udarcev v tempu $t$. Sledi refren s $40$ udarci v tempu $t + 20$. Zapiši skupni čas obeh delov kot en ulomek in ga izračunaj za $t = 100$.

**Podatki:** uvod $40$ udarcev v tempu $t$, refren $40$ udarcev v tempu $t + 20$ (tempo v udarcih na minuto), en udarec v tempu $t$ traja $\dfrac{60}{t}\,\text{s}$, $t = 100$
**Iščemo:** skupni čas kot en ulomek in njegovo vrednost pri $t = 100$

:::formula
$\dfrac{A}{B} + \dfrac{C}{D} = \dfrac{A \cdot D + C \cdot B}{B \cdot D}$
:::

**Rešitev:**

1. Uvod traja $40 \cdot \dfrac{60}{t} = \dfrac{2400}{t}$ sekund. En udarec v tempu $t + 20$ traja $\dfrac{60}{t+20}\,\text{s}$, zato refren traja $\dfrac{2400}{t+20}$ sekund.
2. Pogoja sta $t \neq 0$ in $t \neq -20$. Tempo je pozitiven, zato sta v glasbi izpolnjena sama od sebe.
3. Skupni imenovalec je $t(t+20)$: $\dfrac{2400}{t} + \dfrac{2400}{t+20} = \dfrac{2400(t+20) + 2400t}{t(t+20)}$.
4. Uredi števec, izpostavi skupni faktor in vstavi $t = 100$. Nato preveri:

:::premisli
Kakšen je ulomek in koliko sekund trajata oba dela pri $t = 100$?
---
Števec je $2400t + 48000 + 2400t = 4800t + 48000 = 4800(t+10)$, torej je skupni čas $\dfrac{4800(t+10)}{t(t+20)}$ sekund. Pri $t = 100$ je to $\dfrac{4800 \cdot 110}{100 \cdot 120} = \dfrac{528000}{12000} = 44$ sekund. Preizkus: uvod traja $\dfrac{2400}{100} = 24\,\text{s}$, refren $\dfrac{2400}{120} = 20\,\text{s}$, skupaj $44\,\text{s}$.
:::

## Pogoste napake

- **Krajšanje členov namesto faktorjev.** Zapišeš $\dfrac{x+3}{3} = x$ ali $\dfrac{x^2+5}{x^2+3} = \dfrac{5}{3}$. Razlog: krajšamo lahko le tisto, s čimer je množen ves števec in ves imenovalec. Pravilno: razstavi in krajšaj faktorje, na primer $\dfrac{x^2+2x}{x} = \dfrac{x(x+2)}{x} = x+2$ za $x \neq 0$. Izraz $\dfrac{x+3}{3}$ pri $x = 3$ da $2$, ne $3$.
- **Seštevanje števcev in imenovalcev.** Zapišeš $\dfrac{1}{x} + \dfrac{1}{y} = \dfrac{2}{x+y}$. Razlog: ulomka lahko seštejemo le, če imata enaka imenovalca. Pravilno: $\dfrac{1}{x} + \dfrac{1}{y} = \dfrac{y}{xy} + \dfrac{x}{xy} = \dfrac{x+y}{xy}$. Pri $x = y = 2$ je vsota $1$, napačni izraz pa da $\dfrac{1}{2}$.
- **Pozabljen oklepaj pri odštevanju.** Zapišeš $\dfrac{5x}{x+1} - \dfrac{2x-3}{x+1} = \dfrac{5x - 2x - 3}{x+1}$. Razlog: minus velja za ves drugi števec. Pravilno: $\dfrac{5x - (2x-3)}{x+1} = \dfrac{3x+3}{x+1} = \dfrac{3(x+1)}{x+1} = 3$ za $x \neq -1$.
- **Pozabljeni pogoji.** Zapišeš $\dfrac{x^2-x}{x} = x - 1$ in ne omeniš pogojev. Razlog: pri $x = 0$ prvotni izraz ni definiran, desna stran pa je. Pravilno: $\dfrac{x(x-1)}{x} = x - 1$ za $x \neq 0$.
- **Napačen predznak pri nasprotnih faktorjih.** Zapišeš $\dfrac{x-3}{3-x} = 1$. Razlog: $3 - x = -(x-3)$. Pravilno: $\dfrac{x-3}{3-x} = \dfrac{x-3}{-(x-3)} = -1$ za $x \neq 3$.

## Povzetek

- Ulomljeni izraz $\dfrac{A}{B}$ je definiran samo, kadar je $B \neq 0$. Pogoje vedno zapiši iz prvotnega imenovalca.
- Krajšanje: $\dfrac{A \cdot C}{B \cdot C} = \dfrac{A}{B}$. Krajšamo faktorje, ne členov, zato najprej razstavimo.
- Množenje: $\dfrac{A}{B} \cdot \dfrac{C}{D} = \dfrac{A \cdot C}{B \cdot D}$. Pred množenjem okrajšaj navzkriž.
- Deljenje: $\dfrac{A}{B} : \dfrac{C}{D} = \dfrac{A}{B} \cdot \dfrac{D}{C}$, pri čemer je $C \neq 0$.
- Seštevanje in odštevanje: $\dfrac{A}{C} \pm \dfrac{B}{C} = \dfrac{A \pm B}{C}$. Pri različnih imenovalcih poišči skupni imenovalec, ulomke razširi in seštej števce.
- Pri odštevanju drugi števec zapiši v oklepaju. Na koncu poskusi rezultat še krajšati.
- Faktorja $a-b$ in $b-a$ sta nasprotna: $b - a = -(a-b)$.

## Drugače: Z analogijo

**Skupni imenovalec kot mreža v programu za snemanje.** V programu za snemanje glasbe udarec razdeliš na enake kvadratke, to je mreža. Triolska osminka traja $\dfrac{1}{3}$ udarca, šestnajstinka $\dfrac{1}{4}$ udarca. Na mrežo tretjin šestnajstinke ne moreš postaviti, na mrežo četrtin pa ne triolske osminke. Mreža dvanajstin ustreza obema: triolska osminka zasede $4$ kvadratke, šestnajstinka $3$. Skupaj je to $7$ kvadratkov od $12$, torej $\dfrac{1}{3} + \dfrac{1}{4} = \dfrac{7}{12}$ udarca.

Skupni imenovalec je najbolj groba mreža, na katero padeta oba ulomka. Za $\dfrac{1}{x} + \dfrac{1}{y}$ je to mreža $xy$ kvadratkov: prvi ulomek zasede $y$ kvadratkov, drugi $x$, skupaj $\dfrac{x+y}{xy}$.

**Krajšanje kot zidaki.** Ulomek si predstavljaj kot dve vrsti zidakov: zgoraj faktorji števca, spodaj faktorji imenovalca. Za $\dfrac{x^2-9}{x^2+3x}$ dobiš:

| | 1. faktor | 2. faktor |
|---|---|---|
| števec | $x-3$ | $x+3$ |
| imenovalec | $x$ | $x+3$ |

Zidaka $x+3$ stojita eden nad drugim, zato ju odstraniš. Ostaneta $x-3$ zgoraj in $x$ spodaj. Ta dva zidaka nista enaka, zato ju ne smeš krajšati. Dokler izraz ni razstavljen, zidakov sploh ni: $x^2$ v vsoti $x^2 - 9$ je le del zidaka, zato ga ne moreš odstraniti.

## Drugače: Bolj natančno

**Kdaj sta dva izraza enaka.** Izraza $\dfrac{x^2}{x}$ in $x$ nista povsem enaka: prvi ni definiran pri $x = 0$, drugi je. Pravimo, da sta enaka na skupnem definicijskem območju, to je za vse $x \neq 0$. Zato pogoje zapišemo, ko izraz še ni okrajšan. Okrajšanje samo po sebi pogojev ne odstrani. Primer: $\dfrac{x^2-x-6}{x^2-9} = \dfrac{(x+2)(x-3)}{(x-3)(x+3)} = \dfrac{x+2}{x+3}$ za $x \neq 3$ in $x \neq -3$.

| $x$ | prvotni ulomek | okrajšani ulomek |
|---|---|---|
| $0$ | $\dfrac{-6}{-9} = \dfrac{2}{3}$ | $\dfrac{2}{3}$ |
| $2$ | $\dfrac{-4}{-5} = \dfrac{4}{5}$ | $\dfrac{4}{5}$ |
| $3$ | $\dfrac{0}{0}$, ni definiran | $\dfrac{5}{6}$ |

Vrednosti se ujemajo povsod, razen pri $x = 3$, kjer prvotni izraz ni definiran.

**Zakaj krajšanje deluje.** Ker je $\dfrac{C}{C} = 1$ za $C \neq 0$, velja $\dfrac{A \cdot C}{B \cdot C} = \dfrac{A}{B} \cdot \dfrac{C}{C} = \dfrac{A}{B} \cdot 1 = \dfrac{A}{B}$. Razširjanje je enak korak v nasprotni smeri: ulomek pomnožimo z $\dfrac{C}{C}$, kar vrednosti ne spremeni.

**Seštevanje.** Če prvi ulomek razširimo z $D$, drugega pa z $B$, dobimo $\dfrac{A}{B} + \dfrac{C}{D} = \dfrac{AD}{BD} + \dfrac{CB}{BD} = \dfrac{AD + BC}{BD}$. Ta obrazec vedno deluje, vendar je produkt imenovalcev lahko nepotrebno velik. Najmanjši skupni večkratnik je krajši, računi so lažji, rezultat pa je manjkrat treba še krajšati.

**Deljenje.** Ker je $\dfrac{C}{D} \cdot \dfrac{D}{C} = 1$ (če sta $C \neq 0$ in $D \neq 0$), je $\dfrac{D}{C}$ obratna vrednost ulomka $\dfrac{C}{D}$. Deljenje z ulomkom je zato množenje z njegovo obratno vrednostjo. Deliti ne smemo z ničlo, zato mora biti $\dfrac{C}{D} \neq 0$, torej $C \neq 0$.

## Preveri se

? Metronom v tempu $t$ udarcev na minuto odbije udarec vsakih $\dfrac{60}{t}$ sekund. Zakaj za ta ulomljeni izraz zapišemo pogoj $t \neq 0$?
- Ker bi bil pri $t = 0$ rezultat $0$ sekund.
~ Rezultat $0$ bi dal izraz $\dfrac{0}{t}$. Tu je $0$ v imenovalcu, $\dfrac{60}{0}$ pa nima vrednosti.
+ Ker je pri $t = 0$ imenovalec enak $0$, z $0$ pa ne delimo.
- Ker tempo ne sme biti manjši od $60$.
~ Izraz je definiran za vsak $t \neq 0$. Pri $t < 60$ udarec le traja dlje kot $1\,\text{s}$.
> Ulomljeni izraz je definiran le, kadar imenovalec ni $0$. Pri $\dfrac{60}{t}$ izločimo samo $t = 0$.

? Kateri vrstni red korakov pravilno okrajša $\dfrac{x^2-9}{x^2+3x}$?
- Okrajšaj $x^2$ v števcu in imenovalcu, nato zapiši pogoje.
~ $x^2$ je člen vsote, ne faktor. Krajšamo samo faktorje, zato najprej razstavimo.
- Razstavi, okrajšaj $x+3$, nato zapiši pogoje iz okrajšanega imenovalca $x$.
~ Tako izgubiš pogoj $x \neq -3$. Pogoje beri iz prvotnega imenovalca, preden krajšaš.
+ Razstavi, zapiši pogoje iz prvotnega imenovalca, nato okrajšaj $x+3$.
> $\dfrac{(x-3)(x+3)}{x(x+3)} = \dfrac{x-3}{x}$ za $x \neq 0$ in $x \neq -3$. Pogoje zapišemo pred krajšanjem, sicer bi pogoj $x \neq -3$ izgubili.

? Kaj se zgodi, če izraz $\dfrac{x-5}{5-x}$ okrajšaš, kot da sta $x - 5$ in $5 - x$ enaka faktorja?
- Nič, ker sta $x - 5$ in $5 - x$ enaka.
~ Sta nasprotna: pri $x = 7$ je $x - 5 = 2$, a $5 - x = -2$.
+ Dobiš $1$, pravilno pa je $-1$ za $x \neq 5$.
- Dobiš $0$, ker se faktorja odštejeta.
~ Pri krajšanju delimo, ne odštevamo: $\dfrac{C}{C} = 1$, ne $0$.
> Ker je $5 - x = -(x-5)$, je $\dfrac{x-5}{5-x} = \dfrac{x-5}{-(x-5)} = -1$ za $x \neq 5$.

? Poenostavi $\dfrac{3}{x-1} - \dfrac{2}{x+1}$.
- $\dfrac{x+1}{x^2-1}$
~ Pozabljen oklepaj: $-2(x-1)$ je $-2x + 2$, ne $-2x - 2$.
+ $\dfrac{x+5}{x^2-1}$
- $\dfrac{x+5}{2x}$
~ Imenovalcev ne seštevamo. Skupni imenovalec je zmnožek $(x-1)(x+1) = x^2 - 1$, ne vsota $2x$.
> Skupni imenovalec je $(x-1)(x+1) = x^2 - 1$. Števec je $3(x+1) - 2(x-1) = 3x + 3 - 2x + 2 = x + 5$.

? Poenostavi $\dfrac{x+1}{x-2} \cdot \dfrac{x^2-4}{x^2+x}$.
- $\dfrac{x-2}{x}$
~ Okrajšal si napačni faktor razlike kvadratov. Z imenovalcem $x-2$ se okrajša $x-2$, ostane $x+2$.
+ $\dfrac{x+2}{x}$
- $\dfrac{x+2}{x+1}$
~ V števcu ni faktorja $x$, zato ga ne moreš okrajšati. Okrajša se $x+1$, saj je $x^2 + x = x(x+1)$.
- $\dfrac{(x+1)(x+2)}{x}$
~ Imenovalec $x^2 + x = x(x+1)$ vsebuje faktor $x+1$, ki se okrajša s števcem.
> Razstavimo: $\dfrac{x+1}{x-2} \cdot \dfrac{(x-2)(x+2)}{x(x+1)}$. Okrajšamo $x+1$ in $x-2$, ostane $\dfrac{x+2}{x}$. Pogoji so $x \neq 2$, $x \neq 0$ in $x \neq -1$.

:::simboli
A, B, C, D | algebrski izrazi v števcih in imenovalcih | | | imenovalci morajo biti različni od 0
x, y | spremenljivki | | |
t | tempo (število udarcev v minuti) | | 1/min | $t \neq 0$
a, b, c | števila ali izrazi v obrazcih | | |
:::
