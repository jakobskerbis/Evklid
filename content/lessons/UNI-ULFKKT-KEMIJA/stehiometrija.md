---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Avto na poti na morje porabi okoli $7\,\mathrm{kg}$ bencina, iz izpuha pa pride okoli $22\,\mathrm{kg}$ ogljikovega dioksida, trikrat več, kot je bilo goriva. Masa ni nastala iz nič: vsak atom ogljika iz goriva je s seboj vzel dva atoma kisika iz zraka. Takega računa ne narediš z grami, ampak s štetjem delcev, z moli. Stehiometrija je most med tehtnico in enačbo: iz mase izračunaš množino, iz enačbe razmerje in nazaj maso produkta. Z njo pripraviš reakcijsko zmes, napoveš, katere surovine bo zmanjkalo, in iz sežigne analize ugotoviš formulo neznane spojine, pri sintezi zdravila prav tako kot pri gnojenju njive.

## Razlaga

Iz enačbe $\mathrm{2\,H_2 + O_2 \to 2\,H_2O}$ hočeš izračunati, koliko kisika potrebuješ za $2\,\mathrm{g}$ vodika. Mamljiv odgovor je $1\,\mathrm{g}$, saj je koeficient pri kisiku za polovico manjši. Pravilno pa je okoli $15{,}9\,\mathrm{g}$, ker je molekula kisika skoraj $16$-krat težja od molekule vodika: koeficienti štejejo **delce**, ne grame. Zato najprej potrebujemo količino, ki šteje delce.

**1. Množina snovi.** Množina snovi $n$ je osnovna fizikalna količina z enoto **mol**. En mol vsebuje natanko $N_\mathrm{A} = 6{,}022\,140\,76 \cdot 10^{23}$ osnovnih delcev (atomov, molekul, ionov, formulskih enot). $N_\mathrm{A}$ je **Avogadrova konstanta** z enoto $\mathrm{mol^{-1}}$. Število delcev je

$$N = n\,N_\mathrm{A}.$$

**2. Molska masa.** Molska masa $M$ je masa enega mola snovi, $M = m/n$, enota $\mathrm{g/mol}$. Številsko je enaka relativni molekulski masi $M_\mathrm{r}$, ki jo dobimo kot vsoto relativnih atomskih mas iz periodnega sistema. Za vodo: $M(\mathrm{H_2O}) = 2 \cdot 1{,}008 + 16{,}00 = 18{,}02\,\mathrm{g/mol}$. Najpogostejša pretvorba je

$$n = \frac{m}{M}.$$

Za pline velja še $n = pV/(RT)$, za raztopine $n = c\,V$ (glej lekciji o plinih in raztopinah). Množina je »skupni jezik«: maso, prostornino plina in prostornino raztopine najprej pretvorimo v množino.

**3. Masni delež elementa v spojini.** Iz formule izračunamo, kolikšen del mase pripada posameznemu elementu:

$$w(\mathrm{X}) = \frac{N(\mathrm{X})\,A_\mathrm{r}(\mathrm{X})}{M_\mathrm{r}(\text{spojine})},$$

kjer je $N(\mathrm{X})$ število atomov X v formuli. *Izpeljava:* $1\,\mathrm{mol}$ spojine ima maso $M$ in vsebuje $N(\mathrm{X})\,\mathrm{mol}$ atomov X z maso $N(\mathrm{X})\,M(\mathrm{X})$; razmerje mas je neodvisno od količine vzorca. V vodi je $w(\mathrm{H}) = 2{,}016/18{,}02 \approx 0{,}112$.

**4. Stehiometrični koeficienti.** Urejena enačba ima na obeh straneh enako število atomov vsakega elementa (in enak naboj). Koeficienti povedo razmerje **množin**, ne mas. Iz enačbe

$$\mathrm{C_6H_{12}O_6 + 6\,O_2 \longrightarrow 6\,CO_2 + 6\,H_2O}$$

sledi $n(\mathrm{CO_2}) : n(\mathrm{C_6H_{12}O_6}) = 6 : 1$, masi pa sta v povsem drugem razmerju. Splošno za reaktant A in produkt B s koeficientoma $\nu_\mathrm{A}$ in $\nu_\mathrm{B}$:

$$\frac{n(\mathrm{A})}{\nu_\mathrm{A}} = \frac{n(\mathrm{B})}{\nu_\mathrm{B}},$$

kjer je $n(\mathrm{A})$ zreagirana množina reaktanta in $n(\mathrm{B})$ nastala množina produkta.

**Utemeljitev z reakcijskim obsegom.** Naj poteka ena sama reakcija $\sum_i \nu_i \mathrm{B}_i = 0$ (stehiometrična števila $\nu_i$ produktov pozitivna, reaktantov negativna). Ker se vsak »obrat« reakcije zgodi z vsemi snovmi hkrati, se množina vsake snovi spremeni sorazmerno s svojim koeficientom: $n_i = n_{i,0} + \nu_i\,\xi$, kjer je $\xi$ **reakcijski obseg** (enota mol), enak za vse snovi. Od tod $\Delta n_i/\nu_i = \xi$ za vsak $i$, kar je zgornja zveza (za reaktant je $-\Delta n_i$ zreagirana množina, $|\nu_i|$ pa njegov koeficient). Če hkrati potekajo stranske reakcije, zveza za posamezno enačbo ne velja več.

:::premisli
Zmešaš $10\,\mathrm{g}$ vodika in $10\,\mathrm{g}$ kisika. Ali zreagirata brez ostanka, saj sta masi enaki?
---
Ne. $n(\mathrm{H_2}) = 10/2{,}016 = 4{,}96\,\mathrm{mol}$, $n(\mathrm{O_2}) = 10/32{,}00 = 0{,}3125\,\mathrm{mol}$. Za $0{,}3125\,\mathrm{mol}$ kisika je potrebnih le $0{,}625\,\mathrm{mol}$ vodika ($1{,}26\,\mathrm{g}$), zato ostane okoli $8{,}74\,\mathrm{g}$ vodika. Enake mase pomenijo zelo različno število delcev.
:::

**5. Pot računa.** Skoraj vsaka stehiometrijska naloga ima tri korake:

1. **masa A → množina A** ($n = m/M$),
2. **množina A → množina B** (razmerje koeficientov),
3. **množina B → masa B** ($m = n\,M$).

**6. Omejujoči reaktant.** Kadar reaktanti niso zmešani v stehiometričnem razmerju (razmerju koeficientov), bo enega zmanjkalo prej. To je **omejujoči reaktant**: določa, koliko produkta lahko nastane. Drugi reaktanti so v **presežku**. Omejujoči reaktant najdemo tako, da za vsak reaktant izračunamo razmerje $n/\nu$; najmanjše razmerje pripada omejujočemu reaktantu. Enakovredno: izračunamo, koliko produkta bi dal vsak reaktant posebej, in vzamemo manjšo vrednost.

*Dokaz:* za reaktant je $\nu_i < 0$, zato $n_i = n_{i,0} - |\nu_i|\,\xi \ge 0$ velja le pri $\xi \le n_{i,0}/|\nu_i|$. To mora veljati za vse reaktante hkrati, zato je največji možni obseg

$$\xi_\text{max} = \min_{i\ \text{reaktanti}} \frac{n_{i,0}}{|\nu_i|},$$

reaktant, pri katerem je dosežen minimum, pa se porabi prvi. Teoretična množina produkta P je $\nu_\mathrm{P}\,\xi_\text{max}$.

**7. Izkoristek.** **Teoretični izkoristek** je masa (ali množina) produkta, izračunana iz omejujočega reaktanta, ob predpostavki, da reakcija poteče do konca in brez izgub. V praksi dobimo manj: reakcija lahko doseže ravnotežje, potekajo stranske reakcije, del produkta izgubimo pri filtriranju in prekristalizaciji. **Izkoristek** reakcije je

$$\eta = \frac{m_\text{dejanska}}{m_\text{teoretična}} \cdot 100\,\%.$$

Pri večstopenjski sintezi se izkoristki posameznih stopenj zmnožijo: tri stopnje po $80\,\%$ dajo skupaj le $0{,}8^3 \approx 51\,\%$. *Dokaz* (za izkoristke, izražene z množinami, in stopnje, kjer je produkt prejšnje stopnje omejujoči reaktant naslednje): stopnja $k$ da $n_k = \eta_k \cdot \nu_k n_{k-1}$, kjer je $\nu_k$ stehiometrično razmerje te stopnje. Po $s$ stopnjah je $n_s = (\eta_1\eta_2\cdots\eta_s)(\nu_1\cdots\nu_s)\,n_0$, teoretično pa $(\nu_1\cdots\nu_s)\,n_0$; njuno razmerje je $\eta_1\eta_2\cdots\eta_s$.

:::premisli
Sošolec pri vajah izračuna izkoristek $108\,\%$ in je ponosen na zelo dobro reakcijo. Kaj mu poveš?
---
Več produkta, kot ga dopušča omejujoči reaktant, ne more nastati, zato izkoristek nad $100\,\%$ pomeni napako. Najpogosteje je produkt še vlažen ali nečist (topilo, stranski produkti povečajo maso), lahko pa je napaka v računu teoretične mase.
:::

**8. Empirična in molekulska formula.** **Empirična formula** podaja najmanjše celoštevilsko razmerje atomov v spojini (za glukozo $\mathrm{CH_2O}$). **Molekulska formula** pove dejansko število atomov v molekuli ($\mathrm{C_6H_{12}O_6}$) in je celoštevilski večkratnik empirične. Postopek:

1. iz masnih deležev (ali mas) izračunaj **množine** elementov, npr. na $100\,\mathrm{g}$ spojine,
2. vse množine deli z najmanjšo,
3. če razmerja niso cela, jih pomnoži z majhnim celim številom ($1{,}5 \to \cdot 2$, $1{,}33 \to \cdot 3$),
4. molekulsko formulo dobiš iz molske mase: $k = M(\text{spojine})/M(\text{empirične formule})$.

Pri **sežigni analizi** organske spojine ves ogljik preide v $\mathrm{CO_2}$, ves vodik v $\mathrm{H_2O}$. Iz mas teh produktov izračunamo maso C in H, kisik pa dobimo kot razliko do mase vzorca. Pogoji: sežig je popoln, vzorec je čist in vsebuje le C, H in O (drugače moramo druge elemente določiti posebej); ker je del kisika v produktih prišel iz zraka, kisika iz produktov ne računamo. Iz same sežigne analize dobimo le empirično formulo, za molekulsko potrebujemo še neodvisno izmerjeno molsko maso, npr. iz gostote pare ($M = mRT/(pV)$) ali masne spektrometrije.

## Rešeni primeri

### Primer 1 (lažji)

Planinka na poti na Triglav poje energijsko ploščico s $45{,}0\,\mathrm{g}$ glukoze $\mathrm{C_6H_{12}O_6}$, ki jo celice popolnoma oksidirajo (enako kot pri sežigu). Koliko gramov ogljikovega dioksida pri tem nastane? Uporabi $A_\mathrm{r}(\mathrm{C}) = 12{,}01$, $A_\mathrm{r}(\mathrm{H}) = 1{,}008$, $A_\mathrm{r}(\mathrm{O}) = 16{,}00$.

**Podatki:** $m(\mathrm{C_6H_{12}O_6}) = 45{,}0\,\mathrm{g}$, $A_\mathrm{r}(\mathrm{C}) = 12{,}01$, $A_\mathrm{r}(\mathrm{H}) = 1{,}008$, $A_\mathrm{r}(\mathrm{O}) = 16{,}00$, reakcija: $\mathrm{C_6H_{12}O_6 + 6\,O_2 \to 6\,CO_2 + 6\,H_2O}$
**Iščemo:** maso $m(\mathrm{CO_2})$

:::formula
$n = \dfrac{m}{M}$, $\quad n(\mathrm{CO_2}) = 6\,n(\mathrm{C_6H_{12}O_6})$, $\quad m = n\,M$
:::

**Rešitev:**

1. Molski masi: $M(\mathrm{C_6H_{12}O_6}) = 6 \cdot 12{,}01 + 12 \cdot 1{,}008 + 6 \cdot 16{,}00 = 180{,}16\,\mathrm{g/mol}$, $M(\mathrm{CO_2}) = 12{,}01 + 2 \cdot 16{,}00 = 44{,}01\,\mathrm{g/mol}$.
2. Množina glukoze (enačba povezuje množine, ne mase): $n = 45{,}0\,\mathrm{g} / 180{,}16\,\mathrm{g/mol} = 0{,}2498\,\mathrm{mol}$.
3. Iz enačbe (koeficient $6$ pri $\mathrm{CO_2}$ proti $1$ pri glukozi): $n(\mathrm{CO_2}) = 6 \cdot 0{,}2498\,\mathrm{mol} = 1{,}499\,\mathrm{mol}$.
4. Masa: $m(\mathrm{CO_2}) = 1{,}499\,\mathrm{mol} \cdot 44{,}01\,\mathrm{g/mol} \approx 66{,}0\,\mathrm{g}$.
5. Odgovor: pri sežigu nastane približno $66{,}0\,\mathrm{g}$ ogljikovega dioksida, kar je več od mase glukoze, ker se ogljik veže s kisikom iz zraka.

### Primer 2

Pri aluminotermični reakciji $\mathrm{Fe_2O_3 + 2\,Al \to Al_2O_3 + 2\,Fe}$ zmešamo $20{,}0\,\mathrm{g}$ aluminija in $50{,}0\,\mathrm{g}$ železovega(III) oksida. Dobimo $30{,}5\,\mathrm{g}$ železa. Kateri reaktant je omejujoči, koliko železa bi lahko nastalo, kolikšen je izkoristek in koliko reaktanta v presežku ostane? $M(\mathrm{Al}) = 26{,}98\,\mathrm{g/mol}$, $M(\mathrm{Fe}) = 55{,}85\,\mathrm{g/mol}$, $M(\mathrm{Fe_2O_3}) = 159{,}70\,\mathrm{g/mol}$.

**Podatki:** $m(\mathrm{Al}) = 20{,}0\,\mathrm{g}$, $m(\mathrm{Fe_2O_3}) = 50{,}0\,\mathrm{g}$, $m_\text{dejanska}(\mathrm{Fe}) = 30{,}5\,\mathrm{g}$, $M(\mathrm{Al}) = 26{,}98\,\mathrm{g/mol}$, $M(\mathrm{Fe}) = 55{,}85\,\mathrm{g/mol}$, $M(\mathrm{Fe_2O_3}) = 159{,}70\,\mathrm{g/mol}$, enačba $\mathrm{Fe_2O_3 + 2\,Al \to Al_2O_3 + 2\,Fe}$
**Iščemo:** omejujoči reaktant, teoretično maso železa, izkoristek $\eta$ in maso preostalega reaktanta

:::formula
Omejujoči reaktant ima najmanjše razmerje $n/\nu$. $\quad \eta = \dfrac{m_\text{dejanska}}{m_\text{teoretična}} \cdot 100\,\%$
:::

**Rešitev:**

1. Množini (primerjati smemo le množine, ne mase): $n(\mathrm{Al}) = 20{,}0 / 26{,}98 = 0{,}7413\,\mathrm{mol}$, $n(\mathrm{Fe_2O_3}) = 50{,}0 / 159{,}70 = 0{,}3131\,\mathrm{mol}$.
2. Razmerji $n/\nu$: za $\mathrm{Al}$ $0{,}7413/2 = 0{,}3706\,\mathrm{mol}$, za $\mathrm{Fe_2O_3}$ $0{,}3131/1 = 0{,}3131\,\mathrm{mol}$. Manjše je pri $\mathrm{Fe_2O_3}$, zato je **železov(III) oksid omejujoči reaktant**. (Preizkus: za $0{,}3131\,\mathrm{mol}$ $\mathrm{Fe_2O_3}$ potrebujemo $0{,}6262\,\mathrm{mol}$ Al, imamo ga $0{,}7413\,\mathrm{mol}$.)
3. Teoretično iz omejujočega reaktanta, ker ga zmanjka prvega: $n(\mathrm{Fe}) = 2 \cdot 0{,}3131 = 0{,}6262\,\mathrm{mol}$, $m(\mathrm{Fe}) = 0{,}6262 \cdot 55{,}85 \approx 34{,}97\,\mathrm{g}$.
4. Izkoristek: $\eta = 30{,}5 / 34{,}97 \cdot 100\,\% \approx 87{,}2\,\%$.
5. Presežek: porabi se $0{,}6262\,\mathrm{mol}$ Al, ostane $0{,}7413 - 0{,}6262 = 0{,}1151\,\mathrm{mol}$, kar je $0{,}1151 \cdot 26{,}98 \approx 3{,}11\,\mathrm{g}$ aluminija.
6. Odgovor: omejujoči reaktant je $\mathrm{Fe_2O_3}$; nastane lahko največ $35{,}0\,\mathrm{g}$ železa, izkoristek je $87{,}2\,\%$, neporabljenega ostane približno $3{,}11\,\mathrm{g}$ aluminija.

### Primer 3 (težji)

Pri sežigu $0{,}2000\,\mathrm{g}$ hlapne tekočine, ki vsebuje le ogljik, vodik in kisik, nastane $0{,}3565\,\mathrm{g}$ $\mathrm{CO_2}$ in $0{,}1460\,\mathrm{g}$ $\mathrm{H_2O}$. Ko $0{,}250\,\mathrm{g}$ iste snovi povsem uparimo pri $100{,}0\,^\circ\mathrm{C}$ in $101{,}3\,\mathrm{kPa}$, zavzame para $103{,}4\,\mathrm{mL}$. Določi empirično in molekulsko formulo. $M(\mathrm{CO_2}) = 44{,}01\,\mathrm{g/mol}$, $M(\mathrm{H_2O}) = 18{,}02\,\mathrm{g/mol}$, $A_\mathrm{r}$: C $12{,}01$, H $1{,}008$, O $16{,}00$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$.

**Podatki:** $m(\text{vzorca}) = 0{,}2000\,\mathrm{g}$, $m(\mathrm{CO_2}) = 0{,}3565\,\mathrm{g}$, $m(\mathrm{H_2O}) = 0{,}1460\,\mathrm{g}$, para: $m = 0{,}250\,\mathrm{g}$, $T = 373{,}15\,\mathrm{K}$, $p = 101{,}3\,\mathrm{kPa}$, $V = 103{,}4\,\mathrm{mL}$, $M(\mathrm{CO_2}) = 44{,}01\,\mathrm{g/mol}$, $M(\mathrm{H_2O}) = 18{,}02\,\mathrm{g/mol}$, $A_\mathrm{r}(\mathrm{C}) = 12{,}01$, $A_\mathrm{r}(\mathrm{H}) = 1{,}008$, $A_\mathrm{r}(\mathrm{O}) = 16{,}00$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** empirično in molekulsko formulo

:::formula
$n(\mathrm{C}) = n(\mathrm{CO_2})$, $\quad n(\mathrm{H}) = 2\,n(\mathrm{H_2O})$, $\quad m(\mathrm{O}) = m(\text{vzorca}) - m(\mathrm{C}) - m(\mathrm{H})$, $\quad M = \dfrac{mRT}{pV}$, $\quad k = \dfrac{M(\text{spojine})}{M(\text{empirične formule})}$
:::

**Rešitev:**

1. Ogljik (ves ogljik vzorca je v $\mathrm{CO_2}$, en atom C na molekulo): $n(\mathrm{C}) = 0{,}3565 / 44{,}01 = 0{,}008\,100\,\mathrm{mol}$, $m(\mathrm{C}) = 0{,}008\,100 \cdot 12{,}01 = 0{,}097\,29\,\mathrm{g}$.
2. Vodik (dva atoma H na molekulo vode): $n(\mathrm{H}) = 2 \cdot 0{,}1460 / 18{,}02 = 0{,}016\,20\,\mathrm{mol}$, $m(\mathrm{H}) = 0{,}016\,20 \cdot 1{,}008 = 0{,}016\,33\,\mathrm{g}$.
3. Kisik kot razlika, ker je del kisika v produktih prišel iz zraka: $m(\mathrm{O}) = 0{,}2000 - 0{,}097\,29 - 0{,}016\,33 = 0{,}086\,38\,\mathrm{g}$, $n(\mathrm{O}) = 0{,}086\,38/16{,}00 = 0{,}005\,399\,\mathrm{mol}$.
4. Delimo z najmanjšo množino ($0{,}005\,399$): $\mathrm{C} : \mathrm{H} : \mathrm{O} = 1{,}500 : 3{,}001 : 1{,}000$. Razmerje $1{,}5$ ni zaokrožitvena napaka, zato vse pomnožimo z $2$: $3 : 6 : 2$. Empirična formula je $\mathrm{C_3H_6O_2}$.
5. Molska masa iz plinske enačbe (para se pri teh pogojih obnaša približno idealno): $M = \dfrac{0{,}250\,\mathrm{g} \cdot 8{,}314\,\mathrm{J/(mol\,K)} \cdot 373{,}15\,\mathrm{K}}{101{,}3 \cdot 10^3\,\mathrm{Pa} \cdot 1{,}034 \cdot 10^{-4}\,\mathrm{m^3}} \approx 74{,}0\,\mathrm{g/mol}$.
6. $M(\mathrm{C_3H_6O_2}) = 3 \cdot 12{,}01 + 6 \cdot 1{,}008 + 2 \cdot 16{,}00 = 74{,}08\,\mathrm{g/mol}$, $k = 74{,}0/74{,}08 \approx 1$.
7. Odgovor: empirična in molekulska formula sta enaki, $\mathrm{C_3H_6O_2}$ (npr. metil acetat ali etil formiat; sama formula izomerov ne loči).

### Primer 4 – zdaj ti

Na taborjenju kuhaš na gorilniku, ki porabi celo kartušo s $220\,\mathrm{g}$ propana $\mathrm{C_3H_8}$. Koliko gramov ogljikovega dioksida pri tem nastane? Reakcija: $\mathrm{C_3H_8 + 5\,O_2 \to 3\,CO_2 + 4\,H_2O}$; $A_\mathrm{r}(\mathrm{C}) = 12{,}01$, $A_\mathrm{r}(\mathrm{H}) = 1{,}008$, $M(\mathrm{CO_2}) = 44{,}01\,\mathrm{g/mol}$.

**Podatki:** $m(\mathrm{C_3H_8}) = 220\,\mathrm{g}$, $A_\mathrm{r}(\mathrm{C}) = 12{,}01$, $A_\mathrm{r}(\mathrm{H}) = 1{,}008$, $M(\mathrm{CO_2}) = 44{,}01\,\mathrm{g/mol}$, enačba $\mathrm{C_3H_8 + 5\,O_2 \to 3\,CO_2 + 4\,H_2O}$
**Iščemo:** maso $m(\mathrm{CO_2})$

:::formula
$n = \dfrac{m}{M}$, $\quad n(\mathrm{CO_2}) = 3\,n(\mathrm{C_3H_8})$, $\quad m = n\,M$
:::

**Rešitev:**

1. Molska masa (vsota atomskih mas po formuli): $M(\mathrm{C_3H_8}) = 3 \cdot 12{,}01 + 8 \cdot 1{,}008 = 44{,}09\,\mathrm{g/mol}$.
2. Množina propana, ker enačba povezuje množine: $n = 220\,\mathrm{g} / 44{,}09\,\mathrm{g/mol} = 4{,}990\,\mathrm{mol}$.
3. Iz enačbe (trije atomi C dajo tri molekule $\mathrm{CO_2}$): $n(\mathrm{CO_2}) = 3 \cdot 4{,}990\,\mathrm{mol} = 14{,}97\,\mathrm{mol}$.
4. Maso $\mathrm{CO_2}$ izračunaj sam.

:::premisli
Koliko $\mathrm{CO_2}$ nastane in zakaj je to več od mase propana v kartuši?
---
$m(\mathrm{CO_2}) = 14{,}97\,\mathrm{mol} \cdot 44{,}01\,\mathrm{g/mol} \approx 659\,\mathrm{g}$, trikrat več od $220\,\mathrm{g}$ propana. Vsak atom ogljika se veže z dvema atomoma kisika iz zraka, prav tako kot pri avtu iz uvoda.
:::

## Pogoste napake

- **Razmerje mas namesto razmerja množin.** Koeficienti v enačbi veljajo za mole. Iz $\mathrm{2\,H_2 + O_2 \to 2\,H_2O}$ ne sledi, da $2\,\mathrm{g}$ vodika reagira z $1\,\mathrm{g}$ kisika; pravilno je $4{,}03\,\mathrm{g}$ $\mathrm{H_2}$ na $32{,}00\,\mathrm{g}$ $\mathrm{O_2}$.
- **Neurejena enačba.** Pred vsakim računom preveri, da je enačba urejena. Napačen koeficient pokvari vse naslednje korake.
- **Omejujoči reaktant po manjši masi.** Reaktant z manjšo maso ni nujno omejujoči. V Primeru 2 je aluminija manj po masi ($20\,\mathrm{g}$ proti $50\,\mathrm{g}$), pa je kljub temu v presežku. Primerjaj $n/\nu$.
- **Izkoristek iz reaktanta v presežku.** Teoretični izkoristek se vedno računa iz omejujočega reaktanta. Izkoristek nad $100\,\%$ pomeni napako (ali vlažen, nečist produkt).
- **Zaokroževanje v vmesnih korakih.** Pri empirični formuli zaokroži razmerje šele na koncu. Razmerje $1{,}5$ ni $2$, ampak pomeni, da moraš vse pomnožiti z $2$.
- **Atomi in molekule.** $1\,\mathrm{mol}$ $\mathrm{O_2}$ vsebuje $2\,\mathrm{mol}$ atomov kisika. Pri $M$ in $N_\mathrm{A}$ vedno zapiši, za katere delce gre.
- **Kisik pri sežigni analizi.** Kisika iz mase $\mathrm{CO_2}$ in $\mathrm{H_2O}$ ne moremo izračunati, ker je del kisika prišel iz zraka; dobimo ga kot razliko do mase vzorca.

## Povzetek

- $n = m/M = N/N_\mathrm{A}$, $N_\mathrm{A} = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$; za pline $n = pV/(RT)$, za raztopine $n = cV$.
- Koeficienti urejene enačbe so razmerja množin: $n(\mathrm{A})/\nu_\mathrm{A} = n(\mathrm{B})/\nu_\mathrm{B}$.
- Pot: masa → množina → razmerje iz enačbe → množina → masa.
- **Omejujoči reaktant** ima najmanjši $n/\nu$ in določa teoretični izkoristek; ostali so v presežku.
- **Izkoristek** $\eta = m_\text{dejanska}/m_\text{teoretična} \cdot 100\,\%$; pri več stopnjah se izkoristki množijo.
- **Empirična formula**: množine elementov, deli z najmanjšo, pomnoži do celih števil; **molekulska** je njen $k$-kratnik, $k = M/M_\text{emp}$.

## Za izpit

Znati moraš povedati:

- definicijo mola (SI 2019), Avogadrove konstante in molske mase ter zvezo $n = m/M = N/N_\mathrm{A}$;
- definicijo reakcijskega obsega $n_i = n_{i,0} + \nu_i\xi$ in iz nje izpeljavo, da so koeficienti razmerja množin;
- definicijo omejujočega reaktanta in dokaz, da ima najmanjši $n_{i,0}/|\nu_i|$ ($\xi_\text{max}$);
- definicijo teoretičnega izkoristka in izkoristka ter dokaz, da se izkoristki zaporednih stopenj množijo;
- definiciji empirične in molekulske formule ter pogoje sežigne analize.

### Naloga 1

Acetilsalicilno kislino ($\mathrm{C_9H_8O_4}$, $M = 180{,}16\,\mathrm{g/mol}$) pripravimo iz salicilne kisline ($\mathrm{C_7H_6O_3}$, $M = 138{,}12\,\mathrm{g/mol}$) in acetanhidrida ($\mathrm{C_4H_6O_3}$, $M = 102{,}09\,\mathrm{g/mol}$, $\rho = 1{,}08\,\mathrm{g/mL}$): $\mathrm{C_7H_6O_3 + C_4H_6O_3 \to C_9H_8O_4 + CH_3COOH}$. Zmešamo $5{,}00\,\mathrm{g}$ salicilne kisline in $7{,}00\,\mathrm{mL}$ acetanhidrida in dobimo $5{,}20\,\mathrm{g}$ surovega produkta, v katerem je masni delež acetilsalicilne kisline $95{,}0\,\%$. a) Kateri reaktant je omejujoči in koliko reaktanta v presežku ostane? b) Kolikšen je izkoristek? c) Koliko salicilne kisline potrebujemo za $100\,\mathrm{g}$ čiste acetilsalicilne kisline pri enakem izkoristku?

**Rešitev:**

1. Množini: $n(\text{salicilne}) = 5{,}00/138{,}12\,\mathrm{mol} = 0{,}036\,20\,\mathrm{mol}$; acetanhidrid ima maso $7{,}00\,\mathrm{mL} \cdot 1{,}08\,\mathrm{g/mL} = 7{,}56\,\mathrm{g}$, torej $n = 7{,}56/102{,}09\,\mathrm{mol} = 0{,}074\,05\,\mathrm{mol}$.
2. Oba koeficienta sta $1$, zato je $n/\nu$ manjši pri salicilni kislini: ta je **omejujoči reaktant**, $\xi_\text{max} = 0{,}036\,20\,\mathrm{mol}$.
3. Presežek: $0{,}074\,05 - 0{,}036\,20 = 0{,}037\,85\,\mathrm{mol}$ acetanhidrida, kar je $0{,}037\,85 \cdot 102{,}09\,\mathrm{g} \approx 3{,}86\,\mathrm{g}$.
4. Teoretična masa: $m_\text{teor} = 0{,}036\,20 \cdot 180{,}16\,\mathrm{g} = 6{,}522\,\mathrm{g}$.
5. Dejanska masa čistega produkta (nečistoče ne štejemo): $5{,}20 \cdot 0{,}950\,\mathrm{g} = 4{,}94\,\mathrm{g}$; $\eta = 4{,}94/6{,}522 \cdot 100\,\% \approx 75{,}7\,\%$.
6. c) Za $100\,\mathrm{g}$ produkta potrebujemo teoretično $100/180{,}16\,\mathrm{mol} = 0{,}5551\,\mathrm{mol}$; pri izkoristku $\eta = 0{,}7575$ moramo vzeti $0{,}5551/0{,}7575\,\mathrm{mol} = 0{,}7328\,\mathrm{mol}$ salicilne kisline, kar je $0{,}7328 \cdot 138{,}12\,\mathrm{g} \approx 101\,\mathrm{g}$.
7. Odgovor: omejujoča je salicilna kislina, ostane okoli $3{,}86\,\mathrm{g}$ acetanhidrida, izkoristek je okoli $75{,}7\,\%$, za $100\,\mathrm{g}$ produkta potrebujemo okoli $101\,\mathrm{g}$ salicilne kisline.

### Naloga 2

Naj poteka ena sama reakcija $\sum_i \nu_i \mathrm{B}_i = 0$. a) Natančno definiraj reakcijski obseg in dokaži, da je masa sistema med reakcijo stalna, če je enačba urejena. b) Natančno definiraj omejujoči reaktant in dokaži, da je to reaktant z najmanjšim $n_{i,0}/|\nu_i|$. c) Utemelji, ali je reaktant z najmanjšo množino nujno omejujoči.

**Rešitev:**

1. a) Reakcijski obseg $\xi$ je količina z enoto mol, za katero velja $n_i = n_{i,0} + \nu_i\xi$ za vse snovi; pri $\xi = 1\,\mathrm{mol}$ reakcija poteče enkrat v molskem merilu, kot je zapisana.
2. Masa sistema: $m = \sum_i n_i M_i = \sum_i n_{i,0}M_i + \xi\sum_i \nu_i M_i$.
3. Urejena enačba ima na obeh straneh enako število atomov vsakega elementa; ker je $M_i$ vsota molskih mas atomov, je $\sum_i \nu_i M_i = 0$. Torej $m = \sum_i n_{i,0}M_i$ za vsak $\xi$: masa se ohranja.
4. b) Omejujoči reaktant je reaktant, ki se ob popolnem poteku reakcije porabi prvi in zato določa največji obseg. Za reaktant je $\nu_i < 0$ in pogoj $n_i \ge 0$ da $\xi \le n_{i,0}/|\nu_i|$. Vsi pogoji hkrati dajo $\xi_\text{max} = \min_i n_{i,0}/|\nu_i|$; pri tem $\xi$ je množina reaktanta, kjer je dosežen minimum, enaka $0$, drugih pa še pozitivna.
5. c) Ne. Pri $\mathrm{2\,H_2 + O_2 \to 2\,H_2O}$ z $1{,}0\,\mathrm{mol}$ $\mathrm{H_2}$ in $0{,}60\,\mathrm{mol}$ $\mathrm{O_2}$ je kisika manj, a $n/|\nu|$ je za vodik $0{,}50\,\mathrm{mol}$, za kisik $0{,}60\,\mathrm{mol}$: omejujoči je vodik, ostane $0{,}10\,\mathrm{mol}$ kisika.
6. Odgovor: masa se ohranja, ker je $\sum_i \nu_i M_i = 0$; omejujoči reaktant je določen z najmanjšim $n_{i,0}/|\nu_i|$, ne z najmanjšo množino ali maso.

## Drugače: Na sliki

Vsak stehiometrijski račun je pot po tem zemljevidu:

```
  masa A          množina A          množina B          masa B
  [ g ]  --:M-->  [ mol ]  --·νB/νA-->  [ mol ]  --·M-->  [ g ]
                     ^                     |
   V(plin), p, T ----+                     +----> V(plin) = nRT/p
   c, V(raztopina) --+                     +----> c = n/V
```

Vodoravna pot vedno teče skozi **množino**. Mase dveh različnih snovi nikoli ne povezujemo neposredno.

Omejujoči reaktant si predstavljaj kot sestavljanje koles: vsako kolo potrebuje $1$ okvir in $2$ obroča. Iz $10$ okvirjev in $14$ obročev sestaviš le $7$ koles (obroči so omejujoči, razmerje $14/2 = 7 < 10/1$), $3$ okvirji ostanejo. Pri reakciji v Primeru 2 so »okvirji« molekule $\mathrm{Fe_2O_3}$, »obroči« atomi Al, le da je tam omejujoči ravno $\mathrm{Fe_2O_3}$.

## Drugače: Uporaba v stroki

**Farmacevtska industrija.** Sinteza zdravilne učinkovine ima pogosto deset in več stopenj. Če ima vsaka izkoristek $90\,\%$, je skupni izkoristek $0{,}9^{10} \approx 35\,\%$. Zato procesni kemiki iščejo krajše poti, dražji reaktant pa namenoma naredijo omejujočega, cenejšega dodajo v presežku (kot acetanhidrid v Nalogi 1).

**Analitski laboratorij: elementna analiza.** Avtomatski analizator CHN vzorec nekaj miligramov sežge v kisiku, nastale $\mathrm{CO_2}$, $\mathrm{H_2O}$ in $\mathrm{N_2}$ pa loči in izmeri. Pri objavi nove spojine se izmerjeni masni deleži ne smejo razlikovati od izračunanih iz formule za več kot okoli $0{,}4$ odstotne točke, kar velja kot merilo čistosti.

**Inženirstvo: zračna blazina.** Ob trku razpade natrijev azid: $\mathrm{2\,NaN_3 \to 2\,Na + 3\,N_2}$. Iz $65{,}0\,\mathrm{g}$ $\mathrm{NaN_3}$ ($M = 65{,}02\,\mathrm{g/mol}$, torej $1{,}000\,\mathrm{mol}$) nastane $1{,}500\,\mathrm{mol}$ dušika, pri $25\,^\circ\mathrm{C}$ in $100\,\mathrm{kPa}$ okoli $37{,}2\,\mathrm{L}$. Premalo azida pomeni mehko blazino, preveč nevarno trdo.

**Fiziologija in klinična prehrana.** Pri popolni oksidaciji glukoze (Primer 1) se za vsak mol porabi $6\,\mathrm{mol}$ $\mathrm{O_2}$ in nastane $6\,\mathrm{mol}$ $\mathrm{CO_2}$. Razmerje $n(\mathrm{CO_2})/n(\mathrm{O_2})$, **respiracijski koeficient**, je za ogljikove hidrate $1$, za maščobe okoli $0{,}7$; z merjenjem v izdihanem zraku (posredna kalorimetrija) ocenijo, kaj telo porablja.

**Agronomija.** Za $120\,\mathrm{kg}$ dušika na hektar je pri masnem deležu dušika v $\mathrm{NH_4NO_3}$ $2 \cdot 14{,}01 / 80{,}05 \approx 0{,}35$ treba posuti približno $343\,\mathrm{kg}$ gnojila.

## Drugače: Korak za korakom s številkami

Koliko gramov vode nastane, če zmešamo $3{,}00\,\mathrm{g}$ vodika in $16{,}0\,\mathrm{g}$ kisika? Reakcija: $\mathrm{2\,H_2 + O_2 \to 2\,H_2O}$; $M(\mathrm{H_2}) = 2{,}016\,\mathrm{g/mol}$, $M(\mathrm{O_2}) = 32{,}00\,\mathrm{g/mol}$, $M(\mathrm{H_2O}) = 18{,}02\,\mathrm{g/mol}$.

1. **Množini:** $n(\mathrm{H_2}) = 3{,}00/2{,}016 = 1{,}488\,\mathrm{mol}$, $n(\mathrm{O_2}) = 16{,}0/32{,}00 = 0{,}500\,\mathrm{mol}$.
2. **Razmerji $n/\nu$:** vodik $1{,}488/2 = 0{,}744$, kisik $0{,}500/1 = 0{,}500$. Manjše je pri kisiku, zato je **kisik omejujoči**.
3. **Produkt:** $n(\mathrm{H_2O}) = 2 \cdot 0{,}500 = 1{,}000\,\mathrm{mol}$, $m(\mathrm{H_2O}) = 18{,}02\,\mathrm{g}$.
4. **Presežek:** porabi se $2 \cdot 0{,}500 = 1{,}000\,\mathrm{mol}$ $\mathrm{H_2}$, ostane $0{,}488\,\mathrm{mol}$, kar je $0{,}488 \cdot 2{,}016 \approx 0{,}98\,\mathrm{g}$.
5. **Preizkus z zakonom o ohranitvi mase:** pred reakcijo $3{,}00 + 16{,}0 = 19{,}0\,\mathrm{g}$, po reakciji $18{,}02 + 0{,}98 = 19{,}0\,\mathrm{g}$. Ujema se.

## Drugače: Bolj natančno

**Definicija mola (SI, 2019).** Mol je definiran z dogovorjeno vrednostjo Avogadrove konstante: $N_\mathrm{A} = 6{,}022\,140\,76 \cdot 10^{23}\,\mathrm{mol^{-1}}$ natanko. Molska masa ogljika-12 zato ni več natanko $12\,\mathrm{g/mol}$, temveč je izmerjena količina, ki se od te vrednosti razlikuje šele okoli desetega značilnega mesta; za vse praktične račune je razlika zanemarljiva. Relativne atomske mase v periodnem sistemu so povprečja po naravni izotopski sestavi in zato ponekod podane kot intervali.

**Reakcijski obseg in izkoristek.** Z reakcijskim obsegom $\xi$ iz Razlage je izkoristek preprosto $\eta = \xi_\text{dejanski}/\xi_\text{max}$, neodvisno od tega, ali ga merimo z maso ali množino produkta. V Primeru 2 je $\xi_\text{max} = 0{,}3131\,\mathrm{mol}$. Pri ravnotežnih reakcijah $\xi_\text{max}$ ni dosežen niti teoretično; največji obseg tam določa konstanta ravnotežja.

**Ekonomičnost atomov.** V zeleni kemiji poleg izkoristka računamo še **atomsko ekonomičnost**: delež mase vseh reaktantov, ki konča v želenem produktu, $\mathrm{AE} = \nu_\mathrm{P}M_\mathrm{P} / \sum |\nu_i| M_i$ (po reaktantih). Za aluminotermijo z železom kot želenim produktom je $\mathrm{AE} = 2 \cdot 55{,}85/(159{,}70 + 2 \cdot 26{,}98) \approx 0{,}52$; skoraj polovica mase konča v $\mathrm{Al_2O_3}$.

**Natančnost in značilna mesta.** Rezultat ne more biti natančnejši od najmanj natančnega podatka. V Primeru 3 so mase podane na štiri značilna mesta, zato dobimo razmerje $1{,}500 : 3{,}001 : 1{,}000$; pri realnih meritvah (napake okoli $0{,}3\,\%$) dobimo npr. $1{,}00 : 1{,}98 : 1{,}02$ in zaokrožimo. Razmerje $2{,}5$ ali $1{,}33$ pa nikoli ne zaokrožimo, ker pomeni empirično formulo z večkratniki ($\cdot 2$ ali $\cdot 3$).

## Preveri se

? Koliko mol je $4{,}0\,\mathrm{g}$ natrijevega hidroksida ($M = 40{,}0\,\mathrm{g/mol}$)?
- $10\,\mathrm{mol}$
~ Delil si obratno, $M/m = 40{,}0/4{,}0$. Enote izdajo napako: $\mathrm{g/mol}$ deljeno z $\mathrm{g}$ da $\mathrm{mol^{-1}}$, ne mol.
+ $0{,}10\,\mathrm{mol}$
- $160\,\mathrm{mol}$
~ Maso si pomnožil z molsko maso in dobil $\mathrm{g^2/mol}$. Množina je masa, deljena z $M$.
> $n = m/M = 4{,}0\,\mathrm{g} / 40{,}0\,\mathrm{g/mol} = 0{,}10\,\mathrm{mol}$. $10$ dobiš, če deliš obratno, $160$ pa, če množiš.

? Za reakcijo $\mathrm{2\,H_2 + O_2 \to 2\,H_2O}$ zmešamo $4\,\mathrm{mol}$ $\mathrm{H_2}$ in $3\,\mathrm{mol}$ $\mathrm{O_2}$. Kateri reaktant je omejujoči?
+ vodik
- kisik
~ Kisika je manj ($3\,\mathrm{mol}$ proti $4\,\mathrm{mol}$), zato se zdi, da ga bo prej zmanjkalo. Na vsako molekulo $\mathrm{O_2}$ pa potrebuješ dve molekuli $\mathrm{H_2}$, zato primerjaj $n/\nu$.
- nobeden, zmes je stehiometrična
~ Stehiometrično razmerje je $2 : 1$, tu pa $4 : 3$. Za $3\,\mathrm{mol}$ kisika bi potrebovali $6\,\mathrm{mol}$ vodika.
> Razmerji $n/\nu$: vodik $4/2 = 2$, kisik $3/1 = 3$. Manjše je pri vodiku. Za $4\,\mathrm{mol}$ $\mathrm{H_2}$ potrebujemo le $2\,\mathrm{mol}$ $\mathrm{O_2}$, zato $1\,\mathrm{mol}$ kisika ostane.

? Teoretični izkoristek sinteze je $50{,}0\,\mathrm{g}$ produkta, dobili smo $40{,}0\,\mathrm{g}$. Kolikšen je izkoristek?
- $125\,\%$
~ Zamenjal si števec in imenovalec. Izkoristek nad $100\,\%$ bi pomenil več produkta, kot ga sploh lahko nastane.
- $20\,\%$
~ To je delež izgub ($10{,}0\,\mathrm{g}$ od $50{,}0\,\mathrm{g}$), ne izkoristek.
+ $80\,\%$
> $\eta = 40{,}0/50{,}0 \cdot 100\,\% = 80\,\%$. $125\,\%$ dobiš, če zamenjaš števec in imenovalec, $20\,\%$ pa je delež izgub.

? Spojina vsebuje $85{,}6\,\%$ ogljika in $14{,}4\,\%$ vodika (masni delež). Kakšna je njena empirična formula?
- $\mathrm{CH}$
~ Za vodik si vzel molsko maso molekule $\mathrm{H_2}$ ($2{,}016$) in dobil $7{,}14\,\mathrm{mol}$, razmerje pa $1 : 1$. Štejemo atome v spojini, zato $1{,}008$.
+ $\mathrm{CH_2}$
- $\mathrm{CH_3}$
~ Morda pomisliš na etan. $\mathrm{CH_3}$ bi imel masni delež vodika okoli $20\,\%$ ($3{,}024/15{,}03$), ta spojina pa ima le $14{,}4\,\%$.
> Na $100\,\mathrm{g}$: $n(\mathrm{C}) = 85{,}6/12{,}01 = 7{,}13\,\mathrm{mol}$, $n(\mathrm{H}) = 14{,}4/1{,}008 = 14{,}3\,\mathrm{mol}$. Razmerje $\mathrm{H}:\mathrm{C} = 2{,}00$, torej $\mathrm{CH_2}$ (npr. eten $\mathrm{C_2H_4}$ ali cikloheksan $\mathrm{C_6H_{12}}$).

? Kaj se zgodi s teoretično maso železa v Primeru 2, če namesto $20{,}0\,\mathrm{g}$ dodaš $40{,}0\,\mathrm{g}$ aluminija, $\mathrm{Fe_2O_3}$ pa ostane $50{,}0\,\mathrm{g}$?
- Podvoji se.
~ Misliš, da več katerega koli reaktanta da več produkta. Količino produkta določa omejujoči reaktant, tu $\mathrm{Fe_2O_3}$, ki ga je enako kot prej.
+ Ostane enaka.
- Zmanjša se, ker presežek aluminija moti reakcijo.
~ Presežek reaktanta produkta ne zmanjša; neporabljenega aluminija le ostane več.
> Za $\mathrm{Fe_2O_3}$ je $n/\nu = 0{,}3131\,\mathrm{mol}$, za $40{,}0\,\mathrm{g}$ Al pa $0{,}7413\,\mathrm{mol}$. Omejujoči ostane $\mathrm{Fe_2O_3}$, zato teoretično še vedno nastane $34{,}97\,\mathrm{g}$ železa.

:::simboli
N | število delcev | N = n\,N_\mathrm{A} | – | N(X): število atomov X v formuli
n | množina snovi | n = \frac{m}{M} | mol
N_\mathrm{A} | Avogadrova konstanta | | mol^{-1} | 6,022 · 10²³ mol⁻¹
m | masa snovi | m = n\,M | g
M | molska masa | M = \frac{m}{n} | g/mol
w | masni delež elementa v spojini | w(\mathrm{X}) = \frac{N(\mathrm{X})\,A_\mathrm{r}(\mathrm{X})}{M_\mathrm{r}(\text{spojine})} | –
A_\mathrm{r} | relativna atomska masa | | –
M_\mathrm{r} | relativna molekulska masa | | – | številsko enaka molski masi v g/mol
\nu_\mathrm{A}, \nu_\mathrm{B} | stehiometrična koeficienta snovi A in B | | –
\nu | stehiometrični koeficient snovi | | – | najmanjše razmerje n/ν ima omejujoči reaktant
\eta | izkoristek reakcije | \eta = \frac{m_\text{dejanska}}{m_\text{teoretična}} \cdot 100\,\% | \%
m_\text{dejanska} | dejansko dobljena masa produkta | | g
m_\text{teoretična} | teoretična masa produkta | | g | izračunana iz omejujočega reaktanta
\nu_i | stehiometrično število snovi i | | – | produkti pozitivni, reaktanti negativni
n_i | množina snovi i med reakcijo | n_i = n_{i,0} + \nu_i\,\xi | mol
n_{i,0} | začetna množina snovi i | | mol
\xi | reakcijski obseg | | mol | enak za vse snovi v reakciji
\xi_\text{max} | največji reakcijski obseg | \xi_\text{max} = \min_{i\ \text{reaktanti}} \frac{n_{i,0}}{\lvert\nu_i\rvert} | mol | določa ga omejujoči reaktant
i | oznaka snovi v reakciji | |
R | splošna plinska konstanta | | J/(mol K) | 8,314 J/(mol K)
T | absolutna temperatura | | K
p | tlak plina | | Pa
V | prostornina plina | V = \frac{nRT}{p} | m^3
k | razmerje molekulske in empirične formule | k = M(\text{spojine})/M(\text{empirične formule}) | – | celo število
:::
