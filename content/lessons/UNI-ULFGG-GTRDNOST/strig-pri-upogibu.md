---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec pri vajah reče: »Strig je preprost. Prečna sila $T$ se enakomerno razporedi po prerezu, kot osna sila, torej $\tau = T/A$. In ker so pri upogibu napetosti največje na robu, je tam največji tudi strig.« Obe trditvi zvenita razumno in obe sta napačni. Na robu prereza je strižna napetost **nič**, največja pa je v sredini, za pravokotnik kar $50\,\%$ večja od $T/A$.

To ni akademska podrobnost. Zaradi striga se leseni nosilci razpočijo vzdolž sredine, lepljeni nosilci popustijo v lepilu, varjeni jekleni nosilci v zvarih med pasom in stojino. Ko gradimo bolnišnico, kjer nosilci nosijo težke obsevalne naprave, ali leseno klančino pred zdravstvenim domom, moramo strig znati izračunati.

## Razlaga

### Kaj že vemo: normalne napetosti pri upogibu

Pri upogibu z momentom $M$ okoli glavne težiščne osi $y$ so normalne napetosti linearne po višini prereza:

$$\sigma_x = \frac{M\,z}{I_y},$$

kjer je $z$ razdalja od nevtralne osi, $I_y$ pa vztrajnostni moment prereza. Na nevtralni osi so nič, na robu največje. Če se moment vzdolž nosilca spreminja, pa nosilec prenaša tudi **prečno silo** $T = \mathrm{d}M/\mathrm{d}x$. Kje v prerezu so strižne napetosti, ki jo prenašajo?

- **Normalne napetosti $\sigma_x$:** vzrok je moment $M$; po višini so linearne, največje na robu, nič na nevtralni osi.
- **Strižne napetosti $\tau_{xz}$:** vzrok je prečna sila $T$; po višini so parabolične, nič na robu, največje na nevtralni osi.

Primerjavo zdaj utemeljimo.

### Zakaj na robu ni striga

Iz lekcije o napetostnem stanju vemo, da sta strižni napetosti na pravokotnih ravninah enaki: $\tau_{xz} = \tau_{zx}$. Zgornja ploskev nosilca je prosta, na njej ni strižne obtežbe, torej $\tau_{zx} = 0$. Zato je na robu prereza tudi $\tau_{xz} = 0$. Prva sošolčeva trditev odpade: napetost ne more biti povsod $T/A$.

### Izpeljava: ravnotežje odrezanega kosa

Iz nosilca izrežemo kratek kos dolžine $\mathrm{d}x$ in ga prerežemo še vzdolžno, na višini $z$. Opazujmo zgornji del s ploskvijo $A_o$ (del prereza nad rezom).

1. Na levi ploskvi deluje moment $M$, na desni $M + \mathrm{d}M$. Normalne napetosti na $A_o$ dajo rezultanto $N_o = \int_{A_o}\frac{M\,\zeta}{I_y}\,\mathrm{d}A = \frac{M\,S_y}{I_y}$, kjer je $S_y = \int_{A_o}\zeta\,\mathrm{d}A$ **statični moment** ploskve $A_o$ glede na nevtralno os.
2. Na desni je rezultanta $(M + \mathrm{d}M)S_y/I_y$. Razlika $\mathrm{d}M\,S_y/I_y$ hoče kos potisniti vzdolž nosilca.
3. Uravnoteži jo lahko le strižna napetost na vzdolžnem rezu širine $b$: $\tau\,b\,\mathrm{d}x = \mathrm{d}M\,S_y/I_y$.
4. Delimo z $b\,\mathrm{d}x$ in upoštevamo $\mathrm{d}M/\mathrm{d}x = T$.

**Izrek (Žuravski).** Naj bo nosilec raven in prizmatičen, gradivo linearno elastično, upogib okoli glavne osi $y$ in naj velja Bernoullijeva hipoteza za normalne napetosti. Če je strižna napetost po širini reza $b(z)$ enakomerna, je

$$\tau_{xz}(z) = \frac{T\,S_y(z)}{I_y\,b(z)},$$

kjer je $S_y(z)$ statični moment dela prereza nad (ali pod) višino $z$ glede na nevtralno os.

Predpostavka o enakomernosti po širini je dobra za ozke prereze in tankostenske stene, slaba za široke plošče.

**Pravokotnik** $b \times h$. Za rez na višini $z$ je $A_o = b(h/2 - z)$ s težiščem na $(h/2 + z)/2$, torej $S_y = \frac{b}{2}\left(\frac{h^2}{4} - z^2\right)$. Z $I_y = bh^3/12$:

$$\tau(z) = \frac{3T}{2bh}\left(1 - \frac{4z^2}{h^2}\right), \qquad \tau_{max} = \frac{3}{2}\,\frac{T}{A}.$$

```
 prerez     τ(z)
 +----+   |
 |    |   |--
 |    |   |----
 |----|   |-----  τ_max (os)
 |    |   |----
 |    |   |--
 +----+   |
```

Za poln krog je največja napetost (na nevtralni osi) $\tau_{max} = \frac{4}{3}\,\frac{T}{A}$, za tanko okroglo cev $\tau_{max} = 2\,\frac{T}{A}$.

:::premisli
Pravokotni leseni nosilec obrnemo s pokončne lege ($b = 10\,\mathrm{cm}$, $h = 20\,\mathrm{cm}$) v ležečo ($b = 20\,\mathrm{cm}$, $h = 10\,\mathrm{cm}$). Kako se spremenita največja normalna in največja strižna napetost pri istem $M$ in $T$?
---
Strižna ostane enaka: $\tau_{max} = 1{,}5\,T/A$ je odvisna le od ploščine. Normalna se podvoji, ker se odpornostni moment $bh^2/6$ razpolovi. Strig in upogib se na obliko prereza odzivata različno.
:::

### Strižni tok

Pri sestavljenih prerezih nas pogosto ne zanima napetost, ampak sila na enoto dolžine, ki jo mora prenesti spoj (lepilo, zvar, vijaki).

**Definicija.** **Strižni tok** je strižna sila na enoto dolžine nosilca na vzdolžnem rezu:

$$q = \tau\,b = \frac{T\,S_y}{I_y}.$$

Enota je $\mathrm{N/m}$ (ali $\mathrm{N/mm}$). Če spoj tvorijo vijaki ali žeblji z nosilnostjo $F_1$ na kos, mora biti razmik med njimi največ $s = F_1/q$.

**Tankostenski prerezi.** V steni debeline $t$ si strižni tok $q = \tau t$ predstavljamo kot tok vode po cevi, ki teče vzdolž srednjice stene. V I-profilu teče v pasovih vodoravno, od prostih robov proti stojini, v stojini pa navpično; v stičišču se tokova seštejeta. Stojina prenese skoraj vso prečno silo, zato je dober približek $\tau \approx T/(h_s t_s)$.

:::premisli
Zakaj je pri I-profilu strižna napetost v pasu tik ob stojini mnogo manjša kot v stojini tik pod pasom, čeprav je statični moment na obeh mestih skoraj enak?
---
V formuli $\tau = T S_y/(I_y b)$ je $b$ širina reza. V pasu je širina celotnega pasu (na primer $120\,\mathrm{mm}$), v stojini le debelina stojine ($6\,\mathrm{mm}$). Pri skoraj enakem $S_y$ je napetost v stojini zato okoli $20$-krat večja.
:::

## Rešeni primeri

### Primer 1 (lažji)

Lesena greda nadstreška pred zdravstvenim domom ima pravokotni prerez $10\,\mathrm{cm} \times 20\,\mathrm{cm}$ (pokončno) in ob podpori prečno silo $12\,\mathrm{kN}$. Izračunaj povprečno in največjo strižno napetost ter napetost na četrtini višine od nevtralne osi.

**Podatki:** $b = 100\,\mathrm{mm}$, $h = 200\,\mathrm{mm}$, $T = 12\,\mathrm{kN}$, $z = h/4 = 50\,\mathrm{mm}$
**Iščemo:** $T/A$, $\tau_{max}$, $\tau(h/4)$

:::formula
$\tau(z) = \dfrac{3T}{2bh}\left(1 - \dfrac{4z^2}{h^2}\right)$, $\tau_{max} = \dfrac{3}{2}\,\dfrac{T}{A}$
:::

**Rešitev:**

1. Ploščina: $A = 100 \cdot 200\,\mathrm{mm^2} = 20\,000\,\mathrm{mm^2}$.
2. Povprečje: $T/A = 12\,000/20\,000\,\mathrm{MPa} = 0{,}60\,\mathrm{MPa}$.
3. Največja (na nevtralni osi): $\tau_{max} = 1{,}5 \cdot 0{,}60\,\mathrm{MPa} = 0{,}90\,\mathrm{MPa}$.
4. Na $z = h/4$: $1 - 4 \cdot (1/4)^2 = 0{,}75$, zato $\tau = 0{,}75 \cdot 0{,}90\,\mathrm{MPa} = 0{,}675\,\mathrm{MPa}$.
5. Odgovor: povprečje je $0{,}60\,\mathrm{MPa}$, največja napetost $0{,}90\,\mathrm{MPa}$ na nevtralni osi, na četrtini višine $0{,}675\,\mathrm{MPa}$, na robu nič. Les ima strižno trdnost vzdolž vlaken le nekaj $\mathrm{MPa}$, zato se kratke, močno obremenjene grede res lahko razpočijo vzdolž sredine.

### Primer 2

Klančina za invalidske vozičke ima nosilec iz dveh lesenih plohov $10\,\mathrm{cm} \times 10\,\mathrm{cm}$, položenih drug na drugega in povezanih z vijaki. Največja prečna sila je $4{,}0\,\mathrm{kN}$, en vijak prenese $3{,}0\,\mathrm{kN}$ strižne sile. Kolikšen je strižni tok v stiku in kolikšen največji razmik vijakov?

**Podatki:** $b = 100\,\mathrm{mm}$, $h = 200\,\mathrm{mm}$ (skupaj), stik na nevtralni osi, $T = 4{,}0\,\mathrm{kN}$, $F_1 = 3{,}0\,\mathrm{kN}$
**Iščemo:** $q$, $s$

:::formula
$q = \dfrac{T\,S_y}{I_y}$, $s = \dfrac{F_1}{q}$
:::

**Rešitev:**

1. Zakaj strižni tok: brez vijakov bi plohova zdrsnila drug po drugem in vsak bi nosil zase; vijaki morajo prenesti silo, ki jo izračuna Žuravski.
2. Statični moment zgornjega ploha glede na nevtralno os: $S_y = 100 \cdot 100 \cdot 50\,\mathrm{mm^3} = 5{,}0 \cdot 10^5\,\mathrm{mm^3}$.
3. Vztrajnostni moment celote: $I_y = 100 \cdot 200^3/12\,\mathrm{mm^4} \approx 6{,}67 \cdot 10^7\,\mathrm{mm^4}$.
4. Strižni tok: $q = 4000 \cdot 5{,}0 \cdot 10^5/(6{,}667 \cdot 10^7)\,\mathrm{N/mm} \approx 30\,\mathrm{N/mm}$.
5. Razmik: $s = 3000/30\,\mathrm{mm} = 100\,\mathrm{mm}$.
6. Odgovor: stik mora prenesti $30\,\mathrm{N}$ na vsak milimeter dolžine; vijaki morajo biti na največ $10\,\mathrm{cm}$. Bliže sredini razpona, kjer je prečna sila manjša, so lahko redkejši.

### Primer 3 (težji)

Varjeni jekleni I-nosilec nosi tla pod obsevalno napravo v bolnišnici. Pasova imata $120\,\mathrm{mm} \times 10\,\mathrm{mm}$, stojina $180\,\mathrm{mm} \times 6\,\mathrm{mm}$ (skupna višina $200\,\mathrm{mm}$). Ob podpori je $T = 30\,\mathrm{kN}$. Izračunaj: a) $I_y$; b) strižno napetost v stojini tik pod pasom in na nevtralni osi; c) kolikšen delež prečne sile prenese stojina in kako dober je približek $T/(h_s t_s)$; d) strižni tok v zvarih med pasom in stojino in napetost v dveh kotnih zvarih z debelino $a = 3\,\mathrm{mm}$.

**Podatki:** $b_p = 120\,\mathrm{mm}$, $t_p = 10\,\mathrm{mm}$, $h_s = 180\,\mathrm{mm}$, $t_s = 6\,\mathrm{mm}$, $h = 200\,\mathrm{mm}$, $T = 30\,\mathrm{kN}$, dva zvara z $a = 3\,\mathrm{mm}$
**Iščemo:** $I_y$, $\tau$ tik pod pasom in $\tau_{max}$, delež stojine, $q$, $\tau_z$

:::formula
$\tau = \dfrac{T\,S_y}{I_y\,t_s}$, $q = \dfrac{T\,S_p}{I_y}$, $\tau_z = \dfrac{q}{2a}$
:::

**Rešitev:**

1. a) Od polnega pravokotnika odštejemo praznini ob stojini: $I_y = (120 \cdot 200^3 - 114 \cdot 180^3)/12\,\mathrm{mm^4} \approx 2{,}46 \cdot 10^7\,\mathrm{mm^4}$.
2. b) Statični moment pasu: $S_p = 120 \cdot 10 \cdot 95\,\mathrm{mm^3} = 1{,}14 \cdot 10^5\,\mathrm{mm^3}$ (težišče pasu je $95\,\mathrm{mm}$ od osi).
3. Tik pod pasom (širina reza je $t_s$): $\tau = 30\,000 \cdot 1{,}14 \cdot 10^5/(2{,}4596 \cdot 10^7 \cdot 6)\,\mathrm{MPa} \approx 23{,}2\,\mathrm{MPa}$.
4. Na nevtralni osi dodamo še zgornjo polovico stojine: $S_{max} = 1{,}14 \cdot 10^5 + 6 \cdot 90 \cdot 45 = 1{,}383 \cdot 10^5\,\mathrm{mm^3}$, zato $\tau_{max} \approx 28{,}1\,\mathrm{MPa}$.
5. c) Po stojini se napetost spreminja parabolično od $23{,}2$ do $28{,}1\,\mathrm{MPa}$. Integral $\int \tau\,t_s\,\mathrm{d}z$ po stojini da okoli $0{,}953\,T$: stojina nosi $95\,\%$ prečne sile, pasova ostanek.
6. Približek: $T/(h_s t_s) = 30\,000/(180 \cdot 6)\,\mathrm{MPa} \approx 27{,}8\,\mathrm{MPa}$, le $1\,\%$ pod točnim $\tau_{max}$.
7. d) Strižni tok v stiku pas–stojina: $q = 30\,000 \cdot 1{,}14 \cdot 10^5/(2{,}4596 \cdot 10^7)\,\mathrm{N/mm} \approx 139\,\mathrm{N/mm}$.
8. Dva zvara s skupno debelino $2a = 6\,\mathrm{mm}$: $\tau_z = 139/6\,\mathrm{MPa} \approx 23{,}2\,\mathrm{MPa}$.
9. Odgovor: $I_y \approx 2{,}46 \cdot 10^7\,\mathrm{mm^4}$; v stojini $23{,}2\,\mathrm{MPa}$ pod pasom in $28{,}1\,\mathrm{MPa}$ na osi; stojina nosi $95\,\%$ sile; zvara prenašata $139\,\mathrm{N/mm}$ z napetostjo okoli $23\,\mathrm{MPa}$, kar je za konstrukcijsko jeklo daleč pod mejo.

### Primer 4 – zdaj ti

Titanov zatič s premerom $6{,}0\,\mathrm{mm}$ v zunanjem fiksatorju kosti prenaša prečno silo $600\,\mathrm{N}$. Kolikšna je povprečna in kolikšna največja strižna napetost v prerezu?

**Podatki:** $d = 6{,}0\,\mathrm{mm}$, $T = 600\,\mathrm{N}$, poln krožni prerez
**Iščemo:** $T/A$, $\tau_{max}$

:::formula
$A = \dfrac{\pi d^2}{4}$, $\tau_{max} = \dfrac{4}{3}\,\dfrac{T}{A}$
:::

**Rešitev:**

1. Ploščina: $A = \pi \cdot 6{,}0^2/4\,\mathrm{mm^2} \approx 28{,}3\,\mathrm{mm^2}$.
2. Povprečje: $T/A = 600/28{,}27\,\mathrm{MPa} \approx 21{,}2\,\mathrm{MPa}$.
3. Največjo napetost izračunaj sam in jo primerjaj s povprečjem.

:::premisli
Kolikšna je $\tau_{max}$?
---
$\tau_{max} = \frac{4}{3} \cdot 21{,}2\,\mathrm{MPa} \approx 28{,}3\,\mathrm{MPa}$, za tretjino več od povprečja (pri pravokotniku je razlika polovica). Zatič je kratek, zato je strig pri njem pomembnejši kot pri vitkem nosilcu.
:::

## Pogoste napake

- **$\tau = T/A$ povsod.** To je le povprečje. Na robu je strig nič (konjugirane napetosti), na nevtralni osi je za pravokotnik $1{,}5$-krat večji.
- **Največji strig na robu.** Na robu so največje normalne napetosti, strižne pa nič. Največji strig je tam, kjer je $S_y/b$ največji: pri preprostih prerezih na nevtralni osi.
- **Napačna širina $b$.** V formulo vstavimo širino reza, na katerem računamo, ne širine pasu ali celega profila. Tik pod pasom I-profila je to debelina stojine.
- **Statični moment glede na rob.** $S_y$ računamo glede na **nevtralno os** (težiščno), ne glede na zgornji rob ali težišče odrezanega dela.
- **Strižni tok in napetost zamešana.** $q$ je v $\mathrm{N/mm}$, $\tau$ v $\mathrm{MPa}$; razmik vijakov dobimo iz $q$, preverjanje gradiva iz $\tau$.

## Povzetek

- Prečna sila $T = \mathrm{d}M/\mathrm{d}x$ povzroči strižne napetosti $\tau_{xz}$; na prostem robu so nič ($\tau_{xz} = \tau_{zx}$).
- Žuravski: $\tau = T S_y/(I_y b)$; $S_y$ je statični moment dela prereza nad rezom glede na nevtralno os, $b$ širina reza.
- Pravokotnik: parabola, $\tau_{max} = 1{,}5\,T/A$; poln krog $\tfrac{4}{3}T/A$; tanka cev $2T/A$.
- Strižni tok $q = T S_y/I_y$ (N/m); razmik spojnih sredstev $s = F_1/q$.
- I-profil: stojina nosi skoraj vso prečno silo, $\tau \approx T/(h_s t_s)$; v pasovih teče strižni tok vodoravno.
- Normalne napetosti so linearne in največje na robu, strižne parabolične in največje na nevtralni osi.

## Za izpit

Znati moraš povedati:

- zakaj je strižna napetost na prostem robu prereza nič;
- izpeljavo formule Žuravskega iz ravnotežja odrezanega kosa, z vsemi predpostavkami;
- potek strižne napetosti po pravokotniku in dokaz, da je $\tau_{max} = 1{,}5\,T/A$ in da je rezultanta enaka $T$;
- definicijo strižnega toka in izračun razmika vijakov, žebljev ali zvarov;
- potek strižnega toka v I-profilu in zakaj stojina nosi skoraj vso prečno silo.

### Naloga 1

Lepljen lesen T-nosilec ima pas $200\,\mathrm{mm} \times 40\,\mathrm{mm}$ in stojino $60\,\mathrm{mm} \times 200\,\mathrm{mm}$ (skupna višina $240\,\mathrm{mm}$); pas je na stojino prilepljen po vsej širini stojine. Prečna sila je $15\,\mathrm{kN}$. a) Določi lego nevtralne osi in $I_y$. b) Izračunaj strižno napetost v lepilu in največjo strižno napetost v prerezu. c) Lepilo prenese $1{,}0\,\mathrm{MPa}$. Ali zdrži in kolikšna je največja dopustna prečna sila?

**Rešitev:**

1. a) Ploščini: pas $8000\,\mathrm{mm^2}$, stojina $12\,000\,\mathrm{mm^2}$, skupaj $20\,000\,\mathrm{mm^2}$.
2. Težišče od zgornjega roba: $z_T = (8000 \cdot 20 + 12\,000 \cdot 140)/20\,000\,\mathrm{mm} = 92\,\mathrm{mm}$.
3. Steinerjevo pravilo: $I_y = 200 \cdot 40^3/12 + 8000 \cdot 72^2 + 60 \cdot 200^3/12 + 12\,000 \cdot 48^2 \approx 1{,}102 \cdot 10^8\,\mathrm{mm^4}$.
4. b) Lepilo je na stiku pasu in stojine, $40\,\mathrm{mm}$ od vrha. Statični moment pasu: $S_p = 8000 \cdot 72 = 576\,000\,\mathrm{mm^3}$.
5. Širina reza v lepilu je $60\,\mathrm{mm}$: $\tau_l = 15\,000 \cdot 576\,000/(1{,}102 \cdot 10^8 \cdot 60)\,\mathrm{MPa} \approx 1{,}31\,\mathrm{MPa}$.
6. Nevtralna os leži $52\,\mathrm{mm}$ pod stikom, v stojini. Statični moment nad njo: $S_{max} = 576\,000 + 60 \cdot 52^2/2 = 657\,120\,\mathrm{mm^3}$ (preverba od spodaj: $60 \cdot 148^2/2 = 657\,120\,\mathrm{mm^3}$).
7. $\tau_{max} = 15\,000 \cdot 657\,120/(1{,}102 \cdot 10^8 \cdot 60)\,\mathrm{MPa} \approx 1{,}49\,\mathrm{MPa}$.
8. c) $1{,}31\,\mathrm{MPa} > 1{,}0\,\mathrm{MPa}$: lepilo ne zdrži. Napetost je sorazmerna s $T$, zato $T_{dop} = 15\,\mathrm{kN} \cdot 1{,}0/1{,}307 \approx 11{,}5\,\mathrm{kN}$.
9. Odgovor: nevtralna os je $92\,\mathrm{mm}$ pod vrhom, $I_y \approx 1{,}10 \cdot 10^8\,\mathrm{mm^4}$; v lepilu je $1{,}31\,\mathrm{MPa}$, največja napetost $1{,}49\,\mathrm{MPa}$ v stojini na nevtralni osi; lepilo ne zdrži, dopustna sila je okoli $11{,}5\,\mathrm{kN}$ (ali širši stik). Opazi, da povprečje $T/A_s$ po stojini ($1{,}04\,\mathrm{MPa}$) nevarnost podceni.

### Naloga 2

Izpelji formulo Žuravskega za strižne napetosti pri upogibu in navedi vse predpostavke. Za pravokotni prerez izpelji potek $\tau(z)$ in dokaži, da je rezultanta strižnih napetosti po prerezu enaka prečni sili $T$.

**Rešitev:**

1. Predpostavke: raven prizmatičen nosilec, linearno elastično gradivo, upogib okoli glavne osi, normalne napetosti $\sigma_x = Mz/I_y$ (Bernoulli) tudi ob prečni sili, strižna napetost enakomerna po širini reza.
2. Izrežemo kos dolžine $\mathrm{d}x$ in ga na višini $z$ prerežemo vzdolžno; opazujemo del s ploskvijo $A_o$ nad rezom.
3. Rezultanta normalnih napetosti na $A_o$: $N_o = \frac{M}{I_y}\int_{A_o}\zeta\,\mathrm{d}A = \frac{M S_y}{I_y}$; na drugi ploskvi $\frac{(M + \mathrm{d}M)S_y}{I_y}$.
4. Ravnotežje v smeri $x$: $\tau\,b\,\mathrm{d}x = \frac{\mathrm{d}M\,S_y}{I_y}$, z $\mathrm{d}M/\mathrm{d}x = T$ sledi $\tau = \frac{T S_y}{I_y b}$. Po konjugiranosti je to tudi $\tau_{xz}$ v prečnem prerezu.
5. Pravokotnik: $S_y(z) = b\left(\frac{h}{2} - z\right) \cdot \frac{1}{2}\left(\frac{h}{2} + z\right) = \frac{b}{2}\left(\frac{h^2}{4} - z^2\right)$.
6. Vstavimo $I_y = bh^3/12$: $\tau(z) = \frac{6T}{bh^3}\left(\frac{h^2}{4} - z^2\right) = \frac{3T}{2bh}\left(1 - \frac{4z^2}{h^2}\right)$.
7. Rezultanta: $\int_{-h/2}^{h/2}\tau\,b\,\mathrm{d}z = \frac{3T}{2h}\int_{-h/2}^{h/2}\left(1 - \frac{4z^2}{h^2}\right)\mathrm{d}z = \frac{3T}{2h}\left(h - \frac{h}{3}\right) = T$.
8. Odgovor: $\tau = T S_y/(I_y b)$; za pravokotnik parabola z vrhom $1{,}5\,T/A$ na nevtralni osi in ničlama na robovih; integral da natanko $T$, kar potrdi pravilnost izpeljave.

## Drugače: Na sliki

Vzemi kup listov papirja in ga upogni. Listi zdrsnejo drug po drugem, konci se zamaknejo. Zdaj kup močno spni s sponkami: ne zdrsne več in je mnogo bolj tog. Sponke prenašajo prav strižni tok: silo, ki prepreči zdrs med plastmi. Največji zdrs je med srednjima listoma, kjer bi sponke morale biti najmočnejše, na zgornjem in spodnjem listu pa ni plasti, s katero bi drsel.

I-profil si predstavljaj kot cevovod:

```
 ==========   pas: tok teče
      ||      vodoravno k stojini
      ||
      ||      stojina: skoraj
      ||      ves tok navzdol
 ==========
```

Tok iz obeh polovic pasu se v stičišču zlije v stojino, kot dva pritoka v reko; v spodnjem pasu se spet razdeli.

## Drugače: Uporaba v stroki

- **Lesene in lepljene konstrukcije.** Kratke, močno obremenjene lesene grede in nosilci iz lepljenega lesa se pogosto porušijo s strigom vzdolž vlaken ob podporah, ne z upogibom. Projektant zato preveri $\tau_{max} = 1{,}5\,T/A$ ob podporah.
- **Varjeni in sovprežni nosilci.** Zvare med pasom in stojino ter moznike med jeklenim nosilcem in betonsko ploščo dimenzioniramo po strižnem toku $q = TS/I$; ob podporah so mozniki gostejši kot v sredini.
- **Bolnišnice in laboratoriji.** Nosilci pod težkimi napravami (obsevalni pospeševalniki, naprave za magnetno resonanco, zaščitni zidovi iz betona) imajo velike koncentrirane sile in s tem velike prečne sile ob podporah; tam se preveri tudi lokalni strig stojine.
- **Medicinski pripomočki in biomehanika.** Pri zatičih, vijakih in ploščicah za fiksacijo kosti ter pri zobnih vsadkih je strig pomemben, ker so elementi kratki; strižne napetosti v kosti ob vsadku vplivajo na to, ali se kost ob njem obnavlja ali razgrajuje.

## Drugače: Bolj natančno

**Strižno središče.** Pri prerezih, ki niso simetrični glede na smer obtežbe (na primer U-profil), rezultanta strižnega toka ne gre skozi težišče. Če sila ne deluje v **strižnem središču**, se nosilec poleg upogiba tudi zasuka. Pri U-profilu leži strižno središče zunaj prereza, na strani hrbta.

**Meje formule.** Pri širokih pasovih ali prerezih s hitrimi spremembami širine strižna napetost po širini ni enakomerna; pri krogu je na robu reza celo usmerjena tangentno na obod. Formula Žuravskega da povprečje po širini; natančne vrednosti da teorija elastičnosti ali metoda končnih elementov.

**Strižna deformacija.** Strig povzroči tudi dodaten poves. Pri vitkih nosilcih (razpon več kot okoli $10$-krat višina) je zanemarljiv, pri kratkih in visokih nosilcih ali sendvič panelih z mehkim jedrom pa ne; tam uporabljamo Timošenkovo teorijo nosilcev.

## Preveri se

? Katera trditev o strižnih napetostih pri upogibu pravokotnega nosilca je pravilna?
- Strižna napetost je po prerezu enakomerna, $\tau = T/A$.
~ $T/A$ je le povprečje; napetost se po višini spreminja parabolično.
- Strižna napetost je največja na zgornjem in spodnjem robu.
~ Na robu je strig nič, ker na prosti ploskvi ni strižne obtežbe; največje so tam normalne napetosti.
+ Strižna napetost je največja na nevtralni osi in znaša $1{,}5\,T/A$.
> Iz $\tau = TS_y/(I_y b)$: $S_y$ je največji na nevtralni osi, kjer je odrezani del največji.

? Pravokotni nosilec $8\,\mathrm{cm} \times 25\,\mathrm{cm}$ ima prečno silo $20\,\mathrm{kN}$. Kolikšna je največja strižna napetost?
- $1{,}0\,\mathrm{MPa}$
~ To je povprečje $T/A$; manjka faktor $1{,}5$.
+ $1{,}5\,\mathrm{MPa}$
- $2{,}0\,\mathrm{MPa}$
~ Uporabil si faktor $2$ za tanko cev; za pravokotnik je $1{,}5$.
> $A = 80 \cdot 250 = 20\,000\,\mathrm{mm^2}$, $\tau_{max} = 1{,}5 \cdot 20\,000/20\,000\,\mathrm{MPa} = 1{,}5\,\mathrm{MPa}$.

? Študent računa strig tik pod pasom I-profila: »$S_y$ pasu je $1{,}14 \cdot 10^5\,\mathrm{mm^3}$, $I_y = 2{,}46 \cdot 10^7\,\mathrm{mm^4}$, $T = 30\,\mathrm{kN}$, širina $b = 120\,\mathrm{mm}$, torej $\tau \approx 1{,}2\,\mathrm{MPa}$.« Kje je napaka?
- napačen statični moment
~ $S_y$ pasu je pravilen: $120 \cdot 10 \cdot 95\,\mathrm{mm^3}$.
+ napačna širina reza
- napačen vztrajnostni moment
~ $I_y$ celotnega prereza je pravilen.
> Tik pod pasom je rez v stojini, $b = t_s = 6\,\mathrm{mm}$: $\tau \approx 23\,\mathrm{MPa}$. Z $b = 120\,\mathrm{mm}$ je izračunana napetost v pasu.

? Primerjaj največjo strižno napetost pri isti prečni sili in isti ploščini: poln pravokotnik, poln krog, tanka okrogla cev. Kateri vrstni red (od najmanjše do največje) je pravilen?
- pravokotnik, krog, cev
~ Za krog je faktor $4/3 \approx 1{,}33$, za pravokotnik $1{,}5$; krog ima torej manjšo napetost od pravokotnika.
+ krog, pravokotnik, cev
- cev, krog, pravokotnik
~ Tanka cev ima faktor $2$, največjega od vseh treh.
> Faktorji so $1{,}5$ (pravokotnik), $4/3$ (krog) in $2$ (cev).

? Tesar spne dva ploha drug na drugega z žeblji in jih zabije enakomerno na vsakih $20\,\mathrm{cm}$ po vsej dolžini prostoležečega nosilca z enakomerno obtežbo. Kaj bi mu svetoval inženir?
- Žeblje naj zgosti v sredini razpona, kjer je moment največji.
~ Moment odloča o normalnih napetostih; strižni tok je sorazmeren s prečno silo, ki je v sredini nič.
+ Žeblje naj zgosti ob podporah, kjer je prečna sila največja.
- Razmik je vseeno, ker je strižni tok po dolžini stalen.
~ Pri enakomerni obtežbi se prečna sila linearno spreminja od podpore do sredine, z njo pa strižni tok.
> $q = TS_y/I_y$ je sorazmeren s $T$; ob podporah je največji, v sredini nič.

:::simboli
\sigma_x | normalna napetost pri upogibu | \sigma_x = \frac{M\,z}{I_y} | MPa
\tau, \tau_{xz} | strižna napetost v prečnem prerezu | \tau = \frac{T\,S_y}{I_y\,b} | MPa
\tau_{zx} | strižna napetost na vzdolžni ravnini | \tau_{zx} = \tau_{xz} | MPa
\tau_{max} | največja strižna napetost | | MPa
\tau_l | strižna napetost v lepilu | | MPa
\tau_z | napetost v zvarih | \tau_z = \frac{q}{2a} | MPa
M | upogibni moment | | N\,mm
T | prečna sila | T = \frac{\mathrm{d}M}{\mathrm{d}x} | N
T_{dop} | dopustna prečna sila | | N
I_y | vztrajnostni moment prereza | | mm^4
S_y | statični moment odrezanega dela | | mm^3 | glede na nevtralno os
S_p | statični moment pasu | | mm^3
S_{max} | statični moment na nevtralni osi | | mm^3
b | širina reza | | mm
h | višina prereza | | mm
z | razdalja od nevtralne osi | | mm
\zeta | razdalja točke ploskve od nevtralne osi | | mm
A | ploščina prereza | | mm^2
A_o | ploščina odrezanega dela | | mm^2
N_o | rezultanta normalnih napetosti na odrezanem delu | N_o = \frac{M\,S_y}{I_y} | N
q | strižni tok | q = \frac{T\,S_y}{I_y} | N/mm
F_1 | nosilnost enega spojnega sredstva | | N
s | razmik spojnih sredstev | s = \frac{F_1}{q} | mm
h_s, t_s | višina in debelina stojine | | mm
b_p, t_p | širina in debelina pasu | | mm
a | debelina kotnega zvara | | mm
d | premer zatiča | | mm
z_T | lega težišča od vrha | | mm
x | lega vzdolž nosilca | | mm
:::
