---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tina je tekačica na smučeh. Trener jo za tri tedne pošlje na priprave na $2000\,\mathrm{m}$ nadmorske višine in ji razloži: »Tam je zrak redkejši, ledvice bodo izločale več hormona eritropoetina (EPO), kostni mozeg bo naredil več rdečih krvničk in na tekmi v dolini boš imela več kisika v mišicah.«

Tina, ki študira biologijo, se ustavi pri prvem koraku. Ledvične celice imajo isto DNA kot kožne in gen za EPO so imele že v dolini. Kako celica »zve«, da je kisika malo, in naredi več ene same beljakovine, ne da bi se gen spremenil?

Odgovor je **uravnavanje izražanja genov**: celica ne odloča, katere gene ima, ampak katere in koliko jih **prepiše**. Ista logika razloži, zakaj bakterija po kozarcu mleka začne razgrajevati laktozo.

## Razlaga

**Mamljiva napačna ideja.** Ko primerjamo nevron, mišično celico in eritroblast (predhodnico rdeče krvničke), je skušnjava velika: »Tako različne so, torej imajo različne gene.« Poskusi so pokazali drugače: jedro telesne celice, preneseno v jajčece brez jedra, je dalo cel organizem (ovca Dolly). Jedro odrasle celice torej še vedno nosi navodila za vse tipe celic.

Popravek se glasi: **skoraj vse celice organizma imajo enak genom, razlikujejo se v tem, katere gene izražajo.** Gen je **izražen**, ko se prepiše v RNA in (pri večini genov) prevede v beljakovino. **Konstitutivni** (hišni) geni, npr. za ribosomske beljakovine, so prepisani ves čas. **Uravnavani** geni se prižgejo le v določenem tkivu ali ob signalu.

Celica lahko uravnava tudi pozneje (razgradnjo mRNA, prevajanje, aktivnost beljakovine), a glavno stikalo je **prepisovanje**: neprepisan gen ne porabi ničesar ne za mRNA ne za beljakovino.

**Druga mamljiva ideja: snov sama prižge gen.** *E. coli* razgrajuje laktozo le, kadar laktozo ima. Zdi se, kot da bi se laktoza vezala na DNA in jo »odklenila«. V resnici med snovjo in genom vedno stoji **uravnalna beljakovina**, ki se veže na točno določeno zaporedje DNA. Laktoza (natančneje njen izomer alolaktoza) samo spremeni obliko te beljakovine.

**Operon.** Pri bakterijah so geni za encime iste presnovne poti pogosto zloženi skupaj in se prepišejo skupaj. **Operon** je enota prokariontske DNA iz promotorja, operatorja in enega ali več **strukturnih genov** (genov za beljakovine, tu encime). Strukturni geni se z istega promotorja prepišejo v eno mRNA, zato se vklapljajo in izklapljajo skupaj. Za *lac* operon si nariši vrsto na DNA:

```
[lacI]   ...   [P][O][ lacZ ][ lacY ][ lacA ]
represor        ←──── lac operon ────────→
```

- **promotor (P)**: mesto, kamor se veže RNA-polimeraza,
- **operator (O)**: kratko zaporedje, ki se prekriva s promotorjem; nanj se lahko veže represor,
- **strukturni geni**: *lacZ* (β-galaktozidaza, cepi laktozo na glukozo in galaktozo), *lacY* (permeaza, prenaša laktozo v celico) in *lacA* (transacetilaza).

Vsi trije geni se prepišejo v eno samo, **policistronsko** mRNA. Gen *lacI* (**regulatorni gen**) leži zunaj operona, ima svoj promotor in se prepisuje stalno. Kodira **represor**, beljakovino, ki se veže na operator.

**Negativni nadzor.** Brez laktoze represor sedi na operatorju in RNA-polimeraza ne more prepisovati. Ko pride laktoza, se alolaktoza kot **induktor** veže na represor. Represor spremeni obliko (alosterična sprememba), odpade z operatorja in prepis steče. Več permeaze spusti v celico več laktoze, kar operon še bolj odpre. Ko laktoze zmanjka, se represor vrne na operator; bakterijska mRNA razpade v nekaj minutah, zato se izdelava encimov hitro ustavi.

Natančno: pri **negativnem nadzoru** prepis teče, če uravnalna beljakovina (represor) *ni* vezana na DNA; pri **pozitivnem nadzoru** teče (močno) šele, če je uravnalna beljakovina (aktivator) vezana. Operon je **inducibilen**, če je brez signalne molekule izklopljen in ga njena vezava na represor (**induktor**) vklopi; **represibilen**, če je brez nje vklopljen in ga njena vezava na represor (**korepresor**) izklopi. Inducibilni so tipično operoni za razgradnjo hranila (*lac*), represibilni za sintezo (*trp*).

:::premisli
Mutacija v genu *lacI* povzroči, da represor ne more več vezati operatorja. Napovej, kdaj bo ta bakterija delala β-galaktozidazo.
---
Vedno, z laktozo ali brez nje. Ker nič ne zapre operatorja, je operon stalno prižgan. Takemu mutantu rečemo konstitutivni.
:::

**Cis in trans: dokaz z delnim diploidom.** Jacob in Monod sta v bakterijo vnesla plazmid F' z drugo kopijo *lac* regije (**delni diploid**). Beljakovina, ki difundira (represor), deluje na vse kopije DNA (**trans**); zaporedje DNA (operator, promotor) le na gene na isti molekuli (**cis**). V zapisu genotipa pomeni $^+$ delujoč alel divjega tipa, $^-$ okvarjen alel, poševnica pa loči kromosom od plazmida. Zato:

- $lacI^-\,O^+\,lacZ^+ / \mathrm{F'}\,lacI^+$: represor s plazmida se veže tudi na kromosomski operator, zato je operon spet inducibilen. Mutacija $lacI^-$ je **recesivna**.
- $lacI^+\,O^c\,lacZ^+ / \mathrm{F'}\,lacI^+\,O^+\,lacZ^+$: operator $O^c$ ne veže represorja, zato se *lacZ* na isti molekuli prepisuje stalno, *lacZ* na plazmidu pa ostane uravnavan. Mutacija $O^c$ je **cis-dominantna**.
- $lacI^s$ (represor, ki ne veže induktorja) je **dominantna**: tak represor zasede oba operatorja in ga laktoza ne sname.

**Pozitivni nadzor in glukoza.** Bakterija raje porablja glukozo. Ko glukoze zmanjka, v celici naraste koncentracija **cAMP** (ciklični AMP, majhna signalna molekula, ki sporoča »glukoze ni«). cAMP se veže na aktivatorsko beljakovino **CAP**; kompleks CAP–cAMP se veže tik pred promotor in pomaga RNA-polimerazi, da se trdneje veže. Pojavu, da glukoza zavre prepis operonov za druge sladkorje, rečemo **katabolna represija**; poleg nizkega cAMP k njej prispeva tudi to, da glukoza zavre vstop laktoze. Obe stikali skupaj dasta tabelo:

| Glukoza | Laktoza | Represor / CAP–cAMP | Prepis *lac* |
|---|---|---|---|
| da | ne | na operatorju / ni vezan | skoraj nič |
| ne | ne | na operatorju / vezan | skoraj nič |
| da | da | odpade / ni vezan | šibek |
| ne | da | odpade / vezan | močan |

Laktoza odpre vrata, pomanjkanje glukoze prižge luč.

**Represibilni operon.** Operon *trp* nosi gene za sintezo aminokisline triptofana. Tu je logika obrnjena: represor je sam neaktiven. Ko je triptofana veliko, se triptofan kot **korepresor** veže na represor, ta postane aktiven, sede na operator in prepis ustavi. Operon *trp* je zato represibilen. Celica ne sintetizira tistega, česar ima dovolj.

**Evkarionti: transkripcijski dejavniki.** Tinine ledvične celice operonov nimajo: vsak gen ima svoj promotor in svojo mRNA. RNA-polimeraza II, ki prepisuje gene za beljakovine, se na promotor sama ne veže; potrebuje **splošne transkripcijske dejavnike**; eden od njih prepozna zaporedje TATA v promotorju. Brez njih ni prepisa pri nobenem genu.

Katere gene celica prepiše, odločajo **specifični transkripcijski dejavniki**. To so beljakovine z dvema deloma: **domeno, ki veže DNA** (prepozna kratko zaporedje, pogosto $6$–$10$ baznih parov), in **aktivacijsko domeno**, ki pritegne dele prepisovalnega kompleksa. Vežejo se na uravnalna zaporedja DNA: aktivatorji na **ojačevalce**, represorji na **utiševalce**. Ta zaporedja so lahko tisoče baznih parov stran od gena. DNA se pri tem zvije v zanko, da se vezani dejavnik dotakne kompleksa na promotorju.

Gen ima več vezavnih mest in se prepiše šele ob pravi kombinaciji dejavnikov, ki jo ima le določeno tkivo ob določenem signalu (**kombinacijski nadzor**).

Zdaj lahko odgovorimo Tini. V ledvičnih celicah nastaja transkripcijski dejavnik **HIF**. Ob dovolj kisika ga encim, ki porablja kisik, označi za razgradnjo. Ob pomanjkanju kisika se HIF kopiči, vstopi v jedro in se veže na ojačevalec gena za EPO, ki se zato prepisuje bolj.

:::premisli
Zdravila, ki zavirajo razgradnjo HIF, so namenjena bolnikom s slabokrvnostjo, so pa na seznamu prepovedanih snovi v športu. Zakaj?
---
Ker posnemajo višinske priprave brez višine. HIF se kopiči tudi ob normalni količini kisika, gen za EPO se prepisuje več, nastane več rdečih krvničk in športnik dobi prednost pri vzdržljivosti.
:::

## Rešeni primeri

### Primer 1: kakav po tekmi

Po tekmi Luka, ki laktozo slabo prebavlja, spije kakav z mlekom. V debelem črevesu je za *E. coli* veliko laktoze, glukozo pa so že porabile druge bakterije. V kakšnem stanju sta represor in CAP in kako močno se prepisuje *lac*?

**Podatki:** laktoza je prisotna, glukoze ni
**Iščemo:** stanje represorja, stanje CAP in jakost prepisa

:::formula
Represor odpade z operatorja, kadar ima vezan induktor. CAP–cAMP se veže, kadar glukoze ni.
:::

**Rešitev:**

1. Laktoza vstopi v celico, del se pretvori v alolaktozo, ki se veže na represor; represor odpade z operatorja.
2. Ker ni glukoze, je cAMP veliko; CAP–cAMP se veže pred promotor in pritegne RNA-polimerazo.
3. Obe stikali sta v položaju »prepis«, zato je to zadnja vrstica tabele.
4. Odgovor: represor ni vezan, CAP–cAMP je vezan, *lac* operon se prepisuje močno.

### Primer 2: koliko stane β-galaktozidaza

Gen *lacZ* ima od začetnega do vključno stop kodona $3075$ baznih parov. Ena molekula aminokisline, dodana verigi, stane celico približno $4$ molekule ATP (oziroma GTP). Pri polno prižganem operonu ima celica okoli $3000$ molekul β-galaktozidaze. Koliko aminokislin ima ena veriga in koliko ATP porabi celica samo za te verige?

**Podatki:** dolžina *lacZ* $= 3075\,\mathrm{bp}$ (s stop kodonom), $4$ ATP na aminokislino, $3000$ molekul
**Iščemo:** število aminokislin $n$ in skupno porabo ATP

:::formula
$n = \dfrac{\text{dolžina} - 3}{3}$, poraba $= n \cdot 4 \cdot 3000$
:::

**Rešitev:**

1. Stop kodon ne kodira aminokisline, zato ga odštejemo: $\dfrac{3075 - 3}{3} = 1024$ aminokislin.
2. Ena veriga: $1024 \cdot 4 = 4096$ ATP.
3. Vse molekule: $4096 \cdot 3000 = 12288000$, torej okoli $1{,}2 \cdot 10^7$ ATP.
4. Odgovor: veriga ima $1024$ aminokislin, celica pa za vse molekule porabi okoli $12$ milijonov ATP. Brez laktoze bi bil to čisti odpadek, zato operon drži zaprt.

### Primer 3: kaj je pokvarjeno?

Raziskovalka ima dva mutanta *E. coli*, oba gojena brez glukoze. Mutant A dela β-galaktozidazo z laktozo in brez nje. Mutant B je ne dela niti z laktozo. (a) Kateri del sistema je lahko poškodovan v vsakem? (b) V mutanta A vnese plazmid F' z $lacI^+\,O^+\,lacZ^-$ (plazmidni *lacZ* ne daje delujočega encima). Brez laktoze nastane le še zelo malo β-galaktozidaze, z laktozo veliko. Kje je mutacija v A in kaj bi videla, če bi bila drugje?

**Podatki:** brez glukoze (CAP–cAMP je vezan); A: encim vedno; B: encima nikoli; A + F' $lacI^+\,O^+\,lacZ^-$: encim le z laktozo
**Iščemo:** možne poškodovane dele pri A in B; mesto mutacije v A

:::formula
Prepis teče, kadar operator ni zaprt in se RNA-polimeraza lahko veže na promotor. Represor deluje trans (na vse kopije), operator le cis (na gene na isti molekuli).
:::

**Rešitev:**

1. Pri A operon ostane odprt tudi brez induktorja. Torej represor ne sedi na operatorju.
2. Represor ne nastaja ali ne veže DNA (mutacija $lacI^-$), ali pa je spremenjen operator, ki ga represor ne prepozna ($O^c$).
3. Pri B se operon ne odpre niti z induktorjem. Ena možnost je represor, ki ne veže več alolaktoze ($lacI^s$), zato nikoli ne odpade.
4. Druga možnost pri B je poškodovan promotor ali okvara v samem *lacZ*.
5. (b) Plazmidni *lacZ* je okvarjen, zato vsa β-galaktozidaza prihaja s kromosoma.
6. Če je A $lacI^-$: plazmidni represor difundira (trans) in se veže na kromosomski $O^+$; encim nastaja le z laktozo, kot opaženo.
7. Če bi bil A $O^c$: kromosomskega operatorja noben represor ne prepozna (cis), encim bi nastajal tudi brez laktoze.
8. Odgovor: (a) pri A je poškodovan *lacI* ali operator, pri B represor, ki ne veže induktorja, promotor ali sam *lacZ*. (b) A je recesivni mutant $lacI^-$; pri $O^c$ bi celica s plazmidom ostala konstitutivna.

### Primer 4: zdaj ti

Specifični transkripcijski dejavnik prepozna zaporedje $6$ baznih parov. Človeški genom ima okoli $3{,}1 \cdot 10^9$ baznih parov. Koliko mest bi dejavnik našel po naključju (gledamo eno verigo)? Koliko bi jih bilo, če se gen prepiše le, kadar ob njem sedita dva takšna dejavnika, ki skupaj prepoznata $12$ baznih parov?

**Podatki:** dolžina mesta $6\,\mathrm{bp}$ ali $12\,\mathrm{bp}$, $4$ možne baze, genom $3{,}1 \cdot 10^9\,\mathrm{bp}$
**Iščemo:** število naključnih mest za $6\,\mathrm{bp}$ in za $12\,\mathrm{bp}$

:::formula
verjetnost zaporedja dolžine $k$ je $\dfrac{1}{4^k}$, število mest $\approx \dfrac{3{,}1 \cdot 10^9}{4^k}$
:::

**Rešitev:**

1. $4^6 = 4096$, torej se zaporedje pojavi enkrat na $4096$ baznih parov.
2. $\dfrac{3{,}1 \cdot 10^9}{4096} \approx 7{,}6 \cdot 10^5$ mest za en dejavnik.
3. Za dva dejavnika izračunaj sam, nato preveri:

:::premisli
Koliko je $\dfrac{3{,}1 \cdot 10^9}{4^{12}}$ in kaj to pove o kombinacijskem nadzoru?
---
$4^{12} = 16\,777\,216$, zato je mest okoli $185$. En dejavnik sam bi našel stotisoče mest, par le peščico: kombinacija daje natančnost.
:::

## Pogoste napake

- **»Različne celice imajo različne gene.«** Genom je enak, razlikuje se nabor izraženih genov.
- **»Laktoza se veže na DNA.«** Induktor se veže na represor, ne na operator. DNA prepoznajo le beljakovine.
- **»Laktoza zadošča za polni prepis *lac*.«** Ob glukozi je cAMP nizek, CAP se ne veže in prepis ostane šibek.
- **»Triptofan je induktor *trp* operona.«** Triptofan je korepresor: z njim se represor aktivira in operon zapre. *trp* je represibilen, *lac* inducibilen.
- **»Evkarionti imajo operone.«** Vsak evkariontski gen ima svoj promotor, ojačevalci so lahko daleč od gena.

## Povzetek

- Celice organizma imajo enak genom; razlikujejo se po tem, katere gene izražajo. Konstitutivni (hišni) geni so prepisani stalno, uravnavani le ob signalu.
- Operon (prokarionti): promotor, operator in skupaj prepisani strukturni geni (ena policistronska mRNA). Regulatorni gen leži zunaj operona.
- *lac* (inducibilen): represor na operatorju; alolaktoza ga sname. CAP–cAMP pri pomanjkanju glukoze okrepi prepis. Močan prepis: laktoza da, glukoza ne.
- *trp* (represibilen): triptofan je korepresor, ki represor aktivira.
- Evkarionti: splošni transkripcijski dejavniki (npr. vezava na TATA) so potrebni za vsak prepis; specifični dejavniki (DNA-vezavna in aktivacijska domena) se vežejo na ojačevalce ali utiševalce. Kombinacija dejavnikov določa, kje in kdaj se gen prepiše.
- Primer: pri pomanjkanju kisika se HIF kopiči in poveča prepis gena za EPO.

## Za izpit

Znati moraš povedati:

- definicije: izražanje gena, konstitutivni in uravnavani gen, operon (promotor, operator, strukturni geni, policistronska mRNA), regulatorni gen;
- negativni in pozitivni nadzor, inducibilni (*lac*) in represibilni operon (*trp*);
- vse štiri kombinacije glukoze in laktoze pri *lac* z utemeljitvijo prek represorja in CAP–cAMP;
- sklepanje z delnim diploidom: zakaj je $lacI^-$ recesivna in deluje trans, $O^c$ cis-dominantna, $lacI^s$ dominantna;
- evkariontski nadzor: splošni in specifični transkripcijski dejavniki, ojačevalci in utiševalci, kombinacijski nadzor.

### Naloga 1

V modelu je polni prepis ene kopije *lac* $1$, vezan represor ga zmanjša $1000$-krat, odsotnost CAP–cAMP $50$-krat, učinka se množita. Delni diploid ima na kromosomu $lacI^-\,O^+\,lacZ^+$, na plazmidu F' pa $lacI^+\,O^c\,lacZ^+$ (vsaka kopija je v celici enkrat). (a) Izračunaj skupni prepis *lacZ* v vseh štirih kombinacijah glukoze in laktoze. (b) Kolikšno je razmerje indukcije (z laktozo proti brez nje, oboje brez glukoze) za ta diploid in za divji tip? (c) Divji tip ima ob polni indukciji $3000$ molekul β-galaktozidaze. Koliko jih ima diploid brez glukoze in brez laktoze, če je število molekul sorazmerno prepisu?

**Rešitev:**

1. Represor nastaja le s plazmida ($lacI^+$) in deluje trans: veže se na kromosomski $O^+$, na plazmidni $O^c$ pa ne.
2. Kromosomska kopija je zato uravnavana kot pri divjem tipu, plazmidna čuti le CAP–cAMP.
3. Laktoza da, glukoza ne: $1 + 1 = 2$.
4. Laktoza da, glukoza da: $\dfrac{1}{50} + \dfrac{1}{50} = 0{,}04$.
5. Laktoza ne, glukoza ne: $\dfrac{1}{1000} + 1 = 1{,}001$.
6. Laktoza ne, glukoza da: $\dfrac{1}{50\,000} + \dfrac{1}{50} = 0{,}02002$.
7. Razmerje indukcije: diploid $\dfrac{2}{1{,}001} \approx 2{,}0$; divji tip $\dfrac{1}{0{,}001} = 1000$.
8. Molekule brez laktoze: $3000 \cdot 1{,}001 = 3003$.
9. Odgovor: (a) $2$; $0{,}04$; $1{,}001$; $0{,}02002$. (b) Diploid se inducira le okoli $2$-krat, divji tip $1000$-krat: zaradi cis-dominantnega $O^c$ je diploid praktično konstitutiven. (c) $3003$ molekul, praktično toliko kot divji tip ob polni indukciji.

### Naloga 2

Natančno definiraj negativni nadzor ter inducibilni in represibilni operon. Utemelji, zakaj je mutacija $O^c$ cis-dominantna, mutacija $lacI^-$ pa recesivna. Nato izpelji, kakšen fenotip ima brez glukoze, z laktozo in brez nje, delni diploid $lacI^s\,O^+\,lacZ^+ / \mathrm{F'}\,lacI^+\,O^+\,lacZ^+$, kjer represor $lacI^s$ ne veže induktorja.

**Rešitev:**

1. Negativni nadzor: prepis teče, če represor ni vezan na operator.
2. Inducibilen operon je brez signalne molekule izklopljen, induktor ga prek represorja vklopi (*lac*); represibilen je brez nje vklopljen, korepresor ga prek represorja izklopi (*trp*).
3. $lacI^-$: represor difundira po celici; če ga izdela druga kopija ($lacI^+$), se veže na vse operatorje $O^+$ in fenotip je divji. Mutacija je recesivna, delujoč alel jo popravi v trans.
4. $O^c$: operator je zaporedje DNA in nadzira le gene na isti molekuli. *lacZ* ob $O^c$ se prepisuje ne glede na represor, druga kopija ostane uravnavana: cis-dominantnost.
5. Delni diploid z $lacI^s$: brez laktoze oba represorja zasedeta oba operatorja, prepisa ni.
6. Z laktozo alolaktoza sname normalni represor, represor $lacI^s$ pa je ne veže, ostane aktiven in difundira, zato zasede tudi operator, s katerega je normalni odpadel.
7. Odgovor: delni diploid β-galaktozidaze ne izdeluje ne brez laktoze ne z njo; $lacI^s$ je dominantna nad $lacI^+$ (neinducibilen fenotip).

## Drugače: Korak za korakom s številkami

Poenostavljen model: polni prepis *lac* je $1$, vezan represor ga zmanjša $1000$-krat, odsotnost CAP–cAMP $50$-krat.

1. Laktoza da, glukoza ne: $1$.
2. Laktoza da, glukoza da (manjka CAP): $\dfrac{1}{50} = 0{,}02$.
3. Laktoza ne, glukoza ne (represor): $\dfrac{1}{1000} = 0{,}001$.
4. Laktoza ne, glukoza da (obe oviri): $\dfrac{1}{1000 \cdot 50} = 0{,}00002$.

Skrajni stanji se razlikujeta $50\,000$-krat: represor je stikalo, CAP regulator jakosti. Prave vrednosti se med sevi razlikujejo, vrstni red ne.

## Drugače: Uporaba v stroki

*lac* sistem je najpogostejše stikalo za proizvodnjo rekombinantnih beljakovin v *E. coli*. Gen vstavijo v plazmid za promotor z *lac* operatorjem, bakterije gojijo do želene gostote, nato dodajo **IPTG**: induktor, ki se veže na represor kot alolaktoza, a ga celica ne razgradi.

Pri **modro-belem testu** kloniranja vstavljena DNA prekine plazmidni del *lacZ*: na gojišču z IPTG in X-gal (brezbarvnim substratom, ki ga β-galaktozidaza cepi v modro barvilo) so kolonije brez vstavka modre, z vstavkom bele.

## Preveri se

? Kaj od naštetega ni del *lac* operona?
- promotor
~ Promotor je del operona: z njega se začne skupni prepis.
- operator
~ Operator je del operona; nanj se veže represor.
- gen *lacY*
~ *lacY* je eden od treh strukturnih genov operona; kodira permeazo.
+ gen *lacI*
> *lacI* kodira represor, a leži zunaj operona in ima svoj promotor. Prepisuje se ločeno in stalno.

? Gen *lacY* ima $1254$ baznih parov, vključno s stop kodonom. Koliko aminokislin ima permeaza?
- $418$
~ To je $\dfrac{1254}{3}$: stop kodon si štel kot aminokislino. Ne kodira je.
+ $417$
- $1254$
~ Vsako aminokislino kodirajo trije nukleotidi, zato je treba deliti s $3$.
> $\dfrac{1254 - 3}{3} = 417$ aminokislin.

? Bakterija ima na voljo laktozo in veliko glukoze. Zakaj se *lac* operon prepisuje le šibko?
- Ker glukoza veže represor na operator.
~ Glukoza ne vpliva na represor; ta je ob laktozi z operatorja odstranjen.
+ Ker je cAMP nizek, CAP se ne veže in RNA-polimeraza se slabo veže na promotor.
- Ker laktoza ob glukozi ne more vstopiti v celico.
~ Glukoza vstop laktoze zavre, ne prepreči pa ga: del laktoze vstopi in sname represor. Šibkost izvira iz manjkajoče aktivacije.
> Represor je odstranjen, a manjka pozitivni nadzor: brez CAP–cAMP je vezava RNA-polimeraze šibka.

? Kateri korak opisa indukcije *lac* je napačen? (1) Laktoza vstopi v celico in nastane alolaktoza. (2) Alolaktoza se veže na operator in izrine represor. (3) Operator je prost, RNA-polimeraza prepisuje. (4) Nastane ena mRNA za tri encime.
- korak 1
~ Korak je pravilen: laktoza vstopi s permeazo, del postane alolaktoza.
+ korak 2
- korak 3
~ Brez represorja RNA-polimeraza lahko prepisuje.
- korak 4
~ *lac* mRNA je policistronska in nosi zapis za vse tri beljakovine.
> Alolaktoza se ne veže na DNA, ampak na represor; ta spremeni obliko in odpade z operatorja.

? Po treh tednih višinskih priprav ima Tina več rdečih krvničk. Katera razlaga je pravilna?
- Ledvične celice so na višini pridobile gen za EPO.
~ Gen za EPO je v ledvicah že od začetka; spremeni se le, kako močno se prepisuje.
- Pomanjkanje kisika je povzročilo mutacijo, ki je okrepila gen za EPO.
~ Prilagoditev je povratna in zajame vse ledvične celice; mutacija bi bila naključna in redka.
+ Pri pomanjkanju kisika se HIF ne razgradi, veže se na ojačevalec gena za EPO in poveča njegov prepis.
- Gen za EPO je del operona, ki ga kisik izklopi.
~ Človeški geni niso organizirani v operone; uravnavajo jih transkripcijski dejavniki.
> HIF se ob pomanjkanju kisika ne razgradi in poveča prepis gena za EPO.

:::simboli
n | število aminokislin v beljakovini | n = \dfrac{\text{dolžina} - 3}{3} | – | dolžina kodirnega zaporedja v nukleotidih, s stop kodonom
k | dolžina zaporedja (število nukleotidov) | | – | naključno zaporedje ima verjetnost 1/4ᵏ
:::
