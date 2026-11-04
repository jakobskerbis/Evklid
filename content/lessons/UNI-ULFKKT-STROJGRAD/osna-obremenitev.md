---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nad kuhinjskim pultom visi obešalo za lonce na štirih jeklenih palicah. Vsaka je dolga $0{,}8\,\mathrm{m}$ in ima premer $5\,\mathrm{mm}$. Nanj obesiš posodo, skupaj $16\,\mathrm{kg}$. V isti kuhinji v pečico vstaviš jekleno rešetko, široko $450\,\mathrm{mm}$, in pečico segreješ z $20\,^\circ\mathrm{C}$ na $220\,^\circ\mathrm{C}$.

Kaj jeklo podaljša bolj: $16\,\mathrm{kg}$ loncev ali vroča pečica?

Odgovor preseneti. Vsaka palica obešala nosi približno $39\,\mathrm{N}$ in se podaljša za komaj $0{,}008\,\mathrm{mm}$. Rešetka v pečici se podaljša za cel milimeter, več kot stokrat bolj. Če je rešetka vpeta med togi steni in se ne more raztegniti, v njej nastane velika **toplotna napetost**.

Oba pojava sodita k **osni obremenitvi**: sila deluje vzdolž osi palice, palica se enakomerno podaljša ali skrajša. Iz tega računamo vijake, vrvi, stebre, cevi in tirnice.

## Razlaga

**Iz preizkusa do pravila.** Iz prejšnje teme poznaš napetost $\sigma = F/A$, deformacijo $\varepsilon = \Delta L / L$ in Hookov zakon $\sigma = E\varepsilon$. Zdaj jih uporabimo na celi palici. Najprej pa preizkus: palice za obešalo obremenjujemo in merimo podaljšek $\Delta L$. Izhodiščna palica a je jeklena, $F = 1000\,\mathrm{N}$, $L = 1\,\mathrm{m}$, $A = 10\,\mathrm{mm^2}$.

| Palica | Kaj je drugače kot pri a | $\Delta L$ [mm] |
|---|---|---|
| a | nič | 0,50 |
| b | dvakrat večja sila | 1,00 |
| c | dvakrat daljša | 1,00 |
| d | dvakrat večji presek | 0,25 |
| e | aluminij namesto jekla | 1,43 |

Primerjaj vrstice. Dvakratna sila da dvakratni podaljšek. Dvakratna dolžina tudi. Dvakratni presek ga razpolovi. Aluminij se pri enaki sili podaljša skoraj trikrat bolj, ker je mehkejši: njegov modul elastičnosti je $E \approx 70\,\mathrm{GPa}$, jeklo ima $E \approx 200\,\mathrm{GPa}$.

:::premisli
Jeklena palica je trikrat daljša od a in ima dvakrat večji presek, sila je enaka. Napovej njen podaljšek.
---
$0{,}75\,\mathrm{mm}$. Dolžina ga potroji, presek razpolovi: $0{,}50\,\mathrm{mm} \cdot 3 / 2 = 0{,}75\,\mathrm{mm}$.
:::

**Pravilo.** Podaljšek je sorazmeren s silo in dolžino ter obratno sorazmeren z modulom in presekom:

$$\Delta L = \frac{F L}{E A}$$

Ni nova fizika: v $\Delta L = \varepsilon L$ vstavi $\varepsilon = \sigma / E$ (Hookov zakon), nato še $\sigma = F / A$.

**Predpostavke.** Palica je ravna in prizmatična (stalen prerez $A$), material je homogen in linearno elastičen: Hookov zakon $\sigma = E\varepsilon$ velja do meje proporcionalnosti $\sigma_\mathrm{p}$. Notranjo osno silo $N$ dobimo z **metodo prereza**: palico v mislih prerežemo in iz ravnovesja enega dela izračunamo $N$ (natezna je pozitivna). Predpostavimo, da deluje v težišču prereza.

**Trditev.** Če ob teh predpostavkah prerezi ostanejo ravni, pravokotni na os in med seboj vzporedni (Bernoullijeva hipoteza za osno obremenitev), potem je normalna napetost po prerezu enakomerna, $\sigma = N/A$.

*Dokaz.* Dva prereza na razdalji $\mathrm{d}x$ po hipotezi ostaneta ravna in vzporedna, torej se le vzporedno odmakneta, zato imajo vsa vlakna med njima enako deformacijo $\varepsilon$. Po Hookovem zakonu je povsod enaka tudi $\sigma = E\varepsilon$. Ravnovesje dela palice da $N = \int_A \sigma\,\mathrm{d}A = \sigma A$. $\square$

Blizu mest, kjer sila vstopa v palico ali se prerez nenadno spremeni, napetost ni enakomerna; po **Saint-Venantovem načelu** se izravna na razdalji približno ene širine prereza. Če se $N$, $E$ ali $A$ spreminjajo po odsekih, podaljške odsekov seštejemo, $\Delta L = \sum_i \frac{N_i L_i}{E_i A_i}$, pri zveznem spreminjanju pa $\Delta L = \int_0^L \frac{N(x)}{E A(x)}\,\mathrm{d}x$.

Produkt $EA$ imenujemo **osna togost preseka**. Palica se obnaša kot vzmet s konstanto $k = EA/L$: daljša palica je mehkejša vzmet. Pri nategu je $F > 0$ in $\Delta L > 0$, pri tlaku sta obe negativni. Formula velja, dokler je $|\sigma|$ pod mejo proporcionalnosti $\sigma_\mathrm{p}$.

Natezana palica se hkrati prečno zoži: prečna deformacija je $\varepsilon_\mathrm{q} = -\nu\,\varepsilon$, kjer je $\nu$ Poissonovo število (jeklo $\nu \approx 0{,}3$).

**Trdnostni pogoj.** Palica je pravilno dimenzionirana, če je $|\sigma| = |N|/A \le \sigma_\mathrm{dop} = R_\mathrm{e}/S$, kjer je $R_\mathrm{e}$ meja tečenja in $S > 1$ varnostni faktor. Pri tlaku vitke palice preverimo še **uklon**: vitka tlačena palica se lahko izboči vstran, preden doseže mejo tečenja.

Pozor na enote. Najlažje je računati v $\mathrm{N}$ in $\mathrm{mm}$, saj je $1\,\mathrm{MPa} = 1\,\mathrm{N/mm^2}$ in $200\,\mathrm{GPa} = 200\,000\,\mathrm{MPa}$.

**Toplota.** Ko jekleno palico segrejemo za $\Delta T$, se podaljša tudi brez sile. Meritve pokažejo isti vzorec: dvakrat daljša palica se podaljša dvakrat bolj, dvakrat večje segretje prav tako. Snov opisuje **temperaturni razteznostni koeficient** $\alpha$ (jeklo $12 \cdot 10^{-6}\,\mathrm{K^{-1}}$, aluminij $23 \cdot 10^{-6}\,\mathrm{K^{-1}}$):

$$\Delta L_T = \alpha\, \Delta T\, L$$

Presek pri tem ne igra vloge. Toplotna deformacija je $\varepsilon_T = \alpha\,\Delta T$.

**Vpeta palica.** Kaj, če palico vpnemo med togi steni in jo segrejemo? Pomaga miselni poskus v dveh korakih:

1. Desno steno odmaknemo. Palica se prosto podaljša za $\alpha\,\Delta T\,L$, napetosti ni.
2. Steno vrnemo. Potisniti mora palico nazaj za enak kos, torej s tlačno silo $F$, za katero velja $\dfrac{F L}{E A} = \alpha\,\Delta T\, L$.

Enačbo delimo z $L$ in pomnožimo z $E$, pa dobimo $F/A = E\,\alpha\,\Delta T$. Ker sila tlači, napetost dobi minus:

$$\sigma_T = -E\,\alpha\,\Delta T$$

Minus pomeni tlak. Ohlajena vpeta palica ($\Delta T < 0$) je napeta natezno.

**Statično nedoločeni primeri.** Vpeta palica je statično nedoločena: ravnovesje pove le, da sta reakciji sten enako veliki, ne pa, kolikšni. Manjkajočo enačbo da **pogoj skladnosti deformacij**: celotni podaljšek mora biti tak, kot ga dopuščajo podpore. Pri tem seštevamo mehansko in toplotno deformacijo (superpozicija), $\varepsilon = \frac{\sigma}{E} + \alpha\,\Delta T$. Postopek je vedno enak: (1) ravnovesje, (2) skladnost deformacij, (3) Hookov zakon s toplotnim členom. Za vpeto palico: $\varepsilon = 0$, zato $\sigma = -E\alpha\,\Delta T$.

:::premisli
Imaš dve enaki jekleni palici, vpeti med stene, ena je dolga $0{,}5\,\mathrm{m}$, druga $5\,\mathrm{m}$. Obe segreješ za $30\,\mathrm{K}$. Daljša bi se prosto podaljšala desetkrat bolj. Ima zato tudi večjo toplotno napetost? Razloži brez formule.
---
Napetost je enaka. Daljša palica bi se prosto res podaljšala desetkrat bolj, a jo je treba stisniti za desetkrat daljši kos na desetkrat daljši dolžini. Deformacija, ki jo stena prepreči, je v obeh $\alpha\,\Delta T$.
:::

Če je med palico in steno reža $\delta$, se palica najprej prosto podaljša. Napetost začne rasti šele, ko se reža zapre. Stena tedaj prepreči samo preostanek $\alpha\,\Delta T\,L - \delta$, zato je za $\alpha\,\Delta T\,L > \delta$ napetost $\sigma = -E\,\dfrac{\alpha\,\Delta T\,L - \delta}{L}$.

## Rešeni primeri

### Primer 1: polica na jekleni palici

Polica s težko litoželezno posodo visi na jekleni palici, dolgi $1{,}5\,\mathrm{m}$, s presekom $20\,\mathrm{mm^2}$. Palica nosi silo $400\,\mathrm{N}$. Za koliko se podaljša?

**Podatki:** $F = 400\,\mathrm{N}$, $L = 1{,}5\,\mathrm{m} = 1500\,\mathrm{mm}$, $A = 20\,\mathrm{mm^2}$, $E = 200\,000\,\mathrm{MPa}$
**Iščemo:** podaljšek $\Delta L$

:::formula
$\sigma = \dfrac{F}{A}$, $\varepsilon = \dfrac{\sigma}{E}$, $\Delta L = \varepsilon L$ (skupaj $\Delta L = \dfrac{FL}{EA}$)
:::

**Rešitev:**

1. Napetost, da vidimo, ali smo v elastičnem območju: $\sigma = \dfrac{400\,\mathrm{N}}{20\,\mathrm{mm^2}} = 20\,\mathrm{MPa}$. To je daleč pod mejo jekla.
2. Deformacija: $\varepsilon = \dfrac{20\,\mathrm{MPa}}{200\,000\,\mathrm{MPa}} = 0{,}0001$.
3. Podaljšek: $\Delta L = 0{,}0001 \cdot 1500\,\mathrm{mm} = 0{,}15\,\mathrm{mm}$.
4. Odgovor: palica se podaljša za $0{,}15\,\mathrm{mm}$, kar s prostim očesom ni vidno.

### Primer 2: aluminijasta letev nad štedilnikom

Aluminijasta letev za kuhinjske pripomočke je dolga $800\,\mathrm{mm}$. Ko kuhaš, se segreje z $20\,^\circ\mathrm{C}$ na $60\,^\circ\mathrm{C}$. Za koliko se prosto podaljša? Kolikšna napetost bi nastala, če bi bila trdno vpeta med dve togi omarici?

**Podatki:** $L = 800\,\mathrm{mm}$, $\Delta T = 40\,\mathrm{K}$, $\alpha = 23 \cdot 10^{-6}\,\mathrm{K^{-1}}$, $E = 70\,000\,\mathrm{MPa}$
**Iščemo:** prosti podaljšek $\Delta L_T$ in napetost $\sigma_T$ pri vpetju

:::formula
$\Delta L_T = \alpha\,\Delta T\,L$, $\quad \sigma_T = -E\,\alpha\,\Delta T$
:::

**Rešitev:**

1. Prosti podaljšek: $\Delta L_T = 23 \cdot 10^{-6}\,\mathrm{K^{-1}} \cdot 40\,\mathrm{K} \cdot 800\,\mathrm{mm} \approx 0{,}74\,\mathrm{mm}$.
2. Pri vpetju stena prepreči celotno toplotno deformacijo $\varepsilon_T = \alpha\,\Delta T = 0{,}00092$.
3. Napetost: $\sigma_T = -70\,000\,\mathrm{MPa} \cdot 0{,}00092 \approx -64{,}4\,\mathrm{MPa}$.
4. Odgovor: prosta letev se podaljša za približno $0{,}74\,\mathrm{mm}$. Vpeta bi bila stisnjena z napetostjo okoli $64\,\mathrm{MPa}$, kar je za tanko letev dovolj, da se izboči.

### Primer 3: rešetka v pečici z režo

Jeklena rešetka je dolga $450\,\mathrm{mm}$. Med njo in stenama pečice je pri $20\,^\circ\mathrm{C}$ skupna reža $0{,}6\,\mathrm{mm}$. Pri kateri temperaturi se rešetka dotakne obeh sten? Kolikšna napetost je v njej pri $220\,^\circ\mathrm{C}$, če sta steni togi? Kolikšna bi morala biti reža, da napetost pri $220\,^\circ\mathrm{C}$ ne preseže $100\,\mathrm{MPa}$ (tlak)?

**Podatki:** $L = 450\,\mathrm{mm}$, $\delta = 0{,}6\,\mathrm{mm}$, $T_0 = 20\,^\circ\mathrm{C}$, $T = 220\,^\circ\mathrm{C}$, $\alpha = 12 \cdot 10^{-6}\,\mathrm{K^{-1}}$, $E = 200\,000\,\mathrm{MPa}$
**Iščemo:** temperaturo dotika $T_d$, napetost $\sigma$ pri $220\,^\circ\mathrm{C}$ in najmanjšo režo $\delta_\mathrm{min}$ za $|\sigma| \le 100\,\mathrm{MPa}$

:::formula
Dotik: $\alpha\,\Delta T_d\,L = \delta$. Napetost: $\sigma = -E\,\dfrac{\alpha\,\Delta T\,L - \delta}{L}$
:::

**Rešitev:**

1. Reža se zapre, ko je prosti podaljšek enak $\delta$: $\Delta T_d = \dfrac{0{,}6\,\mathrm{mm}}{12 \cdot 10^{-6}\,\mathrm{K^{-1}} \cdot 450\,\mathrm{mm}} \approx 111\,\mathrm{K}$.
2. Temperatura dotika: $T_d \approx 20\,^\circ\mathrm{C} + 111\,\mathrm{K} \approx 131\,^\circ\mathrm{C}$.
3. Pri $220\,^\circ\mathrm{C}$ je $\Delta T = 200\,\mathrm{K}$, prosti podaljšek bi bil $12 \cdot 10^{-6} \cdot 200 \cdot 450\,\mathrm{mm} = 1{,}08\,\mathrm{mm}$.
4. Steni preprečita le del nad režo: $1{,}08\,\mathrm{mm} - 0{,}6\,\mathrm{mm} = 0{,}48\,\mathrm{mm}$.
5. Preprečena deformacija: $\varepsilon = \dfrac{0{,}48\,\mathrm{mm}}{450\,\mathrm{mm}} \approx 0{,}00107$, napetost $\sigma \approx -200\,000\,\mathrm{MPa} \cdot 0{,}00107 \approx -213\,\mathrm{MPa}$.
6. Obratno vprašanje: pri $|\sigma| = 100\,\mathrm{MPa}$ sme stena preprečiti le $\dfrac{100\,\mathrm{MPa}}{200\,000\,\mathrm{MPa}} \cdot 450\,\mathrm{mm} = 0{,}225\,\mathrm{mm}$.
7. Ostanek mora pobrati reža: $\delta_\mathrm{min} = 1{,}08\,\mathrm{mm} - 0{,}225\,\mathrm{mm} = 0{,}855\,\mathrm{mm}$.
8. Odgovor: rešetka se sten dotakne pri okoli $131\,^\circ\mathrm{C}$; pri $220\,^\circ\mathrm{C}$ bi bila stisnjena z okoli $213\,\mathrm{MPa}$, blizu meje tečenja navadnega jekla. Za največ $100\,\mathrm{MPa}$ bi potrebovali režo vsaj $0{,}86\,\mathrm{mm}$. Zato prave rešetke v pečici samo ležijo na vodilih in lahko drsijo.

### Primer 4: zdaj ti

Kuhinjska svetilka visi na jekleni žici, dolgi $2\,\mathrm{m}$, s premerom $2\,\mathrm{mm}$. Ko jo obesiš, se žica podaljša za $0{,}5\,\mathrm{mm}$. S kolikšno silo vleče svetilka?

**Podatki:** $L = 2000\,\mathrm{mm}$, $d = 2\,\mathrm{mm}$, $\Delta L = 0{,}5\,\mathrm{mm}$, $E = 200\,000\,\mathrm{MPa}$
**Iščemo:** silo $F$

:::formula
$F = \dfrac{E A\,\Delta L}{L}$, $\quad A = \dfrac{\pi d^2}{4}$
:::

**Rešitev:**

1. Neznanka je sila, zato $\Delta L = \dfrac{FL}{EA}$ obrnemo v $F = \dfrac{EA\,\Delta L}{L}$.
2. Presek: $A = \dfrac{\pi \cdot (2\,\mathrm{mm})^2}{4} \approx 3{,}14\,\mathrm{mm^2}$.
3. Vstavi in izračunaj sam, nato preveri:

:::premisli
Koliko je $F$? Kolikšni masi svetilke to ustreza?
---
$F = \dfrac{200\,000\,\mathrm{MPa} \cdot 3{,}14\,\mathrm{mm^2} \cdot 0{,}5\,\mathrm{mm}}{2000\,\mathrm{mm}} \approx 157\,\mathrm{N}$, kar ustreza masi okoli $16\,\mathrm{kg}$ ($m = F/g$).
:::

## Pogoste napake

- **Mešanje metrov in milimetrov.** Kdor vstavi $L$ v metrih, $\Delta L$ pa v milimetrih, dobi modul, ki je tisočkrat napačen. Računaj v $\mathrm{N}$, $\mathrm{mm}$ in $\mathrm{MPa}$.
- **»Vpeta palica se ne podaljša, torej v njej ni napetosti.«** Ravno obratno: napetost nastane zato, ker stena prepreči podaljšek, ki bi ga palica sicer imela. Napetost se ravna po *preprečeni* deformaciji $\alpha\,\Delta T$.
- **Napačen predznak.** Segreta vpeta palica bi se rada podaljšala, stena jo potiska nazaj, zato je **stisnjena**, ne natezno napeta. Natezno napetost dobiš pri ohlajanju.
- **»Daljša palica ima večjo toplotno napetost.«** Daljša se prosto podaljša bolj, a je tudi stisnjena na daljši dolžini. Dolžina se pokrajša: $\sigma_T = -E\alpha\,\Delta T$. Dolžina šteje le, ko je vmes reža.
- **»Enaka napetost, enak podaljšek.«** Pri enaki sili in preseku imata jeklo in aluminij enako $\sigma$, a aluminij se podaljša skoraj trikrat bolj, ker ima manjši $E$.

## Povzetek

- Osna obremenitev: sila vzdolž osi, napetost $\sigma = F/A$ je po preseku enakomerna.
- Podaljšek palice: $\Delta L = \dfrac{FL}{EA}$; $EA$ je osna togost, palica deluje kot vzmet s $k = EA/L$.
- Prosti toplotni raztezek: $\Delta L_T = \alpha\,\Delta T\,L$, ne glede na presek.
- Vpeta palica pri segretju: $\sigma_T = -E\alpha\,\Delta T$ (tlak), neodvisno od dolžine in preseka. Z režo $\delta$ šteje le preostanek $\alpha\,\Delta T\,L - \delta$.
- Računaj v $\mathrm{N}$, $\mathrm{mm}$, $\mathrm{MPa}$; jeklo $E = 200\,\mathrm{GPa}$, $\alpha = 12 \cdot 10^{-6}\,\mathrm{K^{-1}}$.

## Za izpit

Znati moraš povedati:

- predpostavke osne obremenitve (prizmatična palica, homogen linearno elastičen material, sila v težišču) in metodo prereza za notranjo silo $N$;
- dokaz, da je ob Bernoullijevi hipotezi $\sigma = N/A$ po prerezu enakomerna, in kje to ne velja (Saint-Venantovo načelo);
- izpeljavo $\Delta L = \frac{NL}{EA}$ in splošno $\Delta L = \int_0^L \frac{N}{EA}\,\mathrm{d}x$, tudi za palico pod lastno težo;
- trdnostni pogoj $|\sigma| \le R_\mathrm{e}/S$ in prečno deformacijo $\varepsilon_\mathrm{q} = -\nu\varepsilon$;
- reševanje statično nedoločenih primerov (ravnovesje, skladnost, $\varepsilon = \sigma/E + \alpha\,\Delta T$) in izpeljavo $\sigma_T = -E\alpha\,\Delta T$.

### Naloga 1

Med togi steni sta zaporedno vpeti jeklena palica ($L_1 = 300\,\mathrm{mm}$, $A_1 = 400\,\mathrm{mm^2}$, $E_1 = 200\,\mathrm{GPa}$, $\alpha_1 = 12 \cdot 10^{-6}\,\mathrm{K^{-1}}$) in aluminijasta palica ($L_2 = 200\,\mathrm{mm}$, $A_2 = 800\,\mathrm{mm^2}$, $E_2 = 70\,\mathrm{GPa}$, $\alpha_2 = 23 \cdot 10^{-6}\,\mathrm{K^{-1}}$), jeklena je pritrjena na levo steno. Pri montaži je med aluminijasto palico in desno steno reža $\delta = 0{,}1\,\mathrm{mm}$. Sklop enakomerno segrejemo za $\Delta T = 50\,\mathrm{K}$. (a) Pri katerem segretju se reža zapre? (b) Izračunaj napetosti v obeh palicah. (c) Za koliko in v katero smer se premakne stik palic?

**Rešitev:**

1. (a) Prosti podaljšek sklopa na kelvin: $\alpha_1 L_1 + \alpha_2 L_2 = 0{,}0036 + 0{,}0046 = 0{,}0082\,\mathrm{mm/K}$, zato se reža zapre pri $\Delta T_d = 0{,}1/0{,}0082 \approx 12{,}2\,\mathrm{K}$.
2. (b) Prosta podaljška pri $50\,\mathrm{K}$: jeklo $12 \cdot 10^{-6} \cdot 50 \cdot 300 = 0{,}18\,\mathrm{mm}$, aluminij $23 \cdot 10^{-6} \cdot 50 \cdot 200 = 0{,}23\,\mathrm{mm}$, skupaj $0{,}41\,\mathrm{mm}$.
3. Ravnovesje: palici sta zaporedni, zato v obeh deluje ista tlačna sila $N$.
4. Skladnost: skupni podaljšek sme biti le $\delta$, zato mora sila odvzeti $0{,}41 - 0{,}1 = 0{,}31\,\mathrm{mm}$: $N\big(\frac{L_1}{E_1 A_1} + \frac{L_2}{E_2 A_2}\big) = 0{,}31\,\mathrm{mm}$.
5. Podajnosti: $\frac{300}{200\,000 \cdot 400} = 3{,}75 \cdot 10^{-6}\,\mathrm{mm/N}$ in $\frac{200}{70\,000 \cdot 800} \approx 3{,}571 \cdot 10^{-6}\,\mathrm{mm/N}$, vsota $7{,}321 \cdot 10^{-6}\,\mathrm{mm/N}$.
6. $N = 0{,}31/(7{,}321 \cdot 10^{-6}) \approx 42\,340\,\mathrm{N}$, tlačna.
7. Napetosti: $\sigma_1 = -42\,340/400 \approx -105{,}9\,\mathrm{MPa}$, $\sigma_2 = -42\,340/800 \approx -52{,}9\,\mathrm{MPa}$.
8. (c) Jeklo se skupaj podaljša za $0{,}18 - 42\,340 \cdot 3{,}75 \cdot 10^{-6} \approx 0{,}18 - 0{,}159 = 0{,}021\,\mathrm{mm}$; za kontrolo aluminij za $0{,}23 - 0{,}151 = 0{,}079\,\mathrm{mm}$, vsota je $0{,}1\,\mathrm{mm} = \delta$.
9. Odgovor: reža se zapre pri segretju okoli $12\,\mathrm{K}$; pri $50\,\mathrm{K}$ je jeklo stisnjeno z okoli $106\,\mathrm{MPa}$, aluminij z okoli $53\,\mathrm{MPa}$; stik se premakne za okoli $0{,}021\,\mathrm{mm}$ proti desni steni.

### Naloga 2

Navedi predpostavke, pri katerih je normalna napetost v osno obremenjeni palici enakomerna. Izpelji $\Delta L = \int_0^L \frac{N(x)}{E A(x)}\,\mathrm{d}x$ in iz nje podaljšek prizmatične palice, ki visi pod lastno težo. Utemelji, ali se ta podaljšek zmanjša, če palici povečamo presek, in ga izračunaj za jekleno palico dolžine $100\,\mathrm{m}$ ($\rho = 7850\,\mathrm{kg/m^3}$, $E = 200\,\mathrm{GPa}$, $g = 9{,}81\,\mathrm{m/s^2}$).

**Rešitev:**

1. Predpostavke: ravna palica, homogen linearno elastičen material, $N$ v težišču, prerezi ostanejo ravni (Bernoulli), opazujemo prerez dovolj daleč od vnosa sile (Saint-Venant). Tedaj $\sigma = N/A$.
2. Košček dolžine $\mathrm{d}x$ ima $\varepsilon = \frac{\sigma}{E} = \frac{N(x)}{E A(x)}$ in se podaljša za $\varepsilon\,\mathrm{d}x$.
3. Seštejemo vse koščke: $\Delta L = \int_0^L \frac{N(x)}{E A(x)}\,\mathrm{d}x$.
4. Lastna teža: z $x$ od spodnjega konca prerez na višini $x$ nosi težo dela pod seboj, $N(x) = \rho g A x$.
5. $\Delta L = \int_0^L \frac{\rho g A x}{E A}\,\mathrm{d}x = \frac{\rho g}{E} \cdot \frac{L^2}{2} = \frac{\rho g L^2}{2E}$.
6. $A$ se pokrajša: večji presek pomeni sorazmerno večjo težo, zato se podaljšek ne zmanjša.
7. Številsko: $\Delta L = \frac{7850 \cdot 9{,}81 \cdot 100^2}{2 \cdot 200 \cdot 10^9}\,\mathrm{m} \approx 1{,}93 \cdot 10^{-3}\,\mathrm{m}$.
8. Odgovor: podaljšek je $\frac{\rho g L^2}{2E}$, neodvisen od preseka; za $100\,\mathrm{m}$ jekla je okoli $1{,}9\,\mathrm{mm}$, največja napetost je na vrhu, kjer je $N = \rho g A L$, torej $\sigma = \rho g L \approx 7{,}7\,\mathrm{MPa}$.

## Drugače: Korak za korakom s številkami

Vzemimo jekleno palico, dolgo $1000\,\mathrm{mm}$, s presekom $50\,\mathrm{mm^2}$, vpeto med togi steni, in jo segrejemo za $50\,\mathrm{K}$. Sledimo milimetrom.

1. Brez sten: $\Delta L_T = 12 \cdot 10^{-6} \cdot 50 \cdot 1000\,\mathrm{mm} = 0{,}6\,\mathrm{mm}$.
2. Steni morata palico skrajšati za teh $0{,}6\,\mathrm{mm}$. Deformacija: $\varepsilon = 0{,}6 / 1000 = 0{,}0006$.
3. Napetost po Hookovem zakonu: $\sigma = 200\,000\,\mathrm{MPa} \cdot 0{,}0006 = 120\,\mathrm{MPa}$, tlačna.
4. Sila na steno: $F = \sigma A = 120\,\mathrm{MPa} \cdot 50\,\mathrm{mm^2} = 6000\,\mathrm{N}$, približno teža osmih odraslih ljudi.
5. Preizkus z dvakrat daljšo palico: v 1. koraku dobiš $1{,}2\,\mathrm{mm}$, v 2. koraku $1{,}2/2000$, kar je spet $0{,}0006$. Napetost ostane $120\,\mathrm{MPa}$.

## Drugače: Uporaba v stroki

- **Cevovodi v kemijskih obratih.** Jeklen parni cevovod dolžine $50\,\mathrm{m}$, segret z $20\,^\circ\mathrm{C}$ na $180\,^\circ\mathrm{C}$, se prosto podaljša za $12 \cdot 10^{-6} \cdot 160 \cdot 50\,000\,\mathrm{mm} = 96\,\mathrm{mm}$. Vpet bi imel $\sigma_T = -384\,\mathrm{MPa}$, več kot meja tečenja jekla S235. Zato ima cevovod fiksne točke, drsne podpore in kompenzatorje (U-loke ali valovite mehove).
- **Vijačni spoji.** Vijak na prirobnici reaktorja je vzmet s togostjo $EA/L$. S predpisanim prednapetjem (momentni ključ) mora tesnilo ostati stisnjeno tudi pri tlaku in segrevanju.
- **Dvižne naprave.** Vrvi, verige in obesne palice dimenzioniramo po trdnostnem pogoju z varnostnim faktorjem in jih po predpisih periodično preizkušamo.
- **Brezstični tir.** Varjene tirnice so vpete; zato jih polagajo pri nevtralni temperaturi, da poleti tlačna napetost ne povzroči izbočenja tira.
- **Natezni preizkus** (SIST EN ISO 6892-1): $E$ in $R_\mathrm{e}$ določimo iz diagrama $\sigma$–$\varepsilon$, podaljšek merimo z ekstenzometrom.

Toplotni raztezek je treba bodisi dopustiti bodisi zanj izračunati napetost.

## Drugače: Bolj natančno

Formula $\Delta L = FL/(EA)$ predpostavlja stalne $F$, $E$ in $A$ vzdolž palice. Splošno seštejemo deformacije kratkih kosov $\mathrm{d}x$:

$$\Delta L = \int_0^L \frac{N(x)}{E\,A(x)}\,\mathrm{d}x$$

kjer je $N(x)$ notranja osna sila. Za palico, ki visi pod lastno težo (gostota $\rho$), je $N(x) = \rho g A x$, merjeno od spodnjega konca, in

$$\Delta L = \frac{\rho g L^2}{2E}$$

To je polovica podaljška, ki bi ga povzročila vsa teža na spodnjem koncu.

Celotna deformacija je vsota mehanske in toplotne: $\varepsilon = \dfrac{\sigma}{E} + \alpha\,\Delta T$. Pri vpetju je $\varepsilon = 0$, od tod $\sigma = -E\alpha\,\Delta T$.

## Preveri se

? Jekleno palico obremenjujemo z vse večjo silo. Katera meritev ustreza elastični palici?
- $F$: 100, 200, 300 N; $\Delta L$: 0,05; 0,20; 0,45 mm
~ Tu podaljšek raste s kvadratom sile. Po $\Delta L = FL/(EA)$ je odvisnost linearna.
+ $F$: 100, 200, 300 N; $\Delta L$: 0,05; 0,10; 0,15 mm
- $F$: 100, 200, 300 N; $\Delta L$: 0,05; 0,05; 0,05 mm
~ Podaljšek ni odvisen samo od snovi in dolžine: večja sila da večjo napetost in večji podaljšek.
> V elastičnem območju je $\Delta L$ premo sorazmeren s $F$: dvakratna sila, dvakratni podaljšek.

? Enako dolgi palici, jeklena in aluminijasta, imata enak presek in nosita enako silo. Približno kolikokrat več se podaljša aluminijasta?
- Enako, ker imata enako napetost.
~ Napetost je res enaka, deformacija pa je $\sigma/E$ in je odvisna od snovi.
- Približno dvakrat, ker je $\alpha$ aluminija približno dvakrat večji.
~ Koeficient $\alpha$ opisuje raztezek zaradi toplote, ne zaradi sile. Tu šteje modul $E$.
+ Približno trikrat.
- Približno trikrat manj.
~ Mehkejša snov (manjši $E$) se podaljša bolj, ne manj, ker je $E$ v imenovalcu.
> $\Delta L \propto 1/E$, razmerje modulov je $200/70 \approx 2{,}9$.

? Zakaj je toplotna napetost v palici, vpeti med togi steni, neodvisna od njene dolžine?
- Ker se vpeta palica sploh ne podaljša, zato dolžina ni pomembna.
~ Da se ne podaljša, je res, a napetost vseeno nastane. Razlog je v razmerju preprečenega podaljška in dolžine.
+ Ker je preprečeni podaljšek sorazmeren z dolžino, deformacija $\alpha\,\Delta T$ pa zato ni odvisna od nje.
- Ni neodvisna: daljša palica ima večjo napetost, ker se bolj razteza.
~ Daljša se bolj razteza, a je stisnjena na daljši dolžini. Razmerje ostane $\alpha\,\Delta T$.
> $\sigma = E\,\dfrac{\alpha\,\Delta T\,L}{L} = E\alpha\,\Delta T$: dolžina se pokrajša.

? Palica, dolga $2\,\mathrm{m}$, s presekom $50\,\mathrm{mm^2}$ se pod silo $10\,\mathrm{kN}$ podaljša za $2\,\mathrm{mm}$. Kolikšen je modul elastičnosti?
- $200\,\mathrm{MPa}$
~ To dobiš, če $L$ vstaviš v metrih, $\Delta L$ pa v milimetrih. Obe dolžini morata biti v istih enotah.
+ $200\,\mathrm{GPa}$
- $0{,}2\,\mathrm{MPa}$
~ Tu je razmerje obrnjeno: deformacija je $\Delta L / L$, ne $L/\Delta L$.
> $E = \dfrac{FL}{A\,\Delta L} = \dfrac{10\,000\,\mathrm{N} \cdot 2000\,\mathrm{mm}}{50\,\mathrm{mm^2} \cdot 2\,\mathrm{mm}} = 200\,000\,\mathrm{MPa} = 200\,\mathrm{GPa}$.

? Jeklena cev za vročo vodo je trdno pritrjena na obeh koncih. Ko steče vroča voda, se segreje za $30\,\mathrm{K}$. Kolikšna napetost nastane v cevi?
- $72\,\mathrm{MPa}$, natezna
~ Segreta cev bi se rada podaljšala, pritrditvi jo potiskata nazaj, zato je stisnjena.
- $0\,\mathrm{MPa}$, ker se cev ne more podaljšati
~ Napetost nastane prav zato, ker je podaljšek preprečen.
+ $72\,\mathrm{MPa}$, tlačna
- Brez dolžine cevi je ni mogoče izračunati.
~ Pri vpetju brez reže se dolžina pokrajša: $\sigma = E\alpha\,\Delta T$.
> $\sigma = 200\,000\,\mathrm{MPa} \cdot 12 \cdot 10^{-6}\,\mathrm{K^{-1}} \cdot 30\,\mathrm{K} = 72\,\mathrm{MPa}$, tlačna. Zato imajo dolge cevi kompenzatorje.

:::simboli
L | dolžina palice | | m | ΔL je podaljšek palice
F | osna sila | F = \dfrac{E A\,\Delta L}{L} | N |
E | modul elastičnosti | | Pa | jeklo ≈ 200 GPa, aluminij ≈ 70 GPa
A | ploščina prečnega prereza | A = \dfrac{\pi d^2}{4} | m^2 | za okroglo palico
\Delta L_T | prosti toplotni podaljšek | \Delta L_T = \alpha\,\Delta T\,L | m |
\alpha | temperaturni razteznostni koeficient | | K^{-1} | jeklo 12 · 10⁻⁶ K⁻¹
T | temperatura palice | | K | ΔT je segretje palice
\sigma_T | toplotna napetost v vpeti palici | \sigma_T = -E\,\alpha\,\Delta T | Pa | negativna: tlačna napetost
N | notranja osna sila | | N | pri lastni teži N(x) = ρgAx
x | lega prereza, merjena od spodnjega konca | | m |
\rho | gostota materiala | | kg/m^3 |
g | težni pospešek | | m/s^2 | 9,81 m/s²
\sigma | normalna napetost | \sigma = \dfrac{F}{A} | Pa | v zgledih v MPa (N/mm²)
\varepsilon | deformacija (relativni podaljšek) | \varepsilon = \dfrac{\Delta L}{L} | – | po Hookovem zakonu ε = σ/E
\Delta T_d | segretje, pri katerem se reža zapre | \alpha\,\Delta T_d\,L = \delta | K |
\delta | reža med palico in steno | | m |
d | premer palice | | m |
\nu | Poissonovo število | \varepsilon_\mathrm{q} = -\nu\,\varepsilon | – | jeklo ≈ 0,3
R_\mathrm{e} | meja tečenja | | Pa |
S | varnostni faktor | \sigma_\mathrm{dop} = R_\mathrm{e}/S | – | S > 1
:::
