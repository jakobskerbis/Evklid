---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Napihni dva enaka balona, vsakega s $5\,\mathrm{L}$ plina pri sobni temperaturi. V prvega daš helij, v drugega žveplov heksafluorid, $\mathrm{SF_6}$. Plin v drugem je približno $36$-krat težji, zato ta balon pade na tla kot kamen. Pa vendar je v obeh **natanko enako število molekul**.

Zveni napačno? Ta dva plina poznajo tudi glasbeniki in tonski tehniki. Kdor vdihne malo helija, govori kot risani junak, s $\mathrm{SF_6}$ pa dobi globok, zamolkel glas. Glasilki nihata enako, spremeni pa se barva glasu: v heliju se zvok širi skoraj trikrat hitreje kot v zraku, zato se resonance v ustih in grlu premaknejo navzgor. (Ne poskušaj sam: plin namesto zraka v pljučih je nevaren.)

Paradoks z baloni razreši ena sama ideja, na kateri stoji vse kemijsko računanje: **kemija šteje delce, ne gramov in ne litrov.** Na maturi so računske naloge mešane. Masa, prostornina plina, koncentracija raztopine in enačba reakcije se znajdejo v isti nalogi. Kdor zna vsako količino pretvoriti v množino in nazaj, reši vse.

## Razlaga

**1. Prva skušnjava: masni delež je delež atomov.** Činele so iz brona, zlitine bakra in kositra. V tipičnem bronu za činele je $20\,\%$ mase kositra. Mamljivo je sklepati, da je potem vsak peti atom kositrov.

Preverimo. V $100\,\mathrm{g}$ brona je $80\,\mathrm{g}$ bakra in $20\,\mathrm{g}$ kositra. **Množina** $n$ pove, koliko delcev je v vzorcu (v molih), **molska masa** $M$ pa, koliko gramov tehta en mol:

$$n = \frac{m}{M}$$

$n(\mathrm{Cu}) = \dfrac{80\,\mathrm{g}}{63{,}55\,\mathrm{g/mol}} = 1{,}26\,\mathrm{mol}$, $n(\mathrm{Sn}) = \dfrac{20\,\mathrm{g}}{118{,}71\,\mathrm{g/mol}} = 0{,}168\,\mathrm{mol}$.

Kositrovih atomov je torej le približno $12\,\%$, en na vsakih osem do devet atomov. Atom kositra je skoraj dvakrat težji od bakrovega, zato $20\,\%$ mase pomeni manj kot $20\,\%$ delcev. Masni delež in delež delcev sta različni stvari.

:::premisli
Kaj če bi namesto kositra v zlitino dali $20\,\%$ mase aluminija ($M = 26{,}98\,\mathrm{g/mol}$)? Bi bil delež aluminijevih atomov večji ali manjši od $20\,\%$? Napovej, preden računaš.
---
Večji. Aluminijev atom je lažji od bakrovega, zato je v $20\,\mathrm{g}$ aluminija $0{,}741\,\mathrm{mol}$ atomov, kar je približno $37\,\%$ vseh atomov zlitine. Lažji ko je atom, več ga je v istih gramih.
:::

**2. Druga skušnjava: težji plin, več delcev.** Pri plinih velja nasprotno od intuicije. Molekule plina so daleč narazen, zato prostornino določa njihovo število, ne velikost ali masa. Zvezo opisuje **splošna plinska enačba**:

$$p \cdot V = n \cdot R \cdot T$$

Tu je $p$ tlak, $V$ prostornina, $T$ temperatura v kelvinih in $R = 8{,}314\,\mathrm{J/(mol\,K)}$ **splošna plinska konstanta**. Ker je $1\,\mathrm{J} = 1\,\mathrm{kPa \cdot L}$, lahko tlak pišeš v kPa in prostornino v litrih. Pri enakih $p$, $V$ in $T$ je $n$ enak za vsak plin. Zato imata balona iz uvoda enako molekul, masa pa se razlikuje toliko kot molski masi: $146{,}06$ proti $4{,}003\,\mathrm{g/mol}$.

:::premisli
Balona sta enaka po številu molekul. V katerem je več **atomov** in kolikokrat več?
---
V balonu s $\mathrm{SF_6}$, sedemkrat več. Helij je enoatomen, vsaka molekula $\mathrm{SF_6}$ pa ima en atom žvepla in šest atomov fluora.
:::

**3. Most čez množino.** Vsaka količina v nalogi se pretvori v množino in vsak rezultat se iz nje izračuna:

| Kaj imaš | Pretvorba v $n$ | Enote |
|---|---|---|
| maso snovi | $n = \dfrac{m}{M}$ | g, g/mol |
| plin | $n = \dfrac{pV}{RT}$ | kPa, L, K |
| raztopino | $n = c \cdot V$ | mol/L, L |
| število delcev | $n = \dfrac{N}{N_\mathrm{A}}$ | $N_\mathrm{A} = 6{,}022 \cdot 10^{23}\,\mathrm{mol^{-1}}$ |

Tu je $c$ **množinska koncentracija**: množina topljenca v litru raztopine.

**4. Tretja skušnjava: koeficienti so grami.** Pri reakciji $\mathrm{Zn} + 2\,\mathrm{HCl} \rightarrow \mathrm{ZnCl_2} + \mathrm{H_2}$ za $3{,}27\,\mathrm{g}$ cinka **ne** potrebuješ dvakrat več gramov kisline, $6{,}54\,\mathrm{g}$. Koeficienti povedo razmerje množin. Cinka je $\dfrac{3{,}27}{65{,}38} = 0{,}0500\,\mathrm{mol}$, ta porabi $0{,}100\,\mathrm{mol}$ $\mathrm{HCl}$ ($M = 36{,}46\,\mathrm{g/mol}$), kar je $3{,}65\,\mathrm{g}$. Med snovmi v enačbi se vedno premikaš z moli.

**5. Kdo se porabi prvi.** Če sta dana oba reaktanta, se eden porabi prej, drugi pa ostane. Prvemu rečemo **omejitveni reaktant**, drugemu **reaktant v prebitku**. Produkt računaš samo iz omejitvenega. Kateri je to, ne pove manjša masa in ne manjše število molov, ampak primerjava z razmerjem koeficientov.

V simulaciji spodaj (Zbirka simulacij: kemijsko računanje) odpri »Stehiometrija« in dodajaj samo en reaktant. Opazuj, da produkta po neki točki ne nastaja več: takrat je drugi reaktant postal omejitveni.

## Rešeni primeri

### Primer 1 (lažji): raztopina za čiščenje trobente

Medeninasta trobenta potemni. Glasbenik jo očisti z raztopino citronske kisline. Pripraviti želi $500\,\mathrm{mL}$ raztopine s koncentracijo $0{,}200\,\mathrm{mol/L}$. Koliko gramov citronske kisline, $\mathrm{C_6H_8O_7}$, mora natehtati?

**Podatki:** $V = 500\,\mathrm{mL}$, $c = 0{,}200\,\mathrm{mol/L}$, $M(\mathrm{C_6H_8O_7}) = 192{,}12\,\mathrm{g/mol}$
**Iščemo:** maso $m$ citronske kisline

:::formula
$n = c \cdot V$, nato $m = n \cdot M$
:::

**Rešitev:**

1. Prostornino pretvorimo v litre, ker je koncentracija v mol/L: $500\,\mathrm{mL} = 0{,}500\,\mathrm{L}$.
2. Množina kisline: $n = 0{,}200 \cdot 0{,}500 = 0{,}100\,\mathrm{mol}$.
3. Masa: $m = 0{,}100 \cdot 192{,}12 = 19{,}2\,\mathrm{g}$.
4. Odgovor: natehtati mora $19{,}2\,\mathrm{g}$ citronske kisline in jo raztopiti v vodi do $500\,\mathrm{mL}$.

### Primer 2: dva balona za koncert

Za nastop pripravijo balon s $5{,}00\,\mathrm{L}$ helija in enak balon s $\mathrm{SF_6}$, oba pri $20\,\mathrm{°C}$ in $101{,}3\,\mathrm{kPa}$. Kolikšna je masa plina v vsakem balonu?

**Podatki:** $V = 5{,}00\,\mathrm{L}$, $t = 20\,\mathrm{°C}$, $p = 101{,}3\,\mathrm{kPa}$, $M(\mathrm{He}) = 4{,}003\,\mathrm{g/mol}$, $M(\mathrm{SF_6}) = 146{,}1\,\mathrm{g/mol}$, $R = 8{,}314\,\mathrm{kPa\,L/(mol\,K)}$
**Iščemo:** maso helija in maso $\mathrm{SF_6}$

:::formula
$n = \dfrac{p \cdot V}{R \cdot T}$, nato $m = n \cdot M$
:::

**Rešitev:**

1. Temperaturo pretvorimo v kelvine, ker plinska enačba zahteva absolutno temperaturo: $T = 20 + 273 = 293\,\mathrm{K}$.
2. Množina je za oba plina ista, saj so $p$, $V$ in $T$ enaki:

$$n = \frac{101{,}3 \cdot 5{,}00}{8{,}314 \cdot 293} = 0{,}208\,\mathrm{mol}$$

3. Masa helija: $m = 0{,}208 \cdot 4{,}003 = 0{,}833\,\mathrm{g}$.
4. Masa $\mathrm{SF_6}$: $m = 0{,}208 \cdot 146{,}1 = 30{,}4\,\mathrm{g}$.
5. Odgovor: v balonu je $0{,}833\,\mathrm{g}$ helija oziroma $30{,}4\,\mathrm{g}$ $\mathrm{SF_6}$. Molekul je v obeh enako, mase pa sta v razmerju molskih mas, približno $36 : 1$.

### Primer 3 (težji): kdo se porabi prvi

Kos cinka z maso $3{,}27\,\mathrm{g}$ damo v $40\,\mathrm{mL}$ klorovodikove kisline s koncentracijo $2{,}0\,\mathrm{mol/L}$. Koliko litrov vodika nastane pri $25\,\mathrm{°C}$ in $101{,}3\,\mathrm{kPa}$? Reakcija: $\mathrm{Zn} + 2\,\mathrm{HCl} \rightarrow \mathrm{ZnCl_2} + \mathrm{H_2}$.

**Podatki:** $m(\mathrm{Zn}) = 3{,}27\,\mathrm{g}$, $M(\mathrm{Zn}) = 65{,}38\,\mathrm{g/mol}$, $V(\mathrm{HCl}) = 40\,\mathrm{mL}$, $c(\mathrm{HCl}) = 2{,}0\,\mathrm{mol/L}$, $t = 25\,\mathrm{°C}$, $p = 101{,}3\,\mathrm{kPa}$, $R = 8{,}314\,\mathrm{kPa\,L/(mol\,K)}$
**Iščemo:** prostornino vodika $V(\mathrm{H_2})$

:::formula
$n(\mathrm{Zn}) = \dfrac{m}{M}$, $n(\mathrm{HCl}) = c \cdot V$; razmerje $n(\mathrm{Zn}) : n(\mathrm{HCl}) = 1 : 2$; $V(\mathrm{H_2}) = \dfrac{n \cdot R \cdot T}{p}$
:::

**Rešitev:**

1. Množina cinka: $n(\mathrm{Zn}) = \dfrac{3{,}27}{65{,}38} = 0{,}0500\,\mathrm{mol}$.
2. Množina kisline: $n(\mathrm{HCl}) = 2{,}0 \cdot 0{,}040 = 0{,}080\,\mathrm{mol}$.
3. Za ves cink bi potrebovali dvakrat več kisline: $2 \cdot 0{,}0500 = 0{,}100\,\mathrm{mol}$. Imamo le $0{,}080\,\mathrm{mol}$, zato se kislina porabi prva in je omejitveni reaktant, čeprav je molov kisline več kot molov cinka.
4. Iz omejitvenega reaktanta: na $2$ mola $\mathrm{HCl}$ nastane $1$ mol vodika, torej $n(\mathrm{H_2}) = \dfrac{0{,}080}{2} = 0{,}040\,\mathrm{mol}$.
5. Prostornina pri $T = 298\,\mathrm{K}$:

$$V = \frac{0{,}040 \cdot 8{,}314 \cdot 298}{101{,}3} = 0{,}978\,\mathrm{L}$$

6. Odgovor: nastane približno $0{,}98\,\mathrm{L}$ vodika; del cinka ostane neraztopljen.

### Primer 4: zdaj ti

Violinisti mažejo lok s kolofonijo, ki je večinoma abietinska kislina, $\mathrm{C_{20}H_{30}O_2}$. Koliko gramov $\mathrm{CO_2}$ nastane, ko popolnoma zgori $0{,}605\,\mathrm{g}$ te kisline?

**Podatki:** $m = 0{,}605\,\mathrm{g}$, $M(\mathrm{C_{20}H_{30}O_2}) = 302{,}4\,\mathrm{g/mol}$, $M(\mathrm{CO_2}) = 44{,}01\,\mathrm{g/mol}$
**Iščemo:** maso $\mathrm{CO_2}$

:::formula
$n = \dfrac{m}{M}$; vsak atom C da eno molekulo $\mathrm{CO_2}$; $m = n \cdot M$
:::

**Rešitev:**

1. Množina kisline: $n = \dfrac{0{,}605}{302{,}4} = 0{,}00200\,\mathrm{mol}$.
2. Molekula ima $20$ atomov ogljika, zato je $n(\mathrm{CO_2}) = 20 \cdot n$.
3. Izračunaj $n(\mathrm{CO_2})$ in maso sam. Preden računaš, napovej: bo masa $\mathrm{CO_2}$ večja ali manjša od mase zgorele kisline?

:::premisli
Koliko gramov $\mathrm{CO_2}$ nastane in zakaj ga je po masi več, kot je zgorelo kisline?
---
$n(\mathrm{CO_2}) = 20 \cdot 0{,}00200\,\mathrm{mol} = 0{,}0400\,\mathrm{mol}$, $m = 0{,}0400\,\mathrm{mol} \cdot 44{,}01\,\mathrm{g/mol} = 1{,}76\,\mathrm{g}$. Nastane skoraj trikrat več mase, kot je zgorelo kisline, ker se ogljik veže s kisikom iz zraka.
:::

## Pogoste napake

- **Koeficienti kot grami.** »Dva HCl na en Zn, torej dvakrat več gramov kisline.« Koeficienti štejejo delce, delci pa imajo različne mase. Pravilno: maso pretvori v mole, uporabi razmerje koeficientov, rezultat pretvori nazaj v grame.
- **Masni delež je delež atomov.** »Bron z $20\,\%$ kositra ima vsak peti atom kositrov.« Težji atomi so pri isti masi redkejši. Za delež delcev najprej izračunaj množine.
- **Celzije v plinski enačbi.** Kdor vstavi $20$ namesto $293\,\mathrm{K}$, dobi skoraj $15$-krat preveliko množino. Temperatura je v enačbi absolutna: $T = t + 273$.
- **Omejitveni je tisti z manj moli.** V Primeru 3 je molov kisline več kot molov cinka, pa se vseeno porabi prva. Primerjaj množine, deljene s koeficienti, ne golih množin ali mas.
- **Mililitri v $c = \dfrac{n}{V}$.** Prostornina mora biti v litrih, sicer je koncentracija $1000$-krat premajhna.

## Povzetek

- Kemijsko računanje vedno teče čez množino: $n = \dfrac{m}{M}$, $n = c \cdot V$, $n = \dfrac{pV}{RT}$, $n = \dfrac{N}{N_\mathrm{A}}$.
- Koeficienti v enačbi dajo razmerje množin, nikoli mas ali prostornin raztopin.
- Pri enakih $p$, $V$ in $T$ vsebujejo vsi plini enako molekul, ne glede na maso.
- Masni delež ni delež delcev; za delež atomov izračunaj množine.
- Produkt računaj iz omejitvenega reaktanta: tistega, ki ga zmanjka prvega glede na koeficiente.
- Enote: $T$ v kelvinih, $V$ v litrih (pri kPa in mol/L), masa v gramih.

## Drugače: Kot zgodba

Bend gre na turnejo po treh državah. V vsaki imajo svojo valuto: v prvi plačujejo z grami, v drugi z litri plina, v tretji z mililitri raztopine. Neposredne menjave med njimi ni. Edina menjalnica, ki sprejme vse, je osrednja banka z valuto **mol**.

Bobnar ima v žepu $3{,}27\,\mathrm{g}$ cinka. V banki dobi $0{,}0500\,\mathrm{mol}$. Recept reakcije je kot menjalni tečaj med izvajalci: en cink zahteva dve kislini in vrne en vodik. Na koncu bobnar zamenja mole nazaj v litre vodika, ker druga država plačuje v litrih plina.

Kdor poskuša grame zamenjati neposredno v litre, ga na meji zavrnejo. Pot vedno vodi skozi banko.

## Drugače: Korak za korakom s številkami

Nov primer: $1{,}2\,\mathrm{g}$ magnezija ($M = 24{,}31\,\mathrm{g/mol}$) v $50\,\mathrm{mL}$ kisline $\mathrm{HCl}$ s $c = 1{,}0\,\mathrm{mol/L}$; reakcija $\mathrm{Mg} + 2\,\mathrm{HCl} \rightarrow \mathrm{MgCl_2} + \mathrm{H_2}$, pogoji $25\,\mathrm{°C}$ in $101{,}3\,\mathrm{kPa}$.

1. **Vse v mole.** $n(\mathrm{Mg}) = \dfrac{1{,}2}{24{,}31} = 0{,}0494\,\mathrm{mol}$; $n(\mathrm{HCl}) = 1{,}0 \cdot 0{,}050 = 0{,}050\,\mathrm{mol}$.
2. **Deli s koeficienti.** Za magnezij $\dfrac{0{,}0494}{1} = 0{,}0494$, za kislino $\dfrac{0{,}050}{2} = 0{,}025$. Manjši količnik ima kislina, zato je omejitveni reaktant.
3. **Prenesi na produkt.** $n(\mathrm{H_2}) = 0{,}025\,\mathrm{mol}$.
4. **Iz molov v iskano enoto.** $V = \dfrac{0{,}025 \cdot 8{,}314 \cdot 298}{101{,}3} = 0{,}61\,\mathrm{L}$.
5. **Preveri smisel.** En mol plina pri sobnih pogojih zavzame približno $24\,\mathrm{L}$ (to da $pV = nRT$ za $n = 1\,\mathrm{mol}$); četrtina desetinke mola je dobrih $0{,}6\,\mathrm{L}$. Ustreza.

## Preveri se

? V nalogi s cinkom in klorovodikovo kislino je kislina **omejitveni reaktant**. Kaj to pomeni?
- Kisline je po masi manj kot cinka.
~ Masa ne odloča: odloča množina glede na koeficiente v enačbi.
- Kisline je manj molov kot cinka.
~ V Primeru 3 je molov kisline več kot molov cinka, a jo zmanjka prej, ker je na en cink potrebna dvakratna množina kisline.
+ Kislina se porabi prva, zato iz njene množine izračunamo množino produkta.
- Kislina je reaktant, ki po reakciji ostane.
~ Reaktant, ki ostane, je v prebitku. Omejitveni se porabi do konca.
> Omejitveni reaktant zmanjka prvega glede na razmerje koeficientov; produkt nastaja le, dokler ga je kaj.

? Imaš po $10\,\mathrm{g}$ helija, kisika $\mathrm{O_2}$ in $\mathrm{SF_6}$. Razvrsti vzorce po številu molekul od največ do najmanj.
- $\mathrm{SF_6}$, $\mathrm{O_2}$, $\mathrm{He}$
~ Težja molekula ne pomeni več molekul. Pri isti masi je težkih molekul manj.
- Vsi imajo enako molekul.
~ Enako molekul imajo plini pri enaki prostornini, tlaku in temperaturi, ne pri enaki masi.
+ $\mathrm{He}$, $\mathrm{O_2}$, $\mathrm{SF_6}$
> $n = \dfrac{m}{M}$: pri isti masi ima največ molov snov z najmanjšo molsko maso: $2{,}50\,\mathrm{mol}$ helija, $0{,}313\,\mathrm{mol}$ kisika, $0{,}0685\,\mathrm{mol}$ $\mathrm{SF_6}$.

? Zaprt balon s helijem prinesemo iz dvorane ($20\,\mathrm{°C}$) na mraz ($-10\,\mathrm{°C}$), tlak ostane enak. Kaj se zgodi?
- Množina helija se zmanjša, ker se plin na mrazu skrči.
~ Balon je zaprt, zato delci ne morejo nikamor. Spremeni se prostornina, ne množina.
- Prostornina se zmanjša na polovico ali manj, ker temperatura pade z $20$ na $-10$ stopinj.
~ To je računanje s Celzijevimi stopinjami. V kelvinih pade temperatura le z $293$ na $263\,\mathrm{K}$, za približno desetino.
+ Množina ostane enaka, prostornina se zmanjša za približno $10\,\%$.
- Nič se ne spremeni, saj je v balonu še vedno isti plin.
~ Po plinski enačbi je pri stalnem $n$ in $p$ prostornina sorazmerna s temperaturo v kelvinih.
> Pri stalnih $n$ in $p$ velja $V \propto T$: $\dfrac{263}{293} = 0{,}898$, torej se balon s $5{,}0\,\mathrm{L}$ skrči na približno $4{,}5\,\mathrm{L}$.

? V $250\,\mathrm{mL}$ raztopine je raztopljenih $4{,}0\,\mathrm{g}$ $\mathrm{NaOH}$ ($M = 40{,}00\,\mathrm{g/mol}$). Kolikšna je množinska koncentracija?
- $16\,\mathrm{mol/L}$
~ To je $\dfrac{4{,}0\,\mathrm{g}}{0{,}25\,\mathrm{L}}$, masa namesto množine. Najprej izračunaj $n = \dfrac{m}{M}$.
- $0{,}0004\,\mathrm{mol/L}$
~ Prostornina je ostala v mililitrih. Vstavi $0{,}250\,\mathrm{L}$.
+ $0{,}40\,\mathrm{mol/L}$
- $0{,}10\,\mathrm{mol/L}$
~ To je množina $n$ v molih, ne koncentracija. Deliti jo moraš še s prostornino.
> $n = \dfrac{4{,}0}{40{,}00} = 0{,}10\,\mathrm{mol}$, $c = \dfrac{0{,}10\,\mathrm{mol}}{0{,}250\,\mathrm{L}} = 0{,}40\,\mathrm{mol/L}$.

? Zmešamo $4{,}0\,\mathrm{g}$ vodika in $16\,\mathrm{g}$ kisika, ki zreagirata po enačbi $2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$. Koliko gramov vode nastane?
- $20\,\mathrm{g}$
~ Masa se ohrani le za snovi, ki zreagirajo. Vodik je v prebitku in del ga ostane.
- $36\,\mathrm{g}$
~ To dobiš, če računaš iz vodika. Za $1{,}98\,\mathrm{mol}$ vodika bi potrebovali $0{,}99\,\mathrm{mol}$ kisika, imamo ga le $0{,}50\,\mathrm{mol}$.
+ $18\,\mathrm{g}$
- $9{,}0\,\mathrm{g}$
~ To dobiš, če vzameš $n(\mathrm{H_2O}) = n(\mathrm{O_2})$. Po enačbi da en mol kisika dva mola vode.
> $n(\mathrm{O_2}) = \dfrac{16}{32{,}00} = 0{,}50\,\mathrm{mol}$ je omejitveni reaktant; $n(\mathrm{H_2O}) = 2 \cdot 0{,}50 = 1{,}0\,\mathrm{mol}$, $m = 1{,}0 \cdot 18{,}02 = 18\,\mathrm{g}$.

:::simboli
n | množina snovi | n = \dfrac{m}{M} | mol | število delcev, izraženo v molih
m | masa | m = n \cdot M | g
M | molska masa | M = \dfrac{m}{n} | g/mol
V | prostornina (plina ali raztopine) | | L | pri $c$ in plinih v litrih
c | množinska koncentracija | c = \dfrac{n}{V} | mol/L
p | tlak | | kPa
R | splošna plinska konstanta | | J/(mol\,K) | $8{,}314$; enako kPa·L/(mol·K)
T | temperatura (absolutna) | T = t + 273 | K
t | temperatura v Celzijevih stopinjah | | °C
N | število delcev | N = n \cdot N_\mathrm{A} | –
N_\mathrm{A} | Avogadrova konstanta | | mol^{-1} | $6{,}022 \cdot 10^{23}$
:::
