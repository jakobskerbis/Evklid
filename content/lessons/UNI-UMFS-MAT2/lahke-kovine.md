---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1906 je nemški metalurg Alfred Wilm iskal aluminijevo zlitino, ki bi jo lahko utrdil kot jeklo: segrel jo je in gasil v vodi. Zlitina z bakrom in magnezijem po gašenju ni bila trda, kot je pričakoval. Ko pa je meritve trdote ponovil po nekaj dneh, je bila trdota precej večja. Vzorec je ves čas le ležal v laboratoriju. Pod svetlobnim mikroskopom se v njem ni nič spremenilo.

Z znanjem o jeklih tega ni mogoče razložiti: jeklo je najtrše takoj po kaljenju, s časom in segrevanjem pa se mehča. Wilmova zlitina, kasneje imenovana duraluminij, je dobila trdnost *po* gašenju in brez vidne spremembe zgradbe. Pojasnilo, nevidno majhni izločki, so z rentgensko difrakcijo potrdili šele čez tri desetletja. Na tem pojavu, **izločevalnem utrjevanju**, temeljijo letalske konstrukcije, platišča, okvirji koles in ohišja telefonov. Spodaj tri lahke kovine, aluminij, magnezij in titan, postavimo ob jeklo, ki ga že poznaš.

## Razlaga

### Kaj pomeni »lahka«

Lahke kovine imajo gostoto pod okoli $5\,\mathrm{g/cm^3}$. Primerjava z železom:

- železo: $\rho = 7{,}87\,\mathrm{g/cm^3}$, $E = 210\,\mathrm{GPa}$, kubična telesno centrirana (pod $912\,^\circ\mathrm C$);
- aluminij: $\rho = 2{,}70\,\mathrm{g/cm^3}$, $E = 70\,\mathrm{GPa}$, ploskovno centrirana kubična, tali se pri $660\,^\circ\mathrm C$;
- magnezij: $\rho = 1{,}74\,\mathrm{g/cm^3}$, $E = 45\,\mathrm{GPa}$, heksagonalna gosto zložena, tali se pri $650\,^\circ\mathrm C$;
- titan: $\rho = 4{,}51\,\mathrm{g/cm^3}$, $E \approx 110\,\mathrm{GPa}$, heksagonalna $\alpha$ pod $882\,^\circ\mathrm C$, nad njo kubična telesno centrirana $\beta$, tali se pri $1668\,^\circ\mathrm C$.

Opazi: modul elastičnosti pade skoraj v istem razmerju kot gostota. **Specifična togost** $E/\rho$ je pri vseh štirih okoli $25\,\mathrm{GPa\,cm^3/g}$. Lahka kovina v nategu ni »bolj toga za isto maso«. Prednost se pokaže pri upogibu tankih sten in pri **specifični trdnosti** $R_\mathrm{p0,2}/\rho$, kjer so dobre lahke zlitine večkrat boljše od konstrukcijskega jekla.

### Aluminijeve zlitine

Gnetne zlitine označujemo s štirimi števkami (EN AW-xxxx). Prva pove glavni legirni element:

- 1xxx: čisti aluminij (vsaj $99\,\%$), električni vodniki, folija;
- 3xxx: mangan, pločevinke in strešne kritine;
- 5xxx: magnezij, ladje in tlačne posode, dobra odpornost proti morski vodi;
- 2xxx: baker, letalske konstrukcije (2024);
- 6xxx: magnezij in silicij, profili in okvirji (6061, 6082);
- 7xxx: cink z magnezijem in bakrom, najtrdnejše zlitine (7075).

Zlitine 1xxx, 3xxx in 5xxx utrjujemo le s hladnim preoblikovanjem (stanje H). Zlitine 2xxx, 6xxx in 7xxx so **toplotno utrjevalne**. Livne zlitine (EN AC) so večinoma zlitine Al-Si (silumini), ki se dobro livajo. Stanje zapišemo za pomišljajem: O žarjeno, T4 raztopno žarjeno in naravno starano, T6 raztopno žarjeno in umetno starano do največje trdnosti.

### Izločevalno utrjevanje: primerjava s kaljenjem jekla

Pri jeklu kaljenje ujame ogljik v prenasičeni martenzit. Ta nastane brez difuzije in je trd takoj; popuščanje (segrevanje) ga mehča. Pri aluminiju je gašenje le prvi korak in zlitina po njem ostane mehka. Trdnost nastane šele med staranjem, z difuzijo.

**Definicija.** **Izločevalno utrjevanje** je povečanje trdnosti zaradi drobnih, enakomerno porazdeljenih delcev druge faze, ki nastanejo iz prenasičene trdne raztopine.

**Pogoja.** Zlitina je izločevalno utrjevalna, (1) če topnost legirnega elementa v osnovni kovini z nižanjem temperature močno pada (krivulja solvus v faznem diagramu), in (2) če izločki pri staranju nastajajo v drobni obliki, ki ovira gibanje dislokacij (najprej koherentni z mrežo osnove).

**Postopek (zlitina Al-$4\,\%$ Cu):**

1. **Raztopno žarjenje** nad solvusom (okoli $500\,^\circ\mathrm C$), a pod evtektično temperaturo $548\,^\circ\mathrm C$, v praksi pri $510$ do $520\,^\circ\mathrm C$: ves baker se raztopi v $\alpha$.
2. **Gašenje** v vodi: difuzija nima časa, nastane **prenasičena trdna raztopina**. Ob tem ostane v mreži veliko praznih mest, ki kasneje pospešijo difuzijo.
3. **Staranje**: pri sobni temperaturi (naravno) ali pri $120$ do $200\,^\circ\mathrm C$ (umetno). Baker se zbira v izločke v zaporedju: Guinier-Prestonove cone (ploščice debeline nekaj atomov) $\to$ $\theta''$ $\to$ $\theta'$ $\to$ ravnotežna faza $\theta$ ($\mathrm{Al_2Cu}$).

```
Rp ^      vrh (T6)
   |     _--_
   |   /      \__  prestaranje
   |  /          ---
   | /
   +------------------> t
```

Trdnost med staranjem najprej raste, doseže vrh in nato pada. Pri prestaranju izločki zrastejo, razdalje med njimi se povečajo in izgubijo koherenco z mrežo. Dislokacije jih tedaj obidejo.

:::premisli
Zakaj zlitine Al-Mg iz skupine 5xxx ne moremo utrditi s staranjem, čeprav se topnost magnezija s temperaturo tudi spreminja?
---
Izločki, ki v njej nastanejo, so groba ravnotežna faza na mejah zrn, ne drobni koherentni delci v zrnih. Prvi pogoj je izpolnjen, drugi ne: brez drobnih izločkov ni ovir za dislokacije. Zato zlitine 5xxx utrjujemo s hladnim preoblikovanjem.
:::

**Kinetika.** Staranje je difuzijski proces, zato se z višjo temperaturo pospeši. Čas do enakega stanja se z absolutno temperaturo spreminja po Arrheniusovi zvezi:

$$\frac{t_2}{t_1} = \exp\!\left(\frac{Q}{R}\left(\frac{1}{T_2} - \frac{1}{T_1}\right)\right)$$

kjer je $Q$ aktivacijska energija difuzije (za baker v aluminiju okoli $130\,\mathrm{kJ/mol}$). Višja temperatura da vrh hitreje, a nižji: izločki rastejo hitreje in so bolj grobi.

### Magnezijeve zlitine

Magnezij je najlažja konstrukcijska kovina. Ima heksagonalno mrežo z malo drsnimi sistemi pri sobni temperaturi, zato se slabo hladno preoblikuje; pločevine oblikujemo pri $200$ do $300\,^\circ\mathrm C$. Največ ga ulivamo pod tlakom. Najbolj razširjena je **AZ91** (okoli $9\,\%$ Al, $1\,\%$ Zn): ohišja menjalnikov, nosilci volanov, ohišja prenosnikov. Slabosti: slaba odpornost proti koroziji, posebej v stiku z jeklom (galvanski člen), in vnetljivi ostružki pri obdelavi.

### Titanove zlitine

Titan je za dobrih $40\,\%$ lažji od jekla, ima zelo veliko specifično trdnost, ohrani jo do okoli $500\,^\circ\mathrm C$ in je izredno odporen proti koroziji zaradi goste plasti $\mathrm{TiO_2}$. Je drag, ker ga pridobivamo v zapletenem postopku prek $\mathrm{TiCl_4}$. Legirni elementi stabilizirajo eno od obeh modifikacij:

- **stabilizatorji $\alpha$** (Al, O, N) dvignejo temperaturo prehoda;
- **stabilizatorji $\beta$** (V, Mo, Nb, Fe) jo znižajo.

Ločimo zlitine $\alpha$, $\alpha + \beta$ in $\beta$. Najpogostejša je $\alpha + \beta$ zlitina **Ti-6Al-4V**: letalski deli, lopatice kompresorjev, vsadki. Zlitine $\alpha + \beta$ in $\beta$ lahko tudi toplotno utrdimo z raztopnim žarjenjem in staranjem.

:::premisli
Zakaj je titanova zlitina boljša izbira za del, ki dela pri $400\,^\circ\mathrm C$, kot aluminijeva zlitina T6, čeprav ima ta podobno specifično trdnost pri sobni temperaturi?
---
Pri $400\,^\circ\mathrm C$ je aluminijeva zlitina daleč nad temperaturo staranja: izločki hitro zrastejo, zlitina se prestara in izgubi trdnost. Aluminij se tali že pri $660\,^\circ\mathrm C$, titan pri $1668\,^\circ\mathrm C$, zato je $400\,^\circ\mathrm C$ zanj sorazmerno »hladno«.
:::

## Rešeni primeri

### Primer 1 (lažji)

Primerjaj specifično togost in specifično trdnost konstrukcijskega jekla S355, aluminijeve zlitine EN AW-6061-T6, magnezijeve AZ91 in titanove Ti-6Al-4V.

**Podatki:** S355: $E = 210\,\mathrm{GPa}$, $\rho = 7{,}85\,\mathrm{g/cm^3}$, $R_\mathrm{p0,2} = 355\,\mathrm{MPa}$; 6061-T6: $68{,}9\,\mathrm{GPa}$; $2{,}70\,\mathrm{g/cm^3}$; $276\,\mathrm{MPa}$; AZ91: $45\,\mathrm{GPa}$; $1{,}81\,\mathrm{g/cm^3}$; $150\,\mathrm{MPa}$; Ti-6Al-4V: $114\,\mathrm{GPa}$; $4{,}43\,\mathrm{g/cm^3}$; $880\,\mathrm{MPa}$
**Iščemo:** $E/\rho$ in $R_\mathrm{p0,2}/\rho$

:::formula
specifična togost $\dfrac{E}{\rho}$, specifična trdnost $\dfrac{R_\mathrm{p0,2}}{\rho}$
:::

**Rešitev:**

1. Specifična togost v $\mathrm{GPa\,cm^3/g}$: jeklo $210 / 7{,}85 \approx 26{,}8$; 6061 $68{,}9 / 2{,}70 \approx 25{,}5$; AZ91 $45 / 1{,}81 \approx 24{,}9$; titan $114 / 4{,}43 \approx 25{,}7$.
2. Specifična trdnost v $\mathrm{MPa\,cm^3/g}$: jeklo $355 / 7{,}85 \approx 45{,}2$; 6061 $276 / 2{,}70 \approx 102$; AZ91 $150 / 1{,}81 \approx 82{,}9$; titan $880 / 4{,}43 \approx 199$.
3. Sklep o togosti: vrednosti se razlikujejo le za nekaj odstotkov. To je izkustveno pravilo za skoraj vse konstrukcijske kovine (izjema je berilij z $E/\rho \approx 155\,\mathrm{GPa\,cm^3/g}$); večjo specifično togost dobimo šele s kompoziti.
4. Sklep o trdnosti: titanova zlitina je več kot štirikrat boljša od S355, aluminijeva več kot dvakrat.
5. Odgovor: pri togosti v nategu so vse štiri kovine skoraj enake; pri trdnosti na enoto mase vodi Ti-6Al-4V, sledita 6061-T6 in AZ91, jeklo S355 je zadnje.

### Primer 2: pokrov motorja

Jeklen pokrov motorja je pločevina debeline $0{,}8\,\mathrm{mm}$. Nadomestiti ga želimo z aluminijevim ($E = 70\,\mathrm{GPa}$, $\rho = 2{,}70\,\mathrm{g/cm^3}$) ali magnezijevim ($E = 45\,\mathrm{GPa}$, $\rho = 1{,}81\,\mathrm{g/cm^3}$), z enako upogibno togostjo in enako površino. Kolikšna mora biti debelina in kolikšna je masa v primerjavi z jeklom ($E = 210\,\mathrm{GPa}$, $\rho = 7{,}85\,\mathrm{g/cm^3}$)?

**Podatki:** $t_\mathrm{j} = 0{,}8\,\mathrm{mm}$, $E_\mathrm{j} = 210\,\mathrm{GPa}$, $\rho_\mathrm{j} = 7{,}85\,\mathrm{g/cm^3}$; Al: $70\,\mathrm{GPa}$; $2{,}70\,\mathrm{g/cm^3}$; Mg: $45\,\mathrm{GPa}$; $1{,}81\,\mathrm{g/cm^3}$
**Iščemo:** debelini $t$ in razmerji mas $m/m_\mathrm{j}$

:::formula
upogibna togost plošče $\propto E t^3$; enaka togost: $t = t_\mathrm{j}\sqrt[3]{\dfrac{E_\mathrm{j}}{E}}$; $\dfrac{m}{m_\mathrm{j}} = \dfrac{\rho\, t}{\rho_\mathrm{j}\, t_\mathrm{j}}$
:::

**Rešitev:**

1. Togost plošče je sorazmerna z $E$ in s tretjo potenco debeline (vztrajnostni moment prereza $b t^3/12$).
2. Aluminij: $\sqrt[3]{210/70} = \sqrt[3]{3} \approx 1{,}442$, zato $t \approx 0{,}8 \cdot 1{,}442 \approx 1{,}15\,\mathrm{mm}$.
3. Masa: $\dfrac{2{,}70 \cdot 1{,}154}{7{,}85 \cdot 0{,}8} \approx 0{,}50$.
4. Magnezij: $\sqrt[3]{210/45} \approx 1{,}671$, $t \approx 1{,}34\,\mathrm{mm}$; masa $\dfrac{1{,}81 \cdot 1{,}337}{7{,}85 \cdot 0{,}8} \approx 0{,}39$.
5. Zakaj tu lahke kovine zmagajo, v nategu pa ne: debelina raste le s tretjim korenom razmerja modulov, masa pa linearno z gostoto. Merilo za upogib plošč je $E^{1/3}/\rho$, ne $E/\rho$.
6. Odgovor: aluminijev pokrov je debel okoli $1{,}15\,\mathrm{mm}$ in tehta polovico jeklenega, magnezijev okoli $1{,}34\,\mathrm{mm}$ in tehta $39\,\%$.

### Primer 3 (težji): načrt toplotne obdelave

Zlitino Al-$4\,\%$ Cu (masni deleži) toplotno utrjujemo. Iz faznega diagrama: solvus pri $4\,\%$ Cu je pri okoli $500\,^\circ\mathrm C$, evtektična temperatura $548\,^\circ\mathrm C$, topnost bakra v $\alpha$ pri sobni temperaturi okoli $0{,}1\,\%$, faza $\theta$ vsebuje okoli $53\,\%$ Cu. (a) V katerem območju naj bo temperatura raztopnega žarjenja? (b) Kolikšen masni delež faze $\theta$ bi bil v ravnotežju pri sobni temperaturi? (c) Pri $190\,^\circ\mathrm C$ zlitina doseže vrh trdnosti v $10\,\mathrm h$. Koliko časa potrebuje pri $170\,^\circ\mathrm C$, če je $Q = 130\,\mathrm{kJ/mol}$?

**Podatki:** $w_0 = 4\,\%$, $T_\mathrm{solvus} \approx 500\,^\circ\mathrm C$, $T_\mathrm{e} = 548\,^\circ\mathrm C$, $w_\alpha = 0{,}1\,\%$, $w_\theta = 53\,\%$, $t_1 = 10\,\mathrm h$ pri $T_1 = 463{,}15\,\mathrm K$, $T_2 = 443{,}15\,\mathrm K$, $Q = 130\,\mathrm{kJ/mol}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** temperaturno območje, delež $\theta$, čas $t_2$

:::formula
vzvodno pravilo: $W_\theta = \dfrac{w_0 - w_\alpha}{w_\theta - w_\alpha}$; $t_2 = t_1 \exp\!\left(\dfrac{Q}{R}\left(\dfrac{1}{T_2} - \dfrac{1}{T_1}\right)\right)$
:::

**Rešitev:**

1. (a) Temperatura mora biti nad solvusom, da se ves baker raztopi, in pod evtektično, sicer se ob mejah zrn začne taliti evtektik (»sežig«). Okno je torej od okoli $500$ do $548\,^\circ\mathrm C$; v praksi blizu $510$ do $520\,^\circ\mathrm C$ z varnostjo na obeh straneh.
2. (b) Vzvodno pravilo: $W_\theta = \dfrac{4 - 0{,}1}{53 - 0{,}1} \approx 0{,}074$, torej okoli $7{,}4\,\%$ faze $\theta$. Prav ta baker lahko pri staranju tvori izločke.
3. (c) Razmerje $Q/R = 130\,000 / 8{,}314 \approx 15\,636\,\mathrm K$.
4. Razlika recipročnih temperatur: $\dfrac{1}{443{,}15} - \dfrac{1}{463{,}15} \approx 9{,}745 \cdot 10^{-5}\,\mathrm{K^{-1}}$.
5. Eksponent: $15\,636 \cdot 9{,}745 \cdot 10^{-5} \approx 1{,}524$; $\mathrm e^{1{,}524} \approx 4{,}59$.
6. Čas: $t_2 \approx 10 \cdot 4{,}59 \approx 45{,}9\,\mathrm h$.
7. Odgovor: (a) med okoli $500$ in $548\,^\circ\mathrm C$; (b) okoli $7{,}4\,\%$ faze $\theta$; (c) okoli $46\,\mathrm h$. Nižja temperatura pomeni daljši čas, a navadno nekoliko višji vrh, ker so izločki drobnejši.

### Primer 4 – zdaj ti: vsadek, ki izgine

Pri zlomu gležnja kirurg uporabi razgradljiv magnezijev vijak. Jedro vijaka ima polmer $1{,}5\,\mathrm{mm}$. Predpostavimo, da v telesu korodira enakomerno s hitrostjo $0{,}4\,\mathrm{mm}$ na leto s površine. Koliko časa traja, da jedro izgine? Kolikšen delež prvotne upogibne trdnosti ostane po $3$ mesecih in po $1$ letu, če je ta sorazmerna z $r^3$?

**Podatki:** $r_0 = 1{,}5\,\mathrm{mm}$, hitrost korozije $0{,}4\,\mathrm{mm}$ na leto, trdnost $\propto r^3$
**Iščemo:** čas razgradnje in deleža trdnosti

:::formula
$r(t) = r_0 - v_\mathrm{k} t$, delež trdnosti $= \left(\dfrac{r}{r_0}\right)^3$
:::

**Rešitev:**

1. Čas razgradnje jedra: $1{,}5 / 0{,}4 = 3{,}75$ leta.
2. Po $3$ mesecih ($0{,}25$ leta): $r = 1{,}5 - 0{,}1 = 1{,}4\,\mathrm{mm}$.
3. Po $1$ letu: $r = 1{,}1\,\mathrm{mm}$.
4. Izračunaj še deleža trdnosti in razmisli, ali vijak opravi nalogo, če kost v treh mesecih zaraste.

:::premisli
Kolikšna sta deleža in kaj pomenita za bolnika?
---
Po $3$ mesecih $(1{,}4/1{,}5)^3 \approx 0{,}81$, po letu $(1{,}1/1{,}5)^3 \approx 0{,}39$. Vijak drži z več kot $80\,\%$ trdnosti, dokler kost zaraste, nato pa obremenitev postopoma prevzame kost. Druge operacije za odstranitev ni. Titanov vijak bi ostal ali bi ga morali odstraniti.
:::

## Pogoste napake

- **»Aluminij je bolj tog za isto maso kot jeklo.«** V nategu ni: $E/\rho$ je skoraj enak. Prednost je pri upogibu tankih sten in pri trdnosti.
- **Gašenje aluminija kot kaljenje jekla.** Po gašenju je zlitina mehka; trdnost da šele staranje. Pri jeklu je trdnost največja takoj po kaljenju.
- **Daljše ali bolj vroče staranje je vedno boljše.** Po vrhu trdnost pada (prestaranje); zlitine 2xxx in 7xxx zato ne smejo dolgo delovati nad okoli $150\,^\circ\mathrm C$.
- **Raztopno žarjenje »čim višje«.** Nad evtektično temperaturo se meje zrn delno talijo in zlitina je neuporabna.
- **Vsaka aluminijeva zlitina se utrdi s staranjem.** Zlitine 1xxx, 3xxx in 5xxx niso toplotno utrjevalne; utrjujemo jih s hladnim preoblikovanjem.

## Povzetek

- Lahke kovine: Al ($2{,}70\,\mathrm{g/cm^3}$; $70\,\mathrm{GPa}$), Mg ($1{,}74$; $45\,\mathrm{GPa}$), Ti ($4{,}51$; $110\,\mathrm{GPa}$); $E/\rho$ je skoraj enak kot pri jeklu, specifična trdnost pa večja.
- Al zlitine: 1xxx, 3xxx, 5xxx le hladno utrjevanje; 2xxx, 6xxx, 7xxx toplotno utrjevalne; stanja O, H, T4, T6.
- Izločevalno utrjevanje: raztopno žarjenje nad solvusom in pod evtektikom, gašenje v prenasičeno raztopino, staranje (GP cone, $\theta''$, $\theta'$, $\theta$); po vrhu prestaranje.
- Pogoja: topnost pada s temperaturo in nastanejo drobni (koherentni) izločki.
- Mg: heksagonalna mreža, slabo hladno preoblikovanje, tlačno litje (AZ91), korozija.
- Ti: $\alpha$ (hcp) pod $882\,^\circ\mathrm C$, $\beta$ (bcc) nad; stabilizatorji $\alpha$ Al, O, N, stabilizatorji $\beta$ V, Mo; Ti-6Al-4V; odličen proti koroziji in biokompatibilen.

## Za izpit

Znati moraš povedati:

- pogoja za izločevalno utrjevanje in tri korake postopka s pomenom vsakega;
- zaporedje izločkov v Al-Cu in zakaj trdnost po vrhu pade;
- razliko med kaljenjem jekla in izločevalnim utrjevanjem aluminija;
- oznake gnetnih aluminijevih zlitin in stanj ter katere skupine so toplotno utrjevalne;
- zgradbo in stabilizatorje titanovih zlitin ter lastnosti magnezijevih;
- zakaj je $E/\rho$ pri kovinah skoraj enak in kdaj lahka kovina vseeno prihrani maso.

### Naloga 1

Natezna vez dolžine $0{,}8\,\mathrm m$ prenaša silo $50\,\mathrm{kN}$ z varnostjo $1{,}5$ proti meji plastičnosti. Izbiramo med S355 ($E = 210\,\mathrm{GPa}$, $\rho = 7{,}85\,\mathrm{g/cm^3}$, $R_\mathrm{p0,2} = 355\,\mathrm{MPa}$), 7075-T6 ($71{,}7\,\mathrm{GPa}$; $2{,}81\,\mathrm{g/cm^3}$; $505\,\mathrm{MPa}$), AZ91 ($45\,\mathrm{GPa}$; $1{,}81\,\mathrm{g/cm^3}$; $150\,\mathrm{MPa}$) in Ti-6Al-4V ($114\,\mathrm{GPa}$; $4{,}43\,\mathrm{g/cm^3}$; $880\,\mathrm{MPa}$). (a) Vez se sme podaljšati največ za $0{,}4\,\mathrm{mm}$. Kateri material da najlažjo vez? (b) Kaj pa, če je dovoljeni raztezek $2\,\mathrm{mm}$?

**Rešitev:**

1. Prerez iz trdnosti: $A_\mathrm{s} = S F / R_\mathrm{p0,2}$. Prerez iz togosti: $A_\mathrm{k} = F L / (E\,\Delta L)$. Vzamemo večjega; masa je $m = \rho A L$.
2. Trdnost: S355 $1{,}5 \cdot 50\,000 / 355 \approx 211\,\mathrm{mm^2}$; 7075 $\approx 149\,\mathrm{mm^2}$; AZ91 $500\,\mathrm{mm^2}$; titan $\approx 85\,\mathrm{mm^2}$.
3. (a) Togost pri $\Delta L = 0{,}4\,\mathrm{mm}$: S355 $50\,000 \cdot 800 / (210\,000 \cdot 0{,}4) \approx 476\,\mathrm{mm^2}$; 7075 $\approx 1395\,\mathrm{mm^2}$; AZ91 $\approx 2222\,\mathrm{mm^2}$; titan $\approx 877\,\mathrm{mm^2}$. Pri vseh odloča togost.
4. Mase (a): S355 $7850 \cdot 476 \cdot 10^{-6} \cdot 0{,}8 \approx 2{,}99\,\mathrm{kg}$; 7075 $\approx 3{,}14\,\mathrm{kg}$; titan $\approx 3{,}11\,\mathrm{kg}$; AZ91 $\approx 3{,}22\,\mathrm{kg}$.
5. Sklep (a): kadar odloča togost v nategu, je masa sorazmerna z $\rho/E$; ker je $E/\rho$ skoraj enak, so mase skoraj enake in najcenejše jeklo je celo najlažje.
6. (b) Pri $\Delta L = 2\,\mathrm{mm}$ so prerezi iz togosti petkrat manjši: S355 $95\,\mathrm{mm^2}$, 7075 $279\,\mathrm{mm^2}$, AZ91 $444\,\mathrm{mm^2}$, titan $175\,\mathrm{mm^2}$.
7. Odloča večji prerez: S355 trdnost ($211\,\mathrm{mm^2}$), 7075 togost ($279$), AZ91 trdnost ($500$), titan togost ($175$).
8. Mase (b): S355 $\approx 1{,}33\,\mathrm{kg}$; 7075 $\approx 0{,}63\,\mathrm{kg}$; AZ91 $\approx 0{,}72\,\mathrm{kg}$; titan $\approx 0{,}62\,\mathrm{kg}$.
9. Odgovor: (a) vse možnosti tehtajo okoli $3\,\mathrm{kg}$, najlažja je jeklena; (b) titan in 7075-T6 sta skoraj enakovredna (okoli $0{,}6\,\mathrm{kg}$), pol lažja od jekla; zaradi cene bi izbrali 7075-T6.

### Naloga 2

Natančno navedi pogoja za izločevalno utrjevanje in opiši postopek za zlitino Al-Cu. Pojasni, zakaj trdnost med staranjem doseže vrh, in primerjaj postopek s kaljenjem in popuščanjem jekla.

**Rešitev:**

1. Pogoja: topnost legirnega elementa v osnovni trdni raztopini z nižanjem temperature močno pada; pri staranju nastanejo drobni, enakomerno porazdeljeni, sprva koherentni izločki.
2. Raztopno žarjenje nad solvusom in pod evtektikom raztopi baker v $\alpha$; gašenje ujame baker v prenasičeni raztopini in ohrani prazna mesta; staranje omogoči nastanek izločkov z difuzijo.
3. Zaporedje: GP cone $\to$ $\theta''$ $\to$ $\theta'$ $\to$ $\theta$ ($\mathrm{Al_2Cu}$); prvi so koherentni, zadnji nekoherentni in grobi.
4. Vrh: majhne koherentne izločke dislokacije *režejo*, pri čemer je potrebna sila večja, čim večji je izloček. Velike izločke dislokacije *obidejo* (Orowanov mehanizem), potrebna sila pa pada z naraščajočo razdaljo med izločki. Največja trdnost je pri velikosti, kjer se oba mehanizma srečata.
5. Primerjava: pri jeklu kaljenje brez difuzije ustvari trd martenzit, popuščanje z difuzijo trdoto zmanjša in poveča žilavost. Pri aluminiju gašenje da mehko prenasičeno raztopino, staranje z difuzijo trdnost poveča. Obema je skupno, da gašenje ustvari neravnotežno stanje, ki ga nato nadzorovano približamo ravnotežju.

## Drugače: Na sliki

Predstavljaj si dislokacijo kot vrv, ki jo vlečeš po polju s količki.

- Takoj po gašenju količkov ni: baker je raztopljen posamično, vrv drsi zlahka. Zlitina je mehka.
- Pri zgodnjem staranju je zabitih veliko drobnih, mehkih količkov na majhnih razdaljah. Vrv jih mora prerezati. Večji kot so, težje gre.
- Pri vrhu so količki ravno tako veliki, da jih vrv komaj še prereže, in še vedno gosti.
- Pri prestaranju se drobni količki zlijejo v redke debele stebre. Vrv jih ne more prerezati, a se med njimi lahko upogne in jih obide. Razmiki so veliki, zato gre spet lažje.

Krivulja trdnosti v času iz razlage je zato hrib: na levi je odločilno rezanje, na desni obhod.

## Drugače: Uporaba v stroki

- **Letalstvo.** Spodnja stran kril je pogosto iz 2024-T3 (odpornost proti utrujanju), zgornja iz 7075-T6 ali novejših zlitin 7xxx (tlačna trdnost).
- **Varjenje toplotno utrjevalnih zlitin.** V toplotno vplivanem področju zvara pri 6061-T6 se izločki delno raztopijo, malo dlje od zvara pa prestarajo; trdnost ob zvaru pade za tretjino ali več, kar mora konstrukter upoštevati ali zvar ponovno toplotno obdelati.
- **Avtomobilska industrija.** Aluminijeve pločevine 6xxx dobavijo v stanju T4. Med sušenjem laka (okoli $180\,^\circ\mathrm C$, $20$ do $30\,\mathrm{min}$) se karoserija delno umetno postara, kar je izkoristek ene toplotne obdelave za dve nalogi.
- **Medicina.** Ti-6Al-4V in čisti titan sta standard za kolčne endoproteze, zobne vsadke in plošče za kosti. Kost se na titanov oksid neposredno veže (oseointegracija). Modul titana ($110\,\mathrm{GPa}$) je še vedno večkrat večji od modula kortikalne kosti (okoli $10$ do $30\,\mathrm{GPa}$), zato vsadek prevzame del obremenitve in kost okoli njega se lahko tanjša. Razgradljivi magnezijevi vijaki se uporabljajo pri manjših zlomih.

## Preveri se

? Katera razvrstitev gnetnih aluminijevih zlitin je pravilna?
- toplotno utrjevalne: 1xxx, 3xxx, 5xxx
~ Te skupine nimajo drobnih izločkov; utrjujemo jih s hladnim preoblikovanjem.
+ toplotno utrjevalne: 2xxx, 6xxx, 7xxx; le hladno utrjevanje: 1xxx, 3xxx, 5xxx
- vse skupine so toplotno utrjevalne, razlika je le v trdnosti
~ Pogoj drobnih izločkov izpolnijo le zlitine z Cu, Mg+Si in Zn+Mg.
- toplotno utrjevalne so samo livne zlitine
~ Livne zlitine Al-Si-Mg so res utrjevalne, a tudi gnetne 2xxx, 6xxx in 7xxx.
> Toplotno utrjevalne so zlitine, v katerih se iz prenasičene raztopine izločajo drobni delci: Al-Cu, Al-Mg-Si, Al-Zn-Mg.

? Jeklen pokrov motorja tehta $10\,\mathrm{kg}$. Približno koliko tehta aluminijev pokrov z enako upogibno togostjo?
- okoli $3{,}4\,\mathrm{kg}$
~ To je le razmerje gostot; pri enaki togosti mora biti aluminijev pokrov debelejši.
+ okoli $5\,\mathrm{kg}$
- okoli $10\,\mathrm{kg}$
~ Enaka masa bi veljala za enako togost v nategu; pri upogibu debelina raste le s tretjim korenom.
- okoli $15\,\mathrm{kg}$
~ Upoštevana je le večja debelina: $10 \cdot 1{,}44 \approx 14{,}4\,\mathrm{kg}$. Pozabljeno je, da ima aluminij le okoli tretjino gostote jekla.
> Debelina $\times 1{,}44$, gostota $\times 0{,}344$, masa $\times 0{,}50$, torej okoli $5\,\mathrm{kg}$.

? Zakaj trdnost aluminijeve zlitine pri predolgem staranju pade?
- Ker se baker spet raztopi v aluminiju.
~ Pri temperaturi staranja je raztopina prenasičena; baker se izloča, ne raztaplja.
- Ker se pri staranju tvori martenzit.
~ Martenzit nastane pri kaljenju jekla; v aluminijevih zlitinah ga ni.
+ Ker izločki zrastejo, postanejo redkejši in nekoherentni, zato jih dislokacije obidejo.
- Ker se zrna stalijo ob mejah.
~ To se zgodi pri pregretju nad evtektično temperaturo med raztopnim žarjenjem, ne pri staranju.
> Prestaranje: grobi, redki izločki so šibkejša ovira kot gosti drobni, ker jih dislokacije obidejo po Orowanovem mehanizmu.

? Na risbi piše EN AW-6082-T6. Kaj je bilo storjeno z materialom?
- žarjeno in počasi ohlajeno
~ To je stanje O, najmehkejše.
- hladno valjano in nato stabilizirano
~ To so stanja H, za toplotno neutrjevalne zlitine.
+ raztopno žarjeno, gašeno in umetno starano do največje trdnosti
- raztopno žarjeno, gašeno in naravno starano
~ To je stanje T4; T6 pomeni umetno staranje pri povišani temperaturi.
> T6 = raztopno žarjenje + gašenje + umetno staranje do vrha.

? Vzmeti iz berilijevega brona (Cu z okoli $2\,\%$ Be) po gašenju in staranju dosežejo zelo veliko trdnost. Kaj to pove o faznem diagramu Cu-Be?
+ Topnost berilija v bakru z nižanjem temperature močno pada, pri staranju pa nastanejo drobni izločki.
- Berilij se v bakru sploh ne raztaplja.
~ Brez topnosti pri visoki temperaturi ni prenasičene raztopine, zato tudi ni izločevalnega utrjevanja.
- Zlitina ima pri visoki temperaturi martenzitno premeno.
~ Utrjevanje s staranjem po gašenju ne potrebuje martenzita; to je mehanizem jekel.
- Topnost berilija s temperaturo narašča počasi in enakomerno.
~ Majhna sprememba topnosti ne da dovolj prenasičene raztopine za močno utrjevanje.
> Isti pogoji kot pri Al-Cu veljajo za vsako izločevalno utrjevalno zlitino, tudi za baker, nikelj in titan.

:::simboli
\rho | gostota | | g/cm^3
E | modul elastičnosti | | GPa
R_\mathrm{p0,2} | meja plastičnosti | | MPa | napetost pri $0{,}2\,\%$ trajnega raztezka
t | debelina pločevine ali čas | | mm | čas staranja v h
t_\mathrm{j} | debelina jeklene pločevine | | mm
E_\mathrm{j} | modul jekla | | GPa
\rho_\mathrm{j} | gostota jekla | | g/cm^3
m | masa | m = \rho A L | kg
m_\mathrm{j} | masa jeklenega dela | | kg
W_\theta | masni delež faze $\theta$ | W_\theta = \frac{w_0 - w_\alpha}{w_\theta - w_\alpha} | –
w_0 | masni delež bakra v zlitini | | – | v odstotkih
w_\alpha | topnost bakra v $\alpha$ | | – | v odstotkih
w_\theta | delež bakra v fazi $\theta$ | | – | v odstotkih
t_1, t_2 | časa staranja | | h
T_1, T_2 | temperaturi staranja | | K
Q | aktivacijska energija difuzije | | J/mol
R | splošna plinska konstanta | | J/(mol\,K)
r | polmer jedra vijaka | r = r_0 - v_\mathrm{k} t | mm
r_0 | začetni polmer | | mm
v_\mathrm{k} | hitrost korozije | | mm/leto
A | prerez | | mm^2
L | dolžina vezi | | m
F | sila | | N
S | varnostni faktor | | –
\Delta L | podaljšek | | mm
:::
