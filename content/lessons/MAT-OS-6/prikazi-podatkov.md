---
stanje: osnutek
demo: diagram
avtor: AI
---

## Zakaj se tega učimo

Vsak dan srečaš podatke: koliko je učencev v razredu, kakšna je bila včeraj temperatura, koliko točk je dosegla tvoja ekipa na tekmi, koliko gre kosov kruha na dan. Kadar so podatki zapisani vsi po vrsti, v dolgem besedilu ali na kupu listkov, jih težko pregledamo. Nihče ne vidi, katera številka je največja ali kako se stvari spreminjajo.

Zato podatke **uredimo** v preglednico in jih **narišemo** v obliki prikaza. Dobro narisan prikaz pove v nekaj sekundah to, kar bi v besedilu iskal minute. Pomaga ti pri šolskih nalogah, na primer pri naravoslovju in geografiji, pa tudi v časopisu, na spletu in pri odločanju: ali bo več glasov za izlet v Postojno ali na Bled?

V tej lekciji se boš naučil:

- podatke zbrati in urediti v **preglednici**,
- jih narisati v **stolpčnem prikazu** in v **črtičnem prikazu**,
- prikaze pravilno **brati** in razbrati, kar sprašuje naloga.

Za računanje potrebuješ le seštevanje, odštevanje, množenje in deljenje, ki ga že znaš. Pri merilu na osi ti pomaga znanje o merskih enotah.

## Razlaga

**1. Podatki in zbiranje.** **Podatek** je zapisana informacija: ime ljubljenčka, število bratov in sester, temperatura, rezultat tekme. Podatke zbiramo z anketo (vprašamo ljudi), s štetjem (preštejemo avtomobile mimo šole) ali z merjenjem (vsak dan izmerimo temperaturo). Pri vsaki zbirki vedno vemo, kaj sprašujemo in koga smo vprašali.

Pogosto štejemo s črticami. Za vsak odgovor potegnemo eno črtico, pri petem odgovoru pa prve štiri črtice prečrtamo, tako da nastane »peterček«. Devet glasov za nogomet zapišemo kot en prečrtan peterček in še štiri črtice, šest glasov za košarko pa kot en peterček in še eno črtico:

```
nogomet:  ||||/  ||||    -> 9
košarka:  ||||/  |       -> 6
```

Zapis v peterčkih nas varuje pred napakami pri štetju: peterčke hitro preštejemo po pet, posameznih črtic pa pri dolgem seznamu ne bi mogli zanesljivo prešteti.

**2. Preglednica.** **Preglednica** (tabela) je urejen zapis podatkov v vrsticah in stolpcih. V prvem stolpcu so **kategorije** (kaj štejemo ali merimo), v drugem **števila** (koliko jih je). Primer preglednice o priljubljenem športu v razredu:

| Šport | Število učencev |
|---|---|
| nogomet | $9$ |
| košarka | $6$ |
| plavanje | $5$ |
| odbojka | $3$ |
| atletika | $2$ |
| **Skupaj** | $25$ |

Iz preglednice lahko že veliko razbereš: največ učencev ima rado nogomet, najmanj atletiko. Skupaj smo vprašali $9 + 6 + 5 + 3 + 2 = 25$ učencev. Vrstica »Skupaj« je tudi preizkus: ko vsota ne ustreza številu vprašanih, smo se nekje zmotili.

**3. Stolpčni prikaz.** V **stolpčnem prikazu** (stolpčnem diagramu) je vsaka kategorija narisana kot **stolpec**. Višina stolpca je sorazmerna s številom: večje število pomeni višji stolpec. Stolpčni prikaz je primeren, kadar primerjamo različne kategorije med seboj (šport, domače živali, barve).

Dober stolpčni prikaz ima:

- **naslov**, ki pove, o čem je prikaz,
- **vodoravno os** s kategorijami in **navpično os** s številkami,
- **oznake osi** z enotami (na primer »število učencev«),
- enako široke stolpce z enakimi razmiki,
- navpično os, ki se začne pri $0$.

**4. Merilo.** Navpična os ima **merilo**: pove, koliko pomeni en kvadratek ali ena črtica na osi. Kadar so števila majhna, je merilo lahko $1$. Pri večjih številih ga povečamo, na primer $1$ kvadratek pomeni $4$ knjige. Višino stolpca potem dobimo z deljenjem:

$$\text{višina stolpca} = \text{vrednost} : \text{merilo}$$

Če podatki ne gredo v celo število kvadratkov, izberemo drugo merilo.

**5. Črtični prikaz.** Za podatke, ki se **spreminjajo skozi čas** (temperatura po dnevih, višina rastline po tednih, število obiskovalcev po mesecih), uporabimo **črtični prikaz** (črtni diagram). Za vsak čas narišemo točko na višini ustrezne vrednosti, točke pa povežemo z daljicami. Črta nam pokaže, kdaj vrednosti **naraščajo** (črta se dviguje), **padajo** (črta se spušča) ali so **stalne** (črta je vodoravna).

Točke povezujemo samo tedaj, ko imajo vmesne vrednosti smisel. Temperatura se med dvema meritvama spreminja postopoma in ima ves čas neko vrednost, zato ima črta smisel (vmesne vrednosti na njej so le ocena). Pri številu učencev v različnih razredih pa vmesnega »razreda« ni, zato tam rišemo stolpce.

**6. Kako beremo prikaz.**

1. Preberi **naslov**: o čem govori prikaz?
2. Preberi **oznaki osi** in **enoto**.
3. Poglej **merilo**: koliko pomeni en kvadratek?
4. Odčitaj vrednost: od vrha stolpca ali točke se premakni vodoravno do osi.
5. Odgovori s stavkom in enoto.

Pri primerjavah računamo z razlikami: »za koliko več« pomeni odštevanje, »skupaj« pa seštevanje.

Interaktivna simulacija spodaj (**Prikazi podatkov**) ti omogoča, da vnašaš podatke in opazuješ, kako se oblikuje stolpčni prikaz.

## Rešeni primeri

### Primer 1 (lažji)

V razredu so vprašali $25$ učencev po priljubljenem športu. Odgovori so v preglednici: nogomet $9$, košarka $6$, plavanje $5$, odbojka $3$, atletika $2$. Kateri šport je najbolj priljubljen? Za koliko več učencev ima rado nogomet kot odbojko? Preveri, ali se vsota ujema s številom vprašanih.

**Podatki:** število vprašanih $25$, nogomet $9$, košarka $6$, plavanje $5$, odbojka $3$, atletika $2$ (število učencev)
**Iščemo:** najbolj priljubljen šport, razliko med nogometom in odbojko ter preizkus vsote

:::formula
Najbolj priljubljena kategorija ima največje število. Razlika: $\text{večje število} - \text{manjše število}$. Skupaj: vsota vseh števil.
:::

**Rešitev:**

1. Največje število je $9$, zato je najbolj priljubljen nogomet.
2. Razlika: $9 - 3 = 6$.
3. Preizkus: $9 + 6 + 5 + 3 + 2 = 25$, kar je enako številu vprašanih.
4. Odgovor: najbolj priljubljen je nogomet; nogomet ima rado za $6$ učencev več kot odbojka. Vsota se ujema ($25$ učencev).

### Primer 2 (srednji)

Štirje učenci so v mesecu prebrali knjige: Ana $12$, Bor $8$, Cene $20$, Dara $16$. Stolpčni prikaz rišemo na kvadratkast papir tako, da en kvadratek navpično pomeni $4$ knjige. Kako visok mora biti stolpec za vsakega učenca? Koliko knjig so prebrali skupaj?

**Podatki:** Ana $12$ knjig, Bor $8$ knjig, Cene $20$ knjig, Dara $16$ knjig; merilo: $1$ kvadratek $= 4$ knjige
**Iščemo:** višino vsakega stolpca v kvadratkih in skupno število knjig

:::formula
$\text{višina stolpca} = \text{vrednost} : \text{merilo}$
:::

**Rešitev:**

1. Ana: $12 : 4 = 3$ kvadratki.
2. Bor: $8 : 4 = 2$ kvadratka.
3. Cene: $20 : 4 = 5$ kvadratkov.
4. Dara: $16 : 4 = 4$ kvadratki.
5. Preizkus: najvišji stolpec je Cenetov, kar ustreza največjemu številu knjig. Skupaj: $12 + 8 + 20 + 16 = 56$ knjig.
6. Odgovor: stolpci so visoki $3$, $2$, $5$ in $4$ kvadratke; učenci so skupaj prebrali $56$ knjig.

### Primer 3 (težji)

Gregor je vsak dan ob osmih zjutraj izmeril temperaturo zraka. V ponedeljek je bilo $4\,^\circ\text{C}$, v torek $7\,^\circ\text{C}$, v sredo $9\,^\circ\text{C}$, v četrtek $9\,^\circ\text{C}$, v petek $6\,^\circ\text{C}$ in v soboto $2\,^\circ\text{C}$. Podatke je narisal v črtični prikaz. Katera dneva sta bila najtoplejša? Za koliko stopinj se razlikujeta najtoplejši in najhladnejši dan? Med katerima zaporednima dnevoma je temperatura najbolj padla in zakaj je tu primeren črtični prikaz?

**Podatki:** ponedeljek $4\,^\circ\text{C}$, torek $7\,^\circ\text{C}$, sreda $9\,^\circ\text{C}$, četrtek $9\,^\circ\text{C}$, petek $6\,^\circ\text{C}$, sobota $2\,^\circ\text{C}$ (temperatura ob osmih zjutraj)
**Iščemo:** najtoplejša dneva, razliko med največjo in najmanjšo temperaturo, največji padec med zaporednima dnevoma in zakaj je primeren črtični prikaz

:::formula
Razlika zaporednih vrednosti: $\text{novejša} - \text{starejša}$ ($>0$ naraščanje, $<0$ padanje, $0$ stalno). Razpon: $\text{največja} - \text{najmanjša}$.
:::

**Rešitev:**

1. Najvišja točka na prikazu je pri $9\,^\circ\text{C}$, to sta sreda in četrtek.
2. Najnižja točka je pri $2\,^\circ\text{C}$ (sobota). Razlika: $9 - 2 = 7\,^\circ\text{C}$.
3. Spremembe po dnevih: ponedeljek-torek $7 - 4 = +3$, torek-sreda $9 - 7 = +2$, sreda-četrtek $9 - 9 = 0$, četrtek-petek $6 - 9 = -3$, petek-sobota $2 - 6 = -4$.
4. Največji padec je za $4\,^\circ\text{C}$, od petka do sobote. To je tudi najstrmejši spust črte.
5. Črtični prikaz je primeren, ker se temperatura skozi čas spreminja in nas zanima potek: črta kaže naraščanje (do srede), mirovanje (od srede do četrtka) in padanje (od četrtka naprej).
6. Odgovor: najtoplejša sta sreda in četrtek ($9\,^\circ\text{C}$); razlika med najtoplejšim in najhladnejšim dnem je $7\,^\circ\text{C}$; temperatura je najbolj padla od petka do sobote, za $4\,^\circ\text{C}$; črtični prikaz je primeren, ker prikazuje spreminjanje temperature skozi čas.

## Pogoste napake

- **Navpična os se ne začne pri $0$.** Učenec začne os pri $5$ ali pri $46$, da bi bil prikaz »večji«. Razlog: želi videti razlike. Posledica: kratek stolpec je videti nekajkrat nižji, kot je v resnici. Pravilno: stolpčni prikaz vedno začnemo pri $0$.
- **Neenakomerno merilo.** Ob osi so razmaki različni: $0, 5, 10, 20, 25$. Razlog: nepozornost pri risanju. Posledica: višina stolpca ne pove prave vrednosti. Pravilno: vsak kvadratek pomeni isto število, zaporedna števila pri osi so $0, 5, 10, 15, 20, \dots$.
- **Odčitek brez pogleda na merilo.** Učenec prešteje kvadratke in odgovori »6 učencev«, čeprav en kvadratek pomeni $5$ učencev. Razlog: pozabi na merilo. Pravilno: višino v kvadratkih pomnožimo z merilom, $6 \cdot 5 = 30$ učencev.
- **Črtični prikaz za neprimerne podatke.** Učenec poveže točke za število učencev v različnih razredih. Razlog: misli, da je črta vedno lepša. Pravilno: črto uporabimo samo za podatke, ki se spreminjajo skozi čas; kategorije primerjamo s stolpci.
- **Manjkajo naslov, oznake in enote.** Prikaz ima samo stolpce in številke. Razlog: mislimo, da je »vse jasno«. Posledica: nihče ne ve, kaj številke pomenijo. Pravilno: dodaj naslov, oznake osi in enoto.

## Povzetek

- Podatke zberemo (anketa, štetje, merjenje) in uredimo v **preglednico** s kategorijami in števili; vrstica »Skupaj« je preizkus.
- **Stolpčni prikaz** primerja kategorije; višina stolpca je sorazmerna s številom, os se začne pri $0$.
- **Črtični prikaz** kaže spreminjanje skozi čas: črta narašča, pada ali je vodoravna.
- Višina stolpca: $\text{vrednost} : \text{merilo}$; vrednost iz višine: $\text{višina} \cdot \text{merilo}$.
- Pri branju vedno preberi naslov, oznake osi, enoto in merilo.
- »Za koliko več/manj« je razlika (odštevanje), »skupaj« je vsota.

## Drugače: Na sliki

Stolpčni prikaz za podatke iz preglednice (višina stolpca pove število učencev):

:::risba stolpci
opis: Stolpčni prikaz »Priljubljen šport v razredu«. Na navpični osi je število učencev. Stolpci: nogomet 9, košarka 6, plavanje 5, odbojka 3, atletika 2.
podnapis: Priljubljen šport v razredu
os: število učencev
korak: 2
stolpec: nogomet | 9
stolpec: košarka | 6
stolpec: plavanje | 5
stolpec: odbojka | 3
stolpec: atletika | 2
:::

Najvišji stolpec je nogomet, najnižji atletika. Prikaz ti da občutek za velikost brez računanja. Kategorije so pod vodoravno osjo, števila ob navpični.

Črtični prikaz si predstavljaj kot točke na mrežnem papirju. Vodoravno so dnevi, navpično temperature:

| Dan | pon | tor | sre | čet | pet | sob |
|---|---|---|---|---|---|---|
| Temperatura [$^\circ\text{C}$] | $4$ | $7$ | $9$ | $9$ | $6$ | $2$ |

Točke so na višinah $4, 7, 9, 9, 6, 2$. Ko jih povežeš, nastane črta, ki se najprej dviga (pon do sre), je potem vodoravna (sre do čet) in nato pada (čet do sob).

V simulaciji spodaj spreminjaj številke in glej, kako se stolpci višajo in nižajo.

## Drugače: Iz vsakdanjega življenja

**Vremenska napoved.** Na televiziji in v telefonu vidiš črtični prikaz temperatur za naslednjih nekaj dni. Če črta narašča, bo topleje, če pada, bo hladneje. Vodoravna črta pomeni, da se temperatura ne bo spremenila.

**Glasovanje za izlet.** Razred izbira med Postojnsko jamo, Bledom in Piranom. Učiteljica prešteje glasove in jih zapiše v preglednico. Ker želi, da vsi vidijo, kateri izlet je najbolj priljubljen, nariše stolpčni prikaz. Najvišji stolpec zmaga, kategorije pa med seboj primerjamo.

**Rast fižola.** Fižolček v lončku mereš vsak teden in zapisuješ: $2\,\text{cm}$, $5\,\text{cm}$, $9\,\text{cm}$, $14\,\text{cm}$. To je preglednica merjenj skozi čas. S črtičnim prikazom takoj vidiš, da rastlina raste, in sicer vedno hitreje, kar izveš iz tega, da se črta vedno bolj strmo dviguje. (Rasti: $+3$, $+4$, $+5$ centimetrov na teden.)

Povsod je cilj enak: ne gledamo posameznih številk, ampak **celotno sliko**.

## Drugače: Korak za korakom s številkami

Nariši stolpčni prikaz iz teh podatkov: število avtomobilov, ki so v petih minutah peljali mimo šole: rdeči $15$, beli $20$, črni $10$, modri $5$.

1. **Podatki v preglednico:** rdeči $15$, beli $20$, črni $10$, modri $5$. Skupaj: $15 + 20 + 10 + 5 = 50$ avtomobilov.
2. **Izberi merilo.** Največje število je $20$. Če izberemo, da en kvadratek pomeni $5$ avtomobilov, bo najvišji stolpec visok $20 : 5 = 4$ kvadratke, kar se prilega na list. Vsa števila so deljiva s $5$, zato so višine cela števila.
3. **Izračunaj višine:** rdeči $15 : 5 = 3$, beli $20 : 5 = 4$, črni $10 : 5 = 2$, modri $5 : 5 = 1$ kvadratek.
4. **Nariši osi.** Vodoravna os: kategorije z enakimi razmiki. Navpična os: oznake $0, 5, 10, 15, 20$ (števila avtomobilov).
5. **Nariši stolpce** enake širine z izračunanimi višinami.
6. **Dodaj naslov** (»Barve avtomobilov mimo šole«) in oznako osi (»število avtomobilov«).
7. **Preveri:** najvišji stolpec je beli ($20$), najnižji modri ($5$). Razlika med njima: $20 - 5 = 15$ avtomobilov.

Ko prikaz bereš nazaj, postopek obrneš: stolpec je visok $3$ kvadratke, merilo je $5$, torej je vrednost $3 \cdot 5 = 15$.

## Drugače: Bolj natančno

**Vrste podatkov.** Pri stolpčnem prikazu so kategorije pogosto **opisni podatki** (barva, šport, žival), števila pa so **štetja**. Pri črtičnem prikazu je na vodoravni osi čas, pogosto neprekinjena količina, zato lahko točke povežemo.

**Zakaj se os začne pri $0$.** Višina stolpca mora biti sorazmerna z vrednostjo: stolpec za dvakrat večjo vrednost mora biti dvakrat višji. To drži samo, če se os začne pri $0$. Primer: dva razreda imata $48$ in $50$ učencev. Če narišemo os od $46$, sta stolpca visoka $48 - 46 = 2$ in $50 - 46 = 4$ enoti. Drugi stolpec je videti dvakrat višji, čeprav je v resnici le za dva učenca večji. To je zavajajoč prikaz.

**Izbira merila.** Merilo izberemo tako, da je največji stolpec dovolj velik, a se prilega na list, in tako da so vse višine lahko odčitati. Priročna merila so $1$, $2$, $5$, $10$, $20$ in podobno. Če izberemo merilo $3$, so oznake na osi $3, 6, 9, \dots$ in prikaz je težje brati.

**Bralne napake.** Pri črtičnem prikazu je odčitek le na označenih točkah dober. Vrednosti med točkama so ocena, ne meritev. Pri branju je pomembna tudi strmina črte: bolj strma črta pomeni večjo spremembo v enem koraku. V Primeru 3 je padec od petka do sobote ($4\,^\circ\text{C}$) strmejši od padca od četrtka do petka ($3\,^\circ\text{C}$).

**Pregled in preizkus.** Pri vsakem prikazu preveri, ali se vsota števil ujema s številom vseh podatkov in ali stolpci ustrezajo preglednici. Ta navada te obvaruje pred napakami pri prepisovanju in risanju.

## Preveri se

? V preglednici so števila učencev po razredih: $7$, $5$, $9$ in $4$. Koliko učencev je skupaj?
- $21$
+ $25$
- $26$
> $7 + 5 + 9 + 4 = 25$. Odgovora $21$ in $26$ dobiš z napako pri seštevanju.

? Na prikazu en kvadratek pomeni $5$ učencev. Stolpec je visok $6$ kvadratkov. Koliko učencev predstavlja?
- $6$ učencev
- $11$ učencev
+ $30$ učencev
> Višino pomnožimo z merilom: $6 \cdot 5 = 30$. Odgovor $6$ dobiš, če pozabiš na merilo, odgovor $11$ pa, če višini prišteješ merilo.

? Temperature: ponedeljek $5\,^\circ\text{C}$, torek $8\,^\circ\text{C}$, sreda $8\,^\circ\text{C}$, četrtek $3\,^\circ\text{C}$. Med katerima dnevoma je črta v črtičnem prikazu vodoravna?
- med ponedeljkom in torkom
+ med torkom in sredo
- med sredo in četrtkom
> Črta je vodoravna, kadar sta zaporedni vrednosti enaki. To velja za torek in sredo, ko je bilo $8\,^\circ\text{C}$ oba dneva.

? Zakaj je zavajajoče, če se navpična os stolpčnega prikaza začne pri $46$, ne pri $0$?
+ Majhne razlike so videti zelo velike.
- Stolpci postanejo preširoki.
- Števila na osi postanejo negativna.
> Če se os ne začne pri $0$, višina stolpca ni več sorazmerna z vrednostjo, zato se razlike zdijo večje, kot so.

:::simboli
\text{višina stolpca} | višina stolpca v kvadratkih | \text{višina stolpca} = \text{vrednost} : \text{merilo} | | vrednost iz višine: višina · merilo
\text{vrednost} | podatek, ki ga stolpec prikazuje | | | na primer število knjig
\text{merilo} | koliko pomeni en kvadratek na navpični osi | | | na primer 1 kvadratek = 4 knjige
\text{večje število}, \text{manjše število} | večja in manjša od dveh primerjanih vrednosti | | | njuna razlika pove, za koliko je ena večja
\text{novejša}, \text{starejša} | kasnejša in prejšnja od dveh zaporednih vrednosti | | | razlika > 0 naraščanje, < 0 padanje, 0 stalno
\text{največja}, \text{najmanjša} | največja in najmanjša vrednost v podatkih | | | njuna razlika je razpon
:::
