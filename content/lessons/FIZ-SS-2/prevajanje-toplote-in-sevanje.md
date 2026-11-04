---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1879 je Jožef Stefan na Dunaju preučeval meritve irskega fizika Johna Tyndalla. Tyndall je segreval platinasto žico in meril, koliko toplote izseva. Pri približno $1200\,^\circ\mathrm{C}$ je žica sevala skoraj dvanajstkrat več kot pri približno $525\,^\circ\mathrm{C}$. Temperatura v stopinjah Celzija se ni povečala niti za trikrat. Od kod torej dvanajstkratnik?

Stefan je temperaturi zapisal v kelvinih: $798\,\mathrm{K}$ in $1473\,\mathrm{K}$. Razmerje je približno $1{,}85$, njegova četrta potenca pa okoli $11{,}6$. Tako je nastal **Stefanov zakon**: izsevani tok je sorazmeren s četrto potenco absolutne temperature.

Isti zakon danes uporablja brezkontaktni toplomer, ki ti v ambulanti v sekundi izmeri vročino na čelu. Tvoje telo pa ves čas oddaja toploto tudi s **prevajanjem**: skozi kožo, maščobo in obleko. Kako hitro steče toplota skozi plast snovi in koliko toplote izseva telo, opišeta dve enačbi.

## Razlaga

**Toplotni tok.** Iz prejšnje lekcije veš, da je toplota $Q$ energija, ki prehaja s toplejšega na hladnejše telo. Za zdravje pogosto ni pomembno samo, koliko toplote telo izgubi, ampak kako hitro. Toplota, ki preide v eni sekundi, je **toplotni tok** $P$. Merimo ga v vatih, $1\,\mathrm{W} = 1\,\mathrm{J/s}$:

$$P = \frac{Q}{t}$$

**Prevajanje v sliki.** Predstavljaj si plast podkožne maščobe kot ploščo. Na levi strani je toplo notranje tkivo, na desni hladnejša koža. Toplota teče z leve na desno. Delci na topli strani močneje nihajo in trki prenašajo energijo naprej, delec za delcem. Snov pri tem ostane na mestu. Temu načinu prenosa rečemo **prevajanje**.

Kaj se zgodi s tokom skozi tako ploščo, če spremenimo eno stvar naenkrat:

| Spremenimo | Toplotni tok |
|---|---|
| ploščina $\times 2$ | $\times 2$ |
| temperaturna razlika $\times 2$ | $\times 2$ |
| debelina $\times 2$ | $\div 2$ |
| baker namesto maščobe | veliko večji |

Širša plošča je kot več vzporednih poti za toploto. Večja razlika temperatur toploto bolj »žene«. Debelejša plast pa pot podaljša.

:::premisli
Zakaj se ti v mrazu telo samo od sebe zvije v klopčič, z rokami ob telesu?
---
Tako se zmanjša ploščina kože, ki je izpostavljena mrazu. Pri enaki temperaturni razliki in debelini je toplotni tok sorazmeren s ploščino, zato je izguba manjša.
:::

**Toplotna prevodnost.** Zadnja vrstica tabele pove, da je tok odvisen tudi od snovi. To lastnost opiše **toplotna prevodnost** $\lambda$. Približne vrednosti:

| Snov | $\lambda$ [W/(m K)] |
|---|---|
| baker | $400$ |
| steklo | $1$ |
| voda | $0{,}6$ |
| mišica | $0{,}5$ |
| maščoba | $0{,}2$ |
| zrak | $0{,}025$ |

Mirujoči zrak je odličen izolator. Zato greje volnen pulover: med vlakni ujame veliko zraka. Mokra obleka pa zrak izgubi in prevaja skoraj kot voda.

Vse skupaj zapišemo z eno enačbo za ploščo s ploščino $S$, debelino $d$ in temperaturno razliko $\Delta T$ med stranema:

$$P = \frac{\lambda S \Delta T}{d}$$

Razliko temperatur lahko vstaviš v kelvinih ali stopinjah Celzija, saj je razlika v obeh enaka. Debelino pa vedno vstavi v metrih, ploščino v $\mathrm{m^2}$.

**Sevanje.** Toplota pride od Sonca do Zemlje skozi prazen prostor, kjer ni ničesar, kar bi jo prevajalo. Prenaša jo **sevanje**: elektromagnetno valovanje, ki ga oddaja vsako telo s temperaturo nad absolutno ničlo. Žareča žica seva vidno svetlobo, tvoja koža nevidno infrardečo. Prav to ujame termokamera.

Tok, ki ga izseva en kvadratni meter površine, je **gostota toplotnega toka** $j$. Za telo, ki vse vpadno sevanje vpije (**črno telo**), velja Stefanov zakon:

$$j = \sigma T^4$$

$\sigma = 5{,}67 \cdot 10^{-8}\,\mathrm{W/(m^2\,K^4)}$ je Stefanova konstanta, $T$ pa temperatura površine **v kelvinih**. Koža je zelo blizu črnemu telesu. Celotno telo s površino $S$ izseva:

$$P = \sigma S T^4$$

Četrta potenca je močna. Pri dvakrat višji absolutni temperaturi telo izseva $2^4 = 16$-krat več, pri trikrat višji $81$-krat več.

V simulaciji spodaj »Stefanov zakon: sevanje vročega telesa« nastavi temperaturo $5800\,\mathrm{K}$ in polmer $1\,R_\odot$ (to je Sonce). Najprej napovej, kolikokrat se poveča izsevana moč, če temperaturo podvojiš. Nato jo podvoji na $11\,600\,\mathrm{K}$, polmer pa pusti, in preveri napoved.

**Telo tudi prejema.** Stene sobe sevajo nazaj proti tebi. Če ima okolica temperaturo $T_o$, telo v resnici izgubi le razliko med izsevanim in prejetim tokom:

$$P = \sigma S\,(T^4 - T_o^4)$$

:::premisli
Bolnik z normalno temperaturo kože leži v sobi, kjer imajo stene točno enako temperaturo kot njegova koža. Kolikšen je njegov toplotni tok zaradi sevanja? Ali koža v tej sobi preneha sevati?
---
Toplotni tok je nič, ker je $T^4 - T_o^4 = 0$. Koža pa seva naprej: v vsaki sekundi izseva prav toliko, kolikor prejme od sten.
:::

Tretji način prenosa je **konvekcija**: topel zrak ali voda se premika in nosi toploto s seboj. Pri njej se snov premika, pri prevajanju ne.

## Rešeni primeri

### Primer 1: hladni obkladek

Na oteklo koleno položimo vrečko ledu, med kožo in led pa bombažno brisačo. Brisača je debela $3\,\mathrm{mm}$, stik s kožo ima ploščino $150\,\mathrm{cm^2}$. Koža ima $32\,^\circ\mathrm{C}$, led $0\,^\circ\mathrm{C}$. Toplotna prevodnost brisače je $0{,}06\,\mathrm{W/(m\,K)}$. Kolikšen toplotni tok odteka iz kolena na začetku?

**Podatki:** $\lambda = 0{,}06\,\mathrm{W/(m\,K)}$, $d = 3\,\mathrm{mm}$, $S = 150\,\mathrm{cm^2}$, $T_1 = 32\,^\circ\mathrm{C}$, $T_2 = 0\,^\circ\mathrm{C}$
**Iščemo:** toplotni tok $P$

:::formula
$P = \dfrac{\lambda S \Delta T}{d}$
:::

**Rešitev:**

1. Enote pretvorimo v metre, ker je $\lambda$ podana na meter: $d = 0{,}003\,\mathrm{m}$, $S = 0{,}015\,\mathrm{m^2}$.
2. Razlika temperatur: $\Delta T = 32 - 0 = 32\,\mathrm{K}$ (razlika je v °C in K enaka).
3. $P = \dfrac{0{,}06 \cdot 0{,}015 \cdot 32}{0{,}003} = 9{,}6\,\mathrm{W}$.
4. Odgovor: iz kolena na začetku odteka približno $9{,}6\,\mathrm{W}$. Ko se koža ohladi, se tok zmanjša.

### Primer 2: koliko seva koža

Odrasel človek ima površino kože $1{,}8\,\mathrm{m^2}$, temperatura kože je $33\,^\circ\mathrm{C}$. Kožo obravnavamo kot črno telo. Kolikšen toplotni tok izseva?

**Podatki:** $S = 1{,}8\,\mathrm{m^2}$, $T = 33\,^\circ\mathrm{C}$, $\sigma = 5{,}67 \cdot 10^{-8}\,\mathrm{W/(m^2\,K^4)}$
**Iščemo:** izsevani tok $P$

:::formula
$j = \sigma T^4$, nato $P = j S$
:::

**Rešitev:**

1. Temperaturo pretvorimo v kelvine, ker Stefanov zakon velja samo za absolutno temperaturo: $T = 33 + 273 = 306\,\mathrm{K}$.
2. Gostota toka: $j = 5{,}67 \cdot 10^{-8} \cdot 306^4 \approx 497\,\mathrm{W/m^2}$.
3. Celotni tok: $P = 497 \cdot 1{,}8 \approx 895\,\mathrm{W}$.
4. Odgovor: koža izseva približno $895\,\mathrm{W}$. To je veliko več, kot telo proizvede v mirovanju (približno $100\,\mathrm{W}$). Telo se kljub temu ne podhladi, ker hkrati prejema sevanje sten (Primer 4).

### Primer 3: brezkontaktni toplomer

Toplomer izmeri, da bobnič izseva gostoto toplotnega toka $537\,\mathrm{W/m^2}$. Bobnič obravnavamo kot črno telo. Kolikšna je njegova temperatura v stopinjah Celzija? Ali ima otrok vročino (nad $38\,^\circ\mathrm{C}$)?

**Podatki:** $j = 537\,\mathrm{W/m^2}$, $\sigma = 5{,}67 \cdot 10^{-8}\,\mathrm{W/(m^2\,K^4)}$, meja za vročino $38\,^\circ\mathrm{C}$
**Iščemo:** temperaturo $T$

:::formula
Iz $j = \sigma T^4$ izrazimo $T = \sqrt[4]{\dfrac{j}{\sigma}}$
:::

**Rešitev:**

1. Tokrat je neznanka temperatura, zato Stefanov zakon obrnemo.
2. $T^4 = \dfrac{537}{5{,}67 \cdot 10^{-8}} \approx 9{,}47 \cdot 10^{9}\,\mathrm{K^4}$.
3. Četrti koren: $T \approx 312\,\mathrm{K}$ (na kalkulatorju dvakrat zaporedoma koreniš).
4. V stopinjah Celzija: $312 - 273 = 39\,^\circ\mathrm{C}$.
5. Odgovor: bobnič ima približno $39\,^\circ\mathrm{C}$, otrok ima vročino. Za primerjavo: pri $37\,^\circ\mathrm{C}$ bi toplomer izmeril okoli $524\,\mathrm{W/m^2}$, torej le dobra $2\,\%$ manj.

### Primer 4: zdaj ti

Novorojenček s površino kože $0{,}20\,\mathrm{m^2}$ in temperaturo kože $35\,^\circ\mathrm{C}$ leži v sobi, kjer imajo stene $23\,^\circ\mathrm{C}$. Kolikšen toplotni tok izgubi s sevanjem?

**Podatki:** $S = 0{,}20\,\mathrm{m^2}$, $T = 35\,^\circ\mathrm{C}$, $T_o = 23\,^\circ\mathrm{C}$, $\sigma = 5{,}67 \cdot 10^{-8}\,\mathrm{W/(m^2\,K^4)}$
**Iščemo:** toplotni tok $P$ zaradi sevanja

:::formula
$P = \sigma S\,(T^4 - T_o^4)$
:::

**Rešitev:**

1. V kelvinih: $T = 308\,\mathrm{K}$, $T_o = 296\,\mathrm{K}$.
2. Koža izseva $\sigma T^4 \approx 510{,}3\,\mathrm{W/m^2}$, od sten prejme $\sigma T_o^4 \approx 435{,}3\,\mathrm{W/m^2}$.
3. Izračunaj razliko na kvadratni meter in jo pomnoži s površino.

:::premisli
Kolikšen je toplotni tok?
---
Razlika je $75{,}0\,\mathrm{W/m^2}$, toplotni tok pa $P = 75{,}0 \cdot 0{,}20 = 15{,}0\,\mathrm{W}$. Za majhno telo je to veliko, zato imajo inkubatorji tople stene.
:::

## Pogoste napake

- **Stopinje Celzija v Stefanovem zakonu.** Kdor vstavi $33^4$ namesto $306^4$, dobi tok, ki je več tisočkrat premajhen. Stefanov zakon velja za absolutno temperaturo, saj pri $0\,^\circ\mathrm{C}$ telo še vedno seva. Pred računom vedno prištej $273$.
- **»Dvakrat toplejše seva dvakrat več.«** Sevanje ni premo sorazmerno s temperaturo, ampak s $T^4$. Pri dvakrat višji absolutni temperaturi je tok $16$-krat večji.
- **»Kovina je hladnejša od lesa.«** V isti sobi imata enako temperaturo. Kovina ima veliko večjo prevodnost, zato iz roke odvaja večji toplotni tok in roka se hitreje hladi. Koža čuti tok, ne temperature predmeta.
- **»Sevajo samo vroča, žareča telesa.«** Seva vsako telo, tudi led in ti. Pomembna je razlika med izsevanim in prejetim sevanjem, $T^4 - T_o^4$.
- **Centimetri v formuli za prevajanje.** Če $d = 1\,\mathrm{cm}$ vstaviš kot $1$, dobiš stokrat premajhen tok. Debelino in ploščino najprej pretvori v $\mathrm{m}$ in $\mathrm{m^2}$.

## Povzetek

- Toplotni tok je toplota v časovni enoti: $P = \dfrac{Q}{t}$, enota $\mathrm{W}$.
- Prevajanje skozi plast: $P = \dfrac{\lambda S \Delta T}{d}$; $\lambda$ je toplotna prevodnost v $\mathrm{W/(m\,K)}$. Kovine dobro prevajajo, mirujoči zrak in maščoba slabo.
- Seva vsako telo. Stefanov zakon za črno telo: $j = \sigma T^4$, $P = \sigma S T^4$, $\sigma = 5{,}67 \cdot 10^{-8}\,\mathrm{W/(m^2\,K^4)}$, $T$ v kelvinih.
- Dvakrat višja absolutna temperatura pomeni $16$-krat več sevanja.
- Telo izgublja razliko med izsevanim in prejetim: $P = \sigma S\,(T^4 - T_o^4)$.

## Drugače: Z analogijo

Prevajanje je zelo podobno električnemu toku skozi upornik, ki ga poznaš iz Ohmovega zakona:

| Elektrika | Toplota |
|---|---|
| napetost $U$ | razlika $\Delta T$ |
| tok $I$ | toplotni tok $P$ |
| upor $R$ | $\dfrac{d}{\lambda S}$ |

Daljša in tanjša žica ima večji upor, debelejša in ožja plast ima večji »toplotni upor«. Tok je v obeh primerih »gonilo« deljeno z uporom. Plasti, ki ležijo ena na drugi (koža, maščoba, majica, bunda), so kot zaporedno vezani uporniki: upori se seštejejo, zato več tankih plasti oblačil dobro greje.

Sevanje te analogije nima: njegov tok ni sorazmeren z razliko temperatur, ampak z razliko četrtih potenc.

## Drugače: Iz vsakdanjega življenja

- **Bos na ploščicah.** Ploščice in preproga imajo enako temperaturo, a ploščice bolje prevajajo. Iz stopal odvajajo več toplote, zato se zdijo hladnejše.
- **Kapica za dojenčka.** Glava dojenčka ima glede na telo veliko površino. Kapica z ujetim zrakom zmanjša prevajanje in sevanje skozi to površino.
- **Mraz ob oknu.** V topli sobi te ob velikem hladnem oknu zebe, čeprav ni prepiha. Okno ima nizko $T_o$, zato telo proti njemu izgubi več s sevanjem.
- **Zlata folija reševalcev.** Ponesrečenca zavijejo v tanko svetlečo folijo. Svetleča notranja stran odbije infrardeče sevanje kože nazaj k telesu, zunanja pa malo seva, zato telo izgubi manj toplote s sevanjem.

## Preveri se

? Trije primeri so prevajanje, eden je sevanje. Kateri izstopa?
- Roka se ohladi na kovinski ograji.
~ Pri dotiku kovine toplota prehaja s trki delcev skozi snov, to je prevajanje.
- Hladni obkladek skozi brisačo ohladi koleno.
~ Toplota gre skozi brisačo od delca do delca. To je prevajanje.
+ Obraz začuti toploto kamina z dveh metrov.
- Žlica v vročem čaju se segreje do ročaja.
~ Energija potuje po kovini od delca do delca. To je prevajanje.
> Med kaminom in obrazom je zrak, ki slabo prevaja; toploto prenaša infrardeče sevanje.

? Plast maščobe ima $\lambda = 0{,}2\,\mathrm{W/(m\,K)}$, ploščino $0{,}5\,\mathrm{m^2}$ in debelino $1\,\mathrm{cm}$. Razlika temperatur je $2\,\mathrm{K}$. Kolikšen je toplotni tok?
- $0{,}2\,\mathrm{W}$
~ Debelino si vstavil kot $1$ namesto $0{,}01\,\mathrm{m}$.
- $0{,}002\,\mathrm{W}$
~ Z debelino si množil. Debelejša plast tok zmanjša, zato debelina stoji v imenovalcu.
+ $20\,\mathrm{W}$
> $P = \dfrac{0{,}2 \cdot 0{,}5 \cdot 2}{0{,}01} = 20\,\mathrm{W}$.

? Kovinska kljuka in lesena vrata sta v isti sobi. Zakaj se kljuka na dotik zdi hladnejša?
- Ker ima kovina nižjo temperaturo od lesa.
~ V isti sobi imata enako temperaturo. Razlikujeta se po prevodnosti.
+ Ker kovina bolje prevaja in iz roke odvaja večji toplotni tok.
- Ker kovina seva mraz proti roki.
~ Mraz ni nekaj, kar bi se sevalo. Roka toploto izgublja, kovina pa jo hitreje odvaja.
> Koža zazna, kako hitro izgublja toploto. Pri večji $\lambda$ je toplotni tok večji, zato kljuka »hladi« bolj.

? Ana računa, koliko izseva $1\,\mathrm{m^2}$ kože s $33\,^\circ\mathrm{C}$. Kateri korak je napačen? (1) $j = \sigma T^4$; (2) $j = 5{,}67 \cdot 10^{-8} \cdot 33^4\,\mathrm{W/m^2}$; (3) $j \approx 0{,}067\,\mathrm{W/m^2}$.
- Korak (1): pravilno bi bilo $j = \sigma T$.
~ Tok ni premo sorazmeren s temperaturo. Stefan je pokazal, da raste s $T^4$.
+ Korak (2): temperatura mora biti v kelvinih, $306\,\mathrm{K}$.
- Korak (3): račun $5{,}67 \cdot 10^{-8} \cdot 33^4$ je napačen.
~ Ta račun je pravilen. Napaka je že prej: vstavljena je napačna temperatura.
> Stefanov zakon velja za absolutno temperaturo. S $306\,\mathrm{K}$ dobimo $j \approx 497\,\mathrm{W/m^2}$.

? Medicinska sestra mora podhlajenega pacienta zaščititi pred izgubo toplote s sevanjem. Kaj najbolj pomaga?
- Pacienta prestavi bliže hladnemu oknu, kjer je več svežega zraka.
~ Hladno okno ima nizko $T_o$, zato bi bila razlika $T^4 - T_o^4$ še večja.
- Nič, ker podhlajeno telo s temperaturo pod $37\,^\circ\mathrm{C}$ ne seva.
~ Seva vsako telo nad absolutno ničlo, tudi podhlajeno.
+ Zavije ga v svetlečo reševalno folijo in ga položi v prostor s toplimi stenami.
> Folija odbije sevanje kože nazaj k telesu, tople stene (višja $T_o$) pa zmanjšajo razliko $T^4 - T_o^4$.

:::simboli
P | toplotni tok | P = \frac{Q}{t} | W | pri sevanju $P = \sigma S T^4$
Q | toplota | | J
t | čas | | s
\lambda | toplotna prevodnost | | W/(m\,K) | lastnost snovi
S | ploščina (površina telesa) | | m^2
\Delta T | temperaturna razlika med stranema plasti | | K | enaka v K in °C
d | debelina plasti | | m
j | gostota toplotnega toka | j = \sigma T^4 | W/m^2 | tok skozi $1\,\mathrm{m^2}$ površine
\sigma | Stefanova konstanta | | W/(m^2\,K^4) | $5{,}67 \cdot 10^{-8}$
T | absolutna temperatura površine telesa | | K
T_o | absolutna temperatura okolice (sten) | | K
:::
