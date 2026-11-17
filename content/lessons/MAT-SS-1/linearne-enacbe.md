---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Poskus za doma: na kuhinjsko tehtnico postavi prazno skledo in vanjo daj tri jajca. Recimo, da tehtnica pokaže $430\,\text{g}$, prazna skleda pa tehta $250\,\text{g}$. Koliko tehta eno jajce, če so jajca enako težka? Ne da bi ga stehtal posebej, sklepaš: jajca skupaj tehtajo $430 - 250 = 180\,\text{g}$, eno torej $60\,\text{g}$.

Pravzaprav si rešil enačbo $3x + 250 = 430$. Takim enačbam rečemo **linearne enačbe**. Naučil se jih boš reševati tudi z ulomki (recepti so polni polovic in tretjin) in s **parametrom**, črko, ki je ne poznamo vnaprej.

Linearne enačbe nastopajo povsod, kjer se nekaj spreminja enakomerno: cena taksija, mesečni strošek telefona, čas potovanja. Znanje potrebuješ tudi naprej, saj je reševanje linearnih enačb osnova za neenačbe, sisteme enačb in kasneje za kvadratne enačbe. Parameter pa je prvi korak k pravi algebri: namesto ene enačbe rešuješ cel »razred« enačb naenkrat.

## Razlaga

**Najprej opazuj.** Tri tehtanja iz kuhinje, vsako zapisano kot enačba. Pri vsakem smo na obeh straneh naredili isto:

- $x + 250 = 430$: odštejemo $250$, ostane $x = 180$;
- $3x = 180$: delimo s $3$, ostane $x = 60$;
- $3x + 250 = 430$: odštejemo $250$, nato delimo s $3$, ostane $x = 60$.

Opaziš vzorec? Neznanko vsakič osamimo tako, da »odstranjujemo« člene okrog nje, vedno na obeh straneh hkrati. Tik pred zadnjim korakom ima enačba obliko »število krat $x$ je število«.

V simulaciji spodaj (»Linearne enačbe«) z obeh skodelic tehtnice odstrani enako število uteži in opazuj, da ostane v ravnovesju. Nato vzemi utež samo z ene strani: ravnovesje se poruši, enačba ne velja več.

**1. Izraz in enačba, spremenljivka in neznanka.** Primerjaj zapisa $3x + 250$ in $3x + 250 = 430$. Prvi je **izraz**: števila in črke, povezani z računskimi operacijami, brez enačaja. Izraz ničesar ne trdi. Pove le, kako iz števila $x$ izračunaš novo število. Drugi zapis je **enačba**: dva izraza, povezana z enačajem. Enačba je trditev »leva stran je enaka desni«. Pri danem $x$ je resnična ali neresnična. Ta enačba velja pri eni vrednosti $x$, pri drugih ne:

| $x$ | $3x + 250$ | enačba |
|---|---|---|
| $50$ | $400$ | ne velja |
| $60$ | $430$ | velja |
| $70$ | $460$ | ne velja |

V izrazu je $x$ **spremenljivka**: vstaviš lahko katerokoli število in vsakič dobiš vrednost izraza. V enačbi je ista črka **neznanka**: iščemo tista števila, pri katerih je enačba resnična. Ta števila so **rešitve** enačbe, tu je edina rešitev $x = 60$. Enačba torej vpraša, pri katerem $x$ ima izraz na levi vrednost $430$.

Razliko opaziš tudi pri računanju:

- Izraz **poenostavimo** ali izračunamo njegovo vrednost. Vrednost se pri nobenem $x$ ne sme spremeniti, zato smemo izraz zamenjati le z enakim izrazom: $2(x + 3) = 2x + 6$.
- Enačbo **rešimo**. Ohraniti moramo le njene rešitve, zato smemo obe strani spremeniti na enak način (3. točka). Enačbo $4x + 6 = 10$ smemo deliti z $2$: enačba $2x + 3 = 5$ ima isto rešitev $x = 1$. Izraza $4x + 6$ pa ne smemo »deliti z $2$«, saj $2x + 3$ ni enak izraz: pri $x = 1$ ima prvi vrednost $10$, drugi $5$.

Enačba, ki je resnična pri vsakem $x$, na primer $2(x + 3) = 2x + 6$, je **identiteta**. Pove, da sta izraza na obeh straneh enaka. Enačba $x + 1 = x$ pa ni resnična pri nobenem $x$, zato nima rešitve (5. točka).

**2. Kaj je linearna enačba.** Linearna enačba z eno neznanko $x$ je enačba, ki jo lahko z ekvivalentnimi preoblikami prevedemo na obliko

$$ax = b,$$

kjer sta $a$ in $b$ števili. Neznanka nastopa samo v prvi potenci ($x$, ne $x^2$ in ne $\frac{1}{x}$).

**3. Ekvivalentne preoblike.** Enačbi ostane rešitev ista, če:

- na obeh straneh prištejemo ali odštejemo isto število ali izraz,
- obe strani pomnožimo ali delimo z istim številom, **različnim od $0$**,
- odpremo oklepaje in poenostavimo posamezno stran.

Enačba je kot tehtnica: kar naredimo na eni strani, moramo narediti tudi na drugi.

:::premisli
Zakaj ne smemo obeh strani pomnožiti z $0$? Kaj bi se zgodilo z enačbo $x + 250 = 430$?
---
Dobili bi $0 = 0$, kar velja za vsak $x$. Nova enačba bi imela drugačne rešitve (vsa števila) kot prvotna (samo $180$), zato to ni ekvivalentna preoblika.
:::

**4. Postopek reševanja.**

1. Odpri oklepaje.
2. Če so v enačbi ulomki, vse člene pomnoži s skupnim imenovalcem, da jih odpraviš.
3. Člene z neznanko prenesi na eno stran, ostale na drugo.
4. Poenostavi in dobi obliko $ax = b$.
5. Deli z $a$ (če $a \ne 0$).
6. **Preveri** z vstavitvijo v prvotno enačbo.

**5. Koliko rešitev ima enačba $ax = b$?**

- Če je $a \neq 0$: natanko ena rešitev, $x = \dfrac{b}{a}$.
- Če je $a = 0$ in $b \neq 0$: enačba $0 \cdot x = b$ **nima rešitve** (npr. $0 = 4$ ni res).
- Če je $a = 0$ in $b = 0$: enačba $0 \cdot x = 0$ velja za **vsako realno število**, rešitev je $\mathbb{R}$.

:::premisli
Napovej, preden računaš: koliko rešitev ima enačba $2x + 3 = 2x + 5$?
---
Nobene. Ko na obeh straneh odštejemo $2x$, ostane $3 = 5$, kar ni res. To je oblika $0 \cdot x = 2$: leva stran je za vsak $x$ za $2$ manjša od desne.
:::

**6. Enačbe s parametrom (višja raven).** Včasih v enačbi poleg $x$ nastopa še črka, npr. $a$ ali $m$, ki predstavlja neko poljubno, a fiksno število. Tej črki rečemo **parameter**. Za vsako vrednost parametra dobimo drugo enačbo, zato rešitev običajno zapišemo kot formulo in ločimo primere.

Primer: $mx + 1 = 3x + 5$. Člene z $x$ prenesemo na levo: $mx - 3x = 5 - 1$, torej $(m-3)x = 4$.

- Če je $m \neq 3$, delimo z $m - 3$: $x = \dfrac{4}{m-3}$.
- Če je $m = 3$, dobimo $0 \cdot x = 4$, kar ne velja. Enačba nima rešitve.

Pri parametru **nikoli ne delimo z izrazom, ki bi lahko bil $0$**, ne da bi ta primer obravnavali posebej.

## Rešeni primeri

### Primer 1: oklepaji

Reši enačbo $3(x-2) + 5 = 2x + 7$.

**Podatki:** enačba $3(x-2) + 5 = 2x + 7$
**Iščemo:** neznanko $x$

:::formula
Ekvivalentne preoblike do oblike $ax = b$, nato $x = \dfrac{b}{a}$ za $a \ne 0$
:::

**Rešitev:**

1. Odpremo oklepaj. Vsak člen v oklepaju pomnožimo s $3$: $3x - 6 + 5 = 2x + 7$.
2. Poenostavimo levo stran: $3x - 1 = 2x + 7$.
3. Člene z $x$ prenesemo na levo, števila na desno. Odštejemo $2x$ in prištejemo $1$: $3x - 2x = 7 + 1$.
4. Poenostavimo: $x = 8$.
5. Preverimo. Leva stran: $3 \cdot (8-2) + 5 = 18 + 5 = 23$. Desna stran: $2 \cdot 8 + 7 = 23$. ✓
6. Odgovor: rešitev enačbe je $x = 8$.

### Primer 2: ulomki

Reši enačbo $\dfrac{x+1}{2} - \dfrac{2x-1}{3} = 1$.

**Podatki:** enačba $\dfrac{x+1}{2} - \dfrac{2x-1}{3} = 1$, imenovalca $2$ in $3$
**Iščemo:** neznanko $x$

:::formula
Vse člene pomnožimo s skupnim imenovalcem (tu $6$), nato rešujemo kot enačbo brez ulomkov.
:::

**Rešitev:**

1. Skupni imenovalec je $6$. Vsak člen, tudi $1$ na desni, pomnožimo s $6$:
$$6 \cdot \frac{x+1}{2} - 6 \cdot \frac{2x-1}{3} = 6 \cdot 1.$$
2. Krajšamo: $3(x+1) - 2(2x-1) = 6$. Ulomkov ni več, imamo pa oklepaje.
3. Odpremo oklepaje. Pozor: pred drugim oklepajem je minus, zato ga množimo z $-2$: $3x + 3 - 4x + 2 = 6$.
4. Poenostavimo: $-x + 5 = 6$.
5. Odštejemo $5$: $-x = 1$. Pomnožimo z $-1$: $x = -1$.
6. Preverimo. $\dfrac{-1+1}{2} - \dfrac{2\cdot(-1)-1}{3} = \dfrac{0}{2} - \dfrac{-3}{3} = 0 + 1 = 1$. ✓
7. Odgovor: rešitev enačbe je $x = -1$.

### Primer 3 (višja raven): parameter

Reši enačbo $ax + 3 = x + a + 2$ za neznanko $x$. Parameter $a$ je realno število.

**Podatki:** enačba $ax + 3 = x + a + 2$, parameter $a \in \mathbb{R}$
**Iščemo:** rešitev $x$ za vsako vrednost parametra $a$

:::formula
$(a-1)x = b$: za $a - 1 \ne 0$ je $x = \dfrac{b}{a-1}$; primer $a - 1 = 0$ obravnavamo posebej.
:::

**Rešitev:**

1. Člene z $x$ prenesemo na levo, ostalo na desno: $ax - x = a + 2 - 3$.
2. Na levi izpostavimo $x$, na desni poenostavimo: $(a-1)x = a - 1$.
3. Razločimo primera, ker bi z deljenjem z $a-1$ lahko delili z $0$.
4. **Primer $a \neq 1$:** delimo z $a - 1$ in dobimo $x = \dfrac{a-1}{a-1} = 1$.
5. **Primer $a = 1$:** enačba postane $0 \cdot x = 0$, kar velja za vsak $x$. Rešitev je vsako realno število.
6. Preverimo z vrednostmi. Za $a = 2$: $2x + 3 = x + 4$ da $x = 1$. ✓ Za $a = 1$: $x + 3 = x + 3$ res velja za vsak $x$. ✓
7. **Odgovor:** za $a \neq 1$ je $x = 1$, za $a = 1$ je rešitev vsako realno število.

### Primer 4 – zdaj ti: mleko v kuhinji

Za palačinke porabiš tretjino mleka iz steklenice, za puding polovico. V steklenici ostane $150\,\text{ml}$. Koliko mleka je bilo v polni steklenici?

**Podatki:** za palačinke $\dfrac{1}{3}$ mleka, za puding $\dfrac{1}{2}$ mleka, ostane $150\,\text{ml}$
**Iščemo:** začetno količino mleka $x$ (v ml)

:::formula
Ostanek = vse − porabljeno: $x - \dfrac{x}{3} - \dfrac{x}{2} = 150$; ulomke odpravimo s skupnim imenovalcem $6$.
:::

**Rešitev:**

1. Neznanka je cela steklenica, zato jo označimo z $x$; porabljeni deli so $\dfrac{x}{3}$ in $\dfrac{x}{2}$.
2. Enačba: $x - \dfrac{x}{3} - \dfrac{x}{2} = 150$, ker od celote odštejemo oba porabljena dela.
3. Pomnožimo vsak člen s $6$, tudi $150$ na desni: $6x - 2x - 3x = 900$.
4. Poenostavi levo stran, izračunaj $x$ in naredi preizkus.

:::premisli
Koliko mleka je bilo v steklenici?
---
$6x - 2x - 3x = x$, torej $x = 900\,\text{ml}$. Preizkus: $900 - 300 - 450 = 150$. V steklenici je bilo $900\,\text{ml}$ mleka.
:::

## Pogoste napake

- **Predznak pred oklepajem.** »$-(2x-1) = -2x - 1$.« Napačno: minus spremeni predznak *obema* členoma. Popravek: $-(2x-1) = -2x + 1$. Pri ulomku $-\dfrac{2x-1}{3}$ je števec v oklepaju, zato po množenju s $6$ dobimo $-2(2x-1)$.
- **Pozabljeno množenje členov brez ulomka.** »Pri $\dfrac{x}{2} + \dfrac{x}{3} = 5$ množim s $6$ samo ulomka: $3x + 2x = 5$.« Napačno: tehtnica ostane v ravnovesju le, če pomnožiš *vsak* člen. Popravek: $3x + 2x = 30$.
- **Prenos brez spremembe predznaka.** »Iz $5x - 7 = 3x + 9$ sledi $2x = 9 - 7$.« Napačno: $-7$ odstranimo tako, da na obeh straneh prištejemo $7$. Popravek: $2x = 9 + 7 = 16$.
- **Deljenje z $0$ pri parametru (višja raven).** »$(a-1)x = a-1$, torej vedno $x = 1$.« Napačno: pri $a = 1$ bi delil z $0$. Popravek: primer $a = 1$ reši posebej; tam velja vsak $x$.
- **Napačen zaključek pri $0 \cdot x = b$.** »$0 \cdot x = 6$, torej $x = 0$.« Napačno: $0 \cdot x$ je vedno $0$, nikoli $6$. Popravek: če je $b \neq 0$, rešitve ni; če je $b = 0$, so rešitve vsa števila.

## Povzetek

- Izraz ničesar ne trdi, pri danem $x$ ima le vrednost; $x$ je v njem spremenljivka. Enačba je trditev, da sta dva izraza enaka, in je pri danem $x$ resnična ali neresnična; $x$ je v njej neznanka, iščemo vrednosti $x$, pri katerih je resnična.
- Linearno enačbo z ekvivalentnimi preoblikami prevedemo na $ax = b$.
- Postopek: odpri oklepaje, odpravi ulomke (množenje s skupnim imenovalcem), zberi člene z $x$ na eni strani, poenostavi, deli z $a$, preveri.
- Za $a \neq 0$ je rešitev $x = \dfrac{b}{a}$. Za $a = 0$, $b \neq 0$ rešitve ni. Za $a = 0$, $b = 0$ je rešitev vsako realno število.
- (višja raven) Pri enačbi s parametrom obravnavamo primere, kdaj je koeficient pri $x$ enak $0$ in kdaj ni.
- Rešitev vedno preveri z vstavitvijo.

## Ponovitev

**Formule**
- $ax = b$, $a \ne 0$: $x = \frac{b}{a}$ (na pamet)
- $a = 0$, $b \ne 0$: ni rešitve (na pamet)
- $a = 0$, $b = 0$: rešitev je vsak $x \in \mathbb{R}$ (na pamet)
- $-(2x - 1) = -2x + 1$ (na pamet)

**Postopek**
1. Odpri oklepaje.
2. Odpravi ulomke: vsak člen pomnoži s skupnim imenovalcem.
3. Člene z $x$ zberi na eni strani, števila na drugi.
4. Poenostavi v $ax = b$ in deli z $a$.
5. Preveri z vstavitvijo v začetno enačbo.

**Pazi na**
- Minus pred oklepajem spremeni predznak obema členoma.
- S skupnim imenovalcem pomnoži vsak člen, tudi tiste brez ulomka.
- Člen prenašaš tako, da ga na obeh straneh prišteješ ali odšteješ: $-7$ postane $+7$.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Rešite enačbo $\dfrac{x - 3}{4} - \dfrac{2x + 1}{6} = \dfrac{x}{3} - 3$.

**Rešitev:**

1. Skupni imenovalec števil $4$, $6$ in $3$ je $12$. Z $12$ pomnožimo vsak člen, tudi $-3$: $3(x - 3) - 2(2x + 1) = 4x - 36$.
2. Odpremo oklepaje; minus pred drugim oklepajem spremeni predznak obema členoma: $3x - 9 - 4x - 2 = 4x - 36$, torej $-x - 11 = 4x - 36$.
3. Uredimo: $-5x = -25$, zato je $x = 5$.
4. Preizkus: leva stran je $\dfrac{2}{4} - \dfrac{11}{6} = \dfrac{3}{6} - \dfrac{11}{6} = -\dfrac{4}{3}$, desna stran $\dfrac{5}{3} - 3 = -\dfrac{4}{3}$.
5. Odgovor: $x = 5$.

**Točkovanje:** 1 točka za enačbo brez ulomkov (pomnožen vsak člen), 1 točka za pravilno odpravljene oklepaje, 1 točka za $x = 5$.

### Naloga 2: krajša strukturirana naloga, 6 točk, pola 1 (brez računala)

Operater A zaračuna mesečno naročnino $8{,}40\,\text{€}$ in $0{,}035\,\text{€}$ za vsako minuto klicev, operater B pa naročnino $5{,}20\,\text{€}$ in $0{,}06\,\text{€}$ za minuto. Število minut klicev v mesecu označimo z $x$.

a) Zapišite enačbo, s katero izračunate, pri koliko minutah klicev sta mesečna računa pri obeh operaterjih enaka, in jo rešite. (3 točke)
b) Koliko evrov znaša takrat mesečni račun? (1 točka)
c) Mesečni račun pri operaterju A je znašal $17{,}85\,\text{€}$. Koliko minut klicev je bilo v tem mesecu? (2 točki)

**Rešitev:**

1. a) Račun pri operaterju A je $8{,}40 + 0{,}035x$, pri operaterju B pa $5{,}20 + 0{,}06x$ (v evrih).
2. a) Enačba: $8{,}40 + 0{,}035x = 5{,}20 + 0{,}06x$.
3. a) Uredimo: $8{,}40 - 5{,}20 = 0{,}06x - 0{,}035x$, torej $3{,}20 = 0{,}025x$ in $x = \dfrac{3{,}20}{0{,}025} = \dfrac{3200}{25} = 128$.
4. b) $8{,}40 + 0{,}035 \cdot 128 = 8{,}40 + 4{,}48 = 12{,}88\,\text{€}$. Preizkus pri operaterju B: $5{,}20 + 0{,}06 \cdot 128 = 5{,}20 + 7{,}68 = 12{,}88$.
5. c) $8{,}40 + 0{,}035x = 17{,}85$, torej $0{,}035x = 9{,}45$ in $x = \dfrac{9{,}45}{0{,}035} = \dfrac{9450}{35} = 270$.
6. Odgovor: a) računa sta enaka pri $128$ minutah klicev; b) račun je takrat $12{,}88\,\text{€}$; c) v tem mesecu je bilo $270$ minut klicev.

**Točkovanje:** a) 1 točka za izraza za oba računa, 1 točka za enačbo, 1 točka za $x = 128$; b) 1 točka za $12{,}88\,\text{€}$; c) 1 točka za enačbo $8{,}40 + 0{,}035x = 17{,}85$; 1 točka za $270$ minut.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Dana je enačba $\dfrac{mx + 2}{2} - \dfrac{m + 3}{3} = \dfrac{4 - x}{2} - \dfrac{m}{3}$ z neznanko $x$ in realnim parametrom $m$.

a) Rešite enačbo za $m = 3$. (1 točka)
b) Rešite enačbo za vse vrednosti parametra $m$. (4 točke)
c) Za katere vrednosti $m$ je rešitev enačbe negativno število? Utemeljite. (2 točki)
d) Za katere cele vrednosti $m$ je rešitev enačbe celo število? Zapišite vse take $m$. (3 točke)

**Rešitev:**

1. a) Pri $m = 3$ je enačba $\dfrac{3x + 2}{2} - 2 = \dfrac{4 - x}{2} - 1$. Pomnožimo z $2$: $3x + 2 - 4 = 4 - x - 2$, torej $4x = 4$ in $x = 1$.
2. b) Pomnožimo s $6$: $3(mx + 2) - 2(m + 3) = 3(4 - x) - 2m$, torej $3mx + 6 - 2m - 6 = 12 - 3x - 2m$.
3. b) Člene z $x$ zberemo na levi, člena $-2m$ na obeh straneh se odštejeta: $3mx + 3x = 12$, torej $3(m + 1)x = 12$ in $(m + 1)x = 4$.
4. b) Z $m + 1$ smemo deliti le, če ni enak $0$. Za $m \neq -1$ je $x = \dfrac{4}{m + 1}$. Preizkus pri $m = 3$: $\dfrac{4}{4} = 1$, enako kot v a).
5. b) Za $m = -1$ dobimo $0 \cdot x = 4$, kar ne velja za noben $x$: enačba nima rešitve.
6. c) Rešitev obstaja le za $m \neq -1$ in je $\dfrac{4}{m + 1}$. Števec $4$ je pozitiven, zato je ulomek negativen natanko tedaj, ko je imenovalec negativen: $m + 1 < 0$, torej $m < -1$.
7. d) Za celo število $m \neq -1$ je $m + 1$ celo število, različno od $0$. Količnik $\dfrac{4}{m + 1}$ je celo število natanko tedaj, ko je $m + 1$ delitelj števila $4$: $m + 1 \in \{-4, -2, -1, 1, 2, 4\}$.
8. d) Torej je $m \in \{-5, -3, -2, 0, 1, 3\}$; pripadajoče rešitve so po vrsti $x = -1$, $-2$, $-4$, $4$, $2$ in $1$.
9. Odgovor: a) $x = 1$; b) za $m \neq -1$ je $x = \dfrac{4}{m + 1}$, za $m = -1$ enačba nima rešitve; c) za $m < -1$, torej $m \in (-\infty, -1)$; d) za $m \in \{-5, -3, -2, 0, 1, 3\}$.

**Točkovanje:** a) 1 točka za $x = 1$; b) 1 točka za enačbo brez ulomkov, 1 točka za $(m + 1)x = 4$, 1 točka za $x = \dfrac{4}{m + 1}$ pri $m \neq -1$, 1 točka za ugotovitev, da pri $m = -1$ rešitve ni; c) 1 točka za utemeljitev s predznakom imenovalca, 1 točka za $m < -1$; d) 1 točka za ugotovitev, da mora biti $m + 1$ delitelj števila $4$, 1 točka za vseh šest deliteljev, 1 točka za $m \in \{-5, -3, -2, 0, 1, 3\}$.

### Ustno vprašanje 1

:::premisli
Pojasni razliko med izrazom in enačbo ter med spremenljivko in neznanko na primeru $2x + 3$ in $2x + 3 = 11$.
---
Izraz $2x + 3$ je zapis računa, ki za vsako vrednost spremenljivke $x$ da neko število, ničesar pa ne trdi. Enačba $2x + 3 = 11$ je trditev, da sta dva izraza enaka, in je za nekatere vrednosti $x$ resnična, za druge pa ne. V izrazu je $x$ spremenljivka, ki lahko zavzame poljubno vrednost. V enačbi je $x$ neznanka: iščemo vrednosti, pri katerih enačba velja, tu je to $x = 4$.
:::

### Ustno vprašanje 2

:::premisli
Koliko rešitev ima lahko linearna enačba $ax = b$? Navedi pogoje za vse primere in jih utemelji.
---
Če je $a \neq 0$, obe strani delimo z $a$ in dobimo natanko eno rešitev $x = \dfrac{b}{a}$. Če je $a = 0$, je leva stran za vsak $x$ enaka $0$, zato enačba postane $0 = b$. Pri $a = 0$ in $b \neq 0$ ta enakost ne velja, zato enačba nima rešitve. Pri $a = 0$ in $b = 0$ enakost velja za vsak $x$, zato je rešitev vsako realno število.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Navedi primer linearne enačbe s parametrom, ki ima za eno vrednost parametra neskončno rešitev, za drugo pa nobene, in jo obravnavaj.
---
Primer je enačba $(m^2 - 1)x = m - 1$ s parametrom $m$, v kateri je $m^2 - 1 = (m - 1)(m + 1)$. Za $m \neq 1$ in $m \neq -1$ smemo deliti in dobimo $x = \dfrac{1}{m + 1}$. Pri $m = 1$ dobimo $0 \cdot x = 0$, zato je rešitev vsako realno število. Pri $m = -1$ dobimo $0 \cdot x = -2$, zato rešitve ni. Primere ločimo, ker z izrazom, ki je lahko enak $0$, ne smemo deliti.
:::

## Drugače: Na sliki

Enačbo $3x - 1 = 2x + 7$ si lahko predstavljaš kot vprašanje: pri katerem $x$ imata premici $y = 3x - 1$ in $y = 2x + 7$ enako vrednost? Rešitev je abscisa **presečišča** teh dveh premic. V našem primeru je $x = 8$. Takrat imata obe premici vrednost $y = 3 \cdot 8 - 1 = 23$ in $y = 2 \cdot 8 + 7 = 23$.

Posebej preprost primer je enačba $ax + b = 0$. Njena rešitev je **ničla** linearne funkcije $f(x) = ax + b$, torej točka, kjer graf seka os $x$. Na primer $2x - 4 = 0$ da $x = 2$, graf funkcije $y = 2x - 4$ prečka os $x$ v točki $(2, 0)$.

Pri parametru slika razloži tudi primere. Če sta premici vzporedni in različni, se ne sekata (ni rešitve). Če sta isti premici, se prekrivata povsod (neskončno rešitev). V ostalih primerih se sekata v eni točki.

## Drugače: Kot zgodba

Babica peče piškote in pravi Maji: »Na tehtnici je pladenj s štirimi enakimi kepami testa in še $100\,\text{g}$ sladkorja. Skupaj je $900\,\text{g}$. Pladenj tehta $200\,\text{g}$. Koliko tehta ena kepa?«

Maja najprej odmisli, kar ni testo. S tehtnice v mislih umakne pladenj in sladkor, zato od $900$ odšteje $200$ in $100$: ostane $600\,\text{g}$. To je teža štirih kep, ena torej tehta $150\,\text{g}$. Z enačbo: $4x + 300 = 900$, $4x = 600$, $x = 150$.

Naslednji dan babica uporabi drug pladenj, njegove teže pa ne pove. »Recimo, da tehta $p$ gramov,« reče Maja. Potem je $4x + p + 100 = 900$ in $x = \dfrac{800 - p}{4}$. To je enačba s parametrom: za vsak pladenj dobi drugo kepo. Ko pa babica reče, da pladenj tehta $800\,\text{g}$, Maja vidi, da je $x = 0$: na pladnju sploh ni testa. Parameter torej pove, kdaj ima naloga smisel.

## Drugače: Korak za korakom s številkami

Reši enačbo $\dfrac{2x-1}{4} = \dfrac{x+2}{3}$.

| Korak | Kaj naredimo | Rezultat |
|---|---|---|
| 1 | Skupni imenovalec je $12$. Obe strani množimo z $12$. | $12 \cdot \dfrac{2x-1}{4} = 12 \cdot \dfrac{x+2}{3}$ |
| 2 | Krajšamo. | $3(2x-1) = 4(x+2)$ |
| 3 | Odpremo oklepaje. | $6x - 3 = 4x + 8$ |
| 4 | Odštejemo $4x$, prištejemo $3$. | $6x - 4x = 8 + 3$ |
| 5 | Poenostavimo. | $2x = 11$ |
| 6 | Delimo z $2$. | $x = \dfrac{11}{2} = 5{,}5$ |

Preverimo: leva stran je $\dfrac{2 \cdot 5{,}5 - 1}{4} = \dfrac{10}{4} = 2{,}5$, desna stran je $\dfrac{5{,}5 + 2}{3} = \dfrac{7{,}5}{3} = 2{,}5$. ✓

## Drugače: Bolj natančno

Zakaj smemo enačbo množiti ali deliti z istim številom, ki ni $0$? Če velja $A = B$, potem velja tudi $kA = kB$ za vsak $k$. To je očitno. Obratno, če velja $kA = kB$ in je $k \neq 0$, lahko obe strani delimo s $k$ in dobimo $A = B$. Zato sta enačbi **ekvivalentni**, imata iste rešitve. Če je $k = 0$, dobimo $0 = 0$ ne glede na $A$ in $B$, zato bi izgubili vso informacijo in dobili »rešitve«, ki jih prej ni bilo.

(višja raven) Zato pri parametru ne smemo deliti z izrazom, ki je lahko $0$. V enačbi $(a-1)x = a-1$ je deljenje z izrazom $a - 1$ ekvivalentna preoblika samo, če je $a - 1 \neq 0$. Primer $a = 1$ je treba rešiti ločeno, neposredno iz enačbe.

Splošno: enačbo $ax = b$ rešujemo takole.

- Če je $a \neq 0$, ima enačba natanko eno rešitev $x = \dfrac{b}{a}$. Preverimo: $a \cdot \dfrac{b}{a} = b$. ✓
- Če je $a = 0$, je leva stran za vsak $x$ enaka $0$. Enačba je torej res za vse $x$, če je $b = 0$, in za noben $x$, če je $b \neq 0$.

## Preveri se

? (brez računala) Izraz $5x - 2$ ima pri $x = 4$ vrednost $18$. Pri katerem $x$ ima vrednost $33$? Vpiši rešitev enačbe $5x - 2 = 33$.
= 7 | 0
~ 163 | Število $33$ si vstavil namesto $x$ in izračunal vrednost izraza. V enačbi je $x$ neznanka: iščeš $x$, pri katerem je izraz enak $33$.
~ 6,2 | Pri prenosu $-2$ nisi spremenil predznaka: $5x = 33 - 2$. Pravilno je $5x = 33 + 2$.
> Prištejemo $2$: $5x = 35$, torej $x = 7$. Preizkus: $5 \cdot 7 - 2 = 33$. Izraz ima vrednost pri vsakem $x$, enačba pa je resnična le pri $x = 7$.

? Reši enačbo $5x - 7 = 3x + 9$.
- $x = 1$
~ Pri prenosu $-7$ nisi spremenil predznaka: $2x = 9 - 7$. Pravilno je $2x = 9 + 7$.
+ $x = 8$
- $x = -8$
~ Napačen predznak pri zadnjem koraku. Iz $2x = 16$ sledi pozitiven $x$.
> Člene z $x$ zberemo na levi: $5x - 3x = 9 + 7$, torej $2x = 16$ in $x = 8$. Odgovor $x = 1$ dobimo, če $7$ napačno odštejemo ($9 - 7 = 2$), odgovor $x = -8$ pa, če napačno obrnemo predznak.

? (brez računala) Reši enačbo $\dfrac{x}{2} + \dfrac{x}{3} = 5$. Vpiši rešitev $x$.
= 6 | 0
~ 1 | S $6$ si pomnožil samo ulomka, ne pa tudi $5$ na desni. Pomnožiti moraš vsak člen.
~ 30 | Ustavil si se pri $5x = 30$. Na koncu deliš s koeficientom $5$.
> Pomnožimo s $6$: $3x + 2x = 30$, torej $5x = 30$ in $x = 6$. Če pozabimo pomnožiti desno stran, dobimo $x = 1$. Če ne delimo s $5$, dobimo $30$.

? (višja raven) Za katero vrednost parametra $a$ enačba $ax - 2 = 4 + 2x$ nima rešitve?
- $a = 0$
~ Pri $a = 0$ dobimo $-2 = 4 + 2x$, ki ima rešitev $x = -3$. Gledati moraš koeficient pri $x$, ne samo $a$.
- $a = 6$
~ $6$ je desna stran $b$, ne pogoj. Rešitve ni, ko je koeficient pri $x$ enak $0$.
+ $a = 2$
- $a = -2$
~ Člen $2x$ si prenesel brez spremembe predznaka: $(a+2)x$. Pravilno je $(a-2)x = 6$.
> Enačbo preoblikujemo: $ax - 2x = 6$, torej $(a-2)x = 6$. Za $a = 2$ dobimo $0 \cdot x = 6$, kar nikoli ne velja. Za vsak drug $a$ je rešitev $x = \dfrac{6}{a-2}$.

? Skleda tehta $248\,\text{g}$, s štirimi enakimi jabolki pa $1052\,\text{g}$. Približno koliko tehta eno jabolko?
- približno $260\,\text{g}$
~ Pozabil si odšteti skledo: $1052 : 4 \approx 263$. Najprej odstrani skledo z obeh strani.
+ približno $200\,\text{g}$
- približno $325\,\text{g}$
~ Skledo si prištel namesto odštel: $(1052 + 248) : 4 = 325$. Pri prenosu se predznak spremeni.
- približno $800\,\text{g}$
~ To so vsa štiri jabolka ($1052 - 248 = 804$). Deliti moraš še s $4$.
> Enačba $4x + 248 = 1052$ da $4x = 804$ in $x = 201$. Eno jabolko tehta približno $200\,\text{g}$.

? (višja raven) Zakaj enačbe $(a-1)x = a - 1$ ne smemo kar deliti z $a - 1$?
- Ker $a$ ni znano število, zato z njim ne smemo računati.
~ S parametrom smemo računati kot s številom. Težava je samo, kadar je izraz enak $0$.
+ Ker je pri $a = 1$ izraz $a - 1$ enak $0$, z $0$ pa ne smemo deliti.
- Ker bi dobili $x = 1$, to pa ni nikoli rešitev.
~ Za $a \ne 1$ je $x = 1$ res rešitev. Manjka le poseben primer $a = 1$.
> Deljenje z $a - 1$ je ekvivalentna preoblika samo za $a \ne 1$. Pri $a = 1$ dobimo $0 \cdot x = 0$, kar velja za vsak $x$.

:::simboli
x | neznanka | | | v izrazu (1. točka razlage) spremenljivka
a | koeficient pri neznanki | | | pri a ≠ 0 je rešitev x = b/a; v Primeru 3 in v vprašanjih je $a$ parameter
b | znano število na desni strani | | |
m | parameter | | | poljubno, a fiksno število
p | teža pladnja (parameter v zgodbi) | | g |
:::

<<RACUN
resi: (x-3)/4-(2*x+1)/6=x/3-3 | x | 5
resi: 3*(x-3)-2*(2*x+1)=4*x-36 | x | 5
vrednost: 2/4-11/6 | -4/3
vrednost: 5/3-3 | -4/3
resi: 8.4+0.035*x=5.2+0.06*x | x | 128
vrednost: 8.4+0.035*128 | 12.88
vrednost: 5.2+0.06*128 | 12.88
resi: 8.4+0.035*x=17.85 | x | 270
resi: (3*x+2)/2-2=(4-x)/2-1 | x | 1
enako: 3*(m*x+2)-2*(m+3)-(3*(4-x)-2*m) | 3*(m+1)*x-12
enako: (m*x+2)/2-(m+3)/3-((4-x)/2-m/3) | (m+1)*x/2-2
enako: (m*(4/(m+1))+2)/2-(m+3)/3-((4-4/(m+1))/2-m/3) | 0
resi: (-x+2)/2-2/3=(4-x)/2+1/3 | x | none
neenacba: m+1<0 | m | (-oo, -1)
vrednost: 4/(-5+1) | -1
vrednost: 4/(-3+1) | -2
vrednost: 4/(-2+1) | -4
vrednost: 4/(0+1) | 4
vrednost: 4/(1+1) | 2
vrednost: 4/(3+1) | 1
resi: 2*x+3=11 | x | 4
enako: (m-1)/(m^2-1) | 1/(m+1)
vrednost: 3*50+250 | 400
vrednost: 3*60+250 | 430
vrednost: 3*70+250 | 460
resi: 3*x+250=430 | x | 60
enako: 2*(x+3) | 2*x+6
resi: 4*x+6=10 | x | 1
resi: 2*x+3=5 | x | 1
vrednost: 4*1+6 | 10
vrednost: 2*1+3 | 5
vrednost: 5*4-2 | 18
resi: 5*x-2=33 | x | 7
vrednost: 5*33-2 | 163
resi: 5*x=33-2 | x | 31/5
resi: x/2+x/3=5 | x | 6
>>
