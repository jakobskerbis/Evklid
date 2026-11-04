---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. Pri obnovi fasade režejo stiroporne plošče z rezalnikom na vročo žico. Žica je pregorela, nova dolga žica naj bi imela upornost okoli $50\,\Omega$. Na delovni mizi imaš vir, ampermeter in analogni voltmeter. Oba merilnika sta brezhibna in oba odčitka prebereš natančno.

- Prvič priklopiš voltmeter neposredno na žico, ampermeter pa pred to vzporedno vezavo. Odčitaš $10{,}0\,\mathrm{V}$ in $0{,}210\,\mathrm{A}$, torej $47{,}6\,\Omega$.
- Drugič vežeš ampermeter neposredno v vejo z žico, voltmeter pa na oba skupaj. Odčitaš $10{,}2\,\mathrm{V}$ in $0{,}200\,\mathrm{A}$, torej $51{,}0\,\Omega$.

Ista žica, dva različna rezultata. Kateri je pravi? Ugani, preden bereš naprej. Namig: o merilnikih ti še nihče ni povedal vsega.

Ta lekcija razreši uganko in pokaže dva načina, kako izmeriš upornost in impedanco: **U-I metodo** in **mostično vezje**.

## Razlaga

**1. Upornost iz dveh odčitkov.** Pri U-I metodi izmeriš napetost na merjencu in tok skozenj. Upornost izračunaš iz Ohmovega zakona. Izračunani vrednosti rečemo **izmerjena upornost** $R_m$:

$$R_m = \frac{U}{I}$$

*Hitri preizkus:* koliko je $R_m$ pri $10{,}2\,\mathrm{V}$ in $0{,}200\,\mathrm{A}$? (Odgovor: $51{,}0\,\Omega$.)

**2. Merilnika nista nevidna.** Ampermeter ima majhno notranjo upornost $R_A$, voltmeter veliko notranjo upornost $R_V$. Idealni ampermeter bi imel $R_A = 0$, idealni voltmeter $R_V \to \infty$. V uganki je $R_A = 1\,\Omega$ in $R_V = 1\,\mathrm{k\Omega}$, kar je značilno za preprost analogni voltmeter na nizkem območju.

*Hitri preizkus:* zakaj mora biti $R_V$ velika? (Da skozi voltmeter teče čim manj toka.)

**3. Vezava A: voltmeter neposredno na merjencu.** Voltmeter kaže pravo napetost na žici. Ampermeter pa meri tok skozi žico *in* tok skozi voltmeter. Zato je $R_m$ premajhna. Tok skozi voltmeter je

$$I_V = \frac{U}{R_V}$$

in pravo upornost dobiš, če ga odšteješ:

$$R_x = \frac{U}{I - I_V}$$

V uganki je $I_V = \dfrac{10{,}0}{1000} = 0{,}01$ ampera, skozi žico teče $0{,}210 - 0{,}010 = 0{,}200\,\mathrm{A}$, zato $R_x = 50{,}0\,\Omega$.

:::premisli
Ostaneš pri vezavi A in istem voltmetru ($R_V = 1\,\mathrm{k\Omega}$), merjenec pa zamenjaš z upornikom $10\,\mathrm{k\Omega}$. Bo napaka večja ali manjša kot pri žici? Zakaj?
---
Precej večja. Skozi voltmeter teče desetkrat več toka kot skozi upornik, zato ampermeter kaže skoraj samo tok voltmetra. Izmeriš vzporedno vezavo obeh: $R_m \approx 909\,\Omega$ namesto $10\,000\,\Omega$. Vezava A je dobra le, ko je $R_x$ veliko manjša od $R_V$.
:::

**4. Vezava B: ampermeter neposredno v veji merjenca.** Zdaj ampermeter kaže pravi tok. Voltmeter pa meri napetost na žici *in* padec napetosti na ampermetru. Izmeriš zaporedno vezavo, zato je $R_m$ prevelika za $R_A$:

$$R_x = \frac{U}{I} - R_A$$

V uganki: $51{,}0\,\Omega - 1\,\Omega = 50{,}0\,\Omega$. Oba odčitka sta bila torej »napačna«, pravi rezultat je vmes.

*Hitri preizkus:* pri katerih merjencih je $R_A$ skoraj nepomembna? (Pri velikih upornostih.)

**5. Katero vezavo izbrati.** Sistematično napako vezave poznaš vnaprej. Primerjaj ju v tabeli:

| vezava | točno kaže | $R_m$ | rel. napaka |
|---|---|---|---|
| A | napetost | $R_x \parallel R_V$ | $\approx -R_x/R_V$ |
| B | tok | $R_x + R_A$ | $+R_A/R_x$ |

Napaki sta enaki, ko je $R_x/R_V = R_A/R_x$. Mejna upornost je

$$R_g = \sqrt{R_A R_V}$$

Manjše upornosti od $R_g$ meri z vezavo A, večje z vezavo B. V uganki je $R_g \approx 31{,}6\,\Omega$, žica ima $50\,\Omega$, zato je boljša vezava B: napaka $+2\,\%$ namesto $-4{,}8\,\%$.

*Hitri preizkus:* digitalni voltmeter ima $R_V = 10\,\mathrm{M\Omega}$, ampermeter $R_A = 0{,}1\,\Omega$. Katera vezava za upornik $100\,\Omega$? (A, ker je $R_g = 1\,\mathrm{k\Omega}$.)

**6. Mostično vezje.** Pri U-I metodi rezultat pokvarijo merilniki. Most se temu izogne, ker ničesar ne meri pod obremenitvijo: le preveri, ali je razlika potencialov enaka nič. To je **ničelna metoda**.

Wheatstonov most nariši kot romb. Zgornje oglišče je priključeno na plus vira, spodnje na minus. Vsak upornik je ena **veja** mostu. Levo pot od vrha do dna (levo **stranico** mostu) tvorita zgoraj merjenec $R_x$ in spodaj upornik $R_3$. Desno stranico tvorita zgoraj $R_2$ in spodaj $R_4$. Med levim in desnim ogliščem je **ničelni indikator** (občutljiv galvanometer). Vsaka stranica je delilnik napetosti.

Nastavljaš $R_3$ ali razmerje $R_2/R_4$, dokler indikator ne kaže nič. Takrat sta srednji točki na istem potencialu in most je **v ravnovesju**. Produkta upornosti nasprotnih vej sta enaka:

$$R_x R_4 = R_2 R_3$$

$$R_x = \frac{R_2 R_3}{R_4}$$

Točnost rezultata je odvisna le od točnosti znanih upornikov in od občutljivosti indikatorja.

*Hitri preizkus:* $R_2 = R_4$, ravnovesje pri $R_3 = 470\,\Omega$. Koliko je $R_x$? (Odgovor: $470\,\Omega$.)

:::premisli
Most je v ravnovesju. Napetost vira podvojiš. Ali indikator zdaj pokaže odklon? Napovej in utemelji.
---
Ne. Obe stranici sta delilnika z nespremenjenim razmerjem, zato se potenciala obeh srednjih točk podvojita in ostaneta enaka. Večja napetost le poveča občutljivost: pri majhnem neravnovesju je odklon večji in ravnovesje nastaviš natančneje.
:::

**7. Impedanca.** Pri izmenični napetosti se tuljava in kondenzator upirata toku drugače kot upornik. Razmerje efektivnih vrednosti napetosti in toka je **impedanca** $Z$ (njena absolutna vrednost):

$$Z = \frac{U}{I}$$

Tuljava ima upornost navitja $R$ in **induktivno reaktanco** $X_L$. Reaktanca opisuje, kako tuljava zaradi inducirane napetosti zavira izmenični tok; narašča s frekvenco $f$:

$$X_L = 2\pi f L$$

Tu je $L$ induktivnost tuljave. $R$ in $X_L$ se ne seštejeta navadno, ampak kot kateti pravokotnega trikotnika:

$$Z = \sqrt{R^2 + X_L^2}$$

U-I metoda z izmeničnima merilnikoma da le $Z$, ne pa tudi faznega kota (zamika med napetostjo in tokom). Za oba dela impedance uporabiš izmenični most, pri katerem nastaviš dva elementa (glej »Bolj natančno«).

*Hitri preizkus:* zakaj ohmmeter tuljave ne pokaže njene impedance pri $50\,\mathrm{Hz}$? (Ker meri z enosmernim tokom, kjer je $X_L = 0$.)

## Rešeni primeri

### Primer 1: senzor v estrihu

Pod talnim ogrevanjem je v estrih vgrajen temperaturni senzor Pt100. Monter ga izmeri z Wheatstonovim mostom. Razmerna upornika sta $R_2 = 100\,\Omega$ in $R_4 = 1000\,\Omega$. Ravnovesje dobi pri nastavljivem uporu $R_3 = 1078\,\Omega$. Kolikšna je upornost senzorja?

**Podatki:** $R_2 = 100\,\Omega$, $R_4 = 1000\,\Omega$, $R_3 = 1078\,\Omega$, most v ravnovesju
**Iščemo:** upornost senzorja $R_x$

:::formula
Pogoj ravnovesja: $R_x R_4 = R_2 R_3$, torej $R_x = \dfrac{R_2 R_3}{R_4}$
:::

**Rešitev:**

1. Razmerje $R_2/R_4 = 0{,}1$: most deli vrednost nastavljivega upora z deset, zato štiri dekade $R_3$ dajo $R_x$ na $0{,}1\,\Omega$ natančno.
2. $R_x = \dfrac{100 \cdot 1078}{1000} = 107{,}8$ ohma.
3. Pt100 ima pri $0\,^\circ\mathrm{C}$ upornost $100\,\Omega$ in mu upornost raste za približno $0{,}385\,\Omega$ na stopinjo, zato to ustreza približno $20\,^\circ\mathrm{C}$.
4. Odgovor: senzor ima upornost $107{,}8\,\Omega$, estrih ima okoli $20\,^\circ\mathrm{C}$.

### Primer 2: popravek pri vezavi A

Krajšo žico za ročni rezalnik stiropora izmeriš z vezavo A: voltmeter neposredno na žici. Voltmeter ($R_V = 1\,\mathrm{k\Omega}$) kaže $4{,}80\,\mathrm{V}$, ampermeter $0{,}200\,\mathrm{A}$. Kolikšna je prava upornost žice in kolikšno relativno napako bi naredil brez popravka?

**Podatki:** $U = 4{,}80\,\mathrm{V}$, $I = 0{,}200\,\mathrm{A}$, $R_V = 1000\,\Omega$, vezava A
**Iščemo:** pravo upornost $R_x$ in relativno napako $R_m$

:::formula
$R_m = \dfrac{U}{I}$, $\quad I_V = \dfrac{U}{R_V}$, $\quad R_x = \dfrac{U}{I - I_V}$
:::

**Rešitev:**

1. Brez popravka: $R_m = \dfrac{4{,}80}{0{,}200} = 24{,}0$ ohma.
2. Tok skozi voltmeter: $I_V = \dfrac{4{,}80}{1000} = 0{,}0048$ ampera, torej $4{,}8\,\mathrm{mA}$.
3. Skozi žico teče $0{,}200 - 0{,}0048 = 0{,}1952$ ampera, ker ampermeter šteje oba toka.
4. $R_x = \dfrac{4{,}80}{0{,}1952} \approx 24{,}59$ ohma.
5. Relativna napaka: $\dfrac{24{,}0 - 24{,}59}{24{,}59} \approx -0{,}024$, torej $-2{,}4\,\%$. Negativna je, ker vezava A vedno da premajhno upornost.
6. Odgovor: žica ima $24{,}6\,\Omega$; brez popravka bi upornost podcenil za $2{,}4\,\%$.

### Primer 3: tuljava elektromagnetnega ventila

V kotlovnici je ventil, ki ga odpira tuljava za izmenično napetost. Serviser jo najprej priklopi na enosmerno napetost: $6{,}0\,\mathrm{V}$ in $0{,}40\,\mathrm{A}$. Nato na izmenično napetost $24{,}0\,\mathrm{V}$ s frekvenco $50\,\mathrm{Hz}$: tok je $0{,}30\,\mathrm{A}$. Kolikšna je induktivnost tuljave? Notranje upornosti merilnikov zanemari.

**Podatki:** enosmerno: $U_1 = 6{,}0\,\mathrm{V}$, $I_1 = 0{,}40\,\mathrm{A}$; izmenično: $U_2 = 24{,}0\,\mathrm{V}$, $I_2 = 0{,}30\,\mathrm{A}$, $f = 50\,\mathrm{Hz}$
**Iščemo:** induktivnost $L$

:::formula
$R = \dfrac{U_1}{I_1}$, $\quad Z = \dfrac{U_2}{I_2}$, $\quad X_L = \sqrt{Z^2 - R^2}$, $\quad L = \dfrac{X_L}{2\pi f}$
:::

**Rešitev:**

1. Pri enosmernem toku je $X_L = 0$, zato meritev da samo upornost navitja: $R = \dfrac{6{,}0}{0{,}40} = 15$ ohmov.
2. Pri $50\,\mathrm{Hz}$ dobiš impedanco: $Z = \dfrac{24{,}0}{0{,}30} = 80$ ohmov.
3. Iz trikotnika impedance: $X_L = \sqrt{80^2 - 15^2} \approx 78{,}58$ ohma. Ne $80 - 15$, ker sta $R$ in $X_L$ pravokotni komponenti.
4. $2\pi f \approx 314{,}2$ na sekundo, zato $L = \dfrac{78{,}58}{314{,}2} \approx 0{,}250$ henryja.
5. Odgovor: tuljava ima induktivnost približno $0{,}25\,\mathrm{H}$.

### Primer 4: zdaj ti

Upornost grelnega termostata (okoli $2\,\mathrm{k\Omega}$) meriš z ampermetrom $R_A = 5\,\Omega$ in voltmetrom $R_V = 10\,\mathrm{k\Omega}$. Izberi vezavo in iz odčitkov $10{,}05\,\mathrm{V}$ in $5{,}00\,\mathrm{mA}$ izračunaj pravo upornost.

**Podatki:** $R_x \approx 2\,\mathrm{k\Omega}$, $R_A = 5\,\Omega$, $R_V = 10\,000\,\Omega$, $U = 10{,}05\,\mathrm{V}$, $I = 5{,}00\,\mathrm{mA}$
**Iščemo:** primerno vezavo in $R_x$

:::formula
$R_g = \sqrt{R_A R_V}$; pri vezavi B $R_x = \dfrac{U}{I} - R_A$
:::

**Rešitev:**

1. $R_g = \sqrt{5 \cdot 10\,000} \approx 223{,}6$ ohma. Termostat ima veliko več, zato izbereš vezavo B.
2. $I = 5{,}00\,\mathrm{mA} = 0{,}005\,\mathrm{A}$.
3. Izračunaj $R_m$ in odštej $R_A$, nato preveri.

:::premisli
Koliko je $R_x$ in kolikšna bi bila relativna napaka brez popravka?
---
$R_m = \dfrac{10{,}05}{0{,}005} = 2010\,\Omega$, $R_x = 2010 - 5 = 2005\,\Omega$. Brez popravka bi bila napaka $\dfrac{5}{2005} \approx 0{,}25\,\%$.
:::

## Pogoste napake

- **»Eden od odčitkov je pravi.«** V uganki se zdi, da je pravilna ena od vezav. V resnici ima vsaka sistematično napako, ki jo povzroči merilnik. Če poznaš $R_A$ in $R_V$, rezultat popraviš; če ju ne, izbereš vezavo z manjšo napako.
- **Napačno merilo za izbiro vezave.** »Upornost je majhna, ker je manjša od $R_V$, torej vezava A« ni dovolj. Primerjaj $R_x$ z mejno upornostjo $\sqrt{R_A R_V}$, ker štejeta oba merilnika.
- **Zamenjani veji mostu.** $R_x = \dfrac{R_3 R_4}{R_2}$ je napačno, ker množi sosednji veji. Pravilo: produkt nasprotnih vej je enak, $R_x R_4 = R_2 R_3$. Preveri na skrajnem primeru $R_2 = R_4$: takrat mora biti $R_x = R_3$.
- **»Ravnovesje mostu je odvisno od napetosti vira.«** Ni. Napetost vpliva samo na občutljivost, ne na pogoj ravnovesja.
- **Impedanca kot vsota.** $Z = R + X_L$ je napačno, saj sta komponenti pravokotni: $Z = \sqrt{R^2 + X_L^2}$. Napačno je tudi enačiti upornost, izmerjeno z ohmmetrom, z impedanco pri $50\,\mathrm{Hz}$.

## Povzetek

- U-I metoda: $R_m = U/I$. Notranji upornosti merilnikov povzročita sistematično napako.
- Vezava A (voltmeter neposredno na merjencu): $R_m$ premajhna, popravek $R_x = U/(I - U/R_V)$. Za majhne upornosti.
- Vezava B (ampermeter neposredno v veji merjenca): $R_m = R_x + R_A$. Za velike upornosti.
- Mejna upornost $R_g = \sqrt{R_A R_V}$ loči področji obeh vezav.
- Wheatstonov most je ničelna metoda: v ravnovesju velja $R_x R_4 = R_2 R_3$, neodvisno od napetosti vira.
- Impedanca $Z = U/I$ (efektivni vrednosti); za tuljavo $Z = \sqrt{R^2 + X_L^2}$, $X_L = 2\pi f L$.

## Drugače: Na sliki

Predstavljaj si vsako stranico Wheatstonovega mostu kot lestev, ki pelje od plus pola (vrh) do minus pola (dno). Prečka na sredi lestve je srednja točka delilnika.

| stranica | zgornji del | spodnji del | srednja točka |
|---|---|---|---|
| leva | $R_x$ | $R_3$ | potencial $V_L$ |
| desna | $R_2$ | $R_4$ | potencial $V_D$ |

Ničelni indikator je vodoravna »libela« med obema prečkama. Če je $R_x$ prevelika, leva prečka zdrsne niže kot desna in indikator se odkloni v eno smer. Ko nastaviš $R_3$ tako, da sta prečki na isti višini, je libela vodoravna: most je v ravnovesju.

Pri U-I metodi pa si nariši dva pravokotnika. Pri vezavi A je voltmeter »obvoz« okoli merjenca in nanj odteka del toka. Pri vezavi B je ampermeter »stopnica« v isti vrsti kot merjenec in na njem pade del napetosti.

## Drugače: Bolj natančno

**Točna napaka vezave A.** Izmeriš vzporedno vezavo: $R_m = \dfrac{R_x R_V}{R_x + R_V}$. Relativna napaka je

$$e_A = -\frac{R_x}{R_x + R_V}$$

kar je za $R_x \ll R_V$ približno $-R_x/R_V$. Pri vezavi B je $R_m = R_x + R_A$ in $e_B = R_A/R_x$. Iz $|e_A| = e_B$ in približka $R_x \ll R_V$ sledi $R_x^2 = R_A R_V$, torej $R_g = \sqrt{R_A R_V}$.

**Negotovost mostu.** Iz $R_x = R_2 R_3 / R_4$ in pravil za produkt in količnik se relativne negotovosti seštevajo kvadratno (pri nekoreliranih virih): $u_r(R_x) = \sqrt{u_r^2(R_2) + u_r^2(R_3) + u_r^2(R_4)}$. Pri upornikih s toleranco $0{,}01\,\%$ je most zato veliko točnejši od U-I metode z instrumenti razreda $0{,}5$. Dodati moraš še negotovost zaradi končne občutljivosti indikatorja.

**Izmenični most.** Upornike nadomestiš z impedancami in napajaš z izmeničnim virom. Pogoj ravnovesja velja za kompleksne impedance:

$$Z_x Z_4 = Z_2 Z_3$$

Kompleksna enačba sta dve realni enačbi (realni in imaginarni del ali absolutna vrednost in kot), zato moraš nastaviti dva elementa. Primer je Maxwellov most za tuljavo $Z_x = R_x + \mathrm{j}\omega L_x$: $R_2$ in $R_3$ sta upornika, $Z_4$ je vzporedna vezava $R_4$ in kondenzatorja $C_4$. Iz $Z_x = R_2 R_3 \left(\dfrac{1}{R_4} + \mathrm{j}\omega C_4\right)$ dobiš

$$R_x = \frac{R_2 R_3}{R_4}, \qquad L_x = R_2 R_3 C_4$$

Rezultat ni odvisen od frekvence, zato je Maxwellov most uporaben tudi, če frekvenca vira ni natančno znana.

**Zelo majhne upornosti** (zbiralke, spoji kablov) meriš s štirižično vezavo ali Thomsonovim mostom, da upornost priključnih vodnikov ne pokvari rezultata.

## Preveri se

? Kaj velja za Wheatstonov most v ravnovesju?
- Skozi ničelni indikator teče največji tok.
~ V ravnovesju sta srednji točki na istem potencialu, zato skozi indikator ne teče tok.
+ Skozi indikator ne teče tok in velja $R_x R_4 = R_2 R_3$.
- Ravnovesje se poruši, če spremeniš napetost vira.
~ Obe stranici sta delilnika, zato se potenciala srednjih točk spremenita v enakem razmerju. Napetost vpliva le na občutljivost.
- Velja $R_x R_2 = R_3 R_4$.
~ To množi sosednji veji. Enaka sta produkta nasprotnih vej.
> V ravnovesju je razlika potencialov med srednjima točkama nič, zato je $R_x R_4 = R_2 R_3$ in $R_x = R_2 R_3 / R_4$.

? Most je v ravnovesju pri $R_2 = 1000\,\Omega$, $R_4 = 100\,\Omega$ in $R_3 = 47{,}3\,\Omega$. Kolikšna je $R_x$?
- $4{,}73\,\Omega$
~ Razmerje si obrnil: $R_3 R_4 / R_2$. Pravilno je $R_x = R_2 R_3 / R_4$.
+ $473\,\Omega$
- $2114\,\Omega$
~ To je $R_2 R_4 / R_3$: nastavljivi upor je pristal v imenovalcu. $R_3$ je v števcu, ker je nasproti $R_2$ v isti enačbi produktov.
> $R_x = \dfrac{R_2 R_3}{R_4} = \dfrac{1000 \cdot 47{,}3}{100}\,\Omega = 473\,\Omega$.

? Vajenec v kotlovnici računa induktivnost tuljave ventila: (1) z enosmerno napetostjo izmeri $R = 15\,\Omega$; (2) pri $50\,\mathrm{Hz}$ izmeri $Z = 80\,\Omega$; (3) $X_L = Z - R = 65\,\Omega$; (4) $L = X_L/(2\pi f)$. Kateri korak je napačen?
- Korak (1), ker enosmerna meritev ne pove ničesar o tuljavi.
~ Pove: pri enosmernem toku je $X_L = 0$, zato izmeriš ravno upornost navitja.
+ Korak (3), ker se $R$ in $X_L$ seštevata kot kateti: $X_L = \sqrt{Z^2 - R^2}$.
- Korak (4), ker bi moral deliti s frekvenco $f$ in ne z $2\pi f$.
~ Reaktanca je $X_L = \omega L = 2\pi f L$, zato je deljenje z $2\pi f$ pravilno.
> $X_L = \sqrt{80^2 - 15^2}\,\Omega \approx 78{,}6\,\Omega$ in ne $65\,\Omega$, saj sta $R$ in $X_L$ pravokotni komponenti impedance.

? Imaš ampermeter z $R_A = 0{,}2\,\Omega$ in voltmeter z $R_V = 20\,\mathrm{k\Omega}$. Meriš upornik okoli $10\,\Omega$. Kako se primerjata vezavi?
- Vezava B je boljša, ker ampermeter kaže pravi tok.
~ Pravi tok ni dovolj: pri $10\,\Omega$ je padec na $R_A$ kar $2\,\%$ napetosti. Odločata obe notranji upornosti.
+ Vezava A je boljša: napaka okoli $0{,}05\,\%$ proti $2\,\%$ pri vezavi B.
- Obe sta enako dobri, ker je $10\,\Omega$ veliko manj kot $R_V$.
~ Primerjaj z mejno upornostjo $\sqrt{R_A R_V} \approx 63\,\Omega$, ne samo z $R_V$. Pod njo je vezava A boljša.
> Vezava A: $|e_A| \approx R_x/R_V = 10/20\,000 = 0{,}05\,\%$. Vezava B: $e_B = R_A/R_x = 0{,}2/10 = 2\,\%$. Ker je $10\,\Omega < R_g \approx 63\,\Omega$, izbereš vezavo A.

? Električar z ohmmetrom izmeri tuljavo kontaktorja v razdelilni omarici: $120\,\Omega$. Pri $230\,\mathrm{V}$ in $50\,\mathrm{Hz}$ pričakuje tok približno $1{,}9\,\mathrm{A}$, izmeri pa $0{,}25\,\mathrm{A}$. Kaj je razlog?
- Ohmmeter je pokvarjen, ker kaže premajhno upornost.
~ Ohmmeter je pravilno izmeril upornost navitja. Pri enosmernem toku reaktance ni.
- Tok se v tuljavi porabi, zato ga ampermeter pokaže manj.
~ Tok se ne porabi: enak tok teče v tuljavo in iz nje. Manjši je zaradi večje impedance.
+ Pri $50\,\mathrm{Hz}$ ima tuljava še reaktanco, zato je impedanca $230/0{,}25 = 920\,\Omega$ veliko večja od $120\,\Omega$.
> Ohmmeter meri z enosmernim tokom in pokaže le $R$. Pri izmenični napetosti je $Z = U/I = 920\,\Omega$; večino tega prispeva reaktanca $X_L = \sqrt{920^2 - 120^2}\,\Omega \approx 912\,\Omega$.

:::simboli
R_m | izmerjena upornost | R_m = \dfrac{U}{I} | \Omega | brez popravka za merilnika
U | odčitek voltmetra (napetost) | | V | pri izmenični: efektivna vrednost
I | odčitek ampermetra (tok) | | A | pri izmenični: efektivna vrednost
I_V | tok skozi voltmeter | I_V = \dfrac{U}{R_V} | A
R_V | notranja upornost voltmetra | | \Omega
R_A | notranja upornost ampermetra | | \Omega
R_x | prava upornost merjenca | R_x = \dfrac{R_2 R_3}{R_4} | \Omega | iz popravka ali iz mostu
R_g | mejna upornost | R_g = \sqrt{R_A R_V} | \Omega | loči področji vezav A in B
R_2, R_4 | razmerna upornika mostu | | \Omega
R_3 | nastavljivi upor mostu | | \Omega | nastaviš ga do ravnovesja
Z | impedanca (absolutna vrednost) | Z = \dfrac{U}{I} | \Omega
X_L | induktivna reaktanca | X_L = 2\pi f L | \Omega
f | frekvenca | | Hz
L | induktivnost tuljave | L = \dfrac{X_L}{2\pi f} | H
R | upornost navitja tuljave | R = \dfrac{U_1}{I_1} | \Omega | enosmerna meritev
U_1 | enosmerna napetost | | V
I_1 | enosmerni tok | | A
U_2 | izmenična napetost | | V
I_2 | izmenični tok | | A
e_A | relativna napaka vezave A | e_A = -\dfrac{R_x}{R_x + R_V} | –
e_B | relativna napaka vezave B | e_B = \dfrac{R_A}{R_x} | –
Z_x | kompleksna impedanca merjenca | | \Omega
Z_2, Z_3, Z_4 | kompleksne impedance vej mostu | | \Omega
L_x | induktivnost merjene tuljave | L_x = R_2 R_3 C_4 | H | Maxwellov most
C_4 | kapacitivnost v veji 4 | | F
\omega | krožna frekvenca | \omega = 2\pi f | s^{-1}
:::
