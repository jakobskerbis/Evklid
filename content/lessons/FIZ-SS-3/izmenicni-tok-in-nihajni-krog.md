---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na dnu kuhalnika za vodo piše »$230\,\mathrm{V}$, $50\,\mathrm{Hz}$, $2000\,\mathrm{W}$«. Prva številka je znana: napetost v vtičnici. Druga pa je čudna. Če je napetost stalna, zakaj bi imela frekvenco?

Ker ni stalna. Napetost v vtičnici se v eni sekundi $50$-krat zaniha od $+325\,\mathrm{V}$ do $-325\,\mathrm{V}$ in nazaj. Kuhalnik kljub temu greje, kot da bi bil na stalnih $230\,\mathrm{V}$. Danes izveš, od kod $325$, zakaj na nalepki vseeno piše $230$ in kako krog iz tuljave in kondenzatorja v indukcijski kuhalni plošči sam od sebe niha s točno določeno frekvenco.

## Razlaga

**1. Od kod pride izmenična napetost.** Iz lekcije o indukciji veš, da se v tuljavi inducira napetost, kadar se spreminja magnetni pretok skoznjo. V elektrarni generator vrti tuljavo v magnetnem polju z enakomerno hitrostjo. Pretok se zato spreminja sinusno in tudi inducirana napetost je sinusna:

$$U = U_0 \sin(\omega t)$$

Največjo vrednost $U_0$ imenujemo **temenska napetost**. Količina $\omega$ je **krožna frekvenca**, $\omega = 2\pi\nu$, kjer je $\nu$ **frekvenca**, število nihajev v sekundi. En cel nihaj traja **nihajni čas** $t_0 = \dfrac{1}{\nu}$.

*Preizkus:* kolikšen je nihajni čas pri $50\,\mathrm{Hz}$? *($t_0 = 0{,}02\,\mathrm{s} = 20\,\mathrm{ms}$.)*

**2. Izmenični tok.** Grelec je upornik z uporom $R$. Ohmov zakon velja v vsakem trenutku, zato je tudi tok sinusen in doseže vrh hkrati z napetostjo: $I = I_0 \sin(\omega t)$ s temenskim tokom $I_0 = \dfrac{U_0}{R}$. Ko je napetost negativna, teče tok v drugo smer. Tak tok imenujemo **izmenični tok**.

*Preizkus:* kolikokrat v sekundi zamenja tok pri $50\,\mathrm{Hz}$ smer? *($100$-krat: dvakrat v vsakem nihaju.)*

**3. Moč niha, a nikoli ni negativna.** Moč na grelcu je produkt napetosti in toka, $P = U I$. Ko sta oba negativna, je produkt pozitiven. Grelec se torej greje v obeh polovicah nihaja, moč niha med $0$ in največjo vrednostjo $P_0 = U_0 I_0$. Graf moči je »grbast«: same grbe nad osjo, dve na vsak nihaj napetosti.

Povprečje teh grb je natanko polovica vrha (zakaj ravno polovica, pokaže risba v razdelku »Drugače: Na sliki«):

$$\bar P = \frac{P_0}{2}$$

:::premisli
Sošolec trdi: »Povprečna napetost v vtičnici je v enem nihaju nič, saj je pozitivni del enako velik kot negativni. Kuhalnik bi zato v povprečju moral greti nič.« Kje se moti?
---
Ker je za segrevanje pomembna moč, ne napetost. Moč je $P = U I = \dfrac{U^2}{R}$, kvadrat pa je vedno pozitiven. Pozitivni in negativni del napetosti se pri moči ne odštejeta, ampak se seštejeta.
:::

**4. Efektivna vrednost.** Kolikšna stalna (enosmerna) napetost bi na istem grelcu dala enako povprečno moč? To napetost imenujemo **efektivna napetost** $U_{\mathrm{ef}}$. Zahtevamo $\dfrac{U_{\mathrm{ef}}^2}{R} = \dfrac{1}{2}\cdot\dfrac{U_0^2}{R}$ in dobimo:

$$U_{\mathrm{ef}} = \frac{U_0}{\sqrt{2}}$$

Enako velja za tok, $I_{\mathrm{ef}} = \dfrac{I_0}{\sqrt{2}}$, povprečna moč pa je $\bar P = U_{\mathrm{ef}} I_{\mathrm{ef}}$. Na nalepkah in v omrežju so vedno zapisane efektivne vrednosti. »$230\,\mathrm{V}$« je torej efektivna napetost, temenska pa je $230\,\mathrm{V}\cdot\sqrt{2} \approx 325\,\mathrm{V}$.

*Preizkus:* $\sqrt{2} \approx 1{,}41$. Je efektivna napetost večja ali manjša od temenske? *(Manjša, približno $71\,\%$ temenske.)*

V simulaciji spodaj, »Izmenična napetost in efektivna vrednost«, nastavi temensko napetost na $325\,\mathrm{V}$. Opazuj, kje leži črtkana črta $U_{\mathrm{ef}}$ in da je povprečna moč na spodnjem grafu točno na polovici višine grb. Preden spremeniš frekvenco, napovej, kaj se zgodi s povprečno močjo. Nato preveri: grbe se zgostijo, povprečna moč pa ostane enaka.

**5. Nihajni krog.** Doslej je naboje poganjal generator. Ali lahko tok niha tudi sam od sebe? Lahko. Kondenzator s **kapaciteto** $C$ (enota farad, $\mathrm{F}$) nabijemo in ga vežemo na tuljavo z **induktivnostjo** $L$ (enota henri, $\mathrm{H}$). Induktivnost pove, kako močno se tuljava upira spremembi toka. Takemu krogu pravimo **električni nihajni krog**.

Kaj se zgodi? Kondenzator se začne prazniti skozi tuljavo. Tok ne more skočiti takoj na največjo vrednost, ker ga inducirana napetost v tuljavi zavira. Ko je kondenzator prazen, tok ne more takoj pasti na nič, ker ga inducirana napetost zdaj poganja naprej. Tok zato kondenzator nabije v nasprotno smer. Nato vse poteka nazaj.

*Preizkus:* kje je energija v trenutku, ko je kondenzator prazen? *(V magnetnem polju tuljave, ki ga ustvarja največji tok.)*

**6. Ena perioda v štirih korakih.** Energija se pretaka med električnim poljem kondenzatorja in magnetnim poljem tuljave, kot se pri gugalnici pretaka med višino in hitrostjo:

| trenutek | naboj na kondenzatorju | tok | kje je energija |
|---|---|---|---|
| $0$ | največji, zgornja plošča $+$ | $0$ | v kondenzatorju |
| $\frac{1}{4}t_0$ | $0$ | največji | v tuljavi |
| $\frac{1}{2}t_0$ | največji, zgornja plošča $-$ | $0$ | v kondenzatorju |
| $\frac{3}{4}t_0$ | $0$ | največji, v drugo smer | v tuljavi |

Po celem nihajnem času $t_0$ je krog spet v začetnem stanju.

**7. Lastna frekvenca.** Večji kondenzator sprejme več naboja, zato se dlje prazni. Večja induktivnost tok bolj zavira, zato se vse dogaja počasneje. Nihajni čas raste z obema, a počasneje: s korenom produkta $LC$. To pove **Thomsonova enačba**:

$$t_0 = 2\pi\sqrt{LC}$$

Frekvenco, s katero krog niha sam od sebe, imenujemo **lastna frekvenca**:

$$\nu_0 = \frac{1}{2\pi\sqrt{LC}}$$

:::premisli
Kapaciteto kondenzatorja povečamo štirikrat, tuljava ostane ista. Kaj se zgodi z lastno frekvenco? Napovej, nato preveri v simulaciji »Električni nihajni krog«.
---
Lastna frekvenca se razpolovi. Produkt $LC$ je štirikrat večji, njegov koren pa le dvakrat ($\sqrt{4} = 2$). Nihajni čas se zato podvoji, frekvenca pa razpolovi.
:::

Pravi krog ima tudi upor žic. Na njem se v vsakem nihaju del energije pretvori v toploto, zato nihanje počasi zamre. V indukcijski plošči elektronika krogu ves čas dovaja energijo in nihanje vzdržuje.

## Rešeni primeri

### Primer 1 (lažji): omrežna napetost

V kuhinjski vtičnici je izmenična napetost z efektivno vrednostjo $230\,\mathrm{V}$ in frekvenco $50\,\mathrm{Hz}$. Kolikšna je temenska napetost in koliko časa traja en nihaj?

**Podatki:** $U_{\mathrm{ef}} = 230\,\mathrm{V}$, $\nu = 50\,\mathrm{Hz}$
**Iščemo:** temensko napetost $U_0$ in nihajni čas $t_0$

:::formula
$U_0 = \sqrt{2}\, U_{\mathrm{ef}}$ in $t_0 = \dfrac{1}{\nu}$
:::

**Rešitev:**

1. Temenska napetost je $\sqrt{2}$-krat večja od efektivne, saj efektivno dobimo z deljenjem s $\sqrt{2}$: $U_0 = 1{,}414 \cdot 230\,\mathrm{V} \approx 325\,\mathrm{V}$.
2. Nihajni čas je obratna vrednost frekvence: $t_0 = \dfrac{1}{50\,\mathrm{Hz}} = 0{,}02\,\mathrm{s}$.
3. Odgovor: napetost v vtičnici niha med $+325\,\mathrm{V}$ in $-325\,\mathrm{V}$, en nihaj traja $20\,\mathrm{ms}$.

### Primer 2: kuhalna plošča

Električna kuhalna plošča ima moč $1500\,\mathrm{W}$ pri napetosti $230\,\mathrm{V}$. Kolikšen je efektivni tok skozi ploščo, kolikšen je njen upor in kolikšen je temenski tok?

**Podatki:** $\bar P = 1500\,\mathrm{W}$, $U_{\mathrm{ef}} = 230\,\mathrm{V}$
**Iščemo:** efektivni tok $I_{\mathrm{ef}}$, upor $R$, temenski tok $I_0$

:::formula
$\bar P = U_{\mathrm{ef}} I_{\mathrm{ef}}$, $R = \dfrac{U_{\mathrm{ef}}}{I_{\mathrm{ef}}}$, $I_0 = \sqrt{2}\, I_{\mathrm{ef}}$
:::

**Rešitev:**

1. Moč na nalepki je povprečna, zato iz nje dobimo efektivni tok: $I_{\mathrm{ef}} = \dfrac{1500\,\mathrm{W}}{230\,\mathrm{V}} \approx 6{,}52\,\mathrm{A}$.
2. Ohmov zakon velja tudi za efektivni vrednosti, ker obe dobimo iz temenskih z deljenjem s $\sqrt{2}$: $R = \dfrac{230\,\mathrm{V}}{6{,}52\,\mathrm{A}} \approx 35{,}3\,\Omega$.
3. Temenski tok je $\sqrt{2}$-krat večji: $I_0 = 1{,}414 \cdot 6{,}52\,\mathrm{A} \approx 9{,}22\,\mathrm{A}$.
4. Odgovor: skozi ploščo teče efektivni tok $6{,}5\,\mathrm{A}$, njen upor je $35\,\Omega$, tok pa v vrhu doseže $9{,}2\,\mathrm{A}$.

### Primer 3 (težji): kondenzator za indukcijsko ploščo

V indukcijski kuhalni plošči je pod steklom ploščata tuljava z induktivnostjo $60\,\mu\mathrm{H}$. Skupaj s kondenzatorjem tvori nihajni krog, ki naj niha z lastno frekvenco $25\,\mathrm{kHz}$. Kolikšna mora biti kapaciteta kondenzatorja?

**Podatki:** $L = 60\,\mu\mathrm{H} = 6{,}0\cdot10^{-5}\,\mathrm{H}$, $\nu_0 = 25\,\mathrm{kHz} = 2{,}5\cdot10^{4}\,\mathrm{Hz}$
**Iščemo:** kapaciteto $C$

:::formula
Iz $\nu_0 = \dfrac{1}{2\pi\sqrt{LC}}$ izrazimo $C = \dfrac{1}{4\pi^2 \nu_0^2 L}$.
:::

**Rešitev:**

1. Enačbo za lastno frekvenco kvadriramo, da se znebimo korena: $\nu_0^2 = \dfrac{1}{4\pi^2 L C}$. Nato $C$ in $\nu_0^2$ zamenjata mesti.
2. Izračunamo imenovalec po delih: $4\pi^2 \approx 39{,}48$ in $\nu_0^2 = 6{,}25\cdot10^{8}\,\mathrm{Hz^2}$, pomnoženo z $L$: $\nu_0^2 L = 6{,}25\cdot10^{8} \cdot 6{,}0\cdot10^{-5} = 3{,}75\cdot10^{4}$ (v osnovnih enotah).
3. Imenovalec: $39{,}48 \cdot 3{,}75\cdot10^{4} \approx 1{,}48\cdot10^{6}$.
4. $C = \dfrac{1}{1{,}48\cdot10^{6}}\,\mathrm{F} \approx 6{,}8\cdot10^{-7}\,\mathrm{F}$.
5. Odgovor: potrebujemo kondenzator s kapaciteto približno $0{,}68\,\mu\mathrm{F}$.

### Primer 4: zdaj ti

Kuhinjski radio lovi postajo na srednjem valu. Njegov nihajni krog ima tuljavo z induktivnostjo $0{,}25\,\mathrm{mH}$ in kondenzator s kapaciteto $100\,\mathrm{pF}$. Kolikšna sta nihajni čas in lastna frekvenca kroga?

**Podatki:** $L = 0{,}25\,\mathrm{mH} = 2{,}5\cdot10^{-4}\,\mathrm{H}$, $C = 100\,\mathrm{pF} = 1{,}0\cdot10^{-10}\,\mathrm{F}$
**Iščemo:** nihajni čas $t_0$ in lastno frekvenco $\nu_0$

:::formula
$t_0 = 2\pi\sqrt{LC}$ in $\nu_0 = \dfrac{1}{t_0}$
:::

**Rešitev:**

1. Produkt: $LC = 2{,}5\cdot10^{-4} \cdot 1{,}0\cdot10^{-10} = 2{,}5\cdot10^{-14}$ (v $\mathrm{s^2}$).
2. Koren: $\sqrt{2{,}5\cdot10^{-14}} \approx 1{,}58\cdot10^{-7}$ (v $\mathrm{s}$).
3. Pomnoži z $2\pi$ in izračunaj obratno vrednost sam, nato preveri:

:::premisli
Koliko sta $t_0$ in $\nu_0$?
---
$t_0 = 2\pi \cdot 1{,}58\cdot10^{-7}\,\mathrm{s} \approx 9{,}9\cdot10^{-7}\,\mathrm{s}$, torej skoraj $1\,\mu\mathrm{s}$. Lastna frekvenca je $\nu_0 = \dfrac{1}{t_0} \approx 1{,}0\cdot10^{6}\,\mathrm{Hz} = 1{,}0\,\mathrm{MHz}$, kar je res na srednjem valu.
:::

## Pogoste napake

- **»V vtičnici je največ $230\,\mathrm{V}$.«** Številka na nalepki je efektivna vrednost. Napetost v vrhu doseže $325\,\mathrm{V}$. To je pomembno pri izbiri kondenzatorjev in izolacije, ki morata zdržati vrh, ne povprečja.
- **Efektivna vrednost je polovica temenske.** Učenec si zapomni, da je povprečna moč polovica največje, in razpolovi kar napetost. Ker je moč sorazmerna s kvadratom napetosti, se napetost deli s $\sqrt{2}$, ne z $2$: $U_{\mathrm{ef}} \approx 0{,}71\,U_0$.
- **Efektivna napetost je povprečna napetost.** Povprečje sinusne napetosti v celem nihaju je nič. Efektivna vrednost ni povprečje napetosti, ampak tista enosmerna napetost, ki da enako povprečno moč.
- **Štirikrat večji $C$, štirikrat manjša frekvenca.** Pozabljen koren. Lastna frekvenca je obratno sorazmerna s $\sqrt{LC}$, zato štirikrat večji $C$ frekvenco le razpolovi.
- **»Ko je kondenzator prazen, je energija izginila.«** V tem trenutku je tok največji in vsa energija je v magnetnem polju tuljave. Energija se ne izgublja, le pretaka; izgublja se samo na uporu žic.

## Povzetek

- Generator ustvari sinusno napetost $U = U_0 \sin(\omega t)$, $\omega = 2\pi\nu$, $t_0 = \dfrac{1}{\nu}$. Omrežje: $50\,\mathrm{Hz}$, $t_0 = 20\,\mathrm{ms}$.
- Moč na uporniku niha med $0$ in $P_0$; povprečna moč je $\bar P = \dfrac{P_0}{2}$.
- Efektivna vrednost je enosmerna vrednost z enako povprečno močjo: $U_{\mathrm{ef}} = \dfrac{U_0}{\sqrt{2}}$, $I_{\mathrm{ef}} = \dfrac{I_0}{\sqrt{2}}$, $\bar P = U_{\mathrm{ef}} I_{\mathrm{ef}}$. Omrežje: $230\,\mathrm{V}$ efektivno, $325\,\mathrm{V}$ temensko.
- Nihajni krog: kondenzator in tuljava; energija se pretaka med električnim in magnetnim poljem.
- Thomsonova enačba: $t_0 = 2\pi\sqrt{LC}$, lastna frekvenca $\nu_0 = \dfrac{1}{2\pi\sqrt{LC}}$; večja $L$ ali $C$ pomeni nižjo frekvenco, odvisnost je korenska.
- Upor žic nihanje duši; za trajno nihanje mora krog dobivati energijo.

## Drugače: Na sliki

Nariši tri grafe enega pod drugim, z isto časovno osjo:

1. **Napetost** $U(t)$: valovnica med $+325\,\mathrm{V}$ in $-325\,\mathrm{V}$. Na višini $230\,\mathrm{V}$ potegni vodoravno črtkano črto, to je $U_{\mathrm{ef}}$.
2. **Kvadrat napetosti** $U^2(t)$: same grbe nad osjo, vrhovi pri $325^2 \approx 105\,600\,\mathrm{V^2}$. Grb je dvakrat več kot nihajev.
3. **Črta povprečja** pri polovici višine grb. Odreži vrhove grb nad črto in jih obrni v doline pod njo: natanko jih zapolnijo. Zato je povprečje točno polovica.

Efektivna napetost je koren te črte povprečja: $\sqrt{\tfrac{1}{2}\cdot 325^2} \approx 230$. Od tod ime, ki ga srečaš v angleških besedilih: *root mean square* (RMS), koren povprečja kvadratov.

Za nihajni krog si predstavljaj dva stolpca, kot ju kaže simulacija »Električni nihajni krog«: levi je energija kondenzatorja, desni energija tuljave. Ko se eden polni, se drugi prazni; njuna skupna višina ostane enaka.

## Drugače: Bolj natančno

**Zakaj ravno polovica.** Moč na uporniku je $P = \dfrac{U_0^2}{R}\sin^2(\omega t)$. Uporabimo identiteto

$$\sin^2 x = \frac{1 - \cos 2x}{2}$$

Člen s kosinusom je v celem nihaju v povprečju nič, ostane $\dfrac{1}{2}$. Zato $\bar P = \dfrac{1}{2}\cdot\dfrac{U_0^2}{R}$.

**Od kod Thomsonova enačba.** Energija kondenzatorja z nabojem $q$ je $W_{\mathrm{e}} = \dfrac{q^2}{2C}$, energija tuljave s tokom $I$ pa $W_{\mathrm{m}} = \dfrac{L I^2}{2}$. Brez upora je vsota stalna. Ko je ves naboj $q_0$ na kondenzatorju, je energija $\dfrac{q_0^2}{2C}$; četrt nihaja pozneje teče največji tok $I_0$ in energija je $\dfrac{L I_0^2}{2}$. Naboj niha sinusno, $q = q_0\cos(\omega t)$, zato je največji tok $I_0 = \omega q_0$. Iz enakosti energij:

$$\frac{q_0^2}{2C} = \frac{L \omega^2 q_0^2}{2}$$

in od tod $\omega^2 = \dfrac{1}{LC}$ ter $t_0 = \dfrac{2\pi}{\omega} = 2\pi\sqrt{LC}$.

**Ne le uporniki.** Pri tuljavi in kondenzatorju v krogu izmeničnega toka tok in napetost nista več v koraku; zamik za četrt nihaja spoznaš pozneje. Zveza $\bar P = U_{\mathrm{ef}} I_{\mathrm{ef}}$ velja natančno le za upornike, kot so grelci, kuhalniki in opekači.

## Preveri se

? Kateri opis grafa ustreza napetosti v omrežju z oznako $230\,\mathrm{V}$, $50\,\mathrm{Hz}$?
- Vrh pri $230\,\mathrm{V}$, en nihaj traja $20\,\mathrm{ms}$.
~ $230\,\mathrm{V}$ je efektivna vrednost, ne vrh. Vrh je $\sqrt{2}$-krat višji.
+ Vrh pri $325\,\mathrm{V}$, en nihaj traja $20\,\mathrm{ms}$.
- Vrh pri $325\,\mathrm{V}$, en nihaj traja $50\,\mathrm{ms}$.
~ $50$ je frekvenca, število nihajev v sekundi. Nihajni čas je $\dfrac{1}{50}\,\mathrm{s} = 20\,\mathrm{ms}$.
- Vrh pri $460\,\mathrm{V}$, en nihaj traja $20\,\mathrm{ms}$.
~ Tako dobiš, če misliš, da je efektivna vrednost polovica temenske. Deliti je treba s $\sqrt{2}$, ne z $2$.
> $U_0 = \sqrt{2}\cdot 230\,\mathrm{V} \approx 325\,\mathrm{V}$ in $t_0 = \dfrac{1}{\nu} = 20\,\mathrm{ms}$.

? Oceni efektivni tok skozi kuhalnik za vodo z močjo $2000\,\mathrm{W}$ na omrežni napetosti $230\,\mathrm{V}$.
- Približno $0{,}1\,\mathrm{A}$.
~ To je $\dfrac{U}{P}$, deljenje v napačni smeri. Iz $\bar P = U_{\mathrm{ef}} I_{\mathrm{ef}}$ sledi $I_{\mathrm{ef}} = \dfrac{\bar P}{U_{\mathrm{ef}}}$.
+ Približno $9\,\mathrm{A}$.
- Približno $12\,\mathrm{A}$.
~ To je temenski tok, ne efektivni. Moč na nalepki je povprečna, zato z deljenjem z $230\,\mathrm{V}$ dobiš neposredno efektivni tok.
- Približno $460\,000\,\mathrm{A}$.
~ Moč in napetost si pomnožil, a tok dobiš z deljenjem moči z napetostjo.
> $I_{\mathrm{ef}} = \dfrac{2000\,\mathrm{W}}{230\,\mathrm{V}} \approx 8{,}7\,\mathrm{A}$, torej približno $9\,\mathrm{A}$. Zato ima kuhalnik debelejši kabel kot polnilnik telefona.

? Zakaj se v nihajnem krogu kondenzator po izpraznitvi nabije v nasprotno smer, namesto da bi tok kar prenehal?
- Ker kondenzator naboj odbije nazaj.
~ Prazen kondenzator nima naboja, ki bi karkoli odbijal. Tok poganja nekaj drugega.
+ Ker tuljava zavira vsako spremembo toka: ko tok začne padati, inducirana napetost ga poganja naprej.
- Ker v krogu teče tok iz vtičnice.
~ Nihajni krog ni priključen na omrežje. Niha sam od sebe, z energijo, ki je bila na začetku v kondenzatorju.
- Ker se energija ob izpraznitvi izgubi in jo mora krog nadomestiti.
~ Energija se ne izgubi: v trenutku izpraznitve je vsa v magnetnem polju tuljave.
> Ob izpraznitvi je tok največji in energija je v magnetnem polju tuljave. Ko tok pada, se inducira napetost, ki ga vzdržuje, in ta tok nabije kondenzator v nasprotno smer.

? Nihajni krog niha z lastno frekvenco $25\,\mathrm{kHz}$. Tuljavo obdržimo, frekvenco pa želimo povečati na $50\,\mathrm{kHz}$. Kako moramo spremeniti kapaciteto?
- Povečati jo moramo dvakrat.
~ Večji $C$ pomeni počasnejše praznjenje in nižjo frekvenco. Za višjo frekvenco mora biti $C$ manjši.
- Zmanjšati jo moramo na polovico.
~ Pozabljen koren: polovični $C$ poveča frekvenco le za faktor $\sqrt{2} \approx 1{,}41$.
+ Zmanjšati jo moramo na četrtino.
- Povečati jo moramo štirikrat.
~ Pravi faktor, napačna smer. Frekvenca je obratno sorazmerna s $\sqrt{C}$.
> $\nu_0 \propto \dfrac{1}{\sqrt{C}}$. Da se $\nu_0$ podvoji, se mora $\sqrt{C}$ razpoloviti, torej $C$ zmanjšati na četrtino.

? Majhen grelec za lonček priključimo enkrat na enosmerno napetost $12\,\mathrm{V}$, drugič na izmenično napetost s temensko vrednostjo $12\,\mathrm{V}$. Kdaj se voda segreva hitreje?
- Enako hitro, saj je največja napetost v obeh primerih $12\,\mathrm{V}$.
~ Pri izmenični napetosti je $12\,\mathrm{V}$ le v vrhu, večino časa je napetost manjša. Primerjati moraš efektivni vrednosti.
+ Na enosmerni napetosti, približno dvakrat hitreje.
- Na izmenični napetosti, ker tok teče v obe smeri.
~ Smer toka za segrevanje ni pomembna, šteje moč. Ta je pri izmenični napetosti v povprečju manjša.
- Na izmenični se sploh ne segreva, ker je povprečna napetost nič.
~ Povprečna napetost je res nič, a moč je sorazmerna z $U^2$ in je vedno pozitivna.
> Izmenična napetost s temensko vrednostjo $12\,\mathrm{V}$ ima $U_{\mathrm{ef}} \approx 8{,}5\,\mathrm{V}$. Moč je sorazmerna s kvadratom napetosti, zato je pri izmenični napetosti povprečna moč polovica moči pri enosmernih $12\,\mathrm{V}$.

:::simboli
U | trenutna napetost | U = U_0 \sin(\omega t) | V
U_0 | temenska napetost | U_0 = \sqrt{2}\, U_{\mathrm{ef}} | V | največja vrednost napetosti
\omega | krožna frekvenca | \omega = 2\pi\nu | s^{-1}
\nu | frekvenca | \nu = \frac{1}{t_0} | Hz | število nihajev v sekundi
t | čas | | s
t_0 | nihajni čas | t_0 = 2\pi\sqrt{LC} | s | trajanje enega nihaja
I | trenutni tok | I = I_0 \sin(\omega t) | A
I_0 | temenski tok | I_0 = \frac{U_0}{R} | A
R | upor | R = \frac{U_{\mathrm{ef}}}{I_{\mathrm{ef}}} | Ω
P | trenutna moč | P = U I | W
P_0 | največja moč | P_0 = U_0 I_0 | W
\bar P | povprečna moč | \bar P = U_{\mathrm{ef}} I_{\mathrm{ef}} | W | moč na nalepki naprave
U_{\mathrm{ef}} | efektivna napetost | U_{\mathrm{ef}} = \frac{U_0}{\sqrt{2}} | V | v omrežju $230\,\mathrm{V}$
I_{\mathrm{ef}} | efektivni tok | I_{\mathrm{ef}} = \frac{I_0}{\sqrt{2}} | A
L | induktivnost tuljave | | H
C | kapaciteta kondenzatorja | C = \frac{1}{4\pi^2 \nu_0^2 L} | F
\nu_0 | lastna frekvenca | \nu_0 = \frac{1}{2\pi\sqrt{LC}} | Hz
x | poljuben kot | | | spremenljivka v identiteti
q | naboj na kondenzatorju | q = q_0\cos(\omega t) | As
q_0 | največji naboj | | As
W_{\mathrm{e}} | električna energija kondenzatorja | W_{\mathrm{e}} = \frac{q^2}{2C} | J
W_{\mathrm{m}} | magnetna energija tuljave | W_{\mathrm{m}} = \frac{L I^2}{2} | J
:::
