---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Luka pomaga stricu, ki v kopalnici polaga estrih. Masa je še mehka, ko Luka reče: »Vseeno je, ali stopim nanjo v copatih ali na široko desko. Odtis bo enako globok, saj sem v obeh primerih enako težak.«

Stric se nasmehne, položi na estrih desko in stopi nanjo. Pod desko ostane komaj viden odtis, pod copati bi nastali globoki jamici. Kdo ima prav in zakaj?

Odločilna ni samo sila, ampak tudi to, **na kako veliki ploskvi** deluje. Za to imamo količino **tlak**. Z njo razložimo ostro dleto, širok temelj hiše, vodovod v bloku in debelo steno jezu. Lukovo trditev bomo preverili v Primeru 2.

## Razlaga

**1. Ista sila, različna ploskev.** Opeko položi na mehko zemljo najprej plosko, nato pokonci. Teža je obakrat enaka, pokonci pa se opeka pogrezne globlje, ker se ista sila razdeli po manjši ploskvi.

**Tlak** je količnik med silo, ki deluje pravokotno na ploskev, in ploščino te ploskve:

$$p = \frac{F}{S}$$

Tu je $p$ tlak, $F$ sila, pravokotna na ploskev, in $S$ ploščina ploskve. Pri telesu, ki leži na vodoravnih tleh, je ta sila njegova teža $F_g = m \cdot g$, kjer je $g \approx 10\,\mathrm{N/kg}$.

*Hitri preizkus:* kje je tlak večji, pri $100\,\mathrm{N}$ na $1\,\mathrm{m^2}$ ali pri $100\,\mathrm{N}$ na $0{,}5\,\mathrm{m^2}$? (Pri drugem: $200\,\mathrm{Pa}$ namesto $100\,\mathrm{Pa}$.)

**2. Enota paskal.** Če je sila v newtonih in ploščina v kvadratnih metrih, je tlak v **paskalih**:

$$1\,\mathrm{Pa} = 1\,\frac{\mathrm{N}}{\mathrm{m^2}}$$

Paskal je majhna enota: približno tako pritiska list papirja, ki leži na mizi. Zato pogosto pišemo $1\,\mathrm{kPa} = 1000\,\mathrm{Pa}$ ali $1\,\mathrm{bar} = 100\,000\,\mathrm{Pa}$. Zračni tlak ob morju je približno $100\,000\,\mathrm{Pa}$.

Ploščine v $\mathrm{cm^2}$ pred računom pretvori: $1\,\mathrm{m^2} = 10\,000\,\mathrm{cm^2}$.

*Hitri preizkus:* koliko $\mathrm{m^2}$ je $50\,\mathrm{cm^2}$? ($0{,}005\,\mathrm{m^2}$.)

**3. Tlak povečamo ali zmanjšamo.** Mojstri to izkoriščajo vsak dan:

| Kje | Ploskev | Tlak | Zakaj |
|---|---|---|---|
| dleto, žebelj, žaga | zelo majhna | velik | prodre v les |
| deska na estrihu | velika | majhen | ne pusti odtisa |
| temelj pod steno | večja od stene | manjši | tla se manj posedejo |

V simulaciji spodaj (»Tlak na ploskev in tlak v tekočini«) izberi opeko in jo postavi plosko, nato pokonci. Opazuj ploščino stika in tlak: pokonci je ploščina skoraj štirikrat manjša, tlak pa skoraj štirikrat večji.

:::premisli
Stena hiše je debela $30\,\mathrm{cm}$, betonski pas pod njo (temelj) pa je širok $60\,\mathrm{cm}$. Napovej: kolikokrat manjši je tlak na zemljo, kot bi bil, če bi stena stala kar na zemlji? Zakaj je to gradbenikom pomembno?
---
Teža stene in strehe se na temelju porazdeli po dvakrat večji ploskvi, zato je tlak na zemljo približno pol manjši. Zemlja manj popusti in hiša se manj poseda.
:::

**4. Tekočine pritiskajo v vse smeri.** Voda v rezervoarju zaradi svoje teže pritiska na dno, pa tudi na stene in na vsak predmet v njej. Ta tlak deluje **v vseh smereh** in vedno pravokotno na ploskev, ki se je tekočina dotika. Na isti globini je tlak povsod enak, z globino pa narašča.

V laboratoriju spodaj (»Laboratorij: hidrostatični tlak in manometer«) potopi sondo in obrni njeno opno navzgor, navzdol in vstran. Na isti globini manometer kaže enako.

*Hitri preizkus:* v katero smer pritiska voda na stransko steno bazena? (Pravokotno na steno, navzven.)

**5. Hidrostatični tlak.** Tlak, ki ga povzroča teža mirujoče tekočine, je **hidrostatični tlak**. Zamisli si navpičen stolpec tekočine s ploščino $S$, ki sega od gladine do globine $h$. Njegova teža pritiska na ploskev $S$ spodaj. Iz tega dobimo (izpeljava je v razdelku »Bolj natančno«):

$$p = \rho \cdot g \cdot h$$

Tu je $\rho$ gostota tekočine v $\mathrm{kg/m^3}$, $h$ pa **globina pod gladino** v metrih. Za vodo:

| Globina $h$ | Hidrostatični tlak $p$ |
|---|---|
| $1\,\mathrm{m}$ | $10\,000\,\mathrm{Pa}$ |
| $2\,\mathrm{m}$ | $20\,000\,\mathrm{Pa}$ |
| $5\,\mathrm{m}$ | $50\,000\,\mathrm{Pa}$ |
| $10\,\mathrm{m}$ | $100\,000\,\mathrm{Pa}$ |

Dvakrat globlje pomeni dvakrat večji tlak: tlak je premo sorazmeren z globino. Vsakih $10\,\mathrm{m}$ vode doda približno toliko, kolikor znaša zračni tlak.

*Hitri preizkus:* kolikšen je hidrostatični tlak $4\,\mathrm{m}$ pod gladino vode? ($40\,000\,\mathrm{Pa}$.)

**6. Ozka cev ali širok bazen?** Formula $p = \rho g h$ velja za vsako posodo. Preizkusi, kaj to pomeni:

:::premisli
Vodoinštalater ima ozko navpično cev, visoko $4\,\mathrm{m}$, in širok bazen, globok $4\,\mathrm{m}$. Oba sta polna vode. Napovej: kje je hidrostatični tlak na dnu večji?
---
Nikjer, enak je: $40\,000\,\mathrm{Pa}$. V bazenu je sicer veliko več vode, a ta pritiska na veliko večje dno. Na vsak kvadratni meter dna pritiska stolpec iste višine $h$.
:::

Oblika posode torej ni pomembna: v formuli $p = \rho g h$ ni ploščine in ni prostornine vode.

Na gladino odprte posode pritiska še zrak. Celotni tlak v globini je zato $p_0 + \rho g h$, kjer je $p_0$ zračni tlak. V nalogah spodaj računamo samo hidrostatični del.

## Rešeni primeri

### Primer 1: zidak na tleh

Zidak s težo $40\,\mathrm{N}$ leži na tleh s ploskvijo, ki ima ploščino $200\,\mathrm{cm^2}$. Kolikšen tlak povzroča na tla?

**Podatki:** $F = F_g = 40\,\mathrm{N}$, $S = 200\,\mathrm{cm^2}$
**Iščemo:** tlak $p$ na tla

:::formula
$p = \dfrac{F}{S}$, ploščina v $\mathrm{m^2}$ ($1\,\mathrm{m^2} = 10\,000\,\mathrm{cm^2}$)
:::

**Rešitev:**

1. Ploščino pretvorimo v $\mathrm{m^2}$, ker je paskal določen z njimi: $S = 200 : 10\,000 = 0{,}02\,\mathrm{m^2}$.
2. Sila na tla je teža zidaka, $F = 40\,\mathrm{N}$, ker zidak leži na vodoravnih tleh.
3. $p = \dfrac{40\,\mathrm{N}}{0{,}02\,\mathrm{m^2}} = 2000\,\mathrm{Pa}$.
4. Odgovor: zidak pritiska na tla s tlakom $2000\,\mathrm{Pa} = 2\,\mathrm{kPa}$.

### Primer 2: ima Luka prav?

Luka ima težo $600\,\mathrm{N}$. Podplata njegovih copat imata skupaj ploščino $400\,\mathrm{cm^2}$. Deska je dolga $1\,\mathrm{m}$ in široka $0{,}3\,\mathrm{m}$, njeno težo zanemarimo. Kolikšen tlak povzroča Luka na estrih v copatih in kolikšnega na deski? Kolikokrat se tlak razlikuje?

**Podatki:** $F = 600\,\mathrm{N}$, $S_1 = 400\,\mathrm{cm^2}$, deska $1\,\mathrm{m} \times 0{,}3\,\mathrm{m}$
**Iščemo:** tlaka $p_1$ in $p_2$ ter njuno razmerje

:::formula
$p = \dfrac{F}{S}$, ploščina pravokotnika $S = a \cdot b$
:::

**Rešitev:**

1. Copati: $S_1 = 400 : 10\,000 = 0{,}04\,\mathrm{m^2}$, zato $p_1 = \dfrac{600\,\mathrm{N}}{0{,}04\,\mathrm{m^2}} = 15\,000\,\mathrm{Pa}$.
2. Deska: $S_2 = 1\,\mathrm{m} \cdot 0{,}3\,\mathrm{m} = 0{,}3\,\mathrm{m^2}$, zato $p_2 = \dfrac{600\,\mathrm{N}}{0{,}3\,\mathrm{m^2}} = 2000\,\mathrm{Pa}$.
3. Razmerje: $15\,000 : 2000 = 7{,}5$. Sila je enaka, ploščina pa $7{,}5$-krat večja.
4. Odgovor: v copatih je tlak $15\,000\,\mathrm{Pa}$, na deski $2000\,\mathrm{Pa}$, torej $7{,}5$-krat manjši. Luka nima prav: enaka teža ne pomeni enakega tlaka.

### Primer 3: zamašek na dnu rezervoarja

Na podstrešju stoji rezervoar, voda v njem je visoka $1{,}5\,\mathrm{m}$. Odprtino na dnu s ploščino $20\,\mathrm{cm^2}$ zapira zamašek. S kolikšno silo voda pritiska na zamašek? Zračnega tlaka ne upoštevamo, gostota vode je $1000\,\mathrm{kg/m^3}$.

**Podatki:** $h = 1{,}5\,\mathrm{m}$, $S = 20\,\mathrm{cm^2}$, $\rho = 1000\,\mathrm{kg/m^3}$, $g = 10\,\mathrm{N/kg}$
**Iščemo:** silo $F$ na zamašek

:::formula
Najprej $p = \rho \, g \, h$, nato iz $p = \dfrac{F}{S}$ sledi $F = p \cdot S$
:::

**Rešitev:**

1. Tlak na dnu: $p = 1000 \cdot 10 \cdot 1{,}5 = 15\,000\,\mathrm{Pa}$.
2. Ploščina v $\mathrm{m^2}$: $S = 20 : 10\,000 = 0{,}002\,\mathrm{m^2}$.
3. Iščemo silo, zato formulo obrnemo: $F = p \cdot S$.
4. $F = 15\,000 \cdot 0{,}002 = 30\,\mathrm{N}$.
5. Odgovor: voda pritiska na zamašek s silo $30\,\mathrm{N}$, približno tako kot teža telesa z maso $3\,\mathrm{kg}$. Zato mora biti zamašek dobro vstavljen.

### Primer 4 – zdaj ti: kako visoko je vodohran?

Manometer na vodovodni cevi v kleti kaže hidrostatični tlak $150\,000\,\mathrm{Pa}$. Kako visoko nad kletjo je gladina vode v vodohranu?

**Podatki:** $p = 150\,000\,\mathrm{Pa}$, $\rho = 1000\,\mathrm{kg/m^3}$, $g = 10\,\mathrm{N/kg}$
**Iščemo:** višino gladine $h$ nad cevjo

:::formula
Iz $p = \rho \, g \, h$ sledi $h = \dfrac{p}{\rho \cdot g}$
:::

**Rešitev:**

1. Višina gladine nad cevjo je ravno globina cevi pod gladino, torej $h$. Zato $p = \rho g h$ delimo z $\rho \cdot g$.
2. Imenovalec: $\rho \cdot g = 1000 \cdot 10 = 10\,000$.
3. Izračunaj $h$ sam, nato preveri:

:::premisli
Koliko je $h = \dfrac{150\,000}{10\,000}$?
---
$h = 15\,\mathrm{m}$. Smiselno: vsakih $10\,\mathrm{m}$ vode da približno $100\,000\,\mathrm{Pa}$.
:::

## Pogoste napake

- **»Enaka sila, enak učinek.«** Tako je mislil Luka. Učinek na podlago je odvisen od tlaka, ne le od sile: ista teža na $7{,}5$-krat večji ploskvi da $7{,}5$-krat manjši tlak. Vedno vprašaj tudi, kolikšna je ploskev.
- **Ploščina ostane v $\mathrm{cm^2}$.** Potem rezultat ni v paskalih, ampak $10\,000$-krat premajhen. Pred računom pretvori v $\mathrm{m^2}$.
- **»Več vode, večji tlak.«** Hidrostatični tlak je odvisen le od gostote in globine, ne od količine vode ali oblike posode. Več vode da večjo silo na večje dno, tlak pa ostane enak.
- **Globina od dna.** $h$ merimo od gladine navzdol do točke, ne od dna navzgor.
- **»Voda pritiska samo navzdol.«** Pritiska v vse smeri, tudi na stene in navzgor na predmet pod gladino. Zato voda pritiska tudi na jez, in ker tlak z globino narašča, je jez spodaj debelejši.

## Povzetek

- Tlak je količnik pravokotne sile in ploščine: $p = \dfrac{F}{S}$. Enota je paskal, $1\,\mathrm{Pa} = 1\,\mathrm{N/m^2}$.
- Pri isti sili manjša ploskev pomeni večji tlak (dleto), večja manjši (deska, temelj).
- Pred računom pretvori $\mathrm{cm^2}$ v $\mathrm{m^2}$: $1\,\mathrm{m^2} = 10\,000\,\mathrm{cm^2}$.
- Tekočina pritiska v vse smeri, pravokotno na ploskve; na isti globini je tlak enak.
- Hidrostatični tlak: $p = \rho g h$, $h$ je globina pod gladino. Ni odvisen od oblike posode ali količine tekočine.
- V vodi tlak naraste za približno $100\,000\,\mathrm{Pa}$ na vsakih $10\,\mathrm{m}$.
- Silo na ploskev dobimo s $F = p \cdot S$.

## Drugače: Na sliki

Predstavljaj si stolp iz zloženih vrečk vode. Spodnja vrečka nosi vse nad seboj, zgornja skoraj nič. Tako je v rezervoarju: globlje kot si, več vode je nad tabo in večji je tlak.

Zdaj nariši dve posodi: ozko visoko cev in široko skledo, obe napolnjeni do višine $h$. Nad vsakim kvadratnim centimetrom dna stoji enako visok stolpec vode. V skledi je stolpcev več, a vsak pritiska enako. Zato je tlak na dnu enak, sila na celotno dno pa je v skledi večja.

Pri trdnih telesih nariši isto opeko dvakrat: plosko in pokonci. Puščica teže je obakrat enako dolga, ploskev pod opeko pa je pokonci ozka. Ista puščica na ožji ploskvi pomeni večji tlak.

## Drugače: Bolj natančno (izpeljava)

Vzemimo navpičen valj tekočine s ploščino osnovne ploskve $S$ in višino $h$, od gladine do opazovane globine. Prostornina valja je $V = S \cdot h$, masa tekočine v njem pa $m = \rho V = \rho S h$. Njegova teža je

$$F_g = m g = \rho S h g.$$

Ta teža pritiska na ploskev $S$ na dnu valja, zato je tlak

$$p = \frac{F_g}{S} = \frac{\rho S h g}{S} = \rho g h.$$

Ploščina $S$ se pokrajša. Zato tlak ni odvisen od širine valja ali oblike posode, ampak le od $\rho$, $g$ in $h$.

Zakaj tekočina pritiska tudi vstran in navzgor? Delci tekočine se prosto premikajo. Če jih stiskamo od zgoraj, se rinejo na vse strani, dokler tlak v isti globini ni povsod enak. Zato isti $p$ deluje tudi na bočno steno in na spodnjo stran potopljenega predmeta.

## Preveri se

? Katera trditev o tlaku je pravilna?
- Tlak je drugo ime za silo, ki pritiska na ploskev.
~ Sila in tlak nista isto: ista sila da na majhni ploskvi velik tlak, na veliki pa majhnega.
+ Tlak pove, kolikšna sila deluje na vsak kvadratni meter ploskve; $1\,\mathrm{Pa} = 1\,\mathrm{N/m^2}$.
- Mirujoča voda pritiska samo navzdol, na dno posode.
~ Voda pritiska v vse smeri, tudi na stene in navzgor. Na isti globini je tlak v vseh smereh enak.
- Hidrostatični tlak je večji v posodi, v kateri je več vode.
~ Količina vode ni pomembna, šteje le globina pod gladino: $p = \rho g h$.
> Tlak je količnik sile in ploščine, $p = \dfrac{F}{S}$, zato pove silo na enoto ploščine.

? Vreča cementa s težo $250\,\mathrm{N}$ leži na tleh s ploskvijo $1250\,\mathrm{cm^2}$. Kolikšen tlak povzroča na tla?
- $0{,}2\,\mathrm{Pa}$
~ Ploščino si pustil v $\mathrm{cm^2}$. Najprej pretvori: $1250\,\mathrm{cm^2} = 0{,}125\,\mathrm{m^2}$.
- $31{,}25\,\mathrm{Pa}$
~ Silo si pomnožil s ploščino. Tlak je količnik: silo deliš s ploščino.
- $250\,\mathrm{Pa}$
~ To je kar teža vreče. Sila v newtonih še ni tlak; deliti jo moraš s ploščino.
+ $2000\,\mathrm{Pa}$
> $S = 0{,}125\,\mathrm{m^2}$, $p = \dfrac{250\,\mathrm{N}}{0{,}125\,\mathrm{m^2}} = 2000\,\mathrm{Pa}$.

? Rezervoar je poln vode do višine $5\,\mathrm{m}$. Ana je izračunala tlak v točki $2\,\mathrm{m}$ pod gladino: »$h = 5\,\mathrm{m} - 2\,\mathrm{m} = 3\,\mathrm{m}$, zato $p = 1000 \cdot 10 \cdot 3 = 30\,000\,\mathrm{Pa}$.« Kje je napaka?
- Napake ni: globino merimo od dna navzgor.
~ Tlak povzroča voda **nad** točko, zato merimo od gladine navzdol.
+ Globina je $2\,\mathrm{m}$, ker jo merimo od gladine, zato je $p = 20\,000\,\mathrm{Pa}$.
- Manjka ploščina dna rezervoarja; brez nje tlaka ne moremo izračunati.
~ V $p = \rho g h$ ploščine ni. Oblika in velikost posode na hidrostatični tlak ne vplivata.
> Nad točko je $2\,\mathrm{m}$ vode: $p = 1000 \cdot 10 \cdot 2 = 20\,000\,\mathrm{Pa}$.

? Ozka cev s $3\,\mathrm{L}$ vode in širok sod z $200\,\mathrm{L}$ vode sta napolnjena do iste višine $1\,\mathrm{m}$. Primerjaj hidrostatični tlak na njunih dnih.
- V sodu je večji, ker je v njem več vode.
~ Več vode pritiska na večje dno, zato je večja le skupna sila na dno, ne tlak.
- V cevi je večji, ker je voda stisnjena v ozek prostor.
~ Voda v cevi ni bolj stisnjena; nad vsako točko dna je enako visok stolpec kot v sodu.
+ Enak je v obeh.
> $p = \rho g h$ je odvisen le od gostote in globine. Oba imata vodo do $1\,\mathrm{m}$, zato je tlak obakrat $10\,000\,\mathrm{Pa}$.

? Lestev se na razmočenem vrtu pogreza v zemljo. Mojster pod njeni nogi podloži široko desko. Zakaj to pomaga?
- Ne pomaga, ker teža lestve ostane enaka.
~ Teža je res enaka, a se porazdeli po večji ploskvi. Odločilen je tlak, ne le sila.
+ Ista teža deluje na večjo ploskev, zato je tlak na zemljo manjši.
- Deska zmanjša težo lestve.
~ Teža lestve je odvisna od njene mase in ostane enaka; deska ji doda še svojo težo, a jo porazdeli po veliko večji ploskvi.
> Iz $p = \dfrac{F}{S}$: pri isti sili večja ploščina pomeni manjši tlak, zato se lestev ne pogreza.

:::simboli
p | tlak | p = \dfrac{F}{S} | Pa | v tekočini $p = \rho g h$ (hidrostatični tlak)
p_1 | tlak v copatih | p_1 = \dfrac{F}{S_1} | Pa
p_2 | tlak na deski | p_2 = \dfrac{F}{S_2} | Pa
p_0 | zračni tlak | | Pa | ob morju približno $100\,000\,\mathrm{Pa}$
F | sila, pravokotna na ploskev | F = p \cdot S | N
S | ploščina ploskve | | m^2 | $1\,\mathrm{m^2} = 10\,000\,\mathrm{cm^2}$
S_1 | ploščina podplatov | | m^2
S_2 | ploščina deske | S_2 = a \cdot b | m^2
a | dolžina deske | | m
b | širina deske | | m
F_g | teža | F_g = m \cdot g | N
m | masa | m = \rho \cdot V | kg
V | prostornina stolpca tekočine | V = S \cdot h | m^3
\rho | gostota tekočine | \rho = \dfrac{m}{V} | kg/m^3
g | težni pospešek | | N/kg | približno $10\,\mathrm{N/kg}$
h | globina pod gladino | h = \dfrac{p}{\rho \cdot g} | m
:::
