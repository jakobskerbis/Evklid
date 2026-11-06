---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka. Pajkova vodilna nit ima premer okoli $4\,\mathrm{\mu m}$ in se pretrga pri sili približno $0{,}014\,\mathrm{N}$. Jeklena žica iz konstrukcijskega jekla s premerom $1\,\mathrm{mm}$ se pretrga pri okoli $280\,\mathrm{N}$. Kateri material je močnejši?

Večina reče: jeklo, saj zdrži dvajsettisočkrat večjo silo. A žica ima tudi več kot šestdesettisočkrat večji prerez. Če silo delimo s prerezom, dobimo za pajkovo nit okoli $1100\,\mathrm{N/mm^2}$, za jeklo pa le okoli $360\,\mathrm{N/mm^2}$: pajkova svila je na enoto prereza približno trikrat močnejša. Primerjati sile je bilo napačno vprašanje. Pravo vprašanje je, kolikšna sila odpade na kvadratni milimeter. Tej količini pravimo **napetost**.

Napetost in njen par, **deformacija**, sta osnovna jezika trdnosti. Z njima izbereš premer vijaka, ki drži bioreaktor, presodiš, ali bo kita med tekom zdržala, določiš debelino stene tlačne posode ali preveriš armiranobetonski steber. Vse to stoji na treh stvareh iz te lekcije: Hookovem zakonu, diagramu nateznega preizkusa in dopustni napetosti.

## Razlaga

### Kaj kažejo meritve

Jekleno žico obesimo, nanjo pa obešamo uteži in merimo podaljšek. Štiri meritve:

| $F$ / N | $A$ / mm² | $L_0$ / m | $\Delta L$ / mm |
|---|---|---|---|
| $100$ | $1{,}0$ | $1{,}0$ | $0{,}50$ |
| $200$ | $1{,}0$ | $1{,}0$ | $1{,}0$ |
| $200$ | $2{,}0$ | $1{,}0$ | $0{,}50$ |
| $100$ | $1{,}0$ | $2{,}0$ | $1{,}0$ |

Kaj opaziš? Dvakratna sila da dvakratni podaljšek. Dvakratni prerez ga razpolovi. Dvakrat daljša žica se podaljša dvakrat več. Vse štiri vrstice opiše ena zveza: $\Delta L$ je sorazmeren z $F L_0/A$. Še bolj povedno: v vrsticah, kjer je $F/A$ enak (prva, tretja in četrta), je enak tudi relativni podaljšek $\Delta L/L_0 = 0{,}0005$. Material se »odziva« na silo na enoto prereza z relativno spremembo dolžine. To sta pojma, ki ju zdaj natančno definiramo.

### Napetost in deformacija

**Definicija.** Naj na ploskvico s ploščino $A$ deluje notranja sila. **Normalna napetost** je komponenta sile pravokotno na ploskvico na enoto ploščine,

$$\sigma = \frac{F}{A},$$

**strižna napetost** pa komponenta vzporedno s ploskvico, $\tau = F_t/A$. Enota je $\mathrm{Pa} = \mathrm{N/m^2}$; v tehniki uporabljamo $\mathrm{MPa} = \mathrm{N/mm^2}$. Pri nategu je $\sigma > 0$, pri tlaku $\sigma < 0$.

Ta zapis velja za povprečno napetost po prerezu. Napetost je enakomerna, kadar sila deluje v težišču prereza in smo dovolj daleč od mesta, kjer jo vnašamo (**načelo Saint-Venanta**: približno za širino prereza stran od prijemališča vpliv načina vnosa izzveni).

**Definicija.** **Specifična deformacija** (relativni raztezek) palice z začetno dolžino $L_0$, ki se podaljša za $\Delta L$, je

$$\varepsilon = \frac{\Delta L}{L_0}.$$

Je brez enote; pogosto jo pišemo v promilih ali odstotkih. **Strižna deformacija** $\gamma$ je sprememba prvotno pravega kota (v radianih).

Palica se pri nategu ne le podaljša, ampak tudi stanjša. Razmerje prečne in vzdolžne deformacije je **Poissonovo število**:

$$\nu = -\frac{\varepsilon_q}{\varepsilon}.$$

Za kovine je $\nu \approx 0{,}3$, za gumo skoraj $0{,}5$ (prostornina se skoraj ne spremeni), za pluto skoraj $0$ – zato se zamašek ob vtiskanju v steklenico ne razširi.

### Hookov zakon

**Zakon (Hookov zakon za enoosno napetost).** Dokler je napetost pod mejo proporcionalnosti materiala, sta napetost in deformacija sorazmerni:

$$\sigma = E\,\varepsilon.$$

Sorazmernostni faktor $E$ je **modul elastičnosti** (Youngov modul), snovna konstanta z enoto napetosti. Pri strigu velja $\tau = G\gamma$ s **strižnim modulom** $G$; za izotropen material so konstante povezane, $G = E/(2(1 + \nu))$.

**Izpeljava podaljška palice.** Palica s stalnim prerezom $A$ je obremenjena z osno silo $F$. Iz $\sigma = F/A$, $\varepsilon = \Delta L/L_0$ in $\sigma = E\varepsilon$ sledi

$$\Delta L = \frac{F L_0}{E A}.$$

To je točno vzorec iz meritev; iz njih bi dobili $E = F L_0/(A\,\Delta L) = 200\,\mathrm{GPa}$. Zmnožek $EA$ je **osna togost** prereza. Če se sila ali prerez spreminjata vzdolž palice, palico razdelimo na kratke dele $\mathrm{d}x$ in seštejemo: $\Delta L = \int_0^{L_0} \frac{N(x)}{E A(x)}\,\mathrm{d}x$, kjer je $N(x)$ osna sila v prerezu $x$.

**Toplotna deformacija.** Pri spremembi temperature za $\Delta T$ se prosta palica podaljša za $\varepsilon_T = \alpha\,\Delta T$ ($\alpha$ je temperaturni razteznostni koeficient), brez napetosti. Če ji podaljšanje preprečimo, pa nastane napetost $\sigma = -E\alpha\,\Delta T$ – neodvisno od dolžine in prereza.

:::premisli
Žico iz istega jekla podaljšaš na dvakratno dolžino in obesiš isto utež. Ali se je pretrganje približalo? Kaj pa, če ji namesto tega razpoloviš prerez?
---
Daljša žica se podaljša dvakrat bolj, napetost $\sigma = F/A$ pa ostane enaka, zato pretrganju ni bližje. Pri pol manjšem prerezu se napetost podvoji in žica je mnogo bližje porušitvi. Za trdnost šteje napetost, za podaljšek tudi dolžina.
:::

### Natezni preizkus

Snovne lastnosti merimo z **nateznim preizkusom**: standardni preizkušanec (okrogel ali ploščat, z odebeljenima glavama za vpetje) na trgalnem stroju enakomerno raztezamo do pretrga in sproti merimo silo in podaljšek. Iz njiju narišemo **diagram napetost–deformacija** z inženirsko napetostjo $\sigma = F/A_0$ (deljeno z začetnim prerezom). Za konstrukcijsko jeklo ima značilne točke:

1. **Linearno področje** do meje proporcionalnosti: velja Hookov zakon, naklon je $E$.
2. **Meja elastičnosti**: do nje se po razbremenitvi preizkušanec vrne na prvotno dolžino. Pri jeklu je skoraj enaka meji proporcionalnosti.
3. **Meja tečenja** $R_e$: deformacija narašča pri skoraj stalni sili, material se plastično deformira. Pri materialih brez izrazite meje (aluminij, visokotrdna jekla) uporabljamo **dogovorno mejo** $R_{p0{,}2}$, napetost, pri kateri po razbremenitvi ostane $0{,}2\,\%$ trajne deformacije.
4. **Utrjevanje** do **natezne trdnosti** $R_m$, največje inženirske napetosti.
5. **Kontrakcija (vrat)**: prerez se na enem mestu zoži, inženirska napetost pade, nastopi pretrg.

Iz preizkušanca po pretrgu izmerimo še **raztezek po pretrgu** $A = (L_u - L_0)/L_0$ (oznaka iz standarda; ne zamenjaj je s prerezom) in **kontrakcijo** $Z = (A_0 - A_u)/A_0$; oba merita **duktilnost**, sposobnost plastične deformacije (žilavost je nekaj drugega: energija, ki jo material porabi do pretrga). Duktilni materiali (jeklo, aluminij) pred pretrgom opazno tečejo in »opozorijo«; krhki (litoželezo, steklo, beton v nategu) se pretrgajo skoraj brez plastične deformacije.

Okvirne vrednosti:

| material | $E$ / GPa | $R_e$ / MPa | $R_m$ / MPa |
|---|---|---|---|
| jeklo S235 | $210$ | $235$ | $360$ |
| Al zlitina | $70$ | $160$ | $215$ |
| kost | $17$ | – | $130$ |
| kita | $1{,}2$ | – | $100$ |

Pri aluminiju je v stolpcu $R_e$ dogovorna meja $R_{p0{,}2}$, pri kosti (kortikalna kost v nategu) in kiti izrazite meje tečenja ni: diagram je od začetka rahlo ukrivljen, pretrg nastopi brez vratu.

:::premisli
Jeklena in aluminijasta palica enakih mer nosita enako silo. Katera ima večjo napetost, katera se bolj podaljša in zakaj?
---
Napetost $\sigma = F/A$ je pri obeh enaka, ker sta sila in prerez enaka. Aluminij ima trikrat manjši $E$, zato je pri enaki napetosti deformacija trikrat večja in aluminijasta palica se podaljša trikrat bolj.
:::

### Dopustna napetost

Konstrukcija ne sme doseči meje tečenja (pri krhkih materialih trdnosti), poleg tega so obtežbe, mere in lastnosti materiala negotove. Zato napetost primerjamo z **dopustno napetostjo**:

$$\sigma_{dop} = \frac{R_e}{n} \ \text{(duktilni materiali)}, \qquad \sigma_{dop} = \frac{R_m}{n} \ \text{(krhki materiali)},$$

kjer je $n > 1$ **varnostni faktor**. Za krhke materiale izberemo večji faktor, ker ne opozorijo. Pri osni obremenitvi sta tipični nalogi:

- **kontrola**: izračunaj $\sigma = F/A$ in preveri $|\sigma| \leq \sigma_{dop}$;
- **dimenzioniranje**: izberi prerez $A \geq F/\sigma_{dop}$ in ga zaokroži navzgor na standardno mero.

Tlačene vitke palice je treba preveriti še na uklon, ki lahko nastopi pri napetosti, mnogo nižji od $R_e$; to obravnava posebna lekcija.

## Rešeni primeri

### Primer 1 (lažji)

Ahilova tetiva ima prerez okoli $70\,\mathrm{mm^2}$ in (skupaj s prehodom v mišico) dolžino $0{,}20\,\mathrm{m}$. Pri teku nanjo deluje sila okoli $3500\,\mathrm{N}$, kar je približno petkratna teža tekača. Modul elastičnosti tetive je $1{,}2\,\mathrm{GPa}$, natezna trdnost okoli $100\,\mathrm{MPa}$. Kolikšne so napetost, deformacija in podaljšek, in kolikšen je varnostni faktor glede na trdnost?

**Podatki:** $A = 70\,\mathrm{mm^2}$, $L_0 = 0{,}20\,\mathrm{m}$, $F = 3500\,\mathrm{N}$, $E = 1{,}2\,\mathrm{GPa} = 1200\,\mathrm{MPa}$, $R_m = 100\,\mathrm{MPa}$
**Iščemo:** $\sigma$, $\varepsilon$, $\Delta L$, $n = R_m/\sigma$

:::formula
$\sigma = \dfrac{F}{A}$, $\varepsilon = \dfrac{\sigma}{E}$, $\Delta L = \varepsilon L_0$
:::

**Rešitev:**

1. Napetost v $\mathrm{N/mm^2}$, ker je prerez v $\mathrm{mm^2}$: $\sigma = 3500/70\,\mathrm{MPa} = 50\,\mathrm{MPa}$.
2. Deformacija iz Hookovega zakona (enoti se pokrajšata): $\varepsilon = 50/1200 \approx 0{,}0417$, torej okoli $4{,}2\,\%$.
3. Podaljšek: $\Delta L = 0{,}0417 \cdot 200\,\mathrm{mm} \approx 8{,}3\,\mathrm{mm}$.
4. Varnost glede na trdnost: $n = 100/50 = 2{,}0$.
5. Odgovor: napetost je $50\,\mathrm{MPa}$, deformacija okoli $4\,\%$, tetiva se podaljša za približno $8\,\mathrm{mm}$, napetost pa je polovica natezne trdnosti. Ta raztezek ni izguba: tetiva kot vzmet shrani energijo in jo ob odrivu vrne.

### Primer 2

V biotehnološkem obratu visi bioreaktor z maso $3200\,\mathrm{kg}$ (z vsebino) na eni okrogli natezni palici iz jekla S235 ($R_e = 235\,\mathrm{MPa}$, $E = 210\,\mathrm{GPa}$), dolgi $2{,}5\,\mathrm{m}$. Varnostni faktor glede na mejo tečenja naj bo $1{,}5$. Določi najmanjši premer palice, izberi celo število milimetrov in izračunaj podaljšek izbrane palice. $g = 9{,}81\,\mathrm{m/s^2}$.

**Podatki:** $m = 3200\,\mathrm{kg}$, $g = 9{,}81\,\mathrm{m/s^2}$, $R_e = 235\,\mathrm{MPa}$, $E = 210\,\mathrm{GPa} = 210\,000\,\mathrm{MPa}$, $L_0 = 2{,}5\,\mathrm{m}$, $n = 1{,}5$
**Iščemo:** $d_{min}$, izbrani $d$, $\Delta L$

:::formula
$\sigma_{dop} = \dfrac{R_e}{n}$, $A \geq \dfrac{F}{\sigma_{dop}}$, $A = \dfrac{\pi d^2}{4}$, $\Delta L = \dfrac{F L_0}{E A}$
:::

**Rešitev:**

1. Sila v palici je teža reaktorja: $F = 3200 \cdot 9{,}81\,\mathrm{N} = 31\,392\,\mathrm{N}$.
2. Dopustna napetost: $\sigma_{dop} = 235/1{,}5\,\mathrm{MPa} \approx 156{,}7\,\mathrm{MPa}$.
3. Potrebni prerez: $A \geq 31\,392/156{,}7\,\mathrm{mm^2} \approx 200{,}4\,\mathrm{mm^2}$.
4. Premer: $d \geq \sqrt{4 \cdot 200{,}4/\pi}\,\mathrm{mm} \approx 15{,}97\,\mathrm{mm}$; izberemo $d = 16\,\mathrm{mm}$ z $A = \pi \cdot 16^2/4\,\mathrm{mm^2} \approx 201{,}1\,\mathrm{mm^2}$.
5. Kontrola: $\sigma = 31\,392/201{,}1\,\mathrm{MPa} \approx 156{,}1\,\mathrm{MPa} \leq 156{,}7\,\mathrm{MPa}$. ✓
6. Podaljšek: $\Delta L = \sigma L_0/E = 156{,}1 \cdot 2500/210\,000\,\mathrm{mm} \approx 1{,}86\,\mathrm{mm}$.
7. Odgovor: potrebna je palica premera vsaj $16\,\mathrm{mm}$; pod polno obremenitvijo se podaljša za približno $1{,}9\,\mathrm{mm}$, kar je treba upoštevati pri priključkih cevi na reaktor.

### Primer 3 (težji)

Stopničasta palica je zgoraj vpeta. Zgornji del je jeklen ($A_1 = 400\,\mathrm{mm^2}$, $L_1 = 1{,}5\,\mathrm{m}$, $E_1 = 210\,\mathrm{GPa}$, $R_{e1} = 235\,\mathrm{MPa}$), spodnji je iz aluminijeve zlitine z okroglim prerezom ($A_2 = 300\,\mathrm{mm^2}$, $L_2 = 1{,}0\,\mathrm{m}$, $E_2 = 70\,\mathrm{GPa}$, $R_{p0{,}2} = 160\,\mathrm{MPa}$, $\nu_2 = 0{,}33$). Na stiku delov deluje sila $20\,\mathrm{kN}$ navzdol, na spodnjem koncu pa $30\,\mathrm{kN}$ navzdol. Določi napetosti v obeh delih, preveri ju pri varnostnem faktorju $1{,}5$, izračunaj skupni podaljšek in spremembo premera spodnjega dela.

**Podatki:** $A_1 = 400\,\mathrm{mm^2}$, $L_1 = 1500\,\mathrm{mm}$, $E_1 = 210\,000\,\mathrm{MPa}$, $R_{e1} = 235\,\mathrm{MPa}$; $A_2 = 300\,\mathrm{mm^2}$, $L_2 = 1000\,\mathrm{mm}$, $E_2 = 70\,000\,\mathrm{MPa}$, $R_{p0{,}2} = 160\,\mathrm{MPa}$, $\nu_2 = 0{,}33$; $F_1 = 20\,\mathrm{kN}$ na stiku, $F_2 = 30\,\mathrm{kN}$ na koncu; $n = 1{,}5$
**Iščemo:** $N_1$, $N_2$, $\sigma_1$, $\sigma_2$, kontrola, $\Delta L$, $\Delta d_2$

:::formula
osna sila iz ravnotežja odrezanega spodnjega dela; $\sigma_i = \dfrac{N_i}{A_i}$; $\Delta L = \sum_i \dfrac{N_i L_i}{E_i A_i}$; $\varepsilon_q = -\nu\,\varepsilon$, $\Delta d = \varepsilon_q d$
:::

**Rešitev:**

1. Osna sila v spodnjem delu: prerežemo ga in opazujemo spodnji kos; nanj deluje le $F_2$, torej $N_2 = 30\,\mathrm{kN}$ (nateg).
2. Osna sila v zgornjem delu: odrezani kos pod prerezom nosi obe sili, $N_1 = 20 + 30 = 50\,\mathrm{kN}$.
3. Napetosti: $\sigma_1 = 50\,000/400\,\mathrm{MPa} = 125\,\mathrm{MPa}$, $\sigma_2 = 30\,000/300\,\mathrm{MPa} = 100\,\mathrm{MPa}$.
4. Kontrola: za jeklo je $\sigma_{dop} = 235/1{,}5 \approx 156{,}7\,\mathrm{MPa} \geq 125\,\mathrm{MPa}$ ✓; za aluminij $\sigma_{dop} = 160/1{,}5 \approx 106{,}7\,\mathrm{MPa} \geq 100\,\mathrm{MPa}$ ✓. Aluminijasti del je bližje meji, čeprav ima manjšo napetost.
5. Podaljška delov: $\Delta L_1 = 125 \cdot 1500/210\,000\,\mathrm{mm} \approx 0{,}893\,\mathrm{mm}$, $\Delta L_2 = 100 \cdot 1000/70\,000\,\mathrm{mm} \approx 1{,}429\,\mathrm{mm}$.
6. Skupni podaljšek: $\Delta L \approx 0{,}893 + 1{,}429 = 2{,}322\,\mathrm{mm}$. Krajši aluminijasti del prispeva več, ker ima trikrat manjši $E$.
7. Premer spodnjega dela: $d_2 = \sqrt{4 \cdot 300/\pi}\,\mathrm{mm} \approx 19{,}54\,\mathrm{mm}$. Vzdolžna deformacija $\varepsilon_2 = 100/70\,000 \approx 1{,}429 \cdot 10^{-3}$, prečna $\varepsilon_q = -0{,}33 \cdot 1{,}429 \cdot 10^{-3} \approx -4{,}71 \cdot 10^{-4}$.
8. $\Delta d_2 = -4{,}71 \cdot 10^{-4} \cdot 19{,}54\,\mathrm{mm} \approx -9{,}2 \cdot 10^{-3}\,\mathrm{mm}$.
9. Odgovor: $\sigma_1 = 125\,\mathrm{MPa}$, $\sigma_2 = 100\,\mathrm{MPa}$, oba dela zadoščata; palica se podaljša za približno $2{,}32\,\mathrm{mm}$, premer spodnjega dela pa se zmanjša za okoli $9\,\mathrm{\mu m}$.

### Primer 4 – zdaj ti

Ko stojiš na eni nogi, stegnenica nosi tlačno silo okoli $2{,}5\,\mathrm{kN}$. Prerez kortikalne kosti sredi stegnenice je okoli $370\,\mathrm{mm^2}$, modul elastičnosti $17\,\mathrm{GPa}$, opazovani odsek kosti je dolg $0{,}40\,\mathrm{m}$. Kolikšen je skrček odseka?

**Podatki:** $F = 2{,}5\,\mathrm{kN}$ (tlak), $A = 370\,\mathrm{mm^2}$, $E = 17\,\mathrm{GPa} = 17\,000\,\mathrm{MPa}$, $L_0 = 0{,}40\,\mathrm{m}$
**Iščemo:** $\sigma$, $\varepsilon$, $\Delta L$

:::formula
$\sigma = \dfrac{F}{A}$, $\varepsilon = \dfrac{\sigma}{E}$, $\Delta L = \varepsilon L_0$
:::

**Rešitev:**

1. Napetost: $\sigma = -2500/370\,\mathrm{MPa} \approx -6{,}76\,\mathrm{MPa}$ (tlak).
2. Zdaj ti: izračunaj deformacijo in skrček ter primerjaj napetost s tlačno trdnostjo kosti (okoli $190\,\mathrm{MPa}$).

:::premisli
Kolikšna sta $\varepsilon$ in $\Delta L$, in koliko je kost oddaljena od porušitve?
---
$\varepsilon = -6{,}76/17\,000 \approx -3{,}98 \cdot 10^{-4}$, $\Delta L \approx -3{,}98 \cdot 10^{-4} \cdot 400\,\mathrm{mm} \approx -0{,}16\,\mathrm{mm}$. Napetost je okoli $28$-krat manjša od tlačne trdnosti; kost je pri stoji močno predimenzionirana, ker mora prenesti še sunke, upogib in utrujanje.
:::

## Pogoste napake

- **Mešanje enot.** $1\,\mathrm{MPa} = 1\,\mathrm{N/mm^2}$, ne $\mathrm{N/m^2}$. Sila v $\mathrm{N}$ deljena s prerezom v $\mathrm{mm^2}$ da $\mathrm{MPa}$; če prerez pretvoriš v $\mathrm{m^2}$, dobiš $\mathrm{Pa}$. Najpogostejša napaka je faktor $10^6$.
- **»Daljša palica je šibkejša.«** Pri osni obremenitvi je napetost $F/A$ neodvisna od dolžine; dolžina vpliva le na podaljšek (in pri tlaku na uklon).
- **Hookov zakon nad mejo tečenja.** $\sigma = E\varepsilon$ velja le v linearnem področju. Napetosti nad $R_e$ ne izračunaš iz $E\varepsilon$, deformacij po tečenju pa ne iz $\sigma/E$.
- **Dopustna napetost iz trdnosti pri duktilnem materialu.** Za jeklo je merilo meja tečenja: $R_m/n$ bi dal prevelik $\sigma_{dop}$, palica bi trajno popustila že pod dopustno obtežbo.
- **Premer namesto polmera.** $A = \pi d^2/4 = \pi r^2$. Če v $\pi d^2$ pozabiš deliti s $4$, je prerez štirikrat prevelik in napetost štirikrat premajhna.

## Povzetek

- Normalna napetost $\sigma = F/A$, strižna $\tau = F_t/A$; enota $\mathrm{MPa} = \mathrm{N/mm^2}$.
- Specifična deformacija $\varepsilon = \Delta L/L_0$; prečna $\varepsilon_q = -\nu\varepsilon$.
- Hookov zakon $\sigma = E\varepsilon$ (in $\tau = G\gamma$), velja do meje proporcionalnosti; podaljšek palice $\Delta L = FL_0/(EA)$.
- Toplotno: $\varepsilon_T = \alpha\,\Delta T$; pri preprečenem raztezku $\sigma = -E\alpha\,\Delta T$.
- Natezni preizkus da $E$, $R_e$ (ali $R_{p0{,}2}$), $R_m$, raztezek po pretrgu in kontrakcijo.
- Dopustna napetost $\sigma_{dop} = R_e/n$ (duktilni) ali $R_m/n$ (krhki); kontrola $|\sigma| \leq \sigma_{dop}$, dimenzioniranje $A \geq F/\sigma_{dop}$.

## Za izpit

Znati moraš povedati:

- definicije normalne in strižne napetosti, specifične deformacije in Poissonovega števila z enotami;
- Hookov zakon s pogojem veljavnosti in izpeljavo $\Delta L = FL_0/(EA)$ ter splošne oblike $\Delta L = \int N/(EA)\,\mathrm{d}x$;
- potek nateznega preizkusa, značilne točke diagrama $\sigma$–$\varepsilon$ ter razliko med duktilnim in krhkim materialom;
- definicijo dopustne napetosti in zakaj je merilo pri jeklu $R_e$, pri krhkih materialih pa $R_m$;
- napetost pri preprečenem toplotnem raztezku.

### Naloga 1

Jeklena palica dolžine $2{,}0\,\mathrm{m}$ s prerezom $500\,\mathrm{mm^2}$ je vpeta med dve togi steni ($E = 210\,\mathrm{GPa}$, $\alpha = 12 \cdot 10^{-6}\,\mathrm{K^{-1}}$). Pri montaži ni napeta. (a) Kolikšna napetost in sila nastaneta, ko se palica segreje za $40\,\mathrm{K}$? (b) Kolikšna je napetost, če je bila pri montaži med palico in eno steno reža $0{,}50\,\mathrm{mm}$? (c) Ali je pri (a) napetost dopustna, če je $R_e = 235\,\mathrm{MPa}$ in $n = 1{,}5$?

**Rešitev:**

1. Prosti toplotni raztezek bi bil $\Delta L_T = \alpha\,\Delta T\,L_0 = 12 \cdot 10^{-6} \cdot 40 \cdot 2000\,\mathrm{mm} = 0{,}96\,\mathrm{mm}$.
2. (a) Steni podaljšek popolnoma preprečita, zato mora biti skupna deformacija nič: $\varepsilon = \sigma/E + \alpha\,\Delta T = 0$, torej $\sigma = -E\alpha\,\Delta T = -210\,000 \cdot 12 \cdot 10^{-6} \cdot 40\,\mathrm{MPa} = -100{,}8\,\mathrm{MPa}$ (tlak).
3. Sila: $N = \sigma A = -100{,}8 \cdot 500\,\mathrm{N} = -50\,400\,\mathrm{N} \approx -50{,}4\,\mathrm{kN}$.
4. (b) Palica se prvih $0{,}50\,\mathrm{mm}$ raztegne prosto, preprečenih je le $0{,}96 - 0{,}50 = 0{,}46\,\mathrm{mm}$. Torej $\sigma = -E \cdot 0{,}46/2000 = -210\,000 \cdot 0{,}46/2000\,\mathrm{MPa} = -48{,}3\,\mathrm{MPa}$.
5. (c) $\sigma_{dop} = 235/1{,}5 \approx 156{,}7\,\mathrm{MPa} \geq 100{,}8\,\mathrm{MPa}$ ✓; tlačeno palico pa je treba preveriti še na uklon.
6. Odgovor: (a) $-100{,}8\,\mathrm{MPa}$ in $-50{,}4\,\mathrm{kN}$, neodvisno od dolžine; (b) $-48{,}3\,\mathrm{MPa}$; (c) napetost je glede na tečenje dopustna. Zato imajo mostovi in cevovodi dilatacije.

### Naloga 2

Izpelji podaljšek navpične palice s stalnim prerezom $A$, dolžino $L$, gostoto $\rho$ in modulom $E$, ki visi pod lastno težo. Nato izračunaj, kako dolga bi lahko bila navpično viseča jeklena vrv ($\rho = 7850\,\mathrm{kg/m^3}$, $R_e = 235\,\mathrm{MPa}$, $E = 210\,\mathrm{GPa}$), preden bi na vrhu stekla, kakšna je ta dolžina pri varnostnem faktorju $1{,}5$ in kolikšen je tedaj podaljšek. Utemelji, zakaj rezultat ni odvisen od prereza.

**Rešitev:**

1. Os $x$ merimo od spodnjega konca navzgor. Prerez na višini $x$ nosi težo dela pod njim: $N(x) = \rho g A x$.
2. Napetost $\sigma(x) = N(x)/A = \rho g x$; največja je na vrhu, $\sigma_{max} = \rho g L$.
3. Podaljšek: $\Delta L = \int_0^L \frac{N(x)}{EA}\,\mathrm{d}x = \frac{\rho g}{E}\int_0^L x\,\mathrm{d}x = \frac{\rho g L^2}{2E}$, polovica podaljška, ki bi ga dala vsa teža na koncu.
4. Prerez se pokrajša, ker sta sila in prerez sorazmerna: dvakrat debelejša vrv je dvakrat težja.
5. Mejna dolžina: $\rho g L = R_e$, torej $L = 235 \cdot 10^6/(7850 \cdot 9{,}81)\,\mathrm{m} \approx 3050\,\mathrm{m}$.
6. Z varnostnim faktorjem: $L = 3050/1{,}5\,\mathrm{m} \approx 2030\,\mathrm{m}$.
7. Podaljšek pri tej dolžini: $\Delta L = 7850 \cdot 9{,}81 \cdot 2030^2/(2 \cdot 210 \cdot 10^9)\,\mathrm{m} \approx 0{,}76\,\mathrm{m}$.
8. Odgovor: $\Delta L = \rho g L^2/(2E)$; jeklena vrv lahko visi okoli $3\,\mathrm{km}$ do tečenja, z varnostjo okoli $2\,\mathrm{km}$, in se pri tem podaljša za približno $0{,}76\,\mathrm{m}$. Zato imajo zelo globoki rudniški jaški vrvi s spremenljivim prerezom ali vmesne postaje.

### Naloga 3

Armiranobetonski steber s kvadratnim prerezom $300\,\mathrm{mm} \times 300\,\mathrm{mm}$ ima štiri jeklene palice premera $20\,\mathrm{mm}$. Steber nosi osno tlačno silo $1200\,\mathrm{kN}$. $E_b = 30\,\mathrm{GPa}$ (beton), $E_s = 200\,\mathrm{GPa}$ (jeklo). Kolikšni sta napetosti v betonu in jeklu in kolikšen delež sile nosi jeklo?

**Rešitev:**

1. Naloga je statično nedoločena: ena ravnotežna enačba $N_b + N_s = F$ in dve neznanki. Dodamo pogoj skladnosti: beton in jeklo sta sprijeta, zato imata enako deformacijo $\varepsilon$.
2. Prereza: $A_s = 4 \cdot \pi \cdot 20^2/4\,\mathrm{mm^2} \approx 1257\,\mathrm{mm^2}$, $A_b = 90\,000 - 1257 \approx 88\,743\,\mathrm{mm^2}$.
3. Z Hookovim zakonom: $F = \varepsilon\,(E_bA_b + E_sA_s)$.
4. $E_bA_b + E_sA_s \approx 30\,000 \cdot 88\,743 + 200\,000 \cdot 1257\,\mathrm{N} \approx 2{,}914 \cdot 10^9\,\mathrm{N}$.
5. $\varepsilon = 1{,}2 \cdot 10^6/2{,}914 \cdot 10^9 \approx 4{,}12 \cdot 10^{-4}$ (skrček).
6. Napetosti: $\sigma_b = E_b\varepsilon \approx 30\,000 \cdot 4{,}12 \cdot 10^{-4}\,\mathrm{MPa} \approx 12{,}4\,\mathrm{MPa}$, $\sigma_s = E_s\varepsilon \approx 200\,000 \cdot 4{,}12 \cdot 10^{-4}\,\mathrm{MPa} \approx 82{,}4\,\mathrm{MPa}$ (oboje tlak).
7. Sila v jeklu: $N_s \approx 82{,}4 \cdot 1257\,\mathrm{N} \approx 103{,}5\,\mathrm{kN}$, torej okoli $8{,}6\,\%$ sile, čeprav je jekla le $1{,}4\,\%$ prereza.
8. Odgovor: beton je tlačen z okoli $12{,}4\,\mathrm{MPa}$, jeklo z okoli $82{,}4\,\mathrm{MPa}$; jeklo nosi približno $104\,\mathrm{kN}$ ali $8{,}6\,\%$ sile. Razmerje napetosti je razmerje modulov, $E_s/E_b \approx 6{,}7$.

## Drugače: Korak za korakom s številkami

Jeklena žica premera $2{,}0\,\mathrm{mm}$ in dolžine $3{,}0\,\mathrm{m}$ nosi $500\,\mathrm{N}$; $E = 210\,\mathrm{GPa}$, $R_e = 235\,\mathrm{MPa}$.

1. **Prerez v mm²:** $A = \pi \cdot 2{,}0^2/4\,\mathrm{mm^2} \approx 3{,}14\,\mathrm{mm^2}$.
2. **Napetost v MPa:** $\sigma = 500/3{,}14\,\mathrm{MPa} \approx 159\,\mathrm{MPa}$.
3. **Smo v linearnem področju?** $159 < 235$, da; Hookov zakon velja.
4. **Deformacija:** $\varepsilon = 159/210\,000 \approx 7{,}6 \cdot 10^{-4}$, torej $0{,}76\,‰$.
5. **Podaljšek v mm:** $\Delta L = 7{,}6 \cdot 10^{-4} \cdot 3000\,\mathrm{mm} \approx 2{,}3\,\mathrm{mm}$.
6. **Varnost:** $n = 235/159 \approx 1{,}48$; pri zahtevanem $1{,}5$ je žica malenkost prešibka, izbrali bi večji premer.

## Drugače: Bolj natančno

**Prava in inženirska napetost.** Inženirska napetost deli silo z začetnim prerezom $A_0$. Prava napetost deli s trenutnim prerezom $A$, prava (logaritemska) deformacija pa je $\varepsilon_t = \ln(L/L_0)$. Ker se pri plastični deformaciji prostornina ohranja, je $\sigma_t = \sigma(1 + \varepsilon)$ in $\varepsilon_t = \ln(1 + \varepsilon)$ do začetka vratu. Prava napetost do pretrga narašča; padec inženirskega diagrama je posledica zoženja, ne »slabljenja« materiala.

**Napetostni tenzor.** V splošnem napetost v točki ni en sam vektor: na vsako ploskvico skozi točko deluje drugačna napetost. Opiše jo simetrična matrika $3 \times 3$ (tenzor napetosti) s tremi normalnimi in tremi strižnimi komponentami. Hookov zakon za izotropen material poveže šest komponent napetosti s šestimi komponentami deformacije prek dveh konstant, $E$ in $\nu$. Enoosni zakon $\sigma = E\varepsilon$ je poseben primer.

**Mejna stanja namesto dopustne napetosti.** Sodobni standardi za projektiranje konstrukcij (evrokodi) namesto enega varnostnega faktorja uporabljajo delne faktorje: obtežbe povečajo (npr. stalne s $1{,}35$, spremenljive z $1{,}5$), trdnost materiala zmanjšajo (npr. jeklo z $\gamma_{M0} = 1{,}0$, beton z $1{,}5$). Ideja je ista kot pri dopustni napetosti, a negotovost obtežbe in materiala sta ločeni.

**Biološka tkiva.** Kite in vezi imajo diagram v obliki črke J: na začetku se ravnajo valovita kolagenska vlakna in je tkivo mehko, nato postane skoraj linearno. Zato $E$ za tkiva podajamo za linearni del, njihova trdnost pa je odvisna od hitrosti obremenjevanja (viskoelastičnost).

## Preveri se

? Katera trditev o diagramu napetost–deformacija konstrukcijskega jekla je pravilna?
- Natezna trdnost $R_m$ je napetost, pri kateri se preizkušanec pretrga.
~ Pretrg nastopi po zoženju, ko inženirska napetost že pada. $R_m$ je največja inženirska napetost, ne napetost ob pretrgu.
+ Naklon linearnega dela je modul elastičnosti $E$.
- Nad mejo tečenja še vedno velja $\sigma = E\varepsilon$, le z manjšim $E$.
~ Nad mejo tečenja se material plastično deformira; Hookov zakon tam ne velja in deformacija po razbremenitvi ne izgine.
> V linearnem področju je $\sigma = E\varepsilon$, zato je naklon premice $E$. $R_m$ je vrh diagrama, pretrg pa sledi pri nižji inženirski napetosti.

? Jeklena žica premera $2{,}0\,\mathrm{mm}$ nosi $500\,\mathrm{N}$. Kolikšna je napetost?
- približno $40\,\mathrm{MPa}$
~ Prerez si izračunal s $\pi d^2$ brez deljenja s $4$; prerez je bil štirikrat prevelik.
+ približno $159\,\mathrm{MPa}$
- približno $159\,\mathrm{Pa}$
~ Sila v $\mathrm{N}$ deljena s prerezom v $\mathrm{mm^2}$ da $\mathrm{N/mm^2} = \mathrm{MPa}$, ne $\mathrm{Pa}$.
> $A = \pi \cdot 2{,}0^2/4 \approx 3{,}14\,\mathrm{mm^2}$, $\sigma = 500/3{,}14 \approx 159\,\mathrm{N/mm^2} = 159\,\mathrm{MPa}$.

? Kje je napaka v tej rešitvi? »Palica s prerezom $200\,\mathrm{mm^2}$ nosi $40\,\mathrm{kN}$. (1) $A = 200\,\mathrm{mm^2} = 2 \cdot 10^{-4}\,\mathrm{m^2}$. (2) $\sigma = 40\,000/2 \cdot 10^{-4}\,\mathrm{Pa} = 2 \cdot 10^{8}\,\mathrm{Pa}$. (3) Torej $\sigma = 2000\,\mathrm{MPa}$, palica se bo pretrgala.«
- v koraku 1
~ $200\,\mathrm{mm^2} = 200 \cdot 10^{-6}\,\mathrm{m^2} = 2 \cdot 10^{-4}\,\mathrm{m^2}$; pretvorba je pravilna.
- v koraku 2
~ $40\,000/(2 \cdot 10^{-4}) = 2 \cdot 10^8$; račun je pravilen.
+ v koraku 3
> $2 \cdot 10^8\,\mathrm{Pa} = 200\,\mathrm{MPa}$, ne $2000\,\mathrm{MPa}$ ($1\,\mathrm{MPa} = 10^6\,\mathrm{Pa}$). Hitreje: $40\,000\,\mathrm{N}/200\,\mathrm{mm^2} = 200\,\mathrm{MPa}$.

? Jeklena in aluminijasta palica enakih mer nosita enako natezno silo. Kako se primerjata?
- Aluminij ima trikrat večjo napetost in enak podaljšek.
~ Napetost je $F/A$ in ni odvisna od materiala. Material določi deformacijo.
+ Napetosti sta enaki, aluminij se podaljša približno trikrat bolj.
- Jeklo ima večjo napetost, ker je močnejše.
~ Trdnost pove, koliko napetosti material prenese, ne kolikšna napetost v njem nastane.
> $\sigma = F/A$ je pri obeh enaka. Ker je $E_{Al} \approx 70\,\mathrm{GPa}$ trikrat manjši od $E_{jeklo} \approx 210\,\mathrm{GPa}$, je $\varepsilon = \sigma/E$ pri aluminiju trikrat večja.

? Natezna palica iz jekla je imela premer $16\,\mathrm{mm}$. Po letih v vlažnem prostoru jo je korozija stanjšala na $14\,\mathrm{mm}$. Za koliko se je pri isti obtežbi povečala napetost?
- za okoli $14\,\%$
~ Primerjal si premera ($16/14 \approx 1{,}14$). Napetost je obratno sorazmerna s prerezom, ta pa s kvadratom premera.
+ za okoli $31\,\%$
- ne spremeni se, ker se obtežba ni spremenila
~ Sila je ista, prerez pa manjši; napetost $F/A$ zato naraste.
> $\sigma_2/\sigma_1 = A_1/A_2 = (16/14)^2 \approx 1{,}31$. Palica, ki je bila na meji dopustne napetosti, je zdaj nad njo – zato pri pregledih merimo preostale premere.

:::simboli
\sigma | normalna napetost | \sigma = \frac{F}{A} | MPa | pozitivna je nateg
\tau | strižna napetost | \tau = \frac{F_t}{A} | MPa
F | osna sila | | N
F_t | sila vzporedno s ploskvijo | | N
A | prerez (ploščina) | A = \frac{\pi d^2}{4} | mm^2 | za okrogel prerez
\varepsilon | specifična deformacija | \varepsilon = \frac{\Delta L}{L_0} | –
\Delta L | podaljšek | \Delta L = \frac{F L_0}{E A} | mm
L_0 | začetna dolžina | | mm
\varepsilon_q | prečna deformacija | \varepsilon_q = -\nu\,\varepsilon | –
\nu | Poissonovo število | \nu = -\frac{\varepsilon_q}{\varepsilon} | – | za kovine okoli 0,3
\nu_2 | Poissonovo število spodnjega dela | | –
E | modul elastičnosti | \sigma = E\,\varepsilon | GPa
G | strižni modul | G = \frac{E}{2(1 + \nu)} | GPa
\gamma | strižna deformacija | \tau = G\gamma | rad
N | osna sila v prerezu (funkcija lege $x$) | | N
x | lega prereza vzdolž palice | | m
\varepsilon_T | toplotna deformacija | \varepsilon_T = \alpha\,\Delta T | –
\alpha | temperaturni razteznostni koeficient | | K^{-1}
\Delta T | sprememba temperature | | K
R_e | meja tečenja | | MPa
R_m | natezna trdnost | | MPa
\sigma_{dop} | dopustna napetost | \sigma_{dop} = \frac{R_e}{n} | MPa
n | varnostni faktor | | –
d | premer | | mm
m | masa | | kg
g | težni pospešek | | m/s^2
N_i | osna sila v i-tem delu | | N
\sigma_i | napetost v i-tem delu | \sigma_i = \frac{N_i}{A_i} | MPa
A_i | prerez i-tega dela | | mm^2
L_i | dolžina i-tega dela | | mm
E_i | modul elastičnosti i-tega dela | | MPa
i | zaporedna številka dela palice | | –
\Delta d | sprememba premera | \Delta d = \varepsilon_q d | mm
:::
