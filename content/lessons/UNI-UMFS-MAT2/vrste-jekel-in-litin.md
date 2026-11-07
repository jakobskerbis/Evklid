---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Knjižničar iz številke ISBN razbere državo in založnika, ne da bi odprl knjigo. Farmacevt iz oznake zdravila razbere učinkovino in odmerek. Strojnik dobi risbo, na kateri ob gredi piše samo **42CrMo4**, ob ohišju črpalke pa **EN-GJL-250**. Obe kratki oznaki sta zapisani po istem načelu kot ISBN: vsak znak na svojem mestu nekaj pomeni. Iz prve razbereš, da je to jeklo z $0{,}42\,\%$ ogljika, kroma okoli $1\,\%$ in nekaj molibdena, primerno za poboljšanje. Iz druge, da je ohišje iz sive litine z lamelnim grafitom in natezno trdnostjo vsaj $250\,\mathrm{MPa}$.

Jekel je več tisoč. Kdor zna brati oznake, iz risbe razbere lastnosti, iz kataloga izbere zamenjavo in v skladišču ne zamenja nerjavnega jekla z navadnim. Kdor ne zna, naroči napačen material, ki se zvari slabo, zarjavi ali poči.

## Razlaga

**Najprej ena oznaka do konca.** Vzemimo **42CrMo4**.

1. Oznaka se začne s številko, ne s črko S ali X. Zato je to **nizkolegirano** jeklo, označeno po kemični sestavi (noben legirni element ne doseže $5\,\%$).
2. Prvo število je stokratnik masnega deleža ogljika: $\frac{42}{100} = 0{,}42\,\%\ \mathrm{C}$.
3. Sledijo legirni elementi po padajočem deležu: krom, nato molibden.
4. Število za simboli je delež prvega elementa, pomnožen s faktorjem. Za krom je faktor $4$, zato $\frac{4}{4} = 1\,\%\ \mathrm{Cr}$. Molibden nima števila: njegov delež je majhen in v oznaki ni podan.
5. Številska oznaka istega jekla je **1.7225**. Prva enica pomeni jeklo, naslednji dve števki skupino, zadnji dve zaporedno številko.

Ogljik $0{,}42\,\%$ omogoča kaljenje, krom in molibden povečata prekaljivost. Tako jeklo kalimo in popuščamo (**poboljšamo**) za gredi, vijake in zobnike. Iz petih znakov smo dobili sestavo in uporabo. Zdaj pravila posplošimo.

**Definicija.** **Jeklo** je zlitina železa z ogljikom, ki ima manj kot okoli $2\,\%$ ogljika (natančneje $2{,}06\,\%$ po diagramu železo–cementit) in je preoblikovalna. **Litina** ima več ogljika, običajno $2{,}5$ do $4\,\%$; ne kujemo je, temveč ulivamo.

**Označevanje jekel po standardu SIST EN 10027.** Del 1 določa simbolne oznake v dveh skupinah, del 2 številske.

*Skupina 1: po uporabi in mehanskih lastnostih.* Črka pove namen, število najmanjšo mejo tečenja $R_\mathrm{e}$ v $\mathrm{MPa}$ (za najtanjše izdelke):
- **S**: konstrukcijska jekla, na primer S235JR, S355J2;
- **E**: strojna jekla, na primer E295;
- **P**: jekla za tlačne posode; **B**: jekla za armiranje betona.

Dodatni znaki pri S pomenijo udarno žilavost: **JR** je $27\,\mathrm{J}$ pri $20\,°\mathrm{C}$, **J0** pri $0\,°\mathrm{C}$, **J2** pri $-20\,°\mathrm{C}$. Meja tečenja z debelino pada: pri S235 je za debeline od $16$ do $40\,\mathrm{mm}$ le $225\,\mathrm{MPa}$.

*Skupina 2: po kemični sestavi.*
- **Nelegirana** (manj kot $1\,\%$ Mn): **C** + stokratnik deleža ogljika. C45 ima $0{,}45\,\%$ C.
- **Nizkolegirana** (vsak element pod $5\,\%$; enako se označujejo tudi nelegirana z vsaj $1\,\%$ Mn, na primer 28Mn6): stokratnik C, simboli elementov, nato deleži, pomnoženi s faktorji: $4$ za Cr, Co, Mn, Ni, Si, W; $10$ za Al, Cu, Mo, Nb, Ti, V (in druge); $100$ za N, P, S; $1000$ za B.
- **Visokolegirana** (vsaj en element $5\,\%$ ali več): **X** + stokratnik C, simboli, nato *dejanski* deleži, ločeni s črticami. X5CrNi18-10 ima $0{,}05\,\%$ C, $18\,\%$ Cr in $10\,\%$ Ni.
- **Hitrorezna**: **HS** + deleži W, Mo, V, Co v tem vrstnem redu. HS6-5-2 ima $6\,\%$ W, $5\,\%$ Mo, $2\,\%$ V.

:::premisli
Zakaj ima nizkolegirano jeklo faktorje (16MnCr5 ima $1{,}25\,\%$ Mn), visokolegirano pa dejanske deleže?
---
Pri nizkolegiranih so deleži majhni, pogosto pod $1\,\%$. S faktorjem dobimo celo število, ki se ne zamenja z ogljikom. Pri visokolegiranih so deleži veliki (na primer $18\,\%$ Cr), zato jih lahko zapišemo kar neposredno; črka X pove, da števila beremo drugače.
:::

**Konstrukcijska jekla.** Najpogostejša so S235, S275 in S355. Kupujemo jih po mehanskih lastnostih, ne po sestavi. Morajo biti **variva**, zato imajo malo ogljika (običajno pod $0{,}2\,\%$). Varivost ocenimo z **ogljikovim ekvivalentom** (formula IIW):

$$\mathrm{CE} = C + \frac{\mathrm{Mn}}{6} + \frac{\mathrm{Cr} + \mathrm{Mo} + \mathrm{V}}{5} + \frac{\mathrm{Ni} + \mathrm{Cu}}{15}$$

kjer so oznake elementov masni deleži v odstotkih. Do okoli $0{,}45$ je jeklo dobro varivo; od $0{,}45$ do $0{,}6$ ga predgrevamo; nad $0{,}6$ je varjenje zahtevno, ker v toplotno vplivanem pasu nastane krhek martenzit.

Med strojna jekla sodijo še **poboljšana** jekla ($0{,}3$ do $0{,}5\,\%$ C, na primer C45, 42CrMo4) za gredi in **cementacijska** (pod $0{,}2\,\%$ C, na primer 16MnCr5), ki jih površinsko naogljičimo in kalimo za zobnike: trda površina, žilavo jedro.

**Orodna jekla** potrebujejo trdoto in odpornost proti obrabi, zato imajo več ogljika in karbidotvornih elementov.
- Za delo v hladnem: X153CrMoV12 (1.2379), za rezila in štance.
- Za delo v vročem: X40CrMoV5-1 (1.2344), za kalupe za tlačno litje, ker ohrani trdnost pri visoki temperaturi.
- Hitrorezna: HS6-5-2 (1.3343), za svedre in rezkarje; trdota ostane tudi pri rdečem žaru rezalnega roba.

**Nerjavna jekla** (SIST EN 10088) imajo vsaj $10{,}5\,\%$ kroma in največ $1{,}2\,\%$ ogljika. Krom na površini tvori tanko plast kromovega oksida, ki se ob poškodbi sama obnovi (**pasivacija**). Po mikrostrukturi:
- **avstenitna**, X5CrNi18-10 (1.4301): nikelj ohrani ploskovno centrirano mrežo, jeklo je žilavo, nemagnetno, dobro varivo, a se ne da kaliti;
- **feritna**, X6Cr17 (1.4016): brez niklja, magnetna, cenejša;
- **martenzitna**, X20Cr13 (1.4021): dovolj ogljika za kaljenje, magnetna, za nože in kirurška orodja;
- **dupleks**, X2CrNiMoN22-5-3 (1.4462): pol ferita, pol avstenita, večja trdnost in odpornost proti napetostni koroziji.

**Litine.** Pri ohlajanju se ogljik izloči kot grafit ali ostane v cementitu. Oblika grafita odloča o lastnostih.
- **Siva litina z lamelnim grafitom**, EN-GJL-250: število je najmanjša natezna trdnost $R_\mathrm{m}$ v $\mathrm{MPa}$. Lamele delujejo kot zareze, zato je v nategu krhka (raztezek pod $1\,\%$), v tlaku pa trikrat do štirikrat trdnejša. Dobro duši tresljaje, se dobro obdeluje in lije. Ohišja, podstavki strojev, zavorni diski.
- **Litina s kroglastim grafitom** (nodularna), EN-GJS-400-15: $R_\mathrm{m} \ge 400\,\mathrm{MPa}$ in raztezek $15\,\%$. Kroglice ne delujejo kot zareze, zato je litina žilava. Ročične gredi, cevi, deli podvozja.
- **Bela litina**: ves ogljik v cementitu, zelo trda in krhka; za obrabne dele in kot surovina za temprano litino.

Skica pod mikroskopom (grafit je temen):

```
  siva (GJL)     nodularna (GJS)
  ~~  ~  ~~       o   o   o
   ~ ~~  ~          o   o
  ~~  ~ ~~        o   o   o
  lamele:          kroglice:
  ostri robovi     brez robov
```

:::premisli
Siva in nodularna litina imata lahko enako sestavo. Kaj se zgodi z nateznim raztezkom, če lamele grafita spremenimo v kroglice, in zakaj?
---
Raztezek naraste z manj kot $1\,\%$ na več odstotkov (pri GJS-400-15 na $15\,\%$). Ostri robovi lamel zbirajo napetost in razpoka steče od lamele do lamele. Kroglica nima ostrih robov, zato se kovinska osnova med njimi lahko plastično deformira.
:::

## Rešeni primeri

### Primer 1 (lažji): natezna palica iz S235

Palica s prerezom $20\,\mathrm{mm} \times 10\,\mathrm{mm}$ je iz jekla S235JR. S kolikšno silo jo smemo obremeniti, če zahtevamo varnostni faktor $1{,}5$ proti tečenju? Kaj pomeni JR?

**Podatki:** oznaka S235JR, prerez $A = 20\,\mathrm{mm} \cdot 10\,\mathrm{mm} = 200\,\mathrm{mm^2}$, debelina $10\,\mathrm{mm}$, varnostni faktor $\nu = 1{,}5$
**Iščemo:** dopustno silo $F$ in pomen JR

:::formula
$F = \dfrac{R_\mathrm{e} \cdot A}{\nu}$
:::

**Rešitev:**

1. S pomeni konstrukcijsko jeklo, $235$ najmanjšo mejo tečenja v $\mathrm{MPa}$ za debeline do $16\,\mathrm{mm}$. Palica je debela $10\,\mathrm{mm}$, zato je $R_\mathrm{e} = 235\,\mathrm{MPa}$.
2. $F = \frac{235 \cdot 200}{1{,}5} \approx 31\,333\,\mathrm{N}$ (enota: $\mathrm{MPa} \cdot \mathrm{mm^2} = \mathrm{N}$).
3. JR pomeni, da jeklo pri $20\,°\mathrm{C}$ absorbira vsaj $27\,\mathrm{J}$ udarne energije. Za mraz bi potrebovali J0 ali J2.
4. Odgovor: palico smemo obremeniti z okoli $31\,\mathrm{kN}$; JR zagotavlja žilavost pri sobni temperaturi.

### Primer 2: štiri oznake na eni risbi

Na sestavni risbi menjalnika so štiri oznake: 16MnCr5 (zobnik), 42CrMo4 (gred), X5CrNi18-10 (pokrov za živilsko industrijo), HS6-5-2 (sveder v delavnici). Za vsako razberi sestavo in skupino.

**Podatki:** oznake 16MnCr5, 42CrMo4, X5CrNi18-10, HS6-5-2; faktor $4$ za Mn in Cr
**Iščemo:** delež ogljika, glavne legirne elemente in vrsto jekla

:::formula
Nizkolegirano: $\%\mathrm{C} = \frac{\text{prvo število}}{100}$, delež elementa $= \frac{\text{število}}{\text{faktor}}$. Visokolegirano (X): deleži so zapisani neposredno.
:::

**Rešitev:**

1. 16MnCr5: $\frac{16}{100} = 0{,}16\,\%$ C; mangan $\frac{5}{4} = 1{,}25\,\%$; krom manj. Malo ogljika: cementacijsko jeklo za zobnike.
2. 42CrMo4: $0{,}42\,\%$ C, $1\,\%$ Cr, nekaj Mo. Poboljšano jeklo za gredi.
3. X5CrNi18-10: črka X, zato $0{,}05\,\%$ C, $18\,\%$ Cr, $10\,\%$ Ni. Avstenitno nerjavno jeklo (1.4301), primerno za stik s hrano.
4. HS6-5-2: hitrorezno jeklo s $6\,\%$ W, $5\,\%$ Mo, $2\,\%$ V (krom okoli $4\,\%$ v oznaki ni zapisan).
5. Odgovor: cementacijsko, poboljšano, avstenitno nerjavno in hitrorezno jeklo; od zobnika do svedra raste delež legirnih elementov, ker raste zahteva po trdoti ali odpornosti.

### Primer 3 (težji, izpitna raven): varivost dveh jekel

Iz atestov dveh dobav imamo sestavo (masni deleži v $\%$). S355J2: C $0{,}18$; Mn $1{,}40$; Cr $0{,}05$; Mo $0{,}02$; V $0{,}01$; Ni $0{,}05$; Cu $0{,}10$. 42CrMo4: C $0{,}42$; Mn $0{,}75$; Cr $1{,}05$; Mo $0{,}22$; brez V, Ni in Cu. Oceni varivost obeh in predlagaj postopek.

**Podatki:** sestavi iz atestov (zgoraj); meje: $\mathrm{CE} \le 0{,}45$ dobro varivo, $0{,}45$ do $0{,}6$ predgrevanje, nad $0{,}6$ zahtevno
**Iščemo:** $\mathrm{CE}$ obeh jekel in priporočilo

:::formula
$\mathrm{CE} = C + \dfrac{\mathrm{Mn}}{6} + \dfrac{\mathrm{Cr} + \mathrm{Mo} + \mathrm{V}}{5} + \dfrac{\mathrm{Ni} + \mathrm{Cu}}{15}$
:::

**Rešitev:**

1. S355J2, posamezni členi: $\frac{1{,}40}{6} \approx 0{,}233$; $\frac{0{,}05 + 0{,}02 + 0{,}01}{5} = 0{,}016$; $\frac{0{,}05 + 0{,}10}{15} = 0{,}01$.
2. Vsota: $\mathrm{CE} \approx 0{,}18 + 0{,}233 + 0{,}016 + 0{,}01 = 0{,}439$.
3. 42CrMo4: $\frac{0{,}75}{6} = 0{,}125$ in $\frac{1{,}05 + 0{,}22}{5} = 0{,}254$.
4. Vsota: $\mathrm{CE} = 0{,}42 + 0{,}125 + 0{,}254 = 0{,}799$.
5. S355J2 je pod $0{,}45$: dobro varivo, pri debelih pločevinah ali mrazu po potrebi rahlo predgrevanje.
6. 42CrMo4 je nad $0{,}6$: ogljik in krom povzročita, da se toplotno vplivani pas ob hitrem ohlajanju kali v martenzit in razpoka. Potrebni so predgrevanje (okoli $300\,°\mathrm{C}$), počasno ohlajanje in popuščanje po varjenju, ali pa drugačna izvedba (vijačni spoj, nakrčenje).
7. Odgovor: $\mathrm{CE} \approx 0{,}44$ za S355J2 (dobro varivo) in $\mathrm{CE} \approx 0{,}80$ za 42CrMo4 (zahtevno varivo). Zato se konstrukcije varijo iz S-jekel, poboljšana jekla pa le izjemoma.

### Primer 4 – zdaj ti: ali je litina podevtektična?

Pri litinah uporabljamo drug ogljikov ekvivalent, $\mathrm{CE}_\mathrm{L} = C + \frac{\mathrm{Si} + \mathrm{P}}{3}$, ki pove, kako blizu evtektika je sestava. Evtektična vrednost je $4{,}3\,\%$. Siva litina ima C $3{,}4\,\%$, Si $2{,}1\,\%$, P $0{,}1\,\%$.

**Podatki:** C $3{,}4\,\%$; Si $2{,}1\,\%$; P $0{,}1\,\%$; evtektik pri $4{,}3\,\%$
**Iščemo:** $\mathrm{CE}_\mathrm{L}$ in ali je litina pod- ali nadevtektična

:::formula
$\mathrm{CE}_\mathrm{L} = C + \dfrac{\mathrm{Si} + \mathrm{P}}{3}$
:::

**Rešitev:**

1. Silicij in fosfor premakneta evtektik k manjšim deležem ogljika, zato ju »prištejemo« ogljiku.
2. $\frac{2{,}1 + 0{,}1}{3} \approx 0{,}733$.
3. Zdaj seštej in primerjaj z $4{,}3$ sam.

:::premisli
Kolikšen je $\mathrm{CE}_\mathrm{L}$ in kaj to pomeni za strjevanje?
---
$\mathrm{CE}_\mathrm{L} \approx 3{,}4 + 0{,}733 = 4{,}13\,\%$, kar je pod $4{,}3\,\%$: litina je rahlo podevtektična. Najprej se izločajo dendriti avstenita, nato se strdi evtektik z grafitom. Blizu evtektika ima litina dobro livnost, zato se taka sestava izbira za tankostenske ulitke.
:::

## Pogoste napake

- **»Število v S235 je ogljik.«** Pri skupini 1 število pomeni najmanjšo mejo tečenja v $\mathrm{MPa}$, ne sestave. Ogljik je stokratnik prvega števila le pri skupini 2 (C45, 42CrMo4).
- **Faktor pozabljen.** Kdor iz 42CrMo4 prebere »$4\,\%$ kroma«, pozabi deliti s faktorjem $4$; prav je $1\,\%$. Pri X-oznakah faktorjev ni.
- **»Nerjavno jeklo ne rjavi nikoli.«** Pasivna plast se poškoduje v kloridih (morska voda, sol za posipanje) ali v rezah in špranjah. Za morje izberemo jeklo z molibdenom (X2CrNiMo17-12-2) ali dupleks.
- **»Siva litina je trdna, ker je trda.«** Trdota ni trdnost v nategu. Lamelni grafit dela zareze, zato je siva litina v nategu krhka; za udarne obremenitve izberemo nodularno litino.
- **Meja tečenja ne glede na debelino.** Pri debelejših izdelkih je $R_\mathrm{e}$ manjša od števila v oznaki (S235 nad $16\,\mathrm{mm}$ le $225\,\mathrm{MPa}$). Spregledano zmanjšanje vodi v premajhen prerez (Naloga 1).

## Povzetek

- Jeklo ima pod okoli $2\,\%$ C (natančneje $2{,}06\,\%$), litina več; jeklo preoblikujemo, litino ulivamo.
- SIST EN 10027-1, skupina 1: S/E/P/B + najmanjša $R_\mathrm{e}$ v $\mathrm{MPa}$; JR, J0, J2 = $27\,\mathrm{J}$ pri $20$, $0$, $-20\,°\mathrm{C}$.
- Skupina 2: C45 (nelegirano), 42CrMo4 (nizkolegirano, faktorji $4$, $10$, $100$, $1000$), X5CrNi18-10 (visokolegirano, dejanski deleži), HS6-5-2 (hitrorezno). Številska oznaka: 1.xxyy.
- Konstrukcijska jekla so variva ($\mathrm{CE} \le 0{,}45$); poboljšana in cementacijska za strojne dele; orodna za delo v hladnem, vročem in hitrorezna.
- Nerjavna: vsaj $10{,}5\,\%$ Cr; avstenitna, feritna, martenzitna, dupleks.
- Litine: siva (lamelni grafit, GJL, krhka, duši tresljaje), nodularna (kroglasti grafit, GJS, žilava), bela (cementit).

## Za izpit

Znati moraš povedati:
- mejo med jeklom in litino ter zakaj se litina ne kuje;
- pravila označevanja po SIST EN 10027 za obe skupini, s faktorji pri nizkolegiranih jeklih;
- pogoj za nerjavno jeklo in štiri vrste po mikrostrukturi z lastnostmi;
- razliko med sivo in nodularno litino ter vzrok zanjo;
- ogljikov ekvivalent in kaj pove o varivosti.

### Naloga 1

Natezna vez mora prenesti $F = 120\,\mathrm{kN}$ z varnostnim faktorjem $1{,}5$ proti tečenju. Na voljo sta okrogli palici iz S235JR in S355J2. Meja tečenja za debeline do $16\,\mathrm{mm}$ je $235$ oziroma $355\,\mathrm{MPa}$, za $16$ do $40\,\mathrm{mm}$ pa $225$ oziroma $345\,\mathrm{MPa}$. Gostota jekla je $7{,}85\,\mathrm{g/cm^3}$. (a) Določi najmanjši celoštevilski premer v milimetrih za obe jekli. (b) Primerjaj maso na meter.

**Rešitev:**

1. Potrebni prerez: $A = \frac{F \cdot \nu}{R_\mathrm{e}}$.
2. S235 z $235\,\mathrm{MPa}$: $A = \frac{120\,000 \cdot 1{,}5}{235} \approx 766\,\mathrm{mm^2}$ in $d = \sqrt{\frac{4A}{\pi}} \approx 31{,}2\,\mathrm{mm}$. To je nad $16\,\mathrm{mm}$, zato vrednost $235\,\mathrm{MPa}$ ne velja.
3. S235 z $225\,\mathrm{MPa}$: $A = \frac{120\,000 \cdot 1{,}5}{225} = 800\,\mathrm{mm^2}$ in $d \approx 31{,}9\,\mathrm{mm}$; izberemo $32\,\mathrm{mm}$.
4. S355 z $355\,\mathrm{MPa}$: $A \approx 507\,\mathrm{mm^2}$, $d \approx 25{,}4\,\mathrm{mm}$, spet nad $16\,\mathrm{mm}$.
5. S355 z $345\,\mathrm{MPa}$: $A \approx 522\,\mathrm{mm^2}$, $d \approx 25{,}8\,\mathrm{mm}$; izberemo $26\,\mathrm{mm}$.
6. Preizkus: pri $32\,\mathrm{mm}$ je napetost $\frac{120\,000}{804{,}2} \approx 149\,\mathrm{MPa} \le 150\,\mathrm{MPa}$; pri $26\,\mathrm{mm}$ je $\frac{120\,000}{530{,}9} \approx 226\,\mathrm{MPa} \le 230\,\mathrm{MPa}$. Oboje drži.
7. Masa na meter: $m' = \rho \cdot \frac{\pi d^2}{4} \cdot 1\,\mathrm{m}$. Za $32\,\mathrm{mm}$: $7{,}85 \cdot 8{,}04 \cdot 100\,\mathrm{g} \approx 6{,}31\,\mathrm{kg}$; za $26\,\mathrm{mm}$: $\approx 4{,}17\,\mathrm{kg}$.
8. Odgovor: S235JR potrebuje $32\,\mathrm{mm}$, S355J2 $26\,\mathrm{mm}$; vez iz S355 je okoli tretjino lažja ($\left(\frac{26}{32}\right)^2 \approx 0{,}66$).

### Naloga 2

Utemelji, zakaj je X5CrNi18-10 nerjavno, nemagnetno in ga ni mogoče utrditi s kaljenjem, X20Cr13 pa je nerjavno, magnetno in kaljivo.

**Rešitev:**

1. Obe jekli imata več kot $10{,}5\,\%$ kroma (18 oziroma 13 %), zato na površini nastane pasivna plast kromovega oksida: obe sta nerjavni.
2. X5CrNi18-10 ima $10\,\%$ niklja. Nikelj stabilizira avstenit (ploskovno centrirana kubična mreža) do sobne temperature. Avstenit je paramagneten, zato jeklo ni magnetno.
3. Ker ostane avstenitno pri vseh temperaturah, ob ohlajanju ni premene v martenzit; poleg tega ima le $0{,}05\,\%$ C. Kaljenje ga ne utrdi; utrdimo ga lahko le s hladnim preoblikovanjem.
4. X20Cr13 nima niklja, pri visoki temperaturi je avstenitno, pri sobni pa feritno-karbidno. Ob hitrem ohlajanju avstenit preide v martenzit; $0{,}20\,\%$ C da dovolj trdote.
5. Ferit in martenzit sta feromagnetna, zato je X20Cr13 magneten.
6. Sklep: nerjavnost določa krom, mikrostrukturo pa razmerje med elementi, ki stabilizirajo avstenit (Ni, C, N, Mn), in tistimi, ki stabilizirajo ferit (Cr, Mo, Si). To pokaže Schaefflerjev diagram (Bolj natančno).

## Drugače: Z analogijo

Oznaka jekla je kot registrska tablica, ki ima dva sistema. Pri skupini 1 tablica pove, *kaj vozilo zmore* (najmanjšo trdnost), ne pa, iz česa je. Pri skupini 2 tablica pove *sestavo*, kot recept: »$0{,}42$ dela ogljika, malo kroma, ščepec molibdena«. Faktorji so kot enote v receptu: pri malih količinah štejemo v ščepcih, da ne pišemo decimalk, pri velikih (X) pa kar v odstotkih.

Siva in nodularna litina sta kot steklo z razpokami in steklo z mehurčki. Razpoka (lamela) se pod obremenitvijo podaljša, mehurček (kroglica) pa napetost porazdeli okoli sebe.

## Drugače: Uporaba v stroki

**Nabava in atesti.** Vsaka dobava jekla pride s potrdilom o pregledu (atest), na katerem so oznaka, številka taline, sestava in izmerjene mehanske lastnosti. Inženir pri prevzemu preveri, ali vrednosti ustrezajo standardu, in izračuna $\mathrm{CE}$ za varilni postopek.

**Podatkovne baze materialov.** Ključ do baz jekel, programov za izbiro materialov in podatkov v simulaciji (metoda končnih elementov) je številska oznaka (1.4301), ker je enolična in jo je lažje iskati kot simbolno.

**Prepoznavanje v delavnici.** Ko oznaka ni znana, spektrometer z iskro ali rentgensko fluorescenco v nekaj sekundah izmeri sestavo. Hiter preizkus z magnetom loči avstenitno nerjavno jeklo od feritnega ali navadnega, a ne loči 1.4301 od 1.4404 z molibdenom.

## Drugače: Bolj natančno

**Schaefflerjev diagram.** Vpliv legirnih elementov na mikrostrukturo nerjavnih jekel in zvarov združimo v dva ekvivalenta: kromov $\mathrm{Cr} + \mathrm{Mo} + 1{,}5\,\mathrm{Si} + 0{,}5\,\mathrm{Nb}$ in nikljev $\mathrm{Ni} + 30\,\mathrm{C} + 0{,}5\,\mathrm{Mn}$. Točka v diagramu pove, ali bo zvar avstenitni, feritni, martenzitni ali mešan. Za X5CrNi18-10 je kromov ekvivalent okoli $18$ do $19$, nikljev okoli $12$, kar je v območju avstenita z malo ferita; ta delta ferit ščiti zvar pred vročimi razpokami.

**Zakaj meja tečenja pada z debelino.** Debelejša pločevina se po valjanju ohlaja počasneje, zato so kristalna zrna večja. Po Hall-Petchevi zvezi meja tečenja raste z manjšanjem velikosti zrn ($R_\mathrm{e}$ je linearna v $d_\mathrm{z}^{-1/2}$). Večja zrna dajo manjšo $R_\mathrm{e}$, zato standard predpiše manjše vrednosti za debelejše izdelke.

## Preveri se

? Na risbi piše EN-GJS-400-15. Kaj pomeni število $15$?
- najmanjšo trdoto po Brinellu
~ Trdota ni del te oznake; število za trdnostjo je raztezek.
+ najmanjši raztezek ob porušitvi v odstotkih
- delež grafita v odstotkih
~ Grafita je nekaj odstotkov, a oznaka ga ne podaja.
- delež silicija v desetinkah odstotka
~ Oznaka litine po mehanskih lastnostih ne podaja sestave.
> GJS je litina s kroglastim grafitom, $400\,\mathrm{MPa}$ je najmanjša natezna trdnost, $15\,\%$ najmanjši raztezek.

? Razvrsti jekla po deležu ogljika od najmanjšega do največjega: X5CrNi18-10, C45, 16MnCr5, X153CrMoV12.
- C45, 16MnCr5, X5CrNi18-10, X153CrMoV12
~ C45 ima $0{,}45\,\%$ C, kar je več kot $0{,}16\,\%$ pri 16MnCr5.
+ X5CrNi18-10, 16MnCr5, C45, X153CrMoV12
- 16MnCr5, X5CrNi18-10, C45, X153CrMoV12
~ X5 pomeni $0{,}05\,\%$ C, kar je manj kot $0{,}16\,\%$.
- X153CrMoV12, C45, 16MnCr5, X5CrNi18-10
~ To je obratni vrstni red; X153 pomeni $1{,}53\,\%$ C, največ.
> Deleži so $0{,}05$; $0{,}16$; $0{,}45$ in $1{,}53\,\%$ ogljika.

? Kaj se zgodi, če avstenitnemu nerjavnemu jeklu X5CrNi18-10 odvzamemo skoraj ves nikelj, krom pa ostane $18\,\%$?
- Jeklo ni več nerjavno.
~ Nerjavnost daje krom, ki ga je še vedno $18\,\%$.
+ Jeklo postane feritno in magnetno, a ostane nerjavno.
- Jeklo postane martenzitno in ga lahko kalimo.
~ Za martenzit bi potrebovali več ogljika; pri $0{,}05\,\%$ C ostane ferit.
- Nič se ne spremeni, nikelj je le za lep videz.
~ Nikelj ohranja avstenit; brez njega se mreža spremeni.
> Tako dobimo feritno nerjavno jeklo, podobno X6Cr17.

? Koliko odstotkov mangana ima jeklo 20MnCr5?
- $5\,\%$
~ Število za simboli je pomnoženo s faktorjem; deli ga s $4$.
- $20\,\%$
~ $20$ je stokratnik deleža ogljika, torej $0{,}20\,\%$ C.
+ $1{,}25\,\%$
- $0{,}5\,\%$
~ Tu si delil z $10$, faktor za Mn pa je $4$.
> $\frac{5}{4} = 1{,}25\,\%$ Mn.

? Jeklo ima C $0{,}20\,\%$, Mn $1{,}2\,\%$, Cr, Mo, V, Ni in Cu pa zanemarljivo malo. Koliko je $\mathrm{CE}$ in ali je dobro varivo?
- $1{,}40$, slabo varivo
~ Mangan deliš s $6$, ne prišteješ celega.
+ $0{,}40$, dobro varivo
- $0{,}20$, dobro varivo
~ Pozabil si mangan; ta prispeva $\frac{1{,}2}{6} = 0{,}2$.
- $0{,}60$, potrebno predgrevanje
~ Mangan si delil s $3$ (kot silicij pri litinah): $\frac{1{,}2}{3} = 0{,}4$. Pri jeklu je $\frac{1{,}2}{6} = 0{,}2$, zato $\mathrm{CE} = 0{,}40$.
> $\mathrm{CE} = 0{,}20 + \frac{1{,}2}{6} = 0{,}40 \le 0{,}45$.

:::simboli
\mathrm{CE} | ogljikov ekvivalent | | – | masni deleži v odstotkih
\mathrm{CE}_\mathrm{L} | ogljikov ekvivalent litine | \mathrm{CE}_\mathrm{L} = C + \frac{\mathrm{Si} + \mathrm{P}}{3} | – | primerjava z evtektikom pri 4,3
C | masni delež ogljika (v odstotkih) | | –
\mathrm{Mn}, \mathrm{Cr}, \mathrm{Mo}, \mathrm{V}, \mathrm{Ni}, \mathrm{Cu}, \mathrm{Si}, \mathrm{P} | masni deleži legirnih elementov (v odstotkih) | | –
R_\mathrm{e} | meja tečenja | | MPa
R_\mathrm{m} | natezna trdnost | | MPa
F | dopustna sila | F = \frac{R_\mathrm{e} \cdot A}{\nu} | N
A | prečni prerez palice | | mm^2
\nu | varnostni faktor | | –
d | premer palice | d = \sqrt{\frac{4A}{\pi}} | mm
m' | masa na meter | | kg/m
:::
