---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na gradbišču delovodja preizkusi dve armaturni palici iz iste šarže jekla. Tanjša ima premer $8\,\mathrm{mm}$ in se pretrga pri sili $28{,}1\,\mathrm{kN}$. Debelejša ima premer $16\,\mathrm{mm}$ in zdrži kar $112{,}6\,\mathrm{kN}$, torej štirikrat več. Vajenec sklepa: »Debelejša palica je iz štirikrat boljšega jekla.«

Ima prav? Poskusi odgovoriti, preden bereš naprej. Namig: premer se je podvojil, sila početverila.

Potrebuješ opis materiala, ki ni odvisen od velikosti kosa. Z njim izbereš jeklo za nosilec, preveriš dleto po kaljenju in oceniš, ali bo ograja na mrazu počila. Podatke dajo trije preizkusi: **natezni preizkus**, **merjenje trdote** in **preizkus žilavosti**.

## Razlaga

**1. Primerjaj tri palice.** Pri isti šarži jekla so izmerili še palico s premerom $12\,\mathrm{mm}$. Prečni presek okrogle palice je $S_0 = \pi d_0^2/4$:

| $d_0$ [mm] | $S_0$ [mm²] | $F_m$ [kN] | $F_m/S_0$ [MPa] |
|---|---|---|---|
| 8 | 50,3 | 28,1 | 559 |
| 12 | 113,1 | 63,3 | 560 |
| 16 | 201,1 | 112,6 | 560 |

Sile se zelo razlikujejo, količnik v zadnjem stolpcu pa skoraj nič. Vajenec torej nima prav: debelejša palica nosi več samo zato, ker ima večji presek. Jeklo je enako.

**2. Napetost.** Sila na enoto prečnega preseka se imenuje **napetost**:

$$\sigma = \frac{F}{S_0}$$

Enota je $\mathrm{N/mm^2}$, kar je isto kot $\mathrm{MPa}$. Največjo napetost, ki jo preizkušanec zdrži, imenujemo **natezna trdnost** $R_m$. Za našo šaržo je $R_m \approx 560\,\mathrm{MPa}$, ne glede na debelino.

**3. Natezni preizkus.** Standardni preizkušanec vpnemo v trgalni stroj in ga počasi raztezamo. Stroj sproti beleži silo $F$ in podaljšek $\Delta L$ merilne dolžine $L_0$. Relativni podaljšek je **raztezek**:

$$\varepsilon = \frac{\Delta L}{L_0}$$

Narišemo diagram napetost–raztezek. Opiši ga z besedami, kot bi ga skiciral na tablo:

- Od izhodišča gre najprej strma ravna črta. Po razbremenitvi se preizkušanec vrne na prvotno dolžino: to je **elastično** področje.
- Pri **meji tečenja** $R_e$ (če izrazite meje ni, vzamemo $R_{p0,2}$, napetost pri trajnem raztezku $0{,}2\,\%$) se črta prelomi. Od tu naprej ostane del podaljška trajno: **plastična** deformacija.
- Krivulja se še dviga do vrha, $R_m$. Tam se na enem mestu začne oblikovati **vrat**, zožitev.
- Potem krivulja pada do pretrga. Material ne postane šibkejši: presek v vratu se manjša, mi pa še vedno delimo z začetnim $S_0$.

**4. Isti naklon pri različnih jeklih.** Primerjaj začetni ravni del pri treh jeklih:

| jeklo | $R_e$ [MPa] | naklon $\sigma/\varepsilon$ [GPa] |
|---|---|---|
| konstrukcijsko S235 | 235 | 210 |
| armaturno B500B | 500 | 210 |
| vzmetno jeklo | 1200 | 210 |

Meja tečenja se spremeni za faktor pet, naklon pa ostane enak. Ta naklon je **modul elastičnosti** $E$, zakon pa je Hookov zakon:

$$\sigma = E \cdot \varepsilon$$

$E$ opisuje **togost**, ne trdnosti. Odvisen je predvsem od vezi med atomi v kristalni mreži, zato ga toplotna obdelava skoraj ne spremeni. Aluminij ima $E \approx 70\,\mathrm{GPa}$, zato se enako oblikovan aluminijast nosilec povesi približno trikrat bolj kot jeklen.

:::premisli
Ključavničar zamenja jekleni nosilec S235 z enako oblikovanim iz S355, da bi se manj povesil. Se bo res manj povesil pri enaki, majhni obremenitvi? Če ne, kaj bi moral spremeniti, da bi se?
---
Ne. V elastičnem področju je raztezek $\varepsilon = \sigma/E$, $E$ pa je pri obeh jeklih enak, $210\,\mathrm{GPa}$. Boljše jeklo prenese večjo obremenitev, preden se trajno ukrivi, poves pri enaki sili pa ostane enak. Togost poveča le večji presek ali drug material.
:::

**5. Duktilnost.** Po pretrgu sestavimo oba dela in izmerimo končno merilno dolžino $L_u$. **Raztezek po pretrgu** je

$$A = \frac{L_u - L_0}{L_0} \cdot 100\,\%$$

Duktilno jeklo (velik $A$) se pred lomom vidno deformira in s tem opozori. Zato armatura potrebuje tudi dovolj velik $A$.

**6. Trdota.** Trdota je odpornost proti vtiskanju trdega telesa v površino. Preizkus je hiter in kosa skoraj ne poškoduje:

- **Brinell (HB):** kroglico s premerom $D$ s silo $F$ vtisnemo v površino in izmerimo premer odtisa $d$. Manjši odtis pomeni večjo trdoto.
- **Vickers (HV):** vtiskamo diamantno piramido, merimo diagonalo odtisa. Primeren tudi za kaljeno jeklo.
- **Rockwell (HRC):** merimo globino vtiska diamantnega stožca; vrednost se odčita neposredno.

Za Brinell velja

$$\mathrm{HB} = \frac{0{,}102 \cdot 2F}{\pi D \left(D - \sqrt{D^2 - d^2}\right)}$$

($F$ v N, $D$ in $d$ v mm). Pri nelegiranih in malo legiranih jeklih je trdota povezana s trdnostjo: približno velja $R_m \approx 3{,}5 \cdot \mathrm{HB}$ v MPa. Ocena je groba, a trdoto izmeriš v minuti, natezni preizkus pa zahteva laboratorij.

**7. Žilavost.** Žilavost je sposobnost materiala, da pred lomom porabi veliko energije. Meri se s **Charpyjevim preizkusom**: težko nihalo z višine $h_1$ udari po preizkušancu z zarezo, ga prelomi in se dvigne le do $h_2$. Porabljena energija je

$$\mathrm{KV} = m g (h_1 - h_2)$$

v joulih. Opaziš vzorec: kaljeno jeklo je zelo trdo, a ima majhen $\mathrm{KV}$. Popuščeno jeklo je mehkejše in mnogo žilavejše. Trdota in žilavost sta pogosto nasprotji.

Pri jeklih s prostorsko centrirano kubično mrežo (feritna jekla) $\mathrm{KV}$ pod neko temperaturo strmo pade: to je **prehodna temperatura** med žilavim in krhkim lomom. Ploskovno centrirane kubične kovine (aluminij, baker, avstenitno nerjavno jeklo) tega prehoda nimajo.

:::premisli
Zakaj žilavost merimo s hitrim udarcem na preizkušanec z zarezo, ne s počasnim nateznim preizkusom gladke palice?
---
Ker sta zareza in hiter udarec najslabši možni pogoj, ki pospešuje krhki lom. Ograja, vijak ali nosilec imajo v praksi luknje, navoje in zvarne napake, obremenitev pa je lahko sunkovita. Gladka palica bi se pri počasnem vleku raztegnila in pokazala duktilnost, ki je v resničnem kosu morda ne bo.
:::

## Rešeni primeri

### Primer 1: natezna trdnost armature

Armaturno palico s premerom $12\,\mathrm{mm}$ pretrgamo pri največji sili $64{,}5\,\mathrm{kN}$. Začetna merilna dolžina je $60\,\mathrm{mm}$, po pretrgu je $67{,}8\,\mathrm{mm}$. Izračunaj natezno trdnost in raztezek po pretrgu.

**Podatki:** $d_0 = 12\,\mathrm{mm}$, $F_m = 64{,}5\,\mathrm{kN}$, $L_0 = 60\,\mathrm{mm}$, $L_u = 67{,}8\,\mathrm{mm}$
**Iščemo:** natezno trdnost $R_m$ in raztezek po pretrgu $A$

:::formula
$S_0 = \dfrac{\pi d_0^2}{4}$, $R_m = \dfrac{F_m}{S_0}$, $A = \dfrac{L_u - L_0}{L_0} \cdot 100\,\%$
:::

**Rešitev:**

1. Presek, ker trdnost računamo na začetni presek: $S_0 = \dfrac{\pi \cdot 12^2}{4}\,\mathrm{mm^2} \approx 113{,}1\,\mathrm{mm^2}$.
2. Silo pretvorimo v newtone, da dobimo $\mathrm{N/mm^2}$: $F_m = 64\,500\,\mathrm{N}$.
3. $R_m = \dfrac{64\,500\,\mathrm{N}}{113{,}1\,\mathrm{mm^2}} \approx 570\,\mathrm{MPa}$.
4. Trajni podaljšek: $67{,}8 - 60 = 7{,}8$ (v mm).
5. $A = \dfrac{7{,}8}{60} \cdot 100\,\% = 13\,\%$.
6. Odgovor: natezna trdnost je približno $570\,\mathrm{MPa}$, raztezek po pretrgu $13\,\%$.

### Primer 2: natezna vez na odru

Jeklena vez iz S235 dolžine $2{,}5\,\mathrm{m}$ in premera $10\,\mathrm{mm}$ drži del odra s silo $12\,\mathrm{kN}$. Ali ostane v elastičnem področju in za koliko se podaljša? $E = 210\,\mathrm{GPa}$, $R_e = 235\,\mathrm{MPa}$.

**Podatki:** $L_0 = 2{,}5\,\mathrm{m} = 2500\,\mathrm{mm}$, $d_0 = 10\,\mathrm{mm}$, $F = 12\,\mathrm{kN}$, $E = 210\,\mathrm{GPa} = 210\,000\,\mathrm{MPa}$, $R_e = 235\,\mathrm{MPa}$
**Iščemo:** napetost $\sigma$, primerjavo z $R_e$ in podaljšek $\Delta L$

:::formula
$\sigma = \dfrac{F}{S_0}$, $\varepsilon = \dfrac{\sigma}{E}$, $\Delta L = \varepsilon \cdot L_0$
:::

**Rešitev:**

1. Presek: $S_0 = \dfrac{\pi \cdot 10^2}{4}\,\mathrm{mm^2} \approx 78{,}54\,\mathrm{mm^2}$.
2. Napetost: $\sigma = \dfrac{12\,000\,\mathrm{N}}{78{,}54\,\mathrm{mm^2}} \approx 152{,}8\,\mathrm{MPa}$.
3. $152{,}8\,\mathrm{MPa} < 235\,\mathrm{MPa}$, zato je vez v elastičnem področju in Hookov zakon velja.
4. Raztezek: $\varepsilon = \dfrac{152{,}8}{210\,000} \approx 7{,}28 \cdot 10^{-4}$.
5. Podaljšek: $\Delta L \approx 7{,}28 \cdot 10^{-4} \cdot 2500\,\mathrm{mm} \approx 1{,}82\,\mathrm{mm}$.
6. Odgovor: vez ostane elastična in se podaljša za približno $1{,}8\,\mathrm{mm}$; po razbremenitvi se vrne na prvotno dolžino.

### Primer 3: katero jeklo je to?

Kovinar ima ploščo neznanega konstrukcijskega jekla. Če je S235, je njegova natezna trdnost med $360$ in $510\,\mathrm{MPa}$; če je S355, med $470$ in $630\,\mathrm{MPa}$. Z Brinellovim preizkusom (kroglica $D = 10\,\mathrm{mm}$, sila $29{,}42\,\mathrm{kN}$) izmeri odtis s premerom $4{,}8\,\mathrm{mm}$. Za katero jeklo verjetno gre?

**Podatki:** $D = 10\,\mathrm{mm}$, $F = 29\,420\,\mathrm{N}$, $d = 4{,}8\,\mathrm{mm}$, S235: $R_m = 360$ do $510\,\mathrm{MPa}$, S355: $R_m = 470$ do $630\,\mathrm{MPa}$
**Iščemo:** trdoto $\mathrm{HB}$, oceno $R_m$ in vrsto jekla

:::formula
$\mathrm{HB} = \dfrac{0{,}102 \cdot 2F}{\pi D \left(D - \sqrt{D^2 - d^2}\right)}$, nato $R_m \approx 3{,}5 \cdot \mathrm{HB}$
:::

**Rešitev:**

1. Pod korenom: $D^2 - d^2 = 100 - 23{,}04 = 76{,}96$, $\sqrt{76{,}96} \approx 8{,}773$.
2. Oklepaj: $10 - 8{,}773 = 1{,}227$ (v mm); to je globina odtisa krat dva.
3. Imenovalec: $\pi \cdot 10 \cdot 1{,}227 \approx 38{,}55$ (v $\mathrm{mm^2}$, dvakratna površina odtisa).
4. Števec: $0{,}102 \cdot 2 \cdot 29\,420 \approx 6002$.
5. $\mathrm{HB} \approx \dfrac{6002}{38{,}55} \approx 156$.
6. Ocena trdnosti: $R_m \approx 3{,}5 \cdot 156 = 546$ (v MPa).
7. $546\,\mathrm{MPa}$ je nad zgornjo mejo za S235 ($510\,\mathrm{MPa}$) in v območju S355.
8. Odgovor: plošča je najverjetneje iz S355. Pretvorba iz trdote je le ocena, zato za nosilno konstrukcijo vseeno zahtevamo atest.

### Primer 4: zdaj ti – jeklo za zimsko gradbišče

Jeklo za nosilce, ki bodo pozimi na prostem, mora imeti pri $-20\,^\circ\mathrm{C}$ udarno delo vsaj $27\,\mathrm{J}$. Charpyjevo nihalo ima maso $20\,\mathrm{kg}$ in ga spustimo z višine $1{,}50\,\mathrm{m}$. Pri $+20\,^\circ\mathrm{C}$ se po lomu dvigne do $1{,}10\,\mathrm{m}$, pri $-20\,^\circ\mathrm{C}$ pa do $1{,}40\,\mathrm{m}$. Ali jeklo ustreza?

**Podatki:** $m = 20\,\mathrm{kg}$, $g = 9{,}81\,\mathrm{m/s^2}$, $h_1 = 1{,}50\,\mathrm{m}$, $h_2 = 1{,}10\,\mathrm{m}$ (pri $+20\,^\circ\mathrm{C}$), $h_2 = 1{,}40\,\mathrm{m}$ (pri $-20\,^\circ\mathrm{C}$), zahteva $\mathrm{KV} \geq 27\,\mathrm{J}$
**Iščemo:** udarno delo $\mathrm{KV}$ pri obeh temperaturah

:::formula
$\mathrm{KV} = m g (h_1 - h_2)$
:::

**Rešitev:**

1. Pri $+20\,^\circ\mathrm{C}$: $\mathrm{KV} = 20 \cdot 9{,}81 \cdot 0{,}40 = 78{,}48$, torej okoli $78\,\mathrm{J}$. Jeklo je pri sobni temperaturi žilavo.
2. Pri $-20\,^\circ\mathrm{C}$ je razlika višin $1{,}50 - 1{,}40 = 0{,}10$ (v m).
3. Izračunaj $\mathrm{KV}$ pri $-20\,^\circ\mathrm{C}$ in ga primerjaj z zahtevo.

:::premisli
Koliko je $\mathrm{KV}$ pri $-20\,^\circ\mathrm{C}$ in ali jeklo ustreza?
---
$\mathrm{KV} = 20\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \cdot 0{,}10\,\mathrm{m} \approx 19{,}6\,\mathrm{J}$. To je manj kot $27\,\mathrm{J}$, zato jeklo ne ustreza. Pri mrazu je že pod prehodno temperaturo in se lomi krhko, čeprav ima pri sobni temperaturi kar $78\,\mathrm{J}$.
:::

## Pogoste napake

- **Sila namesto napetosti.** »Ta palica zdrži več, torej je boljše jeklo.« Sila je odvisna od velikosti kosa, material pa opisuje napetost $\sigma = F/S_0$. Pri primerjavi materialov vedno deli s presekom.
- **Premer namesto polmera.** $S_0 = \pi d_0^2$ je štirikrat preveč, napetost pa štirikrat premalo. Pravilno je $S_0 = \pi d_0^2/4 = \pi r^2$.
- **Trdnost zamenjaš s togostjo.** Močnejše jeklo se pri enaki sili ne povesi manj, ker imajo vsa jekla $E \approx 210\,\mathrm{GPa}$. Večja trdnost pomeni le, da trajna deformacija nastopi pozneje.
- **Trdo pomeni žilavo.** Kaljeno dleto je zelo trdo, a se ob udarcu lahko okruši. Visoka trdota pogosto pomeni manjšo žilavost; ravnotežje doseže popuščanje.
- **Žilavost je stalna lastnost.** Feritno jeklo, ki je pri sobni temperaturi žilavo, je pod prehodno temperaturo krhko. Žilavost vedno navedi skupaj s temperaturo preizkusa.

## Povzetek

- Napetost $\sigma = F/S_0$ (MPa = N/mm²) opisuje material neodvisno od velikosti kosa; raztezek $\varepsilon = \Delta L/L_0$.
- Natezni preizkus da $E$ (togost, Hookov zakon $\sigma = E\varepsilon$), mejo tečenja $R_e$ ali $R_{p0,2}$, natezno trdnost $R_m$ in raztezek po pretrgu $A$ (duktilnost).
- Vsa jekla imajo $E \approx 210\,\mathrm{GPa}$; trdnost se med jekli močno razlikuje, togost ne.
- Trdota (Brinell HB, Vickers HV, Rockwell HRC) je odpornost proti vtiskanju; pri jeklih približno $R_m \approx 3{,}5 \cdot \mathrm{HB}$.
- Žilavost meri Charpyjev preizkus z zarezo: $\mathrm{KV} = mg(h_1 - h_2)$ v J. Feritna jekla imajo prehodno temperaturo, pod katero se lomijo krhko.
- Trdota in žilavost sta pogosto v nasprotju: kaljenje poveča trdoto, popuščanje vrne žilavost.

## Za izpit

Znati moraš povedati:

- definicije napetosti $\sigma = F/S_0$ in raztezka $\varepsilon = \Delta L/L_0$ ter zakaj z njima opišemo material neodvisno od velikosti kosa;
- potek diagrama napetost–raztezek z elastičnim in plastičnim področjem ter definicije $R_e$, $R_{p0,2}$, $R_m$ in $A$;
- Hookov zakon, pogoj za njegovo veljavnost in razliko med togostjo ($E$) in trdnostjo ($R_e$, $R_m$);
- zakaj krivulja po $R_m$ pada, čeprav material ne postane šibkejši;
- postopke merjenja trdote po Brinellu, Vickersu in Rockwellu, Brinellovo enačbo in oceno $R_m \approx 3{,}5 \cdot \mathrm{HB}$ z območjem veljavnosti;
- Charpyjev preizkus, izpeljavo $\mathrm{KV} = mg(h_1 - h_2)$ iz ohranitve energije in pomen prehodne temperature.

### Naloga 1

Okrogel preizkušanec iz neznane kovine ima $d_0 = 10\,\mathrm{mm}$ in $L_0 = 50\,\mathrm{mm}$. Trgalni stroj izmeri: pri sili $5{,}5\,\mathrm{kN}$ je podaljšek $0{,}050\,\mathrm{mm}$ (ravni del diagrama); pri sili $21{,}2\,\mathrm{kN}$ je podaljšek $0{,}293\,\mathrm{mm}$; največja sila je $24{,}3\,\mathrm{kN}$; po pretrgu je $L_u = 56{,}0\,\mathrm{mm}$. (a) Izračunaj $E$ in presodi, ali je kovina jeklo ali aluminijeva zlitina. (b) Z računom pokaži, da je napetost pri $21{,}2\,\mathrm{kN}$ dogovorna meja tečenja $R_{p0,2}$. (c) Izračunaj $R_m$ in $A$. (d) Iz te kovine naredimo natezno vez dolžine $2{,}0\,\mathrm{m}$ za silo $30\,\mathrm{kN}$. Napetost ne sme preseči $R_{p0,2}/1{,}5$. Na voljo so palice s premeri $12$, $14$ in $16\,\mathrm{mm}$. Katero izbereš in za koliko se vez podaljša?

**Rešitev:**

1. Presek: $S_0 = \dfrac{\pi \cdot 10^2}{4}\,\mathrm{mm^2} \approx 78{,}54\,\mathrm{mm^2}$.
2. V ravnem delu: $\sigma = \dfrac{5500}{78{,}54} \approx 70{,}03\,\mathrm{MPa}$ in $\varepsilon = \dfrac{0{,}050}{50} = 0{,}001$.
3. $E = \dfrac{70{,}03}{0{,}001} = 70\,030\,\mathrm{MPa} \approx 70\,\mathrm{GPa}$. To je tretjina vrednosti za jeklo ($210\,\mathrm{GPa}$), torej gre za aluminijevo zlitino.
4. Pri $21{,}2\,\mathrm{kN}$: $\sigma = \dfrac{21\,200}{78{,}54} \approx 269{,}9\,\mathrm{MPa}$, celotni raztezek $\varepsilon = \dfrac{0{,}293}{50} = 0{,}00586$.
5. Elastični del raztezka bi po razbremenitvi izginil: $\varepsilon_\mathrm{el} = \dfrac{269{,}9}{70\,030} \approx 0{,}00385$.
6. Trajni del: $0{,}00586 - 0{,}00385 = 0{,}00201$, torej $0{,}2\,\%$. Po definiciji je zato $R_{p0,2} \approx 270\,\mathrm{MPa}$.
7. $R_m = \dfrac{24\,300}{78{,}54} \approx 309\,\mathrm{MPa}$ in $A = \dfrac{56{,}0 - 50}{50} \cdot 100\,\% = 12\,\%$.
8. Dopustna napetost: $\dfrac{270}{1{,}5} = 180\,\mathrm{MPa}$. Potrebni presek: $\dfrac{30\,000}{180} \approx 166{,}7\,\mathrm{mm^2}$.
9. Najmanjši premer: $d = \sqrt{\dfrac{4 \cdot 166{,}7}{\pi}} \approx 14{,}57\,\mathrm{mm}$. Palica s $14\,\mathrm{mm}$ je pretanka, izberemo $16\,\mathrm{mm}$.
10. Za $16\,\mathrm{mm}$: $S = \dfrac{\pi \cdot 16^2}{4} \approx 201{,}1\,\mathrm{mm^2}$, $\sigma = \dfrac{30\,000}{201{,}1} \approx 149{,}2\,\mathrm{MPa}$.
11. Podaljšek: $\Delta L = \dfrac{149{,}2}{70\,030} \cdot 2000\,\mathrm{mm} \approx 4{,}26\,\mathrm{mm}$.
12. Odgovor: (a) $E \approx 70\,\mathrm{GPa}$, aluminijeva zlitina; (b) trajni raztezek je $0{,}2\,\%$, zato $R_{p0,2} \approx 270\,\mathrm{MPa}$; (c) $R_m \approx 309\,\mathrm{MPa}$, $A = 12\,\%$; (d) palica s premerom $16\,\mathrm{mm}$, ki se podaljša za približno $4{,}3\,\mathrm{mm}$. Enako obremenjena jeklena vez enakega preseka bi se podaljšala le za tretjino tega.

### Naloga 2

Natančno navedi definicije meje tečenja $R_e$, dogovorne meje tečenja $R_{p0,2}$, natezne trdnosti $R_m$ in raztezka po pretrgu $A$. Utemelji, zakaj krivulja napetost–raztezek po $R_m$ pada. Nato utemelji, ali drži trditev: »Vzmetno jeklo z $R_e = 1200\,\mathrm{MPa}$ je bolj togo od jekla S235.« Pri tem za obe jekli izračunaj raztezek na meji tečenja ($E = 210\,\mathrm{GPa}$).

**Rešitev:**

1. $R_e$ je napetost, pri kateri material začne teči: raztezek narašča brez povečanja sile in začne se trajna (plastična) deformacija; na diagramu se tam ravna črta prelomi.
2. $R_{p0,2}$ uporabimo, kadar izrazite meje ni: to je napetost, pri kateri po razbremenitvi ostane trajni raztezek $0{,}2\,\%$.
3. $R_m = F_m/S_0$ je največja sila preizkusa, deljena z začetnim presekom; $A = \dfrac{L_u - L_0}{L_0} \cdot 100\,\%$ je trajni relativni podaljšek merilne dolžine po pretrgu in meri duktilnost.
4. Padec po $R_m$: pri $R_m$ se začne tvoriti vrat. Presek v vratu se hitro manjša, zato preizkušanec nosi manjšo silo. Napetost pa še vedno računamo z začetnim $S_0$, zato izračunana vrednost pada, čeprav material v vratu ni šibkejši.
5. Raztezek na meji tečenja: S235 $\varepsilon = \dfrac{235}{210\,000} \approx 0{,}00112$, vzmetno jeklo $\varepsilon = \dfrac{1200}{210\,000} \approx 0{,}00571$.
6. Trditev ne drži. Togost meri $E$, naklon ravnega dela, ki je pri obeh jeklih $210\,\mathrm{GPa}$, ker ga določajo vezi med atomi. Pri enaki napetosti je raztezek obeh enak.
7. Sklep: jekli se razlikujeta v trdnosti. Vzmetno jeklo se lahko elastično raztegne do $0{,}57\,\%$, S235 le do $0{,}11\,\%$, torej približno petkrat manj; zato je prvo primerno za vzmeti.

### Naloga 3

(a) Naročnik za ploščo iz nelegiranega jekla zahteva $R_m \geq 470\,\mathrm{MPa}$. Kontrolor meri trdoto po Brinellu s kroglico $D = 10\,\mathrm{mm}$ in silo $29\,420\,\mathrm{N}$. Kolikšen sme biti največ premer odtisa, da plošča po oceni $R_m \approx 3{,}5 \cdot \mathrm{HB}$ še ustreza? (b) Charpyjevo nihalo ima maso $22\,\mathrm{kg}$, težišče je $0{,}80\,\mathrm{m}$ od osi. Spustimo ga z odklona $140°$ od navpičnice. Po lomu preizkušanca pri $+20\,^\circ\mathrm{C}$ se dvigne do $115°$, pri $-20\,^\circ\mathrm{C}$ do $128°$. Višina težišča nad najnižjo lego je $h = l(1 - \cos\alpha)$. Ali jeklo izpolni zahtevo $\mathrm{KV} \geq 27\,\mathrm{J}$ pri $-20\,^\circ\mathrm{C}$? Uporabi $\cos 140° = -0{,}766$, $\cos 115° = -0{,}423$, $\cos 128° = -0{,}616$.

**Rešitev:**

1. Najmanjša trdota: $\mathrm{HB} = \dfrac{470}{3{,}5} \approx 134{,}3$.
2. Iz Brinellove enačbe izrazimo oklepaj: $D - \sqrt{D^2 - d^2} = \dfrac{0{,}102 \cdot 2F}{\pi D \cdot \mathrm{HB}} = \dfrac{6002}{\pi \cdot 10 \cdot 134{,}3} \approx 1{,}423$ (v mm).
3. Koren: $\sqrt{D^2 - d^2} = 10 - 1{,}423 = 8{,}577$ (v mm).
4. $d = \sqrt{100 - 8{,}577^2} = \sqrt{100 - 73{,}56} \approx 5{,}14$ (v mm). Večji odtis pomeni manjšo trdoto, zato mora biti $d \leq 5{,}14\,\mathrm{mm}$.
5. Charpy: iz $h = l(1 - \cos\alpha)$ sledi $h_1 - h_2 = l(\cos\alpha_2 - \cos\alpha_1)$, torej $\mathrm{KV} = m g\, l(\cos\alpha_2 - \cos\alpha_1)$.
6. Stalni del: $m g\, l = 22 \cdot 9{,}81 \cdot 0{,}80 \approx 172{,}7$ (v J).
7. Pri $+20\,^\circ\mathrm{C}$: $\cos 115° - \cos 140° = -0{,}423 + 0{,}766 = 0{,}343$, $\mathrm{KV} \approx 172{,}7 \cdot 0{,}343 \approx 59{,}2\,\mathrm{J}$.
8. Pri $-20\,^\circ\mathrm{C}$: $-0{,}616 + 0{,}766 = 0{,}150$, $\mathrm{KV} \approx 172{,}7 \cdot 0{,}150 \approx 25{,}9\,\mathrm{J}$.
9. Odgovor: (a) odtis sme imeti premer največ $5{,}14\,\mathrm{mm}$; (b) $25{,}9\,\mathrm{J} < 27\,\mathrm{J}$, jeklo zahteve pri $-20\,^\circ\mathrm{C}$ ne izpolni, čeprav ima pri sobni temperaturi $59\,\mathrm{J}$. Prehodna temperatura tega jekla je previsoka za zimsko uporabo.

## Drugače: Korak za korakom s številkami

Preizkušanec iz S235 ima $d_0 = 10\,\mathrm{mm}$ ($S_0 \approx 78{,}54\,\mathrm{mm^2}$) in $L_0 = 50\,\mathrm{mm}$. Stroj izpiše:

| $F$ [kN] | $\Delta L$ [mm] | $\sigma$ [MPa] | $\varepsilon$ |
|---|---|---|---|
| 5 | 0,0152 | 63,7 | 0,000304 |
| 10 | 0,0303 | 127,3 | 0,000606 |
| 15 | 0,0455 | 191,0 | 0,000910 |

1. Vsako silo deli z $S_0$: dobiš stolpec $\sigma$.
2. Vsak podaljšek deli z $L_0 = 50\,\mathrm{mm}$: dobiš stolpec $\varepsilon$.
3. Preveri sorazmernost: sila se podvoji, podaljšek tudi. Smo v elastičnem področju.
4. Naklon: $191{,}0 / 0{,}000910 \approx 210\,000\,\mathrm{MPa} = 210\,\mathrm{GPa}$. To je $E$.
5. Nadaljnji izpis pokaže, da se krivulja prelomi pri $18{,}5\,\mathrm{kN}$: $R_e = 18\,500 / 78{,}54 \approx 236\,\mathrm{MPa}$.
6. Največja sila je $28{,}3\,\mathrm{kN}$: $R_m = 28\,300 / 78{,}54 \approx 360\,\mathrm{MPa}$.
7. Po pretrgu je $L_u = 63\,\mathrm{mm}$: $A = 13/50 \cdot 100\,\% = 26\,\%$. Precej duktilno jeklo.

## Drugače: Kot zgodba

Kovač Tine je za mizarja skoval novo dleto. Da bi dobro rezalo, ga je segrel do rdečega žara in ga zakalil v vodi. Pila je po rezilu drsela, kot bi drsela po steklu: jeklo je postalo zelo trdo, ker je nastal martenzit.

Mizar ga je naslednji dan prinesel nazaj: ob prvem močnejšem udarcu se je rob okrušil. Tine je dobil trdoto, izgubil pa žilavost. Trdo jeklo se ne zna deformirati, zato energija udarca odpre razpoko.

Drugo dleto je po kaljenju še enkrat segrel, tokrat le do slamnato rumene barve oksida, približno $230\,^\circ\mathrm{C}$, in ga ohladil. To je popuščanje. Dleto je bilo nekoliko mehkejše, a se ni več krušilo.

Pozimi so v njegovo železno ograjo zadele sani in prečka se je odlomila kot suha veja. Poleti je ista ograja prenesla vsak udarec. Jeklo je bilo pod prehodno temperaturo; Charpyjev preizkus na mrazu bi to pokazal vnaprej.

## Preveri se

? Katera trditev o diagramu napetost–raztezek pri nateznem preizkusu jekla je pravilna?
- Po vrhu $R_m$ krivulja pade, ker se material zaradi deformacije oslabi.
~ Material v vratu se celo utrjuje. Krivulja pade, ker se presek v vratu manjša, mi pa delimo z začetnim $S_0$.
+ Naklon začetnega ravnega dela je modul elastičnosti $E$.
- Meja tečenja je največja napetost, ki jo preizkušanec doseže.
~ Največja napetost je natezna trdnost $R_m$. Meja tečenja $R_e$ je nižja: tam se začne trajna deformacija.
- Raztezek po pretrgu je enak raztezku pri meji tečenja.
~ Pri meji tečenja je raztezek majhen (pod $1\,\%$), raztezek po pretrgu pa zajame vso plastično deformacijo, pri S235 okoli $26\,\%$.
> V elastičnem področju velja $\sigma = E\varepsilon$, zato je naklon ravnega dela $E$, pri jeklu okoli $210\,\mathrm{GPa}$.

? Jeklena palica s premerom $20\,\mathrm{mm}$ se pretrga pri sili $141\,\mathrm{kN}$. Kolikšna je natezna trdnost?
- $112\,\mathrm{MPa}$
~ To dobiš z $S_0 = \pi d_0^2$. Presek kroga je $\pi d_0^2/4$, sicer je štirikrat prevelik.
- $353\,\mathrm{MPa}$
~ To dobiš, če presek izračunaš kot $d_0^2 = 400\,\mathrm{mm^2}$, torej kot kvadrat namesto kroga.
+ $449\,\mathrm{MPa}$
- $0{,}449\,\mathrm{MPa}$
~ Sila je ostala v kN. Za $\mathrm{N/mm^2}$ jo pretvori v N: $141\,000\,\mathrm{N}$.
> $S_0 = \pi \cdot 20^2/4 \approx 314{,}2\,\mathrm{mm^2}$, $R_m = 141\,000/314{,}2 \approx 449\,\mathrm{MPa}$.

? Študent računa napetost v palici $d_0 = 10\,\mathrm{mm}$ pri sili $15\,\mathrm{kN}$: »$S_0 = \pi \cdot 10^2 = 314\,\mathrm{mm^2}$, $\sigma = 15\,000/314 = 47{,}8\,\mathrm{MPa}$, varno daleč pod $R_e = 235\,\mathrm{MPa}$.« Kje je napaka?
- Sila bi morala biti v kN, ne v N.
~ Za $\mathrm{N/mm^2}$ = MPa mora biti sila v N, to je študent naredil prav.
+ V formuli za presek je vstavil premer namesto polmera, zato je napetost štirikrat premajhna.
- Napetost bi moral deliti še z $E$.
~ Z $E$ deliš, ko iz napetosti računaš raztezek. Za napetost samo zadošča $F/S_0$.
- Napake ni, račun je pravilen.
~ $\pi \cdot 10^2$ je presek kroga s polmerom $10\,\mathrm{mm}$, palica pa ima polmer $5\,\mathrm{mm}$.
> Pravilno: $S_0 = \pi \cdot 5^2 \approx 78{,}5\,\mathrm{mm^2}$, $\sigma \approx 191\,\mathrm{MPa}$. To je še vedno pod $R_e$, a varnost je mnogo manjša, kot je mislil.

? Enako oblikovan nosilec naredimo enkrat iz S235 in enkrat iz vzmetnega jekla z $R_e = 1200\,\mathrm{MPa}$. Obremenimo ju z enako, majhno silo. Kateri se bolj povesi?
- Nosilec iz S235, ker je šibkejši.
~ Šibkejši pomeni, da trajna deformacija nastopi pri manjši sili. Pri majhni sili sta oba elastična in poves določa $E$.
- Nosilec iz vzmetnega jekla, ker je bolj prožen.
~ Vzmetno jeklo se lahko elastično deformira bolj, preden se trajno ukrivi, pri enaki sili pa se ne povesi več.
+ Oba enako, ker imata enak modul elastičnosti.
> Obe jekli imata $E \approx 210\,\mathrm{GPa}$, zato je pri enaki napetosti raztezek $\sigma/E$ enak. Razlikujeta se le v tem, koliko sile preneseta.

? Mizar je dleto po kaljenju takoj uporabil. Ob udarcu s kladivom se je rezilo okrušilo. Kaj je najverjetnejši vzrok?
- Dleto je premehko.
~ Premehak rob bi se zavihal ali stisnil, ne pa okrušil.
- Jeklo ima premajhen modul elastičnosti.
~ Kaljenje $E$ skoraj ne spremeni; vsa jekla imajo okoli $210\,\mathrm{GPa}$.
+ Jeklo je zelo trdo, a premalo žilavo, ker ni bilo popuščeno.
- Udarec kladiva je prevelik za katero koli jeklo.
~ Popuščeno dleto takšne udarce prenaša vsak dan. Problem je v stanju jekla.
> Kaljenje da martenzit, ki je trd in krhek. Popuščanje zmanjša trdoto le malo, žilavost pa močno poveča.

:::simboli
\sigma | napetost | \sigma = \frac{F}{S_0} | MPa | MPa = N/mm²
F | sila | | N
S_0 | začetni prečni presek | S_0 = \frac{\pi d_0^2}{4} | mm^2
d_0 | začetni premer preizkušanca | | mm
F_m | največja sila pri nateznem preizkusu | | N
R_m | natezna trdnost | R_m = \frac{F_m}{S_0} | MPa
R_e | meja tečenja | | MPa
R_{p0,2} | dogovorna meja tečenja | | MPa | napetost pri trajnem raztezku $0{,}2\,\%$
\varepsilon | raztezek | \varepsilon = \frac{\Delta L}{L_0} | –
\Delta L | podaljšek | \Delta L = \varepsilon \cdot L_0 | mm
L_0 | začetna merilna dolžina | | mm
L_u | merilna dolžina po pretrgu | | mm
E | modul elastičnosti | E = \frac{\sigma}{\varepsilon} | GPa | jeklo okoli $210\,\mathrm{GPa}$
A | raztezek po pretrgu | A = \frac{L_u - L_0}{L_0} \cdot 100\,\% | \% | mera duktilnosti
\mathrm{HB} | trdota po Brinellu | | – | brez enote
D | premer kroglice | | mm
d | premer odtisa | | mm
\mathrm{KV} | udarno delo (žilavost po Charpyju) | \mathrm{KV} = m g (h_1 - h_2) | J
m | masa nihala | | kg
g | težni pospešek | | m/s^2
h_1 | začetna višina nihala | | m
h_2 | višina nihala po lomu | | m
\pi | število pi | |
:::
