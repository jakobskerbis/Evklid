---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Lastnosti organske spojine (vrelišče, topnost, kislost, reaktivnost, barva, biološki učinek) so posledica njene **zgradbe**: kateri atomi so povezani, s kakšnimi vezmi, pod kakšnimi koti in kako so razporejeni elektroni. Etanol in dimetil eter imata isto molekulsko formulo $\mathrm{C_2H_6O}$, pa je prvi tekočina, ki se meša z vodo, drugi pa plin. Diamant in grafit sta oba čisti ogljik, a je prvi najtrši naravni material, drugi pa mehak in prevoden. Razlika je v vezeh.

Znanje o kemijski vezi zdaj povežemo z organskimi molekulami:

- **hibridizacija** ogljikovih in drugih atomov napove geometrijo, kote in vrsto vezi ($\sigma$, $\pi$),
- **resonanca** opiše molekule, pri katerih ena Lewisova formula ni dovolj, in pojasni stabilnost benzena ali kislost karboksilnih kislin,
- **funkcionalne skupine** so deli molekul, ki določajo kemijsko vedenje celega razreda spojin.

Potrebuješ Lewisove formule, elektronegativnost in osnovno predstavo o atomskih orbitalah $s$ in $p$.

## Razlaga

**1. Ogljik in Lewisove formule.** Ogljik ima štiri valenčne elektrone ($1s^2\, 2s^2\, 2p^2$) in v organskih molekulah skoraj vedno tvori **štiri vezi**: štiri enojne, dvojno in dve enojni, dve dvojni ali trojno in enojno. Vodik tvori eno vez, kisik dve (z dvema nevezanima elektronskima paroma), dušik tri (z enim nevezanim parom), halogeni eno (s tremi nevezanimi pari).

Kadar atom tvori drugačno število vezi, nosi **formalni naboj**

$$\mathrm{FN} = V - N - \tfrac{1}{2}B,$$

kjer je $V$ število valenčnih elektronov prostega atoma, $N$ število nevezanih elektronov in $B$ število elektronov v vezeh tega atoma. Kisik z eno vezjo in tremi nevezanimi pari ima $\mathrm{FN} = 6 - 6 - 1 = -1$, dušik s štirimi vezmi (kot v amonijevem ionu) $\mathrm{FN} = 5 - 0 - 4 = +1$. Vsota formalnih nabojev je enaka naboju delca. Izpeljava: atomu pripišemo vse njegove nevezane elektrone in polovico elektronov vsake vezi (drugo polovico ima sosed); formalni naboj je razlika med $V$ in tem številom, $V - (N + \tfrac{1}{2}B)$.

**2. Hibridizacija.** Ogljik v metanu tvori štiri enakovredne vezi pod koti $109{,}5^\circ$, čeprav ima na voljo eno orbitalo $2s$ in tri orbitale $2p$ različnih oblik. Model **hibridizacije** to pojasni: atomske orbitale istega atoma se kombinirajo v nove, enakovredne **hibridne orbitale**, usmerjene čim dlje druga od druge. Natančneje: iz ene orbitale $s$ in $m$ orbital $p$ istega atoma nastane $m + 1$ enakovrednih hibridov $sp^m$, ki so med seboj ortogonalni; preostalih $3 - m$ orbital $p$ ostane nehibridiziranih.

**Izpeljava kotov.** Naj bo hibrid $sp^\lambda$ oblike $h = (s + \sqrt{\lambda}\,p_{\vec u})/\sqrt{1 + \lambda}$, kjer je $p_{\vec u}$ orbitala $p$ v smeri enotskega vektorja $\vec u$. Orbitali $s$ in $p$ sta ortogonalni, za dve orbitali $p$ pa velja $\langle p_{\vec u_1} | p_{\vec u_2} \rangle = \cos\theta$. Iz zahteve $\langle h_1 | h_2 \rangle = (1 + \lambda\cos\theta)/(1 + \lambda) = 0$ sledi $\cos\theta = -1/\lambda$: za $\lambda = 3, 2, 1$ je $\theta = 109{,}47^\circ; 120^\circ; 180^\circ$. Delež orbitale $s$ v hibridu je $1/(1 + \lambda)$.

Hibridizacijo atoma določimo iz **sterične številke**: število atomov, vezanih nanj, plus število nevezanih elektronskih parov.

| sterična številka | hibridizacija | razporeditev in kot | primer |
|---|---|---|---|
| $4$ | $sp^3$ | tetraedrična, $109{,}5^\circ$ | $\mathrm{CH_4}$, $\mathrm{C}$ v etanu |
| $3$ | $sp^2$ | trikotna ravninska, $120^\circ$ | $\mathrm{C}$ v etenu, $\mathrm{C{=}O}$ |
| $2$ | $sp$ | linearna, $180^\circ$ | $\mathrm{C}$ v etinu, $\mathrm{CO_2}$ |

Hibridizirajo se tudi heteroatomi. Kisik v vodi in alkoholih ima dve vezi in dva nevezana para, torej $sp^3$; kot je zaradi odboja nevezanih parov manjši, $104{,}5^\circ$ v vodi. Dušik v amoniaku in aminih je $sp^3$ s kotom približno $107^\circ$.

:::premisli
Kakšno hibridizacijo ima dušik v nitrilni skupini $\mathrm{R{-}C{\equiv}N}$ in kakšno kisik v karbonilni skupini $\mathrm{C{=}O}$? Preštej sosede in nevezane pare.
---
Dušik ima enega soseda (C) in en nevezani par, sterična številka je $2$: $sp$. Kisik ima enega soseda in dva nevezana para, sterična številka je $3$: $sp^2$. Število vezi ne odloča, štejejo sosedje in pari.
:::

**3. Vezi $\sigma$ in $\pi$.** Vez $\sigma$ nastane s prekrivanjem orbital **vzdolž osi** med jedroma (hibridna s hibridno ali s $s$ orbitalo vodika). Vez $\pi$ nastane z **bočnim** prekrivanjem nehibridiziranih orbital $p$, ki sta pravokotni na ravnino vezi $\sigma$; elektronska gostota je nad in pod osjo vezi.

- **Enojna vez** je ena vez $\sigma$.
- **Dvojna vez** je ena $\sigma$ in ena $\pi$. Atoma sta navadno $sp^2$.
- **Trojna vez** je ena $\sigma$ in dve $\pi$. Atoma sta $sp$.

Okoli enojne vezi je vrtenje prosto, okoli dvojne pa ne, ker bi se vez $\pi$ pri zasuku pretrgala. Zato obstajajo **cis-trans** (E/Z) izomeri alkenov. Večkratne vezi so krajše in močnejše:

| vez | dolžina | povprečna energija vezi |
|---|---|---|
| $\mathrm{C{-}C}$ | $154\,\mathrm{pm}$ | $347\,\mathrm{kJ/mol}$ |
| $\mathrm{C{=}C}$ | $134\,\mathrm{pm}$ | $614\,\mathrm{kJ/mol}$ |
| $\mathrm{C{\equiv}C}$ | $120\,\mathrm{pm}$ | $839\,\mathrm{kJ/mol}$ |

Vez $\pi$ je šibkejša od vezi $\sigma$ (dvojna vez ni dvakrat močnejša od enojne), zato je mesto večine reakcij alkenov.

Delež orbitale $s$ v hibridni orbitali je $25\,\%$ pri $sp^3$, $33\,\%$ pri $sp^2$ in $50\,\%$ pri $sp$. Večji delež $s$ pomeni, da so elektroni bliže jedru: ogljik $sp$ je bolj elektronegativen od ogljika $sp^3$. Zato je vodik na etinu (p$K_\mathrm{a} \approx 25$) mnogo bolj kisel kot na etanu (p$K_\mathrm{a} \approx 50$).

**4. Polarnost vezi.** Vez med atomoma z različno elektronegativnostjo je polarna: $\mathrm{C^{\delta+}{-}O^{\delta-}}$, $\mathrm{C^{\delta+}{-}Cl^{\delta-}}$. Vez $\mathrm{C{-}H}$ je skoraj nepolarna. Polarne skupine omogočajo dipolne interakcije, skupine $\mathrm{O{-}H}$ in $\mathrm{N{-}H}$ pa še vodikove vezi, ki zvišajo vrelišče in topnost v vodi.

**5. Resonanca.** Za nekatere molekule in ione lahko narišemo več pravilnih Lewisovih formul, ki se razlikujejo **le v razporeditvi elektronov $\pi$ in nevezanih parov**, lega atomov pa je ista. Take formule so **resonančne strukture**, povezujemo jih z dvoglavo puščico $\leftrightarrow$. Prava molekula ni nobena izmed njih in ne »preskakuje« med njimi, ampak je njihov **resonančni hibrid**: elektroni so **delokalizirani** čez več atomov.

Pravila za risanje in vrednotenje:

1. Premikamo le elektrone (vezi $\pi$ in nevezane pare), atomi ostanejo na mestu; vezi $\sigma$ ne trgamo.
2. Vse strukture imajo enako število elektronov in enak skupni naboj.
3. Atomi druge periode nimajo več kot oktet.
4. Večji prispevek imajo strukture z več vezmi, s polnimi okteti, z manj formalnimi naboji in z negativnim nabojem na bolj elektronegativnem atomu.

Delokalizacija znižuje energijo, zato so resonančno stabilizirane molekule stabilnejše od pričakovanega. To razliko imenujemo **resonančna energija**; izmerimo jo kot razliko med pričakovano in izmerjeno entalpijo hidrogeniranja (Naloga 1 v »Za izpit«). Primeri:

- **Benzen** $\mathrm{C_6H_6}$: dve Kekuléjevi strukturi. Vse vezi $\mathrm{C{-}C}$ so enako dolge ($139\,\mathrm{pm}$, med enojno in dvojno), molekula je ravninska, šest elektronov $\pi$ je delokaliziranih po obroču.
- **Karboksilatni ion** $\mathrm{RCOO^-}$: negativni naboj je razporejen na oba kisika.
- **Amidna skupina**: nevezani par dušika je delokaliziran proti karbonilnemu kisiku. Vez $\mathrm{C{-}N}$ ima delno dvojni značaj, skupina je ravninska, dušik je dejansko $sp^2$. To določa obliko peptidne vezi v beljakovinah.
- **Konjugirani sistemi** (izmenjujoče se enojne in dvojne vezi, kot v buta-1,3-dienu ali $\beta$-karotenu) imajo delokalizirane elektrone čez celo verigo.

**Hückelovo pravilo.** Naj bo sistem cikličen, ravninski in popolnoma konjugiran (vsak atom obroča ima orbitalo $p$). Če ima $4k + 2$ elektronov $\pi$ ($k = 0, 1, 2, \dots$), je **aromatski** in posebno stabilen; če jih ima $4k$, je **antiaromatski** in nestabilnejši od ustrezne verige. Benzen ima $6 = 4 \cdot 1 + 2$ elektronov $\pi$. Če sistem ni cikličen, ravninski ali popolnoma konjugiran, je nearomatski.

:::premisli
Cikloheksa-1,3-dien ima v obroču $4$ elektrone $\pi$, kar je oblika $4k$. Je antiaromatski?
---
Ne. Ogljika C5 in C6 sta $sp^3$ in nimata orbitale $p$, zato obroč ni popolnoma konjugiran. Spojina je nearomatski dien; štetje $4k$ ali $4k + 2$ ima smisel šele, ko so izpolnjeni prvi trije pogoji.
:::

**6. Funkcionalne skupine.** **Funkcionalna skupina** je atom ali skupina atomov, ki določa značilne reakcije spojine. Ogljikovodikov ostanek označimo z $\mathrm{R}$.

| razred | skupina | primer |
|---|---|---|
| alken | $\mathrm{C{=}C}$ | eten |
| alkin | $\mathrm{C{\equiv}C}$ | etin |
| aren | benzenov obroč | metilbenzen |
| haloalkan | $\mathrm{R{-}X}$ ($\mathrm{X}$ = F, Cl, Br, I) | klorometan |
| alkohol | $\mathrm{R{-}OH}$ | etanol |
| fenol | $\mathrm{Ar{-}OH}$ | fenol |
| eter | $\mathrm{R{-}O{-}R'}$ | dietil eter |
| aldehid | $\mathrm{R{-}CHO}$ | etanal |
| keton | $\mathrm{R{-}CO{-}R'}$ | propanon |
| karboksilna kislina | $\mathrm{R{-}COOH}$ | etanojska kislina |
| ester | $\mathrm{R{-}COO{-}R'}$ | etil etanoat |
| amid | $\mathrm{R{-}CONH_2}$ | etanamid |
| amin | $\mathrm{R{-}NH_2}$ | metanamin |
| nitril | $\mathrm{R{-}C{\equiv}N}$ | etannitril |
| tiol | $\mathrm{R{-}SH}$ | etantiol |

Aldehidi, ketoni, kisline, estri in amidi vsebujejo **karbonilno skupino** $\mathrm{C{=}O}$ z ogljikom $sp^2$. Ločimo jih po tem, kaj je še vezano na karbonilni ogljik.

**7. Stopnja nenasičenosti.** Iz molekulske formule $\mathrm{C}_c\mathrm{H}_h\mathrm{N}_n\mathrm{O}_o\mathrm{X}_x$ izračunamo število obročev in vezi $\pi$:

$$\mathrm{SN} = \frac{2c + 2 + n - h - x}{2}.$$

Kisik na rezultat ne vpliva. Vsak obroč ali vez $\pi$ prispeva $1$, trojna vez $2$, benzenov obroč $4$ (obroč in tri vezi $\pi$).

**Izpeljava.** Naj bo spojina aciklična in nasičena s $c$ ogljiki. Skelet je povezan in brez obročev, zato ima $c - 1$ vezi $\mathrm{C{-}C}$, ki porabijo $2(c - 1)$ od $4c$ valenc ogljika. Za vodik ostane $4c - 2(c - 1) = 2c + 2$ valenc. Vsak obroč ali vez $\pi$ porabi še dve valenci in zmanjša število H za $2$, zato $\mathrm{SN} = (2c + 2 - h)/2$. Halogen je enovalenten kot H, zato ga prištejemo k $h$. Trivalentni dušik, vrinjen v vez, prinese eno valenco več (en H več): $+n$. Dvovalentni kisik se vrine brez spremembe števila H.

## Rešeni primeri

### Primer 1 (lažji)

Za propen $\mathrm{CH_2{=}CH{-}CH_3}$ določi hibridizacijo vseh ogljikovih atomov, približne kote med vezmi ter število vezi $\sigma$ in $\pi$.

**Podatki:** propen $\mathrm{CH_2{=}CH{-}CH_3}$, molekulska formula $\mathrm{C_3H_6}$; atomi C1 ($\mathrm{CH_2}$), C2 ($\mathrm{CH}$), C3 ($\mathrm{CH_3}$)
**Iščemo:** hibridizacijo C1, C2, C3, kote ter število vezi $\sigma$ in $\pi$

:::formula
Sterična številka $4 \to sp^3$ ($109{,}5^\circ$), $3 \to sp^2$ ($120^\circ$), $2 \to sp$ ($180^\circ$). Enojna vez: $1\sigma$; dvojna: $1\sigma + 1\pi$; trojna: $1\sigma + 2\pi$.
:::

**Rešitev:**

1. C1 je vezan na dva H in na C2 (trije sosedje, brez nevezanih parov): $sp^2$, koti približno $120^\circ$.
2. C2 je vezan na C1, H in C3: $sp^2$, koti približno $120^\circ$.
3. C3 je vezan na C2 in tri H: $sp^3$, koti približno $109{,}5^\circ$.
4. Vezi: $\mathrm{C1{=}C2}$ da $1\sigma + 1\pi$, $\mathrm{C2{-}C3}$ da $1\sigma$, šest vezi $\mathrm{C{-}H}$ da $6\sigma$.
5. Skupaj: $1 + 1 + 6 = 8$ vezi $\sigma$ in $1$ vez $\pi$.
6. Preizkus s stopnjo nenasičenosti: $\mathrm{SN} = \frac{2 \cdot 3 + 2 - 6}{2} = 1$, kar ustreza eni vezi $\pi$.
7. Odgovor: C1 in C2 sta $sp^2$ (koti okoli $120^\circ$), C3 je $sp^3$ (okoli $109{,}5^\circ$); propen ima $8$ vezi $\sigma$ in $1$ vez $\pi$.

### Primer 2

Nariši resonančni strukturi etanoatnega (acetatnega) iona $\mathrm{CH_3COO^-}$, izračunaj formalne naboje kisikovih atomov in pojasni, zakaj sta obe vezi $\mathrm{C{-}O}$ enako dolgi. Za primerjavo: enojna vez $\mathrm{C{-}O}$ je dolga približno $143\,\mathrm{pm}$, dvojna $\mathrm{C{=}O}$ približno $123\,\mathrm{pm}$, v ionu pa sta obe približno $126\,\mathrm{pm}$.

**Podatki:** ion $\mathrm{CH_3COO^-}$ (naboj $-1$); valenčni elektroni: O $6$, C $4$; dolžine $\mathrm{C{-}O}$ $143\,\mathrm{pm}$, $\mathrm{C{=}O}$ $123\,\mathrm{pm}$, v ionu $126\,\mathrm{pm}$
**Iščemo:** resonančni strukturi, formalne naboje kisikov in razlago dolžin vezi

:::formula
$\mathrm{FN} = V - N - \tfrac{1}{2}B$. Resonančne strukture se razlikujejo le v legi elektronov $\pi$ in nevezanih parov.
:::

**Rešitev:**

1. Struktura I: $\mathrm{CH_3{-}C({=}O){-}O^-}$. Dvojno vezani kisik ima dva nevezana para: $\mathrm{FN} = 6 - 4 - \frac{1}{2} \cdot 4 = 0$. Enojno vezani kisik ima tri nevezane pare: $\mathrm{FN} = 6 - 6 - \frac{1}{2} \cdot 2 = -1$.
2. Karboksilni ogljik ima štiri vezi brez nevezanih parov: $\mathrm{FN} = 4 - 0 - 4 = 0$. Vsota nabojev je $-1$, kar se ujema z nabojem iona.
3. Struktura II nastane, ko nevezani par negativnega kisika tvori vez $\pi$ s C, vez $\pi$ druge skupine $\mathrm{C{=}O}$ pa preide na drugi kisik kot nevezani par. Kisika zamenjata vlogi: $\mathrm{CH_3{-}C(O^-){=}O}$.
4. Strukturi sta **enakovredni** (enako število vezi, polni okteti, en negativni naboj na kisiku), zato prispevata enako.
5. Hibrid: vsaka vez $\mathrm{C{-}O}$ je »vez in pol« (red vezi $1{,}5$), na vsakem kisiku je naboj $-\frac{1}{2}$. Karboksilni ogljik je $sp^2$, skupina $\mathrm{COO^-}$ je ravninska.
6. Dolžina vezi z redom $1{,}5$ mora biti med dolžinama enojne in dvojne vezi; $126\,\mathrm{pm}$ je res med $123\,\mathrm{pm}$ in $143\,\mathrm{pm}$.
7. Odgovor: etanoatni ion ima dve enakovredni resonančni strukturi z nabojem $-1$ izmenično na enem od kisikov; v resnici sta obe vezi $\mathrm{C{-}O}$ enaki (red $1{,}5$, približno $126\,\mathrm{pm}$), vsak kisik pa nosi naboj $-\frac{1}{2}$.

### Primer 3 (težji)

Paracetamol ima zgradbo $\mathrm{HO{-}C_6H_4{-}NH{-}CO{-}CH_3}$ (skupini $\mathrm{OH}$ in $\mathrm{NH}$ sta na benzenovem obroču v položaju *para*). Poimenuj funkcionalne skupine, določi hibridizacijo vseh ogljikovih atomov in dušika, preveri število vezi $\pi$ s stopnjo nenasičenosti in preštej vezi $\sigma$. Obroč nato katalitsko hidrogeniramo do 4-acetamidocikloheksanola (amidna skupina se ne reducira). Koliko litrov $\mathrm{H_2}$ pri $0\,°\mathrm{C}$ in $101{,}3\,\mathrm{kPa}$ ($V_m = 22{,}4\,\mathrm{L/mol}$) porabi $1{,}512\,\mathrm{g}$ paracetamola ($M = 151{,}2\,\mathrm{g/mol}$) in kolikšna je stopnja nenasičenosti produkta?

**Podatki:** zgradba $\mathrm{HO{-}C_6H_4{-}NH{-}CO{-}CH_3}$, *para* disubstituiran benzenov obroč, molekulska formula $\mathrm{C_8H_9NO_2}$; $m = 1{,}512\,\mathrm{g}$, $M = 151{,}2\,\mathrm{g/mol}$, $V_m = 22{,}4\,\mathrm{L/mol}$
**Iščemo:** funkcionalne skupine, hibridizacijo atomov C in N, število vezi $\pi$ in $\sigma$, preizkus s stopnjo nenasičenosti; prostornino $V(\mathrm{H_2})$ in SN produkta

:::formula
$\mathrm{SN} = \frac{2c + 2 + n - h - x}{2}$ (število obročev + vezi $\pi$). Sterična številka določa hibridizacijo; resonanca lahko spremeni hibridizacijo atoma z nevezanim parom.
:::

**Rešitev:**

1. Funkcionalne skupine: **fenolna** skupina $\mathrm{OH}$ na obroču, **aromatski** benzenov obroč in **amidna** skupina $\mathrm{{-}NH{-}CO{-}}$ (sekundarni amid).
2. Šest ogljikov obroča je $sp^2$ (vsak ima tri sosede), karbonilni ogljik je $sp^2$, metilni ogljik je $sp^3$. Skupaj $7$ ogljikov $sp^2$ in $1$ ogljik $sp^3$.
3. Dušik ima tri sosede in en nevezani par, zato bi po sterični številki pričakovali $sp^3$. Ker pa je nevezani par v resonanci s karbonilno skupino ($\mathrm{{-}NH{-}C({=}O){-}} \leftrightarrow \mathrm{{-}NH^+{=}C({-}O^-){-}}$), je dušik ravninski in ga opišemo kot $sp^2$; njegov par je v orbitali $p$.
4. Vezi $\pi$: tri v obroču (ena Kekuléjeva struktura) in ena v $\mathrm{C{=}O}$, skupaj $4$. Obroč je $1$.
5. Stopnja nenasičenosti: $\mathrm{SN} = \frac{2 \cdot 8 + 2 + 1 - 9}{2} = \frac{10}{2} = 5 = 4 + 1$. Ujema se.
6. Vezi $\sigma$: v obroču $6$ $\mathrm{C{-}C}$ in $4$ $\mathrm{C{-}H}$, nato $\mathrm{C{-}O}$, $\mathrm{O{-}H}$, $\mathrm{C{-}N}$ (obroč–dušik), $\mathrm{N{-}H}$, $\mathrm{N{-}C}$ (dušik–karbonilni ogljik), $\sigma$ v $\mathrm{C{=}O}$, $\mathrm{C{-}CH_3}$ in $3$ $\mathrm{C{-}H}$: $6 + 4 + 7 + 3 = 20$. Preizkus: v povezani molekuli je vezi $\sigma$ (število atomov $- 1$) + (število obročev) $= 20 - 1 + 1 = 20$.
7. Množina: $n = 1{,}512/151{,}2 = 0{,}0100\,\mathrm{mol}$. Hidrogenirajo se tri vezi $\pi$ obroča, zato $n(\mathrm{H_2}) = 3 \cdot 0{,}0100 = 0{,}0300\,\mathrm{mol}$ in $V = 0{,}0300 \cdot 22{,}4 = 0{,}672\,\mathrm{L}$.
8. Produkt $\mathrm{C_8H_{15}NO_2}$: $\mathrm{SN} = \frac{2 \cdot 8 + 2 + 1 - 15}{2} = 2$, to sta obroč in vez $\mathrm{C{=}O}$.
9. Odgovor: paracetamol ima fenolno skupino, aromatski obroč in amidno skupino; $7$ ogljikov je $sp^2$, metilni ogljik je $sp^3$, amidni dušik je zaradi resonance $sp^2$; molekula ima $4$ vezi $\pi$, $20$ vezi $\sigma$ in en obroč ($\mathrm{SN} = 5$). Hidrogeniranje porabi $0{,}672\,\mathrm{L}$ $\mathrm{H_2}$, produkt ima $\mathrm{SN} = 2$.

## Pogoste napake

- **Hibridizacija iz števila vezi namesto iz števila sosedov.** Ogljik v $\mathrm{C{=}O}$ ima štiri vezi, a le tri sosede, zato je $sp^2$, ne $sp^3$.
- **Pozabljeni nevezani pari.** Kisik v etanolu ima le dva soseda, a tudi dva nevezana para, zato je $sp^3$ in ne $sp$.
- **Dvojna vez kot dve enaki vezi.** Dvojna vez je ena $\sigma$ in ena $\pi$, ne dve $\sigma$. Vez $\pi$ je šibkejša in bolj reaktivna.
- **Resonanca kot ravnotežje.** Resonančne strukture niso molekule, ki bi se hitro pretvarjale druga v drugo. Puščica $\leftrightarrow$ ne pomeni ravnotežja (to je $\rightleftharpoons$). Obstaja ena sama struktura, hibrid.
- **Premikanje atomov pri resonanci.** Če premaknemo vodik ali spremenimo povezanost, dobimo drug izomer (tavtomer), ne resonančne strukture.
- **Zamenjava funkcionalnih skupin.** $\mathrm{R{-}CO{-}R'}$ je keton, $\mathrm{R{-}CHO}$ aldehid, $\mathrm{R{-}COO{-}R'}$ ester, $\mathrm{R{-}O{-}R'}$ eter. Fenol ni alkohol, ker je skupina $\mathrm{OH}$ vezana na aromatski ogljik in je bistveno bolj kisla.
- **Stopnja nenasičenosti s kisikom.** Kisik v formuli ne spremeni $\mathrm{SN}$; dušik ga poveča za $\frac{1}{2}$, halogen pa zmanjša kot vodik.

## Povzetek

- Ogljik tvori štiri vezi; formalni naboj $\mathrm{FN} = V - N - \frac{1}{2}B$.
- Sterična številka $4, 3, 2$ ustreza hibridizaciji $sp^3, sp^2, sp$ s koti $109{,}5^\circ; 120^\circ; 180^\circ$.
- Enojna vez je $\sigma$, dvojna $\sigma + \pi$, trojna $\sigma + 2\pi$; večkratne vezi so krajše in močnejše, okoli dvojne vezi ni prostega vrtenja.
- Resonančne strukture se razlikujejo le v legi elektronov $\pi$ in nevezanih parov; prava molekula je hibrid z delokaliziranimi elektroni in nižjo energijo (benzen, karboksilat, amid).
- Funkcionalne skupine določajo razred in reaktivnost; karbonilne spojine ločimo po skupinah na karbonilnem ogljiku.
- Stopnja nenasičenosti $\mathrm{SN} = \frac{2c + 2 + n - h - x}{2}$ = obroči + vezi $\pi$.

## Za izpit

Znati moraš povedati:

- natančne definicije: hibridna orbitala, sterična številka, vez $\sigma$ in vez $\pi$, resonančne strukture in resonančni hibrid, funkcionalna skupina;
- izpeljavo formalnega naboja $\mathrm{FN} = V - N - \tfrac{1}{2}B$;
- izpeljavo $\cos\theta = -1/\lambda$ iz ortogonalnosti hibridov in delež $s$ v $sp^3$, $sp^2$, $sp$;
- izpeljavo formule za stopnjo nenasičenosti in zakaj kisik nanjo ne vpliva;
- Hückelovo pravilo z vsemi pogoji in resonančno energijo benzena iz entalpij hidrogeniranja.

### Naloga 1

Entalpije hidrogeniranja do cikloheksana so: cikloheksen $-120\,\mathrm{kJ/mol}$, cikloheksa-1,3-dien $-232\,\mathrm{kJ/mol}$, benzen $-208\,\mathrm{kJ/mol}$. Izračunaj (a) resonančno energijo benzena glede na »cikloheksatrien« s tremi neodvisnimi dvojnimi vezmi, (b) konjugacijsko energijo cikloheksa-1,3-diena, (c) $\Delta H$ reakcije benzen $+ \mathrm{H_2} \to$ cikloheksa-1,3-dien in jo razloži, (d) toploto, ki se sprosti pri popolnem hidrogeniranju $3{,}91\,\mathrm{g}$ benzena ($M = 78{,}11\,\mathrm{g/mol}$).

**Rešitev:**

1. (a) Tri neodvisne dvojne vezi: $3 \cdot (-120) = -360\,\mathrm{kJ/mol}$. Benzen sprosti le $208\,\mathrm{kJ/mol}$, torej je za $360 - 208 = 152\,\mathrm{kJ/mol}$ stabilnejši.
2. (b) Dve neodvisni dvojni vezi: $2 \cdot (-120) = -240\,\mathrm{kJ/mol}$; dien sprosti $232\,\mathrm{kJ/mol}$, konjugacija ga stabilizira za $240 - 232 = 8\,\mathrm{kJ/mol}$. Stabilizacija benzena je torej mnogo večja od navadne konjugacije: to je aromatskost.
3. (c) Po Hessovem zakonu: benzen $\to$ cikloheksan ($-208$) je vsota benzen $\to$ dien ($\Delta H$) in dien $\to$ cikloheksan ($-232$). Torej $\Delta H = -208 - (-232) = +24\,\mathrm{kJ/mol}$.
4. Prva adicija je endotermna, ker poruši aromatski sistem; zato benzen ne adira tako lahko kot alkeni in raje reagira s substitucijo, ki aromatskost ohrani.
5. (d) $n = 3{,}91/78{,}11 = 0{,}0501\,\mathrm{mol}$, $Q = 0{,}0501 \cdot 208 = 10{,}4\,\mathrm{kJ}$.
6. Odgovor: resonančna energija benzena je $152\,\mathrm{kJ/mol}$, konjugacijska energija diena $8\,\mathrm{kJ/mol}$, prvi korak hidrogeniranja benzena ima $\Delta H = +24\,\mathrm{kJ/mol}$, pri hidrogeniranju $3{,}91\,\mathrm{g}$ benzena pa se sprosti $10{,}4\,\mathrm{kJ}$.

### Naloga 2

Natančno navedi Hückelovo pravilo in za vsak delec utemelji, ali je aromatski, antiaromatski ali nearomatski: ciklopentadienidni anion $\mathrm{C_5H_5^-}$, ciklobutadien $\mathrm{C_4H_4}$, piridin $\mathrm{C_5H_5N}$, ciklookta-1,3,5,7-tetraen $\mathrm{C_8H_8}$ (molekula ima obliko kadi).

**Rešitev:**

1. Pravilo: cikličen, ravninski, popolnoma konjugiran sistem s $4k + 2$ elektroni $\pi$ je aromatski, s $4k$ elektroni antiaromatski; če kateri od prvih treh pogojev ni izpolnjen, je nearomatski.
2. $\mathrm{C_5H_5^-}$: vseh pet ogljikov je $sp^2$, nevezani par aniona je v orbitali $p$. Elektronov $\pi$ je $4 + 2 = 6$ ($k = 1$): aromatski. Zato je ciklopentadien za ogljikovodik nenavadno kisel.
3. $\mathrm{C_4H_4}$: cikličen, ravninski, konjugiran, $4$ elektroni $\pi$ ($k = 1$ v $4k$): antiaromatski, zato zelo nestabilen.
4. Piridin: šest atomov $sp^2$, vsak prispeva en elektron $\pi$, skupaj $6$: aromatski. Nevezani par dušika je v hibridu $sp^2$ v ravnini obroča in ne šteje k sistemu $\pi$; zato je piridin baza.
5. $\mathrm{C_8H_8}$: $8$ elektronov $\pi$ bi dalo antiaromatski sistem, a molekula ni ravninska (kad), orbitale $p$ sosednjih dvojnih vezi se ne prekrivajo dobro. Je nearomatski in reagira kot navaden polien.
6. Odgovor: $\mathrm{C_5H_5^-}$ in piridin sta aromatska, ciklobutadien antiaromatski, ciklooktatetraen nearomatski.

## Drugače: Na sliki

**Eten** je ploščat, koti so $120^\circ$. Nad in pod ravnino sta »klobasici« gostote vezi $\pi$; zasuk konca za $90^\circ$ bi prekrivanje orbital $p$ prekinil. **Etin** je raven kot palica, dve pravokotni vezi $\pi$ tvorita valj gostote okoli osi. **Benzen** s krogom v šesterokotniku kaže obroč šestih elektronov $\pi$ nad in pod ravnino. **Diamant** je trda mreža ogljikov $sp^3$, **grafit** plasti ogljikov $sp^2$ z delokaliziranimi elektroni $\pi$, ki drsijo in prevajajo tok.

## Drugače: Uporaba v stroki

- **Spektroskopija IR.** Močnejša in krajša vez niha z višjo frekvenco: $\mathrm{C{-}H}$ na ogljiku $sp$ pri okoli $3300\,\mathrm{cm^{-1}}$, $sp^2$ nad $3000\,\mathrm{cm^{-1}}$, $sp^3$ pod $3000\,\mathrm{cm^{-1}}$; karbonil da močan trak pri okoli $1700\,\mathrm{cm^{-1}}$. Tako hitro preverimo funkcionalne skupine.
- **Določanje zgradbe.** Masna spektrometrija visoke ločljivosti da molekulsko formulo, iz nje stopnja nenasičenosti pove, koliko obročev in vezi $\pi$ mora imeti zgradba, ki jo nato potrdimo z NMR.
- **Biokemija in barvila.** Ravninska amidna vez omeji gibljivost beljakovinske verige na vrtenje okoli dveh vezi na ostanek; konjugacija (npr. $11$ dvojnih vezi v $\beta$-karotenu) premakne absorpcijo v vidno območje.

## Drugače: Korak za korakom s številkami

Akrilonitril $\mathrm{CH_2{=}CH{-}C{\equiv}N}$, $\mathrm{C_3H_3N}$:

1. $\mathrm{SN} = \frac{2 \cdot 3 + 2 + 1 - 3}{2} = 3$; obroča ni, torej so $3$ vezi $\pi$.
2. Vezi $\sigma$: $1 + 1 + 1 + 3 = 6$; $\pi$: $1 + 2 = 3$.
3. C1 in C2 sta $sp^2$, C3 in N sta $sp$; del $\mathrm{C2{-}C3{\equiv}N}$ je linearen, vsi atomi ležijo v eni ravnini.

## Drugače: Bolj natančno

**Teorija molekulskih orbital.** Hückelova metoda za benzen da šest MO $\pi$ z energijami $\alpha + 2\beta$, $\alpha + \beta$ (dvakrat), $\alpha - \beta$ (dvakrat) in $\alpha - 2\beta$; šest elektronov zapolni tri vezne orbitale. Najnižja orbitala je ena, višje so v parih, zato zaprto lupino da $4k + 2$ elektronov.

## Preveri se

? Kakšno hibridizacijo imata ogljikova atoma v etinu $\mathrm{HC{\equiv}CH}$?
- $sp^3$
~ $sp^3$ bi imel ogljik s štirimi sosedi; tu ima vsak ogljik le dva.
- $sp^2$
~ $sp^2$ ustreza trem sosedom, kot v etenu; v etinu ima ogljik dva.
+ $sp$
- $sp^3d$
~ Ogljik nima valenčnih orbital $d$ in ne preseže okteta.
> Vsak ogljik ima dva soseda (H in C) in nobenega nevezanega para, zato je sterična številka $2$ in hibridizacija $sp$; molekula je linearna.

? Koliko vezi $\sigma$ in koliko vezi $\pi$ ima etin $\mathrm{HC{\equiv}CH}$?
- $2\sigma$ in $3\pi$
~ Tudi trojna vez vsebuje eno vez $\sigma$; vezi $\pi$ sta v njej le dve.
+ $3\sigma$ in $2\pi$
- $5\sigma$ in $0\pi$
~ Med dvema atomoma je lahko le ena vez $\sigma$; ostali vezi trojne vezi sta $\pi$.
- $4\sigma$ in $1\pi$
~ Ena vez $\pi$ bi pomenila dvojno vez; trojna ima dve vezi $\pi$ in le eno $\sigma$.
> Dve vezi $\mathrm{C{-}H}$ sta $\sigma$, trojna vez je $1\sigma + 2\pi$. Skupaj $3\sigma$ in $2\pi$.

? Katera spojina je aldehid?
+ $\mathrm{CH_3CHO}$
- $\mathrm{CH_3COCH_3}$
~ Na karbonilnem ogljiku sta dve skupini $\mathrm{CH_3}$ in noben vodik: to je keton.
- $\mathrm{CH_3COOH}$
~ Na karbonilnem ogljiku je skupina $\mathrm{OH}$: to je karboksilna kislina.
- $\mathrm{CH_3OCH_3}$
~ Ta spojina nima karbonilne skupine; kisik povezuje dva ogljika: to je eter.
> Aldehid ima na karbonilnem ogljiku vsaj en vodik ($\mathrm{{-}CHO}$). $\mathrm{CH_3COCH_3}$ je keton, $\mathrm{CH_3COOH}$ karboksilna kislina, $\mathrm{CH_3OCH_3}$ eter.

? Katera trditev o benzenu je pravilna?
- Molekula hitro preskakuje med dvema Kekuléjevima strukturama.
~ Resonanca ni ravnotežje; obstaja ena sama molekula, resonančni hibrid.
- Benzen ima tri krajše in tri daljše vezi $\mathrm{C{-}C}$.
~ Tako bi bilo, če bi bila ena Kekuléjeva struktura prava; izmerjene vezi so vse enako dolge.
+ Vse vezi $\mathrm{C{-}C}$ so enako dolge, elektroni $\pi$ so delokalizirani po obroču.
- Ogljikovi atomi v benzenu so hibridizirani $sp^3$.
~ Vsak ogljik ima tri sosede (dva C in H), zato je $sp^2$ in ima orbitalo $p$ za sistem $\pi$.
> Benzen je resonančni hibrid; vse vezi so dolge $139\,\mathrm{pm}$, ogljiki so $sp^2$, molekula je ravninska. Kekuléjevi strukturi nista dejanski molekuli.

:::simboli
\mathrm{FN} | formalni naboj | \mathrm{FN} = V - N - \tfrac{1}{2}B | – |
V | število valenčnih elektronov prostega atoma | | – |
N | število nevezanih elektronov atoma | | – |
B | število elektronov v vezeh atoma | | – |
\mathrm{SN} | stopnja nenasičenosti | \mathrm{SN} = \frac{2c + 2 + n - h - x}{2} | – | število obročev + vezi π
c | število ogljikovih atomov | | – |
n | število dušikovih atomov | | – |
h | število vodikovih atomov | | – |
x | število halogenih atomov | | – |
\lambda | razmerje deleža p in s v hibridu sp^λ | | – | λ = 3, 2, 1 za sp³, sp², sp
\theta | kot med hibridnima orbitalama | \cos\theta = -\frac{1}{\lambda} | ° | 109,5°, 120°, 180°
s, p | atomski orbitali s in p | | |
\sigma | vez σ (prekrivanje vzdolž osi) | | |
:::
