---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vez C=O je močnejša od vezi C=C: povprečna energija dvojne vezi C=O je okoli $745\,\text{kJ/mol}$, vezi C=C pa okoli $610\,\text{kJ/mol}$. Pričakoval bi, da je karbonilna skupina zato bolj trdna in manj reaktivna. Pa ni. Eten z vodo pri sobni temperaturi ne reagira, metanal (formaldehid) pa se v vodi skoraj v celoti spremeni v hidrat, metandiol.

To ima posledice tudi v glasbeni sobi. Ohišja cenejših zvočnikov in mnogih ojačevalcev so iz plošč MDF, zlepljenih s sečninsko-formaldehidnim lepilom. Lepilo nastane, ker dušik sečnine kar sam napade ogljik formaldehida. Enako rad reagira formaldehid z dušikom v beljakovinah našega telesa, zato je škodljiv in so predpisi o njegovem izhlapevanju iz pohištva strogi. Karbonilna skupina rada reagira že pri sobni temperaturi.

Paradoks razreši ena beseda: **polarnost**. Ne gre za to, kako močna je vez, ampak kam so premaknjeni elektroni. Ko to razumeš, lahko napoveš reakcije aldehidov in ketonov z vodo, alkoholi, amini, hidridi in Grignardovimi reagenti ter razumeš aldolno reakcijo, s katero se gradijo nove vezi C–C.

## Razlaga

**Najprej en primer do konca.** Etanal (acetaldehid, CH$_3$CHO) zmešamo z vodno raztopino NaCN in malo kisline. Nastane 2-hidroksipropannitril, CH$_3$CH(OH)CN. Kako?

1. Kisik je bolj elektronegativen od ogljika, zato elektrone vezi C=O vleče k sebi. Ogljik ima delni pozitivni naboj ($\delta+$), kisik delni negativni ($\delta-$).
2. Cianidni ion ima na ogljiku prost elektronski par in negativen naboj. Ta par napade $\delta+$ karbonilni ogljik. **Nukleofil** je delec s prostim elektronskim parom (Lewisova baza), ki ta par odda elektronsko revnemu atomu in z njim tvori novo kovalentno vez. **Elektrofil** je elektronsko reven atom ali delec (Lewisova kislina), ki par sprejme.
3. Hkrati se šibkejša vez $\pi$ med C in O razcepi, njen elektronski par preide na kisik. Nastane **alkoksidni ion**, CH$_3$CH(O$^-$)CN.
4. Alkoksid vzame proton iz vode ali HCN. Nastane **cianohidrin**: spojina s skupinama OH in CN na istem ogljiku.

Pomembno: močna vez $\sigma$ med C in O ostane. Razcepi se le vez $\pi$, ki je šibkejša od vezi $\sigma$. V tem je odgovor na paradoks iz uvoda.

:::premisli
Karbonilni ogljik v etanalu je planaren (sp$^2$), v produktu pa tetraedričen. Če bi začeli z butanonom, ali bi dobili en sam enantiomer cianohidrina?
---
Ne. Planarno skupino nukleofil napade z obeh strani enako pogosto, zato nastane racemna zmes obeh enantiomerov.
:::

**Posplošitev: nukleofilna adicija.** Isti koraki veljajo za vse aldehide in ketone:

```
 Nu⁻     R           R                R
   ↘     \           \               \
     C=O   →   Nu–C–O⁻   →(H⁺)→  Nu–C–OH
     /           /               /
    R'          R'              R'
```

Nukleofil se veže na ogljik, kisik postane OH. Spreminja se samo nukleofil:

| nukleofil | produkt | opomba |
|---|---|---|
| H$_2$O | hidrat (geminalni diol) | ravnotežje |
| H$^-$ iz NaBH$_4$ ali LiAlH$_4$ | alkohol | aldehid → primarni, keton → sekundarni |
| R–MgX (Grignard) | alkohol z novo vezjo C–C | nato vodna obdelava |
| R–OH (s kislino kot katalizatorjem) | hemiacetal, nato acetal | acetal ščiti karbonil |

**Nukleofilna adicija** je reakcija, pri kateri se nukleofil veže na elektrofilni ogljik dvojne vezi, vez $\pi$ se razcepi, iz dveh delcev pa nastane en produkt. Nukleofili, ki so tudi dobre izstopajoče skupine (H$_2$O, ROH, CN$^-$), adirajo **povratno**, zato je izid ravnotežje. Hidrid in karbanion iz Grignardovega reagenta adirata **nepovratno**, ker sta H$^-$ in R$^-$ zelo slabi izstopajoči skupini. Pri hidrataciji iz $K_\text{hidr} = [\text{hidrat}]/[\text{aldehid}]$ sledi delež hidrata $x = K_\text{hidr}/(1 + K_\text{hidr})$.

Grignardov reagent da z metanalom primarni alkohol, z drugimi aldehidi sekundarni, s ketoni terciarni: karbonilni ogljik obdrži svoja substituenta in dobi še R, kisik pa postane OH.

**Hemiacetal** ima na istem ogljiku skupini OH in OR, **acetal** dve skupini OR. Mehanizem nastanka acetala s kislino kot katalizatorjem:

1. protonacija karbonilnega kisika poveča $\delta+$ na ogljiku, zato ga napade tudi šibak nukleofil ROH;
2. odcep protona da hemiacetal;
3. protonacija skupine OH hemiacetala jo spremeni v dobro izstopajočo skupino H$_2$O;
4. izstop vode da resonančno stabiliziran oksonijev ion R$_2$C=O$^+$R;
5. druga molekula ROH napade ogljik, odcep protona da acetal.

Vse stopnje so povratne. K acetalu ravnotežje premaknemo s prebitkom alkohola in z odstranjevanjem vode, v vodni kislini pa acetal hidrolizira nazaj. V bazičnem in proti nukleofilom je acetal obstojen, zato **ščiti** karbonilno skupino.

Z amini ($\text{R–NH}_2$) se adiciji pridruži še izstop vode: nastane **imin** z vezjo C=N. Amin se adira v karbinolamin (na istem ogljiku skupini OH in NHR), njegova protonirana skupina OH izstopi kot voda, iminijev ion odda proton. Reakcija je najhitrejša pri pH okoli $4$–$5$: v bolj kislem je amin protoniran (RNH$_3^+$) in ni več nukleofil, v manj kislem pa se OH ne protonira in ne izstopi. Reakcija sečnine v lepilu se začne podobno: z adicijo na metanal da hidroksimetilsečnino, ki se nato z izstopom vode poveže v mrežo.

**Aldehidi so reaktivnejši od ketonov.** Razloga sta dva. Alkilne skupine ketona so elektronodonorske in zmanjšajo delni pozitivni naboj na ogljiku. Poleg tega so večje od vodika, zato nukleofilu zastirajo pot. Formaldehid ima dva vodika in je najreaktivnejši. Dobro se vidi pri hidratih: v vodi je metanal skoraj ves hidratiziran, etanal približno do polovice, propanon (aceton) pa le v desetinkah odstotka.

**Drugo obličje: atom $\alpha$.** Ogljik takoj ob karbonilni skupini se imenuje **ogljik $\alpha$**, njegovi vodiki pa vodiki $\alpha$. Ti so nenavadno kisli: $\text{p}K_\text{a}$ propanona je okoli $19$, alkana pa okoli $50$. Ko baza odtrga proton $\alpha$, se negativni naboj razporedi med ogljik $\alpha$ in kisik. Ta resonančno stabiliziran anion je **enolat**. Enolat je nukleofil na ogljiku $\alpha$. Če enolat protoniramo na kisiku, dobimo **enol** (C=C–OH), tavtomer karbonilne spojine; pri preprostih aldehidih in ketonih je keto-enolno ravnotežje močno na strani karbonilne oblike.

:::premisli
Kaj se zgodi, ko enolat sreča drugo, še nespremenjeno molekulo istega aldehida? Kateri atom bo napadel katerega?
---
Ogljik $\alpha$ enolata (nukleofil) napade karbonilni ogljik druge molekule (elektrofil). To je nukleofilna adicija, le da je nukleofil enolat. Nastane nova vez C–C.
:::

**Aldolna reakcija.** Dve molekuli etanala z razredčeno NaOH dasta 3-hidroksibutanal, CH$_3$CH(OH)CH$_2$CHO. Ime »aldol« pove, da ima produkt hkrati **ald**ehidno skupino in **alkohol**no skupino OH. Skupina OH je na ogljiku $\beta$, dva atoma od karbonila. Ker se pri adiciji nič ne izgubi, ima produkt natanko maso obeh molekul skupaj. Mehanizem z bazo kot katalizatorjem:

1. OH$^-$ odtrga proton $\alpha$, nastane enolat (ravnotežje, enolata je malo);
2. ogljik $\alpha$ enolata napade karbonilni ogljik druge molekule, nastane alkoksid z novo vezjo C–C;
3. alkoksid vzame proton vodi, nastane aldol, OH$^-$ se obnovi.

Pri segrevanju produkt izgubi vodo: OH z ogljika $\beta$ in H z ogljika $\alpha$. Nastane **$\alpha,\beta$-nenasičen** karbonil, iz etanala but-2-enal. Temu rečemo **aldolna kondenzacija**. V bazičnem poteče po mehanizmu E1cB: baza odtrga še en proton $\alpha$, nastali enolat izrine OH$^-$ z ogljika $\beta$. Pogoj je torej, da ima ogljik $\alpha$ aldola še vodik. Reakcija gre rada, ker je nova vez C=C konjugirana s C=O.

Pri **križni aldolni reakciji** sodelujeta dve različni spojini. Čisto gre le, če ena nima vodikov $\alpha$ (npr. benzaldehid ali metanal). Ta je lahko samo elektrofil, druga pa daje enolat.

## Rešeni primeri

### Primer 1: lepilo za zvočniške omarice

Za lepilo za plošče MDF, iz katerih izdelujejo ohišja zvočnikov, uporabljajo formalin, vodno raztopino metanala. Ravnotežna konstanta hidratacije metanala je $K_\text{hidr} = \dfrac{[\text{CH}_2(\text{OH})_2]}{[\text{HCHO}]} \approx 2{,}3 \cdot 10^3$. Kolikšen delež metanala je v raztopini v obliki hidrata?

**Podatki:** $K_\text{hidr} = 2{,}3 \cdot 10^3$ (voda je topilo in je vključena v $K$)
**Iščemo:** delež hidrata $x$

:::formula
$x = \dfrac{[\text{hidrat}]}{[\text{hidrat}] + [\text{aldehid}]} = \dfrac{K_\text{hidr}}{1 + K_\text{hidr}}$
:::

**Rešitev:**

1. Števec in imenovalec delimo z $[\text{aldehid}]$, zato v izrazu ostane samo $K_\text{hidr}$.
2. $x = \dfrac{2300}{1 + 2300} = \dfrac{2300}{2301} \approx 0{,}9996$.
3. Prosti metanal predstavlja le okoli $0{,}04\,\%$, a se ob porabi sproti obnavlja iz hidrata.
4. Odgovor: okoli $99{,}96\,\%$ metanala je v formalinu v obliki metandiola.

### Primer 2: redukcija z NaBH$_4$

Imamo $3{,}61\,\text{g}$ butanona ($M = 72{,}11\,\text{g/mol}$). Kateri produkt nastane z NaBH$_4$ in koliko NaBH$_4$ ($M = 37{,}83\,\text{g/mol}$) najmanj potrebujemo, če vsak ion BH$_4^-$ odda štiri hidridne ione?

**Podatki:** $m(\text{butanon}) = 3{,}61\,\text{g}$; $M(\text{butanon}) = 72{,}11\,\text{g/mol}$; $M(\text{NaBH}_4) = 37{,}83\,\text{g/mol}$; $1\,\text{mol BH}_4^- \to 4\,\text{mol H}^-$
**Iščemo:** produkt in najmanjšo maso NaBH$_4$

:::formula
$n = \dfrac{m}{M}$; $n(\text{NaBH}_4) = \dfrac{n(\text{keton})}{4}$; $m = n \cdot M$
:::

**Rešitev:**

1. Hidrid napade karbonilni ogljik, kisik se protonira. Iz ketona nastane sekundarni alkohol: butan-2-ol.
2. $n(\text{butanon}) = \dfrac{3{,}61\,\text{g}}{72{,}11\,\text{g/mol}} \approx 0{,}0500\,\text{mol}$.
3. En ion BH$_4^-$ reducira štiri molekule ketona: $n(\text{NaBH}_4) = \dfrac{0{,}0500\,\text{mol}}{4} = 0{,}0125\,\text{mol}$.
4. $m(\text{NaBH}_4) = 0{,}0125\,\text{mol} \cdot 37{,}83\,\text{g/mol} \approx 0{,}473\,\text{g}$.
5. Odgovor: nastane butan-2-ol; potrebujemo najmanj $0{,}473\,\text{g}$ NaBH$_4$ (v praksi rahel prebitek).

### Primer 3: aldolna reakcija propanala

Propanal ($5{,}81\,\text{g}$, $M = 58{,}08\,\text{g/mol}$) obdelamo z razredčeno NaOH. Kateri aldol nastane in koliko ga največ dobimo ($M = 116{,}16\,\text{g/mol}$)? Koliko produkta največ dobimo, če zmes segrevamo in pride do kondenzacije ($M = 98{,}15\,\text{g/mol}$)? Po čiščenju izoliramo $3{,}93\,\text{g}$ enala; kolikšen je izkoristek? Ali bi enak postopek z zmesjo propanala in etanala dal en sam produkt?

**Podatki:** $m(\text{propanal}) = 5{,}81\,\text{g}$, $M(\text{propanal}) = 58{,}08\,\text{g/mol}$, $M(\text{aldol}) = 116{,}16\,\text{g/mol}$, $M(\text{enal}) = 98{,}15\,\text{g/mol}$, izolirano $3{,}93\,\text{g}$ enala
**Iščemo:** strukturi produktov, njuni največji masi, izkoristek in produkte križne reakcije z etanalom

:::formula
$2\,\text{propanal} \to \text{aldol}$; $\text{aldol} \to \text{enal} + \text{H}_2\text{O}$; $n(\text{aldol}) = \tfrac{1}{2}\,n(\text{propanal})$; izkoristek $= \dfrac{m(\text{izolirano})}{m(\text{največ})}$
:::

**Rešitev:**

1. Ogljik $\alpha$ propanala je C2 (CH$_2$ ob CHO). Enolat CH$_3$CH$^-$–CHO napade karbonilni ogljik druge molekule.
2. Nova vez C–C poveže C2 prve molekule s C1 druge. Produkt je CH$_3$CH$_2$CH(OH)–CH(CH$_3$)–CHO, 3-hidroksi-2-metilpentanal.
3. $n(\text{propanal}) = \dfrac{5{,}81\,\text{g}}{58{,}08\,\text{g/mol}} \approx 0{,}1000\,\text{mol}$, zato $n(\text{aldol}) = 0{,}0500\,\text{mol}$.
4. $m(\text{aldol}) = 0{,}0500\,\text{mol} \cdot 116{,}16\,\text{g/mol} \approx 5{,}81\,\text{g}$; masa se ohrani, ker je adicija.
5. Pri segrevanju izstopi voda (OH s C3, H s C2): nastane 2-metilpent-2-enal. Kondenzacija je mogoča, ker ima C2 aldola še en vodik. $m = 0{,}0500\,\text{mol} \cdot 98{,}15\,\text{g/mol} \approx 4{,}91\,\text{g}$.
6. Izkoristek: $\dfrac{3{,}93\,\text{g}}{4{,}91\,\text{g}} \approx 0{,}800$, torej $80{,}0\,\%$.
7. Zmes z etanalom: obe spojini imata vodike $\alpha$ in obe sta elektrofila, zato nastanejo štirje aldoli: 3-hidroksibutanal (etanal + etanal), 3-hidroksi-2-metilpentanal (propanal + propanal), 3-hidroksipentanal (enolat etanala + propanal) in 3-hidroksi-2-metilbutanal (enolat propanala + etanal).
8. Odgovor: aldol je 3-hidroksi-2-metilpentanal (največ $5{,}81\,\text{g}$), po kondenzaciji pa 2-metilpent-2-enal (največ $4{,}91\,\text{g}$, izkoristek $80{,}0\,\%$). Zmes z etanalom bi dala štiri produkte, zato čista križna aldolna reakcija potrebuje partnerja brez vodikov $\alpha$.

### Primer 4: zdaj ti

Benzaldehid ($2{,}12\,\text{g}$, $M = 106{,}12\,\text{g/mol}$) zmešamo s prebitkom propanona in NaOH. Nastane 4-fenilbut-3-en-2-on ($M = 146{,}19\,\text{g/mol}$). Koliko produkta največ dobimo?

**Podatki:** $m(\text{benzaldehid}) = 2{,}12\,\text{g}$, $M(\text{benzaldehid}) = 106{,}12\,\text{g/mol}$, $M(\text{produkt}) = 146{,}19\,\text{g/mol}$, propanon v prebitku
**Iščemo:** največjo maso produkta

:::formula
$n = \dfrac{m}{M}$; $n(\text{produkt}) = n(\text{benzaldehid})$; $m = n \cdot M$
:::

**Rešitev:**

1. Benzaldehid nima vodikov $\alpha$, zato je samo elektrofil. Enolat tvori propanon, ki je v prebitku, zato benzaldehid omejuje reakcijo. Aldol tu izgubi vodo že brez močnega segrevanja, ker je nova vez C=C konjugirana z obročem in s C=O.
2. $n(\text{benzaldehid}) = \dfrac{2{,}12\,\text{g}}{106{,}12\,\text{g/mol}} \approx 0{,}0200\,\text{mol}$.
3. Izračunaj maso produkta sam, nato preveri:

:::premisli
Koliko je $m = 0{,}0200\,\text{mol} \cdot 146{,}19\,\text{g/mol}$? Zakaj tu množine ne deliš z $2$ kot v Primeru 3?
---
$m \approx 2{,}92\,\text{g}$. Ena molekula benzaldehida se poveže z eno molekulo propanona v eno molekulo produkta (po izstopu vode), zato deljenja z $2$ ni.
:::

## Pogoste napake

- **Nukleofil napade kisik.** Zdi se, da negativni delec išče »reaktivni« kisik. Kisik pa je $\delta-$ in odbija nukleofil. Napade se $\delta+$ ogljik, kisik nato sprejme proton.
- **Močnejša vez pomeni manjšo reaktivnost.** To velja le, če se vez v celoti razcepi. Pri adiciji se razcepi samo vez $\pi$, odloča pa polarnost, ne skupna energija dvojne vezi.
- **Ketoni so reaktivnejši, ker imajo več alkilnih skupin.** Alkilne skupine dajejo elektrone in zastirajo pot. Zato so ketoni *manj* reaktivni od aldehidov.
- **Pri aldolni reakciji se povežeta karbonilna ogljika.** Ne: ogljik $\alpha$ ene molekule se poveže s karbonilnim ogljikom druge. Skupina OH je zato na ogljiku $\beta$.
- **Vsak aldehid da aldol.** Benzaldehid in metanal nimata vodikov $\alpha$, zato sama s sabo ne tvorita enolata.
- **En mol NaBH$_4$ na en mol ketona.** Ion BH$_4^-$ odda štiri hidridne ione, zato zadošča četrtina množine.

## Povzetek

- Vez C=O je polarna: ogljik je $\delta+$ (elektrofil), kisik $\delta-$.
- Nukleofilna adicija: nukleofil napade karbonilni ogljik, nastane alkoksid, protonacija da OH. Z vodo nastane hidrat, s hidridom alkohol, z Grignardovim reagentom alkohol z novo vezjo C–C, z alkoholi hemiacetal in acetal, z amini imin.
- Reaktivnost: metanal > drugi aldehidi > ketoni (elektronski in sterični razlogi).
- Vodiki $\alpha$ so kisli ($\text{p}K_\text{a} \approx 19$–$20$); baza da enolat, nukleofil na ogljiku $\alpha$.
- Aldolna adicija: enolat + karbonil → $\beta$-hidroksi karbonil. Pri segrevanju izstopi voda: $\alpha,\beta$-nenasičen karbonil (kondenzacija).

## Za izpit

Znati moraš povedati:

- definicije nukleofila, elektrofila, nukleofilne adicije, hidrata, hemiacetala, acetala, imina, enola, enolata in vodikov $\alpha$;
- mehanizem nukleofilne adicije in razliko med povratno (H$_2$O, ROH, CN$^-$) in nepovratno adicijo (H$^-$, R$^-$);
- utemeljitev, zakaj so aldehidi reaktivnejši od ketonov (elektronski in sterični razlog), in delež hidrata iz $K_\text{hidr}$;
- mehanizem kislinsko katalizirane tvorbe acetala in tvorbe imina z vlogo pH;
- mehanizem aldolne adicije in kondenzacije (E1cB) ter pogoj za čisto križno aldolno reakcijo;
- kateri alkohol da Grignardov reagent z metanalom, z drugimi aldehidi in s ketoni.

### Naloga 1

2-etilheksan-1-ol, surovino za mehčala v PVC, industrijsko pripravijo iz butanala: z aldolno kondenzacijo nastane 2-etilheks-2-enal, ki ga s katalitsko hidrogenacijo (H$_2$, Ni) pretvorijo v alkohol. (a) Napiši strukture vmesnih produktov in utemelji, zakaj je etilna skupina na C2. (b) Iz $14{,}42\,\text{g}$ butanala ($M = 72{,}11\,\text{g/mol}$) z izkoristkom kondenzacije $85{,}0\,\%$ in hidrogenacije $90{,}0\,\%$: koliko gramov 2-etilheksan-1-ola ($M = 130{,}23\,\text{g/mol}$) dobimo? (c) Koliko litrov vodika pri $0\,°\text{C}$ in $101{,}3\,\text{kPa}$ ($V_\text{m} = 22{,}41\,\text{L/mol}$) najmanj potrebujemo za popolno hidrogenacijo vsega nastalega enala?

**Rešitev:**

1. (a) Ogljik $\alpha$ butanala (CH$_3$CH$_2$CH$_2$CHO) je C2. OH$^-$ odtrga proton z njega, enolat CH$_3$CH$_2$CH$^-$–CHO napade C1 druge molekule.
2. Aldol: CH$_3$CH$_2$CH$_2$CH(OH)–CH(CH$_2$CH$_3$)–CHO, 2-etil-3-hidroksiheksanal. Skupina CHO enolata postane C1 aldola, njegov ogljik $\alpha$ pa C2. Na tem ogljiku ostane preostanek verige enolata (C3 in C4 butanala), to je etilna skupina, zato je na C2.
3. C2 ima še vodik, zato pri segrevanju po E1cB izstopi voda: CH$_3$CH$_2$CH$_2$CH=C(CH$_2$CH$_3$)–CHO, 2-etilheks-2-enal.
4. Hidrogenacija nasiti vez C=C in reducira C=O: CH$_3$(CH$_2$)$_3$CH(CH$_2$CH$_3$)CH$_2$OH, 2-etilheksan-1-ol.
5. (b) $n(\text{butanal}) = \dfrac{14{,}42\,\text{g}}{72{,}11\,\text{g/mol}} \approx 0{,}2000\,\text{mol}$; iz dveh molekul nastane ena, zato največ $0{,}1000\,\text{mol}$ enala.
6. Pri izkoristku $85{,}0\,\%$: $n(\text{enal}) = 0{,}1000 \cdot 0{,}850 = 0{,}0850\,\text{mol}$; po hidrogenaciji $n(\text{alkohol}) = 0{,}0850 \cdot 0{,}900 = 0{,}0765\,\text{mol}$.
7. $m(\text{alkohol}) = 0{,}0765\,\text{mol} \cdot 130{,}23\,\text{g/mol} \approx 9{,}96\,\text{g}$.
8. (c) Na molekulo enala gresta dve molekuli H$_2$ (C=C in C=O): $n(\text{H}_2) = 2 \cdot 0{,}0850 = 0{,}170\,\text{mol}$, $V = 0{,}170\,\text{mol} \cdot 22{,}41\,\text{L/mol} \approx 3{,}81\,\text{L}$.
9. Odgovor: butanal → 2-etil-3-hidroksiheksanal → 2-etilheks-2-enal → 2-etilheksan-1-ol; dobimo okoli $9{,}96\,\text{g}$ alkohola, za hidrogenacijo pa potrebujemo najmanj $3{,}81\,\text{L}$ vodika.

### Naloga 2

Natančno definiraj hemiacetal in acetal. Napiši mehanizem kislinsko katalizirane reakcije etanala s prebitkom metanola do acetala in utemelji: (a) zakaj je kislina potrebna, (b) kako ravnotežje premaknemo k produktu, (c) zakaj z acetalom zaščitimo aldehidno skupino, ko želimo v isti molekuli z LiAlH$_4$ reducirati estrsko skupino.

**Rešitev:**

1. Definiciji: hemiacetal ima na istem ogljiku skupini OH in OR, acetal dve skupini OR. Produkt je 1,1-dimetoksietan, CH$_3$CH(OCH$_3$)$_2$.
2. Protonacija kisika C=O etanala da CH$_3$CH=O$^+$H; ogljik postane bolj elektrofilen.
3. Metanol napade ogljik, odcep protona da hemiacetal CH$_3$CH(OH)OCH$_3$.
4. Protonacija skupine OH, izstop vode da oksonijev ion CH$_3$CH=O$^+$CH$_3$, stabiliziran s prostim parom kisika.
5. Druga molekula metanola napade ogljik, odcep protona da acetal; H$^+$ se obnovi.
6. (a) Metanol je šibek nukleofil; brez protonacije karbonil ni dovolj elektrofilen, skupina OH hemiacetala pa ne izstopi kot OH$^-$, temveč šele kot H$_2$O.
7. (b) Vse stopnje so povratne. Po Le Chatelierjevem načelu ravnotežje premaknemo s prebitkom metanola in z odstranjevanjem vode (sušilo ali azeotropna destilacija).
8. (c) Acetal nima elektrofilne vezi C=O in je obstojen v bazičnem in proti hidridu, zato LiAlH$_4$ reducira le ester. Po redukciji acetal z vodno kislino hidroliziramo nazaj v aldehid.
9. Odgovor: acetal nastane v petih stopnjah s kislino kot katalizatorjem, ravnotežje premaknemo s prebitkom alkohola in odstranjevanjem vode, kot zaščitna skupina pa deluje, ker je obstojen v bazičnem in razpade le v kislem.

## Drugače: Z analogijo

Misli na kitaro. Napete strune ne strgaš zlahka, a zazveni že ob rahlem udarcu prsta. Karbonilna skupina je podobna: vez C=O je močna, a ima »občutljivo točko« – ogljik, s katerega je kisik odvlekel elektrone. Nukleofil je prst, ki udari natanko tja.

Aldolna reakcija je duet z različnima vlogama: enolat »začne« (napade), karbonil »odgovori« (sprejme napad). Benzaldehid brez vodika $\alpha$ lahko le odgovarja, zato križna reakcija z njim da en sam glavni produkt.

## Drugače: Bolj natančno

**Orbitale.** Najnižja nezasedena orbitala (LUMO) karbonilne skupine je $\pi^*$ z večjim koeficientom na ogljiku. Nukleofil vanjo prenese elektrone pod kotom okoli $107°$ glede na vez C=O (Bürgi–Dunitzev kot), ne pravokotno. Ogljik se pri tem prehibridizira iz sp$^2$ v sp$^3$.

**Termodinamika hidratacije.** Za etanal je $K_\text{hidr} \approx 1{,}06$, za propanon $K_\text{hidr} \approx 1{,}4 \cdot 10^{-3}$. Deleža hidrata sta $\dfrac{1{,}06}{2{,}06} \approx 51\,\%$ in okoli $0{,}14\,\%$; razmerje konstant je okoli $760$. Ravnotežje premikajo stabilizacija karbonila z donorskimi skupinami in sterična napetost v tetraedričnem produktu.

**Koliko enolata nastane.** Z NaOH v vodi se vzpostavi $\text{CH}_3\text{COCH}_3 + \text{OH}^- \rightleftharpoons \text{enolat} + \text{H}_2\text{O}$ s $K = 10^{\text{p}K_\text{a}(\text{H}_2\text{O}) - \text{p}K_\text{a}(\text{keton})} \approx 10^{15{,}7 - 19{,}2} \approx 3 \cdot 10^{-4}$. Enolata je malo, karbonila pa veliko, kar je ravno pogoj za aldol. Z močno, sterično ovirano bazo LDA pa ketone pri $-78\,°\text{C}$ skoraj popolnoma pretvorimo v enolat, tako da se pri križnih reakcijah vrstni red dodajanja natančno nadzira.

**Stereokemija.** Ker sta obe strani karbonila enakovredni (ploskvi *Re* in *Si*), aldol iz akiralnih reaktantov nastane kot racemat. Pri propanalu nastaneta dva stereocentra, zato dobimo zmes diastereomerov *syn* in *anti*.

## Preveri se

? Pri izdelavi lepila za ohišja zvočnikov sečnina napade metanal. Kako imenujemo vlogo metanala v tem koraku?
- Nukleofil
~ Nukleofil je sečnina, ki prinese prosti elektronski par dušika.
+ Elektrofil
- Enolat
~ Metanal nima vodikov $\alpha$, zato enolata ne more tvoriti.
- Baza
~ Metanal tu ne sprejema protona, ampak elektronski par na ogljik.
> Karbonilni ogljik metanala je $\delta+$ in sprejme elektronski par dušika, zato je metanal elektrofil.

? Razvrsti spojine po reaktivnosti za nukleofilno adicijo od največje do najmanjše: metanal, propanon, etanal.
- propanon > etanal > metanal
~ Alkilne skupine ne povečajo reaktivnosti: dajejo elektrone in zastirajo pot nukleofilu.
+ metanal > etanal > propanon
- etanal > metanal > propanon
~ Metilna skupina etanala zmanjša delni pozitivni naboj; metanal brez alkilnih skupin je reaktivnejši.
> Vsaka alkilna skupina zmanjša $\delta+$ na ogljiku in poveča sterično oviranost.

? Študent segreva sam benzaldehid z razredčeno NaOH in pričakuje aldol. Kaj bo dejansko ugotovil?
- Nastane aldol iz dveh molekul benzaldehida.
~ Za enolat so potrebni vodiki $\alpha$, ki jih benzaldehid nima.
+ Aldolna reakcija ne poteče, ker benzaldehid ne more tvoriti enolata.
- Nastane enolat na kisiku, ki napade drugo molekulo.
~ Enolat nastane z odvzemom protona $\alpha$, ne z napadom na kisik; tu protona $\alpha$ ni.
> Benzaldehid je lahko le elektrofil; za aldol potrebuje partnerja z vodiki $\alpha$.

? Za neki aldehid je $K_\text{hidr} = 1{,}0$. Kolikšen delež je v vodi hidratiziran?
- $100\,\%$
~ $K = 1$ ne pomeni popolne pretvorbe, ampak enaki koncentraciji obeh oblik.
+ $50\,\%$
- $0\,\%$
~ Pri $K = 1$ nastane hidrata enako kot ostane aldehida, ne nič.
- $1\,\%$
~ $K$ ni delež v odstotkih; delež je $\dfrac{K}{1 + K}$.
> $x = \dfrac{1{,}0}{1 + 1{,}0} = 0{,}50$, torej $50\,\%$.

? Iz $8{,}81\,\text{g}$ etanala ($M = 44{,}05\,\text{g/mol}$) z aldolno kondenzacijo dobimo but-2-enal ($M = 70{,}09\,\text{g/mol}$). Kolikšna je največja masa produkta?
- $14{,}0\,\text{g}$
~ To bi veljalo, če bi ena molekula etanala dala eno molekulo produkta; potrebni pa sta dve.
- $8{,}81\,\text{g}$
~ To je masa aldola (adicija ohrani maso); pri kondenzaciji izstopi voda.
+ $7{,}01\,\text{g}$
> $n(\text{etanal}) = 0{,}200\,\text{mol}$, $n(\text{but-2-enal}) = 0{,}100\,\text{mol}$, $m = 0{,}100 \cdot 70{,}09 \approx 7{,}01\,\text{g}$.

:::simboli
x | delež hidrata v ravnotežju | x = \dfrac{K_\text{hidr}}{1 + K_\text{hidr}} | – |
K_\text{hidr} | ravnotežna konstanta hidratacije | | – | voda je vključena v K
n | množina snovi | n = \dfrac{m}{M} | mol |
m | masa | m = n \cdot M | g |
M | molska masa | | g/mol |
:::
