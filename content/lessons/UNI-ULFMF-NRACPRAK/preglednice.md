---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi tračni meter in petkrat izmeri dolžino iste deske, police ali mize. Vsakič meter na novo nastavi in odčitaj na milimeter natančno. Še bolje: naj vsak od petih sošolcev izmeri enkrat. Ena skupina je dobila tole (v cm):

$120{,}3$; $120{,}1$; $120{,}4$; $119{,}8$; $120{,}4$

Kako dolgo desko naj odrežeš za polico? Pri petih številih zmoreš na roke, pri sto meritvah ali seznamu materiala za vrtno lopo pa ne več zanesljivo. **Preglednica** (npr. LibreOffice Calc, Excel ali Google Preglednice) to naredi namesto tebe: v celice vpišeš podatke in **formule**, ki se ob vsaki spremembi podatkov same preračunajo, iz istih stolpcev narišeš **graf** in v eni vrstici dobiš **osnovno statistiko**.

## Razlaga

**1. Celice in naslovi.** Stolpci preglednice so označeni s črkami, vrstice s številkami, zato ima vsaka celica **naslov**: `B3` je celica v stolpcu B in vrstici 3. Pravokotno območje zapišemo z dvopičjem: `B2:B6` pomeni celice od `B2` do `B6`. V celico lahko vpišeš število (z decimalno vejico, `3,5`), besedilo ali formulo.

**2. Formula se začne z enačajem.** Če vpišeš `=B2*C2`, preglednica ne shrani besedila, ampak zmnožek vrednosti v celicah `B2` in `C2`, in ga prikaže. Takemu naslovu v formuli rečemo **sklic**. Ko spremeniš `B2`, se rezultat takoj spremeni.

**3. Opazi vzorec pri kopiranju.** Delamo seznam materiala za dvignjeno vrtno gredo. V stolpcu E želimo ceno vsake postavke: dolžina krat število kosov krat cena na meter. V `E2` vpišemo `=B2*C2*D2`, nato celico skopiramo navzdol (povlečemo ročico v kotu celice). Poglej, kaj je preglednica zapisala v spodnje celice:

| Celica | Formula po kopiranju | Kaj pomeni |
|---|---|---|
| `E2` | `=B2*C2*D2` | trije sosedje levo, ista vrstica |
| `E3` | `=B3*C3*D3` | trije sosedje levo, ista vrstica |
| `E4` | `=B4*C4*D4` | trije sosedje levo, ista vrstica |

Ob premiku za eno vrstico navzdol se je vsaka številka v sklicih povečala za $1$. Zadnji stolpec razkrije, zakaj: formula si ne zapomni »celice `B2`«, ampak »celico tri stolpce levo od mene, v moji vrstici«.

:::premisli
Formulo `=B2*C2*D2` iz `E2` skopiraš eno celico v desno, v `F2`. Kaj bo v `F2`? Napovej po vzorcu.
---
`=C2*D2*E2`. Ob premiku za en stolpec desno se vsaka črka premakne za eno naprej, številke vrstic pa ostanejo, ker vrstica ni spremenjena.
:::

To je pravilo **relativnega sklica**: ob kopiranju se sklic premakne za toliko vrstic in stolpcev, kolikor se premakne formula. Zato eno formulo napišeš enkrat in jo raztegneš čez sto vrstic.

**4. Kadar se sklic ne sme premakniti.** Za vse postavke želimo prišteti še DDV, ki je v eni sami celici, `H1` ($22\,\%$, vpisano kot `22%` ali `0,22`). Če v `F2` napišemo `=E2*(1+H1)` in kopiramo navzdol, dobi `F3` formulo `=E3*(1+H2)`. Celica `H2` je prazna, prazna celica šteje kot $0$, in rezultat je cena brez DDV. Napake ni, le napačno število.

Sklic zaklenemo z znakom <code>&#36;</code>: <code>&#36;H&#36;1</code> je **absolutni sklic**, ki ob kopiranju ostane <code>&#36;H&#36;1</code>. Pravilna formula je <code>=E2*(1+&#36;H&#36;1)</code>. Dolar lahko zaklene tudi samo en del: v <code>&#36;A2</code> je zaklenjen stolpec, vrstica se premika; v <code>B&#36;1</code> je zaklenjena vrstica, stolpec se premika. To je **mešani sklic**.

Mešani sklic pride prav pri tabeli cen. V `A2:A4` so dolžine desk ($1$; $1{,}5$; $2$ m), v `B1:D1` cene na meter za tri vrste lesa ($3{,}50$; $5{,}20$; $8{,}90$ €/m). V `B2` vpišemo <code>=&#36;A2*B&#36;1</code> in formulo skopiramo čez `B2:D4`. Vsaka celica vzame dolžino iz *svoje vrstice* v stolpcu A in ceno iz *svojega stolpca* v vrstici 1. V `C3` bo na primer <code>=&#36;A3*C&#36;1</code>, torej $1{,}5 \cdot 5{,}2 = 7{,}8$ €.

**5. Funkcije za statistiko.** Formula lahko uporablja vgrajene **funkcije**, ki sprejmejo območje. Argumente ločimo s podpičjem (`;`), ker je vejica rezervirana za decimalke. Za meritve deske v `B2:B6`:

| Formula | Kaj izračuna | Rezultat |
|---|---|---|
| `=AVERAGE(B2:B6)` | **povprečje**: vsota, deljena s številom podatkov | $120{,}2$ |
| `=MEDIAN(B2:B6)` | **mediana**: srednji podatek po velikosti | $120{,}3$ |
| `=STDEV.S(B2:B6)` | **standardni odklon**: tipična oddaljenost od povprečja | $\approx 0{,}25$ |

Poleg teh so uporabne še `SUM` (vsota), `COUNT` (število številskih celic), `MIN` in `MAX`. V slovenski različici programa so imena funkcij lahko prevedena; pomen je enak.

Standardni odklon $0{,}25\,\text{cm}$ pove, da se meritve od povprečja tipično razlikujejo za približno $2{,}5\,\text{mm}$. Za polico je to dovolj natančno.

:::premisli
Šesti sošolec se je zmotil in prebral $102{,}4\,\text{cm}$ (meter mu je zdrsnil). Kaj se zgodi s povprečjem in kaj z mediano, ko to meritev dodaš? Napovej, katera se spremeni bolj.
---
Povprečje pade na približno $117{,}2\,\text{cm}$, ker en sam skrajni podatek potegne vsoto navzdol. Mediana je zdaj povprečje dveh srednjih podatkov, $120{,}1$ in $120{,}3$, torej $120{,}2\,\text{cm}$, in se skoraj ne premakne.
:::

**6. Grafi.** Graf narišeš tako, da označiš stolpce s podatki in izbereš vrsto grafa. Kot pri risanju grafov funkcij na roke rišeš pare $(x, y)$, le da sta $x$ in $y$ v dveh stolpcih: $0$ v `A2`, `=A2+0,5` v `A3` in `=A2^2` v `B2`, obe formuli raztegnjeni navzdol, dajo tabelo za $y = x^2$.

Izbira vrste grafa je pomembna:

- **Raztreseni (XY) graf**: obe osi sta številski, razdalje na osi $x$ so sorazmerne vrednostim. Za meritve, kjer je $x$ število (obremenitev, čas, dolžina).
- **Stolpčni graf**: os $x$ so kategorije z enakimi razmiki (vrste lesa, postavke materiala). Za primerjanje količin.
- **Tortni graf**: deli celote (kolikšen del skupne cene je les).

Primer: polico obremenjujemo in merimo, koliko se upogne na sredini (poves).

| Obremenitev [kg] | Poves [mm] |
|---|---|
| 0 | 0 |
| 5 | 1,2 |
| 10 | 2,4 |
| 15 | 3,6 |
| 20 | 4,9 |

Na raztresenem grafu točke ležijo skoraj na premici skozi izhodišče: vsakih $5\,\text{kg}$ doda približno $1{,}2\,\text{mm}$. Vsak graf naj ima naslove osi z enotami.

## Rešeni primeri

### Primer 1 (lažji): formula in kopiranje

Za vrtno gredo potrebuješ $4$ deske po $2\,\text{m}$ po ceni $3{,}50$ €/m in $8$ letev po $0{,}6\,\text{m}$ po ceni $1{,}25$ €/m. Podatki deske so v vrstici 2, letve v vrstici 3: dolžina v B, število kosov v C, cena na meter v D. V `E2` vpišeš `=B2*C2*D2` in formulo skopiraš v `E3`. Kaj je v `E3` in koliko stane vse skupaj?

**Podatki:** deske: $B2 = 2\,\text{m}$, $C2 = 4$, $D2 = 3{,}50$ €/m; letve: $B3 = 0{,}6\,\text{m}$, $C3 = 8$, $D3 = 1{,}25$ €/m; formula v `E2`: `=B2*C2*D2`
**Iščemo:** formulo v `E3`, vrednosti `E2`, `E3` in skupno ceno

:::formula
cena postavke $=$ dolžina $\cdot$ kosi $\cdot$ cena na meter; relativni sklici se ob kopiranju za eno vrstico navzdol povečajo za $1$.
:::

**Rešitev:**

1. `E2`: $2 \cdot 4 \cdot 3{,}5 = 28$ €.
2. Kopiranje za eno vrstico navzdol premakne vse sklice: v `E3` je `=B3*C3*D3`.
3. `E3`: $0{,}6 \cdot 8 \cdot 1{,}25 = 6$ €.
4. Skupaj z `=SUM(E2:E3)`: $28 + 6 = 34$ €.
5. Odgovor: v `E3` je `=B3*C3*D3`, material stane $34$ € (brez DDV).

### Primer 2: absolutni sklic za DDV

Cenam iz primera 1 prištej DDV $22\,\%$, ki je vpisan v `H1`. Napiši formulo za `F2`, ki jo lahko skopiraš v `F3`, in izračunaj obe ceni z DDV. Kaj bi dobil v `F3`, če bi v `F2` napisal `=E2*(1+H1)`?

**Podatki:** $E2 = 28$ €, $E3 = 6$ €, $H1 = 22\,\% = 0{,}22$, celica `H2` je prazna
**Iščemo:** pravilno formulo v `F2`, vrednosti `F2` in `F3`, napačno vrednost `F3`

:::formula
cena z DDV $=$ cena $\cdot (1 + \text{DDV})$; sklic na stalno celico zaklenemo: <code>&#36;H&#36;1</code>.
:::

**Rešitev:**

1. DDV je za vse vrstice v isti celici, zato mora sklic nanjo ostati na mestu: `F2` = <code>=E2*(1+&#36;H&#36;1)</code>.
2. `F2`: $28 \cdot 1{,}22 = 34{,}16$ €.
3. Po kopiranju je v `F3` formula <code>=E3*(1+&#36;H&#36;1)</code>: $6 \cdot 1{,}22 = 7{,}32$ €.
4. Brez dolarjev bi `F3` dobil `=E3*(1+H2)`. Prazna `H2` šteje kot $0$: $6 \cdot (1 + 0) = 6$ €. Napaka je tiha.
5. Odgovor: formula <code>=E2*(1+&#36;H&#36;1)</code> da $34{,}16$ € in $7{,}32$ €, skupaj $41{,}48$ €; z relativnim sklicem bi `F3` pokazal napačnih $6$ €.

### Primer 3 (težji): katera vrednost je prava

Šest sošolcev je izmerilo dolžino deske: $120{,}3$; $120{,}1$; $120{,}4$; $119{,}8$; $120{,}4$; $102{,}4$ cm (v `B2:B7`). Izračunaj `=AVERAGE(B2:B7)` in `=MEDIAN(B2:B7)`. Po kateri vrednosti odrežeš desko za polico in zakaj?

**Podatki:** šest meritev v `B2:B7`: $120{,}3$; $120{,}1$; $120{,}4$; $119{,}8$; $120{,}4$; $102{,}4$ cm
**Iščemo:** povprečje, mediano in odločitev

:::formula
povprečje $\bar{x} = \dfrac{x_1 + \dots + x_n}{n}$; mediana pri sodem $n$ je povprečje dveh srednjih podatkov po velikosti.
:::

**Rešitev:**

1. Vsota: $120{,}3 + 120{,}1 + 120{,}4 + 119{,}8 + 120{,}4 + 102{,}4 = 703{,}4$.
2. Povprečje: $\dfrac{703{,}4}{6} \approx 117{,}23$ cm.
3. Po velikosti: $102{,}4$; $119{,}8$; $120{,}1$; $120{,}3$; $120{,}4$; $120{,}4$. Srednja sta tretji in četrti podatek.
4. Mediana: $\dfrac{120{,}1 + 120{,}3}{2} = 120{,}2$ cm.
5. Povprečje je za več kot $2{,}5\,\text{cm}$ krajše od vsake od petih dobrih meritev; tako kratka deska bi bila neuporabna. Kriva je ena očitno napačna meritev, ki jo povprečje upošteva z enako težo kot ostale.
6. Odgovor: povprečje je $117{,}2$ cm, mediana $120{,}2$ cm. Režeš po mediani ali, še bolje, napačno meritev preveriš in izločiš; povprečje preostalih petih je tudi $120{,}2$ cm.

### Primer 4: zdaj ti

Za rob terase potrebuješ $18\,\text{m}$ letve. Letve prodajajo le cele, po $2{,}5\,\text{m}$, po ceni $3{,}50$ €/m. Funkcija `=ROUNDUP(x;0)` zaokroži število $x$ navzgor na celo število. Koliko letev kupiš in koliko plačaš?

**Podatki:** potrebna dolžina $18\,\text{m}$, dolžina letve $2{,}5\,\text{m}$, cena $3{,}50$ €/m, le cele letve
**Iščemo:** število letev in ceno

:::formula
število letev $=$ `=ROUNDUP(18/2,5;0)`; cena $=$ število letev $\cdot\ 2{,}5\,\text{m} \cdot 3{,}50$ €/m
:::

**Rešitev:**

1. $\dfrac{18}{2{,}5} = 7{,}2$ letve. Sedem letev ni dovolj, dela letve pa ne moreš kupiti.
2. Zato zaokrožimo navzgor, ne po pravilih zaokroževanja.
3. Dokončaj sam, nato preveri:

:::premisli
Koliko letev kupiš in koliko plačaš?
---
`ROUNDUP` da $8$ letev. Cena: $8 \cdot 2{,}5 \cdot 3{,}5 = 70$ €. Navadno zaokroževanje bi dalo $7$ letev, ki merijo le $17{,}5\,\text{m}$.
:::

## Pogoste napake

- **Relativni sklic na stalno celico.** Misel: »Formula v prvi vrstici je pravilna, torej bodo pravilne vse.« Ob kopiranju se `H1` premakne v `H2`, `H3` …, ki so prazne, in rezultat je tiho napačen. Popravek: stalne celice zakleni z <code>&#36;H&#36;1</code> in preveri eno kopirano formulo.
- **Vpisan rezultat namesto formule.** Misel: »$28$ sem izračunal na kalkulatorju, vpišem kar število.« Ko spremeniš ceno ali število kosov, se $28$ ne posodobi. Popravek: v celico vedno napiši formulo s sklici, števila pa le v podatkovne celice.
- **Decimalna pika.** Misel: »Pišem kot v programiranju, `3.5`.« V slovenski nastavitvi preglednica `3.5` prebere kot besedilo ali celo kot datum (3. maj), formula pa s tem računa narobe ali javi napako. Popravek: decimalna vejica v podatkih, podpičje med argumenti funkcij.
- **Povprečje ne glede na podatke.** Misel: »Povprečje je vedno najboljša vrednost.« En skrajni podatek ga lahko močno premakne, mediane pa skoraj ne. Popravek: izračunaj oboje; če se precej razlikujeta, poišči napačno meritev.
- **Stolpčni graf za številsko os $x$.** Misel: »Graf je graf.« Stolpčni graf postavi vse vrednosti $x$ na enake razmike, tudi $5$, $10$ in $40$ kg, zato oblika odvisnosti izgine. Popravek: za par številskih količin izberi raztreseni (XY) graf.

## Povzetek

- Celica ima naslov (`B3`), območje zapišemo z dvopičjem (`B2:B6`). Formula se začne z `=`.
- Relativni sklic (`B2`) se ob kopiranju premakne skupaj s formulo; absolutni (<code>&#36;H&#36;1</code>) ostane; mešani (<code>&#36;A2</code>, <code>B&#36;1</code>) zaklene le stolpec ali le vrstico.
- Statistika: `AVERAGE` (povprečje), `MEDIAN` (mediana), `STDEV.S` (standardni odklon), `SUM`, `COUNT`, `MIN`, `MAX`. Argumente ločimo s podpičjem.
- Mediana je neobčutljiva za posamezne skrajne podatke, povprečje ni.
- Raztreseni (XY) graf za dve številski količini, stolpčni za kategorije, tortni za dele celote. Osi z naslovi in enotami.
- Decimalna vejica v podatkih; v celico vpisuj formule, ne izračunanih števil.

## Drugače: Korak za korakom s številkami

Kaj preglednica naredi pri `=AVERAGE(B2:B6)` in `=STDEV.S(B2:B6)` za pet meritev deske? Vse lahko narediš tudi sam, v treh pomožnih stolpcih.

| $x$ [cm] | $x - \bar{x}$ | $(x - \bar{x})^2$ |
|---|---|---|
| $120{,}3$ | $0{,}1$ | $0{,}01$ |
| $120{,}1$ | $-0{,}1$ | $0{,}01$ |
| $120{,}4$ | $0{,}2$ | $0{,}04$ |
| $119{,}8$ | $-0{,}4$ | $0{,}16$ |
| $120{,}4$ | $0{,}2$ | $0{,}04$ |

1. Vsota je $601$, povprečje $\bar{x} = \dfrac{601}{5} = 120{,}2$ cm (`=SUM(B2:B6)/COUNT(B2:B6)`).
2. Odmiki od povprečja (drugi stolpec, <code>=B2-&#36;E&#36;1</code>, kjer je v `E1` povprečje) imajo vsoto $0$, zato iz njih samih ne vidiš razpršenosti.
3. Kvadrati odmikov so vsi pozitivni; njihova vsota je $0{,}01 + 0{,}01 + 0{,}04 + 0{,}16 + 0{,}04 = 0{,}26$.
4. Vsoto delimo z $n - 1 = 4$: $\dfrac{0{,}26}{4} = 0{,}065$.
5. Koren: $\sqrt{0{,}065} \approx 0{,}255$ cm. Toliko izračuna `STDEV.S`.
6. Mediana: meritve uredimo, $119{,}8$; $120{,}1$; $120{,}3$; $120{,}4$; $120{,}4$, srednja je tretja, $120{,}3$ cm.

V drugem koraku je uporabljen absolutni sklic <code>&#36;E&#36;1</code>, ker vsi odmiki merijo od istega povprečja.

## Drugače: Kot zgodba

Tina je za vikend načrtovala vrtno gredo. V preglednico je vpisala deske, letve, vijake in kotnike, v vsako vrstico dolžino, število kosov in ceno. V prvo vrstico je napisala formulo za ceno postavke in jo potegnila navzdol. Vseh deset cen se je pojavilo naenkrat. Ko je v trgovini videla, da so letve dražje, je popravila eno samo celico in skupna cena se je sama posodobila.

Nato je v `H1` vpisala DDV in dodala stolpec s cenami z DDV. Prva vrstica je bila pravilna, skupna vsota pa se ji je zdela premajhna. Kliknila je na drugo postavko in zagledala `=E3*(1+H2)`. Formula je pridno »sledila« svoji vrstici in iskala DDV v prazni celici. Tina je dodala dva dolarja, <code>&#36;H&#36;1</code>, ponovno potegnila formulo in vsota je narasla na pravo vrednost.

Ob nakupu je z bratom petkrat izmerila prostor za gredo. Brat je enkrat prebral $10\,\text{cm}$ premalo. Povprečje se je skrčilo, mediana pa je ostala skoraj enaka; tako sta zmoto sploh opazila. Za konec je narisala stolpčni graf stroškov: najvišji stolpec so bile deske.

## Drugače: Bolj natančno

Za podatke $x_1, \dots, x_n$ s povprečjem $\bar{x}$ je **vzorčni standardni odklon**

$$s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2}.$$

To računa `STDEV.S` (prej `STDEV`); `STDEV.P` deli z $n$ in velja, kadar imamo vso populacijo, ne le vzorec.

Zakaj $n - 1$? Ker je $\sum_i (x_i - \bar{x}) = 0$, je prostih le $n - 1$ odmikov. Poleg tega je $\bar{x}$ podatkom bližje kot prava (neznana) srednja vrednost, zato je vsota kvadratov odmikov od $\bar{x}$ v povprečju premajhna. Deljenje z $n - 1$ to natanko popravi: pričakovana vrednost $s^2$ je varianca populacije.

## Preveri se

? Polico obremeniš z $0$, $5$, $10$, $20$ in $40\,\text{kg}$ in vsakič izmeriš poves v mm. Kateri graf pravilno pokaže, kako je poves odvisen od obremenitve?
- Stolpčni graf z obremenitvami kot kategorijami.
~ Stolpčni graf postavi $5$, $10$, $20$ in $40$ na enake razmike, zato se oblika odvisnosti popači.
+ Raztreseni (XY) graf z obremenitvijo na osi $x$ in povesom na osi $y$.
- Tortni graf povesov.
~ Tortni graf kaže dele celote. Povesi pri različnih obremenitvah niso deli ene celote.
> Obe količini sta števili, zato potrebuješ graf, na katerem so razdalje na osi $x$ sorazmerne vrednostim: raztreseni (XY) graf.

? Meritve: $48{,}2$; $48{,}5$; $47{,}9$; $48{,}4$; $61{,}0$ cm. Oceni brez računala: koliko približno je povprečje?
- Približno $48{,}4$ cm.
~ To je mediana, srednji podatek po velikosti. Povprečje upošteva tudi $61{,}0$, ki ga potegne navzgor.
+ Približno $50{,}8$ cm.
- Približno $54{,}5$ cm.
~ To je sredina med najmanjšim in največjim podatkom. Povprečje upošteva vseh pet podatkov z enako težo.
> Štirje podatki so okoli $48$, peti je za približno $13$ večji. Petina tega, približno $2{,}6$, se prišteje k $48$: približno $50{,}6$ cm, kar je najbližje $50{,}8$. Natančno: $\dfrac{254}{5} = 50{,}8$ cm.

? Zakaj je v formuli <code>=E2*(1+&#36;H&#36;1)</code> pred črko in številko celice `H1` znak <code>&#36;</code>?
- Da je rezultat prikazan v evrih.
~ Prikaz valute je oblika celice, ne del sklica.
- Da preglednica ve, da je v `H1` odstotek.
~ Odstotek je v `H1` shranjen kot število $0{,}22$ ne glede na dolarje.
+ Da se sklic ob kopiranju formule v druge vrstice ne premakne in vse vrstice vzamejo DDV iz `H1`.
- Da preglednica sklic izračuna pred množenjem.
~ Vrstni red računanja določajo oklepaji in prednost operacij, ne znak <code>&#36;</code>.
> Brez <code>&#36;</code> bi se `H1` ob kopiranju navzdol premaknil v `H2`, `H3` …, ki so prazne in štejejo kot $0$.

? Povprečje petih meritev je $120{,}2$ cm. Štiri meritve so $120{,}3$; $120{,}1$; $120{,}4$; $119{,}8$ cm. Koliko je peta?
- $120{,}2$ cm
~ Misliš, da mora biti manjkajoči podatek enak povprečju. To velja le, če je povprečje prvih štirih že enako $120{,}2$.
- $120{,}15$ cm
~ To je povprečje štirih znanih meritev, ne manjkajoča meritev.
+ $120{,}4$ cm
> Vsota vseh petih je $5 \cdot 120{,}2 = 601$. Štiri znane dajo $480{,}6$, zato je peta $601 - 480{,}6 = 120{,}4$ cm.

? V tabeli cen so dolžine desk v stolpcu A, cene na meter v vrstici 1. V `B2` je <code>=&#36;A2*B&#36;1</code>. Formulo skopiraš v `C3`. Kaj je v `C3`?
- <code>=&#36;A2*B&#36;1</code>
~ Misliš, da <code>&#36;</code> zaklene cel sklic. Zaklene le del, pred katerim stoji.
- `=A3*C2`
~ Dolarji niso izginili: stolpec A in vrstica 1 ostaneta zaklenjena.
+ <code>=&#36;A3*C&#36;1</code>
- <code>=&#36;B3*C&#36;1</code>
~ Stolpec A je zaklenjen z <code>&#36;</code> pred črko, zato se ne premakne v B.
> Premik je za eno vrstico in en stolpec. V <code>&#36;A2</code> se premakne le vrstica (v <code>&#36;A3</code>), v <code>B&#36;1</code> le stolpec (v <code>C&#36;1</code>). Tako vsaka celica vzame dolžino iz svoje vrstice in ceno iz svojega stolpca.

:::simboli
s | vzorčni standardni odklon | s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2} | | v enoti podatkov; s² je varianca
\bar{x} | aritmetična sredina (povprečje) | \bar{x} = \frac{x_1 + \dots + x_n}{n}
x | podatek (vrednost v celici) | | | x₁, …, xₙ vsi podatki
n | število podatkov
i | zaporedna številka podatka
:::
