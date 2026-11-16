---
stanje: osnutek
demo: ohm
avtor: AI
---

## Zakaj se tega učimo

Že veš, da v sklenjenem električnem krogu teče **električni tok** $I$ (merimo ga v amperih, A, z ampermetrom) in da ga poganja **napetost** $U$ vira (v voltih, V, merimo jo z voltmetrom). Opazil si tudi, da ena žarnica, priključena na baterijo, sveti močneje kot dve zaporedno vezani žarnici na isti bateriji.

Zakaj? Ker vsak porabnik toku **nasprotuje**. Tej lastnosti rečemo **upor**. Ohmov zakon pove, kako so napetost, tok in upor povezani. Z njim izračunaš, kolikšen tok bo tekel skozi žarnico, grelec ali polnilnik, in izbereš pravo varovalko.

## Razlaga

**1. Poskus.** Na upornik priključimo vir, katerega napetost lahko spreminjamo. Ampermeter vežemo zaporedno, voltmeter vzporedno z upornikom. Merimo:

| $U$ [V] | 0 | 2 | 4 | 6 | 8 |
|---|---|---|---|---|---|
| $I$ [A] | 0 | 0,1 | 0,2 | 0,3 | 0,4 |

Ko napetost podvojimo, se podvoji tudi tok. **Tok je premo sorazmeren z napetostjo.** Graf $I(U)$ je premica skozi izhodišče.

:::premisli
Kolikšen tok bi pokazal ampermeter pri napetosti $10\,\text{V}$? Napovej, preden pogledaš.
---
$0{,}5\,\text{A}$. Vsaka $2\,\text{V}$ prineseta $0{,}1\,\text{A}$, torej $10\,\text{V}$ prinese petkrat toliko kot $2\,\text{V}$.
:::

**2. Upor.** Količnik $\dfrac{U}{I}$ je pri tem uporniku vedno enak: $\dfrac{2\,\text{V}}{0{,}1\,\text{A}} = 20\,\dfrac{\text{V}}{\text{A}}$. Ta stalni količnik imenujemo **električni upor**:

$$R = \frac{U}{I}$$

Enota je **ohm** ($\Omega$): $1\,\Omega = \dfrac{1\,\text{V}}{1\,\text{A}}$. Upornik ima upor $1\,\Omega$, če pri napetosti $1\,\text{V}$ skozenj teče tok $1\,\text{A}$.

**3. Ohmov zakon.** Tok skozi upornik je premo sorazmeren z napetostjo in obratno sorazmeren z uporom:

$$I = \frac{U}{R} \qquad U = R \cdot I \qquad R = \frac{U}{I}$$

To so tri oblike istega zakona. Izbereš tisto, v kateri je neznanka sama na levi.

**4. Večji upor, manjši tok.** Pri isti napetosti skozi večji upor teče manjši tok. Na grafu $I(U)$ je premica za večji upor bolj položna.

V simulaciji spodaj nastavi napetost na $6\,\text{V}$ in upor najprej na $10\,\Omega$, nato na $20\,\Omega$. Opazuj, kako hitro tečejo elektroni in kako se nagne premica na grafu.

:::premisli
Imaš dva upornika, $10\,\Omega$ in $40\,\Omega$, na isti napetosti. Skozi katerega teče večji tok in kolikokrat večji?
---
Skozi $10\,\Omega$, in sicer štirikrat večji: upor je štirikrat manjši, $I = \dfrac{U}{R}$ pa je obratno sorazmeren z uporom.
:::

**5. Od česa je odvisen upor žice.** Daljša žica ima večji upor, debelejša manjšega. Odvisen je tudi od snovi (baker ima majhen upor, zato iz njega delamo kable) in od temperature. Pri žarnici se nitka segreje, zato njen upor med delovanjem naraste in Ohmov zakon zanjo velja le približno.

## Rešeni primeri

### Primer 1: tok

Na upornik z uporom $30\,\Omega$ priključimo baterijo z napetostjo $4{,}5\,\text{V}$. Kolikšen tok teče?

**Podatki:** $R = 30\,\Omega$, $U = 4{,}5\,\text{V}$
**Iščemo:** tok $I$

:::formula
Ohmov zakon v obliki z $I$ na levi: $I = \dfrac{U}{R}$
:::

**Rešitev:**

1. Vstavimo podatke: $I = \dfrac{4{,}5\,\text{V}}{30\,\Omega} = 0{,}15\,\text{A}$.
2. Odgovor: teče tok $0{,}15\,\text{A}$ ($150\,\text{mA}$).

### Primer 2: napetost

Skozi grelec z uporom $46\,\Omega$ teče tok $5\,\text{A}$. Kolikšna je napetost na grelcu?

**Podatki:** $R = 46\,\Omega$, $I = 5\,\text{A}$
**Iščemo:** napetost $U$

:::formula
$U = R \cdot I$
:::

**Rešitev:**

1. $U = 46\,\Omega \cdot 5\,\text{A} = 230\,\text{V}$.
2. Odgovor: napetost je $230\,\text{V}$, kar je napetost v hišnem omrežju.

### Primer 3: upor iz meritve, s pretvorbo enot

Voltmeter na žarnici kaže $6\,\text{V}$, ampermeter $250\,\text{mA}$. Kolikšen je upor žarnice? Kolikšen tok bi tekel, če bi napetost znižali na $3\,\text{V}$ in bi upor ostal enak?

**Podatki:** $U_1 = 6\,\text{V}$, $I_1 = 250\,\text{mA}$, $U_2 = 3\,\text{V}$, upor $R$ ostane enak
**Iščemo:** upor $R$ in tok $I_2$ pri nižji napetosti

:::formula
$R = \dfrac{U_1}{I_1}$, nato $I_2 = \dfrac{U_2}{R}$
:::

**Rešitev:**

1. Pretvorimo enote: $250\,\text{mA} = 0{,}25\,\text{A}$ (delimo s $1000$).
2. $R = \dfrac{U_1}{I_1} = \dfrac{6\,\text{V}}{0{,}25\,\text{A}} = 24\,\Omega$.
3. Pri $3\,\text{V}$: $I_2 = \dfrac{3\,\text{V}}{24\,\Omega} = 0{,}125\,\text{A}$.
4. Napetost smo prepolovili, tok se je prepolovil, kar se ujema s premim sorazmerjem.
5. Odgovor: upor žarnice je $24\,\Omega$; pri $3\,\text{V}$ skoznjo teče tok $0{,}125\,\text{A}$ ($125\,\text{mA}$).

### Primer 4: zdaj ti

Polnilnik telefona ima na izhodu napetost $5\,\text{V}$, skozi kabel in telefon teče tok $1{,}2\,\text{A}$. Kolikšen je skupni upor kabla in telefona? Rezultat zaokroži na eno decimalko.

**Podatki:** $U = 5\,\text{V}$, $I = 1{,}2\,\text{A}$
**Iščemo:** upor $R$

:::formula
$R = \dfrac{U}{I}$
:::

**Rešitev:**

1. Neznanka je upor, zato vzamemo obliko $R = \dfrac{U}{I}$.
2. Enote so že osnovne (V in A), pretvarjati ni treba.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko je $R = \dfrac{5\,\text{V}}{1{,}2\,\text{A}}$?
---
$R \approx 4{,}2\,\Omega$ (natančneje $4{,}166\ldots\,\Omega$, zaokroženo na eno decimalko $4{,}2\,\Omega$).
:::

## Pogoste napake

- **Miliampere v formulo.** Če vstaviš $250$ namesto $0{,}25\,\text{A}$, dobiš upor, ki je $1000$-krat premajhen. Vedno najprej pretvori v A, V in $\Omega$.
- **Napačna oblika zakona.** $I = R \cdot U$ ne velja. Pomagaj si s trikotnikom: $U$ zgoraj, $R$ in $I$ spodaj. Pokrij neznanko in preberi, kaj ostane.
- **»Tok se porabi.«** Tok skozi upornik ni manjši na izhodu kot na vhodu. V zaporednem krogu je tok povsod enak. Upornik zmanjša tok v *celotnem* krogu.
- **Upor je odvisen od napetosti.** Pri navadnem uporniku ne: če povečaš napetost, se poveča tok, upor ostane enak.

## Povzetek

- Upor $R$ pove, kako močno porabnik nasprotuje toku. Enota: ohm, $\Omega$.
- Ohmov zakon: $I = \dfrac{U}{R}$, oziroma $U = R \cdot I$ in $R = \dfrac{U}{I}$.
- Pri stalnem uporu je tok premo sorazmeren z napetostjo; graf $I(U)$ je premica skozi izhodišče.
- Pri isti napetosti večji upor pomeni manjši tok.
- Pred računanjem pretvori $\mathrm{mA}$ v $\mathrm{A}$, $\mathrm{kV}$ v $\mathrm{V}$, $\mathrm{k\Omega}$ v $\Omega$.

## Drugače: Iz vsakdanjega življenja (voda v ceveh)

Električni krog si predstavljaj kot vodovod:

- **Napetost** je kot višinska razlika ali črpalka, ki potiska vodo. Večja kot je, močneje potiska.
- **Tok** je kot količina vode, ki v sekundi steče skozi cev.
- **Upor** je kot zožitev v cevi ali pesek v njej. Bolj kot je cev ozka, manj vode steče.

Če črpalka potiska dvakrat močneje, steče dvakrat več vode. Če cev zožiš, steče manj vode, čeprav črpalka dela enako. Natanko to pove $I = \dfrac{U}{R}$.

Primerjava ima meje: v žici se elektroni ne »porabijo« in ne »iztečejo«, ampak krožijo.

## Drugače: Na sliki

V poskusu zgoraj so pikice elektroni. Opazuj:

- Ko povečaš napetost, pikice tečejo hitreje in upornik se bolj segreva (močneje žari). Na grafu desno se točka pomakne gor po premici.
- Ko povečaš upor, se pikice upočasnijo, premica na grafu postane bolj položna.

Graf $I(U)$ je »prstni odtis« upornika: strmejša premica pomeni manjši upor.

## Drugače: Korak za korakom s številkami

Trikotnik za Ohmov zakon:

:::risba skica
opis: Trikotnik za Ohmov zakon. Vodoravna črta ga deli na dva dela: zgoraj je U, spodaj R · I.
območje: 0; 0 .. 6; 4
enota: 40
lik: 0,5; 0,3 -> 5,5; 0,3 -> 3; 3,8 | modra
črta: 1,5; 1,7 -> 4,5; 1,7 | modra
napis: 3; 2,5 | U | sredina | debelo
napis: 3; 1 | R · I | sredina | debelo
:::

1. Izpiši podatke z enotami.
2. Pretvori v osnovne enote (A, V, Ω).
3. Na trikotniku pokrij neznanko:
   - pokrijem $I$: ostane $\dfrac{U}{R}$,
   - pokrijem $U$: ostane $R \cdot I$,
   - pokrijem $R$: ostane $\dfrac{U}{I}$.
4. Vstavi števila z enotami in izračunaj.
5. Preveri smiselnost: običajni uporniki v šoli imajo od nekaj do nekaj sto ohmov, tokovi pa so od nekaj miliamperov do nekaj amperov.

## Drugače: Bolj natančno

Ohmov zakon ni naravni zakon kot zakon o ohranitvi energije, ampak **lastnost nekaterih snovi**. Za kovinske upornike pri stalni temperaturi je razmerje $U/I$ stalno; takim porabnikom rečemo *ohmski*.

Za žarnico z nitko to ne velja natančno: ko tok raste, se nitka segreje in njen upor naraste, zato graf $I(U)$ ni premica, ampak se ukrivi navzdol. Za diodo velja še manj: v eno smer skoraj ne prepušča toka, v drugo zelo dobro.

Upor žice: $R = \zeta \dfrac{l}{S}$, kjer je $l$ dolžina, $S$ presek in $\zeta$ specifični upor snovi. To boš podrobneje spoznal v srednji šoli.

## Preveri se

? Napetost $12\,\text{V}$, upor $40\,\Omega$. Kolikšen je tok?
- $480\,\text{A}$
~ To je $U \cdot R$. Tok dobiš z deljenjem: $I = \dfrac{U}{R}$.
+ $0{,}3\,\text{A}$
- $3{,}3\,\text{A}$
~ To je $\dfrac{R}{U}$, deljenje v obratni smeri. Napetost je zgoraj: $I = \dfrac{U}{R}$.
> $I = \dfrac{U}{R} = \dfrac{12\,\text{V}}{40\,\Omega} = 0{,}3\,\text{A}$.

? Napetost na uporniku podvojimo, upor ostane enak. Kaj se zgodi s tokom?
- Ostane enak.
~ Enak ostane upor, ne tok. Pri večji napetosti vir močneje poganja elektrone.
- Se razpolovi.
~ Tok se razpolovi, če podvojimo upor. Tu se je spremenila napetost.
+ Se podvoji.
> Pri stalnem uporu je tok premo sorazmeren z napetostjo.

? Skozi upornik teče $20\,\text{mA}$ pri napetosti $5\,\text{V}$. Kolikšen je njegov upor?
- $0{,}25\,\Omega$
~ Tako dobiš, če mA vstaviš kot amper ($20$ namesto $0{,}02$). Najprej pretvori v A.
- $100\,\Omega$
~ To je $5 \cdot 20$. Upor je količnik $\dfrac{U}{I}$, ne produkt.
+ $250\,\Omega$
> $20\,\text{mA} = 0{,}02\,\text{A}$, $R = \dfrac{5\,\text{V}}{0{,}02\,\text{A}} = 250\,\Omega$. Odgovor $0{,}25\,\Omega$ dobiš, če pozabiš pretvoriti mA v A.

? Kaj meri enota ohm ($\Omega$)?
- Kako hitro tečejo elektroni.
~ Hitrost elektronov ni enota upora. Ohm pove razmerje med napetostjo in tokom.
+ Kolikšna napetost je potrebna za tok $1\,\text{A}$ skozi porabnik.
- Koliko elektrine shrani porabnik.
~ Shranjeno elektrino merimo v coulombih (pri kondenzatorjih), ne v ohmih.
> $1\,\Omega = \dfrac{1\,\text{V}}{1\,\text{A}}$: upor $R$ pove, koliko voltov potrebuješ za vsak amper toka.

? Dve žarnici vežemo zaporedno na isto baterijo kot prej eno. Zakaj svetita šibkeje?
- Ker prva žarnica porabi tok in ga za drugo ostane manj.
~ Tok se ne porabi: v zaporednem krogu je povsod enak. Manjši je v celem krogu.
+ Ker je skupni upor večji, zato je pri isti napetosti tok v celem krogu manjši.
- Ker se napetost baterije zmanjša na polovico.
~ Napetost baterije ostane enaka. Razdeli se med žarnici, tok pa se zmanjša zaradi večjega skupnega upora.
> Večji skupni upor pri isti napetosti pomeni manjši tok ($I = \dfrac{U}{R}$), zato obe žarnici svetita šibkeje.

:::simboli
R | električni upor | R = \dfrac{U}{I} | Ω
U | električna napetost | U = R \cdot I | V
I | električni tok | I = \dfrac{U}{R} | A
U_1 | napetost pri prvi meritvi | | V
I_1 | tok pri prvi meritvi | | A
U_2 | nižja napetost (druga meritev) | | V
I_2 | tok pri nižji napetosti | I_2 = \dfrac{U_2}{R} | A
:::
