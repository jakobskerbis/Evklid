---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na ekskurziji na observatorij vam tehnik pokaže motor, ki vrti kupolo teleskopa. Priključen je s tremi faznimi vodniki in ničelnim vodnikom. Pove, da je med vsakim faznim vodnikom in ničlo $230\,\mathrm V$.

Sošolec Matej takoj zaključi: »Med dvema faznima vodnikoma je potem $460\,\mathrm V$, ker se napetosti seštejeta.« Tehnik izmeri. Voltmeter pokaže približno $400\,\mathrm V$.

Kdo ima prav in zakaj? Odgovor je v tem, da napetosti nista v fazi. Skoraj vsa električna energija se proizvaja, prenaša in porablja v trifazni obliki. Tako delajo motorji pogonov teleskopov in radijskih anten, kompresorji hladilnikov za detektorje in vsa daljnovodna mreža. Kdor razume trifazni sistem, zna izbrati vezavo motorja, dimenzionirati vodnike in izračunati moč.

## Razlaga

**Izhodišče: en vir.** Enofazni krog že poznaš. En vir s kazalcem $\underline{U}$ poganja tok $\underline{I} = \underline{U} / \underline{Z}$ po dveh vodnikih. Delovna moč je $P = U I \cos\varphi$, kjer je $\varphi$ kot impedance bremena. Trenutna moč pa niha z dvojno frekvenco: v vsaki periodi dvakrat pade, pri induktivnem ali kapacitivnem bremenu celo pod nič.

**Prva razlika: trije viri.** Generator ima tri enaka navitja, v prostoru zamaknjena za $120^\circ$. V njih se inducirajo tri napetosti z enako efektivno vrednostjo $U_{\mathrm{f}}$ in enako frekvenco. V času so zamaknjene za tretjino periode. S kazalci:

$$\underline{U}_1 = U_{\mathrm{f}} \angle 0^\circ$$

$$\underline{U}_2 = U_{\mathrm{f}} \angle -120^\circ$$

$$\underline{U}_3 = U_{\mathrm{f}} \angle 120^\circ$$

Takemu sistemu rečemo **simetrični trifazni sistem**. Kazalci tvorijo enakostranični trikotnik, zato je njihova vsota v vsakem trenutku nič:

$$\underline{U}_1 + \underline{U}_2 + \underline{U}_3 = 0$$

**Druga razlika: dve vrsti napetosti.** Pri vezavi v **zvezdo (Y)** so konci treh navitij zvezani v skupno točko, zvezdišče. Nanj je lahko priključen ničelni vodnik N. Napetost med faznim vodnikom in zvezdiščem je **fazna napetost** $U_{\mathrm{f}}$. Napetost med dvema faznima vodnikoma je **medfazna napetost** $U_{\mathrm{m}}$.

Tu je Matejeva napaka. Medfazna napetost je *razlika* kazalcev $\underline{U}_{12} = \underline{U}_1 - \underline{U}_2$, ne vsota njunih velikosti. Kazalca oklepata $120^\circ$. Razlika je osnovnica enakokrakega trikotnika s krakoma $U_{\mathrm{f}}$ in kotom $120^\circ$ med njima. Njena dolžina je $2 U_{\mathrm{f}} \cos 30^\circ$:

$$U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}}$$

Za naše omrežje: $\sqrt{3} \cdot 230\,\mathrm V \approx 398\,\mathrm V$. Zato pišemo $230/400\,\mathrm V$.

:::premisli
Matej je dobil $2 U_{\mathrm{f}}$. Pri kolikšnem faznem zamiku med kazalcema bi imel prav? Zakaj je pri $120^\circ$ razlika krajša?
---
Ker kazalca nista nasprotno usmerjena. Razlika dveh enako dolgih kazalcev je $2 U_{\mathrm{f}}$ le, če sta zamaknjena za $180^\circ$. Pri $120^\circ$ je razlika krajša, $\sqrt{3}\,U_{\mathrm{f}} \approx 1{,}73\, U_{\mathrm{f}}$.
:::

Pri zvezdi teče skozi vsak fazni vodnik isti tok kot skozi pripadajoče breme: $I_{\mathrm{v}} = I_{\mathrm{f}}$. Po ničelnem vodniku teče vsota vseh treh tokov.

:::premisli
Na zvezdo priključimo tri enake impedance. Napovej, kolikšen tok teče po ničelnem vodniku.
---
Nič. Trije tokovi so enako veliki in zamaknjeni za $120^\circ$, tako kot napetosti, zato je njihova vsota nič. Simetrično breme, na primer motor, zato ničelnega vodnika ne potrebuje.
:::

**Tretja razlika: vezava v trikot (Δ).** Zdaj breme priključimo drugače. Vsaka impedanca je med dvema faznima vodnikoma, zvezdišča in ničle ni. Z $U_{\mathrm{f}}$ tudi tu označimo napetost na eni fazi bremena, ta pa je zdaj kar medfazna: $U_{\mathrm{f}} = U_{\mathrm{m}}$. Tok v vodniku pa je razlika dveh tokov bremena ($\underline{I}_{12}$ teče skozi impedanco med vodnikoma 1 in 2), na primer $\underline{I}_1 = \underline{I}_{12} - \underline{I}_{31}$. Z istim trikotnikom kot pri napetostih dobiš $I_{\mathrm{v}} = \sqrt{3}\, I_{\mathrm{f}}$.

Pri zvezdi je $\sqrt{3}$ pri napetosti, pri trikotu pri toku:

| Količina | Zvezda (Y) | Trikot (Δ) |
|---|---|---|
| napetost bremena | $U_{\mathrm{m}} / \sqrt{3}$ | $U_{\mathrm{m}}$ |
| tok v vodniku | $I_{\mathrm{v}} = I_{\mathrm{f}}$ | $I_{\mathrm{v}} = \sqrt{3}\, I_{\mathrm{f}}$ |
| ničelni vodnik | možen | ga ni |

**Četrta razlika: moč.** Vsaka faza bremena prejme $U_{\mathrm{f}} I_{\mathrm{f}} \cos\varphi$, tako kot enofazni porabnik. Pri simetričnem bremenu so vse tri enake:

$$P = 3\, U_{\mathrm{f}} I_{\mathrm{f}} \cos\varphi$$

Na tablici in z merilniki pa so dostopne medfazna napetost in tok v vodniku. Če vstaviš zveze iz tabele, za obe vezavi dobiš isti izraz:

$$P = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi$$

Pri zvezdi na primer vstaviš $U_{\mathrm{f}} = U_{\mathrm{m}}/\sqrt{3}$ in $I_{\mathrm{f}} = I_{\mathrm{v}}$, ker je $3/\sqrt{3} = \sqrt{3}$. Pri trikotu se $\sqrt{3}$ skrajša pri toku.

Podobno sta jalova moč $Q = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \sin\varphi$ in navidezna moč $S = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}}$. Kot $\varphi$ je tudi tu kot impedance ene faze bremena. To je kot med fazno napetostjo in faznim tokom, ne med $U_{\mathrm{m}}$ in $I_{\mathrm{v}}$.

Še ena razlika od enofaznega kroga je pomembna v praksi. Trenutne moči treh faz se seštejejo v *stalno* vrednost, $p(t) = P$. Motor zato ne trese, kar je pri pogonu teleskopa zelo dobrodošlo. Za isto moč potrebuješ tudi manj bakra kot pri treh ločenih enofaznih krogih.

## Rešeni primeri

### Primer 1: grelnik v zvezdi

V kupoli observatorija greje zrak trifazni grelnik, da se na zrcalu ne nabira rosa. Ima tri grelne upore po $40\,\Omega$, vezane v zvezdo na omrežje $230/400\,\mathrm V$. Kolikšni so napetost na uporu, tok v vodniku in moč grelnika?

**Podatki:** $U_{\mathrm{m}} = 400\,\mathrm V$, $R = 40\,\Omega$, vezava v zvezdo, $\cos\varphi = 1$ (čisti upori)
**Iščemo:** fazno napetost $U_{\mathrm{f}}$, tok $I_{\mathrm{v}}$, moč $P$

:::formula
$U_{\mathrm{f}} = \dfrac{U_{\mathrm{m}}}{\sqrt{3}}$, $I_{\mathrm{v}} = I_{\mathrm{f}} = \dfrac{U_{\mathrm{f}}}{R}$, $P = 3\, U_{\mathrm{f}} I_{\mathrm{f}} \cos\varphi$
:::

**Rešitev:**

1. V zvezdi vsak upor dobi fazno napetost: $U_{\mathrm{f}} = \dfrac{400\,\mathrm V}{\sqrt{3}} \approx 230{,}94\,\mathrm V$.
2. Tok skozi upor je hkrati tok v vodniku: $I_{\mathrm{f}} = \dfrac{230{,}94\,\mathrm V}{40\,\Omega} \approx 5{,}774\,\mathrm A$.
3. Moč treh faz: $P = 3 \cdot 230{,}94\,\mathrm V \cdot 5{,}774\,\mathrm A \approx 4000\,\mathrm W$.
4. Kontrola z medfaznimi vrednostmi: $\sqrt{3} \cdot 400\,\mathrm V \cdot 5{,}774\,\mathrm A \approx 4000\,\mathrm W$.
5. Odgovor: na vsakem uporu je približno $231\,\mathrm V$, v vsakem vodniku teče $5{,}77\,\mathrm A$, grelnik ima moč $4\,\mathrm{kW}$.

### Primer 2: isti grelnik v trikotu

Ko je mraz hud, tehnik preklopi iste tri upore po $40\,\Omega$ v trikot. Omrežje je isto. Kolikšni so zdaj tok skozi upor, tok v vodniku in moč?

**Podatki:** $U_{\mathrm{m}} = 400\,\mathrm V$, $R = 40\,\Omega$, vezava v trikot, $\cos\varphi = 1$
**Iščemo:** fazni tok $I_{\mathrm{f}}$, tok $I_{\mathrm{v}}$, moč $P$

:::formula
$U_{\mathrm{f}} = U_{\mathrm{m}}$, $I_{\mathrm{f}} = \dfrac{U_{\mathrm{f}}}{R}$, $I_{\mathrm{v}} = \sqrt{3}\, I_{\mathrm{f}}$, $P = 3\, U_{\mathrm{f}} I_{\mathrm{f}}$
:::

**Rešitev:**

1. V trikotu je vsak upor med dvema faznima vodnikoma, zato je $U_{\mathrm{f}} = 400\,\mathrm V$.
2. Tok skozi upor: $I_{\mathrm{f}} = \dfrac{400\,\mathrm V}{40\,\Omega} = 10\,\mathrm A$.
3. Tok v vodniku je razlika dveh faznih tokov: $I_{\mathrm{v}} = \sqrt{3} \cdot 10\,\mathrm A \approx 17{,}32\,\mathrm A$.
4. Moč: $P = 3 \cdot 400\,\mathrm V \cdot 10\,\mathrm A = 12000\,\mathrm W$.
5. Primerjava z zvezdo: napetost na uporu je $\sqrt{3}$-krat večja, zato je tudi tok $\sqrt{3}$-krat večji. Moč na uporu je $3$-krat večja.
6. Odgovor: skozi vsak upor teče $10\,\mathrm A$, v vodniku $17{,}3\,\mathrm A$, moč je $12\,\mathrm{kW}$, trikrat več kot v zvezdi.

### Primer 3: pogon radijskega teleskopa

Azimutni pogon radijskega teleskopa poganja trifazni motor, vezan v trikot na omrežje $400\,\mathrm V$. Ampermeter na dovodnem vodniku kaže $12\,\mathrm A$, faktor moči je $0{,}82$. Izračunaj delovno, jalovo in navidezno moč ter velikost impedance enega navitja.

**Podatki:** $U_{\mathrm{m}} = 400\,\mathrm V$, $I_{\mathrm{v}} = 12\,\mathrm A$, $\cos\varphi = 0{,}82$, vezava v trikot
**Iščemo:** $P$, $Q$, $S$ in $|\underline{Z}|$

:::formula
$S = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}}$, $P = S \cos\varphi$, $Q = S \sin\varphi$, $I_{\mathrm{f}} = \dfrac{I_{\mathrm{v}}}{\sqrt{3}}$, $|\underline{Z}| = \dfrac{U_{\mathrm{f}}}{I_{\mathrm{f}}}$
:::

**Rešitev:**

1. Navidezna moč iz izmerjenih vrednosti: $S = \sqrt{3} \cdot 400\,\mathrm V \cdot 12\,\mathrm A \approx 8314\,\mathrm{VA}$.
2. Delovna moč: $P = 8314\,\mathrm{VA} \cdot 0{,}82 \approx 6817\,\mathrm W$.
3. Za jalovo moč potrebujemo sinus: $\sin\varphi = \sqrt{1 - 0{,}82^2} \approx 0{,}5724$, zato je $Q = 8314 \cdot 0{,}5724\,\mathrm{var} \approx 4759\,\mathrm{var}$.
4. Drugi del naloge je impedanca. V trikotu teče skozi navitje manjši tok kot v vodniku: $I_{\mathrm{f}} = \dfrac{12\,\mathrm A}{\sqrt{3}} \approx 6{,}928\,\mathrm A$.
5. Napetost na navitju je medfazna, $U_{\mathrm{f}} = 400\,\mathrm V$, zato $|\underline{Z}| = \dfrac{400\,\mathrm V}{6{,}928\,\mathrm A} \approx 57{,}7\,\Omega$.
6. Odgovor: $P \approx 6{,}8\,\mathrm{kW}$, $Q \approx 4{,}8\,\mathrm{kvar}$, $S \approx 8{,}3\,\mathrm{kVA}$; impedanca navitja je približno $57{,}7\,\Omega$ s kotom $\arccos 0{,}82 \approx 34{,}9^\circ$.

### Primer 4 – zdaj ti

Letala in nekatera vesoljska plovila, na primer nekdanji vesoljski čolniček, imajo trifazno omrežje s frekvenco $400\,\mathrm{Hz}$. Fazna napetost je $115\,\mathrm V$, vezava je zvezda. Simetrično breme, ventilatorji hladilnega sistema, vleče iz vsakega vodnika $8\,\mathrm A$ pri $\cos\varphi = 0{,}9$. Kolikšni sta medfazna napetost in delovna moč bremena?

**Podatki:** $U_{\mathrm{f}} = 115\,\mathrm V$, $I_{\mathrm{v}} = 8\,\mathrm A$, $\cos\varphi = 0{,}9$, vezava v zvezdo, $f = 400\,\mathrm{Hz}$
**Iščemo:** medfazno napetost $U_{\mathrm{m}}$ in moč $P$

:::formula
$U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}}$, $P = 3\, U_{\mathrm{f}} I_{\mathrm{f}} \cos\varphi$
:::

**Rešitev:**

1. Vezava je zvezda, zato je $\sqrt{3}$ pri napetosti, tok bremena pa je enak toku v vodniku: $I_{\mathrm{f}} = 8\,\mathrm A$.
2. Frekvenca na rezultat ne vpliva; zveze veljajo pri vsaki frekvenci.
3. Izračunaj sam, nato preveri:

:::premisli
Kolikšna sta $U_{\mathrm{m}}$ in $P$?
---
$U_{\mathrm{m}} = \sqrt{3} \cdot 115\,\mathrm V \approx 199\,\mathrm V$ (zato na takih napravah piše $115/200\,\mathrm V$). Moč je $P = 3 \cdot 115\,\mathrm V \cdot 8\,\mathrm A \cdot 0{,}9 = 2484\,\mathrm W$.
:::

## Pogoste napake

- **Seštevanje velikosti napetosti.** Matej je sklepal $230 + 230 = 460\,\mathrm V$. Napetosti sta kazalca, zamaknjena za $120^\circ$, medfazna napetost pa je njuna razlika. Pravilno: $U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}}$.
- **Faktor $3$ ali $\sqrt{3}$ na napačnem mestu.** Zapis $P = 3\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi$ da $\sqrt{3}$-krat preveliko moč. Pravilo: $3$ gre s faznimi vrednostmi, $\sqrt{3}$ z medfazno napetostjo in tokom v vodniku.
- **V trikotu je tok bremena enak toku v vodniku.** To velja pri zvezdi. V trikotu je tok v vodniku razlika dveh faznih tokov, zato $I_{\mathrm{f}} = I_{\mathrm{v}} / \sqrt{3}$.
- **Kot $\varphi$ med $U_{\mathrm{m}}$ in $I_{\mathrm{v}}$.** Med medfazno napetostjo in tokom v vodniku je pri simetričnem bremenu dodaten zamik $30^\circ$. V formulah za moč je $\varphi$ kot impedance ene faze bremena.
- **»Ničelni vodnik nosi vsoto velikosti tokov.«** Tokovi so kazalci. Pri simetričnem bremenu je njihova vsota nič, zato po ničelnem vodniku ne teče nič. Tok v njem se pojavi šele pri nesimetričnem bremenu.

## Povzetek

- Simetrični trifazni sistem sestavljajo tri enake napetosti, zamaknjene za $120^\circ$; njihova vsota je nič.
- Fazna napetost je med faznim vodnikom in zvezdiščem, medfazna med dvema faznima vodnikoma: $U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}}$ (omrežje $230/400\,\mathrm V$).
- Zvezda: breme dobi $U_{\mathrm{m}}/\sqrt{3}$, tok v vodniku je enak toku bremena.
- Trikot: breme dobi $U_{\mathrm{m}}$, tok v vodniku je $\sqrt{3}$-krat večji od toka bremena.
- Moč: $P = 3\, U_{\mathrm{f}} I_{\mathrm{f}} \cos\varphi = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi$; $\varphi$ je kot impedance bremena.
- Isto breme v trikotu ima trikrat večjo moč kot v zvezdi.
- Pri simetričnem bremenu je tok v ničelnem vodniku nič, trenutna moč pa je stalna.

## Drugače: Na sliki

Predstavljaj si uro s tremi enako dolgimi kazalci. Prvi kaže na $12$, drugi na $4$, tretji na $8$. To so fazne napetosti $\underline{U}_1$, $\underline{U}_2$ in $\underline{U}_3$. Vsi trije se vrtijo skupaj, z enako hitrostjo, zato se slika ne spremeni.

- Konice kazalcev povežeš z daljicami. Dobiš enakostranični trikotnik.
- Vsaka stranica trikotnika je ena medfazna napetost. Daljica od konice na $4$ do konice na $12$ je $\underline{U}_{12} = \underline{U}_1 - \underline{U}_2$.
- Stranica trikotnika, včrtanega v krog s polmerom $U_{\mathrm{f}}$, je dolga $\sqrt{3}\, U_{\mathrm{f}}$. Matejevih $460\,\mathrm V$ bi dobil le, če bi kazalca kazala na $12$ in na $6$.

Obe vezavi lahko narišeš kar s črkama. Zvezda je črka Y: trije kraki se srečajo v sredini, v zvezdišču, vsak krak je eno breme. Trikot je trikotnik: vsaka stranica je eno breme, oglišča so priključena na fazne vodnike.

## Drugače: Iz vsakdanjega življenja

- **Vrtiljak.** Trije otroci potiskajo vrtiljak in vsak potisne ob drugem času, eden za drugim. Vrtiljak se vrti enakomerno. En sam otrok bi ga potiskal sunkovito. Tako se trenutne moči treh faz dopolnijo v stalno moč.
- **Hišni priključek.** Doma imaš običajno tri faze, na primer $3 \times 25\,\mathrm A$. Vtičnice so priključene med eno fazo in ničlo, zato je v njih $230\,\mathrm V$. Rdeča trifazna vtičnica v delavnici ima med faznimi kontakti $400\,\mathrm V$. Električni štedilnik pogosto razdeli kuhalne plošče na različne faze, da je obremenitev bolj simetrična.
- **Tablica motorja.** Na motorju piše »$\Delta/\mathrm Y$ $230/400\,\mathrm V$«. To pomeni, da navitje prenese $230\,\mathrm V$. Na omrežju $400\,\mathrm V$ ga zato vežeš v zvezdo. Večji motorji z navitjem za $400\,\mathrm V$ (tablica $\Delta$ $400\,\mathrm V$) se zaženejo v zvezdi in nato preklopijo v trikot, da je zagonski tok manjši.

## Drugače: Bolj natančno

**Medfazna napetost s kompleksnim računom.** Iz $\underline{U}_2 = \underline{U}_1 \angle -120^\circ$ sledi $\underline{U}_{12} = \underline{U}_1 \left(1 - \angle -120^\circ\right)$. Ker je $1 - \left(-\tfrac{1}{2} - \mathrm j \tfrac{\sqrt{3}}{2}\right) = \tfrac{3}{2} + \mathrm j \tfrac{\sqrt{3}}{2} = \sqrt{3} \angle 30^\circ$, je $\underline{U}_{12} = \sqrt{3}\, \underline{U}_1 \angle 30^\circ$. Dobimo velikost $\sqrt{3}\,U_{\mathrm{f}}$ in še zamik $30^\circ$, ki ga omenja razdelek o napakah. Pri trikotu je $\underline{I}_{31} = \underline{I}_{12} \angle 120^\circ$, zato enak račun da $\underline{I}_1 = \underline{I}_{12} - \underline{I}_{31} = \sqrt{3}\, \underline{I}_{12} \angle -30^\circ$.

**Zakaj je trenutna moč stalna.** V fazi $k = 0, 1, 2$ sta $u_k = \sqrt{2}\, U_{\mathrm{f}} \cos(\omega t - k \cdot 120^\circ)$ in $i_k = \sqrt{2}\, I_{\mathrm{f}} \cos(\omega t - k \cdot 120^\circ - \varphi)$. Z $2 \cos\alpha \cos\beta = \cos(\alpha - \beta) + \cos(\alpha + \beta)$ dobiš

$$u_k i_k = U_{\mathrm{f}} I_{\mathrm{f}} \left[\cos\varphi + \cos(2\omega t - k \cdot 240^\circ - \varphi)\right]$$

Nihajoči členi treh faz so zamaknjeni za $0^\circ$, $240^\circ$ in $480^\circ \equiv 120^\circ$. To so spet trije enaki kazalci s skupno vsoto nič. Ostane $p(t) = 3\, U_{\mathrm{f}} I_{\mathrm{f}} \cos\varphi = P$.

## Preveri se

? Generator daje simetrični trifazni sistem. Kaj od naslednjega drži?
- Fazne napetosti so med seboj zamaknjene za $90^\circ$.
~ Zamik $90^\circ$ je med sinusom in kosinusom. Tri napetosti si razdelijo periodo na tretjine: $360^\circ / 3 = 120^\circ$.
+ Fazne napetosti so enako velike, zamaknjene za $120^\circ$, njihova vsota je v vsakem trenutku nič.
- Medfazna napetost je dvakratnik fazne napetosti.
~ To velja le za nasprotno usmerjena kazalca. Pri zamiku $120^\circ$ je razlika $\sqrt{3}\, U_{\mathrm{f}}$.
- Pri vezavi v trikot potrebujemo ničelni vodnik.
~ V trikotu ni zvezdišča, zato ničelnega vodnika ni kam priključiti.
> Trije enako dolgi kazalci, zamaknjeni za $120^\circ$, tvorijo zaprt trikotnik, zato je njihova vsota nič.

? Tri enake impedance na istem omrežju najprej vežemo v zvezdo, nato v trikot. Kako se spremeni delovna moč?
- V trikotu je $\sqrt{3}$-krat večja.
~ Upoštevan je le večji tok ali le večja napetost. Na bremenu se povečata oba, vsak za $\sqrt{3}$.
- Ostane enaka, ker je omrežje isto.
~ Omrežje je isto, a breme dobi drugo napetost: v trikotu medfazno, v zvezdi fazno.
+ V trikotu je $3$-krat večja.
- V zvezdi je $3$-krat večja.
~ Zamenjani sta vezavi. V zvezdi je na bremenu manjša napetost, $U_{\mathrm{m}}/\sqrt{3}$.
> V trikotu je napetost na impedanci $\sqrt{3}$-krat večja, zato je tudi tok $\sqrt{3}$-krat večji. Moč je $\sqrt{3} \cdot \sqrt{3} = 3$-krat večja.

? Simetrično breme v zvezdi: $U_{\mathrm{m}} = 400\,\mathrm V$, $I_{\mathrm{v}} = 10\,\mathrm A$, $\cos\varphi = 0{,}8$. Rešitev v zvezku: »$P = 3 \cdot 400\,\mathrm V \cdot 10\,\mathrm A \cdot 0{,}8 = 9600\,\mathrm W$.« Kje je napaka?
- V zvezdi je fazni tok $\sqrt{3}$-krat večji od toka v vodniku.
~ V zvezdi je tok bremena enak toku v vodniku. Faktor $\sqrt{3}$ pri toku velja za trikot.
- Faktor moči ne spada v trifazno formulo.
~ Faktor moči je potreben pri vsaki delovni moči, enofazni ali trifazni.
+ Faktor $3$ velja za fazne vrednosti; z medfazno napetostjo mora biti $\sqrt{3}$, zato je $P \approx 5543\,\mathrm W$.
- Napake ni.
~ Vsaka faza ima le $230\,\mathrm V$, ne $400\,\mathrm V$. Račun zato da $\sqrt{3}$-krat preveliko moč.
> $P = \sqrt{3} \cdot 400\,\mathrm V \cdot 10\,\mathrm A \cdot 0{,}8 \approx 5543\,\mathrm W$, enako kot $3 \cdot 230{,}9\,\mathrm V \cdot 10\,\mathrm A \cdot 0{,}8$.

? Trije uporniki po $23\,\Omega$ so vezani v zvezdo na omrežje $230/400\,\mathrm V$. Kolikšen je tok v vsakem vodniku?
- približno $17{,}4\,\mathrm A$
~ To je $400\,\mathrm V / 23\,\Omega$. V zvezdi upor ne dobi medfazne, ampak fazno napetost.
+ približno $10\,\mathrm A$
- približno $5{,}8\,\mathrm A$
~ Tu je $\sqrt{3}$ uporabljen še pri toku. V zvezdi je tok v vodniku enak toku skozi upor.
> Upor dobi $U_{\mathrm{f}} \approx 230\,\mathrm V$, zato $I_{\mathrm{f}} = 230\,\mathrm V / 23\,\Omega = 10\,\mathrm A = I_{\mathrm{v}}$.

? Motor za vrtenje kupole observatorija ima na tablici »$\Delta/\mathrm Y$ $230/400\,\mathrm V$«. Omrežje je $230/400\,\mathrm V$. Kako ga priključiš?
- V trikot, ker ima omrežje $400\,\mathrm V$.
~ V trikotu bi vsako navitje dobilo $400\,\mathrm V$, kar je $\sqrt{3}$-krat več od dovoljenih $230\,\mathrm V$. Motor bi se pregrel.
+ V zvezdo, ker tako vsako navitje dobi $400/\sqrt{3} \approx 230\,\mathrm V$.
- Vseeno je, motor deluje v obeh vezavah enako.
~ Moč in tok v vodniku se pri preklopu spremenita za faktor $3$, zato vezava ni poljubna.
> Tablica pove napetost navitja: $230\,\mathrm V$ v trikotu ali $400\,\mathrm V$ medfazno v zvezdi. Na omrežju $400\,\mathrm V$ to doseže zvezda.

:::simboli
U | kazalec fazne napetosti | | V | $\underline{U}_1$, $\underline{U}_2$, $\underline{U}_3$ zamaknjeni za $120^\circ$
U_{\mathrm{f}} | fazna napetost (napetost bremena) | U_{\mathrm{f}} = \frac{U_{\mathrm{m}}}{\sqrt{3}} | V | v zvezdi; v trikotu $U_{\mathrm{f}} = U_{\mathrm{m}}$
U_{\mathrm{m}} | medfazna napetost | U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}} | V | med dvema faznima vodnikoma
I_{\mathrm{f}} | fazni tok (tok skozi breme) | I_{\mathrm{f}} = \frac{U_{\mathrm{f}}}{Z} | A
I_{\mathrm{v}} | tok v vodniku | | A | v trikotu $\sqrt{3}\, I_{\mathrm{f}}$
P | delovna moč | P = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi | W
Q | jalova moč | Q = S \sin\varphi | var
S | navidezna moč | S = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} | VA
\varphi | kot impedance bremena | | – | med $U_{\mathrm{f}}$ in $I_{\mathrm{f}}$
R | upor grelnega elementa | | \Omega
Z | impedanca ene faze bremena | | \Omega | kazalec $\underline{Z}$, velikost $\lvert\underline{Z}\rvert$
u_k | trenutna napetost faze $k$ | | V | $k = 0, 1, 2$
i_k | trenutni tok faze $k$ | | A
\omega | krožna frekvenca | \omega = 2\pi f | rad/s
f | frekvenca omrežja | | Hz
t | čas | | s
k | številka faze | | – | $0$, $1$ ali $2$
:::
