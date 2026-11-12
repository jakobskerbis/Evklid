---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Luka pomaga dedku obnavljati kamnito hišo na Krasu. Za malto potrebujeta apno. Včasih so ga žgali sami: v apnenici, veliki kamniti peči, so apnenec več dni segrevali pri $900\,^\circ\mathrm{C}$ ali več. Pri tem iz kamna izhaja ogljikov dioksid, ostane pa žgano apno:

$$\mathrm{CaCO_3} \rightleftharpoons \mathrm{CaO} + \mathrm{CO_2}$$

Luka ima predlog: »Peč bi morali neprodušno zapreti. Toplota bi ostala notri in ves kamen bi se prej spremenil v apno.« Dedek odkima: »V zaprti peči bi ti ostal skoraj sam kamen.«

Kdo ima prav? Namig je dvojna puščica v enačbi: pomeni, da reakcija poteka v obe smeri (pravimo ji **obojesmerna** reakcija): apnenec razpada, žgano apno pa ogljikov dioksid veže nazaj. Kje taka reakcija obstane, pove kemijsko ravnotežje. Lukovo trditev razrešimo v primeru 3.

## Razlaga

**1. Poskus v zaprti posodi.** Začnimo z reakcijo, v kateri so vse snovi plini. V zaprto posodo pri stalni temperaturi damo vodik in jodove pare, vsakega s koncentracijo $1{,}00\,\mathrm{mol/L}$. Nastaja vodikov jodid:

$$\mathrm{H_2} + \mathrm{I_2} \rightleftharpoons 2\,\mathrm{HI}$$

Koncentracije merimo v več trenutkih. Zadnji stolpec je razmerje $\dfrac{c(\mathrm{HI})^2}{c(\mathrm{H_2}) \cdot c(\mathrm{I_2})}$; kvadrat je zato, ker v enačbi nastopata dve molekuli HI.

| čas (min) | $\mathrm{H_2}$, $\mathrm{I_2}$ | HI | razmerje |
|---|---|---|---|
| $0$ | $1{,}00$ | $0$ | $0$ |
| $10$ | $0{,}60$ | $0{,}80$ | $1{,}8$ |
| $20$ | $0{,}40$ | $1{,}20$ | $9$ |
| $40$ | $0{,}25$ | $1{,}50$ | $36$ |
| $120$ | $0{,}20$ | $1{,}60$ | $64$ |

Koncentracije so v $\mathrm{mol/L}$; številke so zaokrožen šolski zgled. Iste vrednosti kaže graf: krivulji se po približno $60$ minutah izravnata.

:::risba graf
opis: Graf koncentracij v odvisnosti od časa od 0 do 120 minut. Koncentracija vodika in joda pada od 1,00 mol/L in se izravna pri 0,20 mol/L. Koncentracija vodikovega jodida raste od 0 in se izravna pri 1,60 mol/L. Označeni sta točki pri 20 minutah: 0,40 mol/L za vodik in jod ter 1,20 mol/L za vodikov jodid.
x: 0 .. 140 | 20 | t (min)
y: 0 .. 1,8 | 0,2 | c (mol/L)
f: 0.2 + 0.8*2^(-x/10) | oranžna | 0 .. 120
f: 1.6 - 1.6*2^(-x/10) | modra | 0 .. 120
točka: 20; 0,4 | 0,40 | nad desno | oranžna
točka: 20; 1,2 | 1,20 | pod desno | modra
napis: 80; 1,6 | HI | nad | modra
napis: 80; 0,2 | vodik in jod | nad | oranžna
:::

Ko HI nastaja, koncentracija reaktantov pada in reakcija v desno (nastajanje HI) se upočasnjuje, saj je trkov $\mathrm{H_2}$ z $\mathrm{I_2}$ vse manj. Hkrati je vse več HI, zato vse pogosteje poteka obratna reakcija, razpad HI nazaj v $\mathrm{H_2}$ in $\mathrm{I_2}$.

*Hitri preizkus:* koliko HI nastane, ko se porabi $0{,}40\,\mathrm{mol/L}$ vodika? ($0{,}80\,\mathrm{mol/L}$, ker iz ene molekule $\mathrm{H_2}$ nastaneta dve molekuli HI.)

**2. Dinamično ravnotežje.** Od nekega trenutka naprej se koncentracije ne spreminjajo več. Reakcija se ni ustavila: v vsaki sekundi nastane enako molekul HI, kot jih razpade. Stanje, v katerem sta hitrosti reakcije v desno in obratne reakcije enaki, imenujemo **kemijsko ravnotežje**. Ker obe reakciji tečeta naprej, je ravnotežje **dinamično**.

*Hitri preizkus:* sta v ravnotežju koncentraciji $\mathrm{H_2}$ in HI enaki? (Ne: $0{,}20$ in $1{,}60\,\mathrm{mol/L}$. Enaki sta hitrosti.)

:::premisli
Drugi poskus pri isti temperaturi: na začetku je $c(\mathrm{H_2}) = 1{,}00\,\mathrm{mol/L}$ in $c(\mathrm{I_2}) = 2{,}00\,\mathrm{mol/L}$. V ravnotežju izmerimo $c(\mathrm{H_2}) \approx 0{,}053\,\mathrm{mol/L}$, $c(\mathrm{I_2}) \approx 1{,}053\,\mathrm{mol/L}$ in $c(\mathrm{HI}) \approx 1{,}89\,\mathrm{mol/L}$. Napovej razmerje, preden računaš.
---
Spet približno $64$: $\dfrac{1{,}89^2}{0{,}053 \cdot 1{,}053} \approx 64$. Koncentracije so drugačne kot v prvem poskusu, razmerje pa enako.
:::

**3. Konstanta ravnotežja.** Razmerje, ki je v ravnotežju pri dani temperaturi vedno enako, imenujemo **konstanta ravnotežja** $K$. Zakaj je stalno? Vzemimo, da reakcija poteka v enem koraku, s trkom. Hitrost reakcije v desno je tedaj sorazmerna številu trkov $\mathrm{H_2}$ z $\mathrm{I_2}$, torej zmnožku $c(\mathrm{H_2}) \cdot c(\mathrm{I_2})$. Hitrost obratne reakcije je sorazmerna številu trkov dveh molekul HI, torej $c(\mathrm{HI})^2$. V ravnotežju sta hitrosti enaki. Če sorazmernostna faktorja označimo s $k_1$ in $k_2$, velja enačba $k_1 \cdot c(\mathrm{H_2}) \cdot c(\mathrm{I_2}) = k_2 \cdot c(\mathrm{HI})^2$. Delimo in dobimo $\dfrac{c(\mathrm{HI})^2}{c(\mathrm{H_2}) \cdot c(\mathrm{I_2})} = \dfrac{k_1}{k_2}$. Desna stran je pri dani temperaturi stalna, in to je $K$. Večina reakcij poteka v več korakih; da izraz za $K$ velja tudi zanje, potrjujejo meritve.

Za splošno reakcijo

$$a\,\mathrm{A} + b\,\mathrm{B} \rightleftharpoons x\,\mathrm{C} + y\,\mathrm{D}$$

jo zapišemo z ravnotežnimi koncentracijami. Označimo jih z oglatimi oklepaji: $[\mathrm{HI}]$ je $c(\mathrm{HI})$ v ravnotežju.

$$K = \frac{[\mathrm{C}]^x \cdot [\mathrm{D}]^y}{[\mathrm{A}]^a \cdot [\mathrm{B}]^b}$$

Produkti so v števcu, reaktanti v imenovalcu, stehiometrijski koeficienti postanejo eksponenti. $K$ se spremeni le, če spremenimo temperaturo.

*Hitri preizkus:* zapiši $K$ za $\mathrm{N_2} + 3\,\mathrm{H_2} \rightleftharpoons 2\,\mathrm{NH_3}$. ($K = \dfrac{[\mathrm{NH_3}]^2}{[\mathrm{N_2}] \cdot [\mathrm{H_2}]^3}$.)

**4. Kaj pove velikost $K$.** Vzemimo najpreprostejšo reakcijo $\mathrm{A} \rightleftharpoons \mathrm{B}$ s $K = \dfrac{[\mathrm{B}]}{[\mathrm{A}]}$. Slika kaže, kolikšen delež snovi je v ravnotežju v obliki A in kolikšen v obliki B. Pri $K = 10$ je produkta desetkrat več kot reaktanta: deleža sta $0{,}09$ in $0{,}91$. V aplikaciji z drsnikom pod sliko spreminjaj $K$ od $0{,}01$ do $100$. Opazuj, pri katerem $K$ sta stolpca enaka in kdaj eden skoraj izgine. Deleža veljata za to enačbo; pri HI s $K = 64$ je zaradi kvadrata v izrazu delež HI $0{,}80$.

:::risba graf
opis: Dva stolpca za ravnotežje reakcije A ⇌ B. Levi stolpec kaže delež reaktanta A, desni delež produkta B. V aplikaciji drsnik spreminja konstanto ravnotežja K od 0,01 do 100. Izbrano je K = {exp(2.302585*n)}: delež A je {1/(1+exp(2.302585*n))}, delež B je {1 - 1/(1+exp(2.302585*n))}.
x: 0 .. 4 | 1 | snov
y: 0 .. 1,2 | 0,25 | delež
oznake: ne
oznakax: 1 | reaktant A
oznakax: 3 | produkt B
oznakay: 0,5 | 0,5
oznakay: 1 | 1
drsnik: n | -2 .. 2 | 1 | 1 | desetiška potenca konstante K
pravokotnik: 0.5; 0 .. 1.5; 1/(1+10^n) | oranžna polno
pravokotnik: 2.5; 0 .. 3.5; 1 - 1/(1+10^n) | modra polno
napis: 1; 1/(1+exp(2.302585*n)) | {1/(1+exp(2.302585*n))} | nad
napis: 3; 1 - 1/(1+exp(2.302585*n)) | {1 - 1/(1+exp(2.302585*n))} | nad
podnapis: K = {exp(2.302585*n)}: delež A je {1/(1+exp(2.302585*n))}, delež B je {1 - 1/(1+exp(2.302585*n))}
:::

Velik $K$ (na primer $10^5$) torej pomeni, da so v ravnotežju skoraj sami produkti; majhen $K$ (na primer $10^{-5}$), da so skoraj sami reaktanti. Pri reakciji $\mathrm{A} \rightleftharpoons \mathrm{B}$ je pri $K = 1$ obojega enako. $K$ ne pove nič o tem, kako hitro pridemo do ravnotežja.

**5. Kaj, če ravnotežje zmotimo?** Vrnimo se k prvemu poskusu v ravnotežju ($0{,}20$; $0{,}20$; $1{,}60$) in dodajmo vodik, da $c(\mathrm{H_2})$ naraste na $0{,}40\,\mathrm{mol/L}$. Razmerje je v tistem trenutku le

$$\frac{1{,}60^2}{0{,}40 \cdot 0{,}20} = 32$$

kar je manj od $K = 64$. Razmerje s trenutnimi koncentracijami označimo s $Q$ (reakcijski kvocient); simulacija spodaj ga izpisuje. Sistem ni več v ravnotežju. Reakcija v desno je zdaj hitrejša od obratne, zato nastaja HI, dokler razmerje spet ne doseže $64$.

Slika kaže ta poseg: do desete minute je zmes v ravnotežju, nato dodamo $0{,}2\,\mathrm{mol/L}$ vodika. Koncentracija vodika (polna črta) skoči na $0{,}40$, nato pade na $0{,}338\,\mathrm{mol/L}$; jod (črtkana črta) pade na $0{,}138$, HI naraste na $1{,}725\,\mathrm{mol/L}$. Dodanega vodika se torej porabi le del. V aplikaciji z drsnikom spreminjaj količino dodanega vodika. Opazuj, da se vodik nikoli ne vrne na $0{,}20$ in da je razmerje na koncu vedno približno $64$ (vrednosti so zaokrožene).

:::risba graf
opis: Graf koncentracij v odvisnosti od časa od 0 do 40 minut. Do desete minute je zmes v ravnotežju: vodik in jod 0,20 mol/L, vodikov jodid 1,60 mol/L. V deseti minuti dodamo vodik; v aplikaciji drsnik spreminja dodano količino od 0,1 do 0,8 mol/L. Izbrano je {d} mol/L: vodik skoči na {0.2+d:.2} in nato pade na {0.2+d-((32+64*d)-sqrt((32+64*d)*(32+64*d)-3072*d))/120:.3} mol/L, jod pade na {0.2-((32+64*d)-sqrt((32+64*d)*(32+64*d)-3072*d))/120:.3} mol/L, vodikov jodid naraste na {1.6+((32+64*d)-sqrt((32+64*d)*(32+64*d)-3072*d))/60:.3} mol/L. Razmerje je na koncu spet približno 64. Vodik je narisan s polno, jod s črtkano črto.
x: 0 .. 50 | 10 | t (min)
y: 0 .. 2,2 | 0,2 | c (mol/L)
višina: 380
drsnik: d | 0,1 .. 0,8 | 0,1 | 0,2 | dodani vodik v mol/L
f: 0.2 | oranžna | 0 .. 10
f: 1.6 | modra | 0 .. 10
črta: 10; 0.2 -> 10; 0.2+d | oranžna
f: 0.2+d-((32+64*d)-sqrt((32+64*d)^2-3072*d))/120*(1-2^(-(x-10)/4)) | oranžna | 10 .. 40
f: 0.2-((32+64*d)-sqrt((32+64*d)^2-3072*d))/120*(1-2^(-(x-10)/4)) | zelena črtkano | 10 .. 40
f: 1.6+((32+64*d)-sqrt((32+64*d)^2-3072*d))/60*(1-2^(-(x-10)/4)) | modra | 10 .. 40
napis: 40; 1.6+((32+64*d)-sqrt((32+64*d)^2-3072*d))/60 | HI | desno | modra
napis: 4; 0,2 | H_2, I_2 | nad | oranžna
napis: 40; 0.2+d-((32+64*d)-sqrt((32+64*d)^2-3072*d))/120 | H_2 | desno | oranžna
napis: 40; 0.2-((32+64*d)-sqrt((32+64*d)^2-3072*d))/120 | I_2 | desno | zelena
črta: 10; 0 -> 10; 2,2 | siva črtkano
napis: 10; 2,05 | dodamo H_2 | desno
podnapis: Dodamo {d} mol/L vodika. Novo ravnotežje: vodik {0.2+d-((32+64*d)-sqrt((32+64*d)*(32+64*d)-3072*d))/120:.3}, jod {0.2-((32+64*d)-sqrt((32+64*d)*(32+64*d)-3072*d))/120:.3}, HI {1.6+((32+64*d)-sqrt((32+64*d)*(32+64*d)-3072*d))/60:.3} mol/L; razmerje je približno 64.
:::

*Hitri preizkus:* zakaj po dodatku vodika pade tudi koncentracija joda, čeprav ga nismo odvzemali? (Ker se pri nastajanju HI porablja skupaj z vodikom.)

:::premisli
Kaj bi se zgodilo, če bi iz ravnotežne zmesi sproti odstranjevali HI? V katero smer bi tekla reakcija in kaj bi se dogajalo s $K$?
---
Reakcija bi tekla v smer nastajanja HI, ker bi razmerje padlo pod $64$. $K$ ostane $64$, ker se temperatura ni spremenila.
:::

**6. Le Chatelierjevo načelo.** Ta primer posplošimo: *če sistemu v ravnotežju spremenimo pogoje, se ravnotežje premakne v smer, ki to spremembo delno izniči.*

- **Koncentracija:** dodamo snov, sistem jo porablja; odvzamemo snov, sistem jo dela. Izjema so trdne snovi: več apnenca v peči ravnotežja ne premakne.
- **Tlak (pri plinih):** stisnemo posodo, ravnotežje se premakne na stran z manj molekulami plina. Preveri z razmerjem: zmes $2\,\mathrm{NO_2} \rightleftharpoons \mathrm{N_2O_4}$ s $K = 8$ in koncentracijama $0{,}050$ ter $0{,}020\,\mathrm{mol/L}$ stisnemo na polovico prostornine. Koncentraciji se podvojita, razmerje pa je le $\dfrac{0{,}040}{0{,}10^2} = 4$, manj od $8$: reakcija teče v desno, k eni molekuli namesto dveh. Pri $\mathrm{H_2} + \mathrm{I_2} \rightleftharpoons 2\,\mathrm{HI}$ sta na obeh straneh dve molekuli; razmerje se ob stiskanju ne spremeni, zato tlak nima vpliva.
- **Temperatura:** segrevanje podpira endotermno smer (tisto, ki toploto porablja), ohlajanje eksotermno (tisto, ki toploto sprošča). Toploto si predstavljaj kot reaktant endotermne smeri: če jo dodaš, jo sistem porablja. Samo ta sprememba spremeni tudi vrednost $K$. Pri endotermnem razpadu apnenca ravnotežni tlak $\mathrm{CO_2}$ zraste z $22\,\mathrm{kPa}$ pri $800\,^\circ\mathrm{C}$ na $105\,\mathrm{kPa}$ pri $900\,^\circ\mathrm{C}$ (primer 3).
- **Katalizator:** obe smeri pospeši enako, zato ravnotežja ne premakne. Do ravnotežja pridemo le prej.

*Hitri preizkus:* v katero smer se premakne $\mathrm{N_2} + 3\,\mathrm{H_2} \rightleftharpoons 2\,\mathrm{NH_3}$, če posodo stisnemo? (V desno: tam sta dve molekuli plina, na levi štiri.)

V simulaciji spodaj »Dinamično ravnotežje in Le Chatelierovo načelo« poteka reakcija $2\,\mathrm{NO_2} \rightleftharpoons \mathrm{N_2O_4}$, ki je v smeri nastajanja $\mathrm{N_2O_4}$ eksotermna. Pritisni »Dodaj NO₂« in na grafu spremljaj obe krivulji: koliko $\mathrm{NO_2}$ se porabi in koliko $\mathrm{N_2O_4}$ nastane. Preden zvišaš temperaturo, napovej, katera krivulja se bo dvignila.

## Rešeni primeri

### Primer 1: izračun konstante

Za reakcijo $2\,\mathrm{NO_2} \rightleftharpoons \mathrm{N_2O_4}$ v ravnotežju izmerimo $[\mathrm{NO_2}] = 0{,}050\,\mathrm{mol/L}$ in $[\mathrm{N_2O_4}] = 0{,}020\,\mathrm{mol/L}$. Kolikšna je konstanta ravnotežja?

**Podatki:** $[\mathrm{NO_2}] = 0{,}050\,\mathrm{mol/L}$, $[\mathrm{N_2O_4}] = 0{,}020\,\mathrm{mol/L}$
**Iščemo:** $K$

:::formula
$K = \dfrac{[\mathrm{N_2O_4}]}{[\mathrm{NO_2}]^2}$
:::

**Rešitev:**

1. Koeficient pred $\mathrm{NO_2}$ je $2$, zato je njegova koncentracija v kvadratu.
2. $[\mathrm{NO_2}]^2 = 0{,}050^2 = 0{,}0025$.
3. $K = \dfrac{0{,}020}{0{,}0025} = 8$.
4. Odgovor: konstanta ravnotežja je $8$.

### Primer 2: manjkajoča koncentracija

Za $\mathrm{H_2} + \mathrm{I_2} \rightleftharpoons 2\,\mathrm{HI}$ je pri dani temperaturi $K = 64$. V ravnotežju sta $[\mathrm{H_2}] = 0{,}10\,\mathrm{mol/L}$ in $[\mathrm{I_2}] = 0{,}40\,\mathrm{mol/L}$. Kolikšna je $[\mathrm{HI}]$?

**Podatki:** $K = 64$, $[\mathrm{H_2}] = 0{,}10\,\mathrm{mol/L}$, $[\mathrm{I_2}] = 0{,}40\,\mathrm{mol/L}$
**Iščemo:** $[\mathrm{HI}]$

:::formula
$K = \dfrac{[\mathrm{HI}]^2}{[\mathrm{H_2}] \cdot [\mathrm{I_2}]}$, torej $[\mathrm{HI}]^2 = K \cdot [\mathrm{H_2}] \cdot [\mathrm{I_2}]$
:::

**Rešitev:**

1. Izrazimo kvadrat neznanke: $[\mathrm{HI}]^2 = 64 \cdot 0{,}10 \cdot 0{,}40 = 2{,}56$.
2. Korenimo, ker je v izrazu kvadrat: $[\mathrm{HI}] = \sqrt{2{,}56} = 1{,}6$.
3. Odgovor: v ravnotežju je $[\mathrm{HI}] = 1{,}6\,\mathrm{mol/L}$.

### Primer 3: Lukova zaprta apnenica

Apnenec razpada po enačbi $\mathrm{CaCO_3(s)} \rightleftharpoons \mathrm{CaO(s)} + \mathrm{CO_2(g)}$; reakcija v desno je endotermna. V zaprti posodi se razpad navidez ustavi, ko tlak $\mathrm{CO_2}$ doseže ravnotežno vrednost: pri $800\,^\circ\mathrm{C}$ približno $22\,\mathrm{kPa}$, pri $900\,^\circ\mathrm{C}$ približno $105\,\mathrm{kPa}$. Zračni tlak je $101\,\mathrm{kPa}$. Vzemimo, da Lukova neprodušno zaprta peč brez vleka doseže le $800\,^\circ\mathrm{C}$ ($1073\,\mathrm{K}$) in da je v njej med kamni $1\,\mathrm{m^3}$ prostora za plin. Koliko apnenca razpade? Zakaj se v odprti peči pri $900\,^\circ\mathrm{C}$ razgradi ves apnenec?

**Podatki:** ravnotežni tlak $\mathrm{CO_2}$: $22\,\mathrm{kPa}$ pri $800\,^\circ\mathrm{C}$ in $105\,\mathrm{kPa}$ pri $900\,^\circ\mathrm{C}$; zračni tlak $101\,\mathrm{kPa}$; $T = 1073\,\mathrm{K}$ (pri $900\,^\circ\mathrm{C}$ $1173\,\mathrm{K}$), $V = 1\,\mathrm{m^3}$, $R = 8{,}31\,\mathrm{J/(mol \cdot K)}$, $M(\mathrm{CaCO_3}) = 100\,\mathrm{g/mol}$; reakcija v desno je endotermna
**Iščemo:** maso razpadlega apnenca v zaprti peči; razlago za odprto peč

:::formula
Le Chatelierjevo načelo: ravnotežje se premakne v smer, ki spremembo delno izniči. Množino plina da plinska enačba $pV = nRT$ (fizika), torej $n = \dfrac{pV}{RT}$; tlak v $\mathrm{Pa}$, prostornina v $\mathrm{m^3}$, temperatura v $\mathrm{K}$.
:::

Slika kaže ravnotežni tlak $\mathrm{CO_2}$ nad apnencem pri različnih temperaturah. V aplikaciji z drsnikom premikaj temperaturo in poišči, kje krivulja preseže črtkano črto zračnega tlaka.

:::risba graf
opis: Graf ravnotežnega tlaka ogljikovega dioksida nad apnencem v odvisnosti od temperature od 700 do 950 stopinj Celzija. Krivulja strmo narašča: približno 22 kPa pri 800 stopinjah in 105 kPa pri 900 stopinjah. Črtkana vodoravna črta kaže zračni tlak 101 kPa. V aplikaciji drsnik premika točko po krivulji; izbrana je temperatura {t} stopinj Celzija, ravnotežni tlak je približno {round(22.3*exp(-19556*(1/(t+273.15)-1/1073.15)))} kPa.
x: 700 .. 950 | 50 | temperatura (°C)
y: 0 .. 220 | 20 | p (kPa)
drsnik: t | 700 .. 950 | 10 | 800 | temperatura v stopinjah Celzija
f: 22.3*exp(-19556*(1/(x+273.15)-1/1073.15)) | modra
črta: 700; 101 -> 950; 101 | siva črtkano
napis: 790; 101 | zračni tlak 101 kPa | nad | siva
točka: t; 22.3*exp(-19556*(1/(t+273.15)-1/1073.15)) | | nad | oranžna
napis: 710; 180 | {t} °C: {round(22.3*exp(-19556*(1/(t+273.15)-1/1073.15)))} kPa | desno | oranžna
podnapis: Pri {t} °C je ravnotežni tlak CO₂ približno {round(22.3*exp(-19556*(1/(t+273.15)-1/1073.15)))} kPa.
:::

**Rešitev:**

1. Apnenec in žgano apno sta trdna. Koncentracija trdne snovi se ne spreminja, zato je v izraz za $K$ ne pišemo: $K = [\mathrm{CO_2}]$. Pri dani temperaturi je torej v ravnotežju vedno ista koncentracija in s tem isti tlak $\mathrm{CO_2}$, ne glede na količino kamna.
2. Zaprta peč pri $800\,^\circ\mathrm{C}$: $\mathrm{CO_2}$ ne more ven, zato se nabira. Ko njegov tlak doseže $22\,\mathrm{kPa}$, žgano apno veže $\mathrm{CO_2}$ enako hitro, kot ga apnenec oddaja. Kamna se ne razgradi nič več.
3. Koliko ga razpade do takrat? Tlak pretvorimo v $\mathrm{Pa}$ ($22\,\mathrm{kPa} = 22\,000\,\mathrm{Pa}$): $n = \dfrac{22\,000 \cdot 1}{8{,}31 \cdot 1073} \approx 2{,}5\,\mathrm{mol}$. Iz enega mola apnenca nastane en mol $\mathrm{CO_2}$, zato razpade $2{,}5 \cdot 100 = 250\,\mathrm{g}$ apnenca. V peči je kamna več ton.
4. Tudi če bi zaprta peč dosegla $900\,^\circ\mathrm{C}$, ne bi bilo bolje: $n = \dfrac{105\,000 \cdot 1}{8{,}31 \cdot 1173} \approx 10{,}8\,\mathrm{mol}$, kar je približno $1{,}1\,\mathrm{kg}$ apnenca. Toplota, ki »ostane notri«, ne pomaga, dokler plin ne more ven.
5. Odprta peč: vlek odnaša $\mathrm{CO_2}$, zato njegov tlak ostane pod ravnotežnim. Sistem odvzeti plin nadomešča, ravnotežje se pomika v desno, dokler apnenca ne zmanjka.
6. Temperatura: segrevanje podpira endotermno smer, torej razpad. Pri približno $900\,^\circ\mathrm{C}$ ravnotežni tlak doseže zračni tlak $101\,\mathrm{kPa}$; na sliki krivulja tam seka črtkano črto. $\mathrm{CO_2}$ zato sam izriva zrak in uhaja iz peči. Pod to temperaturo razpad teče le, dokler vlek plin sproti odnaša.
7. Odgovor: prav ima dedek. V zaprti peči razpade le $250\,\mathrm{g}$ do dober kilogram kamna. Apnenica deluje, ker je odprta in vroča približno $900\,^\circ\mathrm{C}$ ali več.

### Primer 4: zdaj ti

V prazno posodo damo $\mathrm{NO_2}$ s koncentracijo $0{,}20\,\mathrm{mol/L}$. Ko se vzpostavi ravnotežje $2\,\mathrm{NO_2} \rightleftharpoons \mathrm{N_2O_4}$, izmerimo $[\mathrm{N_2O_4}] = 0{,}050\,\mathrm{mol/L}$. Kolikšna je $K$ pri tej temperaturi?

**Podatki:** začetna $c(\mathrm{NO_2}) = 0{,}20\,\mathrm{mol/L}$, začetna $c(\mathrm{N_2O_4}) = 0$, $[\mathrm{N_2O_4}] = 0{,}050\,\mathrm{mol/L}$
**Iščemo:** $K$

:::formula
$K = \dfrac{[\mathrm{N_2O_4}]}{[\mathrm{NO_2}]^2}$
:::

**Rešitev:**

1. Ravnotežne $[\mathrm{NO_2}]$ še ne poznamo. Za vsako molekulo $\mathrm{N_2O_4}$ se porabita dve molekuli $\mathrm{NO_2}$, zato se je porabilo $2 \cdot 0{,}050 = 0{,}10\,\mathrm{mol/L}$ $\mathrm{NO_2}$.
2. Ostalo ga je $[\mathrm{NO_2}] = 0{,}20 - 0{,}10 = 0{,}10\,\mathrm{mol/L}$.

| | $\mathrm{NO_2}$ | $\mathrm{N_2O_4}$ |
|---|---|---|
| začetek | $0{,}20$ | $0$ |
| sprememba | $-0{,}10$ | $+0{,}050$ |
| ravnotežje | $0{,}10$ | $0{,}050$ |

3. Vstavi v izraz sam, nato preveri:

:::premisli
Izračunaj $K$. V primeru 1 je bila $K = 8$. Je temperatura tokrat višja ali nižja, če veš, da je nastajanje $\mathrm{N_2O_4}$ eksotermno?
---
$0{,}10^2 = 0{,}01$ in $K = \dfrac{0{,}050}{0{,}01} = 5$. To je manj kot $8$, torej je produkta manj. Pri eksotermni reakciji se to zgodi pri segrevanju: temperatura je višja kot v primeru 1.
:::

## Pogoste napake

- **Koeficient kot faktor.** Pri $2\,\mathrm{HI}$ ne pišemo $2 \cdot [\mathrm{HI}]$, ampak $[\mathrm{HI}]^2$: koeficient postane eksponent.
- **»V ravnotežju se reakcija ustavi in obojega je enako.«** Koncentracije so stalne, reakciji pa tečeta naprej, le enako hitro. Enaki sta *hitrosti*, ne koncentraciji: v tabeli je bilo na koncu osemkrat več HI kot $\mathrm{H_2}$.
- **»Segrevanje vedno da več produktov, ker reakcija teče hitreje.«** Hitrost in lega ravnotežja sta dve stvari. Segrevanje pospeši obe smeri, ravnotežje pa premakne v endotermno smer. Pri eksotermni reakciji je produktov po segrevanju manj.
- **»Sistem motnjo povsem izniči.«** Le delno: po dodatku vodika se njegova koncentracija ni vrnila na $0{,}20$, ampak le na $0{,}34\,\mathrm{mol/L}$.
- **»Če dodam reaktant, se poveča $K$.«** Spremeni se le trenutno razmerje; sistem se premakne, dokler razmerje spet ni enako $K$. $K$ spremeni samo temperatura.
- **»Katalizator premakne ravnotežje k produktom.«** Katalizator pospeši obe smeri enako. Ravnotežna zmes je enaka, le prej jo dosežemo.

## Povzetek

- Kemijsko ravnotežje je dinamično: reakcija v desno in obratna reakcija potekata enako hitro, koncentracije se ne spreminjajo.
- Konstanta ravnotežja za $a\mathrm{A} + b\mathrm{B} \rightleftharpoons x\mathrm{C} + y\mathrm{D}$: $K = \dfrac{[\mathrm{C}]^x[\mathrm{D}]^y}{[\mathrm{A}]^a[\mathrm{B}]^b}$; produkti zgoraj, koeficienti so eksponenti, trdnih snovi ne pišemo.
- Velik $K$: v ravnotežju prevladujejo produkti; majhen $K$: prevladujejo reaktanti. $K$ je odvisna le od temperature.
- Le Chatelierjevo načelo: motnja premakne ravnotežje v smer, ki jo delno izniči (koncentracija, tlak pri plinih, temperatura).
- Katalizator ravnotežja ne premakne, ga le hitreje vzpostavi.

## Drugače: Na sliki

Ravnotežje lahko narišeš tudi s hitrostma obeh reakcij.

:::risba graf
opis: Shematičen graf hitrosti dveh reakcij v odvisnosti od časa. Hitrost reakcije v desno je na začetku največja in pada. Hitrost obratne reakcije začne pri nič in raste. Krivulji se približata isti vrednosti in od tam potekata skupaj vodoravno: hitrosti sta enaki, to je ravnotežje.
x: 0 .. 60 | 10 | čas
y: 0 .. 1,1 | 0,5 | hitrost
oznake: ne
f: 0.4 + 0.6*2^(-x/8) | modra
f: 0.4 - 0.4*2^(-x/8) | oranžna črtkano
napis: 14; 0,75 | reakcija v desno | desno | modra
napis: 14; 0,12 | obratna reakcija | desno | oranžna
napis: 48; 0,5 | hitrosti sta enaki | nad
:::

- Polna krivulja je reakcija v desno. Začne visoko, ker je reaktantov veliko, in pada, ko se porabljajo.
- Črtkana krivulja je obratna reakcija. Začne pri nič, ker produkta še ni, in raste, ko se nabira.
- Kjer se krivulji združita, je ravnotežje. Hitrosti nista nič, sta le enaki. Na sliki razmerje ni v merilu: v prvem poskusu hitrost v desno pade celo na $4\,\%$ začetne, ker koncentraciji obeh reaktantov padeta na petino.

## Drugače: Bolj natančno

**Reakcijski kvocient.** Primerjava trenutnega razmerja $Q$ s $K$ pove smer: pri $Q < K$ reakcija teče v desno, pri $Q > K$ v levo, pri $Q = K$ je sistem v ravnotežju. Ko smo dodali vodik, je bil $Q = 32 < K = 64$.

**Temperatura in $K$.** Pri eksotermni reakciji $K$ s segrevanjem pada, pri endotermni raste. Zato pri $2\,\mathrm{NO_2} \rightleftharpoons \mathrm{N_2O_4}$ segrevanje poveča delež $\mathrm{NO_2}$.

**Kaj ne nastopa v $K$.** Koncentracije trdnih snovi in čistih tekočin (na primer vode kot topila) se med reakcijo praktično ne spreminjajo, zato jih v izraz za $K$ ne pišemo. Zato je pri razpadu apnenca $K = [\mathrm{CO_2}]$.

**Enote.** Vsako koncentracijo delimo s standardno koncentracijo $1\,\mathrm{mol/L}$, zato je $K$ brez enote.

## Preveri se

? Katera trditev o kemijskem ravnotežju je pravilna?
- V ravnotežju sta koncentraciji reaktantov in produktov enaki.
~ Enaki sta hitrosti obeh reakcij. Koncentracije so stalne, a praviloma različne.
- V ravnotežju se obe reakciji ustavita.
~ Koncentracije se ne spreminjajo, ker reakciji tečeta enako hitro, ne ker bi stali.
+ Vrednost $K$ se spremeni le, če spremenimo temperaturo.
- Katalizator poveča delež produktov v ravnotežni zmesi.
~ Katalizator pospeši obe smeri enako; zmes je enaka, le prej nastane.
> Dodajanje snovi, stiskanje in katalizator vrednosti $K$ ne spremenijo. Spremeni jo samo temperatura.

? Za $\mathrm{H_2} + \mathrm{I_2} \rightleftharpoons 2\,\mathrm{HI}$ so v ravnotežju $[\mathrm{H_2}] = [\mathrm{I_2}] = 0{,}20\,\mathrm{mol/L}$ in $[\mathrm{HI}] = 1{,}0\,\mathrm{mol/L}$. Kolikšna je $K$?
- $50$
~ Koeficient $2$ si uporabil kot faktor. Koeficient postane eksponent: $[\mathrm{HI}]^2$.
+ $25$
- $0{,}04$
~ Ulomek je obrnjen. Produkti so v števcu, reaktanti v imenovalcu.
- $2{,}5$
~ Koncentraciji reaktantov si seštel. V imenovalcu ju zmnožimo.
> $K = \dfrac{1{,}0^2}{0{,}20 \cdot 0{,}20} = \dfrac{1}{0{,}04} = 25$.

? V dveh posodah je enaka ravnotežna zmes $\mathrm{H_2}$, $\mathrm{I_2}$ in HI. V prvo dodamo vodik, v drugo katalizator. Primerjaj $[\mathrm{HI}]$ po tem, ko se stanje spet ustali.
+ V prvi naraste, v drugi ostane enaka.
- V obeh posodah naraste.
~ Katalizator pospeši obe smeri enako, zato v drugi posodi nič ne premakne.
- V prvi naraste, ker se poveča $K$; v drugi ostane enaka.
~ $[\mathrm{HI}]$ res naraste, a $K$ ostane enaka. Spremeni se le trenutno razmerje, ki se nato vrne na $K$.
- V nobeni se ne spremeni, ker sistem dodani vodik v celoti porabi in se vrne v prejšnje stanje.
~ Sistem motnjo izniči le delno. Del dodanega vodika ostane, HI pa je več kot prej.
> Dodani vodik se delno porabi in nastane več HI (Le Chatelierjevo načelo). Katalizator ravnotežja ne premakne.

? Učenec rešuje: $2\,\mathrm{NO_2} \rightleftharpoons \mathrm{N_2O_4}$, $K = 8$, $[\mathrm{NO_2}] = 0{,}20\,\mathrm{mol/L}$. Korak 1: $[\mathrm{N_2O_4}] = K \cdot [\mathrm{NO_2}]^2$. Korak 2: kvadrat od $0{,}20$ je $0{,}40$. Korak 3: $[\mathrm{N_2O_4}] = 8 \cdot 0{,}40 = 3{,}2\,\mathrm{mol/L}$. Kateri korak je napačen?
- korak 1
~ Izraz je pravilno preoblikovan: $K = \dfrac{[\mathrm{N_2O_4}]}{[\mathrm{NO_2}]^2}$ pomnožimo z $[\mathrm{NO_2}]^2$.
+ korak 2
- korak 3
~ Množenje $8 \cdot 0{,}40$ je pravilno, a uporablja napačen vmesni rezultat iz koraka 2.
- vsi koraki so pravilni
~ Rezultat $3{,}2\,\mathrm{mol/L}$ je sumljivo velik: kvadrat števila, manjšega od $1$, je manjši od tega števila.
> Učenec je število podvojil namesto kvadriral. Pravilno je $0{,}20 \cdot 0{,}20 = 0{,}04$ in $[\mathrm{N_2O_4}] = 8 \cdot 0{,}04 = 0{,}32\,\mathrm{mol/L}$.

? Po treningu odpreš plastenko gazirane pijače in ta začne šumeti. V zaprti plastenki je bilo ravnotežje $\mathrm{CO_2(g)} \rightleftharpoons \mathrm{CO_2(aq)}$. Zakaj šumi?
- Ker katalizator v pijači pospeši nastajanje plina.
~ V pijači ni katalizatorja, ki bi se ob odprtju vklopil; in katalizator ravnotežja ne premakne.
- Ker se ob odprtju poveča $K$.
~ $K$ se spremeni le s temperaturo. Ob odprtju se spremeni koncentracija plina nad pijačo.
+ Tlak $\mathrm{CO_2}$ nad pijačo pade, zato se ravnotežje premakne k plinastemu $\mathrm{CO_2}$.
- Ker se pijača ob odprtju segreje.
~ Temperatura se ob odprtju ne spremeni. Spremeni se tlak plina nad pijačo.
> Ko $\mathrm{CO_2}$ uide iz plastenke, sistem nadomešča izgubljeni plin: raztopljeni $\mathrm{CO_2}$ izhaja v mehurčkih. Enako deluje odprta apnenica.

? V tovarni poteka sinteza amoniaka $\mathrm{N_2} + 3\,\mathrm{H_2} \rightleftharpoons 2\,\mathrm{NH_3}$; vse snovi so plini, reakcija v desno je eksotermna. Kaj poveča delež amoniaka v ravnotežni zmesi?
- višja temperatura, ker reakcija teče hitreje
~ Hitrost ni lega ravnotežja. Segrevanje podpira endotermno smer, tu razpad amoniaka.
- katalizator
~ Katalizator pospeši obe smeri enako. Ravnotežje se vzpostavi prej, delež amoniaka ostane enak.
- večja posoda
~ V večji posodi je tlak manjši, ravnotežje se premakne na stran z več molekulami plina, torej v levo.
+ višji tlak
> Na levi so štiri molekule plina, na desni dve. Stiskanje premakne ravnotežje na stran z manj molekulami, k amoniaku.

:::simboli
K | konstanta ravnotežja | K = \frac{[\mathrm{C}]^x \cdot [\mathrm{D}]^y}{[\mathrm{A}]^a \cdot [\mathrm{B}]^b} | – | brez enote; stalna pri dani temperaturi
a, b | stehiometrijska koeficienta reaktantov | | – | v $K$ eksponenta v imenovalcu
x, y | stehiometrijska koeficienta produktov | | – | v $K$ eksponenta v števcu
c | množinska koncentracija snovi | | mol/L | v ravnotežju jo pišemo z oglatimi oklepaji, $[\mathrm{HI}]$
k_1, k_2 | sorazmernostna faktorja hitrosti obeh reakcij | | | $K = k_1/k_2$
Q | reakcijski kvocient | | – | kot $K$, a s trenutnimi koncentracijami
n | množina plina | n = \frac{pV}{RT} | mol |
p | tlak plina | | Pa | $22\,\mathrm{kPa} = 22\,000\,\mathrm{Pa}$
M | molska masa | | g/mol | masa enega mola snovi
V | prostornina plina | | m^3 |
R | splošna plinska konstanta | | J/(mol \cdot K) | $8{,}31\,\mathrm{J/(mol \cdot K)}$
T | temperatura | | K | v kelvinih: $800\,^\circ\mathrm{C} = 1073\,\mathrm{K}$
:::
