---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tilen pripravlja predstavitev za biologijo. Krvni obtok je narisal kot zemljevid podzemne železnice: srce je glavna postaja, žile so proge, organi so končne postaje. Vse arterije je pobarval rdeče, ker »nosijo kri s kisikom«, vse vene pa modro.

Njegova sestra Eva je medicinska sestra. Pogleda zemljevid in reče: »Ena rdeča proga je napačna. Pa tudi ena modra.« Tilen ima do jutri čas, da najde obe napaki.

Da jih najde, mora vedeti, kam kri potuje, kaj vozi in kako je zgrajeno »omrežje«. Isto znanje potrebuješ, da razumeš krvni tlak, srčni infarkt ali nasvet, naj se na dolgem letu sprehodiš po letalu.

## Razlaga

**Mamljiva, a napačna ideja.** Večina ljudi misli: arterija je žila s kisikom bogato krvjo, vena pa žila s kisikom revno krvjo. To velja za večino žil, ne pa za vse. Žile ne poimenujemo po tem, kaj vozijo, ampak po **smeri**:

- **arterija** (odvodnica) vodi kri **od srca**,
- **vena** (dovodnica) vodi kri **k srcu**,
- **kapilare** (lasnice) so najtanjše žile med njimi; skozi njihovo steno se izmenjujejo snovi.

**Srce.** Srce je votla mišica s štirimi votlinami. Zgoraj sta **preddvora**, ki kri sprejemata, spodaj **prekata**, ki kri potiskata v arterije. Desna in leva polovica srca sta popolnoma ločeni. **Srčne zaklopke** med preddvorom in prekatom ter na izhodu v arteriji se odpirajo le v eno smer, zato kri ne teče nazaj. Krčenje imenujemo **sistola**, sproščanje **diastola**. Ritem daje **sinusni vozel** v steni desnega preddvora, zato srce bije samo od sebe, tudi brez ukaza živcev.

**Dvojni krvni obtok.** Ko kri enkrat obide celo telo, gre dvakrat skozi srce, zato govorimo o dveh krogih:

- **mali (pljučni) obtok**: desni prekat → pljučna arterija → kapilare v pljučih → pljučne vene → levi preddvor;
- **veliki (telesni) obtok**: levi prekat → aorta → arterije → kapilare v organih → vene → zgornja in spodnja votla vena → desni preddvor.

:::risba skica
opis: Shema dvojnega krvnega obtoka. Levo je desna polovica srca, desno leva polovica srca. Iz desne polovice gre pljučna arterija s kisikom revno krvjo navzgor v pljuča, iz pljuč se pljučne vene s kisikom bogato krvjo vrnejo v levo polovico. Iz leve polovice gre aorta s kisikom bogato krvjo navzdol v telo, iz telesa se votli veni s kisikom revno krvjo vrneta v desno polovico. Puščice s kisikom revno krvjo so črtkane.
območje: 0; 0 .. 10; 10
enota: 30
pravokotnik: 3; 8 .. 7; 9,6 | siva
napis: 5; 8,8 | pljuča | sredina
pravokotnik: 3; 0,4 .. 7; 2 | siva
napis: 5; 1,2 | telo | sredina
pravokotnik: 1,5; 4 .. 4,5; 6 | modra
napis: 3; 5 | desno srce | sredina
pravokotnik: 5,5; 4 .. 8,5; 6 | rdeča
napis: 7; 5 | levo srce | sredina
puščica: 3,5; 6 -> 3,5; 8 | pljučna arterija | levo | modra črtkano
puščica: 6,5; 8 -> 6,5; 6 | pljučne vene | desno | rdeča
puščica: 6,5; 4 -> 6,5; 2 | aorta | desno | rdeča
puščica: 3,5; 2 -> 3,5; 4 | votli veni | levo | modra črtkano
napis: 5; 7 | mali obtok | sredina
napis: 5; 3 | veliki obtok | sredina
podnapis: Polne puščice: kri z veliko kisika. Črtkane puščice: kri z malo kisika.
:::

:::premisli
Kje kri dobi kisik? Iz tega sklepaj, katero rdečo in katero modro progo mora Tilen prebarvati. Nato preveri na shemi.
---
Pljučno arterijo mora prebarvati v modro: je arterija (od srca), a vozi kri z malo kisika v pljuča. Pljučne vene pa v rdeče: so vene (k srcu), a vozijo kri, ki se je v pljučih nasitila s kisikom.
:::

**Žile.** Tri vrste žil se razlikujejo po zgradbi, ker opravljajo različno delo.

| Žila | Stena | Tlak | Posebnost |
|---|---|---|---|
| arterija | debela, mišična, prožna | visok | utrip (pulz) |
| kapilara | ena plast celic | nizek | izmenjava snovi |
| vena | tanjša, manj mišic | najnižji | zaklopke |

Kri v venah nog se vrača navzgor, čeprav je tlak majhen. Pomagajo **zaklopke**, ki se odprejo le proti srcu, in skeletne mišice, ki pri hoji stiskajo vene. Tekočina, ki iz kapilar uide med celice, se vrne v kri po **limfnih žilah**.

V simulaciji spodaj »Arterije, vene, kapilare« razvrsti lastnosti k žilam. Opazi, katere lastnosti so povezane s tlakom in katere z izmenjavo snovi.

:::premisli
Oba prekata v vsakem utripu iztisneta enako prostornino krvi. Zakaj ima levi prekat približno trikrat debelejšo steno od desnega?
---
Levi prekat potiska kri po vsem telesu, do prstov na nogah in skozi milijone kapilar, zato mora ustvariti mnogo višji tlak. Desni jo potiska le do bližnjih pljuč, za kar zadošča nižji tlak.
:::

**Sestava krvi.** Odrasel človek ima okoli $5\,\mathrm{L}$ krvi. Približno $55\,\%$ je **krvna plazma**: voda z raztopljenimi beljakovinami, glukozo, solmi, hormoni, sečnino in ogljikovim dioksidom. Preostanek so **krvni delci**, ki nastajajo v rdečem kostnem mozgu:

- **rdeče krvničke (eritrociti)** nimajo jedra, so polne **hemoglobina**, ki z železom veže kisik; v $1\,\mathrm{mm^3}$ krvi jih je okoli 5 milijonov;
- **bele krvničke (levkociti)** imajo jedro in branijo telo pred mikrobi;
- **krvne ploščice (trombociti)** so delci celic; ob rani sprožijo **strjevanje krvi**, pri katerem se topna beljakovina plazme fibrinogen spremeni v mrežo fibrina in nastane strdek.

**Bolezni srca in ožilja.** Srčno mišico oskrbujejo **venčne (koronarne) arterije**. Pri **aterosklerozi** se v steno arterij nalagajo maščobne obloge, žila se zoži in otrdi. Če strdek zamaši venčno arterijo, del srčne mišice ostane brez kisika in odmre: to je **srčni infarkt**. Če se žila v možganih zamaši ali poči, nastane **možganska kap**.

**Povišan krvni tlak** (trajno $140/90\,\mathrm{mmHg}$ ali več; normalno okoli $120/80$; prva številka je tlak med sistolo, druga med diastolo) obremenjuje srce in žile. Pri dolgem mirovanju, na primer na dolgem letu, lahko v veni noge nastane strdek (**tromboza**). Tveganje večajo kajenje, premalo gibanja, preveč mastne in slane hrane ter sladkorna bolezen.

**Transport pri drugih živalih.** Pri enoceličarjih, trdoživu in ploskih črvih snovi do celic pridejo z difuzijo, ker so vse celice blizu površine. Večje živali potrebujejo obtočila.

| Skupina | Obtočilo | Srce |
|---|---|---|
| členonožci, večina mehkužcev | odprto: hemolimfa obliva organe | cevasto (členonožci); s preddvori in prekatom (mehkužci) |
| deževnik, glavonožci | zaprto | deževnik: 5 parov žil, ki se krčijo; glavonožci: 3 srca |
| ribe | zaprto, enojni obtok | 1 preddvor, 1 prekat |
| dvoživke, večina plazilcev | zaprto, dvojni obtok | 2 preddvora, 1 prekat (pri plazilcih delno pregrajen) |
| ptiči, sesalci | zaprto, dvojni obtok | 2 preddvora, 2 prekata |

Riba ima enojni obtok: kri gre v enem obhodu le enkrat skozi srce. Iz srca gre skozi škržne kapilare, kjer izgubi večino tlaka, in šele nato v telo, zato ima v telesu nizek tlak. Popolna pregrada pri ptičih in sesalcih loči kri z veliko in malo kisika, kar omogoča hitro presnovo in stalno telesno temperaturo.

## Rešeni primeri

### Primer 1: pot po zemljevidu

Kapljica krvi je v kapilarah palca leve noge. Kako najkrajše pride do kapilar v desni roki? Naštej postaje.

**Podatki:** začetek: kapilare v levi nogi; cilj: kapilare v desni roki
**Iščemo:** zaporedje žil in srčnih votlin

:::formula
Pravilo poti: kapilare → vena → preddvor → prekat → arterija → kapilare. Telo in pljuča se izmenjujeta.
:::

**Rešitev:**

1. Iz kapilar v nogi kri odteče v vene noge in spodnjo votlo veno, ker vene vodijo k srcu.
2. Prispe v desni preddvor, nato v desni prekat.
3. Desni prekat jo potisne v pljučno arterijo in v kapilare pljuč, kjer odda $\mathrm{CO_2}$ in sprejme kisik.
4. Po pljučnih venah se vrne v levi preddvor in levi prekat.
5. Levi prekat jo potisne v aorto, od tam v arterijo desne roke in v kapilare roke.
6. Odgovor: kri mora skozi srce dvakrat, vmes skozi pljuča; neposredne poti iz noge v roko ni.

### Primer 2: hoja v hrib na počitnicah

Tilen na počitnicah v Julijskih Alpah hodi v strm hrib. Pri miru mu srce utripne $70$-krat na minuto in v enem utripu levi prekat iztisne $70\,\mathrm{mL}$ krvi. Med vzponom je srčna frekvenca $150$ na minuto, utripni volumen pa $100\,\mathrm{mL}$. Kolikokrat več krvi na minuto prečrpa levi prekat med vzponom?

**Podatki:** $f_1 = 70\,\mathrm{min^{-1}}$, $V_\mathrm{u1} = 70\,\mathrm{mL}$, $f_2 = 150\,\mathrm{min^{-1}}$, $V_\mathrm{u2} = 100\,\mathrm{mL}$
**Iščemo:** minutna volumna $Q_1$ in $Q_2$ ter njuno razmerje

:::formula
Minutni volumen srca: $Q = f \cdot V_\mathrm{u}$
:::

**Rešitev:**

1. Pri miru: $Q_1 = 70 \cdot 70\,\mathrm{mL} = 4900\,\mathrm{mL}$ na minuto, to je $4{,}9\,\mathrm{L/min}$.
2. Med vzponom: $Q_2 = 150 \cdot 100\,\mathrm{mL} = 15000\,\mathrm{mL}$ na minuto, to je $15\,\mathrm{L/min}$.
3. Razmerje: $\dfrac{15000}{4900} \approx 3{,}1$. Srce poveča oboje, frekvenco in utripni volumen, ker mišice porabijo več kisika.
4. Odgovor: med vzponom levi prekat prečrpa približno trikrat več krvi na minuto kot pri miru.

### Primer 3: avtocesta in lokalne ceste

Levi prekat prečrpa $4{,}8\,\mathrm{L}$ krvi na minuto. Vsa ta kri gre skozi aorto s presekom $2{,}5\,\mathrm{cm^2}$, nato pa se razdeli med kapilare, ki imajo skupaj presek okoli $2500\,\mathrm{cm^2}$. Kolikšna je hitrost krvi v aorti in kolikšna v kapilarah?

**Podatki:** $Q = 4{,}8\,\mathrm{L/min}$, $A_\mathrm{a} = 2{,}5\,\mathrm{cm^2}$, $A_\mathrm{k} = 2500\,\mathrm{cm^2}$
**Iščemo:** hitrosti $v_\mathrm{a}$ in $v_\mathrm{k}$ ter njuno razmerje

:::formula
$v = \dfrac{Q}{A}$: v vsaki sekundi skozi vse kapilare skupaj steče toliko krvi kot skozi aorto.
:::

**Rešitev:**

1. Pretvorimo pretok: $4{,}8\,\mathrm{L} = 4800\,\mathrm{cm^3}$, deljeno s $60\,\mathrm{s}$ je $Q = 80\,\mathrm{cm^3/s}$.
2. V aorti: $v_\mathrm{a} = \dfrac{80}{2{,}5} = 32$, torej $32\,\mathrm{cm/s}$.
3. Izračunaj sam hitrost v kapilarah in razmerje, nato preveri:

:::premisli
Koliko je $v_\mathrm{k}$ in kolikokrat počasneje kot v aorti teče kri v kapilarah?
---
$v_\mathrm{k} = \dfrac{80}{2500} = 0{,}032\,\mathrm{cm/s}$, to je $0{,}32\,\mathrm{mm/s}$. Razmerje $\dfrac{32}{0{,}032} = 1000$: v kapilarah kri teče tisočkrat počasneje. Kot pri avtocesti, ki se razcepi na tisoče lokalnih cest: vsaka cesta je ozka, a skupaj so mnogo širše. Počasen tok da čas za izmenjavo snovi.
:::

## Pogoste napake

- **»Arterije vozijo kri s kisikom, vene brez.«** Tako sklepaš, ker to velja v velikem obtoku. Ime pa pove smer: pljučna arterija vozi kri z malo kisika, pljučne vene kri z veliko kisika.
- **»Venska kri je modra.«** Žile pod kožo so videti modrikaste zaradi kože in svetlobe. Kri z malo kisika je temno rdeča.
- **»V ozkih kapilarah kri teče najhitreje, kot voda iz stisnjene cevi.«** Ena kapilara je ozka, vseh skupaj pa je toliko, da je njihov skupni presek največji. Zato je tok tam najpočasnejši.
- **»Srce prečrpa dvakrat več krvi, ker ima dva prekata.«** Prekata delujeta v dveh zaporednih krogih. Vsak prečrpa enako prostornino, minutni volumen je količina iz enega prekata.
- **»Kri iz telesa gre naravnost spet v telo.«** Pri sesalcih gre kri iz telesa vedno najprej v desno srce in v pljuča.

## Povzetek

- Arterije vodijo kri od srca, vene k srcu, v kapilarah se izmenjujejo snovi. Izjema pri kisiku: pljučna arterija in pljučne vene.
- Srce ima 2 preddvora in 2 prekata; zaklopke preprečijo povratni tok; ritem daje sinusni vozel.
- Dvojni obtok: mali (desni prekat, pljuča, levi preddvor) in veliki (levi prekat, aorta, telo, votli veni, desni preddvor).
- Kri: plazma okoli $55\,\%$; eritrociti s hemoglobinom prenašajo kisik, levkociti branijo, trombociti sprožijo strjevanje.
- Minutni volumen $Q = f \cdot V_\mathrm{u}$, pri miru okoli $5\,\mathrm{L/min}$. V kapilarah kri teče najpočasneje, ker je skupni presek največji.
- Bolezni: ateroskleroza, srčni infarkt, možganska kap, povišan tlak, tromboza.
- Živali: difuzija pri majhnih, odprto obtočilo pri členonožcih, zaprto pri deževniku in vretenčarjih; ribe imajo enojni obtok, ptiči in sesalci štiridelno srce.

## Drugače: Kot zgodba

Rdeča krvnička Rina začne pot v kapilari palca na nogi. Hemoglobin v njej je že oddal večino kisika, zato je temnejša.

Po venah se počasi dviga, zaklopke ji ne dovolijo zdrsniti nazaj. Spodnja votla vena jo pripelje v desni preddvor, od tam pade v desni prekat. Ta se skrči in Rina odleti v pljučno arterijo, edino arterijo, kjer potuje »prazna«.

V pljučni kapilari se mora stisniti v vrsto. Tam nekaj trenutkov počiva ob tanki steni pljučnega mehurčka: odda $\mathrm{CO_2}$, kisik se veže na hemoglobin. Svetlo rdeča se po pljučni veni vrne v levi preddvor in levi prekat. Najmočnejši sunek jo izstreli v aorto, kjer drvi s hitrostjo več deset centimetrov na sekundo.

Na razcepih izbira vedno manjše proge, dokler spet ne pride v kapilaro. Tam odda kisik celicam. V približno minuti je obšla oba kroga. V svojih 120 dneh življenja bo to ponovila več kot stotisočkrat.

## Drugače: Korak za korakom s številkami

Koliko dela opravi srce med letom, ki traja $12\,\mathrm{h}$? Potnik ima pri miru srčno frekvenco $70$ na minuto in minutni volumen $4{,}9\,\mathrm{L/min}$, krvi ima $5\,\mathrm{L}$.

1. Čas v minutah: $12 \cdot 60 = 720$ minut.
2. Število utripov: $70 \cdot 720 = 50400$.
3. Prečrpana kri iz levega prekata: $4{,}9 \cdot 720 = 3528$, torej $3528\,\mathrm{L}$.
4. Kolikokrat obkroži vsa kri: $\dfrac{3528}{5} = 705{,}6$, torej okoli $700$-krat.
5. En obhod traja $\dfrac{5}{4{,}9} \approx 1{,}02$ minute, približno minuto.

Ves ta čas mora venska kri iz nog navzgor. Ko potnik sedi, mišice nog ne stiskajo ven, tok se upočasni in lahko nastane strdek. Zato je kratek sprehod po letalu vsakih nekaj ur smiseln.

## Preveri se

? Kateri izraz ne spada v skupino?
- eritrocit
~ Eritrocit je krvni delec, nastane v kostnem mozgu, tako kot levkocit in trombocit.
- trombocit
~ Trombocit je res le delec celice, a vseeno spada med krvne delce iz kostnega mozga.
+ krvna plazma
- levkocit
~ Levkocit je krvni delec z jedrom; spada v isto skupino kot eritrocit.
> Eritrociti, levkociti in trombociti so krvni delci (okoli $45\,\%$ krvi). Plazma je tekoči del krvi, v katerem plavajo.

? Srce utripne $80$-krat na minuto, utripni volumen levega prekata je $60\,\mathrm{mL}$. Koliko krvi prečrpa levi prekat v eni minuti?
- $9{,}6\,\mathrm{L}$
~ Tako dobiš, če štejeta oba prekata. Vsak prečrpa enako prostornino v svojem krogu; minutni volumen je iz enega prekata.
+ $4{,}8\,\mathrm{L}$
- $1{,}3\,\mathrm{L}$
~ To je $80 : 60$. Minutni volumen je zmnožek frekvence in utripnega volumna, ne količnik.
- $140\,\mathrm{mL}$
~ To je vsota $80 + 60$. Vsak od $80$ utripov iztisne $60\,\mathrm{mL}$, zato množiš.
> $Q = f \cdot V_\mathrm{u} = 80 \cdot 60\,\mathrm{mL} = 4800\,\mathrm{mL} = 4{,}8\,\mathrm{L}$ na minuto.

? Ateroskleroza močno zoži venčno arterijo. Kaj je neposredna posledica?
- Kri se v pljučih ne more nasititi s kisikom.
~ Venčne arterije ne gredo skozi pljuča; oskrbujejo srčno mišico.
+ Del srčne mišice dobi premalo kisika; ob popolni zamašitvi odmre (srčni infarkt).
- Skozi zoženo žilo kri teče hitreje, zato srčna mišica dobi več kisika.
~ Zožitev poveča upor in zmanjša pretok; mišica za žilo dobi manj krvi, ne več.
- Srce začne črpati kri v nasprotno smer.
~ Smer toka določajo zaklopke; ateroskleroza nanje ne vpliva tako.
> Venčne arterije prinašajo kri srčni mišici. Zožitev zmanjša pretok, zamašitev povzroči infarkt.

? Tilen opiše pot krvi: (1) levi prekat potisne kri v aorto; (2) kri pride v kapilare noge; (3) iz noge se po veni vrne v levi preddvor; (4) iz desnega prekata gre v pljučno arterijo. Kateri korak je napačen?
- korak 1
~ Levi prekat res potiska kri v aorto, začetek velikega obtoka.
- korak 2
~ Aorta se razveji v arterije in kapilare vseh organov, tudi noge.
+ korak 3
- korak 4
~ Desni prekat res potiska kri v pljučno arterijo, začetek malega obtoka.
> Kri iz telesa se po votlih venah vrne v **desni** preddvor. V levi preddvor pride kri iz pljuč.

? Ana leti $11$ ur v Tokio. Zdravnica ji svetuje, naj se vsake toliko sprehodi po letalu in razgiba stopala. Zakaj?
- Ker se na višini zmanjša količina krvi v telesu.
~ Prostornina krvi se med letom ne zmanjša; težava je počasen tok v venah.
- Ker hoja poveča število eritrocitov.
~ Število eritrocitov se v nekaj urah ne spremeni; hoja deluje na tok krvi.
+ Ker mišice nog stiskajo vene in pomagajo krvi proti srcu; pri dolgem sedenju se tok upočasni in lahko nastane strdek.
- Ker arterije nog brez hoje nimajo utripa.
~ Arterije imajo utrip zaradi srca, tudi ko sediš.
> Venski tlak je nizek. Krčenje mišic in zaklopke vračajo kri k srcu; mirovanje upočasni tok in poveča tveganje za trombozo.

:::simboli
Q | minutni volumen srca (pretok krvi) | Q = f \cdot V_\mathrm{u} | L/min | prostornina iz enega prekata v minuti
f | srčna frekvenca | | min^{-1} | utripi na minuto
V_\mathrm{u} | utripni volumen | V_\mathrm{u} = \frac{Q}{f} | mL | iztisne ga prekat v enem utripu
f_1, f_2 | srčna frekvenca pri miru in med vzponom | | min^{-1}
V_\mathrm{u1}, V_\mathrm{u2} | utripni volumen pri miru in med vzponom | | mL
Q_1, Q_2 | minutni volumen pri miru in med vzponom | | L/min
v | hitrost krvi | v = \frac{Q}{A} | cm/s
A | prečni presek žil | A = \frac{Q}{v} | cm^2 | pri kapilarah vseh skupaj
v_\mathrm{a} | hitrost krvi v aorti | v_\mathrm{a} = \frac{Q}{A_\mathrm{a}} | cm/s
v_\mathrm{k} | hitrost krvi v kapilarah | v_\mathrm{k} = \frac{Q}{A_\mathrm{k}} | cm/s
A_\mathrm{a} | presek aorte | | cm^2
A_\mathrm{k} | skupni presek vseh kapilar | | cm^2
:::

<<RACUN
vrednost: 70*70 | 4900
vrednost: 150*100 | 15000
vrednost: 15000/4900 | 3.06
vrednost: 4800/60 | 80
vrednost: 80/2.5 | 32
vrednost: 80/2500 | 0.032
vrednost: 32/0.032 | 1000
enote: 0.032*cm/s | 0.32*mm/s
vrednost: 80*60 | 4800
vrednost: 12*60 | 720
vrednost: 70*720 | 50400
vrednost: 4.9*720 | 3528
vrednost: 3528/5 | 705.6
vrednost: 5/4.9 | 1.02
>>
