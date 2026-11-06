---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Podrgni napihnjen balon ob suhe lase in ga približaj koščkom papirja: poskočijo k njemu, še preden se jih dotakne. To je elektrostatika, sila med mirujočimi naboji. Ista sila drži skupaj atome, molekule in kristale; ionska vez, vodikova vez in vezava zdravila na receptor so v jedru električne interakcije. V laboratoriju z njo elektroforeza ločuje DNK po naboju, v masnem spektrometru in elektronskem mikroskopu pa polje pospeši nabite delce.

Vse to stoji na štirih pojmih, ki se gradijo drug na drugem: **Coulombov zakon**, **električno polje**, **električni potencial** in **kondenzator**.

## Razlaga

Elektrostatika je v marsičem dvojček gravitacije, ki jo že poznaš. Najhitreje jo zgradiš tako, da ob vsakem pojmu vprašaš: kaj je enako kot pri teži in kaj drugače?

### Naboj in sila: kot gravitacija, a z dvema predznakoma

**1. Naboj.** Naboj je lastnost delcev; obstaja pozitiven in negativen. Enoimenska naboja se odbijata, raznoimenska privlačita. Naboj je **kvantiziran**: vsak naboj je celoštevilski večkratnik osnovnega naboja $e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$ (elektron ima $-e_0$, proton $+e_0$). Naboj se **ohranja**: v zaprtem sistemu je vsota nabojev stalna. Enota je **coulomb**, $1\,\mathrm{C} = 1\,\mathrm{A\,s}$.

**2. Coulombov zakon.** Naj bosta $q_1$ in $q_2$ mirujoča točkasta naboja (njuni velikosti sta zanemarljivi v primerjavi z razdaljo $r$ med njima) v praznem prostoru. Potem $q_1$ deluje na $q_2$ s silo

$$\vec{F}_{12} = \frac{1}{4\pi\varepsilon_0}\,\frac{q_1q_2}{r^2}\,\vec{e}_{12}, \qquad F = \frac{1}{4\pi\varepsilon_0}\,\frac{|q_1q_2|}{r^2}, \qquad \frac{1}{4\pi\varepsilon_0} = 8{,}99 \cdot 10^9\,\mathrm{\frac{V\,m}{A\,s}},$$

kjer je $\vec{e}_{12}$ enotski vektor od $q_1$ proti $q_2$. Če je $q_1q_2 > 0$, sila kaže stran od $q_1$ (odboj), če je $q_1q_2 < 0$, proti njemu (privlak); po tretjem Newtonovem zakonu je sila na $q_1$ nasprotno enaka. $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\mathrm{A\,s/(V\,m)}$ je **influenčna konstanta**. Če homogen izotropen dielektrik z **dielektričnostjo** $\varepsilon$ (voda: $\varepsilon \approx 80$) zapolnjuje ves prostor okoli nabojev, je sila $\varepsilon$-krat manjša. Zato se soli v vodi raztapljajo: privlak med ioni je tam okoli osemdesetkrat šibkejši.

| | Gravitacija | Elektrostatika |
|---|---|---|
| vir sile | masa (vedno pozitivna) | naboj ($+$ ali $-$) |
| smer sile | vedno privlak | privlak ali odboj |
| odvisnost od razdalje | $1/r^2$ | $1/r^2$ |
| snov med telesoma | ne vpliva | zmanjša silo $\varepsilon$-krat |

:::premisli
Oba naboja podvojimo in hkrati podvojimo tudi razdaljo med njima. Kaj se zgodi s silo?
---
Ostane enaka: produkt nabojev se poveča štirikrat, kvadrat razdalje pa tudi štirikrat, $2 \cdot 2/2^2 = 1$.
:::

### Polje: lastnost prostora okoli naboja

**3. Električno polje.** Tako kot Zemlja ustvari težnostno polje, naboj spremeni prostor okoli sebe: v vsaki točki je **električna poljska jakost**

$$\vec{E} = \frac{\vec{F}}{q},$$

kjer je $\vec{F}$ sila na mirujoč poskusni naboj $q$, ki je tako majhen, da ne premakne nabojev, ki polje ustvarjajo. Enota je $\mathrm{N/C} = \mathrm{V/m}$. Polje točkastega naboja $Q$ dobimo iz Coulombovega zakona s $q_1 = Q$, $q_2 = q$ in delimo s $q$: kaže radialno navzven (za $Q > 0$) ali navznoter (za $Q < 0$) in ima velikost

$$E = \frac{1}{4\pi\varepsilon_0}\,\frac{|Q|}{r^2}.$$

Za več nabojev velja **načelo superpozicije**: polje je **vektorska** vsota polj posameznih nabojev. Polje ponazorimo s **silnicami**, ki se začnejo na pozitivnih in končajo na negativnih nabojih; gostota silnic kaže velikost polja.

**4. Gaussov zakon in homogeno polje.** *Gaussov zakon:* za vsako zaprto ploskev v praznem prostoru je električni pretok skozi njo (vsota produktov $\vec{E} \cdot \mathrm{d}\vec{S}$ po vseh koščkih ploskve) enak celotnemu naboju $Q$ znotraj ploskve, deljenemu z $\varepsilon_0$: $\oint\vec{E} \cdot \mathrm{d}\vec{S} = Q/\varepsilon_0$, pri čemer $\mathrm{d}\vec{S}$ kaže navzven. Iz njega sledi, da je polje med dvema velikima vzporednima ploščama z nasprotnima nabojema $\pm Q$ in površino $S$ **homogeno**:

$$E = \frac{\sigma}{\varepsilon_0}, \qquad \sigma = \frac{Q}{S}.$$

*Izpeljava* (pogoj: razmik plošč je majhen v primerjavi z njunimi stranicami, robove zanemarimo). Okoli dela ene plošče postavimo valj z osnovno ploskvijo $S_0$, ki ploščo prebada. Zaradi simetrije je polje pravokotno na ploščo, zato skozi plašč ni pretoka, skozi osnovni ploskvi pa je $2ES_0 = \sigma S_0/\varepsilon_0$, torej $E = \sigma/(2\varepsilon_0)$ za eno ploščo. Med ploščama z $\pm\sigma$ kažeta polji obeh plošč v isto smer in se seštejeta v $\sigma/\varepsilon_0$, zunaj sta nasprotni in se odštejeta v nič.

V notranjosti prevodnika v elektrostatičnem ravnovesju je polje nič: sicer bi sila premikala proste elektrone in ravnovesja ne bi bilo. Po Gaussovem zakonu za poljubno ploskev v notranjosti je tam tudi naboj nič, zato je ves presežni naboj na površini. Če prevodnik postavimo v zunanje polje, se prosti elektroni v njem premaknejo, dokler njihovo polje v notranjosti ne izniči zunanjega (**influenca**). Na tem temelji Faradayeva kletka: kovinsko ohišje zaščiti občutljive merilne naprave pred zunanjimi električnimi motnjami, avtomobil pa potnike ob udaru strele.

### Potencial: električna »višina«

**5. Potencialna energija in potencial.** Električna sila mirujočih nabojev je konservativna kot teža: delo pri premiku naboja ni odvisno od poti. Zato lahko vpeljemo **električni potencial** $\varphi$: potencial v točki je potencialna energija poskusnega naboja v njej, deljena z nabojem: $W_p = q\varphi$. Točko z ničelnim potencialom izberemo sami; za omejeno porazdelitev nabojev jo postavimo v neskončnost. **Napetost** med točkama je razlika potencialov, $U_{AB} = \varphi_A - \varphi_B$; enota je volt, $1\,\mathrm{V} = 1\,\mathrm{J/C}$. Ko se naboj $q$ premakne iz $A$ v $B$, električna sila opravi delo

$$A = qU_{AB}.$$

*Dokaz:* delo konservativne sile je enako zmanjšanju potencialne energije, $A = q\varphi_A - q\varphi_B = qU_{AB}$.

Primerjava s težo: potencial ima vlogo produkta $gh$, napetost vlogo višinske razlike. Razlika je v predznaku: kamen vedno pade navzdol, naboj pa »pade« proti nižjemu ali višjemu potencialu, odvisno od svojega predznaka.

Potencial točkastega naboja $Q$ (z ničlo v neskončnosti) je

$$\varphi = \frac{1}{4\pi\varepsilon_0}\,\frac{Q}{r}.$$

*Izpeljava:* $\varphi(r)$ je delo polja na enoto naboja pri premiku od $r$ do neskončnosti, $\varphi(r) = \int_r^\infty \frac{Q}{4\pi\varepsilon_0r'^2}\,\mathrm{d}r' = \frac{Q}{4\pi\varepsilon_0r}$.

Potencial je **skalar**, zato potenciale več nabojev preprosto seštejemo, s predznaki. Polje in potencial povezuje

$$E_x = -\frac{\mathrm{d}\varphi}{\mathrm{d}x},$$

v homogenem polju preprosto $E = U/d$: na premiku $d$ vzdolž polja sila opravi delo $qEd$, ki je po točki 5 enako $qU$. Polje kaže v smer najhitrejšega padanja potenciala; ploskve z enakim potencialom (**ekvipotencialne ploskve**) so pravokotne na silnice.

:::premisli
Elektron spustimo iz mirovanja v električnem polju. Ali se začne gibati proti višjemu ali proti nižjemu potencialu? Zakaj?
---
Proti višjemu. Sila naboj vedno vleče tja, kjer je njegova potencialna energija $W_p = q\varphi$ manjša. Ker je $q = -e_0$ negativen, je $W_p$ manjša tam, kjer je $\varphi$ večji. Pozitiven naboj bi se gibal proti nižjemu potencialu.
:::

**6. Elektronvolt.** V atomski in molekulski fiziki energijo pogosto merimo v **elektronvoltih**: $1\,\mathrm{eV}$ je energija, ki jo dobi osnovni naboj, ko preleti napetost $1\,\mathrm{V}$, torej $1\,\mathrm{eV} = 1{,}602 \cdot 10^{-19}\,\mathrm{J}$.

### Kondenzator: shramba naboja in energije

**7. Kondenzator.** Kondenzator sta dva prevodnika (plošči), ki nosita nasprotna naboja $\pm Q$. Med njima je napetost $U$, sorazmerna z nabojem. **Kapaciteta** je

$$C = \frac{Q}{U}, \qquad [C] = \mathrm{F} = \mathrm{A\,s/V};$$

odvisna je le od oblike in lege prevodnikov ter snovi med njima, ne od $Q$. Za ploščati kondenzator s površino plošč $S$ in razmikom $d$, med ploščama pa je snov z dielektričnostjo $\varepsilon$, velja

$$C = \frac{\varepsilon\varepsilon_0S}{d}.$$

*Izpeljava* (pogoji kot v točki 4): v dielektriku je polje $E = \sigma/(\varepsilon\varepsilon_0)$, napetost $U = Ed = Qd/(\varepsilon\varepsilon_0S)$, zato $C = Q/U = \varepsilon\varepsilon_0S/d$. Dielektrik poveča kapaciteto $\varepsilon$-krat, ker se njegove molekule polarizirajo in delno izničijo polje plošč.

**8. Vezava kondenzatorjev.** Pri **vzporedni** vezavi je na vseh ista napetost, naboji se seštejejo: $C = C_1 + C_2 + \dots$ Pri **zaporedni** vezavi imajo vsi enak naboj, napetosti se seštejejo: $1/C = 1/C_1 + 1/C_2 + \dots$ *Dokaz:* vzporedno je $Q = Q_1 + Q_2 + \dots = (C_1 + C_2 + \dots)U$. Zaporedno sta notranji plošči sosednjih kondenzatorjev povezani in skupaj nevtralni, zato influenca da vsem enak naboj $Q$ in $U = U_1 + U_2 + \dots = Q(1/C_1 + 1/C_2 + \dots)$. Pravili sta ravno obratni kot pri uporih:

| vezava | skupno vsem | kondenzatorji | upori |
|---|---|---|---|
| vzporedna | napetost | $C = C_1 + C_2 + \dots$ | $1/R = 1/R_1 + 1/R_2 + \dots$ |
| zaporedna | naboj (pri uporih tok) | $1/C = 1/C_1 + 1/C_2 + \dots$ | $R = R_1 + R_2 + \dots$ |

**9. Energija kondenzatorja.** Za polnjenje moramo opraviti delo proti električni sili. Shranjena energija je

$$W = \frac{1}{2}QU = \frac{1}{2}CU^2 = \frac{Q^2}{2C}.$$

*Izpeljava:* ko je na kondenzatorju naboj $q$, je napetost $q/C$; za prenos dodatnega $\mathrm{d}q$ potrebujemo delo $(q/C)\,\mathrm{d}q$, zato $W = \int_0^Q \frac{q}{C}\,\mathrm{d}q = \frac{Q^2}{2C}$. Energija je shranjena v električnem polju: pri ploščatem kondenzatorju je $W = \frac{1}{2}\varepsilon\varepsilon_0\frac{S}{d}(Ed)^2 = \frac{1}{2}\varepsilon\varepsilon_0E^2 \cdot Sd$, zato je gostota energije (energija na prostornino $Sd$) $w = \tfrac{1}{2}\varepsilon\varepsilon_0E^2$.

## Rešeni primeri

### Primer 1 (lažji)

V kristalu kuhinjske soli je razdalja med sosednjima ionoma $\mathrm{Na^+}$ in $\mathrm{Cl^-}$ enaka $0{,}282\,\mathrm{nm}$. Kolikšna je električna sila med ionoma, če ju obravnavamo kot točkasta naboja v praznem prostoru? Kolikšna bi bila sila na isti razdalji v vodi z dielektričnostjo $80$? Kolikšna je potencialna energija para v praznem prostoru, izražena v elektronvoltih?

**Podatki:** $q_1 = +e_0$, $q_2 = -e_0$, $e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$, $r = 0{,}282\,\mathrm{nm} = 2{,}82 \cdot 10^{-10}\,\mathrm{m}$, $\varepsilon = 80$ (voda), $1/(4\pi\varepsilon_0) = 8{,}99 \cdot 10^9\,\mathrm{V\,m/(A\,s)}$
**Iščemo:** silo $F$ v praznem prostoru, silo $F_\mathrm{v}$ v vodi, potencialno energijo $W_p$ v $\mathrm{eV}$

:::formula
$F = \dfrac{1}{4\pi\varepsilon\varepsilon_0}\dfrac{|q_1q_2|}{r^2}$, $W_p = \dfrac{1}{4\pi\varepsilon_0}\dfrac{q_1q_2}{r}$
:::

**Rešitev:**

1. $F = 8{,}99 \cdot 10^9 \cdot (1{,}602 \cdot 10^{-19})^2/(2{,}82 \cdot 10^{-10})^2\,\mathrm{N} \approx 2{,}90 \cdot 10^{-9}\,\mathrm{N}$; sila je privlačna, ker sta naboja raznoimenska.
2. V vodi: $F_\mathrm{v} = F/80 \approx 3{,}6 \cdot 10^{-11}\,\mathrm{N}$, ker je v snovi z dielektričnostjo $\varepsilon$ sila $\varepsilon$-krat manjša.
3. $W_p = -8{,}99 \cdot 10^9 \cdot (1{,}602 \cdot 10^{-19})^2/2{,}82 \cdot 10^{-10}\,\mathrm{J} \approx -8{,}18 \cdot 10^{-19}\,\mathrm{J}$. Tu predznaka nabojev ohranimo, ker je energija skalar s predznakom, ne velikost kot pri sili.
4. V elektronvoltih: $W_p = -8{,}18 \cdot 10^{-19}/1{,}602 \cdot 10^{-19}\,\mathrm{eV} \approx -5{,}1\,\mathrm{eV}$. Negativna energija pomeni vezano stanje.
5. Odgovor: ion deluje na ion s privlačno silo približno $2{,}9\,\mathrm{nN}$, v vodi pa le okoli $0{,}036\,\mathrm{nN}$; potencialna energija para je okoli $-5{,}1\,\mathrm{eV}$.

### Primer 2

Naboj $+4{,}0\,\mathrm{nC}$ je v točki $(-3{,}0\,\mathrm{cm}; 0)$, naboj $-4{,}0\,\mathrm{nC}$ pa v točki $(3{,}0\,\mathrm{cm}; 0)$. Kolikšna sta električna poljska jakost (velikost in smer) in potencial v točki $P = (0; 4{,}0\,\mathrm{cm})$?

**Podatki:** $Q_1 = +4{,}0\,\mathrm{nC}$ v $(-0{,}030\,\mathrm{m}; 0)$, $Q_2 = -4{,}0\,\mathrm{nC}$ v $(0{,}030\,\mathrm{m}; 0)$, točka $P = (0; 0{,}040\,\mathrm{m})$; $1/(4\pi\varepsilon_0) = 8{,}99 \cdot 10^9\,\mathrm{V\,m/(A\,s)}$
**Iščemo:** vektor $\vec{E}$ v točki $P$ in potencial $\varphi_P$

:::formula
$E_k = \dfrac{1}{4\pi\varepsilon_0}\dfrac{|Q_k|}{r_k^2}$, $\vec{E} = \vec{E}_1 + \vec{E}_2$, $\varphi = \dfrac{1}{4\pi\varepsilon_0}\sum_k\dfrac{Q_k}{r_k}$
:::

**Rešitev:**

1. Razdalja od vsakega naboja do $P$: $r = \sqrt{0{,}030^2 + 0{,}040^2}\,\mathrm{m} = 0{,}050\,\mathrm{m}$ (Pitagorov izrek, ker vsak naboj, izhodišče in $P$ tvorijo pravokoten trikotnik).
2. Velikost vsakega polja: $E_1 = E_2 = 8{,}99 \cdot 10^9 \cdot 4{,}0 \cdot 10^{-9}/0{,}050^2\,\mathrm{V/m} \approx 1{,}44 \cdot 10^4\,\mathrm{V/m}$; velikosti sta enaki, ker sta naboja enako velika in enako oddaljena.
3. Smeri: $\vec{E}_1$ kaže od $Q_1$ proti $P$, enotski vektor $(0{,}6;\,0{,}8)$. $\vec{E}_2$ kaže od $P$ proti $Q_2$, enotski vektor $(0{,}6;\,-0{,}8)$, ker polje kaže stran od pozitivnega in k negativnemu naboju.
4. Vsota: $\vec{E} = 1{,}44 \cdot 10^4\,\mathrm{V/m} \cdot (1{,}2;\,0) \approx (1{,}73 \cdot 10^4\,\mathrm{V/m};\,0)$. Navpični komponenti se odštejeta.
5. Potencial: $\varphi_P = 8{,}99 \cdot 10^9\,(4{,}0 \cdot 10^{-9} - 4{,}0 \cdot 10^{-9})/0{,}050\,\mathrm{V} = 0$; potencial je skalar, zato se prispevka nasprotnih predznakov odštejeta.
6. Odgovor: polje v točki $P$ ima velikost približno $1{,}7 \cdot 10^4\,\mathrm{V/m}$ in kaže vzporedno z zveznico nabojev, od pozitivnega proti negativnemu; potencial v $P$ je nič. Ničeln potencial ne pomeni ničelnega polja.

### Primer 3 (težji)

V delavnici sestavimo ploščati kondenzator iz dveh aluminijastih plošč s površino $0{,}020\,\mathrm{m^2}$, ki ju distančniki držijo na razmiku $1{,}0\,\mathrm{mm}$; vmes je zrak. Nabijemo ga na napetost $100\,\mathrm{V}$ in odklopimo od vira. Nato vzporedno s ploščama potisnemo vmes izolacijsko ploščo z dielektričnostjo $4{,}0$ in debelino $0{,}50\,\mathrm{mm}$, tako da ostane ob njej še $0{,}50\,\mathrm{mm}$ zraka. Kolikšni so kapaciteta, naboj, poljska jakost in energija pred vstavitvijo? Kolikšni so po vstavitvi kapaciteta, napetost, polje v zraku in v dielektriku ter energija? Koliko dela je opravilo polje?

**Podatki:** $S = 0{,}020\,\mathrm{m^2}$, $d = 1{,}0\,\mathrm{mm} = 1{,}0 \cdot 10^{-3}\,\mathrm{m}$, $U = 100\,\mathrm{V}$, $\varepsilon = 4{,}0$, plast zraka $d_\mathrm{z} = 0{,}50 \cdot 10^{-3}\,\mathrm{m}$, plast dielektrika $d_\mathrm{d} = 0{,}50 \cdot 10^{-3}\,\mathrm{m}$, $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\mathrm{A\,s/(V\,m)}$, po odklopu je naboj stalen
**Iščemo:** $C$, $Q$, $E$, $W$ pred vstavitvijo; $C'$, $U'$, polji $E_\mathrm{z}$ in $E_\mathrm{d}$, $W'$ po vstavitvi; delo polja $A$

:::formula
$C = \dfrac{\varepsilon\varepsilon_0S}{d}$, $Q = CU$, $E = U/d$, zaporedno $C' = \dfrac{C_\mathrm{z}C_\mathrm{d}}{C_\mathrm{z} + C_\mathrm{d}}$, $W = \tfrac{1}{2}CU^2 = \dfrac{Q^2}{2C}$
:::

**Rešitev:**

1. $C = 8{,}85 \cdot 10^{-12} \cdot 0{,}020/1{,}0 \cdot 10^{-3}\,\mathrm{F} \approx 1{,}77 \cdot 10^{-10}\,\mathrm{F} = 177\,\mathrm{pF}$; faktor $\varepsilon$ je $1{,}0$, ker je vmes zrak.
2. $Q = 1{,}77 \cdot 10^{-10}\,\mathrm{F} \cdot 100\,\mathrm{V} \approx 1{,}77 \cdot 10^{-8}\,\mathrm{C}$.
3. $E = 100\,\mathrm{V}/1{,}0 \cdot 10^{-3}\,\mathrm{m} = 1{,}0 \cdot 10^5\,\mathrm{V/m}$, ker je polje med ploščama homogeno.
4. $W = \tfrac{1}{2} \cdot 1{,}77 \cdot 10^{-10}\,\mathrm{F} \cdot (100\,\mathrm{V})^2 \approx 8{,}85 \cdot 10^{-7}\,\mathrm{J}$.
5. Po vstavitvi sta plast zraka in plast dielektrika dva zaporedno vezana kondenzatorja, ker je meja med plastema ekvipotencialna ploskev in imata obe plasti isti $\sigma$: $C_\mathrm{z} = 8{,}85 \cdot 10^{-12} \cdot 0{,}020/0{,}50 \cdot 10^{-3}\,\mathrm{F} = 354\,\mathrm{pF}$, $C_\mathrm{d} = 4{,}0 \cdot 354\,\mathrm{pF} = 1416\,\mathrm{pF}$.
6. $C' = 354 \cdot 1416/(354 + 1416)\,\mathrm{pF} \approx 283\,\mathrm{pF}$.
7. Naboj odklopljenega kondenzatorja je stalen: $U' = Q/C' = 1{,}77 \cdot 10^{-8}/2{,}832 \cdot 10^{-10}\,\mathrm{V} \approx 62{,}5\,\mathrm{V}$.
8. Polji: $E_\mathrm{z} = \sigma/\varepsilon_0 = 1{,}77 \cdot 10^{-8}/(8{,}85 \cdot 10^{-12} \cdot 0{,}020)\,\mathrm{V/m} = 1{,}0 \cdot 10^5\,\mathrm{V/m}$ (kot prej, ker se $\sigma$ ni spremenila), $E_\mathrm{d} = E_\mathrm{z}/4{,}0 = 2{,}5 \cdot 10^4\,\mathrm{V/m}$. Preizkus: $E_\mathrm{z}d_\mathrm{z} + E_\mathrm{d}d_\mathrm{d} = 50\,\mathrm{V} + 12{,}5\,\mathrm{V} = 62{,}5\,\mathrm{V}$ ✓.
9. Energija: $W' = \tfrac{1}{2}QU' = 0{,}5 \cdot 1{,}77 \cdot 10^{-8} \cdot 62{,}5\,\mathrm{J} \approx 5{,}53 \cdot 10^{-7}\,\mathrm{J}$; obliko s $Q$ izberemo, ker je naboj stalen.
10. Delo polja: $A = W - W' = 8{,}85 \cdot 10^{-7} - 5{,}53 \cdot 10^{-7}\,\mathrm{J} \approx 3{,}3 \cdot 10^{-7}\,\mathrm{J}$; energija se zmanjša, ker polje vleče polarizirano ploščo med plošči.
11. Odgovor: pred vstavitvijo je kapaciteta $177\,\mathrm{pF}$, naboj $17{,}7\,\mathrm{nC}$, poljska jakost $1{,}0 \cdot 10^5\,\mathrm{V/m}$, energija $0{,}89\,\mu\mathrm{J}$. Po vstavitvi je kapaciteta $283\,\mathrm{pF}$, napetost $62{,}5\,\mathrm{V}$, polje v zraku $1{,}0 \cdot 10^5\,\mathrm{V/m}$ in v dielektriku $2{,}5 \cdot 10^4\,\mathrm{V/m}$, energija $0{,}55\,\mu\mathrm{J}$; polje je opravilo okoli $0{,}33\,\mu\mathrm{J}$ dela. Če bi dielektrik zapolnil ves prostor, bi napetost padla na $25\,\mathrm{V}$.

### Primer 4 – zdaj ti

Celična membrana deluje kot kondenzator s specifično kapaciteto $1{,}0\,\mu\mathrm{F/cm^2}$. Pri mirovni napetosti $70\,\mathrm{mV}$ je na vsaki strani membrane presežek nabojev. Koliko enkrat nabitih ionov presežka je na vsakem kvadratnem mikrometru membrane?

**Podatki:** $C_s = 1{,}0\,\mu\mathrm{F/cm^2}$ (kapaciteta na enoto površine), $U = 70\,\mathrm{mV} = 0{,}070\,\mathrm{V}$, $S = 1{,}0\,\mu\mathrm{m^2} = 1{,}0 \cdot 10^{-12}\,\mathrm{m^2}$, naboj iona $e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$
**Iščemo:** število ionov $N$ na $1\,\mu\mathrm{m^2}$

:::formula
$Q = CU$, za del membrane $C = C_sS$; $N = Q/e_0$
:::

**Rešitev:**

1. Pretvorba v enote SI: $C_s = 1{,}0 \cdot 10^{-6}\,\mathrm{F}/10^{-4}\,\mathrm{m^2} = 1{,}0 \cdot 10^{-2}\,\mathrm{F/m^2}$, ker je $1\,\mathrm{cm^2} = 10^{-4}\,\mathrm{m^2}$.
2. Naboj na enoto površine: $\sigma = C_sU = 1{,}0 \cdot 10^{-2} \cdot 0{,}070\,\mathrm{C/m^2} = 7{,}0 \cdot 10^{-4}\,\mathrm{C/m^2}$, ker zveza $Q = CU$ velja za vsak kos membrane posebej.
3. Izračunaj sam naboj na $1\,\mu\mathrm{m^2}$ in iz njega število ionov.

:::premisli
Koliko ionov presežka je na kvadratnem mikrometru?
---
$Q = \sigma S = 7{,}0 \cdot 10^{-4} \cdot 1{,}0 \cdot 10^{-12}\,\mathrm{C} = 7{,}0 \cdot 10^{-16}\,\mathrm{C}$, torej $N = Q/e_0 = 7{,}0 \cdot 10^{-16}/1{,}602 \cdot 10^{-19} \approx 4{,}4 \cdot 10^3$ ionov. To je drobcen delež vseh ionov v celici, zato se koncentracija pri nastanku napetosti skoraj ne spremeni.
:::

## Pogoste napake

- **Seštevanje velikosti polj.** Polja so vektorji. V Primeru 2 bi seštevanje velikosti dalo $2{,}9 \cdot 10^4\,\mathrm{V/m}$ namesto $1{,}7 \cdot 10^4\,\mathrm{V/m}$.
- **Potencial kot vektor.** Potencial je skalar s predznakom. Ničeln potencial ne pomeni, da je polje nič, in obratno.
- **Kvadrat razdalje pri potencialu.** Sila in polje točkastega naboja padata z $1/r^2$, potencial in potencialna energija pa z $1/r$.
- **Enote kapacitete.** Navadne kapacitete so $\mathrm{pF}$ do $\mu\mathrm{F}$; pazi na predpone in razmik v metrih.
- **Vezava kondenzatorjev kot vezava uporov.** Pravili sta obratni kot pri uporih.
- **Odklopljen ali priključen kondenzator.** Odklopljen kondenzator ohrani naboj, priključen napetost.

## Povzetek

- Coulombov zakon: $F = \dfrac{|q_1q_2|}{4\pi\varepsilon\varepsilon_0r^2}$; v snovi z dielektričnostjo $\varepsilon$ je sila $\varepsilon$-krat manjša.
- Poljska jakost $\vec{E} = \vec{F}/q$; točkasti naboj $E = Q/(4\pi\varepsilon_0r^2)$; polja seštevamo vektorsko.
- Potencial $\varphi = Q/(4\pi\varepsilon_0r)$ je skalar; napetost $U = \varphi_A - \varphi_B$, delo $A = qU$; $E_x = -\mathrm{d}\varphi/\mathrm{d}x$, homogeno polje $E = U/d$.
- Kondenzator: $C = Q/U$, ploščati $C = \varepsilon\varepsilon_0S/d$; vzporedno $C = \sum C_k$, zaporedno $1/C = \sum 1/C_k$.
- Energija $W = \tfrac{1}{2}CU^2 = Q^2/(2C)$, gostota energije $w = \tfrac{1}{2}\varepsilon\varepsilon_0E^2$.

## Za izpit

Znati moraš povedati:

- Coulombov zakon v vektorski obliki z vsemi pogoji (mirujoča točkasta naboja, prazen prostor ali homogen dielektrik povsod okoli njiju) in definicijo poljske jakosti s poskusnim nabojem;
- Gaussov zakon in z njim izpeljavo polja velike plošče in ploščatega kondenzatorja ter dokaz, da je polje v prevodniku v ravnovesju nič;
- definicijo potenciala in napetosti, dokaz $A = qU_{AB}$, izpeljavo $\varphi = Q/(4\pi\varepsilon_0r)$ in $E = U/d$;
- definicijo kapacitete, izpeljavo $C = \varepsilon\varepsilon_0S/d$ in pravil za vzporedno in zaporedno vezavo;
- izpeljavo $W = Q^2/(2C)$ in gostote energije $w = \tfrac{1}{2}\varepsilon\varepsilon_0E^2$.

### Naloga 1

Elektron pospešimo iz mirovanja z napetostjo $U_a = 1000\,\mathrm{V}$ in ga usmerimo vzporedno s ploščama na sredino ploščatega kondenzatorja z dolžino plošč $l = 4{,}0\,\mathrm{cm}$ in razmikom $d = 1{,}0\,\mathrm{cm}$, na katerem je napetost $U_p = 50\,\mathrm{V}$. Kolikšna sta prečni odmik elektrona na izstopu iz kondenzatorja in kot $\vartheta$, za katerega se odkloni njegov tir? Pokaži, da rezultat ni odvisen od mase in velikosti naboja delca. Robove polja in težo zanemari; $m_e = 9{,}11 \cdot 10^{-31}\,\mathrm{kg}$, $e_0 = 1{,}602 \cdot 10^{-19}\,\mathrm{C}$.

**Rešitev:**

1. Hitrost po pospeševanju iz $\tfrac{1}{2}m_ev_0^2 = e_0U_a$: $v_0 = \sqrt{2 \cdot 1{,}602 \cdot 10^{-19} \cdot 1000/9{,}11 \cdot 10^{-31}}\,\mathrm{m/s} \approx 1{,}875 \cdot 10^7\,\mathrm{m/s}$.
2. Polje v kondenzatorju je homogeno, $E = U_p/d = 50/0{,}010\,\mathrm{V/m} = 5{,}0 \cdot 10^3\,\mathrm{V/m}$, in pravokotno na $v_0$, zato se vzdolžna hitrost ne spremeni.
3. Prečni pospešek: $a = e_0E/m_e = 1{,}602 \cdot 10^{-19} \cdot 5{,}0 \cdot 10^3/9{,}11 \cdot 10^{-31}\,\mathrm{m/s^2} \approx 8{,}79 \cdot 10^{14}\,\mathrm{m/s^2}$.
4. Čas preleta: $t = l/v_0 = 0{,}040/1{,}875 \cdot 10^7\,\mathrm{s} \approx 2{,}13 \cdot 10^{-9}\,\mathrm{s}$.
5. Odmik: $y = \tfrac{1}{2}at^2 = 0{,}5 \cdot 8{,}79 \cdot 10^{14} \cdot (2{,}13 \cdot 10^{-9})^2\,\mathrm{m} \approx 2{,}0 \cdot 10^{-3}\,\mathrm{m}$; to je manj od $d/2 = 5{,}0\,\mathrm{mm}$, zato elektron plošče ne zadene.
6. Kot: $\tan\vartheta = at/v_0 = 8{,}79 \cdot 10^{14} \cdot 2{,}13 \cdot 10^{-9}/1{,}875 \cdot 10^7 \approx 0{,}10$, torej $\vartheta \approx 5{,}7^\circ$.
7. Splošno za delec z nabojem $q$ in maso $m$: $v_0^2 = 2qU_a/m$ in $a = qU_p/(md)$, zato $y = \dfrac{a}{2}\,\dfrac{l^2}{v_0^2} = \dfrac{U_pl^2}{4U_ad}$ in $\tan\vartheta = \dfrac{U_pl}{2U_ad}$; $q$ in $m$ se pokrajšata. Preizkus: $50 \cdot 0{,}040^2/(4 \cdot 1000 \cdot 0{,}010)\,\mathrm{m} = 2{,}0 \cdot 10^{-3}\,\mathrm{m}$ ✓.
8. Odgovor: elektron se odmakne za $2{,}0\,\mathrm{mm}$ in izstopi pod kotom okoli $5{,}7^\circ$ glede na vpadno smer; enak tir bi imel vsak delec z nabojem istega predznaka, pospešen z isto napetostjo.

### Naloga 2

Natančno navedi Gaussov zakon. Z njim izpelji poljsko jakost in kapaciteto ploščatega kondenzatorja z dielektrikom ter dokaži, da je energija kondenzatorja shranjena v polju z gostoto $w = \tfrac{1}{2}\varepsilon\varepsilon_0E^2$. Povej, kje uporabiš katero predpostavko.

**Rešitev:**

1. Gaussov zakon: za vsako zaprto ploskev je električni pretok skozi njo enak celotnemu naboju znotraj nje, deljenemu z $\varepsilon_0$; $\mathrm{d}\vec{S}$ kaže navzven. Če homogen dielektrik zapolnjuje ves prostor s poljem, namesto $\varepsilon_0$ pišemo $\varepsilon\varepsilon_0$ in štejemo le prosti naboj na prevodnikih.
2. Predpostavka: plošči sta veliki v primerjavi z razmikom $d$, zato je polje daleč od robov zaradi simetrije pravokotno na plošči.
3. Valj z osnovno ploskvijo $S_0$ okoli dela ene plošče: skozi plašč ni pretoka (polje je vzporedno s plaščem), skozi osnovni ploskvi je $2ES_0$, naboj v valju pa $\sigma S_0$; zato je polje ene plošče $E = \sigma/(2\varepsilon\varepsilon_0)$.
4. Superpozicija: med ploščama z $\pm\sigma$ kažeta polji obeh plošč od $+$ proti $-$, $E = \sigma/(\varepsilon\varepsilon_0)$; zunaj sta nasprotni, $E = 0$.
5. Polje je homogeno, zato $U = Ed = Qd/(\varepsilon\varepsilon_0S)$ in $C = Q/U = \varepsilon\varepsilon_0S/d$.
6. Energija: pri naboju $q$ je napetost $q/C$, prenos $\mathrm{d}q$ zahteva delo $(q/C)\,\mathrm{d}q$, zato $W = \int_0^Q (q/C)\,\mathrm{d}q = Q^2/(2C) = \tfrac{1}{2}CU^2$.
7. Z $U = Ed$ in izrazom za $C$: $W = \tfrac{1}{2}\varepsilon\varepsilon_0\tfrac{S}{d}E^2d^2 = \tfrac{1}{2}\varepsilon\varepsilon_0E^2 \cdot Sd$. Vse polje je v prostornini $Sd$ med ploščama (točka 4), zato je gostota energije $w = W/(Sd) = \tfrac{1}{2}\varepsilon\varepsilon_0E^2$.
8. Odgovor: $E = \sigma/(\varepsilon\varepsilon_0)$, $C = \varepsilon\varepsilon_0S/d$, $w = \tfrac{1}{2}\varepsilon\varepsilon_0E^2$; simetrijo (velike plošče) uporabimo pri smeri polja in ničelnem polju zunaj, homogen dielektrik pri faktorju $\varepsilon$.

## Drugače: Na sliki

Polje dipola iz Primera 2 ($+$ levo, $-$ desno, točka $P$ zgoraj na simetrali):

```
                 P
              ↗  →  ↘
            /    |    \
          /      |      \
     (+)--------+--------(-)
   -3 cm         0        3 cm
```

Polje $+$ kaže od njega, polje $-$ k njemu; navpični komponenti se izničita, zato v $P$ polje kaže vodoravno v desno. Simetrala dipola je ekvipotencialna ploskev s potencialom nič. Pri ploščatem kondenzatorju so silnice vzporedne in enakomerno razmaknjene, ekvipotencialne ploskve pa ravnine, vzporedne s ploščama.

## Drugače: Uporaba v stroki

**Gelska elektroforeza.** Napetost $100\,\mathrm{V}$ na $10\,\mathrm{cm}$ dolgem gelu da polje $1000\,\mathrm{V/m}$. Negativno nabita DNK potuje proti anodi, gel jo kot sito loči po velikosti.

**Elektrofiziologija.** Membrana z debelino okoli $5\,\mathrm{nm}$ in napetostjo $70\,\mathrm{mV}$ ima v sebi polje $E = U/d \approx 0{,}070/5 \cdot 10^{-9}\,\mathrm{V/m} = 1{,}4 \cdot 10^7\,\mathrm{V/m}$. Specifična kapaciteta je okoli $1\,\mu\mathrm{F/cm^2}$, zato iz kapacitete celice ocenimo površino membrane.

**Elektrostatična razelektritev.** V suhem zraku preskoči iskra pri okoli $3 \cdot 10^6\,\mathrm{V/m}$ in lahko uniči čip, zato pri delu z elektroniko nosimo ozemljene zapestnice.

## Drugače: Bolj natančno

**Potencial iz polja.** Ker je $\oint\vec{E} \cdot \mathrm{d}\vec{s} = 0$, je potencial dobro definiran:

$$\varphi(\vec{r}) = -\int_{\infty}^{\vec{r}}\vec{E} \cdot \mathrm{d}\vec{s}, \qquad \vec{E} = -\nabla\varphi.$$

**Dipol.** Par nabojev $\pm q$ na razdalji $l$ ima **dipolni moment** $\vec{p} = q\vec{l}$ (od $-$ proti $+$). Daleč od dipola potencial pada kot $1/r^2$, polje pa kot $1/r^3$. V zunanjem homogenem polju na dipol deluje navor $\vec{M} = \vec{p} \times \vec{E}$ in ima energijo $W = -\vec{p} \cdot \vec{E}$. Polarne molekule (voda: $p \approx 6{,}2 \cdot 10^{-30}\,\mathrm{A\,s\,m}$) se zato v polju usmerijo; to je mikroskopski izvor dielektričnosti.

## Preveri se

? Razdaljo med točkastima nabojema podvojimo. Kako se spremeni sila med njima?
- Razpolovi se.
~ Misliš, da sila z razdaljo pada linearno; Coulombova sila pada s kvadratom razdalje.
+ Zmanjša se na četrtino.
- Ostane enaka.
~ Naboja se res nista spremenila, a sila je odvisna tudi od razdalje med njima.
> $F \propto 1/r^2$, zato je pri dvojni razdalji sila $1/2^2 = 1/4$ prvotne.

? Med ploščama na razmiku $4{,}0\,\mathrm{mm}$ je napetost $200\,\mathrm{V}$. Kolikšna je poljska jakost?
+ $5{,}0 \cdot 10^4\,\mathrm{V/m}$
- $800\,\mathrm{V/m}$
~ To je $U \cdot d$ z razmikom v milimetrih: napetost si pomnožil z razmikom, namesto da bi jo delil.
- $50\,\mathrm{V/m}$
~ Razmik si pustil v milimetrih; v $E = U/d$ mora biti $d$ v metrih.
> $E = U/d = 200\,\mathrm{V}/0{,}0040\,\mathrm{m} = 5{,}0 \cdot 10^4\,\mathrm{V/m}$. $50\,\mathrm{V/m}$ dobiš, če razmika ne pretvoriš v metre.

? Koliko energije shrani kondenzator s kapaciteto $10\,\mu\mathrm{F}$ pri napetosti $12\,\mathrm{V}$?
- $1{,}44\,\mathrm{mJ}$
~ Izpustil si faktor $\tfrac{1}{2}$: napetost med polnjenjem narašča od nič, zato je delo le polovica $CU^2$.
+ $0{,}72\,\mathrm{mJ}$
- $0{,}06\,\mathrm{mJ}$
~ To je $\tfrac{1}{2}CU$; napetost v formuli za energijo nastopa v kvadratu.
> $W = \tfrac{1}{2}CU^2 = \tfrac{1}{2} \cdot 10 \cdot 10^{-6} \cdot 144\,\mathrm{J} = 0{,}72\,\mathrm{mJ}$. $1{,}44\,\mathrm{mJ}$ je $CU^2$ brez faktorja $\tfrac{1}{2}$.

? Kondenzatorja s kapacitetama $2{,}0\,\mu\mathrm{F}$ in $3{,}0\,\mu\mathrm{F}$ vežemo zaporedno. Kolikšna je nadomestna kapaciteta?
- $5{,}0\,\mu\mathrm{F}$
~ Kapacitete si seštel kot pri uporih v zaporedni vezavi; pri kondenzatorjih tako velja za vzporedno vezavo.
- $6{,}0\,\mu\mathrm{F}$
~ To je le števec $C_1C_2$ formule $C = C_1C_2/(C_1 + C_2)$; pozabil si deliti z vsoto.
+ $1{,}2\,\mu\mathrm{F}$
> $1/C = 1/2{,}0 + 1/3{,}0 = 5/6\,\mu\mathrm{F}^{-1}$, torej $C = 1{,}2\,\mu\mathrm{F}$. $5{,}0\,\mu\mathrm{F}$ velja za vzporedno vezavo.

? Nabit kondenzator odklopimo od vira in plošči razmaknemo na dvojno razdaljo. Kaj se zgodi z napetostjo med ploščama?
- Ostane enaka.
~ Napetost ostane enaka le, če je kondenzator priključen na vir; odklopljen ohrani naboj.
+ Podvoji se.
- Razpolovi se.
~ Razpolovi se kapaciteta, ne napetost; pri stalnem naboju je $U = Q/C$, zato manjša kapaciteta pomeni večjo napetost.
> $C = \varepsilon\varepsilon_0S/d$ se pri dvojnem razmiku razpolovi. Naboj odklopljenega kondenzatorja je stalen, zato se $U = Q/C$ podvoji; polje $E = U/d$ ostane enako.

:::simboli
\vec{F} | vektor električne sile | | N
\vec{e}_{12} | enotski vektor od q₁ proti q₂ | | –
F | električna sila med nabojema | F = \frac{1}{4\pi\varepsilon_0}\,\frac{\lvert q_1q_2\rvert}{r^2} | N
\varepsilon_0 | influenčna konstanta | | A\,s/(V\,m) | 8,85 · 10⁻¹² A s/(V m)
\varepsilon | dielektričnost snovi | | – | voda: približno 80
q_1, q_2 | točkasta naboja | | C
q | poskusni naboj | | C
Q | naboj, ki ustvarja polje | | C | pri kondenzatorju naboj na plošči
Q_k | naboj k-tega točkastega naboja | | C
r | razdalja od naboja | | m
\vec{r} | krajevni vektor točke | | m
r_k | razdalja od k-tega naboja | | m
k | zaporedna številka naboja | | – | indeks v vsoti
\vec{E} | vektor jakosti električnega polja | \vec{E} = \frac{\vec{F}}{q} | V/m
\vec{E}_1, \vec{E}_2 | jakosti polja posameznih nabojev | | V/m | skupno polje je njuna vektorska vsota
E | jakost električnega polja | E = \frac{1}{4\pi\varepsilon_0}\,\frac{\lvert Q\rvert}{r^2} | V/m | homogeno polje: E = U/d
E_x | komponenta polja v smeri x | E_x = -\frac{\mathrm{d}\varphi}{\mathrm{d}x} | V/m
E_k | jakost polja k-tega naboja | E_k = \frac{1}{4\pi\varepsilon_0}\frac{\lvert Q_k\rvert}{r_k^2} | V/m | ne kinetična energija
x | koordinata vzdolž osi x | | m
\sigma | ploskovna gostota naboja | \sigma = \frac{Q}{S} | C/m^2
S | površina plošče | | m^2
A | delo električne sile | A = qU_{AB} | J
U_{AB} | napetost med točkama A in B | U_{AB} = \varphi_A - \varphi_B | V
U | napetost med ploščama kondenzatorja | | V
\varphi | električni potencial | \varphi = \frac{1}{4\pi\varepsilon_0}\,\frac{Q}{r} | V | potencialna energija na enoto naboja
C | kapaciteta kondenzatorja | C = \frac{Q}{U} | F
C_s | kapaciteta na enoto površine membrane | | F/m^2 | v nalogi 1,0 µF/cm²
d | razmik med ploščama | | m
W | energija nabitega kondenzatorja | W = \frac{1}{2}QU = \frac{1}{2}CU^2 = \frac{Q^2}{2C} | J
W_p | potencialna energija naboja | W_p = q\varphi | J
\vec{s} | premik (element poti) | | m
N | število ionov | N = \frac{Q}{e_0} | –
e_0 | osnovni naboj | | C | 1,602 · 10⁻¹⁹ C
:::
