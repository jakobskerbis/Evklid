---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Razred gre na izlet s kombijem. Kombi ima $9$ sedežev, voznik in učiteljica že sedita. Koliko učencev se lahko še pelje?

Drug dan isti razred hodi po planinski poti. Na zemljevidu so prehodili že $4\,\text{km}$, do teme bi radi prehodili skupaj največ $10\,\text{km}$. Koliko celih kilometrov lahko še prehodijo?

Situaciji sta si na videz različni: enkrat štejemo ljudi, drugič kilometre. Skrivata pa isto misel. V obeh je **zgornja meja**, ki je ne smemo preseči, in v obeh je pravih odgovorov **več**. V kombi lahko sede $7$ učencev, lahko pa tudi $5$ ali $1$. Takemu pogoju v matematiki rečemo **neenačba**.

## Razlaga

**1. Mamljiva bližnjica.** Kombi zapišemo tako: $x$ je število učencev, skupaj z voznikom in učiteljico je v kombiju $x + 2$ oseb, to pa je največ $9$. Mnogi bi pogoj zapisali kot enačbo $x + 2 = 9$, izračunali $x = 7$ in končali. Je to res edini odgovor? Preverimo nekaj števil:

| $x$ (učenci) | $x + 2$ (vse osebe) | Ali je to največ $9$? |
|---|---|---|
| $3$ | $5$ | da |
| $5$ | $7$ | da |
| $7$ | $9$ | da, točno $9$ |
| $8$ | $10$ | ne, en sedež premalo |

Število $7$ ni edini odgovor, je le **največji**. Enačba nam je dala mejo, ne vseh odgovorov.

**2. Neenačba in njene rešitve.** Pogoj »največ $9$« zapišemo z znakom $\le$ (manjše ali enako):

$$x + 2 \le 9$$

Takemu zapisu rečemo **neenačba**: dva izraza sta povezana z znakom za primerjanje namesto z $=$. **Rešitev** neenačbe je vsako število, s katerim neenačba postane resnična. Vse rešitve skupaj tvorijo **množico rešitev**. Tu jih iščemo med **naravnimi števili** $1, 2, 3, \dots$ Število $0$ ni naravno, zato ga ne pišemo.

Za kombi je množica rešitev $\{1, 2, 3, 4, 5, 6, 7\}$.

**3. Štirje znaki.** Besede v nalogi povedo, kateri znak izbrati:

| Znak | Beremo | V besedilu |
|---|---|---|
| $<$ | je manjše od | manj kot |
| $\le$ | je manjše ali enako | največ |
| $>$ | je večje od | več kot |
| $\ge$ | je večje ali enako | vsaj, najmanj |

Pri $\le$ in $\ge$ meja **spada** med rešitve, pri $<$ in $>$ ne.

:::premisli
Na kombiju bi pisalo »manj kot $9$ oseb«. Ali bi bilo $7$ učencev še vedno rešitev? Napovej, nato preveri.
---
Ne. Zdaj je pogoj $x + 2 < 9$. Pri $x = 7$ dobimo $9 < 9$, kar ne drži. Rešitve so $1, 2, 3, 4, 5, 6$.
:::

**4. Druga past: rešitve niso vedno pod mejo.** Ko poiščemo mejo, moramo še ugotoviti, na kateri strani so rešitve. Pri $x + 3 > 10$ je meja $7$ (ker je $7 + 3 = 10$). Kdor rešitve kar avtomatsko išče pod mejo, se zmoti: $5 + 3 = 8$, in $8 > 10$ ne drži. Prava stran je nad mejo: $8 + 3 = 11 > 10$.

**5. Postopek v štirih korakih.**

1. **Meja.** Znak zamenjaj z $=$ in reši enačbo, kot že znaš.
2. **Stran.** Vstavi eno število, ki je manjše od meje. Če neenačba drži, so rešitve pod mejo, sicer nad njo.
3. **Meja sama.** Pri $\le$ in $\ge$ jo vzemi zraven, pri $<$ in $>$ ne.
4. **Zapis.** Naštej naravna števila. Če jih je neskončno, napiši začetek in tri pike.

Na številski premici to vidiš takole. Za $x + 2 \le 9$ poln krožec (●) pomeni rešitev, prazen (○) pa število, ki ni rešitev:

:::risba premica
opis: Številska premica od 1 do 9 za neenačbo x + 2 ≤ 9. Števila od 1 do 7 imajo poln krožec (so rešitve), 8 in 9 prazen krožec (nista rešitvi).
od: 1
do: 9
točka: 1
točka: 2
točka: 3
točka: 4
točka: 5
točka: 6
točka: 7
točka: 8 | | prazna
točka: 9 | | prazna
:::

V simulaciji spodaj »Neenačba na številski premici« nastavi $a = 1$, $b = 2$, znak $\le$ in $c = 9$. Premikaj »preizkusi x« od $6$ do $8$ in beri, kdaj se izpis zamenja iz »je rešitev« v »ni rešitev«. Premica pokaže tudi števila med celimi, mi beremo le naravna.

**6. Končno ali neskončno mnogo.** Če so rešitve pod mejo, jih je med naravnimi števili končno mnogo, saj se ustavimo pri $1$. Če so nad mejo, jih je neskončno mnogo.

:::premisli
Ali ima neenačba $x + 3 > 10$ največjo rešitev? Zakaj?
---
Nima. Za vsako rešitev je tudi naslednje število rešitev, ker je $x + 3$ še večje. Zato pišemo $\{8, 9, 10, \dots\}$.
:::

## Rešeni primeri

### Primer 1 (lažji): manj kot

Poišči vse naravne rešitve neenačbe $x + 5 < 12$.

**Podatki:** neenačba $x + 5 < 12$, rešitve iščemo med naravnimi števili
**Iščemo:** množico rešitev

:::formula
Meja je rešitev enačbe $x + 5 = 12$. Znak $<$ meje ne vključuje.
:::

**Rešitev:**

1. Meja: $x = 12 - 5 = 7$, ker je odštevanje obratno seštevanju.
2. Stran: pri $x = 1$ je $1 + 5 = 6 < 12$, drži. Rešitve so pod mejo.
3. Meja sama: $7 + 5 = 12 < 12$ ne drži, zato $7$ ni rešitev. Zadnja rešitev je $6$, saj je $6 + 5 = 11 < 12$.
4. Odgovor: množica rešitev je $\{1, 2, 3, 4, 5, 6\}$.

### Primer 2: vsaj

Avtobus je na poti na morje že ustavil $4$-krat. Vodič pravi, da bo vseh postankov skupaj vsaj $7$. Koliko postankov je še pred njimi? Zapiši neenačbo in poišči naravne rešitve.

**Podatki:** že opravljeni postanki: $4$, vseh postankov: vsaj $7$
**Iščemo:** število preostalih postankov $x$

:::formula
»Vsaj« pomeni $\ge$: $x + 4 \ge 7$
:::

**Rešitev:**

1. Meja: $x = 7 - 4 = 3$.
2. Stran: pri $x = 1$ je $1 + 4 = 5$, in $5 \ge 7$ ne drži. Rešitve so nad mejo.
3. Meja sama: $3 + 4 = 7 \ge 7$ drži, ker znak $\ge$ dovoli enakost. Število $3$ je rešitev.
4. Odgovor: pred njimi so še vsaj $3$ postanki, množica rešitev je $\{3, 4, 5, \dots\}$.

### Primer 3 (težji): kolesarjenje do morja

Kolesarji vsak dan prevozijo $25\,\text{km}$. Pot do morja je po zemljevidu dolga $110\,\text{km}$. Najmanj koliko dni potrebujejo, da prevozijo vso pot?

**Podatki:** na dan $25\,\text{km}$, pot $110\,\text{km}$, število dni je naravno število
**Iščemo:** najmanjše število dni $x$

:::formula
V $x$ dneh prevozijo $25 \cdot x$ kilometrov, to mora biti vsaj pot: $25 \cdot x \ge 110$
:::

**Rešitev:**

1. Meja: $x = 110 : 25 = 4{,}4$. Meja ni naravno število, zato jo moramo pozorno obravnavati.
2. Preverimo naravni števili ob meji: $25 \cdot 4 = 100$, in $100 \ge 110$ ne drži. $25 \cdot 5 = 125$, in $125 \ge 110$ drži.
3. Rešitve so nad mejo: $\{5, 6, 7, \dots\}$. Zaokrožiti moramo navzgor, ker bi v $4$ dneh ostalo še $10\,\text{km}$.
4. Odgovor: kolesarji potrebujejo najmanj $5$ dni.

### Primer 4: zdaj ti

Jakob bo pot razdelil na $3$ enake dneve. Na dan ne želi prehoditi več kot $8\,\text{km}$. Kako dolga (v celih kilometrih) je lahko vsa pot?

**Podatki:** $3$ enaki dnevi, na dan največ $8\,\text{km}$
**Iščemo:** možne dolžine poti $x$ v kilometrih

:::formula
Na dan prehodi $x : 3$ kilometrov: $x : 3 \le 8$
:::

**Rešitev:**

1. Meja: iz $x : 3 = 8$ dobimo $x = 8 \cdot 3 = 24$, ker je množenje obratno deljenju.
2. Stran: pri $x = 3$ je $3 : 3 = 1 \le 8$, drži. Rešitve so pod mejo.
3. Odloči o meji in zapiši množico rešitev sam, nato preveri:

:::premisli
Ali je $24$ rešitev? Katera je množica rešitev?
---
Je, ker je $24 : 3 = 8 \le 8$. Pot je lahko dolga od $1$ do $24\,\text{km}$: $\{1, 2, 3, \dots, 24\}$. Najdaljša pot meri $24\,\text{km}$.
:::

## Pogoste napake

- **Ena sama rešitev.** Učenec neenačbo reši kot enačbo in napiše $x = 7$. Toda $7$ je le meja, tudi $5$ ali $3$ izpolnita pogoj. Po izračunu meje vedno zapiši vsa števila na pravi strani.
- **Meja pri $<$ in $\le$.** Pri $x + 2 < 9$ učenec napiše tudi $7$, ker ga je dobil v računu. Pri znaku $<$ meja ne spada zraven, saj $9 < 9$ ne drži. Mejo vedno vstavi in preveri.
- **Napačna stran.** Pri $x + 3 > 10$ učenec našteje $1, 2, \dots, 6$, ker je navajen, da so rešitve pod mejo. Znak $>$ zahteva večje vrednosti. Vstavi eno število pod mejo in poglej, ali neenačba drži.
- **Zaokroževanje navzdol.** Pri $25 \cdot x \ge 110$ učenec iz $4{,}4$ naredi $4$. Toda $25 \cdot 4 = 100$ je premalo. Kadar meja ni naravno število, preveri obe sosednji naravni števili.
- **Ničla med rešitvami.** Pri $x + 5 < 12$ učenec začne z $0$. Ničla ni naravno število, zato množica rešitev začne z $1$.

## Povzetek

- Neenačba povezuje dva izraza z znakom $<$, $\le$, $>$ ali $\ge$; »največ« je $\le$, »vsaj« je $\ge$.
- Rešitev je vsako število, s katerim neenačba drži. Rešitev je lahko več ali neskončno mnogo.
- Postopek: mejo dobiš z enačbo, stran ugotoviš z enim preizkusom, pri $\le$ in $\ge$ meja spada zraven.
- Če meja ni naravno število, preveri obe sosednji naravni števili.
- Naravna števila so $1, 2, 3, \dots$; ničla ni med njimi. Neskončno rešitev zapišeš z začetkom in tremi pikami.

## Drugače: Kot zgodba

Spomni se pohodnikov iz uvoda. Prehodili so že $4\,\text{km}$, skupaj jih želijo največ $10\,\text{km}$.

Nika pravi: »Še $6\,\text{km}$ in smo na cilju.« Luka odgovori: »Lahko tudi samo $2\,\text{km}$ do razgledišča, pa smo še vedno pod mejo.« Oba imata prav. Nika je našla mejo, Luka pa je opazil, da so dovoljene tudi krajše poti.

Učiteljica na zemljevidu pokaže možnosti: $1, 2, 3, 4, 5$ ali $6\,\text{km}$. Pri $7\,\text{km}$ bi skupaj prehodili $11\,\text{km}$, to pa je preveč. Zapis zgodbe je neenačba $x + 4 \le 10$ z rešitvami $\{1, 2, 3, 4, 5, 6\}$.

## Drugače: Korak za korakom s številkami

Rešimo $x + 6 \le 10$ in rezultat preverimo s tabelo.

1. Meja: $x = 10 - 6 = 4$.
2. Naravna števila do vključno $4$: $1, 2, 3, 4$.
3. Preizkus v tabeli, tudi z vrednostmi zunaj rešitev:

| $x$ | $x + 6$ | Ali je $x + 6 \le 10$? |
|---|---|---|
| $1$ | $7$ | da |
| $3$ | $9$ | da |
| $4$ | $10$ | da (je enako) |
| $5$ | $11$ | ne |
| $8$ | $14$ | ne |

Tabela potrdi: rešitve so $\{1, 2, 3, 4\}$. Preizkus vedno naredi pri meji: pri $4$ še velja, pri $5$ ne več.

## Preveri se

? Ob cesti stoji znak: »Višina vozila največ $3\,\text{m}$.« Kateri zapis pove pogoj za višino vozila $v$ v metrih?
- $v < 3$
~ »Največ« dovoli tudi točno $3\,\text{m}$, znak $<$ pa meje ne vključuje.
+ $v \le 3$
- $v \ge 3$
~ Znak $\ge$ pomeni »vsaj«. Tako bi smela mimo le vozila, visoka $3\,\text{m}$ ali več.
- $v = 3$
~ Tako bi smela mimo samo vozila, visoka točno $3\,\text{m}$. Pogoj ima več rešitev.
> »Največ« pomeni manjše ali enako, torej $v \le 3$. Mimo smejo vsa vozila do vključno $3\,\text{m}$.

? Razvrsti neenačbe po številu naravnih rešitev, od najmanj do največ: A: $x + 3 < 7$, B: $x + 3 \le 7$, C: $x + 3 > 7$.
+ A, B, C
- B, A, C
~ Znak $\le$ ima mejo zraven, zato ima B eno rešitev več kot A, ne manj.
- C, A, B
~ Pri C so rešitve nad mejo in jih je neskončno mnogo, ne najmanj.
- A, C, B
~ C nima zadnje rešitve, zato ima več rešitev kot vsaka neenačba s končno mnogo rešitvami.
> Meja je povsod $4$. A: $\{1, 2, 3\}$, B: $\{1, 2, 3, 4\}$, C: $\{5, 6, 7, \dots\}$, kar je neskončno mnogo.

? Kaj se zgodi z množico rešitev neenačbe $x + 2 \le 9$, če znak $\le$ zamenjamo z $<$?
- Ostane enaka.
~ Meja je res še vedno $7$, a pri znaku $<$ ne spada več zraven.
+ Izgubi število $7$.
- Doda se število $8$.
~ Pri $8$ je $8 + 2 = 10$, kar ni manjše od $9$. Znak $<$ je strožji, ne bolj ohlapen.
- Rešitev postane neskončno mnogo.
~ Rešitve so še vedno pod mejo, zato jih je končno mnogo.
> Za $x + 2 < 9$ število $7$ ni več rešitev, ker $9 < 9$ ne drži. Rešitve so $\{1, 2, 3, 4, 5, 6\}$.

? Katero je največje naravno število, ki reši neenačbo $4 \cdot x < 30$?
- $8$
~ Mejo $7{,}5$ si zaokrožil navzgor, a $4 \cdot 8 = 32$ ni manj kot $30$.
- $7{,}5$
~ $7{,}5$ je meja, ni pa naravno število in tudi ni rešitev, ker je $4 \cdot 7{,}5 = 30$.
+ $7$
- $26$
~ Odštel si $4$, toda $x$ je pomnožen s $4$, zato je obratna operacija deljenje.
> Meja: $30 : 4 = 7{,}5$. Preverimo sosednji naravni števili: $4 \cdot 7 = 28 < 30$ drži, $4 \cdot 8 = 32 < 30$ ne drži.

? Avtobus vsako uro prevozi $60\,\text{km}$. Do Dunaja je $270\,\text{km}$. Najmanj koliko celih ur mora voziti, da pride na cilj?
- $4$
~ V $4$ urah prevozi $60 \cdot 4 = 240\,\text{km}$, kar je premalo. Meje $4{,}5$ ne smeš zaokrožiti navzdol.
+ $5$
- $4{,}5$
~ Vprašanje sprašuje po celih urah, $4{,}5$ pa je le meja.
- $210$
~ Odštel si $60$ od $270$. Ker se kilometri množijo z urami, mejo dobiš z deljenjem.
> Neenačba je $60 \cdot x \ge 270$, meja $270 : 60 = 4{,}5$. Prvo naravno število nad mejo je $5$: $60 \cdot 5 = 300 \ge 270$.

:::simboli
x | neznanka | | | neenačbo običajno reši več števil
:::
