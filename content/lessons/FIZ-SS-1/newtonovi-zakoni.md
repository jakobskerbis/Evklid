---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tim v trgovini potiska nakupovalni voziček. Ko ga spusti, voziček po nekaj metrih obstane. »Jasno,« reče, »brez potiskanja se nič ne giblje. Tudi sonda Voyager 1, ki leti od leta 1977, mora imeti ves čas prižgane motorje, sicer bi obstala.«

Zveni logično, pa je narobe. Voyager 1 se od Sonca oddaljuje s hitrostjo okoli $17\,\mathrm{km/s}$. Tako daleč od Sonca in planetov nanj ne deluje skoraj nobena sila, pa vendar ne obstane. Kinematika ti pove, *kako* se telo giblje. Ne pove pa, *zakaj* voziček obstane, sonda pa ne.

Odgovor dajo **Newtonovi zakoni**. Povezujejo silo, maso in pospešek, zato lahko vnaprej izračunaš, kako se bo telo gibalo. Z njimi inženirji načrtujejo vozila, dvigala in rakete.

## Razlaga

**1. Spomni se: sile in rezultanta.** Sila $F$ je vektor z velikostjo in smerjo, enota je newton ($\mathrm{N}$). Teža je $F_\mathrm{g} = m\,g$ z $g \approx 9{,}8\,\mathrm{m/s^2}$, sila podlage je pravokotna na podlago, trenje nasprotuje gibanju (v tej lekciji je vedno podano). Telo v teh nalogah obravnavamo kot točko, zato vse sile nanj rišemo iz njegovega središča. Njihova vsota je **rezultanta** $F_\mathrm{r}$: sile v isti smeri seštejemo, v nasprotni odštejemo.

:::risba skica
opis: Škatla na vodoravni podlagi in štiri sile nanjo. Teža 98 N kaže navzdol, sila podlage 98 N navzgor, vlečna sila 50 N v desno, trenje 20 N v levo. Dolžine puščic so sorazmerne s silami: navpični sta enako dolgi, desna je dva in pol krat daljša od leve. Rezultanta je 30 N v desno.
območje: -4; -5,5 .. 4; 5,5
enota: 28
pravokotnik: -0,4; -0,4 .. 0,4; 0,4 | siva
puščica: 0; 0 -> 0; -4,9 | F_g = 98 N | desno | modra
puščica: 0; 0 -> 0; 4,9 | F_p = 98 N | desno | zelena
puščica: 0; 0 -> 2,5; 0 | F_v = 50 N | nad desno | oranžna
puščica: 0; 0 -> -1; 0 | F_{tr} = 20 N | pod levo | rdeča
:::

*Hiter preizkus:* kolikšna je rezultanta na sliki?

*Odgovor:* navpični sili se izničita, vodoravno ostane $50\,\mathrm{N} - 20\,\mathrm{N} = 30\,\mathrm{N}$ v desno.

**2. Prvi Newtonov zakon (zakon o vztrajnosti).** Telo miruje ali se enakomerno giblje po premici, dokler je rezultanta sil nanj enaka nič:

$$F_\mathrm{r} = 0 \;\Rightarrow\; \vec v = \text{konstantna}$$

Lastnosti telesa, da se upira spremembi gibanja, pravimo **vztrajnost**. Večja ko je masa, večja je vztrajnost.

Timov voziček torej ne obstane zato, ker »zmanjka sile«, ampak ker nanj delujeta trenje in upor koles. Če ju ni, se hitrost ne spremeni.

Poln voziček z maso $20\,\mathrm{kg}$ ima na začetku hitrost $1\,\mathrm{m/s}$, upori nanj skupaj delujejo s silo $10\,\mathrm{N}$ nazaj. Ti ga potiskaš naprej s silo $F$. Na sliki je $F = 10\,\mathrm{N}$: potisk in upori sta enako velika, rezultanta je nič in hitrost ostane ves čas $1\,\mathrm{m/s}$. V aplikaciji premikaj drsnik. Pri $F$ nad $10\,\mathrm{N}$ kaže rezultanta naprej in hitrost raste. Pri $F$ pod $10\,\mathrm{N}$ kaže nazaj in hitrost pada; pri $F = 0$ voziček obstane, nato miruje. Opazi: premica je vodoravna natanko takrat, ko je rezultanta nič, ne takrat, ko ni nobene sile.

:::risba graf
opis: Graf hitrosti nakupovalnega vozička v odvisnosti od časa od 0 do 5 sekund. Masa je 20 kg, začetna hitrost 1 m/s, upori 10 N. V aplikaciji se potisna sila F spreminja z drsnikom; izbrano je F = {F} N in hitrost po 4 s je {max(0, 1+(F-10)/20*4)} m/s.
x: 0 .. 5 | 1 | t (s)
y: 0 .. 6 | 1 | v (m/s)
drsnik: F | 0 .. 30 | 5 | 10 | potisna sila F v newtonih
f: max(0, 1 + (F - 10)/20*x) | modra | 0 .. 4,5
točka: 4; max(0, 1 + (F - 10)/20*4) | v = {max(0, 1+(F-10)/20*4)} m/s | nad levo
podnapis: Potisk F = {F} N, upori 10 N, rezultanta med gibanjem {F-10} N
:::

:::premisli
Voyager je daleč od Sonca in planetov, njihove sile nanj so skoraj nič. Kaj se dogaja z njegovo hitrostjo? Kdo je imel prav, Tim ali Newton?
---
Hitrost ostaja skoraj enaka, ker je rezultanta sil skoraj nič. Za gibanje sila ni potrebna; potrebna je le za spremembo hitrosti. Tim se moti.
:::

**3. Drugi Newtonov zakon (osnovni zakon dinamike).** Kaj pa, ko rezultanta *ni* nič? Na gladkih tleh, kjer so upori zanemarljivi, potiskamo voziček z dinamometrom in s telefonom v košari merimo pospešek. Meritve se malo razpršijo:

| rezultanta $F_\mathrm{r}$ | masa $m$ | izmerjeni $a$ |
|---|---|---|
| $10\,\mathrm{N}$ | $10\,\mathrm{kg}$ | $0{,}98\,\mathrm{m/s^2}$ |
| $20\,\mathrm{N}$ | $10\,\mathrm{kg}$ | $2{,}03\,\mathrm{m/s^2}$ |
| $20\,\mathrm{N}$ | $20\,\mathrm{kg}$ | $0{,}99\,\mathrm{m/s^2}$ |
| $40\,\mathrm{N}$ | $20\,\mathrm{kg}$ | $1{,}97\,\mathrm{m/s^2}$ |

Primerjaj prvi dve vrstici: dvojna sila da približno dvojni pospešek. Drugi in tretji: dvojna masa da približno pol manjši pospešek. V vsaki vrstici je sila v okviru merske napake enaka masi krat pospešek. To je drugi Newtonov zakon: rezultanta sil na telo je enaka produktu mase in pospeška:

$$F_\mathrm{r} = m\,a$$

Pospešek ima enako smer kot rezultanta. Iz zakona dobimo tudi enoto: $1\,\mathrm{N}$ je sila, ki telesu z maso $1\,\mathrm{kg}$ da pospešek $1\,\mathrm{m/s^2}$.

Graf spodaj kaže pospešek v odvisnosti od rezultante, $a = \dfrac{F_\mathrm{r}}{m}$. Za maso $20\,\mathrm{kg}$ je to premica skozi izhodišče; pri $40\,\mathrm{N}$ odčitaš $2\,\mathrm{m/s^2}$, skoraj enako kot v zadnji vrstici tabele. V aplikaciji povečaj maso na $40\,\mathrm{kg}$ in opazuj: premica postane bolj položna, pri $40\,\mathrm{N}$ je pospešek le še $1\,\mathrm{m/s^2}$. Večja masa pomeni večjo vztrajnost.

:::risba graf
opis: Graf pospeška a v odvisnosti od rezultante sil F od 0 do 60 N. Premica skozi izhodišče z naklonom 1 deljeno z maso. V aplikaciji se masa m spreminja z drsnikom; izbrano je m = {m} kg, pri 40 N je pospešek {40/m:.1} m/s².
x: 0 .. 60 | 10 | F_r (N)
y: 0 .. 6 | 1 | a (m/s^2)
drsnik: m | 10 .. 40 | 5 | 20 | masa vozička m v kilogramih
f: x/m | modra
črta: 40; 0 -> 40; 40/m | siva črtkano
točka: 40; 40/m | a = {40/m:.1} m/s^2 | nad levo
podnapis: Masa m = {m} kg: pri 40 N je pospešek {40/m:.1} m/s²
:::

V simulaciji spodaj »Sila, masa in pospešek« (v aplikaciji) pri isti masi podvoji silo, nato pri isti sili podvoji maso. Pričakuj: dvojna sila da dvojni pospešek, dvojna masa pa pol manjšega.

*Hiter preizkus:* vrni se na graf vozička ($20\,\mathrm{kg}$, $1\,\mathrm{m/s}$, upori $10\,\mathrm{N}$). Pri kateri potisni sili bo hitrost po $4\,\mathrm{s}$ enaka $3\,\mathrm{m/s}$? Napovej, nato preveri z drsnikom.

*Odgovor:* hitrost naj v $4\,\mathrm{s}$ zraste za $2\,\mathrm{m/s}$, torej $a = 0{,}5\,\mathrm{m/s^2}$ in $F_\mathrm{r} = 20\,\mathrm{kg}\cdot 0{,}5\,\mathrm{m/s^2} = 10\,\mathrm{N}$. Potisk mora premagati še upore: $F = 20\,\mathrm{N}$.

**4. Tretji Newtonov zakon (zakon o vzajemnem delovanju).** Če prvo telo deluje na drugo s silo $\vec F_{12}$, drugo deluje na prvo z enako veliko, nasprotno usmerjeno silo:

$$\vec F_{21} = -\vec F_{12}$$

Pomembno: sili delujeta na **različni telesi**, zato se med seboj ne izničita. Ko Tim potiska voziček, voziček enako močno potiska Tima nazaj. Tim kljub temu gre naprej, ker se z nogami odriva od tal in ga tla s silo trenja potiskajo naprej. Na sliki se astronavt odrine od stene vesoljske postaje s silo $160\,\mathrm{N}$. Ena puščica je narisana na astronavtu, druga na steni: vsaka pospeši svoje telo.

:::risba skica
opis: Astronavt levo, stena vesoljske postaje desno, dotikata se. Obe puščici izhajata iz stika. Na astronavtu je puščica 160 N v levo: sila stene na astronavta. Na steni je enako dolga puščica 160 N v desno: sila astronavta na steno. Puščici sta na različnih telesih.
območje: -6,5; -2,4 .. 6; 2,6
enota: 24
pravokotnik: -1,5; -0,6 .. 0; 0,6 | siva
pravokotnik: 0; -2 .. 0,8; 2 | siva
napis: -0,1; 0,6 | astronavt | nad levo
napis: 0,4; 2 | stena | nad
puščica: 0; 0,3 -> -4,4; 0,3 | | | oranžna
napis: -4,2; 0,3 | 160 N | nad
napis: -4,4; 0,3 | na astronavta | pod
puščica: 0; -0,4 -> 4,4; -0,4 | | | modra
napis: 3,4; -0,4 | 160 N | nad
napis: 3,4; -0,4 | na steno | pod
:::

:::premisli
Astronavt v vesoljski postaji se odrine od stene. Je sila stene nanj večja, manjša ali enaka sili, s katero on potiska steno? Zakaj se potem premakne skoraj samo on?
---
Sili sta enako veliki. Postaja pa ima ogromno maso, zato je njen pospešek $a = \dfrac{F}{m}$ zelo majhen, astronavtov pa velik.
:::

**5. Postopek reševanja nalog.**

1. Nariši skico in poišči vsa telesa, ki delujejo s silo na obravnavano telo (Zemlja, podlaga, vrv, roka …).
2. Vriši vse sile na telo (teža, sila podlage, vlečna sila, trenje).
3. Izberi pozitivno smer (običajno smer gibanja).
4. Zapiši $F_\mathrm{r} = m\,a$ s predznaki.
5. Izračunaj neznanko in preveri enote ter smiselnost.

## Rešeni primeri

### Primer 1 (lažji): škatla s prve slike

V skladišču trgovine leži škatla z blagom z maso $10\,\mathrm{kg}$ na vodoravni podlagi. To je škatla s prve slike. Vlečemo jo z vodoravno silo $50\,\mathrm{N}$, sila trenja je $20\,\mathrm{N}$. Škatla na začetku miruje. Kolikšen je pospešek in kolikšno pot prepotuje v $4\,\mathrm{s}$?

**Podatki:** $m = 10\,\mathrm{kg}$, $F = 50\,\mathrm{N}$ (vodoravna vlečna sila), $F_\mathrm{tr} = 20\,\mathrm{N}$, $v_0 = 0$, $t = 4\,\mathrm{s}$
**Iščemo:** pospešek $a$ in pot $s$

:::formula
$F_\mathrm{r} = F - F_\mathrm{tr} = m\,a$, nato pot pri $v_0 = 0$: $s = \dfrac{1}{2}a t^2$
:::

**Rešitev:**

1. Sile so že na prvi sliki. Navpični sili (teža in sila podlage) se izničita, zato šteje le vodoravna smer.
2. Pozitivna smer naj bo smer vlečne sile; trenje kaže nasprotno, zato ga odštejemo: $F_\mathrm{r} = 50\,\mathrm{N} - 20\,\mathrm{N} = 30\,\mathrm{N}$.
3. Pospešek: $a = \dfrac{30\,\mathrm{N}}{10\,\mathrm{kg}} = 3\,\mathrm{m/s^2}$. Enota $\mathrm{N/kg} = \mathrm{m/s^2}$ je res enota pospeška.
4. Ker je pospešek stalen in je začetna hitrost nič, uporabimo formulo iz kinematike: $s = \dfrac{1}{2}\cdot 3\,\mathrm{m/s^2}\cdot (4\,\mathrm{s})^2 = 24\,\mathrm{m}$.
5. Odgovor: pospešek je $3\,\mathrm{m/s^2}$, pot pa $24\,\mathrm{m}$.

### Primer 2: zaviranje dostavnega avta

Dostavni avto trgovine z maso $1200\,\mathrm{kg}$ vozi s hitrostjo $20\,\mathrm{m/s}$. Voznik zavira in rezultanta sil nanj je $6000\,\mathrm{N}$, usmerjena nazaj. To je približno polovica teže avta ($1200\cdot 9{,}8 \approx 11\,800\,\mathrm{N}$). Koliko časa zavira do ustavitve in kolikšna je zavorna pot?

**Podatki:** $m = 1200\,\mathrm{kg}$, $F_\mathrm{r} = 6000\,\mathrm{N}$ (nasprotno od hitrosti), $v_0 = 20\,\mathrm{m/s}$, končna hitrost $v = 0$
**Iščemo:** čas $t$ in zavorno pot $s$

:::formula
$a = \dfrac{F_\mathrm{r}}{m}$, $t = \dfrac{v_0}{a}$, $s = v_0 t - \dfrac{1}{2}a t^2$
:::

**Rešitev:**

1. Pozitivna smer naj bo smer gibanja. Rezultanta kaže nazaj, zato hitrost pada: avto ima pojemek.
2. Velikost pojemka: $a = \dfrac{6000\,\mathrm{N}}{1200\,\mathrm{kg}} = 5\,\mathrm{m/s^2}$. Vsako sekundo izgubi $5\,\mathrm{m/s}$ hitrosti.
3. Čas: $t = \dfrac{20\,\mathrm{m/s}}{5\,\mathrm{m/s^2}} = 4\,\mathrm{s}$, ker mora izgubiti vso hitrost.
4. Pot: $s = 20\,\mathrm{m/s}\cdot 4\,\mathrm{s} - \dfrac{1}{2}\cdot 5\,\mathrm{m/s^2}\cdot(4\,\mathrm{s})^2 = 80\,\mathrm{m} - 40\,\mathrm{m} = 40\,\mathrm{m}$.
5. Odgovor: avto zavira $4\,\mathrm{s}$ in se ustavi po $40\,\mathrm{m}$. Poln avto (večja masa) bi pri isti sili zaviral dlje.

### Primer 3 (težji): dvigalo

Oseba z maso $70\,\mathrm{kg}$ stoji v dvigalu nakupovalnega središča na tehtnici. Dvigalo se začne gibati navzgor s pospeškom $1{,}2\,\mathrm{m/s^2}$. Kolikšno silo kaže tehtnica? Vzemi $g = 9{,}8\,\mathrm{m/s^2}$.

**Podatki:** $m = 70\,\mathrm{kg}$, $a = 1{,}2\,\mathrm{m/s^2}$ (navzgor), $g = 9{,}8\,\mathrm{m/s^2}$
**Iščemo:** silo podlage $F_\mathrm{p}$, ki jo kaže tehtnica

:::formula
Drugi Newtonov zakon s pozitivno smerjo navzgor: $F_\mathrm{p} - F_\mathrm{g} = m\,a$, kjer je $F_\mathrm{g} = m\,g$
:::

**Rešitev:**

1. Na osebo delujeta dve sili: teža $F_\mathrm{g}$ navzdol in sila podlage $F_\mathrm{p}$ navzgor. Tehtnica kaže prav silo podlage (po tretjem zakonu je enaka sili, s katero oseba pritiska na tehtnico).
2. Pozitivna smer naj bo navzgor, saj v to smer pospešujemo.
3. Zapišemo drugi zakon: $F_\mathrm{p} - F_\mathrm{g} = m\,a$.
4. Izrazimo: $F_\mathrm{p} = m\,g + m\,a = m\,(g + a)$.
5. Vstavimo: $F_\mathrm{p} = 70\,\mathrm{kg}\cdot(9{,}8 + 1{,}2)\,\mathrm{m/s^2} = 70\cdot 11\,\mathrm{N} = 770\,\mathrm{N}$.
6. Primerjava: teža je $70\cdot 9{,}8 = 686\,\mathrm{N}$, rezultanta $770\,\mathrm{N} - 686\,\mathrm{N} = 84\,\mathrm{N} = m\,a$ kaže navzgor. Tehtnica kaže več, ker moramo osebo ne le držati, ampak tudi pospeševati navzgor. To se ujema z občutkom, da te ob speljevanju dvigala pritisne k tlom.
7. Odgovor: tehtnica kaže silo $770\,\mathrm{N}$.

:::risba skica
opis: Oseba v dvigalu kot pravokotnik. Navzgor kaže puščica sile podlage 770 N, navzdol krajša puščica teže 686 N. Črtkana vodoravna črta označuje višino 686 N; ob delu puščice sile podlage nad njo kaže puščica rezultante 84 N navzgor. Levo je puščica pospeška 1,2 m/s² navzgor.
območje: -7; -7,5 .. 7; 8,5
enota: 20
pravokotnik: -0,6; -1 .. 0,6; 1 | siva
puščica: 0; 0 -> 0; 7,7 | F_p = 770 N | desno | zelena
puščica: 0; 0 -> 0; -6,86 | F_g = 686 N | desno | modra
puščica: -2,5; -1 -> -2,5; 1,4 | a = 1,2 m/s^2 | levo | oranžna
črta: -0,7; 6,86 -> 0,7; 6,86 | siva črtkano
napis: -0,8; 6,86 | 686 N | levo | siva
puščica: 1,2; 6,86 -> 1,2; 7,7 | F_r = 84 N | desno | rdeča
podnapis: Puščica sile podlage je za 84 N daljša od puščice teže (črtkana črta kaže višino 686 N); presežek je rezultanta, ki kaže navzgor, v smeri pospeška.
:::

### Primer 4 – zdaj ti: izstrelitev rakete

Po podatkih SpaceX za Falcon 9 Block 5 ima raketa ob vzletu maso $549\,\mathrm{t}$, motorji pa jo ob tleh potiskajo navzgor s silo približno $7{,}6\,\mathrm{MN}$. Kolikšen je njen pospešek v prvem trenutku? Zračni upor zanemari, $g = 9{,}8\,\mathrm{m/s^2}$.

**Podatki:** $m = 549\,\mathrm{t} = 549\,000\,\mathrm{kg}$, $F = 7{,}6\,\mathrm{MN} = 7\,600\,000\,\mathrm{N}$ (navzgor), $g = 9{,}8\,\mathrm{m/s^2}$
**Iščemo:** pospešek $a$

:::formula
Pozitivna smer navzgor: $F - F_\mathrm{g} = m\,a$, kjer je $F_\mathrm{g} = m\,g$
:::

**Rešitev:**

1. Na raketo delujeta potisna sila navzgor in teža navzdol, zato rezultanta ni kar potisna sila.
2. Teža: $F_\mathrm{g} = 549\,000\,\mathrm{kg} \cdot 9{,}8\,\mathrm{m/s^2} = 5\,380\,200\,\mathrm{N}$.
3. Izračunaj rezultanto in pospešek sam, nato preveri:

:::premisli
Kolikšna sta $F_\mathrm{r}$ in $a$?
---
$F_\mathrm{r} = 7\,600\,000\,\mathrm{N} - 5\,380\,200\,\mathrm{N} = 2\,219\,800\,\mathrm{N}$, $a = \dfrac{2\,219\,800\,\mathrm{N}}{549\,000\,\mathrm{kg}} \approx 4{,}0\,\mathrm{m/s^2}$. Brez teže bi dobil napačnih $13{,}8\,\mathrm{m/s^2}$. Med letom gorivo zgoreva, masa pada, zato pospešek raste.
:::

## Pogoste napake

- **»Sila je potrebna za gibanje.«** Tako je mislil Tim. Voziček pa ustavita trenje in upor koles. Po prvem zakonu telo brez rezultante sil nadaljuje enakomerno gibanje. Sila je potrebna za *spremembo* gibanja (pospešek), ne za enakomerno gibanje.
- **Ena sila namesto rezultante.** Učenec v $F = m\,a$ vstavi samo vlečno ali potisno silo (pri raketi $7{,}6\,\mathrm{MN}$) ali pa vse sile sešteje brez predznakov. V $F_\mathrm{r} = m\,a$ nastopa rezultanta: sile v nasprotnih smereh odštevamo, tudi trenje in težo.
- **Sili akcije in reakcije se »izničita«.** Ker sta enako veliki in nasprotni, ju učenec sešteje in dobi nič. Delujeta na različni telesi, zato ju ne seštevamo pri istem telesu. Zato se npr. voziček, ki ga potiskaš, lahko giblje, čeprav on tebe potiska nazaj z enako veliko silo.
- **Mešanje mase in teže.** »Astronavt na Luni ima manjšo maso.« Ne: manjša je njegova teža, ker je $g$ tam manjši; masa (v $\mathrm{kg}$) je povsod enaka. Teža je sila v $\mathrm{N}$, $F_\mathrm{g} = m\,g$.
- **»Večja sila, večji pospešek, ne glede na maso.«** Kdor primerja le sile, pričakuje enak pospešek pri enaki sili. Pospešek je obratno sorazmeren z maso: ista sila da telesu z dvakrat večjo maso pol manjši pospešek.

## Povzetek

- Sila je vektor, enota je $1\,\mathrm{N} = 1\,\mathrm{kg\,m/s^2}$. Več sil seštejemo v rezultanto.
- **1. zakon:** če je $F_\mathrm{r} = 0$, telo miruje ali se enakomerno giblje po premici.
- **2. zakon:** $F_\mathrm{r} = m\,a$; pospešek ima smer rezultante.
- **3. zakon:** sili vzajemnega delovanja sta enako veliki, nasprotno usmerjeni in delujeta na različni telesi.
- Teža: $F_\mathrm{g} = m\,g$; trenje kaže nasprotno od gibanja.
- Pri nalogah: skica, vse sile, izbira smeri, $F_\mathrm{r} = m\,a$ s predznaki.

## Drugače: Z analogijo

Predstavljaj si hitrost kot stanje na bančnem računu, rezultanto pa kot **neto priliv**: prilivi minus odlivi v enem mesecu.

- Če je neto priliv nič, se stanje ne spremeni, čeprav denar teče v obe smeri. Tako je z vozičkom, ki ga potiskaš s $10\,\mathrm{N}$ proti uporom $10\,\mathrm{N}$: sile delujejo, hitrost pa ostane. To je prvi zakon.
- Če ni ne prilivov ne odlivov, stanje ostane, kakršno je; ne pade samo od sebe na nič. Tudi Voyager za svojo hitrost ne potrebuje »priliva« sile.
- Masa je kot število ljudi, ki si delijo skupni račun; hitrost je stanje *na osebo*. Isti neto priliv $40\,€$ dvigne stanje na osebo v dvočlanski družini za $20\,€$, v štiričlanski le za $10\,€$. Isto velja za $a = \dfrac{F_\mathrm{r}}{m}$: ista rezultanta, dvojna masa, pol manjši pospešek.

Analogija ima mejo: denar nima smeri, sila in hitrost jo imata. Zato sile v nasprotnih smereh odštevamo.

## Drugače: Bolj natančno

**Prvi zakon kot poseben primer drugega.** Če je $F_\mathrm{r} = 0$, je $a = 0$, torej se hitrost ne spreminja. Prvi zakon hkrati določa, kdaj zakoni sploh veljajo: v **inercialnih opazovalnih sistemih**, to so sistemi, ki mirujejo ali se enakomerno gibljejo po premici. V pospešenem sistemu (npr. v zavijajočem avtobusu) se zdi, da na telesa delujejo dodatne sile, ki jih v inercialnem sistemu ni.

**Pospeška pri vzajemnem delovanju.** Sila $\vec F_{12}$ pospeši telo 2, sila $\vec F_{21}$ pa telo 1. Pospeška sta po velikosti $a_1 = F/m_1$ in $a_2 = F/m_2$, zato telo z manjšo maso pospeši bolj.

**Sile v dveh smereh.** Drugi zakon velja za vsako smer posebej: vodoravne sile določajo vodoravni pospešek, navpične navpičnega. Zato smo v Primeru 1 navpični sili (težo in silo podlage) lahko izpustili.

## Preveri se

? Poln nakupovalni voziček z maso $25\,\mathrm{kg}$ potiskaš z vodoravno silo $60\,\mathrm{N}$. Upori nanj skupaj delujejo s silo $10\,\mathrm{N}$. Kolikšen je pospešek vozička?
= 2 m/s² | 0,05
~ 2,4 | Vstavil si samo potisno silo. V $F_\mathrm{r} = m\,a$ spada rezultanta, upore odštej.
~ 2,8 | Upore si prištel. Kažejo nasprotno od potiska, zato jih odštejemo.
~ 0,4 | To je pospešek samo zaradi uporov ($10/25$). Na voziček delujeta obe sili.
> Rezultanta je $60\,\mathrm{N} - 10\,\mathrm{N} = 50\,\mathrm{N}$, torej $a = \dfrac{50\,\mathrm{N}}{25\,\mathrm{kg}} = 2\,\mathrm{m/s^2}$.

? Knjiga leži na mizi. Katera sila je po tretjem Newtonovem zakonu par sile podlage, s katero miza deluje na knjigo?
- teža knjige
~ Teža je enako velika in nasprotna, a deluje na isto telo (knjigo). Par po tretjem zakonu deluje na drugo telo.
+ sila knjige na mizo
- sila Zemlje na mizo
~ Ta sila je med Zemljo in mizo, knjiga v njej ne nastopa. Par mora biti med istima telesoma.
> Par sil po tretjem zakonu sta sili med istima telesoma: miza deluje na knjigo, knjiga pa na mizo. Teža knjige (sila Zemlje na knjigo) ni njen par, čeprav sta pri mirujoči knjigi enako veliki, ker delujeta na isto telo.

? Hokejski plošček drsi po gladkem ledu s hitrostjo $3\,\mathrm{m/s}$. Kaj se zgodi, če trenje in zračni upor zanemarimo in ga nihče več ne odbija?
+ Drsi naprej s stalno hitrostjo $3\,\mathrm{m/s}$.
- Postopoma se ustavi, ker mu zmanjka sile.
~ To je Timova zmota: »brez sile se nič ne giblje«. Ustavi ga lahko le sila, npr. trenje, ki pa smo ga zanemarili.
- Takoj se ustavi.
~ Za takojšnjo ustavitev bi potreboval ogromen pospešek, torej veliko silo. Nanj pa ne deluje nobena vodoravna sila.
> Rezultanta je nič, zato je po drugem zakonu tudi pospešek nič: hitrost ostane $3\,\mathrm{m/s}$. Sila je potrebna za spremembo hitrosti, ne za gibanje.

? V trgovini štiri različno polne vozičke potiskaš različno močno. Pri vsakem je podana rezultanta sil (upori so že odšteti) in masa. Razvrsti jih od najmanjšega do največjega pospeška.
1. rezultanta $30\,\mathrm{N}$, masa $20\,\mathrm{kg}$
2. rezultanta $60\,\mathrm{N}$, masa $30\,\mathrm{kg}$
3. rezultanta $45\,\mathrm{N}$, masa $15\,\mathrm{kg}$
4. rezultanta $20\,\mathrm{N}$, masa $5\,\mathrm{kg}$
> Pospeški so $a = \dfrac{F_\mathrm{r}}{m}$: $1{,}5$; $2$; $3$ in $4\,\mathrm{m/s^2}$. Niti sila niti masa sama ne določi vrstnega reda: največji pospešek ima voziček z najmanjšo silo, ker ima zelo majhno maso.

? Graf kaže, kako je pospešek vozička odvisen od rezultante sil nanj. Z grafa odčitaj en par vrednosti in izračunaj maso vozička.
:::risba graf
opis: Premica skozi izhodišče na grafu pospeška a v odvisnosti od rezultante F. Os F gre od 0 do 60 N s črtami na 10 N, os a od 0 do 4 m/s² s črtami na 1 m/s². Premica gre skozi točko pri 30 N in 2 m/s² ter pri 60 N doseže 4 m/s².
x: 0 .. 60 | 10 | F_r (N)
y: 0 .. 4 | 1 | a (m/s^2)
f: x/15 | modra
točka: 30; 2 | | nad
:::
= 15 kg | 0,5
~ 0,07 | Delil si pospešek s silo. Masa je $m = \dfrac{F_\mathrm{r}}{a}$, sila je v števcu.
~ 60 | Pomnožil si silo in pospešek. Iz $F_\mathrm{r} = m\,a$ sledi $m = \dfrac{F_\mathrm{r}}{a}$.
~ 240 | Pomnožil si silo in pospešek ($60\,\mathrm{N}\cdot 4\,\mathrm{m/s^2}$). Masa je $m = \dfrac{F_\mathrm{r}}{a}$.
> Pri $F_\mathrm{r} = 30\,\mathrm{N}$ je $a = 2\,\mathrm{m/s^2}$, zato je $m = \dfrac{30\,\mathrm{N}}{2\,\mathrm{m/s^2}} = 15\,\mathrm{kg}$. Enako dobiš pri $60\,\mathrm{N}$ in $4\,\mathrm{m/s^2}$.

? Nina z maso $60\,\mathrm{kg}$ stoji na tehtnici v dvigalu, ki pelje navzgor in pred zgornjim nadstropjem zavira s pojemkom $1{,}8\,\mathrm{m/s^2}$. Kolikšno silo kaže tehtnica? Vzemi $g = 9{,}8\,\mathrm{m/s^2}$.
= 480 N | 5
~ 696 | Pospešek si prištel kot v Primeru 3. Dvigalo zavira, pospešek kaže navzdol, zato ga odštej: $F_\mathrm{p} = m\,(g - a)$.
~ 588 | To je teža. Tehtnica kaže težo le, ko se dvigalo giblje enakomerno ali miruje.
~ 108 | To je samo $m\,a$, rezultanta. Tehtnica kaže silo podlage, ne rezultante.
> Pozitivna smer naj bo navzgor; pospešek je $-1{,}8\,\mathrm{m/s^2}$. Iz $F_\mathrm{p} - m\,g = m\,a$ sledi $F_\mathrm{p} = 60\,\mathrm{kg}\cdot(9{,}8 - 1{,}8)\,\mathrm{m/s^2} = 480\,\mathrm{N}$, manj od teže $588\,\mathrm{N}$. Zato se ob ustavljanju dvigala počutiš lažjega.

? Nika rešuje nalogo: »Astronavt z maso $80\,\mathrm{kg}$ se v vesoljski postaji odrine od stene s silo $160\,\mathrm{N}$.« Piše: »Stena potiska astronavta s $160\,\mathrm{N}$, on steno s $160\,\mathrm{N}$ nazaj. Sili se izničita, zato je med odrivom $a = 0$.« Kje je napaka?
- Napake ni, astronavt res ne pospeši.
~ Astronavt se od stene odmakne, torej je pospešil. Sklep »$a = 0$« nasprotuje temu, kar vidimo.
- Sila stene na astronavta je manjša, ker je stena težja.
~ Po tretjem zakonu sta sili vedno enako veliki, ne glede na maso teles.
+ Sili delujeta na različni telesi, zato ju ne smemo seštevati; na astronavta deluje $160\,\mathrm{N}$ in $a = 2\,\mathrm{m/s^2}$.
- Namesto mase bi morala vzeti težo astronavta.
~ V $F_\mathrm{r} = m\,a$ nastopa masa v $\mathrm{kg}$, ne teža. Napaka je drugje.
> Na astronavta deluje le sila stene, $a = \dfrac{160\,\mathrm{N}}{80\,\mathrm{kg}} = 2\,\mathrm{m/s^2}$. Sila astronavta deluje na steno (postajo) in pospeši njo.

? Drsalca z masama $50\,\mathrm{kg}$ in $75\,\mathrm{kg}$ stojita na ledu in se odrineta drug od drugega. Lažji potisne težjega s silo $150\,\mathrm{N}$. Kolikšen je med odrivom pospešek težjega drsalca?
= 2 m/s² | 0,05
~ 3 | To je pospešek lažjega drsalca ($150/50$). Težji ima večjo maso.
~ 0 | Sili akcije in reakcije se ne izničita, ker delujeta na različna drsalca.
~ 1,2 | Silo si delil z vsoto mas. Na težjega deluje le sila lažjega, deli z njegovo maso.
> Na težjega deluje $150\,\mathrm{N}$, zato je $a = \dfrac{150\,\mathrm{N}}{75\,\mathrm{kg}} = 2\,\mathrm{m/s^2}$. Lažji dobi po tretjem zakonu enako veliko silo nazaj in pospešek $3\,\mathrm{m/s^2}$.

:::simboli
F_{\mathrm{r}} | rezultanta sil | F_\mathrm{r} = m\,a | N | F_r = 0: telo miruje ali se giblje premo enakomerno
m | masa | | kg
a | pospešek | a = \dfrac{F_\mathrm{r}}{m} | m/s^2
v | hitrost | | m/s
v_0 | začetna hitrost | | m/s
F | sila (potisna ali vlečna) | | N
F_{\mathrm{tr}} | sila trenja | | N | v tej lekciji vedno podana
\vec F_{12} | sila prvega telesa na drugo | \vec F_{21} = -\vec F_{12} | N | tretji Newtonov zakon
\vec F_{21} | sila drugega telesa na prvo | | N
F_{\mathrm{p}} | sila podlage | | N | to kaže tehtnica
F_{\mathrm{g}} | teža | F_\mathrm{g} = m\,g | N
g | težni pospešek | | m/s^2 | približno 9,8 m/s²
s | pot | s = v_0 t - \dfrac{1}{2}a t^2 | m | pri zaviranju; pri $v_0 = 0$ je $s = \frac{1}{2}a t^2$
t | čas | | s
:::

<<RACUN
vrednost: 50-20 | 30
vrednost: (50-20)/10 | 3
vrednost: 6000/1200 | 5
vrednost: 20/5 | 4
vrednost: 20*4-0.5*5*4^2 | 40
vrednost: 1200*9.8 | 11760
vrednost: 770-686 | 84
vrednost: 1+(20-10)/20*4 | 3
vrednost: 20*0.5 | 10
vrednost: 60*4 | 240
vrednost: 30/20 | 1.5
vrednost: 60/30 | 2
vrednost: 45/15 | 3
vrednost: 60*(9.8-1.8) | 480
vrednost: 60*9.8 | 588
vrednost: 60*(9.8+1.8) | 696
vrednost: 0.5*3*4^2 | 24
vrednost: 70*(9.8+1.2) | 770
vrednost: 70*9.8 | 686
vrednost: 549000*9.8 | 5380200
vrednost: (7600000-5380200)/549000 | 4.0
vrednost: 7600000/549000 | 13.8
vrednost: (60-10)/25 | 2
vrednost: 30/2 | 15
vrednost: 160/80 | 2
vrednost: 150/75 | 2
vrednost: 150/50 | 3
vrednost: 150/125 | 1.2
vrednost: 20/5 | 4
enote: 1*N | 1*kg*m/s^2
>>
