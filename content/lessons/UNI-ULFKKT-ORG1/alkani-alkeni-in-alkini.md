---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dvojna vez $\mathrm{C{=}C}$ je močnejša od enojne $\mathrm{C{-}C}$. Pa vendar metan v jeklenki zemeljskega plina leta stoji nespremenjen, etilen (eten), ki ga oddajajo zoreče banane, pa z bromom v nekaj sekundah razbarva rdečerjavo bromovico in v tovarni z vodo ob kislinskem katalizatorju da etanol. Gramofonske »vinilke« so iz PVC, ki nastane, ko se kloroeten (vinilklorid) prek dvojnih vezi poveže v dolge verige.

Paradoks razreši zgradba vezi. Dvojna vez je ena vez $\sigma$ in ena vez $\pi$, vez $\pi$ pa je šibkejša in se pretrga prva. Ko razumeš, kako reagira vez $\pi$ in kaj se dogaja z alkani na svetlobi, znaš napovedati **produkt** brez učenja na pamet: kateri izomer nastane pri adiciji $\mathrm{HBr}$, zakaj brom izbira drugače kot klor in kako iz alkina dobiš *cis*- ali *trans*-alken.

## Razlaga

### Slika: kje ležijo elektroni

**Dve vrsti reaktivnosti.** Vez $\sigma$ $\mathrm{C{-}H}$ je močna in nepolarna, elektroni so tesno med jedroma. Alkani zato ne reagirajo s kislinami, bazami ali oksidanti pri sobni temperaturi. Reagirajo šele z zelo reaktivnimi delci z enim neparnim elektronom, z **radikali**. Vez $\pi$ v alkenu je šibkejša, njeni elektroni ležijo nad in pod ravnino molekule in so lahko dosegljivi. Alken je zato **nukleofil**: daje elektronski par **elektrofilu**, delcu, ki elektrone išče (npr. $\mathrm{H^+}$, $\mathrm{Br_2}$).

**Definicije.** Pri **homolitski** cepitvi vezi obdrži vsak atom po en elektron vezi in nastaneta radikala; pri **heterolitski** oba elektrona ostaneta pri enem atomu in nastaneta iona. **Elektrofil** je delec, ki v reakciji sprejme elektronski par in z njim tvori novo kovalentno vez (Lewisova kislina); **nukleofil** je delec, ki ta par odda (Lewisova baza). Reakcija je **regioselektivna**, če od več možnih konstitucijskih izomerov nastane pretežno eden, in **stereospecifična**, če stereoizomerni reaktanti dajo različne stereoizomerne produkte.

```
  alkan (le σ)                 alken (σ + π)
                                 ░░░ oblak π ░░░
  H3C ── CH3                   H2C ═══════ CH2
  elektroni tesno med jedroma    ░░░ oblak π ░░░
  → dosežejo jih le radikali    → dosegljiv elektrofilom
```

### Adicije na alkene

**Elektrofilna adicija $\mathrm{HBr}$.** Pri **adiciji** se dva delca vežeta na oba ogljika dvojne vezi, vez $\pi$ izgine. Mehanizem ima dva koraka:

1. Elektroni $\pi$ napadejo $\mathrm{H}$ iz $\mathrm{HBr}$. Nastane vez $\mathrm{C{-}H}$ in **karbokation**: ogljik s tremi vezmi, prazno orbitalo $p$ in nabojem $+$ ($sp^2$, ravninski).
2. Bromidni ion $\mathrm{Br^-}$ s svojim nevezanim parom napade karbokation. Nastane vez $\mathrm{C{-}Br}$.

Prvi korak je počasen, ker nastane nabit delec. Ta korak določa hitrost in **odloči, kateri produkt nastane**.

**Stabilnost karbokationov.** Alkilne skupine okoli pozitivnega ogljika ga stabilizirajo. Elektroni sosednjih vezi $\mathrm{C{-}H}$ in $\mathrm{C{-}C}$ se delno razširijo v prazno orbitalo $p$ (**hiperkonjugacija**), alkilne skupine pa še nekoliko potiskajo elektrone proti ogljiku (induktivni učinek). Več alkilnih skupin pomeni stabilnejši kation:

| karbokation | primer | št. alkilnih skupin | stabilnost |
|---|---|---|---|
| terciarni (3°) | $\mathrm{(CH_3)_3C^+}$ | 3 | največja |
| sekundarni (2°) | $\mathrm{(CH_3)_2CH^+}$ | 2 | srednja |
| primarni (1°) | $\mathrm{CH_3CH_2^+}$ | 1 | majhna |
| metilni | $\mathrm{CH_3^+}$ | 0 | najmanjša |

Enako zaporedje $3^\circ > 2^\circ > 1^\circ > \text{metil}$ velja za radikale.

**Primer: propen in $\mathrm{HBr}$.** Pri propenu $\mathrm{CH_3CH{=}CH_2}$ se $\mathrm{H^+}$ lahko veže na C1 ali na C2:

- $\mathrm{H}$ na C1 (končni $\mathrm{CH_2}$): pozitivni naboj ostane na C2, kation je **sekundarni**.
- $\mathrm{H}$ na C2: naboj je na C1, kation je **primarni**.

Hitreje nastane stabilnejši, sekundarni kation, zato je glavni produkt **2-bromopropan**.

**Markovnikovo pravilo.** *Če* na nesimetrično substituiran alken adiramo protonsko kislino $\mathrm{HX}$ (ali vodo ob kislinskem katalizatorju) po ionskem mehanizmu, torej brez peroksidov, *potem* se vodik veže na tisti ogljik dvojne vezi, ki že ima več vodikov, $\mathrm{X}$ pa na bolj substituiranega. Sodobna oblika je splošnejša: *elektrofil se veže tako, da nastane najstabilnejši karbokation.* Produktu, ki ustreza pravilu, rečemo **markovnikovski**.

**Utemeljitev.**
1. Drugi korak (ujetje kationa z $\mathrm{Br^-}$) je hiter in nepovraten, zato je razmerje produktov enako razmerju hitrosti obeh možnih protonacij (kinetična kontrola).
2. **Hammondov postulat:** prehodno stanje je po zgradbi in energiji podobno tistemu sosednjemu delcu (reaktantu ali produktu koraka), ki mu je energijsko bližje. Protonacija je endotermna, zato je prehodno stanje podobno karbokationu.
3. Kar stabilizira kation (hiperkonjugacija, induktivni učinek), zato zniža tudi prehodno stanje in aktivacijsko energijo $E_a$.
4. Ker je $k = A\,e^{-E_a/RT}$, nastaja stabilnejši kation hitreje in njegov produkt prevlada.

:::premisli
Na 2-metilpropen $\mathrm{(CH_3)_2C{=}CH_2}$ adiramo $\mathrm{HCl}$. Napovej glavni produkt, preden bereš naprej.
---
2-kloro-2-metilpropan, $\mathrm{(CH_3)_3CCl}$. Če se $\mathrm{H}$ veže na $\mathrm{CH_2}$, nastane terciarni kation; druga možnost bi dala primarni kation, ki je veliko manj stabilen.
:::

**Druge adicije na alkene.** Vse sledijo isti logiki ali pa imajo poseben razlog, da ji ne:

- **Hidratacija** ($\mathrm{H_2O}$, kislinski katalizator $\mathrm{H_2SO_4}$): prek karbokationa, markovnikovski alkohol. Propen da propan-2-ol.
- **Halogeniranje** ($\mathrm{Br_2}$ ali $\mathrm{Cl_2}$): namesto prostega karbokationa nastane trikotni **bromonijev ion**: en atom broma je hkrati vezan na oba ogljika nekdanje dvojne vezi in nosi pozitivni naboj. $\mathrm{Br^-}$ ga napade z nasprotne strani, zato se atoma broma vežeta **anti** (na nasprotni strani ravnine). Iz ciklopentena nastane *trans*-1,2-dibromociklopentan kot racemat. Ta reakcija je test na dvojno vez: bromovica se razbarva.
- **Hidrogeniranje** ($\mathrm{H_2}$, kovinski katalizator Pt, Pd ali Ni): oba vodika prideta s površine kovine na isto stran, adicija je **syn**. Nastane alkan.
- **$\mathrm{HBr}$ s peroksidi** ($\mathrm{ROOR}$, svetloba): radikalski mehanizem, produkt je **antimarkovnikovski** (razlaga spodaj, pri radikalskih reakcijah).

Kadar karbokation nastane na ravninskem ogljiku, ga nukleofil lahko napade z obeh strani. Če pri tem nastane stereocenter, dobimo racemat.

### Alkini

Trojna vez ima dve vezi $\pi$, zato alkin lahko adira **dvakrat**. S prebitkom $\mathrm{HBr}$ iz propina nastane 2,2-dibromopropan (obakrat po Markovnikovu). Pri hidrogeniranju izbiramo katalizator:

| reagent | kje se ustavi | produkt |
|---|---|---|
| $\mathrm{H_2}$, Pt ali Pd na oglju | gre do konca | alkan |
| $\mathrm{H_2}$, **Lindlarjev katalizator** (zastrupljen Pd) | pri alkenu, syn adicija | ***cis*-alken** |
| $\mathrm{Na}$ v tekočem $\mathrm{NH_3}$ | pri alkenu | ***trans*-alken** |

Hidratacija alkina (z $\mathrm{H_2SO_4}$ in $\mathrm{Hg^{2+}}$) najprej da **enol** (OH na ogljiku dvojne vezi), ki se takoj pretvori v keton. Iz propina nastane propanon.

### Radikalske reakcije

**Radikalsko halogeniranje alkanov.** Metan in klor v temi ne reagirata. Na svetlobi nastane klorometan in $\mathrm{HCl}$. Veriga se vrti v krogu:

```
        Cl·  ── + CH4 ──►  HCl + CH3·
         ▲                      │
         └── CH3Cl ◄── + Cl2 ───┘
```

Gre za **verižno reakcijo** v treh fazah:

1. **Iniciacija:** svetloba razcepi $\mathrm{Cl_2}$ **homolitsko** (vsak atom dobi en elektron): $\mathrm{Cl_2} \rightarrow 2\,\mathrm{Cl\cdot}$.
2. **Propagacija** (ponavlja se tisočkrat):
   $\mathrm{Cl\cdot} + \mathrm{CH_4} \rightarrow \mathrm{HCl} + \mathrm{CH_3\cdot}$, nato
   $\mathrm{CH_3\cdot} + \mathrm{Cl_2} \rightarrow \mathrm{CH_3Cl} + \mathrm{Cl\cdot}$.
   Drugi korak vrne $\mathrm{Cl\cdot}$, ki začne nov krog.
3. **Terminacija:** dva radikala se srečata in združita, npr. $\mathrm{CH_3\cdot} + \mathrm{Cl\cdot} \rightarrow \mathrm{CH_3Cl}$ ali $2\,\mathrm{CH_3\cdot} \rightarrow \mathrm{C_2H_6}$. Veriga se prekine.

**Entalpija iz energij vezi.** Reakcijo v plinski fazi si v mislih razdelimo na pretrganje vezi reaktantov (energijo porabimo) in nastanek vezi produktov (energijo sprostimo), zato je približno $\Delta H \approx \sum E(\text{pretrgane vezi}) - \sum E(\text{nastale vezi})$. Računamo s povprečnimi energijami vezi, zato je rezultat le ocena. Veriga teče, če noben korak propagacije ni močno endotermen (Primer 2).

Pri daljših alkanih je pomembno, **kateri vodik** se odtrga: primarni, sekundarni ali terciarni. Terciarni radikal je najstabilnejši, zato se terciarni $\mathrm{H}$ odtrga najlaže. Relativna hitrost na en vodik:

| reagent | 1° H | 2° H | 3° H |
|---|---|---|---|
| $\mathrm{Cl_2}$ (25 °C) | 1 | 3,8 | 5 |
| $\mathrm{Br_2}$ (125 °C) | 1 | 82 | 1600 |

Delež produkta je sorazmeren s produktom **število vodikov $\times$ relativna hitrost**. Klor je hiter in malo izbirčen, brom počasen in zelo izbirčen.

**Izpeljava deleža.** Naj ima alkan $n_i$ enakovrednih vodikov vrste $i$, vsak reagira s hitrostno konstanto $k_i$. Hitrost odtrganja vodikov vrste $i$ je $v_i = k_i\,n_i\,[\mathrm{X\cdot}][\mathrm{RH}]$. *Če* vsak radikal $\mathrm{R_i\cdot}$ da natanko en produkt $\mathrm{R_iX}$ in je pretvorba majhna (ni polihalogeniranja), *potem* je razmerje produktov enako razmerju hitrosti; $[\mathrm{X\cdot}][\mathrm{RH}]$ se pokrajša. Z $r_i = k_i/k_{1^\circ}$ dobimo $\text{delež}_i = \dfrac{n_i r_i}{\sum_j n_j r_j}$.

:::premisli
Zakaj je brom toliko bolj izbirčen od klora? Namig: korak $\mathrm{X\cdot} + \mathrm{R{-}H} \rightarrow \mathrm{HX} + \mathrm{R\cdot}$ je pri kloru eksotermen, pri bromu endotermen.
---
Pri bromu je prehodno stanje pozno in podobno radikalu $\mathrm{R\cdot}$, zato se razlika v stabilnosti radikalov ($3^\circ > 2^\circ > 1^\circ$) skoraj v celoti pozna v hitrosti. Pri kloru je prehodno stanje zgodnje, podobno izhodnemu alkanu, zato so razlike majhne (Hammondov postulat).
:::

**Antimarkovnikovska adicija $\mathrm{HBr}$.** S peroksidi nastane radikal $\mathrm{Br\cdot}$. Ta se veže prvi, in to na končni $\mathrm{CH_2}$, ker tako nastane stabilnejši sekundarni radikal. Nato radikal odtrga $\mathrm{H}$ iz $\mathrm{HBr}$. Iz propena nastane **1-bromopropan**. Pravilo »prek najstabilnejšega vmesnega delca« velja tudi tu. To deluje samo s $\mathrm{HBr}$, s $\mathrm{HCl}$ in $\mathrm{HI}$ ne.

## Rešeni primeri

### Primer 1 (lažji): ista reagenta, dva produkta

Na 2-metilpropen $\mathrm{(CH_3)_2C{=}CH_2}$ adiramo $\mathrm{HBr}$, enkrat v temi brez peroksidov, enkrat s peroksidi. Napiši glavna produkta.

**Podatki:** alken $\mathrm{(CH_3)_2C{=}CH_2}$; reagent $\mathrm{HBr}$; (a) brez peroksidov, (b) s peroksidi $\mathrm{ROOR}$
**Iščemo:** glavni produkt v (a) in (b)

:::formula
Reakcija poteče prek najstabilnejšega vmesnega delca ($3^\circ > 2^\circ > 1^\circ$). Brez peroksidov se prvi veže $\mathrm{H^+}$, s peroksidi $\mathrm{Br\cdot}$.
:::

**Rešitev:**

1. (a) Prvi se veže $\mathrm{H^+}$. Na $\mathrm{CH_2}$ da terciarni kation $\mathrm{(CH_3)_3C^+}$, na C2 bi dal primarnega. Izberemo terciarnega.
2. $\mathrm{Br^-}$ napade kation: nastane $\mathrm{(CH_3)_3CBr}$, 2-bromo-2-metilpropan.
3. (b) Prvi se veže $\mathrm{Br\cdot}$. Na $\mathrm{CH_2}$ da terciarni radikal $\mathrm{(CH_3)_2\dot{C}CH_2Br}$, ki je stabilnejši od primarnega.
4. Radikal odtrga $\mathrm{H}$ iz $\mathrm{HBr}$: nastane $\mathrm{(CH_3)_2CHCH_2Br}$, 1-bromo-2-metilpropan.
5. Odgovor: brez peroksidov nastane 2-bromo-2-metilpropan, s peroksidi 1-bromo-2-metilpropan.

### Primer 2: entalpija kloriranja metana

Izračunaj reakcijsko entalpijo $\Delta H$ za $\mathrm{CH_4} + \mathrm{Cl_2} \rightarrow \mathrm{CH_3Cl} + \mathrm{HCl}$ in za oba koraka propagacije. Energije vezi: $\mathrm{CH_3{-}H}$ $439\,\mathrm{kJ/mol}$, $\mathrm{Cl{-}Cl}$ $242\,\mathrm{kJ/mol}$, $\mathrm{CH_3{-}Cl}$ $350\,\mathrm{kJ/mol}$, $\mathrm{H{-}Cl}$ $431\,\mathrm{kJ/mol}$.

**Podatki:** $E(\mathrm{C{-}H}) = 439\,\mathrm{kJ/mol}$, $E(\mathrm{Cl{-}Cl}) = 242\,\mathrm{kJ/mol}$, $E(\mathrm{C{-}Cl}) = 350\,\mathrm{kJ/mol}$, $E(\mathrm{H{-}Cl}) = 431\,\mathrm{kJ/mol}$
**Iščemo:** $\Delta H$ celotne reakcije in obeh korakov propagacije

:::formula
$\Delta H = \sum E(\text{pretrgane vezi}) - \sum E(\text{nastale vezi})$
:::

**Rešitev:**

1. Pretrgamo $\mathrm{C{-}H}$ in $\mathrm{Cl{-}Cl}$: $439 + 242 = 681$ (v $\mathrm{kJ/mol}$).
2. Nastaneta $\mathrm{C{-}Cl}$ in $\mathrm{H{-}Cl}$: $350 + 431 = 781$.
3. Celota: $\Delta H = 681 - 781 = -100$, torej $-100\,\mathrm{kJ/mol}$ – reakcija je eksotermna.
4. Prvi korak propagacije ($\mathrm{Cl\cdot} + \mathrm{CH_4}$) pretrga $\mathrm{C{-}H}$, tvori $\mathrm{H{-}Cl}$: $\Delta H_1 = 439 - 431 = 8$, torej $+8\,\mathrm{kJ/mol}$.
5. Drugi korak ($\mathrm{CH_3\cdot} + \mathrm{Cl_2}$) pretrga $\mathrm{Cl{-}Cl}$, tvori $\mathrm{C{-}Cl}$: $\Delta H_2 = 242 - 350 = -108$, torej $-108\,\mathrm{kJ/mol}$.
6. Preverba: $8 + (-108) = -100$.
7. Odgovor: $\Delta H = -100\,\mathrm{kJ/mol}$; prvi korak propagacije je rahlo endotermen ($+8\,\mathrm{kJ/mol}$), drugi močno eksotermen ($-108\,\mathrm{kJ/mol}$).

### Primer 3 (težji): kloriranje ali bromiranje propana?

Iz propana želimo čim več 2-halopropana. Izračunaj deleža monohalogeniranih produktov pri kloriranju (25 °C) in pri bromiranju (125 °C). Nato ugotovi, kolikšna mora biti najmanj relativna hitrost $r$ na sekundarni vodik (primarni $= 1$), da dobimo vsaj $90\,\%$ 2-halopropana. Kateri reagent izbereš?

**Podatki:** propan $\mathrm{CH_3CH_2CH_3}$ ima $6$ primarnih in $2$ sekundarna vodika; relativni hitrosti na en H: klor $1 : 3{,}8$, brom $1 : 82$ (1° : 2°)
**Iščemo:** deleža 1- in 2-halopropana za oba halogena; najmanjši $r$ za $90\,\%$; boljši reagent

:::formula
$\text{delež}_i = \dfrac{n_i \cdot r_i}{\sum n_j \cdot r_j}$
($n$ = število vodikov dane vrste, $r$ = relativna hitrost na en vodik)
:::

**Rešitev:**

1. Klor, primarni H: $6 \cdot 1 = 6$.
2. Klor, sekundarni H: $2 \cdot 3{,}8 = 7{,}6$. Vsota: $6 + 7{,}6 = 13{,}6$.
3. Deleža: 1-kloropropan $\dfrac{6}{13{,}6} = 0{,}441$, torej $44\,\%$; 2-kloropropan $\dfrac{7{,}6}{13{,}6} = 0{,}559$, torej $56\,\%$.
4. Brom, primarni H: $6 \cdot 1 = 6$; sekundarni H: $2 \cdot 82 = 164$. Vsota: $6 + 164 = 170$.
5. Deleža: 1-bromopropan $\dfrac{6}{170} = 0{,}035$, torej $3{,}5\,\%$; 2-bromopropan $\dfrac{164}{170} = 0{,}965$, torej $96{,}5\,\%$.
6. Obratno vprašanje: pri neznanem $r$ je delež 2-halopropana $\dfrac{2r}{6 + 2r}$, ker je $6$ primarnih vodikov s hitrostjo $1$ in $2$ sekundarna s hitrostjo $r$.
7. Pogoj $\dfrac{2r}{6 + 2r} = 0{,}90$ pomnožimo z imenovalcem: $2r = 5{,}4 + 1{,}8r$, torej $0{,}2r = 5{,}4$ in $r = 27$. Delež z $r$ narašča, zato potrebujemo $r \ge 27$.
8. Klor ($r = 3{,}8$) je daleč pod mejo, brom ($r = 82$) jo preseže.
9. Odgovor: izberemo brom, ki da približno $96{,}5\,\%$ 2-bromopropana; klor da le $56\,\%$ 2-kloropropana, za $90\,\%$ pa bi potrebovali $r \ge 27$.

### Primer 4 – zdaj ti

2-metilpropan $\mathrm{(CH_3)_3CH}$ kloriramo na svetlobi pri 25 °C. Kolikšna deleža 1-kloro-2-metilpropana in 2-kloro-2-metilpropana pričakuješ?

**Podatki:** $9$ primarnih H (tri skupine $\mathrm{CH_3}$), $1$ terciarni H; relativni hitrosti 1° : 3° $= 1 : 5$
**Iščemo:** deleža obeh monokloriranih produktov

:::formula
$\text{delež}_i = \dfrac{n_i \cdot r_i}{\sum n_j \cdot r_j}$
:::

**Rešitev:**

1. Primarni H: $9 \cdot 1 = 9$.
2. Terciarni H: $1 \cdot 5 = 5$. Vsota: $9 + 5 = 14$.
3. Izračunaj deleža sam, nato preveri:

:::premisli
Koliko sta $\dfrac{9}{14}$ in $\dfrac{5}{14}$ v odstotkih? Kateri produkt prevladuje in zakaj, čeprav je terciarni H najreaktivnejši?
---
1-kloro-2-metilpropan $\approx 64\,\%$, 2-kloro-2-metilpropan $\approx 36\,\%$. Prevladuje primarni produkt, ker je primarnih vodikov devetkrat več, klor pa je premalo izbirčen, da bi to nadoknadil.
:::

## Pogoste napake

- **»Markovnikov = halogen na ogljik z več vodiki.«** Napačno obrnjeno. Vodik gre na ogljik, ki *že ima* več vodikov, halogen pa na bolj substituiranega. Popravek: ne uči se stavka, ampak nariši oba možna karbokationa in izberi stabilnejšega.
- **»Peroksidi obrnejo vse adicije.«** Antimarkovnikovski produkt s peroksidi nastane samo s $\mathrm{HBr}$. Pri $\mathrm{HCl}$, $\mathrm{HI}$ ali vodi peroksidi ne pomagajo.
- **»Produkt kloriranja določa samo stabilnost radikala.«** Pozabiš na število vodikov. Pri kloru, ki je malo izbirčen, statistika pogosto prevlada (Primer 4). Vedno računaj $n \cdot r$.
- **»Pri adiciji $\mathrm{Br_2}$ se broma vežeta na isto stran.«** Bromonijev ion napade $\mathrm{Br^-}$ z nasprotne strani, adicija je anti. Syn je hidrogeniranje.
- **»$\mathrm{H_2}$ in katalizator iz alkina vedno da alken.«** Navadni Pt ali Pd reducira do alkana. Za *cis*-alken potrebuješ Lindlarjev katalizator, za *trans*-alken $\mathrm{Na}/\mathrm{NH_3}$.

## Povzetek

- Alkani (le vezi $\sigma$) reagirajo radikalsko; alkeni in alkini (vezi $\pi$) so nukleofili in elektrofilno adirajo.
- Adicija $\mathrm{HX}$ in $\mathrm{H_2O}/\mathrm{H^+}$ poteče prek najstabilnejšega karbokationa ($3^\circ > 2^\circ > 1^\circ > \text{metil}$): Markovnikovo pravilo, H na ogljik z več vodiki.
- $\mathrm{HBr}$ s peroksidi: radikalska, antimarkovnikovska adicija.
- $\mathrm{Br_2}$: anti adicija prek bromonijevega iona; $\mathrm{H_2}/\text{kat.}$: syn adicija.
- Alkini adirajo dvakrat; Lindlar da *cis*-alken, $\mathrm{Na}/\mathrm{NH_3}$ *trans*-alken; hidratacija prek enola da keton.
- Radikalsko halogeniranje: iniciacija, propagacija, terminacija. Delež produkta $\propto$ število H $\times$ relativna hitrost; brom je veliko bolj izbirčen od klora.

## Za izpit

Znati moraš povedati:

- definicije homolitske in heterolitske cepitve, elektrofila, nukleofila, regioselektivnosti in stereospecifičnosti;
- Markovnikovo pravilo v klasični in sodobni obliki s pogoji in njegovo utemeljitev s Hammondovim postulatom;
- mehanizme: elektrofilna adicija $\mathrm{HX}$, adicija $\mathrm{Br_2}$ prek bromonijevega iona (anti), radikalska adicija $\mathrm{HBr}$ s peroksidi, radikalsko halogeniranje v treh fazah;
- izpeljavo deleža produkta $n_i r_i / \sum n_j r_j$ s pogoji in oceno $\Delta H$ iz energij vezi;
- katalizatorje za alkin → alkan, *cis*-alken, *trans*-alken.

### Naloga 1

2-metilbutan $\mathrm{(CH_3)_2CH{-}CH_2{-}CH_3}$ monohalogeniramo (a) s klorom na svetlobi pri 25 °C in (b) z bromom pri 125 °C. Relativne hitrosti na en vodik (1° : 2° : 3°) so za klor $1 : 3{,}8 : 5$, za brom $1 : 82 : 1600$. Poimenuj vse monohalogenirane konstitucijske izomere, izračunaj njihove deleže za oba halogena in ugotovi, kateri produkti nastanejo kot racemati.

**Rešitev:**

1. Vrste vodikov: metilni skupini na C2 sta enakovredni, $6$ primarnih H (1-halo-2-metilbutan); C2 ima $1$ terciarni H (2-halo-2-metilbutan); C3 ima $2$ sekundarna H (2-halo-3-metilbutan); C4 ima $3$ primarne H (1-halo-3-metilbutan). Kontrola: $6 + 1 + 2 + 3 = 12$, kar ustreza $\mathrm{C_5H_{12}}$.
2. Klor: $6 \cdot 1 = 6$; $1 \cdot 5 = 5$; $2 \cdot 3{,}8 = 7{,}6$; $3 \cdot 1 = 3$; vsota $6 + 5 + 7{,}6 + 3 = 21{,}6$.
3. Deleži pri kloru: $\dfrac{6}{21{,}6} = 0{,}278$, $\dfrac{5}{21{,}6} = 0{,}231$, $\dfrac{7{,}6}{21{,}6} = 0{,}352$, $\dfrac{3}{21{,}6} = 0{,}139$.
4. Brom: $6 \cdot 1 = 6$, $1 \cdot 1600 = 1600$, $2 \cdot 82 = 164$, $3 \cdot 1 = 3$; vsota $6 + 1600 + 164 + 3 = 1773$.
5. Deleži pri bromu: $\dfrac{1600}{1773} = 0{,}902$, $\dfrac{164}{1773} = 0{,}0925$, $\dfrac{6}{1773} = 0{,}0034$, $\dfrac{3}{1773} = 0{,}0017$.
6. Stereocenter dobita 1-halo-2-metilbutan (C2: H, $\mathrm{CH_3}$, $\mathrm{CH_2X}$, $\mathrm{C_2H_5}$) in 2-halo-3-metilbutan (C2: X, H, $\mathrm{CH_3}$, $\mathrm{CH(CH_3)_2}$). Pri 2-halo-2-metilbutanu sta na C2 dve metilni skupini, pri 1-halo-3-metilbutanu na C3 prav tako, zato nista kiralna.
7. Reaktanti so akiralni, zato oba kiralna produkta nastaneta kot racemata: pri 2-halo-3-metilbutanu je ravninski radikal na stereocentru in ga $\mathrm{X_2}$ napade z obeh strani enako verjetno, pri 1-halo-2-metilbutanu pa halogen enako verjetno zamenja vodik na eni ali drugi od obeh enakovrednih metilnih skupin.
8. Odgovor: s klorom nastane $27{,}8\,\%$ 1-kloro-2-metilbutana, $23{,}1\,\%$ 2-kloro-2-metilbutana, $35{,}2\,\%$ 2-kloro-3-metilbutana in $13{,}9\,\%$ 1-kloro-3-metilbutana; z bromom $90{,}2\,\%$ 2-bromo-2-metilbutana, $9{,}2\,\%$ 2-bromo-3-metilbutana in manj kot $1\,\%$ obeh primarnih bromidov. Racemata sta 1-halo-2-metilbutan in 2-halo-3-metilbutan.

### Naloga 2

Natančno navedi Markovnikovo pravilo s pogoji in ga utemelji z mehanizmom adicije $\mathrm{HBr}$ na propen. Utemelji, ali pravilo velja tudi, če reakcijo izvedemo ob dodatku peroksida, in napiši produkt.

**Rešitev:**

1. Pravilo: če na nesimetričen alken adiramo $\mathrm{HX}$ ali $\mathrm{H_2O}/\mathrm{H^+}$ po ionskem mehanizmu, se H veže na ogljik dvojne vezi z več vodiki, X na bolj substituiranega; splošno: elektrofil se veže tako, da nastane najstabilnejši karbokation.
2. Mehanizem: elektroni $\pi$ napadejo $\mathrm{H^+}$ (počasi, nastane karbokation), nato $\mathrm{Br^-}$ napade kation (hitro). Produkt določi prvi korak.
3. Dve možnosti: H na C1 da sekundarni kation $\mathrm{CH_3CH^+CH_3}$, H na C2 primarni $\mathrm{CH_3CH_2CH_2^+}$. Sekundarni je stabilnejši zaradi hiperkonjugacije in induktivnega učinka dveh alkilnih skupin.
4. Protonacija je endotermna, zato je po Hammondovem postulatu prehodno stanje podobno kationu; stabilnejši kation ima nižjo $E_a$ in nastaja hitreje. Glavni produkt je 2-bromopropan.
5. S peroksidom se mehanizem spremeni: $\mathrm{RO\cdot}$ odtrga H iz $\mathrm{HBr}$, nastane $\mathrm{Br\cdot}$, ki se prvi veže na alken. Pogoj »ionski mehanizem« ni izpolnjen, zato klasična oblika pravila ne velja.
6. $\mathrm{Br\cdot}$ se veže na C1, ker nastane sekundarni radikal $\mathrm{CH_3\dot{C}HCH_2Br}$ ($3^\circ > 2^\circ > 1^\circ$ velja tudi za radikale); ta odtrga H iz $\mathrm{HBr}$ in obnovi $\mathrm{Br\cdot}$.
7. Odgovor: brez peroksida nastane 2-bromopropan; s peroksidom poteče radikalska verižna reakcija in nastane antimarkovnikovski 1-bromopropan. V obeh primerih adicija poteče prek najstabilnejšega vmesnega delca: brez peroksida karbokationa, s peroksidom radikala.

## Drugače: Na sliki

```
A: H+ na C1
   CH3–CH=CH2 → CH3–CH(+)–CH3
   2°, stabilnejši
B: H+ na C2
   CH3–CH=CH2 → CH3–CH2–CH2(+)
   1°, manj stabilen
```

Hitreje nastane kation A, $\mathrm{Br^-}$ pa pride tja, kjer je naboj.

## Drugače: Uporaba v stroki

- **Petrokemija:** propen iz krekinga industrijsko hidratirajo na kislinskem katalizatorju; po Markovnikovu nastane propan-2-ol (izopropanol).
- **Živilska tehnologija:** olja hidrogenirajo z $\mathrm{H_2}$ na niklju; delno hidrogeniranje da tudi *trans*-maščobe, ki jih EU od 2021 omejuje na $2\,\mathrm{g}$ na $100\,\mathrm{g}$ maščobe.
- **Analitika:** nenasičenost goriv in olj merijo z adicijo halogena (bromovo, jodovo število).

## Drugače: Bolj natančno

**Premestitve.** Karbokation se lahko z $1{,}2$-premikom hidrida ali metila pretvori v stabilnejšega: 3-metilbut-1-en s $\mathrm{HCl}$ da prek terciarnega kationa 2-kloro-2-metilbutan. Pri bromonijevem ionu premestitev ni.

**Stereokemija.** Pri adiciji $\mathrm{Br_2}$ na *cis*-but-2-en nastane racemat (2*R*,3*R*)- in (2*S*,3*S*)-2,3-dibromobutana, na *trans*-but-2-en pa mezo spojina. Anti adicija je torej **stereospecifična**.

## Preveri se

? Katera je glavna razlika v reaktivnosti alkanov in alkenov?
- Alkani so bolj reaktivni, ker imajo več vodikov.
~ Število vodikov ne določa reaktivnosti. Vezi $\mathrm{C{-}H}$ $\sigma$ so močne in nepolarne, zato so alkani leni.
+ Alkeni imajo elektrone $\pi$, ki napadejo elektrofile; alkani reagirajo le z radikali.
- Alkeni so manj reaktivni, ker je dvojna vez močnejša od enojne.
~ Celotna dvojna vez je res močnejša, a vez $\pi$ v njej je šibkejša od vezi $\sigma$ in se pretrga prva.
> Alkani imajo le močne vezi $\sigma$ in reagirajo radikalsko; vez $\pi$ v alkenu je dosegljiv elektronski par, zato alkeni elektrofilno adirajo.

? Kateri je glavni produkt adicije $\mathrm{HCl}$ na 1-metilcikloheksen?
- 1-kloro-2-metilcikloheksan
~ To je antimarkovnikovski produkt: klor na manj substituiranem ogljiku. Brez peroksidov poteče reakcija prek terciarnega kationa.
+ 1-kloro-1-metilcikloheksan
- metilcikloheksan
~ To bi dobil z $\mathrm{H_2}$ in katalizatorjem. $\mathrm{HCl}$ adira $\mathrm{H}$ in $\mathrm{Cl}$.
> $\mathrm{H^+}$ se veže na C2, naboj ostane na terciarnem C1, ki nosi metilno skupino; tja se veže $\mathrm{Cl^-}$.

? Zakaj da $\mathrm{HBr}$ s peroksidi iz propena 1-bromopropan?
- Ker peroksidi naredijo primarni karbokation stabilnejšega.
~ Peroksidi ne spremenijo stabilnosti kationov. Spremenijo mehanizem: prvi se veže $\mathrm{Br\cdot}$, ne $\mathrm{H^+}$.
- Ker se pri radikalskih reakcijah Markovnikovo pravilo ne upošteva.
~ Logika »najstabilnejši vmesni delec« še vedno velja; le da se prvi veže brom in nastane sekundarni radikal.
+ Ker se prvi veže $\mathrm{Br\cdot}$ na $\mathrm{CH_2}$, da nastane stabilnejši sekundarni radikal.
> Brom pride na končni ogljik, ker tako nastane sekundarni radikal; nato radikal odtrga $\mathrm{H}$ iz $\mathrm{HBr}$.

? Butan ima $6$ primarnih in $4$ sekundarne vodike. Kolikšen delež 2-klorobutana nastane pri kloriranju (1° : 2° $= 1 : 3{,}8$)?
- $40\,\%$
~ To je le delež sekundarnih vodikov ($4$ od $10$); pozabil si pomnožiti z relativno hitrostjo.
+ $72\,\%$
- $97\,\%$
~ Tolikšna izbirčnost je značilna za brom. Klor je veliko manj izbirčen.
> $4 \cdot 3{,}8 = 15{,}2$; $6 \cdot 1 = 6$; delež $\dfrac{15{,}2}{21{,}2} \approx 72\,\%$.

? Kateri reagent iz but-2-ina da *cis*-but-2-en?
- $\mathrm{H_2}$, Pt
~ Navadni Pt ne ustavi reakcije pri alkenu; nastane butan.
- $\mathrm{Na}$ v tekočem $\mathrm{NH_3}$
~ Ta redukcija da *trans*-alken.
+ $\mathrm{H_2}$, Lindlarjev katalizator
> Zastrupljeni Pd adira en ekvivalent $\mathrm{H_2}$ syn, oba vodika na isto stran, zato nastane *cis*-but-2-en.

:::simboli
\Delta H | reakcijska entalpija | \Delta H = \sum E(\text{pretrgane vezi}) - \sum E(\text{nastale vezi}) | kJ/mol | negativna: reakcija je eksotermna
E | energija vezi | | kJ/mol |
n_i | število vodikov vrste i | | – | npr. primarni, sekundarni, terciarni vodiki
r_i | relativna hitrost na en vodik vrste i | | – |
n_j | število vodikov vrste j (v vsoti) | | – | seštejemo po vseh vrstah vodikov
r_j | relativna hitrost na en vodik vrste j | | – |
n | število vodikov dane vrste | | – |
r | relativna hitrost na en vodik | | – | brom je bolj izbirčen kot klor
:::
