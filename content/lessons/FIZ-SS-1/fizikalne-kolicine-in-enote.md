---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dve situaciji s poti. Navigacija v avtu reče: »Čez $800\,\text{m}$ zavijte desno.« Tabla ob cesti na istem mestu kaže: »Izvoz $0{,}8\,\text{km}$.« Drugič na planinskem zemljevidu v merilu $1 : 25\,000$ izmeriš pot do koče: $8\,\text{cm}$. V naravi je to $200\,000\,\text{cm}$ ali $2\,\text{km}$.

Vsakič je razdalja ena sama, števila pa so različna: $800$ in $0{,}8$; $200\,000$ in $2$. Število se spremeni, ker se spremeni enota. Zato samo število ne pove ničesar. Če rečeš, da je miza dolga $2$, nihče ne ve, ali misliš $2\,\text{m}$ ali $2\,\text{cm}$. Šele število **skupaj z enoto** pove, kaj smo izmerili.

Fizika opisuje naravo s količinami, kot so dolžina, masa, čas in hitrost. Da se znanstveniki, inženirji in proizvajalci po vsem svetu razumejo, uporabljajo skupen sistem enot. Če bi vsak uporabljal svoje, bi prihajalo do hudih napak pri gradnji, v letalstvu, v medicini in pri recepturah. Če znaš enote pravilno zapisati in pretvarjati, lahko pri vsaki fizikalni nalogi preveriš, ali je rezultat smiseln.

## Razlaga

**1. Fizikalna količina.** Fizikalna količina je lastnost telesa ali pojava, ki jo lahko izmerimo. Njena vrednost je zmnožek **številske vrednosti** in **enote**:

$$\text{količina} = \text{število} \cdot \text{enota}$$

Primer: dolžina $l = 3{,}5\,\text{m}$. Tu je $l$ oznaka količine, $3{,}5$ številska vrednost in $\text{m}$ enota.

**2. Mednarodni sistem enot (SI).** SI je dogovorjen sistem enot, ki ga uporablja znanost po vsem svetu. Ima sedem **osnovnih enot**:

| Količina | Oznaka količine | Osnovna enota SI | Oznaka enote |
|---|---|---|---|
| dolžina | $l$ | meter | $\text{m}$ |
| masa | $m$ | kilogram | $\text{kg}$ |
| čas | $t$ | sekunda | $\text{s}$ |
| električni tok | $I$ | amper | $\text{A}$ |
| temperatura | $T$ | kelvin | $\text{K}$ |
| množina snovi | $n$ | mol | $\text{mol}$ |
| svetilnost | $I_\mathrm{v}$ | kandela | $\text{cd}$ |

Osnovna enota za maso je že sama po sebi **kilogram** (ne gram), kar je pomembno pri pretvarjanju.

**3. Izpeljane enote.** Vse druge enote dobimo iz osnovnih. Na primer:

- hitrost: $\dfrac{\text{m}}{\text{s}}$ (dolžina deljena s časom),
- ploščina: $\text{m}^2$,
- prostornina: $\text{m}^3$,
- gostota: $\dfrac{\text{kg}}{\text{m}^3}$.

Nekatere izpeljane enote imajo posebno ime, npr. newton $\text{N} = \dfrac{\text{kg}\cdot\text{m}}{\text{s}^2}$ za silo.

**4. Predpone.** Za zelo velike ali zelo majhne vrednosti pred enoto dodamo **predpono**: črko, ki pomeni potenco števila $10$. Najlažje jih vidiš na premici, kjer je zapisan eksponent te potence. Enota brez predpone (meter, sekunda, gram) je pri $0$.

:::risba premica
opis: Premica eksponentov potenc števila 10 od −9 do 9. Označene predpone: n (nano) pri −9, µ (mikro) pri −6, m (mili) pri −3, c (centi) pri −2, d (deci) pri −1, enota brez predpone pri 0, h (hekto) pri 2, k (kilo) pri 3, M (mega) pri 6, G (giga) pri 9. Levo so majhne enote, desno velike.
od: -9
do: 9
točka: -9 | n
točka: -6 | µ
točka: -3 | m
točka: -2 | c
točka: -1 | d
točka: 0 | 1 | modra
točka: 2 | h
točka: 3 | k
točka: 6 | M
točka: 9 | G
:::

Vsak korak v desno pomeni desetkrat večjo enoto. Med mili in kilo je šest korakov, zato je kilometer $10^6$-krat daljši od milimetra. Ista premica velja za meter, gram ali sekundo.

:::premisli
Na premici poišči centi in kilo. Koliko centimetrov je v enem kilometru? Napovej iz razdalje med njima, preden računaš.
---
Med $-2$ in $3$ je pet korakov, torej $1\,\text{km} = 10^5\,\text{cm} = 100\,000\,\text{cm}$. Zato je $8\,\text{cm}$ na zemljevidu $1 : 25\,000$ enako $200\,000\,\text{cm} = 2\,\text{km}$.
:::

Iste predpone v tabeli:

| Predpona | Oznaka | Pomen |
|---|---|---|
| giga | $\text{G}$ | $10^9$ |
| mega | $\text{M}$ | $10^6$ |
| kilo | $\text{k}$ | $10^3$ |
| hekto | $\text{h}$ | $10^2$ |
| deci | $\text{d}$ | $10^{-1}$ |
| centi | $\text{c}$ | $10^{-2}$ |
| mili | $\text{m}$ | $10^{-3}$ |
| mikro | $\mu$ | $10^{-6}$ |
| nano | $\text{n}$ | $10^{-9}$ |

Primer: $1\,\text{km} = 10^3\,\text{m} = 1000\,\text{m}$ in $1\,\text{mm} = 10^{-3}\,\text{m} = 0{,}001\,\text{m}$.

**5. Pretvarjanje enot.** Predpono zamenjamo z ustrezno potenco števila $10$ in izračunamo. Zgled: $250\,\text{mm}$ v metre:

$$250\,\text{mm} = 250 \cdot 10^{-3}\,\text{m} = 0{,}25\,\text{m}$$

**6. Pretvarjanje ploščin in prostornin.** Nariši kvadrat s stranico $1\,\text{dm}$ in ga razdeli na kvadratke s stranico $1\,\text{cm}$:

:::risba mreža
opis: Kvadrat s stranico 1 dm, razdeljen na 10 vrstic in 10 stolpcev kvadratkov s stranico 1 cm. Skupaj je 100 kvadratkov, torej 1 dm² = 100 cm².
vrstic: 10
stolpcev: 10
spodaj: 1 dm = 10 cm
desno: 1 dm = 10 cm
:::

V vsaki vrsti je $10$ kvadratkov, vrst je $10$, skupaj $100$. Torej $1\,\text{dm}^2 = 100\,\text{cm}^2$, čeprav je $1\,\text{dm}$ le $10\,\text{cm}$. Pri kocki dodaš še $10$ plasti: $1\,\text{dm}^3 = 1000\,\text{cm}^3$.

:::premisli
Koliko $\text{cm}^2$ je $1\,\text{m}^2$? Zakaj ne $100$?
---
$10\,000\,\text{cm}^2$. Stranica $1\,\text{m}$ meri $100\,\text{cm}$, kvadrat ima $100$ vrst po $100$ kvadratkov, in $100 \cdot 100 = 10\,000$.
:::

V simulaciji spodaj »Predpone in osnovne enote SI« izberi količino »ploščina«, vrednost $1$ in pretvori iz $\text{m}^2$ v $\text{cm}^2$. Opazuj, da vsaka stopnica pomeni faktor $100$, ne $10$.

Zato je treba pri $\text{m}^2$ in $\text{m}^3$ potenco **upoštevati tudi pri predponi**:

$$1\,\text{cm}^2 = (10^{-2}\,\text{m})^2 = 10^{-4}\,\text{m}^2, \qquad 1\,\text{cm}^3 = (10^{-2}\,\text{m})^3 = 10^{-6}\,\text{m}^3$$

**7. Pretvarjanje časa.** Čas ne sledi potencam števila $10$: $1\,\text{min} = 60\,\text{s}$, $1\,\text{h} = 3600\,\text{s}$.

**8. Pretvarjanje hitrosti.** Velja $1\,\dfrac{\text{km}}{\text{h}} = \dfrac{1000\,\text{m}}{3600\,\text{s}} = \dfrac{1}{3{,}6}\,\dfrac{\text{m}}{\text{s}}$. Torej iz $\text{km/h}$ v $\text{m/s}$ **delimo** s $3{,}6$, v obratno smer **množimo** s $3{,}6$.

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

1. Za ploščino: $1\,\text{cm}^2 = 10^{-4}\,\text{m}^2$, zato $350\,\text{cm}^2 = 350 \cdot 10^{-4}\,\text{m}^2 = 0{,}035\,\text{m}^2$.
2. Za prostornino vemo, da je $1\,\text{L} = 1\,\text{dm}^3$. Ker je $1\,\text{dm} = 10^{-1}\,\text{m}$, je $1\,\text{dm}^3 = (10^{-1}\,\text{m})^3 = 10^{-3}\,\text{m}^3$.
3. Torej $2{,}5\,\text{L} = 2{,}5 \cdot 10^{-3}\,\text{m}^3 = 0{,}0025\,\text{m}^3$.
4. Pri ploščini nismo pretvorili samo z $10^{-2}$, ker je enota kvadratna, zato je faktor $(10^{-2})^2 = 10^{-4}$.
5. Odgovor: $350\,\text{cm}^2 = 0{,}035\,\text{m}^2$ in $2{,}5\,\text{L} = 0{,}0025\,\text{m}^3$.

### Primer 3 (težji): hitrost in sestavljena enota

Kolesar vozi s hitrostjo $27\,\dfrac{\text{km}}{\text{h}}$. Izrazi hitrost v $\dfrac{\text{m}}{\text{s}}$. Nato izračunaj, koliko metrov prevozi v $2\,\text{min}$.

**Podatki:** $v = 27\,\dfrac{\text{km}}{\text{h}}$, $t = 2\,\text{min}$
**Iščemo:** hitrost $v$ v $\dfrac{\text{m}}{\text{s}}$ in pot $s$ v metrih

:::formula
$1\,\dfrac{\text{km}}{\text{h}} = \dfrac{1000\,\text{m}}{3600\,\text{s}}$ (delimo s $3{,}6$), $1\,\text{min} = 60\,\text{s}$, $s = v \cdot t$
:::

**Rešitev:**

1. Pretvorba hitrosti: $27\,\dfrac{\text{km}}{\text{h}} = \dfrac{27 \cdot 1000\,\text{m}}{3600\,\text{s}} = \dfrac{27000}{3600}\,\dfrac{\text{m}}{\text{s}} = 7{,}5\,\dfrac{\text{m}}{\text{s}}$.
2. Preverimo s pravilom: $27 : 3{,}6 = 7{,}5$. ✓
3. Čas v osnovno enoto: $2\,\text{min} = 2 \cdot 60\,\text{s} = 120\,\text{s}$.
4. Pot je hitrost krat čas: $s = v \cdot t = 7{,}5\,\dfrac{\text{m}}{\text{s}} \cdot 120\,\text{s} = 900\,\text{m}$.
5. Enote se pokrajšajo: $\dfrac{\text{m}}{\text{s}} \cdot \text{s} = \text{m}$, kar je res enota za dolžino. ✓
6. Odgovor: kolesar vozi s hitrostjo $7{,}5\,\dfrac{\text{m}}{\text{s}}$ in v $2\,\text{min}$ prevozi $900\,\text{m}$.

### Primer 4 – zdaj ti: zemljevid

Na planinskem zemljevidu v merilu $1 : 50\,000$ je razdalja med kočama $6{,}4\,\text{cm}$. Kolikšna je resnična razdalja v kilometrih?

**Podatki:** razdalja na zemljevidu $s_z = 6{,}4\,\text{cm}$, merilo $1 : 50\,000$
**Iščemo:** resnično razdaljo $s$ v $\text{km}$

:::formula
$s = 50\,000 \cdot s_z$, nato $1\,\text{cm} = 10^{-2}\,\text{m}$ in $1\,\text{m} = 10^{-3}\,\text{km}$
:::

**Rešitev:**

1. Merilo pove, da je v naravi vse $50\,000$-krat večje: $s = 50\,000 \cdot 6{,}4\,\text{cm} = 320\,000\,\text{cm}$.
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
- **Čas pretvarjaš z $100$.** »$1{,}5\,\text{h}$ je $150\,\text{min}$.« Ura nima $100$ minut, ampak $60$; čas ni desetiški. Pravilno: $1{,}5 \cdot 60 = 90\,\text{min}$.
- **Zamenjava $\text{m}$ in $\text{M}$.** »$5\,\text{Mm}$ je pet milimetrov.« Velika črka $\text{M}$ pomeni mega ($10^6$), mala $\text{m}$ mili ($10^{-3}$). Zato pri predponah vedno pazi na veliko in malo črko.

## Povzetek

- Fizikalna količina je zmnožek številske vrednosti in enote.
- SI je mednarodni sistem enot; osnovne enote so meter, kilogram, sekunda, amper, kelvin, mol in kandela.
- Izpeljane enote sestavimo iz osnovnih (npr. $\dfrac{\text{m}}{\text{s}}$, $\text{m}^3$, $\dfrac{\text{kg}}{\text{m}^3}$).
- Predpone pomenijo potence števila $10$: $\text{k} = 10^3$, $\text{c} = 10^{-2}$, $\text{m} = 10^{-3}$, $\mu = 10^{-6}$ itd.
- Pri ploščinah in prostorninah potenco predpone potenciramo ($\text{cm}^2 \to 10^{-4}$, $\text{cm}^3 \to 10^{-6}$).
- Iz $\text{km/h}$ v $\text{m/s}$ delimo s $3{,}6$.
- Pred računom vse količine pretvori v osnovne enote SI.

## Drugače: Z analogijo

Pretvarjanje enot je kot menjava denarja na potovanju. Za $1$ evro dobiš $100$ centov. Denarja imaš enako, kovancev pa stokrat več, ker je cent manjša enota. Ko cente zamenjaš nazaj v evre, dobiš manj kosov, vrednost pa ostane.

Enako je z dolžino: $1\,\text{km}$ zamenjaš za $1000\,\text{m}$. Predpona je »menjalni tečaj«: $\text{k}$ pomeni tečaj $1000$, $\text{c}$ tečaj $\dfrac{1}{100}$. Razdalja se ne spremeni, spremeni se le, koliko »kovancev« (enot) jo sestavlja.

Pri ploščini pa menjaš dvakrat zapored, za vsako stranico enkrat. Zato je tečaj med $\text{m}^2$ in $\text{cm}^2$ enak $100 \cdot 100 = 10\,000$.

Analogija ima mejo: pri denarju tečaj dogovorita banka in trg in se spreminja, predpone pa so stalne in povsod enake.

## Drugače: Iz vsakdanjega življenja

Enote srečuješ ves dan:

- Mleko v trgovini: $1\,\text{L}$ je $1\,\text{dm}^3$, torej $0{,}001\,\text{m}^3$.
- Hitrost avtomobila na avtocesti: $130\,\dfrac{\text{km}}{\text{h}}$. To je $130 : 3{,}6 \approx 36{,}1\,\dfrac{\text{m}}{\text{s}}$. V sekundi avto prevozi več kot $36$ metrov, kar je več kot dolžina $25$-metrskega bazena.
- Spominska kartica ima napisano $64\,\text{GB}$. Predpona $\text{G}$ (giga) pomeni $10^9$, torej $64 \cdot 10^9$ bajtov.
- Mikroskopske velikosti: debelina človeškega lasu je približno $70\,\mu\text{m} = 70 \cdot 10^{-6}\,\text{m}$.

Primer iz kuhinje: recept zahteva $250\,\text{g}$ moke. V SI je to $0{,}25\,\text{kg}$. Tehtnica kaže gram zato, ker je za vsakdanjo rabo bolj priročen, v fizikalnih formulah pa uporabljamo kilogram.

## Drugače: Korak za korakom s številkami

Recept za pretvarjanje:

1. Zapiši dano vrednost z enoto, npr. $3600\,\text{mm}^2$.
2. Ločeno zapiši predpono in osnovno enoto: $\text{mm}^2 = (\text{mm})^2 = (10^{-3}\,\text{m})^2$.
3. Potenciraj: $(10^{-3})^2 = 10^{-6}$, torej $1\,\text{mm}^2 = 10^{-6}\,\text{m}^2$.
4. Pomnoži: $3600 \cdot 10^{-6}\,\text{m}^2 = 0{,}0036\,\text{m}^2$.
5. Preveri smiselnost: $\text{mm}^2$ je zelo majhna enota, zato mora biti število v $\text{m}^2$ veliko manjše. ✓

Tabela za hitro rabo:

| Pretvorba | Faktor |
|---|---|
| $1\,\text{km}$ v $\text{m}$ | $\cdot\,10^3$ |
| $1\,\text{cm}$ v $\text{m}$ | $\cdot\,10^{-2}$ |
| $1\,\text{mm}$ v $\text{m}$ | $\cdot\,10^{-3}$ |
| $1\,\text{cm}^2$ v $\text{m}^2$ | $\cdot\,10^{-4}$ |
| $1\,\text{cm}^3$ v $\text{m}^3$ | $\cdot\,10^{-6}$ |
| $1\,\text{g}$ v $\text{kg}$ | $\cdot\,10^{-3}$ |
| $1\,\text{h}$ v $\text{s}$ | $\cdot\,3600$ |

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
> Količina hitrost $= 50 \cdot \text{km/h}$: številska vrednost je $50$, enota je kilometer na uro.

? Na tabli ob poti piše, da je do razgledišča $0{,}35\,\text{km}$. Kaj se zgodi s številom, če isto razdaljo zapišeš v metrih?
- Zmanjša se na $0{,}00035$.
~ To je napačna smer. Meter je manjša enota, zato potrebuješ več metrov in število je večje.
- Ostane $0{,}35$, saj se razdalja ne spremeni.
~ Razdalja res ostane enaka, enota pa je manjša, zato se število spremeni.
- Poveča se na $35$.
~ Tako bi bilo, če bi kilo pomenil $100$. Kilo pomeni $10^3 = 1000$.
+ Poveča se na $350$.
> Predpona kilo pomeni $10^3$, zato $0{,}35 \cdot 1000 = 350\,\text{m}$. Kilometer je večja enota, zato je število v metrih večje.

? Trije pohodniki povedo, kako daleč so še od koče: Ana $0{,}2\,\text{km}$, Bor $1500\,\text{cm}$, Cene $30\,\text{m}$. Kako si sledijo od najbližjega do najbolj oddaljenega?
- Ana, Cene, Bor
~ Primerjal si samo števila $0{,}2 < 30 < 1500$, brez enot. Najprej pretvori vse v isto enoto.
- Bor, Ana, Cene
~ Tako dobiš, če $0{,}2\,\text{km}$ pretvoriš v $20\,\text{m}$. Kilo pomeni $1000$, torej $200\,\text{m}$.
+ Bor, Cene, Ana
> V metrih: Bor $1500 \cdot 10^{-2} = 15\,\text{m}$, Cene $30\,\text{m}$, Ana $0{,}2 \cdot 1000 = 200\,\text{m}$.

? Koliko $\text{m}^2$ je $500\,\text{cm}^2$?
- $5\,\text{m}^2$
~ Uporabil si faktor $10^{-2}$ kot pri dolžini. Pri ploščini se pretvorita obe stranici: $10^{-4}$.
- $5000\,\text{m}^2$
~ Napačna smer: $\text{m}^2$ je večja enota, zato mora biti število manjše od $500$.
- $0{,}5\,\text{m}^2$
~ To je faktor $10^{-3}$, ki velja za mili pri dolžini. Za $\text{cm}^2$ je faktor $10^{-4}$.
+ $0{,}05\,\text{m}^2$
> $1\,\text{cm}^2 = 10^{-4}\,\text{m}^2$, zato $500 \cdot 10^{-4} = 0{,}05\,\text{m}^2$. Če bi uporabili samo $10^{-2}$, bi dobili $5\,\text{m}^2$, kar je napaka.

? Avto vozi s hitrostjo $72\,\dfrac{\text{km}}{\text{h}}$. Kolikšna je hitrost v $\dfrac{\text{m}}{\text{s}}$?
- $259{,}2\,\dfrac{\text{m}}{\text{s}}$
~ Množil si s $3{,}6$. Ker je $1\,\text{m/s}$ večja hitrost od $1\,\text{km/h}$, mora biti število manjše: deli s $3{,}6$.
- $7{,}2\,\dfrac{\text{m}}{\text{s}}$
~ Delil si z $10$. Ura ima $3600\,\text{s}$, kilometer $1000\,\text{m}$, zato je faktor $3{,}6$.
+ $20\,\dfrac{\text{m}}{\text{s}}$
> Iz $\text{km/h}$ v $\text{m/s}$ delimo s $3{,}6$: $72 : 3{,}6 = 20$. Množenje s $3{,}6$ bi dalo $259{,}2$, kar je napačna smer pretvorbe.

:::simboli
s | pot | s = v \cdot t | m
v | hitrost | | m/s | 1 m/s = 3,6 km/h
t | čas | | s
s_z | razdalja na zemljevidu | | cm | merilo $1 : 50\,000$
:::
