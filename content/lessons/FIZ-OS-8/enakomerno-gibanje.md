---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poletni večer, nad hribi se bliska. Jan šteje sekunde od bliska do groma in reče: »Šest sekund. Vsaka sekunda je en kilometer, torej je nevihta $6\,\mathrm{km}$ daleč.«

Ima prav? Blisk vidimo skoraj v trenutku, ker svetloba potuje izjemno hitro. Zvok groma pa potuje po zraku veliko počasneje in vso pot skoraj enako hitro. Ko boš znal povezati **hitrost**, **pot** in **čas**, boš Janovo trditev preveril sam (v Primeru 2). Isti račun pove, čez koliko minut bo nevihtni oblak nad tvojo vasjo ali kako daleč odplava list po reki.

## Razlaga

**1. List na reki.** Na mirnem delu reke vržemo v vodo list in ob bregu merimo, kako daleč ga je odneslo. Vsakih $5\,\mathrm{s}$ zapišemo, koliko metrov je prepotoval od starta:

| čas $t$ (s) | pot $s$ (m) | $s : t$ (m/s) |
|---|---|---|
| 5 | 4 | 0,8 |
| 10 | 8 | 0,8 |
| 15 | 12 | 0,8 |
| 20 | 16 | 0,8 |

Poglej drugi stolpec. V vsakih $5\,\mathrm{s}$ se pot poveča za enako, za $4\,\mathrm{m}$. Poglej tretji stolpec. Količnik poti in časa je v vsaki vrstici enak.

**2. Enakomerno gibanje.** Tako gibanje ima ime. Telo se giblje **enakomerno**, kadar v enakih časovnih razmikih prepotuje enake poti. **Pot** $s$ je dolžina, ki jo telo prepotuje (v metrih, $\mathrm{m}$, ali kilometrih, $\mathrm{km}$). **Čas** $t$ je trajanje gibanja (v sekundah, $\mathrm{s}$, minutah, $\mathrm{min}$, ali urah, $\mathrm{h}$). Tu obravnavamo gibanje po ravni črti, zato mu rečemo tudi premo enakomerno gibanje.

**3. Hitrost.** Stalni količnik iz tabele imenujemo **hitrost** $v$. Pove, kolikšno pot telo prepotuje v enoti časa:

$$v = \frac{s}{t}$$

Enota je $\mathrm{m/s}$ ali $\mathrm{km/h}$. List ima hitrost $0{,}8\,\mathrm{m/s}$: vsako sekundo ga voda odnese $0{,}8\,\mathrm{m}$ naprej. Pri enakomernem gibanju se hitrost ne spreminja.

:::premisli
Kje bo list po $30\,\mathrm{s}$, če ga voda nese enako kot prej? Napovej, preden računaš.
---
$24\,\mathrm{m}$ od starta. Vsako sekundo prepotuje $0{,}8\,\mathrm{m}$, v $30\,\mathrm{s}$ torej $30$-krat toliko. Tudi iz tabele: v $15\,\mathrm{s}$ je $12\,\mathrm{m}$, v dvakrat daljšem času dvakrat daljša pot.
:::

**4. Pot in čas iz hitrosti.** Iz $v = \dfrac{s}{t}$ dobimo še dve obliki:

$$s = v \cdot t \qquad t = \frac{s}{v}$$

Pot dobimo z množenjem, čas z deljenjem. Izberi obliko, v kateri je neznanka sama na levi.

**5. Iz m/s v km/h.** Velja $1\,\mathrm{m} = 0{,}001\,\mathrm{km}$ in $1\,\mathrm{h} = 3600\,\mathrm{s}$. V eni uri telo prepotuje $3600$-krat toliko kot v eni sekundi. Pri $1\,\mathrm{m/s}$ je to $3600\,\mathrm{m} = 3{,}6\,\mathrm{km}$ na uro:

$$1\,\mathrm{m/s} = 3{,}6\,\mathrm{km/h}$$

Iz $\mathrm{m/s}$ v $\mathrm{km/h}$ **množimo** s $3{,}6$, v obratni smeri **delimo** s $3{,}6$. Pred računom vse količine izrazi v enotah, ki se ujemajo: $\mathrm{km/h}$ s $\mathrm{km}$ in $\mathrm{h}$, $\mathrm{m/s}$ z $\mathrm{m}$ in $\mathrm{s}$.

**6. Graf poti $s(t)$.** Točke iz tabele nanesemo v koordinatni sistem: čas na vodoravno os, pot na navpično. Točke $(5, 4)$, $(10, 8)$, $(15, 12)$ in $(20, 16)$ ležijo na **premici skozi izhodišče**. To velja za vsako enakomerno gibanje, ki se začne ob času $0$ na startu. Hitrejši list (na primer sredi reke, kjer voda teče hitreje) bi v istem času prepotoval več, zato bi bila njegova premica **strmejša**. Strmina pove, za koliko metrov se pot poveča v eni sekundi, in to je ravno hitrost.

:::premisli
Kamen leži na bregu in se ne premakne. Kakšen je njegov graf $s(t)$ in v čem se razlikuje od grafa lista?
---
Vodoravna črta: čas teče, pot pa ostaja enaka. Kamen miruje, njegova hitrost je $0$. Enakomerno gibanje s hitrostjo, večjo od $0$, je v grafu $s(t)$ vedno poševna premica.
:::

**7. Graf hitrosti $v(t)$.** Na navpično os zdaj nanesemo hitrost. Ker je stalna, je graf **vodoravna črta**, za list na višini $0{,}8\,\mathrm{m/s}$. Pod črto do časa $20\,\mathrm{s}$ nastane pravokotnik z višino $0{,}8$ in širino $20$. Njegova ploščina je $0{,}8 \cdot 20 = 16$, natanko pot $16\,\mathrm{m}$ iz tabele. Ploščina pod grafom $v(t)$ je prepotovana pot.

V simulaciji spodaj, »Enakomerno gibanje in grafi«, nastavi najprej majhno, nato dvakrat večjo hitrost. Opazuj, kako se premica v grafu $s(t)$ postavi bolj pokonci, črta v grafu $v(t)$ pa se dvigne, a ostane vodoravna.

**8. V naravi.** Pravo gibanje je redko povsem enakomerno: veter popusti, reka se zoži. Računi s stalno hitrostjo zato dajo dobro oceno, ne natančne vrednosti.

## Rešeni primeri

### Primer 1: lastovka

Lastovka leti naravnost nad travnikom in v $4\,\mathrm{s}$ preleti $60\,\mathrm{m}$. Kolikšna je njena hitrost v $\mathrm{m/s}$ in v $\mathrm{km/h}$?

**Podatki:** $s = 60\,\mathrm{m}$, $t = 4\,\mathrm{s}$
**Iščemo:** hitrost $v$

:::formula
$v = \dfrac{s}{t}$; $1\,\mathrm{m/s} = 3{,}6\,\mathrm{km/h}$
:::

**Rešitev:**

1. Iščemo hitrost, zato pot delimo s časom: $v = \dfrac{60\,\mathrm{m}}{4\,\mathrm{s}} = 15\,\mathrm{m/s}$.
2. V $\mathrm{km/h}$ množimo s $3{,}6$, ker v uri preleti $3600$-krat več kot v sekundi: $15 \cdot 3{,}6 = 54$.
3. Odgovor: lastovka leti s hitrostjo $15\,\mathrm{m/s}$, to je $54\,\mathrm{km/h}$.

### Primer 2: kako daleč je strela

Med bliskom in gromom mine $6\,\mathrm{s}$. Zvok se po zraku širi s hitrostjo približno $340\,\mathrm{m/s}$. Kako daleč je udarila strela? Je imel Jan iz uvoda prav?

**Podatki:** $t = 6\,\mathrm{s}$, $v = 340\,\mathrm{m/s}$; svetloba bliska pride do nas skoraj v trenutku
**Iščemo:** pot zvoka $s$ (razdaljo do strele)

:::formula
$s = v \cdot t$
:::

**Rešitev:**

1. Svetlobo vidimo skoraj takoj, zato je $6\,\mathrm{s}$ čas, ki ga je za pot porabil zvok.
2. Iščemo pot, zato hitrost množimo s časom: $s = 340\,\mathrm{m/s} \cdot 6\,\mathrm{s} = 2040\,\mathrm{m}$.
3. $2040\,\mathrm{m}$ je približno $2\,\mathrm{km}$. En kilometer zvok prepotuje v približno $3\,\mathrm{s}$, saj je $3 \cdot 340\,\mathrm{m} = 1020\,\mathrm{m}$.
4. Odgovor: strela je udarila približno $2\,\mathrm{km}$ daleč. Jan se je zmotil: sekunde je treba deliti s $3$, ne vzeti za kilometre.

### Primer 3: nevihtni oblak nad vasjo

Nevihtni oblak je $15\,\mathrm{km}$ od vasi. Veter ga premika naravnost proti vasi s stalno hitrostjo $36\,\mathrm{km/h}$. Čez koliko minut bo oblak nad vasjo?

**Podatki:** $s = 15\,\mathrm{km}$, $v = 36\,\mathrm{km/h}$
**Iščemo:** čas $t$ v minutah

:::formula
$t = \dfrac{s}{v}$; $1\,\mathrm{h} = 60\,\mathrm{min}$
:::

**Rešitev:**

1. Pot je v $\mathrm{km}$, hitrost v $\mathrm{km/h}$, enote se ujemajo in čas bomo dobili v urah.
2. Iščemo čas, zato pot delimo s hitrostjo: $t = \dfrac{15\,\mathrm{km}}{36\,\mathrm{km/h}} \approx 0{,}417\,\mathrm{h}$.
3. Ure pretvorimo v minute: $t = \dfrac{15}{36} \cdot 60\,\mathrm{min} = 25\,\mathrm{min}$.
4. Preverimo po drugi poti: $36\,\mathrm{km/h} = 10\,\mathrm{m/s}$ in $15\,000\,\mathrm{m} : 10\,\mathrm{m/s} = 1500\,\mathrm{s}$, kar je $25\,\mathrm{min}$.
5. Odgovor: oblak bo nad vasjo čez približno $25\,\mathrm{min}$.

### Primer 4 – zdaj ti: srna na jasi

Graf $s(t)$ za srno, ki enakomerno teče čez jaso, je premica skozi izhodišče in skozi točko $t = 8\,\mathrm{s}$, $s = 40\,\mathrm{m}$. Kolikšna je njena hitrost? Kolikšno pot bi s to hitrostjo pretekla v eni minuti?

**Podatki:** točka na grafu: $t = 8\,\mathrm{s}$, $s = 40\,\mathrm{m}$; drugi čas $t_2 = 1\,\mathrm{min}$
**Iščemo:** hitrost $v$ in pot $s_2$ v času $t_2$

:::formula
$v = \dfrac{s}{t}$, nato $s_2 = v \cdot t_2$
:::

**Rešitev:**

1. Iz točke na grafu: $v = \dfrac{40\,\mathrm{m}}{8\,\mathrm{s}} = 5\,\mathrm{m/s}$.
2. Hitrost je v $\mathrm{m/s}$, zato minuto pretvori v sekunde: $t_2 = 60\,\mathrm{s}$.
3. Izračunaj $s_2$ sam, nato preveri:

:::premisli
Kolikšno pot $s_2$ preteče srna v $60\,\mathrm{s}$?
---
$s_2 = 300\,\mathrm{m}$. Če bi pozabil pretvoriti minuto, bi dobil napačnih $5\,\mathrm{m}$.
:::

## Pogoste napake

- **Mešanje enot.** »Oblak potuje $36\,\mathrm{km/h}$, v $25\,\mathrm{min}$ prepotuje $36 \cdot 25 = 900\,\mathrm{km}$.« Ta rezultat je napačen, ker so v hitrosti ure, v času pa minute. Pred računom čas izrazi v urah: $25\,\mathrm{min} = \dfrac{25}{60}\,\mathrm{h}$, pot je $36 \cdot \dfrac{25}{60} = 15\,\mathrm{km}$.
- **Pretvorba v napačno smer.** »$15\,\mathrm{m/s}$ je $15 : 3{,}6 \approx 4\,\mathrm{km/h}$.« Ne drži: v uri telo prepotuje veliko več kot v sekundi, zato je število v $\mathrm{km/h}$ **večje**. Iz $\mathrm{m/s}$ v $\mathrm{km/h}$ množi s $3{,}6$.
- **Ure kot decimalno število minut.** »$1{,}5\,\mathrm{h}$ je $150\,\mathrm{min}$.« Ura nima $100$ minut, ampak $60$, zato je $1{,}5\,\mathrm{h} = 1{,}5 \cdot 60\,\mathrm{min} = 90\,\mathrm{min}$.
- **Napačna oblika formule.** »Čas je $t = s \cdot v$.« Preveri enote: $\mathrm{km} \cdot \mathrm{km/h}$ ni enota za čas. Pravilno je $t = \dfrac{s}{v}$, kjer se $\mathrm{km}$ pokrajšajo in ostanejo ure.
- **Vodoravna črta v grafu $s(t)$ pomeni stalno hitrost.** Ne: pot se ne spreminja, telo miruje. Stalna hitrost je vodoravna črta v grafu $v(t)$, v grafu $s(t)$ pa poševna premica.

## Povzetek

- Enakomerno gibanje: v enakih časih telo prepotuje enake poti, hitrost je stalna.
- Hitrost $v = \dfrac{s}{t}$, pot $s = v \cdot t$, čas $t = \dfrac{s}{v}$.
- $1\,\mathrm{m/s} = 3{,}6\,\mathrm{km/h}$; enote pred računom uskladi.
- Graf $s(t)$ je premica skozi izhodišče; strmejša premica pomeni večjo hitrost. Vodoravna črta v $s(t)$ pomeni mirovanje.
- Graf $v(t)$ je vodoravna črta; ploščina pod njo je pot.
- Primer: zvok groma prepotuje $1\,\mathrm{km}$ v približno $3\,\mathrm{s}$.

## Drugače: Korak za korakom s številkami

Postopek za vsako nalogo:

1. Izpiši podano in iskano, npr. $s = 180\,\mathrm{m}$, $t = 2\,\mathrm{min}$, iščem $v$.
2. Uskladi enote: $t = 2\,\mathrm{min} = 120\,\mathrm{s}$.
3. Izberi obliko: iščem $v$ → $\dfrac{s}{t}$, iščem $s$ → $v \cdot t$, iščem $t$ → $\dfrac{s}{v}$.
4. Vstavi z enotami: $v = \dfrac{180\,\mathrm{m}}{120\,\mathrm{s}} = 1{,}5\,\mathrm{m/s}$.
5. Presodi smiselnost: $1{,}5\,\mathrm{m/s}$ je hitrost hitre hoje ali počasne reke.

Ali je gibanje enakomerno, preveriš s tabelo. Reka nese čoln s stalno hitrostjo $2\,\mathrm{m/s}$:

| $t$ (s) | $s$ (m) | $s : t$ |
|---|---|---|
| 1 | 2 | 2 |
| 2 | 4 | 2 |
| 3 | 6 | 2 |
| 4 | 8 | 2 |

Vsako sekundo pot zraste za $2\,\mathrm{m}$, količnik $s : t$ je povsod enak. Če bi se količnik od vrstice do vrstice spreminjal, gibanje ne bi bilo enakomerno.

## Drugače: Kot zgodba

Eva se odpravi po ravni gozdni poti do koče. Vsakih $10\,\mathrm{min}$ pogleda v telefon, koliko je že prehodila: $0{,}8\,\mathrm{km}$, $1{,}6\,\mathrm{km}$, $2{,}4\,\mathrm{km}$. Vsakih deset minut enak kos poti, torej hodi enakomerno, s hitrostjo $0{,}8\,\mathrm{km}$ v $10\,\mathrm{min}$, kar je $4{,}8\,\mathrm{km/h}$. Njen graf $s(t)$ je doslej poševna premica.

Po $30\,\mathrm{min}$ sede na štor in $10\,\mathrm{min}$ opazuje veverico. Ura teče, kilometri pa ne: graf $s(t)$ postane vodoraven pri $2{,}4\,\mathrm{km}$, graf $v(t)$ pade na nič.

Nato vstane in hodi enako hitro kot prej. Graf $s(t)$ se spet dviga, enako strmo kot na začetku. V $20\,\mathrm{min}$ naredi še $1{,}6\,\mathrm{km}$ in po eni uri od odhoda je pri koči, $4\,\mathrm{km}$ od starta.

Evina zgodba v grafih: poševno, vodoravno, spet poševno v $s(t)$; v $v(t)$ pa višina $4{,}8$, nič, spet $4{,}8$.

## Drugače: Bolj natančno

Pri enakomernem gibanju sta pot in čas **premo sorazmerna**: podvojeni čas da podvojeno pot. Zato je graf $s(t)$ premica skozi izhodišče in njena enačba $s = v \cdot t$ je oblike $y = k \cdot x$ iz matematike (premo sorazmerje); koeficient $k$ je hitrost.

Če telo ob času $0$ ni na startu, ampak že $s_0$ od njega, je njegova razdalja od starta ob času $t$ enaka $s_0 + v \cdot t$. Graf je premica z enako strmino, le premaknjena navzgor za $s_0$.

Da je ploščina pod grafom $v(t)$ enaka poti, velja tudi takrat, ko hitrost ni stalna. Takrat lik pod grafom ni več pravokotnik; to boš spoznal pri pospešenem gibanju.

## Preveri se

? Katera trditev o enakomernem gibanju drži?
- Hitrost telesa se vsako sekundo enako poveča.
~ To opisuje pospešeno gibanje. Pri enakomernem gibanju se vsako sekundo enako poveča pot, hitrost pa ostane enaka.
- Graf $s(t)$ je vodoravna črta.
~ Vodoravna črta v grafu $s(t)$ pomeni, da se pot ne spreminja: telo miruje.
+ Graf $v(t)$ je vodoravna črta.
- Graf $v(t)$ je poševna premica skozi izhodišče.
~ Poševna premica skozi izhodišče je graf $s(t)$. Hitrost je stalna, zato je graf $v(t)$ vodoraven.
> Pri enakomernem gibanju je hitrost stalna, zato je graf $v(t)$ vodoravna črta. Graf $s(t)$ je poševna premica.

? Reka nese čoln s stalno hitrostjo $1{,}5\,\mathrm{m/s}$. Kolikšno pot prepotuje v $2\,\mathrm{min}$?
- $3\,\mathrm{m}$
~ Tu je čas ostal v minutah, hitrost pa je v metrih na **sekundo**. Najprej pretvori: $2\,\mathrm{min} = 120\,\mathrm{s}$.
- $80\,\mathrm{m}$
~ To je $120 : 1{,}5$. Pot dobiš z množenjem, $s = v \cdot t$, ne z deljenjem.
+ $180\,\mathrm{m}$
- $0{,}0125\,\mathrm{m}$
~ To je $1{,}5 : 120$, deljenje hitrosti s časom nima pomena poti.
> $t = 2\,\mathrm{min} = 120\,\mathrm{s}$, $s = v \cdot t = 1{,}5\,\mathrm{m/s} \cdot 120\,\mathrm{s} = 180\,\mathrm{m}$.

? Maja računa: »Veter nosi oblak s hitrostjo $18\,\mathrm{km/h}$. V $20\,\mathrm{min}$ prepotuje $s = 18 \cdot 20 = 360\,\mathrm{km}$.« Kje je napaka?
- Napačna je formula: pot dobiš z deljenjem.
~ Formula $s = v \cdot t$ je prava. Deljenje bi dalo $0{,}9$, kar tudi ni prava pot.
+ Čas bi morala pretvoriti v ure: $20\,\mathrm{min} = \dfrac{1}{3}\,\mathrm{h}$, zato je $s = 6\,\mathrm{km}$.
- Hitrost bi morala najprej pomnožiti s $3{,}6$.
~ S $3{,}6$ pretvarjamo iz $\mathrm{m/s}$ v $\mathrm{km/h}$. Hitrost je že v $\mathrm{km/h}$, neusklajen je čas.
- Napake ni, oblaki res potujejo tako daleč.
~ $360\,\mathrm{km}$ v $20\,\mathrm{min}$ bi bilo hitreje od letala. Že ocena smiselnosti pokaže napako.
> Hitrost je v $\mathrm{km/h}$, zato mora biti čas v urah: $s = 18\,\mathrm{km/h} \cdot \dfrac{1}{3}\,\mathrm{h} = 6\,\mathrm{km}$.

? Ob prvem neurju je veter pihal s hitrostjo $20\,\mathrm{m/s}$, ob drugem s $70\,\mathrm{km/h}$. Kdaj je pihal močneje?
- Ob drugem, ker je $70$ več kot $20$.
~ Števil v različnih enotah ne moreš neposredno primerjati. Najprej ju izrazi v isti enoti.
+ Ob prvem, ker je $20\,\mathrm{m/s} = 72\,\mathrm{km/h}$.
- Obakrat enako močno.
~ $20 \cdot 3{,}6 = 72$, ne $70$. Razlika je majhna, a obstaja.
- Ob drugem, ker je $20\,\mathrm{m/s}$ le približno $5{,}6\,\mathrm{km/h}$.
~ Tu je bilo deljeno s $3{,}6$ namesto množeno. V uri veter prepiha več kot v sekundi, zato je število v $\mathrm{km/h}$ večje.
> $20\,\mathrm{m/s} \cdot 3{,}6 = 72\,\mathrm{km/h}$, kar je več od $70\,\mathrm{km/h}$.

? Med bliskom in gromom našteješ $9\,\mathrm{s}$. Zvok potuje s hitrostjo približno $340\,\mathrm{m/s}$. Kako daleč je strela?
- $9\,\mathrm{km}$
~ To je pravilo »sekunda je kilometer«, ki ne drži. Zvok v sekundi prepotuje le okoli tretjino kilometra.
+ približno $3\,\mathrm{km}$
- približno $38\,\mathrm{m}$
~ To je $340 : 9$. Pot dobiš z množenjem hitrosti in časa, ne z deljenjem.
- Ne da se izračunati, ker blisk in grom prideta do nas hkrati.
~ Nastaneta hkrati, a svetloba potuje veliko hitreje od zvoka, zato grom zamudi.
> $s = v \cdot t = 340\,\mathrm{m/s} \cdot 9\,\mathrm{s} = 3060\,\mathrm{m}$, približno $3\,\mathrm{km}$.

:::simboli
v | hitrost | v = \dfrac{s}{t} | m/s | $1\,\mathrm{m/s} = 3{,}6\,\mathrm{km/h}$
s | pot | s = v \cdot t | m
t | čas | t = \dfrac{s}{v} | s
s_2 | pot srne v eni minuti | s_2 = v \cdot t_2 | m
t_2 | čas teka srne (ena minuta) | | s
:::
