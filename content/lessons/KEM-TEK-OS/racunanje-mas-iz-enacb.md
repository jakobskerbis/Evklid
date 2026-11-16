---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poskus za domačo kuhinjo. Na kuhinjski tehtnici odmeri $84\,\mathrm{g}$ sode bikarbone, to je natrijev hidrogenkarbonat $\mathrm{NaHCO_3}$. Stresi jo v tanki plasti v ognjevarno posodo in jo eno uro peci v pečici pri $200\,\mathrm{^\circ C}$. Ko se ohladi, prah znova stehtaj (brez posode). Tehtnica pokaže le še okoli $53\,\mathrm{g}$.

Kam je izginilo $31\,\mathrm{g}$? Ob segrevanju soda bikarbona razpade:

$\mathrm{2\,NaHCO_3 \rightarrow Na_2CO_3 + H_2O + CO_2}$

Vodna para in ogljikov dioksid uideta v zrak. Isti plin dvigne testo, ko pečeš pecivo s sodo. Ostane natrijev karbonat, soda za pranje, ki ni za hrano.

Zanimivo je, da lahko $53\,\mathrm{g}$ napoveš, še preden prižgeš pečico. Potrebuješ le urejeno enačbo in molske mase. Takšne napovedi so jedro računskih nalog na tekmovanju: koliko produkta nastane, koliko reaktanta potrebuješ, kaj ostane in koliko dobiš zares.

## Razlaga

Kemijska enačba je podobna receptu. Če za $4$ palačinke potrebuješ $1$ jajce, za $12$ palačink vzameš $3$ jajca. Enako sklepanje velja v kemiji, a s tremi pomembnimi razlikami. Tabela kaže, kaj v enačbi ustreza delom recepta; pojme na desni razložimo spodaj.

| Recept | Enačba |
|---|---|
| grami, kosi | moli |
| zmanjka jajc | omejitveni reaktant |
| ostane moka | reaktant v prebitku |
| spečeš manj od načrta | izkoristek |

**Prva razlika: koeficienti niso grami.** Recept ti da kose in grame, ki jih takoj odmeriš. Koeficienti v enačbi pa štejejo mole. Pri $\mathrm{CH_4 + 2\,O_2 \rightarrow CO_2 + 2\,H_2O}$ (gorenje metana v plinskem štedilniku) en mol metana da en mol $\mathrm{CO_2}$. Gram metana pa ne da grama $\mathrm{CO_2}$, ker ima en mol vsake snovi drugačno maso.

Zato maso vedno najprej pretvorimo v množino, nato uporabimo razmerje koeficientov in na koncu množino pretvorimo nazaj v maso. Za reakcijo $a\,\mathrm{A} \rightarrow b\,\mathrm{B}$:

$$n_A = \frac{m_A}{M_A}$$

$$n_B = n_A \cdot \frac{b}{a}$$

$$m_B = n_B \cdot M_B$$

Tu sta $a$ in $b$ koeficienta snovi A in B v urejeni enačbi.

:::premisli
Sošolec trdi: »Ko zgori $16\,\mathrm{g}$ metana, nastane $16\,\mathrm{g}$ ogljikovega dioksida, saj je razmerje $1 : 1$.« Ima prav? Napovej, nato preveri z molskima masama $16\,\mathrm{g/mol}$ in $44\,\mathrm{g/mol}$.
---
Ne. $16\,\mathrm{g}$ metana je $1\,\mathrm{mol}$, nastane $1\,\mathrm{mol}$ $\mathrm{CO_2}$, to je $44\,\mathrm{g}$. Več mase nastane zato, ker se vanj vgradi tudi kisik iz zraka.
:::

**Druga razlika: kaj zmanjka prvo.** Imaš $2$ jajci in moke za $12$ palačink. Naredil boš le $8$ palačink, ker zmanjka jajc. Moka je v prebitku. V kemiji reaktantu, ki se porabi prvi, rečemo **omejitveni reaktant**. Ta določa, koliko produkta nastane. Drugi reaktant je **v prebitku**: del ga ostane.

Pri primerjavi ne gledamo mas, ampak množine, deljene s koeficienti. Za $\mathrm{Fe + S \rightarrow FeS}$ je razmerje $1 : 1$. Če imaš $2\,\mathrm{mol}$ železa in $3\,\mathrm{mol}$ žvepla, se porabi vse železo, žvepla pa ostane $1\,\mathrm{mol}$. Reaktant z manjšim količnikom $\dfrac{n}{\text{koeficient}}$ je omejitveni.

**Tretja razlika: koliko dobiš zares.** Iz recepta za $12$ palačink jih včasih spečeš $11$, ker nekaj testa ostane v skledi. Tudi v laboratoriju dobimo manj, kot napove račun: nekaj se izgubi pri filtriranju, nekaj reaktanta ne zreagira. Masa iz računa je **teoretična masa** $m_{\mathrm{teor}}$, izmerjena je **dejanska masa** $m_{\mathrm{dej}}$. Njuno razmerje je **izkoristek** $\eta$:

$$\eta = \frac{m_{\mathrm{dej}}}{m_{\mathrm{teor}}} \cdot 100\,\%$$

Izkoristek ni nikoli večji od $100\,\%$. Če ti račun da več, si verjetno zamenjal števec in imenovalec ali pa je produkt še vlažen.

:::premisli
Masa se pri reakciji ohranja. Zakaj potem soda bikarbona v pečici izgubi $31\,\mathrm{g}$?
---
Ker posoda ni zaprta. Vodna para in $\mathrm{CO_2}$ sta produkta, a uideta v zrak. Če ju prišteješ ostanku, dobiš spet $84\,\mathrm{g}$.
:::

V simulaciji spodaj »Mase pri reakciji« izberi gorenje metana in nastavi $16\,\mathrm{g}$. Opazuj, da sta vsota mas reaktantov in vsota mas produktov enaki, čeprav so posamezni stolpci zelo različni. V simulaciji »Prebitek in omejitveni reaktant« nastavi $6$ molekul $\mathrm{H_2}$ in $4$ molekule $\mathrm{O_2}$ ter poišči, kaj ostane.

## Rešeni primeri

### Primer 1 (lažji): ogljikov dioksid iz štedilnika

V plinskem štedilniku zgori $32\,\mathrm{g}$ metana: $\mathrm{CH_4 + 2\,O_2 \rightarrow CO_2 + 2\,H_2O}$. Koliko gramov $\mathrm{CO_2}$ nastane?

**Podatki:** $m(\mathrm{CH_4}) = 32\,\mathrm{g}$, $M(\mathrm{CH_4}) = 16\,\mathrm{g/mol}$, $M(\mathrm{CO_2}) = 44\,\mathrm{g/mol}$, razmerje $\mathrm{CH_4} : \mathrm{CO_2} = 1 : 1$
**Iščemo:** $m(\mathrm{CO_2})$

:::formula
$n = \dfrac{m}{M}$, razmerje koeficientov, $m = n \cdot M$
:::

**Rešitev:**

1. Masa v množino, ker koeficienti štejejo mole: $n(\mathrm{CH_4}) = \dfrac{32\,\mathrm{g}}{16\,\mathrm{g/mol}} = 2\,\mathrm{mol}$.
2. Razmerje $1 : 1$, zato $n(\mathrm{CO_2}) = 2\,\mathrm{mol}$.
3. Množina v maso: $m(\mathrm{CO_2}) = 2\,\mathrm{mol} \cdot 44\,\mathrm{g/mol} = 88\,\mathrm{g}$.
4. Preverba z ohranitvijo mase: porabi se $4\,\mathrm{mol}$ kisika, to je $128\,\mathrm{g}$, nastane $4\,\mathrm{mol}$ vode, to je $72\,\mathrm{g}$. Levo $32 + 128 = 160$, desno $88 + 72 = 160$.
5. Odgovor: nastane $88\,\mathrm{g}$ ogljikovega dioksida.

### Primer 2: koliko sode za mehurčke

Slaščičar želi, da v testu iz sode bikarbone nastane $2{,}2\,\mathrm{g}$ ogljikovega dioksida. Koliko sode bikarbone mora razpasti? Enačba: $\mathrm{2\,NaHCO_3 \rightarrow Na_2CO_3 + H_2O + CO_2}$.

**Podatki:** $m(\mathrm{CO_2}) = 2{,}2\,\mathrm{g}$, $M(\mathrm{CO_2}) = 44\,\mathrm{g/mol}$, $M(\mathrm{NaHCO_3}) = 84\,\mathrm{g/mol}$, razmerje $\mathrm{NaHCO_3} : \mathrm{CO_2} = 2 : 1$
**Iščemo:** $m(\mathrm{NaHCO_3})$

:::formula
Pot nazaj: od produkta k reaktantu, $n(\mathrm{NaHCO_3}) = 2 \cdot n(\mathrm{CO_2})$
:::

**Rešitev:**

1. $n(\mathrm{CO_2}) = \dfrac{2{,}2\,\mathrm{g}}{44\,\mathrm{g/mol}} = 0{,}05\,\mathrm{mol}$.
2. Za vsak mol $\mathrm{CO_2}$ razpadeta dva mola sode: $n(\mathrm{NaHCO_3}) = 2 \cdot 0{,}05 = 0{,}1\,\mathrm{mol}$.
3. $m(\mathrm{NaHCO_3}) = 0{,}1\,\mathrm{mol} \cdot 84\,\mathrm{g/mol} = 8{,}4\,\mathrm{g}$.
4. Odgovor: razpasti mora $8{,}4\,\mathrm{g}$ sode bikarbone.

### Primer 3 (težji): železo in žveplo v prebitku

Pri šolskem poskusu segrejemo zmes $7{,}0\,\mathrm{g}$ železa in $6{,}0\,\mathrm{g}$ žvepla: $\mathrm{Fe + S \rightarrow FeS}$. Kateri reaktant je v prebitku in koliko ga ostane? Koliko železovega sulfida bi teoretično nastalo? Stehtamo $9{,}9\,\mathrm{g}$ produkta. Kolikšen je izkoristek?

**Podatki:** $m(\mathrm{Fe}) = 7{,}0\,\mathrm{g}$, $m(\mathrm{S}) = 6{,}0\,\mathrm{g}$, $M(\mathrm{Fe}) = 56\,\mathrm{g/mol}$, $M(\mathrm{S}) = 32\,\mathrm{g/mol}$, $M(\mathrm{FeS}) = 88\,\mathrm{g/mol}$, $m_{\mathrm{dej}} = 9{,}9\,\mathrm{g}$
**Iščemo:** reaktant v prebitku, ostanek, $m_{\mathrm{teor}}(\mathrm{FeS})$, $\eta$

:::formula
Primerjaj $\dfrac{n}{\text{koeficient}}$; manjši je omejitveni reaktant. $\eta = \dfrac{m_{\mathrm{dej}}}{m_{\mathrm{teor}}} \cdot 100\,\%$
:::

**Rešitev:**

1. $n(\mathrm{Fe}) = \dfrac{7{,}0}{56} = 0{,}125\,\mathrm{mol}$ in $n(\mathrm{S}) = \dfrac{6{,}0}{32} = 0{,}1875\,\mathrm{mol}$.
2. Koeficienta sta $1$ in $1$, zato primerjamo kar množini. Železa je manj: železo je omejitveni reaktant, žveplo je v prebitku. Pozor: po masi je železa več, a to ne odloča.
3. Žvepla se porabi $0{,}125\,\mathrm{mol}$, ostane $0{,}1875 - 0{,}125 = 0{,}0625\,\mathrm{mol}$, to je $0{,}0625 \cdot 32 = 2{,}0\,\mathrm{g}$.
4. $n(\mathrm{FeS}) = n(\mathrm{Fe}) = 0{,}125\,\mathrm{mol}$, zato $m_{\mathrm{teor}} = 0{,}125 \cdot 88 = 11{,}0\,\mathrm{g}$. Preverba: $7{,}0 + 6{,}0 = 11{,}0 + 2{,}0$.
5. Izkoristek: $\eta = \dfrac{9{,}9\,\mathrm{g}}{11{,}0\,\mathrm{g}} \cdot 100\,\% = 90\,\%$.
6. Odgovor: žveplo je v prebitku, ostane ga $2{,}0\,\mathrm{g}$. Teoretično nastane $11{,}0\,\mathrm{g}$ $\mathrm{FeS}$, izkoristek je $90\,\%$.

### Primer 4 – zdaj ti: napoved za pečico

Napovej rezultat poskusa iz uvoda. Koliko natrijevega karbonata ostane, ko v celoti razpade $84\,\mathrm{g}$ sode bikarbone? Koliko mase odnesejo plini?

**Podatki:** $m(\mathrm{NaHCO_3}) = 84\,\mathrm{g}$, $M(\mathrm{NaHCO_3}) = 84\,\mathrm{g/mol}$, $M(\mathrm{Na_2CO_3}) = 106\,\mathrm{g/mol}$, razmerje $\mathrm{NaHCO_3} : \mathrm{Na_2CO_3} = 2 : 1$
**Iščemo:** $m(\mathrm{Na_2CO_3})$ in maso plinov

:::formula
$n(\mathrm{Na_2CO_3}) = \dfrac{1}{2} \cdot n(\mathrm{NaHCO_3})$, $m = n \cdot M$
:::

**Rešitev:**

1. $n(\mathrm{NaHCO_3}) = \dfrac{84\,\mathrm{g}}{84\,\mathrm{g/mol}} = 1\,\mathrm{mol}$.
2. Iz dveh molov sode bikarbone nastane en mol sode, zato $n(\mathrm{Na_2CO_3}) = 0{,}5\,\mathrm{mol}$.
3. Izračunaj sam maso ostanka in maso plinov.

:::premisli
Koliko gramov ostane in koliko odnesejo plini?
---
$m(\mathrm{Na_2CO_3}) = 0{,}5 \cdot 106 = 53\,\mathrm{g}$. Plini odnesejo $84 - 53 = 31\,\mathrm{g}$: to je $0{,}5\,\mathrm{mol}$ vode ($9\,\mathrm{g}$) in $0{,}5\,\mathrm{mol}$ $\mathrm{CO_2}$ ($22\,\mathrm{g}$).
:::

## Pogoste napake

- **Koeficienti kot razmerje mas.** »Iz $\mathrm{2\,NaHCO_3 \rightarrow \ldots + CO_2}$ sledi, da $2\,\mathrm{g}$ sode dasta $1\,\mathrm{g}$ $\mathrm{CO_2}$.« Koeficienti štejejo mole. Popravek: najprej $n = \dfrac{m}{M}$, šele nato razmerje.
- **Koeficient dvakrat.** Učenec za $\mathrm{2\,Mg}$ vzame $M = 2 \cdot 24 = 48\,\mathrm{g/mol}$ in nato množino še pomnoži z $2$. Molska masa je vedno za en mol ene snovi; koeficient uporabiš samo v razmerju množin.
- **Omejitveni reaktant po masi.** »Železa je $7\,\mathrm{g}$, žvepla $6\,\mathrm{g}$, torej zmanjka žvepla.« Odloča množina, deljena s koeficientom, ne masa. Žveplo ima manjšo molsko maso, zato je v $6\,\mathrm{g}$ več molov.
- **Produkt iz reaktanta v prebitku.** Če računaš maso produkta iz reaktanta v prebitku, dobiš preveč, saj ga del ne zreagira. Računaj iz omejitvenega reaktanta.
- **Obrnjen izkoristek.** $\dfrac{m_{\mathrm{teor}}}{m_{\mathrm{dej}}}$ da več kot $100\,\%$, kar ni mogoče. V števcu je vedno dejanska masa.

## Povzetek

- Pot računa: masa A, množina A ($n = \dfrac{m}{M}$), množina B (razmerje koeficientov), masa B ($m = n \cdot M$).
- Koeficienti so razmerje molov, ne gramov.
- Skupna masa reaktantov, ki zreagirajo, je enaka skupni masi produktov (pazi na pline, ki uidejo).
- Omejitveni reaktant ima najmanjše razmerje $\dfrac{n}{\text{koeficient}}$; produkt računaš iz njega. Drugi je v prebitku; ostanek je začetna množina minus porabljena.
- Izkoristek $\eta = \dfrac{m_{\mathrm{dej}}}{m_{\mathrm{teor}}} \cdot 100\,\%$, nikoli nad $100\,\%$.

## Drugače: Na sliki

Vsak račun mas iz enačbe je pot čez štiri postaje. Med dvema masama ni neposredne poti; vedno greš čez mole.

:::risba skica
opis: Štiri škatle v vrsti, povezane s puščicami: masa A, mol A, mol B, masa B. Pod prvo puščico piše deljeno z M(A), pod drugo krat b/a, pod tretjo krat M(B). Spodaj piše: a in b sta koeficienta iz enačbe.
območje: 0; 0 .. 12; 4
enota: 25
pravokotnik: 0,2; 2,2 .. 2,4; 3,4 | modra
pravokotnik: 3,3; 2,2 .. 5,5; 3,4 | oranžna
pravokotnik: 6,5; 2,2 .. 8,7; 3,4 | oranžna
pravokotnik: 9,6; 2,2 .. 11,8; 3,4 | modra
napis: 1,3; 2,8 | masa A | sredina
napis: 4,4; 2,8 | mol A | sredina
napis: 7,6; 2,8 | mol B | sredina
napis: 10,7; 2,8 | masa B | sredina
puščica: 2,5; 2,8 -> 3,2; 2,8
puščica: 5,6; 2,8 -> 6,4; 2,8
puščica: 8,8; 2,8 -> 9,5; 2,8
napis: 2,85; 1,6 | ÷ M(A) | sredina
napis: 6,0; 1,6 | · b/a | sredina
napis: 9,15; 1,6 | · M(B) | sredina
napis: 6,0; 0,6 | a, b: koeficienta iz enačbe | sredina
:::

Škatle z maso so na robu, ker maso izmeriš s tehtnico. Škatle z moli so v sredini, ker le tam velja razmerje koeficientov. Kdor skoči neposredno od mase A do mase B, preskoči obe sredinski škatli in dobi napačen rezultat.

## Drugače: Iz vsakdanjega življenja

Pripravljaš sendviče. Za en sendvič potrebuješ $2$ rezini kruha in $1$ rezino sira: »$2$ kruh $+ 1$ sir $\rightarrow 1$ sendvič«. To je urejena enačba v kuhinji.

- Imaš $10$ rezin kruha in $4$ rezine sira. Kruha je za $5$ sendvičev, sira za $4$. Sir je omejitveni reaktant, nastanejo $4$ sendviči in ostaneta $2$ rezini kruha (prebitek).
- Kruha je po številu več, a to samo po sebi ne pove ničesar: deliti moraš s koeficientom, kot pri molih.
- En sendvič ti pade na tla. Teoretično bi jih imel $4$, dejansko $3$: izkoristek je $75\,\%$.

Edina razlika do kemije: rezine lahko prešteješ, molekule pa najprej stehtaš in z molsko maso pretvoriš v mole.

## Preveri se

? Zakaj pri računanju mas iz enačbe maso najprej pretvorimo v množino?
- Ker so mase reaktantov vedno enake masam produktov.
~ Skupna masa se res ohranja, a posamezna masa produkta ni enaka masi reaktanta. Razmerje iz enačbe velja za mole.
+ Ker koeficienti v enačbi povedo razmerje množin (delcev), ne mas.
- Ker so grami prevelika enota za kemijske račune.
~ Velikost enote ni razlog. Tudi v kilogramih bi bilo razmerje mas drugačno od razmerja koeficientov.
> Koeficienti štejejo delce. Ker imajo delci različnih snovi različno maso, moramo maso pretvoriti v mole in šele nato uporabiti razmerje.

? Stolpca kažeta množini vodika in kisika pred reakcijo $\mathrm{2\,H_2 + O_2 \rightarrow 2\,H_2O}$. Kateri reaktant je v prebitku in koliko ga ostane?
:::risba stolpci
opis: Stolpčni diagram množine pred reakcijo. Vodik H₂ ima 3 mol, kisik O₂ ima 2 mol.
os: množina (mol)
korak: 1
stolpec: H_2 | 3
stolpec: O_2 | 2
:::
- Vodik, ostane $1\,\mathrm{mol}$.
~ Vodika je res več, a za vsak mol kisika ga potrebuješ dva, ne enega. Deli množino s koeficientom: $\tfrac{3}{2}$ proti $\tfrac{2}{1}$.
+ Kisik, ostane $0{,}5\,\mathrm{mol}$.
- Kisik, ostane $1\,\mathrm{mol}$.
~ Porabo kisika si prebral kar iz koeficienta ($1\,\mathrm{mol}$). Za $3\,\mathrm{mol}$ vodika se porabi polovica toliko kisika, $1{,}5\,\mathrm{mol}$.
> $3\,\mathrm{mol}$ $\mathrm{H_2}$ porabijo $\tfrac{3}{2} = 1{,}5\,\mathrm{mol}$ $\mathrm{O_2}$. Kisika je $2\,\mathrm{mol}$, ostane $0{,}5\,\mathrm{mol}$. Vodik je omejitveni reaktant.

? Oceni: približno koliko gramov $\mathrm{CO_2}$ nastane, ko na štedilniku zgori $100\,\mathrm{g}$ metana ($\mathrm{CH_4 + 2\,O_2 \rightarrow CO_2 + 2\,H_2O}$; $M(\mathrm{CH_4}) = 16\,\mathrm{g/mol}$, $M(\mathrm{CO_2}) = 44\,\mathrm{g/mol}$)?
= 275 g | 15
~ 100 | Masa se ne prenese iz reaktanta v produkt. Razmerje $1 : 1$ velja za mole, $\mathrm{CO_2}$ pa je skoraj trikrat težji od metana.
~ 36 | Molski masi si zamenjal. Množina metana je $\tfrac{100}{16}$, ne $\tfrac{100}{44}$.
> $n(\mathrm{CH_4}) = \dfrac{100}{16} = 6{,}25\,\mathrm{mol}$, enako mola $\mathrm{CO_2}$: $m = 6{,}25 \cdot 44 = 275\,\mathrm{g}$. Hitra ocena: $100 \cdot \tfrac{44}{16} \approx 100 \cdot 2{,}75$.

? Koliko gramov magnezija potrebuješ, da nastane $10\,\mathrm{g}$ magnezijevega oksida? ($\mathrm{2\,Mg + O_2 \rightarrow 2\,MgO}$; $M(\mathrm{Mg}) = 24\,\mathrm{g/mol}$, $M(\mathrm{MgO}) = 40\,\mathrm{g/mol}$)
= 6,0 g | 0,1
~ 12 | Koeficient $2$ si upošteval dvakrat. Razmerje $\mathrm{Mg} : \mathrm{MgO} = 2 : 2 = 1 : 1$.
~ 10 | Masa reaktanta ni enaka masi produkta: v $\mathrm{MgO}$ je tudi kisik.
~ 3 | Razmerje si vzel $1 : 2$. Koeficienta sta enaka, zato je množina magnezija enaka množini oksida.
> $n(\mathrm{MgO}) = \dfrac{10}{40} = 0{,}25\,\mathrm{mol}$, $n(\mathrm{Mg}) = 0{,}25\,\mathrm{mol}$, $m(\mathrm{Mg}) = 0{,}25 \cdot 24 = 6{,}0\,\mathrm{g}$.

? Pri žganju apnenca $\mathrm{CaCO_3 \rightarrow CaO + CO_2}$ iz $50\,\mathrm{g}$ $\mathrm{CaCO_3}$ dobimo $25{,}2\,\mathrm{g}$ žganega apna $\mathrm{CaO}$. Kolikšen je izkoristek v odstotkih? ($M(\mathrm{CaCO_3}) = 100\,\mathrm{g/mol}$, $M(\mathrm{CaO}) = 56\,\mathrm{g/mol}$)
= 90 % | 1
~ 50,4 | Dejansko maso si delil z maso reaktanta. Deliti moraš s teoretično maso produkta, $28\,\mathrm{g}$.
~ 111 | Ulomek je obrnjen. Izkoristek ne more biti nad $100\,\%$: v števcu je dejanska masa.
> $n(\mathrm{CaCO_3}) = \dfrac{50}{100} = 0{,}5\,\mathrm{mol}$, $m_{\mathrm{teor}}(\mathrm{CaO}) = 0{,}5 \cdot 56 = 28\,\mathrm{g}$, $\eta = \dfrac{25{,}2}{28} \cdot 100\,\% = 90\,\%$.

<<RACUN
kemija: 2 NaHCO3 -> Na2CO3 + H2O + CO2
kemija: CH4 + 2 O2 -> CO2 + 2 H2O
molska: NaHCO3 | 84
molska: Na2CO3 | 106
molska: FeS | 88
vrednost: 32/16*44 | 88
vrednost: 32+4*32 | 88+2*2*18
vrednost: 2.2/44*2*84 | 8.4
vrednost: 7/56 | 0.125
vrednost: 6/32 | 0.1875
vrednost: (6/32-7/56)*32 | 2
vrednost: 7/56*88 | 11
vrednost: 9.9/11*100 | 90
vrednost: 84/84/2*106 | 53
vrednost: 84-53 | 0.5*18+0.5*44
vrednost: 100/16*44 | 275
vrednost: 10/40*24 | 6
vrednost: 25.2/(50/100*56)*100 | 90
>>

:::simboli
n, n_A, n_B | množina snovi A oziroma B | n_A = \frac{m_A}{M_A} | mol
m, m_A, m_B | masa snovi A oziroma B | m_B = n_B \cdot M_B | g
M, M_A, M_B | molska masa snovi A oziroma B | | g/mol
a, b | koeficienta snovi A in B v urejeni enačbi | | – | cela števila pred formulama
\eta | izkoristek | \eta = \frac{m_{\mathrm{dej}}}{m_{\mathrm{teor}}} \cdot 100\,\% | \% | nikoli nad $100\,\%$
m_{\mathrm{dej}} | dejanska (izmerjena) masa produkta | | g
m_{\mathrm{teor}} | teoretična masa produkta | | g | izračunana iz omejitvenega reaktanta
:::
