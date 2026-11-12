---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pred turo v Julijskih Alpah odpreš planinsko karto. Kjer so plastnice gosto skupaj, bo pot strma. Kjer so redke, bo položna. Karta to pove, še preden stopiš na pot: strmina je v pobočju, ne glede na to, ali kdo hodi po njem.

Jadralni pilot pred poletom pogleda vetrovno karto. Puščice na njej kažejo, kam piha veter in kako močno. Tudi ta karta opisuje vsako točko neba, čeprav tam ni nobenega letala. Ko letalo prileti v tisto točko, veter nanj deluje tako, kot kaže puščica.

Na videz sta to dve različni stvari. Skrivata pa isto zamisel: **vsaki točki prostora pripišemo količino**, ki pove, kaj bo doživelo telo, ko pride tja. Taki »karti« fiziki rečemo **polje**. Okoli vsakega naboja je električno polje. Z njim razložiš, zakaj se ti pod nevihtnim oblakom na grebenu naježijo lasje, kako bliskavica fotoaparata shrani naboj in zakaj ima napetost smisel le med dvema točkama.

## Razlaga

**1. Mamljiva zamisel.** Iz Coulombovega zakona veš, da na večji naboj deluje večja sila. Zato se zdi: »Če v točko postavim večji naboj, je tam polje močnejše.« Preverimo. V isto točko blizu nabite krogle zaporedoma postavimo majhne pozitivne **poskusne naboje**. So tako majhni, da krogle ne zmotijo. Merimo silo nanje:

| $e$ [nAs] | $F$ [mN] | $F/e$ [N/As] |
|---|---|---|
| 2 | 0,1 | $5 \cdot 10^4$ |
| 4 | 0,2 | $5 \cdot 10^4$ |
| 8 | 0,4 | $5 \cdot 10^4$ |

Sila res raste. Količnik $F/e$ pa ostane enak. Ta količnik je lastnost **točke**, ne poskusnega naboja. Pobočje tudi ni nič bolj strmo, če po njem hodi težji planinec.

**2. Jakost električnega polja.** Jakost polja $E$ v točki je sila na poskusni naboj, deljena s tem nabojem:

$$E = \frac{F}{e}$$

Enota je $\mathrm{N/As}$. Jakost polja je vektor. Njena smer je smer sile na **pozitivni** naboj; na negativni naboj deluje sila v nasprotno smer. Ko poznaš $E$, dobiš silo na kateri koli naboj brez nove meritve: $F = eE$.

**3. Polje točkastega naboja.** Zdaj naj bo $e$ naboj, ki polje *ustvarja*. Coulombovo silo na poskusni naboj na razdalji $r$ delimo s poskusnim nabojem. Ker poskusni naboj v sili nastopa kot faktor, se okrajša:

$$E = \frac{e}{4\pi\varepsilon_0 r^2}$$

Kot v Coulombovem zakonu velja $\dfrac{1}{4\pi\varepsilon_0} \approx 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$. Jakost pada s kvadratom razdalje.

:::premisli
Na razdalji $1\,\mathrm{cm}$ od majhne nabite kroglice je jakost polja $900\,\mathrm{N/As}$. Napovej jakost na razdalji $3\,\mathrm{cm}$.
---
$100\,\mathrm{N/As}$. Razdalja je trikrat večja, jakost pa pade s kvadratom, torej $9$-krat: $900 : 9 = 100$.
:::

**4. Silnice.** Polje rišemo kot vetrovno karto, s **silnicami**. Silnica v vsaki točki kaže smer polja. Začne se na pozitivnem naboju in konča na negativnem. Kjer so silnice goste, je polje močno. Pri točkastem naboju se razhajajo kot žarki, zato se z razdaljo redčijo.

V simulaciji spodaj »Električno polje točkastih nabojev« postavi en pozitiven in en negativen naboj. Opazuj, da silnice tečejo od plusa k minusu in da se zgostijo ob obeh nabojih. Silnica ni pot naboja: kaže le smer sile v vsaki točki.

**5. Druga mamljiva zamisel: napetost v točki.** Rečemo »baterija ima $9\,\mathrm{V}$«, zato se zdi, da ima napetost ena sama točka. V resnici je napetost vedno **med dvema točkama**, kot višinska razlika med kočo in vrhom. Ko polje premakne naboj $e$ iz točke A v točko B, opravi **delo električne sile** $A_e$. **Napetost** med A in B je to delo na enoto naboja:

$$U = \frac{A_e}{e}$$

Enota je volt, $1\,\mathrm{V} = 1\,\mathrm{J/As}$.

**6. Homogeno polje.** Med dvema vzporednima ploščama z nasprotnima nabojema je polje skoraj povsod enako. Silnice so vzporedne in enako goste. Takemu polju rečemo **homogeno**. Ko polje premakne naboj $e$ od ene plošče do druge, za razdaljo $d$, je sila nanj ves čas enaka, $F = eE$. Zato je delo $A_e = F d = eEd$. Delimo z $e$:

$$U = E d$$

Od tod $E = \dfrac{U}{d}$, zato jakost polja pišemo tudi v $\mathrm{V/m}$; $1\,\mathrm{V/m} = 1\,\mathrm{N/As}$.

:::risba skica
opis: Dve navpični plošči, razmaknjeni za d. Leva je pozitivna, napetost 12 V proti desni, desna negativna, 0 V. Med njima štiri vzporedne vodoravne puščice od leve k desni plošči: silnice homogenega polja. Tri navpične črtkane črte med ploščama, enako razmaknjene, so ekvipotencialne ploskve z napetostmi 9 V, 6 V in 3 V.
območje: 0; 0 .. 8; 5,6
enota: 36
črta: 1; 0,6 -> 1; 4,6 | debelo
črta: 7; 0,6 -> 7; 4,6 | debelo
črta: 2,5; 0,6 -> 2,5; 4,6 | siva črtkano
črta: 4; 0,6 -> 4; 4,6 | siva črtkano
črta: 5,5; 0,6 -> 5,5; 4,6 | siva črtkano
puščica: 1,1; 1,1 -> 6,9; 1,1 | | | modra
puščica: 1,1; 2,1 -> 6,9; 2,1 | | | modra
puščica: 1,1; 3,1 -> 6,9; 3,1 | | | modra
puščica: 1,1; 4,1 -> 6,9; 4,1 | | | modra
napis: 1; 5,1 | (+) 12 V | sredina
napis: 2,5; 5,1 | 9 V | sredina
napis: 4; 5,1 | 6 V | sredina
napis: 5,5; 5,1 | 3 V | sredina
napis: 7; 5,1 | (−) 0 V | sredina
napis: 4; 0,3 | razmik d | sredina
podnapis: Puščice so silnice, črtkane črte ekvipotencialne ploskve.
:::

Črtkane črte so **ekvipotencialne ploskve**: vse njihove točke imajo enako napetost proti negativni plošči. So kot plastnice na karti. Silnice so kot smer najstrmejšega spusta, zato so na »plastnice« pravokotne. Če naboj premikaš po ekvipotencialni ploskvi, polje ne opravi dela, tako kot hoja po plastnici ne spremeni višine. Jakost $E = U/d$ je električna strmina: koliko voltov pade na vsak meter.

:::premisli
Plošči sta priključeni na baterijo $12\,\mathrm{V}$ in sta $4\,\mathrm{mm}$ narazen. Kaj se zgodi z jakostjo polja, če ju primakneš na $2\,\mathrm{mm}$, baterija pa ostane priključena?
---
Jakost se podvoji, s $3000\,\mathrm{V/m}$ na $6000\,\mathrm{V/m}$. Baterija drži $12\,\mathrm{V}$, ta pa zdaj pade na pol krajši razdalji. Ista višinska razlika na krajši poti pomeni strmejši klanec.
:::

**7. Kondenzator.** Dve plošči, ki ju loči izolator (na primer zrak), tvorita **kondenzator**. Baterija prenese elektrone z ene plošče na drugo. Ena plošča dobi naboj $+e$, druga $-e$, med njima nastaneta homogeno polje in napetost $U$.

Tretja mamljiva zamisel: »Koliko naboja sprejme, je lastnost kondenzatorja.« Toda isti kondenzator pri dvakrat večji napetosti sprejme dvakrat več naboja. Stalno ostane razmerje, ki mu rečemo **kapaciteta**:

$$C = \frac{e}{U}$$

Enota je farad, $1\,\mathrm{F} = 1\,\mathrm{As/V}$. Farad je velika enota, zato so pogosti $\mu\mathrm{F}$, $\mathrm{nF}$ in $\mathrm{pF}$. Za ploščni kondenzator s ploščino plošče $S$ in razmikom $d$ velja

$$C = \frac{\varepsilon_0 S}{d}$$

Tu je $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\mathrm{As/(V\,m)}$ influenčna konstanta. Večji plošči in manjši razmik dajo večjo kapaciteto. Od napetosti kapaciteta ni odvisna. Kondenzator je shramba naboja: bliskavica ga polni nekaj sekund in izprazni v trenutku.

## Rešeni primeri

### Primer 1: jakost iz izmerjene sile

Na kroglico z nabojem $4\,\mathrm{nAs}$ v neki točki deluje električna sila $1{,}2\,\mathrm{mN}$. Kolikšna je jakost polja v tej točki? Kolikšna sila bi tam delovala na elektron?

**Podatki:** $e = 4\,\mathrm{nAs} = 4 \cdot 10^{-9}\,\mathrm{As}$, $F = 1{,}2\,\mathrm{mN} = 1{,}2 \cdot 10^{-3}\,\mathrm{N}$, $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$
**Iščemo:** jakost polja $E$ in silo $F_0$ na elektron

:::formula
$E = \dfrac{F}{e}$, nato $F_0 = e_0 E$
:::

**Rešitev:**

1. Enote smo pretvorili v $\mathrm{N}$ in $\mathrm{As}$, da dobimo $E$ v $\mathrm{N/As}$.
2. $E = \dfrac{1{,}2 \cdot 10^{-3}\,\mathrm{N}}{4 \cdot 10^{-9}\,\mathrm{As}} = 3 \cdot 10^5\,\mathrm{N/As}$.
3. Polje je lastnost točke, zato ga uporabimo tudi za elektron: $F_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As} \cdot 3 \cdot 10^5\,\mathrm{N/As} = 4{,}8 \cdot 10^{-14}\,\mathrm{N}$.
4. Elektron je negativen, zato sila nanj kaže nasprotno od smeri polja.
5. Odgovor: jakost polja je $3 \cdot 10^5\,\mathrm{N/As}$; na elektron bi delovala sila $4{,}8 \cdot 10^{-14}\,\mathrm{N}$ v nasprotni smeri polja.

### Primer 2: nevihta na planinski poti

Vremenska karta za popoldne napoveduje nevihte nad grebenom, po katerem pelje tvoja pot. Spodnji rob nevihtnega oblaka je $1{,}5\,\mathrm{km}$ nad grebenom, napetost med oblakom in tlemi je $3 \cdot 10^7\,\mathrm{V}$. Polje med oblakom in tlemi vzemi za homogeno. Kolikšna je jakost polja? Kolikokrat je manjša od jakosti $3 \cdot 10^6\,\mathrm{V/m}$, pri kateri zrak prebije?

**Podatki:** $d = 1{,}5\,\mathrm{km} = 1500\,\mathrm{m}$, $U = 3 \cdot 10^7\,\mathrm{V}$, $E_\mathrm{p} = 3 \cdot 10^6\,\mathrm{V/m}$
**Iščemo:** jakost polja $E$ in razmerje $E_\mathrm{p} : E$

:::formula
$E = \dfrac{U}{d}$
:::

**Rešitev:**

1. Polje je homogeno, zato jakost dobimo kot napetost na meter: $E = \dfrac{3 \cdot 10^7\,\mathrm{V}}{1500\,\mathrm{m}} = 2 \cdot 10^4\,\mathrm{V/m}$.
2. Primerjamo s prebojno jakostjo: $\dfrac{3 \cdot 10^6}{2 \cdot 10^4} = 150$.
3. Povprečno polje je torej $150$-krat prešibko za preboj. Ob konicah, vrhovih in štrlečih telesih pa se silnice zgostijo in polje je tam veliko močnejše. Tam se strela začne.
4. Odgovor: jakost polja je $2 \cdot 10^4\,\mathrm{V/m}$, kar je $150$-krat manj od prebojne. Zato se ob nevihti umakneš z grebena, kjer bi bil ti tista »konica«.

### Primer 3: kondenzator iz folije

Za šolski projekt izdelaš ploščni kondenzator iz dveh kosov aluminijaste folije. Vsak ima ploščino $0{,}5\,\mathrm{m^2}$, med njima je zrak. Kolikšen mora biti razmik med folijama, da bo kapaciteta $1\,\mathrm{nF}$? Kolikšen naboj se nabere na vsaki foliji, ko kondenzator priključiš na baterijo $9\,\mathrm{V}$?

**Podatki:** $S = 0{,}5\,\mathrm{m^2}$, $C = 1\,\mathrm{nF} = 1 \cdot 10^{-9}\,\mathrm{F}$, $U = 9\,\mathrm{V}$, $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\mathrm{As/(V\,m)}$
**Iščemo:** razmik $d$ in naboj $e$

:::formula
$C = \dfrac{\varepsilon_0 S}{d}$, izraženo $d = \dfrac{\varepsilon_0 S}{C}$; nato $e = C U$
:::

**Rešitev:**

1. Iščemo razmik, zato enačbo za kapaciteto obrnemo: $d = \dfrac{\varepsilon_0 S}{C}$.
2. $d = \dfrac{8{,}85 \cdot 10^{-12} \cdot 0{,}5}{1 \cdot 10^{-9}}\,\mathrm{m} \approx 4{,}4 \cdot 10^{-3}\,\mathrm{m}$, torej približno $4{,}4\,\mathrm{mm}$.
3. Naboj sledi iz definicije kapacitete: $e = 1 \cdot 10^{-9}\,\mathrm{F} \cdot 9\,\mathrm{V} = 9 \cdot 10^{-9}\,\mathrm{As}$.
4. Odgovor: foliji morata biti približno $4{,}4\,\mathrm{mm}$ narazen; na vsaki se nabere $9\,\mathrm{nAs}$ (na eni pozitivnega, na drugi negativnega).

### Primer 4 – zdaj ti

Na kateri razdalji od majhne kroglice z nabojem $8\,\mathrm{nAs}$ je jakost polja $800\,\mathrm{N/As}$?

**Podatki:** $e = 8\,\mathrm{nAs} = 8 \cdot 10^{-9}\,\mathrm{As}$, $E = 800\,\mathrm{N/As}$, $\dfrac{1}{4\pi\varepsilon_0} \approx 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$
**Iščemo:** razdaljo $r$

:::formula
$E = \dfrac{e}{4\pi\varepsilon_0 r^2}$, izraženo $r = \sqrt{\dfrac{e}{4\pi\varepsilon_0 E}}$
:::

**Rešitev:**

1. Neznanka je razdalja, zato enačbo pomnožimo z $r^2$ in delimo z $E$: $r^2 = \dfrac{e}{4\pi\varepsilon_0 E}$.
2. Vstavi števila, izračunaj $r^2$ in nato koreni.

:::premisli
Koliko je $r$?
---
$r^2 = \dfrac{9{,}0 \cdot 10^9 \cdot 8 \cdot 10^{-9}}{800}\,\mathrm{m^2} = 0{,}09\,\mathrm{m^2}$, zato $r = 0{,}3\,\mathrm{m} = 30\,\mathrm{cm}$.
:::

## Pogoste napake

- **»Večji poskusni naboj, močnejše polje.«** Ker na večji naboj deluje večja sila, se zdi, da je tam tudi polje močnejše. Toda v $E = F/e$ se sila poveča natanko tolikokrat kot naboj, zato količnik ostane. Polje določajo naboji, ki ga ustvarjajo, in razdalja do njih; poskusni naboj ga le izmeri.
- **Pozabljen kvadrat.** »Dvakrat dlje, pol šibkejše polje.« Pri točkastem naboju je $r$ v imenovalcu na kvadrat, zato je polje dvakrat dlje štirikrat šibkejše. Razdaljo pretvori v metre in jo kvadriraj.
- **$E = U \cdot d$.** Ker je $U = Ed$, nekateri množijo napetost in razmik, saj »več razdalje pomeni več polja«. Narobe: ista napetost na daljši razdalji da šibkejše polje, kot ista višinska razlika na daljši poti blažji klanec. Pravilno je $E = U/d$; preveri z enoto $\mathrm{V/m}$.
- **Napetost v eni točki.** »Ta točka ima $6\,\mathrm{V}$« nima pomena, če ne povemo, proti čemu. Napetost je vedno med dvema točkama, kot višinska razlika. Ko rečemo napetost točke, mislimo napetost proti izbrani ničli, na primer negativni plošči ali tlom.
- **Kapaciteta raste z napetostjo.** »Pri večji napetosti ima kondenzator več naboja, torej večjo kapaciteto.« Naboj in napetost se povečata enakokrat, zato $C = e/U$ ostane enak. Kapaciteto spremeniš le z drugačnimi ploščami, razmikom ali snovjo med njima.

## Povzetek

- Jakost električnega polja je sila na enoto naboja: $E = \dfrac{F}{e}$, enota $\mathrm{N/As} = \mathrm{V/m}$. Smer je smer sile na pozitivni naboj. Ni odvisna od poskusnega naboja.
- Točkasti naboj: $E = \dfrac{e}{4\pi\varepsilon_0 r^2}$; dvakrat dlje je polje štirikrat šibkejše.
- Silnice gredo od pozitivnega k negativnemu naboju; gostejše silnice pomenijo močnejše polje.
- Napetost med dvema točkama je delo električne sile na enoto naboja: $U = \dfrac{A_e}{e}$, enota $\mathrm{V}$.
- Homogeno polje med ploščama: $U = E d$. Ekvipotencialne ploskve so pravokotne na silnice.
- Kapaciteta $C = \dfrac{e}{U}$, enota $\mathrm{F}$; ploščni kondenzator $C = \dfrac{\varepsilon_0 S}{d}$, $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\mathrm{As/(V\,m)}$. Kapaciteta ni odvisna od napetosti.

## Drugače: Kot zgodba

Plusek je drobcen pozitiven naboj, $1\,\mathrm{nAs}$. Stoji ob pozitivni plošči kondenzatorja z napetostjo $12\,\mathrm{V}$, druga plošča je $6\,\mathrm{cm}$ stran.

V rokah ima karto. Na njej so »plastnice«: ploskve z $12\,\mathrm{V}$, $9\,\mathrm{V}$, $6\,\mathrm{V}$, $3\,\mathrm{V}$ in $0\,\mathrm{V}$. Med ploščama so enako razmaknjene, ker je polje homogeno. Jakost je povsod $E = \dfrac{12\,\mathrm{V}}{0{,}06\,\mathrm{m}} = 200\,\mathrm{V/m}$.

Plusek najprej hodi vzdolž svoje plastnice. Čeprav ga polje ves čas potiska proti negativni plošči, se ne premakne »navzdol«, zato polje ne opravi nobenega dela. Potem se prepusti in polje ga odnese do negativne plošče. Pri tem polje opravi delo $A_e = 1 \cdot 10^{-9}\,\mathrm{As} \cdot 12\,\mathrm{V} = 1{,}2 \cdot 10^{-8}\,\mathrm{J}$.

Za njim pride njegov dvojček z dvakrat večjim nabojem. Nanj deluje dvakrat večja sila in polje opravi dvakrat več dela. Karta pa je zanj čisto enaka: ista jakost $200\,\mathrm{V/m}$, ista napetost $12\,\mathrm{V}$. Karta pripada pokrajini, ne popotniku.

## Drugače: Korak za korakom s številkami

Ploščni kondenzator: ploščina plošče $0{,}01\,\mathrm{m^2}$, razmik $2\,\mathrm{mm}$, priključen na $100\,\mathrm{V}$.

1. Jakost polja: $E = \dfrac{100\,\mathrm{V}}{0{,}002\,\mathrm{m}} = 5 \cdot 10^4\,\mathrm{V/m}$.
2. Kapaciteta: $C = \dfrac{8{,}85 \cdot 10^{-12} \cdot 0{,}01}{0{,}002}\,\mathrm{F} = 4{,}425 \cdot 10^{-11}\,\mathrm{F}$, to je približno $44\,\mathrm{pF}$.
3. Naboj na plošči: $e = 4{,}425 \cdot 10^{-11}\,\mathrm{F} \cdot 100\,\mathrm{V} \approx 4{,}4 \cdot 10^{-9}\,\mathrm{As}$.
4. Sila na poskusni naboj $1\,\mathrm{nAs}$ med ploščama: $F = 1 \cdot 10^{-9}\,\mathrm{As} \cdot 5 \cdot 10^4\,\mathrm{V/m} = 5 \cdot 10^{-5}\,\mathrm{N}$, povsod enaka, ker je polje homogeno.
5. Preizkus: če razmik podvojiš pri isti napetosti, se jakost, kapaciteta in naboj razpolovijo.

## Preveri se

? Merilnik nad grebenom pokaže jakost električnega polja $2 \cdot 10^4\,\mathrm{N/As}$. Kaj pove ta podatek?
- Na vsako telo v tej točki deluje sila $2 \cdot 10^4\,\mathrm{N}$.
~ Sila je odvisna od naboja telesa, $F = eE$. Na nenabito telo polje ne deluje.
+ Na vsak $1\,\mathrm{As}$ naboja, postavljen v to točko, bi delovala sila $2 \cdot 10^4\,\mathrm{N}$.
- Napetost med to točko in tlemi je $2 \cdot 10^4\,\mathrm{V}$.
~ Napetost je med dvema točkama in je odvisna še od razdalje, $U = Ed$. Jakost je napetost na meter.
- Polje je tako močno le, dokler je tam merilnik.
~ Polje obstaja tudi brez merilnika; poskusni naboj ga le izmeri, ne ustvari.
> Jakost polja je sila na enoto naboja, $E = F/e$. Je lastnost točke: kateri koli naboj $e$ bi tam čutil silo $eE$.

? Kondenzator K1 ima ploščino plošč $S$ in razmik $d$, K2 ploščino $2S$ in razmik $d$, K3 ploščino $S$ in razmik $2d$. Razvrsti jih po kapaciteti od največje do najmanjše.
- K3, K1, K2
~ Večji razmik kapaciteto zmanjša, ker je $d$ v imenovalcu: $C = \varepsilon_0 S/d$.
+ K2, K1, K3
- Vsi imajo enako kapaciteto.
~ Kapaciteta je odvisna od ploščine in razmika, ti dve pa se med kondenzatorji razlikujeta.
> $C = \dfrac{\varepsilon_0 S}{d}$: K2 ima dvakratno kapaciteto K1, K3 polovično.

? Kondenzator ostane priključen na baterijo, ti pa plošči razmakneš na dvakratno razdaljo. Kaj se zgodi z jakostjo polja med ploščama?
- Podvoji se.
~ To bi veljalo za $E = U \cdot d$. Pravilno je $E = U/d$: ista napetost na daljši razdalji da šibkejše polje.
- Ostane enaka, ker je baterija ista.
~ Baterija drži stalno napetost, ne jakosti polja. Jakost je napetost na meter razmika.
+ Razpolovi se.
> Napetost ostane, razmik se podvoji, zato se $E = U/d$ razpolovi. Hkrati se razpolovita kapaciteta in naboj na ploščah.

? Kolikšna je jakost polja $3\,\mathrm{cm}$ od majhne kroglice z nabojem $2\,\mathrm{nAs}$?
- $2\,\mathrm{N/As}$
~ Tako dobiš, če razdaljo vstaviš v centimetrih ($3$ namesto $0{,}03\,\mathrm{m}$).
- $600\,\mathrm{N/As}$
~ Tu manjka kvadrat razdalje: deliti moraš z $r^2$, ne z $r$.
+ $2 \cdot 10^4\,\mathrm{N/As}$
> $E = \dfrac{9{,}0 \cdot 10^9 \cdot 2 \cdot 10^{-9}}{0{,}03^2}\,\mathrm{N/As}$, to je $\dfrac{18}{9 \cdot 10^{-4}}\,\mathrm{N/As} = 2 \cdot 10^4\,\mathrm{N/As}$.

? Kondenzator v bliskavici ima kapaciteto $47\,\mu\mathrm{F}$ in ga napolnimo na $12\,\mathrm{V}$. Kolikšen naboj je na vsaki plošči?
- $3{,}9 \cdot 10^{-6}\,\mathrm{As}$
~ To je $C/U$. Iz $C = e/U$ sledi $e = CU$, torej množiš.
+ $5{,}6 \cdot 10^{-4}\,\mathrm{As}$
- $2{,}6 \cdot 10^{5}\,\mathrm{As}$
~ To je $U/C$, obrnjeno razmerje. Tak naboj bi bil nesmiselno velik.
> $e = CU = 47 \cdot 10^{-6}\,\mathrm{F} \cdot 12\,\mathrm{V} = 5{,}64 \cdot 10^{-4}\,\mathrm{As}$, torej $e \approx 5{,}6 \cdot 10^{-4}\,\mathrm{As}$, to je $0{,}56\,\mathrm{mAs}$.

:::simboli
E | jakost električnega polja | E = \frac{F}{e} | N/As | enako V/m
F | električna sila | F = e E | N
e | naboj | | As | v $E = F/e$ poskusni, pri točkastem naboju izvorni
r | razdalja od točkastega naboja | | m
\varepsilon_0 | influenčna konstanta | | As/(V\,m) | $8{,}85 \cdot 10^{-12}$
U | napetost | U = \frac{A_e}{e} | V | vedno med dvema točkama
A_e | delo električne sile | A_e = e U | J
d | razmik med ploščama | | m
C | kapaciteta | C = \frac{e}{U} | F
S | ploščina plošče | | m^2
e_0 | osnovni naboj | | As | $1{,}6 \cdot 10^{-19}$
F_0 | sila na elektron | F_0 = e_0 E | N
E_\mathrm{p} | prebojna jakost zraka | | V/m | pri tej jakosti zrak prebije
:::
