---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi dva enaka kozarca in kuhinjsko tehtnico. V prvega stresi $5\,\mathrm{g}$ sladkorja in dolij vodo, da je skupaj $100\,\mathrm{g}$. V drugega daj $10\,\mathrm{g}$ sladkorja in dolij do $200\,\mathrm{g}$. Premešaj in poskusi. Oba sta enako sladka, čeprav je v drugem dvakrat več sladkorja.

Z isto skrbjo se ukvarjajo na Mednarodni vesoljski postaji. Astronavti pijejo napitke iz prahu, ki ga zmešajo z vodo. V zdravniški torbici imajo fiziološko raztopino, ki mora imeti natanko pravo količino soli. Vode je na postaji malo, zato mora biti vsak gram premišljen. Kako zapisati, »kako slana« ali »kako sladka« je raztopina, da bo število enako v kozarčku in v rezervoarju? In koliko vode doliti, da bo napitek redkejši? Na tekmovanju so to ene najpogostejših računskih nalog.

## Razlaga

**Raztopina** je zmes, v kateri je ena snov enakomerno porazdeljena v drugi. Snov, ki jo raztapljamo (sladkor, sol), je **topljenec**. Snov, v kateri raztapljamo (navadno voda), je **topilo**. Masa raztopine je vsota obeh mas:

$$m_{\mathrm{r}} = m_{\mathrm{t}} + m_{\mathrm{v}}$$

Pri tem je $m_{\mathrm{t}}$ masa topljenca, $m_{\mathrm{v}}$ masa vode in $m_{\mathrm{r}}$ masa raztopine.

**Trije kozarci.** Pripravimo tri sladke raztopine:

| Kozarec | sladkor | voda | raztopina |
|---|---|---|---|
| A | $5\,\mathrm{g}$ | $95\,\mathrm{g}$ | $100\,\mathrm{g}$ |
| B | $10\,\mathrm{g}$ | $190\,\mathrm{g}$ | $200\,\mathrm{g}$ |
| C | $10\,\mathrm{g}$ | $90\,\mathrm{g}$ | $100\,\mathrm{g}$ |

:::premisli
Katera dva kozarca sta enako sladka? Kateri je najslajši? Odgovori, preden bereš naprej.
---
Enako sladka sta A in B: v B je dvakrat več sladkorja, a tudi dvakrat več raztopine. Najslajši je C, ker ima isto maso sladkorja kot B v polovico manjši raztopini.
:::

Sladkost torej ni odvisna od same mase sladkorja, ampak od tega, kolikšen del raztopine je sladkor. Pri A je to $\dfrac{5}{100}$, pri B $\dfrac{10}{200}$, oboje $0{,}05$. Pri C je $\dfrac{10}{100} = 0{,}1$.

**Masni delež.** To razmerje imenujemo **masni delež** topljenca $w$:

$$w = \frac{m_{\mathrm{t}}}{m_{\mathrm{r}}}$$

Masni delež nima enote. Pogosto ga zapišemo v odstotkih: $0{,}05 = 5\,\%$. Raztopina A je torej $5$-odstotna. V imenovalcu je vedno masa **raztopine**, ne masa vode.

**Redčenje.** Kozarcu A dolijemo $100\,\mathrm{g}$ vode. Sladkorja ostane $5\,\mathrm{g}$, raztopine je zdaj $200\,\mathrm{g}$, zato je $w = \dfrac{5}{200} = 0{,}025$. Voda je spremenila le imenovalec. Pri redčenju z vodo ali pri izparevanju vode se **masa topljenca ne spremeni**:

$$w_1 \cdot m_1 = w_2 \cdot m_2$$

Indeks $1$ pomeni raztopino pred redčenjem, indeks $2$ po njem. Obe strani sta masa topljenca. Iz te enačbe izraziš tisto, kar naloga sprašuje, na primer $m_2$.

**Mešanje.** Kaj pa, če zmešamo dve raztopini istega topljenca? Mase topljenca se seštejejo in mase raztopin tudi:

$$w_1 m_1 + w_2 m_2 = w\,(m_1 + m_2)$$

Primer: $100\,\mathrm{g}$ raztopine z $10\,\%$ in $100\,\mathrm{g}$ raztopine s $30\,\%$ imata skupaj $10\,\mathrm{g} + 30\,\mathrm{g} = 40\,\mathrm{g}$ topljenca v $200\,\mathrm{g}$, torej $20\,\%$. Pri enakih masah dobimo povprečje. Pri različnih masah ne.

:::premisli
Zmešaš $10$-odstotno in $30$-odstotno raztopino v poljubnem razmerju. Ali lahko dobiš $35\,\%$? Zakaj? In kam se pomakne delež zmesi, če vzameš več $30$-odstotne?
---
Ne. Zmes ima vedno masni delež med obema začetnima, torej med $10\,\%$ in $30\,\%$. Bližje je tisti raztopini, ki je je več: z več $30$-odstotne se pomakne proti $30\,\%$.
:::

**Mešalni križ.** Na tekmovanju pogosto sprašujejo obratno: koliko katere raztopine vzeti za želeni $w$. Hitra pot je mešalni križ. Levo napišeš začetna deleža, v sredino želenega. Desno zapišeš razliki, ki ju dobiš vzdolž obeh diagonal:

:::risba skica
opis: Mešalni križ. Levo zgoraj 25 odstotkov, levo spodaj 5 odstotkov, v sredini 10 odstotkov. Desno zgoraj 5 delov (10 minus 5) za 25-odstotno raztopino, desno spodaj 15 delov (25 minus 10) za 5-odstotno.
območje: 0; 0 .. 8; 5
enota: 36
napis: 1; 4,2 | 25 % | sredina | debelo
napis: 1; 0,8 | 5 % | sredina | debelo
napis: 4; 2,5 | 10 % | sredina | debelo
napis: 7; 4,2 | 5 delov | sredina | modra
napis: 7; 0,8 | 15 delov | sredina | oranžna
črta: 1,8; 4 -> 6,2; 1 | siva
črta: 1,8; 1 -> 6,2; 4 | siva
:::

Desno zgoraj je število delov zgornje raztopine ($10 - 5 = 5$), desno spodaj spodnje ($25 - 10 = 15$). Razmerje mas je $5 : 15 = 1 : 3$. Vedno odštevaš manjše število od večjega. Več vzameš tiste raztopine, katere delež je bližje želenemu: $5\,\%$ je od $10\,\%$ oddaljen za $5$, $25\,\%$ pa za $15$, zato vzameš $5$-odstotne trikrat več.

Simulacija spodaj (»Masni delež in redčenje«) kaže čašo z raztopino. Dodajaj vodo in opazuj, da število zrnc topljenca ostane enako, masni delež pa pada.

## Rešeni primeri

### Primer 1 (lažji): fiziološka raztopina na postaji

Zdravnik na vesoljski postaji raztopi $4{,}5\,\mathrm{g}$ natrijevega klorida v $495{,}5\,\mathrm{g}$ vode. Kolikšen je masni delež soli?

**Podatki:** $m_{\mathrm{t}} = 4{,}5\,\mathrm{g}$, $m_{\mathrm{v}} = 495{,}5\,\mathrm{g}$
**Iščemo:** masni delež $w$

:::formula
$m_{\mathrm{r}} = m_{\mathrm{t}} + m_{\mathrm{v}}$, nato $w = \dfrac{m_{\mathrm{t}}}{m_{\mathrm{r}}}$
:::

**Rešitev:**

1. Masa raztopine, ker v imenovalec sodi vsa raztopina: $m_{\mathrm{r}} = 4{,}5\,\mathrm{g} + 495{,}5\,\mathrm{g} = 500\,\mathrm{g}$.
2. $w = \dfrac{4{,}5\,\mathrm{g}}{500\,\mathrm{g}} = 0{,}009$.
3. V odstotkih: $0{,}009 = 0{,}9\,\%$.
4. Odgovor: raztopina ima $0{,}9\,\%$ soli, kar je ravno fiziološka raztopina.

### Primer 2: redčenje napitka

Astronavtka ima $200\,\mathrm{g}$ gostega elektrolitskega napitka s $6\,\%$ soli. Za pitje mora imeti napitek $1{,}5\,\%$ soli. Koliko vode mora doliti?

**Podatki:** $m_1 = 200\,\mathrm{g}$, $w_1 = 6\,\% = 0{,}06$, $w_2 = 1{,}5\,\% = 0{,}015$
**Iščemo:** maso dolite vode

:::formula
$w_1 \cdot m_1 = w_2 \cdot m_2$; dolita voda je $m_2 - m_1$
:::

**Rešitev:**

1. Masa soli, ki se pri redčenju ne spremeni: $0{,}06 \cdot 200\,\mathrm{g} = 12\,\mathrm{g}$.
2. Ta sol mora biti $1{,}5\,\%$ nove raztopine: $m_2 = \dfrac{12\,\mathrm{g}}{0{,}015} = 800\,\mathrm{g}$.
3. Doliti mora razliko: $800\,\mathrm{g} - 200\,\mathrm{g} = 600\,\mathrm{g}$.
4. Odgovor: doliti mora $600\,\mathrm{g}$ vode. Delež se je zmanjšal štirikrat, zato je raztopine štirikrat več.

### Primer 3 (težji): slanica za laboratorij

Raziskovalci v laboratoriju posnemajo slano vodo, ki bi lahko tekla pod ledom ledene lune. Potrebujejo $300\,\mathrm{g}$ raztopine z $10\,\%$ soli. Na polici imajo samo $25$-odstotno in $5$-odstotno raztopino. Koliko gramov vsake morajo zmešati?

**Podatki:** $w_1 = 25\,\%$, $w_2 = 5\,\%$, $w = 10\,\%$, $m_1 + m_2 = 300\,\mathrm{g}$
**Iščemo:** mase $m_1$ in $m_2$

:::formula
Mešalni križ: $m_1 : m_2 = (w - w_2) : (w_1 - w)$
:::

**Rešitev:**

1. Deli $25$-odstotne raztopine: $10 - 5 = 5$. Deli $5$-odstotne: $25 - 10 = 15$.
2. Razmerje $5 : 15 = 1 : 3$, skupaj $4$ deli.
3. En del je $\dfrac{300\,\mathrm{g}}{4} = 75\,\mathrm{g}$, zato $m_1 = 75\,\mathrm{g}$ in $m_2 = 3 \cdot 75\,\mathrm{g} = 225\,\mathrm{g}$.
4. Preizkus s soljo: $0{,}25 \cdot 75\,\mathrm{g} + 0{,}05 \cdot 225\,\mathrm{g} = 30\,\mathrm{g}$, in $0{,}1 \cdot 300\,\mathrm{g} = 30\,\mathrm{g}$. Ujema se.
5. Odgovor: zmešati morajo $75\,\mathrm{g}$ $25$-odstotne in $225\,\mathrm{g}$ $5$-odstotne raztopine.

Brez križa: če je $x$ masa $25$-odstotne raztopine, velja enačba $0{,}25x + 0{,}05\,(300 - x) = 30$, od tod $x = 75$.

### Primer 4 – zdaj ti: modra galica

Na postaji so preizkušali rast kristalov v breztežnosti. Za tak poskus raztopiš $25\,\mathrm{g}$ modre galice $\mathrm{CuSO_4 \cdot 5H_2O}$ v $75\,\mathrm{g}$ vode. Kolikšen je masni delež bakrovega(II) sulfata $\mathrm{CuSO_4}$? Uporabi $A_r$: Cu $64$, S $32$, O $16$, H $1$.

**Podatki:** $m(\mathrm{CuSO_4 \cdot 5H_2O}) = 25\,\mathrm{g}$, $m_{\mathrm{v}} = 75\,\mathrm{g}$, $A_r$ kot zgoraj
**Iščemo:** $w(\mathrm{CuSO_4})$

:::formula
$m(\mathrm{CuSO_4}) = m(\text{galice}) \cdot \dfrac{M(\mathrm{CuSO_4})}{M(\mathrm{CuSO_4 \cdot 5H_2O})}$, nato $w = \dfrac{m_{\mathrm{t}}}{m_{\mathrm{r}}}$
:::

**Rešitev:**

1. $M(\mathrm{CuSO_4}) = 64 + 32 + 4 \cdot 16 = 160\,\mathrm{g/mol}$, $M(\mathrm{CuSO_4 \cdot 5H_2O}) = 160 + 5 \cdot 18 = 250\,\mathrm{g/mol}$.
2. Modra galica je **hidrat**: v njenem kristalu je na vsako enoto $\mathrm{CuSO_4}$ vezanih pet molekul vode (kristalna voda). Ta voda se v raztopini pridruži topilu. Topljenec je samo $\mathrm{CuSO_4}$: $m_{\mathrm{t}} = 25\,\mathrm{g} \cdot \dfrac{160}{250} = 16\,\mathrm{g}$.
3. Masa raztopine je vsota vsega, kar je v čaši: $25\,\mathrm{g} + 75\,\mathrm{g} = 100\,\mathrm{g}$.
4. Izračunaj $w$ sam, nato preveri:

:::premisli
Koliko je $w(\mathrm{CuSO_4})$?
---
$w = \dfrac{16\,\mathrm{g}}{100\,\mathrm{g}} = 0{,}16 = 16\,\%$. Kdor vzame za topljenec vseh $25\,\mathrm{g}$ galice, dobi napačnih $25\,\%$.
:::

## Pogoste napake

- **Delitev z maso vode.** $12\,\mathrm{g}$ soli v $228\,\mathrm{g}$ vode ni $\dfrac{12}{228}$. V imenovalec sodi raztopina: $\dfrac{12}{240} = 5\,\%$. Najprej seštej topljenec in topilo.
- **Povprečje odstotkov pri mešanju.** $100\,\mathrm{g}$ raztopine z $20\,\%$ in $300\,\mathrm{g}$ s $4\,\%$ ne dasta $12\,\%$. Povprečje velja le pri enakih masah. Seštej mase topljenca ($20\,\mathrm{g} + 12\,\mathrm{g}$) in deli s skupno maso ($400\,\mathrm{g}$): $8\,\%$.
- **Končna masa namesto dolite vode.** Pri redčenju iz $6\,\%$ na $1{,}5\,\%$ je $800\,\mathrm{g}$ masa *končne* raztopine. Doliti je treba le $600\,\mathrm{g}$. Vedno preberi, kaj naloga sprašuje.
- **Napačno pretvorjen odstotek.** $3{,}5\,\%$ je $0{,}035$, ne $0{,}35$. Pred množenjem deli s $100$.
- **Hidrat kot topljenec.** Pri modri galici topljenec ni cel kristal. Kristalna voda postane del topila, zato je $w(\mathrm{CuSO_4})$ manjši, kot bi bil iz mase galice.

## Povzetek

- Masni delež: $w = \dfrac{m_{\mathrm{t}}}{m_{\mathrm{r}}}$, kjer je $m_{\mathrm{r}} = m_{\mathrm{t}} + m_{\mathrm{v}}$. Brez enote, pogosto v odstotkih.
- Redčenje in izparevanje: masa topljenca ostane enaka, $w_1 m_1 = w_2 m_2$. Dolita voda je $m_2 - m_1$.
- Mešanje: mase topljenca in mase raztopin se seštejejo. Zmes ima $w$ med začetnima; povprečje le pri enakih masah.
- Mešalni križ: razmerje mas $m_1 : m_2 = (w - w_2) : (w_1 - w)$.
- Hidrat: topljenec je le brezvodna sol, kristalna voda gre k topilu.

## Drugače: Korak za korakom s številkami

Večino nalog rešiš s tabelo s tremi vrsticami: topljenec, voda, raztopina. Vzemimo $200\,\mathrm{g}$ raztopine s $6\,\%$, ki ji dolijemo $600\,\mathrm{g}$ vode.

| | pred | dodano | po |
|---|---|---|---|
| topljenec | $12\,\mathrm{g}$ | $0\,\mathrm{g}$ | $12\,\mathrm{g}$ |
| voda | $188\,\mathrm{g}$ | $600\,\mathrm{g}$ | $788\,\mathrm{g}$ |
| raztopina | $200\,\mathrm{g}$ | $600\,\mathrm{g}$ | $800\,\mathrm{g}$ |

1. Izpolni, kar poznaš. Topljenec pred: $0{,}06 \cdot 200\,\mathrm{g} = 12\,\mathrm{g}$.
2. Stolpec »po« je vsota prvih dveh.
3. Na koncu deli v stolpcu »po«: $\dfrac{12}{800} = 0{,}015 = 1{,}5\,\%$.

Pri mešanju dveh raztopin je v stolpcu »dodano« druga raztopina, ki prinese tudi svoj topljenec. Pri izparevanju je dodana voda negativna.

## Drugače: Kot zgodba

Lunarna baza nekoč v prihodnosti. Kuharica Maja ima v rezervoarju $1000\,\mathrm{g}$ juhe z $2\,\%$ soli, torej $20\,\mathrm{g}$ soli. Posadka se pritoži, da je juha preslana.

Maja razmišlja: soli ne more vzeti ven, lahko pa doda vodo. Teh $20\,\mathrm{g}$ soli ostane v juhi, kar koli naredi. Če hoče $1\,\%$, mora biti $20\,\mathrm{g}$ ena stotina juhe, torej $2000\,\mathrm{g}$ juhe. Doda $1000\,\mathrm{g}$ vode.

Naslednji dan je juha preredka. Maja ima še $500\,\mathrm{g}$ goste juhe s $4\,\%$ soli. Zmeša ju: soli je $20\,\mathrm{g} + 20\,\mathrm{g} = 40\,\mathrm{g}$ v $2500\,\mathrm{g}$, to je $1{,}6\,\%$. Ne $2{,}5\,\%$, kot bi dalo povprečje, ker je redke juhe veliko več. Majino pravilo: »Štej gram soli, ne odstotke.«

## Preveri se

? Stolpca kažeta, koliko soli in vode je v čaši. Kolikšen je masni delež soli?
:::risba stolpci
opis: Dva stolpca. Sol ima 12 gramov, voda ima 228 gramov.
stolpec: sol | 12
stolpec: voda | 228
os: masa v g
korak: 40
:::
- $5{,}3\,\%$
~ Delil si z maso vode ($\frac{12}{228}$). V imenovalec sodi vsa raztopina, $12 + 228 = 240\,\mathrm{g}$.
+ $5\,\%$
- $12\,\%$
~ $12$ je masa soli v gramih, ne delež. Deliti jo moraš z maso raztopine.
> $m_{\mathrm{r}} = 12\,\mathrm{g} + 228\,\mathrm{g} = 240\,\mathrm{g}$, $w = \dfrac{12}{240} = 0{,}05 = 5\,\%$.

? Morska voda ima približno $3{,}5\,\%$ soli. Iz $2\,\mathrm{kg}$ morske vode izhlapi vsa voda. Oceni, koliko gramov soli ostane.
= 70 g | 5
~ 700 | Odstotek si vzel kot $0{,}35$. $3{,}5\,\%$ je $0{,}035$.
~ 35 | Računal si z $1\,\mathrm{kg}$. Vode je $2\,\mathrm{kg} = 2000\,\mathrm{g}$.
> $2000\,\mathrm{g} \cdot 0{,}035 = 70\,\mathrm{g}$ soli.

? Zakaj z mešanjem $10$-odstotne in $30$-odstotne raztopine ne moreš dobiti $40$-odstotne?
- Ker se masni deleži pri mešanju seštejejo, $10\,\% + 30\,\% = 40\,\%$ pa bi dobil le pri enakih masah.
~ Deleži se ne seštevajo. Seštevajo se mase topljenca in mase raztopin.
+ Ker redkejša raztopina gostejšo vedno nekoliko razredči, je delež zmesi med $10\,\%$ in $30\,\%$.
- Ker se pri mešanju del topljenca izloči.
~ Topljenec se pri mešanju ne izgublja. Njegova masa je vsota obeh.
> $w = \dfrac{w_1 m_1 + w_2 m_2}{m_1 + m_2}$ je vedno med $w_1$ in $w_2$, bližje tistemu z večjo maso.

? Koliko gramov vode moraš izpariti iz $300\,\mathrm{g}$ raztopine s $4\,\%$, da dobiš raztopino z $10\,\%$?
= 180 g | 1
~ 120 | To je masa končne raztopine. Izpariti moraš razliko $300 - 120$.
~ 750 | Deleža si zamenjal. Pri izparevanju se masa raztopine zmanjša, ne poveča.
~ 450 | Deleža si zamenjal ($300 \cdot \frac{10}{4} = 750$) in odštel $300$. Pri izparevanju raztopine ne more biti več kot prej.
> Topljenca je $0{,}04 \cdot 300\,\mathrm{g} = 12\,\mathrm{g}$. To naj bo $10\,\%$: $m_2 = 120\,\mathrm{g}$. Izpari $300\,\mathrm{g} - 120\,\mathrm{g} = 180\,\mathrm{g}$.

? V rastlinjaku na Marsovi bazi zmešajo $100\,\mathrm{g}$ hranilne raztopine z $20\,\%$ gnojila in $300\,\mathrm{g}$ raztopine s $4\,\%$ gnojila. Kolikšen je masni delež gnojila v zmesi?
- $12\,\%$
~ To je povprečje $\frac{20 + 4}{2}$. Velja le pri enakih masah, tu je druge raztopine trikrat več.
+ $8\,\%$
- $24\,\%$
~ Deležev ne seštevaš. Seštej mase gnojila in jih deli s skupno maso.
- $6\,\%$
~ Iz druge raztopine si vzel le $4\,\mathrm{g}$ gnojila, kot da bi je bilo $100\,\mathrm{g}$. V $300\,\mathrm{g}$ ga je $12\,\mathrm{g}$, skupaj torej $32\,\mathrm{g}$.
> Gnojila je $20\,\mathrm{g} + 12\,\mathrm{g} = 32\,\mathrm{g}$ v $400\,\mathrm{g}$, $w = \dfrac{32}{400} = 8\,\%$.

<<RACUN
vrednost: 5/100 | 0.05
vrednost: 10/200 | 0.05
vrednost: 10/100 | 0.1
vrednost: 5/200 | 0.025
vrednost: (10+30)/200 | 0.2
vrednost: 4.5/(4.5+495.5) | 0.009
vrednost: 0.06*200 | 12
vrednost: 12/0.015 | 800
vrednost: 800-200 | 600
resi: 0.25*x+0.05*(300-x)=30 | x | 75
vrednost: 0.25*75+0.05*225 | 0.1*300
molska: CuSO4 | 160
vrednost: 160+5*18 | 250
vrednost: 25*160/250 | 16
vrednost: 16/(25+75) | 0.16
vrednost: 12/(12+228) | 0.05
vrednost: 2000*0.035 | 70
vrednost: 300-0.04*300/0.1 | 180
vrednost: (0.2*100+0.04*300)/400 | 0.08
vrednost: (20+20)/2500 | 0.016
>>

:::simboli
m_{\mathrm{r}} | masa raztopine | m_{\mathrm{r}} = m_{\mathrm{t}} + m_{\mathrm{v}} | g
m_{\mathrm{t}} | masa topljenca | m_{\mathrm{t}} = w \cdot m_{\mathrm{r}} | g
m_{\mathrm{v}} | masa vode (topila) | | g
w | masni delež topljenca | w = \frac{m_{\mathrm{t}}}{m_{\mathrm{r}}} | – | pogosto v odstotkih
w_1, w_2 | masni delež prve in druge raztopine (pred in po redčenju) | | – |
m_1, m_2 | masa prve in druge raztopine (pred in po redčenju) | | g |
m | masa snovi (pri hidratu) | | g |
M | molska masa | | g/mol |
:::
