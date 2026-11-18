---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

V šolski kuhinji visi graf, ki pove, koliko riža skuhamo za določeno število oseb. Na njem je poudarjena točka $(4, 320)$. Sošolec Tine pravi: »Točka $(4, 320)$ in točka $(320, 4)$ sta ista točka. Obe povesta isto: $4$ osebe in $320$ gramov riža.«

Ima Tine prav? Števili sta res isti. Do konca lekcije boš znal pokazati, zakaj se vseeno moti.

Grafe srečaš na embalaži, v receptih in na zaslonu pečice. Iz ene slike izveš, kako se ena količina spreminja z drugo. Kdor graf zna narisati, svoje meritve pokaže tako, da jih drugi razumejo v nekaj sekundah.

## Razlaga

**1. Tri točke iz istih števil.** Na papir narišemo dve številski premici, ki se sekata pod pravim kotom. Vodoravna je **abscisna os** ali os $x$. Navpična je **ordinatna os** ali os $y$. Sekata se v **izhodišču** $O(0, 0)$. Skupaj tvorita **pravokotni koordinatni sistem**.

Lego točke opišemo s parom števil. Primerjaj tri točke:

| točka | premik vodoravno | premik navpično |
|---|---|---|
| $A(3, 2)$ | 3 desno | 2 gor |
| $B(2, 3)$ | 2 desno | 3 gor |
| $C(-3, 2)$ | 3 levo | 2 gor |

Vse tri so zgrajene iz števil $2$ in $3$, pa vendar ležijo na treh različnih mestih. Vzorec je jasen: prvo število vedno pove premik vodoravno, drugo premik navpično. Pozitivno število pomeni desno ali gor, negativno levo ali dol.

Prvemu številu rečemo **abscisa**, drugemu **ordinata**. Ker je vrstni red pomemben, je $(x, y)$ **urejeni par**.

:::premisli
Kje leži točka z ordinato $0$, na primer $(5, 0)$? Kje pa točka z absciso $0$, na primer $(0, -4)$? Napovej, preden pogledaš.
---
Točka $(5, 0)$ se premakne $5$ desno, gor ali dol pa nič, zato leži na osi $x$. Točka $(0, -4)$ se ne premakne levo ali desno, zato leži na osi $y$, $4$ enote pod izhodiščem.
:::

Osi razdelita ravnino na štiri **kvadrante**. Štejemo jih v nasprotni smeri urnega kazalca, začnemo desno zgoraj:

- I. kvadrant: $x > 0$ in $y > 0$ (desno zgoraj),
- II. kvadrant: $x < 0$ in $y > 0$ (levo zgoraj),
- III. kvadrant: $x < 0$ in $y < 0$ (levo spodaj),
- IV. kvadrant: $x > 0$ in $y < 0$ (desno spodaj).

Točka na osi ne leži v nobenem kvadrantu.

V simulaciji spodaj, »Koordinatni sistem in odvisnost količin«, izberi način *Točka*. Postavi točko na $(3, -2)$, nato na $(-2, 3)$. Opazuj, kako se spremeni kvadrant, čeprav sta števili isti.

**2. Iz tabele na graf.** Za eno osebo skuhamo $80\,\mathrm{g}$ riža.

| število oseb | riž [g] |
|---|---|
| 1 | 80 |
| 2 | 160 |
| 3 | 240 |
| 4 | 320 |

Vsako vrstico zapišemo kot točko: $(1, 80)$, $(2, 160)$, $(3, 240)$, $(4, 320)$.

Število oseb izberemo sami. Količino riža pa izračunamo iz števila oseb, zato je od njega odvisna. Zato je število oseb **neodvisna količina** in jo rišemo na os $x$. Riž je **odvisna količina** in sodi na os $y$.

Zdaj lahko odgovorimo Tinetu. Točka $(320, 4)$ bi pomenila »$320$ oseb in $4$ grami riža«: druga točka in zelo lačna druščina.

Preden narišemo, izberemo **merilo**: koliko pomeni en razdelek na vsaki osi. Na osi $x$ naj bo razdelek $1$ oseba, na osi $y$ pa $40\,\mathrm{g}$. Na isti osi morajo biti vsi razdelki enako veliki. Vsako os označimo z imenom količine in enoto.

Ko točke vrišemo, opazimo še en vzorec: vse ležijo na premici skozi izhodišče. Ko število oseb podvojimo, se podvoji tudi riž. Takšni količini sta **premo sorazmerni**. Graf premega sorazmerja je vedno premica skozi izhodišče.

:::premisli
Ali smemo točke pri rižu povezati s črto? Kaj pa točke, ki kažejo temperaturo vode na štedilniku vsako minuto?
---
Pri rižu ne. Število oseb je celo število, točka med $(2, 160)$ in $(3, 240)$ bi pomenila na primer $2{,}5$ osebe. Pri vodi pa da: čas teče ves čas in voda ima temperaturo tudi med dvema meritvama, zato točke povežemo s črto.
:::

**3. Ne vedno premica.** Iz zamrzovalnika vzamemo vrečko zelenjave in merimo njeno temperaturo:

| čas [min] | temperatura [°C] |
|---|---|
| 0 | $-18$ |
| 10 | $-10$ |
| 20 | $-4$ |
| 30 | $0$ |

Prva točka leži na osi $y$ pod izhodiščem, naslednji dve v IV. kvadrantu, zadnja na osi $x$. V prvih desetih minutah se zelenjava segreje za $8\,^\circ\mathrm{C}$, v naslednjih za $6\,^\circ\mathrm{C}$, nato le za $4\,^\circ\mathrm{C}$. Točke zato ne ležijo na premici. Graf je ukrivljena črta, ki se vzpenja vedno počasneje.

Ko gre graf od leve proti desni navzgor, odvisna količina **narašča**. Ko se spušča, količina **pada**. Vodoraven graf pomeni, da se količina ne spreminja. Bolj strm graf pomeni, da se količina v enakem času spremeni bolj.

**4. Branje grafa.** Od dane vrednosti na eni osi gremo pravokotno na to os do grafa. Od tam gremo pravokotno do druge osi in preberemo vrednost. Upoštevamo merilo: vrednost = število razdelkov $\cdot$ vrednost razdelka.

## Rešeni primeri

### Primer 1: točke v ravnini (lažji)

V koordinatni sistem nariši točke $A(4, 1)$, $B(-2, 3)$, $C(-1, -4)$ in $D(0, -3)$. Za vsako povej, v katerem kvadrantu ali na kateri osi leži.

**Podatki:** $A(4, 1)$, $B(-2, 3)$, $C(-1, -4)$, $D(0, -3)$
**Iščemo:** lego vsake točke (kvadrant ali os)

:::formula
$T(x, y)$: najprej $x$ (vodoravno), nato $y$ (navpično). Predznaka $(+,+)$: I., $(-,+)$: II., $(-,-)$: III., $(+,-)$: IV. kvadrant. Če je koordinata $0$, točka leži na osi.
:::

**Rešitev:**

1. $A(4, 1)$: $4$ desno, $1$ gor. Obe koordinati sta pozitivni, zato je $A$ v I. kvadrantu.
2. $B(-2, 3)$: $2$ levo, $3$ gor. Predznaka $(-,+)$ pomenita II. kvadrant.
3. $C(-1, -4)$: $1$ levo, $4$ dol. Obe sta negativni, zato je $C$ v III. kvadrantu.
4. $D(0, -3)$: vodoravnega premika ni, ker je $x = 0$. Točka leži na osi $y$, $3$ enote pod izhodiščem.
5. Odgovor: $A$ je v I., $B$ v II., $C$ v III. kvadrantu, $D$ pa na osi $y$.

### Primer 2: mleko za palačinke

Za testo za palačinke na vsako jajce dodamo $150\,\mathrm{ml}$ mleka. Sestavi tabelo za $1$ do $4$ jajca in nariši graf. Na osi $y$ imaš v zvezku prostora za $15$ kvadratkov. Iz grafa preberi, koliko mleka potrebuješ za $5$ jajc.

**Podatki:** $150\,\mathrm{ml}$ mleka na jajce, $1$ do $4$ jajca, $15$ kvadratkov na osi $y$, vprašanje za $5$ jajc
**Iščemo:** tabelo, merilo, graf in količino mleka za $5$ jajc

:::formula
mleko $=$ $150\,\mathrm{ml} \cdot$ število jajc

merilo: vrednost enega kvadratka $=$ največja vrednost $:$ število kvadratkov
:::

**Rešitev:**

1. Tabela: $1 \to 150$, $2 \to 300$, $3 \to 450$, $4 \to 600$ (ml), ker vsako jajce prinese $150\,\mathrm{ml}$. Za $4$ jajca: $150 \cdot 4 = 600$.
2. Mleko je odvisno od števila jajc, zato jajca rišemo na os $x$, mleko na os $y$.
3. Graf naj sega do $5$ jajc, torej do $150 \cdot 5 = 750$ ml. Merilo: $750 : 15 = 50$, en kvadratek na osi $y$ naj bo $50\,\mathrm{ml}$.
4. Točka $(1, 150)$ je $1$ razdelek desno in $150 : 50 = 3$ kvadratke visoko. Točka $(4, 600)$ je $600 : 50 = 12$ kvadratkov visoko.
5. Točk ne povežemo, ker jajc ne delimo, ležijo pa na premici skozi izhodišče. Vsako jajce doda $3$ kvadratke višine, zato je točka za $5$ jajc $12 + 3 = 15$ kvadratkov visoko, $15 \cdot 50 = 750$ ml.
6. Odgovor: za $5$ jajc potrebujemo $750\,\mathrm{ml}$ mleka.

### Primer 3: voda na štedilniku (težji)

V lonec natočimo vodo s temperaturo $20\,^\circ\mathrm{C}$ in prižgemo štedilnik. Graf temperature je do $10$. minute premica od točke $(0, 20)$ do točke $(10, 100)$, nato je vodoraven. Ob kateri minuti ima voda $60\,^\circ\mathrm{C}$? Kolikšna je temperatura ob $12$. minuti?

**Podatki:** začetek $(0, 20)$, točka $(10, 100)$, med njima premica, po $10$. minuti vodoraven graf
**Iščemo:** čas $t$, ko je temperatura $60\,^\circ\mathrm{C}$, in temperaturo ob $12$. minuti

:::formula
Pri premici se temperatura vsako minuto spremeni za enako:

sprememba na minuto $=$ sprememba temperature $:$ sprememba časa
:::

**Rešitev:**

1. Od $0$. do $10$. minute se voda segreje za $100 - 20 = 80$ stopinj.
2. Ker je graf premica, je segrevanje enakomerno: $80 : 10 = 8$ stopinj na minuto.
3. Do $60\,^\circ\mathrm{C}$ se mora segreti za $60 - 20 = 40$ stopinj. To traja $40 : 8 = 5$ minut.
4. Na grafu to preverimo obratno kot običajno: od $60$ na osi $y$ gremo vodoravno do premice, nato navpično dol na os $x$ in pridemo na $5$.
5. Po $10$. minuti je graf vodoraven, temperatura se ne spreminja več. Voda vre, zato ima ob $12$. minuti še vedno $100\,^\circ\mathrm{C}$.
6. Odgovor: voda ima $60\,^\circ\mathrm{C}$ po $5$ minutah, ob $12$. minuti pa $100\,^\circ\mathrm{C}$.

### Primer 4: zdaj ti – lonec juhe

V loncu je $3\,\mathrm{l}$ juhe. Z zajemalko nalivamo krožnike, v vsakega gre $0{,}25\,\mathrm{l}$. Nariši graf: na os $x$ število krožnikov, na os $y$ juho, ki ostane v loncu. Kje graf doseže os $x$?

**Podatki:** začetno $3\,\mathrm{l}$ juhe, $0{,}25\,\mathrm{l}$ na krožnik
**Iščemo:** število krožnikov, ko je lonec prazen (presečišče grafa z osjo $x$)

:::formula
ostanek $=$ $3\,\mathrm{l} - 0{,}25\,\mathrm{l} \cdot$ število krožnikov
:::

**Rešitev:**

1. Tabela: $0$ krožnikov $\to 3\,\mathrm{l}$; $4$ krožniki $\to 3 - 4 \cdot 0{,}25 = 2$ (l); $8$ krožnikov $\to 3 - 8 \cdot 0{,}25 = 1$ (l).
2. Točke $(0, 3)$, $(4, 2)$ in $(8, 1)$ ležijo na **padajoči** premici: na vsake $4$ krožnike gre $1\,\mathrm{l}$ manj.
3. Nadaljuj vzorec sam in poišči točko na osi $x$.

:::premisli
Pri koliko krožnikih graf doseže os $x$? Zapiši to točko.
---
Pri $12$ krožnikih: vsake $4$ krožnike $1\,\mathrm{l}$ manj, od $(8, 1)$ še $4$ krožnike do $(12, 0)$. Račun: $3 : 0{,}25 = 12$. Točka je $(12, 0)$, lonec je prazen po $12$ krožnikih.
:::

## Pogoste napake

- **Zamenjan vrstni red koordinat.** Učenec pomisli: »Števili sta isti, torej je vseeno.« Tako je razmišljal Tine. Točki $(2, 5)$ in $(5, 2)$ pa ležita na različnih mestih. Popravek: prvo število je vedno $x$ (vodoravno), drugo $y$ (navpično). Na os $x$ sodi neodvisna količina.
- **Neenakomerni razdelki.** Na os napišeš $0$, $100$, $200$, $400$ na enakih razmikih, ker so to števila iz tabele. Graf se zvije, čeprav bi moral biti premica. Popravek: vsak razdelek na isti osi pomeni enako vrednost.
- **Štetje kvadratkov namesto vrednosti.** Točka je $7$ kvadratkov visoko in učenec odčita »$7$ gramov«. Pri merilu $50\,\mathrm{g}$ na kvadratek je to $7 \cdot 50 = 350$ gramov. Popravek: vedno pomnoži z vrednostjo enega razdelka.
- **Napačno povezovanje točk.** Učenec poveže točke za število oseb in bere vrednost za $2{,}5$ osebe. Ali pa ne poveže točk temperature, ki jo voda ima vsak trenutek. Popravek: vprašaj se, ali ima vmesna vrednost na osi $x$ pomen.

## Povzetek

- Pravokotni koordinatni sistem: os $x$ (abscisna, vodoravna), os $y$ (ordinatna, navpična), izhodišče $O(0, 0)$.
- Točka $T(x, y)$ je urejeni par: najprej abscisa, nato ordinata. $(2, 5) \ne (5, 2)$.
- Kvadranti po predznakih: I. $(+,+)$, II. $(-,+)$, III. $(-,-)$, IV. $(+,-)$. Točka z eno koordinato $0$ leži na osi.
- Neodvisna količina gre na os $x$, odvisna na os $y$. Merilo: enako veliki razdelki, osi označene z imenom in enoto.
- Točke povežemo le, kadar imajo vmesne vrednosti pomen (čas, temperatura), ne pa pri štetju (osebe, jajca).
- Graf naraščajoče količine gre navzgor, padajoče navzdol, stalne vodoravno. Premo sorazmerni količini dasta premico skozi izhodišče.

## Drugače: Korak za korakom s številkami

Recept: za $10$ piškotov potrebujemo $120\,\mathrm{g}$ moke. Graf za $10$, $20$ in $30$ piškotov narišemo v šestih korakih.

1. **Tabela.** $10 \to 120$, $20 \to 240$, $30 \to 360$ (gramov moke).
2. **Osi.** Moka je odvisna od števila piškotov: piškoti na os $x$, moka na os $y$.
3. **Merilo na osi $x$.** En kvadratek $= 10$ piškotov. Do $30$ piškotov potrebujemo $3$ kvadratke.
4. **Merilo na osi $y$.** Največja vrednost je $360$. Če je en kvadratek $40\,\mathrm{g}$, potrebujemo $360 : 40 = 9$ kvadratkov. To se lepo izide.
5. **Vrisovanje.** Točka $(20, 240)$: $2$ kvadratka desno, $240 : 40 = 6$ kvadratkov gor. Enako za ostali dve.
6. **Preverjanje.** Točke ležijo na premici skozi izhodišče, ker gre za dvakrat več piškotov dvakrat več moke. Osi označi: »število piškotov«, »moka [g]«.

## Drugače: Kot zgodba

Nedeljsko kosilo. Mama prižge pečico, v kateri je $20\,^\circ\mathrm{C}$. Graf temperature pripoveduje zgodbo v treh poglavjih.

**Prvo poglavje: segrevanje.** Od $0$. do $15$. minute se graf vzpenja do $180\,^\circ\mathrm{C}$. Pečica se ogreva, temperatura narašča.

**Drugo poglavje: peka.** Od $15$. do $60$. minute je graf vodoraven pri $180\,^\circ\mathrm{C}$. Piščanec se peče.

**Tretje poglavje: konec.** Ob $60$. minuti mama pečico ugasne in odpre vrata. Graf se začne spuščati, najprej strmo, nato vedno bolj položno, ker se topla pečica hitreje ohlaja kot skoraj hladna.

Na osi $x$ teče čas zgodbe, na osi $y$ živi junakinja, temperatura. Vzpon pomeni naraščanje, vodoravni del mirovanje, spust padanje.

## Preveri se

? Katera trditev o točki $T(-3, 2)$ je pravilna?
- Leži v III. kvadrantu, ker ima negativno koordinato.
~ Za III. kvadrant morata biti negativni obe koordinati. Tu je ordinata $2$ pozitivna.
+ Leži v II. kvadrantu, $3$ enote levo od osi $y$ in $2$ enoti nad osjo $x$.
- Je ista točka kot $(2, -3)$.
~ Vrstni red v urejenem paru je pomemben. Točka $(2, -3)$ leži desno spodaj, v IV. kvadrantu.
- Leži $3$ enote nad osjo $x$.
~ Prvo število pove premik vodoravno, ne navpično. Nad osjo $x$ je $2$ enoti.
> Abscisa $-3$ pomeni $3$ enote levo, ordinata $2$ pomeni $2$ enoti gor. Predznaka $(-,+)$ pomenita II. kvadrant.

? Na grafu porabe sladkorja je na osi $y$ en kvadratek $50\,\mathrm{g}$. Točka leži $7$ kvadratkov nad osjo $x$. Koliko sladkorja pomeni?
- $7\,\mathrm{g}$
~ Prešteti kvadratki še niso vrednost. Vsak kvadratek pomeni $50\,\mathrm{g}$.
- $57\,\mathrm{g}$
~ Število kvadratkov in vrednost kvadratka sta sešteta. Pomnožiti ju je treba.
+ $350\,\mathrm{g}$
- $50\,\mathrm{g}$
~ To je vrednost enega samega kvadratka, točka pa jih je oddaljena $7$.
> Vrednost $=$ število kvadratkov $\cdot$ vrednost kvadratka $= 7 \cdot 50\,\mathrm{g} = 350\,\mathrm{g}$.

? Maja je narisala graf moke za piškote. Na os $y$ je na enakih razmikih zapisala $0$, $100$, $200$, $400$, $800$. Ugotovila je, da točke ne ležijo na premici. Kje je napaka?
- Moka bi morala biti na osi $x$.
~ Moka je odvisna od števila piškotov, zato pravilno sodi na os $y$.
- Točk ne bi smela povezati.
~ Povezovanje ne spremeni lege točk.
+ Razdelki niso enakomerni: isti razmik enkrat pomeni $100\,\mathrm{g}$, drugič $200\,\mathrm{g}$ ali $400\,\mathrm{g}$.
- Napake ni; moka in piškoti pač niso premo sorazmerni.
~ Pri receptu sta premo sorazmerni: dvakrat več piškotov, dvakrat več moke. Krivulja je posledica napačnega merila.
> Na isti osi mora vsak razdelek pomeniti enako vrednost. Z enakomernim merilom bi točke ležale na premici skozi izhodišče.

? Čaj A se v $10$ minutah ohladi od $90\,^\circ\mathrm{C}$ na $50\,^\circ\mathrm{C}$, čaj B v istem času od $90\,^\circ\mathrm{C}$ na $70\,^\circ\mathrm{C}$. Kaj velja za njuna grafa (os $x$: čas, os $y$: temperatura)?
- Graf B pada strmeje, ker je čaj B na koncu toplejši.
~ Strmina pove, kako hitro se temperatura spreminja, ne kako visoko graf konča.
- Grafa sta enako strma, ker oba začneta pri $90\,^\circ\mathrm{C}$.
~ Enak začetek pomeni le isto začetno točko. Strmina je odvisna od spremembe.
+ Graf A pada strmeje, ker se čaj A v enakem času ohladi za $40\,^\circ\mathrm{C}$, B pa le za $20\,^\circ\mathrm{C}$.
- Graf A narašča, ker se A bolj spremeni.
~ Temperatura obeh čajev se manjša, zato oba grafa padata.
> Večja sprememba v enakem času pomeni strmejši graf. Oba padata, ker se temperatura znižuje.

? Na zaslonu pečice je graf temperature. Od $15$. do $40$. minute je vodoravna črta pri $180\,^\circ\mathrm{C}$. Kaj to pomeni?
- Pečica je bila ugasnjena.
~ Ugasnjena pečica bi se ohlajala in graf bi padal.
- Pečica se ves ta čas enakomerno segreva.
~ Pri segrevanju bi temperatura naraščala in graf bi šel navzgor.
- Temperatura je bila takrat $0\,^\circ\mathrm{C}$.
~ Vodoravna črta leži na višini $180$, ne na osi $x$. Vodoravno pomeni stalno, ne nič.
+ Temperatura je bila ves ta čas stalna, $180\,^\circ\mathrm{C}$.
> Vodoraven graf pomeni, da se odvisna količina ne spreminja. Temperatura je $25$ minut ostala $180\,^\circ\mathrm{C}$.

:::simboli
T | točka v koordinatnem sistemu | | | T(x, y): najprej x, nato y
x | abscisa (prva koordinata) | | | os x je vodoravna
y | ordinata (druga koordinata) | | | os y je navpična
:::
