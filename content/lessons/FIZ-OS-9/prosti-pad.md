---
stanje: osnutek
demo: prosti-pad
avtor: AI
---

## Zakaj se tega učimo

Poskus za dva, potrebuješ le ravnilo. Prijatelj drži ravnilo navpično, ničla je spodaj. Ti razpreš palec in kazalec ob ničli, ravnila se ne dotikaš. Prijatelj ga brez opozorila spusti, ti pa ga čim hitreje stisneš. Odčitaš, koliko centimetrov je zdrsnilo skozi prste. Pri večini ljudi je to okoli $20\,\mathrm{cm}$.

Iz teh centimetrov lahko izračunaš svoj reakcijski čas, čeprav nimaš štoparice. Ravnilo namreč pada vedno po istem pravilu. Ko pravilo poznaš, iz dolžine padca dobiš čas in iz časa dolžino.

Isto pravilo pove, zakaj je prostor pod gradbenim odrom ograjen in zakaj delavci spodaj nosijo čelade: žebelj, ki zdrsne z višine $20\,\mathrm{m}$, ima ob tleh hitrost avtomobila.

## Razlaga

**1. Kaj je prosti pad.** Prosti pad je gibanje telesa samo pod vplivom teže, brez drugih sil. Na Zemlji vedno deluje tudi upor zraka. Pri gostih in majhnih telesih (kamen, opeka, žebelj) je na nekaj metrih tako majhen, da ga lahko zanemarimo. Pero ali list papirja pa zrak opazno zavira, zato padata počasi. Telo pri prostem padu pada navpično navzdol, v smeri, ki jo zidar preveri s **svinčnico** (utežjo, ki prosto visi na vrvici).

*Preveri:* ali je padanje suhega lista prosti pad? *(Ne, nanj opazno deluje upor zraka.)*

**2. Pospešek.** Spuščena opeka se ne giblje enakomerno: njena hitrost s časom raste. **Pospešek** pove, za koliko se hitrost spremeni v eni sekundi. Pri prostem padu je pospešek ves čas enak. Imenujemo ga **težni pospešek** in ga označimo z $g$. Na Zemlji je

$$g \approx 9{,}8\,\mathrm{\frac{m}{s^2}}$$

Vsako sekundo se hitrost padajočega telesa poveča za približno $9{,}8\,\mathrm{\frac{m}{s}}$. To je isti $g$ kot v $F_g = m \cdot g$, saj je $1\,\mathrm{\frac{N}{kg}} = 1\,\mathrm{\frac{m}{s^2}}$. Za lažje računanje pogosto vzamemo $g \approx 10\,\mathrm{\frac{m}{s^2}}$. Kadar naloga ne pove drugače, računamo z $9{,}8\,\mathrm{\frac{m}{s^2}}$.

*Preveri:* za koliko se hitrost padajočega telesa poveča v pol sekunde? *(Za $4{,}9\,\mathrm{\frac{m}{s}}$.)*

:::premisli
Zidar z odra hkrati spusti polno vedro malte in prazno vedro enake oblike, ki je desetkrat lažje. Upor zraka zanemarimo. Kaj napoveš: katero vedro prej pade na tla?
---
Padeta hkrati. Na polno vedro deluje desetkrat večja teža, a ima tudi desetkrat večjo maso, zato je po $a = F/m$ pospešek obeh enak.
:::

**3. Vsa telesa padajo enako.** Brez upora zraka težko in lahko telo padata z enakim pospeškom $g$. Dvakrat težje telo Zemlja res vleče z dvakrat večjo silo. A dvakrat večjo maso je tudi dvakrat težje pospešiti, zato je pospešek po $a = F/m$ enak.

*Preveri:* z odra hkrati padeta opeka in žebelj. Kateri ima po $1\,\mathrm{s}$ večjo hitrost? *(Nobeden, oba imata $9{,}8\,\mathrm{\frac{m}{s}}$.)*

**4. Hitrost.** Telo spustimo, zato je njegova začetna hitrost $0$. Vsako sekundo dobi $g$ hitrosti, po času $t$ torej

$$v = g\,t$$

*Preveri:* po kolikšnem času ima spuščena opeka hitrost $19{,}6\,\mathrm{\frac{m}{s}}$? *(Po $2\,\mathrm{s}$.)*

**5. Pot (višina padca).** Hitrost enakomerno raste od $0$ do $g\,t$. Povprečna hitrost je zato polovica končne, $\dfrac{g\,t}{2}$. Pot je povprečna hitrost krat čas, $h = \dfrac{g\,t}{2} \cdot t$, torej

$$h = \frac{1}{2}\,g\,t^2$$

:::premisli
Pri $g \approx 10\,\mathrm{\frac{m}{s^2}}$ kamen v prvi sekundi pade $5\,\mathrm{m}$. Koliko pade v prvih dveh sekundah: $10\,\mathrm{m}$ ali več? Zakaj?
---
Več, $20\,\mathrm{m}$: $h = \frac{1}{2} \cdot 10 \cdot 2^2 = 20\,\mathrm{m}$. V drugi sekundi je kamen že hitrejši, zato preleti daljšo pot kot v prvi.
:::

Tabela za $g = 10\,\mathrm{\frac{m}{s^2}}$:

| $t$ [s] | $v$ [m/s] | $h$ [m] |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 10 | 5 |
| 2 | 20 | 20 |
| 3 | 30 | 45 |
| 4 | 40 | 80 |

Hitrost raste enakomerno, pot pa s **kvadratom** časa: dvakrat daljši čas pomeni štirikrat daljšo pot.

*Preveri:* koliko pade kamen v $5\,\mathrm{s}$, če je $g = 10\,\mathrm{\frac{m}{s^2}}$? *(Pade $125\,\mathrm{m}$.)*

**6. Druga nebesna telesa.** Težni pospešek je odvisen od nebesnega telesa. Na Luni je približno $1{,}6\,\mathrm{\frac{m}{s^2}}$, na Marsu približno $3{,}7\,\mathrm{\frac{m}{s^2}}$. Formuli ostaneta enaki, spremeni se le $g$.

V simulaciji spodaj »Prosti pad na Zemlji, Luni in Marsu« nastavi višino $20\,\mathrm{m}$ in spusti kroglo najprej na Zemlji, nato na Luni. Opazi: na Zemlji pada približno $2\,\mathrm{s}$, na Luni približno $5\,\mathrm{s}$, ker je tam $g$ manjši.

## Rešeni primeri

### Primer 1: opeka z odra (lažji)

Zidarju na gradbenem odru zdrsne opeka. Kolikšna je njena hitrost po $1{,}5\,\mathrm{s}$ padanja? Upor zraka zanemarimo.

**Podatki:** $t = 1{,}5\,\mathrm{s}$, začetna hitrost $v_0 = 0$ (opeka zdrsne), $g = 9{,}8\,\mathrm{\frac{m}{s^2}}$
**Iščemo:** hitrost $v$ po $1{,}5\,\mathrm{s}$

:::formula
Hitrost pri prostem padu iz mirovanja: $v = g\,t$
:::

**Rešitev:**

1. Opeka začne iz mirovanja, zato velja $v = g\,t$.
2. Vstavimo: $v = 9{,}8 \cdot 1{,}5 = 14{,}7\,\mathrm{\frac{m}{s}}$.
3. Smiselnost: v eni sekundi dobi $9{,}8\,\mathrm{\frac{m}{s}}$, v pol sekunde še polovico tega, $4{,}9\,\mathrm{\frac{m}{s}}$. ✓
4. Odgovor: po $1{,}5\,\mathrm{s}$ ima opeka hitrost $14{,}7\,\mathrm{\frac{m}{s}}$.

### Primer 2: globina jaška

V novogradnji še ni dvigala. Delavec spusti matico v prazen jašek in udarec ob dno sliši po $2\,\mathrm{s}$. Kako globok je jašek? Čas potovanja zvoka in upor zraka zanemarimo.

**Podatki:** $t = 2\,\mathrm{s}$, $v_0 = 0$ (matico spusti), $g = 9{,}8\,\mathrm{\frac{m}{s^2}}$
**Iščemo:** globina jaška $h$

:::formula
Pot pri prostem padu iz mirovanja: $h = \dfrac{1}{2}\,g\,t^2$
:::

**Rešitev:**

1. Dan je čas, iščemo pot, zato uporabimo $h = \dfrac{1}{2}\,g\,t^2$.
2. Najprej kvadriramo čas (ne produkta $g\,t$): $t^2 = 2^2 = 4\,\mathrm{s^2}$.
3. Vstavimo: $h = \dfrac{1}{2} \cdot 9{,}8 \cdot 4 = 19{,}6\,\mathrm{m}$.
4. Preverimo s hitrostjo: končna hitrost je $19{,}6\,\mathrm{\frac{m}{s}}$, povprečna $9{,}8\,\mathrm{\frac{m}{s}}$, pot pa $9{,}8 \cdot 2 = 19{,}6\,\mathrm{m}$. ✓
5. Odgovor: jašek je globok približno $19{,}6\,\mathrm{m}$.

### Primer 3: libela z višine 20 m (težji)

Delavcu na odru na višini $20\,\mathrm{m}$ zdrsne libela. Koliko časa ima sodelavec spodaj, da se umakne, in s kolikšno hitrostjo libela zadene tla? Vzemi $g = 10\,\mathrm{\frac{m}{s^2}}$.

**Podatki:** $h = 20\,\mathrm{m}$, $v_0 = 0$, $g = 10\,\mathrm{\frac{m}{s^2}}$, upor zraka zanemarimo
**Iščemo:** čas padanja $t$ in hitrost ob tleh $v$

:::formula
Iz $h = \dfrac{1}{2}\,g\,t^2$ izrazimo čas: $t = \sqrt{\dfrac{2h}{g}}$, nato $v = g\,t$
:::

**Rešitev:**

1. **Vrstni red.** Hitrosti brez časa ne moremo izračunati, zato najprej $t$, potem $v$.
2. **Čas iz poti.** Enačbo $h = \dfrac{1}{2}\,g\,t^2$ pomnožimo z $2$ in delimo z $g$:
 $$t^2 = \frac{2h}{g} = \frac{2 \cdot 20}{10} = 4\,\mathrm{s^2}$$
3. **Koren.** Iščemo $t$, ne $t^2$: $t = \sqrt{4} = 2\,\mathrm{s}$.
4. **Hitrost.** $v = g\,t = 10 \cdot 2 = 20\,\mathrm{\frac{m}{s}}$.
5. **Preverimo.** $\dfrac{1}{2} \cdot 10 \cdot 2^2 = 20\,\mathrm{m}$, kar je res višina odra. ✓
6. **Občutek.** $20\,\mathrm{\frac{m}{s}} = 72\,\mathrm{\frac{km}{h}}$, saj je $20 \cdot 3{,}6 = 72$. Tako hitro vozi avto po regionalni cesti.

**Odgovor:** sodelavec ima le $2\,\mathrm{s}$ časa, libela pa zadene tla s hitrostjo $20\,\mathrm{\frac{m}{s}}$.

### Primer 4: zdaj ti – reakcijski čas

Vrnimo se k ravnilu z začetka. Ujel si ga, ko je padlo $20\,\mathrm{cm}$. Kolikšen je tvoj reakcijski čas? Vzemi $g = 10\,\mathrm{\frac{m}{s^2}}$.

**Podatki:** $h = 20\,\mathrm{cm} = 0{,}2\,\mathrm{m}$, $v_0 = 0$, $g = 10\,\mathrm{\frac{m}{s^2}}$, upor zraka zanemarimo
**Iščemo:** čas padanja $t$ (to je reakcijski čas)

:::formula
$t = \sqrt{\dfrac{2h}{g}}$
:::

**Rešitev:**

1. Višino pretvorimo v metre, ker je $g$ v $\mathrm{\frac{m}{s^2}}$: $h = 0{,}2\,\mathrm{m}$.
2. Izračunamo kvadrat časa: $t^2 = \dfrac{2 \cdot 0{,}2}{10} = 0{,}04\,\mathrm{s^2}$.
3. Iz $t^2$ izračunaj čas sam, nato preveri:

:::premisli
Kolikšen je tvoj reakcijski čas $t$, če je $t^2 = 0{,}04\,\mathrm{s^2}$?
---
$t = 0{,}2\,\mathrm{s}$, ker je $0{,}2 \cdot 0{,}2 = 0{,}04$. Tvoj reakcijski čas je približno dve desetinki sekunde (z $g = 9{,}8\,\mathrm{\frac{m}{s^2}}$ dobiš $0{,}202\,\mathrm{s}$).
:::

## Pogoste napake

- **»Težje telo pade prej.«** Zdi se logično, ker težje telo Zemlja vleče močneje. Toda večjo maso je tudi težje pospešiti, zato je pospešek obeh $g$. Masa v $v = g\,t$ in $h = \frac{1}{2}\,g\,t^2$ sploh ne nastopa. Razlike, ki jih vidiš pri listu in kamnu, povzroča upor zraka.
- **Pot, sorazmerna s časom.** »V $1\,\mathrm{s}$ pade $5\,\mathrm{m}$, v $3\,\mathrm{s}$ torej $15\,\mathrm{m}$.« To bi veljalo pri stalni hitrosti, pri padu pa hitrost raste. Pot gre s $t^2$: v $3\,\mathrm{s}$ pade $9$-krat toliko, $45\,\mathrm{m}$. Pozor tudi pri kvadriranju: $3^2 = 3 \cdot 3 = 9$, ne $3 \cdot 2 = 6$.
- **Pozabljen faktor $\frac{1}{2}$.** Kdor računa $h = g\,t^2$, vzame končno hitrost namesto povprečne in dobi dvakrat predolgo pot.
- **Pozabljen koren.** Ko iz višine računaš čas, dobiš najprej $t^2$. Rezultat $16\,\mathrm{s^2}$ še ni čas: koreniti moraš, $t = 4\,\mathrm{s}$.
- **Pospešek zamenjan s hitrostjo.** »Telo pada s hitrostjo $10\,\mathrm{\frac{m}{s}}$, zato $80\,\mathrm{m}$ preleti v $8\,\mathrm{s}$.« Narobe: $g$ ni hitrost, ampak pove, za koliko hitrost zraste vsako sekundo. Že enota $\mathrm{\frac{m}{s^2}}$ se razlikuje od enote hitrosti $\mathrm{\frac{m}{s}}$.

## Povzetek

- Prosti pad je gibanje samo pod vplivom teže (upor zraka zanemarimo).
- Težni pospešek na Zemlji je $g \approx 9{,}8\,\mathrm{\frac{m}{s^2}}$ (približno $10\,\mathrm{\frac{m}{s^2}}$); na Luni približno $1{,}6$, na Marsu približno $3{,}7\,\mathrm{\frac{m}{s^2}}$.
- Vsa telesa padajo z enakim pospeškom, ne glede na maso.
- Hitrost: $v = g\,t$. Pot: $h = \frac{1}{2}\,g\,t^2$. Čas iz višine: $t = \sqrt{2h/g}$.
- Hitrost raste enakomerno, pot s kvadratom časa.

## Drugače: Na sliki

Predstavljaj si fotografijo padajoče opeke, posneto z bliskavico vsako sekundo ($g = 10\,\mathrm{\frac{m}{s^2}}$). Na sliki ob merilnem traku vidiš opeko pri:

$0\,\mathrm{m}$ → $5\,\mathrm{m}$ → $20\,\mathrm{m}$ → $45\,\mathrm{m}$ → $80\,\mathrm{m}$

Razmiki med zaporednimi slikami so $5$, $15$, $25$, $35\,\mathrm{m}$. Vsak je za $10\,\mathrm{m}$ daljši od prejšnjega, ker je opeka vsako sekundo za $10\,\mathrm{\frac{m}{s}}$ hitrejša. Na Luni bi bile vse slike bližje skupaj, oblika vzorca pa bi ostala enaka.

Nariši še graf hitrosti v odvisnosti od časa. Dobiš **premico skozi izhodišče**, ki se vzpne do $g\,t$. Pot je ploščina pod to premico: trikotnik z osnovnico $t$ in višino $g\,t$, torej $\frac{1}{2}\,t \cdot g\,t = \frac{1}{2}\,g\,t^2$.

## Drugače: Bolj natančno

Pospešek je sprememba hitrosti, deljena s časom, v katerem se je zgodila ($\Delta$ beremo »sprememba«):

$$a = \frac{\Delta v}{\Delta t}$$

Pri prostem padu je $a = g$ stalen. Če telo spustimo ($v_0 = 0$), je po času $t$ sprememba hitrosti kar $v$, zato $g = \dfrac{v}{t}$ oziroma $v = g\,t$.

Zakaj masa ne vpliva na pospešek? Po drugem Newtonovem zakonu je $a = F/m$, teža pa je $F_g = m\,g$. Zato

$$a = \frac{m\,g}{m} = g$$

Masa se pokrajša. To je leta 1971 na Luni, kjer ni zraka, pokazal astronavt David Scott: hkrati je spustil kladivo in sokolje pero in oba sta pristala hkrati.

Tudi na Zemlji $g$ ni povsod točno enak: na ekvatorju je okoli $9{,}78\,\mathrm{\frac{m}{s^2}}$, na polih okoli $9{,}83\,\mathrm{\frac{m}{s^2}}$. Za šolske račune so te razlike zanemarljive.

Upor zraka raste s hitrostjo. Pri dolgem padcu (padalec pred odprtjem padala) lahko izenači težo. Takrat je rezultanta nič, telo ne pospešuje več in pada s skoraj stalno hitrostjo. To ni več prosti pad.

## Preveri se

? Kamen pade z gradbenega odra ($g = 10\,\mathrm{\frac{m}{s^2}}$, brez upora zraka). Katera vrsta hitrosti po $0$, $1$, $2$ in $3\,\mathrm{s}$ se ujema s prostim padom?
- $0$, $10$, $10$, $10\,\mathrm{\frac{m}{s}}$
~ Misliš, da telo takoj doseže stalno hitrost $g$. Pospešek pa pove, da hitrost vsako sekundo še zraste.
- $0$, $5$, $20$, $45\,\mathrm{\frac{m}{s}}$
~ To so poti v metrih ($h = 5\,t^2$), ne hitrosti.
+ $0$, $10$, $20$, $30\,\mathrm{\frac{m}{s}}$
- $0$, $10$, $40$, $90\,\mathrm{\frac{m}{s}}$
~ Kvadriral si čas tudi pri hitrosti. Kvadrat nastopa le pri poti, hitrost $v = g\,t$ raste enakomerno.
> Hitrost je $v = g\,t$: vsako sekundo zraste za $10\,\mathrm{\frac{m}{s}}$, zato $0$, $10$, $20$, $30\,\mathrm{\frac{m}{s}}$.

? Krovec s strehe hkrati spusti kladivo ($1\,\mathrm{kg}$) in žebelj ($5\,\mathrm{g}$). Upor zraka zanemarimo. Kaj se zgodi in zakaj?
- Kladivo pade prej, ker ga Zemlja vleče z večjo silo.
~ Sila na kladivo je res večja, a ima kladivo tudi večjo maso, ki jo je treba pospešiti. Pospešek $a = F/m$ je za oba enak.
- Padeta hkrati, ker nanju deluje enaka teža.
~ Teži nista enaki: kladivo je $200$-krat težje od žeblja. Enaka sta pospeška, ne sili.
+ Padeta hkrati, ker ima kladivo tolikokrat večjo maso, kolikokrat večjo težo, zato je pospešek obeh $g$.
- Žebelj pade prej, ker je lažji in hitreje pospeši.
~ Lažje telo ne pospeši hitreje: manjša masa, a tudi manjša sila. Brez upora zraka masa na pospešek ne vpliva.
> Po $a = F/m$ in $F_g = m\,g$ je $a = g$ za vsako telo. Večja teža kladiva se izravna z njegovo večjo maso.

? Žebelj zdrsne z žleba hiše, visokega približno $5\,\mathrm{m}$. Oceni, koliko časa pada ($g \approx 10\,\mathrm{\frac{m}{s^2}}$).
- približno $0{,}1\,\mathrm{s}$
~ Prekratko: v $0{,}1\,\mathrm{s}$ telo pade le $5\,\mathrm{cm}$.
- približno $0{,}5\,\mathrm{s}$
~ Višino si delil z $g$ ($5 : 10$), kot da bi bil $g$ hitrost. Pravilno je $t^2 = \frac{2h}{g}$.
+ približno $1\,\mathrm{s}$
- približno $5\,\mathrm{s}$
~ Misliš, da žebelj pada počasi in enakomerno. V $5\,\mathrm{s}$ bi padel kar $125\,\mathrm{m}$.
> $t^2 = \dfrac{2h}{g} = \dfrac{2 \cdot 5}{10} = 1\,\mathrm{s^2}$, torej $t \approx 1\,\mathrm{s}$. Tabela pove isto: v prvi sekundi telo pade $5\,\mathrm{m}$.

? Opeka zadene tla s hitrostjo $15\,\mathrm{\frac{m}{s}}$. Koliko časa je padala? Vzemi $g = 10\,\mathrm{\frac{m}{s^2}}$ in zanemari upor zraka.
- $150\,\mathrm{s}$
~ Hitrost si pomnožil z $g$. Iz $v = g\,t$ dobiš čas z deljenjem: $t = v/g$.
- $0{,}67\,\mathrm{s}$
~ Delil si v napačnem vrstnem redu ($10 : 15$). Čas je $t = v/g$, ne $g/v$.
- $3\,\mathrm{s}$
~ Uporabil si polovico $g$, kot pri poti. Faktor $\frac{1}{2}$ nastopa le v $h = \frac{1}{2}\,g\,t^2$, hitrost je $v = g\,t$.
+ $1{,}5\,\mathrm{s}$
> Iz $v = g\,t$ sledi $t = \dfrac{v}{g} = \dfrac{15}{10} = 1{,}5\,\mathrm{s}$.

? Astronavt na Luni ($g \approx 1{,}6\,\mathrm{\frac{m}{s^2}}$) spusti ključ z višine $0{,}8\,\mathrm{m}$. Koliko časa pada?
- $0{,}4\,\mathrm{s}$
~ Računal si z Zemljinim $g \approx 10\,\mathrm{\frac{m}{s^2}}$. Formula je ista, a $g$ je na Luni manjši.
- $0{,}5\,\mathrm{s}$
~ Višino si delil z $g$ ($0{,}8 : 1{,}6$). Pravilno je $t^2 = \frac{2h}{g}$, nato še koren.
+ $1\,\mathrm{s}$
- $0{,}71\,\mathrm{s}$
~ Pozabil si faktor $\frac{1}{2}$: iz $0{,}8 = 1{,}6\,t^2$ dobiš $t^2 = 0{,}5\,\mathrm{s^2}$. Pravilno je $h = \frac{1}{2}\,g\,t^2$.
> $t^2 = \dfrac{2h}{g} = \dfrac{2 \cdot 0{,}8}{1{,}6} = 1\,\mathrm{s^2}$, torej $t = 1\,\mathrm{s}$. Na Zemlji bi ključ padal le okoli $0{,}4\,\mathrm{s}$.

:::simboli
g | težni pospešek | | m/s^2 | na Zemlji približno 9,8 m/s², za račun pogosto 10 m/s²
v | hitrost | v = g\,t | m/s | velja, če telo spustimo ($v_0 = 0$)
t | čas padanja | t = \sqrt{\dfrac{2h}{g}} | s
h | višina padca (opravljena pot) | h = \dfrac{1}{2}\,g\,t^2 | m
a | pospešek | a = \frac{\Delta v}{\Delta t} | m/s^2 | pri prostem padu $a = g$
\Delta v | sprememba hitrosti | | m/s
\Delta t | čas, v katerem se hitrost spremeni | | s
m | masa | | kg | pospešek ni odvisen od mase
F_g | teža | F_g = m\,g | N
:::
