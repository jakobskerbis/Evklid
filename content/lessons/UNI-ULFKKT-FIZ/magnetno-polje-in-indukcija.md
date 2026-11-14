---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec trdi: »Če v tuljavo vtaknem močan magnet in ga pustim v njej, bo svetleča dioda, priključena na konca tuljave, svetila, dokler je magnet notri.« Poskus ga ovrže: dioda utripne le za hip, ko se magnet giblje. Tok ustvarja magnetno polje, magnetno polje deluje na gibajoče se naboje, **spreminjajoče se** magnetno polje pa v vodniku inducira napetost. Na teh treh pojavih temeljijo elektromotor, generator, transformator, pa tudi **masni spektrometer** in **jedrska magnetna resonanca** (NMR) v kemiji.

## Razlaga

**1. Gostota magnetnega polja.** Magnetno polje opišemo z vektorjem **gostote magnetnega polja** $\vec{B}$. Enota je **tesla**, $1\,\mathrm{T} = 1\,\mathrm{V\,s/m^2}$. Zemeljsko polje je okoli $50\,\mu\mathrm{T}$, magnet na hladilniku okoli $10\,\mathrm{mT}$, močan neodimov magnet ob površini do okoli $1\,\mathrm{T}$, magnet v napravi MRI $1{,}5$ do $3\,\mathrm{T}$. Polje ponazorimo s **silnicami**, ki so vedno sklenjene: magnetnih »nabojev« (samostojnih polov) ni.

**2. Lorentzova sila.** Na naboj $q$, ki se giblje s hitrostjo $\vec{v}$ v magnetnem polju, deluje sila

$$\vec{F} = q\,\vec{v} \times \vec{B}, \qquad F = |q|vB\sin\theta.$$

Sila je pravokotna na hitrost in na polje; smer dobimo s pravilom desne roke (za negativen naboj je nasprotna). Naboj, ki se giblje vzporedno s poljem, ne čuti sile. Ker je sila pravokotna na hitrost, **ne opravlja dela** (njena moč je $P = \vec{F} \cdot \vec{v} = q(\vec{v} \times \vec{B}) \cdot \vec{v} = 0$): spremeni smer, ne pa velikosti hitrosti. Če sta prisotni tudi električno in magnetno polje, je celotna sila $\vec{F} = q(\vec{E} + \vec{v} \times \vec{B})$.

**3. Kroženje naboja.** Naj naboj prileti pravokotno na homogeno polje in naj druge sile ne delujejo. Potem ima sila stalno velikost $|q|vB$ in je ves čas pravokotna na hitrost, zato naboj enakomerno kroži. Sila je centripetalna, $|q|vB = mv^2/r$, iz tega in $\omega = v/r$ sledi

$$r = \frac{mv}{|q|B}, \qquad \omega = \frac{|q|B}{m}.$$

Krožna frekvenca (**ciklotronska frekvenca**) ni odvisna od hitrosti. Na tem delujeta ciklotron in masni spektrometer: ioni z enako energijo in nabojem, a različno maso, opišejo krožnice z različnim polmerom.

:::premisli
Proton in elektron z enako hitrostjo priletita pravokotno v isto homogeno polje. Kateri opiše manjšo krožnico in v katero smer krožita?
---
Elektron. Naboja sta po velikosti enaka, elektron pa ima okoli $1836$-krat manjšo maso, zato je po $r = mv/(|q|B)$ tudi njegov polmer toliko manjši. Krožita v nasprotnih smereh, ker imata naboja nasproten predznak.
:::

**4. Sila na vodnik s tokom.** Tok so gibajoči se naboji, zato na raven vodnik z dolžino $l$ in tokom $I$ v polju $\vec{B}$ deluje sila

$$\vec{F} = I\,\vec{l} \times \vec{B}, \qquad F = IlB\sin\theta,$$

kjer $\vec{l}$ kaže v smeri toka; velja za raven vodnik v homogenem polju. *Izpeljava:* v vodniku s presekom $S$ je $n$ nosilcev osnovnega naboja $e_0$ na enoto prostornine, ki potujejo s povprečno hitrostjo $v_d$, zato je $I = ne_0v_dS$. Na $nSl$ nosilcev deluje skupna sila $nSl\,e_0v_dB\sin\theta = IlB\sin\theta$. Na zanko s tokom v polju deluje navor; na tem deluje elektromotor in merilnik toka z vrtljivo tuljavico.

**5. Amperov zakon.** Tok ustvarja magnetno polje. Naj bodo tokovi stacionarni (časovno nespremenljivi). Potem za vsako sklenjeno pot velja **Amperov zakon**:

$$\oint\vec{B} \cdot \mathrm{d}\vec{s} = \mu_0I,$$

kjer je $I$ celotni tok skozi ploskev, ki jo pot objema, in $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$ **indukcijska konstanta**. Zakon je uporaben, kadar ima polje veliko simetrije.

- **Dolg raven vodnik.** Silnice so krožnice okoli vodnika; zaradi simetrije je $B$ na krožnici s polmerom $r$ povsod enako velik in tangenten nanjo, zato je $B \cdot 2\pi r = \mu_0I$, torej
$$B = \frac{\mu_0I}{2\pi r}.$$
Smer: palec desne roke v smeri toka, prsti kažejo smer silnic.
- **Dolga tuljava** z $N$ ovoji na dolžini $l$. V notranjosti je polje homogeno in vzporedno z osjo, zunaj pa skoraj nič. Pot v obliki pravokotnika z eno stranico dolžine $x$ v notranjosti objame $Nx/l$ ovojev. K integralu prispeva le notranja stranica ($Bx$): zunaj je polje zanemarljivo, na stranicah, pravokotnih na os, pa je $\vec{B}$ pravokoten na pot. Iz $Bx = \mu_0NIx/l$ sledi
$$B = \frac{\mu_0NI}{l}.$$

Polje v središču krožne zanke s polmerom $R$ je $B = \mu_0I/(2R)$; to izračunamo z Biot-Savartovim zakonom, ker Amperov tu ni dovolj.

**6. Sila med vzporednima vodnikoma.** Vodnik 1 ustvari na mestu vodnika 2 polje $\mu_0I_1/(2\pi r)$, ki deluje na vodnik 2 s silo $F/l = \mu_0I_1I_2/(2\pi r)$. Vodnika z istosmernima tokovoma se privlačita, z nasprotnima se odbijata.

**7. Magnetni pretok.** Skozi ploskev s površino $S$ v homogenem polju je **magnetni pretok**

$$\Phi_m = BS\cos\theta = \vec{B} \cdot \vec{S},$$

kjer je $\theta$ kot med poljem in normalo na ploskev. Enota je **weber**, $1\,\mathrm{Wb} = 1\,\mathrm{V\,s}$. Za nehomogeno polje je $\Phi_m = \int\vec{B} \cdot \mathrm{d}\vec{S}$; skozi vsako sklenjeno ploskev je magnetni pretok nič, ker so silnice sklenjene.

### Odkrij vzorec: kdaj se inducira napetost?

Na tuljavo priključimo občutljiv voltmeter in poskusimo nekaj stvari:

| Poskus | Voltmeter |
|---|---|
| Magnet miruje zunaj ali v tuljavi | $0$ |
| Magnet potiskamo v tuljavo | odklon |
| Magnet vlečemo ven | odklon v nasprotno smer |
| Magnet potisnemo hitreje | večji odklon |
| Tuljavo zavrtimo ob mirujočem magnetu | odklon |
| V sosednji tuljavi tok vklopimo ali izklopimo | kratek odklon |

:::premisli
Kaj imajo skupnega vsi poskusi, pri katerih se voltmeter odkloni? Zakaj velik mirujoč magnet ne da nič?
---
V vseh se s časom **spreminja** magnetni pretok skozi tuljavo: zaradi spremembe polja, lege ali kota. Mirujoč magnet da stalen pretok, zato napetosti ni, ne glede na to, kako močan je. Hitrejša sprememba da večjo napetost, obratna sprememba nasprotno.
:::

**8. Indukcijski zakon.** Vzorec iz tabele zapišemo kot zakon. Naj se magnetni pretok skozi ploskev, ki jo objema sklenjena zanka, s časom spreminja. Potem se v zanki **inducira napetost**:

$$U_i = -N\,\frac{\mathrm{d}\Phi_m}{\mathrm{d}t}$$

za tuljavo z $N$ ovoji, od katerih vsak objema enak pretok. Pretok lahko spremenimo s spremembo polja, površine ali kota. **Lenzovo pravilo** (minus v enačbi) pove smer: inducirani tok teče tako, da njegovo magnetno polje nasprotuje spremembi pretoka, ki ga je povzročila. To je posledica ohranitve energije: če bi inducirani tok spremembo krepil, bi se sam od sebe večal brez vloženega dela.

**9. Gibajoč se vodnik.** Palica z dolžino $l$, ki se giblje s hitrostjo $v$ pravokotno na polje $B$, pri čemer je tudi sama pravokotna na polje, ima med koncema inducirano napetost

$$U_i = Blv.$$

*Izpeljava:* na elektron v palici deluje sila $e_0vB$ vzdolž palice. Elektroni se premikajo, dokler električno polje nabojev na koncih ne uravnoteži magnetne sile, $e_0E = e_0vB$, zato je $U = El = Blv$. Enako da indukcijski zakon: površina zanke, ki jo zapira palica, raste s hitrostjo $\mathrm{d}S/\mathrm{d}t = lv$, zato $\mathrm{d}\Phi_m/\mathrm{d}t = Blv$.

**10. Generator in transformator.** Tuljava z $N$ ovoji in površino $S$, ki se vrti s kotno hitrostjo $\omega$ v homogenem polju, ima pretok $BS\cos\omega t$; njegov časovni odvod je $-BS\omega\sin\omega t$, zato se v njej inducira izmenična napetost $U_i = NBS\omega\sin\omega t$. V **idealnem transformatorju** (ves pretok ostane v železnem jedru, izgub ni) dve tuljavi objemata isti pretok, zato se v vsakem ovoju inducira enaka napetost $-\mathrm{d}\Phi_m/\mathrm{d}t$ in je razmerje napetosti enako razmerju števil ovojev: $U_2/U_1 = N_2/N_1$.

**11. Samoindukcija.** Tok skozi tuljavo ustvari pretok skozi lastne ovoje; skupni pretok skozi vse ovoje je sorazmeren s tokom, $N\Phi_m = LI$, kjer je $L$ **induktivnost** (enota henry, $1\,\mathrm{H} = 1\,\mathrm{V\,s/A}$). Ko se tok spreminja, se inducira napetost $U_i = -L\,\mathrm{d}I/\mathrm{d}t$. Za dolgo tuljavo je $L = \mu_0N^2S/l$, shranjena energija pa $W = \tfrac{1}{2}LI^2$. *Izpeljava:* z $B = \mu_0NI/l$ je $N\Phi_m = NBS = \mu_0N^2SI/l$. Ko tok narašča, vir opravlja delo proti inducirani napetosti z močjo $P = LI\,\mathrm{d}I/\mathrm{d}t$; integracija od $0$ do $I$ da $W = \tfrac{1}{2}LI^2$.

## Rešeni primeri

### Primer 1 (lažji)

Po dolgem ravnem vodniku teče tok $10\,\mathrm{A}$. Kolikšna je gostota magnetnega polja na razdalji $2{,}0\,\mathrm{cm}$ od vodnika? Vzporedno z njim na tej razdalji napnemo drugi vodnik, po katerem teče tok $5{,}0\,\mathrm{A}$ v isti smeri. S kolikšno silo deluje prvi vodnik na $1{,}0\,\mathrm{m}$ drugega vodnika in v katero smer?

**Podatki:** $I_1 = 10\,\mathrm{A}$, $r = 2{,}0\,\mathrm{cm} = 0{,}020\,\mathrm{m}$, $I_2 = 5{,}0\,\mathrm{A}$ (ista smer), $l = 1{,}0\,\mathrm{m}$, $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$
**Iščemo:** gostoto polja $B$ in silo $F$ na drugi vodnik

:::formula
$B = \dfrac{\mu_0I_1}{2\pi r}$, $F = I_2lB$
:::

**Rešitev:**

1. Vodnik je dolg in raven, zato velja $B = \mu_0I_1/(2\pi r)$ iz Amperovega zakona: $B = 4\pi \cdot 10^{-7} \cdot 10/(2\pi \cdot 0{,}020)\,\mathrm{T} = 2 \cdot 10^{-7} \cdot 10/0{,}020\,\mathrm{T} = 1{,}0 \cdot 10^{-4}\,\mathrm{T}$.
2. To je $100\,\mu\mathrm{T}$, dvakrat več od zemeljskega polja; zato vodniki s tokom motijo kompas.
3. Polje je pravokotno na drugi vodnik, zato $F = I_2lB = 5{,}0 \cdot 1{,}0 \cdot 1{,}0 \cdot 10^{-4}\,\mathrm{N} = 5{,}0 \cdot 10^{-4}\,\mathrm{N}$.
4. Odgovor: polje na razdalji $2{,}0\,\mathrm{cm}$ je $1{,}0 \cdot 10^{-4}\,\mathrm{T}$; vodnika se privlačita, ker sta tokova istosmerna, sila na meter drugega vodnika je $0{,}50\,\mathrm{mN}$.

### Primer 2

V masnem spektrometru enkrat pozitivno nabite ione ogljika pospešimo z napetostjo $2000\,\mathrm{V}$ iz mirovanja, nato pa vstopijo pravokotno v homogeno magnetno polje $0{,}20\,\mathrm{T}$, kjer opišejo polkrožnico in zadenejo detektor. Kolikšna je hitrost iona $\mathrm{^{12}C^+}$, kolikšna sta polmera tirnic za $\mathrm{^{12}C^+}$ in $\mathrm{^{13}C^+}$ in kako daleč narazen zadeneta detektor? Atomska enota mase je $1{,}66 \cdot 10^{-27}\,\mathrm{kg}$; maso elektrona zanemarimo.

**Podatki:** $q = +e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$, $U = 2000\,\mathrm{V}$, $B = 0{,}20\,\mathrm{T}$, $m_{12} = 12\,\mathrm{u}$, $m_{13} = 13\,\mathrm{u}$, $1\,\mathrm{u} = 1{,}66 \cdot 10^{-27}\,\mathrm{kg}$, ioni vstopijo pravokotno na polje
**Iščemo:** hitrost $v_{12}$, polmera $r_{12}$ in $r_{13}$, razdaljo med mestoma zadetka $\Delta x$

:::formula
$e_0U = \tfrac{1}{2}mv^2$, $r = \dfrac{mv}{e_0B} = \dfrac{1}{B}\sqrt{\dfrac{2mU}{e_0}}$, $\Delta x = 2(r_{13} - r_{12})$
:::

**Rešitev:**

1. $m_{12} = 12 \cdot 1{,}66 \cdot 10^{-27}\,\mathrm{kg} = 1{,}992 \cdot 10^{-26}\,\mathrm{kg}$.
2. Delo električnega polja $e_0U$ se pretvori v kinetično energijo, zato $v_{12} = \sqrt{2e_0U/m_{12}} = \sqrt{2 \cdot 1{,}602 \cdot 10^{-19} \cdot 2000/1{,}992 \cdot 10^{-26}}\,\mathrm{m/s} \approx 1{,}794 \cdot 10^5\,\mathrm{m/s}$.
3. Lorentzova sila opravlja vlogo centripetalne sile: $r_{12} = m_{12}v_{12}/(e_0B) = 1{,}992 \cdot 10^{-26} \cdot 1{,}794 \cdot 10^5/(1{,}602 \cdot 10^{-19} \cdot 0{,}20)\,\mathrm{m} \approx 0{,}1115\,\mathrm{m}$ (natančneje $0{,}11151\,\mathrm{m}$).
4. Ker je $r \propto \sqrt{m}$: $r_{13} = r_{12}\sqrt{13/12} \approx 0{,}11606\,\mathrm{m}$.
5. Ioni zadenejo detektor po polovici kroga, torej na razdalji premera od vstopa: $\Delta x = 2(0{,}11606 - 0{,}11151)\,\mathrm{m} \approx 9{,}1\,\mathrm{mm}$.
6. Odgovor: ion $\mathrm{^{12}C^+}$ ima hitrost okoli $1{,}8 \cdot 10^5\,\mathrm{m/s}$ in kroži s polmerom $11{,}2\,\mathrm{cm}$, ion $\mathrm{^{13}C^+}$ s polmerom $11{,}6\,\mathrm{cm}$; izotopa zadeneta detektor približno $9\,\mathrm{mm}$ narazen.

### Primer 3 (težji)

Kovinska palica z dolžino $0{,}50\,\mathrm{m}$ drsi brez trenja po dveh vzporednih vodoravnih tirnicah, ki sta na enem koncu povezani z uporom $0{,}80\,\Omega$. Sistem je v navpičnem homogenem magnetnem polju $0{,}40\,\mathrm{T}$. Palico z maso $0{,}10\,\mathrm{kg}$ vlečemo s stalno hitrostjo $2{,}0\,\mathrm{m/s}$. Kolikšna je inducirana napetost, kolikšen tok teče, s kolikšno silo moramo vleči palico in kolikšna je moč vlečenja? Nato palico spustimo. Kolikšno pot še prevozi in koliko toplote se pri tem sprosti na uporu? Upor palice in tirnic zanemarimo.

**Podatki:** $l = 0{,}50\,\mathrm{m}$, $R = 0{,}80\,\Omega$, $B = 0{,}40\,\mathrm{T}$ (pravokotno na ravnino tirnic), $v = 2{,}0\,\mathrm{m/s}$ (stalna), $m = 0{,}10\,\mathrm{kg}$, brez trenja, upor palice in tirnic zanemarljiv
**Iščemo:** $U_i$, $I$, silo vlečenja $F$, moč $P$; pot $x$ po spustu, toploto $Q$

:::formula
$U_i = Blv$, $I = U_i/R$, $F = IlB = \dfrac{B^2l^2v}{R}$, $P = Fv = I^2R$; $m\dfrac{\mathrm{d}v}{\mathrm{d}t} = -\dfrac{B^2l^2v}{R}$
:::

**Rešitev:**

1. Palica, hitrost in polje so medsebojno pravokotni, zato velja $U_i = Blv$: $U_i = 0{,}40\,\mathrm{T} \cdot 0{,}50\,\mathrm{m} \cdot 2{,}0\,\mathrm{m/s} = 0{,}40\,\mathrm{V}$.
2. Tok: $I = 0{,}40\,\mathrm{V}/0{,}80\,\Omega = 0{,}50\,\mathrm{A}$.
3. Na palico s tokom deluje magnetna sila $F_m = IlB = 0{,}50 \cdot 0{,}50 \cdot 0{,}40\,\mathrm{N} = 0{,}10\,\mathrm{N}$. Po Lenzovem pravilu nasprotuje gibanju (zavira palico).
4. Za stalno hitrost mora biti vlečna sila enako velika: $F = 0{,}10\,\mathrm{N}$.
5. Moč vlečenja: $P = Fv = 0{,}10\,\mathrm{N} \cdot 2{,}0\,\mathrm{m/s} = 0{,}20\,\mathrm{W}$. Preizkus: $I^2R = 0{,}25 \cdot 0{,}80\,\mathrm{W} = 0{,}20\,\mathrm{W}$ ✓.
6. Po spustu je edina vodoravna sila zaviralna magnetna sila; iz korakov 1 do 3 za poljubno hitrost $F_m = B^2l^2v/R$, zato $m\,\mathrm{d}v/\mathrm{d}t = -B^2l^2v/R$.
7. Zanima nas pot, zato zapišemo $\mathrm{d}v/\mathrm{d}t = v\,\mathrm{d}v/\mathrm{d}x$ in krajšamo $v$: $m\,\mathrm{d}v = -(B^2l^2/R)\,\mathrm{d}x$. Hitrost torej pada linearno s potjo.
8. Do ustavitve: $x = \dfrac{mvR}{B^2l^2} = \dfrac{0{,}10 \cdot 2{,}0 \cdot 0{,}80}{0{,}40^2 \cdot 0{,}50^2}\,\mathrm{m} = 4{,}0\,\mathrm{m}$. (S časom hitrost pada eksponentno s časovno konstanto $mR/(B^2l^2) = 2{,}0\,\mathrm{s}$, pot pa je končna.)
9. Vsa kinetična energija se pretvori v toploto na uporu: $Q = \tfrac{1}{2}mv^2 = 0{,}5 \cdot 0{,}10 \cdot 2{,}0^2\,\mathrm{J} = 0{,}20\,\mathrm{J}$.
10. Odgovor: inducira se napetost $0{,}40\,\mathrm{V}$, teče tok $0{,}50\,\mathrm{A}$, palico vlečemo s silo $0{,}10\,\mathrm{N}$ in z močjo $0{,}20\,\mathrm{W}$, ki se v celoti pretvori v toploto na uporu. Spuščena palica prevozi še $4{,}0\,\mathrm{m}$, na uporu se sprosti $0{,}20\,\mathrm{J}$ toplote.

### Primer 4 – zdaj ti

V delavnici na plastično cev navijemo tuljavo z $800$ ovoji na dolžini $10\,\mathrm{cm}$; presek tuljave je $2{,}0\,\mathrm{cm^2}$. Po njej teče tok $0{,}50\,\mathrm{A}$. Stikalo tok prekine v $2{,}0\,\mathrm{ms}$. Kolikšno je polje v tuljavi, kolikšen pretok skozi en ovoj in kolikšna povprečna napetost se pri izklopu inducira v tuljavi?

**Podatki:** $N = 800$, $l = 10\,\mathrm{cm} = 0{,}10\,\mathrm{m}$, $S = 2{,}0\,\mathrm{cm^2} = 2{,}0 \cdot 10^{-4}\,\mathrm{m^2}$, $I = 0{,}50\,\mathrm{A}$, $\Delta t = 2{,}0\,\mathrm{ms}$, jedro je iz plastike, $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$
**Iščemo:** gostoto polja $B$, pretok $\Phi_m$ skozi en ovoj, povprečno inducirano napetost $|U_i|$

:::formula
$B = \dfrac{\mu_0NI}{l}$, $\Phi_m = BS$, $|U_i| = N\dfrac{\Delta\Phi_m}{\Delta t}$
:::

**Rešitev:**

1. Tuljava je mnogo daljša od premera, zato je polje v notranjosti homogeno: $B = 4\pi \cdot 10^{-7} \cdot 800 \cdot 0{,}50/0{,}10\,\mathrm{T} \approx 5{,}03 \cdot 10^{-3}\,\mathrm{T}$.
2. Polje je vzporedno z osjo, torej z normalo na ovoj ($\cos\theta = 1$): $\Phi_m = 5{,}03 \cdot 10^{-3} \cdot 2{,}0 \cdot 10^{-4}\,\mathrm{Wb} \approx 1{,}01 \cdot 10^{-6}\,\mathrm{Wb}$.
3. Pri izklopu pretok pade na nič. Napetost in njeno smer določi sam, nato preveri:

:::premisli
Kolikšna je povprečna inducirana napetost? V katero smer teče inducirani tok glede na prvotni tok?
---
$|U_i| = 800 \cdot 1{,}01 \cdot 10^{-6}\,\mathrm{Wb}/(2{,}0 \cdot 10^{-3}\,\mathrm{s}) \approx 0{,}40\,\mathrm{V}$. Po Lenzovem pravilu inducirani tok nasprotuje zmanjšanju pretoka, zato teče v isti smeri kot prvotni tok in ga skuša ohraniti. Enako da $L\,\Delta I/\Delta t$ z $L = \mu_0N^2S/l$.
:::

## Pogoste napake

- **Lorentzova sila v smeri polja.** Sila je pravokotna na $\vec{B}$ in na $\vec{v}$, ne vzporedna s poljem. Pri gibanju vzdolž silnic je sila nič.
- **Magnetna sila opravlja delo.** Lorentzova sila je pravokotna na hitrost, zato ne spremeni kinetične energije delca. Ione pospeši električno polje, magnetno jih le ukrivi.
- **Polje vodnika z $1/r^2$.** Polje dolgega ravnega vodnika pada z $1/r$, ne z $1/r^2$.
- **Napetost se inducira zaradi polja.** Napetost povzroči **sprememba** pretoka, ne pretok sam.
- **Pozabljeno število ovojev.** Pri tuljavi pomnoži spremembo pretoka skozi en ovoj z $N$.

## Povzetek

- Lorentzova sila $\vec{F} = q\vec{v} \times \vec{B}$; kroženje: $r = mv/(|q|B)$, $\omega = |q|B/m$; sila na vodnik $\vec{F} = I\vec{l} \times \vec{B}$.
- Amperov zakon $\oint\vec{B} \cdot \mathrm{d}\vec{s} = \mu_0I$; raven vodnik $B = \mu_0I/(2\pi r)$; dolga tuljava $B = \mu_0NI/l$.
- Magnetni pretok $\Phi_m = BS\cos\theta$.
- Indukcijski zakon $U_i = -N\,\mathrm{d}\Phi_m/\mathrm{d}t$; Lenzovo pravilo: inducirani tok nasprotuje spremembi; gibajoča palica $U_i = Blv$.
- Generator $U_i = NBS\omega\sin\omega t$; transformator $U_2/U_1 = N_2/N_1$; samoindukcija $U_i = -L\,\mathrm{d}I/\mathrm{d}t$.

## Za izpit

Znati moraš povedati:

- Lorentzovo silo, dokaz, da ne opravlja dela, in izpeljavo $r = mv/(|q|B)$, $\omega = |q|B/m$ s pogoji;
- silo na vodnik s tokom in njeno izpeljavo iz Lorentzove sile;
- Amperov zakon s pogojem (stacionarni tokovi) in izpeljavo polja dolgega ravnega vodnika in dolge tuljave;
- definicijo magnetnega pretoka, indukcijski zakon in Lenzovo pravilo z utemeljitvijo iz ohranitve energije;
- izpeljavo $U_i = Blv$ na dva načina ter izpeljavo $L = \mu_0N^2S/l$ in $W = \tfrac{1}{2}LI^2$.

### Naloga 1

Vzporedni tirnici z razmikom $0{,}40\,\mathrm{m}$ sta nagnjeni za $30^\circ$ proti vodoravnici in na spodnjem koncu povezani z uporom $0{,}50\,\Omega$. Sistem je v **navpičnem** homogenem polju $0{,}60\,\mathrm{T}$. Po tirnicah iz mirovanja brez trenja drsi vodoravna palica z maso $50\,\mathrm{g}$, pravokotna na tirnici. Upor palice in tirnic zanemari, $g = 9{,}81\,\mathrm{m/s^2}$. Izpelji izraz za končno hitrost palice in jo izračunaj. Kolikšen je tok pri tej hitrosti? Pokaži, da je moč teže enaka toplotni moči na uporu.

**Rešitev:**

1. Normala na ravnino tirnic oklepa z navpičnim poljem kot $\alpha$, zato je pretok skozi zanko $BS\cos\alpha$. Palica s hitrostjo $v$ vzdolž tirnic spreminja površino zanke s hitrostjo $lv$, zato $|U_i| = Blv\cos\alpha$ in $I = Blv\cos\alpha/R$.
2. Palica je vodoravna, polje navpično, zato je sila $I\vec{l} \times \vec{B}$ vodoravna, velikosti $IlB$ in pravokotna na palico. Po Lenzovem pravilu zavira gibanje; komponenta vzdolž klanca je $IlB\cos\alpha$.
3. Drugi Newtonov zakon vzdolž klanca: $ma = mg\sin\alpha - \dfrac{B^2l^2v\cos^2\alpha}{R}$. Zaviralna sila raste s hitrostjo, zato pospešek pada proti nič.
4. Končna hitrost ($a = 0$): $v_k = \dfrac{mgR\sin\alpha}{B^2l^2\cos^2\alpha} = \dfrac{0{,}050 \cdot 9{,}81 \cdot 0{,}50 \cdot 0{,}50}{0{,}60^2 \cdot 0{,}40^2 \cdot 0{,}75}\,\mathrm{m/s} \approx 2{,}84\,\mathrm{m/s}$.
5. Tok: $I = \dfrac{0{,}60 \cdot 0{,}40 \cdot 2{,}84 \cdot 0{,}866}{0{,}50}\,\mathrm{A} \approx 1{,}18\,\mathrm{A}$.
6. Moč teže: $mg\sin\alpha \cdot v_k = 0{,}050 \cdot 9{,}81 \cdot 0{,}50 \cdot 2{,}84\,\mathrm{W} \approx 0{,}696\,\mathrm{W}$; toplotna moč $I^2R = 1{,}18^2 \cdot 0{,}50\,\mathrm{W} \approx 0{,}696\,\mathrm{W}$. Splošno: pri $a = 0$ je $mg\sin\alpha = B^2l^2v_k\cos^2\alpha/R$, pomnoženo z $v_k$ to da $mg\sin\alpha\,v_k = (Blv_k\cos\alpha)^2/R = I^2R$.
7. Odgovor: $v_k = mgR\sin\alpha/(B^2l^2\cos^2\alpha) \approx 2{,}84\,\mathrm{m/s}$, tok je okoli $1{,}18\,\mathrm{A}$; vsa sproščena potencialna energija se pretvori v toploto na uporu.

### Naloga 2

Natančno navedi Amperov zakon z vsemi pogoji in z njim izpelji gostoto polja dolgega ravnega vodnika in dolge tuljave. Utemelji, ali lahko z Amperovim zakonom izračunaš polje v središču krožne zanke.

**Rešitev:**

1. Naj bodo tokovi stacionarni. Potem je za vsako sklenjeno pot $\oint\vec{B} \cdot \mathrm{d}\vec{s} = \mu_0I$, kjer je $I$ celotni tok skozi ploskev, ki jo pot objema (tokovi, ki je ne prebodejo, ne štejejo).
2. Raven vodnik: zaradi osne simetrije je $B$ odvisen le od $r$ in tangenten na krožnice okoli vodnika. Za pot po krožnici s polmerom $r$ je integral $B \cdot 2\pi r = \mu_0I$, torej $B = \mu_0I/(2\pi r)$.
3. Tuljava: v notranjosti je polje homogeno in vzporedno z osjo, zunaj zanemarljivo. Pot v obliki pravokotnika z notranjo stranico $x$ da integral $Bx$; zunanja stranica prispeva nič, stranici, pravokotni na os, tudi nič ($\vec{B} \perp \mathrm{d}\vec{s}$).
4. Pot objame $Nx/l$ ovojev, torej tok $NIx/l$; iz $Bx = \mu_0NIx/l$ sledi $B = \mu_0NI/l$.
5. Krožna zanka: zakon sicer velja, ni pa poti, na kateri bi bil $B$ zaradi simetrije stalen in povsod vzporeden ali pravokoten na pot, zato integrala ne moremo izraziti z $B$ v središču.
6. Odgovor: z Amperovim zakonom polja v središču zanke ne izračunamo; uporabimo Biot-Savartov zakon, ki da $B = \mu_0I/(2R)$.

## Drugače: Na sliki

Palica na tirnicah iz Primera 3 (polje kaže iz lista, $\odot$):

```
   o------------------------o
   |     ⊙   ⊙   ⊙   |          palica →  v
  [R]    ⊙   ⊙   ⊙   |  l
   |     ⊙   ⊙   ⊙   |
   o------------------------o
```

Palica drsi v desno, pretok narašča; inducirani tok ustvari polje v list, magnetna sila na palico pa kaže v levo, proti gibanju.

## Drugače: Uporaba v stroki

**NMR in MRI.** Protoni v polju $B$ precesirajo s frekvenco $\nu = \gamma B/(2\pi)$, kjer je $\gamma/(2\pi) \approx 42{,}6\,\mathrm{MHz/T}$; v polju $1{,}5\,\mathrm{T}$ je to okoli $64\,\mathrm{MHz}$. Precesija vzbujenih jeder inducira v sprejemni tuljavi napetost, ki jo izmerimo. Kemijski premik nastane, ker elektroni okoli jedra nekoliko oslabijo polje, ki ga jedro čuti.

**Elektromagnetni merilnik pretoka.** Prevodna kapljevina (voda, kri, kisline) teče skozi cev v polju $B$; Lorentzova sila loči ione, zato se med elektrodama na steni pojavi napetost $U = Bdv$ ($d$ je notranji premer cevi, $v$ povprečna hitrost toka); iz nje dobimo pretok brez delov, ki bi ovirali tok.

**Indukcijsko segrevanje.** Izmenično polje tuljave inducira v kovini vrtinčne tokove, ki jo segrejejo: v industriji tako talijo in kalijo kovine in v laboratoriju segrevajo talilne lončke.

**Prenos energije.** Transformatorji dvignejo napetost na več sto kilovoltov, da so tok in izgube $I^2R$ v daljnovodu majhni.

## Drugače: Bolj natančno

**Biot-Savartov zakon.** Splošno polje toka izračunamo z

$$\mathrm{d}\vec{B} = \frac{\mu_0I}{4\pi}\,\frac{\mathrm{d}\vec{l} \times \hat{r}}{r^2}.$$

Za središče krožne zanke so vsi prispevki vzporedni in $r = R$, zato je $B = \frac{\mu_0I}{4\pi R^2} \cdot 2\pi R = \frac{\mu_0I}{2R}$. Amperov zakon je integralna oblika istih zakonitosti za stacionarne tokove.

**Vrtinčno električno polje.** Pri mirujoči zanki v spreminjajočem se polju Lorentzova sila ne pojasni napetosti; tam spreminjajoče se magnetno polje ustvari vrtinčno električno polje, $\oint\vec{E} \cdot \mathrm{d}\vec{s} = -\mathrm{d}\Phi_m/\mathrm{d}t$. To je ena od Maxwellovih enačb.

## Preveri se

? Elektron se giblje vzporedno s silnicami homogenega magnetnega polja. Kolikšna magnetna sila deluje nanj?
+ Nič.
- Največja možna, $e_0vB$.
~ Zamenjal si vzporedno in pravokotno: največja je sila pri gibanju pravokotno na silnice, ko je $\sin\theta = 1$.
- Polovica največje, $e_0vB/2$.
~ Polovico bi dobil pri kotu $30^\circ$; pri gibanju vzdolž silnic je $\sin 0^\circ = 0$.
> $F = |q|vB\sin\theta$, pri $\theta = 0$ je $\sin\theta = 0$.

? Gostota polja na razdalji $r$ od dolgega ravnega vodnika je $B$. Kolikšna je na razdalji $2r$?
- $B/4$
~ Uporabil si padanje z $1/r^2$, ki velja za točkast naboj; polje dolgega ravnega vodnika pada z $1/r$.
+ $B/2$
- $2B$
~ Polje z razdaljo ne narašča: dlje od vodnika so silnice redkejše, ker se isti »tok« silnic razporedi po daljši krožnici.
> $B = \mu_0I/(2\pi r)$ pada z $1/r$.

? Dolga tuljava ima $500$ ovojev na dolžini $25\,\mathrm{cm}$, po njej teče tok $2{,}0\,\mathrm{A}$. Kolikšna je gostota polja v notranjosti?
- $0{,}50\,\mathrm{mT}$
~ Rezultat je za faktor $10$ premajhen: zmotil si se v potenci, preveri $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{V\,s/(A\,m)}$.
+ $5{,}0\,\mathrm{mT}$
- $2{,}5\,\mathrm{mT}$
~ Primešal si faktor $\tfrac{1}{2}$ iz formule za krožno zanko $\mu_0I/(2R)$; v $B = \mu_0NI/l$ ga ni.
> $B = \mu_0NI/l = 4\pi \cdot 10^{-7} \cdot 500 \cdot 2{,}0/0{,}25\,\mathrm{T} \approx 5{,}0 \cdot 10^{-3}\,\mathrm{T}$.

? Transformator ima na primarni strani $1000$ ovojev in napetost $230\,\mathrm{V}$, na sekundarni $50$ ovojev. Kolikšna je sekundarna napetost?
- $4600\,\mathrm{V}$
~ Obrnil si razmerje: sekundar z manj ovoji napetost zniža, ne zviša.
+ $11{,}5\,\mathrm{V}$
- $230\,\mathrm{V}$
~ Transformator napetosti ne prenese nespremenjene: v vsakem ovoju se inducira enaka napetost, zato je skupna sorazmerna s številom ovojev.
> $U_2 = U_1N_2/N_1 = 230 \cdot 50/1000\,\mathrm{V} = 11{,}5\,\mathrm{V}$.

? Sošolka pri palici na tirnicah (Primer 3) zapiše: »Inducirani tok ustvari magnetno silo v smeri gibanja, zato se palica, ko jo enkrat sunemo, giblje sama in na uporu greje.« Kje je napaka?
- Napaka je le v velikosti sile; smer je pravilna.
~ Smer je ravno bistvo napake: sila v smeri gibanja bi palico pospeševala brez vloženega dela.
+ Po Lenzovem pravilu sila nasprotuje gibanju; brez vlečenja se palica ustavi.
- Napake ni, saj magnetna sila ne opravlja dela.
~ Lorentzova sila na posamezen naboj res ne opravlja dela, sila $IlB$ na palico pa jo zavira in pretvarja njeno kinetično energijo v toploto.
> Sila v smeri gibanja bi palico pospeševala in grela upor brez vloženega dela, kar krši ohranitev energije.

:::simboli
\vec{F} | magnetna (Lorentzova) sila | \vec{F} = q\,\vec{v} \times \vec{B} | N | pravokotna na hitrost in na polje
F | velikost magnetne sile | F = \lvert q\rvert vB\sin\theta | N | na vodnik: F = IlB sin θ
q | naboj delca | | C
\vec{v} | vektor hitrosti delca | | m/s
v | hitrost delca | | m/s | pri drsečem vodniku hitrost vodnika
\vec{B} | vektor gostote magnetnega polja | | T
B | gostota magnetnega polja | | T
\theta | kot med hitrostjo (tokom) in poljem | | ° | pri pretoku kot med poljem in normalo
r | polmer tira delca ali razdalja od vodnika | | m | polmer tira naboja: r = mv/(qB) za q > 0
r_{12}, r_{13} | polmera tirov ionov ogljika-12 in ogljika-13 | | m
m | masa delca | | kg
\omega | kotna hitrost kroženja delca | \omega = \frac{\lvert q\rvert B}{m} | s^{-1} | pri generatorju kotna hitrost tuljave
I | električni tok | | A
I_1, I_2 | tokova v vzporednih vodnikih 1 in 2 | | A
\vec{l} | vektor dolžine vodnika (v smeri toka) | | m
l | dolžina vodnika ali tuljave | | m
\vec{s} | element poti okoli toka | | m | pri Amperovem zakonu
\mu_0 | indukcijska konstanta | | V\,s/(A\,m) | 4π · 10⁻⁷ V s/(A m)
N | število ovojev tuljave | | –
\Phi_m | magnetni pretok | \Phi_m = BS\cos\theta | Wb | 1 Wb = 1 T m²
\vec{S} | vektor ploskve (pravokoten na ploskev) | | m^2 | velikost je površina ploskve
S | površina ploskve (ovoja) | | m^2
U_i | inducirana napetost | U_i = -N\,\frac{\mathrm{d}\Phi_m}{\mathrm{d}t} | V | premikajoči vodnik: U_i = Blv
\Delta\Phi_m | sprememba magnetnega pretoka | | Wb | v času Δt; povprečna inducirana napetost N ΔΦ_m/Δt
t | čas | | s
e_0 | osnovni naboj | | C | 1,602 · 10⁻¹⁹ C
U | pospeševalna napetost | | V
\Delta x | razdalja med mestoma zadetka ionov | \Delta x = 2(r_{13} - r_{12}) | m
R | električni upor tokokroga | | Ω | pri krožni zanki njen polmer
P | moč | P = Fv = I^2R | W
\hat{r} | enotski vektor od elementa vodnika do točke | | –
x | pot palice do ustavitve; pri tuljavi dolžina notranje stranice poti | x = \frac{mvR}{B^2l^2} | m
Q | toplota na uporu | | J
v_k | končna hitrost palice na klancu | | m/s
\alpha | naklon tirnic | | °
g | težni pospešek | | m/s^2 | 9,81 m/s²
a | pospešek palice | | m/s^2
L | induktivnost | N\Phi_m = LI | H
W | energija magnetnega polja tuljave | W = \tfrac{1}{2}LI^2 | J
n | število nosilcev naboja na enoto prostornine | | m^{-3}
v_d | povprečna (potovalna) hitrost nosilcev naboja | | m/s
:::
