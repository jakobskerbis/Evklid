---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tvoj telefon leži na mizi, priklopljen na polnilnik. Sošolec Jaka trdi: »Če kabel vleče telefon s silo $3\,\mathrm{N}$, ti pa ga s prstom potiskaš s silo $4\,\mathrm{N}$, je skupna sila kabla in prsta vedno $7\,\mathrm{N}$.«

Ima prav? Odvisno je od tega, **kam** kažeta sili. Če kažeta v isto smer, ja. Če kažeta v nasprotni smeri, ostane le $1\,\mathrm{N}$. Če sta pravokotni, pa ne dobimo ne $7$ ne $1$, ampak $5\,\mathrm{N}$.

Kako to vemo? Podobno nalogo si že reševal pri hitrostih: hitrost čolna in hitrost reke sta se seštevali kot puščici. S silami je zelo podobno, a s pomembnimi razlikami. Ko jih poznaš, znaš povedati, s kolikšno silo morajo propelerji držati dron v vetru, koliko kabel v resnici vleče telefon po mizi in s kolikšno silo ga miza takrat še podpira.

## Razlaga

**Kaj je sila.** Sila je **delovanje enega telesa na drugo**. Telo s silo spremeni hitrost drugega telesa ali ga deformira (stisne, upogne, raztegne). Merimo jo z **dinamometrom**, to je vzmet z lestvico: večja sila vzmet bolj raztegne. Enota je **newton** ($\mathrm{N}$). Občutek za velikost: na dlani držiš telefon, ki pritiska s silo približno $2\,\mathrm{N}$.

**Kot hitrost, a ne povsem.** Sila je **vektor**, tako kot hitrost: ima velikost in smer, rišemo jo s puščico. Dolžina puščice pove velikost (v izbranem merilu, npr. $1\,\mathrm{cm}$ za $1\,\mathrm{N}$), smer puščice pa smer sile. Razlike med silo in hitrostjo:

| | hitrost | sila |
|---|---|---|
| kaj opiše | kako se telo giblje | kako drugo telo deluje nanj |
| koliko jih je | telo ima eno hitrost | nanj deluje več sil hkrati |
| izhodišče puščice | iz telesa | **prijemališče** (kjer sila deluje) |
| ko je nič | hitrost nič: telo miruje | vsota sil nič: telo miruje ali se giblje enakomerno premo (več pri Newtonovih zakonih) |

Zadnja vrstica je presenetljiva. Telefon na mizi miruje, a nanj delujeta vsaj dve sili. Vsota vseh sil nanj je nič.

**Vrste sil.** Za vsako silo moraš znati povedati, **katero telo** jo povzroča. Ločimo dve skupini:

- **Sile na daljavo** delujejo brez dotika. **Teža** $F_\mathrm{g}$ je sila, s katero Zemlja privlači telo. Na vsak kilogram mase deluje približno $9{,}81\,\mathrm{N}$; to število označimo z $g$, zato $F_\mathrm{g} = m\,g$. To je isti $g$ (težni pospešek) kot pri prostem padu, saj je $1\,\mathrm{N/kg} = 1\,\mathrm{m/s^2}$. Kaže navpično navzdol. Sem sodita še **magnetna sila** (magnetni nosilec telefona v avtu) in **električna sila** (zdrgnjen balon privlači lase).
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

Da pravilo res velja, pokaže poskus. Na kovinski obroček pripnemo tri dinamometre in jih vlečemo v treh smereh, dokler obroček ne miruje. Odčitane sile narišemo v merilu iz istega prijemališča. Diagonala paralelograma, ki ga napnemo na dve od njih, je v mejah merske napake enako dolga kot tretja sila in kaže ravno nasprotno. Rezultanta prvih dveh je torej res diagonala, saj jo tretja sila natanko uravnovesi.

Zakaj ravno diagonala? Paralelogram je isto kot pravilo »rep na glavo« pri hitrostih: stranica paralelograma, ki se začne na konici $F_1$ (na sliki pri pravem kotu navpična desna), je sila $F_2$, prestavljena na konico $F_1$. Diagonala je torej pot od repa prve do konice druge puščice.

:::risba graf
opis: Sestavljanje sil F₁ = 3 N v desno in F₂ = 4 N pod kotom {t}° glede na F₁. Črtkani stranici dopolnita paralelogram, rezultanta Fᵣ je njegova diagonala in meri {sqrt(25+24*cos(t*pi/180)):.1} N. V aplikaciji kot med silama spreminjaš z drsnikom.
x: -5 .. 8 | 1 | x (N)
y: -1 .. 5 | 1 | y (N)
enako: da
drsnik: t | 10 .. 170 | 10 | 90 | kot med silama v stopinjah
črta: 3; 0 -> 3 + 4*cos(t*pi/180); 4*sin(t*pi/180) | siva črtkano
črta: 4*cos(t*pi/180); 4*sin(t*pi/180) -> 3 + 4*cos(t*pi/180); 4*sin(t*pi/180) | siva črtkano
puščica: 0; 0 -> 3; 0 | F_1 | pod | modra debelo
puščica: 0; 0 -> 4*cos(t*pi/180); 4*sin(t*pi/180) | | | zelena debelo
puščica: 0; 0 -> 3 + 4*cos(t*pi/180); 4*sin(t*pi/180) | | | oranžna debelo
napis: 4*cos(t*pi/180); 4*sin(t*pi/180) | F_2 | nad levo
napis: 3 + 4*cos(t*pi/180); 4*sin(t*pi/180) | F_r | nad
podnapis: Kot med silama {t}°, rezultanta {sqrt(25+24*cos(t*pi/180)):.1} N
:::

V aplikaciji premikaj drsnik s kotom med silama $F_1 = 3\,\mathrm{N}$ in $F_2 = 4\,\mathrm{N}$. Slika kaže pravi kot in rezultanto $5{,}0\,\mathrm{N}$. Ko kot raste, je rezultanta vse manjša: pri $120^\circ$ na drsniku odčitaš okoli $3{,}6\,\mathrm{N}$ (v zvezku isto dobiš, če paralelogram narišeš v merilu in diagonalo izmeriš z ravnilom). Izziv: najprej oceni, pri katerem kotu bo rezultanta okoli $4\,\mathrm{N}$, nato preveri z drsnikom (blizu $110^\circ$). Pri $0^\circ$ in $180^\circ$ bi vse tri puščice ležale na isti premici: tam dobiš $7{,}0\,\mathrm{N}$ oziroma le $1{,}0\,\mathrm{N}$. Jaka je torej imel prav le v enem posebnem primeru. Isto lahko preizkusiš še v simulaciji spodaj (»Sestavljanje in razstavljanje sil«).

**Ravnovesje.** Če je rezultanta nič, rečemo, da so sile v **ravnovesju**. Velja tudi obratno: na telo, ki miruje, deluje rezultanta nič. Za telefon na mizi: teža kaže navzdol, sila podlage enako močno navzgor. Tako sliko, na kateri so narisane vse sile na eno telo, imenujemo **skica sil**.

:::risba skica
opis: Skica sil na telefon, ki leži na mizi. Iz sredine telefona kaže puščica teže F g = 1,7 N navpično navzdol; povzroča jo Zemlja na daljavo. Iz stika z mizo (spodnja ploskev telefona) kaže enako dolga puščica sile podlage F pod = 1,7 N navpično navzgor; povzroča jo miza z dotikom. Zaradi preglednosti sta puščici narisani druga ob drugi; piki označujeta prijemališči.
območje: -4; -3 .. 4; 3
enota: 38
pravokotnik: -3; -0,5 .. 3; 0 | siva ozadje
pravokotnik: -1,2; 0 .. 1,2; 0,6 | modra
puščica: -0,4; 0,3 -> -0,4; -2,2 | F_g = 1,7 N | levo | rdeča debelo
puščica: 0,4; 0 -> 0,4; 2,5 | F_{pod} = 1,7 N | desno | zelena debelo
točka: -0,4; 0,3
točka: 0,4; 0
napis: 1,5; -0,9 | miza | desno
podnapis: Teža (Zemlja) in sila podlage (miza) sta enako veliki in nasprotni, zato je rezultanta nič. Pika je prijemališče.
:::

**Razstavljanje sil.** Gre v obratno smer: eno silo nadomestimo z dvema **komponentama** v izbranih smereh, navadno vodoravni $F_x$ in navpični $F_y$. Tudi to poznaš: pri vodoravnem metu si hitrost razdelil na $v_x$ in $v_y$. Komponenti sta kateti pravokotnega trikotnika, sila je hipotenuza.

Za izračun potrebujemo kotne funkcije v pravokotnem trikotniku. **Priležna** kateta leži ob kotu, **nasprotna** mu leži nasproti. **Kosinus** kota je razmerje med priležno kateto in hipotenuzo, **sinus** razmerje med nasprotno kateto in hipotenuzo, **tangens** pa razmerje med nasprotno in priležno kateto (z njim iz katet dobimo kot). Na znanem trikotniku s katetama $3$ in $4$ ter hipotenuzo $5$ je za kot ob kateti $3$: $\cos\alpha = \frac{3}{5} = 0{,}6$, $\sin\alpha = \frac{4}{5} = 0{,}8$ in $\tan\alpha = \frac{4}{3}$, torej $\alpha \approx 53^\circ$. Računalo mora biti v načinu za stopinje (DEG). V načinu RAD dobiš za $\cos 30^\circ$ namesto $0{,}87$ napačno število $0{,}15$.

:::risba skica
opis: Pravokotni trikotnik sil. Hipotenuza je sila F, ki iz levega spodnjega oglišča kaže poševno navzgor pod kotom alfa nad vodoravnico. Vodoravna kateta ob kotu je priležna in meri F cos alfa. Navpična kateta na desni, nasproti kota, je nasprotna in meri F sin alfa. Kot alfa je označen z lokom.
območje: -0,5; -0,8 .. 6; 2,6
enota: 44
puščica: 0; 0 -> 3; 2 | F (hipotenuza) | nad levo | oranžna debelo
črta: 0; 0 -> 3; 0 | modra debelo
črta: 3; 0 -> 3; 2 | zelena debelo
pravikot: 3; 0 | 0; 0 | 3; 2
črta: 0,8; 0 -> 0,792; 0,111 -> 0,769; 0,221 -> 0,731; 0,325 -> 0,666; 0,444 | siva
napis: 0,85; 0,2 | α | desno
napis: 1,5; 0 | priležna: F cos α | pod
napis: 3; 1 | nasprotna: F sin α | desno
podnapis: Kosinus spada h kateti ob kotu, sinus h kateti nasproti kota.
:::

Če sila $F$ oklepa kot $\alpha$ z vodoravnico, je:

$$F_x = F\cos\alpha$$

$$F_y = F\sin\alpha$$

Kosinus spada h kateti, ki **leži ob kotu**. Preizkus: $F_x^2 + F_y^2 = F^2$.

:::risba graf
opis: Sila kabla F = 2 N pod kotom {a}° nad vodoravnico in njeni komponenti: vodoravna meri {2*cos(a*pi/180):.2} N, navpična {2*sin(a*pi/180):.2} N. Črtkani črti od konice sile do osi sta stranici pravokotnika. V aplikaciji kot spreminjaš z drsnikom.
x: -0,5 .. 3 | 0,5 | x (N)
y: -0,5 .. 2,5 | 0,5 | y (N)
enako: da
drsnik: a | 5 .. 85 | 5 | 30 | kot kabla nad vodoravnico v stopinjah
črta: 2*cos(a*pi/180); 0 -> 2*cos(a*pi/180); 2*sin(a*pi/180) | siva črtkano
črta: 0; 2*sin(a*pi/180) -> 2*cos(a*pi/180); 2*sin(a*pi/180) | siva črtkano
puščica: 0; 0 -> 2*cos(a*pi/180); 0 | | | modra debelo
puščica: 0; 0 -> 0; 2*sin(a*pi/180) | | | zelena debelo
puščica: 0; 0 -> 2*cos(a*pi/180); 2*sin(a*pi/180) | | | oranžna debelo
napis: 2*cos(a*pi/180); 0 | F_x | pod desno
napis: 0; 2*sin(a*pi/180) | F_y | nad levo
napis: 2*cos(a*pi/180); 2*sin(a*pi/180) | F | nad desno
podnapis: Kot {a}°: vodoravno {2*cos(a*pi/180):.2} N, navpično {2*sin(a*pi/180):.2} N
:::

Slika kaže silo $2{,}0\,\mathrm{N}$ pod $30^\circ$: vodoravna komponenta je $1{,}73\,\mathrm{N}$, navpična $1{,}00\,\mathrm{N}$. V aplikaciji z drsnikom dvigni kabel proti $90^\circ$ in opazuj, katera komponenta raste in katera se krči. Komponenti sta enaki pri $45^\circ$, ker tam velja enačba $\cos\alpha = \sin\alpha$.

:::premisli
Kabel vleče telefon pod kotom $30^\circ$ nad mizo. Ali je vodoravna komponenta, ki telefon vleče po mizi, večja ali manjša od $\frac{1}{2}$ celotne sile? Kaj se zgodi, če kabel držiš vse bolj strmo?
---
Večja: $\cos 30^\circ \approx 0{,}87$, zato vodoravno deluje približno $87\,\%$ sile. Pri strmejšem kablu se vodoravna komponenta manjša, navpična pa raste. Pri $90^\circ$ kabel telefon le še dviguje.
:::

## Rešeni primeri

### Primer 1: telefon na mizi

Proizvajalec za telefon iPhone 16 navaja maso $170\,\mathrm{g}$. Telefon leži na mizi. Katere sile delujejo nanj in kolikšne so? Kolikšna je rezultanta?

**Podatki:** $m = 170\,\mathrm{g} = 0{,}17\,\mathrm{kg}$, $g = 9{,}81\,\mathrm{m/s^2}$, telefon miruje
**Iščemo:** teža $F_\mathrm{g}$, sila podlage $F_\mathrm{pod}$, rezultanta $F_\mathrm{r}$

:::formula
$F_\mathrm{g} = m\,g$; v ravnovesju je $F_\mathrm{r} = 0$
:::

**Rešitev:**

1. Masa v kilogramih: $170\,\mathrm{g} = 0{,}17\,\mathrm{kg}$, ker računamo v osnovnih enotah.
2. Teža (sila Zemlje, na daljavo): $F_\mathrm{g} = 0{,}17\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 1{,}7\,\mathrm{N}$, navzdol.
3. Sila podlage (dotikalna, sila mize): telefon miruje, zato mora biti enako velika in nasprotna, $F_\mathrm{pod} \approx 1{,}7\,\mathrm{N}$ navzgor (skica sil zgoraj).
4. Nasprotni sili odštejemo: $F_\mathrm{r} = 0$.
5. Odgovor: nanj delujeta teža $1{,}7\,\mathrm{N}$ navzdol in sila mize $1{,}7\,\mathrm{N}$ navzgor; rezultanta je nič.

### Primer 2: dva kabla na tablici

Tablico na mizi vlečeta dva kabla: polnilni s silo $3{,}0\,\mathrm{N}$ proti vzhodu, kabel slušalk s silo $4{,}0\,\mathrm{N}$ proti severu. Kolikšna je rezultanta sil obeh kablov in v katero smer kaže?

**Podatki:** $F_1 = 3{,}0\,\mathrm{N}$ (vzhod), $F_2 = 4{,}0\,\mathrm{N}$ (sever), kot med silama $90^\circ$
**Iščemo:** velikost rezultante sil kablov $F_\mathrm{r}$ in kot $\varphi$ glede na vzhod

:::formula
$F_\mathrm{r} = \sqrt{F_1^2 + F_2^2}$, $\tan\varphi = \dfrac{F_2}{F_1}$
:::

**Rešitev:**

1. Sili sta pravokotni, zato velja Pitagorov izrek: $F_\mathrm{r} = \sqrt{3{,}0^2 + 4{,}0^2}\,\mathrm{N} = 5{,}0\,\mathrm{N}$.
2. Smer: v pravokotnem trikotniku je $\tan\varphi = \dfrac{4{,}0}{3{,}0} \approx 1{,}33$, torej $\varphi \approx 53^\circ$ (tipka $\tan^{-1}$ na računalu).
3. Odgovor: rezultanta sil obeh kablov je $5{,}0\,\mathrm{N}$ in kaže $53^\circ$ od vzhoda proti severu. Jakova trditev o $7\,\mathrm{N}$ tu ne drži.

### Primer 3: kabel pod kotom (dva koraka)

Telefon z maso $0{,}20\,\mathrm{kg}$ leži na mizi. Polnilni kabel ga vleče s silo $2{,}0\,\mathrm{N}$ pod kotom $30^\circ$ nad vodoravnico, a telefon se ne dvigne od mize. Kolikšni sta komponenti sile kabla? S kolikšno silo miza podpira telefon?

**Podatki:** $m = 0{,}20\,\mathrm{kg}$, $F = 2{,}0\,\mathrm{N}$, $\alpha = 30^\circ$, $g = 9{,}81\,\mathrm{m/s^2}$, telefon ostane na mizi
**Iščemo:** $F_x$, $F_y$ in sila podlage $F_\mathrm{pod}$

:::formula
$F_x = F\cos\alpha$, $F_y = F\sin\alpha$; navpično: $F_\mathrm{pod} = F_\mathrm{g} - F_y$
:::

**Rešitev:**

1. Vodoravna komponenta leži ob kotu, zato kosinus: $F_x = 2{,}0\,\mathrm{N} \cdot \cos 30^\circ \approx 1{,}7\,\mathrm{N}$.
2. Navpična komponenta je nasprotna kateta, zato sinus: $F_y = 2{,}0\,\mathrm{N} \cdot \sin 30^\circ = 1{,}0\,\mathrm{N}$.
3. Teža telefona: $F_\mathrm{g} = 0{,}20\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 2{,}0\,\mathrm{N}$.
4. Navpično je telefon v ravnovesju: navzgor delujeta $F_y$ in $F_\mathrm{pod}$, navzdol teža. Zato $F_\mathrm{pod} = 2{,}0\,\mathrm{N} - 1{,}0\,\mathrm{N} = 1{,}0\,\mathrm{N}$.
5. Odgovor: kabel vleče vodoravno z $1{,}7\,\mathrm{N}$ in dviguje z $1{,}0\,\mathrm{N}$; miza zato podpira telefon le še z okoli $1{,}0\,\mathrm{N}$, to je s polovico teže. Ali telefon pri tem ostane na mestu ali zdrsne po mizi, je odvisno od trenja; to obravnavamo pozneje.

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
- **Teža in masa sta isto.** Masa je v $\mathrm{kg}$, teža v $\mathrm{N}$. Telefon z maso $0{,}17\,\mathrm{kg}$ ima težo $1{,}7\,\mathrm{N}$, ne $0{,}17\,\mathrm{N}$.

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
opis: Sestavljanje dveh pravokotnih sil na mreži, kjer en kvadratek pomeni 1 N. Puščica F₁ = 3 N kaže tri kvadratke v desno. Na njeni konici se začne puščica F₂ = 4 N, ki kaže štiri kvadratke navzgor. Rezultanta Fᵣ je puščica od začetka prve do konice druge.
območje: -1; -1 .. 5; 5
enota: 44
mreža: da
puščica: 0; 0 -> 3; 0 | F_1 = 3 N | pod | modra
puščica: 3; 0 -> 3; 4 | F_2 = 4 N | desno | zelena
puščica: 0; 0 -> 3; 4 | F_r | nad levo | oranžna
točka: 0; 0
:::

**Razstavljanje (»senci«).** Predstavljaj si, da silo osvetliš od zgoraj: njena senca na tleh je vodoravna komponenta. Če jo osvetliš od strani, je senca na steni navpična komponenta. Bolj kot je puščica položna, daljša je senca na tleh in krajša na steni.

## Drugače: Iz vsakdanjega življenja

**Vrečka v dveh rokah.** Ko z bratom nosita težko vrečko vsak za en ročaj in sta tik skupaj, vsak drži približno polovico. Ko se razmakneta, ročaja vlečeta postrani in vsak mora vleči **bolj**: vrečko drži le navpična komponenta njegove sile. Vodoravni komponenti obeh sil vlečeta ročaja narazen in se izničita, zato ne pomagata nositi.

**Magnetni nosilec v avtu.** Telefon se drži prezračevalne rešetke. Navzdol ga vleče teža, magnet pa ga vleče vodoravno k rešetki. Magnetna sila sama telefona ne drži navzgor; to naredi trenje med telefonom in nosilcem. Zato telefon na grbini zdrsne, če je nosilec šibak.

**Stojalo za telefon.** Ko telefon nasloniš na nagnjeno stojalo, ga naslon ne podpira navpično, ampak pravokotno na naslon. Silo naslona razstavimo na navpično komponento (nosi le del teže) in vodoravno komponento, ki telefon potiska stran od naslona; zdrsniti mu ne pusti spodnji rob stojala, na katerem telefon stoji. Pri strmem naslonu večino teže nosi spodnji rob.

## Preveri se

? Katera trditev je pravilna?
- Na telefon, ki miruje na mizi, ne deluje nobena sila.
~ Delujeta teža in sila mize. Ker sta enako veliki in nasprotni, je rezultanta nič.
+ Magnet v avtomobilskem nosilcu deluje na telefon, tudi ko se ga še ne dotika.
- Sila je določena že z velikostjo, smer ni pomembna.
~ Sila je vektor. Sili $3\,\mathrm{N}$ in $4\,\mathrm{N}$ dasta glede na smer rezultanto med $1\,\mathrm{N}$ in $7\,\mathrm{N}$.
- Telefon z maso $0{,}17\,\mathrm{kg}$ ima težo $0{,}17\,\mathrm{N}$.
~ Masa in teža nista isto. Teža je $m\,g \approx 1{,}7\,\mathrm{N}$.
> Magnetna sila je sila na daljavo, tako kot teža. Za delovanje ne potrebuje dotika.

? Sani vlečeš z vrvjo s silo $80\,\mathrm{N}$ pod kotom $25^\circ$ nad vodoravnico. Kolikšna je vodoravna komponenta sile, ki sani vleče naprej?
= 72,5 N | 0,5
~ 33,8 | Zamenjal si sinus in kosinus. Vodoravna komponenta leži ob kotu, zato $F\cos\alpha$.
~ 79,3 | Računalo je bilo v načinu RAD. Preklopi na stopinje (DEG).
~ 80 | Celotna sila ne vleče vodoravno, saj vrv kaže poševno navzgor.
> $F_x = F\cos\alpha = 80\,\mathrm{N} \cdot \cos 25^\circ \approx 72{,}5\,\mathrm{N}$. Preostanek sile sani rahlo dviguje.

? Kabel vleče s silo $10\,\mathrm{N}$ pod kotom $60^\circ$ nad vodoravnico. Rešitev v zvezku: »$F_x = 10\,\mathrm{N} \cdot \sin 60^\circ \approx 8{,}7\,\mathrm{N}$, $F_y = 10\,\mathrm{N} \cdot \cos 60^\circ = 5{,}0\,\mathrm{N}$.« Kje je napaka?
- Napake ni, številke so pravilno izračunane.
~ Računanje je res pravilno, a z napačno kotno funkcijo. Preveri, katera kateta leži ob kotu.
- Komponenti bi morali skupaj dati $10\,\mathrm{N}$.
~ Komponenti sta kateti, zato se seštevata po Pitagoru, ne navadno. Tu je njuna vsota $13{,}7\,\mathrm{N}$, več od $10\,\mathrm{N}$.
+ Sinus in kosinus sta zamenjana: vodoravna komponenta leži ob kotu, zato $F_x = 10\,\mathrm{N} \cdot \cos 60^\circ = 5{,}0\,\mathrm{N}$.
> Kot $60^\circ$ je merjen od vodoravnice, zato vodoravni komponenti pripada kosinus: $F_x = 5{,}0\,\mathrm{N}$, $F_y \approx 8{,}7\,\mathrm{N}$. Strm kabel bolj dviguje kot vleče.

? Na mreži en kvadratek pomeni $1\,\mathrm{N}$. Sili $F_1$ in $F_2$ delujeta na isto telo, paralelogram je že dopolnjen. Z risbe odčitaj, koliko kvadratkov vodoravno in navpično seže rezultanta, in izračunaj njeno velikost v newtonih.
:::risba skica
opis: Mreža, en kvadratek pomeni 1 N. Iz izhodišča kaže F₁ 4 kvadratke v desno. F₂ kaže iz izhodišča 2 kvadratka v desno in 3 kvadratke navzgor. Črtkani stranici dopolnita paralelogram. Rezultanta Fᵣ kaže iz izhodišča do točke 6 kvadratkov desno in 3 kvadratke navzgor.
območje: -1; -1 .. 7; 4
enota: 36
mreža: da
črta: 4; 0 -> 6; 3 | siva črtkano
črta: 2; 3 -> 6; 3 | siva črtkano
puščica: 0; 0 -> 4; 0 | F_1 | pod | modra debelo
puščica: 0; 0 -> 2; 3 | F_2 | levo | zelena debelo
puščica: 0; 0 -> 6; 3 | F_r | pod desno | oranžna debelo
točka: 0; 0
:::
= 6,7 N | 0,1
~ 9 | Seštel si kvadratke vodoravno in navpično ($6 + 3$). Rezultanta je hipotenuza: uporabi Pitagorov izrek.
~ 7,6 | Seštel si velikosti $F_1 = 4\,\mathrm{N}$ in $F_2 \approx 3{,}6\,\mathrm{N}$, kot da bi kazali v isto smer. Sili oklepata kot.
~ 6 | Odčital si le vodoravni premik rezultante, navpičnega pa si izpustil.
> Rezultanta kaže $6$ kvadratkov desno in $3$ navzgor, zato $F_\mathrm{r} = \sqrt{6^2 + 3^2}\,\mathrm{N} \approx 6{,}7\,\mathrm{N}$. To je manj od vsote $7{,}6\,\mathrm{N}$, ker sili nista v isti smeri.

? Na telo delujeta dve sili po $5\,\mathrm{N}$. Razvrsti primere od največje do najmanjše rezultante.
1. sili kažeta v isto smer
2. kot med silama je $60^\circ$
3. sili sta pravokotni
4. kot med silama je $120^\circ$
5. sili kažeta v nasprotni smeri
> Večji kot med silama pomeni manjšo rezultanto: $10\,\mathrm{N}$; okoli $8{,}7\,\mathrm{N}$; okoli $7{,}1\,\mathrm{N}$; $5{,}0\,\mathrm{N}$ in $0$.

? Dron lebdi na mestu, čeprav piha veter. Teža drona je $2{,}4\,\mathrm{N}$, veter ga potiska vodoravno s silo $1{,}0\,\mathrm{N}$. Kolikšna mora biti sila propelerjev?
+ $2{,}6\,\mathrm{N}$
- $2{,}4\,\mathrm{N}$
~ To bi bilo dovolj brez vetra. Propelerji morajo uravnovesiti tudi veter.
- $3{,}4\,\mathrm{N}$
~ Velikosti si seštel, kot da bi sili kazali v isto smer. Teža in veter sta pravokotna.
- $1{,}4\,\mathrm{N}$
~ Odštevamo le nasprotni sili. Teža in veter sta pravokotna.
> Propelerji morajo uravnovesiti rezultanto teže in vetra: $\sqrt{2{,}4^2 + 1{,}0^2}\,\mathrm{N} = 2{,}6\,\mathrm{N}$. Zato je dron v vetru nagnjen proti vetru.

<<RACUN
vrednost: 0.17*9.81 | 1.7
vrednost: sqrt(3^2+4^2) | 5
vrednost: 180*atan(4/3)/pi | 53.13
vrednost: sqrt(3^2+4^2+2*3*4*cos(120*pi/180)) | 3.6
vrednost: 2*cos(30*pi/180) | 1.73
vrednost: 2*sin(30*pi/180) | 1
vrednost: 0.2*9.81 | 2.0
vrednost: 0.2*9.81-2*sin(30*pi/180) | 1.0
vrednost: 180*acos(-0.375)/pi | 112.0
vrednost: cos(30) | 0.15
vrednost: 80*cos(25) | 79.3
vrednost: 5*cos(20*pi/180) | 4.7
vrednost: 5*sin(20*pi/180) | 1.7
vrednost: 80*cos(25*pi/180) | 72.5
vrednost: 80*sin(25*pi/180) | 33.8
vrednost: 10*cos(60*pi/180) | 5
vrednost: 10*sin(60*pi/180) | 8.7
vrednost: sqrt(6^2+3^2) | 6.7
vrednost: 4+sqrt(2^2+3^2) | 7.6
vrednost: sqrt(2.4^2+1^2) | 2.6
vrednost: sqrt(5^2+5^2+2*5*5*cos(60*pi/180)) | 8.7
vrednost: sqrt(5^2+5^2) | 7.1
>>

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
