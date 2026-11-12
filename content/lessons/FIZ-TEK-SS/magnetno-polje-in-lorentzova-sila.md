---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1820 je Hans Christian Ørsted opazil, da se magnetnica ob žici s tokom odkloni. Tok torej deluje na magnet. Fiziki so takoj postavili obratno vprašanje: ali magnet deluje na tok? André-Marie Ampère je kmalu zatem meril sile med vodniki s tokom. Ob koncu 19. stoletja je J. J. Thomson z magnetom odklanjal katodne žarke. Iz ukrivljenosti njihovega tira je sklepal, da so to delci, veliko lažji od atomov. Tako so odkrili elektron.

Ista sila danes pomaga pri denarju. Natančna tehtnica v zlatarni nima vzmeti. Pod ploščico je tuljava v reži magneta, elektronika pa poveča tok ravno toliko, da magnetna sila drži ploščico na mestu. Iz toka izračuna maso prstana in s tem njegovo ceno. Laboratorij, ki preverja zlate palice, pa vzorec spremeni v ione in jih pošlje skozi magnetno polje. Ioni zlata in ioni volframa, s katerim ponarejevalci polnijo palice, zavijejo po različno velikih krogih.

Kako lahko magnet loči pravo zlato od ponaredka, ki ga tehtnica ne zazna? Odgovor je v tem, kako magnetno polje ukrivi tir.

## Razlaga

**Mamljiva napačna ideja.** Iz elektrostatike veš, da sila na naboj kaže vzdolž silnic električnega polja: $\vec F = q\vec E$. Zato je naravno misliti, da magnetno polje naboj potiska vzdolž magnetnih silnic. Poskusi kažejo drugače. Mirujoč naboj v polju magneta ne čuti ničesar. Naboj, ki leti vzporedno s silnicami, prav tako ne. Sila se pojavi šele, ko naboj silnice seka, in kaže **pravokotno** na silnice in na hitrost hkrati.

**Popravek: Lorentzova sila.** Magnetno polje opišemo z gostoto magnetnega polja $\vec B$; enota je tesla, $1\,\mathrm{T} = 1\,\mathrm{N/(A\,m)}$. Na naboj $q$ s hitrostjo $\vec v$ deluje **Lorentzova sila**

$$\vec F = q\,\vec v \times \vec B$$

Znak $\times$ je vektorski produkt: rezultat je pravokoten na oba vektorja. Velikost sile je

$$F = q v B \sin\alpha$$

kjer je $\alpha$ kot med $\vec v$ in $\vec B$. Smer določiš z desno roko: iztegnjene prste usmeri v smer $\vec v$ in jih pokrči proti $\vec B$. Palec kaže silo na **pozitiven** naboj. Na negativen naboj, na primer elektron, kaže sila ravno nasprotno.

| | Električna sila | Magnetna sila |
|---|---|---|
| mirujoč naboj | deluje | ne deluje |
| smer | vzdolž $\vec E$ | pravokotno na $\vec v$ in $\vec B$ |
| odvisna od hitrosti | ne | da, $F \propto v\sin\alpha$ |

:::premisli
Na proton v vakuumu deluje samo magnetna sila. Ali se lahko čez nekaj časa giblje hitreje kot na začetku? Zakaj?
---
Ne. Sila je ves čas pravokotna na hitrost, zato ne opravlja dela in kinetična energija se ne spremeni. Polje spreminja le **smer** hitrosti, njena velikost ostane enaka.
:::

**Kroženje.** Sila, ki je ves čas pravokotna na hitrost in stalne velikosti, je ravno sila proti središču, ki jo poznaš iz kroženja. Če $\vec v \perp \vec B$, se naboj enakomerno giblje po krožnici.

:::risba skica
opis: Pozitiven naboj kroži v magnetnem polju, ki kaže v zaslon (znaki ×). Na dnu krožnice se giblje v desno, puščica sile F kaže navzgor proti središču krožnice S.
območje: 0; 0 .. 8; 5
enota: 38
napis: 1; 1 | × | sredina
napis: 1; 2,5 | × | sredina
napis: 1; 4 | × | sredina
napis: 7; 1 | × | sredina
napis: 7; 2,5 | × | sredina
napis: 7; 4 | × | sredina
krog: 4; 2,5 | 2 | modra črtkano
točka: 4; 2,5 | S | desno
točka: 4; 0,5 | + | pod levo | rdeča
puščica: 4; 0,5 -> 5,6; 0,5 | v | pod | debelo
puščica: 4; 0,5 -> 4; 1,8 | F | levo | oranžna
podnapis: Pozitiven naboj, polje B v zaslon: sila kaže proti središču.
:::

Magnetna sila je sila proti središču, zato velja enačba $q v B = \dfrac{m v^2}{r}$. Iz nje dobiš polmer kroga:

$$r = \frac{m v}{q B}$$

Obhodni čas je $t_0 = \dfrac{2\pi r}{v}$. Ko vstaviš polmer, se hitrost okrajša:

$$t_0 = \frac{2\pi m}{q B}$$

Polmer je sorazmeren z gibalno količino $mv$, obhodni čas pa od hitrosti sploh ni odvisen. Hitrejši delec opiše večji krog v enakem času. Na tem deluje ciklotron, pospeševalnik, ki delec ob vsakem obhodu dodatno pospeši z izmenično napetostjo stalne frekvence.

V simulaciji spodaj »Naboj v magnetnem polju« izberi proton s hitrostjo $2 \cdot 10^6\,\mathrm{m/s}$, nato hitrost podvoji. Opazuj izpisani polmer tira: podvoji se. Potem izberi antiproton (enaka masa, nasproten naboj) in poglej, v katero smer zavije.

:::premisli
Proton in delec alfa (naboj $2e$, masa približno $4 m_p$) vletita z enako hitrostjo v isto polje. Napovej, kateri ima večji tir in kolikokrat.
---
Delec alfa. Masa je štirikrat večja, naboj pa le dvakrat, zato je $r = \frac{mv}{qB}$ dvakrat večji kot pri protonu.
:::

**Poševen vstop: vijačnica.** Če hitrost s silnicami oklepa kot $\alpha$, jo razstavi. Komponenta $v_\perp = v\sin\alpha$ povzroča kroženje. Komponenta $v_\parallel = v\cos\alpha$ ostane nespremenjena, ker vzdolž $\vec B$ ni sile. Tir je vijačnica s polmerom $r = \frac{m v_\perp}{qB}$. Njen **korak** $h$ je razdalja, ki jo delec vzdolž silnic opravi v enem obhodu:

$$h = v_\parallel\, t_0$$

Tako delci iz Sonca vijugajo vzdolž Zemljinih silnic proti poloma in povzročijo polarni sij.

**Izbiralnik hitrosti.** Naj na ion hkrati delujeta električno polje $E$ in nanj pravokotno magnetno polje $B$, tako da sili kažeta nasprotno. Sili sta enako veliki samo pri eni hitrosti: iz enačbe $qE = qvB$ sledi $v = \frac{E}{B}$. Hitrejši in počasnejši ioni se odklonijo na zaslonko. Tak izbiralnik je vhod masnega spektrometra, naprave, ki ione loči po masi (primer 3).

**Sila na vodnik.** Električni tok so naboji v gibanju. Če seštejemo sile na vse nosilce naboja v ravnem kosu žice dolžine $l$, dobimo

$$F = I l B \sin\alpha$$

kjer je $\alpha$ kot med žico in $\vec B$. Smer spet pokaže desna roka, s prsti v smeri toka.

Tudi tok sam ustvarja magnetno polje. Ravni vodnik s tokom $I$ ima okrog sebe krožne silnice z $B = \frac{\mu_0 I}{2\pi r}$, kjer je $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{T\,m/A}$ (simulacija »Polje ravnega vodnika«). Vsak od dveh vzporednih vodnikov je v polju drugega. Desna roka pokaže, da pri tokovih v isto smer sila na vsakega kaže proti drugemu, zato se vodnika privlačita. Na tej sili je bila dolgo zgrajena definicija ampera.

**Strategija za tekmovalne naloge.** (1) Najprej z desno roko določi smer sile in pazi na predznak naboja. (2) Hitrost razstavi na del vzdolž $\vec B$ in del pravokotno nanj. (3) Poišči, katera sila je sila proti središču, in zapiši enačbo kroženja. (4) Pri delcu, ki ga pospeši napetost, hitrost dobiš iz energije, ker magnetno polje dela ne opravi. (5) Če polje zavzema le del prostora, nariši krožnico: njeno središče leži na pravokotnici na hitrost v točki vstopa, za polmer $r$ stran. Iz skice nato razbereš, kje in pod katerim kotom delec izstopi.

## Rešeni primeri

### Primer 1: tehtnica v zlatarni

Natančna tehtnica uravnoveša težo s silo na tuljavo v reži magneta. V polju je skupaj $4{,}0\,\mathrm{m}$ žice (vsi ovoji), pravokotno na polje z gostoto $0{,}50\,\mathrm{T}$. Ko zlatar na ploščico položi prstan, mora tehtnica povečati tok za $25\,\mathrm{mA}$, da ploščica ostane na mestu. Kolikšna je masa prstana? Koliko je prstan vreden, če zlatar odkupuje zlato po $60$ € za gram?

**Podatki:** $l = 4{,}0\,\mathrm{m}$, $B = 0{,}50\,\mathrm{T}$, $\Delta I = 25\,\mathrm{mA}$, $\alpha = 90^\circ$, cena $60$ €/g, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** maso prstana $m$ in njegovo vrednost

:::formula
Sila na vodnik $F = \Delta I\, l B$, ravnovesje $F = m g$
:::

**Rešitev:**

1. Dodatna magnetna sila mora uravnovesiti le težo prstana, zato štejemo samo povečanje toka: $\Delta I = 0{,}025\,\mathrm{A}$.
2. Sila: $F = 0{,}025 \cdot 4{,}0 \cdot 0{,}50\,\mathrm{N} = 0{,}050\,\mathrm{N}$.
3. Masa: $m = \frac{F}{g} = \frac{0{,}050\,\mathrm{N}}{9{,}81\,\mathrm{m/s^2}} = 5{,}10 \cdot 10^{-3}\,\mathrm{kg} = 5{,}10\,\mathrm{g}$.
4. Vrednost: $5{,}10 \cdot 60 = 306$ €.
5. Odgovor: prstan ima maso $5{,}10\,\mathrm{g}$ in je vreden približno $306$ €.

### Primer 2: Thomsonov elektron

Elektron iz mirovanja pospešimo z napetostjo $2{,}0\,\mathrm{kV}$. Nato vleti pravokotno na silnice v magnetno polje z gostoto $2{,}0\,\mathrm{mT}$. Kolikšen je polmer njegovega tira?

**Podatki:** $U = 2{,}0\,\mathrm{kV} = 2000\,\mathrm{V}$, $B = 2{,}0\,\mathrm{mT} = 0{,}0020\,\mathrm{T}$, $\alpha = 90^\circ$, $e = 1{,}602 \cdot 10^{-19}\,\mathrm{As}$, $m_e = 9{,}109 \cdot 10^{-31}\,\mathrm{kg}$
**Iščemo:** polmer tira $r$

:::formula
$e U = \frac{1}{2} m_e v^2$, nato $r = \frac{m_e v}{e B}$
:::

**Rešitev:**

1. Hitrost dobimo iz energije, ker delo opravi le električno polje: $v = \sqrt{\frac{2eU}{m_e}} = 2{,}65 \cdot 10^7\,\mathrm{m/s}$.
2. Magnetna sila je sila proti središču: $r = \frac{m_e v}{e B} = \frac{9{,}109 \cdot 10^{-31} \cdot 2{,}65 \cdot 10^{7}}{1{,}602 \cdot 10^{-19} \cdot 0{,}0020}\,\mathrm{m} = 0{,}075\,\mathrm{m}$.
3. Odgovor: elektron kroži po krožnici s polmerom približno $7{,}5\,\mathrm{cm}$.

### Primer 3: ponarejena zlata palica

Volfram ima skoraj enako gostoto kot zlato, zato ponaredka s tehtanjem ne odkriješ. Laboratorij vzorec iz palice ionizira. Ioni z nabojem $+e$ gredo skozi izbiralnik hitrosti z $E = 2{,}0 \cdot 10^4\,\mathrm{V/m}$ in $B_1 = 0{,}20\,\mathrm{T}$. Nato vletijo pravokotno v polje $B_2 = 0{,}50\,\mathrm{T}$, opišejo polkrog in zadenejo detektor. Ion zlata ima maso $197\,\mathrm{u}$, ion volframa $184\,\mathrm{u}$. Kako daleč narazen sta sledi zlata in volframa?

**Podatki:** $q = e = 1{,}602 \cdot 10^{-19}\,\mathrm{As}$, $E = 2{,}0 \cdot 10^4\,\mathrm{V/m}$, $B_1 = 0{,}20\,\mathrm{T}$, $B_2 = 0{,}50\,\mathrm{T}$, $m_\mathrm{Au} = 197\,\mathrm{u}$, $m_\mathrm{W} = 184\,\mathrm{u}$, $1\,\mathrm{u} = 1{,}661 \cdot 10^{-27}\,\mathrm{kg}$
**Iščemo:** razdaljo $\Delta d$ med sledema

:::formula
$v = \frac{E}{B_1}$, sled je za premer od vhoda: $d = 2r = \frac{2 m v}{e B_2}$
:::

**Rešitev:**

1. Izbiralnik prepusti samo ione z $v = \frac{E}{B_1} = \frac{2{,}0 \cdot 10^4}{0{,}20}\,\mathrm{m/s} = 1{,}0 \cdot 10^5\,\mathrm{m/s}$. Hitrost je enaka za oba iona.
2. Zlato: $d_\mathrm{Au} = \frac{2 \cdot 197 \cdot 1{,}661 \cdot 10^{-27} \cdot 1{,}0 \cdot 10^5}{1{,}602 \cdot 10^{-19} \cdot 0{,}50}\,\mathrm{m} = 0{,}817\,\mathrm{m}$.
3. Ker je $d$ sorazmeren z maso, je razlika $\Delta d = \frac{2\,\Delta m\, v}{e B_2}$ z $\Delta m = 13\,\mathrm{u}$.
4. $\Delta d = \frac{2 \cdot 13 \cdot 1{,}661 \cdot 10^{-27} \cdot 1{,}0 \cdot 10^5}{1{,}602 \cdot 10^{-19} \cdot 0{,}50}\,\mathrm{m} = 0{,}054\,\mathrm{m}$.
5. Odgovor: sledi sta približno $5{,}4\,\mathrm{cm}$ narazen (zlato pri $81{,}7\,\mathrm{cm}$, volfram pri $76{,}3\,\mathrm{cm}$). Druga sled razkrije ponaredek.

### Primer 4 – zdaj ti: delec iz Sonca

Proton s hitrostjo $1{,}0 \cdot 10^6\,\mathrm{m/s}$ vleti v polje z gostoto $0{,}10\,\mathrm{T}$ pod kotom $30^\circ$ glede na silnice. Kolikšna sta polmer in korak njegove vijačnice?

**Podatki:** $v = 1{,}0 \cdot 10^6\,\mathrm{m/s}$, $B = 0{,}10\,\mathrm{T}$, $\alpha = 30^\circ$, $e = 1{,}602 \cdot 10^{-19}\,\mathrm{As}$, $m_p = 1{,}673 \cdot 10^{-27}\,\mathrm{kg}$
**Iščemo:** polmer $r$ in korak $h$

:::formula
$r = \frac{m_p v_\perp}{e B}$, $t_0 = \frac{2\pi m_p}{e B}$, $h = v_\parallel t_0$
:::

**Rešitev:**

1. Razstavimo hitrost: $v_\perp = v \sin 30^\circ = 5{,}0 \cdot 10^5\,\mathrm{m/s}$ in $v_\parallel = v \cos 30^\circ = 8{,}66 \cdot 10^5\,\mathrm{m/s}$.
2. Kroženje povzroča le $v_\perp$: $r = \frac{1{,}673 \cdot 10^{-27} \cdot 5{,}0 \cdot 10^{5}}{1{,}602 \cdot 10^{-19} \cdot 0{,}10}\,\mathrm{m} = 0{,}052\,\mathrm{m}$.
3. Izračunaj sam obhodni čas $t_0$ in korak $h$, nato preveri:

:::premisli
Koliko sta $t_0$ in $h$?
---
$t_0 = \frac{2\pi \cdot 1{,}673 \cdot 10^{-27}}{1{,}602 \cdot 10^{-19} \cdot 0{,}10}\,\mathrm{s} = 6{,}56 \cdot 10^{-7}\,\mathrm{s}$, nato $h = v_\parallel t_0 = 8{,}66 \cdot 10^5 \cdot 6{,}56 \cdot 10^{-7}\,\mathrm{m} = 0{,}57\,\mathrm{m}$. Vijačnica ima polmer $5{,}2\,\mathrm{cm}$ in korak $57\,\mathrm{cm}$.
:::

## Pogoste napake

- **»Sila kaže vzdolž silnic.«** Tako je pri električnem polju, ne pri magnetnem. Magnetna sila je pravokotna na $\vec B$ in na $\vec v$. Kdor riše silo vzdolž silnic, dobi napačno smer odklona.
- **»Magnetno polje delec pospeši.«** Ker je sila pravokotna na hitrost, ne opravi dela. Spremeni se smer hitrosti, velikost ne. Hitrost v nalogi vedno dobiš iz napetosti ali je dana.
- **Pozabljen predznak naboja.** Desna roka da smer sile na pozitiven naboj. Elektron zavije na drugo stran. Iz smeri ukrivljenja zato sklepaš na predznak naboja.
- **»Hitrejši delec hitreje obkroži.«** Večja hitrost pomeni večji krog, obhodni čas $t_0 = \frac{2\pi m}{qB}$ pa ostane enak.
- **Cela hitrost namesto komponente.** Pri poševnem vstopu v polmer vstaviš $v_\perp = v\sin\alpha$, kjer je $\alpha$ kot do silnic. Kosinus da komponento vzdolž polja, ki kroženju ne prispeva ničesar.

## Povzetek

- Lorentzova sila $\vec F = q\,\vec v \times \vec B$, velikost $F = qvB\sin\alpha$; je pravokotna na $\vec v$ in $\vec B$. Smer z desno roko, za negativen naboj nasprotna.
- Magnetna sila ne opravi dela: velikost hitrosti se ne spremeni.
- Pri $\vec v \perp \vec B$ naboj kroži: $r = \frac{mv}{qB}$, $t_0 = \frac{2\pi m}{qB}$ (neodvisen od hitrosti).
- Poševno: vijačnica, $r = \frac{m v\sin\alpha}{qB}$, korak $h = v\cos\alpha \cdot t_0$.
- Izbiralnik hitrosti: $v = \frac{E}{B}$; masni spektrometer loči ione po $r \propto m$.
- Sila na vodnik $F = IlB\sin\alpha$; polje ravnega vodnika $B = \frac{\mu_0 I}{2\pi r}$.

## Drugače: Kot zgodba

Dva iona, eden zlata in eden volframa, zapustita isto razpršeno zrno ponarejene palice. Napetost ju požene naprej skupaj z množico drugih ionov, vsakega z nekoliko drugačno hitrostjo. Na vhodu v spektrometer jih čaka izbiralnik hitrosti. Električno polje vleče ione na eno stran, magnetno na drugo. Skozi režo pride samo ion, pri katerem sta potega enaka, torej ion s hitrostjo $v = \frac{E}{B_1}$. Naša iona imata ravno to hitrost in prideta skozi. Hitrejši in počasnejši ioni končajo na zaslonki.

Za režo je samo še magnetno polje. Nobeden od ionov ne pospeši in ne zavre, oba pa začneta zavijati. Sila je pri obeh enaka, $evB_2$, ker imata enak naboj in enako hitrost. Zlato je težje, zato se spremembi smeri bolj upira in opiše širši polkrog. Volfram zavije ostreje. Po polovici kroga oba zadeneta detektor, a $5{,}4\,\mathrm{cm}$ narazen. Laborant vidi dve sledi namesto ene in ve, da palica ni iz čistega zlata.

## Drugače: Korak za korakom s številkami

Proton s hitrostjo $v = 2{,}0 \cdot 10^6\,\mathrm{m/s}$ vleti pravokotno v polje $B = 0{,}50\,\mathrm{T}$.

1. Sila: $F = e v B = 1{,}602 \cdot 10^{-19} \cdot 2{,}0 \cdot 10^{6} \cdot 0{,}50\,\mathrm{N} = 1{,}602 \cdot 10^{-13}\,\mathrm{N}$.
2. Polmer: $r = \frac{m_p v}{eB} = \frac{1{,}673 \cdot 10^{-27} \cdot 2{,}0 \cdot 10^{6}}{1{,}602 \cdot 10^{-19} \cdot 0{,}50}\,\mathrm{m} = 0{,}0418\,\mathrm{m}$, torej $4{,}2\,\mathrm{cm}$.
3. Obhodni čas: $t_0 = \frac{2\pi r}{v} = \frac{2\pi \cdot 0{,}0418}{2{,}0 \cdot 10^{6}}\,\mathrm{s} = 1{,}31 \cdot 10^{-7}\,\mathrm{s}$.
4. Podvojimo hitrost na $4{,}0 \cdot 10^6\,\mathrm{m/s}$: sila se podvoji, polmer se podvoji na $8{,}4\,\mathrm{cm}$.
5. Obhodni čas: obseg je dvakrat daljši, hitrost dvakrat večja, zato ostane $1{,}31 \cdot 10^{-7}\,\mathrm{s}$.

## Preveri se

? Naboj se giblje v homogenem magnetnem polju. Katera izjava o magnetni sili nanj ne drži?
- Sila je pravokotna na hitrost naboja.
~ To velja: Lorentzova sila je vektorski produkt, zato je pravokotna na $\vec v$.
- Sila je pravokotna na silnice polja.
~ To velja: magnetna sila nikoli ne kaže vzdolž silnic, to je razlika od električne sile.
+ Sila poveča kinetično energijo naboja.
- Obhodni čas kroženja ni odvisen od hitrosti.
~ To velja: $t_0 = \frac{2\pi m}{qB}$ ne vsebuje $v$. Hitrejši delec opiše večji krog v enakem času.
> Magnetna sila je ves čas pravokotna na hitrost, zato ne opravi dela in kinetična energija ostane enaka.

? Delec vleti z leve v magnetno polje, ki kaže v zaslon. Z risbe odčitaj, kam zavije njegov tir. Kaj iz tega sledi?
:::risba skica
opis: Delec vleti z leve v območje, kjer magnetno polje kaže v zaslon (znaki ×). Na vstopu se giblje v desno, nato se njegov tir ukrivi navzdol.
območje: 0; 0 .. 8; 5
enota: 38
napis: 3; 0,5 | × | sredina
napis: 5; 0,5 | × | sredina
napis: 7; 0,5 | × | sredina
napis: 3; 2,5 | × | sredina
napis: 5; 2,5 | × | sredina
napis: 7; 2,5 | × | sredina
napis: 3; 4,5 | × | sredina
napis: 5; 4,5 | × | sredina
napis: 7; 4,5 | × | sredina
črta: 2; 0 -> 2; 5 | siva črtkano
črta: 0; 4 -> 2; 4 -> 2,65; 3,91 -> 3,25; 3,67 -> 3,77; 3,27 -> 4,17; 2,75 -> 4,41; 2,15 -> 4,5; 1,5 | modra debelo
puščica: 0,3; 4,6 -> 1,5; 4,6 | v | nad
:::
- Delec je pozitiven.
~ Za pozitiven naboj desna roka (prsti v desno, pokrčeni v zaslon) da silo navzgor. Tir gre navzdol, torej je naboj nasprotnega predznaka.
+ Delec je negativen.
- Delec je nevtralen.
~ Na nevtralen delec magnetno polje ne deluje, zato bi letel naravnost.
- Iz risbe se ne da sklepati, ker ne poznamo hitrosti.
~ Velikost hitrosti vpliva le na polmer. Smer ukrivljenja določata smer hitrosti in predznak naboja.
> Sila na pozitiven naboj bi kazala navzgor. Tir zavija navzdol, zato je naboj negativen, na primer elektron.

? Razvrsti korake, s katerimi masni spektrometer določi maso iona.
1. Ione pospešiš z električno napetostjo.
2. Izbiralnik hitrosti prepusti samo ione s hitrostjo $v = \frac{E}{B_1}$.
3. Ioni v polju $B_2$ opišejo polkrog in zadenejo detektor.
4. Izmeriš razdaljo $d$ od vhoda do sledi.
5. Izračunaš maso $m = \frac{e B_2 d}{2 v}$.
> Brez izbiralnika bi imeli ioni različne hitrosti in razdalja $d$ ne bi bila odvisna le od mase. Masa sledi iz $d = 2r = \frac{2mv}{eB_2}$.

? Tehtnica v trgovini z začimbami ima v reži magneta $3{,}0\,\mathrm{m}$ žice, pravokotno na polje $0{,}40\,\mathrm{T}$. Ko na ploščico stresejo žafran, se tok poveča za $50\,\mathrm{mA}$. Koliko gramov žafrana je na tehtnici? ($g = 9{,}81\,\mathrm{m/s^2}$)
= 6,1 g | 0,1
~ 6116 | Miliamperov nisi pretvoril v ampere: $50\,\mathrm{mA} = 0{,}050\,\mathrm{A}$.
~ 0,06 | To je sila v newtonih. Maso dobiš z $m = \frac{F}{g}$ in jo pretvoriš v grame.
~ 60 | Silo $0{,}060\,\mathrm{N}$ si zapisal kot $0{,}060\,\mathrm{kg}$. Deliti moraš še z $g$.
> $F = \Delta I\, l B = 0{,}050 \cdot 3{,}0 \cdot 0{,}40\,\mathrm{N} = 0{,}060\,\mathrm{N}$, $m = \frac{F}{g} = 6{,}1 \cdot 10^{-3}\,\mathrm{kg} = 6{,}1\,\mathrm{g}$.

? Elektron s hitrostjo $4{,}0 \cdot 10^6\,\mathrm{m/s}$ vleti v polje $1{,}0\,\mathrm{mT}$ pod kotom $30^\circ$ glede na silnice. Dijak računa polmer vijačnice. Kateri korak je napačen?

**Korak 1:** Sila je pravokotna na hitrost, zato se velikost hitrosti ne spreminja.
**Korak 2:** Kroženje povzroča komponenta $v_\perp = v\cos 30^\circ$.
**Korak 3:** Polmer je $r = \frac{m_e v_\perp}{e B}$.
- Korak 1
~ Korak 1 drži: magnetna sila ne opravi dela, zato je velikost hitrosti stalna.
+ Korak 2
- Korak 3
~ Korak 3 drži: magnetna sila $e v_\perp B$ je sila proti središču, iz tega sledi ta polmer.
> Kot je merjen od silnic, zato je pravokotna komponenta $v_\perp = v\sin 30^\circ = 2{,}0 \cdot 10^6\,\mathrm{m/s}$. S kosinusom bi dijak dobil komponento vzdolž polja. Pravilni polmer je $1{,}1\,\mathrm{cm}$.

<<RACUN
vrednost: 0.025*4.0*0.50 | 0.05
vrednost: 0.050/9.81*1000 | 5.10
vrednost: 5.10*60 | 306
vrednost: sqrt(2*1.602e-19*2000/9.109e-31) | 2.65e7
vrednost: 9.109e-31*2.65e7/(1.602e-19*0.0020) | 0.075
vrednost: 2.0e4/0.20 | 1.0e5
vrednost: 2*197*1.661e-27*1.0e5/(1.602e-19*0.50) | 0.817
vrednost: 2*13*1.661e-27*1.0e5/(1.602e-19*0.50) | 0.054
vrednost: 0.817-0.054 | 0.763
vrednost: 1.0e6*cos(30°) | 8.66e5
vrednost: 1.673e-27*5.0e5/(1.602e-19*0.10) | 0.052
vrednost: 2*pi*1.673e-27/(1.602e-19*0.10) | 6.56e-7
vrednost: 8.66e5*6.56e-7 | 0.57
vrednost: 1.602e-19*2.0e6*0.50 | 1.602e-13
vrednost: 1.673e-27*2.0e6/(1.602e-19*0.50) | 0.0418
vrednost: 2*pi*0.0418/2.0e6 | 1.31e-7
vrednost: 0.050*3.0*0.40/9.81*1000 | 6.1
vrednost: 9.109e-31*2.0e6/(1.602e-19*1.0e-3) | 0.011
>>

:::simboli
\vec F | Lorentzova sila (vektor) | \vec F = q\,\vec v \times \vec B | N
F | velikost magnetne sile | F = q v B \sin\alpha | N
q | električni naboj delca | | As
\vec v, v | hitrost delca | | m/s
\vec B, B | gostota magnetnega polja | | T
\alpha | kot med hitrostjo (ali žico) in silnicami | | °
r | polmer kroženja | r = \frac{m v}{q B} | m | pri vodniku: razdalja od žice
m | masa delca | | kg
t_0 | obhodni čas | t_0 = \frac{2\pi m}{q B} | s | neodvisen od hitrosti
v_\perp | komponenta hitrosti pravokotno na silnice | v_\perp = v\sin\alpha | m/s
v_\parallel | komponenta hitrosti vzdolž silnic | v_\parallel = v\cos\alpha | m/s
h | korak vijačnice | h = v_\parallel t_0 | m
I | električni tok | | A
\Delta I | povečanje toka tehtnice | | A
l | dolžina žice v polju | | m
\mu_0 | indukcijska konstanta | | T\,m/A | $4\pi \cdot 10^{-7}$
g | težni pospešek | | m/s^2
U | pospeševalna napetost | | V
e | osnovni naboj | | As
m_e | masa elektrona | | kg
m_p | masa protona | | kg
E | jakost električnega polja | | V/m
B_1 | gostota polja v izbiralniku hitrosti | | T
B_2 | gostota polja v spektrometru | | T
d | razdalja od vhoda do sledi | d = 2r | m
\Delta d | razdalja med sledema | \Delta d = \frac{2\,\Delta m\, v}{e B_2} | m
\Delta m | razlika mas ionov | | kg
:::
