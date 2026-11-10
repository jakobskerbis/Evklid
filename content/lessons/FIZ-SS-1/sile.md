---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tvoj telefon leži na mizi, priklopljen na polnilnik. Sošolec Jaka trdi: »Če kabel vleče telefon s silo $3\,\mathrm{N}$, ti pa ga s prstom potiskaš s silo $4\,\mathrm{N}$, deluje nanj skupaj vedno $7\,\mathrm{N}$.«

Ima prav? Odvisno je od tega, **kam** kažeta sili. Če vlečeta v isto smer, ja. Če vlečeta ena proti drugi, ostane le $1\,\mathrm{N}$. Če sta pravokotni, pa ne dobimo ne $7$ ne $1$, ampak $5\,\mathrm{N}$.

Kako to vemo? Podobno nalogo si že reševal pri hitrostih: hitrost čolna in hitrost reke sta se seštevali kot puščici. S silami je zelo podobno, a s pomembnimi razlikami. Ko jih poznaš, znaš povedati, kako močno nosilec drži telefon v avtu, s kolikšno silo morajo propelerji držati dron v vetru ali koliko kabel v resnici vleče telefon po mizi.

## Razlaga

**Kaj je sila.** Sila je **delovanje enega telesa na drugo**. Telo s silo spremeni hitrost drugega telesa ali ga deformira (stisne, upogne, raztegne). Merimo jo z **dinamometrom**, to je vzmet z lestvico: večja sila vzmet bolj raztegne. Enota je **newton** ($\mathrm{N}$). Občutek za velikost: na dlani držiš telefon, ki pritiska s silo približno $2\,\mathrm{N}$.

**Kot hitrost, a ne povsem.** Sila je **vektor**, tako kot hitrost: ima velikost in smer, rišemo jo s puščico. Dolžina puščice pove velikost (v izbranem merilu, npr. $1\,\mathrm{cm}$ za $1\,\mathrm{N}$), smer puščice pa smer sile. Razlike med silo in hitrostjo:

| | hitrost | sila |
|---|---|---|
| kaj opiše | kako se telo giblje | kako drugo telo deluje nanj |
| koliko jih je | telo ima eno hitrost | nanj deluje več sil hkrati |
| izhodišče puščice | kjerkoli | **prijemališče** (kjer sila deluje) |
| vsota nič | telo miruje | telo miruje ali se giblje enakomerno premo |

Zadnja vrstica je presenetljiva. Telefon na mizi miruje, a nanj delujeta vsaj dve sili. Vsota vseh sil nanj je nič.

**Vrste sil.** Za vsako silo moraš znati povedati, **katero telo** jo povzroča. Ločimo dve skupini:

- **Sile na daljavo** delujejo brez dotika. **Teža** $F_\mathrm{g}$ je sila, s katero Zemlja privlači telo. Na vsak kilogram mase deluje približno $9{,}81\,\mathrm{N}$; to število označimo z $g$ (težni pospešek), zato $F_\mathrm{g} = m\,g$. Kaže navpično navzdol. Sem sodita še **magnetna sila** (magnetni nosilec telefona v avtu) in **električna sila** (zdrgnjen balon privlači lase).
- **Dotikalne sile** delujejo le ob stiku. **Sila podlage** deluje pravokotno iz podlage (miza drži telefon). **Sila vrvi** ali kabla vedno vleče vzdolž vrvi. **Sila vzmeti** deluje, ko vzmet stisnemo ali raztegnemo. **Trenje** zavira drsenje po podlagi. **Upor zraka** ali vode zavira gibanje skozi snov.

Pozor: teža ni masa. Masa ($\mathrm{kg}$) pove, koliko snovi je v telesu, teža ($\mathrm{N}$) je sila, s katero ga vleče Zemlja.

:::premisli
Na Luni je $g$ približno šestkrat manjši kot na Zemlji. Kaj se zgodi z maso in kaj s težo telefona, ki ga astronavt nese na Luno?
---
Masa ostane enaka, saj ima telefon še vedno enako snovi. Teža se zmanjša na približno šestino, ker je $F_\mathrm{g} = m\,g$ in se je zmanjšal $g$.
:::

**Sestavljanje sil.** Več sil, ki delujejo na isto telo, lahko nadomestimo z eno samo, z **rezultanto** $\vec F_\mathrm{r}$. Rezultanta ima enak učinek kot vse sile skupaj. Pravila so enaka kot pri hitrostih:

- sili v isti smeri seštejemo: $3\,\mathrm{N} + 4\,\mathrm{N} = 7\,\mathrm{N}$;
- nasprotni sili odštejemo: $4\,\mathrm{N} - 3\,\mathrm{N} = 1\,\mathrm{N}$, rezultanta kaže v smer večje;
- pri pravokotnih silah uporabimo Pitagorov izrek:

$$F_\mathrm{r} = \sqrt{F_1^2 + F_2^2}$$

Pri poljubnem kotu narišemo **paralelogram**: obe sili narišemo iz istega prijemališča, dopolnimo do paralelograma, rezultanta je njegova diagonala iz prijemališča. Ko je kot med silama večji, je rezultanta manjša. Leži nekje med razliko in vsoto velikosti.

V simulaciji spodaj (»Sestavljanje in razstavljanje sil«) nastavi silo $F_1$ na $3\,\mathrm{N}$ vzdolž osi $x$ in $F_2$ na $4\,\mathrm{N}$ vzdolž osi $y$. Nato $F_2$ obrni, da kaže v desno, in nazadnje v levo. Opazuj, kako se rezultanta spreminja: s $5\,\mathrm{N}$ na $7\,\mathrm{N}$ in nato na $1\,\mathrm{N}$. Jaka je torej imel prav le v enem posebnem primeru.

**Ravnovesje.** Če je rezultanta nič, rečemo, da so sile v **ravnovesju**. Za telefon na mizi: teža kaže navzdol, sila podlage enako močno navzgor.

**Razstavljanje sil.** Gre v obratno smer: eno silo nadomestimo z dvema **komponentama** v izbranih smereh, navadno vodoravni $F_x$ in navpični $F_y$. Tudi to poznaš: pri vodoravnem metu si hitrost razdelil na $v_x$ in $v_y$. Komponenti sta kateti pravokotnega trikotnika, sila je hipotenuza.

Za izračun potrebujemo kotni funkciji v pravokotnem trikotniku. **Kosinus** kota je razmerje med priležno kateto in hipotenuzo, **sinus** razmerje med nasprotno kateto in hipotenuzo, **tangens** pa razmerje med nasprotno in priležno kateto (z njim iz katet dobimo kot). Če sila $F$ oklepa kot $\alpha$ z vodoravnico, je:

$$F_x = F\cos\alpha$$

$$F_y = F\sin\alpha$$

Kosinus spada h kateti, ki **leži ob kotu**. Preizkus: $F_x^2 + F_y^2 = F^2$.

:::premisli
Kabel vleče telefon pod kotom $30^\circ$ nad mizo. Ali je vodoravna komponenta, ki telefon vleče po mizi, večja ali manjša od $\frac{1}{2}$ celotne sile? Kaj se zgodi, če kabel držiš vse bolj strmo?
---
Večja: $\cos 30^\circ \approx 0{,}87$, zato vodoravno deluje približno $87\,\%$ sile. Pri strmejšem kablu se vodoravna komponenta manjša, navpična pa raste. Pri $90^\circ$ kabel telefon le še dviguje.
:::

## Rešeni primeri

### Primer 1: telefon na mizi

Telefon z maso $180\,\mathrm{g}$ leži na mizi. Katere sile delujejo nanj in kolikšne so? Kolikšna je rezultanta?

**Podatki:** $m = 180\,\mathrm{g} = 0{,}18\,\mathrm{kg}$, $g = 9{,}81\,\mathrm{m/s^2}$, telefon miruje
**Iščemo:** teža $F_\mathrm{g}$, sila podlage $F_\mathrm{pod}$, rezultanta $F_\mathrm{r}$

:::formula
$F_\mathrm{g} = m\,g$; v ravnovesju je $F_\mathrm{r} = 0$
:::

**Rešitev:**

1. Masa v kilogramih: $180\,\mathrm{g} = 0{,}18\,\mathrm{kg}$, ker računamo v osnovnih enotah.
2. Teža (sila Zemlje, na daljavo): $F_\mathrm{g} = 0{,}18\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 1{,}8\,\mathrm{N}$, navzdol.
3. Sila podlage (dotikalna, sila mize): telefon miruje, zato mora biti enako velika in nasprotna, $F_\mathrm{pod} \approx 1{,}8\,\mathrm{N}$ navzgor.
4. Nasprotni sili odštejemo: $F_\mathrm{r} = 0$.
5. Odgovor: nanj delujeta teža $1{,}8\,\mathrm{N}$ navzdol in sila mize $1{,}8\,\mathrm{N}$ navzgor; rezultanta je nič.

### Primer 2: dva kabla na tablici

Tablico na mizi vlečeta dva kabla: polnilni s silo $3{,}0\,\mathrm{N}$ proti vzhodu, kabel slušalk s silo $4{,}0\,\mathrm{N}$ proti severu. Kolikšna je rezultanta in v katero smer kaže?

**Podatki:** $F_1 = 3{,}0\,\mathrm{N}$ (vzhod), $F_2 = 4{,}0\,\mathrm{N}$ (sever), kot med silama $90^\circ$
**Iščemo:** velikost $F_\mathrm{r}$ in kot $\varphi$ glede na vzhod

:::formula
$F_\mathrm{r} = \sqrt{F_1^2 + F_2^2}$, $\tan\varphi = \dfrac{F_2}{F_1}$
:::

**Rešitev:**

1. Sili sta pravokotni, zato velja Pitagorov izrek: $F_\mathrm{r} = \sqrt{3{,}0^2 + 4{,}0^2}\,\mathrm{N} = 5{,}0\,\mathrm{N}$.
2. Smer: v pravokotnem trikotniku je $\tan\varphi = \dfrac{4{,}0}{3{,}0} \approx 1{,}33$, torej $\varphi \approx 53^\circ$.
3. Odgovor: rezultanta je $5{,}0\,\mathrm{N}$ in kaže $53^\circ$ od vzhoda proti severu. Jakova trditev o $7\,\mathrm{N}$ tu ne drži.

### Primer 3: kabel pod kotom (dva koraka)

Telefon z maso $0{,}20\,\mathrm{kg}$ leži na mizi. Polnilni kabel ga vleče s silo $2{,}0\,\mathrm{N}$ pod kotom $30^\circ$ nad vodoravnico, a telefon se ne dvigne od mize. Kolikšni sta komponenti sile kabla? S kolikšno silo miza podpira telefon?

**Podatki:** $m = 0{,}20\,\mathrm{kg}$, $F = 2{,}0\,\mathrm{N}$, $\alpha = 30^\circ$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** $F_x$, $F_y$ in sila podlage $F_\mathrm{pod}$

:::formula
$F_x = F\cos\alpha$, $F_y = F\sin\alpha$; navpično: $F_\mathrm{pod} = F_\mathrm{g} - F_y$
:::

**Rešitev:**

1. Vodoravna komponenta leži ob kotu, zato kosinus: $F_x = 2{,}0\,\mathrm{N} \cdot \cos 30^\circ \approx 1{,}7\,\mathrm{N}$.
2. Navpična komponenta je nasprotna kateta, zato sinus: $F_y = 2{,}0\,\mathrm{N} \cdot \sin 30^\circ = 1{,}0\,\mathrm{N}$.
3. Teža telefona: $F_\mathrm{g} = 0{,}20\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 1{,}96\,\mathrm{N}$.
4. Navpično je telefon v ravnovesju: navzgor delujeta $F_y$ in $F_\mathrm{pod}$, navzdol teža. Zato $F_\mathrm{pod} = 1{,}96\,\mathrm{N} - 1{,}0\,\mathrm{N} \approx 0{,}96\,\mathrm{N}$.
5. Odgovor: kabel vleče vodoravno z $1{,}7\,\mathrm{N}$ in dviguje z $1{,}0\,\mathrm{N}$; miza zato podpira telefon le še z okoli $0{,}96\,\mathrm{N}$, ne s celo težo.

### Primer 4: zdaj ti

Dron leti naprej tako, da je nagnjen. Sila propelerjev je $5{,}0\,\mathrm{N}$ in oklepa kot $20^\circ$ z **navpičnico**. Kolikšna je navpična komponenta, ki drži dron v zraku, in kolikšna vodoravna, ki ga žene naprej?

**Podatki:** $F = 5{,}0\,\mathrm{N}$, kot z navpičnico $\beta = 20^\circ$
**Iščemo:** $F_y$ in $F_x$

:::formula
Komponenta ob kotu: $F\cos\beta$; nasprotna komponenta: $F\sin\beta$
:::

**Rešitev:**

1. Kot je merjen od navpičnice, zato ob kotu leži **navpična** komponenta: $F_y = F\cos\beta$.
2. Vodoravna je nasprotna kateta: $F_x = F\sin\beta$.
3. Vstavi in izračunaj sam, nato preveri:

:::premisli
Koliko sta $F_y = 5{,}0\,\mathrm{N} \cdot \cos 20^\circ$ in $F_x = 5{,}0\,\mathrm{N} \cdot \sin 20^\circ$?
---
$F_y \approx 4{,}7\,\mathrm{N}$ in $F_x \approx 1{,}7\,\mathrm{N}$. Preizkus: $4{,}7^2 + 1{,}7^2 \approx 25$, kar je $5{,}0^2$.
:::

## Pogoste napake

- **Velikosti vedno seštejem.** »$3\,\mathrm{N}$ in $4\,\mathrm{N}$ je $7\,\mathrm{N}$« velja le za sili v isti smeri. Sila je vektor, zato šteje tudi smer. Pri pravokotnih silah je rezultanta $5\,\mathrm{N}$, pri nasprotnih $1\,\mathrm{N}$. Najprej nariši puščice.
- **»Telo miruje, torej nanj ne deluje nobena sila.«** Na telefon na mizi deluje teža in sila podlage. Mirovanje pomeni, da je **rezultanta** nič, ne da sil ni. Za vsako telo, ki se ga kaj dotika, poišči dotikalne sile, nato še težo.
- **Komponenti seštejem v silo.** Pri sili $2{,}0\,\mathrm{N}$ pod $30^\circ$ sta komponenti $1{,}7\,\mathrm{N}$ in $1{,}0\,\mathrm{N}$; njuna vsota $2{,}7\,\mathrm{N}$ je večja od sile. Komponenti sta kateti, zato velja $F_x^2 + F_y^2 = F^2$.
- **Zamenjam sinus in kosinus.** Kosinus vedno spada h kateti **ob kotu**. Če je kot merjen od navpičnice, je z njim navpična komponenta, ne vodoravna. Pred računanjem nariši trikotnik in označi kot.
- **Teža in masa sta isto.** Masa je v $\mathrm{kg}$, teža v $\mathrm{N}$. Telefon z maso $0{,}18\,\mathrm{kg}$ ima težo $1{,}8\,\mathrm{N}$, ne $0{,}18\,\mathrm{N}$.

## Povzetek

- Sila je delovanje enega telesa na drugo; je vektor z velikostjo, smerjo in prijemališčem. Enota je newton ($\mathrm{N}$), merimo jo z dinamometrom.
- Sile na daljavo: teža $F_\mathrm{g} = m\,g$, magnetna, električna. Dotikalne: sila podlage (pravokotno na podlago), sila vrvi (vzdolž vrvi), sila vzmeti, trenje, upor.
- Rezultanta nadomesti vse sile: v isti smeri seštejemo, v nasprotni odštejemo, pri pravokotnih $F_\mathrm{r} = \sqrt{F_1^2 + F_2^2}$, sicer paralelogram.
- Rezultanta leži med razliko in vsoto velikosti sil; večji kot med silama pomeni manjšo rezultanto.
- Ravnovesje: rezultanta je nič, telo lahko miruje, čeprav nanj delujejo sile.
- Razstavljanje: $F_x = F\cos\alpha$, $F_y = F\sin\alpha$, če je $\alpha$ kot z vodoravnico; kosinus spada h kateti ob kotu.

## Drugače: Na sliki

Nariši silo kot puščico v merilu $1\,\mathrm{cm} \Rightarrow 1\,\mathrm{N}$.

**Sestavljanje (»rep na glavo«).** Nariši $F_1 = 3\,\mathrm{N}$ kot puščico dolžine $3\,\mathrm{cm}$ v desno. Na njeno konico prestavi rep puščice $F_2 = 4\,\mathrm{N}$ (dolžine $4\,\mathrm{cm}$) navzgor. Rezultanta je puščica od repa prve do konice druge. Izmeri jo z ravnilom: $5\,\mathrm{cm}$, torej $5\,\mathrm{N}$.

:::risba skica
opis: Sestavljanje dveh pravokotnih sil na mreži, kjer en kvadratek pomeni 1 N. Puščica F₁ = 3 N kaže tri kvadratke v desno. Na njeni konici se začne puščica F₂ = 4 N, ki kaže štiri kvadratke navzgor. Rezultanta F_r je puščica od začetka prve do konice druge.
območje: -1; -1 .. 5; 5
enota: 44
mreža: da
puščica: 0; 0 -> 3; 0 | F_1 = 3 N | pod | modra
puščica: 3; 0 -> 3; 4 | F_2 = 4 N | desno | zelena
puščica: 0; 0 -> 3; 4 | F_r | nad levo | oranžna
pravikot: 3; 0 | 0; 0 | 3; 4
točka: 0; 0
:::

**Razstavljanje (»senci«).** Predstavljaj si, da silo osvetliš od zgoraj: njena senca na tleh je vodoravna komponenta. Če jo osvetliš od strani, je senca na steni navpična komponenta. Bolj kot je puščica položna, daljša je senca na tleh in krajša na steni.

## Drugače: Iz vsakdanjega življenja

**Vrečka v dveh rokah.** Ko z bratom nosita težko vrečko vsak za en ročaj in sta tik skupaj, vsak drži približno polovico. Ko se razmakneta, ročaja vlečeta postrani in vsak mora vleči **bolj**: navpično prispeva le del njegove sile, ostalo vleče brata proti sebi.

**Magnetni nosilec v avtu.** Telefon se drži prezračevalne rešetke. Navzdol ga vleče teža, magnet pa ga vleče vodoravno k rešetki. Magnetna sila sama telefona ne drži navzgor; to naredi trenje med telefonom in nosilcem. Zato telefon na grbini zdrsne, če je nosilec šibak.

**Stojalo za telefon.** Ko telefon nasloniš na nagnjeno stojalo, ga podlaga ne podpira navpično, ampak pravokotno na naslon. To silo razstavimo na navpično (drži telefon) in vodoravno (potiska ga nazaj ob rob stojala).

## Preveri se

? Katera trditev je pravilna?
- Na telefon, ki miruje na mizi, ne deluje nobena sila.
~ Delujeta teža in sila mize. Ker sta enako veliki in nasprotni, je rezultanta nič.
+ Magnet v avtomobilskem nosilcu deluje na telefon, tudi ko se ga še ne dotika.
- Sila je določena že z velikostjo, smer ni pomembna.
~ Sila je vektor. Isti dve sili dasta glede na smer rezultanto med $1\,\mathrm{N}$ in $7\,\mathrm{N}$.
> Magnetna sila je sila na daljavo, tako kot teža. Za delovanje ne potrebuje dotika.

? Tablica ima maso $450\,\mathrm{g}$. Kolikšna je njena teža? ($g = 9{,}81\,\mathrm{m/s^2}$)
- $0{,}45\,\mathrm{N}$
~ To je masa v kilogramih, zapisana z enoto newton. Teža je $m\,g$.
+ $4{,}4\,\mathrm{N}$
- $4415\,\mathrm{N}$
~ Masa je ostala v gramih. Pred računanjem pretvori $450\,\mathrm{g} = 0{,}45\,\mathrm{kg}$.
- $450\,\mathrm{N}$
~ Masa in teža nista isto: teža je masa v kilogramih, pomnožena z $g$.
> $F_\mathrm{g} = m\,g = 0{,}45\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 4{,}4\,\mathrm{N}$.

? Kabel vleče s silo $10\,\mathrm{N}$ pod kotom $60^\circ$ nad vodoravnico. Rešitev v zvezku: »$F_x = 10\,\mathrm{N} \cdot \sin 60^\circ \approx 8{,}7\,\mathrm{N}$, $F_y = 10\,\mathrm{N} \cdot \cos 60^\circ = 5{,}0\,\mathrm{N}$.« Kje je napaka?
- Napake ni, številke so pravilno izračunane.
~ Računanje je res pravilno, a z napačno kotno funkcijo. Preveri, katera kateta leži ob kotu.
- Komponenti bi morali skupaj dati $10\,\mathrm{N}$.
~ Komponenti sta kateti, zato se seštevata po Pitagoru, ne navadno. Njuna vsota je vedno večja od sile.
+ Sinus in kosinus sta zamenjana: vodoravna komponenta leži ob kotu, zato $F_x = 10\,\mathrm{N} \cdot \cos 60^\circ = 5{,}0\,\mathrm{N}$.
> Kot $60^\circ$ je merjen od vodoravnice, zato vodoravni komponenti pripada kosinus: $F_x = 5{,}0\,\mathrm{N}$, $F_y \approx 8{,}7\,\mathrm{N}$. Strm kabel bolj dviguje kot vleče.

? Na telo delujeta sili po $5\,\mathrm{N}$. V primeru A sta vzporedni in kažeta v isto smer, v B sta pravokotni, v C sta nasprotni. Kako si sledijo rezultante?
- A = B = C, ker sta sili vedno enaki.
~ Velikosti sil sta enaki, rezultanta pa je odvisna tudi od kota med njima.
+ A ($10\,\mathrm{N}$) > B (okoli $7{,}1\,\mathrm{N}$) > C ($0$)
- B > A > C, ker pravokotni sili delujeta v dve smeri.
~ Pri pravokotnih silah se le del učinka sešteje; največja je rezultanta pri silah v isti smeri.
> Večji kot med silama pomeni manjšo rezultanto: $10\,\mathrm{N}$, $\sqrt{5^2 + 5^2} \approx 7{,}1\,\mathrm{N}$ in $0$.

? Dron lebdi na mestu, čeprav piha veter. Teža drona je $3{,}0\,\mathrm{N}$, veter ga potiska vodoravno s silo $4{,}0\,\mathrm{N}$. Kolikšna mora biti sila propelerjev?
- $3{,}0\,\mathrm{N}$
~ To bi bilo dovolj brez vetra. Propelerji morajo uravnovesiti tudi veter.
- $7{,}0\,\mathrm{N}$
~ Velikosti si seštel, kot da bi sili kazali v isto smer. Teža in veter sta pravokotna.
+ $5{,}0\,\mathrm{N}$
- $1{,}0\,\mathrm{N}$
~ Odštevamo le nasprotni sili. Teža in veter sta pravokotna.
> Propelerji morajo uravnovesiti rezultanto teže in vetra: $\sqrt{3{,}0^2 + 4{,}0^2}\,\mathrm{N} = 5{,}0\,\mathrm{N}$. Zato je dron v vetru nagnjen proti vetru.

:::simboli
F_\mathrm{g} | teža | F_\mathrm{g} = m\,g | N | sila, s katero Zemlja privlači telo
m | masa | | kg
g | težni pospešek | | m/s^2 | približno $9{,}81\,\mathrm{m/s^2}$
F_\mathrm{r} | rezultanta | F_\mathrm{r} = \sqrt{F_1^2 + F_2^2} | N | formula velja za pravokotni sili
F_1, F_2 | sili, ki ju sestavljamo | | N
F | sila, ki jo razstavljamo | F = \sqrt{F_x^2 + F_y^2} | N
F_x | vodoravna komponenta sile | F_x = F\cos\alpha | N
F_y | navpična komponenta sile | F_y = F\sin\alpha | N
\alpha | kot med silo in vodoravnico | | °
\beta | kot med silo in navpičnico | | °
\varphi | smer rezultante glede na vzhod | \tan\varphi = \frac{F_2}{F_1} | °
F_\mathrm{pod} | sila podlage | | N | pravokotno iz podlage
:::
