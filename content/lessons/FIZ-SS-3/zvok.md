---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Aplikacija za merjenje hrupa na telefonu v tihi sobi pokaže $30\,\mathrm{dB}$. Ko prižgeš glasbo na polno, pokaže $90\,\mathrm{dB}$. Je glasba torej trikrat močnejša? Ne: zvok, ki pride do tvojega ušesa, prinese v vsaki sekundi **milijonkrat** več energije. Do konca lekcije boš znal to izračunati sam.

Še eno vprašanje. V filmih vesoljska ladja v vesolju eksplodira z gromom. Bi ga astronavt v bližini res slišal? In kako astronomi iz svetlobe daljne zvezde ugotovijo, da okoli nje kroži planet, ki ga sploh ne vidijo? Odgovor na vprašanje o planetu se skriva v pojavu, ki ga poznaš z ulice: sirena reševalnega vozila zveni višje, ko se ti približuje, in nižje, ko se oddaljuje.

## Razlaga

**Kaj zveni.** Zvok je vzdolžno valovanje: izvir izmenično stiska in razredči plast zraka ob sebi, ta naslednjo in tako naprej. Tako po zraku potujejo **zgoščine** in **razredčine**. Za to potrebuje snov. Kjer ni snovi, kot v vesolju med zvezdami, zvoka ni. V zraku se širi s hitrostjo okoli $340\,\mathrm{m/s}$. Na Marsu, kjer je ozračje iz ogljikovega dioksida in zelo redko, je hitrost zvoka le okoli $240\,\mathrm{m/s}$.

Višino tona določa frekvenca. Človek sliši od približno $20\,\mathrm{Hz}$ do $20\,000\,\mathrm{Hz}$. V simulaciji spodaj, »Zvok: frekvenca in glasnost«, povečaj frekvenco s $440\,\mathrm{Hz}$ na $880\,\mathrm{Hz}$. Opazi, da se razmik med zgoščinami prepolovi, a bežijo enako hitro: hitrost določa zrak, $\lambda = \dfrac{c}{\nu}$ pa se prilagodi.

**Kako hitro zvok slabi.** Zvočnik z zvočno močjo $1\,\mathrm{W}$ stoji sredi travnika in oddaja enako v vse smeri. Energija, ki jo odda v sekundi, se razleze po krogelni ploskvi s površino $S = 4\pi r^2$. Poglej, koliko moči pade na vsak kvadratni meter pri različnih razdaljah:

| $r$ [m] | $S$ [m²] | moč na m² [W/m²] | glede na $1\,\mathrm{m}$ |
|---|---|---|---|
| 1 | 12,6 | 0,080 | 1 |
| 2 | 50,3 | 0,020 | $\frac{1}{4}$ |
| 3 | 113 | 0,0088 | $\frac{1}{9}$ |
| 4 | 201 | 0,0050 | $\frac{1}{16}$ |

Ali vidiš vzorec v zadnjem stolpcu? Dvakrat dlje pomeni štirikrat manj, trikrat dlje devetkrat manj. Moč na kvadratni meter pada s kvadratom razdalje.

Tej količini rečemo **jakost zvoka** $j$: moč, ki pade na enoto površine, pravokotne na smer širjenja. Enota je $\mathrm{W/m^2}$. Za izvir, ki seva enako v vse smeri, velja:

$$j = \frac{P}{4\pi r^2}$$

:::premisli
Prijatelj stoji $10\,\mathrm{m}$ od zvočnika in hoče, da bi bila jakost pri njem $100$-krat večja. Kam se mora premakniti?
---
Na $1\,\mathrm{m}$ od zvočnika: desetkrat bliže pomeni $10^2 = 100$-krat večjo jakost. Ne stokrat bliže: razdalja nastopa v kvadratu, saj se energija razleze po površini krogle.
:::

**Kako jakost sliši uho.** Uho zazna že jakost $j_0 = 10^{-12}\,\mathrm{W/m^2}$, to je **prag slišnosti**. Pri okoli $1\,\mathrm{W/m^2}$ začne zvok boleti. Razpon je kar bilijon proti ena, zato jakost raje opišemo z **ravnijo jakosti** $L$ v decibelih (dB). Poglej nekaj parov:

| $\dfrac{j}{j_0}$ | $L$ [dB] |
|---|---|
| $1$ | $0$ |
| $10$ | $10$ |
| $100$ | $20$ |
| $1000$ | $30$ |
| $10^{6}$ | $60$ |

Vzorec: vsakič, ko jakost pomnožimo z $10$, se raven poveča za $10\,\mathrm{dB}$. Decibeli torej štejejo, kolikokrat smo jakost pomnožili z deset. To zapiše desetiški logaritem:

$$L = 10\,\mathrm{dB} \cdot \log \frac{j}{j_0}$$

Zdaj odgovor na vprašanje s telefona: $90\,\mathrm{dB} - 30\,\mathrm{dB} = 60\,\mathrm{dB}$, to je šestkrat po $10\,\mathrm{dB}$, torej $10^{6}$-krat večja jakost. Uho takega skoka ne zazna kot milijonkratnega, saj zaznava razmerja, ne razlik. Prag bolečine je pri okoli $120\,\mathrm{dB}$.

**Ko se izvir giblje.** Sirena oddaja ton $500\,\mathrm{Hz}$, hitrost zvoka je $340\,\mathrm{m/s}$. Ko vozilo stoji, sta sosednja vrhova narazen $\lambda = \dfrac{340\,\mathrm{m/s}}{500\,\mathrm{Hz}} = 0{,}68\,\mathrm{m}$. Zdaj naj vozilo pelje proti tebi s hitrostjo $34\,\mathrm{m/s}$. Sirena odda nov vrh vsakih $t_0 = 0{,}002\,\mathrm{s}$. Prvi vrh v tem času prepotuje $0{,}68\,\mathrm{m}$, sirena pa se za njim premakne za $0{,}068\,\mathrm{m}$. Naslednji vrh odda bližje, zato sta vrhova pred vozilom narazen le $0{,}612\,\mathrm{m}$. V tvoje uho prihajajo z isto hitrostjo zvoka, a pogosteje.

| $v$ [m/s] | razmik vrhov [m] | slišiš [Hz] |
|---|---|---|
| 0 | 0,68 | 500 |
| 34 (proti tebi) | 0,612 | 556 |
| 68 (proti tebi) | 0,544 | 625 |
| 34 (stran od tebe) | 0,748 | 455 |

Vzorec: razmik pred vozilom je $(c - v)\,t_0$, za vozilom $(c + v)\,t_0$. Slišana frekvenca je hitrost zvoka, deljena s tem razmikom. To je **Dopplerjev pojav**: če se izvir giblje proti opazovalcu ali stran od njega, ta sliši drugačno frekvenco, kot jo izvir oddaja.

:::risba skica
opis: Vrhovi zvoka iz izvira, ki se giblje v desno s hitrostjo 0,4 hitrosti zvoka. Štirje krogi s polmeri 4, 3, 2 in 1 imajo središča pri x = 0; 0,4; 0,8 in 1,2. Izvir je zdaj pri x = 1,6. Desno pred izvirom, pri opazovalcu A, so krogi narazen 0,6 enote, levo za njim, pri opazovalcu B, pa 1,4 enote.
območje: -4,6; -4,6 .. 4,6; 4,6
enota: 30
krog: 0; 0 | 4 | modra
krog: 0,4; 0 | 3 | modra
krog: 0,8; 0 | 2 | modra
krog: 1,2; 0 | 1 | modra
puščica: 1,6; 0 -> 2,5; 0 | v | nad | oranžna
točka: 1,6; 0 | izvir | pod | oranžna polno
točka: 4,3; 0 | A | nad | zelena polno
točka: -4,3; 0 | B | nad | zelena polno
podnapis: Pred izvirom (A) so vrhovi zgoščeni, za njim (B) razredčeni
:::

Ker je $t_0 = \dfrac{1}{\nu}$, za izvir, ki se giblje s hitrostjo $v$, sledi:

$$\nu' = \nu\,\frac{c}{c - v} \quad \text{(izvir se približuje)}$$

$$\nu' = \nu\,\frac{c}{c + v} \quad \text{(izvir se oddaljuje)}$$

Podoben pojav nastane, če se giblje opazovalec s hitrostjo $u$, izvir pa miruje. Tedaj vrhovi niso zgoščeni, a jih opazovalec, ki gre proti njim, srečuje pogosteje: $\nu' = \nu\,\dfrac{c + u}{c}$ (pri oddaljevanju $c - u$).

:::premisli
Reševalno vozilo z enakomerno hitrostjo pripelje mimo tebe. Napovej: se ton med približevanjem počasi viša ali ostaja enak? Kaj se zgodi ob mimovožnji?
---
Med približevanjem je ton stalen in višji, saj sta $v$ in $c$ stalna. Ko vozilo pelje mimo, ton hitro pade na stalen nižji ton. Frekvenca ni odvisna od tega, kako blizu je vozilo, ampak od smeri in hitrosti gibanja.
:::

Enak pojav ima svetloba. Svetloba zvezde, ki se nam približuje, je pomaknjena proti višjim frekvencam, k modri. Svetloba zvezde, ki se oddaljuje, je pomaknjena k rdeči. Če okoli zvezde kroži velik planet, jo s svojim gravitacijskim privlakom rahlo ziblje sem in tja. Njena svetloba se zato izmenično pomika k modri in rdeči. Tako so astronomi našli že veliko planetov okoli drugih zvezd.

## Rešeni primeri

### Primer 1: zvočnik na travniku

Zvočnik na prostem oddaja zvočno moč $0{,}2\,\mathrm{W}$ enako v vse smeri. Kolikšna je jakost zvoka $5\,\mathrm{m}$ od njega?

**Podatki:** $P = 0{,}2\,\mathrm{W}$, $r = 5\,\mathrm{m}$
**Iščemo:** jakost zvoka $j$

:::formula
$j = \dfrac{P}{4\pi r^2}$
:::

**Rešitev:**

1. Moč se razleze po krogli s površino $S = 4\pi \cdot (5\,\mathrm{m})^2 \approx 314\,\mathrm{m^2}$.
2. Na vsak kvadratni meter pade $j = \dfrac{0{,}2\,\mathrm{W}}{314\,\mathrm{m^2}} \approx 6{,}4 \cdot 10^{-4}\,\mathrm{W/m^2}$.
3. Odgovor: jakost zvoka je okoli $6{,}4 \cdot 10^{-4}\,\mathrm{W/m^2}$.

### Primer 2: razred in koncert

Telefon v razredu izmeri raven jakosti $50\,\mathrm{dB}$, na koncertu pa $100\,\mathrm{dB}$. Kolikokrat večja je jakost na koncertu in kolikšna je?

**Podatki:** $L_1 = 50\,\mathrm{dB}$, $L_2 = 100\,\mathrm{dB}$, $j_0 = 10^{-12}\,\mathrm{W/m^2}$
**Iščemo:** razmerje $\dfrac{j_2}{j_1}$ in jakost $j_2$

:::formula
Vsakih $10\,\mathrm{dB}$ pomeni $10$-krat večjo jakost; $L = 10\,\mathrm{dB} \cdot \log \dfrac{j}{j_0}$
:::

**Rešitev:**

1. Razlika ravni je $100\,\mathrm{dB} - 50\,\mathrm{dB} = 50\,\mathrm{dB}$, to je petkrat po $10\,\mathrm{dB}$.
2. Jakost se je petkrat pomnožila z $10$: $\dfrac{j_2}{j_1} = 10^{5}$.
3. Raven $100\,\mathrm{dB}$ je desetkrat po $10\,\mathrm{dB}$ nad pragom, zato $j_2 = 10^{10} \cdot 10^{-12}\,\mathrm{W/m^2} = 10^{-2}\,\mathrm{W/m^2}$.
4. Odgovor: jakost na koncertu je $100\,000$-krat večja kot v razredu in znaša $0{,}01\,\mathrm{W/m^2}$.

### Primer 3: helikopter na Marsu

Rover na Marsu z mikrofonom snema majhen helikopter, katerega rotor brni s frekvenco $84\,\mathrm{Hz}$. Helikopter najprej leti proti roverju, nato stran od njega, obakrat s hitrostjo $10\,\mathrm{m/s}$. Hitrost zvoka na Marsu je $240\,\mathrm{m/s}$. Kolikšni frekvenci zazna mikrofon in za koliko pade ton ob preletu? Bi bil skok na Zemlji ($c = 340\,\mathrm{m/s}$) večji ali manjši?

**Podatki:** $\nu = 84\,\mathrm{Hz}$, $v = 10\,\mathrm{m/s}$, $c_\mathrm{M} = 240\,\mathrm{m/s}$, $c_\mathrm{Z} = 340\,\mathrm{m/s}$
**Iščemo:** frekvenci $\nu'_1$ (približevanje) in $\nu'_2$ (oddaljevanje), razliko $\Delta\nu$

:::formula
$\nu'_1 = \nu\,\dfrac{c}{c - v}$, $\nu'_2 = \nu\,\dfrac{c}{c + v}$, $\Delta\nu = \nu'_1 - \nu'_2$
:::

**Rešitev:**

1. Približevanje: $\nu'_1 = 84\,\mathrm{Hz} \cdot \dfrac{240}{230} \approx 87{,}65\,\mathrm{Hz}$. Imenovalec je manjši, ker so vrhovi zgoščeni.
2. Oddaljevanje: $\nu'_2 = 84\,\mathrm{Hz} \cdot \dfrac{240}{250} = 80{,}64\,\mathrm{Hz}$.
3. Skok ob preletu: $\Delta\nu \approx 87{,}65\,\mathrm{Hz} - 80{,}64\,\mathrm{Hz} \approx 7{,}0\,\mathrm{Hz}$.
4. Na Zemlji: $84 \cdot \dfrac{340}{330} \approx 86{,}5\,\mathrm{Hz}$ in $84 \cdot \dfrac{340}{350} = 81{,}6\,\mathrm{Hz}$, skok le okoli $4{,}9\,\mathrm{Hz}$.
5. Odgovor: mikrofon zazna okoli $87{,}7\,\mathrm{Hz}$ in nato $80{,}6\,\mathrm{Hz}$, ton pade za okoli $7\,\mathrm{Hz}$. Na Zemlji bi bil skok manjši, ker je $v$ tam manjši del hitrosti zvoka.

### Primer 4: zdaj ti

Sirena reševalnega vozila oddaja ton $700\,\mathrm{Hz}$. Ko vozilo pelje proti tebi, slišiš $750\,\mathrm{Hz}$. Hitrost zvoka je $340\,\mathrm{m/s}$. Kako hitro pelje vozilo?

**Podatki:** $\nu = 700\,\mathrm{Hz}$, $\nu' = 750\,\mathrm{Hz}$, $c = 340\,\mathrm{m/s}$
**Iščemo:** hitrost vozila $v$

:::formula
$\nu' = \nu\,\dfrac{c}{c - v}$, od tod $v = c\left(1 - \dfrac{\nu}{\nu'}\right)$
:::

**Rešitev:**

1. Slišana frekvenca je višja, torej se vozilo približuje; velja enačba z $c - v$.
2. Izrazimo: $c - v = c\,\dfrac{\nu}{\nu'}$, zato $v = c\left(1 - \dfrac{\nu}{\nu'}\right)$.
3. Vstavi podatke in izračunaj sam, nato pretvori v $\mathrm{km/h}$.

:::premisli
Koliko je $v$?
---
$v = 340\,\mathrm{m/s} \cdot \left(1 - \dfrac{700}{750}\right) \approx 22{,}7\,\mathrm{m/s}$, kar je okoli $82\,\mathrm{km/h}$.
:::

## Pogoste napake

- **Decibeli kot navadna števila.** »$60\,\mathrm{dB}$ je dvakrat več kot $30\,\mathrm{dB}$.« Decibeli štejejo množenja z deset: razlika $30\,\mathrm{dB}$ pomeni $1000$-krat večjo jakost. Dvakratna jakost doda le okoli $3\,\mathrm{dB}$.
- **Dvakrat dlje, pol jakosti.** Energija se razleze po površini krogle, ki raste s kvadratom polmera. Dvakrat dlje je jakost štirikrat manjša.
- **»Ton je višji, ker je vozilo blizu.«** Frekvenca je odvisna od smeri in hitrosti gibanja, ne od razdalje. Vozilo, ki stoji tik ob tebi, zveni s svojo pravo frekvenco.
- **»Zvok iz vozila, ki pelje, potuje hitreje.«** Hitrost zvoka določa zrak. Gibanje izvira spremeni razmik vrhov, zato frekvenco, ne hitrosti.
- **»V vesolju je zvok le zelo tih.«** Brez snovi ni ničesar, kar bi se zgoščevalo in redčilo. Zvoka v praznem prostoru sploh ni.

## Povzetek

- Brez snovi ni zvoka: zvok je vzdolžno valovanje snovi, v zraku okoli $340\,\mathrm{m/s}$, na Marsu okoli $240\,\mathrm{m/s}$. Slišimo od $20\,\mathrm{Hz}$ do $20\,\mathrm{kHz}$.
- Jakost zvoka je moč na enoto površine, $j = \dfrac{P}{S}$, enota $\mathrm{W/m^2}$. Za točkast izvir $j = \dfrac{P}{4\pi r^2}$: dvakrat dlje, štirikrat manj.
- Raven jakosti $L = 10\,\mathrm{dB} \cdot \log \dfrac{j}{j_0}$, $j_0 = 10^{-12}\,\mathrm{W/m^2}$. $+10\,\mathrm{dB}$ pomeni desetkratno jakost, $+3\,\mathrm{dB}$ dvakratno. Bolečina pri okoli $120\,\mathrm{dB}$.
- Dopplerjev pojav: izvir se približuje, $\nu' = \nu\,\dfrac{c}{c - v}$ (višji ton); oddaljuje, $c + v$ (nižji ton). Gibajoči se opazovalec: $\nu' = \nu\,\dfrac{c \pm u}{c}$.
- Astronomija: premik svetlobe zvezd k modri ali rdeči pove, ali se približujejo ali oddaljujejo; izmenično nihanje razkrije planete.

## Drugače: Korak za korakom s številkami

**Iz jakosti v decibele.** Koliko decibelov ima zvok z jakostjo $3{,}2 \cdot 10^{-5}\,\mathrm{W/m^2}$?

1. Deli s pragom: $\dfrac{j}{j_0} = \dfrac{3{,}2 \cdot 10^{-5}}{10^{-12}} = 3{,}2 \cdot 10^{7}$.
2. Logaritem pove, na koliko desetic je to: $\log(3{,}2 \cdot 10^{7}) \approx 7{,}5$.
3. Pomnoži z $10\,\mathrm{dB}$: $L \approx 75\,\mathrm{dB}$.
4. Preveri smiselnost: razmerje je med $10^{7}$ ($70\,\mathrm{dB}$) in $10^{8}$ ($80\,\mathrm{dB}$), zato mora biti raven med $70\,\mathrm{dB}$ in $80\,\mathrm{dB}$.

**Dva enaka zvočnika.** Prvi sam da $70\,\mathrm{dB}$. Ko prižgeš še drugega, se jakost podvoji. Raven se poveča za $10\,\mathrm{dB} \cdot \log 2 \approx 3\,\mathrm{dB}$, torej na okoli $73\,\mathrm{dB}$, ne na $140\,\mathrm{dB}$.

**Doppler po korakih.**

1. Ugotovi, ali se izvir približuje (višji ton, $c - v$) ali oddaljuje (nižji ton, $c + v$).
2. Izračunaj razmerje $\dfrac{c}{c \mp v}$; pri hitrosti, majhni v primerjavi z $c$, je blizu $1$.
3. Pomnoži s frekvenco izvira.
4. Preveri: pri približevanju mora biti rezultat večji od $\nu$, pri oddaljevanju manjši.

## Drugače: Kot zgodba

Avstrijski fizik Christian Doppler je razmišljal o svetlobi dvojnih zvezd, ki krožita druga okoli druge. Sklepal je, da mora biti svetloba zvezde, ki se nam bliža, drugačne barve od svetlobe zvezde, ki se oddaljuje. Takrat tega s svetlobo še ni mogel preveriti.

Preizkus je zato izvedel nizozemski znanstvenik Buys Ballot z zvokom. Na odprt železniški vagon je posadil trobentače, ki so ves čas igrali isti ton. Ob progo je postavil glasbenike z absolutnim posluhom, ki so prepoznali višino tona. Ko je vlak pripeljal mimo, so glasbeniki slišali najprej višji in nato nižji ton, kot so ga igrali trobentači. Večja kot je bila hitrost vlaka, večja je bila razlika.

Danes isto počnejo astronomi z ogromnimi teleskopi. Namesto trobentačev je zvezda, namesto glasbenikov spektrometer, ki zelo natančno izmeri barvo svetlobe. Ko se barva zvezde v rednih presledkih pomika k modri in nazaj k rdeči, vedo, da jo vleče nevidni planet. Doppler je imel prav: njegov pojav res razkriva gibanje zvezd.

## Preveri se

? Katera vrstica pravilno kaže jakost zvoka (v poljubnih enotah) na razdaljah $1\,\mathrm{m}$, $2\,\mathrm{m}$ in $3\,\mathrm{m}$ od majhnega zvočnika na prostem?
+ $36$, $9$, $4$
- $36$, $18$, $12$
~ Tako bi bilo, če bi jakost padala sorazmerno z $\frac{1}{r}$. Površina krogle pa raste z $r^2$.
- $36$, $24$, $12$
~ Jakost ne pada za enak del na vsak meter. Odvisna je od površine krogle, $4\pi r^2$.
> $j = \dfrac{P}{4\pi r^2}$: pri $2\,\mathrm{m}$ je jakost $\frac{1}{4}$, pri $3\,\mathrm{m}$ pa $\frac{1}{9}$ jakosti pri $1\,\mathrm{m}$.

? Na koncertu $10\,\mathrm{m}$ od zvočnika izmeriš $100\,\mathrm{dB}$. Približno koliko izmeriš $100\,\mathrm{m}$ od zvočnika (brez odbojev)?
- $10\,\mathrm{dB}$
~ Decibelov ne deliš z razdaljo. Desetkrat večja razdalja zmanjša jakost za faktor $100$, to je $-20\,\mathrm{dB}$.
- $90\,\mathrm{dB}$
~ To bi veljalo, če bi jakost padla le desetkrat. Pada pa s kvadratom razdalje, torej stokrat.
+ $80\,\mathrm{dB}$
> Desetkrat dlje pomeni $10^2 = 100$-krat manjšo jakost, to je dvakrat po $10\,\mathrm{dB}$: $100\,\mathrm{dB} - 20\,\mathrm{dB} = 80\,\mathrm{dB}$.

? Zakaj astronavt ne bi slišal eksplozije vesoljske ladje, ki jo vidi $1\,\mathrm{km}$ stran v vesolju?
- Ker zvok potuje prepočasi in še ni prišel do njega.
~ Do zvoka nikoli ne bi prišlo, ne glede na čas: v vesolju ni snovi, po kateri bi se širil.
+ Ker zvok potrebuje snov, v vesolju pa je skoraj ni.
- Ker je jakost na $1\,\mathrm{km}$ že padla pod prag slišnosti.
~ Jakost res pada z razdaljo, a tu ni zvoka sploh, ker ni zraka, ki bi se zgoščeval in redčil.
> Zvok je valovanje snovi. Svetloba se širi tudi po praznem prostoru, zato eksplozijo vidimo, slišimo pa ne.

? Sirena oddaja $600\,\mathrm{Hz}$, ti pa slišiš $640\,\mathrm{Hz}$. Hitrost zvoka je $340\,\mathrm{m/s}$. Kaj dela vozilo?
- oddaljuje se s hitrostjo okoli $21\,\mathrm{m/s}$
~ Slišana frekvenca je višja od oddane, zato so vrhovi zgoščeni: vozilo se približuje.
+ približuje se s hitrostjo okoli $21\,\mathrm{m/s}$
- približuje se s hitrostjo okoli $23\,\mathrm{m/s}$
~ To je formula za gibajočega se opazovalca, $\nu' = \nu\,\frac{c + u}{c}$. Tu se giblje izvir, zato velja $\nu' = \nu\,\frac{c}{c - v}$.
> $v = c\left(1 - \dfrac{\nu}{\nu'}\right) = 340\,\mathrm{m/s} \cdot \left(1 - \dfrac{600}{640}\right) \approx 21\,\mathrm{m/s}$.

? Astronomi opazijo, da se svetloba zvezde vsake $4$ dni izmenično pomakne k modri in nazaj k rdeči. Kaj sklepajo?
- Zvezda se vsake $4$ dni segreje in ohladi.
~ Barva res kaže tudi temperaturo, a redno pomikanje sem in tja je znak gibanja: Dopplerjev pojav.
- Zvezda se nam enakomerno približuje.
~ Enakomerno približevanje bi dalo stalen premik k modri, ne izmeničnega.
+ Zvezdo ziblje planet, ki jo obkroži v $4$ dneh.
> Ko se zvezda giblje proti nam, je svetloba pomaknjena k modri, ko stran, k rdeči. Redno menjavanje pomeni kroženje zaradi nevidnega spremljevalca.

:::simboli
j | jakost zvoka | j = \dfrac{P}{S} | W/m^2 | moč na enoto površine
P | zvočna moč izvira | | W
S | površina krogle | S = 4\pi r^2 | m^2
r | razdalja od izvira | | m
L | raven jakosti | L = 10\,\mathrm{dB} \cdot \log \dfrac{j}{j_0} | dB
j_0 | prag slišnosti | | W/m^2 | $10^{-12}\,\mathrm{W/m^2}$
L_1 | raven v razredu | | dB
L_2 | raven na koncertu | | dB
j_1 | jakost v razredu | | W/m^2
j_2 | jakost na koncertu | | W/m^2
\nu | frekvenca izvira | | Hz
\nu' | slišana frekvenca | | Hz
\nu'_1 | slišana frekvenca pri približevanju | | Hz
\nu'_2 | slišana frekvenca pri oddaljevanju | | Hz
\Delta\nu | padec tona ob preletu | \Delta\nu = \nu'_1 - \nu'_2 | Hz
c | hitrost zvoka | | m/s | določa jo snov
c_\mathrm{M} | hitrost zvoka na Marsu | | m/s
c_\mathrm{Z} | hitrost zvoka na Zemlji | | m/s
v | hitrost izvira | | m/s
u | hitrost opazovalca | | m/s
\lambda | valovna dolžina | \lambda = \dfrac{c}{\nu} | m | razmik sosednjih vrhov
t_0 | nihajni čas | t_0 = \dfrac{1}{\nu} | s | čas med dvema vrhovoma
:::
