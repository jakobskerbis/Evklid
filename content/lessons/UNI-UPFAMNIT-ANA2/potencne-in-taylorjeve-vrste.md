---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Astronomi in pomorščaki so stoletja potrebovali tabele sinusov. Brez njih ni bilo ne napovedi položaja zvezd ne določanja položaja ladje na odprtem morju. Vsako vrednost so mukoma računali z geometrijo, z razpolavljanjem kotov in koreni.

V srednjeveški Indiji je šola matematika Madhave iz Kerale odkrila bližnjico: sinus, kosinus in arkus tangens se dajo zapisati kot »neskončni polinomi«, vsote potenc spremenljivke. Kasneje je v Evropi Newton z vrstami računal ploščine in korene. V začetku 18. stoletja je Brook Taylor objavil splošen recept, kako tako vrsto dobiš iz odvodov funkcije.

Ideja je še danes v vsaki bolnišnici. Infuzijska črpalka ali program za odmerjanje zdravila računa koncentracijo $c_0 e^{-kt}$. Procesor pa zna le seštevati in množiti. Eksponentno funkcijo zato nadomesti s polinomom, ki je dovolj blizu. Koliko členov je dovolj in kje tak polinom sploh deluje, pove ta lekcija.

## Razlaga

**Stopnice proti $e$.** Seštevajmo $1 + 1 + \frac{1}{2!} + \frac{1}{3!} + \dots$ in opazujmo delne vsote $T_n(1)$:

| $n$ | $T_n(1)$ | $n$ | $T_n(1)$ |
|---|---|---|---|
| $0$ | $1$ | $4$ | $2{,}7083$ |
| $1$ | $2$ | $5$ | $2{,}7167$ |
| $2$ | $2{,}5$ | $6$ | $2{,}7181$ |
| $3$ | $2{,}6667$ | $7$ | $2{,}7183$ |

Vsak korak doda manjšo stopnico. Pri $n = 7$ smo že na štirih decimalkah števila $e \approx 2{,}71828$. Na grafu si predstavljaj krivuljo $y = e^{x}$ in ob njej polinome $T_0 = 1$, $T_1 = 1 + x$, $T_2 = 1 + x + \frac{x^{2}}{2}$, … Vsi se dotikajo krivulje v točki $x = 0$. Vsak naslednji se je drži na širšem pasu, preden se odlepi.

:::premisli
Ali bi delne vsote $\sum \frac{10^{n}}{n!}$ prav tako prišle do $e^{10}$? Kateri člen je največji?
---
Da, a počasneje. Člen $\frac{10^{n}}{n!}$ raste, dokler je $\frac{10}{n} \ge 1$, nato pada. Največja sta člena pri $n = 9$ in $n = 10$, oba približno $2756$. Potem $n!$ prevlada in vsota konvergira, ker ima vrsta za $e^{x}$ konvergenčni polmer $\infty$.
:::

**Številska premica konvergence.** Pri drugih vrstah ni tako lepo. Geometrijska vrsta $1 + x + x^{2} + \dots$ ima vsoto $\frac{1}{1-x}$, a samo za $|x| < 1$. Za vsako vrsto potenc okoli središča $a$ obstaja število $R$ med $0$ in $\infty$, pri katerem je slika na premici taka:

| kje na premici | vrsta |
|---|---|
| levo od $a-R$ | divergira |
| točka $a-R$ | preveri posebej |
| med $a-R$ in $a+R$ | konvergira absolutno |
| točka $a+R$ | preveri posebej |
| desno od $a+R$ | divergira |

Število $R$ je **konvergenčni polmer**. Ime »polmer« ni naključje: če namesto $x$ vstavimo kompleksni $z$, vrsta konvergira na krogu $|z - a| < R$ v kompleksni ravnini in divergira zunaj njega. Realni interval je le presek tega kroga z realno osjo.

:::premisli
Vrsta $\sum a_n x^{n}$ konvergira pri $x = -4$. Kaj lahko poveš o konvergenci pri $x = 3$ in pri $x = 5$?
---
Ker konvergira pri $-4$, je $R \ge 4$. Pri $x = 3$ zato konvergira absolutno, saj je $|3| < 4$. Pri $x = 5$ ne vemo: lahko je $R = 4$ (divergenca) ali $R$ večji (konvergenca).
:::

**Zdaj simboli.** **Potenčna vrsta** s središčem $a$ je $\sum_{n=0}^{\infty} a_n (x-a)^{n}$. Konvergenčni polmer dobimo s Cauchy–Hadamardovo formulo

$$\frac{1}{R} = \limsup_{n\to\infty} \sqrt[n]{|a_n|},$$

ali, kadar limita obstaja, s kvocientom $R = \lim\limits_{n\to\infty} \left|\dfrac{a_n}{a_{n+1}}\right|$. Na vsakem zaprtem intervalu $[a - r, a + r]$ z $r < R$ vrsta konvergira enakomerno. Zato jo smemo po členih odvajati in integrirati, nova vrsta pa ima isti polmer.

Iz tega sledi, da je vsota $f(x) = \sum a_n (x-a)^{n}$ neskončnokrat odvedljiva in da je $f^{(n)}(a) = n!\,a_n$. Obratno: funkciji $f$ priredimo **Taylorjevo vrsto**

$$\sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^{n}.$$

Pri $a = 0$ ji pravimo tudi Maclaurinova vrsta. Njena delna vsota $T_n$ je Taylorjev polinom. Če je $f$ med $a$ in $x$ $(n+1)$-krat odvedljiva, napako opiše Lagrangeov ostanek (posledica izreka o srednji vrednosti):

$$f(x) - T_n(x) = \frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}$$

za neki $\xi$ med $a$ in $x$. Funkcija je enaka vsoti svoje Taylorjeve vrste natanko tam, kjer gre ostanek proti $0$.

**Vrste elementarnih funkcij** (središče $0$):

| funkcija | vrsta | $R$ |
|---|---|---|
| $e^{x}$ | $\sum \frac{x^{n}}{n!}$ | $\infty$ |
| $\sin x$ | $\sum (-1)^{n}\frac{x^{2n+1}}{(2n+1)!}$ | $\infty$ |
| $\cos x$ | $\sum (-1)^{n}\frac{x^{2n}}{(2n)!}$ | $\infty$ |
| $\frac{1}{1-x}$ | $\sum x^{n}$ | $1$ |
| $\ln(1+x)$ | $\sum_{n\ge1} (-1)^{n+1}\frac{x^{n}}{n}$ | $1$ |
| $(1+x)^{\alpha}$ | $\sum \binom{\alpha}{n} x^{n}$ | $1$ (če $\alpha \notin \mathbb{N}_0$) |

**Elementarne kompleksne funkcije.** Ker vrste za $e^{x}$, $\sin x$ in $\cos x$ konvergirajo v vsem $\mathbb{C}$, z njimi definiramo $e^{z}$, $\sin z$ in $\cos z$ za vsak kompleksni $z$. Ko v vrsto za $e^{z}$ vstavimo $iz$ in ločimo sode in lihe člene, dobimo Eulerjevo formulo $e^{iz} = \cos z + i\sin z$. Podrobneje jo obdela naslednja lekcija.

## Rešeni primeri

### Primer 1 (lažji): interval konvergence

Določi konvergenčni polmer in interval konvergence vrste $\displaystyle\sum_{n=1}^{\infty} \frac{x^{n}}{n\,3^{n}}$.

**Podatki:** $a_n = \dfrac{1}{n\,3^{n}}$, središče $a = 0$
**Iščemo:** $R$ in množico $x$, kjer vrsta konvergira

:::formula
$R = \lim\limits_{n\to\infty}\left|\dfrac{a_n}{a_{n+1}}\right|$, krajišči preveri posebej
:::

**Rešitev:**

1. Kvocient: $\dfrac{a_n}{a_{n+1}} = \dfrac{(n+1)\,3^{n+1}}{n\,3^{n}} = 3\cdot\dfrac{n+1}{n} \to 3$, torej $R = 3$.
2. Za $|x| < 3$ vrsta konvergira absolutno, za $|x| > 3$ divergira.
3. Pri $x = 3$ dobimo $\sum \frac{1}{n}$, harmonično vrsto, ki divergira.
4. Pri $x = -3$ dobimo $\sum \frac{(-1)^{n}}{n}$, ki po Leibnizovem kriteriju konvergira (pogojno).
5. Odgovor: $R = 3$, vrsta konvergira natanko na $[-3, 3)$.

### Primer 2: gladka funkcija z majhnim polmerom

Zapiši Maclaurinovo vrsto funkcije $f(x) = \dfrac{1}{1+x^{2}}$, določi njen polmer in iz nje dobi vrsto za $\arctan x$. Zakaj je polmer končen, čeprav je $f$ gladka na vsej realni osi?

**Podatki:** $f(x) = \dfrac{1}{1+x^{2}}$; $\dfrac{1}{1-q} = \sum q^{n}$ za $|q| < 1$; $(\arctan x)' = f(x)$, $\arctan 0 = 0$
**Iščemo:** vrsto za $f$, polmer $R$, vrsto za $\arctan x$, razlog za končni $R$

:::formula
$\dfrac{1}{1-q} = \sum\limits_{n=0}^{\infty} q^{n}$ za $|q|<1$; integriranje po členih ohrani $R$
:::

**Rešitev:**

1. Vstavimo $q = -x^{2}$: $f(x) = \sum_{n=0}^{\infty} (-1)^{n} x^{2n} = 1 - x^{2} + x^{4} - \dots$. Odvajati ni bilo treba, ker je razvoj enoličen.
2. Pogoj $|q| < 1$ pomeni $x^{2} < 1$, torej $R = 1$.
3. Integriramo po členih od $0$ do $x$: $\arctan x = \sum_{n=0}^{\infty} (-1)^{n}\dfrac{x^{2n+1}}{2n+1}$, prav tako z $R = 1$.
4. Razlog za $R = 1$ je v kompleksni ravnini: $1 + z^{2} = 0$ pri $z = \pm i$. Tam ima $f$ pol, ki je od središča oddaljen za $1$. Krog konvergence se ne more razširiti čez pol.
5. Odgovor: $f(x) = \sum (-1)^{n} x^{2n}$ in $\arctan x = \sum (-1)^{n}\frac{x^{2n+1}}{2n+1}$, obe z $R = 1$; polmer omejujeta kompleksni točki $\pm i$.

### Primer 3 (težji): koncentracija zdravila

Po hitri injekciji je koncentracija zdravila v krvi $c(t) = c_0 e^{-kt}$, kjer je $c_0 = 80\,\mathrm{mg/L}$ in $k = 0{,}2\,\mathrm{h^{-1}}$. Program oceni $c$ po $t = 0{,}5\,\mathrm{h}$ s Taylorjevim polinomom za $e^{-x}$. Kolikšna je ocena s polinomom stopnje $1$ in stopnje $2$? Katera stopnja zagotovi napako pod $0{,}1\,\mathrm{mg/L}$?

**Podatki:** $c_0 = 80\,\mathrm{mg/L}$, $k = 0{,}2\,\mathrm{h^{-1}}$, $t = 0{,}5\,\mathrm{h}$, dovoljena napaka $0{,}1\,\mathrm{mg/L}$
**Iščemo:** oceni $c_1$ in $c_2$ ter najmanjšo zadostno stopnjo

:::formula
$e^{-x} = 1 - x + \dfrac{x^{2}}{2} - \dfrac{x^{3}}{6} + \dots$; pri alternirajoči vrsti s padajočimi členi je napaka manjša od prvega izpuščenega člena.
:::

**Rešitev:**

1. Eksponent: $x = kt = 0{,}2 \cdot 0{,}5 = 0{,}1$ (brez enot, ker se h krajša).
2. Stopnja $1$: $c_1 = 80 \cdot (1 - 0{,}1) = 72$ mg/L.
3. Stopnja $2$: $c_2 = 80 \cdot (1 - 0{,}1 + 0{,}005) = 72{,}4$ mg/L.
4. Napaka pri stopnji $1$ je manjša od $80 \cdot 0{,}005 = 0{,}4$ mg/L. Ta meja je nad $0{,}1$, zato stopnja $1$ ne zadošča zagotovo.
5. Napaka pri stopnji $2$ je manjša od $80 \cdot \frac{0{,}001}{6} \approx 0{,}0133$ mg/L, kar je pod $0{,}1$.
6. Odgovor: ocena je $72$ oziroma $72{,}4\,\mathrm{mg/L}$; zadostuje polinom stopnje $2$ (točna vrednost je $72{,}387\,\mathrm{mg/L}$).

### Primer 4: zdaj ti

Fizioterapevt meri, kako visoko bolnik po operaciji rame dvigne iztegnjeno roko. Roka je dolga $L = 0{,}6\,\mathrm{m}$ in se od vodoravne lege dvigne za kot $\varphi = 0{,}3$ rad. Dlan se dvigne za $h = L\sin\varphi$. Oceni $h$ z dvema členoma vrste za sinus in oceni napako.

**Podatki:** $L = 0{,}6\,\mathrm{m}$, $\varphi = 0{,}3$ rad
**Iščemo:** približek za $h$ in mejo napake

:::formula
$\sin\varphi \approx \varphi - \dfrac{\varphi^{3}}{6}$, napaka manjša od $\dfrac{\varphi^{5}}{120}$
:::

**Rešitev:**

1. $\varphi^{3} = 0{,}027$, zato $\frac{\varphi^{3}}{6} = 0{,}0045$.
2. $\sin 0{,}3 \approx 0{,}3 - 0{,}0045 = 0{,}2955$.
3. Izračunaj še $h$ in mejo napake za $h$, nato preveri:

:::premisli
Koliko je $h$ in kako velika je lahko napaka?
---
$h \approx 0{,}6 \cdot 0{,}2955 \approx 0{,}1773\,\mathrm{m}$, torej približno $17{,}7\,\mathrm{cm}$. Napaka je manjša od $0{,}6 \cdot \frac{0{,}3^{5}}{120} \approx 0{,}000012\,\mathrm{m}$, kar je manj kot dve stotinki milimetra.
:::

## Pogoste napake

- **Pozabljen $n!$.** Koeficient Taylorjeve vrste je $\frac{f^{(n)}(a)}{n!}$, ne $f^{(n)}(a)$. Kdor za $e^{2x}$ zapiše $\sum 2^{n}x^{n}$, dobi vrsto s polmerom $\frac12$ namesto $\infty$. Preizkus: odvajaj svojo vrsto $n$-krat v središču, mora dati $f^{(n)}(a)$.
- **Krajišča »po občutku«.** Formula za $R$ o točkah $a \pm R$ ne pove ničesar. V Primeru 1 je eno krajišče v intervalu, drugo ne. Krajišči vedno preveri posebej.
- **Vsaka gladka funkcija je enaka svoji Taylorjevi vrsti.** Ni res. Za $f(x) = e^{-1/x^{2}}$, $f(0) = 0$, so vsi odvodi v $0$ enaki $0$, zato je Taylorjeva vrsta ničelna, funkcija pa ni. Enakost dokažeš šele, ko pokažeš, da gre ostanek proti $0$.
- **Polmer iz realnega grafa.** Funkcija $\frac{1}{1+x^{2}}$ je na $\mathbb{R}$ brez težav, a $R = 1$. Polmer je razdalja do najbližje »slabe« točke v kompleksni ravnini, ne le na realni osi.
- **Polinom daleč od središča.** Približek $c \approx c_0(1 - kt)$ je dober pri majhnem $kt$. Pri $kt = 2$ bi dal negativno koncentracijo $-c_0$, kar je nesmisel.

## Povzetek

- Potenčna vrsta $\sum a_n (x-a)^{n}$ konvergira absolutno za $|x - a| < R$ in divergira za $|x - a| > R$; krajišča preverimo posebej. V $\mathbb{C}$ je območje konvergence krog.
- $\frac{1}{R} = \limsup \sqrt[n]{|a_n|}$ ali $R = \lim |a_n / a_{n+1}|$, če limita obstaja.
- Znotraj polmera smemo vrsto odvajati in integrirati po členih; polmer se ne spremeni.
- Taylorjeva vrsta: $a_n = \frac{f^{(n)}(a)}{n!}$; napaka $T_n$ je Lagrangeov ostanek.
- $e^{x}$, $\sin x$, $\cos x$: $R = \infty$; $\frac{1}{1-x}$, $\ln(1+x)$, $(1+x)^{\alpha}$: $R = 1$.
- Z istimi vrstami definiramo $e^{z}$, $\sin z$, $\cos z$ za vse $z \in \mathbb{C}$.

## Drugače: Z analogijo

Predstavljaj si mikroskop, izostren na eno točko preparata, v središče $a$. V tej točki vidiš vrednost funkcije in vse njene odvode: to so podatki, iz katerih sestaviš Taylorjevo vrsto. Bolj ko povečuješ (več členov), natančneje vidiš okolico.

Vidno polje mikroskopa pa je okroglo in ima rob: to je konvergenčni polmer. Rob postavi najbližja »napaka v preparatu«, točka, kjer funkcija odpove. Lahko je skrita v drugi ravnini, kot pola $\pm i$ pri $\frac{1}{1+x^{2}}$. Na realni osi ju ne vidiš, a vidno polje vseeno omejita. Pri $e^{x}$, $\sin x$ in $\cos x$ napak ni nikjer, zato je vidno polje neomejeno.

## Drugače: Uporaba v stroki

Kratek čas po injekciji koncentracija zdravila pada skoraj premočrtno: $c \approx c_0(1 - kt)$. To je Taylorjev polinom stopnje $1$, linearni približek $f(a) + f'(a)(x - a)$. Po daljšem času pa premica pade pod nič, prava krivulja $c_0 e^{-kt}$ pa se le počasi približuje ničli. Zato programi, ki računajo odmerke, ne uporabljajo enega polinoma za vse čase. Čas razdelijo na kratke korake in na vsakem uporabijo nekaj členov vrste, kjer je ostanek zanesljivo majhen.

## Preveri se

? Katera od teh funkcij ima Maclaurinovo vrsto s **končnim** konvergenčnim polmerom?
- $e^{x}$
~ Vrsta $\sum \frac{x^{n}}{n!}$ konvergira za vsak $x$, ker $n!$ raste hitreje kot $|x|^{n}$.
- $\sin x$
~ Tudi pri sinusu so v imenovalcih fakultete, zato je $R = \infty$.
- $\cos x$
~ Kosinus ima enako kot sinus $R = \infty$.
+ $\ln(1+x)$
> Vrsta $\sum (-1)^{n+1}\frac{x^{n}}{n}$ ima $R = 1$: pri $x = -1$ funkcija $\ln(1+x)$ ni definirana.

? Koliko je konvergenčni polmer vrste $\sum_{n=0}^{\infty} 2^{n} x^{n}$?
- $2$
~ To je obratna vrednost pravega rezultata: $\sqrt[n]{2^{n}} = 2$ je $\frac{1}{R}$, ne $R$.
+ $\frac12$
- $1$
~ Polmer $1$ ima geometrijska vrsta $\sum x^{n}$; tu je količnik $2x$.
> Vrsta je geometrijska s količnikom $2x$ in konvergira za $|2x| < 1$, torej $R = \frac12$.

? Zakaj Maclaurinova vrsta funkcije $\frac{1}{1+x^{2}}$ divergira pri $x = 2$, čeprav je $f(2) = 0{,}2$?
- Ker $f$ v točki $x = 1$ ni odvedljiva.
~ $f$ je odvedljiva povsod na $\mathbb{R}$; težava ni na realni osi.
+ Ker ima $f$ v kompleksni ravnini pola $\pm i$, ki sta od središča oddaljena za $1$, zato je $R = 1$.
- Ker ima vsaka potenčna vrsta konvergenčni polmer $1$.
~ Vrsta za $e^{x}$ ima $R = \infty$, vrsta $\sum 2^{n}x^{n}$ pa $R = \frac12$.
> Krog konvergence sega do najbližje točke, kjer funkcija odpove; za $\frac{1}{1+z^{2}}$ sta to $\pm i$.

? Koliko je koeficient pri $x^{3}$ v Maclaurinovi vrsti funkcije $e^{2x}$?
- $8$
~ To je $f'''(0) = 2^{3}$ brez deljenja s $3!$: pozabljen $n!$.
+ $\frac43$
- $\frac16$
~ Tu manjka faktor $2^{3}$, ki ga da verižno pravilo pri treh odvodih $e^{2x}$.
- $\frac83$
~ Deljeno s $3$ namesto s $3! = 6$.
> $a_3 = \frac{f'''(0)}{3!} = \frac{2^{3}}{6} = \frac43$; v celoti $e^{2x} = \sum \frac{(2x)^{n}}{n!}$ z $R = \infty$.

? Farmacevt oceni koncentracijo z $c \approx c_0(1 - kt)$ za $c_0 = 100\,\mathrm{mg/L}$, $k = 0{,}1\,\mathrm{h^{-1}}$ in $t = 1\,\mathrm{h}$ ter dobi $90\,\mathrm{mg/L}$. Kakšna je ta ocena?
- Previsoka, ker izpuščeni členi vedno zmanjšajo vrednost.
~ Prvi izpuščeni člen $+\frac{x^{2}}{2}$ je pozitiven, zato prava vrednost leži nad oceno.
+ Prenizka za približno $0{,}5\,\mathrm{mg/L}$, ker je prvi izpuščeni člen $+\frac{x^{2}}{2}$ pozitiven.
- Točna, ker je $kt$ majhen.
~ Majhen $kt$ pomeni majhno, ne ničelno napako: $100 \cdot \frac{0{,}1^{2}}{2} = 0{,}5$.
> Točno je $100\,e^{-0{,}1} \approx 90{,}48\,\mathrm{mg/L}$; linearna ocena je za približno $0{,}48\,\mathrm{mg/L}$ prenizka.

:::simboli
R | konvergenčni polmer | R = \lim\limits_{n\to\infty}\left\lvert \dfrac{a_n}{a_{n+1}} \right\rvert | | krajišči preverimo posebej
a_n, a_{n+1} | koeficienti potenčne vrste
a | središče potenčne vrste
n | zaporedna številka člena (stopnja)
x | spremenljivka vrste
f | funkcija (vsota vrste) | f(x) = \sum a_n (x-a)^{n}
T_n | Taylorjev polinom stopnje n
\xi | vmesna točka med a in x
q | količnik geometrijske vrste | | | vrsta konvergira za −1 < q < 1
e | Eulerjevo število | | | e ≈ 2,718
\varphi | kot dviga roke | | rad
:::
