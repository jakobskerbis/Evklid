---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. Meteorološka postaja v Ljubljani je v petih aprilskih dneh izmerila povprečno opoldansko temperaturo $20\,°\mathrm{C}$. Štirje od teh petih dni so bili toplejši od $20\,°\mathrm{C}$. Je to sploh mogoče? Preden bereš naprej, poskusi najti pet takih temperatur.

Rešitev obstaja: $22$, $23$, $24$, $25$ in $6\,°\mathrm{C}$. En sam hladen dan, ko je prišla fronta, potegne povprečje navzdol. Kdor sliši le »povprečno $20\,°\mathrm{C}$«, si predstavlja pet podobnih dni, v resnici pa so bili štirje topli in eden mrzel.

Zato ena številka ni vedno dovolj. Vremenoslovci, biologi in zdravniki zbirajo podatke, jih uredijo, narišejo in izberejo tisto **srednjo vrednost**, ki pošteno pove, kaj je »običajno«. Temu postopku rečemo **statistična raziskava**.

## Razlaga

**1. Koraki raziskave.** Vsaka statistična raziskava gre skozi pet korakov:

1. **Vprašanje.** Kaj nas zanima? Na primer: koliko dežja pade v našem kraju v enem tednu?
2. **Zbiranje podatkov.** Podatke dobimo z merjenjem (dežemer), opazovanjem (štejemo ptice na krmilnici) ali anketo (vprašamo sošolce).
3. **Urejanje.** Podatke uredimo po velikosti ali v **frekvenčno tabelo**. **Frekvenca** $f$ pove, kolikokrat se podatek pojavi. **Relativna frekvenca** je delež: $f_r = \dfrac{f}{n}$, kjer je $n$ število vseh podatkov.
4. **Prikaz.** Narišemo diagram.
5. **Sklep.** Izračunamo srednje vrednosti in odgovorimo na vprašanje.

**2. Prikaz.** Učenci so deset dni zapisovali vreme. Uredili so ga v tabelo:

| vreme | frekvenca $f$ | relativna frekvenca | kot v krožnem diagramu |
|---|---|---|---|
| sončno | $5$ | $50\,\%$ | $180°$ |
| oblačno | $3$ | $30\,\%$ | $108°$ |
| deževno | $2$ | $20\,\%$ | $72°$ |

Takšne podatke lahko prikažemo na več načinov. **Stolpčni diagram** primerja frekvence: višji stolpec pomeni pogostejši podatek. **Krožni (tortni) diagram** pokaže deleže celote. Izsek dobi tolikšen del od $360°$, kolikršen je njegov delež: sončnih je bilo pol dni, zato dobijo pol kroga, $180°$. **Črtni diagram** uporabimo, ko se količina spreminja s časom, na primer temperatura iz dneva v dan.

**3. Odkrij sam: kje je »sredina«?** Primerjaj dva tedna z opoldanskimi temperaturami v $°\mathrm{C}$:

- maj: $18$, $20$, $21$, $19$, $22$
- teden iz uganke: $22$, $23$, $24$, $25$, $6$

V obeh tednih je vsota temperatur $100$. Ko jo delimo s $5$, dobimo $20$. Ta številka je **aritmetična sredina** ali **povprečje**:

$$\bar{x} = \frac{\text{vsota vseh podatkov}}{\text{število podatkov}}$$

Zdaj uredi oba tedna po velikosti in poglej srednji podatek:

- maj: $18$, $19$, **$20$**, $21$, $22$
- teden iz uganke: $6$, $22$, **$23$**, $24$, $25$

V maju je srednji podatek enak povprečju. V drugem tednu pa povprečje ($20$) leži pod štirimi dnevi, srednji podatek ($23$) pa med njimi. Opazimo vzorec: **en izstopajoč podatek močno premakne povprečje, srednjega podatka skoraj ne.**

Srednji podatek v po velikosti urejenih podatkih imenujemo **mediana**. Če je podatkov sodo mnogo, sta na sredini dva. Mediana je takrat njuna aritmetična sredina.

:::premisli
V drugem tednu dodamo šesti dan s temperaturo $26\,°\mathrm{C}$. Kolikšna je nova mediana? Napovej, preden računaš.
---
Urejeni podatki so $6$, $22$, $23$, $24$, $25$, $26$. Na sredini sta $23$ in $24$, zato je mediana $\dfrac{23 + 24}{2} = 23{,}5\,°\mathrm{C}$.
:::

**4. Najpogostejši podatek.** Poglej tabelo z vremenom. Ali lahko izračunaš povprečje vremena? Ne: »sončno« in »deževno« nista števili. Lahko pa povemo, kaj se je zgodilo največkrat: sončno vreme. Podatek z največjo frekvenco imenujemo **modus**. Modus je edina srednja vrednost, ki deluje tudi za podatke, ki niso števila in jih ne moremo urediti po velikosti (vreme, smer vetra).

Podatki imajo lahko tudi več modusov, če imata dva podatka enako največjo frekvenco.

V simulaciji spodaj (»Srednje vrednosti podatkov«) so podatki pike na številski premici. Trikotnik pod premico je povprečje, navpična črta je mediana. Povleci piko pri $9$ na $10$, nato še piko pri $8$ na $10$. Opazuj, kako se trikotnik pomakne desno, mediana pa ostane pri $5$.

:::premisli
Na postaji so v enem tednu merili, koliko milimetrov dežja pade na dan. Pet dni je bilo suhih, dva dneva sta bila zelo deževna. Bo povprečje večje ali manjše od mediane? Zakaj?
---
Večje. Mediana je $0\,\mathrm{mm}$, ker je več kot polovica dni suhih. Dva deževna dneva pa dvigneta vsoto, zato je povprečje večje od $0$.
:::

**5. Katero srednjo vrednost izbrati?**

- **Povprečje** uporabi, ko so podatki števila brez močno izstopajočih vrednosti.
- **Mediano** uporabi, ko kakšen podatek močno izstopa (en mrzel dan, ena nevihta).
- **Modus** uporabi, ko podatki niso števila ali ko te zanima najpogostejša vrednost.

## Rešeni primeri

### Primer 1: dež v enem tednu

Dežemer na šolskem vrtu je v sedmih dneh izmeril te količine dežja (v mm): $0$, $4$, $0$, $12$, $3$, $0$, $9$. Izračunaj povprečje, mediano in modus.

**Podatki:** dnevne količine dežja $0$, $4$, $0$, $12$, $3$, $0$, $9\,\mathrm{mm}$; $n = 7$ dni
**Iščemo:** povprečje $\bar{x}$, mediano in modus

:::formula
$\bar{x} = \dfrac{\text{vsota podatkov}}{n}$; mediana je srednji podatek urejenih podatkov; modus je najpogostejši podatek.
:::

**Rešitev:**

1. Vsota: $0 + 4 + 0 + 12 + 3 + 0 + 9 = 28$. Suhe dni štejemo zraven, saj so tudi to meritve.
2. Povprečje: $\bar{x} = \dfrac{28}{7} = 4$, torej $4\,\mathrm{mm}$.
3. Uredimo po velikosti: $0$, $0$, $0$, $3$, $4$, $9$, $12$. Ker je podatkov $7$, je srednji četrti: $3\,\mathrm{mm}$.
4. Podatek $0$ se pojavi trikrat, vsi drugi po enkrat, zato je modus $0\,\mathrm{mm}$.
5. Odgovor: povprečje je $4\,\mathrm{mm}$, mediana $3\,\mathrm{mm}$, modus $0\,\mathrm{mm}$ (največkrat ni deževalo).

### Primer 2: jajca v gnezdih

Ornitologi so v gozdu pregledali $20$ gnezd kosov in prešteli jajca:

| število jajc | število gnezd $f$ |
|---|---|
| $2$ | $2$ |
| $3$ | $5$ |
| $4$ | $8$ |
| $5$ | $5$ |

Izračunaj povprečje, mediano in modus. Kolikšen kot pripada gnezdom s štirimi jajci v krožnem diagramu?

**Podatki:** frekvenčna tabela zgoraj, $n = 20$ gnezd
**Iščemo:** povprečno število jajc $\bar{x}$, mediano, modus in kot izseka za $4$ jajca

:::formula
Pri frekvenčni tabeli: $\bar{x} = \dfrac{\text{vsota (podatek} \cdot f)}{n}$; kot izseka $= \dfrac{f}{n} \cdot 360°$
:::

**Rešitev:**

1. Vsa jajca skupaj: $2 \cdot 2 + 3 \cdot 5 + 4 \cdot 8 + 5 \cdot 5 = 76$. Vsak podatek pomnožimo s frekvenco, ker se ponovi tolikokrat.
2. Povprečje: $\bar{x} = \dfrac{76}{20} = 3{,}8$ jajca.
3. Mediana: gnezda si mislimo urejena po številu jajc. Podatkov je $20$, na sredini sta $10.$ in $11.$ podatek. Prvih $2 + 5 = 7$ gnezd ima največ $3$ jajca, gnezda od $8.$ do $15.$ ($7 + 8 = 15$) pa imajo $4$ jajca. Oba srednja podatka sta $4$, mediana je $4$.
4. Modus: največja frekvenca je $8$, pri $4$ jajcih. Modus je $4$ jajca (ne $8$).
5. Delež gnezd s štirimi jajci: $\dfrac{8}{20} = 0{,}4$, kot: $0{,}4 \cdot 360 = 144$, torej $144°$.
6. Odgovor: povprečje je $3{,}8$ jajca, mediana in modus sta $4$ jajca, izsek meri $144°$.

### Primer 3: manjkajoči dan

Povprečna jutranja temperatura v prvih šestih dneh je bila $14\,°\mathrm{C}$. Ko so dodali sedmi dan, se je povprečje dvignilo na $15\,°\mathrm{C}$. Kolikšna je bila temperatura sedmi dan?

**Podatki:** $\bar{x}_6 = 14\,°\mathrm{C}$ za $6$ dni, $\bar{x}_7 = 15\,°\mathrm{C}$ za $7$ dni
**Iščemo:** temperaturo $t_7$ sedmega dne

:::formula
Iz $\bar{x} = \dfrac{\text{vsota}}{n}$ sledi $\text{vsota} = \bar{x} \cdot n$.
:::

**Rešitev:**

1. Vsota prvih šestih dni: $14 \cdot 6 = 84$, torej $84\,°\mathrm{C}$. Posameznih temperatur ne poznamo, vsoto pa lahko izračunamo iz povprečja.
2. Vsota vseh sedmih dni: $15 \cdot 7 = 105$, torej $105\,°\mathrm{C}$.
3. Sedmi dan je razlika vsot: $105 - 84 = 21$, torej $21\,°\mathrm{C}$.
4. Preverimo smiselnost: sedmi dan je toplejši od starega povprečja, zato se je povprečje dvignilo.
5. Odgovor: sedmi dan je bilo $21\,°\mathrm{C}$.

### Primer 4: zdaj ti

Jutranje temperature v zimskem tednu (v $°\mathrm{C}$), merjeno šest dni: $-3$, $1$, $-1$, $2$, $-4$, $0$. Izračunaj mediano in povprečje (na eno decimalko).

**Podatki:** $-3$, $1$, $-1$, $2$, $-4$, $0\,°\mathrm{C}$; $n = 6$
**Iščemo:** mediano in povprečje $\bar{x}$

:::formula
Pri sodem številu podatkov je mediana aritmetična sredina obeh srednjih podatkov; $\bar{x} = \dfrac{\text{vsota}}{n}$.
:::

**Rešitev:**

1. Uredimo po velikosti: $-4$, $-3$, $-1$, $0$, $1$, $2$.
2. Podatkov je $6$, zato sta na sredini tretji in četrti podatek: $-1$ in $0$.
3. Vsota vseh podatkov je $-3 + 1 - 1 + 2 - 4 + 0 = -5$.
4. Izračunaj sam mediano in povprečje, nato preveri:

:::premisli
Kolikšna sta mediana in povprečje?
---
Mediana: $\dfrac{-1 + 0}{2} = -0{,}5\,°\mathrm{C}$. Povprečje: $\dfrac{-5}{6} \approx -0{,}8\,°\mathrm{C}$.
:::

## Pogoste napake

- **Mediana brez urejanja.** Za $7$, $2$, $9$, $4$, $5$ učenec reče: »Mediana je $9$, ker je na sredini zapisa.« Vrstni red zapisa je naključen. Najprej uredi: $2$, $4$, $5$, $7$, $9$. Mediana je $5$.
- **Modus je frekvenca.** V primeru z gnezdi učenec zapiše »modus je $8$«. Število $8$ je frekvenca, pove le, kolikokrat se podatek pojavi. Modus je sam podatek: $4$ jajca.
- **Povprečje iz tabele brez frekvenc.** $\dfrac{2 + 3 + 4 + 5}{4} = 3{,}5$ je napačno, ker vsako število jajc šteje le enkrat. Vsak podatek pomnoži s frekvenco in deli s številom vseh gnezd.
- **Pozabljene ničle.** Pri dežju učenec izpusti suhe dni in deli s številom deževnih dni. Suh dan je meritev $0\,\mathrm{mm}$ in šteje v $n$.
- **Povprečje pri izstopajočem podatku.** »Povprečno $20\,°\mathrm{C}$« iz uganke zveni kot pet podobnih dni. Ko en podatek močno izstopa, opiši podatke z mediano ali pokaži diagram.

## Povzetek

- Statistična raziskava: vprašanje, zbiranje, urejanje (frekvenčna tabela), prikaz, sklep.
- Frekvenca $f$ pove, kolikokrat se podatek pojavi; relativna frekvenca $f_r = \dfrac{f}{n}$.
- Prikazi: stolpčni (primerjava), krožni (deleži, kot $= f_r \cdot 360°$), črtni (spreminjanje s časom).
- Povprečje $\bar{x} = \dfrac{\text{vsota}}{n}$; pri tabeli vsak podatek pomnožimo s frekvenco.
- Mediana je srednji podatek urejenih podatkov; pri sodem $n$ sredina obeh srednjih.
- Modus je najpogostejši podatek; edini deluje tudi za podatke, ki niso števila in jih ne moremo urediti.
- Izstopajoč podatek močno premakne povprečje, mediane skoraj ne.

## Drugače: Korak za korakom s številkami

Podatki: število sončnih ur v petih dneh: $7$, $2$, $9$, $4$, $5$.

1. **Preštej** podatke: $n = 5$.
2. **Uredi** jih: $2$, $4$, $5$, $7$, $9$.
3. **Mediana**: $n$ je liho, srednji je tretji podatek, $5$ ur.
4. **Seštej**: $2 + 4 + 5 + 7 + 9 = 27$.
5. **Povprečje**: $\dfrac{27}{5} = 5{,}4$ ure.
6. **Modus**: vsak podatek se pojavi enkrat, zato modusa ni (ali: vsi so enako pogosti).
7. **Preveri**: povprečje mora biti med najmanjšim ($2$) in največjim ($9$) podatkom. $5{,}4$ je med njima.

Če bi bil šesti dan oblačen ($0$ ur), bi bila vsota še vedno $27$, a deliš s $6$: povprečje pade na $4{,}5$. Mediana postane sredina $4$ in $5$, torej $4{,}5$.

## Drugače: Kot zgodba

Tina je poleti pomagala dedku, ki je opazovalec na vremenski postaji. Vsako jutro je zapisala temperaturo v zvezek. Po tednu jo je sosed vprašal: »Kakšen je bil teden?«

Tina je seštela vse temperature in delila s sedem. »Povprečno $17$ stopinj,« je rekla. Dedek se je nasmehnil: »Pa veš, da so bile v sredo zjutraj le $3$ stopinje, ker je ponoči padla toča? Ostale dni je bilo okoli $19$.«

Tina je temperature uredila od najnižje do najvišje in pogledala srednjo, četrto po vrsti. Bila je $19$. »Mediana pove, kakšno je bilo običajno jutro,« je ugotovila. »Povprečje pa je pokvarila ena sama mrzla sreda.«

Na koncu je dedku narisala črtni diagram. Na njem je bil padec v sredo viden na prvi pogled. Sosed je razumel takoj, brez računanja.

## Preveri se

? Katera trditev o mediani je pravilna?
- Mediana je podatek, ki se pojavi največkrat.
~ To je modus. Mediana je povezana z vrstnim redom podatkov, ne s pogostostjo.
- Mediana je vsota podatkov, deljena s številom podatkov.
~ To je povprečje (aritmetična sredina).
+ Mediana je srednji podatek, ko podatke uredimo po velikosti.
- Mediana je srednji podatek v takem vrstnem redu, kot smo podatke zapisali.
~ Vrstni red zapisa je naključen. Brez urejanja po velikosti »sredina« nič ne pomeni.
> Mediano dobimo tako, da podatke uredimo po velikosti in vzamemo srednjega (pri sodem številu podatkov sredino obeh srednjih).

? V petih dneh so izmerili debelino novega snega (v cm): $12$, $15$, $0$, $9$, $14$. Kolikšno je povprečje?
- $12{,}5\,\mathrm{cm}$
~ Dan brez snega si izpustil in delil s $4$. Tudi $0\,\mathrm{cm}$ je meritev, zato deliš s $5$.
- $12\,\mathrm{cm}$
~ To je mediana (srednji urejeni podatek), ne povprečje.
+ $10\,\mathrm{cm}$
- $50\,\mathrm{cm}$
~ To je vsota. Deliti jo moraš še s številom dni.
> Vsota je $12 + 15 + 0 + 9 + 14 = 50$, povprečje $\dfrac{50}{5} = 10\,\mathrm{cm}$.

? Luka je za sončne ure $7$, $2$, $9$, $4$, $5$ zapisal: »Mediana je $9$, ker je $9$ na sredini.« Kje je napaka?
- Napake ni, $9$ je res na sredini.
~ Na sredini je v zapisu, ne po velikosti. Pri mediani so podatki vedno urejeni.
+ Podatkov ni uredil po velikosti; pravilna mediana je $5$.
- Moral bi izračunati $\dfrac{27}{5} = 5{,}4$.
~ To je povprečje. Luka je iskal mediano, zato mora podatke le urediti.
> Urejeni podatki so $2$, $4$, $5$, $7$, $9$. Srednji, tretji podatek je $5$.

? Postaji A in B sta pet dni merili največjo hitrost vetra (v km/h). A: $10$, $12$, $11$, $13$, $54$. B: $20$, $21$, $19$, $20$, $20$. Obe imata povprečje $20\,\mathrm{km/h}$. Kaj velja?
- Na obeh postajah je bilo enako vetrovno, ker imata enako povprečje.
~ Enako povprečje ne pomeni enakih podatkov. Pri A en nevihten dan dvigne povprečje.
+ Običajen dan je bil na postaji A mirnejši kot na B; to pokaže mediana ($12$ proti $20\,\mathrm{km/h}$).
- Na postaji A je bilo bolj vetrovno, ker je tam izmerjena največja hitrost.
~ Ena izstopajoča meritev ne pove, kakšni so bili ostali dnevi. Štirje dnevi na A so bili mirnejši od vseh na B.
> Mediana A je $12\,\mathrm{km/h}$, mediana B $20\,\mathrm{km/h}$. Povprečje A je visoko le zaradi enega nevihtnega dne.

? Vremenska postaja je $30$ dni beležila smer vetra: sever $4$-krat, jug $7$-krat, vzhod $3$-krat, zahod $16$-krat. Katero srednjo vrednost lahko smiselno navede?
- Povprečno smer vetra.
~ Smeri niso števila, zato jih ne moreš seštevati in deliti.
- Mediano smeri vetra.
~ Smeri neba ne moremo urediti od najmanjše do največje, zato mediana nima pomena.
+ Modus: najpogosteje je pihal zahodnik.
> Za podatke, ki niso števila in jih ne moremo urediti, je smiseln le modus, podatek z največjo frekvenco: zahod ($16$-krat).

:::simboli
\bar{x} | aritmetična sredina (povprečje) | \bar{x} = \frac{\text{vsota podatkov}}{n}
n | število vseh podatkov | | |
f | frekvenca (kolikokrat se podatek pojavi) | | | f/n je relativna frekvenca
:::
