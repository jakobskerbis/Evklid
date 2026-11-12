---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ana gre za tri tedne z vlakom do Lizbone. Na zemljevidu je pot dolga skoraj $3000\,\text{km}$. Doma ostaneta bazilika in fikus. Sosed ji svetuje: »Postavi ju v temno klet. Tam je hladno in zemlja se ne izsuši.«

Ana ni prepričana. Rastlina ne je, pa vendar raste. Od kod sploh dobi snov, iz katere je zgrajena? Iz zemlje? Na satelitskem zemljevidu Slovenije je več kot polovica površine zelene, saj gozd pokriva okoli $58\,\%$ države. Ves ta les je moral nekje nastati.

Odgovor preseneti: večina suhe mase rastline izvira iz **ogljikovega dioksida v zraku**, energijo za to pa daje **svetloba**. Postopku pravimo **fotosinteza**. Ko ga razumeš, znaš Ani tudi svetovati, kam naj postavi lončnice.

## Razlaga

**Zemljevid kloroplasta.** Fotosinteza poteka v **kloroplastih**. V eni palisadni celici lista jih je več deset, vsak je dolg okoli $5\,\mu\text{m}$. Kot mitohondrij ima tudi kloroplast dve membrani, kar podpira endosimbiontsko teorijo: oba sta bila nekoč samostojni bakteriji, ki ju je večja celica sprejela vase. Spodnjo risbo beri kot zemljevid z dvema območjema in cestami med njima.

:::risba skica
opis: Kloroplast kot zemljevid. Velik pravokotnik je kloroplast. Levo je kupček štirih sploščenih mešičkov, tilakoid, zloženih v granum. Nanj od zgoraj levo pada svetloba. Od spodaj vanj vstopa voda, navzdol izstopa kisik. Desno v tekočini, stromi, je krog z napisom Calvinov cikel. Od zgoraj desno vanj vstopa CO₂, navzdol izstopa glukoza. Od tilakoid do cikla vodi puščica ATP in NADPH, nazaj pa puščica ADP in NADP⁺.
območje: 0; 0 .. 10; 8
enota: 30
pravokotnik: 1; 1 .. 9; 7 | zelena
pravokotnik: 1,8; 2,4 .. 3,8; 2,8 | zelena
pravokotnik: 1,8; 3 .. 3,8; 3,4 | zelena
pravokotnik: 1,8; 3,6 .. 3,8; 4 | zelena
pravokotnik: 1,8; 4,2 .. 3,8; 4,6 | zelena
napis: 2,8; 5,1 | tilakoide (granum) | nad
puščica: 0,4; 7,3 -> 1,9; 4,9
napis: 0,5; 7,6 | svetloba | desno
puščica: 2,2; 0,2 -> 2,2; 2,3
napis: 2; 0,6 | H_2O | levo
puščica: 3,4; 2,3 -> 3,4; 0,2
napis: 3,6; 0,6 | O_2 | desno
krog: 7; 3,8 | 1,3 | oranžna
napis: 7; 4,1 | Calvinov | sredina
napis: 7; 3,5 | cikel | sredina
napis: 7; 6,3 | stroma | sredina
puščica: 4,1; 4,3 -> 5,7; 4,3
napis: 4,9; 4,6 | ATP, NADPH | nad
puščica: 5,7; 3,3 -> 4,1; 3,3
napis: 4,9; 3 | ADP, NADP^+ | pod
puščica: 9,7; 7,6 -> 8,1; 4,8
napis: 9,6; 7,6 | CO_2 | levo
puščica: 7; 2,5 -> 7; 0,2
napis: 7,2; 0,6 | glukoza | desno
:::

Na levi so **tilakoide**, sploščeni membranski mešički, zloženi v kupčke kot kovanci. Kupčku rečemo **granum**. Na desni je **stroma**, gosta tekočina z encimi. Na tilakoidah poteka prvi del fotosinteze, v stromi drugi. Po »cestah« med njima vozita dve molekuli, ki ju bomo spoznali spodaj.

**Barvila: katero svetlobo list ujame.** V membrano tilakoid so vgrajena **fotosintezna barvila**: zelena **klorofila a in b** ter rumeni in oranžni **karotenoidi**. Klorofil ne vpija vse svetlobe enako, kar kaže premica valovnih dolžin vidne svetlobe v nanometrih ($\text{nm}$):

:::risba premica
opis: Vidna svetloba od 400 do 700 nanometrov. Od 400 do 500 nanometrov je modra svetloba, klorofil jo močno vpija. Od 500 do 600 je zelena, klorofil jo večinoma odbije. Od 600 do 700 je rdeča, klorofil jo močno vpija.
od: 400
do: 700
korak: 50
oznake: 100
interval: 400 .. 500 | vpija modro
interval: 500 .. 600 | odbija zeleno
interval: 600 .. 700 | vpija rdečo
:::

Zelena svetloba se odbije, zato je list zelen. Jeseni klorofil razpade in pokažejo se karotenoidi, ki so bili v listu ves čas: listje porumeni.

:::premisli
Rastlino osvetljujemo z lučjo valovne dolžine $550\,\text{nm}$, enake moči kot prej z lučjo $650\,\text{nm}$. Napovej s pomočjo premice: bo fotosinteza hitrejša, enaka ali počasnejša?
---
Počasnejša. Klorofil velik del zelene svetlobe odbije, zato list ujame manj energije. Pri rdeči luči se vpije večina svetlobe.
:::

**Prvi del, na tilakoidah: svetlobne reakcije.** Klorofil vpije svetlobo. Njena energija vzbudi elektrone v klorofilu, ti pa ga zapustijo in potujejo po membrani. Izgubljene elektrone klorofil nadomesti iz **vode**: voda se razcepi na kisik, elektrone in vodikove ione. Kisik iz celice izstopi kot $\mathrm{O_2}$, za fotosintezo je to stranski produkt. Elektrone in vodik prevzame prenašalec $\mathrm{NADP^+}$, ki postane **NADPH**. Je podoben $\mathrm{NADH}$ pri celičnem dihanju. Hkrati encim ATP-sintaza v isti membrani sestavlja **ATP**.

Na kratko: svetloba in voda dasta kisik, ATP in NADPH.

**Kako vemo, da kisik prihaja iz vode.** Leta 1941 so raziskovalci gojili alge v vodi, v kateri je bil kisik označen s težjim izotopom $^{18}\mathrm{O}$. V drugem poskusu so označili kisik v $\mathrm{CO_2}$.

| Poskus | Označen kisik je v | Izločeni $\mathrm{O_2}$ |
|---|---|---|
| 1 | vodi | označen |
| 2 | $\mathrm{CO_2}$ | ni označen |

Ves kisik, ki ga rastline izločijo, torej izvira iz vode.

**Drugi del, v stromi: vezava $\mathrm{CO_2}$.** V stromi se zavrti **Calvinov cikel**. Encim **rubisko** veže $\mathrm{CO_2}$ iz zraka na sladkor s petimi ogljikovimi atomi. Rubisko je najpogostejša beljakovina na Zemlji. Z energijo iz ATP in vodikom iz NADPH cikel naredi sladkor s tremi ogljikovimi atomi, iz katerega celica sestavi glukozo. Za eno glukozo veže cikel $6$ molekul $\mathrm{CO_2}$ ter porabi $18$ ATP in $12$ NADPH. Izpraznjena ADP in $\mathrm{NADP^+}$ se vrneta na tilakoide, kjer se znova napolnita.

Iz glukoze rastlina naredi škrob za zalogo, saharozo za prevoz po rastlini in celulozo za celične stene. Tako iz plina nastaneta les in listje.

:::premisli
Calvinov cikel svetlobe neposredno ne potrebuje. Zakaj se v temi kljub temu kmalu ustavi?
---
Ker v temi svetlobne reakcije ne delajo novega ATP in NADPH. Cikel porabi, kar je ostalo, nato nima več energije in vodika za vezavo $\mathrm{CO_2}$.
:::

Simulacija spodaj (»Svetlobne reakcije in Calvinov cikel«) ti da kartice z dogodki, ki jih pošlješ na tilakoide ali v stromo. Pri kartici »voda se razcepi in sprosti se kisik« se marsikdo zmoti: kisik nastane na tilakoidah, ne tam, kjer se veže $\mathrm{CO_2}$. V 3D-prikazu tilakoidne membrane si lahko oba dela ogledaš še prostorsko.

**Šele zdaj simboli.** Vse z zemljevida strnemo v eno enačbo:

$$6\,\mathrm{CO_2} + 6\,\mathrm{H_2O} \xrightarrow{\text{svetloba}} \mathrm{C_6H_{12}O_6} + 6\,\mathrm{O_2}$$

Masna bilanca: $264\,\text{g}$ $\mathrm{CO_2}$ in $108\,\text{g}$ vode dasta $180\,\text{g}$ glukoze in $192\,\text{g}$ kisika. Enačba je skrajšana. V $6$ molekulah vode je le $6$ atomov kisika, za $6\,\mathrm{O_2}$ pa jih potrebujemo $12$. V resnici se zato razcepi $12$ molekul vode, $6$ novih pa nastane pri vezavi $\mathrm{CO_2}$. Tako lahko ves kisik izvira iz vode.

Enačba je obrnjena enačba celičnega dihanja, a poteka v drugem organelu in z obratnim tokom energije: fotosinteza energijo svetlobe shrani v glukozo, dihanje jo iz glukoze sprosti v ATP.

Zdaj lahko Ani svetuješ. V temni kleti fotosinteza stoji, dihanje v mitohondrijih pa teče noč in dan. Rastlina tri tedne troši zalogo škroba in nič ne doda. Bolje je svetlo mesto ob oknu, a ne na žgočem soncu, in dobro zalita zemlja.

## Rešeni primeri

### Primer 1: koliko glukoze iz ene porcije $\mathrm{CO_2}$

Celica lista bazilike v Calvinovem ciklu veže $18$ molekul $\mathrm{CO_2}$. Koliko molekul glukoze nastane, koliko ATP in NADPH porabi cikel in koliko molekul kisika se pri tem sprosti na tilakoidah?

**Podatki:** $N_{\mathrm{CO_2}} = 18$; za eno glukozo: $6$ $\mathrm{CO_2}$, $18$ ATP, $12$ NADPH, sprosti se $6$ $\mathrm{O_2}$
**Iščemo:** $N_\mathrm{g}$, število ATP, število NADPH in število molekul $\mathrm{O_2}$

:::formula
$N_\mathrm{g} = \dfrac{N_{\mathrm{CO_2}}}{6}$, nato $N_\mathrm{ATP} = 18 \cdot N_\mathrm{g}$ in $N_\mathrm{NADPH} = 12 \cdot N_\mathrm{g}$
:::

**Rešitev:**

1. Vsaka glukoza ima $6$ ogljikovih atomov, vsak iz enega $\mathrm{CO_2}$: $N_\mathrm{g} = \dfrac{18}{6} = 3$.
2. ATP: $N_\mathrm{ATP} = 18 \cdot 3 = 54$.
3. NADPH: $N_\mathrm{NADPH} = 12 \cdot 3 = 36$.
4. Po enačbi nastane toliko $\mathrm{O_2}$, kolikor se veže $\mathrm{CO_2}$: $6 \cdot 3 = 18$ molekul.
5. Odgovor: nastanejo $3$ molekule glukoze, cikel porabi $54$ ATP in $36$ NADPH, sprosti se $18$ molekul kisika.

### Primer 2: izlet na morje

Družina se z avtom pelje iz Ljubljane v Piran, po zemljevidu $120\,\text{km}$ daleč. Avto izpusti $120\,\text{g}$ $\mathrm{CO_2}$ na kilometer. Koliko glukoze bi morale narediti rastline, da bi vezale ves ta $\mathrm{CO_2}$, in koliko kisika bi ob tem sprostile?

**Podatki:** $s = 120\,\text{km}$; $120\,\text{g}$ $\mathrm{CO_2}$ na km; $264\,\text{g}$ $\mathrm{CO_2}$ da $180\,\text{g}$ glukoze in $192\,\text{g}$ $\mathrm{O_2}$
**Iščemo:** $m_\mathrm{g}$ in $m_{\mathrm{O_2}}$

:::formula
$m_\mathrm{g} = m_{\mathrm{CO_2}} \cdot \dfrac{180}{264}$ in $m_{\mathrm{O_2}} = m_{\mathrm{CO_2}} \cdot \dfrac{192}{264}$
:::

**Rešitev:**

1. Izpust na poti: $m_{\mathrm{CO_2}} = 120 \cdot 120 = 14\,400\,\text{g}$, to je $14{,}4\,\text{kg}$.
2. Mase v enačbi so v stalnem razmerju, zato: $m_\mathrm{g} = 14{,}4 \cdot \dfrac{180}{264} \approx 9{,}82\,\text{kg}$.
3. Kisik: $m_{\mathrm{O_2}} = 14{,}4 \cdot \dfrac{192}{264} \approx 10{,}47\,\text{kg}$.
4. Odgovor: rastline bi morale narediti okoli $9{,}8\,\text{kg}$ glukoze in bi sprostile okoli $10{,}5\,\text{kg}$ kisika.

### Primer 3: gozd na zemljevidu

Na planinskem zemljevidu v merilu $1 : 25\,000$ je gozd narisan kot pravokotnik, velik $4\,\text{cm} \times 2\,\text{cm}$. En hektar tega gozda na leto veže okoli $8\,\text{t}$ $\mathrm{CO_2}$. Koliko kisika gozd sprosti v enem letu?

**Podatki:** merilo $1 : 25\,000$; $a_\mathrm{z} = 4\,\text{cm}$, $b_\mathrm{z} = 2\,\text{cm}$; $8\,\text{t}$ $\mathrm{CO_2}$ na hektar na leto; $264\,\text{g}$ $\mathrm{CO_2}$ da $192\,\text{g}$ $\mathrm{O_2}$
**Iščemo:** $m_{\mathrm{O_2}}$ v enem letu

:::formula
$a = 25\,000 \cdot a_\mathrm{z}$, $P = a \cdot b$, nato $m_{\mathrm{O_2}} = m_{\mathrm{CO_2}} \cdot \dfrac{192}{264}$
:::

**Rešitev:**

1. Prave dolžine: $a = 25\,000 \cdot 4 = 100\,000$, torej $100\,000\,\text{cm}$ ali $1\,\text{km}$. Enako $b = 25\,000 \cdot 2 = 50\,000$, torej $0{,}5\,\text{km}$.
2. Površina: $P = 1 \cdot 0{,}5 = 0{,}5\,\text{km}^2$. En kvadratni kilometer ima $100$ hektarjev, zato je gozd velik $50\,\text{ha}$.
3. Zdaj izračunaj sam letno vezavo $\mathrm{CO_2}$ in kisik, nato preveri:

:::premisli
Koliko $\mathrm{CO_2}$ gozd veže v enem letu in koliko kisika sprosti?
---
$m_{\mathrm{CO_2}} = 50 \cdot 8 = 400\,\text{t}$ na leto. Kisik: $m_{\mathrm{O_2}} = 400 \cdot \dfrac{192}{264} \approx 291\,\text{t}$ na leto.
:::

## Pogoste napake

- **Kisik iz $\mathrm{CO_2}$.** Ker ima $\mathrm{CO_2}$ v imenu kisik, mnogi mislijo, da rastlina »odtrga« ogljik in kisik izpusti. Poskus z označenim kisikom pokaže drugače: ves izločeni $\mathrm{O_2}$ izvira iz vode. Ogljik iz $\mathrm{CO_2}$ se vgradi v glukozo.
- **Podnevi fotosinteza, ponoči dihanje.** Rastlinske celice imajo mitohondrije in dihajo ves čas. Podnevi fotosinteza le prekrije dihanje, zato rastlina navzven oddaja kisik.
- **Calvinov cikel kot »temotna reakcija«, ki teče ponoči.** Svetlobe res ne vpija, a potrebuje sveža ATP in NADPH iz svetlobnih reakcij. Zato teče podnevi in se v temi kmalu ustavi.
- **List je zelen, ker vpija zeleno svetlobo.** Ravno obratno: zeleno svetlobo klorofil večinoma odbije, zato jo vidimo. Vpija modro in rdečo.
- **Rastlina raste iz zemlje.** Iz tal dobi vodo in mineralne snovi, a večina suhe mase je ogljik iz $\mathrm{CO_2}$ v zraku.

## Povzetek

- Fotosinteza poteka v kloroplastih: svetlobne reakcije na tilakoidnih membranah, vezava $\mathrm{CO_2}$ (Calvinov cikel) v stromi.
- Barvila (klorofila a in b, karotenoidi) vpijajo predvsem modro in rdečo svetlobo, zeleno odbijejo.
- Svetlobne reakcije: svetloba vzbudi elektrone klorofila, voda se razcepi, sprosti se $\mathrm{O_2}$, nastaneta ATP in NADPH.
- Kisik, ki ga rastlina izloči, izvira iz vode, ne iz $\mathrm{CO_2}$.
- Calvinov cikel: rubisko veže $\mathrm{CO_2}$; z ATP in NADPH nastane sladkor. Za eno glukozo: $6$ $\mathrm{CO_2}$, $18$ ATP, $12$ NADPH.
- Enačba: $6\,\mathrm{CO_2} + 6\,\mathrm{H_2O} \rightarrow \mathrm{C_6H_{12}O_6} + 6\,\mathrm{O_2}$; rastline poleg tega ves čas tudi dihajo.

## Drugače: Z analogijo

Predstavljaj si kloroplast kot podjetje z dvema oddelkoma in zalogo polnilnih baterij.

- **Tilakoide so sončna elektrarna.** Svetloba na strehi poganja polnjenje baterij: prazne ADP in $\mathrm{NADP^+}$ postanejo polne ATP in NADPH. Za polnjenje NADPH elektrarna potrebuje elektrone, dobi jih iz vode. Kisik je njen »izpuh«.
- **Stroma je tovarna.** S polnimi baterijami sestavlja sladkor iz $\mathrm{CO_2}$, ki ga dostavljajo iz zraka. Prazne baterije pošlje nazaj v polnjenje.
- **Noč.** Elektrarna obstane, tovarna nekaj časa dela z zadnjimi polnimi baterijami, potem se ustavi tudi ona.

Primerjava ima meje: prave baterije se izrabijo, ATP in NADPH pa se lahko polnita in praznita neštetokrat.

## Drugače: Iz vsakdanjega življenja

- **Mehurčki v akvariju.** Vodna rastlina na soncu odda drobne mehurčke kisika. Ko akvarij zatemniš, jih je vse manj.
- **Jesensko listje.** Ko drevo pred zimo razgradi klorofil, postanejo vidni rumeni in oranžni karotenoidi.
- **Rastlinjak.** Vrtnarji v rastlinjake s paradižnikom včasih dodajajo $\mathrm{CO_2}$. Rubisko ga tako veže hitreje in plodov je več.
- **Bleda lončnica.** Rastlina v temnem hodniku zraste dolga in bleda. Brez svetlobe ne naredi dovolj klorofila in sladkorja.

## Preveri se

? Kaj od naštetega **ne** poteka na tilakoidni membrani?
- klorofil vpija svetlobo
~ Barvila so vgrajena prav v tilakoidno membrano, tam se svetloba ujame.
- voda se razcepi in sprosti se kisik
~ Razcep vode je del svetlobnih reakcij na tilakoidah. Tako klorofil dobi nove elektrone.
- nastajata ATP in NADPH
~ Oba nastaneta v svetlobnih reakcijah na tilakoidni membrani.
+ rubisko veže $\mathrm{CO_2}$ v sladkor
> Vezava $\mathrm{CO_2}$ z rubisko je del Calvinovega cikla, ki poteka v stromi. Ostale tri trditve opisujejo svetlobne reakcije.

? Rastlino s sončne police prestavimo v popolno temo. Kaj se zgodi?
- Ustavi se le vezava $\mathrm{CO_2}$, svetlobne reakcije tečejo naprej.
~ Ravno svetlobne reakcije potrebujejo svetlobo, zato se ustavijo prve.
+ Svetlobne reakcije se ustavijo takoj, vezava $\mathrm{CO_2}$ kmalu zatem, ko zmanjka ATP in NADPH.
- Svetlobne reakcije se ustavijo, Calvinov cikel pa teče vso noč, saj je »temotna reakcija«.
~ Calvinov cikel potrebuje ATP in NADPH iz svetlobnih reakcij. Ko jih zmanjka, se ustavi.
- Rastlina preneha tudi dihati.
~ Dihanje v mitohondrijih ne potrebuje svetlobe in teče naprej, tudi v temi.
> Brez svetlobe ni novega ATP in NADPH. Calvinov cikel porabi ostanek in obstane, dihanje pa teče dalje.

? Luka razlaga fotosintezo v štirih korakih. Kateri korak je napačen? (1) Klorofil vpije rdečo in modro svetlobo. (2) Energija svetlobe razcepi $\mathrm{CO_2}$, sprosti se kisik. (3) Nastaneta ATP in NADPH. (4) V stromi se $\mathrm{CO_2}$ veže v sladkor.
- korak (1)
~ Ta korak drži: klorofil vpija predvsem rdečo in modro svetlobo, zeleno odbije.
+ korak (2)
- korak (3)
~ Ta korak drži: ATP in NADPH nastaneta v svetlobnih reakcijah.
- korak (4)
~ Ta korak drži: v stromi rubisko veže $\mathrm{CO_2}$ v Calvinovem ciklu.
> Razcepi se voda, ne $\mathrm{CO_2}$. Poskus z označenim kisikom pokaže, da ves sproščeni $\mathrm{O_2}$ izvira iz vode.

? Calvinov cikel v celici porabi $72$ NADPH. Koliko molekul $\mathrm{CO_2}$ je pri tem vezal in koliko glukoze lahko nastane? (Za eno glukozo: $6$ $\mathrm{CO_2}$, $18$ ATP, $12$ NADPH.)
- $72$ molekul $\mathrm{CO_2}$, $12$ molekul glukoze
~ Za vsak vezani $\mathrm{CO_2}$ cikel porabi dva NADPH, ne enega: $12$ NADPH na $6$ $\mathrm{CO_2}$.
- $24$ molekul $\mathrm{CO_2}$, $4$ molekule glukoze
~ Delil si z $18$, to je število ATP na glukozo. NADPH je $12$ na glukozo.
+ $36$ molekul $\mathrm{CO_2}$, $6$ molekul glukoze
- $6$ molekul $\mathrm{CO_2}$, $6$ molekul glukoze
~ Število glukoz je pravo, a vsaka ima $6$ ogljikovih atomov, torej potrebuje $6$ molekul $\mathrm{CO_2}$.
> $\dfrac{72}{12} = 6$ molekul glukoze, za vsako cikel veže $6$ $\mathrm{CO_2}$: $6 \cdot 6 = 36$ molekul.

? Leta 1960 je David Latimer zaprl rastlino v velik stekleni balon. Odprl ga je le enkrat, leta 1972, da jo je zalil, rastlina pa je živela še desetletja. Kaj ji je omogočilo preživeti?
- V zaprtem balonu ne diha, zato ne porablja ničesar.
~ Rastlina diha ves čas. Porablja kisik in sladkor ter oddaja $\mathrm{CO_2}$.
- Snov za rast dobiva iz zemlje, zato $\mathrm{CO_2}$ ne potrebuje.
~ Iz tal dobi vodo in mineralne snovi, ogljik za sladkor pa iz $\mathrm{CO_2}$ v zraku.
+ Svetloba daje energijo; $\mathrm{CO_2}$, kisik in voda pa krožijo med fotosintezo in dihanjem rastline ter razkrojevalcev.
- Kisik dobi tako, da razcepi $\mathrm{CO_2}$ iz zraka.
~ Kisik pri fotosintezi nastane iz vode, ne iz $\mathrm{CO_2}$.
> Snovi v balonu krožijo: dihanje vrača $\mathrm{CO_2}$ in vodo, fotosinteza iz njiju naredi sladkor in kisik. Od zunaj prihaja le svetloba.

<<RACUN
kemija: 6 CO2 + 6 H2O -> C6H12O6 + 6 O2
vrednost: 264+108 | 180+192
vrednost: 18/6 | 3
vrednost: 18*3 | 54
vrednost: 12*3 | 36
vrednost: 120*120 | 14400
vrednost: 14.4*180/264 | 9.82
vrednost: 14.4*192/264 | 10.47
vrednost: 25000*4 | 100000
vrednost: 1*0.5*100 | 50
vrednost: 50*8 | 400
vrednost: 400*192/264 | 290.91
vrednost: 72/12 | 6
vrednost: 6*6 | 36
vrednost: 72/18 | 4
>>

:::simboli
N_{\mathrm{CO_2}} | število vezanih molekul $\mathrm{CO_2}$ | | – |
N_\mathrm{g} | število molekul glukoze | N_\mathrm{g} = \frac{N_{\mathrm{CO_2}}}{6} | – |
N_\mathrm{ATP} | število porabljenih molekul ATP | N_\mathrm{ATP} = 18 \cdot N_\mathrm{g} | – | v Calvinovem ciklu
N_\mathrm{NADPH} | število porabljenih molekul NADPH | N_\mathrm{NADPH} = 12 \cdot N_\mathrm{g} | – | v Calvinovem ciklu
m_{\mathrm{CO_2}} | masa ogljikovega dioksida | | kg | v Primeru 3 v tonah
m_\mathrm{g} | masa glukoze | m_\mathrm{g} = m_{\mathrm{CO_2}} \cdot \frac{180}{264} | kg |
m_{\mathrm{O_2}} | masa sproščenega kisika | m_{\mathrm{O_2}} = m_{\mathrm{CO_2}} \cdot \frac{192}{264} | kg | v Primeru 3 v tonah
a_\mathrm{z}, b_\mathrm{z} | dolžini stranic gozda na zemljevidu | | cm |
a, b | pravi dolžini stranic gozda | a = 25\,000 \cdot a_\mathrm{z} | cm | v primeru pretvorjeno v km
P | površina gozda | P = a \cdot b | km^2 | $1\,\text{km}^2 = 100\,\text{ha}$
:::
