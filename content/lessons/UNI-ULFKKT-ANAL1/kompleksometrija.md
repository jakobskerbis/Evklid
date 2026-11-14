---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na vaji iz trdote vode sošolka zatrdi: »Konstanta tvorbe kompleksa kalcija z EDTA je ogromna, $10^{10{,}65}$. Pufer pri $\mathrm{pH}\ 10$ je samo tradicija, titriraš lahko pri katerem koli pH.« Zveni prepričljivo. Ob koncu lekcije boš znal izračunati, zakaj nima prav.

Deževnica je skoraj brez raztopljenih soli. Ko pronica skozi kraški teren, raztaplja apnenec ($\mathrm{CaCO_3}$) in dolomit ($\mathrm{CaMg(CO_3)_2}$). Iz izvira zato priteče voda z ioni $\mathrm{Ca^{2+}}$ in $\mathrm{Mg^{2+}}$. Iz iste vode nastajajo kapniki, v grelnikih pa vodni kamen. Koliko teh ionov je v litru, ugotovimo s **kompleksometrijo**: titracijo, pri kateri titrant s kovinskim ionom tvori kompleks.

## Razlaga

**1. Kompleks.** Kovinski ion ima prazne orbitale in sprejme elektronske pare. Molekula ali ion, ki elektronski par podari, je **ligand**. Nastane **kompleks**, na primer $\mathrm{Cu^{2+}} + 4\,\mathrm{NH_3} \rightleftharpoons \mathrm{[Cu(NH_3)_4]^{2+}}$ (temno modra raztopina). Amoniak se veže z enim samim atomom; tak ligand je **enovezen** (monodentaten).

*Preizkus:* kdo je pri $\mathrm{[Cu(NH_3)_4]^{2+}}$ donor elektronskih parov? *(Dušik v $\mathrm{NH_3}$.)*

**2. Konstanta tvorbe.** Ravnotežje $\mathrm{M} + \mathrm{L} \rightleftharpoons \mathrm{ML}$ opišemo s **konstanto tvorbe**

$$K_f = \frac{[\mathrm{ML}]}{[\mathrm{M}]\,[\mathrm{L}]}$$

V izrazu nastopajo ravnotežne koncentracije pri stalni temperaturi (v razredčenih raztopinah namesto aktivnosti); naboje izpuščamo. Večja $K_f$ pomeni, da je pri ravnotežju več kovine vezane. Ker so vrednosti ogromne, navajamo $\log K_f$. Ligandi, kot je $\mathrm{NH_3}$, se vežejo po korakih: korak $\mathrm{ML}_{i-1} + \mathrm{L} \rightleftharpoons \mathrm{ML}_i$ ima **stopenjsko konstanto** $K_i = \dfrac{[\mathrm{ML}_i]}{[\mathrm{ML}_{i-1}][\mathrm{L}]}$, za celoten proces $\mathrm{M} + n\,\mathrm{L} \rightleftharpoons \mathrm{ML}_n$ pa je **celokupna konstanta** $\beta_n = \dfrac{[\mathrm{ML}_n]}{[\mathrm{M}][\mathrm{L}]^n}$.

*Trditev:* $\beta_n = K_1 K_2 \cdots K_n$. *Dokaz:* v produktu $\dfrac{[\mathrm{ML}]}{[\mathrm{M}][\mathrm{L}]} \cdot \dfrac{[\mathrm{ML_2}]}{[\mathrm{ML}][\mathrm{L}]} \cdots \dfrac{[\mathrm{ML}_n]}{[\mathrm{ML}_{n-1}][\mathrm{L}]}$ se vmesne zvrsti krajšajo, ostane $\dfrac{[\mathrm{ML}_n]}{[\mathrm{M}][\mathrm{L}]^n} = \beta_n$. Zato je $\log\beta_n = \log K_1 + \cdots + \log K_n$.

*Preizkus:* $K_1 = 10^4$, $K_2 = 10^3$. Koliko je $\log \beta_2$? *(7: logaritmi se seštejejo.)*

:::premisli
Bakrove ione bi lahko titrirali z amoniakom, saj je $\beta_4$ za $\mathrm{[Cu(NH_3)_4]^{2+}}$ okoli $10^{13}$. Napovej, kakšna bi bila titracijska krivulja, in zakaj to v praksi ne deluje.
---
Ker se štirje ligandi vežejo po korakih s podobnimi konstantami. V raztopini so hkrati $\mathrm{CuNH_3^{2+}}$, $\mathrm{Cu(NH_3)_2^{2+}}$ … in ni ene same ekvivalentne točke z ostrim skokom.
:::

**3. EDTA.** Etilendiamintetraocetna kislina ima šest atomov, ki se vežejo na kovino (dva dušika in štiri karboksilatne kisike). Je torej **šestvezni** ligand: ion objame z vseh strani kot klešče; takemu kompleksu rečemo **kelat**. Njen popolnoma deprotonirani anion označimo z $\mathrm{Y^{4-}}$. Ker se ves ligand veže naenkrat, **EDTA vedno reagira s kovinskim ionom v razmerju 1 : 1**, ne glede na naboj iona:

$$\mathrm{Ca^{2+} + Y^{4-} \rightleftharpoons CaY^{2-}} \qquad \mathrm{Al^{3+} + Y^{4-} \rightleftharpoons AlY^{-}}$$

Ena stopnja pomeni en oster preskok. Iz titracije zato sledi preprosto: $n(\mathrm{M}) = n(\mathrm{EDTA})$.

*Preizkus:* koliko mol EDTA porabi $1\ \mathrm{mol}$ $\mathrm{Fe^{3+}}$? *(1 mol.)*

**4. EDTA je kislina.** Zapišemo jo kot $\mathrm{H_4Y}$ s $\mathrm{p}K_a$ $2{,}00$; $2{,}69$; $6{,}13$; $10{,}37$. Kovino veže le popolnoma deprotonirana oblika $\mathrm{Y^{4-}}$. Njen delež med vsemi oblikami nevezane EDTA je

$$\alpha_{\mathrm{Y^{4-}}} = \frac{[\mathrm{Y^{4-}}]}{[\mathrm{EDTA}]'}, \qquad [\mathrm{EDTA}]' = [\mathrm{H_4Y}] + [\mathrm{H_3Y^-}] + [\mathrm{H_2Y^{2-}}] + [\mathrm{HY^{3-}}] + [\mathrm{Y^{4-}}]$$

*Izpeljava:* kislinske konstante EDTA označimo s $K_1, \ldots, K_4$ (to niso stopenjske konstante tvorbe od zgoraj; $\mathrm{p}K_4 = 10{,}37$). Iz njih je $[\mathrm{HY^{3-}}] = \dfrac{[\mathrm{H^+}][\mathrm{Y^{4-}}]}{K_4}$, $[\mathrm{H_2Y^{2-}}] = \dfrac{[\mathrm{H^+}]^2[\mathrm{Y^{4-}}]}{K_3K_4}$ in tako naprej. Vstavimo v vsoto, $[\mathrm{Y^{4-}}]$ se krajša in po množenju s $K_1K_2K_3K_4$ dobimo izraz v razdelku »Bolj natančno«. Delež je odvisen samo od pH:

| pH | $\alpha_{\mathrm{Y^{4-}}}$ | $\log \alpha_{\mathrm{Y^{4-}}}$ |
|---|---|---|
| 6 | $1{,}8 \cdot 10^{-5}$ | $-4{,}74$ |
| 8 | $4{,}2 \cdot 10^{-3}$ | $-2{,}38$ |
| 10 | $0{,}30$ | $-0{,}52$ |
| 12 | $0{,}98$ | $-0{,}01$ |

Protoni tekmujejo s kovino za ligand. Bolj kisla kot je raztopina, manj $\mathrm{Y^{4-}}$ je na voljo.

*Preizkus:* pri katerem pH iz tabele je skoraj vsa EDTA v obliki $\mathrm{Y^{4-}}$? *(Pri 12.)*

**5. Pogojna konstanta.** Pri izbranem pH združimo moč kompleksa ($K_f$) in delež prostega $\mathrm{Y^{4-}}$ ($\alpha_{\mathrm{Y^{4-}}}$) v **pogojno konstanto tvorbe**

$$K'_f = \alpha_{\mathrm{Y^{4-}}} \cdot K_f \qquad \log K'_f = \log K_f + \log \alpha_{\mathrm{Y^{4-}}}$$

*Izpeljava:* $[\mathrm{Y^{4-}}] = \alpha_{\mathrm{Y^{4-}}}[\mathrm{EDTA}]'$ vstavimo v $K_f$ in dobimo $\dfrac{[\mathrm{MY}]}{[\mathrm{M}][\mathrm{EDTA}]'} = \alpha_{\mathrm{Y^{4-}}}K_f = K'_f$. Pogojna konstanta je konstantna le, dokler je pH stalen, zato titriramo v pufru.

**Pogoj za titracijo.** V ekvivalentni točki smo dodali enako množino EDTA kot kovine, kompleks pa razpada v razmerju $1 : 1$, zato je $[\mathrm{M}] = [\mathrm{EDTA}]'$; skoraj vsa kovina pa je vezana, $[\mathrm{MY}] \approx c$. Vstavimo v $K'_f$: $K'_f = c/[\mathrm{M}]^2$, torej $[\mathrm{M}] = \sqrt{c/K'_f}$. Če zahtevamo, da ostane prostega največ $0{,}1\ \%$ kovine, mora biti $\dfrac{[\mathrm{M}]}{c} = \dfrac{1}{\sqrt{c\,K'_f}} \leq 10^{-3}$, torej
$$\log(c\,K'_f) \geq 6.$$
Za raztopine s $c \approx 0{,}01\ \mathrm{mol/L}$ to pomeni približno $\log K'_f \geq 8$.

:::premisli
Za $\mathrm{MgY^{2-}}$ je $\log K_f = 8{,}79$. Napovej, ali je titracija magnezija pri $\mathrm{pH}\ 8$ še uporabna.
---
Ni: $\log K'_f = 8{,}79 - 2{,}38 = 6{,}41$, kar je pod mejo 8. Pri $\mathrm{pH}\ 10$ je $8{,}79 - 0{,}52 = 8{,}27$ in titracija uspe. Šibkejši kompleks potrebuje bolj bazično raztopino.
:::

*Preizkus:* zakaj ne titriramo kar pri $\mathrm{pH}\ 13$? *(Iz poglavja o topnosti: obori se $\mathrm{Mg(OH)_2}$, ki ga EDTA ne doseže.)*

**6. Indikator.** Končno točko pokaže **kovinski indikator**, barvilo, ki s kovino tvori obarvan kompleks. Eriokrom črno T (EBT) je pri $\mathrm{pH}\ 10$ prost modre barve, vezan na magnezij pa vinsko rdeče. Na začetku je raztopina rdeča. EDTA najprej veže proste ione, tik pred ekvivalentno točko pa iztrga kovino še iz kompleksa z indikatorjem. Raztopina preide v modro. To deluje le, če je kompleks kovine z indikatorjem **šibkejši** od kompleksa z EDTA.

**7. Trdota vode.** Pri $\mathrm{pH}\ 10$ (pufer $\mathrm{NH_3/NH_4Cl}$, indikator EBT) EDTA titrira **Ca in Mg skupaj**: dobimo skupno trdoto. Pri $\mathrm{pH}$ okoli 12,5 se $\mathrm{Mg^{2+}}$ obori kot hidroksid, z indikatorjem za kalcij (npr. mureksid) titriramo **le Ca**. Magnezij dobimo iz razlike.

## Rešeni primeri

### Primer 1: skupna trdota kraškega izvira

Vzorec izvirske vode z volumnom $50{,}00\ \mathrm{mL}$ pufriramo na $\mathrm{pH}\ 10$, dodamo EBT in titriramo z raztopino EDTA s koncentracijo $0{,}01000\ \mathrm{mol/L}$. Barva preide iz rdeče v modro pri $14{,}60\ \mathrm{mL}$. Kolikšna je skupna koncentracija $\mathrm{Ca^{2+}}$ in $\mathrm{Mg^{2+}}$?

**Podatki:** $V(\text{vzorec}) = 50{,}00\ \mathrm{mL}$, $c(\mathrm{EDTA}) = 0{,}01000\ \mathrm{mol/L}$, $V(\mathrm{EDTA}) = 14{,}60\ \mathrm{mL}$, $\mathrm{pH}\ 10$
**Iščemo:** $c(\mathrm{Ca^{2+}} + \mathrm{Mg^{2+}})$

:::formula
$n(\mathrm{M}) = n(\mathrm{EDTA}) = c(\mathrm{EDTA}) \cdot V(\mathrm{EDTA})$, $\quad c(\mathrm{M}) = \dfrac{n(\mathrm{M})}{V(\text{vzorec})}$
:::

**Rešitev:**

1. Množina EDTA: $0{,}01000 \cdot 14{,}60 = 0{,}1460$, torej $0{,}1460\ \mathrm{mmol}$ (mol/L krat mL da mmol).
2. Razmerje je 1 : 1, zato je v vzorcu $0{,}1460\ \mathrm{mmol}$ ionov Ca in Mg skupaj.
3. Koncentracija: $\dfrac{0{,}1460}{50{,}00} = 0{,}002920$, torej $0{,}002920\ \mathrm{mol/L}$.
4. Odgovor: skupna koncentracija kalcija in magnezija je $2{,}920\ \mathrm{mmol/L}$; tako trda voda je za kraške izvire značilna.

### Primer 2: ali je sošolka imela prav?

Ali je titracija kalcija z EDTA uporabna pri $\mathrm{pH}\ 6$ in pri $\mathrm{pH}\ 10$? Kot mejo vzemi $\log K'_f \geq 8$.

**Podatki:** $\log K_f(\mathrm{CaY^{2-}}) = 10{,}65$, $\log \alpha_{\mathrm{Y^{4-}}}(\mathrm{pH}\ 6) = -4{,}74$, $\log \alpha_{\mathrm{Y^{4-}}}(\mathrm{pH}\ 10) = -0{,}52$, meja $\log K'_f \geq 8$
**Iščemo:** $\log K'_f$ pri obeh pH in odločitev

:::formula
$\log K'_f = \log K_f + \log \alpha_{\mathrm{Y^{4-}}}$
:::

**Rešitev:**

1. Pri $\mathrm{pH}\ 10$: $10{,}65 - 0{,}52 = 10{,}13$. To je nad mejo, ker je skoraj tretjina EDTA prosta $\mathrm{Y^{4-}}$.
2. Pri $\mathrm{pH}\ 6$: $10{,}65 - 4{,}74 = 5{,}91$. Protoni zasedejo skoraj ves ligand, zato je efektivna konstanta več kot desettisočkrat manjša.
3. Primerjava: $10{,}13 - 5{,}91 = 4{,}22$, pogojni konstanti se razlikujeta za več kot štiri velikostne razrede.
4. Odgovor: pri $\mathrm{pH}\ 10$ je titracija ostra, pri $\mathrm{pH}\ 6$ ne. Sošolka se je zmotila, ker je gledala $K_f$ namesto $K'_f$.

### Primer 3: kalcij in magnezij iz dveh titracij

Po dolgem sušnem obdobju vzamemo vzorec izvira pod dolomitno planoto. Dva vzorca po $100{,}0\ \mathrm{mL}$ titriramo z EDTA s koncentracijo $0{,}01000\ \mathrm{mol/L}$. Pri $\mathrm{pH}\ 10$ (EBT) porabimo $18{,}40\ \mathrm{mL}$, pri $\mathrm{pH}\ 12{,}5$ (mureksid) pa $13{,}10\ \mathrm{mL}$. Kolikšni sta masni koncentraciji kalcija in magnezija v mg/L? S topnostnim produktom preveri, ali je pri $\mathrm{pH}\ 12{,}5$ v raztopini res ostalo manj kot $0{,}1\ \%$ magnezija, da ga druga titracija ne zajame.

**Podatki:** $V(\text{vzorec}) = 100{,}0\ \mathrm{mL}$, $c(\mathrm{EDTA}) = 0{,}01000\ \mathrm{mol/L}$, $V_{10} = 18{,}40\ \mathrm{mL}$, $V_{12{,}5} = 13{,}10\ \mathrm{mL}$, $M(\mathrm{Ca}) = 40{,}08\ \mathrm{g/mol}$, $M(\mathrm{Mg}) = 24{,}31\ \mathrm{g/mol}$, $K_{sp}(\mathrm{Mg(OH)_2}) = 5{,}6 \cdot 10^{-12}$, $\mathrm{p}K_w = 14{,}00$
**Iščemo:** $\gamma(\mathrm{Ca})$, $\gamma(\mathrm{Mg})$ in delež neoborjenega Mg pri $\mathrm{pH}\ 12{,}5$

:::formula
$c(\mathrm{Ca}+\mathrm{Mg}) = \dfrac{c(\mathrm{EDTA})\, V_{10}}{V(\text{vzorec})}$, $\quad c(\mathrm{Ca}) = \dfrac{c(\mathrm{EDTA})\, V_{12{,}5}}{V(\text{vzorec})}$, $\quad c(\mathrm{Mg}) = c(\mathrm{Ca}+\mathrm{Mg}) - c(\mathrm{Ca})$, $\quad \gamma = c \cdot M$, $\quad [\mathrm{Mg^{2+}}] = \dfrac{K_{sp}}{[\mathrm{OH^-}]^2}$
:::

**Rešitev:**

1. Skupaj: $0{,}01000 \cdot 18{,}40 = 0{,}1840$, torej $0{,}1840\ \mathrm{mmol}$ v $0{,}1000\ \mathrm{L}$, kar je $1{,}840\ \mathrm{mmol/L}$.
2. Pri $\mathrm{pH}\ 12{,}5$ je magnezij oborjen, zato druga titracija zajame le kalcij: $0{,}01000 \cdot 13{,}10 = 0{,}1310$, torej $1{,}310\ \mathrm{mmol/L}$.
3. Kalcij v mg/L: $1{,}310 \cdot 40{,}08 = 52{,}50$, torej $\gamma(\mathrm{Ca}) = 52{,}50\ \mathrm{mg/L}$.
4. Magnezij iz razlike: $1{,}840 - 1{,}310 = 0{,}530$, torej $0{,}530\ \mathrm{mmol/L}$.
5. $\gamma(\mathrm{Mg}) = 0{,}530 \cdot 24{,}31 \approx 12{,}9$, torej $12{,}9\ \mathrm{mg/L}$. Razlika ima le tri značilne števke, ker smo odštevali.
6. Pri $\mathrm{pH}\ 12{,}5$ je $\mathrm{pOH} = 14{,}00 - 12{,}5 = 1{,}5$ in $[\mathrm{OH^-}]^2 = 10^{-3{,}0} = 1{,}0 \cdot 10^{-3}$. V raztopini lahko ostane največ $[\mathrm{Mg^{2+}}] = 5{,}6 \cdot 10^{-12} / 1{,}0 \cdot 10^{-3} = 5{,}6 \cdot 10^{-9}\ \mathrm{mol/L}$.
7. Delež neoborjenega magnezija: $5{,}6 \cdot 10^{-9} / 5{,}30 \cdot 10^{-4} \approx 1{,}1 \cdot 10^{-5}$, to je $0{,}001\ \%$, kar je daleč pod $0{,}1\ \%$.
8. Odgovor: voda vsebuje $52{,}50\ \mathrm{mg/L}$ kalcija in $12{,}9\ \mathrm{mg/L}$ magnezija; pri $\mathrm{pH}\ 12{,}5$ je v raztopini le okoli $0{,}001\ \%$ magnezija, zato druga titracija res zajame samo kalcij.

## Pogoste napake

- **Razmerje po naboju.** »$\mathrm{Al^{3+}}$ ima trikratni naboj, torej porabi tri EDTA.« Napačno, ker se en ion EDTA ovije okoli enega kovinskega iona ne glede na naboj. Popravek: pri EDTA vedno $n(\mathrm{M}) = n(\mathrm{EDTA})$.
- **Velika $K_f$, pH ni pomemben.** Tako je sklepala sošolka. $K_f$ velja le za $\mathrm{Y^{4-}}$, ki ga je v kislem zelo malo. Popravek: vedno izračunaj $\log K'_f = \log K_f + \log \alpha_{\mathrm{Y^{4-}}}$.
- **Deljenje z $\alpha$.** »$K'_f = K_f / \alpha$«, kar bi pomenilo, da se kompleks v kislem tvori lažje. Ker je $\alpha < 1$, mora biti pogojna konstanta manjša od $K_f$. Popravek: množi z $\alpha_{\mathrm{Y^{4-}}}$.
- **Indikator mora vezati čim močneje.** Če indikator kovino drži močneje kot EDTA, je titrant ne iztrga in barva se ne spremeni. Popravek: kompleks z indikatorjem mora biti šibkejši od kompleksa z EDTA.
- **Pri pH 10 se titrira samo kalcij.** EBT in EDTA pri $\mathrm{pH}\ 10$ zajameta oba iona. Popravek: pH 10 da skupno trdoto, pH okoli 12,5 le kalcij.

## Povzetek

- Kompleks nastane, ko ligand podari elektronske pare kovinskemu ionu; $K_f = \dfrac{[\mathrm{ML}]}{[\mathrm{M}][\mathrm{L}]}$, pri stopenjskem vezanju $\beta_n = K_1 K_2 \cdots K_n$.
- EDTA je šestvezni (kelatni) ligand, s kovino vedno reagira 1 : 1 v enem koraku: $n(\mathrm{M}) = n(\mathrm{EDTA})$.
- Kovino veže le $\mathrm{Y^{4-}}$; pogojna konstanta $\log K'_f = \log K_f + \log \alpha_{\mathrm{Y^{4-}}}$ mora biti približno vsaj 8.
- Kovinski indikator (EBT) mora vezati kovino šibkeje kot EDTA; pri $\mathrm{pH}\ 10$ preide iz vinsko rdeče v modro.
- Trdota vode: pri $\mathrm{pH}\ 10$ Ca + Mg, pri $\mathrm{pH} \approx 12{,}5$ le Ca (Mg se obori); Mg iz razlike.

## Za izpit

Znati moraš povedati:

- definicijo konstante tvorbe, stopenjskih konstant in celokupne konstante ter dokaz $\beta_n = K_1K_2\cdots K_n$;
- zakaj EDTA s kovinskim ionom reagira $1 : 1$ v enem koraku in kaj je kelat;
- definicijo $\alpha_{\mathrm{Y^{4-}}}$ in pogojne konstante ter izpeljavo $K'_f = \alpha_{\mathrm{Y^{4-}}}K_f$;
- izpeljavo $[\mathrm{M}] = \sqrt{c/K'_f}$ v ekvivalentni točki in pogoja $\log(c\,K'_f) \geq 6$;
- pogoj za kovinski indikator in postopek za Ca in Mg iz dveh titracij.

### Naloga 1

$50{,}00\ \mathrm{mL}$ raztopine $\mathrm{Ca^{2+}}$ ($0{,}01000\ \mathrm{mol/L}$) titriramo z EDTA ($0{,}01000\ \mathrm{mol/L}$) v pufru. Dano: $\log K_f(\mathrm{CaY^{2-}}) = 10{,}65$, $\mathrm{p}K_a$ EDTA $2{,}00$; $2{,}69$; $6{,}13$; $10{,}37$. (a) Pokaži, da je v območju okoli $\mathrm{pH}\ 8$ do $9$ $\log\alpha_{\mathrm{Y^{4-}}} \approx \mathrm{pH} - \mathrm{p}K_4$. (b) Izračunaj najnižji pH, pri katerem ostane v ekvivalentni točki prostega največ $0{,}1\ \%$ kalcija. (c) Izračunaj pCa v ekvivalentni točki pri tem pH in ga primerjaj s $\mathrm{pH}\ 10$ ($\log\alpha_{\mathrm{Y^{4-}}} = -0{,}52$).

**Rešitev:**

1. Števec in imenovalec izraza za $\alpha_{\mathrm{Y^{4-}}}$ delimo s $K_1K_2K_3$: $\alpha = \dfrac{K_4}{\frac{[\mathrm{H^+}]^4}{K_1K_2K_3} + \frac{[\mathrm{H^+}]^3}{K_2K_3} + \frac{[\mathrm{H^+}]^2}{K_3} + [\mathrm{H^+}] + K_4}$.
2. Pri $\mathrm{pH}\ 8$ je $[\mathrm{H^+}]/K_3 = 10^{-8}/10^{-6{,}13} \approx 0{,}013$ in $K_4/[\mathrm{H^+}] = 10^{-10{,}37}/10^{-8} \approx 0{,}004$; prvi trije členi in $K_4$ so zanemarljivi proti $[\mathrm{H^+}]$. Pri $\mathrm{pH}\ 9$ je $K_4/[\mathrm{H^+}] \approx 0{,}04$ in $[\mathrm{H^+}]/K_3 \approx 0{,}001$, približek torej velja v vsem območju. Zato $\alpha \approx K_4/[\mathrm{H^+}]$ in $\log\alpha \approx \mathrm{pH} - \mathrm{p}K_4$.
3. V ekvivalentni točki je $0{,}01000 \cdot 50{,}00 = 0{,}5000\ \mathrm{mmol}$ $\mathrm{CaY^{2-}}$ v $100{,}0\ \mathrm{mL}$: $c = 0{,}005000\ \mathrm{mol/L}$.
4. Pogoj $\log(c\,K'_f) \geq 6$ da $\log K'_f \geq 6 - \log 0{,}005000 = 6 + 2{,}30 = 8{,}30$.
5. $\log\alpha \geq 8{,}30 - 10{,}65 = -2{,}35$, torej $\mathrm{pH} - 10{,}37 \geq -2{,}35$ in $\mathrm{pH} \geq 8{,}02$. Ta pH leži v območju, kjer približek iz koraka 2 velja.
6. Pri $\mathrm{pH}\ 8{,}02$ je ravno $[\mathrm{Ca^{2+}}] = 10^{-3} \cdot 0{,}005000 = 5{,}0 \cdot 10^{-6}\ \mathrm{mol/L}$, $\mathrm{pCa} = 5{,}30$.
7. Pri $\mathrm{pH}\ 10$: $\log K'_f = 10{,}13$, $\mathrm{pCa} = \tfrac12(\log K'_f - \log c) = \tfrac12(10{,}13 + 2{,}30) \approx 6{,}2$.
8. Odgovor: kalcij lahko titriramo od približno $\mathrm{pH}\ 8{,}0$ naprej; tam je pCa v ekvivalentni točki $5{,}30$, pri $\mathrm{pH}\ 10$ pa okoli $6{,}2$, zato je preskok pri $\mathrm{pH}\ 10$ višji in končna točka ostrejša.

### Naloga 2

Natančno definiraj pogojno konstanto tvorbe in izpelji $K'_f = \alpha_{\mathrm{Y^{4-}}}K_f$. Izpelji koncentracijo proste kovine v ekvivalentni točki in dokaži, da ostane prostega največ $0{,}1\ \%$ kovine natanko tedaj, ko je $\log(c\,K'_f) \geq 6$. Utemelji, ali je magnezij pri $\mathrm{pH}\ 10$ ($\log K_f = 8{,}79$, $\log\alpha_{\mathrm{Y^{4-}}} = -0{,}52$, $c(\mathrm{MgY^{2-}}) = 0{,}00500\ \mathrm{mol/L}$ v ekvivalentni točki) še ustrezno titriran.

**Rešitev:**

1. Naj bo pH stalen (pufer) in naj kovino veže le $\mathrm{Y^{4-}}$. Pogojna konstanta je $K'_f = \dfrac{[\mathrm{MY}]}{[\mathrm{M}][\mathrm{EDTA}]'}$, kjer je $[\mathrm{EDTA}]'$ koncentracija vse nevezane EDTA v vseh protoniranih oblikah.
2. Po definiciji deleža je $[\mathrm{Y^{4-}}] = \alpha_{\mathrm{Y^{4-}}}[\mathrm{EDTA}]'$. Vstavimo v $K_f = \dfrac{[\mathrm{MY}]}{[\mathrm{M}][\mathrm{Y^{4-}}]}$ in preuredimo: $\dfrac{[\mathrm{MY}]}{[\mathrm{M}][\mathrm{EDTA}]'} = \alpha_{\mathrm{Y^{4-}}}K_f$.
3. V ekvivalentni točki smo dodali $n(\mathrm{EDTA}) = n(\mathrm{M})$; ker MY razpada na M in EDTA v razmerju $1 : 1$, je $[\mathrm{M}] = [\mathrm{EDTA}]'$, in ker je skoraj vse vezano, $[\mathrm{MY}] \approx c$.
4. Iz koraka 1: $K'_f = c/[\mathrm{M}]^2$, torej $[\mathrm{M}] = \sqrt{c/K'_f}$.
5. Delež proste kovine je $\dfrac{[\mathrm{M}]}{c} = \dfrac{1}{\sqrt{c\,K'_f}}$. Neenakost $\dfrac{1}{\sqrt{c\,K'_f}} \leq 10^{-3}$ je ekvivalentna $c\,K'_f \geq 10^6$, to je $\log(c\,K'_f) \geq 6$.
6. Magnezij: $\log K'_f = 8{,}79 - 0{,}52 = 8{,}27$, $\log(c\,K'_f) = 8{,}27 + \log 0{,}00500 = 8{,}27 - 2{,}30 = 5{,}97$.
7. Delež prostega Mg: $10^{-5{,}97/2} \approx 1{,}0 \cdot 10^{-3}$, to je $0{,}10\ \%$.
8. Odgovor: pri $\mathrm{pH}\ 10$ je titracija magnezija ravno na meji ($0{,}10\ \%$ proste kovine), zato je še uporabna, pH pa ne sme pasti pod $10$; pri $\mathrm{pH}\ 8$ bi bil $\log(c\,K'_f) = 6{,}41 - 2{,}30 = 4{,}11$ in prostega magnezija okoli $0{,}9\ \%$.

## Drugače: Na sliki

Titracijska krivulja kompleksometrije je kot krivulja kislinsko-bazne titracije, le da na navpični osi namesto pH riše $\mathrm{pCa} = -\log[\mathrm{Ca^{2+}}]$. Za $50{,}00\ \mathrm{mL}$ $0{,}0100\ \mathrm{mol/L}$ $\mathrm{Ca^{2+}}$ z $0{,}0100\ \mathrm{mol/L}$ EDTA pri $\mathrm{pH}\ 10$:

| $V(\mathrm{EDTA})$ [mL] | pCa | kaj določa $[\mathrm{Ca^{2+}}]$ |
|---|---|---|
| 0 | 2,00 | ves kalcij je prost |
| 25 | 2,48 | preostanek netitriranega Ca |
| 50 | 6,21 | rahla disociacija $\mathrm{CaY^{2-}}$ |
| 60 | 9,43 | prebitek EDTA potisne ravnotežje |

Do 25 mL se pCa dvigne le za pol enote, okoli 50 mL pa poskoči za skoraj štiri enote. Pri $\mathrm{pH}\ 6$ bi se pCa za ekvivalentno točko ustavil pri približno 5,2 namesto 9,4: preskok bi se sploščil v blago stopničko.

Mejo za $\log K'_f$ si predstavljaj na številski premici:

```
 5,91 (Ca, pH 6)     8   8,27 (Mg, pH 10)   10,13 (Ca, pH 10)
 ---|----------------|---|------------------|--------->  log K'
     prešibko        | uporabno
```

## Drugače: Bolj natančno

**Delež $\mathrm{Y^{4-}}$.** Iz štirih kislinskih konstant sledi

$$\alpha_{\mathrm{Y^{4-}}} = \frac{K_1K_2K_3K_4}{[\mathrm{H^+}]^4 + K_1[\mathrm{H^+}]^3 + K_1K_2[\mathrm{H^+}]^2 + K_1K_2K_3[\mathrm{H^+}] + K_1K_2K_3K_4}$$

Pri $\mathrm{pH}\ 10$ prevladujeta zadnja dva člena, zato je $\alpha \approx \dfrac{K_4}{[\mathrm{H^+}] + K_4} = 0{,}30$.

**Izpeljava $K'_f$.** Vso nevezano EDTA označimo z $[\mathrm{EDTA}]'$, torej $[\mathrm{Y^{4-}}] = \alpha_{\mathrm{Y^{4-}}} [\mathrm{EDTA}]'$. Vstavimo v $K_f$:

$$K_f = \frac{[\mathrm{CaY^{2-}}]}{[\mathrm{Ca^{2+}}]\,\alpha_{\mathrm{Y^{4-}}}[\mathrm{EDTA}]'} \;\Rightarrow\; \frac{[\mathrm{CaY^{2-}}]}{[\mathrm{Ca^{2+}}][\mathrm{EDTA}]'} = \alpha_{\mathrm{Y^{4-}}} K_f = K'_f$$

**Ekvivalentna točka.** Tam je $[\mathrm{Ca^{2+}}] = [\mathrm{EDTA}]'$, zato $[\mathrm{Ca^{2+}}] = \sqrt{c(\mathrm{CaY^{2-}})/K'_f}$. Pri $c = 0{,}00500\ \mathrm{mol/L}$ in $K'_f = 1{,}3 \cdot 10^{10}$ dobimo $[\mathrm{Ca^{2+}}] = 6{,}1 \cdot 10^{-7}\ \mathrm{mol/L}$ in $\mathrm{pCa} = 6{,}21$.

**Pomožni ligandi.** Če v raztopini kovino veže še kak drug ligand (npr. $\mathrm{NH_3}$ iz pufra), uvedemo še delež proste kovine $\alpha_{\mathrm{M}}$ in $K''_f = \alpha_{\mathrm{M}}\,\alpha_{\mathrm{Y^{4-}}}\,K_f$. Pomožni ligand prepreči obarjanje hidroksida, a hkrati zmanjša preskok.

**Načini titracije.** Pri *povratni* titraciji dodamo znan prebitek EDTA in ga titriramo z $\mathrm{Mg^{2+}}$ (za počasne ione, kot je $\mathrm{Al^{3+}}$). Pri *izpodrivni* titraciji analit izpodrine $\mathrm{Mg^{2+}}$ iz $\mathrm{MgY^{2-}}$, sproščeni magnezij pa titriramo.

## Drugače: Uporaba v stroki

- **Vodovodi in energetika.** Skupno trdoto in kalcij v pitni, kotlovski in hladilni vodi določajo s titracijo z EDTA pri $\mathrm{pH}\ 10$ in $12{,}5$, pogosto z avtomatskim titratorjem in fotometrično ali ionoselektivno končno točko. Po rezultatu nastavijo mehčanje z ionskimi izmenjevalci, da se v kotlih in toplotnih izmenjevalnikih ne nalaga kamen.
- **Farmacevtska kontrola.** Vsebnost kalcijevih, magnezijevih in cinkovih soli v učinkovinah in tabletah farmakopeja predpisuje kot kompleksometrično titracijo z natrijevim edetatom.
- **Povratna titracija.** Aluminij v antacidih reagira z EDTA počasi, zato dodamo znan prebitek EDTA, segrejemo in prebitek titriramo s cinkovo soljo.
- **EDTA kot maskirno sredstvo.** V detergentih, živilih (aditiv E 385) in kozmetiki veže sledi kovin, ki bi sicer katalizirale oksidacijo ali tvorile oborine.

## Preveri se

? Katera trditev o EDTA je pravilna?
- Z ionom $\mathrm{Fe^{3+}}$ reagira v razmerju 3 : 1, ker ima železo trikratni naboj.
~ Razmerje ni odvisno od naboja: šestvezni ligand objame en ion.
+ S skoraj vsemi kovinskimi ioni reagira v razmerju 1 : 1 v enem koraku.
- Kovino najmočneje veže v kisli raztopini, ko je popolnoma protonirana.
~ Protonirana EDTA ima donorske atome zasedene s protoni; kovino veže le $\mathrm{Y^{4-}}$.
- Veže se po korakih kot amoniak, zato ima štiri ekvivalentne točke.
~ Prav zato EDTA uporabljamo: veže se naenkrat, preskok je en sam.
> EDTA je kelatni ligand, ki z eno molekulo zasede vsa vezna mesta kovine, zato $n(\mathrm{M}) = n(\mathrm{EDTA})$.

? $25{,}00\ \mathrm{mL}$ vzorca porabi $9{,}80\ \mathrm{mL}$ EDTA s koncentracijo $0{,}02000\ \mathrm{mol/L}$. Kolikšna je koncentracija $\mathrm{Ca^{2+}}$?
- $3{,}92\ \mathrm{mmol/L}$
~ To dobiš, če deliš z 2, ker misliš, da $\mathrm{Ca^{2+}}$ veže pol EDTA. Razmerje je 1 : 1.
- $51{,}0\ \mathrm{mmol/L}$
~ Zamenjal si volumna: računal si $c \cdot V(\text{vzorec})/V(\mathrm{EDTA})$.
+ $7{,}84\ \mathrm{mmol/L}$
- $15{,}7\ \mathrm{mmol/L}$
~ Pomnožil si z 2 zaradi naboja $2+$. Naboj ne vpliva na razmerje z EDTA.
> $n = 0{,}02000 \cdot 9{,}80 = 0{,}196\ \mathrm{mmol}$, $c = 0{,}196\ \mathrm{mmol} / 0{,}02500\ \mathrm{L} = 7{,}84\ \mathrm{mmol/L}$.

? Sošolec je pri $\mathrm{pH}\ 6$ izračunal: »$\log K'_f = 10{,}65 - (-4{,}74) = 15{,}39$, torej je titracija v kislem še boljša.« Kje je napaka?
- Napake ni, v kislem so kompleksi bolj stabilni.
~ Protoni tekmujejo s kovino za EDTA, zato je kompleks v kislem manj stabilen.
+ Logaritma $\alpha$ ne odštejemo, ampak prištejemo: $\log K'_f = 10{,}65 - 4{,}74 = 5{,}91$.
- Namesto $\log K_f$ bi moral vzeti $K_f$ brez logaritma, rezultat bi bil pravilen.
~ Logaritmiranje ni težava. Narobe je predznak, ki ustreza deljenju z $\alpha$.
> $K'_f = \alpha K_f$ in $\alpha < 1$, zato mora biti $K'_f$ manjša od $K_f$. Rezultat 15,39 bi pomenil deljenje z $\alpha$.

? Pri $\mathrm{pH}\ 10$ je $\log K'_f$ za $\mathrm{CaY^{2-}}$ $10{,}13$, za $\mathrm{MgY^{2-}}$ pa $8{,}27$. Kaj velja?
- Pri $\mathrm{pH}\ 10$ se titrira le kalcij, magnezij ostane prost.
~ Tudi $8{,}27$ je nad mejo 8, zato se titrira tudi magnezij; zato dobimo skupno trdoto.
- Magnezij ima večji preskok, ker je njegov ion manjši.
~ Velikost preskoka določa $K'_f$, ki je pri magneziju manjša.
+ Oba se titrirata; preskok za magnezij bi bil sam zase manjši.
> Obe vrednosti presegata 8, zato EDTA pri $\mathrm{pH}\ 10$ zajame Ca in Mg. Manjša $K'_f$ pomeni nižji preskok.

? Isti vzorec potoka porabi pri $\mathrm{pH}\ 10$ $15{,}2\ \mathrm{mL}$ EDTA, pri $\mathrm{pH}\ 12{,}5$ pa le $11{,}0\ \mathrm{mL}$. Zakaj?
- Pri $\mathrm{pH}\ 12{,}5$ EDTA reagira s kalcijem v razmerju 1 : 2.
~ Razmerje je pri vsakem pH 1 : 1; spremeni se le, kateri ioni so v raztopini.
- Pri $\mathrm{pH}\ 12{,}5$ je manj prostega $\mathrm{Y^{4-}}$, zato ga porabimo manj.
~ Pri višjem pH je $\mathrm{Y^{4-}}$ več, ne manj; na porabo pa vpliva množina kovine.
+ Pri $\mathrm{pH}\ 12{,}5$ se magnezij obori kot $\mathrm{Mg(OH)_2}$, zato titriramo le kalcij.
> Razlika $15{,}2 - 11{,}0 = 4{,}2\ \mathrm{mL}$ ustreza magneziju v vzorcu.

:::simboli
K_f | konstanta tvorbe kompleksa | K_f = \frac{[\mathrm{ML}]}{[\mathrm{M}]\,[\mathrm{L}]} | L/mol | navajamo log K_f
K'_f | pogojna konstanta tvorbe | K'_f = \alpha_{\mathrm{Y^{4-}}} \cdot K_f | L/mol | za titracijo mora biti log K'_f ≥ 8
\alpha_{\mathrm{Y^{4-}}} | delež EDTA v obliki Y⁴⁻ | \alpha_{\mathrm{Y^{4-}}} = \frac{K_1K_2K_3K_4}{[\mathrm{H^+}]^4 + K_1[\mathrm{H^+}]^3 + K_1K_2[\mathrm{H^+}]^2 + K_1K_2K_3[\mathrm{H^+}] + K_1K_2K_3K_4} | – | raste z naraščajočim pH
K_1, K_2, K_3, K_4 | kislinske konstante EDTA | | mol/L | drugje: stopenjske konstante tvorbe kompleksa
n | množina snovi | | mol | v EP: n(M) = n(EDTA)
c | množinska koncentracija | | mol/L
V | prostornina | | mL
V_{10} | prostornina EDTA pri titraciji pri pH 10 | | mL | določimo Ca in Mg skupaj
V_{12{,}5} | prostornina EDTA pri titraciji pri pH 12,5 | | mL | določimo samo Ca
\gamma | masna koncentracija | \gamma = c \cdot M | mg/L
M | molska masa | | g/mol
K_{sp} | topnostni produkt | K_{sp} = [\mathrm{Mg^{2+}}][\mathrm{OH^-}]^2 | mol^3/L^3 | Mg(OH)₂: 5,6 · 10⁻¹²
:::
