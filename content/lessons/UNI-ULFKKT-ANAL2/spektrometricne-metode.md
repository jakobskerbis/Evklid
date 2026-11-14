---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na terenski vaji ob jezeru sošolec trdi: »Prvi meter vode vpije $30\,\%$ sončne svetlobe. Torej trije metri vpijejo $90\,\%$, šest metrov pa že vso.« Sliši se logično, a ni res. Do konca razlage boš znal izračunati, koliko svetlobe v resnici pride do globine treh metrov.

Isto vprašanje si postavljamo v laboratoriju. Koliko klorofila je v vzorcu jezera? Koliko cinka odnaša potok iz opuščenega rudnika? Vzorcu ne moremo pogledati v notranjost, lahko pa izmerimo, koliko svetlobe prepusti. **Spektrometrične metode** iz te meritve izračunajo koncentracijo. So hitre in poceni, zato so v analizi voda, tal in zraka najpogostejše.

## Razlaga

**1. Prepustnost.** Na vzorec posvetimo svetlobo z jakostjo $I_0$. Na drugi strani izmerimo jakost $I$, ki je manjša, ker je del svetlobe vzorec vpil. Razmerje

$$T = \frac{I}{I_0}$$

imenujemo **prepustnost** (transmitanca). Je število med $0$ in $1$, pogosto ga pišemo v odstotkih ($\%T$).

*Hiter preizkus:* detektor kaže $I = 20$, brez vzorca $I_0 = 80$ (poljubne enote). Kolikšen je $\%T$? (Odgovor: $25\,\%$.)

**2. Plast za plastjo.** Vodo v mislih razrežemo na enake plasti po en meter. Vsaka plast prepusti enak *delež* svetlobe, ki nanjo pade, ne enake količine.

| plast | delež svetlobe za plastjo | vpito skupaj |
|---|---|---|
| 0 m | $1{,}000$ | $0\,\%$ |
| 1 m | $0{,}700$ | $30\,\%$ |
| 2 m | $0{,}490$ | $51\,\%$ |
| 3 m | $0{,}343$ | $65{,}7\,\%$ |

Druga plast vpije $30\,\%$ od preostalih $70\,\%$, torej le $21\,\%$ začetne svetlobe. Sošolec se je zmotil, ker je odstotke seštel, namesto da bi jih množil. Prepustnost z debelino pada **eksponentno** in nikoli ne doseže nič.

:::premisli
Koliko svetlobe bi po tem pravilu prišlo do globine šestih metrov? Napovej, ali je to bliže $0\,\%$ ali $10\,\%$.
---
$0{,}7^6 \approx 0{,}118$, torej približno $12\,\%$. Šest metrov ne vpije vse svetlobe, ampak okoli $88\,\%$.
:::

**3. Absorbanca.** Množenje je nerodno, zato vpeljemo logaritem. **Absorbanca** je

$$A = -\log_{10} T = \log_{10}\frac{I_0}{I}$$

Za plasti iz tabele dobimo $A = 0{,}155$; $0{,}310$ in $0{,}465$. Absorbance se pri zaporednih plasteh **seštevajo**, zato absorbanca raste premo sorazmerno z debelino.

*Hiter preizkus:* $T = 0{,}10$. Koliko je $A$? (Odgovor: $1{,}0$.)

**4. Beer-Lambertov zakon.** Absorbanca je sorazmerna tudi s koncentracijo absorbirajoče snovi: dvakrat bolj koncentrirana raztopina vpije enako kot dvakrat debelejša plast prvotne, saj svetloba v obeh primerih sreča dvakrat več molekul. Oboje združi **Beer-Lambertov zakon**:

$$A = \varepsilon \, b \, c$$

Tu je $b$ dolžina poti skozi vzorec (debelina kivete, običajno $1{,}00\,\mathrm{cm}$), $c$ množinska koncentracija v $\mathrm{mol/L}$ in $\varepsilon$ **molarni absorpcijski koeficient** v $\mathrm{L\,mol^{-1}\,cm^{-1}}$. Koeficient $\varepsilon$ je lastnost snovi pri izbrani valovni dolžini: velik $\varepsilon$ pomeni, da snov to svetlobo močno vpija.

*Natančna izjava:* naj vzporeden snop monokromatske svetlobe pravokotno prehaja skozi homogeno, nesipajočo raztopino, v kateri svetlobo vpija snov s koncentracijo $c$, ki ne sodeluje v kemijskih ravnotežjih, in naj bo raztopina razredčena (navadno $c < 0{,}01\,\mathrm{mol/L}$). Potem je $A = \varepsilon\, b\, c$. *Izpeljava:* tanka plast debeline $\mathrm{d}x$ vpije delež svetlobe, sorazmeren s številom molekul na poti, $\mathrm{d}I = -k\,c\,I\,\mathrm{d}x$, kjer je $k$ konstanta sorazmernosti (ne naklon umeritvene premice iz točke 7). Ločimo spremenljivki in integriramo od $0$ do $b$: $\ln(I_0/I) = k\,c\,b$. Z desetiškim logaritmom je $A = \log_{10}(I_0/I) = \dfrac{k}{\ln 10}\,b\,c$, torej $\varepsilon = k/\ln 10$. Odstopanja so kemijska (ravnotežja, interakcije pri visokih $c$) ali instrumentalna (polikromatska in sipana svetloba). Sipana svetloba pride do detektorja mimo vzorca in se prišteje k $I_0$ in $I$; ker je $I$ manjši, ga relativno poveča bolj, zato je izmerjena $A$ manjša od prave.

**Aditivnost absorbanc.** Če je v raztopini več absorbirajočih snovi, ki med seboj ne reagirajo, in za vsako velja Beer-Lambertov zakon, je pri vsaki valovni dolžini $A(\lambda) = b\sum_i \varepsilon_i(\lambda)\,c_i$. Dokaz: v izpeljavi je zdaj $\mathrm{d}I = -\big(\sum_i k_i c_i\big) I\,\mathrm{d}x$. Zmes dveh snovi zato določimo z meritvijo pri dveh valovnih dolžinah in rešimo sistem dveh linearnih enačb.

:::premisli
Raztopino razredčimo na polovico in jo izmerimo v dvakrat daljši kiveti. Kaj se zgodi z absorbanco?
---
Ostane enaka. Produkt $b \cdot c$ se ne spremeni: svetloba na poti sreča enako število molekul.
:::

**5. Umeritvena premica.** V praksi $\varepsilon$ redko vzamemo iz tabel. Izmerimo nekaj **standardov** z znano koncentracijo, narišemo $A$ proti $c$ in dobimo premico skozi izhodišče. Koncentracijo vzorca odčitamo s premice. Linearnost velja približno do $A \approx 1$; pri večjih absorbancah pride do detektorja premalo svetlobe in premica se ukrivi, zato vzorec razredčimo.

*Hiter preizkus:* standard s $c = 2{,}0\,\mathrm{mg/L}$ ima $A = 0{,}10$. Kolikšna je $c$ vzorca z $A = 0{,}30$? (Odgovor: $6{,}0\,\mathrm{mg/L}$.)

**6. UV-VIS spektrometrija.** Molekule vpijajo ultravijolično ($200$–$400\,\mathrm{nm}$) in vidno svetlobo ($400$–$800\,\mathrm{nm}$), ko elektroni preskočijo v višje energijsko stanje. Spektrometer ima vir (devterijeva žarnica za UV, volframova za VIS), **monokromator**, ki izbere eno valovno dolžino, kiveto in detektor.

Graf $A$ proti $\lambda$ je **absorpcijski spekter**; njegovi vrhovi so široki nekaj deset nanometrov. Merimo pri vrhu, $\lambda_{\max}$, kjer je metoda najbolj občutljiva. Raztopina ima barvo, komplementarno vpiti svetlobi: klorofil vpija modro in rdečo, zato je zelen. Za UV potrebujemo kremenove kivete, ker steklo UV vpija.

*Hiter preizkus:* zakaj ne merimo na pobočju vrha? (Odgovor: tam majhen premik $\lambda$ močno spremeni $A$.)

**7. Atomska absorpcijska spektrometrija (AAS).** Kovine v vodi so ioni, ki vidne svetlobe skoraj ne vpijajo. Pri AAS vzorec razpršimo v plamen ali segrejemo v grafitni kiveti (majhni grafitni cevki, ki jo segreje električni tok), da nastanejo prosti **atomi** v osnovnem stanju. Atomi vpijajo le pri zelo ostrih **črtah**, širokih okoli $0{,}005\,\mathrm{nm}$. Zato vir ni žarnica z zveznim spektrom, ampak **votla katodna žarnica** iz iste kovine, ki seva prav te črte. Za vsak element potrebujemo svojo žarnico. Metoda je zelo selektivna: druge kovine pri tej črti ne vpijajo. Koncentracijo spet dobimo z umeritveno premico $A = k\,c$.

## Rešeni primeri

### Primer 1 (lažji): voda z algami

Vzorec jezerske vode s cvetenjem alg prepusti $40{,}0\,\%$ svetlobe pri $665\,\mathrm{nm}$. Kolikšna je absorbanca? Kolikšna bi bila pri $\%T = 4{,}0\,\%$?

**Podatki:** $\%T_1 = 40{,}0\,\%$, $\%T_2 = 4{,}0\,\%$, $\lambda = 665\,\mathrm{nm}$
**Iščemo:** absorbanci $A_1$ in $A_2$

:::formula
$A = -\log_{10} T$, kjer je $T$ delež (ne odstotek)
:::

**Rešitev:**

1. Odstotke pretvorimo v delež: $T_1 = 0{,}400$, $T_2 = 0{,}040$.
2. $A_1 = -\log_{10} 0{,}400 \approx 0{,}398$.
3. $A_2 = -\log_{10} 0{,}040 \approx 1{,}398$; desetkrat manjša prepustnost doda absorbanci natanko $1$.
4. Odgovor: absorbanca je $0{,}398$ oziroma $1{,}40$. Drugi vzorec je že nad mejo linearnosti, zato bi ga razredčili.

### Primer 2: klorofil v ekstraktu

Klorofil iz alg ekstrahiramo v aceton. Ekstrakt ima v kiveti $1{,}00\,\mathrm{cm}$ pri $663\,\mathrm{nm}$ absorbanco $0{,}312$. Molarni absorpcijski koeficient klorofila a je tam $7{,}8 \cdot 10^4\,\mathrm{L\,mol^{-1}\,cm^{-1}}$, molska masa $893{,}5\,\mathrm{g/mol}$. Kolikšna je koncentracija v $\mathrm{mol/L}$ in v $\mathrm{mg/L}$?

**Podatki:** $A = 0{,}312$, $b = 1{,}00\,\mathrm{cm}$, $\varepsilon = 7{,}8 \cdot 10^4\,\mathrm{L\,mol^{-1}\,cm^{-1}}$, $M = 893{,}5\,\mathrm{g/mol}$
**Iščemo:** $c$ in masno koncentracijo $\gamma$

:::formula
$c = \dfrac{A}{\varepsilon\, b}$, nato $\gamma = c \cdot M$
:::

**Rešitev:**

1. Beer-Lambertov zakon obrnemo za $c$: $c = \dfrac{0{,}312}{7{,}8 \cdot 10^4 \cdot 1{,}00}\,\mathrm{mol/L} = 4{,}0 \cdot 10^{-6}\,\mathrm{mol/L}$.
2. Pretvorimo v maso: $\gamma = 4{,}0 \cdot 10^{-6}\,\mathrm{mol/L} \cdot 893{,}5\,\mathrm{g/mol} \approx 3{,}57 \cdot 10^{-3}\,\mathrm{g/L}$.
3. Odgovor: ekstrakt vsebuje $4{,}0 \cdot 10^{-6}\,\mathrm{mol/L}$ klorofila a, kar je približno $3{,}6\,\mathrm{mg/L}$.

### Primer 3 (težji): cink v potoku pod rudnikom

Cink v potoku določamo z AAS pri $213{,}9\,\mathrm{nm}$. Standardi $0{,}20$; $0{,}40$ in $0{,}60\,\mathrm{mg/L}$ dajo absorbance $0{,}088$; $0{,}176$ in $0{,}264$. Vzorec je bil premočan, zato smo $5{,}00\,\mathrm{mL}$ vode razredčili na $50{,}0\,\mathrm{mL}$. Razredčeni vzorec ima $A = 0{,}143$. Koliko cinka je v potoku? Vzorec iz drugega dela potoka po enaki razredčitvi da $A = 0{,}350$. Kako ga pravilno izmeriš in kolikšno razredčitev izbereš?

**Podatki:** standardi $(0{,}20;\,0{,}088)$; $(0{,}40;\,0{,}176)$; $(0{,}60;\,0{,}264)$ v $\mathrm{mg/L}$ in enotah $A$; $V_1 = 5{,}00\,\mathrm{mL}$, $V_2 = 50{,}0\,\mathrm{mL}$, $A_{\mathrm{vz}} = 0{,}143$; drugi vzorec $A = 0{,}350$
**Iščemo:** masno koncentracijo cinka v potoku $\gamma_0$; primerno razredčitev drugega vzorca

:::formula
Umeritvena premica $A = k\,\gamma$; faktor razredčitve $f = \dfrac{V_2}{V_1}$; $\gamma_0 = f \cdot \gamma$
:::

**Rešitev:**

1. Naklon premice: $k = \dfrac{0{,}088}{0{,}20} = 0{,}44\,\mathrm{L/mg}$; vsi trije standardi dajo isti $k$, zato smo v linearnem območju.
2. Koncentracija v razredčenem vzorcu: $\gamma = \dfrac{0{,}143}{0{,}44}\,\mathrm{mg/L} = 0{,}325\,\mathrm{mg/L}$.
3. Faktor razredčitve: $f = \dfrac{50{,}0}{5{,}00} = 10$, ker smo vzorec desetkrat razredčili.
4. $\gamma_0 = 10 \cdot 0{,}325\,\mathrm{mg/L} = 3{,}25\,\mathrm{mg/L}$.
5. Drugi vzorec: $A = 0{,}350$ je nad najvišjim standardom ($0{,}264$). Zunaj območja standardov linearnosti nismo preverili, zato rezultat služi le kot ocena: $\gamma \approx 0{,}350/0{,}44 \approx 0{,}80\,\mathrm{mg/L}$, v potoku okoli $8{,}0\,\mathrm{mg/L}$.
6. Da bo razredčeni vzorec pod $0{,}60\,\mathrm{mg/L}$, potrebujemo $f \ge 7{,}95/0{,}60 \approx 13{,}3$ ($7{,}95\,\mathrm{mg/L} = 10 \cdot 0{,}795\,\mathrm{mg/L}$ je nezaokrožena ocena iz koraka 5). Izberemo $f = 20$ ($5{,}00\,\mathrm{mL}$ na $100{,}0\,\mathrm{mL}$): pričakovana koncentracija $\approx 0{,}40\,\mathrm{mg/L}$ in $A \approx 0{,}175$, sredina umeritvenega območja, kjer je negotovost najmanjša.
7. Odgovor: v potoku je približno $3{,}3\,\mathrm{mg/L}$ cinka. Drugi vzorec ponovno razredčimo $20$-krat in izmerimo; prva ocena je okoli $8\,\mathrm{mg/L}$.

### Primer 4: zdaj ti – fosfat v jezeru

Fosfat v jezeru pretvorimo v modro obarvan kompleks z $\varepsilon = 2{,}0 \cdot 10^4\,\mathrm{L\,mol^{-1}\,cm^{-1}}$ pri $880\,\mathrm{nm}$. Ker je fosfata malo, merimo v kiveti $5{,}00\,\mathrm{cm}$. Prepustnost je $31{,}6\,\%$. Kolikšna je koncentracija fosfata?

**Podatki:** $\varepsilon = 2{,}0 \cdot 10^4\,\mathrm{L\,mol^{-1}\,cm^{-1}}$, $b = 5{,}00\,\mathrm{cm}$, $\%T = 31{,}6\,\%$
**Iščemo:** množinsko koncentracijo $c$

:::formula
$A = -\log_{10} T$, nato $c = \dfrac{A}{\varepsilon\, b}$
:::

**Rešitev:**

1. Prepustnost kot delež: $T = 0{,}316$.
2. Daljša kiveta poveča absorbanco, zato izmerimo tudi zelo nizke koncentracije.
3. Izračunaj $A$ in nato $c$ sam, potem preveri:

:::premisli
Koliko sta $A$ in $c$?
---
$A = -\log_{10} 0{,}316 \approx 0{,}500$ in $c = \dfrac{0{,}500}{2{,}0 \cdot 10^4 \cdot 5{,}00}\,\mathrm{mol/L} = 5{,}0 \cdot 10^{-6}\,\mathrm{mol/L}$.
:::

## Pogoste napake

- **»Absorbanca je odstotek vpite svetlobe.«** Kdor tako misli, pri $A = 0{,}30$ reče, da se vpije $30\,\%$. Absorbanca je logaritem: $A = 0{,}30$ pomeni $T \approx 0{,}50$, vpije se polovica. Vedno računaj prek $T = 10^{-A}$.
- **Prepustnost obravnavaš kot linearno.** Če podvojiš $c$ ali $b$, se $T$ ne razpolovi, ampak kvadrira ($0{,}60 \to 0{,}36$). Linearna je le absorbanca.
- **Merjenje zunaj linearnega območja.** Pri $A$ nad približno $1$ je premica ukrivljena in koncentracija pride prenizka. Vzorec razredči in upoštevaj faktor razredčitve.
- **Pozabljen faktor razredčitve.** S premice odčitaš koncentracijo v kiveti, ne v naravnem vzorcu. Pomnoži s $V_{\text{končni}}/V_{\text{vzorca}}$.
- **»AAS izmeri vse kovine naenkrat.«** Votla katodna žarnica seva črte enega elementa, zato za vsak element zamenjamo žarnico. AAS meri atome, ne molekule ali ione v raztopini.

## Povzetek

- Prepustnost $T = I/I_0$; absorbanca $A = -\log_{10} T$.
- Beer-Lambertov zakon: $A = \varepsilon\, b\, c$; absorbanca je sorazmerna z dolžino poti in koncentracijo, prepustnost pada eksponentno.
- Koncentracijo dobimo z umeritveno premico iz standardov; linearno območje približno do $A \approx 1$, sicer razredčimo in množimo s faktorjem razredčitve.
- UV-VIS: molekule, široki vrhovi, merimo pri $\lambda_{\max}$; za UV kremenova kiveta.
- AAS: prosti atomi v plamenu ali grafitni kiveti, ostre črte, votla katodna žarnica za vsak element posebej; zelo selektivna metoda za kovine.

## Za izpit

Znati moraš povedati:

- definicije prepustnosti, absorbance in molarnega absorpcijskega koeficienta z enotami;
- Beer-Lambertov zakon z vsemi pogoji in izpeljavo iz $\mathrm{d}I = -k\,c\,I\,\mathrm{d}x$;
- aditivnost absorbanc s pogojem in določitev dvokomponentne zmesi pri dveh valovnih dolžinah;
- vzroke odstopanj (kemijske in instrumentalne) in zakaj sipana svetloba zniža izmerjeno $A$;
- zgradbo UV-VIS spektrometra in AAS ter zakaj AAS potrebuje votlo katodno žarnico.

### Naloga 1

$1{,}000\,\mathrm{g}$ jekla raztopimo, mangan oksidiramo do $\mathrm{MnO_4^-}$, krom do $\mathrm{Cr_2O_7^{2-}}$ in raztopino razredčimo na $250{,}0\,\mathrm{mL}$. V kiveti $1{,}00\,\mathrm{cm}$ izmerimo $A_{545} = 0{,}698$ in $A_{440} = 0{,}385$. Molarni absorpcijski koeficienti v $\mathrm{L\,mol^{-1}\,cm^{-1}}$: $\mathrm{MnO_4^-}$: $\varepsilon_{545} = 2350$, $\varepsilon_{440} = 95$; $\mathrm{Cr_2O_7^{2-}}$: $\varepsilon_{545} = 11$, $\varepsilon_{440} = 370$. $M(\mathrm{Mn}) = 54{,}94\,\mathrm{g/mol}$, $M(\mathrm{Cr}) = 52{,}00\,\mathrm{g/mol}$. Izračunaj masna deleža Mn in Cr v jeklu.

**Rešitev:**

1. Ioni med seboj ne reagirajo, zato se absorbanci seštevata: $0{,}698 = 2350\,c_1 + 11\,c_2$ in $0{,}385 = 95\,c_1 + 370\,c_2$ ($c_1$ za $\mathrm{MnO_4^-}$, $c_2$ za $\mathrm{Cr_2O_7^{2-}}$, $b = 1{,}00\,\mathrm{cm}$).
2. Determinanta sistema: $D = 2350 \cdot 370 - 11 \cdot 95 = 868\,455$.
3. $c_1 = \dfrac{0{,}698 \cdot 370 - 11 \cdot 0{,}385}{868\,455}\,\mathrm{mol/L} \approx 2{,}925 \cdot 10^{-4}\,\mathrm{mol/L}$.
4. $c_2 = \dfrac{2350 \cdot 0{,}385 - 95 \cdot 0{,}698}{868\,455}\,\mathrm{mol/L} \approx 9{,}654 \cdot 10^{-4}\,\mathrm{mol/L}$.
5. Kontrola pri $545\,\mathrm{nm}$: $2350 \cdot 2{,}925 \cdot 10^{-4} + 11 \cdot 9{,}654 \cdot 10^{-4} \approx 0{,}687 + 0{,}011 = 0{,}698$.
6. Mangan: $n = 2{,}925 \cdot 10^{-4} \cdot 0{,}2500\,\mathrm{mol} \approx 7{,}31 \cdot 10^{-5}\,\mathrm{mol}$, $m = 7{,}31 \cdot 10^{-5} \cdot 54{,}94\,\mathrm{g} \approx 4{,}02\,\mathrm{mg}$, $w = 0{,}402\,\%$.
7. Krom: vsak $\mathrm{Cr_2O_7^{2-}}$ ima dva atoma Cr, zato $n(\mathrm{Cr}) = 2 \cdot 9{,}654 \cdot 10^{-4} \cdot 0{,}2500\,\mathrm{mol} \approx 4{,}83 \cdot 10^{-4}\,\mathrm{mol}$, $m \approx 25{,}1\,\mathrm{mg}$, $w \approx 2{,}51\,\%$.
8. Odgovor: jeklo vsebuje okoli $0{,}40\,\%$ mangana in $2{,}51\,\%$ kroma.

### Naloga 2

Natančno navedi Beer-Lambertov zakon z vsemi pogoji in ga izpelji. Nato utemelji, ali sipana svetloba, ki doseže detektor mimo vzorca, povzroči pozitivno ali negativno odstopanje, in izračunaj izmerjeno absorbanco pri pravih $A = 0{,}50$ in $A = 2{,}00$, če sipana svetloba znaša $1{,}0\,\%$ od $I_0$.

**Rešitev:**

1. Pogoji: monokromatska, vzporedna svetloba pravokotno na kiveto; homogena, nesipajoča, razredčena raztopina; absorbirajoča snov ne sodeluje v ravnotežjih.
2. Plast $\mathrm{d}x$ vpije delež, sorazmeren s koncentracijo: $\mathrm{d}I/I = -k\,c\,\mathrm{d}x$.
3. Integracija od $I_0$ do $I$ in od $0$ do $b$: $\ln(I_0/I) = k\,c\,b$; z $\log_{10}$ je $A = \varepsilon\,b\,c$, $\varepsilon = k/\ln 10$.
4. S sipano svetlobo $I_\mathrm{s}$ detektor meri $A_\mathrm{izm} = \log_{10}\dfrac{I_0 + I_\mathrm{s}}{I + I_\mathrm{s}}$. Ker je $I_\mathrm{s}$ v imenovalcu relativno pomembnejši ($I < I_0$), je $A_\mathrm{izm} < A$: odstopanje je negativno.
5. Pri $A = 0{,}50$ je $I/I_0 = 0{,}316$: $A_\mathrm{izm} = \log_{10}(1{,}01/0{,}326) \approx 0{,}491$, napaka okoli $2\,\%$.
6. Pri $A = 2{,}00$ je $I/I_0 = 0{,}0100$: $A_\mathrm{izm} = \log_{10}(1{,}01/0{,}0200) \approx 1{,}70$, napaka $15\,\%$.
7. Odgovor: sipana svetloba zniža izmerjeno absorbanco, najbolj pri velikih $A$; zato umeritvena premica nad $A \approx 1$ zavije navzdol in tako močne vzorce razredčimo.

## Drugače: Uporaba v stroki

**Analiza voda.** Nitrat, amonij in fosfat (z molibdenovim modrilom, kot v Primeru 4) v pitni in odpadni vodi rutinsko določajo fotometrično po standardiziranih postopkih.

**Farmacija in biotehnologija.** Vsebnost učinkovine v tabletah in sproščanje pri preizkusu raztapljanja merijo z UV pri $\lambda_{\max}$. Čistost izolirane DNA ocenijo z razmerjem $A_{260}/A_{280}$, ki je za čisto DNA okoli $1{,}8$.

**Kovine v sledovih.** AAS z grafitno kiveto določa svinec v krvi in kadmij v živilih na ravni $\mathrm{µg/L}$; pri zahtevni matrici uporabimo metodo standardnega dodatka: znane količine kovine dodamo v alikvote samega vzorca, da standardi in vzorec delijo isto matrico.

## Drugače: Na sliki

Pot svetlobe v obeh napravah si nariši kot verigo:

```
UV-VIS:  žarnica (zvezni spekter) → monokromator → kiveta z raztopino → detektor
AAS:     votla katodna žarnica (črte) → plamen z atomi → monokromator → detektor
```

Pri UV-VIS monokromator stoji *pred* vzorcem in izbere eno barvo iz mavrice. Pri AAS stoji *za* plamenom: plamen sam sveti, monokromator pa izloči vse razen črte elementa.

Graf $A$ proti $c$ je premica skozi izhodišče, ki se pri velikih $A$ ukrivi navzdol. Graf $T$ proti $c$ je krivulja, ki se kot senca v vse globljem jezeru bliža nič, a je nikoli ne doseže.

## Drugače: Bolj natančno

Izpeljava v razlagi predpostavi monokromatsko svetlobo, razredčeno raztopino brez interakcij med molekulami in snov, ki ne sodeluje v ravnotežjih. Odstopanja nastanejo zaradi končne širine pasu monokromatorja, sipane svetlobe, ki doseže detektor mimo vzorca, in kemijskih ravnotežij (npr. protolize barvila).

Pri AAS je absorpcijska črta široka le okoli $0{,}005\,\mathrm{nm}$, pas monokromatorja pa okoli $0{,}2\,\mathrm{nm}$. Iz zveznega vira bi atomi vpili le drobec svetlobe v tem pasu, zato bi se signal komaj spremenil. Votla katodna žarnica seva črto, ožjo od absorpcijske, zato Beer-Lambertov zakon velja tudi za atome. Grafitna kiveta zadrži atome dlje na poti žarka kot plamen, zato doseže $100$- do $1000$-krat nižje meje zaznave.

## Preveri se

? Laboratorij bi rad z AAS v istem vzorcu določil svinec in kadmij. Kaj od naslednjega velja?
- Z eno žarnico z zveznim spektrom izmerimo več kovin hkrati.
~ To velja za UV-VIS. Atomske črte so tako ozke, da potrebujemo vir, ki seva prav črto izbranega elementa.
+ Za vsak element potrebujemo votlo katodno žarnico iz tega elementa.
- Meri absorpcijo ionov v raztopini, zato plamen ni nujen.
~ Ioni v raztopini ne vpijajo pri atomskih črtah. Plamen ali grafitna kiveta naredi proste atome.
> Votla katodna žarnica seva ostre črte istega elementa, ki jih atomi v plamenu vpijejo.

? Raztopina ima $\varepsilon = 2{,}0 \cdot 10^4\,\mathrm{L\,mol^{-1}\,cm^{-1}}$, $b = 1{,}00\,\mathrm{cm}$ in $c = 2{,}5 \cdot 10^{-5}\,\mathrm{mol/L}$. Kolikšna je absorbanca?
- $0{,}50\,\%$
~ Absorbanca ni odstotek; je brezdimenzijsko število.
+ $0{,}50$
- $0{,}32$
~ $0{,}32$ je prepustnost $T = 10^{-0{,}50}$, ne absorbanca.
- $8{,}0 \cdot 10^{8}$
~ Koncentracijo si delil namesto množil. Velja $A = \varepsilon\, b\, c$.
> $A = 2{,}0 \cdot 10^4 \cdot 1{,}00 \cdot 2{,}5 \cdot 10^{-5} = 0{,}50$.

? Sošolec piše: »Vzorec ima v kiveti $1\,\mathrm{cm}$ prepustnost $0{,}60$. V kiveti $2\,\mathrm{cm}$ bo prepustnost $0{,}60/2 = 0{,}30$.« Kje je napaka?
- Napake ni, prepustnost je obratno sorazmerna z debelino.
~ Sorazmerna z debelino je absorbanca, ne prepustnost. Druga plast prepusti delež od že oslabljene svetlobe.
+ Podvoji se absorbanca, zato je nova prepustnost $0{,}60^2 = 0{,}36$.
- Prepustnost se ne spremeni, ker je koncentracija enaka.
~ Daljša pot pomeni več molekul na poti žarka, zato se vpije več svetlobe.
> $A$ se podvoji z $0{,}222$ na $0{,}444$, kar da $T = 0{,}36$. Deleži se množijo, ne delijo.

? V čem se UV-VIS in AAS najbolj razlikujeta?
- UV-VIS ne uporablja Beer-Lambertovega zakona, AAS ga.
~ Obe metodi temeljita na istem zakonu $A = \varepsilon\, b\, c$ oziroma umeritveni premici $A = k\,c$.
- AAS meri molekule, UV-VIS atome.
~ Ravno obratno: UV-VIS meri molekule v raztopini, AAS proste atome.
+ UV-VIS meri molekule s širokimi vrhovi, AAS proste atome z zelo ostrimi črtami.
> Zaradi ostrih črt je AAS zelo selektivna za posamezne kovine, UV-VIS pa je primerna za obarvane ali UV-aktivne molekule.

? Vzorec deževnice ima pri UV-VIS meritvi $A = 1{,}8$, zunaj umeritvene premice (do $A = 1{,}0$). Kaj narediš?
- Iz absorbance izračunam koncentracijo, saj zakon velja pri vseh $A$.
~ Pri velikih $A$ pride do detektorja premalo svetlobe in premica se ukrivi. Rezultat bi bil napačen.
+ Vzorec razredčim, ponovno izmerim in rezultat pomnožim s faktorjem razredčitve.
- Uporabim daljšo kiveto, da bo meritev natančnejša.
~ Daljša kiveta absorbanco še poveča. Pri premočnem vzorcu potrebuješ krajšo kiveto ali razredčitev.
> Z razredčitvijo spraviš $A$ v linearno območje; koncentracijo v izvirnem vzorcu dobiš z množenjem s faktorjem razredčitve.

:::simboli
T | prepustnost (transmitanca) | T = \frac{I}{I_0} | – | število med 0 in 1; v odstotkih %T
I | jakost svetlobe za vzorcem | | | v poljubnih enotah detektorja, enakih kot I₀
I_0 | jakost svetlobe pred vzorcem (vpadna jakost) | | | v poljubnih enotah detektorja
A | absorbanca | A = -\log_{10} T = \varepsilon\, b\, c | – | linearna približno do A ≈ 1
\varepsilon | molarni absorpcijski koeficient | \varepsilon = \frac{A}{b\, c} | L\,mol^{-1}\,cm^{-1} | lastnost snovi pri izbrani valovni dolžini
b | dolžina poti skozi vzorec (debelina kivete) | | cm | običajno 1,00 cm
c | množinska koncentracija | c = \frac{A}{\varepsilon\, b} | mol/L
\gamma | masna koncentracija | \gamma = c \cdot M | g/L | v vodah pogosto v mg/L
\gamma_0 | masna koncentracija v prvotnem vzorcu | \gamma_0 = f \cdot \gamma | mg/L
M | molska masa | | g/mol
k | naklon umeritvene premice | k = \frac{A}{\gamma} | L/mg | odčitamo ga iz standardov
f | faktor razredčitve | f = \frac{V_2}{V_1} | – | kolikokrat smo vzorec razredčili
V_1 | prostornina odpipetiranega vzorca | | mL
V_2 | prostornina bučke po razredčenju | | mL
:::
