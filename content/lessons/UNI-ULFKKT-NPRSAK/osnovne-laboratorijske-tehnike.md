---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Po nevihti zajemi kozarec kalne vode iz luže. Na kuhinjski tehtnici stehtaj prazen kozarec. Nato vanj z merilnim vrčem nalij $200\,\mathrm{mL}$ vode in kozarec stehtaj znova. Razlika bo nekje med $190$ in $210\,\mathrm{g}$, čeprav ima $200\,\mathrm{mL}$ vode maso skoraj točno $200\,\mathrm{g}$.

Kalno vodo precedi skozi filter za kavo. Teče bistra. Je zdaj čista? Kapljico daj na temen krožnik in počakaj, da izhlapi. Ostane bel rob.

Doma si s takim poskusom odgovoriš na dve vprašanji samo približno: kako natančna je bila meritev in kaj filter zadrži. V laboratoriju potrebuješ natančen odgovor. Vsaka vaja se začne s tehtanjem, odmerjanjem tekočine, filtracijo ali čiščenjem trdne snovi. Napaka v teh korakih se prenese v vse nadaljnje račune pri raztopinah in stehiometriji.

## Razlaga

Za vsako tehniko imaš doma ali v naravi preprostejšega sorodnika. Najhitreje se jo naučiš iz razlik med njima.

**Tehtanje: kuhinjska tehtnica proti analitski.** Kuhinjska tehtnica kaže cele grame. V laboratoriju sta dve vrsti tehtnic:

| Tehtnica | zadnja decimalka | kdaj |
|---|---|---|
| kuhinjska | $1\,\mathrm{g}$ | v laboratoriju je ne uporabljamo |
| tehtnica za grobo tehtanje | $0{,}01\,\mathrm{g}$ | večje količine, prekristalizacija |
| analitska | $0{,}0001\,\mathrm{g}$ | priprava standardnih raztopin, analize |

Kar pri kuhanju ni pomembno, pri analitski tehtnici je. Stoji na trdni mizi in ima zaprto steklo, ker jo zmoti že prepih. Libela kaže, ali je vodoravna. Snovi nikoli ne stresemo neposredno na ploščo, ampak na tehtalni čolniček ali urno steklo. Prazno posodico najprej **tariramo**: tehtnica pokaže nič, nato prikaže le maso snovi.

**Ločljivost in relativna negotovost.** Najmanjša sprememba mase, ki jo tehtnica še prikaže (ena enota zadnje decimalke, npr. $0{,}0001\,\mathrm{g}$), je njena **ločljivost** $d$. Za negotovost enega odčitka vzamemo varno oceno $\Delta m = d$. **Relativna negotovost** je $\delta = \dfrac{\Delta m}{m}$, navadno v odstotkih. Naj bo dovoljena relativna negotovost $\delta_\mathrm{max}$. Potem tehtnica z ločljivostjo $d$ zadošča natanko tedaj, ko je $m \geq \dfrac{d}{\delta_\mathrm{max}}$, saj je $\dfrac{d}{m} \leq \delta_\mathrm{max}$ enakovredno tej neenakosti. Mejo $d/\delta_\mathrm{max}$ imenujemo **najmanjša zatehta**.

Pri **tehtanju z razliko** stehtamo zaprt tehtič (stekleničko s pokrovčkom) s snovjo, del snovi stresemo v bučko in tehtič stehtamo znova. Masa vzorca je razlika obeh odčitkov. Tako se izognemo snovi, ki se lepi na čolniček ali vleče vlago iz zraka. Izpišemo vse decimalke, ki jih tehtnica pokaže: $0{,}2500\,\mathrm{g}$ pomeni nekaj drugega kot $0{,}25\,\mathrm{g}$.

**Negotovost razlike.** Naj bosta $m_1$ in $m_2$ odčitka, vsak z negotovostjo $\Delta m$. Potem je negotovost razlike $m = m_2 - m_1$ največ $2\Delta m$. Dokaz: pravi vrednosti ležita v $[m_2 - \Delta m,\ m_2 + \Delta m]$ in $[m_1 - \Delta m,\ m_1 + \Delta m]$. Največja možna razlika je $(m_2 + \Delta m) - (m_1 - \Delta m) = m + 2\Delta m$, najmanjša $m - 2\Delta m$. Če sta napaki naključni in neodvisni, je verjetna negotovost manjša, $\sqrt{2}\,\Delta m$. Pri tehtanju z razliko je torej relativna negotovost $\dfrac{2d}{m}$.

:::premisli
Porcelanski lonček vzameš iz sušilnika in še toplega postaviš na analitsko tehtnico. Napovej: bo prikazana masa prevelika ali premajhna?
---
Premajhna. Topel lonček segreva zrak okoli sebe, ta se dviga in lonček rahlo vleče navzgor. Odčitek se med ohlajanjem še spreminja. Lonček zato najprej ohladimo v eksikatorju, zaprti posodi s sušilom, kjer ne vleče vlage iz zraka.
:::

**Merjenje volumna: merilni vrč proti steklovini.** Kuhinjski merilni vrč ima oznake vsakih $50\,\mathrm{mL}$. Laboratorijska steklovina se razlikuje po tem, kako natančno je umerjena:

| Posoda | namen | približna natančnost |
|---|---|---|
| čaša, erlenmajerica | ocena volumna, mešanje | okoli $5\,\%$ |
| merilni valj | hitro odmerjanje | okoli $0{,}5\,\%$ |
| merilna bučka | natanko določen volumen raztopine | okoli $0{,}1\,\%$ |
| polnilna pipeta, bireta | natanko odmerjen volumen tekočine | okoli $0{,}1\,\%$ |

Pomembna razlika je smer umerjanja. Merilna bučka je umerjena **na vlivanje** (oznaka »In«): ko jo napolniš do oznake, *vsebuje* natanko $250{,}0\,\mathrm{mL}$. Pipeta je umerjena **na izlivanje** (»Ex«): *izlije* natanko svoj volumen, majhna kapljica v konici pa ostane in je ne izpihamo. Pipeto polnimo z nastavkom ali propipeto, nikoli z usti.

**Umerjanje s tehtanjem.** Naj bo $m$ masa vode, ki jo pipeta izlije, in $\rho(T)$ gostota vode pri njeni temperaturi $T$. Potem je izliti volumen $V = \dfrac{m}{\rho(T)}$. Ker je $\rho(20\,^\circ\mathrm{C}) = 0{,}9982\,\mathrm{g/mL}$, je volumen v mililitrih za okoli $0{,}2\,\%$ večji od mase v gramih. To je toliko kot dovoljena napaka polnilne pipete za $10\,\mathrm{mL}$ razreda A ($\pm 0{,}02\,\mathrm{mL}$), zato gostote ne smemo zaokrožiti na $1\,\mathrm{g/mL}$. Pri najnatančnejšem umerjanju dodamo še popravek za vzgon zraka (okoli $0{,}1\,\%$).

V ozki cevi je gladina vode ukrivljena navzdol. Tej ukrivljenosti rečemo **meniskus**. Odčitamo spodnji rob meniskusa, oko pa mora biti v višini oznake. Če gledaš od zgoraj, je odčitek na merilnem valju prevelik, pri polnjenju do oznake pa natočiš premalo; to je **paralaksa**. Pri temnih raztopinah, kot je kalijev permanganat, se spodnjega roba ne vidi, zato odčitamo zgornjega.

Steklovina je umerjena pri $20\,^\circ\mathrm{C}$; vroča tekočina v merilni bučki da napačen volumen.

**Filtracija: filter za kavo proti filtrirnemu papirju.** Filtracija loči trdno snov od tekočine. Trdna snov, ki ostane na filtru, je **oborina**; tekočina, ki steče skozi, je **filtrat**. Tako kot pri kavi gredo raztopljene snovi skozi. Zato je bil filtrat iz luže bister, a ni bil čist: bel rob na krožniku so bile raztopljene soli. Enako naredijo tla z deževnico. Pesek zadrži delce, raztopljeni minerali pa pridejo v podtalnico in v mineralno vodo.

V laboratoriju izberemo eno od dveh poti:

- **Gravitacijska filtracija.** Steklen lij, filtrirni papir, tekočina teče zaradi teže. Nagubani papir ima večjo površino in filtrira hitreje; vzamemo ga, kadar potrebujemo filtrat. Gladko zložen papir uporabimo, kadar zbiramo oborino.
- **Sesalna (vakuumska) filtracija.** Büchnerjev lij (nuča) s ploščatim papirjem na sesalni buči, ki jo priključimo na vodno črpalko. Podtlak potegne tekočino skozi. Je hitra, oborina ostane skoraj suha. Tako zbiramo kristale.

Pri gravitacijski filtraciji papir sega $1\,\mathrm{cm}$ pod rob lija in ga navlažimo, da se prilepi. Tekočino vlivamo po stekleni palčki, gladina pa ostane pod robom papirja. Konica lija se dotika stene čaše, da filtrat ne brizga. Filtrirni papirji se razlikujejo po velikosti por: za fino oborino potrebujemo gostejšega, ki filtrira počasneje.

**Prekristalizacija: soline proti laboratoriju.** V solinah morska voda na soncu izhlapeva in sol izkristalizira. Izhlapevanje pa ne čisti: kar je v slanici, ostane med kristali. **Prekristalizacija** je postopek čiščenja trdne snovi, ki izkoristi drugo lastnost: topnost večine snovi s temperaturo močno narašča.

Koraki:

1. Nečisto snov raztopimo v čim manjši količini vročega topila.
2. Vročo raztopino filtriramo, da odstranimo netopne nečistoče.
3. Filtrat počasi ohladimo, najprej na sobno temperaturo, nato v ledeni kopeli. Topnost pade, čista snov izkristalizira. Nečistoče, ki jih je malo, ostanejo raztopljene v **matičnici**.
4. Kristale odnučamo in speremo z malo ledeno mrzlega topila.
5. Kristale posušimo, stehtamo in izračunamo izkoristek.

Počasno ohlajanje da večje in čistejše kristale. Podobno je v naravi: kristali kremena v votlinah kamnin so rasli zelo počasi, zato so veliki in prozorni.

Ni vsaka snov primerna. Topnost kalijevega nitrata naraste od $31{,}6\,\mathrm{g}$ na $100\,\mathrm{g}$ vode pri $20\,^\circ\mathrm{C}$ na $169\,\mathrm{g}$ pri $80\,^\circ\mathrm{C}$. Topnost natrijevega klorida pa je pri $20\,^\circ\mathrm{C}$ $35{,}9\,\mathrm{g}$ in pri $100\,^\circ\mathrm{C}$ le $39{,}2\,\mathrm{g}$. Zato morsko sol pridobivamo z izhlapevanjem, ne z ohlajanjem.

**Topnost in največji izkoristek.** **Topnost** $S(T)$ je masa snovi, ki se pri temperaturi $T$ raztopi v $100\,\mathrm{g}$ topila, ko je raztopina nasičena. **Izkoristek** prekristalizacije je $\eta = \dfrac{m_\mathrm{kristalov}}{m_0}$, kjer je $m_0$ masa čiste snovi v vzorcu.

*Največji izkoristek.* Naj bo snov z maso $m_0$ raztopljena v najmanjši količini topila pri $T_1$ in ohlajena na $T_2 < T_1$, nečistoče pa naj ne spreminjajo njene topnosti in pri $T_2$ naj se vzpostavi ravnotežje (brez prenasičenja). Potem je

$$\eta_\mathrm{max} = 1 - \frac{S(T_2)}{S(T_1)}.$$

Izpeljava: najmanjša masa topila je $m_\mathrm{v} = \dfrac{m_0}{S(T_1)} \cdot 100\,\mathrm{g}$. Pri $T_2$ ostane raztopljeno $\dfrac{S(T_2)}{100\,\mathrm{g}} \cdot m_\mathrm{v} = m_0\dfrac{S(T_2)}{S(T_1)}$. Izkristalizira razlika $m_0\left(1 - \dfrac{S(T_2)}{S(T_1)}\right)$; delimo z $m_0$. Izkoristek ni odvisen od mase vzorca, le od razmerja topnosti: za $\mathrm{KNO_3}$ med $80$ in $20\,^\circ\mathrm{C}$ je $1 - \dfrac{31{,}6}{169} \approx 0{,}81$, za $\mathrm{NaCl}$ med $100$ in $20\,^\circ\mathrm{C}$ le $1 - \dfrac{35{,}9}{39{,}2} \approx 0{,}084$. Dejanski izkoristek je manjši (več topila, izgube pri spiranju in prenosu). Nečistoča z maso $m_\mathrm{n}$ in topnostjo $S_\mathrm{n}$ ostane v matičnici, če je $m_\mathrm{n} \leq \dfrac{S_\mathrm{n}(T_2)}{100\,\mathrm{g}} \cdot m_\mathrm{v}$.

:::premisli
Sošolec raztopi snov v veliko več vročega topila, kot je nujno, »da se bo gotovo vse raztopilo«. Kaj se zgodi med ohlajanjem in zakaj dobi malo kristalov?
---
Ob ohlajanju raztopina sploh ne postane nasičena ali pa le malo. Kristalizira malo snovi, večina ostane v matičnici. Izkoristek je majhen.
:::

## Rešeni primeri

### Primer 1: katera tehtnica zadošča?

Po toči želiš stehtati zrno toče z maso okoli $3\,\mathrm{g}$, in sicer z relativno negotovostjo največ $1\,\%$. Na voljo so kuhinjska tehtnica (zadnja decimalka $1\,\mathrm{g}$), tehtnica za grobo tehtanje ($0{,}01\,\mathrm{g}$) in analitska ($0{,}0001\,\mathrm{g}$).

**Podatki:** $m \approx 3\,\mathrm{g}$, zadnje decimalke treh tehtnic ($1\,\mathrm{g}$; $0{,}01\,\mathrm{g}$; $0{,}0001\,\mathrm{g}$), dovoljeno največ $1\,\%$
**Iščemo:** relativno negotovost za vsako tehtnico in najprimernejšo tehtnico

:::formula
Relativna negotovost $= \dfrac{\Delta m}{m} \cdot 100\,\%$, kjer je $\Delta m$ zadnja decimalka tehtnice
:::

**Rešitev:**

1. Kuhinjska: $\dfrac{1}{3} \cdot 100\,\% \approx 33\,\%$. Veliko preveč.
2. Za grobo tehtanje: $\dfrac{0{,}01}{3} \cdot 100\,\% \approx 0{,}33\,\%$. Manj kot $1\,\%$.
3. Analitska: $\dfrac{0{,}0001}{3} \cdot 100\,\% \approx 0{,}0033\,\%$. Natančnejša, kot je treba, in toča bi se med počasnim tehtanjem v zaprti komori talila.
4. Odgovor: zadošča tehtnica za grobo tehtanje z relativno negotovostjo okoli $0{,}33\,\%$.

### Primer 2: preverjanje pipete s tehtanjem

Polnilno pipeto za $10\,\mathrm{mL}$ preverimo tako, da izlijemo destilirano vodo v stehtano čašo. Prazna čaša ima maso $48{,}1237\,\mathrm{g}$, z vodo $58{,}0989\,\mathrm{g}$. Voda ima $20\,^\circ\mathrm{C}$ in gostoto $0{,}9982\,\mathrm{g/mL}$. Koliko vode je pipeta res izlila?

**Podatki:** $m_1 = 48{,}1237\,\mathrm{g}$, $m_2 = 58{,}0989\,\mathrm{g}$, $\rho = 0{,}9982\,\mathrm{g/mL}$, nazivni volumen $10\,\mathrm{mL}$
**Iščemo:** dejanski volumen $V$

:::formula
$m = m_2 - m_1$, $\quad V = \dfrac{m}{\rho}$
:::

**Rešitev:**

1. Masa vode je razlika obeh tehtanj: $58{,}0989 - 48{,}1237 = 9{,}9752$, torej $m = 9{,}9752\,\mathrm{g}$.
2. Volumen dobimo iz gostote. Gostota ni točno $1\,\mathrm{g/mL}$, zato delimo: $V = \dfrac{9{,}9752\,\mathrm{g}}{0{,}9982\,\mathrm{g/mL}} \approx 9{,}993\,\mathrm{mL}$.
3. Odstopanje od nazivnega volumna je $0{,}007\,\mathrm{mL}$, kar je manj kot $0{,}1\,\%$.
4. Odgovor: pipeta izlije $9{,}993\,\mathrm{mL}$ in je ustrezna.

### Primer 3: prekristalizacija kalijevega nitrata

Imamo $50\,\mathrm{g}$ nečistega kalijevega nitrata, ki vsebuje $45\,\mathrm{g}$ $\mathrm{KNO_3}$ in $5\,\mathrm{g}$ $\mathrm{NaCl}$. Raztopimo ga v najmanjši potrebni količini vode pri $80\,^\circ\mathrm{C}$ in ohladimo na $20\,^\circ\mathrm{C}$. (a) Koliko čistega $\mathrm{KNO_3}$ dobimo in kolikšen je izkoristek? (b) Ali $\mathrm{NaCl}$ ostane v raztopini in največ koliko ga sme biti v vzorcu, da še ostane? (c) Kolikšen bi bil izkoristek, če bi po nepotrebnem vzeli $20\,\%$ več vode? Predpostavi, da se soli pri topnosti ne motita.

**Podatki:** $m(\mathrm{KNO_3}) = 45\,\mathrm{g}$, $m(\mathrm{NaCl}) = 5\,\mathrm{g}$; topnost $\mathrm{KNO_3}$: $169\,\mathrm{g}$ na $100\,\mathrm{g}$ vode pri $80\,^\circ\mathrm{C}$ in $31{,}6\,\mathrm{g}$ na $100\,\mathrm{g}$ vode pri $20\,^\circ\mathrm{C}$; topnost $\mathrm{NaCl}$ pri $20\,^\circ\mathrm{C}$: $35{,}9\,\mathrm{g}$ na $100\,\mathrm{g}$ vode; v (c) $1{,}20$-krat več vode
**Iščemo:** maso kristalov, izkoristek, največjo dopustno maso $\mathrm{NaCl}$ in izkoristek pri več vode

:::formula
Masa vode: $m_\mathrm{v} = \dfrac{m(\mathrm{KNO_3})}{169} \cdot 100\,\mathrm{g}$; ostane raztopljeno: $\dfrac{31{,}6}{100} \cdot m_\mathrm{v}$; izkoristek $= \dfrac{m_\mathrm{kristalov}}{45\,\mathrm{g}} \cdot 100\,\%$
:::

**Rešitev:**

1. Najmanj vode raztopi ves nitrat pri $80\,^\circ\mathrm{C}$: $m_\mathrm{v} = \dfrac{45}{169} \cdot 100\,\mathrm{g} \approx 26{,}6\,\mathrm{g}$.
2. Pri $20\,^\circ\mathrm{C}$ ostane raztopljeno: $0{,}316 \cdot 26{,}6 \approx 8{,}4$, torej $8{,}4\,\mathrm{g}$ $\mathrm{KNO_3}$.
3. Izkristalizira: $45 - 8{,}4 = 36{,}6$, torej $36{,}6\,\mathrm{g}$.
4. Izkoristek: $\dfrac{36{,}6}{45} \cdot 100\,\% \approx 81\,\%$. Isto da izrek o največjem izkoristku: $1 - \dfrac{31{,}6}{169} \approx 0{,}81$.
5. V $26{,}6\,\mathrm{g}$ vode se pri $20\,^\circ\mathrm{C}$ raztopi do $0{,}359 \cdot 26{,}63 \approx 9{,}6\,\mathrm{g}$ $\mathrm{NaCl}$. Imamo ga le $5\,\mathrm{g}$, zato ostane raztopljen v matičnici. To je tudi odgovor na obratno vprašanje: vzorec sme vsebovati največ okoli $9{,}6\,\mathrm{g}$ $\mathrm{NaCl}$.
6. (c) Vode je $1{,}20 \cdot 26{,}6 \approx 31{,}9\,\mathrm{g}$. Raztopljenega ostane $0{,}316 \cdot 31{,}9 \approx 10{,}1\,\mathrm{g}$ $\mathrm{KNO_3}$, izkristalizira $45 - 10{,}1 = 34{,}9\,\mathrm{g}$.
7. Izkoristek: $\dfrac{34{,}9}{45} \cdot 100\,\% \approx 78\,\%$. Vsak gram odvečne vode zadrži $0{,}316\,\mathrm{g}$ produkta v matičnici.
8. Odgovor: dobimo okoli $36{,}6\,\mathrm{g}$ čistega $\mathrm{KNO_3}$ z izkoristkom $81\,\%$; $\mathrm{NaCl}$ ostane v raztopini, dokler ga ni več kot okoli $9{,}6\,\mathrm{g}$; z $20\,\%$ več vode izkoristek pade na okoli $78\,\%$.

### Primer 4: zdaj ti – koliko je deževalo?

Dežemer ima lovilno odprtino s površino $200\,\mathrm{cm^2}$. Po nalivu vodo iz zbiralnika prelijemo v merilni valj, ki pokaže $150\,\mathrm{mL}$. Koliko milimetrov padavin je padlo?

**Podatki:** $A = 200\,\mathrm{cm^2}$, $V = 150\,\mathrm{mL}$
**Iščemo:** višino padavin $h$ v milimetrih

:::formula
$h = \dfrac{V}{A}$
:::

**Rešitev:**

1. Merilni valj je dovolj natančen; čaša bi dala napako okoli $5\,\%$.
2. Enote uskladimo: $150\,\mathrm{mL} = 150\,\mathrm{cm^3}$.
3. Izračunaj $h$ v centimetrih in pretvori v milimetre.

:::premisli
Koliko milimetrov padavin je padlo?
---
$h = \dfrac{150\,\mathrm{cm^3}}{200\,\mathrm{cm^2}} = 0{,}75\,\mathrm{cm} = 7{,}5\,\mathrm{mm}$. To je $7{,}5$ litra vode na kvadratni meter.
:::

## Pogoste napake

- **Topel predmet na tehtnici.** Kdor tehta še topel lonček, dobi premajhno maso, ker topel zrak vleče lonček navzgor. Pravilno: ohladi ga v eksikatorju na sobno temperaturo.
- **Odčitek od zgoraj ali po zgornjem robu.** Oko nad oznako da paralakso: odčitek je prevelik, pri polnjenju do oznake pa natočiš premalo. Pri brezbarvnih raztopinah odčitaj spodnji rob meniskusa, z očesom v višini oznake.
- **Natančen volumen s čašo.** Oznake na čaši in erlenmajerici so le za oceno, napaka je okoli $5\,\%$. Za natančen volumen vzemi pipeto, bireto ali merilno bučko.
- **Izpihovanje zadnje kapljice.** Polnilna pipeta je umerjena na izlivanje s kapljico, ki ostane v konici. Če jo izpihaš, odmeriš preveč.
- **»Bister filtrat je čist.«** Filter zadrži le neraztopljene delce. Raztopljene soli gredo skozi, kot je pokazal bel rob na krožniku.
- **Preveč topila ali hitro hlajenje pri prekristalizaciji.** Preveč topila zmanjša izkoristek, hitro hlajenje v ledu pa da drobne kristale, ki ujamejo nečistoče. Raztapljaj v najmanjši količini vročega topila in hladi počasi.

## Povzetek

- Tehtnice: kuhinjska $1\,\mathrm{g}$, za grobo tehtanje $0{,}01\,\mathrm{g}$, analitska $0{,}0001\,\mathrm{g}$. Tariraj, tehtaj na čolničku, nikoli toplih predmetov; tehtanje z razliko za občutljive snovi.
- Natančen volumen: merilna bučka (»In«, vsebuje), pipeta in bireta (»Ex«, izlijeta). Čaša in erlenmajerica sta le za oceno. Odčitaj spodnji rob meniskusa z očesom v višini oznake, pri $20\,^\circ\mathrm{C}$.
- Filtracija loči trdno od tekočega; raztopljene snovi gredo skozi. Gravitacijska filtracija za filtrat, sesalna (nuča) za oborino in kristale.
- Prekristalizacija: raztopi v najmanj vročega topila, vroče filtriraj, počasi ohladi, odnučaj, speri z malo mrzlega topila, posuši. Deluje, če topnost s temperaturo močno raste; nečistoče ostanejo v matičnici.
- Izkoristek prekristalizacije je vedno pod $100\,\%$, ker del snovi ostane raztopljen.

## Za izpit

Znati moraš povedati:

- definicijo ločljivosti, relativne negotovosti in najmanjše zatehte ter pogoj $m \geq d/\delta_\mathrm{max}$;
- dokaz, da je negotovost razlike dveh odčitkov največ $2\Delta m$;
- razliko med umerjenostjo »In« in »Ex«, pravilno odčitavanje meniskusa in umerjanje pipete s tehtanjem $V = m/\rho(T)$;
- definicijo topnosti in izkoristka, izrek $\eta_\mathrm{max} = 1 - S(T_2)/S(T_1)$ s pogoji in njegovo izpeljavo ter pogoj, da nečistoča ostane v matičnici;
- korake prekristalizacije in razlog za vsakega (vroča filtracija, počasno hlajenje, spiranje z mrzlim topilom).

### Naloga 1

Vzorec vsebuje $52{,}0\,\mathrm{g}$ $\mathrm{KNO_3}$ in $8{,}0\,\mathrm{g}$ $\mathrm{NaCl}$. Pri $80\,^\circ\mathrm{C}$ ga raztopiš v vodi, ki je je $10\,\%$ več od najmanjše potrebne (da med vročo filtracijo ne kristalizira), in ohladiš na $20\,^\circ\mathrm{C}$. Kristale speremo s $5{,}0\,\mathrm{g}$ vode pri $0\,^\circ\mathrm{C}$, ki se pri tem nasiti s $\mathrm{KNO_3}$. Topnosti na $100\,\mathrm{g}$ vode: $\mathrm{KNO_3}$ $169\,\mathrm{g}$ ($80\,^\circ\mathrm{C}$), $31{,}6\,\mathrm{g}$ ($20\,^\circ\mathrm{C}$), $13{,}3\,\mathrm{g}$ ($0\,^\circ\mathrm{C}$); $\mathrm{NaCl}$ $35{,}9\,\mathrm{g}$ ($20\,^\circ\mathrm{C}$). Soli se pri topnosti ne motita. (a) Koliko čistega $\mathrm{KNO_3}$ dobiš in kolikšen je izkoristek? (b) Matičnico upariš na polovico vode in znova ohladiš na $20\,^\circ\mathrm{C}$. Koliko $\mathrm{KNO_3}$ izkristalizira v drugem obroku in ali je ta obrok čist?

**Rešitev:**

1. Najmanj vode: $\dfrac{52{,}0}{169} \cdot 100\,\mathrm{g} \approx 30{,}8\,\mathrm{g}$; z $10\,\%$ več je $m_\mathrm{v} = 1{,}10 \cdot 30{,}77 \approx 33{,}8\,\mathrm{g}$.
2. Pri $20\,^\circ\mathrm{C}$ ostane raztopljeno $0{,}316 \cdot 33{,}8 \approx 10{,}7\,\mathrm{g}$ $\mathrm{KNO_3}$, zato izkristalizira $52{,}0 - 10{,}7 = 41{,}3\,\mathrm{g}$.
3. $\mathrm{NaCl}$: v $33{,}8\,\mathrm{g}$ vode se ga raztopi do $0{,}359 \cdot 33{,}8 \approx 12{,}1\,\mathrm{g}$, imamo $8{,}0\,\mathrm{g}$, zato prvi obrok ostane čist.
4. Spiranje: nasičena voda pri $0\,^\circ\mathrm{C}$ odnese $0{,}133 \cdot 5{,}0 \approx 0{,}67\,\mathrm{g}$ kristalov. Ostane $41{,}3 - 0{,}67 \approx 40{,}6\,\mathrm{g}$.
5. Izkoristek: $\dfrac{40{,}6}{52{,}0} \cdot 100\,\% \approx 78\,\%$ (največji možni bi bil $81\,\%$).
6. (b) V matičnici je $10{,}7\,\mathrm{g}$ $\mathrm{KNO_3}$ in $8{,}0\,\mathrm{g}$ $\mathrm{NaCl}$ v $\dfrac{33{,}8}{2} \approx 16{,}9\,\mathrm{g}$ vode.
7. Pri $20\,^\circ\mathrm{C}$ ostane raztopljeno $0{,}316 \cdot 16{,}92 \approx 5{,}35\,\mathrm{g}$ $\mathrm{KNO_3}$; izkristalizira $10{,}70 - 5{,}35 \approx 5{,}3\,\mathrm{g}$ (točno polovica, ker je vode pol manj).
8. $\mathrm{NaCl}$ se raztopi le do $0{,}359 \cdot 16{,}9 \approx 6{,}1\,\mathrm{g}$, zato izkristalizira še $8{,}0 - 6{,}1 \approx 1{,}9\,\mathrm{g}$ $\mathrm{NaCl}$.
9. Odgovor: prvi obrok da okoli $40{,}6\,\mathrm{g}$ čistega $\mathrm{KNO_3}$ z izkoristkom $78\,\%$. Drugi obrok ima okoli $5{,}3\,\mathrm{g}$ $\mathrm{KNO_3}$, a z njim izkristalizira okoli $1{,}9\,\mathrm{g}$ $\mathrm{NaCl}$, zato ni čist in ga moramo prekristalizirati znova.

### Naloga 2

Natančno definiraj topnost in izkoristek prekristalizacije. Navedi pogoje in izpelji izraz za največji izkoristek. Utemelji, ali je smiselno $\mathrm{NaCl}$ čistiti s prekristalizacijo iz vode, če je njegova topnost $39{,}2\,\mathrm{g}$ na $100\,\mathrm{g}$ vode pri $100\,^\circ\mathrm{C}$ in $35{,}9\,\mathrm{g}$ pri $20\,^\circ\mathrm{C}$.

**Rešitev:**

1. Topnost $S(T)$ je masa snovi, ki se pri temperaturi $T$ raztopi v $100\,\mathrm{g}$ topila do nasičenja. Izkoristek je $\eta = m_\mathrm{kristalov}/m_0$.
2. Pogoji: snov z maso $m_0$ raztopimo v najmanjši količini topila pri $T_1$ (raztopina je pri $T_1$ ravno nasičena), ohladimo na $T_2 < T_1$, nečistoče ne vplivajo na topnost, ravnotežje se vzpostavi.
3. Masa topila: $m_\mathrm{v} = \dfrac{m_0}{S(T_1)} \cdot 100\,\mathrm{g}$.
4. Pri $T_2$ ostane raztopljeno $\dfrac{S(T_2)}{100\,\mathrm{g}} \cdot m_\mathrm{v} = m_0\dfrac{S(T_2)}{S(T_1)}$.
5. Izkristalizira $m_0 - m_0\dfrac{S(T_2)}{S(T_1)}$, zato $\eta_\mathrm{max} = 1 - \dfrac{S(T_2)}{S(T_1)}$.
6. Za $\mathrm{NaCl}$: $\eta_\mathrm{max} = 1 - \dfrac{35{,}9}{39{,}2} \approx 0{,}084$.
7. Odgovor: ne. Tudi v idealnem primeru dobimo le okoli $8\,\%$ soli, ker se topnost $\mathrm{NaCl}$ s temperaturo skoraj ne spremeni. Sol iz raztopine izločimo z izparevanjem topila, ki ga ustavimo, preden se začnejo izločati nečistoče.

## Drugače: Na sliki

Sesalna filtracija od zgoraj navzdol:

```
  Büchnerjev lij (nuča)
  + ploščat filtrirni papir
         │
  gumijasto tesnilo
         │
  sesalna buča ──── cev ──── vodna črpalka
  (filtrat)
```

Papir pokrije luknjice nuče, a ne sega na stene; navlažimo ga, da se prisesa. Na koncu najprej odklopimo cev, nato zapremo vodo, sicer voda vdre v bučo.

Meniskus je kot plitva skodelica: z očesom v višini oznake se oznaka dotika njenega dna.

## Drugače: Uporaba v stroki

- **Tehtanje.** Farmacevtski laboratoriji za vsako tehtnico določijo najmanjšo zatehto (farmakopejska meja $0{,}10\,\%$) in tehtnico vsak dan preverijo s certificiranimi utežmi.
- **Volumen.** Pipete in birete redno umerjajo s tehtanjem vode po standardu ISO, kot v primeru 2.
- **Filtracija.** Raztopine za injiciranje, ki ne prenesejo avtoklaviranja, sterilizirajo s filtracijo skozi membrano s porami $0{,}22\,\mu\mathrm{m}$.
- **Prekristalizacija.** Je zadnja stopnja čiščenja zdravilnih učinkovin; pogoji določijo čistoto in kristalno obliko (polimorf), od katere je odvisna topnost učinkovine.

## Preveri se

? Pri kateri nalogi je posoda izbrana in uporabljena pravilno?
- čaša – natančno odmerim $25{,}00\,\mathrm{mL}$ vzorca
~ Oznake na čaši so le za oceno, napaka je okoli $5\,\%$.
+ merilna bučka – pripravim natanko $250{,}0\,\mathrm{mL}$ raztopine
- polnilna pipeta – po izlivanju izpiham zadnjo kapljico
~ Pipeta je umerjena na izlivanje s kapljico, ki ostane v konici. Z izpihovanjem odmeriš preveč.
- merilni valj – izlije natanko toliko kot pipeta
~ Merilni valj je približno petkrat manj natančen od pipete; za hitro, ne natančno odmerjanje.
> Merilna bučka je umerjena na vlivanje: napolnjena do oznake vsebuje natanko nazivni volumen.

? V $100\,\mathrm{g}$ vrele vode raztopiš $39{,}2\,\mathrm{g}$ $\mathrm{NaCl}$ in raztopino ohladiš na $20\,^\circ\mathrm{C}$, kjer je topnost $35{,}9\,\mathrm{g}$ na $100\,\mathrm{g}$ vode. Približno koliko soli izkristalizira?
- okoli $36\,\mathrm{g}$
~ $35{,}9\,\mathrm{g}$ je količina, ki *ostane raztopljena*, ne tista, ki izkristalizira.
+ okoli $3\,\mathrm{g}$
- skoraj vsa, okoli $39\,\mathrm{g}$
~ Ohlajanje ne izloči vse snovi; izpade le razlika med topnostma.
> Izpade le razlika $39{,}2 - 35{,}9 = 3{,}3\,\mathrm{g}$. Zato kuhinjske soli ne čistimo s prekristalizacijo iz vode, ampak jo pridobivamo z izhlapevanjem.

? Zakaj kristale na nuči speremo z malo ledeno mrzlega topila in ne s toplim?
- Ker mrzlo topilo hitreje izhlapi in kristali so prej suhi.
~ Mrzlo topilo izhlapeva počasneje kot toplo; razlog je topnost.
+ Ker se v mrzlem topilu raztopi najmanj kristalov, nečistoče z njihove površine pa vseeno speremo.
- Ker toplo topilo razbije kristale na drobne koščke.
~ Toplo topilo kristale raztaplja, ne lomi. Izgubili bi del pridelka.
> Topnost je pri nizki temperaturi najmanjša. Matičnico s površine speremo, kristalov pa izgubimo čim manj.

? Pipeto za $25\,\mathrm{mL}$ preverjaš s tehtanjem vode pri $20\,^\circ\mathrm{C}$ ($\rho = 0{,}9982\,\mathrm{g/mL}$). Kolikšno maso vode mora izliti, če je točna?
- $25{,}00\,\mathrm{g}$
~ To velja le, če je gostota vode točno $1\,\mathrm{g/mL}$. Pri $20\,^\circ\mathrm{C}$ je nekoliko manjša.
- $25{,}05\,\mathrm{g}$
~ Tu si volumen delil z gostoto. Masa je zmnožek: $m = \rho V$.
+ $24{,}96\,\mathrm{g}$
> $m = \rho V = 0{,}9982\,\mathrm{g/mL} \cdot 25{,}00\,\mathrm{mL} \approx 24{,}96\,\mathrm{g}$.

? Mešanica vsebuje modro galico, nekaj peska in malo topne nečistoče. Kateri postopek da čisto modro galico?
- Raztopiš v vroči vodi, raztopino ohladiš in nato filtriraš.
~ Pesek bi pristal na filtru skupaj s kristali. Netopne delce odstrani vroča filtracija pred ohlajanjem.
- Raztopiš v hladni vodi, filtriraš in filtrat izpariš do suhega.
~ Pesek odstraniš, topna nečistoča pa pri izparevanju do suhega ostane med kristali, kot v solinah.
+ Raztopiš v čim manj vroče vode, vroče filtriraš, filtrat počasi ohladiš in kristale odnučaš.
> Vroča filtracija odstrani pesek, ohlajanje izloči modro galico, topna nečistoča pa ostane v matičnici.

:::simboli
\Delta m | negotovost tehtanja (zadnja decimalka tehtnice) | | g |
m | stehtana masa | m = m_2 - m_1 | g | pri umerjanju pipete masa odpipetirane vode
m_2 | masa posode z vodo | | g |
m_1 | masa prazne posode | | g |
V | prostornina | V = \dfrac{m}{\rho} | mL |
\rho | gostota vode | | g/mL | 0,9982 g/mL pri 20 °C
m_\mathrm{v} | masa vode za raztapljanje | | g | pri 80 °C se v 100 g vode raztopi 169 g KNO₃
m_\mathrm{kristalov} | masa izločenih kristalov | | g |
d | ločljivost tehtnice (zadnja decimalka) | | g |
\delta | relativna negotovost | \delta = \dfrac{\Delta m}{m} | – | najmanjša zatehta d/δ_max
S | topnost pri temperaturi T | | g na 100 g topila | S(T₁), S(T₂), S_n za nečistočo
T_1 | temperatura raztapljanja | | °C |
T_2 | končna temperatura ohlajanja | | °C |
m_0 | masa čiste snovi v vzorcu | | g |
\eta | izkoristek | \eta = \dfrac{m_\mathrm{kristalov}}{m_0} | – |
\eta_\mathrm{max} | največji izkoristek prekristalizacije | \eta_\mathrm{max} = 1 - \dfrac{S(T_2)}{S(T_1)} | – |
m_\mathrm{n} | masa nečistoče | | g |
h | višina padavin | h = \dfrac{V}{A} | mm |
A | ploščina odprtine dežemera | | cm^2 |
:::
