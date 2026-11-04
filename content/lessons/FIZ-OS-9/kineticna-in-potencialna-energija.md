---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pri tehniki zabijaš žeblje v ptičjo hišico. Kladivo ima maso $0{,}5\,\text{kg}$. Lahko ga samo spustiš na žebelj z višine $30\,\text{cm}$. Lahko pa z njim zamahneš, da udari s hitrostjo $5\,\frac{\text{m}}{\text{s}}$. Kateri udarec zabije žebelj globlje in kolikokrat?

Občutek ti pove, da zamah. Fizika zna povedati tudi, *kolikokrat*. Kladivo opravi delo na žeblju, ker ima **energijo**: zmožnost, da opravi delo. Energijo merimo v enakih enotah kot delo, v joulih ($\mathrm{J}$). Ko jo znaš izračunati, napoveš, kako močno udari kladivo, kako hitro pade opeka z odra ali s katere višine mora pasti utež zabijača pilotov.

## Razlaga

**1. Staro: delo pri dviganju.** Že veš, da pri enakomernem dviganju premagaš težo $F_g = m g$ po poti $h$. Opravljeno delo je $A = m g h$ (računamo z $g = 10\,\frac{\text{N}}{\text{kg}}$). Zidar dvigne opeko z maso $2\,\text{kg}$ na oder, visok $3\,\text{m}$, in opravi $60\,\text{J}$ dela.

**2. Novo: potencialna energija.** Kam je šlo teh $60\,\text{J}$? Opeka jih »hrani«. Če pade z odra, lahko na tleh nekaj zdrobi, torej lahko opravi delo. Energijo, ki jo ima telo zaradi **višine**, imenujemo **potencialna (težnostna) energija**:

$$W_p = m g h$$

Formula je ista kot za delo pri dviganju. Razlika je v pomenu: delo $A$ opisuje, kaj se *dogaja* med dviganjem, potencialna energija $W_p$ pa, kaj ima opeka, ko že *leži* na odru. Višino $h$ merimo od **ničelne ravni**, ki jo izberemo sami, običajno tla ali najnižjo točko gibanja. Opeka na odru ima glede na tla $60\,\text{J}$, glede na oder pa $0\,\text{J}$.

**3. Kinetična energija.** Tudi kladivo, ki leti proti žeblju, lahko opravi delo, čeprav je skoraj pri tleh. Ima energijo zaradi **gibanja**, **kinetično energijo**:

$$W_k = \frac{m v^2}{2}$$

Hitrost $v$ je v $\frac{\text{m}}{\text{s}}$, masa v $\text{kg}$, energija v $\text{J}$. Primerjaj obe energiji:

| | $W_p$ | $W_k$ |
|---|---|---|
| zaradi | višine | gibanja |
| formula | $m g h$ | $\frac{m v^2}{2}$ |
| $h$ ali $v$ $2\times$ | $2\times$ več | $4\times$ več |
| nič, ko | $h = 0$ | $v = 0$ |

Ključna razlika je v tretji vrstici: višina je v formuli na prvo potenco, hitrost pa **kvadrirana**. Potencialna energija je nič na ničelni ravni, kinetična, ko telo miruje.

:::premisli
Kladivo pri $5\,\frac{\text{m}}{\text{s}}$ ima premalo energije. Kolikokrat hitreje moraš zamahniti, da ima štirikrat več kinetične energije: štirikrat ali manj? Napovej, nato preveri z računom.
---
Dvakrat hitreje, z $10\,\frac{\text{m}}{\text{s}}$, ker je $2^2 = 4$. Pri $5\,\frac{\text{m}}{\text{s}}$ ima $6{,}25\,\text{J}$, pri $10\,\frac{\text{m}}{\text{s}}$ pa $\frac{0{,}5 \cdot 100}{2} = 25\,\text{J}$.
:::

**4. Odgovor na vprašanje z začetka.** Spuščeno kladivo ima na višini $30\,\text{cm} = 0{,}3\,\text{m}$ potencialno energijo $W_p = 0{,}5 \cdot 10 \cdot 0{,}3 = 1{,}5\,\text{J}$. Kladivo z zamahom ima $W_k = \frac{0{,}5 \cdot 25}{2} = 6{,}25\,\text{J}$. Zamah ima približno štirikrat več energije, zato žebelj zabije globlje.

**5. Pretvarjanje energije.** Ko kladivo pade z odra, se višina manjša, hitrost pa veča: potencialna energija se pretvarja v kinetično. Če upor zraka zanemarimo, njuna vsota ostane enaka. Kladivo z maso $0{,}5\,\text{kg}$ pade z odra, visokega $20\,\text{m}$:

| Višina | $W_p$ | $W_k$ | Vsota |
|---|---|---|---|
| $20\,\text{m}$ | $100\,\text{J}$ | $0\,\text{J}$ | $100\,\text{J}$ |
| $10\,\text{m}$ | $50\,\text{J}$ | $50\,\text{J}$ | $100\,\text{J}$ |
| $0\,\text{m}$ | $0\,\text{J}$ | $100\,\text{J}$ | $100\,\text{J}$ |

Vsoto $W_k + W_p$ imenujemo **mehanska energija**. To, da je ves čas enaka, je **ohranitev mehanske energije**. Energija ne izgine, samo spremeni obliko.

**6. Hitrost na dnu.** Če telo spustimo z višine $h$ iz mirovanja, se vsa potencialna energija pretvori v kinetično:

$$m g h = \frac{m v^2}{2}$$

Masa je na obeh straneh, zato se pokrajša: $g h = \frac{v^2}{2}$, torej $v^2 = 2 g h$ in $v = \sqrt{2 g h}$. Za kladivo z $20\,\text{m}$ dobimo $v = \sqrt{400} = 20\,\frac{\text{m}}{\text{s}}$, kar je $72\,\frac{\text{km}}{\text{h}}$. Isto hitrost bi dobil iz prostega pada ($v = g t$ po $t = 2\,\text{s}$), le da pri energiji časa ne potrebuješ.

:::premisli
Z odra hkrati padeta kladivo z maso $0{,}5\,\text{kg}$ in opeka z maso $2\,\text{kg}$. Opeka ima štirikrat več potencialne energije. Ali zato prileti na tla hitreje? Napovej, nato razloži z energijo.
---
Ne, obe priletita z enako hitrostjo. Opeka ima štirikrat več potencialne energije, a ima tudi štirikrat večjo maso, ki jo mora spraviti v gibanje. Obe energiji sta sorazmerni z maso, zato se masa pokrajša in $v = \sqrt{2 g h}$ je za obe enaka.
:::

**7. Trenje.** Pri drsenju po hrapavi podlagi se del mehanske energije pretvori v **notranjo energijo**: podlaga in telo se segrejeta. Vsota $W_k + W_p$ se zato zmanjšuje, celotna energija pa se še vedno ohrani.

V simulaciji spodaj (»Kinetična in potencialna energija«) nastavi začetno višino $5\,\text{m}$, trenje »brez« in pritisni »Spusti«. Opazuj stolpce $E_p$, $E_k$ in »skupaj« (simulacija energije označuje z $E$, mi z $W$): višina stolpca »skupaj« se ne spremeni. Nato povečaj trenje in opazuj, kako raste stolpec $Q$, notranja energija.

## Rešeni primeri

### Primer 1: opeka na odru

Opeka z maso $2\,\text{kg}$ leži na odru, ki je $3\,\text{m}$ nad tlemi. Kolikšna je njena potencialna energija glede na tla? Vzemi $g = 10\,\frac{\text{N}}{\text{kg}}$.

**Podatki:** $m = 2\,\text{kg}$, $h = 3\,\text{m}$ (tla so ničelna raven), $g = 10\,\frac{\text{N}}{\text{kg}}$
**Iščemo:** potencialno energijo $W_p$

:::formula
$W_p = m g h$
:::

**Rešitev:**

1. Energija je zaradi višine, zato uporabimo $W_p = m g h$.
2. Vstavimo: $W_p = 2 \cdot 10 \cdot 3 = 60\,\text{J}$.
3. Preverimo enote: $\text{kg} \cdot \frac{\text{N}}{\text{kg}} \cdot \text{m} = \text{N} \cdot \text{m} = \text{J}$.
4. Odgovor: opeka ima glede na tla $60\,\text{J}$ potencialne energije, natanko toliko, kot je bilo delo pri dviganju.

### Primer 2: kolesar

Kolesar z maso (skupaj s kolesom) $80\,\text{kg}$ vozi s hitrostjo $5\,\frac{\text{m}}{\text{s}}$. Kolikšna je njegova kinetična energija? Kolikšna bi bila pri dvakrat večji hitrosti?

**Podatki:** $m = 80\,\text{kg}$ (kolesar s kolesom), $v_1 = 5\,\frac{\text{m}}{\text{s}}$, $v_2 = 10\,\frac{\text{m}}{\text{s}}$
**Iščemo:** kinetični energiji $W_{k1}$ in $W_{k2}$

:::formula
$W_k = \dfrac{m v^2}{2}$
:::

**Rešitev:**

1. Energija je zaradi gibanja, zato uporabimo $W_k = \dfrac{m v^2}{2}$.
2. Najprej kvadriramo samo hitrost, ne mase: $v_1^2 = 5^2 = 25$.
3. Vstavimo: $W_{k1} = \dfrac{80 \cdot 25}{2} = \dfrac{2000}{2} = 1000\,\text{J}$.
4. Pri $v_2$: $v_2^2 = 100$, zato $W_{k2} = \dfrac{80 \cdot 100}{2} = 4000\,\text{J}$.
5. Odgovor: kolesar ima $1000\,\text{J}$ ($1\,\text{kJ}$) kinetične energije, pri dvakrat večji hitrosti pa $4000\,\text{J}$, torej štirikrat več.

### Primer 3: zabijač pilotov

Na gradbišču zabijajo betonske stebre (pilote) v tla. Žerjav dvigne utež z maso $400\,\text{kg}$ in jo spusti na pilot. S kolikšne višine nad pilotom jo mora spustiti, da udari s hitrostjo $8\,\frac{\text{m}}{\text{s}}$? Kolikšno energijo ima ob udarcu? Trenje in upor zraka zanemarimo, $g = 10\,\frac{\text{N}}{\text{kg}}$.

**Podatki:** $m = 400\,\text{kg}$, $v = 8\,\frac{\text{m}}{\text{s}}$, začetna hitrost $0$, $g = 10\,\frac{\text{N}}{\text{kg}}$, brez trenja in upora
**Iščemo:** višino $h$ in kinetično energijo $W_k$ ob udarcu

:::formula
Ohranitev energije: $m g h = \dfrac{m v^2}{2}$, torej $h = \dfrac{W_k}{m g}$
:::

**Rešitev:**

1. **Energija ob udarcu.** $W_k = \dfrac{400 \cdot 64}{2} = 12\,800\,\text{J}$.
2. **Energija na vrhu.** Utež tam miruje, zato ima samo potencialno energijo. Ker se mehanska energija ohrani, je $W_p = 12\,800\,\text{J}$.
3. **Višina.** Iz $W_p = m g h$ izrazimo $h$: $h = \dfrac{12\,800}{400 \cdot 10} = 3{,}2\,\text{m}$.
4. **Preverimo** brez mase: $h = \dfrac{v^2}{2 g} = \dfrac{64}{20} = 3{,}2\,\text{m}$. Masa za višino res ni pomembna.
5. Odgovor: žerjav mora utež spustiti z višine $3{,}2\,\text{m}$ nad pilotom; ob udarcu ima $12\,800\,\text{J}$ ($12{,}8\,\text{kJ}$) energije.

### Primer 4: zdaj ti

Otrok z maso $30\,\text{kg}$ se iz mirovanja spusti po toboganu, visokem $2\,\text{m}$. Trenje zanemarimo, $g = 10\,\frac{\text{N}}{\text{kg}}$. Kolikšna je njegova hitrost na dnu?

**Podatki:** $m = 30\,\text{kg}$, $h = 2\,\text{m}$, začetna hitrost $0$, brez trenja, $g = 10\,\frac{\text{N}}{\text{kg}}$
**Iščemo:** hitrost $v$ na dnu

:::formula
$m g h = \dfrac{m v^2}{2}$, torej $v = \sqrt{2 g h}$
:::

**Rešitev:**

1. Na vrhu: $W_k = 0$, $W_p = 30 \cdot 10 \cdot 2 = 600\,\text{J}$.
2. Na dnu je $W_p = 0$, zato je vsa energija kinetična: $W_k = 600\,\text{J}$.
3. Iz $W_k = \dfrac{m v^2}{2}$ izračunaj $v^2$, nato $v$. Preveri še s $v = \sqrt{2 g h}$.

:::premisli
Kolikšna je hitrost otroka na dnu?
---
$v^2 = \dfrac{2 \cdot 600}{30} = 40$, zato $v = \sqrt{40} \approx 6{,}3\,\frac{\text{m}}{\text{s}}$. Enako da $\sqrt{2 \cdot 10 \cdot 2} = \sqrt{40}$.
:::

## Pogoste napake

- **Hitrost ni kvadrirana.** Kdor računa $\frac{m v}{2}$, dobi za kolesarja $200\,\text{J}$ namesto $1000\,\text{J}$ in misli, da dvakrat večja hitrost pomeni dvakrat več energije. Kvadrira se samo $v$, ne $m \cdot v$; pri dvakrat večji hitrosti je energija štirikrat večja.
- **Mešanje obeh formul.** Pri $W_k$ delimo z $2$, pri $W_p$ ne. Pri $W_p$ je zraven $g$: kdor vzame samo $m h$, računa z maso namesto s težo in dobi desetkrat premalo.
- **Napačne enote.** Masa mora biti v $\text{kg}$ (ne v $\text{g}$), višina v $\text{m}$ (ne v $\text{cm}$), hitrost v $\frac{\text{m}}{\text{s}}$ (ne v $\frac{\text{km}}{\text{h}}$). Najprej pretvori.
- **»Težje telo pade hitreje.«** Ima res več energije, a tudi več mase. Brez upora zraka vsa telesa z iste višine priletijo z enako hitrostjo $\sqrt{2 g h}$.
- **»Pri trenju energija izgine«** ali obratno **»mehanska energija se vedno ohrani«**. Pri trenju se del mehanske energije pretvori v notranjo energijo. Mehanska se zmanjša, celotna ostane enaka.

## Povzetek

- Energija je zmožnost telesa, da opravi delo; merimo jo v joulih ($\mathrm{J}$).
- Potencialna (težnostna) energija zaradi višine: $W_p = m g h$; $h$ merimo od izbrane ničelne ravni. Enaka je delu pri dviganju.
- Kinetična energija zaradi gibanja: $W_k = \dfrac{m v^2}{2}$; pri dvakrat večji hitrosti je štirikrat večja.
- Brez trenja in upora se $W_p$ pretvarja v $W_k$ in obratno, vsota $W_k + W_p$ ostane enaka.
- Hitrost telesa, spuščenega z višine $h$ iz mirovanja: $v = \sqrt{2 g h}$, neodvisna od mase.
- Pri trenju se del mehanske energije pretvori v notranjo energijo.

## Drugače: Na sliki

Predstavljaj si energijo kot vodo v dveh kozarcih, ki stojita drug ob drugem: levi kozarec je $W_p$, desni $W_k$.

- Kladivo na odru: levi kozarec je poln, desni prazen.
- Med padanjem se voda preliva iz levega v desnega. Če pogledaš oba skupaj, je vode ves čas enako.
- Tik nad tlemi: levi je prazen, desni poln.

Kozarca se lahko prelivata tudi nazaj: žoga, ki odskoči, spet pridobi višino. Trenje je kot majhna luknja v cevki med kozarcema: nekaj vode kaplja ven (notranja energija). V kozarcih je zato skupaj vedno manj vode. Na tleh pod njima pa je ravno toliko vode, kolikor je manjka v kozarcih.

## Drugače: Iz vsakdanjega življenja

**Gugalnica.** Na najvišji točki se za hip ustavi: tam ima največ potencialne in nič kinetične energije. Pri dnu je najhitrejša, tam ima največ kinetične energije. Brez odrivanja se zaradi upora zraka in trenja v ležajih vsak zamah malo zmanjša.

**Avto in zavorna pot.** Pri $60\,\frac{\text{km}}{\text{h}}$ ima avto štirikrat več kinetične energije kot pri $30\,\frac{\text{km}}{\text{h}}$. Zavore morajo to energijo spremeniti v notranjo energijo, zato je zavorna pot pri enakem zaviranju približno štirikrat daljša.

**Hidroelektrarna.** Voda za jezom ima potencialno energijo. Ko teče navzdol po ceveh, se ta pretvori v kinetično, voda zavrti turbino in generator jo spremeni v električno energijo.

## Drugače: Bolj natančno

Zakaj je v kinetični energiji ravno $\frac{m v^2}{2}$? Iz prostega pada veš, da telo, spuščeno iz mirovanja, po času $t$ pade za $h = \frac{g t^2}{2}$ in ima hitrost $v = g t$. Izgubljena potencialna energija je

$$m g h = m g \cdot \frac{g t^2}{2} = \frac{m (g t)^2}{2} = \frac{m v^2}{2}.$$

Vsa izgubljena potencialna energija se je torej pojavila kot $\frac{m v^2}{2}$. Enota se ujema: $1\,\text{J} = 1\,\text{N} \cdot \text{m} = 1\,\frac{\text{kg} \cdot \text{m}^2}{\text{s}^2}$.

## Preveri se

? Katera vrstica pravilno pove, od česa je odvisna energija telesa?
- kinetična: masa in višina; potencialna: masa in hitrost
~ Zamenjal si ju. »Kinetična« pomeni gibalna, zato je odvisna od hitrosti; potencialna je odvisna od višine.
+ kinetična: masa in hitrost; potencialna: masa, $g$ in višina
- kinetična: samo hitrost; potencialna: samo višina
~ Obe sta odvisni tudi od mase: težje kladivo pri isti hitrosti ali višini opravi več dela.
> $W_k = \dfrac{m v^2}{2}$ vsebuje maso in hitrost, $W_p = m g h$ pa maso, $g$ in višino.

? Žebelj se zabije globlje, če kladivo zamahneš dvakrat hitreje. Zakaj se kinetična energija kladiva pri tem početveri?
- Se ne početveri, ampak le podvoji.
~ To bi veljalo, če hitrost v formuli ne bi bila kvadrirana.
+ Ker je hitrost v formuli kvadrirana: $2^2 = 4$.
- Ker se pri večji hitrosti poveča tudi masa kladiva.
~ Masa kladiva je ves čas enaka; spremeni se samo hitrost.
- Ker kladivo pri hitrejšem zamahu dobi še potencialno energijo.
~ Višina zamaha ni bistvena; razlika je v hitrosti ob udarcu.
> $W_k = \dfrac{m v^2}{2}$: če $v$ podvojiš, se $v^2$ početveri, zato se početveri tudi $W_k$.

? Brez računanja oceni: kaj ima več kinetične energije, opeka z maso $2\,\text{kg}$ pri hitrosti $4\,\frac{\text{m}}{\text{s}}$ ali kladivo z maso $0{,}5\,\text{kg}$ pri hitrosti $8\,\frac{\text{m}}{\text{s}}$?
- Opeka, ker je štirikrat težja.
~ Masa je res štirikrat večja, a dvakrat večja hitrost kladiva da štirikrat večji $v^2$.
- Kladivo, ker je hitrost pomembnejša od mase.
~ Hitrost je kvadrirana, a dvakrat večja hitrost da le štirikrat več, toliko kot štirikrat večja masa.
+ Obe imata enako.
> Kladivo ima štirikrat manjšo maso, a štirikrat večji $v^2$. Obe imata $16\,\text{J}$: $\dfrac{2 \cdot 16}{2} = \dfrac{0{,}5 \cdot 64}{2}$.

? Kamen z maso $1{,}5\,\text{kg}$ pade z zidu in ima tik pred tlemi kinetično energijo $90\,\text{J}$. S kolikšne višine je padel? Upor zraka zanemari, $g = 10\,\frac{\text{N}}{\text{kg}}$.
- $60\,\text{m}$
~ To je $\dfrac{90}{1{,}5}$: pozabil si $g$. Potencialna energija je $m g h$, ne $m h$.
+ $6\,\text{m}$
- $3\,\text{m}$
~ Delil si še z $2$, kot pri kinetični energiji. V $W_p = m g h$ ni polovice.
> Vsa potencialna energija se je pretvorila v kinetično: $m g h = 90\,\text{J}$, zato $h = \dfrac{90}{1{,}5 \cdot 10} = 6\,\text{m}$.

? Po drči za gradbene odpadke zdrsne vreča z maso $20\,\text{kg}$ z višine $6\,\text{m}$. Spodaj ima hitrost $8\,\frac{\text{m}}{\text{s}}$. Koliko mehanske energije se je pretvorilo v notranjo energijo? ($g = 10\,\frac{\text{N}}{\text{kg}}$)
- $0\,\text{J}$, ker se mehanska energija vedno ohrani.
~ Mehanska energija se ohrani le brez trenja. Brez trenja bi bila hitrost spodaj približno $11\,\frac{\text{m}}{\text{s}}$.
- $640\,\text{J}$
~ To je kinetična energija spodaj, ne razlika med energijo na vrhu in spodaj.
+ $560\,\text{J}$
- $1200\,\text{J}$
~ To je vsa energija na vrhu. Del je ostal kot kinetična energija, ker vreča spodaj še drsi.
> Na vrhu: $W_p = 20 \cdot 10 \cdot 6 = 1200\,\text{J}$. Spodaj: $W_k = \dfrac{20 \cdot 64}{2} = 640\,\text{J}$. Razlika $560\,\text{J}$ se je zaradi trenja pretvorila v notranjo energijo (drča in vreča se segrejeta).

:::simboli
W_k | kinetična energija | W_k = \dfrac{m v^2}{2} | J
W_p | potencialna (težnostna) energija | W_p = m g h | J | merjena od izbrane ničelne ravni
A | delo pri dviganju | A = m g h | J | enako $W_p$ na končni višini
F_g | teža | F_g = m g | N
W_{k1}, W_{k2} | kinetična energija pri prvi in drugi hitrosti | | J
m | masa | | kg
v | hitrost | | m/s | pri padu z višine $h$: $v = \sqrt{2 g h}$
v_1, v_2 | prva in druga hitrost kolesarja | | m/s
g | težni pospešek | | N/kg | približno $10\,\mathrm{N/kg}$
h | višina nad ničelno ravnjo | | m
t | čas padanja | | s
:::
