---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ko so konec 18. stoletja gradili parne stroje, so morali inženirji, med njimi James Watt, z ročicami in drogovi pretvarjati nihanje vzvoda v premo gibanje bata. Za vsak del mehanizma so potrebovali hitrost v vsaki legi, računati pa so znali le gibanje točk. Pomagala je ideja, ki jo je že Johann Bernoulli uporabil za kotaljenje, splošno pa jo je v 19. stoletju dokazal Michel Chasles: vsako ravninsko gibanje togega telesa je v danem trenutku translacija ali **vrtenje okoli ene same točke**. Tej točki pravimo **trenutni pol hitrosti**.

Preizkusi jo s poskusom, ki ga lahko narediš doma. Na obod kolesa pritrdi lučko, v temi kolo enakomerno zakotali in ga posnemi z dolgo osvetlitvijo. Lučka nariše loke (cikloido), ki se pri tleh za hip ustavijo in na vrhu raztegnejo. Katera točka kolesa je najhitrejša in katera miruje? Odgovor, ki ga da pol, je natančen in hiter, in ravno to izpit od tebe pričakuje: hitrosti in pospeške točk mehanizma v dani legi.

## Razlaga

### 1. Mamljiva napačna slika

Večina študentov na začetku misli: »Kolo se pelje s hitrostjo $v$, torej se z njo gibljejo vse njegove točke.« Ali pa: »Točke kolesa krožijo okoli osi, zato imajo vse na obodu enako hitrost $\omega R$.«

Obe sliki sta napačni, a vsaka vsebuje polovico resnice. Posnetek lučke pokaže, da se točka ob tleh za hip ustavi, točka na vrhu pa se giblje dvakrat hitreje od osi. Pravilna slika sešteje obe polovici: gibanje kolesa je **premik skupaj z osjo** in hkrati **vrtenje okoli osi**. Ob tleh se hitrosti $v$ (naprej) in $\omega R$ (nazaj) odštejeta, na vrhu seštejeta. To bomo zdaj natančno zapisali za vsako togo telo.

### 2. Togo telo in vrste ravninskega gibanja

**Definicija.** **Togo telo** je telo, pri katerem je razdalja med poljubnima točkama ves čas enaka: $|\vec{r}_B - \vec{r}_A| = \text{konst.}$

**Definicija.** Gibanje je **ravninsko**, če se vse točke telesa gibljejo v ravninah, vzporednih z neko stalno ravnino. Zadošča opazovati en prerez telesa v tej ravnini; vrtenje je tedaj vedno okoli osi, pravokotne na ravnino, zato je kotna hitrost $\vec{\omega} = \omega\,\vec{k}$ in kotni pospešek $\vec{\alpha} = \alpha\,\vec{k}$ (z $\vec{k}$ pravokotnim na ravnino).

Ločimo tri vrste ravninskega gibanja:

- **translacija** ($\omega = 0$): vse točke imajo v danem trenutku enako hitrost in enak pospešek; daljica v telesu ostaja vzporedna sama sebi (tudi kadar točke potujejo po krivuljah, kot gugalnica, obešena na dveh vzporednih enako dolgih drogovih, ali kabina panoramskega kolesa);
- **vrtenje okoli nepremične osi**: točke krožijo, $v = \omega r$;
- **splošno ravninsko gibanje**: kolo, ojnica v motorju, lestev, ki drsi ob steni.

Kotna hitrost je lastnost **celega telesa**, ne izbrane točke: vsaka daljica v telesu se zavrti za enak kot.

### 3. Izrek o hitrostih dveh točk

**Izrek.** Za poljubni točki $A$ in $B$ togega telesa pri ravninskem gibanju velja

$$\vec{v}_B = \vec{v}_A + \vec{\omega} \times \vec{r}_{AB},$$

kjer je $\vec{r}_{AB} = \vec{r}_B - \vec{r}_A$. Relativna hitrost $\vec{\omega} \times \vec{r}_{AB}$ je pravokotna na $AB$ in ima velikost $\omega\,|AB|$.

**Dokaz.** Ker je telo togo, je $\vec{r}_{AB} \cdot \vec{r}_{AB} = \text{konst.}$; odvod da $2\,\vec{r}_{AB} \cdot \dot{\vec{r}}_{AB} = 0$. Vektor $\dot{\vec{r}}_{AB} = \vec{v}_B - \vec{v}_A$ je torej pravokoten na $\vec{r}_{AB}$, v ravnini pa ga zato lahko zapišemo kot $\omega\,\vec{k} \times \vec{r}_{AB}$. Število $\omega$ je enako za vse pare točk, ker se pri togem telesu vse daljice zasučejo za enak kot $\varphi$, $\omega = \dot{\varphi}$.

**Posledica (izrek o projekcijah hitrosti).** Projekciji hitrosti točk $A$ in $B$ na premico $AB$ sta enaki:

$$\vec{v}_A \cdot \vec{e}_{AB} = \vec{v}_B \cdot \vec{e}_{AB}.$$

Sicer bi se razdalja $AB$ spreminjala. To je najhitrejši preizkus vsakega izračuna.

:::premisli
Kolo z osjo $S$ se kotali v desno s hitrostjo $v_S$. Kakšni sta hitrost relativnega vrtenja in skupna hitrost točke na vrhu oboda?
---
Relativna hitrost vrtenja je pravokotna na $SB$ in ima velikost $\omega R$; na vrhu kaže naprej, enako kot $\vec{v}_S$. Pri kotaljenju brez spodrsavanja je $\omega R = v_S$, zato ima vrh hitrost $2v_S$. Ob tleh kaže relativna hitrost nazaj in se z $v_S$ odšteje na nič.
:::

### 4. Trenutni pol hitrosti

**Definicija.** **Trenutni pol hitrosti** $P$ je točka ravnine (togo povezana s telesom, lahko tudi zunaj njega), ki ima v danem trenutku hitrost nič.

**Izrek.** Če je $\omega \ne 0$, trenutni pol obstaja in je en sam. Leži na premici skozi $A$, pravokotni na $\vec{v}_A$, na razdalji

$$r_{AP} = \frac{v_A}{\omega},$$

na tisti strani, da se $A$ okoli $P$ vrti v smeri $\omega$. Hitrost vsake točke $B$ je tedaj $v_B = \omega\,r_{PB}$ in je pravokotna na $PB$.

**Dokaz.** Iščemo $P$ z $\vec{v}_P = \vec{v}_A + \vec{\omega} \times \vec{r}_{AP} = 0$. Pomnožimo vektorsko z $\vec{\omega}$ z leve: $\vec{\omega} \times \vec{v}_A + \vec{\omega} \times (\vec{\omega} \times \vec{r}_{AP}) = 0$. Ker je $\vec{r}_{AP}$ v ravnini, je $\vec{\omega} \times (\vec{\omega} \times \vec{r}_{AP}) = -\omega^2\vec{r}_{AP}$, zato $\vec{r}_{AP} = \dfrac{\vec{\omega} \times \vec{v}_A}{\omega^2}$. Rešitev je ena sama in ima velikost $v_A/\omega$. Za $P$ izrek o hitrostih da $\vec{v}_B = \vec{\omega} \times \vec{r}_{PB}$, kar je pravokotno na $PB$ z velikostjo $\omega r_{PB}$.

**Konstrukcija.** Če poznaš smeri hitrosti dveh točk, nariši v vsaki pravokotnico na njeno hitrost; presečišče je $P$. Posebna primera:

- pravokotnici sta vzporedni (hitrosti vzporedni, $A$ in $B$ ne na skupni pravokotnici): $P$ je »v neskončnosti«, $\omega = 0$, telo se ta trenutek giblje translatorno in $\vec{v}_A = \vec{v}_B$;
- hitrosti sta vzporedni in pravokotni na $AB$: $P$ leži na premici $AB$, kjer jo seka premica skozi konca vektorjev hitrosti.

Pri kotaljenju brez spodrsavanja je pol v stični točki, zato $v_S = \omega R$.

**Pomembno.** Pol ima hitrost nič, **pospeška pa ne**. Stična točka kotalečega se kolesa ima pospešek $\omega^2R$ navzgor, zato jo naslednji trenutek kolo dvigne. Pol se med gibanjem premika po telesu in po ravnini; za pospeške ga ne smeš uporabiti kot nepremično os.

### 5. Pospeški

**Izrek.** Za točki $A$ in $B$ togega telesa pri ravninskem gibanju velja

$$\vec{a}_B = \vec{a}_A + \vec{\alpha} \times \vec{r}_{AB} - \omega^2\vec{r}_{AB}.$$

Člen $\vec{\alpha} \times \vec{r}_{AB}$ je tangentni pospešek relativnega vrtenja (pravokoten na $AB$, velikost $\alpha\,|AB|$), člen $-\omega^2\vec{r}_{AB}$ pa centripetalni (od $B$ proti $A$, velikost $\omega^2|AB|$).

**Izpeljava.** Odvajamo izrek o hitrostih: $\dot{\vec{\omega}} = \vec{\alpha}$ in $\dot{\vec{r}}_{AB} = \vec{\omega} \times \vec{r}_{AB}$, torej $\vec{a}_B = \vec{a}_A + \vec{\alpha} \times \vec{r}_{AB} + \vec{\omega} \times (\vec{\omega} \times \vec{r}_{AB})$; zadnji člen je v ravnini enak $-\omega^2\vec{r}_{AB}$.

**Postopek za mehanizem.** (1) Nariši lego in označi znane hitrosti. (2) S polom ali z vektorsko enačbo določi kotne hitrosti vseh členov. (3) Zapiši enačbo pospeškov za vsak člen in jo razstavi na komponenti $x$ in $y$; neznanke so kotni pospeški in velikosti pospeškov drsnikov. (4) Preveri z izrekom o projekcijah.

## Rešeni primeri

### Primer 1 (lažji)

Kolo s polmerom $0{,}35\,\mathrm{m}$, na obodu katerega je lučka iz poskusa, se brez spodrsavanja kotali po vodoravnih tleh. Os se giblje s hitrostjo $5{,}0\,\mathrm{m/s}$. Kolikšna je kotna hitrost kolesa in kolikšne so hitrosti lučke, ko je na vrhu, ob tleh in v višini osi spredaj?

**Podatki:** $R = 0{,}35\,\mathrm{m}$, $v_S = 5{,}0\,\mathrm{m/s}$, kotaljenje brez spodrsavanja
**Iščemo:** $\omega$, $v_{vrh}$, $v_{tla}$, $v_{spredaj}$

:::formula
$\omega = \dfrac{v_S}{R}$, $v_B = \omega\,r_{PB}$ (pol $P$ v stični točki)
:::

**Rešitev:**

1. Stična točka ne drsi, zato je pol: $\omega = 5{,}0/0{,}35\,\mathrm{s^{-1}} \approx 14{,}3\,\mathrm{s^{-1}}$.
2. Vrh je od pola oddaljen $2R$: $v_{vrh} = \omega \cdot 2R = 2v_S = 10\,\mathrm{m/s}$, vodoravno naprej.
3. Ob tleh je lučka v polu: $v_{tla} = 0$.
4. Točka v višini osi spredaj je od pola oddaljena $R\sqrt{2}$: $v_{spredaj} = v_S\sqrt{2} \approx 7{,}07\,\mathrm{m/s}$, pod $45^\circ$ navzdol naprej (pravokotno na zveznico s polom).
5. Odgovor: $\omega \approx 14{,}3\,\mathrm{s^{-1}}$; lučka ima na vrhu $10\,\mathrm{m/s}$, ob tleh miruje, spredaj v višini osi pa ima $7{,}07\,\mathrm{m/s}$. Zato se na posnetku loki ob tleh zgostijo.

### Primer 2

Lestev z dolžino $5{,}0\,\mathrm{m}$ drsi: spodnji konec $A$ se po tleh odmika od stene s hitrostjo $1{,}2\,\mathrm{m/s}$, zgornji konec $B$ drsi po navpični steni. V trenutku, ko lestev s tlemi oklepa kot $40^\circ$, določi kotno hitrost lestve ter hitrosti zgornjega konca in sredine.

**Podatki:** $L = 5{,}0\,\mathrm{m}$, $v_A = 1{,}2\,\mathrm{m/s}$ (vodoravno), $\vec{v}_B$ navpično, $\varphi = 40^\circ$
**Iščemo:** $\omega$, $v_B$, $v_M$

:::formula
$P$ = presečišče navpičnice skozi $A$ in vodoravnice skozi $B$; $\omega = \dfrac{v_A}{r_{PA}}$, $v = \omega\,r_P$
:::

**Rešitev:**

1. Hitrost $A$ je vodoravna, zato pol leži na navpičnici skozi $A$; hitrost $B$ je navpična, zato pol leži na vodoravnici skozi $B$. Presečišče je oglišče pravokotnika s stranicama $L\cos\varphi$ in $L\sin\varphi$.
2. $r_{PA} = L\sin\varphi = 5{,}0 \cdot 0{,}643\,\mathrm{m} \approx 3{,}21\,\mathrm{m}$, $r_{PB} = L\cos\varphi \approx 3{,}83\,\mathrm{m}$.
3. $\omega = v_A/r_{PA} = 1{,}2/3{,}21\,\mathrm{s^{-1}} \approx 0{,}373\,\mathrm{s^{-1}}$.
4. $v_B = \omega\,r_{PB} = 0{,}373 \cdot 3{,}83\,\mathrm{m/s} \approx 1{,}43\,\mathrm{m/s}$, navzdol. Isto da $v_A\cot\varphi = 1{,}2 \cdot 1{,}192\,\mathrm{m/s}$.
5. Sredina $M$ je od pola oddaljena za polovico diagonale pravokotnika, torej $L/2$: $v_M = 0{,}373 \cdot 2{,}5\,\mathrm{m/s} \approx 0{,}93\,\mathrm{m/s}$.
6. Preizkus s projekcijami na $AB$: $v_A\cos\varphi = 1{,}2 \cdot 0{,}766 \approx 0{,}919\,\mathrm{m/s}$ in $v_B\sin\varphi = 1{,}43 \cdot 0{,}643 \approx 0{,}919\,\mathrm{m/s}$. ✓
7. Odgovor: lestev se vrti s $0{,}373\,\mathrm{s^{-1}}$, zgornji konec pada s $1{,}43\,\mathrm{m/s}$, sredina se giblje s $0{,}93\,\mathrm{m/s}$.

### Primer 3 (težji)

Ročični mehanizem: ročica $OA$ z dolžino $r = 0{,}10\,\mathrm{m}$ se vrti okoli $O$ v pozitivni smeri s stalno kotno hitrostjo $20\,\mathrm{s^{-1}}$. Ojnica $AB$ z dolžino $l = 0{,}40\,\mathrm{m}$ je v $B$ zgibno povezana z drsnikom (batom), ki drsi po vodoravni premici skozi $O$. V legi, ko ročica oklepa z vodoravnico kot $60^\circ$ (A je nad premico), določi kotno hitrost ojnice in hitrost bata s trenutnim polom ter kotni pospešek ojnice in pospešek bata.

**Podatki:** $r = 0{,}10\,\mathrm{m}$, $\omega_1 = 20\,\mathrm{s^{-1}}$ (stalna), $l = 0{,}40\,\mathrm{m}$, $\theta = 60^\circ$, $B$ na premici skozi $O$
**Iščemo:** $\omega_2$, $v_B$, $\alpha_2$, $a_B$

:::formula
$v_A = \omega_1 r$, $\omega_2 = \dfrac{v_A}{r_{PA}}$, $v_B = \omega_2 r_{PB}$; $\vec{a}_B = \vec{a}_A + \vec{\alpha}_2 \times \vec{r}_{AB} - \omega_2^2\vec{r}_{AB}$
:::

**Rešitev:**

1. **Lega.** Izhodišče v $O$, os $x$ vzdolž premice drsnika. $A = (0{,}050;\ 0{,}0866)\,\mathrm{m}$. Za $B$ velja $(x_B - 0{,}050)^2 + 0{,}0866^2 = 0{,}40^2$, zato $x_B = 0{,}050 + \sqrt{0{,}1525}\,\mathrm{m} \approx 0{,}4405\,\mathrm{m}$. Ojnica je nagnjena za $\arcsin(0{,}0866/0{,}40) \approx 12{,}5^\circ$; $\vec{r}_{AB} = (0{,}3905;\ -0{,}0866)\,\mathrm{m}$.
2. **Pol ojnice.** $\vec{v}_A$ je pravokotna na $OA$, zato pol leži na premici $OA$; $\vec{v}_B$ je vodoravna, zato pol leži na navpičnici skozi $B$. Na premici $OA$ je $x = x_B$ pri razdalji $x_B/\cos 60^\circ \approx 0{,}881\,\mathrm{m}$ od $O$, zato $P = (0{,}4405;\ 0{,}7630)\,\mathrm{m}$, $r_{PA} \approx 0{,}881 - 0{,}100 = 0{,}781\,\mathrm{m}$, $r_{PB} \approx 0{,}763\,\mathrm{m}$.
3. **Hitrosti.** $v_A = 20 \cdot 0{,}10\,\mathrm{m/s} = 2{,}0\,\mathrm{m/s}$. $\omega_2 = 2{,}0/0{,}781\,\mathrm{s^{-1}} \approx 2{,}56\,\mathrm{s^{-1}}$ v smeri urinega kazalca (A leži med $O$ in $P$, $\vec{v}_A$ kaže levo navzgor). $v_B = 2{,}56 \cdot 0{,}763\,\mathrm{m/s} \approx 1{,}95\,\mathrm{m/s}$, proti $O$.
4. **Preizkus s projekcijami** na $AB$ ($\vec{e}_{AB} \approx (0{,}976;\ -0{,}217)$): $\vec{v}_A = (-1{,}732;\ 1{,}0)\,\mathrm{m/s}$ da $-1{,}69 - 0{,}22 \approx -1{,}91\,\mathrm{m/s}$; $\vec{v}_B = (-1{,}954;\ 0)$ da $-1{,}954 \cdot 0{,}976 \approx -1{,}91\,\mathrm{m/s}$. ✓
5. **Pospešek $A$.** Ročica se vrti enakomerno, zato ima $A$ le centripetalni pospešek proti $O$: $\omega_1^2 r = 400 \cdot 0{,}10\,\mathrm{m/s^2} = 40\,\mathrm{m/s^2}$, $\vec{a}_A = (-20;\ -34{,}64)\,\mathrm{m/s^2}$.
6. **Enačba pospeškov.** Z $\vec{\alpha}_2 = \alpha_2\vec{k}$ je $\vec{\alpha}_2 \times \vec{r}_{AB} = (0{,}0866\,\alpha_2;\ 0{,}3905\,\alpha_2)$, $\omega_2^2 \approx 6{,}557\,\mathrm{s^{-2}}$ in $\omega_2^2\vec{r}_{AB} \approx (2{,}561;\ -0{,}568)\,\mathrm{m/s^2}$. Pospešek bata je vodoraven, $\vec{a}_B = (a_B;\ 0)$.
7. Komponenta $y$: $0 = -34{,}64 + 0{,}3905\,\alpha_2 + 0{,}568$, zato $\alpha_2 = 34{,}07/0{,}3905\,\mathrm{s^{-2}} \approx 87{,}3\,\mathrm{s^{-2}}$ (pozitivna smer).
8. Komponenta $x$: $a_B = -20 + 0{,}0866 \cdot 87{,}25 - 2{,}561\,\mathrm{m/s^2} \approx -20 + 7{,}56 - 2{,}56 = -15{,}0\,\mathrm{m/s^2}$.
9. Odgovor: ojnica se vrti z $2{,}56\,\mathrm{s^{-1}}$ v smeri urinega kazalca, bat se giblje s $1{,}95\,\mathrm{m/s}$ proti $O$; kotni pospešek ojnice je $87{,}3\,\mathrm{s^{-2}}$ v pozitivni smeri (nasprotno od urinega kazalca, ojnica se torej vrti vse počasneje), pospešek bata $15{,}0\,\mathrm{m/s^2}$ proti $O$. Čeprav se ročica vrti enakomerno, se bat ne giblje enakomerno.

### Primer 4 – zdaj ti

Valj s polmerom $0{,}20\,\mathrm{m}$ leži med dvema vodoravnima deskama in po njiju ne drsi. Spodnja deska se giblje v desno s $3{,}0\,\mathrm{m/s}$, zgornja v levo z $1{,}0\,\mathrm{m/s}$. Kje je trenutni pol valja, kolikšna je kotna hitrost in kolikšna hitrost osi?

**Podatki:** $R = 0{,}20\,\mathrm{m}$, $v_{sp} = 3{,}0\,\mathrm{m/s}$ (desno), $v_{zg} = 1{,}0\,\mathrm{m/s}$ (levo), brez drsenja
**Iščemo:** lega pola, $\omega$, $v_S$

:::formula
Hitrosti stičnih točk sta vzporedni in pravokotni na premer: $\omega = \dfrac{v_{sp} + v_{zg}}{2R}$; pol je tam, kjer je hitrost nič.
:::

**Rešitev:**

1. Stični točki imata hitrosti desk: spodnja $3{,}0\,\mathrm{m/s}$ v desno, zgornja $1{,}0\,\mathrm{m/s}$ v levo. Obe sta pravokotni na navpični premer, zato pol leži na njem.
2. Hitrost se vzdolž premera spreminja linearno, od $+3{,}0$ do $-1{,}0\,\mathrm{m/s}$ na razdalji $2R = 0{,}40\,\mathrm{m}$: $\omega = 4{,}0/0{,}40\,\mathrm{s^{-1}} = 10\,\mathrm{s^{-1}}$.
3. Zdaj ti: določi, kako visoko nad spodnjo desko je pol, in hitrost osi valja.

:::premisli
Kje je pol in s kolikšno hitrostjo se giblje os?
---
Pol je na razdalji $v_{sp}/\omega = 3{,}0/10\,\mathrm{m} = 0{,}30\,\mathrm{m}$ nad spodnjo desko, torej $0{,}10\,\mathrm{m}$ nad osjo in $0{,}10\,\mathrm{m}$ pod zgornjo desko. Os je od pola oddaljena $0{,}10\,\mathrm{m}$ in je pod njim, zato se giblje v desno z $v_S = 10 \cdot 0{,}10\,\mathrm{m/s} = 1{,}0\,\mathrm{m/s}$. Preizkus: povprečje hitrosti desk je $(3{,}0 - 1{,}0)/2 = 1{,}0\,\mathrm{m/s}$. ✓
:::

## Pogoste napake

- **Vse točke kolesa imajo hitrost osi.** To bi veljalo le za translacijo. Pri kotaljenju točka ob tleh miruje, vrh ima $2v_S$; hitrost točke je vedno $\omega\,r_P$ glede na pol.
- **Pol ima tudi pospešek nič.** Pol je točka z ničelno hitrostjo le v tem trenutku. Stična točka kolesa ima pospešek $\omega^2R$ navzgor. Pospeškov ne računaj z »vrtenjem okoli pola«; uporabi enačbo pospeškov.
- **Vsak člen ima svojo kotno hitrost za vsako točko.** Kotna hitrost je ena za cel člen. Ojnica ima eno $\omega_2$, ne glede na to, ali gledaš $A$, $B$ ali sredino.
- **Pol iz smeri, ne iz pravokotnic.** Pol leži na pravokotnici na hitrost, ne na nosilki hitrosti. Pri lestvi pol ni v vogalu ob steni, ampak v nasprotnem oglišču pravokotnika.
- **Pozabljen centripetalni člen.** V $\vec{a}_B = \vec{a}_A + \vec{\alpha} \times \vec{r}_{AB} - \omega^2\vec{r}_{AB}$ zadnji člen ni nič, kadar je $\alpha = 0$. Pri ročičnem mehanizmu brez njega dobiš napačen pospešek bata.

## Povzetek

- Ravninsko gibanje togega telesa = translacija + vrtenje; $\omega$ in $\alpha$ sta skupna vsemu telesu.
- Hitrosti: $\vec{v}_B = \vec{v}_A + \vec{\omega} \times \vec{r}_{AB}$; projekciji hitrosti na $AB$ sta enaki.
- Trenutni pol $P$: $\vec{v}_P = 0$, $r_{AP} = v_A/\omega$; leži na presečišču pravokotnic na hitrosti; $v_B = \omega\,r_{PB}$, pravokotno na $PB$.
- Vzporedni hitrosti, ki nista pravokotni na $AB$: trenutna translacija, $\omega = 0$. Kotaljenje: pol v stični točki, $v_S = \omega R$.
- Pospeški: $\vec{a}_B = \vec{a}_A + \vec{\alpha} \times \vec{r}_{AB} - \omega^2\vec{r}_{AB}$; pol ima v splošnem pospešek, ki ni nič.
- Mehanizem: lega → kotne hitrosti (pol) → enačbe pospeškov po komponentah → preizkus.

## Za izpit

Znati moraš povedati:

- definiciji togega telesa in ravninskega gibanja ter tri vrste ravninskega gibanja;
- izrek $\vec{v}_B = \vec{v}_A + \vec{\omega} \times \vec{r}_{AB}$ z dokazom iz togosti in izrek o projekcijah hitrosti;
- definicijo trenutnega pola, dokaz obstoja in enoličnosti za $\omega \ne 0$ in konstrukcijo iz dveh smeri hitrosti (s posebnimi primeri);
- enačbo pospeškov z izpeljavo in zakaj pol v splošnem ni točka z ničelnim pospeškom.

### Naloga 1

Štirizgibni mehanizem: nepremični zgib $O_1$ je v izhodišču, nepremični zgib $O_2$ v točki $(0{,}80;\ 0{,}20)\,\mathrm{m}$. Ročica $O_1A$ ($0{,}20\,\mathrm{m}$) se vrti s stalno kotno hitrostjo $10\,\mathrm{s^{-1}}$ v pozitivni smeri; v opazovani legi je navpična, $A = (0;\ 0{,}20)\,\mathrm{m}$. Ojnica $AB$ ima dolžino $0{,}50\,\mathrm{m}$, nihalka $O_2B$ prav tako $0{,}50\,\mathrm{m}$, in $B = (0{,}40;\ 0{,}50)\,\mathrm{m}$. Določi kotni hitrosti ojnice in nihalke, hitrosti točk $B$ in sredine ojnice $M$ ter kotna pospeška ojnice in nihalke.

**Rešitev:**

1. Preizkus lege: $|AB| = \sqrt{0{,}40^2 + 0{,}30^2} = 0{,}50\,\mathrm{m}$, $|O_2B| = \sqrt{0{,}40^2 + 0{,}30^2} = 0{,}50\,\mathrm{m}$. ✓ $\vec{r}_{AB} = (0{,}40;\ 0{,}30)$, $\vec{r}_{O_2B} = (-0{,}40;\ 0{,}30)$.
2. $v_A = 10 \cdot 0{,}20\,\mathrm{m/s} = 2{,}0\,\mathrm{m/s}$, vodoravno v levo. Pol ojnice je presečišče premic $O_1A$ (os $y$) in $O_2B$: $O_2 + t(-0{,}40;\ 0{,}30)$ ima $x = 0$ pri $t = 2$, zato $P = (0;\ 0{,}80)\,\mathrm{m}$.
3. $r_{PA} = 0{,}60\,\mathrm{m}$, zato $\omega_2 = 2{,}0/0{,}60\,\mathrm{s^{-1}} \approx 3{,}33\,\mathrm{s^{-1}}$; $A$ je pod polom in se giblje v levo, zato se ojnica vrti v smeri urinega kazalca.
4. $r_{PB} = \sqrt{0{,}40^2 + 0{,}30^2} = 0{,}50\,\mathrm{m}$, $v_B = 3{,}33 \cdot 0{,}50\,\mathrm{m/s} \approx 1{,}67\,\mathrm{m/s}$; nihalka: $\omega_3 = v_B/|O_2B| \approx 3{,}33\,\mathrm{s^{-1}}$ v pozitivni smeri. Vektorsko $\vec{v}_B = (-1{,}0;\ -1{,}33)\,\mathrm{m/s}$.
5. Sredina $M = (0{,}20;\ 0{,}35)\,\mathrm{m}$: $r_{PM} = \sqrt{0{,}20^2 + 0{,}45^2} \approx 0{,}492\,\mathrm{m}$, $v_M \approx 3{,}33 \cdot 0{,}492\,\mathrm{m/s} \approx 1{,}64\,\mathrm{m/s}$.
6. Pospeški: $\vec{a}_A = (0;\ -20)\,\mathrm{m/s^2}$ (enakomerna ročica); $\omega_2^2 = \omega_3^2 \approx 11{,}11\,\mathrm{s^{-2}}$, zato $\omega_2^2\vec{r}_{AB} = (4{,}44;\ 3{,}33)$ in $\omega_3^2\vec{r}_{O_2B} = (-4{,}44;\ 3{,}33)\,\mathrm{m/s^2}$.
7. Pospešek $B$ izrazimo dvakrat: $\vec{a}_A + \alpha_2\vec{k} \times \vec{r}_{AB} - \omega_2^2\vec{r}_{AB} = \alpha_3\vec{k} \times \vec{r}_{O_2B} - \omega_3^2\vec{r}_{O_2B}$, z $\vec{k} \times \vec{r}_{AB} = (-0{,}30;\ 0{,}40)$ in $\vec{k} \times \vec{r}_{O_2B} = (-0{,}30;\ -0{,}40)$.
8. Komponenta $x$: $-0{,}30\,\alpha_2 - 4{,}44 = -0{,}30\,\alpha_3 + 4{,}44$, torej $\alpha_3 - \alpha_2 \approx 29{,}6\,\mathrm{s^{-2}}$. Komponenta $y$: $-20 + 0{,}40\,\alpha_2 - 3{,}33 = -0{,}40\,\alpha_3 - 3{,}33$, torej $\alpha_2 + \alpha_3 = 50\,\mathrm{s^{-2}}$.
9. $\alpha_3 \approx 39{,}8\,\mathrm{s^{-2}}$, $\alpha_2 \approx 10{,}2\,\mathrm{s^{-2}}$, oba v pozitivni smeri. Za preizkus $\vec{a}_B = (-0{,}30 \cdot 39{,}8 + 4{,}44;\ -0{,}40 \cdot 39{,}8 - 3{,}33) \approx (-7{,}50;\ -19{,}3)\,\mathrm{m/s^2}$ iz obeh strani.
10. Odgovor: $\omega_2 \approx 3{,}33\,\mathrm{s^{-1}}$ (v smeri urinega kazalca), $\omega_3 \approx 3{,}33\,\mathrm{s^{-1}}$ (nasprotno), $v_B \approx 1{,}67\,\mathrm{m/s}$, $v_M \approx 1{,}64\,\mathrm{m/s}$, $\alpha_2 \approx 10{,}2\,\mathrm{s^{-2}}$, $\alpha_3 \approx 39{,}8\,\mathrm{s^{-2}}$.

### Naloga 2

Natančno navedi in dokaži izrek o hitrostih dveh točk togega telesa pri ravninskem gibanju. Iz njega izpelji izrek o projekcijah hitrosti ter obstoj in enoličnost trenutnega pola za $\omega \ne 0$. Utemelji, ali sta lahko hitrosti dveh točk togega telesa vzporedni in različno veliki, če je zveznica točk pravokotna na hitrosti, in ali je to mogoče, če ni.

**Rešitev:**

1. Izrek in dokaz: iz $|\vec{r}_{AB}| = \text{konst.}$ sledi $\vec{r}_{AB} \cdot (\vec{v}_B - \vec{v}_A) = 0$, zato je $\vec{v}_B - \vec{v}_A = \omega\vec{k} \times \vec{r}_{AB}$, z enakim $\omega$ za vse pare (vse daljice se zasučejo za enak kot).
2. Projekcije: pomnožimo izrek skalarno z $\vec{e}_{AB}$; ker je $\vec{\omega} \times \vec{r}_{AB} \perp \vec{e}_{AB}$, dobimo $\vec{v}_B \cdot \vec{e}_{AB} = \vec{v}_A \cdot \vec{e}_{AB}$.
3. Pol: iz $\vec{v}_A + \vec{\omega} \times \vec{r}_{AP} = 0$ z vektorskim množenjem z $\vec{\omega}$ sledi edina rešitev $\vec{r}_{AP} = \vec{\omega} \times \vec{v}_A/\omega^2$.
4. Primer pravokotne zveznice: $\vec{v}_B - \vec{v}_A = \vec{\omega} \times \vec{r}_{AB}$ je vzporedna s hitrostma, zato sta lahko različno veliki; $\omega = |v_B - v_A|/|AB|$, pol leži na premici $AB$ (kot pri valju med deskama).
5. Če zveznica ni pravokotna na vzporedni hitrosti, izrek o projekcijah zahteva $v_A\cos\beta = v_B\cos\beta$ z $\cos\beta \ne 0$, torej $v_A = v_B$. Hitrosti morata biti enaki: to je trenutna translacija, $\omega = 0$.
6. Odgovor: različno veliki vzporedni hitrosti sta mogoči le, če je zveznica točk pravokotna nanju.

### Naloga 3

Kolo s polmerom $0{,}50\,\mathrm{m}$ se brez spodrsavanja kotali v desno; v opazovanem trenutku ima os hitrost $2{,}0\,\mathrm{m/s}$ in pospešek $1{,}0\,\mathrm{m/s^2}$ v desno. Izračunaj pospeška stične točke in najvišje točke oboda ter utemelji, zakaj pospešek stične točke ni nič, čeprav je njena hitrost nič.

**Rešitev:**

1. $\omega = v_S/R = 4{,}0\,\mathrm{s^{-1}}$ v smeri urinega kazalca; ker velja $v_S = \omega R$ ves čas, je $\alpha = a_S/R = 2{,}0\,\mathrm{s^{-2}}$, prav tako v smeri urinega kazalca.
2. Stična točka, $\vec{r}_{SB} = (0;\ -0{,}50)$: tangentni člen $\alpha R = 1{,}0\,\mathrm{m/s^2}$ kaže v levo in izniči $a_S$; centripetalni člen $\omega^2R = 16 \cdot 0{,}50\,\mathrm{m/s^2} = 8{,}0\,\mathrm{m/s^2}$ kaže proti osi, navzgor. Skupaj $\vec{a} = (0;\ 8{,}0)\,\mathrm{m/s^2}$.
3. Vrh, $\vec{r}_{SB} = (0;\ 0{,}50)$: tangentni člen $1{,}0\,\mathrm{m/s^2}$ v desno, centripetalni $8{,}0\,\mathrm{m/s^2}$ navzdol: $\vec{a} = (2{,}0;\ -8{,}0)\,\mathrm{m/s^2}$, velikost $\sqrt{4 + 64} \approx 8{,}25\,\mathrm{m/s^2}$.
4. Utemeljitev: stična točka je pol le v tem trenutku. Vsak hip je pol druga točka oboda; točka, ki je bila ob tleh, je v konici cikloide in se iz nje dvigne navpično navzgor, zato ima pospešek navzgor, čeprav je hitrost nič.
5. Odgovor: stična točka ima pospešek $8{,}0\,\mathrm{m/s^2}$ navzgor, vrh $(2{,}0;\ -8{,}0)\,\mathrm{m/s^2}$ oziroma $8{,}25\,\mathrm{m/s^2}$.

## Drugače: Na sliki

Lestev ob steni; $P$ je trenutni pol, pravokotnici na hitrosti se sekata v njem:

```
 stena
  |B . . . . . P
  | \          .
  |  \         .
  |   \ lestev .
  |    \       .
  |     \      .
  |      \     .
  +-------A------- tla
          -> vA
```

Hitrost $B$ je navpična, zato je pravokotnica nanjo vodoravna (pikčasta črta skozi $B$). Hitrost $A$ je vodoravna, pravokotnica navpična (skozi $A$). Hitrost vsake točke lestve je pravokotna na zveznico s $P$ in sorazmerna z razdaljo do $P$. Sredina je presečišče diagonal pravokotnika, zato je od $P$ in od vogala oddaljena $L/2$. Ker je njena razdalja do vogala ves čas $L/2$, sredina lestve opiše četrtinko kroga okoli vogala; njena hitrost je pravokotna na zveznico s $P$.

Kolo: hitrosti točk navpičnega premera rastejo linearno od pola navzgor:

```
 vrh   ------->  2v
 os    --->       v
 tla   .          0  (pol)
```

## Drugače: Uporaba v stroki

**Krmiljenje avtomobila.** Pri počasni vožnji v ovinku se kolesa ne smejo drsati vstran, zato mora biti hitrost vsakega kolesa pravokotna na njegovo os. Osi vseh štirih koles se morajo sekati v isti točki, trenutnem polu karoserije. Krmilni mehanizem po Ackermannu zato notranje kolo zasuka bolj kot zunanje.

**Načrtovanje mehanizmov.** Pri štirizgibnih mehanizmih (brisalci, mehanizmi vrat, sklopi podvozja) konstruktorji s poli določijo prenosno razmerje kotnih hitrosti v vsaki legi. Kjer se pol oddalji v neskončnost, je ojnica trenutno v translaciji. Kjer pol pade v zgib ojnice z nihalko, ima ta zgib hitrost nič: nihalka je v skrajni legi in obrne smer. Če bi mehanizem gnali z nihalke, je to mrtva lega, iz katere ga sila na nihalko ne premakne.

**Robotika in biomehanika.** Kolenski sklep nima stalne osi: stegnenica se po golenici kotali in drsi, zato se trenutni pol med upogibom premika. Ortopedi pri vsadkih kolena in proizvajalci opornic posnemajo pot tega pola; v robotiki se po istem načelu računajo hitrosti členov planarnih robotskih rok.

## Drugače: Korak za korakom s številkami

Lestev iz Primera 2 še enkrat, brez pola, le z vektorsko enačbo. Izhodišče v vogalu, $A = (3{,}83;\ 0)$, $B = (0;\ 3{,}21)$ (v metrih), $\vec{v}_A = (1{,}2;\ 0)\,\mathrm{m/s}$, $\vec{v}_B = (0;\ v_{By})$.

1. $\vec{r}_{AB} = (-3{,}83;\ 3{,}21)\,\mathrm{m}$.
2. $\vec{\omega} \times \vec{r}_{AB} = (-3{,}21\,\omega;\ -3{,}83\,\omega)$.
3. Komponenta $x$ enačbe $\vec{v}_B = \vec{v}_A + \vec{\omega} \times \vec{r}_{AB}$: $0 = 1{,}2 - 3{,}21\,\omega$, zato $\omega \approx 0{,}373\,\mathrm{s^{-1}}$ (pozitivna smer).
4. Komponenta $y$: $v_{By} = -3{,}83 \cdot 0{,}373\,\mathrm{m/s} \approx -1{,}43\,\mathrm{m/s}$, navzdol.
5. Isti rezultat kot s polom: pol je le geometrijska bližnjica do iste enačbe.

## Drugače: Bolj natančno

**Polodiji.** Med gibanjem se pol premika. Njegova pot v nepremični ravnini je **nepremična polodija**, pot v ravnini, ki se giblje s telesom, pa **gibljiva polodija**. Ravninsko gibanje je natanko kotaljenje gibljive polodije po nepremični brez drsenja. Pri kolesu sta to obod in tla, pri lestvi pa krog s polmerom $L$ okoli vogala in krog s premerom $L$ nad lestvijo.

**Pospešni pol.** Za $\omega \ne 0$ obstaja tudi točka $Q$ z ničelnim pospeškom, na razdalji $a_A/\sqrt{\alpha^2 + \omega^4}$ od $A$. Pri kolesu iz Naloge 3 je to $1{,}0/\sqrt{4 + 256}\,\mathrm{m} \approx 0{,}062\,\mathrm{m}$ od osi, ne v stični točki.

**Prostorsko gibanje.** Chaslesov izrek v prostoru: vsak trenutni premik togega telesa je vijačno gibanje, vrtenje okoli trenutne osi skupaj s premikom vzdolž nje. Ravninsko gibanje je posebni primer brez premika vzdolž osi.

## Preveri se

? Kateri primer NE spada med ravninska gibanja togega telesa?
- Ojnica v motorju z notranjim zgorevanjem.
~ Vse točke ojnice se gibljejo v vzporednih ravninah, pravokotnih na gred: to je ravninsko gibanje.
- Lestev, ki drsi ob steni.
~ Lestev se giblje v navpični ravnini in vrti okoli osi, pravokotne nanjo: ravninsko gibanje.
+ Vrtavka, ki se vrti in se njena os počasi giblje po stožcu (precesija).
- Kolo, ki se kotali naravnost po cesti.
~ Kolo, ki gre naravnost, je klasični primer ravninskega gibanja: translacija plus vrtenje okoli osi, pravokotne na ravnino kolesa.
> Pri precesiji os vrtenja spreminja smer v prostoru, zato gibanje ni ravninsko; ostali trije primeri imajo os vrtenja ves čas pravokotno na isto ravnino.

? Kolo s polmerom $0{,}30\,\mathrm{m}$ se brez spodrsavanja kotali, os ima hitrost $6{,}0\,\mathrm{m/s}$. Kolikšna je hitrost točke oboda, ki je v višini osi?
- $6{,}0\,\mathrm{m/s}$
~ To je hitrost osi. Točka oboda ima še relativno hitrost vrtenja, pravokotno na hitrost osi.
- $12\,\mathrm{m/s}$
~ To je hitrost vrha, ki je od pola oddaljen $2R$. Točka v višini osi je od pola oddaljena $R\sqrt{2}$.
+ približno $8{,}5\,\mathrm{m/s}$
> Pol je v stični točki, $\omega = 20\,\mathrm{s^{-1}}$, razdalja do pola je $0{,}30\sqrt{2}\,\mathrm{m}$, zato $v = 6{,}0\sqrt{2}\,\mathrm{m/s} \approx 8{,}5\,\mathrm{m/s}$.

? Zakaj je hitrost poljubne točke $B$ telesa pravokotna na zveznico $PB$ s trenutnim polom?
- Ker se telo okoli pola vrti ves čas, kot okoli nepremične osi.
~ Pol se premika; telo se okoli njega vrti le v tem trenutku. Pravokotnost sledi iz izreka o hitrostih, ne iz nepremične osi.
+ Ker je $\vec{v}_P = 0$ in je po izreku o hitrostih $\vec{v}_B = \vec{\omega} \times \vec{r}_{PB}$, kar je pravokotno na $\vec{r}_{PB}$.
- Ker je pospešek pola nič.
~ Pospešek pola v splošnem ni nič (stična točka kolesa), in tudi ne vpliva na smer hitrosti.
> Izrek o hitrostih za točki $P$ in $B$: $\vec{v}_B = \vec{v}_P + \vec{\omega} \times \vec{r}_{PB} = \vec{\omega} \times \vec{r}_{PB}$; vektorski produkt z $\vec{\omega} \perp$ ravnine je pravokoten na $\vec{r}_{PB}$.

? Študent računa pospešek stične točke kotalečega se kolesa: »1. Stična točka je trenutni pol. 2. Telo se v tem trenutku vrti okoli pola. 3. Točka na osi vrtenja ima pospešek nič. 4. Pospešek stične točke je nič.« Kateri korak je napačen?
- Korak 1.
~ Pri kotaljenju brez spodrsavanja ima stična točka hitrost nič, zato je res trenutni pol.
- Korak 2.
~ Za hitrosti je ta trditev pravilna: v tem trenutku so vse hitrosti kot pri vrtenju okoli pola.
+ Korak 3.
- Korak 4.
~ Korak 4 je le posledica prejšnjega; napaka nastane prej.
> Korak 3 velja le za nepremično os. Pol se premika, zato zanj velja enačba pospeškov: stična točka ima pospešek $\omega^2R$ proti osi (navzgor).

? Na fotografiji kolesarja v vožnji so napere zgoraj zabrisane, spodaj ob tleh pa ostre. Zakaj?
+ Ker je pol v stični točki: zgornji del kolesa je od pola najdlje in se giblje najhitreje, spodnji skoraj miruje.
- Ker je kamera spodaj bolje osvetljena.
~ Ostrina pri fiksni osvetlitvi je odvisna od hitrosti točk; ta je ob tleh skoraj nič, na vrhu največja.
- Ker se zgornji del kolesa vrti hitreje kot spodnji.
~ Kolo je togo telo z eno kotno hitrostjo; razlikujejo se obodne hitrosti glede na pol, ne kotne hitrosti delov.
> Hitrost točke je $\omega\,r_P$; ob tleh je $r_P \approx 0$, na vrhu $2R$. Med osvetlitvijo se zgornje napere premaknejo veliko, spodnje skoraj nič.

:::simboli
\vec{v}_A, \vec{v}_B | hitrosti točk $A$ in $B$ | | m/s
v_A, v_B | velikosti hitrosti točk $A$ in $B$ | | m/s
\vec{\omega} | vektor kotne hitrosti telesa | \vec{\omega} = \omega\,\vec{k} | s^{-1} | pravokoten na ravnino gibanja
\omega | kotna hitrost telesa | \omega = \dot{\varphi} | s^{-1} | ena za cel člen
\vec{k} | enotski vektor, pravokoten na ravnino gibanja | | –
\vec{r}_{AB} | vektor od $A$ do $B$ | \vec{r}_{AB} = \vec{r}_B - \vec{r}_A | m
\vec{r}_{AP} | vektor od $A$ do trenutnega pola | \vec{r}_{AP} = \frac{\vec{\omega} \times \vec{v}_A}{\omega^2} | m
\vec{e}_{AB} | enotski vektor v smeri $AB$ | | –
r_{AP} | razdalja točke $A$ od pola | r_{AP} = \frac{v_A}{\omega} | m
r_{PA}, r_{PB} | razdalji točk $A$ in $B$ od pola | | m
r_P | razdalja točke od pola | | m
P | trenutni pol hitrosti | | | točka z ničelno hitrostjo
A, B | točki togega telesa (pri mehanizmu zgib ročice in ojnice ter drsnik) | | |
\vec{a}_A, \vec{a}_B | pospeška točk $A$ in $B$ | | m/s^2
a_B | pospešek bata (drsnika) | | m/s^2
\vec{\alpha} | vektor kotnega pospeška | \vec{\alpha} = \alpha\,\vec{k} | s^{-2}
\vec{\alpha}_2 | kotni pospešek ojnice | | s^{-2}
\alpha_2 | kotni pospešek ojnice | | s^{-2}
v_S | hitrost osi (središča) kolesa | v_S = \omega R | m/s | kotaljenje brez spodrsavanja
R | polmer kolesa ali valja | | m
v | hitrost točke | v = \omega\,r_P | m/s
r | dolžina ročice | | m
\omega_1 | kotna hitrost ročice | | s^{-1}
\omega_2 | kotna hitrost ojnice | | s^{-1}
v_{sp}, v_{zg} | hitrosti spodnje in zgornje deske | | m/s
:::
