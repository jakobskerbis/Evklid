---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Aplikacija na telefonu ti pove, da je od parkirišča do planinske koče $4{,}0\,\mathrm{km}$. Na tabli ob koči piše $4{,}3\,\mathrm{km}$. Isti dan navigacija za vožnjo z Gorenjske do morja pokaže $105\,\mathrm{km}$, števec v avtu pa na koncu $105{,}3\,\mathrm{km}$.

Obakrat se je telefon zmotil za $0{,}3\,\mathrm{km}$. Pa je bila zmota enako huda? Pri pohodu je $300\,\mathrm{m}$ dodatnega vzpona opazna razlika, pri vožnji do morja je skoraj nihče ne opazi.

Števila, s katerimi računamo v resničnem svetu, so skoraj vedno **približki**: odčitki termometra, dežemera, metra ali štoparice. Zato moramo znati povedati dvoje: za koliko se približek lahko zmoti in ali je ta zmota velika ali majhna. V tej snovi gradimo to dvoje korak za korakom, na koncu pa ocenimo še, kako se napake prenesejo v vsoto, razliko, produkt in količnik.

## Razlaga

**1. Približek in zaokroževanje na decimalke.** Iracionalnih števil, kot sta $\sqrt{2}$ in $\pi$, ne moremo zapisati do konca, saj je njihov decimalni zapis neskončen in neperiodičen. Zato vzamemo **končni decimalni približek** in pišemo $\approx$.

Zaokrožimo tako, da pogledamo prvo števko, ki jo odvržemo. Če je $0$, $1$, $2$, $3$ ali $4$, zadnjo ohranjeno števko pustimo. Če je $5$ ali več, jo povečamo za $1$.

| število | 1 decimalka | 2 decimalki | 3 decimalke |
|---|---|---|---|
| $\sqrt{2} = 1{,}41421\ldots$ | $1{,}4$ | $1{,}41$ | $1{,}414$ |
| $\pi = 3{,}14159\ldots$ | $3{,}1$ | $3{,}14$ | $3{,}142$ |

Pri $\pi$ na tri decimalke je odvržena števka $5$, zato se $1$ poveča v $2$.

*Preizkus v eni vrstici:* zaokroži $2{,}71828$ na dve decimalki. Rešitev: $2{,}72$, ker je odvržena števka $8$.

**2. Zaokroževanje na mesta.** Velika števila zaokrožimo na desetice, stotice ali tisočice. Triglav je visok $2864\,\mathrm{m}$. Na stotice je to $2900\,\mathrm{m}$, na tisočice $3000\,\mathrm{m}$. Odrezana mesta zapolnimo z ničlami, da število ostane enako veliko: $29$ bi bil napačen zapis.

Zaokrožujemo vedno iz **izvirnega** števila, nikoli v več korakih. Število $2{,}449$ na eno decimalko je $2{,}4$. Kdor najprej zaokroži na $2{,}45$ in nato še enkrat, dobi napačno $2{,}5$.

*Preizkus v eni vrstici:* koliko je $2864$ na desetice? Rešitev: $2860$.

**3. Absolutna napaka.** Naj bo $x$ točna vrednost in $\bar{x}$ njen približek. **Absolutna napaka** je razdalja med njima na številski premici:

$$\Delta x = |\bar{x} - x|$$

Za $\pi \approx 3{,}14$ je $\Delta x = |3{,}14 - 3{,}14159\ldots| \approx 0{,}0016$. Pri zaokroževanju na dve decimalki absolutna napaka nikoli ne preseže $0{,}005$, na eno decimalko pa ne $0{,}05$.

Pri meritvi točne vrednosti ne poznamo. Takrat je $\Delta x$ **meja napake**, ki jo določa merilo (npr. pol najmanjšega razdelka). Zapis $h = (42 \pm 1)\,\mathrm{cm}$ za višino snežne odeje pomeni, da točna vrednost leži v intervalu $[41, 43]$:

:::risba premica
opis: Številska premica od 40 do 44 centimetrov. Izmerjena vrednost 42 je označena s piko. Interval od 41 do 43 je obarvan: tam leži točna vrednost. Od 42 do vsakega krajišča je 1 centimeter, to je absolutna napaka.
od: 40
do: 44
korak: 1
interval: 41 .. 43 | točna vrednost
točka: 42 | izmerjeno
:::

Absolutna napaka ima isto enoto kot količina.

*Preizkus v eni vrstici:* v katerem intervalu je točna vrednost, če je $t = (12{,}0 \pm 0{,}2)\,\mathrm{s}$? Rešitev: $[11{,}8;\ 12{,}2]$.

**4. Relativna napaka.** Vrnimo se k telefonu. Absolutna napaka je obakrat $0{,}3\,\mathrm{km}$, a pri koči je to velik delež poti, pri morju pa majhen. Ta delež je **relativna napaka**:

$$\delta x = \frac{\Delta x}{|x|}$$

Ker točnega $x$ pri meritvi ne poznamo, delimo kar s približkom $|\bar{x}|$; razlika je zanemarljiva. Relativna napaka nima enote, pogosto jo zapišemo v odstotkih (pomnožimo s $100\,\%$).

Pri koči je $\dfrac{0{,}3}{4{,}3} \approx 7{,}0\,\%$, pri morju $\dfrac{0{,}3}{105{,}3} \approx 0{,}28\,\%$. Zdaj je razlika vidna v številu.

:::premisli
Pero ptice izmeriš na $(18{,}0 \pm 0{,}5)\,\mathrm{cm}$, drevo na $(24{,}0 \pm 0{,}5)\,\mathrm{m}$. Kateri meritvi bi zaupal bolj? Napovej, nato preveri z relativno napako.
---
Drevesu. Absolutna napaka pri peresu je manjša ($0{,}5\,\mathrm{cm}$ proti $0{,}5\,\mathrm{m}$), relativna pa je večja: $\dfrac{0{,}5}{18} \approx 2{,}8\,\%$ proti $\dfrac{0{,}5}{24} \approx 2{,}1\,\%$. Natančnost primerjamo z relativno napako.
:::

**5. Napaka vsote in razlike.** Na dveh merilnih mestih je padlo $x = (12 \pm 1)\,\mathrm{mm}$ in $y = (8 \pm 1)\,\mathrm{mm}$ dežja. V najslabšem primeru se obe napaki zgodita v isto smer, zato se **absolutni napaki seštejeta**:

$$\Delta(x + y) \le \Delta x + \Delta y \qquad \Delta(x - y) \le \Delta x + \Delta y$$

Tudi pri razliki se napaki *seštejeta*: najmanjši $x$ in največji $y$ dasta najmanjšo razliko. Vsota je $(20 \pm 2)\,\mathrm{mm}$.

*Preizkus v eni vrstici:* koliko je $(30 \pm 0{,}5)\,\mathrm{m} - (10 \pm 0{,}5)\,\mathrm{m}$? Rešitev: $(20 \pm 1)\,\mathrm{m}$.

**6. Napaka produkta in količnika.** Travnik je pravokotnik s stranicama $a = (40 \pm 0{,}5)\,\mathrm{m}$ in $b = (25 \pm 0{,}5)\,\mathrm{m}$. Ploščina je $S = 1000\,\mathrm{m^2}$. Absolutnih napak tu ne moremo sešteti: $0{,}5\,\mathrm{m} + 0{,}5\,\mathrm{m}$ so metri, ploščina pa ima kvadratne metre. Pri produktu in količniku se **približno seštejeta relativni napaki**:

$$\delta(x \cdot y) \approx \delta x + \delta y \qquad \delta\!\left(\frac{x}{y}\right) \approx \delta x + \delta y$$

Pravilo je **ocena**, ne natančna enakost. Preverimo ga na travniku na oba načina:

| način | spodnja meja | zgornja meja | napaka $S$ |
|---|---|---|---|
| natančno | $39{,}5 \cdot 24{,}5 = 967{,}75$ | $40{,}5 \cdot 25{,}5 = 1032{,}75$ | do $32{,}75\,\mathrm{m^2}$ |
| ocena | | | $32{,}5\,\mathrm{m^2}$ |

Ocena: $\delta a + \delta b = \dfrac{0{,}5}{40} + \dfrac{0{,}5}{25} = 0{,}0325$, torej $3{,}25\,\%$ od $1000\,\mathrm{m^2}$, kar je $32{,}5\,\mathrm{m^2}$. Natančna meja je $32{,}75\,\mathrm{m^2}$. Razlika $0{,}25\,\mathrm{m^2}$ je ravno $0{,}5 \cdot 0{,}5$, majhen kotiček, ki ga ocena izpusti (glej »Drugače: Na sliki«).

:::premisli
Zakaj pri produktu ne moremo kar sešteti absolutnih napak, pri vsoti pa jih lahko?
---
Pri vsoti imata podatka isto enoto in se njuni napaki neposredno seštejeta. Pri produktu se vsaka napaka še pomnoži z drugim podatkom (napaka v $a$ »raztegne« ves trak dolžine $b$), enoti pa se ne ujemata. Relativna napaka je brez enote in pove, kolikšen delež se spremeni, zato jo lahko seštejemo.
:::

Za količnik je tipičen zgled hitrost $v = \dfrac{s}{t}$: relativna napaka hitrosti je približno vsota relativnih napak poti in časa. Zato je pri merjenju hitrosti pomemben vsak podatek posebej, ne le tisti z večjo absolutno napako.

## Rešeni primeri

### Primer 1 (lažji): višina Triglava

Triglav je visok $2864\,\mathrm{m}$. Turistični letak ga zaokroži na stotice, otroška knjiga na tisočice. Izračunaj obe absolutni in relativni napaki.

**Podatki:** točna vrednost $x = 2864\,\mathrm{m}$; približka na stotice in na tisočice
**Iščemo:** $\Delta x$ in $\delta x$ za oba približka

:::formula
$\Delta x = |\bar{x} - x|$, $\quad \delta x = \dfrac{\Delta x}{|x|}$
:::

**Rešitev:**

1. Na stotice: odvržena števka desetic je $6$, zato $\bar{x} = 2900\,\mathrm{m}$.
2. $\Delta x = |2900 - 2864| = 36\,\mathrm{m}$, ker merimo razdaljo med številoma.
3. $\delta x = \dfrac{36}{2864} \approx 0{,}013 = 1{,}3\,\%$.
4. Na tisočice: $\bar{x} = 3000\,\mathrm{m}$, $\Delta x = 136\,\mathrm{m}$, $\delta x = \dfrac{136}{2864} \approx 4{,}7\,\%$.
5. Odgovor: letak se zmoti za $36\,\mathrm{m}$ ($1{,}3\,\%$), knjiga za $136\,\mathrm{m}$ ($4{,}7\,\%$).

### Primer 2: koliko snega se je stopilo

Meteorolog je včeraj izmeril snežno odejo $h_1 = (42 \pm 1)\,\mathrm{cm}$, danes $h_2 = (35 \pm 1)\,\mathrm{cm}$. Koliko snega se je stopilo in kako natančno to vemo?

**Podatki:** $h_1 = 42\,\mathrm{cm}$, $\Delta h_1 = 1\,\mathrm{cm}$, $h_2 = 35\,\mathrm{cm}$, $\Delta h_2 = 1\,\mathrm{cm}$
**Iščemo:** razliko $d = h_1 - h_2$, njeno absolutno napako $\Delta d$ in relativno napako $\delta d$

:::formula
$\Delta(h_1 - h_2) \le \Delta h_1 + \Delta h_2$, $\quad \delta d = \dfrac{\Delta d}{d}$
:::

**Rešitev:**

1. $d = 42 - 35 = 7\,\mathrm{cm}$.
2. Pri razliki se absolutni napaki seštejeta: $\Delta d = 1 + 1 = 2\,\mathrm{cm}$.
3. $\delta d = \dfrac{2}{7} \approx 0{,}29 = 29\,\%$.
4. Za primerjavo: vsaka meritev posebej ima le $\dfrac{1}{42} \approx 2{,}4\,\%$ oziroma $\dfrac{1}{35} \approx 2{,}9\,\%$.
5. Odgovor: stopilo se je $(7 \pm 2)\,\mathrm{cm}$ snega. Relativna napaka razlike je skoraj $30\,\%$, ker smo odšteli dve podobni števili.

### Primer 3 (težji): hitrost potoka

Da bi izmerila hitrost potoka, Nika spusti list v vodo. List preplava $s = (50 \pm 0{,}5)\,\mathrm{m}$ v času $t = (40 \pm 1)\,\mathrm{s}$.
a) Oceni hitrost in njeno napako.
b) Kako natančno bi morala meriti čas, da bi bila relativna napaka hitrosti največ $2\,\%$?

**Podatki:** $s = 50\,\mathrm{m}$, $\Delta s = 0{,}5\,\mathrm{m}$, $t = 40\,\mathrm{s}$, $\Delta t = 1\,\mathrm{s}$; cilj $\delta v \le 2\,\%$
**Iščemo:** $v$, $\delta v$, $\Delta v$; največji dovoljeni $\Delta t$

:::formula
$v = \dfrac{s}{t}$, $\quad \delta v \approx \delta s + \delta t$, $\quad \Delta v \approx \delta v \cdot v$
:::

**Rešitev:**

1. $v = \dfrac{50}{40} = 1{,}25\,\mathrm{m/s}$.
2. $\delta s = \dfrac{0{,}5}{50} = 0{,}01 = 1\,\%$ in $\delta t = \dfrac{1}{40} = 0{,}025 = 2{,}5\,\%$.
3. Količnik: relativni napaki seštejemo, $\delta v \approx 1\,\% + 2{,}5\,\% = 3{,}5\,\%$.
4. $\Delta v \approx 0{,}035 \cdot 1{,}25 \approx 0{,}044\,\mathrm{m/s}$, torej $v \approx (1{,}25 \pm 0{,}04)\,\mathrm{m/s}$.
5. b) Pot ostane enaka, $\delta s = 1\,\%$, zato za čas ostane največ $2\,\% - 1\,\% = 1\,\%$.
6. $\Delta t \le 0{,}01 \cdot 40 = 0{,}4\,\mathrm{s}$.
7. Odgovor: potok teče s hitrostjo približno $(1{,}25 \pm 0{,}04)\,\mathrm{m/s}$. Večji del napake prinese čas; za $2\,\%$ bi morala čas izmeriti na $0{,}4\,\mathrm{s}$ natančno.

### Primer 4: zdaj ti

Polje sončnic je pravokotnik s stranicama $(120 \pm 1)\,\mathrm{m}$ in $(80 \pm 1)\,\mathrm{m}$. Oceni ploščino in njeno absolutno napako.

**Podatki:** $a = 120\,\mathrm{m}$, $\Delta a = 1\,\mathrm{m}$, $b = 80\,\mathrm{m}$, $\Delta b = 1\,\mathrm{m}$
**Iščemo:** $S$, $\delta S$ in $\Delta S$

:::formula
$S = a \cdot b$, $\quad \delta S \approx \delta a + \delta b$, $\quad \Delta S \approx \delta S \cdot S$
:::

**Rešitev:**

1. $S = 120 \cdot 80 = 9600\,\mathrm{m^2}$.
2. $\delta a = \dfrac{1}{120}$ in $\delta b = \dfrac{1}{80}$.
3. Seštej relativni napaki in izračunaj $\Delta S$, nato preveri:

:::premisli
Koliko sta $\delta S$ in $\Delta S$?
---
$\delta S \approx \dfrac{1}{120} + \dfrac{1}{80} \approx 0{,}021 = 2{,}1\,\%$ in $\Delta S \approx 9600 \cdot \left(\dfrac{1}{120} + \dfrac{1}{80}\right) = 200\,\mathrm{m^2}$. Ploščina je $(9600 \pm 200)\,\mathrm{m^2}$. Natančne meje so $119 \cdot 79 = 9401$ in $121 \cdot 81 = 9801$, kar se z oceno lepo ujema.
:::

## Pogoste napake

- **Pri razliki napaki odštejem.** »$(42 \pm 1) - (35 \pm 1) = 7 \pm 0$.« Napačno, ker se lahko prva meritev zmoti navzgor, druga navzdol. Popravek: tudi pri razliki absolutni napaki seštej, $\Delta d = 2\,\mathrm{cm}$.
- **Pri produktu seštejem absolutni napaki.** »Ploščina travnika ima napako $0{,}5 + 0{,}5 = 1\,\mathrm{m^2}$.« Napačno: metri in kvadratni metri se ne seštevajo, napaka stranice se pomnoži z drugo stranico. Popravek: seštej relativni napaki, nato pomnoži s $S$.
- **Pri vsoti seštejem relativni napaki.** Pri $(12 \pm 1) + (8 \pm 1)$ dobiš $\dfrac{1}{12} + \dfrac{1}{8} \approx 21\,\%$ namesto pravih $\dfrac{2}{20} = 10\,\%$. Popravek: vsota in razlika → absolutni napaki; produkt in količnik → relativni napaki.
- **Majhna absolutna napaka pomeni natančno meritev.** Pero z napako $0{,}5\,\mathrm{cm}$ je izmerjeno manj natančno kot drevo z napako $0{,}5\,\mathrm{m}$. Popravek: natančnost primerjaj z relativno napako.
- **Zaokroževanje v več korakih.** $2{,}449 \to 2{,}45 \to 2{,}5$ je napačno. Popravek: vedno zaokroži iz izvirnega števila, $2{,}449 \approx 2{,}4$.

## Povzetek

- Približek zapišemo z $\approx$. Zaokrožimo glede na prvo odvrženo števko ($0$–$4$ navzdol, $5$–$9$ navzgor), vedno iz izvirnega števila. Pri zaokroževanju na mesta odrezana mesta nadomestimo z ničlami.
- Absolutna napaka $\Delta x = |\bar{x} - x|$ ima enoto količine; pri meritvi je meja napake in $x = \bar{x} \pm \Delta x$ pomeni interval $[\bar{x} - \Delta x, \bar{x} + \Delta x]$.
- Relativna napaka $\delta x = \dfrac{\Delta x}{|x|} \approx \dfrac{\Delta x}{|\bar{x}|}$ je brez enote, pogosto v odstotkih. Z njo primerjamo natančnost.
- Vsota in razlika: absolutni napaki se seštejeta. Razlika podobnih števil ima veliko relativno napako.
- Produkt in količnik: relativni napaki se približno seštejeta (ocena; natančna meja je malo večja).

## Drugače: Na sliki

Travnik s stranicama $a$ in $b$ narišimo skupaj s pasovoma, za katera se lahko podaljša, če sta stranici izmerjeni prekratko:

:::risba skica
opis: Velik pravokotnik a krat b je osnovna ploščina. Desno ob njem je ozek pas širine Δa in višine b, nad njim ozek pas višine Δb in dolžine a, v desnem zgornjem kotu pa majhen kvadratek Δa krat Δb.
območje: -1; -1 .. 13; 8
enota: 22
pravokotnik: 0; 0 .. 8; 5 | modra
pravokotnik: 8; 0 .. 9; 5 | oranžna
pravokotnik: 0; 5 .. 8; 6 | oranžna
pravokotnik: 8; 5 .. 9; 6 | rdeča
napis: 4; 2,5 | a · b | sredina | debelo
napis: 9,2; 2,5 | b · Δa | desno
napis: 4; 6,2 | a · Δb | nad
napis: 9,2; 6,2 | Δa · Δb | desno
napis: 4; -0,3 | a | pod
napis: -0,3; 2,5 | b | levo
:::

- Pas desno ima ploščino $b \cdot \Delta a$. Deljeno z $ab$ je to $\dfrac{\Delta a}{a} = \delta a$.
- Pas zgoraj ima ploščino $a \cdot \Delta b$. Deljeno z $ab$ je to $\delta b$.
- Kotiček $\Delta a \cdot \Delta b$ je zelo majhen in ga ocena izpusti. Zato je $\delta S \approx \delta a + \delta b$ le približno pravilo.

Pri travniku je kotiček $0{,}5 \cdot 0{,}5 = 0{,}25\,\mathrm{m^2}$: točno razlika med $32{,}75$ in $32{,}5$.

## Drugače: Bolj natančno

Zapišimo največji možni vrednosti z relativnima napakama: $a(1 + \delta a)$ in $b(1 + \delta b)$. Njun produkt je

$$ab(1 + \delta a)(1 + \delta b) = ab(1 + \delta a + \delta b + \delta a\,\delta b)$$

Relativna napaka produkta je torej $\delta a + \delta b + \delta a\,\delta b$. Če sta $\delta a$ in $\delta b$ nekaj odstotkov, je njun produkt tisočinka ali manj, zato ga zanemarimo.

Pri količniku je največja vrednost $\dfrac{x(1 + \delta x)}{y(1 - \delta y)}$. Za majhen $\delta y$ je $\dfrac{1}{1 - \delta y} \approx 1 + \delta y$ (npr. $\dfrac{1}{0{,}98} = 1{,}0204\ldots$), zato je spet $\delta \approx \delta x + \delta y$.

Relativno napako bi morali deliti s točno vrednostjo $|x|$, ki je ne poznamo. Če je $\delta x$ majhen, je razlika med $\dfrac{\Delta x}{|x|}$ in $\dfrac{\Delta x}{|\bar{x}|}$ še veliko manjša od same napake, zato je deljenje s približkom dovolj dobro.

## Preveri se

? Dolžino kuščarja so izmerili in rezultat prikazali na premici. Kolikšna je absolutna napaka meritve?
:::risba premica
opis: Številska premica od 12 do 13 centimetrov s korakom 0,1. Pika pri 12,4 je izmerjena vrednost. Obarvan interval od 12,2 do 12,6 je interval, v katerem leži točna dolžina.
od: 12
do: 13
korak: 0,1
interval: 12,2 .. 12,6 | točna dolžina
točka: 12,4 | izmerjeno
:::
- $0{,}4\,\mathrm{cm}$
~ To je dolžina celega intervala. Absolutna napaka je razdalja od izmerjene vrednosti do krajišča, torej polovica.
+ $0{,}2\,\mathrm{cm}$
- $12{,}6\,\mathrm{cm}$
~ To je zgornja meja točne vrednosti, ne napaka. Napaka je razlika $12{,}6 - 12{,}4$.
> Interval $[12{,}2;\ 12{,}6]$ ima središče $12{,}4$, do vsakega krajišča je $0{,}2\,\mathrm{cm}$: $\ell = (12{,}4 \pm 0{,}2)\,\mathrm{cm}$.

? Zakaj pri ploščini pravokotnika seštejemo relativni napaki stranic, ne absolutnih?
- Ker je relativna napaka vedno manjša od absolutne.
~ To ni res in ni razlog: $\delta x$ in $\Delta x$ imata različne enote, zato ju sploh ne primerjamo.
- Ker se pri produktu napake odštejejo.
~ Napake se v najslabšem primeru vedno povečajo, nikoli odštejejo.
+ Ker se napaka ene stranice pomnoži z drugo stranico; delež spremembe (relativna napaka) pa se približno sešteje.
> Pas ob stranici $a$ ima ploščino $b \cdot \Delta a$, kar je delež $\delta a$ ploščine. Enako za drugo stranico, zato $\delta S \approx \delta a + \delta b$.

? (brez računala) Dva dežemera sta izmerila $(12 \pm 1)\,\mathrm{mm}$ in $(8 \pm 1)\,\mathrm{mm}$ dežja. Oceni relativno napako vsote v odstotkih.
= 10 % | 0,5
~ 21 | Seštel si relativni napaki $\dfrac{1}{12} + \dfrac{1}{8}$. Pri vsoti se seštejeta absolutni napaki: $\dfrac{2}{20}$.
~ 5 | Vzel si le napako enega dežemera. Absolutni napaki se seštejeta v $2\,\mathrm{mm}$.
> Vsota je $(20 \pm 2)\,\mathrm{mm}$, relativna napaka $\dfrac{2}{20} = 10\,\%$.

? Ploščina kvadratnega ribnika je ocenjena z relativno napako $4\,\%$. Kolikšna je največ relativna napaka, s katero so izmerili stranico (v odstotkih)?
= 2 % | 0,1
~ 4 | Ploščina je $a \cdot a$, zato se relativna napaka stranice šteje dvakrat: $\delta S \approx 2\,\delta a$.
~ 8 | Napako si podvojil, a pot je obratna: iz $\delta S$ dobiš $\delta a$ z deljenjem z $2$.
> $\delta S \approx \delta a + \delta a = 2\,\delta a = 4\,\%$, zato $\delta a \approx 2\,\%$.

? Vremenska postaja meri temperaturo z napako $\pm 0{,}1\,^\circ\mathrm{C}$. Zjutraj pokaže $12{,}3\,^\circ\mathrm{C}$, opoldne $12{,}8\,^\circ\mathrm{C}$. Kaj lahko zanesljivo povemo o tem, za koliko se je ogrelo?
- $(0{,}5 \pm 0)\,^\circ\mathrm{C}$, ker se napaki pri odštevanju odštejeta.
~ Zjutraj se je termometer lahko zmotil navzgor, opoldne navzdol. Pri razliki se absolutni napaki seštejeta.
- $(0{,}5 \pm 0{,}1)\,^\circ\mathrm{C}$, ker ima termometer napako $0{,}1\,^\circ\mathrm{C}$.
~ Napaka nastopi pri vsaki od dveh meritev, zato šteje dvakrat.
+ $(0{,}5 \pm 0{,}2)\,^\circ\mathrm{C}$; relativna napaka razlike je kar $40\,\%$.
> $\Delta = 0{,}1 + 0{,}1 = 0{,}2\,^\circ\mathrm{C}$ in $\dfrac{0{,}2}{0{,}5} = 40\,\%$. Razlika dveh podobnih meritev je veliko manj natančna od vsake posebej.

<<RACUN
vrednost: abs(3.14-pi) | 0.0016
vrednost: 0.3/4.3*100 | 7.0
vrednost: 0.3/105.3*100 | 0.28
vrednost: 2900-2864 | 36
vrednost: 36/2864*100 | 1.3
vrednost: 136/2864*100 | 4.7
vrednost: 2/7 | 0.29
vrednost: 1/42*100 | 2.4
vrednost: 0.5/40+0.5/25 | 0.0325
vrednost: 40.5*25.5 | 1032.75
vrednost: 39.5*24.5 | 967.75
vrednost: 0.5/50+1/40 | 0.035
vrednost: 0.035*1.25 | 0.044
vrednost: 0.01*40 | 0.4
vrednost: 9600*(1/120+1/80) | 200
vrednost: 2/20*100 | 10
vrednost: 0.5/24*100 | 2.1
vrednost: 0.5/18*100 | 2.8
vrednost: 0.2/0.5*100 | 40
>>

:::simboli
x | točna vrednost | | | tudi prvi podatek pri vsoti in produktu
\bar{x} | približek | | |
\Delta x | absolutna napaka | \Delta x = \lvert \bar{x} - x \rvert | | ista enota kot $x$
\delta | relativna napaka (pred oznako količine: $\delta x$, $\delta a$, $\delta S$, $\delta v$) | \delta x = \frac{\Delta x}{\lvert x \rvert} | – | pogosto v odstotkih
y | drugi podatek | | |
\Delta y | absolutna napaka drugega podatka | | |
a | dolžina pravokotnika | | m |
b | širina pravokotnika | | m |
\Delta a | absolutna napaka dolžine | | m |
\Delta b | absolutna napaka širine | | m |
S | ploščina pravokotnika | S = a \cdot b | m^2 |
\Delta S | absolutna napaka ploščine | \Delta S \approx \delta S \cdot S | m^2 |
h_1, h_2 | višina snežne odeje včeraj in danes | | cm |
\Delta h_1, \Delta h_2 | absolutni napaki višin | | cm |
d | razlika višin (stopljeni sneg) | d = h_1 - h_2 | cm |
\Delta d | absolutna napaka razlike | \Delta d = \Delta h_1 + \Delta h_2 | cm |
v | hitrost potoka | v = \frac{s}{t} | m/s |
s | pot lista | | m |
t | čas | | s |
\Delta v | absolutna napaka hitrosti | \Delta v \approx \delta v \cdot v | m/s |
:::
