---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika je smučarska tekačica. Pred sezono odide s trenerjem na višinske priprave na $2500\,\mathrm{m}$. Prve dni jo ob vsakem vzponu duši, srce ji bije hitreje kot doma, čeprav teče počasneje. Trener jo pomiri: »Počakaj tri tedne, potem boš celo močnejša kot prej.«

Nika bi rada razumela, kaj se dogaja v njeni krvi in zakaj mora čakati. Kisik prenaša hemoglobin v rdečih krvničkah. Poenostavljeno:

$$\mathrm{Hb} + \mathrm{O_2} \rightleftharpoons \mathrm{HbO_2}$$

Dvojna puščica pomeni, da reakcija poteka v obe smeri hkrati. Hemoglobin v pljučih veže kisik, v mišicah ga oddaja. Kako taka reakcija »izbere« smer, pove kemijsko ravnotežje. Odgovor za Niko dobiš v primeru 3.

## Razlaga

**Najprej en poskus.** V zaprto posodo pri stalni temperaturi damo vodik in jodove pare, vsakega s koncentracijo $1{,}00\,\mathrm{mol/L}$. Nastaja vodikov jodid:

$$\mathrm{H_2} + \mathrm{I_2} \rightleftharpoons 2\,\mathrm{HI}$$

Koncentracije merimo v več trenutkih. Zadnji stolpec je razmerje $\dfrac{c(\mathrm{HI})^2}{c(\mathrm{H_2}) \cdot c(\mathrm{I_2})}$; kvadrat je zato, ker v enačbi nastopata dve molekuli HI.

| trenutek | $c(\mathrm{H_2}) = c(\mathrm{I_2})$ | $c(\mathrm{HI})$ | razmerje |
|---|---|---|---|
| začetek | $1{,}00$ | $0$ | $0$ |
| kmalu | $0{,}50$ | $1{,}00$ | $4$ |
| pozneje | $0{,}25$ | $1{,}50$ | $36$ |
| še pozneje | $0{,}20$ | $1{,}60$ | $64$ |
| čez eno uro | $0{,}20$ | $1{,}60$ | $64$ |

Koncentracije so v $\mathrm{mol/L}$. Ko HI nastaja, koncentracija reaktantov pada in naprejšnja reakcija (v desno, nastajanje HI) se upočasnjuje, saj je trkov $\mathrm{H_2}$ z $\mathrm{I_2}$ vse manj. Hkrati je vse več HI, zato vse pogosteje poteka obratna reakcija, razpad HI nazaj v $\mathrm{H_2}$ in $\mathrm{I_2}$.

**Dinamično ravnotežje.** Od nekega trenutka naprej se koncentracije ne spreminjajo več. Reakcija se ni ustavila: v vsaki sekundi nastane enako molekul HI, kot jih razpade. Stanje, v katerem sta hitrosti naprejšnje in obratne reakcije enaki, imenujemo **kemijsko ravnotežje**. Ker obe reakciji tečeta naprej, je ravnotežje **dinamično**.

:::premisli
Drugi poskus pri isti temperaturi: na začetku je $c(\mathrm{H_2}) = 1{,}00\,\mathrm{mol/L}$ in $c(\mathrm{I_2}) = 2{,}00\,\mathrm{mol/L}$. V ravnotežju izmerimo $c(\mathrm{H_2}) \approx 0{,}053\,\mathrm{mol/L}$, $c(\mathrm{I_2}) \approx 1{,}053\,\mathrm{mol/L}$ in $c(\mathrm{HI}) \approx 1{,}89\,\mathrm{mol/L}$. Napovej razmerje, preden računaš.
---
Spet približno $64$: $\dfrac{1{,}89^2}{0{,}053 \cdot 1{,}053} \approx 64$. Koncentracije so čisto drugačne kot v prvem poskusu, razmerje pa enako. Enako bi dobili, če bi začeli samo s HI.
:::

**Od primera do pravila.** Razmerje, ki je v ravnotežju pri dani temperaturi vedno enako, imenujemo **konstanta ravnotežja** $K$. Za splošno reakcijo

$$a\,\mathrm{A} + b\,\mathrm{B} \rightleftharpoons c\,\mathrm{C} + d\,\mathrm{D}$$

jo zapišemo z ravnotežnimi koncentracijami, ki jih označimo z oglatimi oklepaji:

$$K = \frac{[\mathrm{C}]^c \cdot [\mathrm{D}]^d}{[\mathrm{A}]^a \cdot [\mathrm{B}]^b}$$

Produkti so v števcu, reaktanti v imenovalcu, stehiometrijski koeficienti postanejo eksponenti. Velik $K$ (na primer $10^5$) pomeni, da so v ravnotežju skoraj sami produkti; majhen $K$ (na primer $10^{-5}$), da reakcija komaj steče. $K$ se spremeni le, če spremenimo temperaturo.

**Kaj, če ravnotežje zmotimo?** Vrnimo se k prvemu poskusu v ravnotežju ($0{,}20$; $0{,}20$; $1{,}60$) in dodajmo vodik, da $c(\mathrm{H_2})$ naraste na $0{,}40\,\mathrm{mol/L}$. Razmerje je v tistem trenutku le

$$\frac{1{,}60^2}{0{,}40 \cdot 0{,}20} = 32$$

kar je manj od $K = 64$. Sistem ni več v ravnotežju. Naprejšnja reakcija je zdaj hitrejša od obratne, zato nastaja HI, dokler razmerje spet ne doseže $64$. Del dodanega vodika se pri tem porabi.

:::premisli
Kaj bi se zgodilo, če bi iz ravnotežne zmesi sproti odstranjevali HI? V katero smer bi tekla reakcija in kaj bi se dogajalo s $K$?
---
Reakcija bi tekla v smer nastajanja HI, ker bi razmerje padlo pod $64$. Tako lahko porabimo skoraj vse reaktante. $K$ ostane $64$, ker se temperatura ni spremenila.
:::

**Le Chatelierjevo načelo.** Ta primer posplošimo: *če sistemu v ravnotežju spremenimo pogoje, se ravnotežje premakne v smer, ki to spremembo delno izniči.*

- **Koncentracija:** dodamo snov, sistem jo porablja; odvzamemo snov, sistem jo dela.
- **Tlak (pri plinih):** stisnemo posodo, ravnotežje se premakne na stran z manj molekulami plina, saj manj molekul manj pritiska na stene. Pri $\mathrm{H_2} + \mathrm{I_2} \rightleftharpoons 2\,\mathrm{HI}$ sta na obeh straneh dve molekuli, zato tlak nima vpliva.
- **Temperatura:** segrevanje podpira endotermno smer (tisto, ki toploto porablja), ohlajanje eksotermno (tisto, ki toploto sprošča). Samo ta sprememba spremeni tudi vrednost $K$.
- **Katalizator:** obe smeri pospeši enako, zato ravnotežja ne premakne. Do ravnotežja pridemo le prej.

V simulaciji spodaj »Dinamično ravnotežje in Le Chatelierovo načelo« poteka reakcija $2\,\mathrm{NO_2} \rightleftharpoons \mathrm{N_2O_4}$, ki je v smeri nastajanja $\mathrm{N_2O_4}$ eksotermna. Pritisni »Dodaj NO₂« in na grafu spremljaj obe krivulji: koliko $\mathrm{NO_2}$ se porabi in koliko $\mathrm{N_2O_4}$ nastane. Preden zvišaš temperaturo, napovej, katera krivulja se bo dvignila, nato preveri.

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

### Primer 3: Nika na višini

Na $2500\,\mathrm{m}$ je zračni tlak približno $75\,\mathrm{kPa}$, ob morju $101\,\mathrm{kPa}$. Delež kisika v zraku je povsod $21\,\%$. Kaj se zgodi z ravnotežjem $\mathrm{Hb} + \mathrm{O_2} \rightleftharpoons \mathrm{HbO_2}$ v Nikinih pljučih in kaj telo naredi v treh tednih?

**Podatki:** $p_\mathrm{višina} \approx 75\,\mathrm{kPa}$, $p_\mathrm{morje} \approx 101\,\mathrm{kPa}$, delež $\mathrm{O_2}$ $21\,\%$, ravnotežje $\mathrm{Hb} + \mathrm{O_2} \rightleftharpoons \mathrm{HbO_2}$
**Iščemo:** smer premika ravnotežja in odziv telesa

:::formula
Le Chatelierjevo načelo: ravnotežje se premakne v smer, ki spremembo delno izniči.
:::

**Rešitev:**

1. Kisika je v vsakem vdihu sorazmerno manj: $\dfrac{75}{101} \approx 0{,}74$, torej približno četrtino manj.
2. Manjša koncentracija $\mathrm{O_2}$: sistem skuša kisik nadomestiti, zato se ravnotežje premakne v levo, k razpadu $\mathrm{HbO_2}$.
3. V krvi je manj oksihemoglobina, mišice dobijo manj kisika. Nika se duši, srce bije hitreje, da požene več krvi.
4. V nekaj tednih telo naredi več hemoglobina. Večja koncentracija Hb premakne ravnotežje spet v desno.
5. Odgovor: na višini se ravnotežje premakne proti Hb in $\mathrm{O_2}$; po prilagoditvi več hemoglobina premakne ravnotežje nazaj proti $\mathrm{HbO_2}$. Ko se Nika vrne v dolino, ima več hemoglobina kot prej, zato je bolj vzdržljiva.

### Primer 4: zdaj ti

Za $2\,\mathrm{NO_2} \rightleftharpoons \mathrm{N_2O_4}$ je $K = 8$ (kot v primeru 1). V drugi posodi pri isti temperaturi izmerimo $[\mathrm{NO_2}] = 0{,}10\,\mathrm{mol/L}$. Kolikšna je $[\mathrm{N_2O_4}]$?

**Podatki:** $K = 8$, $[\mathrm{NO_2}] = 0{,}10\,\mathrm{mol/L}$
**Iščemo:** $[\mathrm{N_2O_4}]$

:::formula
$[\mathrm{N_2O_4}] = K \cdot [\mathrm{NO_2}]^2$
:::

**Rešitev:**

1. Izraz za $K$ pomnožimo z $[\mathrm{NO_2}]^2$, da ostane neznanka sama.
2. Kvadriraj in pomnoži sam, nato preveri:

:::premisli
Najprej napovej: bo $[\mathrm{N_2O_4}]$ večja ali manjša od $0{,}020\,\mathrm{mol/L}$ iz primera 1? Nato izračunaj.
---
$0{,}10^2 = 0{,}01$ in $8 \cdot 0{,}01 = 0{,}08$, torej $[\mathrm{N_2O_4}] = 0{,}080\,\mathrm{mol/L}$. To je štirikrat več kot v primeru 1: $[\mathrm{NO_2}]$ je dvakrat večja in v izrazu nastopa v kvadratu.
:::

## Pogoste napake

- **Koeficient kot faktor.** Pri $2\,\mathrm{HI}$ ne pišemo $2 \cdot [\mathrm{HI}]$, ampak $[\mathrm{HI}]^2$: koeficient postane eksponent.
- **»V ravnotežju se reakcija ustavi.«** Koncentracije so stalne, reakciji pa tečeta naprej, le enako hitro. Če bi v posodo dodali radioaktivno označen jod, bi ga čez čas našli tudi v HI.
- **»V ravnotežju je reaktantov in produktov enako.«** Enaki sta *hitrosti*, ne koncentraciji. V tabeli je bilo na koncu osemkrat več HI kot $\mathrm{H_2}$.
- **»Če dodam reaktant, se poveča $K$.«** Spremeni se le trenutno razmerje; sistem se premakne, dokler razmerje spet ni enako $K$. $K$ spremeni samo temperatura.
- **»Katalizator premakne ravnotežje k produktom.«** Katalizator pospeši obe smeri enako. Ravnotežna zmes je enaka, le prej jo dosežemo.

## Povzetek

- Kemijsko ravnotežje je dinamično: naprejšnja in obratna reakcija potekata enako hitro, koncentracije se ne spreminjajo.
- Konstanta ravnotežja za $a\mathrm{A} + b\mathrm{B} \rightleftharpoons c\mathrm{C} + d\mathrm{D}$: $K = \dfrac{[\mathrm{C}]^c[\mathrm{D}]^d}{[\mathrm{A}]^a[\mathrm{B}]^b}$; produkti zgoraj, koeficienti so eksponenti.
- Velik $K$: v ravnotežju prevladujejo produkti; majhen $K$: prevladujejo reaktanti. $K$ je odvisna le od temperature.
- Le Chatelierjevo načelo: motnja premakne ravnotežje v smer, ki jo delno izniči (koncentracija, tlak pri plinih, temperatura).
- Katalizator ravnotežja ne premakne, ga le hitreje vzpostavi.

## Drugače: Z analogijo

Spomni se igre, v kateri dve ekipi mečeta žoge na nasprotnikovo polovico igrišča. Vsaka ekipa želi imeti na svoji strani čim manj žog.

- Na začetku so vse žoge na levi strani. Leva ekipa meče hitro, desna nima kaj metati.
- Ko se žoge naberejo na desni, desna ekipa meče vse pogosteje.
- Kmalu leta čez mrežo v vsaki sekundi enako žog v obe smeri. Število žog na vsaki strani ostane približno enako, čeprav žoge nenehno letijo. To je dinamično ravnotežje.
- Žog na obeh straneh ni nujno enako. Če je desna ekipa počasnejša, se na desni nabere več žog, tako kot je pri velikem $K$ več produktov na desni strani enačbe.
- Če sodnik vrže deset novih žog na levo, leva ekipa meče hitreje, dokler se ne vzpostavi novo ravnotežje. To je Le Chatelierjevo načelo.

## Drugače: Bolj natančno

**Reakcijski kvocient.** Razmerje, izračunano z *trenutnimi* koncentracijami, imenujemo reakcijski kvocient $Q$. Primerjava pove smer:

- $Q < K$: reakcija teče v desno (nastajajo produkti),
- $Q = K$: sistem je v ravnotežju,
- $Q > K$: reakcija teče v levo.

Ko smo dodali vodik, je bil $Q = 32 < K = 64$, zato je reakcija tekla v desno.

**Temperatura in $K$.** Pri eksotermni reakciji $K$ s segrevanjem pada, pri endotermni raste. Zato pri $2\,\mathrm{NO_2} \rightleftharpoons \mathrm{N_2O_4}$ segrevanje poveča delež $\mathrm{NO_2}$.

**Kaj ne nastopa v $K$.** Koncentracije trdnih snovi in čistih tekočin (na primer vode kot topila) se med reakcijo praktično ne spreminjajo, zato jih v izraz za $K$ ne pišemo.

**Enote.** Strogo vzeto vsako koncentracijo delimo s standardno koncentracijo $1\,\mathrm{mol/L}$, zato je $K$ brez enote. Nekateri učbeniki $K$ pišejo z enoto, na primer $\mathrm{L/mol}$ pri primeru 1; vrednost je enaka.

## Preveri se

? Ravnotežje $2\,\mathrm{NO_2} \rightleftharpoons \mathrm{N_2O_4}$ je v zaprti posodi. Kateri poseg ne sodi med ostale, ker ravnotežja ne premakne?
- dodamo $\mathrm{NO_2}$
~ Dodana snov se delno porabi, zato se ravnotežje premakne proti $\mathrm{N_2O_4}$.
- posodo stisnemo
~ Na desni je manj molekul plina, zato se pri stiskanju ravnotežje premakne v desno.
+ dodamo katalizator
- posodo segrejemo
~ Segrevanje podpira endotermno smer, tu razpad $\mathrm{N_2O_4}$; spremeni se tudi $K$.
> Katalizator pospeši naprejšnjo in obratno reakcijo enako, zato ravnotežja ne premakne. Ostali trije posegi ga premaknejo.

? Za $\mathrm{H_2} + \mathrm{I_2} \rightleftharpoons 2\,\mathrm{HI}$ so v ravnotežju $[\mathrm{H_2}] = [\mathrm{I_2}] = 0{,}20\,\mathrm{mol/L}$ in $[\mathrm{HI}] = 1{,}0\,\mathrm{mol/L}$. Kolikšna je $K$?
- $50$
~ Koeficient $2$ si uporabil kot faktor. Koeficient postane eksponent: $[\mathrm{HI}]^2$.
+ $25$
- $0{,}04$
~ Ulomek je obrnjen. Produkti so v števcu, reaktanti v imenovalcu.
- $2{,}5$
~ Koncentraciji reaktantov si seštel. V imenovalcu ju zmnožimo.
> $K = \dfrac{1{,}0^2}{0{,}20 \cdot 0{,}20} = \dfrac{1}{0{,}04} = 25$.

? Reakcija je v smeri nastajanja produktov eksotermna. Ravnotežno zmes segrejemo. Kaj je posledica?
- Ravnotežje se premakne k produktom, $K$ naraste.
~ Segrevanje podpira endotermno smer, tu je to smer k reaktantom.
- Ravnotežje se ne premakne, ker se reakcija samo pospeši.
~ Res sta obe smeri hitrejši, a endotermna se pospeši bolj, zato se ravnotežje premakne.
+ Ravnotežje se premakne k reaktantom, $K$ se zmanjša.
> Sistem »porabi« dovedeno toploto z endotermno reakcijo, ki je obratna. Ker se je spremenila temperatura, se spremeni tudi $K$.

? Učenec rešuje: $2\,\mathrm{NO_2} \rightleftharpoons \mathrm{N_2O_4}$, $K = 8$, $[\mathrm{NO_2}] = 0{,}20\,\mathrm{mol/L}$. Korak 1: $[\mathrm{N_2O_4}] = K \cdot [\mathrm{NO_2}]^2$. Korak 2: kvadrat od $0{,}20$ je $0{,}40$. Korak 3: $[\mathrm{N_2O_4}] = 8 \cdot 0{,}40 = 3{,}2\,\mathrm{mol/L}$. Kateri korak je napačen?
- korak 1
~ Izraz je pravilno preoblikovan: $K = \dfrac{[\mathrm{N_2O_4}]}{[\mathrm{NO_2}]^2}$ pomnožimo z $[\mathrm{NO_2}]^2$.
+ korak 2
- korak 3
~ Množenje $8 \cdot 0{,}40$ je pravilno, a uporablja napačen vmesni rezultat iz koraka 2.
- vsi koraki so pravilni
~ Rezultat $3{,}2\,\mathrm{mol/L}$ je sumljivo velik: kvadrat števila, manjšega od $1$, je manjši od tega števila.
> Učenec je število podvojil namesto kvadriral. Pravilno je $0{,}20 \cdot 0{,}20 = 0{,}04$ in $[\mathrm{N_2O_4}] = 8 \cdot 0{,}04 = 0{,}32\,\mathrm{mol/L}$.

? Nika po tekmi odpre plastenko gazirane pijače in ta začne šumeti. V zaprti plastenki je bilo ravnotežje $\mathrm{CO_2(g)} \rightleftharpoons \mathrm{CO_2(aq)}$. Zakaj šumi?
- Ker katalizator v pijači pospeši nastajanje plina.
~ V pijači ni katalizatorja, ki bi se ob odprtju vklopil; in katalizator ravnotežja ne premakne.
+ Tlak $\mathrm{CO_2}$ nad pijačo pade, zato se ravnotežje premakne k plinastemu $\mathrm{CO_2}$.
- Ker se ob odprtju poveča $K$.
~ $K$ se spremeni le s temperaturo. Ob odprtju se spremeni koncentracija plina nad pijačo.
> Ko $\mathrm{CO_2}$ uide iz plastenke, sistem nadomešča izgubljeni plin: raztopljeni $\mathrm{CO_2}$ izhaja v mehurčkih. To je Le Chatelierjevo načelo.

:::simboli
K | konstanta ravnotežja | K = \frac{[\mathrm{C}]^c \cdot [\mathrm{D}]^d}{[\mathrm{A}]^a \cdot [\mathrm{B}]^b} | – | stalna pri dani temperaturi; velik K: skoraj sami produkti
a, b | stehiometrijska koeficienta reaktantov | | – | v K eksponenta v imenovalcu
c, d | stehiometrijska koeficienta produktov | | – | v K eksponenta v števcu; c(HI) pa je koncentracija
:::
