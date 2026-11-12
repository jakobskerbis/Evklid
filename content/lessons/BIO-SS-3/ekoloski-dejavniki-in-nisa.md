---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Petra je medicinska sestra v zdravstvenem domu. Ob dveh popoldne odvzame dva vzorca: urin bolnice z vnetjem mehurja in bris bolnika, pri katerem zdravnik sumi na gonorejo. Kurir v laboratorij pride šele čez tri ure.

Navodila laboratorija na steni pravijo dvoje. Urin takoj v hladilnik. Bris za gonokoke nikoli v hladilnik, ampak pri sobni temperaturi ali v termostat. Petra se vpraša: zakaj je za en vzorec mraz dober, za drugega pa usoden?

Odgovor je v tem, da vsako živo bitje, tudi bakterija, živi le v določenem razponu razmer. Ta razpon je pri različnih vrstah različno širok in različno postavljen. Kdor ga pozna, zna hraniti vzorce, zdravila in hrano ter razložiti, zakaj nekatere vrste živijo skoraj povsod, druge pa le na enem mestu.

## Razlaga

**Bakterija v termostatu.** V laboratoriju so bakterijo *Escherichia coli* (iz črevesja, pogost povzročitelj vnetja mehurja) gojili pri različnih temperaturah. Merili so, kolikokrat na uro se celica razdeli:

| Temperatura | Delitve na uro | Stanje |
|---|---|---|
| $4\,^\circ\mathrm{C}$ | $0$ | ne raste, a živi |
| $10\,^\circ\mathrm{C}$ | $0{,}2$ | raste počasi |
| $20\,^\circ\mathrm{C}$ | $1$ | raste |
| $30\,^\circ\mathrm{C}$ | $2{,}2$ | raste hitro |
| $37\,^\circ\mathrm{C}$ | $3$ | najhitreje |
| $42\,^\circ\mathrm{C}$ | $2{,}4$ | raste hitro |
| $46\,^\circ\mathrm{C}$ | $0{,}5$ | raste počasi |
| $50\,^\circ\mathrm{C}$ | $0$ | celice propadajo |

Ko točke povežemo, dobimo krivuljo v obliki hriba:

:::risba graf
opis: Krivulja strpnosti bakterije E. coli za temperaturo. Vodoravno temperatura od 0 do 50 stopinj Celzija, navpično delitve na uro. Krivulja se začne pri 8 stopinjah (minimum), doseže vrh 3 delitve na uro pri 37 stopinjah (optimum) in pade na nič pri 48 stopinjah (maksimum). Desno od vrha pada bolj strmo kot levo.
x: 0 .. 50 | 10 | temperatura (°C)
y: 0 .. 3,5 | 1 | delitve na uro
črta: 8; 0 -> 10; 0,2 -> 20; 1 -> 30; 2,2 -> 37; 3 -> 42; 2,4 -> 46; 0,5 -> 48; 0 | modra debelo
točka: 8; 0 | minimum 8 | nad levo | oranžna
točka: 37; 3 | optimum 37 | nad | oranžna
točka: 48; 0 | maksimum 48 | nad desno | oranžna
podnapis: Krivulja strpnosti E. coli: minimum, optimum in maksimum
:::

Taki sliki rečemo **krivulja strpnosti**. Na njej preberemo tri točke. **Minimum** je najnižja vrednost dejavnika, pri kateri vrsta še raste (za *E. coli* okoli $8\,^\circ\mathrm{C}$; v tabeli leži med $4$ in $10\,^\circ\mathrm{C}$, zato ga odčitamo s krivulje). **Optimum** je vrednost, pri kateri ji gre najbolje ($37\,^\circ\mathrm{C}$, kar je ravno temperatura človeškega telesa). **Maksimum** je najvišja še znosna vrednost (okoli $48\,^\circ\mathrm{C}$).

Vse med minimumom in maksimumom je **območje strpnosti** (tudi ekološka valenca). Blizu robov organizem sicer preživi, a je pod stresom in se slabo razmnožuje. Zunaj območja ne raste; če je odmik velik ali traja dolgo, propade.

:::premisli
Temperaturo z optimuma $37\,^\circ\mathrm{C}$ enkrat znižamo za $9\,^\circ\mathrm{C}$, drugič zvišamo za $9\,^\circ\mathrm{C}$. Pri kateri spremembi bo rast bolj prizadeta? Napovej s pomočjo krivulje.
---
Pri zvišanju. Pri $28\,^\circ\mathrm{C}$ se celica še deli približno dvakrat na uro, pri $46\,^\circ\mathrm{C}$ le še $0{,}5$-krat. Desno od optimuma krivulja pade strmo, ker vročina hitro poškoduje beljakovine (encime). Optimum zato ni na sredini območja.
:::

**Abiotski in biotski dejavniki.** Temperatura je le eden od **ekoloških dejavnikov**, to je vplivov okolja na organizem. **Abiotski** dejavniki so neživi: temperatura, svetloba, voda in vlaga, kisik, pH, slanost, hranila v prsti. **Biotski** dejavniki so vplivi drugih organizmov: hrana, plenilci, zajedavci, tekmeci, povzročitelji bolezni. Za bakterijo v mehurju sta pH in temperatura urina abiotska dejavnika, čeprav ju ustvarja človeško telo; bele krvničke, ki jo napadajo, pa so biotski dejavnik.

Za vsak dejavnik ima vrsta svojo krivuljo strpnosti. Kje lahko živi, odloči tisti dejavnik, ki je najbližje robu svojega območja. To je **omejitveni dejavnik** (Liebigov zakon minimuma). Bakterija tetanusa ne prenese kisika, zato se razmnoži le v globoki, ozki rani, kamor zrak ne pride. Kisik je zanjo omejitveni dejavnik, tudi če sta temperatura in hrana idealni. Omejuje torej lahko tudi presežek, ne le pomanjkanje: preveč soli ustavi rast večine bakterij, zato meso solimo.

V simulaciji spodaj, »Abiotski in biotski dejavniki«, uvrsti vseh sedem dejavnikov. Opazi, da so vsi biotski dejavniki *drugi organizmi ali odnosi z njimi*, vsi abiotski pa fizikalne ali kemijske lastnosti okolja.

**Generalisti in specialisti.** Primerjajmo dve krivulji na isti osi:

:::risba graf
opis: Shematski krivulji strpnosti za temperaturo. Generalist ima nizko in široko krivuljo od 0 do 45 stopinj Celzija. Specialist ima visoko in ozko krivuljo od 30 do 38 stopinj.
x: 0 .. 50 | 10 | temperatura (°C)
y: 0 .. 3,5 | 1 | uspešnost
f: 1.5*(1-((x-22.5)/22.5)^2) | modra | 0 .. 45
f: 3*(1-((x-34)/4)^2) | oranžna črtkano | 30 .. 38
napis: 12; 1,6 | generalist | nad | modra
napis: 34; 3,1 | specialist | nad | oranžna
podnapis: Generalist: široko območje. Specialist: ozko območje.
:::

**Generalist** ima široko območje strpnosti za veliko dejavnikov in navadno raznoliko hrano. Bakterija *Listeria* raste od okoli $0\,^\circ\mathrm{C}$ do $45\,^\circ\mathrm{C}$; najdemo jo v prsti, vodi, hrani in v človeku. Med živalmi sta generalista podgana in lisica.

**Specialist** ima ozko območje (pravimo tudi, da je stenovalenten, generalist pa evrivalenten). Gonokok raste le med okoli $30\,^\circ\mathrm{C}$ in $38\,^\circ\mathrm{C}$ in samo na sluznicah človeka. Naglavna uš živi le na človeški glavi in brez gostitelja pogine v dveh dneh. Med ribami je specialist potočna postrv, ki potrebuje hladno vodo, bogato s kisikom.

Specialist je v svojem ozkem območju pogosto uspešnejši od generalista, ob spremembi okolja pa izgubi.

:::premisli
Zakaj so lišaji na drevesih in ličinke vrbnic v potoku dobri kazalci onesnaženosti okolja, podgane pa ne?
---
Lišaji in vrbnice imajo ozko območje strpnosti za onesnaženost zraka oziroma za kisik v vodi. Že majhno poslabšanje jih prežene ali pobije, zato njihova odsotnost opozori nanj. Podgana kot generalist prenese zelo različne razmere, zato iz njene prisotnosti ne sklepamo ničesar.
:::

**Prilagoditve.** Kako lahko gonokok ali uš sploh živita na tako ozkem območju? Ker sta nanj prilagojena. **Prilagoditev** je dedna lastnost, ki je nastala z naravnim izborom skozi mnogo rodov in osebku v danem okolju poveča možnost preživetja in razmnoževanja. Prilagoditve so lahko v zgradbi (kremplji uši za oprijem lasu, debelo krzno severnih živali), v delovanju telesa (zelo zgoščen urin puščavskih glodavcev, temnejša koža ljudi blizu ekvatorja kot zaščita pred UV svetlobo) ali v vedenju (zimsko spanje, selitev ptic).

Od prilagoditve ločimo **aklimatizacijo**. Alpinist, ki tri tedne živi na višini, ima pozneje več rdečih krvničk: ledvice so izločile več hormona eritropoetina. To se zgodi v njegovem življenju in se ne deduje, telo le izrabi del območja strpnosti, ki ga že ima. Prebivalci Tibeta pa imajo dedne prilagoditve na redek zrak, ki so nastale skozi tisoče let.

**Niša, zdaj natančneje.** Iz prejšnje lekcije veš, da ekološka niša pove, *kako* vrsta živi. Zdaj jo lahko opišemo s števili: niša je skupek vseh območij strpnosti (za temperaturo, pH, kisik, hrano …) in vseh odnosov z drugimi vrstami. Niša, ki bi jo vrsta imela sama, brez tekmecev in plenilcev, je **temeljna niša**. Tekmeci in plenilci jo izrinejo iz dela tega prostora, zato je niša, ki jo vrsta v naravi res zaseda, **uresničena niša**, navadno ožja.

**Širina območja.** Širino območja strpnosti za temperaturo izračunamo kot razliko maksimuma in minimuma:

$$\Delta T = T_{\max} - T_{\min}$$

Za *E. coli*: $\Delta T = 48 - 8 = 40$ stopinj. Večja širina pomeni bolj izrazitega generalista za ta dejavnik.

## Rešeni primeri

### Primer 1 (lažji): branje krivulje

Iz tabele in krivulje strpnosti *E. coli* zgoraj odčitaj minimum, optimum in maksimum ter izračunaj širino območja strpnosti za temperaturo.

**Podatki:** rast se začne pri $T_{\min} = 8\,^\circ\mathrm{C}$, vrh je pri $37\,^\circ\mathrm{C}$ s $3$ delitvami na uro, rast se ustavi pri $T_{\max} = 48\,^\circ\mathrm{C}$
**Iščemo:** minimum, optimum, maksimum in širino $\Delta T$

:::formula
Optimum je vrh krivulje, minimum in maksimum sta njeni presečišči z osjo; $\Delta T = T_{\max} - T_{\min}$
:::

**Rešitev:**

1. Minimum je tam, kjer krivulja na levi zapusti os: $8\,^\circ\mathrm{C}$.
2. Optimum je pri vrhu: $37\,^\circ\mathrm{C}$, ker je tam delitev največ.
3. Maksimum je desno presečišče z osjo: $48\,^\circ\mathrm{C}$.
4. Širina: $\Delta T = 48 - 8 = 40$, torej $40\,^\circ\mathrm{C}$.
5. Odgovor: *E. coli* raste med $8\,^\circ\mathrm{C}$ in $48\,^\circ\mathrm{C}$, najbolje pri $37\,^\circ\mathrm{C}$; območje je široko $40\,^\circ\mathrm{C}$.

### Primer 2: Petrin vzorec urina

V Petrinem vzorcu urina je ob odvzemu $1000$ bakterij *E. coli* na mililiter. Koliko bi jih bilo čez $3$ ure, če bi vzorec stal na mizi pri $20\,^\circ\mathrm{C}$, in koliko, če bi bil v hladilniku pri $4\,^\circ\mathrm{C}$? Uporabi tabelo iz razlage.

**Podatki:** $N_0 = 1000$ bakterij/mL, $t = 3\,\mathrm{h}$; pri $20\,^\circ\mathrm{C}$ je $k = 1$ delitev na uro, pri $4\,^\circ\mathrm{C}$ je $k = 0$
**Iščemo:** število bakterij $N$ po $3$ urah v obeh primerih

:::formula
Število delitev $n = k \cdot t$; ob vsaki delitvi se število podvoji: $N = N_0 \cdot 2^{n}$
:::

**Rešitev:**

1. Na mizi: $n = 1 \cdot 3 = 3$ delitve.
2. $N = 1000 \cdot 2^{3} = 8000$ bakterij na mililiter, ker se število trikrat podvoji.
3. V hladilniku: $4\,^\circ\mathrm{C}$ je pod minimumom $8\,^\circ\mathrm{C}$, zato $n = 0$ in $N = 1000 \cdot 2^{0} = 1000$.
4. Odgovor: na mizi bi bilo $8000$ bakterij/mL, v hladilniku ostane $1000$. Laboratorij bi iz toplega vzorca napačno sklepal na hudo okužbo, zato gre urin v hladilnik.

### Primer 3 (težji): kam z brisom?

Petra primerja območji strpnosti dveh bakterij za temperaturo: *Listeria* (pogosta v hrani) od okoli $0\,^\circ\mathrm{C}$ do $45\,^\circ\mathrm{C}$, gonokok od okoli $30\,^\circ\mathrm{C}$ do $38\,^\circ\mathrm{C}$. Katera bakterija je generalist za temperaturo in kolikokrat širše je njeno območje? Ali sme bris za gonokoke v hladilnik ($4\,^\circ\mathrm{C}$)?

**Podatki:** *Listeria*: $T_{\min} = 0\,^\circ\mathrm{C}$, $T_{\max} = 45\,^\circ\mathrm{C}$; gonokok: $T_{\min} = 30\,^\circ\mathrm{C}$, $T_{\max} = 38\,^\circ\mathrm{C}$; hladilnik $4\,^\circ\mathrm{C}$
**Iščemo:** širini območij, njuno razmerje in odločitev o hrambi brisa

:::formula
$\Delta T = T_{\max} - T_{\min}$, razmerje širin je količnik obeh $\Delta T$
:::

**Rešitev:**

1. *Listeria*: $\Delta T = 45 - 0 = 45$, torej $45\,^\circ\mathrm{C}$.
2. Gonokok: $\Delta T = 38 - 30 = 8$, torej $8\,^\circ\mathrm{C}$.
3. Razmerje: $\dfrac{45}{8} \approx 5{,}6$. *Listeria* ima več kot petkrat širše območje, zato je generalist, gonokok specialist.
4. Zdaj ti: primerjaj temperaturo hladilnika z območjem gonokoka in se odloči.

:::premisli
Sme bris za gonokoke v hladilnik? Je hrana v hladilniku varna pred *Listerio*?
---
Ne sme. $4\,^\circ\mathrm{C}$ je daleč pod minimumom $30\,^\circ\mathrm{C}$; občutljivi gonokoki bi propadli in izvid bi bil lažno negativen. Zato bris ostane pri sobni temperaturi ali v termostatu. *Listeria* pa ima minimum okoli $0\,^\circ\mathrm{C}$, zato se v hladilniku še počasi množi: hladilnik hrane pred njo ne zaščiti povsem.
:::

## Pogoste napake

- **»Optimum je na sredini območja.«** Krivulja je pogosto nesimetrična. Pri *E. coli* je optimum $37\,^\circ\mathrm{C}$ le $11$ stopinj pod maksimumom, a $29$ stopinj nad minimumom, ker vročina beljakovine poškoduje hitreje kot mraz. Optimum vedno odčitaj z vrha krivulje.
- **»Kar je v telesu, je biotski dejavnik.«** Temperatura telesa ali pH kože sta za bakterijo abiotska dejavnika, čeprav ju ustvarja živ organizem: sta fizikalna oziroma kemijska lastnost. Biotski so le drugi organizmi in odnosi z njimi.
- **»Posameznik se prilagodi, ker mora.«** Prilagoditev je dedna in nastaja skozi rodove z naravnim izborom. Posameznik se lahko le aklimatizira, in to samo znotraj območja strpnosti, ki ga že ima.
- **»Mraz ubije bakterije.«** Pod minimumom se rast večine bakterij le ustavi (le zelo občutljive vrste, kot gonokok, propadejo); ko se vzorec ali hrana segreje, se nadaljuje. Nekatere vrste, kot *Listeria*, rastejo celo v hladilniku. Ubije jih vročina nad maksimumom, zato hrano kuhamo, instrumente pa steriliziramo.

## Povzetek

- Ekološki dejavniki so abiotski (temperatura, svetloba, voda, kisik, pH, slanost) in biotski (drugi organizmi: hrana, plenilci, zajedavci, tekmeci).
- Krivulja strpnosti ima minimum, optimum in maksimum; med minimumom in maksimumom je območje strpnosti, širina $\Delta T = T_{\max} - T_{\min}$. Optimum ni nujno na sredini.
- Omejitveni dejavnik je tisti, ki je najbližje robu območja (pomanjkanje ali presežek).
- Generalisti imajo široka območja (*Listeria*, podgana), specialisti ozka (gonokok, uš, postrv); specialisti so dobri kazalci okolja.
- Prilagoditev je dedna lastnost, nastala z naravnim izborom; aklimatizacija je sprememba v življenju posameznika.
- Niša je skupek vseh območij strpnosti in odnosov; uresničena niša je ožja od temeljne.

## Drugače: Z analogijo

Predstavljaj si temperaturo vode pod prho. Pri $20\,^\circ\mathrm{C}$ zdržiš le kratko, pri okoli $38\,^\circ\mathrm{C}$ ti je najprijetneje, pri $45\,^\circ\mathrm{C}$ se že umikaš. Tvoja »krivulja prijetnosti« ima minimum, optimum in maksimum, in nad optimumom pade hitreje kot pod njim: nekaj stopinj preveč boli bolj kot nekaj stopinj premalo.

Generalist je kot oseba, ki se tušira v vsaki vodi, od mrzlega potoka do vročega bazena. Specialist je kot nekdo, ki se oprha le, če je voda točno prava. V domači kopalnici z dobrim bojlerjem se specialist počuti odlično. Na taboru z mrzlo vodo pa ostane neumit.

## Drugače: Iz vsakdanjega življenja

Ves čas uporabljamo meje strpnosti mikrobov, ne da bi o tem razmišljali:

- **Hladilnik** ($4\,^\circ\mathrm{C}$) je pod minimumom večine bakterij, zato hrana dlje zdrži. Bakterij ne ubije.
- **Kuhanje** in **pasterizacija mleka** presežeta maksimum, zato večina bakterij propade.
- **Avtoklav** v bolnišnici ($121\,^\circ\mathrm{C}$ in para pod tlakom) uniči tudi najodpornejše mikrobe na instrumentih.
- **Kis** pri vlaganju kumaric premakne pH pod minimum bakterij gnitja.
- **Sol** pri suhem mesu in **sladkor** v marmeladi bakterijam odvzameta vodo: raztopina je zanje pregosta, podobno kot preslana voda.

Vsak od teh postopkov izbere en abiotski dejavnik in ga potisne zunaj območja strpnosti neželenih organizmov.

## Preveri se

? Kateri dejavnik ne sodi med ostale tri?
- pH kože
~ pH je kemijska lastnost, torej abiotski dejavnik, čeprav ga ustvarja koža.
- temperatura lasišča
~ Temperatura je fizikalni, abiotski dejavnik, kot pH in vlaga.
+ uš sosedovega otroka
- vlažnost zraka
~ Vlaga je neživi dejavnik, tako kot temperatura in pH.
> Uš je drug organizem, zato je biotski dejavnik (za človeka zajedavec). Ostali trije so abiotski.

? Zakaj se *Listeria* v hrani iz hladilnika ($4\,^\circ\mathrm{C}$) še množi, *E. coli* pa ne?
- Ker hladilnik *E. coli* ubije, *Listerie* pa ne.
~ Mraz pod minimumom rast le ustavi, ne ubija. *E. coli* v hladilniku preživi.
+ Ker je minimum *Listerie* okoli $0\,^\circ\mathrm{C}$, minimum *E. coli* pa okoli $8\,^\circ\mathrm{C}$.
- Ker je *Listeria* specialist za mraz.
~ *Listeria* ima široko območje od okoli $0\,^\circ\mathrm{C}$ do $45\,^\circ\mathrm{C}$, zato je generalist.
> $4\,^\circ\mathrm{C}$ je znotraj območja strpnosti *Listerie* in pod minimumom *E. coli*.

? Bakterija se pri optimalni temperaturi razdeli vsakih $30$ minut. Koliko bakterij nastane iz ene celice v $2$ urah?
- $4$
~ To je število delitev, ne število bakterij. Ob vsaki delitvi se število podvoji.
- $8$
~ To je $2 \cdot 4$. Število se podvoji štirikrat zapored: $2^{4}$.
+ $16$
- $32$
~ To bi bilo po petih delitvah. V $2$ urah so le štiri.
> V $2$ urah so $n = 4$ delitve, zato $N = 1 \cdot 2^{4} = 16$.

? Žan razmišlja: (1) Postrv živi le v hladni vodi, bogati s kisikom. (2) Ima torej ozko območje strpnosti. (3) Zato je specialist. (4) Ko se reka segreje, se posamezna postrv prilagodi in naslednje poletje prenese toplejšo vodo. Kateri korak je napačen?
- korak (2)
~ Če vrsta prenese le hladno vodo, je njeno območje za temperaturo res ozko.
- korak (3)
~ Vrsta z ozkim območjem strpnosti je po definiciji specialist.
+ korak (4)
> Prilagoditev je dedna in nastaja skozi mnogo rodov. Posamezna postrv se lahko v mejah svojega območja le aklimatizira, se umakne ali pogine; meje območja se v njenem življenju ne premaknejo.

? Alpinistka Ana pred odpravo na $6000\,\mathrm{m}$ tri tedne živi na $3500\,\mathrm{m}$. Kaj se zgodi v njenem telesu?
- Razvije novo prilagoditev, ki jo podeduje njen otrok.
~ Spremembe v življenju posameznika se ne dedujejo; prilagoditve nastajajo skozi rodove.
+ Telo naredi več rdečih krvničk; to je aklimatizacija, ki se ne deduje.
- Nič, ker je območje strpnosti pri človeku vedno enako.
~ Telo se lahko v mejah svojega območja odzove na nove razmere; tako je z rdečimi krvničkami.
> Ledvice izločijo več eritropoetina, nastane več rdečih krvničk in kri prenese več kisika. Sprememba je začasna in se ne prenese na potomce.

:::simboli
\Delta T | širina območja strpnosti za temperaturo | \Delta T = T_{\max} - T_{\min} | °C
T_{\max} | maksimum (najvišja še znosna temperatura) | | °C
T_{\min} | minimum (najnižja temperatura, pri kateri vrsta še raste) | | °C
N_0 | število bakterij na začetku | | mL^{-1} | na mililiter vzorca
N | število bakterij po času $t$ | N = N_0 \cdot 2^{n} | mL^{-1} | na mililiter vzorca
n | število delitev | n = k \cdot t | –
k | delitve na uro | | h^{-1} | odčitamo iz tabele
t | čas | | h
:::

<<RACUN
vrednost: 48-8 | 40
vrednost: 46-37 | 9
vrednost: 37-8 | 29
vrednost: 48-37 | 11
vrednost: 1*3 | 3
vrednost: 1000*2^3 | 8000
vrednost: 1000*2^0 | 1000
vrednost: 45-0 | 45
vrednost: 38-30 | 8
vrednost: 45/8 | 5.6
vrednost: 2*60/30 | 4
vrednost: 2^4 | 16
>>
