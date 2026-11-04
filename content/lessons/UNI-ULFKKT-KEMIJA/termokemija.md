---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V celicah ni plamena in temperatura ostane $37\,^\circ\mathrm{C}$, pa vendar telo iz grama glukoze dobi enako energijo kot plamen, ki jo sežge: okoli $15{,}6\,\mathrm{kJ}$. Še bolj nenavadno: v hladilnem obkladku za zvit gleženj raztapljanje steče samo od sebe, čeprav toploto jemlje, zato se obkladek ohladi. Termokemija pove, koliko toplote se pri reakciji sprosti ali porabi, in zakaj pot reakcije pri tem ni pomembna. Iz nje izhajajo energijske vrednosti na deklaracijah živil, potrebno hlajenje kemijskega reaktorja in prvi korak k vprašanju, ali reakcija sploh lahko poteče.

## Razlaga

Mamljiva predstava je, da snov toploto »vsebuje« in da je sproščena toplota odvisna od tega, kako reakcija poteka: počasi v celici manj, hitro v plamenu več. Obe misli zavajata. Snov ima notranjo energijo, toplota pa je le energija na poti med sistemom in okolico. Pri stalnem tlaku je enaka spremembi entalpije, ta pa je odvisna le od začetka in konca. Razdelki spodaj to zgradijo po korakih.

**1. Sistem in okolica.** **Sistem** je del sveta, ki ga opazujemo (reakcijska zmes), **okolica** vse ostalo. Sistem lahko z okolico izmenjuje energijo kot **toploto** $q$ ali **delo** $w$. Dogovor o predznaku: kar sistem prejme, je pozitivno.

**2. Notranja energija in prvi zakon.** Notranja energija $U$ je vsota vseh energij delcev v sistemu. Absolutne vrednosti ne poznamo, merimo pa spremembe. Količina je **funkcija stanja**, če je njena vrednost določena samo s stanjem sistema ($T$, $p$, sestava, agregatna stanja); njena sprememba je tedaj odvisna le od začetnega in končnega stanja. **Prvi zakon termodinamike** (ohranitev energije): naj bo sistem zaprt (z okolico izmenjuje energijo, snovi pa ne); potem je

$$\Delta U = q + w,$$

in $U$ je funkcija stanja, čeprav $q$ in $w$ posamič nista. **Posledica:** če sistem opravlja le volumsko delo $w = -p_\text{zun}\,\Delta V$ in je prostornina stalna, je $\Delta V = 0$, torej $w = 0$ in $\Delta U = q_V$ (toplota, izmerjena v zaprti »bombi«).

**3. Entalpija.** Večina reakcij v laboratoriju in v naravi poteka pri **stalnem tlaku** (odprta posoda, celica). Tam je primerna funkcija **entalpija**, definirana kot $H = U + pV$. Ker so $U$, $p$ in $V$ funkcije stanja, je tudi $H$ funkcija stanja.

**Izrek.** Naj bo sistem zaprt, naj opravlja le volumsko delo in naj bo tlak ves čas stalen in enak zunanjemu ($p = p_\text{zun}$). Potem je

$$\Delta H = q_p.$$

*Dokaz.* Pri stalnem $p$ je $\Delta H = \Delta U + \Delta(pV) = \Delta U + p\,\Delta V$. Po prvem zakonu je $\Delta U = q_p + w = q_p - p\,\Delta V$, zato $\Delta H = q_p - p\,\Delta V + p\,\Delta V = q_p$. $\square$

Sprememba entalpije je torej toplota, izmenjana pri stalnem tlaku. Ker je $H$ funkcija stanja, je ta toplota odvisna le od začetnega in končnega stanja, ne od poti.

- $\Delta H < 0$: **eksotermna** reakcija, sistem oddaja toploto (gorenje, nevtralizacija).
- $\Delta H > 0$: **endotermna** reakcija, sistem toploto prejema (razkroj apnenca, taljenje ledu).

:::premisli
Zakaj kocka ledu pri $0\,^\circ\mathrm{C}$ zvit gleženj ohladi bolj kot enaka masa vode pri $0\,^\circ\mathrm{C}$?
---
Taljenje ledu je endotermno ($\Delta H \approx +6{,}0\,\mathrm{kJ/mol}$, okoli $334\,\mathrm{J}$ na gram). Led mora to toploto najprej vzeti koži, šele nato se nastala voda segreva. Voda pri $0\,^\circ\mathrm{C}$ pa koži jemlje le toploto za segrevanje.
:::

**4. Termokemijska enačba.** Je urejena enačba z agregatnimi stanji in reakcijsko entalpijo:

$$\mathrm{CH_4(g) + 2\,O_2(g) \longrightarrow CO_2(g) + 2\,H_2O(l)}, \qquad \Delta_\mathrm{r}H^\circ = -890{,}3\,\mathrm{kJ/mol}.$$

Enota $\mathrm{kJ/mol}$ pomeni »na mol reakcije, kot je zapisana«: ko zreagira $1\,\mathrm{mol}$ metana in $2\,\mathrm{mol}$ kisika. Pravila:

- če enačbo pomnožimo s faktorjem, se $\Delta H$ pomnoži z istim faktorjem,
- obrnjena reakcija ima nasprotni predznak $\Delta H$,
- agregatno stanje je pomembno: $\Delta H$ za nastanek $\mathrm{H_2O(l)}$ in $\mathrm{H_2O(g)}$ se razlikujeta za izparilno entalpijo ($44\,\mathrm{kJ/mol}$ pri $25\,^\circ\mathrm{C}$).

Toplota pri dani množini snovi: $q = n \cdot \dfrac{|\Delta_\mathrm{r}H|}{\nu}$, kjer je $\nu$ koeficient te snovi v enačbi.

**5. Standardno stanje.** Oznaka $^\circ$ pomeni standardne pogoje: tlak $p^\circ = 1\,\mathrm{bar}$, za raztopine $c^\circ = 1\,\mathrm{mol/L}$, snov v najstabilnejši obliki pri dani temperaturi (tabelirano običajno pri $298{,}15\,\mathrm{K}$).

**6. Hessov zakon.** Naj bo reakcija vsota stopenj (algebrska vsota njihovih termokemijskih enačb je enaka enačbi reakcije) in naj se vse stopnje nanašajo na iste pogoje ($T$, $p$, agregatna stanja). Potem je reakcijska entalpija enaka vsoti entalpij stopenj, ne glede na to, ali reakcija poteče v enem ali v več korakih:

$$\Delta H_\text{celotna} = \Delta H_1 + \Delta H_2 + \dots$$

*Dokaz.* Stopnje vodijo skozi vmesna stanja $Z = S_0 \to S_1 \to \dots \to S_k = K$. Ker je $H$ funkcija stanja, je $\Delta H_i = H(S_i) - H(S_{i-1})$; vsota je teleskopska: $\sum_i \Delta H_i = H(K) - H(Z) = \Delta H_\text{celotna}$. $\square$

Termokemijske enačbe torej lahko seštevamo, odštevamo in množimo kot algebrske enačbe. Tako izračunamo entalpije reakcij, ki jih ne moremo neposredno izmeriti (npr. nastanek $\mathrm{CO}$ iz ogljika, ker pri gorenju vedno nastane tudi nekaj $\mathrm{CO_2}$).

:::premisli
Celica razgradi glukozo v več deset korakih, plamen jo sežge naenkrat. Ali je skupna $\Delta H$ v celici manjša?
---
Ne. Začetek (glukoza in kisik) in konec ($\mathrm{CO_2}$ in tekoča voda) sta enaka, zato je tudi skupna $\Delta H$ enaka, $-2802{,}5\,\mathrm{kJ/mol}$. Razlika je le v tem, da se v celici del energije ne sprosti takoj kot toplota, ampak se začasno shrani v ATP.
:::

**7. Standardna tvorbena entalpija** $\Delta_\mathrm{f}H^\circ$ je standardna reakcijska entalpija pri dani temperaturi za nastanek $1\,\mathrm{mol}$ spojine v standardnem stanju iz **elementov v standardnem stanju** (v najstabilnejši obliki pri tej temperaturi). Za $\mathrm{H_2O(l)}$: $\mathrm{H_2(g) + \tfrac12\,O_2(g) \to H_2O(l)}$, $\Delta_\mathrm{f}H^\circ = -285{,}8\,\mathrm{kJ/mol}$. Za elemente v standardnem stanju ($\mathrm{O_2(g)}$, $\mathrm{C}$(grafit), $\mathrm{Fe(s)}$) je po definiciji $\Delta_\mathrm{f}H^\circ = 0$. Iz Hessovega zakona sledi

$$\Delta_\mathrm{r}H^\circ = \sum \nu\,\Delta_\mathrm{f}H^\circ(\text{produkti}) - \sum \nu\,\Delta_\mathrm{f}H^\circ(\text{reaktanti}).$$

*Izpeljava.* Reakcijo v mislih izvedemo v dveh stopnjah: (1) reaktante razgradimo v elemente v standardnem stanju, kar je obrat njihovega nastanka, $\Delta H_1 = -\sum \nu\,\Delta_\mathrm{f}H^\circ(\text{reaktanti})$; (2) iz istih elementov sestavimo produkte, $\Delta H_2 = +\sum \nu\,\Delta_\mathrm{f}H^\circ(\text{produkti})$. Elementi se ohranijo, zato je to res pot od reaktantov do produktov, in po Hessovem zakonu je $\Delta_\mathrm{r}H^\circ = \Delta H_1 + \Delta H_2$.

Nekaj vrednosti pri $298\,\mathrm{K}$ ($\mathrm{kJ/mol}$):

| snov | $\Delta_\mathrm{f}H^\circ$ | snov | $\Delta_\mathrm{f}H^\circ$ |
|---|---|---|---|
| $\mathrm{CO_2(g)}$ | $-393{,}5$ | $\mathrm{CH_4(g)}$ | $-74{,}8$ |
| $\mathrm{CO(g)}$ | $-110{,}5$ | $\mathrm{C_2H_5OH(l)}$ | $-277{,}7$ |
| $\mathrm{H_2O(l)}$ | $-285{,}8$ | $\mathrm{C_6H_{12}O_6(s)}$ | $-1273{,}3$ |
| $\mathrm{H_2O(g)}$ | $-241{,}8$ | $\mathrm{CaCO_3(s)}$ | $-1206{,}9$ |
| $\mathrm{NH_3(g)}$ | $-46{,}1$ | $\mathrm{CaO(s)}$ | $-635{,}1$ |

**8. Kalorimetrija.** Toploto merimo s **kalorimetrom**. V preprostem kalorimetru (izolirana posoda z raztopino) je toplota, ki jo sprejme raztopina,

$$q = m\,c_p\,\Delta T,$$

kjer je $c_p$ specifična toplota (za vodo in razredčene raztopine $4{,}18\,\mathrm{J\,g^{-1}\,K^{-1}}$). Če reakcija toploto sprosti, se raztopina segreje, zato je $\Delta H$ reakcije $-q/n$, kjer je $n$ množina zreagirane snovi. Pri natančnejših meritvah upoštevamo še toplotno kapaciteto kalorimetra $C$: $q = C\,\Delta T$.

**9. $\Delta H$ in $\Delta U$.** Razlika izhaja iz dela razpenjanja plinov: $\Delta H = \Delta U + \Delta(pV)$. Naj bo temperatura začetnega in končnega stanja enaka, naj se plini vedejo idealno in naj bo prostornina trdnih snovi in tekočin zanemarljiva. Potem je

$$\Delta H = \Delta U + \Delta n_\mathrm{g}\,RT,$$

kjer je $\Delta n_\mathrm{g}$ sprememba množine plinov. *Izpeljava:* $pV$ kondenziranih faz zanemarimo, za pline je $pV = n_\mathrm{g}RT$, zato pri stalni $T$ velja $\Delta(pV) = \Delta n_\mathrm{g}\,RT$. Pri $298\,\mathrm{K}$ je $RT = 2{,}48\,\mathrm{kJ/mol}$, zato je razlika majhna v primerjavi z reakcijskimi entalpijami, a pri natančni kalorimetriji (bomba meri $\Delta U$) pomembna.

## Rešeni primeri

### Primer 1 (lažji)

Pri gorenju metana velja $\mathrm{CH_4(g) + 2\,O_2(g) \to CO_2(g) + 2\,H_2O(l)}$, $\Delta_\mathrm{r}H^\circ = -890{,}3\,\mathrm{kJ/mol}$. Koliko toplote se sprosti pri sežigu $8{,}00\,\mathrm{g}$ metana? $M(\mathrm{CH_4}) = 16{,}04\,\mathrm{g/mol}$.

**Podatki:** $m(\mathrm{CH_4}) = 8{,}00\,\mathrm{g}$, $M(\mathrm{CH_4}) = 16{,}04\,\mathrm{g/mol}$, $\Delta_\mathrm{r}H^\circ = -890{,}3\,\mathrm{kJ/mol}$ (na $1\,\mathrm{mol}$ $\mathrm{CH_4}$)
**Iščemo:** sproščeno toploto $q$

:::formula
$n = \dfrac{m}{M}$, $\quad q = n \cdot |\Delta_\mathrm{r}H^\circ|$ (koeficient metana je $1$)
:::

**Rešitev:**

1. Entalpija je podana na mol, zato maso pretvorimo v množino: $n(\mathrm{CH_4}) = 8{,}00\,\mathrm{g} / 16{,}04\,\mathrm{g/mol} = 0{,}4988\,\mathrm{mol}$.
2. Koeficient metana je $1$, zato: $\Delta H = 0{,}4988\,\mathrm{mol} \cdot (-890{,}3\,\mathrm{kJ/mol}) = -444\,\mathrm{kJ}$.
3. Negativni predznak pomeni, da sistem toploto odda okolici.
4. Odgovor: pri sežigu $8{,}00\,\mathrm{g}$ metana se sprosti približno $444\,\mathrm{kJ}$ toplote.

### Primer 2

Izračunaj reakcijsko entalpijo za $\mathrm{C(s) + \tfrac12\,O_2(g) \to CO(g)}$ iz entalpij reakcij:
(a) $\mathrm{C(s) + O_2(g) \to CO_2(g)}$, $\Delta H_a = -393{,}5\,\mathrm{kJ/mol}$;
(b) $\mathrm{CO(g) + \tfrac12\,O_2(g) \to CO_2(g)}$, $\Delta H_b = -283{,}0\,\mathrm{kJ/mol}$.

**Podatki:** $\Delta H_a = -393{,}5\,\mathrm{kJ/mol}$ za (a), $\Delta H_b = -283{,}0\,\mathrm{kJ/mol}$ za (b); iskana reakcija $\mathrm{C(s) + \tfrac12\,O_2(g) \to CO(g)}$
**Iščemo:** $\Delta H$ iskane reakcije

:::formula
Hessov zakon: enačbe seštevamo in obračamo kot algebrske; obrnjena reakcija ima $-\Delta H$.
:::

**Rešitev:**

1. Ogljik mora biti na levi kot v (a): reakcijo (a) vzamemo nespremenjeno.
2. $\mathrm{CO}$ mora biti na desni, v (b) pa je na levi: reakcijo (b) obrnemo, $\mathrm{CO_2(g) \to CO(g) + \tfrac12\,O_2(g)}$, $\Delta H = +283{,}0\,\mathrm{kJ/mol}$.
3. Seštejemo: $\mathrm{C + O_2 + CO_2 \to CO_2 + CO + \tfrac12\,O_2}$. Okrajšamo $\mathrm{CO_2}$ in $\tfrac12\,\mathrm{O_2}$: $\mathrm{C + \tfrac12\,O_2 \to CO}$.
4. $\Delta H = -393{,}5 + 283{,}0 = -110{,}5\,\mathrm{kJ/mol}$.
5. Odgovor: reakcijska entalpija nastanka $\mathrm{CO}$ iz ogljika je $-110{,}5\,\mathrm{kJ/mol}$; to je hkrati standardna tvorbena entalpija $\mathrm{CO(g)}$.

### Primer 3 (težji)

V bombnem kalorimetru s toplotno kapaciteto $C = 10{,}00\,\mathrm{kJ/K}$ sežgemo $1{,}000\,\mathrm{g}$ tekočega etanola v presežku kisika, $\mathrm{C_2H_5OH(l) + 3\,O_2(g) \to 2\,CO_2(g) + 3\,H_2O(l)}$; temperatura naraste za $2{,}961\,\mathrm{K}$. Izračunaj $\Delta_\mathrm{r}U$ in $\Delta_\mathrm{r}H$ sežiga pri $298\,\mathrm{K}$, iz njiju standardno tvorbeno entalpijo etanola in toploto, ki se pri stalnem tlaku sprosti pri sežigu $10{,}0\,\mathrm{g}$ etanola (približno ena enota alkohola, telo ga presnovi do istih produktov). $\Delta_\mathrm{f}H^\circ$: $\mathrm{CO_2(g)}$ $-393{,}5$, $\mathrm{H_2O(l)}$ $-285{,}8\,\mathrm{kJ/mol}$; $M(\mathrm{C_2H_5OH}) = 46{,}07\,\mathrm{g/mol}$; $R = 8{,}314\,\mathrm{J\,mol^{-1}\,K^{-1}}$. Razliko med izmerjenimi in standardnimi pogoji zanemari.

**Podatki:** $C = 10{,}00\,\mathrm{kJ/K}$, $m = 1{,}000\,\mathrm{g}$, $\Delta T = 2{,}961\,\mathrm{K}$, $\Delta_\mathrm{f}H^\circ(\mathrm{CO_2, g}) = -393{,}5\,\mathrm{kJ/mol}$, $\Delta_\mathrm{f}H^\circ(\mathrm{H_2O, l}) = -285{,}8\,\mathrm{kJ/mol}$, $\Delta_\mathrm{f}H^\circ(\mathrm{O_2, g}) = 0$, $M = 46{,}07\,\mathrm{g/mol}$, $T = 298\,\mathrm{K}$, $R = 8{,}314\,\mathrm{J\,mol^{-1}\,K^{-1}}$
**Iščemo:** $\Delta_\mathrm{r}U$, $\Delta_\mathrm{r}H$, $\Delta_\mathrm{f}H^\circ(\mathrm{C_2H_5OH, l})$, toploto $q$ za $10{,}0\,\mathrm{g}$

:::formula
$q_V = C\,\Delta T$, $\quad \Delta_\mathrm{r}U = -q_V/n$, $\quad \Delta H = \Delta U + \Delta n_\mathrm{g}RT$, $\quad \Delta_\mathrm{r}H^\circ = \sum \nu\,\Delta_\mathrm{f}H^\circ(\text{prod.}) - \sum \nu\,\Delta_\mathrm{f}H^\circ(\text{reakt.})$
:::

**Rešitev:**

1. Bomba ima stalno prostornino, zato izmerjena toplota da $\Delta U$: $q_V = 10{,}00\,\mathrm{kJ/K} \cdot 2{,}961\,\mathrm{K} = 29{,}61\,\mathrm{kJ}$, ki jih sprejme kalorimeter.
2. Množina etanola: $n = 1{,}000/46{,}07 = 0{,}021\,71\,\mathrm{mol}$.
3. Sistem toploto odda, zato $\Delta_\mathrm{r}U = -29{,}61\,\mathrm{kJ}/0{,}021\,71\,\mathrm{mol} = -1364{,}1\,\mathrm{kJ/mol}$.
4. Plini: levo $3\,\mathrm{mol}$ $\mathrm{O_2}$, desno $2\,\mathrm{mol}$ $\mathrm{CO_2}$ (voda je tekoča), $\Delta n_\mathrm{g} = 2 - 3 = -1$.
5. $\Delta_\mathrm{r}H = -1364{,}1 + (-1) \cdot 8{,}314 \cdot 10^{-3} \cdot 298\,\mathrm{kJ/mol} = -1364{,}1 - 2{,}5 = -1366{,}6\,\mathrm{kJ/mol}$.
6. Formulo s tvorbenimi entalpijami rešimo za edino neznanko, etanol ($\mathrm{O_2}$ ima $0$): produkti $2 \cdot (-393{,}5) + 3 \cdot (-285{,}8) = -1644{,}4\,\mathrm{kJ/mol}$, zato $\Delta_\mathrm{f}H^\circ(\mathrm{C_2H_5OH}) = -1644{,}4 - \Delta_\mathrm{r}H = -1644{,}4 + 1366{,}6 = -277{,}8\,\mathrm{kJ/mol}$.
7. Pri stalnem tlaku je toplota $|\Delta_\mathrm{r}H|$ na mol: $n = 10{,}0/46{,}07 = 0{,}2171\,\mathrm{mol}$, $q = 0{,}2171 \cdot 1366{,}6\,\mathrm{kJ} \approx 297\,\mathrm{kJ}$.
8. Odgovor: $\Delta_\mathrm{r}U \approx -1364{,}1\,\mathrm{kJ/mol}$, $\Delta_\mathrm{r}H \approx -1366{,}6\,\mathrm{kJ/mol}$, $\Delta_\mathrm{f}H^\circ(\mathrm{C_2H_5OH, l}) \approx -277{,}8\,\mathrm{kJ/mol}$ (tabelirano $-277{,}7$, razlika je v zaokroževanju); sežig $10{,}0\,\mathrm{g}$ etanola sprosti okoli $297\,\mathrm{kJ}$.

### Primer 4 – zdaj ti

Bolnik dobi infuzijo $500\,\mathrm{mL}$ $5\,\%$ raztopine glukoze, kar je $25{,}0\,\mathrm{g}$ glukoze. Koliko energije telo dobi, ko jo popolnoma oksidira, $\mathrm{C_6H_{12}O_6(s) + 6\,O_2(g) \to 6\,CO_2(g) + 6\,H_2O(l)}$? $\Delta_\mathrm{f}H^\circ$: $\mathrm{C_6H_{12}O_6(s)}$ $-1273{,}3$, $\mathrm{CO_2(g)}$ $-393{,}5$, $\mathrm{H_2O(l)}$ $-285{,}8\,\mathrm{kJ/mol}$; $M(\mathrm{C_6H_{12}O_6}) = 180{,}16\,\mathrm{g/mol}$.

**Podatki:** $V = 500\,\mathrm{mL}$, $5\,\%$ raztopina, $m(\mathrm{C_6H_{12}O_6}) = 25{,}0\,\mathrm{g}$, $\Delta_\mathrm{f}H^\circ(\mathrm{C_6H_{12}O_6, s}) = -1273{,}3\,\mathrm{kJ/mol}$, $\Delta_\mathrm{f}H^\circ(\mathrm{CO_2, g}) = -393{,}5\,\mathrm{kJ/mol}$, $\Delta_\mathrm{f}H^\circ(\mathrm{H_2O, l}) = -285{,}8\,\mathrm{kJ/mol}$, $\Delta_\mathrm{f}H^\circ(\mathrm{O_2, g}) = 0$, $M = 180{,}16\,\mathrm{g/mol}$
**Iščemo:** $\Delta_\mathrm{r}H^\circ$ in toploto $q$ za $25{,}0\,\mathrm{g}$ glukoze

:::formula
$\Delta_\mathrm{r}H^\circ = \sum \nu\,\Delta_\mathrm{f}H^\circ(\text{prod.}) - \sum \nu\,\Delta_\mathrm{f}H^\circ(\text{reakt.})$, $\quad q = n\,|\Delta_\mathrm{r}H^\circ|$
:::

**Rešitev:**

1. Produkti (tvorbene entalpije veljajo na mol, zato pomnožimo s koeficienti): $6 \cdot (-393{,}5) + 6 \cdot (-285{,}8) = -2361{,}0 - 1714{,}8 = -4075{,}8\,\mathrm{kJ/mol}$.
2. Reaktanti ($\mathrm{O_2}$ je element, zato $0$): $-1273{,}3 + 6 \cdot 0 = -1273{,}3\,\mathrm{kJ/mol}$.
3. $\Delta_\mathrm{r}H^\circ = -4075{,}8 - (-1273{,}3) = -2802{,}5\,\mathrm{kJ/mol}$.
4. Množina glukoze, ker je $\Delta_\mathrm{r}H^\circ$ na mol: $n = 25{,}0/180{,}16 = 0{,}1388\,\mathrm{mol}$.
5. Toploto izračunaj sam.

:::premisli
Koliko energije telo dobi iz infuzije? Bi bila sproščena toplota večja ali manjša, če bi voda pri oksidaciji nastala kot para?
---
$q = 0{,}1388 \cdot 2802{,}5\,\mathrm{kJ} \approx 389\,\mathrm{kJ}$. S paro bi bila manjša: končno stanje bi bilo drugo, del energije bi ostal v pari kot izparilna entalpija ($44\,\mathrm{kJ}$ na mol vode, nastane pa je $6\,\mathrm{mol}$ na mol glukoze).
:::

## Pogoste napake

- **Obrnjen vrstni red.** $\Delta_\mathrm{r}H^\circ$ je »produkti minus reaktanti«, ne obratno. Pri obrnjenem vrstnem redu dobiš pravo vrednost z napačnim predznakom.
- **Pozabljeni koeficienti.** Tvorbene entalpije veljajo za $1\,\mathrm{mol}$ snovi; v Primeru 3 je treba $\Delta_\mathrm{f}H^\circ(\mathrm{H_2O})$ pomnožiti s $3$.
- **Tvorbena entalpija elementa.** $\Delta_\mathrm{f}H^\circ(\mathrm{O_2, g}) = 0$, ne pa $\Delta_\mathrm{f}H^\circ(\mathrm{O_3, g})$ ali $\Delta_\mathrm{f}H^\circ(\mathrm{H, g})$; nič velja le za najstabilnejšo obliko elementa.
- **Agregatno stanje vode.** Z $\mathrm{H_2O(g)}$ namesto $\mathrm{H_2O(l)}$ dobiš pri sežigu metana $-802\,\mathrm{kJ/mol}$ namesto $-890\,\mathrm{kJ/mol}$.
- **Predznak v kalorimetriji.** Če se raztopina segreje, je $q$ raztopine pozitiven, $\Delta H$ reakcije pa negativen.
- **Enote $R$.** $R = 8{,}314\,\mathrm{J\,mol^{-1}\,K^{-1}}$; pri seštevanju s $\mathrm{kJ/mol}$ ga pretvori v $0{,}008\,314\,\mathrm{kJ\,mol^{-1}\,K^{-1}}$.
- **Hessov zakon brez obrata predznaka.** Ko reakcijo obrneš, obrni tudi predznak $\Delta H$; ko jo pomnožiš, pomnoži tudi $\Delta H$.

## Povzetek

- $\Delta U = q + w$; pri stalnem tlaku $\Delta H = q_p$; $H$ in $U$ sta funkciji stanja.
- $\Delta H < 0$ eksotermno, $\Delta H > 0$ endotermno; obrnjena reakcija: $-\Delta H$, pomnožena: $k\,\Delta H$.
- **Hessov zakon:** entalpije zaporednih reakcij se seštevajo.
- **Tvorbena entalpija:** nastanek $1\,\mathrm{mol}$ spojine iz elementov; za elemente v standardnem stanju je $0$.
- $\Delta_\mathrm{r}H^\circ = \sum \nu\,\Delta_\mathrm{f}H^\circ(\text{prod.}) - \sum \nu\,\Delta_\mathrm{f}H^\circ(\text{reakt.})$.
- Kalorimetrija: $q = mc_p\Delta T$ ali $C\Delta T$, $\Delta H = -q/n$; $\Delta H = \Delta U + \Delta n_\mathrm{g}RT$.

## Za izpit

Znati moraš povedati:

- prvi zakon termodinamike za zaprt sistem, dogovor o predznaku in definicijo funkcije stanja;
- definicijo entalpije in izrek $\Delta H = q_p$ s pogoji (zaprt sistem, le volumsko delo, stalen tlak) z dokazom, ter zakaj je $\Delta U = q_V$;
- Hessov zakon s pogoji in dokaz s teleskopsko vsoto;
- definicijo standardnega stanja in standardne tvorbene entalpije ter izpeljavo $\Delta_\mathrm{r}H^\circ = \sum \nu\,\Delta_\mathrm{f}H^\circ(\text{prod.}) - \sum \nu\,\Delta_\mathrm{f}H^\circ(\text{reakt.})$;
- izpeljavo $\Delta H = \Delta U + \Delta n_\mathrm{g}RT$ z vsemi predpostavkami.

### Naloga 1

Standardne sežigne entalpije pri $298\,\mathrm{K}$ so: grafit $-393{,}5$, $\mathrm{H_2(g)}$ $-285{,}8$ in $\mathrm{CH_4(g)}$ $-890{,}3\,\mathrm{kJ/mol}$ (voda vedno kot $\mathrm{H_2O(l)}$). (a) S Hessovim zakonom izračunaj $\Delta_\mathrm{f}H^\circ(\mathrm{CH_4, g})$. (b) V plinskem grelniku segrejemo $200\,\mathrm{L}$ vode od $15{,}0$ na $55{,}0\,^\circ\mathrm{C}$; dimni plini odhajajo z vodo kot paro, v vodo pa preide $80{,}0\,\%$ toplote, ki se pri tem sprosti. Koliko kubičnih metrov metana pri $25\,^\circ\mathrm{C}$ in $101{,}3\,\mathrm{kPa}$ porabimo? Izparilna entalpija vode je $44{,}0\,\mathrm{kJ/mol}$, $c_p = 4{,}18\,\mathrm{J\,g^{-1}\,K^{-1}}$, gostota vode $1{,}00\,\mathrm{kg/L}$, $R = 8{,}314\,\mathrm{J\,mol^{-1}\,K^{-1}}$.

**Rešitev:**

1. Iskana reakcija je $\mathrm{C(s) + 2\,H_2(g) \to CH_4(g)}$. Sestavimo jo iz sežiga grafita, dvakratnega sežiga vodika in obrnjenega sežiga metana; $\mathrm{O_2}$, $\mathrm{CO_2}$ in voda se pokrajšajo.
2. $\Delta_\mathrm{f}H^\circ(\mathrm{CH_4}) = -393{,}5 + 2 \cdot (-285{,}8) - (-890{,}3) = -74{,}8\,\mathrm{kJ/mol}$.
3. Voda v dimnih plinih je para, zato sežigu metana do $\mathrm{H_2O(l)}$ prištejemo izparevanje $2\,\mathrm{mol}$ vode: $\Delta H = -890{,}3 + 2 \cdot 44{,}0 = -802{,}3\,\mathrm{kJ/mol}$.
4. Toplota za vodo: $q = 200\,000\,\mathrm{g} \cdot 4{,}18\,\mathrm{J\,g^{-1}\,K^{-1}} \cdot 40{,}0\,\mathrm{K} = 3{,}344 \cdot 10^7\,\mathrm{J} = 33\,440\,\mathrm{kJ}$.
5. Izkoristek je $80{,}0\,\%$, zato mora metan sprostiti $33\,440/0{,}800 = 41\,800\,\mathrm{kJ}$.
6. Množina metana: $n = 41\,800/802{,}3 = 52{,}10\,\mathrm{mol}$.
7. Prostornina iz splošne plinske enačbe: $V = nRT/p = 52{,}10 \cdot 8{,}314 \cdot 298{,}15/101\,300\,\mathrm{m^3} = 1{,}27\,\mathrm{m^3}$.
8. Odgovor: $\Delta_\mathrm{f}H^\circ(\mathrm{CH_4}) = -74{,}8\,\mathrm{kJ/mol}$; porabimo okoli $1{,}27\,\mathrm{m^3}$ metana.

### Naloga 2

Natančno navedi Hessov zakon in ga dokaži iz prvega zakona termodinamike. Utemelji, ali enaka trditev velja tudi za toploto, izmenjano pri stalni prostornini, in ali velja za toploto reakcije v galvanskem členu, ki pri stalnem tlaku opravlja električno delo.

**Rešitev:**

1. Izrek: naj bo reakcija pri danih $T$ in $p$ algebrska vsota stopenj; potem je $\Delta_\mathrm{r}H = \sum_i \Delta H_i$.
2. Iz prvega zakona je $U$ funkcija stanja; $p$ in $V$ sta tudi, zato je funkcija stanja $H = U + pV$.
3. Stopnje vodijo skozi stanja $S_0, S_1, \dots, S_k$, kjer je $S_0$ začetno in $S_k$ končno stanje. Za vsako je $\Delta H_i = H(S_i) - H(S_{i-1})$, vsota je teleskopska in enaka $H(S_k) - H(S_0) = \Delta_\mathrm{r}H$.
4. Pri stalni prostornini in le volumskem delu je $q_V = \Delta U$, $U$ pa je funkcija stanja; isti dokaz z $U$ namesto $H$ pokaže, da so tudi toplote $q_V$ aditivne.
5. V galvanskem členu sistem opravi še električno delo $w_\mathrm{el} < 0$, zato je $\Delta U = q + w_\mathrm{vol} + w_\mathrm{el}$. Pri stalnem tlaku je $w_\mathrm{vol} = -p\,\Delta V$ in $\Delta H = \Delta U + p\,\Delta V$, torej $q = \Delta H - w_\mathrm{el} \ne \Delta H$. Izmenjana toplota je odvisna od tega, koliko dela dobimo, torej od poti.
6. Odgovor: Hessov zakon velja za $\Delta H$ (in zato za $q_p$, ko je le volumsko delo) ter za $q_V = \Delta U$; za toploto na splošno ne velja, ker toplota ni funkcija stanja: člen, ki opravlja električno delo, odda manj toplote kot ista reakcija v čaši.

## Drugače: Na sliki

Hessov zakon iz Primera 2 si predstavljaj kot entalpijski diagram z dvema potema od istega začetka do istega konca:

```
 H
 |   C(s) + O2(g)  ------------------+
 |        |                           |
 |        | -110,5 kJ                 |
 |        v                           |  -393,5 kJ
 |   CO(g) + 1/2 O2(g)                |  (neposredno)
 |        |                           |
 |        | -283,0 kJ                 |
 |        v                           v
 |   CO2(g)  <------------------------+
```

Pot čez $\mathrm{CO}$ in neposredna pot se končata na isti višini: $-110{,}5 + (-283{,}0) = -393{,}5\,\mathrm{kJ/mol}$. Tako kot pri vzponu na goro: višinska razlika med izhodiščem in vrhom ni odvisna od poti.

Tvorbene entalpije si predstavljaj kot »nadmorske višine« spojin, merjene od skupne ničle (elementov). Reakcijska entalpija je razlika višin med produkti in reaktanti.

## Drugače: Uporaba v stroki

**Kurilnost goriv.** Laboratoriji kurilnost premoga, biomase in goriv merijo v bombnem kalorimetru, ki ga umerijo s sežigom benzojske kisline z znano $\Delta_\mathrm{c}U$ (okoli $-26{,}4\,\mathrm{kJ/g}$). Bomba da zgornjo kurilnost (voda tekoča), za metan $890{,}3/16{,}04 \approx 55{,}5\,\mathrm{MJ/kg}$; spodnja (voda kot para) je $802{,}3/16{,}04 \approx 50{,}0\,\mathrm{MJ/kg}$. Kondenzacijski kotli izkoristijo prav to razliko, izparilno entalpijo vode v dimnih plinih.

**Varnost procesov.** Pred povečanjem sinteze z laboratorija v obrat izmerijo $\Delta_\mathrm{r}H$ v reakcijskem kalorimetru in ocenijo adiabatni dvig temperature, če hlajenje odpove: $\Delta T_\mathrm{ad} = c\,|\Delta_\mathrm{r}H|/(\rho\,c_p)$. Za $1\,\mathrm{mol/L}$ reakcije z $-100\,\mathrm{kJ/mol}$ v vodni raztopini je to $100\,000\,\mathrm{J}/(1000\,\mathrm{g} \cdot 4{,}18\,\mathrm{J\,g^{-1}\,K^{-1}}) \approx 24\,\mathrm{K}$; če pri tem vrelišče topila ali razkroj produkta doseže nevarno območje, postopek spremenijo (počasnejše dodajanje, razredčenje).

**Žganje apna.** Razkroj $\mathrm{CaCO_3}$ ima $\Delta_\mathrm{r}H^\circ = +178{,}3\,\mathrm{kJ/mol}$, torej okoli $1{,}78\,\mathrm{MJ}$ na kilogram apnenca. Iz tega inženirji izračunajo najmanjšo porabo goriva apnenice, dejanska je večja zaradi toplotnih izgub.

**Farmacija in materiali.** Diferenčna dinamična kalorimetrija (DSC) meri entalpijo taljenja in faznih prehodov majhnih vzorcev; z njo ločijo polimorfe zdravilnih učinkovin in določijo čistost.

## Drugače: Korak za korakom s številkami

V kalorimetru zmešamo $50{,}0\,\mathrm{mL}$ klorovodikove kisline s koncentracijo $1{,}00\,\mathrm{mol/L}$ in $50{,}0\,\mathrm{mL}$ raztopine $\mathrm{NaOH}$ s koncentracijo $1{,}00\,\mathrm{mol/L}$. Temperatura naraste za $6{,}80\,\mathrm{K}$. Izračunaj entalpijo nevtralizacije. Gostota raztopine je $1{,}00\,\mathrm{g/mL}$, $c_p = 4{,}18\,\mathrm{J\,g^{-1}\,K^{-1}}$, toplotno kapaciteto kalorimetra zanemarimo.

1. **Masa raztopine:** $V = 100{,}0\,\mathrm{mL}$, $m = 100{,}0\,\mathrm{g}$.
2. **Toplota, ki jo sprejme raztopina:** $q = 100{,}0\,\mathrm{g} \cdot 4{,}18\,\mathrm{J\,g^{-1}\,K^{-1}} \cdot 6{,}80\,\mathrm{K} = 2842\,\mathrm{J}$.
3. **Množina reakcije:** $n(\mathrm{H^+}) = n(\mathrm{OH^-}) = 1{,}00\,\mathrm{mol/L} \cdot 0{,}0500\,\mathrm{L} = 0{,}0500\,\mathrm{mol}$; reagenta sta v stehiometričnem razmerju.
4. **Entalpija:** $\Delta H = -q/n = -2842\,\mathrm{J}/0{,}0500\,\mathrm{mol} = -56\,840\,\mathrm{J/mol} \approx -56{,}8\,\mathrm{kJ/mol}$.
5. **Predznak:** raztopina se je segrela, zato je reakcija eksotermna in $\Delta H < 0$.
6. **Primerjava:** tabelirana vrednost za $\mathrm{H^+(aq) + OH^-(aq) \to H_2O(l)}$ je $-55{,}8\,\mathrm{kJ/mol}$. Ker je izmerjena vrednost po absolutni vrednosti celo večja, je ne pojasni toplota, ki jo sprejme posoda (njeno zanemarjenje bi dalo premajhno $|\Delta H|$), ampak predvsem napaka pri merjenju $\Delta T$ in to, da ima nastala raztopina $\mathrm{NaCl}$ nekoliko manjšo specifično toploto kot voda.

## Drugače: Bolj natančno

**Toplota ni funkcija stanja.** Toplota je odvisna od poti; šele pri stalnem tlaku in le volumskem delu je enaka spremembi funkcije stanja, zato Hessov zakon velja za $\Delta H$, ne za vsako izmenjano toploto.

**Kirchhoffov zakon.** Reakcijska entalpija je odvisna od temperature:

$$\Delta_\mathrm{r}H^\circ(T_2) = \Delta_\mathrm{r}H^\circ(T_1) + \int_{T_1}^{T_2} \Delta_\mathrm{r}C_p^\circ\,\mathrm{d}T, \qquad \Delta_\mathrm{r}C_p^\circ = \sum \nu\,C_{p,\mathrm{m}}^\circ(\text{prod.}) - \sum \nu\,C_{p,\mathrm{m}}^\circ(\text{reakt.}).$$

Če je $\Delta_\mathrm{r}C_p^\circ$ približno stalna, je popravek $\Delta_\mathrm{r}C_p^\circ\,(T_2 - T_1)$; pri spremembi za nekaj deset kelvinov je običajno le nekaj $\mathrm{kJ/mol}$.

**Vezne entalpije.** Reakcijsko entalpijo v plinski fazi lahko ocenimo iz povprečnih veznih entalpij: $\Delta_\mathrm{r}H \approx \sum D(\text{pretrgane vezi}) - \sum D(\text{nastale vezi})$. Za $\mathrm{CH_4(g) + 2\,O_2(g) \to CO_2(g) + 2\,H_2O(g)}$ z $D(\mathrm{C{-}H}) = 413$, $D(\mathrm{O{=}O}) = 498$, $D(\mathrm{C{=}O}) = 799$ in $D(\mathrm{O{-}H}) = 463\,\mathrm{kJ/mol}$:

$$\Delta_\mathrm{r}H \approx (4 \cdot 413 + 2 \cdot 498) - (2 \cdot 799 + 4 \cdot 463) = 2648 - 3450 = -802\,\mathrm{kJ/mol},$$

kar se tu dobro ujema z vrednostjo iz tvorbenih entalpij ($-393{,}5 + 2 \cdot (-241{,}8) + 74{,}8 = -802{,}3\,\mathrm{kJ/mol}$). V splošnem so ocene iz veznih entalpij le približne (napaka nekaj deset $\mathrm{kJ/mol}$), ker je moč vezi odvisna od okolice v molekuli, in veljajo le za pline.

**Entalpija ni vse.** Endotermne reakcije, kot je raztapljanje $\mathrm{NH_4NO_3}$, potekajo spontano. O spontanosti odloča Gibbsova energija $\Delta G = \Delta H - T\Delta S$, ki upošteva tudi spremembo entropije. Termokemija da prvi člen te enačbe.

## Preveri se

? Kolikšna je standardna tvorbena entalpija $\mathrm{O_2(g)}$?
- $-249\,\mathrm{kJ/mol}$
~ To je tvorbena entalpija atomarnega kisika $\mathrm{O(g)}$, in še ta z napačnim predznakom ($+249\,\mathrm{kJ/mol}$). Atomi O niso standardno stanje; najstabilnejša oblika je $\mathrm{O_2(g)}$.
+ $0\,\mathrm{kJ/mol}$
- $+498\,\mathrm{kJ/mol}$
~ To je vezna entalpija $\mathrm{O{=}O}$, energija za razcep vezi, ne za nastanek $\mathrm{O_2}$ iz elementa. Element v standardnem stanju ima $\Delta_\mathrm{f}H^\circ = 0$.
> Kisik $\mathrm{O_2(g)}$ je element v standardnem stanju, zato je njegova tvorbena entalpija po definiciji enaka nič. $498\,\mathrm{kJ/mol}$ je vezna entalpija $\mathrm{O{=}O}$.

? Za reakcijo $\mathrm{A \to B}$ je $\Delta H = -50\,\mathrm{kJ/mol}$. Kolikšna je $\Delta H$ za reakcijo $\mathrm{2\,B \to 2\,A}$?
- $-100\,\mathrm{kJ/mol}$
~ Vrednost si podvojil, predznaka pa nisi obrnil. Obrnjena reakcija ima nasprotni predznak $\Delta H$.
- $+50\,\mathrm{kJ/mol}$
~ Predznak si pravilno obrnil, pozabil pa si, da so koeficienti $2$; pomnožena enačba ima pomnoženo $\Delta H$.
+ $+100\,\mathrm{kJ/mol}$
> Obrat reakcije zamenja predznak ($+50$), množenje z $2$ podvoji vrednost: $+100\,\mathrm{kJ/mol}$.

? Izračunaj $\Delta_\mathrm{r}H^\circ$ za $\mathrm{CaCO_3(s) \to CaO(s) + CO_2(g)}$. ($\Delta_\mathrm{f}H^\circ$: $\mathrm{CaCO_3}$ $-1206{,}9$, $\mathrm{CaO}$ $-635{,}1$, $\mathrm{CO_2}$ $-393{,}5\,\mathrm{kJ/mol}$)
- $-178{,}3\,\mathrm{kJ/mol}$
~ Odštel si reaktante minus produkte. Pravilo je produkti minus reaktanti; obrnjen vrstni red da napačen predznak.
+ $+178{,}3\,\mathrm{kJ/mol}$
- $-2235{,}5\,\mathrm{kJ/mol}$
~ Seštel si vse tri tvorbene entalpije. Tvorbene entalpije reaktantov se odštevajo, ker reaktante v mislih najprej razgradimo v elemente.
> $\Delta_\mathrm{r}H^\circ = (-635{,}1 - 393{,}5) - (-1206{,}9) = +178{,}3\,\mathrm{kJ/mol}$. Razkroj apnenca je endotermen, zato apnenice potrebujejo veliko toplote. $-178{,}3$ dobiš z obrnjenim odštevanjem, $-2235{,}5$ s seštevanjem vseh vrednosti.

? Kaj pravi Hessov zakon?
- Vsaka eksotermna reakcija poteče spontano.
~ To ni Hessov zakon in tudi ne drži: o spontanosti odloča $\Delta G$, ki upošteva tudi entropijo. Sinteza amoniaka je na primer eksotermna, pri standardnih pogojih nad približno $460\,\mathrm{K}$ pa ne poteče sama od sebe.
+ Reakcijska entalpija je odvisna le od začetnega in končnega stanja, ne od poti.
- Pri stalni prostornini je toplota enaka spremembi entalpije.
~ Zamenjava $\Delta H$ in $\Delta U$: pri stalni prostornini je toplota enaka $\Delta U$, pri stalnem tlaku $\Delta H$. Hessov zakon pa govori o neodvisnosti od poti.
> Ker je entalpija funkcija stanja, je skupna $\Delta H$ večstopenjske reakcije enaka vsoti $\Delta H$ posameznih stopenj. Pri stalni prostornini je toplota enaka $\Delta U$, ne $\Delta H$.

? Hladilni obkladek vsebuje $40{,}0\,\mathrm{g}$ amonijevega nitrata ($M = 80{,}04\,\mathrm{g/mol}$), ki se ob stisku raztopi v vodi; $\Delta H = +25{,}7\,\mathrm{kJ/mol}$. Kaj obkladek naredi z gležnjem?
- Odvzame mu približno $1028\,\mathrm{kJ}$ toplote.
~ Maso si pomnožil z molsko entalpijo. $\Delta H$ velja na mol, zato maso najprej pretvori v množino.
+ Odvzame mu približno $12{,}8\,\mathrm{kJ}$ toplote.
- Odda mu približno $12{,}8\,\mathrm{kJ}$ toplote in ga segreje.
~ Pozitivna $\Delta H$ pomeni, da sistem toploto prejema. Obkladek jo jemlje okolici, zato hladi.
> $n = 40{,}0/80{,}04 = 0{,}4998\,\mathrm{mol}$, $q = 0{,}4998 \cdot 25{,}7\,\mathrm{kJ} \approx 12{,}8\,\mathrm{kJ}$. Raztapljanje je endotermno, zato raztopina toploto jemlje gležnju.

:::simboli
\Delta U | sprememba notranje energije | \Delta U = q + w | kJ | pri stalni prostornini ΔU = q_V
q | toplota | | J | prejeta pozitivna; pri segrevanju q = m c_p ΔT
w | delo | | J | pri razpenjanju w = −p ΔV
\Delta H | reakcijska entalpija | \Delta H = q_p | kJ/mol | negativna: eksotermna reakcija
q_p | toplota pri stalnem tlaku | | J
\Delta_\mathrm{r} | sprememba pri reakciji (reakcijska količina) | | | ΔᵣH°: standardna reakcijska entalpija
\Delta_\mathrm{f} | sprememba pri nastanku spojine iz elementov | | | ΔfH°: standardna tvorbena entalpija
H | entalpija | H = U + pV | J | ΔᵣH°: reakcijska, ΔfH°: standardna tvorbena entalpija (kJ/mol)
U | notranja energija | | J | funkcija stanja
\Delta H_\text{celotna} | entalpija celotne reakcije | \Delta H_\text{celotna} = \Delta H_1 + \Delta H_2 + \dots | kJ/mol | Hessov zakon
\Delta H_1, \Delta H_2 | entalpiji posameznih stopenj | | kJ/mol
\nu | stehiometrični koeficient snovi | | –
m | masa snovi (raztopine) | | g
c_p | specifična toplota | | J/(g K) | za vodo 4,18 J/(g K)
C | toplotna kapaciteta kalorimetra | q = C ΔT | kJ/K
T | absolutna temperatura | | K
T_1, T_2 | temperaturi, med katerima preračunamo ΔᵣH° | | K
\Delta n_\mathrm{g} | sprememba množine plinov | | mol
R | splošna plinska konstanta | | J/(mol K) | RT = 2,48 kJ/mol pri 298 K
C_p | toplotna kapaciteta pri stalnem tlaku | | J/K | ΔᵣCp°: razlika kapacitet produktov in reaktantov
C_{p,\mathrm{m}} | molska toplotna kapaciteta pri stalnem tlaku | | J/(mol K)
n | množina snovi | n = \frac{m}{M} | mol
M | molska masa | | g/mol
:::
