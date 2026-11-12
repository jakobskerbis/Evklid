---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na nit priveži ključ in ga obesi tako, da je od mesta, kjer držiš nit, do sredine ključa $25\,\mathrm{cm}$. Odmakni ga malo in s telefonsko štoparico izmeri čas desetih nihajev. Dobil boš okoli $10\,\mathrm{s}$, torej en nihaj traja približno $1\,\mathrm{s}$. Zdaj nit podaljšaj na $1\,\mathrm{m}$, štirikrat toliko. Pred meritvijo ugani: bo deset nihajev trajalo $40\,\mathrm{s}$? Izmeriš okoli $20\,\mathrm{s}$. Nihalo je štirikrat daljše, nihaj pa le dvakrat daljši.

Na maturi so naloge iz vseh štirih letnikov pomešane: nihalo, gravitacija, električni krog, zvezde, fotoni. Veliko jih sprašuje prav to, kar si pravkar izmeril: *kolikokrat* se nekaj spremeni, če se druga količina spremeni za nek faktor. Astronavt na Luni, planet dlje od Sonca, dvakrat bolj vroča zvezda. Takšne naloge rešiš v dveh vrsticah, če poznaš eno pravilo. Do njega prideš sam, iz nekaj primerov.

## Razlaga

Začnimo z nihalom. Meritve, ki jih dobiš doma (zaokrožene), so v tabeli:

| Dolžina $l$ | $l$ v primerjavi s prvo | Nihajni čas $T$ | $T$ v primerjavi s prvim |
|---|---|---|---|
| $0{,}25\,\mathrm{m}$ | $1$-krat | $1{,}0\,\mathrm{s}$ | $1$-krat |
| $1{,}00\,\mathrm{m}$ | $4$-krat | $2{,}0\,\mathrm{s}$ | $2$-krat |
| $2{,}25\,\mathrm{m}$ | $9$-krat | $3{,}0\,\mathrm{s}$ | $3$-krat |

Štirikrat daljša nit da dvakrat daljši nihaj, devetkrat daljša trikrat daljši. Nihajni čas raste s *korenom* dolžine. To se sklada z enačbo za nitno nihalo iz poglavja o nihanju, $T = 2\pi\sqrt{l/g}$: koren je že v njej.

:::premisli
Kolikšen nihajni čas napoveš za nit, dolgo $4\,\mathrm{m}$? Sklepaj iz tabele, brez enačbe.
---
$4\,\mathrm{m}$ je $16$-krat več kot $0{,}25\,\mathrm{m}$, $\sqrt{16} = 4$, zato je nihajni čas štirikrat daljši: približno $4\,\mathrm{s}$.
:::

Isti vzorec se skriva v vesolju. Poglej štiri zakone, ki si jih spoznal v različnih letnikih, in opazuj, kaj se zgodi, ko količino na desni (označimo jo z $x$) podvojiš ali početveriš:

| Zakon | Kako je odvisen | $x$ dvakrat | $x$ štirikrat |
|---|---|---|---|
| nihalo | $T \propto l^{1/2}$ | $1{,}41$-krat | $2$-krat |
| sila teže, $r$ od središča | $F \propto r^{-2}$ | $\tfrac14$ | $\tfrac{1}{16}$ |
| Stefanov zakon | $j \propto T^{4}$ | $16$-krat | $256$-krat |
| 3. Keplerjev zakon | $T \propto a^{3/2}$ | $2{,}83$-krat | $8$-krat |

Znak $\propto$ beri »je sorazmeren z«. Opazi dve stvari. Prvič: kolikokrat se spremeni rezultat, določa samo **potenca**: $2^{-2} = \tfrac14$, $2^{4} = 16$, $4^{3/2} = 8$. Drugič: v nobenem stolpcu ne potrebuješ $G$, $\sigma$, $\pi$ ali mase Sonca. Konstante so pred podvojitvijo in po njej enake, zato se pri deljenju pokrajšajo. (Pozor: v Stefanovem zakonu je $T$ temperatura, drugod čas.)

To je **metoda razmerij**. Če je količina $y$ sorazmerna s potenco $x^n$, velja:

$$\frac{y_2}{y_1} = \left(\frac{x_2}{x_1}\right)^{n}$$

Potenca je lahko negativna (obratna sorazmernost, sila teže) ali ulomek (koren, nihalo). Če je $y$ odvisen od več količin, se razmerja zmnožijo. Pri izsevu zvezde $L = 4\pi R^2 \sigma T^4$ to pomeni:

$$\frac{L_2}{L_1} = \left(\frac{R_2}{R_1}\right)^{2} \cdot \left(\frac{T_2}{T_1}\right)^{4}$$

:::premisli
Za planete okoli Sonca smemo iz $T^2 = a^3$ (v letih in a.e.) sklepati brez $G$ in mase Sonca. Zakaj tega ne smemo narediti, ko primerjamo Zemljo z Jupitrovo luno?
---
Pokrajša se le tisto, kar je v obeh primerih enako. Konstanta $\dfrac{4\pi^2}{GM}$ vsebuje maso osrednjega telesa, Jupiter pa ima drugačno maso kot Sonce. Razmerje bi moralo vsebovati tudi $\dfrac{M_\mathrm{J}}{M_\mathrm{S}}$.
:::

Pri vsaki maturitetni nalogi ti pomaga isti red dela:

1. **Skica in podatki.** Vse pretvori v osnovne enote: $\mathrm{km}$ v $\mathrm{m}$, $\mathrm{^\circ C}$ v $\mathrm{K}$, $\mathrm{mA}$ v $\mathrm{A}$, $\mathrm{eV}$ v $\mathrm{J}$.
2. **Kateri zakon.** Vprašaj se, iz katerega poglavja je pojav: gibanje, sile, energija, elektrika, valovanje, atom, jedro, vesolje.
3. **Primerjava ali absolutna vrednost?** Če naloga reče »kolikokrat«, »če podvojimo« ali primerja dve telesi, uporabi metodo razmerij.
4. **Računaj simbolno, nato s števili.** Enote nesi s seboj.
5. **Preveri red velikosti.** Nihaj, dolg minuto, ali zvezda, hladnejša od Zemlje, je znak napake.

## Rešeni primeri

### Primer 1: koliko »tehta« astronavt nad Zemljo

Astronavt z maso $80\,\mathrm{kg}$ je na površju Zemlje. Kolikšna je sila teže nanj na višini, ki je enaka dvema polmeroma Zemlje? Na površju je $g = 9{,}81\,\mathrm{m/s^2}$.

**Podatki:** $m = 80\,\mathrm{kg}$, $g = 9{,}81\,\mathrm{m/s^2}$, višina $h = 2R_Z$
**Iščemo:** silo teže $F_2$ na tej višini

:::formula
$F \propto r^{-2}$, torej $\dfrac{F_2}{F_1} = \left(\dfrac{r_1}{r_2}\right)^2$, kjer je $r$ razdalja od **središča** Zemlje
:::

**Rešitev:**

1. Na površju: $F_1 = m g = 80 \cdot 9{,}81 = 784{,}8$, torej $F_1 \approx 785\,\mathrm{N}$.
2. Razdalja od središča: $r_1 = R_Z$, $r_2 = R_Z + 2R_Z = 3R_Z$. Višino prištejemo polmeru, ker gravitacijski zakon meri razdaljo od središča.
3. Razmerje: $\dfrac{F_2}{F_1} = \left(\dfrac{1}{3}\right)^2 = \dfrac{1}{9}$.
4. $F_2 = \dfrac{784{,}8\,\mathrm{N}}{9} \approx 87{,}2\,\mathrm{N}$.
5. Odgovor: sila teže je približno $87\,\mathrm{N}$, devetkrat manjša kot na površju, a še zdaleč ne nič.

### Primer 2: nihalo na Luni

Nitno nihalo z dolžino $1{,}00\,\mathrm{m}$ ima na Zemlji, kjer je $g_Z = 9{,}81\,\mathrm{m/s^2}$, nihajni čas $2{,}01\,\mathrm{s}$. Astronavt ga prinese na Luno, kjer je $g_L = 1{,}62\,\mathrm{m/s^2}$. Kolikšen je tam nihajni čas?

**Podatki:** $l = 1{,}00\,\mathrm{m}$, $T_Z = 2{,}01\,\mathrm{s}$, $g_Z = 9{,}81\,\mathrm{m/s^2}$, $g_L = 1{,}62\,\mathrm{m/s^2}$
**Iščemo:** nihajni čas $T_L$ na Luni

:::formula
$T = 2\pi\sqrt{\dfrac{l}{g}}$, torej $T \propto g^{-1/2}$ in $\dfrac{T_L}{T_Z} = \sqrt{\dfrac{g_Z}{g_L}}$
:::

**Rešitev:**

1. Dolžina je ista, zato se $l$ in $2\pi$ pokrajšata; ostane le odvisnost od $g$.
2. Potenca je $-\tfrac12$: manjši $g$ pomeni *daljši* nihaj, zato je $g_Z$ v števcu.
3. $\dfrac{g_Z}{g_L} = \dfrac{9{,}81}{1{,}62} \approx 6{,}06$ in $\sqrt{6{,}06} \approx 2{,}46$.
4. $T_L = 2{,}01\,\mathrm{s} \cdot 2{,}46 \approx 4{,}94\,\mathrm{s}$.
5. Odgovor: na Luni nihalo zaniha enkrat v približno $4{,}9\,\mathrm{s}$, dvakrat in pol počasneje kot na Zemlji.

### Primer 3: kje bi bilo na planetu toplo kot na Zemlji

Zvezda ima dvakrat višjo površinsko temperaturo kot Sonce, a le pol tolikšen polmer. Na kolikšni razdalji od nje bi planet dobil enako gostoto energijskega toka, kot jo Zemlja dobi od Sonca na razdalji $1\,\mathrm{a.e.}$?

**Podatki:** $T_\mathrm{z} = 2\,T_S$, $R_\mathrm{z} = \tfrac12 R_S$, $d_Z = 1\,\mathrm{a.e.}$, gostota toka $j$ enaka kot pri Zemlji
**Iščemo:** izsev $L_\mathrm{z}$ v primerjavi s Soncem, nato razdaljo $d$

:::formula
$L = 4\pi R^2 \sigma T^4$ in $j = \dfrac{L}{4\pi d^2}$
:::

**Rešitev:**

1. Razmerje izsevov: $\dfrac{L_\mathrm{z}}{L_S} = \left(\tfrac12\right)^2 \cdot 2^4 = \tfrac14 \cdot 16 = 4$. Manjši polmer izsev zmanjša, višja temperatura ga močno poveča.
2. Gostota toka bo enaka, če je $\dfrac{L}{d^2}$ enak kot pri Soncu in Zemlji: $\dfrac{4\,L_S}{d^2} = \dfrac{L_S}{(1\,\mathrm{a.e.})^2}$.
3. Iz tega $d^2 = 4\,(\mathrm{a.e.})^2$, torej $d = 2\,\mathrm{a.e.}$
4. Odgovor: zvezda seva štirikrat več kot Sonce, zato bi moral biti planet dvakrat dlje, $2\,\mathrm{a.e.}$

### Primer 4 – zdaj ti: komet z obhodnim časom 64 let

Komet obkroži Sonce v $64$ letih. Kolikšna je velika polos njegove tirnice?

**Podatki:** $T = 64\,\mathrm{let}$, osrednje telo je Sonce
**Iščemo:** veliko polos $a$ v a.e.

:::formula
$T^2 = a^3$ (v letih in a.e.), torej $a = T^{2/3}$
:::

**Rešitev:**

1. Obrnemo zakon: $a^3 = T^2$, zato najprej kvadriramo, nato vzamemo kubični koren.
2. $T^2 = 64^2 = 4096$.
3. Izračunaj sam $a = \sqrt[3]{4096}$ in preveri:

:::premisli
Kolikšna je velika polos?
---
$a = 16\,\mathrm{a.e.}$, ker je $16^3 = 4096$. Komet ima polos šestnajstkrat večjo kot Zemlja, obhodni čas pa $64$-krat daljši, ne $16$-krat in ne $4096$-krat.
:::

## Pogoste napake

- **Linearno sklepanje.** »Dvakrat daljša nit, dvakrat daljši nihaj« zveni naravno, a velja le pri potenci $n = 1$. Najprej poišči potenco v zakonu, šele nato sklepaj.
- **Obrnjeno razmerje.** Pri $T \propto g^{-1/2}$ učenec pomnoži z $\sqrt{1{,}62/9{,}81}$ in dobi, da nihalo na Luni niha hitreje ($0{,}82\,\mathrm{s}$). Negativna potenca pomeni: večji $g$, krajši čas. Preveri smer s premislekom, preden računaš.
- **Celzijeve stopinje v razmerju.** Pri Stefanovem zakonu $\dfrac{60\,\mathrm{^\circ C}}{30\,\mathrm{^\circ C}} = 2$ ne pomeni $16$-krat več sevanja. Ničla Celzijeve lestvice ni prava ničla, zato razmerje nima pomena. V kelvinih je $\left(\tfrac{333}{303}\right)^4 \approx 1{,}46$.
- **Višina namesto razdalje od središča.** Na višini $h = R_Z$ je $r = 2R_Z$, zato je sila teže četrtina, ne nič in ne polovica. Gravitacijski zakon vedno meri od središča.
- **Napačen obrat potence.** Iz $T^2 = a^3$ sledi $a = T^{2/3}$, ne $T^{3/2}$ in ne $T^{1/3}$. Preveri tako, da rezultat vstaviš nazaj v prvotno enačbo.

## Povzetek

- Če je $y \propto x^n$, velja $\dfrac{y_2}{y_1} = \left(\dfrac{x_2}{x_1}\right)^n$; konstante, ki so v obeh primerih enake, se pokrajšajo.
- Potence iz vseh letnikov: nihalo $T \propto \sqrt{l}$ in $T \propto 1/\sqrt{g}$; gravitacija $F \propto 1/r^2$; Stefan $j \propto T^4$; izsev $L \propto R^2 T^4$; gostota toka $j \propto 1/d^2$; Kepler $T^2 \propto a^3$; kinetična energija $W_k \propto v^2$.
- Pri več količinah zmnoži razmerja vsake posebej.
- Red dela: skica in SI-enote, zakon, razmerje ali absolutna vrednost, simbolni račun, preverjanje reda velikosti.
- Temperatura v razmerjih vedno v kelvinih, razdalja pri gravitaciji vedno od središča.

## Drugače: Korak za korakom s številkami

Ali metoda razmerij res da isto kot polni račun? Preverimo za Mars, ki je od Sonca oddaljen $1{,}52\,\mathrm{a.e.}$ Vzemimo $G = 6{,}67\cdot10^{-11}\,\mathrm{N\,m^2/kg^2}$, $M_S = 1{,}99\cdot10^{30}\,\mathrm{kg}$ in $1\,\mathrm{a.e.} = 1{,}50\cdot10^{11}\,\mathrm{m}$.

**Polni račun** z $T = 2\pi\sqrt{\dfrac{a^3}{G M_S}}$:

1. $a = 1{,}52 \cdot 1{,}50\cdot10^{11}\,\mathrm{m} = 2{,}28\cdot10^{11}\,\mathrm{m}$.
2. $a^3 \approx 1{,}185\cdot10^{34}\,\mathrm{m^3}$ in $G M_S \approx 1{,}327\cdot10^{20}\,\mathrm{m^3/s^2}$.
3. $\dfrac{a^3}{G M_S} \approx 8{,}93\cdot10^{13}\,\mathrm{s^2}$, koren je $9{,}45\cdot10^{6}\,\mathrm{s}$.
4. $T_M \approx 2\pi \cdot 9{,}45\cdot10^{6}\,\mathrm{s} \approx 5{,}94\cdot10^{7}\,\mathrm{s}$.
5. Enak račun za Zemljo ($a = 1{,}50\cdot10^{11}\,\mathrm{m}$) da $T_Z \approx 3{,}17\cdot10^{7}\,\mathrm{s}$.
6. $\dfrac{T_M}{T_Z} = \dfrac{5{,}94}{3{,}17} \approx 1{,}87$.

**Metoda razmerij** v eni vrstici: $T_M = 1{,}52^{3/2} \approx 1{,}87$ leta.

Rezultat je enak, le da smo se izognili petim potencam desetice in trem konstantam. Na maturi to pomeni manj časa in manj priložnosti za napako.

## Drugače: Kot zgodba

Astronavtka Maja pristane na Marsu. Računalnik, ki bi ji povedal težni pospešek, je v okvari, ona pa ga potrebuje za izračun vzleta. V kompletu orodja najde vrv in jo s kladivom na koncu obesi, da je nihalo dolgo $1{,}00\,\mathrm{m}$.

Spomni se, da bi na Zemlji tako nihalo zanihalo v $2{,}01\,\mathrm{s}$. Izmeri čas desetih nihajev, $32{,}6\,\mathrm{s}$, torej en nihaj traja $3{,}26\,\mathrm{s}$. Nihaj je daljši za faktor $\dfrac{3{,}26}{2{,}01} \approx 1{,}62$.

Ker je $T \propto g^{-1/2}$, je $g$ manjši za kvadrat tega faktorja: $1{,}62^2 \approx 2{,}62$. Torej je $g_M \approx \dfrac{9{,}81}{2{,}62} \approx 3{,}74\,\mathrm{m/s^2}$. Ko se računalnik spet zažene, pokaže $3{,}71\,\mathrm{m/s^2}$. Maja se nasmehne: za vrv in kladivo dovolj dobro. Vse, kar je potrebovala, sta bili ena meritev in ena potenca.

## Preveri se

? Katera tabela ustreza Stefanovemu zakonu $j = \sigma T^4$? Temperature so $1000$, $2000$ in $3000\,\mathrm{K}$, gostote toka pa kot večkratniki prve.
- $1$; $2$; $3$
~ To bi veljalo za premo sorazmernost. Pri Stefanovem zakonu je temperatura na četrto potenco.
- $1$; $4$; $9$
~ To je kvadrat, kot pri $L \propto R^2$ ali $W_k \propto v^2$, ne pri temperaturi.
- $1$; $8$; $27$
~ To je kub, kot $a^3$ pri Keplerjevem zakonu.
+ $1$; $16$; $81$
> $2^4 = 16$ in $3^4 = 81$: dvakrat višja temperatura da šestnajstkrat večjo gostoto toka.

? Zakaj pri primerjavi s Stefanovim zakonom temperature ne smemo vstaviti v $\mathrm{^\circ C}$?
- Ker je kelvin enota SI, stopinja Celzija pa ni dovoljena v nobeni enačbi.
~ Stopinje Celzija smemo uporabiti pri razlikah temperatur ($\Delta T$ je v obeh enak). Težava je v razmerju.
+ Ker je $j$ sorazmeren s $T^4$ le pri absolutni temperaturi; ničla Celzijeve lestvice ni prava ničla, zato razmerje stopinj nima pomena.
- Ker bi dobili negativno gostoto toka.
~ $T^4$ je vedno pozitiven, tudi pri negativni temperaturi v $\mathrm{^\circ C}$. Napačno je razmerje, ne predznak.
> Pri $0\,\mathrm{^\circ C}$ telo še seva, saj je njegova temperatura $273\,\mathrm{K}$. Sorazmernost velja samo od absolutne ničle.

? Oceni: na Zemlji kamen z višine $20\,\mathrm{m}$ pada približno $2\,\mathrm{s}$. Koliko časa bi padal z enake višine na Luni ($g_L \approx 1{,}6\,\mathrm{m/s^2}$)?
- približno $0{,}8\,\mathrm{s}$
~ Razmerje je obrnjeno. Manjši $g$ pomeni počasnejše padanje, torej daljši čas.
- približno $2\,\mathrm{s}$
~ Čas padanja je odvisen od $g$: $t = \sqrt{2h/g}$.
+ približno $5\,\mathrm{s}$
- približno $12\,\mathrm{s}$
~ $g$ je res šestkrat manjši, a čas je sorazmeren s $g^{-1/2}$, zato je daljši le za $\sqrt{6}$.
> $t \propto g^{-1/2}$: $\sqrt{9{,}81/1{,}6} \approx 2{,}5$, zato $2\,\mathrm{s} \cdot 2{,}5 \approx 5\,\mathrm{s}$.

? Planet obkroži Sonce v $27$ letih. Kolikšna je velika polos njegove tirnice?
- $27\,\mathrm{a.e.}$
~ To je linearno sklepanje. Po Keplerju je $a^3 = T^2$.
- $3\,\mathrm{a.e.}$
~ To je le kubični koren iz $27$; pozabil si kvadrirati obhodni čas.
- $140\,\mathrm{a.e.}$
~ To je $27^{3/2}$, napačno obrnjena potenca. Prava je $a = T^{2/3}$.
+ $9\,\mathrm{a.e.}$
> $a = T^{2/3} = 27^{2/3} = 9$. Preverba: $9^3 = 729 = 27^2$.

? Grelec z močjo $P = \dfrac{U^2}{R}$ priključimo na polovično napetost. Upor ostane enak. Kolikšna je nova moč?
- Polovica prejšnje.
~ Moč je sorazmerna s kvadratom napetosti, ne z napetostjo.
- Enaka, ker je moč zapisana na grelcu.
~ Na grelcu je moč pri nazivni napetosti. Pri drugi napetosti je drugačna.
- Dvakratna, ker pri manjši napetosti teče večji tok.
~ Pri stalnem uporu manjša napetost da manjši tok ($I = U/R$), ne večjega.
+ Četrtina prejšnje.
> $P \propto U^2$, zato $\left(\tfrac12\right)^2 = \tfrac14$. Metoda razmerij deluje tudi pri elektriki, ne le v vesolju.

:::simboli
y | poljubna količina, ki jo primerjamo | | | odvisna od $x^n$
x | količina, od katere je $y$ odvisen | | |
n | potenca v zakonu | | – | lahko negativna ali ulomek
y_1, y_2 | vrednosti $y$ v prvem in drugem primeru | | |
x_1, x_2 | vrednosti $x$ v prvem in drugem primeru | | |
L, L_1, L_2 | izsev zvezde | L = 4\pi R^2 \sigma T^4 | W |
L_\mathrm{z} | izsev druge zvezde | | W |
L_S | izsev Sonca | | W | $3{,}85\cdot10^{26}\,\mathrm{W}$
R, R_1, R_2 | polmer zvezde | | m |
R_Z | polmer Zemlje | | m |
T | nihajni ali obhodni čas | T = 2\pi\sqrt{l/g} | s | pri zvezdah pa temperatura v K
T_1, T_2 | površinska temperatura zvezde | | K | vedno v kelvinih
T_\mathrm{z}, T_S | površinska temperatura druge zvezde in Sonca | | K | vedno v kelvinih
T_Z | nihajni čas na Zemlji | | s | v računu za Mars obhodni čas Zemlje
T_L | nihajni čas na Luni | | s |
T_M | obhodni čas Marsa | | s |
\sigma | Stefanova konstanta | | W/(m^2\,K^4) | $5{,}67\cdot10^{-8}$
j | gostota energijskega toka | j = \frac{L}{4\pi d^2} | W/m^2 |
d | razdalja od zvezde | | m | pogosto v a.e.
l | dolžina nihala | | m |
g | težni pospešek | | m/s^2 |
g_Z | težni pospešek na Zemlji | | m/s^2 | $9{,}81\,\mathrm{m/s^2}$
g_L | težni pospešek na Luni | | m/s^2 | $1{,}62\,\mathrm{m/s^2}$
F, F_1, F_2 | sila teže | F = \frac{G m M}{r^2} | N |
r, r_1, r_2 | razdalja od središča Zemlje | | m |
a | velika polos tirnice | | a.e. | v $T^2 = a^3$ v a.e., v polnem računu v m
G | gravitacijska konstanta | | N\,m^2/kg^2 | $6{,}67\cdot10^{-11}$
M_S | masa Sonca | | kg | $1{,}99\cdot10^{30}\,\mathrm{kg}$
:::
