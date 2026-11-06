---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V delavnici kemijskega inštituta so po risbi iz teflona izstružili zamašek za brušeni spoj bučke NS 29/32. Vse mere na risbi so bile pravilne, a zamašek v grlo ni šel do konca, drugi iz iste serije pa je opletal. Risar je dolžino konusa kotiral kot razliko dveh drugih mer, premer na tanjšem koncu pa sploh ni bil podan: strugar ga je izračunal sam in zaokrožil. Napaka ni bila v risanju oblike, temveč v **kotiranju**: v tem, katere mere so zapisane, od kod so merjene in kako je podan kot.

Kotiranje je jezik, s katerim risba pove izdelovalcu, kakšen mora biti kos. Pravila so v standardu SIST EN ISO 129-1. V tej temi spoznaš njegove elemente, sisteme kotiranja in kotiranje kotov ter konusov, kot je ta zamašek.

## Razlaga

### 1. Mamljiva ideja: čim več mer

Začetnik pogosto misli: »Bolje, da je na risbi preveč mer kot premalo. Če kotiram vsak odsek in še skupno dolžino, se izdelovalec ne more zmotiti.« Poglejmo, zakaj to ne drži.

Ploščica ima tri odseke $20$, $30$ in $10\,\mathrm{mm}$ ter skupno dolžino $60\,\mathrm{mm}$. Na papirju se seštevek ujema. Toda noben kos ni izdelan natančno. Recimo, da strugar vsako mero izdela v mejah $\pm 0{,}1\,\mathrm{mm}$. Trije odseki lahko skupaj dajo dolžino od $59{,}7$ do $60{,}3\,\mathrm{mm}$, skupna mera pa zahteva $59{,}9$ do $60{,}1\,\mathrm{mm}$. Kos, ki izpolni vse tri odseke, lahko krši skupno mero, in obratno. Risba z **zaprto verigo** mer si nasprotuje: ena od mer je odveč in izdelovalec ne ve, katero naj upošteva.

Popravek je prvo pravilo kotiranja.

**Pravilo 1.** Vsaka mera, ki je potrebna za izdelavo in preverjanje, je na risbi **natanko enkrat**, v pogledu, kjer je oblika najbolj jasna. Veriga mer ne sme biti zaprta: en odsek pustimo nekotiran, ali pa ga kotiramo kot **pomožno mero** v oklepaju, na primer $(10)$, ki je le za informacijo in se ne preverja.

**Pravilo 2.** Mere so v milimetrih brez oznake enote. Druga enota mora biti zapisana. Mera na risbi je vedno **prava mera** izdelka, ne glede na merilo risbe.

**Pravilo 3.** Mere izberemo po **funkciji**. *Funkcijska mera* (F) je mera, od katere je odvisno delovanje kosa: prileganje, ujem, lega vrtine za sornik. *Nefunkcijska mera* (NF) ne vpliva na delovanje. Funkcijske mere kotiramo neposredno, ne kot rezultat drugih mer.

:::premisli
Pri zamašku iz uvoda je skupna dolžina $40\,\mathrm{mm}$, glava $8\,\mathrm{mm}$ in konus $32\,\mathrm{mm}$. Za tesnjenje šteje dolžina konusa. Katero od treh mer bi pustil kot pomožno in zakaj?
---
Pomožna naj bo skupna dolžina $(40)$ ali glava. Dolžina konusa je funkcijska, zato jo kotiramo neposredno; če bi bila izračunana iz $40 - 8$, bi se odstopanji obeh mer seštela in konus bi bil lahko predolg ali prekratek. Prav to se je zgodilo v delavnici.
:::

### 2. Elementi kote

Vsaka kota ima štiri dele. Skica (ni v merilu):

```
        60
   |<--------->|
   |           |
   +-----------+
   |           |
   +-----------+
```

- **Pomožni kotirni črti** (navpični črti levo in desno) podaljšata rob predmeta. Narišemo ju s tanko neprekinjeno črto, pravokotno na merjeno dolžino, in ju potegnemo nekoliko čez kotirno črto (okoli $2\,\mathrm{mm}$).
- **Kotirna črta** je tanka neprekinjena črta, vzporedna z merjeno dolžino. Od roba predmeta je v praksi oddaljena okoli $10\,\mathrm{mm}$, vzporedne kotirne črte med seboj okoli $7\,\mathrm{mm}$.
- **Omejilo** konča kotirno črto: puščica (na strojniških risbah polna, z vrhom okoli $15^\circ$), poševna črtica pod $45^\circ$ (gradbene risbe) ali pika (v tesni verigi).
- **Kotno število** je zapisano nad kotirno črto, na sredini, in se bere od spodaj ali z desne strani risbe.

Česa ne smemo: robov, osi ali središčnic ne uporabljamo kot kotirne črte; kotirne črte se ne smejo sekati s pomožnimi, če se temu lahko izognemo; ne kotiramo do nevidnih (črtkanih) robov, ker je mera tam nejasna. Kjer je prostora malo, puščice obrnemo navzven ali kotno število zapišemo ob podaljšani kotirni črti.

Pred kotno število pišemo simbole, ki povedo vrsto oblike:

- $\varnothing$ premer (tudi v pogledu, kjer krog ni viden kot krog);
- $R$ polmer; kotirna črta gre iz središča in ima eno puščico;
- $S\varnothing$ in $SR$ premer in polmer krogle;
- $\square$ kvadrat, na primer $\square 12$;
- posnetje roba $1 \times 45^\circ$ pomeni $1\,\mathrm{mm}$ pod kotom $45^\circ$.

### 3. Sistemi kotiranja

Kako uredimo mere položajev, na primer vrtin v ploščici? Poznamo štiri sisteme. Pri vseh merimo vrtine od levega roba ploščice:

```
zaporedno (verižno):
|<-15->|<-25->|<-25->|<-25->|

vzporedno (od baze):
|<-15->|
|<----40----->|
|<--------65-------->|
|<-----------90------------>|
```

- **Zaporedno (verižno) kotiranje**: vsaka mera se začne, kjer se prejšnja konča. Pregledno, a odstopanja se **seštevajo**. Uporabno, kadar je funkcijska razdalja med sosednjima elementoma.
- **Vzporedno kotiranje**: vse mere izhajajo iz skupne **baze** (referenčnega roba ali osi). Odstopanja se ne seštevajo; vsak položaj je odvisen le od svoje mere. Zahteva več prostora.
- **Kotiranje z naraščajočimi merami**: kot vzporedno, le na eni sami kotirni črti z izhodiščem $0$ v bazi in številkami ob pomožnih črtah. Prihrani prostor.
- **Koordinatno kotiranje**: lega vsake točke je podana s koordinatama $x$ in $y$ od izhodišča, pogosto v tabeli. Tako zapis bere tudi CNC-stroj.

Baza naj bo ploskev, ki je tudi pri izdelavi ali vgradnji referenčna: obdelan rob, os vrtenja, naležna ploskev.

**Seštevanje odstopanj v verigi.** Če ima vsaka od $n$ mer v verigi največje dovoljeno odstopanje $\pm\Delta_i$, je v najslabšem primeru odstopanje končne točke

$$\Delta_\Sigma = \Delta_1 + \Delta_2 + \ldots + \Delta_n$$

**Izpeljava.** Lega $k$-te točke v verigi je vsota mer $x_k = a_1 + a_2 + \ldots + a_k$. Vsaka $a_i$ leži med $a_i - \Delta_i$ in $a_i + \Delta_i$. Največja vsota nastane, ko so vse mere največje, najmanjša, ko so vse najmanjše. Razlika od nazivne vsote je zato največ $\Delta_1 + \ldots + \Delta_k$. ∎

Pri vzporednem kotiranju pa je lega vsake točke podana z eno mero, zato je njeno odstopanje kar $\pm\Delta$. Razdalja med dvema točkama, kotiranima od baze, ima odstopanje $\pm 2\Delta$, ker je razlika dveh mer. Natančne dopustne meje (tolerance) in ujemi so tema naslednje lekcije.

### 4. Kotiranje kotov

Kotirna črta za kot je **krožni lok** s središčem v temenu kota, pomožni kotirni črti pa sta podaljška krakov. Kotno število zapišemo z enoto: stopinje, minute in sekunde ($5^\circ 43'$) ali decimalno ($5{,}72^\circ$). Pretvorba: $1^\circ = 60'$ in $1' = 60''$.

**Konus** je del stožca. Podamo ga z dvema premeroma in dolžino ali s premerom, dolžino in kotom. Razmerje

$$C = \frac{D - d}{L}$$

imenujemo **koniciteta** oziroma konus in ga zapišemo kot $1 : x$ s simbolom konusa. Pri $C = 1 : 10$ se premer na vsakih $10\,\mathrm{mm}$ dolžine zmanjša za $1\,\mathrm{mm}$. Kot konusa $\alpha$ je kot med nasprotnima površinskima črtama stožca, zato velja

$$\tan\frac{\alpha}{2} = \frac{D - d}{2L}$$

Za stružnico je pomemben **nastavitveni kot** $\alpha/2$, za katerega zasučemo suport.

**Naklon** ravne ploskve je razmerje dviga in dolžine, na primer $1 : 20$; pri naklonu se dviga le ena stran, zato je kot $\arctan\frac{1}{20}$, brez deljenja z $2$.

:::premisli
Konus $1 : 10$ in naklon $1 : 10$ imata enako zapisano razmerje. Ali imata tudi enak kot ob osi?
---
Ne. Pri konusu se premer zmanjša za $1$ na $10$ dolžine, polmer pa le za $0{,}5$, zato je kot ob osi $\arctan 0{,}05 \approx 2{,}86^\circ$. Pri naklonu se ena ploskev dvigne za $1$ na $10$, kot je $\arctan 0{,}1 \approx 5{,}71^\circ$. Konus ima ob osi pol manjši naklon.
:::

## Rešeni primeri

### Primer 1: kot brušenega spoja

Standardni laboratorijski brušeni spoji imajo konus $1 : 10$. Kolikšen je kot konusa in nastavitveni kot za stružnico, zapisana v stopinjah, minutah in sekundah?

**Podatki:** $C = 1 : 10$
**Iščemo:** kot konusa $\alpha$ in nastavitveni kot $\alpha/2$

:::formula
$\tan\dfrac{\alpha}{2} = \dfrac{C}{2}$, ker je $C = \dfrac{D - d}{L}$
:::

**Rešitev:**

1. $\tan\dfrac{\alpha}{2} = \dfrac{0{,}1}{2} = 0{,}05$, zato $\dfrac{\alpha}{2} = \arctan 0{,}05 \approx 2{,}8624^\circ$.
2. Pretvorba: $0{,}8624 \cdot 60 = 51{,}74$, torej $51'$; ostanek $0{,}744 \cdot 60 \approx 44{,}6$, torej okoli $45''$. Nastavitveni kot je $2^\circ 51' 45''$.
3. Kot konusa: $\alpha = 2 \cdot 2{,}8624^\circ \approx 5{,}7248^\circ$; $0{,}7248 \cdot 60 = 43{,}49$, torej $43'$, in $0{,}49 \cdot 60 \approx 29''$.
4. Odgovor: kot konusa je $5^\circ 43' 29''$, suport stružnice zasučemo za $2^\circ 51' 45''$. Na risbi je preprosteje zapisati razmerje $1 : 10$ s simbolom konusa kot kot z natančnostjo sekunde.

### Primer 2: ploščica za stojalo epruvet

V aluminijasto ploščico stojala za epruvete izvrtamo štiri vrtine. Prva je $15\,\mathrm{mm}$ od levega roba, razmik med vrtinami je $25\,\mathrm{mm}$. Delavnica izdela vsako mero na $\pm 0{,}1\,\mathrm{mm}$. Kolikšno je največje odstopanje lege četrte vrtine od roba pri zaporednem in pri vzporednem kotiranju?

**Podatki:** $a_1 = 15\,\mathrm{mm}$, $a_2 = a_3 = a_4 = 25\,\mathrm{mm}$, $\Delta = 0{,}1\,\mathrm{mm}$ za vsako mero, $4$ vrtine
**Iščemo:** odstopanje $\Delta_\Sigma$ lege četrte vrtine v obeh sistemih

:::formula
Zaporedno: $\Delta_\Sigma = \Delta_1 + \Delta_2 + \ldots + \Delta_n$; vzporedno: odstopanje ene mere
:::

**Rešitev:**

1. Nazivna lega četrte vrtine: $15 + 3 \cdot 25 = 90\,\mathrm{mm}$ od roba.
2. Zaporedno: do četrte vrtine so štiri mere, $\Delta_\Sigma = 4 \cdot 0{,}1 = 0{,}4\,\mathrm{mm}$; lega je med $89{,}6$ in $90{,}4\,\mathrm{mm}$.
3. Vzporedno: lega je podana z eno mero $90$, zato je odstopanje $\pm 0{,}1\,\mathrm{mm}$, lega med $89{,}9$ in $90{,}1\,\mathrm{mm}$.
4. Odgovor: pri verižnem kotiranju je odstopanje četrte vrtine do $\pm 0{,}4\,\mathrm{mm}$, pri vzporednem le $\pm 0{,}1\,\mathrm{mm}$. Če mora ploščica nasesti na štiri zatiče v ohišju, je pravi izbor vzporedno kotiranje od levega roba.

### Primer 3 (izpitna raven): zamašek NS 29/32

Zamašek iz teflona ima valjasto glavo $\varnothing 36$ dolžine $8\,\mathrm{mm}$ in konus $1 : 10$ za brušeni spoj NS 29/32: večji premer konusa je $29{,}2\,\mathrm{mm}$, dolžina konusa $32\,\mathrm{mm}$. (a) Izračunaj manjši premer konusa. (b) Na prvotni risbi sta bili kotirani skupna dolžina $40 \pm 0{,}1$ in glava $8 \pm 0{,}1$, konus pa ne. V katerih mejah je dolžina konusa? (c) Predlagaj pravilno kotiranje dolžin.

**Podatki:** $\varnothing 36$, glava $l_\mathrm{g} = 8\,\mathrm{mm}$, $D = 29{,}2\,\mathrm{mm}$, $L = 32\,\mathrm{mm}$, $C = 1 : 10$, skupna dolžina $40 \pm 0{,}1\,\mathrm{mm}$, glava $\pm 0{,}1\,\mathrm{mm}$
**Iščemo:** manjši premer $d$, meje dolžine konusa, pravilen izbor mer

:::formula
$d = D - C L$; dolžina, ki je razlika dveh mer, ima odstopanje $\Delta_1 + \Delta_2$
:::

**Rešitev:**

1. (a) $d = 29{,}2 - 0{,}1 \cdot 32 = 26{,}0\,\mathrm{mm}$.
2. (b) Konus je razlika mer: $L = 40 - 8 = 32\,\mathrm{mm}$. Najdaljši je, ko je kos najdaljši in glava najkrajša: $40{,}1 - 7{,}9 = 32{,}2\,\mathrm{mm}$.
3. Najkrajši je, ko je kos najkrajši in glava najdaljša: $39{,}9 - 8{,}1 = 31{,}8\,\mathrm{mm}$. Dolžina konusa je v mejah $32 \pm 0{,}2\,\mathrm{mm}$, dvakrat širših od drugih mer.
4. Manjši premer pri konusu $1 : 10$ določata $D$ in $L$. Če ga strugar izračuna sam in zaokroži, se spremeni naklon konusa; vsakih $0{,}1\,\mathrm{mm}$ razlike v premeru premakne lego zamaška v grlu za $1\,\mathrm{mm}$. Zato konus podamo z razmerjem in ga strugar ne računa.
5. (c) Funkcijski meri sta konus in večji premer, zato ju kotiramo neposredno: $L = 32$, $\varnothing 29{,}2$ in konus $1 : 10$ s simbolom (ali $\varnothing 26$, ne obojega). Glavo kotiramo z $8$ od naležne ploskve, skupno dolžino zapišemo kot pomožno mero $(40)$.
6. Odgovor: manjši premer je $26{,}0\,\mathrm{mm}$; prvotna risba je dopuščala konus od $31{,}8$ do $32{,}2\,\mathrm{mm}$. Pravilno kotiranje poda konus neposredno in skupno dolžino le kot pomožno mero.

### Primer 4: zdaj ti

Na pokrovu reaktorja je šest vrtin na delilnem krogu $\varnothing 80$, enakomerno razporejenih, prva leži na osi $x$. Za CNC-stroj zapiši koordinate vrtin pri kotih $60^\circ$ in $120^\circ$ glede na središče pokrova.

**Podatki:** delilni krog $\varnothing 80$, torej $r = 40\,\mathrm{mm}$; $6$ vrtin, razmik $60^\circ$; kota $\varphi_1 = 60^\circ$, $\varphi_2 = 120^\circ$
**Iščemo:** koordinate $(x; y)$ obeh vrtin

:::formula
$x = r\cos\varphi$, $y = r\sin\varphi$
:::

**Rešitev:**

1. Polmer je polovica premera: $r = 40\,\mathrm{mm}$.
2. Za $\varphi_1 = 60^\circ$: $x = 40 \cdot 0{,}5 = 20\,\mathrm{mm}$. Izračunaj še $y$ in koordinati druge vrtine.

:::premisli
Kolikšne so koordinate?
---
$y = 40 \cdot \sin 60^\circ \approx 34{,}64\,\mathrm{mm}$, torej vrtina pri $(20; 34{,}64)$. Pri $120^\circ$ je $\cos 120^\circ = -0{,}5$, zato $(-20; 34{,}64)$. Na risbi bi zadostovali delilni krog $\varnothing 80$, oznaka $6 \times \varnothing$ vrtine in kot $60^\circ$; tabela koordinat je dodatek za program stroja.
:::

## Pogoste napake

- **Zaprta veriga.** Kotirani vsi odseki in še skupna dolžina. Ena mera je odveč in si lahko nasprotujeta. Popravek: en odsek izpusti ali ga zapiši kot pomožno mero v oklepaju.
- **Funkcijska mera kot rezultat.** Mera, ki šteje, je izračunana iz dveh drugih, zato ima seštevek njunih odstopanj. Popravek: funkcijsko mero kotiraj neposredno, nefunkcijsko pusti kot ostanek.
- **Kotiranje do nevidnega roba.** Mera do črtkane črte je nejasna. Popravek: izberi pogled ali prerez, kjer je rob viden.
- **Kot konusa in naklon zamenjana.** Študent pri konusu $1 : 10$ vzame kot $\arctan 0{,}1$. Popravek: pri konusu je $\tan\frac{\alpha}{2} = \frac{C}{2}$, pri naklonu pa ni deljenja z $2$.
- **Mera po merilu risbe.** Pri merilu $1 : 2$ nekdo napiše $30$ za rob, ki je v resnici $60\,\mathrm{mm}$. Kotno število je vedno prava mera izdelka.

## Povzetek

- Kotiranje ureja SIST EN ISO 129-1. Vsaka mera je natanko enkrat, v mm brez enote, kot prava mera izdelka; veriga ne sme biti zaprta, odvečna mera je pomožna v oklepaju.
- Kota: pomožne kotirne črte, kotirna črta, omejila, kotno število (bere se od spodaj ali z desne). Simboli: $\varnothing$, $R$, $S\varnothing$, $SR$, $\square$, posnetje $1 \times 45^\circ$.
- Sistemi: zaporedno (odstopanja se seštevajo), vzporedno od baze, z naraščajočimi merami, koordinatno. Funkcijske mere kotiramo neposredno od funkcijske baze.
- V verigi je najslabše odstopanje $\Delta_\Sigma = \Delta_1 + \ldots + \Delta_n$.
- Kot: kotirna črta je lok s središčem v temenu; $1^\circ = 60'$, $1' = 60''$. Konus $C = \frac{D - d}{L}$, $\tan\frac{\alpha}{2} = \frac{D - d}{2L}$; naklon brez deljenja z $2$.

## Za izpit

Znati moraš povedati:

- elemente kote in pravila za njihovo risanje po SIST EN ISO 129-1;
- pravilo, da je vsaka mera natanko enkrat, in vlogo pomožne mere;
- razliko med funkcijsko in nefunkcijsko mero ter izbiro baze;
- štiri sisteme kotiranja z njihovimi prednostmi in izpeljavo seštevanja odstopanj v verigi;
- kotiranje kotov, konusa in naklona ter zvezo med konusom in kotom.

### Naloga 1

Nosilna letev za stojalo ima šest vrtin: prva je $20\,\mathrm{mm}$ od levega roba, nato razmiki $30$, $30$, $30$, $30$ in $30\,\mathrm{mm}$. Vsaka mera je izdelana na $\pm 0{,}1\,\mathrm{mm}$. Letev nasede na šest zatičev, pri čemer mora biti lega vsake vrtine od levega roba natančna na $\pm 0{,}2\,\mathrm{mm}$, razdalja med sosednjima vrtinama pa na $\pm 0{,}2\,\mathrm{mm}$. (a) Ali verižno kotiranje izpolni zahtevi? (b) Ali ju izpolni vzporedno kotiranje od levega roba? (c) Pri katerem sistemu je skupna dolžina od prve do zadnje vrtine najbolj natančna?

**Rešitev:**

1. Lega zadnje vrtine: $20 + 5 \cdot 30 = 170\,\mathrm{mm}$.
2. (a) Verižno: do zadnje vrtine je $6$ mer, $\Delta_\Sigma = 6 \cdot 0{,}1 = 0{,}6\,\mathrm{mm} > 0{,}2\,\mathrm{mm}$. Prva zahteva ni izpolnjena že pri tretji vrtini ($3 \cdot 0{,}1 = 0{,}3$). Razdalja sosednjih je ena mera, $\pm 0{,}1$, kar ustreza.
3. (b) Vzporedno: lega vsake vrtine je ena mera, $\pm 0{,}1\,\mathrm{mm}$, ustreza. Razdalja sosednjih je razlika dveh mer, $\pm 0{,}2\,\mathrm{mm}$, kar je ravno še dopustno.
4. (c) Razdalja od prve do zadnje vrtine je $150\,\mathrm{mm}$. Verižno ima $5$ mer, $\pm 0{,}5\,\mathrm{mm}$; vzporedno je razlika dveh mer, $\pm 0{,}2\,\mathrm{mm}$. Najbolj natančna bi bila, če bi jo kotirali neposredno ($\pm 0{,}1$), na primer z bazo v prvi vrtini.
5. Odgovor: verižno kotiranje ne zadosti, vzporedno od levega roba zadosti obema zahtevama. Če je pomembna tudi razdalja prve in zadnje vrtine, je boljša baza v osi prve vrtine.

### Naloga 2

Utemelji, zakaj veriga mer na risbi ne sme biti zaprta. Pojasni, kaj je pomožna mera in kako jo zapišemo, ter s primerom razloži, zakaj funkcijske mere ne smejo biti izračunane iz drugih mer.

**Rešitev:**

1. Vsaka izdelana mera odstopa od nazivne v svojih mejah. V zaprti verigi je ena mera določena z ostalimi, zato sta lahko zahtevi zanjo protislovni: kos, ki izpolni vse odseke, lahko krši skupno mero.
2. Rešitev je, da en člen verige ostane nekotiran ali je **pomožna mera** v oklepaju, na primer $(40)$. Pomožna mera je informacija za berilca in se ne preverja.
3. Funkcijska mera, izračunana kot razlika dveh mer, dobi seštevek njunih odstopanj (izpeljava za verigo). Primer: konus zamaška kot $40 - 8$ ima $\pm 0{,}2$ namesto $\pm 0{,}1$.
4. Zato izberemo za ostanek verige nefunkcijsko mero, funkcijske pa kotiramo neposredno od funkcijske baze.

### Naloga 3

Vreteno ima konus $1 : 5$ z večjim premerom $30\,\mathrm{mm}$ in dolžino $25\,\mathrm{mm}$. Izračunaj manjši premer, kot konusa in nastavitveni kot v stopinjah, minutah in sekundah. Nato pojasni, katere tri podatke bi zapisal na risbo.

**Rešitev:**

1. $d = D - C L = 30 - 0{,}2 \cdot 25 = 25\,\mathrm{mm}$.
2. $\tan\dfrac{\alpha}{2} = \dfrac{0{,}2}{2} = 0{,}1$, zato $\dfrac{\alpha}{2} \approx 5{,}7106^\circ$; $0{,}7106 \cdot 60 = 42{,}64$, torej $42'$ in $0{,}64 \cdot 60 \approx 38''$: $5^\circ 42' 38''$.
3. $\alpha \approx 11{,}4212^\circ$; $0{,}4212 \cdot 60 = 25{,}27$ in $0{,}27 \cdot 60 \approx 16$: $11^\circ 25' 16''$.
4. Na risbo zapišemo $\varnothing 30$, dolžino $25$ in konus $1 : 5$ s simbolom konusa. Manjšega premera in kota ne pišemo, ker bi bila odveč (zaprta veriga), ali ju zapišemo le kot pomožni meri v oklepaju.
5. Odgovor: $d = 25\,\mathrm{mm}$, $\alpha = 11^\circ 25' 16''$, nastavitveni kot $5^\circ 42' 38''$.

## Drugače: Korak za korakom s številkami

Kotirajmo ploščico $90 \times 50$ s tremi vrtinami $\varnothing 8$ po vrsti, od zadnjega koraka nazaj proti začetku.

1. *Funkcija.* Ploščica se privije na stojalo, kjer so trije zatiči na razdaljah $20$, $45$ in $70\,\mathrm{mm}$ od levega naslona. Funkcijske mere so torej lege vrtin od levega roba.
2. *Baza.* Levi rob, ker naleže na naslon.
3. *Sistem.* Vzporedno ali z naraščajočimi merami: $0$, $20$, $45$, $70$ na eni kotirni črti. Odstopanje vsake vrtine je ena mera.
4. *Višina vrtin.* Vse so na isti višini, $25\,\mathrm{mm}$ od spodnjega roba: ena mera zadošča, saj so na isti osi.
5. *Premer.* $3 \times \varnothing 8$, enkrat, ne pri vsaki vrtini.
6. *Obris.* $90$ in $50$. Desni ostanek $90 - 70 = 20$ ne kotiramo, ker bi zaprl verigo.

Rezultat: sedem števil na risbi ($90$, $50$, $20$, $45$, $70$, $25$, $3 \times \varnothing 8$) opiše ploščico popolno in brez protislovja.

## Drugače: Uporaba v stroki

- *Strojna delavnica.* Strugar iz kotiranega konusa takoj vidi, za koliko zasuka suport. Če je konus podan s kotom v decimalnih stopinjah, ga pretvori v minute, ker ima skala na suportu razdelke v stopinjah in minutah.
- *Kontrola kakovosti.* Kontrolor meri od iste baze, kot je kotirana. Pri vzporednem kotiranju zato postavi kos na referenčno ploskev na merilni plošči in meri vse lege od nje.
- *CNC in CAD.* Koordinatno kotiranje se neposredno prevede v program stroja. Sodobni modelirniki prenesejo mere iz 3D modela na risbo, a izbira baz in funkcijskih mer ostane konstruktorjeva odločitev.
- *Laboratorijska oprema.* Brušeni spoji, zamaški in pipe imajo standardiziran konus $1 : 10$, zato se deli različnih proizvajalcev prilegajo. Risba novega dela mora konus kotirati enako, kot ga določa standard.

## Preveri se

? Kateri element ne sodi med dele kote?
- pomožna kotirna črta
~ Pomožna kotirna črta prenese rob predmeta do kotirne črte in je del vsake kote.
- omejilo
~ Omejilo (puščica, črtica ali pika) konča kotirno črto.
+ središčnica
- kotno število
~ Kotno število je bistveni del kote: pove velikost mere.
> Središčnica je os simetrije predmeta; kot kotirna črta je ne smemo uporabiti.

? Pet vrtin je kotiranih verižno, vsaka mera na $\pm 0{,}05\,\mathrm{mm}$, prva od roba. Kolikšno je največje odstopanje lege pete vrtine od roba?
- $\pm 0{,}05\,\mathrm{mm}$
~ To bi veljalo pri vzporednem kotiranju; pri verižnem se odstopanja seštevajo.
- $\pm 0{,}20\,\mathrm{mm}$
~ Do pete vrtine je pet mer, ne štiri: šteti moraš tudi mero od roba do prve vrtine.
+ $\pm 0{,}25\,\mathrm{mm}$
> $\Delta_\Sigma = 5 \cdot 0{,}05 = 0{,}25\,\mathrm{mm}$.

? Konstruktor funkcijsko dolžino utora zapiše kot razliko dveh drugih mer. Kaj je posledica?
- Utor bo natančnejši, ker sta bili kotirani dve meri.
~ Več mer ne pomeni večje natančnosti; izračunana mera dobi odstopanja obeh.
+ Dopustno odstopanje utora se poveča na vsoto odstopanj obeh mer.
- Ni posledic, če sta obe meri pravilni.
~ Nazivne mere so pravilne, a izdelane mere odstopajo; to odstopanje se prenese na utor.
> Dolžina, ki je razlika mer, ima v najslabšem primeru odstopanje $\Delta_1 + \Delta_2$, zato funkcijske mere kotiramo neposredno.

? Študent računa nastavitveni kot za konus $1 : 20$: »1) $C = 0{,}05$. 2) $\tan\frac{\alpha}{2} = 0{,}05$. 3) $\frac{\alpha}{2} \approx 2{,}86^\circ$. 4) Suport zasučem za $2^\circ 52'$.« Kateri korak je napačen?
- Korak 1.
~ Razmerje $1 : 20$ je res $0{,}05$.
+ Korak 2.
- Korak 3.
~ Korak 3 iz koraka 2 pravilno izračuna arkus tangens; napaka je prej.
- Korak 4.
~ Pretvorba $2{,}86^\circ$ v $2^\circ 52'$ je pravilna; napaka je prej.
> Pri konusu je $\tan\frac{\alpha}{2} = \frac{C}{2} = 0{,}025$, torej $\frac{\alpha}{2} \approx 1{,}43^\circ = 1^\circ 26'$. Študent je konus zamenjal z naklonom.

? Risba ohišja je v merilu $1 : 2$. Rob, ki je na papirju dolg $35\,\mathrm{mm}$, je treba kotirati. Katero kotno število napišeš?
- $35$
~ Kotno število ni dolžina na papirju; je prava mera izdelka.
- $17{,}5$
~ Merilo $1 : 2$ pomeni pomanjšano risbo, zato je pravi rob daljši, ne krajši.
+ $70$
> Pri merilu $1 : 2$ je risba dvakrat manjša od izdelka, zato je rob dolg $70\,\mathrm{mm}$; to število zapišemo.

:::simboli
\Delta_\Sigma | največje odstopanje na koncu verige | \Delta_\Sigma = \Delta_1 + \Delta_2 + \ldots + \Delta_n | mm
\Delta_1, \Delta_2, \Delta_n | odstopanja posameznih mer | | mm
C | konus (koniciteta) | C = \frac{D - d}{L} | – | zapis $1 : x$
D | večji premer konusa | | mm
d | manjši premer konusa | d = D - C L | mm
L | dolžina konusa | | mm
\alpha | kot konusa | | ^\circ | nastavitveni kot je $\alpha/2$
x | koordinata vrtine | x = r\cos\varphi | mm
y | koordinata vrtine | y = r\sin\varphi | mm
r | polmer delilnega kroga | | mm
\varphi | kot lege vrtine | | ^\circ
:::
