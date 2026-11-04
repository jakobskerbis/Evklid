---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vsako jutro kolesariš v šolo. Kolo poganja naprej sila $80\,\mathrm{N}$. Danes piha močan veter in nate deluje s silo $30\,\mathrm{N}$.

Kolikšna sila te zares nese naprej, če piha veter v obraz? In kolikšna, če piha v hrbet? Na telo skoraj nikoli ne deluje samo ena sila. Na kolesarja delujeta pedala in veter, na drevo veter in korenine, na jabolko teža in pecelj. Da bi vedel, kaj se bo s telesom zgodilo, moraš sile znati **sestaviti** v eno samo.

## Razlaga

**1. Štirje poskusi.** Na majhen voziček na mizi pritrdimo dva silomera in z njima vlečemo. Nato oba odstranimo in s tretjim silomerom poiščemo eno samo silo, ki ima na voziček enak učinek kot prvi dve skupaj. Rezultati:

| Sili | Smeri | Ena sila z enakim učinkom |
|---|---|---|
| $30\,\mathrm{N}$ in $20\,\mathrm{N}$ | obe v desno | $50\,\mathrm{N}$ v desno |
| $30\,\mathrm{N}$ in $20\,\mathrm{N}$ | desno in levo | $10\,\mathrm{N}$ v desno |
| $25\,\mathrm{N}$ in $25\,\mathrm{N}$ | desno in levo | $0\,\mathrm{N}$, voziček miruje |
| $3\,\mathrm{N}$ in $4\,\mathrm{N}$ | desno in naprej, pod pravim kotom | $5\,\mathrm{N}$, poševno vmes |

Poišči vzorec v prvih treh vrsticah: kdaj sili seštejemo in kdaj odštejemo?

**2. Rezultanta.** Silo, ki ima sama enak učinek kot več sil skupaj, imenujemo **rezultanta** in jo označimo z $R$. Iskanju rezultante rečemo **sestavljanje sil**.

Iz prvih treh vrstic sledi pravilo za sili na isti premici:

- kažeta v **isto smer**: velikosti seštejemo, $R = F_1 + F_2$; rezultanta kaže v isto smer;
- kažeta v **nasprotni smeri**: od večje odštejemo manjšo, $R = F_1 - F_2$ (za $F_1 > F_2$); rezultanta kaže v smer večje sile.

**3. Sili pod kotom.** Četrta vrstica ne ustreza ne seštevanju ($7\,\mathrm{N}$) ne odštevanju ($1\,\mathrm{N}$). Takrat sili sestavimo z risbo:

1. Izberemo **merilo**, na primer $1\,\mathrm{cm}$ za $1\,\mathrm{N}$.
2. Iz iste točke narišemo puščici: $3\,\mathrm{cm}$ v desno in $4\,\mathrm{cm}$ naprej.
3. Skozi konec vsake puščice narišemo črto, vzporedno z drugo puščico. Dobimo **paralelogram sil** (pri pravem kotu je to pravokotnik).
4. Diagonala iz začetne točke je rezultanta. Izmerimo jo: $5\,\mathrm{cm}$, torej $R = 5\,\mathrm{N}$.

:::premisli
Kot med silama $3\,\mathrm{N}$ in $4\,\mathrm{N}$ počasi večaš od $0^\circ$ (isti smeri) do $180^\circ$ (nasprotni smeri). Napovej, kako se spreminja rezultanta.
---
Ves čas se manjša: od $7\,\mathrm{N}$ pri isti smeri, prek $5\,\mathrm{N}$ pri pravem kotu, do $1\,\mathrm{N}$ pri nasprotnih smereh. Bolj kot sili »vlečeta narazen«, manj si pomagata.
:::

Rezultanta dveh sil je zato vedno nekje med razliko in vsoto njunih velikosti. Pri silah $3\,\mathrm{N}$ in $4\,\mathrm{N}$ je to med $1\,\mathrm{N}$ in $7\,\mathrm{N}$.

V simulaciji spodaj »Sestavljanje sil in ravnovesje« vleci konici puščic $F_1$ in $F_2$. Poskusi najti dve sili po $5\,\mathrm{N}$, ki dasta rezultanto prav tako $5\,\mathrm{N}$. Opazuj, kako se diagonala paralelograma krajša, ko se kot med silama veča.

**4. Ravnovesje dveh sil.** V tretji vrstici je rezultanta nič. Sile na voziček delujejo, a se njihovi učinki izničijo. Takrat rečemo, da sta sili v **ravnovesju**. Telo, ki je mirovalo, miruje še naprej.

Ali je dovolj, da sta sili enako veliki in nasprotno usmerjeni?

:::premisli
Ravnilo leži na mizi. Z enim prstom ga potisneš na levem koncu naprej, z drugim enako močno na desnem koncu nazaj. Bo ravnilo mirovalo? Zakaj?
---
Ne, zavrtelo se bo. Sili sta enako veliki in nasprotni, a ne ležita na isti premici, zato se njuna učinka ne izničita v celoti: skupaj ravnilo zasukata.
:::

Pravilo za **ravnovesje dveh sil**: sili sta

- enako veliki,
- nasprotno usmerjeni,
- na isti premici.

V naravi ga srečaš povsod. Jabolko na veji miruje, ker ga pecelj vleče navzgor z enako veliko silo, kot ga teža vleče navzdol. Enako miruje svetilka na stropu: njeno težo uravnovesi vrvica. Ravnovesje ni le mirovanje: kaplja dežja proti tlom pada s stalno hitrostjo, ker sta njena teža in upor zraka v ravnovesju. Več o uporu zraka izveš v lekciji o trenju in uporu.

**Nazaj h kolesu.** Veter v obraz kaže nasprotno kot sila pedal, zato $R = 80\,\mathrm{N} - 30\,\mathrm{N} = 50\,\mathrm{N}$ naprej. Veter v hrbet kaže v isto smer, zato $R = 80\,\mathrm{N} + 30\,\mathrm{N} = 110\,\mathrm{N}$ naprej, več kot dvakrat toliko.

## Rešeni primeri

### Primer 1 (lažji): jadrnica na jezeru

Veter potiska jadro jadrnice naprej s silo $600\,\mathrm{N}$. Voda zavira jadrnico s silo $450\,\mathrm{N}$ v nasprotni smeri. Kolikšna je rezultanta in kam kaže?

**Podatki:** $F_1 = 600\,\mathrm{N}$ naprej (veter), $F_2 = 450\,\mathrm{N}$ nazaj (voda), sili na isti premici
**Iščemo:** rezultanto $R$ in njeno smer

:::formula
Sili v nasprotnih smereh: $R = F_1 - F_2$ (za $F_1 > F_2$)
:::

**Rešitev:**

1. Sili kažeta v nasprotni smeri, zato od večje odštejemo manjšo.
2. $R = 600\,\mathrm{N} - 450\,\mathrm{N} = 150\,\mathrm{N}$.
3. Rezultanta kaže v smer večje sile, torej naprej.
4. Odgovor: rezultanta je $150\,\mathrm{N}$ in kaže naprej, zato jadrnici hitrost narašča.

### Primer 2: jabolko na veji

Na veji visi jabolko z maso $0{,}2\,\mathrm{kg}$ in miruje. S kolikšno silo in v katero smer ga drži pecelj?

**Podatki:** $m = 0{,}2\,\mathrm{kg}$, $g = 9{,}81\,\dfrac{\mathrm{N}}{\mathrm{kg}}$, jabolko miruje
**Iščemo:** silo peclja $F_\mathrm{p}$

:::formula
Pogoj ravnovesja: $F_\mathrm{p}$ je enako velika kot teža, $F_g = m \cdot g$, in kaže nasprotno.
:::

**Rešitev:**

1. Jabolko miruje, zato sta teža in sila peclja v ravnovesju.
2. Teža: $F_g = 0{,}2\,\mathrm{kg} \cdot 9{,}81\,\dfrac{\mathrm{N}}{\mathrm{kg}} = 1{,}962\,\mathrm{N}$.
3. Teža kaže navpično navzdol, zato sila peclja kaže navpično navzgor.
4. Odgovor: pecelj drži jabolko s silo približno $2{,}0\,\mathrm{N}$, navpično navzgor. Ko je jabolko zrelo in pecelj ne zmore več te sile, jabolko pade.

### Primer 3 (težji): čoln čez reko

Veslač vesla pravokotno na breg, proti drugemu bregu, in čoln poganja s silo $40\,\mathrm{N}$. Rečni tok ga hkrati potiska vzdolž reke s silo $30\,\mathrm{N}$. Kolikšna je rezultanta? S kolikšno silo in v katero smer bi morala vleči vrv, privezana na breg, da bi čoln miroval?

**Podatki:** $F_1 = 40\,\mathrm{N}$ proti drugemu bregu, $F_2 = 30\,\mathrm{N}$ vzdolž reke, sili pod pravim kotom
**Iščemo:** rezultanto $R$ in silo vrvi, ki bi jo uravnovesila

:::formula
Paralelogram sil: sili nariši iz iste točke v merilu $1\,\mathrm{cm}$ za $10\,\mathrm{N}$; rezultanta je diagonala. Sila v ravnovesju z $R$ je enako velika in nasprotna.
:::

**Rešitev:**

1. Merilo $1\,\mathrm{cm}$ za $10\,\mathrm{N}$: $F_1$ nariši kot $4\,\mathrm{cm}$ dolgo puščico, $F_2$ kot $3\,\mathrm{cm}$ dolgo, pravokotno nanjo.
2. Dopolni do pravokotnika in nariši diagonalo iz začetne točke. Izmeriš $5\,\mathrm{cm}$.
3. Z merilom: $R = 5 \cdot 10\,\mathrm{N} = 50\,\mathrm{N}$. Kaže poševno čez reko in hkrati dolvodno. (Kdor pozna Pitagorov izrek, lahko preveri: $\sqrt{40^2 + 30^2} = 50$.)
4. Da bi čoln miroval, mora vrv z rezultanto tvoriti ravnovesje dveh sil: enako velika, nasprotna, na isti premici.
5. Odgovor: rezultanta je $50\,\mathrm{N}$, poševno čez reko in dolvodno. Vrv bi morala vleči s silo $50\,\mathrm{N}$ ravno v nasprotno smer, poševno nazaj in gorvodno.

### Primer 4: zdaj ti

Na smrekovi veji sedi veverica z maso $0{,}3\,\mathrm{kg}$. Ob njej obleži kepa snega z maso $0{,}5\,\mathrm{kg}$. Veja se upogne in nato miruje. S kolikšno skupno silo veja drži veverico in sneg? Rezultat zaokroži na eno decimalko.

**Podatki:** $m_1 = 0{,}3\,\mathrm{kg}$, $m_2 = 0{,}5\,\mathrm{kg}$, $g = 9{,}81\,\dfrac{\mathrm{N}}{\mathrm{kg}}$, veja miruje
**Iščemo:** silo veje $F_\mathrm{v}$

:::formula
Pogoj ravnovesja: sila veje je enaka skupni teži, $F_\mathrm{v} = (m_1 + m_2) \cdot g$.
:::

**Rešitev:**

1. Obe teži kažeta navzdol, v isto smer, zato se seštejeta. Seštejemo kar masi: $m_1 + m_2 = 0{,}8\,\mathrm{kg}$.
2. Ker veja miruje, mora njena sila uravnovesiti skupno težo.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko je $F_\mathrm{v} = 0{,}8\,\mathrm{kg} \cdot 9{,}81\,\dfrac{\mathrm{N}}{\mathrm{kg}}$ in kam kaže?
---
$F_\mathrm{v} = 7{,}848\,\mathrm{N} \approx 7{,}8\,\mathrm{N}$, navpično navzgor.
:::

## Pogoste napake

- **Sile vedno seštevaš.** Kdor pri vetru v obraz izračuna $80\,\mathrm{N} + 30\,\mathrm{N}$, pozabi, da ima sila smer. Najprej poglej smeri: isti smeri seštej, nasprotni odštej.
- **Pri silah pod kotom sešteješ velikosti.** Sili $3\,\mathrm{N}$ in $4\,\mathrm{N}$ pod pravim kotom ne dasta $7\,\mathrm{N}$, ker delno vlečeta vsaka na svojo stran. Nariši paralelogram, rezultanta je $5\,\mathrm{N}$.
- **Ravnovesje pomeni, da sile ni.** Na jabolko, ki miruje, delujeta dve sili: teža in sila peclja. Nič je le njuna rezultanta. Brez peclja bi jabolko padlo.
- **Enaka velikost je dovolj.** Za ravnovesje morata biti sili tudi nasprotni in na isti premici. Enako veliki sili na dveh koncih ravnila ga zavrtita.
- **Smer rezultante se izgubi.** Odgovor »$150\,\mathrm{N}$« ni cel. Rezultanta je sila, zato vedno povej tudi smer: pri nasprotnih silah je to smer večje.

## Povzetek

Najpomembnejše:

- Rezultanta $R$ je ena sila z enakim učinkom kot več sil skupaj.
- Sili v isti smeri: $R = F_1 + F_2$. Sili v nasprotnih smereh: $R = F_1 - F_2$ (za $F_1 > F_2$), v smeri večje.
- Sili pod kotom sestavimo s paralelogramom v merilu: rezultanta je diagonala. Velikost je med razliko in vsoto obeh sil.
- Ravnovesje dveh sil: enako veliki, nasprotni, na isti premici. Rezultanta je nič, telo, ki miruje, ostane v miru.
- Telo v ravnovesju ni brez sil: jabolko na veji drži pecelj s silo, enako njegovi teži.

## Drugače: Korak za korakom s številkami

Za sili na isti premici:

1. Izberi pozitivno smer, na primer »naprej je $+$«.
2. Vsaki sili daj predznak: naprej $+$, nazaj $-$.
3. Seštej s predznaki.
4. Predznak rezultata pove smer, številka velikost.

Kolesar, veter v obraz: $(+80\,\mathrm{N}) + (-30\,\mathrm{N}) = +50\,\mathrm{N}$, torej $50\,\mathrm{N}$ naprej.

Kolesar v nevihti, veter v obraz s $90\,\mathrm{N}$: $(+80\,\mathrm{N}) + (-90\,\mathrm{N}) = -10\,\mathrm{N}$. Minus pomeni: rezultanta $10\,\mathrm{N}$ kaže nazaj, veter kolesarja ustavlja.

Za sili pod kotom:

1. Izberi merilo, da bo risba velika vsaj nekaj centimetrov (npr. $1\,\mathrm{cm}$ za $10\,\mathrm{N}$).
2. Pretvori sili v dolžini: $40\,\mathrm{N}$ je $4\,\mathrm{cm}$, $30\,\mathrm{N}$ je $3\,\mathrm{cm}$.
3. Nariši obe puščici iz iste točke, dopolni do paralelograma.
4. Izmeri diagonalo in jo z merilom pretvori nazaj v newtone: $5\,\mathrm{cm}$ je $50\,\mathrm{N}$.
5. Preveri: je rezultat med razliko ($10\,\mathrm{N}$) in vsoto ($70\,\mathrm{N}$)? Da.

## Drugače: Kot zgodba

Ana in Bor se s splavom spuščata po mirni reki. Tok potiska splav dolvodno s silo $120\,\mathrm{N}$.

Pred mostom hoče Bor ustaviti. Zarine veslo in potiska gorvodno, ravno s $120\,\mathrm{N}$. Splav obstane pod mostom: sili sta enako veliki, nasprotni in na isti premici, v ravnovesju.

Ana se odloči pomagati in vesla v isto smer kot Bor s $60\,\mathrm{N}$. Skupaj zdaj potiskata gorvodno s $180\,\mathrm{N}$, tok pa dolvodno s $120\,\mathrm{N}$. Rezultanta je $60\,\mathrm{N}$ gorvodno, splav začne počasi lezti nazaj, proč od mostu.

Na koncu zavijeta proti bregu. Bor vesla pravokotno na tok s $40\,\mathrm{N}$, Ana počiva, tok pa jih še vedno nese. Splav ne gre naravnost k bregu, ampak poševno, malo k bregu in malo dolvodno: tako, kot kaže diagonala paralelograma sil.

## Preveri se

? Na kateri sliki sta sili na točkasto telo v ravnovesju?
- $\bullet \xrightarrow{\;20\,\mathrm{N}\;} \xrightarrow{\;20\,\mathrm{N}\;}$
~ Sili kažeta v isto smer, zato se seštejeta: rezultanta je $40\,\mathrm{N}$ v desno.
+ $\xleftarrow{\;20\,\mathrm{N}\;} \bullet \xrightarrow{\;20\,\mathrm{N}\;}$
- $\xleftarrow{\;10\,\mathrm{N}\;} \bullet \xrightarrow{\;20\,\mathrm{N}\;}$
~ Sili sta nasprotni, a nista enako veliki: rezultanta je $10\,\mathrm{N}$ v desno.
- $\bullet \xrightarrow{\;20\,\mathrm{N}\;}$ in iz iste točke $20\,\mathrm{N}$ navpično navzgor
~ Sili pod pravim kotom se ne izničita, rezultanta kaže poševno navzgor desno.
> Sili sta enako veliki, nasprotno usmerjeni in na isti premici, zato je rezultanta nič.

? Jabolko z maso približno $100\,\mathrm{g}$ visi na peclju. Približno s kolikšno silo ga drži pecelj? (Vzemi $g \approx 10\,\frac{\mathrm{N}}{\mathrm{kg}}$.)
- Približno $100\,\mathrm{N}$.
~ Gram si zamenjal z newtonom. Najprej pretvori v kilograme: $100\,\mathrm{g} = 0{,}1\,\mathrm{kg}$.
+ Približno $1\,\mathrm{N}$.
- Približno $10\,\mathrm{N}$.
~ To je teža telesa z maso $1\,\mathrm{kg}$. Jabolko ima desetkrat manjšo maso.
- $0\,\mathrm{N}$, ker jabolko miruje.
~ Miruje, ker sta sili v ravnovesju, ne zato, ker ju ni. Pecelj ga drži s silo, enako teži.
> Teža je $0{,}1\,\mathrm{kg} \cdot 10\,\frac{\mathrm{N}}{\mathrm{kg}} = 1\,\mathrm{N}$. Pecelj jo uravnovesi z enako veliko silo navzgor.

? Ptica sedi na električni žici in miruje. Zakaj ne pade, čeprav nanjo deluje teža?
- Ker je ptica tako lahka, da je njena teža nič.
~ Vsako telo z maso ima težo. Ptica z maso $50\,\mathrm{g}$ ima težo približno $0{,}5\,\mathrm{N}$.
- Ker jo žica potiska navzgor z večjo silo, kot je njena teža.
~ Če bi bila sila žice večja, rezultanta ne bi bila nič in ptica bi se začela dvigovati.
+ Ker jo žica podpira z enako veliko silo navzgor, zato je rezultanta nič.
- Ker na ptico, ki miruje, ne deluje nobena sila.
~ Na ptico deluje teža in sila žice. Nič je le njuna rezultanta.
> Teža in sila žice sta enako veliki, nasprotni in na isti premici, torej v ravnovesju.

? Na splav delujeta dve sili v isto smer. Rezultanta je $90\,\mathrm{N}$, ena od sil je $35\,\mathrm{N}$. Kolikšna je druga?
- $125\,\mathrm{N}$
~ To je $90 + 35$. Rezultanta je že vsota obeh sil, zato drugo silo dobiš z odštevanjem.
+ $55\,\mathrm{N}$
- $45\,\mathrm{N}$
~ To je polovica rezultante, kot da bi bili sili enaki. Ena sila je že znana: $35\,\mathrm{N}$.
> Pri silah v isti smeri je $R = F_1 + F_2$, zato $F_2 = 90\,\mathrm{N} - 35\,\mathrm{N} = 55\,\mathrm{N}$.

? Na ladjico delujeta veter s silo $40\,\mathrm{N}$ in rečni tok s $30\,\mathrm{N}$. Veter ves dan spreminja smer. Katera rezultanta ni mogoča?
- $10\,\mathrm{N}$
~ Mogoča je: ko veter piha ravno proti toku, je rezultanta $40\,\mathrm{N} - 30\,\mathrm{N} = 10\,\mathrm{N}$.
- $50\,\mathrm{N}$
~ Mogoča je: ko sta sili pod pravim kotom, je rezultanta $50\,\mathrm{N}$.
+ $80\,\mathrm{N}$
- $70\,\mathrm{N}$
~ Mogoča je: ko veter piha v smer toka, se sili seštejeta v $70\,\mathrm{N}$.
> Rezultanta je vedno med razliko ($10\,\mathrm{N}$) in vsoto ($70\,\mathrm{N}$) obeh sil. Več kot $70\,\mathrm{N}$ ne more biti.

:::simboli
R | rezultanta | R = F_1 + F_2 | N | za sili v isti smeri
F_1 | prva sila | | N
F_2 | druga sila | | N
F_g | teža | F_g = m \cdot g | N
m | masa jabolka | | kg
g | gravitacijski pospešek | | N/kg | na Zemlji $9{,}81\,\mathrm{N/kg}$
F_\mathrm{p} | sila peclja | | N | v ravnovesju enaka teži
F_\mathrm{v} | sila veje | F_\mathrm{v} = (m_1 + m_2) \cdot g | N | v ravnovesju
m_1 | masa veverice | | kg
m_2 | masa snega | | kg
:::
