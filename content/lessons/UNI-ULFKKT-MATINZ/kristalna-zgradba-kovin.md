---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Rola aluminijaste folije stane v trgovini približno $3$ €. Na embalaži piše, da je folija debela $11\,\mu\mathrm{m}$. Koliko »nadstropij« atomov je to: deset, tisoč ali deset tisoč?

Drugo kuhinjsko vprašanje. Na indukcijsko ploščo postaviš litoželezno ponev in lonec iz nerjavnega jekla 18/10. Magnet se ponve prime, lonca pa ne. A tudi lonec je približno sedem desetin železa.

Tretje: folijo zmečkaš v kepo in se ne zlomi. Porcelanast krožnik pri enakem poskusu poči.

Vsi trije odgovori so v tem, kako so atomi v kovini zloženi in kje ta red ni popoln. Iz kristalne zgradbe izhajajo gostota, magnetnost, kovnost in trdnost. Na njej stojijo tudi fazni diagrami in toplotna obdelava jekel.

## Razlaga

**1. Mreža in osnovna celica.** V kovini so atomi razporejeni v pravilnem vzorcu, ki se ponavlja v vseh treh smereh. Snovi s takim redom rečemo **kristal**. **Kristalna mreža** je neskončna množica točk $\vec r = n_1\vec a_1 + n_2\vec a_2 + n_3\vec a_3$, kjer so $n_1, n_2, n_3$ cela števila, $\vec a_1, \vec a_2, \vec a_3$ pa trije nekomplanarni vektorji; okolica vsake točke je enaka. **Osnovna celica** je najmanjši paralelepiped z robovi vzdolž mrežnih vektorjev, ki ima vso simetrijo mreže in z zlaganjem drug ob drugega (premiki za dolžine svojih robov) brez vrzeli in prekrivanja zapolni ves prostor. Pri mrežah BCC in FCC (točki 3 in 4) je to kocka, ki vsebuje več mrežnih točk ($2$ oziroma $4$). Pri kubičnih celicah je dolžina roba **mrežni parameter** $a$, običajno med $0{,}25$ in $0{,}5\,\mathrm{nm}$.

Aluminij ima $a = 0{,}405\,\mathrm{nm}$. Po debelini folije se zato zvrsti $\dfrac{11\,\mu\mathrm{m}}{0{,}405\,\mathrm{nm}} \approx 27\,000$ celic, torej vsaj toliko plasti atomov. Prvo vprašanje je rešeno: več kot deset tisoč.

*Hitri preizkus:* približno koliko celic aluminija je v $1\,\mu\mathrm{m}$? *(Okoli $2500$.)*

**2. Štetje atomov v celici.** Atom na oglišču kocke si deli $8$ sosednjih celic, zato celici pripada $\tfrac18$ atoma. Atom na ploskvi si delita $2$ celici, torej $\tfrac12$. Atom v središču pripada celici v celoti.

*Hitri preizkus:* koliko atomov ima preprosta kubična celica z atomi samo v ogliščih? *(Eden: $8 \cdot \tfrac18 = 1$.)*

**3. Telesno centrirana kubična mreža (BCC).** Atomi so v ogliščih in še eden v središču kocke. Celica ima $8 \cdot \tfrac18 + 1 = 2$ atoma. Atomi so trde krogle s polmerom $R$, ki se dotikajo vzdolž prostorske diagonale. Ta meri $a\sqrt3$: ploskovna diagonala je po Pitagori $\sqrt{a^2 + a^2} = a\sqrt2$, prostorska pa $\sqrt{(a\sqrt2)^2 + a^2} = a\sqrt3$. Na njej ležijo polovica ogliščnega atoma, cel središčni in polovica nasprotnega ogliščnega, torej $a\sqrt3 = 4R$. Vsak atom ima $8$ najbližjih sosedov. **Koordinacijsko število** (KŠ) je število atomov, ki so od danega atoma oddaljeni za najmanjšo medatomsko razdaljo (pri trdih kroglah: ki se ga dotikajo). Tako mrežo imajo železo pri sobni temperaturi (Fe-α), krom in volfram.

*Hitri preizkus:* kateri atomi so najbližji sosedje atoma v središču? *(Vseh $8$ v ogliščih.)*

**4. Ploskovno centrirana kubična mreža (FCC).** Atomi so v ogliščih in na sredini vseh šestih ploskev. Celica ima $8 \cdot \tfrac18 + 6 \cdot \tfrac12 = 4$ atome. Dotikajo se vzdolž ploskovne diagonale: $a\sqrt2 = 4R$. KŠ je $12$. Tako mrežo imajo aluminij, baker, nikelj, srebro in zlato.

Pri temperaturi med $912\,^\circ\mathrm{C}$ in $1394\,^\circ\mathrm{C}$ ima FCC mrežo tudi železo (Fe-γ, **avstenit**). Nikelj v nerjavnem jeklu 18/10 (18 % kroma, 10 % niklja) ohrani to mrežo do sobne temperature. Avstenit ni feromagneten, zato se magnet lonca ne prime. Litoželezna ponev je večinoma iz Fe-α z mrežo BCC, ki je feromagnetna. Ista kovina, drugačna mreža, drugačna lastnost. Pojavu, da ima trdna snov pri različnih temperaturah različno mrežo, rečemo **alotropija** (polimorfija).

:::premisli
Atom v BCC ima $8$ najbližjih sosedov, v FCC pa $12$. Napovej, preden pogledaš tabelo spodaj: v kateri mreži zapolnijo atomi večji del prostora?
---
V FCC. Več dotikajočih se sosedov pomeni tesnejši sklad. Delež zapolnjenega prostora je v FCC $0{,}74$, v BCC $0{,}68$.
:::

**5. Heksagonalni gosti sklad (HCP).** Zloži krogle v plast, kot pomaranče na pladnju: vsaka ima $6$ sosedov. To je plast A. Druga plast B leži v jamicah prve. Tretja plast ima dve možnosti. Če leži točno nad A, dobimo zaporedje ABAB in heksagonalni gosti sklad (magnezij, cink, titan). Če leži v jamicah, ki jih ne pokrivata ne A ne B, dobimo ABCABC, kar je prav mreža FCC. Oba sklada sta enako gosta. Celica HCP, ki jo navadno rišemo, je šeststrana prizma s $6$ atomi; prava osnovna celica (paralelepiped) je trikrat manjša in vsebuje $2$ atoma.

*Hitri preizkus:* atom ima v svoji plasti $6$ sosedov. Koliko najbližjih sosedov ima, ko prišteješ še plasti nad in pod njim? *(Dvanajst: šest v plasti ter po tri zgoraj in spodaj.)*

**Delež zapolnjenosti** (faktor atomskega sklada) je razmerje med prostornino atomov v celici, obravnavanih kot trde krogle, in prostornino celice: $\mathrm{FZ} = \dfrac{n \cdot \tfrac43\pi R^3}{V_\mathrm{c}}$. *Dokaz za FCC:* $n = 4$, $a = 2\sqrt2 R$, $V_\mathrm{c} = a^3 = 16\sqrt2 R^3$, torej $\mathrm{FZ} = \dfrac{\tfrac{16}{3}\pi R^3}{16\sqrt2 R^3} = \dfrac{\pi}{3\sqrt2} \approx 0{,}740$. *Za BCC:* $n = 2$, $a = \dfrac{4R}{\sqrt3}$, $a^3 = \dfrac{64R^3}{3\sqrt3}$, torej $\mathrm{FZ} = \dfrac{\tfrac83\pi R^3 \cdot 3\sqrt3}{64R^3} = \dfrac{\pi\sqrt3}{8} \approx 0{,}680$. Rezultat ni odvisen od $R$, torej velja za vse kovine z isto mrežo.

| Mreža | atomov v celici | KŠ | delež zapolnjenosti |
|---|---|---|---|
| BCC | $2$ | $8$ | $0{,}68$ |
| FCC | $4$ | $12$ | $0{,}74$ |
| HCP | $6$ | $12$ | $0{,}74$ |

**6. Gostota iz zgradbe.** Naj bo kristal popoln (brez vrzeli in tujih atomov) s kubično celico. Masa celice je $n$ atomov, vsak z maso $\dfrac{M}{N_\mathrm{A}}$. Prostornina celice je $a^3$. Zato je teoretična gostota

$$\rho = \frac{n\,M}{a^3\,N_\mathrm{A}}$$

kjer je $n$ število atomov v celici, $M$ molska masa in $N_\mathrm{A} = 6{,}022\cdot10^{23}\,\mathrm{mol^{-1}}$.

*Hitri preizkus:* kateri $n$ vstaviš za železo pri sobni temperaturi? *(Dva, mreža je BCC.)*

**7. Točkaste napake.** Pravi kristal ni popoln. **Vrzel** je mesto v mreži, kjer atom manjka. Vrzeli so pri vsaki temperaturi nad absolutno ničlo. Naj bo kristal pri temperaturi $T$ v termodinamskem ravnotežju (dovolj dolgo držan pri $T$). Potem je ravnotežni delež praznih mest

$$\frac{N_\mathrm{v}}{N} = e^{-Q_\mathrm{v}/(kT)}$$

kjer je $Q_\mathrm{v}$ energija za nastanek vrzeli, $k = 8{,}617\cdot10^{-5}\,\mathrm{eV/K}$ Boltzmannova konstanta in $T$ temperatura v kelvinih. Delež s temperaturo strmo narašča. Po vrzelih atomi potujejo skozi kristal (difuzija).

Tuji atomi so lahko na mestih mreže namesto osnovnih: **substitucijski** atomi, na primer krom in nikelj v nerjavnem jeklu ali cink v medenini. Majhni atomi, kot je ogljik v železu, pa se stisnejo v praznine med atomi mreže: **intersticijski** atomi. Tako nastanejo trdne raztopine, osnova vseh zlitin.

**8. Dislokacije.** **Dislokacija** je linijska napaka. Pri **robni** dislokaciji se ena ravnina atomov sredi kristala konča, kot bi med strani knjige vtaknil pol lista. Pri **vijačni** dislokaciji so ravnine zasukane v spiralo okoli črte. Velikost in smer premika atomov okoli dislokacije opiše **Burgersov vektor** $\vec b$. Definiramo ga z **Burgersovo zanko**: okoli dislokacijske črte naredimo zaprto pot od atoma do atoma, z enakim številom korakov v vsaki smeri. Isto pot ponovimo v popolnem kristalu; tam se ne zapre in vektor, ki jo zapre, je $\vec b$. Pri robni dislokaciji je $\vec b$ pravokoten na črto, pri vijačni vzporeden z njo.

Pod obremenitvijo dislokacija drsi in naenkrat pretrga le eno vrsto vezi. Pomisli na prt z gubo: gubo potisneš čez mizo z majhno silo, cel prt povleči je težje. Zato se folija zvije, ne da bi počila. V porcelanu dislokacije skoraj ne morejo drseti, zato poči.

:::premisli
Čisti baker je mehak, medenina (baker s cinkom) pa trša. Zakaj tuji atomi kovino utrdijo?
---
Tuji atomi popačijo mrežo okoli sebe. Dislokacija ob njih zastane, zato je za njen premik potrebna večja napetost. Kar ovira drsenje dislokacij, kovino utrdi.
:::

**9. Ploskovne in prostorske napake.** Kovina iz taline ne zraste v en kristal, ampak v veliko **zrn**, ki so različno obrnjena. Stik dveh zrn je **kristalna meja**. Na njej se dislokacije ustavljajo, zato je drobnozrnata kovina trdnejša. Zrna so velika od nekaj $\mu\mathrm{m}$ do nekaj $\mathrm{mm}$; na pocinkani pločevini jih vidiš s prostim očesom. Prostorske napake so pore, vključki in razpoke.

## Rešeni primeri

### Primer 1: mrežni parameter iz polmera

Dno bakrenega lonca je iz bakra z mrežo FCC. Polmer atoma bakra je $0{,}128\,\mathrm{nm}$. Kolikšen je mrežni parameter?

**Podatki:** mreža FCC, $R = 0{,}128\,\mathrm{nm}$
**Iščemo:** mrežni parameter $a$

:::formula
V FCC se atomi dotikajo po ploskovni diagonali: $a\sqrt2 = 4R$, torej $a = 2\sqrt2\,R$
:::

**Rešitev:**

1. Ploskovna diagonala ima dolžino $a\sqrt2$. Na njej ležijo polovica ogliščnega atoma, cel atom na ploskvi in polovica drugega ogliščnega atoma, skupaj $4R$.
2. $a = \dfrac{4R}{\sqrt2} = 2\sqrt2 \cdot 0{,}128\,\mathrm{nm} \approx 0{,}362\,\mathrm{nm}$.
3. Odgovor: mrežni parameter bakra je približno $0{,}362\,\mathrm{nm}$.

### Primer 2: teoretična gostota bakra

Izračunaj gostoto bakra iz zgradbe in jo primerjaj s tabelirano vrednostjo $8{,}96\,\mathrm{g/cm^3}$.

**Podatki:** mreža FCC ($n = 4$), $a = 0{,}362\,\mathrm{nm}$, $M = 63{,}55\,\mathrm{g/mol}$, $N_\mathrm{A} = 6{,}022\cdot10^{23}\,\mathrm{mol^{-1}}$, $\rho_\mathrm{tab} = 8{,}96\,\mathrm{g/cm^3}$
**Iščemo:** gostoto $\rho$

:::formula
$\rho = \dfrac{n\,M}{a^3\,N_\mathrm{A}}$
:::

**Rešitev:**

1. Gostoto želimo v $\mathrm{g/cm^3}$, zato pretvorimo: $1\,\mathrm{nm} = 10^{-7}\,\mathrm{cm}$, torej $a = 3{,}62\cdot10^{-8}\,\mathrm{cm}$.
2. Prostornina celice: $a^3 \approx 4{,}744\cdot10^{-23}\,\mathrm{cm^3}$.
3. Imenovalec: $a^3 N_\mathrm{A} \approx 28{,}57\,\mathrm{cm^3/mol}$.
4. Števec: $n M = 4 \cdot 63{,}55 = 254{,}2$, v $\mathrm{g/mol}$.
5. $\rho = \dfrac{254{,}2}{28{,}57}\,\mathrm{g/cm^3} \approx 8{,}90\,\mathrm{g/cm^3}$.
6. Odgovor: teoretična gostota je $8{,}90\,\mathrm{g/cm^3}$, le okoli $0{,}7\,\%$ manj od tabelirane. Razlika izvira iz zaokroženega polmera.

### Primer 3 (težji): katera mreža? (obratno vprašanje)

Na dnu lonca piše »aluminij«. V priročniku najdeš gostoto $2{,}70\,\mathrm{g/cm^3}$, mrežni parameter kubične celice $0{,}405\,\mathrm{nm}$ in molsko maso $26{,}98\,\mathrm{g/mol}$. (a) Je mreža BCC ali FCC? (b) Kolikšna sta polmer atoma in najmanjša razdalja med središči sosednjih atomov? (c) Koliko atomov je v $1\,\mathrm{cm^3}$ aluminija?

**Podatki:** $\rho = 2{,}70\,\mathrm{g/cm^3}$, $a = 0{,}405\,\mathrm{nm}$, $M = 26{,}98\,\mathrm{g/mol}$, $N_\mathrm{A} = 6{,}022\cdot10^{23}\,\mathrm{mol^{-1}}$
**Iščemo:** število atomov v celici $n$ in s tem vrsto mreže, polmer $R$, razdaljo $2R$, število atomov na $\mathrm{cm^3}$

:::formula
Iz $\rho = \dfrac{n\,M}{a^3 N_\mathrm{A}}$ izrazimo $n = \dfrac{\rho\, a^3 N_\mathrm{A}}{M}$; v FCC $R = \dfrac{a\sqrt2}{4}$; atomov na prostornino $= \dfrac{n}{a^3}$
:::

**Rešitev:**

1. Tokrat poznamo gostoto, ne mreže, zato enačbo obrnemo na $n$.
2. $a = 4{,}05\cdot10^{-8}\,\mathrm{cm}$, $a^3 \approx 6{,}643\cdot10^{-23}\,\mathrm{cm^3}$.
3. $a^3 N_\mathrm{A} \approx 40{,}0\,\mathrm{cm^3/mol}$.
4. $n = \dfrac{2{,}70 \cdot 40{,}0}{26{,}98} \approx 4{,}00$.
5. Štiri atome v celici ima FCC; BCC bi dal $n = 2$ in s tem polovično gostoto, okoli $1{,}35\,\mathrm{g/cm^3}$.
6. Mrežo zdaj poznamo, zato vemo, da se atomi dotikajo po ploskovni diagonali: $R = \dfrac{0{,}405\,\mathrm{nm} \cdot \sqrt2}{4} \approx 0{,}143\,\mathrm{nm}$.
7. Sosednja atoma se dotikata, zato je najmanjša razdalja med središči $2R = \dfrac{a\sqrt2}{2} \approx 0{,}286\,\mathrm{nm}$.
8. V vsaki celici s prostornino $a^3$ so $4$ atomi: $\dfrac{4}{6{,}643\cdot10^{-23}\,\mathrm{cm^3}} \approx 6{,}02\cdot10^{22}\,\mathrm{cm^{-3}}$. Preverba: $\dfrac{\rho N_\mathrm{A}}{M} = \dfrac{2{,}70 \cdot 6{,}022\cdot10^{23}}{26{,}98} \approx 6{,}03\cdot10^{22}\,\mathrm{cm^{-3}}$.
9. Odgovor: aluminij ima mrežo FCC, polmer atoma je $0{,}143\,\mathrm{nm}$, sosednja atoma sta $0{,}286\,\mathrm{nm}$ narazen, v $1\,\mathrm{cm^3}$ je okoli $6{,}0\cdot10^{22}$ atomov.

### Primer 4: zdaj ti – vrzeli v vročem aluminiju

Kos čistega aluminija segrejemo na $600\,^\circ\mathrm{C}$, tik pod tališče ($660\,^\circ\mathrm{C}$). Energija za nastanek vrzeli je $0{,}68\,\mathrm{eV}$. Kolikšen delež mest v mreži je prazen?

**Podatki:** $T = 600\,^\circ\mathrm{C}$, $Q_\mathrm{v} = 0{,}68\,\mathrm{eV}$, $k = 8{,}617\cdot10^{-5}\,\mathrm{eV/K}$
**Iščemo:** delež vrzeli $N_\mathrm{v}/N$

:::formula
$\dfrac{N_\mathrm{v}}{N} = e^{-Q_\mathrm{v}/(kT)}$
:::

**Rešitev:**

1. Temperatura v kelvinih: $T = 600 + 273{,}15 = 873{,}15\,\mathrm{K}$.
2. $kT \approx 0{,}0752\,\mathrm{eV}$.
3. Eksponent: $\dfrac{Q_\mathrm{v}}{kT} = \dfrac{0{,}68}{0{,}0752} \approx 9{,}04$.
4. Izračunaj potenco in rezultat izrazi kot »ena vrzel na koliko atomov«.

:::premisli
Koliko je $e^{-9{,}04}$ in kaj to pomeni?
---
$e^{-9{,}04} \approx 1{,}19\cdot10^{-4}$, torej približno ena vrzel na $8400$ atomov. Pri sobni temperaturi bi dobil le okoli $3\cdot10^{-12}$: vrzeli je pri $600\,^\circ\mathrm{C}$ več kot milijonkrat več.
:::

## Pogoste napake

- **Štetje vseh narisanih atomov.** Na sliki FCC celice je $14$ krogel, zato nekateri vzamejo $n = 14$. Večina krogel pa pripada tudi sosednjim celicam. Prav je $8 \cdot \tfrac18 + 6 \cdot \tfrac12 = 4$.
- **Dotik po robu kocke.** Zapis $a = 2R$ velja le za preprosto kubično mrežo. V BCC se atomi dotikajo po prostorski diagonali ($a = \tfrac{4R}{\sqrt3}$), v FCC po ploskovni ($a = \tfrac{4R}{\sqrt2}$).
- **Pozabljena pretvorba nm v cm.** Če vstaviš $a = 0{,}362$ kar v cm, je gostota napačna za faktor $10^{21}$. Vedno pretvori: $1\,\mathrm{nm} = 10^{-7}\,\mathrm{cm}$.
- **»Gostejši sklad pomeni težjo kovino.«** Aluminij (FCC, $0{,}74$) ima gostoto $2{,}70\,\mathrm{g/cm^3}$, železo (BCC, $0{,}68$) pa $7{,}87\,\mathrm{g/cm^3}$. Gostota je odvisna predvsem od mase atoma, delež zapolnjenosti le malo popravi.
- **»Napake so vedno slabe« ali »dislokacija je razpoka«.** Dislokacija ni prazna reža, ampak premaknjena vrsta atomov. Brez nje se kovina ne bi mogla plastično deformirati, tuji atomi pa so osnova zlitin.

## Povzetek

- Kristal je periodično urejena snov; osnovna celica z mrežnim parametrom $a$ z zlaganjem zapolni prostor.
- BCC: $2$ atoma, KŠ $8$, zapolnjenost $0{,}68$, $a\sqrt3 = 4R$ (Fe-α, Cr, W).
- FCC: $4$ atomi; KŠ $12$; zapolnjenost $0{,}74$; $a\sqrt2 = 4R$ (Al, Cu, Ni, Fe-γ). HCP: $6$ atomov; KŠ $12$; zapolnjenost $0{,}74$ (Mg, Zn, Ti).
- Teoretična gostota: $\rho = \dfrac{nM}{a^3 N_\mathrm{A}}$.
- Železo je alotropno: pri $912\,^\circ\mathrm{C}$ preide iz BCC v FCC.
- Napake: točkaste (vrzel, substitucijski in intersticijski atom), linijske (robna in vijačna dislokacija), ploskovne (kristalne meje), prostorske (pore, vključki).
- Delež vrzeli $e^{-Q_\mathrm{v}/(kT)}$ strmo raste s temperaturo. Drsenje dislokacij omogoča plastično deformacijo; ovire zanje kovino utrdijo.

## Za izpit

Znati moraš povedati:

- Natančne definicije kristalne mreže, osnovne celice, mrežnega parametra, koordinacijskega števila in deleža zapolnjenosti.
- Štetje atomov v celici ter izpeljavo zvez $a\sqrt3 = 4R$ (BCC) in $a\sqrt2 = 4R$ (FCC).
- Dokaz, da je zapolnjenost FCC $\dfrac{\pi}{3\sqrt2} \approx 0{,}74$ in BCC $\dfrac{\pi\sqrt3}{8} \approx 0{,}68$; zaporedja ABAB in ABCABC.
- Izpeljavo $\rho = \dfrac{nM}{a^3N_\mathrm{A}}$ s pogoji (popoln kristal) in njeno obratno uporabo za določitev mreže.
- Razvrstitev napak po razsežnosti, ravnotežni delež vrzeli s pogoji, definicijo Burgersovega vektorja z Burgersovo zanko in razliko med robno in vijačno dislokacijo.

### Naloga 1

Železo se pri $912\,^\circ\mathrm{C}$ preobrazi iz BCC v FCC. Pri tej temperaturi je polmer atoma v mreži BCC $0{,}1258\,\mathrm{nm}$, v mreži FCC pa $0{,}1292\,\mathrm{nm}$; $M = 55{,}85\,\mathrm{g/mol}$. (a) Izračunaj mrežna parametra obeh mrež. (b) Za koliko odstotkov se ob preobrazbi spremeni prostornina kosa železa? (c) Izračunaj gostoti obeh faz pri $912\,^\circ\mathrm{C}$.

**Rešitev:**

1. BCC: $a_\mathrm{B} = \dfrac{4R}{\sqrt3} = \dfrac{4 \cdot 0{,}1258}{\sqrt3}\,\mathrm{nm} \approx 0{,}2905\,\mathrm{nm}$.
2. FCC: $a_\mathrm{F} = 2\sqrt2\,R = 2\sqrt2 \cdot 0{,}1292\,\mathrm{nm} \approx 0{,}3654\,\mathrm{nm}$.
3. Število atomov se ne spremeni, zato primerjamo prostornino na atom. BCC: $\dfrac{a_\mathrm{B}^3}{2} = \dfrac{0{,}024521}{2}\,\mathrm{nm^3} \approx 0{,}012261\,\mathrm{nm^3}$.
4. FCC: $\dfrac{a_\mathrm{F}^3}{4} = \dfrac{0{,}048800}{4}\,\mathrm{nm^3} \approx 0{,}012200\,\mathrm{nm^3}$.
5. Relativna sprememba: $\dfrac{0{,}012200 - 0{,}012261}{0{,}012261} \approx -0{,}0049 = -0{,}49\,\%$.
6. Gostota je masa atoma, deljena s prostornino na atom: $\rho_\mathrm{B} = \dfrac{55{,}85}{6{,}022\cdot10^{23} \cdot 1{,}2261\cdot10^{-23}}\,\mathrm{g/cm^3} \approx 7{,}56\,\mathrm{g/cm^3}$ ($1\,\mathrm{nm^3} = 10^{-21}\,\mathrm{cm^3}$).
7. $\rho_\mathrm{F} = \dfrac{55{,}85}{6{,}022\cdot10^{23} \cdot 1{,}2200\cdot10^{-23}}\,\mathrm{g/cm^3} \approx 7{,}60\,\mathrm{g/cm^3}$.
8. Odgovor: $a_\mathrm{BCC} \approx 0{,}2905\,\mathrm{nm}$, $a_\mathrm{FCC} \approx 0{,}3654\,\mathrm{nm}$; železo se ob segrevanju čez $912\,^\circ\mathrm{C}$ skrči za okoli $0{,}5\,\%$ prostornine, gostota naraste s $7{,}56$ na $7{,}60\,\mathrm{g/cm^3}$. Skrček je manjši, kot bi ga dalo samo razmerje $0{,}74/0{,}68$, ker je polmer atoma v FCC večji.

### Naloga 2

Natančno definiraj delež zapolnjenosti in dokaži, da je za preprosto kubično mrežo (atomi le v ogliščih) enak $\dfrac{\pi}{6}$, za FCC pa $\dfrac{\pi}{3\sqrt2}$. Utemelji, ali je delež zapolnjenosti odvisen od polmera atoma in ali iz večje zapolnjenosti sledi večja gostota kovine.

**Rešitev:**

1. Definicija: $\mathrm{FZ} = \dfrac{n \cdot \tfrac43\pi R^3}{V_\mathrm{c}}$, kjer je $n$ število atomov v celici, atomi so trde krogle s polmerom $R$, $V_\mathrm{c}$ prostornina celice.
2. Preprosta kubična: $n = 8 \cdot \tfrac18 = 1$, atoma se dotikata po robu, $a = 2R$, $V_\mathrm{c} = 8R^3$.
3. $\mathrm{FZ} = \dfrac{\tfrac43\pi R^3}{8R^3} = \dfrac{\pi}{6} \approx 0{,}524$.
4. FCC: $n = 4$, dotik po ploskovni diagonali, $a = 2\sqrt2R$, $V_\mathrm{c} = 16\sqrt2R^3$.
5. $\mathrm{FZ} = \dfrac{4 \cdot \tfrac43\pi R^3}{16\sqrt2R^3} = \dfrac{\pi}{3\sqrt2} \approx 0{,}740$.
6. V obeh izrazih se $R^3$ pokrajša, zato je delež odvisen le od geometrije mreže, ne od velikosti atoma.
7. Gostota $\rho = \dfrac{nM}{a^3N_\mathrm{A}}$ je odvisna še od molske mase in polmera, zato večja zapolnjenost ne pomeni večje gostote: aluminij (FCC) ima $2{,}70\,\mathrm{g/cm^3}$, železo (BCC) $7{,}87\,\mathrm{g/cm^3}$.
8. Odgovor: preprosta kubična mreža zapolni $\pi/6 \approx 52\,\%$, FCC $\pi/(3\sqrt2) \approx 74\,\%$ prostora; delež ni odvisen od $R$, iz večjega deleža pa večja gostota ne sledi, razen pri isti kovini v dveh mrežah s skoraj enakim polmerom atoma (kot pri železu v nalogi 1).

## Drugače: Na sliki

Prerez skozi ploskev celice FCC (● je središče atoma):

```
●───────●
│ ╲     │
│   ●   │
│     ╲ │
●───────●
```

Po diagonali se vrstijo: polovica ogliščnega atoma ($R$), cel atom na ploskvi ($2R$) in polovica drugega ogliščnega atoma ($R$). Skupaj $4R = a\sqrt2$. Po robu kocke se atoma ne dotikata, med njima je reža.

Pri BCC napravi prerez skozi dva nasprotna robova kocke. Dobiš pravokotnik s stranicama $a$ in $a\sqrt2$ in atomom v sredini. Po diagonali tega pravokotnika, ki je prostorska diagonala kocke, se zvrstijo $R + 2R + R = 4R = a\sqrt3$.

Robno dislokacijo si nariši kot mrežo navpičnih črt, kjer se ena črta konča na sredini slike. Nad koncem so črte stisnjene, pod njim razmaknjene. Oznaka ⊥ označi konec vrinjene polravnine.

## Drugače: Bolj natančno

**Heksagonalni sklad.** Za idealni HCP je razmerje višine in osnovnice celice $c/a = \sqrt{8/3} \approx 1{,}633$, zapolnjenost pa enaka kot pri FCC. Da je $\pi/(3\sqrt2)$ največja možna gostota sklada enakih krogel, je Keplerjeva domneva, ki jo je dokazal šele T. Hales.

**Zdrsni sistemi.** Dislokacije drsijo po najgosteje zasedenih ravninah v najgosteje zasedenih smereh. FCC ima $12$ takih zdrsnih sistemov, zato so Al, Cu in Ni duktilni tudi pri nizkih temperaturah. HCP jih ima pri sobni temperaturi malo, zato sta Mg in Zn manj preoblikovalna. V FCC je najkrajši Burgersov vektor vzdolž ploskovne diagonale, $|\vec b| = \tfrac{a\sqrt2}{2}$, kar je ravno razdalja med sosednjima atomoma.

**Ravnotežne vrzeli.** Vrzel poveča energijo kristala za $Q_\mathrm{v}$, a hkrati poveča entropijo, ker jo lahko razmestimo na veliko mest. Minimum proste energije je pri končnem deležu vrzeli; iz Boltzmannove porazdelitve sledi $N_\mathrm{v}/N \propto e^{-Q_\mathrm{v}/(kT)}$. Kristal brez vrzeli zato pri $T > 0$ ni stabilen.

## Preveri se

? Katera vrstica pravilno opiše mrežo FCC (atomov v celici, KŠ, delež zapolnjenosti)?
- $14$; $12$; $0{,}74$
~ $14$ je število narisanih krogel. Ogliščni in ploskovni atomi pripadajo tudi sosednjim celicam.
- $2$; $8$; $0{,}68$
~ To je vrstica za BCC, ki ima en sam atom v središču.
+ $4$; $12$; $0{,}74$
- $6$; $12$; $0{,}74$
~ Šest atomov ima heksagonalna celica HCP. KŠ in zapolnjenost sta enaka, štetje pa ne.
> $8 \cdot \tfrac18 + 6 \cdot \tfrac12 = 4$ atomi, vsak ima $12$ najbližjih sosedov, atomi zapolnijo $74\,\%$ prostora.

? Zakaj se kovina plastično deformira pri veliko manjši napetosti, kot bi bila potrebna za hkraten zdrs cele ravnine atomov?
- Ker so v kovini razpoke, ob katerih se kos odlomi.
~ Dislokacija ni razpoka; plastična deformacija ohrani kos celega.
+ Ker dislokacija drsi in naenkrat pretrga le eno vrsto vezi.
- Ker so vezi v kovini zelo šibke.
~ Kovinske vezi so močne; teoretična trdnost popolnega kristala je zelo visoka. Majhna je le napetost za premik dislokacije.
> Kot guba v prtu: dislokacija premakne ravnino postopoma, vrsto za vrsto, zato zadostuje majhna napetost.

? Bakrena žica ima premer $1\,\mathrm{mm}$, mrežni parameter je $0{,}3615\,\mathrm{nm}$. Približno koliko osnovnih celic se zvrsti čez premer?
- okoli $3\cdot10^{3}$
~ Tako dobiš, če $1\,\mathrm{mm}$ zapišeš kot $10^{-6}\,\mathrm{m}$. Milimeter je $10^{-3}\,\mathrm{m}$.
+ okoli $3\cdot10^{6}$
- okoli $3\cdot10^{9}$
~ Tako dobiš, če nanometer vzameš kot $10^{-12}\,\mathrm{m}$. Nanometer je $10^{-9}\,\mathrm{m}$.
> $\dfrac{10^{-3}\,\mathrm{m}}{0{,}3615\cdot10^{-9}\,\mathrm{m}} \approx 2{,}8\cdot10^{6}$, torej nekaj milijonov celic.

? Železo pri sobni temperaturi ima mrežo BCC z $a = 0{,}2866\,\mathrm{nm}$. Kolikšen je polmer atoma železa?
- $0{,}143\,\mathrm{nm}$
~ To je $a/2$; tako bi bilo, če bi se atoma dotikala po robu kocke. V BCC se dotikajo po prostorski diagonali.
- $0{,}101\,\mathrm{nm}$
~ To je $\tfrac{a\sqrt2}{4}$, formula za FCC. Železo pri sobni temperaturi ima BCC.
+ $0{,}124\,\mathrm{nm}$
> V BCC velja $a\sqrt3 = 4R$, torej $R = \dfrac{a\sqrt3}{4} = \dfrac{0{,}2866\,\mathrm{nm}\cdot\sqrt3}{4} \approx 0{,}124\,\mathrm{nm}$.

? Kos železa počasi segrevamo čez $912\,^\circ\mathrm{C}$, kjer se mreža BCC spremeni v FCC. Kaj se zgodi s prostornino kosa ob prehodu (polmer atoma se skoraj ne spremeni)?
- Poveča se, ker se pri segrevanju vse razteza.
~ Navadno toplotno raztezanje res velja, a pri spremembi mreže prevlada drugačen sklad atomov.
+ Zmanjša se, ker atomi v FCC zapolnijo večji del prostora.
- Ostane enaka, ker je število atomov enako.
~ Enako število atomov lahko zasede različno prostornino, odvisno od tega, kako tesno so zloženi.
> Zapolnjenost naraste z $0{,}68$ na $0{,}74$, zato se železo ob prehodu skrči, čeprav se segreva. To se vidi na dilatometrski krivulji jekla.

:::simboli
\rho | gostota kovine | \rho = \dfrac{n\,M}{a^3\,N_\mathrm{A}} | g/cm^3
n | število atomov v osnovni celici | n = \dfrac{\rho\, a^3 N_\mathrm{A}}{M} | – | BCC: 2, FCC: 4
M | molska masa | | g/mol
a | mrežni parameter (dolžina roba celice) | | nm | FCC: a = 2√2 R, BCC: a√3 = 4R; za gostoto v cm
N_\mathrm{A} | Avogadrova konstanta | | mol^{-1} | 6,022 · 10²³ mol⁻¹
N_\mathrm{v} | število vrzeli | | – |
N | število vseh mest za atome | | – |
e | Eulerjevo število | | – | e ≈ 2,718
Q_\mathrm{v} | energija za nastanek vrzeli | | eV |
k | Boltzmannova konstanta | | eV/K | 8,617 · 10⁻⁵ eV/K
T | temperatura | | K | °C pretvorimo v kelvine
R | polmer atoma | | nm |
\mathrm{FZ} | delež zapolnjenosti | \mathrm{FZ} = \dfrac{n \cdot \tfrac43\pi R^3}{V_\mathrm{c}} | – | BCC 0,68, FCC in HCP 0,74
V_\mathrm{c} | prostornina osnovne celice | V_\mathrm{c} = a^3 | nm^3 | kubična celica
:::
