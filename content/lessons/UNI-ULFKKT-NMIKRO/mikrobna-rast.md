---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ena sama bakterija *Escherichia coli* se v ugodnih razmerah razdeli vsakih $20$ minut. Če bi se tako delila brez prestanka, bi v dveh dneh nastalo približno $2{,}2 \cdot 10^{43}$ celic. Ker ena celica tehta okoli $10^{-15}\,\mathrm{kg}$, bi imele skupaj maso $2{,}2 \cdot 10^{28}\,\mathrm{kg}$. To je skoraj $4000$-krat več od mase Zemlje.

Pa vendar sendvič, ki ga na dvodnevnem izletu pozabiš v nahrbtniku, ne postane planet. Račun je pravilen. Napačna je predpostavka, da rast nikoli ne preneha.

Ko veš, kako hitro in kako dolgo mikrobi rastejo, znaš oceniti, koliko časa je hrana na poti v vročem avtu še varna, kdaj vzeti vzorec iz bioreaktorja in koliko časa bo kultura potrebovala do želene gostote. Pri tem potrebuješ tri orodja: rastno krivuljo, generacijski čas in pravo gojišče.

## Razlaga

**Mamljiva napačna ideja: rast kot števec kilometrov.** Avto pri stalni hitrosti vsako uro doda enako število kilometrov. Mnogi si tako predstavljajo tudi bakterije. Začnemo s $1000$ celicami in po $20$ minutah jih je $2000$. »Vsakih $20$ minut se jih doda $1000$,« bi rekli, in po eni uri pričakovali $4000$ celic.

To je narobe. Bakterije se razmnožujejo z **binarno cepitvijo**: celica podvoji svojo DNK, zraste in se razdeli na dve enaki hčerinski celici. Po $20$ minutah se torej ne deli prvotnih $1000$ celic, ampak vseh $2000$. Število se v enakih časovnih korakih ne povečuje za enako vrednost, ampak za enak **faktor**:

| Čas [min] | Prištevanje (napačno) | Podvajanje (pravilno) |
|---|---|---|
| $0$ | $1000$ | $1000$ |
| $20$ | $2000$ | $2000$ |
| $40$ | $3000$ | $4000$ |
| $60$ | $4000$ | $8000$ |
| $120$ | $7000$ | $64\,000$ |

Po dveh urah je razlika že devetkratna. Takemu naraščanju rečemo **eksponentna rast**.

:::premisli
Koliko celic napoveš po $3$ urah, če se vzorec iz preglednice še naprej podvaja vsakih $20$ minut?
---
$3$ ure so $9$ podvojitev, zato je celic $1000 \cdot 2^9 = 512\,000$. S prištevanjem bi dobil le $10\,000$.
:::

**Generacijski čas.** Naj populacija raste eksponentno. **Generacijski čas** (čas podvojitve) $g$ je čas, v katerem se število celic podvoji; v eksponentni fazi je stalen. Če rast traja čas $t$, se zvrsti $n = t/g$ **generacij**.

**Trditev.** Naj ima kultura ob času $0$ $N_0$ celic in naj se v času $t$ vsaka celica deli z binarno cepitvijo s stalnim generacijskim časom $g$, nobena pa ne odmre. Potem je

$$N = N_0 \cdot 2^n, \qquad n = \frac{t}{g}.$$

*Izpeljava.* Po vsaki generaciji iz vsake celice nastaneta dve, zato je $N_k = 2N_{k-1}$. Po $n$ generacijah je $N_n = 2 \cdot 2 \cdots 2 \cdot N_0 = 2^n N_0$. Celice v kulturi se ne delijo hkrati, zato število raste zvezno in se v vsakem intervalu dolžine $g$ podvoji; enačba zato velja tudi za necele $n = t/g$.

Pogosto poznamo $N_0$ in $N$, iščemo pa $g$. Takrat enačbo logaritmiramo z desetiškim logaritmom ($\log = \log_{10}$, zato $\log 2 \approx 0{,}301$): $\log N = \log N_0 + n \log 2$, torej

$$n = \frac{\log N - \log N_0}{\log 2}, \qquad g = \frac{t}{n}$$

Ista enačba pove, da je graf $\log N$ proti $t$ v eksponentni fazi premica z naklonom $\log 2 / g$. Pogosto rast opišemo s **specifično hitrostjo rasti** $\mu$: $N = N_0\,e^{\mu t}$. Ker je pri $t = g$ število $2N_0$, velja $e^{\mu g} = 2$ in zato $\mu = \dfrac{\ln 2}{g}$.

Generacijski čas je lastnost vrste in razmer, ne velikosti populacije. *E. coli* pri $37\,^\circ\mathrm{C}$ v bogatem gojišču potrebuje okoli $20$ minut, *Staphylococcus aureus* okoli $30$ minut, *Mycobacterium tuberculosis* več kot $12$ ur.

**Druga napačna ideja: rast brez konca.** Prav to je bila napaka v računu z maso Zemlje. V **zaprti kulturi** (bučka ali epruveta z gojiščem, ki mu ničesar ne dodajamo in ničesar ne odvajamo) rast poteka v štirih fazah. Če narišemo $\log N$ v odvisnosti od časa, dobimo **rastno krivuljo**. Spominja na višinski profil kolesarske etape: ravnica, strm vzpon, planota in spust.

```
log N
 │         ______
 │        /      \
 │       /        \
 │______/          \
 └────────────────────► t
  lag  eksp. stac. odm.
```

Na logaritemski osi pomeni enak korak navzgor enak faktor, na primer desetkratno povečanje. Eksponentna rast v enakih časih pomnoži število z enakim faktorjem, zato je tam ravna črta.

1. **Lag faza (ravnica; angl. *lag*, zaostanek).** Število celic se skoraj ne spreminja. Celice pa ne spijo: tvorijo encime in ribosome, ki jih potrebujejo v novem gojišču, in rastejo. Lag faza je daljša, če so celice stare, poškodovane ali iz hladilnika, ali če je novo gojišče drugačno od prejšnjega. Trajanje lag faze $t_\mathrm{lag}$ odčitamo kot čas, pri katerem premica eksponentne faze, podaljšana nazaj, seka vodoravno črto $\log N_0$.
2. **Eksponentna faza (vzpon).** Celice se delijo s stalnim in najkrajšim generacijskim časom za te razmere. Na logaritemski osi je to ravna črta. Samo tu velja $N = N_0 \cdot 2^n$. Celice so najbolj enotne in najbolj občutljive na antibiotike, ki delujejo na rastoče celice, na primer penicilin.
3. **Stacionarna faza (planota).** Hranila pohajajo, kopičijo se odpadne snovi, na primer kisline. Število živih celic ostane stalno, ker se delitve in odmiranje uravnovesijo ali pa se celice nehajo deliti.
4. **Faza odmiranja (spust).** Živih celic je vse manj, pogosto se njihovo število zmanjšuje eksponentno. Nekaj celic navadno preživi zelo dolgo.

:::premisli
Edina omejitev v gojišču je glukoza. Kaj napoveš za krivuljo, če glukoze dodamo dvakrat več: kaj se zgodi z naklonom v eksponentni fazi in kaj z višino planote?
---
Naklon ostane enak, ker je generacijski čas odvisen od vrste in razmer, ne od zaloge hrane. Planota pa je višja, približno pri dvakratni gostoti celic, ker hrana zadošča za eno generacijo več.
:::

**Gojišča.** **Gojišče** je mešanica vode in hranil, v kateri v laboratoriju gojimo mikroorganizme. Vsebovati mora vir ogljika, dušika in energije, minerale ter primeren pH. Gojišča razvrščamo po treh merilih:

| Merilo | Vrste | Primer |
|---|---|---|
| Konsistenca | tekoče, poltrdno, trdno | hranilni bujon; gojišče s $1{,}5\,\%$ agarja |
| Sestava | kompleksno (nedefinirano), sintetično (definirano) | pepton in kvasni ekstrakt; glukoza in znane soli |
| Namen | selektivno, diferencialno, obogatitveno | MacConkeyjev agar; krvni agar |

**Agar** je polisaharid iz rdečih alg. Stali se pri okoli $85\,^\circ\mathrm{C}$ in strdi pri okoli $40\,^\circ\mathrm{C}$. Večina mikrobov ga ne razgradi, zato je le strdilo, ne hrana. Poltrdno gojišče ima manj agarja (okoli $0{,}5\,\%$); v njem vidimo, ali se bakterije gibljejo.

**Selektivno** gojišče zavre rast nekaterih skupin in dovoli rast drugih. **Diferencialno** gojišče omogoči, da različne mikrobe ločimo po videzu kolonij. MacConkeyjev agar je oboje: žolčne soli in kristal vijolično zavrejo grampozitivne bakterije, laktoza z indikatorjem pa obarva kolonije tistih, ki laktozo fermentirajo. **Obogatitveno** gojišče je tekoče in pospeši rast iskanega mikroba, da prehiti druge; selenitni bujon na primer obogati salmonele v vzorcu blata ali hrane.

Na trdnem gojišču iz ene celice zraste vidna **kolonija**. Zato lahko žive celice štejemo: če iz razredčitve $10^{-5}$ nanesemo $0{,}1\,\mathrm{mL}$ in zraste $87$ kolonij, je v razredčitvi $870$ živih celic na mililiter. Vzorec je bil razredčen $10^{5}$-krat, zato je bilo v njem $870 \cdot 10^{5} = 8{,}7 \cdot 10^{7}$ kolonijskih enot (CFU) na mililiter.

Splošno: če iz razredčitve s faktorjem $D$ (npr. $D = 10^{-5}$) nanesemo prostornino $V$ in zraste $K$ kolonij, je koncentracija v vzorcu $\dfrac{K}{V \cdot D}$ CFU/mL. Rezultat velja le, če vsaka kolonija izvira iz ene celice ali ene skupine celic (zato enota CFU, ne »celice«) in če je kolonij dovolj za statistiko, a ne toliko, da bi se zlivale; običajno štejemo plošče s $30$ do $300$ kolonijami.

## Rešeni primeri

### Primer 1: koliko celic po dveh urah

Kultura *E. coli* je v eksponentni fazi z generacijskim časom $20\,\mathrm{min}$. Na začetku je v njej $500$ celic. Koliko celic je po $2$ urah?

**Podatki:** $N_0 = 500$, $g = 20\,\mathrm{min}$, $t = 2\,\mathrm{h} = 120\,\mathrm{min}$
**Iščemo:** število celic $N$

:::formula
$n = \dfrac{t}{g}$, $N = N_0 \cdot 2^n$
:::

**Rešitev:**

1. Število generacij: $n = \dfrac{120\,\mathrm{min}}{20\,\mathrm{min}} = 6$.
2. Celice se v vsaki generaciji podvojijo: $2^6 = 64$.
3. $N = 500 \cdot 64 = 32\,000$.
4. Odgovor: po dveh urah je v kulturi $32\,000$ celic.

### Primer 2: generacijski čas iz dveh meritev

Ob $8.00$ je bilo v kulturi $2{,}0 \cdot 10^{4}$ celic na mililiter, ob $12.00$ pa $1{,}28 \cdot 10^{6}$ celic na mililiter. Kultura je bila ves čas v eksponentni fazi. Kolikšen je generacijski čas?

**Podatki:** $N_0 = 2{,}0 \cdot 10^{4}\,\mathrm{mL^{-1}}$, $N = 1{,}28 \cdot 10^{6}\,\mathrm{mL^{-1}}$, $t = 4\,\mathrm{h} = 240\,\mathrm{min}$
**Iščemo:** generacijski čas $g$

:::formula
$n = \dfrac{\log N - \log N_0}{\log 2}$, $g = \dfrac{t}{n}$
:::

**Rešitev:**

1. Logaritma: $\log N = 6{,}107$ in $\log N_0 = 4{,}301$.
2. Razlika: $6{,}107 - 4{,}301 = 1{,}806$.
3. Število generacij: $n = \dfrac{1{,}806}{0{,}301} = 6$.
4. Preverba brez logaritmov: $\dfrac{1{,}28 \cdot 10^{6}}{2{,}0 \cdot 10^{4}} = 64 = 2^6$, torej res $6$ podvojitev.
5. $g = \dfrac{240\,\mathrm{min}}{6} = 40\,\mathrm{min}$.
6. Odgovor: generacijski čas je $40\,\mathrm{min}$.

### Primer 3: sendvič na poti na morje

Na poti od doma do morja traja vožnja $4{,}5\,\mathrm{h}$. Sendvič leži v vročem avtu pri okoli $35\,^\circ\mathrm{C}$. Na njem je ob odhodu $200$ celic *S. aureus* na gram. Bakterije prvo uro preživijo v lag fazi, nato rastejo z generacijskim časom $30\,\mathrm{min}$. Koliko celic na gram je na sendviču ob prihodu? Koliko bi jih napačno izračunal, če bi lag fazo spregledal? Pri približno $10^{5}$ celicah na gram lahko *S. aureus* tvori že toliko enterotoksina, da hrana ni več varna. Najpozneje koliko časa po odhodu je treba sendvič pojesti ali ohladiti?

**Podatki:** $N_0 = 200\,\mathrm{g^{-1}}$, $t_\mathrm{skupaj} = 4{,}5\,\mathrm{h}$, $t_\mathrm{lag} = 1\,\mathrm{h}$, $g = 30\,\mathrm{min}$, meja $N_\mathrm{meja} = 10^{5}\,\mathrm{g^{-1}}$
**Iščemo:** število celic $N$ ob prihodu, napačno oceno brez lag faze in čas $t_\mathrm{meja}$, ko število doseže mejo

:::formula
$t_\mathrm{eksp} = t_\mathrm{skupaj} - t_\mathrm{lag}$, $n = \dfrac{t_\mathrm{eksp}}{g}$, $N = N_0 \cdot 2^n$
$t_\mathrm{meja} = t_\mathrm{lag} + g \cdot \dfrac{\log N_\mathrm{meja} - \log N_0}{\log 2}$
:::

**Rešitev:**

1. Čas eksponentne rasti: $4{,}5\,\mathrm{h} - 1\,\mathrm{h} = 3{,}5\,\mathrm{h} = 210\,\mathrm{min}$. V lag fazi se število ne spreminja, zato ta čas odštejemo.
2. Število generacij: $n = \dfrac{210\,\mathrm{min}}{30\,\mathrm{min}} = 7$.
3. $N = 200 \cdot 2^7 = 200 \cdot 128 = 25\,600$.
4. Brez lag faze: $n = \dfrac{270\,\mathrm{min}}{30\,\mathrm{min}} = 9$ in $N = 200 \cdot 2^9 = 102\,400$, kar je štirikrat preveč.
5. Primerjava z mejo: $25\,600 < 10^{5}$, napačna ocena $102\,400$ pa je nad mejo. Lag faza tu spremeni sklep, ne le številke.
6. Obratno vprašanje: koliko generacij do meje? $n = \dfrac{\log 10^{5} - \log 200}{\log 2} = \dfrac{5 - 2{,}301}{0{,}301} \approx 8{,}97$.
7. Čas eksponentne rasti do meje: $8{,}97 \cdot 30\,\mathrm{min} \approx 269\,\mathrm{min}$; prištejemo lag fazo, ker se v njej število ne spreminja: $t_\mathrm{meja} \approx 60 + 269 = 329\,\mathrm{min} \approx 5{,}5\,\mathrm{h}$.
8. Odgovor: ob prihodu je na sendviču približno $25\,600$ celic na gram, kar je še pod mejo. Če lag fazo spregledaš, dobiš $102\,400$ celic na gram. Mejo bi bakterije dosegle približno $5{,}5\,\mathrm{h}$ po odhodu, zato je po prihodu za varno uživanje ostala le še ura.

Na poti domov rast ne začne znova z lag fazo, ker so celice že v eksponentni fazi. Zato je sendvič na povratku še bolj tvegan.

### Primer 4: zdaj ti

Gojišče nacepimo z $10^{3}$ celicami na mililiter. Kultura raste eksponentno z $g = 25\,\mathrm{min}$. Koliko časa traja, da doseže $10^{9}$ celic na mililiter?

**Podatki:** $N_0 = 10^{3}\,\mathrm{mL^{-1}}$, $N = 10^{9}\,\mathrm{mL^{-1}}$, $g = 25\,\mathrm{min}$
**Iščemo:** čas $t$

:::formula
$n = \dfrac{\log N - \log N_0}{\log 2}$, $t = n \cdot g$
:::

**Rešitev:**

1. Logaritma sta okrogla: $\log N - \log N_0 = 9 - 3 = 6$.
2. Sam izračunaj število generacij in iz njega čas, nato preveri:

:::premisli
Koliko je $n$ in koliko $t$?
---
$n = \dfrac{6}{0{,}301} \approx 19{,}9$ generacij, zato je $t \approx 19{,}9 \cdot 25\,\mathrm{min} \approx 498\,\mathrm{min}$, kar je približno $8{,}3\,\mathrm{h}$.
:::

## Pogoste napake

Večina napak izhaja iz tega, da eksponentno rast obravnavamo kot linearno ali kot neskončno.

- **Prištevanje namesto množenja.** »V $20$ minutah se jih je dodalo $1000$, torej vsakih $20$ minut $1000$ več.« Narobe, ker se delijo tudi nove celice. Število se v vsaki generaciji pomnoži z $2$: $N = N_0 \cdot 2^n$.
- **Število generacij je kar razmerje.** »Celic je $64$-krat več, torej je minilo $64$ generacij.« Razmerje je $2^n$, ne $n$. Iz $64 = 2^6$ sledi $6$ generacij; na splošno $n = \dfrac{\log N - \log N_0}{\log 2}$.
- **Lag faza pomeni mrtve ali speče celice.** Celice so takrat zelo dejavne: tvorijo encime in ribosome. Število se ne poveča, ker se še ne delijo.
- **Formula velja za celo krivuljo.** $N = N_0 \cdot 2^{t/g}$ opisuje le eksponentno fazo. Pred njo odštej lag fazo, po njej pa nastopi planota.
- **Agar je hrana za bakterije.** Agar je le strdilo, ki ga večina mikrobov ne razgradi. Hranila so pepton, ekstrakti, sladkorji in soli.

## Povzetek

- Bakterije se delijo z binarno cepitvijo, zato število raste eksponentno: $N = N_0 \cdot 2^n$, $n = t/g$.
- Generacijski čas $g$ je čas podvojitve; izračunamo ga iz $n = \dfrac{\log N - \log N_0}{\log 2}$ in $g = t/n$. Odvisen je od vrste in razmer.
- Rastna krivulja v zaprti kulturi ($\log N$ proti $t$): lag faza (prilagajanje), eksponentna faza (stalni $g$), stacionarna faza (hranila pošla, ravnovesje), faza odmiranja.
- Gojišča: tekoča, poltrdna, trdna (agar kot strdilo); kompleksna ali sintetična; selektivna, diferencialna, obogatitvena.
- Na trdnem gojišču iz ene celice zraste kolonija, zato lahko štejemo žive celice (CFU/mL).

## Za izpit

Znati moraš povedati:

- natančno definicijo generacijskega časa in pogoje, pod katerimi velja $N = N_0 \cdot 2^{t/g}$ (eksponentna faza, vse celice se delijo s stalnim $g$, ni odmiranja), ter izpeljavo te enačbe;
- izpeljavo $n = (\log N - \log N_0)/\log 2$ in $\mu = \ln 2 / g$ ter zakaj je eksponentna faza na grafu $\log N$ proti $t$ premica;
- štiri faze rastne krivulje zaprte kulture z vzrokom za vsako in kako iz grafa odčitaš trajanje lag faze;
- razvrstitev gojišč po konsistenci, sestavi in namenu s primerom za vsako vrsto;
- izračun CFU/mL iz štetja kolonij in pogoje, pod katerimi je štetje veljavno.

### Naloga 1

Bučko z gojiščem ob $6.00$ nacepimo tako, da je v njej $2{,}0 \cdot 10^{5}$ CFU/mL. Ob $9.00$ vzorec razredčimo na $10^{-4}$, nanesemo $0{,}1\,\mathrm{mL}$ na ploščo in naslednji dan preštejemo $52$ kolonij. Ob $12.00$ vzorec razredčimo na $10^{-6}$, nanesemo $0{,}1\,\mathrm{mL}$ in preštejemo $133$ kolonij. Med $9.00$ in $12.00$ je kultura v eksponentni fazi. Izračunaj koncentracijo celic ob obeh časih, generacijski čas, specifično hitrost rasti $\mu$ in trajanje lag faze.

**Rešitev:**

1. Ob $9.00$: $N_1 = \dfrac{52}{0{,}1 \cdot 10^{-4}} = 5{,}2 \cdot 10^{6}$ CFU/mL.
2. Ob $12.00$: $N_2 = \dfrac{133}{0{,}1 \cdot 10^{-6}} = 1{,}33 \cdot 10^{9}$ CFU/mL. Obe plošči imata med $30$ in $300$ kolonij, zato sta štetji veljavni.
3. Število generacij: $\log N_2 - \log N_1 = 9{,}124 - 6{,}716 = 2{,}408$, $n = \dfrac{2{,}408}{0{,}301} = 8{,}0$. Preverba: $N_2/N_1 \approx 256 = 2^{8}$.
4. Generacijski čas: $g = \dfrac{180\,\mathrm{min}}{8} = 22{,}5\,\mathrm{min}$, to je $0{,}375\,\mathrm{h}$.
5. $\mu = \dfrac{\ln 2}{g} = \dfrac{0{,}693}{0{,}375\,\mathrm{h}} \approx 1{,}85\,\mathrm{h^{-1}}$.
6. Lag faza: premica eksponentne faze, podaljšana nazaj, doseže $N_0 = 2{,}0 \cdot 10^{5}$ toliko generacij pred $9.00$, kolikor je $n_0 = \dfrac{\log (5{,}2 \cdot 10^{6}) - \log (2{,}0 \cdot 10^{5})}{\log 2} = \dfrac{1{,}415}{0{,}301} \approx 4{,}70$.
7. To je $4{,}70 \cdot 22{,}5 \approx 106\,\mathrm{min}$ eksponentne rasti. Od nacepitve do $9.00$ je minilo $180\,\mathrm{min}$, zato je $t_\mathrm{lag} \approx 180 - 106 = 74\,\mathrm{min}$.
8. Odgovor: ob $9.00$ je bilo $5{,}2 \cdot 10^{6}$, ob $12.00$ pa $1{,}33 \cdot 10^{9}$ CFU/mL; generacijski čas je $22{,}5\,\mathrm{min}$, $\mu \approx 1{,}85\,\mathrm{h^{-1}}$, lag faza je trajala približno $74\,\mathrm{min}$ (dobra ura).

### Naloga 2

Natančno navedi, pod katerimi pogoji velja $N = N_0 \cdot 2^{t/g}$, in enačbo izpelji. Dokaži, da je v eksponentni fazi graf $\log N$ proti $t$ premica, in izpelji zvezo $\mu = \ln 2 / g$. Utemelji, ali podvojitev začetne koncentracije omejujočega hranila spremeni naklon eksponentne faze in višino stacionarne faze.

**Rešitev:**

1. Pogoji: kultura je v eksponentni fazi; vsaka celica se deli z binarno cepitvijo s stalnim generacijskim časom $g$; celice ne odmirajo; hranila so v presežku.
2. Izpeljava: po vsaki generaciji je celic dvakrat več, $N_k = 2N_{k-1}$, zato po $n$ generacijah $N = 2^n N_0$; ker je $n = t/g$, velja $N = N_0 \cdot 2^{t/g}$.
3. Logaritmiraš: $\log N = \log N_0 + \dfrac{\log 2}{g}\,t$. To je linearna funkcija $t$, torej premica z naklonom $\log 2/g$ in začetno vrednostjo $\log N_0$.
4. Zapis $N = N_0\,e^{\mu t}$ mora ob $t = g$ dati $2N_0$: $e^{\mu g} = 2$, zato $\mu g = \ln 2$ in $\mu = \ln 2/g$.
5. Naklon: po Monodovi enačbi je specifična hitrost rasti odvisna od koncentracije omejujočega hranila $S$ kot $\mu = \mu_\mathrm{max}\,S/(K_S + S)$, kjer je $\mu_\mathrm{max}$ največja specifična hitrost rasti, $K_S$ pa koncentracija, pri kateri je $\mu = \mu_\mathrm{max}/2$. V eksponentni fazi je $S \gg K_S$ že pri prvotni količini, zato je $\mu \approx \mu_\mathrm{max}$ in podvojitev $S$ naklona ne spremeni.
6. Planota: končna gostota je sorazmerna s porabljenim omejujočim hranilom (stalen izkoristek biomase na enoto hranila), zato je pri dvakratni količini približno dvakrat višja, če hranilo ostane omejujoče (ne poide prej kaj drugega); na logaritemski osi se dvigne za $\log 2 \approx 0{,}3$.
7. Odgovor: naklon ostane enak, stacionarna faza pa je približno pri dvakratni gostoti celic.

## Drugače: Kot zgodba

Celica Ela je ves teden ležala v epruveti v hladilniku. Nekega jutra jo laborantka prenese v toplo, sveže gojišče. Ela se ne razdeli takoj. Najprej se mora pripraviti na nov kraj: izdela encime za hranila, ki jih tu najde, in zgradi nove ribosome. To je njena lag faza.

Nato se razdeli. Njeni hčerki se razdelita po enakem času, njune hčerke prav tako. Rod se podvaja kot ura, vsakih $20$ minut. To je eksponentna faza.

Po nekaj urah je v bučki gneča. Hrane zmanjkuje, voda postaja kisla. Nekatere celice se še delijo, druge odmrejo, in število se ustali. To je stacionarna faza.

Na koncu je mrtvih celic več kot novih. Število živih upada, nekaj potomk pa vztraja še dolgo. Če bi kakšno od njih prenesli v sveže gojišče, bi se zgodba začela znova.

## Drugače: Korak za korakom s številkami

Tako izračunaš rast, ko je dan $g$:

1. Pretvori čase v iste enote (vse v minute).
2. Odštej lag fazo, če je dana.
3. Izračunaj $n = t/g$.
4. Izračunaj $2^n$. Pomagaj si s tem, da je $2^{10} = 1024$, kar je približno $10^{3}$.
5. Pomnoži z $N_0$.

Tako izračunaš $g$, ko sta dani dve meritvi:

1. Preveri, da sta obe meritvi v eksponentni fazi.
2. Izračunaj $\log N - \log N_0$.
3. Deli z $\log 2 = 0{,}301$; dobiš $n$.
4. Izračunaj $g = t/n$.

Primer za drugi postopek je primer 2: razmerje je $64 = 2^6$, zato $n = 6$ in $g = 240 : 6 = 40\,\mathrm{min}$.

## Drugače: Uporaba v stroki

- **Bioprocesi.** Inokulum za fermentor vzamemo iz kulture v eksponentni fazi, da je lag faza kratka. Iz $g$ izračunamo, kdaj bo kultura dosegla gostoto za indukcijo ali žetev.
- **Živilska mikrobiologija.** Rok uporabnosti in čas, ki ga hrana sme preživeti izven hladilnika, ocenimo z napovednimi modeli rasti: lag faza in $g$ pri dani temperaturi.
- **Kontrola kakovosti.** Število mikrobov v vodi, živilih in zdravilih določamo s štetjem kolonij (CFU/mL ali CFU/g) na selektivnih gojiščih.

## Drugače: Bolj natančno

Eksponentno rast pogosto zapišemo z naravnim logaritmom: $N = N_0 \, e^{\mu t}$, kjer je $\mu$ **specifična hitrost rasti**. Ker se v času $g$ število podvoji, velja $\mu = \dfrac{\ln 2}{g}$. Za $g = 20\,\mathrm{min}$ je $\mu \approx 2{,}1\,\mathrm{h^{-1}}$.

Hitrost rasti je odvisna od koncentracije omejujočega hranila $S$ (Monodova enačba): $\mu = \mu_\mathrm{max} \dfrac{S}{K_S + S}$. Pri veliki $S$ je $\mu \approx \mu_\mathrm{max}$, zato v eksponentni fazi zaloga hrane ne vpliva na naklon.

V **odprti kulturi** (kemostatu) sveže gojišče stalno dovajamo in enako prostornino odvajamo. Tako kulturo dolgo držimo v eksponentni fazi s hitrostjo rasti, ki jo določa hitrost dotoka.

## Preveri se

? Laborant v gojišče doda žolčne soli in kristal vijolično, da na plošči zrastejo samo gramnegativne bakterije. Kakšno gojišče je to?
+ selektivno
- diferencialno
~ Diferencialno gojišče loči mikrobe po videzu kolonij, rasti pa ne zavre. Tu dodatki zavrejo grampozitivne bakterije.
- obogatitveno
~ Obogatitveno gojišče je tekoče in pospeši rast iskanega mikroba; tu gre za zaviranje drugih na plošči.
- sintetično
~ Sintetično pove le, da je sestava natančno znana. O tem, kdo raste, ne pove ničesar.
> Selektivno gojišče zavre rast nekaterih skupin. Žolčne soli in kristal vijolično zavrejo grampozitivne bakterije.

? Kateri je pravilni vrstni red faz rastne krivulje v zaprti kulturi?
- eksponentna, lag, stacionarna, odmiranje
~ Celice v novem gojišču se najprej prilagajajo. Eksponentna rast pride šele po lag fazi.
+ lag, eksponentna, stacionarna, odmiranje
- lag, eksponentna, odmiranje, stacionarna
~ Ko hranila poidejo, se število najprej ustali. Upadati začne šele pozneje.
> Najprej prilagajanje, nato podvajanje s stalnim $g$, nato planota, ko hranila poidejo, in na koncu upad živih celic.

? Kaj se zgodi, če celice sredi eksponentne faze prenesemo v sveže, enako gojišče pri isti temperaturi?
- Znova nastopi dolga lag faza, enako kot ob prvi nacepitvi.
~ Lag faza je dolga, ko se morajo celice prilagoditi. Tu so encimi za to gojišče že izdelani.
+ Celice rastejo eksponentno naprej, skoraj brez lag faze.
- Kultura takoj preide v stacionarno fazo.
~ Stacionarna faza nastopi, ko hranila poidejo. V svežem gojišču jih je dovolj.
> Celice so že prilagojene na to gojišče, zato se lag faza skoraj ne pojavi in rast se nadaljuje z istim $g$.

? Kultura s $100$ celicami raste eksponentno z $g = 15\,\mathrm{min}$. Koliko celic je po $1$ uri?
- $500$
~ To je prištevanje: $100 + 4 \cdot 100$. Celice se v vsaki generaciji podvojijo, torej množimo.
- $800$
~ To je $100 \cdot 4 \cdot 2$. Število generacij gre v eksponent: $2^4$, ne $4 \cdot 2$.
+ $1600$
> $n = \dfrac{60\,\mathrm{min}}{15\,\mathrm{min}} = 4$, $N = 100 \cdot 2^4 = 1600$.

? Število celic v eksponentni fazi naraste z $10^{4}$ na $8 \cdot 10^{4}$ v $90$ minutah. Kolikšen je generacijski čas?
- $11{,}25\,\mathrm{min}$
~ Tako dobiš, če čas deliš z razmerjem $8$. Razmerje je $2^n$, zato je generacij le $3$.
+ $30\,\mathrm{min}$
- $90\,\mathrm{min}$
~ V $90$ minutah se število ni le podvojilo, ampak povečalo $8$-krat; to so tri podvojitve.
> Razmerje $8 = 2^3$, zato $n = 3$ in $g = \dfrac{90\,\mathrm{min}}{3} = 30\,\mathrm{min}$.

:::simboli
N | število celic po času t | N = N_0 \cdot 2^n | – |
N_0 | začetno število celic | | – |
n | število generacij | n = \dfrac{t}{g} | – | velja le v eksponentni fazi
g | generacijski čas | g = \dfrac{t}{n} | min | čas, v katerem se število celic podvoji
t | čas rasti | t = n \cdot g | min |
t_\mathrm{eksp} | trajanje eksponentne faze | t_\mathrm{eksp} = t_\mathrm{skupaj} - t_\mathrm{lag} | h |
t_\mathrm{skupaj} | celoten čas gojenja | | h |
t_\mathrm{lag} | trajanje faze prilagajanja (lag faze) | | h | v tem času se celice ne delijo
\mu | specifična hitrost rasti | \mu = \dfrac{\ln 2}{g} | h^{-1} |
N_\mathrm{meja} | mejno število celic | | g^{-1} |
t_\mathrm{meja} | čas, ko število doseže mejo | t_\mathrm{meja} = t_\mathrm{lag} + g \cdot \dfrac{\log N_\mathrm{meja} - \log N_0}{\log 2} | min |
:::
