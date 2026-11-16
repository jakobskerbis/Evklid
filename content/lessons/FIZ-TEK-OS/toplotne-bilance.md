---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Jaka si je sestavil računalnik z vodnim hlajenjem. Voda kroži po ceveh: v bloku na procesorju se segreje, v rezervoarju se pomeša s hladnejšo vodo. Jaka je prepričan:

»V rezervoarju je $0{,}6\,\mathrm{kg}$ vode z $20\,^\circ\mathrm{C}$. Ko vanj priteče $0{,}2\,\mathrm{kg}$ vode s $60\,^\circ\mathrm{C}$, bo zmes imela $40\,^\circ\mathrm{C}$. To je sredina med $20$ in $60$.«

Se ti zdi prav? Termometer bi pokazal precej manj. Kdo ima prav in za koliko se Jaka zmoti, ugotoviš v tej uri. Isti premislek reši vsako tekmovalno nalogo o mešanju vode, taljenju ledu ali merjenju specifične toplote: **koliko toplote ena snov odda, toliko je druga prejme**.

## Razlaga

**1. Toplota za segrevanje.** Iz rednega pouka poznaš zvezo med toploto in spremembo temperature:

$$Q = m \cdot c \cdot \Delta T$$

Tu je $Q$ toplota (v J), $m$ masa, $c$ **specifična toplota** snovi in $\Delta T$ sprememba temperature. Specifična toplota pove, koliko toplote potrebuje $1\,\mathrm{kg}$ snovi, da se segreje za $1\,\mathrm{K}$. Za vodo je $c = 4200\,\mathrm{J/(kg\,K)}$. Sprememba za $1\,\mathrm{K}$ je enaka spremembi za $1\,^\circ\mathrm{C}$, zato $\Delta T$ lahko računaš kar v stopinjah Celzija.

V simulaciji »Segrevanje in taljenje« segrevaj vodo z isto močjo grelnika najprej pri masi $1\,\mathrm{kg}$, nato pri $2\,\mathrm{kg}$. Opazi, da se v enakem času dvakrat večja masa segreje le za polovico toliko.

*Hitri preizkus:* koliko toplote potrebuje $0{,}5\,\mathrm{kg}$ vode, da se segreje za $10\,^\circ\mathrm{C}$? *(Odgovor: $Q = 0{,}5 \cdot 4200 \cdot 10\,\mathrm{J} = 21\,000\,\mathrm{J}$.)*

**2. Toplotna bilanca.** Ko zmešaš toplo in hladno vodo, se topla ohlaja, hladna pa segreva, dokler nimata enake temperature. Tej skupni temperaturi rečemo **končna temperatura** $T_z$. Če posoda in okolica ne vzameta nič toplote, velja ohranitev energije:

$$Q_\text{oddana} = Q_\text{prejeta}$$

Taki enakosti rečemo **toplotna bilanca**. Pri Jakovem rezervoarju je končna temperatura $30\,^\circ\mathrm{C}$. Preverimo s tabelo:

| | hladna | topla |
|---|---|---|
| $m$ | $0{,}6\,\mathrm{kg}$ | $0{,}2\,\mathrm{kg}$ |
| $\Delta T$ | $10\,\mathrm{K}$ | $30\,\mathrm{K}$ |
| $Q$ | $25\,200\,\mathrm{J}$ | $25\,200\,\mathrm{J}$ |

Hladna voda se segreje s $20$ na $30\,^\circ\mathrm{C}$ in toploto prejme, topla se ohladi s $60$ na $30\,^\circ\mathrm{C}$ in jo odda. Toploti sta enaki, torej je $30\,^\circ\mathrm{C}$ pravi odgovor. Jaka se je zmotil za $10\,^\circ\mathrm{C}$.

:::premisli
V tabeli se topla voda spremeni za $30\,\mathrm{K}$, hladna le za $10\,\mathrm{K}$, čeprav si izmenjata enako toploto. Zakaj ravno trikrat bolj? Kaj ima s tem masa?
---
Trikrat bolj ($30\,\mathrm{K}$ proti $10\,\mathrm{K}$). Obe dobita ali izgubita enako toploto, a ta se pri hladni vodi razdeli na trikrat več kilogramov. Zato se vsak kilogram hladne vode segreje le za tretjino tega, za kolikor se ohladi topla.
:::

**3. Formula za mešanje.** Zapišimo bilanco s črkami. Topla voda (masa $m_1$, temperatura $T_1$) odda toploto, hladna (masa $m_2$, temperatura $T_2$) jo prejme. Enačba bilance:

$$m_1 c \,(T_1 - T_z) = m_2 c \,(T_z - T_2)$$

Pri isti snovi se $c$ krajša. Odpravi oklepaje, člene s $T_z$ prenesi na eno stran in deli z $m_1 + m_2$. Tako dobiš **uteženo povprečje** temperatur:

$$T_z = \frac{m_1 T_1 + m_2 T_2}{m_1 + m_2}$$

Vsaka temperatura šteje toliko, kolikor je mase pri njej. Navadno povprečje (sredina) velja samo pri enakih masah. Pri različnih snoveh vsako maso pomnožiš še z njeno specifično toploto:

$$T_z = \frac{m_1 c_1 T_1 + m_2 c_2 T_2}{m_1 c_1 + m_2 c_2}$$

V simulaciji spodaj »Mešanje vode« nastavi $m_1 = 1\,\mathrm{kg}$ tople vode s $T_1 = 60\,^\circ\mathrm{C}$ in $m_2 = 3\,\mathrm{kg}$ vode s $T_2 = 20\,^\circ\mathrm{C}$. Opazi, da je končna temperatura $30\,^\circ\mathrm{C}$: bližje temperaturi tiste vode, ki je je več.

*Hitri preizkus:* zmešaš $1\,\mathrm{kg}$ vode z $10\,^\circ\mathrm{C}$ in $1\,\mathrm{kg}$ vode s $50\,^\circ\mathrm{C}$. Koliko je $T_z$? *(Odgovor: $30\,^\circ\mathrm{C}$, masi sta enaki, zato tu sredina velja.)*

**4. Taljenje.** Led pri $0\,^\circ\mathrm{C}$ se ob dovajanju toplote najprej tali. Med taljenjem se njegova temperatura ne spreminja, vsa toplota gre v razbijanje kristala. Toplota za taljenje je

$$Q_t = m_l \cdot q_t$$

kjer je $m_l$ masa ledu in $q_t$ **specifična talilna toplota**. Za led je $q_t = 336\,\mathrm{kJ/kg}$. Iz staljenega ledu nastane voda z $0\,^\circ\mathrm{C}$, ki se nato segreva kot vsaka druga voda.

Uporaben trik: $336\,000 : 4200 = 80$. Taljenje kilograma ledu vzame toliko toplote, kot je potrebuje kilogram vode, da se segreje za $80\,^\circ\mathrm{C}$.

:::premisli
Sošolka trdi: »Kocka ledu z $0\,^\circ\mathrm{C}$ in enaka masa vode z $0\,^\circ\mathrm{C}$ ohladita sok enako, saj imata isto temperaturo.« Kaj napoveš?
---
Led ohladi sok veliko bolj. Preden se njegova voda sploh začne segrevati, mora led pri taljenju prejeti $336\,\mathrm{kJ}$ na kilogram. Ta toplota pride iz soka. Temperatura sama ne pove, koliko toplote telo lahko sprejme.
:::

Pri nalogah z ledom najprej preveri, ali se ves led sploh stali. Izračunaj, koliko toplote odda voda, če se ohladi do $0\,^\circ\mathrm{C}$, in to primerjaj s toploto za taljenje vsega ledu. Če voda do ničle odda manj toplote, kot je je treba za ves led, se stali le del ledu in končna temperatura je $0\,^\circ\mathrm{C}$.

*Hitri preizkus:* zakaj ostane temperatura v kozarcu z ledeno vodo $0\,^\circ\mathrm{C}$, dokler v njem plava led? *(Odgovor: toplota iz okolice gre v taljenje ledu, ne v segrevanje.)*

**5. Kalorimeter.** Specifično toploto merimo v **kalorimetru**, izolirani posodi z vodo in termometrom. Toploto prejme tudi posoda sama. Ker njene mase in snovi ne poznamo vedno, podamo kar njeno **toplotno kapaciteto** $C$: koliko toplote potrebuje vsa posoda za $1\,\mathrm{K}$. Toplota, ki jo prejme posoda, je

$$Q_k = C \cdot \Delta T$$

Kalorimeter ima vedno isto temperaturo kot voda v njem, zato ima tudi isti $\Delta T$.

*Hitri preizkus:* kalorimeter s $C = 200\,\mathrm{J/K}$ se segreje za $5\,\mathrm{K}$. Koliko toplote prejme? *(Odgovor: $200 \cdot 5\,\mathrm{J} = 1000\,\mathrm{J}$.)*

## Rešeni primeri

### Primer 1 (lažji): čaj z mrzlo vodo

V skodelici je $0{,}15\,\mathrm{kg}$ čaja z $90\,^\circ\mathrm{C}$. Doliješ $0{,}05\,\mathrm{kg}$ vode z $10\,^\circ\mathrm{C}$. Kolikšna je končna temperatura? Čaj ima enako specifično toploto kot voda, skodelico in okolico zanemari.

**Podatki:** $m_1 = 0{,}15\,\mathrm{kg}$, $T_1 = 90\,^\circ\mathrm{C}$, $m_2 = 0{,}05\,\mathrm{kg}$, $T_2 = 10\,^\circ\mathrm{C}$, ista snov
**Iščemo:** končno temperaturo $T_z$

:::formula
$T_z = \dfrac{m_1 T_1 + m_2 T_2}{m_1 + m_2}$
:::

**Rešitev:**

1. Snov je ista, zato $c$ odpade in uporabimo uteženo povprečje.
2. Števec: $0{,}15 \cdot 90 + 0{,}05 \cdot 10 = 14$ (v $\mathrm{kg} \cdot {}^\circ\mathrm{C}$).
3. Imenovalec: $0{,}15 + 0{,}05 = 0{,}2$ (v kg).
4. $T_z = 14 : 0{,}2 = 70$, torej $70\,^\circ\mathrm{C}$.
5. Preizkus z bilanco: čaj odda $0{,}15 \cdot 4200 \cdot 20\,\mathrm{J} = 12\,600\,\mathrm{J}$, voda prejme $0{,}05 \cdot 4200 \cdot 60\,\mathrm{J} = 12\,600\,\mathrm{J}$. Ujema se.
6. Odgovor: končna temperatura je $70\,^\circ\mathrm{C}$.

### Primer 2: koliko vroče vode

Koliko vode z $80\,^\circ\mathrm{C}$ moraš doliti k $3\,\mathrm{kg}$ vode s $15\,^\circ\mathrm{C}$, da dobiš $35\,^\circ\mathrm{C}$?

**Podatki:** $T_1 = 80\,^\circ\mathrm{C}$, $m_2 = 3\,\mathrm{kg}$, $T_2 = 15\,^\circ\mathrm{C}$, $T_z = 35\,^\circ\mathrm{C}$
**Iščemo:** maso vroče vode $m_1$

:::formula
Enačba bilance: $m_1 c\,(T_1 - T_z) = m_2 c\,(T_z - T_2)$
:::

**Rešitev:**

1. Tu je neznanka masa, zato povprečje ni priročno. Zapišemo bilanco, $c$ se krajša.
2. Hladna voda se segreje za $35 - 15 = 20\,\mathrm{K}$, vroča se ohladi za $80 - 35 = 45\,\mathrm{K}$.
3. Enačba: $m_1 \cdot 45 = 3 \cdot 20$, zato je $m_1 = 60 : 45$.
4. $m_1 = \dfrac{4}{3}\,\mathrm{kg} \approx 1{,}33\,\mathrm{kg}$.
5. Smiselnost: vroča voda se spremeni bolj kot hladna, zato mora biti vroče vode manj kot hladne.
6. Odgovor: doliti moraš približno $1{,}33\,\mathrm{kg}$ vroče vode.

### Primer 3 (težji): iz katere kovine je hladilnik procesorja

Rebrasti hladilnik za procesor ima maso $0{,}2\,\mathrm{kg}$. Segrejemo ga v vreli vodi na $100\,^\circ\mathrm{C}$ in ga hitro prenesemo v kalorimeter z $0{,}25\,\mathrm{kg}$ vode z $20\,^\circ\mathrm{C}$. Toplotna kapaciteta kalorimetra je $210\,\mathrm{J/K}$. Končna temperatura je $30\,^\circ\mathrm{C}$. Kolikšna je specifična toplota kovine in katera kovina bi to lahko bila?

**Podatki:** $m_1 = 0{,}2\,\mathrm{kg}$ (kovina), $T_1 = 100\,^\circ\mathrm{C}$, $m_2 = 0{,}25\,\mathrm{kg}$ (voda), $T_2 = 20\,^\circ\mathrm{C}$, $C = 210\,\mathrm{J/K}$, $T_z = 30\,^\circ\mathrm{C}$, $c_2 = 4200\,\mathrm{J/(kg\,K)}$
**Iščemo:** specifično toploto kovine $c_1$

:::formula
Enačba bilance s kalorimetrom: $m_1 c_1 (T_1 - T_z) = (m_2 c_2 + C)(T_z - T_2)$
:::

**Rešitev:**

1. Kovina odda toploto. Voda **in** kalorimeter jo prejmeta, oba se segrejeta za $30 - 20 = 10\,\mathrm{K}$.
2. Voda in posoda skupaj potrebujeta za vsak kelvin $0{,}25 \cdot 4200 + 210 = 1260$ joulov.
3. Prejeta toplota: $1260 \cdot 10\,\mathrm{J} = 12\,600\,\mathrm{J}$.
4. Kovina se ohladi za $100 - 30 = 70\,\mathrm{K}$, zato odda $0{,}2 \cdot c_1 \cdot 70 = 14\,c_1$ (enačba za oddano toploto v J).
5. Enačba bilance: $14\,c_1 = 12\,600$, zato je $c_1 = 900\,\mathrm{J/(kg\,K)}$.
6. Odgovor: specifična toplota je $900\,\mathrm{J/(kg\,K)}$, kar ustreza aluminiju. Iz njega res pogosto delajo hladilnike, ker je lahek in dobro prevaja toploto.

### Primer 4 – zdaj ti: led v soku

V kozarcu je $0{,}2\,\mathrm{kg}$ soka s $25\,^\circ\mathrm{C}$ ($c$ kot pri vodi). Dodaš $0{,}05\,\mathrm{kg}$ ledu z $0\,^\circ\mathrm{C}$. Kolikšna je končna temperatura? Kozarec in okolico zanemari.

**Podatki:** $m_v = 0{,}2\,\mathrm{kg}$, $T_v = 25\,^\circ\mathrm{C}$, $m_l = 0{,}05\,\mathrm{kg}$, led pri $0\,^\circ\mathrm{C}$, $c = 4200\,\mathrm{J/(kg\,K)}$, $q_t = 336\,\mathrm{kJ/kg}$
**Iščemo:** končno temperaturo $T_z$

:::formula
Enačba bilance: $m_v c\,(T_v - T_z) = m_l q_t + m_l c\,T_z$ (temperature v $^\circ\mathrm{C}$)
:::

**Rešitev:**

1. Ali se ves led stali? Če se sok ohladi do $0\,^\circ\mathrm{C}$, odda $0{,}2 \cdot 4200 \cdot 25\,\mathrm{J} = 21\,000\,\mathrm{J}$.
2. Za taljenje vsega ledu je treba $0{,}05 \cdot 336\,000\,\mathrm{J} = 16\,800\,\mathrm{J}$. To je manj kot $21\,000\,\mathrm{J}$, zato se ves led stali in $T_z$ je nad ničlo.
3. V bilanco vstavi števila ($0{,}2 \cdot 4200 = 840$; $0{,}05 \cdot 4200 = 210$): na levi je $840 \cdot (25 - T_z)$, na desni $16\,800 + 210\,T_z$.
4. Reši enačbo sam, nato preveri:

:::premisli
Kolikšna je končna temperatura?
---
Enačba: $21\,000 - 840\,T_z = 16\,800 + 210\,T_z$, torej $1050\,T_z = 4200$ in $T_z = 4\,^\circ\mathrm{C}$. Že $50\,\mathrm{g}$ ledu ohladi sok za $21\,^\circ\mathrm{C}$.
:::

## Pogoste napake

- **Navadno povprečje temperatur.** Jaka je izračunal $\dfrac{20 + 60}{2} = 40$. To velja le pri enakih masah iste snovi. Sicer vzemi uteženo povprečje, kjer vsaka temperatura šteje s svojo maso: pravilno je $30\,^\circ\mathrm{C}$.
- **Ista razlika temperatur za obe telesi.** Kdor v bilanco za oba vstavi $T_1 - T_2$, pozabi, da se vsako telo spremeni od svoje začetne do **končne** temperature. Za toplo vodo je to $T_1 - T_z$, za hladno $T_z - T_2$.
- **Led kot mrzla voda.** Led z $0\,^\circ\mathrm{C}$ mora najprej prejeti $m_l q_t$ za taljenje. Kdor to izpusti, dobi previsoko končno temperaturo: v Primeru 4 $20\,^\circ\mathrm{C}$ namesto $4\,^\circ\mathrm{C}$. Kdor pozabi, da se staljena voda potem še segreva, dobi prav tako previsokih $5\,^\circ\mathrm{C}$.
- **Pozabljen kalorimeter.** Če v Primeru 3 izpustiš $C$, dobiš $c_1 = 750\,\mathrm{J/(kg\,K)}$, kar je premalo. Posoda je prejela del toplote, ki jo je oddala kovina.
- **Brez preverjanja, ali se ves led stali.** Če je ledu preveč, ti enačba vrne temperaturo pod $0\,^\circ\mathrm{C}$. Voda z ledom tako ne more biti: končna temperatura je takrat $0\,^\circ\mathrm{C}$ in del ledu ostane.

## Povzetek

- Toplota za segrevanje: $Q = m c \Delta T$; za vodo $c = 4200\,\mathrm{J/(kg\,K)}$.
- Bilanca: oddana toplota je enaka prejeti. Vsako telo se spremeni od svoje začetne do skupne končne temperature.
- Mešanje iste snovi: $T_z$ je uteženo povprečje, $T_z = \dfrac{m_1 T_1 + m_2 T_2}{m_1 + m_2}$; bližje je temperaturi večje mase.
- Taljenje ledu pri $0\,^\circ\mathrm{C}$: $Q_t = m_l q_t$, $q_t = 336\,\mathrm{kJ/kg}$, kar je toliko kot segrevanje enake mase vode za $80\,^\circ\mathrm{C}$. Najprej preveri, ali se ves led stali.
- Kalorimeter prejme $C \Delta T$; to prišteješ prejeti toploti vode.

## Drugače: Na sliki

Temperature nariši na premico in si predstavljaj vzvod. Končna temperatura je opora, maso hladne vode obesiš pri $20\,^\circ\mathrm{C}$, maso tople pri $60\,^\circ\mathrm{C}$:

:::risba premica
opis: Temperaturna premica od 20 do 60 stopinj Celzija. Hladna voda z maso 0,6 kg je pri 20 °C, topla voda z maso 0,2 kg pri 60 °C, zmes pri 30 °C. Razdalja od 20 do 30 je 10 K, od 30 do 60 pa 30 K.
od: 20
do: 60
korak: 5
oznake: 10
točka: 20 | 0,6 kg | polno
točka: 60 | 0,2 kg | polno
točka: 30 | zmes | rdeča
interval: 20 .. 30 | 10 K
interval: 30 .. 60 | 30 K
:::

Kot pri vzvodu velja »masa krat ročica«: $0{,}6 \cdot 10 = 0{,}2 \cdot 30$. Težja stran ima krajšo ročico, zato je opora bližje hladni vodi. Pri enakih masah je opora točno na sredini. Brez računanja tako hitro oceniš, kam pade končna temperatura.

## Drugače: Bolj natančno

**Led pod ničlo.** Led z $-10\,^\circ\mathrm{C}$ se mora najprej segreti do $0\,^\circ\mathrm{C}$. Specifična toplota ledu je približno $2100\,\mathrm{J/(kg\,K)}$, polovica vodne. Za $0{,}05\,\mathrm{kg}$ ledu je to $0{,}05 \cdot 2100 \cdot 10\,\mathrm{J} = 1050\,\mathrm{J}$, šele nato pride taljenje. V bilanci so torej na strani prejete toplote lahko tri postavke: segrevanje ledu, taljenje in segrevanje staljene vode.

**Ko se ves led ne stali.** V $0{,}1\,\mathrm{kg}$ vode z $20\,^\circ\mathrm{C}$ vržeš $0{,}1\,\mathrm{kg}$ ledu z $0\,^\circ\mathrm{C}$. Voda lahko do ničle odda $0{,}1 \cdot 4200 \cdot 20\,\mathrm{J} = 8400\,\mathrm{J}$, taljenje vsega ledu pa bi potrebovalo $33\,600\,\mathrm{J}$. Stali se le $8400 : 336\,000 = 0{,}025\,\mathrm{kg}$ ledu, končna temperatura je $0\,^\circ\mathrm{C}$.

**Izgube.** V resničnem poskusu nekaj toplote uide v zrak, med prenašanjem se kovina malo ohladi. Zato izmerjena specifična toplota odstopa od tabelne. Tekmovalna naloga to včasih vpraša: izgube pomenijo, da je voda prejela manj, kot je kovina oddala.

## Preveri se

? Graf kaže temperaturo ledu, ki ga od $-20\,^\circ\mathrm{C}$ naprej greje grelnik z ves čas enako močjo. Katera trditev drži?
:::risba graf
opis: Graf temperature v odvisnosti od časa. Od 0 do 0,5 minute temperatura naraste od minus 20 do 0 °C. Od 0,5 do 4,5 minute ostane 0 °C. Od 4,5 do 6,5 minute naraste od 0 do 40 °C.
x: 0 .. 7 | 1 | t [min]
y: -20 .. 40 | 10 | T [°C]
črta: 0; -20 -> 0,5; 0 -> 4,5; 0 -> 6,5; 40 | modra debelo
:::
- Med $0{,}5$ in $4{,}5\,\mathrm{min}$ grelnik ne greje, zato temperatura stoji.
~ Grelnik greje ves čas z isto močjo. Toplota gre takrat v taljenje ledu, ne v dvig temperature.
+ Med $0{,}5$ in $4{,}5\,\mathrm{min}$ snov prejema toploto, temperatura pa ostaja $0\,^\circ\mathrm{C}$.
- Led se segreva počasneje kot voda.
~ Poglej naklon: led se segreje za $20\,^\circ\mathrm{C}$ v pol minute, voda za $40\,^\circ\mathrm{C}$ v dveh minutah. Led se segreva hitreje, ker ima manjšo specifično toploto.
- Pri $4{,}5\,\mathrm{min}$ je v posodi še ves led.
~ Pri $4{,}5\,\mathrm{min}$ se taljenje konča. Takrat je v posodi samo voda z $0\,^\circ\mathrm{C}$, ki se nato segreva.
> Na vodoravnem delu se led tali. Toplota prihaja ves čas, porabi pa se za taljenje, zato temperatura ostane $0\,^\circ\mathrm{C}$.

? Zmešaš $0{,}4\,\mathrm{kg}$ vode s $15\,^\circ\mathrm{C}$ in $0{,}1\,\mathrm{kg}$ vode z $90\,^\circ\mathrm{C}$. Kolikšna je končna temperatura v $^\circ\mathrm{C}$?
= 30 °C | 0,5
~ 52,5 | To je navadno povprečje. Masi nista enaki, zato vzemi uteženo povprečje.
~ 75 | Maso si pripisal napačni temperaturi: $0{,}4\,\mathrm{kg}$ ima $15\,^\circ\mathrm{C}$, ne $90\,^\circ\mathrm{C}$.
> $T_z = \dfrac{0{,}4 \cdot 15 + 0{,}1 \cdot 90}{0{,}5} = \dfrac{15}{0{,}5} = 30\,^\circ\mathrm{C}$.

? Kovinska utež z maso $0{,}2\,\mathrm{kg}$ in $100\,^\circ\mathrm{C}$ pade v $0{,}25\,\mathrm{kg}$ vode z $20\,^\circ\mathrm{C}$; kalorimeter zanemarimo. Končna temperatura je $30\,^\circ\mathrm{C}$. Ana je zapisala enačbo z napako: $0{,}2 \cdot c \cdot (100 - 20) = 0{,}25 \cdot 4200 \cdot (30 - 20)$ in dobila $c \approx 656\,\mathrm{J/(kg\,K)}$. Kje je napaka?
- Strani sta zamenjani, ker toploto oddaja voda.
~ Voda se je segrela z $20$ na $30\,^\circ\mathrm{C}$, torej je toploto prejela. Strani sta prav.
+ Utež se ohladi za $100 - 30 = 70\,\mathrm{K}$, ne za $80\,\mathrm{K}$.
- Manjka toplota za taljenje.
~ Nič se ne tali: ni ledu, vse temperature so nad ničlo.
> Vsako telo se spremeni od svoje začetne do končne temperature. Pravilno: $0{,}2 \cdot c \cdot 70 = 10\,500$, torej $c = 750\,\mathrm{J/(kg\,K)}$.

? V vsakem kozarcu je $0{,}2\,\mathrm{kg}$ soka s $30\,^\circ\mathrm{C}$. Dodamo različne hladne dodatke. Razvrsti kozarce od najnižje do najvišje končne temperature.
1. $50\,\mathrm{g}$ ledu z $0\,^\circ\mathrm{C}$
2. $25\,\mathrm{g}$ ledu z $0\,^\circ\mathrm{C}$
3. $50\,\mathrm{g}$ vode z $0\,^\circ\mathrm{C}$
4. $25\,\mathrm{g}$ vode z $0\,^\circ\mathrm{C}$
> Končne temperature so približno $8\,^\circ\mathrm{C}$; $17{,}8\,^\circ\mathrm{C}$; $24\,^\circ\mathrm{C}$ in $26{,}7\,^\circ\mathrm{C}$. Že $25\,\mathrm{g}$ ledu ohladi bolj kot dvakrat več vode, ker pri taljenju vzame veliko toplote.

? Iz bojlerja teče voda s $60\,^\circ\mathrm{C}$. V kadi je že $20\,\mathrm{kg}$ vode s $15\,^\circ\mathrm{C}$. Koliko kilogramov vroče vode moraš doliti za kopel s $36\,^\circ\mathrm{C}$? Kad in zrak zanemari.
= 17,5 kg | 0,1
~ 22,9 | Razliki temperatur si zamenjal. Hladna voda se segreje za $21\,\mathrm{K}$, vroča se ohladi za $24\,\mathrm{K}$.
~ 9,3 | Za vročo vodo si vzel $60 - 15$. Ohladi se le do končne temperature: $60 - 36 = 24\,\mathrm{K}$.
> Bilanca: $20 \cdot 21 = m \cdot 24$, zato $m = 420 : 24 = 17{,}5\,\mathrm{kg}$ (približno $17{,}5$ litra).

<<RACUN
vrednost: (0.6*20+0.2*60)/0.8 | 30
vrednost: 0.6*4200*10 | 25200
vrednost: 0.5*4200*10 | 21000
vrednost: 336000/4200 | 80
vrednost: (0.15*90+0.05*10)/0.2 | 70
resi: 3*(35-15)=m*(80-35) | m | 4/3
resi: 0.2*c*(100-30)=(0.25*4200+210)*(30-20) | c | 900
resi: 0.2*c*(100-30)=0.25*4200*(30-20) | c | 750
resi: 0.2*4200*(25-T)=0.05*336000+0.05*4200*T | T | 4
resi: 0.2*4200*(25-T)=0.05*4200*T | T | 20
resi: 0.2*4200*(25-T)=0.05*336000 | T | 5
vrednost: (0.4*15+0.1*90)/0.5 | 30
resi: 0.2*4200*(30-T)=0.05*336000+0.05*4200*T | T | 8
resi: 0.2*4200*(30-T)=0.025*336000+0.025*4200*T | T | 160/9
vrednost: 0.2*30/0.25 | 24
vrednost: 0.2*30/0.225 | 80/3
resi: 20*(36-15)=m*(60-36) | m | 17.5
vrednost: 0.1*4200*20/336000 | 0.025
>>

:::simboli
Q | toplota | Q = m c \Delta T | J
m | masa | | kg
c | specifična toplota | c = \dfrac{Q}{m \Delta T} | J/(kg\,K) | za vodo $4200\,\mathrm{J/(kg\,K)}$
\Delta T | sprememba temperature | | K | enaka v K in $^\circ\mathrm{C}$
Q_\text{oddana} | oddana toplota | | J | toplejše telo
Q_\text{prejeta} | prejeta toplota | | J | hladnejše telo
m_1, m_2 | masi teles v bilanci | | kg
T_1, T_2 | začetni temperaturi teles | | ^\circ C
c_1, c_2 | specifični toploti teles | | J/(kg\,K)
T_z | končna temperatura | T_z = \dfrac{m_1 T_1 + m_2 T_2}{m_1 + m_2} | ^\circ C | velja za isto snov
Q_t | toplota za taljenje | Q_t = m_l q_t | J
m_l | masa ledu | | kg
q_t | specifična talilna toplota | q_t = \dfrac{Q_t}{m_l} | J/kg | za led $336\,\mathrm{kJ/kg}$
m_v | masa vode (soka) | | kg
T_v | začetna temperatura vode (soka) | | ^\circ C
C | toplotna kapaciteta kalorimetra | C = \dfrac{Q_k}{\Delta T} | J/K
Q_k | toplota, ki jo prejme kalorimeter | Q_k = C \Delta T | J
:::
