---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Med drugo svetovno vojno so v ZDA zgradili več tisoč tovornih ladij razreda Liberty. Da bi jih izdelali hitro in poceni, so trup namesto kovičenja varili. Nekaj ladij je v mrzlem morju nenadoma počilo, nekatere celo na dvoje, čeprav niso bile preobremenjene. Preiskave so pokazale, da je bilo jeklo dovolj trdno, a pri nizki temperaturi **krhko**. Ni prenašalo udarca in razpoke.

Od takrat jekla ne kupujemo le po ceni na kilogram. Na atestu (certifikatu) so napisane številke, ki povedo, kaj plačaš: meja tečenja, natezna trdnost, raztezek in udarna žilavost pri določeni temperaturi. Oznaka konstrukcijskega jekla S355J2 na primer pove, da ima meja tečenja vsaj $355\,\mathrm{MPa}$ in da epruveta pri $-20\,^\circ\mathrm{C}$ ob udarcu porabi vsaj $27\,\mathrm{J}$. Kako te številke izmerimo in kaj pomenijo, je vsebina te teme.

## Razlaga

**Natezni preizkus na konkretni epruveti.** Okroglo jekleno epruveto s premerom $d_0 = 10{,}0\,\mathrm{mm}$ vpnemo v trgalni stroj. Na njej označimo merilno dolžino $L_0 = 50{,}0\,\mathrm{mm}$. Stroj jo počasi razteguje in beleži silo $F$ ter podaljšek $\Delta L$.

| točka | $F$ [kN] | kaj vidimo |
|---|---|---|
| prožno območje | $12{,}0$ | podaljšek $0{,}0364\,\mathrm{mm}$, po razbremenitvi izgine |
| meja tečenja | $28{,}3$ | epruveta se začne trajno podaljševati |
| največja sila | $41{,}6$ | na enem mestu nastane zožitev (vrat) |
| lom | – | $L_u = 61{,}0\,\mathrm{mm}$, premer v vratu $6{,}0\,\mathrm{mm}$ |

**Od sile k napetosti.** Debelejša epruveta prenese večjo silo, zato silo delimo s prvotnim presekom $S_0 = \pi d_0^2/4 = 78{,}54\,\mathrm{mm^2}$. Dobimo **inženirsko (nazivno) napetost** $\sigma = F/S_0$ v $\mathrm{MPa}$ ($1\,\mathrm{MPa} = 1\,\mathrm{N/mm^2}$). Pri $12{,}0\,\mathrm{kN}$ je $\sigma \approx 152{,}8\,\mathrm{MPa}$. Podaljšek delimo z $L_0$ in dobimo **raztezek** (relativni podaljšek) $\varepsilon = \Delta L/L_0 = 7{,}28 \cdot 10^{-4}$. Tako rezultat ni odvisen od velikosti epruvete.

**Prožnost.** *Hookov zakon:* naj bo palica obremenjena enoosno (sila vzdolž osi, enakomerno po preseku) in naj napetost ne preseže **meje sorazmernosti** (največje napetosti, do katere je $\sigma$ še sorazmerna z $\varepsilon$). Potem je napetost sorazmerna z raztezkom, $\sigma = E\,\varepsilon$, deformacija pa po razbremenitvi izgine. Za našo epruveto je $E = 152{,}8\,\mathrm{MPa} / 7{,}28 \cdot 10^{-4} \approx 2{,}10 \cdot 10^5\,\mathrm{MPa} = 210\,\mathrm{GPa}$. **Modul elastičnosti** $E$ pove togost: odvisen je od vezi med atomi, zato imajo skoraj vsa jekla približno $210\,\mathrm{GPa}$. Iz $\dfrac{F}{S_0} = E\dfrac{\Delta L}{L_0}$ sledi podaljšek palice $\Delta L = \dfrac{F L_0}{E S_0}$. Palica se hkrati prečno skrči; prečni raztezek je $\varepsilon_\mathrm{q} = -\nu\,\varepsilon$; Poissonovo število $\nu$ je za jekla okoli $0{,}3$.

:::premisli
Konstruktor želi, da se natezna palica pod isto majhno obremenitvijo manj podaljša. Zato navadno žarjeno jeklo zamenja s kaljenim, ki je precej trdnejše. Bo palica res manj podaljšana?
---
Ne. Podaljšek v prožnem območju določa $E$, ta pa je pri obeh približno $210\,\mathrm{GPa}$. Toplotna obdelava premakne mejo tečenja, togosti pa skoraj ne spremeni.
:::

**Meja tečenja in natezna trdnost.** Ko **dislokacije** (črtne napake v kristalni mreži) začnejo drseti, se kovina trajno deformira. Napetost, pri kateri se to zgodi, je **meja tečenja** $R_e = 28\,300\,\mathrm{N}/78{,}54\,\mathrm{mm^2} \approx 360\,\mathrm{MPa}$. Pri jeklih brez izrazite meje tečenja namesto nje odčitamo **dogovorno mejo tečenja** $R_{p0,2}$: napetost, pri kateri bi po razbremenitvi ostalo $0{,}2\,\%$ trajnega raztezka. Na diagramu jo dobimo kot presečišče krivulje s premico, vzporedno prožni premici in premaknjeno za $\varepsilon = 0{,}002$. Največja sila da **natezno trdnost** $R_m = 41\,600\,\mathrm{N}/78{,}54\,\mathrm{mm^2} \approx 530\,\mathrm{MPa}$. Konstrukcije dimenzioniramo po $R_e$, saj trajno upognjen nosilec ni več uporaben.

**Prožna energija.** Če je krivulja do meje tečenja premica (meja sorazmernosti je pri jeklih skoraj enaka $R_e$), material do $R_e$ shrani delo na enoto prostornine, ki je enako ploščini trikotnika pod premico: $U_\mathrm{p} = \tfrac12 R_e\,\varepsilon_e = \dfrac{R_e^2}{2E}$, ker je $\varepsilon_e = R_e/E$. Enota $\mathrm{MPa} = \mathrm{MJ/m^3}$.

**Duktilnost.** Kako zelo se material raztegne pred lomom, povesta **raztezek po pretrgu** $A = (L_u - L_0)/L_0 = 22{,}0\,\%$ in **kontrakcija** $Z = (S_0 - S_u)/S_0 = 64{,}0\,\%$, kjer je $S_u = 28{,}27\,\mathrm{mm^2}$ presek v vratu. Pri okroglem preseku je $S = \pi d^2/4$, zato se $\pi/4$ pokrajša in $Z = 1 - \dfrac{d_u^2}{d_0^2}$. Velika $A$ in $Z$ pomenita, da material pred lomom opozori z vidno deformacijo.

**Posplošitev: krivulja $\sigma$–$\varepsilon$.** Vse te točke ležijo na eni krivulji: najprej strma premica (naklon $E$), nato tečenje, utrjevanje (napetost spet raste, ker se dislokacije ovirajo) do $R_m$ in padec po nastanku vratu do loma. Krhek material, npr. siva litina, se zlomi že na koncu premice, skoraj brez trajne deformacije.

**Prava napetost.** Prava napetost deli s trenutnim presekom: $\sigma_\mathrm{p} = F/S$. Naj se epruveta deformira enakomerno (pred nastankom vratu) in naj se prostornina pri plastični deformaciji ohranja. Potem je $\sigma_\mathrm{p} = \sigma(1 + \varepsilon)$. *Dokaz:* iz $S L = S_0 L_0$ in $L = L_0(1 + \varepsilon)$ sledi $S = \dfrac{S_0}{1 + \varepsilon}$, torej $\sigma_\mathrm{p} = \dfrac{F(1+\varepsilon)}{S_0} = \sigma(1 + \varepsilon)$. Po $R_m$ se deformacija zbere v vratu in ta zveza ne velja več: sila pada, inženirska napetost (padajoča sila, deljena s stalnim $S_0$) zato pade, prava pa raste vse do loma, ker se presek v vratu manjša še hitreje od sile.

**Trdota.** Natezni preizkus uniči epruveto, zato v praksi pogosto merimo **trdoto**, odpornost proti vtiskovanju. Pri **Vickersovi** metodi vtisnemo diamantno piramido s silo $F$ in izmerimo diagonali vtiska. Pri **Brinellovi** vtisnemo kroglico iz trdine (volframovega karbida), pri **Rockwellovi** merimo globino vtiska. Večji vtisk pomeni mehkejši material. Za jekla velja približno $R_m \approx 3{,}3 \cdot \mathrm{HV}$ (v $\mathrm{MPa}$), zato trdota hitro oceni trdnost brez razreza dela.

**Žilavost.** **Udarna žilavost** pove, koliko energije material porabi, ko ga zlomi udarec. Pri **Charpyjevem** preizkusu nihalo z višine $h_1$ zlomi epruveto z zarezo V in se dvigne le do $h_2$. Porabljena energija je $\mathrm{KV} = m g (h_1 - h_2)$ v joulih. *Izpeljava:* v skrajnih legah nihalo miruje, zato je razlika njegovih potencialnih energij $mgh_1 - mgh_2$ enaka energiji, ki jo je oddalo epruveti; pri tem $h$ merimo za težišče nihala in zanemarimo trenje in upor zraka. Te izgube v praksi izmerimo z nihajem brez epruvete in jih odštejemo. Jekla s prostorsko (telesno) centrirano kubično mrežo BCC (ferit) imajo **prehodno temperaturo**: nad njo se lomijo žilavo z veliko energije, pod njo krhko z malo. Kovine s ploskovno centrirano kubično mrežo FCC (avstenitno nerjavno jeklo, aluminij, baker) tega prehoda nimajo. To je razložilo ladje Liberty.

:::premisli
Pri kaljenju jeklo hitro ohladimo in nastane **martenzit**, mreža, prenasičena z ogljikom in močno napeta. Kako se spremenita trdota in žilavost in zakaj jeklo nato popuščamo (ponovno segrejemo na zmerno temperaturo)?
---
Trdota močno naraste, žilavost pa pade, ker je martenzit napet in krhek. S popuščanjem žrtvujemo del trdote, da dobimo nazaj žilavost.
:::

## Rešeni primeri

### Primer 1 (lažji): trdota po Vickersu

Na vzorcu jekla s silo $294{,}2\,\mathrm{N}$ (HV30) izmerimo diagonali vtiska $0{,}510\,\mathrm{mm}$ in $0{,}530\,\mathrm{mm}$. Kolikšna je trdota?

**Podatki:** $F = 294{,}2\,\mathrm{N}$, $d_1 = 0{,}510\,\mathrm{mm}$, $d_2 = 0{,}530\,\mathrm{mm}$
**Iščemo:** trdoto $\mathrm{HV}$

:::formula
$\mathrm{HV} = 0{,}1891\,\dfrac{F}{d^2}$, $F$ v N, $d = \dfrac{d_1 + d_2}{2}$ v mm (izvor konstante: razdelek »Bolj natančno«)
:::

**Rešitev:**

1. Povprečna diagonala: $d = \dfrac{0{,}510 + 0{,}530}{2} = 0{,}520\,\mathrm{mm}$; povprečimo, ker vtisk ni nikoli popolnoma kvadraten.
2. $d^2 = 0{,}520^2 = 0{,}2704\,\mathrm{mm^2}$.
3. $\mathrm{HV} = 0{,}1891 \cdot \dfrac{294{,}2}{0{,}2704} \approx 206$.
4. Odgovor: trdota je približno $206\,\mathrm{HV30}$.

### Primer 2: katera palica je cenejša na enoto nosilnosti

V trgovini z jeklom prodajajo okrogle palice premera $8{,}0\,\mathrm{mm}$. Meter palice iz S235 stane $2{,}40$ €, iz S355 pa $2{,}90$ €. Pri kateri plačaš manj za vsak kilonewton sile, ki jo palica prenese do meje tečenja?

**Podatki:** $d = 8{,}0\,\mathrm{mm}$, $R_{e1} = 235\,\mathrm{MPa}$, $R_{e2} = 355\,\mathrm{MPa}$, cena $2{,}40$ € in $2{,}90$ € na meter
**Iščemo:** sili $F_1$, $F_2$ in ceno na kN

:::formula
$F = R_e \cdot S$, $S = \dfrac{\pi d^2}{4}$; cena na kN $= \dfrac{\text{cena}}{F}$
:::

**Rešitev:**

1. Presek: $S = \dfrac{\pi \cdot 8{,}0^2}{4} \approx 50{,}27\,\mathrm{mm^2}$.
2. S235: $F_1 = 235\,\mathrm{N/mm^2} \cdot 50{,}27\,\mathrm{mm^2} \approx 11\,810\,\mathrm{N} = 11{,}8\,\mathrm{kN}$.
3. S355: $F_2 = 355\,\mathrm{N/mm^2} \cdot 50{,}27\,\mathrm{mm^2} \approx 17\,840\,\mathrm{N} = 17{,}8\,\mathrm{kN}$.
4. Cena na kN: $\dfrac{2{,}40}{11{,}81} \approx 0{,}203$ € in $\dfrac{2{,}90}{17{,}84} \approx 0{,}163$ €.
5. Odgovor: dražja palica S355 je na enoto nosilnosti za približno petino cenejša, ker trdnost naraste bolj kot cena.

### Primer 3 (težji): je cenejša ponudba res cenejša?

Za zunanji žerjav, ki bo delal pozimi do $-20\,^\circ\mathrm{C}$, potrebujemo $2400\,\mathrm{kg}$ pločevine. Ponudnik A prodaja S355JR po $1{,}10$ €/kg, ponudnik B S355J2 po $1{,}18$ €/kg. Charpyjevo nihalo z maso $20{,}0\,\mathrm{kg}$ (višine merimo za težišče) spustimo z višine $1{,}50\,\mathrm{m}$. Brez epruvete se zaradi trenja in upora zraka dvigne do $1{,}49\,\mathrm{m}$. Epruveta iz ponudbe A, ohlajena na $-20\,^\circ\mathrm{C}$, ga po lomu pusti dvigniti do $1{,}38\,\mathrm{m}$. Zahteva je vsaj $27\,\mathrm{J}$. (a) Kolikšna je udarna žilavost jekla A, popravljena za izgube? (b) Do katere višine bi se nihalo smelo največ dvigniti, da bi epruveta ustrezala? (c) Katero ponudbo izberemo in koliko več plačamo?

**Podatki:** $m_{\text{pl}} = 2400\,\mathrm{kg}$, $1{,}10$ €/kg in $1{,}18$ €/kg, $m = 20{,}0\,\mathrm{kg}$, $h_1 = 1{,}50\,\mathrm{m}$, $h_0 = 1{,}49\,\mathrm{m}$ (prosti nihaj), $h_2 = 1{,}38\,\mathrm{m}$, $g = 9{,}81\,\mathrm{m/s^2}$, zahteva $\mathrm{KV} \ge 27\,\mathrm{J}$ pri $-20\,^\circ\mathrm{C}$
**Iščemo:** $\mathrm{KV}$ jekla A pri $-20\,^\circ\mathrm{C}$, največjo dopustno $h_2$, izbiro in razliko v ceni

:::formula
$\mathrm{KV} = m g (h_0 - h_2)$, kjer $h_0$ upošteva izgube; $h_{2,\max} = h_0 - \dfrac{\mathrm{KV}_{\min}}{m g}$; razlika v ceni $= m_{\text{pl}} \cdot \Delta(\text{cena na kg})$
:::

**Rešitev:**

1. Višinska razlika: $h_1 - h_2 = 1{,}50 - 1{,}38 = 0{,}12\,\mathrm{m}$, kar brez popravka da $20{,}0 \cdot 9{,}81 \cdot 0{,}12\,\mathrm{J} \approx 23{,}5\,\mathrm{J}$.
2. Izgube: prosti nihaj izgubi $20{,}0 \cdot 9{,}81 \cdot 0{,}01\,\mathrm{J} \approx 1{,}96\,\mathrm{J}$, ki jih epruveta ni porabila.
3. Popravljena vrednost: $\mathrm{KV} = 20{,}0 \cdot 9{,}81 \cdot (1{,}49 - 1{,}38)\,\mathrm{J} \approx 21{,}6\,\mathrm{J}$, kar je manj od $27\,\mathrm{J}$: jeklo A je pri tej temperaturi pod prehodno temperaturo in se lomi krhko.
4. Obratno: epruveta bi morala porabiti vsaj $27\,\mathrm{J}$, kar ustreza višini $\dfrac{27}{20{,}0 \cdot 9{,}81}\,\mathrm{m} \approx 0{,}138\,\mathrm{m}$, zato $h_{2,\max} = 1{,}49 - 0{,}1376 \approx 1{,}35\,\mathrm{m}$.
5. Jeklo B ima oznako J2, ki zagotavlja $27\,\mathrm{J}$ prav pri $-20\,^\circ\mathrm{C}$.
6. Razlika v ceni: $2400 \cdot (1{,}18 - 1{,}10) = 192$ €.
7. Odgovor: jeklo A ima pri $-20\,^\circ\mathrm{C}$ le okoli $21{,}6\,\mathrm{J}$ (nihalo bi se smelo dvigniti največ do $1{,}35\,\mathrm{m}$), zato izberemo ponudbo B; zanesljivost pozimi stane $192$ € več, kar je malo v primerjavi s posledicami krhkega loma.

### Primer 4: zdaj ti – duktilnost iz nateznega preizkusa

Epruveta iz jekla ima $d_0 = 8{,}0\,\mathrm{mm}$ in $L_0 = 80{,}0\,\mathrm{mm}$. Po pretrgu sestavimo dela: $L_u = 92{,}0\,\mathrm{mm}$, premer v vratu $d_u = 6{,}4\,\mathrm{mm}$. Izračunaj raztezek po pretrgu $A$ in kontrakcijo $Z$.

**Podatki:** $d_0 = 8{,}0\,\mathrm{mm}$, $L_0 = 80{,}0\,\mathrm{mm}$, $L_u = 92{,}0\,\mathrm{mm}$, $d_u = 6{,}4\,\mathrm{mm}$
**Iščemo:** $A$ in $Z$ v odstotkih

:::formula
$A = \dfrac{L_u - L_0}{L_0} \cdot 100\,\%$, $Z = \left(1 - \dfrac{d_u^2}{d_0^2}\right) \cdot 100\,\%$
:::

**Rešitev:**

1. Podaljšek: $L_u - L_0 = 92{,}0 - 80{,}0 = 12{,}0\,\mathrm{mm}$.
2. Razmerje premerov: $\dfrac{d_u}{d_0} = \dfrac{6{,}4}{8{,}0} = 0{,}80$; pri kontrakciji ga kvadriramo, ker je presek sorazmeren s kvadratom premera.
3. Dokončaj sam, nato preveri:

:::premisli
Koliko sta $A$ in $Z$?
---
$A = \dfrac{12{,}0}{80{,}0} \cdot 100\,\% = 15{,}0\,\%$ in $Z = (1 - 0{,}64) \cdot 100\,\% = 36\,\%$.
:::

## Pogoste napake

- **Napetost s presekom v vratu.** Kdor $R_m$ računa s končnim presekom $S_u$, dobi več kot dvakrat večjo vrednost. Inženirske napetosti vedno delimo s prvotnim $S_0$.
- **Premer namesto polmera.** $S = \pi d^2$ da štirikrat prevelik presek in štirikrat premajhno napetost. Pravilno je $S = \pi d^2/4$.
- **»Trdnejše jeklo je tudi bolj togo.«** Toplotna obdelava in legiranje spremenijo $R_e$ in $R_m$, modul $E$ pa ostane okoli $210\,\mathrm{GPa}$. Togost povečaš z večjim presekom, ne z boljšim jeklom.
- **»Trdo pomeni žilavo.«** Kaljen martenzit je zelo trd, a krhek. Trdota in žilavost se pogosto izključujeta; kompromis dosežemo s popuščanjem.
- **Žilavost brez temperature.** $\mathrm{KV} = 100\,\mathrm{J}$ pri sobni temperaturi ne pove nič o zimi. Feritna jekla imajo prehodno temperaturo, zato je na atestu podatek vedno vezan na temperaturo.

## Povzetek

- Natezni preizkus: $\sigma = F/S_0$, $\varepsilon = \Delta L/L_0$; prožno območje $\sigma = E\,\varepsilon$, za jekla $E \approx 210\,\mathrm{GPa}$.
- Meja tečenja $R_e$ (ali $R_{p0,2}$) je začetek trajne deformacije, natezna trdnost $R_m = F_{\max}/S_0$; dimenzioniramo po $R_e$.
- Duktilnost: raztezek po pretrgu $A$ in kontrakcija $Z$.
- Trdota (Vickers, Brinell, Rockwell) je odpornost proti vtiskovanju; za jekla $R_m \approx 3{,}3 \cdot \mathrm{HV}$.
- Udarna žilavost (Charpy) $\mathrm{KV} = m g (h_1 - h_2)$; feritna jekla imajo prehodno temperaturo žilavo–krhko, avstenitna in druge kovine s ploskovno centrirano mrežo je nimajo.
- Kaljenje poveča trdoto in zmanjša žilavost, popuščanje del žilavosti vrne.

## Za izpit

Znati moraš povedati:

- Definicije inženirske napetosti, raztezka, $R_e$, $R_{p0,2}$, $R_m$, $A$ in $Z$ ter kako jih odčitamo s krivulje $\sigma$–$\varepsilon$.
- Hookov zakon s pogoji (enoosno, pod mejo sorazmernosti), izpeljavo $\Delta L = \dfrac{F L_0}{E S_0}$ in prožne energije $\dfrac{R_e^2}{2E}$; zakaj toplotna obdelava $E$ skoraj ne spremeni.
- Dokaz $\sigma_\mathrm{p} = \sigma(1 + \varepsilon)$ s pogoji in razlago padca inženirske krivulje po $R_m$.
- Principe meritev trdote (Vickers, Brinell, Rockwell) in izpeljavo $\mathrm{KV} = mg(h_1 - h_2)$ s popravkom za izgube.
- Prehodno temperaturo žilavo–krhko: pri katerih mrežah nastopi in zakaj.

### Naloga 1

Jekleno epruveto z $d_0 = 12{,}0\,\mathrm{mm}$ in $L_0 = 60{,}0\,\mathrm{mm}$ preizkusimo natezno. Pri sili $15{,}0\,\mathrm{kN}$ (prožno območje) je podaljšek $0{,}0379\,\mathrm{mm}$, dogovorni meji tečenja ustreza sila $39{,}6\,\mathrm{kN}$, največja sila je $56{,}5\,\mathrm{kN}$. Po pretrgu je $L_u = 73{,}2\,\mathrm{mm}$, premer v vratu $7{,}8\,\mathrm{mm}$. (a) Določi $E$, $R_{p0,2}$, $R_m$, $A$ in $Z$. (b) Kolikšna je prava napetost pri največji sili, če je tedaj inženirski raztezek $0{,}15$? (c) Iz tega jekla naredimo okroglo natezno palico dolžine $2{,}0\,\mathrm{m}$, ki nosi $80\,\mathrm{kN}$, z varnostnim faktorjem $1{,}5$ glede na $R_{p0,2}$. Izberi najmanjši celi premer v milimetrih in izračunaj podaljšek palice.

**Rešitev:**

1. $S_0 = \dfrac{\pi \cdot 12{,}0^2}{4} \approx 113{,}1\,\mathrm{mm^2}$.
2. $\sigma = \dfrac{15\,000}{113{,}1}\,\mathrm{MPa} \approx 132{,}6\,\mathrm{MPa}$, $\varepsilon = \dfrac{0{,}0379}{60{,}0} \approx 6{,}317 \cdot 10^{-4}$, $E = \dfrac{132{,}6}{6{,}317 \cdot 10^{-4}}\,\mathrm{MPa} \approx 2{,}10 \cdot 10^5\,\mathrm{MPa} = 210\,\mathrm{GPa}$.
3. $R_{p0,2} = \dfrac{39\,600}{113{,}1}\,\mathrm{MPa} \approx 350\,\mathrm{MPa}$, $R_m = \dfrac{56\,500}{113{,}1}\,\mathrm{MPa} \approx 500\,\mathrm{MPa}$ (oboje s prvotnim presekom).
4. $A = \dfrac{73{,}2 - 60{,}0}{60{,}0} \cdot 100\,\% = 22{,}0\,\%$, $Z = \left(1 - \dfrac{7{,}8^2}{12{,}0^2}\right) \cdot 100\,\% = (1 - 0{,}4225) \cdot 100\,\% \approx 57{,}8\,\%$.
5. Do $R_m$ je deformacija enakomerna, zato velja $\sigma_\mathrm{p} = R_m(1 + \varepsilon) = 499{,}6 \cdot 1{,}15\,\mathrm{MPa} \approx 575\,\mathrm{MPa}$.
6. Dopustna napetost: $\sigma_\mathrm{dop} = \dfrac{350{,}1}{1{,}5}\,\mathrm{MPa} \approx 233{,}4\,\mathrm{MPa}$.
7. Potrebni presek $S = \dfrac{80\,000}{233{,}4}\,\mathrm{mm^2} \approx 342{,}7\,\mathrm{mm^2}$, premer $d = \sqrt{\dfrac{4S}{\pi}} \approx 20{,}9\,\mathrm{mm}$, zato izberemo $21\,\mathrm{mm}$.
8. S $d = 21\,\mathrm{mm}$: $S = \dfrac{\pi \cdot 21^2}{4} \approx 346{,}4\,\mathrm{mm^2}$, napetost $\dfrac{80\,000}{346{,}4}\,\mathrm{MPa} \approx 231\,\mathrm{MPa}$ je pod mejo tečenja, zato velja Hookov zakon.
9. $\Delta L = \dfrac{F L_0}{E S} = \dfrac{80\,000 \cdot 2000}{210\,000 \cdot 346{,}4}\,\mathrm{mm} \approx 2{,}20\,\mathrm{mm}$.
10. Odgovor: $E \approx 210\,\mathrm{GPa}$, $R_{p0,2} \approx 350\,\mathrm{MPa}$, $R_m \approx 500\,\mathrm{MPa}$, $A = 22\,\%$, $Z \approx 58\,\%$; prava napetost pri največji sili je okoli $575\,\mathrm{MPa}$; palica mora imeti premer $21\,\mathrm{mm}$ in se podaljša za okoli $2{,}2\,\mathrm{mm}$.

### Naloga 2

Natančno definiraj inženirsko in pravo napetost. Dokaži, da pri enakomerni deformaciji s stalno prostornino velja $\sigma_\mathrm{p} = \sigma(1 + \varepsilon)$, in utemelji, zakaj inženirska krivulja po $R_m$ pade, čeprav se material še utrjuje. Izpelji, koliko prožne energije na enoto prostornine sprejme material do meje tečenja, in jo izračunaj za jeklo z $R_e = 355\,\mathrm{MPa}$ in $E = 210\,\mathrm{GPa}$.

**Rešitev:**

1. Inženirska napetost je $\sigma = F/S_0$ (prvotni presek), prava $\sigma_\mathrm{p} = F/S$ (trenutni presek).
2. Stalna prostornina: $S L = S_0 L_0$; z $L = L_0(1 + \varepsilon)$ dobimo $S = \dfrac{S_0}{1 + \varepsilon}$.
3. $\sigma_\mathrm{p} = \dfrac{F}{S} = \dfrac{F(1 + \varepsilon)}{S_0} = \sigma(1 + \varepsilon)$; pogoj je enakomerna deformacija, torej velja le do nastanka vratu.
4. Po $R_m$ se deformacija zbere v vratu, presek tam hitro pada. Utrjevanje ne nadomesti več zmanjšanja preseka, zato sila $F$ pada; inženirska napetost deli padajočo silo s stalnim $S_0$ in pade, prava pa deli s še hitreje padajočim $S$ in raste.
5. Do meje tečenja je $\sigma = E\varepsilon$, delo na enoto prostornine je ploščina pod premico: $U_\mathrm{p} = \int_0^{\varepsilon_e} E\varepsilon\,\mathrm{d}\varepsilon = \tfrac12 E\varepsilon_e^2 = \dfrac{R_e^2}{2E}$.
6. $U_\mathrm{p} = \dfrac{355^2}{2 \cdot 210\,000}\,\mathrm{MPa} \approx 0{,}300\,\mathrm{MJ/m^3}$.
7. Odgovor: $\sigma_\mathrm{p} = \sigma(1 + \varepsilon)$ do nastanka vratu; inženirska krivulja pade, ker pada sila; jeklo do meje tečenja shrani okoli $0{,}30\,\mathrm{MJ/m^3}$ prožne energije.

## Drugače: Z analogijo

Predstavljaj si tri stvari iz trgovine: gumico, žvečilni gumi in prepečenec.

- **Gumica** se raztegne in vrne v prvotno obliko. To je prožno območje; kako močno jo moraš vleči za določen raztezek, pove $E$.
- **Žvečilni gumi** se vleče in ostane raztegnjen. To je plastična deformacija po meji tečenja; dolga nitka pred pretrgom pomeni velik $A$.
- **Prepečenec** se zlomi brez opozorila. To je krhek material.

Žilavost je kot cona gnetenja v avtomobilu: dobra ni tista, ki se ne deformira, ampak tista, ki pri trku porabi čim več energije. Mrzlo feritno jeklo se obnaša kot prepečenec, toplo pa bolj kot žvečilni gumi. Analogija ima mejo: gumica ni kovina, njena prožnost izvira iz polimernih verig, ne iz vezi med atomi v mreži.

## Drugače: Bolj natančno

**Prava deformacija.** Tako kot napetost lahko tudi raztezek računamo glede na trenutno dolžino: $\mathrm{d}\varepsilon_\mathrm{p} = \mathrm{d}L/L$, z integracijo $\varepsilon_\mathrm{p} = \ln(L/L_0) = \ln(1 + \varepsilon)$. Pri majhnih raztezkih sta obe meri skoraj enaki, pri velikih (preoblikovanje, valjanje) pa računamo s pravimi vrednostmi, ker se seštevajo.

**Energija.** Ploščina pod krivuljo $\sigma$–$\varepsilon$ je delo na enoto prostornine, ki ga material sprejme do loma, v $\mathrm{J/m^3}$. Material z veliko $R_m$ in veliko $A$ ima veliko ploščino in je žilav. Charpyjev $\mathrm{KV}$ to meri pri udarcu in z zarezo, kar je strožje.

**Formula za Vickers.** Piramida ima kot med ploskvama $136^\circ$. Trdota je sila na ploščino vtiska: $\mathrm{HV} = \dfrac{2F\sin 68^\circ}{d^2}$ v $\mathrm{kgf/mm^2}$. Ko silo vstavimo v newtonih, pomnožimo z $1/9{,}807 \approx 0{,}102$, zato je konstanta $2 \cdot \sin 68^\circ \cdot 0{,}102 \approx 0{,}1891$.

**Prehodna temperatura.** V prostorsko centrirani kubični mreži je gibanje vijačnih dislokacij močno odvisno od temperature. Pri nizki temperaturi meja tečenja naraste nad napetost, ki je potrebna za cepilni lom po kristalnih ravninah, in material poči brez plastične deformacije. V ploskovno centrirani kubični mreži je dovolj lahko drsnih sistemov pri vseh temperaturah, zato krhkega prehoda ni. Prehodno temperaturo znižamo z drobnozrnatim jeklom in manj ogljika.

## Preveri se

? Katera metoda ne spada med ostale?
- Brinell
~ Brinellova metoda meri trdoto z vtiskom kroglice, tako kot ostali dve vtiskovalni metodi.
- Vickers
~ Vickersova metoda meri trdoto z vtiskom diamantne piramide.
- Rockwell
~ Rockwellova metoda meri trdoto iz globine vtiska.
+ Charpy
> Charpyjev preizkus meri udarno žilavost (energijo loma), ostale tri merijo trdoto.

? Palico s premerom $12{,}0\,\mathrm{mm}$ obremenimo z natezno silo $20{,}0\,\mathrm{kN}$. Kolikšna je napetost?
- $44{,}2\,\mathrm{MPa}$
~ Presek si izračunal kot $\pi d^2$ namesto $\pi d^2/4$, zato je štirikrat prevelik.
- $139\,\mathrm{MPa}$
~ Delil si z $d^2$ in pozabil faktor $\pi/4$.
+ $177\,\mathrm{MPa}$
> $S = \pi \cdot 12{,}0^2/4 \approx 113{,}1\,\mathrm{mm^2}$, $\sigma = 20\,000\,\mathrm{N}/113{,}1\,\mathrm{mm^2} \approx 177\,\mathrm{MPa}$.

? Jeklo kalimo, da nastane martenzit. Kaj je posledica?
- Trdota in žilavost obe narasteta.
~ Trdota in žilavost se pri martenzitu ne gibljeta skupaj: trdota naraste, žilavost pade.
+ Trdota naraste, žilavost pade, zato jeklo nato popuščamo.
- Modul elastičnosti se podvoji.
~ $E$ je odvisen od vezi med atomi in se s toplotno obdelavo skoraj ne spremeni.
> Martenzit je prenasičen z ogljikom in napet, zato je trd in krhek; popuščanje zmanjša napetosti in vrne del žilavosti.

? Študent računa $R_m$ za epruveto z $d_0 = 10{,}0\,\mathrm{mm}$, $F_{\max} = 41{,}6\,\mathrm{kN}$ in premerom v vratu $6{,}0\,\mathrm{mm}$. (1) $S_0 = 78{,}5\,\mathrm{mm^2}$. (2) $S_u = 28{,}3\,\mathrm{mm^2}$. (3) $R_m = 41\,600/28{,}3 \approx 1470\,\mathrm{MPa}$. Kateri korak je napačen?
- Korak 1
~ $\pi \cdot 10{,}0^2/4 \approx 78{,}5\,\mathrm{mm^2}$ je pravilno.
- Korak 2
~ $\pi \cdot 6{,}0^2/4 \approx 28{,}3\,\mathrm{mm^2}$ je pravilen presek v vratu, potreben za kontrakcijo.
+ Korak 3
> Natezno trdnost računamo s prvotnim presekom: $R_m = 41\,600/78{,}5 \approx 530\,\mathrm{MPa}$.

? Za zunanje stopnišče v gorah, kjer pozimi pade do $-20\,^\circ\mathrm{C}$, izbiraš med S235JR (žilavost zagotovljena pri $+20\,^\circ\mathrm{C}$) in nekoliko dražjim S235J2 (pri $-20\,^\circ\mathrm{C}$). Kaj izbereš?
- S235JR, ker imata obe enako mejo tečenja.
~ Enaka $R_e$ ne pomeni enake žilavosti pri mrazu. Pod prehodno temperaturo se lahko jeklo JR lomi krhko.
+ S235J2, ker je žilavost zagotovljena pri najnižji temperaturi uporabe.
- Vseeno je, ker stopnišče ni obremenjeno z udarci.
~ Krhek lom sproži že razpoka ali zareza ob zvaru, ne le udarec; tako so pokale tudi ladje Liberty.
> Žilavost mora biti zagotovljena pri najnižji temperaturi, pri kateri del dela; oznaka J2 to zagotavlja pri $-20\,^\circ\mathrm{C}$.

:::simboli
\mathrm{HV} | trdota po Vickersu | \mathrm{HV} = 0{,}1891\,\dfrac{F}{d^2} | – | F v N, d v mm; za jekla natezna trdnost ≈ 3,3 · HV
F | sila | | N | pri meji tečenja F = Rₑ · S
d | povprečna diagonala vtiska | d = \dfrac{d_1 + d_2}{2} | mm | v S = πd²/4 premer palice
d_1, d_2 | izmerjeni diagonali vtiska | | mm
R_e | meja tečenja | | MPa |
R_{p0,2} | dogovorna meja tečenja | | MPa | 0,2 % trajnega raztezka
R_m | natezna trdnost | R_m = \dfrac{F_{\max}}{S_0} | MPa |
\sigma | inženirska napetost | \sigma = \dfrac{F}{S_0} | MPa |
\sigma_\mathrm{p} | prava napetost | \sigma_\mathrm{p} = \dfrac{F}{S} | MPa | enakomerna deformacija: σ(1 + ε)
\varepsilon | raztezek (relativni podaljšek) | \varepsilon = \dfrac{\Delta L}{L_0} | – |
E | modul elastičnosti | \sigma = E\,\varepsilon | MPa | jekla ≈ 210 GPa
\nu | Poissonovo število | \varepsilon_\mathrm{q} = -\nu\,\varepsilon | – | jekla ≈ 0,3
U_\mathrm{p} | prožna energija na enoto prostornine | U_\mathrm{p} = \dfrac{R_e^2}{2E} | MJ/m^3 | 1 MPa = 1 MJ/m³
S | ploščina prečnega prereza | S = \dfrac{\pi d^2}{4} | mm^2 |
\mathrm{KV} | udarna žilavost (porabljena energija po Charpyju) | \mathrm{KV} = m g (h_1 - h_2) | J |
m | masa nihala | | kg |
g | težni pospešek | | m/s^2 | 9,81 m/s²
h_1 | začetna višina nihala | | m |
h_2 | višina, do katere se nihalo dvigne po lomu | | m |
h_0 | višina, do katere se nihalo dvigne brez epruvete (prosti nihaj) | | m | h₁ − h₀ so izgube trenja in upora zraka
h_{2,\max} | največja dopustna višina po lomu | h_{2,\max} = h_0 - \dfrac{\mathrm{KV}_{\min}}{m g} | m |
m_{\text{pl}} | masa pločevine | | kg |
A | raztezek po pretrgu | A = \dfrac{L_u - L_0}{L_0} \cdot 100\,\% | \% |
L_u | merilna dolžina po pretrgu | | mm |
L_0 | začetna merilna dolžina | | mm |
Z | kontrakcija (zoženje preseka) | Z = \left(1 - \dfrac{d_u^2}{d_0^2}\right) \cdot 100\,\% | \% |
d_u | premer v vratu po pretrgu | | mm |
d_0 | začetni premer epruvete | | mm |
:::
