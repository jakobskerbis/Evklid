---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na igrišču sedita na gugalnici Neža z maso $25\,\mathrm{kg}$ in njen oče s $75\,\mathrm{kg}$. Oče je trikrat težji, pa vendar Neža lahko obsedi spodaj, oče pa visi v zraku. Njen brat Tim ne verjame: »Težji vedno prevesi. Kje kdo sedi, je vseeno.«

Skrivnost je v tem, kje sedita. Neža sedi na samem koncu, $1{,}5\,\mathrm{m}$ od osi, oče se pomakne čisto k sredini. Enako poznaš z vrat: ob kljuki se odprejo z lahkoto, tik ob tečajih se pri isti sili skoraj ne premaknejo. Sila je enaka, učinek pa povsem drugačen.

Količini, ki to opiše, pravimo **navor**. Z njo razumeš, kdaj gugalnica obmiruje, kako s palico premakneš skalo, ki je z rokami ne bi, zakaj veter podre visoko drevo in kdaj se skala na pobočju prevrne.

## Razlaga

**1. Kar že znaš: ravnovesje sil.** Iz Newtonovih zakonov veš: če je rezultanta sil na telo nič, telo miruje ali se giblje premo enakomerno. Za kamen, ki leži na tleh, sta teža in sila podlage enaki in nasprotni, zato kamen miruje.

**2. Kje to ne zadošča.** Dva otroka vlečeta podrto deblo, ki leži na snegu. Prvi vleče levi konec s silo $50\,\mathrm{N}$ pravokotno na deblo, drugi desni konec enako močno v nasprotno smer. Rezultanta je nič. Deblo se kljub temu zavrti. Vsota sil pove, ali se telo **premika**, ne pove pa, ali se **vrti**. Za vrtenje je pomembno tudi, **kje** sila prijemlje.

**3. Navor.** Telo, ki se lahko vrti, se vrti okoli **osi** (pri drevesu je to mesto pri koreninah, pri vratih tečaji). Kaj šteje pri vrtenju, pokaže poskus z vzvodom: utež $4\,\mathrm{kg}$ na $0{,}2\,\mathrm{m}$ od opore uravnovesi $2\,\mathrm{kg}$ na $0{,}4\,\mathrm{m}$ ali $1\,\mathrm{kg}$ na $0{,}8\,\mathrm{m}$. Pol manjša teža potrebuje dvakrat večjo razdaljo, njun produkt pa ostane enak. Zato vrtilni učinek opišemo s produktom.

**Nosilka sile** je premica, na kateri leži puščica sile. **Ročica** $r$ je pravokotna razdalja od osi do nosilke. **Navor** sile je produkt sile in ročice:

$$M = F\,r$$

Enota je newton meter, $\mathrm{N\,m}$. Navor je velik, če je sila velika ali če je ročica dolga.

Primerjaj obe količini:

| | sila | navor |
|---|---|---|
| spremeni | hitrost premikanja | hitrost vrtenja |
| smer | smer sile | smer vrtenja (kot urni kazalec ali nasprotno) |
| enota | $\mathrm{N}$ | $\mathrm{N\,m}$ |
| ravnovesje | vsota sil je $0$ | vsota navorov je $0$ |

**4. Ročica ni kar razdalja.** Ročica je razdalja do **nosilke**, ne do prijemališča. Predstavljaj si vejo, ki štrli vodoravno iz debla. Če jo potegneš navzdol na koncu, je nosilka navpična in ročica je cela dolžina veje. Če vlečeš poševno, je nosilka bliže osi in ročica krajša od veje.

:::premisli
Na konec $2\,\mathrm{m}$ dolge vodoravne veje deluje sila $100\,\mathrm{N}$ vzdolž veje, proti deblu. Kolikšen je navor glede na mesto, kjer veja raste iz debla? Ugani, preden bereš naprej.
---
Nič. Nosilka sile poteka skozi os, zato je ročica $0$ in $M = 100\,\mathrm{N} \cdot 0 = 0$. Taka sila vejo stiska, ne zavrti je.
:::

Na sliki je veja vodoravna daljica od osi O do prijemališča $2\,\mathrm{m}$ desno. Sila $100\,\mathrm{N}$ oklepa z vejo kot $60^\circ$. Črtkana črta je nosilka, oranžna daljica od O pravokotno na nosilko je ročica. Veja, ročica in nosilka tvorijo pravokotni trikotnik s kotoma $60^\circ$ in $30^\circ$ ter hipotenuzo $2\,\mathrm{m}$. Tak trikotnik je polovica enakostraničnega, zato je kateta na nosilki pol hipotenuze, $1\,\mathrm{m}$. Po Pitagorovem izreku je ročica $r = \sqrt{(2\,\mathrm{m})^2 - (1\,\mathrm{m})^2} = 1{,}73\,\mathrm{m}$, zato $M = 173\,\mathrm{N\,m}$, ne $200\,\mathrm{N\,m}$.

Enako dobiš z razstavljanjem sile, ki ga poznaš iz poglavja o silah. Komponenta pravokotno na vejo je $100\,\mathrm{N} \cdot \sin 60^\circ = 86{,}6\,\mathrm{N}$; njena ročica je cela dolžina veje: $86{,}6\,\mathrm{N} \cdot 2\,\mathrm{m} = 173\,\mathrm{N\,m}$. Komponenta vzdolž veje, $50\,\mathrm{N}$, vejo le stiska. Ročica je torej samo krajši zapis za »vrti le pravokotni del sile«.

:::risba graf
opis: Veja dolžine 2 m je vrtljiva okoli osi O na levem koncu. Na desnem koncu deluje sila 100 N pod kotom {a}° glede na vejo. Črtkana črta je nosilka sile, ročica r je pravokotna razdalja od O do nosilke: r = {2*sin(a*pi/180):.2} m, navor M = {200*sin(a*pi/180):.0} N m. V aplikaciji se kot spreminja z drsnikom.
x: -1 .. 4,5 | 0,5 | m
y: -2,2 .. 3,4 | 0,5 | m
enako: da
oznake: ne
drsnik: a | 15 .. 165 | 5 | 60 | kot med silo in vejo v stopinjah
črta: 0; 0.6 -> 2; 0.6 | debelo
točka: 0; 0.6 | O | pod levo
črta: 2 - 2.4*cos(a*pi/180); 0.6 - 2.4*sin(a*pi/180) -> 2 + 2.4*cos(a*pi/180); 0.6 + 2.4*sin(a*pi/180) | siva črtkano
črta: 2; 0.6 -> 2.6; 0.6 | siva črtkano
puščica: 2; 0.6 -> 2 + 1.2*cos(a*pi/180); 0.6 + 1.2*sin(a*pi/180) |  |  | modra
napis: 2 + 0.75*cos(a*pi/180) + 0.3*sin(a*pi/180); 0.6 + 0.75*sin(a*pi/180) - 0.3*cos(a*pi/180) | F | sredina | modra
črta: 0; 0.6 -> 2 - 2*cos(a*pi/180)^2; 0.6 - 2*cos(a*pi/180)*sin(a*pi/180) | oranžna debelo
napis: 1 - cos(a*pi/180)^2; 0.6 - cos(a*pi/180)*sin(a*pi/180) | r | pod levo | oranžna
napis: 1; 0.6 - 0.6*floor(a/145) | veja 2 m | nad
napis: 2 + 0.45*cos(a*pi/360); 0.6 + 0.45*sin(a*pi/360) | {a}° | sredina
podnapis: Kot {a}°: ročica r = {2*sin(a*pi/180):.2} m, navor M = {200*sin(a*pi/180):.0} N m
:::

V aplikaciji premikaj drsnik za kot. Opazi: ročica je najdaljša ($2\,\mathrm{m}$) pri $90^\circ$, ko sila stoji pravokotno na vejo. Bolj ko se kot bliža $0^\circ$ ali $180^\circ$, bolj gre nosilka skozi O: pri $15^\circ$ in $165^\circ$ je ročica le še $0{,}52\,\mathrm{m}$, navor pa $52\,\mathrm{N\,m}$, čeprav je sila ves čas $100\,\mathrm{N}$.

**5. Smer navora.** Tudi navor ima smer: telo vrti bodisi v smeri urnega kazalca bodisi v nasprotni. Navore, ki vrtijo v eno smer, štejemo pozitivno, nasprotne negativno. Na gugalnici iz uvoda Neža vrti v nasprotni smeri urnega kazalca, oče v smeri urnega kazalca. Nežina teža je $25\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 245\,\mathrm{N}$, očetova $75\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 736\,\mathrm{N}$. Ko sedi oče $0{,}5\,\mathrm{m}$ od osi, sta navora $245\,\mathrm{N} \cdot 1{,}5\,\mathrm{m} \approx 368\,\mathrm{N\,m}$ in $736\,\mathrm{N} \cdot 0{,}5\,\mathrm{m} \approx 368\,\mathrm{N\,m}$, vsota pa $+368\,\mathrm{N\,m} - 368\,\mathrm{N\,m} = 0$.

**6. Ravnovesje togega telesa.** **Togo telo** je telo, ki se ne deformira (deska, kamen, deblo). Je v ravnovesju, če veljata **oba** pogoja hkrati:

- vsota sil je nič (telo se ne začne premikati),
- vsota navorov glede na katerokoli os je nič (telo se ne začne vrteti).

Prvi pogoj že poznaš, drugi je nov. Os si lahko izberemo poljubno. Najpametneje je vzeti točko, kjer deluje neznana sila: njena nosilka gre skozi os, zato je njen navor nič in sila iz enačbe izpade.

**7. Vzvod.** **Vzvod** je togo telo, ki se vrti okoli opore, na primer palica, s katero dvigneš kamen. Na eni strani opore deluje breme $F_2$ na ročici $r_2$, na drugi tvoja sila $F_1$ na ročici $r_1$. Vzvod miruje, ko je vsota navorov nič (točka 6): $+F_1 r_1 - F_2 r_2 = 0$, torej

$$F_1 r_1 = F_2 r_2$$

Daljša ročica pomeni manjšo potrebno silo. V simulaciji spodaj (Navor in ravnovesje vzvoda, v aplikaciji) postavi utež blizu opore in išči, kam moraš na drugi strani postaviti dvakrat lažjo utež. Opazi: najdeš jo na dvakrat daljši ročici, razmerje ročic je obratno razmerju sil.

Gugalnica iz uvoda je tak vzvod. Na sliki sedi oče $1\,\mathrm{m}$ od osi: njegov navor $736\,\mathrm{N} \cdot 1\,\mathrm{m} = 736\,\mathrm{N\,m}$ je večji od Nežinega, $368\,\mathrm{N\,m}$, zato se njegova stran spusti.

:::risba graf
opis: Gugalnica z osjo na sredini. Neža s težo 245 N sedi 1,5 m levo od osi, oče s težo 736 N sedi {d} m desno od osi. Navor Neže je 368 N m, navor očeta {735.75*d:.0} N m. Stran z večjim navorom se spusti, pri enakih navorih je gugalnica vodoravna. V aplikaciji se razdalja očeta spreminja z drsnikom.
x: -2,5 .. 3,4 | 0,5 | lega (m)
y: -0,5 .. 2,6 | 0,5 |
oznake: ne
oznakax: -2 | −2
oznakax: -1 | −1
oznakax: 1 | 1
oznakax: 2 | 2
drsnik: d | 0,3 .. 2 | 0,1 | 1 | razdalja očeta od osi v metrih
lik: 0; 0,8 -> -0,3; 0 -> 0,3; 0 | siva polno
črta: -2.2; 0.8 + 0.25*sign(75*d - 37.5) -> 2.2; 0.8 - 0.25*sign(75*d - 37.5) | debelo
puščica: -1.5; 1.3 + 0.17*sign(75*d - 37.5) -> -1.5; 0.8 + 0.17*sign(75*d - 37.5) | Neža 245 N | levo | modra
puščica: d; 2.3 - 0.25*d/2.2*sign(75*d - 37.5) -> d; 0.8 - 0.25*d/2.2*sign(75*d - 37.5) | oče 736 N | desno | modra
podnapis: Oče {d} m od osi: navor Neže 368 N m, navor očeta {735.75*d:.0} N m
:::

V aplikaciji pomikaj očeta proti osi. Pri $0{,}5\,\mathrm{m}$ sta navora enaka in gugalnica je vodoravna: trikrat večja sila na trikrat krajši ročici. Še bliže osi prevesi Neža. Tim je imel narobe: šteje navor, ne samo teža.

:::premisli
S palico želiš premakniti skalo. Ali je bolje, da kamen, na katerega palico nasloniš kot oporo, postaviš bliže skali ali bliže svojim rokam? Zakaj?
---
Bliže skali. Tako je ročica bremena kratka, tvoja ročica pa dolga. Ker mora biti $F_1 r_1 = F_2 r_2$, z dolgo ročico $r_1$ zadošča majhna sila $F_1$.
:::

**8. Težišče.** Teža deluje na vsak delček telesa. Pri računanju navorov jo nadomestimo z eno silo $F_\mathrm{g} = m\,g$, ki prijemlje v **težišču**. Pri enakomernem deblu ali deski je težišče na sredini. Pri podrtem deblu, ki je pri korenini debelejše, je bliže korenini.

Telo, ki stoji na podlagi, se ne prevrne, dokler navpičnica skozi težišče pada **znotraj podporne ploskve**, to je ploskve med točkami, kjer se telo dotika podlage. Skala na pobočju ali nagnjeno drevo se prevrne, ko težišče pride čez rob podpore: takrat teža ustvari navor, ki telo vrti navzven.

:::risba graf
opis: Kvader širine 1 m in višine 2 m je nagnjen okoli desnega spodnjega roba za {b}°. Težišče T je v njegovem središču. Vodoravna razdalja T od roba je {0.5*cos(b*pi/180) - sin(b*pi/180):.2} m; pozitivno pomeni, da je T nad podporo, negativno, da je čez rob. V aplikaciji se nagib spreminja z drsnikom.
x: -2 .. 2 | 0,5 | m
y: -0,3 .. 2,5 | 0,5 | m
enako: da
oznake: ne
drsnik: b | 0 .. 40 | 1 | 15 | nagib kvadra v stopinjah
črta: -2; 0 -> 2; 0 | siva
lik: 0; 0 -> -cos(b*pi/180); sin(b*pi/180) -> -cos(b*pi/180) + 2*sin(b*pi/180); sin(b*pi/180) + 2*cos(b*pi/180) -> 2*sin(b*pi/180); 2*cos(b*pi/180) | modra
točka: -0.5*cos(b*pi/180) + sin(b*pi/180); 0.5*sin(b*pi/180) + cos(b*pi/180) | T | levo
črta: -0.5*cos(b*pi/180) + sin(b*pi/180); 0.5*sin(b*pi/180) + cos(b*pi/180) -> -0.5*cos(b*pi/180) + sin(b*pi/180); 0 | oranžna črtkano
točka: 0; 0 | rob | pod desno
podnapis: Nagib {b}°: vodoravna razdalja T od roba {0.5*cos(b*pi/180) - sin(b*pi/180):.2} m (pozitivno: nad podporo, negativno: čez rob)
:::

Na sliki je kvader nagnjen za $15^\circ$ in navpičnica skozi težišče pade še $0{,}22\,\mathrm{m}$ levo od roba: ko ga spustiš, teža zavrti kvader nazaj na podlago. V aplikaciji povečuj nagib. Pri približno $27^\circ$ je težišče točno nad robom, pri večjem nagibu pade navpičnica čez rob in kvader se prevrne. Višje težišče ali ožja podlaga pomeni, da zadošča manjši nagib.

## Rešeni primeri

### Primer 1: veter na krošnji

Veter potiska krošnjo mladega drevesa z vodoravno silo približno $400\,\mathrm{N}$. Sila prijemlje $6\,\mathrm{m}$ nad tlemi, deblo je navpično. Kolikšen je navor glede na vznožje? Kolikšen bi bil, če bi enaka sila delovala $0{,}5\,\mathrm{m}$ nad tlemi?

**Podatki:** $F = 400\,\mathrm{N}$ vodoravno, $r_1 = 6\,\mathrm{m}$, $r_2 = 0{,}5\,\mathrm{m}$
**Iščemo:** navora $M_1$ in $M_2$

:::formula
$M = F\,r$, ročica je navpična razdalja od tal do vodoravne nosilke
:::

**Rešitev:**

1. Sila je vodoravna, deblo navpično, zato je ročica kar višina prijemališča.
2. Visoko: $M_1 = 400\,\mathrm{N} \cdot 6\,\mathrm{m} = 2400\,\mathrm{N\,m}$.
3. Nizko: $M_2 = 400\,\mathrm{N} \cdot 0{,}5\,\mathrm{m} = 200\,\mathrm{N\,m}$.
4. Odgovor: navor na krošnji je $2400\,\mathrm{N\,m}$, ob vznožju le $200\,\mathrm{N\,m}$, dvanajstkrat manj. Pri isti sili odloča, kje veter zadene drevo.

### Primer 2: skala na planinski poti

Po neurju je na poti obstala skala z maso približno $245\,\mathrm{kg}$. Dvigaš jo s palico, ki se opira na kamen. En rob skale ostane na tleh, zato skala pritiska na palico s približno polovico teže, s silo $1200\,\mathrm{N}$, na razdalji $0{,}3\,\mathrm{m}$ od opore. Tvoje roke so $1{,}5\,\mathrm{m}$ od opore. S kolikšno silo moraš pritisniti navzdol, da je palica v ravnovesju? Palico obravnavaj kot lahko.

**Podatki:** $F_2 = 1200\,\mathrm{N}$, $r_2 = 0{,}3\,\mathrm{m}$, $r_1 = 1{,}5\,\mathrm{m}$
**Iščemo:** silo rok $F_1$

:::formula
Ravnovesje vzvoda: $F_1 r_1 = F_2 r_2$, torej $F_1 = \dfrac{F_2 r_2}{r_1}$
:::

**Rešitev:**

1. Os je opora. Breme vrti palico v eno smer, roke v drugo, zato morata biti navora enaka.
2. Navor bremena: $M_2 = 1200\,\mathrm{N} \cdot 0{,}3\,\mathrm{m} = 360\,\mathrm{N\,m}$.
3. $F_1 = \dfrac{360\,\mathrm{N\,m}}{1{,}5\,\mathrm{m}} = 240\,\mathrm{N}$.
4. Odgovor: pritisniti moraš s silo $240\,\mathrm{N}$, petkrat manj od sile bremena, ker je tvoja ročica petkrat daljša.

### Primer 3: drog s kolutom samo na eni strani

Tekmovalni moški drog za dviganje uteži ima maso $20\,\mathrm{kg}$ in je dolg $2{,}2\,\mathrm{m}$. Leži na stojalu na dveh kljukah, ki sta $0{,}6\,\mathrm{m}$ levo in desno od sredine droga. Na desno stran natakneš kolut z maso $20\,\mathrm{kg}$; njegovo središče je $0{,}7\,\mathrm{m}$ desno od sredine. S kolikšno silo deluje vsaka kljuka na drog?

:::risba skica
opis: Vodoravni drog dolg 2,2 m leži na dveh kljukah, 0,6 m levo in desno od sredine. Na sredini deluje navzdol teža droga 196,2 N, 0,7 m desno od sredine teža koluta 196,2 N. Kljuki delujeta navzgor s silama F L (82 N) in F D (311 N). Dolžine puščic so v merilu.
območje: -1,3; -1,7 .. 1,3; 1,3
enota: 110
črta: -1,1; 0 -> 1,1; 0 | debelo
pravokotnik: 0,68; -0,3 .. 0,72; 0,3 | siva ozadje
puščica: 0; 0,6 -> 0; 0 | 196,2 N | levo | modra
puščica: 0,7; 0,9 -> 0,7; 0,3 | 196,2 N | desno | modra
puščica: -0,6; -0,25 -> -0,6; 0 | F_L | levo | zelena
puščica: 0,6; -0,95 -> 0,6; 0 | | levo | zelena
napis: 0,55; -0,8 | F_D | levo | zelena
črta: -0,6; -1,25 -> 0,7; -1,25 | oranžna
črta: -0,6; -1,15 -> -0,6; -1,35 | oranžna
črta: 0; -1,15 -> 0; -1,35 | oranžna
črta: 0,6; -1,15 -> 0,6; -1,35 | oranžna
črta: 0,7; -1,15 -> 0,7; -1,35 | oranžna
napis: -0,3; -1,25 | 0,6 m | pod | oranžna
napis: 0,3; -1,25 | 0,6 m | pod | oranžna
napis: 0,8; -1,25 | 0,1 m | desno | oranžna
:::

**Podatki:** $m_\mathrm{d} = 20\,\mathrm{kg}$, $l = 2{,}2\,\mathrm{m}$, kljuki $0{,}6\,\mathrm{m}$ levo in desno od sredine, $m_\mathrm{k} = 20\,\mathrm{kg}$ na $0{,}7\,\mathrm{m}$ desno od sredine, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** sili kljuk $F_\mathrm{L}$ in $F_\mathrm{D}$

:::formula
Vsota navorov glede na levo kljuko je nič: $F_\mathrm{D} \cdot 1{,}2\,\mathrm{m} = m_\mathrm{d} g \cdot 0{,}6\,\mathrm{m} + m_\mathrm{k} g \cdot 1{,}3\,\mathrm{m}$

Vsota sil je nič: $F_\mathrm{L} + F_\mathrm{D} = (m_\mathrm{d} + m_\mathrm{k})\,g$
:::

**Rešitev:**

1. Teži: drog $20\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} = 196{,}2\,\mathrm{N}$ v težišču na sredini (drog je enakomeren), kolut prav tako $196{,}2\,\mathrm{N}$.
2. Os postavimo v levo kljuko, da njena neznana sila nima navora. Ročici tež sta $0{,}6\,\mathrm{m}$ in $0{,}6\,\mathrm{m} + 0{,}7\,\mathrm{m} = 1{,}3\,\mathrm{m}$.
3. Navora tež: $196{,}2\,\mathrm{N} \cdot 0{,}6\,\mathrm{m} = 117{,}72\,\mathrm{N\,m}$ in $196{,}2\,\mathrm{N} \cdot 1{,}3\,\mathrm{m} = 255{,}06\,\mathrm{N\,m}$; skupaj $372{,}78\,\mathrm{N\,m}$.
4. Desna kljuka je $1{,}2\,\mathrm{m}$ od osi in mora dati enak navor v nasprotno smer: $F_\mathrm{D} = \dfrac{372{,}78\,\mathrm{N\,m}}{1{,}2\,\mathrm{m}} = 310{,}65\,\mathrm{N}$.
5. Iz vsote sil: $F_\mathrm{L} = 392{,}4\,\mathrm{N} - 310{,}65\,\mathrm{N} = 81{,}75\,\mathrm{N}$.
6. Odgovor: desna kljuka nosi približno $311\,\mathrm{N}$, leva le približno $82\,\mathrm{N}$. Kolut je zunaj desne kljuke, zato leva kljuka nosi manj kot polovico teže droga. Zato je na sliki puščica $F_\mathrm{D}$ skoraj štirikrat daljša od $F_\mathrm{L}$. Če bi bil kolut težji od $120\,\mathrm{kg}$ (takrat je $m_\mathrm{k} \cdot 0{,}1\,\mathrm{m} > m_\mathrm{d} \cdot 0{,}6\,\mathrm{m}$), bi $F_\mathrm{L}$ padla pod nič: drog bi se prevrnil čez desno kljuko.

### Primer 4: zdaj ti

Otroka se gugata na podrtem deblu, ki leži čez skalo. Prvi ima maso $30\,\mathrm{kg}$ in sedi $2\,\mathrm{m}$ od skale. Drugi ima $40\,\mathrm{kg}$. Kako daleč od skale na drugi strani mora sesti, da je deblo v ravnovesju? Težišče debla je nad skalo.

**Podatki:** $m_1 = 30\,\mathrm{kg}$, $r_1 = 2\,\mathrm{m}$, $m_2 = 40\,\mathrm{kg}$, $g = 9{,}81\,\mathrm{m/s^2}$, težišče debla nad oporo
**Iščemo:** ročico $r_2$

:::formula
$F_1 r_1 = F_2 r_2$ s $F = m\,g$; ker je $g$ na obeh straneh, velja tudi $m_1 r_1 = m_2 r_2$
:::

**Rešitev:**

1. Teža debla deluje v opori, zato nima navora in je ne upoštevamo.
2. Navor prvega otroka: $M_1 = 30\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \cdot 2\,\mathrm{m} = 588{,}6\,\mathrm{N\,m}$.
3. Izračunaj $r_2$ sam, nato preveri:

:::premisli
Kolikšna mora biti ročica $r_2$, da teža drugega otroka ($392{,}4\,\mathrm{N}$) da navor $588{,}6\,\mathrm{N\,m}$?
---
$r_2 = \dfrac{588{,}6\,\mathrm{N\,m}}{392{,}4\,\mathrm{N}} = 1{,}5\,\mathrm{m}$. Težji otrok sede bliže opori.
:::

## Pogoste napake

- **»Sila je sila, kje deluje, je vseeno.«** To je Timova zmota z gugalnice: »težji vedno prevesi«. Za premikanje res šteje le vsota sil, za vrtenje pa tudi ročica. Ista sila na krošnji ima dvanajstkrat večji navor kot ob vznožju (Primer 1). Zato tudi rezultanta nič še ne pomeni ravnovesja: dve nasprotni sili na koncih debla ga zavrtita. Nič mora biti tudi vsota navorov.
- **Razdalja do prijemališča namesto ročice.** Pri sili vzdolž veje nekdo izračuna $100\,\mathrm{N} \cdot 2\,\mathrm{m} = 200\,\mathrm{N\,m}$. Nosilka gre skozi os, ročica je nič, navor je nič. Ročica je vedno pravokotna razdalja od osi do nosilke.
- **Obrnjeno sorazmerje pri vzvodu.** Kdor misli, da daljša ročica zahteva večjo silo, zapiše $F_1 = \dfrac{F_2 r_1}{r_2}$. Pri vzvodu sta sila in ročica obratno sorazmerni: dvakrat daljša ročica, pol manjša sila.
- **Masa namesto teže.** Za kepo $2\,\mathrm{kg}$ na $3\,\mathrm{m}$ nekdo zapiše $2 \cdot 3 = 6\,\mathrm{N\,m}$. Navor je sila krat ročica, zato najprej izračunaj težo: $2\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} = 19{,}62\,\mathrm{N}$.
- **Pozabljena teža telesa samega.** Kdor v Primeru 3 upošteva le kolut, dobi $F_\mathrm{D} = 212{,}55\,\mathrm{N}$ in $F_\mathrm{L} = -16{,}35\,\mathrm{N}$, torej bi se drog prevrnil. Drog ima svojo težo v težišču na sredini; prav ta ga drži na levi kljuki.

## Povzetek

- Navor opiše, kako močno sila vrti telo okoli osi: $M = F\,r$, enota $\mathrm{N\,m}$.
- Ročica $r$ je pravokotna razdalja od osi do nosilke sile; če nosilka gre skozi os, je navor nič.
- Navore v eni smeri vrtenja štejemo pozitivno, v drugi negativno.
- Togo telo je v ravnovesju, ko je vsota sil nič **in** vsota navorov nič.
- Vzvod: $F_1 r_1 = F_2 r_2$; daljša ročica, manjša sila.
- Teža prijemlje v težišču; telo se ne prevrne, dokler je težišče nad podporno ploskvijo.
- Os pri računanju postavi tja, kjer deluje neznana sila.

## Drugače: Z analogijo

Navor si predstavljaj kot **ploščino pravokotnika**: ena stranica je sila, druga ročica. Nariši vodoravno daljico, to je vzvod. Pod sredino nariši trikotnik, to je opora. Na levo stran, $2$ kvadratka od opore, nariši puščico navzdol, dolgo $3$ kvadratke (sila). Na desno stran, $3$ kvadratke od opore, puščico, dolgo $2$ kvadratka.

:::risba skica
opis: Vzvod na kvadratni mreži z oporo na sredini. Levo, 2 kvadratka od opore, deluje sila navzdol, dolga 3 kvadratke. Desno, 3 kvadratke od opore, deluje sila navzdol, dolga 2 kvadratka. Siva pravokotnika 2 krat 3 in 3 krat 2 imata ploščino po 6 kvadratkov.
območje: -4; -2,6 .. 4,8; 3,6
mreža: da
pravokotnik: -2; 0 .. 0; 3 | siva ozadje
pravokotnik: 0; 0 .. 3; 2 | siva ozadje
črta: -3,6; 0 -> 3,6; 0 | debelo
lik: 0; 0 -> -0,5; -0,8 -> 0,5; -0,8 | siva
puščica: -2; 3 -> -2; 0 | F_1 = 3 | levo | modra
puščica: 3; 2 -> 3; 0 | F_2 = 2 | desno | modra
napis: -1; 1,5 | 6 | sredina
napis: 1,5; 1 | 6 | sredina
črta: -2; -1,5 -> 0; -1,5 | oranžna
črta: 0; -1,5 -> 3; -1,5 | oranžna
črta: -2; -1,3 -> -2; -1,7 | oranžna
črta: 0; -1,3 -> 0; -1,7 | oranžna
črta: 3; -1,3 -> 3; -1,7 | oranžna
napis: -1; -1,5 | r_1 = 2 | pod | oranžna
napis: 1,5; -1,5 | r_2 = 3 | pod | oranžna
:::

Pravokotnik na vsaki strani je širok kot ročica in visok kot sila (siva na sliki). Levi ima $2 \cdot 3 = 6$ kvadratkov, desni $3 \cdot 2 = 6$. Ploščini sta enaki, zato je vzvod v ravnovesju. Kratka in visoka puščica naredi enako »ploščino« kot dolga in nizka.

Pri sili, ki ni pravokotna na vzvod, nosilko podaljšaj s črtkano črto. Iz opore spusti pravokotnico nanjo. Dolžina te pravokotnice je ročica.

## Drugače: Iz vsakdanjega življenja

- **Ključ za matice.** Zarjavelo matico na kolesu lažje odviješ z daljšim ključem: ista sila, daljša ročica, večji navor.
- **Sneg na veji.** Enaka kepa snega na koncu veje vejo bolj upogiba kot ob deblu. Zato se veje pod mokrim snegom lomijo pri deblu, kjer je navor celotnega bremena največji.
- **Nahrbtnik.** S težkim nahrbtnikom se nagneš naprej, da ostane skupno težišče nad stopali. Sicer bi te navor teže potegnil nazaj.

## Preveri se

? Katera trditev je pravilna?
- Če je vsota sil na telo nič, se telo zagotovo ne vrti.
~ Dve nasprotni sili na različnih koncih dasta rezultanto nič, a telo zavrtita. Potreben je še pogoj za navore.
- Ročica je razdalja od osi do prijemališča sile.
~ Ročica je razdalja do nosilke, merjena pravokotno. Do prijemališča je enaka le, če je sila pravokotna na zveznico med osjo in prijemališčem.
+ Navor sile, katere nosilka gre skozi os, je nič.
- Navor merimo v newtonih na meter, $\mathrm{N/m}$.
~ Navor je produkt sile in ročice, zato je enota $\mathrm{N\,m}$. $\mathrm{N/m}$ je enota prožnostnega koeficienta.
> Če gre nosilka skozi os, je ročica nič in $M = F \cdot 0 = 0$.

? Na gugalnici sedita dva otroka, kot kaže slika (puščici sta njuni teži, lega je merjena od osi). Kaj se zgodi, ko gugalnico spustimo iz vodoravne lege?
:::risba graf
opis: Vodoravna gugalnica z osjo pri 0. Pri −2 m deluje navzdol sila 300 N, pri 1,5 m deluje navzdol sila 400 N.
x: -2,5 .. 2,5 | 0,5 | lega (m)
y: -0,4 .. 2 | 0,5 |
oznake: ne
oznakax: -2 | −2
oznakax: -1 | −1
oznakax: 1 | 1
oznakax: 1,5 | 1,5
oznakax: 2 | 2
lik: 0; 0,6 -> -0,25; 0 -> 0,25; 0 | siva polno
črta: -2,3; 0,6 -> 2,3; 0,6 | debelo
puščica: -2; 1,5 -> -2; 0,6 | 300 N | desno | modra
puščica: 1,5; 1,8 -> 1,5; 0,6 | 400 N | desno | modra
:::
- Desna stran se spusti, ker je desni otrok težji.
~ Teža sama ne odloči. Lažji otrok ima daljšo ročico, zato primerjaj navora, ne sil.
+ Gugalnica ostane vodoravna.
- Leva stran se spusti, ker je levi otrok dlje od osi.
~ Daljša ročica sama tudi ne odloči: levi otrok je lažji. Šele produkt sile in ročice pove navor.
> Levo: $300\,\mathrm{N} \cdot 2\,\mathrm{m} = 600\,\mathrm{N\,m}$, desno: $400\,\mathrm{N} \cdot 1{,}5\,\mathrm{m} = 600\,\mathrm{N\,m}$. Navora sta enaka, zato gugalnica ostane v ravnovesju.

? Na avtu menjaš kolo in odvijaš zarjavelo matico. Razvrsti primere od najmanjšega do največjega navora glede na matico.
1. Sila $400\,\mathrm{N}$ deluje vzdolž ključa proti matici.
2. Sila $300\,\mathrm{N}$ deluje pravokotno na ključ $0{,}2\,\mathrm{m}$ od matice.
3. Sila $250\,\mathrm{N}$ deluje pravokotno na ključ $0{,}3\,\mathrm{m}$ od matice.
4. Sila $200\,\mathrm{N}$ deluje pravokotno na ključ $0{,}4\,\mathrm{m}$ od matice.
5. Sila $125\,\mathrm{N}$ deluje pravokotno na cev, nataknjeno na ključ, $0{,}8\,\mathrm{m}$ od matice.
> Navori: $0$ (nosilka skozi os); $60$; $75$; $80$ in $100\,\mathrm{N\,m}$. Največja sila ima najmanjši navor, najmanjša sila največjega: šteje produkt $F\,r$.

? Na eni strani vzvoda deluje sila $50\,\mathrm{N}$ na ročici $0{,}6\,\mathrm{m}$. Kolikšna sila na drugi strani na ročici $0{,}2\,\mathrm{m}$ ga uravnovesi?
= 150 N | 1
~ 50 | Pri vzvodu morata biti enaka navora, ne sili. Ročici sta različni.
~ 16,7 | To je $\dfrac{50 \cdot 0{,}2}{0{,}6}$: razmerje ročic je obrnjeno. Krajša ročica zahteva večjo silo.
~ 30 | To je navor $50 \cdot 0{,}6 = 30\,\mathrm{N\,m}$, ne sila. Deliti ga moraš še z ročico $0{,}2\,\mathrm{m}$.
> $F_2 = \dfrac{F_1 r_1}{r_2} = \dfrac{50\,\mathrm{N} \cdot 0{,}6\,\mathrm{m}}{0{,}2\,\mathrm{m}} = 150\,\mathrm{N}$.

? Kepa mokrega snega z maso $2\,\mathrm{kg}$ leži na vodoravni veji $1\,\mathrm{m}$ od debla. Kepa zdrsne do $3\,\mathrm{m}$ od debla. Kolikšen je zdaj navor njene teže glede na deblo v $\mathrm{N\,m}$?
= 58,86 N m | 0,1
~ 19,62 | To je navor na $1\,\mathrm{m}$. Teža je res enaka, ročica pa je zdaj trikrat daljša.
~ 6,54 | To je deljenje s $3$: bliže osi pomeni krajšo ročico in manjši navor, dlje od osi pa večjega.
~ 6 | To je $2\,\mathrm{kg} \cdot 3\,\mathrm{m}$. Masa ni sila: v navor vstaviš težo $m\,g = 19{,}62\,\mathrm{N}$.
> $M = F\,r = 19{,}62\,\mathrm{N} \cdot 3\,\mathrm{m} = 58{,}86\,\mathrm{N\,m}$, trikrat več kot pri $1\,\mathrm{m}$.

? Velika skala stoji na strmem pobočju. Pobočje se po neurju malo posede in skala se nagne. Kdaj se prevrne navzdol po pobočju?
+ Ko navpičnica skozi njeno težišče pade zunaj podporne ploskve.
- Ko je njena teža večja od sile podlage.
~ Skala, ki miruje, je v ravnovesju sil. Prevrne jo navor teže, ko se težišče premakne čez rob.
- Ko je pobočje dovolj gladko.
~ Gladko pobočje lahko povzroči drsenje, ne prevrnitve. Za prevrnitev odloča lega težišča.
> Takrat teža glede na spodnji rob ustvari navor, ki skalo vrti navzven, podlaga pa ga ne more več uravnovesiti.

:::simboli
M | navor | M = F\,r | N\,m | pozitiven ali negativen glede na smer vrtenja
F | sila | | N
r | ročica | | m | pravokotna razdalja od osi do nosilke
M_1, M_2 | navora | M = F\,r | N\,m
r_1, r_2 | ročici | | m
F_1, F_2 | sili na obeh straneh opore | | N | v Primeru 2 tvoja sila in breme, v Primeru 4 teži otrok
F_\mathrm{g} | teža | F_\mathrm{g} = m\,g | N | prijemlje v težišču
m | masa | | kg
m_1, m_2 | masi otrok | | kg
g | težni pospešek | | m/s^2 | $9{,}81\,\mathrm{m/s^2}$
l | dolžina droga | | m
m_\mathrm{d} | masa droga | | kg
m_\mathrm{k} | masa koluta | | kg
F_\mathrm{L}, F_\mathrm{D} | sili leve in desne kljuke | | N
:::

<<RACUN
vrednost: 25*9.81*1.5 | 367.875
vrednost: 75*9.81*0.5 | 367.875
vrednost: 2*sin(60°) | 1.73
vrednost: sqrt(2**2-1**2) | 1.73
vrednost: 100*sin(60°) | 86.6
vrednost: 86.6*2 | 173.2
vrednost: 245*9.81/2 | 1201.7
vrednost: 200*sin(60°) | 173.2
vrednost: atan(0.5)*180/pi | 26.57
vrednost: 0.5*cos(15°)-sin(15°) | 0.22
vrednost: 400*6 | 2400
vrednost: 400*0.5 | 200
vrednost: 1200*0.3/1.5 | 240
vrednost: (20*9.81*0.6+20*9.81*1.3)/1.2 | 310.65
vrednost: 40*9.81-310.65 | 81.75
vrednost: 20*0.6/0.1 | 120
vrednost: 588.6/(40*9.81) | 1.5
vrednost: 300*2-400*1.5 | 0
vrednost: 50*0.6/0.2 | 150
vrednost: 2*9.81*3 | 58.86
vrednost: 25*9.81*1.5-75*9.81*0.5 | 0
vrednost: 20*9.81*1.3/1.2 | 212.55
vrednost: 20*9.81-212.55 | -16.35
vrednost: 300*0.2 | 60
vrednost: 250*0.3 | 75
vrednost: 200*0.4 | 80
vrednost: 125*0.8 | 100
>>
