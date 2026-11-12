---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

**Prvi prizor: avgust ob morju.** Opoldne te pesek na plaži peče v podplate, morje je le prijetno toplo. Sonce je oboje grelo enako dolgo.

**Drugi prizor: zima v planinski koči.** Na gorilniku topiš sneg za čaj. Plamen gori, termometer v loncu pa več minut kaže $0\,^\circ\text{C}$. Temperatura se premakne šele, ko se stali ves sneg.

Prizora sta si na videz daleč narazen, skrivata pa isto spoznanje: **prejeta energija sama ne pove, za koliko se snov segreje.** Odvisno je od tega, katera snov je to, in od tega, ali se snov ravno tali ali izpareva.

Ugani, preden bereš naprej: energija, ki stali $1\,\text{kg}$ snega, bi segrela $1\,\text{kg}$ vode z $0\,^\circ\text{C}$ za koliko stopinj? Za $5$, za $20$ ali za $80$? Odgovor izračunaš v razlagi.

Pomagal bo zakon o ohranitvi energije iz 1. letnika.

## Razlaga

**1. Najprej en račun.** S potopnim grelnikom grejemo vodo v kampu. Meritev pokaže: $1\,\text{kg}$ vode se segreje za $1\,\text{K}$, ko prejme približno $4200\,\text{J}$ energije.

Koliko energije potrebujeta $2\,\text{kg}$ vode, da se segrejeta za $10\,\text{K}$? Vsak kilogram potrebuje svojih $4200\,\text{J}$ za vsak kelvin. Kilogramov je $2$, kelvinov $10$:

$$Q = 2 \cdot 10 \cdot 4200\,\text{J} = 84\,000\,\text{J}$$

Dvakrat več vode potrebuje dvakrat več energije, dvakrat večje segretje prav tako. Energija je sorazmerna z maso in s spremembo temperature.

**2. Toplota in notranja energija.** Energijo, ki preide z enega telesa na drugo **zaradi razlike temperatur**, imenujemo **toplota** $Q$. Merimo jo v joulih. Sama od sebe teče vedno s toplejšega telesa na hladnejše, tu z grelnika v vodo.

Kam gre ta energija? Voda je zgrajena iz molekul, ki se ves čas gibljejo in med seboj delujejo s silami. **Notranja energija** $W_n$ je vsota kinetičnih energij vseh delcev in potencialnih energij zaradi sil med njimi. Toplota, ki jo voda prejme, ji poveča notranjo energijo. Če ni dela (telo ga ne opravlja in tudi okolica ga ne opravlja na telesu), velja:

$$\Delta W_n = Q$$

Telo torej *ima* notranjo energijo, toplote pa nima. Toplota je energija na poti. Notranjo energijo lahko povečamo tudi z delom, na primer ko si drgnemo dlani.

**3. Posplošitev: specifična toplota.** Račun iz točke 1 velja za vsako snov, le število $4200$ je drugo. To število imenujemo **specifična toplota** $c$: pove, koliko toplote potrebuje $1\,\text{kg}$ snovi, da se segreje za $1\,\text{K}$. Za maso $m$ in spremembo temperature $\Delta T$:

$$Q = m\,c\,\Delta T$$

$$c = \frac{Q}{m\,\Delta T}$$

Enota za $c$ je $\text{J/(kg\,K)}$. Sprememba temperature je $\Delta T = t_2 - t_1$, končna minus začetna. Pri segrevanju je $Q > 0$, pri ohlajanju $Q < 0$: telo toploto oddaja. Razlika $1\,\text{K}$ je enaka razliki $1\,^\circ\text{C}$, zato pri $\Delta T$ stopinj ni treba pretvarjati v kelvine.

:::risba stolpci
opis: Stolpčni prikaz specifične toplote nekaterih snovi v kJ/(kg K): voda 4,2, led 2,1, aluminij 0,9, suh pesek 0,8, železo 0,45. Voda ima največjo, dvakrat večjo kot led in več kot petkrat večjo kot pesek.
podnapis: Specifična toplota c v kJ/(kg K); 4,2 kJ/(kg K) = 4200 J/(kg K)
os: c [kJ/(kg K)]
korak: 1
stolpec: voda | 4,2
stolpec: led | 2,1
stolpec: aluminij | 0,9
stolpec: pesek | 0,8
stolpec: železo | 0,45
:::

Voda ima med vsakdanjimi snovmi izjemno veliko specifično toploto. Zdaj razumemo plažo: enaka masa peska se ob enaki prejeti toploti segreje več kot petkrat bolj kot voda. To je glavni, a ne edini razlog: voda se še meša in izpareva.

:::risba graf
opis: Graf spremembe temperature ΔT v kelvinih v odvisnosti od prejete toplote Q v kilojoulih za m = {m} kg vode in m = {m} kg suhega peska. Obe črti sta premici skozi izhodišče; premica za pesek je več kot petkrat strmejša. Pri 40 kJ se voda segreje za {40/(4.2*m):.1} K, pesek za {40/(0.8*m):.1} K.
x: 0 .. 60 | 10 | Q [kJ]
y: 0 .. 70 | 10 | ΔT [K]
drsnik: m | 1 .. 3 | 0,5 | 1 | masa vode in peska v kg
f: 10*x/(42*m) | modra debelo | 0 .. 52
f: 10*x/(8*m) | oranžna črtkano | 0 .. 52
točka: 40; 400/(42*m) | voda | nad levo
točka: 40; 50/m | pesek | nad levo
podnapis: m = {m} kg; pri 40 kJ: voda {40/(4.2*m):.1} K, pesek {40/(0.8*m):.1} K
:::

Na sliki je $m = 1\,\text{kg}$: pri $40\,\text{kJ}$ se voda segreje za $9{,}5\,\text{K}$, pesek za $50\,\text{K}$. V aplikaciji premikaj drsnik $m$ proti $3\,\text{kg}$ in opazuj obe premici. Pri trikrat večji masi je segretje trikrat manjše, razmerje med peskom in vodo pa ostane enako, ker je odvisno samo od $c$.

:::premisli
V lonec z $1\,\text{kg}$ vode z $80\,^\circ\text{C}$ položiš $1\,\text{kg}$ železa z $20\,^\circ\text{C}$. Toplota naj ne uhaja v okolico. Napovej: bo skupna končna temperatura bliže $80\,^\circ\text{C}$ ali $20\,^\circ\text{C}$? Zakaj?
---
Bliže $80\,^\circ\text{C}$. Železo prejme toliko toplote, kolikor je voda odda. Voda ima približno $9$-krat večjo $c$, zato se njena temperatura ob isti toploti spremeni veliko manj kot temperatura železa.
:::

**4. Toplotna bilanca.** Preverimo napoved z računom: železo zdaj damo v vodo v **kalorimetru**, posodi z dobro toplotno izolacijo. Toplota teče iz vode v železo, dokler nimata enake končne temperature $t_k$. Ker energija ne uide, odda voda natanko toliko toplote, kolikor jo prejme železo:

$$Q_{\text{oddana}} = Q_{\text{prejeta}}$$

$$m_{\text{voda}}\,c_{\text{voda}}\,(t_{\text{voda}} - t_k) = m_{\text{Fe}}\,c_{\text{Fe}}\,(t_k - t_{\text{Fe}})$$

Na obeh straneh je pozitivna toplota: od večje temperature odštejemo manjšo. Z $c_{\text{voda}} = 4200\,\text{J/(kg\,K)}$ in $c_{\text{Fe}} = 450\,\text{J/(kg\,K)}$ za $1\,\text{kg}$ vsake snovi dobimo $4200\,(80 - t_k) = 450\,(t_k - 20)$. Člene s $t_k$ zberemo na eni strani:

$$t_k = \frac{4200 \cdot 80 + 450 \cdot 20}{4200 + 450}\,^\circ\text{C} = 74{,}2\,^\circ\text{C}$$

Voda se ohladi le za $5{,}8\,\text{K}$, železo se segreje za $54{,}2\,\text{K}$, toplota pa je na obeh straneh približno $24\,\text{kJ}$. V simulaciji »Toplotna bilanca pri mešanju« spodaj nastavi $m_1 = 1\,\text{kg}$ vode z $80\,^\circ\text{C}$ in za drugo snov $1\,\text{kg}$ železa z $20\,^\circ\text{C}$. Nato železo zamenjaj z vodo: končna temperatura je $50\,^\circ\text{C}$, točno na sredini, ker sta $m$ in $c$ na obeh straneh enaka.

**5. Ko temperatura obstane: fazni prehodi.** Vrnimo se k loncu snega. Gorilnik ves čas dovaja toploto, termometer pa stoji pri $0\,^\circ\text{C}$. Snov ravno spreminja **agregatno stanje** (trdnina, kapljevina, plin). Takim spremembam pravimo **fazni prehodi**:

- taljenje (trdnina $\to$ kapljevina) in obratno strjevanje,
- izparevanje (kapljevina $\to$ plin) in obratno kondenzacija; izparevanje poteka s površine pri vsaki temperaturi (morje, znoj), vrenje pa v vsej prostornini pri vrelišču,
- sublimacija (trdnina $\to$ plin) in obratno desublimacija.

:::risba skica
opis: Delci v treh agregatnih stanjih, vsako v svojem okvirju. Levo trdnina: 9 delcev v urejeni mreži 3 krat 3. V sredini kapljevina: 9 delcev skoraj tako blizu kot v trdnini, a neurejeno. Desno plin: 4 delci daleč narazen, vsak s puščico v drugo smer. Nad okvirji vodi puščica z napisom taljenje od trdnine h kapljevini in puščica z napisom izparevanje od kapljevine k plinu.
območje: 0; -0,8 .. 12; 4,9
enota: 24
pravokotnik: 0; 0 .. 3,4; 3,4
pravokotnik: 4,3; 0 .. 7,7; 3,4
pravokotnik: 8,6; 0 .. 12; 3,4
krog: 1; 1 | 0,3 | modra polno
krog: 1,7; 1 | 0,3 | modra polno
krog: 2,4; 1 | 0,3 | modra polno
krog: 1; 1,7 | 0,3 | modra polno
krog: 1,7; 1,7 | 0,3 | modra polno
krog: 2,4; 1,7 | 0,3 | modra polno
krog: 1; 2,4 | 0,3 | modra polno
krog: 1,7; 2,4 | 0,3 | modra polno
krog: 2,4; 2,4 | 0,3 | modra polno
krog: 4,8; 0,5 | 0,3 | modra polno
krog: 5,6; 0,55 | 0,3 | modra polno
krog: 6,4; 0,5 | 0,3 | modra polno
krog: 7,2; 0,6 | 0,3 | modra polno
krog: 5,15; 1,25 | 0,3 | modra polno
krog: 6; 1,3 | 0,3 | modra polno
krog: 6,85; 1,3 | 0,3 | modra polno
krog: 5,55; 2,05 | 0,3 | modra polno
krog: 6,45; 2,1 | 0,3 | modra polno
krog: 9,3; 2,6 | 0,3 | modra polno
krog: 11,2; 2,5 | 0,3 | modra polno
krog: 9,9; 0,8 | 0,3 | modra polno
krog: 11,3; 1,1 | 0,3 | modra polno
puščica: 9,3; 2,6 -> 9,9; 3,1
puščica: 11,2; 2,5 -> 11,7; 1,9
puščica: 9,9; 0,8 -> 9,2; 0,4
puščica: 11,3; 1,1 -> 10,6; 1,6
puščica: 2,4; 3,8 -> 5,3; 3,8 | taljenje | nad
puščica: 6,7; 3,8 -> 9,9; 3,8 | izparevanje | nad
napis: 1,7; -0,4 | trdnina | sredina
napis: 6; -0,4 | kapljevina | sredina
napis: 10,3; -0,4 | plin | sredina
:::

Slika pokaže, kam gre energija. Pri taljenju se urejena mreža podre, pri izparevanju se delci razmaknejo daleč narazen. Za to je treba premagati sile med delci, zato se poveča njihova **potencialna** energija. Ker gre energija v potencialno energijo, se povprečna kinetična energija delcev in s tem temperatura ne spremenita.

**6. Talilna in izparilna toplota.** Toplota za taljenje je sorazmerna z maso, ki se stali. Isto velja za izparevanje:

$$Q = m\,q_t$$

$$Q = m\,q_i$$

**Specifična talilna toplota** $q_t$ pove, koliko toplote potrebuje $1\,\text{kg}$ snovi za taljenje pri tališču, **specifična izparilna toplota** $q_i$ pa enako za izparevanje. Za vodo pri normalnem zračnem tlaku je $q_t \approx 334\,\text{kJ/kg}$ (pri $0\,^\circ\text{C}$) in $q_i \approx 2260\,\text{kJ/kg}$ (pri $100\,^\circ\text{C}$). Pri strjevanju in kondenzaciji se ista toplota sprosti. Vrelišče je odvisno od zračnega tlaka: pri nižjem tlaku voda zavre pri nižji temperaturi, pri višjem pri višji.

Zdaj lahko odgovoriš na uganko. Za taljenje $1\,\text{kg}$ snega potrebuješ $334\,\text{kJ}$. Za segretje $1\,\text{kg}$ vode za $80\,\text{K}$ potrebuješ:

$$Q = 1 \cdot 4200 \cdot 80\,\text{J} = 336\,000\,\text{J}$$

To je skoraj natanko enako. Ista energija bi vodo segrela z $0$ na približno $80\,^\circ\text{C}$.

Vse skupaj pokaže **krivulja segrevanja**: temperatura ledu v odvisnosti od dovedene toplote.

:::risba graf
opis: Krivulja segrevanja za m = {m} kg ledu z začetno temperaturo −40 °C pri normalnem tlaku; temperatura v °C v odvisnosti od dovedene toplote v kJ. Od 0 do {84*m:.1} kJ temperatura naraste z −40 na 0 °C (led se segreva). Od {84*m:.1} do {418*m:.1} kJ ostane 0 °C (taljenje); ta odsek leži na vodoravni osi, zato sta njegov začetek in konec označena s točkama, območje taljenja je osenčeno s črtkanim pravokotnikom, napis s puščico kaže nanj. Od {418*m:.1} do {838*m:.1} kJ naraste na 100 °C (voda se segreva). Od {838*m:.1} kJ naprej ostane 100 °C (vrenje, ki se konča šele pri {3098*m:.1} kJ, desno zunaj slike).
x: 0 .. 140 | 20 | Q [kJ]
y: -40 .. 120 | 20 | t [°C]
drsnik: m | 0,05 .. 0,14 | 0,01 | 0,1 | masa ledu v kg
pravokotnik: 84*m; -40 .. 418*m; 120 | siva črtkano
črta: 0; -40 -> 84*m; 0 -> 418*m; 0 -> 838*m; 100 -> 140; 100 | modra debelo
točka: 84*m; 0
točka: 418*m; 0
puščica: 50; -22 -> 300*m; -3
napis: 52; -24 | taljenje pri 0 °C | desno
napis: 130; 100 | vrenje | pod
podnapis: m = {m} kg: taljenje traja {334*m:.1} kJ, vrenje {2260*m:.1} kJ
:::

Pri $m = 0{,}1\,\text{kg}$ se led z $-40\,^\circ\text{C}$ segreje do tališča po $8{,}4\,\text{kJ}$, taljenje traja do $41{,}8\,\text{kJ}$, voda doseže $100\,^\circ\text{C}$ pri $83{,}8\,\text{kJ}$, vrenje pa se konča šele pri $309{,}8\,\text{kJ}$, daleč desno zunaj slike. Vodoravna odseka sta fazna prehoda. Odsek taljenja pri $0\,^\circ\text{C}$ leži na sami vodoravni osi; na sliki ga označujeta točki in osenčen črtkan pravokotnik. V aplikaciji spreminjaj maso $m$ in opazuj: vsi odseki se raztegnejo v istem razmerju; podnapis pokaže, da je vrenje vedno skoraj sedemkrat daljše od taljenja, ker je $q_i$ toliko večja od $q_t$. Poševna odseka imata različna naklona: led ima manjšo $c$ kot voda, zato se segreva hitreje in je njegov odsek strmejši.

:::premisli
Kaj te bolj opeče: $1\,\text{g}$ vode s $100\,^\circ\text{C}$ ali $1\,\text{g}$ pare s $100\,^\circ\text{C}$, ki se na koži zgosti? Napovej in utemelji.
---
Para. Ko se zgosti, odda $0{,}001 \cdot 2\,260\,000\,\text{J} = 2260\,\text{J}$, šele nato se kot voda ohlaja. Če se oboje ohladi na približno $35\,^\circ\text{C}$, voda odda $0{,}001 \cdot 4200 \cdot 65\,\text{J} = 273\,\text{J}$, para pa $2260\,\text{J} + 273\,\text{J} = 2533\,\text{J}$, približno devetkrat več.
:::

**7. Račun po odsekih.** Če je med segrevanjem fazni prehod, račun razdelimo kot krivuljo: segrevanje v eni fazi ($Q = mc\Delta T$, s $c$ te faze), fazni prehod ($Q = mq_t$ ali $Q = mq_i$), spet segrevanje. Toplote vseh odsekov seštejemo.

## Rešeni primeri

### Primer 1: voda za pomivanje v kampu (lažji)

V kampu na gorilniku segrejemo $2\,\text{kg}$ vode z $20\,^\circ\text{C}$ na $70\,^\circ\text{C}$. Koliko toplote mora prejeti voda? Uporabi $c = 4200\,\text{J/(kg\,K)}$.

**Podatki:** $m = 2\,\text{kg}$, $t_1 = 20\,^\circ\text{C}$, $t_2 = 70\,^\circ\text{C}$, $c = 4200\,\text{J/(kg\,K)}$
**Iščemo:** toploto $Q$

:::formula
$Q = m\,c\,\Delta T$, kjer je $\Delta T = t_2 - t_1$
:::

**Rešitev:**

1. Voda se samo segreva (ostaja kapljevina), zato uporabimo $Q = mc\Delta T$.
2. Temperaturna razlika: $\Delta T = 70\,^\circ\text{C} - 20\,^\circ\text{C} = 50\,\text{K}$. Razliko lahko zapišemo v kelvinih, ker sta razliki v $^\circ\text{C}$ in K enaki.
3. Vstavimo: $Q = 2\,\text{kg} \cdot 4200\,\text{J/(kg\,K)} \cdot 50\,\text{K} = 420\,000\,\text{J}$.
4. Odgovor: voda mora prejeti $420\,\text{kJ}$ toplote. $Q$ je pozitiven, kar ustreza segrevanju.

### Primer 2: iz katere kovine je plošča žara?

Kovinsko ploščo prenosnega žara z maso $0{,}50\,\text{kg}$ segrejemo z $20\,^\circ\text{C}$ na $60\,^\circ\text{C}$. Pri tem prejme $9000\,\text{J}$ toplote. Kolikšna je specifična toplota kovine?

**Podatki:** $m = 0{,}50\,\text{kg}$, $t_1 = 20\,^\circ\text{C}$, $t_2 = 60\,^\circ\text{C}$, $Q = 9000\,\text{J}$
**Iščemo:** specifično toploto $c$

:::formula
$c = \dfrac{Q}{m\,\Delta T}$, kjer je $\Delta T = t_2 - t_1$
:::

**Rešitev:**

1. Iščemo $c$, zato enačbo $Q = mc\Delta T$ delimo z $m\,\Delta T$: $c = \dfrac{Q}{m\,\Delta T}$.
2. $\Delta T = 60\,^\circ\text{C} - 20\,^\circ\text{C} = 40\,\text{K}$.
3. Vstavimo: $c = \dfrac{9000\,\text{J}}{0{,}50\,\text{kg} \cdot 40\,\text{K}} = 450\,\text{J/(kg\,K)}$.
4. Odgovor: $c = 450\,\text{J/(kg\,K)}$, kar se ujema z železom. Zanesljivo pa tega iz ene vrednosti ne moremo trditi, ker imajo podobno $c$ tudi druge snovi.

### Primer 3: čaj iz snega na Kredarici (težji)

Triglavski dom na Kredarici stoji na približno $2500\,\text{m}$ nadmorske višine. Zračni tlak je tam nižji, zato voda zavre že pri približno $92\,^\circ\text{C}$. Planinec stali $1{,}0\,\text{kg}$ snega s temperaturo $-10\,^\circ\text{C}$ in vodo segreje do vrenja. Koliko toplote mora prejeti? Za koliko manj je to, kot bi bilo ob morju, kjer voda zavre pri $100\,^\circ\text{C}$? Uporabi $c_{\text{led}} = 2100\,\text{J/(kg\,K)}$, $c_{\text{voda}} = 4200\,\text{J/(kg\,K)}$, $q_t = 334\,000\,\text{J/kg}$.

**Podatki:** $m = 1{,}0\,\text{kg}$, $t_1 = -10\,^\circ\text{C}$, vrelišče $t_2 = 92\,^\circ\text{C}$ (ob morju $100\,^\circ\text{C}$), tališče $0\,^\circ\text{C}$, $c_{\text{led}} = 2100\,\text{J/(kg\,K)}$, $c_{\text{voda}} = 4200\,\text{J/(kg\,K)}$, $q_t = 334\,000\,\text{J/kg}$
**Iščemo:** skupno toploto $Q$ in razliko glede na morje

:::formula
$Q = m c_{\text{led}} \Delta T_1 + m q_t + m c_{\text{voda}} \Delta T_2$, kjer je $\Delta T_1 = 0\,^\circ\text{C} - t_1$ in $\Delta T_2 = t_2 - 0\,^\circ\text{C}$
:::

**Rešitev:**

Proces ima tri odseke, ker je vmes fazni prehod pri $0\,^\circ\text{C}$.

1. **Segrevanje snega do $0\,^\circ\text{C}$**, s $c$ ledu: $\Delta T_1 = 10\,\text{K}$, $Q_1 = 1{,}0 \cdot 2100 \cdot 10\,\text{J} = 21\,000\,\text{J}$.
2. **Taljenje pri $0\,^\circ\text{C}$**; temperatura stoji, zato uporabimo $q_t$: $Q_2 = 1{,}0 \cdot 334\,000\,\text{J} = 334\,000\,\text{J}$.
3. **Segrevanje vode do vrelišča**, zdaj s $c$ vode: $\Delta T_2 = 92\,\text{K}$, $Q_3 = 1{,}0 \cdot 4200 \cdot 92\,\text{J} = 386\,400\,\text{J}$.
4. **Skupaj:** $Q = 21\,000 + 334\,000 + 386\,400 = 741\,400\,\text{J}$.
5. **Ob morju** bi se voda grela še $8\,\text{K}$ dlje: $1{,}0 \cdot 4200 \cdot 8\,\text{J} = 33\,600\,\text{J}$ več.
6. Odgovor: planinec potrebuje približno $740\,\text{kJ}$, za $33{,}6\,\text{kJ}$ manj kot ob morju. Skoraj polovico energije pobere taljenje, čeprav se temperatura pri njem ne spremeni. Če gorilnik vodi preda recimo $750\,\text{J}$ na sekundo, traja to $741\,400\,\text{J} / 750\,\text{W} \approx 990\,\text{s}$, približno $16\,\text{min}$.

### Primer 4 – zdaj ti: led v hladilni torbi

Na izletu je v hladilni torbi $0{,}50\,\text{kg}$ ledu pri $0\,^\circ\text{C}$. Do večera se ves stali in nastala voda se segreje na $8\,^\circ\text{C}$. Koliko toplote je led prejel od hrane in zraka v torbi? Uporabi $q_t = 334\,000\,\text{J/kg}$ in $c = 4200\,\text{J/(kg\,K)}$.

**Podatki:** $m = 0{,}50\,\text{kg}$, začetna temperatura ledu $0\,^\circ\text{C}$, končna temperatura vode $8\,^\circ\text{C}$, $q_t = 334\,000\,\text{J/kg}$, $c = 4200\,\text{J/(kg\,K)}$
**Iščemo:** prejeto toploto $Q$

:::formula
$Q = m\,q_t + m\,c\,\Delta T$
:::

**Rešitev:**

1. Led je že pri tališču, zato odseka s segrevanjem ledu ni.
2. Taljenje: $Q_1 = 0{,}50 \cdot 334\,000\,\text{J} = 167\,000\,\text{J}$.
3. Izračunaj sam toploto za segrevanje vode z $0$ na $8\,^\circ\text{C}$ in obe toploti seštej.

:::premisli
Koliko toplote je prejel led?
---
Segrevanje vode: $0{,}50 \cdot 4200 \cdot 8\,\text{J} = 16\,800\,\text{J}$. Skupaj $Q = 167\,000\,\text{J} + 16\,800\,\text{J} = 183\,800\,\text{J}$, približno $1{,}8 \cdot 10^5\,\text{J}$. Večino je led prejel za taljenje, zato led hladi veliko bolje kot enaka masa mrzle vode.
:::

## Pogoste napake

- **Mešanje toplote in temperature.** »Vroč čaj v termovki vsebuje veliko toplote.« Toplota je energija, ki se *prenaša*; čaj ima visoko temperaturo in veliko notranjo energijo. Prav: o toploti govori samo, ko energija prehaja z enega telesa na drugo.
- **$Q = mc\Delta T$ med faznim prehodom.** »Led se tali pri stalnih $0\,^\circ\text{C}$, torej je $\Delta T = 0$ in $Q = 0$.« Taljenje vseeno potrebuje energijo, ker se z njo razmikajo delci. Prav: med faznim prehodom uporabi $Q = mq_t$ ali $Q = mq_i$.
- **»Močnejši ogenj, bolj vroča vrela voda.«** Med vrenjem gre dodatna toplota v izparevanje, temperatura ostane pri vrelišču. Prav: močnejši ogenj pomeni le hitrejše izparevanje.
- **Pozabljen odsek ali napačna $c$.** »Od snega pri $-10\,^\circ\text{C}$ do vode pri $92\,^\circ\text{C}$ je $102\,\text{K}$, torej $Q = 1{,}0 \cdot 4200 \cdot 102\,\text{J}$.« Manjka taljenje, led pa ima drugo $c$ kot voda. Prav: razdeli na odseke kot v Primeru 3.
- **Masa v gramih.** »$Q = 250 \cdot 4200 \cdot 20$« za $250\,\text{g}$ vode da $1000$-krat preveliko toploto, ker je $c$ podana na kilogram. Prav: najprej $250\,\text{g} = 0{,}25\,\text{kg}$.

## Povzetek

- Notranja energija je vsota kinetičnih in potencialnih energij delcev telesa.
- Toplota $Q$ je energija, ki se zaradi razlike temperatur prenaša s toplejšega na hladnejše telo; merimo jo v $\text{J}$.
- Segrevanje in ohlajanje: $Q = mc\Delta T$, $\Delta T = t_2 - t_1$; voda ima veliko $c \approx 4200\,\text{J/(kg\,K)}$.
- Med faznim prehodom temperatura stoji: $Q = mq_t$ (taljenje) ali $Q = mq_i$ (izparevanje); za vodo $334\,\text{kJ/kg}$ in $2260\,\text{kJ/kg}$.
- Vrelišče je odvisno od tlaka: na Kredarici voda zavre pri približno $92\,^\circ\text{C}$.
- Naloge s prehodi računamo po odsekih krivulje segrevanja in toplote seštejemo.

## Drugače: Z analogijo

Krivuljo segrevanja si predstavljaj kot višinski profil pohodne poti na zemljevidu. Prehojena pot je dovedena toplota $Q$, nadmorska višina je temperatura $t$.

- Na poševnih odsekih z vsakim korakom pridobiš višino. Specifična toplota je kot položnost poti: pri vodi je pot položna (veliko hoje za malo višine), pri pesku strma.
- Fazni prehod je ravna planota: hodiš in se trudiš, višina pa ostaja enaka. Planota pri vrenju je skoraj sedemkrat daljša od planote pri taljenju.
- Večja masa je kot daljša pot v enakem merilu: vsi odseki se podaljšajo v istem razmerju.

Analogija ima mejo: na pravi poti višina lahko pada, tudi ko hodiš naprej. Na krivulji segrevanja temperatura ob dovajanju toplote nikoli ne pade; pade le, če telo toploto odda.

## Drugače: Bolj natančno

**Zakaj temperatura med taljenjem stoji?** Temperatura je povezana s povprečno kinetično energijo delcev. V ledu so molekule vode vezane v urejeno kristalno mrežo. Dovedena energija pri tališču ne pospeši delcev, ampak jih iztrga iz mreže; poveča se njihova potencialna energija. Ko je ves led staljen, energija spet poveča kinetično energijo in temperatura začne naraščati.

**Kdaj velja $Q = mc\Delta T$?** Ko je $c$ v obravnavanem območju temperatur stalna; v resnici se s temperaturo nekoliko spreminja.

**Kalorimeter ni popolnoma nevtralen.** V točki 4 smo predpostavili, da toploto izmenjujeta le voda in železo. Pravi kalorimeter se segreje ali ohladi skupaj z vodo, zato pri natančni meritvi upoštevamo še toploto posode, $C\,\Delta T$, kjer je $C$ toplotna kapaciteta posode v $\text{J/K}$.
## Preveri se

? V planinski koči nekdo reče: »Kad mlačne vode za kopanje vsebuje več toplote kot skodelica vrelega čaja.« Kaj je fizikalno pravilno?
- Prav ima: v kadi je več vode, zato je v njej več toplote.
~ Telo toplote nima, ima notranjo energijo. Toplota je le energija, ki prehaja zaradi razlike temperatur.
- Čaj ima več toplote, ker ima višjo temperaturo.
~ Temperatura ni energija. Čaj je bolj vroč, a ima veliko manj vode, zato manjšo notranjo energijo kot kad.
+ Kad ima večjo notranjo energijo, čaj višjo temperaturo; toplota je energija, ki bi tekla s čaja na mlačno vodo, če bi ju staknili.
- Kad in čaj imata enako toplote, ker sta oba v isti sobi.
~ Isti prostor ne izenači energije. Čaj ima drugo temperaturo, kad pa veliko večjo maso.
> Vsako telo ima notranjo energijo; pri kadi je zaradi velike mase večja. Toplota ni nekaj, kar telo vsebuje, ampak energija, ki teče s toplejšega na hladnejše telo.

? Razvrsti postopke od tistega, ki potrebuje najmanj toplote, do tistega, ki potrebuje največ. Vse velja za $1\,\text{kg}$ snovi.
1. segrevanje ledu za $10\,\text{K}$
2. segrevanje vode za $10\,\text{K}$
3. taljenje ledu pri $0\,^\circ\text{C}$
4. segrevanje vode z $0$ na $100\,^\circ\text{C}$
5. izparevanje vode pri $100\,^\circ\text{C}$
> Toplote: $21\,\text{kJ}$; $42\,\text{kJ}$; $334\,\text{kJ}$; $420\,\text{kJ}$; $2260\,\text{kJ}$. Led ima polovično $c$ vode, izparevanje pa potrebuje največ.

? Lonec na pritisk tesno zapremo, zato je tlak v njem višji kot zunaj. Kaj se zgodi z vreliščem vode v njem?
+ Vrelišče se zviša nad $100\,^\circ\text{C}$, zato se hrana skuha hitreje.
- Vrelišče ostane $100\,^\circ\text{C}$, ker je to vrelišče vode.
~ $100\,^\circ\text{C}$ velja le pri normalnem zračnem tlaku. Vrelišče je odvisno od tlaka.
- Vrelišče se zniža, kot na Kredarici.
~ Na Kredarici je tlak nižji, zato je nižje tudi vrelišče. V loncu na pritisk je tlak višji, zato je vrelišče višje.
- Vrelišče se ne spremeni; voda le hitreje izpareva, kot pri močnejšem ognju.
~ Močnejši ogenj spremeni le hitrost izparevanja. Vrelišče spremeni tlak, ne moč gorilnika.
> Pri višjem tlaku voda zavre pri višji temperaturi. V loncu na pritisk voda vre nad $100\,^\circ\text{C}$, zato hrana prej prejme dovolj toplote.

? Na postanku v termovko s $0{,}30\,\text{kg}$ čaja z $90\,^\circ\text{C}$ doliješ $0{,}20\,\text{kg}$ vode s $15\,^\circ\text{C}$. Kolikšna je končna temperatura v $^\circ\text{C}$? Čaj ima enako $c$ kot voda, izgube toplote zanemari.
= 60 °C | 0,5
~ 52,5 | To je navadno povprečje obeh temperatur. Čaja je več kot vode, zato je končna temperatura bliže $90\,^\circ\text{C}$.
~ 45 | Mase si zamenjal. Več je vročega čaja ($0{,}30\,\text{kg}$), zato je končna temperatura bliže temperaturi čaja.
> $Q_{\text{oddana}} = Q_{\text{prejeta}}$: $0{,}30 \cdot c\,(90 - t_k) = 0{,}20 \cdot c\,(t_k - 15)$. $c$ se krajša: $t_k = \dfrac{0{,}30 \cdot 90 + 0{,}20 \cdot 15}{0{,}50}\,^\circ\text{C} = 60\,^\circ\text{C}$.

? Graf kaže, kako se spreminja temperatura $0{,}50\,\text{kg}$ neznane trdne snovi, ko ji dovajamo toploto. Z grafa odčitaj potrebne podatke in izračunaj specifično talilno toploto snovi v $\text{kJ/kg}$.
:::risba graf
opis: Graf temperature v °C v odvisnosti od dovedene toplote v kJ za 0,50 kg neznane snovi. Od 0 do 20 kJ temperatura naraste z 20 na 80 °C. Od 20 do 70 kJ ostane 80 °C. Od 70 do 100 kJ naraste z 80 na 120 °C.
x: 0 .. 100 | 10 | Q [kJ]
y: 0 .. 140 | 20 | t [°C]
črta: 0; 20 -> 20; 80 -> 70; 80 -> 100; 120 | modra debelo
:::
= 100 kJ/kg | 2
~ 50 | To je toplota za taljenje vse snovi. Deliti jo moraš še z maso $0{,}50\,\text{kg}$.
~ 140 | Vzel si toploto na koncu vodoravnega odseka ($70\,\text{kJ}$). Za taljenje šteje samo razlika $70 - 20 = 50\,\text{kJ}$.
~ 160 | Vzel si temperaturo tališča ($80$) namesto toplote. Na vodoravni osi odčitaj začetek in konec vodoravnega odseka.
> Taljenje je vodoravni odsek pri $80\,^\circ\text{C}$, od $20$ do $70\,\text{kJ}$, torej $Q = 50\,\text{kJ}$. Zato $q_t = \dfrac{50\,\text{kJ}}{0{,}50\,\text{kg}} = 100\,\text{kJ/kg}$.

? V hladilni torbi je $200\,\text{g}$ ledu z $-5\,^\circ\text{C}$. Koliko toplote prejme, da postane voda z $20\,^\circ\text{C}$? Odgovor v $\text{kJ}$. Uporabi $c_{\text{led}} = 2100\,\text{J/(kg\,K)}$, $c_{\text{voda}} = 4200\,\text{J/(kg\,K)}$, $q_t = 334\,000\,\text{J/kg}$.
= 85,7 kJ | 0,5
~ 18,9 | Pozabil si taljenje. Pri $0\,^\circ\text{C}$ led prejme še $0{,}20 \cdot 334\,000\,\text{J} = 66\,800\,\text{J}$, čeprav se temperatura ne spremeni.
~ 21 | Računal si samo $0{,}20 \cdot 4200 \cdot 25\,\text{J}$: brez taljenja in s $c$ vode tudi za led.
~ 87,8 | Taljenje imaš, a si tudi led segreval s $c$ vode. Led ima $c = 2100\,\text{J/(kg\,K)}$.
~ 85700 | Če si računal pravilno v J, deli s 1000: $85\,700\,\text{J} = 85{,}7\,\text{kJ}$. Če pa si maso vstavil v gramih, si dobil 1000-krat preveč: $200\,\text{g} = 0{,}20\,\text{kg}$.
> Po odsekih: led do $0\,^\circ\text{C}$: $0{,}20 \cdot 2100 \cdot 5\,\text{J} = 2100\,\text{J}$; taljenje: $0{,}20 \cdot 334\,000\,\text{J} = 66\,800\,\text{J}$; voda do $20\,^\circ\text{C}$: $0{,}20 \cdot 4200 \cdot 20\,\text{J} = 16\,800\,\text{J}$. Skupaj $85\,700\,\text{J} = 85{,}7\,\text{kJ}$.

:::simboli
\Delta W_n | sprememba notranje energije | \Delta W_n = Q | J | kadar ni dela
W_n | notranja energija | | J | kinetične in potencialne energije delcev
Q | toplota | Q = m\,c\,\Delta T | J | pri segrevanju $Q > 0$, pri ohlajanju $Q < 0$
m | masa | | kg
c | specifična toplota | c = \frac{Q}{m\,\Delta T} | J/(kg\,K) | voda 4200 J/(kg K)
\Delta T | sprememba temperature | \Delta T = t_2 - t_1 | K | razlika 1 K je enaka razliki 1 °C
t | temperatura | | ^\circ C | os krivulje segrevanja
t_1 | začetna temperatura | | ^\circ C | na začetku segrevanja ali ohlajanja
t_2 | končna temperatura | | ^\circ C | na koncu segrevanja ali ohlajanja
\Delta T_1 | sprememba temperature snega do tališča | \Delta T_1 = 0\,^\circ\text{C} - t_1 | K
\Delta T_2 | sprememba temperature vode od tališča | \Delta T_2 = t_2 - 0\,^\circ\text{C} | K
q_t | specifična talilna toplota | q_t = \frac{Q}{m} | J/kg | voda 334 kJ/kg
q_i | specifična izparilna toplota | q_i = \frac{Q}{m} | J/kg | voda 2260 kJ/kg
Q_{\text{oddana}} | toplota, ki jo toplejše telo odda | | J
Q_{\text{prejeta}} | toplota, ki jo hladnejše telo prejme | | J | v kalorimetru $Q_{\text{oddana}} = Q_{\text{prejeta}}$
t_k | končna skupna temperatura | | ^\circ C | po izenačitvi temperatur
m_{\text{voda}} | masa vode | | kg
t_{\text{voda}} | začetna temperatura vode | | ^\circ C | v točki 4: 80 °C
m_{\text{Fe}} | masa železa | | kg
c_{\text{Fe}} | specifična toplota železa | | J/(kg\,K) | 450 J/(kg K)
t_{\text{Fe}} | začetna temperatura železa | | ^\circ C | v točki 4: 20 °C
Q_1 | toplota prvega odseka | | J | Primer 3: segrevanje snega; Primer 4: taljenje
Q_2 | toplota taljenja v Primeru 3 | Q_2 = m\,q_t | J
Q_3 | toplota za segrevanje vode do vrelišča | Q_3 = m\,c_{\text{voda}}\,\Delta T_2 | J
c_{\text{led}} | specifična toplota ledu | | J/(kg\,K) | 2100 J/(kg K)
c_{\text{voda}} | specifična toplota vode | | J/(kg\,K) | 4200 J/(kg K)
C | toplotna kapaciteta posode | C = \frac{Q}{\Delta T} | J/K | kalorimeter
:::

<<RACUN
vrednost: 2*10*4200 | 84000
vrednost: 1*4200*80 | 336000
vrednost: (4200*80+450*20)/(4200+450) | 74.19
vrednost: 40/4.2 | 9.52
vrednost: 40/0.8 | 50
vrednost: 2*4200*50 | 420000
vrednost: 9000/(0.50*40) | 450
vrednost: 1.0*2100*10 + 1.0*334000 + 1.0*4200*92 | 741400
vrednost: 1.0*4200*8 | 33600
vrednost: 0.50*334000 + 0.50*4200*8 | 183800
vrednost: 0.001*2260000 + 0.001*4200*65 | 2533
vrednost: 0.25*4200*20 | 21000
vrednost: (70-20)/0.50 | 100
vrednost: 0.20*2100*5 + 0.20*334000 + 0.20*4200*20 | 85700
vrednost: 0.20*2100*5 + 0.20*4200*20 | 18900
vrednost: 0.20*4200*25 | 21000
vrednost: 0.20*4200*25 + 0.20*334000 | 87800
vrednost: 741400/750 | 988.5
vrednost: 3098*0.1 | 309.8
vrednost: (0.30*90 + 0.20*15)/0.50 | 60
vrednost: 4200*(80-74.19) | 24402
vrednost: 450*(74.19-20) | 24386
vrednost: 84*0.1 | 8.4
vrednost: 418*0.1 | 41.8
vrednost: 838*0.1 | 83.8
>>
