---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Poševna telesa in vrtenine matura preverja samo na višji ravni.*

V nedeljo spečeš $16$ palačink s premerom $20\,\mathrm{cm}$, vsaka je debela $0{,}5\,\mathrm{cm}$. Kup je visok $8\,\mathrm{cm}$. Mlajši brat ga s komolcem porine, da se nagne, in reče: »Zdaj je pa poševen, torej ga je manj.« Ima prav? Pojedel ni nobene palačinke.

Še eno vprašanje iz kuhinje: lončar skledo oblikuje na vretenu, ki se vrti, zato je okrogla. Tudi sladoledni kornet ima obliko, ki nastane z vrtenjem lika. Kakšno telo nastane, ko zavrtiš nek lik, in koliko sladoleda gre vanj? Obe vprašanji rešimo s formulami, ki jih že poznaš.

## Razlaga

**1. Nagnjen kup.** Palačinke so tanki valji. Pri pokončnem kupu jih je $16$, vsaka z enako ploščino. Pri nagnjenem kupu jih je spet $16$, vsaka ima isto ploščino, le zamaknjene so. Če jih zamakneš v cik-cak, se spet nič ne spremeni.

| Kup ($16$ plasti) | Ploščina plasti | Višina |
|---|---|---|
| pokončen | $100\pi\,\mathrm{cm^2}$ | $8\,\mathrm{cm}$ |
| nagnjen | $100\pi\,\mathrm{cm^2}$ | $8\,\mathrm{cm}$ |
| cik-cak | $100\pi\,\mathrm{cm^2}$ | $8\,\mathrm{cm}$ |

Vse tri vrstice so enake, torej je tudi količina testa enaka. Brat nima prav.

:::premisli
Ali bi bilo testa več, če bi bil kup nagnjen tako močno, da bi bil njegov stranski rob (ob strani kupa od krožnika do vrha) dolg $10\,\mathrm{cm}$ namesto $8\,\mathrm{cm}$? Zakaj?
---
Ne. Daljši rob pomeni le močnejši nagib. Palačink je še vedno $16$, vsaka ima enako ploščino, višina kupa (razdalja od krožnika do vrha) ostane $8\,\mathrm{cm}$.
:::

**2. Cavalierijevo načelo.** Iz palačink naredimo pravilo. Dve telesi ležita med dvema vzporednima ravninama. Če ju **vsaka** vzporedna ravnina med njima seka v likih z **enako ploščino**, imata telesi **enako prostornino**. Temu rečemo Cavalierijevo načelo.

Telo je **poševno**, kadar stranski robovi (pri valju tvorilke, daljice na plašču med obema osnovnima ploskvama) niso pravokotni na osnovno ploskev. Poševno prizmo primerjamo s pokončno prizmo z enako osnovno ploskvijo in enako višino; njuni prerezi so skladni z osnovno ploskvijo. Zato za poševno prizmo in poševni valj velja ista formula kot za pokončna:

$$V = O\,v$$

$O$ je ploščina osnovne ploskve (v lekciji o površini smo jo pisali $S$), $v$ pa **višina**: razdalja med ravninama osnovnih ploskev. Tudi poševno piramido primerjamo s pokončno z enako osnovno ploskvijo in višino: na isti višini sta prereza osnovna ploskev, pomanjšana v istem razmerju, torej imata enako ploščino. Zato za poševno piramido in poševni stožec velja $V = \frac{O\,v}{3}$.

**3. Višina ni stranski rob.** Na sliki imata obe prizmi isto osnovnico in isto višino $v$. Pri poševni je stranski rob $s$ daljši od $v$.

:::risba skica
opis: Levo pravokotnik, osni prerez pokončne prizme; njegova navpična stranica je višina v. Desno paralelogram z enako osnovnico in enako višino, osni prerez poševne prizme. Njegova poševna stranica je stranski rob s, višina v je črtkana navpična daljica s pravim kotom ob osnovnici.
območje: 0; -0,6 .. 9,6; 5
enota: 32
pravokotnik: 0,5; 0,5 .. 3,5; 4,5 | modra
napis: 3,5; 2,5 | v | desno
lik: 4,5; 0,5 -> 7,5; 0,5 -> 9; 4,5 -> 6; 4,5 | oranžna zaprto
črta: 6; 4,5 -> 6; 0,5 | siva črtkano
pravikot: 6; 0,5 | 7; 0,5 | 6; 1,5
napis: 6; 2,5 | v | desno
napis: 8,25; 2,5 | s | desno
napis: 2; -0,2 | pokončna | sredina
napis: 6,75; -0,2 | poševna | sredina
:::

Če stranski rob oklepa z osnovno ploskvijo kot $\alpha$, je to kot med premico in ravnino. Višino dobimo iz pravokotnega trikotnika:

$$v = s\sin\alpha$$

Površina se pri nagibanju spremeni. Stranske ploskve poševne prizme so paralelogrami, zato plašč računamo kot vsoto njihovih ploščin. Površine poševnega valja na tej ravni ne računamo.

**4. Vrtenine.** Lik zavrtimo okoli premice, ki jo imenujemo **os vrtenja**. Telo, ki nastane, je **vrtenina**. Poskusimo z nekaj liki in opazujmo, kaj naredi vsaka stranica:

| Lik in os | Vrtenina |
|---|---|
| pravokotnik okoli stranice | valj |
| pravokotni trikotnik okoli katete | stožec |
| pravokotni trikotnik okoli hipotenuze | dvojni stožec |
| polkrog okoli premera | krogla |

V vseh primerih velja isto. Točke na osi ostanejo na mestu. Vsaka druga točka opiše krožnico s središčem na osi. Stranica, vzporedna z osjo, opiše plašč valja. Stranica, ki se osi dotika v eni točki in je poševna, opiše plašč stožca. Stranica, pravokotna na os, opiše krog.

Od tod pravilo za računanje: dolžina na osi je **višina**, razdalja oglišča od osi je **polmer**. Vrtenino razstavimo na valje in stožce ter seštejemo (ali odštejemo) njihove prostornine. **Osni prerez** (prerez z ravnino skozi os) je lik skupaj s svojo zrcalno sliko čez os.

:::premisli
Pravokotni trikotnik s katetama $3\,\mathrm{cm}$ in $4\,\mathrm{cm}$ zavrtiš enkrat okoli krajše, enkrat okoli daljše katete. Kateri stožec ima večjo prostornino? Napovej, nato preveri.
---
Okoli krajše katete. Os $3$, polmer $4$: $V = \frac{\pi \cdot 16 \cdot 3}{3} = 16\pi$. Os $4$, polmer $3$: $V = \frac{\pi \cdot 9 \cdot 4}{3} = 12\pi$. Polmer je v formuli na kvadrat, višina ne, zato zmaga večji polmer.
:::

## Rešeni primeri

### Primer 1 (lažji): nagnjen kup palačink

Kup $16$ palačink s premerom $20\,\mathrm{cm}$ in debelino $0{,}5\,\mathrm{cm}$ je nagnjen tako, da je njegov stranski rob dolg $10\,\mathrm{cm}$. Koliko testa je v kupu in pod kolikšnim kotom je rob nagnjen proti krožniku?

**Podatki:** $n = 16$, $2r = 20\,\mathrm{cm}$, debelina $0{,}5\,\mathrm{cm}$, $s = 10\,\mathrm{cm}$
**Iščemo:** prostornino $V$ in kot $\alpha$

:::formula
$V = O\,v = \pi r^2 v$, $\sin\alpha = \dfrac{v}{s}$
:::

**Rešitev:**

1. Višina kupa: $v = 16 \cdot 0{,}5 = 8\,\mathrm{cm}$. Nagib je ne spremeni.
2. Polmer: $r = 10\,\mathrm{cm}$, zato $O = 100\pi\,\mathrm{cm^2}$.
3. $V = 100\pi \cdot 8 = 800\pi \approx 2513\,\mathrm{cm^3}$, enako kot pri pokončnem kupu (Cavalierijevo načelo).
4. $\sin\alpha = \dfrac{8}{10} = 0{,}8$, torej $\alpha \approx 53{,}13^\circ$.
5. Odgovor: v kupu je približno $2513\,\mathrm{cm^3}$ testa; rob je proti krožniku nagnjen za približno $53{,}1^\circ$.

### Primer 2: sladoledni kornet

Kornet nastane z vrtenjem pravokotnega trikotnika s katetama $3\,\mathrm{cm}$ in $12\,\mathrm{cm}$ okoli daljše katete. Koliko sladoleda gre v kornet do roba in koliko vaflja je potrebnega za plašč?

**Podatki:** kateti $3\,\mathrm{cm}$ in $12\,\mathrm{cm}$, os je kateta $12\,\mathrm{cm}$
**Iščemo:** prostornino $V$ in ploščino plašča $P_{pl}$

:::formula
$V = \dfrac{\pi r^2 v}{3}$, $s = \sqrt{r^2 + v^2}$, $P_{pl} = \pi r s$
:::

**Rešitev:**

1. Kateta na osi je višina, druga kateta je polmer: $v = 12\,\mathrm{cm}$, $r = 3\,\mathrm{cm}$. Hipotenuza opiše plašč, zato je stranica stožca $s$.
2. $V = \dfrac{\pi \cdot 9 \cdot 12}{3} = 36\pi \approx 113{,}1\,\mathrm{cm^3}$.
3. $s = \sqrt{9 + 144} = \sqrt{153} \approx 12{,}37\,\mathrm{cm}$.
4. $P_{pl} = \pi \cdot 3 \cdot 12{,}37 \approx 116{,}6\,\mathrm{cm^2}$.
5. Odgovor: v kornet gre približno $113\,\mathrm{cm^3}$ sladoleda, plašč iz vaflja meri približno $116{,}6\,\mathrm{cm^2}$.

### Primer 3 (težji): kalup za čokolado

Kalup ima obliko telesa, ki nastane z vrtenjem pravokotnega trikotnika s katetama $6\,\mathrm{cm}$ in $8\,\mathrm{cm}$ okoli hipotenuze. Koliko čokolade gre vanj in kolikšna je površina čokoladnega izdelka?

**Podatki:** $a = 6\,\mathrm{cm}$, $b = 8\,\mathrm{cm}$, os je hipotenuza
**Iščemo:** prostornino $V$ in površino $P$

:::formula
$c = \sqrt{a^2 + b^2}$, $r = \dfrac{a\,b}{c}$, $V = \dfrac{\pi r^2 c}{3}$, $P = \pi r (a + b)$
:::

**Rešitev:**

1. Nastane dvojni stožec: dva stožca s skupno osnovno ploskvijo. Polmer je razdalja oglišča s pravim kotom od osi, torej višina na hipotenuzo.

:::risba skica
opis: Osni prerez dvojnega stožca. Os je vodoravna črtkana premica. Nad njo pravokotni trikotnik s katetama 6 in 8 ter hipotenuzo 10 na osi, pod njo njegova zrcalna slika, črtkana. Od oglišča s pravim kotom do osi je navpična daljica, polmer r = 4,8.
območje: 0; 0 .. 6; 6
enota: 50
črta: 0; 3 -> 6; 3 | siva črtkano
lik: 0,5; 3 -> 5,5; 3 -> 2,3; 5,4 | modra zaprto
lik: 0,5; 3 -> 5,5; 3 -> 2,3; 0,6 | modra črtkano zaprto
črta: 2,3; 5,4 -> 2,3; 3 | oranžna debelo
pravikot: 2,3; 5,4 | 0,5; 3 | 5,5; 3
napis: 1,3; 4,3 | 6 | levo
napis: 4; 4,3 | 8 | desno
napis: 2,3; 4,1 | r | desno
:::

2. Hipotenuza: $c = \sqrt{36 + 64} = 10\,\mathrm{cm}$.
3. Ploščino trikotnika zapišemo na dva načina, $\frac{a\,b}{2} = \frac{c\,r}{2}$, zato $r = \dfrac{6 \cdot 8}{10} = 4{,}8\,\mathrm{cm}$.
4. Prostornini stožcev seštejemo in izpostavimo $\frac{\pi r^2}{3}$; višini obeh stožcev skupaj dasta $c$, zato $V = \dfrac{\pi \cdot 4{,}8^2 \cdot 10}{3} = 76{,}8\pi \approx 241{,}3\,\mathrm{cm^3}$.
5. Površino sestavljata le oba plašča (skupna osnovna ploskev je znotraj). Stranici stožcev sta kateti: $P = \pi \cdot 4{,}8 \cdot 14 = 67{,}2\pi \approx 211{,}1\,\mathrm{cm^2}$.
6. Odgovor: v kalup gre približno $241\,\mathrm{cm^3}$ čokolade, površina izdelka je približno $211\,\mathrm{cm^2}$.

### Primer 4 – zdaj ti

Pravokotni trapez ima osnovnici $6\,\mathrm{cm}$ in $3\,\mathrm{cm}$ ter krak $4\,\mathrm{cm}$, ki je pravokoten na osnovnici. Zavrtimo ga okoli daljše osnovnice. Kolikšna je prostornina nastalega kalupa za kolač?

**Podatki:** osnovnici $6\,\mathrm{cm}$ in $3\,\mathrm{cm}$, pravokotni krak $4\,\mathrm{cm}$, os je daljša osnovnica
**Iščemo:** prostornino $V$

:::formula
$V = V_{valj} + V_{stožec} = \pi r^2 v_1 + \dfrac{\pi r^2 v_2}{3}$
:::

**Rešitev:**

1. Vsa oglišča zunaj osi so od nje oddaljena $4\,\mathrm{cm}$, zato je $r = 4\,\mathrm{cm}$.
2. Krajša osnovnica je vzporedna z osjo in opiše plašč valja z višino $v_1 = 3\,\mathrm{cm}$: $V_{valj} = \pi \cdot 16 \cdot 3 = 48\pi\,\mathrm{cm^3}$.
3. Poševni krak opiše plašč stožca z višino $v_2 = 6 - 3 = 3\,\mathrm{cm}$. Izračunaj prostornino stožca in obe prostornini seštej.

:::premisli
Kolikšna je prostornina kalupa?
---
$V_{stožec} = \frac{\pi \cdot 16 \cdot 3}{3} = 16\pi\,\mathrm{cm^3}$, zato $V = 48\pi + 16\pi = 64\pi \approx 201{,}1\,\mathrm{cm^3}$.
:::

## Pogoste napake

- **Stranski rob namesto višine.** Pri poševnem valju z robom $s = 10\,\mathrm{cm}$ pod kotom $30^\circ$ nekdo računa z $v = 10\,\mathrm{cm}$ in dobi dvakrat preveč. Višina je razdalja med osnovnima ploskvama: $v = s\sin\alpha$.
- **»Enaka prostornina, torej enaka površina.«** Cavalierijevo načelo govori le o prostornini. Stranske ploskve poševne prizme so paralelogrami, ki so lahko večji od pravokotnikov pokončne prizme.
- **Vsak trikotnik da stožec.** Trikotnik, zavrten okoli hipotenuze, da dvojni stožec. Njegov polmer ni kateta, ampak višina na hipotenuzo, $r = \frac{a\,b}{c}$.
- **Zamenjana polmer in višina.** Kar leži na osi, je višina; kar je pravokotno na os, je polmer. Pravokotnik $2 \times 4$, zavrten okoli stranice $4$, ima polmer $2$, ne $4$.
- **Notranje ploskve v površini.** Skupna osnovna ploskev dvojnega stožca in stik valja s stožcem nista na površju, zato ju ne prišteješ.

## Povzetek

- Poševno telo: stranski robovi (tvorilke) niso pravokotni na osnovno ploskev.
- Cavalierijevo načelo: telesi z enako ploščino prerezov na vsaki višini imata enako prostornino.
- Poševna prizma in valj: $V = O\,v$; poševna piramida in stožec: $V = \frac{O\,v}{3}$. Višina je razdalja med ravninama osnovnih ploskev, $v = s\sin\alpha$, ne stranski rob.
- Vrtenina nastane z vrtenjem lika okoli osi. Stranica, vzporedna z osjo, da plašč valja; poševna stranica, ki se osi dotika, plašč stožca; stranica, pravokotna na os, krog.
- Pravokotnik okoli stranice: valj; pravokotni trikotnik okoli katete: stožec, okoli hipotenuze: dvojni stožec z $r = \frac{a\,b}{c}$; pravokotni trapez okoli daljše osnovnice: valj in stožec.
- Prostornino in površino vrtenine sestaviš iz formul za valj in stožec; notranjih ploskev ne štej.

## Drugače: Korak za korakom s številkami

Isti pravokotni trapez kot v Primeru 4 (osnovnici $6\,\mathrm{cm}$ in $3\,\mathrm{cm}$, pravokotni krak $4\,\mathrm{cm}$) zavrtimo okoli **krajše** osnovnice.

1. Os je nosilka krajše osnovnice. Daljša osnovnica je od osi oddaljena $4\,\mathrm{cm}$ in opiše plašč valja s polmerom $4\,\mathrm{cm}$ in višino $6\,\mathrm{cm}$.
2. Pravokotni krak opiše krog, osnovno ploskev valja.
3. Poševni krak gre od konca krajše osnovnice (na osi) do konca daljše. Opiše plašč stožca, ki je izrezan iz valja: polmer $4\,\mathrm{cm}$, višina $6 - 3 = 3\,\mathrm{cm}$.
4. $V = \pi \cdot 16 \cdot 6 - \dfrac{\pi \cdot 16 \cdot 3}{3} = 96\pi - 16\pi = 80\pi \approx 251{,}3\,\mathrm{cm^3}$.

Isti lik, druga os, drugo telo: okoli daljše osnovnice $64\pi\,\mathrm{cm^3}$, okoli krajše $80\pi\,\mathrm{cm^3}$.

## Drugače: Kot zgodba

Bonaventura Cavalieri, Galilejev učenec iz 17. stoletja, si je telesa predstavljal kot kupe neskončno tankih listov. Recimo, da bi stopil v našo kuhinjo.

Na mizi sta dva kupa palačink, oba s $16$ enakimi palačinkami. Eden stoji pokonci, drugega je porinil brat. »Kateri je večji?« vpraša brat. Cavalieri vzame nož in reže oba kupa vodoravno na isti višini. Vsak rez je krog z enako ploščino. »Če sta vsaka dva istoležna lista enaka, sta enaka tudi kupa,« reče.

Potem vzame še kos testa v obliki pravokotnega trikotnika, ga natakne na palčko ob krajši kateti in ga zavrti. Iz trikotnika zraste stožec. Ko testo natakne ob hipotenuzo, zraste vrtavka, dvojni stožec. »Isti kos testa,« pravi, »a palčka odloči, kaj boš spekel.«

## Preveri se

? Pravokotni trapez na sliki zavrtimo okoli črtkane premice, na kateri leži krajša osnovnica. Katero telo nastane?
:::risba skica
opis: Pravokotni trapez z daljšo osnovnico 6 cm spodaj, krajšo osnovnico 3 cm zgoraj in pravokotnim krakom 4 cm levo. Desni krak je poševen. Črtkana os poteka vodoravno skozi krajšo osnovnico zgoraj.
območje: 0; 0 .. 7,5; 5,5
enota: 40
lik: 0,5; 0,5 -> 6,5; 0,5 -> 3,5; 4,5 -> 0,5; 4,5 | modra zaprto
črta: 0; 4,5 -> 7,5; 4,5 | siva črtkano
pravikot: 0,5; 0,5 | 6,5; 0,5 | 0,5; 4,5
napis: 3,5; 0,5 | 6 cm | pod
napis: 2; 4,5 | 3 cm | nad
napis: 0,5; 2,5 | 4 cm | levo
:::
- Valj, na katerega je prilepljen stožec.
~ Tako telo nastane pri vrtenju okoli daljše osnovnice. Tu je os ob krajši, zato stožec manjka.
- Stožec.
~ Stožec da pravokotni trikotnik okoli katete. Trapez ima stranico, vzporedno z osjo, ki opiše plašč valja.
+ Valj, iz katerega je izrezan stožec.
> Daljša osnovnica je vzporedna z osjo in opiše plašč valja ($r = 4\,\mathrm{cm}$, $v = 6\,\mathrm{cm}$). Poševni krak se osi dotika v krajišču krajše osnovnice in opiše plašč stožca, ki je iz valja izrezan.

? Zakaj imata pokončna in poševna prizma z enako osnovno ploskvijo in enako višino enako prostornino?
- Ker imata enako dolge stranske robove.
~ Stranska roba nista enaka: pri enaki višini je rob poševne prizme daljši, $s = \frac{v}{\sin\alpha}$.
+ Ker ju vsaka ravnina, vzporedna z osnovno ploskvijo, seka v likih z enako ploščino.
- Ker imata enako površino.
~ Površini se razlikujeta: stranske ploskve poševne prizme so paralelogrami. Enaka površina tudi sicer ne pomeni enake prostornine.
> Cavalierijevo načelo: enaki prerezi na vsaki višini pomenijo enako prostornino, $V = O\,v$.

? (brez računala) Kup okroglih piškotov s polmerom $5\,\mathrm{cm}$ je nagnjen: rob kupa je dolg $10\,\mathrm{cm}$ in oklepa s krožnikom kot $30^\circ$. Oceni prostornino kupa (vzemi $\pi \approx 3$).
= 390 cm³ | 20
~ 750 | Za višino si vzel rob $10\,\mathrm{cm}$. Višina je $v = 10 \sin 30^\circ = 5\,\mathrm{cm}$.
~ 785 | Za višino si vzel rob $10\,\mathrm{cm}$. Višina je $v = 10 \sin 30^\circ = 5\,\mathrm{cm}$.
~ 650 | Uporabil si kosinus. Višina je nasproti kota $30^\circ$, zato $v = s\sin\alpha$.
~ 680 | Uporabil si kosinus. Višina je nasproti kota $30^\circ$, zato $v = s\sin\alpha$.
> $v = 10 \cdot \frac{1}{2} = 5\,\mathrm{cm}$, $V \approx 3 \cdot 25 \cdot 5 = 375\,\mathrm{cm^3}$ (natančno $125\pi \approx 393\,\mathrm{cm^3}$).

? (brez računala) Pravokotni trikotnik zavrtimo okoli katete dolžine $8\,\mathrm{cm}$. Nastali stožec ima prostornino $96\pi\,\mathrm{cm^3}$. Kolikšna je druga kateta?
= 6 cm
~ 3,46 | Pozabil si na $\frac{1}{3}$ v formuli za prostornino stožca.
~ 36 | To je $r^2$. Na koncu še koreni.
> Druga kateta je polmer: $\frac{\pi r^2 \cdot 8}{3} = 96\pi$, zato $r^2 = 36$ in $r = 6\,\mathrm{cm}$.

? Pravokotni trikotnik s katetama $6\,\mathrm{cm}$ in $8\,\mathrm{cm}$ zavrtimo okoli vsake od treh stranic. Razvrsti vrtenine po prostornini od najmanjše do največje.
1. okoli hipotenuze
2. okoli katete $8\,\mathrm{cm}$
3. okoli katete $6\,\mathrm{cm}$
> Okoli hipotenuze $76{,}8\pi$ (polmer le $4{,}8$), okoli katete $8$: $\frac{\pi \cdot 36 \cdot 8}{3} = 96\pi$, okoli katete $6$: $\frac{\pi \cdot 64 \cdot 6}{3} = 128\pi$. Največ da najkrajša os, ker je polmer na kvadrat.

<<RACUN
vrednost: 16*0.5 | 8
vrednost: pi*10^2*8 | 800*pi
vrednost: asin(8/10)*180/pi | 53.13
vrednost: pi*4^2*3/3 | 16*pi
vrednost: pi*3^2*4/3 | 12*pi
vrednost: pi*3^2*12/3 | 113.1
vrednost: sqrt(3^2+12^2) | 12.37
vrednost: pi*3*sqrt(153) | 116.6
vrednost: sqrt(6^2+8^2) | 10
vrednost: 6*8/10 | 4.8
vrednost: pi*4.8^2*10/3 | 241.3
vrednost: pi*4.8*(6+8) | 211.1
vrednost: pi*4^2*3 + pi*4^2*3/3 | 201.1
vrednost: pi*4^2*6 - pi*4^2*3/3 | 251.3
vrednost: pi*5^2*10*sin(30°) | 392.7
vrednost: sqrt(96*3/8) | 6
>>

:::simboli
V | prostornina | V = O\,v | cm^3
O | ploščina osnovne ploskve | | cm^2 | prej označena s $S$
v | višina telesa | v = s\sin\alpha | cm | razdalja med osnovnima ploskvama
s | stranski rob oz. stranica stožca | s = \sqrt{r^2 + v^2} | cm
\alpha | kot med stranskim robom in osnovno ploskvijo | \sin\alpha = \frac{v}{s} | °
r | polmer | | cm | razdalja oglišča od osi
P_{pl} | ploščina plašča | P_{pl} = \pi r s | cm^2
P | površina | | cm^2
a, b | kateti | | cm
c | hipotenuza | c = \sqrt{a^2 + b^2} | cm
v_1 | višina valja (krajša osnovnica) | | cm
v_2 | višina stožca | | cm | razlika osnovnic
V_{valj} | prostornina valja | V_{valj} = \pi r^2 v_1 | cm^3
V_{stožec} | prostornina stožca | V_{stožec} = \frac{\pi r^2 v_2}{3} | cm^3
:::
