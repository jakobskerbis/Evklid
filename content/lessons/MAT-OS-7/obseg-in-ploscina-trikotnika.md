---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Medicinska sestra ima v predalu dva trikotna obliža. Oba imata po dve stranici dolgi $13\,\text{cm}$. Pri prvem tretja stranica meri $10\,\text{cm}$, pri drugem $24\,\text{cm}$. Drugi ima torej za $14\,\text{cm}$ daljši rob. Kateri pokrije več kože?

Skoraj vsak bi rekel: drugi, saj je večji. Presenečenje: oba pokrijeta **natanko enako** kože, po $60\,\text{cm}^2$. Prvi je ozek in visok, drugi širok in nizek.

V tej temi ugotoviš, zakaj je tako. Naučiš se izračunati **obseg** trikotnika (dolžino roba, npr. lepilnega traku okoli rane) in **ploščino** (koliko površine lik pokrije, npr. koliko kože prekrije obliž). V zdravstvu, pri šivanju, pleskanju ali na vrtu sta to dve različni vprašanji in pogosto potrebuješ obe.

## Razlaga

**Obseg.** Obseg je dolžina poti okoli lika. Pri trikotniku seštejemo vse tri stranice:

$$o = a + b + c$$

Prvi obliž ima obseg $10 + 13 + 13 = 36\,\text{cm}$, drugi $24 + 13 + 13 = 50\,\text{cm}$. Obseg merimo v enotah za dolžino: $\text{mm}$, $\text{cm}$, $\text{m}$.

**Mamljiva napačna ideja.** Ploščino pravokotnika že znaš: $p = a \cdot b$. Zato je mamljivo misliti, da je trikotnik »pol pravokotnika iz dveh stranic«, torej $p = \dfrac{a \cdot b}{2}$ za kateri koli dve stranici. Preizkusimo to na prvem obližu: $\dfrac{13 \cdot 13}{2} = 84{,}5$. Na drugem dobimo isto, $84{,}5$, čeprav sta obliža povsem različne oblike. Pravilna ploščina pa je pri obeh $60\,\text{cm}^2$. Ideja torej ne drži.

**Kje je napaka.** Stranici $13\,\text{cm}$ sta poševni. Ploščina pa ni odvisna od poševnih robov, ampak od tega, kako **visok** je trikotnik nad izbrano stranico. Spomni se višine iz prejšnje teme: višina je pravokotnica iz oglišča na nasprotno stranico.

- Stranico, na katero pade višina, imenujemo **osnovnica**.
- Višino na stranico $a$ označimo z $v_a$, na $b$ z $v_b$, na $c$ z $v_c$.
- Stranica in višina, ki pada nanjo, sta **pripadajoči**.

**Ploščina.** Okoli trikotnika nariši pravokotnik, ki ima za eno stranico osnovnico $a$, za drugo pa višino $v_a$. Višina razdeli trikotnik na dva pravokotna trikotnika. Vsak je natanko polovica svojega dela pravokotnika (diagonala ga razpolovi). Skupaj je trikotnik torej polovica pravokotnika:

$$p = \frac{a \cdot v_a}{2}$$

Enako velja za drugi dve stranici: $p = \dfrac{b \cdot v_b}{2}$ in $p = \dfrac{c \cdot v_c}{2}$. Ploščino merimo v kvadratnih enotah: $\text{cm}^2$, $\text{m}^2$.

Zdaj paradoks ni več skrivnost. Prvi obliž ima nad stranico $10\,\text{cm}$ višino $12\,\text{cm}$, drugi nad stranico $24\,\text{cm}$ višino $5\,\text{cm}$:

| Obliž | Osnovnica | Višina | Ploščina |
|---|---|---|---|
| ozek | $10\,\text{cm}$ | $12\,\text{cm}$ | $60\,\text{cm}^2$ |
| širok | $24\,\text{cm}$ | $5\,\text{cm}$ | $60\,\text{cm}^2$ |

:::premisli
Obliž iz preglednice ima osnovnico $10\,\text{cm}$ in višino $12\,\text{cm}$. Kaj se zgodi s ploščino, če obliž prerežeš na pol vzdolž višine? Napovej, preden računaš.
---
Vsak kos ima osnovnico $5\,\text{cm}$ in isto višino $12\,\text{cm}$, zato ploščino $\dfrac{5 \cdot 12}{2} = 30\,\text{cm}^2$, pol od $60\,\text{cm}^2$. Kosa sta pravokotna trikotnika.
:::

**Pravokotni trikotnik.** Kateti sta pravokotni, zato je ena kateta kar višina na drugo. Samo tu smeš množiti dve stranici: $p = \dfrac{a \cdot b}{2}$, kjer sta $a$ in $b$ kateti.

**Topokotni trikotnik.** Višina na krajšo stranico pade zunaj trikotnika, na podaljšek stranice. Obrazec velja enako, le višino moraš izmeriti do podaljška.

V simulaciji spodaj (»Ploščina trikotnika«) nastavi $a = 6$ in $v = 4$. Nato premikaj drsnik »zamik vrha«. Opazuj: stranice se daljšajo, obseg raste, ploščina pa ostane $12$.

:::premisli
Zakaj se ploščina ne spremeni, ko vrh drsi vzporedno z osnovnico?
---
Osnovnica ostane ista, vrh pa je ves čas enako visoko nad njo, zato se višina ne spremeni. V obrazcu $p = \dfrac{a \cdot v_a}{2}$ ni poševnih stranic, zato njihovo daljšanje ploščine ne spremeni.
:::

**Enote.** Pred računom izrazi vse dolžine v isti enoti. Obseg zapišeš v $\text{cm}$, ploščino v $\text{cm}^2$, ker množimo dve dolžini.

## Rešeni primeri

### Primer 1: trikotna ruta

Trikotna ruta iz omarice za prvo pomoč je pravokotni trikotnik. Kateti merita $96\,\text{cm}$, hipotenuza približno $136\,\text{cm}$. Koliko traku potrebuješ, da ruto obrobiš, in koliko blaga je v njej?

**Podatki:** kateti $a = 96\,\text{cm}$, $b = 96\,\text{cm}$, hipotenuza $c = 136\,\text{cm}$
**Iščemo:** obseg $o$ (trak) in ploščino $p$ (blago)

:::formula
$o = a + b + c$

Pravokotni trikotnik: $p = \dfrac{a \cdot b}{2}$ ($a$, $b$ kateti)
:::

**Rešitev:**

1. Trak gre po robu, zato računamo obseg: $o = 96 + 96 + 136 = 328\,\text{cm}$.
2. Kateti sta pravokotni, zato je ena višina na drugo: $p = \dfrac{96 \cdot 96}{2} = 4608\,\text{cm}^2$.
3. Odgovor: potrebuješ $328\,\text{cm}$ traku, v ruti je $4608\,\text{cm}^2$ blaga.

### Primer 2: obliž za komolec, višina zunaj

Obliž za komolec je topokotni trikotnik s stranicami $a = 5\,\text{cm}$, $b = 5\,\text{cm}$ in $c = 8\,\text{cm}$. Višina na stranico $a$ pade zunaj trikotnika in meri $v_a = 4{,}8\,\text{cm}$. Izračunaj obseg in ploščino.

**Podatki:** $a = 5\,\text{cm}$, $b = 5\,\text{cm}$, $c = 8\,\text{cm}$, $v_a = 4{,}8\,\text{cm}$
**Iščemo:** obseg $o$ in ploščino $p$

:::formula
$o = a + b + c$

$p = \dfrac{a \cdot v_a}{2}$
:::

**Rešitev:**

1. Obseg: $o = 5 + 5 + 8 = 18\,\text{cm}$.
2. Poznamo višino na $a$, zato je $a$ osnovnica. Stranice $c$ ne smemo vzeti, ker $v_a$ ne pade nanjo.
3. $p = \dfrac{5 \cdot 4{,}8}{2} = 12\,\text{cm}^2$.
4. Preizkus: višina na $c$ meri $3\,\text{cm}$, in res $\dfrac{8 \cdot 3}{2} = 12$. Ploščina je ista, ne glede na izbrano osnovnico.
5. Odgovor: obseg je $18\,\text{cm}$, ploščina $12\,\text{cm}^2$.

### Primer 3: blazina za fizioterapijo

Fizioterapevt izreže iz pene trikotno blazino za podlaganje kolena. Ploščina blazine mora biti $750\,\text{cm}^2$, osnovnica meri $0{,}5\,\text{m}$. Kako visoka mora biti blazina nad osnovnico?

**Podatki:** $p = 750\,\text{cm}^2$, $a = 0{,}5\,\text{m}$
**Iščemo:** višino $v_a$

:::formula
$p = \dfrac{a \cdot v_a}{2}$, zato $v_a = \dfrac{2 \cdot p}{a}$
:::

**Rešitev:**

1. Enote poenotimo, ker je ploščina v $\text{cm}^2$: $a = 0{,}5\,\text{m} = 50\,\text{cm}$.
2. Ploščina je polovica zmnožka, zato zmnožek $a \cdot v_a$ znaša $2 \cdot 750 = 1500\,\text{cm}^2$.
3. Zmnožek delimo z osnovnico: $v_a = 1500 : 50 = 30\,\text{cm}$.
4. Preizkus: $\dfrac{50 \cdot 30}{2} = 750$. ✓
5. Odgovor: blazina mora biti visoka $30\,\text{cm}$.

### Primer 4: zdaj ti

Obliž ima obliko enakokrakega trikotnika. Obseg meri $16\,\text{cm}$, osnovnica $c = 6\,\text{cm}$, višina na osnovnico $v_c = 4\,\text{cm}$. Koliko meri krak in kolikšna je ploščina?

**Podatki:** $o = 16\,\text{cm}$, $c = 6\,\text{cm}$, $v_c = 4\,\text{cm}$, kraka sta enaka
**Iščemo:** krak $a$ in ploščino $p$

:::formula
$o = c + 2a$

$p = \dfrac{c \cdot v_c}{2}$
:::

**Rešitev:**

1. Kraka skupaj merita $16 - 6 = 10\,\text{cm}$, ker obseg vsebuje tudi osnovnico.
2. Izračunaj en krak in ploščino sam, nato preveri:

:::premisli
Koliko meri krak in kolikšna je ploščina obliža?
---
Krak: $10 : 2 = 5\,\text{cm}$. Ploščina: $p = \dfrac{6 \cdot 4}{2} = 12\,\text{cm}^2$. Krak v ploščino ne vstopa, ker ni višina.
:::

## Pogoste napake

- **Dve stranici namesto stranice in višine.** Račun $\dfrac{13 \cdot 13}{2}$ je videti smiseln, a poševna stranica ni višina. Pravilo $\dfrac{a \cdot b}{2}$ velja le za kateti pravokotnega trikotnika. Popravek: vedno poišči višino, ki pade na izbrano osnovnico.
- **Pozabljeno deljenje z 2.** Zmnožek $a \cdot v_a$ je ploščina celega pravokotnika okoli trikotnika. Trikotnik je le njegova polovica.
- **»Daljši rob, večja ploščina.«** Obseg in ploščina nista povezana tako preprosto: širok, nizek obliž ima lahko daljši rob in enako ali celo manjšo ploščino. Popravek: za ploščino gledaj osnovnico in višino, ne obsega.
- **Višina, ki ne pripada osnovnici.** Pri topokotnem trikotniku učenci višino, ki pade na podaljšek stranice $a$, množijo z neko drugo stranico. Višina in osnovnica morata biti par.
- **Enote.** Obseg je v $\text{cm}$, ploščina v $\text{cm}^2$. Če je ena mera v $\text{m}$, druga v $\text{cm}$, ju najprej poenoti.

## Povzetek

- Obseg trikotnika: $o = a + b + c$, v enotah za dolžino.
- Ploščina: $p = \dfrac{a \cdot v_a}{2} = \dfrac{b \cdot v_b}{2} = \dfrac{c \cdot v_c}{2}$, v kvadratnih enotah.
- Osnovnica in višina morata biti pripadajoči; poševna stranica ni višina.
- Pravokotni trikotnik: $p = \dfrac{a \cdot b}{2}$, kjer sta $a$, $b$ kateti.
- Pri topokotnem trikotniku lahko višina pade na podaljšek stranice.
- Neznano višino ali osnovnico dobiš iz $a \cdot v_a = 2p$.
- Rob (trak, ograja, šiv) je obseg; površina (blago, koža, barva) je ploščina.

## Drugače: Kot zgodba

Na taboru prve pomoči je Nika dobila kvadratno platneno ruto s stranico $96\,\text{cm}$. Inštruktor jo je prerezal po diagonali in rekel: »Zdaj imaš dve trikotni ruti za dve roki v opornici.«

Nika je pomislila: kvadrat ima $96 \cdot 96 = 9216\,\text{cm}^2$ blaga. Ruti sta enaki, torej ima vsaka polovico, $4608\,\text{cm}^2$. Pri tej ruti sta kateti stranici kvadrata, zato sta tudi osnovnica in višina.

Potem je dobila še obliž čudne, topokotne oblike. Tu nobena stranica ni bila pravokotna na drugo. Nika je položila ravnilo pravokotno na najdaljšo stranico in izmerila, kako visoko je nasprotno oglišče. Narisala je pravokotnik z istim dnom in to višino ter videla: obliž zapolni natanko pol pravokotnika. Od takrat pri vsakem trikotniku najprej vpraša: »Kako visoko je oglišče nad dnom?«

## Drugače: Korak za korakom s številkami

Postopek za vsako nalogo:

1. Izpiši podatke z enotami in jih poenoti.
2. Odloči: rob (obseg) ali površina (ploščina)?
3. Za obseg seštej vse tri stranice.
4. Za ploščino poišči par: stranico in njeno višino.
5. Pomnoži ju in deli z $2$.
6. Odgovori v stavku z enoto ($\text{cm}$ ali $\text{cm}^2$).

Kaj se zgodi, ko vrh drsi vzporedno z osnovnico $a = 6\,\text{cm}$ na višini $v_a = 4\,\text{cm}$:

| Položaj vrha | $a \cdot v_a$ | Ploščina | Obseg |
|---|---|---|---|
| nad sredino | $6 \cdot 4 = 24$ | $12\,\text{cm}^2$ | najmanjši |
| nad ogliščem | $6 \cdot 4 = 24$ | $12\,\text{cm}^2$ | večji |
| daleč ob strani | $6 \cdot 4 = 24$ | $12\,\text{cm}^2$ | še večji |

Ploščina je v vseh vrsticah ista, obseg pa raste, ker se poševni stranici daljšata.

## Preveri se

? Medicinska sestra izmeri trikotno rano. Pri stranici $c$ zapiše tudi $v_c$. Kaj je $v_c$?
- Dolžina najdaljše stranice rane.
~ Najdaljša stranica je ena od stranic $a$, $b$, $c$, ne višina.
+ Razdalja od nasprotnega oglišča do stranice $c$, merjena pravokotno nanjo.
- Dolžina poševne stranice ob stranici $c$.
~ Poševna stranica ni pravokotna na $c$, zato ni višina, čeprav se z njo stika.
- Polovica obsega rane.
~ Obseg je vsota stranic; višina z njim nima neposredne zveze.
> Višina $v_c$ je pravokotnica iz oglišča $C$ na stranico $c$ (ali njen podaljšek). Skupaj s $c$ da ploščino $\dfrac{c \cdot v_c}{2}$.

? Trije obliži: A ima $a = 9\,\text{cm}$, $v_a = 2\,\text{cm}$; B ima $a = 4\,\text{cm}$, $v_a = 6\,\text{cm}$; C ima $a = 6\,\text{cm}$, $v_a = 5\,\text{cm}$. Razvrsti jih od najmanjše do največje ploščine.
+ A, B, C
- B, C, A
~ To je razvrstitev po osnovnici. Daljša osnovnica sama še ne pomeni večje ploščine, šteje zmnožek z višino.
- A, C, B
~ To je razvrstitev po višini. Tudi višina sama ne odloča; upoštevati moraš obe meri.
> Ploščine so $\dfrac{9 \cdot 2}{2} = 9$, $\dfrac{4 \cdot 6}{2} = 12$ in $\dfrac{6 \cdot 5}{2} = 15\,\text{cm}^2$, torej A, B, C.

? Kaj se zgodi, če vrh trikotnika premakneš vzporedno z osnovnico, osnovnica pa ostane ista?
- Ploščina in obseg se povečata.
~ To je ideja »daljši rob, večja ploščina«. Višina se ne spremeni, zato tudi ploščina ne.
+ Ploščina ostane enaka, obseg se lahko spremeni.
- Ploščina se zmanjša, ker se trikotnik nagne.
~ Nagnjen trikotnik je videti manjši, a vrh je še vedno enako visoko nad osnovnico.
- Ploščina in obseg ostaneta enaka.
~ Poševni stranici se pri premiku daljšata ali krajšata, zato se obseg v splošnem spremeni.
> Osnovnica in višina ostaneta enaki, zato $p = \dfrac{a \cdot v_a}{2}$ ostane enaka. Stranici se spremenita, zato se spremeni obseg.

? Obliž ima stranice $5\,\text{cm}$, $5\,\text{cm}$ in $8\,\text{cm}$. Višina na stranico $8\,\text{cm}$ meri $3\,\text{cm}$. Kolikšna je ploščina?
- $24\,\text{cm}^2$
~ To je $8 \cdot 3$ brez deljenja z $2$: ploščina celega pravokotnika okoli trikotnika.
- $20\,\text{cm}^2$
~ To je $\dfrac{5 \cdot 8}{2}$: zmnožek dveh stranic. Stranica $5\,\text{cm}$ ni višina.
+ $12\,\text{cm}^2$
- $18\,\text{cm}$
~ To je obseg ($5 + 5 + 8$), ne ploščina; tudi enota je za dolžino.
> $p = \dfrac{8 \cdot 3}{2} = 12\,\text{cm}^2$: osnovnica $8\,\text{cm}$ in njena višina $3\,\text{cm}$ sta par.

? Trikotni obliž ima ploščino $21\,\text{cm}^2$ in osnovnico $7\,\text{cm}$. Kolikšna je pripadajoča višina?
- $3\,\text{cm}$
~ To je $21 : 7$. Pozabil si, da je ploščina polovica zmnožka, zato moraš $21$ najprej podvojiti.
+ $6\,\text{cm}$
- $10{,}5\,\text{cm}$
~ To je $21 : 2$. Ploščino je treba podvojiti, nato deliti z osnovnico.
- $147\,\text{cm}$
~ To je $21 \cdot 7$. Neznano višino dobiš z deljenjem, ne z množenjem.
> $a \cdot v_a = 2 \cdot 21 = 42$, zato $v_a = 42 : 7 = 6\,\text{cm}$. Preizkus: $\dfrac{7 \cdot 6}{2} = 21$.

:::simboli
o | obseg trikotnika | o = a + b + c | | enakokraki z osnovnico c: o = c + 2a
p | ploščina trikotnika | p = \frac{a \cdot v_a}{2} | | pravokotni: p = a · b : 2 (a, b kateti)
a, b | stranici trikotnika | | | v pravokotnem trikotniku kateti; v primeru 4 a krak
c | tretja stranica | | | v primeru 4 osnovnica enakokrakega trikotnika
v_a | višina na stranico a | v_a = \dfrac{2 \cdot p}{a} |
v_b | višina na stranico b | |
v_c | višina na stranico c | |
:::
