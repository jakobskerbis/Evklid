---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Luka, bobnar v študentskem bendu, po koncertu spušča kovček z ojačevalnikom po ukrivljeni klančini z odra. Če mu uide, s kolikšno hitrostjo prileti na tla? Z Newtonovim zakonom $\sum\vec{F} = m\vec{a}$ bi moral slediti sili na vsakem koščku klančine, pri udarcu palice ob boben pa sile med njima sploh ne bi poznal. Zato iz Newtonovega zakona izpeljemo dve novi orodji, **energijo** in **gibalno količino**, ter zakona o njuni ohranitvi: z njima povežeš začetno in končno stanje, ne da bi spremljal vse vmes. Ohranitveni zakoni so med najsplošnejšimi v naravi; energijski račun srečaš pri presnovi, kemijskih reakcijah, elektrarnah in strojih, gibalno količino pa pri trkih avtomobilov, reaktivnem pogonu, eksplozijah in trkih molekul v plinu.

## Razlaga

### Najprej en primer

Lukov kovček izračunajmo kar z ohranitvijo energije, ki jo poznaš iz gimnazije: masa $10\,\mathrm{kg}$, višina odra $0{,}80\,\mathrm{m}$, kovček zdrsne iz mirovanja, trenje zanemarimo. Normalna sila klančine je ves čas pravokotna na gibanje in ne opravi dela, zato kovček vso izgubljeno potencialno energijo $mgh = 10 \cdot 9{,}81 \cdot 0{,}80\,\mathrm{J} \approx 78{,}5\,\mathrm{J}$ dobi kot kinetično. Iz $\tfrac{1}{2}mv^2 = mgh$ sledi $v = \sqrt{2gh} = \sqrt{2 \cdot 9{,}81 \cdot 0{,}80}\,\mathrm{m/s} \approx 3{,}96\,\mathrm{m/s}$. Masa se pokrajša, oblika klančine pa v računu sploh ne nastopa. Spodaj korak za korakom posplošimo, zakaj tak račun deluje: od dela sile prek potencialne energije do ohranitve energije in nato do gibalne količine, ki ureja trke.

### Delo in moč

**1. Delo sile.** Stalna sila $\vec{F}$ na premiku $\Delta\vec{r}$ opravi delo

$$A = \vec{F}\cdot\Delta\vec{r} = F\,\Delta r\cos\varphi,$$

kjer je $\varphi$ kot med silo in premikom. Enota je joule: $1\,\mathrm{J} = 1\,\mathrm{N\,m}$. Delo je pozitivno, če ima sila komponento v smeri gibanja, negativno, če ima komponento proti gibanju (trenje), in nič, če je sila pravokotna na premik (normalna sila podlage, sila pri enakomernem kroženju). Splošno: naj se telo giblje po krivulji od lege $\vec{r}_1$ do lege $\vec{r}_2$ in naj nanj deluje sila $\vec{F}$, ki se vzdolž poti lahko spreminja. Delo sile je krivuljni integral

$$A = \int_{\vec{r}_1}^{\vec{r}_2} \vec{F}\cdot\mathrm{d}\vec{r}.$$

V eni razsežnosti je to ploščina pod grafom $F(x)$. Vzmet deluje s silo $F = -kx$; da jo raztegnemo za $x$, moramo delovati s silo $kx'$ pri vsakem vmesnem raztezku $x'$, zato je potrebno delo $A = \int_0^x kx'\,\mathrm{d}x' = \tfrac{1}{2}kx^2$.

:::premisli
Težko torbo neseš s stalno hitrostjo po vodoravnem hodniku. Ali sila tvoje roke opravi delo na torbi?
---
Ne. Roka drži torbo s silo navpično navzgor, premik pa je vodoraven, zato je $\cos\varphi = \cos 90^\circ = 0$ in $A = 0$. Utrujenost je posledica porabe kemijske energije v mišicah samih (vlakna se ves čas krčijo), ne dela na torbi.
:::

**2. Moč.** Moč je delo na časovno enoto: $P = \mathrm{d}A/\mathrm{d}t$. Ker je $\mathrm{d}A = \vec{F}\cdot\mathrm{d}\vec{r}$ in $\mathrm{d}\vec{r} = \vec{v}\,\mathrm{d}t$, je $P = \vec{F}\cdot\vec{v}$. Enota je watt, $1\,\mathrm{W} = 1\,\mathrm{J/s}$.

### Energija

**3. Kinetična energija in izrek o kinetični energiji.** Kinetična energija telesa z maso $m$ in hitrostjo $v$ je $W_k = \tfrac{1}{2}mv^2$. **Izrek o kinetični energiji:** naj na točkasto telo s stalno maso $m$ deluje več sil in naj se telo premakne iz lege 1 (hitrost $v_1$) v lego 2 (hitrost $v_2$). Potem je delo rezultante vseh sil

$$A_{\text{vseh sil}} = \Delta W_k = \tfrac{1}{2}mv_2^2 - \tfrac{1}{2}mv_1^2.$$

*Dokaz.* Iz $\sum\vec{F} = m\,\mathrm{d}\vec{v}/\mathrm{d}t$ in $\mathrm{d}\vec{r} = \vec{v}\,\mathrm{d}t$ sledi $\sum\vec{F}\cdot\mathrm{d}\vec{r} = m\vec{v}\cdot\mathrm{d}\vec{v} = \mathrm{d}\left(\tfrac{1}{2}mv^2\right)$. Integral od lege 1 do lege 2 da $A_{\text{vseh sil}} = \tfrac{1}{2}mv_2^2 - \tfrac{1}{2}mv_1^2$.

**4. Konservativne sile in potencialna energija.** Sila $\vec{F}(\vec{r})$, ki je odvisna le od lege, je **konservativna**, če je njeno delo med poljubnima legama enako po vseh poteh; enakovredno: delo po vsaki sklenjeni poti je nič (teža, sila vzmeti, gravitacija, električna sila). Za takšno silo izberemo referenčno lego $\vec{r}_0$ in definiramo **potencialno energijo** $W_p(\vec{r}) = -\int_{\vec{r}_0}^{\vec{r}}\vec{F}\cdot\mathrm{d}\vec{r}$; tedaj je $A_{\text{kons}} = -\Delta W_p$:

- teža ob površju ($F_z = -mg$, os $z$ navzgor, referenca $z = 0$): $W_p = -\int_0^h(-mg)\,\mathrm{d}z = mgh$,
- prožnostna energija vzmeti (referenca $x = 0$): $W_p = \tfrac{1}{2}kx^2$,
- gravitacija (referenca v neskončnosti): $W_p = -\int_\infty^r\left(-\dfrac{GmM}{r'^2}\right)\mathrm{d}r' = -G\dfrac{mM}{r}$.

Trenje in upor nista konservativna: njuno delo je odvisno od dolžine poti in je pri drsenju po mirujoči podlagi negativno.

**5. Izrek o ohranitvi mehanske energije.** Če so vse sile, ki opravljajo delo na telo, konservativne (delo ostalih sil je $A' = 0$), potem je **mehanska energija** $W_k + W_p$ stalna. *Dokaz.* Delo vseh sil razdelimo: $A_{\text{vseh sil}} = A_{\text{kons}} + A' = -\Delta W_p + A'$. Po izreku o kinetični energiji je to $\Delta W_k$, torej

$$\Delta W_k + \Delta W_p = A',$$

pri $A' = 0$ pa $\Delta(W_k + W_p) = 0$. Trenje mehansko energijo zmanjša ($A' < 0$), motor ali mišice jo povečajo ($A' > 0$). Celotna energija, ki vključuje tudi notranjo energijo, pa se ohrani vedno: »izgubljena« mehanska energija se pretvori v notranjo energijo (segrevanje).

### Gibalna količina in trki

**6. Gibalna količina in sunek sile.** Gibalna količina je vektor $\vec{G} = m\vec{v}$, enota $\mathrm{kg\,m/s}$. Drugi Newtonov zakon v splošni obliki je $\sum\vec{F} = \mathrm{d}\vec{G}/\mathrm{d}t$. Z integriranjem od $t_1$ do $t_2$ dobimo **izrek o gibalni količini**:

$$\Delta\vec{G} = \int_{t_1}^{t_2}\sum\vec{F}\,\mathrm{d}t.$$

Integral na desni je **sunek sile**. Enak sunek lahko dosežemo z veliko silo v kratkem času ali z majhno silo v dolgem času.

**7. Izrek o ohranitvi gibalne količine.** Naj bo sistem $N$ teles, med katerimi delujejo notranje sile $\vec{F}_{ij}$ (sila telesa $j$ na telo $i$), na telesa pa še zunanje sile. Če je vsota zunanjih sil na sistem nič (ali je med kratkim trkom zanemarljiva), potem je celotna gibalna količina stalna:

$$\sum_i m_i\vec{v}_i = \sum_i m_i\vec{v}_i\,'.$$

*Dokaz.* $\dfrac{\mathrm{d}}{\mathrm{d}t}\sum_i\vec{G}_i = \sum_i\vec{F}_i^{\text{zun}} + \sum_i\sum_{j\neq i}\vec{F}_{ij}$. Po tretjem Newtonovem zakonu je $\vec{F}_{ij} = -\vec{F}_{ji}$, zato se v dvojni vsoti členi odštejejo v parih in ostane $\mathrm{d}\vec{G}/\mathrm{d}t = \sum\vec{F}^{\text{zun}} = 0$. Enačba je vektorska: če je nič le ena komponenta zunanjih sil (na primer vodoravna), se ohranja le ta komponenta $\vec{G}$.

**8. Trki.** Pri vsakem trku (ko so zunanje sile zanemarljive) se ohranja gibalna količina. Vrste trkov se razlikujejo po tem, kaj se zgodi s kinetično energijo:

| Trk | Gibalna količina | Kinetična energija | Primer |
|---|---|---|---|
| prožni | se ohrani | se ohrani | biljardne krogle, molekule plina |
| neprožni | se ohrani | del preide v notranjo energijo in deformacijo | žoga, ki odskoči nižje, kot je padla |
| popolnoma neprožni | se ohrani | izguba je največja možna; telesi se po trku gibljeta skupaj | balistično nihalo, sprijeta vozička |

Pri popolnoma neprožnem trku je skupna hitrost $\vec{v}\,' = \dfrac{m_1\vec{v}_1 + m_2\vec{v}_2}{m_1 + m_2}$.

Za čelni prožni trk, pri katerem drugo telo pred trkom miruje, iz obeh ohranitvenih zakonov sledi:

$$v_1' = \frac{m_1 - m_2}{m_1 + m_2}\,v_1, \qquad v_2' = \frac{2m_1}{m_1 + m_2}\,v_1.$$

*Izpeljava.* Ohranitvena zakona zapišemo kot $m_1(v_1 - v_1') = m_2v_2'$ in $m_1(v_1^2 - v_1'^2) = m_2v_2'^2$. Drugo enačbo delimo s prvo (za $v_1' \neq v_1$) in dobimo $v_1 + v_1' = v_2'$: relativna hitrost le spremeni predznak. To vstavimo v prvo enačbo in izrazimo $v_1'$, nato še $v_2'$.

Pri enakih masah si telesi zamenjata hitrosti. Lahko telo se od težkega odbije skoraj z nespremenjeno hitrostjo, težko telo pa lahkega odnese naprej s skoraj dvakratno svojo hitrostjo.

:::premisli
Ali se lahko pri trku dveh teles v notranjo energijo pretvori **vsa** kinetična energija? Kdaj?
---
Le če je celotna gibalna količina pred trkom nič, na primer ko se dve enaki telesi z enako velikima nasprotnima hitrostma zaletita in sprimeta. Ker se gibalna količina ohrani, se morata telesi po trku gibati, če je bila pred trkom različna od nič, in del kinetične energije ostane.
:::

**9. Masno središče.** Za sistem teles definiramo masno središče $\vec{r}_{ms} = \sum m_i\vec{r}_i / \sum m_i$. Z odvajanjem dobimo $\vec{G} = m_{\text{cel}}\vec{v}_{ms}$, iz dokaza v točki 7 pa $m_{\text{cel}}\vec{a}_{ms} = \sum\vec{F}^{\text{zun}}$. Masno središče sistema brez zunanjih sil se zato giblje premo enakomerno, kar koli se dogaja med telesi.

## Rešeni primeri

### Primer 1 (lažji)

Tehnik po gladkem odru potiska kovček z efekti za kitaro. Kovček ima maso $2{,}0\,\mathrm{kg}$ in na začetku miruje, tehnik pa nanj na razdalji $3{,}0\,\mathrm{m}$ deluje z vodoravno silo $10\,\mathrm{N}$. Trenje zanemarimo. Kolikšno hitrost doseže kovček?

**Podatki:** $m = 2{,}0\,\mathrm{kg}$, $v_1 = 0$, $F = 10\,\mathrm{N}$ (vzporedno s premikom), $s = 3{,}0\,\mathrm{m}$, trenja ni
**Iščemo:** končno hitrost $v_2$

:::formula
$A = Fs$, $A = \Delta W_k = \tfrac{1}{2}mv_2^2 - \tfrac{1}{2}mv_1^2$
:::

**Rešitev:**

1. Teža in normalna sila sta pravokotni na premik in ne opravita dela. Delo opravi le sila potiskanja: $A = 10\,\mathrm{N} \cdot 3{,}0\,\mathrm{m} = 30\,\mathrm{J}$.
2. Po izreku o kinetični energiji je $\tfrac{1}{2}mv_2^2 = 30\,\mathrm{J}$ (ker kovček na začetku miruje, je vse delo kar končna kinetična energija).
3. $v_2 = \sqrt{2A/m} = \sqrt{2 \cdot 30\,\mathrm{J} / 2{,}0\,\mathrm{kg}} = \sqrt{30}\,\mathrm{m/s} \approx 5{,}48\,\mathrm{m/s}$.
4. Odgovor: kovček doseže hitrost približno $5{,}48\,\mathrm{m/s}$.

### Primer 2

Otrok s sankami (skupna masa $20\,\mathrm{kg}$) se iz mirovanja spusti po hribu, visokem $10\,\mathrm{m}$, in doseže ob vznožju hitrost $12\,\mathrm{m/s}$. Koliko dela je opravilo trenje? Kolikšna bi bila hitrost brez trenja? Vzemi $g = 9{,}81\,\mathrm{m/s^2}$.

**Podatki:** $m = 20\,\mathrm{kg}$, $h = 10\,\mathrm{m}$, $v_1 = 0$, $v_2 = 12\,\mathrm{m/s}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** delo trenja $A_{tr}$ in hitrost $v_0$ brez trenja

:::formula
$\Delta W_k + \Delta W_p = A_{tr}$; brez trenja $\tfrac{1}{2}mv_0^2 = mgh$
:::

**Rešitev:**

1. Sprememba potencialne energije je negativna, ker se sani spustijo: $\Delta W_p = -mgh = -20 \cdot 9{,}81 \cdot 10\,\mathrm{J} = -1962\,\mathrm{J}$.
2. Sprememba kinetične energije: $\Delta W_k = \tfrac{1}{2} \cdot 20\,\mathrm{kg} \cdot (12\,\mathrm{m/s})^2 = 1440\,\mathrm{J}$.
3. Trenje je edina nekonservativna sila, ki opravi delo, zato iz $\Delta W_k + \Delta W_p = A_{tr}$ sledi: $A_{tr} = 1440\,\mathrm{J} - 1962\,\mathrm{J} = -522\,\mathrm{J}$.
4. Brez trenja se mehanska energija ohranja, zato $\tfrac{1}{2}mv_0^2 = mgh$ in masa se pokrajša: $v_0 = \sqrt{2gh} = \sqrt{2 \cdot 9{,}81 \cdot 10}\,\mathrm{m/s} \approx 14{,}0\,\mathrm{m/s}$.
5. Odgovor: trenje je opravilo delo $-522\,\mathrm{J}$ (toliko mehanske energije je prešlo v notranjo energijo snega in sani); brez trenja bi bila hitrost približno $14{,}0\,\mathrm{m/s}$.

### Primer 3 (težji)

Lesena klada z maso $2{,}0\,\mathrm{kg}$ visi na vrvicah dolžine $1{,}50\,\mathrm{m}$ (balistično nihalo). Vanjo vodoravno prileti izstrelek z maso $10\,\mathrm{g}$ in obtiči v njej, klada se nato odkloni za največ $30{,}0^\circ$ od navpičnice. Kolikšna je bila hitrost izstrelka in kolikšen delež njegove kinetične energije se pri trku pretvori v notranjo energijo? Vzemi $g = 9{,}81\,\mathrm{m/s^2}$.

**Podatki:** $m = 10\,\mathrm{g} = 0{,}010\,\mathrm{kg}$, $M = 2{,}0\,\mathrm{kg}$ (na začetku miruje), $l = 1{,}50\,\mathrm{m}$, $\vartheta = 30{,}0^\circ$, trk je popolnoma neprožen, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** hitrost izstrelka $v$, delež izgubljene kinetične energije

:::formula
Nihanje po trku: $h = l(1 - \cos\vartheta)$, $\tfrac{1}{2}(m + M)v'^2 = (m + M)gh$. Trk: $mv = (m + M)v'$.
:::

**Rešitev:**

1. Dogodek razdelimo na dva dela z različnima ohranitvenima zakonoma: pri trku se ohranja vodoravna gibalna količina (energija ne), pri nihanju po trku mehanska energija (vrvici sta pravokotni na gibanje in ne opravljata dela). Računamo od konca nazaj.
2. Dvig klade iz geometrije: $h = l(1 - \cos\vartheta) = 1{,}50 \cdot (1 - \cos 30{,}0^\circ)\,\mathrm{m} \approx 0{,}201\,\mathrm{m}$.
3. Hitrost takoj po trku iz ohranitve mehanske energije (masa se pokrajša): $v' = \sqrt{2gh} = \sqrt{2 \cdot 9{,}81 \cdot 0{,}201}\,\mathrm{m/s} \approx 1{,}99\,\mathrm{m/s}$.
4. Med kratkim trkom vrvici ostaneta navpični, zato vodoravnih zunanjih sil ni in $mv = (m + M)v'$: $v = \dfrac{(m + M)v'}{m} = \dfrac{2{,}010 \cdot 1{,}986}{0{,}010}\,\mathrm{m/s} \approx 399\,\mathrm{m/s}$.
5. Delež splošno: ker je $v' = mv/(m + M)$, je $W_k' = \tfrac{1}{2}(m + M)v'^2 = \dfrac{(mv)^2}{2(m + M)}$ in $W_k = \dfrac{(mv)^2}{2m}$, zato $W_k'/W_k = m/(m + M)$ in v notranjo energijo preide delež $\dfrac{M}{m + M} = \dfrac{2{,}0}{2{,}010} \approx 0{,}995$.
6. Odgovor: izstrelek je priletel s hitrostjo približno $400\,\mathrm{m/s}$, pri trku pa se približno $99{,}5\,\%$ njegove kinetične energije pretvori v notranjo energijo klade in izstrelka.

### Primer 4 – zdaj ti

Klado z maso $0{,}50\,\mathrm{kg}$ potisnemo ob vzmet s koeficientom $200\,\mathrm{N/m}$, vzmet stisnemo za $10\,\mathrm{cm}$ in klado spustimo. Podlaga je gladka. S kolikšno hitrostjo klada odleti od vzmeti?

**Podatki:** $m = 0{,}50\,\mathrm{kg}$, $k = 200\,\mathrm{N/m}$, $x = 10\,\mathrm{cm} = 0{,}10\,\mathrm{m}$, $v_1 = 0$, trenja ni
**Iščemo:** hitrost $v$, ko klada zapusti vzmet

:::formula
$\tfrac{1}{2}kx^2 = \tfrac{1}{2}mv^2$
:::

**Rešitev:**

1. Podlaga je gladka, teža in normalna sila pa sta pravokotni na premik in ne opravita dela. Zato se mehanska energija ohranja: prožnostna energija vzmeti se v celoti pretvori v kinetično energijo klade.
2. Prožnostna energija stisnjene vzmeti: $W_p = \tfrac{1}{2} \cdot 200\,\mathrm{N/m} \cdot (0{,}10\,\mathrm{m})^2 = 1{,}0\,\mathrm{J}$.
3. Zdaj ti: zapiši $\tfrac{1}{2}mv^2 = W_p$, izrazi $v$ in vstavi podatke.

:::premisli
Kolikšna je hitrost klade, ko zapusti vzmet?
---
$v = \sqrt{2W_p/m} = \sqrt{2 \cdot 1{,}0\,\mathrm{J}/0{,}50\,\mathrm{kg}} = 2{,}0\,\mathrm{m/s}$.
:::

## Pogoste napake

- **Ohranitev energije pri neprožnem trku.** Pri trku se vedno ohranja gibalna količina, kinetična energija pa le pri prožnem trku. Pri balističnem nihalu je treba trk in nihanje obravnavati ločeno.
- **Gibalna količina kot skalar.** $\vec{G}$ je vektor. Žoga s $5\,\mathrm{m/s}$, ki se odbije nazaj s $5\,\mathrm{m/s}$, spremeni gibalno količino za $2mv$, ne za nič.
- **Delo normalne sile ali radialne sile.** Sila, pravokotna na premik, ne opravi dela, četudi je velika.
- **Pozabljeno delo trenja.** Trenje opravi delo $-F_{tr}s$, odvisno od dolžine poti, ne od višinske razlike.
- **Izrek o kinetični energiji le z eno silo.** V izrek gre delo **vseh** sil na telo (ali delo rezultante), ne le delo sile, ki jo omenja naloga.
- **Ničla potencialne energije.** Izbira, kje je $W_p = 0$, je poljubna, a ves račun mora uporabljati isto izbiro; fizikalno pomembne so le razlike.
- **Grami.** Pred računanjem maso pretvori v kilograme ($10\,\mathrm{g} = 0{,}010\,\mathrm{kg}$).

## Povzetek

- Delo: $A = \int\vec{F}\cdot\mathrm{d}\vec{r}$, pri stalni sili $A = Fs\cos\varphi$; moč $P = \vec{F}\cdot\vec{v}$.
- Izrek o kinetični energiji: $A_{\text{vseh sil}} = \Delta(\tfrac{1}{2}mv^2)$.
- Konservativne sile imajo potencialno energijo ($mgh$, $\tfrac{1}{2}kx^2$, $-GmM/r$); $\Delta W_k + \Delta W_p = A'$, brez nekonservativnih sil se mehanska energija ohranja.
- $\vec{G} = m\vec{v}$, $\Delta\vec{G} = \int\vec{F}\,\mathrm{d}t$; brez zunanjih sil se celotna gibalna količina ohranja.
- Trki: gibalna količina se ohrani vedno, kinetična energija le pri prožnem trku; popolnoma neprožni trk: skupna hitrost $\sum m_i v_i / \sum m_i$.

## Za izpit

Znati moraš povedati:

- definicijo dela kot krivuljnega integrala in moči ter izpeljavo $P = \vec{F}\cdot\vec{v}$ in dela pri raztezanju vzmeti;
- izrek o kinetični energiji s pogoji in dokazom iz drugega Newtonovega zakona;
- definicijo konservativne sile in potencialne energije ter izrek o ohranitvi mehanske energije s pogojem in dokazom;
- izrek o gibalni količini in izrek o ohranitvi gibalne količine sistema (pogoj: vsota zunanjih sil je nič) z dokazom iz tretjega Newtonovega zakona;
- izpeljavo hitrosti po čelnem prožnem trku in deleža kinetične energije, ki se izgubi pri popolnoma neprožnem trku.

### Naloga 1

Klada A z maso $0{,}40\,\mathrm{kg}$ zdrsne iz mirovanja po gladki ukrivljeni klančini z višine $0{,}80\,\mathrm{m}$ na vodoravno podlago. Prvi del podlage je dolg $1{,}0\,\mathrm{m}$ in hrapav (koeficient trenja $0{,}20$), za njim je gladek del. Na začetku gladkega dela miruje klada B z maso $1{,}20\,\mathrm{kg}$, za njo je vodoravna vzmet s koeficientom $480\,\mathrm{N/m}$. Klada A čelno in prožno trči v B. Izračunaj hitrost A tik pred trkom, hitrosti obeh klad po trku, največji skrček vzmeti in kje se A ustavi. Vzemi $g = 9{,}81\,\mathrm{m/s^2}$.

**Rešitev:**

1. Od vrha do trka: normalni sili ne opravljata dela, trenje opravi $A_{tr} = -\mu m_A g s$. Iz $\Delta W_k + \Delta W_p = A_{tr}$ sledi $\tfrac{1}{2}m_Av_A^2 = m_Agh - \mu m_Ags$, torej $v_A = \sqrt{2g(h - \mu s)}$. Ker je $h - \mu s = 0{,}80\,\mathrm{m} - 0{,}20 \cdot 1{,}0\,\mathrm{m} = 0{,}60\,\mathrm{m}$, je $v_A = \sqrt{2 \cdot 9{,}81 \cdot 0{,}60}\,\mathrm{m/s} \approx 3{,}43\,\mathrm{m/s}$.
2. Prožni trk z mirujočo B: $v_A' = \dfrac{0{,}40 - 1{,}20}{1{,}60} \cdot 3{,}431\,\mathrm{m/s} \approx -1{,}72\,\mathrm{m/s}$ (A se odbije nazaj), $v_B' = \dfrac{2 \cdot 0{,}40}{1{,}60} \cdot 3{,}431\,\mathrm{m/s} \approx 1{,}72\,\mathrm{m/s}$.
3. Preizkus gibalne količine: pred trkom $0{,}40 \cdot 3{,}431 \approx 1{,}37\,\mathrm{kg\,m/s}$, po trku $0{,}40 \cdot (-1{,}716) + 1{,}20 \cdot 1{,}716 \approx 1{,}37\,\mathrm{kg\,m/s}$.
4. Vzmet: na gladkem delu se mehanska energija ohranja, $\tfrac{1}{2}m_Bv_B'^2 = \tfrac{1}{2}kx^2$, zato $x = v_B'\sqrt{m_B/k} = 1{,}716 \cdot \sqrt{1{,}20/480}\,\mathrm{m} \approx 0{,}086\,\mathrm{m}$.
5. Klada A se vrne na hrapavi del in ga trenje ustavi: $\tfrac{1}{2}m_Av_A'^2 = \mu m_Agd$, torej $d = \dfrac{v_A'^2}{2\mu g} = \dfrac{1{,}716^2}{2 \cdot 0{,}20 \cdot 9{,}81}\,\mathrm{m} \approx 0{,}75\,\mathrm{m}$. To je manj od $1{,}0\,\mathrm{m}$, zato A klančine ne doseže več.
6. Odgovor: tik pred trkom ima A hitrost $3{,}43\,\mathrm{m/s}$; po trku se A giblje nazaj z $1{,}72\,\mathrm{m/s}$, B naprej z $1{,}72\,\mathrm{m/s}$; vzmet se skrči za največ $8{,}6\,\mathrm{cm}$, A pa se ustavi $0{,}75\,\mathrm{m}$ pred mestom trka (to je $0{,}25\,\mathrm{m}$ od vznožja klančine).

### Naloga 2

Natančno navedi izrek o ohranitvi gibalne količine za sistem teles in ga dokaži. Telo z maso $m_1$ in hitrostjo $v_1$ čelno trči v mirujoče telo z maso $m_2$. Izpelji hitrosti po prožnem trku in delež kinetične energije, ki se pri popolnoma neprožnem trku pretvori v notranjo energijo. Utemelji, ali se lahko pri tem trku v notranjo energijo pretvori vsa kinetična energija.

**Rešitev:**

1. Izrek: če je vsota zunanjih sil na sistem teles nič, je celotna gibalna količina $\vec{G} = \sum_i m_i\vec{v}_i$ stalna.
2. Dokaz: $\dfrac{\mathrm{d}\vec{G}}{\mathrm{d}t} = \sum_i\vec{F}_i^{\text{zun}} + \sum_i\sum_{j\neq i}\vec{F}_{ij}$. Po tretjem Newtonovem zakonu je $\vec{F}_{ij} = -\vec{F}_{ji}$, zato je dvojna vsota nič, in pri $\sum\vec{F}^{\text{zun}} = 0$ je $\mathrm{d}\vec{G}/\mathrm{d}t = 0$.
3. Prožni trk: $m_1(v_1 - v_1') = m_2v_2'$ in $m_1(v_1^2 - v_1'^2) = m_2v_2'^2$. Deljenje druge enačbe s prvo da $v_2' = v_1 + v_1'$.
4. Vstavimo v prvo: $m_1(v_1 - v_1') = m_2(v_1 + v_1')$, torej $v_1' = \dfrac{m_1 - m_2}{m_1 + m_2}\,v_1$ in $v_2' = v_1 + v_1' = \dfrac{2m_1}{m_1 + m_2}\,v_1$.
5. Popolnoma neprožni trk: $v' = \dfrac{m_1v_1}{m_1 + m_2}$, $W_k' = \tfrac{1}{2}(m_1 + m_2)v'^2 = \dfrac{m_1}{m_1 + m_2} \cdot \tfrac{1}{2}m_1v_1^2$. V notranjo energijo preide delež $1 - \dfrac{m_1}{m_1 + m_2} = \dfrac{m_2}{m_1 + m_2}$.
6. Ta delež je pri $m_1 > 0$ vedno manjši od 1: gibalna količina $m_1v_1 \neq 0$ se ohrani, zato se telesi po trku gibljeta in nekaj kinetične energije ostane. Vsa bi se pretvorila le, če bi bila celotna gibalna količina pred trkom nič.
7. Odgovor: $v_1' = \dfrac{m_1 - m_2}{m_1 + m_2}v_1$, $v_2' = \dfrac{2m_1}{m_1 + m_2}v_1$; pri popolnoma neprožnem trku se izgubi delež $m_2/(m_1 + m_2)$, nikoli vsa kinetična energija.

## Drugače: Na sliki

Energija je kot voda v treh posodah: med spustom se pretaka iz posode »potencialna« v posodo »kinetična«, trenje je luknja, skozi katero odteka v posodo »notranja energija«. Vsota v vseh treh je ves čas enaka.

Pri trku nariši puščice gibalnih količin pred trkom in po njem: njihova vektorska vsota je pred trkom in po njem enaka.

Graf $F(t)$ med trkom je ozek vrh; ploščina pod njim je sunek sile, enak spremembi gibalne količine. Blazina naredi vrh nižji in širši pri enaki ploščini.

## Drugače: Uporaba v stroki

**Udarna žilavost (Charpyjev preizkus).** Kladivo nihala ($20\,\mathrm{kg}$) spustijo z višine $1{,}50\,\mathrm{m}$; ko prelomi zarezan preizkušanec, se dvigne le na $1{,}10\,\mathrm{m}$. Za lom je porabljeno $mg\Delta h = 20 \cdot 9{,}81 \cdot 0{,}40\,\mathrm{J} \approx 78\,\mathrm{J}$.

**Moderiranje nevtronov.** V jedrskem reaktorju nevtrone upočasnijo s prožnimi trki z jedri moderatorja. Po formuli za čelni prožni trk nevtron na protonu (enaka masa) obstane, na jedru ogljika ($m_2 \approx 12m_1$) pa obdrži $(11/13)^2 \approx 72\,\%$ kinetične energije, zato v vodi potrebuje manj trkov kot v grafitu.

**Masna spektrometrija.** Ion z nabojem $e$, pospešen z napetostjo $U$, dobi $\tfrac{1}{2}mv^2 = eU$, zato je čas, v katerem ion preleti isto razdaljo, sorazmeren s $\sqrt{m}$; na tem temelji spektrometer na čas preleta (TOF).

**Črpalke.** Za dvig $10\,\mathrm{L/s}$ vode za $20\,\mathrm{m}$ pri izkoristku $70\,\%$ potrebuje črpalka moč $P = \rho Q g h/\eta = 1000 \cdot 0{,}010 \cdot 9{,}81 \cdot 20/0{,}70\,\mathrm{W} \approx 2{,}8\,\mathrm{kW}$.

## Drugače: Korak za korakom s številkami

Kroglica z maso $1{,}0\,\mathrm{kg}$ in hitrostjo $6{,}0\,\mathrm{m/s}$ čelno prožno trči v mirujočo kroglico z maso $2{,}0\,\mathrm{kg}$. Kolikšni sta hitrosti po trku?

1. **Ohranitev gibalne količine:** $1{,}0 \cdot 6{,}0 = 1{,}0\,v_1' + 2{,}0\,v_2'$.
2. **Ohranitev kinetične energije:** $\tfrac{1}{2} \cdot 1{,}0 \cdot 36 = \tfrac{1}{2} \cdot 1{,}0\,v_1'^2 + \tfrac{1}{2} \cdot 2{,}0\,v_2'^2$.
3. **Formula za prožni trk:** $v_1' = \frac{1{,}0 - 2{,}0}{3{,}0} \cdot 6{,}0\,\mathrm{m/s} = -2{,}0\,\mathrm{m/s}$.
4. **Druga kroglica:** $v_2' = \frac{2 \cdot 1{,}0}{3{,}0} \cdot 6{,}0\,\mathrm{m/s} = 4{,}0\,\mathrm{m/s}$.
5. **Preizkus:** $1{,}0 \cdot (-2{,}0) + 2{,}0 \cdot 4{,}0 = 6{,}0\,\mathrm{kg\,m/s}$ ✓ in $\tfrac{1}{2} \cdot 1{,}0 \cdot 4{,}0 + \tfrac{1}{2} \cdot 2{,}0 \cdot 16 = 18\,\mathrm{J}$ ✓. Lažja kroglica se odbije nazaj.

## Drugače: Bolj natančno

**Konservativna sila in gradient.** Če je $\oint\vec{F}\cdot\mathrm{d}\vec{r} = 0$ po vsaki sklenjeni poti, obstaja $W_p(\vec{r})$, da je $\vec{F} = -\nabla W_p$; v eni razsežnosti $F = -\mathrm{d}W_p/\mathrm{d}x$. Ravnovesne lege so v točkah, kjer je $\mathrm{d}W_p/\mathrm{d}x = 0$; minimum je stabilno ravnovesje.

**Sistem masnega središča.** Velja $W_k = \tfrac{1}{2}m_{\text{cel}}v_{ms}^2 + W_k'$, kjer je $W_k'$ kinetična energija glede na masno središče. Prvi člen se pri trku ohrani (ker se ohrani $\vec{G}$), zato se v notranjo energijo pretvori največ $W_k'$, pri popolnoma neprožnem trku ves.

## Preveri se

? Kolikšna je kinetična energija telesa z maso $2{,}0\,\mathrm{kg}$, ki se giblje s hitrostjo $3{,}0\,\mathrm{m/s}$?
- $6{,}0\,\mathrm{J}$
~ To je $mv = 6{,}0\,\mathrm{kg\,m/s}$, gibalna količina, ne energija; v kinetični energiji je hitrost na kvadrat.
+ $9{,}0\,\mathrm{J}$
- $18\,\mathrm{J}$
~ To je $mv^2$: pozabil si faktor $\tfrac{1}{2}$.
> $W_k = \tfrac{1}{2}mv^2 = \tfrac{1}{2} \cdot 2{,}0 \cdot 9{,}0\,\mathrm{J} = 9{,}0\,\mathrm{J}$. $18\,\mathrm{J}$ dobiš, če pozabiš na faktor $\tfrac{1}{2}$, $6{,}0$ pa je gibalna količina v $\mathrm{kg\,m/s}$.

? Voziček z maso $1{,}0\,\mathrm{kg}$ in hitrostjo $4{,}0\,\mathrm{m/s}$ se zaleti v mirujoč voziček z maso $3{,}0\,\mathrm{kg}$ in se z njim sprime. Kolikšna je skupna hitrost?
+ $1{,}0\,\mathrm{m/s}$
- $1{,}3\,\mathrm{m/s}$
~ Gibalno količino $4{,}0\,\mathrm{kg\,m/s}$ si delil le z maso mirujočega vozička; po trku se gibljeta oba, skupaj $4{,}0\,\mathrm{kg}$.
- $2{,}0\,\mathrm{m/s}$
~ To dobiš, če ohraniš kinetično energijo; pri trku, pri katerem se vozička sprimeta, del kinetične energije preide v notranjo.
> $v' = \frac{1{,}0 \cdot 4{,}0}{4{,}0}\,\mathrm{m/s} = 1{,}0\,\mathrm{m/s}$. Ohranja se gibalna količina, ne kinetična energija.

? Kaj se zgodi pri čelnem prožnem trku dveh enakih krogel, če druga pred trkom miruje?
- Obe se gibljeta naprej s polovično hitrostjo.
~ Tako se konča popolnoma neprožen trk; pri prožnem trku se mora ohraniti tudi kinetična energija, tu pa bi se prepolovila.
- Prva se odbije nazaj z nespremenjeno hitrostjo.
~ Tako se lahka krogla odbije od zelo težke. Pri enakih masah bi morala druga krogla tedaj dobiti hitrost $2v$, da se ohrani gibalna količina, kinetična energija pa bi se povečala, kar ni mogoče.
+ Prva obstane, druga nadaljuje s hitrostjo prve.
> Pri $m_1 = m_2$ je $v_1' = 0$ in $v_2' = v_1$: krogli si zamenjata hitrosti. Prvi odgovor bi bil popolnoma neprožen trk, pri katerem se izgubi polovica kinetične energije.

? Dvigalo dvigne tovor z maso $500\,\mathrm{kg}$ za $20\,\mathrm{m}$ v $25\,\mathrm{s}$ s stalno hitrostjo. Kolikšna je povprečna moč za dviganje ($g = 9{,}81\,\mathrm{m/s^2}$)?
- $400\,\mathrm{W}$
~ Računal si z maso namesto s težo: dvigalo mora premagati silo $mg$, zato manjka faktor $g$.
- $98\,\mathrm{kW}$
~ To je številka opravljenega dela $mgh \approx 98\,\mathrm{kJ}$; za moč ga moraš deliti še s časom.
+ $3{,}9\,\mathrm{kW}$
> $P = mgh/t = 500 \cdot 9{,}81 \cdot 20 / 25\,\mathrm{W} \approx 3924\,\mathrm{W} \approx 3{,}9\,\mathrm{kW}$. $98\,\mathrm{kW}$ je opravljeno delo v $\mathrm{kJ}$, ne moč.

? Žoga z maso $m$ pade navpično na tla s hitrostjo $v$ in se odbije navzgor z enako veliko hitrostjo. Kolikšna je sprememba njene gibalne količine?
- Nič, ker je hitrost po odboju enako velika kot pred njim.
~ Gibalna količina je vektor: velikost je res enaka, smer pa se obrne, zato $\Delta\vec{G} = m\vec{v}\,' - m\vec{v} \neq 0$.
+ $2mv$, usmerjena navzgor.
- $mv$, usmerjena navzgor.
~ Upošteval si le gibalno količino po odboju; odšteti moraš še začetno, ki kaže navzdol, zato se njeni velikosti seštejeta.
> Navzgor vzemimo za pozitivno smer: $\Delta G = mv - (-mv) = 2mv$. Ta sunek žogi dajo tla, zato je sila tal med odbojem velika.

:::simboli
A | delo sile | A = \vec{F}\cdot\Delta\vec{r} = F\,\Delta r\cos\varphi | J |
A' | delo nekonservativnih sil | A' = \Delta W_k + \Delta W_p | J | pri A' = 0 se mehanska energija ohranja
F | sila | | N
r | krajevni vektor | | m | Δr: premik
\varphi | kot med silo in premikom | | °
A_{\text{vseh sil}} | delo vseh sil na telo | A_{\text{vseh sil}} = \Delta W_k | J | izrek o kinetični energiji
\Delta W_k | sprememba kinetične energije | \Delta W_k = \tfrac{1}{2}mv_2^2 - \tfrac{1}{2}mv_1^2 | J | kinetična energija je ½mv²
\Delta W_p | sprememba potencialne energije | | J | delo konservativnih sil je −ΔW_p
m | masa telesa (krogle) | | kg
v | hitrost | | m/s |
v' | skupna hitrost po popolnoma neprožnem trku | | m/s
v_1' | hitrost prvega telesa po prožnem trku | v_1' = \frac{m_1 - m_2}{m_1 + m_2}\,v_1 | m/s | drugo telo pred trkom miruje
v_2' | hitrost drugega telesa po prožnem trku | v_2' = \frac{2m_1}{m_1 + m_2}\,v_1 | m/s | drugo telo pred trkom miruje
v_1 | hitrost prvega telesa (začetna hitrost) | | m/s | pri trku: hitrost prvega telesa pred trkom
v_2 | hitrost drugega telesa (končna hitrost) | | m/s | pri trku: hitrost drugega telesa
v_0 | hitrost na dnu brez trenja | \tfrac{1}{2}mv_0^2 = mgh | m/s
G | gibalna količina | G = mv | kg m/s | drugje G: gravitacijska konstanta
t | čas | | s
i | zaporedna številka telesa v sistemu | | –
m_i | masa i-tega telesa | | kg
m_1 | masa prvega telesa | | kg
m_2 | masa drugega telesa | | kg
s | pot | | m
A_{tr} | delo sile trenja | A_{tr} = \Delta W_k + \Delta W_p | J | negativno, ker trenje zmanjša mehansko energijo
g | težni pospešek | | m/s^2 | 9,81 m/s²
h | višina | | m
M | masa klade | | kg | drugje: masa Zemlje v −GmM/r
k | koeficient vzmeti | | N/m
x | raztezek vzmeti | | m
l | dolžina vrvic nihala | | m
\vartheta | največji odklon nihala od navpičnice | h = l(1 - \cos\vartheta) | °
:::
