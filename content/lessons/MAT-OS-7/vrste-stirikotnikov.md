---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Grški zgodovinar Herodot je zapisal, da so v starem Egiptu po vsaki poplavi Nila na novo merili njive, ker je voda odnesla mejnike. Merilci so morali z vrvmi in koli ugotoviti, kakšne oblike je posestvo in kolikšen je kot na vogalu. Nekaj stoletij pozneje, okoli leta 300 pr. n. št., je Evklid v *Elementih* štirikotnike razvrstil in poimenoval. Beseda trapez izvira iz grške besede za »mizico«.

Isto vprašanje te čaka ob zemljevidu mesta. Štiri ulice obkrožajo blok hiš. Dve ulici tečeta vzporedno, drugi dve ne. Kako se imenuje tak lik? In če načrt pove kot na enem vogalu, koliko merijo drugi trije? Ko poznaš vrste štirikotnikov in njihove lastnosti, odgovoriš brez kotomera.

## Razlaga

Poglej štiri like na sliki. Vsi imajo nekaj skupnega.

:::risba skica
opis: Štirje štirikotniki, vsak s črtkanima diagonalama. Zgoraj levo paralelogram s poševnima stranskima stranicama. Zgoraj desno pravokotnik s štirimi pravimi koti. Spodaj levo romb s štirimi enako dolgimi poševnimi stranicami; njegovi diagonali se sekata pod pravim kotom. Spodaj desno kvadrat. Pri vseh štirih sta spodnja in zgornja stranica vzporedni, prav tako leva in desna.
območje: -0,5; -0,8 .. 14,5; 9
lik: 0; 5,5 -> 5; 5,5 -> 6,5; 8,5 -> 1,5; 8,5 | modra zaprto
črta: 0; 5,5 -> 6,5; 8,5 | črtkano siva
črta: 5; 5,5 -> 1,5; 8,5 | črtkano siva
napis: 3,25; 5,5 | paralelogram | pod
lik: 9; 5,5 -> 14; 5,5 -> 14; 8,5 -> 9; 8,5 | modra zaprto
črta: 9; 5,5 -> 14; 8,5 | črtkano siva
črta: 14; 5,5 -> 9; 8,5 | črtkano siva
pravikot: 9; 5,5 | 14; 5,5 | 9; 8,5
napis: 11,5; 5,5 | pravokotnik | pod
lik: 0; 0,5 -> 3,5; 0,5 -> 5,6; 3,3 -> 2,1; 3,3 | oranžna zaprto
črta: 0; 0,5 -> 5,6; 3,3 | črtkano siva
črta: 3,5; 0,5 -> 2,1; 3,3 | črtkano siva
pravikot: 2,8; 1,9 | 5,6; 3,3 | 2,1; 3,3
napis: 2,8; 0,5 | romb | pod
lik: 9; 0,5 -> 12; 0,5 -> 12; 3,5 -> 9; 3,5 | oranžna zaprto
črta: 9; 0,5 -> 12; 3,5 | črtkano siva
črta: 12; 0,5 -> 9; 3,5 | črtkano siva
napis: 10,5; 0,5 | kvadrat | pod
:::

Pri vseh štirih sta po dve nasprotni stranici vzporedni. Štirikotnik z **dvema paroma vzporednih stranic** je **paralelogram**. Na sliki zgoraj levo vidiš njegove lastnosti: nasprotni stranici sta enako dolgi, nasprotna kota sta enaka, sosednja kota skupaj merita $180^\circ$. Diagonala je daljica med nasprotnima ogliščema. Diagonali paralelograma se **razpolavljata**: sekata se v točki, ki je sredina obeh.

Trije liki so posebni paralelogrami. **Pravokotnik** ima štiri prave kote; njegovi diagonali sta enako dolgi. **Romb** ima štiri enako dolge stranice; njegovi diagonali sta pravokotni in razpolavljata notranje kote. **Kvadrat** je hkrati pravokotnik in romb, zato ima vse to.

:::premisli
Mestni trg ima obliko paralelograma. Kot na enem vogalu meri $70^\circ$. Napovej, koliko merijo drugi trije, preden bereš naprej.
---
$110^\circ$, $70^\circ$ in $110^\circ$. Sosednji kot je $180^\circ - 70^\circ = 110^\circ$, nasprotna kota pa sta enaka.
:::

Druga slika kaže like, ki niso nujno paralelogrami.

:::risba skica
opis: Trije štirikotniki. Levo trapez: spodnja in zgornja stranica sta vzporedni, zgornja je krajša, stranski stranici sta različno nagnjeni. V sredini enakokraki trapez z enako dolgima, enako nagnjenima stranskima stranicama. Desno deltoid z oglišči A levo, B spodaj, C desno in D zgoraj; stranici AB in AD sta enako dolgi, prav tako CB in CD. Diagonala AC je vodoravna, diagonala BD navpična; sekata se pod pravim kotom.
območje: -0,5; -0,9 .. 20; 4,3
lik: 0; 0,5 -> 6; 0,5 -> 4,5; 3,5 -> 1; 3,5 | modra zaprto
napis: 3; 0,5 | trapez | pod
lik: 7,5; 0,5 -> 13,5; 0,5 -> 12; 3,5 -> 9; 3,5 | modra zaprto
napis: 10,5; 0,5 | enakokraki trapez | pod
lik: 14,5; 2 -> 16,5; 0,5 -> 19,5; 2 -> 16,5; 3,5 | oranžna zaprto
črta: 14,5; 2 -> 19,5; 2 | črtkano siva
črta: 16,5; 0,5 -> 16,5; 3,5 | črtkano siva
pravikot: 16,5; 2 | 19,5; 2 | 16,5; 3,5
točka: 14,5; 2 | A | levo
točka: 16,5; 0,5 | B | desno
točka: 19,5; 2 | C | desno
točka: 16,5; 3,5 | D | desno
napis: 18,3; 0,5 | deltoid | pod
:::

**Trapez** je štirikotnik z **vsaj enim parom vzporednih stranic**. Vzporedni stranici sta **osnovnici**, drugi dve sta **kraka**. Kota ob istem kraku skupaj merita $180^\circ$. Razlog je isti kot pri sosednjih kotih paralelograma: krak seka dve vzporedni osnovnici. **Enakokraki trapez** ima enako dolga kraka, ki nista vzporedna (sicer bi bil lik paralelogram). Kota ob isti osnovnici sta pri njem enaka, diagonali sta enako dolgi. **Pravokotni trapez** ima krak, ki je pravokoten na osnovnici, zato ima dva prava kota.

**Deltoid** je štirikotnik z **dvema paroma enako dolgih sosednjih stranic**. Diagonala skozi oglišči, kjer se stikata enaki stranici (na sliki $AC$), je njegova **os simetrije**. Diagonali sta pravokotni, os simetrije razpolavlja drugo diagonalo in kota, skozi katera gre. Kota ob drugih dveh ogliščih sta enaka.

:::premisli
Zakaj sta v deltoidu na sliki kota pri $B$ in $D$ enaka? Namig: diagonala $AC$ razdeli deltoid na dva trikotnika.
---
Trikotnika $ABC$ in $ADC$ imata enake vse tri stranice: $|AB| = |AD|$, $|CB| = |CD|$, stranica $AC$ pa je skupna. Po izreku sss sta skladna, zato imata enake istoležne kote; kot pri $B$ je enak kotu pri $D$.
:::

Vse lastnosti zbrane v tabeli:

| Lik | Stranice | Koti | Diagonali |
|---|---|---|---|
| paralelogram | nasprotni enaki | nasprotna enaka | se razpolavljata |
| pravokotnik | nasprotni enaki | vsi $90^\circ$ | enako dolgi |
| romb | vse enake | nasprotna enaka | pravokotni |
| kvadrat | vse enake | vsi $90^\circ$ | enako dolgi, pravokotni |
| trapez | osnovnici vzporedni | ob kraku skupaj $180^\circ$ | nič posebnega |
| enakokraki trapez | kraka enaka | ob osnovnici enaka | enako dolgi |
| deltoid | dva para enakih sosednjih | dva nasprotna enaka | pravokotni |

Liki tvorijo družino. Kvadrat je pravokotnik in romb. Romb je paralelogram in tudi deltoid. Paralelogram je poseben trapez, saj ima celo dva para vzporednih stranic. Zato velja »vsak kvadrat je romb«, ne pa »vsak romb je kvadrat«.

Zdaj še oznake. Štirikotnik $ABCD$ ima oglišča označena v nasprotni smeri urnega kazalca. Stranice so $a = |AB|$, $b = |BC|$, $c = |CD|$, $d = |DA|$, notranji koti pa $\alpha$ pri $A$, $\beta$ pri $B$, $\gamma$ pri $C$ in $\delta$ pri $D$. Diagonali sta $e = |AC|$ in $f = |BD|$. Diagonala razdeli štirikotnik na dva trikotnika, vsak ima vsoto kotov $180^\circ$, zato je

$$\alpha + \beta + \gamma + \delta = 360^\circ$$

V paralelogramu je $\alpha = \gamma$, $\beta = \delta$ in $\alpha + \beta = 180^\circ$. V trapezu z osnovnicama $a$ in $c$ se dopolnjujeta kota ob kraku:

$$\alpha + \delta = 180^\circ$$

$$\beta + \gamma = 180^\circ$$

V deltoidu z $|AB| = |AD|$ in $|CB| = |CD|$ je $\beta = \delta$.

V simulaciji spodaj (**Vrste štirikotnikov**) izberi pravokotnik, nato romb, in vklopi diagonali. Primerjaj izpis: pri pravokotniku sta diagonali enako dolgi, pri rombu pravokotni. Nato povleci oglišče in opazuj, kdaj se ime lika spremeni.

## Rešeni primeri

### Primer 1 (lažji)

Na načrtu mesta dva para vzporednih ulic obkrožata trg v obliki paralelograma $ABCD$. Kot pri vogalu $A$ meri $\alpha = 65^\circ$. Koliko merijo koti pri drugih treh vogalih?

**Podatki:** paralelogram $ABCD$, $\alpha = 65^\circ$
**Iščemo:** kote $\beta$, $\gamma$, $\delta$

:::formula
V paralelogramu: $\alpha + \beta = 180^\circ$, $\gamma = \alpha$, $\delta = \beta$
:::

**Rešitev:**

1. Kota $\alpha$ in $\beta$ sta sosednja, zato skupaj merita $180^\circ$: $\beta = 180^\circ - 65^\circ = 115^\circ$.
2. Nasprotna kota sta enaka: $\gamma = \alpha = 65^\circ$ in $\delta = \beta = 115^\circ$.
3. Preverimo vsoto: $65^\circ + 115^\circ + 65^\circ + 115^\circ = 360^\circ$. ✓
4. Odgovor: kot pri $B$ meri $115^\circ$, pri $C$ $65^\circ$ in pri $D$ $115^\circ$.

### Primer 2 (srednji)

Jadralci na zemljevidu zaliva označijo regatno progo med bojami $A$, $B$, $C$ in $D$. Boja $A$ je enako daleč od $B$ kot od $D$, boja $C$ pa enako daleč od $B$ kot od $D$. Kot proge pri $A$ meri $\alpha = 80^\circ$, pri $C$ pa $\gamma = 40^\circ$. Koliko merita kota pri $B$ in $D$? Katera diagonala je os simetrije proge?

**Podatki:** $|AB| = |AD|$, $|CB| = |CD|$, $\alpha = 80^\circ$, $\gamma = 40^\circ$
**Iščemo:** kota $\beta$ in $\delta$ ter os simetrije

:::formula
$\alpha + \beta + \gamma + \delta = 360^\circ$; v deltoidu je $\beta = \delta$
:::

**Rešitev:**

1. Proga ima dva para enako dolgih sosednjih stranic, zato je deltoid.
2. Enaki stranici se stikata v $A$ in v $C$, zato je os simetrije diagonala $AC$. Ta prezrcali $B$ v $D$, torej je $\beta = \delta$.
3. Za kota $\beta$ in $\delta$ skupaj ostane $360^\circ - 80^\circ - 40^\circ = 240^\circ$.
4. Kota sta enaka, zato vsak meri $240^\circ : 2 = 120^\circ$.
5. Preverimo: $80^\circ + 120^\circ + 40^\circ + 120^\circ = 360^\circ$. ✓
6. Odgovor: pri $B$ in pri $D$ meri kot $120^\circ$; os simetrije je diagonala $AC$.

### Primer 3 (težji)

Parcela $ABCD$ leži med dvema vzporednima cestama $AB$ in $CD$. Stranski poti $AD$ in $BC$ sta enako dolgi in nista vzporedni. Kot pri $D$ je trikrat tolikšen kot kot pri $A$. Izračunaj vse kote parcele.

**Podatki:** $AB \parallel CD$, $|AD| = |BC|$, $\delta = 3 \cdot \alpha$
**Iščemo:** kote $\alpha$, $\beta$, $\gamma$, $\delta$

:::formula
V trapezu: $\alpha + \delta = 180^\circ$; v enakokrakem trapezu: $\beta = \alpha$, $\gamma = \delta$
:::

**Rešitev:**

1. Stranici $AB$ in $CD$ sta vzporedni, kraka $AD$ in $BC$ pa enako dolga in nevzporedna, zato je parcela enakokraki trapez z osnovnicama $AB$ in $CD$.
2. Kota $\alpha$ in $\delta$ ležita ob istem kraku $AD$, zato je $\alpha + \delta = 180^\circ$.
3. Vstavimo $\delta = 3\alpha$: $\alpha + 3\alpha = 180^\circ$, torej $4\alpha = 180^\circ$.
4. Delimo s $4$: $\alpha = 45^\circ$.
5. Potem je $\delta = 3 \cdot 45^\circ = 135^\circ$.
6. Trapez je enakokrak, zato je $\beta = \alpha = 45^\circ$ in $\gamma = \delta = 135^\circ$.
7. Preverimo: $45^\circ + 45^\circ + 135^\circ + 135^\circ = 360^\circ$. ✓
8. Odgovor: kota ob cesti $AB$ merita po $45^\circ$, kota ob cesti $CD$ pa po $135^\circ$.

### Primer 4 – zdaj ti

Kolesarska pot na karti ima obliko romba $ABCD$. Bližnjica od $A$ do $C$ oklepa z odsekom $AB$ kot $35^\circ$. Koliko merijo koti romba?

**Podatki:** romb $ABCD$, kot med diagonalo $AC$ in stranico $AB$ meri $35^\circ$
**Iščemo:** kote $\alpha$, $\beta$, $\gamma$, $\delta$

:::formula
Diagonala romba razpolavlja kota, skozi katera gre; $\alpha + \beta = 180^\circ$, $\gamma = \alpha$, $\delta = \beta$
:::

**Rešitev:**

1. Bližnjica $AC$ je diagonala, ki razpolavlja kot $\alpha$: $\alpha = 2 \cdot 35^\circ = 70^\circ$.
2. Nasprotna kota sta enaka: $\gamma = \alpha = 70^\circ$.
3. Izračunaj sam še $\beta$ in $\delta$, nato preveri:

:::premisli
Koliko merita $\beta$ in $\delta$?
---
$\beta = 180^\circ - 70^\circ = 110^\circ$ in $\delta = \beta = 110^\circ$. Preizkus: $70^\circ + 110^\circ + 70^\circ + 110^\circ = 360^\circ$.
:::

## Pogoste napake

- **Vsota kotov $180^\circ$ namesto $360^\circ$.** Navada iz trikotnika je močna. Pravilno: štirikotnik razpade na dva trikotnika, zato je vsota $2 \cdot 180^\circ = 360^\circ$.
- **»Romb ni paralelogram, ker je drugačne oblike.«** Učenec si zapomni tipično sliko lika, ne definicije. Pravilno: preveri definicijo. Romb ima dva para vzporednih stranic, zato je paralelogram. Prav tako je kvadrat romb in pravokotnik.
- **Pri trapezu sešteješ napačna kota.** Učenec zapiše $\alpha + \beta = 180^\circ$ kot pri paralelogramu ali pa izenači nasprotna kota. Pravilno: do $180^\circ$ se dopolnjujeta kota ob istem **kraku** ($\alpha + \delta$ in $\beta + \gamma$), ker sta osnovnici vzporedni. Kota ob isti osnovnici sta enaka na primer v enakokrakem trapezu, v splošnem pa ne.
- **Pri deltoidu izenačiš napačna kota.** Ker sta kota »nasprotna« kot pri paralelogramu, se zdi, da je tudi $\alpha = \gamma$. Pravilno: enaka sta le kota, ki ju os simetrije prezrcali enega v drugega, torej kota med različno dolgima stranicama ($\beta = \delta$).
- **Diagonali vedno pravokotni ali vedno enaki.** Lastnost enega lika preneseš na drugega. Pravilno: pravokotni sta diagonali romba, kvadrata in deltoida; enako dolgi sta diagonali pravokotnika, kvadrata in enakokrakega trapeza. Pri splošnem paralelogramu nista ne eno ne drugo.

## Povzetek

- Vsota notranjih kotov štirikotnika: $\alpha + \beta + \gamma + \delta = 360^\circ$.
- Paralelogram: dva para vzporednih stranic; $\alpha = \gamma$, $\beta = \delta$, $\alpha + \beta = 180^\circ$; diagonali se razpolavljata.
- Pravokotnik: vsi koti $90^\circ$, $e = f$. Romb: vse stranice enake, diagonali pravokotni in razpolavljata kote. Kvadrat: oboje.
- Trapez: vsaj en par vzporednih stranic (osnovnici); kota ob kraku skupaj $180^\circ$: $\alpha + \delta = 180^\circ$, $\beta + \gamma = 180^\circ$.
- Enakokraki trapez: kraka enaka in nevzporedna; $\alpha = \beta$, $\gamma = \delta$, $e = f$.
- Deltoid: dva para enakih sosednjih stranic; os simetrije je diagonala $AC$; diagonali pravokotni; $\beta = \delta$.
- Kvadrat je romb in pravokotnik; romb je paralelogram in deltoid.

## Drugače: Z analogijo

Štirikotniki so kot rodbina: otrok podeduje vse lastnosti staršev in doda kakšno svojo.

| Lik | Je poseben … | Kaj doda |
|---|---|---|
| trapez | štirikotnik | en par vzporednih stranic |
| deltoid | štirikotnik | dva para enakih sosednjih stranic |
| paralelogram | trapez | drugi par vzporednih stranic |
| pravokotnik | paralelogram | prave kote |
| romb | paralelogram in deltoid | vse stranice enake |
| kvadrat | pravokotnik in romb | prave kote in enake stranice |

Podobno je z naslovi na pismu. Vsak, ki živi v Mariboru, živi v Sloveniji, ni pa vsak, ki živi v Sloveniji, iz Maribora. Prav tako je vsak kvadrat romb, ni pa vsak romb kvadrat. Ožja skupina je vedno znotraj širše.

## Drugače: Iz vsakdanjega življenja

- **Prometni znak za prednostno cesto** je kvadrat, postavljen na oglišče. Ljudje mu pravijo »romb« in imajo prav: vsak kvadrat je romb.
- **Okvir vrat** preveri mizar tako, da izmeri obe diagonali. Če so nasprotne stranice enako dolge in sta diagonali enaki, je okvir pravokotnik, koti so pravi.
- **Škarjasto dvigalo** ima palice, ki tvorijo rombe. Ko se dviga, se koti spreminjajo, stranice pa ostanejo enake, zato lik ves čas ostane romb.
- **Papirnati zmaj** je deltoid. Palici sta njegovi diagonali in sta pravokotni; palica, ki je os simetrije, drži zmaj v ravnovesju.
- **Prerez nasipa ob avtocesti** je pogosto enakokraki trapez: vrh in dno sta vzporedna, brežini pa enako nagnjeni.
- **Poševna parkirna mesta** so paralelogrami, da avtomobil zapelje vanje brez ostrega zavoja.

## Preveri se

? Kateri lik ne sodi zraven? Trije imajo vedno dva para vzporednih stranic.
- romb
~ Romb je paralelogram s štirimi enakimi stranicami, zato ima dva para vzporednih stranic.
- pravokotnik
~ Pravokotnik je paralelogram s pravimi koti, zato ima dva para vzporednih stranic.
+ deltoid
- kvadrat
~ Kvadrat je hkrati pravokotnik in romb, zato ima dva para vzporednih stranic.
> Deltoid ima dva para enakih *sosednjih* stranic, vzporednih pa v splošnem nima. Dva para ima le deltoid, ki je hkrati romb.

? Na skici je vrt $ABCD$ z označenimi koti. Koliko stopinj meri kot $\delta$ pri oglišču $D$?
:::risba skica
opis: Štirikotnik ABCD. Oglišče A je spodaj levo, B spodaj desno, C zgoraj desno, D zgoraj levo. Kot pri A meri 90 stopinj, pri B 75 stopinj, pri C 110 stopinj. Kot pri D ni podan.
območje: -1,5; -1 .. 7,5; 5
lik: 0; 0 -> 6; 0 -> 5,05; 3,56 -> 0; 4 | modra zaprto
pravikot: 0; 0 | 6; 0 | 0; 4
točka: 0; 0 | A | levo
točka: 6; 0 | B | desno
točka: 5,05; 3,56 | C | desno
točka: 0; 4 | D | levo
napis: 5,3; 0,4 | 75° | levo
napis: 4,7; 3,3 | 110° | levo
napis: 0,4; 3,6 | δ | desno
:::
= 85
~ 275 | To je vsota treh danih kotov, ne manjkajoči kot.
~ 75 | Izenačil si nasprotna kota $\delta$ in $\beta$ kot v paralelogramu, $ABCD$ pa ni paralelogram.
~ 70 | Uporabil si $\gamma + \delta = 180^\circ$ kot pri trapezu, $ABCD$ pa nima vzporednih stranic.
> $\delta = 360^\circ - 90^\circ - 75^\circ - 110^\circ = 85^\circ$.

? Oglišča paralelograma premakneš tako, da ostane paralelogram, vse štiri stranice pa postanejo enako dolge. Kaj se zato zgodi z diagonalama?
- Postaneta enako dolgi.
~ Enako dolgi sta diagonali pravokotnika. Romb, ki ni kvadrat, ima različno dolgi diagonali.
+ Postaneta pravokotni.
- Ne razpolavljata se več.
~ Romb je še vedno paralelogram, zato se diagonali še vedno razpolavljata.
> Lik z vsemi stranicami enakimi je romb. Diagonali romba sta pravokotni in se razpolavljata.

? Nika računa kote enakokrakega trapeza $ABCD$ z osnovnicama $AB$ in $CD$, v katerem je $\alpha = 50^\circ$. (1) Ker je trapez enakokrak, je $\beta = \alpha = 50^\circ$. (2) Ker sta nasprotna kota enaka, je $\gamma = \alpha = 50^\circ$. (3) Kota ob osnovnici $CD$ sta enaka, zato je $\delta = \gamma = 50^\circ$. V katerem koraku je napaka?
- v 1. koraku
~ V enakokrakem trapezu sta kota ob isti osnovnici enaka, zato $\beta = \alpha$ drži.
+ v 2. koraku
- v 3. koraku
~ Kota ob osnovnici $CD$ sta v enakokrakem trapezu res enaka; napaka je nastala že prej.
> Nasprotna kota sta enaka v paralelogramu, ne v trapezu. Pravilno: $\gamma = 180^\circ - 50^\circ = 130^\circ$ (kota ob kraku $BC$), zato $\delta = 130^\circ$. Vsota $50^\circ + 50^\circ + 130^\circ + 130^\circ = 360^\circ$ to potrdi; Nikini koti dajo le $200^\circ$.

? Razvrsti korake, s katerimi izračunaš kote enakokrakega trapeza z osnovnicama $AB$ in $CD$, v katerem je $\delta = 2\alpha$.
1. Zapiši, da kota ob kraku $AD$ skupaj merita $180^\circ$: $\alpha + \delta = 180^\circ$.
2. Vstavi $\delta = 2\alpha$ in dobiš $3\alpha = 180^\circ$.
3. Izračunaj $\alpha = 60^\circ$.
4. Izračunaj $\delta = 2 \cdot 60^\circ = 120^\circ$.
5. Ker je trapez enakokrak, zapiši še $\beta = \alpha = 60^\circ$ in $\gamma = \delta = 120^\circ$.
> Najprej zveza ob kraku, nato enačba z eno neznanko in njena rešitev, na koncu še simetrija enakokrakega trapeza: $\alpha = \beta = 60^\circ$, $\gamma = \delta = 120^\circ$.

:::simboli
\alpha | notranji kot pri oglišču $A$ | | ° | vsota vseh štirih notranjih kotov je $360^\circ$
\beta | notranji kot pri oglišču $B$ | | °
\gamma | notranji kot pri oglišču $C$ | | °
\delta | notranji kot pri oglišču $D$ | | °
a, b, c, d | stranice štirikotnika | | cm | $a = |AB|$, $b = |BC|$, $c = |CD|$, $d = |DA|$
e, f | diagonali | | cm | $e = |AC|$, $f = |BD|$
:::

<<RACUN
vrednost: 180-65 | 115
vrednost: 65+115+65+115 | 360
vrednost: 360-80-40 | 240
vrednost: 240/2 | 120
resi: x+3*x=180 | x | 45
vrednost: 3*45 | 135
vrednost: 2*35 | 70
vrednost: 180-70 | 110
vrednost: 360-90-75-110 | 85
vrednost: 180-50 | 130
resi: x+2*x=180 | x | 60
vrednost: 2*60 | 120
>>
