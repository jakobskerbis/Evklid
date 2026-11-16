---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika s starši načrtuje poletno potovanje po ZDA. Na spletnem zemljevidu z vremensko napovedjo ob New Yorku piše $86$, ob San Franciscu $64$, na vrhu gore Mount Washington pa $41$. Je v New Yorku vročina ali je komaj topel dan? Naj v kovček da kratke hlače ali bundo?

Številka sama ne pove dovolj. Vedeti moraš, na kateri **temperaturni lestvici** je zapisana. V ZDA temperaturo merijo v stopinjah Fahrenheita, pri nas v stopinjah Celzija, v znanosti pa pogosto v kelvinih. Ko razumeš, kako termometer deluje in kako se lestvice ujemajo, Nikin problem rešiš v minuti.

Spotoma boš izvedel še nekaj pomembnejšega: kaj temperatura sploh pove o snovi.

## Razlaga

**1. Kaj se dogaja v snovi.** Vsaka snov je zgrajena iz drobnih delcev (atomov in molekul), ki se ves čas gibljejo. V plinu letijo sem in tja, v kapljevini drsijo drug mimo drugega, v trdni snovi nihajo okoli svojih leg.

V simulaciji spodaj (»Gibanje delcev in temperatura«) najprej ohladi snov na $-200\,^\circ\mathrm{C}$, nato jo segrej na $200\,^\circ\mathrm{C}$. Opazuj pikice: pri višji temperaturi se gibljejo opazno hitreje, pri $-200\,^\circ\mathrm{C}$ pa se upočasnijo, a se še vedno ne ustavijo.

To je jedro pojma. **Temperatura** pove, kako hitro se v povprečju gibljejo delci snovi. Natančneje: višja temperatura pomeni večjo povprečno kinetično energijo enega delca.

**2. Notranja energija.** Delci imajo kinetično energijo, ker se gibljejo. Ker se med seboj privlačijo, imajo tudi potencialno energijo. Vsoto vseh teh energij vseh delcev v telesu imenujemo **notranja energija** $W_n$. Merimo jo v joulih.

Ko telo segrejemo, se delci gibljejo hitreje in notranja energija naraste. Spomni se zaviranja s kolesom: zaradi trenja se zavore segrejejo, del kinetične energije kolesa se pretvori v notranjo energijo zavor.

:::premisli
V skodelici je čaj s temperaturo $80\,^\circ\mathrm{C}$, v kadi pa $150$ litrov vode s temperaturo $40\,^\circ\mathrm{C}$. Kaj ima več notranje energije? Napovej, preden pogledaš.
---
Kad. Delci čaja se res gibljejo hitreje, a v kadi je delcev več stokrat toliko. Notranja energija je vsota energij **vseh** delcev, temperatura pa pove le povprečje na en delec.
:::

**3. Kako deluje termometer.** Najbolj znan je tekočinski termometer. V stekleni bučki je obarvan alkohol (v starejših živo srebro), iz nje vodi tanka cevka.

Ko bučko potopiš v toplo vodo, delci vode trkajo ob steklo, steklo pa energijo preda alkoholu. Delci alkohola se začnejo gibati hitreje in se v povprečju razmaknejo. Alkohol se zato **razširi** in stolpec se dvigne po cevki. Ker je cevka tanka, že majhna sprememba prostornine premakne stolpec za opazen kos.

Termometer vedno pokaže **svojo** temperaturo. Temperaturo snovi pokaže šele, ko sta termometer in snov enako topla in se stolpec ustavi. Temu stanju rečemo **toplotno ravnovesje**.

:::premisli
Termometer iz sobe ($20\,^\circ\mathrm{C}$) potisneš v čaj s $70\,^\circ\mathrm{C}$ in ga odčitaš že po dveh sekundah. Bo pokazal več ali manj kot $70\,^\circ\mathrm{C}$? In kaj bi pokazal, če bi ga enako hitro odčital v ledeni vodi?
---
Manj. Alkohol v bučki še ni prejel dovolj energije, da bi se segrel na temperaturo čaja. Stolpec še leze navzgor; odčitaš šele, ko obstane. V ledeni vodi je ravno obratno: alkohol še ni oddal dovolj energije, zato bi termometer pokazal preveč, stolpec pa bi še lezel navzdol.
:::

Poleg tekočinskih poznamo še druge termometre. **Digitalni** ima elektronski senzor, katerega lastnosti se s temperaturo spreminjajo. **Infrardeči** (na primer na čelu) meri nevidno svetlobo, ki jo oddaja površina, in se telesa sploh ne dotakne. **Bimetalni** ima dva sprijeta trakova različnih kovin, ki se pri segrevanju različno raztezata in zato ukrivita kazalec.

**4. Tri lestvice druga ob drugi.** Predstavljaj si tri termometre, postavljene drug ob drugem. Na vsakem je svoja lestvica, a vsi trije kažejo iste dogodke na isti višini:

| Dogodek | Celzij [$^\circ\mathrm{C}$] | Kelvin [$\mathrm{K}$] | Fahrenheit [$^\circ\mathrm{F}$] |
|---|---|---|---|
| absolutna ničla | $-273$ | $0$ | $-459$ |
| voda zmrzne | $0$ | $273$ | $32$ |
| zdravo telo | $37$ | $310$ | $98{,}6$ |
| voda vre | $100$ | $373$ | $212$ |

Preberi tabelo po stolpcih:

- **Celzijeva lestvica** ima dve dogovorjeni točki: led se tali pri $0\,^\circ\mathrm{C}$, voda vre pri $100\,^\circ\mathrm{C}$ (pri normalnem zračnem tlaku). Razdalja med njima je razdeljena na $100$ enakih delov.
- **Kelvinova lestvica** ima enako velike korake kot Celzijeva, le ničla je drugje. Postavljena je v **absolutno ničlo**, približno $-273\,^\circ\mathrm{C}$. To je najnižja možna temperatura, pri kateri bi bilo gibanje delcev najmanjše. Nižje ne gre, zato kelvini nikoli niso negativni. Enota je kelvin, $\mathrm{K}$ (brez stopinj).
- **Fahrenheitova lestvica** ima med zmrziščem in vreliščem vode $212 - 32 = 180$ delov, kar je $1{,}8$-krat več kot Celzijeva. Ena stopinja Celzija je torej $1{,}8$ stopinje Fahrenheita.

**5. Šele zdaj zapis s simboli.** Temperaturo v stopinjah Celzija označimo s $t$, v kelvinih s $T$, v stopinjah Fahrenheita s $t_\mathrm{F}$.

Med Celzijem in kelvinom se premakne le ničla:

$$T = t + 273 \qquad t = T - 273$$

Med Celzijem in Fahrenheitom se spremenita velikost koraka in ničla:

$$t_\mathrm{F} = 1{,}8 \cdot t + 32 \qquad t = \frac{t_\mathrm{F} - 32}{1{,}8}$$

Ker sta kelvin in stopinja Celzija enako velika koraka, je **temperaturna razlika** v obeh enotah enaka: segrevanje za $5\,^\circ\mathrm{C}$ je segrevanje za $5\,\mathrm{K}$.

## Rešeni primeri

### Primer 1: najhladnejši kraj na zemljevidu

Na zemljevidu najnižjih izmerjenih temperatur je označena ruska postaja Vostok na Antarktiki: $-89\,^\circ\mathrm{C}$. Koliko je to v kelvinih?

**Podatki:** $t = -89\,^\circ\mathrm{C}$
**Iščemo:** temperaturo $T$ v kelvinih

:::formula
$T = t + 273$
:::

**Rešitev:**

1. Celzij v kelvine pretvorimo s prištevanjem, ker je ničla Kelvinove lestvice $273$ korakov pod ničlo Celzijeve.
2. $-89 + 273 = 184$
3. Odgovor: na postaji Vostok so izmerili $184\,\mathrm{K}$. Rezultat je pozitiven, kot mora biti v kelvinih.

### Primer 2: Nikina napoved za New York

Vremenska napoved za New York kaže $86\,^\circ\mathrm{F}$. Koliko je to v stopinjah Celzija in kaj naj Nika obleče?

**Podatki:** $t_\mathrm{F} = 86\,^\circ\mathrm{F}$
**Iščemo:** temperaturo $t$ v $^\circ\mathrm{C}$

:::formula
$t = \dfrac{t_\mathrm{F} - 32}{1{,}8}$
:::

**Rešitev:**

1. Najprej odštejemo $32$, ker je zmrzišče vode na Fahrenheitovi lestvici pri $32$, ne pri $0$: $86 - 32 = 54$.
2. Nato delimo z $1{,}8$, ker je stopinja Fahrenheita manjša od stopinje Celzija: $\dfrac{54}{1{,}8} = 30$.
3. Odgovor: v New Yorku bo $30\,^\circ\mathrm{C}$. Kratke hlače, klobuk in steklenica vode.

### Primer 3: let iz Ljubljane v Chicago

Jure zjutraj odleti iz Ljubljane, kjer je $12\,^\circ\mathrm{C}$. Ko pristane v Chicagu, ekran na letališču kaže $23\,^\circ\mathrm{F}$. Za koliko stopinj Celzija je v Chicagu hladneje kot v Ljubljani? Kolikšna je ta razlika v kelvinih?

**Podatki:** $t_1 = 12\,^\circ\mathrm{C}$ (Ljubljana), $t_\mathrm{F} = 23\,^\circ\mathrm{F}$ (Chicago)
**Iščemo:** razliko temperatur $\Delta t$ v $^\circ\mathrm{C}$ in v $\mathrm{K}$

:::formula
$t_2 = \dfrac{t_\mathrm{F} - 32}{1{,}8}$, nato $\Delta t = t_1 - t_2$
:::

**Rešitev:**

1. Obe temperaturi morata biti na isti lestvici, zato Chicago pretvorimo v Celzij: $23 - 32 = -9$.
2. $\dfrac{-9}{1{,}8} = -5$, torej je v Chicagu $t_2 = -5\,^\circ\mathrm{C}$.
3. Razlika: $12 - (-5) = 17$, torej $\Delta t = 17\,^\circ\mathrm{C}$. Pazi na dvojni minus: od pozitivne temperature odštevamo negativno, zato se razlika poveča.
4. Kelvin in stopinja Celzija sta enako velika koraka, zato je razlika tudi $17\,\mathrm{K}$.
5. Odgovor: v Chicagu je za $17\,^\circ\mathrm{C}$ oziroma $17\,\mathrm{K}$ hladneje. (V stopinjah Fahrenheita bi bila razlika večja, $1{,}8 \cdot 17 = 30{,}6$, ker so tam koraki manjši.)

### Primer 4: zdaj ti

Satelit posname zemljevid temperatur površja Julijskih Alp. Na barvni lestvici ob zemljevidu je vrh Triglava označen z $268\,\mathrm{K}$. Koliko je to v stopinjah Celzija? Ali se sneg na vrhu lahko tali?

**Podatki:** $T = 268\,\mathrm{K}$
**Iščemo:** temperaturo $t$ v $^\circ\mathrm{C}$

:::formula
$t = T - 273$
:::

**Rešitev:**

1. Iz kelvinov v Celzij gremo z odštevanjem $273$.
2. Izračunaj sam in presodi, ali se sneg tali, nato preveri:

:::premisli
Koliko je $268 - 273$ in kaj to pomeni za sneg?
---
$t = -5\,^\circ\mathrm{C}$. To je pod zmrziščem vode, zato se sneg na vrhu ne tali.
:::

## Pogoste napake

- **»Bolj vroče telo ima vedno več notranje energije.«** Učenec gleda samo temperaturo. A notranja energija je vsota energij vseh delcev, zato je odvisna tudi od količine snovi. Ledena gora ima več notranje energije kot skodelica vrelega čaja, ker je v njej neprimerno več delcev. Temperatura pove povprečje na en delec, ne vsote.
- **Pri pretvorbi v kelvine odštejemo $273$.** Učenec si zapomni le število $273$, ne pa smeri. Ker je absolutna ničla *pod* ničlo Celzija, so kelvini vedno večje število: $T = t + 273$. Preizkus: negativen rezultat v kelvinih je vedno napačen.
- **Pri Fahrenheitu najprej delimo, šele nato odštejemo.** Tako iz $50\,^\circ\mathrm{F}$ nastane $\dfrac{50}{1{,}8} - 32 \approx -4{,}2\,^\circ\mathrm{C}$, kar je mraz namesto svežega jutra. Pravilno: najprej odštej $32$ (premik ničle), nato deli z $1{,}8$ (velikost koraka): $\dfrac{50 - 32}{1{,}8} = 10\,^\circ\mathrm{C}$.
- **Termometer odčitamo takoj.** Termometer pokaže svojo temperaturo, ne temperature snovi. Šele ko se stolpec ustavi, sta oba v toplotnem ravnovesju.
- **»Pri $0\,^\circ\mathrm{C}$ delci mirujejo.«** Ničla Celzijeve lestvice je le dogovor (zmrzišče vode). Delci se gibljejo tudi pri $-200\,^\circ\mathrm{C}$; najmanjše gibanje imajo šele pri $0\,\mathrm{K}$.

## Povzetek

- Snov je iz delcev, ki se nenehno gibljejo; temperatura pove, kolikšna je povprečna kinetična energija enega delca.
- Notranja energija $W_n$ je vsota kinetičnih in potencialnih energij vseh delcev; odvisna je od temperature in od količine snovi.
- Tekočinski termometer deluje, ker se tekočina pri segrevanju razširi. Odčitaš ga, ko je v toplotnem ravnovesju s snovjo.
- Celzij: $0\,^\circ\mathrm{C}$ zmrzišče, $100\,^\circ\mathrm{C}$ vrelišče vode. Kelvin: ničla v absolutni ničli, $T = t + 273$, nikoli negativen.
- Fahrenheit: $t_\mathrm{F} = 1{,}8 \cdot t + 32$; nazaj najprej odštej $32$, nato deli z $1{,}8$.
- Temperaturna razlika je v $^\circ\mathrm{C}$ in v $\mathrm{K}$ enaka.

## Drugače: Z analogijo

**Temperatura in notranja energija kot promet na avtocesti.** Predstavljaj si delce kot avtomobile na avtocesti. Temperatura je kot **povprečna hitrost** avtomobilov. Notranja energija je kot **skupna energija vseh avtomobilov** skupaj.

Kratek odsek z desetimi hitrimi avtomobili ima visoko povprečno hitrost, a malo skupne energije. Dolga, polna avtocesta z enako hitrimi avtomobili ima enako povprečje, vendar veliko več skupne energije. Tako je s skodelico in kadjo: povprečje (temperatura) ni isto kot vsota (notranja energija).

**Lestvice kot nadmorska višina.** Višino na zemljevidu merimo od morske gladine, ki je dogovorjena ničla. Pod njo so lahko negativne višine (Mrtvo morje leži okoli $-430\,\mathrm{m}$). Tako deluje Celzijeva lestvica: ničla je dogovor, pod njo so negativne temperature.

Kelvinova lestvica je, kot bi višino merili od najglobljega možnega dna, pod katerim ni ničesar več. Nobena točka ni pod njim, zato ni negativnih vrednosti. Koraki (metri oziroma stopinje) pa so v obeh primerih enako veliki.

Fahrenheitova lestvica je kot zemljevid, ki meri v čevljih namesto v metrih in ima ničlo drugje: spremeni se velikost koraka *in* izhodišče.

## Drugače: Iz vsakdanjega življenja

Termometre srečaš povsod, le da jih ne opaziš vedno:

- **Vročinski termometer.** Digitalni pod pazduho piska, ko je dosegel ravnovesje s telesom. Zato ga ne vzameš ven prej.
- **Infrardeči termometer na čelu.** Izmeri v sekundi, ker se mu ni treba segreti: meri nevidno svetlobo, ki jo oddaja koža.
- **Zunanji termometer v avtu.** Na poti v hribe že ob $3\,^\circ\mathrm{C}$ prižge opozorilo za poledico: zrak je še nad ničlo, cestišče, posebej na mostu, pa je lahko hladnejše in tam led nastane prej.
- **Termometer v hladilniku** naj kaže okoli $4\,^\circ\mathrm{C}$, v zamrzovalniku okoli $-18\,^\circ\mathrm{C}$.

Na potovanjih pomaga hitro preverjanje v glavi: v ZDA je $32\,^\circ\mathrm{F}$ mraz (zmrzišče), $50\,^\circ\mathrm{F}$ sveže ($10\,^\circ\mathrm{C}$), $68\,^\circ\mathrm{F}$ prijetno ($20\,^\circ\mathrm{C}$), $86\,^\circ\mathrm{F}$ vroče ($30\,^\circ\mathrm{C}$). Vsakih $10\,^\circ\mathrm{C}$ je $18\,^\circ\mathrm{F}$.

## Preveri se

? Tri izmed naštetih enot merijo temperaturo, ena ne. Katera je vsiljivka?
- kelvin ($\mathrm{K}$)
~ Kelvin je enota Kelvinove lestvice, ki se začne v absolutni ničli.
+ joule ($\mathrm{J}$)
- stopinja Fahrenheita ($^\circ\mathrm{F}$)
~ To je enota za temperaturo, ki jo uporabljajo v ZDA.
- stopinja Celzija ($^\circ\mathrm{C}$)
~ To je enota za temperaturo, ki jo uporabljamo pri nas.
> V joulih merimo energijo, tudi notranjo energijo. Temperatura pa ni energija, ampak pove povprečno kinetično energijo enega delca.

? Zdrav človek ima telesno temperaturo $37\,^\circ\mathrm{C}$. Koliko je to v kelvinih?
- $236\,\mathrm{K}$
~ To je $273 - 37$. Kelvine dobiš s prištevanjem, ker je absolutna ničla pod ničlo Celzija.
- $37\,\mathrm{K}$
~ Korak je enako velik, ničla pa ne. Brez prištevanja $273$ bi bil človek hladnejši od tekočega dušika.
+ $310\,\mathrm{K}$
- $98{,}6\,\mathrm{K}$
~ $98{,}6$ je telesna temperatura v stopinjah Fahrenheita, ne v kelvinih.
> $T = t + 273 = 37 + 273 = 310\,\mathrm{K}$.

? Termometer z alkoholom potopimo v toplo vodo in stolpec se dvigne. Kaj je vzrok?
- Toplota se kot snov nateče v cevko in jo napolni.
~ Toplota ni snov, ki bi tekla v cevko. V cevki je še vedno isti alkohol, le razširil se je.
+ Delci alkohola se gibljejo hitreje in se razmaknejo, zato se alkohol razširi.
- Alkohol začne vreti in mehurčki ga potisnejo navzgor.
~ Alkohol v termometru ne vre; stolpec se dviga enakomerno tudi pri zmernih temperaturah.
> Višja temperatura pomeni hitrejše gibanje delcev, ki so v povprečju bolj narazen. Tekočina se razširi, tanka cevka pa ta majhen raztezek pokaže kot opazen premik stolpca.

? Luka pretvarja $50\,^\circ\mathrm{F}$ v stopinje Celzija. Korak 1: $\dfrac{50}{1{,}8} \approx 27{,}8$. Korak 2: $27{,}8 - 32 = -4{,}2$. Rezultat: $-4{,}2\,^\circ\mathrm{C}$. Kje je napaka?
+ Že v koraku 1: najprej bi moral odšteti $32$, šele nato deliti z $1{,}8$.
- V koraku 2: namesto odštevanja bi moral prišteti $32$.
~ Prištevanje $32$ je korak pri pretvorbi iz Celzija v Fahrenheit, ne obratno. Tu je težava vrstni red.
- Napake ni, $50\,^\circ\mathrm{F}$ je res pod lediščem.
~ Ledišče je pri $32\,^\circ\mathrm{F}$, $50$ je nad njim, zato rezultat ne sme biti negativen.
> $t = \dfrac{50 - 32}{1{,}8} = \dfrac{18}{1{,}8} = 10\,^\circ\mathrm{C}$. Najprej premakneš ničlo (odšteješ $32$), nato upoštevaš velikost koraka (deliš z $1{,}8$).

? Sara po kopanju pusti v kadi $150\,\mathrm{L}$ vode s $40\,^\circ\mathrm{C}$, na polici pa skodelico čaja z $80\,^\circ\mathrm{C}$. Kaj drži?
- Čaj ima več notranje energije, ker je bolj vroč.
~ Višja temperatura pomeni hitrejše delce, a v skodelici jih je veliko manj. Notranja energija je vsota po vseh delcih.
- Obe imata enako notranje energije, ker sta obe iz vode.
~ Enaka snov ne pomeni enake energije. Odločata količina snovi in temperatura.
+ Delci čaja se gibljejo hitreje, a voda v kadi ima več notranje energije.
> Temperatura pove povprečno energijo enega delca, notranja energija pa skupno energijo vseh delcev. V kadi je več stokrat več delcev, zato je vsota večja.

:::simboli
t | temperatura v stopinjah Celzija | t = T - 273 | ^\circ C
T | temperatura v kelvinih (absolutna temperatura) | T = t + 273 | K
t_{\mathrm{F}} | temperatura v stopinjah Fahrenheita | t_\mathrm{F} = 1{,}8 \cdot t + 32 | ^\circ F
t_1 | temperatura v Ljubljani | | ^\circ C
t_2 | temperatura v Chicagu | t_2 = \dfrac{t_\mathrm{F} - 32}{1{,}8} | ^\circ C
\Delta t | razlika temperatur | \Delta t = t_1 - t_2 | ^\circ C | v kelvinih je razlika enaka
W_n | notranja energija (vsota energij vseh delcev) | | J
:::
