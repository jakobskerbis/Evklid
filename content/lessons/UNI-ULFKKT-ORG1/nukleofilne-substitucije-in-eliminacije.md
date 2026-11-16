---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Maja zbira stare vinilne plošče in opazi, da je prozorna barvna plošča, ki je leta stala na soncu ob oknu, porumenela. Plošče so iz PVC, polimera z atomom klora na vsakem drugem ogljiku verige. Toplota in svetloba iz verige počasi odcepljata $\mathrm{HCl}$, nastajajo dvojne vezi $\mathrm{C{=}C}$ in z njimi rumena barva: to je **eliminacija**. Vez $\mathrm{C{-}X}$ pa lahko tudi zamenja partnerja. 1-bromobutan z raztopino $\mathrm{NaOH}$ da butan-1-ol, ker brom zamenja skupina $\mathrm{OH}$; 2-bromo-2-metilpropan z istim reagentom ob segrevanju pa da večinoma plin 2-metilpropen. Reagent je enak, produkt pa povsem druge vrste.

Razlog je v tem, da haloalkan lahko reagira na štiri načine: z dvema substitucijama ($\mathrm{S_N1}$, $\mathrm{S_N2}$) in dvema eliminacijama ($\mathrm{E1}$, $\mathrm{E2}$). Kateri prevlada, določajo zgradba substrata, reagent, topilo in temperatura. Ko te mehanizme razumeš, znaš načrtovati sintezo alkoholov, etrov, nitrilov in alkenov in napovedati njihovo stereokemijo.

## Razlaga

### Izhodiščni primer

Vzemi substrata iz uvoda: 1-bromobutan in 2-bromo-2-metilpropan, oba z $\mathrm{NaOH}$. Prvi da alkohol, drugi alken. Na koncu razlage boš oba izida napovedal z eno tabelo; do tja potrebuješ igralce, štiri mehanizme in pravilo izbire.

### Igralci

V haloalkanu $\mathrm{R{-}X}$ je vez $\mathrm{C{-}X}$ polarna: ogljik je delno pozitiven ($\delta+$). Ta ogljik imenujemo **ogljik $\alpha$**, sosednje ogljike **ogljiki $\beta$**.

- **Nukleofil** ($\mathrm{Nu^-}$ ali $\mathrm{Nu{:}}$) ima prost elektronski par in napade ogljik $\delta+$. Primeri: $\mathrm{OH^-}$, $\mathrm{CH_3O^-}$, $\mathrm{CN^-}$, $\mathrm{I^-}$, $\mathrm{H_2O}$.
- **Izstopajoča skupina** $\mathrm{X}$ odide z elektronskim parom vezi.
- **Baza** je isti delec v drugi vlogi: namesto ogljika napade vodik na ogljiku $\beta$.

Pri **substituciji** nukleofil zamenja izstopajočo skupino. Pri **eliminaciji** odideta $\mathrm{H}$ z ogljika $\beta$ in $\mathrm{X}$ z ogljika $\alpha$, nastane dvojna vez $\mathrm{C{=}C}$. Eliminacija je obratna reakcija adicije, ki jo že poznaš.

Natančno: **nukleofilna substitucija** na nasičenem ogljiku je reakcija $\mathrm{R{-}X + Nu^- \to R{-}Nu + X^-}$ (z nevtralnim $\mathrm{Nu{:}}$ nastane $\mathrm{R{-}Nu^+}$), pri kateri nukleofil tvori novo vez z ogljikom $\alpha$ z lastnim elektronskim parom, $\mathrm{X}$ pa odide z elektronskim parom stare vezi. **$\beta$-eliminacija** (1,2-eliminacija) je reakcija $\mathrm{H{-}C_\beta{-}C_\alpha{-}X + B^- \to C_\beta{=}C_\alpha + HB + X^-}$. Številka v imenu mehanizma ($\mathrm{S_N1}$, $\mathrm{E2}$) je **molekularnost** koraka, ki določa hitrost: število delcev, ki v tem koraku tvorijo prehodno stanje. Korak, ki določa hitrost, je najpočasnejši korak mehanizma; hitreje od njega reakcija ne more poteči.

### Dobra izstopajoča skupina je šibka baza

Ko odide, mora stabilno nositi negativni naboj. Vrstni red: $\mathrm{I^-} > \mathrm{Br^-} > \mathrm{Cl^-} \gg \mathrm{F^-}$. Skupina $\mathrm{OH^-}$ je močna baza in slaba izstopajoča skupina. Zato alkohol reagira šele v kislem: protonirani $\mathrm{R{-}OH_2^+}$ odda nevtralno vodo, ki je odlična izstopajoča skupina.

### Mehanizem $\mathrm{S_N2}$: hrbtni napad

Ime pomeni substitucijo, nukleofilno, bimolekularno. Reakcija poteče v **enem koraku**. Nukleofil napade ogljik $\alpha$ **s hrbtne strani**, nasproti izstopajoče skupine. V prehodnem stanju sta $\mathrm{Nu}$ in $\mathrm{X}$ delno vezana, ostale tri skupine pa ležijo v ravnini. Nato se skupine prevesijo kot dežnik v vetru: nastane **inverzija konfiguracije** (Waldnova inverzija).

V koraku sodelujeta dve molekuli, zato je hitrost odvisna od obeh koncentracij:

$$v = k\,[\mathrm{RX}]\,[\mathrm{Nu}]$$

Če je nukleofil v velikem prebitku ($[\mathrm{Nu}]_0 \gg [\mathrm{RX}]_0$), se njegova koncentracija med reakcijo skoraj ne spremeni. Tedaj je $v = k'[\mathrm{RX}]$ s $k' = k[\mathrm{Nu}]_0$: reakcija je **psevdo prvega reda**.

Hrbtni napad ovirajo velike skupine na ogljiku $\alpha$. Hitrost $\mathrm{S_N2}$ pada: metil $>$ 1° $>$ 2° $\gg$ 3° (terciarni praktično ne reagira). Pospešijo jo močan nukleofil in **polarna aprotična topila** (aceton, DMSO, DMF), ki nukleofila ne obdajo z vodikovimi vezmi.

### Mehanizem $\mathrm{S_N1}$: prek karbokationa

Unimolekularna substitucija poteče v **dveh korakih**:

1. Počasi: vez $\mathrm{C{-}X}$ se sama heterolitsko pretrga, nastane karbokation in $\mathrm{X^-}$.
2. Hitro: nukleofil napade ravninski karbokation.

Najpočasnejši korak vsebuje samo substrat, zato:

$$v = k\,[\mathrm{RX}]$$

Hitrost ni odvisna od koncentracije nukleofila.

**Izpeljava.** Naj bo mehanizem $\mathrm{RX} \rightleftharpoons \mathrm{R^+} + \mathrm{X^-}$ (konstanti $k_1$, $k_{-1}$) in $\mathrm{R^+} + \mathrm{Nu^-} \to \mathrm{RNu}$ ($k_2$). Karbokation je zelo reaktiven, zato zanj velja približek stacionarnega stanja: $\mathrm{d}[\mathrm{R^+}]/\mathrm{d}t = k_1[\mathrm{RX}] - k_{-1}[\mathrm{R^+}][\mathrm{X^-}] - k_2[\mathrm{R^+}][\mathrm{Nu}] = 0$. Od tod $[\mathrm{R^+}] = k_1[\mathrm{RX}]/(k_{-1}[\mathrm{X^-}] + k_2[\mathrm{Nu}])$ in

$$v = k_2[\mathrm{R^+}][\mathrm{Nu}] = \frac{k_1 k_2[\mathrm{RX}][\mathrm{Nu}]}{k_{-1}[\mathrm{X^-}] + k_2[\mathrm{Nu}]}.$$

Če je $k_2[\mathrm{Nu}] \gg k_{-1}[\mathrm{X^-}]$ (kation ujame nukleofil prej, kot se vrne v $\mathrm{RX}$), se ulomek skrajša v $v = k_1[\mathrm{RX}]$. Hitrostni zakon je z mehanizmom skladen, sam pa ga ne dokazuje.

**Kinetika prvega reda.** Iz $-\mathrm{d}[\mathrm{RX}]/\mathrm{d}t = k[\mathrm{RX}]$ z integracijo dobiš $\ln([\mathrm{RX}]_0/[\mathrm{RX}]) = kt$. Pri $[\mathrm{RX}] = [\mathrm{RX}]_0/2$ je razpolovni čas $t_{1/2} = \ln 2/k$, neodvisen od začetne koncentracije.

Ker poteka prek karbokationa, velja vrstni red stabilnosti iz adicij: 3° $>$ 2° $\gg$ 1°. Zakaj stabilnost vmesnega delca vpliva na hitrost, pove **Hammondov postulat**: prehodno stanje endotermnega koraka je po zgradbi in energiji podobno produktu tega koraka, tu karbokationu; kar stabilizira kation, zniža aktivacijsko energijo ionizacije.

Nukleofil napade ravninski kation z obeh strani, zato iz kiralnega substrata nastane (skoraj) **racemat**. Možne so premestitve karbokationa. $\mathrm{S_N1}$ pospešijo **polarna protična topila** (voda, alkoholi), ki ione stabilizirajo. Pogosto je topilo kar nukleofil; taki reakciji rečemo **solvoliza**.

:::premisli
Ne veš, ali substrat reagira po $\mathrm{S_N2}$ ali po $\mathrm{S_N1}$. Načrtuj en sam poskus s koncentracijo nukleofila, ki ju loči: kaj spremeniš in kaj pričakuješ pri vsakem mehanizmu?
---
Podvojiš $[\mathrm{Nu}]$, vse drugo pustiš enako, in izmeriš začetno hitrost. Pri $\mathrm{S_N2}$ se hitrost podvoji, ker je $[\mathrm{Nu}]$ v hitrostnem zakonu. Pri $\mathrm{S_N1}$ ostane enaka: nukleofil sodeluje šele v hitrem drugem koraku, hitrost pa določa počasna ionizacija.
:::

### Mehanizem $\mathrm{E2}$

En korak: baza odtrga $\mathrm{H}$ z ogljika $\beta$, elektroni vezi $\mathrm{C{-}H}$ tvorijo vez $\pi$, $\mathrm{X}$ hkrati odide. Hitrost je $v = k\,[\mathrm{RX}]\,[\mathrm{B}]$. Vodik in izstopajoča skupina morata biti **antiperiplanarna**: v isti ravnini, na nasprotnih straneh vezi $\mathrm{C{-}C}$. E2 pospešijo močne baze ($\mathrm{CH_3CH_2O^-}$, $\mathrm{OH^-}$, $\mathrm{(CH_3)_3CO^-}$) in višja temperatura.

Če je na voljo več ogljikov $\beta$, nastane več alkenov. **Zajcevo pravilo:** če lahko pri eliminaciji nastane več konstitucijsko izomernih alkenov, prevlada bolj substituiran alken, ker je termodinamsko stabilnejši; to velja za majhne baze in kadar je antiperiplanarna lega mogoča za več vodikov $\beta$. Izjema je velika baza, npr. kalijev *terc*-butoksid $\mathrm{(CH_3)_3COK}$: težko doseže notranji vodik in odtrga končnega, zato nastane manj substituiran alken (**Hofmannov produkt**).

### Mehanizem $\mathrm{E1}$

Prvi korak je enak kot pri $\mathrm{S_N1}$: nastane karbokation. Nato šibka baza (pogosto topilo) odtrga $\mathrm{H}$ z ogljika $\beta$. Hitrost je $v = k\,[\mathrm{RX}]$. $\mathrm{E1}$ in $\mathrm{S_N1}$ vedno tekmujeta, ker imata skupni vmesni delec. Višja temperatura premakne razmerje proti eliminaciji. Velja Zajcevo pravilo.

:::premisli
Zakaj višja temperatura pospešuje eliminacijo bolj kot substitucijo? Preštej delce na levi in desni.
---
Pri eliminaciji iz dveh delcev ($\mathrm{RX}$ in baza) nastanejo trije (alken, $\mathrm{HB}$, $\mathrm{X^-}$), pri substituciji iz dveh dva. Eliminacija poveča entropijo ($\Delta S > 0$), člen $-T\Delta S$ v $\Delta G$ pa je z višjo temperaturo vedno bolj negativen.
:::

### Štirje mehanizmi v eni tabeli

| mehanizem | hitrostni zakon | stereokemija | tipičen substrat |
|---|---|---|---|
| $\mathrm{S_N2}$ | $k[\mathrm{RX}][\mathrm{Nu}]$ | inverzija | metil, 1°, 2° |
| $\mathrm{S_N1}$ | $k[\mathrm{RX}]$ | racemizacija | 3°, 2° |
| $\mathrm{E2}$ | $k[\mathrm{RX}][\mathrm{B}]$ | anti H in X | 3°, 2°, 1° z veliko bazo |
| $\mathrm{E1}$ | $k[\mathrm{RX}]$ | ni stereospecifična (Zajcev) | 3°, 2° |

### Kako se odločiš

Najprej poglej substrat, nato reagent:

| substrat | močan Nu, šibka baza ($\mathrm{I^-}$, $\mathrm{CN^-}$) | močna baza ($\mathrm{RO^-}$, $\mathrm{OH^-}$) | šibek Nu/baza ($\mathrm{H_2O}$, $\mathrm{ROH}$) |
|---|---|---|---|
| metil, 1° | $\mathrm{S_N2}$ | $\mathrm{S_N2}$ (velika baza: E2) | počasi ali nič |
| 2° | $\mathrm{S_N2}$ | večinoma $\mathrm{E2}$ | $\mathrm{S_N1}$ + $\mathrm{E1}$ |
| 3° | $\mathrm{S_N1}$ | $\mathrm{E2}$ | $\mathrm{S_N1}$ + $\mathrm{E1}$ |

Pri terciarnem substratu $\mathrm{S_N2}$ nikoli ne poteče. Pri primarnem karbokation ne nastane, zato $\mathrm{S_N1}$ in $\mathrm{E1}$ odpadeta.

Zdaj še izhodiščni primer. Kakšen je 1-bromobutan? Primaren. Kakšen reagent je $\mathrm{OH^-}$? Močna, a majhna baza. Tabela da $\mathrm{S_N2}$, zato nastane butan-1-ol. In 2-bromo-2-metilpropan? Terciaren, hrbtna stran je zaprta, z močno bazo ostane E2, ob segrevanju še toliko bolj. Nastane 2-metilpropen.

## Rešeni primeri

### Primer 1 (lažji): hitrost $\mathrm{S_N2}$

Bromometan reagira z $\mathrm{OH^-}$ po mehanizmu $\mathrm{S_N2}$. Hitrostna konstanta je $k = 3{,}0 \cdot 10^{-4}\,\mathrm{L\,mol^{-1}\,s^{-1}}$, $[\mathrm{CH_3Br}] = 0{,}10\,\mathrm{mol/L}$, $[\mathrm{OH^-}] = 0{,}20\,\mathrm{mol/L}$. Kolikšna je začetna hitrost? Kolikšna bi bila, če bi $[\mathrm{OH^-}]$ podvojili?

**Podatki:** $k = 3{,}0 \cdot 10^{-4}\,\mathrm{L\,mol^{-1}\,s^{-1}}$, $[\mathrm{CH_3Br}] = 0{,}10\,\mathrm{mol/L}$, $[\mathrm{OH^-}] = 0{,}20\,\mathrm{mol/L}$, nato $[\mathrm{OH^-}] = 0{,}40\,\mathrm{mol/L}$
**Iščemo:** hitrost $v$ v obeh primerih

:::formula
$v = k\,[\mathrm{RX}]\,[\mathrm{Nu}]$
:::

**Rešitev:**

1. Metilni substrat in močan nukleofil: mehanizem je $\mathrm{S_N2}$, hitrostni zakon je drugega reda.
2. $v = 3{,}0 \cdot 10^{-4} \cdot 0{,}10 \cdot 0{,}20 = 6{,}0 \cdot 10^{-6}$, torej $v = 6{,}0 \cdot 10^{-6}\,\mathrm{mol\,L^{-1}\,s^{-1}}$.
3. Pri dvakratni $[\mathrm{OH^-}]$: $v = 3{,}0 \cdot 10^{-4} \cdot 0{,}10 \cdot 0{,}40 = 1{,}2 \cdot 10^{-5}$, torej $1{,}2 \cdot 10^{-5}\,\mathrm{mol\,L^{-1}\,s^{-1}}$.
4. Odgovor: začetna hitrost je $6{,}0 \cdot 10^{-6}\,\mathrm{mol\,L^{-1}\,s^{-1}}$; z dvakrat več $\mathrm{OH^-}$ se podvoji na $1{,}2 \cdot 10^{-5}\,\mathrm{mol\,L^{-1}\,s^{-1}}$.

### Primer 2: produkt s stereokemijo

(*R*)-2-bromobutan segrevamo z $\mathrm{NaCN}$ v DMSO. Kateri produkt nastane in kakšna je njegova konfiguracija?

**Podatki:** substrat (*R*)-$\mathrm{CH_3CHBrCH_2CH_3}$ (sekundarni); nukleofil $\mathrm{CN^-}$ (močan nukleofil, šibka baza); topilo DMSO (polarno aprotično)
**Iščemo:** mehanizem, produkt, konfiguracija

:::formula
2° substrat + močan Nu, šibka baza + aprotično topilo $\Rightarrow \mathrm{S_N2}$, inverzija. Nato prioritete po CIP.
:::

**Rešitev:**

1. Substrat je sekundaren, $\mathrm{CN^-}$ je močan nukleofil in šibka baza, DMSO pospešuje $\mathrm{S_N2}$. Mehanizem: $\mathrm{S_N2}$.
2. Produkt: $\mathrm{CH_3CH(CN)CH_2CH_3}$. Glavna veriga vsebuje ogljik nitrila (C1), zato je ime 2-metilbutannitril.
3. Hrbtni napad obrne prostorsko razporeditev: $\mathrm{CN}$ zasede mesto nasproti nekdanjega $\mathrm{Br}$.
4. Prioritete v produktu: $\mathrm{CN}$ (ogljik z $(\mathrm{N,N,N})$) $>$ $\mathrm{CH_2CH_3}$ $(\mathrm{C,H,H})$ $>$ $\mathrm{CH_3}$ $>$ $\mathrm{H}$. $\mathrm{CN}$ ima prvo prioriteto kot prej $\mathrm{Br}$, zato se z inverzijo geometrije obrne tudi oznaka.
5. Odgovor: nastane (*S*)-2-metilbutannitril. Oznaka se obrne le zato, ker ima $\mathrm{CN}$ enako prioriteto kot prej $\mathrm{Br}$.

### Primer 3 (težji): en substrat, trije pogoji in kinetika

2-bromo-2-metilbutan $\mathrm{(CH_3)_2CBrCH_2CH_3}$ reagira (a) z $\mathrm{NaOCH_2CH_3}$ v etanolu ob segrevanju, (b) s $\mathrm{(CH_3)_3COK}$ v *terc*-butanolu, (c) v samem etanolu pri $25\,°\mathrm{C}$. Napovej glavni produkt. (d) Pri pogoju (c) je konstanta hitrosti porabe substrata $k = 1{,}4 \cdot 10^{-5}\,\mathrm{s^{-1}}$, v raztopini je $0{,}050\,\mathrm{mol}$ substrata, eter pa nastane iz $64\,\%$ zreagiranega substrata (ostalo so alkeni). Koliko časa traja, da zreagira $90\,\%$ substrata, koliko razpolovnih časov je to in koliko gramov etra ($M = 116{,}2\,\mathrm{g/mol}$) takrat nastane?

**Podatki:** terciarni substrat; ogljiki $\beta$: dva $\mathrm{CH_3}$ in en $\mathrm{CH_2}$; reagenti: (a) močna majhna baza, (b) močna velika baza, (c) šibek nukleofil in šibka baza (topilo); $k = 1{,}4 \cdot 10^{-5}\,\mathrm{s^{-1}}$, $n_0 = 0{,}050\,\mathrm{mol}$, pretvorba $90\,\%$, delež etra $64\,\%$, $M = 116{,}2\,\mathrm{g/mol}$
**Iščemo:** mehanizem in glavni produkt v (a), (b), (c); čas $t$, $t/t_{1/2}$ in masa etra $m$

:::formula
3° + močna baza $\Rightarrow$ E2 (Zajcev; velika baza: Hofmann). 3° + šibek Nu $\Rightarrow$ $\mathrm{S_N1}$ (+ E1). Prvi red: $\ln([\mathrm{RX}]_0/[\mathrm{RX}]) = kt$, $t_{1/2} = \ln 2/k$
:::

**Rešitev:**

1. Terciarni substrat: $\mathrm{S_N2}$ odpade v vseh treh primerih.
2. (a) Močna baza in toplota: E2. Odtrganje $\mathrm{H}$ s $\mathrm{CH_2}$ da $\mathrm{(CH_3)_2C{=}CHCH_3}$ (trisubstituiran), z $\mathrm{CH_3}$ pa $\mathrm{CH_2{=}C(CH_3)CH_2CH_3}$ (disubstituiran). Po Zajcevu prevlada **2-metilbut-2-en**.
3. (b) Velika baza: E2, a odtrga lažje dosegljiv vodik s $\mathrm{CH_3}$. Prevlada **2-metilbut-1-en** (Hofmannov produkt).
4. (c) Brez močne baze terciarni substrat počasi ionizira v terciarni karbokation: $\mathrm{S_N1}$. Etanol napade kation, po odcepu $\mathrm{H^+}$ nastane eter **2-etoksi-2-metilbutan**; ob njem nekaj alkenov po E1.
5. (d) Ionizacija določa hitrost, zato velja kinetika prvega reda. Pri $90\,\%$ pretvorbe je $[\mathrm{RX}]_0/[\mathrm{RX}] = 10$, torej $t = \ln 10/k = 2{,}303/(1{,}4 \cdot 10^{-5}\,\mathrm{s^{-1}}) = 1{,}64 \cdot 10^{5}\,\mathrm{s}$, kar je približno $45{,}7\,\mathrm{h}$.
6. Razpolovni čas: $t_{1/2} = 0{,}693/(1{,}4 \cdot 10^{-5}\,\mathrm{s^{-1}}) = 4{,}95 \cdot 10^{4}\,\mathrm{s}$ (približno $13{,}8\,\mathrm{h}$). Razmerje $t/t_{1/2} = \ln 10/\ln 2 = 3{,}32$, neodvisno od $k$.
7. Zreagira $0{,}90 \cdot 0{,}050 = 0{,}045\,\mathrm{mol}$ substrata, eter pa nastane iz $0{,}64 \cdot 0{,}045 = 0{,}0288\,\mathrm{mol}$.
8. Masa etra: $m = nM = 0{,}0288 \cdot 116{,}2 = 3{,}35\,\mathrm{g}$.
9. Odgovor: (a) 2-metilbut-2-en, (b) 2-metilbut-1-en, (c) 2-etoksi-2-metilbutan; (d) $90\,\%$ substrata zreagira v približno $45{,}7\,\mathrm{h}$, kar je $3{,}32$ razpolovnega časa, in nastane $3{,}35\,\mathrm{g}$ etra.

### Primer 4 – zdaj ti

1-bromopropan segrevamo z $\mathrm{NaI}$ v acetonu. $\mathrm{NaBr}$ v acetonu ni topen in se izloča. Kateri mehanizem poteka in kaj nastane?

**Podatki:** substrat $\mathrm{CH_3CH_2CH_2Br}$ (primarni); reagent $\mathrm{I^-}$ (močan nukleofil, zelo šibka baza); topilo aceton (polarno aprotično); $\mathrm{NaBr}$ se obarja
**Iščemo:** mehanizem in produkt

:::formula
Tabela »Kako se odločiš«: substrat, nato reagent.
:::

**Rešitev:**

1. Substrat je primaren: karbokation ne nastane, $\mathrm{S_N1}$ in E1 odpadeta.
2. $\mathrm{I^-}$ je zelo šibka baza, zato E2 ne prevlada. Aceton je aprotičen.
3. Odloči sam, nato preveri:

:::premisli
Kateri mehanizem poteka, kateri je produkt in zakaj obarjanje $\mathrm{NaBr}$ pomaga?
---
$\mathrm{S_N2}$; nastane 1-jodopropan $\mathrm{CH_3CH_2CH_2I}$. $\mathrm{I^-}$ in $\mathrm{Br^-}$ sta podobno dobri izstopajoči skupini, zato bi se vzpostavilo ravnotežje. Ker se $\mathrm{NaBr}$ izloča, se ravnotežje pomika proti produktu (Le Chatelier). Reakciji rečemo Finkelsteinova reakcija.
:::

## Pogoste napake

- **»$\mathrm{OH}$ v alkoholu zamenjam kar z $\mathrm{Br^-}$.«** $\mathrm{OH^-}$ je močna baza in ne odide. Alkohol moraš najprej protonirati ($\mathrm{HBr}$, $\mathrm{H_2SO_4}$) ali pretvoriti v tozilat; tedaj odide voda.
- **»$\mathrm{S_N1}$ da inverzijo, $\mathrm{S_N2}$ racemat.«** Ravno obratno. $\mathrm{S_N2}$ ima en sam hrbtni napad (inverzija), pri $\mathrm{S_N1}$ pa nukleofil napade ravninski kation z obeh strani (racemat). Popravek: pomisli, ali obstaja ravninski vmesni delec.
- **»Terciarni substrat najhitreje reagira po $\mathrm{S_N2}$, ker tvori stabilen kation.«** Pri $\mathrm{S_N2}$ kation sploh ne nastane; odloča sterična ovira hrbtnega napada, ki je pri 3° prevelika. Stabilnost kationa je argument za $\mathrm{S_N1}$.
- **»Močnejši nukleofil pospeši $\mathrm{S_N1}$.«** Hitrost $\mathrm{S_N1}$ je $k[\mathrm{RX}]$, nukleofila v njej ni. Močan nukleofil (ki je pogosto tudi baza) prej preusmeri reakcijo v $\mathrm{S_N2}$ ali E2.
- **»Eliminacija vedno da najbolj substituiran alken.«** Velika baza da Hofmannov produkt. Pri obročih mora biti $\mathrm{H}$ antiperiplanaren, kar lahko onemogoči Zajcev produkt.

## Povzetek

- $\mathrm{R{-}X}$: ogljik $\alpha$ je elektrofil; dobra izstopajoča skupina je šibka baza ($\mathrm{I^-} > \mathrm{Br^-} > \mathrm{Cl^-}$; $\mathrm{OH}$ le protoniran).
- $\mathrm{S_N2}$: en korak, hrbtni napad, inverzija, $v = k[\mathrm{RX}][\mathrm{Nu}]$; metil $>$ 1° $>$ 2°, 3° ne; aprotična topila.
- $\mathrm{S_N1}$: prek karbokationa, racemizacija, možne premestitve, $v = k[\mathrm{RX}]$; 3° $>$ 2°; protična topila, solvoliza.
- $\mathrm{E2}$: en korak, močna baza, antiperiplanarna $\mathrm{H}$ in $\mathrm{X}$, $v = k[\mathrm{RX}][\mathrm{B}]$; Zajcev, z veliko bazo Hofmann.
- $\mathrm{E1}$: prek karbokationa, tekmuje s $\mathrm{S_N1}$; toplota daje prednost eliminaciji.
- Odločanje: najprej substrat (metil/1°/2°/3°), nato reagent (nukleofil ali baza, močan ali šibek), nato topilo in temperatura.

## Za izpit

Znati moraš povedati:

- natančne definicije nukleofila, baze, izstopajoče skupine, nukleofilne substitucije in $\beta$-eliminacije ter pomen številk 1 in 2 (molekularnost koraka, ki določa hitrost);
- hitrostne zakone vseh štirih mehanizmov in izpeljavo $v = k_1[\mathrm{RX}]$ za $\mathrm{S_N1}$ iz približka stacionarnega stanja s pogojem $k_2[\mathrm{Nu}] \gg k_{-1}[\mathrm{X^-}]$;
- integrirani zakon prvega reda, $t_{1/2} = \ln 2/k$ in psevdo prvi red $k' = k[\mathrm{Nu}]_0$ pri prebitku nukleofila;
- stereokemijski izid: inverzija pri $\mathrm{S_N2}$ (z dokazom), racemizacija pri $\mathrm{S_N1}$, antiperiplanarna lega pri E2;
- Zajcevo pravilo z vsemi pogoji in obe izjemi (velika baza, obroči).

### Naloga 1

1-bromobutan ($[\mathrm{RX}]_0 = 0{,}020\,\mathrm{mol/L}$) reagira z $\mathrm{NaCN}$ ($[\mathrm{CN^-}]_0 = 0{,}50\,\mathrm{mol/L}$) v DMSO, $k = 4{,}0 \cdot 10^{-3}\,\mathrm{L\,mol^{-1}\,s^{-1}}$. (a) Določi mehanizem in produkt. (b) Utemelji, da je reakcija psevdo prvega reda, in izračunaj $k'$. (c) V kolikšnem času zreagira $99\,\%$ 1-bromobutana? (d) Koliko časa bi za enako pretvorbo potrebovali, če bi bila $[\mathrm{CN^-}]_0 = 0{,}020\,\mathrm{mol/L}$?

**Rešitev:**

1. (a) Primaren substrat, močan nukleofil in šibka baza, aprotično topilo: $\mathrm{S_N2}$. Nastane pentannitril $\mathrm{CH_3CH_2CH_2CH_2CN}$.
2. (b) Tudi ob popolni pretvorbi se $[\mathrm{CN^-}]$ zmanjša le za $0{,}020/0{,}50 = 0{,}04$, torej za $4\,\%$; zato je $[\mathrm{CN^-}] \approx [\mathrm{CN^-}]_0$ in $v = k'[\mathrm{RX}]$.
3. $k' = k[\mathrm{CN^-}]_0 = 4{,}0 \cdot 10^{-3} \cdot 0{,}50 = 2{,}0 \cdot 10^{-3}\,\mathrm{s^{-1}}$.
4. (c) Pri $99\,\%$ pretvorbe je $[\mathrm{RX}]_0/[\mathrm{RX}] = 100$, zato $t = \ln 100/k' = 4{,}605/(2{,}0 \cdot 10^{-3}\,\mathrm{s^{-1}}) = 2303\,\mathrm{s}$, približno $38\,\mathrm{min}$.
5. (d) Pri enakih začetnih koncentracijah in stehiometriji 1 : 1 velja $[\mathrm{CN^-}] = [\mathrm{RX}]$ ves čas, zato $-\mathrm{d}[\mathrm{RX}]/\mathrm{d}t = k[\mathrm{RX}]^2$. Integracija da $1/[\mathrm{RX}] - 1/[\mathrm{RX}]_0 = kt$.
6. Pri $[\mathrm{RX}] = 0{,}01[\mathrm{RX}]_0$ je leva stran $99/[\mathrm{RX}]_0$, torej $t = 99/(k[\mathrm{RX}]_0) = 99/(4{,}0 \cdot 10^{-3} \cdot 0{,}020) = 1{,}24 \cdot 10^{6}\,\mathrm{s}$, približno $14\,$dni.
7. Odgovor: $\mathrm{S_N2}$ do pentannitrila; $k' = 2{,}0 \cdot 10^{-3}\,\mathrm{s^{-1}}$; $99\,\%$ zreagira v približno $38\,\mathrm{min}$, brez prebitka cianida pa šele v približno $14$ dneh.

### Naloga 2

Optično čisti (*R*)-2-jodooktan raztopimo v acetonu z $\mathrm{Na{}^{128}I}$ (radioaktivni jodid). Izpelji, kolikšno je razmerje med začetno hitrostjo izgubljanja optične aktivnosti in začetno hitrostjo vgrajevanja radioaktivnega joda, če vsaka zamenjava poteče (i) z inverzijo, (ii) z racemizacijo. Izmerjeno razmerje je $2{,}0$. Kaj to dokazuje?

**Rešitev:**

1. Optična aktivnost je sorazmerna s presežkom enantiomera, $n_R - n_S$. Naj v času $\mathrm{d}t$ zamenja jod $\mathrm{d}n$ molekul; hitrost vgrajevanja je $\mathrm{d}n/\mathrm{d}t$. Na začetku so vse molekule (*R*).
2. (i) Inverzija: vsaka zamenjava naredi iz (*R*) molekulo (*S*). Torej $\mathrm{d}n_R = -\mathrm{d}n$, $\mathrm{d}n_S = +\mathrm{d}n$ in $\mathrm{d}(n_R - n_S) = -2\,\mathrm{d}n$. Razmerje hitrosti je $2$.
3. (ii) Racemizacija: zamenjana molekula je s 50 % verjetnostjo (*R*) ali (*S*). Torej $\mathrm{d}n_R = -\mathrm{d}n + \mathrm{d}n/2$, $\mathrm{d}n_S = +\mathrm{d}n/2$ in $\mathrm{d}(n_R - n_S) = -\mathrm{d}n$. Razmerje je $1$.
4. Izmerjeno razmerje $2{,}0$ ustreza (i): vsaka posamezna zamenjava poteče z inverzijo. To je skladno le s hrbtnim napadom v enem koraku ($\mathrm{S_N2}$); prosti ravninski karbokation bi dal razmerje $1$.

## Drugače: Na sliki

Ogljik $\alpha$ je sredina dežnika, substituenti so žice, izstopajoča skupina ročaj.

- **$\mathrm{S_N2}$:** nukleofil pride z vrha dežnika, nasproti ročaja. Ko ročaj odpade, veter dežnik obrne navzven. Žice zdaj kažejo na drugo stran: inverzija. Če je dežnik obdan s tremi velikimi skupinami (3°), nukleofil do vrha sploh ne pride.
- **$\mathrm{S_N1}$:** ročaj odpade sam, dežnik se zravna v ploščo (ravninski kation). Nukleofil pride od spodaj ali od zgoraj z enako verjetnostjo.
- **$\mathrm{E2}$:** gledaš vzdolž vezi $\mathrm{C_\alpha{-}C_\beta}$ (Newmanova projekcija). $\mathrm{X}$ kaže navzgor, $\mathrm{H}$ na zadnjem ogljiku navzdol. Le v tej legi elektroni vezi $\mathrm{C{-}H}$ zdrsnejo v vez $\pi$, ko $\mathrm{X}$ odide.

## Drugače: Korak za korakom s številkami

Kako s hitrostjo ločiš $\mathrm{S_N1}$ od $\mathrm{S_N2}$? Merimo začetno hitrost pri treh poskusih z 2-bromo-2-metilpropanom in razredčenim $\mathrm{OH^-}$ v mešanici acetona in vode pri sobni temperaturi, $k = 1{,}2 \cdot 10^{-5}\,\mathrm{s^{-1}}$. Pri tako nizki koncentraciji baze in brez segrevanja prevlada solvoliza, ne E2.

| poskus | $[\mathrm{RX}]$ / $\mathrm{mol\,L^{-1}}$ | $[\mathrm{OH^-}]$ / $\mathrm{mol\,L^{-1}}$ | $v$ / $\mathrm{mol\,L^{-1}\,s^{-1}}$ |
|---|---|---|---|
| 1 | $0{,}10$ | $0{,}10$ | $1{,}2 \cdot 10^{-6}$ |
| 2 | $0{,}10$ | $0{,}20$ | $1{,}2 \cdot 10^{-6}$ |
| 3 | $0{,}20$ | $0{,}10$ | $2{,}4 \cdot 10^{-6}$ |

Poskusa, ki ju primerjamo, se razlikujeta le v eni koncentraciji.

1. Poskus 1 → 2: $[\mathrm{OH^-}]$ podvojimo, hitrost ostane enaka. Hidroksid ni v hitrostnem zakonu.
2. Poskus 1 → 3: $[\mathrm{RX}]$ podvojimo, hitrost se podvoji. Reakcija je prvega reda glede na $\mathrm{RX}$.
3. Sklep: $v = k[\mathrm{RX}]$, mehanizem je $\mathrm{S_N1}$. Pri $\mathrm{S_N2}$ bi se hitrost podvojila že v poskusu 2.

## Drugače: Bolj natančno

**Energijski diagram.** $\mathrm{S_N2}$ ima en vrh (prehodno stanje) in nobene doline. $\mathrm{S_N1}$ ima dva vrha in vmes dolino (karbokation). Višji je prvi vrh, zato je ionizacija korak, ki določa hitrost; po Hammondovem postulatu je to prehodno stanje podobno karbokationu.

**Ionski pari.** $\mathrm{S_N1}$ redko da popoln racemat. Izstopajoči $\mathrm{X^-}$ nekaj časa ostane ob kationu (tesni ionski par) in zakriva eno stran, zato nastane rahel presežek produkta z inverzijo.

**Nukleofilnost in topilo.** V protičnih topilih je $\mathrm{I^-}$ boljši nukleofil od $\mathrm{F^-}$: majhen $\mathrm{F^-}$ je močno solvatiran z vodikovimi vezmi, velik $\mathrm{I^-}$ pa je bolj polarizabilen. V aprotičnih topilih (DMSO) je vrstni red obraten in sledi bazičnosti.

**Stereospecifičnost E2.** Iz (1*R*,2*R*)- in (1*R*,2*S*)-diastereomera 1-bromo-1,2-difenilpropana nastaneta različna geometrijska izomera alkena, ker antiperiplanarna lega postavi skupine na točno določeni strani nove dvojne vezi. Pri cikloheksanih morata biti $\mathrm{H}$ in $\mathrm{X}$ oba aksialna (*trans*-diaksialno).

## Preveri se

? Kateri je hitrostni zakon za $\mathrm{S_N2}$?
- $v = k[\mathrm{RX}]$
~ To je zakon za $\mathrm{S_N1}$ in E1, kjer v počasnem koraku sodeluje le substrat.
+ $v = k[\mathrm{RX}][\mathrm{Nu}]$
- $v = k[\mathrm{Nu}]$
~ Brez substrata ni reakcije; v enem samem koraku $\mathrm{S_N2}$ sodelujeta oba.
> V enem koraku $\mathrm{S_N2}$ trčita substrat in nukleofil, zato je hitrost sorazmerna z obema koncentracijama.

? Zakaj 2-bromo-2-metilpropan ne reagira po $\mathrm{S_N2}$?
- Ker je $\mathrm{Br^-}$ slaba izstopajoča skupina.
~ $\mathrm{Br^-}$ je dobra izstopajoča skupina; isti substrat hitro reagira po $\mathrm{S_N1}$.
- Ker tvori stabilen karbokation, ki zavira hrbtni napad.
~ Pri $\mathrm{S_N2}$ karbokation ne nastane. Stabilnost kationa je pomembna za $\mathrm{S_N1}$.
+ Ker tri metilne skupine zastirajo hrbtno stran ogljika $\alpha$.
> Hrbtni napad zahteva prost dostop do ogljika $\alpha$; pri terciarnem substratu ga sterično zaprejo tri alkilne skupine.

? Optično čisti (*S*)-3-bromo-3-metilheksan raztopimo v vodi. Kaj nastane?
- Le (*R*)-3-metilheksan-3-ol z inverzijo.
~ Inverzija je značilna za $\mathrm{S_N2}$. Terciarni substrat s šibkim nukleofilom reagira po $\mathrm{S_N1}$.
+ Skoraj racemna zmes (*R*)- in (*S*)-3-metilheksan-3-ola.
- Le (*S*)-3-metilheksan-3-ol z ohranitvijo konfiguracije.
~ Ohranitev bi pomenila napad le s sprednje strani; ravninski kation pa je dosegljiv z obeh strani.
> Terciarni substrat v vodi: $\mathrm{S_N1}$ prek ravninskega karbokationa, voda ga napade z obeh strani, nastane (skoraj) racemat.

? Kateri je glavni produkt 2-bromobutana z $\mathrm{NaOCH_2CH_3}$ v etanolu ob segrevanju?
- But-1-en
~ Tak, manj substituiran produkt prevlada z veliko bazo, npr. $\mathrm{(CH_3)_3CO^-}$. Etoksid je majhen.
+ But-2-en
- 2-etoksibutan
~ Pri sekundarnem substratu in močni bazi ob segrevanju prevlada E2, substitucija je stranska.
> Sekundarni substrat, močna majhna baza, toplota: E2 po Zajcevu da bolj substituiran but-2-en (večinoma *trans*).

? V kateri kombinaciji bo $\mathrm{S_N1}$ najhitrejša?
- 1-bromobutan v DMSO
~ Primarni substrat ne tvori stabilnega kationa, DMSO pa je aprotičen in pospešuje $\mathrm{S_N2}$.
- 2-kloro-2-metilpropan v heksanu
~ Nepolarno topilo ne stabilizira ionov, zato ionizacija skoraj ne poteče.
+ 2-bromo-2-metilpropan v mešanici vode in etanola
> Terciarni substrat, dobra izstopajoča skupina in polarno protično topilo: vse pospešuje nastanek karbokationa.

:::simboli
v | hitrost reakcije | v = k\,[\mathrm{RX}]\,[\mathrm{Nu}] | mol/(L s) | velja za SN2; pri SN1 in E1 v = k[RX]
k | konstanta hitrosti | | | pri SN2 v L/(mol s), pri SN1 v 1/s
t | čas reakcije | \ln([\mathrm{RX}]_0/[\mathrm{RX}]) = kt | s | za reakcijo prvega reda
t_{1/2} | razpolovni čas | t_{1/2} = \ln 2/k | s | pri prvem redu neodvisen od začetne koncentracije
:::
