---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tilen ima na mizi razdelilec, v katerem so že polnilnik za telefon, polnilnik za slušalke in prenosnik. Ko vtakne še polnilnik za tablico, sošolki samozavestno razloži: »Brez skrbi. Vsak nov porabnik doda svoj upor, skupni upor se poveča, zato skozi razdelilec teče manj toka. Bolj ko ga napolnim, bolj je varen.«

Zveni logično, saj vsak polnilnik res ima svoj upor. Pa ima Tilen prav? Do konca lekcije boš to znal presoditi sam, z računom. Zakaj ena pokvarjena žarnica na stari novoletni lučki ugasne celoten niz, v stanovanju pa ugasne samo ena svetilka? Kako izračunamo, koliko toka teče po posamezni veji? Koliko energije porabi grelnik na sekundo? Na ta vprašanja odgovorimo s **Kirchhoffovima zakonoma**, z znanjem o **zaporedni in vzporedni vezavi** ter z računom **električne moči**.

V interaktivni simulaciji spodaj lahko vezja tudi sam sestaviš in preveriš meritve z ampermetrom in voltmetrom.

## Razlaga

**1. Osnovni pojmi.**

- **Vozlišče** je točka, kjer se stikajo vsaj trije vodniki.
- **Veja** je del vezja med dvema vozliščema.
- **Zanka** je poljubna sklenjena pot po vejah vezja.

**2. Prvi Kirchhoffov zakon (zakon o vozliščih).** Naboj se v vozlišču ne nabira in ne izgineva, zato je vsota tokov, ki vtekajo v vozlišče, enaka vsoti tokov, ki iz njega iztekajo:

$$\sum I_{\text{vtekajoči}} = \sum I_{\text{iztekajoči}}$$

*Hitro preverjanje:* v vozlišče priteče $3\,\text{A}$, po eni veji odteče $1{,}2\,\text{A}$. Koliko po drugi? (Odgovor: $1{,}8\,\text{A}$.)

**3. Drugi Kirchhoffov zakon (zakon o zankah).** Ko pri obhodu zanke pridemo nazaj v začetno točko, je vsota napetosti na virih enaka vsoti padcev napetosti na porabnikih:

$$U_{\text{vira}} = U_1 + U_2 + \dots$$

To je zakon o ohranitvi energije: vsak naboj dobi na viru toliko energije, kot jo odda na porabnikih.

**4. Zaporedna vezava.** Uporniki so vezani drug za drugim, med njimi ni vozlišča.

- Tok je povsod enak: $I = I_1 = I_2$.
- Napetosti se seštevajo: $U = U_1 + U_2$.
- Skupni upor: $R = R_1 + R_2 + \dots$

Če en element odpove (prekine vezje), tok ne teče nikjer.

*Hitro preverjanje:* $10\,\Omega$ in $15\,\Omega$ zaporedno? (Odgovor: $25\,\Omega$.)

:::premisli
Zakaj ima pri zaporedni vezavi večji upornik večjo napetost?
---
Skozi oba teče isti tok, napetost na vsakem pa je $U_k = I \cdot R_k$. Pri enakem toku je napetost sorazmerna z uporom: upornik z dvakrat večjim uporom dobi dvakrat večji del napetosti vira.
:::

**5. Vzporedna vezava.** Uporniki so vezani na isti dve vozlišči.

- Napetost je na vseh vejah enaka: $U = U_1 = U_2$.
- Tokovi se seštevajo: $I = I_1 + I_2$.
- Skupni upor: $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2} + \dots$

Skupni upor je manjši od najmanjšega posameznega upora. Če ena veja odpove, druge delujejo naprej.

Za dva upora velja tudi $R = \dfrac{R_1 \cdot R_2}{R_1 + R_2}$.

*Hitro preverjanje:* dva upornika po $10\,\Omega$ vzporedno? (Odgovor: $5\,\Omega$, dve enaki poti prepustita dvakrat več toka.)

:::premisli
Tilen v razdelilec (ta je priključen na $230\,\text{V}$) vtakne še en polnilnik. Kaj se zgodi s skupnim uporom in s skupnim tokom?
---
Polnilniki so vezani vzporedno. Vsak nov polnilnik je nova pot za tok, zato se skupni upor *zmanjša*, skupni tok pa *poveča*: tokovi vseh polnilnikov se seštejejo. Tilen nima prav; preveč porabnikov lahko preobremeni razdelilec.
:::

Primerjava obeh vezav na enem mestu:

| Količina | Zaporedno | Vzporedno |
|---|---|---|
| tok | povsod enak | se razdeli, $I = I_1 + I_2$ |
| napetost | se razdeli, $U = U_1 + U_2$ | povsod enaka |
| skupni upor | večji od vsakega | manjši od vsakega |
| odpove en element | ugasne vse | drugi delujejo |

V simulaciji spodaj (»Zaporedna in vzporedna vezava upornikov«) nastavi dva enaka upornika (npr. oba po $20\,\Omega$) najprej zaporedno, nato vzporedno na isti vir. Opazuj ampermeter pri viru: pri vzporedni vezavi pokaže štirikrat večji tok kot pri zaporedni.

**6. Električna moč.** Moč pove, koliko električnega dela se opravi (energije pretvori) v eni sekundi:

$$P = U \cdot I$$

Z Ohmovim zakonom dobimo še obliki

$$P = I^2 R \qquad P = \frac{U^2}{R}$$

Enota je vat: $1\,\text{W} = 1\,\text{V} \cdot 1\,\text{A}$. Opravljeno delo (porabljena energija) je $A = P \cdot t$.

*Hitro preverjanje:* polnilnik daje $5\,\text{V}$ in $2\,\text{A}$. Kolikšna je moč? (Odgovor: $10\,\text{W}$.)

**7. Načrt reševanja nalog.** Najprej izračunaj nadomestni upor, nato skupni tok iz Ohmovega zakona, nato pa po korakih napetosti in tokove na posameznih delih.

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
5. Odgovor: tok je $0{,}2\,\text{A}$, napetosti na upornikih sta $4\,\text{V}$ in $8\,\text{V}$. Večji upornik ima večji padec napetosti.

### Primer 2: vzporedna vezava in moč

Upornika $R_1 = 30\,\Omega$ in $R_2 = 60\,\Omega$ sta vzporedno vezana na vir z napetostjo $12\,\text{V}$. Izračunaj tokova po vejah, skupni tok, nadomestni upor in skupno moč.

**Podatki:** $R_1 = 30\,\Omega$, $R_2 = 60\,\Omega$ (vzporedna vezava), $U = 12\,\text{V}$
**Iščemo:** tokova $I_1$ in $I_2$, skupni tok $I$, nadomestni upor $R$, skupno moč $P$

:::formula
Vzporedna vezava: $U = U_1 = U_2$, $I_k = \dfrac{U}{R_k}$, $I = I_1 + I_2$, $R = \dfrac{U}{I}$, $P = U I$
:::

**Rešitev:**

1. Pri vzporedni vezavi je na obeh upornikih celotna napetost $12\,\text{V}$.
2. Tokova: $I_1 = \dfrac{12}{30} = 0{,}4\,\text{A}$ in $I_2 = \dfrac{12}{60} = 0{,}2\,\text{A}$.
3. Po prvem Kirchhoffovem zakonu se tokova v vozlišču seštejeta: $I = 0{,}4 + 0{,}2 = 0{,}6\,\text{A}$.
4. Nadomestni upor: $R = \dfrac{U}{I} = \dfrac{12}{0{,}6} = 20\,\Omega$. Preverimo s formulo: $\dfrac{30 \cdot 60}{30 + 60} = \dfrac{1800}{90} = 20\,\Omega$. ✓ Manjši je od $30\,\Omega$, kot mora biti.
5. Moči: $P_1 = U I_1 = 12 \cdot 0{,}4 = 4{,}8\,\text{W}$, $P_2 = 12 \cdot 0{,}2 = 2{,}4\,\text{W}$. Skupna moč: $P = 7{,}2\,\text{W}$. Preverimo: $U I = 12 \cdot 0{,}6 = 7{,}2\,\text{W}$. ✓
6. Odgovor: $I_1 = 0{,}4\,\text{A}$, $I_2 = 0{,}2\,\text{A}$, $I = 0{,}6\,\text{A}$, $R = 20\,\Omega$, $P = 7{,}2\,\text{W}$.

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

### Primer 4 – zdaj ti

Na polnilno postajo z izhodom $5\,\text{V}$ sta vzporedno priključena dva telefona. Prvi jemlje tok $2\,\text{A}$, drugi $1\,\text{A}$. Koliko energije da postaja v eni uri polnjenja?

**Podatki:** $U = 5\,\text{V}$ (vzporedna vezava), $I_1 = 2\,\text{A}$, $I_2 = 1\,\text{A}$, $t = 1\,\text{h} = 3600\,\text{s}$
**Iščemo:** energijo (delo) $A$

:::formula
$I = I_1 + I_2$, $P = U \cdot I$, $A = P \cdot t$
:::

**Rešitev:**

1. Telefona sta vezana vzporedno, zato imata oba napetost $5\,\text{V}$.
2. Skupni tok po prvem Kirchhoffovem zakonu: $I = 2\,\text{A} + 1\,\text{A} = 3\,\text{A}$. Zakaj: tokova obeh vej se v vozlišču postaje združita.
3. Zdaj ti: izračunaj skupno moč in nato energijo v eni uri.

:::premisli
Kolikšna je energija?
---
$P = U \cdot I = 5\,\text{V} \cdot 3\,\text{A} = 15\,\text{W}$, nato $A = P \cdot t = 15\,\text{W} \cdot 3600\,\text{s} = 54\,000\,\text{J}$. Postaja v eni uri da $54\,000\,\text{J}$ energije.
:::

## Pogoste napake

- **»Več porabnikov, večji upor.«** Tilnova misel: vsak porabnik doda upor, zato se upori seštejejo. To velja le zaporedno. Vzporedno vsak porabnik doda novo pot, zato je skupni upor manjši od najmanjšega. Preveri: če pri vzporedni vezavi dobiš rezultat, večji od najmanjšega upora, si se zmotil.
- **Pozabljeno obračanje.** »$\dfrac{1}{20} + \dfrac{1}{30} = \dfrac{5}{60}$, torej $R = \dfrac{5}{60}\,\Omega$.« Izračunal si $\dfrac{1}{R}$, ne $R$. Na koncu ulomek obrni: $R = \dfrac{60}{5} = 12\,\Omega$.
- **Enak tok pri vzporedni vezavi.** »Obe veji sta na istem viru, torej teče skozi obe enak tok.« Enaka je *napetost*; tok je po Ohmovem zakonu $\dfrac{U}{R_k}$, zato teče več po veji z manjšim uporom. Enak tok velja pri zaporedni vezavi, kjer se razdeli napetost.
- **Napačna formula za moč.** »$P = \dfrac{U}{I}$« ali »moč je kar tok«. $\dfrac{U}{I}$ je upor, ne moč, tok pa je v amperih, ne v vatih. Moč je $P = U \cdot I$; z uporom $P = I^2 R$ ali $P = \dfrac{U^2}{R}$ (pazi na kvadrat).
- **Mešanje moči in energije.** »Grelnik $2000\,\text{W}$ v eni uri porabi $2000\,\text{J}$.« Vat pove energijo *na sekundo*; porabljena energija je $A = P \cdot t$ v džulih ($1\,\text{J} = 1\,\text{W}\cdot\text{s}$).

## Povzetek

- Prvi Kirchhoffov zakon: vsota vtekajočih tokov v vozlišče je enaka vsoti iztekajočih.
- Drugi Kirchhoffov zakon: v sklenjeni zanki je napetost vira enaka vsoti padcev napetosti.
- Zaporedno: enak tok, $U = U_1 + U_2$, $R = R_1 + R_2$.
- Vzporedno: enaka napetost, $I = I_1 + I_2$, $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}$.
- Moč: $P = UI = I^2 R = \dfrac{U^2}{R}$, delo $A = Pt$.
- Mešana vezava: najprej poenostavi na nadomestni upor, nato računaj nazaj proti posameznim delom.

## Drugače: Na sliki

:::risba skica
opis: Dve vezji z isto baterijo U in dvema upornikoma. Levo zaporedna vezava: R₁ in R₂ sta drug za drugim na isti žici, tok ima eno samo pot. Desno vzporedna vezava: R₁ in R₂ sta v dveh vejah med vozliščema A in B, tok se v A razdeli in v B spet združi.
območje: 0; -1,5 .. 22; 10
črta: 1; 2 -> 1; 8 -> 10; 8 -> 10; 2 -> 6; 2
črta: 5; 2 -> 1; 2
pravokotnik: 2,5; 7,4 .. 4,5; 8,6 | ozadje
pravokotnik: 6,5; 7,4 .. 8,5; 8,6 | ozadje
napis: 3,5; 8,6 | R_1 | nad
napis: 7,5; 8,6 | R_2 | nad
črta: 5; 1,2 -> 5; 2,8 | debelo
črta: 6; 1,6 -> 6; 2,4 | debelo
napis: 5,5; 3 | U | nad
napis: 5,5; -0,8 | zaporedno
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
napis: 16; 3 | U | nad
napis: 16,5; -0,8 | vzporedno
:::

Na levi ima naboj eno samo pot skozi oba upornika. Na desni se pot v vozlišču A razcepi in v B spet združi.

Predstavljaj si tok kot vodo v ceveh.

**Zaporedna vezava** je ena sama cev z več zožitvami zaporedoma. Skozi vsako zožitev teče enaka količina vode na sekundo (enak tok), tlak (napetost) pa se pri vsaki zožitvi zmanjša. Več zožitev pomeni večji skupni upor.

**Vzporedna vezava** je cev, ki se razcepi na dve poti in se spet združi. Pretok se razdeli (tokovi se seštevajo), tlačna razlika med razcepom in sotočjem je za obe poti enaka (enaka napetost). Več poti pomeni lažji pretok, zato je skupni upor manjši.

**Prvi Kirchhoffov zakon:** v razcepu ne izgine in ne nastane voda, kolikor je priteče, toliko je odteče.

V interaktivni simulaciji spodaj (»Zaporedna in vzporedna vezava upornikov«) lahko sestaviš vezje in z ampermetrom ter voltmetrom preveriš, da se vsota tokov v vozlišču ujema.

## Drugače: Iz vsakdanjega življenja

**Novoletne lučke.** Starejši nizi imajo žarnice vezane zaporedno. Ko ena pregori, se tokokrog prekine in ugasnejo vse. Vsaka žarnica dobi le del napetosti vira.

**Električna napeljava v stanovanju.** Porabniki so vezani vzporedno, vsak je priključen na isto napetost vtičnice ($230\,\text{V}$). Zato lahko ugasneš eno svetilko, druge pa svetijo naprej. Hkrati pa velja: več naprav vklopiš, večji je skupni tok, ker se tokovi seštevajo. Zato varovalka prekine tokokrog, če priključiš preveč močnih porabnikov.

**Moč grelnika.** Grelnik z močjo $2000\,\text{W}$ na $230\,\text{V}$ vleče tok $I = \dfrac{2000}{230} \approx 8{,}7\,\text{A}$. Če deluje eno uro ($3600\,\text{s}$), porabi $2000 \cdot 3600 = 7\,200\,000\,\text{J}$, kar je $2\,\text{kWh}$ (tisto, kar vidiš na računu za elektriko).

## Drugače: Korak za korakom s številkami

Primer: vir $9\,\text{V}$, zaporedno upornika $R_1 = 100\,\Omega$ in $R_2 = 200\,\Omega$ ter vzporedno temu paru upornik $R_3 = 300\,\Omega$ (obe veji sta priključeni na isti vir).

| Korak | Izračun | Rezultat |
|---|---|---|
| Zaporedna veja | $100 + 200$ | $300\,\Omega$ |
| Tok po tej veji | $9 / 300$ | $0{,}03\,\text{A}$ |
| Tok po $R_3$ | $9 / 300$ | $0{,}03\,\text{A}$ |
| Skupni tok | $0{,}03 + 0{,}03$ | $0{,}06\,\text{A}$ |
| Nadomestni upor | $9 / 0{,}06$ | $150\,\Omega$ |
| Skupna moč | $9 \cdot 0{,}06$ | $0{,}54\,\text{W}$ |

Preverjanje nadomestnega upora: dve enaki veji po $300\,\Omega$ vzporedno dasta polovico, $150\,\Omega$. ✓

Napetosti v zaporedni veji: $U_1 = 0{,}03 \cdot 100 = 3\,\text{V}$, $U_2 = 0{,}03 \cdot 200 = 6\,\text{V}$, skupaj $9\,\text{V}$. ✓

## Drugače: Bolj natančno

**Izpeljava nadomestnega upora pri zaporedni vezavi.** Po drugem Kirchhoffovem zakonu je $U = U_1 + U_2 = I R_1 + I R_2 = I (R_1 + R_2)$. Ker je $U = I R$, sledi $R = R_1 + R_2$.

**Izpeljava pri vzporedni vezavi.** Po prvem Kirchhoffovem zakonu je $I = I_1 + I_2 = \dfrac{U}{R_1} + \dfrac{U}{R_2} = U\left(\dfrac{1}{R_1} + \dfrac{1}{R_2}\right)$. Ker je $I = \dfrac{U}{R}$, sledi $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2}$.

**Izvor moči.** Električna napetost je delo na enoto naboja: $U = \dfrac{A}{e}$ (tukaj $e$ označuje naboj, ki preteče). Tok je $I = \dfrac{e}{t}$. Moč je delo na čas: $P = \dfrac{A}{t} = \dfrac{U e}{t} = U I$.

**Ohranitev energije.** Moč, ki jo da vir, je vsota moči na vseh porabnikih. Pri zaporedni vezavi: $UI = U_1 I + U_2 I$, kar je ravno drugi Kirchhoffov zakon, pomnožen s tokom.

## Preveri se

? Katera trditev o vzporedni vezavi upornikov je pravilna?
- Skozi vse upornike teče enak tok.
~ Enak tok velja za zaporedno vezavo. Vzporedno se tok razdeli, več ga teče po veji z manjšim uporom.
+ Na vseh upornikih je enaka napetost.
- Skupni upor je vsota posameznih uporov.
~ Seštevanje uporov velja za zaporedno vezavo. Vzporedno je skupni upor manjši od najmanjšega.
- Če en upornik pregori, ugasne celotno vezje.
~ To se zgodi pri zaporedni vezavi z eno samo potjo. Vzporedno ostale veje delujejo naprej.
> Vsi uporniki so priključeni na isti dve vozlišči, zato je med njihovima koncema ista napetost.

? Upornika $15\,\Omega$ in $45\,\Omega$ sta zaporedno vezana na $12\,\text{V}$. Kolikšen je tok?
- $0{,}8\,\text{A}$
~ Upošteval si samo $15\,\Omega$. Zaporedno tok teče skozi oba, zato je upor $60\,\Omega$.
+ $0{,}2\,\text{A}$
- $5\,\text{A}$
~ Delil si upor z napetostjo ($60/12$). Tok je $\dfrac{U}{R}$, ne $\dfrac{R}{U}$.
- $1{,}07\,\text{A}$
~ Upornika si vezal vzporedno ($R \approx 11{,}25\,\Omega$). V nalogi sta vezana zaporedno, zato se upora seštejeta.
> Zaporedno se upori seštevajo: $R = 15 + 45 = 60\,\Omega$, torej $I = 12 / 60 = 0{,}2\,\text{A}$.

? Ana računa nadomestni upor upornikov $20\,\Omega$ in $30\,\Omega$ v vzporedni vezavi: $\dfrac{1}{R} = \dfrac{1}{20} + \dfrac{1}{30} = \dfrac{5}{60}$, torej $R = \dfrac{5}{60}\,\Omega \approx 0{,}083\,\Omega$. Kje je napaka?
- Recipročne vrednosti se ne seštevajo, prav bi bilo $R = 20 + 30 = 50\,\Omega$.
~ Vsota uporov velja za zaporedno vezavo. Vzporedno se res seštevajo recipročne vrednosti.
- $\dfrac{1}{20} + \dfrac{1}{30}$ ni $\dfrac{5}{60}$.
~ Seštevanje je pravilno: $\dfrac{3}{60} + \dfrac{2}{60} = \dfrac{5}{60}$.
+ Na koncu ni obrnila ulomka; pravilno je $R = \dfrac{60}{5} = 12\,\Omega$.
- Napake ni.
~ Rezultat $0{,}083\,\Omega$ je absurdno majhen; vzporedni upor je sicer manjši od $20\,\Omega$, a ne tako zelo.
> $\dfrac{5}{60}$ je vrednost $\dfrac{1}{R}$, ne $R$. Po obratu je $R = 12\,\Omega$, kar je manj od $20\,\Omega$, kot mora biti.

? Dve enaki žarnici priključimo na isto baterijo, enkrat zaporedno, drugič vzporedno. Kako se primerjata skupni moči?
- Moči sta enaki, saj gre za isti žarnici.
~ Žarnici sta isti, a skupni upor ni: zaporedno je $2R$, vzporedno $\dfrac{R}{2}$.
- Zaporedna vezava ima večjo moč, ker ima večji upor.
~ Pri stalni napetosti večji upor pomeni manjši tok in manjšo moč, $P = \dfrac{U^2}{R}$.
- Vzporedna vezava ima dvakrat večjo moč.
~ Upor se ne spremeni le dvakrat: iz $2R$ pade na $\dfrac{R}{2}$, torej štirikrat.
+ Vzporedna vezava ima štirikrat večjo moč.
> $P = \dfrac{U^2}{R}$: zaporedno $\dfrac{U^2}{2R}$, vzporedno $\dfrac{2U^2}{R}$. Razmerje je $4$, zato vzporedni žarnici svetita močneje.

? Tablica se polni z napetostjo $9\,\text{V}$ pri moči $18\,\text{W}$. Kolikšen tok teče po kablu?
- $162\,\text{A}$
~ Moč in napetost si pomnožil. Iz $P = U \cdot I$ tok dobiš z deljenjem, $I = \dfrac{P}{U}$.
- $0{,}5\,\text{A}$
~ Napetost si delil z močjo. Enota $\dfrac{\text{V}}{\text{W}}$ ni amper.
+ $2\,\text{A}$
> Iz $P = U \cdot I$ sledi $I = \dfrac{P}{U} = \dfrac{18\,\text{W}}{9\,\text{V}} = 2\,\text{A}$.

:::simboli
I_{\text{vtekajoči}} | tok, ki vteka v razcepišče | | A | vsota vtekajočih je enaka vsoti iztekajočih
I_{\text{iztekajoči}} | tok, ki izteka iz razcepišča | | A
U_{\text{vira}} | napetost vira | | V | zaporedno se razdeli na porabnike
U | napetost | U = I \cdot R | V
I | (skupni) električni tok | I = \dfrac{U}{R} | A
R | (nadomestni) upor | R = R_1 + R_2 | Ω | zaporedna vezava
P | električna moč | P = U \cdot I | W | tudi P = I²R = U²/R
U_1, U_2 | napetost na posameznem uporniku | | V
I_1, I_2, I_3 | tok skozi posamezni upornik | | A
R_1, R_2, R_3 | upor posameznega upornika | | Ω
I_k | tok skozi k-to vejo | I_k = \dfrac{U}{R_k} | A
R_k | upor k-te veje | | Ω
R_{23} | nadomestni upor vzporedno vezanih R₂ in R₃ | R_{23} = \dfrac{R_2 R_3}{R_2 + R_3} | Ω
U_{23} | napetost na vzporednem delu | | V
P_1 | moč na uporniku R₁ | | W
A | opravljeno delo (porabljena energija) | A = P \cdot t | J | $1\,\text{J} = 1\,\text{W}\cdot\text{s}$
t | čas | | s
:::
