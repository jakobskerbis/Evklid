---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V delavnici glasbene šole, kjer popravljajo trobente in pozavne, stojita dve plastenki odpadnega čistila. V prvi je klorovodikova kislina, v drugi ocetna kislina. Obe imata koncentracijo $0{,}1\,\mathrm{mol/L}$. pH-meter pokaže $1{,}00$ pri prvi in $2{,}87$ pri drugi, torej je v klorovodikovi kislini oksonijevih ionov približno $75$-krat več.

Serviser mora čistilo pred odlaganjem nevtralizirati. V $20\,\mathrm{mL}$ vsakega čistila doliva raztopino natrijevega hidroksida, prav tako s koncentracijo $0{,}1\,\mathrm{mol/L}$. Pri šibki ocetni kislini bo baze gotovo porabil veliko manj. Ali res?

Ne. Pri obeh porabi natanko $20\,\mathrm{mL}$. Baza ne šteje samo oksonijevih ionov, ki so v raztopini v tem trenutku, ampak vse protone, ki jih kislina sploh lahko odda.

Na tem temelji **titracija**: postopek, pri katerem kislini dodajamo bazo (ali obratno), dokler je ne nevtraliziramo, in iz porabe izračunamo neznano koncentracijo. Tako v laboratorijih določajo kislost kisa, mleka, vina in kisline v akumulatorju.

## Razlaga

**Pribor.** S polnilno pipeto odmerimo točno prostornino vzorca, na primer $20{,}0\,\mathrm{mL}$, v erlenmajerico. Temu vzorcu z neznano koncentracijo rečemo **analit**. Dodamo dve kapljici indikatorja, barvila, ki z barvo pokaže pH (več o njem spodaj). Nad erlenmajerico je **bireta**, dolga steklena cev z oznakami na $0{,}1\,\mathrm{mL}$ in pipo spodaj. V njej je **titrant**, raztopina z natančno znano koncentracijo. Odčitamo nivo v bireti na začetku in na koncu; razlika je **poraba** titranta.

**Kaj se dogaja v erlenmajerici.** Vsak hidroksidni ion iz birete zreagira z enim oksonijevim ionom:

$$\mathrm{H_3O^+} + \mathrm{OH^-} \rightarrow 2\,\mathrm{H_2O}$$

Ta reakcija je **nevtralizacija**. V $20\,\mathrm{mL}$ klorovodikove kisline s koncentracijo $0{,}1\,\mathrm{mol/L}$ sta $2\,\mathrm{mmol}$ oksonijevih ionov. Vsak mililiter baze odnese $0{,}1\,\mathrm{mmol}$. Tabela kaže, kaj ostane v erlenmajerici:

| NaOH / mL | ostane $\mathrm{H_3O^+}$ / mmol | presežek $\mathrm{OH^-}$ / mmol | pH |
|---|---|---|---|
| $0$ | $2{,}0$ | $0$ | $1{,}00$ |
| $10$ | $1{,}0$ | $0$ | $1{,}48$ |
| $19$ | $0{,}10$ | $0$ | $2{,}59$ |
| $19{,}9$ | $0{,}01$ | $0$ | $3{,}60$ |
| $20$ | $0$ | $0$ | $7{,}00$ |
| $20{,}1$ | $0$ | $0{,}01$ | $10{,}40$ |
| $21$ | $0$ | $0{,}10$ | $11{,}39$ |
| $30$ | $0$ | $1{,}0$ | $12{,}30$ |

Prvih $19\,\mathrm{mL}$ dvigne pH le za $1{,}6$ enote. Nato med $19{,}9$ in $20{,}1\,\mathrm{mL}$, to so le štiri kapljice, pH poskoči za skoraj $7$ enot. Razlog poznaš iz lekcije o pH: ena enota pomeni desetkratno razliko. Ko odstraniš polovico ionov, se koncentracija le razpolovi, to pa je manj kot ena enota pH. Ko pa jih ostane le še $0{,}01\,\mathrm{mmol}$, jih dve kapljici odstranita vse: koncentracija ne pade za polovico, ampak več tisočkrat naenkrat.

Trenutek, ko je dodana baza po enačbi reakcije natanko porabila vso kislino, je **točka ekvivalence** (TE). Tu je pri $20{,}0\,\mathrm{mL}$.

:::premisli
Isti poskus ponovimo z ocetno kislino. Napovej: zakaj bo točka ekvivalence spet pri isti porabi in ali bo pH tam $7$, manj ali več? Namig: kaj ostane v erlenmajerici, ko je vsa kislina nevtralizirana?
---
Spet pri $20\,\mathrm{mL}$, ker je množina kisline enaka. pH pa bo nad $7$: v erlenmajerici ostane raztopina natrijevega acetata, acetatni ion $\mathrm{CH_3COO^-}$ pa je konjugirana baza šibke kisline, zato vodi odvzame nekaj protonov.
:::

**Titracijska krivulja.** Graf pH v odvisnosti od dodane baze je **titracijska krivulja**. Spodaj sta obe krivulji iz delavnice:

:::risba graf
opis: Titracijski krivulji. Vodoravna os je prostornina dodanega NaOH od 0 do 30 mL, navpična os pH od 0 do 14. Krivulja za klorovodikovo kislino začne pri pH 1, do 19 mL se počasi dvigne do pH 2,6, pri 20 mL navpično skoči od 3,6 do 10,4 in se konča pri pH 12,3. Krivulja za ocetno kislino začne pri pH 2,9, pri 10 mL je pH 4,7, nato raste položno do 6,0 pri 19 mL, v točki ekvivalence pri 20 mL je pH 8,7, nad 20 mL se prekrije s prvo krivuljo. Pas med pH 8,2 in 10 je območje preskoka fenolftaleina.
x: 0 .. 30 | 5 | V(NaOH) / mL
y: 0 .. 14 | 2 | pH
pravokotnik: 0; 8,2 .. 30; 10 | ozadje
črta: 0; 1 -> 5; 1,22 -> 10; 1,48 -> 15; 1,85 -> 19; 2,59 -> 19,9; 3,6 -> 20; 7 -> 20,1; 10,4 -> 21; 11,39 -> 25; 12,05 -> 30; 12,3 | modra
črta: 0; 2,87 -> 5; 4,27 -> 10; 4,74 -> 15; 5,22 -> 19; 6,02 -> 19,9; 7,04 -> 20; 8,72 -> 20,1; 10,4 | oranžna črtkano
točka: 20; 7 | TE, HCl | desno
točka: 20; 8,72 | TE, ocetna | desno
točka: 10; 4,74 | pH = pK_a | nad
napis: 1; 0,4 | HCl (polna črta) | desno
napis: 5; 6,4 | ocetna kislina (črtkano) | desno
napis: 23; 9,1 | fenolftalein | desno
podnapis: Polna črta: HCl, črtkana: ocetna kislina, obe 20 mL s koncentracijo 0,1 mol/L.
:::

Krivulji se razlikujeta na tri načine:

- Ocetna kislina začne pri višjem pH, ker odda proton le majhen del molekul.
- Na sredini je njena krivulja skoraj ravna. V erlenmajerici sta ocetna kislina in acetat, torej pufer. Pri $10\,\mathrm{mL}$ je polovica kisline nevtralizirane, koncentraciji sta enaki in $\mathrm{pH} = \mathrm{p}K_\mathrm{a} = 4{,}74$.
- Skok je krajši (od okoli $7$ do $10{,}4$), točka ekvivalence pa je pri pH $8{,}72$.

Zakaj potem porabi enako baze? Hidroksidni ion reagira tudi z molekulami, ki protona še niso oddale: $\mathrm{CH_3COOH} + \mathrm{OH^-} \rightarrow \mathrm{CH_3COO^-} + \mathrm{H_2O}$. Ko baza odvzema protone, se ravnotežje šibke kisline pomika v desno, dokler ne odda protona vsaka molekula. **Poraba je odvisna od množine kisline, ne od njene jakosti.**

**Indikator.** Indikator je barvilo, ki spremeni barvo v ozkem območju pH, imenovanem **območje preskoka**. Metiloranž preskoči med $3{,}1$ in $4{,}4$ (iz rdeče v rumeno), bromtimol modro med $6{,}0$ in $7{,}6$ (iz rumene v modro), fenolftalein med $8{,}2$ in $10{,}0$ (iz brezbarvne v roza). Ko indikator spremeni barvo, smo v **končni točki** titracije. Dober indikator ima območje preskoka znotraj navpičnega skoka krivulje, zato je končna točka le delček kapljice od točke ekvivalence.

Pri klorovodikovi kislini sega skok od $3{,}6$ do $10{,}4$, zato ustreza vsak od treh indikatorjev. Metiloranž začne spreminjati barvo tik pred skokom, povsem rumen pa postane šele pri $4{,}4$, torej že v skoku.

:::premisli
Zakaj metiloranž pri titraciji ocetne kisline ne bi bil dober izbor?
---
Njegovo območje preskoka ($3{,}1$ do $4{,}4$) krivulja ocetne kisline doseže že po nekaj mililitrih, daleč pred točko ekvivalence: na grafu je pri $5\,\mathrm{mL}$ pH že $4{,}27$. Barva bi se spreminjala postopno in prezgodaj. Območje fenolftaleina pa leži v skoku pri $20\,\mathrm{mL}$.
:::

**Računanje.** Iz porabe titranta dobimo njegovo množino, $n = c \cdot V$. Enačba reakcije pove, v kakšnem razmerju reagirata kislina in baza. Za $\mathrm{HCl} + \mathrm{NaOH} \rightarrow \mathrm{NaCl} + \mathrm{H_2O}$ je razmerje $1 : 1$. Za $\mathrm{H_2SO_4} + 2\,\mathrm{NaOH} \rightarrow \mathrm{Na_2SO_4} + 2\,\mathrm{H_2O}$ je baze dvakrat več kot kisline, ker ima žveplova kislina dva protona.

Z oznako k za kislino in b za bazo računamo v treh korakih: iz porabe množino baze, iz razmerja v enačbi množino kisline, nato koncentracijo kisline:

$$n_\mathrm{b} = c_\mathrm{b} \cdot V_\mathrm{b}$$

$$c_\mathrm{k} = \frac{n_\mathrm{k}}{V_\mathrm{k}}$$

Pri tem je $V_\mathrm{k}$ prostornina odpipetiranega vzorca, ne vsebina erlenmajerice na koncu.

## Rešeni primeri

### Primer 1: klorovodikova kislina

$10{,}0\,\mathrm{mL}$ razredčene klorovodikove kisline titriramo z raztopino NaOH s koncentracijo $0{,}100\,\mathrm{mol/L}$. Bireta na začetku kaže $0{,}50\,\mathrm{mL}$, ob preskoku bromtimol modrega pa $15{,}50\,\mathrm{mL}$. Kolikšna je koncentracija kisline?

**Podatki:** $V_\mathrm{k} = 10{,}0\,\mathrm{mL}$, $c_\mathrm{b} = 0{,}100\,\mathrm{mol/L}$, začetni odčitek $0{,}50\,\mathrm{mL}$, končni odčitek $15{,}50\,\mathrm{mL}$
**Iščemo:** koncentracijo kisline $c_\mathrm{k}$

:::formula
$n_\mathrm{b} = c_\mathrm{b} \cdot V_\mathrm{b}$; razmerje $1 : 1$ da $n_\mathrm{k} = n_\mathrm{b}$; $c_\mathrm{k} = \dfrac{n_\mathrm{k}}{V_\mathrm{k}}$
:::

**Rešitev:**

1. Poraba je razlika odčitkov: $V_\mathrm{b} = 15{,}50\,\mathrm{mL} - 0{,}50\,\mathrm{mL} = 15{,}00\,\mathrm{mL}$, to je $0{,}01500\,\mathrm{L}$.
2. Množina baze: $n_\mathrm{b} = 0{,}100\,\mathrm{mol/L} \cdot 0{,}01500\,\mathrm{L} = 0{,}00150\,\mathrm{mol}$.
3. HCl in NaOH reagirata $1 : 1$, zato je $n_\mathrm{k} = 0{,}00150\,\mathrm{mol}$.
4. Koncentracija: $c_\mathrm{k} = \dfrac{0{,}00150\,\mathrm{mol}}{0{,}0100\,\mathrm{L}} = 0{,}150\,\mathrm{mol/L}$.
5. Odgovor: koncentracija klorovodikove kisline je $0{,}150\,\mathrm{mol/L}$.

### Primer 2: dvoprotonska kislina

$25{,}0\,\mathrm{mL}$ žveplove kisline titriramo z NaOH s koncentracijo $0{,}200\,\mathrm{mol/L}$. Do preskoka fenolftaleina porabimo $18{,}5\,\mathrm{mL}$. Kolikšna je koncentracija žveplove kisline?

**Podatki:** $V_\mathrm{k} = 25{,}0\,\mathrm{mL}$, $c_\mathrm{b} = 0{,}200\,\mathrm{mol/L}$, $V_\mathrm{b} = 18{,}5\,\mathrm{mL}$
**Iščemo:** koncentracijo $c_\mathrm{k}$ žveplove kisline

:::formula
$\mathrm{H_2SO_4} + 2\,\mathrm{NaOH} \rightarrow \mathrm{Na_2SO_4} + 2\,\mathrm{H_2O}$, zato $n_\mathrm{k} = \dfrac{n_\mathrm{b}}{2}$ in $c_\mathrm{k} = \dfrac{n_\mathrm{k}}{V_\mathrm{k}}$
:::

**Rešitev:**

1. Množina baze: $n_\mathrm{b} = 0{,}200\,\mathrm{mol/L} \cdot 0{,}0185\,\mathrm{L} = 0{,}00370\,\mathrm{mol}$.
2. Vsaka molekula $\mathrm{H_2SO_4}$ odda dva protona in porabi dva $\mathrm{OH^-}$, zato je kisline pol manj: $n_\mathrm{k} = \dfrac{0{,}00370\,\mathrm{mol}}{2} = 0{,}00185\,\mathrm{mol}$.
3. Koncentracija: $c_\mathrm{k} = \dfrac{0{,}00185\,\mathrm{mol}}{0{,}0250\,\mathrm{L}} = 0{,}0740\,\mathrm{mol/L}$.
4. Odgovor: koncentracija žveplove kisline je $0{,}0740\,\mathrm{mol/L}$.

### Primer 3: kis za čiščenje trobente

Trobentač si čistilo za ustnik pripravlja iz kisa in hoče vedeti, koliko ocetne kisline je v kisu. V šolskem laboratoriju $10{,}0\,\mathrm{mL}$ kisa v merilni bučki razredčijo z vodo na $100{,}0\,\mathrm{mL}$. Nato $20{,}0\,\mathrm{mL}$ razredčene raztopine titrirajo z NaOH s koncentracijo $0{,}100\,\mathrm{mol/L}$ ob fenolftaleinu in porabijo $16{,}6\,\mathrm{mL}$. Kolikšna je množinska koncentracija ocetne kisline v kisu in koliko gramov je je v litru? Molska masa ocetne kisline je $60{,}05\,\mathrm{g/mol}$.

**Podatki:** $V_\mathrm{kis} = 10{,}0\,\mathrm{mL}$, razredčeno na $100{,}0\,\mathrm{mL}$, $V_\mathrm{k} = 20{,}0\,\mathrm{mL}$, $c_\mathrm{b} = 0{,}100\,\mathrm{mol/L}$, $V_\mathrm{b} = 16{,}6\,\mathrm{mL}$, $M = 60{,}05\,\mathrm{g/mol}$
**Iščemo:** koncentracijo $c_\mathrm{kis}$ v kisu in masno koncentracijo $\gamma$

:::formula
$n_\mathrm{k} = n_\mathrm{b} = c_\mathrm{b} \cdot V_\mathrm{b}$; $c_\mathrm{r} = \dfrac{n_\mathrm{k}}{V_\mathrm{k}}$; $c_\mathrm{kis} = 10 \cdot c_\mathrm{r}$; $\gamma = c_\mathrm{kis} \cdot M$
:::

**Rešitev:**

1. Množina baze: $n_\mathrm{b} = 0{,}100\,\mathrm{mol/L} \cdot 0{,}0166\,\mathrm{L} = 0{,}00166\,\mathrm{mol}$. Ocetna kislina reagira z NaOH $1 : 1$, zato je $n_\mathrm{k} = 0{,}00166\,\mathrm{mol}$.
2. Koncentracija razredčene raztopine: $c_\mathrm{r} = \dfrac{0{,}00166\,\mathrm{mol}}{0{,}0200\,\mathrm{L}} = 0{,}0830\,\mathrm{mol/L}$.
3. Kis smo razredčili z $10\,\mathrm{mL}$ na $100\,\mathrm{mL}$, torej desetkrat. V kisu je koncentracija desetkrat večja: $c_\mathrm{kis} = 10 \cdot 0{,}0830\,\mathrm{mol/L} = 0{,}830\,\mathrm{mol/L}$.
4. Masna koncentracija: $\gamma = 0{,}830\,\mathrm{mol/L} \cdot 60{,}05\,\mathrm{g/mol} = 49{,}8\,\mathrm{g/L}$.
5. Odgovor: v kisu je ocetna kislina s koncentracijo $0{,}830\,\mathrm{mol/L}$, to je $49{,}8\,\mathrm{g}$ v litru ali približno $5\,\mathrm{g}$ v $100\,\mathrm{mL}$, kot pri navadnem kisu.

Fenolftalein je bil pravi izbor: ocetna kislina je šibka, zato je točka ekvivalence v bazičnem.

### Primer 4: zdaj ti

Koliko mililitrov klorovodikove kisline s koncentracijo $0{,}0500\,\mathrm{mol/L}$ porabimo za titracijo $20{,}0\,\mathrm{mL}$ apnice, raztopine $\mathrm{Ca(OH)_2}$ s koncentracijo $0{,}0200\,\mathrm{mol/L}$?

**Podatki:** $V_\mathrm{b} = 20{,}0\,\mathrm{mL}$, $c_\mathrm{b} = 0{,}0200\,\mathrm{mol/L}$, $c_\mathrm{k} = 0{,}0500\,\mathrm{mol/L}$
**Iščemo:** prostornino kisline $V_\mathrm{k}$

:::formula
$\mathrm{Ca(OH)_2} + 2\,\mathrm{HCl} \rightarrow \mathrm{CaCl_2} + 2\,\mathrm{H_2O}$, zato $n_\mathrm{k} = 2 \cdot n_\mathrm{b}$ in $V_\mathrm{k} = \dfrac{n_\mathrm{k}}{c_\mathrm{k}}$
:::

**Rešitev:**

1. Množina baze: $n_\mathrm{b} = 0{,}0200\,\mathrm{mol/L} \cdot 0{,}0200\,\mathrm{L} = 0{,}000400\,\mathrm{mol}$.
2. Vsaka formulska enota $\mathrm{Ca(OH)_2}$ ima dva hidroksidna iona, zato potrebuje dve molekuli HCl.
3. Izračunaj $n_\mathrm{k}$ in nato $V_\mathrm{k}$, potem preveri:

:::premisli
Koliko HCl potrebuješ in kolikšna je poraba?
---
$n_\mathrm{k} = 2 \cdot 0{,}000400\,\mathrm{mol} = 0{,}000800\,\mathrm{mol}$, $V_\mathrm{k} = \dfrac{0{,}000800\,\mathrm{mol}}{0{,}0500\,\mathrm{mol/L}} = 0{,}0160\,\mathrm{L}$, torej $16{,}0\,\mathrm{mL}$.
:::

## Pogoste napake

- **»Šibka kislina porabi manj baze.«** Učenec sklepa iz nizke koncentracije oksonijevih ionov. Vendar baza reagira tudi z molekulami, ki protona še niso oddale, in ravnotežje se pomika, dokler ne odda protona vsaka. Poraba je odvisna od množine kisline, ne od jakosti.
- **»V točki ekvivalence je pH vedno 7.«** To velja le za močno kislino z močno bazo. Pri šibki kislini z močno bazo ostane konjugirana baza (pH nad $7$), pri šibki bazi z močno kislino konjugirana kislina, na primer $\mathrm{NH_4^+}$ (pH pod $7$).
- **Brez razmerja iz enačbe.** Pri žveplovi kislini nekdo kar izenači $n_\mathrm{k} = n_\mathrm{b}$ in dobi dvakrat preveliko koncentracijo. Najprej zapiši enačbo reakcije in preberi koeficiente.
- **Deljenje s skupno prostornino.** Na koncu je v erlenmajerici vzorec in titrant skupaj, a kislina je prišla le z vzorcem. V $c_\mathrm{k} = \dfrac{n_\mathrm{k}}{V_\mathrm{k}}$ sodi samo prostornina vzorca.
- **»Dodana voda spremeni porabo.«** Če v erlenmajerico prilijemo vodo, se množina kisline ne spremeni, zato poraba ostane enaka. Spremeni se le začetni pH.

## Povzetek

- Titracija: vzorcu (analitu) iz birete dodajamo titrant z znano koncentracijo, dokler ne dosežemo točke ekvivalence.
- Nevtralizacija: $\mathrm{H_3O^+} + \mathrm{OH^-} \rightarrow 2\,\mathrm{H_2O}$; v točki ekvivalence sta množini kisline in baze v razmerju iz enačbe reakcije.
- Titracijska krivulja ima ob točki ekvivalence navpičen skok pH. Močna kislina z močno bazo: TE pri pH $7$; šibka kislina z močno bazo: TE nad $7$; šibka baza z močno kislino: TE pod $7$.
- Indikator izberemo tako, da je njegovo območje preskoka znotraj skoka (za ocetno kislino fenolftalein).
- Računanje: $n_\mathrm{b} = c_\mathrm{b} \cdot V_\mathrm{b}$, razmerje iz enačbe, $c_\mathrm{k} = \dfrac{n_\mathrm{k}}{V_\mathrm{k}}$ s prostornino vzorca.
- Poraba je odvisna od množine kisline, ne od njene jakosti in ne od dodane vode.

## Drugače: Z analogijo

Predstavljaj si dvorano, v kateri igra $2000$ violinistov. Vsak violinist je en oksonijev ion. Uho glasnosti ne zaznava sorazmerno, ampak logaritemsko, podobno kot je pH logaritem koncentracije.

Vsaka kapljica baze pošlje nekaj violinistov domov. Ko jih odide polovica, komaj opaziš, da je tiše. Tudi ko jih ostane le $100$, se še vedno sliši orkester. Ko pa odide še zadnjih nekaj, iz glasbe nenadoma nastane tišina. To je točka ekvivalence: nevtralno.

Nato začnejo prihajati trobentači, hidroksidni ioni v presežku. Že prvi trobentač v tihi dvorani je izrazito slišen. Prehod od zadnje violine do prve trobente je navpični skok na titracijski krivulji.

Pri šibki kislini večina violinistov sedi s spuščenim lokom (molekule, ki protona še niso oddale). Ko kdo odide, eden od njih začne igrati. Zato je pri šibki kislini na začetku tiše, a do konca odpošlješ prav toliko glasbenikov.

Analogija ima mejo: violinisti ne nastajajo iz trobentačev, ioni $\mathrm{H_3O^+}$ in $\mathrm{OH^-}$ pa se res spojijo v vodo.

## Drugače: Iz vsakdanjega življenja

- **Mleko.** V mlekarni sproti preverjajo, ali je mleko sveže. Ko se kisa, v njem nastaja mlečna kislina. Vzorec titrirajo z NaOH ob fenolftaleinu: večja poraba pomeni bolj kislo mleko.
- **Kis in vino.** Oznaka »$9\,\%$« na steklenici kisa in skupna kislost vina na etiketi sta izmerjeni s titracijo, enako kot v primeru 3.
- **Tablete proti zgagi.** Na navodilih piše, koliko želodčne kisline nevtralizira ena tableta. To so izmerili tako, da so tableto raztopili v znani množini klorovodikove kisline in z NaOH titrirali kislino, ki je ostala.

V vseh primerih je vprašanje isto kot v delavnici glasbene šole: ne kako kislo je, ampak koliko kisline je.

## Preveri se

? Pri titraciji kisa z NaOH smo dosegli točko ekvivalence. Kaj to pomeni?
- pH raztopine je natanko $7$.
~ pH $7$ v točki ekvivalence velja le za močno kislino z močno bazo. Tu ostane acetat, ki je baza, zato je pH nad $7$.
+ Dodana množina NaOH ravno ustreza množini ocetne kisline po enačbi reakcije.
- Indikator je spremenil barvo.
~ To je končna točka. Z dobrim indikatorjem je zelo blizu točke ekvivalence, a ni isti pojem: s slabim indikatorjem je lahko daleč od nje.
- V erlenmajerici ni več nobenih ionov.
~ Ioni ostanejo: natrijevi in acetatni ioni so v raztopini, porabili so se le protoni kisline in hidroksidni ioni.
> Točka ekvivalence je določena z množinama: $n(\mathrm{NaOH}) = n(\mathrm{CH_3COOH})$, ker reagirata $1 : 1$.

? Vse raztopine imajo koncentracijo $0{,}1\,\mathrm{mol/L}$. Razvrsti titracije po pH v točki ekvivalence od najnižjega do najvišjega: A – HCl z NaOH, B – ocetna kislina z NaOH, C – amonijak s HCl.
- A = B = C
~ Kdor misli, da je pH v točki ekvivalence vedno $7$, izbere to. Ostanejo pa različni ioni: acetat je baza, amonijev ion kislina.
- B, A, C
~ Zamenjan je vrstni red: šibka kislina ne pusti kisle raztopine, ampak svojo konjugirano bazo, ki pH dvigne nad $7$.
+ C, A, B
- A, B, C
~ A ima pH $7$, C pa manj: amonijev ion $\mathrm{NH_4^+}$, ki ostane, je šibka kislina.
> C: ostane $\mathrm{NH_4^+}$, pH okoli $5{,}3$. A: ostane NaCl, pH $7$. B: ostane acetat, pH okoli $8{,}7$.

? Kaj se zgodi s porabo NaOH, če pred titracijo v erlenmajerico z $20\,\mathrm{mL}$ kisline prilijemo še $50\,\mathrm{mL}$ vode?
- Poveča se, ker je v erlenmajerici več raztopine.
~ Baza ne reagira z vodo, ampak s kislino. Kisline je toliko kot prej.
- Zmanjša se, ker je kislina bolj razredčena.
~ Razredčena kislina ima manjšo koncentracijo, a enako množino. Poraba je odvisna od množine.
+ Ostane enaka.
> Voda ne prinese in ne odnese kisline. Spremeni se le začetni pH in oblika krivulje, točka ekvivalence pa ostane pri isti porabi.

? $25{,}0\,\mathrm{mL}$ klorovodikove kisline titriramo z NaOH s koncentracijo $0{,}100\,\mathrm{mol/L}$ in porabimo $20{,}0\,\mathrm{mL}$. Kolikšna je koncentracija kisline?
- $0{,}125\,\mathrm{mol/L}$
~ Prostornini sta obrnjeni: $0{,}100 \cdot \dfrac{25{,}0}{20{,}0}$. Baze porabimo manj, kot je vzorca, zato je koncentracija kisline manjša od $0{,}100\,\mathrm{mol/L}$.
+ $0{,}0800\,\mathrm{mol/L}$
- $0{,}0444\,\mathrm{mol/L}$
~ Deljeno je s skupno prostornino $45{,}0\,\mathrm{mL}$. Kislina je prišla le z vzorcem s $25{,}0\,\mathrm{mL}$.
> $n_\mathrm{b} = 0{,}100\,\mathrm{mol/L} \cdot 0{,}0200\,\mathrm{L} = 0{,}00200\,\mathrm{mol} = n_\mathrm{k}$, $c_\mathrm{k} = \dfrac{0{,}00200\,\mathrm{mol}}{0{,}0250\,\mathrm{L}} = 0{,}0800\,\mathrm{mol/L}$.

? $10{,}0\,\mathrm{mL}$ žveplove kisline titriramo z NaOH s koncentracijo $0{,}200\,\mathrm{mol/L}$ in porabimo $15{,}0\,\mathrm{mL}$. Kolikšna je koncentracija žveplove kisline?
- $0{,}300\,\mathrm{mol/L}$
~ Manjka razmerje iz enačbe: $\mathrm{H_2SO_4}$ porabi dva NaOH, zato je kisline pol manj kot baze.
- $0{,}600\,\mathrm{mol/L}$
~ Razmerje je uporabljeno v napačno smer: množino baze je treba deliti z $2$, ne množiti.
+ $0{,}150\,\mathrm{mol/L}$
> $n_\mathrm{b} = 0{,}200\,\mathrm{mol/L} \cdot 0{,}0150\,\mathrm{L} = 0{,}00300\,\mathrm{mol}$, $n_\mathrm{k} = \dfrac{0{,}00300\,\mathrm{mol}}{2} = 0{,}00150\,\mathrm{mol}$, $c_\mathrm{k} = \dfrac{0{,}00150\,\mathrm{mol}}{0{,}0100\,\mathrm{L}} = 0{,}150\,\mathrm{mol/L}$.

:::simboli
n_\mathrm{b} | množina baze | n_\mathrm{b} = c_\mathrm{b} \cdot V_\mathrm{b} | mol
c_\mathrm{b} | koncentracija baze | | mol/L
V_\mathrm{b} | prostornina baze (poraba ali vzorec) | | L
n_\mathrm{k} | množina kisline | | mol | po razmerju iz enačbe reakcije
c_\mathrm{k} | koncentracija kisline | c_\mathrm{k} = \dfrac{n_\mathrm{k}}{V_\mathrm{k}} | mol/L
V_\mathrm{k} | prostornina kisline (vzorec ali poraba) | V_\mathrm{k} = \dfrac{n_\mathrm{k}}{c_\mathrm{k}} | L
c_\mathrm{r} | koncentracija razredčenega kisa | c_\mathrm{r} = \dfrac{n_\mathrm{k}}{V_\mathrm{k}} | mol/L
c_\mathrm{kis} | koncentracija ocetne kisline v kisu | c_\mathrm{kis} = 10 \cdot c_\mathrm{r} | mol/L | kis je bil razredčen desetkrat
\gamma | masna koncentracija | \gamma = c_\mathrm{kis} \cdot M | g/L
M | molska masa ocetne kisline | | g/mol
V_\mathrm{kis} | prostornina kisa pred redčenjem | | L
:::
