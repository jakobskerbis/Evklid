---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Preizkusi na najbližjih vratih. Potisni jih ob kljuki in odprejo se z lahkoto. Potisni z isto silo tik ob tečajih in se skoraj ne premaknejo. Sila je enaka, učinek pa povsem drugačen.

Po poletnem neurju ležijo v gozdu podrte smreke, mlade breze ob njih pa stojijo. Sošolka Neža to razloži takole: »Kje veter potiska drevo, je vseeno. Pomembno je samo, kako močno piha.« Vrata kažejo drugače: veter, ki zadene visoko krošnjo, zavrti drevo okoli korenin veliko močneje kot enak sunek ob vznožju debla.

Količini, ki to opiše, pravimo **navor**. Z njo razumeš, zakaj se drevesa lomijo, kako s palico premakneš skalo, ki je z rokami ne bi, in kdaj se skala na pobočju prevrne.

## Razlaga

**1. Kar že znaš: ravnovesje sil.** Iz Newtonovih zakonov veš: če je rezultanta sil na telo nič, telo miruje ali se giblje premo enakomerno. Za kamen, ki leži na tleh, sta teža in sila podlage enaki in nasprotni, zato kamen miruje.

**2. Kje to ne zadošča.** Na dolgo vejo, ki leži na snegu, deluje veter na enem koncu s silo $50\,\mathrm{N}$ pravokotno na vejo, na drugem koncu enako velik sunek v nasprotno smer. Rezultanta je nič. Veja se kljub temu zavrti. Vsota sil pove, ali se telo **premika**, ne pove pa, ali se **vrti**. Za vrtenje je pomembno tudi, **kje** sila prijemlje.

**3. Navor.** Telo, ki se lahko vrti, se vrti okoli **osi** (pri drevesu je to mesto pri koreninah, pri vratih tečaji). **Nosilka sile** je premica, na kateri leži puščica sile. **Ročica** $r$ je pravokotna razdalja od osi do nosilke. **Navor** sile je produkt sile in ročice:

$$M = F\,r$$

Enota je newton meter, $\mathrm{N\,m}$. Navor je velik, če je sila velika ali če deluje daleč od osi.

Primerjaj obe količini:

| | sila | navor |
|---|---|---|
| spremeni | hitrost premikanja | hitrost vrtenja |
| opišemo z | velikostjo in smerjo | silo in ročico |
| enota | $\mathrm{N}$ | $\mathrm{N\,m}$ |
| ravnovesje | vsota sil je $0$ | vsota navorov je $0$ |

**4. Ročica ni kar razdalja.** Ročica je razdalja do **nosilke**, ne do prijemališča. Predstavljaj si vejo, ki štrli vodoravno iz debla. Če jo potegneš navzdol na koncu, je nosilka navpična in ročica je cela dolžina veje. Če vlečeš poševno, je nosilka bližje deblu in ročica krajša od veje.

:::premisli
Na konec $2\,\mathrm{m}$ dolge vodoravne veje deluje sila $100\,\mathrm{N}$ vzdolž veje, proti deblu. Kolikšen je navor glede na mesto, kjer veja raste iz debla? Ugani, preden bereš naprej.
---
Nič. Nosilka sile poteka skozi os, zato je ročica $0$ in $M = 100\,\mathrm{N} \cdot 0 = 0$. Taka sila vejo stiska, ne zavrti je.
:::

**5. Smer navora.** Tudi navor ima smer: telo vrti bodisi v smeri urnega kazalca bodisi v nasprotni. Navore, ki vrtijo v eno smer, štejemo pozitivno, nasprotne negativno.

**6. Ravnovesje togega telesa.** **Togo telo** je telo, ki se ne deformira (deska, kamen, deblo). Je v ravnovesju, če veljata **oba** pogoja hkrati:

- vsota sil je nič (telo se ne začne premikati),
- vsota navorov glede na katerokoli os je nič (telo se ne začne vrteti).

Prvi pogoj že poznaš, drugi je nov. Os si lahko izberemo poljubno. Najpametneje je vzeti točko, kjer deluje neznana sila: njena nosilka gre skozi os, zato je njen navor nič in sila iz enačbe izpade.

**7. Vzvod.** **Vzvod** je togo telo, ki se vrti okoli opore, na primer palica, s katero dvigneš kamen. Na eni strani opore deluje breme $F_2$ na ročici $r_2$, na drugi tvoja sila $F_1$ na ročici $r_1$. Vzvod miruje, ko sta navora enaka:

$$F_1 r_1 = F_2 r_2$$

Daljša ročica pomeni manjšo potrebno silo. V simulaciji spodaj (Navor in ravnovesje vzvoda) postavi utež blizu opore in išči, kam moraš na drugi strani postaviti dvakrat lažjo utež. Opazuj, kako se razmerje ročic ujema z obratnim razmerjem sil.

:::premisli
S palico želiš premakniti skalo. Ali je bolje, da kamen, na katerega palico nasloniš kot oporo, postaviš bliže skali ali bliže svojim rokam? Zakaj?
---
Bliže skali. Tako je ročica bremena kratka, tvoja ročica pa dolga. Ker mora biti $F_1 r_1 = F_2 r_2$, z dolgo ročico $r_1$ zadošča majhna sila $F_1$.
:::

**8. Težišče.** Teža deluje na vsak delček telesa. Pri računanju navorov jo nadomestimo z eno silo $F_\mathrm{g} = m\,g$, ki prijemlje v **težišču**. Pri enakomernem deblu ali deski je težišče na sredini. Pri drevesu, ki je spodaj debelejše, je bliže korenini.

Telo, ki stoji na podlagi, se ne prevrne, dokler navpičnica skozi težišče pada **znotraj podporne ploskve**, to je ploskve med točkami, kjer se telo dotika podlage. Skala na pobočju ali nagnjeno drevo se prevrne, ko težišče pride čez rob podpore: takrat teža ustvari navor, ki telo vrti navzven.

## Rešeni primeri

### Primer 1: veter na krošnji

Veter potiska krošnjo mladega drevesa z vodoravno silo $400\,\mathrm{N}$. Sila prijemlje $6\,\mathrm{m}$ nad tlemi, deblo je navpično. Kolikšen je navor glede na vznožje? Kolikšen bi bil, če bi enaka sila delovala $0{,}5\,\mathrm{m}$ nad tlemi?

**Podatki:** $F = 400\,\mathrm{N}$ vodoravno, $r_1 = 6\,\mathrm{m}$, $r_2 = 0{,}5\,\mathrm{m}$
**Iščemo:** navora $M_1$ in $M_2$

:::formula
$M = F\,r$, ročica je navpična razdalja od tal do vodoravne nosilke
:::

**Rešitev:**

1. Sila je vodoravna, deblo navpično, zato je ročica kar višina prijemališča.
2. Visoko: $M_1 = 400\,\mathrm{N} \cdot 6\,\mathrm{m} = 2400\,\mathrm{N\,m}$.
3. Nizko: $M_2 = 400\,\mathrm{N} \cdot 0{,}5\,\mathrm{m} = 200\,\mathrm{N\,m}$.
4. Odgovor: navor na krošnji je $2400\,\mathrm{N\,m}$, ob vznožju le $200\,\mathrm{N\,m}$, dvanajstkrat manj. Neža se je zmotila: pomembno je tudi, kje veter piha.

### Primer 2: skala na planinski poti

Po neurju je na poti obstala skala. Dvigaš jo s palico, ki se opira na kamen. Skala pritiska na palico s silo $1200\,\mathrm{N}$ na razdalji $0{,}3\,\mathrm{m}$ od opore. Tvoje roke so $1{,}5\,\mathrm{m}$ od opore. S kolikšno silo moraš pritisniti navzdol, da je palica v ravnovesju? Palico obravnavaj kot lahko.

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

### Primer 3: brv čez potok

Čez potok leži enakomerna deska, dolga $4\,\mathrm{m}$, z maso $40\,\mathrm{kg}$. Podprta je na obeh koncih. Pohodnik z maso $60\,\mathrm{kg}$ stoji $1\,\mathrm{m}$ od levega konca. S kolikšno silo deluje vsaka opora na desko?

**Podatki:** $l = 4\,\mathrm{m}$, $m_\mathrm{d} = 40\,\mathrm{kg}$, $m_\mathrm{p} = 60\,\mathrm{kg}$, pohodnik $1\,\mathrm{m}$ od leve opore, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** sili opor $F_\mathrm{L}$ in $F_\mathrm{D}$

:::formula
Vsota navorov glede na levo oporo je nič: $F_\mathrm{D}\,l = m_\mathrm{d} g \cdot \dfrac{l}{2} + m_\mathrm{p} g \cdot 1\,\mathrm{m}$; vsota sil je nič: $F_\mathrm{L} + F_\mathrm{D} = (m_\mathrm{d} + m_\mathrm{p})\,g$
:::

**Rešitev:**

1. Teži: deska $F_\mathrm{g,d} = 40\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} = 392{,}4\,\mathrm{N}$ v težišču, ki je na sredini, $2\,\mathrm{m}$ od leve opore. Pohodnik $F_\mathrm{g,p} = 60\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} = 588{,}6\,\mathrm{N}$.
2. Os postavimo v levo oporo, da njena neznana sila nima navora.
3. Navora tež: $392{,}4\,\mathrm{N} \cdot 2\,\mathrm{m} = 784{,}8\,\mathrm{N\,m}$ in $588{,}6\,\mathrm{N} \cdot 1\,\mathrm{m} = 588{,}6\,\mathrm{N\,m}$; skupaj $1373{,}4\,\mathrm{N\,m}$.
4. Desna opora mora dati enak navor v nasprotno smer: $F_\mathrm{D} = \dfrac{1373{,}4\,\mathrm{N\,m}}{4\,\mathrm{m}} = 343{,}35\,\mathrm{N}$.
5. Iz vsote sil: $F_\mathrm{L} = 981\,\mathrm{N} - 343{,}35\,\mathrm{N} = 637{,}65\,\mathrm{N}$.
6. Odgovor: leva opora deluje s silo približno $638\,\mathrm{N}$, desna s približno $343\,\mathrm{N}$. Leva nosi več, ker pohodnik stoji bliže njej.

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

- **»Sila je sila, kje deluje, je vseeno.«** To je Nežina zmota. Za premikanje res šteje le vsota sil, za vrtenje pa tudi ročica. Ista sila na krošnji ima dvanajstkrat večji navor kot ob vznožju (Primer 1).
- **Razdalja do prijemališča namesto ročice.** Pri sili vzdolž veje nekdo izračuna $100\,\mathrm{N} \cdot 2\,\mathrm{m} = 200\,\mathrm{N\,m}$. Nosilka gre skozi os, ročica je nič, navor je nič. Ročica je vedno pravokotna razdalja od osi do nosilke.
- **»Vsota sil je nič, torej telo miruje.«** Dve nasprotni sili na koncih veje dasta rezultanto nič, a vejo zavrtita. Za ravnovesje togega telesa mora biti nič tudi vsota navorov.
- **Obrnjeno sorazmerje pri vzvodu.** Kdor misli, da daljša ročica zahteva večjo silo, zapiše $F_1 = \dfrac{F_2 r_1}{r_2}$. Pri vzvodu sta sila in ročica obratno sorazmerni: dvakrat daljša ročica, pol manjša sila.
- **Težišče vedno na sredini.** Na sredini je le pri enakomernih telesih. Deblo, ki je spodaj debelejše, ima težišče bliže korenini.

## Povzetek

- Navor opiše, kako močno sila vrti telo okoli osi: $M = F\,r$, enota $\mathrm{N\,m}$.
- Ročica $r$ je pravokotna razdalja od osi do nosilke sile; če nosilka gre skozi os, je navor nič.
- Navore v eni smeri vrtenja štejemo pozitivno, v drugi negativno.
- Togo telo je v ravnovesju, ko je vsota sil nič **in** vsota navorov nič.
- Vzvod: $F_1 r_1 = F_2 r_2$; daljša ročica, manjša sila.
- Teža prijemlje v težišču; telo se ne prevrne, dokler je težišče nad podporno ploskvijo.
- Os pri računanju postavi tja, kjer deluje neznana sila.

## Drugače: Na sliki

Nariši vodoravno daljico, to je vzvod. Pod sredino nariši trikotnik, to je opora. Na levo stran, $2$ kvadratka od opore, nariši puščico navzdol, dolgo $3$ kvadratke (sila). Na desno stran, $3$ kvadratke od opore, puščico, dolgo $2$ kvadratka.

```
  3↓             ↓2
   |←—2—→|←——3——→|
 ════════════════════════
         ▲
```

Zdaj nariši pravokotnik na vsaki strani: širok je kot ročica, visok kot sila. Levi ima $2 \cdot 3 = 6$ kvadratkov, desni $3 \cdot 2 = 6$. Ploščini sta enaki, zato je vzvod v ravnovesju. Navor si lahko predstavljaš kot tak pravokotnik: kratka in visoka puščica naredi enako »ploščino« kot dolga in nizka.

Pri sili, ki ni pravokotna na vzvod, nosilko podaljšaj s črtkano črto. Iz opore spusti pravokotnico nanjo. Dolžina te pravokotnice je ročica.

## Drugače: Iz vsakdanjega življenja

- **Vrata in kljuka.** Kljuka je daleč od tečajev, zato z majhno silo dosežeš dovolj velik navor.
- **Ključ za matice.** Zarjavelo matico na kolesu lažje odviješ z daljšim ključem: ista sila, daljša ročica, večji navor.
- **Gugalnica.** Težji otrok sede bliže sredini, lažji dlje. Ko sta navora enaka, gugalnica obmiruje vodoravno.
- **Sneg na veji.** Enaka kepa snega na koncu veje vejo bolj upogiba kot ob deblu. Zato se veje pod mokrim snegom lomijo pri deblu, kjer je navor celotnega bremena največji.
- **Nahrbtnik.** S težkim nahrbtnikom se nagneš naprej, da ostane skupno težišče nad stopali. Sicer bi te navor teže potegnil nazaj.

## Preveri se

? Katera trditev je pravilna?
- Če je vsota sil na telo nič, se telo zagotovo ne vrti.
~ Dve nasprotni sili na različnih koncih dasta rezultanto nič, a telo zavrtita. Potreben je še pogoj za navore.
- Ročica je razdalja od osi do prijemališča sile.
~ Ročica je razdalja do nosilke, merjena pravokotno. Do prijemališča je enaka le, če je sila pravokotna na zvezo z osjo.
+ Navor sile, katere nosilka gre skozi os, je nič.
- Navor merimo v newtonih na meter, $\mathrm{N/m}$.
~ Navor je produkt sile in ročice, zato je enota $\mathrm{N\,m}$. $\mathrm{N/m}$ je enota prožnostnega koeficienta.
> Če gre nosilka skozi os, je ročica nič in $M = F \cdot 0 = 0$.

? Na eni strani vzvoda deluje sila $50\,\mathrm{N}$ na ročici $0{,}6\,\mathrm{m}$. Kolikšna sila na drugi strani na ročici $0{,}2\,\mathrm{m}$ ga uravnovesi?
- $50\,\mathrm{N}$
~ Pri vzvodu morata biti enaka navora, ne sili. Ročici sta različni.
- $16{,}7\,\mathrm{N}$
~ To je $\dfrac{50 \cdot 0{,}2}{0{,}6}$, razmerje ročic je obrnjeno. Krajša ročica zahteva večjo silo.
+ $150\,\mathrm{N}$
- $30\,\mathrm{N}$
~ To je navor $50 \cdot 0{,}6 = 30\,\mathrm{N\,m}$, ne sila. Deliti ga moraš še z ročico $0{,}2\,\mathrm{m}$.
> $F_2 = \dfrac{F_1 r_1}{r_2} = \dfrac{50\,\mathrm{N} \cdot 0{,}6\,\mathrm{m}}{0{,}2\,\mathrm{m}} = 150\,\mathrm{N}$.

? Jure je izračunal: »Veter vleče $2\,\mathrm{m}$ dolgo vodoravno vejo na koncu s silo $100\,\mathrm{N}$ vzdolž veje, stran od debla. Navor glede na deblo je $100\,\mathrm{N} \cdot 2\,\mathrm{m} = 200\,\mathrm{N\,m}$.« Kje je napaka?
- Napake ni, sila krat dolžina veje je navor.
~ Dolžina veje je razdalja do prijemališča, ne ročica. Ročica se meri do nosilke.
- Navor bi moral biti $100\,\mathrm{N\,m}$, ker sila deluje na polovici veje.
~ Sila deluje na koncu. Napaka ni v razdalji, ampak v tem, da nosilka gre skozi os.
+ Sila deluje vzdolž veje, nosilka gre skozi deblo, zato je ročica nič in navor nič.
> Ročica je pravokotna razdalja od osi do nosilke. Ko sila leži vzdolž veje, je ta razdalja $0$, zato $M = 0$; sila vejo le vleče.

? Kepa mokrega snega z maso $2\,\mathrm{kg}$ leži na vodoravni veji $1\,\mathrm{m}$ od debla; navor njene teže glede na deblo je $19{,}62\,\mathrm{N\,m}$. Kepa zdrsne do $3\,\mathrm{m}$ od debla. Kolikšen je zdaj navor?
- $19{,}62\,\mathrm{N\,m}$
~ Teža je res enaka, ročica pa je trikrat daljša. Navor je odvisen od obojega.
- $6{,}54\,\mathrm{N\,m}$
~ To je deljenje s $3$: bližje osi pomeni krajšo ročico in manjši navor, dlje od osi pa večjega.
+ $58{,}86\,\mathrm{N\,m}$
- $6\,\mathrm{N\,m}$
~ To je $2\,\mathrm{kg} \cdot 3\,\mathrm{m}$. Masa ni sila: v navor vstaviš težo $m\,g = 19{,}62\,\mathrm{N}$.
> $M = F\,r = 19{,}62\,\mathrm{N} \cdot 3\,\mathrm{m} = 58{,}86\,\mathrm{N\,m}$, trikrat več kot pri $1\,\mathrm{m}$.

? Velika skala stoji na strmem pobočju. Kdaj se prevrne navzdol po pobočju?
- Ko je njena teža večja od sile podlage.
~ Skala, ki miruje, je v ravnovesju sil. Prevrne jo navor teže, ko se težišče premakne čez rob.
- Ko je pobočje dovolj gladko.
~ Gladko pobočje lahko povzroči drsenje, ne prevrnitve. Za prevrnitev odloča lega težišča.
+ Ko navpičnica skozi njeno težišče pade zunaj podporne ploskve.
> Takrat teža glede na spodnji rob ustvari navor, ki skalo vrti navzven, podlaga pa ga ne more več uravnovesiti.

:::simboli
M | navor | M = F\,r | N\,m | pozitiven ali negativen glede na smer vrtenja
F | sila | | N
r | ročica | | m | pravokotna razdalja od osi do nosilke
M_1, M_2 | navora (visoko, nizko oz. prvega otroka in bremena) | M_1 = F\,r_1 | N\,m
r_1, r_2 | ročici | | m
F_1, F_2 | sili na vzvodu | F_1 = \frac{F_2 r_2}{r_1} | N | $F_1$ tvoja sila, $F_2$ breme
F_\mathrm{g} | teža | F_\mathrm{g} = m\,g | N | prijemlje v težišču
m | masa | | kg
m_1, m_2 | masi otrok | | kg
g | težni pospešek | | m/s^2 | $9{,}81\,\mathrm{m/s^2}$
l | dolžina deske | | m
m_\mathrm{d} | masa deske | | kg
m_\mathrm{p} | masa pohodnika | | kg
F_\mathrm{L}, F_\mathrm{D} | sili leve in desne opore | | N
:::
