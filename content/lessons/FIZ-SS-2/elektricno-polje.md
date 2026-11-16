---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pred turo v Julijskih Alpah odpreš planinsko karto. Kjer so plastnice gosto skupaj, bo pot strma. Kjer so redke, bo položna. Karta to pove, še preden stopiš na pot: strmina je v pobočju, ne glede na to, ali kdo hodi po njem.

Jadralni pilot pred poletom pogleda vetrovno karto. Puščice na njej kažejo, kam piha veter in kako močno. Tudi ta karta opisuje vsako točko neba, čeprav tam ni nobenega letala. Ko letalo prileti tja, veter deluje nanj, kot kaže puščica.

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

:::risba skica
opis: Vodoravna silnica s puščico v desno, označena E. Nad njo pozitiven poskusni naboj s puščico sile v desno, v smeri polja. Pod njo negativen poskusni naboj s puščico sile v levo, nasprotno od polja.
območje: 0; -1,6 .. 8; 1,8
enota: 36
puščica: 0,3; 0 -> 6,9; 0 | | | modra
napis: 7,1; 0 | E | desno
napis: 3; 1 | + | sredina
puščica: 3,4; 1 -> 5,4; 1 | F | nad
napis: 5; -1 | − | sredina
puščica: 4,6; -1 -> 2,6; -1 | F | pod
podnapis: Sila na pozitivni naboj kaže v smer polja, sila na negativni naboj v nasprotno smer.
:::

**3. Polje točkastega naboja.** Zdaj naj bo $e$ naboj, ki polje *ustvarja*. Coulombovo silo na poskusni naboj na razdalji $r$ delimo s poskusnim nabojem. Ker poskusni naboj v sili nastopa kot faktor, se okrajša:

$$E = \frac{e}{4\pi\varepsilon_0 r^2}$$

Kot v Coulombovem zakonu velja $\dfrac{1}{4\pi\varepsilon_0} \approx 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/(As)^2}$. Jakost pada s kvadratom razdalje.

:::premisli
Kroglica ima naboj $1\,\mathrm{nAs}$. Na razdalji $1\,\mathrm{cm}$ je jakost njenega polja $90\,\mathrm{kN/As}$. Napovej jakost na razdalji $3\,\mathrm{cm}$, preden pogledaš graf spodaj.
---
$10\,\mathrm{kN/As}$. Razdalja je trikrat večja, jakost pa pade s kvadratom, torej $9$-krat: $90 : 9 = 10$.
:::

:::risba graf
opis: Graf jakosti polja kroglice z nabojem 1 nAs v odvisnosti od razdalje r v centimetrih. Krivulja strmo pada: pri 1 cm je 90 kN/As, pri 2 cm 22,5 kN/As, pri 3 cm 10 kN/As. Točka A je pri razdalji {a} cm z jakostjo {90/(a*a):.1} kN/As, točka B pri dvakratni razdalji {2*a} cm z jakostjo {22.5/(a*a):.1} kN/As, kar je četrtina.
x: 0 .. 10 | 1 | r [cm]
y: 0 .. 100 | 20 | E [kN/As]
drsnik: a | 1 .. 4 | 0,5 | 1 | razdalja točke A v cm
f: 90/x^2 | modra | 0,95 .. 10
točka: a; 90/a^2 | A | nad desno
točka: 2*a; 22.5/a^2 | B | nad desno
napis: 7; 88 | A: {90/a^2:.1} kN/As | sredina
napis: 7; 74 | B: {22.5/a^2:.1} kN/As | sredina
podnapis: B je dvakrat dlje od kroglice kot A, jakost v B je četrtina jakosti v A.
:::

V aplikaciji premikaj drsnik in točko A pomakni od $1\,\mathrm{cm}$ do $4\,\mathrm{cm}$. Točka B je vedno dvakrat dlje. Opazi, da je jakost v B vedno natanko četrtina jakosti v A: pri $1\,\mathrm{cm}$ je $90\,\mathrm{kN/As}$ proti $22{,}5\,\mathrm{kN/As}$, pri $4\,\mathrm{cm}$ pa $5{,}6\,\mathrm{kN/As}$ proti $1{,}4\,\mathrm{kN/As}$.

**4. Silnice.** Polje rišemo kot vetrovno karto, s **silnicami**. Silnica v vsaki točki kaže smer polja. Začne se na pozitivnem naboju in konča na negativnem ali pa gre v daljavo, če negativnega naboja ni blizu. Kjer so silnice goste, je polje močno.

:::risba skica
opis: Pozitiven točkasti naboj v sredini. Iz njega gre osem puščic naravnost navzven kot žarki: silnice. Okoli naboja sta dva kroga s polmeroma r in 2r; oba polmera sta narisana s črtkano črto in označena. Na zunanjem krogu so puščice dvakrat bolj narazen kot na notranjem.
območje: -3; -3 .. 3; 3
enota: 40
krog: 0; 0 | 1,2 | črtkano
krog: 0; 0 | 2,4 | črtkano
puščica: 0,45; 0 -> 2,7; 0 | | | modra
puščica: 0,32; 0,32 -> 1,91; 1,91 | | | modra
puščica: 0; 0,45 -> 0; 2,7 | | | modra
puščica: -0,32; 0,32 -> -1,91; 1,91 | | | modra
puščica: -0,45; 0 -> -2,7; 0 | | | modra
puščica: -0,32; -0,32 -> -1,91; -1,91 | | | modra
puščica: 0; -0,45 -> 0; -2,7 | | | modra
puščica: 0,32; -0,32 -> 1,91; -1,91 | | | modra
napis: 0; 0 | + | sredina
črta: 0; 0 -> 1,11; 0,46 | črtkano
črta: 0; 0 -> 2,22; -0,92 | črtkano
napis: 1,11; 0,46 | r | nad desno
napis: 2,22; -0,92 | 2r | pod desno
podnapis: Slika kaže le prerez. V prostoru se iste silnice na razdalji 2r porazdelijo po 4-krat večji površini krogle.
:::

Slika pojasni, od kod kvadrat v formuli. Jakost polja je sorazmerna s številom silnic, ki prebodejo kvadratni meter. Iz naboja gre vedno enako število silnic. V prostoru se razširijo po krogli okoli naboja. Krogla s polmerom $2r$ ima štirikrat večjo površino kot krogla s polmerom $r$, saj površina raste s kvadratom polmera. Na ravninski sliki so puščice na krogu $2r$ le dvakrat bolj narazen. V prostoru pa se razmaknejo v dveh smereh, zato je na kvadratni meter štirikrat manj silnic in polje je štirikrat šibkejše.

V simulaciji spodaj »Električno polje točkastih nabojev« postavi en pozitiven in en negativen naboj. Opazuj, da silnice tečejo od plusa k minusu in da se zgostijo ob obeh nabojih. Silnica ni pot naboja: kaže le smer sile v vsaki točki.

**5. Druga mamljiva zamisel: napetost v točki.** Rečemo »ta žica je na $230\,\mathrm{V}$«, zato se zdi, da ima napetost ena sama točka. V resnici je napetost vedno **med dvema točkama**, kot višinska razlika med kočo in vrhom. Ko polje premakne naboj $e$ iz točke A v točko B, opravi **delo električne sile** $A_e$. **Napetost** med A in B je to delo na enoto naboja:

$$U = \frac{A_e}{e}$$

Enota je volt, $1\,\mathrm{V} = 1\,\mathrm{J/As}$.

**6. Homogeno polje.** Med dvema vzporednima ploščama z nasprotnima nabojema je polje skoraj povsod enako. Silnice so vzporedne in enako goste. Takemu polju rečemo **homogeno**. Ko polje premakne naboj $e$ od ene plošče do druge, za razdaljo $d$, je sila nanj ves čas enaka, $F = eE$. Zato je delo $A_e = F d = eEd$. Delimo z $e$:

$$U = E d$$

Od tod $E = \dfrac{U}{d}$, zato jakost polja pišemo tudi v $\mathrm{V/m}$; $1\,\mathrm{V/m} = 1\,\mathrm{N/As}$.

:::risba skica
opis: Dve navpični plošči, razmaknjeni za d; razmik kaže dvojna puščica pod ploščama. Leva je pozitivna, napetost 12 V proti desni, desna negativna, 0 V. Med njima štiri vzporedne vodoravne puščice od leve k desni plošči: silnice homogenega polja. Tri navpične črtkane črte med ploščama, enako razmaknjene, so ekvipotencialne ploskve z napetostmi 9 V, 6 V in 3 V.
območje: 0; -0,6 .. 8; 5,6
enota: 36
črta: 1; 0,6 -> 1; 0 | siva
črta: 7; 0,6 -> 7; 0 | siva
puščica: 4; 0,3 -> 1; 0,3
puščica: 4; 0,3 -> 7; 0,3
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
napis: 4; 0,2 | razmik d | pod
podnapis: Vodoravne puščice so silnice, črtkane črte ekvipotencialne ploskve, dvojna puščica spodaj je razmik d.
:::

Črtkane črte so **ekvipotencialne ploskve**: vse njihove točke imajo enako napetost proti negativni plošči. So kot plastnice na karti. Silnice so kot smer najstrmejšega spusta, zato so na »plastnice« pravokotne. Če naboj premikaš po ekvipotencialni ploskvi, polje ne opravi dela, tako kot hoja po plastnici ne spremeni višine. Jakost $E = U/d$ je električna strmina: koliko voltov pade na vsak meter.

V simulaciji »3D: Silnice in ekvipotencialne ploskve« poglej rob dveh nabitih plošč. Silnice se tam ukrivijo navzven, zato je polje homogeno le v sredini.

:::premisli
Plošči sta priključeni na baterijo $12\,\mathrm{V}$ in sta $4\,\mathrm{mm}$ narazen. Kaj se zgodi z jakostjo polja, če ju primakneš na $2\,\mathrm{mm}$, baterija pa ostane priključena?
---
Jakost se podvoji, s $3000\,\mathrm{V/m}$ na $6000\,\mathrm{V/m}$. Baterija drži $12\,\mathrm{V}$, ta pa zdaj pade na pol krajši razdalji. Ista višinska razlika na krajši poti pomeni strmejši klanec.
:::

:::risba graf
opis: Napetost proti negativni plošči v odvisnosti od lege x. Pozitivna plošča je pri x = 1 mm in ima {U} V, negativna je {d} mm desno od nje, pri x = {1+d} mm, in ima 0 V. Napetost pada enakomerno, graf je ravna črta. Strmina črte (koliko voltov pade na milimeter) je jakost polja E = {U/d:.2} kV/m.
x: 0 .. 11 | 1 | x [mm]
y: 0 .. 16 | 4 | U [V]
drsnik: U | 3 .. 12 | 3 | 12 | napetost baterije v V
drsnik: d | 2 .. 8 | 1 | 4 | razmik plošč v mm
črta: 1; 0 -> 1; 13 | debelo
črta: 1+d; 0 -> 1+d; 13 | debelo
črta: 1; U -> 1+d; 0 | modra debelo
točka: 1; U | {U} V | nad desno
napis: 6; 14,8 | E = {U/d:.2} kV/m | sredina
podnapis: Debeli navpični črti sta plošči: pozitivna pri x = 1 mm, negativna d desno od nje. Bolj strma črta pomeni močnejše polje.
:::

V aplikaciji nastavi razmik na $2\,\mathrm{mm}$ in preveri napoved: jakost skoči s $3{,}00\,\mathrm{kV/m}$ na $6{,}00\,\mathrm{kV/m}$, črta postane dvakrat bolj strma. Nato spreminjaj napetost pri stalnem razmiku. Opazi, da je jakost vedno napetost, deljena z razmikom: $1\,\mathrm{V/mm} = 1\,\mathrm{kV/m}$.

**7. Kondenzator.** Dve plošči, ki ju loči izolator (na primer zrak), tvorita **kondenzator**. Baterija prenese elektrone z ene plošče na drugo. Ena plošča dobi naboj $+e$, druga $-e$, med njima nastaneta homogeno polje in napetost $U$.

Tretja mamljiva zamisel: »Koliko naboja sprejme, je lastnost kondenzatorja.« Poglej meritve na enem kondenzatorju:

| $U$ [V] | $e$ [nAs] | $e/U$ [nAs/V] |
|---|---|---|
| 3 | 6 | 2 |
| 6 | 12 | 2 |
| 9 | 18 | 2 |

Pri dvakrat večji napetosti sprejme dvakrat več naboja, kot v razdelku 1 sila. Stalno ostane razmerje, ki mu rečemo **kapaciteta**:

$$C = \frac{e}{U}$$

Enota je farad, $1\,\mathrm{F} = 1\,\mathrm{As/V}$. Farad je velika enota, zato so pogosti $\mu\mathrm{F}$, $\mathrm{nF}$ in $\mathrm{pF}$.

Od česa je odvisna kapaciteta? Iz vsakega delčka naboja na plošči izhaja enako število silnic. Jakost polja med ploščama je zato sorazmerna z nabojem na kvadratni meter plošče. Konstanto dobimo pri točkastem naboju: jakost, pomnožena s površino krogle, je $E \cdot 4\pi r^2 = e/\varepsilon_0$, ne glede na $r$. To je »število silnic« iz naboja $e$. Če se te silnice enakomerno razporedijo po ploščini $S$, je:

$$E = \frac{e}{\varepsilon_0 S}$$

Tu je $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\mathrm{As/(V\,m)}$ influenčna konstanta, ista kot v Coulombovem zakonu (enota $\mathrm{(As)^2/(N\,m^2)}$ je enaka $\mathrm{As/(V\,m)}$). Napetost je $U = Ed = \dfrac{e\,d}{\varepsilon_0 S}$. Ko to vstavimo v $C = e/U$, se naboj okrajša:

$$C = \frac{\varepsilon_0 S}{d}$$

Z besedami: na večji plošči se isti naboj bolj razredči, polje in napetost sta manjša, zato pri isti napetosti plošča sprejme več naboja. Pri večjem razmiku isti naboj da večjo napetost $U = Ed$, kapaciteta je manjša.

Kondenzator hrani ločen naboj, $+e$ na eni in $-e$ na drugi plošči, skupaj nič. S tem hrani tudi energijo. Med polnjenjem napetost enakomerno raste od $0$ do $U$, povprečno je $U/2$. Delo za prenos naboja $e$ je zato $W = e \cdot \tfrac{U}{2} = \tfrac12 CU^2$, kar je ploščina trikotnika pod grafom $U(e)$. Kondenzator v bliskavici fotoaparata ima recimo $100\,\mu\mathrm{F}$ in se napolni na približno $300\,\mathrm{V}$. Tako hrani $\tfrac12 \cdot 10^{-4}\,\mathrm{F} \cdot (300\,\mathrm{V})^2 = 4{,}5\,\mathrm{J}$, ki se v bliskovni cevi (ksenonski žarnici) v približno tisočinki sekunde spremeni v blisk.

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

Vremenska karta za popoldne napoveduje nevihte nad grebenom, po katerem pelje tvoja pot. Spodnji rob nevihtnega oblaka je $1{,}5\,\mathrm{km}$ nad grebenom. Napetost med oblakom in tlemi je reda velikosti $10^7\,\mathrm{V}$ do $10^8\,\mathrm{V}$, ob močnih nevihtah tudi več. Vzemi $3 \cdot 10^7\,\mathrm{V}$ in privzemi, da je polje med oblakom in tlemi homogeno. Kolikšna je jakost polja? Kolikokrat je manjša od jakosti približno $3 \cdot 10^6\,\mathrm{V/m}$, pri kateri suh zrak ob tleh prebije?

**Podatki:** $d = 1{,}5\,\mathrm{km} = 1500\,\mathrm{m}$, $U = 3 \cdot 10^7\,\mathrm{V}$, $E_\mathrm{p} = 3 \cdot 10^6\,\mathrm{V/m}$
**Iščemo:** jakost polja $E$ in razmerje $E_\mathrm{p} : E$

:::formula
$E = \dfrac{U}{d}$
:::

**Rešitev:**

1. Polje je homogeno, zato jakost dobimo kot napetost na meter: $E = \dfrac{3 \cdot 10^7\,\mathrm{V}}{1500\,\mathrm{m}} = 2 \cdot 10^4\,\mathrm{V/m}$.
2. Primerjamo s prebojno jakostjo: $\dfrac{3 \cdot 10^6}{2 \cdot 10^4} = 150$.
3. Povprečno polje je torej $150$-krat prešibko za preboj. Ob konicah, vrhovih in štrlečih telesih pa se silnice zgostijo in polje je tam veliko močnejše. Tam zrak najlažje prebije. Tudi lasje se v takem polju nabijejo z enakim nabojem, zato se med seboj odbijajo in naježijo, njihove konice pa polje še zgostijo.
4. Odgovor: jakost polja je $2 \cdot 10^4\,\mathrm{V/m}$, kar je $150$-krat manj od prebojne. Zato se ob nevihti umakneš z grebena, kjer bi bil ti tista »konica«.

### Primer 3: kondenzator iz obloženih plošč

Za šolski projekt izdelaš ploščni kondenzator iz dveh trdih plošč, obloženih z aluminijasto folijo. Vsaka obloga ima ploščino $0{,}5\,\mathrm{m^2}$, med njima je zrak, razmik držijo plastični distančniki. Kolikšen mora biti razmik med oblogama, da bo kapaciteta $1\,\mathrm{nF}$? Kolikšen naboj se nabere na vsaki oblogi, ko kondenzator priključiš na baterijo $9\,\mathrm{V}$? Nato zamenjaš distančnike s pol krajšimi, baterija ostane priključena. Kaj se zgodi z nabojem in z jakostjo polja?

**Podatki:** $S = 0{,}5\,\mathrm{m^2}$, $C = 1\,\mathrm{nF} = 1 \cdot 10^{-9}\,\mathrm{F}$, $U = 9\,\mathrm{V}$, $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\mathrm{As/(V\,m)}$
**Iščemo:** razmik $d$, naboj $e$ ter naboj in jakost po skrajšanju razmika

:::formula
$C = \dfrac{\varepsilon_0 S}{d}$, izraženo $d = \dfrac{\varepsilon_0 S}{C}$; nato $e = C U$ in $E = \dfrac{U}{d}$
:::

**Rešitev:**

1. Iščemo razmik, zato enačbo za kapaciteto obrnemo: $d = \dfrac{\varepsilon_0 S}{C}$.
2. $d = \dfrac{8{,}85 \cdot 10^{-12} \cdot 0{,}5}{1 \cdot 10^{-9}}\,\mathrm{m} \approx 4{,}4 \cdot 10^{-3}\,\mathrm{m}$, torej približno $4{,}4\,\mathrm{mm}$.
3. Naboj sledi iz definicije kapacitete: $e = 1 \cdot 10^{-9}\,\mathrm{F} \cdot 9\,\mathrm{V} = 9 \cdot 10^{-9}\,\mathrm{As}$.
4. Polje pred spremembo: $E = \dfrac{9\,\mathrm{V}}{4{,}4 \cdot 10^{-3}\,\mathrm{m}} \approx 2 \cdot 10^3\,\mathrm{V/m}$.
5. Pri pol krajšem razmiku se kapaciteta podvoji na $2\,\mathrm{nF}$, napetost pa ostane $9\,\mathrm{V}$, ker jo drži baterija. Zato $e = 2 \cdot 10^{-9}\,\mathrm{F} \cdot 9\,\mathrm{V} = 18 \cdot 10^{-9}\,\mathrm{As}$, baterija dovede še $9\,\mathrm{nAs}$.
6. Ista napetost na pol krajši razdalji: jakost se podvoji na približno $4 \cdot 10^3\,\mathrm{V/m}$.
7. Odgovor: razmik je približno $4{,}4\,\mathrm{mm}$, naboj na vsaki oblogi $9\,\mathrm{nAs}$ (nasprotnih predznakov). Pri pol krajšem razmiku se naboj in jakost podvojita.

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
- **Kapaciteta raste z napetostjo.** »Pri večji napetosti ima kondenzator več naboja, torej večjo kapaciteto.« Naboj in napetost se povečata enakokrat, zato $C = e/U$ ostane enak. Kapaciteto spremeniš le z drugačno ploščino ali razmikom plošč.

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

Plusek najprej hodi vzdolž svoje plastnice. Polje ga potiska proti negativni plošči, a se ne premakne »navzdol«, zato polje ne opravi dela. Potem se prepusti in polje ga odnese do negativne plošče. Pri tem polje opravi delo $A_e = 1 \cdot 10^{-9}\,\mathrm{As} \cdot 12\,\mathrm{V} = 1{,}2 \cdot 10^{-8}\,\mathrm{J}$.

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
~ Sila je odvisna od naboja telesa, $F = eE$. Na telo brez naboja ($e = 0$) sila $eE$ ne deluje.
+ Na vsak $1\,\mathrm{As}$ naboja, postavljen v to točko, bi delovala sila $2 \cdot 10^4\,\mathrm{N}$.
- Napetost med to točko in tlemi je $2 \cdot 10^4\,\mathrm{V}$.
~ Napetost je med dvema točkama in je odvisna še od razdalje, $U = Ed$. Jakost je napetost na meter.
- Polje je tako močno le, dokler je tam merilnik.
~ Polje obstaja tudi brez merilnika; poskusni naboj ga le izmeri, ne ustvari.
> Jakost polja je sila na enoto naboja, $E = F/e$. Je lastnost točke: kateri koli naboj $e$ bi tam čutil silo $eE$.

? Štirje ploščni kondenzatorji imajo med ploščama zrak. Razvrsti jih po kapaciteti od največje do najmanjše.
1. ploščina $2S$, razmik $d$
2. ploščina $4S$, razmik $3d$
3. ploščina $S$, razmik $d$
4. ploščina $S$, razmik $2d$
> $C = \dfrac{\varepsilon_0 S}{d}$, zato primerjaš količnik ploščine in razmika: $2$; $1{,}33$; $1$ in $0{,}5$ (v enotah $\varepsilon_0 S/d$). Večja ploščina kapaciteto poveča, večji razmik jo zmanjša.

? Kondenzator ostane priključen na baterijo, ti pa plošči razmakneš na dvakratno razdaljo. Kaj se zgodi z jakostjo polja med ploščama?
- Podvoji se.
~ To bi veljalo za $E = U \cdot d$. Pravilno je $E = U/d$: ista napetost na daljši razdalji da šibkejše polje.
- Ostane enaka, ker je baterija ista.
~ Baterija drži stalno napetost, ne jakosti polja. Jakost je napetost na meter razmika.
+ Razpolovi se.
> Napetost ostane, razmik se podvoji, zato se $E = U/d$ razpolovi. Hkrati se razpolovita kapaciteta in naboj na ploščah.

? Kolikšna je jakost polja $3\,\mathrm{cm}$ od majhne kroglice z nabojem $2\,\mathrm{nAs}$? Rezultat vpiši v $\mathrm{kN/As}$.
= 20 kN/As | 0,5
~ 0,002 | Razdaljo si vstavil v centimetrih ($3$ namesto $0{,}03\,\mathrm{m}$), zato si dobil $2\,\mathrm{N/As}$.
~ 0,6 | Manjka kvadrat razdalje: deliti moraš z $r^2$, ne z $r$. Tako dobiš $600\,\mathrm{N/As}$.
~ 20000 | To je pravilna jakost v $\mathrm{N/As}$; pretvori še v $\mathrm{kN/As}$.
> $E = \dfrac{9{,}0 \cdot 10^9 \cdot 2 \cdot 10^{-9}}{0{,}03^2}\,\mathrm{N/As}$, to je $\dfrac{18}{9 \cdot 10^{-4}}\,\mathrm{N/As} = 2 \cdot 10^4\,\mathrm{N/As} = 20\,\mathrm{kN/As}$.

? Kondenzator so polnili pri različnih napetostih in vsakič izmerili naboj na plošči. Z grafa odčitaj kapaciteto kondenzatorja v $\mu\mathrm{F}$.
:::risba graf
opis: Graf naboja na plošči v mikroampersekundah v odvisnosti od napetosti v voltih. Izmerjene točke so pri 0 V 0, pri 4 V 2, pri 8 V 4 in pri 12 V 6 mikroampersekund. Skozi točke gre ravna črta iz izhodišča.
x: 0 .. 14 | 2 | U [V]
y: 0 .. 8 | 1 | e [µAs]
črta: 0; 0 -> 13; 6,5 | modra
točka: 0; 0
točka: 4; 2
točka: 8; 4
točka: 12; 6
:::
= 0,5 µF | 0,02
~ 2 | To je $U/e$, obrnjeno razmerje. Kapaciteta je $C = e/U$: naboj deliš z napetostjo.
~ 6 | To je naboj pri $12\,\mathrm{V}$, ne kapaciteta. Deliti ga moraš še z napetostjo.
> Pri $12\,\mathrm{V}$ je naboj $6\,\mu\mathrm{As}$, zato $C = \dfrac{6\,\mu\mathrm{As}}{12\,\mathrm{V}} = 0{,}5\,\mu\mathrm{F}$. Količnik je pri vsaki točki enak, zato je graf premica skozi izhodišče.

? Kondenzator v bliskavici ima kapaciteto $100\,\mu\mathrm{F}$. Pri poskusu ga napolnimo le na $150\,\mathrm{V}$ namesto na $300\,\mathrm{V}$. Kaj velja?
+ Kapaciteta ostane $100\,\mu\mathrm{F}$, naboj na plošči je $1{,}5 \cdot 10^{-2}\,\mathrm{As}$.
- Kapaciteta se razpolovi na $50\,\mu\mathrm{F}$, naboj na plošči je $7{,}5 \cdot 10^{-3}\,\mathrm{As}$.
~ Kapaciteta ni odvisna od napetosti; določata jo ploščina in razmik plošč. Pri pol manjši napetosti se razpolovi le naboj.
- Kapaciteta ostane $100\,\mu\mathrm{F}$, naboj na plošči je $6{,}7 \cdot 10^{-7}\,\mathrm{As}$.
~ To je $C/U$. Iz $C = e/U$ sledi $e = CU$, torej množiš.
- Kapaciteta ostane $100\,\mu\mathrm{F}$, naboj na plošči je $1{,}5 \cdot 10^{6}\,\mathrm{As}$.
~ To je $U/C$, obrnjeno razmerje. Tak naboj bi bil nesmiselno velik.
> Kapaciteta je lastnost plošč, zato ostane. Naboj je $e = CU = 100 \cdot 10^{-6}\,\mathrm{F} \cdot 150\,\mathrm{V} = 1{,}5 \cdot 10^{-2}\,\mathrm{As}$, pol manj kot pri $300\,\mathrm{V}$.

:::simboli
E | jakost električnega polja | E = \frac{F}{e} | N/As | enako V/m
F | električna sila | F = e E | N
e | naboj | | As | poskusni, izvorni ali pri kondenzatorju naboj na eni plošči
r | razdalja od točkastega naboja | | m
\varepsilon_0 | influenčna konstanta | | As/(V\,m) | $8{,}85 \cdot 10^{-12}$
U | napetost | U = \frac{A_e}{e} | V | vedno med dvema točkama
A_e | delo električne sile | A_e = e U | J
d | razmik med ploščama | | m
C | kapaciteta | C = \frac{e}{U} | F
W | energija kondenzatorja | W = \frac{1}{2} C U^2 | J
S | ploščina plošče | | m^2
e_0 | osnovni naboj | | As | $1{,}6 \cdot 10^{-19}$
F_0 | sila na elektron | F_0 = e_0 E | N
E_\mathrm{p} | prebojna jakost zraka | | V/m | pri tej jakosti zrak prebije
:::

<<RACUN
vrednost: 9*10^9*1*10^-9/0.01^2 | 90000
vrednost: 90/3^2 | 10
vrednost: 1.2*10^-3/4/10^-9 | 3*10^5
vrednost: 1.6*10^-19*3*10^5 | 4.8*10^-14
vrednost: 12/0.004 | 3000
vrednost: 3*10^7/1500 | 20000
vrednost: 3*10^6/(2*10^4) | 150
vrednost: 8.85*10^-12*0.5/(1*10^-9) | 0.004425
vrednost: 1*10^-9*9 | 9*10^-9
vrednost: sqrt(9*10^9*8*10^-9/800) | 0.3
vrednost: 12/0.06 | 200
vrednost: 8.85*10^-12*0.01/0.002 | 4.425*10^-11
vrednost: 9*10^9*2*10^-9/0.03^2 | 20000
vrednost: 9/0.004425 | 2033.9
vrednost: 2*10^-9*9 | 18*10^-9
vrednost: 9/0.0022125 | 4067.8
vrednost: 0.5*100*10^-6*300^2 | 4.5
vrednost: 4/3 | 1.333
vrednost: 6/12 | 0.5
vrednost: 100*10^-6*150 | 0.015
vrednost: 50*10^-6*150 | 0.0075
vrednost: 100*10^-6/150 | 6.67*10^-7
vrednost: 150/(100*10^-6) | 1.5*10^6
>>
