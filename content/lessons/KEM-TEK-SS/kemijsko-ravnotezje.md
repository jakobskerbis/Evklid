---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Odpreš plastenko gazirane vode in zašumi. Dokler je bila zaprta, v njej ni bilo niti mehurčka.

Planinec stopi na vrh Triglava in diha hitreje kot v dolini. Njegova kri prenaša manj kisika, čeprav ima enako veliko hemoglobina.

Na prvi pogled nimata ničesar skupnega. V resnici gre obakrat za isto: za proces, ki teče v obe smeri hkrati, $\mathrm{CO_2(g) \rightleftharpoons CO_2(raztopljen)}$ v plastenki in $\mathrm{Hb + O_2 \rightleftharpoons HbO_2}$ v krvi. Ko nad tekočino ali v pljučih pade tlak plina, se sestava zmesi premakne tako, da v tekočini ostane manj plina: v plastenki nastanejo mehurčki, v krvi je manj $\mathrm{HbO_2}$. To je premik **kemijskega ravnotežja**.

Z njim boš znal napovedati, kam se reakcija premakne, in izračunati, kakšna je sestava zmesi na koncu. Na primer, kolikšen delež hemoglobina zasede ogljikov monoksid v zaprti garaži.

## Razlaga

**1. Kaj pokaže graf.** V zaprto posodo pri $430\,\mathrm{°C}$ damo vodik in jodove pare, vsakega s koncentracijo $1{,}00\,\mathrm{mol/L}$. Nastaja vodikov jodid: $\mathrm{H_2(g) + I_2(g) \rightleftharpoons 2\,HI(g)}$. Merimo koncentracije:

:::risba graf
opis: Koncentracije v odvisnosti od časa. Koncentracija H₂ in I₂ pada od 1,00 mol/L in se ustali pri 0,21 mol/L. Koncentracija HI raste od 0 in se ustali pri 1,57 mol/L. Od navpične črtkane črte pri času 3 naprej sta obe krivulji vodoravni.
x: 0 .. 5 | 1 | čas
y: 0 .. 1,8 | 0,2 | c v mol/L
f: 0.2135 + 0.7865*exp(-1.5*x) | modra
f: 1.573*(1 - exp(-1.5*x)) | oranžna črtkano
črta: 3; 0 -> 3; 1,8 | siva črtkano
napis: 4; 0,21 | H_2 in I_2 | nad | modra
napis: 4; 1,57 | HI | pod | oranžna
napis: 3; 1,75 | ravnotežje | desno
podnapis: Na začetku se koncentracije hitro spreminjajo, potem obstanejo.
:::

Pomembno je, česar graf ne pokaže. Ko sta krivulji vodoravni, reakcija ni končana. Molekule HI še vedno nastajajo, a enako hitro tudi razpadajo nazaj. **Kemijsko ravnotežje** je stanje, v katerem sta hitrosti reakcije v obe smeri enaki, zato se koncentracije ne spreminjajo. Ravnotežje je **dinamično**.

:::premisli
V ravnotežno zmes bi vbrizgali malo $\mathrm{I_2}$, ki vsebuje radioaktivni izotop joda. Ali bi se čez čas pojavil tudi v molekulah HI? Zakaj?
---
Da. Ker reakcija teče naprej in nazaj tudi v ravnotežju, se označeni jod vgradi v HI, čeprav se skupne koncentracije ne spremenijo. S takimi poskusi so dokazali, da je ravnotežje dinamično.
:::

**2. Kaj pokaže tabela.** Isti poskus ponovimo s tremi različnimi začetnimi zmesmi, koncentracije so v mol/L. V poskusu A damo $1{,}00$ $\mathrm{H_2}$ in $1{,}00$ $\mathrm{I_2}$, v poskusu B $1{,}00$ $\mathrm{H_2}$ in $0{,}50$ $\mathrm{I_2}$, v poskusu C samo $1{,}00$ HI. Ravnotežna zmes je zapisana v vrstnem redu $[\mathrm{H_2}]$; $[\mathrm{I_2}]$; $[\mathrm{HI}]$. Prvi količnik je $\frac{[\mathrm{HI}]}{[\mathrm{H_2}][\mathrm{I_2}]}$, drugi $\frac{[\mathrm{HI}]^2}{[\mathrm{H_2}][\mathrm{I_2}]}$.

| Poskus | Ravnotežna zmes | 1. količnik | 2. količnik |
|---|---|---|---|
| A | $0{,}214$; $0{,}214$; $1{,}573$ | $34$ | $54$ |
| B | $0{,}531$; $0{,}0306$; $0{,}939$ | $58$ | $54$ |
| C | $0{,}107$; $0{,}107$; $0{,}787$ | $69$ | $54$ |

Ravnotežne zmesi so si zelo različne. Prvi količnik se spreminja. Ko pa $[\mathrm{HI}]$ kvadriramo, ker je v enačbi koeficient 2, dobimo vedno isto število. V poskusu C smo začeli celo s samim produktom, pa smo prišli do enakega razmerja.

**3. Konstanta ravnotežja.** Za splošno reakcijo $a\,\mathrm{A} + b\,\mathrm{B} \rightleftharpoons c\,\mathrm{C} + d\,\mathrm{D}$ je **konstanta ravnotežja**

$$K = \frac{[\mathrm{C}]^c\,[\mathrm{D}]^d}{[\mathrm{A}]^a\,[\mathrm{B}]^b}$$

Oglati oklepaji pomenijo ravnotežne koncentracije v mol/L, potence so koeficienti iz enačbe. Za HI pri $430\,\mathrm{°C}$ je $K = 54{,}3$. Nekaj pravil:

- $K$ je odvisna samo od temperature, ne od začetne zmesi.
- Trdnih snovi in vode kot topila ne pišemo v izraz, ker se njihova »koncentracija« praktično ne spreminja.
- Velika $K$ (na primer $10^5$) pomeni, da je v ravnotežju skoraj samo produkt; majhna ($10^{-5}$), da reakcija komaj steče.
- Obrnjena enačba ima konstanto $\frac{1}{K}$, podvojena $K^2$. Pri seštevanju enačb se konstante zmnožijo. Spomni se termokemije: tam smo $\Delta H$ seštevali, tu konstante množimo.

**4. Kam bo tekla reakcija.** Isti izraz, izračunan s trenutnimi koncentracijami, imenujemo **reakcijski količnik** $Q$ (ne zamenjaj ga s toploto $Q$ iz termokemije). Primerjava s $K$ pove smer:

:::risba premica
opis: Številska premica od 0 do 120 za reakcijo, pri kateri je K = 54. Puščica od Q = 10 kaže desno proti K: reakcija teče v smer produktov. Puščica od Q = 110 kaže levo proti K: reakcija teče v smer reaktantov.
od: 0
do: 120
korak: 10
oznake: 20
točka: 54 | K | polno
skok: 10 -> 54 | Q manjši od K: v desno
skok: 110 -> 54 | Q večji od K: v levo
:::

Reakcija vedno teče tako, da se $Q$ približuje $K$. Pri $Q = K$ je zmes v ravnotežju.

:::premisli
Ravnotežni zmesi $\mathrm{H_2}$, $\mathrm{I_2}$ in HI dodamo še nekaj HI. Kaj se zgodi s $Q$ in v katero smer bo tekla reakcija?
---
Števec se poveča, zato je $Q > K$. Reakcija teče v levo: del HI razpade, dokler $Q$ spet ni $54{,}3$. Konstanta se ni spremenila, spremenila se je le sestava.
:::

**5. Le Chatelierovo načelo.** Če ravnotežje zmotimo, se zmes premakne tako, da motnjo delno izniči. Kaj to pomeni v praksi:

- **Dodaš reaktant ali odvzameš produkt:** premik v desno, $K$ ostane enaka.
- **Zmanjšaš prostornino (večji tlak):** premik na stran z manj molekulami plina, $K$ ostane enaka.
- **Segreješ:** premik v smer endotermne reakcije, $K$ se spremeni.
- **Dodaš katalizator:** ni premika, ravnotežje je le doseženo prej.

Telo to načelo uporablja vsak trenutek. V pljučih je delni tlak kisika velik, zato se $\mathrm{Hb + O_2 \rightleftharpoons HbO_2}$ premakne v desno in kri se nasiči s kisikom. V tkivih kisika primanjkuje, zato se ravnotežje premakne v levo in $\mathrm{HbO_2}$ kisik odda. Na Triglavu je delni tlak kisika manjši že v pljučih, zato je $\mathrm{HbO_2}$ manj.

Pri temperaturi pomaga termokemija. Če je reakcija v desno eksotermna, je v levo endotermna, zato segrevanje premakne ravnotežje v levo in $K$ se zmanjša.

V simulaciji spodaj »Ravnotežje in Le Chatelierovo načelo« zmanjšaj prostornino posode. Opazi, da se zmes premakne k $\mathrm{N_2O_4}$, ker iz dveh molekul $\mathrm{NO_2}$ nastane ena molekula $\mathrm{N_2O_4}$.

**6. Računanje sestave.** Uporabimo tabelo začetek – sprememba – ravnotežje, ki jo poznaš iz stehiometrije. Razlika je v zadnji vrstici: reaktant se ne porabi do konca. Spremembo zapišemo z neznanko $x$ v razmerju koeficientov, ravnotežne vrednosti vstavimo v izraz za $K$ in rešimo enačbo za $x$.

## Rešeni primeri

### Primer 1 (lažji): korak glikolize

V celicah se glukoza-6-fosfat (G6P) pretvarja v fruktozo-6-fosfat (F6P): $\mathrm{G6P \rightleftharpoons F6P}$. V epruveti z encimom pri $37\,\mathrm{°C}$ je v ravnotežju $[\mathrm{G6P}] = 2{,}0\,\mathrm{mmol/L}$ in $[\mathrm{F6P}] = 0{,}84\,\mathrm{mmol/L}$. Izračunaj $K$. V delujoči mišični celici izmerijo $[\mathrm{G6P}] = 1{,}0\,\mathrm{mmol/L}$ in $[\mathrm{F6P}] = 0{,}10\,\mathrm{mmol/L}$. V katero smer teče reakcija v celici?

**Podatki:** v ravnotežju $[\mathrm{G6P}] = 2{,}0\,\mathrm{mmol/L}$, $[\mathrm{F6P}] = 0{,}84\,\mathrm{mmol/L}$; v celici $[\mathrm{G6P}] = 1{,}0\,\mathrm{mmol/L}$, $[\mathrm{F6P}] = 0{,}10\,\mathrm{mmol/L}$
**Iščemo:** $K$ in smer reakcije v celici

:::formula
$K = \dfrac{[\mathrm{F6P}]}{[\mathrm{G6P}]}$, za celico enak izraz $Q$ s trenutnimi koncentracijami
:::

**Rešitev:**

1. $K = \dfrac{0{,}84}{2{,}0} = 0{,}42$. Enote se pokrajšajo, ker sta koeficienta enaka.
2. $K < 1$, zato je v ravnotežju več G6P kot F6P.
3. V celici: $Q = \dfrac{0{,}10}{1{,}0} = 0{,}10$.
4. $Q < K$, zato reakcija teče v desno, proti F6P.
5. Odgovor: $K = 0{,}42$. V celici nastaja F6P, ker ga naslednji korak glikolize sproti porablja in ravnotežje nikoli ni doseženo.

### Primer 2: več etanola, več estra

Ocetna kislina in etanol tvorita ester etil etanoat in vodo: $\mathrm{CH_3COOH + C_2H_5OH \rightleftharpoons CH_3COOC_2H_5 + H_2O}$, $K = 4{,}00$. Zmešamo $1{,}00\,\mathrm{mol}$ kisline in $2{,}00\,\mathrm{mol}$ etanola. Koliko estra je v ravnotežju?

**Podatki:** $n_0(\mathrm{kislina}) = 1{,}00\,\mathrm{mol}$, $n_0(\mathrm{etanol}) = 2{,}00\,\mathrm{mol}$, na začetku ni estra ne vode, $K = 4{,}00$
**Iščemo:** množino estra v ravnotežju

:::formula
$K = \dfrac{[\mathrm{ester}]\,[\mathrm{H_2O}]}{[\mathrm{kislina}]\,[\mathrm{etanol}]}$
:::

**Rešitev:**

1. Tabela v mol (ester in voda nastajata enako):

| | kislina | etanol | ester, voda |
|---|---|---|---|
| začetek | $1{,}00$ | $2{,}00$ | $0$ |
| sprememba | $-x$ | $-x$ | $+x$ |
| ravnotežje | $1{,}00 - x$ | $2{,}00 - x$ | $x$ |

2. Vsako koncentracijo dobimo kot $\frac{n}{V}$. Zgoraj in spodaj sta po dva $V$, zato se prostornina pokrajša in lahko računamo kar z množinami.
3. Enačba:

$$\frac{x^2}{(1{,}00 - x)(2{,}00 - x)} = 4{,}00$$

4. Odpravimo ulomek in uredimo: $x^2 = 4(2 - 3x + x^2)$, torej

$$3x^2 - 12x + 8 = 0$$

5. Rešitvi sta $x = \frac{12 \pm \sqrt{48}}{6}$: $x_1 = 0{,}845$ in $x_2 = 3{,}15$. Druga ni mogoča, ker bi porabili več kisline, kot je imamo.
6. Odgovor: v ravnotežju je $0{,}845\,\mathrm{mol}$ estra. Z enako množino obeh reaktantov bi dobili le $\frac{2}{3}\,\mathrm{mol}$; presežek etanola je ravnotežje premaknil v desno, kot napove Le Chatelierovo načelo.

### Primer 3 (težji): ogljikov monoksid v garaži

Ogljikov monoksid izpodriva kisik s hemoglobina: $\mathrm{HbO_2 + CO \rightleftharpoons HbCO + O_2}$. Za to ravnotežje v krvi velja (plina zapišemo z delnima tlakoma, hemoglobin s koncentracijo)

$$K = \frac{[\mathrm{HbCO}]\,p(\mathrm{O_2})}{[\mathrm{HbO_2}]\,p(\mathrm{CO})} = 230$$

Človek dalj časa diha zrak, v katerem je v pljučnih mešičkih $p(\mathrm{O_2}) = 14\,\mathrm{kPa}$ in $p(\mathrm{CO}) = 0{,}010\,\mathrm{kPa}$. Kolikšen delež hemoglobina, ki nosi plin, je vezan s CO?

**Podatki:** $K = 230$, $p(\mathrm{O_2}) = 14\,\mathrm{kPa}$, $p(\mathrm{CO}) = 0{,}010\,\mathrm{kPa}$; hemoglobin je vezan ali s $\mathrm{O_2}$ ali s CO
**Iščemo:** delež $\dfrac{[\mathrm{HbCO}]}{[\mathrm{HbCO}] + [\mathrm{HbO_2}]}$

:::formula
$\dfrac{[\mathrm{HbCO}]}{[\mathrm{HbO_2}]} = K\,\dfrac{p(\mathrm{CO})}{p(\mathrm{O_2})}$
:::

**Rešitev:**

1. Iz izraza za $K$ izrazimo razmerje oblik hemoglobina, ker je to edina neznanka.
2. $\dfrac{[\mathrm{HbCO}]}{[\mathrm{HbO_2}]} = 230 \cdot \dfrac{0{,}010}{14} = 0{,}164$.
3. Na vsakih $1000$ molekul $\mathrm{HbO_2}$ je torej $164$ molekul HbCO. Delež izračunaj sam.

:::premisli
Kolikšen je delež HbCO? In kako bi po Le Chatelierju bolniku najhitreje pomagali?
---
Delež je $\dfrac{0{,}164}{1 + 0{,}164} = 0{,}141$, torej okoli $14\,\%$, čeprav je CO v zraku le stotinka odstotka. Bolnik dobi čisti kisik, včasih v komori pod povišanim tlakom. Velik $p(\mathrm{O_2})$ premakne ravnotežje v levo in CO se sprosti s hemoglobina.
:::

## Pogoste napake

- **»V ravnotežju so koncentracije enake.«** Enaki sta hitrosti, ne koncentraciji. Pri HI je v ravnotežju sedemkrat več produkta kot vsakega reaktanta. Enake koncentracije bi pri reakciji tipa $\mathrm{A \rightleftharpoons B}$ pomenile $K = 1$.
- **»V ravnotežju se reakcija ustavi.«** Na grafu je videti tako, a molekule se še naprej pretvarjajo v obe smeri. Zato se ravnotežje takoj odzove na vsako motnjo.
- **»Dodatek snovi ali katalizator spremeni $K$.«** Dodatek spremeni $Q$, ne $K$; zmes se premakne nazaj k isti $K$. Katalizator pospeši obe smeri enako. Konstanto spremeni le temperatura.
- **Napačne vrednosti v izrazu za $K$.** Vstaviti je treba ravnotežne koncentracije, ne začetnih, s koeficienti kot potencami. V tabeli začetek – sprememba – ravnotežje so spremembe v razmerju koeficientov: pri $\mathrm{2\,HI}$ je sprememba $2x$, ne $x$.
- **Množine namesto koncentracij.** Prostornina se pokrajša le, če je potenc v števcu in imenovalcu enako. Pri $\mathrm{N_2O_4 \rightleftharpoons 2\,NO_2}$ se ne, zato najprej izračunaj koncentracije.

## Povzetek

- Ravnotežje je dinamično: hitrosti v obe smeri sta enaki, koncentracije se ne spreminjajo.
- $K$ je količnik ravnotežnih koncentracij produktov in reaktantov s koeficienti kot potencami; odvisna je samo od temperature.
- Obrnjena enačba ima $\frac{1}{K}$, podvojena $K^2$, vsota enačb produkt konstant.
- $Q$ s trenutnimi koncentracijami: $Q < K$ teče v desno, $Q > K$ v levo.
- Le Chatelier: dodatek snovi, tlak in temperatura premaknejo ravnotežje; $K$ spremeni samo temperatura, katalizator ničesar ne premakne.
- Sestavo izračunaš s tabelo začetek – sprememba – ravnotežje in enačbo za $x$; nesmiselni koren zavrzi.

## Drugače: Z analogijo

Predstavljaj si dve dvorani, povezani z vrati. V levi je dolgočasno predavanje, v desni koncert. Ljudje hodijo v obe smeri, saj se nekaterim koncert zazdi preglasen.

Čez nekaj časa skozi vrata v vsaki minuti v desno odide toliko ljudi kot v levo. Število ljudi v dvoranah se ne spreminja več, čeprav ljudje še hodijo. To je dinamično ravnotežje. V koncertni dvorani je več ljudi, ker je bolj privlačna: to je $K > 1$.

Če v levo dvorano pripelješ še avtobus ljudi, jih bo več odšlo v desno, dokler se razmerje ne vrne. To je Le Chatelier. Razmerje se spremeni samo, če se spremeni privlačnost dvoran. Pri reakciji to stori temperatura.

## Drugače: Iz vsakdanjega življenja

- **Gazirana pijača v hladilniku.** Raztapljanje $\mathrm{CO_2}$ v vodi je eksotermno. Pri nižji temperaturi se ravnotežje premakne k raztopljenemu plinu, zato hladna pijača ostane dlje gazirana kot topla.
- **Aklimatizacija v gorah.** Ko planinec nekaj tednov živi na višini, telo naredi več hemoglobina. Več reaktanta $\mathrm{Hb}$ premakne $\mathrm{Hb + O_2 \rightleftharpoons HbO_2}$ v desno, zato kri spet prenese dovolj kisika, čeprav je $p(\mathrm{O_2})$ nizek.
- **Zaprta plastenka.** Nad tekočino se nabere $\mathrm{CO_2}$, dokler ne nastopi ravnotežje. Zato zaprta pijača ne izgublja plina, odprta pa ga izgublja, dokler se ne izenači z zrakom, v katerem je $\mathrm{CO_2}$ zelo malo.

## Preveri se

? Zdravnik pove, da sta v pljučnih kapilarah hemoglobin in kisik »v ravnotežju« s $\mathrm{HbO_2}$. Kaj to pomeni?
- Koncentraciji $\mathrm{Hb}$ in $\mathrm{HbO_2}$ sta enaki.
~ Ravnotežje ne pomeni enakih koncentracij, ampak enake hitrosti obeh smeri. V pljučih je $\mathrm{HbO_2}$ veliko več.
- Kisik se ne veže več in se ne sprošča.
~ Vezava in sproščanje tečeta naprej, le enako hitro. Ravnotežje je dinamično.
+ Kisik se veže in sprošča enako hitro, zato se sestava krvi ne spreminja.
- Ves hemoglobin je vezan s kisikom.
~ To bi pomenilo, da je reakcija potekla do konca. V ravnotežju je vedno nekaj obeh oblik.
> Ravnotežje je stanje, v katerem sta hitrosti reakcije v obe smeri enaki.

? Razvrsti reakcije od tiste, pri kateri je v ravnotežju najmanjši delež produkta, do tiste z največjim. Vse so tipa $\mathrm{A \rightleftharpoons B}$.
1. dihidroksiaceton fosfat $\rightleftharpoons$ gliceraldehid-3-fosfat, $K \approx 0{,}05$
2. G6P $\rightleftharpoons$ F6P, $K = 0{,}42$
3. F6P $\rightleftharpoons$ G6P, obratna reakcija prejšnje
4. fumarat $\rightleftharpoons$ malat, $K \approx 4$
> Delež produkta raste s $K$. Obratna reakcija ima $K = \frac{1}{0{,}42} = 2{,}4$, zato je med $0{,}42$ in $4$.

? Vezava kisika na hemoglobin je eksotermna. Kaj se zgodi v mišici, ki se med tekom segreje?
- Hemoglobin veže več kisika, ker hitreje reagira.
~ Višja temperatura res pospeši reakcijo, a v obe smeri. O legi ravnotežja odloča predznak $\Delta H$.
+ Ravnotežje se premakne v levo in $\mathrm{HbO_2}$ odda več kisika.
- Spremeni se le hitrost, $K$ ostane enaka.
~ Temperatura je edini poseg, ki spremeni $K$. Za eksotermno reakcijo se $K$ s segrevanjem zmanjša.
- Nič, ker je hemoglobin katalizator.
~ Hemoglobin ni katalizator, ampak reaktant, ki veže kisik.
> Segrevanje premakne ravnotežje v smer endotermne reakcije, to je razpad $\mathrm{HbO_2}$. Toplejša mišica tako dobi več kisika.

? Pri $430\,\mathrm{°C}$ je za $\mathrm{H_2 + I_2 \rightleftharpoons 2\,HI}$ konstanta $K = 54{,}3$. V posodo damo $\mathrm{H_2}$ in $\mathrm{I_2}$, vsakega s koncentracijo $0{,}500\,\mathrm{mol/L}$. Kolikšna je ravnotežna koncentracija HI?
= 0,787 mol/L | 0,005
~ 0,393 | To je $x$. HI nastaja z dvojnim koeficientom, zato je $[\mathrm{HI}] = 2x$.
~ 0,107 | To je ravnotežna koncentracija $\mathrm{H_2}$ ali $\mathrm{I_2}$, ne HI.
> Iz $\frac{(2x)^2}{(0{,}500 - x)^2} = 54{,}3$ sledi $\frac{2x}{0{,}500 - x} = 7{,}37$, torej $x = 0{,}393\,\mathrm{mol/L}$ in $[\mathrm{HI}] = 2x = 0{,}787\,\mathrm{mol/L}$.

? Graf kaže potek reakcije $\mathrm{N_2O_4(g) \rightleftharpoons 2\,NO_2(g)}$ pri $100\,\mathrm{°C}$. Odčitaj ravnotežni koncentraciji in izračunaj $K$ v mol/L.
:::risba graf
opis: Koncentracije v odvisnosti od časa. Koncentracija N₂O₄ pada od 0,100 mol/L in se ustali pri 0,040 mol/L. Koncentracija NO₂ raste od 0 in se ustali pri 0,120 mol/L.
x: 0 .. 5 | 1 | čas
y: 0 .. 0,14 | 0,02 | c v mol/L
f: 0.04 + 0.06*exp(-1.5*x) | modra
f: 0.12*(1 - exp(-1.5*x)) | oranžna črtkano
oznakay: 0,04 | 0,040
oznakay: 0,12 | 0,120
napis: 4; 0,04 | N_2O_4 | nad | modra
napis: 4; 0,12 | NO_2 | pod | oranžna
:::
= 0,36 mol/L | 0,005
~ 3 | Pozabil si kvadrirati $[\mathrm{NO_2}]$: koeficient 2 je potenca.
~ 2,78 | Obrnil si ulomek: produkt je v števcu.
~ 0,144 | Vstavil si začetno koncentracijo $\mathrm{N_2O_4}$ namesto ravnotežne.
> $K = \frac{[\mathrm{NO_2}]^2}{[\mathrm{N_2O_4}]} = \frac{0{,}120^2}{0{,}040} = 0{,}36\,\mathrm{mol/L}$.

<<RACUN
kemija: H2 + I2 -> 2 HI
kemija: N2O4 -> 2 NO2
kemija: CH3COOH + C2H5OH -> CH3COOC2H5 + H2O
vrednost: 1.573^2/(0.214*0.214) | 54.0
vrednost: 0.939^2/(0.531*0.0306) | 54.3
vrednost: 0.787^2/(0.107*0.107) | 54.1
vrednost: 0.84/2.0 | 0.42
vrednost: 0.10/1.0 | 0.10
resi: 3*x^2-12*x+8=0 | x | 2-2*sqrt(3)/3, 2+2*sqrt(3)/3
vrednost: (12-sqrt(48))/6 | 0.845
vrednost: (12+sqrt(48))/6 | 3.15
vrednost: 230*0.010/14 | 0.164
vrednost: 0.1643/(1+0.1643) | 0.141
vrednost: 0.5*sqrt(54.3)/(2+sqrt(54.3)) | 0.393
vrednost: sqrt(54.3)/(2+sqrt(54.3)) | 0.787
vrednost: 0.5-0.5*sqrt(54.3)/(2+sqrt(54.3)) | 0.107
vrednost: 0.120^2/0.040 | 0.36
vrednost: 1/0.42 | 2.4
>>

:::simboli
K | konstanta ravnotežja | K = \frac{[\mathrm{C}]^c\,[\mathrm{D}]^d}{[\mathrm{A}]^a\,[\mathrm{B}]^b} | | enota je odvisna od reakcije; odvisna samo od temperature
Q | reakcijski količnik | | | isti izraz kot $K$, s trenutnimi koncentracijami
a, b, c, d | koeficienti v urejeni enačbi | | – |
x | sprememba množine ali koncentracije (neznanka v tabeli) | | mol ali mol/L |
p | delni tlak plina | | kPa | $p(\mathrm{O_2})$ za kisik, $p(\mathrm{CO})$ za ogljikov monoksid
:::
