---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. Trije prizori iz narave:

- **A.** Ves dan piha močan veter v velik balvan na pobočju. Balvan se ne premakne niti za milimeter.
- **B.** Sunek vetra potisne suh list $2\,\mathrm{m}$ daleč po pločniku.
- **C.** Štorklja nese vejo za gnezdo vodoravno nad travnikom. Vejo drži v kljunu, da ne pade, in z njo preleti $100\,\mathrm{m}$.

V katerem prizoru sila na balvan, list ali vejo opravi **delo**? V vsakdanjem govoru bi rekli, da se najbolj »trudi« veter pri balvanu. Fizika pa ima za delo natančno pravilo, in to pravilo da drugačen odgovor. Zapiši si svojega, preden bereš naprej.

Delo je tudi most do energije. Z njim bomo kmalu razložili, zakaj ima kamen na vrhu pečine energijo in kam gre ta energija, ko pade.

## Razlaga

**1. Nekaj primerov.** Bober vleče debla po bregu do vode. Eno deblo vleče s silo $50\,\mathrm{N}$. Primerjajmo štiri vlečenja in ocenimo, koliko »dela« je v vsakem:

| primer | $F$ [N] | $s$ [m] | koliko dela |
|---|---|---|---|
| eno deblo | 50 | 10 | osnova |
| dve debli | 100 | 10 | dvakrat toliko |
| eno deblo, dlje | 50 | 20 | dvakrat toliko |
| dve debli, dlje | 100 | 20 | ? |

Dve debli na isti razdalji sta kot dvakrat po eno deblo. Eno deblo na dvakrat daljši poti je kot dve vlečenji drugo za drugim. Delo torej raste s silo in raste s potjo.

:::premisli
Kolikokrat več dela kot pri »osnovi« opravi bober v zadnji vrstici? Napovej, preden bereš dalje.
---
Štirikrat več. Sila je dvakrat večja in pot dvakrat daljša, $2 \cdot 2 = 4$. Delo raste kot zmnožek sile in poti.
:::

**2. Pravilo.** Vzorec iz tabele zapišemo z enačbo. Če na telo deluje stalna sila $F$ v smeri gibanja in telo prepotuje pot $s$, je **delo** te sile

$$A = F \cdot s$$

Za bobra: $A = 50\,\mathrm{N} \cdot 10\,\mathrm{m} = 500\,\mathrm{N\,m}$, v zadnji vrstici pa $100 \cdot 20 = 2000\,\mathrm{N\,m}$, res štirikrat več.

**3. Enota.** Enota za delo je **joule** ($\mathrm{J}$), izgovorimo »džul«:

$$1\,\mathrm{J} = 1\,\mathrm{N} \cdot 1\,\mathrm{m}$$

Delo $1\,\mathrm{J}$ opravi sila $1\,\mathrm{N}$, ko telo premakne za $1\,\mathrm{m}$ v svoji smeri. To je približno delo, ko jabolko ($1\,\mathrm{N}$) dvigneš za meter. Večja dela pišemo v kilojoulih: $1\,\mathrm{kJ} = 1000\,\mathrm{J}$.

**4. Kdaj je delo nič.** Zdaj lahko rešiš uganko z začetka.

:::premisli
V katerem prizoru iz uganke je delo enako nič in zakaj? Pomagaj si s $F$ in $s$ v pravilu.
---
V prizoru A, ker je pot balvana $s = 0$, in v prizoru C, ker sila, s katero štorklja drži vejo, kaže navzgor, veja pa se premika vodoravno. Delo opravi le veter v prizoru B: sila in premik lista kažeta v isto smer.
:::

- Če se telo ne premakne ($s = 0$), je $A = 0$, ne glede na to, kako velika je sila.
- Če je sila **pravokotna** na smer gibanja, ne opravi dela. Štorklja vejo drži navzgor, premika pa jo vodoravno. Ta sila vejo le drži, da ne pade, ne pomika pa je naprej.

V simulaciji spodaj »Delo sile« pusti silo in pot enaki, kot med silo in smerjo premika pa nastavi najprej na $0°$, nato na $90°$. Opazi, kako delo pade na nič. Pri vmesnih kotih je delo manjše, ker vleče naprej le del sile.

**5. Dviganje.** Ko telo dvigamo enakomerno (s stalno hitrostjo), mora sila navzgor uravnotežiti njegovo težo $F_g = m \cdot g$, kjer je $g \approx 10\,\mathrm{\frac{N}{kg}}$. Pot v smeri sile je višina dviga $h$, zato

$$A = F_g \cdot h$$

V enačbo gre teža v newtonih, ne masa v kilogramih. Delo proti teži je odvisno le od višine: veverica, ki spleza na isto vejo po ovinkih ali naravnost, opravi proti teži enako delo.

**6. Enote pred računom.** Silo zapiši v $\mathrm{N}$, pot v $\mathrm{m}$, maso v $\mathrm{kg}$. Na primer $250\,\mathrm{cm} = 2{,}5\,\mathrm{m}$ in $400\,\mathrm{g} = 0{,}4\,\mathrm{kg}$. Le tako dobiš delo v joulih.

## Rešeni primeri

### Primer 1: veter in jadrnica (lažji)

Veter potiska jadrnico na jezeru s stalno silo $200\,\mathrm{N}$ v smeri gibanja. Jadrnica prepluje $50\,\mathrm{m}$. Koliko dela opravi sila vetra?

**Podatki:** $F = 200\,\mathrm{N}$ (stalna, v smeri gibanja), $s = 50\,\mathrm{m}$
**Iščemo:** delo $A$

:::formula
$A = F \cdot s$
:::

**Rešitev:**

1. Sila in premik kažeta v isto smer, zato velja $A = F \cdot s$.
2. Vstavimo: $A = 200\,\mathrm{N} \cdot 50\,\mathrm{m} = 10\,000\,\mathrm{J}$.
3. Velika števila zapišemo krajše: $10\,000\,\mathrm{J} = 10\,\mathrm{kJ}$, ker je $1\,\mathrm{kJ} = 1000\,\mathrm{J}$.
4. Odgovor: sila vetra opravi $10\,\mathrm{kJ}$ dela.

### Primer 2: veverica na drevesu

Veverica z maso $400\,\mathrm{g}$ enakomerno spleza na vejo, ki je $5\,\mathrm{m}$ nad tlemi. Koliko dela opravi proti svoji teži? Vzemi $g = 10\,\mathrm{\frac{N}{kg}}$.

**Podatki:** $m = 400\,\mathrm{g}$, $h = 5\,\mathrm{m}$, $g = 10\,\mathrm{\frac{N}{kg}}$, plezanje je enakomerno
**Iščemo:** delo $A$

:::formula
Teža: $F_g = m \cdot g$, nato $A = F_g \cdot h$
:::

**Rešitev:**

1. Maso pretvorimo v kilograme, ker je $g$ v $\mathrm{\frac{N}{kg}}$: $m = 0{,}4\,\mathrm{kg}$.
2. Pri enakomernem plezanju je sila navzgor enaka teži: $F_g = 0{,}4 \cdot 10 = 4\,\mathrm{N}$.
3. Pot v smeri te sile je višina: $A = 4\,\mathrm{N} \cdot 5\,\mathrm{m} = 20\,\mathrm{J}$.
4. Odgovor: veverica proti teži opravi $20\,\mathrm{J}$ dela.

### Primer 3: nevihta na terasi (težji)

Med nevihto veter s stalno silo potisne vrtni stol $250\,\mathrm{cm}$ daleč po terasi in pri tem opravi $90\,\mathrm{J}$ dela. S kolikšno silo je veter potiskal stol v smeri gibanja?

**Podatki:** $s = 250\,\mathrm{cm}$, $A = 90\,\mathrm{J}$, sila je stalna in kaže v smeri gibanja
**Iščemo:** silo $F$

:::formula
Iz $A = F \cdot s$ sledi $F = \dfrac{A}{s}$
:::

**Rešitev:**

1. Pot pretvorimo v metre, da bo sila v newtonih: $s = 2{,}5\,\mathrm{m}$.
2. Iščemo silo, zato enačbo delimo s $s$: $F = \dfrac{A}{s}$.
3. Vstavimo: $F = \dfrac{90}{2{,}5} = 36\,\mathrm{N}$.
4. Preverimo: $36 \cdot 2{,}5 = 90$, delo je res $90\,\mathrm{J}$. ✓
5. Odgovor: veter je stol potiskal s silo $36\,\mathrm{N}$.

### Primer 4: zdaj ti – zrno toče

Zrno toče z maso $10\,\mathrm{g}$ pade iz oblaka z višine $2\,\mathrm{km}$. Koliko dela na tej poti opravi njegova teža? Vzemi $g = 10\,\mathrm{\frac{N}{kg}}$.

**Podatki:** $m = 10\,\mathrm{g}$, $h = 2\,\mathrm{km}$, $g = 10\,\mathrm{\frac{N}{kg}}$
**Iščemo:** delo teže $A$

:::formula
$F_g = m \cdot g$, nato $A = F_g \cdot h$
:::

**Rešitev:**

1. Pretvorimo enote: $m = 0{,}01\,\mathrm{kg}$, $h = 2000\,\mathrm{m}$.
2. Teža kaže navzdol, zrno se giblje navzdol, zato teža opravlja delo. Teža zrna: $F_g = 0{,}01 \cdot 10 = 0{,}1\,\mathrm{N}$.
3. Odloči, katero pot vstaviš, in izračunaj delo sam, nato preveri:

:::premisli
Koliko dela opravi teža zrna na vsej poti od oblaka do tal?
---
$A = 200\,\mathrm{J}$. Majhna sila na zelo dolgi poti opravi kar veliko dela.
:::

## Pogoste napake

- **Pot v centimetrih.** »$90\,\mathrm{J} : 250 = 0{,}36\,\mathrm{N}$.« Joule je newton krat **meter**, zato pot v centimetrih da stokrat premajhen rezultat. Najprej pretvori: $250\,\mathrm{cm} = 2{,}5\,\mathrm{m}$.
- **Masa namesto teže.** »Dvignem $2\,\mathrm{kg}$ za $3\,\mathrm{m}$, delo je $6\,\mathrm{J}$.« V $A = F \cdot s$ je sila v newtonih, masa pa ni sila. Najprej $F_g = m \cdot g = 20\,\mathrm{N}$, nato $A = 60\,\mathrm{J}$.
- **»Trudim se, torej delam.«** Kdor potiska zid ali drži težko vejo, se utrudi. Mišice res porabljajo energijo, a na zidu ali veji sila ne opravi dela, ker je $s = 0$.
- **Pot, ki ni v smeri sile.** »Nesem vedro vode $100\,\mathrm{m}$ po ravnem, delo je teža krat $100\,\mathrm{m}$.« Sila drže kaže navzgor, premik je vodoraven, zato je to delo nič. Šteje le pot v smeri sile.
- **Napačna enota.** »Delo je $120\,\mathrm{N}$.« Newton je enota sile. Delo je sila krat pot, zato $\mathrm{N} \cdot \mathrm{m} = \mathrm{J}$.

## Povzetek

- Sila opravi delo, ko telo premakne v svoji smeri.
- Za stalno silo v smeri gibanja: $A = F \cdot s$; obrnjeno $F = A/s$, $s = A/F$.
- Enota je joule: $1\,\mathrm{J} = 1\,\mathrm{N} \cdot 1\,\mathrm{m}$; $1\,\mathrm{kJ} = 1000\,\mathrm{J}$.
- Delo je nič, če je $s = 0$ ali če je sila pravokotna na gibanje.
- Pri enakomernem dviganju: $F_g = m \cdot g$ in $s = h$, torej $A = m \cdot g \cdot h$.
- Pred računom pretvori v $\mathrm{N}$, $\mathrm{m}$ in $\mathrm{kg}$.

## Drugače: Korak za korakom s številkami

Recept:

1. Izpiši podatke in jih pretvori v $\mathrm{N}$, $\mathrm{m}$ in $\mathrm{kg}$.
2. Preveri, ali sila kaže v smeri gibanja. Če je pravokotna ali se telo ne premakne, je $A = 0$.
3. Če je dana masa, izračunaj težo: $F_g = m \cdot g$.
4. Uporabi $A = F \cdot s$ (ali obrnjeno $F = \dfrac{A}{s}$, $s = \dfrac{A}{F}$).
5. Zapiši rezultat v $\mathrm{J}$ (ali $\mathrm{kJ}$).

Zgledi, v katerih se spreminja po ena količina:

| $F$ [N] | $s$ [m] | $A$ [J] |
|---|---|---|
| 10 | 2 | 20 |
| 10 | 4 | 40 |
| 20 | 4 | 80 |
| 40 | 0,5 | 20 |

Iz prve v drugo vrstico se pot podvoji in delo se podvoji. Iz druge v tretjo se podvoji sila in delo spet. V zadnji vrstici je sila štirikrat večja kot v prvi, pot pa štirikrat krajša, zato je delo enako kot v prvi.

## Drugače: Kot zgodba

Zrno toče se rodi visoko v nevihtnem oblaku. Močan vzgornik, veter, ki piha navzgor, ga nosi vse više. Sila vetra kaže navzgor in zrno se dviga navzgor: veter opravlja delo.

Ko zrno postane pretežko, ga vzgornik ne zmore več nositi. Zrno pada proti tlom. Zdaj delo opravlja teža, ker kaže navzdol, v smeri padanja.

Zrno pristane na listu solate. List ga drži s silo navzgor, a zrno se ne premika več. Pot je nič, zato list ne opravi nobenega dela, čeprav zrno ves čas drži.

Nato zapiha veter ob tleh in zrno odkotali $1\,\mathrm{m}$ po vrtu. Sila vetra in premik kažeta vodoravno: veter spet opravlja delo. V vsakem delu zgodbe je odgovor isti: delo je tam, kjer se telo premakne v smeri sile.

## Drugače: Bolj natančno

Enoto joule lahko zapišemo z osnovnimi enotami. Ker je $1\,\mathrm{N} = 1\,\mathrm{kg \cdot m/s^2}$, je $1\,\mathrm{J} = 1\,\mathrm{N \cdot m} = 1\,\mathrm{kg \cdot m^2/s^2}$.

Formula $A = F \cdot s$ velja, ko je sila stalna in kaže v smeri gibanja. Če sila s smerjo gibanja oklepa kot, delo opravi le njen del v smeri premika (to kaže simulacija). Če sila kaže nasprotno gibanju, na primer upor zraka na padajoče zrno toče, opravi **negativno** delo: telo zavira. Če se sila vzdolž poti spreminja, je delo ploščina pod grafom sile v odvisnosti od poti. Pri stalni sili je ta lik pravokotnik s stranicama $F$ in $s$.

## Preveri se

? Katera trditev o enoti za delo drži?
- Delo merimo v newtonih, ker ga opravi sila.
~ Newton je enota sile. Delo je sila krat pot, zato je enota $\mathrm{N} \cdot \mathrm{m}$, to je joule.
+ $1\,\mathrm{J}$ je delo sile $1\,\mathrm{N}$, ki telo premakne za $1\,\mathrm{m}$ v svoji smeri.
- $1\,\mathrm{kJ} = 100\,\mathrm{J}$
~ Predpona kilo pomeni tisoč, kot pri $1\,\mathrm{km} = 1000\,\mathrm{m}$.
- $1\,\mathrm{J} = 1\,\mathrm{kg} \cdot 1\,\mathrm{m}$
~ V pravilu je sila v newtonih, ne masa v kilogramih. Masa ni sila.
> $A = F \cdot s$, zato $1\,\mathrm{J} = 1\,\mathrm{N} \cdot 1\,\mathrm{m}$: sila $1\,\mathrm{N}$ na poti $1\,\mathrm{m}$ v smeri sile.

? Sunek vetra potisne vejo po zamrznjenem ribniku s stalno silo $30\,\mathrm{N}$ za $4\,\mathrm{m}$ v smeri vetra. Koliko dela opravi veter?
- $7{,}5\,\mathrm{J}$
~ Silo si delil s potjo. Delo je zmnožek: $A = F \cdot s$.
- $34\,\mathrm{J}$
~ Silo in pot si seštel. Delo raste s silo in s potjo hkrati, zato ju pomnožimo.
+ $120\,\mathrm{J}$
- $120\,\mathrm{N}$
~ Število je pravo, enota ne. Newton je enota sile, delo merimo v joulih.
> $A = F \cdot s = 30\,\mathrm{N} \cdot 4\,\mathrm{m} = 120\,\mathrm{J}$.

? Nina je izračunala, koliko dela opravi orel, ki ribo z maso $2\,\mathrm{kg}$ enakomerno dvigne za $3\,\mathrm{m}$: »$A = 2 \cdot 3 = 6\,\mathrm{J}$.« Kje je napaka ($g = 10\,\mathrm{\frac{N}{kg}}$)?
- Napake ni, delo je $6\,\mathrm{J}$.
~ Kilogrami niso newtoni. V $A = F \cdot s$ mora biti sila, pri dviganju teža ribe.
+ Namesto teže je vstavila maso. Teža je $20\,\mathrm{N}$, delo pa $60\,\mathrm{J}$.
- Višino bi morala vstaviti v centimetrih.
~ Pot je v $\mathrm{m}$ že prav. Joule je newton krat meter, centimetri bi dali napačen rezultat.
- Maso bi morala deliti z višino: $2 : 3$.
~ Delo je zmnožek sile in poti, ne količnik.
> Najprej teža: $F_g = 2 \cdot 10 = 20\,\mathrm{N}$. Nato $A = 20\,\mathrm{N} \cdot 3\,\mathrm{m} = 60\,\mathrm{J}$.

? Veter potisne čoln A s silo $100\,\mathrm{N}$ za $30\,\mathrm{m}$, čoln B pa s silo $300\,\mathrm{N}$ za $10\,\mathrm{m}$. Pri katerem čolnu opravi veter več dela?
- Pri čolnu A, ker je pot daljša.
~ Gledaš le pot. Delo je odvisno od sile in poti hkrati.
- Pri čolnu B, ker je sila večja.
~ Gledaš le silo. Trikrat večja sila na trikrat krajši poti da enako delo.
+ Pri obeh enako.
> $A_A = 100 \cdot 30 = 3000\,\mathrm{J}$ in $A_B = 300 \cdot 10 = 3000\,\mathrm{J}$. Šteje zmnožek $F \cdot s$.

? Pohodnik nese težak nahrbtnik po ravni gozdni poti $2\,\mathrm{km}$ daleč. Koliko dela opravi sila, s katero nahrbtnik drži navzgor?
- Veliko, ker je pot dolga in nahrbtnik težak.
~ Množiš težo s potjo, ki ni v smeri sile. Sila drže kaže navzgor, pot pa je vodoravna.
+ Nič, ker je sila pravokotna na smer gibanja.
- Nič, ker se pohodnik ne utrudi.
~ Utrudi se, saj mišice porabljajo energijo. Delo je nič zaradi smeri sile, ne zaradi utrujenosti.
> Delo opravi le sila, ki ima smer gibanja. Sila drže je navpična, premik vodoraven, zato je to delo $0\,\mathrm{J}$.

:::simboli
A | delo | A = F \cdot s | J | pri dviganju $A = F_g \cdot h$
F | sila v smeri gibanja | F = \dfrac{A}{s} | N
s | pot v smeri sile | s = \dfrac{A}{F} | m
F_g | teža | F_g = m \cdot g | N
h | višina dviga ali padca | | m
m | masa | | kg
g | težni pospešek | | N/kg | približno 10 N/kg
:::
