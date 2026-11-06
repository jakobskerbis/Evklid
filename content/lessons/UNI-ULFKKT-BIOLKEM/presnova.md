---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na urgenco pripeljejo delavca iz galvanizacije, ki je vdihnil cianovodik. Kri je dobro nasičena s kisikom, venska kri je skoraj tako rdeča kot arterijska, a bolnik se duši, laktat v krvi pa hitro narašča. Kisika je dovolj, celice ga ne morejo porabiti. Zakaj ravno laktat in zakaj je stanje tako hitro smrtno?

Odgovor je v treh zaporednih stopnjah presnove glukoze: **glikolizi**, **citratnem ciklu** in **oksidativni fosforilaciji**. Iz bioenergetike poznaš $\Delta G^{\circ\prime}$, sklopljene reakcije in vlogo ATP, iz encimske kinetike pa, kako encime zaviramo. Tu bomo eno molekulo glukoze pospremili skozi celico, prešteli vsak ATP in nato posplošili, kje in kako se proces uravnava.

## Razlaga

**1. Pot ene molekule glukoze.** Glukoza vstopi v citosol in se v glikolizi razcepi v dva piruvata. Piruvat vstopi v mitohondrijski matriks, kjer ga piruvat-dehidrogenaza pretvori v acetil-CoA. Acetilna skupina zgori v citratnem ciklu do $\mathrm{CO_2}$. Elektroni, ki se pri tem naberejo na $\mathrm{NADH}$ in $\mathrm{FADH_2}$, potujejo po dihalni verigi v notranji membrani do kisika, energija pa se shrani kot protonski gradient, ki poganja ATP-sintazo. Skupaj:
$$\mathrm{C_6H_{12}O_6 + 6\,O_2 \to 6\,CO_2 + 6\,H_2O}$$
z $\Delta G^{\circ\prime} \approx -2840\,\mathrm{kJ/mol}$.

**2. Glikoliza.** Deset korakov v citosolu, v dveh fazah.

*Pripravljalna faza* (porabi $2$ ATP):

1. heksokinaza: glukoza + ATP → glukoza-6-fosfat (nepovratno; fosfat glukozo ujame v celici);
2. fosfoglukoza-izomeraza: → fruktoza-6-fosfat;
3. **fosfofruktokinaza-1** (PFK-1): + ATP → fruktoza-1,6-bisfosfat (nepovratno, glavna kontrolna točka);
4. aldolaza: razcep v dihidroksiaceton-fosfat in gliceraldehid-3-fosfat (GAP);
5. triozafosfat-izomeraza: DHAP → GAP; odslej vse dvakrat.

*Izplačilna faza* (na vsak GAP):

6. GAP-dehidrogenaza: GAP + $\mathrm{NAD^+}$ + $\mathrm{P_i}$ → 1,3-bisfosfoglicerat + NADH;
7. fosfoglicerat-kinaza: → 3-fosfoglicerat + **ATP**;
8. fosfoglicerat-mutaza: → 2-fosfoglicerat;
9. enolaza: → fosfoenolpiruvat (PEP) + $\mathrm{H_2O}$;
10. piruvat-kinaza: → piruvat + **ATP** (nepovratno).

Neto:
$$\mathrm{glukoza + 2\,NAD^+ + 2\,ADP + 2\,P_i \to 2\,piruvat + 2\,NADH + 2\,ATP}$$
(plus $2\,\mathrm{H^+}$ in $2\,\mathrm{H_2O}$).

**Definicija.** **Fosforilacija na ravni substrata** je sinteza ATP, pri kateri fosfatno skupino na ADP prenese spojina z višjim fosfatnim potencialom. Korak 7 in korak 10 sta taka: hidroliza 1,3-bisfosfoglicerata ima $\Delta G^{\circ\prime} \approx -49\,\mathrm{kJ/mol}$, PEP pa $-62\,\mathrm{kJ/mol}$, ATP le $-30{,}5\,\mathrm{kJ/mol}$.

*Preizkus:* koliko ATP nastane v izplačilni fazi na eno glukozo? (Štirje, neto dva.)

**Obnova $\mathrm{NAD^+}$.** Celica ima malo $\mathrm{NAD^+}$; brez obnove se glikoliza ustavi pri koraku 6. Ob kisiku ga obnovi dihalna veriga. Brez njega mišica in eritrocit piruvat reducirata v **laktat** (laktat-dehidrogenaza), kvasovke pa v etanol in $\mathrm{CO_2}$.

**Uravnavanje.** Uravnavani so nepovratni koraki z velikim negativnim $\Delta G$ v celici. PFK-1 zavirata visok ATP in citrat (energije je dovolj), aktivirata AMP in fruktoza-2,6-bisfosfat.

**3. Piruvat-dehidrogenaza.** Kompleks treh encimov v matriksu:
$$\mathrm{piruvat + CoA + NAD^+ \to acetil\text{-}CoA + CO_2 + NADH}$$
Potrebuje pet koencimov: tiamin-pirofosfat, lipoat, CoA, FAD in $\mathrm{NAD^+}$. Korak je nepovraten: iz acetil-CoA živali ne morejo narediti glukoze.

**4. Citratni cikel.** Acetil-CoA ($2$ C) se z oksaloacetatom ($4$ C) združi v citrat ($6$ C); v osmih korakih se sprostita dva $\mathrm{CO_2}$ in oksaloacetat se obnovi:

1. citrat-sintaza: acetil-CoA + oksaloacetat → citrat;
2. akonitaza: → izocitrat;
3. izocitrat-dehidrogenaza: → α-ketoglutarat + $\mathrm{CO_2}$ + NADH;
4. α-ketoglutarat-dehidrogenaza: → sukcinil-CoA + $\mathrm{CO_2}$ + NADH;
5. sukcinil-CoA-sintetaza: → sukcinat + **GTP** (ali ATP);
6. sukcinat-dehidrogenaza: → fumarat + $\mathrm{FADH_2}$ (encim je hkrati kompleks II dihalne verige);
7. fumaraza: → malat;
8. malat-dehidrogenaza: → oksaloacetat + NADH.

Na en acetil-CoA: $3$ NADH, $1$ $\mathrm{FADH_2}$, $1$ GTP, $2$ $\mathrm{CO_2}$. Cikel sam ne porabi kisika, a brez njega se ustavi, ker zmanjka $\mathrm{NAD^+}$ in FAD.

:::premisli
Atoma ogljika, ki se sprostita kot $\mathrm{CO_2}$ v prvem obratu, nista iz acetilne skupine, ki je ravnokar vstopila. Zakaj potem vseeno pravimo, da cikel »zažge« acetilno skupino?
---
Oksaloacetat se obnovi, a ne z istimi atomi: ogljika iz acetila ostaneta v štiriogljični molekuli in se sprostita v naslednjih obratih. Bilanca na obrat je vedno $2$ C noter, $2$ $\mathrm{CO_2}$ ven, zato je neto učinek popolna oksidacija acetila, čeprav posamezni atomi zaostajajo.
:::

**5. Dihalna veriga.** V notranji mitohondrijski membrani so štirje kompleksi in dva gibljiva prenašalca:

- kompleks I (NADH-dehidrogenaza): NADH → ubikinon (Q), črpa $4\,\mathrm{H^+}$;
- kompleks II (sukcinat-dehidrogenaza): $\mathrm{FADH_2}$ → Q, ne črpa;
- kompleks III (citokrom $bc_1$): $\mathrm{QH_2}$ → citokrom $c$, črpa $4\,\mathrm{H^+}$;
- kompleks IV (citokrom-oksidaza): citokrom $c$ → $\mathrm{O_2}$, nastane voda, črpa $2\,\mathrm{H^+}$.

Par elektronov iz NADH torej prečrpa $10\,\mathrm{H^+}$, iz $\mathrm{FADH_2}$ le $6$. Elektroni tečejo k vedno pozitivnejšemu redukcijskemu potencialu, od $\mathrm{NAD^+/NADH}$ ($E^{\circ\prime} = -0{,}320\,\mathrm{V}$) do $\mathrm{O_2/H_2O}$ ($+0{,}815\,\mathrm{V}$).

```
 medmembranski prostor (H+ visok)
  H+    H+    H+         H+
  ^     ^     ^          |
==I=====III===IV========ATP==
  |     Q  c  |        sintaza
 NADH        O2->H2O     v
 matriks (H+ nizek)   ADP->ATP
```

**6. Kemiozmoza in ATP-sintaza.**

**Izrek (kemiozmotska teorija, Mitchell).** Prenos elektronov in sinteza ATP sta sklopljena prek elektrokemijskega gradienta protonov čez notranjo membrano, ne prek skupnega visokoenergijskega intermediata. Gonilna sila je **protonska gonilna sila**
$$\Delta p = \Delta\psi - \frac{2{,}303\,RT}{F}\,\Delta\mathrm{pH},$$
kjer je $\Delta\psi$ membranski potencial in $\Delta\mathrm{pH} = \mathrm{pH_{zunaj}} - \mathrm{pH_{matriks}}$; v mitohondriju je $\Delta p$ okoli $0{,}15$ do $0{,}20\,\mathrm{V}$.

Dokazi: zaprt mešiček z umetno vsiljenim gradientom pH sintetizira ATP tudi brez dihalne verige; razklopljevalci, ki prepuščajo protone, ustavijo sintezo ATP, dihanje pa pospešijo; membrana mora biti neprepustna in cela.

ATP-sintaza je rotacijski motor. Protoni tečejo skozi obroč podenot $c$ v delu $\mathrm{F_o}$ in ga vrtijo; os vrti glavo $\mathrm{F_1}$, ki pri vsakem obratu naredi $3$ ATP. Pri sesalcih ima obroč $8$ podenot $c$, zato potrebuje $8/3 \approx 2{,}7\,\mathrm{H^+}$ na ATP, plus okoli $1\,\mathrm{H^+}$ za uvoz fosfata in izmenjavo ADP/ATP. Dogovorjena vrednost je $4\,\mathrm{H^+}$ na ATP, od tod **razmerji P/O**: $10/4 = 2{,}5$ za NADH in $6/4 = 1{,}5$ za $\mathrm{FADH_2}$.

:::premisli
Razklopljevalec 2,4-dinitrofenol prenaša protone čez membrano. Napovej, kaj se zgodi s porabo kisika, sintezo ATP in telesno temperaturo.
---
Poraba kisika naraste, ker gradient, ki dihanje zavira, izgine in veriga teče s polno hitrostjo. Sinteza ATP pade, ker protoni ne gredo več skozi sintazo. Energija gradienta se sprosti kot toplota, zato temperatura naraste, kar je lahko smrtno. Rjavo maščevje počne isto nadzorovano z beljakovino termogenin.
:::

**7. Zaviralci.** Rotenon zavira kompleks I, antimicin A kompleks III, cianid, ogljikov monoksid in azid kompleks IV, oligomicin pa ATP-sintazo. Ker je veriga zaporedna, zaviranje kateregakoli kompleksa ustavi pretok elektronov vse do kisika (razen obvoda prek kompleksa II pri zaviranju kompleksa I).

## Rešeni primeri

### Primer 1: energija oksidacije NADH

Izračunaj $\Delta G^{\circ\prime}$ za prenos para elektronov z NADH na kisik in oceni standardni izkoristek, če nastane $2{,}5$ ATP.

**Podatki:** $E^{\circ\prime}(\mathrm{NAD^+/NADH}) = -0{,}320\,\mathrm{V}$, $E^{\circ\prime}(\mathrm{O_2/H_2O}) = +0{,}815\,\mathrm{V}$, $z = 2$, $F = 96\,485\,\mathrm{C/mol}$, $\Delta G^{\circ\prime}(\mathrm{ATP}) = 30{,}5\,\mathrm{kJ/mol}$ (sinteza), $2{,}5$ ATP na NADH
**Iščemo:** $\Delta G^{\circ\prime}$ in izkoristek $\eta$

:::formula
$\Delta G^{\circ\prime} = -zF\,\Delta E^{\circ\prime}$, $\quad \Delta E^{\circ\prime} = E^{\circ\prime}_\text{akceptor} - E^{\circ\prime}_\text{donor}$
:::

**Rešitev:**

1. $\Delta E^{\circ\prime} = 0{,}815\,\mathrm{V} - (-0{,}320\,\mathrm{V}) = 1{,}135\,\mathrm{V}$.
2. $\Delta G^{\circ\prime} = -2 \cdot 96\,485 \cdot 1{,}135\,\mathrm{J/mol} \approx -219\,\mathrm{kJ/mol}$.
3. Shranjeno v ATP: $2{,}5 \cdot 30{,}5\,\mathrm{kJ/mol} \approx 76\,\mathrm{kJ/mol}$.
4. $\eta = 76{,}25/219{,}0 \approx 0{,}35$.
5. Odgovor: $\Delta G^{\circ\prime} \approx -219\,\mathrm{kJ/mol}$, standardni izkoristek okoli $35\,\%$. V celici, kjer je za sintezo ATP potrebno okoli $50\,\mathrm{kJ/mol}$, je izkoristek bližje $57\,\%$.

### Primer 2: bilanca ATP za glukozo

Preštej ATP, ki nastanejo pri popolni oksidaciji ene glukoze v jetrni celici (citosolni NADH vstopi prek malat-aspartatnega čolnička, $2{,}5$ ATP) in v mišici, ki uporablja glicerol-fosfatni čolniček (citosolni NADH da le $1{,}5$ ATP). Kolikokrat več glukoze bi celica porabila brez kisika?

**Podatki:** P/O $= 2{,}5$ (NADH v matriksu), $1{,}5$ ($\mathrm{FADH_2}$); glikoliza: $2$ ATP, $2$ NADH (citosol); PDH: $2$ NADH; cikel ($2$ obrata): $6$ NADH, $2$ $\mathrm{FADH_2}$, $2$ GTP; anaerobno $2$ ATP
**Iščemo:** ATP na glukozo z obema čolničkoma; razmerje porabe glukoze

:::formula
$\text{ATP} = \text{ATP} + \text{GTP} + 2{,}5 \cdot n(\text{NADH}) + 1{,}5 \cdot n(\mathrm{FADH_2})$
:::

**Rešitev:**

1. Glikoliza: $2$ ATP; $2$ citosolna NADH dasta $2 \cdot 2{,}5 = 5$ ATP (malat-aspartat).
2. PDH: $2$ NADH, $5$ ATP.
3. Cikel: $6 \cdot 2{,}5 = 15$ ATP iz NADH, $2 \cdot 1{,}5 = 3$ iz $\mathrm{FADH_2}$, $2$ GTP.
4. Skupaj: $2 + 5 + 5 + 15 + 3 + 2 = 32$ ATP.
5. Glicerol-fosfatni čolniček preda elektrone citosolnega NADH na FAD (raven Q), zato $2 \cdot 1{,}5 = 3$ namesto $5$: skupaj $30$ ATP.
6. Brez kisika: $2$ ATP na glukozo, torej $32 : 2 = 16$-krat več glukoze za isto količino ATP.
7. Odgovor: $32$ ATP v jetrih, $30$ v mišici; anaerobno celica porabi okoli $15$- do $16$-krat več glukoze (Pasteurjev učinek). Večina ATP ($28$ od $32$) nastane pri oksidativni fosforilaciji.

### Primer 3: zgradba motorja določa izkoristek

Obroč $c$ ATP-sintaze ima pri sesalcih $8$ podenot, pri kvasovki $10$; glava $\mathrm{F_1}$ naredi $3$ ATP na obrat. Za transport fosfata in ADP/ATP je potreben še $1\,\mathrm{H^+}$ na ATP. (a) Izračunaj $\mathrm{H^+}$/ATP in razmerji P/O za NADH in $\mathrm{FADH_2}$ pri obeh vrstah. (b) Koliko ATP nastane iz glukoze pri kvasovki (vzemi malat-aspartatni čolniček)? (c) Pri $\Delta p = 0{,}18\,\mathrm{V}$ preveri, ali je energija prečrpanih protonov na ATP pri sesalcu dovolj za sintezo ATP v celici, ki zahteva okoli $50\,\mathrm{kJ/mol}$.

**Podatki:** $c_8$ (sesalci), $c_{10}$ (kvasovka), $3$ ATP/obrat, $+1\,\mathrm{H^+}$/ATP za transport; NADH $10\,\mathrm{H^+}$, $\mathrm{FADH_2}$ $6\,\mathrm{H^+}$; $\Delta p = 0{,}18\,\mathrm{V}$; $\Delta G_\text{ATP, celica} \approx 50\,\mathrm{kJ/mol}$; $F = 96\,485\,\mathrm{C/mol}$
**Iščemo:** $\mathrm{H^+}$/ATP, P/O, ATP na glukozo, energijska bilanca

:::formula
$\mathrm{H^+/ATP} = \frac{n_c}{3} + 1$, $\quad \mathrm{P/O} = \frac{n(\mathrm{H^+})}{\mathrm{H^+/ATP}}$, $\quad \Delta G_{\mathrm{H^+}} = F\,\Delta p$
:::

**Rešitev:**

1. Sesalci: $8/3 + 1 \approx 3{,}67\,\mathrm{H^+}$/ATP. P/O(NADH) $= 10/3{,}667 \approx 2{,}7$, P/O($\mathrm{FADH_2}$) $= 6/3{,}667 \approx 1{,}6$.
2. Kvasovka: $10/3 + 1 \approx 4{,}33\,\mathrm{H^+}$/ATP. P/O(NADH) $= 10/4{,}333 \approx 2{,}3$, P/O($\mathrm{FADH_2}$) $= 6/4{,}333 \approx 1{,}4$.
3. Večji obroč potrebuje več protonov za en obrat, zato da manj ATP na par elektronov. Izmerjene vrednosti ($2{,}5$ in $1{,}5$ pri sesalcih) so nekoliko nižje od teoretičnih, ker del protonov uide skozi membrano.
4. (b) Kvasovka: NADH skupaj $2 + 2 + 6 = 10$, $\mathrm{FADH_2}$ $2$, ATP in GTP iz substrata $4$. ATP $\approx 4 + 10 \cdot 2{,}308 + 2 \cdot 1{,}385 \approx 29{,}8$, torej okoli $30$.
5. (c) Energija na mol protonov: $F\,\Delta p = 96\,485 \cdot 0{,}18\,\mathrm{J/mol} \approx 17{,}4\,\mathrm{kJ/mol}$.
6. Na ATP pri sesalcu: $3{,}667 \cdot 17{,}37\,\mathrm{kJ/mol} \approx 63{,}7\,\mathrm{kJ/mol}$, kar je več od potrebnih $50\,\mathrm{kJ/mol}$; razlika poganja sintezo naprej in se sprosti kot toplota.
7. Odgovor: sesalci $3{,}7\,\mathrm{H^+}$/ATP, P/O $2{,}7$ in $1{,}6$; kvasovka $4{,}3\,\mathrm{H^+}$/ATP, P/O $2{,}3$ in $1{,}4$ ter okoli $30$ ATP na glukozo; protoni dajo okoli $64\,\mathrm{kJ}$ na mol ATP, kar zadošča.

### Primer 4: zdaj ti

Vrnimo se k delavcu z zastrupitvijo s cianidom. Cianid se veže na železo v kompleksu IV. Kaj se zgodi z razmerjem $\mathrm{NADH/NAD^+}$ v mitohondriju in zakaj naraste laktat?

**Podatki:** zaviran kompleks IV; kisika je v krvi dovolj; aerobno $32$ ATP, anaerobno $2$ ATP na glukozo
**Iščemo:** razlago in koliko več glukoze bi celica potrebovala za isto količino ATP

:::formula
veriga je zaporedna: zaviran kompleks IV ustavi pretok elektronov od NADH naprej
:::

**Rešitev:**

1. Elektroni ne morejo na kisik, zato se citokrom $c$, $\mathrm{QH_2}$ in NADH ne oksidirajo več; razmerje $\mathrm{NADH/NAD^+}$ močno naraste.
2. Brez $\mathrm{NAD^+}$ se ustavita citratni cikel in PDH; oksidativna fosforilacija ne daje ATP.
3. Dokončaj sam: kako celica še dobi ATP in zakaj zato naraste laktat?

:::premisli
Kaj ostane celici in koliko glukoze potrebuje?
---
Ostane le glikoliza, ki da $2$ ATP, če laktat-dehidrogenaza piruvat reducira v laktat in tako obnovi citosolni $\mathrm{NAD^+}$. Laktat se kopiči v krvi (laktatna acidoza). Za isto količino ATP bi celica potrebovala $16$-krat več glukoze, česar srce in možgani ne zmorejo, zato je zastrupitev hitro smrtna. Venska kri je rdeča, ker tkiva kisika ne porabljajo.
:::

## Pogoste napake

- **»Citratni cikel porabi kisik.«** Noben korak cikla ne uporablja $\mathrm{O_2}$. Cikel se ustavi brez kisika posredno, ker zmanjka $\mathrm{NAD^+}$ in FAD, ki ju obnovi dihalna veriga.
- **Glikoliza da $4$ ATP.** Izplačilna faza res da $4$, a pripravljalna porabi $2$; neto sta $2$. Pri bilanci vedno odštej vložek.
- **Laktat zaradi »pomanjkanja kisika« vedno.** Laktat nastane, kadar mora celica obnoviti $\mathrm{NAD^+}$ brez dihalne verige: pri pomanjkanju kisika, pri zaviranju verige (cianid) ali v eritrocitu brez mitohondrijev.
- **Vsak NADH je enak.** Citosolni NADH ne more čez notranjo membrano; prek glicerol-fosfatnega čolnička da le $1{,}5$ ATP. Zato različni učbeniki navajajo $30$ ali $32$ ATP.
- **Razklopljevalec zavira dihanje.** Ravno obratno: dihanje pospeši, zavira le sintezo ATP. Zaviralci kompleksov (cianid) zavrejo oboje.

## Povzetek

- Glikoliza (citosol): glukoza → $2$ piruvat, neto $2$ ATP in $2$ NADH; nepovratni koraki heksokinaza, PFK-1 (glavna kontrola), piruvat-kinaza.
- Brez dihalne verige se $\mathrm{NAD^+}$ obnovi z redukcijo piruvata v laktat (ali etanol).
- PDH: piruvat → acetil-CoA + $\mathrm{CO_2}$ + NADH, nepovratno, pet koencimov.
- Citratni cikel na acetil: $3$ NADH, $1$ $\mathrm{FADH_2}$, $1$ GTP, $2$ $\mathrm{CO_2}$; brez kisika se ustavi posredno.
- Dihalna veriga: NADH črpa $10\,\mathrm{H^+}$, $\mathrm{FADH_2}$ $6$; $\Delta G^{\circ\prime}(\mathrm{NADH \to O_2}) \approx -219\,\mathrm{kJ/mol}$.
- Kemiozmoza: $\Delta p$ poganja rotacijsko ATP-sintazo; P/O $2{,}5$ in $1{,}5$; skupaj $30$ do $32$ ATP na glukozo.

## Za izpit

Znati moraš povedati:

- vse korake glikolize in citratnega cikla z encimi, mesta nastanka ATP, GTP, NADH in $\mathrm{FADH_2}$ ter nepovratne korake;
- definicijo fosforilacije na ravni substrata in zakaj sta 1,3-bisfosfoglicerat in PEP primerna darovalca;
- sestavo dihalne verige, število prečrpanih protonov in izračun $\Delta G^{\circ\prime}$ iz $\Delta E^{\circ\prime}$;
- kemiozmotsko teorijo z enačbo za $\Delta p$ in dokaze zanjo;
- izpeljavo razmerij P/O in bilance $30$ do $32$ ATP;
- delovanje zaviralcev in razklopljevalcev.

### Naloga 1

Srčna mišica kot gorivo porablja laktat iz krvi. (a) Koliko ATP nastane pri popolni oksidaciji enega laktata (laktat-dehidrogenaza v citosolu, malat-aspartatni čolniček)? (b) Koliko protonov se pri tem prečrpa? (c) Pri zdravilu, ki deluje kot šibek razklopljevalec, se $30\,\%$ prečrpanih protonov vrne mimo ATP-sintaze. Koliko ATP tedaj da en laktat in za koliko odstotkov mora srce povečati porabo laktata, da ohrani enako proizvodnjo ATP? Uporabi $4\,\mathrm{H^+}$/ATP, NADH $10\,\mathrm{H^+}$, $\mathrm{FADH_2}$ $6\,\mathrm{H^+}$.

**Rešitev:**

1. Laktat → piruvat: $1$ NADH v citosolu, prek čolnička enakovreden NADH v matriksu.
2. PDH: $1$ NADH. Cikel: $3$ NADH, $1$ $\mathrm{FADH_2}$, $1$ GTP.
3. (a) ATP: $5 \cdot 2{,}5 + 1 \cdot 1{,}5 + 1 = 15$.
4. (b) Protoni: $5 \cdot 10 + 1 \cdot 6 = 56\,\mathrm{H^+}$; preizkus $56 : 4 = 14$, plus GTP, spet $15$.
5. (c) Skozi sintazo gre $0{,}7 \cdot 56 = 39{,}2\,\mathrm{H^+}$, kar da $39{,}2 : 4 = 9{,}8$ ATP; skupaj z GTP $10{,}8$ ATP.
6. Za enako ATP mora srce porabiti $15 : 10{,}8 \approx 1{,}39$-krat več laktata.
7. Odgovor: laktat da $15$ ATP in prečrpa $56\,\mathrm{H^+}$; s $30\,\%$ uhajanjem le $10{,}8$ ATP, zato mora poraba laktata (in kisika) narasti za okoli $39\,\%$. Pri tem se srce bolj segreje, kar je razlog, da razklopljevalcev kot zdravil za hujšanje ne uporabljajo.

### Naloga 2

Natančno navedi kemiozmotsko teorijo in enačbo za protonsko gonilno silo. Navedi dva poskusa, ki jo podpirata. Utemelji, zakaj je PFK-1 in ne fosfoglukoza-izomeraza glavna kontrolna točka glikolize.

**Rešitev:**

1. Teorija: prenos elektronov po dihalni verigi črpa protone iz matriksa v medmembranski prostor; nastali elektrokemijski gradient je edina vez med dihanjem in sintezo ATP, ki poteče, ko protoni tečejo nazaj skozi ATP-sintazo.
2. $\Delta p = \Delta\psi - \frac{2{,}303\,RT}{F}\Delta\mathrm{pH}$; pri $37\,^\circ\mathrm{C}$ je faktor okoli $0{,}062\,\mathrm{V}$ na enoto pH, zatorej prispevata membranski potencial (okoli $0{,}14\,\mathrm{V}$) in razlika pH (okoli $0{,}75$ enote) skupaj okoli $0{,}19\,\mathrm{V}$.
3. Poskus 1: mešički membrane z ATP-sintazo, prestavljeni iz kisle v bazično raztopino, sintetizirajo ATP brez prenosa elektronov.
4. Poskus 2: razklopljevalci (protonofori) ustavijo sintezo ATP in pospešijo dihanje; to razloži le gradient, ne skupni kemijski intermediat. Tudi poškodovana membrana ustavi sintezo.
5. Kontrolna točka: v celici je fosfoglukoza-izomeraza blizu ravnotežja ($\Delta G \approx 0$), zato njen tok določajo koncentracije, ne encim; uravnavanje bi le spremenilo hitrost doseganja ravnotežja.
6. PFK-1 je daleč od ravnotežja ($\Delta G$ močno negativen) in je prvi korak, ki je *specifičen* za glikolizo (glukoza-6-fosfat gre lahko tudi v glikogen ali pentozafosfatno pot). Zato je smiselno uravnavati prav njo, z alosteričnimi efektorji ATP, AMP, citratom in fruktozo-2,6-bisfosfatom.

### Naloga 3

Arzenat ($\mathrm{AsO_4^{3-}}$) je podoben fosfatu. GAP-dehidrogenaza ga sprejme namesto $\mathrm{P_i}$ in nastane 1-arzeno-3-fosfoglicerat, ki v vodi takoj razpade v 3-fosfoglicerat. Koliko ATP da glikoliza na glukozo ob arzenatu? Ali se glikoliza ustavi?

**Rešitev:**

1. Pripravljalna faza še vedno porabi $2$ ATP.
2. Korak 7 (fosfoglicerat-kinaza) odpade, ker 3-fosfoglicerat nastane brez prenosa fosfata na ADP: izgubita se $2$ ATP na glukozo.
3. Korak 10 še da $2$ ATP.
4. Neto: $-2 + 0 + 2 = 0$ ATP.
5. Glikoliza se ne ustavi: NADH še nastaja, piruvat tudi, tok skozi pot lahko celo naraste. Arzenat je razklopljevalec glikolize, ne zaviralec.

## Drugače: Z analogijo

Mitohondrij je hidroelektrarna. Dihalna veriga so črpalke, ki vodo (protone) črpajo v višje ležeče akumulacijsko jezero (medmembranski prostor); energijo za črpanje dajejo elektroni, ki »padajo« od NADH proti kisiku. ATP-sintaza je turbina: voda teče nazaj skozi lopatice (obroč $c$) in vrti generator (glavo $\mathrm{F_1}$). Razklopljevalec je luknja v jezu: voda teče mimo turbine, črpalke delajo s polno močjo, elektrike ni, voda pa se segreje. Cianid je zaprt ventil na dovodu: črpalke stojijo in jezero se izprazni.

Glikoliza je pomožni dizelski agregat v isti stavbi: dela brez jezera, a porabi veliko več goriva za isto energijo in pri tem pušča »izpuh« (laktat).

## Drugače: Uporaba v stroki

- **Klinika.** Laktat v krvi nad okoli $4\,\mathrm{mmol/L}$ kaže na šok ali sepso; antidot pri zastrupitvi s cianidom je hidroksokobalamin, ki cianid veže v cianokobalamin. Metformin, zdravilo za sladkorno bolezen, šibko zavira kompleks I.
- **Diagnostika raka.** Tumorji pogosto pretežno fermentirajo glukozo tudi ob kisiku (Warburgov učinek). PET z označeno fluorodeoksiglukozo pokaže tkiva z veliko porabo glukoze.
- **Biotehnologija.** V pivovarni in pri proizvodnji bioetanola je fermentacija želena: kvasovke v anaerobnih razmerah dajo iz glukoze največ etanola. Za proizvodnjo biomase (pekovski kvas) pa reaktor intenzivno prezračujejo, da celice dobijo okoli $15$-krat več ATP na glukozo.
- **Šport.** Sprinter v nekaj sekundah dela pretežno anaerobno; maratonec uporablja oksidativno fosforilacijo, ki je počasnejša, a na glukozo dá mnogo več ATP.

## Drugače: Bolj natančno

**Dejanska energija v celici.** Pri koncentracijah v citosolu (ATP okoli $3\,\mathrm{mM}$, ADP okoli $0{,}1\,\mathrm{mM}$, $\mathrm{P_i}$ okoli $5\,\mathrm{mM}$) je
$$\Delta G = \Delta G^{\circ\prime} + RT\ln\frac{[\mathrm{ADP}][\mathrm{P_i}]}{[\mathrm{ATP}]}$$
za hidrolizo okoli $-50$ do $-55\,\mathrm{kJ/mol}$, zato je tudi sinteza ATP dražja od $30{,}5\,\mathrm{kJ/mol}$.

**Fruktoza-2,6-bisfosfat.** Ni intermediat glikolize, ampak signal. Tvori ga bifunkcionalni encim PFK-2/FBPaza-2, ki ga v jetrih glukagon prek fosforilacije preklopi na razgradnjo. Nizka fruktoza-2,6-bisfosfat zavre glikolizo in sprosti glukoneogenezo, tako da obe poti ne tečeta hkrati v prazen cikel.

**Kompleks I natančneje.** Elektroni gredo z NADH na FMN, nato prek verige železo-žveplovih centrov na ubikinon. Črpanje protonov poteka v membranskem delu, ki je od mesta redukcije ubikinona oddaljen več nanometrov: energija se prenese s konformacijsko spremembo, ne z neposrednim prenosom protona skupaj z elektronom.

## Preveri se

? Kateri encim *ne* sodi med nepovratne, uravnavane korake glikolize?
- heksokinaza
~ Heksokinaza ima v celici velik negativni $\Delta G$ in jo zavira njen produkt glukoza-6-fosfat.
- fosfofruktokinaza-1
~ PFK-1 je glavna kontrolna točka glikolize.
+ fosfoglicerat-mutaza
- piruvat-kinaza
~ Piruvat-kinaza je tretji nepovratni korak; v jetrih jo zavirajo ATP in alanin.
> Fosfoglicerat-mutaza je blizu ravnotežja in deluje v obe smeri, tudi v glukoneogenezi.

? Koliko molekul NADH nastane pri popolni oksidaciji ene glukoze (glikoliza, PDH, citratni cikel)?
- $6$
~ To je le citratni cikel ($2$ obrata po $3$); pozabil si glikolizo in PDH.
- $8$
~ Prištel si PDH, a pozabil $2$ NADH iz glikolize.
+ $10$
- $12$
~ $\mathrm{FADH_2}$ iz sukcinat-dehidrogenaze ni NADH; prišteti ju ne smeš.
> $2$ (glikoliza) $+ 2$ (PDH) $+ 6$ (cikel) $= 10$ NADH, poleg tega $2$ $\mathrm{FADH_2}$.

? Oligomicin zavre ATP-sintazo. Kaj se zgodi s porabo kisika v izoliranih mitohondrijih?
- Naraste, ker celica potrebuje več energije.
~ Izolirani mitohondriji se ne odzivajo na potrebe celice; odloča gradient.
+ Pade, ker gradient protonov naraste in zavre dihalno verigo.
- Ostane enaka, ker oligomicin ne deluje na dihalno verigo.
~ Neposredno res ne, a veriga in sintaza sta sklopljeni prek gradienta.
> Brez povratnega toka protonov $\Delta p$ naraste do točke, ko črpanje ni več mogoče; dodatek razklopljevalca dihanje spet sprosti.

? Študent piše bilanco: »Glikoliza da $4$ ATP in $2$ NADH, PDH $2$ NADH, cikel $6$ NADH, $2$ $\mathrm{FADH_2}$ in $2$ GTP. Skupaj $4 + 25 + 3 + 2 = 34$ ATP.« Kateri korak je napačen?
- Število NADH iz cikla.
~ Šest je pravilno: $3$ na obrat, $2$ obrata na glukozo.
+ Glikoliza da neto $2$ ATP, ne $4$, ker pripravljalna faza porabi $2$.
- Vrednost za $\mathrm{FADH_2}$.
~ $2 \cdot 1{,}5 = 3$ je pravilno.
> Pravilno je $2 + 25 + 3 + 2 = 32$ ATP (z malat-aspartatnim čolničkom).

? Pivovar opazi, da kvasovke v tanku, ki je slučajno dobil zrak, porabijo veliko manj sladkorja, a dajo manj etanola. Kaj se je zgodilo?
- Kisik je zaviral glikolizo neposredno.
~ Kisik ni zaviralec glikolize; tok skozi glikolizo pade posredno, ker je ATP več.
+ Kvasovke so piruvat oksidirale do $\mathrm{CO_2}$ in dobile mnogo več ATP na glukozo, zato so porabile manj sladkorja.
- Kisik je oksidiral etanol v tanku.
~ Neposredna kemijska oksidacija etanola s kisikom pri teh pogojih je zanemarljiva.
> Pasteurjev učinek: aerobno okoli $30$ ATP na glukozo namesto $2$, zato visok ATP in citrat zavreta PFK-1 in poraba glukoze pade; etanola nastane manj.

:::simboli
\Delta G | sprememba Gibbsove energije (z $^{\circ\prime}$: standardna pri pH 7) | \Delta G^{\circ\prime} = -zF\,\Delta E^{\circ\prime} | kJ/mol
\Delta E | razlika redukcijskih potencialov akceptorja in donorja | | V
E | redukcijski potencial (z $^{\circ\prime}$: standardni pri pH 7) | | V
n | število molov (NADH, $\mathrm{FADH_2}$, protonov) | | mol
z | število prenesenih elektronov | | –
F | Faradayeva konstanta | | C/mol
\Delta p | protonska gonilna sila | | V
\Delta\psi | membranski potencial | | V
\Delta\mathrm{pH} | razlika pH čez membrano | | – | zunaj minus matriks
R | splošna plinska konstanta | | J/(mol\,K)
T | temperatura | | K
n_c | število podenot $c$ v obroču | | –
\eta | izkoristek | | –
:::
