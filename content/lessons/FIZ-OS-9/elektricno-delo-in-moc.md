---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Maja v trgovini izbira žarnico za namizno svetilko. Na polici sta dve, ki svetita približno enako močno. Halogenska ima oznako $42\,\mathrm{W}$ in stane $1{,}50\,\text{€}$. LED žarnica ima oznako $6\,\mathrm{W}$ in stane $4{,}50\,\text{€}$.

Prodajalec pravi, da se dražja hitro izplača. Maja pa noče plačati trikrat več samo na besedo. Svetilka bo svetila vsak večer približno $3\,\mathrm{h}$, ena kilovatna ura elektrike pa stane okoli $0{,}20\,\text{€}$.

Kaj sploh pomeni številka v vatih? In kako iz nje dobiš znesek na računu za elektriko? Odgovor dasta dve količini: **električna moč** in **električno delo**. Ko ju znaš uporabiti, pri vsakem nakupu sam preveriš, koliko te bo aparat stal še potem, ko ga odneseš domov.

## Razlaga

**1. En večer s halogenko.** Oznaka $42\,\mathrm{W}$ pove, da žarnica vsako sekundo pretvori $42\,\mathrm{J}$ električne energije v svetlobo in toploto. Ta količina je **električna moč** $P$. Enota je vat: $1\,\mathrm{W} = 1\,\mathrm{J/s}$. Tako kot pri mehanski moči pove, kako hitro se energija pretvarja.

En večer traja $3\,\mathrm{h}$, to je $3 \cdot 3600\,\mathrm{s} = 10\,800\,\mathrm{s}$. Energijo, ki jo električni tok v tem času preda žarnici, imenujemo **električno delo** $A$:

$$A = 42\,\mathrm{W} \cdot 10\,800\,\mathrm{s} = 453\,600\,\mathrm{J}$$

Električno delo merimo v joulih ($\mathrm{J}$), tako kot vsako energijo.

Število je veliko in nerodno. Zato števec porabo meri v **kilovatnih urah** ($\mathrm{kWh}$), v njih je zapisana tudi na računu. Moč zapišemo v kilovatih, $42\,\mathrm{W} = 0{,}042\,\mathrm{kW}$, čas pa v urah:

$$A = 0{,}042\,\mathrm{kW} \cdot 3\,\mathrm{h} = 0{,}126\,\mathrm{kWh}$$

En večer tako stane $0{,}126 \cdot 0{,}20\,\text{€} \approx 0{,}025\,\text{€}$, to je dva in pol centa. Malo, a svetilka sveti vsak dan.

:::premisli
Maja pusti halogenko prižgano $6\,\mathrm{h}$ namesto $3\,\mathrm{h}$. Napovej: kaj se zgodi z močjo žarnice in kaj z delom?
---
Moč ostane $42\,\mathrm{W}$, saj žarnica vsako sekundo pretvori enako energije. Delo se podvoji na $0{,}252\,\mathrm{kWh}$, ker sveti dvakrat dlje. Podvoji se tudi strošek.
:::

**2. Delo iz moči in časa.** Kar smo naredili z žarnico, velja za vsak porabnik. Če deluje čas $t$ z močjo $P$, je električno delo:

$$A = P \cdot t$$

Enote morajo biti usklajene:

- moč v $\mathrm{W}$ in čas v $\mathrm{s}$ dasta delo v $\mathrm{J}$, saj je $1\,\mathrm{J} = 1\,\mathrm{W} \cdot 1\,\mathrm{s}$;
- moč v $\mathrm{kW}$ in čas v $\mathrm{h}$ dasta delo v $\mathrm{kWh}$.

Ena kilovatna ura je delo porabnika z močjo $1\,\mathrm{kW}$ v eni uri:

$$1\,\mathrm{kWh} = 1000\,\mathrm{W} \cdot 3600\,\mathrm{s} = 3\,600\,000\,\mathrm{J}$$

**3. Strošek.** Na računu je porabljeno delo v $\mathrm{kWh}$, pomnoženo s ceno ene kilovatne ure:

$$\text{strošek} = \text{delo v kWh} \cdot \text{cena na kWh}$$

**4. Moč iz napetosti in toka.** Na polnilniku ali v nalogi pogosto poznaš napetost $U$ in tok $I$, moči pa ne. Večja napetost in večji tok pomenita, da se vsako sekundo pretvori več energije. Moč je njun produkt:

$$P = U \cdot I$$

Enote se ujemajo: $1\,\mathrm{W} = 1\,\mathrm{V} \cdot 1\,\mathrm{A}$. Ker je $A = P \cdot t$, velja tudi $A = U \cdot I \cdot t$. Za Majino halogenko na omrežni napetosti $230\,\mathrm{V}$ je tok $I = \dfrac{P}{U} = \dfrac{42\,\mathrm{W}}{230\,\mathrm{V}} \approx 0{,}18\,\mathrm{A}$.

**5. Kaj doma porabi največ?** Račun ni odvisen samo od moči, ampak od moči in časa skupaj.

| Naprava | Moč | Čas na dan | Delo na dan |
|---|---|---|---|
| polnilnik telefona | $10\,\mathrm{W}$ | $3\,\mathrm{h}$ | $0{,}03\,\mathrm{kWh}$ |
| sušilnik za lase | $1800\,\mathrm{W}$ | $15\,\text{min}$ | $0{,}45\,\mathrm{kWh}$ |
| televizor | $100\,\mathrm{W}$ | $3\,\mathrm{h}$ | $0{,}3\,\mathrm{kWh}$ |

:::premisli
Kaj porabi več v enem dnevu: LED žarnica z $10\,\mathrm{W}$, ki sveti vseh $24\,\mathrm{h}$, ali sušilnik z $2000\,\mathrm{W}$, ki dela $5\,\text{min}$? Najprej ugani, nato izračunaj.
---
LED žarnica: $0{,}01\,\mathrm{kW} \cdot 24\,\mathrm{h} = 0{,}24\,\mathrm{kWh}$. Sušilnik: $2\,\mathrm{kW} \cdot \dfrac{5}{60}\,\mathrm{h} \approx 0{,}17\,\mathrm{kWh}$. Več porabi šibka žarnica, ker dela veliko dlje.
:::

V simulaciji spodaj, »Poraba električne energije doma«, so te naprave z začetnimi urami na dan. Sušilniku podaljšaj čas delovanja in opazuj, kako zraste njegov stolpec v $\mathrm{kWh}$. Nato premakni drsnik za ceno in poglej, kaj se zgodi s stroškom, poraba pa ostane enaka.

## Rešeni primeri

### Primer 1 (lažji): moč porabnika

Žarnica je priključena na napetost $230\,\mathrm{V}$ in skozi njo teče tok $0{,}1\,\mathrm{A}$. Kolikšna je njena moč?

**Podatki:** $U = 230\,\mathrm{V}$, $I = 0{,}1\,\mathrm{A}$
**Iščemo:** moč $P$

:::formula
$P = U \cdot I$
:::

**Rešitev:**

1. Poznamo napetost in tok, iščemo moč, zato uporabimo $P = U \cdot I$.
2. Vstavimo: $P = 230\,\mathrm{V} \cdot 0{,}1\,\mathrm{A} = 23\,\mathrm{W}$.
3. Preverimo smiselnost: $23\,\mathrm{W}$ je moč varčne svetilke, kar je realno.

**Odgovor:** moč žarnice je $23\,\mathrm{W}$.

### Primer 2: tok iz moči in poraba v enem mesecu

Kuhalnik ima moč $1500\,\mathrm{W}$ in je priključen na $230\,\mathrm{V}$. a) Kolikšen tok teče skozenj? b) Koliko energije porabi v $30$ dneh, če dnevno deluje $40\,\text{min}$, in koliko to stane pri ceni $0{,}20\,\text{€}$ za $1\,\mathrm{kWh}$?

**Podatki:** $P = 1500\,\mathrm{W}$, $U = 230\,\mathrm{V}$, $30$ dni po $40\,\text{min}$ na dan, cena $0{,}20\,\text{€}$ za $1\,\mathrm{kWh}$
**Iščemo:** a) tok $I$; b) električno delo $A$ v $\mathrm{kWh}$ in strošek

:::formula
a) Iz $P = U \cdot I$ sledi $I = \dfrac{P}{U}$. b) $A = P \cdot t$ (moč v $\mathrm{kW}$, čas v $\mathrm{h}$), strošek = $A$ $\cdot$ cena na $\mathrm{kWh}$
:::

**Rešitev:**

**a)**

1. Iz $P = U \cdot I$ izrazimo tok, ker je to neznanka: $I = \dfrac{P}{U}$.
2. $I = \dfrac{1500\,\mathrm{W}}{230\,\mathrm{V}} \approx 6{,}5\,\mathrm{A}$.

**b)**

1. Skupni čas: $30 \cdot 40\,\text{min} = 1200\,\text{min}$. To je $\dfrac{1200}{60}\,\mathrm{h} = 20\,\mathrm{h}$, ker ima ura $60$ minut.
2. Moč v kilovatih, da bo delo v $\mathrm{kWh}$: $1500\,\mathrm{W} = 1{,}5\,\mathrm{kW}$.
3. $A = P \cdot t = 1{,}5\,\mathrm{kW} \cdot 20\,\mathrm{h} = 30\,\mathrm{kWh}$.
4. Pri ceni $0{,}20\,\text{€}/\mathrm{kWh}$ je strošek $30 \cdot 0{,}20 = 6{,}00\,\text{€}$.

**Odgovor:** a) skozi kuhalnik teče približno $6{,}5\,\mathrm{A}$; b) v $30$ dneh porabi $30\,\mathrm{kWh}$, kar stane $6{,}00\,\text{€}$.

### Primer 3 (težji): ali se LED žarnica izplača?

Vrnimo se k Maji. Halogenka ima moč $42\,\mathrm{W}$ in stane $1{,}50\,\text{€}$, LED žarnica ima moč $6\,\mathrm{W}$ in stane $4{,}50\,\text{€}$. Svetilka sveti $3\,\mathrm{h}$ na dan, elektrika stane $0{,}20\,\text{€}$ za $1\,\mathrm{kWh}$. Po koliko dneh LED žarnica z manjšo porabo elektrike povrne višjo ceno nakupa?

**Podatki:** $P_1 = 42\,\mathrm{W}$, cena $1{,}50\,\text{€}$; $P_2 = 6\,\mathrm{W}$, cena $4{,}50\,\text{€}$; $t = 3\,\mathrm{h}$ na dan; $0{,}20\,\text{€}$ za $1\,\mathrm{kWh}$
**Iščemo:** število dni $n$, po katerem se LED žarnica izplača

:::formula
$A = P \cdot t$, strošek = $A$ $\cdot$ cena na $\mathrm{kWh}$, $n = \dfrac{\text{razlika v ceni nakupa}}{\text{prihranek na dan}}$
:::

**Rešitev:**

1. LED žarnica je dražja za $4{,}50\,\text{€} - 1{,}50\,\text{€} = 3{,}00\,\text{€}$. Toliko mora prihraniti pri elektriki.
2. Njena moč je manjša za $42\,\mathrm{W} - 6\,\mathrm{W} = 36\,\mathrm{W}$, to je $0{,}036\,\mathrm{kW}$. Računamo kar z razliko, ker nas zanima samo prihranek.
3. Prihranek energije na dan: $0{,}036\,\mathrm{kW} \cdot 3\,\mathrm{h} = 0{,}108\,\mathrm{kWh}$.
4. Prihranek denarja na dan: $0{,}108 \cdot 0{,}20\,\text{€} = 0{,}0216\,\text{€}$.
5. Zdaj sam izračunaj, po koliko dneh prihranki dosežejo $3{,}00\,\text{€}$.

:::premisli
Koliko je $n$? Ali je imel prodajalec prav?
---
$n = 3{,}00 : 0{,}0216 \approx 139$ dni, torej manj kot pol leta. LED žarnica zdrži več let, zato ima prodajalec prav: po približno $139$ dneh Maja z njo začne varčevati.
:::

## Pogoste napake

- **»Kilovatna ura je enota za moč.«** Učenec vidi besedo »kilovat« in misli, da $\mathrm{kWh}$ pove, kako močan je aparat. Kilovatna ura pa je moč, pomnožena s časom, torej enota za **delo** (porabljeno energijo), tako kot $\mathrm{J}$ in $\mathrm{Ws}$. Moč pišemo v $\mathrm{W}$ ali $\mathrm{kW}$, porabo na računu v $\mathrm{kWh}$.
- **Vati pomnoženi z urami.** Učenec računalnik z $200\,\mathrm{W}$, ki dela $3\,\mathrm{h}$, izračuna kot $600\,\mathrm{kWh}$. Produkt $\mathrm{W} \cdot \mathrm{h}$ je vatna ura, ki je $1000$-krat manjša od $\mathrm{kWh}$. Pred množenjem z urami moč deli s $1000$: $0{,}2\,\mathrm{kW} \cdot 3\,\mathrm{h} = 0{,}6\,\mathrm{kWh}$.
- **Minute zapisane kot decimalke ur.** Učenec zapiše $45\,\text{min} = 0{,}45\,\mathrm{h}$ ali $20\,\text{min} = 0{,}2\,\mathrm{h}$, kot da ima ura $100$ minut. Ura ima $60$ minut, zato minute deli s $60$: $45\,\text{min} = 0{,}75\,\mathrm{h}$; $20\,\text{min} \approx 0{,}33\,\mathrm{h}$.
- **»Daljše delovanje poveča moč.«** Učenec misli, da aparat, ki dela dlje, »dela močneje«. Moč $P = U \cdot I$ ne vsebuje časa: pove, koliko energije se pretvori v vsaki sekundi. Daljši čas poveča **delo** $A = P \cdot t$ in s tem strošek, moč pa ostane enaka.
- **»Za račun šteje samo moč.«** Učenec misli, da ima največji račun aparat z največjo močjo. Strošek je odvisen od dela, torej od moči **in** časa. Šibka žarnica, ki sveti ves dan, lahko porabi več kot sušilnik, ki dela pet minut.

## Povzetek

- Električna moč pove, kako hitro se električna energija pretvarja: $P = U \cdot I$, enota $\mathrm{W}$.
- Električno delo: $A = P \cdot t = U \cdot I \cdot t$, enota $\mathrm{J}$.
- $1\,\mathrm{kWh} = 3\,600\,000\,\mathrm{J}$; to je delo moči $1\,\mathrm{kW}$ v eni uri.
- Strošek = poraba v $\mathrm{kWh}$ $\cdot$ cena na $\mathrm{kWh}$.
- Pri računanju pazi na enote: $\mathrm{W}$ in $\mathrm{s}$ dasta $\mathrm{J}$; $\mathrm{kW}$ in $\mathrm{h}$ dasta $\mathrm{kWh}$; minute deli s $60$.
- Račun je odvisen od moči in časa skupaj: šibek aparat, ki dela dolgo, lahko porabi več kot močan, ki dela kratko.

## Drugače: Z analogijo

**Taksimeter.** Moč je kot tarifa taksija, na primer $1\,\text{€}$ na minuto: pove, kako hitro raste znesek. Delo je kot znesek na koncu vožnje. Daljša vožnja pri isti tarifi pomeni večji znesek, tarifa pa ostane enaka. Tako tudi daljše delovanje aparata poveča delo in račun, njegova moč pa se ne spremeni.

**Voda v cevi.** Napetost je kot višinska razlika (kako visoko je zbiralnik vode), tok je kot količina vode, ki steče v vsaki sekundi. Če je višinska razlika velika in teče veliko vode, je moč vodnega toka velika. Enako je pri elektriki: večja napetost $U$ in večji tok $I$ pomenita večjo moč $P = U \cdot I$.

**Kozarec.** Delo je količina vode v kozarcu, moč pa to, kako hitro se kozarec polni. Močan grelnik (velik $P$) v isti uri »natoči« več energije kot šibak.

## Drugače: Iz vsakdanjega življenja

Vzemi račun za elektriko. Na njem je poraba v $\mathrm{kWh}$. To je delo, ki so ga opravili vsi aparati pri vas doma v obračunskem obdobju. Znesek na računu je ta poraba, pomnožena s ceno.

Del te porabe nastane, ko ne gledaš ničesar. Televizor v stanju pripravljenosti (sveti le rdeča lučka) ima moč okoli $1\,\mathrm{W}$. Če je tako $20\,\mathrm{h}$ na dan, v enem letu porabi $0{,}001\,\mathrm{kW} \cdot 20\,\mathrm{h} \cdot 365 = 7{,}3\,\mathrm{kWh}$. To stane približno $1{,}46\,\text{€}$. Malo za eno napravo, a doma jih je v pripravljenosti pogosto deset ali več.

## Drugače: Korak za korakom s številkami

Recept za nalogo o porabi energije:

1. Izpiši podatke in enote: $P$, $t$, cena.
2. Pretvori moč v $\mathrm{kW}$: deli s $1000$.
3. Pretvori čas v $\mathrm{h}$: minute deli s $60$.
4. Izračunaj $A = P \cdot t$.
5. Pomnoži s ceno.

Primer: družina gleda televizor z močjo $120\,\mathrm{W}$ po $4\,\mathrm{h}$ na dan. Koliko stane to v $30$ dneh pri ceni $0{,}20\,\text{€}/\mathrm{kWh}$?

| Korak | Račun | Rezultat |
|---|---|---|
| Moč v kW | $120 : 1000$ | $0{,}12\,\mathrm{kW}$ |
| Dnevno delo | $0{,}12 \cdot 4$ | $0{,}48\,\mathrm{kWh}$ |
| Delo v 30 dneh | $0{,}48 \cdot 30$ | $14{,}4\,\mathrm{kWh}$ |
| Strošek | $14{,}4 \cdot 0{,}20$ | $2{,}88\,\text{€}$ |

## Drugače: Bolj natančno

**Zakaj je $P = U \cdot I$?** Napetost na porabniku pove, koliko električnega dela se v njem opravi za vsak $1\,\mathrm{As}$ elektrine, ki gre skozenj: $U = \dfrac{A}{e}$. Iz tega je delo $A = U \cdot e$. Iz lekcije o toku veš, da je elektrina $e = I \cdot t$. Vstavimo:

$$A = U \cdot I \cdot t$$

Moč je delo, deljeno s časom:

$$P = \frac{A}{t} = U \cdot I$$

Enote se ujemajo: $1\,\mathrm{V} = 1\,\mathrm{J/As}$ in $1\,\mathrm{A} = 1\,\mathrm{As/s}$, zato je $1\,\mathrm{V} \cdot 1\,\mathrm{A} = 1\,\mathrm{J/s} = 1\,\mathrm{W}$.

**Kam gre delo?** V grelniku in kuhalniku se vse električno delo pretvori v toploto, zato velja $Q = A = P \cdot t$. To je ista zveza $Q = P \cdot t$, s katero si računal segrevanje. V žarnici se del dela pretvori v svetlobo, preostanek v toploto. Halogenka večino dela pretvori v toploto, zato je vroča. LED žarnica ima veliko večji izkoristek: večji del dela pretvori v svetlobo. Zato za enako svetlobo potrebuje le $6\,\mathrm{W}$ namesto $42\,\mathrm{W}$.

## Preveri se

? Tri od teh enot merijo isto količino. Katera ne spada zraven?
- $\mathrm{J}$
~ Joule je enota za delo oziroma energijo, tako kot $\mathrm{kWh}$ in $\mathrm{Ws}$.
- $\mathrm{kWh}$
~ Kilovatna ura je kljub besedi »kilovat« enota za delo: moč, pomnožena s časom.
+ $\mathrm{kW}$
- $\mathrm{Ws}$
~ Vatsekunda je moč, pomnožena s časom, in je enaka $1\,\mathrm{J}$. Je enota za delo.
> $\mathrm{J}$, $\mathrm{Ws}$ in $\mathrm{kWh}$ so enote za delo (energijo). $\mathrm{kW}$ je enota za moč: pove, kako hitro se energija pretvarja.

? Pečica z močjo $2\,\mathrm{kW}$ deluje $45\,\text{min}$. Koliko električnega dela opravi?
- $90\,\mathrm{kWh}$
~ Tu so minute vstavljene kot ure. Najprej pretvori: $45\,\text{min} = \dfrac{45}{60}\,\mathrm{h}$.
- $0{,}9\,\mathrm{kWh}$
~ Tu je $45\,\text{min}$ zapisano kot $0{,}45\,\mathrm{h}$. Ura ima $60$ minut, ne $100$.
+ $1{,}5\,\mathrm{kWh}$
- $0{,}75\,\mathrm{kWh}$
~ To je samo čas v urah. Pomnožiti ga moraš še z močjo.
> $45\,\text{min} = 0{,}75\,\mathrm{h}$, zato je $A = 2\,\mathrm{kW} \cdot 0{,}75\,\mathrm{h} = 1{,}5\,\mathrm{kWh}$.

? Grelnik z isto nastavitvijo namesto $1\,\mathrm{h}$ dela $2\,\mathrm{h}$. Kaj je posledica?
- Moč se podvoji, delo ostane enako.
~ Moč ne vsebuje časa: grelnik v vsaki sekundi pretvori enako energije. Daljši čas spremeni delo.
+ Moč ostane enaka, delo in strošek se podvojita.
- Moč in delo se podvojita.
~ Delo se res podvoji, moč pa ne. Grelnik ne dela »močneje«, samo dlje.
- Delo ostane enako, ker je moč enaka.
~ Delo je $A = P \cdot t$. Pri enaki moči dvakrat daljši čas pomeni dvakrat več dela.
> Moč je odvisna od napetosti in toka, ki se nista spremenila. Delo $A = P \cdot t$ je sorazmerno s časom, zato se podvoji, z njim pa tudi strošek.

? Tim računa, koliko stane $20\,\text{min}$ kuhanja s kuhalnikom $1500\,\mathrm{W}$ pri ceni $0{,}20\,\text{€}/\mathrm{kWh}$. (1) $P = 1{,}5\,\mathrm{kW}$; (2) $t = 0{,}2\,\mathrm{h}$; (3) $A = 1{,}5 \cdot 0{,}2 = 0{,}3\,\mathrm{kWh}$; (4) strošek $0{,}3 \cdot 0{,}20 = 0{,}06\,\text{€}$. Kateri korak je napačen?
- korak (1)
~ Pretvorba je pravilna: $1500\,\mathrm{W} : 1000 = 1{,}5\,\mathrm{kW}$.
+ korak (2)
- korak (3)
~ Množenje je pravilno izvedeno. Napačen je čas, ki ga je Tim vstavil.
- noben, račun je pravilen
~ $20\,\text{min}$ ni $0{,}2\,\mathrm{h}$, saj ima ura $60$ minut.
> $20\,\text{min} = \dfrac{20}{60}\,\mathrm{h} \approx 0{,}33\,\mathrm{h}$. Pravilno je $A = 1{,}5\,\mathrm{kW} \cdot \dfrac{1}{3}\,\mathrm{h} = 0{,}5\,\mathrm{kWh}$, strošek pa $0{,}10\,\text{€}$.

? Tvoj računalnik ima moč $200\,\mathrm{W}$ in ga uporabljaš $3\,\mathrm{h}$ na dan. Koliko stane en mesec ($30$ dni) pri ceni $0{,}20\,\text{€}/\mathrm{kWh}$?
- $3600\,\text{€}$
~ Moč je ostala v vatih. $200\,\mathrm{W} \cdot 3\,\mathrm{h}$ je $600\,\mathrm{Wh}$, to je $0{,}6\,\mathrm{kWh}$, ne $600\,\mathrm{kWh}$.
- $0{,}12\,\text{€}$
~ To je strošek enega dne. Pomnožiti ga moraš še s $30$ dnevi.
- $18\,\text{€}$
~ $18\,\mathrm{kWh}$ je poraba, ne strošek. Pomnožiti jo moraš še s ceno.
+ $3{,}60\,\text{€}$
> $0{,}2\,\mathrm{kW} \cdot 3\,\mathrm{h} = 0{,}6\,\mathrm{kWh}$ na dan, v $30$ dneh $18\,\mathrm{kWh}$, kar stane $18 \cdot 0{,}20\,\text{€} = 3{,}60\,\text{€}$.

:::simboli
P | električna moč | P = U \cdot I | W | tudi v kW
U | električna napetost | | V
I | električni tok | I = \dfrac{P}{U} | A
A | električno delo | A = P \cdot t | J | na računu za elektriko v kWh
t | čas delovanja porabnika | | s | pri porabi doma v h
P_1 | moč halogenske žarnice | | W
P_2 | moč LED žarnice | | W
n | število dni, po katerem se LED žarnica izplača | | –
e | elektrina | e = I \cdot t | As
:::
