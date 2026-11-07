---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1925 sta nizozemska raziskovalca Evert Gorter in François Grendel iz eritrocitov izločila lipide z acetonom in jih razlila po vodni gladini v posebni kadi. Lipidi so na vodi tvorili tanko plast, debelo eno molekulo. Ko sta plast stisnila do konca in izmerila njeno površino, sta dobila približno dvakratno površino vseh eritrocitov, iz katerih so lipidi izvirali. Sklepala sta: membrana je **dvojna plast** lipidov. Njune meritve so imele napake, ki pa so se slučajno izničile, zato je bil sklep pravilen.

Naslednjih petdeset let so se biologi prepirali, kje so v tej dvoplasti beljakovine. Ali ležijo kot plast na obeh površinah, kot v modelu »sendviča« Davsona in Daniellija iz leta 1935? Šele leta 1972 sta Seymour Singer in Garth Nicolson predlagala model, ki ga uporabljamo danes. V laboratoriju ga srečaš vsak dan, čeprav ga morda ne opaziš: ko pripraviš fiziološko raztopino, ko eritrociti v epruveti z destilirano vodo počijo ali ko iz celic z detergentom izločiš membranske beljakovine.

## Razlaga

### 1. Slika membrane

Začnimo s prerezom membrane, kot bi ga videli v elektronskem mikroskopu pri zelo veliki povečavi. Skica ni v merilu:

```
     zunaj celice
     Y       Y   (oligosaharidi)
 o o o o o|###|o o o o o o
 | | | | ||###|| | | | | |
 | | | | ||###|| | | | | |
 o o o o o|###|o o o o o o
     citosol
```

Oznake: `o` so polarne glave fosfolipidov, `|` njihovi nepolarni repi, `###` integralna beljakovina, ki prečka vso membrano, `Y` verige sladkorjev na zunanji strani.

Vsak **fosfolipid** je **amfipatična** molekula: ima polarno, hidrofilno glavo (fosfat in npr. holin) in dva nepolarna, hidrofobna repa iz maščobnih kislin. V vodi se taki lipidi sami uredijo tako, da so repi skriti pred vodo, glave pa obrnjene k njej. Nastane **lipidni dvosloj**, debel okoli $5\,\mathrm{nm}$. Pri tem ne nastanejo kovalentne vezi med lipidi, repi se privlačijo le s šibkimi van der Waalsovimi silami. Dvosloj drži skupaj **hidrofobni učinek**: voda okoli izpostavljenih repov bi bila bolj urejena, zato skupek poveča entropijo vode in je ugodnejši.

**Definicija.** *Model tekočega mozaika* (Singer in Nicolson, 1972) opiše membrano kot dvodimenzionalno tekočino iz lipidov, v kateri so beljakovine razporejene kot kamenčki mozaika in se lahko bočno gibljejo.

Beljakovine delimo po tem, kako so vezane na dvosloj:

- **integralne** (transmembranske) prečkajo dvosloj z vijačnicami iz nepolarnih aminokislin; izločimo jih le z detergentom, ki raztopi dvosloj;
- **periferne** so z ionskimi ali vodikovimi vezmi pripete na površino ali na integralne beljakovine; odstranimo jih že s spremembo ionske moči ali pH;
- **lipidno zasidrane** so kovalentno vezane na lipid v eni plasti.

### 2. Zakaj »tekoči« in zakaj »asimetrični«

Leta 1970 sta Larry Frye in Michael Edidin zlila mišjo in človeško celico. Mišje membranske beljakovine sta obarvala z zelenim, človeške z rdečim fluorescentnim protitelesom. Takoj po zlitju je bila vsaka polovica nove celice svoje barve, po približno $40$ minutah pri $37\,^\circ\mathrm{C}$ pa sta bili barvi enakomerno pomešani. Pri nizki temperaturi se nista pomešali. Beljakovine so torej v membrani gibljive in to gibanje je odvisno od temperature.

Lipidi se gibljejo še hitreje: po svoji plasti se bočno premaknejo za nekaj mikrometrov v sekundi. Prehod iz ene plasti v drugo, imenovan **flip-flop**, pa je redek, ker bi morala polarna glava skozi nepolarno notranjost. Encimi **flipaze** zato aktivno prenašajo določene lipide v notranjo plast. Membrana je **asimetrična**: fosfatidilserin je v notranji plasti, glikolipidi in oligosaharidi beljakovin (skupaj **glikokaliks**) pa le na zunanji.

Fluidnost membrane uravnavajo trije dejavniki:

- **temperatura**: pri nižji je dvosloj bolj urejen in manj tekoč;
- **nenasičene maščobne kisline**: dvojna vez *cis* naredi pregib v repu, repi se ne zložijo tesno, membrana je bolj tekoča;
- **holesterol**: pri visoki temperaturi zavira gibanje repov, pri nizki preprečuje njihovo tesno zlaganje. Deluje kot blažilnik fluidnosti.

:::premisli
Bakterije, ki jih gojiš pri $15\,^\circ\mathrm{C}$ namesto pri $37\,^\circ\mathrm{C}$, po nekaj generacijah spremenijo sestavo membrane. Napovej, v katero smer se spremeni delež nenasičenih maščobnih kislin in zakaj.
---
Delež se poveča. Pri nižji temperaturi bi se dvosloj strdil v urejen gel in beljakovine ne bi več delovale. Več pregibov *cis* prepreči tesno zlaganje repov, zato membrana ostane tekoča. Temu prilagajanju pravimo homeoviskozna prilagoditev.
:::

### 3. Kdo pride skozi

Dvosloj je **selektivno prepusten**. Prehod skozi nepolarno notranjost je toliko lažji, kolikor manjša in manj polarna je molekula. Lestvica od najbolj do najmanj prepustnih:

1. majhne nepolarne molekule ($\mathrm{O_2}$, $\mathrm{CO_2}$, $\mathrm{N_2}$, steroidi): hitro;
2. majhne polarne nenabite molekule (voda, sečnina, glicerol, etanol): počasneje;
3. velike polarne molekule (glukoza, aminokisline): skoraj nič;
4. ioni ($\mathrm{Na^+}$, $\mathrm{K^+}$, $\mathrm{Cl^-}$, $\mathrm{Ca^{2+}}$): praktično nič, ker jih obdaja ovoj molekul vode.

Za vse, kar se ne prebije samo, ima celica transportne beljakovine. Načini transporta:

- **Enostavna difuzija.** Snov gre neposredno skozi dvosloj po koncentracijskem gradientu. Hitrost je sorazmerna z razliko koncentracij.
- **Olajšana difuzija.** Snov gre po gradientu, a skozi beljakovino: skozi **kanal** (ionski kanali, akvaporini za vodo) ali s **prenašalcem**, ki snov veže in spremeni obliko (prenašalec za glukozo GLUT1). Energije ne potrebuje. Ker je prenašalcev omejeno število, se transport pri visoki koncentraciji **nasiči**.
- **Primarni aktivni transport.** Črpalka porablja ATP in prenaša snov proti gradientu. Natrijeva-kalijeva črpalka ($\mathrm{Na^+/K^+}$-ATPaza) pri vsaki molekuli ATP izčrpa $3\,\mathrm{Na^+}$ iz celice in prenese $2\,\mathrm{K^+}$ vanjo.
- **Sekundarni aktivni transport.** Prenašalec izkoristi gradient $\mathrm{Na^+}$, ki ga je ustvarila črpalka. Simporter SGLT1 v črevesu vnese glukozo proti gradientu skupaj z dvema ionoma $\mathrm{Na^+}$. Antiporter izmenja ione v nasprotnih smereh.
- **Vezikularni transport.** Velike delce celica sprejme z **endocitozo** (fagocitoza, pinocitoza, endocitoza z receptorji) in izloči z **eksocitozo**.

Hitrost enostavne difuzije opiše prvi Fickov zakon. Za membrano ga zapišemo kot gostoto toka

$$J = P\,\Delta c$$

kjer je $P$ prepustnost membrane za to snov in $\Delta c$ razlika koncentracij na obeh straneh. Prenašalec pa ima nasičenje, podobno encimski kinetiki:

$$J = \frac{J_\mathrm{max}\,c}{K_\mathrm{t} + c}$$

$J_\mathrm{max}$ je največji tok, ko so vsi prenašalci zasedeni, $K_\mathrm{t}$ pa koncentracija, pri kateri je tok polovičen.

### 4. Osmoza

**Definicija.** *Osmoza* je neto difuzija vode skozi selektivno prepustno membrano, ki prepušča vodo, ne pa raztopljene snovi, iz raztopine z nižjo koncentracijo osmotsko aktivnih delcev v raztopino z višjo.

Za osmozo ne šteje masa raztopljene snovi, temveč **število delcev**. Merilo je **osmolarnost** $c_\mathrm{osm} = i\,c$, kjer je $i$ število delcev, ki jih da ena formulska enota v raztopini ($i = 1$ za glukozo, $i = 2$ za NaCl, $i = 3$ za $\mathrm{CaCl_2}$). Osmolarnost citosola in krvne plazme je okoli $300\,\mathrm{mOsm/L}$.

**Osmotski tlak** je tlak, ki bi ga morali uporabiti na raztopino, da bi ustavili vdor čiste vode skozi membrano. Za razredčene raztopine velja van 't Hoffova enačba:

$$\Pi = c_\mathrm{osm} R T$$

Pomembno je ločiti dva pojma. **Osmolarnost** je lastnost raztopine same. **Toničnost** pove, kaj raztopina naredi s celico, in je odvisna od tega, ali delci prehajajo membrano:

| raztopina | voda | celica |
|---|---|---|
| hipotonična | noter | nabrekne |
| izotonična | ravnotežje | enaka |
| hipertonična | ven | se skrči |

Živalska celica v hipotonični raztopini nabrekne do nove ravnotežne prostornine; če je raztopina dovolj razredčena, pa poči (pri eritrocitih **hemoliza**, glej Primer 3). Rastlinska celica ima celično steno, zato v hipotonični raztopini nastane **turgor**. V hipertonični raztopini pa se protoplast odmakne od stene, kar imenujemo **plazmoliza**.

**Izpeljava (Boyle-van 't Hoffova zveza).** Celica naj ima prostornino $V_0$ v raztopini z osmolarnostjo $c_0$. Del prostornine $b$ zavzemajo beljakovine in druge snovi, ki z vodo ne izmenjujejo prostornine. Ostanek $V_0 - b$ je voda s topljenci. Ko celico prenesemo v raztopino z osmolarnostjo $c$, voda teče, dokler se osmolarnosti ne izenačita. Število osmotsko aktivnih delcev v celici $n$ pri tem ostane enako, ker membrana delcev ne prepušča. Zato je $n = c_0\,(V_0 - b) = c\,(V - b)$ in

$$V = b + (V_0 - b)\,\frac{c_0}{c}$$

Zveza velja le za delce, ki membrane ne prehajajo. Delci, ki prehajajo (sečnina, glicerol), se v ravnotežju porazdelijo enakomerno in osmotsko ne štejejo.

:::premisli
Raztopina sečnine s $300\,\mathrm{mOsm/L}$ ima enako osmolarnost kot citosol. Kaj se zgodi z eritrocitom, ki ga potopiš vanjo?
---
Sečnina prehaja membrano in vstopa v celico, za njo pa voda. Na koncu je sečnina na obeh straneh enako koncentrirana in ne šteje, v celici pa ostanejo še njeni lastni delci. Raztopina je izoosmotska, a hipotonična: eritrocit nabrekne in poči.
:::

## Rešeni primeri

### Primer 1: fiziološka raztopina v laboratoriju

V laboratoriju pripraviš $500\,\mathrm{mL}$ fiziološke raztopine z masno koncentracijo $9\,\mathrm{g/L}$ NaCl ($0{,}9\,\%$). Koliko NaCl zatehtaš in kolikšna je osmolarnost raztopine? $M(\mathrm{NaCl}) = 58{,}44\,\mathrm{g/mol}$.

**Podatki:** $V_\mathrm{r} = 500\,\mathrm{mL}$, $\gamma = 9\,\mathrm{g/L}$, $M = 58{,}44\,\mathrm{g/mol}$, $i = 2$
**Iščemo:** maso $m$ in osmolarnost $c_\mathrm{osm}$

:::formula
$m = \gamma V_\mathrm{r}$; $c = \dfrac{\gamma}{M}$; $c_\mathrm{osm} = i\,c$
:::

**Rešitev:**

1. Masa: $m = 9\,\mathrm{g/L} \cdot 0{,}5\,\mathrm{L} = 4{,}5\,\mathrm{g}$.
2. Množinska koncentracija: $c = \dfrac{9}{58{,}44} \approx 0{,}154\,\mathrm{mol/L}$.
3. NaCl v vodi razpade na $\mathrm{Na^+}$ in $\mathrm{Cl^-}$, zato $i = 2$: $c_\mathrm{osm} = 2 \cdot 0{,}154 = 0{,}308\,\mathrm{Osm/L}$.
4. Odgovor: zatehtaš $4{,}5\,\mathrm{g}$ NaCl. Osmolarnost je okoli $308\,\mathrm{mOsm/L}$, kar je blizu $300\,\mathrm{mOsm/L}$ citosola. Ioni se v resnici med seboj nekoliko privlačijo, zato je izmerjena vrednost še bližja: okoli $286\,\mathrm{mOsm/L}$.

### Primer 2: eritrocit v destilirani vodi

Kolikšen osmotski tlak bi moral pri $37\,^\circ\mathrm{C}$ zadržati eritrocit z osmolarnostjo $300\,\mathrm{mOsm/L}$, potopljen v destilirano vodo, da voda ne bi vdirala vanj?

**Podatki:** $c_\mathrm{osm} = 300\,\mathrm{mOsm/L} = 300\,\mathrm{mol/m^3}$, $T = 37\,^\circ\mathrm{C} = 310{,}15\,\mathrm{K}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$, zunaj čista voda
**Iščemo:** osmotski tlak $\Pi$

:::formula
$\Pi = c_\mathrm{osm} R T$
:::

**Rešitev:**

1. Enote: $1\,\mathrm{mOsm/L} = 1\,\mathrm{mol/m^3}$, ker ima kubični meter $1000\,\mathrm{L}$.
2. $\Pi = 300 \cdot 8{,}314 \cdot 310{,}15\,\mathrm{Pa} \approx 7{,}74 \cdot 10^{5}\,\mathrm{Pa}$.
3. Primerjava: to je okoli $7{,}6$ atmosfere, kot dodatni tlak na dnu okoli $79\,\mathrm{m}$ globoke vode.
4. Odgovor: potreben bi bil tlak okoli $774\,\mathrm{kPa}$. Tanka membrana brez celične stene takega tlaka ne zdrži, zato voda vdira, eritrocit nabrekne in poči. Rastlinska celica z enako razliko ne poči, ker tlak prevzame celična stena.

### Primer 3 (izpitna raven): test osmotske odpornosti

V hematološkem laboratoriju eritrocite potopijo v vrsto vse bolj razredčenih raztopin NaCl in opazujejo, kdaj začnejo pokati. Eritrocit ima v krvi ($300\,\mathrm{mOsm/L}$) prostornino $90\,\mathrm{fL}$, od tega je $36\,\mathrm{fL}$ osmotsko neaktivne prostornine. Njegova površina je $140\,\mu\mathrm{m}^2$; membrana se ne more raztegniti, zato celica poči, ko postane krogla s to površino. (a) Kolikšna je prostornina v raztopini z $200\,\mathrm{mOsm/L}$? (b) Pri kateri osmolarnosti eritrocit poči? (c) Kateri masni koncentraciji NaCl to ustreza?

**Podatki:** $V_0 = 90\,\mathrm{fL}$, $b = 36\,\mathrm{fL}$, $c_0 = 300\,\mathrm{mOsm/L}$, $c_1 = 200\,\mathrm{mOsm/L}$, $A = 140\,\mu\mathrm{m}^2$, $M(\mathrm{NaCl}) = 58{,}44\,\mathrm{g/mol}$, $i = 2$, $1\,\mu\mathrm{m}^3 = 1\,\mathrm{fL}$
**Iščemo:** $V_1$, kritično osmolarnost $c_\mathrm{k}$ in masno koncentracijo $\gamma_\mathrm{k}$

:::formula
$V = b + (V_0 - b)\,\dfrac{c_0}{c}$; krogla: $r = \sqrt{\dfrac{A}{4\pi}}$, $V_\mathrm{k} = \dfrac{4}{3}\pi r^3$
:::

**Rešitev:**

1. (a) Osmotsko aktivna prostornina je $V_0 - b = 54\,\mathrm{fL}$. V $200\,\mathrm{mOsm/L}$: $V_1 = 36 + 54 \cdot \dfrac{300}{200} = 117\,\mathrm{fL}$.
2. Največja prostornina, ki jo membrana s površino $140\,\mu\mathrm{m}^2$ lahko obda, je krogla. Polmer: $r = \sqrt{\dfrac{140}{4\pi}} \approx 3{,}34\,\mu\mathrm{m}$.
3. Prostornina krogle: $V_\mathrm{k} = \dfrac{4}{3}\pi \cdot 3{,}338^3 \approx 156\,\mathrm{fL}$.
4. (b) Iz $V_\mathrm{k} = b + (V_0 - b)\dfrac{c_0}{c_\mathrm{k}}$ izrazimo $c_\mathrm{k} = \dfrac{(V_0 - b)\,c_0}{V_\mathrm{k} - b} = \dfrac{54 \cdot 300}{155{,}8 - 36} \approx 135\,\mathrm{mOsm/L}$.
5. (c) Množinska koncentracija NaCl je polovica osmolarnosti, $0{,}0676\,\mathrm{mol/L}$, zato $\gamma_\mathrm{k} = 0{,}0676 \cdot 58{,}44 \approx 3{,}95\,\mathrm{g/L}$.
6. Odgovor: v $200\,\mathrm{mOsm/L}$ eritrocit nabrekne na $117\,\mathrm{fL}$; poči pri okoli $135\,\mathrm{mOsm/L}$, kar je okoli $0{,}40\,\%$ NaCl. Res v laboratoriju hemoliza začne pri okoli $0{,}45\,\%$ in je popolna pri okoli $0{,}35\,\%$, ker so posamezni eritrociti različni.

### Primer 4: zdaj ti

Eritrociti sprejemajo glukozo s prenašalcem GLUT1 z $K_\mathrm{t} = 1{,}5\,\mathrm{mmol/L}$. Kolikšen je tok glukoze kot delež največjega pri $5\,\mathrm{mmol/L}$ in pri $10\,\mathrm{mmol/L}$? Kolikokrat se tok poveča, ko se koncentracija podvoji?

**Podatki:** $K_\mathrm{t} = 1{,}5\,\mathrm{mmol/L}$, $c_1 = 5\,\mathrm{mmol/L}$, $c_2 = 10\,\mathrm{mmol/L}$
**Iščemo:** $J_1/J_\mathrm{max}$, $J_2/J_\mathrm{max}$ in razmerje $J_2/J_1$

:::formula
$\dfrac{J}{J_\mathrm{max}} = \dfrac{c}{K_\mathrm{t} + c}$
:::

**Rešitev:**

1. Pri $5\,\mathrm{mmol/L}$: $\dfrac{J_1}{J_\mathrm{max}} = \dfrac{5}{1{,}5 + 5} \approx 0{,}77$.
2. Izračunaj še delež pri $10\,\mathrm{mmol/L}$ in razmerje $J_2/J_1$. Primerjaj z enostavno difuzijo.

:::premisli
Kolikšna sta $J_2/J_\mathrm{max}$ in $J_2/J_1$?
---
$\dfrac{J_2}{J_\mathrm{max}} = \dfrac{10}{11{,}5} \approx 0{,}87$ in $\dfrac{J_2}{J_1} \approx \dfrac{0{,}870}{0{,}769} \approx 1{,}13$. Pri podvojeni koncentraciji je tok le za $13\,\%$ večji, ker so prenašalci že skoraj vsi zasedeni. Pri enostavni difuziji bi se tok podvojil.
:::

## Pogoste napake

- **»Osmoza je difuzija raztopljene snovi.«** Pri osmozi se giblje voda, raztopljena snov pa ne, ker je membrana zanjo neprepustna. Če bi se gibala snov, bi bila to navadna difuzija.
- **»Šteje masna koncentracija.«** Raztopini z enako maso glukoze in NaCl na liter imata zelo različno osmolarnost. Šteje število delcev: NaCl ima manjšo molsko maso in razpade na dva iona.
- **»Izoosmotska raztopina je vedno izotonična.«** Sečnina s $300\,\mathrm{mOsm/L}$ prehaja membrano, zato je za eritrocit hipotonična, čeprav je izoosmotska. Toničnost upošteva le delce, ki ostanejo zunaj.
- **»Voda gre skozi membrano le skozi akvaporine.«** Voda prehaja tudi skozi sam dvosloj, a počasi. Akvaporini prehod pospešijo, kjer ga celica potrebuje, na primer v ledvicah.
- **»Olajšana difuzija porablja energijo, ker potrebuje beljakovino.«** Beljakovina snov le prepusti; smer določa gradient. Energijo porablja šele aktivni transport.

## Povzetek

- Membrana je lipidni dvosloj (okoli $5\,\mathrm{nm}$) z vgrajenimi beljakovinami; model tekočega mozaika (Singer in Nicolson, 1972). Drži jo hidrofobni učinek.
- Beljakovine so integralne, periferne in lipidno zasidrane. Membrana je asimetrična; glikokaliks je na zunanji strani.
- Fluidnost raste s temperaturo in deležem nenasičenih maščobnih kislin; holesterol jo blaži.
- Prepustnost: plini $>$ majhne polarne $>$ velike polarne $>$ ioni. Transport: enostavna in olajšana difuzija (po gradientu), primarni in sekundarni aktivni transport (proti gradientu), vezikularni transport.
- Osmoza je tok vode; šteje osmolarnost $c_\mathrm{osm} = i c$; $\Pi = c_\mathrm{osm} R T$. Toničnost upošteva le delce, ki membrane ne prehajajo.
- Prostornina celice: $V = b + (V_0 - b)\,\frac{c_0}{c}$.

## Za izpit

Znati moraš povedati:

- model tekočega mozaika in poskus Fryea in Edidina, ki dokazuje gibljivost beljakovin;
- tri dejavnike fluidnosti in zakaj holesterol deluje kot blažilnik;
- vse načine transporta z vsaj enim primerom in razliko med primarnim in sekundarnim aktivnim transportom;
- definicije osmoze, osmolarnosti, toničnosti in osmotskega tlaka ter razliko med izoosmotsko in izotonično raztopino;
- izpeljavo Boyle-van 't Hoffove zveze in njen pogoj.

### Naloga 1

Eritrocit iz Primera 3 ($V_0 = 90\,\mathrm{fL}$, $b = 36\,\mathrm{fL}$, $c_0 = 300\,\mathrm{mOsm/L}$, kritična prostornina $156\,\mathrm{fL}$) potopimo v dve raztopini: (A) $0{,}075\,\mathrm{mol/L}$ NaCl in $0{,}15\,\mathrm{mol/L}$ sečnine; (B) $0{,}05\,\mathrm{mol/L}$ NaCl in $0{,}20\,\mathrm{mol/L}$ sečnine. Sečnina prosto prehaja membrano, NaCl ne. Za vsako raztopino izračunaj osmolarnost, določi toničnost, izračunaj končno prostornino in presodi, ali eritrocit poči.

**Rešitev:**

1. (A) Osmolarnost: $2 \cdot 75 + 150 = 300\,\mathrm{mOsm/L}$. Raztopina je izoosmotska.
2. (A) Učinkovito šteje le NaCl, $150\,\mathrm{mOsm/L}$, kar je manj od $300$: raztopina je hipotonična.
3. (A) Končna prostornina: $V = 36 + 54 \cdot \dfrac{300}{150} = 144\,\mathrm{fL}$. Ker je $144 < 156$, eritrocit nabrekne, a ne poči.
4. (B) Osmolarnost: $2 \cdot 50 + 200 = 300\,\mathrm{mOsm/L}$, spet izoosmotska; učinkovito $100\,\mathrm{mOsm/L}$, hipotonična.
5. (B) $V = 36 + 54 \cdot \dfrac{300}{100} = 198\,\mathrm{fL}$, kar je več od $156\,\mathrm{fL}$: eritrocit poči.
6. Odgovor: obe raztopini sta izoosmotski in hipotonični; v A eritrocit nabrekne na $144\,\mathrm{fL}$ in ostane cel, v B bi moral doseči $198\,\mathrm{fL}$, zato poči. Osmolarnost sama ne napove, kaj se zgodi s celico.

### Naloga 2

Natančno opiši model tekočega mozaika. Opiši en poskus, ki dokazuje bočno gibljivost membranskih beljakovin, in utemelji, zakaj je prehod fosfolipida iz ene plasti v drugo mnogo počasnejši od bočnega gibanja.

**Rešitev:**

1. Model: membrana je lipidni dvosloj, ki se obnaša kot dvodimenzionalna tekočina; v njem so integralne beljakovine, na površini periferne. Lipidi in mnoge beljakovine se gibljejo bočno; sestava obeh plasti je različna (asimetrija).
2. Poskus Fryea in Edidina: zlitje mišje in človeške celice, beljakovine obeh vrst označene z različnima fluorescentnima protitelesoma. Po okoli $40\,\mathrm{min}$ pri $37\,^\circ\mathrm{C}$ sta barvi pomešani, pri nizki temperaturi ne. Sklep: beljakovine so gibljive, gibanje je odvisno od fluidnosti.
3. Drug poskus je FRAP: laser v majhnem delu membrane izbeli fluorescentne molekule, nato se svetloba vrne, ker vanj difundirajo neizbeljene molekule.
4. Flip-flop: polarna glava bi morala skozi približno $3\,\mathrm{nm}$ debelo nepolarno notranjost, kar je energijsko zelo neugodno. Bočno gibanje pa ne zahteva, da glava zapusti vodno okolje. Zato je flip-flop brez encima redek (ure do dnevi), bočni premik pa poteka v sekundah.
5. Posledica: asimetrija membrane se ohranja; vzdržujejo jo flipaze.

### Naloga 3

Bolniku v bolnišnici dajejo infuzijo $5\,\%$ glukoze ($50\,\mathrm{g/L}$, $M = 180{,}16\,\mathrm{g/mol}$). Izračunaj osmolarnost in utemelji, zakaj je ta raztopina izoosmotska s krvjo, za celice pa deluje kot hipotonična. Ali smemo z njo redčiti kri za transfuzijo?

**Rešitev:**

1. Osmolarnost: $c = \dfrac{50}{180{,}16} \approx 0{,}278\,\mathrm{mol/L}$; glukoza ne razpada, $i = 1$, zato okoli $278\,\mathrm{mOsm/L}$.
2. To je blizu $300\,\mathrm{mOsm/L}$, zato je raztopina izoosmotska s krvjo: osmometer bi pokazal skoraj enako vrednost.
3. Glukoza pa membrano prehaja. Eritrociti jo s prenašalcem GLUT1 sprejmejo v nekaj minutah (Primer 4), druge celice v telesu jo sprejmejo in presnovijo do $\mathrm{CO_2}$ in vode. Ko se glukoza porazdeli v celice ali porabi, osmotsko ne šteje več; ostane voda.
4. Odgovor: raztopina ima okoli $278\,\mathrm{mOsm/L}$ in je izoosmotska, a hipotonična, ker glukoza ne ostane zunaj celic. V telesu doda predvsem vodo, ki se porazdeli tudi v celice, zato je pri velikih količinah nevarna za otekanje celic. Krvi za transfuzijo z njo ne redčimo, temveč s fiziološko raztopino: eritrociti bi v $5\,\%$ glukozi nabrekli in hemolizirali, kot v sečnini.

## Drugače: Z analogijo

Membrano si predstavljaj kot mejni prehod z gnečo ljudi ob ograji.

- Lipidni dvosloj je ograja iz »olja«: kdor je sam majhen in »oljen« (kisik), skoči čeznjo kar sam.
- Kanal je odprta vrata, skozi katera gre množica v smeri, kamor je gneča manjša. Vrata ne potiskajo nikogar.
- Prenašalec je vrtljiv križ, ki spusti po enega. Ko so vsi križi ves čas v gibanju, več ljudi ne gre skozi, četudi jih čaka še toliko več. To je nasičenje.
- Črpalka je varnostnik, ki ljudi proti njihovi volji vleče v gnečo, a za vsak premik potrebuje plačilo: ATP.
- Sekundarni transport je par, kjer gre eden (ion $\mathrm{Na^+}$) rad iz gneče in s seboj potegne drugega (glukozo), ki bi sam ne šel.

Analogija ima mejo: ljudje vedo, kam gredo, molekule pa se gibljejo naključno. Smer neto toka določa le statistika: več delcev je tam, od koder jih več pride.

## Drugače: Uporaba v stroki

- *Celične kulture in shranjevanje krvi.* Gojišča in raztopine za shranjevanje eritrocitov morajo biti izotonične; osmolarnost merijo z osmometrom, ki meri znižanje zmrzišča.
- *Izolacija membranskih beljakovin.* Integralne beljakovine iz membrane izločijo z detergentom (npr. SDS ali blažji Triton X-100), periferne pa že s solno raztopino. To je hkrati dokaz za razdelitev beljakovin.
- *Liposomi.* Umetni mehurčki z lipidnim dvoslojem se uporabljajo kot nosilci zdravil; sorodni lipidni nanodelci prenašajo cepiva mRNA. Sestava lipidov in holesterola določa, kako stabilni so in kdaj sprostijo vsebino.
- *Hipotonična liza.* Za izolacijo organelov celice nalašč nabreknejo v hipotonični raztopini, da membrana poči, organeli pa ostanejo celi.
- *Shranjevanje živil.* Soljenje in sladkanje odvzameta vodo mikroorganizmom s plazmolizo, zato se marmelada in suho meso ne pokvarita.

## Drugače: Bolj natančno

Zakaj je prepustnost za različne molekule tako različna? Pri enostavni difuziji se molekula najprej raztopi v nepolarni notranjosti dvosloja, nato difundira skoznjo. Prepustnost iz Fickovega zakona zato zapišemo kot

$$P = \frac{K D}{d}$$

kjer je $K$ porazdelitveni koeficient (koliko bolje se snov raztaplja v olju kot v vodi), $D$ difuzijski koeficient v dvosloju in $d$ debelina hidrofobnega sloja. Že ob koncu 19. stoletja je Charles Overton opazil, da snovi, ki se dobro topijo v olju, hitro vstopajo v celice. To je bil eden prvih namigov, da je membrana iz lipidov.

Za ione je $K$ izjemno majhen, ker bi moral ion v nepolarnem okolju izgubiti ovoj molekul vode, kar stane veliko energije. Zato se prepustnost dvosloja za $\mathrm{K^+}$ in za vodo razlikuje za okoli devet velikostnih redov, približno milijardokrat. Kanali to oviro obidejo: ion gre skozi vodno pot v beljakovini, ki mu delno nadomesti vodni ovoj.

Pri ionih šteje poleg koncentracije še električni potencial membrane. Ravnotežje za en ion opiše Nernstova enačba, osnova za razumevanje mirovnega membranskega potenciala.

## Preveri se

? Katera snov se ne ujema s skupino, ker skozi čisti lipidni dvosloj praktično ne gre?
- $\mathrm{O_2}$
~ Kisik je majhen in nepolaren, zato gre skozi dvosloj z enostavno difuzijo.
- $\mathrm{CO_2}$
~ Ogljikov dioksid je majhen in skoraj nepolaren; z difuzijo zapušča celice.
- etanol
~ Etanol je majhna polarna molekula z nepolarnim delom, zato prehaja dvosloj dovolj hitro.
+ $\mathrm{Na^+}$
> Ion ima naboj in ovoj vode, zato skozi nepolarno notranjost ne gre; potrebuje kanal ali prenašalec.

? Kolikšna je osmolarnost raztopine $0{,}1\,\mathrm{mol/L}$ $\mathrm{CaCl_2}$?
- $100\,\mathrm{mOsm/L}$
~ To je množinska koncentracija; $\mathrm{CaCl_2}$ razpade na tri ione.
- $200\,\mathrm{mOsm/L}$
~ Upoštevan je le $\mathrm{Ca^{2+}}$ in en $\mathrm{Cl^-}$; kloridna iona sta dva.
+ $300\,\mathrm{mOsm/L}$
> $\mathrm{CaCl_2} \to \mathrm{Ca^{2+}} + 2\,\mathrm{Cl^-}$, $i = 3$: $3 \cdot 0{,}1 = 0{,}3\,\mathrm{Osm/L}$.

? Kaj se zgodi s fluidnostjo membrane, če se v njej poveča delež nasičenih maščobnih kislin pri isti temperaturi?
- Fluidnost se poveča, ker so nasičeni repi krajši.
~ Nasičenost ne pomeni krajše verige; pomeni, da ni dvojnih vezi in pregibov.
+ Fluidnost se zmanjša, ker se ravni repi tesneje zložijo.
- Fluidnost se ne spremeni, ker jo določa le holesterol.
~ Holesterol fluidnost blaži, a nanjo vplivata tudi temperatura in sestava repov.
> Brez pregibov *cis* se repi zložijo tesno, več je privlakov med njimi, zato je dvosloj bolj urejen in manj tekoč.

? Študent piše: »1) Eritrocit ima $300\,\mathrm{mOsm/L}$. 2) Raztopina glicerola ima $300\,\mathrm{mOsm/L}$. 3) Osmolarnosti sta enaki. 4) Eritrocit v njej ostane nespremenjen.« Kateri korak je napačen?
- Korak 1.
~ Osmolarnost citosola je res okoli $300\,\mathrm{mOsm/L}$.
- Korak 3.
~ Osmolarnosti sta res enaki; to še ne pove, kako deluje raztopina na celico.
+ Korak 4.
- Korak 2.
~ Raztopina je lahko pripravljena tako; podatek sam ni napačen.
> Glicerol prehaja membrano, zato je raztopina hipotonična: glicerol vstopa, za njim voda, eritrocit nabrekne.

? Solato preliješ s slanim prelivom in po pol ure je listje uvelo. Kaj se je zgodilo v celicah?
- Sol je vstopila v celice in jih razgradila.
~ Membrana ionov skoraj ne prepušča; listje uvene zaradi vode, ne soli v celicah.
+ Preliv je bil hipertoničen, voda je izstopila iz celic in protoplasti so se plazmolizirali.
- Preliv je bil hipotoničen, celice so nabreknile in počile.
~ V hipotonični raztopini bi celice nabreknile, listje pa bi bilo še bolj čvrsto zaradi turgorja.
> Celični sok ima manjšo osmolarnost od slanega preliva, zato voda izstopa; turgor pade in list ovene.

:::simboli
J | gostota toka snovi | J = P\,\Delta c | mol\,m^{-2}\,s^{-1}
P | prepustnost membrane | | m/s
\Delta c | razlika koncentracij | | mol/m^3
J_\mathrm{max} | največji tok s prenašalcem | | mol\,m^{-2}\,s^{-1}
K_\mathrm{t} | koncentracija polovičnega toka | | mmol/L
c | koncentracija snovi | | mol/L
\Pi | osmotski tlak | \Pi = c_\mathrm{osm} R T | Pa
c_\mathrm{osm} | osmolarnost | c_\mathrm{osm} = i\,c | Osm/L
i | število delcev na formulsko enoto | | –
R | splošna plinska konstanta | | J/(mol\,K) | $8{,}314$
T | absolutna temperatura | | K
V | prostornina celice | V = b + (V_0 - b)\,\frac{c_0}{c} | fL
V_0 | začetna prostornina celice | | fL
b | osmotsko neaktivna prostornina | | fL
c_0 | začetna osmolarnost | | mOsm/L
m | masa topljenca | m = \gamma V_\mathrm{r} | g
V_\mathrm{r} | prostornina raztopine | | L
\gamma | masna koncentracija | | g/L
M | molska masa | | g/mol
K | porazdelitveni koeficient olje/voda | | –
D | difuzijski koeficient v dvosloju | | m^2/s
d | debelina hidrofobnega sloja | | m
A | površina eritrocita | | \mu m^2
r | polmer krogle | r = \sqrt{\frac{A}{4\pi}} | \mu m
V_\mathrm{k} | kritična prostornina | V_\mathrm{k} = \frac{4}{3}\pi r^3 | fL
:::
