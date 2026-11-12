---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Izdelovalec violin raztopi šelak, smolo za lak, v etanolu. Etanol ima formulo $\mathrm{C_2H_6O}$ in vre pri $78\,\mathrm{°C}$. Formulo $\mathrm{C_2H_6O}$ ima tudi dimetil eter, potisni plin v nekaterih pršilkah. Ta vre pri $-24\,\mathrm{°C}$, zato je v sobi plin.

Isti atomi, v istem številu, pa ena snov teče iz steklenice, druga uhaja iz pršilke. Se je kdo zmotil pri formuli? Ne. Tekmovalne naloge iz organske kemije pogosto gradijo prav na tem: dajo formulo in vprašajo, katere snovi so lahko za njo, koliko jih je in kako se razlikujejo.

## Razlaga

**1. Mamljiva zmota: formula pove, katera snov je.** Pri anorganskih spojinah se je to obneslo: $\mathrm{NaCl}$ je vedno natrijev klorid. Zato je skušnjava velika, da isto velja tudi za ogljikove spojine. Ne velja. **Molekulska formula** pove le, kateri atomi so v molekuli in koliko jih je. Ne pove, kako so med seboj povezani.

Ogljik je štirivezen, kisik dvovezen, vodik enovezen. Iz dveh C, šestih H in enega O lahko sestaviš dve različni molekuli:

:::risba molekula
opis: Strukturna formula etanola. Dva atoma ogljika C sta povezana v verigo, na drugi C je vezan kisik O, na kisik pa vodik H. Na prvi C so vezani trije vodiki, na drugi dva.
---
    H   H
    |   |
H – C – C – O – H
    |   |
    H   H
:::

:::risba molekula
opis: Strukturna formula dimetil etra. Atom kisika O je v sredini med dvema atomoma ogljika C. Na vsak C so vezani trije vodiki H. Vodika na kisiku ni.
---
    H       H
    |       |
H – C – O – C – H
    |       |
    H       H
:::

Zgornja je etanol: kisik je na koncu verige in nosi vodik. Spodnja je dimetil eter: kisik sedi med ogljikoma. Takšen zapis z vsemi vezmi je **strukturna formula**.

**2. Popravek: izomeri.** Spojine z enako molekulsko formulo in različno zgradbo so **izomeri**. Imajo enako molsko maso, lastnosti pa so lahko zelo različne:

| Lastnost | etanol | dimetil eter |
|---|---|---|
| del z O | $\mathrm{-OH}$ | $\mathrm{-O-}$ med C |
| vrelišče | $78\,\mathrm{°C}$ | $-24\,\mathrm{°C}$ |
| z vodo | meša se v vsakem razmerju | topen precej manj |

**3. Funkcionalna skupina.** Del molekule, ki določa značilne lastnosti spojine, je **funkcionalna skupina**. Po njej spojine razvrstimo v skupine:

| Skupina spojin | Funkcionalna skupina | Primer |
|---|---|---|
| alkeni | $\mathrm{C{=}C}$ | eten $\mathrm{CH_2{=}CH_2}$ |
| alkini | $\mathrm{C{\equiv}C}$ | etin $\mathrm{HC{\equiv}CH}$ |
| alkoholi | $\mathrm{-OH}$ (hidroksilna) | etanol $\mathrm{CH_3CH_2OH}$ |
| etri | $\mathrm{-O-}$ med dvema C | dimetil eter $\mathrm{CH_3OCH_3}$ |
| ketoni | $\mathrm{C{=}O}$ med dvema C | propanon (aceton) $\mathrm{CH_3COCH_3}$ |
| karboksilne kisline | $\mathrm{-COOH}$ (karboksilna) | etanojska kislina $\mathrm{CH_3COOH}$ |
| estri | $\mathrm{-COO-}$ med dvema C | etil etanoat $\mathrm{CH_3COOCH_2CH_3}$ |

Pozor pri branju: $\mathrm{-OH}$ v alkoholu ni hidroksidni ion. Kisik je na ogljik vezan kovalentno, zato alkohol v vodi ne odcepi $\mathrm{OH^-}$ in ni baza.

:::premisli
Etanojska kislina $\mathrm{CH_3COOH}$ in metil metanoat $\mathrm{HCOOCH_3}$ imata isto formulo $\mathrm{C_2H_4O_2}$. Napovej, katera ima višje vrelišče, in povej zakaj.
---
Kislina ($118\,\mathrm{°C}$, ester le $32\,\mathrm{°C}$). Kislina ima v skupini $\mathrm{-COOH}$ vodik na kisiku, zato se njene molekule med seboj močno privlačijo. Ester takega vodika nima.
:::

**4. Druga zmota: izomeri so vedno iz iste skupine.** Mnogi iščejo le različne verige. Izomeri pa se ločijo na tri načine:

- **veriga**: butan $\mathrm{CH_3CH_2CH_2CH_3}$ in 2-metilpropan $\mathrm{CH_3CH(CH_3)CH_3}$;
- **lega skupine**: propan-1-ol (OH na koncu) in propan-2-ol (OH na sredini);
- **vrsta skupine**: alkohol in eter, kislina in ester, alken in **cikloalkan** (ogljiki, sklenjeni v obroč).

**5. Strategija: koliko vodikov manjka.** Nasičena odprta veriga (same enojne vezi, brez obroča) z $x$ ogljiki ima $2x + 2$ vodikov (alkani $\mathrm{C}_x\mathrm{H}_{2x+2}$). Vsaka dvojna vez ali obroč vzame dva vodika. Število manjkajočih parov je **stopnja nenasičenosti** $D$. Za formulo $\mathrm{C}_x\mathrm{H}_y$ ali $\mathrm{C}_x\mathrm{H}_y\mathrm{O}_z$ (kisik ne šteje):

$$D = \frac{2x + 2 - y}{2}$$

Trojna vez šteje kot dve. Pri $\mathrm{C_2H_6O}$ je $D = 0$: ni dvojne vezi ne obroča. Ostaneta samo alkohol in eter.

Dvojno vez dokažemo z **bromovico**. Rjava raztopina broma se ob alkenu ali alkinu razbarva, ker se brom veže na mesto dvojne vezi (adicija). Alkani in cikloalkani je ne razbarvajo hitro.

:::premisli
Imaš dve brezbarvni tekočini s formulo $\mathrm{C_5H_{10}}$. Prva razbarva bromovico, druga ne. Najprej izračunaj $D$. Kakšna je lahko zgradba druge, če nima dvojne vezi?
---
$D = \dfrac{2 \cdot 5 + 2 - 10}{2} = 1$. Prva ima dvojno vez (penten). Druga je cikloalkan, na primer ciklopentan: »manjkajoča« vodika je porabil obroč, ne dvojna vez, zato bromovica ostane rjava.
:::

**6. Lastnosti: kaj dviga vrelišče.** Ista molska masa še ne pomeni istega vrelišča. Veljajo tri pravila:

- daljša veriga, višje vrelišče;
- bolj razvejana veriga, nižje vrelišče (pentan $36\,\mathrm{°C}$, 2,2-dimetilpropan $10\,\mathrm{°C}$);
- skupini $\mathrm{-OH}$ in $\mathrm{-COOH}$ vrelišče močno dvignita, ker se molekule povezujejo prek vodika na kisiku (vodikove vezi).

Kratki alkoholi in kisline se zaradi istega razloga mešajo z vodo; ogljikovodiki ne. Kisla je le karboksilna skupina: kisline obarvajo lakmus rdeče in z magnezijem tvorijo vodik, alkoholi ne.

## Rešeni primeri

### Primer 1: polica v delavnici za kitare

Na polici so štiri snovi: (a) čistilo za strune $\mathrm{CH_3CH(OH)CH_3}$, (b) topilo v laku za kitare $\mathrm{CH_3COOCH_2CH_3}$, (c) kloroeten $\mathrm{CH_2{=}CHCl}$, iz katerega naredijo PVC za gramofonske plošče, (d) parafinski vosek za nego lesa $\mathrm{C_{25}H_{52}}$. Kateri skupini spojin pripada vsaka in katera razbarva bromovico?

**Podatki:** formule (a) $\mathrm{CH_3CH(OH)CH_3}$, (b) $\mathrm{CH_3COOCH_2CH_3}$, (c) $\mathrm{CH_2{=}CHCl}$, (d) $\mathrm{C_{25}H_{52}}$
**Iščemo:** skupino spojin za vsako snov in snov, ki razbarva bromovico

:::formula
Poišči funkcionalno skupino: $\mathrm{-OH}$ alkohol, $\mathrm{-COO-}$ med dvema C ester, $\mathrm{C{=}C}$ alken; samo C in H z $y = 2x + 2$ je alkan.
:::

**Rešitev:**

1. (a) Skupina $\mathrm{-OH}$ visi na srednjem ogljiku, zato je to alkohol (propan-2-ol), ne baza.
2. (b) Skupina $\mathrm{-COO-}$ stoji med $\mathrm{CH_3}$ in $\mathrm{CH_2CH_3}$, zato je to ester (etil etanoat).
3. (c) Ima dvojno vez $\mathrm{C{=}C}$; namesto enega vodika ima klor, a se zaradi dvojne vezi obnaša kot alken.
4. (d) $2 \cdot 25 + 2 = 52$, kar je ravno število vodikov: alkan, nasičen.
5. Bromovica se razbarva le ob dvojni vezi, torej pri (c).
6. Odgovor: (a) alkohol, (b) ester, (c) alken s klorom, (d) alkan; bromovico razbarva samo kloroeten.

### Primer 2: koliko izomerov ima $\mathrm{C_4H_{10}O}$

Koliko različnih spojin ima molekulsko formulo $\mathrm{C_4H_{10}O}$?

**Podatki:** molekulska formula $\mathrm{C_4H_{10}O}$, torej $x = 4$, $y = 10$
**Iščemo:** število strukturnih izomerov

:::formula
$D = \dfrac{2x + 2 - y}{2}$; vsako zgradbo opiši z verigo in lego skupine; obrnjena ali zrcaljena risba je ista spojina.
:::

**Rešitev:**

1. $D = \dfrac{2 \cdot 4 + 2 - 10}{2} = 0$, zato ni dvojnih vezi ne obročev. Kisik je lahko le v $\mathrm{-OH}$ (alkohol) ali v $\mathrm{-O-}$ (eter).
2. Ogljikova veriga s štirimi C je ravna ali razvejana (tri C in en $\mathrm{CH_3}$ na sredini).
3. Alkoholi na ravni verigi: OH na koncu ali na drugem C. OH na tretjem C je ista spojina kot na drugem, le z druge strani. To sta butan-1-ol in butan-2-ol.
4. Alkoholi na razvejani verigi: OH na koncu (2-metilpropan-1-ol) ali na srednjem C (2-metilpropan-2-ol).
5. Etri: kisik razdeli štiri ogljike na $1 + 3$ ali $2 + 2$. Ime etra pove, kaj visi na kisiku: metoksi je $\mathrm{CH_3O-}$, etoksi $\mathrm{CH_3CH_2O-}$. Pri $1 + 3$ je del s tremi C raven ali razvejan (1-metoksipropan, 2-metoksipropan), pri $2 + 2$ dobimo etoksietan.
6. Seštejemo: $4 + 3 = 7$.
7. Odgovor: formulo $\mathrm{C_4H_{10}O}$ ima sedem spojin, štirje alkoholi in trije etri.

### Primer 3: kateri alkohol je v čistilu za strune

Kitarist kupi čistilo za strune. Na nalepki piše le, da je v njem alkohol z eno skupino $\mathrm{OH}$ in brez dvojnih vezi. Ko $3{,}00\,\mathrm{g}$ alkohola popolnoma zgori, nastane $6{,}60\,\mathrm{g}$ ogljikovega dioksida. Kateri alkohol je to?

**Podatki:** $m(\mathrm{alkohol}) = 3{,}00\,\mathrm{g}$, $m(\mathrm{CO_2}) = 6{,}60\,\mathrm{g}$, alkohol $\mathrm{C}_x\mathrm{H}_{2x+1}\mathrm{OH}$; $A_r(\mathrm{C}) = 12{,}01$; $A_r(\mathrm{H}) = 1{,}008$; $A_r(\mathrm{O}) = 16{,}00$
**Iščemo:** molekulsko formulo in možne strukturne formule

:::formula
$m(\mathrm{C}) = m(\mathrm{CO_2}) \cdot \dfrac{A_r(\mathrm{C})}{M(\mathrm{CO_2})}$, nato $w(\mathrm{C}) = \dfrac{m(\mathrm{C})}{m(\mathrm{alkohol})}$
:::

**Rešitev:**

1. Ves ogljik iz alkohola konča v $\mathrm{CO_2}$, zato iz mase $\mathrm{CO_2}$ dobimo maso ogljika. $M(\mathrm{CO_2}) = 44{,}01\,\mathrm{g/mol}$.
2. $m(\mathrm{C}) = 6{,}60\,\mathrm{g} \cdot \dfrac{12{,}01}{44{,}01} = 1{,}80\,\mathrm{g}$
3. $w(\mathrm{C}) = \dfrac{1{,}80\,\mathrm{g}}{3{,}00\,\mathrm{g}} = 0{,}600$, torej $60{,}0\,\%$.
4. Primerjamo z masnimi deleži ogljika v alkoholih te vrste:

| $x$ | alkohol | $w(\mathrm{C})$ |
|---|---|---|
| 1 | $\mathrm{CH_3OH}$ | $37{,}5\,\%$ |
| 2 | $\mathrm{C_2H_5OH}$ | $52{,}1\,\%$ |
| 3 | $\mathrm{C_3H_7OH}$ | $60{,}0\,\%$ |
| 4 | $\mathrm{C_4H_9OH}$ | $64{,}8\,\%$ |

5. Ujema se $x = 3$: $\mathrm{C_3H_7OH}$ z $M = 60{,}09\,\mathrm{g/mol}$.
6. Preizkus z enačbo $\mathrm{2\,C_3H_7OH + 9\,O_2 \rightarrow 6\,CO_2 + 8\,H_2O}$: $n = \dfrac{3{,}00}{60{,}09} = 0{,}04993\,\mathrm{mol}$ alkohola da $3 \cdot 0{,}04993 = 0{,}1498\,\mathrm{mol}$ $\mathrm{CO_2}$, to je $0{,}1498 \cdot 44{,}01 = 6{,}59\,\mathrm{g}$. Razlika do $6{,}60\,\mathrm{g}$ je le zaokroževanje.
7. Skupina OH je lahko na koncu ali na sredini verige treh ogljikov. Metoksietan ima isto formulo, a je eter, zato odpade.
8. Odgovor: v čistilu je propanol $\mathrm{C_3H_7OH}$, in sicer propan-1-ol $\mathrm{CH_3CH_2CH_2OH}$ ali propan-2-ol $\mathrm{CH_3CH(OH)CH_3}$. Sežig ju ne loči, ker imata isto sestavo.

### Primer 4: zdaj ti

Etil etanoat $\mathrm{CH_3COOCH_2CH_3}$ je topilo v laku za bobne. Butanojska kislina $\mathrm{CH_3CH_2CH_2COOH}$ smrdi po žarkem maslu. Ali sta izomera? Kolikšen je masni delež ogljika v vsaki?

**Podatki:** $\mathrm{CH_3COOCH_2CH_3}$, $\mathrm{CH_3CH_2CH_2COOH}$; $A_r(\mathrm{C}) = 12{,}01$; $A_r(\mathrm{H}) = 1{,}008$; $A_r(\mathrm{O}) = 16{,}00$
**Iščemo:** ali sta izomera in $w(\mathrm{C})$

:::formula
$w(\mathrm{C}) = \dfrac{x \cdot A_r(\mathrm{C})}{M}$
:::

**Rešitev:**

1. Preštejemo atome: obe imata 4 C, 8 H in 2 O, torej $\mathrm{C_4H_8O_2}$. Zgradba je različna (ester in kislina), zato sta izomera vrste skupine.
2. $M = 4 \cdot 12{,}01 + 8 \cdot 1{,}008 + 2 \cdot 16{,}00 = 88{,}10\,\mathrm{g/mol}$
3. Izračunaj $w(\mathrm{C})$ sam, nato preveri:

:::premisli
Koliko je $w(\mathrm{C})$ v etil etanoatu in koliko v butanojski kislini?
---
$w(\mathrm{C}) = \dfrac{4 \cdot 12{,}01}{88{,}10} = 0{,}545$, torej $54{,}5\,\%$ v obeh. Izomeri imajo isto formulo, zato vedno tudi isto masno sestavo.
:::

## Pogoste napake

- **»Ista formula, ista snov.«** Molekulska formula ne pove, kako so atomi povezani. $\mathrm{C_2H_6O}$ je etanol ali dimetil eter. Ko naloga da le formulo, vedno pomisli na izomere.
- **Ista spojina, šteta dvakrat.** Butan-1-ol, narisan z OH na levem koncu, in isti z OH na desnem koncu sta ena spojina. Tudi zalomljena veriga ostane ista veriga. Pred štetjem vsako zgradbo poimenuj; enako ime pomeni isto spojino.
- **»Alkohol je baza, ker ima OH.«** V $\mathrm{NaOH}$ je hidroksidni ion, v alkoholu pa je $\mathrm{-OH}$ kovalentno vezan na ogljik. Alkohol ni baza; kislo reagira le skupina $\mathrm{-COOH}$.
- **»Enaka molska masa, enako vrelišče.«** Izomeri imajo enako molsko maso, vrelišča pa lahko zelo različna. Odločajo funkcionalna skupina in razvejanost.
- **»$\mathrm{C}_x\mathrm{H}_{2x}$ je vedno alken.«** Enako formulo ima cikloalkan, ki nima dvojne vezi in bromovice ne razbarva.

## Povzetek

- Molekulska formula pove sestavo, strukturna formula zgradbo. Izomeri imajo isto molekulsko formulo in različno zgradbo.
- Izomeri se razlikujejo po verigi, legi skupine ali vrsti skupine (alkohol/eter, kislina/ester, alken/cikloalkan).
- Funkcionalne skupine: $\mathrm{C{=}C}$, $\mathrm{C{\equiv}C}$, $\mathrm{-OH}$, $\mathrm{-O-}$, $\mathrm{C{=}O}$, $\mathrm{-COOH}$, $\mathrm{-COO-}$.
- Stopnja nenasičenosti $D = \dfrac{2x + 2 - y}{2}$ šteje dvojne vezi in obroče. Bromovico razbarvajo le alkeni in alkini.
- Vrelišče dvigajo daljša veriga ter skupini $\mathrm{-OH}$ in $\mathrm{-COOH}$; razvejanost ga zniža.
- Alkohol ni baza; kisla je le karboksilna skupina.
- Pri štetju izomerov vsako zgradbo poimenuj, da je ne šteješ dvakrat.

## Drugače: Kot zgodba

V glasbeni šoli sta se vpisala dvojčka z enakim priimkom: $\mathrm{C_2H_6O}$. Na papirju sta bila čisto enaka: dva ogljika, šest vodikov, en kisik. Učitelj je mislil, da bosta igrala isto.

Prvi, Etanol, je držal kisik na koncu roke in nanj obesil vodik. S tem vodikom se je rad prijel za sosede, zato se je z njimi držal skupaj vse do $78\,\mathrm{°C}$. V orkestru je sedel med violinisti in raztapljal šelak za lak.

Drugi, Dimetil eter, je skril kisik v sredino med dva ogljika. Prostega vodika na kisiku ni imel, zato se ni prijemal nikogar. Že pri $-24\,\mathrm{°C}$ je odletel kot plin.

Učitelj se je naučil lekcijo: priimek (molekulska formula) pove, kdo je v družini. Kdo je kdo, pove šele, kako se člani držijo za roke (strukturna formula).

## Drugače: Korak za korakom s številkami

Koliko izomerov ima $\mathrm{C_5H_{12}}$ in kateri vre najnižje?

1. $D = \dfrac{2 \cdot 5 + 2 - 12}{2} = 0$: samo verige, brez dvojnih vezi in obročev.
2. Najdaljša veriga 5 C: ena spojina, pentan.
3. Najdaljša veriga 4 C, en $\mathrm{CH_3}$ ob strani. Na drugem ogljiku je to 2-metilbutan; na tretjem ogljiku je ista spojina, le štejemo z druge strani. Ena spojina.
4. Najdaljša veriga 3 C, dva $\mathrm{CH_3}$ na srednjem ogljiku: 2,2-dimetilpropan. Ena spojina.
5. Na koncu verige $\mathrm{CH_3}$ ne smeš dodati: veriga bi se le podaljšala in dobil bi spojino iz 2. ali 3. koraka.
6. Seštejemo: $1 + 1 + 1 = 3$ izomeri.
7. Vrelišča: pentan $36\,\mathrm{°C}$, 2-metilbutan $28\,\mathrm{°C}$, 2,2-dimetilpropan $10\,\mathrm{°C}$. Bolj ko je molekula kepasta, manjši je stik med sosedami in nižje je vrelišče.

## Preveri se

? Čistilo za vrat kitare vsebuje snov s spodnjo strukturno formulo. Kaj je ta snov?
:::risba molekula
opis: Strukturna formula propan-2-ola. Trije atomi ogljika C so v verigi. Na srednji C je spodaj vezan kisik O, na kisik pa vodik H. Na prvi in tretji C so vezani po trije vodiki, na srednjega še en vodik zgoraj.
---
    H   H   H
    |   |   |
H – C – C – C – H
    |   |   |
    H   O   H
        |
        H
:::
- baza, ker ima skupino OH
~ Skupina $\mathrm{-OH}$ je kovalentno vezana na ogljik; to ni hidroksidni ion kot v $\mathrm{NaOH}$, zato snov ni baza.
- eter, ker ima kisik v verigi
~ Pri etru kisik stoji med dvema ogljikoma. Tu je kisik vezan na en ogljik in na vodik.
+ alkohol, propan-2-ol
- karboksilna kislina
~ Kislina ima skupino $\mathrm{-COOH}$ z dvema kisikoma. Tu je le en kisik.
> Skupina $\mathrm{-OH}$ na ogljiku pomeni alkohol; ker je na srednjem od treh ogljikov, je to propan-2-ol.

? Razvrsti snovi s podobno molsko maso od najnižjega do najvišjega vrelišča.
1. 2,2-dimetilpropan $\mathrm{C_5H_{12}}$
2. pentan $\mathrm{C_5H_{12}}$
3. butan-1-ol $\mathrm{C_4H_9OH}$
4. propanojska kislina $\mathrm{C_2H_5COOH}$
> Vse imajo molsko maso okoli $72$ do $74\,\mathrm{g/mol}$. Razvejani alkan vre najnižje ($10\,\mathrm{°C}$), raven višje ($36\,\mathrm{°C}$). Skupina $\mathrm{-OH}$ dvigne vrelišče na $118\,\mathrm{°C}$, skupina $\mathrm{-COOH}$ še više ($141\,\mathrm{°C}$).

? Ciklopentan ima formulo $\mathrm{C_5H_{10}}$, prav tako penten. Kaj se zgodi, če rjavo bromovico stresemo s ciklopentanom?
- Razbarva se, ker ima formula obliko $\mathrm{C}_x\mathrm{H}_{2x}$ kot alken.
~ Formulo $\mathrm{C}_x\mathrm{H}_{2x}$ ima tudi cikloalkan. Dva vodika manjkata zaradi obroča, ne zaradi dvojne vezi.
+ Ostane rjava, ker ciklopentan nima dvojne vezi.
- Razbarva se, ker sta izomera in imata enake lastnosti.
~ Izomeri imajo isto formulo, ne pa istih lastnosti. Odloča zgradba.
> Brom se hitro veže le na dvojno ali trojno vez. Ciklopentan ima same enojne vezi, zato bromovica ostane rjava; penten bi jo razbarval.

? Koliko strukturnih izomerov ima heksan $\mathrm{C_6H_{14}}$?
= 5
~ 6 | Verjetno si 2-metilpentan in 4-metilpentan štel kot različna. Gre za isto spojino, šteto z druge strani.
~ 7 | Nekatere zgradbe si štel dvakrat. Vsako poimenuj po najdaljši verigi; enako ime pomeni isto spojino.
~ 4 | Spomni se verige s štirimi C in dvema $\mathrm{CH_3}$: lahko sta na istem ogljiku ali na sosednjih.
> Heksan, 2-metilpentan, 3-metilpentan, 2,2-dimetilbutan in 2,3-dimetilbutan: $5$ izomerov.

? Bobnar zažge $2{,}30\,\mathrm{g}$ etanola v gorilniku za segrevanje laka. Koliko gramov vode nastane? Enačba: $\mathrm{C_2H_5OH + 3\,O_2 \rightarrow 2\,CO_2 + 3\,H_2O}$; $M(\mathrm{C_2H_5OH}) = 46{,}07\,\mathrm{g/mol}$, $M(\mathrm{H_2O}) = 18{,}02\,\mathrm{g/mol}$.
= 2,70 g | 0,02
~ 0,90 | Vzel si razmerje $1 : 1$. Iz enega mola etanola nastanejo trije moli vode.
~ 1,80 | Uporabil si koeficient $2$ (od $\mathrm{CO_2}$). Pri vodi je koeficient $3$.
~ 2,30 | Masa se ne prenese iz snovi v snov. Računaj prek množine.
> $n(\mathrm{C_2H_5OH}) = \dfrac{2{,}30}{46{,}07} = 0{,}0499\,\mathrm{mol}$, vode je trikrat toliko, $0{,}150\,\mathrm{mol}$, kar je $0{,}150 \cdot 18{,}02 = 2{,}70\,\mathrm{g}$.

<<RACUN
kemija: C2H5OH + 3 O2 -> 2 CO2 + 3 H2O
kemija: 2 C3H7OH + 9 O2 -> 6 CO2 + 8 H2O
molska: C2H6O | 46.07
molska: C3H8O | 60.09
molska: C4H8O2 | 88.10
vrednost: 6.60*12.01/44.01 | 1.80
vrednost: 1.80/3.00*100 | 60.0
vrednost: 12.01/32.04*100 | 37.5
vrednost: 24.02/46.07*100 | 52.1
vrednost: 36.03/60.09*100 | 60.0
vrednost: 48.04/74.12*100 | 64.8
vrednost: 4*12.01/88.10*100 | 54.5
vrednost: (2*4+2-10)/2 | 0
vrednost: (2*5+2-10)/2 | 1
vrednost: 2.30/46.07*3*18.02 | 2.70
>>

:::simboli
D | stopnja nenasičenosti | D = \frac{2x + 2 - y}{2} | – | število dvojnih vezi in obročev
x | število ogljikovih atomov v formuli | | – |
y | število vodikovih atomov v formuli | | – |
m | masa (v oklepaju piše, katere snovi) | | g | $m(\mathrm{C})$, $m(\mathrm{CO_2})$, $m(\mathrm{alkohol})$
A_r | relativna atomska masa | | – | $A_r(\mathrm{C}) = 12{,}01$
M | molska masa | | g/mol | $M(\mathrm{CO_2}) = 44{,}01\,\mathrm{g/mol}$
w | masni delež ogljika | | – | lahko v %
:::
