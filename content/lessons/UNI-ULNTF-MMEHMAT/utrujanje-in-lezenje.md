---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta $1842$ se je pri Versaillesu iztiril potniški vlak; vzrok je bila zlomljena os lokomotive. Osi so bile dimenzionirane tako, da je bila napetost v njih precej pod mejo tečenja, pa so se vseeno lomile, in to po letih brezhibnega obratovanja. Nemški železniški inženir August Wöhler je zato v drugi polovici 19. stoletja osi preizkušal z vrtenjem pod obremenitvijo, kot v vožnji, in pokazal, da o lomu odloča **število ponovitev** napetosti. Danes isti problem rešujejo pri vetrnih elektrarnah: lopatica in stolp v $20$ letih doživita več sto milijonov obremenitvenih ciklov. Pri parnih kotlih elektrarn pa grozi drug počasen pojav, **lezenje**: višja temperatura pare pomeni boljši izkoristek in manj izpustov $\mathrm{CO_2}$, a cevi se pri njej počasi raztezajo.

## Razlaga

### Kje preprosta slika odpove

Iz kriterijev tečenja znaš izračunati, ali se del ob obremenitvi plastično deformira. Mamljiv sklep je: *če je napetost pod mejo tečenja, se del samo elastično deformira in zdrži poljubno dolgo.* To drži le pri **mirujoči** obremenitvi pri **sobni** temperaturi. Odpove na dva načina:

- **Utrujanje.** Napetost se ponavlja (vrtenje, vibracije, sunki vetra). Ob mikroskopskih napakah na površini se postopoma odpre razpoka, ki ob vsakem ciklu malo zraste. Del se zlomi pri napetosti, precej nižji od meje tečenja.
- **Lezenje.** Napetost je stalna, temperatura pa visoka. Atomi in dislokacije se premikajo s pomočjo difuzije, zato deformacija s časom narašča, čeprav se obremenitev ne spremeni.

Odgovor je torej odvisen od tega, **kolikokrat** in **kako dolgo pri kateri temperaturi** napetost deluje.

### Opis ciklične obremenitve

**Definicija.** Pri obremenitvi, ki niha med $\sigma_{max}$ in $\sigma_{min}$, je **srednja napetost** $\sigma_m = \frac{\sigma_{max} + \sigma_{min}}{2}$, **amplituda napetosti** $\sigma_a = \frac{\sigma_{max} - \sigma_{min}}{2}$ in **napetostno razmerje** $R = \sigma_{min}/\sigma_{max}$. Izmenična obremenitev ($\sigma_m = 0$) ima $R = -1$, utripna ($\sigma_{min} = 0$) $R = 0$. Vrtljiva os pod stalnim upogibom ima $R = -1$: vsaka točka površine gre ob enem obratu iz nateznega v tlačno stanje.

### Wöhlerjeva krivulja

Preizkušance obremenjujemo z različnimi amplitudami in štejemo cikle do loma $N$. Narišemo $\sigma_a$ proti $\log N$:

```
 σa
 |\
 | \
 |  \___
 |      \____
 |           \_______ σD
 |_________________________
 10^3  10^5  10^7     log N
```

Krivulja pada in pri jeklih okoli $N_D \approx 10^6$ do $10^7$ ciklov preide v vodoravno črto. Napetost $\sigma_D$ je **trajna dinamična trdnost**: pod njo jeklo v preizkusu ne poči niti po $10^7$ ali več ciklih. Za konstrukcijska jekla je približno $\sigma_D \approx 0{,}5\,R_m$ ($R_m$ natezna trdnost). Aluminijeve zlitine izrazite meje nimajo: krivulja pada naprej, zato zanje navedemo trdnost pri izbranem številu ciklov (npr. $5 \cdot 10^8$).

Nad $\sigma_D$ v dvojno logaritemskem diagramu krivuljo pogosto nadomestimo s premico:

$$N = N_D\left(\frac{\sigma_D}{\sigma_a}\right)^k \quad \text{za } \sigma_a > \sigma_D.$$

Eksponent $k$ (naklon) je za jekla okoli $5$ do $15$. Ker je velik, že majhno povečanje amplitude močno skrajša življenjsko dobo.

:::premisli
Pri $k = 8$ amplitudo povečamo za $10\,\%$. Ali se življenjska doba skrajša za $10\,\%$, za polovico ali še bolj? Zakaj?
---
Za več kot polovico: $N$ se pomnoži z $1{,}1^{-8} \approx 0{,}47$. Število ciklov je odvisno od amplitude na osmo potenco, zato je napetost v utrujanju »draga«; zato inženirji tako skrbno odpravljajo zareze, ki napetost lokalno povečajo.
:::

**Vpliv srednje napetosti.** Natezna srednja napetost razpoko odpira in zmanjša dopustno amplitudo. **Goodmanova premica** poveže $\sigma_N$ (trajna trdnost pri $R = -1$) in natezno trdnost $R_m$:

$$\frac{\sigma_a}{\sigma_N} + \frac{\sigma_m}{R_m} = \frac{1}{n},$$

kjer je $n$ varnostni faktor. Pri $n = 1$ ležijo na premici mejna stanja. Tlačna srednja napetost razpoke zapira; ugodnega vpliva v računu običajno ne upoštevamo.

**Kumulativna poškodba.** Resnična obremenitev ima različne amplitude. **Palmgren-Minerjevo pravilo** predpostavi, da $n_i$ ciklov z amplitudo, pri kateri je do loma $N_i$ ciklov, porabi delež $n_i/N_i$ življenjske dobe. Poškodba je

$$D = \sum_i \frac{n_i}{N_i},$$

lom pa pričakujemo pri $D = 1$. Pravilo ne upošteva vrstnega reda obremenitev in je zato približno; v preizkusih so izmerjene vrednosti $D$ ob lomu med okoli $0{,}3$ in $3$.

### Lezenje

Pri temperaturah nad približno $0{,}4\,T_t$ ($T_t$ tališče v kelvinih) se kovina pod stalno napetostjo s časom razteza. Za jeklo s tališčem okoli $1800\,\mathrm{K}$ je to že nad okoli $450\,^\circ\mathrm{C}$. **Krivulja lezenja** (raztezek proti času) ima tri stopnje:

- **primarno**: hitrost lezenja pada, ker se material utrjuje;
- **sekundarno** (stacionarno): hitrost $\dot\varepsilon_s$ je stalna, utrjevanje in poprava sta v ravnovesju; ta stopnja traja najdlje;
- **terciarno**: v materialu nastanejo pore, presek se zoži, hitrost raste do loma.

Hitrost stacionarnega lezenja opiše **Nortonov zakon** z Arrheniusovim členom:

$$\dot\varepsilon_s = B\,\sigma^m\,e^{-Q/(R_p T)},$$

kjer je $m$ napetostni eksponent (za kovine okoli $3$ do $8$), $Q$ aktivacijska energija, $R_p$ plinska konstanta in $T$ absolutna temperatura. Že nekaj deset kelvinov višja temperatura poveča hitrost za velik faktor.

Za oceno časa do loma iz kratkih preizkusov pri višji temperaturi uporabimo **Larson-Millerjev parameter**:

$$P_{LM} = T\left(C + \log t_r\right),$$

kjer je $T$ v kelvinih, $t_r$ čas do loma v urah in $C \approx 20$. Pri dani napetosti je $P_{LM}$ za material približno stalen, zato lahko krajši čas pri višji temperaturi prevedemo na daljši čas pri nižji.

:::premisli
Vijak prirobnice parovoda je pri $550\,^\circ\mathrm{C}$ privit s prednapetostjo, razdalja med prirobnicama pa se ne spreminja. Kaj se zgodi s silo v vijaku po nekaj letih in zakaj?
---
Sila pade. Skupni raztezek vijaka je stalen, lezenje pa del elastičnega raztezka pretvori v trajnega; elastični del, ki daje silo, se manjša. Temu rečemo **napetostna relaksacija**; zato vijake v elektrarnah ob rednih pregledih ponovno privijejo.
:::

## Rešeni primeri

### Primer 1 (lažji)

Za jekleno gred velja Wöhlerjeva premica s $\sigma_D = 240\,\mathrm{MPa}$, $N_D = 2 \cdot 10^6$ in $k = 8$. Koliko ciklov zdrži pri amplitudi $300\,\mathrm{MPa}$ in koliko pri $200\,\mathrm{MPa}$?

**Podatki:** $\sigma_D = 240\,\mathrm{MPa}$, $N_D = 2 \cdot 10^6$, $k = 8$, $\sigma_{a1} = 300\,\mathrm{MPa}$, $\sigma_{a2} = 200\,\mathrm{MPa}$
**Iščemo:** $N_1$ in $N_2$

:::formula
$N = N_D\left(\dfrac{\sigma_D}{\sigma_a}\right)^k$ za $\sigma_a > \sigma_D$
:::

**Rešitev:**

1. $\sigma_{a1} = 300\,\mathrm{MPa} > \sigma_D$, zato velja premica. Razmerje: $240/300 = 0{,}8$.
2. $0{,}8^8 \approx 0{,}168$, torej $N_1 = 2 \cdot 10^6 \cdot 0{,}168 \approx 3{,}4 \cdot 10^5$ ciklov.
3. $\sigma_{a2} = 200\,\mathrm{MPa} < \sigma_D$: amplituda je pod trajno dinamično trdnostjo.
4. Odgovor: pri $300\,\mathrm{MPa}$ gred zdrži okoli $3{,}4 \cdot 10^5$ ciklov, pri $200\,\mathrm{MPa}$ pa je trajno dinamično trdna (če ni zarez, korozije in višjih obremenitev vmes).

### Primer 2

Vijak prirobnice stolpa vetrne elektrarne je prednapet; zaradi vetra napetost v njem niha med $50\,\mathrm{MPa}$ in $250\,\mathrm{MPa}$. Material ima $R_m = 600\,\mathrm{MPa}$ in trajno trdnost pri izmenični obremenitvi $\sigma_N = 270\,\mathrm{MPa}$. Kolikšen je varnostni faktor proti utrujanju po Goodmanu?

**Podatki:** $\sigma_{min} = 50\,\mathrm{MPa}$, $\sigma_{max} = 250\,\mathrm{MPa}$, $R_m = 600\,\mathrm{MPa}$, $\sigma_N = 270\,\mathrm{MPa}$
**Iščemo:** varnostni faktor $n$

:::formula
$\sigma_m = \dfrac{\sigma_{max} + \sigma_{min}}{2}$, $\sigma_a = \dfrac{\sigma_{max} - \sigma_{min}}{2}$, $\dfrac{\sigma_a}{\sigma_N} + \dfrac{\sigma_m}{R_m} = \dfrac{1}{n}$
:::

**Rešitev:**

1. $\sigma_m = (250 + 50)/2\,\mathrm{MPa} = 150\,\mathrm{MPa}$; $\sigma_a = (250 - 50)/2\,\mathrm{MPa} = 100\,\mathrm{MPa}$.
2. $\frac{1}{n} = 100/270 + 150/600 \approx 0{,}370 + 0{,}250 = 0{,}620$.
3. $n = 1/0{,}620 \approx 1{,}61$.
4. Drug zorni kot: če bi $\sigma_m = 150\,\mathrm{MPa}$ ostala stalna (kot jo določa prednapetost), bi bila mejna amplituda $270 \cdot (1 - 150/600)\,\mathrm{MPa} = 202{,}5\,\mathrm{MPa}$, dvakrat več od dejanske. Faktor $1{,}61$ je manjši, ker Goodmanova enačba z $1/n$ predpostavi, da z istim faktorom narasteta $\sigma_a$ in $\sigma_m$. Kateri preizkus je pravi, je odvisno od tega, kako se obremenitev v resnici poveča.
5. Odgovor: varnostni faktor je okoli $1{,}6$. Brez upoštevanja srednje napetosti bi dobili napačno $270/100 = 2{,}7$.

### Primer 3 (težji)

Zvarni spoj v stolpu vetrne elektrarne ima Wöhlerjevo premico iz Primera 1. Iz meritev v enem letu so obremenitev razvrstili v bloke: $1000$ ciklov z amplitudo $350\,\mathrm{MPa}$, $10\,000$ ciklov s $300\,\mathrm{MPa}$, $50\,000$ ciklov z $260\,\mathrm{MPa}$ in $10^6$ ciklov z $200\,\mathrm{MPa}$. Kolikšna je letna poškodba po Minerjevem pravilu in kolikšna je pričakovana življenjska doba? Ali bi bila ocena varna, če bi stolp moral zdržati $20$ let in bi se zahtevala poškodba največ $D = 0{,}5$?

**Podatki:** $\sigma_D = 240\,\mathrm{MPa}$, $N_D = 2 \cdot 10^6$, $k = 8$; letno $n_1 = 1000$ pri $350\,\mathrm{MPa}$, $n_2 = 10\,000$ pri $300\,\mathrm{MPa}$, $n_3 = 50\,000$ pri $260\,\mathrm{MPa}$, $n_4 = 10^6$ pri $200\,\mathrm{MPa}$; zahteva $20$ let pri $D \le 0{,}5$
**Iščemo:** letno poškodbo $D_l$, življenjsko dobo $t$, ali zahteva velja

:::formula
$N_i = N_D\left(\dfrac{\sigma_D}{\sigma_{ai}}\right)^k$, $D = \sum \dfrac{n_i}{N_i}$
:::

**Rešitev:**

1. $N_1 = 2 \cdot 10^6 \cdot (240/350)^8 \approx 9{,}78 \cdot 10^4$; delež $1000/97\,763 \approx 0{,}0102$.
2. $N_2 \approx 3{,}36 \cdot 10^5$ (Primer 1); delež $10\,000/335\,544 \approx 0{,}0298$.
3. $N_3 = 2 \cdot 10^6 \cdot (240/260)^8 \approx 1{,}05 \cdot 10^6$; delež $50\,000/1\,054\,225 \approx 0{,}0474$.
4. Blok pri $200\,\mathrm{MPa}$ je pod $\sigma_D$; po osnovnem Minerjevem pravilu ne prispeva.
5. Letna poškodba: $D_l \approx 0{,}0102 + 0{,}0298 + 0{,}0474 = 0{,}0874$.
6. Do $D = 1$: $t = 1/0{,}0874 \approx 11{,}4$ leta.
7. V $20$ letih bi bila poškodba $20 \cdot 0{,}0874 \approx 1{,}75$, zahtevanih $0{,}5$ pa je doseženo že po $0{,}5/0{,}0874 \approx 5{,}7$ leta.
8. Odgovor: letna poškodba je okoli $0{,}087$, pričakovana doba okoli $11$ let; zahteve ($20$ let pri $D \le 0{,}5$) spoj ne izpolni. Ker so tudi cikli pod $\sigma_D$ ob prisotni razpoki škodljivi, je ocena celo nevarno optimistična. Rešitev je večji presek ali boljša oblika zvara, ki zmanjša amplitude.

### Primer 4 – zdaj ti

Za jeklo parovoda pri obratovalni napetosti velja $P_{LM} = 2{,}1 \cdot 10^4$ (z $T$ v kelvinih, $t_r$ v urah, $C = 20$). Kolikšen je čas do loma pri $823\,\mathrm{K}$ ($550\,^\circ\mathrm{C}$) in kolikšen pri $873\,\mathrm{K}$ ($600\,^\circ\mathrm{C}$)?

**Podatki:** $P_{LM} = 2{,}1 \cdot 10^4$, $C = 20$, $T_1 = 823\,\mathrm{K}$, $T_2 = 873\,\mathrm{K}$
**Iščemo:** $t_{r1}$ in $t_{r2}$

:::formula
$P_{LM} = T\left(C + \log t_r\right)$, torej $\log t_r = \dfrac{P_{LM}}{T} - C$
:::

**Rešitev:**

1. Pri $823\,\mathrm{K}$: $\log t_{r1} = 21\,000/823 - 20 \approx 5{,}516$.
2. $t_{r1} \approx 10^{5{,}516}\,\mathrm{h} \approx 3{,}3 \cdot 10^5\,\mathrm{h}$, kar je okoli $37$ let.
3. Pri $873\,\mathrm{K}$ izračunaj sam in primerjaj.

:::premisli
Kolikšen je $t_{r2}$ in kaj pove primerjava?
---
$\log t_{r2} = 21\,000/873 - 20 \approx 4{,}055$, torej $t_{r2} \approx 1{,}1 \cdot 10^4\,\mathrm{h}$, približno $1{,}3$ leta. Za $50\,\mathrm{K}$ višja temperatura skrajša čas do loma skoraj tridesetkrat; zato višje temperature pare zahtevajo dražja jekla.
:::

## Pogoste napake

- **Pod mejo tečenja je varno.** Velja le za mirujočo obremenitev pri nizki temperaturi. Pri ponavljanju odloča amplituda glede na $\sigma_D$, pri visoki temperaturi pa čas.
- **Amplituda je razlika napetosti.** Amplituda je **polovica** razlike $\sigma_{max} - \sigma_{min}$; razliki rečemo razpon napetosti.
- **Pozabljena srednja napetost.** Natezna $\sigma_m$ zmanjša dopustno amplitudo (Primer 2); račun samo z $\sigma_a/\sigma_N$ je preoptimističen.
- **Linearna odvisnost $N$ od napetosti.** Pri $k = 8$ podvojitev amplitude ne razpolovi, ampak zmanjša število ciklov za faktor $2^8 = 256$.
- **Temperatura v °C v Arrheniusovem členu in Larson-Millerjevem parametru.** Obe zvezi zahtevata absolutno temperaturo v kelvinih.

## Povzetek

- Pod mejo tečenja del odpove z utrujanjem (ponavljanje) ali z lezenjem (visoka temperatura, čas).
- $\sigma_m = (\sigma_{max} + \sigma_{min})/2$, $\sigma_a = (\sigma_{max} - \sigma_{min})/2$, $R = \sigma_{min}/\sigma_{max}$.
- Wöhlerjeva krivulja $\sigma_a$–$\log N$; jeklo ima $\sigma_D \approx 0{,}5\,R_m$ pri $10^6$ do $10^7$ ciklih, aluminij je nima; nad $\sigma_D$ je $N = N_D(\sigma_D/\sigma_a)^k$.
- Goodman: $\sigma_a/\sigma_N + \sigma_m/R_m = 1/n$; Miner: $D = \sum n_i/N_i$, lom pri $D \approx 1$.
- Lezenje nad okoli $0{,}4\,T_t$: primarno, sekundarno, terciarno; $\dot\varepsilon_s = B\sigma^m e^{-Q/(R_pT)}$.
- Larson-Miller: $P_{LM} = T(C + \log t_r)$, $C \approx 20$, $T$ v K, $t_r$ v h.

## Za izpit

Znati moraš povedati:

- definicije $\sigma_m$, $\sigma_a$, $R$ in trajne dinamične trdnosti;
- obliko in razlago Wöhlerjeve krivulje ter razliko med jeklom in aluminijem;
- mehanizem utrujenostnega loma (nastanek razpoke, rast, končni lom) in vpliv zarez ter površine;
- Goodmanovo premico in Palmgren-Minerjevo pravilo z omejitvami;
- tri stopnje lezenja, Nortonov zakon z Arrheniusovim členom, napetostno relaksacijo in Larson-Millerjev parameter.

### Naloga 1

Pri $823\,\mathrm{K}$ in $100\,\mathrm{MPa}$ je izmerjena hitrost stacionarnega lezenja jekla $1{,}0 \cdot 10^{-11}\,\mathrm{s^{-1}}$. Napetostni eksponent je $m = 5$, aktivacijska energija $Q = 280\,\mathrm{kJ/mol}$, $R_p = 8{,}314\,\mathrm{J/(mol\,K)}$. a) Kolikšen raztezek nastane v $10^5\,\mathrm{h}$ pri teh pogojih? b) Kolikšna je hitrost pri $120\,\mathrm{MPa}$ in $873\,\mathrm{K}$ in kolikšen je raztezek v istem času? c) Kolikšno največjo napetost pri $823\,\mathrm{K}$ dopustimo, če sme raztezek v $10^5\,\mathrm{h}$ doseči največ $1\,\%$? Primarno lezenje zanemari.

**Rešitev:**

1. a) $t = 10^5 \cdot 3600\,\mathrm{s} = 3{,}6 \cdot 10^8\,\mathrm{s}$; $\varepsilon = 1{,}0 \cdot 10^{-11} \cdot 3{,}6 \cdot 10^8 = 0{,}0036$, torej $0{,}36\,\%$.
2. b) Napetostni faktor: $(120/100)^5 = 1{,}2^5 \approx 2{,}49$.
3. Temperaturni faktor: $e^{\frac{Q}{R_p}\left(\frac{1}{823} - \frac{1}{873}\right)}$; eksponent je $\frac{280\,000}{8{,}314} \cdot 6{,}96 \cdot 10^{-5} \approx 2{,}34$, faktor $e^{2{,}34} \approx 10{,}4$.
4. $\dot\varepsilon_s \approx 1{,}0 \cdot 10^{-11} \cdot 2{,}49 \cdot 10{,}4\,\mathrm{s^{-1}} \approx 2{,}6 \cdot 10^{-10}\,\mathrm{s^{-1}}$.
5. Raztezek: $2{,}6 \cdot 10^{-10} \cdot 3{,}6 \cdot 10^8 \approx 0{,}093$, okoli $9\,\%$: cev bi se nedopustno raztegnila, verjetno bi prešla v terciarno lezenje.
6. c) Dopustna hitrost: $0{,}01/(3{,}6 \cdot 10^8\,\mathrm{s}) \approx 2{,}78 \cdot 10^{-11}\,\mathrm{s^{-1}}$.
7. Pri isti temperaturi je $\dot\varepsilon_s \propto \sigma^5$: $\sigma = 100\,\mathrm{MPa} \cdot (2{,}78)^{1/5} \approx 123\,\mathrm{MPa}$.
8. Odgovor: a) $0{,}36\,\%$; b) okoli $2{,}6 \cdot 10^{-10}\,\mathrm{s^{-1}}$ in $9\,\%$; c) največ okoli $123\,\mathrm{MPa}$. Za $20\,\%$ večja napetost in $50\,\mathrm{K}$ višja temperatura povečata hitrost lezenja za faktor okoli $26$.

### Naloga 2

Opiši potek utrujenostnega loma od nastanka razpoke do loma in pojasni, kako ga prepoznaš na prelomni ploskvi. Utemelji, zakaj zareze, hrapava površina in korozija zmanjšajo trajno dinamično trdnost. Navedi predpostavke Palmgren-Minerjevega pravila in utemelji, zakaj je vrstni red obremenitev pomemben.

**Rešitev:**

1. Nastanek: ob ponavljanju se v ugodno usmerjenih zrnih na površini pojavijo drsni pasovi; na izstopnih stopnicah ali na napaki (vključek, praska) nastane mikrorazpoka.
2. Rast: razpoka raste pravokotno na največjo natezno napetost, ob vsakem ciklu za majhen korak. Na prelomni ploskvi je zato gladko območje, prekrito s **progami** (vidnimi s prostim očesom, ob spremembah obremenitve) in z mikroskopskimi **striacijami**.
3. Končni lom: ko preostali presek ne zdrži več največje sile, se zlomi naenkrat; to območje je grobo, zrnato ali žilavo potrgano.
4. Zareze: koncentracija napetosti poveča lokalno amplitudo nad nazivno. Hrapava površina ima veliko mikrozarez; korozija ustvarja jamice in razpoka nastane prej. Zato $\sigma_D$ dela vedno zmanjšamo s faktorji površine, velikosti in oblike.
5. Minerjeve predpostavke: poškodba se sešteva linearno, neodvisno od amplitude in vrstnega reda, cikli pod $\sigma_D$ ne škodijo.
6. Vrstni red: velika amplituda na začetku ustvari razpoko, ki jo nato rastejo tudi manjše amplitude, celo pod $\sigma_D$; obratni vrstni red je manj škodljiv. Zato je dejanska $D$ ob lomu lahko precej različna od $1$.
7. Odgovor: utrujenostni lom ima tri faze in značilno prelomno ploskev s progami; zareze, površina in korozija pospešijo nastanek razpoke; Minerjevo pravilo je linearen približek, ki vrstnega reda ne upošteva.

## Drugače: Uporaba v stroki

**Vetrne elektrarne.** Stolpe, prirobnice in lopatice dimenzionirajo na utrujanje z merjenimi spektri vetra in Minerjevim pravilom (Primer 3). Za lopatice iz kompozitov veljajo posebne Wöhlerjeve krivulje.

**Termoelektrarne.** Cevi pregrevalnikov in parovodi so dimenzionirani na lezenje za $10^5$ do $2 \cdot 10^5$ ur. Ob pregledih merijo premer cevi in s posnetki mikrostrukture iščejo pore lezenja.

**Letalstvo.** Po nesrečah letal Comet v petdesetih letih 20. stoletja (razpoke ob vogalih oken) so uvedli oblikovanje, varno ob odpovedi (*fail-safe*), iz katerega se je v sedemdesetih letih razvilo oblikovanje z dopustnimi poškodbami: razpoke se smejo pojaviti, a jih je treba z rednimi pregledi najti, preden postanejo kritične.

**Postopki za večjo trdnost.** Peskanje s kroglicami in valjanje površine ustvarita tlačne zaostale napetosti, ki razpoke zapirajo in povečajo $\sigma_D$.

## Drugače: Korak za korakom s številkami

Gred z $\sigma_D = 240\,\mathrm{MPa}$, $N_D = 2 \cdot 10^6$ in $k = 8$. Kaj se zgodi z življenjsko dobo, ko amplitudo večamo?

1. $\sigma_a = 250\,\mathrm{MPa}$: $N = 2 \cdot 10^6 \cdot 0{,}96^8 \approx 1{,}44 \cdot 10^6$.
2. $\sigma_a = 300\,\mathrm{MPa}$: $N \approx 3{,}4 \cdot 10^5$ (Primer 1).
3. $\sigma_a = 360\,\mathrm{MPa}$: $(240/360)^8 = (2/3)^8 \approx 0{,}039$, torej $N \approx 7{,}8 \cdot 10^4$.
4. $\sigma_a = 480\,\mathrm{MPa}$, dvakrat $\sigma_D$: $N = 2 \cdot 10^6/256 \approx 7{,}8 \cdot 10^3$.

Amplituda je zrasla z $250$ na $480\,\mathrm{MPa}$, manj kot dvakrat, število ciklov pa je padlo skoraj dvestokrat.

## Preveri se

? Katera trditev o trajni dinamični trdnosti **ne** drži?
- Pri jeklih je približno polovica natezne trdnosti.
~ To je ustaljeno pravilo za konstrukcijska jekla, zato drži.
- Hrapava površina jo zmanjša.
~ Hrapavost pomeni mikrozareze, ob katerih razpoka nastane prej; trditev drži.
+ Imajo jo vse kovine, tudi aluminijeve zlitine.
- Pod njo jeklo v preizkusu ne poči niti po $10^7$ ciklih.
~ To je ravno njena definicija; trditev drži.
> Aluminijeve zlitine izrazite trajne dinamične trdnosti nimajo; njihova Wöhlerjeva krivulja pada naprej.

? Napetost niha med $-40\,\mathrm{MPa}$ in $160\,\mathrm{MPa}$. Kolikšna je amplituda?
- $200\,\mathrm{MPa}$
~ To je razpon $\sigma_{max} - \sigma_{min}$; amplituda je njegova polovica.
+ $100\,\mathrm{MPa}$
- $60\,\mathrm{MPa}$
~ To je srednja napetost $(160 - 40)/2$, ne amplituda.
> $\sigma_a = (160 - (-40))/2 = 100\,\mathrm{MPa}$, $\sigma_m = 60\,\mathrm{MPa}$.

? Temperaturo pregrete pare v elektrarni zvišamo, napetost v ceveh ostane enaka. Kaj se zgodi?
+ Hitrost lezenja močno naraste, čas do loma se skrajša.
- Hitrost lezenja naraste linearno s temperaturo v °C.
~ Temperatura nastopa v eksponentu (Arrhenius) in v kelvinih; rast je eksponentna, ne linearna.
- Lezenje se ne spremeni, ker je napetost enaka.
~ Lezenje je toplotno aktiviran proces: pri enaki napetosti je odvisno tudi od temperature.
> Arrheniusov člen $e^{-Q/(R_pT)}$ se z višjo $T$ hitro poveča; že $50\,\mathrm{K}$ lahko pomeni desetkrat večjo hitrost.

? Študent računa varnostni faktor po Goodmanu za $\sigma_a = 120\,\mathrm{MPa}$, $\sigma_m = 200\,\mathrm{MPa}$, $\sigma_N = 300\,\mathrm{MPa}$, $R_m = 800\,\mathrm{MPa}$. (1) $\sigma_a/\sigma_N = 0{,}40$. (2) $\sigma_m/R_m = 0{,}25$. (3) $n = 1/0{,}40 = 2{,}5$, ker srednja napetost na utrujanje ne vpliva. Kateri korak je napačen?
- korak (1)
~ $120/300 = 0{,}40$ je pravilno.
- korak (2)
~ $200/800 = 0{,}25$ je pravilno.
+ korak (3)
> Srednjo napetost moramo upoštevati: $1/n = 0{,}40 + 0{,}25 = 0{,}65$, $n \approx 1{,}54$.

? Konstruktor lahko vetrni elektrarni z istim stolpom podaljša življenjsko dobo zvara. Kateri ukrep ima največji učinek?
- Zvar prebarva z debelejšo plastjo barve.
~ Barva varuje pred korozijo, a ne spremeni amplitude napetosti; učinek je majhen.
+ Spremeni obliko zvara, da se koncentracija napetosti zmanjša za $20\,\%$.
- Poveča natezno trdnost jekla, pri čemer obliko zvara pusti.
~ Pri zvarih je utrujenostna trdnost skoraj neodvisna od trdnosti osnovnega materiala; odločajo oblika in napake zvara.
> Pri $k = 8$ manjša amplituda za $20\,\%$ podaljša dobo za faktor $0{,}8^{-8} \approx 6$.

:::simboli
\sigma_{max}, \sigma_{min} | največja in najmanjša napetost cikla | | MPa
\sigma_m | srednja napetost | \sigma_m = \frac{\sigma_{max} + \sigma_{min}}{2} | MPa
\sigma_a | amplituda napetosti | \sigma_a = \frac{\sigma_{max} - \sigma_{min}}{2} | MPa
\sigma_{ai} | amplituda v i-tem bloku | | MPa
\sigma_{a1}, \sigma_{a2} | amplitudi v Primeru 1 | | MPa
R | napetostno razmerje | R = \frac{\sigma_{min}}{\sigma_{max}} | –
\sigma_D | trajna dinamična trdnost | | MPa | pri $N_D$ ciklih
\sigma_N | trajna trdnost pri izmenični obremenitvi | | MPa | $R = -1$
N | število ciklov do loma | N = N_D\left(\frac{\sigma_D}{\sigma_a}\right)^k | –
N_D | število ciklov na kolenu Wöhlerjeve krivulje | | –
N_i | cikli do loma pri amplitudi bloka i | | –
N_1, N_2 | cikli do loma v Primeru 1 | | –
k | naklon Wöhlerjeve premice | | – | za jekla 5 do 15
R_m | natezna trdnost | | MPa
n | varnostni faktor | | –
n_i | število ciklov v bloku i | | –
D | utrujenostna poškodba | D = \sum \frac{n_i}{N_i} | – | lom pri D okoli 1
\dot\varepsilon_s | hitrost stacionarnega lezenja | \dot\varepsilon_s = B\sigma^m e^{-Q/(R_pT)} | s^{-1}
B | snovna konstanta lezenja | | |
\sigma | napetost pri lezenju | | MPa
m | napetostni eksponent lezenja | | – | za kovine 3 do 8
Q | aktivacijska energija | | J/mol
R_p | splošna plinska konstanta | | J/(mol\,K) | 8,314 J/(mol K)
T | absolutna temperatura | | K
T_t | tališče | | K
P_{LM} | Larson-Millerjev parameter | P_{LM} = T(C + \log t_r) | K | T v K, t v urah
C | Larson-Millerjeva konstanta | | – | okoli 20
t_r | čas do loma | | h
t_{r1}, t_{r2} | časa do loma pri dveh temperaturah | | h
T_1, T_2 | temperaturi v Primeru 4 | | K
i | zaporedna številka bloka obremenitve | | –
e | osnova naravnega logaritma | | – | okoli 2,718
:::
