---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Avtomobilski motor in plinska turbina v elektrarni sta si na videz povsem tuja: prvi ima bat, ki se tisočkrat na minuto premika gor in dol, druga ima lopatice, ki se vrtijo v enem kosu. A oba počneta isto zaporedje. Hladen zrak najprej stisneta, nato ga močno segrejeta, vroč plin se razširi in odda delo, ostanek toplote pa gre v okolico. Po koncu je delovna snov spet tam, kjer je začela.

Takemu zaporedju rečemo **krožni proces**. Kdor ga razume, zna odgovoriti na vprašanja, ki jih postavlja konstruktor: koliko dela da kilogram zraka, kolikšen del toplote goriva postane delo in kaj omejuje oboje. Pri obeh strojih je odgovor presenetljivo povezan z materiali: z najvišjim tlakom, ki ga zdrži glava valja, in z najvišjo temperaturo, ki jo zdržijo lopatice turbine.

Potrebuješ prvi zakon termodinamike, adiabatne spremembe idealnega plina in Carnotovo mejo iz drugega zakona.

## Razlaga

**1. Mamljiva napačna zamisel.** Zdi se samoumevno: več toplote dovedemo in bolj vroče gorivo zgori, večji je izkoristek motorja. Ta lekcija pokaže, da to pri idealnem Ottovem motorju **ne drži**: izkoristek je odvisen le od tega, kolikokrat zrak stisnemo. Več toplote da več dela, ne pa boljšega razmerja. Temperatura je pomembna drugje, pri plinski turbini, in tam jo omejuje material.

**2. Definicija.** **Krožni proces** je zaporedje sprememb stanja, po katerem se delovna snov vrne v začetno stanje. Ker je notranja energija funkcija stanja, je po enem obhodu $\Delta U = 0$. Iz prvega zakona sledi, da je opravljeno delo enako razliki toplot:

$$w = q_\mathrm{dov} - q_\mathrm{odv}.$$

Tu so $q_\mathrm{dov}$, $q_\mathrm{odv}$ in $w$ **specifične** količine (na kilogram delovne snovi) in vse tri pozitivne. **Termični izkoristek** je

$$\eta = \frac{w}{q_\mathrm{dov}} = 1 - \frac{q_\mathrm{odv}}{q_\mathrm{dov}}.$$

Drugi zakon postavi zgornjo mejo: noben proces, ki dobiva toploto največ pri $T_\mathrm{max}$ in jo oddaja vsaj pri $T_\mathrm{min}$, ne preseže Carnotovega izkoristka $1 - \frac{T_\mathrm{min}}{T_\mathrm{max}}$.

**3. Zračni standardni proces.** Pravi motor sesa zrak, zgoreva gorivo in izpušča pline. Za račun ga nadomestimo z idealizacijo: delovna snov je zrak kot idealni plin s stalnima $c_p = 1{,}005\,\mathrm{kJ/(kg\,K)}$ in $c_v = 0{,}718\,\mathrm{kJ/(kg\,K)}$ ter $\kappa = 1{,}4$; zgorevanje je dovajanje toplote od zunaj; izpuh je oddajanje toplote; kompresija in ekspanzija sta povračljivi adiabatni (izentropni). Za adiabato velja $Tv^{\kappa - 1} = \mathrm{konst.}$ in $Tp^{(1-\kappa)/\kappa} = \mathrm{konst.}$

**4. Ottov proces** (bencinski motor). Štiri spremembe:

- 1–2 adiabatna kompresija,
- 2–3 izohorno dovajanje toplote (iskra, zelo hitro zgorevanje),
- 3–4 adiabatna ekspanzija (delovni gib),
- 4–1 izohorno oddajanje toplote (izpuh).

```
p
|  3
|  |\
|  | \_
|  |   \__
|  2      \__ 4
|   \_       |
|     \__    |
|        \__ 1
+-------------- V
   V2       V1
```

**Kompresijsko razmerje** je $\varepsilon = \frac{V_1}{V_2}$.

**Izpeljava.** Pri izohorah je $q_\mathrm{dov} = c_v(T_3 - T_2)$ in $q_\mathrm{odv} = c_v(T_4 - T_1)$. Obe adiabati potekata med istima prostorninama, zato $T_2 = T_1\varepsilon^{\kappa-1}$ in $T_3 = T_4\varepsilon^{\kappa-1}$. Od tod $T_3 - T_2 = \varepsilon^{\kappa-1}(T_4 - T_1)$ in

$$\eta_\mathrm{O} = 1 - \frac{1}{\varepsilon^{\kappa - 1}}.$$

V formuli ni ne $T_3$ ne $q_\mathrm{dov}$. S tem je napačna zamisel iz točke 1 popravljena: izkoristek določa samo $\varepsilon$. Navzgor ga omejuje samovžig mešanice (klenkanje), zato imajo bencinski motorji $\varepsilon \approx 10$–$13$.

:::premisli
V isti motor z $\varepsilon = 9$ dovedemo enkrat $600\,\mathrm{kJ/kg}$, drugič $1200\,\mathrm{kJ/kg}$ toplote. Kaj se zgodi z izkoristkom, z delom in z najvišjim tlakom v valju?
---
Izkoristek ostane $0{,}585$, ker je odvisen le od $\varepsilon$. Delo se podvoji ($w = \eta q_\mathrm{dov}$). Najvišji tlak $p_3$ močno naraste, ker je $T_3$ višja pri isti prostornini $V_2$. Prav ta tlak mora zdržati glava valja.
:::

**5. Dieslov proces.** Dizelski motor stisne samo zrak, tako močno, da se vbrizgano gorivo vžge samo ($\varepsilon \approx 15$–$22$). Gorivo zgoreva med premikom bata, zato je dovajanje toplote 2–3 **izobarno**; ostale tri spremembe so kot pri Ottu. **Razmerje izobarnega raztezanja** je $\varphi = \frac{V_3}{V_2}$.

**Izpeljava.** Zdaj je $q_\mathrm{dov} = c_p(T_3 - T_2)$, $q_\mathrm{odv} = c_v(T_4 - T_1)$. Iz izobare je $T_3 = \varphi T_2$; adiabata 3–4 pelje od $V_3 = \varphi V_2$ do $V_1 = \varepsilon V_2$, zato $T_4 = T_3\left(\frac{\varphi}{\varepsilon}\right)^{\kappa-1} = T_1\varphi^\kappa$. Ko vstavimo:

$$\eta_\mathrm{D} = 1 - \frac{1}{\varepsilon^{\kappa-1}} \cdot \frac{\varphi^\kappa - 1}{\kappa(\varphi - 1)}.$$

Drugi faktor je za $\varphi > 1$ večji od $1$ (glej Nalogo 2). Pri **enakem** $\varepsilon$ je Diesel torej slabši od Otta; v praksi je boljši, ker sme imeti skoraj dvakrat večji $\varepsilon$.

**6. Jouleov proces** (plinska turbina, v angleški literaturi Braytonov). Zrak teče skozi stroje neprekinjeno: kompresor (1–2 adiabatno), zgorevalna komora (2–3 izobarno), turbina (3–4 adiabatno), oddajanje toplote (4–1 izobarno). **Tlačno razmerje** je $r_p = \frac{p_2}{p_1}$ (ponekod označeno s $\pi$).

**Izpeljava.** Obe toploti sta izobarni, $q_\mathrm{dov} = c_p(T_3 - T_2)$ in $q_\mathrm{odv} = c_p(T_4 - T_1)$. Adiabati potekata med istima tlakoma, zato $\frac{T_2}{T_1} = \frac{T_3}{T_4} = r_p^{(\kappa-1)/\kappa}$ in

$$\eta_\mathrm{J} = 1 - \frac{1}{r_p^{(\kappa-1)/\kappa}} = 1 - \frac{T_1}{T_2}.$$

Tudi tu izkoristek ni odvisen od $T_3$. Toda specifično delo je:

$$w = c_p\big[(T_3 - T_4) - (T_2 - T_1)\big].$$

Kompresor porabi velik del dela turbine. Če je $T_3$ nizka, pri visokem $r_p$ ne ostane nič. **Izrek (največje delo).** Pri danih $T_1$ in $T_3$ je $w$ največje, ko je $T_2 = T_4 = \sqrt{T_1T_3}$; tedaj $w_\mathrm{max} = c_p\left(\sqrt{T_3} - \sqrt{T_1}\right)^2$. Dokaz je Naloga 1. Višja dopustna $T_3$ (boljši material lopatic) torej dovoli višji optimalni $r_p$ in s tem višji izkoristek. Tu se temperatura res splača, a posredno.

**7. Rankinov proces** (parna elektrarna). Delovna snov je voda, ki se med obhodom upari in kondenzira:

- 1–2 napajalna črpalka stisne kapljevino na tlak kotla (adiabatno),
- 2–3 v kotlu se voda pri stalnem tlaku segreje, upari in pregreje,
- 3–4 para se adiabatno razširi v turbini do tlaka kondenzatorja (nastane mokra para),
- 4–1 v kondenzatorju para pri stalnem tlaku kondenzira do vrele kapljevine.

Para ni idealni plin, zato beremo entalpije $h$ in entropije $s$ iz parnih tabel. Za stroje s pretokom (prvi zakon za odprt sistem) je delo enako padcu entalpije, toplota pri stalnem tlaku pa porastu entalpije:

$$\eta_\mathrm{R} = \frac{(h_3 - h_4) - (h_2 - h_1)}{h_3 - h_2}.$$

Pri izentropni ekspanziji je $s_4 = s_3$. Iz tega določimo **suhost** $x_4$ (masni delež pare) in $h_4 = h' + x_4(h'' - h')$, kjer sta $h'$ in $h''$ entalpiji vrele kapljevine in suhe pare. Delo črpalke je majhno: $w_\mathrm{č} \approx v'(p_2 - p_1)$.

:::premisli
Zakaj parna elektrarna stiska vodo kot kapljevino in ne kot paro? Kaj bi se zgodilo z izkoristkom, če bi paro stiskali s kompresorjem kot plinska turbina?
---
Delo stiskanja je $\int v\,dp$; kapljevina ima okoli tisočkrat manjšo specifično prostornino kot para, zato črpalka porabi le nekaj kJ/kg. Pri stiskanju pare bi kompresor požrl velik del dela turbine, kot pri Jouleovem procesu, in izkoristek bi močno padel.
:::

**8. Pregled štirih procesov.**

| Proces | Dovajanje | Oddajanje |
|---|---|---|
| Otto | izohorno | izohorno |
| Diesel | izobarno | izohorno |
| Joule | izobarno | izobarno |
| Rankine | izobarno, z uparjanjem | izobarno, s kondenzacijo |

Pri vseh je kompresija in ekspanzija idealno adiabatna.

## Rešeni primeri

### Primer 1 (lažji)

Idealni Ottov motor ima kompresijsko razmerje $9$. Na kilogram zraka mu dovedemo $900\,\mathrm{kJ}$ toplote. Določi izkoristek, specifično delo in oddano toploto.

**Podatki:** $\varepsilon = 9$, $q_\mathrm{dov} = 900\,\mathrm{kJ/kg}$, $\kappa = 1{,}4$
**Iščemo:** $\eta$, $w$, $q_\mathrm{odv}$

:::formula
$\eta_\mathrm{O} = 1 - \frac{1}{\varepsilon^{\kappa-1}}$; $w = \eta\,q_\mathrm{dov}$; $q_\mathrm{odv} = q_\mathrm{dov} - w$
:::

**Rešitev:**

1. Eksponent je $\kappa - 1 = 0{,}4$, zato $9^{0{,}4} = 2{,}408$.
2. Izkoristek: $\eta = 1 - \frac{1}{2{,}408} = 0{,}585$.
3. Delo: $w = 0{,}5848 \cdot 900\,\mathrm{kJ/kg} = 526{,}3\,\mathrm{kJ/kg}$.
4. Oddana toplota: $q_\mathrm{odv} = 900 - 526{,}3 = 373{,}7\,\mathrm{kJ/kg}$.
5. Odgovor: izkoristek je $58{,}5\,\%$, motor odda $526\,\mathrm{kJ}$ dela in $374\,\mathrm{kJ}$ toplote na kilogram zraka.

### Primer 2

Parna elektrarna dela po idealnem Rankinovem procesu. Para vstopa v turbino s tlakom $40\,\mathrm{bar}$ in temperaturo $400\,\mathrm{°C}$, kjer je $h_3 = 3213{,}6\,\mathrm{kJ/kg}$ in $s_3 = 6{,}769\,\mathrm{kJ/(kg\,K)}$. V kondenzatorju je tlak $0{,}1\,\mathrm{bar}$; tam je $h' = 191{,}8\,\mathrm{kJ/kg}$, $h'' - h' = 2392{,}8\,\mathrm{kJ/kg}$, $s' = 0{,}6493\,\mathrm{kJ/(kg\,K)}$, $s'' - s' = 7{,}5009\,\mathrm{kJ/(kg\,K)}$ in $v' = 0{,}00101\,\mathrm{m^3/kg}$. Določi suhost pare na izstopu turbine in izkoristek.

**Podatki:** $p_3 = 40\,\mathrm{bar}$, $h_3 = 3213{,}6\,\mathrm{kJ/kg}$, $s_3 = 6{,}769\,\mathrm{kJ/(kg\,K)}$; $p_1 = 0{,}1\,\mathrm{bar}$, $h' = 191{,}8\,\mathrm{kJ/kg}$, $h'' - h' = 2392{,}8\,\mathrm{kJ/kg}$, $s' = 0{,}6493\,\mathrm{kJ/(kg\,K)}$, $s'' - s' = 7{,}5009\,\mathrm{kJ/(kg\,K)}$, $v' = 0{,}00101\,\mathrm{m^3/kg}$
**Iščemo:** $x_4$, $\eta_\mathrm{R}$

:::formula
$s_4 = s_3$, $x_4 = \frac{s_4 - s'}{s'' - s'}$, $h_4 = h' + x_4(h'' - h')$; $w_\mathrm{č} = v'(p_2 - p_1)$; $\eta_\mathrm{R} = \frac{(h_3 - h_4) - w_\mathrm{č}}{h_3 - h_2}$
:::

**Rešitev:**

1. Ekspanzija je izentropna: $x_4 = \frac{6{,}769 - 0{,}6493}{7{,}5009} = 0{,}816$.
2. Entalpija na izstopu: $h_4 = 191{,}8 + 0{,}8159 \cdot 2392{,}8 = 2144{,}0\,\mathrm{kJ/kg}$.
3. Delo turbine: $h_3 - h_4 = 3213{,}6 - 2144{,}0 = 1069{,}6\,\mathrm{kJ/kg}$.
4. Delo črpalke ($1\,\mathrm{bar} = 100\,\mathrm{kPa}$, razlika tlakov $3990\,\mathrm{kPa}$): $w_\mathrm{č} = 0{,}00101 \cdot 3990 = 4{,}03\,\mathrm{kJ/kg}$.
5. Za črpalko je $h_2 = h' + w_\mathrm{č} = 195{,}8\,\mathrm{kJ/kg}$; v kotlu se dovede $q_\mathrm{dov} = 3213{,}6 - 195{,}8 = 3017{,}8\,\mathrm{kJ/kg}$.
6. Izkoristek: $\eta_\mathrm{R} = \frac{1069{,}6 - 4{,}03}{3017{,}8} = 0{,}353$.
7. Odgovor: na izstopu turbine je $81{,}6\,\%$ pare (ostalo so kapljice), izkoristek je $35{,}3\,\%$. Črpalka porabi manj kot $0{,}4\,\%$ dela turbine.

### Primer 3 (težji)

Idealni Dieslov motor sesa zrak s tlakom $1\,\mathrm{bar}$ in temperaturo $300\,\mathrm{K}$; kompresijsko razmerje je $18$. Zaradi materiala bata in ventilov najvišja temperatura ne sme preseči $2000\,\mathrm{K}$. Določi temperature in tlak v značilnih točkah, specifično delo in izkoristek. Primerjaj s Carnotovim izkoristkom med $300\,\mathrm{K}$ in $2000\,\mathrm{K}$ ter z Ottovim pri enakem $\varepsilon$.

**Podatki:** $p_1 = 1\,\mathrm{bar}$, $T_1 = 300\,\mathrm{K}$, $\varepsilon = 18$, $T_3 = 2000\,\mathrm{K}$, $c_p = 1{,}005\,\mathrm{kJ/(kg\,K)}$, $c_v = 0{,}718\,\mathrm{kJ/(kg\,K)}$, $\kappa = 1{,}4$
**Iščemo:** $T_2$, $p_2$, $\varphi$, $T_4$, $w$, $\eta$

:::formula
$T_2 = T_1\varepsilon^{\kappa-1}$, $p_2 = p_1\varepsilon^\kappa$; $\varphi = \frac{T_3}{T_2}$; $T_4 = T_1\varphi^\kappa$; $q_\mathrm{dov} = c_p(T_3 - T_2)$, $q_\mathrm{odv} = c_v(T_4 - T_1)$
:::

**Rešitev:**

1. Adiabatna kompresija: $18^{0{,}4} = 3{,}178$, zato $T_2 = 300 \cdot 3{,}178 = 953{,}3\,\mathrm{K}$.
2. Tlak po kompresiji: $p_2 = 1\,\mathrm{bar} \cdot 18^{1{,}4} = 57{,}2\,\mathrm{bar}$. Ta tlak ostane med vso izobaro 2–3.
3. Iz izobare: $\varphi = \frac{2000}{953{,}3} = 2{,}098$.
4. Po ekspanziji: $T_4 = 300 \cdot 2{,}098^{1{,}4} = 846{,}5\,\mathrm{K}$. (Preizkus po adiabati: $T_4 = 2000\left(\frac{2{,}098}{18}\right)^{0{,}4}$ da isto.)
5. Dovedena toplota: $q_\mathrm{dov} = 1{,}005 \cdot (2000 - 953{,}3) = 1051{,}9\,\mathrm{kJ/kg}$.
6. Oddana toplota: $q_\mathrm{odv} = 0{,}718 \cdot (846{,}5 - 300) = 392{,}4\,\mathrm{kJ/kg}$.
7. Delo in izkoristek: $w = 1051{,}9 - 392{,}4 = 659{,}5\,\mathrm{kJ/kg}$, $\eta = \frac{659{,}5}{1051{,}9} = 0{,}627$.
8. Carnot: $1 - \frac{300}{2000} = 0{,}85$. Otto pri $\varepsilon = 18$: $1 - \frac{1}{3{,}178} = 0{,}685$.
9. Odgovor: $T_2 = 953\,\mathrm{K}$, $p_2 = 57{,}2\,\mathrm{bar}$, $\varphi = 2{,}10$, $T_4 = 847\,\mathrm{K}$; $w = 660\,\mathrm{kJ/kg}$ in $\eta = 62{,}7\,\%$. To je manj od Carnotove meje ($85\,\%$), ker toplota ne prihaja ves čas pri $2000\,\mathrm{K}$, in manj od Otta pri enakem $\varepsilon$ (izobarno dovajanje).

### Primer 4 – zdaj ti

Plinska turbina dela po idealnem Jouleovem procesu s tlačnim razmerjem $10$. Zrak vstopa v kompresor pri $300\,\mathrm{K}$, v turbino pri $1300\,\mathrm{K}$. Določi izkoristek in specifično delo.

**Podatki:** $r_p = 10$, $T_1 = 300\,\mathrm{K}$, $T_3 = 1300\,\mathrm{K}$, $c_p = 1{,}005\,\mathrm{kJ/(kg\,K)}$, $\kappa = 1{,}4$
**Iščemo:** $\eta_\mathrm{J}$, $w$

:::formula
$\frac{T_2}{T_1} = \frac{T_3}{T_4} = r_p^{(\kappa-1)/\kappa}$; $w = c_p\big[(T_3 - T_4) - (T_2 - T_1)\big]$
:::

**Rešitev:**

1. Razmerje temperatur: $10^{0{,}2857} = 1{,}931$.
2. Po kompresorju: $T_2 = 300 \cdot 1{,}931 = 579{,}2\,\mathrm{K}$; izkoristek $\eta = 1 - \frac{300}{579{,}2} = 0{,}482$.
3. Izračunaj $T_4$, delo turbine in kompresorja ter $w$. Kolikšen del dela turbine porabi kompresor?

:::premisli
Kolikšna sta $T_4$ in $w$?
---
$T_4 = \frac{1300}{1{,}931} = 673{,}3\,\mathrm{K}$. Turbina: $1{,}005 \cdot (1300 - 673{,}3) = 629{,}8\,\mathrm{kJ/kg}$; kompresor: $1{,}005 \cdot (579{,}2 - 300) = 280{,}6\,\mathrm{kJ/kg}$; $w = 349{,}2\,\mathrm{kJ/kg}$. Kompresor porabi $45\,\%$ dela turbine.
:::

## Pogoste napake

- **»Več toplote, večji izkoristek.«** Pri Ottovem in Jouleovem procesu $\eta$ ni odvisen od $q_\mathrm{dov}$ ali $T_3$; več toplote da le več dela. Najprej poglej, kaj je v formuli za $\eta$.
- **Napačna specifična toplota.** Pri izohori je $q = c_v\Delta T$, pri izobari $q = c_p\Delta T$. Pri Dieslu je dovajanje izobarno, oddajanje izohorno; kdor obakrat vzame $c_v$, dobi napačen $\eta$.
- **Zamenjana razmerja.** Pri Ottu je $\frac{T_2}{T_1} = \varepsilon^{\kappa-1}$ (razmerje prostornin), pri Jouleu $\frac{T_2}{T_1} = r_p^{(\kappa-1)/\kappa}$ (razmerje tlakov). Pri $r_p = 10$ je $10^{0{,}4} = 2{,}51$ napačno, pravilno je $1{,}93$.
- **Stopinje Celzija.** V adiabatah in Carnotovi meji so temperature v kelvinih. $T_1 = 27\,\mathrm{°C}$ vstavi kot $300\,\mathrm{K}$.
- **Carnotova meja kot dejanski izkoristek.** $1 - \frac{T_\mathrm{min}}{T_\mathrm{max}}$ velja le, če vso toploto dovajamo pri $T_\mathrm{max}$. Otto, Diesel in Joule dovajajo toploto pri naraščajoči temperaturi, zato so slabši.
- **Rankine brez entropije.** $h_4$ ni $h''$ pri tlaku kondenzatorja; para iz turbine je mokra. Suhost dobiš iz $s_4 = s_3$, ne iz entalpije.

## Povzetek

- Krožni proces: $\Delta U = 0$, $w = q_\mathrm{dov} - q_\mathrm{odv}$, $\eta = 1 - \frac{q_\mathrm{odv}}{q_\mathrm{dov}}$, zgornja meja je Carnot.
- Otto (2 adiabati, 2 izohori): $\eta = 1 - \varepsilon^{1-\kappa}$, odvisen le od kompresijskega razmerja.
- Diesel (izobarno dovajanje): $\eta = 1 - \varepsilon^{1-\kappa}\frac{\varphi^\kappa - 1}{\kappa(\varphi - 1)}$; pri enakem $\varepsilon$ slabši od Otta, v praksi boljši zaradi večjega $\varepsilon$.
- Joule (2 adiabati, 2 izobari): $\eta = 1 - r_p^{(1-\kappa)/\kappa}$; največje delo pri $T_2 = \sqrt{T_1T_3}$.
- Rankine (para): $\eta = \frac{(h_3 - h_4) - (h_2 - h_1)}{h_3 - h_2}$; $x_4$ iz $s_4 = s_3$; črpalka porabi malo, ker stiska kapljevino.

## Za izpit

Znati moraš povedati:

- definicijo krožnega procesa, termičnega izkoristka in Carnotove meje,
- predpostavke zračnega standardnega procesa,
- zaporedje sprememb in diagram $p$–$V$ za Ottov, Dieslov in Jouleov proces, za Rankinov tudi vlogo štirih naprav,
- izpeljavo izkoristkov Otta, Diesla in Jouleja,
- pogoj za največje delo Jouleovega procesa in dokaz.

### Naloga 1

Lopatice plinske turbine iz nikljeve superzlitine zdržijo vstopno temperaturo plina $1400\,\mathrm{K}$; zrak vstopa v kompresor pri $290\,\mathrm{K}$. (a) Dokaži, da je pri danih $T_1$ in $T_3$ specifično delo idealnega Jouleovega procesa največje pri $T_2 = \sqrt{T_1T_3}$. (b) Izračunaj optimalno tlačno razmerje, največje delo in izkoristek pri tem razmerju. (c) Keramična zaščitna plast dovoli $1600\,\mathrm{K}$. Za koliko odstotkov se poveča največje delo in kolikšen je novi izkoristek? Vzemi $c_p = 1{,}005\,\mathrm{kJ/(kg\,K)}$, $\kappa = 1{,}4$.

**Rešitev:**

1. Označimo $a = \frac{T_2}{T_1} = \frac{T_3}{T_4}$. Tedaj $T_4 = \frac{T_3}{a}$ in $w(a) = c_p\left[T_3\left(1 - \frac1a\right) - T_1(a - 1)\right]$.
2. Odvod: $w'(a) = c_p\left(\frac{T_3}{a^2} - T_1\right)$, ničla pri $a = \sqrt{T_3/T_1}$; $w''(a) = -\frac{2c_pT_3}{a^3} < 0$, torej maksimum.
3. Tedaj $T_2 = T_1a = \sqrt{T_1T_3}$ in $T_4 = \frac{T_3}{a} = \sqrt{T_1T_3}$. Vstavimo: $w_\mathrm{max} = c_p\left(T_3 - 2\sqrt{T_1T_3} + T_1\right) = c_p\left(\sqrt{T_3} - \sqrt{T_1}\right)^2$. S tem je (a) dokazano.
4. (b) $T_2 = \sqrt{290 \cdot 1400} = 637{,}2\,\mathrm{K}$; ker je $r_p = a^{\kappa/(\kappa-1)}$, je $r_p = \left(\frac{1400}{290}\right)^{1{,}75} = 15{,}7$.
5. $w_\mathrm{max} = 1{,}005 \cdot (37{,}417 - 17{,}029)^2 = 417{,}7\,\mathrm{kJ/kg}$.
6. Izkoristek: $\eta = 1 - \frac{290}{637{,}2} = 0{,}545$.
7. (c) Pri $T_3 = 1600\,\mathrm{K}$: $T_2 = \sqrt{290 \cdot 1600} = 681{,}2\,\mathrm{K}$, $r_p = \left(\frac{1600}{290}\right)^{1{,}75} = 19{,}9$.
8. $w_\mathrm{max} = 1{,}005 \cdot (40 - 17{,}029)^2 = 530{,}3\,\mathrm{kJ/kg}$, kar je $\frac{530{,}3}{417{,}7} = 1{,}27$-krat več.
9. Novi izkoristek: $\eta = 1 - \frac{290}{681{,}2} = 0{,}574$.
10. Odgovor: optimum je pri $r_p \approx 15{,}7$ z $w = 418\,\mathrm{kJ/kg}$ in $\eta = 54{,}5\,\%$; s keramično plastjo je optimum pri $r_p \approx 19{,}9$, delo zraste za $27\,\%$ na $530\,\mathrm{kJ/kg}$, izkoristek na $57{,}4\,\%$. Boljši material se pozna predvsem pri delu, torej pri manjši in lažji turbini za isto moč.

### Naloga 2

(a) Izpelji izkoristek idealnega Ottovega procesa. (b) Utemelji, da je pri enakem kompresijskem razmerju idealni Dieslov proces slabši od Ottovega, tj. da je $\frac{\varphi^\kappa - 1}{\kappa(\varphi - 1)} > 1$ za $\varphi > 1$ in $\kappa > 1$.

**Rešitev:**

1. (a) Toploti: $q_\mathrm{dov} = c_v(T_3 - T_2)$, $q_\mathrm{odv} = c_v(T_4 - T_1)$, zato $\eta = 1 - \frac{T_4 - T_1}{T_3 - T_2}$.
2. Adiabati 1–2 in 3–4 potekata med $V_1$ in $V_2$: iz $TV^{\kappa-1} = \mathrm{konst.}$ je $T_2 = T_1\varepsilon^{\kappa-1}$ in $T_3 = T_4\varepsilon^{\kappa-1}$.
3. Odštejemo: $T_3 - T_2 = \varepsilon^{\kappa-1}(T_4 - T_1)$, torej $\eta_\mathrm{O} = 1 - \varepsilon^{1-\kappa}$.
4. (b) Naj bo $g(\varphi) = \varphi^\kappa - 1 - \kappa(\varphi - 1)$. Velja $g(1) = 0$.
5. Odvod: $g'(\varphi) = \kappa\left(\varphi^{\kappa-1} - 1\right)$, ki je za $\varphi > 1$ in $\kappa > 1$ pozitiven.
6. Zato je $g(\varphi) > 0$ za $\varphi > 1$, torej $\varphi^\kappa - 1 > \kappa(\varphi - 1)$ in kvocient je večji od $1$ (to je Bernoullijeva neenakost).
7. Odgovor: $\eta_\mathrm{D} = 1 - \varepsilon^{1-\kappa} \cdot (\text{faktor} > 1) < \eta_\mathrm{O}$. Fizikalno: pri izobarnem dovajanju se plin med segrevanjem že razteza, zato del toplote pride pri manjši »stisnjenosti« in se slabše izkoristi.

### Naloga 3

Bencinski motor z $\varepsilon = 10$ sesa zrak pri $1\,\mathrm{bar}$ in $300\,\mathrm{K}$. Glava valja dopušča največji tlak $80\,\mathrm{bar}$. Koliko toplote na kilogram zraka smemo največ dovesti v idealnem Ottovem procesu, kolikšno je tedaj delo in kolikšna temperatura izpuha $T_4$? Vzemi $c_v = 0{,}718\,\mathrm{kJ/(kg\,K)}$, $\kappa = 1{,}4$.

**Rešitev:**

1. Po kompresiji: $T_2 = 300 \cdot 10^{0{,}4} = 753{,}6\,\mathrm{K}$ in $p_2 = 10^{1{,}4}\,\mathrm{bar} = 25{,}12\,\mathrm{bar}$.
2. Izohora 2–3: $\frac{p_3}{T_3} = \frac{p_2}{T_2}$, zato pri $p_3 = 80\,\mathrm{bar}$ dobimo $T_3 = 753{,}6 \cdot \frac{80}{25{,}12} = 2400\,\mathrm{K}$.
3. Največja toplota: $q_\mathrm{dov} = 0{,}718 \cdot (2400 - 753{,}6) = 1182\,\mathrm{kJ/kg}$.
4. Izkoristek je $\eta = 1 - \frac{1}{2{,}512} = 0{,}602$, zato $w = 0{,}6019 \cdot 1182 = 711{,}5\,\mathrm{kJ/kg}$.
5. Izpuh: $T_4 = \frac{2400}{2{,}512} = 955{,}4\,\mathrm{K}$.
6. Odgovor: dovedemo lahko največ približno $1180\,\mathrm{kJ/kg}$, delo je $712\,\mathrm{kJ/kg}$, plin pred izpuhom ima okoli $955\,\mathrm{K}$. Meja tlaka omeji delo na cikel, izkoristka pa ne.

## Drugače: Uporaba v stroki

- **Motorji vozil.** Bencinski motorji imajo $\varepsilon \approx 10$–$13$ zaradi klenkanja; dizelski $15$–$22$ in zato manjšo porabo. Glave valjev iz aluminijevih zlitin in bati morajo zdržati tlake okoli $100$–$200\,\mathrm{bar}$.
- **Plinske turbine in letalski motorji.** Vstopna temperatura turbine je glavni podatek motorja. Lopatice iz monokristalnih nikljevih superzlitin s keramično toplotno zaporo in notranjim hlajenjem z zrakom zdržijo plin, ki je bistveno bolj vroč od tališča kovine. Vsak dvig $T_3$ pomeni več dela na kilogram zraka.
- **Kombinirane elektrarne.** Izpuh plinske turbine (okoli $600\,\mathrm{°C}$) segreva paro za Rankinov proces. Skupaj dosežejo izkoristek okoli $60\,\%$, več kot vsak proces posebej.
- **Termoelektrarne in jedrske elektrarne.** Obe uporabljata Rankinov proces; razlikuje se le vir toplote. Jedrske elektrarne z lahkovodnimi reaktorji imajo nižjo temperaturo pare in izkoristek okoli tretjine, sodobni bloki z nadkritično paro pa okoli $45\,\%$.

## Drugače: Korak za korakom s številkami

Ottov proces z $\varepsilon = 8$, $p_1 = 1\,\mathrm{bar}$, $T_1 = 300\,\mathrm{K}$ in $q_\mathrm{dov} = 1000\,\mathrm{kJ/kg}$, točko za točko:

1. $T_2 = 300 \cdot 8^{0{,}4} = 689{,}2\,\mathrm{K}$, $p_2 = 8^{1{,}4}\,\mathrm{bar} = 18{,}38\,\mathrm{bar}$.
2. Izohorno dovajanje: $T_3 = 689{,}2 + \frac{1000}{0{,}718} = 2082\,\mathrm{K}$; $p_3 = 18{,}38 \cdot \frac{2082}{689{,}2} = 55{,}5\,\mathrm{bar}$.
3. Ekspanzija: $T_4 = \frac{2082}{2{,}297} = 906{,}4\,\mathrm{K}$; $p_4 = \frac{55{,}5}{18{,}38} = 3{,}02\,\mathrm{bar}$.
4. Oddana toplota: $q_\mathrm{odv} = 0{,}718 \cdot (906{,}4 - 300) = 435{,}4\,\mathrm{kJ/kg}$.
5. Delo $w = 1000 - 435{,}4 = 564{,}6\,\mathrm{kJ/kg}$, izkoristek $0{,}565$.
6. Preizkus s formulo: $1 - \frac{1}{2{,}297} = 0{,}565$. Ujema se, kot mora.

Opazi: $\frac{T_4}{T_1} = \frac{T_3}{T_2}$. To je razlog, da se temperature v formuli za izkoristek pokrajšajo.

## Drugače: Bolj natančno

**Srednja temperatura dovajanja.** Za povračljiv proces je $q_\mathrm{dov} = \int T\,ds$. Če vpeljemo srednji temperaturi $\bar T_\mathrm{dov} = \frac{q_\mathrm{dov}}{\Delta s}$ in $\bar T_\mathrm{odv} = \frac{q_\mathrm{odv}}{\Delta s}$, velja za vsak krožni proces z dvema adiabatama $\eta = 1 - \frac{\bar T_\mathrm{odv}}{\bar T_\mathrm{dov}}$. Vse izboljšave elektrarn so poskusi, da bi $\bar T_\mathrm{dov}$ dvignili ali $\bar T_\mathrm{odv}$ znižali: višji tlak kotla, pregrevanje in vmesno pregrevanje pare, regenerativno predgrevanje napajalne vode z odvzemno paro, nižji tlak v kondenzatorju.

**Realni stroji.** Kompresija in ekspanzija nista povračljivi. Upoštevamo ju z **notranjim izkoristkom** (izentropnim izkoristkom), na primer pri turbini $\eta_\mathrm{T} = \frac{h_3 - h_4}{h_3 - h_{4s}}$. Pri Jouleovem procesu je to usodno: zaradi velikega dela kompresorja že nekaj odstotkov izgub močno zmanjša koristno delo. Pri natančnem računu se spreminjata tudi $c_p$ in $\kappa$ s temperaturo, sestava plina pa se po zgorevanju spremeni.

## Preveri se

? V letalskem motorju zrak stisne kompresor, v zgorevalni komori se segreje pri skoraj stalnem tlaku, nato se razširi v turbini in šobi; izpušni plini oddajo toploto okolici pri tlaku okolice. Kateri idealni krožni proces opisuje motor?
- Ottov proces
~ Ottov proces ima izohorno dovajanje toplote v zaprtem valju; tu zrak teče skozi komoro pri stalnem tlaku.
- Dieslov proces
~ Dieslov proces ima sicer izobarno dovajanje, a izohorno oddajanje v valju z batom; tu je tudi oddajanje izobarno.
+ Jouleov proces
- Rankinov proces
~ Rankinov proces ima delovno snov, ki se upari in kondenzira; zrak tu ostane plin.
> Dve adiabati (kompresor, turbina) in dve izobari (zgorevalna komora, oddajanje pri tlaku okolice) so Jouleov (Braytonov) proces.

? Razvrsti idealne procese po izkoristku od največjega do najmanjšega: Otto z $\varepsilon = 8$, Diesel z $\varepsilon = 18$ in $\varphi = 2$, Joule z $r_p = 10$ (povsod $\kappa = 1{,}4$).
- Otto, Diesel, Joule
~ Pri enakem $\varepsilon$ bi bil Otto boljši, a tu ima Diesel več kot dvakrat večje kompresijsko razmerje.
+ Diesel, Otto, Joule
- Joule, Diesel, Otto
~ Tlačno razmerje $10$ ni kompresijsko razmerje; temperaturno razmerje je le $10^{0{,}2857} = 1{,}93$.
- Diesel, Joule, Otto
~ Joule z $r_p = 10$ ima $\eta = 0{,}482$, Otto z $\varepsilon = 8$ pa $0{,}565$.
> $\eta_\mathrm{D} = 0{,}632$, $\eta_\mathrm{O} = 1 - 8^{-0{,}4} = 0{,}565$, $\eta_\mathrm{J} = 1 - 10^{-0{,}2857} = 0{,}482$.

? Kaj se zgodi v idealni plinski turbini s stalnim tlačnim razmerjem, če nove lopatice dovolijo višjo vstopno temperaturo $T_3$?
- Izkoristek se poveča, delo ostane enako.
~ Izkoristek $1 - r_p^{(1-\kappa)/\kappa}$ ne vsebuje $T_3$; pri stalnem $r_p$ se ne spremeni.
+ Izkoristek ostane enak, specifično delo se poveča.
- Izkoristek in delo ostaneta enaka.
~ Delo turbine $c_p(T_3 - T_4)$ zraste, delo kompresorja ne, zato koristno delo zraste.
- Izkoristek se zmanjša, ker je več toplote treba oddati.
~ Oddana toplota res zraste, a sorazmerno z dovedeno; razmerje ostane enako.
> Pri stalnem $r_p$ je $\eta$ enak; $w$ zraste, ker se poveča razlika $T_3 - T_4$. Izkoristek bi zrasel šele, če bi hkrati povečali $r_p$ proti novemu optimumu.

? Kolikšen je izkoristek idealnega Ottovega procesa s kompresijskim razmerjem $11$ ($\kappa = 1{,}4$)?
- $0{,}909$
~ To je $1 - \frac{1}{11}$: manjka eksponent $\kappa - 1$.
- $0{,}965$
~ To je $1 - 11^{-1{,}4}$: eksponent je $\kappa$ namesto $\kappa - 1$.
+ $0{,}617$
- $0{,}383$
~ To je $\frac{1}{11^{0{,}4}}$, delež oddane toplote, ne izkoristek.
> $11^{0{,}4} = 2{,}609$, $\eta = 1 - \frac{1}{2{,}609} = 0{,}617$.

? V idealnem Rankinovem procesu je $h_1 = 200\,\mathrm{kJ/kg}$, $h_2 = 205\,\mathrm{kJ/kg}$, $h_3 = 3400\,\mathrm{kJ/kg}$ in $h_4 = 2300\,\mathrm{kJ/kg}$. Kolikšen je izkoristek?
+ $0{,}343$
- $0{,}324$
~ Deljeno je s $h_3$ namesto z dovedeno toploto $h_3 - h_2$.
- $0{,}657$
~ To je $\frac{h_4 - h_1}{h_3 - h_2}$, delež toplote, ki gre v kondenzator.
- $0{,}500$
~ Ni povezano z entalpijami; Rankinov proces je daleč pod tako vrednostjo pri teh podatkih.
> $w = (3400 - 2300) - (205 - 200) = 1095\,\mathrm{kJ/kg}$, $q_\mathrm{dov} = 3400 - 205 = 3195\,\mathrm{kJ/kg}$, $\eta = 0{,}343$.

:::simboli
w | specifično delo krožnega procesa | w = q_\mathrm{dov} - q_\mathrm{odv} | kJ/kg
q_\mathrm{dov} | dovedena specifična toplota | | kJ/kg
q_\mathrm{odv} | oddana specifična toplota | | kJ/kg | pozitivna količina
\eta | termični izkoristek | \eta = \frac{w}{q_\mathrm{dov}} | –
\eta_\mathrm{O} | izkoristek Ottovega procesa | | –
\eta_\mathrm{D} | izkoristek Dieslovega procesa | | –
\eta_\mathrm{J} | izkoristek Jouleovega procesa | | –
\eta_\mathrm{R} | izkoristek Rankinovega procesa | | –
\varepsilon | kompresijsko razmerje | \varepsilon = \frac{V_1}{V_2} | –
\varphi | razmerje izobarnega raztezanja | \varphi = \frac{V_3}{V_2} | –
r_p | tlačno razmerje | r_p = \frac{p_2}{p_1} | – | ponekod označeno s $\pi$
\kappa | razmerje specifičnih toplot | \kappa = \frac{c_p}{c_v} | – | za zrak 1,4
c_p | specifična toplota pri stalnem tlaku | | kJ/(kg\,K)
c_v | specifična toplota pri stalni prostornini | | kJ/(kg\,K)
T_1, T_2, T_3, T_4 | temperature v značilnih točkah | | K
p_1, p_2, p_3, p_4 | tlaki v značilnih točkah | | bar
V_1, V_2, V_3 | prostornine v značilnih točkah | | m^3
h_1, h_2, h_3, h_4 | specifične entalpije v točkah Rankinovega procesa | | kJ/kg
h' | entalpija vrele kapljevine | | kJ/kg
h'' | entalpija suhe nasičene pare | | kJ/kg
s_3, s_4 | specifični entropiji pred in za turbino | | kJ/(kg\,K)
s' | entropija vrele kapljevine | | kJ/(kg\,K)
s'' | entropija suhe nasičene pare | | kJ/(kg\,K)
x_4 | suhost pare na izstopu turbine | x_4 = \frac{s_4 - s'}{s'' - s'} | – | masni delež pare
w_\mathrm{č} | specifično delo črpalke | w_\mathrm{č} = v'(p_2 - p_1) | kJ/kg
v' | specifična prostornina vrele kapljevine | | m^3/kg
:::
