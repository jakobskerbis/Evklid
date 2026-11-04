---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sladkor se v suhi ponvi stopi v karamelo, sol pa ostane trdna do $801\,^\circ\mathrm{C}$. V vodi se raztopita oba, olje pa ne. Ugani: kaj imata sol in sladkor skupnega, da se topita v vodi, in kaj ju loči? Ključ do uganke sta **kemijska vez** in **sile med molekulami**.

Iz **elektronegativnosti** sklepamo na vrsto vezi, z modelom **VSEPR** in **hibridizacijo** na obliko molekule, iz oblike in polarnosti pa na **medmolekulske sile**, ki določajo vrelišče, topnost in zgradbo DNA in beljakovin.

## Razlaga

### Elektronegativnost in vrste vezi

**Elektronegativnost** $\chi$ je merilo, kako močno atom v vezi privlači skupne elektrone. Na Paulingovi lestvici je najvišja pri fluoru ($3{,}98$), visoka pri kisiku ($3{,}44$), dušiku ($3{,}04$) in kloru ($3{,}16$), nizka pri alkalijskih kovinah (natrij $0{,}93$).

Primerjaj tri snovi, ki vse vsebujejo klor. Kuhinjska sol $\mathrm{NaCl}$ ($\Delta\chi = 3{,}16 - 0{,}93 = 2{,}23$) je trd kristal ionov. Vodikov klorid $\mathrm{HCl}$ ($\Delta\chi = 0{,}96$) je plin iz molekul z delnima nabojema. Klor $\mathrm{Cl_2}$ ($\Delta\chi = 0$) je plin iz povsem simetričnih molekul. Vzorec: večja kot je razlika, bolj se skupni par pomakne k enemu atomu, pri največjih razlikah pa elektron preide v celoti. Iz takih primerjav izhaja okvirno pravilo za razliko $\Delta\chi$ med vezanima atomoma:

- $\Delta\chi < 0{,}4$: **nepolarna kovalentna** vez (elektroni so enakomerno porazdeljeni, npr. $\mathrm{Cl_2}$, vez $\mathrm{C{-}H}$),
- $0{,}4 \le \Delta\chi \le 1{,}7$: **polarna kovalentna** vez (delna naboja $\delta^+$ in $\delta^-$, npr. $\mathrm{H{-}Cl}$, $\mathrm{O{-}H}$),
- $\Delta\chi > 1{,}7$: pretežno **ionska** vez (prenos elektronov, npr. $\mathrm{NaCl}$).

Meje niso ostre: prehod od kovalentne do ionske vezi je zvezen.

### Ionska vez

Atom z nizko ionizacijsko energijo (kovina) odda elektrone, atom z visoko elektronsko afiniteto (nekovina) jih sprejme. Nastali kationi in anioni se privlačijo z električno silo v vse smeri, zato ne tvorijo molekul, ampak **ionsko kristalno mrežo**. Moč mreže opisuje **mrežna entalpija** $\Delta H_{\mathrm{mr}}$: sprememba entalpije pri nastanku enega mola kristala iz plinastih ionov, npr. $\mathrm{Na^+(g) + Cl^-(g) \to NaCl(s)}$. Je negativna; njena absolutna vrednost je **mrežna energija**. Iz Coulombovega zakona $E = \frac{z_+ z_- e^2}{4\pi\varepsilon_0 r}$ ($z_+$, $z_-$: nabojni števili ionov, $r$: razdalja, $e$: osnovni naboj) sledi, da je $|\Delta H_{\mathrm{mr}}|$ pri enakem tipu mreže približno sorazmerna z $\frac{|z_+ z_-|}{r_+ + r_-}$: večja naboja in manjša iona dasta trdnejšo mrežo (in višje tališče). Ionske snovi so trde, krhke, v talini in raztopini prevajajo električni tok.

**Born-Haberjev cikel.** Mrežne entalpije ne moremo izmeriti. Ker je entalpija funkcija stanja, je po **Hessovem zakonu** tvorbena entalpija enaka vsoti entalpij poti prek plinastih ionov. Za spojino $\mathrm{MX}$ iz kovine $\mathrm{M(s)}$ in dvoatomnega $\mathrm{X_2(g)}$:

$$\Delta H_f^\circ = \Delta H_{\mathrm{sub}}(\mathrm{M}) + I(\mathrm{M}) + \tfrac{1}{2}D(\mathrm{X_2}) + \Delta H_{\mathrm{ea}}(\mathrm{X}) + \Delta H_{\mathrm{mr}},$$

kjer je $I$ ionizacijska energija, $D$ disociacijska energija vezi in $\Delta H_{\mathrm{ea}}$ entalpija sprejema elektrona. Iz znanih členov izrazimo $\Delta H_{\mathrm{mr}}$.

### Kovalentna vez

Atoma si delita elektronski par. **Lewisova struktura** prikaže vezne in nevezne (proste) elektronske pare. Postopek: (1) preštej valenčne elektrone (pri ionih prištej ali odštej naboj), (2) poveži atome z enojnimi vezmi, (3) dopolni oktete zunanjih atomov, (4) ostanek postavi na osrednji atom, (5) po potrebi tvori dvojne ali trojne vezi. **Formalni naboj** atoma je

$$\mathrm{FN} = (\text{valenčni } e^-) - (\text{nevezni } e^-) - \tfrac{1}{2}(\text{vezni } e^-);$$

atomu pripišemo vse njegove nevezne elektrone in polovico veznih. Vsota formalnih nabojev je enaka naboju delca. Najboljša struktura ima formalne naboje čim bližje nič, negativne pa na bolj elektronegativnih atomih. Atomi 3. periode in višjih ($\mathrm{P}$, $\mathrm{S}$, $\mathrm{Cl}$, $\mathrm{Xe}$) imajo lahko **razširjen oktet** ($\mathrm{PCl_5}$, $\mathrm{SF_6}$).

**Resonanca.** Če lahko pri istem razporedu atomov narišemo več Lewisovih struktur (npr. $\mathrm{O_3}$, $\mathrm{CO_3^{2-}}$), je dejansko stanje **resonančni hibrid**: elektroni $\pi$ so delokalizirani, enakovredne vezi so enako dolge, red vezi je povprečje (v $\mathrm{CO_3^{2-}}$ $\frac{4}{3}$, ker se ena dvojna vez porazdeli na tri vezi). **Red vezi** (enojna, dvojna, trojna) je povezan z dolžino in energijo vezi: za ogljik je $\mathrm{C{-}C}$ dolga približno $154\,\mathrm{pm}$ ($347\,\mathrm{kJ/mol}$), $\mathrm{C{=}C}$ $134\,\mathrm{pm}$ ($614\,\mathrm{kJ/mol}$), $\mathrm{C{\equiv}C}$ $120\,\mathrm{pm}$ ($839\,\mathrm{kJ/mol}$).

### Model VSEPR

Elektronski pari okoli osrednjega atoma se med seboj odbijajo in se razporedijo čim dlje narazen. Štejemo **elektronske skupine**: vsak vezani atom (ne glede na red vezi) in vsak nevezni par. Zapis $\mathrm{AX}_m\mathrm{E}_n$ pomeni osrednji atom $\mathrm{A}$, $m$ vezanih atomov in $n$ neveznih parov.

:::premisli
Metan $\mathrm{CH_4}$ ima okoli ogljika štiri vezi in kot $109{,}5^\circ$. Amonijak $\mathrm{NH_3}$ ima okoli dušika tri vezi in en nevezni par, torej prav tako štiri skupine. Bo kot $\mathrm{H{-}N{-}H}$ večji ali manjši od $109{,}5^\circ$?
---
Manjši, okoli $107^\circ$. Razporeditev skupin je še vedno tetraedrska, a nevezni par je bliže jedru in se odbija močneje kot vezni, zato potisne vezi skupaj.
:::

- $2$ skupini: linearno, $180^\circ$ ($\mathrm{CO_2}$),
- $3$ skupine: trigonalno planarno, $120^\circ$ ($\mathrm{BF_3}$); z enim neveznim parom kotna oblika ($\mathrm{SO_2}$),
- $4$ skupine: tetraedrsko, $109{,}5^\circ$ ($\mathrm{CH_4}$); $\mathrm{AX_3E}$ trigonalna piramida ($\mathrm{NH_3}$, približno $107^\circ$); $\mathrm{AX_2E_2}$ kotna ($\mathrm{H_2O}$, približno $104{,}5^\circ$),
- $5$ skupin: trigonalna bipiramida ($\mathrm{PCl_5}$, $90^\circ$ in $120^\circ$); nevezni pari zasedejo ekvatorialna mesta: $\mathrm{AX_4E}$ deformiran tetraeder ali »gugalnica« ($\mathrm{SF_4}$), $\mathrm{AX_3E_2}$ oblika T ($\mathrm{ClF_3}$), $\mathrm{AX_2E_3}$ linearna ($\mathrm{XeF_2}$, $\mathrm{I_3^-}$),
- $6$ skupin: oktaeder ($\mathrm{SF_6}$, $90^\circ$); $\mathrm{AX_5E}$ kvadratna piramida ($\mathrm{BrF_5}$), $\mathrm{AX_4E_2}$ kvadratno planarna ($\mathrm{XeF_4}$, nevezna para nasproti).

Nevezni pari se odbijajo močneje kot vezni, zato kote stisnejo. **Razporeditev elektronskih skupin** in **oblika molekule** (razporeditev atomov) se razlikujeta, kadar ima osrednji atom nevezne pare.

### Hibridizacija

Atomske orbitale osrednjega atoma se pomešajo v enakovredne **hibridne orbitale**, usmerjene tako, kot zahteva VSEPR. Število hibridnih orbital je enako številu elektronskih skupin:

- $2$ skupini: $sp$ (ena $s$ in ena $p$), $180^\circ$,
- $3$ skupine: $sp^2$, $120^\circ$,
- $4$ skupine: $sp^3$, $109{,}5^\circ$,
- $5$ in $6$ skupin: formalno $sp^3d$ in $sp^3d^2$.

Iz $k$ atomskih orbital nastane natanko $k$ hibridnih. Hibridne orbitale tvorijo **vezi $\sigma$** (prekrivanje vzdolž osi vezi). Nehibridizirane orbitale $p$ se lahko bočno prekrijejo v **vezi $\pi$**. Enojna vez je ena $\sigma$, dvojna $\sigma + \pi$, trojna $\sigma + 2\pi$. Ker vez $\pi$ zahteva vzporedni orbitali $p$, okoli dvojne vezi ni prostega vrtenja (od tod izomerija *cis-trans*).

### Polarnost molekule

Polarne vezi še ne pomenijo polarne molekule. Dva naboja $+q$ in $-q$ na razdalji $d$ imata **dipolni moment** z velikostjo $\mu = q d$ (enota $\mathrm{C\,m}$ ali debye, $1\,\mathrm{D} = 3{,}336 \cdot 10^{-30}\,\mathrm{C\,m}$). Dipolni moment molekule je vektorska vsota dipolnih momentov vezi; molekula je polarna natanko tedaj, ko ta vsota ni nič. V simetričnih molekulah ($\mathrm{CO_2}$, $\mathrm{BF_3}$, $\mathrm{CH_4}$, $\mathrm{CCl_4}$) se izničijo in molekula je nepolarna; v upognjeni $\mathrm{H_2O}$ ali piramidalnem $\mathrm{NH_3}$ se ne.

### Teorija molekulskih orbital

V teoriji MO so **molekulske orbitale** linearne kombinacije atomskih orbital in se raztezajo čez vso molekulo; iz $k$ atomskih orbital nastane $k$ molekulskih. Seštevek atomskih orbital (konstruktivno prekrivanje) da **vezno** orbitalo z nižjo energijo, njuna razlika **protivezno** (oznaka $*$) z višjo. Orbitale polnimo po energiji, s Paulijevim načelom in Hundovim pravilom. Za dvoatomne molekule 2. periode je zaporedje

$$\sigma_{2s} < \sigma^*_{2s} < \sigma_{2p} < \pi_{2p} < \pi^*_{2p} < \sigma^*_{2p} \quad (\mathrm{O_2},\ \mathrm{F_2});$$

pri $\mathrm{B_2}$, $\mathrm{C_2}$ in $\mathrm{N_2}$ leži $\pi_{2p}$ pod $\sigma_{2p}$. **Red vezi** je

$$\text{red vezi} = \tfrac{1}{2}\left(n_{\text{vezni}} - n_{\text{protivezni}}\right).$$

Molekula je obstojna le pri redu vezi večjem od $0$ ($\mathrm{He_2}$ ima red $0$ in ne obstaja); večji red pomeni krajšo in močnejšo vez. Molekula z nesparjenimi elektroni je **paramagnetna**. Za $\mathrm{N_2}$ je red $3$, za $\mathrm{O_2}$ pa $2$, pri čemer ima $\mathrm{O_2}$ dva nesparjena elektrona v orbitalah $\pi^*$: kisik je paramagneten, česar Lewisova struktura z vsemi sparjenimi elektroni ne pojasni.

### Medmolekulske sile

Od najšibkejših do najmočnejših, okvirno:

- **disperzijske (Londonove) sile**: med vsemi molekulami, zaradi trenutnih dipolov; večje z večjim številom elektronov in večjo površino molekule,
- **dipol-dipol**: med polarnimi molekulami,
- **vodikova vez**: ko je vodik vezan na $\mathrm{F}$, $\mathrm{O}$ ali $\mathrm{N}$ in ga privlači nevezni par sosednje molekule ($10$ do $40\,\mathrm{kJ/mol}$),
- **ion-dipol**: pri raztapljanju ionskih snovi v vodi.

Vse so mnogo šibkejše od kovalentnih vezi ($150$ do $1000\,\mathrm{kJ/mol}$). Močnejše medmolekulske sile pomenijo višje vrelišče, višjo površinsko napetost in višjo viskoznost. Propan ($44{,}1\,\mathrm{g/mol}$, le disperzijske sile), dimetil eter ($46{,}1\,\mathrm{g/mol}$, še dipol-dipol) in etanol ($46{,}1\,\mathrm{g/mol}$, še vodikove vezi prek skupine $\mathrm{O{-}H}$) imajo skoraj enake disperzijske sile, a vrelišča $-42\,^\circ\mathrm{C}$, $-24\,^\circ\mathrm{C}$ in $78\,^\circ\mathrm{C}$. Za topnost velja »podobno se topi v podobnem«.

:::premisli
Zdaj se vrni k uganki iz uvoda: zakaj se sladkor raztopi v vodi, olje pa ne, čeprav sladkor ni ionska snov kot sol?
---
Sladkor ima veliko skupin $\mathrm{O{-}H}$ in z vodo tvori vodikove vezi, sol pa se veže z vodo prek sil ion-dipol. Olje je skoraj nepolarno in ima le disperzijske sile; molekule vode raje ostanejo povezane med seboj z vodikovimi vezmi in olje izrinejo.
:::

## Rešeni primeri

### Primer 1 (lažji)

Z elektronegativnostmi razvrsti vezi v kuhinjski soli $\mathrm{NaCl}$, v $\mathrm{HCl}$, $\mathrm{Cl_2}$ in vez $\mathrm{C{-}H}$ v metanu. Elektronegativnosti: $\chi(\mathrm{Na}) = 0{,}93$, $\chi(\mathrm{H}) = 2{,}20$, $\chi(\mathrm{C}) = 2{,}55$, $\chi(\mathrm{Cl}) = 3{,}16$.

**Podatki:** $\chi(\mathrm{Na}) = 0{,}93$, $\chi(\mathrm{H}) = 2{,}20$, $\chi(\mathrm{C}) = 2{,}55$, $\chi(\mathrm{Cl}) = 3{,}16$; vezi $\mathrm{Na{-}Cl}$, $\mathrm{H{-}Cl}$, $\mathrm{Cl{-}Cl}$, $\mathrm{C{-}H}$
**Iščemo:** vrsto vsake vezi in na katerem atomu je delni negativni naboj

:::formula
$\Delta\chi = \chi_{\text{večja}} - \chi_{\text{manjša}}$; $\Delta\chi < 0{,}4$ nepolarna, $0{,}4$ do $1{,}7$ polarna kovalentna, $> 1{,}7$ ionska
:::

**Rešitev:**

1. $\mathrm{NaCl}$: $\Delta\chi = 3{,}16 - 0{,}93 = 2{,}23 > 1{,}7$, ionska vez; klor je anion $\mathrm{Cl^-}$.
2. $\mathrm{HCl}$: $\Delta\chi = 3{,}16 - 2{,}20 = 0{,}96$, polarna kovalentna; $\delta^-$ je na kloru.
3. $\mathrm{Cl_2}$: $\Delta\chi = 0$, nepolarna kovalentna.
4. $\mathrm{C{-}H}$: $\Delta\chi = 2{,}55 - 2{,}20 = 0{,}35 < 0{,}4$, praktično nepolarna.
5. Odgovor: $\mathrm{NaCl}$ ima ionsko vez, $\mathrm{HCl}$ polarno kovalentno (negativni pol na $\mathrm{Cl}$), $\mathrm{Cl_2}$ in $\mathrm{C{-}H}$ pa nepolarni kovalentni vezi.

### Primer 2

Z modelom VSEPR določi obliko, približni kot med vezmi, hibridizacijo osrednjega atoma in polarnost molekul $\mathrm{NH_3}$ in $\mathrm{BF_3}$. Dušik ima $5$, bor $3$, vodik $1$ in fluor $7$ valenčnih elektronov.

**Podatki:** $\mathrm{NH_3}$ in $\mathrm{BF_3}$; valenčni elektroni: $\mathrm{N}$ $5$, $\mathrm{B}$ $3$, $\mathrm{H}$ $1$, $\mathrm{F}$ $7$
**Iščemo:** obliko, kot, hibridizacijo in polarnost obeh molekul

:::formula
Število elektronskih skupin $=$ vezani atomi $+$ nevezni pari; $\mathrm{AX}_m\mathrm{E}_n$; $2 \to sp$, $3 \to sp^2$, $4 \to sp^3$
:::

**Rešitev:**

1. $\mathrm{NH_3}$: $5 + 3 \cdot 1 = 8$ valenčnih elektronov, to so $4$ pari. Trije pari so vezni ($\mathrm{N{-}H}$), en par je nevezen na dušiku: $\mathrm{AX_3E}$.
2. Štiri skupine: tetraedrska razporeditev, hibridizacija $sp^3$. Oblika molekule (samo atomi) je **trigonalna piramida**; nevezni par stisne kot na približno $107^\circ$.
3. Dipoli vezi $\mathrm{N{-}H}$ ($\Delta\chi = 0{,}84$) se v piramidi ne izničijo: $\mathrm{NH_3}$ je **polarna**.
4. $\mathrm{BF_3}$: $3 + 3 \cdot 7 = 24$ elektronov. Tri vezi $\mathrm{B{-}F}$ ($3$ pari), vsak fluor ima $3$ nevezne pare ($9$ parov), skupaj $12$ parov $= 24$ elektronov. Bor nima neveznega para: $\mathrm{AX_3}$.
5. Tri skupine: **trigonalno planarno**, $120^\circ$, hibridizacija $sp^2$; bor ima le $6$ elektronov (nepopoln oktet), prazna orbitala $p$ ga naredi Lewisovo kislino.
6. Trije enaki dipoli pod $120^\circ$ se izničijo: $\mathrm{BF_3}$ je **nepolarna**, čeprav so vezi zelo polarne.
7. Odgovor: $\mathrm{NH_3}$ je polarna trigonalna piramida s koti okoli $107^\circ$ ($sp^3$), $\mathrm{BF_3}$ pa nepolarna trigonalno planarna molekula s koti $120^\circ$ ($sp^2$).

### Primer 3 (težji)

Z Born-Haberjevim ciklom izračunaj mrežno entalpijo natrijevega klorida. Nato izračunaj entalpijo nastanka plinastih ionov $\mathrm{Na^+}$ in $\mathrm{Cl^-}$ iz plinastih atomov in pojasni, zakaj je nastanek $\mathrm{NaCl(s)}$ iz elementov kljub temu eksotermen. Podatki v $\mathrm{kJ/mol}$: sublimacijska entalpija natrija $107$, prva ionizacijska energija natrija $496$, disociacijska energija $\mathrm{Cl_2}$ $242$, entalpija sprejema elektrona klora $-349$, standardna tvorbena entalpija $\mathrm{NaCl(s)}$ $-411$.

**Podatki:** $\Delta H_{\mathrm{sub}}(\mathrm{Na}) = 107\,\mathrm{kJ/mol}$, $I(\mathrm{Na}) = 496\,\mathrm{kJ/mol}$, $D(\mathrm{Cl_2}) = 242\,\mathrm{kJ/mol}$, $\Delta H_{\mathrm{ea}}(\mathrm{Cl}) = -349\,\mathrm{kJ/mol}$, $\Delta H_f^\circ(\mathrm{NaCl}) = -411\,\mathrm{kJ/mol}$
**Iščemo:** $\Delta H_{\mathrm{mr}}(\mathrm{NaCl})$, entalpijo $\mathrm{Na(g) + Cl(g) \to Na^+(g) + Cl^-(g)}$ in razlago

:::formula
$\Delta H_f^\circ = \Delta H_{\mathrm{sub}}(\mathrm{M}) + I(\mathrm{M}) + \tfrac{1}{2}D(\mathrm{X_2}) + \Delta H_{\mathrm{ea}}(\mathrm{X}) + \Delta H_{\mathrm{mr}}$ (Hessov zakon)
:::

**Rešitev:**

1. Pot prek plinastih ionov: $\mathrm{Na(s) \to Na(g)}$ ($+107$), $\mathrm{Na(g) \to Na^+(g) + e^-}$ ($+496$), $\mathrm{\tfrac{1}{2}Cl_2(g) \to Cl(g)}$ ($\tfrac{1}{2} \cdot 242 = +121$; razcepimo le pol mola $\mathrm{Cl_2}$, ker potrebujemo en mol atomov), $\mathrm{Cl(g) + e^- \to Cl^-(g)}$ ($-349$), $\mathrm{Na^+(g) + Cl^-(g) \to NaCl(s)}$ ($\Delta H_{\mathrm{mr}}$).
2. Vsota znanih korakov: $107 + 496 + 121 - 349 = 375\,\mathrm{kJ/mol}$.
3. Iz Hessovega zakona: $\Delta H_{\mathrm{mr}} = -411 - 375 = -786\,\mathrm{kJ/mol}$.
4. Nastanek ionov iz plinastih atomov: $I + \Delta H_{\mathrm{ea}} = 496 - 349 = +147\,\mathrm{kJ/mol}$. Prenos elektrona med izoliranima atomoma je torej endotermen, tudi pri tako ugodnem paru, kot sta natrij in klor.
5. Vsota vseh endotermnih korakov je $107 + 496 + 121 = 724\,\mathrm{kJ/mol}$, sprejem elektrona vrne le $349\,\mathrm{kJ/mol}$. Eksotermnost celotnega procesa da šele privlak ionov v mreži: $|\Delta H_{\mathrm{mr}}| = 786\,\mathrm{kJ/mol}$ preseže neto strošek $375\,\mathrm{kJ/mol}$ za $411\,\mathrm{kJ/mol}$.
6. Odgovor: mrežna entalpija $\mathrm{NaCl}$ je $-786\,\mathrm{kJ/mol}$; nastanek plinastih ionov iz atomov stane $+147\,\mathrm{kJ/mol}$, ionska spojina je obstojna zaradi velike mrežne entalpije.

### Primer 4 – zdaj ti

V molekulah saharoze so vezi $\mathrm{C{-}H}$, $\mathrm{C{-}O}$ in $\mathrm{O{-}H}$. Razvrsti jih po polarnosti in pojasni, katere sile povežejo sladkor z vodo. Elektronegativnosti: $\chi(\mathrm{H}) = 2{,}20$, $\chi(\mathrm{C}) = 2{,}55$, $\chi(\mathrm{O}) = 3{,}44$.

**Podatki:** $\chi(\mathrm{H}) = 2{,}20$, $\chi(\mathrm{C}) = 2{,}55$, $\chi(\mathrm{O}) = 3{,}44$; vezi $\mathrm{C{-}H}$, $\mathrm{C{-}O}$, $\mathrm{O{-}H}$
**Iščemo:** vrstni red polarnosti vezi in vrsto sil med sladkorjem in vodo

:::formula
$\Delta\chi = \chi_{\text{večja}} - \chi_{\text{manjša}}$; vodikova vez nastane, ko je $\mathrm{H}$ vezan na $\mathrm{O}$, $\mathrm{N}$ ali $\mathrm{F}$
:::

**Rešitev:**

1. $\mathrm{C{-}H}$: $\Delta\chi = 2{,}55 - 2{,}20 = 0{,}35$, praktično nepolarna, ker je razlika pod mejo $0{,}4$.
2. $\mathrm{C{-}O}$: $\Delta\chi = 3{,}44 - 2{,}55 = 0{,}89$, polarna kovalentna; $\delta^-$ je na kisiku, ker ta močneje privlači skupni par.
3. Izračunaj še $\Delta\chi$ za $\mathrm{O{-}H}$ in sklepaj, katere sile povežejo sladkor z vodo, nato preveri:

:::premisli
Katera vez je najbolj polarna in kakšne sile nastanejo med molekulami sladkorja in vode?
---
$\mathrm{O{-}H}$: $\Delta\chi = 3{,}44 - 2{,}20 = 1{,}24$, najbolj polarna vez (vrstni red $\mathrm{O{-}H} > \mathrm{C{-}O} > \mathrm{C{-}H}$). Ker je vodik vezan na kisik, skupine $\mathrm{O{-}H}$ sladkorja tvorijo vodikove vezi z vodo; zato se sladkor raztaplja.
:::

## Pogoste napake

- **Mešanje vezi in medmolekulskih sil.** Pri vrenju vode se ne pretrgajo vezi $\mathrm{O{-}H}$ v molekuli, ampak vodikove vezi **med** molekulami.
- **Polarne vezi pomenijo polarno molekulo.** $\mathrm{CO_2}$ in $\mathrm{CCl_4}$ imata polarne vezi, a sta zaradi simetrije nepolarni.
- **Dvojna vez šteje kot dve skupini.** Pri VSEPR je večkratna vez ena sama skupina; $\mathrm{CO_2}$ ima okoli ogljika dve skupini in je linearen ($sp$).
- **Vodikova vez z vodikom na ogljiku.** $\mathrm{CH_4}$ ali $\mathrm{CH_3OCH_3}$ ne tvorita vodikovih vezi; vodik mora biti vezan na $\mathrm{F}$, $\mathrm{O}$ ali $\mathrm{N}$.

## Povzetek

- $\Delta\chi$ okvirno loči nepolarno ($< 0{,}4$), polarno kovalentno ($0{,}4$ do $1{,}7$) in ionsko vez ($> 1{,}7$).
- Ionska vez: elektrostatski privlak ionov v mreži; mrežna energija raste z naboji in pada z velikostjo ionov.
- Kovalentna vez: skupni elektronski pari; Lewisova struktura, formalni naboj, red vezi (večji red: krajša in močnejša vez).
- VSEPR: število skupin $2, 3, 4$ da linearno ($180^\circ$), trigonalno planarno ($120^\circ$), tetraedrsko ($109{,}5^\circ$) razporeditev; nevezni pari spremenijo obliko in stisnejo kote.
- Hibridizacija $sp$, $sp^2$, $sp^3$ ustreza $2$, $3$, $4$ skupinam; enojna vez je $\sigma$, dvojna $\sigma + \pi$, trojna $\sigma + 2\pi$.
- Medmolekulske sile: disperzijske $<$ dipol-dipol $<$ vodikove vezi; določajo vrelišča in topnost.
- Born-Haberjev cikel (Hessov zakon) da mrežno entalpijo; teorija MO: red vezi $\tfrac{1}{2}(n_{\text{vezni}} - n_{\text{protivezni}})$, nesparjeni elektroni pomenijo paramagnetnost.

## Za izpit

Znati moraš povedati:

- definicijo elektronegativnosti in okvirne meje $\Delta\chi$ med nepolarno, polarno kovalentno in ionsko vezjo;
- definicijo mrežne entalpije, njeno odvisnost od nabojev in polmerov ionov (Coulombov zakon) ter izpeljavo Born-Haberjevega cikla iz Hessovega zakona;
- postopek za Lewisovo strukturo, definicijo formalnega naboja in pomen resonance (povprečni red vezi);
- pravila VSEPR za $2$ do $6$ elektronskih skupin z neveznimi pari, ustrezno hibridizacijo ter vezi $\sigma$ in $\pi$;
- pogoj za polarno molekulo (vektorska vsota dipolnih momentov, $\mu = q d$) in vpliv medmolekulskih sil na vrelišče in topnost;
- red vezi po teoriji MO, zaporedje orbital za dvoatomne molekule 2. periode in sklep o paramagnetnosti.

### Naloga 1

Drugo entalpijo sprejema elektrona kisika, $\mathrm{O^-(g) + e^- \to O^{2-}(g)}$, ne moremo izmeriti. Izračunaj jo z Born-Haberjevim ciklom za $\mathrm{MgO}$ in pojasni njen predznak. Nato utemelji, zakaj nastane $\mathrm{Mg^{2+}O^{2-}}$ in ne $\mathrm{Mg^+O^-}$. Podatki v $\mathrm{kJ/mol}$: $\Delta H_f^\circ(\mathrm{MgO}) = -602$, $\Delta H_{\mathrm{sub}}(\mathrm{Mg}) = 148$, $I_1(\mathrm{Mg}) = 738$, $I_2(\mathrm{Mg}) = 1451$, $D(\mathrm{O_2}) = 498$, $\Delta H_{\mathrm{ea},1}(\mathrm{O}) = -141$, $\Delta H_{\mathrm{mr}}(\mathrm{MgO}) = -3850$.

**Rešitev:**

1. Koraki cikla: $\mathrm{Mg(s) \to Mg(g)}$ ($+148$), $\mathrm{Mg(g) \to Mg^+(g)}$ ($+738$), $\mathrm{Mg^+(g) \to Mg^{2+}(g)}$ ($+1451$), $\mathrm{\tfrac{1}{2}O_2 \to O(g)}$ ($\tfrac{1}{2} \cdot 498 = +249$), $\mathrm{O \to O^-}$ ($-141$), $\mathrm{O^- \to O^{2-}}$ ($\Delta H_{\mathrm{ea},2}$), $\mathrm{Mg^{2+}(g) + O^{2-}(g) \to MgO(s)}$ ($-3850$).
2. Hessov zakon: $-602 = 148 + 738 + 1451 + 249 - 141 + \Delta H_{\mathrm{ea},2} - 3850$.
3. Vsota znanih korakov brez mreže: $148 + 738 + 1451 + 249 - 141 = 2445\,\mathrm{kJ/mol}$; z mrežo $2445 - 3850 = -1405\,\mathrm{kJ/mol}$.
4. $\Delta H_{\mathrm{ea},2} = -602 + 1405 = +803\,\mathrm{kJ/mol}$.
5. Predznak: drugi elektron dodajamo že negativnemu ionu $\mathrm{O^-}$, ki ga odbija, zato je proces močno endotermen; ion $\mathrm{O^{2-}}$ v plinu ni obstojen, stabilizira ga šele mreža.
6. Dodatni strošek za $\mathrm{Mg^{2+}O^{2-}}$ glede na $\mathrm{Mg^+O^-}$ je $I_2 + \Delta H_{\mathrm{ea},2} = 1451 + 803 = 2254\,\mathrm{kJ/mol}$. Produkt nabojev pa je $4$ namesto $1$, zato je mrežna entalpija po Coulombovem zakonu grobo $4$-krat večja: za $\mathrm{Mg^+O^-}$ bi bila okoli $-3850/4 \approx -963\,\mathrm{kJ/mol}$, dobitek $3850 - 963 = 2887\,\mathrm{kJ/mol}$ pa preseže strošek.
7. Odgovor: $\Delta H_{\mathrm{ea},2}(\mathrm{O}) \approx +803\,\mathrm{kJ/mol}$; kljub temu nastane $\mathrm{Mg^{2+}O^{2-}}$, ker mreža dvakrat nabitih ionov sprosti veliko več energije, kot stane drugi elektron.

### Naloga 2

Z diagramom molekulskih orbital izpelji konfiguracijo valenčnih elektronov in red vezi za $\mathrm{O_2^+}$, $\mathrm{O_2}$, $\mathrm{O_2^-}$ in $\mathrm{O_2^{2-}}$. Razvrsti delce po dolžini vezi, utemelji, kateri so paramagnetni, in pojasni, zakaj paramagnetizma $\mathrm{O_2}$ ne napove Lewisova struktura.

**Rešitev:**

1. Kisik ima $6$ valenčnih elektronov, $\mathrm{O_2}$ torej $12$; $\mathrm{O_2^+}$ ima $11$, $\mathrm{O_2^-}$ $13$, $\mathrm{O_2^{2-}}$ $14$. Zaporedje za $\mathrm{O_2}$: $\sigma_{2s} < \sigma^*_{2s} < \sigma_{2p} < \pi_{2p} < \pi^*_{2p} < \sigma^*_{2p}$.
2. $\mathrm{O_2}$: $(\sigma_{2s})^2(\sigma^*_{2s})^2(\sigma_{2p})^2(\pi_{2p})^4(\pi^*_{2p})^2$. Veznih je $8$, protiveznih $4$: red vezi $\tfrac{1}{2}(8 - 4) = 2$. Dva elektrona v dveh enakovrednih orbitalah $\pi^*$ sta po Hundovem pravilu nesparjena.
3. Razlike so le v $\pi^*$: $\mathrm{O_2^+}$ $(\pi^*)^1$, red $\tfrac{1}{2}(8 - 3) = 2{,}5$; $\mathrm{O_2^-}$ $(\pi^*)^3$, red $\tfrac{1}{2}(8 - 5) = 1{,}5$; $\mathrm{O_2^{2-}}$ $(\pi^*)^4$, red $\tfrac{1}{2}(8 - 6) = 1$.
4. Večji red pomeni krajšo vez: $\mathrm{O_2^+} < \mathrm{O_2} < \mathrm{O_2^-} < \mathrm{O_2^{2-}}$ (od najkrajše do najdaljše).
5. Nesparjeni elektroni: $\mathrm{O_2^+}$ $1$, $\mathrm{O_2}$ $2$, $\mathrm{O_2^-}$ $1$, $\mathrm{O_2^{2-}}$ $0$. Paramagnetni so prvi trije, peroksidni ion je diamagneten.
6. Lewisova struktura $\mathrm{O{=}O}$ ima vse elektrone v parih (dva vezna in štiri nevezne), ker obravnava pare lokalizirano; delokalizirani orbitali $\pi^*$ z enako energijo, ki ju elektrona zasedeta posamično, pozna šele teorija MO.
7. Odgovor: redi vezi so $2{,}5$; $2$; $1{,}5$; $1$, dolžina vezi narašča v tem vrstnem redu, paramagnetni so $\mathrm{O_2^+}$, $\mathrm{O_2}$ in $\mathrm{O_2^-}$.

## Drugače: Na sliki

| Zapis | Oblika, kot | Hibridizacija | Primer |
|---|---|---|---|
| $\mathrm{AX_2}$ | linearna, $180^\circ$ | $sp$ | $\mathrm{CO_2}$ |
| $\mathrm{AX_3}$ | trigonalno planarna, $120^\circ$ | $sp^2$ | $\mathrm{BF_3}$ |
| $\mathrm{AX_2E}$ | kotna, pod $120^\circ$ | $sp^2$ | $\mathrm{SO_2}$ |
| $\mathrm{AX_4}$ | tetraedrska, $109{,}5^\circ$ | $sp^3$ | $\mathrm{CH_4}$ |
| $\mathrm{AX_3E}$ | trigonalna piramida, okoli $107^\circ$ | $sp^3$ | $\mathrm{NH_3}$ |
| $\mathrm{AX_2E_2}$ | kotna, okoli $104{,}5^\circ$ | $sp^3$ | $\mathrm{H_2O}$ |

## Drugače: Uporaba v stroki

**Kromatografija.** Pri HPLC z obrnjenimi fazami je stacionarna faza nepolarna (verige $\mathrm{C_{18}}$), mobilna pa polarna (voda z metanolom). Polarne snovi se eluirajo prej.

**Molekularna biologija.** Par gvanin-citozin tvori tri vodikove vezi, adenin-timin dve; DNA z več $\mathrm{G{-}C}$ se tali pri višji temperaturi, kar upoštevamo pri načrtovanju začetnih oligonukleotidov za PCR.

**Ognjevzdržni materiali.** $\mathrm{MgO}$ ima zaradi nabojev $2+$ in $2-$ in majhnih ionov okoli $5$-krat večjo mrežno entalpijo kot $\mathrm{NaCl}$ in tališče nad $2800\,^\circ\mathrm{C}$: obloge talilnih peči.

**Spektroskopija IR.** Večji red vezi pomeni višje valovno število nihanja: $\mathrm{C{=}O}$ okoli $1700\,\mathrm{cm^{-1}}$, $\mathrm{C{\equiv}N}$ okoli $2250\,\mathrm{cm^{-1}}$.

## Drugače: Bolj natančno

**Delež ionskega značaja.** Paulingova ocena deleža ionskega značaja je $1 - e^{-(\Delta\chi)^2/4}$. Za $\mathrm{HCl}$ ($\Delta\chi = 0{,}96$) dobimo okoli $21\,\%$, za $\mathrm{NaCl}$ ($\Delta\chi = 2{,}23$) okoli $71\,\%$. Meja $1{,}7$ ustreza približno $50\,\%$.

**Mešanje $s$ in $p$.** Pri $\mathrm{B_2}$, $\mathrm{C_2}$ in $\mathrm{N_2}$ se orbitali $2s$ in $2p$ mešata, kar dvigne $\sigma_{2p}$ nad $\pi_{2p}$. Zato je $\mathrm{B_2}$ paramagneten, čeprav bi brez mešanja pričakovali sparjena elektrona.

## Preveri se

? Kakšna je oblika molekule vode?
- linearna
~ Upoštevaš le dve vezi in pozabiš na dva nevezna para kisika; ta odbijata vezi in molekulo upogneta.
+ kotna (upognjena)
- trigonalno planarna
~ Trigonalna oblika zahteva tri skupine; kisik jih ima štiri (dve vezi in dva nevezna para).
> Kisik ima dve vezi in dva nevezna para ($\mathrm{AX_2E_2}$): elektronske skupine so razporejene tetraedrsko, atomi pa tvorijo kotno obliko s kotom okoli $104{,}5^\circ$.

? Kakšna je hibridizacija ogljika v $\mathrm{CO_2}$?
+ $sp$
- $sp^2$
~ Dvojna vez te spomni na eten ($sp^2$), a hibridizacijo določa število skupin okoli ogljika, tu sta le dve.
- $sp^3$
~ Vsako dvojno vez si štel kot dve skupini; pri VSEPR je večkratna vez ena sama skupina.
> Ogljik ima dve elektronski skupini (dve dvojni vezi, vsaka šteje enkrat), zato je linearen in $sp$ hibridiziran.

? Med molekulami katere snovi delujejo vodikove vezi?
- $\mathrm{CH_4}$
~ Metan ima veliko vodikov, a so vezani na ogljik; vez $\mathrm{C{-}H}$ je skoraj nepolarna in vodik skoraj nima delnega pozitivnega naboja.
- $\mathrm{CCl_4}$
~ Vezi $\mathrm{C{-}Cl}$ so polarne, a molekula je simetrična in sploh nima vodika; med molekulami delujejo le disperzijske sile.
+ $\mathrm{CH_3OH}$
> Metanol ima vodik, vezan na kisik. V $\mathrm{CH_4}$ in $\mathrm{CCl_4}$ ni vezi $\mathrm{O{-}H}$, $\mathrm{N{-}H}$ ali $\mathrm{F{-}H}$.

? Katera molekula je nepolarna, čeprav ima polarne vezi?
- $\mathrm{H_2O}$
~ Vezi $\mathrm{O{-}H}$ so res polarne, a voda je upognjena, zato se dipola seštejeta in molekula je polarna.
+ $\mathrm{CO_2}$
- $\mathrm{NH_3}$
~ Trije enaki atomi zvenijo simetrično, a nevezni par naredi piramido; dipoli kažejo vsi na isto stran in se ne izničijo.
> V linearni molekuli $\mathrm{CO_2}$ sta dipola vezi $\mathrm{C{=}O}$ nasprotno usmerjena in se izničita.

:::simboli
\Delta H_f | standardna tvorbena entalpija spojine | | kJ/mol
\Delta H_{\mathrm{sub}} | sublimacijska entalpija kovine | | kJ/mol | pozitivna
I | ionizacijska energija | | kJ/mol | I₁, I₂: prva in druga
D | disociacijska energija vezi | | kJ/mol | pri X₂ uporabimo ½D
\Delta H_{\mathrm{ea}} | entalpija sprejema elektrona | | kJ/mol | prvi sprejem običajno negativen, drugi pozitiven
\Delta H_{\mathrm{mr}} | mrežna entalpija | \Delta H_f^\circ = \Delta H_{\mathrm{sub}} + I + \tfrac{1}{2}D + \Delta H_{\mathrm{ea}} + \Delta H_{\mathrm{mr}} | kJ/mol | negativna
\mu | dipolni moment | \mu = q d | C m | 1 D = 3,336·10⁻³⁰ C m
\sigma | vez sigma (prekrivanje vzdolž osi) | | |
\sigma_{2s}, \sigma_{2p} | vezni molekulski orbitali sigma | | | z * protivezni
\pi_{2p} | vezni molekulski orbitali pi | | | z * protivezni
\mathrm{FN} | formalni naboj atoma | \mathrm{FN} = (\text{valenčni } e^-) - (\text{nevezni } e^-) - \tfrac{1}{2}(\text{vezni } e^-) | – | najboljša struktura ima naboje čim bližje nič
e | elektron | | | v Paulingovi oceni je e osnova naravnega logaritma
n_{\text{vezni}} | število elektronov v veznih orbitalah | | –
n_{\text{protivezni}} | število elektronov v protiveznih orbitalah | | –
\chi | elektronegativnost | | –
\Delta\chi | razlika elektronegativnosti vezanih atomov | \Delta\chi = \chi_{\text{večja}} - \chi_{\text{manjša}} | – | pod 0,4 nepolarna, nad 1,7 ionska vez
\chi_{\text{večja}} | večja elektronegativnost vezanih atomov | | –
\chi_{\text{manjša}} | manjša elektronegativnost vezanih atomov | | –
s | orbitala tipa s | | | v oznakah hibridizacije sp, sp², sp³
p | orbitala tipa p | | | eksponent pove število vključenih orbital p
:::
