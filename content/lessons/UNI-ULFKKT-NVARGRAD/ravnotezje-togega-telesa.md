---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na hidrološki postaji ob reki je na betonski zid pritrjena jeklena roka, ki nad vodo drži merilnik gladine. Po vsaki večji poplavi tehnik opazi isto: zgornji sidrni vijaki so razrahljani, spodnji pa nepoškodovani. Roka in merilnik skupaj tehtata le okoli $160\,\mathrm{kg}$, vijaki pa so dimenzionirani za sile več deset kilonewtonov. Kako jih lahko razmeroma lahka roka iztrga?

Odgovor da ravnotežje togega telesa. Zid na roko ne deluje le z navpično silo, ki drži težo, ampak tudi z **momentom vpetja**: zgornji vijaki vlečejo, spodnji del plošče pritiska. Ko roko obteži še naplavljeno vejevje, ta moment hitro naraste, sila v zgornjih vijakih pa je zaradi kratke ročice med vijaki mnogo večja od teže. Enak račun potrebuješ za vsako konstrukcijo na gradbišču in v naravi: za brv čez potok, konzolni nadstrešek pod snegom, oder, nosilec sončnih panelov ali drog meteorološke postaje v vetru. Najprej določiš **reakcije podpor**, šele nato lahko presodiš, ali bo element zdržal.

## Razlaga

### Mamljiva napačna ideja

Ko študent prvič vidi nosilec na dveh podporah, pogosto sklepa: »Breme se razdeli na pol, vsaka podpora nosi polovico.« Pri konzoli pa: »Vpetje nosi težo, torej je reakcija kar sila navzgor.« Obe trditvi izhajata iz starega orodja – vsote sil – in obe sta napačni.

Preizkusi prvo na brvi dolžine $5\,\mathrm{m}$, na kateri stoji človek $1\,\mathrm{m}$ od levega brega. Če bi vsak breg nosil polovico, bi se brv lahko zasukala: sili bregov sta enaki, teža človeka pa je bližje levemu bregu, zato bi vsota momentov glede na sredino ne bila nič. Telo, ki ga »uravnoteži« le vsota sil, se še vedno lahko vrti. Pravilno razmišljanje mora vključiti še momente.

### Pogoji ravnotežja

**Definicija.** Togo telo je v **ravnotežju**, kadar glede na izbrani (inercialni) koordinatni sistem miruje in ostaja v mirovanju.

**Izrek (pogoji ravnotežja).** Togo telo, ki miruje, ostane v ravnotežju natanko tedaj, ko velja

$$\sum\vec{F}_i = 0, \qquad \sum\vec{M}_{O,i} = 0$$

za neko točko $O$. Če sta izpolnjena oba pogoja, je vsota momentov enaka nič glede na **vsako** točko.

**Dokaz drugega dela.** Za točko $P$ je $\sum(\vec{r}_i - \vec{r}_P)\times\vec{F}_i = \sum\vec{r}_i\times\vec{F}_i - \vec{r}_P\times\sum\vec{F}_i$. Prvi člen je moment glede na $O$, ki je nič, drugi pa vsebuje $\sum\vec{F}_i = 0$. $\square$

Za sistem sil v ravnini $xy$ to pomeni **tri skalarne enačbe**:

$$\sum F_{ix} = 0, \qquad \sum F_{iy} = 0, \qquad \sum M_{A,i} = 0.$$

Enakovredna sta še dva zapisa, ki sta pri nosilcih pogosto hitrejša:

- dve momentni in ena projekcijska enačba, $\sum M_A = 0$, $\sum M_B = 0$, $\sum F_x = 0$, če premica $AB$ **ni pravokotna** na os $x$;
- tri momentne enačbe, $\sum M_A = 0$, $\sum M_B = 0$, $\sum M_C = 0$, če točke $A$, $B$, $C$ **ne ležijo na isti premici**.

Pogoja nista okras: če bi $AB$ bila pravokotna na $x$, bi rezultanta, ki leži na premici $AB$, izpolnila vse tri enačbe, ne da bi bila nič.

Ker je enačb v ravnini točno tri, iz njih lahko izračunamo največ tri neznane reakcije.

:::premisli
Na nosilcu iščeš reakciji v podporah $A$ in $B$. Okoli katere točke zapišeš prvo momentno enačbo, da ima ta le eno neznanko?
---
Okoli $A$ (ali $B$). Neznane sile v $A$ imajo nosilke skozi $A$, zato je njihov moment glede na $A$ nič; v enačbi ostane le reakcija v $B$. Isto naredimo še okoli $B$ in dobimo reakcijo v $A$ brez reševanja sistema.
:::

### Podpore in reakcije

Podpora (vez) telesu prepreči določene premike. Kjer premik prepreči, deluje **reakcija**: sila v smeri preprečenega premika ali moment, kjer prepreči zasuk. Telo v ravnini ima tri **prostostne stopnje** (premik v $x$, premik v $y$, zasuk), zato mora imeti vsaj tri neodvisne reakcije.

| podpora | reakcije |
|---|---|
| pomična (valjčna) | 1 sila, pravokotna na podlago |
| nepomična členkasta | 2 sili, $A_x$ in $A_y$ |
| togo vpetje | 2 sili in moment $M_A$ |
| nihajna palica, vrv | 1 sila v smeri palice |

Pomična podpora prepreči le premik pravokotno na podlago, nepomična členkasta oba premika, togo vpetje še zasuk. Nihajna palica prepreči premik v svoji smeri; vrv prenese le nateg.

Na skicah podpore rišemo z dogovorjenimi znaki (spodaj nosilec iz Primera 3: členek v $A$ z reakcijama $A_x$ in $A_y$, valjček v $B$, prost konec $C$; pod njim togo vpetje z reakcijami $A_x$, $A_y$ in $M_A$):

```
  ^ A_y         ^ B
  |             |
->o=============o=====C
 /\            /\
////          o  o
              ////

togo vpetje:
 |//|=========
 |//|
```

Trikotnik s šrafirano podlago je nepomični členek (dve reakciji), trikotnik na valjčkih je pomična podpora (ena reakcija, pravokotna na podlago), šrafirana stena, v katero nosilec vstopa, je togo vpetje (dve sili in moment).

**Diagram prostega telesa.** Telo »sprostimo«: podpore odstranimo in jih nadomestimo z reakcijami. Narišemo vse zunanje sile (teže, obtežbe, dvojice) in vse reakcije z izbranimi smermi. Če pride reakcija negativna, deluje v nasprotni smeri, kot smo jo narisali; računa ne popravljamo.

**Statična določenost.** Naj ima telo v ravnini $n$ neznanih reakcij.

- $n < 3$: telo je **mehanizem** (labilno), ravnotežje je mogoče le pri posebnih obtežbah.
- $n = 3$ in podpore so pravilno razporejene: telo je **statično določeno**, reakcije dobimo iz treh enačb.
- $n > 3$: telo je **statično nedoločeno**; enačbe ravnotežja niso dovolj, potrebujemo še deformacije (pri trdnosti).

Pogoj $n = 3$ je potreben, ni pa zadosten. Če se nosilke treh reakcij sekajo v isti točki ali so vse tri vzporedne, je telo **geometrijsko labilno**: zasuk okoli presečišča (ali premik pravokotno na vzporedne nosilke) ne povzroči nobene reakcije.

### Prostoležeči nosilec

**Prostoležeči nosilec** je raven nosilec z nepomično členkasto podporo $A$ na enem koncu in pomično podporo $B$ na drugem; reakcije so $A_x$, $A_y$ in $B$. Naj ima razpon $l$ in naj nanj deluje navpična sila $F$ na razdalji $a$ od $A$ ($b = l - a$ od $B$).

**Izpeljava.** Iz $\sum F_x = 0$ je $A_x = 0$. Momentna enačba glede na $A$ (pozitivno v nasprotni smeri urnega kazalca): $B\,l - F\,a = 0$. Momentna enačba glede na $B$: $-A_y\,l + F\,b = 0$. Torej

$$A_y = \frac{F\,b}{l}, \qquad B = \frac{F\,a}{l}.$$

Preizkus: $A_y + B = F(a + b)/l = F$, kar mora veljati po $\sum F_y = 0$.

Podpora bližje bremenu nosi več, kar je ravno nasprotno od »vsak pol«. Polovico nosi vsaka le, če je breme na sredini ali je obtežba simetrična. Za več bremen se reakcije seštejejo (**načelo superpozicije**, ker so enačbe linearne). Porazdeljeno obtežbo pred računom nadomestimo z rezultanto v težišču diagrama.

### Konzola

**Konzola** je nosilec, ki je na enem koncu togo vpet, drugi konec pa je prost. Za konzolo dolžine $l$ z navpično silo $F$ na razdalji $a$ od vpetja $A$ velja

$$A_x = 0, \qquad A_y = F, \qquad M_A = F\,a.$$

Reakcijski moment raste z ročico bremena. Ista sila na dvakrat daljši roki pomeni dvakrat večji moment vpetja, navpična reakcija pa ostane enaka. Prav moment vpetja trga sidrne vijake na hidrološki postaji iz uvoda.

:::premisli
Ali bi lahko konzolo namesto z vpetjem podprli le z eno nepomično členkasto podporo? Kaj bi se zgodilo in zakaj?
---
Ne. Členek ima le dve reakciji in ne more dati momenta. Teža ima glede na členek moment, ki ga nič ne uravnoteži, zato se konzola zasuče navzdol: je mehanizem ($n = 2 < 3$).
:::

## Rešeni primeri

### Primer 1 (lažji)

Lesena brv čez potok ima razpon $5{,}0\,\mathrm{m}$ in leži na dveh opornikih: na levem je pritrjena členkasto, na desnem prosto (pomično). Hidrolog z opremo (skupna teža $3{,}0\,\mathrm{kN}$) stoji $2{,}0\,\mathrm{m}$ od levega opornika. Kolikšni sta reakciji opornikov? Težo brvi zanemari.

**Podatki:** $l = 5{,}0\,\mathrm{m}$, $F = 3{,}0\,\mathrm{kN}$, $a = 2{,}0\,\mathrm{m}$ (od $A$), $b = 3{,}0\,\mathrm{m}$ (od $B$)
**Iščemo:** reakciji $A_y$ in $B$ (in $A_x$)

:::formula
$\sum M_A = 0$: $B\,l - F\,a = 0$; $\sum M_B = 0$: $-A_y\,l + F\,b = 0$; $\sum F_x = 0$
:::

**Rešitev:**

1. Vodoravnih sil ni, zato je $A_x = 0$.
2. Momentna enačba okoli $A$ vsebuje le neznanko $B$: $B = F\,a/l = 3{,}0 \cdot 2{,}0/5{,}0\,\mathrm{kN} = 1{,}2\,\mathrm{kN}$.
3. Momentna enačba okoli $B$ vsebuje le $A_y$: $A_y = F\,b/l = 3{,}0 \cdot 3{,}0/5{,}0\,\mathrm{kN} = 1{,}8\,\mathrm{kN}$.
4. Preizkus z vsoto navpičnih sil: $1{,}8 + 1{,}2 = 3{,}0\,\mathrm{kN}$. ✓
5. Odgovor: levi opornik nosi $1{,}8\,\mathrm{kN}$, desni $1{,}2\,\mathrm{kN}$. Bližji opornik nosi več, ne polovice.

### Primer 2

Jeklena roka hidrološke postaje iz uvoda je konzola dolžine $2{,}5\,\mathrm{m}$, vodoravno vpeta v zid. Lastna teža roke je enakomerna, $0{,}40\,\mathrm{kN/m}$, merilnik na koncu tehta $0{,}60\,\mathrm{kN}$, voda pa nanj deluje z vodoravno silo $0{,}20\,\mathrm{kN}$ stran od zidu (vzdolž osi roke). Določi reakcije vpetja. Moment vpetja prevzameta zgornja in spodnja vrsta vijakov, ki sta $0{,}20\,\mathrm{m}$ narazen; oceni silo v zgornji vrsti, če moment nadomestiš z dvojico.

**Podatki:** $l = 2{,}5\,\mathrm{m}$, $q = 0{,}40\,\mathrm{kN/m}$, $F = 0{,}60\,\mathrm{kN}$ na koncu, $H = 0{,}20\,\mathrm{kN}$ vodoravno stran od zidu, razmik vrst vijakov $e = 0{,}20\,\mathrm{m}$
**Iščemo:** $A_x$, $A_y$, $M_A$ in silo $T$ v zgornji vrsti vijakov

:::formula
$F_q = q\,l$ pri $l/2$; $\sum F_x = 0$, $\sum F_y = 0$, $\sum M_A = 0$; dvojica vijakov $T\,e = |M_A|$
:::

**Rešitev:**

1. Rezultanta lastne teže: $F_q = 0{,}40 \cdot 2{,}5\,\mathrm{kN} = 1{,}0\,\mathrm{kN}$ na sredini roke, $1{,}25\,\mathrm{m}$ od zidu.
2. Vodoravno: $A_x + 0{,}20\,\mathrm{kN} = 0$, torej $A_x = -0{,}20\,\mathrm{kN}$ (zid vleče roko k sebi).
3. Navpično: $A_y = 1{,}0 + 0{,}60 = 1{,}6\,\mathrm{kN}$.
4. Momenti okoli $A$ (sila $H$ leži na osi roke in nima momenta): $M_A - 1{,}0 \cdot 1{,}25 - 0{,}60 \cdot 2{,}5 = 0$, torej $M_A = 1{,}25 + 1{,}5 = 2{,}75\,\mathrm{kN\,m}$ v nasprotni smeri urnega kazalca (zid roko »dviga« nazaj).
5. Moment vpetja da dvojica vijakov: zgornja vrsta vleče, spodnji del plošče pritiska ob zid. $T = M_A/e = 2{,}75/0{,}20\,\mathrm{kN} = 13{,}75\,\mathrm{kN}$.
6. Primerjava: navpična reakcija je $1{,}6\,\mathrm{kN}$, natezna sila v zgornjih vijakih pa okoli $14\,\mathrm{kN}$ – skoraj devetkrat več.
7. Odgovor: $A_x = -0{,}20\,\mathrm{kN}$, $A_y = 1{,}6\,\mathrm{kN}$, $M_A = 2{,}75\,\mathrm{kN\,m}$; zgornja vrsta vijakov mora prenesti približno $14\,\mathrm{kN}$ natega. Zato se po poplavi z naplavino rahljajo prav zgornji vijaki.

### Primer 3 (težji)

Nosilec $ACB$ s previsom ima nepomično členkasto podporo $A$ pri $x = 0$, pomično podporo $B$ pri $x = 6{,}0\,\mathrm{m}$ in prost konec $C$ pri $x = 8{,}0\,\mathrm{m}$. Na odseku $AB$ deluje trikotna obtežba, ki raste od $0$ pri $A$ do $3{,}0\,\mathrm{kN/m}$ pri $B$. V točki $C$ deluje sila $4{,}0\,\mathrm{kN}$, usmerjena navzdol in v desno pod kotom $60^\circ$ glede na vodoravnico, pri $x = 3{,}0\,\mathrm{m}$ pa dvojica $5{,}0\,\mathrm{kN\,m}$ v smeri urnega kazalca. Določi reakcije in jih preveri z neodvisno enačbo.

**Podatki:** $l_{AB} = 6{,}0\,\mathrm{m}$, $x_C = 8{,}0\,\mathrm{m}$; trikotna obtežba $q_0 = 3{,}0\,\mathrm{kN/m}$ pri $B$; $F_C = 4{,}0\,\mathrm{kN}$ pod $60^\circ$ navzdol in v desno; $M = -5{,}0\,\mathrm{kN\,m}$
**Iščemo:** $A_x$, $A_y$, $B$

:::formula
$F_q = \tfrac{1}{2}q_0\,l_{AB}$ pri $\tfrac{2}{3}l_{AB}$ od $A$; $\sum M_A = 0$, $\sum M_B = 0$ (preizkus), $\sum F_x = 0$, $\sum F_y = 0$
:::

**Rešitev:**

1. Diagram prostega telesa: v $A$ narišemo $A_x$ (v desno) in $A_y$ (navzgor), v $B$ reakcijo $B$ navzgor (pomična podpora na vodoravni podlagi).
2. Trikotna obtežba: $F_q = \tfrac{1}{2} \cdot 3{,}0 \cdot 6{,}0\,\mathrm{kN} = 9{,}0\,\mathrm{kN}$, v težišču trikotnika pri $x = 4{,}0\,\mathrm{m}$ (tretjina razpona od večje ordinate pri $B$).
3. Sila v $C$: $F_{Cx} = 4{,}0\cos 60^\circ\,\mathrm{kN} = 2{,}0\,\mathrm{kN}$, $F_{Cy} = -4{,}0\sin 60^\circ\,\mathrm{kN} \approx -3{,}464\,\mathrm{kN}$.
4. $\sum M_A = 0$ (dvojica šteje s svojim predznakom ne glede na lego): $6{,}0\,B - 9{,}0 \cdot 4{,}0 - 3{,}464 \cdot 8{,}0 - 5{,}0 = 0$.
5. Od tod $B = (36 + 27{,}71 + 5{,}0)/6{,}0\,\mathrm{kN} \approx 11{,}45\,\mathrm{kN}$.
6. $\sum F_y = 0$: $A_y = 9{,}0 + 3{,}464 - 11{,}45 \approx 1{,}01\,\mathrm{kN}$.
7. $\sum F_x = 0$: $A_x + 2{,}0 = 0$, torej $A_x = -2{,}0\,\mathrm{kN}$ (deluje v levo).
8. Preizkus z $\sum M_B = 0$: $-1{,}012 \cdot 6{,}0 + 9{,}0 \cdot 2{,}0 - 3{,}464 \cdot 2{,}0 - 5{,}0 \approx -6{,}07 + 18 - 6{,}93 - 5{,}0 = 0$. ✓
9. Odgovor: $A_x = -2{,}0\,\mathrm{kN}$, $A_y \approx 1{,}01\,\mathrm{kN}$, $B \approx 11{,}45\,\mathrm{kN}$. Previs s silo na koncu »dviga« levi del nosilca, zato je $A_y$ majhna, $B$ pa nosi skoraj vso navpično obtežbo ($11{,}45$ od skupaj $12{,}46\,\mathrm{kN}$).

### Primer 4 – zdaj ti

Ploščat strešni nosilec sončnih panelov ima razpon $4{,}0\,\mathrm{m}$ in je prostoležeč ($A$ levo, $B$ desno). Veter je nanesel sneg le na levi del: enakomerna obtežba $1{,}5\,\mathrm{kN/m}$ deluje od $A$ do $x = 3{,}0\,\mathrm{m}$. Kolikšni sta reakciji?

**Podatki:** $l = 4{,}0\,\mathrm{m}$, $q = 1{,}5\,\mathrm{kN/m}$ na odseku od $0$ do $3{,}0\,\mathrm{m}$
**Iščemo:** $A_y$ in $B$

:::formula
$F_q = q\,l_q$ v sredini odseka; $B = F_q\,x_q/l$; $A_y = F_q - B$
:::

**Rešitev:**

1. Rezultanta snega: $F_q = 1{,}5 \cdot 3{,}0\,\mathrm{kN} = 4{,}5\,\mathrm{kN}$, pri $x_q = 1{,}5\,\mathrm{m}$.
2. Vodoravnih sil ni: $A_x = 0$.
3. Zdaj ti: zapiši momentno enačbo okoli $A$, izračunaj $B$ in nato $A_y$.

:::premisli
Kolikšni sta $B$ in $A_y$? Katera podpora nosi več in zakaj?
---
$B\cdot 4{,}0 - 4{,}5 \cdot 1{,}5 = 0$, torej $B = 6{,}75/4{,}0\,\mathrm{kN} \approx 1{,}69\,\mathrm{kN}$; $A_y = 4{,}5 - 1{,}69 \approx 2{,}81\,\mathrm{kN}$. Več nosi $A$, ker je rezultanta snega bližje njej.
:::

## Pogoste napake

- **»Vsaka podpora nosi polovico.«** To velja le pri simetrični obtežbi. Popravek: vedno zapiši momentno enačbo okoli ene podpore; dobiš reakcijo druge.
- **Pozabljen moment vpetja.** Pri konzoli je reakcij tri, med njimi moment $M_A$. Brez njega momentna enačba nima rešitve, element pa bi »visel« le na sili.
- **Pomična podpora z dvema reakcijama.** Valjčna podpora ne more prevzeti sile vzdolž podlage. Če pri poševni podlagi to pozabiš, napačno izračunaš vodoravno reakcijo v nepomični podpori.
- **Porazdeljena obtežba v momentni enačbi.** Študent vstavi $q$ namesto $q\,l$ ali postavi rezultanto trikotne obtežbe na sredino. Popravek: najprej rezultanta (ploščina) in njena lega (težišče), šele nato moment.
- **Negativna reakcija »popravljena« sredi računa.** Če dobiš $A_x < 0$, je bila smer na skici napačna. Vrednost uporabljaj s predznakom naprej; sredi računa ne obračaj puščic.

## Povzetek

- Ravnotežje: $\sum\vec{F} = 0$ in $\sum\vec{M} = 0$; v ravnini tri enačbe, npr. $\sum F_x = 0$, $\sum F_y = 0$, $\sum M_A = 0$.
- Druge oblike: dve momentni in ena projekcijska ($AB$ ni pravokotna na smer projekcije) ali tri momentne (točke niso kolinearne).
- Podpore: pomična 1 reakcija, nepomična členkasta 2, togo vpetje 3 (2 sili in moment).
- Statično določeno: $n = 3$ pravilno razporejenih reakcij; $n < 3$ mehanizem, $n > 3$ nedoločeno.
- Prostoležeči nosilec: $A_y = F\,b/l$, $B = F\,a/l$.
- Konzola: $A_y = F$, $M_A = F\,a$; moment vpetja raste z ročico.
- Momentno enačbo piši okoli točke, skozi katero gre čim več neznank.

## Za izpit

Znati moraš povedati:

- pogoje ravnotežja togega telesa in dokaz, da je ob $\sum\vec{F} = 0$ vsota momentov neodvisna od izbire točke;
- vse tri oblike ravninskih ravnotežnih enačb z njihovimi pogoji;
- vrste podpor, katere premike preprečijo in kakšne reakcije dajo;
- pojme mehanizem, statično določen, statično nedoločen in geometrijsko labilen ter primer za vsakega;
- izpeljavo reakcij prostoležečega nosilca in konzole za točkovno silo.

### Naloga 1

Nadstrešek nad vhodom meteorološke postaje je vodoraven nosilec $AB$ dolžine $4{,}0\,\mathrm{m}$, v točki $A$ členkasto pritrjen na zid. Konec $B$ drži jeklena vrv, ki je pritrjena na zid v točki $C$, $3{,}0\,\mathrm{m}$ nad $A$. Lastna teža nosilca je $0{,}50\,\mathrm{kN/m}$. Na razdalji $3{,}0\,\mathrm{m}$ od zidu visi še $6{,}0\,\mathrm{kN}$ težka naprava. Izračunaj silo v vrvi ter velikost in smer reakcije v členku $A$.

**Rešitev:**

1. Diagram prostega telesa: v $A$ neznanki $A_x$, $A_y$; v $B$ sila vrvi $S$ v smeri od $B$ proti $C$, torej $(-4{,}0; 3{,}0)/5{,}0$; teža nosilca $0{,}50 \cdot 4{,}0 = 2{,}0\,\mathrm{kN}$ pri $2{,}0\,\mathrm{m}$, naprava $6{,}0\,\mathrm{kN}$ pri $3{,}0\,\mathrm{m}$. Neznanke so tri, telo je statično določeno.
2. $\sum M_A = 0$: vodoravna komponenta vrvi leži na osi nosilca, zato ostane $0{,}6\,S \cdot 4{,}0 - 2{,}0 \cdot 2{,}0 - 6{,}0 \cdot 3{,}0 = 0$.
3. $2{,}4\,S = 22$, torej $S \approx 9{,}17\,\mathrm{kN}$.
4. $\sum F_x = 0$: $A_x - 0{,}8 \cdot 9{,}17 = 0$, torej $A_x \approx 7{,}33\,\mathrm{kN}$ (zid nosilec potiska stran od sebe).
5. $\sum F_y = 0$: $A_y + 0{,}6 \cdot 9{,}17 - 2{,}0 - 6{,}0 = 0$, torej $A_y = 8{,}0 - 5{,}5 = 2{,}5\,\mathrm{kN}$.
6. Velikost: $A = \sqrt{7{,}33^2 + 2{,}5^2}\,\mathrm{kN} \approx 7{,}75\,\mathrm{kN}$, kot nad vodoravnico $\arctan(2{,}5/7{,}33) \approx 18{,}8^\circ$.
7. Odgovor: sila v vrvi je približno $9{,}17\,\mathrm{kN}$, reakcija v členku približno $7{,}75\,\mathrm{kN}$, usmerjena stran od zidu in $18{,}8^\circ$ navzgor. Vrv nosi več kot vsa teža skupaj ($8{,}0\,\mathrm{kN}$), ker je strma le $37^\circ$, členek pa zato prevzame veliko vodoravno silo.

### Naloga 2

Natančno navedi pogoje ravnotežja togega telesa v ravnini in dokaži: če sta izpolnjena $\sum\vec{F} = 0$ in $\sum\vec{M}_O = 0$, je vsota momentov nič glede na vsako točko. Nato utemelji, zakaj enačbe $\sum M_A = 0$, $\sum M_B = 0$, $\sum F_x = 0$ zadoščajo le, če premica $AB$ ni pravokotna na os $x$. Za konec presodi statično določenost: (a) nosilec z nepomično členkasto podporo na vsakem koncu, (b) nosilec s tremi pomičnimi podporami na vodoravni podlagi.

**Rešitev:**

1. Pogoji: $\sum F_x = 0$, $\sum F_y = 0$, $\sum M_O = 0$ za neko točko $O$.
2. Dokaz: $\sum\vec{M}_P = \sum(\vec{r}_i - \vec{r}_P)\times\vec{F}_i = \sum\vec{M}_O - \vec{r}_P\times\sum\vec{F}_i = 0 - 0 = 0$, kjer so $\vec{r}_i$ in $\vec{r}_P$ merjeni od $O$.
3. Druga oblika: iz $\sum M_A = 0$ sledi, da je sistem bodisi ničelni bodisi enakovreden rezultanti z nosilko skozi $A$ (dvojica bi imela moment). Iz $\sum M_B = 0$ mora nosilka iti tudi skozi $B$, torej leži na premici $AB$.
4. Če $AB$ ni pravokotna na os $x$, ima neničelna sila na tej premici komponento $x$, zato $\sum F_x = 0$ zahteva $F_R = 0$. Če pa je $AB$ pravokotna na $x$, sila na premici $AB$ nima komponente $x$ in bi izpolnila vse tri enačbe, ne da bi bila nič – ravnotežje ne bi bilo zagotovljeno.
5. (a) Dve nepomični členkasti podpori dasta $n = 4 > 3$ reakcije: nosilec je enkrat statično nedoločen (vodoravnih reakcij ne ločimo brez deformacij).
6. (b) Tri pomične podpore: $n = 3$, a vse reakcije so navpične in vzporedne. Nobena ne prepreči vodoravnega premika, zato je nosilec geometrijsko labilen, čeprav je reakcij tri.

### Naloga 3

Poševni nosilec $AB$ (stopniščna rama) ima v $A(0; 0)$ nepomični členek, v $B(4; 3)$ (v metrih) pa se z valjčkom naslanja na navpično steno, zato je reakcija v $B$ vodoravna in kaže v smeri $-x$. Sneg $q = 2{,}0\,\mathrm{kN/m}$ deluje navpično in je podan na **tlorisno** dolžino $4\,\mathrm{m}$. V točki $(3; 2{,}25)$ deluje točkovna sila $3{,}0\,\mathrm{kN}$ navzdol. Veter $0{,}50\,\mathrm{kN/m}$ deluje vodoravno v smeri $+x$ in je podan na **narisno** višino $3\,\mathrm{m}$. Določi reakcije, velikost in smer reakcije v $A$ ter rezultat preveri z $\sum M_B = 0$.

**Rešitev:**

1. Rezultanti porazdeljenih obtežb: sneg $F_s = 2{,}0 \cdot 4 = 8{,}0\,\mathrm{kN}$ navzdol, veter $F_w = 0{,}50 \cdot 3 = 1{,}5\,\mathrm{kN}$ v $+x$. Obe sta enakomerni vzdolž nosilca, zato prijemljeta na njegovi sredini, v točki $(2; 1{,}5)$.
2. Neznanke: $A_x$, $A_y$ in $B$ (vodoravna, v $-x$). Tri neznanke, tri enačbe.
3. $\sum M_A = 0$ z $M = xF_y - yF_x$: reakcija $B$ v $(4; 3)$ da $-3 \cdot (-B) = 3B$; sneg $2 \cdot (-8{,}0) = -16$; sila $3 \cdot (-3{,}0) = -9{,}0$; veter $-1{,}5 \cdot 1{,}5 = -2{,}25$ (v $\mathrm{kN\,m}$).
4. $3B - 16 - 9{,}0 - 2{,}25 = 0$, torej $B = 27{,}25/3\,\mathrm{kN} \approx 9{,}08\,\mathrm{kN}$.
5. $\sum F_x = 0$: $A_x - 9{,}08 + 1{,}5 = 0$, torej $A_x \approx 7{,}58\,\mathrm{kN}$ (v $+x$, proti steni).
6. $\sum F_y = 0$: $A_y - 8{,}0 - 3{,}0 = 0$, torej $A_y = 11{,}0\,\mathrm{kN}$.
7. Velikost: $A = \sqrt{7{,}58^2 + 11{,}0^2}\,\mathrm{kN} \approx 13{,}36\,\mathrm{kN}$, kot nad vodoravnico $\arctan(11{,}0/7{,}58) \approx 55{,}4^\circ$.
8. Preizkus $\sum M_B = 0$ (relativni položaji glede na $B$): $A$ pri $(-4; -3)$ da $(-4)(11{,}0) - (-3)(7{,}58) \approx -44 + 22{,}75 = -21{,}25$; sneg pri $(-2; -1{,}5)$ da $16$; sila pri $(-1; -0{,}75)$ da $3{,}0$; veter da $-(-1{,}5)(1{,}5) = 2{,}25$. Vsota: $-21{,}25 + 16 + 3{,}0 + 2{,}25 = 0$. ✓
9. Odgovor: $B \approx 9{,}08\,\mathrm{kN}$ (stena potiska ramo stran od sebe), $A_x \approx 7{,}58\,\mathrm{kN}$, $A_y = 11{,}0\,\mathrm{kN}$, $|A| \approx 13{,}4\,\mathrm{kN}$ pod $55{,}4^\circ$. Poševna rama potiska v steno, čeprav je obtežba skoraj vsa navpična: tega bi z »vsaka podpora nosi pol« nikoli ne dobili.

### Naloga 4

Prostoležeči nosilec dolžine $5{,}0\,\mathrm{m}$ ima v $A$ nepomično členkasto podporo, v $B$ pa pomično podporo na podlagi, nagnjeni za $30^\circ$, tako da reakcija v $B$ kaže navzgor in v levo pod kotom $30^\circ$ od navpičnice. Na nosilec deluje navpična sila $10\,\mathrm{kN}$ pri $x = 2{,}0\,\mathrm{m}$, v $B$ pa še vodoravna sila $3{,}0\,\mathrm{kN}$ v desno. Določi vse reakcije.

**Rešitev:**

1. Reakcija v $B$ ima znano smer: $B_x = -B\sin 30^\circ$, $B_y = B\cos 30^\circ$. Neznanke so $A_x$, $A_y$, $B$.
2. $\sum M_A = 0$: vodoravne sile ležijo na osi nosilca, zato $B_y \cdot 5{,}0 - 10 \cdot 2{,}0 = 0$ in $B_y = 4{,}0\,\mathrm{kN}$.
3. $B = B_y/\cos 30^\circ \approx 4{,}62\,\mathrm{kN}$, $B_x = -4{,}62\sin 30^\circ\,\mathrm{kN} \approx -2{,}31\,\mathrm{kN}$.
4. $\sum F_y = 0$: $A_y = 10 - 4{,}0 = 6{,}0\,\mathrm{kN}$.
5. $\sum F_x = 0$: $A_x + 3{,}0 - 2{,}31 = 0$, torej $A_x \approx -0{,}69\,\mathrm{kN}$ (v levo).
6. Odgovor: $A_x \approx -0{,}69\,\mathrm{kN}$, $A_y = 6{,}0\,\mathrm{kN}$, $B \approx 4{,}62\,\mathrm{kN}$ pod $30^\circ$ od navpičnice. Poševna podlaga v $B$ prevzame del vodoravne sile, zato $A_x$ ni enaka $-3{,}0\,\mathrm{kN}$.

## Drugače: Uporaba v stroki

**Hidrotehnika in okolje.** Brvi in merilni mostovi čez vodotoke so pogosto prostoležeči, ker pomična podpora na enem bregu dovoli raztezanje zaradi temperature; sicer bi se v nosilcu pojavile velike sile (statično nedoločena podpora). Merilne roke in nadstreški so konzole ali nosilci z vrvjo, za njihova sidra pa je merodajen moment vpetja.

**Podnebje in obtežbe.** Projektant po standardih za vplive na konstrukcije upošteva sneg in veter tudi nesimetrično: nanos snega na eni strani strehe (kot v Primeru 4) da večjo reakcijo v eni podpori, kot bi jo dala enakomerna obtežba. S podnebnimi spremembami se spreminjajo tudi karakteristične obtežbe s snegom in vetrom, zato se pri prenovah reakcije podpor preverjajo znova.

**Varnost na gradbišču.** Pri odrih, opažih in podpiranju izkopov reakcije določijo, koliko sile prevzamejo podložke, sidra in tla. Konzolna zaščitna ograja ali lovilna mreža mora prevzeti moment vpetja, ki raste z ročico udarca. Avtodvigalo je v ravnotežju, dokler rezultanta teže in bremena pada znotraj podpornih nog; ko se breme oddalji, se reakcija na nogah na nasprotni strani od bremena zmanjšuje proti nič – to je meja prevrnitve.

## Drugače: Korak za korakom s številkami

Prostoležeči nosilec razpona $8{,}0\,\mathrm{m}$ nosi dve sili: $12\,\mathrm{kN}$ pri $x = 2{,}0\,\mathrm{m}$ in $6{,}0\,\mathrm{kN}$ pri $x = 6{,}0\,\mathrm{m}$.

1. **Skica:** $A$ pri $x = 0$ (členek), $B$ pri $x = 8{,}0\,\mathrm{m}$ (pomična), sili navzdol.
2. **Vodoravno:** ni vodoravnih sil, $A_x = 0$.
3. **Momenti okoli $A$:** $8{,}0\,B = 12 \cdot 2{,}0 + 6{,}0 \cdot 6{,}0 = 24 + 36 = 60$, torej $B = 7{,}5\,\mathrm{kN}$.
4. **Momenti okoli $B$:** $8{,}0\,A_y = 12 \cdot 6{,}0 + 6{,}0 \cdot 2{,}0 = 72 + 12 = 84$, torej $A_y = 10{,}5\,\mathrm{kN}$.
5. **Preizkus:** $10{,}5 + 7{,}5 = 18 = 12 + 6{,}0$. ✓
6. **Superpozicija:** sama sila $12\,\mathrm{kN}$ bi dala $A_y = 9{,}0\,\mathrm{kN}$, $B = 3{,}0\,\mathrm{kN}$; sama sila $6{,}0\,\mathrm{kN}$ pa $A_y = 1{,}5\,\mathrm{kN}$, $B = 4{,}5\,\mathrm{kN}$. Vsoti sta enaki kot zgoraj.

## Drugače: Bolj natančno

**Ravnotežje v prostoru.** Togo telo v prostoru ima šest prostostnih stopenj (trije premiki in trije zasuki), zato je ravnotežnih enačb šest:

$$\sum F_x = 0, \quad \sum F_y = 0, \quad \sum F_z = 0, \quad \sum M_x = 0, \quad \sum M_y = 0, \quad \sum M_z = 0.$$

Momente računamo z vektorskim produktom $\vec{M} = \vec{r}\times\vec{F}$ glede na izbrano točko, momentne enačbe pa lahko zapišemo tudi glede na poljubne osi (ne nujno koordinatne), če so neodvisne. Prostorske podpore: kroglični členek (3 sile), cilindrični ležaj (2 sili pravokotno na os, lahko še 2 momenta), togo vpetje (3 sile in 3 momenti), vrv ali nihajna palica (1 sila v svoji smeri). Telo je statično določeno pri šestih pravilno razporejenih reakcijah. Primer: plošča na treh navpičnih nogah je pri navpični obtežbi določena (tri enačbe $\sum F_z$, $\sum M_x$, $\sum M_y$), miza s štirimi nogami pa je enkrat nedoločena – zato štirinoga miza na neravnih tleh majava.

**Ravnotežje in stabilnost.** Ravnotežje je lahko **stabilno** (po majhnem odmiku se telo vrne), **labilno** (odmik se poveča) ali **indiferentno**. Pri telesu na podlagi je merilo lega težišča: prevrnitev nastopi, ko nosilka rezultante teže in zunanjih sil pade iz podporne ploskve. Varnost proti prevrnitvi izrazimo z razmerjem stabilizirajočega in prevračalnega momenta glede na rob prevrnitve.

## Preveri se

? Katera podpora ne sodi v skupino glede na to, kaj lahko prevzame?
- pomična (valjčna) podpora
~ Prevzame le eno silo, kot nihajna palica; tudi nepomični členek ne prevzame momenta. Ne izstopa.
- nepomična členkasta podpora
~ Ima sicer dve reakciji, a tako kot ostale ne more prevzeti momenta.
+ togo vpetje
- nihajna palica
~ Nihajna palica prenese le silo v svoji smeri, momenta ne. Po tem ne izstopa.
> Edino togo vpetje prepreči zasuk in zato da reakcijski moment. Vse druge podpore dajo le sile.

? Prostoležeči nosilec razpona $8{,}0\,\mathrm{m}$ nosi silo $12\,\mathrm{kN}$ na razdalji $2{,}0\,\mathrm{m}$ od podpore $A$. Kolikšna je reakcija v $A$?
- $3{,}0\,\mathrm{kN}$
~ To je reakcija v $B$. Bližja podpora nosi več: $A_y = F\,b/l$ z $b = 6{,}0\,\mathrm{m}$.
- $6{,}0\,\mathrm{kN}$
~ Polovica bremena velja le, kadar je sila na sredini.
+ $9{,}0\,\mathrm{kN}$
> $A_y = F\,b/l = 12 \cdot 6{,}0/8{,}0\,\mathrm{kN} = 9{,}0\,\mathrm{kN}$, $B = 3{,}0\,\mathrm{kN}$; skupaj $12\,\mathrm{kN}$.

? Na konec vpete konzole obesiš breme, nato ga premakneš na mesto dvakrat bolj oddaljeno od zidu. Kaj se zgodi z reakcijami vpetja?
+ Navpična reakcija ostane enaka, moment vpetja se podvoji.
- Obe reakciji se podvojita.
~ Navpična reakcija uravnoteži težo, ki se ni spremenila. Podvoji se le ročica in z njo moment.
- Navpična reakcija se razpolovi, moment ostane enak.
~ Moment je $F\,a$; pri večji ročici raste. Vsota navpičnih sil zahteva $A_y = F$ ne glede na lego.
> Iz $\sum F_y = 0$ je $A_y = F$ neodvisno od lege, iz $\sum M_A = 0$ pa $M_A = F\,a$, ki se pri dvakratni ročici podvoji.

? Rešitev prostoležečega nosilca ($l = 6{,}0\,\mathrm{m}$, sila $9{,}0\,\mathrm{kN}$ pri $x = 2{,}0\,\mathrm{m}$ od $A$). Kateri korak je napačen? (1) $A_x = 0$. (2) $\sum M_A = 0$: $6{,}0\,B = 9{,}0 \cdot 2{,}0$, $B = 3{,}0\,\mathrm{kN}$. (3) $\sum M_B = 0$: $6{,}0\,A_y = 9{,}0 \cdot 2{,}0$, $A_y = 3{,}0\,\mathrm{kN}$.
- korak 1
~ Vodoravnih sil ni, zato je $A_x = 0$ pravilno.
- korak 2
~ Ročica sile glede na $A$ je res $2{,}0\,\mathrm{m}$, zato je $B = 3{,}0\,\mathrm{kN}$ pravilno.
+ korak 3
> Okoli $B$ je ročica sile $6{,}0 - 2{,}0 = 4{,}0\,\mathrm{m}$, ne $2{,}0\,\mathrm{m}$. Pravilno $A_y = 9{,}0 \cdot 4{,}0/6{,}0 = 6{,}0\,\mathrm{kN}$; preizkus $6{,}0 + 3{,}0 = 9{,}0\,\mathrm{kN}$ bi napako takoj odkril.

? Čez jarek za odvodnjavanje je položena $3{,}0\,\mathrm{m}$ dolga deska, ki prosto leži na obeh robovih. Delavec s težo $800\,\mathrm{N}$ stoji $1{,}0\,\mathrm{m}$ od levega roba. S kolikšno silo deska pritiska na levi rob (težo deske zanemari)?
- $400\,\mathrm{N}$
~ Polovica velja le, če delavec stoji na sredini.
- $267\,\mathrm{N}$
~ To je sila na desni, bolj oddaljeni rob: $800 \cdot 1{,}0/3{,}0$.
+ približno $533\,\mathrm{N}$
> Momenti okoli desnega roba: $3{,}0\,A = 800 \cdot 2{,}0$, torej $A \approx 533\,\mathrm{N}$. Na desni rob ostane $267\,\mathrm{N}$.

:::simboli
\vec{F}_i | i-ta zunanja sila | | N
\vec{M}_{O,i} | moment i-te sile glede na O | | N\,m
F_{ix} | komponenta $x$ i-te sile | | N
F_{iy} | komponenta $y$ i-te sile | | N
M_{A,i} | moment i-te sile glede na A | | N\,m
A_x, A_y | reakciji v podpori A | | kN
A | velikost reakcije v A | A = \sqrt{A_x^2 + A_y^2} | kN
B | reakcija v podpori B | B = \frac{F\,a}{l} | kN | pri pomični podpori ena sama sila
M_A | moment vpetja | M_A = F\,a | kN\,m | konzola
F | sila (breme) | | kN
l | razpon nosilca (dolžina konzole) | | m
a | razdalja bremena od A | | m
b | razdalja bremena od B | b = l - a | m
q | enakomerna porazdeljena obtežba | | kN/m
q_0 | največja ordinata trikotne obtežbe | | kN/m
F_q | rezultanta porazdeljene obtežbe | F_q = q\,l | kN
l_q | dolžina odseka z obtežbo | | m
x_q | lega rezultante obtežbe | | m
l_{AB} | razdalja med podporama | | m
x_C | lega prostega konca C | | m
F_C | sila v točki C | | kN
M | dvojica na nosilcu | | kN\,m
H | vodoravna sila vode | | kN
e | razmik vrst vijakov | | m
T | natezna sila v zgornji vrsti vijakov | T = \frac{M_A}{e} | kN
:::
