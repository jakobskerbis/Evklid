---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Fizioterapevtka išče točko, v kateri mora podpreti trikotno ravnotežno desko, da se ne prevrne ne na eno ne na drugo stran. Reševalna služba išče mesto za helikoptersko bazo, ki bo enako daleč od treh bolnišnic. Obe iščeta »sredino« trikotnika.

Prvo vprašanje je v 3. stoletju pr. n. št. raziskoval Arhimed. Za trikotno ploščo je pokazal, da je točka ravnovesja v presečišču treh posebnih daljic, težiščnic. Že pred njim je Evklid v *Elementih* opisal, kako trikotniku narišeš krožnico skozi vsa tri oglišča in krožnico, ki se dotika vseh treh stranic. Ali fizioterapevtka in reševalna služba torej iščeta isto točko?

## Razlaga

Mamljiva misel je, da ima trikotnik eno samo sredino in da je vseeno, kako jo iščeš: iz oglišča narišeš črto »naravnost dol« na nasprotno stranico ali pa do njene sredine. Poglej sliko.

:::risba skica
opis: Ostrokotni trikotnik ABC z vodoravno stranico AB dolžine 8. Oglišče C je zgoraj, bližje B. Iz C vodita dve daljici do stranice AB: prva navpično, pravokotno na AB, z napisom v z indeksom c; druga do sredine M stranice AB, z napisom t z indeksom c. Daljici pristaneta v različnih točkah. Daljici AM in MB merita po 4.
območje: -1; -1,2 .. 9; 6
lik: 0; 0 -> 8; 0 -> 7; 5 | modra zaprto
črta: 7; 5 -> 7; 0 | oranžna
pravikot: 7; 0 | 0; 0 | 7; 5
črta: 7; 5 -> 4; 0 | zelena črtkano
točka: 0; 0 | A | levo
točka: 8; 0 | B | desno
točka: 7; 5 | C | nad
točka: 4; 0 | M | pod
napis: 2; 0 | 4 | pod
napis: 6; 0 | 4 | pod
napis: 7; 2,5 | v_c | desno
napis: 5,5; 2,5 | t_c | levo
:::

Iz oglišča $C$ vodita dve različni daljici. Ena pade na stranico $AB$ pod pravim kotom, druga doseže njeno sredino $M$. Pristaneta v različnih točkah, torej nista ista črta. Prva je **višina**, druga **težiščnica**. Vsaka vrsta črt ima svoje presečišče, zato ima trikotnik več »sredin«. Skupaj s simetralami stranic in simetralami kotov dobimo štiri **značilne točke**.

**Višine.** Višina je daljica iz oglišča, ki je pravokotna na nasprotno stranico ali na njen podaljšek. Stranica $a$ leži nasproti oglišča $A$, $b$ nasproti $B$ in $c$ nasproti $C$. Višino na stranico $a$ označimo z $v_a$, na stranico $b$ z $v_b$, na stranico $c$ z $v_c$. Premice, na katerih ležijo višine (nosilke višin), se sekajo v eni točki. To je **višinska točka** $V$.

**Težiščnice.** Težiščnica povezuje oglišče z **razpoloviščem** (sredino) nasprotne stranice. Težiščnico iz $A$ označimo s $t_a$, ker gre do sredine stranice $a$. Vse tri se sekajo v **težišču** $T$; v njem je trikotna plošča v ravnovesju.

Tu se skriva druga napačna misel: težišče ni na polovici težiščnice. Deli jo v razmerju $2 : 1$, merjeno od oglišča. Če je $A_1$ razpolovišče stranice $a$, velja

$$|AT| = \frac{2}{3}\, t_a$$

$$|TA_1| = \frac{1}{3}\, t_a$$

**Simetrale stranic.** Simetrala daljice je premica, ki je na daljico pravokotna in gre skozi njeno sredino. Vsaka njena točka je enako oddaljena od obeh krajišč. Simetrale vseh treh stranic se sekajo v točki $O$, ki je zato enako oddaljena od vseh treh oglišč:

$$|OA| = |OB| = |OC| = R$$

Krožnica s središčem $O$ in polmerom $R$ gre skozi vsa tri oglišča. To je trikotniku **očrtana krožnica**.

**Simetrale kotov.** Simetrala kota ga razdeli na dva enaka dela. Vsaka njena točka je enako oddaljena od obeh krakov. Simetrale vseh treh notranjih kotov se sekajo v točki $S$, ki je enako oddaljena od vseh treh stranic. Razdalja od točke do stranice je dolžina pravokotnice iz točke na stranico. Razdalja od $S$ do stranic je polmer $r$ trikotniku **včrtane krožnice**, ki se dotika vseh treh stranic. Točka, kjer se krožnica dotakne stranice, je **dotikališče**: vznožje pravokotnice iz $S$.

:::premisli
Šestilo zapičiš v $S$ in ga razpreš do oglišča $A$. Ali bo krožnica včrtana? Napovej, preden nadaljuješ.
---
Ne. Oglišče je od $S$ dlje kot stranice, zato taka krožnica seka stranice in sega iz trikotnika. Polmer včrtane krožnice je razdalja od $S$ do dotikališča, ne do oglišča.
:::

**Kje ležijo točke.** Tretja napačna misel je, da je vsaka »sredina« znotraj trikotnika. Težiščnice in simetrale notranjih kotov potekajo od oglišča do nasprotne stranice po notranjosti trikotnika, zato sta $T$ in $S$ vedno notri. Višine in simetrale stranic pa lahko uidejo ven.

:::premisli
Oglišče $C$ potegneš tako, da kot $\gamma$ postane top. Napovej: ali središče očrtane krožnice ostane v trikotniku? Če ne, čez katero stranico zdrsne ven?
---
Ne. Središče $O$ zdrsne čez najdaljšo stranico $c$, ki leži nasproti topega kota, in pride iz trikotnika.
:::

| Točka | ostrokotni | pravokotni | topokotni |
|---|---|---|---|
| težišče $T$ | znotraj | znotraj | znotraj |
| središče včrtane $S$ | znotraj | znotraj | znotraj |
| središče očrtane $O$ | znotraj | sredina hipotenuze | zunaj |
| višinska točka $V$ | znotraj | oglišče pravega kota | zunaj |

V pravokotnem trikotniku stranicama ob pravem kotu rečemo **kateti**, stranici nasproti pravega kota pa **hipotenuza**. Vsaka kateta je višina na drugo kateto, zato se višine sekajo v oglišču pravega kota. Simetrala vsake katete je vzporedna z drugo kateto in razpolovi tudi hipotenuzo, zato se simetrali sekata na sredini hipotenuze $c$. Tam je $O$, zato je $R = \dfrac{c}{2}$.

**Posebni trikotniki.** V enakostraničnem trikotniku je vsaka višina hkrati težiščnica, simetrala stranice in simetrala kota, zato vse štiri točke sovpadajo. V enakokrakem trikotniku to velja za višino na osnovnico; vse štiri točke ležijo na njeni nosilki, ki je os simetrije.

V simulaciji spodaj (**Značilne točke trikotnika**) vklopi vse štiri vrste črt in povleci oglišče $C$, da trikotnik postane topokoten. Opazuj, kateri dve točki prideta ven in kateri dve ostaneta notri.

## Rešeni primeri

### Primer 1 (lažji)

Fizioterapevtka ima trikotno ravnotežno desko. Težiščnica $t_a$ deske je dolga $15\,\text{cm}$. Desko mora podpreti v težišču $T$. Kako daleč je ta točka od oglišča $A$ in kako daleč od razpolovišča $A_1$ stranice $a$?

**Podatki:** $t_a = 15\,\text{cm}$, $A_1$ je razpolovišče stranice $a$
**Iščemo:** razdalji $|AT|$ in $|TA_1|$

:::formula
Težišče deli težiščnico v razmerju $2 : 1$ od oglišča: $|AT| = \dfrac{2}{3}\, t_a$, $|TA_1| = \dfrac{1}{3}\, t_a$
:::

**Rešitev:**

1. Težiščnico razdelimo na $2 + 1 = 3$ enake dele: $15\,\text{cm} : 3 = 5\,\text{cm}$.
2. Od oglišča do težišča sta dva dela: $|AT| = 2 \cdot 5\,\text{cm} = 10\,\text{cm}$.
3. Od težišča do sredine stranice je en del: $|TA_1| = 5\,\text{cm}$.
4. Preverimo: $10\,\text{cm} + 5\,\text{cm} = 15\,\text{cm}$ in $10 : 5 = 2 : 1$. ✓
5. Odgovor: podpora mora biti $10\,\text{cm}$ od oglišča $A$ in $5\,\text{cm}$ od razpolovišča stranice $a$.

### Primer 2 (srednji)

Tri zdravstvene postaje stojijo v ogliščih trikotnika $ABC$ s kotoma $\alpha = 35^\circ$ in $\beta = 25^\circ$. Ugotovi, ali ležijo težišče $T$, središče včrtane krožnice $S$, središče očrtane krožnice $O$ in višinska točka $V$ znotraj ali zunaj trikotnika.

**Podatki:** $\alpha = 35^\circ$, $\beta = 25^\circ$
**Iščemo:** kot $\gamma$, vrsto trikotnika glede na kote in lego točk $T$, $S$, $O$, $V$

:::formula
$\gamma = 180^\circ - \alpha - \beta$; pri topokotnem trikotniku ležita $O$ in $V$ zunaj, $T$ in $S$ pa sta vedno znotraj.
:::

**Rešitev:**

1. Izračunamo tretji kot: $\gamma = 180^\circ - 35^\circ - 25^\circ = 120^\circ$.
2. Ker je $\gamma = 120^\circ > 90^\circ$, je trikotnik **topokotni**.
3. Težišče $T$ in središče včrtane krožnice $S$ sta vedno znotraj.
4. Simetrale stranic se sekajo zunaj, onkraj najdaljše stranice $c$, ki leži nasproti topega kota.
5. Višini $v_a$ in $v_b$ padeta na podaljška stranic. Nosilke višin se sekajo zunaj trikotnika, za ogliščem $C$.
6. Odgovor: $\gamma = 120^\circ$, trikotnik je topokotni; $T$ in $S$ ležita znotraj, $O$ in $V$ pa zunaj. Skladišče, enako oddaljeno od vseh treh postaj, bi stalo zunaj trikotnika med njimi.

### Primer 3 (težji)

Tri bolnišnice $A$, $B$ in $C$ ležijo v ogliščih trikotnika s pravim kotom pri $C$. Bolnišnici $A$ in $B$ sta $12\,\text{km}$ narazen. Helikopterska baza naj bo enako oddaljena od vseh treh bolnišnic. Kje naj stoji in kako daleč bo od vsake? Kje je višinska točka in kako daleč od $C$ je težišče?

**Podatki:** $\gamma = 90^\circ$, $c = |AB| = 12\,\text{km}$
**Iščemo:** lego baze $O$ in polmer $R$, lego točke $V$, razdaljo $|CT|$

:::formula
V pravokotnem trikotniku je $O$ na razpolovišču hipotenuze, $R = \dfrac{c}{2}$; $V$ je v oglišču pravega kota; $|CT| = \dfrac{2}{3}\, t_c$.
:::

**Rešitev:**

1. Točka, enako oddaljena od vseh treh oglišč, je središče očrtane krožnice $O$. V pravokotnem trikotniku leži na razpolovišču hipotenuze, označimo ga s $C_1$.
2. Polmer: $R = \dfrac{c}{2} = \dfrac{12\,\text{km}}{2} = 6\,\text{km}$. Toliko je baza oddaljena od $A$, $B$ in tudi od $C$.
3. Kateti sta pravokotni, zato je vsaka višina na drugo; obe gresta skozi $C$. Višinska točka je $V = C$.
4. Težiščnica $t_c$ povezuje $C$ z razpoloviščem $C_1$ hipotenuze, ki je ravno točka $O$. Torej je $t_c = |CO| = 6\,\text{km}$.
5. Težišče deli težiščnico v razmerju $2 : 1$: $|CT| = \dfrac{2}{3} \cdot 6\,\text{km} = 4\,\text{km}$.
6. Odgovor: baza naj stoji na sredini daljice med bolnišnicama $A$ in $B$, od vsake bolnišnice bo oddaljena $6\,\text{km}$. Višinska točka je v $C$, težišče je od $C$ oddaljeno $4\,\text{km}$.

### Primer 4 – zdaj ti

Težišče trikotnika je od oglišča $B$ oddaljeno $14\,\text{cm}$. Kako dolga je težiščnica $t_b$ in kako daleč je težišče od razpolovišča $B_1$ stranice $b$?

**Podatki:** $|BT| = 14\,\text{cm}$
**Iščemo:** $t_b$ in $|TB_1|$

:::formula
$|BT| = \dfrac{2}{3}\, t_b$, $|TB_1| = \dfrac{1}{3}\, t_b$
:::

**Rešitev:**

1. Od oglišča do težišča sta dva od treh enakih delov težiščnice.
2. En del meri $14\,\text{cm} : 2 = 7\,\text{cm}$.
3. Izračunaj sam $|TB_1|$ in $t_b$, nato preveri:

:::premisli
Koliko merita $|TB_1|$ in $t_b$?
---
$|TB_1|$ je en del, torej $7\,\text{cm}$. Težiščnica ima tri dele: $t_b = 3 \cdot 7\,\text{cm} = 21\,\text{cm}$. Preizkus: $14\,\text{cm} + 7\,\text{cm} = 21\,\text{cm}$.
:::

## Pogoste napake

- **Zamenjava višine in težiščnice.** Obe potegnemo iz oglišča na nasprotno stranico, zato sta si na skici podobni. Pravilno: višina je na stranico **pravokotna**, težiščnica gre do **sredine** stranice. Sovpadata le, kadar ju narišemo na osnovnico enakokrakega trikotnika, in v enakostraničnem trikotniku.
- **Zamenjava simetrale stranice in simetrale kota.** Obe sta »simetrali«, zato ju učenec pomeša. Pravilno: simetrale **stranic** dajo središče **očrtane** krožnice (enaka razdalja do oglišč), simetrale **kotov** pa središče **včrtane** krožnice (enaka razdalja do stranic).
- **Napačen polmer včrtane krožnice.** Učenec razpre šestilo od $S$ do oglišča, ker se mu zdi, da mora krožnica »doseči« oglišča. Takšna krožnica seka stranice. Pravilno: iz $S$ nariši pravokotnico na stranico; razdalja do njenega vznožja je polmer $r$.
- **Težišče na polovici težiščnice.** Ker gre težiščnica do sredine stranice, se zdi, da je tudi težišče »na sredini«. Pravilno: od oglišča do težišča sta **dve tretjini** težiščnice. Pri $t_a = 9\,\text{cm}$ je $|AT| = 6\,\text{cm}$, ne $4{,}5\,\text{cm}$.
- **»Vse značilne točke so znotraj.«** Pri topokotnem trikotniku učenec išče $O$ in $V$ v notranjosti ali višine izpusti, ker ne padejo na stranico. Pravilno: stranico podaljšaj in nanjo nariši pravokotnico iz oglišča; $O$ in $V$ sta zunaj trikotnika.

## Povzetek

- Nosilke višin (pravokotnic iz oglišča na nasprotno stranico ali njen podaljšek) se sekajo v višinski točki $V$.
- Težiščnice (iz oglišča do sredine nasprotne stranice) se sekajo v težišču $T$, ki jih deli v razmerju $2 : 1$ od oglišča: $|AT| = \dfrac{2}{3}\, t_a$.
- Simetrale stranic se sekajo v središču $O$ očrtane krožnice: $|OA| = |OB| = |OC| = R$.
- Simetrale kotov se sekajo v središču $S$ včrtane krožnice; polmer $r$ je razdalja od $S$ do stranice.
- $T$ in $S$ sta vedno znotraj trikotnika; $O$ in $V$ sta znotraj pri ostrokotnem, zunaj pri topokotnem trikotniku.
- Pri pravokotnem trikotniku je $V$ v oglišču pravega kota, $O$ pa na razpolovišču hipotenuze, zato $R = \dfrac{c}{2}$.
- V enakostraničnem trikotniku vse štiri točke sovpadajo.

## Drugače: Kot zgodba

Pred zdravstvenim domom je trikoten park. Štirje ljudje bi v njem radi nekaj postavili »na sredino«.

Vrtnar želi čim večjo okroglo gredico, ki se dotika vseh treh poti ob robu. Razpolovi kote parka in dobi točko $S$. Kipar želi trikotno kamnito ploščo postaviti na en sam steber. Poveže vsak vogal s sredino nasprotne poti in dobi težišče $T$. Reševalec želi postajo, ki je enako daleč od vseh treh vogalov, kjer so vhodi. Nariše simetrale poti in dobi točko $O$. Geodet iz vsakega vogala spusti pravokotnico na nasprotno pot in dobi točko $V$.

Štiri točke, štiri različna mesta. Nekega dne park razširijo, vogal $C$ se odmakne in kot pri njem postane top. Vrtnar in kipar ostaneta v parku. Reševalčeva točka $O$ in geodetova točka $V$ pa sta zdaj na parkirišču zunaj parka.

## Drugače: Korak za korakom s številkami

Recept, s katerim na enem trikotniku preveriš skoraj vsa pravila:

1. Nariši trikotnik s stranicami $a = 6\,\text{cm}$, $b = 8\,\text{cm}$, $c = 10\,\text{cm}$ (izrek sss).
2. Izmeri največji kot $\gamma$, nasproti najdaljše stranice. Dobiš $90^\circ$, trikotnik je pravokotni.
3. Nariši simetralo stranice $c$. Seka jo v razpolovišču, $5\,\text{cm}$ od $A$ in od $B$.
4. Nariši simetralo stranice $a$. Seka simetralo stranice $c$ prav v razpolovišču hipotenuze. To je $O$.
5. Izmeri $|OA|$, $|OB|$ in $|OC|$. Vse tri merijo $5\,\text{cm}$, zato je $R = 5\,\text{cm}$, polovica hipotenuze.
6. Nariši težiščnico $t_c$ od $C$ do $O$; meri $5\,\text{cm}$. Težišče je na dveh tretjinah od oglišča: $\dfrac{2}{3} \cdot 5\,\text{cm} \approx 3{,}3\,\text{cm}$ od $C$.
7. Višinska točka je v oglišču $C$, saj sta kateti $a$ in $b$ pravokotni.

## Preveri se

? Reševalna služba išče mesto za bazo, ki bo enako daleč od treh bolnišnic v ogliščih trikotnika. Katere črte mora narisati, da najde to točko?
- višine
~ Višine dajo višinsko točko $V$, ki v splošnem ni enako oddaljena od oglišč.
- težiščnice
~ Težiščnice dajo težišče $T$, točko ravnovesja, ki v splošnem ni enako oddaljena od oglišč.
+ simetrale stranic
- simetrale kotov
~ Simetrale kotov dajo središče $S$, ki je enako oddaljeno od stranic, ne od oglišč.
> Vsaka točka simetrale stranice je enako oddaljena od obeh krajišč te stranice. Presečišče $O$ simetral stranic je zato enako oddaljeno od vseh treh oglišč.

? Težiščnica $t_b$ meri $18\,\text{cm}$. Koliko centimetrov je težišče oddaljeno od oglišča $B$?
= 12 cm
~ 9 | Težišče ni na polovici težiščnice; od oglišča do težišča sta dve tretjini.
~ 6 | To je razdalja od težišča do sredine stranice $b$, ne do oglišča.
~ 27 | Težiščnico si pomnožil s $\frac{3}{2}$ namesto z $\frac{2}{3}$.
> $|BT| = \dfrac{2}{3} \cdot 18\,\text{cm} = 12\,\text{cm}$.

? Trikotnik ima pravi kot pri $C$. Oglišče $C$ premakneš tako, da kot $\gamma$ postane top. Kaj se zato zgodi z višinsko točko $V$?
- Ostane v oglišču $C$.
~ V oglišču leži $V$ le pri pravem kotu, ker sta tam kateti višini. Pri topem kotu to ne velja več.
- Premakne se v notranjost trikotnika.
~ V notranjosti je $V$ pri ostrokotnem trikotniku, ne pri topokotnem.
+ Premakne se iz trikotnika, za oglišče $C$.
> Pri topokotnem trikotniku dve višini padeta na podaljška stranic, zato se nosilke višin sekajo zunaj, za ogliščem s topim kotom.

? Luka je poskušal načrtati trikotniku včrtano krožnico. (1) Narisal je simetrali kotov $\alpha$ in $\beta$. (2) Njuno presečišče je označil s $S$. (3) Šestilo je zapičil v $S$ in ga razprl do oglišča $A$. (4) Narisal je krožnico. Na sliki je njegov izdelek. V katerem koraku je napaka?
:::risba skica
opis: Trikotnik ABC z vodoravno stranico AB. Iz A in B vodita črtkani simetrali kotov, ki se sekata v točki S znotraj trikotnika. Okoli S je narisana krožnica, ki gre skozi oglišče A, seka vse tri stranice in na več mestih sega iz trikotnika.
območje: -1; -2,5 .. 9; 6,5
lik: 0; 0 -> 8; 0 -> 3; 5 | modra zaprto
črta: 0; 0 -> 3,38; 1,91 | črtkano siva
črta: 8; 0 -> 3,38; 1,91 | črtkano siva
krog: 3,38; 1,91 | 3,88 | oranžna
točka: 3,38; 1,91 | S | desno
točka: 0; 0 | A | levo
točka: 8; 0 | B | desno
točka: 3; 5 | C | nad
:::
- v 1. koraku
~ Simetrali dveh kotov sta pravi začetek: njuno presečišče je središče včrtane krožnice.
- v 2. koraku
~ Presečišče simetral kotov je res središče $S$ včrtane krožnice.
+ v 3. koraku
- v 4. koraku
~ Krožnico je narisal pravilno z nastavljenim polmerom; napačen je bil že polmer.
> Polmer včrtane krožnice je razdalja od $S$ do stranice: iz $S$ nariši pravokotnico na stranico in razpri šestilo do njenega vznožja. Krožnica skozi oglišče seka stranice, kot vidiš na sliki.

? Razvrsti korake, s katerimi trikotniku načrtaš očrtano krožnico.
1. Nariši simetrali dveh stranic trikotnika.
2. Njuno presečišče označi z $O$.
3. Šestilo zapiči v $O$ in ga razpri do enega od oglišč.
4. Nariši krožnico in preveri, da gre skozi vsa tri oglišča.
> Simetrale stranic dajo točko, enako oddaljeno od oglišč. Šele ko imaš $O$, lahko nastaviš polmer $R$ do oglišča.

:::simboli
A, B, C | oglišča trikotnika | | |
a, b, c | stranice trikotnika | | cm | v pravokotnem trikotniku je $c$ hipotenuza
v_a, v_b, v_c | višine | | cm | $v_a$ je pravokotna na stranico $a$ ali njen podaljšek
V | višinska točka | | | presečišče nosilk višin
T | težišče | | | presečišče težiščnic; deli jih v razmerju $2 : 1$
t_a, t_b, t_c | težiščnice | | cm | $t_a$ gre iz $A$ do razpolovišča stranice $a$
A_1, B_1, C_1 | razpolovišča stranic $a$, $b$, $c$ | | |
O | središče očrtane krožnice | | | presečišče simetral stranic
R | polmer očrtane krožnice | | cm | razdalja od $O$ do vsakega oglišča; v pravokotnem trikotniku $R = c : 2$
S | središče včrtane krožnice | | | presečišče simetral notranjih kotov
r | polmer včrtane krožnice | | cm | razdalja od $S$ do stranice
\alpha | notranji kot pri oglišču $A$ | | °
\beta | notranji kot pri oglišču $B$ | | °
\gamma | notranji kot pri oglišču $C$ | \gamma = 180^\circ - \alpha - \beta | °
:::

<<RACUN
vrednost: 15/3 | 5
vrednost: 2*5 | 10
vrednost: 180-35-25 | 120
vrednost: 12/2 | 6
vrednost: 2/3*6 | 4
vrednost: 14/2 | 7
vrednost: 3*7 | 21
vrednost: 2/3*18 | 12
vrednost: 2/3*9 | 6
enako: 6^2+8^2 | 10^2
vrednost: 10/2 | 5
vrednost: 2/3*5 | 3.3
>>
