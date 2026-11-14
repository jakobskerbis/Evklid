---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Doma pripravi žele (želatino) v dveh enakih kozarčkih in počakaj, da se strdi. Na vsakega kani kapljico jedilne barve. En kozarček postavi v hladilnik, drugega pusti v sobi. Čez eno uro in čez štiri ure z ravnilom ob steni kozarčka izmeri, kako globoko je segla barva.

V sobi izmeriš približno tole:

| čas $t$ | globina obarvanja |
|---|---|
| $1\,\mathrm{h}$ | $3\,\mathrm{mm}$ |
| $4\,\mathrm{h}$ | $6\,\mathrm{mm}$ |

V hladilniku je barva po istem času segla manj globoko. Nihče ni mešal, žele se ne pretaka, barva pa vseeno potuje. Temu pravimo **difuzija**: delci se zaradi naključnega gibanja razširijo iz kraja z veliko koncentracijo proti kraju z majhno.

Enako se dogaja v kamninah, a neprimerno počasneje. Kristali granata v metamorfnih kamninah imajo plasti različne sestave, ki se po milijonih let le delno zabrišejo; iz tega geologi razberejo, kako hitro se je kamnina ohlajala. V tehniki z difuzijo površinsko utrjujemo zobnike (cementacija), spajkamo kovine in razumemo, zakaj se jeklo s časom »stara«. Za vse to potrebujemo dve stvari: koliko snovi prehaja (Fickova zakona) in kako hitro se to zgodi pri dani temperaturi (aktivacijska energija).

## Razlaga

Iz kemije poznaš difuzijo v plinu in tekočini: vonj parfuma napolni sobo, sladkor se razporedi po čaju. Difuzija v trdnem je ista ideja, le da se atomi premikajo drugače. Teorijo zgradimo v štirih vprašanjih.

**1. Kako se atom sploh premakne?** V tekočini se molekule prosto rinejo mimo sosedov. V kovini sedi vsak atom na svojem mestu v kristalni mreži in le niha okoli njega. Premakne se samo s **skokom** na sosednje mesto, in to le, če je tam prostor. Možna sta dva načina:

- **vakančna difuzija**: atom skoči na sosednje prazno mesto v mreži (**vakanco**); tako difundirajo atomi, ki so podobno veliki kot atomi mreže (Fe v Fe, Zn v Cu);
- **intersticijska difuzija**: majhen atom (C, N, H) skače po praznih prostorih *med* atomi mreže (intersticijah); teh je veliko, zato je ta difuzija mnogo hitrejša.

:::premisli
Žele iz uvoda: po $1\,\mathrm{h}$ je barva segla $3\,\mathrm{mm}$, po $4\,\mathrm{h}$ pa $6\,\mathrm{mm}$. Napovej globino po $16\,\mathrm{h}$. Kaj opaziš pri razmerju časov in globin?
---
Približno $12\,\mathrm{mm}$. Ko se čas poveča štirikrat, se globina le podvoji. Globina raste s korenom časa, ne premo s časom. To bo pokazal 2. Fickov zakon.
:::

**2. Koliko snovi preteče? 1. Fickov zakon.** Pri difuziji nas zanima, koliko snovi gre v sekundi skozi en kvadratni meter ploskve. To je **difuzijski tok** $J$, v $\mathrm{kg/(m^2\,s)}$ ali $\mathrm{atomov/(m^2\,s)}$. Tok je tem večji, čim strmeje se koncentracija $C$ spreminja s krajem $x$. Strmino opiše **koncentracijski gradient** $\dfrac{dC}{dx}$:

$$J = -D\,\frac{dC}{dx}$$

To je **1. Fickov zakon**. Sorazmernostni faktor $D$ je **difuzijski koeficient** v $\mathrm{m^2/s}$: pove, kako lahkotno se snov giblje skozi material. Minus pove smer: snov teče *navzdol* po koncentraciji, od več proti manj. Kadar se koncentracije s časom ne spreminjajo (**stacionarno stanje**), na primer pri plinu, ki ves čas prehaja skozi ravno steno posode, je profil $C(x)$ v steni pri stalnem $D$ premica: skozi vsako plast stene mora teči enak tok, zato je gradient povsod enak.

**3. Kaj, ko se profil spreminja? 2. Fickov zakon.** Pri cementaciji ali v želeju se koncentracija na vsakem mestu s časom spreminja. Takrat velja **2. Fickov zakon** (za $D$, ki ni odvisen od koncentracije):

$$\frac{\partial C}{\partial t} = D\,\frac{\partial^2 C}{\partial x^2}$$

Desna stran meri ukrivljenost profila: kjer je profil močno ukrivljen, se koncentracija spreminja najhitreje, na premici pa se ne spreminja. Za pogost primer debelega kosa (difuzija ne doseže druge strani), ko je na površini ves čas enaka koncentracija $C_s$, v notranjosti pa je bila na začetku $C_0$, je rešitev:

$$\frac{C_x - C_0}{C_s - C_0} = 1 - \mathrm{erf}\left(\frac{x}{2\sqrt{D t}}\right)$$

Tu je $C_x$ koncentracija v globini $x$ po času $t$, $\mathrm{erf}$ pa **funkcija napake**, ki jo odčitamo iz tabele:

| $z$ | $\mathrm{erf}(z)$ | $z$ | $\mathrm{erf}(z)$ |
|---|---|---|---|
| $0{,}2$ | $0{,}223$ | $0{,}8$ | $0{,}742$ |
| $0{,}4$ | $0{,}428$ | $1{,}0$ | $0{,}843$ |
| $0{,}477$ | $0{,}500$ | $1{,}5$ | $0{,}966$ |
| $0{,}6$ | $0{,}604$ | $2{,}0$ | $0{,}995$ |

Iz rešitve sledi pravilo za oceno: dano koncentracijo dosežemo vedno pri istem $\dfrac{x}{\sqrt{Dt}}$. Značilna globina difuzije je zato reda $x \approx \sqrt{D t}$. Za dvakrat globlje potrebuješ štirikrat več časa. Natanko to je pokazal žele.

**4. Kako hitro atomi skačejo? Aktivacijska energija.** Med skokom mora atom razriniti sosede. Za to potrebuje energijo, ki jo dobi le občasno, iz toplotnega nihanja. Najmanjšo energijo za skok (na mol atomov) imenujemo **aktivacijska energija** $Q$, v $\mathrm{J/mol}$. Delež atomov z dovolj energije močno raste s temperaturo, zato:

$$D = D_0\, e^{-Q/(RT)}$$

$D_0$ je predeksponentni faktor ($\mathrm{m^2/s}$), $R = 8{,}314\,\mathrm{J/(mol\,K)}$ splošna plinska konstanta, $T$ temperatura **v kelvinih**. Večji $Q$ pomeni počasnejšo difuzijo in močnejšo odvisnost od temperature. Intersticijski ogljik v železu ($Q \approx 87\,\mathrm{kJ/mol}$ v α-Fe) ima precej manjšo aktivacijsko energijo kot železo samo ($Q \approx 251\,\mathrm{kJ/mol}$).

Za primerjavo z znanim svetom:

| Kaj difundira | $D$ [$\mathrm{m^2/s}$] |
|---|---|
| barvilo v vodi ali želeju, $20\,^\circ\mathrm{C}$ | okoli $10^{-9}$ |
| C v γ-Fe, $1000\,^\circ\mathrm{C}$ | $2 \cdot 10^{-11}$ |
| C v α-Fe, $20\,^\circ\mathrm{C}$ | $3 \cdot 10^{-22}$ |
| Fe v α-Fe, $500\,^\circ\mathrm{C}$ | $3 \cdot 10^{-21}$ |

:::premisli
Cementacijo jekla izvajamo pri $900\,^\circ\mathrm{C}$. Če temperaturo dvignemo na $1000\,^\circ\mathrm{C}$, se absolutna temperatura poveča le za okoli $8{,}5\,\%$. Napovej: ali se tudi $D$ poveča le za toliko? ($Q = 148\,\mathrm{kJ/mol}$)
---
Ne, poveča se okoli $3{,}3$-krat. Temperatura je v eksponentu: $\dfrac{D_{1000}}{D_{900}} = e^{\frac{Q}{R}\left(\frac{1}{1173\,\mathrm{K}} - \frac{1}{1273\,\mathrm{K}}\right)} \approx e^{1{,}19} \approx 3{,}3$. Zato v kalilnicah temperaturo peči nadzirajo na nekaj stopinj natančno.
:::

## Rešeni primeri

### Primer 1: tok ogljika skozi jekleno ploščo

Jeklena plošča je pri $700\,^\circ\mathrm{C}$ na eni strani v atmosferi, bogati z ogljikom, na drugi v atmosferi brez njega. Vzpostavilo se je stacionarno stanje. V globini $2\,\mathrm{mm}$ je koncentracija ogljika $1{,}5\,\mathrm{kg/m^3}$, v globini $6\,\mathrm{mm}$ pa $0{,}5\,\mathrm{kg/m^3}$. Difuzijski koeficient je $3 \cdot 10^{-11}\,\mathrm{m^2/s}$. Kolikšen je tok ogljika in koliko ogljika gre v eni uri skozi $0{,}5\,\mathrm{m^2}$ plošče?

**Podatki:** $x_1 = 2\,\mathrm{mm}$, $C_1 = 1{,}5\,\mathrm{kg/m^3}$, $x_2 = 6\,\mathrm{mm}$, $C_2 = 0{,}5\,\mathrm{kg/m^3}$, $D = 3 \cdot 10^{-11}\,\mathrm{m^2/s}$, $A = 0{,}5\,\mathrm{m^2}$, $t = 1\,\mathrm{h}$
**Iščemo:** tok $J$ in maso $m$

:::formula
$J = -D\,\dfrac{C_2 - C_1}{x_2 - x_1}$ (profil je v stacionarnem stanju premica), $\;m = J A t$
:::

**Rešitev:**

1. Razdalja v metrih: $x_2 - x_1 = 4\,\mathrm{mm} = 0{,}004\,\mathrm{m}$.
2. Gradient: $(0{,}5 - 1{,}5) / 0{,}004 = -250\,\mathrm{kg/m^4}$; negativen je, ker koncentracija z globino pada.
3. Tok: $J = -3 \cdot 10^{-11} \cdot (-250) = 7{,}5 \cdot 10^{-9}\,\mathrm{kg/(m^2\,s)}$; pozitiven pomeni »v smeri večjega $x$«, proti revni strani.
4. Masa: $m = 7{,}5 \cdot 10^{-9} \cdot 0{,}5 \cdot 3600 = 1{,}35 \cdot 10^{-5}\,\mathrm{kg}$.
5. Odgovor: tok je $7{,}5 \cdot 10^{-9}\,\mathrm{kg/(m^2\,s)}$; v eni uri gre skozi $0{,}5\,\mathrm{m^2}$ plošče $13{,}5\,\mathrm{mg}$ ogljika.

### Primer 2: difuzijski koeficient pri cementaciji

Kolikšen je difuzijski koeficient ogljika v avstenitu (γ-Fe) pri $1000\,^\circ\mathrm{C}$? Za ta par je $D_0 = 2{,}3 \cdot 10^{-5}\,\mathrm{m^2/s}$ in $Q = 148\,\mathrm{kJ/mol}$.

**Podatki:** $D_0 = 2{,}3 \cdot 10^{-5}\,\mathrm{m^2/s}$, $Q = 148\,\mathrm{kJ/mol}$, $T = 1000\,^\circ\mathrm{C}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** difuzijski koeficient $D$

:::formula
$D = D_0\, e^{-Q/(RT)}$
:::

**Rešitev:**

1. Temperatura v kelvinih: $T = 1000 + 273{,}15 = 1273{,}15\,\mathrm{K}$.
2. Enote uskladimo: $Q = 148\,000\,\mathrm{J/mol}$, ker je $R$ v joulih.
3. $RT = 8{,}314 \cdot 1273{,}15 = 10\,585\,\mathrm{J/mol}$, zato je $Q/(RT) = 148\,000 / 10\,585 = 13{,}98$.
4. $e^{-13{,}98} = 8{,}47 \cdot 10^{-7}$.
5. $D = 2{,}3 \cdot 10^{-5} \cdot 8{,}47 \cdot 10^{-7} \approx 1{,}95 \cdot 10^{-11}\,\mathrm{m^2/s}$.
6. Odgovor: pri $1000\,^\circ\mathrm{C}$ je $D \approx 1{,}95 \cdot 10^{-11}\,\mathrm{m^2/s}$, približno petdesetkrat manj kot pri barvilu v vodi.

### Primer 3: staranje jeklene pločevine poleti in pozimi

Pločevina iz mehkega jekla se po valjanju počasi »stara«: prosti ogljikovi atomi v α-Fe difundirajo k napakam v kristalu, zato pločevina postane trša in se slabše preoblikuje. Zvitki ležijo v neogrevanem skladišču, kjer je poleti $35\,^\circ\mathrm{C}$, pozimi $-15\,^\circ\mathrm{C}$. Kolikokrat hitreje poteka difuzija ogljika poleti kot pozimi? Za C v α-Fe je $Q = 87{,}4\,\mathrm{kJ/mol}$.

**Podatki:** $T_1 = 35\,^\circ\mathrm{C}$ (poleti), $T_2 = -15\,^\circ\mathrm{C}$ (pozimi), $Q = 87{,}4\,\mathrm{kJ/mol}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** razmerje $D_1 / D_2$

:::formula
$D_0$ se pri deljenju okrajša: $\dfrac{D_1}{D_2} = e^{\frac{Q}{R}\left(\frac{1}{T_2} - \frac{1}{T_1}\right)}$
:::

**Rešitev:**

1. V kelvine: $T_1 = 308{,}15\,\mathrm{K}$, $T_2 = 258{,}15\,\mathrm{K}$.
2. Razlika obratnih vrednosti: $1/258{,}15 - 1/308{,}15 = 6{,}285 \cdot 10^{-4}\,\mathrm{K^{-1}}$.
3. $Q/R = 87\,400 / 8{,}314 = 10\,512\,\mathrm{K}$.
4. Eksponent: $10\,512 \cdot 6{,}285 \cdot 10^{-4} = 6{,}607$.
5. $D_1 / D_2 = e^{6{,}607} \approx 740$.
6. Odgovor: poleti je difuzija ogljika okoli $740$-krat hitrejša. Kar se pozimi zgodi v dveh letih, se poleti zgodi v približno enem dnevu. Zato pločevino, ki čaka čez poletje, raje predelajo čim prej.

### Primer 4 – zdaj ti: kako dolgo cementirati zobnik

Zobnik iz jekla z $0{,}20\,\%$ ogljika cementiramo pri $1000\,^\circ\mathrm{C}$. Atmosfera drži na površini stalno $1{,}20\,\%$ ogljika. Koliko časa traja, da je v globini $0{,}5\,\mathrm{mm}$ ogljika $0{,}70\,\%$? Uporabi $D$ iz Primera 2.

**Podatki:** $C_0 = 0{,}20\,\%$, $C_s = 1{,}20\,\%$, $C_x = 0{,}70\,\%$, $x = 0{,}5\,\mathrm{mm}$, $D = 1{,}95 \cdot 10^{-11}\,\mathrm{m^2/s}$
**Iščemo:** čas $t$

:::formula
$\dfrac{C_x - C_0}{C_s - C_0} = 1 - \mathrm{erf}(z)$, $\;z = \dfrac{x}{2\sqrt{D t}}$, torej $t = \dfrac{x^2}{4 D z^2}$
:::

**Rešitev:**

1. Levo stran izračunamo: $(0{,}70 - 0{,}20) / (1{,}20 - 0{,}20) = 0{,}5$.
2. Torej $1 - \mathrm{erf}(z) = 0{,}5$ in $\mathrm{erf}(z) = 0{,}5$; iz tabele $z = 0{,}477$.
3. Izračunaj $4 D z^2$ in nato $t$ (globino pretvori v metre), nato preveri:

:::premisli
Koliko časa traja cementacija?
---
$x = 5 \cdot 10^{-4}\,\mathrm{m}$, $x^2 = 2{,}5 \cdot 10^{-7}\,\mathrm{m^2}$, $4 D z^2 = 4 \cdot 1{,}95 \cdot 10^{-11} \cdot 0{,}2275 = 1{,}775 \cdot 10^{-11}\,\mathrm{m^2/s}$, zato $t \approx 1{,}41 \cdot 10^4\,\mathrm{s}$, kar je približno $3{,}9\,\mathrm{h}$. Za dvakratno globino ($1\,\mathrm{mm}$) bi potrebovali štirikrat več, okoli $15{,}7\,\mathrm{h}$.
:::

## Pogoste napake

- **Celzij namesto kelvina.** V $e^{-Q/(RT)}$ mora biti $T$ v kelvinih. Pri $1000$ namesto $1273{,}15$ dobiš za ogljik v γ-Fe $4 \cdot 10^{-13}$ namesto $2 \cdot 10^{-11}\,\mathrm{m^2/s}$, skoraj petdesetkrat premalo.
- **»Temperatura malo višja, difuzija malo hitrejša.«** Odvisnost je eksponentna. Že $50\,^\circ\mathrm{C}$ razlike lahko pomeni večstokratno spremembo $D$, kot kaže Primer 3 ($740$-krat).
- **»Dvakrat dlje, dvakrat globlje.«** Globina raste s $\sqrt{t}$. Za dvakrat globlji sloj potrebuješ štirikratni čas.
- **Kilojouli z $R$ v joulih.** $Q$ je navadno podan v $\mathrm{kJ/mol}$, $R$ pa v $\mathrm{J/(mol\,K)}$. Pozabljena pretvorba zmanjša eksponent za faktor $1000$ in dá nesmiselno velik $D$.
- **»V trdnem se atomi ne premikajo.«** Premikajo se s skoki na prazna mesta ali med atome; le pri nizki temperaturi so skoki redki.

## Povzetek

- Difuzija v trdnem poteka s skoki atomov: vakančno (podobno veliki atomi) ali intersticijsko (majhni atomi C, N, H, mnogo hitreje).
- 1. Fickov zakon: $J = -D\,\dfrac{dC}{dx}$; snov teče od večje proti manjši koncentraciji; v stacionarnem stanju je profil premica.
- 2. Fickov zakon: $\dfrac{\partial C}{\partial t} = D\,\dfrac{\partial^2 C}{\partial x^2}$; za stalno površinsko koncentracijo $\dfrac{C_x - C_0}{C_s - C_0} = 1 - \mathrm{erf}\left(\dfrac{x}{2\sqrt{Dt}}\right)$.
- Značilna globina $x \approx \sqrt{Dt}$: dvakratna globina zahteva štirikratni čas.
- $D = D_0\, e^{-Q/(RT)}$, $T$ v kelvinih, $Q$ v $\mathrm{J/mol}$; aktivacijska energija $Q$ je energija za skok, zato $D$ s temperaturo raste eksponentno.

## Drugače: Na sliki

Če enačbo $D = D_0\, e^{-Q/(RT)}$ logaritmiraš, dobiš

$$\ln D = \ln D_0 - \frac{Q}{R} \cdot \frac{1}{T}$$

Nariši graf: na vodoravno os $\dfrac{1}{T}$, na navpično $\ln D$. Meritve pri različnih temperaturah ležijo na **premici**, ki pada proti desni (desno so nižje temperature). Naklon premice je $-\dfrac{Q}{R}$.

- Strma premica: velik $Q$, difuzija je zelo občutljiva na temperaturo (Fe v Fe).
- Položna premica: majhen $Q$ (C v Fe).

Za profil koncentracije pa si nariši os $x$ v globino. Pri cementaciji je na začetku profil stopnica: zgoraj $C_s$, spodaj $C_0$. S časom se stopnica zaobli in »razmaže« v globino; točka s koncentracijo na sredini med $C_s$ in $C_0$ se pomika navzdol vedno počasneje, sorazmerno s $\sqrt{t}$.

## Drugače: Iz vsakdanjega življenja

Pomisli na gnečo na smučišču po sneženju. Na eni strani parkirišča je polno ljudi, na drugi skoraj nikogar. Nihče nikogar ne usmerja, a ker se vsak naključno premika, se ljudje sčasoma razporedijo: več jih gre iz gneče na prazno kot obratno. To je 1. Fickov zakon: tok je tem večji, čim večja je razlika v gneči na kratki razdalji.

V trdnem je gneča še hujša: vsak stoji na svoji ploščici in lahko stopi le na sosednjo prazno ploščico (vakanca). Pozimi, ko vsi drgetajo od mraza in se komaj premikajo, gre to zelo počasi. Ko se ogreje, vsi bolj poskakujejo in prazna mesta se hitreje polnijo. Majhen otrok pa se lahko splazi kar med nogami odraslih (intersticija) in pride najdlje.

## Preveri se

? Ogljik difundira v jeklo z $D = 1 \cdot 10^{-11}\,\mathrm{m^2/s}$. Približno kako globoko pride v eni uri?
- okoli $0{,}00004\,\mathrm{mm}$
~ To je $D \cdot t = 3{,}6 \cdot 10^{-8}$ brez korena. Globina je $\sqrt{Dt}$, šele koren dá metre.
+ okoli $0{,}2\,\mathrm{mm}$
- okoli $0{,}003\,\mathrm{mm}$
~ To je $\sqrt{10^{-11} \cdot 1}$: čas si vstavil v urah. Čas mora biti v sekundah, $1\,\mathrm{h} = 3600\,\mathrm{s}$.
> $\sqrt{Dt} = \sqrt{10^{-11} \cdot 3600} = \sqrt{3{,}6 \cdot 10^{-8}} \approx 1{,}9 \cdot 10^{-4}\,\mathrm{m}$, torej okoli $0{,}2\,\mathrm{mm}$.

? Skozi jekleno steno poteka stacionarna difuzija vodika. Katera tabela koncentracij v globinah $0$, $1$ in $2\,\mathrm{mm}$ ustreza stacionarnemu stanju?
- $C = 1{,}2$; $0{,}6$; $0{,}5\,\mathrm{kg/m^3}$
~ Ta profil je ukrivljen. Ukrivljen profil se po 2. Fickovem zakonu s časom še spreminja, torej stanje ni stacionarno.
+ $C = 1{,}2$; $0{,}9$; $0{,}6\,\mathrm{kg/m^3}$
- $C = 0{,}6$; $0{,}6$; $0{,}6\,\mathrm{kg/m^3}$
~ Pri enaki koncentraciji povsod je gradient nič, zato je tudi tok nič; vodik ne bi prehajal.
> V stacionarnem stanju se koncentracija nikjer ne spreminja s časom, zato je profil premica: na vsak milimeter enak padec, tu $0{,}3\,\mathrm{kg/m^3}$.

? Zakaj ogljik v železu difundira mnogo hitreje kot železovi atomi sami?
- Ker je ogljik lažji, zato se pri isti temperaturi giblje hitreje, tako kot v plinu.
~ Atomi v trdnem ne letijo prosto kot v plinu. Odloča, ali ima atom kam skočiti in koliko energije za to potrebuje.
+ Ker je majhen in skače po intersticijah, ki jih je veliko, z manjšo aktivacijsko energijo; železo mora čakati na vakanco.
- Ker ima ogljik večjo koncentracijo kot železo.
~ Koncentracija določa gradient in tok, ne hitrosti skokov posameznega atoma, ki jo opiše $D$.
> Intersticijski ogljik ima v α-Fe $Q \approx 87\,\mathrm{kJ/mol}$, železo $Q \approx 251\,\mathrm{kJ/mol}$, zato je $D$ ogljika za mnogo velikostnih redov večji.

? Tok skozi ploščo je $6 \cdot 10^{-9}\,\mathrm{kg/(m^2\,s)}$, $D = 3 \cdot 10^{-11}\,\mathrm{m^2/s}$, razlika koncentracij med stranema je $0{,}8\,\mathrm{kg/m^3}$. Kako debela je plošča (stacionarno stanje)?
- $6{,}25\,\mathrm{mm}$
~ Z $\Delta C$ si delil namesto množil. Iz $J = D \dfrac{\Delta C}{\Delta x}$ sledi $\Delta x = \dfrac{D\,\Delta C}{J}$.
- $0{,}4\,\mathrm{mm}$
~ Napaka v potencah: $10^{-11} / 10^{-9} = 10^{-2}$, ne $10^{-3}$.
+ $4\,\mathrm{mm}$
> $\Delta x = \dfrac{D\,\Delta C}{J} = \dfrac{3 \cdot 10^{-11} \cdot 0{,}8}{6 \cdot 10^{-9}} = 0{,}004\,\mathrm{m} = 4\,\mathrm{mm}$.

? Balon iz gume, napolnjen s helijem, po nekaj dneh splahni, enak balon z zrakom pa zdrži tedne. Kaj to najbolje pojasni?
- Helij je lažji od zraka, zato ga vzgon potiska skozi gumo.
~ Vzgon deluje na cel balon, ne na posamezne atome v steni. Skozi steno gre plin z difuzijo.
- Guma s helijem kemijsko reagira in razpade.
~ Helij je žlahtni plin in ne reagira. Guma ostane cela.
+ Majhni helijevi atomi lažje skačejo skozi prostore med verigami gume, zato je njihov $D$ v gumi večji.
> Enako kot ogljik med atomi železa: manjši delec potrebuje manj energije za skok skozi trdno snov, zato difundira hitreje.

:::simboli
J | difuzijski tok | J = -D\,\frac{dC}{dx} | kg/(m^2\,s) | snov skozi $1\,\mathrm{m^2}$ v $1\,\mathrm{s}$
D | difuzijski koeficient | D = D_0\, e^{-Q/(RT)} | m^2/s
C | koncentracija | | kg/m^3 | ali masni delež v %
x | globina (lega) v materialu | | m
t | čas | | s
D_0 | predeksponentni faktor | | m^2/s
Q | aktivacijska energija | | J/mol | energija za skok, na mol atomov
R | splošna plinska konstanta | | J/(mol\,K) | $8{,}314$
T | temperatura | | K | vedno v kelvinih
C_s | koncentracija na površini | | \% | stalna med cementacijo
C_0 | začetna koncentracija v notranjosti | | \%
C_x | koncentracija v globini $x$ po času $t$ | | \%
\mathrm{erf} | funkcija napake | | – | vrednosti iz tabele
z | argument funkcije napake | z = \frac{x}{2\sqrt{Dt}} | –
x_1, x_2 | globini merjenja | | m
C_1, C_2 | koncentraciji v globinah $x_1$ in $x_2$ | | kg/m^3
A | ploščina plošče | | m^2
m | masa ogljika, ki preide | m = J A t | kg
T_1 | poletna temperatura | | K
T_2 | zimska temperatura | | K
D_1 | difuzijski koeficient poleti | | m^2/s
D_2 | difuzijski koeficient pozimi | | m^2/s
d | znak za odvod | | | $\frac{dC}{dx}$ je koncentracijski gradient
e | Eulerjevo število | | | $e \approx 2{,}718$
:::
