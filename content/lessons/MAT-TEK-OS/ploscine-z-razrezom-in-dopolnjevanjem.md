---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Medicinska sestra meri rane tako, da nanje položi prozorno folijo z mrežo kvadratkov s stranico $1\,\text{cm}$ in obriše rob. Na isti foliji ima dve obrisani rani:

- rana A je kvadrat $4\,\text{cm} \times 4\,\text{cm}$,
- rana B je dolga poševna ureznina v obliki paralelograma, ki se razteza čez kar $14$ stolpcev mreže in je videti precej večja.

Zdravnik pravi, da sta rani **enako veliki**: obe imata ploščino $16\,\text{cm}^2$. Se ti zdi to narobe? Na koncu razlage boš znal to dokazati brez enega samega merjenja z ravnilom, samo z rezanjem in premikanjem.

Na tekmovanjih je veliko nalog z liki na mreži ali z liki, za katere ne poznaš formule. Rešiš jih z dvema trikoma: **razrezom** (lik razrežeš in dele premakneš) in **dopolnjevanjem** (lik dopolniš do pravokotnika in odšteješ, kar si dodal).

## Razlaga

**Mamljiva napačna ideja.** Najbolj preprosto se zdi prešteti vse kvadratke, ki jih obris rane B zajame vsaj malo. Pri rani B z oglišči v točkah $(0, 0)$, $(8, 0)$, $(14, 2)$ in $(6, 2)$ jih je $22$. To je več kot $16$, ker si vsak delno pokriti kvadratek štel kot celega. Na levem in desnem robu so le koščki kvadratkov in teh ne smeš šteti kot celih.

**Popravek 1: razrez in premik.** Ploščina je količina »papirja«, ki ga lik porabi. Če lik razrežeš na dele in jih zložiš drugače, papirja ni ne več ne manj. Veljata le dva pogoja: deli se **ne prekrivajo** in med njimi **ni lukenj**. Obseg se pri tem lahko spremeni, ploščina se ne.

Rano B razrežemo vzdolž navpične črte od oglišča $(6, 2)$ do točke $(6, 0)$. Levi kos je trikotnik, ki ga premaknemo za $8$ kvadratkov v desno, kjer natanko zapolni praznino pod desno poševno stranico. Dobimo pravokotnik z osnovnico $8\,\text{cm}$ in višino $2\,\text{cm}$, torej $16\,\text{cm}^2$, kot rana A.

:::premisli
Zgornjo stranico paralelograma premakneš še bolj v desno po isti vodoravni črti, spodnja ostane na mestu. Lik je videti še večji. Kaj se zgodi z obsegom in kaj s ploščino? Utemelji z osnovnico in višino.
---
Obseg se poveča, ker sta poševni stranici daljši. Ploščina ostane $16\,\text{cm}^2$: osnovnica in višina sta enaki. Pri zelo nagnjenem liku potrebuješ več rezov, a sestaviš isti pravokotnik $8 \times 2$.
:::

**Popravek 2: polovice.** Diagonala razdeli pravokotnik na dva skladna trikotnika. Zato je pravokotni trikotnik s katetama vzdolž mrežnih črt **polovica pravokotnika**: katetama $3$ in $2$ pripada ploščina $\dfrac{3 \cdot 2}{2} = 3$. Isto velja za vsak trikotnik, ki ima stranico na mrežni črti: je polovica pravokotnika z isto osnovnico in višino. Če višina pade na osnovnico, ga razreže na dva pravokotna trikotnika, vsak pa je polovica svojega pravokotnika.

**Popravek 3: dopolnjevanje.** Kaj pa trikotnik, katerega nobena stranica ne leži na mrežni črti? Okoli njega narišemo najmanjši pravokotnik po mrežnih črtah (**okvir**). Med likom in okvirom ostanejo pravokotni trikotniki v kotih, vsak je polovica majhnega pravokotnika. Diagram v besedah:

```
okvir (pravokotnik)
 − kotni trikotnik 1
 − kotni trikotnik 2
 − kotni trikotnik 3
 = iskani lik
```

Pri dopolnjevanju je ključno, da kotni trikotniki skupaj z likom natanko zapolnijo okvir: brez prekrivanja in brez lukenj, enako kot pri razrezu.

:::premisli
Kvadrat na mreži je nagnjen, njegova oglišča pa ležijo na stranicah okvira $4 \times 4$. Sošolec trdi, da tak kvadrat zaradi poševnih stranic pokrije več kot $16$ kvadratkov. Ima prav? Zakaj?
---
Ne more biti. Lik leži v celoti v okviru, zato je njegova ploščina okvir minus kotni trikotniki, torej manj kot $16$. Kotni trikotniki imajo vedno pozitivno ploščino.
:::

**Simulacija spodaj** (»Ploščine z razrezom«): izberi paralelogram in počasi premikaj drsnik. Opazuj, da odrezani trikotnik na drugi strani zapolni natanko praznino. Nato izberi trapez in opazi, da dva enaka trapeza sestavita paralelogram, zato je trapez **polovica** tega paralelograma.

**Preverjanje na mreži: Pickova formula.** Za mnogokotnik z oglišči v mrežnih točkah velja $p = N + \dfrac{R}{2} - 1$. **Mrežne točke** so presečišča mrežnih črt; $N$ je število mrežnih točk v notranjosti, $R$ pa število mrežnih točk na robu. Uporabna je za hitro preverjanje rezultata, ne kot glavna metoda: pri štetju točk se zlahka zmotiš.

## Rešeni primeri

### Primer 1 (lažji): nagnjena odrgnina

Odrgnina na kolenu ima na mrežni foliji obliko paralelograma z oglišči $(0, 0)$, $(5, 0)$, $(8, 3)$ in $(3, 3)$. En kvadratek meri $1\,\text{cm}^2$. Kolikšna je ploščina odrgnine?

**Podatki:** oglišča $(0, 0)$, $(5, 0)$, $(8, 3)$, $(3, 3)$; kvadratek $1\,\text{cm} \times 1\,\text{cm}$
**Iščemo:** ploščino $p$

:::formula
Razrez in premik: paralelogram $\to$ pravokotnik z isto osnovnico in višino, $p = a \cdot v$
:::

**Rešitev:**

1. Spodnja stranica leži na mrežni črti in meri $5\,\text{cm}$, zgornja je $3\,\text{cm}$ više.
2. Odrežemo trikotnik med točkama $(0, 0)$, $(3, 0)$ in $(3, 3)$ ter ga premaknemo za $5$ v desno; tam natanko zapolni praznino ob stranici od $(5, 0)$ do $(8, 3)$.
3. Dobimo pravokotnik $5\,\text{cm} \times 3\,\text{cm}$, zato $p = 5 \cdot 3 = 15$.
4. Odgovor: odrgnina ima ploščino $15\,\text{cm}^2$.

### Primer 2: opeklina brez stranice na mreži

Obris opekline je trikotnik z oglišči $A(0, 1)$, $B(5, 0)$ in $C(3, 4)$ na mreži s kvadratki $1\,\text{cm} \times 1\,\text{cm}$. Kolikšna je ploščina opekline?

**Podatki:** $A(0, 1)$, $B(5, 0)$, $C(3, 4)$; kvadratek $1\,\text{cm}^2$
**Iščemo:** ploščino trikotnika $ABC$

:::formula
Dopolnjevanje: $p = p_{\text{okvir}} - (p_1 + p_2 + p_3)$, kotni trikotnik s katetama $m$ in $n$ ima $\dfrac{m \cdot n}{2}$
:::

**Rešitev:**

1. Okvir: $x$ gre od $0$ do $5$, $y$ od $0$ do $4$. Ploščina okvira je $5 \cdot 4 = 20$.
2. Kotni trikotnik ob $AB$: kateti $5$ in $1$, ploščina $\dfrac{5 \cdot 1}{2} = 2{,}5$.
3. Kotni trikotnik ob $BC$: kateti $2$ in $4$, ploščina $\dfrac{2 \cdot 4}{2} = 4$.
4. Kotni trikotnik ob $CA$: kateti $3$ in $3$, ploščina $\dfrac{3 \cdot 3}{2} = 4{,}5$.
5. Odštejemo, ker smo te trikotnike dodali sami: $20 - (2{,}5 + 4 + 4{,}5) = 9$.
6. Preizkus s Pickovo formulo: na robu je $R = 6$ mrežnih točk, v notranjosti $N = 7$, torej $7 + 3 - 1 = 9$.
7. Odgovor: opeklina ima ploščino $9\,\text{cm}^2$.

### Primer 3 (težji): štiri trikotne gaze

Kvadratna gaza $ABCD$ ima stranico $10\,\text{cm}$. Medicinska sestra izbere točko $P$ v notranjosti gaze in jo razreže vzdolž daljic $PA$, $PB$, $PC$ in $PD$ na štiri trikotnike. Trikotnik ob stranici $AB$ ima ploščino $18\,\text{cm}^2$. Kolikšno ploščino ima trikotnik ob nasprotni stranici $CD$?

**Podatki:** kvadrat s stranico $a = 10\,\text{cm}$; $P$ v notranjosti; $p_{ABP} = 18\,\text{cm}^2$
**Iščemo:** $p_{CDP}$

:::formula
Polovice: $p_{ABP} + p_{CDP} = \dfrac{a \cdot v_1}{2} + \dfrac{a \cdot v_2}{2} = \dfrac{a \cdot a}{2}$, ker je $v_1 + v_2 = a$
:::

**Rešitev:**

1. Višina trikotnika $ABP$ je razdalja $v_1$ od $P$ do $AB$, višina trikotnika $CDP$ je razdalja $v_2$ od $P$ do $CD$.
2. Ker sta $AB$ in $CD$ nasprotni stranici, je $v_1 + v_2 = 10\,\text{cm}$, kjerkoli je $P$.
3. Zato skupaj merita polovico kvadrata: $\dfrac{10 \cdot 10}{2} = 50$.
4. Odštejemo znani del: $50 - 18 = 32$.
5. Odgovor: trikotnik ob stranici $CD$ ima ploščino $32\,\text{cm}^2$. Lega točke $P$ ni pomembna.

### Primer 4 – zdaj ti: poševno nalepljen obliž

Kvadraten obliž je nalepljen poševno. Na mrežni foliji ima oglišča $(1, 0)$, $(4, 1)$, $(3, 4)$ in $(0, 3)$. Kolikšna je njegova ploščina?

**Podatki:** oglišča $(1, 0)$, $(4, 1)$, $(3, 4)$, $(0, 3)$; kvadratek $1\,\text{cm}^2$
**Iščemo:** ploščino obliža

:::formula
Dopolnjevanje: okvir minus štirje kotni trikotniki
:::

**Rešitev:**

1. Okvir: $x$ in $y$ gresta od $0$ do $4$, torej $4 \cdot 4 = 16$.
2. Vsi štirje kotni trikotniki imajo kateti $3$ in $1$, vsak ima ploščino $\dfrac{3 \cdot 1}{2} = 1{,}5$.
3. Odštej sam in zapiši odgovor.

:::premisli
Kolikšna je ploščina obliža?
---
$16 - 4 \cdot 1{,}5 = 16 - 6 = 10$, torej $10\,\text{cm}^2$. Ploščina ni kvadrat celega števila, zato stranica obliža ni celo število centimetrov.
:::

## Pogoste napake

- **Štetje vseh dotaknjenih kvadratkov.** »Lik se dotika $22$ kvadratkov, torej ima ploščino $22$.« Delni kvadratki niso celi, zato je tako štetje vedno preveliko. Popravek: razreži ali dopolni, da dobiš samo cele kvadratke in polovice pravokotnikov.
- **Enak obseg pomeni enako ploščino (ali obratno).** Pri razrezu in premiku se obseg spremeni, ploščina pa ne. Poševna ureznina B ima večji obseg kot kvadratna rana A, a enako ploščino. Popravek: ploščino in obseg vedno računaj ločeno.
- **Pozabljena polovica.** Kotni trikotnik s katetama $5$ in $1$ vzameš kot $5$ namesto $2{,}5$. Potem odšteješ preveč in dobiš premajhno (lahko celo negativno) ploščino. Popravek: vsak kotni trikotnik je *polovica* pravokotnika.
- **Poševna stranica kot višina.** Pri paralelogramu pomnožiš osnovnico s poševno stranico. Višina je navpična razdalja med vzporednima stranicama. Popravek: višino preberi kot število vrstic mreže med stranicama.
- **»Brez lege točke se ne da.«** V Primeru 3 se zdi, da je odgovor odvisen od lege $P$. Vsota višin do nasprotnih stranic je stalna, zato je tudi vsota ploščin stalna.

## Povzetek

- Razrez in premik ohranita ploščino, če se deli ne prekrivajo in ni lukenj; obseg se pri tem lahko spremeni.
- Paralelogram z razrezom postane pravokotnik: $p = a \cdot v$. Trikotnik in trapez sta polovici paralelograma.
- Pravokotni trikotnik s katetama po mrežnih črtah je polovica pravokotnika: $\dfrac{m \cdot n}{2}$.
- Dopolnjevanje: okvir po mrežnih črtah minus kotni trikotniki.
- Točka $P$ v pravokotniku: trikotnika ob nasprotnih stranicah imata skupaj polovico ploščine pravokotnika.
- Preverjanje na mreži: $p = N + \dfrac{R}{2} - 1$.
- Nikoli ne štej delnih kvadratkov kot celih.

## Drugače: Kot zgodba

Dermatologinja Maja dobi na oddelek pacienta z opeklino nenavadne oblike. Ravnila nima pri roki, le mrežno folijo. Obriše opeklino in vidi trikotnik, ki ga mreža seka po vseh straneh.

Najprej poskusi šteti kvadratke, pa se hitro zaplete: kaj s tistimi, ki so pokriti le do tretjine? Zato spremeni načrt. Okoli trikotnika s svinčnikom nariše najmanjši pravokotnik po črtah mreže, $5$ kvadratkov širok in $4$ visok, torej $20$ kvadratkov.

Med trikotnikom in pravokotnikom ostanejo trije pravokotni trikotniki, vsak v svojem kotu. Za vsakega ve, da je pol pravokotnika: $2{,}5$; $4$ in $4{,}5$ kvadratka. Skupaj $11$. Ostane $20 - 11 = 9$. V kartoteko zapiše $9\,\text{cm}^2$, ne da bi štela en sam delni kvadratek.

## Drugače: Korak za korakom s številkami

Trikotnik z oglišči $(0, 0)$, $(6, 2)$ in $(2, 5)$:

1. Najmanjši in največji $x$: $0$ in $6$, širina okvira $6$.
2. Najmanjši in največji $y$: $0$ in $5$, višina okvira $5$.
3. Okvir: $6 \cdot 5 = 30$.
4. Stranica od $(0, 0)$ do $(6, 2)$: razlika $6$ in $2$, kotni trikotnik $\dfrac{6 \cdot 2}{2} = 6$.
5. Stranica od $(6, 2)$ do $(2, 5)$: razlika $4$ in $3$, kotni trikotnik $\dfrac{4 \cdot 3}{2} = 6$.
6. Stranica od $(2, 5)$ do $(0, 0)$: razlika $2$ in $5$, kotni trikotnik $\dfrac{2 \cdot 5}{2} = 5$.
7. Vsota kotnih trikotnikov: $6 + 6 + 5 = 17$.
8. Ploščina: $30 - 17 = 13$.

Ko je eno oglišče v kotu okvira, so kotni trikotniki natanko trije. Če se lik okvira dotika drugače, nariši sliko in preveri, ali morda ostane še majhen pravokotnik, ki ga moraš prav tako odšteti.

## Preveri se

? Kaj pri ploščinah pomeni **dopolnjevanje**?
- Lik razrežemo na dele in jih zložimo v pravokotnik.
~ To je razrez in premik. Pri dopolnjevanju ne režemo lika, ampak mu dodamo dele.
+ Lik obdamo s pravokotnikom po mrežnih črtah in od njegove ploščine odštejemo dodane dele.
- Preštejemo vse kvadratke, ki se jih lik dotika.
~ To štetje šteje delne kvadratke kot cele in da preveliko ploščino.
> Dopolnimo do znanega lika (okvira) in odštejemo, kar smo dodali; kotni trikotniki so polovice pravokotnikov.

? Uredi like po ploščini od najmanjše do največje. A: paralelogram z osnovnico $4$ in višino $3$. B: trikotnik z osnovnico $4$ in višino $5$. C: kvadrat $4 \times 4$, od katerega odrežemo kotni trikotnik s katetama $3$ in $3$.
- C, A, B
~ Pri B si pozabil deliti z $2$ ($4 \cdot 5 = 20$). Trikotnik je polovica pravokotnika.
+ B, C, A
- C, B, A
~ Pri C si odrezal cel kvadrat $3 \times 3$ ($16 - 9 = 7$) namesto polovice. Kotni trikotnik ima $\dfrac{3 \cdot 3}{2} = 4{,}5$.
> B: $\dfrac{4 \cdot 5}{2} = 10$; C: $16 - 4{,}5 = 11{,}5$; A: $4 \cdot 3 = 12$.

? Dva enaka trapeza z osnovnicama $6$ in $2$ ter višino $3$ zložimo (drugega zasukanega) v paralelogram. Kolikšna je ploščina enega trapeza?
- $24$
~ To je ploščina paralelograma z osnovnico $6 + 2 = 8$ in višino $3$. Trapez je njegova polovica.
+ $12$
- $18$
~ Vzel si samo daljšo osnovnico ($6 \cdot 3$). Paralelogram iz dveh trapezov ima osnovnico $6 + 2$.
- $9$
~ To je trikotnik z osnovnico $6$ in višino $3$. Trapez ima še krajšo osnovnico $2$, ki jo moraš prišteti.
> Paralelogram meri $(6 + 2) \cdot 3 = 24$, trapez je njegova polovica: $12$.

? Trikotnik ima oglišča $(0, 0)$, $(4, 1)$ in $(1, 3)$. Kolikšna je njegova ploščina?
- $12$
~ To je ploščina okvira $4 \times 3$. Odšteti moraš še kotne trikotnike.
- $7$
~ Odštel si le dva kotna trikotnika. Okoli trikotnika so trije.
+ $5{,}5$
- $6{,}5$
~ To je vsota kotnih trikotnikov, ki jih odštejemo, ne ploščina lika.
> Okvir $4 \cdot 3 = 12$, kotni trikotniki $2 + 3 + 1{,}5 = 6{,}5$, ploščina $12 - 6{,}5 = 5{,}5$.

? Pravokotnik $ABCD$ meri $8\,\text{cm} \times 6\,\text{cm}$ ($AB = 8\,\text{cm}$). Točka $P$ leži nekje na stranici $CD$. Kolikšna je ploščina trikotnika $ABP$?
- Ne da se izračunati, ker ne vemo, kje je $P$.
~ Višina na $AB$ je vedno $6\,\text{cm}$, kjerkoli na $CD$ je $P$.
- $48\,\text{cm}^2$
~ To je ploščina celega pravokotnika. Trikotnik z isto osnovnico in višino je polovica.
+ $24\,\text{cm}^2$
- $12\,\text{cm}^2$
~ Delil si dvakrat. Trikotnik je polovica pravokotnika, ne četrtina.
> $p = \dfrac{8 \cdot 6}{2} = 24\,\text{cm}^2$, ne glede na lego $P$ na $CD$.

:::simboli
p | ploščina lika | p = a \cdot v | | p = a · v velja za paralelogram
a | osnovnica (stranica kvadrata) | | |
v | višina na osnovnico | | |
p_{\text{okvir}} | ploščina okvirnega pravokotnika | | |
p_1, p_2, p_3 | ploščine odrezanih kotnih trikotnikov | | |
m, n | kateti kotnega trikotnika | | |
p_{ABP} | ploščina trikotnika ABP | | |
p_{CDP} | ploščina trikotnika CDP | | |
v_1 | razdalja točke P od stranice AB | | |
v_2 | razdalja točke P od stranice CD | | | v₁ + v₂ = a
:::
