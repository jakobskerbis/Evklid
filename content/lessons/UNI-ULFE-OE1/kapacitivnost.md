---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Izpitno vprašanje, ki ga zdaj še ne znaš rešiti: koaksialni kabel v kemičnem obratu ima zunanji vodnik z notranjim polmerom $b = 8\,\mathrm{mm}$, vmes je polietilen, ki prenese največ $10\,\mathrm{MV/m}$. Kolikšen naj bo polmer notranjega vodnika $a$, da bo kabel prenesel čim višjo napetost?

Prvi vtis vodi v dve smeri. Tanek notranji vodnik pusti debelo izolacijo, a ob tanki žici je polje močno. Debel vodnik ima šibkejše polje ob površini, izolacija pa je tanka. Optimum obstaja in je presenetljivo preprost. Do njega pridemo po blokih: definicija kapacitivnosti, recept za njen izračun, tri osnovne oblike, plasti dielektrika, vezave in energija. Odgovor je v razdelku Za izpit, naloga 1.

Iz elektrostatike že poznaš ploščati kondenzator, vezavi in $W = \frac{1}{2}CU^2$. Tu teh rezultatov ne ponavljamo, ampak jih razširimo na oblike, ki jih srečaš v elektrotehniki: kable, sonde, večplastno izolacijo.

## Razlaga

**1. Kapacitivnost.**

**Definicija.** Dva prevodnika z nabojema $+Q$ in $-Q$ med seboj imata napetost $U$. **Kapacitivnost** je
$$C = \frac{Q}{U}.$$
Enota je farad, $1\,\mathrm{F} = 1\,\mathrm{C/V}$. V linearnem dielektriku sta polje in napetost sorazmerna z nabojem, zato je $C$ odvisna le od oblike, lege in snovi, ne od $Q$ ali $U$.

*Preizkus:* naboj podvojimo. Kaj se zgodi s $C$? (Nič; $U$ se podvoji.)

**2. Recept za izračun.** Za simetrične oblike vedno ista štiri koraka:

1. Predpostavi naboj $Q$ na notranjem prevodniku.
2. Z Gaussovim zakonom $\oint \vec D \cdot \mathrm{d}\vec A = Q$ določi gostoto pretoka $D$, nato $E = D/\varepsilon$, kjer je $\varepsilon = \varepsilon_r \varepsilon_0$.
3. Napetost: $U = \int_a^b E\,\mathrm{d}r$ od enega prevodnika do drugega.
4. $C = Q/U$; $Q$ se mora pokrajšati.

*Preizkus:* za ploščati kondenzator dobiš $D = Q/S$, $U = Qd/(\varepsilon S)$ in $C = \varepsilon S/d$. (Znano iz elektrostatike.)

**3. Koaksialni kondenzator.** Notranji vodnik s polmerom $a$, zunanji z notranjim polmerom $b$, dolžina $l \gg b$. Gaussova ploskev je valj s polmerom $r$ med vodnikoma: $D \cdot 2\pi r l = Q$. Zato
$$E = \frac{Q}{2\pi\varepsilon l r}, \qquad a < r < b.$$

**Izpeljava.** $U = \int_a^b \frac{Q}{2\pi\varepsilon l r}\,\mathrm{d}r = \frac{Q}{2\pi\varepsilon l}\ln\frac{b}{a}$, torej
$$C = \frac{2\pi\varepsilon l}{\ln(b/a)}.$$
Pri kablih navajamo kapacitivnost na dolžino $C' = C/l$, navadno v $\mathrm{pF/m}$.

Pomembna posledica: polje ni enakomerno. Največje je ob notranjem vodniku, $E_{\max} = E(a) = \frac{U}{a\ln(b/a)}$. Tam se izolacija prebije prva.

*Preizkus:* koliko je $E(2a)$ glede na $E(a)$? (Polovica.)

**4. Krogelni kondenzator.** Notranja krogla s polmerom $a$, zunanja lupina s polmerom $b$. Gaussova ploskev je krogla: $E = \frac{Q}{4\pi\varepsilon r^2}$ in $U = \frac{Q}{4\pi\varepsilon}\left(\frac{1}{a} - \frac{1}{b}\right)$, zato
$$C = \frac{4\pi\varepsilon ab}{b - a}.$$
Za $b \to \infty$ dobimo **osamljeno kroglo**, $C = 4\pi\varepsilon a$; Zemlja ima le okoli $0{,}7\,\mathrm{mF}$.

*Preizkus:* kaj da formula pri $b - a = d \ll a$? (Približno $4\pi\varepsilon a^2/d = \varepsilon S/d$, ploščati kondenzator.)

**5. Plasti dielektrika.** Na meji dveh dielektrikov brez prostega naboja sta zvezni normalna komponenta $D$ in tangentna komponenta $E$. Iz tega sledita pravili:

- **plasti pravokotno na polje** (ena za drugo med elektrodama): $D$ je v obeh enak, napetosti se seštejejo, zato sta plasti **zaporedno** vezana kondenzatorja;
- **plasti vzporedno s poljem** (druga ob drugi): $E$ je v obeh enak, naboji se seštejejo, zato je to **vzporedna** vezava.

Pri plasteh ena za drugo je $\varepsilon_1 E_1 = \varepsilon_2 E_2$, torej
$$\frac{E_1}{E_2} = \frac{\varepsilon_{r2}}{\varepsilon_{r1}}.$$
Polje je večje v snovi z manjšo dielektričnostjo.

:::premisli
V izolaciji z $\varepsilon_r = 4$ je majhen zračni mehurček, sploščen pravokotno na polje. Napoveš, ali je polje v mehurčku manjše, enako ali večje kot v izolaciji? Zakaj je to za visokonapetostne kable nevarno?
---
Večje, približno štirikrat: $D$ je zvezen, $\varepsilon_r$ zraka je $1$. Zrak se prebije pri okoli $3\,\mathrm{MV/m}$, veliko prej kot trdna izolacija. V mehurčku nastajajo **delne razelektritve**, ki izolacijo počasi razjedajo, dokler kabel ne odpove.
:::

**6. Vezave in povezovanje nabitih kondenzatorjev.** Vzporedno $C = C_1 + C_2$, zaporedno $\frac{1}{C} = \frac{1}{C_1} + \frac{1}{C_2}$ (dokaz iz elektrostatike). Dve zaporedno vezani kapacitivnosti sta **kapacitivni delilnik**: oba nosita isti $Q$, zato je napetost na prvem
$$U_1 = U\frac{C_2}{C_1 + C_2}.$$
Večja napetost je na *manjši* kapacitivnosti.

Kadar povežemo že nabita kondenzatorja, ne velja nič od tega samo po sebi. Velja **ohranitev naboja** na vsakem otoku prevodnikov, ki ni povezan z virom. Pri vzporedni povezavi z enako polariteto je končna napetost $U = \frac{C_1U_1 + C_2U_2}{C_1 + C_2}$, z nasprotno polariteto pa se naboja odštejeta.

*Preizkus:* $C_1 = C_2$, prvi na $U_0$, drugi prazen. Končna napetost? ($U_0/2$.)

**7. Energija električnega polja.** Energija kondenzatorja je $W = \frac{1}{2}CU^2 = \frac{Q^2}{2C}$. Shranjena je v polju z gostoto
$$w = \frac{1}{2}ED = \frac{1}{2}\varepsilon E^2.$$
V koaksialnem kondenzatorju je $w$ največja ob notranjem vodniku in pada kot $1/r^2$; z integracijo po plašču valja $2\pi r l\,\mathrm{d}r$ dobimo spet $Q^2/(2C)$ (naloga 2).

:::premisli
Povežemo enaka kondenzatorja, prvi na $U_0$, drugi prazen. Naboj se ohrani. Ali se ohrani tudi energija? Napovej, kolikšen delež ostane.
---
Ne. Pred povezavo je $W_0 = \frac{1}{2}CU_0^2$, po njej $2 \cdot \frac{1}{2}C(U_0/2)^2 = \frac{1}{4}CU_0^2$. Ostane polovica. Druga polovica se pretvori v toploto v žicah in v sevanje iskre, ne glede na to, kako majhen je upor povezave.
:::

## Rešeni primeri

### Primer 1: kondenzatorska baterija

V razdelilni postaji obrata so kondenzatorji $C_1 = 10\,\mu\mathrm{F}$ in $C_2 = 20\,\mu\mathrm{F}$ vezani zaporedno, tej veji pa je vzporedno vezan $C_3 = 30\,\mu\mathrm{F}$. Skupina je na enosmerni napetosti $400\,\mathrm{V}$. Določi nadomestno kapacitivnost, napetost in naboj na vsakem kondenzatorju ter shranjeno energijo.

**Podatki:** $C_1 = 10\,\mu\mathrm{F}$, $C_2 = 20\,\mu\mathrm{F}$ (zaporedno), $C_3 = 30\,\mu\mathrm{F}$ (vzporedno), $U = 400\,\mathrm{V}$
**Iščemo:** $C$, $U_1$, $U_2$, $U_3$, $Q_1$, $Q_2$, $Q_3$, $W$

:::formula
$\frac{1}{C_{12}} = \frac{1}{C_1} + \frac{1}{C_2}$, $\quad C = C_{12} + C_3$, $\quad Q = CU$, $\quad W = \frac{1}{2}CU^2$
:::

**Rešitev:**

1. Zaporedna veja: $C_{12} = \frac{10 \cdot 20}{10 + 20}\,\mu\mathrm{F} \approx 6{,}67\,\mu\mathrm{F}$.
2. Skupaj: $C \approx 6{,}67\,\mu\mathrm{F} + 30\,\mu\mathrm{F} \approx 36{,}7\,\mu\mathrm{F}$.
3. Veja $C_1C_2$ ima napetost $400\,\mathrm{V}$ in naboj $Q_1 = Q_2 = C_{12}U \approx 2{,}67\,\mathrm{mC}$, ker zaporedno vezana nosita isti naboj.
4. Delilnik: $U_1 = 400 \cdot \frac{20}{30}\,\mathrm{V} \approx 267\,\mathrm{V}$, $U_2 \approx 133\,\mathrm{V}$; večja napetost je na manjšem $C_1$.
5. $U_3 = 400\,\mathrm{V}$, $Q_3 = 30\,\mu\mathrm{F} \cdot 400\,\mathrm{V} = 12\,\mathrm{mC}$.
6. Energija: $W = \frac{1}{2} \cdot 36{,}67 \cdot 10^{-6} \cdot 400^2\,\mathrm{J} \approx 2{,}93\,\mathrm{J}$.
7. Odgovor: $C \approx 36{,}7\,\mu\mathrm{F}$; $C_1$ ima $267\,\mathrm{V}$, $C_2$ $133\,\mathrm{V}$, oba $2{,}67\,\mathrm{mC}$; $C_3$ ima $400\,\mathrm{V}$ in $12\,\mathrm{mC}$; shranjenih je $2{,}93\,\mathrm{J}$.

### Primer 2: kapacitivna sonda za nivo olja

V rezervoarju z izolacijskim oljem ($\varepsilon_r = 2{,}2$) stoji navpična koaksialna sonda dolžine $L = 2{,}0\,\mathrm{m}$: notranja palica s polmerom $a = 5{,}0\,\mathrm{mm}$ in perforirana cev z notranjim polmerom $b = 20\,\mathrm{mm}$. Olje vdre v cev do gladine $h$. Izračunaj kapacitivnost prazne in polne sonde in nivo olja, ko merilnik pokaže $150\,\mathrm{pF}$.

**Podatki:** $L = 2{,}0\,\mathrm{m}$, $a = 5{,}0\,\mathrm{mm}$, $b = 20\,\mathrm{mm}$, $\varepsilon_r = 2{,}2$ (olje), zrak $\varepsilon_r = 1$, $C_m = 150\,\mathrm{pF}$, $\varepsilon_0 = 8{,}854 \cdot 10^{-12}\,\mathrm{F/m}$
**Iščemo:** $C_{\text{prazna}}$, $C_{\text{polna}}$, $h$ pri $C_m$

:::formula
$C' = \frac{2\pi\varepsilon_0}{\ln(b/a)}$ (zrak); deli sonde so vzporedno: $C = C'\left[(L - h) + \varepsilon_r h\right]$
:::

**Rešitev:**

1. Olje in zrak sta drug nad drugim, polje pa je radialno, torej vzporedno z mejo: dela sonde sta vzporedno vezana, kapacitivnosti se seštejeta.
2. $C' = \frac{2\pi \cdot 8{,}854 \cdot 10^{-12}}{\ln 4}\,\mathrm{F/m} \approx 40{,}1\,\mathrm{pF/m}$.
3. Prazna: $C_{\text{prazna}} = 40{,}13 \cdot 2{,}0\,\mathrm{pF} \approx 80{,}3\,\mathrm{pF}$; polna: $2{,}2 \cdot 80{,}26\,\mathrm{pF} \approx 177\,\mathrm{pF}$.
4. Iz $C_m = C'\left[L + (\varepsilon_r - 1)h\right]$ sledi $h = \frac{C_m/C' - L}{\varepsilon_r - 1}$.
5. $h = \frac{150/40{,}13 - 2{,}0}{1{,}2}\,\mathrm{m} \approx 1{,}45\,\mathrm{m}$.
6. Odgovor: prazna sonda ima $80\,\mathrm{pF}$, polna $177\,\mathrm{pF}$; pri $150\,\mathrm{pF}$ je olje $1{,}45\,\mathrm{m}$ visoko. Odvisnost je linearna, kar je glavna prednost te sonde.

### Primer 3: kabel z dvoplastno izolacijo

Koaksialni kabel ima notranji vodnik s polmerom $a = 1{,}0\,\mathrm{mm}$, zunanji vodnik z notranjim polmerom $b = 8{,}0\,\mathrm{mm}$. Do polmera $r_1 = 3{,}0\,\mathrm{mm}$ je plast z $\varepsilon_{r1} = 4{,}0$, naprej plast z $\varepsilon_{r2} = 2{,}5$. Obe snovi preneseta največ $E_{\text{dop}} = 10\,\mathrm{MV/m}$. Kolikšna je največja dopustna napetost? Izračunaj kapacitivnost na meter, polje na obeh straneh meje plasti in energijo na meter pri tej napetosti.

**Podatki:** $a = 1{,}0\,\mathrm{mm}$, $r_1 = 3{,}0\,\mathrm{mm}$, $b = 8{,}0\,\mathrm{mm}$, $\varepsilon_{r1} = 4{,}0$, $\varepsilon_{r2} = 2{,}5$, $E_{\text{dop}} = 10\,\mathrm{MV/m}$
**Iščemo:** $U_{\max}$, $C'$, $E$ ob meji v obeh plasteh, $W'$

:::formula
$E = \frac{Q'}{2\pi\varepsilon_0\varepsilon_r r}$; $\quad U = \frac{Q'}{2\pi\varepsilon_0}\left[\frac{\ln(r_1/a)}{\varepsilon_{r1}} + \frac{\ln(b/r_1)}{\varepsilon_{r2}}\right]$; $\quad W' = \frac{1}{2}C'U^2$
:::

**Rešitev:**

1. $D = Q'/(2\pi r)$ je zvezen čez mejo (plasti sta pravokotni na polje, zaporedna vezava). V vsaki plasti $E$ pada kot $1/r$, zato je največji na njenem notranjem robu.
2. Označimo $k = Q'/(2\pi\varepsilon_0)$ (enota $\mathrm{V}$). Notranja plast ima maksimum pri $r = a$: $E = k/(\varepsilon_{r1}a)$. Zunanja pri $r = r_1$: $E = k/(\varepsilon_{r2}r_1)$.
3. Pogoj $E \le E_{\text{dop}}$ da $k \le E_{\text{dop}}\varepsilon_{r1}a = 4{,}0 \cdot 10^4\,\mathrm{V}$ (notranja) in $k \le E_{\text{dop}}\varepsilon_{r2}r_1 = 7{,}5 \cdot 10^4\,\mathrm{V}$ (zunanja). Odloča manjša vrednost: $k = 4{,}0 \cdot 10^4\,\mathrm{V}$.
4. Oglati oklepaj: $\frac{\ln 3}{4{,}0} + \frac{\ln(8/3)}{2{,}5} \approx 0{,}2747 + 0{,}3923 = 0{,}6670$.
5. $U_{\max} = 4{,}0 \cdot 10^4 \cdot 0{,}6670\,\mathrm{V} \approx 26{,}7\,\mathrm{kV}$.
6. $C' = \frac{2\pi\varepsilon_0}{0{,}6670} \approx 83{,}4\,\mathrm{pF/m}$.
7. Ob meji: v notranji plasti $E = \frac{4{,}0 \cdot 10^4}{4{,}0 \cdot 3{,}0 \cdot 10^{-3}}\,\mathrm{V/m} \approx 3{,}33\,\mathrm{MV/m}$, v zunanji $\frac{4{,}0 \cdot 10^4}{2{,}5 \cdot 3{,}0 \cdot 10^{-3}}\,\mathrm{V/m} \approx 5{,}33\,\mathrm{MV/m}$. Polje na meji skoči v razmerju $\varepsilon_{r1}/\varepsilon_{r2} = 1{,}6$.
8. $W' = \frac{1}{2} \cdot 83{,}4 \cdot 10^{-12} \cdot (26{,}68 \cdot 10^3)^2\,\mathrm{J/m} \approx 0{,}0297\,\mathrm{J/m}$.
9. Odgovor: kabel prenese največ okoli $26{,}7\,\mathrm{kV}$, omejuje ga notranja plast ob vodniku. $C' \approx 83\,\mathrm{pF/m}$, ob meji je polje $3{,}3\,\mathrm{MV/m}$ znotraj in $5{,}3\,\mathrm{MV/m}$ zunaj, energija je okoli $30\,\mathrm{mJ}$ na meter.

### Primer 4: zdaj ti

Kovinska krogla visokonapetostnega generatorja v laboratoriju ima polmer $a = 10\,\mathrm{cm}$ in stoji daleč od drugih teles v zraku. Zrak se prebije pri $3{,}0\,\mathrm{MV/m}$. Kolikšni so kapacitivnost, največji naboj in največja napetost?

**Podatki:** $a = 0{,}10\,\mathrm{m}$, $E_p = 3{,}0\,\mathrm{MV/m}$, zrak $\varepsilon_r = 1$, $\varepsilon_0 = 8{,}854 \cdot 10^{-12}\,\mathrm{F/m}$
**Iščemo:** $C$, $Q_{\max}$, $U_{\max}$

:::formula
$C = 4\pi\varepsilon_0 a$, $\quad E(a) = \frac{Q}{4\pi\varepsilon_0 a^2}$, $\quad U = \frac{Q}{C}$
:::

**Rešitev:**

1. $C = 4\pi \cdot 8{,}854 \cdot 10^{-12} \cdot 0{,}10\,\mathrm{F} \approx 11{,}1\,\mathrm{pF}$.
2. Polje ob površini je enako $E_p$: $Q_{\max} = 4\pi\varepsilon_0 a^2 E_p \approx 3{,}34\,\mu\mathrm{C}$.
3. Dokončaj sam: kolikšna je $U_{\max}$ in kako jo izraziš brez $\varepsilon_0$?

:::premisli
Kolikšna je največja napetost?
---
$U_{\max} = Q_{\max}/C = E_p a = 3{,}0 \cdot 10^6 \cdot 0{,}10\,\mathrm{V} = 300\,\mathrm{kV}$. Za višjo napetost potrebuješ večjo kroglo, zato imajo generatorji velike, gladke elektrode.
:::

## Pogoste napake

- **Enakomerno polje v kablu.** Kdor računa $E = U/(b - a)$, dobi pri primeru 3 povprečno polje in spregleda, da je ob notranjem vodniku nekajkrat večje. Pri valjni simetriji je $E \propto 1/r$.
- **Plasti napačno vezane.** Plasti ena za drugo med elektrodama sta zaporedni (isti $D$), plasti druga ob drugi vzporedni (isti $E$). Preveri, kateri od teh dveh je pri dani legi zvezen.
- **»Večja dielektričnost, večje polje.«** Pri isti $D$ je ravno obratno: v snovi z manjšim $\varepsilon_r$ je polje večje. Zato je zračna reža najšibkejši člen izolacije.
- **Ohranjena energija pri povezovanju.** Ohrani se naboj, energija pa se zmanjša. Kdor iz ohranitve energije računa končno napetost, dobi napačen rezultat.
- **Polariteta pri povezovanju.** Če povežemo $+$ ploščo prvega z $-$ ploščo drugega, se naboja na otoku odštejeta. Najprej nariši, kateri plošči sta na istem otoku.

## Povzetek

- $C = Q/U$, odvisna le od oblike in snovi; $\varepsilon = \varepsilon_r\varepsilon_0$.
- Recept: $Q$ → Gauss → $D$, $E$ → $U = \int E\,\mathrm{d}r$ → $C$.
- Koaksialni $C = 2\pi\varepsilon l/\ln(b/a)$, $E \propto 1/r$, največji ob notranjem vodniku; krogelni $C = 4\pi\varepsilon ab/(b - a)$, osamljena krogla $4\pi\varepsilon a$.
- Plasti pravokotno na polje: zaporedno, $D$ enak, $E$ večji v manjšem $\varepsilon_r$. Plasti vzporedno s poljem: vzporedno, $E$ enak.
- Kapacitivni delilnik: večja napetost na manjši kapacitivnosti. Pri povezovanju nabitih kondenzatorjev se ohrani naboj, energija pa ne.
- $W = \frac{1}{2}CU^2$, gostota $w = \frac{1}{2}ED = \frac{1}{2}\varepsilon E^2$.

## Za izpit

Znati moraš povedati:

- definicijo kapacitivnosti in zakaj je neodvisna od naboja;
- izpeljavo $C$ ploščatega, koaksialnega in krogelnega kondenzatorja z Gaussovim zakonom ter $E(r)$ v vsakem;
- robna pogoja na meji dielektrikov in iz njiju pravili za plasti;
- dokaz zaporedne in vzporedne vezave, kapacitivni delilnik in ohranitev naboja pri povezovanju;
- $W = \frac{1}{2}CU^2$ in $w = \frac{1}{2}ED$ ter dokaz, da integral $w$ po prostoru da $W$.

### Naloga 1

Odgovori na vprašanje iz uvoda: kabel z zunanjim polmerom $b = 8{,}0\,\mathrm{mm}$, polietilen z $\varepsilon_r = 2{,}3$ in dopustnim poljem $E_{\text{dop}} = 10\,\mathrm{MV/m}$. (a) Pri katerem $a$ je dopustna napetost največja in kolikšna je? (b) Primerjaj z $a = 1{,}0\,\mathrm{mm}$ in $a = 2{,}0\,\mathrm{mm}$. (c) Kolikšni sta pri optimalnem $a$ kapacitivnost na meter in energija na meter pri največji napetosti?

**Rešitev:**

1. Največje polje je ob notranjem vodniku: $E(a) = \frac{U}{a\ln(b/a)}$. Pogoj $E(a) = E_{\text{dop}}$ da $U_{\max}(a) = E_{\text{dop}}\,a\ln(b/a)$. Dielektričnost se pokrajša.
2. Odvod po $a$: $\frac{\mathrm{d}U_{\max}}{\mathrm{d}a} = E_{\text{dop}}\left[\ln(b/a) - 1\right]$. Ničla je pri $\ln(b/a) = 1$, torej $a = b/e$.
3. Za $a < b/e$ je odvod pozitiven, za $a > b/e$ negativen, zato je to maksimum.
4. $a = 8{,}0/e\,\mathrm{mm} \approx 2{,}94\,\mathrm{mm}$; ker je $\ln(b/a) = 1$, je $U_{\max} = E_{\text{dop}}\,a \approx 10^7 \cdot 2{,}943 \cdot 10^{-3}\,\mathrm{V} \approx 29{,}4\,\mathrm{kV}$.
5. (b) $a = 1{,}0\,\mathrm{mm}$: $U = 10^7 \cdot 10^{-3}\ln 8\,\mathrm{V} \approx 20{,}8\,\mathrm{kV}$; $a = 2{,}0\,\mathrm{mm}$: $U = 10^7 \cdot 2 \cdot 10^{-3}\ln 4\,\mathrm{V} \approx 27{,}7\,\mathrm{kV}$. Optimum je plitev: $\pm 30\,\%$ okoli $b/e$ izgubi le nekaj odstotkov.
6. (c) Pri $\ln(b/a) = 1$ je $C' = 2\pi\varepsilon_0\varepsilon_r \approx 2\pi \cdot 8{,}854 \cdot 10^{-12} \cdot 2{,}3\,\mathrm{F/m} \approx 128\,\mathrm{pF/m}$.
7. $W' = \frac{1}{2} \cdot 128 \cdot 10^{-12} \cdot (29{,}43 \cdot 10^3)^2\,\mathrm{J/m} \approx 0{,}055\,\mathrm{J/m}$.
8. Odgovor: $a = b/e \approx 2{,}9\,\mathrm{mm}$, kabel prenese okoli $29\,\mathrm{kV}$ (pri $1\,\mathrm{mm}$ le $21\,\mathrm{kV}$, pri $2\,\mathrm{mm}$ $28\,\mathrm{kV}$); $C' \approx 128\,\mathrm{pF/m}$, $W' \approx 55\,\mathrm{mJ/m}$.

### Naloga 2

Z Gaussovim zakonom izpelji kapacitivnost koaksialnega kondenzatorja. Nato dokaži, da integral gostote energije $w = \frac{1}{2}\varepsilon E^2$ po prostoru med vodnikoma da $W = \frac{Q^2}{2C}$. Navedi, kje uporabiš katero predpostavko.

**Rešitev:**

1. Predpostavke: $l \gg b$ (robne učinke zanemarimo), linearen in homogen dielektrik, vodnika sta ekvipotencialni ploskvi.
2. Zaradi valjne simetrije kaže $\vec D$ radialno in je odvisen le od $r$. Gaussova ploskev: valj s polmerom $r$ in dolžino $l$; pretok skozi osnovni ploskvi je nič. $D \cdot 2\pi r l = Q$.
3. $E = \frac{Q}{2\pi\varepsilon l r}$ (linearnost), $U = \int_a^b E\,\mathrm{d}r = \frac{Q}{2\pi\varepsilon l}\ln\frac{b}{a}$, zato $C = \frac{2\pi\varepsilon l}{\ln(b/a)}$.
4. Energija: tanka valjasta lupina s polmerom $r$ in debelino $\mathrm{d}r$ ima prostornino $2\pi r l\,\mathrm{d}r$, zato $\mathrm{d}W = \frac{1}{2}\varepsilon\frac{Q^2}{4\pi^2\varepsilon^2 l^2 r^2} \cdot 2\pi r l\,\mathrm{d}r = \frac{Q^2}{4\pi\varepsilon l}\frac{\mathrm{d}r}{r}$.
5. Integral od $a$ do $b$: $W = \frac{Q^2}{4\pi\varepsilon l}\ln\frac{b}{a} = \frac{Q^2}{2} \cdot \frac{\ln(b/a)}{2\pi\varepsilon l} = \frac{Q^2}{2C}$.
6. Sklep: energija, ki jo dobimo iz dela pri polnjenju, je v celoti shranjena v polju; polovica je v plasti od $a$ do $\sqrt{ab}$.

### Naloga 3

Kondenzator $C_1 = 2{,}0\,\mu\mathrm{F}$ je nabit na $U_1 = 300\,\mathrm{V}$, kondenzator $C_2 = 4{,}0\,\mu\mathrm{F}$ na $U_2 = 100\,\mathrm{V}$. Povežemo ju vzporedno (a) s plusoma skupaj, (b) s plusom prvega na minus drugega. Izračunaj končno napetost in izgubo energije v obeh primerih ter dokaži splošno formulo za izgubo.

**Rešitev:**

1. (a) Naboj na otoku: $Q = C_1U_1 + C_2U_2 = 600\,\mu\mathrm{C} + 400\,\mu\mathrm{C} = 1000\,\mu\mathrm{C}$; $U = \frac{1000}{6{,}0}\,\mathrm{V} \approx 167\,\mathrm{V}$.
2. Energija pred: $\frac{1}{2} \cdot 2 \cdot 10^{-6} \cdot 300^2 + \frac{1}{2} \cdot 4 \cdot 10^{-6} \cdot 100^2 = 0{,}11\,\mathrm{J}$. Po: $\frac{1}{2} \cdot 6 \cdot 10^{-6} \cdot 166{,}7^2\,\mathrm{J} \approx 0{,}0833\,\mathrm{J}$. Izguba okoli $26{,}7\,\mathrm{mJ}$.
3. (b) Naboja se odštejeta: $Q = 600\,\mu\mathrm{C} - 400\,\mu\mathrm{C} = 200\,\mu\mathrm{C}$, $U \approx 33{,}3\,\mathrm{V}$; energija po $\frac{1}{2} \cdot 6 \cdot 10^{-6} \cdot 33{,}33^2\,\mathrm{J} \approx 3{,}3\,\mathrm{mJ}$, izguba okoli $107\,\mathrm{mJ}$.
4. Splošno (enaka polariteta): $\Delta W = \frac{1}{2}C_1U_1^2 + \frac{1}{2}C_2U_2^2 - \frac{(C_1U_1 + C_2U_2)^2}{2(C_1 + C_2)}$.
5. Na skupnem imenovalcu $2(C_1 + C_2)$ ostane v števcu $C_1C_2U_1^2 + C_1C_2U_2^2 - 2C_1C_2U_1U_2$, torej $\Delta W = \frac{C_1C_2(U_1 - U_2)^2}{2(C_1 + C_2)} \ge 0$. Pri nasprotni polariteti $U_2$ zamenjamo z $-U_2$.
6. Preizkus s formulo: (a) $\frac{8 \cdot 10^{-12} \cdot 200^2}{12 \cdot 10^{-6}}\,\mathrm{J} \approx 26{,}7\,\mathrm{mJ}$, (b) $\frac{8 \cdot 10^{-12} \cdot 400^2}{12 \cdot 10^{-6}}\,\mathrm{J} \approx 107\,\mathrm{mJ}$.
7. Odgovor: (a) $167\,\mathrm{V}$, izguba $26{,}7\,\mathrm{mJ}$; (b) $33{,}3\,\mathrm{V}$, izguba $107\,\mathrm{mJ}$. Izguba je nič le pri $U_1 = U_2$ in ni odvisna od upora povezave.

## Drugače: Na sliki

Prerez koaksialnega kabla in potek polja:

```
     zunanji vodnik
    .-------------.
   /      |        \
  |   --( a )--     |
   \      |        /
    '-------------'
  silnice: radialno
```

```
E
|*
| *
|  *.
|    '*..
|        ''**--
+--+------------+--> r
   a            b
```

Polje pada kot $1/r$: pri dvakratnem polmeru je pol manjše. Najmočnejše je tik ob notranjem vodniku, zato tam izolacija »poči« prva.

Sonda za nivo iz primera 2:

```
     |  |  sonda
 ____|__|__________
|    |  |   zrak   |
|~~~~|~~|~~~~~~~~~~| gladina
|    |  |   olje   | h
|____|__|__________|
```

Zgornji in spodnji del sonde sta dva vzporedna kondenzatorja z enakim $C'$, a različno dielektričnostjo.

## Drugače: Uporaba v stroki

- **Merjenje nivoja.** Kapacitivne sonde merijo nivo olj, topil in granulatov v silosih; pri prevodnih tekočinah je palica izolirana in tekočina sama postane druga elektroda.
- **Kompenzacija jalove moči.** Kondenzatorske baterije ob motorjih v obratih zmanjšajo jalovi tok iz omrežja. Vsaka ima praznilne upore: kondenzator po izklopu ohrani naboj, energija $\frac{1}{2}CU^2$ pri nekaj sto mikrofaradih in $400\,\mathrm{V}$ je že nevarna.
- **Kabli.** Kapacitivnost $C' \approx 100\,\mathrm{pF/m}$ pri dolgih visokonapetostnih kablih povzroči velik polnilni tok, zato kabelske povezave daljše od nekaj deset kilometrov izvedejo z enosmernim tokom. Pri polaganju kablov preverjajo delne razelektritve, ki kažejo na mehurčke in reže v izolaciji.
- **Elementi.** Večplastni keramični kondenzatorji (MLCC) zložijo stotine tankih plasti vzporedno, da dobijo mikrofarade v milimetrskem ohišju. Superkondenzatorji imajo zaradi dvojne plasti na poroznem ogljiku kapacitivnosti do tisoč faradov.

## Drugače: Bolj natančno

**Sila med ploščama z virtualnim delom.** Odklopljen ploščati kondenzator ima stalen $Q$. Če plošči razmaknemo za $\mathrm{d}x$, se energija poveča za $\mathrm{d}W = \frac{Q^2}{2}\,\mathrm{d}\!\left(\frac{x}{\varepsilon S}\right) = \frac{Q^2}{2\varepsilon S}\,\mathrm{d}x$. To delo opravi zunanja sila, zato se plošči privlačita s silo
$$F = \frac{Q^2}{2\varepsilon S} = \frac{1}{2}\varepsilon E^2 S.$$
Sila na ploskev je enaka gostoti energije. Pri priključenem kondenzatorju ($U$ stalen) moramo upoštevati še delo vira, ki je dvakrat večje od spremembe energije kondenzatorja in nasprotnega predznaka; sila pride enaka.

**Dvovodni vod.** Za vzporedna vodnika s polmerom $r_0$ na razdalji $d \gg r_0$ je $C' \approx \frac{\pi\varepsilon}{\ln(d/r_0)}$; izpelješ ga s superpozicijo polj dveh nasprotno nabitih premic.

**Nelinearni dielektriki.** Pri feroelektrikih (barijev titanat v keramičnih kondenzatorjih) $\varepsilon_r$ pada z jakostjo polja. Takrat definiramo diferencialno kapacitivnost $C = \mathrm{d}Q/\mathrm{d}U$, ki se pri visoki napetosti lahko zmanjša za več kot polovico.

## Preveri se

? Kateri opis poteka poljske jakosti $E(r)$ med vodnikoma koaksialnega kondenzatorja je pravilen?
- $E$ je med vodnikoma konstanten, $E = U/(b - a)$.
~ Tako je le pri ploščatem kondenzatorju; pri valjni simetriji se silnice razredčijo z razdaljo.
+ $E$ pada kot $1/r$ in je največji ob notranjem vodniku.
- $E$ pada kot $1/r^2$, kot pri točkastem naboju.
~ $1/r^2$ velja za krogelno simetrijo; Gaussov valj ima površino sorazmerno z $r$, ne z $r^2$.
- $E$ narašča proti zunanjemu vodniku, ker je tam večja površina.
~ Večja površina pomeni redkejše silnice in šibkejše polje, ne močnejše.
> Iz $D \cdot 2\pi r l = Q$ sledi $E \propto 1/r$; največja vrednost je pri $r = a$.

? Oceni kapacitivnost $100\,\mathrm{m}$ dolgega koaksialnega kabla s polietilensko izolacijo (polmera vodnikov reda milimetra).
- okoli $10\,\mathrm{pF}$
~ To bi bilo za kos kabla dolžine okoli $10\,\mathrm{cm}$; $C$ narašča z dolžino.
+ okoli $10\,\mathrm{nF}$
- okoli $10\,\mu\mathrm{F}$
~ Za mikrofarade potrebuješ tanke plasti z veliko površino, kot v elektrolitskih ali večplastnih kondenzatorjih.
- okoli $10\,\mathrm{mF}$
~ Toliko imajo veliki elektrolitski kondenzatorji, kabel pa ima le okoli $100\,\mathrm{pF}$ na meter.
> $C' = 2\pi\varepsilon_0\varepsilon_r/\ln(b/a) \approx 100\,\mathrm{pF/m}$ pri $\varepsilon_r \approx 2{,}3$ in $b/a \approx 3{,}5$, torej $100\,\mathrm{m}$ okoli $10\,\mathrm{nF}$.

? Zakaj se izolacija s tanko zračno režo, ki leži pravokotno na polje, prebije pri nižji napetosti kot izolacija brez nje?
- Ker zrak prevaja tok.
~ Suh zrak je dober izolator; težava je v jakosti polja, ne v prevodnosti.
- Ker se v reži polje zmanjša in vsa napetost pade na trdno izolacijo.
~ Ravno obratno: v snovi z manjšim $\varepsilon_r$ je pri isti $D$ polje večje.
+ Ker je $D$ zvezen, je polje v zraku $\varepsilon_r$-krat večje, zrak pa prenese manjše polje.
> $\varepsilon_1E_1 = \varepsilon_2E_2$; v zraku je $E$ večji, prebojna trdnost zraka ($3\,\mathrm{MV/m}$) pa je mnogo manjša od trdne izolacije.

? Za kapacitivni senzor potrebuješ ploščati kondenzator s kapacitivnostjo $1{,}0\,\mathrm{nF}$, zračno režo $0{,}10\,\mathrm{mm}$. Kolikšna mora biti površina plošč?
- okoli $1{,}1\,\mathrm{cm^2}$
~ Pretvoril si, kot da je $1\,\mathrm{m^2} = 100\,\mathrm{cm^2}$; v resnici je $10^4\,\mathrm{cm^2}$, zato $0{,}0113\,\mathrm{m^2} = 113\,\mathrm{cm^2}$.
+ okoli $113\,\mathrm{cm^2}$
- okoli $1{,}1\,\mathrm{m^2}$
~ Razmik si vzel v milimetrih kot $0{,}010\,\mathrm{m}$ namesto $10^{-4}\,\mathrm{m}$.
> $S = Cd/\varepsilon_0 = 10^{-9} \cdot 10^{-4}/(8{,}854 \cdot 10^{-12})\,\mathrm{m^2} \approx 0{,}0113\,\mathrm{m^2}$.

? Dva enaka kondenzatorja: prvi nabit na $U_0$, drugi prazen. Povežemo ju vzporedno. Kolikšna je skupna energija po povezavi glede na začetno?
- Enaka, energija se ohrani.
~ Ohrani se naboj; energija se pri prelivanju naboja pretvori v toploto.
+ Polovica.
- Četrtina.
~ Četrtino ima vsak kondenzator posebej; skupaj sta dve četrtini.
- Dvakratna, ker sta zdaj dva nabita kondenzatorja.
~ Energija se ne more povečati brez vira; napetost je padla na polovico.
> Napetost je $U_0/2$, skupna energija $2 \cdot \frac{1}{2}C(U_0/2)^2 = \frac{1}{4}CU_0^2$, polovica od $\frac{1}{2}CU_0^2$.

:::simboli
C | kapacitivnost | C = \frac{Q}{U} | F
Q | naboj na notranjem prevodniku | | C
U | napetost med prevodnikoma | | V
\varepsilon | dielektričnost snovi | \varepsilon = \varepsilon_r\varepsilon_0 | F/m
\varepsilon_r | relativna dielektričnost | | –
\varepsilon_0 | influenčna konstanta | | F/m | $8{,}854 \cdot 10^{-12}\,\mathrm{F/m}$
\varepsilon_{r1}, \varepsilon_{r2} | relativni dielektričnosti plasti | | –
D | gostota električnega pretoka | D = \varepsilon E | C/m^2
E | električna poljska jakost | E = \frac{D}{\varepsilon} | V/m
E_{\text{dop}}, E_p | dopustna oz. prebojna poljska jakost | | V/m
a | polmer notranjega prevodnika | | m
b | notranji polmer zunanjega prevodnika | | m
r | razdalja od osi oz. središča | | m
r_1 | polmer meje med plastema | | m
r_0 | polmer vodnika voda | | m
l | dolžina kondenzatorja | | m
L | dolžina sonde | | m
h | višina gladine | | m
S | površina plošče | | m^2
d | razmik plošč ali vodnikov | | m
C' | kapacitivnost na dolžino | C' = \frac{C}{l} | F/m
Q' | naboj na dolžino | | C/m
W | energija kondenzatorja | W = \frac{1}{2}CU^2 | J
W' | energija na dolžino | W' = \frac{1}{2}C'U^2 | J/m
w | gostota energije polja | w = \frac{1}{2}ED | J/m^3
C_1, C_2, C_3 | kapacitivnosti posameznih kondenzatorjev | | F
C_{12} | nadomestna kapacitivnost zaporedne veje | | F
U_1, U_2 | napetosti na kondenzatorjih | | V
U_{\max} | največja dopustna napetost | | V
C_m | izmerjena kapacitivnost | | F
F | sila med ploščama | F = \frac{Q^2}{2\varepsilon S} | N
k | pomožna količina $Q'/(2\pi\varepsilon_0)$ | | V
:::
