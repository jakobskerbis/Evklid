---
stanje: osnutek
demo: simetrija
avtor: AI
---

## Zakaj se tega učimo

Ana v trgovini z oblačili pomerja jakno in v ogledalu garderobe pogleda listek s ceno. Napis $49\,€$ je v ogledalu obrnjen. Slika listka je enako velika kot listek in se zdi toliko za ogledalom, kolikor je listek pred njim. Za pultom prodajalec zlaga majico: prepogne jo po sredini in levi rokav se natančno prekrije z desnim.

Prizora sta videti različna, skrivata pa isto idejo. V obeh je ena črta (ogledalo, pregib). Vsaka točka ima na drugi strani črte svoj par, ki je od črte enako daleč kot točka sama. Temu v matematiki rečemo **zrcaljenje čez premico**. Majica, ki se ob pregibu prekrije sama s seboj, je **simetričen lik**.

Zrcaljenje potrebuješ, ko rišeš vzorec ali logotip, ki mora biti na obeh straneh enak, in ko preverjaš, ali je lik pravilno narisan. Pomagata ti pravokotnica in simetrala daljice iz osnovnih konstrukcij.

## Razlaga

**1. Kaj kaže slika.** Na kvadratni mreži je navpična premica $o$. Levo od nje je trikotnik $ABC$, desno njegova zrcalna slika $A'B'C'$ (beremo »A črtica, B črtica, C črtica«).

:::risba skica
opis: Kvadratna mreža z navpično osjo o na sredini. Levo od osi je trikotnik ABC: A je 4 kvadratke levo od osi, B 1 kvadratek, C 3 kvadratke. Desno je zrcalna slika A'B'C': A' je 4 kvadratke desno od osi, B' 1 kvadratek, C' 3 kvadratke, vsaka v isti vrstici kot izvirnik. Črtkane vodoravne daljice AA', BB' in CC' sekajo os pod pravim kotom.
območje: 0; 0 .. 10; 5
mreža: da
črta: 5; 0 -> 5; 5 | debelo
črta: 1; 1 -> 9; 1 | črtkano
črta: 4; 2 -> 6; 2 | črtkano
črta: 2; 4 -> 8; 4 | črtkano
lik: 1; 1 -> 4; 2 -> 2; 4 | modra
lik: 9; 1 -> 6; 2 -> 8; 4 | oranžna
pravikot: 5; 1 | 9; 1 | 5; 2
točka: 1; 1 | A | pod
točka: 4; 2 | B | desno
točka: 2; 4 | C | nad
točka: 9; 1 | A' | pod
točka: 6; 2 | B' | levo
točka: 8; 4 | C' | nad
napis: 5; 4,7 | o | desno
:::

Preštej kvadratke. Oglišče $A$ je $4$ kvadratke levo od osi, $A'$ pa $4$ kvadratke desno, v isti vrstici. Pri $B$ in $B'$ je razdalja do osi $1$ kvadratek, pri $C$ in $C'$ pa $3$. Črtkane daljice $AA'$, $BB'$ in $CC'$ so vodoravne, os je navpična. Os jih seka pod pravim kotom, vsako točno na njeni sredini.

**2. Zrcaljenje točke.** Premici $o$ rečemo **os zrcaljenja**. Točka $A'$ je **zrcalna slika** točke $A$, če je os $o$ simetrala daljice $AA'$. To pomeni dvoje:

- daljica $AA'$ je **pravokotna** na os,
- os jo razpolovi, zato sta $A$ in $A'$ **enako daleč od osi**, vsaka na svoji strani.

Točka, ki leži na osi, je sama sebi slika: $A' = A$.

:::premisli
Oglišče $C$ premaknemo za $1$ kvadratek bliže osi, v isti vrstici. Kam se premakne $C'$? Koliko kvadratkov bo zdaj dolga daljica $CC'$?
---
Tudi $C'$ se premakne za $1$ kvadratek bliže osi, ker mora biti od nje enako daleč kot $C$. Obe točki sta zdaj $2$ kvadratka od osi, zato je $CC'$ dolga $2 + 2 = 4$ kvadratke namesto $6$.
:::

**3. Konstrukcija brez mreže.** Na praznem listu točko zrcalimo s pravokotnico:

1. Skozi $A$ konstruiraj pravokotnico na os $o$. Presečišče z osjo označi $F$.
2. Šestilo zapiči v $F$ in ga razpri do $A$.
3. Na drugi strani osi nariši lok. Kjer seka pravokotnico, je $A'$.

Lik zrcalimo oglišče za ogliščem. Slike nato povežemo v enakem vrstnem redu: $A'B'$, $B'C'$ in $C'A'$.

**4. Kaj se ohrani.** Zrcalna slika je **skladna** z izvirnikom: ima enako obliko in velikost. Ohranijo se dolžine stranic, velikosti kotov, obseg in ploščina. Spremenita se le lega in **smer obhoda**, to je smer, v kateri si oglišča sledijo, ko jih obhodimo po vrsti. Na sliki gre $A \to B \to C$ v nasprotni smeri urnega kazalca, $A' \to B' \to C'$ pa v smeri urnega kazalca. Zato je odsev leve rokavice videti kot desna rokavica.

**5. Simetrični liki.** Lik je **osno simetričen**, če obstaja premica, čez katero ga zrcalimo in dobimo spet isti lik. Taki premici rečemo **simetrijska os**. Če lik po njej prepogneš, se polovici natančno prekrijeta, kot rokava zložene majice. Lik ima lahko več osi ali nobene:

| Lik | Število osi |
|---|---|
| daljica | $2$ |
| kot | $1$ |
| raznostranični trikotnik | $0$ |
| enakokraki trikotnik | $1$ |
| enakostranični trikotnik | $3$ |
| pravokotnik | $2$ |
| kvadrat | $4$ |
| krog | neskončno |

Enakokraki trikotnik tu ni enakostraničen, pravokotnik pa ni kvadrat. Osi daljice sta njena simetrala in premica, na kateri leži. Os kota je njegova simetrala, os enakokrakega trikotnika simetrala osnovnice. Osi enakostraničnega trikotnika so simetrale vseh treh stranic. Osi pravokotnika gresta skozi sredini nasprotnih stranic, kvadrat ima poleg teh dveh še obe diagonali. Pri krogu je os vsaka premica skozi središče.

Tudi črke so liki. Črka **A** (brez okraskov) ima $1$ os, navpično. Črka **H** ima $2$ osi, črka **F** nobene.

:::premisli
Zakaj diagonala pravokotnika, ki ni kvadrat, ni njegova simetrijska os, diagonala kvadrata pa je?
---
Zrcaljenje ohrani dolžine. Čez diagonalo bi se daljša stranica preslikala na krajšo, kar ni mogoče, zato vogal po prepogibu štrli čez lik. Pri kvadratu sta stranici enako dolgi, zato se polovici prekrijeta.
:::

**6. Zapis s simboli.** Vrnimo se k zrcaljenju ene točke. Če je točka od osi oddaljena $d$, je njena slika od osi oddaljena $d' = d$. Razdalja med točko in sliko je dvakrat večja:

$$\lvert AA'\rvert = 2d$$

Za točko $A$ na sliki je $d = 4$ kvadratke, zato je $\lvert AA'\rvert = 2 \cdot 4 = 8$ kvadratkov.

**7. Poševna os.** Os je lahko tudi poševna. Razdaljo do nje še vedno merimo pravokotno na os, ne vodoravno. V simulaciji spodaj (**Zrcaljenje čez os in središčna simetrija**) izberi »Poševna os« in povleci točko $A$ čisto na os. Opazi, da se $A'$ združi z $A$ in da daljica $AA'$ ves čas ostaja pravokotna na os. Gumb »Središčna« kaže središčno simetrijo, ki se je boš učil pozneje.

## Rešeni primeri

### Primer 1 (lažji)

Oblikovalka riše simetričen logotip za trgovino s čevlji. Narisala je levo polovico, os je navpična. Konica pete, točka $A$, je od osi oddaljena $3\,\text{cm}$. Kje mora narisati njeno sliko $A'$ in kako daleč bo $A'$ od $A$?

**Podatki:** os $o$ je navpična; razdalja točke $A$ od osi $d = 3\,\text{cm}$
**Iščemo:** lego točke $A'$ in dolžino $\lvert AA'\rvert$

:::formula
$d' = d$ in $\lvert AA'\rvert = 2d$
:::

**Rešitev:**

1. Skozi $A$ potegne pravokotnico na os, ker leži $A'$ na njej.
2. Točko $A'$ nariše na drugi strani osi, $d' = 3\,\text{cm}$ od nje, ker sta točka in slika enako daleč od osi.
3. $\lvert AA'\rvert = 2 \cdot 3\,\text{cm} = 6\,\text{cm}$, ker sta na poti od $A$ do $A'$ dve enaki razdalji do osi.
4. Odgovor: $A'$ je na drugi strani osi, $3\,\text{cm}$ od nje, na pravokotnici skozi $A$; od $A$ je oddaljena $6\,\text{cm}$.

### Primer 2 (srednji)

Na levi polovici izložbe je nalepka v obliki trikotnika $ABC$. Na desno polovico želijo njeno zrcalno sliko čez navpično os $o$ (rob med polovicama). Oglišči $A$ in $C$ sta od osi oddaljeni $2\,\text{cm}$, oglišče $B$ pa $5\,\text{cm}$. Stranice merijo $\lvert AB\rvert = 3\,\text{cm}$, $\lvert AC\rvert = 4\,\text{cm}$ in $\lvert BC\rvert = 5\,\text{cm}$. Kako daleč od osi bodo oglišča slike, kako daleč bo vsako oglišče od svoje slike in koliko centimetrov traku potrebujejo za obrobo slike?

**Podatki:** $d_A = 2\,\text{cm}$, $d_B = 5\,\text{cm}$, $d_C = 2\,\text{cm}$; $\lvert AB\rvert = 3\,\text{cm}$, $\lvert AC\rvert = 4\,\text{cm}$, $\lvert BC\rvert = 5\,\text{cm}$; os je navpična, trikotnik je levo od nje
**Iščemo:** razdalje oglišč slike od osi, $\lvert AA'\rvert$, $\lvert BB'\rvert$, $\lvert CC'\rvert$ in obseg trikotnika $A'B'C'$

:::formula
$d' = d$, $\lvert XX'\rvert = 2d$ in $\lvert A'B'\rvert = \lvert AB\rvert$ (zrcaljenje ohranja dolžine)
:::

**Rešitev:**

1. Slike so desno od osi, enako daleč kot izvirniki: $A'$ in $C'$ po $2\,\text{cm}$, $B'$ $5\,\text{cm}$.
2. Razdalje do slik so dvojne: $\lvert AA'\rvert = 2 \cdot 2\,\text{cm} = 4\,\text{cm}$, $\lvert BB'\rvert = 2 \cdot 5\,\text{cm} = 10\,\text{cm}$, $\lvert CC'\rvert = 2 \cdot 2\,\text{cm} = 4\,\text{cm}$.
3. Zrcaljenje ohranja dolžine, zato ima slika stranice $3\,\text{cm}$, $4\,\text{cm}$ in $5\,\text{cm}$.
4. Obseg slike: $3\,\text{cm} + 4\,\text{cm} + 5\,\text{cm} = 12\,\text{cm}$, enako kot obseg izvirnika.
5. Odgovor: $A'$ in $C'$ sta $2\,\text{cm}$, $B'$ pa $5\,\text{cm}$ desno od osi; $\lvert AA'\rvert = \lvert CC'\rvert = 4\,\text{cm}$, $\lvert BB'\rvert = 10\,\text{cm}$. Za obrobo potrebujejo $12\,\text{cm}$ traku.

### Primer 3 (težji)

Na papirnati vrečki trgovine je simetričen logotip, os pa ni narisana. Točka $A$ in njena slika $A'$ sta $10\,\text{cm}$ narazen. Točka $T$ leži na osi in je od $A$ oddaljena $6\,\text{cm}$. Kako najdeš os? Kako daleč je $A$ od osi? Koliko meri $\lvert TA'\rvert$?

**Podatki:** $\lvert AA'\rvert = 10\,\text{cm}$; $T$ leži na osi; $\lvert TA\rvert = 6\,\text{cm}$
**Iščemo:** konstrukcijo osi, razdaljo $d$ točke $A$ od osi, dolžino $\lvert TA'\rvert$

:::formula
Os je simetrala daljice $AA'$. Vsaka točka simetrale je enako oddaljena od $A$ in $A'$: $\lvert TA'\rvert = \lvert TA\rvert$.
:::

**Rešitev:**

1. Os je simetrala daljice $AA'$, ker je tako določena zrcalna slika (razdelek 2). Narišemo loka z enakim polmerom okrog $A$ in $A'$, večjim od $10\,\text{cm} : 2 = 5\,\text{cm}$, npr. $7\,\text{cm}$, in povežemo presečišči.
2. Os razpolovi daljico $AA'$, zato je $d = 10\,\text{cm} : 2 = 5\,\text{cm}$.
3. Zdaj ti: koliko meri $\lvert TA'\rvert$? Ne meri, utemelji z lego točke $T$.

:::premisli
Koliko meri $\lvert TA'\rvert$? Zakaj ti ni treba vedeti, kje točno na osi leži $T$?
---
$\lvert TA'\rvert = 6\,\text{cm}$. Točka $T$ leži na simetrali daljice $AA'$, zato je od $A'$ enako daleč kot od $A$. Odgovor: os je simetrala daljice $AA'$, točka $A$ je od nje oddaljena $5\,\text{cm}$, $\lvert TA'\rvert = 6\,\text{cm}$.
:::

## Pogoste napake

- **Razdaljo do osi merimo poševno.** Pri poševni osi učenec meri vodoravno ali »na oko«, zato slika pade na napačno mesto. Razdalja do premice je razdalja po pravokotnici. Pravilno: najprej konstruiraj pravokotnico skozi točko, nato meri po njej.
- **Slika ostane na isti strani osi.** Kdor nariše sliko na isti strani, je lik le premaknil. Os mora razpoloviti daljico $AA'$, zato sta točka in slika na nasprotnih straneh. Pravilno: sliko nanesi na drugo stran, enako daleč od osi.
- **Razdalja do slike je enaka razdalji do osi.** Pri točki $3\,\text{cm}$ od osi učenec reče, da je slika $3\,\text{cm}$ od točke. To je le pol poti: do osi je $d$, od osi do slike še enkrat $d$. Pravilno: $\lvert AA'\rvert = 2d$.
- **Napačno štetje osi.** Učenec misli, da sta diagonali pravokotnika osi, kvadratu pa pripiše le $2$ osi. Po diagonali pravokotnika se polovici ne prekrijeta, ker sta sosednji stranici različno dolgi; pri kvadratu se. Pravilno: vsako premico preskusi s prepogibom. Pravokotnik ima $2$ osi, kvadrat $4$.
- **Zrcalno sliko zamenjamo z zasukom.** Učenec zrcaljeno črko F obrne nazaj z vrtenjem v ravnini, a to ne gre: zrcaljenje zamenja smer obhoda, zasuk ne. Pravilno: zrcaljenja ne moreš nadomestiti z vrtenjem lika na listu.

## Povzetek

- Zrcaljenje čez premico $o$: točki $A$ priredimo $A'$ tako, da je $o$ simetrala daljice $AA'$.
- Daljica $AA'$ je pravokotna na os, točka in slika sta enako daleč od osi: $d' = d$, $\lvert AA'\rvert = 2d$. Točka na osi je sama sebi slika.
- Konstrukcija: pravokotnica skozi točko, razdaljo do osi preneseš na drugo stran. Lik zrcalimo oglišče za ogliščem.
- Slika je skladna z izvirnikom (dolžine, koti, obseg, ploščina), smer obhoda se obrne.
- Lik je osno simetričen, če ga zrcaljenje čez neko premico (simetrijsko os) preslika vase.
- Število osi: daljica $2$, kot $1$, raznostranični trikotnik $0$, enakokraki $1$, enakostranični $3$, pravokotnik $2$, kvadrat $4$, krog neskončno.

## Drugače: Z analogijo

Os zrcaljenja je kot mreža na odbojkarskem igrišču, točke pa so kot igralci. Vsak igralec ima na drugi strani mreže svoj »zrcalni« par:

- par stoji točno nasproti, tako da bi bila črta med njima pravokotna na mrežo;
- od mreže je oddaljen prav toliko kot igralec;
- igralec, ki bi stal točno na črti mreže, bi bil sam svoj par.

Če se igralec umakne en korak nazaj, se mora tudi par umakniti en korak. Razdalja med njima se poveča za dva koraka, to je $\lvert AA'\rvert = 2d$. Simetrična postavitev je tista, pri kateri je razpored igralcev na eni strani natančen odsev razporeda na drugi.

## Drugače: Iz vsakdanjega življenja

- **Prepogib:** list prepogni na pol, nariši polovico srca in izreži. Ko ga razgrneš, je srce simetrično, pregib pa je simetrijska os.
- **Ogledalo:** ogledalo postavi pokončno na premico čez lik. Če je premica simetrijska os, v ogledalu vidiš cel lik.
- **Izložba:** napis na steklu trgovine od znotraj bereš zrcalno. Črke so zrcaljene čez navpično os.
- **Reševalno vozilo:** napis spredaj je zrcaljen, da ga voznik pred njim v vzvratnem ogledalu prebere pravilno.
- **Jezero:** gladina je os, odsev gore je enako velik, a obrnjen na glavo.

Zrcaljenje nikoli ne spremeni velikosti. Tvoj odsev ni ne večji ne manjši od tebe, zamenjani sta le levo in desno.

## Preveri se

? Prodajalec prepogne majico tako, da se polovici natančno prekrijeta. Kako imenujemo pregib?
+ simetrijska os majice
- zrcalna slika majice
~ Zrcalna slika je lik, ki ga dobimo z zrcaljenjem, ne premica, čez katero zrcalimo.
- diagonala majice
~ Diagonala povezuje nasprotni oglišči. Pri pravokotniku se polovici po diagonali sploh ne prekrijeta.
> Premica, po kateri se polovici lika ob prepogibu natančno prekrijeta, je simetrijska os.

? Razvrsti like od tistega z najmanj simetrijskimi osmi do tistega z največ.
1. raznostranični trikotnik
2. enakokraki trikotnik (ni enakostraničen)
3. pravokotnik (ni kvadrat)
4. enakostranični trikotnik
5. kvadrat
> Osi je po vrsti $0$, $1$, $2$, $3$ in $4$. Pravokotnik nima osi po diagonalah, kvadrat jih ima.

? Točka $A$ je od osi oddaljena $2\,\text{cm}$. Kaj se zgodi, če jo odmaknemo od osi še za $1\,\text{cm}$ (po pravokotnici)?
- Slika $A'$ ostane na mestu, $\lvert AA'\rvert$ se poveča za $1\,\text{cm}$.
~ Slika mora biti od osi vedno enako daleč kot točka, zato se premakne tudi ona.
+ Tudi $A'$ se odmakne za $1\,\text{cm}$, $\lvert AA'\rvert$ se poveča za $2\,\text{cm}$.
- Slika $A'$ se približa osi za $1\,\text{cm}$.
~ Točka in slika sta vedno enako daleč od osi; ko se ena oddalji, se oddalji tudi druga.
> Prej: $d = 2\,\text{cm}$, $\lvert AA'\rvert = 4\,\text{cm}$. Potem: $d = 3\,\text{cm}$, $\lvert AA'\rvert = 6\,\text{cm}$, kar je $2\,\text{cm}$ več.

? Listek s ceno visi $4{,}5\,\text{cm}$ pred ravnim ogledalom. Koliko centimetrov je listek oddaljen od svoje slike v ogledalu?
= 9 cm | 0,1
~ 4,5 | To je le razdalja do ogledala. Slika je za ogledalom še enkrat toliko.
~ 2,25 | Razdaljo si razpolovil, a slika je dvakrat dlje, ne pol tako daleč.
> Slika je $4{,}5\,\text{cm}$ za ogledalom, zato je razdalja $2 \cdot 4{,}5\,\text{cm} = 9\,\text{cm}$.

? Na mreži sta točka $A$ in njena zrcalna slika $A'$. Os ni narisana. Koliko kvadratkov od točke $A$ leži os?
:::risba skica
opis: Kvadratna mreža. Točka A in točka A' sta v isti vrstici, A' je 6 kvadratkov desno od A. Med njima je črtkana vodoravna daljica.
območje: 0; 0 .. 10; 5
mreža: da
črta: 2; 3 -> 8; 3 | črtkano
točka: 2; 3 | A | nad
točka: 8; 3 | A' | nad
:::
- $6$
~ To je razdalja od $A$ do $A'$. Os jo razpolovi.
+ $3$
- $8$
~ Prebral si lego točke $A'$ na mreži, ne razdalje od $A$.
> Med $A$ in $A'$ je $6$ kvadratkov. Os je simetrala daljice $AA'$, zato je od $A$ oddaljena $6 : 2 = 3$ kvadratke.

<<RACUN
vrednost: 2*4 | 8
vrednost: 2+2 | 4
vrednost: 2*3 | 6
vrednost: 2*2 | 4
vrednost: 2*5 | 10
vrednost: 3+4+5 | 12
vrednost: 10/2 | 5
vrednost: 2*4.5 | 9
vrednost: 6/2 | 3
>>

:::simboli
A | točka, ki jo zrcalimo | | |
B, B' | oglišče $B$ in njegova slika | | |
A' | zrcalna slika točke $A$ | | | beremo »A črtica«
X, X' | poljubno oglišče in njegova slika | | |
T | točka na osi zrcaljenja | | | $\lvert TA'\rvert = \lvert TA\rvert$
d | razdalja točke od osi | | | razdalja med točko in sliko je $2d$
d' | razdalja slike od osi | d' = d | |
:::
