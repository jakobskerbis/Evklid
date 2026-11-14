---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Zemeljski plin plačuješ po kubičnih metrih, a kubični meter ni vedno enaka količina plina. Kubični meter mrzlega plina vsebuje več molekul kot kubični meter toplega, kubični meter stisnjenega pa več kot razredčenega. Zato dobavitelj izmerjene kubične metre pred obračunom preračuna na dogovorjeno temperaturo in tlak. Pri plinih torej ne tehtamo, ampak merimo **tlak**, **prostornino** in **temperaturo**, iz njih pa izračunamo **množino** snovi.

Zakaj je to mogoče? Ker se razredčeni plini obnašajo skoraj enako, ne glede na to, iz katerih molekul so. To opisuje **splošna plinska enačba**. Za zmesi plinov (zrak, izdihani zrak, izpušni plini, plini v bioreaktorju) potrebujemo še pojem **parcialnega tlaka** in **Daltonov zakon**.

Cilji:

- uporabljati splošno plinsko enačbo $pV = nRT$ in pravilno pretvarjati enote,
- iz gostote plina določiti molsko maso,
- računati parcialne tlake in množinske deleže v zmeseh,
- upoštevati vodno paro pri plinu, zbranem nad vodo,
- presoditi, kdaj model idealnega plina ni več dober.

## Razlaga

**Najprej en račun.** Števec pokaže porabo $1{,}00\,\mathrm{m^3}$ metana pri $15\,^\circ\mathrm{C}$ in $101{,}325\,\mathrm{kPa}$. Koliko molov je to? Uporabimo enačbo, ki jo spodaj sestavimo iz plinskih zakonov:

$$n = \frac{pV}{RT} = \frac{101\,325\,\mathrm{Pa} \cdot 1{,}00\,\mathrm{m^3}}{8{,}314\,\mathrm{J/(mol\,K)} \cdot 288{,}15\,\mathrm{K}} \approx 42{,}3\,\mathrm{mol}.$$

Z $M(\mathrm{CH_4}) = 16{,}04\,\mathrm{g/mol}$ je to okoli $678\,\mathrm{g}$ metana. Račun potrebuje le tri izmerjene količine in eno konstanto; vrsta plina vstopi šele pri masi. Koraki 1 do 7 posplošijo ta račun: od kod enačba, katere enote, kaj pri zmeseh in kdaj ji lahko zaupamo.

**1. Stanje plina.** Stanje dane množine plina opišemo s štirimi količinami:

- **tlak** $p$ v paskalih ($1\,\mathrm{Pa} = 1\,\mathrm{N/m^2}$; $1\,\mathrm{bar} = 10^5\,\mathrm{Pa}$; $1\,\mathrm{atm} = 101\,325\,\mathrm{Pa}$),
- **prostornina** $V$ v $\mathrm{m^3}$ ($1\,\mathrm{L} = 1\,\mathrm{dm^3} = 10^{-3}\,\mathrm{m^3}$),
- **absolutna temperatura** $T$ v kelvinih, $T/\mathrm{K} = t/^\circ\mathrm{C} + 273{,}15$,
- **množina** $n$ v molih.

**2. Plinski zakoni.** Zgodovinsko so jih odkrili posamično:

- **Boylov zakon:** pri stalnih $T$ in $n$ je $pV = \text{konst.}$ (če tlak podvojimo, se prostornina razpolovi),
- **Gay-Lussacov (Charlesov) zakon:** pri stalnih $p$ in $n$ je $V/T = \text{konst.}$,
- **Amontonsov zakon:** pri stalnih $V$ in $n$ je $p/T = \text{konst.}$,
- **Avogadrov zakon:** pri stalnih $p$ in $T$ je $V/n = \text{konst.}$ (enake prostornine plinov pri enakih pogojih vsebujejo enako število molekul).

**3. Splošna plinska enačba.** Vsi zakoni so posebni primeri enačbe

$$pV = nRT, \qquad R = 8{,}314\,\mathrm{J/(mol\,K)}.$$

*Izpeljava:* po Boylu je $V \propto 1/p$ (pri stalnih $T$, $n$), po Charlesu $V \propto T$ (pri stalnih $p$, $n$), po Avogadru $V \propto n$ (pri stalnih $p$, $T$). Ker vsaka sorazmernost velja, ko sta drugi dve količini stalni, je $V \propto nT/p$; sorazmernostni koeficient $R$ je za vse pline enak. Enačba natančno velja za **idealni plin**: model, v katerem so molekule točkaste, med seboj se ne privlačijo in trkajo prožno. Realni plini ji ustrezajo v limiti $p \to 0$.

Ker je $1\,\mathrm{J} = 1\,\mathrm{Pa\,m^3}$, moramo vstaviti tlak v $\mathrm{Pa}$ in prostornino v $\mathrm{m^3}$. Priročno je tudi $R = 8{,}314\,\mathrm{kPa\,L/(mol\,K)}$ (tlak v $\mathrm{kPa}$, prostornina v $\mathrm{L}$). Za stalno množino plina, ki preide iz stanja 1 v stanje 2, velja

$$\frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2}.$$

To sledi neposredno iz $pV/T = nR$, kar je pri stalnem $n$ konstanta.

:::premisli
Pozimi se plin v števcu ohladi na $5\,^\circ\mathrm{C}$, tlak ostane $101{,}325\,\mathrm{kPa}$. Vsebuje $1{,}00\,\mathrm{m^3}$ zdaj več ali manj metana kot pri $15\,^\circ\mathrm{C}$ in za koliko?
---
Več. Pri stalnih $p$ in $V$ je $n \propto 1/T$, zato se množina poveča za faktor $288{,}15/278{,}15 \approx 1{,}036$, na okoli $43{,}8\,\mathrm{mol}$ (za približno $3{,}6\,\%$). Zato dobavitelj prostornino preračuna na dogovorjeno temperaturo.
:::

**Molska prostornina** idealnega plina pri $0\,^\circ\mathrm{C}$ in $101{,}325\,\mathrm{kPa}$ je $V_m = RT/p \approx 22{,}4\,\mathrm{L/mol}$. (Pri standardnem tlaku $100\,\mathrm{kPa}$ in $0\,^\circ\mathrm{C}$ je $22{,}7\,\mathrm{L/mol}$, pri $25\,^\circ\mathrm{C}$ in $101{,}325\,\mathrm{kPa}$ pa $24{,}5\,\mathrm{L/mol}$; vedno preveri, katere pogoje navaja naloga.)

**4. Gostota in molska masa.** Z $n = m/M$ in $\rho = m/V$ dobimo

$$pM = \rho RT \quad\Rightarrow\quad M = \frac{\rho RT}{p}, \qquad \rho = \frac{pM}{RT}.$$

Gostota plina je sorazmerna z molsko maso: pri enakih pogojih je $\mathrm{CO_2}$ ($44\,\mathrm{g/mol}$) gostejši od zraka (povprečno $29\,\mathrm{g/mol}$), helij ($4\,\mathrm{g/mol}$) pa redkejši.

**5. Zmesi plinov in Daltonov zakon.** **Parcialni tlak** $p_i$ komponente $i$ je tlak, ki bi ga ta komponenta imela, če bi sama zavzemala vso prostornino zmesi pri isti temperaturi:

$$p_i = \frac{n_iRT}{V}.$$

**Daltonov zakon:** naj bo v prostornini $V$ pri temperaturi $T$ zmes idealnih plinov, ki med seboj ne reagirajo. Potem je skupni tlak vsota parcialnih tlakov,

$$p = p_1 + p_2 + \dots = \sum_i p_i.$$

*Dokaz:* $\sum_i p_i = \sum_i n_iRT/V = (\sum_i n_i)RT/V = nRT/V$, kar je tlak celotne množine $n$. Iz tega sledi zveza z **množinskim deležem** $x_i = n_i/n_{\text{skupna}}$: deljenje $p_i = n_iRT/V$ z $p = nRT/V$ da

$$p_i = x_i\,p, \qquad \sum_i x_i = 1.$$

:::premisli
V zaprto posodo z dušikom pri $100\,\mathrm{kPa}$ dodajamo kisik, dokler skupni tlak ne naraste na $150\,\mathrm{kPa}$; temperatura je ves čas enaka. Kaj se zgodi s parcialnim tlakom dušika?
---
Ostane $100\,\mathrm{kPa}$. Parcialni tlak $p_i = n_iRT/V$ je odvisen le od množine dušika, prostornine in temperature, ki se niso spremenile. Množinski delež dušika je sicer padel na $2/3$, a skupni tlak se je povečal: $\tfrac23 \cdot 150\,\mathrm{kPa} = 100\,\mathrm{kPa}$.
:::

Pri idealnih plinih je množinski delež enak prostorninskemu deležu: zrak ima okoli $21\,\%$ kisika po prostornini, zato $x(\mathrm{O_2}) \approx 0{,}21$.

**6. Plin, zbran nad vodo.** Ko plin (npr. $\mathrm{H_2}$ ali $\mathrm{O_2}$) zbiramo z izpodrivanjem vode, je v posodi poleg plina še nasičena vodna para. Izmerjeni tlak je vsota: $p = p(\text{plin}) + p(\mathrm{H_2O})$. Nasičeni parni tlak vode je odvisen le od temperature (pri $25\,^\circ\mathrm{C}$ približno $3{,}17\,\mathrm{kPa}$) in ga odčitamo iz tabel.

**7. Meje idealnega plina.** Model predpostavlja, da molekule nimajo lastne prostornine in se med seboj ne privlačijo. Dober je pri nizkih tlakih in visokih temperaturah. Iz istih predpostavk **kinetična teorija** (izpeljava v Nalogi 2) izračuna tlak iz trkov molekul s steno. Za $N$ molekul z maso $m$ in povprečjem kvadrata hitrosti $\langle v^2 \rangle$ dobi $pV = \tfrac13 Nm\langle v^2 \rangle$. Primerjava s $pV = nRT$ da povprečno kinetično energijo molekule $\tfrac12 m\langle v^2 \rangle = \tfrac32 k_BT$ (Boltzmannova konstanta $k_B = R/N_A$, $N_A$ je Avogadrova konstanta) in korensko srednjo hitrost $v_\mathrm{rms} = \sqrt{3RT/M}$. Temperatura je torej merilo za kinetično energijo molekul. Pri visokih tlakih in nizkih temperaturah (blizu utekočinjenja) uporabimo realne modele, npr. van der Waalsovo enačbo (glej »Bolj natančno«).

## Rešeni primeri

### Primer 1 (lažji)

V jeklenki s prostornino $5{,}00\,\mathrm{L}$ je dušik pri tlaku $200\,\mathrm{kPa}$ in temperaturi $25\,^\circ\mathrm{C}$. Kolikšna je množina in kolikšna masa dušika? Molska masa $\mathrm{N_2}$ je $28{,}02\,\mathrm{g/mol}$.

**Podatki:** $V = 5{,}00\,\mathrm{L}$, $p = 200\,\mathrm{kPa}$, $t = 25\,^\circ\mathrm{C}$, $M(\mathrm{N_2}) = 28{,}02\,\mathrm{g/mol}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** množino $n$ in maso $m$ dušika

:::formula
$n = \dfrac{pV}{RT}$, $T = t + 273{,}15\,\mathrm{K}$, $m = nM$
:::

**Rešitev:**

1. Pretvorbe, ker $R$ v $\mathrm{J/(mol\,K)}$ zahteva paskale, kubične metre in kelvine: $p = 2{,}00 \cdot 10^5\,\mathrm{Pa}$, $V = 5{,}00 \cdot 10^{-3}\,\mathrm{m^3}$, $T = 298{,}15\,\mathrm{K}$.
2. $n = \dfrac{2{,}00 \cdot 10^5\,\mathrm{Pa} \cdot 5{,}00 \cdot 10^{-3}\,\mathrm{m^3}}{8{,}314\,\mathrm{J/(mol\,K)} \cdot 298{,}15\,\mathrm{K}} = \dfrac{1000\,\mathrm{J}}{2479\,\mathrm{J/mol}} \approx 0{,}403\,\mathrm{mol}$.
3. $m = 0{,}403\,\mathrm{mol} \cdot 28{,}02\,\mathrm{g/mol} \approx 11{,}3\,\mathrm{g}$.
4. Odgovor: v jeklenki je približno $0{,}403\,\mathrm{mol}$ oziroma $11{,}3\,\mathrm{g}$ dušika.

### Primer 2

Neznan plin ima pri $0\,^\circ\mathrm{C}$ in $101{,}325\,\mathrm{kPa}$ gostoto $1{,}25\,\mathrm{g/L}$. Izračunaj njegovo molsko maso in predlagaj, kateri plin bi to lahko bil.

**Podatki:** $\rho = 1{,}25\,\mathrm{g/L}$, $t = 0\,^\circ\mathrm{C}$, $p = 101{,}325\,\mathrm{kPa}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** molsko maso $M$ in možen plin

:::formula
$M = \dfrac{\rho RT}{p}$
:::

**Rešitev:**

1. Pretvorbe v osnovne enote, da se enote $R$ izidejo: $\rho = 1{,}25\,\mathrm{g/L} = 1{,}25\,\mathrm{kg/m^3}$, $T = 273{,}15\,\mathrm{K}$, $p = 101\,325\,\mathrm{Pa}$.
2. $M = \dfrac{1{,}25\,\mathrm{kg/m^3} \cdot 8{,}314\,\mathrm{J/(mol\,K)} \cdot 273{,}15\,\mathrm{K}}{101\,325\,\mathrm{Pa}} \approx 0{,}0280\,\mathrm{kg/mol} = 28{,}0\,\mathrm{g/mol}$.
3. Preizkus z molsko prostornino, ker so pogoji ravno $0\,^\circ\mathrm{C}$ in $101{,}325\,\mathrm{kPa}$: $1{,}25\,\mathrm{g/L} \cdot 22{,}4\,\mathrm{L/mol} = 28{,}0\,\mathrm{g/mol}$.
4. Molsko maso $28\,\mathrm{g/mol}$ imajo $\mathrm{N_2}$, $\mathrm{CO}$ in $\mathrm{C_2H_4}$; za odločitev bi potrebovali še kemijski preizkus.
5. Odgovor: molska masa plina je približno $28{,}0\,\mathrm{g/mol}$; to je lahko dušik, ogljikov monoksid ali eten.

### Primer 3 (težji)

V posodo s prostornino $10{,}0\,\mathrm{L}$ pri $27\,^\circ\mathrm{C}$ uvedemo $4{,}00\,\mathrm{g}$ helija in $16{,}0\,\mathrm{g}$ kisika. Izračunaj množinska deleža, parcialna tlaka in skupni tlak. Koliko gramov dušika moramo nato še dodati, da skupni tlak pri isti temperaturi naraste na $500\,\mathrm{kPa}$, in kolikšen je tedaj parcialni tlak kisika? Molske mase: $M(\mathrm{He}) = 4{,}003\,\mathrm{g/mol}$, $M(\mathrm{O_2}) = 32{,}00\,\mathrm{g/mol}$, $M(\mathrm{N_2}) = 28{,}02\,\mathrm{g/mol}$.

**Podatki:** $V = 10{,}0\,\mathrm{L}$, $t = 27\,^\circ\mathrm{C}$, $m(\mathrm{He}) = 4{,}00\,\mathrm{g}$, $m(\mathrm{O_2}) = 16{,}0\,\mathrm{g}$, $M(\mathrm{He}) = 4{,}003\,\mathrm{g/mol}$, $M(\mathrm{O_2}) = 32{,}00\,\mathrm{g/mol}$, $M(\mathrm{N_2}) = 28{,}02\,\mathrm{g/mol}$, končni tlak $500\,\mathrm{kPa}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** $x(\mathrm{He})$, $x(\mathrm{O_2})$, $p(\mathrm{He})$, $p(\mathrm{O_2})$, skupni tlak $p$, maso dodanega dušika in nov $p(\mathrm{O_2})$

:::formula
$n_i = m_i/M_i$, $x_i = n_i/n$, $p = \dfrac{nRT}{V}$, $p_i = x_i\,p = \dfrac{n_iRT}{V}$ (Daltonov zakon $p = \sum p_i$)
:::

**Rešitev:**

1. Množini: $n(\mathrm{He}) = 4{,}00 / 4{,}003\,\mathrm{mol} \approx 0{,}999\,\mathrm{mol}$, $n(\mathrm{O_2}) = 16{,}0 / 32{,}00\,\mathrm{mol} = 0{,}500\,\mathrm{mol}$; skupaj $n \approx 1{,}499\,\mathrm{mol}$.
2. Množinska deleža: $x(\mathrm{He}) = 0{,}999 / 1{,}499 \approx 0{,}667$, $x(\mathrm{O_2}) \approx 0{,}333$. Čeprav je kisika po masi štirikrat več, je helija po množini dvakrat več.
3. Skupni tlak: $T = 300{,}15\,\mathrm{K}$, $V = 1{,}00 \cdot 10^{-2}\,\mathrm{m^3}$, $p = \dfrac{1{,}499 \cdot 8{,}314 \cdot 300{,}15}{1{,}00 \cdot 10^{-2}}\,\mathrm{Pa} \approx 3{,}74 \cdot 10^5\,\mathrm{Pa} = 374\,\mathrm{kPa}$.
4. Parcialna tlaka (po Daltonu je vsak sorazmeren z množinskim deležem): $p(\mathrm{He}) = 0{,}667 \cdot 374\,\mathrm{kPa} \approx 249\,\mathrm{kPa}$, $p(\mathrm{O_2}) = 0{,}333 \cdot 374\,\mathrm{kPa} \approx 125\,\mathrm{kPa}$.
5. Preizkus: $p(\mathrm{O_2}) = \dfrac{0{,}500 \cdot 8{,}314 \cdot 300{,}15}{1{,}00 \cdot 10^{-2}}\,\mathrm{Pa} \approx 125\,\mathrm{kPa}$ in $249 + 125 = 374\,\mathrm{kPa}$.
6. Obratni račun: za $500\,\mathrm{kPa}$ potrebujemo skupno množino $n' = \dfrac{5{,}00 \cdot 10^5 \cdot 1{,}00 \cdot 10^{-2}}{8{,}314 \cdot 300{,}15}\,\mathrm{mol} \approx 2{,}0037\,\mathrm{mol}$.
7. Dodati moramo $n(\mathrm{N_2}) = 2{,}0037 - 1{,}4993 = 0{,}5044\,\mathrm{mol}$ (množini helija in kisika se ne spremenita), to je $m = 0{,}5044 \cdot 28{,}02\,\mathrm{g} \approx 14{,}1\,\mathrm{g}$.
8. Parcialni tlak kisika ostane $125\,\mathrm{kPa}$, ker so $n(\mathrm{O_2})$, $V$ in $T$ enaki; delež kisika pa pade na $0{,}500/2{,}0037 \approx 0{,}250$, in res $0{,}250 \cdot 500\,\mathrm{kPa} = 125\,\mathrm{kPa}$.
9. Odgovor: $x(\mathrm{He}) \approx 0{,}667$ in $x(\mathrm{O_2}) \approx 0{,}333$, parcialna tlaka sta približno $249\,\mathrm{kPa}$ in $125\,\mathrm{kPa}$, skupni tlak pa $374\,\mathrm{kPa}$. Dodati moramo okoli $14{,}1\,\mathrm{g}$ dušika; parcialni tlak kisika ostane $125\,\mathrm{kPa}$.

### Primer 4 – zdaj ti

V trgovini za zabave stane jeklenka helija za balone $60\,€$. Jeklenka ima prostornino $10{,}0\,\mathrm{L}$ in tlak $2{,}00 \cdot 10^4\,\mathrm{kPa}$ pri $20\,^\circ\mathrm{C}$. Koliko balonov po $5{,}00\,\mathrm{L}$ napolnimo pri $101\,\mathrm{kPa}$ in $25\,^\circ\mathrm{C}$, če $10{,}0\,\mathrm{L}$ helija (pri teh pogojih) ostane v jeklenki? Koliko stane helij v enem balonu?

**Podatki:** $V_1 = 10{,}0\,\mathrm{L}$, $p_1 = 2{,}00 \cdot 10^4\,\mathrm{kPa}$, $t_1 = 20\,^\circ\mathrm{C}$, $p_2 = 101\,\mathrm{kPa}$, $t_2 = 25\,^\circ\mathrm{C}$, prostornina balona $5{,}00\,\mathrm{L}$, v jeklenki ostane $10{,}0\,\mathrm{L}$, cena $60\,€$
**Iščemo:** število balonov in ceno helija na balon

:::formula
$\dfrac{p_1V_1}{T_1} = \dfrac{p_2V_2}{T_2} \Rightarrow V_2 = V_1 \cdot \dfrac{p_1}{p_2} \cdot \dfrac{T_2}{T_1}$
:::

**Rešitev:**

1. Temperaturi v kelvinih, ker plinski zakoni veljajo za absolutno temperaturo: $T_1 = 293{,}15\,\mathrm{K}$, $T_2 = 298{,}15\,\mathrm{K}$.
2. Množina helija se ne spremeni, zato $V_2 = 10{,}0\,\mathrm{L} \cdot \dfrac{2{,}00 \cdot 10^4\,\mathrm{kPa}}{101\,\mathrm{kPa}} \cdot \dfrac{298{,}15\,\mathrm{K}}{293{,}15\,\mathrm{K}} \approx 2014\,\mathrm{L}$.
3. Odštej helij, ki ostane v jeklenki, in izračunaj število balonov ter ceno na balon sam.

:::premisli
Koliko balonov napolnimo in koliko stane helij v enem?
---
Uporabnega helija je $2014\,\mathrm{L} - 10\,\mathrm{L} = 2004\,\mathrm{L}$, kar da $2004 / 5{,}00 \approx 400{,}8$, torej $400$ polnih balonov (zaokrožimo navzdol, ker zadnji ne bi bil poln). Helij v enem balonu stane $60\,€ / 400 = 0{,}15\,€$.
:::

## Pogoste napake

- **Temperatura v stopinjah Celzija.** V $pV = nRT$ in $p_1V_1/T_1 = p_2V_2/T_2$ vedno vstavimo kelvine. Pri $0\,^\circ\mathrm{C}$ bi sicer delili z nič.
- **Mešanje enot.** $R = 8{,}314\,\mathrm{J/(mol\,K)}$ zahteva $\mathrm{Pa}$ in $\mathrm{m^3}$. Če vstaviš $\mathrm{kPa}$ in $\mathrm{L}$, je rezultat pravilen (faktorja $10^3$ in $10^{-3}$ se izničita), če pa $\mathrm{kPa}$ in $\mathrm{m^3}$, se zmotiš za faktor $1000$.
- **Parcialni tlak iz masnega deleža.** $p_i = x_i\,p$ velja za **množinski** delež, ne za masnega. V Primeru 3 je kisika po masi $80\,\%$, njegov parcialni tlak pa je le tretjina skupnega.
- **22,4 L/mol pri vseh pogojih.** Ta vrednost velja le pri $0\,^\circ\mathrm{C}$ in $101{,}325\,\mathrm{kPa}$.
- **Pozabljena vodna para.** Pri plinu, zbranem nad vodo, je tlak suhega plina manjši od izmerjenega za parni tlak vode.
- **Idealni plin pri visokem tlaku.** Pri več deset barih ali blizu vrelišča se realni plini lahko opazno razlikujejo od $pV = nRT$.

## Povzetek

- $pV = nRT$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$; tlak v $\mathrm{Pa}$, prostornina v $\mathrm{m^3}$, temperatura v $\mathrm{K}$.
- Za stalno množino: $p_1V_1/T_1 = p_2V_2/T_2$ (Boyle, Gay-Lussac, Amontons kot posebni primeri).
- $V_m \approx 22{,}4\,\mathrm{L/mol}$ pri $0\,^\circ\mathrm{C}$ in $101{,}325\,\mathrm{kPa}$; $M = \rho RT/p$.
- Daltonov zakon: $p = \sum p_i$, $p_i = x_i\,p = n_iRT/V$.
- Plin nad vodo: $p(\text{plin}) = p - p(\mathrm{H_2O})$.
- Model idealnega plina velja pri nizkih tlakih in visokih temperaturah.

## Za izpit

Znati moraš povedati:

- plinske zakone (Boyle, Charles, Amontons, Avogadro) s pogoji, kaj je stalno, in izpeljavo $pV = nRT$ iz njih;
- definicijo idealnega plina in kdaj se mu realni plin približa;
- definicijo parcialnega tlaka, Daltonov zakon s pogoji in dokaz zveze $p_i = x_i\,p$;
- izpeljavo $M = \rho RT/p$;
- izpeljavo kinetične teorije $pV = \tfrac13 Nm\langle v^2 \rangle$, $\tfrac12 m\langle v^2 \rangle = \tfrac32 k_BT$ in $v_\mathrm{rms} = \sqrt{3RT/M}$.

### Naloga 1

V jekleni posodi s prostornino $2{,}00\,\mathrm{L}$ je pri $25\,^\circ\mathrm{C}$ zmes $0{,}0500\,\mathrm{mol}$ $\mathrm{H_2}$ in $0{,}0200\,\mathrm{mol}$ $\mathrm{O_2}$. Zmes vžgemo, nastane voda, posodo pa ohladimo nazaj na $25\,^\circ\mathrm{C}$. Izračunaj tlak pred reakcijo, sestavo plinske faze po reakciji in končni tlak. Nasičeni parni tlak vode pri $25\,^\circ\mathrm{C}$ je $3{,}17\,\mathrm{kPa}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$; prostornino tekoče vode zanemari.

**Rešitev:**

1. Pred reakcijo: $n = 0{,}0700\,\mathrm{mol}$, $T = 298{,}15\,\mathrm{K}$, $V = 2{,}00 \cdot 10^{-3}\,\mathrm{m^3}$, zato $p = \dfrac{0{,}0700 \cdot 8{,}314 \cdot 298{,}15}{2{,}00 \cdot 10^{-3}}\,\mathrm{Pa} \approx 8{,}68 \cdot 10^4\,\mathrm{Pa} = 86{,}8\,\mathrm{kPa}$.
2. Reakcija $\mathrm{2\,H_2 + O_2 \to 2\,H_2O}$: za $0{,}0500\,\mathrm{mol}$ $\mathrm{H_2}$ bi potrebovali $0{,}0250\,\mathrm{mol}$ $\mathrm{O_2}$, imamo le $0{,}0200\,\mathrm{mol}$, zato je kisik omejujoči reaktant.
3. Porabi se $2 \cdot 0{,}0200 = 0{,}0400\,\mathrm{mol}$ $\mathrm{H_2}$; ostane $0{,}0100\,\mathrm{mol}$ $\mathrm{H_2}$, nastane $0{,}0400\,\mathrm{mol}$ vode.
4. Ali voda ostane plinasta? Pri $25\,^\circ\mathrm{C}$ je v $2{,}00\,\mathrm{L}$ lahko največ $n = \dfrac{3170 \cdot 2{,}00 \cdot 10^{-3}}{8{,}314 \cdot 298{,}15}\,\mathrm{mol} \approx 2{,}56 \cdot 10^{-3}\,\mathrm{mol}$ pare. To je manj od $0{,}0400\,\mathrm{mol}$, zato večina vode kondenzira in para je nasičena: $p(\mathrm{H_2O}) = 3{,}17\,\mathrm{kPa}$.
5. Parcialni tlak preostalega vodika: $p(\mathrm{H_2}) = \dfrac{0{,}0100 \cdot 8{,}314 \cdot 298{,}15}{2{,}00 \cdot 10^{-3}}\,\mathrm{Pa} \approx 1{,}24 \cdot 10^4\,\mathrm{Pa} = 12{,}4\,\mathrm{kPa}$.
6. Po Daltonu: $p = 12{,}4\,\mathrm{kPa} + 3{,}17\,\mathrm{kPa} \approx 15{,}6\,\mathrm{kPa}$.
7. Odgovor: pred reakcijo je tlak $86{,}8\,\mathrm{kPa}$; po reakciji je v plinski fazi $0{,}0100\,\mathrm{mol}$ $\mathrm{H_2}$ in nasičena vodna para, končni tlak je okoli $15{,}6\,\mathrm{kPa}$.

### Naloga 2

Navedi predpostavke kinetične teorije idealnega plina in iz njih izpelji $pV = \tfrac13 Nm\langle v^2 \rangle$. S primerjavo s splošno plinsko enačbo izpelji povprečno kinetično energijo molekule in $v_\mathrm{rms} = \sqrt{3RT/M}$. Utemelji, ali imajo molekule helija in kisika v Primeru 3 ($27\,^\circ\mathrm{C}$) enako povprečno kinetično energijo in enako $v_\mathrm{rms}$; izračunaj obe hitrosti ($M(\mathrm{He}) = 4{,}003\,\mathrm{g/mol}$, $M(\mathrm{O_2}) = 32{,}00\,\mathrm{g/mol}$).

**Rešitev:**

1. Predpostavke: $N$ enakih molekul z maso $m$ v kocki s stranico $L$ ($V = L^3$); molekule so točkaste, med seboj se ne privlačijo, trki s stenami so prožni, trki med molekulami ne spremenijo porazdelitve hitrosti, smeri gibanja so naključne.
2. Molekula s komponento hitrosti $v_x$ se od stene odbije s $-v_x$, zato se ji gibalna količina spremeni za $2mv_x$.
3. Do iste stene se vrne po času $2L/v_x$, zato je povprečna sila ene molekule na steno $\dfrac{2mv_x}{2L/v_x} = \dfrac{mv_x^2}{L}$.
4. Za vse molekule je sila $Nm\langle v_x^2 \rangle/L$, tlak pa sila na ploščino $L^2$: $p = Nm\langle v_x^2 \rangle/V$.
5. Nobena smer ni izbrana, zato $\langle v_x^2 \rangle = \langle v_y^2 \rangle = \langle v_z^2 \rangle = \tfrac13\langle v^2 \rangle$ in $pV = \tfrac13 Nm\langle v^2 \rangle$.
6. Splošna plinska enačba z $n = N/N_A$ in $k_B = R/N_A$ se glasi $pV = Nk_BT$. Primerjava da $\tfrac13 m\langle v^2 \rangle = k_BT$, torej $\tfrac12 m\langle v^2 \rangle = \tfrac32 k_BT$.
7. Ker je $mN_A = M$ in $k_BN_A = R$, je $\langle v^2 \rangle = 3RT/M$ in $v_\mathrm{rms} = \sqrt{3RT/M}$.
8. Povprečna kinetična energija je odvisna le od $T$, zato je pri $300{,}15\,\mathrm{K}$ za He in $\mathrm{O_2}$ enaka. Hitrosti pa ne: $v_\mathrm{rms}(\mathrm{He}) = \sqrt{3 \cdot 8{,}314 \cdot 300{,}15/0{,}004003}\,\mathrm{m/s} \approx 1368\,\mathrm{m/s}$, $v_\mathrm{rms}(\mathrm{O_2}) = \sqrt{3 \cdot 8{,}314 \cdot 300{,}15/0{,}03200}\,\mathrm{m/s} \approx 484\,\mathrm{m/s}$; razmerje je $\sqrt{32{,}00/4{,}003} \approx 2{,}83$.
9. Odgovor: $pV = \tfrac13 Nm\langle v^2 \rangle$, $\tfrac12 m\langle v^2 \rangle = \tfrac32 k_BT$, $v_\mathrm{rms} = \sqrt{3RT/M}$; helij in kisik imata enako povprečno kinetično energijo, helijeve molekule pa so okoli $2{,}83$-krat hitrejše.

## Drugače: Na sliki

Predstavljaj si posodo iz Primera 3 kot škatlo z dvema vrstama kroglic:

```
 +-----------------------------+
 |  o   o    .   o    o   .    |    o  helij  (0,999 mol, 2/3 molekul)
 |    o    .    o   o    o     |    .  kisik  (0,500 mol, 1/3 molekul)
 |  .   o    o     .   o    o  |
 |    o   .    o   o    .      |    p(He) = 249 kPa
 +-----------------------------+    p(O2) = 125 kPa
                                     p     = 374 kPa
```

Tlak nastane zaradi trkov molekul s stenami. Ker se pri idealnem plinu molekule ne zmenijo druga za drugo, vsaka vrsta »tolče« po stenah, kot da bi bila sama. Helijevih molekul je dvakrat več, zato prispevajo dve tretjini tlaka, čeprav je vsaka osemkrat lažja od molekule kisika. Pri isti temperaturi imajo namreč vse molekule enako povprečno kinetično energijo: lažje so ustrezno hitrejše, zato vsaka v povprečju enako močno tolče po steni.

## Drugače: Uporaba v stroki

**Normni kubični metri.** V industriji pretoke plinov podajamo v $\mathrm{Nm^3}$ (pri $0\,^\circ\mathrm{C}$ in $101{,}325\,\mathrm{kPa}$); $1\,\mathrm{Nm^3}$ idealnega plina je približno $44{,}6\,\mathrm{mol}$ ne glede na vrsto plina, zato iz izmerjenega prostorninskega pretoka takoj dobimo množinski pretok.

**Varnost jeklenk.** Pri stalni prostornini je $p \propto T$: jeklenka, napolnjena na $200\,\mathrm{bar}$ pri $20\,^\circ\mathrm{C}$, ima pri $50\,^\circ\mathrm{C}$ tlak okoli $200 \cdot 323/293 \approx 220\,\mathrm{bar}$. Zato jeklenke hranimo v senci in daleč od grelcev.

**Bioprocesna tehnika.** V bioreaktorju iz parcialnih tlakov $\mathrm{O_2}$ in $\mathrm{CO_2}$ v vstopnem in izstopnem plinu izračunamo porabo kisika in nastanek $\mathrm{CO_2}$; njuno razmerje (respiracijski kvocient) pove, kaj celice presnavljajo. Pri vrenju mošta iz prostornine sproščenega $\mathrm{CO_2}$ ocenimo, koliko sladkorja je že pretvorjenega.

**Visokotlačni procesi in potapljaška tehnika.** Sinteza amonijaka poteka pri $150$ do $300\,\mathrm{bar}$, kjer $pV = nRT$ ne zadošča in reaktorje računamo z realnimi enačbami stanja. Zmesi za globoke potope sestavimo tako, da $p(\mathrm{O_2})$ ostane pod okoli $140\,\mathrm{kPa}$; na $40\,\mathrm{m}$ (okoli $500\,\mathrm{kPa}$) je to pri zraku $0{,}21 \cdot 500 = 105\,\mathrm{kPa}$, parcialni tlak dušika pa že povzroča omamo, zato del dušika nadomesti helij.

## Drugače: Korak za korakom s številkami

Pri reakciji cinka s klorovodikovo kislino zberemo vodik nad vodo. Pri $25\,^\circ\mathrm{C}$ in zunanjem tlaku $101{,}0\,\mathrm{kPa}$ je zbranega plina $250\,\mathrm{mL}$. Nasičeni parni tlak vode pri $25\,^\circ\mathrm{C}$ je $3{,}17\,\mathrm{kPa}$. Koliko vodika smo zbrali?

1. **Tlak suhega vodika:** $p(\mathrm{H_2}) = 101{,}0\,\mathrm{kPa} - 3{,}17\,\mathrm{kPa} = 97{,}83\,\mathrm{kPa}$.
2. **Enote:** $p = 9{,}783 \cdot 10^4\,\mathrm{Pa}$, $V = 2{,}50 \cdot 10^{-4}\,\mathrm{m^3}$, $T = 298{,}15\,\mathrm{K}$.
3. **Produkt $pV$:** $9{,}783 \cdot 10^4 \cdot 2{,}50 \cdot 10^{-4} \approx 24{,}46\,\mathrm{J}$.
4. **Produkt $RT$:** $8{,}314 \cdot 298{,}15 \approx 2479\,\mathrm{J/mol}$.
5. **Množina:** $n = 24{,}46 / 2479\,\mathrm{mol} \approx 9{,}87 \cdot 10^{-3}\,\mathrm{mol}$.
6. **Masa:** $m = 9{,}87 \cdot 10^{-3}\,\mathrm{mol} \cdot 2{,}016\,\mathrm{g/mol} \approx 0{,}0199\,\mathrm{g}$.
7. **Primerjava:** če vodne pare ne bi upoštevali, bi dobili $1{,}019 \cdot 10^{-2}\,\mathrm{mol}$, kar je približno $3\,\%$ preveč.

## Drugače: Bolj natančno

**Kinetična teorija plinov.** Iz trkov molekul s steno (sprememba gibalne količine $2mv_x$ pri vsakem trku) sledi

$$pV = \tfrac{1}{3}Nm\langle v^2 \rangle,$$

kjer je $N$ število molekul in $\langle v^2 \rangle$ povprečje kvadrata hitrosti. Primerjava s $pV = nRT = Nk_BT$ da povprečno kinetično energijo molekule $\frac{1}{2}m\langle v^2 \rangle = \frac{3}{2}k_BT$: temperatura je merilo za kinetično energijo molekul. Korenska srednja hitrost je $v_{\mathrm{rms}} = \sqrt{3RT/M}$; za dušik pri $25\,^\circ\mathrm{C}$ je $\sqrt{3 \cdot 8{,}314 \cdot 298{,}15 / 0{,}02802}\,\mathrm{m/s} \approx 515\,\mathrm{m/s}$. Daltonov zakon sledi neposredno: prispevki različnih vrst molekul k sili na steno se seštejejo.

**Van der Waalsova enačba.** Za realne pline

$$\left(p + \frac{an^2}{V^2}\right)(V - nb) = nRT.$$

Člen $an^2/V^2$ popravi tlak zaradi privlaka med molekulami (molekule ob steni »vleče« nazaj), člen $nb$ pa odšteje lastno prostornino molekul. Za $\mathrm{CO_2}$ je $a \approx 0{,}364\,\mathrm{Pa\,m^6/mol^2}$ in $b \approx 4{,}27 \cdot 10^{-5}\,\mathrm{m^3/mol}$. Za $1{,}00\,\mathrm{mol}$ $\mathrm{CO_2}$ v $1{,}00\,\mathrm{L}$ pri $300\,\mathrm{K}$ da idealni plin $p = 2{,}49\,\mathrm{MPa}$, van der Waalsova enačba pa

$$p = \frac{nRT}{V - nb} - \frac{an^2}{V^2} \approx 2{,}61\,\mathrm{MPa} - 0{,}36\,\mathrm{MPa} \approx 2{,}24\,\mathrm{MPa},$$

kar je okoli $10\,\%$ manj.

**Kompresijski faktor.** Odstop od idealnosti opišemo z $Z = pV_m/(RT)$. Za idealni plin je $Z = 1$; $Z < 1$ pomeni prevlado privlačnih sil, $Z > 1$ prevlado odbojnih (lastna prostornina). Pri zelo nizkem tlaku gre $Z \to 1$ za vse pline, kar je natančen pomen trditve, da se »vsi plini v limiti obnašajo idealno«.

## Preveri se

? Koliko kelvinov je $25\,^\circ\mathrm{C}$?
- $248{,}15\,\mathrm{K}$
~ Od $273{,}15$ si odštel $25$ namesto prištel; temperatura nad lediščem je več kot $273{,}15\,\mathrm{K}$.
+ $298{,}15\,\mathrm{K}$
- $25\,\mathrm{K}$
~ Kelvin in stopinja Celzija sta enako velika, ničli pa sta različni: prišteti moraš $273{,}15$.
> $T/\mathrm{K} = t/^\circ\mathrm{C} + 273{,}15 = 298{,}15$.

? Pri stalni temperaturi in množini plina tlak podvojimo. Kaj se zgodi s prostornino?
- Podvoji se.
~ Pri stalni temperaturi sta tlak in prostornina obratno sorazmerna; sorazmerje bi veljalo za $p$ in $T$ pri stalni prostornini.
+ Razpolovi se.
- Ostane enaka.
~ Prostornina bi ostala enaka le v togi posodi; pri večjem tlaku se plin stisne, ker je $pV$ stalen.
> Po Boylovem zakonu je $pV$ stalen, zato se pri dvakrat večjem tlaku prostornina razpolovi.

? V zmesi je $0{,}30\,\mathrm{mol}$ $\mathrm{N_2}$ in $0{,}10\,\mathrm{mol}$ $\mathrm{O_2}$, skupni tlak je $200\,\mathrm{kPa}$. Kolikšen je parcialni tlak kisika?
- $100\,\mathrm{kPa}$
~ Polovico tlaka bi dobil kisik le, če bi bilo obeh plinov enako; kisik je le četrtina vseh molov.
- $66{,}7\,\mathrm{kPa}$
~ Delil si z množino dušika ($0{,}10/0{,}30$) namesto s skupno množino $0{,}40\,\mathrm{mol}$.
+ $50\,\mathrm{kPa}$
> $x(\mathrm{O_2}) = 0{,}10/0{,}40 = 0{,}25$, $p(\mathrm{O_2}) = 0{,}25 \cdot 200\,\mathrm{kPa} = 50\,\mathrm{kPa}$. $66{,}7\,\mathrm{kPa}$ dobiš, če deliš z množino dušika namesto s skupno množino.

? Kolikšna je molska prostornina idealnega plina pri $0\,^\circ\mathrm{C}$ in $101{,}325\,\mathrm{kPa}$?
+ $22{,}4\,\mathrm{L/mol}$
- $24{,}5\,\mathrm{L/mol}$
~ To je molska prostornina pri $25\,^\circ\mathrm{C}$; pri $0\,^\circ\mathrm{C}$ je plin gostejši in zavzame manj prostora.
- $8{,}31\,\mathrm{L/mol}$
~ To je številska vrednost plinske konstante $R$, ne molska prostornina; manjka še $T/p$.
> $V_m = RT/p = 8{,}314 \cdot 273{,}15 / 101\,325\,\mathrm{m^3/mol} \approx 0{,}0224\,\mathrm{m^3/mol}$. $24{,}5\,\mathrm{L/mol}$ velja pri $25\,^\circ\mathrm{C}$.

? V treh enakih balonih iz trgovine je pri enakem tlaku in temperaturi helij, dušik in ogljikov dioksid. Razvrsti balone po masi plina, od najlažjega.
+ helij < dušik < ogljikov dioksid
- vsi trije vsebujejo enako maso plina
~ Enaka je množina (Avogadrov zakon), ne masa: masa je $m = nM$, molske mase pa so $4$, $28$ in $44\,\mathrm{g/mol}$.
- ogljikov dioksid < dušik < helij
~ Večje molekule ne zavzamejo več prostora v plinu, ker je med molekulami večinoma prazen prostor; v vsakem balonu je enako molekul.
> Pri enakih $p$, $V$ in $T$ je v vseh balonih enaka množina plina, $n = pV/(RT)$. Masa $m = nM$ zato raste z molsko maso: $\mathrm{He}$ ($4\,\mathrm{g/mol}$) < $\mathrm{N_2}$ ($28\,\mathrm{g/mol}$) < $\mathrm{CO_2}$ ($44\,\mathrm{g/mol}$).

:::simboli
p | tlak plina | p = \frac{nRT}{V} | Pa | 1 bar = 10⁵ Pa
V | prostornina plina | | m^3 | 1 L = 10⁻³ m³
n | množina plina | n = \frac{pV}{RT} | mol
R | splošna plinska konstanta | | J/(mol K) | 8,314 J/(mol K)
T | absolutna temperatura | T = t + 273{,}15\,\mathrm{K} | K
t | temperatura v stopinjah Celzija | | °C
p_1 | tlak v začetnem stanju | | Pa
V_1 | prostornina v začetnem stanju | | m^3
T_1 | temperatura v začetnem stanju | | K
p_2 | tlak v končnem stanju | | Pa
V_2 | prostornina v končnem stanju | | m^3
T_2 | temperatura v končnem stanju | | K
M | molska masa plina | M = \frac{m}{n} | g/mol | iz gostote plina: M = ρRT/p
\rho | gostota plina | \rho = \frac{m}{V} | g/L | idealni plin: ρ = pM/(RT); 1 g/L = 1 kg/m³
m | masa plina | m = nM | g | v kinetični teoriji masa ene molekule
p_i | parcialni tlak komponente i | p_i = x_i\,p | Pa
n_i | množina komponente i | n_i = \frac{m_i}{M_i} | mol
m_i | masa komponente i | | g
M_i | molska masa komponente i | | g/mol
x_i | množinski delež komponente i | x_i = \frac{n_i}{n} | – | vsota deležev je 1
i | oznaka komponente zmesi | | | teče po vseh plinih v zmesi
N | število molekul | | –
v | hitrost molekule | | m/s | ⟨v²⟩ je povprečje kvadrata hitrosti
a | van der Waalsova konstanta privlaka | | Pa\,m^6/mol^2 | za CO₂ približno 0,364
b | van der Waalsova konstanta lastne prostornine | | m^3/mol | za CO₂ približno 4,27 · 10⁻⁵
:::
