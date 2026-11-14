---
stanje: osnutek
demo: prosti-pad
avtor: AI
---

## Zakaj se tega učimo

Na telefonu gledaš prenos izstrelitve rakete. V kotu zaslona teče števec hitrosti. Ob vžigu kaže $0\,\mathrm{m/s}$, po $1\,\text{s}$ $4\,\mathrm{m/s}$, po $2\,\text{s}$ $8\,\mathrm{m/s}$, po $3\,\text{s}$ $12\,\mathrm{m/s}$. Kolikšna bo hitrost po $10\,\text{s}$, če se tako nadaljuje? In kako visoko bo takrat raketa?

Formula $v = \dfrac{s}{t}$ iz enakomernega gibanja tu ne pomaga, ker se hitrost ves čas spreminja. Tako je tudi pri avtu, ki spelje ob zeleni luči, in pri kamnu, ki ga spustiš z mostu. Potrebujemo novo količino, ki pove, **kako hitro se spreminja hitrost**: **pospešek**. Z njim napoveš, kako hitro bo telo čez nekaj sekund in koliko poti bo do takrat prepotovalo.

## Razlaga

**1. Trije primeri.** Zapišimo hitrost vsako sekundo za tri telesa, ki začnejo iz mirovanja:

| čas | raketa | kolesar | kamen na Luni |
|---|---|---|---|
| $0\,\text{s}$ | $0\,\mathrm{m/s}$ | $0\,\mathrm{m/s}$ | $0\,\mathrm{m/s}$ |
| $1\,\text{s}$ | $4\,\mathrm{m/s}$ | $0{,}5\,\mathrm{m/s}$ | $1{,}6\,\mathrm{m/s}$ |
| $2\,\text{s}$ | $8\,\mathrm{m/s}$ | $1\,\mathrm{m/s}$ | $3{,}2\,\mathrm{m/s}$ |
| $3\,\text{s}$ | $12\,\mathrm{m/s}$ | $1{,}5\,\mathrm{m/s}$ | $4{,}8\,\mathrm{m/s}$ |

Primerjaj vrstice od zgoraj navzdol. Pri raketi se hitrost vsako sekundo poveča za $4\,\mathrm{m/s}$, pri kolesarju za $0{,}5\,\mathrm{m/s}$, pri kamnu za $1{,}6\,\mathrm{m/s}$. Vsako telo ima svoj stalni »prirastek hitrosti na sekundo«.

**2. Ime za vzorec.** Gibanje, pri katerem hitrost narašča, je **pospešeno gibanje**. Kadar se hitrost v vsaki sekundi poveča za enako vrednost, je gibanje **enakomerno pospešeno**. Prirastek hitrosti v eni sekundi je **pospešek** $a$. Če hitrost pada, na primer pri zaviranju, je gibanje **pojemajoče**; tu računamo le pospeševanje.

Pospešek izračunamo kot spremembo hitrosti, deljeno s časom, v katerem se je zgodila:

$$a = \frac{\Delta v}{\Delta t}$$

Znak $\Delta$ (delta) pomeni »sprememba«: $\Delta v = v - v_0$ je končna hitrost minus začetna, $\Delta t$ pa pretečeni čas. Enota je $\dfrac{\mathrm{m/s}}{\mathrm{s}}$, kar zapišemo $\mathrm{m/s^2}$. Raketa ima torej pospešek $4\,\mathrm{m/s^2}$: njena hitrost vsako sekundo naraste za $4\,\mathrm{m/s}$.

**3. Hitrost po času $t$.** V tabeli je hitrost vedno pospešek, pomnožen s časom: raketa po $3\,\text{s}$ ima $4 \cdot 3 = 12\,\mathrm{m/s}$. Za telo, ki začne iz mirovanja ($v_0 = 0$), velja:

$$v = a \cdot t$$

:::premisli
Kolikšna je hitrost rakete iz uvoda po $10\,\text{s}$, če pospešek ostane enak? Napovej, preden računaš.
---
$40\,\mathrm{m/s}$. Vsako sekundo se doda $4\,\mathrm{m/s}$, v desetih sekundah torej $10 \cdot 4\,\mathrm{m/s} = 40\,\mathrm{m/s}$.
:::

**4. Pot iz grafa.** Pri enakomernem gibanju si spoznal, da je pot enaka ploščini pod grafom $v(t)$. Zdaj je graf $v(t)$ premica, ki se iz izhodišča dviga. Pod njo do časa $t$ leži pravokotni trikotnik: osnovnica je čas $t$, višina končna hitrost $v = a \cdot t$. Ploščina trikotnika je polovica produkta osnovnice in višine, torej polovica od $t \cdot a t = a t^2$:

$$s = \frac{a \cdot t^2}{2}$$

Za raketo: po $1\,\text{s}$ je $s = 2\,\text{m}$, po $2\,\text{s}$ $8\,\text{m}$, po $3\,\text{s}$ $18\,\text{m}$. Pot ne narašča sorazmerno s časom. Kako pa?

:::premisli
Čas se podvoji z $2\,\text{s}$ na $4\,\text{s}$. Kolikokrat daljšo pot prepotuje raketa? Zakaj ne dvakrat?
---
Štirikrat: $s = \dfrac{4 \cdot 4^2}{2} = 32\,\text{m}$ namesto $8\,\text{m}$. V dvakrat daljšem času je tudi končna hitrost dvakrat večja, zato raste trikotnik pod grafom v obe smeri: dvakrat širši in dvakrat višji, ploščina pa štirikrat večja.
:::

Pot torej raste s **kvadratom časa**: dvakrat več časa pomeni štirikrat daljšo pot.

V simulaciji »Pospešeno gibanje in grafi« spodaj postavi začetno hitrost na $0$, pospešek na $2\,\mathrm{m/s^2}$, izberi graf $v(t)$ in pritisni »Vozi«. Opazuj: graf $v(t)$ je premica iz izhodišča, pike, ki kažejo lego avta vsako sekundo, pa so vse bolj narazen.

**5. Padanje brez zraka.** Telo, ki ga spustiš, pada enakomerno pospešeno, če zračni upor lahko zanemarimo. Takemu padanju rečemo **prosti pad**; podrobneje ga boš spoznal v 9. razredu. Njegov pospešek je $g$, isti $g$, ki ga poznaš pri teži: na Zemlji $9{,}81\,\mathrm{N/kg} = 9{,}81\,\mathrm{m/s^2}$, v nalogah pogosto zaokroženo na $10\,\mathrm{m/s^2}$. Na Luni je $g$ približno $1{,}6\,\mathrm{m/s^2}$, na Marsu približno $3{,}7\,\mathrm{m/s^2}$. V formule namesto $a$ vstavimo $g$.

## Rešeni primeri

### Primer 1: izračun pospeška

Avto se iz mirovanja v $5\,\text{s}$ zapelje do hitrosti $20\,\mathrm{m/s}$. Kolikšen je pospešek?

**Podatki:** $v_0 = 0$ (iz mirovanja), $v = 20\,\mathrm{m/s}$, $\Delta t = 5\,\text{s}$
**Iščemo:** pospešek $a$

:::formula
$a = \dfrac{\Delta v}{\Delta t}$, kjer je $\Delta v = v - v_0$
:::

**Rešitev:**

1. Hitrost se je spremenila od $0$ do $20\,\mathrm{m/s}$, torej $\Delta v = 20\,\mathrm{m/s}$.
2. Čas spremembe je $\Delta t = 5\,\text{s}$.
3. Uporabimo definicijo pospeška: $a = \dfrac{\Delta v}{\Delta t} = \dfrac{20\,\mathrm{m/s}}{5\,\text{s}} = 4\,\mathrm{m/s^2}$.
4. Smiselnost: vsako sekundo se hitrost poveča za $4\,\mathrm{m/s}$. Po $5$ sekundah je to $5 \cdot 4 = 20\,\mathrm{m/s}$. ✓
5. Odgovor: pospešek avta je $4\,\mathrm{m/s^2}$.

### Primer 2: hitrost in pot

Kolesar se iz mirovanja pospešuje s pospeškom $0{,}5\,\mathrm{m/s^2}$. Kolikšna je njegova hitrost in kolikšno pot prevozi v $8\,\text{s}$?

**Podatki:** $v_0 = 0$ (iz mirovanja), $a = 0{,}5\,\mathrm{m/s^2}$, $t = 8\,\text{s}$
**Iščemo:** hitrost $v$ in pot $s$ po $8\,\text{s}$

:::formula
$v = a \cdot t$, $s = \dfrac{a \cdot t^2}{2}$
:::

**Rešitev:**

1. **Hitrost.** Začel je iz mirovanja, zato $v = a \cdot t = 0{,}5 \cdot 8 = 4\,\mathrm{m/s}$.
2. **Pot.** $s = \dfrac{a t^2}{2} = \dfrac{0{,}5 \cdot 8^2}{2} = \dfrac{0{,}5 \cdot 64}{2} = \dfrac{32}{2} = 16\,\text{m}$.
3. **Preverimo.** Hitrost je rasla od $0$ do $4\,\mathrm{m/s}$, zato je bila povprečna hitrost $\dfrac{0 + 4}{2} = 2\,\mathrm{m/s}$. Pot je $2 \cdot 8 = 16\,\text{m}$. ✓
4. **Odgovor.** Po $8\,\text{s}$ ima hitrost $4\,\mathrm{m/s}$ in prevozi $16\,\text{m}$.

### Primer 3: kamen v lunarni krater

Z roba kraterja na Luni se odlomi kamen in pade $20\,\text{m}$ globoko na dno. Kako dolgo pada in s kolikšno hitrostjo zadene dno? Primerjaj s padcem z enake višine na Zemlji ($g = 10\,\mathrm{m/s^2}$, zračni upor zanemari). Na Luni je $g = 1{,}6\,\mathrm{m/s^2}$.

**Podatki:** višina $s = 20\,\text{m}$, $v_0 = 0$ (kamen se odlomi in začne padati iz mirovanja); a) Zemlja $g = 10\,\mathrm{m/s^2}$, b) Luna $g = 1{,}6\,\mathrm{m/s^2}$; zračni upor zanemarimo (Luna zraka nima)
**Iščemo:** čas padanja $t$ in hitrost ob tleh $v$ na Zemlji in na Luni

:::formula
$s = \dfrac{g \cdot t^2}{2}$, od tod $t^2 = \dfrac{2s}{g}$; nato $v = g \cdot t$
:::

**Rešitev:**

1. **Preoblikujemo formulo za pot.** Iz $s = \dfrac{g t^2}{2}$ sledi $t^2 = \dfrac{2s}{g}$. To storimo, ker poznamo pot, iščemo pa čas.
2. **(a) Zemlja.** $t^2 = \dfrac{2 \cdot 20}{10} = 4$, zato $t = \sqrt{4} = 2\,\text{s}$. Hitrost ob tleh: $v = g t = 10 \cdot 2 = 20\,\mathrm{m/s}$.
3. **(b) Luna.** $t^2 = \dfrac{2 \cdot 20}{1{,}6} = \dfrac{40}{1{,}6} = 25$, zato $t = \sqrt{25} = 5\,\text{s}$. Hitrost ob tleh: $v = g t = 1{,}6 \cdot 5 = 8\,\mathrm{m/s}$.
4. **Odgovor.** Na Luni kamen pada $5\,\text{s}$ in zadene dno s hitrostjo $8\,\mathrm{m/s}$. Na Zemlji bi z enake višine padal le $2\,\text{s}$ in priletel z $20\,\mathrm{m/s}$. Ker je pospešek na Luni manjši, kamen pada dlje in pristane z manjšo hitrostjo.

### Primer 4: zdaj ti

Vrnimo se k raketi iz uvoda. Iz mirovanja pospešuje s pospeškom $4\,\mathrm{m/s^2}$. Kolikšna je njena hitrost po $10\,\text{s}$ in kako visoko je takrat? Privzemi, da je pospešek ves čas enak.

**Podatki:** $v_0 = 0$, $a = 4\,\mathrm{m/s^2}$, $t = 10\,\text{s}$
**Iščemo:** hitrost $v$ in pot (višino) $s$ po $10\,\text{s}$

:::formula
$v = a \cdot t$, $s = \dfrac{a \cdot t^2}{2}$
:::

**Rešitev:**

1. **Hitrost.** $v = a \cdot t = 4 \cdot 10 = 40\,\mathrm{m/s}$.
2. **Pot.** Kvadriraj čas, pomnoži s pospeškom in deli z $2$. Račun naredi na listu, šele nato odpri rešitev:

:::premisli
Koliko je $s = \dfrac{4 \cdot 10^2}{2}$?
---
$s = \dfrac{4 \cdot 100}{2} = 200\,\text{m}$. Preverba s povprečno hitrostjo: hitrost je rasla od $0$ do $40\,\mathrm{m/s}$, povprečno $20\,\mathrm{m/s}$, in $20\,\mathrm{m/s} \cdot 10\,\text{s} = 200\,\text{m}$. Po $10\,\text{s}$ je raketa $200\,\text{m}$ visoko in leti s hitrostjo $40\,\mathrm{m/s}$.
:::

## Pogoste napake

- **»Pospešek $3\,\mathrm{m/s^2}$ pomeni hitrost $3\,\mathrm{m/s}$.«** Hitrost ($\mathrm{m/s}$) pove, kako hitro se telo giblje, pospešek ($\mathrm{m/s^2}$) pa, za koliko se hitrost spremeni v vsaki sekundi. Letalo, ki leti enakomerno z $250\,\mathrm{m/s}$, ima pospešek $0$. Pri vsaki količini preveri enoto.
- **Pozabljeno deljenje z $2$ pri poti.** Kdor računa $s = a \cdot t^2$, vzame pravokotnik pod grafom $v(t)$ namesto trikotnika. Pot je zato dvakrat prevelika. Pravilno: $s = \dfrac{a \cdot t^2}{2}$.
- **Kvadriran cel produkt.** V formuli za pot se kvadrira samo čas: $a \cdot t^2$, ne $(a \cdot t)^2$. Pri $a = 2\,\mathrm{m/s^2}$ in $t = 3\,\text{s}$ je $a \cdot t^2 = 18$, $(a \cdot t)^2$ pa $36$.
- **»Dvakrat več časa, dvakrat daljša pot.«** To velja pri enakomernem gibanju. Pri pospešenem gibanju je telo v drugi polovici časa hitrejše, zato pot raste s kvadratom časa: dvakrat več časa, štirikrat daljša pot.
- **»Težja telesa padajo hitreje.«** Brez zraka padajo vsa telesa z enakim pospeškom $g$. Pero na Zemlji pada počasi zaradi zračnega upora, ne zaradi majhne mase.

## Povzetek

- Pospešek pove, za koliko se hitrost spremeni v eni sekundi: $a = \dfrac{\Delta v}{\Delta t}$, enota $\mathrm{m/s^2}$.
- Pri enakomerno pospešenem gibanju je pospešek stalen, hitrost pa narašča enakomerno.
- Iz mirovanja velja $v = a t$ in $s = \dfrac{a t^2}{2}$.
- Padanje brez zraka (prosti pad) je enakomerno pospešeno gibanje s pospeškom $g$: na Zemlji $9{,}81\,\mathrm{m/s^2}$ (zaokroženo $10\,\mathrm{m/s^2}$), na Luni $1{,}6\,\mathrm{m/s^2}$, na Marsu $3{,}7\,\mathrm{m/s^2}$.
- Če je čas dvakrat daljši, je pot štirikrat daljša.

## Drugače: Korak za korakom s številkami

Avto pri semaforju spelje iz mirovanja s pospeškom $a = 2\,\mathrm{m/s^2}$. Hitrost in pot vsako sekundo:

| čas $t$ (s) | hitrost $v = a t$ (m/s) | pot $s = \dfrac{a t^2}{2}$ (m) |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 2 | 1 |
| 2 | 4 | 4 |
| 3 | 6 | 9 |
| 4 | 8 | 16 |

Kaj opaziš?

1. Hitrost raste za $2\,\mathrm{m/s}$ vsako sekundo, torej enakomerno.
2. Pot raste vse hitreje: $1,\ 4,\ 9,\ 16$ so kvadrati števil $1,\ 2,\ 3,\ 4$. Pri $a = 2\,\mathrm{m/s^2}$ se namreč dvojka v števcu in imenovalcu formule $\dfrac{a t^2}{2}$ pokrajša, zato je pot v metrih kar kvadrat časa v sekundah.
3. V posamezni sekundi telo prepotuje vse več: v 1. sekundi $1\,\text{m}$, v 2. sekundi $4 - 1 = 3\,\text{m}$, v 3. sekundi $9 - 4 = 5\,\text{m}$, v 4. sekundi $16 - 9 = 7\,\text{m}$.

Recept za nalogo:

1. Izpiši znane podatke ($a$, $t$, ali $v$, ali $s$) in preveri enote.
2. Če iščeš hitrost, uporabi $v = a t$.
3. Če iščeš pot, uporabi $s = \dfrac{a t^2}{2}$.
4. Če iščeš pospešek, uporabi $a = \dfrac{\Delta v}{\Delta t}$.
5. Preveri, ali je rezultat smiseln (npr. hitrost ni nenadoma $1000\,\mathrm{m/s}$ za kolesarja).

## Drugače: Kot zgodba

Pred približno štiristo leti je Galileo Galilei trdil nekaj, kar je bilo v nasprotju s tedanjim prepričanjem, da težja telesa padajo hitreje: če ne bi bilo zraka, bi pero in kladivo padala enako hitro. Na Zemlji tega ni mogel pokazati, ker zrak pero zavira.

Leta 1971 je astronavt David Scott med odpravo Apollo 15 stal na Luni, kjer zraka ni. Pred kamero je v eni roki držal geološko kladivo, v drugi sokolje pero. Spustil ju je hkrati. Na televizijskem posnetku se vidi, da sta padala drug ob drugem in hkrati udarila v prah.

Kaj se je dogajalo med padcem? Na Luni se hitrost vsakega telesa vsako sekundo poveča za $1{,}6\,\mathrm{m/s}$, ne glede na maso. Kladivo in pero sta začela iz mirovanja in imela ves čas enak pospešek, zato sta imela v vsakem trenutku enako hitrost in prepotovala enako pot. Galileo je imel prav.

V simulaciji »Prosti pad na Zemlji, Luni in Marsu« spodaj spusti kroglo z višine $20\,\text{m}$ najprej na Zemlji, nato na Luni. Opazuj, da na Luni pada približno $5\,\text{s}$, na Zemlji pa le približno $2\,\text{s}$, tako kot v primeru 3.

## Drugače: Bolj natančno

Zakaj je pot enaka $s = \dfrac{a t^2}{2}$?

Pri gibanju iz mirovanja hitrost narašča od $0$ do $v = a t$. Ker narašča enakomerno, je **povprečna hitrost** sredina med začetno in končno:

$$v_{\text{povp}} = \frac{0 + a t}{2} = \frac{a t}{2}$$

Pot je enaka povprečni hitrosti, pomnoženi s časom:

$$s = v_{\text{povp}} \cdot t = \frac{a t}{2} \cdot t = \frac{a t^2}{2}$$

Ta izpeljava velja le za enakomerno pospešeno gibanje, kjer povprečna hitrost leži natanko na sredini med začetno in končno. Pri gibanju s spreminjajočim se pospeškom tako ne moremo računati.

Kaj pa, če telo ne začne iz mirovanja, ampak že ima začetno hitrost $v_0$? Potem je hitrost $v = v_0 + a \cdot t$, pot pa $s = v_0 \cdot t + \dfrac{a \cdot t^2}{2}$. Prvi del je pot, ki bi jo telo prepotovalo enakomerno, drugi je dodatek zaradi pospeška. V simulaciji spodaj to preizkusiš z drsnikom za začetno hitrost.

## Preveri se

? Katera tabela hitrosti (v $\mathrm{m/s}$, vsako sekundo od $t = 0$) kaže enakomerno pospešeno gibanje iz mirovanja?
- $3,\ 3,\ 3,\ 3$
~ Hitrost se ne spreminja: to je enakomerno gibanje, pospešek je $0$.
- $0,\ 1,\ 4,\ 9$
~ Prirastki so $1$, $3$, $5$, niso enaki. Tako narašča pot pri pospešenem gibanju, ne hitrost.
+ $0,\ 3,\ 6,\ 9$
- $0,\ 2,\ 3,\ 7$
~ Hitrost sicer narašča, a vsako sekundo za drugo vrednost, zato pospešek ni stalen.
> Pri enakomerno pospešenem gibanju se hitrost vsako sekundo poveča za enako vrednost, tu za $3\,\mathrm{m/s}$. Začne pri $0$, torej iz mirovanja; pospešek je $3\,\mathrm{m/s^2}$.

? Zakaj sta kladivo in pero na Luni padla hkrati, na Zemlji pa pero pada mnogo počasneje?
- Ker na Luni ni težnosti in telesi lebdita enako počasi.
~ Na Luni težnost je, le šibkejša: $g$ je $1{,}6\,\mathrm{m/s^2}$. Brez nje telesi sploh ne bi padli.
+ Ker na Luni ni zraka; brez zračnega upora imata obe telesi enak pospešek $g$.
- Ker je na Luni kladivo lažje, pero pa ne.
~ Teža se na Luni zmanjša obema telesoma enako, šestkrat. Razlika na Zemlji je zaradi zraka, ne teže.
- Ker težja telesa padajo hitreje samo na Zemlji.
~ Tudi na Zemlji bi brez zraka padala enako. Pero zavira zračni upor, ne majhna masa.
> Brez zraka padajo vsa telesa z istim pospeškom. Na Zemlji zračni upor pero močno zavira, na Luni zraka ni.

? Voziček enakomerno pospešuje iz mirovanja in v $4\,\text{s}$ prepelje $20\,\text{m}$. Približno koliko poti prepelje v $8\,\text{s}$?
- približno $40\,\text{m}$
~ Dvakrat več časa, dvakrat daljša pot velja le pri enakomernem gibanju. Tu je voziček v drugih štirih sekundah hitrejši.
+ približno $80\,\text{m}$
- približno $160\,\text{m}$
~ Pot raste s kvadratom časa: $2^2 = 4$, ne $2^3 = 8$.
> Pot je sorazmerna s $t^2$. Čas je dvakrat daljši, zato je pot $2^2 = 4$-krat daljša: $4 \cdot 20\,\text{m} = 80\,\text{m}$.

? Raketa iz mirovanja v $15\,\text{s}$ doseže hitrost $60\,\mathrm{m/s}$. Kolikšen je njen pospešek, če je stalen?
- $900\,\mathrm{m/s^2}$
~ To je produkt $60 \cdot 15$. Pospešek je sprememba hitrosti, **deljena** s časom.
- $0{,}25\,\mathrm{m/s^2}$
~ To je $\dfrac{15}{60}$: čas, deljen s hitrostjo. Hitrost mora biti v števcu.
+ $4\,\mathrm{m/s^2}$
- $60\,\mathrm{m/s^2}$
~ To je končna hitrost, ne pospešek. Pospešek pove, za koliko se hitrost spremeni v eni sekundi, zato spremembo hitrosti deliš s časom.
> $a = \dfrac{\Delta v}{\Delta t} = \dfrac{60\,\mathrm{m/s}}{15\,\text{s}} = 4\,\mathrm{m/s^2}$.

? Rover na Marsu ($g = 3{,}7\,\mathrm{m/s^2}$) fotografira kamen, ki pade z vrha pečine na tla v $4\,\text{s}$. Kako visoka je pečina? Mars ima zelo redek zrak, zato upor zanemari.
- $14{,}8\,\text{m}$
~ To je $g \cdot t$, hitrost ob tleh v $\mathrm{m/s}$, ne pot.
- $59{,}2\,\text{m}$
~ To je $g \cdot t^2$ brez deljenja z $2$: pravokotnik namesto trikotnika pod grafom $v(t)$.
+ $29{,}6\,\text{m}$
- $7{,}4\,\text{m}$
~ To je $\dfrac{g \cdot t}{2}$: čas ni kvadriran.
> $s = \dfrac{g \cdot t^2}{2} = \dfrac{3{,}7 \cdot 16}{2} = 29{,}6\,\text{m}$.

:::simboli
a | pospešek | a = \dfrac{\Delta v}{\Delta t} | m/s^2 | prirastek hitrosti v eni sekundi
v | hitrost | v = a \cdot t | m/s | pri padanju $v = g \cdot t$
v_0 | začetna hitrost | | m/s | iz mirovanja je $v_0 = 0$
\Delta v | sprememba hitrosti | \Delta v = v - v_0 | m/s
\Delta t | čas spremembe hitrosti | | s
v_{\text{povp}} | povprečna hitrost | v_{\text{povp}} = \frac{a t}{2} | m/s | velja pri gibanju iz mirovanja
t | čas | | s
s | pot | s = \dfrac{a \cdot t^2}{2} | m | velja pri gibanju iz mirovanja
g | gravitacijski pospešek | | m/s^2 | isti $g$ kot pri teži; Zemlja $9{,}81\,\mathrm{m/s^2}$, Luna $1{,}6\,\mathrm{m/s^2}$
:::
