---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

**Poskus za doma.** Na krožnik položi kocko ledu in ob njo postavi termometer, tako da se ga led dotika. Vsaki dve minuti zapiši temperaturo. Na drug krožnik kani tri kapljice vode in ga pusti na polici.

Kaj opaziš? Led se počasi spreminja v vodo. Termometer v mešanici ledu in vode pa ves čas kaže okoli $0\,^\circ\mathrm{C}$, vse dokler se ne stali zadnji košček. Kapljice na drugem krožniku čez nekaj ur izginejo, čeprav jih nihče ni obrisal.

Kam je šla voda? Zakaj temperatura ne raste, čeprav se led ves čas greje? Isto vprašanje si postavljajo mojstri v delavnici. Pri izdelavi sveč stari vosek stališ v loncu in ga zliješ v model, kjer spet otrdi. Klepar spaja pločevino s staljenim kositrom. Na gradbišču pozimi voda v razpokah zmrzne in razžene beton. Kdor razume, kako snov prehaja iz trdnega v tekoče in plinasto, ve, pri kateri temperaturi delati in česa se varovati.

## Razlaga

**Trdno ob tekočem.** Kocko ledu lahko položiš na mizo, v kozarec ali v skledo, pa ostane kocka. Ko se stali, voda nima več svoje oblike: v kozarcu je visok valj, v skledi plitva luža. Prostornina pa se ne spremeni: $100\,\mathrm{mL}$ vode iz kozarca je tudi v skledi $100\,\mathrm{mL}$.

To je prva razlika. **Trdna snov** ima svojo obliko in svojo prostornino. **Tekočina** ima svojo prostornino, obliko pa dobi od posode.

**Tekoče ob plinastem.** Vedro lahko napolniš z vodo do polovice. Plin tega ne zna. Zrak iz kompresorja se v gumi kolesa razširi do zadnjega kotička. **Plin** nima ne svoje oblike ne svoje prostornine: zavzame ves prostor, ki ga ima.

Trdno, tekoče in plinasto so tri **agregatna stanja** snovi.

| stanje | oblika | prostornina |
|---|---|---|
| trdno (opeka) | svoja | svoja |
| tekoče (lak) | od posode | svoja |
| plinasto (zrak) | od posode | ves prostor |

**Zakaj se razlikujejo: delci.** Vsaka snov je iz zelo drobnih delcev, ki jih ne vidiš niti z mikroskopom. V trdni snovi so delci tesno skupaj in vsak ostane na svojem mestu, le malo niha. V tekočini so še vedno blizu, a drsijo drug ob drugem, zato se tekočina pretaka. V plinu so delci daleč narazen in hitro letijo na vse strani.

V simulaciji spodaj »Agregatna stanja snovi« snov počasi segrevaj. Opazuj, kako se delci gibljejo vedno hitreje, dokler ne zapustijo svojih mest.

:::premisli
Zakaj lahko zrak v zaprti brizgi stisneš skoraj na polovico, vode pa skoraj nič? Odgovori z delci.
---
Med delci zraka so velike praznine, zato jih lahko potisneš bliže skupaj. Delci vode se že skoraj dotikajo, zato ni prostora, kamor bi jih stisnil.
:::

**Spremembe v parih.** Vsaka sprememba stanja ima svojo nasprotno. Prehod iz trdnega v tekoče je **taljenje** (vosek v loncu). Obratni prehod, iz tekočega v trdno, je **strjevanje** (vosek v modelu). Prehod iz tekočega v plinasto je **izparevanje**, obratni prehod iz plinastega v tekoče pa **kondenzacija** (rosa na hladnem oknu).

:::risba skica
opis: Tri škatle od leve proti desni: trdno, tekoče, plinasto. Zgornji puščici kažeta v desno: taljenje (iz trdnega v tekoče) in izparevanje (iz tekočega v plinasto); pri njih snov prejema toploto. Spodnji puščici kažeta v levo: strjevanje (iz tekočega v trdno) in kondenzacija (iz plinastega v tekoče); pri njih snov oddaja toploto.
območje: 0; 0 .. 16; 6
pravokotnik: 0,2; 2 .. 2,6; 4
pravokotnik: 6,8; 2 .. 9,2; 4
pravokotnik: 13,4; 2 .. 15,8; 4
napis: 1,4; 3 | trdno | sredina | debelo
napis: 8; 3 | tekoče | sredina | debelo
napis: 14,6; 3 | plinasto | sredina | debelo
puščica: 2,8; 3,5 -> 6,6; 3,5 | taljenje | nad
puščica: 9,4; 3,5 -> 13,2; 3,5 | izparevanje | nad
puščica: 6,6; 2,5 -> 2,8; 2,5 | strjevanje | pod
puščica: 13,2; 2,5 -> 9,4; 2,5 | kondenzacija | pod
napis: 8; 5,5 | snov prejema toploto → | sredina
napis: 8; 0,5 | ← snov oddaja toploto | sredina
:::

Taljenje in izparevanje potekata, ko snov **prejema toploto**, torej ko jo segrevamo. Strjevanje in kondenzacija potekata, ko snov **oddaja toploto**, torej ko se ohlaja. Zato vosek otrdi v hladnem modelu, para pa se zbere na hladnem oknu.

**Izhlapevanje ob vrenju.** Izparevanje poteka na dva načina. **Izhlapevanje** poteka samo na površini tekočine, in to pri vsaki temperaturi. Tako izginejo kapljice s krožnika in tako se posuši sveže prepleskan zid. **Vrenje** poteka v vsej tekočini hkrati, ko ta doseže določeno temperaturo. Takrat v notranjosti nastajajo mehurčki pare.

**Tališče in vrelišče.** Temperatura, pri kateri se snov tali, je **tališče** $T_\mathrm{t}$. Pri isti temperaturi se ista snov tudi strdi. Temperatura, pri kateri tekočina vre, je **vrelišče** $T_\mathrm{v}$. Vsaka snov ima svoji vrednosti:

| snov | tališče | vrelišče |
|---|---|---|
| voda | $0\,^\circ\mathrm{C}$ | $100\,^\circ\mathrm{C}$ |
| alkohol | $-114\,^\circ\mathrm{C}$ | $78\,^\circ\mathrm{C}$ |
| kositer | $232\,^\circ\mathrm{C}$ | $2602\,^\circ\mathrm{C}$ |
| železo | $1538\,^\circ\mathrm{C}$ | $2862\,^\circ\mathrm{C}$ |

**Temperatura med taljenjem stoji.** Spomni se kocke ledu: dokler se je talila, je termometer kazal $0\,^\circ\mathrm{C}$. Toplota, ki jo snov prejema, se takrat ne porabi za segrevanje. Porabi se za to, da delci zapustijo svoja mesta. Šele ko se stali vse, temperatura spet raste. Enako velja za vrenje. V simulaciji spodaj »Laboratorij: taljenje ledu in vrenje vode« opazuj graf: ima dva vodoravna dela, pri $0\,^\circ\mathrm{C}$ in pri $100\,^\circ\mathrm{C}$.

:::premisli
Voda v loncu že vre. Kuhar plin odpre do konca. Ali bo termometer v vodi pokazal več kot $100\,^\circ\mathrm{C}$? Zakaj?
---
Ne, ostane $100\,^\circ\mathrm{C}$. Dodatna toplota vode ne segreva, ampak jo hitreje spreminja v paro: voda vre bolj burno in prej izpari.
:::

**Masa ostane, prostornina se spremeni.** Ko se $200\,\mathrm{g}$ ledu stali, dobiš $200\,\mathrm{g}$ vode. Delci se ne izgubijo, le drugače se razporedijo. Prostornina pa se malo spremeni. Večina snovi ima v trdnem stanju malo manjšo prostornino kot v tekočem. Voda je posebnost: led ima večjo prostornino kot voda, iz katere je nastal, saj je njegova gostota le $0{,}92\,\mathrm{g/cm^3}$. Zato led plava, zmrzal pa širi razpoke v betonu.

## Rešeni primeri

### Primer 1: spajkanje s kositrom

Klepar spaja pločevino s kositrom. V delavnici je $20\,^\circ\mathrm{C}$, konica spajkalnika ima $300\,^\circ\mathrm{C}$. V katerem stanju je kositer v škatli na mizi in v katerem na konici spajkalnika?

**Podatki:** tališče kositra $T_\mathrm{t} = 232\,^\circ\mathrm{C}$, vrelišče $T_\mathrm{v} = 2602\,^\circ\mathrm{C}$, temperatura mize $20\,^\circ\mathrm{C}$, temperatura konice $300\,^\circ\mathrm{C}$
**Iščemo:** stanje kositra na mizi in na konici

:::formula
Snov je trdna, če je $T$ nižja od $T_\mathrm{t}$; tekoča, če je $T$ med $T_\mathrm{t}$ in $T_\mathrm{v}$; plinasta, če je $T$ višja od $T_\mathrm{v}$.
:::

**Rešitev:**

1. Na mizi: $20\,^\circ\mathrm{C}$ je manj od $232\,^\circ\mathrm{C}$. Kositer je pod tališčem, zato je trden.
2. Na konici: $300\,^\circ\mathrm{C}$ je več od tališča in precej manj od vrelišča $2602\,^\circ\mathrm{C}$, zato je kositer tekoč.
3. Ko klepar odmakne spajkalnik, se kapljica ohladi pod $232\,^\circ\mathrm{C}$ in se strdi. Zato trdno drži pločevino skupaj.
4. Odgovor: na mizi je kositer trden, na konici spajkalnika tekoč.

### Primer 2: sveče iz ostankov voska

Na krožku izdelujete sveče. Ostanke voska s sobno temperaturo $20\,^\circ\mathrm{C}$ segrevate v loncu. Vosek se tali pri približno $60\,^\circ\mathrm{C}$. Za koliko stopinj se mora vosek segreti, da se začne taliti? Kako se imenujeta spremembi stanja v loncu in v modelu?

**Podatki:** začetna temperatura $T_0 = 20\,^\circ\mathrm{C}$, tališče $T_\mathrm{t} = 60\,^\circ\mathrm{C}$
**Iščemo:** dvig temperature $\Delta T$ in imeni obeh sprememb

:::formula
$\Delta T = T_\mathrm{t} - T_0$
:::

**Rešitev:**

1. Iščemo razliko dveh temperatur, zato odštejemo: $\Delta T = 60\,^\circ\mathrm{C} - 20\,^\circ\mathrm{C} = 40\,^\circ\mathrm{C}$.
2. V loncu vosek prejema toploto in iz trdnega postane tekoč. To je **taljenje**.
3. V modelu vosek oddaja toploto hladnemu modelu in zraku, zato iz tekočega postane trden. To je **strjevanje**, ki se zgodi pri istih $60\,^\circ\mathrm{C}$.
4. Odgovor: vosek se mora segreti za $40\,^\circ\mathrm{C}$; v loncu se tali, v modelu se strjuje.

### Primer 3: zmrzal v razpoki betona

Po jesenskem dežju v razpoki betonske stopnice ostane $50\,\mathrm{g}$ vode. Ponoči zmrzne. Za koliko se poveča prostornina? Gostota vode je $1\,\mathrm{g/cm^3}$, gostota ledu $0{,}92\,\mathrm{g/cm^3}$.

**Podatki:** $m = 50\,\mathrm{g}$, $\rho_\mathrm{vode} = 1\,\mathrm{g/cm^3}$, $\rho_\mathrm{ledu} = 0{,}92\,\mathrm{g/cm^3}$
**Iščemo:** povečanje prostornine $\Delta V$

:::formula
$V = \dfrac{m}{\rho}$, nato $\Delta V = V_\mathrm{ledu} - V_\mathrm{vode}$
:::

**Rešitev:**

1. Pri strjevanju se masa ne spremeni, zato ima tudi led $50\,\mathrm{g}$.
2. Prostornina vode: $V_\mathrm{vode} = \dfrac{50\,\mathrm{g}}{1\,\mathrm{g/cm^3}} = 50\,\mathrm{cm^3}$.
3. Prostornina ledu je večja, ker je gostota manjša: $V_\mathrm{ledu} = \dfrac{50\,\mathrm{g}}{0{,}92\,\mathrm{g/cm^3}} \approx 54{,}3\,\mathrm{cm^3}$.
4. Razlika: $\Delta V = 54{,}3\,\mathrm{cm^3} - 50\,\mathrm{cm^3} = 4{,}3\,\mathrm{cm^3}$.
5. Odgovor: prostornina se poveča za približno $4{,}3\,\mathrm{cm^3}$. Led v razpoki nima prostora, zato pritiska na njene stene in jo vsako zimo malo razširi.

### Primer 4 – zdaj ti: neznana kovina

V šolski delavnici učitelj segreva košček sive kovine in vsako minuto zapiše temperaturo.

| čas (min) | temperatura ($^\circ\mathrm{C}$) |
|---|---|
| 0 | 200 |
| 1 | 216 |
| 2 | 232 |
| 3 | 232 |
| 4 | 232 |
| 5 | 232 |
| 6 | 245 |

Kaj se s kovino dogaja od 2. do 5. minute? Katera kovina iz tabele tališč je to? Za koliko se je segrela, preden se je to začelo?

**Podatki:** meritve v tabeli zgoraj, začetna temperatura $T_0 = 200\,^\circ\mathrm{C}$, tabela tališč iz razlage
**Iščemo:** spremembo stanja, ime kovine, dvig temperature $\Delta T$

:::formula
Med taljenjem temperatura stoji na tališču $T_\mathrm{t}$; dvig do tališča je $\Delta T = T_\mathrm{t} - T_0$.
:::

**Rešitev:**

1. Od 2. do 5. minute temperatura stoji, čeprav kovino še segrevamo. Toplota se porabi za spremembo stanja: kovina se tali.
2. Tališče je torej $T_\mathrm{t} = 232\,^\circ\mathrm{C}$.
3. Zdaj ti: poišči kovino v tabeli in izračunaj $\Delta T$. Nato preveri.

:::premisli
Katera kovina je to in za koliko se je segrela do začetka taljenja?
---
Tališče $232\,^\circ\mathrm{C}$ ima kositer. Dvig: $\Delta T = 232\,^\circ\mathrm{C} - 200\,^\circ\mathrm{C} = 32\,^\circ\mathrm{C}$. Po 5. minuti je ves kositer tekoč, zato temperatura spet raste.
:::

## Pogoste napake

- **»Med taljenjem se temperatura dviga.«** Učenec misli, da segrevanje vedno pomeni višjo temperaturo. Med taljenjem pa gre vsa toplota v spremembo stanja, zato temperatura stoji na tališču. Pravilno: dokler se snov tali ali vre, ima stalno temperaturo; graf ima tam vodoraven del.
- **»Kapljice na hladni steklenici pricurljajo iz nje.«** Kapljice so zunaj, zato se zdi, da so prišle skozi steklo. Steklo pa vode ne prepušča: kapljice se naberejo tudi na prazni hladni steklenici. Pravilno: nevidna vodna para iz zraka se na hladnem steklu kondenzira.
- **»Voda izpareva šele pri $100\,^\circ\mathrm{C}$.«** Pri $100\,^\circ\mathrm{C}$ voda vre. Izhlapeva pa pri vsaki temperaturi, le počasneje. Zato se perilo posuši tudi pozimi.
- **»Led ima enako prostornino kot voda, iz katere je nastal.«** Masa se res ohrani, prostornina pa ne. Pravilno: led ima manjšo gostoto, zato zavzame več prostora; prostornino izračunaš z $V = \dfrac{m}{\rho}$, ne z množenjem.
- **»Kovine se ne talijo.«** V vsakdanjem življenju kovine vidimo le trdne. Tudi kovine se talijo, le tališča imajo pogosto visoka. Kositer se stali že pri $232\,^\circ\mathrm{C}$, zato ga ne smeš taliti v posodi iz kositra.

## Povzetek

- Agregatna stanja: trdno (svoja oblika in prostornina), tekoče (svoja prostornina, oblika od posode), plinasto (zavzame ves prostor).
- Delci: v trdni snovi tesno skupaj na svojih mestih, v tekočini blizu in drsijo, v plinu daleč narazen.
- Taljenje (trdno → tekoče) in izparevanje (tekoče → plinasto): snov prejema toploto. Strjevanje in kondenzacija sta obratna prehoda: snov oddaja toploto.
- Izparevanje: izhlapevanje na površini pri vsaki temperaturi, vrenje v vsej tekočini pri vrelišču.
- Tališče = temperatura taljenja in strjevanja. Voda: tališče $0\,^\circ\mathrm{C}$, vrelišče $100\,^\circ\mathrm{C}$.
- Med taljenjem in vrenjem temperatura stoji. Masa se pri spremembi stanja ohrani, prostornina ne (led ima večjo prostornino kot voda).

## Drugače: Na sliki

Nariši si delce kot kroglice v treh enakih škatlah.

:::risba skica
opis: Tri škatle z delci. Leva, trdno: devet kroglic v pravilni mreži, tesno skupaj. Srednja, tekoče: devet kroglic blizu skupaj na dnu, brez reda. Desna, plinasto: štiri kroglice daleč narazen po vsej škatli.
območje: 0; -1 .. 15; 4
pravokotnik: 0,5; 0 .. 4; 3,5
pravokotnik: 5,75; 0 .. 9,25; 3,5
pravokotnik: 11; 0 .. 14,5; 3,5
krog: 1,5; 0,5 | 0,35 | polno
krog: 2,25; 0,5 | 0,35 | polno
krog: 3; 0,5 | 0,35 | polno
krog: 1,5; 1,25 | 0,35 | polno
krog: 2,25; 1,25 | 0,35 | polno
krog: 3; 1,25 | 0,35 | polno
krog: 1,5; 2 | 0,35 | polno
krog: 2,25; 2 | 0,35 | polno
krog: 3; 2 | 0,35 | polno
krog: 6,3; 0,45 | 0,35 | polno
krog: 7,1; 0,4 | 0,35 | polno
krog: 7,9; 0,5 | 0,35 | polno
krog: 8,7; 0,45 | 0,35 | polno
krog: 6,7; 1,15 | 0,35 | polno
krog: 7,55; 1,2 | 0,35 | polno
krog: 8,35; 1,1 | 0,35 | polno
krog: 6,4; 1,85 | 0,35 | polno
krog: 7,6; 1,95 | 0,35 | polno
krog: 11,6; 2,9 | 0,35 | polno
krog: 13,7; 2,4 | 0,35 | polno
krog: 12,3; 0,7 | 0,35 | polno
krog: 13,9; 0,5 | 0,35 | polno
napis: 2,25; -0,5 | trdno | sredina
napis: 7,5; -0,5 | tekoče | sredina
napis: 12,75; -0,5 | plinasto | sredina
:::

- **Trdno:** kroglice so v redu, tesno skupaj. Če škatlo nagneš, se ne premaknejo.
- **Tekoče:** kroglic je enako, tudi razmiki so skoraj enaki, a ni reda. Ob nagibu zdrsnejo na nižjo stran, zato tekočina dobi obliko posode.
- **Plinasto:** kroglice so redke in letijo po vsej škatli. Zato plin zapolni ves prostor in ga lahko stisneš.

Taljenje na tej sliki pomeni, da kroglice izgubijo red. Izparevanje pomeni, da se odtrgajo od drugih in odletijo.

## Drugače: Iz vsakdanjega življenja

Vse štiri spremembe se dogajajo v tvojem domu:

- **Taljenje:** maslo v vroči ponvi, sladoled na soncu.
- **Strjevanje:** voda v posodici za led v zamrzovalniku, vosek, ki kapne s sveče na mizo.
- **Izparevanje:** perilo se posuši na vrvi (izhlapevanje), voda v loncu za testenine (vrenje).
- **Kondenzacija:** ogledalo v kopalnici se po tuširanju orosi, zjutraj je na travi rosa.

Še past: bel »oblak« nad loncem ni vodna para. Para je plin in je nevidna; vidiš jo le kot prazen prostor tik nad gladino. Oblak so drobne kapljice, ki so nastale, ko se je para v hladnejšem zraku kondenzirala.

## Preveri se

? Pri kateri spremembi stanja snov oddaja toploto in iz tekočine postane trdna?
- taljenje
~ Taljenje gre v obratno smer, iz trdnega v tekoče, in pri njem snov toploto prejema.
- kondenzacija
~ Pri kondenzaciji snov res oddaja toploto, a iz plina nastane tekočina, ne trdna snov.
+ strjevanje
- izparevanje
~ Pri izparevanju iz tekočine nastane plin, snov pa toploto prejema.
> Strjevanje je prehod iz tekočega v trdno. Snov pri tem oddaja toploto, kot vosek v hladnem modelu.

? Graf kaže, kako se je spreminjala temperatura voska, ki smo ga ves čas enakomerno segrevali. Z grafa odčitaj, pri kateri temperaturi se vosek tali.
:::risba graf
opis: Graf temperature voska v odvisnosti od časa. Od 0. do 4. minute temperatura raste od 20 do 60 stopinj Celzija, od 4. do 10. minute ostane 60 stopinj, od 10. do 14. minute raste do 90 stopinj.
x: 0 .. 14 | 2 | čas (min)
y: 0 .. 100 | 20 | temperatura (°C)
črta: 0; 20 -> 4; 60 -> 10; 60 -> 14; 90 | modra
:::
= 60 °C | 2
~ 6 | Šest minut traja taljenje (od 4. do 10. minute). Vprašanje sprašuje po temperaturi, ki jo bereš na navpični osi.
~ 90 | To je temperatura na koncu, ko je ves vosek že tekoč in se spet segreva.
> Vodoravni del grafa leži pri $60\,^\circ\mathrm{C}$. Tam temperatura stoji, ker vsa toplota gre v taljenje.

? Steklenico limonade vzameš iz hladilnika. Čez nekaj minut je od zunaj vsa mokra. Zakaj?
- Limonada pronica skozi drobne luknjice v steklu.
~ Steklo vode ne prepušča. Kapljice se naberejo tudi na prazni hladni steklenici.
+ Vodna para iz zraka se na hladnem steklu ohladi in kondenzira v kapljice.
- Na steklenici se tali led iz hladilnika.
~ Steklenica ni bila zaledenela. Kapljice nastanejo iz nevidne vodne pare v zraku.
> V zraku je vedno nekaj nevidne vodne pare. Ob hladnem steklu odda toploto in se kondenzira.

? Plastenko s $500\,\mathrm{mL}$ vode ($500\,\mathrm{g}$) daš v zamrzovalnik. Oceni, kolikšno prostornino bo imel led. Gostota ledu je $0{,}92\,\mathrm{g/cm^3}$. Velja $1\,\mathrm{mL} = 1\,\mathrm{cm^3}$.
= 543 mL | 10
~ 500 | Masa ostane $500\,\mathrm{g}$, prostornina pa ne. Led ima manjšo gostoto, zato zavzame več prostora.
~ 460 | Množil si maso z gostoto. Prostornino dobiš z deljenjem: $V = \dfrac{m}{\rho}$.
> $V = \dfrac{500\,\mathrm{g}}{0{,}92\,\mathrm{g/cm^3}} \approx 543\,\mathrm{cm^3}$, torej približno $543\,\mathrm{mL}$. Zato zaprta polna steklenica v zamrzovalniku lahko poči.

? Na krožku bi rad stalil kositer (tališče $232\,^\circ\mathrm{C}$) in ga zlil v kalup. V kateri posodi ga lahko tališ?
- v posodi iz kositra
~ Tudi kovine se talijo. Posoda iz kositra bi se stalila skupaj s kositrom v njej.
- v plastični posodi, ki se zmehča pri približno $150\,^\circ\mathrm{C}$
~ Plastika bi se zmehčala in stalila, še preden bi kositer dosegel tališče.
+ v železni posodi
> Posoda mora imeti tališče precej višje od $232\,^\circ\mathrm{C}$. Železo se tali šele pri $1538\,^\circ\mathrm{C}$.

<<RACUN
vrednost: 60-20 | 40
vrednost: 50/1 | 50
vrednost: 50/0.92 | 54.3
vrednost: 54.3-50 | 4.3
vrednost: 232-200 | 32
vrednost: 500/0.92 | 543.5
enote: 500*mL | 500*cm^3
>>

:::simboli
T | temperatura snovi | | °C
T_\mathrm{t} | tališče | | °C | tudi temperatura strjevanja
T_\mathrm{v} | vrelišče | | °C | voda: $100\,^\circ\mathrm{C}$
T_0 | začetna temperatura | | °C
\Delta T | dvig temperature | \Delta T = T_\mathrm{t} - T_0 | °C
m | masa | | g | pri spremembi stanja se ne spremeni
\rho | gostota | \rho = \dfrac{m}{V} | g/cm^3
V | prostornina | V = \dfrac{m}{\rho} | cm^3
V_\mathrm{vode} | prostornina vode | V_\mathrm{vode} = \dfrac{m}{\rho_\mathrm{vode}} | cm^3
V_\mathrm{ledu} | prostornina ledu | V_\mathrm{ledu} = \dfrac{m}{\rho_\mathrm{ledu}} | cm^3
\Delta V | povečanje prostornine | \Delta V = V_\mathrm{ledu} - V_\mathrm{vode} | cm^3
:::
