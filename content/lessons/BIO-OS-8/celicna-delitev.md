---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec Jan je med odmorom rekel: »Dojenček in odrasel imata enako število celic. Ko rasteš, se tvoje celice samo napihnejo, kot balončki.« Zveni logično, a je narobe.

Pomisli na zid, ki ga zidar podaljšuje. Zid ne zraste tako, da bi se opeke povečale. Zidar doda nove opeke, vsaka je enako velika kot prejšnje. Tvoje telo raste podobno: celic je vedno več, posamezna celica pa ostane majhna. Nove celice nastanejo z **delitvijo celic**.

Na koncu boš znal Janu pojasniti, zakaj celica ne more rasti v nedogled, kako naredi kopijo svojih navodil in kako iz ene same celice nastane celo telo.

## Razlaga

Snov gradimo po korakih, kot hišo: najprej temelj, nato vsako nadstropje posebej. Za vsakim korakom je kratko vprašanje za preverjanje.

**Korak 1: celica raste.** Mlada celica vsrkava snovi skozi membrano in iz njih izdeluje nove dele: beljakovine, membrane, mitohondrije. Pri tem se poveča. Tej fazi rečemo **rast celice**.

*Preveri:* Skozi kateri del celice pridejo snovi za rast? *(Skozi celično membrano.)*

**Korak 2: meja rasti.** Celica, ki postane prevelika, ima težavo. Vse, kar potrebuje (kisik, glukoza), mora priti skozi membrano, torej skozi njeno površino. Poraba pa je odvisna od prostornine notranjosti. Ko celica raste, prostornina narašča hitreje kot površina.

Mizar bi to preveril z leseno kocko z robom $a$. Njena površina in prostornina sta:

$$P = 6 \cdot a^2$$

$$V = a^3$$

Če rob podvojiš, se površina poveča štirikrat, prostornina pa osemkrat. Na vsak kubični centimeter notranjosti pride pol manj površine. Zato se celica, ko doseže določeno velikost, raje razdeli na dve manjši.

:::premisli
Celica bi rasla tako, da bi se njen premer potrojil. Kaj napoveš: ali bi bila preskrba notranjosti boljša ali slabša kot prej, in zakaj?
---
Slabša. Površina bi se povečala $9$-krat ($3 \cdot 3$), prostornina pa $27$-krat ($3 \cdot 3 \cdot 3$). Na enoto prostornine bi prišla le tretjina prejšnje površine, zato snovi ne bi dovolj hitro prišle do sredine.
:::

**Korak 3: podvojitev DNA.** V jedru je **DNA**, navodilo za delovanje celice. Shranjena je v **kromosomih**, nitastih zgradbah iz DNA: vsak kromosom je ena dolga molekula DNA. Človeška telesna celica ima $46$ kromosomov. Preden se celica razdeli, naredi natančno kopijo vse DNA. Vsak kromosom ima potem dve enaki kopiji (dve molekuli DNA), ki sta na sredini sprijeti, zato je podoben črki X.

*Preveri:* Koliko kopij DNA ima vsak kromosom tik pred delitvijo? *(Dve enaki.)*

**Korak 4: mitoza.** **Mitoza** je delitev, pri kateri iz ene celice nastaneta dve celici z enako DNA. Prvotni celici rečemo materinska, novima hčerinski. Poteka v nekaj korakih:

1. Kromosomi se zgostijo in postanejo vidni pod mikroskopom. Jedrna ovojnica razpade.
2. Kromosomi se uredijo v vrsto na sredini celice.
3. Kopiji vsakega kromosoma se ločita in potujeta na nasprotna konca celice.
4. Okoli vsake skupine kromosomov nastane novo jedro.
5. Razdeli se še citoplazma. Pri živalskih celicah se membrana na sredini zažme, pri rastlinskih na sredini zraste nova celična stena.

Vsaka hčerinska celica dobi po eno kopijo vsakega kromosoma, torej spet $46$. Obe imata enako DNA kot materinska celica.

V simulaciji spodaj »Kaj se zgodi pri delitvi celice« razvrsti dogodke v tri skupine: rast pred delitvijo, mitoza in po delitvi. Opazi, v katero skupino spada podvojitev DNA.

:::premisli
Zakaj se mora DNA podvojiti, še preden se celica razdeli? Kaj bi se zgodilo, če bi se kromosomi le razdelili na dve polovici?
---
Vsaka hčerinska celica bi dobila le $23$ kromosomov, torej pol navodil. Manjkala bi ji navodila za marsikatero snov, zato ne bi delovala pravilno. S podvojitvijo dobi vsaka celica celoten zapis.
:::

**Korak 5: iz ene celice celo telo.** Tvoje življenje se je začelo z eno samo celico, z **oplojeno jajčno celico**. Ta se je razdelila na dve, vsaka od teh spet na dve in tako naprej. Število celic se pri vsakem krogu delitev podvoji:

| Krog delitev $n$ | Število celic $N$ |
|---|---|
| 0 | 1 |
| 1 | 2 |
| 2 | 4 |
| 3 | 8 |
| 4 | 16 |

Vzorec zapišemo kot

$$N = 2^n$$

*Preveri:* Koliko celic nastane iz ene celice po $3$ krogih delitev? *(Osem.)*

Pozneje se celice ne delijo več vse hkrati. Postopoma postanejo različne: nekatere postanejo mišične, druge živčne ali kožne. O tem govori naslednja lekcija.

**Korak 6: rast in obnova tkiv.** Tudi pri odraslem se mnoge celice delijo. Koža se nenehno obnavlja: odmrle celice odpadejo, nove nastanejo v spodnjih plasteh. Ko se urežeš, se celice ob robu rane delijo in jo zaprejo. Kost po zlomu zraste skupaj. Pri rastlinah se celice najhitreje delijo v vršičkih korenin in poganjkov, zato tam rastejo v dolžino. Nekatere celice pa se skoraj ne delijo več, na primer večina živčnih celic.

*Preveri:* Kje v korenini čebule bi iskal celice med mitozo? *(V vršičku korenine.)*

## Rešeni primeri

### Primer 1: kromosomi čebule

Celica iz vršička korenine čebule ima $16$ kromosomov. Koliko molekul DNA je v jedru tik pred mitozo in koliko kromosomov dobi vsaka hčerinska celica?

**Podatki:** število kromosomov $k = 16$; DNA se pred delitvijo podvoji
**Iščemo:** število molekul DNA $D$ tik pred mitozo in število kromosomov v hčerinski celici

:::formula
Pred mitozo ima vsak kromosom dve kopiji: $D = 2 \cdot k$. Vsaka hčerinska celica dobi po eno kopijo vsakega kromosoma.
:::

**Rešitev:**

1. Vsak kromosom ima pred mitozo dve kopiji, ker se je DNA podvojila: $D = 2 \cdot 16 = 32$.
2. Med mitozo se kopiji vsakega kromosoma ločita, zato vsaka hčerinska celica dobi $16$ kromosomov.
3. Odgovor: tik pred mitozo je v jedru $32$ molekul DNA, vsaka hčerinska celica pa ima $16$ kromosomov, enako kot materinska.

### Primer 2: lesena kocka kot model celice

V delavnici izdelaš dva modela celice: leseno kocko z robom $2\,\mathrm{cm}$ in kocko z robom $4\,\mathrm{cm}$. Koliko površine pride pri vsaki kocki na $1\,\mathrm{cm^3}$ prostornine?

**Podatki:** rob male kocke $a_1 = 2\,\mathrm{cm}$, rob velike kocke $a_2 = 4\,\mathrm{cm}$
**Iščemo:** razmerje $\dfrac{P}{V}$ za obe kocki

:::formula
$P = 6 \cdot a^2$, $V = a^3$, nato $\dfrac{P}{V}$
:::

**Rešitev:**

1. Mala kocka, površina: $P_1 = 6 \cdot 2^2 = 24$, torej $24\,\mathrm{cm^2}$.
2. Mala kocka, prostornina: $V_1 = 2^3 = 8$, torej $8\,\mathrm{cm^3}$.
3. Razmerje: $\dfrac{24}{8} = 3$. Na vsak $\mathrm{cm^3}$ pride $3\,\mathrm{cm^2}$ površine.
4. Velika kocka: $P_2 = 6 \cdot 4^2 = 96$ ($\mathrm{cm^2}$) in $V_2 = 4^3 = 64$ ($\mathrm{cm^3}$).
5. Razmerje: $\dfrac{96}{64} = 1{,}5$. Na vsak $\mathrm{cm^3}$ pride le $1{,}5\,\mathrm{cm^2}$ površine.
6. Odgovor: mala kocka ima $3\,\mathrm{cm^2}$, velika pa $1{,}5\,\mathrm{cm^2}$ površine na $1\,\mathrm{cm^3}$. Večji model ima na enoto prostornine pol manj površine, zato bi velika celica težje oskrbovala svojo notranjost.

### Primer 3: od oplojene jajčne celice do kepice celic

Recimo, da se celice zgodnjega zarodka delijo vse hkrati, vsakih $20$ ur. Po koliko krogih delitev je celic prvič vsaj $100$? Koliko časa to traja?

**Podatki:** začetek $1$ celica; čas ene delitve $T = 20\,\mathrm{h}$; iskano število celic vsaj $100$
**Iščemo:** število krogov $n$ in skupni čas $t$

:::formula
$N = 2^n$, nato $t = n \cdot T$
:::

**Rešitev:**

1. Število celic se pri vsakem krogu podvoji, zato računamo potence števila $2$, ne seštevamo.
2. Po $6$ krogih: $2^6 = 64$. To je še manj kot $100$.
3. Zdaj ti: izračunaj, koliko celic je po naslednjem krogu, in nato skupni čas.

:::premisli
Koliko celic je po $7$ krogih in koliko ur ter približno dni to traja?
---
$2^7 = 128$, kar je prvič vsaj $100$. Čas: $t = 7 \cdot 20\,\mathrm{h} = 140\,\mathrm{h}$, to je približno $5{,}8$ dneva ($140 : 24$), torej slabih $6$ dni.
:::

## Pogoste napake

- **»Rastemo, ker se celice napihnejo.«** Tako je mislil Jan. Celica lahko zraste le do določene velikosti, ker ima prevelika celica premalo površine za svojo prostornino. Telo raste predvsem zato, ker je celic vedno več. Celice slona in miške so približno enako velike; slon jih ima veliko več.
- **»Pri delitvi se kromosomi razpolovijo, zato ima hčerinska celica pol DNA.«** Pozabljen je korak 3. DNA se pred mitozo podvoji, zato ima vsaka hčerinska celica celoten zapis: človeška $46$ kromosomov, ne $23$.
- **»Po $5$ delitvah je $10$ celic.«** Kdor računa $2 \cdot 5$, si predstavlja, da vsakič nastaneta le dve novi celici. V resnici se razdeli vsaka celica, zato se število podvoji: $2^5 = 32$.
- **»Hčerinski celici sta drugačni od materinske.«** Pri mitozi nastaneta celici z enako DNA. Mitoza ne prinese novih lastnosti, le več enakih celic.
- **»Vse celice se ves čas enako hitro delijo.«** Kožne celice se delijo pogosto, večina živčnih celic pa skoraj nikoli. Zato se koža hitro zaceli, poškodba živcev pa težko.

## Povzetek

- Organizem raste, ker se celice delijo; posamezna celica ostane majhna.
- Celica najprej raste. Prevelika celica ima premalo površine za svojo prostornino, zato se razdeli.
- Pred delitvijo se DNA podvoji: vsak kromosom ima dve enaki kopiji.
- Mitoza: kromosomi se uredijo na sredini, kopiji se ločita na nasprotna konca, nastaneta dve jedri, nato dve hčerinski celici z enako DNA kot materinska (pri človeku po $46$ kromosomov).
- Iz oplojene jajčne celice nastane telo; po $n$ krogih delitev je $N = 2^n$ celic.
- Z mitozo rastejo in se obnavljajo tkiva (koža, celjenje ran, kosti, vršički korenin). Večina živčnih celic se ne deli več.

## Drugače: Na sliki

:::risba skica
opis: Tri stopnje delitve, od leve proti desni. Levo je ena celica z jedrom, v katerem sta dva kromosoma. Na sredini je celica, v kateri sta dva podvojena kromosoma v obliki črke X v navpični vrsti na sredini. Desno sta dve manjši hčerinski celici, vsaka ima jedro z dvema kromosomoma. Med stopnjami sta puščici.
območje: 0; -1 .. 12; 5
enota: 24
krog: 2; 2,5 | 1,6 | modra
krog: 2; 2,5 | 0,8 | siva črtkano
črta: 1,7; 2,2 -> 1,7; 2,8 | oranžna debelo
črta: 2,3; 2,2 -> 2,3; 2,8 | oranžna debelo
puščica: 3,8; 2,5 -> 4,2; 2,5 | | nad | puščica
krog: 6; 2,5 | 1,6 | modra
črta: 5,8; 2,75 -> 6,2; 3,25 | oranžna debelo
črta: 5,8; 3,25 -> 6,2; 2,75 | oranžna debelo
črta: 5,8; 1,75 -> 6,2; 2,25 | oranžna debelo
črta: 5,8; 2,25 -> 6,2; 1,75 | oranžna debelo
puščica: 7,8; 2,5 -> 8,6; 2,5 | | nad | puščica
krog: 10; 3,6 | 0,9 | modra
krog: 10; 3,6 | 0,45 | siva črtkano
črta: 9,85; 3,4 -> 9,85; 3,8 | oranžna debelo
črta: 10,15; 3,4 -> 10,15; 3,8 | oranžna debelo
krog: 10; 1,4 | 0,9 | modra
krog: 10; 1,4 | 0,45 | siva črtkano
črta: 9,85; 1,2 -> 9,85; 1,6 | oranžna debelo
črta: 10,15; 1,2 -> 10,15; 1,6 | oranžna debelo
napis: 2; -0,5 | 1. DNA ×2 | sredina
napis: 6; -0,5 | 2. na sredini | sredina
napis: 10; -0,5 | 3. dve celici | sredina
podnapis: Mitoza v treh slikah: celica podvoji DNA, podvojena kromosoma sta na sredini, nastaneta dve enaki hčerinski celici.
:::

Sledi kromosomom od leve proti desni. Na sredini ima vsak kromosom obliko črke X: to sta dve enaki kopiji, sprijeti na sredini. Ko se kopiji ločita, gre ena v zgornjo, druga v spodnjo celico. Zato ima desno vsaka celica spet enako število kromosomov kot celica levo.

Podobno ravna gradbena ekipa, ki se razdeli na dve gradbišči: preden se razdeli, fotokopira celoten načrt hiše. Vsaka polovica ekipe odnese en cel izvod, ne pol načrta.

## Drugače: Bolj natančno

Čas med dvema delitvama se imenuje **interfaza**. V njej celica raste in podvoji DNA. Skupaj z mitozo tvori **celični cikel**.

Dve kopiji kromosoma se imenujeta **sestrski kromatidi**. Sprijeti sta v točki, ki ji rečemo centromera. Mitozo biologi delijo na štiri faze:

- **profaza**: kromosomi se zgostijo, jedrna ovojnica razpade, nastane delitveno vreteno iz beljakovinskih niti;
- **metafaza**: kromosomi se uredijo v ravnino na sredini celice;
- **anafaza**: niti vretena potegnejo sestrski kromatidi na nasprotna pola;
- **telofaza**: nastaneta dve novi jedri, nato se razdeli citoplazma.

Zaporedje si zapomniš s prvimi zlogi: pro, meta, ana, telo.

Pravilo $N = 2^n$ velja le, dokler se vse celice delijo hkrati. V resnici se celice kmalu začnejo deliti različno hitro, nekatere pa se nehajo deliti. Kljub temu je zanimivo: $2^{45}$ je približno $35\,000$ milijard, kar je že več od števila celic odraslega človeka (okoli $30\,000$ milijard).

## Preveri se

? Katera trditev o mitozi drži?
- Hčerinski celici imata vsaka polovico DNA materinske celice.
~ DNA se pred mitozo podvoji, zato vsaka hčerinska celica dobi celoten zapis, ne polovice.
+ Hčerinski celici imata enako DNA kot materinska celica.
- Pri mitozi nastanejo celice z novimi lastnostmi.
~ Mitoza naredi enake kopije. Novih lastnosti ne prinese.
- Mitoza poteka le pri rastlinah.
~ Mitoza poteka pri živalih, rastlinah in glivah, na primer v koži ali v vršičku korenine.
> Ker se DNA podvoji in se kopiji vsakega kromosoma razdelita, sta hčerinski celici genetsko enaki materinski.

? Celica v gojišču se razdeli vsakih $12$ ur. Vse nove celice se delijo enako. Koliko celic je iz ene celice po $2$ dneh?
= 16
~ 8 | To je $2 \cdot 4$. Število celic se pri vsakem krogu podvoji, zato računaš $2^4$, ne $2 \cdot 4$.
~ 4 | $4$ je število krogov delitev ($48 : 12$), ne število celic.
~ 32 | To bi bilo po $5$ krogih. V $48$ urah so le $4$ krogi po $12$ ur.
> $2$ dneva je $48\,\mathrm{h}$, to je $48 : 12 = 4$ krogi. Število celic: $2^4 = 16$.

? Lana je zapisala: »Človeška celica ima $46$ kromosomov. Pri mitozi se razdelijo na dve polovici, zato ima vsaka hčerinska celica $23$ kromosomov.« Kje je napaka?
- Človeška celica nima $46$ kromosomov.
~ Telesna celica človeka res ima $46$ kromosomov; napaka je v drugem delu.
+ Pozabila je, da se DNA pred mitozo podvoji, zato ima vsaka hčerinska celica $46$ kromosomov.
- Hčerinska celica dobi $92$ kromosomov.
~ $92$ molekul DNA je v celici tik pred mitozo. Te se razdelijo na dve celici, v vsako po $46$.
> Pred mitozo ima vsak od $46$ kromosomov dve kopiji. Pri mitozi gre ena kopija v vsako celico, zato ima vsaka hčerinska celica spet $46$ kromosomov.

? Primerjaj celico tik pred mitozo in hčerinsko celico takoj po mitozi. Kaj velja za količino DNA?
- Obe imata enako količino DNA, ker se količina DNA pri delitvi ne spreminja.
~ Vrsta navodil je ista, količina pa ne: pred mitozo je vsa DNA podvojena.
+ Celica pred mitozo ima dvakrat več DNA kot hčerinska celica po mitozi.
- Hčerinska celica ima dvakrat več DNA, ker je nova.
~ Nova celica dobi le eno kopijo vsakega kromosoma. Dve kopiji ima celica pred delitvijo.
> Pred mitozo se DNA podvoji. Med mitozo se ta podvojena DNA razdeli na dve celici, zato ima vsaka polovico tega, kar je imela celica tik pred delitvijo.

? Pri obdelavi lesa si odrgneš kožo na dlani. Čez dva tedna rane ni več. Kaj se je zgodilo?
- Obstoječe celice ob rani so se povečale in prekrile rano.
~ Celica ne more rasti v nedogled, ker ima prevelika premalo površine za svojo prostornino. Rano zaprejo nove celice.
+ Celice ob robu rane so se delile z mitozo in nastale nove kožne celice z enako DNA.
- Rano so zaprle živčne celice iz kože.
~ Večina živčnih celic se ne deli. Rano zaprejo kožne celice, ki se pogosto delijo.
> Celjenje rane je rast tkiva: kožne celice se delijo z mitozo, nove celice so enake starim in zapolnijo poškodbo.

<<RACUN
vrednost: 2*16 | 32
vrednost: 6*2^2 | 24
vrednost: 2^3 | 8
vrednost: 24/8 | 3
vrednost: 6*4^2 | 96
vrednost: 4^3 | 64
vrednost: 96/64 | 1.5
vrednost: 2^6 | 64
vrednost: 2^7 | 128
vrednost: 7*20 | 140
vrednost: 140/24 | 5.8
vrednost: 48/12 | 4
vrednost: 2^4 | 16
vrednost: 2^5 | 32
vrednost: 46*2 | 92
>>

:::simboli
N | število celic | N = 2^n | – | velja, ko se vse celice delijo hkrati
n | število krogov delitev | | –
a | rob kocke (model celice) | | cm
P | površina kocke | P = 6 \cdot a^2 | cm^2
V | prostornina kocke | V = a^3 | cm^3
D | število molekul DNA pred mitozo | D = 2 \cdot k | –
k | število kromosomov | | –
t | skupni čas delitev | t = n \cdot T | h
T | čas enega kroga delitev | | h
:::
