---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na poletnem potovanju z avtom je v vtičnico za $12\,\text{V}$ vtaknjen razdelilec. Vtičnico ščiti varovalka, recimo za $15\,\text{A}$. V razdelilcu sta že navigacija in hladilna torba. Maja vtakne še polnilnik za telefon in pomiri brata: »Vsaka naprava ima svoj upor. Več naprav, več upora, torej manj toka. Bolj ko razdelilec napolniš, bolj je varen.«

Zveni logično. Pa je res? Če bi bilo tako, varovalka ne bi nikoli pregorela zaradi preveč naprav. A prav to se dogaja. Resnica je ravno obratna: vsaka nova naprava v razdelilcu skupni upor *zmanjša*, tok pa *poveča*.

Kako je to mogoče? Odgovor dasta **Kirchhoffova zakona** in razlika med **zaporedno in vzporedno vezavo**. Z **električno močjo** pa izračunamo, koliko energije na sekundo porabi vsaka naprava.

## Razlaga

**1. Najprej en primer: navigacija in hladilna torba.** Obe napravi sta v razdelilcu priključeni na isti dve žici, ki vodita do akumulatorja. Navigacija ima upor $24\,\Omega$, hladilna torba $3\,\Omega$.

:::risba skica
opis: Avtomobilski akumulator z napetostjo 12 V in dva porabnika, vezana vzporedno med vozliščema A (zgoraj) in B (spodaj): navigacija z uporom 24 Ω in hladilna torba z uporom 3 Ω. Iz akumulatorja priteče v vozlišče A tok 4,5 A. V A se razdeli na 0,5 A skozi navigacijo in 4 A skozi hladilno torbo. V B se tokova spet združita.
območje: -3; -0,5 .. 24; 10,5
črta: 2; 5,5 -> 2; 9 -> 17; 9 -> 17; 6
črta: 17; 4 -> 17; 1 -> 2; 1 -> 2; 4,5
črta: 8; 9 -> 8; 6
črta: 8; 4 -> 8; 1
črta: 1; 5,5 -> 3; 5,5 | debelo
črta: 1,5; 4,5 -> 2,5; 4,5 | debelo
napis: 1; 5 | 12 V | levo
napis: 3,1; 5,9 | + | desno
pravokotnik: 7,4; 4 .. 8,6; 6 | ozadje
pravokotnik: 16,4; 4 .. 17,6; 6 | ozadje
napis: 8,8; 5,8 | navigacija | desno
napis: 8,8; 4,2 | 24 Ω | desno
napis: 17,8; 5,8 | torba | desno
napis: 17,8; 4,2 | 3 Ω | desno
puščica: 3,5; 9 -> 6,5; 9 | 4,5 A | nad
puščica: 10; 9 -> 14; 9 | 4 A | nad
puščica: 8; 8,6 -> 8; 6,6 | 0,5 A | desno
točka: 8; 9 | A | nad
točka: 8; 1 | B | pod
:::

Ker sta obe napravi priključeni neposredno na akumulator, ima vsaka napetost $12\,\text{V}$. Tok skozi vsako dobimo z Ohmovim zakonom:

$$I_N = \frac{12}{24} = 0{,}5\,\text{A}$$

$$I_T = \frac{12}{3} = 4\,\text{A}$$

Oba tokova pritečeta iz akumulatorja po isti žici do točke A, zato po tej žici teče $0{,}5 + 4 = 4{,}5\,\text{A}$. Akumulator »vidi« eno samo napravo, ki pri $12\,\text{V}$ vleče $4{,}5\,\text{A}$. Njen upor je

$$R = \frac{12}{4{,}5} \approx 2{,}67\,\Omega$$

To je *manj* od $3\,\Omega$, čeprav smo dodali napravo. Navigacija ni nič zaprla, odprla je dodatno pot za tok.

**2. Prvi Kirchhoffov zakon (zakon o vozliščih).** Točka A je **vozlišče**: točka, kjer se stikajo vsaj trije vodniki. Del vezja med dvema vozliščema je **veja**. Kaj bi se zgodilo, če bi v vozlišče priteklo več naboja, kot ga odteče? Naboj bi se tam kopičil in odbijal novega, ki priteka, zato se tokova hitro izenačita. Naboj se v vozlišču torej ne nabira in ne izgine:

$$\sum I_{\text{vtekajoči}} = \sum I_{\text{iztekajoči}}$$

V A priteče $4{,}5\,\text{A}$, odteče $0{,}5\,\text{A} + 4\,\text{A}$.

**3. Vzporedna vezava.** Naprave so **vzporedno** vezane, kadar so vse priključene na isti dve vozlišči. Primer z avtom posplošimo v treh korakih:

- Napetost je na vseh vejah enaka: $U = U_1 = U_2$.
- Tokovi se seštevajo: $I = I_1 + I_2$.
- Ker je $I_k = \dfrac{U}{R_k}$, sledi $\dfrac{U}{R} = \dfrac{U}{R_1} + \dfrac{U}{R_2}$. Delimo z $U$:

$$\frac{1}{R} = \frac{1}{R_1} + \frac{1}{R_2}$$

Upor $R$ je **nadomestni upor**: en sam upornik, ki bi iz vira vlekel enak tok kot celotna vezava. Za dva upornika lahko pišemo tudi $R = \dfrac{R_1 R_2}{R_1 + R_2}$; za avto $\dfrac{24 \cdot 3}{27} \approx 2{,}67\,\Omega$, kot zgoraj.

:::premisli
Ali je lahko nadomestni upor vzporedne vezave kdaj večji od najmanjšega posameznega upora? Utemelji brez računanja.
---
Ne. Že veja z najmanjšim uporom sama vleče tok $\dfrac{U}{R_{\min}}$. Vsaka druga veja temu toku nekaj *doda*, zato je skupni tok večji, nadomestni upor $\dfrac{U}{I}$ pa manjši od $R_{\min}$. Zato Maja nima prav: polnilnik telefona je tretja veja, ki skupni tok še poveča.
:::

**4. Zaporedna vezava.** Uporniki so **zaporedno** vezani, kadar so drug za drugim in med njimi ni vozlišča. Naboj ima eno samo pot.

- Tok je povsod enak: $I = I_1 = I_2$. Tok se v upornikih ne »porabi«.
- Napetosti se seštevajo: $U = U_1 + U_2$.
- Skupni upor: $R = R_1 + R_2 + \dots$

Če en element prekine vezje, tok ne teče nikjer.

Zakaj se napetosti seštevajo? **Zanka** je sklenjena pot po vejah vezja. Vsak naboj $e$ dobi na viru energijo $eU$ in jo na poti skozi porabnike odda. Ko se vrne na začetek, je oddal vse, kar je dobil. To je **drugi Kirchhoffov zakon (zakon o zankah)**:

$$U_{\text{vira}} = U_1 + U_2 + \dots$$

Zakon velja za vsako zanko, tudi za zanko z več viri in vzporednimi vejami. Izberi smer obhoda. Na viru, ki ga prečkaš od − do +, napetost prišteješ (»dvig«). Na porabniku, ki ga prečkaš v smeri toka, jo odšteješ (»padec«). Vsota je nič.

Ker je tok skozi oba upornika enak, je $IR = IR_1 + IR_2$, od tod $R = R_1 + R_2$.

:::premisli
Dve enaki žarnici svetita zaporedno vezani na baterijo. Drugo premostiš z žico, ki ima skoraj ničelni upor. Napovej: kaj se zgodi z obema žarnicama?
---
Tok gre po žici mimo druge žarnice, zato ta ugasne. Skupni upor se zmanjša skoraj na upor prve žarnice, tok pa se poveča. Na prvi žarnici je zdaj celotna napetost vira namesto polovice, zato sveti močneje.
:::

:::risba skica
opis: Dve vezji z isto baterijo U in dvema upornikoma; daljša plošča baterije je pozitivni pol. Levo zaporedna vezava: R₁ in R₂ sta drug za drugim na isti žici, tok I ima eno samo pot. Desno vzporedna vezava: R₁ in R₂ sta v dveh vejah med vozliščema A in B, tok I se v A razdeli na I₁ in I₂ in v B spet združi.
območje: 0; -2,8 .. 22; 10
črta: 1; 2 -> 1; 8 -> 10; 8 -> 10; 2 -> 6; 2
črta: 5; 2 -> 1; 2
pravokotnik: 2,5; 7,4 .. 4,5; 8,6 | ozadje
pravokotnik: 6,5; 7,4 .. 8,5; 8,6 | ozadje
napis: 3,5; 8,6 | R_1 | nad
napis: 7,5; 8,6 | R_2 | nad
črta: 5; 1,2 -> 5; 2,8 | debelo
črta: 6; 1,6 -> 6; 2,4 | debelo
napis: 5,5; 1 | U | pod
napis: 4,8; 3 | + | levo
puščica: 10; 6,5 -> 10; 3,5 | I | levo
napis: 5,5; -2 | zaporedno
črta: 14; 5 -> 14; 8 -> 19; 8 -> 19; 5
črta: 14; 5 -> 19; 5
črta: 14; 5 -> 12; 5 -> 12; 2 -> 15,5; 2
črta: 16,5; 2 -> 21; 2 -> 21; 5 -> 19; 5
pravokotnik: 15,5; 7,4 .. 17,5; 8,6 | ozadje
pravokotnik: 15,5; 4,4 .. 17,5; 5,6 | ozadje
napis: 16,5; 8,6 | R_1 | nad
napis: 16,5; 5,6 | R_2 | nad
točka: 14; 5 | A | pod levo
točka: 19; 5 | B | pod desno
črta: 15,5; 1,2 -> 15,5; 2,8 | debelo
črta: 16,5; 1,6 -> 16,5; 2,4 | debelo
napis: 16; 1 | U | pod
napis: 15,3; 3 | + | levo
puščica: 12; 2,4 -> 12; 4,6 | I | levo
puščica: 14; 5,6 -> 14; 7,6 | I_1 | levo
puščica: 17,7; 5 -> 18,6; 5 | I_2 | pod
napis: 16,5; -2 | vzporedno
:::

| Količina | Zaporedno | Vzporedno |
|---|---|---|
| tok | povsod enak | $I = I_1 + I_2$ |
| napetost | $U = U_1 + U_2$ | povsod enaka |
| skupni upor | večji od vsakega | manjši od vsakega |
| en element odpove | ugasne vse | drugi delujejo |

Graf spodaj primerja obe vezavi. Prvi upornik ima $R_1 = 10\,\Omega$, drugega ($R_2$) spreminjamo vzdolž osi. Pri $R_2 = 10\,\Omega$ je zaporedni upor $20\,\Omega$, vzporedni $5\,\Omega$. V aplikaciji premakni drsnik $R_1$ od najmanjše do največje vrednosti in opazuj spodnjo krivuljo: vedno ostane pod obema črtkanima črtama, torej pod $R_1$ in pod $R_2$.

:::risba graf
opis: Skupni upor dveh upornikov v odvisnosti od R₂, ko je R₁ = {a} Ω. Zgornja premica je zaporedna vezava, R₁ + R₂. Spodnja krivulja je vzporedna vezava. Črtkani črti kažeta vrednosti R₁ in R₂. Pri R₂ = 10 Ω je zaporedni upor {a+10} Ω, vzporedni {a*10/(a+10):.1} Ω.
x: 0 .. 40 | 5 | R_2 (Ω)
y: 0 .. 55 | 10 | R (Ω)
višina: 250
drsnik: a | 8 .. 20 | 1 | 10 | upor prvega upornika v ohmih
f: a + x | modra debelo | 0 .. 30
f: a*x/(a+x) | oranžna debelo | 0 .. 30
f: a | siva črtkano | 0 .. 30
f: x | siva črtkano | 0 .. 30
točka: 10; a + 10
točka: 10; a*10/(a+10)
napis: 30,5; a + 30 | zaporedno | desno
napis: 22; a*22/(a+22) | vzporedno | pod
napis: 30,5; a | R_1 | desno
napis: 30,5; 30 | R_2 | desno
podnapis: R₁ = {a} Ω. Pri R₂ = 10 Ω: zaporedno {a+10} Ω, vzporedno {a*10/(a+10):.1} Ω.
:::

**5. Električna moč.** Moč pove, koliko električnega dela se opravi (koliko energije se pretvori) v eni sekundi. Napetost je delo na enoto naboja, tok pa naboj na sekundo, zato je njun produkt delo na sekundo:

$$P = U \cdot I$$

Z Ohmovim zakonom ($U = IR$) dobimo še obliki

$$P = I^2 R \qquad P = \frac{U^2}{R}$$

Enota je vat: $1\,\text{W} = 1\,\text{V} \cdot 1\,\text{A}$. Opravljeno delo (porabljena energija) je $A = P \cdot t$. Hladilna torba iz avta ima moč $P = 12 \cdot 4 = 48\,\text{W}$.

Oblika $P = \dfrac{U^2}{R}$ pove, kaj se zgodi z dvema enakima grelnikoma na isti bateriji. Upor grelne žice je skoraj stalen (pri žarnici z nitko ne bi bil). Zaporedno je skupni upor $2R$, vzporedno $\dfrac{R}{2}$, štirikrat manj. Zato je vzporedna moč štirikrat večja. Na grafu je $R = 6\,\Omega$: pri $12\,\text{V}$ dasta grelnika zaporedno $12\,\text{W}$, vzporedno $48\,\text{W}$. V aplikaciji spreminjaj upor grelnika in preveri, da razmerje ostane $4$.

:::risba graf
opis: Skupna moč dveh enakih grelnikov s stalnim uporom R = {r} Ω v odvisnosti od napetosti baterije. Spodnja črtkana krivulja: zaporedna vezava, P = U²/(2R). Zgornja polna krivulja: vzporedna vezava, P = 2U²/R. Pri 12 V je zaporedna moč {72/r} W, vzporedna {288/r} W, štirikrat več.
x: 0 .. 15 | 2 | U (V)
y: 0 .. 80 | 10 | P (W)
drsnik: r | 4 .. 12 | 2 | 6 | upor enega grelnika v ohmih
f: x^2/(2*r) | modra debelo črtkano | 0 .. 13
f: 2*x^2/r | oranžna debelo | 0 .. 13
točka: 12; 72/r | {72/r} W | nad levo
točka: 12; 288/r | {288/r} W | levo
podnapis: Polna črta: vzporedno. Črtkana črta: zaporedno. Upor enega grelnika R = {r} Ω.
:::

**6. Načrt reševanja.** Poišči dele, ki so čisto zaporedni ali čisto vzporedni, in jih nadomesti z enim uporom. Iz nadomestnega upora izračunaj skupni tok, nato pa po korakih napetosti in tokove na posameznih delih.

## Rešeni primeri

### Primer 1 (lažji): zaporedna vezava

Upornika $R_1 = 20\,\Omega$ in $R_2 = 40\,\Omega$ sta zaporedno vezana na baterijo z napetostjo $12\,\text{V}$. Kolikšen je tok in kolikšni sta napetosti na upornikih?

**Podatki:** $R_1 = 20\,\Omega$, $R_2 = 40\,\Omega$ (zaporedna vezava), $U = 12\,\text{V}$
**Iščemo:** tok $I$ ter napetosti $U_1$ in $U_2$

:::formula
Zaporedna vezava: $R = R_1 + R_2$, $I = \dfrac{U}{R}$, $U_1 = I R_1$, $U_2 = I R_2$
:::

**Rešitev:**

1. Pri zaporedni vezavi se upori seštevajo: $R = 20 + 40 = 60\,\Omega$.
2. Skupni tok: $I = \dfrac{U}{R} = \dfrac{12}{60} = 0{,}2\,\text{A}$. Tok je v celotnem vezju enak.
3. Napetosti: $U_1 = I R_1 = 0{,}2 \cdot 20 = 4\,\text{V}$ in $U_2 = I R_2 = 0{,}2 \cdot 40 = 8\,\text{V}$.
4. Preverimo z drugim Kirchhoffovim zakonom: $U_1 + U_2 = 4 + 8 = 12\,\text{V}$, kar je enako napetosti vira. ✓
5. Odgovor: tok je $0{,}2\,\text{A}$, napetosti na upornikih sta $4\,\text{V}$ in $8\,\text{V}$. Večji upornik ima večji padec napetosti, ker je pri enakem toku $U_k = I R_k$ sorazmerna z uporom.

:::risba skica
opis: Zaporedna vezava iz Primera 1. Baterija 12 V, upornika 20 Ω in 40 Ω drug za drugim. Skozi oba teče tok 0,2 A. Na uporniku 20 Ω je napetost 4 V, na uporniku 40 Ω pa 8 V; skupaj 12 V.
območje: -1; 1 .. 22; 10
črta: 2; 4,5 -> 2; 8 -> 20; 8 -> 20; 2 -> 2; 2 -> 2; 3,5
črta: 1; 4,5 -> 3; 4,5 | debelo
črta: 1,5; 3,5 -> 2,5; 3,5 | debelo
napis: 3,2; 4 | 12 V | desno
napis: 0,8; 4,9 | + | levo
pravokotnik: 6; 7,4 .. 9; 8,6 | ozadje
pravokotnik: 13; 7,4 .. 16; 8,6 | ozadje
napis: 7,5; 8,8 | 20 Ω | nad
napis: 14,5; 8,8 | 40 Ω | nad
napis: 7,5; 7,2 | 4 V | pod
napis: 14,5; 7,2 | 8 V | pod
puščica: 20; 6,5 -> 20; 3,5 | 0,2 A | levo
:::

### Primer 2: avtodom na kampu

Avtodom je v kampu priključen na omrežno napetost $230\,\text{V}$. Hkrati delujeta električni kuhalnik vode z močjo $2000\,\text{W}$ in grelec z močjo $1000\,\text{W}$, vezana vzporedno. Kolikšen tok teče po kablu do avtodoma in kolikšen je nadomestni upor?

**Podatki:** $U = 230\,\text{V}$ (vzporedna vezava), $P_1 = 2000\,\text{W}$, $P_2 = 1000\,\text{W}$
**Iščemo:** skupni tok $I$ in nadomestni upor $R$

:::formula
$I_k = \dfrac{P_k}{U}$, $I = I_1 + I_2$, $R = \dfrac{U}{I}$
:::

**Rešitev:**

1. Vzporedno ima vsaka naprava celotno napetost $230\,\text{V}$, zato tok vsake dobimo iz $P = UI$: $I_1 = \dfrac{2000}{230} \approx 8{,}70\,\text{A}$ in $I_2 = \dfrac{1000}{230} \approx 4{,}35\,\text{A}$.
2. Po prvem Kirchhoffovem zakonu se tokova v vozlišču seštejeta: $I \approx 8{,}70 + 4{,}35 = 13{,}05\,\text{A}$. Natančneje: $I = \dfrac{3000}{230} \approx 13{,}04\,\text{A}$ (razlika je le zaradi zaokroževanja).
3. Nadomestni upor: $R = \dfrac{U}{I} = \dfrac{230^2}{3000} \approx 17{,}6\,\Omega$, ker je $\dfrac{U}{I} = \dfrac{U^2}{P}$.
4. Preverimo: sam kuhalnik ima $\dfrac{230^2}{2000} = 26{,}45\,\Omega$. Nadomestni upor je manjši, kot mora biti pri vzporedni vezavi. ✓
5. Recimo, da je priključek v kampu zavarovan z varovalko za $10\,\text{A}$. Tok $13\,\text{A}$ je večji, zato varovalka izklopi. Največja dovoljena moč je $P = U I = 230 \cdot 10 = 2300\,\text{W}$. Vsaka naprava posebej je pod to mejo, obe hkrati pa ne smeta delovati.
6. Odgovor: po kablu teče približno $13\,\text{A}$, nadomestni upor je približno $17{,}6\,\Omega$.

### Primer 3 (težji): mešana vezava

Upornik $R_1 = 10\,\Omega$ je zaporedno vezan z vzporedno vezavo upornikov $R_2 = 30\,\Omega$ in $R_3 = 60\,\Omega$. Vir ima napetost $24\,\text{V}$. Izračunaj tok skozi vsak upornik in moč na $R_1$.

**Podatki:** $R_1 = 10\,\Omega$ (zaporedno z vzporedno vezavo), $R_2 = 30\,\Omega$, $R_3 = 60\,\Omega$ (vzporedno), $U = 24\,\text{V}$
**Iščemo:** tokove $I_1$, $I_2$, $I_3$ in moč $P_1$ na $R_1$

:::formula
Vzporedni del: $R_{23} = \dfrac{R_2 R_3}{R_2 + R_3}$; celoten upor $R = R_1 + R_{23}$; $I = \dfrac{U}{R}$; $U_1 = I R_1$, $U_{23} = U - U_1$; $I_2 = \dfrac{U_{23}}{R_2}$, $I_3 = \dfrac{U_{23}}{R_3}$; $P_1 = I^2 R_1$
:::

**Rešitev:**

1. **Vzporedni del.** $R_{23} = \dfrac{30 \cdot 60}{30 + 60} = 20\,\Omega$.
2. **Celoten upor.** Ta del je zaporedno z $R_1$: $R = 10 + 20 = 30\,\Omega$.
3. **Skupni tok.** $I = \dfrac{24}{30} = 0{,}8\,\text{A}$. Ta tok teče skozi $R_1$, ker je v zaporedju z ostalim.
4. **Napetost na $R_1$.** $U_1 = 0{,}8 \cdot 10 = 8\,\text{V}$.
5. **Napetost na vzporednem delu.** Po drugem Kirchhoffovem zakonu: $U_{23} = 24 - 8 = 16\,\text{V}$. Preverimo: $0{,}8 \cdot 20 = 16\,\text{V}$. ✓
6. **Tokova po vejah.** $I_2 = \dfrac{16}{30} \approx 0{,}53\,\text{A}$ in $I_3 = \dfrac{16}{60} \approx 0{,}27\,\text{A}$. Vsota je $0{,}8\,\text{A}$, kar ustreza prvemu Kirchhoffovemu zakonu. ✓
7. **Moč na $R_1$.** $P_1 = I^2 R_1 = 0{,}8^2 \cdot 10 = 0{,}64 \cdot 10 = 6{,}4\,\text{W}$.
8. **Odgovor.** Skozi $R_1$ teče $0{,}8\,\text{A}$, skozi $R_2$ približno $0{,}53\,\text{A}$, skozi $R_3$ približno $0{,}27\,\text{A}$. Moč na $R_1$ je $6{,}4\,\text{W}$.

:::risba skica
opis: Mešana vezava iz Primera 3. Vir 24 V, upornik R₁ = 10 Ω zaporedno, nato vozlišče A, kjer se tok 0,8 A razdeli na dve veji: R₂ = 30 Ω s tokom 0,53 A in R₃ = 60 Ω s tokom 0,27 A. V vozlišču B (spodaj desno, kjer se veja z R₃ priključi na desno žico) se tokova združita. Na R₁ je 8 V, med A in B 16 V.
območje: -1; -1 .. 30; 13
črta: 1; 6 -> 1; 11 -> 22; 11 -> 22; 0 -> 1; 0 -> 1; 5
črta: 12; 11 -> 12; 3,5 -> 22; 3,5
črta: 0; 6 -> 2; 6 | debelo
črta: 0,5; 5 -> 1,5; 5 | debelo
napis: 2,2; 5,5 | 24 V | desno
pravokotnik: 3,5; 10,4 .. 6,5; 11,6 | ozadje
napis: 5; 11,8 | R_1 = 10 Ω | nad
napis: 5; 10,2 | 8 V | pod
puščica: 7; 11 -> 10,5; 11 | 0,8 A | pod
pravokotnik: 15,5; 10,4 .. 18,5; 11,6 | ozadje
pravokotnik: 15,5; 2,9 .. 18,5; 4,1 | ozadje
napis: 17; 11,8 | R_2 = 30 Ω | nad
puščica: 13; 11 -> 15,2; 11 | 0,53 A | pod
napis: 17; 4,3 | R_3 = 60 Ω | nad
puščica: 13; 3,5 -> 15,2; 3,5 | 0,27 A | pod
točka: 12; 11 | A | nad
točka: 22; 3,5 | B | desno
napis: 23; 7 | U_{AB} = 16 V | desno
napis: 2,2; 6,6 | + | desno
:::

### Primer 4 – zdaj ti

Na avtobusu je ob sedežu polnilna postaja z izhodom $5\,\text{V}$. Nanjo sta vzporedno priključena telefon z vklopljeno navigacijo, ki jemlje $2\,\text{A}$, in sestrin telefon, ki se polni z $1\,\text{A}$. Koliko energije da postaja v eni uri vožnje?

**Podatki:** $U = 5\,\text{V}$ (vzporedna vezava), $I_1 = 2\,\text{A}$, $I_2 = 1\,\text{A}$, $t = 1\,\text{h} = 3600\,\text{s}$
**Iščemo:** energijo (delo) $A$

:::formula
$I = I_1 + I_2$, $P = U \cdot I$, $A = P \cdot t$
:::

**Rešitev:**

1. Napravi sta vezani vzporedno, zato imata obe napetost $5\,\text{V}$.
2. Skupni tok po prvem Kirchhoffovem zakonu: $I = 2\,\text{A} + 1\,\text{A} = 3\,\text{A}$. Zakaj: tokova obeh vej se v vozlišču postaje združita.
3. Zdaj ti: izračunaj skupno moč in nato energijo v eni uri.

:::premisli
Kolikšna je energija?
---
$P = U \cdot I = 5\,\text{V} \cdot 3\,\text{A} = 15\,\text{W}$, nato $A = P \cdot t = 15\,\text{W} \cdot 3600\,\text{s} = 54\,000\,\text{J}$. Postaja v eni uri da $54\,000\,\text{J}$ energije.
:::

## Pogoste napake

- **»Več porabnikov, večji upor.«** Majina misel: vsak porabnik doda upor, zato se upori seštejejo. To velja le zaporedno. Vzporedno vsak porabnik doda novo pot, zato je skupni upor manjši od najmanjšega. Preveri: če pri vzporedni vezavi dobiš rezultat, večji od najmanjšega upora, si se zmotil.
- **Pozabljeno obračanje.** »$\dfrac{1}{20} + \dfrac{1}{30} = \dfrac{5}{60}$, torej $R = \dfrac{5}{60}\,\Omega$.« Izračunal si $\dfrac{1}{R}$, ne $R$. Na koncu ulomek obrni: $R = \dfrac{60}{5} = 12\,\Omega$.
- **Enak tok pri vzporedni vezavi.** »Obe veji sta na istem viru, torej teče skozi obe enak tok.« Enaka je *napetost*; tok je po Ohmovem zakonu $\dfrac{U}{R_k}$, zato teče več po veji z manjšim uporom. Enak tok velja pri zaporedni vezavi, kjer se razdeli napetost.
- **Napačni predznak v vozlišču.** »V vozlišče priteče $2\,\text{A}$, odtečeta $0{,}5\,\text{A}$ in $0{,}7\,\text{A}$, torej po tretji žici teče $3{,}2\,\text{A}$.« Seštel si vse tokove ne glede na smer. Vtekajoči so na eni strani enačbe, iztekajoči na drugi: $2 = 0{,}5 + 0{,}7 + I_3$.
- **Mešanje moči in energije.** »Grelnik $2000\,\text{W}$ v eni uri porabi $2000\,\text{J}$.« Vat pove energijo *na sekundo*; porabljena energija je $A = P \cdot t$ v džulih ($1\,\text{J} = 1\,\text{W}\cdot\text{s}$). Pri tem čas pretvori v sekunde: $2000\,\text{W} \cdot 1\,\text{h}$ ni $2000\,\text{J}$, temveč $2000 \cdot 3600\,\text{J}$.

## Povzetek

- Prvi Kirchhoffov zakon: vsota vtekajočih tokov v vozlišče je enaka vsoti iztekajočih.
- Drugi Kirchhoffov zakon: v sklenjeni zanki je napetost vira enaka vsoti padcev napetosti.
- Zaporedno: enak tok, $U = U_1 + U_2$, $R = R_1 + R_2$.
- Vzporedno: enaka napetost, $I = I_1 + I_2$, $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}$; vsaka nova veja zmanjša skupni upor.
- Moč: $P = UI = I^2 R = \dfrac{U^2}{R}$, delo $A = Pt$.
- Mešana vezava: najprej poenostavi na nadomestni upor, nato računaj nazaj proti posameznim delom.

## Drugače: Z analogijo

Predstavljaj si smučišče na zemljevidu smučarskega centra. Smučarji so naboji, število smučarjev, ki v minuti pridejo mimo, je tok. Nadmorska višina je kot električni potencial, višinska razlika pa kot napetost.

**Vlečnica je vir.** Vsakega smučarja dvigne za isto višino, kot vir vsakemu naboju da enako energijo na enoto naboja.

**Razcep proge je vozlišče.** Kolikor smučarjev v minuti pripelje do razcepa, toliko jih odpelje po obeh progah skupaj. Nihče ne izgine. To je prvi Kirchhoffov zakon.

**Dve progi z vrha v dolino sta vzporedna vezava.** Obe premagata isto višinsko razliko, kot imata vzporedni veji isto napetost. Če vlečnica sproti odpelje vse, z dvema progama v dolino pride več smučarjev na minuto kot z eno, tudi če je druga proga ozka: nova pot zmanjša skupni upor.

**Krog vlečnica–proga–vlečnica je zanka.** Kdor se vrne na isto mesto, je skupaj spustil toliko višine, kot ga je vlečnica dvignila, ne glede na to, po kateri progi je šel. Če proga vodi čez dve strmini zaporedoma, se višinska padca seštejeta. To je drugi Kirchhoffov zakon.

**Meja analogije.** Za napetost (višino) analogija velja točno, za upor le približno. Na smučišču pretok skozi dve zaporedni ozki mesti določa predvsem ožje mesto. Pri upornikih pa vsak prispeva svoj del, zato se upora seštejeta. Še ena razlika: na smučišču pretok omejuje tudi vlečnica, ki odpelje le toliko smučarjev na minuto, zato druga proga v dolino ne pripelje več ljudi, kot jih vlečnica zmore. Vir v vezju take meje skoraj nima, zato nova veja res poveča skupni tok.

## Drugače: Bolj natančno

**Več enakih upornikov.** Za $n$ enakih upornikov z uporom $R_0$ da zaporedna vezava $n R_0$. Vzporedno je $\dfrac{1}{R} = \dfrac{n}{R_0}$, torej $R = \dfrac{R_0}{n}$. Trije uporniki po $10\,\Omega$ vzporedno dajo $\dfrac{10}{3} \approx 3{,}33\,\Omega$.

**Delilnik napetosti.** Pri zaporedni vezavi je tok $I = \dfrac{U}{R_1 + R_2}$, zato je napetost na prvem uporniku

$$U_1 = U \cdot \frac{R_1}{R_1 + R_2}$$

Napetost vira se razdeli v razmerju uporov. V Primeru 1: $U_1 = 12 \cdot \dfrac{20}{60} = 4\,\text{V}$, brez računanja toka.

**Izvor moči.** Električna napetost je delo na enoto naboja: $U = \dfrac{A}{e}$ (tukaj $e$ označuje naboj, ki preteče). Tok je $I = \dfrac{e}{t}$. Moč je delo na čas: $P = \dfrac{A}{t} = \dfrac{U e}{t} = U I$.

**Ohranitev energije.** Moč, ki jo da vir, je vsota moči na vseh porabnikih. Pri zaporedni vezavi: $UI = U_1 I + U_2 I$, kar je ravno drugi Kirchhoffov zakon, pomnožen s tokom. Pri vzporedni: $UI = UI_1 + UI_2$, kar je prvi zakon, pomnožen z napetostjo. V primeru z avtom: $12 \cdot 4{,}5 = 54\,\text{W}$, kar je $6\,\text{W}$ za navigacijo in $48\,\text{W}$ za torbo. Varovalka za $15\,\text{A}$ dovoli največ $12 \cdot 15 = 180\,\text{W}$. Navigacija in torba sta pod mejo, s tremi dodatnimi torbami pa bi bilo $54 + 3 \cdot 48 = 198\,\text{W}$ in varovalka bi pregorela. Majin razdelilec torej ni »varnejši«, če ga napolni.

## Preveri se

? Maja v avtu vtakne napravi v razdelilec, torej ju veže vzporedno. Katera trditev o vzporedni vezavi je pravilna?
- Skozi vse naprave teče enak tok.
~ Enak tok velja za zaporedno vezavo. Vzporedno se tok razdeli, več ga teče po veji z manjšim uporom.
+ Na vseh napravah je enaka napetost.
- Skupni upor je vsota posameznih uporov.
~ Seštevanje uporov velja za zaporedno vezavo. Vzporedno je skupni upor manjši od najmanjšega.
- Če ena naprava odpove, prenehajo delovati vse.
~ To se zgodi pri zaporedni vezavi z eno samo potjo. Vzporedno ostale veje delujejo naprej.
> Vse naprave so priključene na isti dve vozlišči, zato je med njihovima koncema ista napetost.

? Z risbe vozlišča odčitaj znane tokove in izračunaj tok $I_3$ v amperih.
:::risba skica
opis: Vozlišče, v katerem se stikajo štirje vodniki. Z leve v vozlišče priteče tok 2 A. Navzgor odteče 0,5 A, desno odteče 0,7 A. Navzdol odteka neznani tok I₃.
območje: 0; 0 .. 10; 10
črta: 1; 5 -> 9; 5
črta: 5; 1 -> 5; 9
krog: 5; 5 | 0,25 | polno
puščica: 1,5; 5 -> 4; 5 | 2 A | nad
puščica: 5; 6 -> 5; 8,5 | 0,5 A | desno
puščica: 6; 5 -> 8,5; 5 | 0,7 A | nad
puščica: 5; 4 -> 5; 1,5 | I_3 | desno
:::
= 0,8 A | 0,01
~ 3,2 | Seštel si vse tokove. Vtekajoči tokovi so na eni strani enačbe, iztekajoči na drugi.
~ 1,2 | Seštel si samo odtekajoča tokova. $I_3$ je tisto, kar od $2\,\text{A}$ še ostane.
> $2\,\text{A} = 0{,}5\,\text{A} + 0{,}7\,\text{A} + I_3$, zato je $I_3 = 0{,}8\,\text{A}$.

? Trije enaki uporniki imajo vsak po $10\,\Omega$. Razvrsti vezave (za primerjavo je dodan en sam upornik) od najmanjšega do največjega nadomestnega upora.
1. vsi trije vzporedno
2. dva zaporedno, tretji vzporedno k njima
3. en sam upornik
4. dva vzporedno, tretji zaporedno z njima
5. vsi trije zaporedno
> Vrednosti so $3{,}33\,\Omega$; $6{,}67\,\Omega$; $10\,\Omega$; $15\,\Omega$; $30\,\Omega$. Več vzporednih poti pomeni manjši upor, več zaporednih večjega.

? Kaj se zgodi s skupno močjo, če dva enaka grelnika s stalnim uporom na isti bateriji prevežemo iz zaporedne v vzporedno vezavo?
- Ostane enaka, saj gre za ista grelnika.
~ Grelnika sta ista, a skupni upor ni: zaporedno je $2R$, vzporedno $\dfrac{R}{2}$.
- Zmanjša se, ker je tok razdeljen na dve veji.
~ Tok se res razdeli, a skozi vsako vejo teče več kot prej, saj ima vsak grelnik zdaj celotno napetost.
+ Poveča se štirikrat.
- Poveča se dvakrat.
~ Upor se ne spremeni le dvakrat: iz $2R$ pade na $\dfrac{R}{2}$, torej štirikrat.
> $P = \dfrac{U^2}{R}$: zaporedno $\dfrac{U^2}{2R}$, vzporedno $\dfrac{2U^2}{R}$. Razmerje je $4$, kot kaže graf moči v razlagi.

? Tablica se v avtu polni z napetostjo $9\,\text{V}$ in tokom $2\,\text{A}$. Koliko džulov energije prejme v $1{,}5\,\text{h}$?
= 97200 J | 100
~ 18 | To je moč v vatih. Pozabil si pomnožiti s časom: $A = P \cdot t$.
~ 27 | Čas si pustil v urah. $1{,}5\,\text{h} = 5400\,\text{s}$, šele potem dobiš džule.
> $P = U I = 9\,\text{V} \cdot 2\,\text{A} = 18\,\text{W}$, $t = 1{,}5 \cdot 3600\,\text{s} = 5400\,\text{s}$, $A = P t = 18 \cdot 5400 = 97\,200\,\text{J}$.

? Ana računa nadomestni upor upornikov $20\,\Omega$ in $30\,\Omega$ v vzporedni vezavi in dobi $\dfrac{1}{R} = \dfrac{5}{60}\,\Omega^{-1}$. Koliko ohmov je $R$?
= 12 Ω | 0,01
~ 0,083 | To je $\dfrac{5}{60}$, torej $\dfrac{1}{R}$. Ulomek moraš na koncu obrniti.
~ 50 | Upora si seštel kot pri zaporedni vezavi.
> $R = \dfrac{60}{5} = 12\,\Omega$. To je manj od $20\,\Omega$, kot mora biti pri vzporedni vezavi.

? Na risbi je mešana vezava. Kolikšen tok v amperih teče skozi upornik $12\,\Omega$?
:::risba skica
opis: Vir 12 V, upornik 4 Ω na zgornji žici, nato vozlišče A. Med vozliščema A in B sta dve veji: zgoraj upornik 6 Ω, spodaj upornik 12 Ω. Iz B se žica vrne k viru.
območje: -1; 0 .. 26; 13
črta: 1; 6 -> 1; 11 -> 22; 11 -> 22; 1 -> 1; 1 -> 1; 5
črta: 12; 11 -> 12; 5 -> 22; 5
črta: 0; 6 -> 2; 6 | debelo
črta: 0,5; 5 -> 1,5; 5 | debelo
napis: 2,2; 5,5 | 12 V | desno
napis: 2,2; 6,6 | + | desno
pravokotnik: 3,5; 10,4 .. 6,5; 11,6 | ozadje
napis: 5; 11,8 | 4 Ω | nad
pravokotnik: 15,5; 10,4 .. 18,5; 11,6 | ozadje
napis: 17; 11,8 | 6 Ω | nad
pravokotnik: 15,5; 4,4 .. 18,5; 5,6 | ozadje
napis: 17; 5,8 | 12 Ω | nad
točka: 12; 11 | A | nad
točka: 22; 5 | B | desno
:::
= 0,5 A | 0,01
~ 1,5 | To je skupni tok skozi $4\,\Omega$. V vozlišču A se razdeli na dve veji.
~ 0,75 | Tok si razdelil na pol. Več ga teče po veji z manjšim uporom.
~ 1 | Računal si $\dfrac{12\,\text{V}}{12\,\Omega}$. Del napetosti vira odpade na $4\,\Omega$.
~ 0,55 | Vse tri upornike si seštel kot zaporedne. Upornika $6\,\Omega$ in $12\,\Omega$ sta med istima vozliščema, torej vzporedno.
> Vzporedni del: $\dfrac{6 \cdot 12}{18} = 4\,\Omega$, skupaj $8\,\Omega$. Skupni tok $\dfrac{12}{8} = 1{,}5\,\text{A}$, $U_{AB} = 1{,}5 \cdot 4 = 6\,\text{V}$, tok skozi $12\,\Omega$ je $\dfrac{6}{12} = 0{,}5\,\text{A}$.

:::simboli
I_{\text{vtekajoči}} | tok, ki vteka v vozlišče | | A | vsota vtekajočih je enaka vsoti iztekajočih
I_{\text{iztekajoči}} | tok, ki izteka iz vozlišča | | A
U_{\text{vira}} | napetost vira | | V | zaporedno se razdeli na porabnike
I_N | tok skozi navigacijo | I_N = \dfrac{U}{24\,\Omega} | A
I_T | tok skozi hladilno torbo | I_T = \dfrac{U}{3\,\Omega} | A
R_{\min} | najmanjši upor med vejami | | Ω
e | naboj (ki preteče) | e = I t | As
R_0 | upor enega od $n$ enakih upornikov | | Ω
n | število enakih upornikov | | –
U | napetost | U = I \cdot R | V
I | (skupni) električni tok | I = \dfrac{U}{R} | A
R | (nadomestni) upor | R = \dfrac{U}{I} | Ω
P | električna moč | P = U \cdot I | W | tudi $P = I^2 R = U^2/R$
U_1, U_2 | napetost na posameznem uporniku | | V
I_1, I_2, I_3 | tok skozi posamezni upornik ali napravo | | A
R_1, R_2, R_3 | upor posameznega upornika | | Ω
I_k | tok skozi k-to vejo | I_k = \dfrac{U}{R_k} | A
R_k | upor k-te veje | | Ω
P_k | moč k-te naprave | P_k = U I_k | W
R_{23} | nadomestni upor vzporedno vezanih R₂ in R₃ | R_{23} = \dfrac{R_2 R_3}{R_2 + R_3} | Ω
U_{23} | napetost na vzporednem delu | | V
P_1 | moč na uporniku R₁ | | W
A | opravljeno delo (porabljena energija) | A = P \cdot t | J | $1\,\text{J} = 1\,\text{W}\cdot\text{s}$
t | čas | | s
:::

<<RACUN
vrednost: 12/24 | 0.5
vrednost: 12/3 | 4
vrednost: 12/4.5 | 2.67
vrednost: 24*3/27 | 2.67
vrednost: 12*4 | 48
vrednost: 12/60 | 0.2
vrednost: 0.2*40 | 8
vrednost: 2000/230 | 8.70
vrednost: 1000/230 | 4.35
vrednost: 3000/230 | 13.04
vrednost: 230^2/3000 | 17.6
vrednost: 230^2/2000 | 26.45
vrednost: 30*60/90 | 20
vrednost: 16/30 | 0.53
vrednost: 16/60 | 0.27
vrednost: 0.8^2*10 | 6.4
vrednost: 5*3*3600 | 54000
vrednost: 2-0.5-0.7 | 0.8
vrednost: 1/(3/10) | 3.33
vrednost: 20*10/30 | 6.67
vrednost: 18/9 | 2
vrednost: 60/5 | 12
vrednost: 230*10 | 2300
vrednost: 9*2*1.5*3600 | 97200
vrednost: 12*20/60 | 4
vrednost: 10/3 | 3.33
vrednost: 12*15 | 180
vrednost: 54+3*48 | 198
vrednost: 6*12/18 | 4
vrednost: 12/8 | 1.5
vrednost: 1.5*4/12 | 0.5
vrednost: 12/22 | 0.55
>>
