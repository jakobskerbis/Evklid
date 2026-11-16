---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Majhna baterija AAA tehta okoli $11\,\mathrm{g}$, velika baterija D več kot desetkrat toliko. Obe imata napetost $1{,}5\,\mathrm{V}$. Litijeva baterija v telefonu ima $3{,}7\,\mathrm{V}$, avtomobilski akumulator $12\,\mathrm{V}$, sestavljen iz šestih celic po $2\,\mathrm{V}$. Velikost torej ne odloča o napetosti. Kaj potem?

Podobno uganko pozna klepar. Če bakren žleb pritrdi z jeklenimi žeblji, žeblji v nekaj letih razpadejo, čeprav bi v suhem stali desetletja. Baker in železo sta v dežju sestavila majhno baterijo, ki »poje« železo.

Odgovor na obe vprašanji je **standardni elektrodni potencial**. Z njim napoveš napetost člena, izbereš kovino za zaščito pred rjo in izračunaš, kolikšno napetost potrebuješ za pobakrenje ali pokromanje.

## Razlaga

**Staro: reakcija v čaši.** Iz prejšnje lekcije poznaš reakcijo cinka z bakrovimi ioni:

$$\mathrm{Zn + Cu^{2+} \rightarrow Zn^{2+} + Cu}$$

Cinkova ploščica v raztopini bakrove soli se prevleče z bakrom, raztopina se malo segreje. Elektroni preskočijo s cinka na bakrove ione neposredno, na mestu stika. Energija reakcije se sprosti kot toplota.

**Novo: ločeni polreakciji.** Cink postavimo v raztopino cinkove soli, baker v raztopino bakrove soli, vsakega v svojo čašo. Kovini povežemo z žico, raztopini pa s **solnim mostom** (cevka z raztopino soli, npr. $\mathrm{KNO_3}$). Reakcija je ista, elektroni pa zdaj ne morejo preskočiti neposredno. Do bakrovih ionov pridejo le po žici, in to je električni tok. Tako napravo imenujemo **galvanski člen**.

:::risba skica
opis: Galvanski člen. Levo čaša z raztopino in cinkovo elektrodo, označeno kot anoda in negativni pol. Desno čaša z bakrovo elektrodo, označeno kot katoda in pozitivni pol. Elektrodi povezuje žica z voltmetrom, puščica nad žico kaže tok elektronov od cinka proti bakru. Čaši povezuje solni most.
območje: 0; -1 .. 10; 7,5
enota: 28
pravokotnik: 0,5; 0,5 .. 3,5; 3,5 | modra ozadje
pravokotnik: 6,5; 0,5 .. 9,5; 3,5 | oranžna ozadje
črta: 0,5; 4,5 -> 0,5; 0,5 -> 3,5; 0,5 -> 3,5; 4,5
črta: 6,5; 4,5 -> 6,5; 0,5 -> 9,5; 0,5 -> 9,5; 4,5
pravokotnik: 1,7; 1 .. 2,3; 5,2 | siva polno
pravokotnik: 7,7; 1 .. 8,3; 5,2 | siva polno
črta: 3; 2,5 -> 3; 4,9 -> 7; 4,9 -> 7; 2,5 | debelo
napis: 5; 4,4 | solni most | pod
črta: 2; 5,2 -> 2; 6,2 -> 4,55; 6,2
črta: 5,45; 6,2 -> 8; 6,2 -> 8; 5,2
krog: 5; 6,2 | 0,45
napis: 5; 6,2 | V | sredina
puščica: 2,6; 6,9 -> 4,2; 6,9 | e⁻ | nad
napis: 2; -0,5 | Zn: anoda (−) | sredina
napis: 8; -0,5 | Cu: katoda (+) | sredina
:::

Na **anodi** poteka oksidacija: $\mathrm{Zn \rightarrow Zn^{2+} + 2\,e^-}$. Cink odda elektrone, ti se na njem nabirajo, zato je anoda negativni pol. Na **katodi** poteka redukcija: $\mathrm{Cu^{2+} + 2\,e^- \rightarrow Cu}$. Elektrode imenujemo po polreakciji, ne po predznaku. Solni most z gibanjem ionov sklene krog in skrbi, da nobena raztopina ne postane nabita.

:::premisli
Cinkovo ploščico zamenjamo z dvakrat večjo. Kaj se pri členu spremeni in kaj ostane enako?
---
Napetost ostane enaka. Odvisna je od tega, kako rad cink odda elektrone v primerjavi z bakrom, ne od količine. Večja elektroda le dlje zdrži in da več toka. Zato imata baterija AAA in D enako napetost.
:::

**Standardni potencial.** Oksidirano in reducirano obliko iste snovi imenujemo **redoks par** in ju pišemo s poševnico, npr. $\mathrm{Cu^{2+}/Cu}$. Kako rad kateri par sprejema elektrone, merimo vedno proti istemu »ničelnemu« členu: vodikovi elektrodi, ki ji pripišemo $0\,\mathrm{V}$. Merimo pri standardnih pogojih: koncentracija ionov $1\,\mathrm{mol/L}$, $25\,\mathrm{°C}$ in tlak $100\,\mathrm{kPa}$. Izmerjeno napetost polreakcije, zapisane kot redukcija, imenujemo **standardni elektrodni potencial** $E^\circ$.

| polreakcija (redukcija) | $E^\circ$ [V] |
|---|---|
| $\mathrm{Mg^{2+} + 2\,e^- \rightarrow Mg}$ | $-2{,}37$ |
| $\mathrm{Zn^{2+} + 2\,e^- \rightarrow Zn}$ | $-0{,}76$ |
| $\mathrm{Fe^{2+} + 2\,e^- \rightarrow Fe}$ | $-0{,}44$ |
| $\mathrm{Ni^{2+} + 2\,e^- \rightarrow Ni}$ | $-0{,}25$ |
| $\mathrm{2\,H^+ + 2\,e^- \rightarrow H_2}$ | $0{,}00$ |
| $\mathrm{Cu^{2+} + 2\,e^- \rightarrow Cu}$ | $+0{,}34$ |
| $\mathrm{Ag^+ + e^- \rightarrow Ag}$ | $+0{,}80$ |
| $\mathrm{O_2 + 4\,H^+ + 4\,e^- \rightarrow 2\,H_2O}$ | $+1{,}23$ |
| $\mathrm{Cl_2 + 2\,e^- \rightarrow 2\,Cl^-}$ | $+1{,}36$ |

Bolj pozitiven $E^\circ$ pomeni, da par rad sprejema elektrone (močan oksidant). Bolj negativen pomeni, da kovina rada oddaja elektrone (močan reducent). V členu je zato katoda par z višjim $E^\circ$, anoda par z nižjim. Napetost je razlika:

$$E^\circ_\text{člen} = E^\circ_\text{katoda} - E^\circ_\text{anoda}$$

Za cink in baker: $0{,}34 - (-0{,}76) = 1{,}10$, torej $1{,}10\,\mathrm{V}$. Napetost pravilno sestavljenega člena je vedno pozitivna. Ob drugih koncentracijah se nekoliko spremeni, kar opisuje Nernstova enačba.

**Obratno: elektroliza.** Zdaj primerjaj člen z njegovim nasprotjem. Če na elektrodi priključimo zunanji vir, lahko elektrone porinemo v smer, v katero sami ne bi šli. Taka reakcija se ne zgodi sama od sebe (je nespontana), poganja jo energija vira. To je **elektroliza**.

| | galvanski člen | elektroliza |
|---|---|---|
| reakcija | poteka sama | jo poganja vir |
| energija | kemijska → električna | električna → kemijska |
| anoda | oksidacija, pol (−) | oksidacija, pol (+) |
| katoda | redukcija, pol (+) | redukcija, pol (−) |

Napetost vira mora biti vsaj tolikšna, kot bi jo dal člen iz istih snovi v obratni smeri. Pri elektrolizi raztopine $\mathrm{CuCl_2}$ nastajata baker in klor. Sama od sebe bi tekla obratna reakcija, člen s katodo $\mathrm{Cl_2/Cl^-}$ in anodo $\mathrm{Cu^{2+}/Cu}$, zato je najmanjša napetost $1{,}36 - 0{,}34 = 1{,}02$, torej $1{,}02\,\mathrm{V}$. V praksi potrebujemo nekaj več, okoli $1{,}4\,\mathrm{V}$.

:::premisli
Pri elektrolizi raztopine $\mathrm{CuCl_2}$ se baker izloča na eni elektrodi. Ali je ta elektroda priključena na pozitivni ali negativni pol vira? Zakaj?
---
Na negativni. Ioni $\mathrm{Cu^{2+}}$ morajo za nastanek bakra sprejeti elektrone (redukcija), elektrone pa jim da negativni pol. Ta elektroda je katoda.
:::

V simulaciji spodaj »Galvanski člen in elektroliza« najprej sestavi člen z največjo napetostjo. Nato preklopi na elektrolizo $\mathrm{CuCl_2}$ in napetost vira počasi zmanjšuj. Opazi, pod katero napetostjo se baker preneha izločati. Pri elektrolizi vode, ki jo v šoli pokažejo v Hofmannovem aparatu (treh povezanih steklenih ceveh), nastajata vodik na katodi in kisik na anodi, vodika dvakrat več po prostornini.

## Rešeni primeri

### Primer 1: člen iz cinka in bakra

V šolski delavnici potopimo cinkovo ploščico v raztopino $\mathrm{ZnSO_4}$, bakreno pa v raztopino $\mathrm{CuSO_4}$, obe s koncentracijo $1\,\mathrm{mol/L}$. Povežemo ju s solnim mostom in voltmetrom. Katera kovina je anoda in kolikšno napetost pokaže voltmeter?

**Podatki:** $E^\circ(\mathrm{Zn^{2+}/Zn}) = -0{,}76\,\mathrm{V}$, $E^\circ(\mathrm{Cu^{2+}/Cu}) = +0{,}34\,\mathrm{V}$, standardni pogoji
**Iščemo:** anodo in napetost $E^\circ_\text{člen}$

:::formula
$E^\circ_\text{člen} = E^\circ_\text{katoda} - E^\circ_\text{anoda}$
:::

**Rešitev:**

1. Nižji potencial ima cink ($-0{,}76\,\mathrm{V}$), zato rad odda elektrone: cink je anoda, baker katoda.
2. $E^\circ_\text{člen} = 0{,}34 - (-0{,}76) = 1{,}10$, torej $1{,}10\,\mathrm{V}$.
3. Odgovor: anoda je cink (negativni pol), voltmeter pokaže $1{,}10\,\mathrm{V}$.

### Primer 2: pobakrenje ključa z elektrolizo

Jeklen ključ želimo prevleči z bakrom. Potopimo ga v raztopino $\mathrm{CuCl_2}$, druga elektroda je grafitna palčica. Na kateri pol vira priključimo ključ in kolikšna je najmanjša napetost vira?

**Podatki:** $E^\circ(\mathrm{Cu^{2+}/Cu}) = +0{,}34\,\mathrm{V}$, $E^\circ(\mathrm{Cl_2/Cl^-}) = +1{,}36\,\mathrm{V}$
**Iščemo:** pol za ključ in najmanjšo napetost $U_\text{min}$

:::formula
$U_\text{min} = E^\circ(\mathrm{Cl_2/Cl^-}) - E^\circ(\mathrm{Cu^{2+}/Cu})$
:::

**Rešitev:**

1. Baker nastane z redukcijo $\mathrm{Cu^{2+} + 2\,e^- \rightarrow Cu}$. Redukcija poteka na katodi, ki je pri elektrolizi negativni pol. Ključ priključimo na (−).
2. Na grafitni anodi (+) se oksidirajo kloridni ioni: $\mathrm{2\,Cl^- \rightarrow Cl_2 + 2\,e^-}$.
3. Sama od sebe bi tekla obratna reakcija, klor bi oksidiral baker z napetostjo $1{,}36 - 0{,}34 = 1{,}02$, torej $1{,}02\,\mathrm{V}$. Vir mora to napetost premagati.
4. Odgovor: ključ na negativni pol, vir z vsaj $1{,}02\,\mathrm{V}$ (v praksi nekaj več). Ker nastaja klor, delamo v zračenem prostoru. Tanka, slabo oprijeta plast bakra nastane na jeklu že brez vira, ker ima železo nižji $E^\circ$ kot baker; enakomerno prevleko da šele elektroliza.

### Primer 3: katera kovina je to

Klepar najde ploščo neznane kovine M. Iz nje in raztopine njenih ionov $\mathrm{M^{2+}}$ sestavimo polčlen, ga povežemo z bakrenim polčlenom in izmerimo $0{,}59\,\mathrm{V}$. Pozitivni pol je baker. Katera kovina je to? Kolikšno napetost bi dala v členu s cinkom?

**Podatki:** $E^\circ_\text{člen} = 0{,}59\,\mathrm{V}$, katoda baker z $E^\circ = +0{,}34\,\mathrm{V}$, $E^\circ(\mathrm{Zn^{2+}/Zn}) = -0{,}76\,\mathrm{V}$, tabela potencialov
**Iščemo:** $E^\circ$ neznane kovine in napetost člena s cinkom

:::formula
$E^\circ_\text{anoda} = E^\circ_\text{katoda} - E^\circ_\text{člen}$
:::

**Rešitev:**

1. Baker je pozitivni pol, torej katoda. Neznana kovina je anoda.
2. $E^\circ_\text{anoda} = 0{,}34 - 0{,}59 = -0{,}25$, torej $-0{,}25\,\mathrm{V}$.
3. V tabeli ima ta potencial nikelj.
4. V členu s cinkom ima nikelj višji potencial, zato je zdaj on katoda: $-0{,}25 - (-0{,}76) = 0{,}51$, torej $0{,}51\,\mathrm{V}$.
5. Odgovor: kovina je nikelj; v členu s cinkom je katoda, napetost je $0{,}51\,\mathrm{V}$. Ista kovina je lahko anoda ali katoda, odvisno od para.

### Primer 4: zdaj ti

Ograja je iz pocinkanega jekla. Na mestu, kjer je cinkova plast opraskana, se v dežju stikata cink in železo. Katera kovina je anoda in kolikšna je napetost takega člena?

**Podatki:** $E^\circ(\mathrm{Zn^{2+}/Zn}) = -0{,}76\,\mathrm{V}$, $E^\circ(\mathrm{Fe^{2+}/Fe}) = -0{,}44\,\mathrm{V}$
**Iščemo:** anodo in $E^\circ_\text{člen}$

:::formula
$E^\circ_\text{člen} = E^\circ_\text{katoda} - E^\circ_\text{anoda}$
:::

**Rešitev:**

1. Primerjaj potenciala: nižjega ima cink.
2. Določi katodo, izračunaj napetost in premisli, katera kovina se raztaplja.

:::premisli
Katera kovina je anoda, kolikšna je napetost in katera kovina se raztaplja?
---
Cink je anoda, železo katoda: $E^\circ_\text{člen} = -0{,}44 - (-0{,}76) = 0{,}32\,\mathrm{V}$. Raztaplja (oksidira) se cink, železo ostane zaščiteno, dokler je cinka dovolj.
:::

## Pogoste napake

- **»Anoda je vedno negativna.«** To velja samo za galvanski člen. Pri elektrolizi je anoda priključena na (+). Zanesljivo pravilo je drugo: na anodi je vedno oksidacija, na katodi vedno redukcija.
- **Odštevanje v napačnem vrstnem redu ali seštevanje.** Za cink in baker $-0{,}76 - 0{,}34$ da negativno število, $-0{,}76 + 0{,}34$ pa $-0{,}42$. Obe sta napačni. Od potenciala katode (višjega) odšteješ potencial anode.
- **Potencial pomnožen s koeficientom.** Pri členu cinka in srebra polreakcijo srebra pomnožimo z $2$, potenciala pa ne: $0{,}80 - (-0{,}76) = 1{,}56\,\mathrm{V}$, ne $2{,}36\,\mathrm{V}$. $E^\circ$ pove, kako rad par sprejema elektrone, ne koliko jih je.
- **Večja elektroda, večja napetost.** Velikost vpliva na to, koliko časa člen deluje, napetost pa je odvisna od snovi.
- **Elektroliza steče pri vsaki napetosti.** Vir mora premagati vsaj napetost obratnega člena, sicer se na elektrodah nič ne izloča.

## Povzetek

- Galvanski člen loči polreakciji redoks reakcije; elektroni gredo po žici, solni most sklene krog. Kemijska energija se spremeni v električno.
- Anoda: oksidacija. Katoda: redukcija. V galvanskem členu je anoda (−), pri elektrolizi (+).
- Standardni elektrodni potencial $E^\circ$ je napetost polreakcije (redukcije) proti vodikovi elektrodi ($0\,\mathrm{V}$) pri $1\,\mathrm{mol/L}$, $25\,\mathrm{°C}$ in $100\,\mathrm{kPa}$.
- Višji $E^\circ$: rad sprejema elektrone, katoda. Nižji: rad oddaja, anoda.
- Napetost člena: $E^\circ_\text{člen} = E^\circ_\text{katoda} - E^\circ_\text{anoda}$; Zn in Cu dasta $1{,}10\,\mathrm{V}$. Koeficienti in velikost elektrod nanjo ne vplivajo.
- Elektroliza poganja nespontano reakcijo z zunanjim virom; najmanjša napetost je enaka napetosti obratnega člena ($\mathrm{CuCl_2}$: $1{,}02\,\mathrm{V}$).

## Drugače: Na sliki

Potenciale postavi na premico in si jo predstavljaj kot klanec, ki se spušča od leve proti desni:

:::risba premica
opis: Premica standardnih potencialov od −2,5 do 1 volta. Točke: magnezij pri −2,37, cink pri −0,76, vodik pri 0, baker pri 0,34, srebro pri 0,80. Lok od cinka do bakra je označen z 1,10 V.
od: -2,5
do: 1
korak: 0,5
oznake: 1
točka: -2,37 | Mg
točka: -0,76 | Zn
točka: 0 | H_2
točka: 0,34 | Cu
točka: 0,8 | Ag
skok: -0,76 -> 0,34 | 1,10 V
podnapis: Elektroni gredo od leve točke k desni; razdalja je napetost člena.
:::

Elektroni v členu sami od sebe tečejo od leve točke (anoda) proti desni (katoda), kot voda teče po klancu navzdol. Napetost je razdalja med točkama. Magnezij in srebro sta najdlje narazen, zato bi njun člen dal največjo napetost na sliki. Pri elektrolizi vir elektrone potiska v obratni smeri, »navkreber«.

## Drugače: Iz vsakdanjega življenja

- **Bojler.** V jeklenem kotlu je magnezijeva palica. Magnezij ima veliko nižji potencial kot železo, zato je anoda in se počasi raztaplja namesto kotla. Serviser jo po nekaj letih zamenja.
- **Streha in žlebovi.** Baker in jeklo ne smeta biti v neposrednem stiku. Jeklo bi bilo anoda in bi hitro zarjavelo. Klepar zato uporablja bakrene ali nerjavne žeblje.
- **Pocinkana ograja.** Cink varuje jeklo tudi tam, kjer je opraskan, ker je anoda on.
- **Avtomobilski akumulator.** Ob zagonu motorja deluje kot galvanski člen. Med vožnjo ga alternator polni: takrat je elektrolizna celica in reakcija teče nazaj.
- **Pokromane pipe in pozlačen nakit.** Tanka plast kovine nastane z elektrolizo, predmet je katoda.

## Preveri se

? Katera vrstica pravilno opiše elektrolizo?
- anoda (−) z oksidacijo, katoda (+) z redukcijo
~ To so predznaki galvanskega člena. Pri elektrolizi vir zamenja pola.
+ anoda (+) z oksidacijo, katoda (−) z redukcijo
- anoda (+) z redukcijo, katoda (−) z oksidacijo
~ Na anodi je vedno oksidacija, na katodi vedno redukcija, tudi pri elektrolizi.
> Ime elektrode pove polreakcijo (anoda: oksidacija), predznak pa je pri elektrolizi obraten kot v galvanskem členu.

? Oceni napetost člena iz magnezija in bakra.
- okoli $2{,}0\,\mathrm{V}$
~ Tako dobiš, če potenciala sešteješ: $-2{,}37 + 0{,}34$. Napetost je razlika.
- okoli $1{,}1\,\mathrm{V}$
~ $1{,}10\,\mathrm{V}$ velja za cink in baker. Napetost je odvisna od obeh kovin, ne le od bakra.
+ okoli $2{,}7\,\mathrm{V}$
> $E^\circ_\text{člen} = 0{,}34 - (-2{,}37) = 2{,}71\,\mathrm{V}$; magnezij je anoda.

? Zakaj galvanski člen brez solnega mostu ne daje toka?
- Ker po solnem mostu tečejo elektroni iz ene čaše v drugo.
~ Elektroni tečejo samo po žici. Po mostu se premikajo ioni.
+ Ker se brez gibanja ionov raztopini naelektrita in krog ni sklenjen.
- Ker se brez mostu raztopini ne moreta pomešati.
~ Mešanje raztopin si ne želimo: bakrovi ioni bi prišli do cinka in elektroni bi preskočili neposredno, brez toka po žici.
> Ob anodi nastajajo pozitivni ioni, ob katodi jih zmanjkuje. Ioni iz mostu naboj izenačijo in sklenejo krog.

? Člen iz srebra (katoda, $+0{,}80\,\mathrm{V}$) in neznane kovine da $1{,}24\,\mathrm{V}$. Katera kovina je to?
- baker
~ Baker s srebrom da le $0{,}80 - 0{,}34 = 0{,}46\,\mathrm{V}$. Za $1{,}24\,\mathrm{V}$ mora imeti anoda negativen potencial: $E^\circ_\text{anoda} = E^\circ_\text{katoda} - E^\circ_\text{člen}$.
- cink
~ Cink s srebrom da $0{,}80 - (-0{,}76) = 1{,}56\,\mathrm{V}$, kar je preveč.
+ železo
- nikelj
~ Nikelj s srebrom da $0{,}80 - (-0{,}25) = 1{,}05\,\mathrm{V}$, kar je premalo.
> $E^\circ_\text{anoda} = 0{,}80 - 1{,}24 = -0{,}44\,\mathrm{V}$, kar je potencial železa.

? Zakaj ima jeklen bojler v notranjosti magnezijevo palico?
- Magnezij ima višji potencial kot železo, zato elektrone potegne iz jekla.
~ Magnezij ima nižji potencial ($-2{,}37\,\mathrm{V}$ proti $-0{,}44\,\mathrm{V}$). Elektrone oddaja, ne jemlje.
- Magnezij se reducira in na jeklu ustvari zaščitno plast.
~ Magnezij v tem členu ne sprejema elektronov. Je anoda in se oksidira.
+ Magnezij je anoda in se oksidira namesto železa, ki je katoda.
- Magnezij poveča napetost in tako hitreje segreje vodo.
~ Vodo segreva električni grelec. Palica le varuje kotel pred rjo.
> Kovina z nižjim $E^\circ$ je v členu anoda in se raztaplja. Ko se magnezij porabi, ga zamenjajo, sicer začne rjaveti kotel.

:::simboli
E | standardni elektrodni potencial $E^\circ$ (katoda, anoda); z indeksom člen napetost člena | E^\circ_\text{člen} = E^\circ_\text{katoda} - E^\circ_\text{anoda} | V | proti vodikovi elektrodi; Cu: $+0{,}34\,\mathrm{V}$
U_\text{min} | najmanjša napetost vira pri elektrolizi | | V | napetost obratnega člena
:::
