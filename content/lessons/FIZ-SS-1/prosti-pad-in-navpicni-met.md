---
stanje: osnutek
demo: prosti-pad
avtor: AI
---

## Zakaj se tega učimo

Primi ravnilo za zgornji konec. Prijatelj naj drži palec in kazalec odprta ob oznaki $0$, ne da bi se ravnila dotikal. Brez opozorila ga spusti. Prijatelj ga ujame šele, ko opazi gibanje, in ravnilo do takrat pade kakih $20\,\text{cm}$. Iz te ene dolžine boš izračunal njegov reakcijski čas, brez štoparice.

Natančneje izmeriš padanje s telefonom. Postavi ga ob meter, posnemi padec žoge v počasnem posnetku in preštej sličice. Oba poskusa pokažeta isto: spuščeno telo ne pada s stalno hitrostjo, ampak vedno hitreje. Gre za enakomerno pospešeno gibanje, ki ga že poznaš ($v = v_0 + at$, $s = v_0 t + \dfrac{at^2}{2}$). Novo je le to, da ima pospešek tu posebno ime in znano vrednost.

S temi enačbami lahko izračunaš, kako globoko je vodnjak, če poslušaš, kdaj kamen pade v vodo, kako visoko poleti žoga ali kako hitro pade predmet z balkona. Isti račun uporabljajo tudi pri načrtovanju pristankov na Luni in Marsu. Tam je $g$ drugačen, enačbe pa ostanejo enake.

## Razlaga

**1. Prosti pad.** Prosti pad je gibanje telesa, ki ga spustimo (začetna hitrost je $0$) in nanj deluje samo teža. Zračni upor zanemarimo.

*Hiter preizkus:* ali je žoga, ki jo vržeš navzdol, v prostem padu? (Ne, ker njena začetna hitrost ni $0$. Pospešek pa ima enak.)

**2. Težni pospešek.** Pri prostem padu se hitrost vsako sekundo poveča za enako vrednost. Ta pospešek imenujemo **težni pospešek** $g$. Na Zemlji je

$$g \approx 9{,}81\,\mathrm{\frac{m}{s^2}}.$$

Pospešek je enak za vsa telesa, težka in lahka, če zanemarimo zračni upor. Brez zraka bi kamen in pero padla enako hitro.

:::premisli
Telefon in pero spustiš hkrati z iste višine v sobi. Kaj pade prej? In kaj bi se zgodilo v cevi, iz katere smo izčrpali zrak?
---
V sobi telefon, ker pero močno zavira zrak. V cevi brez zraka padeta hkrati: oba imata pospešek $g$, masa pri tem ne igra vloge.
:::

**3. Enačbe prostega pada.** Os $y$ usmerimo navzdol. Iz enačb za enakomerno pospešeno gibanje z $v_0 = 0$ in $a = g$ dobimo:

$$v = g\,t \qquad h = \frac{g\,t^2}{2} \qquad v^2 = 2\,g\,h$$

Tretja enačba nastane z izločitvijo časa. Uporabimo jo, kadar čas ni znan ali ni zanimiv.

:::premisli
Ravnilo iz uvoda pade $20\,\text{cm}$, preden ga prijatelj ujame. Je njegov reakcijski čas bližje $0{,}02\,\text{s}$; $0{,}2\,\text{s}$ ali $2\,\text{s}$? Napovej, nato izračunaj.
---
Bližje $0{,}2\,\text{s}$. Iz $h = \dfrac{g t^2}{2}$ sledi $t = \sqrt{\dfrac{2h}{g}} = \sqrt{\dfrac{0{,}40}{9{,}81}} \approx 0{,}20\,\text{s}$. Višino smo prej pretvorili v metre.
:::

**4. Navpični met navzgor.** Telo vržemo navzgor z začetno hitrostjo $v_0$. Os $y$ zdaj usmerimo **navzgor**. Pospešek kaže navzdol, zato je $a = -g$:

$$v = v_0 - g\,t \qquad y = v_0\,t - \frac{g\,t^2}{2}$$

Hitrost se najprej zmanjšuje, v vrhu postane $0$, nato pa telo pada nazaj (hitrost je negativna). Graf kaže met z $v_0 = 14\,\mathrm{m/s}$ iz Primera 2:

:::risba graf
opis: Graf hitrosti v odvisnosti od časa za žogo, vrženo navzgor z začetno hitrostjo 14 m/s. Premica pada od 14 m/s pri času 0 do 0 pri 1,43 s (vrh) in naprej do −14 m/s pri 2,85 s, ko je žoga spet v roki.
x: 0 .. 3 | 0,5 | t [s]
y: -15 .. 15 | 5 | v [m/s]
f: 14-9.81*x | modra | 0 .. 2,85
točka: 1,43; 0 | vrh | nad desno
točka: 2,85; -13,96 | vrnitev | levo
:::

Naklon premice je povsod enak, $-g$: hitrost se vsako sekundo zmanjša za $9{,}81\,\mathrm{m/s}$, tudi ko je že negativna.

*Hiter preizkus:* kaj pomeni točka, kjer premica seka os $t$? (Hitrost je nič, žoga je v vrhu.)

**5. Najvišja točka.** V vrhu je $v = 0$. Iz tega sledi:

$$t_\text{vrh} = \frac{v_0}{g} \qquad h_\text{max} = \frac{v_0^2}{2g}$$

Čas vzpona je enak času padanja nazaj na isto višino. Celoten let do vrnitve na izhodišče traja $\dfrac{2v_0}{g}$. Ob vrnitvi je hitrost po velikosti enaka $v_0$, usmerjena pa je navzdol.

**6. Pomembno o pospešku.** Na poti navzgor, v vrhu in na poti navzdol je pospešek ves čas enak: $g$, usmerjen navzdol. V vrhu ima telo hitrost nič, pospešek pa ne.

V simulaciji spodaj »Navpični met« izstreli žogo navzgor in jo ustavi tik pred vrhom, nato tik za njim. Opazuj puščico hitrosti: obrne se, sprememba hitrosti pa ima ves čas smer navzdol.

**7. Predznaki.** Pred računom izberi smer osi in jo upoštevaj pri vseh količinah. Pri metu navzgor sta $v_0$ in višina pozitivni, $g$ pa vstavljaš v enačbe s predznakom, ki ga določa izbrana smer.

## Rešeni primeri

### Primer 1: kamen z mostu (lažji)

Kamen spustimo z mostu in v vodo pade po $3{,}0\,\text{s}$. Kako visoko je most nad vodo in kolikšna je hitrost kamna tik pred udarcem? Zračni upor zanemari.

**Podatki:** $t = 3{,}0\,\text{s}$, $v_0 = 0$ (kamen spustimo), $g = 9{,}81\,\mathrm{m/s^2}$, zračni upor zanemarimo
**Iščemo:** višino mostu $h$ in hitrost $v$ tik pred udarcem v vodo

:::formula
Prosti pad: $h = \dfrac{g t^2}{2}$ in $v = g\,t$ (preverjanje: $v^2 = 2\,g\,h$)
:::

**Rešitev:**

1. Gre za prosti pad (začetna hitrost je $0$), zato uporabimo $h = \dfrac{g t^2}{2}$.
2. Vstavimo: $h = \dfrac{9{,}81 \cdot 3{,}0^2}{2} = \dfrac{9{,}81 \cdot 9}{2} = 44{,}145\,\text{m} \approx 44\,\text{m}$.
3. Hitrost dobimo iz $v = g t$: $v = 9{,}81 \cdot 3{,}0 = 29{,}43\,\mathrm{m/s} \approx 29\,\mathrm{m/s}$.
4. Preverimo z drugo enačbo: $v^2 = 2 g h = 2 \cdot 9{,}81 \cdot 44{,}145 \approx 866$, $\sqrt{866} \approx 29{,}4\,\mathrm{m/s}$. ✓

**Odgovor:** most je približno $44\,\text{m}$ nad vodo, kamen pa udari s hitrostjo približno $29\,\mathrm{m/s}$ (to je okoli $106\,\mathrm{km/h}$).

### Primer 2: žoga navzgor

Žogo vržemo navpično navzgor s hitrostjo $14{,}0\,\mathrm{m/s}$. Kako visoko poleti, kdaj doseže vrh in kdaj pade nazaj v roko?

**Podatki:** $v_0 = 14{,}0\,\mathrm{m/s}$ (navzgor), $g = 9{,}81\,\mathrm{m/s^2}$, v vrhu je $v = 0$
**Iščemo:** največjo višino $h_\text{max}$, čas vzpona $t_\text{vrh}$ in čas vrnitve v roko

:::formula
$t_\text{vrh} = \dfrac{v_0}{g}$, $h_\text{max} = \dfrac{v_0^2}{2g}$, celoten let traja $2\,t_\text{vrh}$ (preverjanje: $y = v_0\,t - \dfrac{g t^2}{2}$)
:::

**Rešitev:**

1. V vrhu je $v = 0$. Čas vzpona: $t_\text{vrh} = \dfrac{v_0}{g} = \dfrac{14{,}0}{9{,}81} \approx 1{,}43\,\text{s}$.
2. Višina: $h_\text{max} = \dfrac{v_0^2}{2g} = \dfrac{14{,}0^2}{2 \cdot 9{,}81} = \dfrac{196}{19{,}62} \approx 9{,}99\,\text{m}$.
3. Čas padanja nazaj je enak času vzpona, zato je skupni čas $2 \cdot 1{,}43 \approx 2{,}85\,\text{s}$.
4. Preverimo z enačbo za višino ob $t = 2{,}85\,\text{s}$: $14{,}0 \cdot 2{,}85 - 4{,}905 \cdot 2{,}85^2 \approx 39{,}9 - 39{,}8 \approx 0$. ✓ (majhno odstopanje je zaradi zaokroževanja)

**Odgovor:** žoga poleti približno $10{,}0\,\text{m}$ visoko, vrh doseže po $1{,}43\,\text{s}$ in se vrne po $2{,}85\,\text{s}$.

### Primer 3: met z roba stavbe (težji)

Z roba stavbe, ki je $25\,\text{m}$ visoka, vržemo kamen navpično navzgor s hitrostjo $10\,\mathrm{m/s}$. Po kolikšnem času pade na tla in s kolikšno hitrostjo?

**Podatki:** $y_0 = 25\,\text{m}$ (višina stavbe), $v_0 = 10\,\mathrm{m/s}$ (navzgor), $g = 9{,}81\,\mathrm{m/s^2}$, ob padcu na tla je $y = 0$
**Iščemo:** čas $t$ do padca na tla in hitrost $v$ ob padcu

:::formula
Os navzgor: $y = y_0 + v_0\,t - \dfrac{g t^2}{2}$ (ob padcu $y = 0$, rešimo kvadratno enačbo), $v = v_0 - g\,t$ (preverjanje: $v^2 = v_0^2 + 2\,g\,y_0$)
:::

**Rešitev:**

1. **Izbira osi.** Os $y$ usmerimo navzgor, izhodišče postavimo na tla. Začetni položaj je $y_0 = 25\,\text{m}$, začetna hitrost $v_0 = +10\,\mathrm{m/s}$.
2. **Enačba gibanja.** $y = y_0 + v_0 t - \dfrac{g t^2}{2}$. Ob padcu na tla je $y = 0$:
 $$0 = 25 + 10\,t - 4{,}905\,t^2$$
3. **Kvadratna enačba.** Zapišemo jo kot $4{,}905\,t^2 - 10\,t - 25 = 0$. Rešitev:
 $$t = \frac{10 \pm \sqrt{100 + 4 \cdot 4{,}905 \cdot 25}}{2 \cdot 4{,}905} = \frac{10 \pm \sqrt{590{,}5}}{9{,}81} = \frac{10 \pm 24{,}30}{9{,}81}$$
4. **Izbira rešitve.** Negativni čas ($t \approx -1{,}46\,\text{s}$) je pred metom in zato ni smiseln. Ostane $t = \dfrac{34{,}30}{9{,}81} \approx 3{,}50\,\text{s}$.
5. **Hitrost.** $v = v_0 - g t = 10 - 9{,}81 \cdot 3{,}50 \approx -24{,}3\,\mathrm{m/s}$. Minus pomeni, da kamen leti navzdol.
6. **Preverimo brez časa:** $v^2 = v_0^2 + 2 g \cdot 25 = 100 + 490{,}5 = 590{,}5$, $v \approx 24{,}3\,\mathrm{m/s}$. ✓

**Odgovor:** kamen pade na tla po približno $3{,}5\,\text{s}$ s hitrostjo približno $24\,\mathrm{m/s}$.

### Primer 4 – zdaj ti: višina iz počasnega posnetka

Telefon snema s $240$ sličicami na sekundo. Žoga, ki jo spustimo, potrebuje od spusta do tal $108$ sličic. S kolikšne višine je padla? Zračni upor zanemari.

**Podatki:** $240$ sličic v $1\,\text{s}$, padec traja $108$ sličic, $v_0 = 0$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** višino $h$

:::formula
Čas iz sličic: $t = \dfrac{\text{število sličic}}{240\,\text{sličic/s}}$, nato prosti pad: $h = \dfrac{g t^2}{2}$
:::

**Rešitev:**

1. Najprej čas, ker ga enačba potrebuje v sekundah: $t = \dfrac{108}{240}\,\text{s} = 0{,}45\,\text{s}$.
2. Žogo smo spustili, zato velja enačba prostega pada brez člena z $v_0$.
3. Vstavi $t$ v $h = \dfrac{g t^2}{2}$ in izračunaj sam, nato preveri:

:::premisli
Kolikšna je višina $h$?
---
$h = \dfrac{9{,}81 \cdot 0{,}45^2}{2} \approx 0{,}99\,\text{m}$, torej žoga je padla z višine približno $1\,\text{m}$.
:::

## Pogoste napake

- **Pospešek v vrhu je nič.** Ker žoga za trenutek obstane, se zdi, da nanjo nič ne deluje. Ni res. V vrhu je nič samo hitrost, pospešek je še vedno $g$ navzdol. Če bi bil pospešek nič, bi telo obvisilo v zraku.
- **Mešanje predznakov.** Učenec piše $v = v_0 + g t$ tudi pri metu navzgor in dobi hitrost, ki ves čas raste. Če os usmeriš navzgor, mora imeti $g$ v enačbah nasprotno smer od $v_0$. Izberi smer in je ne spreminjaj sredi naloge. Pri kvadratni enačbi zavrzi negativni čas: to je trenutek pred metom.
- **Pozabljen faktor $\tfrac{1}{2}$ ali kvadrat časa.** Kdor si zapomni le »hitrost krat čas«, računa $h = g t$ ali $h = g t^2$. Hitrost pa med padanjem raste od $0$, zato je povprečna le polovica končne. Pravilno je $h = \dfrac{g t^2}{2}$ in $h_\text{max} = \dfrac{v_0^2}{2g}$ (dvojka je v imenovalcu).
- **»Težja telesa padajo hitreje.«** Izkušnja s peresom in kamnom to navidez potrjuje. Brez zračnega upora vsa telesa padajo z istim pospeškom; razliko povzroča le zrak.
- **»Dvakrat višje, dvakrat dlje.«** Čas ni sorazmeren z višino, ker je $h$ sorazmerna s $t^2$. Pri dvakratni višini je čas $\sqrt{2} \approx 1{,}41$-krat daljši. Čas vedno računaj s korenom: $t = \sqrt{\dfrac{2h}{g}}$.

## Povzetek

- Prosti pad: začetna hitrost $0$, pospešek $g \approx 9{,}81\,\mathrm{m/s^2}$ navzdol.
- Enačbe: $v = g t$, $h = \dfrac{g t^2}{2}$, $v^2 = 2 g h$.
- Navpični met navzgor (os navzgor): $v = v_0 - g t$, $y = v_0 t - \dfrac{g t^2}{2}$.
- Vrh: $v = 0$, $t_\text{vrh} = \dfrac{v_0}{g}$, $h_\text{max} = \dfrac{v_0^2}{2g}$.
- Čas vzpona je enak času padanja nazaj na isto višino, hitrost ob vrnitvi pa je po velikosti enaka začetni.
- Pospešek je ves čas $g$ navzdol, tudi v vrhu.
- Na drugih nebesnih telesih je $g$ drugačen, enačbe pa ostanejo enake.

## Drugače: Na sliki

V demonstraciji »Prosti pad na Zemlji, Luni in Marsu« spustiš telo na treh nebesnih telesih in opazuješ, kako hitro pada. Pozorno spremljaj, kako se razmaki med zaporednimi položaji večajo. To je znak, da se hitrost povečuje, saj telo v enakih časovnih razmikih preleti vedno daljše poti.

Opaziš lahko:

- Na Zemlji ($g \approx 9{,}81\,\mathrm{m/s^2}$) telo pade najhitreje.
- Na Marsu ($g \approx 3{,}71\,\mathrm{m/s^2}$) telo isto višino preleti počasneje.
- Na Luni ($g \approx 1{,}62\,\mathrm{m/s^2}$) je padanje najpočasnejše.

Če narišeš graf hitrosti v odvisnosti od časa, dobiš premico skozi izhodišče, njen naklon pa je $g$. Strmejša premica pomeni večji težni pospešek. Pot je ploščina pod to premico: pri času $t$ je to trikotnik s ploščino $\dfrac{1}{2}\, t \cdot g t = \dfrac{g t^2}{2}$.

Za vajo odpri še simulacijo spodaj »Navpični met«. Žogo izstreli navpično navzgor in opazuj, kako se vektor hitrosti krajša do vrha in nato spet daljša v nasprotni smeri.

## Drugače: Iz vsakdanjega življenja

**Skok v vodo.** Skakalec skoči s skakalne deske, ki je $3\,\text{m}$ nad vodo, pri čemer je njegova začetna hitrost v navpični smeri skoraj nič. Čas padanja je $t = \sqrt{\dfrac{2h}{g}} = \sqrt{\dfrac{6}{9{,}81}} \approx 0{,}78\,\text{s}$. V manj kot sekundi mora izvesti vse, kar želi pokazati.

**Globina vodnjaka.** Spustiš kamen in šteješ sekunde do pljuska. Če se pljusk sliši po $2{,}0\,\text{s}$ (in čas potovanja zvoka zanemariš), je globina približno $\dfrac{9{,}81 \cdot 4}{2} \approx 19{,}6\,\text{m}$. Pri večjih globinah ta približek postane slab, ker zvok potrebuje čas, da pride do tebe.

Skupno vsem primerom: čas in višina sta povezana s kvadratom, zato pri dvakratni višini čas ni dvakratni, ampak le $\sqrt{2} \approx 1{,}41$-krat daljši.

## Drugače: Korak za korakom s številkami

**Primerjava časov padanja z višine $10\,\text{m}$** ($t = \sqrt{2h/g}$):

| Kje | $g$ v $\mathrm{m/s^2}$ | $\dfrac{2h}{g}$ v $\mathrm{s^2}$ | $t$ v $\mathrm{s}$ |
|---|---|---|---|
| Zemlja | $9{,}81$ | $2{,}04$ | $1{,}43$ |
| Mars | $3{,}71$ | $5{,}39$ | $2{,}32$ |
| Luna | $1{,}62$ | $12{,}35$ | $3{,}51$ |

Na Luni je $g$ približno šestkrat manjši kot na Zemlji ($9{,}81 / 1{,}62 \approx 6{,}06$), čas padanja pa je le $2{,}5$-krat daljši ($\sqrt{6{,}06} \approx 2{,}46$). Razlog je koren: čas je sorazmeren z $1/\sqrt{g}$, ne z $1/g$.

## Drugače: Bolj natančno

**Izpeljava enačb.** Pospešek je po definiciji $a = \dfrac{\Delta v}{\Delta t}$. Če je $a = g$ stalen in je $v_0 = 0$, je $v = g t$. Graf $v(t)$ je premica skozi izhodišče. Pot je ploščina pod grafom:

$$h = \frac{1}{2}\cdot t \cdot v = \frac{1}{2}\, t \cdot g t = \frac{g t^2}{2}$$

Če iz $v = g t$ izraziš $t = v/g$ in vstaviš v izraz za $h$, dobiš

$$h = \frac{g}{2}\cdot\frac{v^2}{g^2} = \frac{v^2}{2g} \quad\Rightarrow\quad v^2 = 2 g h.$$

**Zakaj je čas vzpona enak času padanja.** Pri metu navzgor je $v = v_0 - g t$. V vrhu je $v = 0$, zato je $t_\text{vrh} = v_0/g$. Pri padanju iz vrha pa velja $h_\text{max} = \dfrac{g t^2}{2}$, torej $t = \sqrt{\dfrac{2 h_\text{max}}{g}}$. Vstavimo $h_\text{max} = \dfrac{v_0^2}{2g}$ in dobimo $t = \dfrac{v_0}{g}$. Časa sta enaka, gibanje je simetrično.

**Zakaj padajo vsa telesa enako.** (Pogled naprej: sile in Newtonove zakone boš spoznal v naslednjih poglavjih.) Po drugem Newtonovem zakonu je $F = m a$. Sila teže je $F_g = m g$, zato je $a = \dfrac{m g}{m} = g$. Masa se pokrajša, torej je pospešek neodvisen od mase. To je tudi pokazal Galilei, ko je ugotovil, da razlike pri padanju povzroča le zračni upor.

**Omejitve modela.** Enačbe veljajo, če je zračni upor zanemarljiv in če je višina majhna v primerjavi s polmerom planeta (tako je $g$ približno stalen). Pri velikih hitrostih ali lahkih telesih z veliko površino (list, padalo) je zračni upor bistven in se telo ne giblje enakomerno pospešeno.

## Preveri se

? Telo spustimo s stolpa in pada $2{,}0\,\text{s}$. Kolikšna je njegova hitrost tik pred udarcem? (Zračni upor zanemari, $g = 9{,}81\,\mathrm{m/s^2}$.)
- $9{,}81\,\mathrm{m/s}$
~ To je vrednost $g$, ki je pospešek: pove, za koliko se hitrost poveča v eni sekundi. Telo pada dve sekundi.
- $39{,}2\,\mathrm{m/s}$
~ Tu je čas kvadriran ($g t^2$). Kvadrat časa spada v enačbo za višino, hitrost pa raste linearno: $v = g t$.
+ $19{,}6\,\mathrm{m/s}$
> Pri prostem padu je $v = g t = 9{,}81 \cdot 2{,}0 \approx 19{,}6\,\mathrm{m/s}$. Vrednost $39{,}2\,\mathrm{m/s}$ dobiš, če po pomoti računaš $g t^2$ in čas kvadriraš, vrednost $9{,}81\,\mathrm{m/s}$ pa je kar $g$, ki je pospešek, ne hitrost.

? Žoga v najvišji točki navpičnega meta za trenutek obstane. Zakaj kljub temu ne obvisi? Kaj velja zanjo v tem trenutku?
- Hitrost in pospešek sta enaka $0$.
~ Če bi bil tudi pospešek nič, bi se hitrost ne spremenila in žoga bi obvisela. Teža deluje ves čas, zato je pospešek $g$.
- Pospešek je enak $0$, hitrost pa je največja.
~ Hitrost je v vrhu najmanjša (nič), največja je ob metu in ob vrnitvi. Pospešek se med letom ne spremeni.
+ Hitrost je $0$, pospešek je $g$ navzdol.
> V vrhu se smer gibanja obrne, zato je hitrost trenutno nič. Pospešek pa je ves čas enak $g$ in kaže navzdol, saj nanjo še vedno deluje teža.

? Žoga, vržena navpično navzgor, doseže višino $20{,}4\,\text{m}$. Približno s kolikšno hitrostjo smo jo vrgli? ($g = 9{,}81\,\mathrm{m/s^2}$)
- $14\,\mathrm{m/s}$
~ Tako dobiš iz $v_0 = \sqrt{g h}$, ko pozabiš dvojko: pravilno je $v_0^2 = 2 g h$.
+ $20\,\mathrm{m/s}$
- $400\,\mathrm{m/s}$
~ To je $v_0^2 = 2 g h$ brez korena. Hitrost je koren tega števila.
> Iz $h_\text{max} = \dfrac{v_0^2}{2g}$ sledi $v_0 = \sqrt{2 g h_\text{max}} = \sqrt{2 \cdot 9{,}81 \cdot 20{,}4} \approx 20\,\mathrm{m/s}$.

? Žogo vržemo navzgor z $v_0 = 10\,\mathrm{m/s}$. Katera tabela hitrosti ($g = 9{,}81\,\mathrm{m/s^2}$, os navzgor) ustreza časom $0$; $0{,}5$; $1{,}0$; $1{,}5\,\text{s}$?
- $10$; $5{,}1$; $0$; $0\,\mathrm{m/s}$
~ Ta tabela misli, da žoga v vrhu obstane. Pospešek je tudi v vrhu $g$, zato hitrost postane negativna.
- $10$; $14{,}9$; $19{,}8$; $24{,}7\,\mathrm{m/s}$
~ Tu je $g$ prištet ($v = v_0 + g t$). Pri osi navzgor pospešek kaže nasprotno od $v_0$.
+ $10$; $5{,}1$; $0{,}2$; $-4{,}7\,\mathrm{m/s}$
> Po $v = v_0 - g t$ se hitrost vsake pol sekunde zmanjša za $4{,}9\,\mathrm{m/s}$, tudi čez vrh. Minus pomeni, da žoga že pada.

? Telefon ti zdrsne z mize, visoke $0{,}8\,\text{m}$. Približno koliko časa imaš, da ga ujameš, preden pade na tla?
- približno $0{,}08\,\text{s}$
~ To je $\dfrac{h}{g}$: manjkata dvojka in koren. Čas je $t = \sqrt{\dfrac{2h}{g}}$.
- približno $0{,}16\,\text{s}$
~ To je $\dfrac{2h}{g}$ brez korena. Ta količnik ima enoto $\mathrm{s^2}$, čas je njegov koren.
+ približno $0{,}4\,\text{s}$
- približno $1\,\text{s}$
~ Zdi se dolgo, a pri višini mize je padec hitrejši. Celo z $1\,\text{m}$ višine traja le okoli $0{,}45\,\text{s}$.
> $t = \sqrt{\dfrac{2 \cdot 0{,}8}{9{,}81}} \approx 0{,}40\,\text{s}$. Zato telefona skoraj nikoli ne ujamemo: reakcijski čas je okoli $0{,}2\,\text{s}$.

:::simboli
g | težni pospešek | | m/s^2 | približno 9,81 m/s²
v | hitrost | v = v_0 - g\,t | m/s | pri prostem padu v = g t
v_0 | začetna hitrost | | m/s | pri prostem padu v₀ = 0
t | čas | | s
h | višina padca | h = \dfrac{g t^2}{2} | m | velja tudi v² = 2 g h
y | višina (lega na navpični osi) | y = v_0\,t - \frac{g\,t^2}{2} | m | pri metu os y kaže navzgor
y_0 | začetna višina | | m
t_{\text{vrh}} | čas vzpona do vrha | t_\text{vrh} = \dfrac{v_0}{g} | s | celoten let traja 2 t_vrh
h_{\text{max}} | največja višina | h_\text{max} = \dfrac{v_0^2}{2g} | m
:::
