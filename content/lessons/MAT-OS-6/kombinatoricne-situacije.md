---
stanje: osnutek
demo: kombinatorika
avtor: AI
---

## Zakaj se tega učimo

Menih Gregor Mendel je na samostanskem vrtu križal rastline graha in štel, kakšne lastnosti imajo potomci. Pozneje je britanski biolog Reginald Punnett za takšno štetje narisal preglednico: ob levem robu je, kar lahko potomcu preda en starš, na vrhu, kar lahko preda drugi. Vsako polje je ena možna kombinacija. Biologi in zdravniki jo uporabljajo še danes, ko razlagajo, kako se lastnosti, na primer krvne skupine, prenašajo s staršev na otroke.

V ozadju je preprosto vprašanje: **koliko različnih možnosti sploh obstaja** in kako jih prešteti, ne da bi katero izpustili ali šteli dvakrat? Na pamet hitro kakšno pozabiš. Na **sliki**, v drevesnem prikazu ali preglednici, pa dobi vsaka možnost svoje mesto.

Takšnim nalogam rečemo **kombinatorične situacije**: izbira termina pri zdravniku, šifra ključavnice, razpored tekem.

## Razlaga

**1. Drevo za termine.** Zobozdravnica ima proste termine v torek in v četrtek, vsakič ob $8.$, $10.$ in $12.$ uri. Koliko terminov lahko izbereš? Nariši sliko:

:::risba skica
opis: Drevesni prikaz. Iz začetne točke na levi vodita dve veji, do torka in do četrtka. Iz vsakega dneva vodijo tri veje, do ure 8, 10 in 12. Na desni je šest koncev vej, vsak konec je en termin.
območje: 0; 0 .. 10; 6
črta: 0,5; 3 -> 3,5; 4,5
črta: 0,5; 3 -> 3,5; 1,5
črta: 3,5; 4,5 -> 6,5; 5,5
črta: 3,5; 4,5 -> 6,5; 4,5
črta: 3,5; 4,5 -> 6,5; 3,5
črta: 3,5; 1,5 -> 6,5; 2,5
črta: 3,5; 1,5 -> 6,5; 1,5
črta: 3,5; 1,5 -> 6,5; 0,5
točka: 0,5; 3 | začetek | pod
točka: 3,5; 4,5 | torek | nad
točka: 3,5; 1,5 | četrtek | pod
točka: 6,5; 5,5 | ob 8 | desno
točka: 6,5; 4,5 | ob 10 | desno
točka: 6,5; 3,5 | ob 12 | desno
točka: 6,5; 2,5 | ob 8 | desno
točka: 6,5; 1,5 | ob 10 | desno
točka: 6,5; 0,5 | ob 12 | desno
:::

Drevo bereš od leve proti desni. Iz začetne točke vodita **dve veji**, ker v prvem **koraku** izbiraš dan. Iz vsake zrastejo **tri nove veje**, ker v drugem koraku izbiraš uro. Vsaka pot od začetka do desnega roba je **ena možnost** (izid), na primer *torek ob 10*. Možnosti je toliko, kolikor je koncev zadnjih vej; tem koncem rečemo **konice**. Tu jih je $6$, torej $6$ terminov.

**2. Kako rišemo drevo.** Drevo rišemo od leve proti desni (ali od zgoraj navzdol):

- iz začetne točke narišemo toliko vej, kolikor je izbir v prvem koraku,
- iz konca vsake veje narišemo nove veje za vse izbire v drugem koraku,
- tako nadaljujemo za vsak korak.

Drevo nas sili k redu: najprej vse ure za torek, nato vse za četrtek. Nobene možnosti ne izpustimo in nobene ne ponovimo.

:::premisli
Zobozdravnica doda še sredo z istimi tremi urami. Kako se drevo spremeni in koliko je zdaj terminov?
---
Iz začetne točke zraste tretja veja, iz nje pa spet tri. Konic je $3 + 3 + 3 = 9$, to je $3 \cdot 3 = 9$ terminov.
:::

**3. Preglednica.** Pri **dveh** korakih lahko namesto drevesa narišemo preglednico: v vrstice izbire prvega koraka, v stolpce izbire drugega.

| dan \ ura | ob 8 | ob 10 | ob 12 |
|---|---|---|---|
| torek (T) | T8 | T10 | T12 |
| četrtek (Č) | Č8 | Č10 | Č12 |

Vsako polje je ena možnost. Vrstici sta $2$, stolpci so $3$, polj je $2 \cdot 3 = 6$, enako kot konic na drevesu.

**4. Ali se izbira lahko ponovi?** Pomembno je prebrati, ali smemo isto stvar izbrati večkrat.

- Pri šifri za ključavnico se števka lahko ponovi (šifra $3\,3$ je dovoljena).
- Pri razporedu tekmovalcev na stopničke se ne more: isti tekmovalec ne more biti hkrati prvi in drugi. V vsakem naslednjem koraku je zato ena izbira manj.

:::premisli
Iz števk $1$, $2$ in $3$ sestavljaš dvomestna števila. Koliko jih je, če se števki smeta ponoviti, in koliko, če se ne smeta? Zakaj se rezultata razlikujeta?
---
S ponavljanjem iz vsake od $3$ vej zrastejo $3$ vejice: $3 \cdot 3 = 9$. Brez ponavljanja le $2$, ker porabljene števke ne smeš vzeti znova: $3 \cdot 2 = 6$. Odpadejo $11$, $22$ in $33$.
:::

**5. Ali je vrstni red pomemben?** Pri dvomestnem številu je $12$ drugo število kot $21$, zato štejemo obe. Pri rokovanju pa je »Ana se rokuje z Borom« isto kot »Bor se rokuje z Ano«, zato tak par štejemo samo enkrat.

**6. Bližnjica z množenjem.** Na vseh drevesih zgoraj iz vsake veje istega koraka zraste enako število novih vej. Takrat konic ni treba šteti, lahko jih izračunamo. Če je v 1. koraku $a$ izbir, v 2. koraku $b$ izbir in v 3. koraku $c$ izbir, je vseh možnosti

$$N = a \cdot b \cdot c$$

Pri dveh korakih je $N = a \cdot b$. Temu pravimo **pravilo produkta**. Velja tudi, ko se izbira ne sme ponoviti: spremeni se, *katere* izbire ostanejo, *koliko* jih ostane, pa je pri vsaki veji enako.

Kadar je število izbir odvisno od prejšnje izbire, množenje ne deluje. Primer: dvomestna števila iz $1$, $2$, $3$, kjer je druga števka večja od prve. Po $1$ sta še $2$ izbiri, po $2$ ena, po $3$ nobena, skupaj $2 + 1 + 0 = 3$ ($12$, $13$, $23$). Drevo deluje vedno, bližnjica le včasih.

**7. Postopek.**

1. Ugotovi, v katerih korakih izbiraš.
2. Za vsak korak preštej izbire (se izbira sme ponoviti, je vrstni red pomemben, je zraven ničla?).
3. Nariši drevo ali preglednico.
4. Preštej konce zadnjih vej in preveri z množenjem.
5. Odgovori v stavku.

V simulaciji spodaj (**Drevesni prikaz možnosti**) nastavi drsnik »čevlji« na $1$, da dobiš drevo za majice in hlače. Nato dodaj še en par čevljev in opazuj: vsaka konica se razcepi na dve, zato je konic dvakrat več.

## Rešeni primeri

### Primer 1 (lažji)

Nika ima 3 majice: rdečo, modro in zeleno. Ima tudi 2 para hlač: kavbojke in kratke hlače. Na koliko različnih načinov se lahko obleče, če obleče eno majico in ene hlače?

**Podatki:** 3 majice: rdeča (R), modra (M), zelena (Z); 2 para hlač: kavbojke (K), kratke (H); izbere eno majico in ene hlače
**Iščemo:** število različnih načinov oblačenja (parov majica in hlače)

:::formula
Drevesni prikaz: iz začetka 3 veje (majice), iz vsake 2 veji (hlače). Število možnosti $= 3 \cdot 2$.
:::

**Rešitev:**

1. Narišemo drevo. Iz začetne točke vodijo 3 veje: R, M, Z.
2. Iz vsake majice vodita 2 veji: K in H.
3. Poti naštejemo po vrsti: RK, RH, MK, MH, ZK, ZH.
4. Preštejemo konce vej: $6$.
5. Preverimo z množenjem: $3 \cdot 2 = 6$. ✓
6. Odgovor: Nika se lahko obleče na $6$ različnih načinov.

### Primer 2 (srednji)

Laboratorij označuje epruvete s krvjo z dvomestnimi števili iz števk $0$, $1$, $2$ in $3$. Števka se v istem številu ne sme ponoviti. Koliko različnih oznak lahko sestavijo? Vse tudi zapiši.

**Podatki:** števke $0$, $1$, $2$, $3$ (4 števke); število je dvomestno; števka se v istem številu ne ponovi
**Iščemo:** število vseh takih dvomestnih števil in njihov seznam

:::formula
Dvomestno število se ne začne z $0$. Za enice ostanejo vse števke razen porabljene. Število možnosti $=$ (izbire za desetice) $\cdot$ (izbire za enice).
:::

**Rešitev:**

1. Desetice: $0$ odpade, ker $03$ ni dvomestno število. Ostanejo $1$, $2$, $3$, torej $3$ izbire.
2. Enice: vse štiri števke razen tiste na mestu desetic, torej $3$ izbire (tu je $0$ dovoljena).
3. Drevo ima torej 3 veje in iz vsake 3 nove veje. Števila po vrsti:
   - desetica $1$: $10$, $12$, $13$,
   - desetica $2$: $20$, $21$, $23$,
   - desetica $3$: $30$, $31$, $32$.
4. Preštejemo: $3 + 3 + 3 = 9$.
5. Preverimo z množenjem: $3 \cdot 3 = 9$. ✓
6. Odgovor: laboratorij lahko sestavi $9$ različnih oznak.

### Primer 3 (težji)

Pet zdravnikov, Ana, Bor, Cene, Dana in Eva, se zbere na sestanku. Vsak se z vsakim rokuje natanko enkrat. Koliko rokovanj je bilo?

**Podatki:** 5 zdravnikov: Ana (A), Bor (B), Cene (C), Dana (D), Eva (E); vsak se z vsakim rokuje natanko enkrat
**Iščemo:** število vseh rokovanj

:::formula
Rokovanje je par dveh različnih oseb. Vrstni red ni pomemben: par AB je isti kot BA, zato ga štejemo samo enkrat.
:::

**Rešitev:**

1. Osebe uredimo po abecedi. Pri vsaki zapišemo le rokovanja s tistimi, ki so v seznamu za njo. Tako vsak par zapišemo samo enkrat: BA je isto rokovanje kot AB, z istim človekom pa se nihče ne rokuje.
2. Rokovanja zapišemo v preglednico:

| Oseba | Nova rokovanja | Število |
|---|---|---|
| Ana | AB, AC, AD, AE | $4$ |
| Bor | BC, BD, BE | $3$ |
| Cene | CD, CE | $2$ |
| Dana | DE | $1$ |
| Eva | – | $0$ |

3. Preštejemo po vrsticah: Ana se rokuje s 4 kolegi, Bor še s 3 (z Ano je že štet), Cene še z 2, Dana še z 1, Eva z nikomer novim.
4. Seštejemo: $4 + 3 + 2 + 1 = 10$.
5. Preverimo drugače: vsak od 5 zdravnikov stisne roko 4 drugim, $5 \cdot 4 = 20$. Tako je vsako rokovanje šteto dvakrat, zato $20 : 2 = 10$. ✓
6. Odgovor: bilo je $10$ rokovanj.

### Primer 4 – zdaj ti

Fizioterapevt Niki predpiše tri vaje: raztezanje (R), počep (P) in most (M). Vsako naredi enkrat, vrstni red izbere sama. Na koliko različnih vrstnih redov lahko vadi?

**Podatki:** 3 vaje R, P, M; vsaka se naredi natanko enkrat (izbira se ne ponovi); vrstni red je pomemben
**Iščemo:** število vseh vrstnih redov

:::formula
Brez ponavljanja je v vsakem koraku ena izbira manj. Število možnosti $N = a \cdot b \cdot c$.
:::

**Rešitev:**

1. Prva vaja: izbira je med vsemi tremi, torej $3$ izbire.
2. Druga vaja: ena je že narejena, zato iz vsake veje zrasteta le $2$ vejici.
3. Tretjo vajo in skupno število izračunaj sam, nato preveri:

:::premisli
Koliko izbir je za tretjo vajo in koliko je vrstnih redov?
---
Ostane $1$ vaja, zato $N = 3 \cdot 2 \cdot 1 = 6$ vrstnih redov: RPM, RMP, PRM, PMR, MRP, MPR.
:::

## Pogoste napake

- **Naštevanje na pamet.** Brez reda kakšno možnost izpustiš ali zapišeš dvakrat. *Pravilno:* nariši drevo ali preglednico in naštevaj po vejah.
- **Seštevanje namesto množenja.** Pri 3 majicah in 2 parih hlač nekateri izračunajo $3 + 2 = 5$. To je število oblačil, ne oblek. Vsaka majica gre z vsakimi hlačami, zato je oblek $3 \cdot 2 = 6$.
- **Prezrt pogoj, da se izbira ne ponovi.** Dvomestnih števil iz števk $1$, $2$, $3$ brez ponavljanja ni $3 \cdot 3 = 9$, ampak $3 \cdot 2 = 6$. *Pravilno:* pri vsakem koraku se vprašaj, katere izbire so še na voljo.
- **Ničla na prvem mestu.** $05$ ni dvomestno število, ampak število $5$. *Pravilno:* ničla ne sme na prvo mesto, zato je tam ena izbira manj.
- **Dvojno štetje parov.** Pri rokovanju ali tekmah »vsak z vsakim« sta AB in BA isti par; če šteješ oba, dobiš dvakrat preveč. *Pravilno:* vsako osebo poveži le s tistimi, ki so v seznamu za njo, ali pa dobljeno število deli z $2$.

## Povzetek

- Kombinatorična situacija: izbiramo v več korakih; ena možnost je en celoten izbor.
- Drevesni prikaz: iz vsake veje narišemo veje za vse izbire naslednjega koraka; vsaka pot do konca je ena možnost.
- Pri dveh korakih lahko namesto drevesa narišemo preglednico: vsako polje je ena možnost.
- Pravilo produkta: če število izbir v koraku ni odvisno od prejšnje izbire, je možnosti $N = a \cdot b \cdot c$; sicer seštejemo konice po vejah.
- Če se izbira ne sme ponoviti, je v naslednjem koraku izbir za ena manj (npr. $3 \cdot 2 \cdot 1 = 6$). Večmestno število se ne začne z $0$.
- Pri parih, kjer vrstni red ni pomemben (rokovanje), vsak par štejemo samo enkrat.

## Drugače: Z analogijo

Drevo je kot **park s potmi**. Od vhoda vodijo tri poti, vsaka se razcepi v dve stezici do klopi. Do vsake klopi vodi ena sama pot od vhoda, zato je klopi toliko kot različnih poti: $3 \cdot 2 = 6$. Če bi se vsaka stezica še enkrat razcepila na dve, bi bilo klopi $6 \cdot 2 = 12$.

Preglednica pa je kot **pravokotnik iz kvadratkov**. Pravokotnik z $2$ vrsticama in $3$ stolpci ima $2 \cdot 3 = 6$ kvadratkov, tako kot pri ploščini. Pri terminih zobozdravnice je vsak kvadratek en termin.

## Drugače: Iz vsakdanjega življenja

Šolska kuhinja ponudi za malico 2 vrsti kruha, 3 namaze in 2 napitka (čaj ali mleko). Koliko različnih malic je mogoče?

Vsak kruh gre s katerim koli namazom: $2 \cdot 3 = 6$ sendvičev. K vsakemu vzameš čaj ali mleko, zato je malic $6 \cdot 2 = 12$.

Podobno je s kodno ključavnico za kolo, ki ima tri kolesca s števkami od $0$ do $9$. Na vsakem kolescu je $10$ izbir in števke se lahko ponavljajo, zato je kod $10 \cdot 10 \cdot 10 = 1000$, od $000$ do $999$. Z dvema kolescema bi bilo kod le $100$, zato so ključavnice z več kolesci varnejše.

## Preveri se

? Razvrsti korake postopka za preštevanje možnosti.
1. Ugotovi, v katerih korakih izbiraš.
2. Za vsak korak preštej, koliko izbir je na voljo.
3. Nariši drevo: iz vsake veje toliko novih vej, kolikor je izbir v naslednjem koraku.
4. Preštej konce zadnjih vej in preveri z množenjem.
5. Odgovori v stavku.
> Drevo narišeš šele, ko veš, koliko izbir je v vsakem koraku.

? Pri treh situacijah je vrstni red pomemben, pri eni ni. Katera ne sodi zraven?
- Šifra ključavnice iz dveh števk.
~ Šifra $12$ ni ista kot $21$, zato je vrstni red pomemben.
- Prvo in drugo mesto na tekmi.
~ Zmagati in biti drugi nista isto, vrstni red je pomemben.
+ Rokovanje dveh zdravnikov na sestanku.
- Dvomestno število iz dveh števk.
~ $12$ in $21$ sta različni števili, vrstni red je pomemben.
> Rokovanje Ane z Borom je isto kot rokovanje Bora z Ano, zato tak par štejemo samo enkrat.

? Drevo kaže izbiro vitamina C v lekarni: sirup ali tableta, vsak v treh okusih. Lekarna doda tretjo obliko, žvečljive bonbone v istih okusih. Kaj se zgodi?
:::risba skica
opis: Drevesni prikaz. Iz začetne točke vodita dve veji, sirup in tableta. Iz vsake vodijo tri veje za okuse jagoda, limona in malina. Na desni je šest koncev vej.
območje: 0; 0 .. 10; 6
črta: 0,5; 3 -> 3,5; 4,5
črta: 0,5; 3 -> 3,5; 1,5
črta: 3,5; 4,5 -> 6,5; 5,5
črta: 3,5; 4,5 -> 6,5; 4,5
črta: 3,5; 4,5 -> 6,5; 3,5
črta: 3,5; 1,5 -> 6,5; 2,5
črta: 3,5; 1,5 -> 6,5; 1,5
črta: 3,5; 1,5 -> 6,5; 0,5
točka: 0,5; 3 | začetek | pod
točka: 3,5; 4,5 | sirup | nad
točka: 3,5; 1,5 | tableta | pod
točka: 6,5; 5,5 | jagoda | desno
točka: 6,5; 4,5 | limona | desno
točka: 6,5; 3,5 | malina | desno
točka: 6,5; 2,5 | jagoda | desno
točka: 6,5; 1,5 | limona | desno
točka: 6,5; 0,5 | malina | desno
:::
- Vsaka veja dobi še eno vejico, možnosti je $8$.
~ Tako bi bilo, če bi dodali četrti okus: $2 \cdot 4 = 8$. Dodali pa smo obliko.
- Doda se ena konica, možnosti je $7$.
~ Nova oblika prinese vse tri okuse, ne enega. Možnosti ne dobiš s prištevanjem ene.
+ Iz začetka zraste tretja veja s tremi vejicami, možnosti je $9$.
- Število možnosti se podvoji na $12$.
~ Podvojilo bi se, če bi se oblike podvojile z $2$ na $4$. Dodali smo le eno.
> Oblike so zdaj $3$, okusi ostanejo $3$: $3 \cdot 3 = 9$.

? Luka računa, koliko dvomestnih števil lahko sestavi iz števk $0$, $4$ in $7$, če se števka ne ponovi. **Korak 1:** za desetice so $3$ izbire. **Korak 2:** za enice ostaneta $2$ izbiri. **Korak 3:** $3 \cdot 2 = 6$ števil. Kje se je Luka zmotil?
+ korak 1
- korak 2
~ Za enice res ostaneta $2$ števki, tudi ničla je na mestu enic dovoljena.
- korak 3
~ Množenje je pravilno, napaka je že prej.
- nobeden
~ Število $04$ ni dvomestno, zato ena izbira odpade.
> Ničla ne sme na mesto desetic, zato sta za desetice le $2$ izbiri: $2 \cdot 2 = 4$ števila ($40$, $47$, $70$, $74$).

? Na oddelku dela $6$ medicinskih sester. Ob začetku izmene si vsaka z vsako natanko enkrat seže v roko. Koliko je rokovanj?
= 15
~ 30 | Vsako rokovanje si štel dvakrat: $6 \cdot 5 = 30$ moraš še deliti z $2$.
~ 36 | Pri $6 \cdot 6$ si štel tudi rokovanje s samo sabo in vsak par dvakrat.
~ 21 | Prva sestra se rokuje s $5$ drugimi, ne s $6$: $5 + 4 + 3 + 2 + 1$.
> $5 + 4 + 3 + 2 + 1 = 15$ ali $6 \cdot 5 : 2 = 15$.

<<RACUN
vrednost: 2*3 | 6
vrednost: 3*3 | 9
vrednost: 3*2 | 6
vrednost: 2+1+0 | 3
vrednost: 4+3+2+1 | 10
vrednost: 5*4/2 | 10
vrednost: 3*2*1 | 6
vrednost: 2*3*2 | 12
vrednost: 10^3 | 1000
vrednost: 2*2 | 4
vrednost: 6*5/2 | 15
vrednost: 5+4+3+2+1 | 15
>>

:::simboli
N | število vseh možnosti | N = a \cdot b \cdot c | | pravilo produkta, če število izbir ni odvisno od prejšnje izbire
a | število izbir v 1. koraku | |
b | število izbir v 2. koraku | |
c | število izbir v 3. koraku | |
:::
