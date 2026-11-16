---
stanje: osnutek
demo: delci
avtor: AI
---

## Zakaj se tega učimo

Med odmorom sošolec Tim razlaga: »Na Luni je ponoči $-170\,^\circ\mathrm{C}$. Če astronavt v lunini bazi pusti skodelico čaja na mizi, bo mraz od zunaj prišel v čaj in ga ohladil. Termometer v čaju pa pokaže, koliko toplote je v njem še ostalo.«

Zveni prepričljivo. A v Timovih besedah sta skriti **dve napaki**. Ko predelaš to lekcijo, ju boš znal najti in popraviti.

Vprašanje ni samo za šolske klopi. Inženirji morajo za vsako vesoljsko sondo vnaprej vedeti, kdaj se bo segrevala in kdaj ohlajala. Če se zmotijo, elektronika ponoči zmrzne ali se podnevi pregreje.

## Razlaga

**Temperatura in termometer.** Ko primeš skodelico, začutiš, ali je topla ali hladna. Roka pa je slab merilnik. Če si prej v rokah držal snežno kepo, se ti mlačna voda zdi vroča; če prideš iz vroče kopeli, se ti ista voda zdi hladna.

Zato uporabljamo **termometer**. Z njim merimo **temperaturo**, ki pove, kako toplo ali hladno je telo. Oznaka zanjo je $T$, enota pa **stopinja Celzija** ($^\circ\mathrm{C}$). Pri $0\,^\circ\mathrm{C}$ se led tali, pri $100\,^\circ\mathrm{C}$ voda vre. Temperature pod ničlo pišemo z minusom: v zamrzovalniku je okoli $-18\,^\circ\mathrm{C}$.

Pravilno merjenje ima tri korake:

1. Bučko termometra potopi v snov tako, da se ne dotika dna ali sten posode.
2. Počakaj, da se stolpec tekočine v termometru ustavi.
3. Odčitaj z očmi v višini vrha stolpca, medtem ko je termometer še v snovi.

**Kaj se dogaja v snovi.** Že veš, da je vsaka snov iz drobnih delcev, ki se ves čas gibljejo. Višja kot je temperatura, hitreje se gibljejo. V simulaciji spodaj (»Gibanje delcev in temperatura«) nastavi drsnik na $-170\,^\circ\mathrm{C}$, kot je ponoči na Luni, nato na $120\,^\circ\mathrm{C}$, kot je tam podnevi. Opazuj, kako se spremeni hitrost delcev.

**Štirje predmeti v lunini bazi.** Zrak v bazi ima stalno temperaturo $20\,^\circ\mathrm{C}$. Astronavti na mizo postavijo štiri predmete in jim merijo temperaturo:

| Predmet | Začetek | Čez nekaj ur |
|---|---|---|
| čaj | $80\,^\circ\mathrm{C}$ | $20\,^\circ\mathrm{C}$ |
| sladoled | $-10\,^\circ\mathrm{C}$ | $20\,^\circ\mathrm{C}$ |
| lunin kamen | $-150\,^\circ\mathrm{C}$ | $20\,^\circ\mathrm{C}$ |
| voda | $20\,^\circ\mathrm{C}$ | $20\,^\circ\mathrm{C}$ |

Preden bereš naprej, poišči, kaj je skupno vsem vrsticam. Topli čaj se je ohladil. Mrzli sladoled in še bolj mrzli kamen sta se segrela. Voda, ki je imela že na začetku temperaturo zraka, se ni spremenila. Na koncu imajo vsi predmeti enako temperaturo kot zrak.

:::premisli
Astronavt v bazo prinese kovinsko orodje, ki je ležalo zunaj na soncu in ima $90\,^\circ\mathrm{C}$. Pusti ga na mizi, zunaj pa pade noč z $-170\,^\circ\mathrm{C}$. Kakšno temperaturo bo imelo orodje čez nekaj ur? Se bo vmes segrevalo ali ohlajalo?
---
Ohlajalo se bo, dokler ne bo imelo $20\,^\circ\mathrm{C}$, toliko kot zrak v bazi. Toplejše od zraka se vedno ohladi do temperature zraka, nikoli pod njo. Mraz zunaj baze ne šteje, saj se orodje dotika le zraka v bazi.
:::

**Pravilo dobi ime.** Ko se dotikata telesi z različno temperaturo, med njima prehaja energija. Tej energiji rečemo **toplota**. Toplota sama od sebe vedno prehaja **s toplejšega telesa na hladnejše**.

Telo, ki toploto prejema, se **segreva**: njegova temperatura raste. Telo, ki toploto oddaja, se **ohlaja**: njegova temperatura pada. Ko imata telesi enako temperaturo, toplota ne prehaja več. Pravimo, da sta v **toplotnem ravnovesju**.

Zdaj vidiš tudi, zakaj moraš pri merjenju počakati. Termometer mora prejeti ali oddati toliko toplote, da ima enako temperaturo kot snov. Šele takrat kaže pravo vrednost.

**Ohlajanje na grafu.** Astronavt je čaj meril vsakih $5$ minut in meritve narisal:

:::risba graf
opis: Graf ohlajanja čaja v bazi. Vodoravna os je čas od 0 do 30 minut, navpična temperatura od 0 do 90 stopinj Celzija. Čaj ima ob 0 minutah 80 °C, ob 5 minutah 57 °C, ob 10 minutah 43 °C, ob 15 minutah 34 °C, ob 20 minutah 29 °C, ob 25 minutah 26 °C in ob 30 minutah 23 °C. Črtkana vodoravna črta pri 20 °C je temperatura zraka v bazi.
x: 0 .. 30 | 5 | t (min)
y: 0 .. 90 | 10 | T (°C)
črta: 0; 20 -> 30; 20 | črtkano siva
napis: 15; 14 | zrak v bazi: 20 °C | sredina | siva
črta: 0; 80 -> 5; 57 -> 10; 43 -> 15; 34 -> 20; 29 -> 25; 26 -> 30; 23 | modra debelo
točka: 0; 80 | 80 °C | desno | modra
točka: 5; 57 | 57 °C | desno | modra
točka: 10; 43 | 43 °C | nad | modra
točka: 15; 34 | | | modra
točka: 20; 29 | | | modra
točka: 25; 26 | | | modra
točka: 30; 23 | 23 °C | nad | modra
:::

V prvih $5$ minutah se je čaj ohladil za $23\,^\circ\mathrm{C}$, v zadnjih $5$ minutah le še za $3\,^\circ\mathrm{C}$. Dokler je razlika med čajem in zrakom velika, toplota odhaja hitro. Ko se razlika manjša, se ohlajanje upočasni. Pod $20\,^\circ\mathrm{C}$ čaj ne pade nikoli.

**Za koliko stopinj?** Kadar nas zanima, za koliko se je temperatura spremenila, od višje temperature odštejemo nižjo. Spremembo temperature označimo z $\Delta T$ (beri »delta te«):

$$\Delta T = T_\mathrm{v} - T_\mathrm{n}$$

Tu je $T_\mathrm{v}$ višja in $T_\mathrm{n}$ nižja temperatura. Zapis velja pri segrevanju in pri ohlajanju.

**Toplota ni isto kot temperatura.** Kad s $100$ litri vode in skodelica z $0{,}2$ litra vode imata lahko enako temperaturo, recimo $40\,^\circ\mathrm{C}$. A da kad segreješ z $20\,^\circ\mathrm{C}$ na $40\,^\circ\mathrm{C}$, potrebuješ veliko več toplote kot za skodelico. Več vode pomeni več delcev, ki jih je treba pospešiti. Termometer pa v obeh pokaže $40\,^\circ\mathrm{C}$: meri temperaturo, ne toplote.

**Mešanje vode.** V laboratoriju zmešamo enaki količini vode: eno s $60\,^\circ\mathrm{C}$ in eno z $20\,^\circ\mathrm{C}$. Topla voda odda toploto, hladna jo prejme. Zmes ima $40\,^\circ\mathrm{C}$, točno na sredini. Za enaki količini vode velja (če toplota ne uhaja v okolico):

$$T_\mathrm{zmesi} = \frac{T_1 + T_2}{2}$$

:::premisli
Zakaj zmes vode s $60\,^\circ\mathrm{C}$ in vode z $20\,^\circ\mathrm{C}$ nikakor ne more imeti $80\,^\circ\mathrm{C}$?
---
Toplota prehaja le s toplejše vode na hladnejšo. Topla voda pri tem izgublja toploto in se ohlaja, zato ne more postati toplejša od $60\,^\circ\mathrm{C}$. Hladna se segreva, a ne more prehiteti tople. Končna temperatura je vedno med obema začetnima.
:::

## Rešeni primeri

### Primer 1: juha na vesoljski postaji

Astronavt v grelniku segreje vrečko z juho. Na začetku ima juha $20\,^\circ\mathrm{C}$, po segrevanju $75\,^\circ\mathrm{C}$. Za koliko stopinj se je juha segrela?

**Podatki:** začetna temperatura $20\,^\circ\mathrm{C}$, končna temperatura $75\,^\circ\mathrm{C}$
**Iščemo:** spremembo temperature $\Delta T$

:::formula
$\Delta T = T_\mathrm{v} - T_\mathrm{n}$
:::

**Rešitev:**

1. Višja temperatura je končna: $T_\mathrm{v} = 75\,^\circ\mathrm{C}$. Nižja je začetna: $T_\mathrm{n} = 20\,^\circ\mathrm{C}$.
2. Odštejemo: $\Delta T = 75\,^\circ\mathrm{C} - 20\,^\circ\mathrm{C} = 55\,^\circ\mathrm{C}$.
3. Odgovor: juha se je segrela za $55\,^\circ\mathrm{C}$. Prejela je toploto od grelnika, ki je bil toplejši od nje.

### Primer 2: dan in noč na Marsu

Termometer na vozilu na Marsu je popoldne pokazal $15\,^\circ\mathrm{C}$, ponoči pa $-75\,^\circ\mathrm{C}$. Za koliko stopinj se je zrak ob vozilu ohladil čez noč?

**Podatki:** temperatura popoldne $15\,^\circ\mathrm{C}$, temperatura ponoči $-75\,^\circ\mathrm{C}$
**Iščemo:** spremembo temperature $\Delta T$

:::formula
$\Delta T = T_\mathrm{v} - T_\mathrm{n}$; ko gre temperatura čez ničlo, štejemo stopinje po delih: do $0\,^\circ\mathrm{C}$ in od $0\,^\circ\mathrm{C}$ naprej.
:::

**Rešitev:**

Termometer si predstavljaj kot številsko premico:

:::risba premica
opis: Lestvica termometra od minus 80 do 20 stopinj Celzija. Označeni sta nočna temperatura minus 75 °C in popoldanska 15 °C. Prvi skok gre od minus 75 do 0 in meri 75 stopinj, drugi od 0 do 15 in meri 15 stopinj.
od: -80
do: 20
korak: 10
točka: -75 | −75 °C
točka: 15 | 15 °C
skok: -75 -> 0 | 75
skok: 0 -> 15 | 15
:::

1. Od $-75\,^\circ\mathrm{C}$ do $0\,^\circ\mathrm{C}$ je $75$ stopinj, ker minus pove, koliko pod ničlo smo.
2. Od $0\,^\circ\mathrm{C}$ do $15\,^\circ\mathrm{C}$ je še $15$ stopinj.
3. Skupaj: $\Delta T = 75\,^\circ\mathrm{C} + 15\,^\circ\mathrm{C} = 90\,^\circ\mathrm{C}$.
4. Odgovor: čez noč se je zrak ob vozilu ohladil za $90\,^\circ\mathrm{C}$. Zato morajo imeti vozila na Marsu grelnike za baterije.

### Primer 3: kako hladna mora biti druga voda?

Astronavtka ima kozarec vode s $70\,^\circ\mathrm{C}$. Za pitje želi vodo s $40\,^\circ\mathrm{C}$, zato bo dolila **enako količino** hladnejše vode. Kolikšno temperaturo mora imeti dolita voda? Toplota naj ne uhaja v okolico.

**Podatki:** $T_1 = 70\,^\circ\mathrm{C}$, $T_\mathrm{zmesi} = 40\,^\circ\mathrm{C}$, količini vode sta enaki
**Iščemo:** temperaturo dolite vode $T_2$

:::formula
$T_\mathrm{zmesi} = \dfrac{T_1 + T_2}{2}$, zato je $T_1 + T_2 = 2 \cdot T_\mathrm{zmesi}$
:::

**Rešitev:**

1. Zmes je točno na sredini med $T_1$ in $T_2$, ker sta količini enaki.
2. Vsota obeh temperatur je dvakratnik temperature zmesi: $2 \cdot 40\,^\circ\mathrm{C} = 80\,^\circ\mathrm{C}$.
3. Od vsote odštejemo znano temperaturo: $T_2 = 80\,^\circ\mathrm{C} - 70\,^\circ\mathrm{C} = 10\,^\circ\mathrm{C}$.
4. Preverimo: $40\,^\circ\mathrm{C}$ je od $70\,^\circ\mathrm{C}$ oddaljeno $30$ stopinj, od $10\,^\circ\mathrm{C}$ prav tako $30$ stopinj.
5. Odgovor: doliti mora vodo z $10\,^\circ\mathrm{C}$.

### Primer 4: zdaj ti

V lunini bazi ima zrak $21\,^\circ\mathrm{C}$. Astronavt natoči čaj s $85\,^\circ\mathrm{C}$. Čez $10$ minut termometer v čaju kaže $65\,^\circ\mathrm{C}$. Za koliko stopinj se je čaj že ohladil? Za koliko stopinj se lahko ohladi še največ, če ga pusti na mizi?

**Podatki:** začetna temperatura čaja $85\,^\circ\mathrm{C}$, temperatura čez $10$ minut $65\,^\circ\mathrm{C}$, temperatura zraka $21\,^\circ\mathrm{C}$
**Iščemo:** dosedanjo spremembo temperature in največjo nadaljnjo spremembo

:::formula
$\Delta T = T_\mathrm{v} - T_\mathrm{n}$; čaj se ohlaja le do temperature zraka.
:::

**Rešitev:**

1. Dosedanje ohlajanje: višja je $85\,^\circ\mathrm{C}$, nižja $65\,^\circ\mathrm{C}$.
2. Nadaljnje ohlajanje se ustavi pri temperaturi zraka, torej je nižja temperatura $21\,^\circ\mathrm{C}$.
3. Izračunaj obe spremembi sam, nato preveri:

:::premisli
Za koliko stopinj se je čaj že ohladil in za koliko se lahko še?
---
Že se je ohladil za $85\,^\circ\mathrm{C} - 65\,^\circ\mathrm{C} = 20\,^\circ\mathrm{C}$. Še se lahko ohladi za $65\,^\circ\mathrm{C} - 21\,^\circ\mathrm{C} = 44\,^\circ\mathrm{C}$, ker se ustavi pri temperaturi zraka.
:::

## Pogoste napake

- **»Mraz prehaja v telo.«** Tim je mislil, da mraz z Lune vdre v čaj. Mraz ni snov in ne energija, zato ne more potovati. Čaj se ohladi, ker toplota **odhaja iz njega** v hladnejšo okolico.
- **»Termometer meri toploto.«** Termometer meri temperaturo. Kad in skodelica imata lahko enako temperaturo, a za enako segretje kad potrebuje veliko več toplote.
- **»Pri mešanju se temperature seštejejo.«** Kdor računa $20 + 60 = 80$, pozabi, da topla voda pri mešanju toploto oddaja. Končna temperatura je vedno med obema začetnima; pri enakih količinah na sredini.
- **Napačno štetje čez ničlo.** Med $-75\,^\circ\mathrm{C}$ in $15\,^\circ\mathrm{C}$ ni $60$ stopinj (to bi bilo $75 - 15$), ampak $90$. Štej po delih: do ničle in od ničle naprej.
- **Prezgodnje odčitavanje.** Če termometer vzameš iz snovi ali odčitaš, preden se stolpec ustavi, termometer še ni v toplotnem ravnovesju s snovjo in kaže napačno.

## Povzetek

- Temperatura $T$ pove, kako toplo ali hladno je telo. Merimo jo s termometrom v stopinjah Celzija ($^\circ\mathrm{C}$).
- Pri merjenju je bučka v snovi, počakamo, da se stolpec ustavi, in odčitamo v višini oči.
- Višja temperatura pomeni hitrejše gibanje delcev.
- Toplota je energija, ki sama od sebe prehaja s toplejšega telesa na hladnejše. Telo, ki jo prejema, se segreva; telo, ki jo oddaja, se ohlaja.
- Ko imata telesi enako temperaturo, sta v toplotnem ravnovesju in toplota ne prehaja več.
- Sprememba temperature: $\Delta T = T_\mathrm{v} - T_\mathrm{n}$. Čez ničlo štejemo po delih.
- Enaki količini vode zmešani: $T_\mathrm{zmesi} = \dfrac{T_1 + T_2}{2}$. Mraz ne prehaja; toplota ni temperatura.

## Drugače: Korak za korakom s številkami

Vsako nalogo o segrevanju, ohlajanju ali mešanju rešiš v štirih korakih.

1. **Izpiši temperature.** Na primer: voda $A$ ima $50\,^\circ\mathrm{C}$, voda $B$ $10\,^\circ\mathrm{C}$, količini sta enaki.
2. **Ugotovi smer toplote.** Toplota gre z $A$ na $B$, ker je $A$ toplejša. $A$ se bo ohlajala, $B$ segrevala.
3. **Izračunaj.** Zmes: $T_\mathrm{zmesi} = \dfrac{50 + 10}{2} = 30$, torej $30\,^\circ\mathrm{C}$. Voda $A$ se ohladi za $50 - 30 = 20$ stopinj, voda $B$ se segreje za $30 - 10 = 20$ stopinj.
4. **Preveri smiselnost.** Ali je rezultat med obema začetnima temperaturama? $30\,^\circ\mathrm{C}$ je med $10\,^\circ\mathrm{C}$ in $50\,^\circ\mathrm{C}$, torej da.

Pri enakih količinah vode se topla ohladi za toliko stopinj, za kolikor se hladna segreje. Toplota, ki jo ena odda, je enaka toploti, ki jo druga prejme.

## Drugače: Kot zgodba

Na Mednarodni vesoljski postaji živi skodelica čaja. Njeni delci so vroči in neučakani: vrtijo se in zaletavajo z vso silo. Okoli skodelice je zrak, katerega delci se gibljejo počasneje.

Kjer se čaj dotika stene skodelice in zraka, hitri delci čaja trkajo v počasnejše in jim pri tem predajo del svoje energije. Ta energija, ki potuje od hitrejših k počasnejšim, je toplota. Delci čaja se umirjajo, zrak okoli skodelice se malo segreje.

Nihče ne pošilja »mraza« v čaj. Zgodba gre vedno v eno smer: od vročega k hladnemu. Ko imajo delci čaja in delci zraka v povprečju enako energijo gibanja, se predajanje ustavi. Čaj in zrak imata zdaj enako temperaturo, in astronavt mora natočiti novega.

## Preveri se

? Katera trditev o toploti je pravilna?
- Mraz prehaja iz hladnejšega telesa v toplejše.
~ Mraz ni snov in ne energija, zato ne potuje. Toplejše telo se ohladi, ker toplota odhaja iz njega.
+ Toplota sama od sebe prehaja s toplejšega telesa na hladnejše.
- Termometer pokaže, koliko toplote je v telesu.
~ Termometer meri temperaturo. Kad in skodelica imata lahko enako temperaturo, toplote pa za segretje potrebujeta zelo različno.
- Toplota prehaja tudi med telesoma z enako temperaturo.
~ Pri enaki temperaturi sta telesi v toplotnem ravnovesju in toplota ne prehaja več.
> Toplota je energija, ki prehaja s toplejšega na hladnejše telo, dokler se temperaturi ne izenačita.

? Na Luni je podnevi do $120\,^\circ\mathrm{C}$, ponoči do $-170\,^\circ\mathrm{C}$. Za koliko stopinj se tla ohladijo od dneva do noči?
= 290 °C
~ 50 | Izračunal si $170 - 120$. Čez ničlo štej po delih: od $120$ do $0$ je $120$ stopinj, od $0$ do $-170$ še $170$.
~ -50 | Sprememba temperature je razlika med višjo in nižjo temperaturo, zato je pozitivna. Štej po delih čez ničlo.
> $120 + 170 = 290$, torej se tla ohladijo za $290\,^\circ\mathrm{C}$.

? Nika je rešila nalogo: »Zmešam enaki količini vode z $20\,^\circ\mathrm{C}$ in s $60\,^\circ\mathrm{C}$. Zmes ima $20 + 60 = 80\,^\circ\mathrm{C}$.« Kje je napaka?
- Napake ni, temperature se pri mešanju seštejejo.
~ Če bi se seštevale, bi bila zmes toplejša od tople vode. Topla voda pa toploto oddaja, zato se ohladi.
+ Topla voda toploto oddaja, hladna prejema, zato je zmes med njima: $40\,^\circ\mathrm{C}$.
- Prav bi bilo $60 - 20 = 40$, ker temperature odštejemo.
~ Rezultat se po naključju ujema, postopek pa ne. Razlika pove, za koliko sta se vodi razlikovali, ne temperature zmesi. Z vodama $30\,^\circ\mathrm{C}$ in $50\,^\circ\mathrm{C}$ bi dobil $20\,^\circ\mathrm{C}$ namesto $40\,^\circ\mathrm{C}$.
> Pri enakih količinah je zmes na sredini: $\dfrac{20 + 60}{2} = 40$, torej $40\,^\circ\mathrm{C}$.

? Astronavt je v isti bazi ohlajal dve posodi čaja z enako začetno temperaturo. Ena je bila majhna skodelica, druga velik vrč. Kateri graf pripada vrču?
:::risba graf
opis: Dva grafa ohlajanja od 80 °C. Graf A se spušča počasi: 80, 71, 63, 56, 51, 46 in 42 °C ob 0, 5, 10, 15, 20, 25 in 30 minutah. Graf B se spušča hitro: 80, 57, 43, 34, 29, 26 in 23 °C ob istih časih. Črtkana črta pri 20 °C je temperatura zraka.
x: 0 .. 30 | 5 | t (min)
y: 0 .. 90 | 10 | T (°C)
črta: 0; 20 -> 30; 20 | črtkano siva
črta: 0; 80 -> 5; 71 -> 10; 63 -> 15; 56 -> 20; 51 -> 25; 46 -> 30; 42 | modra debelo
napis: 30; 46 | A | levo | modra
črta: 0; 80 -> 5; 57 -> 10; 43 -> 15; 34 -> 20; 29 -> 25; 26 -> 30; 23 | oranžna črtkano
napis: 30; 27 | B | levo | oranžna
:::
- Graf B, ker vrč vsebuje več toplote in jo hitreje oddaja.
~ Več vode mora za enako ohladitev oddati več toplote, zato to traja dlje, ne manj časa.
+ Graf A, ker mora vrč za enako ohladitev oddati več toplote kot skodelica.
- Oba grafa sta za vrč enako primerna, saj je začetna temperatura enaka.
~ Enaka začetna temperatura ne pomeni enake toplote: količina vode je pomembna.
> Vrč ima več vode. Da se ohladi za isto število stopinj, mora oddati več toplote, zato se ohlaja počasneje (graf A).

? Pločevinko soka iz hladilnika ($5\,^\circ\mathrm{C}$) zjutraj pustiš na mizi v kuhinji, kjer je ves dan $22\,^\circ\mathrm{C}$. Kolikšno temperaturo ima sok popoldne?
= 22 °C | 0,5
~ 5 | Sok ne obdrži mraza. Iz toplejšega zraka prejema toploto, dokler nima njegove temperature.
~ 13,5 | Sredino dobiš le pri mešanju enakih količin. Zraka v kuhinji je ogromno, zato sok doseže temperaturo zraka.
~ 17 | To je za koliko se je sok segrel ($22 - 5$), ne njegova končna temperatura.
> Sok se segreva, dokler ni v toplotnem ravnovesju z zrakom: $22\,^\circ\mathrm{C}$.

<<RACUN
vrednost: 75-20 | 55
vrednost: 75+15 | 90
vrednost: 2*40 | 80
resi: (70+x)/2=40 | x | 10
vrednost: 85-65 | 20
vrednost: 65-21 | 44
vrednost: 80-57 | 23
vrednost: 26-23 | 3
vrednost: (20+60)/2 | 40
vrednost: (50+10)/2 | 30
vrednost: 120+170 | 290
vrednost: 22-5 | 17
>>

:::simboli
T | temperatura | | ^\circ\mathrm{C}
\Delta T | sprememba temperature | \Delta T = T_\mathrm{v} - T_\mathrm{n} | ^\circ\mathrm{C} | vedno višja minus nižja
T_\mathrm{v} | višja temperatura | | ^\circ\mathrm{C}
T_\mathrm{n} | nižja temperatura | | ^\circ\mathrm{C}
T_1 | temperatura prve vode pred mešanjem | | ^\circ\mathrm{C}
T_2 | temperatura druge vode pred mešanjem | | ^\circ\mathrm{C}
T_\mathrm{zmesi} | temperatura zmesi | T_\mathrm{zmesi} = \dfrac{T_1 + T_2}{2} | ^\circ\mathrm{C} | velja za enaki količini vode
:::
