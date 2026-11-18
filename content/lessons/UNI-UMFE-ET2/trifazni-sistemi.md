---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Na ekskurziji na observatorij vam tehnik pokaže motor, ki vrti kupolo teleskopa. Priključen je s tremi faznimi vodniki in ničelnim vodnikom. Pove, da je med vsakim faznim vodnikom in ničlo $230\,\mathrm{V}$.

Sošolec Matej takoj zaključi: »Med dvema faznima vodnikoma je potem $460\,\mathrm{V}$, ker se napetosti seštejeta.« Tehnik izmeri. Voltmeter pokaže približno $400\,\mathrm{V}$.

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

Za naše omrežje: $\sqrt{3} \cdot 230\,\mathrm{V} \approx 398\,\mathrm{V}$. Zato pišemo $230/400\,\mathrm{V}$.

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

Na tablici in z merilniki pa sta dostopna medfazna napetost in tok v vodniku. Če vstaviš zveze iz tabele, za obe vezavi dobiš isti izraz:

$$P = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi$$

Pri zvezdi na primer vstaviš $U_{\mathrm{f}} = U_{\mathrm{m}}/\sqrt{3}$ in $I_{\mathrm{f}} = I_{\mathrm{v}}$, ker je $3/\sqrt{3} = \sqrt{3}$. Pri trikotu se $\sqrt{3}$ skrajša pri toku.

Podobno sta jalova moč $Q = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \sin\varphi$ in navidezna moč $S = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}}$. Kot $\varphi$ je tudi tu kot impedance ene faze bremena. To je kot med fazno napetostjo in faznim tokom, ne med $U_{\mathrm{m}}$ in $I_{\mathrm{v}}$.

Še ena razlika od enofaznega kroga je pomembna v praksi. Trenutne moči treh faz se seštejejo v *stalno* vrednost, $p(t) = P$. Motor se zato ne trese, kar je pri pogonu teleskopa zelo dobrodošlo. Za isto moč potrebuješ tudi manj bakra kot pri treh ločenih enofaznih krogih.

## Rešeni primeri

### Primer 1: grelnik v zvezdi

V kupoli observatorija greje zrak trifazni grelnik, da se na zrcalu ne nabira rosa. Ima tri grelne upore po $40\,\Omega$, vezane v zvezdo na omrežje $230/400\,\mathrm{V}$. Kolikšni so napetost na uporu, tok v vodniku in moč grelnika?

**Podatki:** $U_{\mathrm{m}} = 400\,\mathrm{V}$, $R = 40\,\Omega$, vezava v zvezdo, $\cos\varphi = 1$ (čisti upori)
**Iščemo:** fazno napetost $U_{\mathrm{f}}$, tok $I_{\mathrm{v}}$, moč $P$

:::formula
$U_{\mathrm{f}} = \dfrac{U_{\mathrm{m}}}{\sqrt{3}}$, $I_{\mathrm{v}} = I_{\mathrm{f}} = \dfrac{U_{\mathrm{f}}}{R}$, $P = 3\, U_{\mathrm{f}} I_{\mathrm{f}} \cos\varphi$
:::

**Rešitev:**

1. V zvezdi vsak upor dobi fazno napetost: $U_{\mathrm{f}} = \dfrac{400\,\mathrm{V}}{\sqrt{3}} \approx 230{,}94\,\mathrm{V}$.
2. Tok skozi upor je hkrati tok v vodniku: $I_{\mathrm{f}} = \dfrac{230{,}94\,\mathrm{V}}{40\,\Omega} \approx 5{,}774\,\mathrm{A}$.
3. Moč treh faz: $P = 3 \cdot 230{,}94\,\mathrm{V} \cdot 5{,}774\,\mathrm{A} \approx 4000\,\mathrm{W}$.
4. Kontrola z medfaznimi vrednostmi: $\sqrt{3} \cdot 400\,\mathrm{V} \cdot 5{,}774\,\mathrm{A} \approx 4000\,\mathrm{W}$.
5. Odgovor: na vsakem uporu je približno $231\,\mathrm{V}$, v vsakem vodniku teče $5{,}77\,\mathrm{A}$, grelnik ima moč $4\,\mathrm{kW}$.

### Primer 2: isti grelnik v trikotu

Ko je mraz hud, tehnik preklopi iste tri upore po $40\,\Omega$ v trikot. Omrežje je isto. Kolikšni so zdaj tok skozi upor, tok v vodniku in moč?

**Podatki:** $U_{\mathrm{m}} = 400\,\mathrm{V}$, $R = 40\,\Omega$, vezava v trikot, $\cos\varphi = 1$
**Iščemo:** fazni tok $I_{\mathrm{f}}$, tok $I_{\mathrm{v}}$, moč $P$

:::formula
$U_{\mathrm{f}} = U_{\mathrm{m}}$, $I_{\mathrm{f}} = \dfrac{U_{\mathrm{f}}}{R}$, $I_{\mathrm{v}} = \sqrt{3}\, I_{\mathrm{f}}$, $P = 3\, U_{\mathrm{f}} I_{\mathrm{f}}$
:::

**Rešitev:**

1. V trikotu je vsak upor med dvema faznima vodnikoma, zato je $U_{\mathrm{f}} = 400\,\mathrm{V}$.
2. Tok skozi upor: $I_{\mathrm{f}} = \dfrac{400\,\mathrm{V}}{40\,\Omega} = 10\,\mathrm{A}$.
3. Tok v vodniku je razlika dveh faznih tokov: $I_{\mathrm{v}} = \sqrt{3} \cdot 10\,\mathrm{A} \approx 17{,}32\,\mathrm{A}$.
4. Moč: $P = 3 \cdot 400\,\mathrm{V} \cdot 10\,\mathrm{A} = 12000\,\mathrm{W}$.
5. Primerjava z zvezdo: napetost na uporu je $\sqrt{3}$-krat večja, zato je tudi tok $\sqrt{3}$-krat večji. Moč na uporu je $3$-krat večja.
6. Odgovor: skozi vsak upor teče $10\,\mathrm{A}$, v vodniku $17{,}3\,\mathrm{A}$, moč je $12\,\mathrm{kW}$, trikrat več kot v zvezdi.

### Primer 3: pogon radijskega teleskopa

Azimutni pogon radijskega teleskopa poganja trifazni motor, vezan v trikot na omrežje $400\,\mathrm{V}$. Ampermeter na dovodnem vodniku kaže $12\,\mathrm{A}$, faktor moči je $0{,}82$. Izračunaj delovno, jalovo in navidezno moč ter velikost impedance enega navitja.

**Podatki:** $U_{\mathrm{m}} = 400\,\mathrm{V}$, $I_{\mathrm{v}} = 12\,\mathrm{A}$, $\cos\varphi = 0{,}82$, vezava v trikot
**Iščemo:** $P$, $Q$, $S$ in $|\underline{Z}|$

:::formula
$S = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}}$, $P = S \cos\varphi$, $Q = S \sin\varphi$, $I_{\mathrm{f}} = \dfrac{I_{\mathrm{v}}}{\sqrt{3}}$, $|\underline{Z}| = \dfrac{U_{\mathrm{f}}}{I_{\mathrm{f}}}$
:::

**Rešitev:**

1. Navidezna moč iz izmerjenih vrednosti: $S = \sqrt{3} \cdot 400\,\mathrm{V} \cdot 12\,\mathrm{A} \approx 8314\,\mathrm{VA}$.
2. Delovna moč: $P = 8314\,\mathrm{VA} \cdot 0{,}82 \approx 6817\,\mathrm{W}$.
3. Za jalovo moč potrebujemo sinus: $\sin\varphi = \sqrt{1 - 0{,}82^2} \approx 0{,}5724$, zato je $Q = 8314 \cdot 0{,}5724\,\mathrm{var} \approx 4759\,\mathrm{var}$.
4. Drugi del naloge je impedanca. V trikotu teče skozi navitje manjši tok kot v vodniku: $I_{\mathrm{f}} = \dfrac{12\,\mathrm{A}}{\sqrt{3}} \approx 6{,}928\,\mathrm{A}$.
5. Napetost na navitju je medfazna, $U_{\mathrm{f}} = 400\,\mathrm{V}$, zato $|\underline{Z}| = \dfrac{400\,\mathrm{V}}{6{,}928\,\mathrm{A}} \approx 57{,}7\,\Omega$.
6. Odgovor: $P \approx 6{,}8\,\mathrm{kW}$, $Q \approx 4{,}8\,\mathrm{kvar}$, $S \approx 8{,}3\,\mathrm{kVA}$; impedanca navitja je približno $57{,}7\,\Omega$ s kotom $\arccos 0{,}82 \approx 34{,}9^\circ$.

### Primer 4 – zdaj ti

Letala in nekatera vesoljska plovila, na primer nekdanji vesoljski čolniček, imajo trifazno omrežje s frekvenco $400\,\mathrm{Hz}$. Fazna napetost je $115\,\mathrm{V}$, vezava je zvezda. Simetrično breme, ventilatorji hladilnega sistema, vleče iz vsakega vodnika $8\,\mathrm{A}$ pri $\cos\varphi = 0{,}9$. Kolikšni sta medfazna napetost in delovna moč bremena?

**Podatki:** $U_{\mathrm{f}} = 115\,\mathrm{V}$, $I_{\mathrm{v}} = 8\,\mathrm{A}$, $\cos\varphi = 0{,}9$, vezava v zvezdo, $f = 400\,\mathrm{Hz}$
**Iščemo:** medfazno napetost $U_{\mathrm{m}}$ in moč $P$

:::formula
$U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}}$, $P = 3\, U_{\mathrm{f}} I_{\mathrm{f}} \cos\varphi$
:::

**Rešitev:**

1. Vezava je zvezda, zato je $\sqrt{3}$ pri napetosti, tok bremena pa je enak toku v vodniku: $I_{\mathrm{f}} = 8\,\mathrm{A}$.
2. Frekvenca na rezultat ne vpliva; zveze veljajo pri vsaki frekvenci.
3. Izračunaj sam, nato preveri:

:::premisli
Kolikšna sta $U_{\mathrm{m}}$ in $P$?
---
$U_{\mathrm{m}} = \sqrt{3} \cdot 115\,\mathrm{V} \approx 199\,\mathrm{V}$ (zato na takih napravah piše $115/200\,\mathrm{V}$). Moč je $P = 3 \cdot 115\,\mathrm{V} \cdot 8\,\mathrm{A} \cdot 0{,}9 = 2484\,\mathrm{W}$.
:::

## Pogoste napake

- **Seštevanje velikosti napetosti.** Matej je sklepal $230 + 230 = 460\,\mathrm{V}$. Napetosti sta kazalca, zamaknjena za $120^\circ$, medfazna napetost pa je njuna razlika. Pravilno: $U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}}$.
- **Faktor $3$ ali $\sqrt{3}$ na napačnem mestu.** Zapis $P = 3\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi$ da $\sqrt{3}$-krat preveliko moč. Pravilo: $3$ gre s faznimi vrednostmi, $\sqrt{3}$ z medfazno napetostjo in tokom v vodniku.
- **V trikotu je tok bremena enak toku v vodniku.** To velja pri zvezdi. V trikotu je tok v vodniku razlika dveh faznih tokov, zato $I_{\mathrm{f}} = I_{\mathrm{v}} / \sqrt{3}$.
- **Kot $\varphi$ med $U_{\mathrm{m}}$ in $I_{\mathrm{v}}$.** Med medfazno napetostjo in tokom v vodniku je pri simetričnem bremenu dodaten zamik $30^\circ$. V formulah za moč je $\varphi$ kot impedance ene faze bremena.
- **»Ničelni vodnik nosi vsoto velikosti tokov.«** Tokovi so kazalci. Pri simetričnem bremenu je njihova vsota nič, zato po ničelnem vodniku ne teče nič. Tok v njem se pojavi šele pri nesimetričnem bremenu.

## Povzetek

- Simetrični trifazni sistem sestavljajo tri enake napetosti, zamaknjene za $120^\circ$; njihova vsota je nič.
- Fazna napetost je med faznim vodnikom in zvezdiščem, medfazna med dvema faznima vodnikoma: $U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}}$ (omrežje $230/400\,\mathrm{V}$).
- Zvezda: breme dobi $U_{\mathrm{m}}/\sqrt{3}$, tok v vodniku je enak toku bremena.
- Trikot: breme dobi $U_{\mathrm{m}}$, tok v vodniku je $\sqrt{3}$-krat večji od toka bremena.
- Moč: $P = 3\, U_{\mathrm{f}} I_{\mathrm{f}} \cos\varphi = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi$; $\varphi$ je kot impedance bremena.
- Isto breme v trikotu ima trikrat večjo moč kot v zvezdi.
- Pri simetričnem bremenu je tok v ničelnem vodniku nič, trenutna moč pa je stalna.

## Za izpit

Znati moraš povedati:

- definicijo simetričnega trifaznega sistema s kazalci in zakaj je vsota treh faznih napetosti nič;
- definiciji fazne in medfazne napetosti ter izpeljavo $U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}}$ iz razlike kazalcev;
- zveze med napetostjo bremena, tokom bremena in tokom v vodniku pri vezavi v zvezdo in v trikot;
- izraze za $P$, $Q$ in $S$ simetričnega bremena s faznimi in z medfaznimi vrednostmi ter kaj je kot $\varphi$;
- zakaj ima isto breme v trikotu trikrat večjo moč kot v zvezdi;
- kdaj je tok v ničelnem vodniku nič in zakaj je trenutna moč simetričnega bremena stalna.

### Naloga 1

Na zbiralke lastne rabe elektrarne z medfazno napetostjo $400\,\mathrm{V}$ sta priključeni dve simetrični bremeni. Motor črpalke je vezan v trikot, impedanca enega navitja ima velikost $30\,\Omega$ in faktor moči $0{,}8$ (induktivno). Grelnik je vezan v zvezdo in ima tri upore po $32\,\Omega$. a) Izračunaj tok v vodniku ter delovno in jalovo moč vsakega bremena. b) Izračunaj skupno delovno, jalovo in navidezno moč, skupni tok v dovodnem vodniku in skupni faktor moči. Zakaj skupni tok ni vsota tokov obeh bremen? c) Kolikšna bi bila tok v vodniku in delovna moč motorja, če bi ista navitja vezali v zvezdo?

**Rešitev:**

1. a) Motor v trikotu: navitje dobi $U_{\mathrm{f}} = 400\,\mathrm{V}$, zato $I_{\mathrm{f}} = \dfrac{400\,\mathrm{V}}{30\,\Omega} \approx 13{,}33\,\mathrm{A}$ in $I_{\mathrm{v}} = \sqrt{3} \cdot 13{,}33\,\mathrm{A} \approx 23{,}09\,\mathrm{A}$.
2. Moč motorja: $P_1 = 3 \cdot 400\,\mathrm{V} \cdot 13{,}33\,\mathrm{A} \cdot 0{,}8 \approx 12800\,\mathrm{W}$. Ker je $\sin\varphi = \sqrt{1 - 0{,}8^2} = 0{,}6$, je $Q_1 = 3 \cdot 400 \cdot 13{,}33 \cdot 0{,}6\,\mathrm{var} \approx 9600\,\mathrm{var}$.
3. Grelnik v zvezdi: upor dobi $U_{\mathrm{f}} = \dfrac{400\,\mathrm{V}}{\sqrt{3}} \approx 230{,}94\,\mathrm{V}$, zato $I_{\mathrm{v}} = I_{\mathrm{f}} = \dfrac{230{,}94\,\mathrm{V}}{32\,\Omega} \approx 7{,}217\,\mathrm{A}$.
4. Moč grelnika: $P_2 = 3 \cdot 230{,}94\,\mathrm{V} \cdot 7{,}217\,\mathrm{A} \approx 5000\,\mathrm{W}$, $Q_2 = 0$ (čisti upori).
5. b) Delovni in jalovi moči se seštejeta vsaka zase: $P = 12800\,\mathrm{W} + 5000\,\mathrm{W} = 17800\,\mathrm{W}$, $Q = 9600\,\mathrm{var}$.
6. Navidezna moč: $S = \sqrt{17800^2 + 9600^2}\,\mathrm{VA} \approx 20224\,\mathrm{VA}$.
7. Skupni tok v vodniku: $I_{\mathrm{v}} = \dfrac{S}{\sqrt{3}\, U_{\mathrm{m}}} = \dfrac{20224\,\mathrm{VA}}{\sqrt{3} \cdot 400\,\mathrm{V}} \approx 29{,}19\,\mathrm{A}$.
8. Skupni faktor moči: $\cos\varphi = \dfrac{17800}{20224} \approx 0{,}880$.
9. Vsota velikosti tokov bi bila $23{,}09\,\mathrm{A} + 7{,}217\,\mathrm{A} \approx 30{,}31\,\mathrm{A}$. Tokova sta kazalca: tok grelnika je v fazi s fazno napetostjo, tok motorja zaostaja za $\arccos 0{,}8 \approx 36{,}9^\circ$, zato je velikost vsote manjša.
10. c) V zvezdi navitje dobi $230{,}94\,\mathrm{V}$: $I_{\mathrm{v}} = I_{\mathrm{f}} = \dfrac{230{,}94\,\mathrm{V}}{30\,\Omega} \approx 7{,}698\,\mathrm{A}$ in $P = 3 \cdot 230{,}94\,\mathrm{V} \cdot 7{,}698\,\mathrm{A} \cdot 0{,}8 \approx 4267\,\mathrm{W}$.
11. Odgovor: motor $23{,}1\,\mathrm{A}$; $12{,}8\,\mathrm{kW}$; $9{,}6\,\mathrm{kvar}$. Grelnik $7{,}22\,\mathrm{A}$; $5{,}0\,\mathrm{kW}$. Skupaj $P = 17{,}8\,\mathrm{kW}$, $Q = 9{,}6\,\mathrm{kvar}$, $S \approx 20{,}2\,\mathrm{kVA}$, $I_{\mathrm{v}} \approx 29{,}2\,\mathrm{A}$, $\cos\varphi \approx 0{,}88$. Motor v zvezdi bi imel tretjino toka v vodniku ($7{,}70\,\mathrm{A}$) in tretjino moči ($4{,}27\,\mathrm{kW}$).

### Naloga 2

Izpelji zvezo med medfazno in fazno napetostjo simetričnega trifaznega sistema. Nato utemelji, da izraz $P = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi$ velja za simetrično breme v zvezdi in v trikotu, in natančno navedi, kateri kot je $\varphi$.

**Rešitev:**

1. Fazni napetosti sta $\underline{U}_1 = U_{\mathrm{f}} \angle 0^\circ$ in $\underline{U}_2 = U_{\mathrm{f}} \angle -120^\circ$. Medfazna napetost je razlika kazalcev: $\underline{U}_{12} = \underline{U}_1 - \underline{U}_2$.
2. Kazalca sta kraka enakokrakega trikotnika s kotom $120^\circ$ ob vrhu, razlika je njegova osnovnica. Kota ob osnovnici sta $30^\circ$, zato je osnovnica dolga $2 U_{\mathrm{f}} \cos 30^\circ = \sqrt{3}\, U_{\mathrm{f}}$.
3. Enako s kompleksnim računom: $1 - \left(-\tfrac{1}{2} - \mathrm j \tfrac{\sqrt{3}}{2}\right) = \tfrac{3}{2} + \mathrm j \tfrac{\sqrt{3}}{2}$, velikost je $\sqrt{\tfrac{9}{4} + \tfrac{3}{4}} = \sqrt{3}$. Torej $U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}}$, kazalec $\underline{U}_{12}$ pa prehiteva $\underline{U}_1$ za $30^\circ$.
4. Vsaka faza simetričnega bremena prejme $U_{\mathrm{f}} I_{\mathrm{f}} \cos\varphi$, kjer sta $U_{\mathrm{f}}$ in $I_{\mathrm{f}}$ napetost in tok ene impedance. Skupaj: $P = 3\, U_{\mathrm{f}} I_{\mathrm{f}} \cos\varphi$.
5. Zvezda: $U_{\mathrm{f}} = U_{\mathrm{m}}/\sqrt{3}$ in $I_{\mathrm{f}} = I_{\mathrm{v}}$, zato $P = 3 \cdot \dfrac{U_{\mathrm{m}}}{\sqrt{3}} \cdot I_{\mathrm{v}} \cos\varphi = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi$.
6. Trikot: $U_{\mathrm{f}} = U_{\mathrm{m}}$ in $I_{\mathrm{f}} = I_{\mathrm{v}}/\sqrt{3}$, zato $P = 3 \cdot U_{\mathrm{m}} \cdot \dfrac{I_{\mathrm{v}}}{\sqrt{3}} \cos\varphi = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi$.
7. Odgovor: $U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}}$; izraz za moč je pri obeh vezavah enak, ker je faktor $\sqrt{3}$ enkrat pri napetosti in drugič pri toku. Kot $\varphi$ je kot impedance ene faze bremena, to je kot med napetostjo in tokom iste impedance. Ni kot med $U_{\mathrm{m}}$ in $I_{\mathrm{v}}$, ker je med njima pri simetričnem bremenu dodaten zamik $30^\circ$.

### Naloga 3

Na omrežje $230/400\,\mathrm{V}$ z ničelnim vodnikom so v zvezdo vezani trije grelniki: v prvi in drugi fazi po $23\,\Omega$, v tretji $46\,\Omega$. Računaj s fazno napetostjo $230\,\mathrm{V}$. a) Izračunaj tokove v faznih vodnikih in tok v ničelnem vodniku. b) Izračunaj skupno moč. c) Utemelji, zakaj je pri treh enakih grelnikih tok v ničelnem vodniku nič.

**Rešitev:**

1. a) Ničelni vodnik drži zvezdišče bremena na potencialu zvezdišča vira, zato vsak grelnik dobi $230\,\mathrm{V}$: $I_1 = I_2 = \dfrac{230\,\mathrm{V}}{23\,\Omega} = 10\,\mathrm{A}$, $I_3 = \dfrac{230\,\mathrm{V}}{46\,\Omega} = 5\,\mathrm{A}$.
2. Grelniki so upori, zato je vsak tok v fazi s svojo fazno napetostjo: $\underline{I}_1 = 10\,\mathrm{A} \angle 0^\circ$, $\underline{I}_2 = 10\,\mathrm{A} \angle -120^\circ$, $\underline{I}_3 = 5\,\mathrm{A} \angle 120^\circ$.
3. V komponentah: $\underline{I}_1 = 10\,\mathrm{A}$, $\underline{I}_2 = (-5 - \mathrm j\, 8{,}66)\,\mathrm{A}$, $\underline{I}_3 = (-2{,}5 + \mathrm j\, 4{,}33)\,\mathrm{A}$.
4. Tok v ničelnem vodniku je vsota kazalcev: $\underline{I}_{\mathrm N} = (10 - 5 - 2{,}5)\,\mathrm{A} + \mathrm j\,(-8{,}66 + 4{,}33)\,\mathrm{A} = (2{,}5 - \mathrm j\, 4{,}33)\,\mathrm{A}$.
5. Velikost: $I_{\mathrm N} = \sqrt{2{,}5^2 + 4{,}33^2}\,\mathrm{A} \approx 5\,\mathrm{A}$, kot $-60^\circ$.
6. Hitrejša pot: $\underline{I}_3$ zapišemo kot $10\,\mathrm{A} \angle 120^\circ - 5\,\mathrm{A} \angle 120^\circ$. Trije enaki tokovi po $10\,\mathrm{A}$ dajo vsoto nič, ostane $-5\,\mathrm{A} \angle 120^\circ = 5\,\mathrm{A} \angle -60^\circ$.
7. b) Bremena niso enaka, zato moči faz seštejemo posebej: $P = 230\,\mathrm{V} \cdot 10\,\mathrm{A} + 230\,\mathrm{V} \cdot 10\,\mathrm{A} + 230\,\mathrm{V} \cdot 5\,\mathrm{A} = 5750\,\mathrm{W}$. Izraz $\sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi$ tu ne velja, ker tokovi v vodnikih niso enaki.
8. c) Pri enakih grelnikih so tokovi enako veliki in zamaknjeni za $120^\circ$. Taki kazalci tvorijo enakostranični trikotnik, zato je njihova vsota nič: $1 + \left(-\tfrac{1}{2} - \mathrm j \tfrac{\sqrt{3}}{2}\right) + \left(-\tfrac{1}{2} + \mathrm j \tfrac{\sqrt{3}}{2}\right) = 0$.
9. Odgovor: v faznih vodnikih teče $10\,\mathrm{A}$, $10\,\mathrm{A}$ in $5\,\mathrm{A}$, v ničelnem vodniku $5\,\mathrm{A}$ (ne $25\,\mathrm{A}$ in ne nič); skupna moč je $5{,}75\,\mathrm{kW}$. Tok v ničelnem vodniku je vsota kazalcev in je nič samo pri simetričnem bremenu.

## Drugače: Na sliki

Predstavljaj si uro s tremi enako dolgimi kazalci. Prvi kaže na $12$, drugi na $4$, tretji na $8$. To so fazne napetosti $\underline{U}_1$, $\underline{U}_2$ in $\underline{U}_3$. Vsi trije se vrtijo skupaj, z enako hitrostjo, zato se slika ne spremeni.

- Konice kazalcev povežeš z daljicami. Dobiš enakostranični trikotnik.
- Vsaka stranica trikotnika je ena medfazna napetost. Daljica od konice na $4$ do konice na $12$ je $\underline{U}_{12} = \underline{U}_1 - \underline{U}_2$.
- Stranica trikotnika, včrtanega v krog s polmerom $U_{\mathrm{f}}$, je dolga $\sqrt{3}\, U_{\mathrm{f}}$. Matejevih $460\,\mathrm{V}$ bi dobil le, če bi kazalca kazala na $12$ in na $6$.

Obe vezavi lahko narišeš kar s črkama. Zvezda je črka Y: trije kraki se srečajo v sredini, v zvezdišču, vsak krak je eno breme. Trikot je trikotnik: vsaka stranica je eno breme, oglišča so priključena na fazne vodnike.

## Drugače: Uporaba v stroki

- **Generator v elektrarni.** Navitja sinhronskega generatorja so vezana v zvezdo. Generator hidroelektrarne z navidezno močjo $50\,\mathrm{MVA}$ in medfazno napetostjo $10{,}5\,\mathrm{kV}$ daje v vsak vodnik tok $I_{\mathrm{v}} = S/(\sqrt{3}\, U_{\mathrm{m}}) \approx 2750\,\mathrm{A}$. Ker je trenutna moč simetričnega sistema stalna, je navor na gredi turbine enakomeren in agregat se ne trese.
- **Distribucijski transformator.** Transformator $20/0{,}4\,\mathrm{kV}$ z močjo $630\,\mathrm{kVA}$ ima visokonapetostno navitje v trikotu in nizkonapetostno v zvezdi. Zvezdišče je ozemljeno in iz njega izhaja ničelni vodnik, zato imajo enofazni odjemalci $230\,\mathrm{V}$, trifazni pa $400\,\mathrm{V}$. Nazivni tok je na nizkonapetostni strani okoli $909\,\mathrm{A}$, na strani $20\,\mathrm{kV}$ le okoli $18\,\mathrm{A}$. Enofazne odjemalce projektant razporedi čim bolj enakomerno po fazah, da je tok v ničelnem vodniku majhen.
- **Zagon zvezda–trikot.** Motor črpalke z močjo $15\,\mathrm{kW}$ in tablico »$\Delta$ $400\,\mathrm{V}$« ima nazivni tok okoli $28\,\mathrm{A}$. Ob neposrednem vklopu v trikotu bi iz omrežja potegnil približno šestkratnik, okoli $170\,\mathrm{A}$. Zato ga zaženemo v zvezdi: navitje dobi $230\,\mathrm{V}$, tok v vodniku in navor sta trikrat manjša (okoli $57\,\mathrm{A}$). Ko se motor zavrti, ga stikala preklopijo v trikot. Motor s tablico »$\Delta/\mathrm Y$ $230/400\,\mathrm{V}$« pa na omrežju $400\,\mathrm{V}$ ostane v zvezdi, ker njegovo navitje prenese le $230\,\mathrm{V}$.

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

? Simetrično breme v zvezdi: $U_{\mathrm{m}} = 400\,\mathrm{V}$, $I_{\mathrm{v}} = 10\,\mathrm{A}$, $\cos\varphi = 0{,}8$. Rešitev v zvezku: »$P = 3 \cdot 400\,\mathrm{V} \cdot 10\,\mathrm{A} \cdot 0{,}8 = 9600\,\mathrm{W}$.« Kje je napaka?
- V zvezdi je fazni tok $\sqrt{3}$-krat večji od toka v vodniku.
~ V zvezdi je tok bremena enak toku v vodniku. Faktor $\sqrt{3}$ pri toku velja za trikot.
- Faktor moči ne spada v trifazno formulo.
~ Faktor moči je potreben pri vsaki delovni moči, enofazni ali trifazni.
+ Faktor $3$ velja za fazne vrednosti; z medfazno napetostjo mora biti $\sqrt{3}$, zato je $P \approx 5543\,\mathrm{W}$.
- Napake ni.
~ Vsaka faza ima le $230\,\mathrm{V}$, ne $400\,\mathrm{V}$. Račun zato da $\sqrt{3}$-krat preveliko moč.
> $P = \sqrt{3} \cdot 400\,\mathrm{V} \cdot 10\,\mathrm{A} \cdot 0{,}8 \approx 5543\,\mathrm{W}$, enako kot $3 \cdot 230{,}9\,\mathrm{V} \cdot 10\,\mathrm{A} \cdot 0{,}8$.

? Trije uporniki po $23\,\Omega$ so vezani v zvezdo na omrežje $230/400\,\mathrm{V}$. Kolikšen je tok v vsakem vodniku?
- približno $17{,}4\,\mathrm{A}$
~ To je $400\,\mathrm{V} / 23\,\Omega$. V zvezdi upor ne dobi medfazne, ampak fazno napetost.
+ približno $10\,\mathrm{A}$
- približno $5{,}8\,\mathrm{A}$
~ Tu je $\sqrt{3}$ uporabljen še pri toku. V zvezdi je tok v vodniku enak toku skozi upor.
> Upor dobi $U_{\mathrm{f}} \approx 230\,\mathrm{V}$, zato $I_{\mathrm{f}} = 230\,\mathrm{V} / 23\,\Omega = 10\,\mathrm{A} = I_{\mathrm{v}}$.

? Motor za vrtenje kupole observatorija ima na tablici »$\Delta/\mathrm Y$ $230/400\,\mathrm{V}$«. Omrežje je $230/400\,\mathrm{V}$. Kako ga priključiš?
- V trikot, ker ima omrežje $400\,\mathrm{V}$.
~ V trikotu bi vsako navitje dobilo $400\,\mathrm{V}$, kar je $\sqrt{3}$-krat več od dovoljenih $230\,\mathrm{V}$. Motor bi se pregrel.
+ V zvezdo, ker tako vsako navitje dobi $400/\sqrt{3} \approx 230\,\mathrm{V}$.
- Vseeno je, motor deluje v obeh vezavah enako.
~ Moč in tok v vodniku se pri preklopu spremenita za faktor $3$, zato vezava ni poljubna.
> Tablica pove napetost navitja: $230\,\mathrm{V}$ v trikotu ali $400\,\mathrm{V}$ medfazno v zvezdi. Na omrežju $400\,\mathrm{V}$ to doseže zvezda.

:::simboli
U | kazalec fazne napetosti | | V | $\underline{U}_1$, $\underline{U}_2$, $\underline{U}_3$ zamaknjeni za $120^\circ$
U_{\mathrm{f}} | fazna napetost (napetost bremena) | U_{\mathrm{f}} = \frac{U_{\mathrm{m}}}{\sqrt{3}} | V | v zvezdi; v trikotu $U_{\mathrm{f}} = U_{\mathrm{m}}$
U_{\mathrm{m}} | medfazna napetost | U_{\mathrm{m}} = \sqrt{3}\, U_{\mathrm{f}} | V | med dvema faznima vodnikoma
I_{\mathrm{f}} | fazni tok (tok skozi breme) | I_{\mathrm{f}} = \frac{U_{\mathrm{f}}}{Z} | A
I_{\mathrm{v}} | tok v vodniku | | A | v trikotu $\sqrt{3}\, I_{\mathrm{f}}$
P | delovna moč | P = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} \cos\varphi | W
Q | jalova moč | Q = S \sin\varphi | var
S | navidezna moč | S = \sqrt{3}\, U_{\mathrm{m}} I_{\mathrm{v}} | VA
\varphi | kot impedance bremena | | ° | med $U_{\mathrm{f}}$ in $I_{\mathrm{f}}$
R | upor grelnega elementa | | \Omega
Z | impedanca ene faze bremena | | \Omega | kazalec $\underline{Z}$, velikost $\lvert\underline{Z}\rvert$
u_k | trenutna napetost faze $k$ | | V | $k = 0, 1, 2$
i_k | trenutni tok faze $k$ | | A
\omega | krožna frekvenca | \omega = 2\pi f | rad/s
f | frekvenca omrežja | | Hz
t | čas | | s
k | številka faze | | – | $0$, $1$ ali $2$
:::
