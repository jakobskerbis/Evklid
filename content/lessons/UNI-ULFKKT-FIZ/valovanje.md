---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Christian Doppler je predlagal, da gibanje zvezde spremeni barvo njene svetlobe. Zamisel so kmalu preizkusili z zvokom: na odprtem vagonu vlaka so glasbeniki igrali stalen ton, poslušalci z dobrim posluhom ob progi pa so slišali, da je ton med približevanjem višji in med oddaljevanjem nižji. Že pred tem je Newton izračunal hitrost zvoka v zraku in dobil približno $15\,\%$ premajhno vrednost; napako je pozneje popravil Laplace, ko je upošteval, da se zrak v zvočnem valu stiska adiabatno. Isti matematični opis velja za zvok, val na struni, potresni sunek in svetlobo. Danes ga srečaš pri ultrazvočnem pregledu, v vsakem glasbilu in pri radarju, ki izmeri hitrost avtomobila, preden voznik plača kazen.

## Razlaga

### Kaj potuje, ko potuje val?

Zapeljiva predstava je, da val nese snov s seboj: da zvok »priteče« od zvočnika do ušesa kot pihljaj zraka. Pobarvaj košček vrvi in pošlji po njej val: košček poskoči gor in dol in se vrne na svoje mesto. Potuje **motnja** in z njo energija, snov pa le niha okoli svoje lege. Valovanje je torej način, kako se energija širi po prostoru, ne da bi se snov premaknila z enega kraja na drugega.

**1. Vrste valovanja.** Pri **transverzalnem** valovanju delci nihajo pravokotno na smer širjenja (val na vrvi; pri svetlobi tako nihata električno in magnetno polje). Pri **longitudinalnem** nihajo vzdolž smeri širjenja (zvok v plinih in tekočinah, kjer se izmenjujejo zgoščine in razredčine). V trdninah se lahko širita obe vrsti z različnima hitrostma.

### Opis in hitrost

**2. Sinusno valovanje.** Odmik delcev v valovanju, ki se širi v smeri $+x$, je

$$s(x, t) = s_0\sin(kx - \omega t).$$

Pri tem je $s_0$ amplituda, $\omega = 2\pi\nu$ krožna frekvenca, $k = 2\pi/\lambda$ **valovno število**, $\lambda$ **valovna dolžina**. Točka z enako fazo (npr. vrh vala) se premika s **hitrostjo valovanja** (fazno hitrostjo): iz $kx - \omega t = \text{konst.}$ sledi $k\,\mathrm{d}x = \omega\,\mathrm{d}t$, torej

$$c = \frac{\mathrm{d}x}{\mathrm{d}t} = \frac{\omega}{k} = \lambda\nu.$$

Valovanje v smeri $-x$ zapišemo s $\sin(kx + \omega t)$. Pozor: $c$ je hitrost širjenja motnje; hitrost delca $\partial s/\partial t$ je nekaj drugega in ima amplitudo $\omega s_0$.

**3. Valovna enačba.** Naj bo struna homogena z dolžinsko gostoto $\mu = m/l$, napeta s silo $F$, odmiki pa majhni ($|\partial s/\partial x| \ll 1$, sila v struni se zato ne spremeni); težo in dušenje zanemarimo. Potem prečni odmik zadošča

$$\frac{\partial^2 s}{\partial t^2} = c^2\,\frac{\partial^2 s}{\partial x^2}, \qquad c = \sqrt{\frac{F}{\mu}}.$$

*Izpeljava:* na kos med $x$ in $x + \mathrm{d}x$ z maso $\mu\,\mathrm{d}x$ deluje prečna sila $F\left[\frac{\partial s}{\partial x}(x + \mathrm{d}x) - \frac{\partial s}{\partial x}(x)\right] = F\frac{\partial^2 s}{\partial x^2}\mathrm{d}x$, drugi Newtonov zakon pa da $\mu\,\mathrm{d}x\,\frac{\partial^2 s}{\partial t^2} = F\frac{\partial^2 s}{\partial x^2}\mathrm{d}x$.

To je **valovna enačba**. Rešitev je vsaka dvakrat odvedljiva funkcija oblike $s = f(x - ct) + g(x + ct)$; za $s = f(x - ct)$ je namreč $\partial^2 s/\partial t^2 = c^2f''$ in $\partial^2 s/\partial x^2 = f''$. Motnja poljubne oblike torej potuje nespremenjena v obe smeri. Za zvok v plinu velja enaka enačba za tlak ali odmik, hitrost pa je

$$c = \sqrt{\frac{\kappa RT}{M}},$$

kjer je $\kappa = c_p/c_V$ razmerje specifičnih toplot (za zrak $1{,}4$), $T$ absolutna temperatura in $M$ molska masa. *Izpeljava (Laplace):* v snovi je $c = \sqrt{K/\rho}$ s stisljivostnim modulom $K = -V\,\mathrm{d}p/\mathrm{d}V$. Stiskanja v zvočnem valu so hitra, zato adiabatna: iz $pV^\kappa = \text{konst.}$ je $\mathrm{d}p/\mathrm{d}V = -\kappa p/V$ in $K = \kappa p$. Za idealni plin je $\rho = pM/(RT)$, zato $c = \sqrt{\kappa p/\rho} = \sqrt{\kappa RT/M}$. Ista formula $c = \sqrt{K/\rho}$ velja v tekočini; v vodi je zvok okoli $1500\,\mathrm{m/s}$, v zraku pri $20\,^\circ\mathrm{C}$ pa okoli $343\,\mathrm{m/s}$.

:::premisli
Če vrv tresemo hitreje (z večjo frekvenco), ali val po njej steče hitreje?
---
Ne. Hitrost določata le sila v vrvi in njena dolžinska gostota, $c = \sqrt{F/\mu}$. Večja frekvenca da pri isti hitrosti krajšo valovno dolžino, $\lambda = c/\nu$.
:::

### Energija in zvok

**4. Energija in jakost.** Valovanje prenaša energijo. **Gostota energijskega toka** (jakost) $j$ je moč, ki preteče skozi enoto površine pravokotno na smer širjenja, $j = P/S$, enota $\mathrm{W/m^2}$. Za sinusno valovanje je $j \propto s_0^2\omega^2$; za zvok v snovi z gostoto $\rho$ je $j = \tfrac12\rho c\,\omega^2s_0^2$. Naj točkast izvir z močjo $P$ seva enakomerno na vse strani in naj snov energije ne absorbira. Potem skozi vsako sfero s polmerom $r$ v stacionarnem stanju preteče vsa moč $P$, zato je na razdalji $r$

$$j = \frac{P}{4\pi r^2}.$$

**5. Zvok in decibeli.** Uho zazna jakosti od približno $j_0 = 10^{-12}\,\mathrm{W/m^2}$ (prag slišnosti pri $1\,\mathrm{kHz}$) do približno $1\,\mathrm{W/m^2}$ (prag bolečine). Ker je razpon tako velik, uporabljamo logaritemsko **raven jakosti zvoka**

$$L = 10\,\mathrm{dB} \cdot \log_{10}\frac{j}{j_0}.$$

Desetkrat večja jakost pomeni $10\,\mathrm{dB}$ več, dvakrat večja pa okoli $3\,\mathrm{dB}$ več. Slišimo frekvence od okoli $20\,\mathrm{Hz}$ do $20\,\mathrm{kHz}$; nad tem je **ultrazvok**, pod tem **infrazvok**.

### Stoječe valovanje

**6. Superpozicija in odboj.** Ker je valovna enačba linearna, se odmika dveh valovanj seštejeta. Na trdno vpetem koncu strune se val odbije z obrnjeno fazo (odmik mora biti tam nič), na prostem koncu pa brez spremembe faze. Če se seštejeta valovanji z bližnjima frekvencama $\nu_1$ in $\nu_2$, glasnost niha s frekvenco $|\nu_1 - \nu_2|$; temu pravimo **utripanje**.

**7. Stoječe valovanje.** Seštejmo dve enaki valovanji, ki potujeta v nasprotnih smereh (z $\sin a + \sin b = 2\sin\frac{a+b}{2}\cos\frac{a-b}{2}$):

$$s = s_0\sin(kx - \omega t) + s_0\sin(kx + \omega t) = 2s_0\sin(kx)\cos(\omega t).$$

To ni več potujoče valovanje: vsak delec niha z amplitudo $2s_0|\sin kx|$. V **vozlih** ($\sin kx = 0$, vsako polovico valovne dolžine) delci mirujejo, v **hrbtih** pa nihajo z največjo amplitudo. Razdalja med sosednjima vozloma je $\lambda/2$.

**8. Lastna nihanja.** Naj bo struna z dolžino $l$ vpeta na obeh koncih: $s(0, t) = s(l, t) = 0$ za vsak $t$. Stoječe valovanje $2s_0\sin(kx)\cos(\omega t)$ izpolni prvi pogoj samo po sebi, drugi pa zahteva $\sin kl = 0$, torej $kl = n\pi$. Na dolžino gre celo število polovic valovne dolžine, $l = n\lambda_n/2$, zato so **lastne frekvence**

$$\nu_n = n\,\frac{c}{2l}, \qquad n = 1, 2, 3, \dots$$

Frekvenca $\nu_1$ je **osnovna**, višje so **višje harmonične frekvence**. Enako velja za piščal, odprto na obeh koncih (na odprtih koncih so hrbti). Piščal, zaprta na enem koncu, ima na zaprtem koncu vozel, na odprtem hrbet, zato je $l = (2n - 1)\lambda/4$ in

$$\nu_n = (2n - 1)\,\frac{c}{4l},$$

torej le lihi večkratniki osnovne frekvence.

:::premisli
Zakaj ima piščal, zaprta na enem koncu, nižji osnovni ton kot enako dolga odprta piščal?
---
V zaprti piščali je pri osnovnem nihanju na dolžini le četrtina valovne dolžine ($\lambda_1 = 4l$), v odprti pa polovica ($\lambda_1 = 2l$). Pri enaki hitrosti zvoka ima zaprta piščal dvakrat daljšo valovno dolžino, zato pol nižjo frekvenco (oktavo nižje).
:::

### Dopplerjev pojav

Pogosto slišiš, da sirena zveni višje, ker je bližje. Bližina pa spremeni le glasnost; višina tona je odvisna od smeri gibanja: ton je visok ves čas približevanja in pade v trenutku, ko gre avto mimo.

**9. Dopplerjev pojav.** Naj izvir oddaja zvok s frekvenco $\nu$, hitrost zvoka glede na mirujoči zrak naj bo $c$. Če se opazovalec giblje proti izviru s hitrostjo $v_o$, izvir pa proti opazovalcu s hitrostjo $v_i < c$ (obe glede na zrak in vzdolž njune zveznice), opazovalec sliši frekvenco

$$\nu' = \nu\,\frac{c + v_o}{c - v_i}.$$

*Izpeljava:* izvir odda fronto vsako periodo $1/\nu$ in se medtem premakne za $v_i/\nu$, zato je razmik front pred njim $\lambda' = (c - v_i)/\nu$. Opazovalec jih srečuje z relativno hitrostjo $c + v_o$, torej s frekvenco $\nu' = (c + v_o)/\lambda'$. Pri oddaljevanju vstavimo negativni hitrosti. Gibanje izvira zgosti ali razredči valovne fronte (spremeni valovno dolžino), gibanje opazovalca pa spremeni, kako pogosto fronte srečuje. Ko je hitrost izvira večja od $c$, nastane udarni val (Machov stožec, pok letala).

## Rešeni primeri

### Primer 1 (lažji)

Kitarska struna ima med vpetiščema dolžino $0{,}65\,\mathrm{m}$, njena dolžinska gostota je $4{,}0\,\mathrm{g/m}$, napeta pa je s silo $120\,\mathrm{N}$. Kolikšna je hitrost valovanja na struni, kolikšna je osnovna frekvenca in kolikšna frekvenca drugega lastnega nihanja?

**Podatki:** $l = 0{,}65\,\mathrm{m}$, $\mu = 4{,}0\,\mathrm{g/m} = 4{,}0 \cdot 10^{-3}\,\mathrm{kg/m}$, $F = 120\,\mathrm{N}$, struna vpeta na obeh koncih
**Iščemo:** hitrost $c$, frekvenci $\nu_1$ in $\nu_2$

:::formula
$c = \sqrt{F/\mu}$, $\nu_n = n\,\dfrac{c}{2l}$
:::

**Rešitev:**

1. Hitrost določata sila in dolžinska gostota strune: $c = \sqrt{120\,\mathrm{N}/4{,}0 \cdot 10^{-3}\,\mathrm{kg/m}} = \sqrt{30\,000}\,\mathrm{m/s} \approx 173\,\mathrm{m/s}$.
2. Pri osnovnem nihanju sta vozla le na koncih: $\nu_1 = 173{,}2\,\mathrm{m/s}/(2 \cdot 0{,}65\,\mathrm{m}) \approx 133\,\mathrm{Hz}$; valovna dolžina je $\lambda_1 = 2l = 1{,}30\,\mathrm{m}$.
3. $\nu_2 = 2\nu_1 \approx 266\,\mathrm{Hz}$; struna ima takrat vozel tudi na sredini.
4. Odgovor: valovanje potuje po struni s hitrostjo okoli $173\,\mathrm{m/s}$, osnovna frekvenca je približno $133\,\mathrm{Hz}$, drugo lastno nihanje pa ima frekvenco približno $266\,\mathrm{Hz}$.

### Primer 2

Piščal z dolžino $0{,}50\,\mathrm{m}$ je zaprta na enem koncu. Zrak v njej ima temperaturo $20\,^\circ\mathrm{C}$. Kolikšna je hitrost zvoka v zraku, kolikšna je osnovna frekvenca piščali in kolikšna naslednja lastna frekvenca? Za zrak vzemi $\kappa = 1{,}4$, $M = 29\,\mathrm{g/mol}$ in $R = 8{,}314\,\mathrm{J/(mol\,K)}$.

**Podatki:** $l = 0{,}50\,\mathrm{m}$, en konec zaprt, $T = 20\,^\circ\mathrm{C} = 293{,}15\,\mathrm{K}$, $\kappa = 1{,}4$, $M = 0{,}029\,\mathrm{kg/mol}$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** hitrost zvoka $c$, frekvenci $\nu_1$ in $\nu_2$

:::formula
$c = \sqrt{\kappa RT/M}$, zaprta piščal: $\nu_n = (2n - 1)\,\dfrac{c}{4l}$
:::

**Rešitev:**

1. Zvok v zraku je adiabaten, temperatura je v kelvinih: $c = \sqrt{1{,}4 \cdot 8{,}314 \cdot 293{,}15/0{,}029}\,\mathrm{m/s} \approx 343\,\mathrm{m/s}$.
2. Osnovno nihanje: na dolžino gre četrtina valovne dolžine, $\lambda_1 = 4l = 2{,}0\,\mathrm{m}$, zato $\nu_1 = 343\,\mathrm{m/s}/2{,}0\,\mathrm{m} \approx 172\,\mathrm{Hz}$.
3. Naslednje lastno nihanje ima $l = 3\lambda/4$, torej $\nu_2 = 3\nu_1 \approx 515\,\mathrm{Hz}$. Frekvence $2\nu_1$ zaprta piščal nima.
4. Odgovor: zvok ima hitrost okoli $343\,\mathrm{m/s}$, osnovna frekvenca piščali je okoli $172\,\mathrm{Hz}$, naslednja lastna frekvenca pa okoli $515\,\mathrm{Hz}$ (trikratnik osnovne).

### Primer 3 (težji)

Mimo opazovalca, ki stoji ob cesti, pelje rešilni avto s sireno. Ko se avto približuje, opazovalec sliši frekvenco $760\,\mathrm{Hz}$, ko se oddaljuje, pa $650\,\mathrm{Hz}$. Hitrost zvoka je $340\,\mathrm{m/s}$, zrak miruje. S kolikšno hitrostjo pelje avto in kolikšno frekvenco oddaja sirena? Kolikšno frekvenco sliši kolesar, ki se avtu pelje naproti s hitrostjo $6{,}0\,\mathrm{m/s}$?

**Podatki:** $\nu_\mathrm{p} = 760\,\mathrm{Hz}$ (približevanje), $\nu_\mathrm{o} = 650\,\mathrm{Hz}$ (oddaljevanje), $c = 340\,\mathrm{m/s}$, opazovalec miruje ($v_o = 0$), zrak miruje; kolesar $v_o = 6{,}0\,\mathrm{m/s}$ proti avtu
**Iščemo:** hitrost avtomobila $v_i$, frekvenco sirene $\nu$, frekvenco $\nu_\mathrm{k}$, ki jo sliši kolesar

:::formula
Mirujoč opazovalec: $\nu_\mathrm{p} = \nu\,\dfrac{c}{c - v_i}$, $\nu_\mathrm{o} = \nu\,\dfrac{c}{c + v_i}$; splošno $\nu' = \nu\,\dfrac{c + v_o}{c - v_i}$, $\lambda' = \dfrac{c - v_i}{\nu}$
:::

**Rešitev:**

1. Delimo enačbi, da se znebimo neznane $\nu$: $\dfrac{\nu_\mathrm{p}}{\nu_\mathrm{o}} = \dfrac{c + v_i}{c - v_i}$.
2. Rešimo za $v_i$: $\nu_\mathrm{p}(c - v_i) = \nu_\mathrm{o}(c + v_i)$, torej $v_i = c\,\dfrac{\nu_\mathrm{p} - \nu_\mathrm{o}}{\nu_\mathrm{p} + \nu_\mathrm{o}} = 340\,\mathrm{m/s} \cdot \dfrac{110}{1410} \approx 26{,}5\,\mathrm{m/s}$.
3. Frekvenca sirene: $\nu = \nu_\mathrm{p}\,(c - v_i)/c = 760\,\mathrm{Hz} \cdot 313{,}5/340 \approx 701\,\mathrm{Hz}$.
4. Preizkus z drugo enačbo: $\nu = \nu_\mathrm{o}\,(c + v_i)/c = 650\,\mathrm{Hz} \cdot 366{,}5/340 \approx 701\,\mathrm{Hz}$ ✓.
5. Kolesar je pred avtom, kjer je valovna dolžina skrajšana: $\lambda' = (c - v_i)/\nu = c/\nu_\mathrm{p} = 340/760\,\mathrm{m} \approx 0{,}447\,\mathrm{m}$. Fronte srečuje z relativno hitrostjo $c + v_o = 346\,\mathrm{m/s}$, zato $\nu_\mathrm{k} = (c + v_o)/\lambda' = 346 \cdot 760/340\,\mathrm{Hz} \approx 773\,\mathrm{Hz}$.
6. Odgovor: avto pelje s hitrostjo približno $26{,}5\,\mathrm{m/s}$ (okoli $95\,\mathrm{km/h}$), sirena oddaja frekvenco približno $700\,\mathrm{Hz}$, kolesar pa sliši približno $773\,\mathrm{Hz}$.

### Primer 4 – zdaj ti

V trgovini z glasbili prodajalec uglašuje ukulele za kupca. Struna A ima med vpetiščema dolžino $0{,}35\,\mathrm{m}$ in dolžinsko gostoto $0{,}40\,\mathrm{g/m}$, njena osnovna frekvenca naj bo $440\,\mathrm{Hz}$. S kolikšno silo mora biti napeta? Za koliko odstotkov mora silo povečati, da se ton zviša za polton (frekvenca $1{,}059$-krat večja)?

**Podatki:** $l = 0{,}35\,\mathrm{m}$, $\mu = 0{,}40\,\mathrm{g/m} = 4{,}0 \cdot 10^{-4}\,\mathrm{kg/m}$, $\nu_1 = 440\,\mathrm{Hz}$, struna vpeta na obeh koncih, polton: $\nu' = 1{,}059\,\nu_1$
**Iščemo:** silo $F$ in relativno povečanje sile za polton

:::formula
$\nu_1 = \dfrac{c}{2l}$, $c = \sqrt{F/\mu}$, torej $F = \mu c^2$ in $F \propto \nu_1^2$
:::

**Rešitev:**

1. Struna je vpeta na obeh koncih, zato je pri osnovnem nihanju na njej pol valovne dolžine: $\lambda_1 = 2l = 0{,}70\,\mathrm{m}$.
2. Hitrost valovanja dobimo iz frekvence in valovne dolžine: $c = \lambda_1\nu_1 = 0{,}70 \cdot 440\,\mathrm{m/s} = 308\,\mathrm{m/s}$.
3. Zdaj ti: iz $c = \sqrt{F/\mu}$ izrazi in izračunaj silo $F$.
4. Zdaj ti: za koliko odstotkov mora prodajalec povečati silo, da se frekvenca poveča $1{,}059$-krat?

:::premisli
Kolikšna je sila in za koliko jo je treba povečati?
---
$F = \mu c^2 = 4{,}0 \cdot 10^{-4}\,\mathrm{kg/m} \cdot (308\,\mathrm{m/s})^2 \approx 37{,}9\,\mathrm{N}$. Ker je $\nu_1 \propto \sqrt{F}$, je $F \propto \nu_1^2$: $1{,}059^2 \approx 1{,}12$, zato mora silo povečati za približno $12\,\%$ (na okoli $42{,}6\,\mathrm{N}$).
:::

## Pogoste napake

- **Hitrost valovanja in hitrost delcev.** $c = \lambda\nu$ je hitrost širjenja motnje; delci le nihajo okoli svojih leg. Pri zvoku zrak ne »potuje« od izvira do ušesa.
- **Frekvenca se pri prehodu spremeni.** Ko gre valovanje v drugo snov, ostane frekvenca enaka (določa jo izvir), spremenita se hitrost in valovna dolžina.
- **Decibeli se seštevajo.** Dva enako glasna izvira po $60\,\mathrm{dB}$ ne dasta $120\,\mathrm{dB}$, ampak približno $63\,\mathrm{dB}$: sešteti moramo jakosti, ne ravni.
- **Razdalja med vozloma.** Sosednja vozla sta narazen $\lambda/2$, ne $\lambda$. Zato je pri struni osnovna valovna dolžina $2l$.
- **Zaprta piščal in sode harmonične frekvence.** Piščal, zaprta na enem koncu, ima le lihe večkratnike osnovne frekvence.
- **Predznaki pri Dopplerjevem pojavu.** Preveri s pametjo: pri približevanju mora biti frekvenca višja, pri oddaljevanju nižja. Gibanje izvira in gibanje opazovalca z isto hitrostjo ne dasta enakega rezultata.

## Povzetek

- Sinusno valovanje: $s = s_0\sin(kx - \omega t)$, $k = 2\pi/\lambda$, $\omega = 2\pi\nu$, $c = \lambda\nu = \omega/k$.
- Valovna enačba $\partial^2s/\partial t^2 = c^2\,\partial^2s/\partial x^2$; struna $c = \sqrt{F/\mu}$, plin $c = \sqrt{\kappa RT/M}$.
- Jakost $j = P/S$, točkast izvir $j = P/(4\pi r^2)$; raven $L = 10\,\mathrm{dB}\log_{10}(j/j_0)$, $j_0 = 10^{-12}\,\mathrm{W/m^2}$.
- Stoječe valovanje $2s_0\sin kx\cos\omega t$: vozli na razmiku $\lambda/2$; struna in odprta piščal $\nu_n = nc/(2l)$, zaprta piščal $\nu_n = (2n - 1)c/(4l)$.
- Dopplerjev pojav: $\nu' = \nu(c + v_o)/(c - v_i)$, hitrosti pozitivne pri približevanju.

## Za izpit

Znati moraš povedati:

- definicije valovne dolžine, valovnega števila, krožne frekvence in fazne hitrosti ter izpeljavo $c = \omega/k = \lambda\nu$;
- izpeljavo valovne enačbe za struno s predpostavkami in dokaz, da je $f(x - ct) + g(x + ct)$ njena rešitev;
- stoječe valovanje kot vsoto dveh nasprotnih valovanj in izpeljavo lastnih frekvenc strune ter odprte in zaprte piščali iz robnih pogojev;
- izpeljavo hitrosti zvoka v plinu $c = \sqrt{\kappa RT/M}$ in zakaj je stiskanje adiabatno;
- Dopplerjevo formulo s pogoji in izpeljavo.

### Naloga 1

Jeklena struna z dolžino $0{,}60\,\mathrm{m}$ in maso $3{,}0\,\mathrm{g}$ je vpeta na obeh koncih. Njeno drugo lastno nihanje je pri $20\,^\circ\mathrm{C}$ v resonanci z osnovnim tonom piščali, dolge $0{,}25\,\mathrm{m}$ in zaprte na enem koncu; hitrost zvoka pri $20\,^\circ\mathrm{C}$ je $343\,\mathrm{m/s}$. S kolikšno silo je napeta struna? Dvorana se segreje na $30\,^\circ\mathrm{C}$, struna pa se ne spremeni. Koliko utripov na sekundo slišimo, ko zvenita struna (drugi ton) in piščal hkrati?

**Rešitev:**

1. Osnovni ton zaprte piščali: $\nu_1 = c/(4l) = 343/(4 \cdot 0{,}25)\,\mathrm{Hz} = 343\,\mathrm{Hz}$.
2. Drugi ton strune je $\nu_2 = 2c_s/(2l_s) = c_s/l_s$; enačimo z $343\,\mathrm{Hz}$: $c_s = 343\,\mathrm{Hz} \cdot 0{,}60\,\mathrm{m} = 205{,}8\,\mathrm{m/s}$.
3. Dolžinska gostota: $\mu = 3{,}0 \cdot 10^{-3}\,\mathrm{kg}/0{,}60\,\mathrm{m} = 5{,}0 \cdot 10^{-3}\,\mathrm{kg/m}$.
4. Sila iz $c_s = \sqrt{F/\mu}$: $F = \mu c_s^2 = 5{,}0 \cdot 10^{-3} \cdot 205{,}8^2\,\mathrm{N} \approx 212\,\mathrm{N}$.
5. Hitrost zvoka je sorazmerna s $\sqrt{T}$: $c' = 343\,\mathrm{m/s} \cdot \sqrt{303{,}15/293{,}15} \approx 348{,}8\,\mathrm{m/s}$, zato ima piščal ($4l = 1{,}0\,\mathrm{m}$) $\nu_1' = 348{,}8/1{,}0\,\mathrm{Hz} \approx 348{,}8\,\mathrm{Hz}$.
6. Frekvenca strune je odvisna le od $F$, $\mu$ in $l_s$, zato ostane $343\,\mathrm{Hz}$. Frekvenca utripanja je razlika frekvenc: $348{,}8 - 343 \approx 5{,}8\,\mathrm{Hz}$.
7. Odgovor: struna je napeta s silo približno $212\,\mathrm{N}$; v topli dvorani slišimo okoli $5{,}8$ utripa na sekundo.

### Naloga 2

Navedi predpostavke in izpelji valovno enačbo za napeto struno. Dokaži, da je $s = f(x - ct)$ njena rešitev, in iz robnih pogojev izpelji lastne frekvence strune, vpete na obeh koncih.

**Rešitev:**

1. Predpostavke: homogena struna z dolžinsko gostoto $\mu$, sila $F$ povsod enaka, majhni prečni odmiki ($|\partial s/\partial x| \ll 1$, zato $\sin\vartheta \approx \tan\vartheta = \partial s/\partial x$), teže in dušenja ni.
2. Na kos $[x, x + \mathrm{d}x]$ delujeta na koncih sili $F$ v smeri tangent; prečni komponenti sta $F\,\partial s/\partial x$ pri $x + \mathrm{d}x$ in $-F\,\partial s/\partial x$ pri $x$.
3. Rezultanta je $F\,\frac{\partial^2s}{\partial x^2}\mathrm{d}x$, masa $\mu\,\mathrm{d}x$; Newtonov zakon da $\frac{\partial^2s}{\partial t^2} = \frac{F}{\mu}\frac{\partial^2s}{\partial x^2}$, torej $c = \sqrt{F/\mu}$.
4. Za $s = f(u)$, $u = x - ct$, je $\partial s/\partial x = f'$, $\partial^2s/\partial x^2 = f''$, $\partial s/\partial t = -cf'$, $\partial^2s/\partial t^2 = c^2f''$; enačba je izpolnjena za vsako dvakrat odvedljivo $f$.
5. Nastavek $s = X(x)\cos\omega t$ da $X'' + k^2X = 0$ s $k = \omega/c$, torej $X = A\sin kx + B\cos kx$.
6. $X(0) = 0$ da $B = 0$; $X(l) = 0$ pri $A \neq 0$ zahteva $\sin kl = 0$, torej $k_n = n\pi/l$, $n = 1, 2, \dots$
7. Odgovor: $\nu_n = \dfrac{\omega_n}{2\pi} = \dfrac{ck_n}{2\pi} = n\,\dfrac{c}{2l}$.

### Naloga 3

Utemelji, ali opazovalec sliši enako frekvenco, če se izvir s hitrostjo $v$ približuje mirujočemu opazovalcu ali pa se opazovalec z enako hitrostjo približuje mirujočemu izviru (zrak miruje). Odgovor podpri z izračunom za $v = 34\,\mathrm{m/s}$, $c = 340\,\mathrm{m/s}$.

**Rešitev:**

1. Gibajoč se izvir: $\nu'/\nu = c/(c - v)$; gibajoč se opazovalec: $\nu'/\nu = (c + v)/c$.
2. Razlika: $\dfrac{c}{c - v} - \dfrac{c + v}{c} = \dfrac{c^2 - (c^2 - v^2)}{c(c - v)} = \dfrac{v^2}{c(c - v)} > 0$.
3. Izračun: $340/306 \approx 1{,}111$ in $374/340 = 1{,}100$; razlika je $34^2/(340 \cdot 306) \approx 0{,}011$.
4. Odgovor: ne; gibanje izvira da višjo frekvenco, ker skrajša valovno dolžino v zraku, gibanje opazovalca pa le poveča hitrost srečevanja front. Pri $v \ll c$ se razlika zmanjša na člen reda $(v/c)^2$; za zvok šteje gibanje glede na zrak, ne le relativna hitrost.

## Drugače: Na sliki

Prva tri lastna nihanja strune, vpete na obeh koncih (V = vozel, H = hrbet):

```
n = 1:   V~~~~~~~~H~~~~~~~~V          l = λ/2
n = 2:   V~~~~H~~~~V~~~~H~~~~V        l = λ
n = 3:   V~~H~~V~~H~~V~~H~~V          l = 3λ/2
```

Zaprta piščal (zaprto levo, odprto desno):

```
n = 1:   V~~~~~~~~~~~~H               l = λ/4
n = 2:   V~~~~H~~~~V~~~~H             l = 3λ/4
```

Dopplerjev pojav si predstavljaj kot krožne valovne fronte, ki jih izvir odda vsako periodo. Pri mirujočem izviru so krogi koncentrični. Ko se izvir premika v desno, je središče vsakega novega kroga bolj desno, zato so krogi pred izvirom zgoščeni (krajša valovna dolžina, višja frekvenca), za njim pa razredčeni.

## Drugače: Uporaba v stroki

**Dopplerjev ultrazvok v medicini.** Ultrazvok s frekvenco $5\,\mathrm{MHz}$ se odbije od rdečih krvničk, ki se gibljejo s hitrostjo $0{,}30\,\mathrm{m/s}$ proti sondi; v mehkem tkivu je hitrost zvoka okoli $1540\,\mathrm{m/s}$. Krvničke so najprej gibajoči se opazovalec, nato gibajoč se izvir, zato je frekvenčni premik dvojni: $\Delta\nu \approx 2\nu v/c = 2 \cdot 5 \cdot 10^6\,\mathrm{Hz} \cdot 0{,}30/1540 \approx 1{,}9\,\mathrm{kHz}$, kar aparat predvaja kot zvok.

**Neporušne preiskave.** Ultrazvočni defektoskop pošlje v jekleni ulitek sunek s frekvenco $5\,\mathrm{MHz}$; v jeklu je hitrost longitudinalnega valovanja okoli $5900\,\mathrm{m/s}$. Odmev od razpoke, ki pride po $10\,\mathrm{\mu s}$, pomeni globino $d = ct/2 \approx 3\,\mathrm{cm}$. Valovna dolžina $\lambda \approx 1{,}2\,\mathrm{mm}$ omejuje, kako majhno napako še zaznamo.

**Merjenje $\kappa$ plina.** V resonančni (Kundtovi) cevi izmerimo razmik med vozloma $d = \lambda/2$ pri znani frekvenci, izračunamo $c = 2d\nu$ in $\kappa = Mc^2/(RT)$. Tako ločimo enoatomne pline ($\kappa = 5/3$) od dvoatomnih ($7/5$).

**Hrup na delovnem mestu.** Pri dnevni ravni izpostavljenosti nad $80\,\mathrm{dB}$ mora delodajalec delavcem dati na voljo glušnike, nad $85\,\mathrm{dB}$ pa jih morajo delavci nositi. Ker se jakosti seštevajo, dva stroja po $83\,\mathrm{dB}$ skupaj dasta okoli $86\,\mathrm{dB}$.

## Drugače: Korak za korakom s številkami

Zvočnik seva enakomerno na vse strani z zvočno močjo $0{,}10\,\mathrm{W}$. Kolikšna je raven jakosti zvoka na razdalji $5{,}0\,\mathrm{m}$ in na razdalji $10\,\mathrm{m}$?

1. **Površina krogle** na $5{,}0\,\mathrm{m}$: $4\pi r^2 = 4\pi \cdot 25\,\mathrm{m^2} \approx 314\,\mathrm{m^2}$.
2. **Jakost:** $j = 0{,}10\,\mathrm{W}/314\,\mathrm{m^2} \approx 3{,}2 \cdot 10^{-4}\,\mathrm{W/m^2}$.
3. **Razmerje s pragom:** $j/j_0 = 3{,}2 \cdot 10^{-4}/10^{-12} = 3{,}2 \cdot 10^{8}$.
4. **Raven:** $L = 10\,\mathrm{dB} \cdot \log_{10}(3{,}2 \cdot 10^8) \approx 10\,\mathrm{dB} \cdot 8{,}50 = 85\,\mathrm{dB}$.
5. **Na dvojni razdalji** je jakost štirikrat manjša, $j \approx 8{,}0 \cdot 10^{-5}\,\mathrm{W/m^2}$, raven pa $L \approx 79\,\mathrm{dB}$.
6. **Pravilo:** dvojna razdalja zmanjša raven za $10\,\mathrm{dB} \cdot \log_{10}4 \approx 6\,\mathrm{dB}$.

## Drugače: Bolj natančno

**D'Alembertova rešitev.** Z novima spremenljivkama $\xi = x - ct$ in $\eta = x + ct$ se valovna enačba prevede v $\partial^2s/\partial\xi\,\partial\eta = 0$, katere splošna rešitev je $s = f(\xi) + g(\eta)$. Funkciji določita začetna oblika in začetna hitrost strune.

**Lastna nihanja in barva zvoka.** Robni problem za lastna nihanja je rešen v Nalogi 2. Splošno nihanje strune je vsota (Fourierjeva vrsta) lastnih nihanj; razmerje amplitud višjih harmonik določa barvo zvoka.

**Newtonova napaka.** Newton je za zrak vzel izotermni stisljivostni modul $K = p$ namesto adiabatnega $K = \kappa p$ in dobil $\sqrt{1{,}4} \approx 1{,}18$-krat, torej približno $15\,\%$ premajhno hitrost.

**Doppler za svetlobo.** Za svetlobo, kjer snovi ni, velja relativistična formula, odvisna le od relativne hitrosti.

## Preveri se

? Zvok s frekvenco $680\,\mathrm{Hz}$ se širi s hitrostjo $340\,\mathrm{m/s}$. Kolikšna je valovna dolžina?
- $2{,}0\,\mathrm{m}$
~ Razmerje je obrnjeno: $\lambda = c/\nu$, ne $\nu/c$. Preveri enote: $\mathrm{Hz}/(\mathrm{m/s})$ ni meter.
+ $0{,}50\,\mathrm{m}$
- $0{,}25\,\mathrm{m}$
~ Delil si še z 2, kot da bi računal valovno dolžino na struni ($\lambda = 2l$). Za potujoče valovanje velja kar $\lambda = c/\nu$.
> $\lambda = c/\nu = 340/680\,\mathrm{m} = 0{,}50\,\mathrm{m}$. $2{,}0\,\mathrm{m}$ je obrnjeno razmerje.

? Silo, s katero je napeta struna, povečamo na štirikratno vrednost. Kako se spremeni osnovna frekvenca?
- Poveča se štirikrat.
~ Frekvenca je sorazmerna s hitrostjo, hitrost pa s korenom sile, ne s silo samo.
+ Poveča se dvakrat.
- Ostane enaka.
~ Dolžina strune se res ne spremeni, a z večjo silo se poveča hitrost valovanja in z njo frekvenca.
> $\nu_1 = c/(2l)$ in $c = \sqrt{F/\mu}$, zato je $\nu_1 \propto \sqrt{F}$; $\sqrt{4} = 2$.

? Piščal, zaprta na enem koncu, ima osnovno frekvenco $\nu_1$. Kolikšna je njena naslednja lastna frekvenca?
- $2\nu_1$
~ To velja za struno in za odprto piščal. Zaprti konec mora biti vozel, odprti hrbet, zato sodih večkratnikov ni.
+ $3\nu_1$
- $4\nu_1$
~ Tudi $4\nu_1$ je sod večkratnik; zaprta piščal ima le lihe: $\nu_1$, $3\nu_1$, $5\nu_1$ …
> Na zaprtem koncu je vozel, na odprtem hrbet, zato so možni le lihi večkratniki: $\nu_1$, $3\nu_1$, $5\nu_1$ …

? Jakost zvoka se poveča na desetkratno vrednost. Kako se spremeni raven jakosti zvoka?
+ Poveča se za $10\,\mathrm{dB}$.
- Poveča se za $1\,\mathrm{dB}$.
~ Zamenjal si bel in decibel: desetkratna jakost je $1$ bel, to je $10\,\mathrm{dB}$.
- Poveča se desetkrat.
~ Raven je logaritemska: množenju jakosti ustreza prištevanje k ravni, ne množenje ravni.
> $\Delta L = 10\,\mathrm{dB} \cdot \log_{10}10 = 10\,\mathrm{dB}$. Raven je logaritemska, zato se ne pomnoži z istim faktorom kot jakost.

? Sosed se hvali, da njegov novi zvočnik z dvakratno zvočno močjo igra »dvakrat glasneje«. Za koliko se na istem mestu poveča raven jakosti zvoka?
+ Za približno $3\,\mathrm{dB}$.
- Za približno $6\,\mathrm{dB}$.
~ Uporabil si $20\,\mathrm{dB} \cdot \log_{10}$, ki velja za razmerje amplitud, ne jakosti. $6\,\mathrm{dB}$ ustreza štirikratni jakosti; dvakratna moč da na istem mestu le dvakratno jakost.
- Za $10\,\mathrm{dB}$.
~ Zamenjal si občutek glasnosti z jakostjo: »dvakrat glasneje« res pomeni okoli $10\,\mathrm{dB}$ več, a to je desetkratna jakost, ne dvakratna.
> Jakost je na istem mestu sorazmerna z močjo, zato je $\Delta L = 10\,\mathrm{dB} \cdot \log_{10}2 \approx 3\,\mathrm{dB}$. Za občutek »dvakrat glasneje« je potrebnih okoli $10\,\mathrm{dB}$.

:::simboli
s | odmik delca v valovanju | s(x, t) = s_0\sin(kx - \omega t) | m
s_0 | amplituda | | m
x | lega vzdolž smeri širjenja | | m
t | čas | | s
k | valovno število | k = \frac{2\pi}{\lambda} | m^{-1}
\omega | krožna frekvenca | \omega = 2\pi\nu | s^{-1}
c | hitrost valovanja | c = \frac{\omega}{k} = \lambda\nu | m/s | zvok v zraku okoli 340 m/s
\lambda | valovna dolžina | \lambda = \frac{c}{\nu} | m
\nu | frekvenca | | Hz | pri Dopplerju frekvenca izvira
\nu_n | n-ta lastna frekvenca | \nu_n = n\,\frac{c}{2l} | Hz | struna ali odprta piščal; na enem koncu zaprta: (2n − 1)c/(4l)
\nu_1 | osnovna lastna frekvenca | | Hz
\nu_\mathrm{p}, \nu_\mathrm{o} | slišana frekvenca pri približevanju in oddaljevanju | | Hz
\nu' | frekvenca, ki jo sliši opazovalec | \nu' = \nu\,\frac{c + v_o}{c - v_i} | Hz | Dopplerjev pojav
n | zaporedna številka lastnega nihanja | | – | n = 1, 2, 3, …
l | dolžina strune ali piščali | | m
F | sila v struni | | N
\mu | dolžinska gostota strune | \mu = \frac{m}{l} | kg/m
m | masa strune | | kg
\kappa | razmerje specifičnih toplot (adiabatni eksponent) | | – | zrak: 1,4
R | splošna plinska konstanta | | J/(mol K) | 8,314 J/(mol K)
T | absolutna temperatura | | K
M | molska masa | | kg/mol | zrak: 0,029 kg/mol
j | gostota energijskega toka (jakost) | j = \frac{P}{S} | W/m^2 | točkast izvir: j = P/(4πr²)
S | ploskev, pravokotna na smer širjenja | | m^2
j_0 | prag slišnosti | | W/m^2 | 10⁻¹² W/m²
P | moč izvira | | W
r | razdalja od izvira | | m
L | raven jakosti zvoka | L = 10\,\mathrm{dB} \cdot \log_{10}\frac{j}{j_0} | dB
v_o | hitrost opazovalca proti izviru | | m/s | glede na zrak
v_i | hitrost izvira proti opazovalcu | | m/s | glede na zrak
:::
