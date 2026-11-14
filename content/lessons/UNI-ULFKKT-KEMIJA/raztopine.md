---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Maja teče na smučeh in si pred tekmo meša napitek. Na vrečki piše, naj prašek raztopi v vodi do $500\,\mathrm{mL}$ pijače, ona pa ga strese v poln $500\,\mathrm{mL}$ bidon vode, zato je pijača redkejša, kot bi morala biti. Naslednjič po nasvetu sotekmovalca strese v bidon dve vrečki »za več energije« in sredi proge jo zvijejo krči v trebuhu. Prekoncentrirana pijača namreč z osmozo vleče vodo iz telesa v črevo, namesto da bi jo telo dobilo. Obe napaki izvirata iz vsebine te lekcije: koliko topljenca je v koliko **raztopine** in kako število raztopljenih delcev premika vodo. V laboratoriju in lekarni je napaka za faktor deset lahko usodna.

Raztopine imajo tudi lastnosti, ki jih čisto topilo nima: zmrzujejo pri nižji temperaturi, vrejo pri višji, imajo nižji parni tlak in povzročajo osmozo. Te **koligativne lastnosti** so odvisne le od števila raztopljenih delcev, ne od njihove vrste. Zato posipamo ceste s soljo, zato morajo biti infuzijske raztopine izotonične s krvjo in zato lahko iz znižanja tališča določimo molsko maso neznane snovi.

Znal boš:

- izražati sestavo raztopine z različnimi koncentracijami in jih pretvarjati,
- pripraviti raztopino iz trdne snovi in z redčenjem,
- računati znižanje tališča, zvišanje vrelišča in osmozni tlak.

## Razlaga

**1. Osnovni pojmi.** **Raztopina** je homogena zmes; snov, ki je je več (običajno voda), je **topilo**, raztopljena snov je **topljenec**. **Nasičena** raztopina vsebuje največjo množino topljenca, ki se pri dani temperaturi še raztopi; sestavo nasičene raztopine imenujemo **topnost**.

**2. Načini izražanja sestave.**

Vsaka koncentracija je ulomek »koliko topljenca / na koliko česa«. Razlikujejo se v imenovalcu, zato ga v preglednici beri najprej:

| Količina | Formula | Imenovalec | Enota |
|---|---|---|---|
| **množinska koncentracija** (molarnost) | $c = n(\text{topljenca})/V$ | prostornina **raztopine** | $\mathrm{mol/L}$ (oznaka $\mathrm{M}$) |
| **masna koncentracija** | $\gamma = m(\text{topljenca})/V$ | prostornina **raztopine** | $\mathrm{g/L}$ |
| **masni delež** | $w = m(\text{topljenca})/m$ | masa **raztopine** | brez, pogosto v $\%$ |
| **molalnost** | $b = n(\text{topljenca})/m(\text{topila})$ | masa **topila** | $\mathrm{mol/kg}$ |
| **množinski delež** | $x_i = n_i/n_{\text{skupna}}$ | skupna množina | brez; vsota vseh deležev je $1$ |

Količini s prostornino v imenovalcu ($c$, $\gamma$) sta odvisni od temperature, ker se prostornina s temperaturo spreminja. Molalnost ni, zato jo uporabljamo pri koligativnih lastnostih.

**3. Pretvarjanje.** Most med maso in prostornino raztopine je **gostota** $\rho = m(\text{raztopine})/V(\text{raztopine})$. Iz masnega deleža izračunamo množinsko koncentracijo z

$$c = \frac{w\,\rho}{M}.$$

*Izpeljava:* vzemimo prostornino $V$ raztopine. Njena masa je $\rho V$, masa topljenca $w\rho V$, množina topljenca $w\rho V/M$; deljeno z $V$ da $c = w\rho/M$. Rezultat ni odvisen od izbrane $V$, ker sta $c$ in $w$ intenzivni količini. (Pri $\rho$ v $\mathrm{g/L}$ in $M$ v $\mathrm{g/mol}$ dobimo $c$ v $\mathrm{mol/L}$; gostota $1{,}18\,\mathrm{g/mL}$ je $1180\,\mathrm{g/L}$.)

Varna pot pri vsaki pretvorbi: izberi preprosto osnovo (npr. $1\,\mathrm{L}$ ali $100\,\mathrm{g}$ raztopine), izračunaj maso, množino in prostornino vsake komponente, nato sestavi želeno koncentracijo.

**4. Priprava raztopine iz trdne snovi.** Za prostornino $V$ s koncentracijo $c$ potrebujemo $n = cV$ in $m = cVM$. Snov natehtamo, raztopimo v manj topila, prenesemo v **merilno bučko** in dopolnimo do oznake. (Ne dodajamo $V$ topila, ker se prostornina pri raztapljanju spremeni.)

**5. Redčenje.** Pri redčenju dodamo topilo, množina topljenca pa ostane enaka:

$$c_1 V_1 = c_2 V_2.$$

Tu je $c_1$ koncentracija založne raztopine, $V_1$ prostornina, ki jo odpipetiramo, $c_2$ in $V_2$ pa koncentracija in **končna** prostornina razredčene raztopine. Pri mešanju dveh raztopin istega topljenca velja $c_1V_1 + c_2V_2 = c\,(V_1 + V_2)$, če so prostornine aditivne (približno pri razredčenih vodnih raztopinah). Pri redčenju koncentriranih kislin vedno **kislino vlivamo v vodo**, ne obratno, ker se sprošča veliko toplote.

:::premisli
Koncentrat športnega napitka razredčiš na dva načina: (a) $50\,\mathrm{mL}$ koncentrata dopolniš z vodo do $500\,\mathrm{mL}$, (b) $50\,\mathrm{mL}$ koncentrata dodaš $500\,\mathrm{mL}$ vode. Kolikokrat se koncentracija zmanjša v vsakem primeru?
---
(a) Desetkrat, ker je končna prostornina $500\,\mathrm{mL}$, desetkrat več od $50\,\mathrm{mL}$. (b) Približno enajstkrat, ker je končna prostornina okoli $550\,\mathrm{mL}$ (če sta prostornini aditivni). V $c_1V_1 = c_2V_2$ je $V_2$ vedno končna prostornina.
:::

**6. Koligativne lastnosti.** Najprej pogled na termometer. Raztopine z enako molalnostjo $b = 0{,}500\,\mathrm{mol/kg}$ zmrznejo pri različnih temperaturah, odvisno od tega, na koliko delcev razpade topljenec:

| Raztopina | Delci na formulsko enoto | Zmrzne pri |
|---|---|---|
| čista voda | – | $0{,}00\,^\circ\mathrm{C}$ |
| glukoza | $1$ | $-0{,}93\,^\circ\mathrm{C}$ |
| $\mathrm{NaCl}$ | $2$ (idealno) | okoli $-1{,}86\,^\circ\mathrm{C}$ |
| $\mathrm{CaCl_2}$ | $3$ (idealno) | okoli $-2{,}79\,^\circ\mathrm{C}$ |

Dvakrat več delcev, dvakrat večje znižanje. Vrsta delcev ni pomembna, šteje le njihovo število: raztopljeni delci (molekule ali ioni) zmanjšajo »delež« topila v raztopini. **Koligativne lastnosti** so lastnosti razredčene raztopine, ki so odvisne le od števila raztopljenih delcev na količino topila, ne od njihove vrste. Veljajo ob teh pogojih: raztopina je razredčena (idealna), topljenec je **nehlapen**, pri zmrzovanju pa iz raztopine izkristalizira **čisto topilo**.

- **Raoultov zakon.** Naj bo raztopina idealna in topljenec nehlapen. Potem je parni tlak nad raztopino $p = x_1\,p^*$, kjer je $x_1$ množinski delež topila in $p^*$ parni tlak čistega topila. Ker je $x_1 = 1 - x_2$, je znižanje parnega tlaka $\Delta p = p^* - p = x_2\,p^*$: relativno znižanje $\Delta p/p^*$ je enako množinskemu deležu topljenca.
- **Zvišanje vrelišča:** $\Delta T_v = i\,K_e\,b$, za vodo je ebulioskopska konstanta $K_e = 0{,}512\,\mathrm{K\,kg/mol}$.
- **Znižanje tališča (zmrzišča):** $\Delta T_t = i\,K_k\,b$, za vodo je krioskopska konstanta $K_k = 1{,}86\,\mathrm{K\,kg/mol}$.
- **Osmozni tlak:** $\Pi = i\,c\,RT$ (van 't Hoffova enačba).

**Zakaj nastopa molalnost.** Termodinamika da $\Delta T$ sorazmerno z $x_2$ (glej Bolj natančno). Če je $n_2 \ll n_1$, je $x_2 = \dfrac{n_2}{n_1 + n_2} \approx \dfrac{n_2}{n_1} = \dfrac{n_2 M_1}{m_1} = M_1\,b$, kjer sta $M_1$ in $m_1$ molska masa in masa topila. Zato je $\Delta T$ sorazmeren z $b$, konstanta $K_k = RT_t^{*2}M_1/\Delta_{\mathrm{tal}}H$ pa je lastnost **topila** ($T_t^*$ je tališče čistega topila, $\Delta_{\mathrm{tal}}H$ njegova talilna entalpija).

**Molska masa iz krioskopije.** Iz $\Delta T_t = K_k b$ in $b = m_2/(M\,m_1)$ sledi $M = \dfrac{K_k\,m_2}{\Delta T_t\,m_1}$, kjer je $m_2$ masa topljenca (za neelektrolit, $i = 1$).

**Van 't Hoffov faktor** $i$ je razmerje med številom delcev v raztopini in številom raztopljenih formulskih enot: za neelektrolite (glukoza, saharoza, sečnina) je $i = 1$, za $\mathrm{NaCl}$ idealno $2$, za $\mathrm{CaCl_2}$ idealno $3$. Naj formulska enota razpade na $\nu$ ionov in naj bo $\alpha$ stopnja disociacije. Od vsake enote ostane nerazpadlih $1 - \alpha$ delcev, nastane pa $\nu\alpha$ ionov, zato je

$$i = 1 + \alpha(\nu - 1).$$

Pri močnih elektrolitih je zaradi privlaka med ioni izmerjeni $i$ nekoliko manjši od $\nu$; iz njega izračunani $\alpha$ je **navidezna** stopnja disociacije.

:::premisli
Katera raztopina ima nižje tališče: sečnina ($M = 60\,\mathrm{g/mol}$) ali saharoza ($M = 342\,\mathrm{g/mol}$), obe z molalnostjo $0{,}10\,\mathrm{mol/kg}$?
---
Tališči sta enaki. Obe snovi sta neelektrolita ($i = 1$), zato je v kilogramu vode pri obeh enako število delcev. Velikost in masa molekule pri koligativnih lastnostih nista pomembni; saharoze je sicer po masi več kot petkrat več.
:::

**Osmoza** je prehajanje topila skozi polprepustno membrano iz razredčene v koncentriranejšo raztopino. Osmozni tlak je tlak, ki ga moramo pritisniti na raztopino, da osmozo ustavimo. Raztopini z enakim osmoznim tlakom sta **izotonični**. Van 't Hoffova enačba velja za razredčeno raztopino in membrano, ki prepušča le topilo. *Izpeljava v treh vrsticah:* v ravnovesju ima topilo na obeh straneh enak kemijski potencial (molsko Gibbsovo energijo topila, glej Bolj natančno), zato dodatni tlak $\Pi$ ravno nadomesti znižanje zaradi topljenca: $\Pi V_{\mathrm{m},1} = -RT\ln x_1 \approx RT\,x_2$, kjer je $V_{\mathrm{m},1}$ molska prostornina topila. Z $x_2 \approx n_2/n_1$ in $n_1V_{\mathrm{m},1} \approx V$ (prostornina razredčene raztopine) dobimo $\Pi V = n_2RT$, torej $\Pi = cRT$, pri elektrolitih pa $icRT$.

## Rešeni primeri

### Primer 1 (lažji)

Pripraviti moramo $250\,\mathrm{mL}$ raztopine $\mathrm{NaCl}$ s koncentracijo $0{,}200\,\mathrm{mol/L}$. Koliko soli natehtamo? Molska masa $\mathrm{NaCl}$ je $58{,}44\,\mathrm{g/mol}$.

**Podatki:** $V = 250\,\mathrm{mL}$, $c = 0{,}200\,\mathrm{mol/L}$, $M(\mathrm{NaCl}) = 58{,}44\,\mathrm{g/mol}$
**Iščemo:** maso $m(\mathrm{NaCl})$

:::formula
$n = c\,V$, $m = n\,M$
:::

**Rešitev:**

1. Prostornino pretvorimo v litre, ker je $c$ podana v $\mathrm{mol/L}$: $V = 250\,\mathrm{mL} = 0{,}250\,\mathrm{L}$.
2. $n = 0{,}200\,\mathrm{mol/L} \cdot 0{,}250\,\mathrm{L} = 0{,}0500\,\mathrm{mol}$.
3. $m = 0{,}0500\,\mathrm{mol} \cdot 58{,}44\,\mathrm{g/mol} \approx 2{,}92\,\mathrm{g}$.
4. Postopek: natehtamo $2{,}92\,\mathrm{g}$ $\mathrm{NaCl}$, raztopimo v okoli $150\,\mathrm{mL}$ vode, prenesemo v merilno bučko za $250\,\mathrm{mL}$ in dopolnimo do oznake.
5. Odgovor: natehtati moramo približno $2{,}92\,\mathrm{g}$ natrijevega klorida.

### Primer 2

Koncentrirana klorovodikova kislina ima masni delež $\mathrm{HCl}$ $37\,\%$ in gostoto $1{,}18\,\mathrm{g/mL}$. Izračunaj njeno množinsko koncentracijo in prostornino, ki jo potrebujemo za $500\,\mathrm{mL}$ raztopine s koncentracijo $0{,}100\,\mathrm{mol/L}$. $M(\mathrm{HCl}) = 36{,}46\,\mathrm{g/mol}$.

**Podatki:** $w(\mathrm{HCl}) = 0{,}37$, $\rho = 1{,}18\,\mathrm{g/mL}$, $M(\mathrm{HCl}) = 36{,}46\,\mathrm{g/mol}$, $V_2 = 500\,\mathrm{mL}$, $c_2 = 0{,}100\,\mathrm{mol/L}$
**Iščemo:** koncentracijo $c_1$ koncentrirane kisline in prostornino $V_1$

:::formula
$c = \dfrac{w\,\rho}{M}$, $c_1V_1 = c_2V_2$
:::

**Rešitev:**

1. Za osnovo vzamemo $1\,\mathrm{L}$ koncentrirane kisline, ker iščemo množino na liter: masa $1000\,\mathrm{mL} \cdot 1{,}18\,\mathrm{g/mL} = 1180\,\mathrm{g}$.
2. Masa $\mathrm{HCl}$: $0{,}37 \cdot 1180\,\mathrm{g} \approx 437\,\mathrm{g}$; množina $437 / 36{,}46\,\mathrm{mol} \approx 11{,}97\,\mathrm{mol}$.
3. Torej $c_1 \approx 12{,}0\,\mathrm{mol/L}$.
4. Redčenje (množina $\mathrm{HCl}$ se ohrani, dodamo le vodo): $V_1 = \dfrac{c_2V_2}{c_1} = \dfrac{0{,}100\,\mathrm{mol/L} \cdot 500\,\mathrm{mL}}{11{,}97\,\mathrm{mol/L}} \approx 4{,}18\,\mathrm{mL}$.
5. Postopek: v merilno bučko za $500\,\mathrm{mL}$ nalijemo nekaj vode, dodamo $4{,}18\,\mathrm{mL}$ koncentrirane kisline in dopolnimo z vodo do oznake.
6. Odgovor: koncentrirana kislina ima koncentracijo približno $12{,}0\,\mathrm{mol/L}$; za pripravo potrebujemo približno $4{,}18\,\mathrm{mL}$ te kisline.

### Primer 3 (težji)

Vodna raztopina neznanega neelektrolita ima masni delež topljenca $4{,}76\,\%$ in gostoto $1{,}016\,\mathrm{g/mL}$. Zmrzne pri $-0{,}930\,^\circ\mathrm{C}$. Izračunaj molsko maso snovi, vrelišče raztopine pri normalnem tlaku in njen osmozni tlak pri $25\,^\circ\mathrm{C}$. Za vodo je $K_k = 1{,}86\,\mathrm{K\,kg/mol}$, $K_e = 0{,}512\,\mathrm{K\,kg/mol}$, tališče $0{,}00\,^\circ\mathrm{C}$ in vrelišče $100{,}00\,^\circ\mathrm{C}$; $R = 8{,}314\,\mathrm{J/(mol\,K)}$.

**Podatki:** $w = 0{,}0476$, $\rho = 1{,}016\,\mathrm{g/mL}$, $t_t = -0{,}930\,^\circ\mathrm{C}$, $i = 1$, $K_k = 1{,}86\,\mathrm{K\,kg/mol}$, $K_e = 0{,}512\,\mathrm{K\,kg/mol}$, tališče vode $0{,}00\,^\circ\mathrm{C}$, vrelišče vode $100{,}00\,^\circ\mathrm{C}$, $T = 298{,}15\,\mathrm{K}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** molsko maso $M$, vrelišče raztopine $t_v$ in osmozni tlak $\Pi$

:::formula
$\Delta T_t = K_k\,b$, $b = \dfrac{n}{m(\text{topila})}$, $M = \dfrac{m}{n}$, $\Delta T_v = K_e\,b$, $V = \dfrac{m}{\rho}$, $\Pi = cRT$
:::

**Rešitev:**

1. Osnova: $100{,}0\,\mathrm{g}$ raztopine, ker je podan masni delež. V njej je $4{,}76\,\mathrm{g}$ topljenca in $95{,}24\,\mathrm{g}$ vode.
2. Znižanje tališča: $\Delta T_t = 0{,}00 - (-0{,}930) = 0{,}930\,\mathrm{K}$.
3. Molalnost (za neelektrolit je $i = 1$): $b = \dfrac{0{,}930\,\mathrm{K}}{1{,}86\,\mathrm{K\,kg/mol}} = 0{,}500\,\mathrm{mol/kg}$.
4. Množina topljenca v osnovi: $n = 0{,}500\,\mathrm{mol/kg} \cdot 0{,}09524\,\mathrm{kg} = 0{,}04762\,\mathrm{mol}$.
5. Molska masa: $M = \dfrac{4{,}76\,\mathrm{g}}{0{,}04762\,\mathrm{mol}} \approx 100\,\mathrm{g/mol}$.
6. Zvišanje vrelišča (ista molalnost): $\Delta T_v = 0{,}512 \cdot 0{,}500\,\mathrm{K} = 0{,}256\,\mathrm{K}$, torej $t_v \approx 100{,}26\,^\circ\mathrm{C}$.
7. Za osmozni tlak potrebujemo $c$, ne $b$. Prostornina osnove: $V = 100{,}0\,\mathrm{g} / 1{,}016\,\mathrm{g/mL} = 98{,}43\,\mathrm{mL}$, zato $c = 0{,}04762\,\mathrm{mol} / 0{,}09843\,\mathrm{L} = 0{,}4838\,\mathrm{mol/L} = 483{,}8\,\mathrm{mol/m^3}$.
8. $\Pi = 483{,}8\,\mathrm{mol/m^3} \cdot 8{,}314\,\mathrm{J/(mol\,K)} \cdot 298{,}15\,\mathrm{K} \approx 1{,}20 \cdot 10^6\,\mathrm{Pa}$.
9. Odgovor: molska masa snovi je $100\,\mathrm{g/mol}$, raztopina vre pri približno $100{,}26\,^\circ\mathrm{C}$, njen osmozni tlak pri $25\,^\circ\mathrm{C}$ je okoli $1{,}20\,\mathrm{MPa}$. Znižanje tališča je več kot trikrat večje od zvišanja vrelišča, zato je krioskopija natančnejša metoda; $c$ in $b$ se tu razlikujeta že za okoli $3\,\%$.

### Primer 4 – zdaj ti

Maja si za tekmo pripravlja napitek samo iz glukoze in vode. Koliko glukoze naj raztopi v vodi do $1{,}00\,\mathrm{L}$ napitka, da bo njegov osmozni tlak pri telesni temperaturi ($310\,\mathrm{K}$) enak kot v krvni plazmi, okoli $7{,}9 \cdot 10^5\,\mathrm{Pa}$? $M(\text{glukoze}) = 180{,}16\,\mathrm{g/mol}$.

**Podatki:** $V = 1{,}00\,\mathrm{L}$, $\Pi = 7{,}9 \cdot 10^5\,\mathrm{Pa}$, $T = 310\,\mathrm{K}$, $M = 180{,}16\,\mathrm{g/mol}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$, glukoza je neelektrolit
**Iščemo:** maso glukoze $m$

:::formula
$\Pi = i\,c\,RT \Rightarrow c = \dfrac{\Pi}{iRT}$, $m = c\,V\,M$
:::

**Rešitev:**

1. Glukoza v vodi ne razpade na ione, zato je $i = 1$.
2. $c = \dfrac{7{,}9 \cdot 10^5\,\mathrm{Pa}}{1 \cdot 8{,}314\,\mathrm{J/(mol\,K)} \cdot 310\,\mathrm{K}} \approx 307\,\mathrm{mol/m^3}$; enota je $\mathrm{mol/m^3}$, ker smo vstavili paskale.
3. Pretvori koncentracijo v $\mathrm{mol/L}$ in izračunaj maso glukoze sam.

:::premisli
Koliko glukoze potrebuje Maja za $1{,}00\,\mathrm{L}$ napitka?
---
$307\,\mathrm{mol/m^3} = 0{,}307\,\mathrm{mol/L}$, ker je v kubičnem metru $1000\,\mathrm{L}$. Za $1{,}00\,\mathrm{L}$ je $n = 0{,}307\,\mathrm{mol}$ in $m = 0{,}307\,\mathrm{mol} \cdot 180{,}16\,\mathrm{g/mol} \approx 55{,}3\,\mathrm{g}$ glukoze. Pravi izotonični napitki vsebujejo tudi soli, zato imajo glukoze manj.
:::

## Pogoste napake

- **Prostornina topila namesto raztopine.** Pri $c$ delimo s prostornino **raztopine**. Če $2{,}92\,\mathrm{g}$ soli stresemo v $250\,\mathrm{mL}$ vode, raztopina nima natanko $250\,\mathrm{mL}$.
- **Molarnost in molalnost.** $c$ (na liter raztopine) in $b$ (na kilogram topila) sta pri razredčenih vodnih raztopinah številsko blizu, pri koncentriranih pa ne. V formulah za $\Delta T$ nastopa $b$.
- **Pozabljen van 't Hoffov faktor.** $0{,}1\,\mathrm{mol/kg}$ $\mathrm{NaCl}$ da približno dvakrat večje znižanje tališča kot $0{,}1\,\mathrm{mol/kg}$ glukoze.
- **$V_2$ pri redčenju kot dodana prostornina.** V $c_1V_1 = c_2V_2$ je $V_2$ **končna** prostornina, ne prostornina dodane vode.
- **Masni delež v odstotkih v formuli.** Vstavi $w = 0{,}37$, ne $37$.
- **Enote gostote.** $\mathrm{g/mL}$ pomnoži s $1000$, da dobiš $\mathrm{g/L}$, sicer je $c$ tisočkrat premajhna.
- **Temperatura pri osmoznem tlaku.** V $\Pi = icRT$ je $T$ v kelvinih, $c$ pa v $\mathrm{mol/m^3}$, če hočeš $\Pi$ v paskalih.

## Povzetek

- $c = n/V_{\text{raztopine}}$, $\gamma = m/V_{\text{raztopine}}$, $w = m/m_{\text{raztopine}}$, $b = n/m_{\text{topila}}$, $x_i = n_i/n$.
- Pretvorba: $c = w\rho/M$; pri vsaki pretvorbi izberi osnovo ($1\,\mathrm{L}$ ali $100\,\mathrm{g}$).
- Priprava: $m = cVM$ v merilni bučki; redčenje: $c_1V_1 = c_2V_2$ ($V_2$ je končna prostornina).
- Koligativne lastnosti so odvisne od števila delcev: $p = x_{\text{topila}}p^*$, $\Delta T_v = iK_eb$, $\Delta T_t = iK_kb$, $\Pi = icRT$.
- Za vodo: $K_k = 1{,}86\,\mathrm{K\,kg/mol}$, $K_e = 0{,}512\,\mathrm{K\,kg/mol}$.
- Iz znižanja tališča ali osmoznega tlaka določimo molsko maso topljenca.

## Za izpit

Znati moraš povedati:

- natančne definicije $c$, $\gamma$, $w$, $b$ in $x_i$, katere so odvisne od temperature in zakaj, ter izpeljavo $c = w\rho/M$;
- Raoultov zakon s pogoji (idealna raztopina, nehlapen topljenec) in izpeljavo $\Delta p/p^* = x_2$;
- definicijo koligativnih lastnosti, formule $\Delta T = iKb$ s pogoji in izpeljavo $x_2 \approx M_1 b$ (zakaj nastopa molalnost in zakaj je $K$ lastnost topila);
- definicijo osmoze, osmoznega tlaka in izotoničnosti ter van 't Hoffovo enačbo s pogoji;
- definicijo van 't Hoffovega faktorja in izpeljavo $i = 1 + \alpha(\nu - 1)$.

### Naloga 1

V $100{,}0\,\mathrm{g}$ vode raztopimo $2{,}41\,\mathrm{g}$ magnezijevega sulfata ($M = 120{,}37\,\mathrm{g/mol}$). Raztopina zmrzne pri $-0{,}484\,^\circ\mathrm{C}$. a) Izračunaj van 't Hoffov faktor in navidezno stopnjo disociacije. b) Koliko glukoze ($M = 180{,}16\,\mathrm{g/mol}$) moramo raztopiti v $100{,}0\,\mathrm{g}$ vode, da raztopina zmrzne pri isti temperaturi? c) Oceni osmozni tlak raztopine $\mathrm{MgSO_4}$ pri $25\,^\circ\mathrm{C}$, če je raztopina tako razredčena, da velja $c \approx b \cdot 1{,}00\,\mathrm{kg/L}$. $K_k = 1{,}86\,\mathrm{K\,kg/mol}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$.

**Rešitev:**

1. Množina in molalnost: $n = 2{,}41/120{,}37\,\mathrm{mol} = 0{,}02002\,\mathrm{mol}$, $b = 0{,}02002\,\mathrm{mol}/0{,}1000\,\mathrm{kg} = 0{,}2002\,\mathrm{mol/kg}$.
2. Van 't Hoffov faktor: $i = \dfrac{\Delta T_t}{K_k b} = \dfrac{0{,}484}{1{,}86 \cdot 0{,}2002} \approx 1{,}30$.
3. $\mathrm{MgSO_4}$ razpade na $\nu = 2$ iona, zato iz $i = 1 + \alpha(\nu - 1)$ sledi $\alpha = i - 1 \approx 0{,}30$. Dvakrat nabita iona tvorita veliko ionskih parov $\mathrm{Mg^{2+}SO_4^{2-}}$, zato je $i$ daleč od $2$.
4. b) Za glukozo je $i = 1$: $b = 0{,}484/1{,}86\,\mathrm{mol/kg} = 0{,}2602\,\mathrm{mol/kg}$, $n = 0{,}02602\,\mathrm{mol}$, $m = 0{,}02602 \cdot 180{,}16\,\mathrm{g} \approx 4{,}69\,\mathrm{g}$.
5. c) $c \approx 0{,}2002\,\mathrm{mol/L} = 200{,}2\,\mathrm{mol/m^3}$; $\Pi = i\,cRT = 1{,}30 \cdot 200{,}2 \cdot 8{,}314 \cdot 298{,}15\,\mathrm{Pa} \approx 6{,}45 \cdot 10^5\,\mathrm{Pa}$.
6. Odgovor: $i \approx 1{,}30$, navidezna stopnja disociacije je okoli $0{,}30$; potrebujemo okoli $4{,}69\,\mathrm{g}$ glukoze; osmozni tlak je okoli $0{,}65\,\mathrm{MPa}$.

### Naloga 2

Izpelji, da je za razredčeno raztopino nehlapnega topljenca relativno znižanje parnega tlaka sorazmerno z molalnostjo, in iz $\Delta T_t = K_k b$ izpelji izraz za molsko maso topljenca. Nato utemelji, ali je krioskopija primerna za določanje molske mase beljakovine z $M \approx 50\,000\,\mathrm{g/mol}$, če raztopimo $1{,}00\,\mathrm{g}$ beljakovine v $100\,\mathrm{g}$ vode; primerjaj z osmometrijo pri $25\,^\circ\mathrm{C}$ (vzemi $c \approx b \cdot 1{,}00\,\mathrm{kg/L}$, $g = 9{,}81\,\mathrm{m/s^2}$, gostota vode $1000\,\mathrm{kg/m^3}$).

**Rešitev:**

1. Raoultov zakon (idealna raztopina, nehlapen topljenec): $p = x_1 p^* = (1 - x_2)p^*$, zato $\Delta p/p^* = x_2$.
2. Za razredčeno raztopino je $n_2 \ll n_1$: $x_2 \approx n_2/n_1 = n_2 M_1/m_1 = M_1 b$. Torej $\Delta p/p^* \approx M_1 b$, sorazmerno z molalnostjo.
3. Iz $\Delta T_t = K_k b$ in $b = m_2/(M\,m_1)$: $M = \dfrac{K_k\,m_2}{\Delta T_t\,m_1}$.
4. Beljakovina: $n = 1{,}00/50\,000\,\mathrm{mol} = 2{,}0 \cdot 10^{-5}\,\mathrm{mol}$, $b = 2{,}0 \cdot 10^{-4}\,\mathrm{mol/kg}$, $\Delta T_t = 1{,}86 \cdot 2{,}0 \cdot 10^{-4}\,\mathrm{K} \approx 3{,}7 \cdot 10^{-4}\,\mathrm{K}$. To je pod natančnostjo običajnega krioskopa (okoli $10^{-3}\,\mathrm{K}$), poleg tega bi majhna nečistoča z majhno molsko maso povsem pokvarila rezultat.
5. Osmometrija: $c \approx 0{,}20\,\mathrm{mol/m^3}$, $\Pi = 0{,}20 \cdot 8{,}314 \cdot 298{,}15\,\mathrm{Pa} \approx 496\,\mathrm{Pa}$, kar ustreza vodnemu stolpcu $h = \Pi/(\rho g) \approx 5{,}1\,\mathrm{cm}$, ki ga zlahka izmerimo. Membrana, ki ne prepušča beljakovine, majhne nečistoče pa prepušča, je zanje »slepa«.
6. Odgovor: krioskopija za beljakovino ni primerna, ker je $\Delta T_t$ premajhen; osmometrija da merljiv tlak okoli $0{,}5\,\mathrm{kPa}$, zato molske mase makromolekul določamo z osmoznim tlakom.

## Drugače: Na sliki

Redčenje si predstavljaj kot isto število »kroglic« topljenca v večji posodi:

```
   pred redčenjem          po redčenju
   +--------+              +-------------------------+
   | ****** |  + voda  ->  |  *    *     *    *   *  |
   | ****** |              |    *    *     *     *   |
   +--------+              |  *    *    *    *    *  |
   V1 = 10 mL              +-------------------------+
   c1 = 1,0 mol/L          V2 = 100 mL,  c2 = 0,10 mol/L
```

Kroglic je enako ($n = c_1V_1 = c_2V_2$), prostornina je desetkrat večja, zato je koncentracija desetkrat manjša.

Osmozo si predstavljaj kot U-cev s polprepustno membrano na dnu. Na levi je čista voda, na desni raztopina sladkorja. Molekule vode prehajajo v obe smeri, a v desno pogosteje, zato gladina na desni naraste. Višinska razlika ustvari hidrostatski tlak, ki je v ravnovesju enak osmoznemu tlaku.

## Drugače: Uporaba v stroki

**Farmacija: izotonične raztopine.** Infuzijska raztopina $\mathrm{NaCl}$ z masno koncentracijo $9\,\mathrm{g/L}$ ima $c = 9/58{,}44\,\mathrm{mol/L} \approx 0{,}154\,\mathrm{mol/L}$. Z $i \approx 2$ je pri telesni temperaturi ($310\,\mathrm{K}$) osmozni tlak $\Pi \approx 2 \cdot 154\,\mathrm{mol/m^3} \cdot 8{,}314 \cdot 310\,\mathrm{Pa} \approx 7{,}9 \cdot 10^5\,\mathrm{Pa}$, približno enako kot v krvni plazmi, zato eritrociti v njej ne nabreknejo in se ne skrčijo; v hipotonični raztopini (čista voda) bi nabrekli in popokali, v hipertonični bi se nagubali. Farmacevt kapljice za oči in injekcije z dodatkom $\mathrm{NaCl}$ ali glukoze uravna na isto vrednost.

**Klinični laboratorij: osmometer.** Osmolalnost plazme (okoli $0{,}290\,\mathrm{mol}$ delcev na kilogram vode) merijo s krioskopskim osmometrom: vzorec zmrzne pri okoli $-1{,}86 \cdot 0{,}290\,^\circ\mathrm{C} \approx -0{,}54\,^\circ\mathrm{C}$. Razlika med izmerjeno osmolalnostjo in osmolalnostjo, izračunano iz koncentracij natrija, glukoze in sečnine (osmolalna vrzel), razkrije npr. zastrupitev z etanolom ali metanolom.

**Industrija: obratna osmoza in hladilne tekočine.** Pri razsoljevanju na morsko vodo pritisnemo z večjim tlakom od osmoznega (za morsko vodo okoli $2{,}5$ do $3\,\mathrm{MPa}$), da voda teče skozi membrano iz slane v sladko stran; tako pripravljajo tudi ultračisto vodo za farmacijo in elektroniko. Hladilne tekočine z etilenglikolom zmrzujejo globoko pod $0\,^\circ\mathrm{C}$; pri teh koncentracijah enačba $\Delta T_t = K_kb$ da le oceno.

**Raziskave: molske mase polimerov.** Z membransko osmometrijo določajo številsko povprečno molsko maso polimerov in beljakovin (Naloga 2).

## Drugače: Korak za korakom s številkami

V $180{,}0\,\mathrm{g}$ vode raztopimo $20{,}0\,\mathrm{g}$ $\mathrm{NaOH}$ ($M = 40{,}00\,\mathrm{g/mol}$). Gostota raztopine je $1{,}109\,\mathrm{g/mL}$. Izrazi sestavo na vse načine. $M(\mathrm{H_2O}) = 18{,}02\,\mathrm{g/mol}$.

1. **Masa raztopine:** $20{,}0 + 180{,}0 = 200{,}0\,\mathrm{g}$.
2. **Masni delež:** $w = 20{,}0 / 200{,}0 = 0{,}100 = 10{,}0\,\%$.
3. **Množina $\mathrm{NaOH}$:** $n = 20{,}0 / 40{,}00 = 0{,}500\,\mathrm{mol}$.
4. **Prostornina raztopine:** $V = 200{,}0\,\mathrm{g} / 1{,}109\,\mathrm{g/mL} \approx 180{,}3\,\mathrm{mL}$. (Opazi: skoraj enaka prostornini same vode.)
5. **Množinska koncentracija:** $c = 0{,}500\,\mathrm{mol} / 0{,}1803\,\mathrm{L} \approx 2{,}77\,\mathrm{mol/L}$. Preizkus s $c = w\rho/M = 0{,}100 \cdot 1109 / 40{,}00 \approx 2{,}77\,\mathrm{mol/L}$.
6. **Masna koncentracija:** $\gamma = 20{,}0\,\mathrm{g} / 0{,}1803\,\mathrm{L} \approx 111\,\mathrm{g/L}$.
7. **Molalnost:** $b = 0{,}500\,\mathrm{mol} / 0{,}1800\,\mathrm{kg} \approx 2{,}78\,\mathrm{mol/kg}$.
8. **Množinski delež:** $n(\mathrm{H_2O}) = 180{,}0 / 18{,}02 \approx 9{,}99\,\mathrm{mol}$, $x(\mathrm{NaOH}) = 0{,}500 / (0{,}500 + 9{,}99) \approx 0{,}0477$.

## Drugače: Bolj natančno

**Izvor koligativnih lastnosti.** V idealni raztopini je kemijski potencial topila $\mu_1 = \mu_1^* + RT\ln x_1$. Ker je $x_1 < 1$, je $\ln x_1 < 0$ in topilo v raztopini ima nižji kemijski potencial kot čisto topilo. Zato ima nižji parni tlak (Raoult), ravnotežje s trdnim topilom se premakne k nižji temperaturi (znižanje tališča), ravnotežje s paro k višji (zvišanje vrelišča), čisto topilo pa spontano prehaja v raztopino (osmoza).

**Izpeljava $\Delta T_t = K_kb$.** Za razredčeno raztopino je $\ln x_1 = \ln(1 - x_2) \approx -x_2$. Iz pogoja ravnotežja med trdnim topilom in raztopino ter Gibbs-Helmholtzove enačbe dobimo

$$\Delta T_t \approx \frac{RT_t^{*2}}{\Delta_{\mathrm{tal}}H}\,x_2 \approx \frac{RT_t^{*2}M_1}{\Delta_{\mathrm{tal}}H}\,b, \qquad K_k = \frac{RT_t^{*2}M_1}{\Delta_{\mathrm{tal}}H}.$$

Za vodo ($T_t^* = 273{,}15\,\mathrm{K}$, $M_1 = 0{,}018\,02\,\mathrm{kg/mol}$, $\Delta_{\mathrm{tal}}H = 6{,}01\,\mathrm{kJ/mol}$) to da $K_k \approx 1{,}86\,\mathrm{K\,kg/mol}$. Konstanta je torej lastnost **topila**, ne topljenca.

**Raoultov zakon s številkami.** Za raztopino $1{,}00\,\mathrm{mol}$ saharoze v $1000\,\mathrm{g}$ vode je $n(\mathrm{H_2O}) \approx 55{,}5\,\mathrm{mol}$, $x_1 \approx 55{,}5/56{,}5 \approx 0{,}982$. Pri $25\,^\circ\mathrm{C}$ ($p^* = 3{,}17\,\mathrm{kPa}$) je parni tlak $p \approx 3{,}11\,\mathrm{kPa}$; znižanje je le okoli $0{,}06\,\mathrm{kPa}$, zato je merjenje parnega tlaka manj občutljivo kot krioskopija ali osmometrija.

**Realne raztopine elektrolitov.** Izmerjeni $i$ je manjši od idealnega, ker se ioni v raztopini delno združujejo v ionske pare in ker jih obdaja ionska atmosfera (Debye-Hücklova teorija). Za $0{,}1\,\mathrm{mol/kg}$ $\mathrm{NaCl}$ je $i \approx 1{,}9$. V natančnih računih nadomestimo koncentracijo z aktivnostjo, molalnost pa z **osmolalnostjo** (število mol delcev na kilogram topila), ki jo v medicinskih laboratorijih merijo neposredno.

**Osmometrija polimerov.** Ker je $\Pi$ že pri majhnih koncentracijah merljiv (milimol na liter da nekaj kilopaskalov), z osmoznim tlakom določamo molske mase beljakovin in polimerov, pri katerih bi bilo znižanje tališča premajhno za merjenje.

## Preveri se

? V $250\,\mathrm{mL}$ raztopine je raztopljenih $0{,}50\,\mathrm{mol}$ snovi. Kolikšna je množinska koncentracija?
- $0{,}125\,\mathrm{mol/L}$
~ Pomnožil si $0{,}50 \cdot 0{,}250$ namesto delil; koncentracija je množina na liter raztopine.
- $0{,}50\,\mathrm{mol/L}$
~ Pozabil si deliti s prostornino: $0{,}50\,\mathrm{mol}$ je le v četrt litra, zato jih je v litru štirikrat več.
+ $2{,}0\,\mathrm{mol/L}$
> $c = n/V = 0{,}50\,\mathrm{mol} / 0{,}250\,\mathrm{L} = 2{,}0\,\mathrm{mol/L}$. Odgovor $0{,}125$ dobiš, če množiš namesto deliš.

? $10\,\mathrm{mL}$ raztopine s koncentracijo $1{,}0\,\mathrm{mol/L}$ razredčimo z vodo na končno prostornino $100\,\mathrm{mL}$. Kolikšna je nova koncentracija?
+ $0{,}10\,\mathrm{mol/L}$
- $0{,}091\,\mathrm{mol/L}$
~ Tako računaš, če $100\,\mathrm{mL}$ vode dodaš; v nalogi je $100\,\mathrm{mL}$ že končna prostornina.
- $10\,\mathrm{mol/L}$
~ Pri redčenju koncentracija ne more narasti; zamenjal si $V_1$ in $V_2$.
> $c_2 = c_1V_1/V_2 = 1{,}0 \cdot 10 / 100\,\mathrm{mol/L} = 0{,}10\,\mathrm{mol/L}$. $0{,}091$ bi dobil, če bi dodal $100\,\mathrm{mL}$ vode (končna prostornina $110\,\mathrm{mL}$).

? Katera vodna raztopina z molalnostjo $0{,}10\,\mathrm{mol/kg}$ ima najnižje tališče?
- glukoza
~ Glukoza je neelektrolit ($i = 1$) in da najmanj delcev, zato tališče zniža najmanj.
- $\mathrm{NaCl}$
~ $\mathrm{NaCl}$ razpade na dva iona, $\mathrm{CaCl_2}$ pa na tri, zato ta tališče zniža še bolj.
+ $\mathrm{CaCl_2}$
> Znižanje tališča je sorazmerno z $i\,b$: glukoza $i = 1$, $\mathrm{NaCl}$ $i \approx 2$, $\mathrm{CaCl_2}$ $i \approx 3$. Največ delcev da $\mathrm{CaCl_2}$.

? Kaj je molalnost?
- množina topljenca na liter raztopine
~ To je množinska koncentracija (molarnost); molalnost se nanaša na maso topila, ne na prostornino raztopine.
+ množina topljenca na kilogram topila
- masa topljenca na kilogram raztopine
~ To je masni delež v $\mathrm{g/kg}$; molalnost šteje mole topljenca na kilogram topila.
> Molalnost je $b = n(\text{topljenca})/m(\text{topila})$ v $\mathrm{mol/kg}$; množina na liter raztopine je množinska koncentracija.

? Nik pripravlja $500\,\mathrm{mL}$ raztopine $\mathrm{NaCl}$ s koncentracijo $0{,}154\,\mathrm{mol/L}$ za izpiranje odrgnin po nogometni tekmi. Njegovi koraki: (1) $V = 0{,}500\,\mathrm{L}$; (2) $n = 0{,}154 \cdot 0{,}500\,\mathrm{mol} = 0{,}0770\,\mathrm{mol}$; (3) $m = 0{,}0770 \cdot 58{,}44\,\mathrm{g} \approx 4{,}50\,\mathrm{g}$; (4) $4{,}50\,\mathrm{g}$ soli raztopi v $500\,\mathrm{mL}$ vode. Kateri korak je napačen?
+ korak 4
- korak 2
~ Korak 2 je pravilen: množina je koncentracija krat prostornina raztopine, $0{,}154 \cdot 0{,}500 = 0{,}0770$.
- korak 3
~ Korak 3 je pravilen: masa je množina krat molska masa, $0{,}0770 \cdot 58{,}44 \approx 4{,}50$.
> Sol je treba raztopiti v manj vode in nato **dopolniti do** $500\,\mathrm{mL}$ v merilni bučki. Če jo stresemo v $500\,\mathrm{mL}$ vode, prostornina raztopine ni natanko $500\,\mathrm{mL}$ in koncentracija ni $0{,}154\,\mathrm{mol/L}$.

:::simboli
c | množinska koncentracija (molarnost) | c = \frac{n}{V} | mol/L | iz masnega deleža: c = wρ/M
w | masni delež topljenca | w = \frac{m(\text{topljenca})}{m(\text{raztopine})} | – | pogosto v %
\Pi | osmozni tlak | \Pi = i\,c\,RT | Pa | s Π v Pa dobimo c v mol/m³
\rho | gostota raztopine | | g/mL | v c = wρ/M vstavi g/L
M | molska masa topljenca | M = \frac{m}{n} | g/mol
c_1 | koncentracija založne raztopine | | mol/L
V_1 | prostornina odpipetirane založne raztopine | | L
c_2 | koncentracija razredčene raztopine | c_2 = \frac{c_1 V_1}{V_2} | mol/L
V_2 | končna prostornina razredčene raztopine | | L
n | množina topljenca | n = c\,V | mol
V | prostornina raztopine | | L
m | masa topljenca | m = n\,M | g | v izrazu za b: m(topila) v kg
b | molalnost | b = \frac{n}{m(\text{topila})} | mol/kg
\Delta T_t | znižanje tališča (zmrzišča) | \Delta T_t = K_k\,b | K | pri elektrolitih še faktor i
\Delta T_v | zvišanje vrelišča | \Delta T_v = K_e\,b | K | pri elektrolitih še faktor i
\Delta T | sprememba tališča ali vrelišča raztopine | | K
K_k | krioskopska konstanta topila | | K\,kg/mol | za vodo 1,86 K kg/mol
K_e | ebulioskopska konstanta topila | | K\,kg/mol | za vodo 0,512 K kg/mol
i | van 't Hoffov faktor | i = 1 + \alpha(\nu - 1) | – | število delcev, na katere razpade formulska enota
\alpha | stopnja disociacije | | – | delež razpadlih formulskih enot
\nu | število ionov iz ene formulske enote | | – | za MgSO₄ 2, za CaCl₂ 3
T | absolutna temperatura | | K
R | splošna plinska konstanta | | J/(mol K)
T_t | tališče čistega topila | | K | v formuli z zvezdico; za vodo 273,15 K
\Delta_{\mathrm{tal}} | sprememba pri taljenju | | | skupaj s H: talilna entalpija topila
H | entalpija | | kJ/mol | pri taljenju: talilna entalpija topila, za vodo 6,01 kJ/mol
x_2 | množinski delež topljenca | | –
M_1 | molska masa topila | | kg/mol | za vodo 0,018 02 kg/mol
:::
