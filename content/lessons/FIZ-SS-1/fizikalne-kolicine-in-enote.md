---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dve situaciji s poti. Navigacija v avtu reče: »Čez $800\,\text{m}$ zavijte desno.« Tabla ob cesti na istem mestu kaže: »Izvoz $0{,}8\,\text{km}$.« Drugič na planinskem zemljevidu v merilu $1 : 25\,000$ izmeriš pot do koče: $8\,\text{cm}$. V naravi je to $200\,000\,\text{cm}$ ali $2\,\text{km}$.

Vsakič je razdalja ena sama, števila pa so različna: $800$ in $0{,}8$; $200\,000$ in $2$. Število se spremeni, ker se spremeni enota. Zato samo število ne pove ničesar. Če rečeš, da je miza dolga $2$, nihče ne ve, ali misliš $2\,\text{m}$ ali $2\,\text{cm}$. Šele število **skupaj z enoto** pove, kaj smo izmerili.

Fizika opisuje naravo s količinami, kot so dolžina, masa, čas in hitrost. Da se znanstveniki, inženirji in proizvajalci po vsem svetu razumejo, uporabljajo skupen sistem enot. Kaj se zgodi brez njega, kaže sonda Mars Climate Orbiter. Leta 1999 je ena ekipa podatke o sunkih potisnih motorčkov računala v ameriških enotah (s funti), druga pa jih je brala, kot da so v enotah SI. Število je bilo zato napačno za faktor okoli $4{,}45$, sonda je zašla preblizu Marsu in se izgubila. Če znaš enote pravilno zapisati in pretvarjati, lahko pri vsaki fizikalni nalogi preveriš, ali je rezultat smiseln.

## Razlaga

**1. Fizikalna količina.** Fizikalna količina je lastnost telesa ali pojava, ki jo lahko izmerimo. Njena vrednost je zmnožek **številske vrednosti** in **enote**:

$$\text{količina} = \text{število} \cdot \text{enota}$$

Primer: dolžina $l = 3{,}5\,\text{m}$. Tu je $l$ oznaka količine, $3{,}5$ številska vrednost in $\text{m}$ enota.

**2. Mednarodni sistem enot (SI).** SI je dogovorjen sistem enot, ki ga uporablja znanost po vsem svetu. Ima sedem **osnovnih enot**:

| Količina | Enota | Oznaka |
|---|---|---|
| dolžina | meter | $\text{m}$ |
| masa | kilogram | $\text{kg}$ |
| čas | sekunda | $\text{s}$ |
| električni tok | amper | $\text{A}$ |
| temperatura | kelvin | $\text{K}$ |
| množina snovi | mol | $\text{mol}$ |
| svetilnost | kandela | $\text{cd}$ |

Tudi količine imajo dogovorjene oznake: dolžina $l$, masa $m$, čas $t$.

Osnovna enota za maso je že sama po sebi **kilogram** (ne gram), kar je pomembno pri pretvarjanju. Razlog je zgodovinski: gram je bil premajhen za natančen kovinski vzorec, zato so izdelali valj z maso enega kilograma, prakilogram. Edina osnovna enota s predpono je tako ostala kilogram. Od leta 2019 kilogram ni več določen z valjem, ampak s Planckovo konstanto; ime osnovne enote pa je ostalo.

**3. Izpeljane enote.** Vse druge enote dobimo iz osnovnih. Na primer:

- hitrost: $\dfrac{\text{m}}{\text{s}}$ (dolžina deljena s časom),
- ploščina: $\text{m}^2$,
- prostornina: $\text{m}^3$,
- gostota: $\dfrac{\text{kg}}{\text{m}^3}$.

Nekatere izpeljane enote imajo posebno ime, npr. newton $\text{N} = \dfrac{\text{kg}\cdot\text{m}}{\text{s}^2}$ za silo.

**4. Predpone.** Za zelo velike ali zelo majhne vrednosti pred enoto dodamo **predpono**: črko, ki pomeni potenco števila $10$. Najlažje jih vidiš na premici, kjer je pod vsako točko zapisan eksponent te potence. Enota brez predpone (meter, sekunda, gram) je točka z oznako »1« pri $0$, saj je $10^0 = 1$. Pri $1$ je deka: v trgovini srečaš dekagram, $1\,\text{dag} = 10\,\text{g}$.

:::risba premica
opis: Premica eksponentov potenc števila 10 od −6 do 6, s številko pri vsakem celem številu. Označene predpone: µ (mikro) pri −6, m (mili) pri −3, c (centi) pri −2, d (deci) pri −1, enota brez predpone pri 0, da (deka) pri 1, h (hekto) pri 2, k (kilo) pri 3, M (mega) pri 6. Levo so majhne enote, desno velike.
od: -6
do: 6
korak: 1
oznake: 1
točka: -6 | µ
točka: -3 | m
točka: -2 | c
točka: -1 | d
točka: 0 | 1 | modra
točka: 1 | da
točka: 2 | h
točka: 3 | k
točka: 6 | M
:::

Vsak korak v desno pomeni desetkrat večjo enoto. Med mili in kilo je šest korakov, zato je kilometer $10^6$-krat daljši od milimetra. Ista premica velja za meter, gram ali sekundo. Nano ($10^{-9}$) in giga ($10^9$) ležita še dlje levo in desno, zato sta le v tabeli spodaj.

:::premisli
Na premici poišči centi in kilo. Koliko centimetrov je v enem kilometru? Napovej iz razdalje med njima, preden računaš.
---
Med $-2$ in $3$ je pet korakov, torej $1\,\text{km} = 10^5\,\text{cm} = 100\,000\,\text{cm}$. Zato je $8\,\text{cm}$ na zemljevidu $1 : 25\,000$ enako $200\,000\,\text{cm} = 2\,\text{km}$.
:::

Tudi pretvorbo z merilom zemljevida lahko narišemo kot premico. Spodnji graf kaže, koliko kilometrov v naravi pomeni vsak centimeter na zemljevidu. Na sliki je merilo $1 : 25\,000$: pri $8\,\text{cm}$ odčitaš $2\,\text{km}$.

:::risba graf
opis: Graf resnične razdalje v kilometrih v odvisnosti od razdalje na zemljevidu v centimetrih. Premica gre skozi izhodišče. V aplikaciji se merilo spreminja z drsnikom; izbrano je merilo 1 : {m} 000. Pri 8 cm na zemljevidu je resnična razdalja {8*m/100} km.
x: 0 .. 10 | 1 | na zemljevidu (cm)
y: 0 .. 5 | 1 | v naravi (km)
drsnik: m | 20 .. 50 | 5 | 25 | merilo v tisočih
f: m*x/100 | modra
točka: 8; 8*m/100 | {8*m/100} km | nad levo
podnapis: Merilo 1 : {m} 000; 1 cm na zemljevidu je {10*m} m v naravi
:::

V aplikaciji premakni drsnik merila s $25$ na $50$ (merilo $1 : 50\,000$). Opazi, da premica postane dvakrat strmejša: en centimeter zdaj pomeni $500\,\text{m}$ namesto $250\,\text{m}$, zato istih $8\,\text{cm}$ pomeni $4\,\text{km}$. Večje drugo število v merilu pomeni, da en centimeter pokrije več pokrajine. Kartografi takemu merilu rečejo »manjše merilo«, ker je vse na zemljevidu manjše.

Iste predpone v tabeli:

| Predpona | Oznaka | Pomen |
|---|---|---|
| giga | $\text{G}$ | $10^9$ |
| mega | $\text{M}$ | $10^6$ |
| kilo | $\text{k}$ | $10^3$ |
| hekto | $\text{h}$ | $10^2$ |
| deka | $\text{da}$ | $10^1$ |
| deci | $\text{d}$ | $10^{-1}$ |
| centi | $\text{c}$ | $10^{-2}$ |
| mili | $\text{m}$ | $10^{-3}$ |
| mikro | µ | $10^{-6}$ |
| nano | $\text{n}$ | $10^{-9}$ |

Primer: $1\,\text{km} = 10^3\,\text{m} = 1000\,\text{m}$ in $1\,\text{mm} = 10^{-3}\,\text{m} = 0{,}001\,\text{m}$.

**5. Pretvarjanje enot.** Predpono zamenjamo z ustrezno potenco števila $10$ in izračunamo. Zgled: $250\,\text{mm}$ v metre:

$$250\,\text{mm} = 250 \cdot 10^{-3}\,\text{m} = 0{,}25\,\text{m}$$

Pri zelo majhnih ali velikih rezultatih je zapis z desetiško potenco krajši: $0{,}0025\,\text{m} = 2{,}5 \cdot 10^{-3}\,\text{m}$. Potenco $10^{-3}$ lahko nato zamenjaš s predpono: $2{,}5\,\text{mm}$.

**6. Pretvarjanje ploščin in prostornin.** Nariši kvadrat s stranico $1\,\text{dm}$ in ga razdeli na kvadratke s stranico $1\,\text{cm}$:

:::risba mreža
opis: Kvadrat s stranico 1 dm, razdeljen na 10 vrstic in 10 stolpcev kvadratkov s stranico 1 cm. Skupaj je 100 kvadratkov, torej 1 dm² = 100 cm².
vrstic: 10
stolpcev: 10
spodaj: 1 dm = 10 cm
desno: 1 dm = 10 cm
:::

V vsaki vrsti je $10$ kvadratkov, vrst je $10$, skupaj $100$. Torej $1\,\text{dm}^2 = 100\,\text{cm}^2$, čeprav je $1\,\text{dm}$ le $10\,\text{cm}$. Pri kocki s stranico $1\,\text{dm}$ zložiš $10$ takih plasti eno na drugo:

| Kocka $1\,\text{dm}^3$ | Kockic s stranico $1\,\text{cm}$ |
|---|---|
| $1$ plast ($10 \cdot 10$) | $100$ |
| $10$ plasti | $10 \cdot 100 = 1000$ |

Torej $1\,\text{dm}^3 = 1000\,\text{cm}^3$: vsaka od treh stranic prinese faktor $10$.

:::premisli
Koliko $\text{cm}^2$ je $1\,\text{m}^2$? Zakaj ne $100$?
---
$10\,000\,\text{cm}^2$. Stranica $1\,\text{m}$ meri $100\,\text{cm}$, kvadrat ima $100$ vrst po $100$ kvadratkov, in $100 \cdot 100 = 10\,000$.
:::

V simulaciji spodaj »Predpone in osnovne enote SI« izberi količino »ploščina«, vrednost $1$ in pretvori iz $\text{m}^2$ v $\text{cm}^2$. Opazuj, da vsaka stopnica pomeni faktor $100$, ne $10$.

Zato je treba pri $\text{m}^2$ in $\text{m}^3$ potenco **upoštevati tudi pri predponi**:

$$1\,\text{cm}^2 = (10^{-2}\,\text{m})^2 = 10^{-4}\,\text{m}^2$$

$$1\,\text{cm}^3 = (10^{-2}\,\text{m})^3 = 10^{-6}\,\text{m}^3$$

**7. Pretvarjanje časa.** Večje enote za čas (minuta, ura, dan) niso desetiške: $1\,\text{min} = 60\,\text{s}$, $1\,\text{h} = 3600\,\text{s}$. Predpone (ms, µs) pa za sekundo veljajo kot za meter.

**8. Pretvarjanje hitrosti.** Velja $1\,\dfrac{\text{km}}{\text{h}} = \dfrac{1000\,\text{m}}{3600\,\text{s}} = \dfrac{1}{3{,}6}\,\dfrac{\text{m}}{\text{s}}$. Torej iz $\text{km/h}$ v $\text{m/s}$ **delimo** s $3{,}6$, v obratno smer **množimo** s $3{,}6$.

:::risba graf
opis: Graf hitrosti v metrih na sekundo v odvisnosti od hitrosti v kilometrih na uro: premica skozi izhodišče, ki se dvigne za 1 m/s na vsakih 3,6 km/h. V aplikaciji se hitrost spreminja z drsnikom; izbrano je {h} km/h, kar je {h/3.6} m/s.
x: 0 .. 144 | 36 | hitrost (km/h)
y: 0 .. 40 | 10 | hitrost (m/s)
drsnik: h | 36 .. 126 | 18 | 72 | hitrost v km/h
f: x/3.6 | modra
točka: h; h/3.6 | {h/3.6} m/s | nad levo
podnapis: {h} km/h = {h/3.6} m/s, ker je 1 km = 1000 m in 1 h = 3600 s
:::

Na sliki je izbrana hitrost $72\,\text{km/h}$, ki ji ustreza $20\,\text{m/s}$. V aplikaciji premikaj drsnik hitrosti in opazuj obe števili: število v $\text{m/s}$ je vedno $3{,}6$-krat manjše. Pri $36\,\text{km/h}$ (polovica od $72\,\text{km/h}$) je tudi hitrost v $\text{m/s}$ polovična: $10\,\text{m/s}$, saj je pretvorba sorazmerje.

**9. Sestavljene enote.** Števec in imenovalec pretvoriš vsakega posebej. Gostota vode je $1\,\text{g/cm}^3$. Ker je $1\,\text{g} = 10^{-3}\,\text{kg}$ in $1\,\text{cm}^3 = 10^{-6}\,\text{m}^3$, je

$$1\,\frac{\text{g}}{\text{cm}^3} = \frac{10^{-3}\,\text{kg}}{10^{-6}\,\text{m}^3} = 1000\,\frac{\text{kg}}{\text{m}^3}$$

Število se poveča, čeprav je kilogram večji od grama: kubični meter je namreč še veliko večji od kubičnega centimetra.

## Rešeni primeri

### Primer 1 (lažji): predpone

Pretvori $4{,}5\,\text{km}$ v metre in $730\,\text{g}$ v kilograme.

**Podatki:** dolžina $4{,}5\,\text{km}$, masa $730\,\text{g}$
**Iščemo:** isto dolžino v $\text{m}$ in isto maso v $\text{kg}$

:::formula
$1\,\text{km} = 10^3\,\text{m}$, $1\,\text{g} = 10^{-3}\,\text{kg}$
:::

**Rešitev:**

1. Predpona $\text{k}$ pomeni $10^3$: $4{,}5\,\text{km} = 4{,}5 \cdot 10^3\,\text{m} = 4500\,\text{m}$.
2. Osnovna enota za maso je kilogram. Ker je $1\,\text{g} = 10^{-3}\,\text{kg}$, velja $730\,\text{g} = 730 \cdot 10^{-3}\,\text{kg} = 0{,}73\,\text{kg}$.
3. Preverimo smiselnost: kilometer je veliko več kot meter, zato mora biti število v metrih večje. Gram je manj kot kilogram, zato mora biti število v kilogramih manjše. ✓
4. Odgovor: $4{,}5\,\text{km} = 4500\,\text{m}$ in $730\,\text{g} = 0{,}73\,\text{kg}$.

### Primer 2: ploščina in prostornina

Pretvori $350\,\text{cm}^2$ v $\text{m}^2$ in $2{,}5\,\text{L}$ v $\text{m}^3$.

**Podatki:** ploščina $350\,\text{cm}^2$, prostornina $2{,}5\,\text{L}$
**Iščemo:** isto ploščino v $\text{m}^2$ in isto prostornino v $\text{m}^3$

:::formula
$1\,\text{cm}^2 = (10^{-2}\,\text{m})^2 = 10^{-4}\,\text{m}^2$, $1\,\text{L} = 1\,\text{dm}^3 = (10^{-1}\,\text{m})^3 = 10^{-3}\,\text{m}^3$
:::

**Rešitev:**

1. Za ploščino: enota je kvadratna, zato faktor $10^{-2}$ velja za vsako od obeh stranic: $(10^{-2})^2 = 10^{-4}$. Torej $350\,\text{cm}^2 = 350 \cdot 10^{-4}\,\text{m}^2 = 0{,}035\,\text{m}^2$.
2. Za prostornino vemo, da je $1\,\text{L} = 1\,\text{dm}^3$. Ker je $1\,\text{dm} = 10^{-1}\,\text{m}$, je $1\,\text{dm}^3 = (10^{-1}\,\text{m})^3 = 10^{-3}\,\text{m}^3$.
3. Torej $2{,}5\,\text{L} = 2{,}5 \cdot 10^{-3}\,\text{m}^3 = 0{,}0025\,\text{m}^3$. Zapis $2{,}5 \cdot 10^{-3}\,\text{m}^3$ je krajši in manj je možnosti, da izpustiš ničlo.
4. Odgovor: $350\,\text{cm}^2 = 0{,}035\,\text{m}^2$ in $2{,}5\,\text{L} = 0{,}0025\,\text{m}^3$.

### Primer 3 (težji): dve sekundi na avtocesti

Na slovenskih avtocestah je največja dovoljena hitrost $130\,\text{km/h}$. Voznik s to hitrostjo za $2\,\text{s}$ pogleda na telefon. Koliko metrov prevozi, ne da bi gledal cesto? Koliko minut traja vožnja s to hitrostjo po $195\,\text{km}$ dolgi avtocesti?

**Podatki:** $v = 130\,\dfrac{\text{km}}{\text{h}}$, čas pogleda $t_1 = 2\,\text{s}$, dolžina poti $s_2 = 195\,\text{km}$
**Iščemo:** pot $s_1$ v metrih in čas vožnje $t_2$ v minutah

:::formula
$1\,\dfrac{\text{km}}{\text{h}} = \dfrac{1000\,\text{m}}{3600\,\text{s}}$, $s = v \cdot t$, $t = \dfrac{s}{v}$, $1\,\text{h} = 60\,\text{min}$
:::

**Rešitev:**

1. Čas pogleda je v sekundah, zato hitrost pretvorimo v $\text{m/s}$ (delimo s $3{,}6$): $v = 130 : 3{,}6\,\dfrac{\text{m}}{\text{s}} \approx 36{,}1\,\dfrac{\text{m}}{\text{s}}$.
2. Pot je hitrost krat čas (iz osnovne šole): $s_1 = v \cdot t_1 = 130 \cdot 2 : 3{,}6\,\text{m} \approx 72{,}2\,\text{m}$. Računamo z nezaokroženim količnikom, rezultat pa zaokrožimo na cel meter: približno $72\,\text{m}$.
3. Enote se pokrajšajo: $\dfrac{\text{m}}{\text{s}} \cdot \text{s} = \text{m}$. To so skoraj tri dolžine $25$-metrskega bazena. ✓
4. Za dolgo pot ostanemo pri $\text{km}$ in $\text{h}$, ker sta podatka že v teh enotah: $t_2 = \dfrac{s_2}{v} = \dfrac{195\,\text{km}}{130\,\text{km/h}} = 1{,}5\,\text{h}$.
5. Ura ima $60$ minut, ne $100$: $1{,}5\,\text{h} = 1{,}5 \cdot 60\,\text{min} = 90\,\text{min}$.
6. Odgovor: v dveh sekundah avto prevozi približno $72\,\text{m}$ na slepo, vožnja po $195\,\text{km}$ pa traja $90\,\text{min}$.

### Primer 4 – zdaj ti: zemljevid

Na planinskem zemljevidu v merilu $1 : 50\,000$ je razdalja med kočama $6{,}4\,\text{cm}$. Kolikšna je resnična razdalja v kilometrih?

**Podatki:** razdalja na zemljevidu $s_z = 6{,}4\,\text{cm}$, merilo $1 : 50\,000$
**Iščemo:** razdaljo v naravi $s_n$ v $\text{km}$

:::formula
$s_n = 50\,000 \cdot s_z$, nato $1\,\text{cm} = 10^{-2}\,\text{m}$ in $1\,\text{m} = 10^{-3}\,\text{km}$
:::

**Rešitev:**

1. Merilo pove, da je v naravi vse $50\,000$-krat večje: $s_n = 50\,000 \cdot 6{,}4\,\text{cm} = 320\,000\,\text{cm}$.
2. Tako veliko število v centimetrih je nepregledno, zato ga pretvori najprej v metre in nato v kilometre.

:::premisli
Koliko metrov in koliko kilometrov je $320\,000\,\text{cm}$?
---
$320\,000 \cdot 10^{-2}\,\text{m} = 3200\,\text{m}$ in $3200 \cdot 10^{-3}\,\text{km} = 3{,}2\,\text{km}$. Koči sta $3{,}2\,\text{km}$ narazen.
:::

## Pogoste napake

- **Gram namesto kilograma.** »Kilo je predpona, torej je osnovna enota gram.« Pri masi je izjema: osnovna enota SI je že kilogram. Pravilno: v formule vstavljaj maso v $\text{kg}$, npr. $730\,\text{g} = 0{,}73\,\text{kg}$.
- **Napačna smer pretvorbe.** »Kilo je $1000$, torej $500\,\text{m}$ krat $1000$ da kilometre.« Tako dobiš $500\,000\,\text{km}$, kar je absurdno. Večja enota pomeni manj enot, zato mora biti število manjše: $500\,\text{m} = 0{,}5\,\text{km}$. Enako pri hitrosti: iz $\text{km/h}$ v $\text{m/s}$ delimo s $3{,}6$, ne množimo.
- **Ploščine in prostornine kot dolžine.** »Centi je $10^{-2}$, torej $1\,\text{cm}^2 = 10^{-2}\,\text{m}^2$.« Kvadrat ima dve stranici in pretvoriti moraš obe, kot kaže mreža zgoraj. Pravilno: $(10^{-2})^2 = 10^{-4}$, torej $1\,\text{cm}^2 = 10^{-4}\,\text{m}^2$.
- **Čas pretvarjaš z $100$.** »$1{,}5\,\text{h}$ je $150\,\text{min}$.« Ura nima $100$ minut, ampak $60$; minute in ure niso desetiške. Pravilno: $1{,}5 \cdot 60 = 90\,\text{min}$.
- **Zamenjava $\text{m}$ in $\text{M}$.** »$5\,\text{Mm}$ je pet milimetrov.« Velika črka $\text{M}$ pomeni mega ($10^6$), mala $\text{m}$ mili ($10^{-3}$). Zato pri predponah vedno pazi na veliko in malo črko.

## Povzetek

- Fizikalna količina je zmnožek številske vrednosti in enote.
- SI je mednarodni sistem enot; osnovne enote so meter, kilogram, sekunda, amper, kelvin, mol in kandela.
- Izpeljane enote sestavimo iz osnovnih (npr. $\dfrac{\text{m}}{\text{s}}$, $\text{m}^3$, $\dfrac{\text{kg}}{\text{m}^3}$).
- Predpone pomenijo potence števila $10$: $\text{k} = 10^3$, $\text{c} = 10^{-2}$, $\text{m} = 10^{-3}$, µ $= 10^{-6}$ itd.
- Pri ploščinah in prostorninah potenco predpone potenciramo ($\text{cm}^2 \to 10^{-4}$, $\text{cm}^3 \to 10^{-6}$).
- Iz $\text{km/h}$ v $\text{m/s}$ delimo s $3{,}6$.
- Pred računom pretvori količine v skladne enote; najvarneje v osnovne enote SI.

## Drugače: Z analogijo

Pretvarjanje enot je kot menjava denarja na potovanju. Za $1$ evro dobiš $100$ centov. Denarja imaš enako, kovancev pa stokrat več, ker je cent manjša enota. Ko cente zamenjaš nazaj v evre, dobiš manj kosov, vrednost pa ostane.

Enako je z dolžino: $1\,\text{km}$ zamenjaš za $1000\,\text{m}$. Predpona je »menjalni tečaj«: $\text{k}$ pomeni tečaj $1000$, $\text{c}$ tečaj $\dfrac{1}{100}$. Razdalja se ne spremeni, spremeni se le, koliko »kovancev« (enot) jo sestavlja.

Pri ploščini pa menjaš dvakrat zapored, za vsako stranico enkrat. Zato je tečaj med $\text{m}^2$ in $\text{cm}^2$ enak $100 \cdot 100 = 10\,000$.

Analogija ima mejo: med evrom in centom je tečaj stalen, pri tujih valutah (evro v švicarski frank) pa se spreminja vsak dan. Predpone so vedno stalne, kot evro in cent, in povsod enake.

## Drugače: Iz vsakdanjega življenja

Enote srečuješ ves dan:

- Mleko v trgovini: $1\,\text{L}$ je $1\,\text{dm}^3$, torej $0{,}001\,\text{m}^3$.
- Svetovni rekord v teku na $100\,\text{m}$: Usain Bolt je leta 2009 v Berlinu tekel $9{,}58\,\text{s}$. Njegova povprečna hitrost je $100 : 9{,}58 \approx 10{,}44\,\dfrac{\text{m}}{\text{s}}$, kar je $10{,}44 \cdot 3{,}6 \approx 37{,}6\,\dfrac{\text{km}}{\text{h}}$. Hitreje od kolesarja v mestu.
- Spominska kartica ima napisano $64\,\text{GB}$. Predpona $\text{G}$ (giga) pomeni $10^9$, torej $64 \cdot 10^9$ bajtov.

Primer iz kuhinje: recept zahteva $250\,\text{g}$ moke. V SI je to $0{,}25\,\text{kg}$. Tehtnica kaže gram zato, ker je za vsakdanjo rabo bolj priročen, v fizikalnih formulah pa uporabljamo kilogram.

## Drugače: Bolj natančno

**Zakaj je zapis »število krat enota« smiseln?** Enota se obnaša kot algebrski faktor. Zato lahko z njo računamo kot s spremenljivko. Na primer pretvorba z »enico«: ker je $1\,\text{km} = 1000\,\text{m}$, je

$$\frac{1000\,\text{m}}{1\,\text{km}} = 1.$$

Množenje z enico vrednosti ne spremeni, spremeni pa enoto:

$$4{,}5\,\text{km} \cdot \frac{1000\,\text{m}}{1\,\text{km}} = 4500\,\text{m}.$$

Enota $\text{km}$ se pokrajša, ostane $\text{m}$.

**Dimenzijska analiza.** Obe strani enačbe morata imeti isto enoto. Če je $s = v \cdot t$, je desna stran $\dfrac{\text{m}}{\text{s}} \cdot \text{s} = \text{m}$, kar ustreza levi. Če pri izpeljavi dobiš na obeh straneh različni enoti, si naredil napako. Tako lahko preveriš formulo, še preden vstaviš števila.

**Zakaj je ploščina kvadratna?** Če vsako stranico kvadrata pomnožimo z $k$, se ploščina pomnoži s $k^2$. Zato iz $1\,\text{cm} = 10^{-2}\,\text{m}$ sledi $1\,\text{cm}^2 = (10^{-2})^2\,\text{m}^2 = 10^{-4}\,\text{m}^2$.

## Preveri se

? Na cestnem znaku piše $50\,\text{km/h}$. Kaj je v tem zapisu enota?
- $50$
~ To je številska vrednost. Brez enote ne pove, ali gre za kilometre na uro ali metre na sekundo.
- hitrost
~ Hitrost je ime količine, ne enota.
- $\text{km}$
~ Kilometer je enota za dolžino. Hitrost potrebuje dolžino na čas, torej kilometre na uro.
+ $\text{km/h}$
> $v = 50\,\text{km/h} = 50 \cdot \text{km/h}$: številska vrednost je $50$, enota kilometer na uro.

? Sateliti GPS, ki ti v telefonu kažejo pot, krožijo približno $20\,\text{Mm}$ nad Zemljo. Koliko je to v kilometrih?
- $0{,}00002\,\text{km}$
~ Prebral si $\text{Mm}$ kot milimetre. Velika črka $\text{M}$ je mega ($10^6$), mala $\text{m}$ bi bila mili.
- $20\,\text{km}$
~ Mega si zamenjal s kilo. Mega je $10^6$, kilo le $10^3$.
+ $20\,000\,\text{km}$
- $20\,000\,000\,\text{km}$
~ To je število metrov: $20 \cdot 10^6\,\text{m}$. Do kilometrov moraš še deliti s $1000$.
> $20\,\text{Mm} = 20 \cdot 10^6\,\text{m} = 20\,000\,000\,\text{m} = 20\,000\,\text{km}$. Na premici so med M ($6$) in k ($3$) trije koraki, torej faktor $10^3$.

? Planinski nahrbtnik ima maso $6500\,\text{g}$. Kolikšno maso vstaviš v fizikalno formulo, v osnovni enoti SI?
= 6,5 kg | 0,01
~ 6500 | To je masa v gramih. Osnovna enota SI za maso je kilogram, ne gram.
~ 6500000 | Napačna smer: kilogram je večja enota, zato mora biti število manjše, ne večje.
~ 65 | Uporabil si faktor $10^{-2}$ (centi). Kilo pomeni $10^3$, zato deliš s $1000$.
> $6500\,\text{g} = 6500 \cdot 10^{-3}\,\text{kg} = 6{,}5\,\text{kg}$.

? Štirje pohodniki povedo, kako daleč so še od koče: Ana $0{,}2\,\text{km}$, Bor $1500\,\text{cm}$, Cene $30\,\text{m}$, Dana $4000\,\text{mm}$. Razvrsti jih od najbližjega do najbolj oddaljenega.
1. Dana ($4000\,\text{mm}$)
2. Bor ($1500\,\text{cm}$)
3. Cene ($30\,\text{m}$)
4. Ana ($0{,}2\,\text{km}$)
> V metrih: Dana $4000 \cdot 10^{-3} = 4\,\text{m}$, Bor $1500 \cdot 10^{-2} = 15\,\text{m}$, Cene $30\,\text{m}$, Ana $0{,}2 \cdot 1000 = 200\,\text{m}$. Kdor primerja samo števila brez enot, dobi ravno obraten vrstni red.

? Avtobusna vožnja na izlet traja $2{,}25\,\text{h}$. Koliko minut je to?
= 135 min | 0,5
~ 225 | Pretvarjal si s $100$, kot da ima ura $100$ minut. Ura ima $60$ minut.
~ 8100 | To je število sekund: $2{,}25 \cdot 3600$. Vprašanje sprašuje po minutah.
~ 0,0375 | Delil si s $60$. Minuta je manjša enota od ure, zato mora biti število večje.
> $2{,}25\,\text{h} = 2{,}25 \cdot 60\,\text{min} = 135\,\text{min}$, torej $2\,\text{h}$ in $15\,\text{min}$.

? Koliko $\text{m}^2$ je $500\,\text{cm}^2$?
= 0,05 m² | 0,001
~ 5 | Uporabil si faktor $10^{-2}$ kot pri dolžini. Pri ploščini se pretvorita obe stranici: $10^{-4}$.
~ 5000000 | Napačna smer: $\text{m}^2$ je večja enota, zato mora biti število manjše od $500$.
~ 0,5 | To je faktor $10^{-3}$, ki velja za mili pri dolžini. Za $\text{cm}^2$ je faktor $10^{-4}$.
> $1\,\text{cm}^2 = 10^{-4}\,\text{m}^2$, zato $500 \cdot 10^{-4} = 0{,}05\,\text{m}^2$.

? Graf kaže pretvorbo hitrosti iz $\text{km/h}$ v $\text{m/s}$. Z grafa odčitaj, koliko $\text{m/s}$ je hitrost $54\,\text{km/h}$, ki jo ima avtobus med vasema.
:::risba graf
opis: Premica skozi izhodišče: na vodoravni osi hitrost v km/h od 0 do 90 z oznakami na vsakih 18, na navpični osi hitrost v m/s od 0 do 25 z oznakami na vsakih 5. Na premici je točka A.
x: 0 .. 90 | 18 | hitrost (km/h)
y: 0 .. 25 | 5 | hitrost (m/s)
f: x/3.6 | modra
točka: 54; 15 | A | nad levo
:::
= 15 m/s | 0,5
~ 194 | Množil si s $3{,}6$. Na grafu je pri $54\,\text{km/h}$ veliko manjše število: $\text{m/s}$ je večja enota.
~ 5,4 | Delil si z $10$. Ura ima $3600\,\text{s}$, kilometer $1000\,\text{m}$, zato je faktor $3{,}6$.
> Točka A leži pri $54\,\text{km/h}$ in $15\,\text{m/s}$. Račun to potrdi: $54 : 3{,}6 = 15$.

? Na planinskem zemljevidu v merilu $1 : 25\,000$ je pot do koče dolga $12\,\text{cm}$. Kaj se zgodi, če isto pot izmeriš na zemljevidu v merilu $1 : 50\,000$?
+ Na zemljevidu meri $6\,\text{cm}$; pot v naravi ostane $3\,\text{km}$.
- Na zemljevidu meri $24\,\text{cm}$, ker je merilo večje.
~ Merilo $1 : 50\,000$ je pravzaprav manjše: večje je le drugo število. En centimeter pokrije več pokrajine, zato je ista pot na zemljevidu krajša.
- Na zemljevidu meri $12\,\text{cm}$, pot v naravi pa $6\,\text{km}$.
~ Pot v naravi se ne spremeni, ko zamenjaš zemljevid. Spremeni se le, koliko centimetrov jo predstavlja.
- Na zemljevidu meri $6\,\text{cm}$; pot v naravi je $30\,\text{km}$.
~ $300\,000\,\text{cm}$ si delil z $10^4$. Do kilometrov je $10^5$: $1\,\text{km} = 100\,000\,\text{cm}$.
> V naravi je pot $12 \cdot 25\,000 = 300\,000\,\text{cm} = 3\,\text{km}$. Na zemljevidu $1 : 50\,000$ je $300\,000 : 50\,000 = 6\,\text{cm}$.

<<RACUN
enote: 4.5*km | 4500*m
enote: 730*g | 0.73*kg
enote: 350*cm^2 | 0.035*m^2
enote: 2.5*L | 0.0025*m^3
vrednost: 195/130 | 1.5
vrednost: 1.5*60 | 90
enote: 20000000*m | 20000*km
enote: 6500*g | 6.5*kg
enote: 320000*cm | 3.2*km
enote: 500*cm^2 | 0.05*m^2
enote: 54*km/h | 15*m/s
enote: 72*km/h | 20*m/s
enote: 300000*cm | 3*km
vrednost: 300000/50000 | 6
vrednost: 8*50000/100000 | 4
enote: 1*g/cm^3 | 1000*kg/m^3
enote: 0.0025*m | 2.5*mm
vrednost: 130*2/3.6 | 72.22
vrednost: 2.25*60 | 135
vrednost: 2.25*3600 | 8100
>>

:::simboli
l | dolžina | | m |
m | masa | | kg |
s | pot | s = v \cdot t | m
v | hitrost | | m/s | $1\,\mathrm{m/s} = 3{,}6\,\mathrm{km/h}$
t | čas | t = \dfrac{s}{v} | s
s_n | razdalja v naravi | | km | drugo število merila krat $s_z$
s_z | razdalja na zemljevidu | | cm |
:::
