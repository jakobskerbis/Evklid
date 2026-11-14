---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najbližja zvezda za Soncem, Proksima Kentavra, je od nas oddaljena $4{,}24$ svetlobnega leta. Svetloba potrebuje do nje več kot štiri leta. Pa vendar bi potnica na ladji s hitrostjo $0{,}98\,c$ na svoji uri ob prihodu prebrala le dobrih deset mesecev.

Na prvi pogled je to nemogoče. Če prepotuješ $4{,}24$ svetlobnega leta v $0{,}86$ leta, si šel skoraj petkrat hitreje od svetlobe. Nič pa ne gre hitreje od svetlobe. Nekje se torej skriva napaka v našem vsakdanjem razmišljanju o času in razdalji.

Napaka je v predpostavki, da imajo vsi opazovalci isti čas in isti zemljevid. Einstein je leta 1905 izhajal iz dveh načel: fizikalni zakoni so enaki v vseh inercialnih sistemih, in hitrost svetlobe v vakuumu je za vse opazovalce enaka, $c \approx 3{,}00 \cdot 10^8\,\mathrm{m/s}$. Iz njiju sledijo Lorentzove transformacije, relativistična energija in gibalna količina. Brez njih ne delujejo pospeševalniki, satelitska navigacija ne bi bila natančna, in tudi naslednje teme o fotonih in atomih bi ostale nerazumljive.

## Razlaga

**1. Račun z Zemlje.** Potovanje do Proksime najprej rešimo z zemeljskega stališča. Razdalje merimo v svetlobnih letih, čas v letih, zato je $c = 1$ svetlobno leto na leto. Ladja z $v = 0{,}98\,c$ potrebuje

$$t = \frac{4{,}24}{0{,}98} \approx 4{,}33$$

let. Zemeljske ure torej pokažejo $4{,}33$ leta.

**2. Svetlobna ura na ladji.** Kaj pokaže ura na ladji? Zamislimo si najpreprostejšo uro: svetlobni blisk potuje med dvema zrcaloma, razmaknjenima za $d$, pravokotno na smer gibanja. Za potnico gre blisk naravnost gor in dol. En »tik« traja $\Delta\tau = 2d/c$.

Z Zemlje pa se zrcali med potjo bliska premakneta. Blisk riše cikcak, poševno črto, ki je daljša od $2d$. Ker je hitrost svetlobe tudi za zemeljskega opazovalca $c$, mu tik traja dlje. V pravokotnem trikotniku s katetama $d$ in $v\Delta t/2$ ter hipotenuzo $c\Delta t/2$ velja Pitagorov izrek. Ko vanj vstavimo $d = c\Delta\tau/2$ in izrazimo $\Delta t$, dobimo

$$\Delta t = \gamma\,\Delta\tau$$

$$\gamma = \frac{1}{\sqrt{1 - v^2/c^2}}$$

Začetek in konec tika sta dva dogodka, ki se za potnico zgodita na istem mestu. Čas med njima, ki ga kaže ura, prisotna pri obeh, je **lastni čas** $\Delta\tau$. Vsak drug opazovalec izmeri daljši čas. Temu pravimo **podaljšanje časa** (dilatacija). Faktor $\gamma$ je pri vsakdanjih hitrostih skoraj točno $1$:

| $v/c$ | $\gamma$ | $1/\gamma$ |
|---|---|---|
| $0{,}1$ | $1{,}005$ | $0{,}995$ |
| $0{,}6$ | $1{,}25$ | $0{,}80$ |
| $0{,}8$ | $1{,}667$ | $0{,}60$ |
| $0{,}98$ | $5{,}03$ | $0{,}199$ |

Pri $0{,}98\,c$ je $\gamma \approx 5{,}03$, zato potnica izmeri $\tau \approx 4{,}33 / 5{,}03 \approx 0{,}861$ leta. To je tistih deset mesecev.

:::premisli
Potnica na ladji se ima za mirujočo. Mimo nje drvita Zemlja in Proksima. Kako si ona razloži, da je pot trajala le $0{,}86$ leta, ne da bi kaj šlo hitreje od svetlobe?
---
Za njo razdalja med Zemljo in Proksimo ni $4{,}24$ svetlobnega leta, ampak je skrčena za faktor $\gamma$: približno $0{,}84$ svetlobnega leta. Ta krajša razdalja pri $0{,}98\,c$ mine v $0{,}86$ leta.
:::

**3. Krčenje dolžin.** Razdalja, izmerjena v sistemu, v katerem začetek in konec mirujeta, je **lastna dolžina** $L_0$. V sistemu, ki se giblje vzdolž te razdalje, je krajša:

$$L = \frac{L_0}{\gamma}$$

Za potnico je $L = 4{,}24 / 5{,}03 \approx 0{,}843$ svetlobnega leta. Pri $0{,}98\,c$ to res mine v $0{,}843 / 0{,}98 \approx 0{,}86$ leta. Oba opazovalca se strinjata o tem, kar ob prihodu pokaže ura potnice. Ne strinjata pa se o razdalji in o času na poti. Prečne razsežnosti se ne skrčijo.

**4. Splošno: Lorentzove transformacije.** Iz enega primera zdaj naredimo pravilo. **Dogodek** je nekaj, kar se zgodi na določenem mestu ob določenem času: zapišemo ga kot točko na zemljevidu z žigom časa, $(x, t)$. Sistem $S$ je Zemlja, sistem $S'$ je ladja, ki se giblje s hitrostjo $v$ v smeri $+x$. Ob $t = t' = 0$ sta izhodišči na istem mestu. Koordinate istega dogodka v obeh sistemih povezujejo **Lorentzove transformacije**:

$$x' = \gamma\,(x - v t)$$

$$t' = \gamma\left(t - \frac{v x}{c^2}\right)$$

Prečni koordinati ostaneta enaki, $y' = y$ in $z' = z$. Obratne enačbe dobiš z zamenjavo $v \to -v$.

Preverimo na našem primeru. Dogodek »ladja prispe« ima v $S$ koordinati $x = 4{,}24$ in $t = 4{,}3265$. Tedaj je $x' = 5{,}025 \cdot (4{,}24 - 0{,}98 \cdot 4{,}3265) \approx 0$, kot mora biti, saj potnica sedi v izhodišču svojega sistema. In $t' = 5{,}025 \cdot (4{,}3265 - 0{,}98 \cdot 4{,}24) \approx 0{,}861$ leta, ista vrednost kot zgoraj.

Pri majhnih hitrostih je $\gamma \approx 1$ in člen $vx/c^2$ zanemarljiv. Ostane $x' = x - vt$ in $t' = t$, kar je Galilejeva transformacija iz klasične mehanike.

**5. Sočasnost je relativna.** Člen $vx/c^2$ ima pomembno posledico. Dva dogodka na različnih mestih, ki sta v $S$ sočasna ($\Delta t = 0$), v $S'$ nista: $\Delta t' = -\gamma\,v\,\Delta x / c^2$. Zemeljske ure in ure na Proksimi so za Zemljo usklajene, za potnico pa ne.

**6. Gibalna količina in energija.** Klasična gibalna količina $mv$ se pri trkih hitrih delcev ne ohranja v vseh sistemih hkrati. Ohranja pa se **relativistična gibalna količina**

$$p = \gamma\,m\,v$$

in **celotna energija**

$$E = \gamma\,m\,c^2$$

Tu je $m$ masa delca, enaka v vseh sistemih. Mirujoč delec ima **mirovno energijo** $E_0 = m c^2$. **Kinetična energija** je presežek nad njo:

$$E_k = (\gamma - 1)\,m\,c^2$$

Pri $v \ll c$ ta izraz preide v znani $\tfrac{1}{2} m v^2$. Energija, gibalna količina in masa so povezane z enačbo, ki ne vsebuje hitrosti:

$$E^2 = (p c)^2 + (m c^2)^2$$

Za delec brez mase, na primer foton, sledi $E = p c$. V fiziki delcev energijo merimo v $\mathrm{MeV}$, gibalno količino v $\mathrm{MeV}/c$; elektron ima $m c^2 = 0{,}511\,\mathrm{MeV}$, proton $938{,}3\,\mathrm{MeV}$.

:::premisli
Zakaj delca z maso nikoli ne moremo pospešiti do hitrosti svetlobe, četudi ga pospešujemo poljubno dolgo?
---
Ko gre $v$ proti $c$, gre $1 - v^2/c^2$ proti nič in $\gamma$ raste čez vse meje. Kinetična energija $(\gamma - 1)\,mc^2$ bi morala postati neskončna, zato vsak dodatni joule hitrost poveča le še malo.
:::

## Rešeni primeri

### Primer 1: hiter elektron

Elektron se giblje s hitrostjo $0{,}8\,c$. Izračunaj njegovo celotno energijo, kinetično energijo in gibalno količino. Preveri z zvezo med $E$ in $p$.

**Podatki:** $v = 0{,}8\,c$, $m c^2 = 0{,}511\,\mathrm{MeV}$
**Iščemo:** $E$, $E_k$ in $p$

:::formula
$\gamma = \dfrac{1}{\sqrt{1 - v^2/c^2}}$, $\quad E = \gamma m c^2$, $\quad E_k = (\gamma - 1) m c^2$, $\quad p c = \gamma m c^2 \cdot \dfrac{v}{c}$
:::

**Rešitev:**

1. $\gamma = 1 / \sqrt{1 - 0{,}64} = 1 / 0{,}6 \approx 1{,}667$.
2. Celotna energija: $E = 1{,}667 \cdot 0{,}511 \approx 0{,}852\,\mathrm{MeV}$.
3. Kinetična energija je razlika do mirovne: $E_k = 0{,}852 - 0{,}511 = 0{,}341\,\mathrm{MeV}$.
4. Gibalna količina: $p c = 0{,}8517 \cdot 0{,}8 \approx 0{,}681\,\mathrm{MeV}$, torej $p \approx 0{,}681\,\mathrm{MeV}/c$.
5. Preverba: $\sqrt{0{,}681^2 + 0{,}511^2} \approx 0{,}851$, kar se do zaokrožitve ujema z $E$.
6. Odgovor: $E \approx 0{,}852\,\mathrm{MeV}$, $E_k \approx 0{,}341\,\mathrm{MeV}$, $p \approx 0{,}681\,\mathrm{MeV}/c$. Klasični izraz $\tfrac12 m v^2$ bi dal le $0{,}16\,\mathrm{MeV}$.

### Primer 2: dva svetilnika na zvezdni karti

Na zvezdni karti zemeljskega sistema stojita dva svetilnika: A na Zemlji ($x = 0$) in B na postaji, oddaljeni $3$ svetlobna leta ($x = 3$). A zasveti ob $t = 0$, B ob $t = 1$ leto. Mimo Zemlje ob $t = 0$ v smeri postaje prileti ladja s hitrostjo $0{,}6\,c$. Kdaj in kje zasveti B v sistemu ladje?

**Podatki:** $x_A = 0$, $t_A = 0$, $x_B = 3$ sv. leta, $t_B = 1$ leto, $v = 0{,}6\,c$
**Iščemo:** $x'_B$ in $t'_B$

:::formula
$x' = \gamma\,(x - v t)$, $\quad t' = \gamma\left(t - \dfrac{v x}{c^2}\right)$
:::

**Rešitev:**

1. Pri $v = 0{,}6\,c$ je $\gamma = 1 / \sqrt{1 - 0{,}36} = 1{,}25$.
2. V enotah, kjer je $c = 1$: $x'_B = 1{,}25 \cdot (3 - 0{,}6 \cdot 1) = 3$ svetlobna leta.
3. $t'_B = 1{,}25 \cdot (1 - 0{,}6 \cdot 3) = -1$ leto.
4. Dogodek A ima v sistemu ladje $x'_A = 0$ in $t'_A = 0$, ker se izhodišči ujemata.
5. Za ladjo B zasveti eno leto *pred* A. Vrstni red se je obrnil, ker je razdalja $3$ svetlobna leta večja od poti, ki jo svetloba opravi v $1$ letu. A zato ne more povzročiti B, in noben opazovalec ne vidi kršitve vzročnosti.
6. Odgovor: v sistemu ladje B zasveti ob $t'_B = -1$ leto na mestu $x'_B = 3$ svetlobna leta, torej pred A.

### Primer 3: kako hitro do Proksime v enem letu?

Potnica želi priti do Proksime ($4{,}24$ svetlobnega leta) tako, da na njeni uri mine natanko $1$ leto. S kolikšno stalno hitrostjo mora leteti? Koliko kinetične energije potrebuje vsak kilogram ladje?

**Podatki:** $L_0 = 4{,}24$ sv. leta, $\tau = 1$ leto, $c = 3{,}00 \cdot 10^8\,\mathrm{m/s}$, $m = 1\,\mathrm{kg}$
**Iščemo:** hitrost $v$ in kinetično energijo $E_k$ na kilogram

:::formula
$\tau = \dfrac{L_0}{\gamma v}$, $\quad \gamma^2 = 1 + \left(\dfrac{\gamma v}{c}\right)^2$, $\quad E_k = (\gamma - 1)\,m c^2$
:::

**Rešitev:**

1. Za potnico je pot skrčena na $L_0/\gamma$, zato $\tau = L_0 / (\gamma v)$. Od tod $\gamma v / c = 4{,}24$.
2. Iz definicije $\gamma$ velja $\gamma^2 (1 - v^2/c^2) = 1$, torej $\gamma^2 = 1 + (\gamma v/c)^2$. Dobimo $\gamma = \sqrt{1 + 4{,}24^2} \approx 4{,}356$.
3. Hitrost: $v/c = 4{,}24 / 4{,}356 \approx 0{,}9733$. Ladja mora leteti s $97{,}3\,\%$ svetlobne hitrosti.
4. Za energijo uporabi $\gamma - 1 \approx 3{,}356$ in $c^2 = 9{,}00 \cdot 10^{16}\,\mathrm{m^2/s^2}$. Izračunaj sam, nato preveri:

:::premisli
Koliko je $E_k = (\gamma - 1)\,m c^2$ za $m = 1\,\mathrm{kg}$?
---
$E_k \approx 3{,}356 \cdot 9{,}00 \cdot 10^{16}\,\mathrm{J} \approx 3{,}02 \cdot 10^{17}\,\mathrm{J}$ na kilogram. To je približno toliko, kot ves svet porabi elektrike v enem dnevu, in to za en sam kilogram.
:::

## Pogoste napake

- **Napačna ura je lastna.** Kdor potovalni čas potnice dobi kot $\gamma t$, je zamenjal vlogi. Lastni čas meri ura, ob kateri se oba dogodka zgodita na istem mestu, in je vedno *najkrajši*: $\tau = t/\gamma$.
- **Krčenje v vseh smereh ali napačni dolžini.** Skrči se le razsežnost vzdolž gibanja, in le v sistemu, v katerem se predmet giblje. Lastna dolžina $L_0$ je vedno najdaljša.
- **Sočasnost velja za vse.** Kdor v $t' = \gamma(t - vx/c^2)$ izpusti člen $vx/c^2$, dobi $t' = \gamma t$ in nikoli ne opazi obrnjenega vrstnega reda kot v primeru 2.
- **Klasična kinetična energija pri veliki hitrosti.** $\tfrac12 mv^2$ ali $\tfrac12 \gamma m v^2$ sta pri $v$ blizu $c$ napačna. Pravilno je $E_k = (\gamma - 1)mc^2$; enako velja za $p = \gamma mv$ namesto $mv$.

## Povzetek

- Načeli: fizikalni zakoni so enaki v vseh inercialnih sistemih, hitrost svetlobe je za vse enaka.
- $\gamma = 1/\sqrt{1 - v^2/c^2}$; podaljšanje časa $\Delta t = \gamma\,\Delta\tau$, krčenje dolžin $L = L_0/\gamma$.
- Lorentzove transformacije: $x' = \gamma(x - vt)$, $t' = \gamma(t - vx/c^2)$; pri $v \ll c$ preideta v Galilejevo.
- Sočasnost je relativna; dogodkom, ki se ne morejo vzročno povezati, se lahko vrstni red obrne.
- $p = \gamma m v$, $E = \gamma m c^2$, $E_0 = mc^2$, $E_k = (\gamma - 1)mc^2$, $E^2 = (pc)^2 + (mc^2)^2$; za foton $E = pc$.

## Drugače: Z analogijo

Vzemi dva zemljevida istega mesta. Na prvem os $y$ kaže proti severu, drugi je zasukan za $30°$. Isti vogal ima na kartah različni koordinati, razdalja med dvema vogaloma $\sqrt{\Delta x^2 + \Delta y^2}$ pa je na obeh enaka. Zasuk premeša $x$ in $y$, razdaljo pa ohrani.

Lorentzova transformacija je podoben »zasuk« med prostorom in časom. Premeša $x$ in $t$, ohrani pa **interval** $c^2\Delta t^2 - \Delta x^2$. Za potovanje do Proksime v sistemu Zemlje velja $4{,}3265^2 - 4{,}24^2 \approx 0{,}741$, koren pa je $0{,}861$: natanko lastni čas potnice, ki ima v svojem sistemu $\Delta x' = 0$.

Analogija ima mejo: v intervalu je minus, ne plus. Zato je »zasuk« hiperboličen. Časovna os ladje se nagne proti svetlobni črti $x = ct$, nikoli pa je ne preseže.

## Drugače: Bolj natančno

**Izpeljava.** Zahtevamo linearno zvezo $x' = \gamma(x - vt)$, saj mora izhodišče $S'$ ($x' = 0$) ustrezati $x = vt$. Po načelu relativnosti mora obratna zveza imeti enako obliko: $x = \gamma(x' + vt')$. Svetlobni blisk iz skupnega izhodišča ima v obeh sistemih hitrost $c$: $x = ct$ in $x' = ct'$. Vstavimo:

$$c\,t' = \gamma\,(c - v)\,t$$

$$c\,t = \gamma\,(c + v)\,t'$$

Zmnožek obeh enačb da $c^2 = \gamma^2 (c^2 - v^2)$, torej $\gamma = 1/\sqrt{1 - v^2/c^2}$. Ko iz obeh linearnih zvez izločimo $x'$, dobimo $t' = \gamma(t - vx/c^2)$.

**Štirivektorji.** Par $(ct, x)$ je štirivektor. Enako se transformira par $(E/c,\,p)$:

$$E' = \gamma\,(E - v p)$$

$$p' = \gamma\left(p - \frac{v E}{c^2}\right)$$

Invarianta je $E^2 - (pc)^2 = (mc^2)^2$, analog intervala. Zato je masa delca enaka v vseh sistemih.

**Klasična limita.** Za $v \ll c$ razvijemo $\gamma \approx 1 + \tfrac12 v^2/c^2$. Tedaj je $E_k = (\gamma - 1)mc^2 \approx \tfrac12 mv^2$ in $p \approx mv$.

## Preveri se

? Potnica s svojo uro izmeri čas od odhoda z Zemlje do prihoda na Proksimo. Zakaj je to lastni čas?
- Ker je izmerjen z uro, ki miruje glede na Zemljo in Proksimo.
~ Zemeljski sistem odhod izmeri z uro na Zemlji, prihod z drugo uro na Proksimi; lastni čas kaže le ura potnice.
+ Ker se odhod in prihod zgodita na istem mestu glede na njeno uro.
- Ker je to najdaljši čas, ki ga izmeri kateri koli opazovalec.
~ Obratno: lastni čas je najkrajši, drugi opazovalci izmerijo $\gamma$-krat daljšega.
> Lastni čas meri ura, ob kateri se oba dogodka zgodita; potnica je pri obeh zraven.

? Razvrsti po faktorju $\gamma$ od največjega do najmanjšega: elektron pri $0{,}9\,c$, proton pri $0{,}5\,c$, mion pri $0{,}99\,c$.
- proton, mion, elektron
~ $\gamma$ ni odvisen od mase, le od hitrosti. Težji proton nima zato večjega $\gamma$.
+ mion, elektron, proton
- elektron, mion, proton
~ Najlažji delec nima nujno največjega $\gamma$; odloči hitrost, mion je najhitrejši.
> $\gamma$ je odvisen samo od $v$: $7{,}09$ (mion), $2{,}29$ (elektron), $1{,}15$ (proton).

? Kaj se zgodi z gibalno količino delca, če njegovo hitrost povečamo z $0{,}4\,c$ na $0{,}8\,c$?
- Podvoji se.
~ To bi veljalo za klasično $p = mv$. Relativistično se poveča tudi $\gamma$.
- Poveča se za manj kot dvakrat, ker se delec upira pospeševanju.
~ Upiranje se kaže kot rast $\gamma$, ki $p$ poveča še bolj, ne manj.
+ Poveča se približno trikrat.
> $p = \gamma m v$: $\gamma$ zraste z $1{,}09$ na $1{,}67$, $v$ se podvoji, skupaj $\approx 3{,}06$-krat.

? Proton ($m c^2 = 938{,}3\,\mathrm{MeV}$) se giblje s hitrostjo $0{,}6\,c$. Kolikšna je njegova kinetična energija?
- $168{,}9\,\mathrm{MeV}$
~ To je klasični $\tfrac12 m v^2$, ki pri $0{,}6\,c$ ni več dober približek.
+ $234{,}6\,\mathrm{MeV}$
- $1172{,}9\,\mathrm{MeV}$
~ To je celotna energija $\gamma m c^2$; mirovne energije nisi odštel.
> $\gamma = 1{,}25$, $E_k = (\gamma - 1)\,mc^2 = 0{,}25 \cdot 938{,}3\,\mathrm{MeV} \approx 234{,}6\,\mathrm{MeV}$.

? Ladja leti mimo Zemlje z $0{,}8\,c$. Dogodek ima v zemeljskem sistemu $x = 2$ svetlobni leti in $t = 5$ let. Ob katerem času $t'$ se zgodi v sistemu ladje?
- $8{,}33$ leta
~ To je $\gamma t$: izpustil si člen $v x / c^2$, kot da bi bila sočasnost absolutna.
- $3{,}00$ leta
~ To je $t/\gamma$, formula za lastni čas, a dogodek ni na mestu ladje.
+ $5{,}67$ leta
> $t' = \gamma\,(t - v x/c^2) = 1{,}667 \cdot (5 - 0{,}8 \cdot 2) \approx 5{,}67$ leta.

:::simboli
x, x' | koordinata dogodka v sistemu Zemlje oz. ladje | x' = \gamma (x - v t) | m ali sv. leto |
t, t' | čas dogodka v sistemu Zemlje oz. ladje | t' = \gamma \left(t - \frac{v x}{c^2}\right) | s ali leto |
v | hitrost ladje oz. delca | | m/s | pogosto kot delež $c$
c | hitrost svetlobe v vakuumu | | m/s | $3{,}00 \cdot 10^8\,\mathrm{m/s}$, enaka za vse
\gamma | Lorentzov faktor | \gamma = \frac{1}{\sqrt{1 - v^2/c^2}} | – | vedno vsaj 1
\Delta\tau | lastni čas (ura, ob kateri se oba dogodka zgodita) | | s | najkrajši izmerjeni čas
\tau | lastni čas potnice | \tau = \frac{t}{\gamma} | leto |
\Delta t | podaljšan čas v drugem sistemu | \Delta t = \gamma \Delta\tau | s |
L_0 | lastna dolžina | | m ali sv. leto | najdaljša izmerjena dolžina
L | skrčena dolžina | L = \frac{L_0}{\gamma} | m ali sv. leto |
m | masa delca | | kg | enaka v vseh sistemih
p, p' | relativistična gibalna količina | p = \gamma m v | kg\,m/s ali MeV/c |
E, E' | celotna energija | E = \gamma m c^2 | J ali MeV |
E_0 | mirovna energija | E_0 = m c^2 | J ali MeV |
E_k | kinetična energija | E_k = (\gamma - 1) m c^2 | J ali MeV |
:::
