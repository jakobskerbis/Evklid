---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V glasbenem stroju s kroglicami jeklene kroglice tečejo po žlebovih in udarjajo ob tipke vibrafona. Kroglica z maso $100\,\mathrm{g}$ prileti s hitrostjo $2{,}0\,\mathrm{m/s}$ in čelno zadene mirujočo kroglico z maso $300\,\mathrm{g}$. Ta se odkotali proti tipki s hitrostjo $1{,}0\,\mathrm{m/s}$.

Izračunaj produkt mase in hitrosti. Prva kroglica je prinesla $0{,}10 \cdot 2{,}0 = 0{,}20\,\mathrm{kg\,m/s}$. Zadeta odnese $0{,}30 \cdot 1{,}0 = 0{,}30\,\mathrm{kg\,m/s}$, torej *več*. Pa naj bi se ta količina pri trku ohranjala!

Videti je kot napaka v meritvi, a ni. Razrešitev paradoksa je jedro te teme. Ko jo razumeš, znaš na tekmovanju v nekaj vrsticah rešiti trke, odboje, eksplozije in odriv, tudi tam, kjer s silami ne prideš daleč, ker ne poznaš poteka sile med trkom.

## Razlaga

**Najprej en sam primer.** Na odru stojita kovčka z opremo na kolesih. Tehnik porine kovček z maso $40\,\mathrm{kg}$, da zapelje s hitrostjo $1{,}5\,\mathrm{m/s}$ proti mirujočemu kovčku z maso $60\,\mathrm{kg}$. Ob trku se zaponki zaskočita in kovčka nadaljujeta skupaj. Izmerimo skupno hitrost $0{,}6\,\mathrm{m/s}$.

Primerjajmo dve količini pred trkom in po njem:

| Količina | Pred trkom | Po trku |
|---|---|---|
| vsota $m v$ | $60\,\mathrm{kg\,m/s}$ | $60\,\mathrm{kg\,m/s}$ |
| vsota $\tfrac12 m v^2$ | $45\,\mathrm{J}$ | $18\,\mathrm{J}$ |

Prva vrstica se ni spremenila: $40 \cdot 1{,}5 = 60$ in $100 \cdot 0{,}6 = 60$. Druga se je zmanjšala za $27\,\mathrm{J}$. Ta energija je šla v zvok udarca, v segrevanje in v deformacijo zaponk.

**Gibalna količina.** Produkt mase in hitrosti telesa imenujemo **gibalna količina**:

$$p = m v$$

Enota je $\mathrm{kg\,m/s}$. Gibalna količina je vektor in ima smer hitrosti. Pri gibanju po premici to pomeni predznak: izberemo pozitivno smer in hitrost v nasprotno smer pišemo z minusom.

**Zakaj se ohranja.** Med trkom deluje prvi kovček na drugega s silo $F$, drugi na prvega po tretjem Newtonovem zakonu s silo $-F$, in to enako dolgo, $\Delta t$. Produkt sile in časa delovanja je **sunek sile**. Po drugem Newtonovem zakonu, $F = ma = m\,\Delta v / \Delta t$, je enak spremembi gibalne količine:

$$F \Delta t = \Delta p$$

Kar eno telo pridobi, drugo izgubi. Vsota se ohrani, če je vsota zunanjih sil (teža, sila podlage, trenje) nič ali je njihov sunek med kratkim trkom zanemarljiv. Takemu sistemu rečemo **zaprt sistem**. Za dve telesi na premici velja

$$m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2'$$

Črtica označuje hitrost po trku.

:::premisli
Kovčka imata namesto zaponk prožne odbijače, zato se odbijeta. Ali bo drugi kovček odpeljal hitreje ali počasneje kot $0{,}6\,\mathrm{m/s}$? Napovej, preden bereš naprej.
---
Hitreje. Prvemu kovčku se hitrost pri odboju spremeni bolj kot pri sprijemu (celo obrne se), zato drugemu preda več gibalne količine. Iz formul spodaj dobiš $v_2' = \dfrac{2 \cdot 40}{100} \cdot 1{,}5 = 1{,}2\,\mathrm{m/s}$, prvi pa se zapelje nazaj s $0{,}3\,\mathrm{m/s}$.
:::

**Sunek in boben.** Bobnar udari po opni s palico z maso $50\,\mathrm{g}$, ki prileti s hitrostjo $5\,\mathrm{m/s}$. Palica se dotika opne približno $2\,\mathrm{ms}$.

:::premisli
V enem primeru palica na opni obleži, v drugem odskoči s hitrostjo $3\,\mathrm{m/s}$. V katerem primeru opna dobi večji sunek in zakaj?
---
Ko palica odskoči. Opna dobi nasprotno enak sunek, kot ga dobi palica. Hitrost palice se spremeni od $+5$ do $-3\,\mathrm{m/s}$, torej za $8\,\mathrm{m/s}$, in ne le za $5\,\mathrm{m/s}$. Sprememba gibalne količine je $0{,}05 \cdot 8 = 0{,}40\,\mathrm{kg\,m/s}$ namesto $0{,}25\,\mathrm{kg\,m/s}$. Povprečna sila je $0{,}40 / 0{,}002 = 200\,\mathrm{N}$. Zato bobnarji palico pustijo odskočiti.
:::

**Vrste trkov.** Gibalna količina se ohranja pri vsakem trku v zaprtem sistemu. Kinetična energija $W_\mathrm{k} = \tfrac12 m v^2$ pa ne nujno.

- **Prožni trk:** vsota kinetičnih energij se ohrani. Jeklene kroglice so blizu tega.
- **Neprožni trk:** del kinetične energije preide v notranjo energijo in zvok.
- **Popolnoma neprožni trk:** telesi se sprimeta in nadaljujeta s skupno hitrostjo. Izguba je največja možna.

Klik ob trku jeklenih kroglic je torej znak, da trk ni čisto prožen. Popolnoma prožen trk bi bil tih.

**Od primera k splošnemu.** Pri popolnoma neprožnem trku ima ohranitveni zakon eno neznanko:

$$v' = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$$

Pri prožnem trku sta neznanki dve, zato potrebujemo še ohranitev kinetične energije. Iz obeh enačb sledi preprosto pravilo: relativna hitrost se pri čelnem prožnem trku le obrne,

$$v_1 - v_2 = v_2' - v_1'$$

Ta linearna enačba skupaj z ohranitvijo gibalne količine nadomesti kvadratno enačbo za energijo. Za mirujoče drugo telo ($v_2 = 0$) dobimo

$$v_1' = \frac{m_1 - m_2}{m_1 + m_2}\,v_1$$

$$v_2' = \frac{2 m_1}{m_1 + m_2}\,v_1$$

**Razrešitev paradoksa.** Za kroglici iz uvoda: $v_1' = \frac{0{,}10 - 0{,}30}{0{,}40} \cdot 2{,}0 = -1{,}0\,\mathrm{m/s}$. Prva kroglica se odbije nazaj in ima gibalno količino $-0{,}10\,\mathrm{kg\,m/s}$. Vsota po trku je $-0{,}10 + 0{,}30 = 0{,}20\,\mathrm{kg\,m/s}$, točno kot prej. Zadeta kroglica lahko dobi več, ker vpadna »gre v minus«.

Posebni primeri, ki jih je vredno poznati na pamet:

| Mase | Prva po trku | Druga po trku |
|---|---|---|
| $m_1 = m_2$ | obstane | $v_1$ |
| $m_1 \ll m_2$ | odbije se nazaj, skoraj $-v_1$ | skoraj miruje |
| $m_1 \gg m_2$ | skoraj $v_1$ | skoraj $2 v_1$ |

V simulaciji spodaj »Prožni in neprožni trki« izberi prožni trk ter nastavi $m_1 = 1\,\mathrm{kg}$, $v_1 = 4\,\mathrm{m/s}$, $m_2 = 3\,\mathrm{kg}$ in $v_2 = 0$. Opazuj stolpca gibalne količine po trku: $p_2$ je $6\,\mathrm{kg\,m/s}$, več kot začetni $4\,\mathrm{kg\,m/s}$, $p_1$ pa je negativen. Stolpec »skupaj« ostane enak.

**Za tekmovanje.** Vedno najprej določi pozitivno smer. Pri prožnem trku uporabi pravilo o relativni hitrosti. V ravnini velja ohranitev gibalne količine za vsako komponento posebej.

## Rešeni primeri

### Primer 1: pevka in zvočnik na ledu

Na koncertu na drsališču pevka z maso $55\,\mathrm{kg}$ miruje na drsalkah. Od sebe porine zvočnik na sankah s skupno maso $15\,\mathrm{kg}$, ki odpelje s hitrostjo $2{,}2\,\mathrm{m/s}$. S kolikšno hitrostjo se pevka odpelje nazaj? Trenje zanemarimo.

**Podatki:** $m_1 = 55\,\mathrm{kg}$, $m_2 = 15\,\mathrm{kg}$, $v_2' = 2{,}2\,\mathrm{m/s}$, pred odrivom oba mirujeta
**Iščemo:** hitrost pevke $v_1'$

:::formula
$0 = m_1 v_1' + m_2 v_2'$
:::

**Rešitev:**

1. Pred odrivom je skupna gibalna količina nič, ker vse miruje.
2. Po odrivu mora biti vsota spet nič: $v_1' = -\dfrac{m_2 v_2'}{m_1}$.
3. $v_1' = -\dfrac{15 \cdot 2{,}2}{55} = -0{,}6\,\mathrm{m/s}$. Minus pomeni nasprotno smer od zvočnika.
4. Odgovor: pevka se odpelje nazaj s hitrostjo $0{,}6\,\mathrm{m/s}$.

### Primer 2: čelni prožni trk dveh kroglic

V glasbenem stroju se po istem žlebu gibljeta kroglici druga proti drugi. Prva ima maso $0{,}30\,\mathrm{kg}$ in hitrost $2{,}0\,\mathrm{m/s}$ v desno, druga maso $0{,}10\,\mathrm{kg}$ in hitrost $4{,}0\,\mathrm{m/s}$ v levo. Trk je prožen. Kolikšni sta hitrosti po trku?

**Podatki:** $m_1 = 0{,}30\,\mathrm{kg}$, $v_1 = 2{,}0\,\mathrm{m/s}$, $m_2 = 0{,}10\,\mathrm{kg}$, $v_2 = -4{,}0\,\mathrm{m/s}$ (desno je pozitivno), trk je prožen
**Iščemo:** $v_1'$ in $v_2'$

:::formula
$m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2'$ in $v_1 - v_2 = v_2' - v_1'$
:::

**Rešitev:**

1. Gibalna količina pred trkom: $0{,}30 \cdot 2{,}0 + 0{,}10 \cdot (-4{,}0) = 0{,}20\,\mathrm{kg\,m/s}$.
2. Relativna hitrost pred trkom je $2{,}0 - (-4{,}0) = 6{,}0\,\mathrm{m/s}$, zato je $v_2' = v_1' + 6{,}0\,\mathrm{m/s}$.
3. Vstavimo v ohranitev: $0{,}30\,v_1' + 0{,}10\,(v_1' + 6{,}0) = 0{,}20$, torej $0{,}40\,v_1' = -0{,}40$ in $v_1' = -1{,}0\,\mathrm{m/s}$.
4. Nato $v_2' = -1{,}0 + 6{,}0 = 5{,}0\,\mathrm{m/s}$.
5. Kontrola z energijo: pred trkom $0{,}6 + 0{,}8 = 1{,}4\,\mathrm{J}$, po trku $0{,}15 + 1{,}25 = 1{,}4\,\mathrm{J}$.
6. Odgovor: težja kroglica se odbije v levo z $1{,}0\,\mathrm{m/s}$, lažja odleti v desno s $5{,}0\,\mathrm{m/s}$.

### Primer 3: kepa plastelina in gong

Za zvočni učinek pri predstavi vržejo kepo plastelina z maso $50\,\mathrm{g}$ vodoravno v gong z maso $1{,}95\,\mathrm{kg}$, ki visi na vrvicah. Kepa se prilepi, gong zazveni in zaniha tako, da se njegovo težišče dvigne za $2{,}0\,\mathrm{cm}$. S kolikšno hitrostjo je priletela kepa?

**Podatki:** $m = 0{,}050\,\mathrm{kg}$, $M = 1{,}95\,\mathrm{kg}$, $h = 0{,}020\,\mathrm{m}$, $g = 9{,}81\,\mathrm{m/s^2}$, gong pred trkom miruje
**Iščemo:** hitrost kepe $v$

:::formula
Po trku: $V = \sqrt{2 g h}$. Med trkom: $m v = (m + M)\,V$
:::

**Rešitev:**

1. Nalogo razdelimo na dva dela. Trk je kratek in popolnoma neprožen, zato se ohrani le gibalna količina. Pri nihanju po trku se ohrani mehanska energija.
2. Drugi del najprej, ker poznamo $h$: $V = \sqrt{2 \cdot 9{,}81 \cdot 0{,}020} \approx 0{,}626\,\mathrm{m/s}$.
3. Iz ohranitve gibalne količine izrazi $v$ in izračunaj.

:::premisli
Kolikšna je bila hitrost kepe?
---
$v = \dfrac{m + M}{m}\,V = 40 \cdot 0{,}626\,\mathrm{m/s} \approx 25\,\mathrm{m/s}$. Pri trku se izgubi $\frac{M}{m + M} = 97{,}5\,\%$ kinetične energije, zato energijskega zakona čez trk ne smeš uporabiti.
:::

## Pogoste napake

- **Seštevanje velikosti brez predznakov.** Telesi, ki se gibljeta drugo proti drugemu, imata gibalni količini nasprotnih predznakov. Najprej izberi pozitivno smer.
- **»Če se ohrani gibalna količina, se ohrani tudi kinetična energija.«** Gibalna količina se ohrani pri vsakem trku, kinetična energija le pri prožnem. Pri sprijemu se je vedno nekaj izgubi.
- **»Pri prožnem trku si kroglici hitrost razdelita.«** Če obe nadaljujeta z $v_1/2$, je gibalna količina sicer prava, kinetična energija pa le polovična. Pri enakih masah prva obstane, druga odnese vso hitrost.
- **»Zadeto telo ne more dobiti več gibalne količine, kot je je prineslo vpadno.«** Lahko, če se vpadno odbije nazaj in ima po trku negativno gibalno količino.
- **Energijski zakon čez neprožni trk.** Pri kepi in gongu je napačno pisati $\tfrac12 m v^2 = (m + M) g h$. Trk razdeli na dva dela z različnima zakonoma.

## Povzetek

- Gibalna količina $p = mv$ je vektor; na premici jo pišemo s predznakom.
- Sunek sile: $F\Delta t = \Delta p$. Odboj da večji sunek kot zaustavitev.
- V zaprtem sistemu se vsota gibalnih količin ohrani pri vsakem trku, odrivu in razletu.
- Prožni trk ohrani tudi kinetično energijo; relativna hitrost se le obrne: $v_1 - v_2 = v_2' - v_1'$.
- Popolnoma neprožni trk: $v' = \dfrac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$, izguba kinetične energije je največja.
- Pri $v_2 = 0$ in prožnem trku: $v_1' = \dfrac{m_1 - m_2}{m_1 + m_2}v_1$, $v_2' = \dfrac{2m_1}{m_1 + m_2}v_1$.
- Sestavljeno nalogo razdeli: trk (gibalna količina), gibanje pred njim in po njem (energija, sile).

## Drugače: Z analogijo

Gibalna količina je kot denar na skupnem računu dveh članov skupine. Pri vsakem trku si ga le prenakažeta: kolikor eden pridobi, drugi izgubi. Skupno stanje se ne spremeni.

Paradoks iz uvoda postane preprost, ko dovoliš dolg. Prva kroglica ima na začetku $20$ enot. Drugi nakaže $30$, sama pa zato pristane na $-10$. Vsota je še vedno $20$.

Kinetična energija v tej analogiji ni denar, ampak nekaj, česar ni mogoče imeti v minusu: kvadrat hitrosti je vedno pozitiven. Pri prožnem trku se tudi ta zaloga ohrani, pri neprožnem pa jo del »pojedo stroški«: zvok, toplota, deformacija.

## Drugače: Bolj natančno

Večina trkov ni ne povsem prožna ne povsem neprožna. Merilo je **koeficient restitucije**:

$$e = \frac{v_2' - v_1'}{v_1 - v_2}$$

Pri prožnem trku je $e = 1$, pri sprijemu $e = 0$. Žoga, spuščena z višine $H$, ki odskoči do $h$, ima $e = \sqrt{h/H}$.

Trk je najlažje opisati v **težiščnem sistemu**, ki se giblje s hitrostjo težišča

$$v_\mathrm{T} = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$$

V tem sistemu je skupna gibalna količina nič. Pri prožnem trku telesi le obrneta hitrosti, pri sprijemu obe obstaneta. Del kinetične energije, ki je vezan na gibanje težišča, se pri nobenem trku ne izgubi. Izguba je zato

$$\Delta W_\mathrm{k} = \tfrac12\, m_\mathrm{r}\,(v_1 - v_2)^2\,(1 - e^2)$$

kjer je $m_\mathrm{r} = \dfrac{m_1 m_2}{m_1 + m_2}$ reducirana masa. Preverimo s kovčkoma z odra: $m_\mathrm{r} = 24\,\mathrm{kg}$, $e = 0$, izguba $\tfrac12 \cdot 24 \cdot 1{,}5^2 = 27\,\mathrm{J}$, kot v tabeli.

Lepa posledica za ravnino: pri prožnem trku enakih mas, od katerih ena miruje, odletita kroglici pod pravim kotom, razen pri čelnem trku.

## Preveri se

? Jeklene kroglice v glasbenem stroju trkajo skoraj brez izgube kinetične energije. Kako imenujemo tak trk?
- Neprožni trk, ker se ob njem sliši klik.
~ Klik pomeni le majhno izgubo. Trk, pri katerem se kinetična energija skoraj ohrani, je skoraj prožen.
+ Prožni trk.
- Vsak trk je tak, ker se energija vedno ohranja.
~ Skupna energija se res ohrani, kinetična pa ne: pri neprožnem trku del preide v notranjo energijo in zvok.
> Prožni trk je trk, pri katerem se ohrani vsota kinetičnih energij. Gibalna količina se ohrani pri vsakem trku.

? Kaj se zgodi, če jeklena kroglica prožno in čelno zadene enako, mirujočo kroglico?
- Obe nadaljujeta s polovično hitrostjo.
~ Gibalna količina bi bila prava, kinetična energija pa bi padla na polovico. Tako se gibljeta le sprijeti kroglici.
- Prva se odbije nazaj z enako hitrostjo, druga miruje.
~ Potem bi se obrnila gibalna količina sistema. Odboj nazaj velja le za kroglico, ki zadene veliko težjo.
+ Prva obstane, druga odleti z vso hitrostjo prve.
> Iz $v_1' = \frac{m_1 - m_2}{m_1 + m_2} v_1$ pri $m_1 = m_2$ dobiš $v_1' = 0$ in $v_2' = v_1$. Tako deluje Newtonovo nihalo.

? Kroglica z maso $0{,}20\,\mathrm{kg}$ s hitrostjo $3{,}0\,\mathrm{m/s}$ prožno čelno zadene mirujočo kroglico z maso $0{,}40\,\mathrm{kg}$. S kolikšno hitrostjo v $\mathrm{m/s}$ odleti zadeta kroglica?
= 2,0 m/s | 0,05
~ 1,5 | Predpostavil si, da prva obstane in odda vso gibalno količino. Pri $m_1 < m_2$ se prva odbije nazaj.
~ 1,0 | To je skupna hitrost pri sprijemu ali velikost hitrosti odbite prve kroglice, ne hitrost zadete.
> $v_2' = \dfrac{2 m_1}{m_1 + m_2}\,v_1 = \dfrac{0{,}40}{0{,}60} \cdot 3{,}0 = 2{,}0\,\mathrm{m/s}$. Prva se odbije z $-1{,}0\,\mathrm{m/s}$.

? Na risbi sta vozička pred trkom. Po trku se sprimeta. Kolikšna je njuna skupna hitrost?
:::risba skica
opis: Levo voziček z maso 2 kg, ki se giblje v desno s hitrostjo 3 m/s. Desno voziček z maso 1 kg, ki se giblje v levo s hitrostjo 4 m/s.
območje: 0; 0 .. 8; 3
enota: 36
črta: 0; 0,5 -> 8; 0,5 | siva
pravokotnik: 1; 0,6 .. 3; 1,6 | modra
pravokotnik: 5,5; 0,6 .. 7; 1,4 | oranžna
napis: 2; 1,1 | 2 kg | sredina
napis: 6,25; 1 | 1 kg | sredina
puščica: 1,4; 2,2 -> 2,6; 2,2 | 3 m/s | nad | puščica
puščica: 7,1; 2,2 -> 5,5; 2,2 | 4 m/s | nad | puščica
:::
- $3{,}3\,\mathrm{m/s}$ v desno
~ Seštel si velikosti gibalnih količin, $6 + 4$. Voziček, ki gre v levo, ima negativno gibalno količino.
+ $0{,}67\,\mathrm{m/s}$ v desno
- $0{,}5\,\mathrm{m/s}$ v levo
~ Povprečil si hitrosti, $\frac{3 - 4}{2}$. Upoštevati moraš mase: težji voziček prispeva več.
- Vozička obstaneta.
~ Gibalni količini nista nasprotno enaki: $2 \cdot 3 = 6$, $1 \cdot 4 = 4\,\mathrm{kg\,m/s}$.
> Desno je pozitivno: $p = 2 \cdot 3 + 1 \cdot (-4) = 2\,\mathrm{kg\,m/s}$, $v' = \frac{2}{3}\,\mathrm{m/s} \approx 0{,}67\,\mathrm{m/s}$ v desno.

? Kroglica zadene mirujočo kroglico. Razvrsti trke od najmanjšega do največjega deleža izgubljene kinetične energije.
1. prožni trk, $m_2 = 3m_1$
2. sprijem, $m_2 = m_1/4$
3. sprijem, $m_2 = m_1$
4. sprijem, $m_2 = 3m_1$
> Prožni trk ne izgubi nič. Pri sprijemu z mirujočim telesom je izgubljeni delež $\frac{m_2}{m_1 + m_2}$: $0{,}2$; $0{,}5$ in $0{,}75$.

<<RACUN
vrednost: 40*1.5 | 60
vrednost: 40*1.5/100 | 0.6
vrednost: 0.5*40*1.5^2 | 45
vrednost: 0.5*100*0.6^2 | 18
vrednost: 2*40/100*1.5 | 1.2
vrednost: 0.05*(5+3)/0.002 | 200
vrednost: (0.1-0.3)/0.4*2 | -1
vrednost: 2*0.1/0.4*2 | 1
vrednost: -15*2.2/55 | -0.6
vrednost: 0.3*2+0.1*(-4) | 0.2
resi: 0.3*x+0.1*(x+6)=0.2 | x | -1
vrednost: 0.5*0.3*1^2+0.5*0.1*5^2 | 1.4
vrednost: sqrt(2*9.81*0.02) | 0.626
vrednost: (0.05+1.95)/0.05*sqrt(2*9.81*0.02) | 25.06
vrednost: 2*0.2/0.6*3 | 2
vrednost: (2*3-1*4)/3 | 0.667
vrednost: 0.5*40*60/100*1.5^2 | 27
>>

:::simboli
p | gibalna količina | p = m v | kg\,m/s | vektor; na premici s predznakom
m | masa | | kg | v Primeru 3 masa kepe
v | hitrost | | m/s | v Primeru 3 hitrost kepe
m_1, m_2 | masi teles | | kg
v_1, v_2 | hitrosti pred trkom | | m/s
v_1', v_2' | hitrosti po trku | | m/s
v' | skupna hitrost po sprijemu | v' = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2} | m/s
F | povprečna sila med trkom | | N
\Delta t | čas trajanja trka | | s
\Delta p | sprememba gibalne količine | \Delta p = F \Delta t | kg\,m/s
W_\mathrm{k} | kinetična energija | W_\mathrm{k} = \tfrac12 m v^2 | J
\Delta W_\mathrm{k} | izguba kinetične energije pri trku | | J
M | masa gonga | | kg
V | hitrost gonga s kepo po trku | V = \sqrt{2 g h} | m/s
h | višina | | m | v Primeru 3 dvig težišča gonga
g | težni pospešek | | m/s^2
e | koeficient restitucije | e = \frac{v_2' - v_1'}{v_1 - v_2} | – | $1$ prožni, $0$ sprijem
v_\mathrm{T} | hitrost težišča | v_\mathrm{T} = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2} | m/s
m_\mathrm{r} | reducirana masa | m_\mathrm{r} = \frac{m_1 m_2}{m_1 + m_2} | kg
:::
