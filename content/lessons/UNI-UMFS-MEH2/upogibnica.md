---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka. Antena satelita je tanka aluminijasta cev, vpeta na ohišje, drugi konec je prost. Pri preizkusu na Zemlji obesijo na prosti konec utež. Konec se povesi za $3\,\mathrm{mm}$.

Inženirji anteno podaljšajo na dvojno dolžino. Cev, material in utež ostanejo enaki. Za koliko se zdaj povesi konec: $6\,\mathrm{mm}$, $12\,\mathrm{mm}$ ali še več? Zapiši si napoved.

Napetosti v nosilcu že znaš izračunati. A nosilec, ki zdrži, se lahko vseeno preveč upogne. Antena zgreši smer proti Zemlji, robotska roka postaje ne zadene priključka, ogledalo teleskopa izgubi ostrino. Zato potrebujemo obliko upognjenega nosilca. Imenujemo jo **upogibnica**.

## Razlaga

**Blok 1: poves in zasuk.** Os $x$ položimo vzdolž neobremenjenega nosilca. Ko nosilec obremenimo, se vsaka točka osi premakne prečno. Ta premik je **poves** $w(x)$; tu ga štejemo pozitivno navzdol. Nagib tangente na upognjeno os je **zasuk**:

$$\varphi = w'$$

Zasuki so v praksi majhni, zato je nagib kar kot v radianih.

*Preizkus:* kolikšen je zasuk tam, kjer je poves nosilca na dveh podporah med podporama največji? *(Nič: tangenta je tam vodoravna.)*

**Blok 2: ukrivljenost iz upogiba.** Pri upogibu si izpeljal, da se vlakno na razdalji $y$ od nevtralne osi raztegne za $\varepsilon = y/\rho$, kjer je $\rho$ polmer ukrivljenosti. Hookov zakon da $\sigma = E\varepsilon = E y/\rho$, iz upogiba pa poznaš $\sigma = M y / I$. Izenačimo in dobimo

$$\frac{1}{\rho} = \frac{M}{E I}$$

Produkt $EI$ je **upogibna togost**. Večji upogibni moment os bolj ukrivi, večja togost manj.

*Preizkus:* aluminij ($E = 70\,\mathrm{GPa}$) zamenjamo z jeklom ($E = 210\,\mathrm{GPa}$). Kaj se zgodi z ukrivljenostjo? *(Pade na tretjino.)*

**Blok 3: diferencialna enačba upogibnice.** Za položno krivuljo je ukrivljenost približno drugi odvod: $1/\rho \approx \lvert w'' \rvert$. Ostane predznak. Pozitiven moment napenja spodnja vlakna, zato se nosilec usloči kot skleda: sredina je nižje od krajev. Ker $w$ štejemo navzdol, ima $w(x)$ tam največjo vrednost, zato je $w'' < 0$. Torej

$$E I\, w'' = -M(x)$$

To je **diferencialna enačba upogibnice**. Moment $M(x)$ že znaš zapisati iz ravnovesja. Poves dobiš z dvema integracijama.

:::premisli
Konzolo obremenimo s silo na prostem koncu. Kje je ukrivljenost največja in kje je nič? Napovej iz poteka $M(x)$.
---
Največja je ob vpetju, kjer je $\lvert M \rvert = F L$ največji. Na prostem koncu je $M = 0$, zato je tam $w'' = 0$: konec je raven, le nagnjen.
:::

**Blok 4: robni pogoji.** Vsaka integracija prinese konstanto, torej $C_1$ in $C_2$. Določita ju podpori:

| podpora | $w$ | $w'$ | $M$ |
|---|---|---|---|
| togo vpetje | 0 | 0 | ni znan |
| členkasta podpora na koncu | 0 | ni znan | 0 |
| prosti konec | ni znan | ni znan | 0 |

*Preizkus:* katera dva pogoja uporabiš pri nosilcu na dveh členkastih podporah, pri $x = 0$ in $x = L$? *(Iz tabele: $w(0) = 0$ in $w(L) = 0$; zasuka na členkih nista znana.)*

**Blok 5: konzola s silo na koncu.** Vpetje je pri $x = 0$, sila $F$ deluje navzdol na prostem koncu pri $x = L$. Moment v prerezu $x$ je $M(x) = -F(L - x)$, saj napenja zgornja vlakna. Enačba upogibnice:

$$E I\, w'' = F(L - x)$$

Prva integracija in pogoj $w'(0) = 0$ dasta $C_1 = 0$:

$$E I\, w' = F\left(L x - \frac{x^2}{2}\right)$$

Druga integracija in pogoj $w(0) = 0$ dasta $C_2 = 0$:

$$E I\, w = F\left(\frac{L x^2}{2} - \frac{x^3}{6}\right)$$

Na prostem koncu vstavimo $x = L$ in dobimo največji poves in zasuk:

$$w_{\max} = \frac{F L^3}{3 E I}$$

$$\varphi_{\max} = \frac{F L^2}{2 E I}$$

:::premisli
Vrni se k uganki o anteni. Kolikokrat se povečata poves in zasuk konca, če dolžino podvojimo?
---
Poves raste z $L^3$, torej $2^3 = 8$-krat: s $3\,\mathrm{mm}$ na $24\,\mathrm{mm}$. Zasuk raste z $L^2$, torej $4$-krat. Daljša roka ima večji moment in to na daljši ročici, zato rast ni linearna.
:::

## Rešeni primeri

### Primer 1: preizkus antene

Aluminijasta antena satelita ($E = 70\,\mathrm{GPa}$, $I = 1{,}5 \cdot 10^{-7}\,\mathrm{m^4}$) je dolga $L = 1{,}2\,\mathrm{m}$ in togo vpeta. Na prosti konec obesijo utež, ki deluje s silo $F = 50\,\mathrm{N}$. Kolikšna sta poves in zasuk konca?

**Podatki:** $E = 70\,\mathrm{GPa} = 7 \cdot 10^{10}\,\mathrm{Pa}$, $I = 1{,}5 \cdot 10^{-7}\,\mathrm{m^4}$, $L = 1{,}2\,\mathrm{m}$, $F = 50\,\mathrm{N}$
**Iščemo:** $w_{\max}$ in $\varphi_{\max}$

:::formula
$w_{\max} = \dfrac{F L^3}{3 E I}$, $\varphi_{\max} = \dfrac{F L^2}{2 E I}$
:::

**Rešitev:**

1. Upogibna togost: $E I = 7 \cdot 10^{10} \cdot 1{,}5 \cdot 10^{-7} = 1{,}05 \cdot 10^{4}\,\mathrm{N\,m^2}$. Najprej vse v osnovnih enotah.
2. Poves: $w_{\max} = \dfrac{50 \cdot 1{,}728}{3 \cdot 1{,}05 \cdot 10^{4}} \approx 0{,}00274\,\mathrm{m}$, kjer je $1{,}2^3 = 1{,}728$.
3. Zasuk: $\varphi_{\max} = \dfrac{50 \cdot 1{,}44}{2 \cdot 1{,}05 \cdot 10^{4}} \approx 0{,}00343\,\mathrm{rad}$.
4. V stopinjah: $0{,}00343 \cdot 180/\pi \approx 0{,}196^\circ$.

Odgovor: konec antene se povesi za približno $2{,}74\,\mathrm{mm}$ in se nagne za $0{,}00343\,\mathrm{rad}$ (okrog $0{,}2^\circ$).

### Primer 2: nosilec v hali za sestavo rakete

Prostoležeči jekleni nosilec dvigala v montažni hali je dolg $L = 4\,\mathrm{m}$. Nosi enakomerno obtežbo $q = 2\,\mathrm{kN/m}$. Velja $E = 210\,\mathrm{GPa}$ in $I = 8{,}69 \cdot 10^{-6}\,\mathrm{m^4}$. Z integracijo upogibnice določi poves na sredini in zasuk ob podpori.

**Podatki:** $L = 4\,\mathrm{m}$, $q = 2000\,\mathrm{N/m}$, $E = 2{,}1 \cdot 10^{11}\,\mathrm{Pa}$, $I = 8{,}69 \cdot 10^{-6}\,\mathrm{m^4}$; podpori pri $x = 0$ in $x = L$
**Iščemo:** $w(L/2)$ in $\varphi(0)$

:::formula
$E I\, w'' = -M(x)$, $M(x) = \dfrac{q x (L - x)}{2}$; robna pogoja $w(0) = 0$, $w(L) = 0$
:::

**Rešitev:**

1. $E I\, w'' = -\dfrac{q}{2}\left(L x - x^2\right)$. Moment je pozitiven, nosilec se usloči navzdol.
2. Prva integracija: $E I\, w' = -\dfrac{q}{2}\left(\dfrac{L x^2}{2} - \dfrac{x^3}{3}\right) + C_1$.
3. Druga: $E I\, w = -\dfrac{q}{2}\left(\dfrac{L x^3}{6} - \dfrac{x^4}{12}\right) + C_1 x + C_2$.
4. Iz $w(0) = 0$ sledi $C_2 = 0$. Iz $w(L) = 0$ sledi $-\dfrac{q L^4}{24} + C_1 L = 0$, torej $C_1 = \dfrac{q L^3}{24}$.
5. Pri $x = L/2$: $E I\, w = -\dfrac{q L^4}{128} + \dfrac{q L^4}{48} = \dfrac{5 q L^4}{384}$. Zasuk ob podpori je $\varphi(0) = \dfrac{C_1}{E I} = \dfrac{q L^3}{24 E I}$.
6. Številke: $E I = 2{,}1 \cdot 10^{11} \cdot 8{,}69 \cdot 10^{-6} = 1{,}8249 \cdot 10^{6}\,\mathrm{N\,m^2}$.
7. $w = \dfrac{5 \cdot 2000 \cdot 256}{384 \cdot 1{,}8249 \cdot 10^{6}} \approx 0{,}00365\,\mathrm{m}$ in $\varphi(0) = \dfrac{2000 \cdot 64}{24 \cdot 1{,}8249 \cdot 10^{6}} \approx 0{,}00292\,\mathrm{rad}$.

Odgovor: nosilec se na sredini povesi za približno $3{,}65\,\mathrm{mm}$, ob podpori se zasuka za približno $0{,}0029\,\mathrm{rad}$.

### Primer 3: drog z instrumentom na Luni

Na pristajalniku na Luni bo vodoravni, na enem koncu togo vpet aluminijast drog ($E = 70\,\mathrm{GPa}$), dolg $L = 2\,\mathrm{m}$, na koncu nosil kamero z maso $m = 12\,\mathrm{kg}$. Na Luni je $g_L = 1{,}62\,\mathrm{m/s^2}$. Konec se sme povesiti največ $w_{\max} = 1\,\mathrm{mm}$. Kolikšen najmanj mora biti $I$? Lastno težo droga zanemari.

**Podatki:** $E = 7 \cdot 10^{10}\,\mathrm{Pa}$, $L = 2\,\mathrm{m}$, $m = 12\,\mathrm{kg}$, $g_L = 1{,}62\,\mathrm{m/s^2}$, $w_{\max} = 0{,}001\,\mathrm{m}$
**Iščemo:** najmanjši $I$ in poves na Zemlji

:::formula
$F = m\, g_L$, $w_{\max} = \dfrac{F L^3}{3 E I}$, torej $I = \dfrac{F L^3}{3 E\, w_{\max}}$
:::

**Rešitev:**

1. Sila kamere na Luni: $F = 12 \cdot 1{,}62 = 19{,}44\,\mathrm{N}$.
2. Formulo obrnemo, ker iščemo prerez, ne povesa.
3. $I = \dfrac{19{,}44 \cdot 8}{3 \cdot 7 \cdot 10^{10} \cdot 0{,}001} \approx 7{,}41 \cdot 10^{-7}\,\mathrm{m^4}$, kar je približno $74{,}1\,\mathrm{cm^4}$.
4. Drog z natanko tem $I$ bodo pred poletom preizkusili na Zemlji z isto kamero ($g = 9{,}81\,\mathrm{m/s^2}$). Za koliko se bo povesil? Zadnji korak naredi sam.

:::premisli
Kolikšen bo poves droga na Zemlji?
---
Poves je premo sorazmeren s silo, ta pa z $g$. Razmerje je $9{,}81/1{,}62 \approx 6{,}06$, zato je poves na Zemlji približno $6{,}06\,\mathrm{mm}$. Preizkus na Zemlji zato ne sme zahtevati meje $1\,\mathrm{mm}$.
:::

## Pogoste napake

- **»Dvakrat daljši nosilec, dvakrat večji poves.«** Videti je logično, a moment raste z dolžino in hkrati deluje na daljši ročici. Pri sili na koncu poves raste z $L^3$, pri enakomerni obtežbi celo z $L^4$.
- **Zasuk na členkasti podpori je nič.** Kdor tako misli, pri prostoležečem nosilcu postavi $w'(0) = 0$. Členek se prosto vrti, zato velja le $w = 0$. Pogoj $w' = 0$ velja samo na togem vpetju ali na simetrijski osi.
- **Napačen predznak.** Če zapišeš $E I\, w'' = +M$ ob $w$ navzdol, dobiš poves navzgor. Popravek: izberi smer $w$ in jo uskladi s predznakom momenta. Preveri: nosilec mora pasti v smeri obtežbe.
- **Mešanje enot.** Vstaviš $E$ v $\mathrm{GPa}$ in $I$ v $\mathrm{cm^4}$, rezultat pa je napačen za mnogo velikostnih redov. Popravek: vse v $\mathrm{N}$, $\mathrm{m}$, $\mathrm{Pa}$, $\mathrm{m^4}$.
- **Zasuk v stopinjah.** Formula da zasuk v radianih. Kdor ga razume kot stopinje, ga podceni za faktor $57$.

## Povzetek

- Poves $w(x)$ je prečni premik osi, zasuk $\varphi = w'$ je nagib tangente v radianih.
- Iz upogiba: $1/\rho = M/(E I)$; za položno os velja diferencialna enačba upogibnice $E I\, w'' = -M(x)$ ($w$ navzdol).
- Dve integraciji dasta $C_1$, $C_2$; določita ju robna pogoja: vpetje $w = 0$, $w' = 0$; členek $w = 0$.
- Konzola s silo na koncu: $w_{\max} = F L^3/(3 E I)$, $\varphi_{\max} = F L^2/(2 E I)$.
- Prostoležeči nosilec z $q$: $w(L/2) = 5 q L^4/(384 E I)$, $\varphi(0) = q L^3/(24 E I)$.
- Poves je sorazmeren z obtežbo in obratno sorazmeren z $E I$; z dolžino raste s potenco.

## Drugače: Na sliki

Predstavljaj si konzolo antene od vpetja (levo) do prostega konca (desno) in pod njo štiri diagrame, enega pod drugim:

1. **Moment** $M$: ravna črta od največje vrednosti ob vpetju do nič na koncu.
2. **Ukrivljenost** $w''$: ista ravna črta, le deljena z $E I$.
3. **Zasuk** $w'$: parabola, ki začne pri nič ob vpetju in se na koncu zravna pri $\varphi_{\max}$.
4. **Poves** $w$: kubična krivulja, ki začne vodoravno in je čedalje bolj strma.

Zasuk in poves sta vsak ploščina pod prejšnjim diagramom. Poves vzdolž konzole, v deležih $w_{\max}$:

| $x/L$ | $w/w_{\max}$ |
|---|---|
| 0,25 | 0,086 |
| 0,5 | 0,313 |
| 0,75 | 0,633 |
| 1 | 1 |

Na polovici dolžine je poves manj kot tretjina končnega. Večina povesa nastane, ker se zasuk, ki nastane blizu vpetja, prenese po vsej dolžini kot po ročici.

## Drugače: Bolj natančno

Natančna ukrivljenost ravninske krivulje je

$$\frac{1}{\rho} = \frac{\lvert w'' \rvert}{\left(1 + w'^2\right)^{3/2}}$$

Pri zasuku $w' = 0{,}05$ je imenovalec $1{,}0025^{1{,}5} \approx 1{,}0038$, zato je napaka linearne teorije pod $0{,}4\,\%$. Pri velikih zasukih (dolge tanke antene, ki se sučejo v vesolju) pa potrebujemo nelinearno teorijo.

Iz ravnovesja delčka nosilca sledita $V' = -q$ in $M' = V$, torej $M'' = -q$. Pri stalni $E I$ zato velja enačba četrtega reda

$$E I\, w'''' = q(x)$$

s štirimi konstantami in po dvema pogojema na vsakem koncu (prosti konec: $M = 0$ in $V = 0$). Ta oblika je uporabna, ko je reakcije težko izračunati, na primer pri statično nedoločenih nosilcih.

Enačba je linearna, zato velja **superpozicija**: poves zaradi več bremen je vsota povesov zaradi vsakega posebej. Tako sestavimo zahtevne primere iz tabeliranih rešitev.

## Preveri se

? Kaj velja na togo vpetem koncu nosilca?
- $w = 0$ in $M = 0$
~ To sta pogoja členkaste podpore. Vpetje prenese moment, zato $M$ tam ni nič.
+ $w = 0$ in $w' = 0$
- Samo $w' = 0$, poves je lahko poljuben
~ Vpetje prepreči tudi premik, ne le zasuk.
- $M = 0$ in prečna sila je nič
~ To sta pogoja prostega konca, ne vpetja.
> Togo vpetje prepreči premik in zasuk: $w = 0$, $w' = 0$.

? Konzola: $F = 200\,\mathrm{N}$ na koncu, $L = 2\,\mathrm{m}$, $E I = 4 \cdot 10^{4}\,\mathrm{N\,m^2}$. Kolikšen je poves konca?
- $20\,\mathrm{mm}$
~ V imenovalcu je $3$, ne $2$; $2$ je pri formuli za zasuk.
+ $13{,}3\,\mathrm{mm}$
- $6{,}67\,\mathrm{mm}$
~ To dobiš z $L^2$ namesto $L^3$. Poves raste s kubom dolžine.
- $1{,}33\,\mathrm{mm}$
~ Napaka pri pretvorbi: $0{,}0133\,\mathrm{m}$ je $13{,}3\,\mathrm{mm}$.
> $w_{\max} = \dfrac{200 \cdot 8}{3 \cdot 4 \cdot 10^{4}} \approx 0{,}0133\,\mathrm{m} = 13{,}3\,\mathrm{mm}$.

? Poišči napako. Študent rešuje prostoležeči nosilec z enakomerno obtežbo in zapiše: »Integriram $E I\, w'' = -M(x)$ dvakrat. Ker je pri $x = 0$ podpora, velja $w(0) = 0$ in $w'(0) = 0$.«
- Moment bi moral biti po vsej dolžini enak.
~ Pri enakomerni obtežbi je $M(x)$ parabola, ne konstanta; tu napake ni.
+ Členkasta podpora dopušča zasuk; namesto $w'(0) = 0$ mora uporabiti $w(L) = 0$.
- Potreboval bi štiri robne pogoje.
~ Štiri potrebuješ pri enačbi četrtega reda. Pri $w'' = \ldots$ sta dovolj dva.
- Predznak v enačbi je napačen.
~ Ob $w$ navzdol in pozitivnem $M$ je $E I\, w'' = -M$ pravilno.
> Pogoj $w'(0) = 0$ velja le na vpetju. Na členku velja samo $w = 0$, drugi pogoj da druga podpora.

? Kaj bolj zmanjša poves konca konzole s silo na koncu: dvakrat večji $I$ ali za $20\,\%$ krajša konzola?
+ Dvakrat večji $I$: poves pade na $0{,}5$, pri krajši konzoli na $0{,}512$.
- Krajša konzola, ker dolžina nastopa na kub in bi poves padel na $0{,}2^3$.
~ Krajša za $20\,\%$ pomeni $0{,}8\,L$, torej $0{,}8^3 = 0{,}512$, ne $0{,}2^3$.
- Oboje enako, ker je poves v obeh primerih polovičen.
~ Razlika je majhna, a ni nič: $0{,}8^3 = 0{,}512$, kar je malo več kot $0{,}5$.
> $w \propto L^3 / I$: dvojni $I$ da $0{,}5$, dolžina $0{,}8\,L$ pa $0{,}512$. Dvojni $I$ je malenkost boljši.

? Skakalna deska v bazenu je konzola. Skakalec stoji najprej na koncu deske, nato na njeni polovici. Kolikšen del prvega povesa (pod njim na koncu) je poves pod njegovimi nogami v drugem primeru?
- Polovica
~ Poves ni linearen v dolžini ročice; tako bi bilo le, če bi bil sorazmeren z $L$.
- Četrtina
~ $L^2$ velja za zasuk, ne za poves.
+ Osmina
- Ves, ker je deska ista
~ Pomembna je ročica do bremena: krajša ročica pomeni manjši moment na krajši dolžini.
> Pod bremenom na razdalji $a$ je poves $F a^3/(3 E I)$. Pri $a = L/2$ je to $(1/2)^3 = 1/8$ povesa na koncu.

:::simboli
w | poves | | m | pozitiven navzdol
x | koordinata vzdolž nosilca | | m | od vpetja ali leve podpore
\varphi | zasuk | \varphi = w' | rad |
\rho | polmer ukrivljenosti | \frac{1}{\rho} = \frac{M}{EI} | m |
M | upogibni moment | | N\,m | pozitiven, če napenja spodnja vlakna
E | elastični modul | | Pa |
I | ploskovni vztrajnostni moment prereza | | m^4 |
F | sila na prostem koncu | | N | v Primeru 3 $F = m\, g_L$
L | dolžina nosilca | | m |
w_{\max} | največji poves | w_{\max} = \frac{F L^3}{3 E I} | m | konzola s silo na koncu
\varphi_{\max} | zasuk prostega konca | \varphi_{\max} = \frac{F L^2}{2 E I} | rad |
C_1, C_2 | integracijski konstanti | | | iz robnih pogojev
q | enakomerna obtežba | | N/m |
m | masa kamere | | kg |
g_L | težni pospešek na Luni | | m/s^2 |
V | prečna sila | V = M' | N |
:::
