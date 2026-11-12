---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sosed bo prekril streho vrtne ute. Streha ima obliko štiristrane piramide: spodaj je kvadrat s stranico $4\,\text{m}$, vrh je $1{,}5\,\text{m}$ višje. Kritina stane $15\,\text{€}$ za kvadratni meter. Koliko bo plačal?

Hiter odgovor bi bil $4 \cdot 4 = 16\,\text{m}^2$ in $16 \cdot 15 = 240\,\text{€}$. Toda $16\,\text{m}^2$ je ploščina tal pod streho. Kritina leži na štirih poševnih trikotnikih, ki so skupaj večji od tal. Za njihovo ploščino potrebuješ višino trikotnika, merjeno po strehi, ne navpične višine $1{,}5\,\text{m}$. Pri piramidi sta to dve različni višini, povezuje pa ju Pitagorov izrek.

Piramide so strehe stolpov in ut, šotori, okraski, sveče in egipčanske grobnice. Prizmo že poznaš, zato bomo piramido gradili iz razlik: kaj je pri njej drugače?

## Razlaga

**1. Od prizme do piramide.** Vzemi pokončno prizmo in njeno zgornjo osnovno ploskev skrči v eno točko. Stranski pravokotniki se zožijo v trikotnike, ki se stikajo v tej točki. Dobiš **piramido**.

Piramida je geometrijsko telo z eno **osnovno ploskvijo** (mnogokotnik) in **stranskimi ploskvami**, ki so trikotniki s skupnim ogliščem, **vrhom**. Stranice osnovne ploskve so **osnovni robovi**, daljice od oglišč osnovne ploskve do vrha pa **stranski robovi**. Vse stranske ploskve skupaj so **plašč**. Po osnovni ploskvi piramido poimenujemo tristrana, štiristrana, petstrana in tako naprej.

**2. Pravilna piramida.** Če je osnovna ploskev pravilni mnogokotnik in vrh leži točno nad njenim središčem, je piramida **pravilna**. Takrat so vse stranske ploskve skladni enakokraki trikotniki. Računamo s pravilnimi piramidami, največ s pravilno štiristrano: njena osnovna ploskev je kvadrat z robom $a$.

**3. Kaj je drugače kot pri prizmi.** Ista osnovna ploskev $O$ in ista višina $v$, a drugačno telo:

| Lastnost | Prizma | Piramida |
|---|---|---|
| osnovne ploskve | 2 | 1 |
| stranske ploskve | pravokotniki | trikotniki |
| višine | $v$ | $v$ in $v_s$ |
| plašč | $o \cdot v$ | $n \cdot \dfrac{a \cdot v_s}{2}$ |
| površina | $2O + \mathrm{pl}$ | $O + \mathrm{pl}$ |
| prostornina | $O \cdot v$ | $\dfrac{O \cdot v}{3}$ |

Tu je $n$ število stranskih ploskev, $v_s$ pa druga višina piramide, ki jo spoznaš v točki 4. Vsako vrstico pojasnimo v nadaljevanju.

**4. Dve višini.** Prizma ima eno višino, piramida pa dve, ki ju moramo ločiti:

- **višina piramide** $v$: razdalja od vrha do osnovne ploskve, merjena pravokotno nanjo (navpično navzdol),
- **višina stranske ploskve** $v_s$: višina stranskega trikotnika na osnovni rob; leži na poševni ploskvi.

Pravilno štiristrano piramido prerežemo navpično skozi vrh, vzporedno z enim osnovnim robom. Na prerezu vidimo enakokraki trikotnik, ki ga višina $v$ razpolovi:

:::risba skica
opis: Navpični prerez pravilne štiristrane piramide z osnovnim robom 6 in višino 4. Enakokraki trikotnik ima osnovnico 6 in vrh 4 enote nad njenim središčem. Navpična črtkana višina piramide 4, polovica osnovnega roba 3 in poševna višina stranske ploskve 5 tvorijo pravokotni trikotnik s pravim kotom pod vrhom.
območje: -1; -1,5 .. 8; 5
enota: 32
lik: 0; 0 -> 6; 0 -> 3; 4 | siva
črta: 3; 0 -> 3; 4 | modra | črtkano
črta: 3; 0 -> 6; 0 | oranžna | debelo
črta: 6; 0 -> 3; 4 | zelena | debelo
pravikot: 3; 0 | 3; 4 | 6; 0
napis: 3; 2 | v = 4 | levo
napis: 4,5; 0 | a/2 = 3 | pod
napis: 4,6; 2,2 | v_s = 5 | desno
napis: 3; 4 | vrh | nad
:::

V pravokotnem trikotniku sta kateti $v$ in polovica osnovnega roba $\dfrac{a}{2}$, hipotenuza pa je $v_s$:

$$v_s^2 = v^2 + \left(\frac{a}{2}\right)^2$$

Zato je pri pravilni piramidi $v_s$ vedno daljša od $v$. Na risbi je $v_s = \sqrt{16 + 9} = 5$.

Tudi **stranski rob** $s$ je hipotenuza. V stranski ploskvi višina $v_s$ in polovica osnovnega roba $\dfrac{a}{2}$ tvorita pravokotni trikotnik s hipotenuzo $s$, torej $s^2 = v_s^2 + \left(\dfrac{a}{2}\right)^2$. Pri piramidi z risbe je $s^2 = 25 + 9 = 34$ in $s \approx 5{,}8$.

**5. Plašč in površina.** Pri prizmi so stranske ploskve pravokotniki z višino $v$. Pri pravilni piramidi je plašč sestavljen iz $n$ skladnih trikotnikov z osnovnico $a$ in višino $v_s$:

$$\mathrm{pl} = n \cdot \frac{a \cdot v_s}{2}$$

Pri štiristrani piramidi je $n = 4$, zato $\mathrm{pl} = 2 a v_s$. Ker je $n \cdot a$ obseg osnovne ploskve $o$, je plašč tudi $\dfrac{o \cdot v_s}{2}$: trikotnik je pol pravokotnika z isto osnovnico in višino.

Druga razlika: osnovna ploskev je le ena, zato

$$P = O + \mathrm{pl}$$

:::premisli
Vrni se k uti iz uvoda ($a = 4\,\text{m}$, $v = 1{,}5\,\text{m}$, kritina $15\,\text{€}$ za $\text{m}^2$). Najprej napovej: bo streha večja ali manjša od $16\,\text{m}^2$ tal? Nato izračunaj ceno kritine.
---
Večja. Tla lahko razdelimo na štiri trikotnike z vrhom v središču kvadrata in višino $\dfrac{a}{2} = 2\,\text{m}$. Trikotniki strehe imajo enake osnovnice, a višino $v_s$, ki je kot hipotenuza daljša od $2\,\text{m}$. Račun: $v_s = \sqrt{1{,}5^2 + 2^2} = \sqrt{6{,}25} = 2{,}5\,\text{m}$, $\mathrm{pl} = 4 \cdot \dfrac{4 \cdot 2{,}5}{2} = 20\,\text{m}^2$. Kritina stane $20 \cdot 15 = 300\,\text{€}$, ne $240\,\text{€}$.
:::

**6. Prostornina.** Pri prizmi je $V = O \cdot v$. Piramida z isto osnovno ploskvijo in višino se proti vrhu zoži, zato je v njej manj prostora. Koliko manj?

:::premisli
Imaš votlo piramido in votlo prizmo z enako osnovno ploskvijo in enako višino. Piramido napolniš z mivko in jo stresaš v prizmo. Napovej: kolikokrat moraš to ponoviti, da je prizma polna?
---
Natanko trikrat. Kdor reče »dvakrat«, misli na trikotnik, ki je pol pravokotnika. Piramida pa se zoži v dveh smereh hkrati, v širino in v globino, zato je v njej le tretjina prostora prizme.
:::

Prostornina piramide je tretjina prostornine prizme z isto osnovno ploskvijo in višino:

$$V = \frac{O \cdot v}{3}$$

To velja za vsako piramido, ne le za pravilno. V formuli je višina piramide $v$, nikoli $v_s$.

## Rešeni primeri

### Primer 1: sveča (lažji)

Pri krožku vlivate sveče v obliki pravilne štiristrane piramide z osnovnim robom $6\,\text{cm}$ in višino $4\,\text{cm}$. Koliko voska potrebuješ za eno svečo in koliko papirja za ovoj, ki pokrije vse ploskve?

**Podatki:** $a = 6\,\text{cm}$, $v = 4\,\text{cm}$
**Iščemo:** prostornino $V$ in površino $P$

:::formula
$O = a^2$, $V = \dfrac{O \cdot v}{3}$, $v_s^2 = v^2 + \left(\dfrac{a}{2}\right)^2$, $\mathrm{pl} = 4 \cdot \dfrac{a \cdot v_s}{2}$, $P = O + \mathrm{pl}$
:::

**Rešitev:**

1. **Osnovna ploskev:** $O = a^2 = 6^2 = 36\,\text{cm}^2$.
2. **Prostornina:** $V = \dfrac{O \cdot v}{3} = \dfrac{36 \cdot 4}{3} = 48\,\text{cm}^3$.
3. **Za plašč potrebujemo $v_s$**, ki ni podan. Pitagorov izrek v trikotniku s katetama $v = 4\,\text{cm}$ in $\dfrac{a}{2} = 3\,\text{cm}$: $v_s^2 = 16 + 9 = 25$, torej $v_s = 5\,\text{cm}$.
4. **Plašč:** $\mathrm{pl} = 4 \cdot \dfrac{6 \cdot 5}{2} = 60\,\text{cm}^2$.
5. **Površina:** $P = O + \mathrm{pl} = 36 + 60 = 96\,\text{cm}^2$.
6. **Smiselnost:** $v_s = 5\,\text{cm} > v = 4\,\text{cm}$, kot mora biti.
7. Odgovor: za svečo potrebuješ $48\,\text{cm}^3$ voska, za ovoj $96\,\text{cm}^2$ papirja.

### Primer 2: model iz kartona

Za razstavo sestaviš votel model pravilne štiristrane piramide. Osnovni rob meri $10\,\text{cm}$, višina stranske ploskve $13\,\text{cm}$. Kako visok bo model in koliko mivke gre vanj?

**Podatki:** $a = 10\,\text{cm}$, $v_s = 13\,\text{cm}$
**Iščemo:** višino piramide $v$ in prostornino $V$

:::formula
$v^2 = v_s^2 - \left(\dfrac{a}{2}\right)^2$, $V = \dfrac{O \cdot v}{3}$
:::

**Rešitev:**

1. **Kaj je hipotenuza?** Višina piramide $v$ je kateta, $v_s$ pa hipotenuza trikotnika s katetama $v$ in $\dfrac{a}{2}$. Ker iščemo kateto, odštevamo.
2. $\dfrac{a}{2} = 5\,\text{cm}$, zato $v^2 = 13^2 - 5^2 = 169 - 25 = 144$ in $v = 12\,\text{cm}$.
3. **Osnovna ploskev:** $O = 10^2 = 100\,\text{cm}^2$.
4. **Prostornina:** $V = \dfrac{100 \cdot 12}{3} = 400\,\text{cm}^3$.
5. Odgovor: model bo visok $12\,\text{cm}$, vanj gre $400\,\text{cm}^3$ mivke.

### Primer 3: lesena piramida po naročilu (težji, zadnja koraka naredi sam)

Stranka naroči pri mizarju leseno pravilno štiristrano piramido z osnovnim robom $8\,\text{cm}$ in prostornino $64\,\text{cm}^3$. Višine ni povedala. Koliko $\text{cm}^2$ bo mizar polakiral, če laka vse ploskve?

**Podatki:** $a = 8\,\text{cm}$, $V = 64\,\text{cm}^3$
**Iščemo:** površino $P$

:::formula
$v = \dfrac{3V}{O}$, $v_s^2 = v^2 + \left(\dfrac{a}{2}\right)^2$, $P = O + 4 \cdot \dfrac{a \cdot v_s}{2}$
:::

**Rešitev:**

1. **Osnovna ploskev:** $O = 8^2 = 64\,\text{cm}^2$.
2. **Višina iz prostornine.** Formulo $V = \dfrac{O \cdot v}{3}$ obrnemo: $v = \dfrac{3V}{O} = \dfrac{3 \cdot 64}{64} = 3\,\text{cm}$.
3. **Višina stranske ploskve.** Polovica osnovnega roba je $4\,\text{cm}$, zato $v_s^2 = 3^2 + 4^2 = 25$ in $v_s = 5\,\text{cm}$.
4. Izračunaj sam plašč in površino:

:::premisli
Koliko sta plašč in površina piramide?
---
$\mathrm{pl} = 4 \cdot \dfrac{8 \cdot 5}{2} = 80\,\text{cm}^2$, $P = 64 + 80 = 144\,\text{cm}^2$. Mizar bo polakiral $144\,\text{cm}^2$.
:::

## Pogoste napake

- **Pozabljena tretjina.** »Piramida ima isto osnovno ploskev in višino kot prizma, torej isto prostornino.« Piramida se proti vrhu zoži; prizmo napolnijo šele tri take piramide. Prostornina je $\dfrac{O \cdot v}{3}$; preveri, da je manjša od $O \cdot v$.
- **Polovica namesto tretjine.** »Trikotnik je pol pravokotnika, torej je piramida pol prizme.« Trikotnik se zoži v eni smeri, piramida v dveh. Deli s $3$, ne z $2$.
- **Zamenjava višin.** Kdor za plašč vzame $v$, dobi premajhen plašč; kdor za prostornino vzame $v_s$, preveliko prostornino. Stranski trikotniki imajo višino $v_s$, prostornina pa potrebuje višino piramide $v$.
- **Cel rob ali seštevanje v Pitagorovem izreku.** V trikotniku $v$, $\dfrac{a}{2}$, $v_s$ nastopa **polovica** osnovnega roba, ne cel rob $a$. Stranic tudi ne seštevaš: $v_s \ne v + \dfrac{a}{2}$ (napačno), ampak $v_s^2 = v^2 + \left(\dfrac{a}{2}\right)^2$.
- **Plašč kot pri prizmi.** Stranska ploskev je trikotnik, zato ima ploščino $\dfrac{a \cdot v_s}{2}$, ne $a \cdot v_s$. Pazi tudi, kaj naloga sprašuje: streha ali odprt lampion je samo plašč, ovoj vseh ploskev je površina $P = O + \mathrm{pl}$.

## Povzetek

- Piramida ima eno osnovno ploskev in stranske ploskve (trikotnike), ki se stikajo v vrhu. Vse stranske ploskve skupaj so plašč.
- Pri pravilni piramidi je osnovna ploskev pravilni mnogokotnik, vrh pa je nad njenim središčem; stranske ploskve so skladni enakokraki trikotniki.
- Višina piramide $v$ je pravokotna na osnovno ploskev, višina stranske ploskve $v_s$ je višina stranskega trikotnika.
- Pri pravilni štiristrani piramidi: $v_s^2 = v^2 + \left(\dfrac{a}{2}\right)^2$ in $s^2 = v_s^2 + \left(\dfrac{a}{2}\right)^2$.
- Plašč pravilne piramide $\mathrm{pl} = n \cdot \dfrac{a \cdot v_s}{2}$, površina $P = O + \mathrm{pl}$.
- Prostornina $V = \dfrac{O \cdot v}{3}$: tretjina prizme z isto osnovno ploskvijo in višino.

## Drugače: Na sliki

Piramido razreži po stranskih robovih in jo razgrni. Dobiš kvadrat, okoli njega pa štiri skladne trikotnike:

:::risba skica
opis: Mreža pravilne štiristrane piramide z osnovnim robom 6 in višino stranske ploskve 5. V sredini je kvadrat s stranico 6, na vsaki njegovi stranici je enakokraki trikotnik z osnovnico 6 in višino 5. Vsak trikotnik ima ploščino 15.
območje: -5,5; -5,5 .. 11,5; 11,5
enota: 18
pravokotnik: 0; 0 .. 6; 6 | modra
lik: 0; 6 -> 6; 6 -> 3; 11 | oranžna
lik: 0; 0 -> 6; 0 -> 3; -5 | oranžna
lik: 0; 0 -> 0; 6 -> -5; 3 | oranžna
lik: 6; 0 -> 6; 6 -> 11; 3 | oranžna
črta: 3; 6 -> 3; 11 | siva | črtkano
napis: 3; 3 | O = 36 | sredina
napis: 3; 8,5 | v_s = 5 | desno
napis: 3; -2 | 15 | sredina
napis: -2; 3 | 15 | sredina
napis: 8; 3 | 15 | sredina
:::

Plašč so štirje trikotniki, vsak ima osnovnico $a$ in višino $v_s$. Na risbi je plašč $4 \cdot 15 = 60$, površina pa $36 + 60 = 96$.

Višino piramide $v$ pa najdeš v telesu, ne v mreži. Piramido si predstavljaj prerezano navpično skozi vrh, vzporedno z osnovnim robom. Polovica prereza je pravokotni trikotnik:

- ena kateta je **višina piramide** $v$ (navpična),
- druga kateta je **polovica osnovnega roba** $\dfrac{a}{2}$ (po tleh, od središča do roba),
- hipotenuza je **višina stranske ploskve** $v_s$ (po poševni ploskvi).

## Drugače: Iz vsakdanjega življenja

V trgovini prodajajo čaj v dveh prozornih darilnih škatlah. Ena ima obliko štiristrane prizme, druga obliko štiristrane piramide z enako osnovno ploskvijo in enako višino. Prizma stane $6\,\text{€}$, piramida $3\,\text{€}$.

Na prvi pogled je piramida za pol cene, torej enako ugodna. A čaja je v njej le tretjina toliko kot v prizmi. Za toliko čaja, kot ga je v eni prizmi, bi kupil tri piramide in plačal $9\,\text{€}$. Prizma je ugodnejša.

Pri streharju je obratno: zanima ga plašč, ne prostornina. Za streho meri $v_s$ po strehi od žleba do vrha po sredini strešine, ker kritina leži na poševnih ploskvah. Tla podstrešja pri tem ne štejejo.

## Drugače: Bolj natančno

**Zakaj je prostornina tretjina?** Vzemimo kocko z robom $a$ in njeno središče. Če središče povežemo z vsemi oglišči, kocka razpade na **šest skladnih štiristranih piramid**. Vsaka ima za osnovno ploskev eno ploskev kocke ($O = a^2$), njena višina pa je razdalja od središča do te ploskve, torej $\dfrac{a}{2}$.

Šest piramid skupaj da kocko, zato je prostornina ene piramide

$$V = \frac{a^3}{6}.$$

Preverimo formulo $V = \dfrac{O \cdot v}{3}$:

$$\frac{a^2 \cdot \frac{a}{2}}{3} = \frac{a^3}{6}.$$

Ujema se. To je preverjanje za poseben primer. Splošno velja, da je prostornina vsake piramide tretjina prostornine prizme z isto osnovno ploskvijo in višino. Dokaz za splošno piramido presega osnovno šolo.

**Zakaj je ploščina stranskega trikotnika $\dfrac{a \cdot v_s}{2}$?** Ker je to ploščina trikotnika z osnovnico $a$ in pripadajočo višino $v_s$ (višina je pravokotna na osnovni rob).

## Preveri se

? Prizma in piramida imata enako osnovno ploskev $O = 36\,\text{cm}^2$ in enako višino $v = 4\,\text{cm}$. Kateri par (prostornina prizme; prostornina piramide) je pravilen?
- $144\,\text{cm}^3$; $144\,\text{cm}^3$
~ Isti $O$ in $v$ ne pomenita iste prostornine. Piramida se proti vrhu zoži.
- $144\,\text{cm}^3$; $72\,\text{cm}^3$
~ Piramida ni pol prizme, kot je trikotnik pol pravokotnika. Prizmo napolnijo tri piramide.
+ $144\,\text{cm}^3$; $48\,\text{cm}^3$
- $48\,\text{cm}^3$; $144\,\text{cm}^3$
~ Vrednosti sta zamenjani. Prizma je večja: $V = O \cdot v$, piramida ima tretjino tega.
> Prizma: $36 \cdot 4 = 144\,\text{cm}^3$. Piramida: $\dfrac{144}{3} = 48\,\text{cm}^3$.

? Keopsova piramida v Egiptu je pravilna štiristrana piramida z osnovnim robom približno $230\,\text{m}$; danes je visoka približno $140\,\text{m}$. Približno kolikšna je njena prostornina?
- približno $7{,}4$ milijona $\text{m}^3$
~ To je prostornina prizme. Pozabil si deliti s $3$.
- približno $11\,000\,\text{m}^3$
~ Množil si rob $a$ namesto ploščine $a^2$. Osnovna ploskev je kvadrat.
+ približno $2{,}5$ milijona $\text{m}^3$
- približno $3{,}7$ milijona $\text{m}^3$
~ To je polovica prizme. Piramida je tretjina, ne polovica.
> $230^2 \approx 53\,000$, $53\,000 \cdot 140 = 7\,420\,000$, tretjina tega je približno $2{,}5$ milijona $\text{m}^3$.

? Pri pravilni štiristrani piramidi je višina stranske ploskve $v_s$ vedno daljša od višine piramide $v$. Zakaj?
- Ker je $v_s = v + \dfrac{a}{2}$.
~ Stranic pravokotnega trikotnika ne seštevamo. Velja $v_s^2 = v^2 + \left(\dfrac{a}{2}\right)^2$, zato je $v_s$ manjša od vsote $v + \dfrac{a}{2}$.
+ Ker je $v_s$ hipotenuza pravokotnega trikotnika s katetama $v$ in $\dfrac{a}{2}$.
- Ker $v_s$ meri od vrha do oglišča osnovne ploskve.
~ Od vrha do oglišča meri stranski rob $s$. Višina $v_s$ meri od vrha do razpolovišča osnovnega roba.
> V pravokotnem trikotniku je hipotenuza daljša od vsake katete, $v$ pa je kateta.

? Pravilna štiristrana piramida z osnovnim robom $6\,\text{cm}$ ima prostornino $96\,\text{cm}^3$. Kolikšna je njena višina?
- približno $2{,}7\,\text{cm}$
~ Delil si $96 : 36$ in pozabil na tretjino. Iz $V = \dfrac{O \cdot v}{3}$ sledi $v = \dfrac{3V}{O}$.
- $16\,\text{cm}$
~ Izračunal si $96 : 6$: delil si z robom $a$ in pozabil na trojko. Pravilno je $v = \dfrac{3V}{O}$ s ploščino $O = 36\,\text{cm}^2$.
+ $8\,\text{cm}$
> $O = 36\,\text{cm}^2$, $v = \dfrac{3V}{O} = \dfrac{3 \cdot 96}{36} = 8\,\text{cm}$.

? Iz kartona izdeluješ lampion v obliki pravilne štiristrane piramide, ki je spodaj odprt (brez osnovne ploskve). Osnovni rob je $10\,\text{cm}$, višina piramide $12\,\text{cm}$. Koliko kartona potrebuješ (brez zavihkov)?
- $240\,\text{cm}^2$
~ Za višino trikotnikov si vzel višino piramide $v$. Stranski trikotniki imajo višino $v_s$.
- $360\,\text{cm}^2$
~ Prištel si osnovno ploskev $100\,\text{cm}^2$, lampion pa je spodaj odprt. Potrebuješ samo plašč.
+ $260\,\text{cm}^2$
- $520\,\text{cm}^2$
~ Pozabil si deliti z $2$: stranska ploskev je trikotnik, ne pravokotnik.
> $v_s = \sqrt{12^2 + 5^2} = 13\,\text{cm}$, $\mathrm{pl} = 4 \cdot \dfrac{10 \cdot 13}{2} = 260\,\text{cm}^2$.

:::simboli
P | površina piramide | P = O + \mathrm{pl} | |
O | ploščina osnovne ploskve | | | pri štiristrani piramidi $O = a^2$
\mathrm{pl} | ploščina plašča | \mathrm{pl} = n \cdot \frac{a \cdot v_s}{2} | | velja za pravilno piramido
n | število stranskih ploskev | | | pri štiristrani piramidi $n = 4$
a | osnovni rob | | |
v_s | višina stranske ploskve | v_s^2 = v^2 + \left(\frac{a}{2}\right)^2 | | vedno večja od višine piramide
V | prostornina piramide | V = \frac{O \cdot v}{3} | |
v | višina piramide | v = \frac{3V}{O} | | razdalja od vrha do osnovne ploskve
s | stranski rob | s^2 = v_s^2 + \left(\frac{a}{2}\right)^2 | | od vrha do oglišča osnovne ploskve
o | obseg osnovne ploskve | o = n \cdot a | |
:::
