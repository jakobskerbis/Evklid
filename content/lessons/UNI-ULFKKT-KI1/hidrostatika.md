---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Potapljač se na vdih spusti na dno $5\,\mathrm{m}$ globokega skakalnega bazena in začne ga boleti v ušesih. Na isti globini v jezeru čuti skoraj natanko enako bolečino, čeprav je jezero tisočkrat večje.

Vaterpolist potisne žogo pod vodo in jo spusti. Žoga izstreli iz vode, kot bi jo nekdo brcnil od spodaj.

Obe situaciji skrivata isto idejo: **tlak v mirujoči tekočini raste z globino in je odvisen samo od globine**. Bolečina v ušesu je razlika tlakov na bobniču. Žogo pa potiska navzgor razlika tlakov med njenim spodnjim in zgornjim delom. V procesnem inženirstvu ista ideja določa debelino sten rezervoarjev, silo na lopute in okna, odčitke manometrov in plavanje merilnih plovcev.

## Razlaga

**1. En konkreten primer.** Vzemimo bazen, globok $2\,\mathrm{m}$. Na dnu si zamislimo kvadrat s ploščino $1\,\mathrm{m^2}$ in nad njim navpičen stolpec vode do gladine.

- Prostornina stolpca: $1\,\mathrm{m^2} \cdot 2\,\mathrm{m} = 2\,\mathrm{m^3}$.
- Masa: $1000\,\mathrm{kg/m^3} \cdot 2\,\mathrm{m^3} = 2000\,\mathrm{kg}$.
- Teža: $2000\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} = 19\,620\,\mathrm{N}$.

Stolpec miruje, zato mora dno nanj delovati s silo $19\,620\,\mathrm{N}$ navzgor. Voda torej pritiska na kvadrat z $19\,620\,\mathrm{N}$. **Tlak** je sila na enoto ploskve, $p = F/A$, torej $19\,620\,\mathrm{Pa}$. Nad gladino je še zrak z zračnim tlakom $p_0 \approx 101\,325\,\mathrm{Pa}$, ki se prenese skozi vodo. Skupaj: $120\,945\,\mathrm{Pa}$, okoli $1{,}21\,\mathrm{bar}$.

**2. Posplošitev na poljubno globino.** Namesto $2\,\mathrm{m}$ vzemimo globino $h$, namesto vode tekočino z gostoto $\rho$ in ploskev $A$. Teža stolpca je $\rho \, g \, h A$. Delimo z $A$:

$$p = p_0 + \rho g h$$

Ploščina se je pokrajšala. Tlak ni odvisen od tega, kako velik je bazen, ampak le od globine pod gladino in od gostote tekočine. Člen $\rho g h$ imenujemo **hidrostatični tlak**.

**Osnovna enačba hidrostatike.** Naj tekočina miruje v homogenem težnostnem polju (os $z$ navpično navzgor). Potem velja

$$\frac{\mathrm{d}p}{\mathrm{d}z} = -\rho g, \qquad \frac{\partial p}{\partial x} = \frac{\partial p}{\partial y} = 0.$$

*Izpeljava.* Na kvader tekočine z dnom $\mathrm{d}A$ in višino $\mathrm{d}z$ delujejo tlačna sila od spodaj $p\,\mathrm{d}A$, od zgoraj $(p + \mathrm{d}p)\,\mathrm{d}A$ in teža $\rho g\,\mathrm{d}A\,\mathrm{d}z$. V mirovanju je vsota nič, po krajšanju z $\mathrm{d}A$ ostane $\mathrm{d}p = -\rho g\,\mathrm{d}z$; vodoravno teže ni, zato se tlak vodoravno ne spreminja. Če je $\rho$ stalna (nestisljiva tekočina), integracija od gladine s tlakom $p_0$ navzdol do globine $h$ da $p = p_0 + \rho g h$.

*Posledica.* V povezani mirujoči tekočini iste gostote je tlak na isti višini povsod enak (vezne posode). Pri U-cevnem manometru z merilno tekočino gostote $\rho_\mathrm{m}$, priključenem na dve točki na isti višini v tekočini gostote $\rho$, od tod sledi $p_1 - p_2 = (\rho_\mathrm{m} - \rho)\,g\,\Delta h$, kjer je $\Delta h$ razlika gladin merilne tekočine.

:::premisli
Steklenica ima dno s ploščino $1\,\mathrm{m^2}$ in ozko grlo. Voda v njej sega do višine $5\,\mathrm{m}$, a je zaradi zožitve v njej le $1\,\mathrm{m^3}$ vode. Je sila vode na dno večja, manjša ali enaka teži te vode? Napovej, preden pogledaš.
---
Večja, kar petkrat. Tlak na dnu je $\rho g h$ kot v jezeru, globokem $5\,\mathrm{m}$, zato je sila na dno $\rho g h A$, enaka teži stolpca $5\,\mathrm{m^3}$ vode. Razliko prevzamejo poševne stene: voda nanje pritiska pravokotno, torej deloma navzgor, stene pa vodo enako močno potiskajo navzdol. Šteje globina, ne količina vode.
:::

**3. Tlak deluje v vse smeri.** Tekočina v mirovanju ne prenaša strižnih sil (sil vzdolž ploskve), saj bi jo te takoj premaknile. Zato tlak v neki točki deluje enako na ploskev v vsaki legi in vedno pravokotno nanjo. Bobnič potapljača čuti enak tlak, ne glede na to, kako obrne glavo.

*Dokaz.* Vzemimo majhno trikotno prizmo tekočine z vodoravno stranico $\mathrm{d}x$, navpično $\mathrm{d}z$ in poševno ploskvijo dolžine $\mathrm{d}s$ pod poljubnim kotom $\alpha$ proti vodoravnici; globina prizme je $\mathrm{d}y$, tlaki na ploskve so $p_x$, $p_z$, $p_s$. Ker je $\mathrm{d}s\sin\alpha = \mathrm{d}z$ in $\mathrm{d}s\cos\alpha = \mathrm{d}x$, da ravnovesje v smeri $x$: $p_x\,\mathrm{d}z\,\mathrm{d}y = p_s\,\mathrm{d}s\sin\alpha\,\mathrm{d}y$, torej $p_x = p_s$. V smeri $z$: $p_z\,\mathrm{d}x\,\mathrm{d}y = p_s\,\mathrm{d}s\cos\alpha\,\mathrm{d}y + \tfrac12\rho g\,\mathrm{d}x\,\mathrm{d}z\,\mathrm{d}y$, torej $p_z = p_s + \tfrac12\rho g\,\mathrm{d}z \to p_s$, ko prizmo skrčimo v točko. Ker je $\alpha$ poljuben, je tlak v točki neodvisen od smeri. $\square$

Sprememba tlaka na gladini se prenese v vse točke tekočine (**Pascalov zakon**); na tem delujejo hidravlične stiskalnice.

**4. Absolutni tlak in nadtlak.** Večina merilnikov meri razliko do okoliškega zraka: to je **nadtlak** $p_\mathrm{n} = p - p_0 = \rho g h$. **Absolutni tlak** $p$ šteje od vakuuma. Merilnik v pnevmatiki kolesa, ki kaže $4\,\mathrm{bar}$, pomeni okoli $5\,\mathrm{bar}$ absolutno. Enote: $1\,\mathrm{bar} = 10^5\,\mathrm{Pa}$. Pri vodi vsakih $10\,\mathrm{m}$ globine doda približno $1\,\mathrm{bar}$.

Kako to izgleda v vodi:

| Globina $h$ | Nadtlak $\rho g h$ | Absolutni tlak |
|---|---|---|
| $0\,\mathrm{m}$ | $0$ | $\approx 1{,}0\,\mathrm{bar}$ |
| $2\,\mathrm{m}$ | $\approx 0{,}2\,\mathrm{bar}$ | $\approx 1{,}2\,\mathrm{bar}$ |
| $10\,\mathrm{m}$ | $\approx 1{,}0\,\mathrm{bar}$ | $\approx 2{,}0\,\mathrm{bar}$ |

**5. Sila na ravno ploskev.** Na vodoravno ploskev (dno) je tlak povsod enak, zato je sila $F = pA$. Na navpično steno pa tlak z globino linearno narašča. Ker je odvisnost linearna, je povprečni tlak na ploskvi enak tlaku v njenem **težišču**. Rezultanta nadtlaka na ravno ploskev je zato

$$F = \rho g h_\mathrm{T} A,$$

kjer je $h_\mathrm{T}$ globina težišča ploskve. Zračni tlak navadno ne šteje, ker deluje tudi z druge strani stene. Rezultanta prijemlje nekoliko globlje od težišča (v **središču tlaka**), ker spodnji del ploskve nosi večji tlak.

*Izpeljava.* Naj bo ravna ploskev $A$ nagnjena pod kotom $\theta$ proti gladini; razdaljo $y$ merimo vzdolž ploskve od presečišča z gladino, globina je $h = y\sin\theta$. Vse sile $\rho g h\,\mathrm{d}A$ so pravokotne na ploskev, zato jih seštejemo kot števila: $F = \rho g \sin\theta \int_A y\,\mathrm{d}A = \rho g \sin\theta\, y_\mathrm{T} A = \rho g h_\mathrm{T} A$, ker je po definiciji težišča $\int_A y\,\mathrm{d}A = y_\mathrm{T} A$. Moment okoli presečišča z gladino: $F y_\mathrm{P} = \rho g \sin\theta \int_A y^2\,\mathrm{d}A = \rho g \sin\theta\,(I_\mathrm{T} + y_\mathrm{T}^2 A)$ po Steinerjevem izreku, kjer je $I_\mathrm{T}$ ploskovni vztrajnostni moment okoli vodoravne osi skozi težišče. Deljenje s $F$ da

$$y_\mathrm{P} = y_\mathrm{T} + \frac{I_\mathrm{T}}{y_\mathrm{T} A}.$$

:::premisli
Opazovalno okno, visoko $0{,}8\,\mathrm{m}$, v steni bazena prestavimo za $2\,\mathrm{m}$ globlje, tako da je njegov zgornji rob namesto na $2\,\mathrm{m}$ na $4\,\mathrm{m}$. Ali se sila vode na okno podvoji?
---
Ne. Sila je sorazmerna z globino težišča, ne z globino zgornjega roba. Težišče se premakne z $2{,}4\,\mathrm{m}$ na $4{,}4\,\mathrm{m}$, sila naraste za faktor $4{,}4/2{,}4 \approx 1{,}83$.
:::

**6. Vzgon.** Potopimo kocko z robom $a$. Sili tlaka na nasprotni stranski ploskvi se izničita. Spodnja ploskev je za $a$ globlje od zgornje, zato je tlak nanjo za $\rho g a$ večji. Razlika sil je

$$F_\mathrm{vz} = \rho g a \cdot a^2 = \rho g V.$$

To je **vzgon**: enak je teži izpodrinjene tekočine (**Arhimedov zakon**). Natančno: naj bo telo s prostornino $V$ v mirujoči tekočini s stalno gostoto $\rho$ in naj tekočina obdaja vso njegovo površino. Potem je rezultanta tlačnih sil nanj navpično navzgor, $F_\mathrm{vz} = \rho g V$, in prijemlje v težišču izpodrinjene tekočine (**središče vzgona**).

*Dokaz za poljubno obliko.* Telo v mislih zamenjamo s tekočino enake oblike. Ta miruje, zato rezultanta tlačnih sil nanjo uravnoteži njeno težo $\rho g V$ in poteka skozi njeno težišče. Tlak v točkah površine je odvisen le od njihove globine, ne od tega, kaj je znotraj, zato na telo deluje natanko ista rezultanta. (Enako sledi, če telo razrežemo na tanke navpične stolpce in za vsakega ponovimo račun s kocko.)

Vzgon je odvisen od gostote tekočine in prostornine potopljenega dela, ne od gostote telesa. Telo plava, če je njegova povprečna gostota $\bar\rho$ manjša od gostote tekočine. Tedaj se potopi le toliko, da vzgon potopljenega dela uravnoteži težo: $\rho g V_\mathrm{pot} = \bar\rho g V$, torej $V_\mathrm{pot}/V = \bar\rho/\rho$.

## Rešeni primeri

### Primer 1 (lažji): dno skakalnega bazena

Skakalni bazen je globok $5{,}0\,\mathrm{m}$. Kolikšna sta nadtlak in absolutni tlak na dnu?

**Podatki:** $h = 5{,}0\,\mathrm{m}$, $\rho = 1000\,\mathrm{kg/m^3}$, $g = 9{,}81\,\mathrm{m/s^2}$, $p_0 = 101\,325\,\mathrm{Pa}$
**Iščemo:** nadtlak $p_\mathrm{n}$ in absolutni tlak $p$

:::formula
$p_\mathrm{n} = \rho g h$, $\quad p = p_0 + \rho g h$
:::

**Rešitev:**

1. Nadtlak: $p_\mathrm{n} = 1000\,\mathrm{kg/m^3} \cdot 9{,}81\,\mathrm{m/s^2} \cdot 5{,}0\,\mathrm{m} = 49\,050\,\mathrm{Pa}$.
2. Prištejemo zračni tlak, ker na gladino pritiska atmosfera: $101\,325 + 49\,050 = 150\,375$, torej $p = 150\,375\,\mathrm{Pa}$.
3. Odgovor: nadtlak na dnu je okoli $49\,\mathrm{kPa}$ ($0{,}49\,\mathrm{bar}$), absolutni tlak okoli $1{,}50\,\mathrm{bar}$.

### Primer 2: opazovalno okno v steni bazena

Trener snema skakalce skozi pravokotno okno v navpični steni bazena. Okno je široko $1{,}2\,\mathrm{m}$ in visoko $0{,}8\,\mathrm{m}$, zgornji rob je $2{,}0\,\mathrm{m}$ pod gladino. S kolikšno silo voda pritiska na okno?

**Podatki:** $b = 1{,}2\,\mathrm{m}$, $a = 0{,}8\,\mathrm{m}$, globina zgornjega roba $h_1 = 2{,}0\,\mathrm{m}$, $\rho = 1000\,\mathrm{kg/m^3}$, $g = 9{,}81\,\mathrm{m/s^2}$; za oknom je zrak z istim $p_0$
**Iščemo:** silo nadtlaka $F$

:::formula
$F = \rho g h_\mathrm{T} A$, $\quad h_\mathrm{T} = h_1 + \dfrac{a}{2}$, $\quad A = a b$
:::

**Rešitev:**

1. Ploščina okna: $A = 0{,}8 \cdot 1{,}2 = 0{,}96$, torej $0{,}96\,\mathrm{m^2}$.
2. Težišče pravokotnika je na polovici višine: $h_\mathrm{T} = 2{,}0 + 0{,}4 = 2{,}4$, torej $2{,}4\,\mathrm{m}$.
3. Tlak v težišču: $\rho g h_\mathrm{T} = 1000 \cdot 9{,}81 \cdot 2{,}4 = 23\,544$, torej $23\,544\,\mathrm{Pa}$.
4. Sila: $F = 23\,544\,\mathrm{Pa} \cdot 0{,}96\,\mathrm{m^2} \approx 22\,602\,\mathrm{N}$. Zračni tlak ne šteje, ker deluje z obeh strani.
5. Odgovor: voda pritiska na okno s silo okoli $22{,}6\,\mathrm{kN}$, kar je teža približno $2{,}3$ tone.

### Primer 3 (težji): vaterpolska žoga pod vodo

Vaterpolska žoga ima premer $22\,\mathrm{cm}$ in maso $0{,}43\,\mathrm{kg}$. (a) S kolikšno silo jo mora igralec držati, da ostane v celoti pod vodo in miruje? (b) Kolikšen del prostornine žoge je pod vodo, ko prosto plava? (c) Kolikšna je najmanjša masa svinčene uteži ($\rho_\mathrm{Pb} = 11\,340\,\mathrm{kg/m^3}$), ki jo moramo privezati na žogo, da ta brez roke ostane v celoti pod vodo?

**Podatki:** $d = 22\,\mathrm{cm}$, $m = 0{,}43\,\mathrm{kg}$, $\rho = 1000\,\mathrm{kg/m^3}$, $\rho_\mathrm{Pb} = 11\,340\,\mathrm{kg/m^3}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** silo roke $F$, delež potopljene prostornine $V_\mathrm{pot}/V$, maso uteži $m_\mathrm{Pb}$

:::formula
$V = \dfrac{4}{3}\pi r^3$, $\quad F_\mathrm{vz} = \rho g V$, $\quad F = F_\mathrm{vz} - m g$

$\dfrac{V_\mathrm{pot}}{V} = \dfrac{m}{\rho V}$, $\quad (m + m_\mathrm{Pb})\,g = \rho g \left(V + \dfrac{m_\mathrm{Pb}}{\rho_\mathrm{Pb}}\right)$
:::

**Rešitev:**

1. Polmer v metrih: $r = 0{,}11\,\mathrm{m}$.
2. Prostornina: $V = \dfrac{4}{3}\pi (0{,}11\,\mathrm{m})^3 \approx 5{,}575 \cdot 10^{-3}\,\mathrm{m^3}$ (okoli $5{,}6$ litra).
3. Vzgon: $F_\mathrm{vz} = 1000 \cdot 9{,}81 \cdot 5{,}575 \cdot 10^{-3}\,\mathrm{N} \approx 54{,}7\,\mathrm{N}$.
4. Teža žoge: $0{,}43 \cdot 9{,}81 = 4{,}2183$, torej $4{,}22\,\mathrm{N}$.
5. Žoga miruje, zato je vsota sil nič: roka potiska navzdol s $F = 54{,}7\,\mathrm{N} - 4{,}2\,\mathrm{N} \approx 50{,}5\,\mathrm{N}$.
6. Prosto plavajoča žoga: vzgon potopljenega dela je enak teži, $\rho V_\mathrm{pot} = m$, zato $\dfrac{V_\mathrm{pot}}{V} = \dfrac{0{,}43}{1000 \cdot 5{,}575 \cdot 10^{-3}} \approx 0{,}077$.
7. Utež: na sistem žoga + utež deluje vzgon obeh teles, utež pa izpodrine $m_\mathrm{Pb}/\rho_\mathrm{Pb}$. Iz ravnovesja $m_\mathrm{Pb}\left(1 - \dfrac{\rho}{\rho_\mathrm{Pb}}\right) = \rho V - m = 5{,}575 - 0{,}43 = 5{,}145\,\mathrm{kg}$ (masa izpodrinjene vode je $\rho V = 5{,}575\,\mathrm{kg}$).
8. $1 - \dfrac{1000}{11\,340} \approx 0{,}9118$, zato $m_\mathrm{Pb} = \dfrac{5{,}145\,\mathrm{kg}}{0{,}9118} \approx 5{,}64\,\mathrm{kg}$; pri manjši masi sistem splava.
9. Odgovor: igralec mora žogo potiskati navzdol s silo okoli $50\,\mathrm{N}$, kot bi držal $5\,\mathrm{kg}$ uteži, zato žoga po izpustu tako sunkovito skoči iz vode. Prosto plavajoča žoga je le $7{,}7\,\%$ pod vodo. Svinčena utež mora imeti vsaj $5{,}64\,\mathrm{kg}$, več kot $50\,\mathrm{N}/g$, ker utež sama dobi nekaj vzgona.

### Primer 4: zdaj ti

Potapljaški računalnik v morju kaže absolutni tlak $2{,}50\,\mathrm{bar}$. Gostota morske vode je $1025\,\mathrm{kg/m^3}$, zračni tlak na gladini $1{,}013\,\mathrm{bar}$. Na kateri globini je potapljač?

**Podatki:** $p = 2{,}50\,\mathrm{bar}$, $p_0 = 1{,}013\,\mathrm{bar}$, $\rho = 1025\,\mathrm{kg/m^3}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** globino $h$

:::formula
$h = \dfrac{p - p_0}{\rho g}$
:::

**Rešitev:**

1. Računalnik kaže absolutni tlak, zato najprej odštejemo zračnega: $p - p_0 = 2{,}50 - 1{,}013 = 1{,}487$, torej $1{,}487\,\mathrm{bar} = 148\,700\,\mathrm{Pa}$.
2. Imenovalec: $\rho g = 1025 \cdot 9{,}81 = 10\,055{,}25$, torej $10\,055{,}25\,\mathrm{Pa/m}$.
3. Deli in zaokroži na desetinko metra.

:::premisli
Koliko je $h$?
---
$h = \dfrac{148\,700\,\mathrm{Pa}}{10\,055{,}25\,\mathrm{Pa/m}} \approx 14{,}8\,\mathrm{m}$. Brez odštevanja $p_0$ bi dobil okoli $24{,}9\,\mathrm{m}$, kar je okoli $10\,\mathrm{m}$ preveč.
:::

## Pogoste napake

- **»Večja posoda, večji tlak na dnu.«** Več vode pomeni večjo skupno težo, zato študent sklepa, da je tudi tlak večji. Tlak je sila na enoto ploskve, zato se ploščina pokrajša: $p = p_0 + \rho g h$. Šteje le globina.
- **Tlak zgornjega roba namesto težišča.** Pri oknu iz primera 2 bi tlak na globini $2\,\mathrm{m}$ dal $18{,}8\,\mathrm{kN}$ namesto $22{,}6\,\mathrm{kN}$. Na navpični ploskvi vzemi globino težišča.
- **Mešanje absolutnega tlaka in nadtlaka.** Iz absolutnega tlaka globino izračunaš šele, ko odšteješ $p_0$. Silo na steno, ki ima zrak na obeh straneh, računaš z nadtlakom.
- **»Vzgon je odvisen od gostote telesa« ali »globlje je vzgon večji«.** Vzgon je teža izpodrinjene tekočine, $\rho_\text{tekočine} g V$. Za potopljeno nestisljivo telo je na vsaki globini enak; težka in lahka krogla enake prostornine imata enak vzgon.
- **Tlak kot vektor navzdol.** Študent misli, da voda pritiska le na dno. Tlak deluje v vse smeri, pravokotno na vsako ploskev, zato tudi na stene in navzgor na spodnjo stran telesa.

## Povzetek

- Tlak v mirujoči tekočini: $p = p_0 + \rho g h$; odvisen je le od globine in gostote, ne od oblike posode.
- Tlak v točki deluje v vse smeri, pravokotno na ploskev; sprememba na gladini se prenese povsod (Pascal).
- Nadtlak $p_\mathrm{n} = p - p_0$ kažejo merilniki; v vodi približno $1\,\mathrm{bar}$ na $10\,\mathrm{m}$.
- Sila na ravno ploskev: $F = \rho g h_\mathrm{T} A$ z globino težišča $h_\mathrm{T}$; prijemališče je globlje od težišča.
- Vzgon: $F_\mathrm{vz} = \rho g V$, teža izpodrinjene tekočine; telo plava, če je njegova povprečna gostota manjša od gostote tekočine.

## Za izpit

Znati moraš povedati:

- definicijo tlaka in dokaz, da je tlak v točki mirujoče tekočine neodvisen od smeri; Pascalov zakon;
- osnovno enačbo hidrostatike $\mathrm{d}p/\mathrm{d}z = -\rho g$ s pogoji, njeno izpeljavo in integracijo v $p = p_0 + \rho g h$; enačbo U-cevnega manometra;
- izpeljavo sile na ravno ploskev $F = \rho g h_\mathrm{T} A$ in lege središča tlaka $y_\mathrm{P} = y_\mathrm{T} + I_\mathrm{T}/(y_\mathrm{T} A)$;
- Arhimedov zakon s pogoji, dokaz za poljubno obliko in pogoj za plavanje z deležem potopljene prostornine.

### Naloga 1

Pravokotna loputa v navpični steni rezervoarja z vodo je široka $1{,}5\,\mathrm{m}$ in visoka $2{,}0\,\mathrm{m}$. Vrtljiva je okoli vodoravnega tečaja ob zgornjem robu, ki je $1{,}0\,\mathrm{m}$ pod gladino; zaprto jo drži zapah ob spodnjem robu. Na zunanji strani je zrak. Izračunaj (a) silo vode na loputo, (b) globino središča tlaka, (c) silo v zapahu in (d) silo v tečaju. Gostota vode je $1000\,\mathrm{kg/m^3}$, $g = 9{,}81\,\mathrm{m/s^2}$.

**Rešitev:**

1. $A = 1{,}5 \cdot 2{,}0 = 3{,}0\,\mathrm{m^2}$; težišče je na polovici višine, $h_\mathrm{T} = 1{,}0 + 1{,}0 = 2{,}0\,\mathrm{m}$.
2. $F = \rho g h_\mathrm{T} A = 1000 \cdot 9{,}81 \cdot 2{,}0 \cdot 3{,}0\,\mathrm{N} = 58\,860\,\mathrm{N}$; zračni tlak deluje z obeh strani in ne šteje.
3. Pri navpični ploskvi je $y = h$. $I_\mathrm{T} = \dfrac{b a^3}{12} = \dfrac{1{,}5 \cdot 2{,}0^3}{12} = 1{,}0\,\mathrm{m^4}$.
4. $h_\mathrm{P} = 2{,}0 + \dfrac{1{,}0}{2{,}0 \cdot 3{,}0}\,\mathrm{m} \approx 2{,}1667\,\mathrm{m}$, torej $16{,}7\,\mathrm{cm}$ pod težiščem.
5. Ročica sile glede na tečaj: $2{,}1667 - 1{,}0 = 1{,}1667\,\mathrm{m}$; moment $M = 58\,860 \cdot 1{,}1667\,\mathrm{N\,m} \approx 68\,670\,\mathrm{N\,m}$.
6. Zapah je $2{,}0\,\mathrm{m}$ od tečaja; ravnovesje momentov: $F_\mathrm{z} = \dfrac{68\,670}{2{,}0}\,\mathrm{N} \approx 34\,335\,\mathrm{N}$.
7. Ravnovesje sil: $F_\mathrm{t} = 58\,860 - 34\,335 = 24\,525\,\mathrm{N}$.
8. Odgovor: voda pritiska na loputo s $58{,}9\,\mathrm{kN}$, središče tlaka je na globini $2{,}17\,\mathrm{m}$, zapah nosi $34{,}3\,\mathrm{kN}$, tečaj $24{,}5\,\mathrm{kN}$. Če bi silo napačno postavili v težišče, bi zapahu pripisali le polovico, $29{,}4\,\mathrm{kN}$.

### Naloga 2

Natančno navedi Arhimedov zakon in ga dokaži za telo poljubne oblike. Utemelji, ali se vzgon na potopljeno trdno telo spreminja z globino in ali zakon velja za kvader, ki tesno nalega na dno posode, tako da pod njim ni vode.

**Rešitev:**

1. Trditev: telo s prostornino $V$, ki ga z vseh strani obdaja mirujoča tekočina s stalno gostoto $\rho$, čuti rezultanto tlačnih sil $F_\mathrm{vz} = \rho g V$ navpično navzgor, s prijemališčem v težišču izpodrinjene tekočine.
2. Dokaz: telo zamenjamo s tekočino enake oblike. Ta je v ravnovesju, zato tlačne sile nanjo dajo silo $\rho g V$ navzgor skozi njeno težišče.
3. Tlak na površini je odvisen le od globine, $p = p_0 + \rho g h$, ne od snovi znotraj, zato na telo deluje enaka rezultanta.
4. Globina: če telo spustimo za $\Delta h$, se tlak na vseh točkah površine poveča za $\rho g\,\Delta h$. Enakomerno povečan tlak na zaprto ploskev da rezultanto nič, zato se vzgon nestisljivega telesa ne spremeni.
5. Kvader na dnu: pogoj »tekočina obdaja vso površino« ni izpolnjen. Na spodnjo ploskev ne deluje tlak vode, na zgornjo pa $p_0 + \rho g h_\mathrm{zg}$, stranske sile se izničijo.
6. Odgovor: vzgon je $\rho g V$ in je neodvisen od globine; za kvader, ki tesno nalega na dno, zakon ne velja: tekočina ga s silo $(p_0 + \rho g h_\mathrm{zg})A$ tišči navzdol, zato ga je težko odlepiti od dna.

## Drugače: Z analogijo

Pomisli na človeško piramido navijačev na tribuni. Kdor stoji na vrhu, ne nosi nikogar. Vsaka vrsta niže nosi težo vseh nad seboj. Spodnja vrsta je najbolj obremenjena, in to ne glede na to, ali je piramida široka pet ali petdeset ljudi: vsak v spodnji vrsti nosi le ljudi nad seboj.

Tekočina je kot taka piramida z dvema razlikama. Prvič, »obremenitev« v tekočini pritiska tudi vstran in navzgor, ne le navzdol, zato voda tišči na stene in od spodaj na žogo. Drugič, če nekdo potisne na vrh piramide (zračni tlak), se pritisk enako prenese do vseh vrst. Vzgon je potem le to, da spodnji del žoge stoji v »nižji vrsti« kot zgornji.

## Drugače: Uporaba v stroki

- **Merjenje nivoja.** Diferenčni tlačni pretvornik na dnu rezervoarja meri $\Delta p = \rho g h$, krmilnik izračuna $h = \Delta p/(\rho g)$. Če se gostota spremeni (temperatura, sestava), je odčitek napačen, zato ga kompenziramo ali gostoto merimo z drugim pretvornikom na znani višinski razliki.
- **U-cevni manometer** na zaslonki v cevovodu meri padec tlaka, iz katerega izračunamo pretok; z vodo nad živim srebrom šteje razlika gostot $\rho_\mathrm{m} - \rho$.
- **Rezervoarji in zapornice.** Tlak na steno raste z globino, zato so spodnji pasovi plašča velikih rezervoarjev debelejši, lopute pa dimenzioniramo na silo v središču tlaka.
- **Areometer** plava v raztopini in potone toliko, da je $V_\mathrm{pot}/V = \bar\rho/\rho$; na skali beremo gostoto kislin, elektrolita ali sladkornih raztopin.

## Drugače: Bolj natančno

**Stisljiva tekočina.** Enačba $\mathrm{d}p/\mathrm{d}z = -\rho g$ velja tudi za plin, le da $\rho$ ni stalna. Za idealni plin je $\rho = pM/(RT)$; pri stalni temperaturi integracija da eksponentno upadanje tlaka z višino.

**Središče tlaka v številkah.** Za okno iz primera 2 ($\theta = 90^\circ$): $I_\mathrm{T} = \dfrac{b a^3}{12} = \dfrac{1{,}2 \cdot 0{,}8^3}{12} = 0{,}0512\,\mathrm{m^4}$, zato $y_\mathrm{P} = 2{,}4 + \dfrac{0{,}0512}{2{,}4 \cdot 0{,}96} \approx 2{,}422\,\mathrm{m}$. Prijemališče je $2{,}2\,\mathrm{cm}$ pod težiščem; z globino se razlika manjša, ker $y_\mathrm{T}$ v imenovalcu raste.

**Vzgon za poljubno telo.** Rezultanta tlaka na zaprto ploskev $S$ je $\vec F = -\oint_S p\,\vec n\,\mathrm{d}S$. Po Gaussovem izreku je to $-\int_V \nabla p\,\mathrm{d}V = \rho g V\,\vec e_z$, saj je $\nabla p = -\rho g\,\vec e_z$. Lega središča vzgona glede na težišče telesa določa stabilnost plavajočih teles.

## Preveri se

? Merilnik tlaka na tlačilki za kolo kaže $4\,\mathrm{bar}$. Kaj kaže?
- Absolutni tlak zraka v pnevmatiki, $4\,\mathrm{bar}$ nad vakuumom.
~ Večina merilnikov meri razliko do okolice, ne od vakuuma; absolutni tlak je okoli $5\,\mathrm{bar}$.
+ Nadtlak: za koliko je tlak v pnevmatiki večji od zračnega tlaka okolice.
- Silo zraka na celotno notranjo ploskev pnevmatike.
~ Bar je enota tlaka (sile na enoto ploskve), ne sile; silo bi dobil šele z množenjem s ploščino.
> Merilnik kaže nadtlak $p - p_0$. Absolutni tlak je $4\,\mathrm{bar} + p_0 \approx 5\,\mathrm{bar}$.

? Tri posode: voda ($\rho = 1000\,\mathrm{kg/m^3}$) do višine $3{,}0\,\mathrm{m}$, glicerol ($1260\,\mathrm{kg/m^3}$) do $2{,}5\,\mathrm{m}$ in olje ($920\,\mathrm{kg/m^3}$) do $4{,}0\,\mathrm{m}$. Razvrsti nadtlak na dnu od največjega do najmanjšega.
- glicerol > voda > olje
~ Gledal si le gostoto. Hidrostatični tlak je sorazmeren s produktom $\rho h$.
- olje > voda > glicerol
~ Gledal si le višino. Glicerol ima kljub nižjemu stolpcu večji $\rho h$ kot voda.
+ olje > glicerol > voda
> $\rho h$: olje $3680$, glicerol $3150$, voda $3000\,\mathrm{kg/m^2}$; tlak je ta produkt, pomnožen z $g$.

? Plavalec drži potopljeno žogo $0{,}5\,\mathrm{m}$ pod gladino in jo potisne na $3\,\mathrm{m}$. Kaj se zgodi z vzgonom na žogo (žoga je trda in se ne stisne)?
- Poveča se, ker je globlje večji tlak.
~ Večji je tlak na vse strani žoge, a razlika med spodnjim in zgornjim delom ostane enaka.
- Zmanjša se, ker je nad žogo več vode, ki jo tlači navzdol.
~ Voda nad žogo poveča tlak tudi pod žogo za enako vrednost; razlika se ne spremeni.
+ Ostane enak, ker je odvisen le od prostornine žoge in gostote vode.
> $F_\mathrm{vz} = \rho g V$ ne vsebuje globine. Mehka žoga bi se globlje stisnila in vzgon bi se zmanjšal.

? Kolikšen je nadtlak v sladki vodi na globini $10\,\mathrm{m}$?
- $9{,}81\,\mathrm{kPa}$
~ To je tlak na $1\,\mathrm{m}$; ali si pozabil pomnožiti z globino?
+ $98{,}1\,\mathrm{kPa}$
- $199\,\mathrm{kPa}$
~ To je absolutni tlak; vprašanje sprašuje po nadtlaku, brez $p_0$.
> $\rho g h = 1000 \cdot 9{,}81 \cdot 10\,\mathrm{Pa} = 98\,100\,\mathrm{Pa} \approx 0{,}98\,\mathrm{bar}$.

? Napihljiva deska za veslanje stoje (SUP) ima prostornino $0{,}30\,\mathrm{m^3}$ in maso $10\,\mathrm{kg}$. Kolikšno največjo maso tovora nosi v sladki vodi, preden se v celoti potopi?
- $300\,\mathrm{kg}$
~ To je masa izpodrinjene vode; pozabil si, da del vzgona nosi desko samo.
+ $290\,\mathrm{kg}$
- $2943\,\mathrm{kg}$
~ Pomešal si silo in maso: $\rho g V = 2943\,\mathrm{N}$, kar je sila, ne masa.
> Ob polni potopitvi $\rho V = (m_\text{deska} + m_\text{tovor})$: $1000 \cdot 0{,}30 - 10 = 290\,\mathrm{kg}$.

:::simboli
p | absolutni tlak v tekočini | p = p_0 + \rho g h | Pa
p_0 | zračni tlak nad gladino | | Pa | približno 101 325 Pa
p_\mathrm{n} | nadtlak (hidrostatični tlak) | p_\mathrm{n} = p - p_0 = \rho g h | Pa
\rho | gostota tekočine | | kg/m^3 | za vodo 1000 kg/m³
g | težni pospešek | | m/s^2 | 9,81 m/s²
h | globina pod gladino | | m
F | sila tekočine na ploskev | F = \rho g h_\mathrm{T} A | N | pri žogi rezultanta F = F_vz − mg
h_\mathrm{T} | globina težišča ploskve | | m | navpičen pravokotnik: h_T = h₁ + a/2
h_1 | globina zgornjega roba ploskve | | m
A | ploščina ploskve | | m^2 | pravokotnik: A = ab
a | rob kocke oziroma višina pravokotne ploskve | | m
b | širina pravokotne ploskve | | m
F_\mathrm{vz} | sila vzgona | F_\mathrm{vz} = \rho g V | N | Arhimedov zakon
V | prostornina potopljenega telesa | | m^3 | za kroglo V = 4/3 π r³
r | polmer žoge | | m
m | masa telesa | | kg
z | navpična koordinata (os navzgor) | | m
x | vodoravna koordinata | | m
\alpha | kot poševne ploskve prizme proti vodoravnici | | °
\rho_\mathrm{m} | gostota merilne tekočine v manometru | | kg/m^3
\Delta h | razlika gladin v U-cevi | | m | p_1 − p_2 = (ρ_m − ρ) g Δh
\bar\rho | povprečna gostota telesa | | kg/m^3 | plava, če je manjša od ρ
V_\mathrm{pot} | prostornina potopljenega dela | V_\mathrm{pot} = \dfrac{\bar\rho}{\rho} V | m^3
m_\mathrm{Pb} | masa svinčene uteži | | kg
\rho_\mathrm{Pb} | gostota svinca | | kg/m^3 | 11 340 kg/m³
y | razdalja vzdolž ploskve od presečišča z gladino | | m
\theta | naklonski kot ploskve proti gladini | | °
y_\mathrm{T} | lega težišča ploskve, merjena vzdolž ploskve | | m
y_\mathrm{P} | lega središča tlaka, merjena vzdolž ploskve | y_\mathrm{P} = y_\mathrm{T} + \frac{I_\mathrm{T}}{y_\mathrm{T} A} | m | središče tlaka je vedno pod težiščem
I_\mathrm{T} | ploskovni vztrajnostni moment okoli osi skozi težišče | | m^4 | za pravokotnik b a³/12
:::
