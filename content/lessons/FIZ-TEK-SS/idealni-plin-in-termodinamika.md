---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika je kapetanka mladinske nogometne ekipe. Večer pred zimsko tekmo napolni žogo v ogreti garaži pri $20\,°\mathrm{C}$, manometer pokaže $0{,}90\,\mathrm{bar}$. Tekma bo zjutraj pri $-5\,°\mathrm{C}$, sodnik pa bo zavrnil žogo, ki ima manj kot $0{,}60\,\mathrm{bar}$. Bo žoga zdržala?

Nikin brat ima odgovor takoj: »Tlak je sorazmeren s temperaturo. Temperatura gre z $20$ na $-5$, torej je novi tlak $0{,}90 \cdot \frac{-5}{20}$ bar.« Dobi negativen tlak, kar je nesmisel: žoga bi se morala sesesti v nekaj manj kot nič.

Ideja »tlak je sorazmeren s temperaturo« ni napačna, napačna sta številki, ki ju je vstavil. Ta lekcija začne pri takih skušnjavah in jih popravi. Na koncu boš znal izračunati stanje plina, delo, ki ga plin opravi, in kam gre toplota, ki jo plin prejme. To je jedro vseh tekmovalnih nalog s plini, od žog in jeklenk do toplotnih strojev.

## Razlaga

**1. Prva skušnjava: stopinje Celzija.** Stopinje Celzija imajo ničlo pri zmrzišču vode, kar je za plin naključna točka. Plin »čuti« **absolutno temperaturo** $T$, ki se meri od absolutne ničle navzgor, v kelvinih:

$$T = t + 273\,\mathrm{K}$$

Tu je $t$ temperatura v stopinjah Celzija. Pri $20\,°\mathrm{C}$ je $T = 293\,\mathrm{K}$, pri $-5\,°\mathrm{C}$ je $T = 268\,\mathrm{K}$. Razmerje $\frac{268}{293}$ je malo pod $1$, ne negativno.

**2. Druga skušnjava: kaj kaže manometer.** Manometer za žoge in gume kaže **nadtlak** $p_\mathrm{nad}$: za koliko je tlak v žogi večji od zunanjega. Plin pa pritiska z **absolutnim tlakom**

$$p = p_\mathrm{nad} + p_0$$

kjer je $p_0 \approx 1{,}0\,\mathrm{bar}$ zračni tlak. Prazna žoga ima nadtlak $0$, v njej pa je še vedno zrak s tlakom $1\,\mathrm{bar}$. V plinske zakone vedno vstavljaš absolutni tlak.

:::premisli
Žogo segreješ z $10\,°\mathrm{C}$ na $20\,°\mathrm{C}$, prostornina ostane enaka. Se absolutni tlak v njej podvoji? Napovej, nato izračunaj.
---
Ne. Absolutna temperatura zraste z $283\,\mathrm{K}$ na $293\,\mathrm{K}$, kar je le za $3{,}5\,\%$. Za toliko zraste tudi absolutni tlak.
:::

**3. Plinska enačba.** Idealni plin je plin, v katerem so molekule majhne in se med seboj ne privlačijo; zrak pri navadnih pogojih se tako obnaša zelo dobro. Zanj velja **plinska enačba**

$$pV = nRT$$

$V$ je prostornina, $n$ **množina snovi** v molih, $R = 8{,}314\,\mathrm{J/(mol\,K)}$ pa splošna plinska konstanta. Za isto količino zaprtega plina je $nR$ stalno, zato

$$\frac{p_1 V_1}{T_1} = \frac{p_2 V_2}{T_2}$$

Kadar se ena od treh količin ne spreminja, dobiš posebne primere:

| sprememba | stalno | zveza |
|---|---|---|
| izotermna | $T$ | $pV$ stalen |
| izobarna | $p$ | $V/T$ stalen |
| izohorna | $V$ | $p/T$ stalen |

**4. Tretja skušnjava: »delo plina je $pV$«.** Plin v valju potiska bat s ploščino $S$ s silo $F = pS$. Če se bat pri stalnem tlaku premakne za $\Delta s$, plin opravi delo $F\,\Delta s = pS\,\Delta s$. Ker je $S\,\Delta s = \Delta V$, je **delo plina** pri stalnem tlaku

$$A_\mathrm{pl} = p\,\Delta V$$

Pomembna je *sprememba* prostornine, ne prostornina sama. Plin, ki se ne razširi, ne opravi dela, ne glede na to, kako velik tlak ima. Kadar se tlak spreminja, je delo plina enako **ploščini pod krivuljo v $p$–$V$ diagramu**.

:::risba graf
opis: Diagram p–V. Vodoravna os je prostornina od 0 do 4 litre, navpična tlak od 0 do 300 kilopaskalov. Modra vodoravna črta pri 100 kPa od 1 do 3 L je izobarna sprememba; ploščina pod njo je pravokotnik 100 kPa krat 2 L, to je 200 J. Oranžna črtkana krivulja od 1 L in 100 kPa do 3 L in 33 kPa je izoterma; pod njo je manj ploščine.
x: 0 .. 4 | 1 | V [L]
y: 0 .. 300 | 100 | p [kPa]
pravokotnik: 1; 0 .. 3; 100 | modra ozadje
črta: 1; 100 -> 3; 100 | modra debelo
f: 100/x | oranžna črtkano | 1 .. 3
točka: 1; 100 | 1 | levo
točka: 3; 100 | 2 | nad
napis: 2; 50 | delo plina 200 J | sredina
podnapis: Delo plina je ploščina pod krivuljo: izobara (polna) da več dela kot izoterma (črtkana)
:::

Pri izotermni spremembi je delo $A_\mathrm{pl} = nRT\ln\frac{V_2}{V_1}$, pri izohorni nič. Ko plin stiskamo, je $\Delta V < 0$ in delo plina negativno: tedaj okolica opravi delo na plinu.

V simulaciji spodaj, »Procesi v p–V diagramu«, izberi izobarno spremembo in potisni potek do $100\,\%$, nato enako naredi pri izotermni. Opazuj senčeno ploščino: plin pride do iste končne prostornine, a pri izobarni opravi približno $200\,\mathrm{J}$, pri izotermni le okoli $110\,\mathrm{J}$.

**5. Četrta skušnjava: »toplota segreje plin, pa to je to«.** Molekule plina se gibljejo. Vsota njihovih kinetičnih energij je **notranja energija** $W_n$. Pri idealnem plinu je odvisna samo od temperature; za **enoatomni** plin (helij, argon) velja

$$W_n = \frac{3}{2}nRT$$

za dvoatomni plin (zrak) pa je faktor $\frac{5}{2}$ namesto $\frac{3}{2}$.

Toplota $Q$, ki jo plin prejme, ne gre nujno vsa v segrevanje. Del lahko gre za delo, ko plin potiska bat. To pove **prvi zakon termodinamike**, ki je zakon o ohranitvi energije:

$$Q = \Delta W_n + A_\mathrm{pl}$$

V nekaterih učbenikih piše $\Delta W_n = Q + A$, kjer je $A = -A_\mathrm{pl}$ delo, ki ga na plinu opravi okolica. Vsebina je ista, pazi le na predznak.

:::premisli
Plin se izotermno razteza. Temperatura se ne spremeni. Ali plin pri tem prejme kaj toplote?
---
Da. Ker je $T$ stalna, je $\Delta W_n = 0$, zato $Q = A_\mathrm{pl} > 0$. Vsa prejeta toplota gre za delo; »temperatura se ne spremeni« ne pomeni »ni toplote«.
:::

Še en poseben primer: pri hitrem stiskanju toplota ne uspe uiti, $Q = 0$. Tedaj je $\Delta W_n = -A_\mathrm{pl}$. Pri stiskanju je $A_\mathrm{pl} < 0$, zato $\Delta W_n > 0$ in plin se segreje. Zato se tlačilka za kolo pri napihovanju ogreje.

## Rešeni primeri

### Primer 1 (lažji): Nikina žoga

Žoga ima pri $20\,°\mathrm{C}$ nadtlak $0{,}90\,\mathrm{bar}$. Kolikšen nadtlak ima pri $-5\,°\mathrm{C}$? Prostornina žoge se ne spremeni, zračni tlak je $1{,}00\,\mathrm{bar}$. Sodnik zahteva vsaj $0{,}60\,\mathrm{bar}$ nadtlaka.

**Podatki:** $p_\mathrm{nad,1} = 0{,}90\,\mathrm{bar}$, $t_1 = 20\,°\mathrm{C}$, $t_2 = -5\,°\mathrm{C}$, $p_0 = 1{,}00\,\mathrm{bar}$, $V$ stalna, najmanjši dovoljeni nadtlak $0{,}60\,\mathrm{bar}$
**Iščemo:** nadtlak $p_\mathrm{nad,2}$

:::formula
$\dfrac{p_1}{T_1} = \dfrac{p_2}{T_2}$ (izohorna sprememba), $p = p_\mathrm{nad} + p_0$
:::

**Rešitev:**

1. Absolutni tlak: $p_1 = 0{,}90\,\mathrm{bar} + 1{,}00\,\mathrm{bar} = 1{,}90\,\mathrm{bar}$.
2. Absolutni temperaturi: $T_1 = 293\,\mathrm{K}$, $T_2 = 268\,\mathrm{K}$.
3. $p_2 = p_1 \dfrac{T_2}{T_1} = 1{,}90 \cdot \dfrac{268}{293}\,\mathrm{bar} = 1{,}74\,\mathrm{bar}$.
4. Nazaj v nadtlak: $p_\mathrm{nad,2} = 1{,}74\,\mathrm{bar} - 1{,}00\,\mathrm{bar} = 0{,}74\,\mathrm{bar}$.
5. Odgovor: žoga ima pri $-5\,°\mathrm{C}$ nadtlak $0{,}74\,\mathrm{bar}$, kar je več od $0{,}60\,\mathrm{bar}$. Sodnik jo bo sprejel.

### Primer 2: kam gre toplota

V valju z lahkim gibljivim batom je $0{,}10\,\mathrm{mol}$ helija pri tlaku $100\,\mathrm{kPa}$. Helij segrejemo s $300\,\mathrm{K}$ na $400\,\mathrm{K}$, tlak ostane stalen. Koliko dela opravi plin, za koliko se mu poveča notranja energija in koliko toplote prejme?

**Podatki:** $n = 0{,}10\,\mathrm{mol}$, $p = 100\,\mathrm{kPa}$, $T_1 = 300\,\mathrm{K}$, $T_2 = 400\,\mathrm{K}$, helij je enoatomni, $R = 8{,}314\,\mathrm{J/(mol\,K)}$
**Iščemo:** $A_\mathrm{pl}$, $\Delta W_n$, $Q$

:::formula
$A_\mathrm{pl} = p\,\Delta V = nR\,\Delta T$ (izobarno), $\Delta W_n = \dfrac{3}{2}nR\,\Delta T$, $Q = \Delta W_n + A_\mathrm{pl}$
:::

**Rešitev:**

1. Iz plinske enačbe pri stalnem tlaku je $p\,\Delta V = nR\,\Delta T$, zato prostornine sploh ne potrebujemo: $A_\mathrm{pl} = 0{,}10 \cdot 8{,}314 \cdot 100\,\mathrm{J} = 83{,}14\,\mathrm{J}$.
2. Za občutek: $\Delta V = \dfrac{83{,}1\,\mathrm{J}}{100\,000\,\mathrm{Pa}} = 8{,}3 \cdot 10^{-4}\,\mathrm{m^3}$, to je $0{,}83\,\mathrm{L}$.
3. Notranja energija enoatomnega plina: $\Delta W_n = \dfrac{3}{2}nR\,\Delta T = \dfrac{3}{2} \cdot 83{,}14\,\mathrm{J} = 124{,}7\,\mathrm{J}$.
4. Prvi zakon: $Q = 124{,}7\,\mathrm{J} + 83{,}1\,\mathrm{J} = 207{,}8\,\mathrm{J}$.
5. Odgovor: plin opravi $83\,\mathrm{J}$ dela, notranja energija se poveča za $125\,\mathrm{J}$, prejeti mora $208\,\mathrm{J}$ toplote. Le $60\,\%$ toplote gre v segrevanje.

### Primer 3 (težji): koliko časa pod vodo

Potapljačeva jeklenka ima prostornino $12\,\mathrm{L}$ in je napolnjena na $200\,\mathrm{bar}$. Na globini $20\,\mathrm{m}$ je tlak okolice $3{,}0\,\mathrm{bar}$; regulator mu da zrak s tem tlakom. Potapljač vsako minuto vdihne $25\,\mathrm{L}$ zraka (pri tlaku okolice). Koliko minut lahko ostane na tej globini, če mora v jeklenki ostati $50\,\mathrm{bar}$ rezerve? Temperatura je stalna.

**Podatki:** $V_\mathrm{j} = 12\,\mathrm{L}$, $p_\mathrm{z} = 200\,\mathrm{bar}$, $p_\mathrm{r} = 50\,\mathrm{bar}$, $p_\mathrm{g} = 3{,}0\,\mathrm{bar}$, poraba $25\,\mathrm{L}$ na minuto, $T$ stalna
**Iščemo:** čas potopa $t_\mathrm{p}$

:::formula
izotermno: $p_1 V_1 = p_2 V_2$
:::

**Rešitev:**

1. Pri stalni temperaturi je količina zraka sorazmerna s produktom $pV$. Na začetku je v jeklenki $200 \cdot 12 = 2400\,\mathrm{bar\,L}$, ob rezervi $50 \cdot 12 = 600\,\mathrm{bar\,L}$. Porabi se sme razlika, $2400 - 600 = 1800\,\mathrm{bar\,L}$.
2. Pri tlaku na globini ima ta zrak prostornino $V = \dfrac{1800\,\mathrm{bar\,L}}{3{,}0\,\mathrm{bar}} = 600\,\mathrm{L}$.
3. Čas: $t_\mathrm{p} = \dfrac{600}{25}\,\mathrm{min} = 24\,\mathrm{min}$.
4. Odgovor: potapljač lahko na $20\,\mathrm{m}$ ostane $24$ minut. Na površini (pri $1\,\mathrm{bar}$) bi z istim zrakom dihal trikrat dlje.

Strategija: pri izotermnih nalogah računaj kar z $pV$ v $\mathrm{bar\,L}$. Pretvarjati v pascale in kubične metre ni treba, ker se enote pokrajšajo.

### Primer 4: zdaj ti – en krog toplotnega stroja

Plin v stroju opravi krožno spremembo, ki je v $p$–$V$ diagramu pravokotnik: izobarno se razširi z $1{,}0\,\mathrm{L}$ na $3{,}0\,\mathrm{L}$ pri $300\,\mathrm{kPa}$, izohorno se ohladi do $100\,\mathrm{kPa}$, izobarno se stisne nazaj na $1{,}0\,\mathrm{L}$ in izohorno segreje do začetnega stanja. Koliko dela opravi plin v enem krogu in koliko toplote neto prejme?

:::risba graf
opis: Krožna sprememba v diagramu p–V v obliki pravokotnika z oglišči 1 L in 300 kPa, 3 L in 300 kPa, 3 L in 100 kPa ter 1 L in 100 kPa. Puščice kažejo smer: desno zgoraj, navzdol desno, levo spodaj, navzgor levo.
x: 0 .. 4 | 1 | V [L]
y: 0 .. 400 | 100 | p [kPa]
pravokotnik: 1; 100 .. 3; 300 | modra ozadje
puščica: 1; 300 -> 3; 300 | | | modra
puščica: 3; 300 -> 3; 100 | | | modra
puščica: 3; 100 -> 1; 100 | | | modra
puščica: 1; 100 -> 1; 300 | | | modra
:::

**Podatki:** $p_\mathrm{zg} = 300\,\mathrm{kPa}$, $p_\mathrm{sp} = 100\,\mathrm{kPa}$, $V_1 = 1{,}0\,\mathrm{L}$, $V_2 = 3{,}0\,\mathrm{L}$
**Iščemo:** delo plina v krogu $A_\mathrm{pl}$ in toploto $Q$

:::formula
$A_\mathrm{pl} = p\,\Delta V$ za vsako izobaro; v celem krogu $\Delta W_n = 0$, zato $Q = A_\mathrm{pl}$
:::

**Rešitev:**

1. Zgornja izobara: $A_1 = 300\,\mathrm{kPa} \cdot 2{,}0\,\mathrm{L} = 600\,\mathrm{J}$ (kPa krat L je ravno J).
2. Izohori: $\Delta V = 0$, delo je $0$.
3. Spodnja izobara: $A_3 = 100\,\mathrm{kPa} \cdot (-2{,}0\,\mathrm{L}) = -200\,\mathrm{J}$, ker se plin stiska.
4. Izračunaj sam, nato preveri:

:::premisli
Koliko je delo v celem krogu in koliko toplote plin neto prejme?
---
$A_\mathrm{pl} = 600\,\mathrm{J} + 0 - 200\,\mathrm{J} = 400\,\mathrm{J}$, kar je ploščina pravokotnika $200\,\mathrm{kPa} \cdot 2{,}0\,\mathrm{L}$. Plin se vrne v začetno stanje, zato $\Delta W_n = 0$ in $Q = 400\,\mathrm{J}$.
:::

## Pogoste napake

- **Stopinje Celzija v plinski enačbi.** Kdor deli $\frac{-5}{20}$ ali $\frac{5}{25}$, dobi nesmiselne tlake. Vsako temperaturo najprej pretvori v kelvine.
- **Nadtlak namesto absolutnega tlaka.** Manometer kaže, za koliko je tlak večji od zunanjega. Prištej $p_0$, izračunaj, na koncu po potrebi spet odštej.
- **»Pri izotermni spremembi plin ne prejme toplote.«** Toplota in temperatura nista isto. Pri stalni $T$ je $\Delta W_n = 0$, toplota pa je enaka delu plina.
- **»Delo plina je $pV$« ali »pri izohorni spremembi plin opravi delo, ker tlak raste«.** Delo je povezano s *spremembo* prostornine: ploščina pod krivuljo. Brez $\Delta V$ ni dela.
- **Predznak dela.** Pri stiskanju je delo plina negativno. Kdor ga šteje pozitivno, v krožni spremembi sešteje ploščini namesto da ju odšteje.

## Povzetek

- Vedno absolutna temperatura $T = t + 273\,\mathrm{K}$ in absolutni tlak $p = p_\mathrm{nad} + p_0$.
- Plinska enačba $pV = nRT$, $R = 8{,}314\,\mathrm{J/(mol\,K)}$; za zaprt plin $\frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2}$.
- Delo plina je ploščina pod krivuljo v $p$–$V$ diagramu; izobarno $A_\mathrm{pl} = p\,\Delta V = nR\,\Delta T$, izohorno $0$, izotermno $nRT\ln\frac{V_2}{V_1}$.
- Notranja energija idealnega plina je odvisna le od $T$: enoatomni $\frac{3}{2}nRT$, dvoatomni $\frac{5}{2}nRT$.
- Prvi zakon: $Q = \Delta W_n + A_\mathrm{pl}$. Izotermno $Q = A_\mathrm{pl}$; izohorno $Q = \Delta W_n$; brez izmenjave toplote $\Delta W_n = -A_\mathrm{pl}$.
- V krožni spremembi je $\Delta W_n = 0$, delo je ploščina, ki jo krivulja obkroži.

## Drugače: Kot zgodba

Nika ima po tekmi še eno vprašanje: zakaj je bila tlačilka, s katero je zvečer napihnila žogo, vroča na spodnjem koncu?

Predstavljaj si molekule zraka v tlačilki kot teniške žogice v škatli. Nika z batom potiska steno škatle proti njim. Ko se stena žogici približuje, žogica odskoči hitreje, kot je priletela, tako kot žoga, ki jo udariš z loparjem. Hitrejše molekule pomenijo višjo temperaturo.

Nika potiska hitro, zato toplota ne uspe uiti skozi stene: $Q \approx 0$. Delo, ki ga Nika opravi na zraku, ostane v zraku kot notranja energija. Zrak se segreje, z njim pa tlačilka.

Zjutraj na mrazu je zgodba obrnjena. Molekule v žogi se upočasnijo, ker žoga oddaja toploto mrzlemu zraku. Udarci ob steno so šibkejši, zato tlak pade, a le toliko, za kolikor pade absolutna temperatura: z $293\,\mathrm{K}$ na $268\,\mathrm{K}$, okoli $9\,\%$.

## Drugače: Korak za korakom s številkami

Postopek pri vsaki nalogi s prvim zakonom, na primeru: $2{,}0\,\mathrm{mol}$ zraka (dvoatomni plin) izobarno segrejemo za $10\,\mathrm{K}$.

1. **Kateri proces?** Izobarni: $p$ stalen, plin se razteza.
2. **Delo plina:** $A_\mathrm{pl} = nR\,\Delta T = 2{,}0 \cdot 8{,}314 \cdot 10\,\mathrm{J} = 166{,}3\,\mathrm{J}$.
3. **Sprememba notranje energije** (dvoatomni, faktor $\frac{5}{2}$): $\Delta W_n = \frac{5}{2} \cdot 166{,}28\,\mathrm{J} = 415{,}7\,\mathrm{J}$.
4. **Toplota:** $Q = 415{,}7\,\mathrm{J} + 166{,}3\,\mathrm{J} = 582{,}0\,\mathrm{J}$.
5. **Preveri smiselnost:** $Q$ je večji od $\Delta W_n$, ker se plin razteza in del energije odda kot delo. Pri izohornem segrevanju za istih $10\,\mathrm{K}$ bi zadoščalo $415{,}7\,\mathrm{J}$.

| količina | vrednost |
|---|---|
| $A_\mathrm{pl}$ | $166{,}3\,\mathrm{J}$ |
| $\Delta W_n$ | $415{,}7\,\mathrm{J}$ |
| $Q$ | $582{,}0\,\mathrm{J}$ |

## Preveri se

? Tri od teh enot so enote za delo oziroma energijo. Katera ne sodi zraven?
- $\mathrm{Pa \cdot m^3}$
~ $\mathrm{Pa \cdot m^3} = \frac{\mathrm{N}}{\mathrm{m^2}} \cdot \mathrm{m^3} = \mathrm{N\,m} = \mathrm{J}$. To je enota za delo, saj je delo $p\,\Delta V$.
- $\mathrm{kPa \cdot L}$
~ $1\,\mathrm{kPa} \cdot 1\,\mathrm{L} = 10^3\,\mathrm{Pa} \cdot 10^{-3}\,\mathrm{m^3} = 1\,\mathrm{J}$. Prav zato je račun s kPa in L tako priročen.
+ $\mathrm{N/m^2}$
- $\mathrm{J}$
~ Joule je enota SI za delo in energijo.
> $\mathrm{N/m^2}$ je pascal, enota za tlak. Delo dobiš šele, ko tlak pomnožiš s spremembo prostornine.

? Kolesarsko tlačilko z zaprtim izhodom hitro stisneš, tako da toplota ne uspe uiti. Kaj se zgodi s temperaturo zraka v njej in zakaj?
- Ostane enaka, ker zrak ne prejme toplote.
~ Toplota in temperatura nista isto. Zrak ne prejme toplote, prejme pa delo.
+ Zraste, ker delo, ki ga opraviš na zraku, poveča njegovo notranjo energijo.
- Pade, ker se prostornina zmanjša.
~ Manjša prostornina sama ne pomeni nižje temperature. Pri stiskanju plin prejema energijo.
> $Q = 0$, zato $\Delta W_n = -A_\mathrm{pl}$. Pri stiskanju je $A_\mathrm{pl} < 0$, torej $\Delta W_n > 0$ in temperatura zraste.

? Teniška žoga ima pri $25\,°\mathrm{C}$ absolutni tlak $1{,}8\,\mathrm{bar}$. Jure računa tlak pri $5\,°\mathrm{C}$:
(1) Prostornina je stalna, zato je $p/T$ stalen.
(2) $p_2 = p_1 \cdot T_2 / T_1$.
(3) $p_2 = 1{,}8\,\mathrm{bar} \cdot 5/25 = 0{,}36\,\mathrm{bar}$.
(4) Žoga je pri $5\,°\mathrm{C}$ skoraj prazna.
V katerem koraku je napaka?
- v koraku (1)
~ Korak (1) je pravilen: pri stalni prostornini je tlak sorazmeren z absolutno temperaturo.
- v koraku (2)
~ Formula v koraku (2) je pravilna; težava je v tem, kaj vanjo vstaviš.
+ v koraku (3)
- v koraku (4)
~ Sklep (4) je le posledica napačnega računa pred njim. Sam po sebi logično sledi iz števila $0{,}36$.
> Temperaturi morata biti v kelvinih: $p_2 = 1{,}8 \cdot \frac{278}{298}\,\mathrm{bar} \approx 1{,}68\,\mathrm{bar}$. Žoga izgubi le okoli $7\,\%$ tlaka.

? Enoatomni plin se razširi po izobari na risbi. Z risbe odčitaj tlak in prostornini ter izračunaj, koliko toplote mora plin prejeti (v joulih).
:::risba graf
opis: Diagram p–V. Vodoravna os prostornina od 0 do 6 litrov, navpična tlak od 0 do 200 kilopaskalov. Vodoravna puščica pri 150 kPa gre od 2 L do 5 L. Ploščina pod njo je osenčena.
x: 0 .. 6 | 1 | V [L]
y: 0 .. 200 | 50 | p [kPa]
pravokotnik: 2; 0 .. 5; 150 | modra ozadje
puščica: 2; 150 -> 5; 150 | | | modra debelo
točka: 2; 150 | 1 | nad
točka: 5; 150 | 2 | nad
:::
= 1125 J | 10
~ 450 | To je le delo plina. Plin se pri tem tudi segreje, zato potrebuje še $\Delta W_n$.
~ 675 | To je le sprememba notranje energije. Pozabil si delo, ki ga plin opravi, ko potiska bat.
~ 750 | To je $p V_2$. Delo je povezano s spremembo prostornine, $p\,\Delta V$.
> $A_\mathrm{pl} = 150\,\mathrm{kPa} \cdot 3{,}0\,\mathrm{L} = 450\,\mathrm{J}$, $\Delta W_n = \frac{3}{2} p\,\Delta V = 675\,\mathrm{J}$, $Q = 675\,\mathrm{J} + 450\,\mathrm{J} = 1125\,\mathrm{J}$.

? Razvrsti korake reševanja naloge o žogi, ki se ohladi (iščemo nadtlak).
1. Izpiši podatke za začetno in končno stanje.
2. Temperature pretvori v kelvine, nadtlak v absolutni tlak.
3. S pretvorjenimi količinami zapiši $\frac{p_1}{T_1} = \frac{p_2}{T_2}$ in izrazi $p_2$.
4. Vstavi števila in izračunaj absolutni tlak $p_2$.
5. Od $p_2$ odštej zračni tlak, da dobiš nadtlak.
> Najprej podatki, nato pretvorbe v absolutne količine, šele potem enačba in račun. Nadtlak dobiš na koncu, ko odšteješ $p_0$.

<<RACUN
vrednost: 0.90*(-5)/20 | -0.225
vrednost: 293/283 | 1.035
vrednost: 0.90+1.00 | 1.90
vrednost: 1.90*268/293 | 1.74
vrednost: 1.74-1.00 | 0.74
vrednost: 0.10*8.314*100 | 83.14
vrednost: 83.1/100000 | 8.3*10^-4
vrednost: 1.5*83.14 | 124.7
vrednost: 124.7+83.1 | 207.8
vrednost: 200*12-50*12 | 1800
vrednost: 1800/3.0 | 600
vrednost: 600/25 | 24
vrednost: 300*2.0-100*2.0 | 400
vrednost: 2.0*8.314*10 | 166.3
vrednost: 2.5*166.28 | 415.7
vrednost: 415.7+166.3 | 582.0
vrednost: 150*3.0*2.5 | 1125
vrednost: 1.8*278/298 | 1.68
>>

:::simboli
T | absolutna temperatura | T = t + 273\,\mathrm{K} | K
t | temperatura v stopinjah Celzija | | °C
T_1, T_2 | absolutna temperatura v začetnem in končnem stanju | | K
p | absolutni tlak plina | p = p_\mathrm{nad} + p_0 | Pa
p_\mathrm{nad} | nadtlak (kaže manometer) | p_\mathrm{nad} = p - p_0 | Pa
p_0 | zunanji zračni tlak | | Pa
p_1, p_2 | absolutni tlak v začetnem in končnem stanju | | Pa
V | prostornina plina | | m^3
V_1, V_2 | prostornina v začetnem in končnem stanju | | m^3
\Delta V | sprememba prostornine | \Delta V = V_2 - V_1 | m^3
n | množina snovi | | mol
R | splošna plinska konstanta | | J/(mol\,K) | $8{,}314\,\mathrm{J/(mol\,K)}$
A_\mathrm{pl} | delo plina | A_\mathrm{pl} = p\,\Delta V | J | pri stalnem tlaku
A | delo okolice na plinu | A = -A_\mathrm{pl} | J
F | sila plina na bat | F = pS | N
S | ploščina bata | | m^2
\Delta s | premik bata | | m
W_n | notranja energija | W_n = \frac{3}{2}nRT | J | enoatomni plin
\Delta W_n | sprememba notranje energije | \Delta W_n = Q - A_\mathrm{pl} | J
Q | prejeta toplota | Q = \Delta W_n + A_\mathrm{pl} | J
\Delta T | sprememba temperature | \Delta T = T_2 - T_1 | K
:::
