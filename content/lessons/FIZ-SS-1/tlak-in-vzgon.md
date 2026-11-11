---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V trgovini v košarico zložiš visoko plastenko z $1{,}5\,\mathrm{L}$ vode in nizek, širok bidon s $5\,\mathrm{L}$ vode. V bidonu je več kot trikrat več vode. Kje voda bolj pritiska na dno? Presenetljivo: v plastenki. Tlak na dnu je tam za petino večji, čeprav je vode veliko manj.

Iz osnovne šole že poznaš tlak kot količnik sile in ploščine ($p = F/S$) ter gostoto snovi ($\rho = m/V$). Veš tudi, da se pri potapljanju v globino ušesa »zamašijo« in da les plava, kamen pa potone.

Ta opažanja bo pojasnila ista ideja. Zakaj tlak v vodi narašča z globino? Zakaj mora imeti jez pri dnu debelejši zid kot zgoraj? Zakaj težka ladja iz jekla plava, majhna jeklena kroglica pa potone? Odgovora sta **hidrostatični tlak** in **Arhimedov zakon**. Brez njiju ne bi znali načrtovati podmornic, ladij, balonov ali merilnikov globine.

## Razlaga

**1. Tlak.** Tlak je količnik pravokotne sile na ploskev in ploščine te ploskve:

$$p = \frac{F}{S}$$

Enota je paskal: $1\,\text{Pa} = 1\,\text{N/m}^2$. Pogosto uporabljamo tudi $1\,\text{bar} = 100\,000\,\text{Pa}$. Zračni tlak ob morju je približno $1\,\text{bar}$.

**2. Najprej račun za plastenko in bidon.** Voda v plastenki sega $0{,}30\,\mathrm{m}$ visoko, dno ima ploščino $0{,}0050\,\mathrm{m^2}$. Bidon ima dno s ploščino $0{,}020\,\mathrm{m^2}$, voda v njem sega $0{,}25\,\mathrm{m}$ visoko. Obe posodi imata navpične stene, zato je tlak na dnu teža vode, deljena s ploščino dna:

| | plastenka | bidon |
|---|---|---|
| masa vode | $1{,}5\,\mathrm{kg}$ | $5{,}0\,\mathrm{kg}$ |
| teža $F_g$ | $14{,}7\,\mathrm{N}$ | $49\,\mathrm{N}$ |
| ploščina dna $S$ | $0{,}0050\,\mathrm{m^2}$ | $0{,}020\,\mathrm{m^2}$ |
| tlak $F_g/S$ | $2940\,\mathrm{Pa}$ | $2450\,\mathrm{Pa}$ |

Bidon ima res večjo težo vode, a jo razporedi na štirikrat večje dno. Odloča višina vode: $0{,}30\,\mathrm{m}$ proti $0{,}25\,\mathrm{m}$.

:::premisli
Vodo iz plastenke preliješ v ozek, visok valj, kjer sega $0{,}40\,\mathrm{m}$ visoko. Kaj se zgodi s tlakom na dnu, čeprav je vode enako?
---
Tlak naraste. Ista teža $14{,}7\,\mathrm{N}$ pritiska na manjše dno, in to natanko toliko, da je tlak sorazmeren z višino: $\dfrac{0{,}40}{0{,}30} \cdot 2940\,\mathrm{Pa} = 3920\,\mathrm{Pa}$.
:::

**3. Hidrostatični tlak.** Zdaj isto s črkami. V mirujoči tekočini tlak narašča z globino, ker spodnje plasti tekočine nosijo težo zgornjih. Pomisli na navpičen stolpec tekočine s ploščino preseka $S$ in višino $h$:

- prostornina: $V = S\,h$,
- masa: $m = \rho\,V = \rho\,S\,h$,
- teža: $F_g = m g = \rho\,S\,h\,g$.

Ta teža pritiska na ploščino $S$, zato je tlak, ki ga povzroča tekočina:

$$p_h = \frac{F_g}{S} = \rho\,g\,h$$

Tu je $\rho$ gostota tekočine, $g \approx 9{,}8\,\text{m/s}^2$ težni pospešek in $h$ globina pod gladino. Ploščina $S$ se je pokrajšala, zato širina posode ni pomembna. Preveri na plastenki: $1000 \cdot 9{,}8 \cdot 0{,}30 = 2940\,\mathrm{Pa}$, enako kot v tabeli.

V simulaciji spodaj (»Hidrostatični tlak«) nastavi globino $10\,\mathrm{m}$ in jo nato podvoji. Opazi, da se hidrostatični tlak podvoji. Nato pri isti globini zamenjaj vodo z gostejšo morsko vodo in opazuj, kako tlak naraste.

**4. Skupni tlak.** Če je gladina odprta v ozračje, na tekočino pritiska še zrak. Skupni tlak v globini $h$ je

$$p = p_0 + \rho\,g\,h$$

kjer je $p_0$ zunanji (zračni) tlak.

**5. Lastnosti hidrostatičnega tlaka.**

- Odvisen je samo od globine, gostote tekočine in $g$, **ne** od oblike posode ali količine tekočine.
- Na isti globini je tlak v tekočini povsod enak (v vseh smereh).
- Tlak deluje pravokotno na stene posode.

**6. Vzgon.** Telo, potopljeno v tekočino, doživlja s strani tekočine silo navzgor. Vzrok je razlika tlakov: na spodnjo ploskev telesa deluje večji tlak (večja globina) kot na zgornjo, zato je sila navzgor večja od sile navzdol.

**7. Arhimedov zakon.** Vzgon je enak teži izpodrinjene tekočine:

$$F_v = \rho_t\,g\,V_i$$

Tu je $\rho_t$ gostota **tekočine** in $V_i$ prostornina **potopljenega dela** telesa (to je prostornina izpodrinjene tekočine).

:::premisli
Kepa plastelina v vodi potone. Iz iste kepe oblikuješ čolniček in ta plava. Masa se ni spremenila. Zakaj zdaj plava?
---
Čolniček izpodrine veliko več vode kot kepa, ker je v njem zrak. Večja izpodrinjena prostornina $V_i$ pomeni večji vzgon, ki zdaj lahko uravnovesi težo. Tako plavajo tudi jeklene ladje.
:::

**8. Plavanje, lebdenje, potop.** Primerjamo gostoto telesa $\rho$ in gostoto tekočine $\rho_t$ (za telo, ki je v celoti potopljeno):

- $\rho < \rho_t$: vzgon je večji od teže, telo priplava na površje in plava,
- $\rho = \rho_t$: vzgon je enak teži, telo lebdi,
- $\rho > \rho_t$: vzgon je manjši od teže, telo potone.

Pri plavajočem telesu je vzgon enak teži telesa: $F_v = F_g$.

## Rešeni primeri

### Primer 1: tlak v vodi (lažji)

Kolikšen je hidrostatični tlak v jezeru na globini $5{,}0\,\text{m}$? Gostota vode je $1000\,\text{kg/m}^3$.

**Podatki:** $h = 5{,}0\,\text{m}$, $\rho = 1000\,\text{kg/m}^3$ (voda), $g = 9{,}8\,\text{m/s}^2$, zračni tlak $p_0 \approx 100\,000\,\text{Pa}$ (za skupni tlak)
**Iščemo:** hidrostatični tlak $p_h$ (in še skupni tlak $p$)

:::formula
$p_h = \rho\,g\,h$, skupni tlak $p = p_0 + p_h$
:::

**Rešitev:**

1. Iščemo tlak zaradi vode, zato uporabimo $p_h = \rho\,g\,h$.
2. Vstavimo: $p_h = 1000 \cdot 9{,}8 \cdot 5{,}0 = 49\,000\,\text{Pa}$.
3. To je $49\,\text{kPa}$, približno pol bara.
4. Če želimo skupni tlak, prištejemo še zračni tlak: $p = 100\,000 + 49\,000 = 149\,000\,\text{Pa}$.

Za vsakih približno $10\,\text{m}$ globine v vodi tlak naraste za okoli $1\,\text{bar}$.

### Primer 2: vzgon na kocko (srednji)

Kocka z robom $10\,\text{cm}$ je v celoti potopljena v vodo. Kolikšen je vzgon?

**Podatki:** $a = 10\,\text{cm}$, kocka je v celoti potopljena, tekočina je voda ($\rho_t = 1000\,\text{kg/m}^3$), $g = 9{,}8\,\text{m/s}^2$
**Iščemo:** vzgon $F_v$

:::formula
$F_v = \rho_t\,g\,V_i$, pri povsem potopljeni kocki je $V_i = a^3$
:::

**Rešitev:**

1. Rob pretvorimo v metre: $a = 0{,}10\,\text{m}$.
2. Prostornina kocke: $V = a^3 = 0{,}10^3 = 0{,}001\,\text{m}^3$.
3. Ker je kocka povsem pod vodo, je izpodrinjena prostornina enaka prostornini kocke: $V_i = 0{,}001\,\text{m}^3$.
4. Vzgon: $F_v = \rho_t\,g\,V_i = 1000 \cdot 9{,}8 \cdot 0{,}001 = 9{,}8\,\text{N}$.
5. Smiselnost: izpodrinjena voda ima maso $1\,\text{kg}$ (1 liter vode ima maso $1\,\text{kg}$), njena teža je $9{,}8\,\text{N}$. To se ujema.

### Primer 3: plavajoč les (težji)

Lesen kvader ima gostoto $600\,\text{kg/m}^3$ in prostornino $0{,}020\,\text{m}^3$. Plava na vodi. Kolikšen del kvadra je potopljen?

**Podatki:** $\rho = 600\,\text{kg/m}^3$ (les), $V = 0{,}020\,\text{m}^3$, kvader plava na vodi ($\rho_t = 1000\,\text{kg/m}^3$), $g = 9{,}8\,\text{m/s}^2$
**Iščemo:** delež potopljenega dela $\dfrac{V_i}{V}$

:::formula
Masa in teža telesa: $m = \rho\,V$, $F_g = m\,g$; vzgon: $F_v = \rho_t\,g\,V_i$

Telo plava, zato je vzgon enak teži: $F_v = F_g$, torej $\rho_t\,g\,V_i = \rho\,g\,V$
:::

**Rešitev:**

1. **Teža kvadra.** Masa: $m = \rho\,V = 600 \cdot 0{,}020 = 12\,\text{kg}$. Teža: $F_g = 12 \cdot 9{,}8 = 117{,}6\,\text{N}$.
2. **Pogoj plavanja.** Kvader miruje, zato je vzgon enak teži: $F_v = F_g$, torej $\rho_t\,g\,V_i = \rho\,g\,V$.
3. **Krajšamo $g$:** $\rho_t\,V_i = \rho\,V$.
4. **Izrazimo delež:** $\dfrac{V_i}{V} = \dfrac{\rho}{\rho_t} = \dfrac{600}{1000} = 0{,}6$.
5. **Odgovor.** Potopljenih je $60\,\%$ kvadra. Prostornina potopljenega dela je $V_i = 0{,}6 \cdot 0{,}020 = 0{,}012\,\text{m}^3$.
6. **Preverimo:** vzgon $= 1000 \cdot 9{,}8 \cdot 0{,}012 = 117{,}6\,\text{N}$, kar je enako teži. ✓

### Primer 4 – zdaj ti: lubenica s tržnice

Na tržnici kupiš lubenico z maso $6{,}0\,\text{kg}$. Doma jo ohladiš v koritu z vodo, kjer plava. Kolikšna prostornina lubenice je pod gladino?

**Podatki:** $m = 6{,}0\,\text{kg}$, lubenica plava, $\rho_t = 1000\,\text{kg/m}^3$ (voda), $g = 9{,}8\,\text{m/s}^2$
**Iščemo:** prostornino potopljenega dela $V_i$

:::formula
Plavanje: $F_v = F_g$, torej $\rho_t\,g\,V_i = m\,g$
:::

**Rešitev:**

1. **Pogoj plavanja.** Lubenica miruje, zato je vzgon enak njeni teži: $\rho_t\,g\,V_i = m\,g$.
2. **Krajšamo $g$,** ker nastopa na obeh straneh: $\rho_t\,V_i = m$, torej $V_i = \dfrac{m}{\rho_t}$.
3. Vstavi podatke in rezultat pretvori še v litre.

:::premisli
Koliko je $V_i$?
---
$V_i = \dfrac{6{,}0\,\text{kg}}{1000\,\text{kg/m}^3} = 0{,}0060\,\text{m}^3 = 6{,}0\,\text{L}$. Lubenica izpodrine toliko vode, kolikor sama tehta: $6\,\text{L}$ vode ima maso $6\,\text{kg}$.
:::

## Pogoste napake

- **Mešanje gostot.** Kdor pri lesenem kvadru vstavi v $F_v = \rho_t\,g\,V_i$ gostoto lesa $600\,\text{kg/m}^3$, dobi premajhen vzgon. Vzgon povzroča tekočina, zato vanj spada gostota *tekočine*. Gostoto telesa potrebuješ samo za njegovo težo.
- **Napačna prostornina ali enote.** Pri plavajočem telesu štejemo samo *potopljeni* del, ne celotne prostornine. Pred računanjem pretvori $\text{cm}^3$ in $\text{L}$ v $\text{m}^3$ ($1\,\text{L} = 0{,}001\,\text{m}^3$) in gostoto zapiši v $\text{kg/m}^3$, ne v $\text{g/cm}^3$.
- **»Več vode, večji tlak.«** Tako sklepamo pri bidonu: ima več vode, zato bi moral bolj pritiskati na dno. A večja teža se razporedi na večje dno. Hidrostatični tlak je odvisen le od globine in gostote, ne od količine vode ali oblike posode.
- **»Težka stvar vedno potone.«** Ladja tehta tisoče ton, pa plava. Odloča gostota, ne teža: ladja je skupaj z zrakom v trupu v povprečju redkejša od vode.
- **»Globlje je vzgon večji.«** Ker tlak z globino raste, se zdi, da mora rasti tudi vzgon. Vendar z globino enako narasteta tlak na spodnjo in na zgornjo ploskev, njuna razlika pa ostane enaka. Dokler je telo v celoti potopljeno, je vzgon na vsaki globini enak.

## Povzetek

- Tlak: $p = F/S$, enota $1\,\text{Pa} = 1\,\text{N/m}^2$.
- Hidrostatični tlak: $p_h = \rho\,g\,h$. Narašča z globino, ni odvisen od oblike posode.
- Skupni tlak v tekočini z odprto gladino: $p = p_0 + \rho\,g\,h$.
- Arhimedov zakon: vzgon je enak teži izpodrinjene tekočine, $F_v = \rho_t\,g\,V_i$.
- Telo plava, če je $\rho < \rho_t$, lebdi pri $\rho = \rho_t$ in potone pri $\rho > \rho_t$.
- Pri plavajočem telesu velja $F_v = F_g$.

## Drugače: Na sliki

Predstavljaj si navpičen stolp iz škatel, naloženih ena na drugo. Spodnja škatla nosi vse nad seboj, zgornja skoraj nič. Voda deluje podobno: plast na dnu »nosi« vso vodo nad seboj, zato je tlak tam največji. Tlak torej na grafu v odvisnosti od globine nariše **premico**, ki se začne pri $p_0$ na gladini in raste za $\rho g$ na vsak meter.

Vzgon si predstavljaj kot puščice. Na spodnjo ploskev potopljene kocke kažejo puščice tlaka navzgor in so daljše, na zgornjo ploskev kažejo navzdol in so krajše. Stranske puščice se izničijo. Ostane razlika, ki kaže navzgor, in to je vzgon.

V interaktivni simulaciji spodaj (»Hidrostatični tlak«) spreminjaj globino in opazuj, kako se tlak spreminja. Primerjaj tudi tekočine z različno gostoto. Tlak na isti globini je odvisen samo od globine in gostote tekočine, ne od oblike posode. Simulacija »Vzgon in Arhimedov zakon« spodaj pa pokaže, kako vzgon določa, ali telo plava ali potone.

## Drugače: Iz vsakdanjega življenja

**Potapljanje.** Potapljač na globini $10\,\text{m}$ čuti približno dvojni tlak v primerjavi s površjem: $1\,\text{bar}$ zraka in dodatni približno $1\,\text{bar}$ vode. Zato ga ušesa bolijo, če ne izenači tlaka.

**Jez.** Zid jezu je pri dnu debelejši, ker je tam tlak največji. Tlak ne ve, kako velik je zbiralnik: pri enaki globini je enak v majhnem ribniku in v velikem jezeru.

**Ladja.** Jeklena ploščica potone, jeklena ladja pa plava. Ladja ima obliko skodelice, ki izpodrine veliko vode. Vzgon je enak teži izpodrinjene vode, zato ladja potone le toliko, da je vzgon enak njeni teži.

## Drugače: Korak za korakom s številkami

Recept za naloge z vzgonom:

1. Nariši telo in tekočino. Vriši silo teže navzdol in vzgon navzgor.
2. Vprašaj se: je telo v celoti potopljeno ali plava?
3. Pretvori vse enote v $\text{kg}$, $\text{m}$, $\text{m}^3$.
4. Izračunaj izpodrinjeno prostornino $V_i$ (cela prostornina ali samo potopljeni del).
5. Vstavi v $F_v = \rho_t\,g\,V_i$.
6. Če telo plava ali lebdi, postavi $F_v = F_g$.

**Številčni primer.** Železna utež ima prostornino $0{,}0005\,\text{m}^3$ in maso $3{,}9\,\text{kg}$. Potopimo jo v vodo.

- Gostota uteži: $\rho = 3{,}9 / 0{,}0005 = 7800\,\text{kg/m}^3$.
- Primerjava: $7800 > 1000$, zato potone.
- Vzgon: $F_v = 1000 \cdot 9{,}8 \cdot 0{,}0005 = 4{,}9\,\text{N}$.
- Teža: $F_g = 3{,}9 \cdot 9{,}8 = 38{,}22\,\text{N}$.
- Silomer, na katerega obesimo utež v vodi, pokaže razliko: $38{,}22 - 4{,}9 = 33{,}32\,\text{N}$, kar ustreza teži telesa z maso približno $3{,}4\,\text{kg}$. Utež se zdi lažja.

## Drugače: Z analogijo

Arhimedov zakon je podoben vračilu kavcije za steklenico. Ko vrneš prazno steklenico, ti trgovina vrne denar glede na *steklenico*, ki si jo prinesel nazaj, ne glede na to, kaj si iz nje pil ali koliko ti stane torba.

Pri vzgonu je »vrnjena steklenica« izpodrinjena tekočina. Tekočina telesu »vrne« silo, ki je enaka teži tekočine, ki jo je telo izrinilo s svojega mesta. Ali je telo iz svinca ali iz plute, je vseeno: enaka izpodrinjena prostornina iste tekočine prinese enak vzgon.

Od snovi telesa je odvisno le, ali je to vračilo dovolj. Pluta tehta manj, kot znaša vzgon, zato priplava. Svinec tehta veliko več, zato potone, čeprav dobi enak vzgon kot pluta enake prostornine.

Analogija ima mejo: denar dobiš enkrat, vzgon pa deluje ves čas, dokler je telo v tekočini.

## Drugače: Bolj natančno

**Izpeljava vzgona na kvader.** Vzemimo kvader s ploščino osnovne ploskve $S$ in višino $H$, potopljen navpično v tekočino tako, da je zgornja ploskev na globini $h_1$, spodnja pa na globini $h_2 = h_1 + H$.

- Tlak na zgornji ploskvi: $p_1 = p_0 + \rho_t g h_1$, sila navzdol: $F_1 = p_1 S$.
- Tlak na spodnji ploskvi: $p_2 = p_0 + \rho_t g h_2$, sila navzgor: $F_2 = p_2 S$.
- Stranske sile se na isti globini izničijo.

Rezultanta sil tlaka je

$$F_v = F_2 - F_1 = \rho_t\,g\,(h_2 - h_1)\,S = \rho_t\,g\,H\,S = \rho_t\,g\,V$$

Zunanji tlak $p_0$ se pokrati. Ker je $H S = V$ prostornina kvadra, dobimo Arhimedov zakon. Za telesa poljubne oblike izrek velja splošno, saj ga lahko razumemo kot vsoto veliko majhnih kvadrov.

**Zakaj tlak ni odvisen od posode?** V izpeljavi $p_h = \rho g h$ se ploščina $S$ pokrati, zato rezultat ni odvisen od preseka stolpca.

## Preveri se

? Kolikšen je hidrostatični tlak zaradi vode ($\rho = 1000\,\text{kg/m}^3$) na globini $20\,\text{m}$? Vzemi $g = 9{,}8\,\text{m/s}^2$.
- $20\,000\,\text{Pa}$
~ To je samo $\rho \cdot h$: pozabil si na $g$. Tlak je teža stolpca na ploščino, zato $g$ potrebuješ.
+ $196\,000\,\text{Pa}$
- $196\,\text{Pa}$
~ Tako dobiš, če gostoto vstaviš v $\text{g/cm}^3$ ($1$) namesto v $\text{kg/m}^3$ ($1000$).
- $98\,000\,\text{Pa}$
~ To je tlak na globini $10\,\text{m}$. Tlak je sorazmeren z globino: pri $20\,\text{m}$ je dvakrat večji.
> $p_h = \rho g h = 1000 \cdot 9{,}8 \cdot 20 = 196\,000\,\text{Pa}$, kar je skoraj $2\,\text{bar}$.

? Telo s prostornino $0{,}002\,\text{m}^3$ je v celoti potopljeno v vodo ($\rho_t = 1000\,\text{kg/m}^3$). Kolikšen je vzgon? Vzemi $g = 9{,}8\,\text{m/s}^2$.
- $2\,\text{N}$
~ $1000 \cdot 0{,}002 = 2$ je masa izpodrinjene vode v kilogramih. Vzgon je njena teža, zato pomnoži še z $g$.
- $196\,\text{N}$
~ Decimalna vejica je zamaknjena: tako dobiš s prostornino $0{,}02\,\text{m}^3$. Pazi pri pretvorbi.
+ $19{,}6\,\text{N}$
> $F_v = \rho_t g V_i = 1000 \cdot 9{,}8 \cdot 0{,}002 = 19{,}6\,\text{N}$. Vzgon je enak teži izpodrinjene vode in ni odvisen od gostote telesa.

? Prodajalec ti pri leseni kuhalnici reče: »Les ima gostoto $600\,\text{kg/m}^3$, zato kuhalnica v vodi plava.« Kaj pomeni, da telo plava na vodi?
- Telo je lahko, zato vedno plava.
~ Težka ladja plava, majhna jeklena kroglica pa potone. Odloča gostota, ne teža.
+ Gostota telesa je manjša od gostote vode, zato se telo potopi le toliko, da je vzgon enak njegovi teži.
- Vzgon je večji od teže telesa, dokler telo plava.
~ Vzgon je večji od teže le, ko se potopljeno telo še dviga proti površju. Ko plava v miru, sta sili enaki.
> Telo plava, če je njegova gostota manjša od gostote tekočine. Pri plavajočem telesu je vzgon enak teži, ne večji.

? Na polici so tri posode: A je steklenica olja ($\rho = 920\,\text{kg/m}^3$), olje sega $0{,}30\,\text{m}$ visoko; B je širok bidon vode, voda sega $0{,}25\,\text{m}$ visoko; C je ozka plastenka vode, voda sega $0{,}30\,\text{m}$ visoko. Razvrsti jih po tlaku tekočine na dnu, od največjega.
- B, A, C
~ Bidon ima največ tekočine, a količina ne odloča. Tlak je odvisen od globine in gostote.
- A, C, B
~ Olje je redkejše od vode (zato plava na njej). Pri enaki višini da manjši tlak.
- A in C enako, nato B
~ Višini sta enaki, gostoti pa ne. Tlak je sorazmeren tudi z gostoto.
+ C, A, B
> $p_C = 1000 \cdot 9{,}8 \cdot 0{,}30 = 2940\,\text{Pa}$, $p_A = 920 \cdot 9{,}8 \cdot 0{,}30 \approx 2705\,\text{Pa}$, $p_B = 1000 \cdot 9{,}8 \cdot 0{,}25 = 2450\,\text{Pa}$.

? Kamen, v celoti potopljen v jezero, spuščamo z globine $2\,\text{m}$ na globino $8\,\text{m}$. Kaj se zgodi z vzgonom?
- Poveča se, ker je globlje tlak večji.
~ Tlak naraste na spodnji in na zgornji ploskvi enako; razlika med njima, torej vzgon, ostane enaka.
- Zmanjša se, ker voda nad kamnom pritiska navzdol.
~ Večji pritisk od zgoraj spremlja enako večji pritisk od spodaj. Vzgon se ne zmanjša.
+ Ostane enak.
> Vzgon je $F_v = \rho_t\,g\,V_i$. Gostota vode in prostornina kamna se ne spremenita, zato je vzgon na obeh globinah enak.

:::simboli
p | tlak | p = p_0 + \rho\,g\,h | Pa | v tekočini skupni tlak; splošno p = F/S
F | sila, pravokotna na ploskev | | N
S | ploščina ploskve | | m^2
p_h | hidrostatični tlak | p_h = \rho\,g\,h | Pa
p_0 | zunanji (zračni) tlak | | Pa | približno 100 000 Pa
\rho | gostota | | kg/m^3 | pri tlaku gostota tekočine, pri plavanju gostota telesa
g | težni pospešek | | m/s^2 | približno 9,8 m/s²
h | globina pod gladino | | m
F_g | teža | F_g = m\,g | N
m | masa telesa | m = \rho\,V | kg
F_v | vzgon | F_v = \rho_t\,g\,V_i | N | Arhimedov zakon
\rho_t | gostota tekočine | | kg/m^3
V_i | prostornina potopljenega dela telesa | | m^3 | enaka prostornini izpodrinjene tekočine
V | prostornina telesa | | m^3
a | rob kocke | | m
F_1 | sila tekočine na zgornjo ploskev | | N
F_2 | sila tekočine na spodnjo ploskev | | N
h_1 | globina zgornje ploskve | | m
h_2 | globina spodnje ploskve | | m | h₂ = h₁ + H
H | višina kvadra | | m
:::
