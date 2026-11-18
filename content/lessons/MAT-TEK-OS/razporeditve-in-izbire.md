---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Pet članov šolskega benda se pred koncertom pozdravi. Vsak vsakemu enkrat seže v roko. Koliko je stiskov rok?

Ob koncu koncerta publika zahteva dodatek. Bend ima pripravljenih pet pesmi, za dodatek pa bosta dovolj dve. Koliko je izbir para pesmi?

Situaciji sta videti različni, a v obeh je odgovor $10$. V obeh namreč iz petih stvari izbereš dve in ti je vseeno, katera je prva. Kdor to prepozna, reši obe nalogi z istim računom. Ista ideja se v tekmovalnih nalogah skriva še v štetju premic skozi točke, tekem »vsak z vsakim« in komisij.

## Razlaga

**Razpored na mestih.** Bend ima tri pesmi: A, B in C. Na seznamu za koncert so tri prosta mesta:

```
 1. mesto   2. mesto   3. mesto
   ___        ___        ___
   3    ·     2     ·    1
```

Na prvo mesto gre katera koli od treh pesmi. Na drugo ena od preostalih dveh. Za tretje ostane ena sama. Po pravilu produkta je seznamov $3 \cdot 2 \cdot 1 = 6$: ABC, ACB, BAC, BCA, CAB, CBA.

Vsaki taki razvrstitvi vseh elementov v vrsto rečemo **permutacija**. Pri $n$ elementih je permutacij $n \cdot (n - 1) \cdots 2 \cdot 1$. Ta zmnožek krajše zapišemo $n!$ in beremo »$n$ fakulteta«.

| $n$ | $n!$ |
|---|---|
| $3$ | $6$ |
| $4$ | $24$ |
| $5$ | $120$ |
| $6$ | $720$ |

:::premisli
Tabela kaže, da je $720$ natanko šestkrat več kot $120$. Zakaj ravno šestkrat? Razloži z mesti na seznamu, ne z računom.
---
Nova pesem lahko stoji na katerem koli od $6$ mest, preostalih pet pa se razporedi na $120$ načinov: $6 \cdot 120 = 720$.
:::

**Samo nekaj mest.** Na šolskem pevskem tekmovanju nastopa $8$ pevcev, nagrade pa so tri: zlata, srebrna in bronasta. Mesta so tri, kandidatov osem:

```
  zlato    srebro    bron
   ___      ___      ___
    8   ·    7   ·    6
```

Razvrstitev za stopničke je $8 \cdot 7 \cdot 6 = 336$. Množimo le toliko faktorjev, kolikor je mest.

**Ko vrstni red ne šteje.** Zdaj iz $4$ pesmi A, B, C, D izberi $2$ za dodatek, ne da bi določil, katera bo prva. Najprej preštej urejene pare: $4 \cdot 3 = 12$. Nato jih uredi v tabelo, kjer je v isti vrstici isti par pesmi. Zavita oklepaja $\{\ \}$ pomenita, da vrstni red v paru ne šteje:

| izbrani par | en vrstni red | drugi vrstni red |
|---|---|---|
| $\{A, B\}$ | AB | BA |
| $\{A, C\}$ | AC | CA |
| $\{A, D\}$ | AD | DA |
| $\{B, C\}$ | BC | CB |
| $\{B, D\}$ | BD | DB |
| $\{C, D\}$ | CD | DC |

Vsak par se pojavi v dveh vrstnih redih. Izbir brez vrstnega reda je zato $12 : 2 = 6$.

Pri treh pesmih od osmih je urejenih trojic $336$, enako kot razvrstitev na stopničkah ($8 \cdot 7 \cdot 6$). Skupin brez vrstnega reda je $336 : 6 = 56$.

Skupini $k$ elementov, izbrani iz $n$ elementov brez vrstnega reda, rečemo **kombinacija**. Njihovo število zapišemo $\binom{n}{k}$ in beremo »$n$ nad $k$«:

$$\binom{n}{k} = \frac{n \cdot (n - 1) \cdots (n - k + 1)}{k!}$$

V števcu je toliko faktorjev, kolikor jih je v imenovalcu.

:::premisli
Zakaj smo zgoraj $336$ delili s $6$ in ne s $3$, čeprav smo izbrali tri pesmi?
---
Ker se ista trojica v seznamu urejenih trojic pojavi $3! = 3 \cdot 2 \cdot 1 = 6$-krat, ne trikrat. Na primer A, B, C kot ABC, ACB, BAC, BCA, CAB, CBA.
:::

V simulaciji spodaj (»Razporeditve in izbire«) nastavi $n = 4$ in $k = 2$. Vklopi in izklopi stikalo »vrstni red je pomemben« ter opazuj, kako se $12$ ploščic zmanjša na $6$: pari AB in BA se zlijejo v enega.

**Štetje po dopolnilu.** Bobnar sestavlja ritem iz $4$ udarcev. Vsak udarec je boben ali činela. Koliko ritmov ima *vsaj eno* činelo? Narišimo vse ritme kot pravokotnik:

```
+-------------------------------------+
|   vsi ritmi: 2 · 2 · 2 · 2 = 16     |
|   +--------------------------+      |
|   |  brez činele: 1 ritem    |      |
|   +--------------------------+      |
|   ostanek = vsaj ena činela         |
+-------------------------------------+
```

Ritmov z vsaj eno činelo je $16 - 1 = 15$. Kadar je v vprašanju »vsaj en« ali »ne vsi enaki«, je pogosto lažje prešteti nasprotno (**dopolnilo**) in ga odšteti od vseh možnosti.

## Rešeni primeri

### Primer 1 (lažji): fotografija benda

Pet glasbenikov se postavi v vrsto za fotografijo. Pevka mora stati na sredini. Na koliko načinov se lahko postavijo?

**Podatki:** $5$ glasbenikov v vrsti, pevka na $3.$ mestu
**Iščemo:** število razporeditev

:::formula
Permutacije preostalih: $4! = 4 \cdot 3 \cdot 2 \cdot 1$
:::

**Rešitev:**

1. Pevka ima mesto določeno, zato zanjo obstaja $1$ možnost.
2. Ostali štirje se razporedijo na štiri prosta mesta. To je permutacija štirih: $4 \cdot 3 \cdot 2 \cdot 1 = 24$.
3. Odgovor: glasbeniki se lahko postavijo na $24$ načinov.

### Primer 2: pesmi za prireditev

Zbor ima pripravljenih $7$ pesmi. Za šolsko prireditev izbere $3$, vrstni red pa bo določil šele pozneje. Koliko je izbir? Koliko bi jih bilo, če bi hkrati določil tudi vrstni red?

**Podatki:** $n = 7$ pesmi, izbranih $k = 3$; najprej vrstni red ni pomemben, nato je
**Iščemo:** število izbir brez vrstnega reda in z njim

:::formula
$\binom{7}{3} = \dfrac{7 \cdot 6 \cdot 5}{3 \cdot 2 \cdot 1}$
:::

**Rešitev:**

1. Urejene trojice: $7 \cdot 6 \cdot 5 = 210$. To je že odgovor na drugo vprašanje.
2. Vsaka skupina treh pesmi se med urejenimi trojicami pojavi $3 \cdot 2 \cdot 1 = 6$-krat.
3. Skupin je zato $210 : 6 = 35$.
4. Odgovor: izbir brez vrstnega reda je $35$, z vrstnim redom pa $210$.

### Primer 3 (težji): žirija z vsaj enim učiteljem

Glasbena šola izbira tričlansko žirijo izmed $5$ učiteljic in $4$ učiteljev. V žiriji mora biti vsaj en učitelj. Koliko je različnih žirij?

**Podatki:** $5$ učiteljic, $4$ učitelji, žirija ima $3$ člane, vsaj en učitelj; vloge v žiriji so enake
**Iščemo:** število žirij

:::formula
Dopolnilo: vse žirije $-$ žirije brez učitelja $= \binom{9}{3} - \binom{5}{3}$
:::

**Rešitev:**

1. Vloge so enake, zato vrstni red ni pomemben in štejemo kombinacije.
2. Vseh žirij iz $9$ ljudi je $\dfrac{9 \cdot 8 \cdot 7}{3 \cdot 2 \cdot 1} = 84$.
3. Nasprotje od »vsaj en učitelj« je »same učiteljice«: $\dfrac{5 \cdot 4 \cdot 3}{3 \cdot 2 \cdot 1} = 10$.
4. Odštejemo: $84 - 10 = 74$.
5. Odgovor: različnih žirij je $74$.

### Primer 4 – zdaj ti: melodija s ponovljenim tonom

Skladatelj sestavlja melodijo iz $4$ zaporednih tonov. Vsak ton izbere izmed $7$ tonov lestvice (do, re, mi, fa, sol, la, ti), tone sme ponavljati. Koliko melodij ima vsaj en ton, ki se ponovi?

**Podatki:** $4$ toni v vrsti, $7$ tonov na izbiro, ponavljanje dovoljeno
**Iščemo:** število melodij, v katerih se kakšen ton ponovi

:::formula
Dopolnilo: vse melodije $-$ melodije z različnimi toni
:::

**Rešitev:**

1. Vse melodije: vsak od $4$ tonov ima $7$ možnosti, torej $7 \cdot 7 \cdot 7 \cdot 7 = 2401$.
2. Nasprotje od »vsaj en ton se ponovi« je »vsi štirje toni so različni«. Preštej te melodije in jih odštej.

:::premisli
Koliko melodij ima štiri različne tone in koliko melodij ima ponovljen ton?
---
Različni toni: $7 \cdot 6 \cdot 5 \cdot 4 = 840$. Melodij s ponovljenim tonom je $2401 - 840 = 1561$.
:::

## Pogoste napake

- **Vrstni red tam, kjer ga ni.** Pri žiriji treh enakopravnih članov nekateri računajo $9 \cdot 8 \cdot 7 = 504$. Tako vsako žirijo šteješ šestkrat. Vprašaj se: ali bi zamenjava dveh izbranih dala nov izid? Če ne, deli s $k!$.
- **Deljenje s $k$ namesto s $k!$.** Pri treh pesmih od osmih nekdo računa $336 : 3 = 112$. Toda ista trojica ima $3 \cdot 2 \cdot 1 = 6$ vrstnih redov, ne $3$. Pravilno je $56$.
- **»Najprej izberem enega, nato poljubna dva.«** Za žirijo z vsaj enim učiteljem nekdo izbere učitelja ($4$ načini) in nato poljubna dva od ostalih osmih ($28$ načinov), torej $4 \cdot 28 = 112$. Žirijo z dvema učiteljema tako šteje dvakrat, ker je vsak od njiju lahko »prvi«, žirijo s tremi učitelji pa trikrat. Uporabi dopolnilo.
- **Napačno dopolnilo.** Nasprotje od »vsaj en učitelj« ni »natanko en učitelj«, ampak »nobenega učitelja«. Preden odšteješ, zapiši nasprotno trditev v celem stavku.
- **Fakulteta kot vsota.** $5!$ ni $5 + 4 + 3 + 2 + 1 = 15$, ampak $5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 120$.

## Povzetek

- **Permutacije:** $n$ različnih elementov razporedimo v vrsto na $n! = n \cdot (n - 1) \cdots 1$ načinov.
- **Razporedi na $k$ mest** od $n$ kandidatov: $n \cdot (n - 1) \cdots (n - k + 1)$, toliko faktorjev, kolikor je mest.
- **Kombinacije (izbira brez vrstnega reda):** urejene izbire delimo s $k!$, ker ima vsaka skupina $k!$ vrstnih redov: $\binom{n}{k} = \dfrac{n(n-1)\cdots(n-k+1)}{k!}$.
- Odločilno vprašanje: ali zamenjava dveh izbranih da nov izid? Da → razporeditev, ne → kombinacija.
- **Dopolnilo:** pri »vsaj en« ali »ne vsi« preštej vse in odštej nasprotne primere.
- Stiski rok med $n$ ljudmi, tekme »vsak z vsakim«, premice skozi $n$ točk (nobene tri na isti premici): vse so $\binom{n}{2}$.

## Drugače: Z analogijo

Predstavljaj si dve vrsti fotografij.

**Fotografija na stopničkah** ima levo, sredino in desno. Če zamenjaš dva človeka, dobiš drugo sliko. Taka je razporeditev: šteje, kdo stoji kje.

**Skupinski selfie v dvigalu** pa je le gneča. Kdo je bližje kameri, ni pomembno. Pomembno je samo, kdo je na sliki. Taka je kombinacija.

Vsak selfie skupine treh ljudi lahko »razstaviš« na $3! = 6$ fotografij na stopničkah. Zato je selfijev šestkrat manj kot fotografij na stopničkah. Ko pri nalogi ne veš, ali deliti, si predstavljaj, katero fotografijo slikaš.

## Drugače: Iz vsakdanjega življenja

- **Pica:** v picerijah izbiraš $3$ dodatke izmed $8$. Šunka, gobe, olive so ista pica kot olive, šunka, gobe. Pic je $\dfrac{8 \cdot 7 \cdot 6}{3 \cdot 2 \cdot 1} = 56$.
- **Liga:** v ligi s $6$ ekipami vsaka igra z vsako enkrat. Tekem je $\dfrac{6 \cdot 5}{2} = 15$, ker je tekma A proti B ista kot B proti A.
- **Razpored za tablo:** šest učencev se dogovori, kdo bo od ponedeljka do petka brisal tablo, vsak dan drug. Dnevi so različni, zato je vrstni red pomemben: $6 \cdot 5 \cdot 4 \cdot 3 \cdot 2 = 720$ razporedov.
- **Geslo:** štirimestna PIN-koda z vsaj eno ničlo: vseh kod je $10\,000$, kod brez ničle $9 \cdot 9 \cdot 9 \cdot 9 = 6561$, kod z ničlo pa $10\,000 - 6561 = 3439$.

## Preveri se

? Pri kateri nalogi gre za izbiranje brez vrstnega reda?
- Bend določi, v kakšnem zaporedju bo zaigral $4$ pesmi.
~ Zaporedje pesmi je razporeditev: ABCD in BACD sta različna koncerta.
+ Šola kupi $3$ nove inštrumente izmed $7$ ponujenih.
- Žirija podeli zlato, srebrno in bronasto priznanje.
~ Priznanja so različna, zato zamenjava dveh nagrajencev da nov izid. Vrstni red je pomemben.
> Kupljeni inštrumenti so le skupina: kitara, bas in boben so isti nakup kot boben, kitara in bas.

? Razvrsti od najmanjšega do največjega: $A$ = število vrstnih redov $4$ pesmi, $B$ = število izbir $2$ pesmi od $6$ brez vrstnega reda, $C$ = število trimestnih kod iz števk $1$, $2$, $3$, ki se smejo ponavljati.
- $A < B < C$
~ $A = 4! = 24$, ni $4$. Fakulteta hitro raste.
+ $B < A < C$
- $B < C < A$
~ Pri $C$ ima vsako od treh mest po $3$ možnosti: $3 \cdot 3 \cdot 3 = 27$, kar je več kot $24$.
> $B = \dfrac{6 \cdot 5}{2} = 15$, $A = 4 \cdot 3 \cdot 2 \cdot 1 = 24$, $C = 3 \cdot 3 \cdot 3 = 27$.

? Kaj se zgodi s številom vrstnih redov, ko seznamu $5$ pesmi dodaš šesto?
- Poveča se za $6$.
~ Nova pesem ne doda le šestih seznamov: vsak star seznam se razcepi na $6$ novih, ker gre nova pesem na katero koli od $6$ mest.
- Podvoji se.
~ Nova pesem ima $6$ možnih mest, ne $2$. Faktor je $6$.
+ Pomnoži se s $6$.
> $6! = 6 \cdot 5! = 6 \cdot 120 = 720$.

? Na vaji se $8$ glasbenikov pozdravi tako, da vsak vsakemu enkrat seže v roko. Koliko je stiskov rok?
- $64$
~ $8 \cdot 8$ šteje tudi stisk s samim seboj in vsak par dvakrat.
- $56$
~ $8 \cdot 7$ šteje vsak stisk dvakrat: Ana–Bor in Bor–Ana sta isti stisk. Deli z $2$.
+ $28$
> To je izbira $2$ od $8$ brez vrstnega reda: $\dfrac{8 \cdot 7}{2} = 28$.

? Ritem ima $5$ udarcev. Vsak je udarec bobna (B) ali premor (P). Koliko ritmov ima vsaj dva udarca bobna?
- $31$
~ Odštel si samo ritem brez B. Pozabil si odšteti še $5$ ritmov z natanko enim B.
- $10$
~ To so ritmi z *natanko* dvema B. »Vsaj dva« vključuje tudi tri, štiri in pet.
+ $26$
- $32$
~ To so vsi ritmi. Odšteti moraš tiste z manj kot dvema B.
> Vseh ritmov je $2^5 = 32$. Brez B je $1$, z enim B $5$. Ostane $32 - 1 - 5 = 26$.

:::simboli
n | število vseh elementov | | |
k | število izbranih elementov | | | k ≤ n
:::
