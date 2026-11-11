---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Luka programira točkovanje za spletno igro s turnirjem, ki teče brez konca. V prvem krogu igralec dobi $1$ točko, v drugem izgubi $\frac12$, v tretjem dobi $\frac13$, v četrtem izgubi $\frac14$ in tako naprej. Luka napiše dve različici programa. Prva sešteva točke po vrsti. Druga, zaradi hitrejšega strežnika, vzame najprej dva bonusa in nato eno kazen. Obe seštejeta *iste* člene, a prva se ustali pri približno $0{,}693$, druga pri približno $1{,}040$.

Katera ima prav? Luka mora to razrešiti, preden pokaže lestvico igralcem. Odgovor je presenetljiv: pri neskončnih vsotah vrstni red lahko spremeni rezultat. Zgodi se to natanko pri vrstah, ki konvergirajo **pogojno**. Pri **absolutno** konvergentnih vrstah se to nikoli ne zgodi.

## Razlaga

**Najprej Lukov primer.** Prva različica računa delne vsote **alternirajoče harmonične vrste**

$$1 - \frac12 + \frac13 - \frac14 + \cdots = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n}.$$

| $n$ | $S_n$ |
|---|---|
| $1$ | $1$ |
| $2$ | $0{,}5$ |
| $3$ | $0{,}8333$ |
| $4$ | $0{,}5833$ |
| $10$ | $0{,}6456$ |
| $100$ | $0{,}6882$ |

Delne vsote skačejo gor in dol, a skoki so vse manjši. Na številski premici: $S_2 < S_4 < \ldots$ se plazijo desno, $S_1 > S_3 > \ldots$ levo, vmes ostaja vse ožji pas okoli $\ln 2 \approx 0{,}6931$.

Druga različica sešteva $1 + \frac13 - \frac12 + \frac15 + \frac17 - \frac14 + \cdots$. Po $1$, $2$, $3$ in $10$ trojicah dobi $0{,}8333$; $0{,}9262$; $0{,}9615$ in $1{,}0152$, po $100\,000$ trojicah pa $1{,}0397$. To je $\frac32 \ln 2$.

Kaj se zgodi, če Luka vzame samo absolutne vrednosti? Dobi harmonično vrsto $1 + \frac12 + \frac13 + \cdots$, ki divergira. Vrsta konvergira le zato, ker se pozitivni in negativni členi med seboj deloma izničujejo.

**Posplošitev 1: dva načina konvergence.** Vrsta $\sum a_n$ **konvergira absolutno**, če konvergira $\sum |a_n|$. Vrsta **konvergira pogojno**, če $\sum a_n$ konvergira, $\sum |a_n|$ pa ne. Lukova vrsta je pogojno konvergentna.

Absolutna konvergenca je močnejša: *iz nje sledi navadna konvergenca.* Razlog je Cauchyjev pogoj: $|a_{n+1} + \cdots + a_m| \le |a_{n+1}| + \cdots + |a_m|$, desna stran pa je poljubno majhna, ker $\sum |a_n|$ konvergira.

:::premisli
Zakaj ista neenakost ne dokaže obrata, da iz konvergence $\sum a_n$ sledi konvergenca $\sum |a_n|$? Napovej, preden bereš naprej.
---
Neenakost gre le v eno smer: majhna vsota $|a_{n+1} + \cdots + a_m|$ ne pove nič o vsoti absolutnih vrednosti, ker se členi lahko izničujejo. Lukova vrsta je protiprimer: konvergira, absolutno pa ne.
:::

**Posplošitev 2: kriteriji za vrste z nenegativnimi členi.** Ker absolutno konvergenco preverjamo na $\sum |a_n|$, potrebujemo kriterije za vrste z $a_n \ge 0$:

- **Primerjalni.** Če je $0 \le a_n \le b_n$ in $\sum b_n$ konvergira, konvergira tudi $\sum a_n$. Če $\sum a_n$ divergira, divergira tudi $\sum b_n$.
- **Kvocientni (d'Alembert).** Naj bo $q = \lim \frac{a_{n+1}}{a_n}$. Če je $q < 1$, vrsta konvergira; če je $q > 1$, divergira; pri $q = 1$ kriterij ne odloči.
- **Korenski (Cauchy).** Naj bo $q = \lim \sqrt[n]{a_n}$. Enaki sklepi kot pri kvocientnem.

Za primerjavo potrebuješ znane vrste: geometrijska $\sum q^n$ konvergira za $|q| < 1$; $\sum \frac{1}{n^p}$ konvergira za $p > 1$ in divergira za $p \le 1$. Primer za korenski kriterij: pri $\sum \left(\frac{n}{2n+1}\right)^n$ je $\sqrt[n]{a_n} = \frac{n}{2n+1} \to \frac12 < 1$, vrsta konvergira.

**Posplošitev 3: Leibnizov kriterij.** Lukova vrsta absolutno ne konvergira, pa vendar konvergira. Pomaga **Leibnizov kriterij**: če $a_n$ *pada* proti $0$, vrsta $\sum (-1)^{n+1} a_n$ konvergira. Za vsoto $S$ velja še ocena napake

$$|S - S_n| \le a_{n+1}.$$

Napaka ni večja od prvega izpuščenega člena. Pri Luki je po $100$ krogih napaka največ $\frac{1}{101} \approx 0{,}0099$; res je $|0{,}6882 - 0{,}6931| \approx 0{,}005$.

**Posplošitev 4: preureditve.** **Preureditev** vrste $\sum a_n$ je vrsta $\sum a_{\pi(n)}$, kjer je $\pi$ bijekcija $\mathbb N \to \mathbb N$: isti členi, drug vrstni red.

- Če $\sum a_n$ konvergira **absolutno**, ima vsaka preureditev isto vsoto.
- Če $\sum a_n$ konvergira **pogojno**, jo lahko preuredimo tako, da konvergira k *poljubnemu* realnemu številu ali divergira (**Riemannov izrek**).

:::premisli
Zakaj pri pogojno konvergentni vrsti vsota samo pozitivnih členov ne more biti končna?
---
Če bi bila vsota pozitivnih členov končna, bi bila končna tudi vsota negativnih (razlika dveh konvergentnih vrst), in potem bi konvergirala tudi $\sum |a_n|$, ki je njuna vsota absolutnih vrednosti. To bi pomenilo absolutno konvergenco.
:::

Luka zdaj ve: rezultat $0{,}693$ je pravi, ker je to vsota vrste v vrstnem redu krogov. Druga različica sešteje drugo vrsto, preureditev. Pri pogojni konvergenci strežnik ne sme spreminjati vrstnega reda.

## Rešeni primeri

### Primer 1 (lažji): absolutno ali ne?

Ali vrsta $\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n^2}$ konvergira absolutno? Oceni napako, če vzamemo prve štiri člene.

**Podatki:** $a_n = \dfrac{(-1)^{n+1}}{n^2}$, $n = 4$ členi
**Iščemo:** način konvergence in oceno $|S - S_4|$

:::formula
$\sum \frac{1}{n^p}$ konvergira za $p > 1$; Leibniz: $|S - S_n| \le |a_{n+1}|$
:::

**Rešitev:**

1. Absolutne vrednosti: $|a_n| = \frac{1}{n^2}$, to je vrsta s $p = 2 > 1$, ki konvergira.
2. Torej vrsta konvergira absolutno, njeno vsoto lahko računamo v poljubnem vrstnem redu.
3. $S_4 = 1 - \frac14 + \frac19 - \frac{1}{16} \approx 0{,}7986$.
4. Ocena: $|S - S_4| \le \frac{1}{25} = 0{,}04$, ker $\frac{1}{n^2}$ pada proti $0$.
5. Odgovor: vrsta konvergira absolutno; $S \approx 0{,}80$ z napako največ $0{,}04$ (točno je $S = \frac{\pi^2}{12} \approx 0{,}8225$).

### Primer 2: kvocientni kriterij

Ugotovi, ali vrsta $\displaystyle\sum_{n=1}^{\infty} (-1)^n \frac{n^2}{2^n}$ konvergira absolutno.

**Podatki:** $a_n = (-1)^n \dfrac{n^2}{2^n}$
**Iščemo:** ali konvergira $\sum |a_n|$

:::formula
$q = \lim\limits_{n\to\infty} \dfrac{|a_{n+1}|}{|a_n|}$; $q < 1 \Rightarrow$ konvergira
:::

**Rešitev:**

1. Vzamemo absolutne vrednosti, da kriterij za nenegativne člene sploh smemo uporabiti: $|a_n| = \frac{n^2}{2^n}$.
2. Kvocient: $\dfrac{|a_{n+1}|}{|a_n|} = \dfrac{(n+1)^2}{2^{n+1}} \cdot \dfrac{2^n}{n^2} = \dfrac{(n+1)^2}{2n^2}$.
3. Pri $n = 10$ je to $\frac{121}{200} = 0{,}605$; v limiti $\left(1 + \frac1n\right)^2 \cdot \frac12 \to \frac12$.
4. Ker je $q = \frac12 < 1$, $\sum |a_n|$ konvergira.
5. Odgovor: vrsta konvergira absolutno.

### Primer 3 (težji): tek naprej in nazaj

Atletinja na treningu teče po ravni stezi: $100\,\mathrm{m}$ naprej, $50\,\mathrm{m}$ nazaj, $\frac{100}{3}\,\mathrm{m}$ naprej, $25\,\mathrm{m}$ nazaj; $n$-ti odsek je dolg $\frac{100}{n}\,\mathrm{m}$. Kje se konča, če teče neskončno odsekov? Po koliko odsekih je zagotovo največ $1\,\mathrm{m}$ od končne lege? Ali je skupna pretečena pot končna?

**Podatki:** odsek $n$: $\dfrac{100}{n}\,\mathrm{m}$, smer izmenično naprej in nazaj; dovoljena napaka $1\,\mathrm{m}$
**Iščemo:** končno lego $S$, število odsekov $n$ z $|S - S_n| \le 1\,\mathrm{m}$, skupno pot

:::formula
$S = 100\sum \frac{(-1)^{n+1}}{n} = 100 \ln 2$; Leibniz: $|S - S_n| \le \frac{100}{n+1}$
:::

**Rešitev:**

1. Lega po $n$ odsekih je $100$-kratnik delne vsote Lukove vrste, zato je $S = 100 \ln 2 \approx 69{,}3\,\mathrm{m}$ od starta.
2. Leibniz: dovolj je $\frac{100}{n+1} \le 1$, torej $n + 1 \ge 100$, $n \ge 99$.
3. Preverba: po $99$ odsekih je lega $69{,}82\,\mathrm{m}$, odmik od $69{,}31\,\mathrm{m}$ je $0{,}50\,\mathrm{m}$.
4. Skupna pot je $100 \sum \frac1n$, harmonična vrsta, ki divergira. Že po $99$ odsekih je $517{,}7\,\mathrm{m}$.
5. Odgovor: konča se približno $69{,}3\,\mathrm{m}$ od starta, po $99$ odsekih je manj kot $1\,\mathrm{m}$ od te točke, pretečena pot pa raste čez vse meje. Lega konvergira, pot ne: to je pogojna konvergenca.

### Primer 4 – zdaj ti

Ali vrsta $\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{\sqrt n}$ konvergira absolutno, pogojno ali divergira?

**Podatki:** $a_n = \dfrac{(-1)^{n+1}}{\sqrt n}$
**Iščemo:** način konvergence (absolutno, pogojno ali divergira)

:::formula
Leibniz za konvergenco; primerjava z $\sum \frac1n$ za absolutno konvergenco
:::

**Rešitev:**

1. $\frac{1}{\sqrt n}$ pada in gre proti $0$, zato po Leibnizu vrsta konvergira.
2. Za absolutno konvergenco primerjaj $\frac{1}{\sqrt n}$ s $\frac1n$ in sklepaj sam:

:::premisli
Konvergira $\sum \frac{1}{\sqrt n}$ ali ne? Kaj to pomeni za dano vrsto?
---
Ker je $\frac{1}{\sqrt n} \ge \frac1n$ in $\sum \frac1n$ divergira, po primerjalnem kriteriju divergira tudi $\sum \frac{1}{\sqrt n}$ (to je $p = \frac12 \le 1$). Vrsta torej konvergira **pogojno**.
:::

## Pogoste napake

- **»Členi gredo proti 0, torej vrsta konvergira.«** To je le potreben pogoj. Harmonična vrsta ima $\frac1n \to 0$, a divergira.
- **»Konvergira, torej konvergira tudi absolutno.«** Velja le obratno. Alternirajoča harmonična vrsta konvergira, $\sum \frac1n$ pa ne.
- **Kvocient manjši od 1 za vsak $n$.** Pri $\sum\frac1n$ je $\frac{n}{n+1} < 1$ za vsak $n$, a limita je $1$ in vrsta divergira. Kriterij zahteva limito $q < 1$ (ali vsaj $\frac{a_{n+1}}{a_n} \le r$ za isti $r < 1$ pri vseh velikih $n$).
- **$q = 1$ pomeni konvergenco.** Pri $q = 1$ kriterij molči: $\sum\frac1n$ divergira, $\sum\frac{1}{n^2}$ konvergira, obe imata $q = 1$.
- **Preurejanje kot pri končni vsoti.** Komutativnost seštevanja za neskončne vsote velja samo pri absolutni konvergenci. Pri pogojni lahko preureditev spremeni vsoto, kot pri Luki.

## Povzetek

- Absolutna konvergenca: $\sum |a_n|$ konvergira. Iz nje sledi konvergenca $\sum a_n$.
- Pogojna konvergenca: $\sum a_n$ konvergira, $\sum |a_n|$ divergira (npr. $\sum \frac{(-1)^{n+1}}{n} = \ln 2$).
- Za $\sum |a_n|$: primerjalni, kvocientni in korenski kriterij; pri $q = 1$ ne odločita.
- Leibniz: $a_n \searrow 0 \Rightarrow \sum (-1)^{n+1} a_n$ konvergira in $|S - S_n| \le a_{n+1}$.
- Absolutno konvergentno vrsto smemo preurediti brez spremembe vsote; pogojno konvergentno lahko preuredimo do poljubne vsote (Riemann).

## Drugače: Z analogijo

Predstavljaj si vlečenje vrvi. Na levi ekipi stojijo negativni členi, na desni pozitivni. Igralci se priključujejo eden za drugim, vsak naslednji je šibkejši.

- **Absolutna konvergenca:** skupna moč obeh ekip je končna. Ne glede na to, v kakšnem vrstnem redu prihajajo igralci, se vrv ustavi na istem mestu.
- **Pogojna konvergenca:** vsaka ekipa ima neskončno skupne moči, igralci pa so vse šibkejši. Sodnik, ki izbira, kdo pride na vrsto, lahko vrv pripelje kamorkoli: ko je vrv levo od želene točke, kliče desne igralce, dokler je ne preseže, nato leve. Ker so igralci vse šibkejši, nihanje okoli izbrane točke pojenja.

Prav to je ideja dokaza Riemannovega izreka.

## Drugače: Bolj natančno

**Absolutna $\Rightarrow$ navadna konvergenca.** Naj bo $\varepsilon > 0$. Ker $\sum|a_n|$ konvergira, po Cauchyjevem pogoju obstaja $N$, da je $\sum_{k=n+1}^{m} |a_k| < \varepsilon$ za $m > n \ge N$. Po trikotniški neenakosti je $\left|\sum_{k=n+1}^{m} a_k\right| < \varepsilon$, torej $\sum a_n$ izpolni Cauchyjev pogoj.

**Leibnizov kriterij.** Naj $a_n$ pada proti $0$. Potem je $S_{2n+2} - S_{2n} = a_{2n+1} - a_{2n+2} \ge 0$, sode delne vsote naraščajo; podobno lihe padajo. Velja $S_{2n} \le S_{2n+1} \le S_1$, zato sode vsote naraščajo in so omejene, torej imajo limito $S$. Ker je $S_{2n+1} - S_{2n} = a_{2n+1} \to 0$, imajo lihe isto limito. $S$ leži med $S_n$ in $S_{n+1}$, od koder $|S - S_n| \le a_{n+1}$.

**Kvocientni kriterij.** Če je $\frac{a_{n+1}}{a_n} \to q < 1$, izberi $r$ s $q < r < 1$. Za $n \ge N$ je $a_{n+1} \le r\,a_n$, torej $a_n \le a_N r^{n-N}$; primerjava z geometrijsko vrsto da konvergenco.

**Riemannov izrek (skica).** Naj $\sum a_n$ konvergira pogojno in naj bo $c \in \mathbb R$. Označimo s $p_k$ pozitivne in z $-m_k$ negativne člene. Obe vrsti $\sum p_k$ in $\sum m_k$ divergirata, $p_k, m_k \to 0$. Jemljemo pozitivne člene, dokler delna vsota ne preseže $c$, nato negativne, dokler ne pade pod $c$, in ponavljamo. Odmik od $c$ je po vsakem preskoku največ zadnji uporabljeni člen, ta pa gre proti $0$.

**Dirichletov izrek.** Če $\sum a_n$ konvergira absolutno, ima vsaka preureditev isto vsoto. Dokaz: za $\varepsilon > 0$ izberi $N$ z $\sum_{n > N} |a_n| < \varepsilon$. Ko preurejena vrsta vsebuje vse člene $a_1, \ldots, a_N$, se od $S$ razlikuje za manj kot $2\varepsilon$.

## Preveri se

? Katera vrsta ne sodi med ostale?
- $\sum \dfrac{(-1)^n}{n^2}$
~ $\sum \frac{1}{n^2}$ konvergira ($p = 2 > 1$), zato ta vrsta konvergira absolutno, kot še dve izmed ostalih.
- $\sum \dfrac{(-1)^n}{2^n}$
~ Geometrijska vrsta s $|q| = \frac12$ konvergira absolutno.
+ $\sum \dfrac{(-1)^n}{n}$
- $\sum \dfrac{(-1)^n}{n!}$
~ Kvocientni kriterij da $q = 0$, zato vrsta konvergira absolutno.
> Edina konvergira le pogojno: $\sum \frac1n$ divergira, Leibniz pa zagotovi konvergenco.

? Koliko prvih členov vrste $\sum \frac{(-1)^{n+1}}{n^2}$ zadošča, da je napaka zagotovo največ $0{,}01$?
- $10$
~ Vzel si $|a_n| \le 0{,}01$ namesto prvega izpuščenega člena $a_{n+1}$.
+ $9$
- $99$
~ Tako bi bilo pri členih $\frac1n$. Tu so členi $\frac{1}{n^2}$, ki padajo hitreje.
- $100$
~ To je $n^2$ pri $n = 10$, ne število členov; poleg tega meri napako $a_{n+1}$, ne $a_n$.
> Leibniz: $|S - S_n| \le \frac{1}{(n+1)^2} \le 0{,}01$, torej $n + 1 \ge 10$ in $n \ge 9$.

? Vrsta $\sum a_n$ konvergira pogojno. Kaj iz tega sledi za vsoto samo njenih pozitivnih členov?
- Konvergira, ker konvergira cela vrsta.
~ Če bi pozitivni del konvergiral, bi konvergiral tudi negativni in s tem $\sum|a_n|$; to bi bila absolutna konvergenca.
+ Divergira proti $+\infty$.
- Konvergira proti polovici vsote vrste.
~ Ni razloga za polovico; pozitivni in negativni del sta oba neskončna.
> Pri pogojni konvergenci sta vsoti pozitivnih in negativnih členov obe neskončni; prav zato Riemannov izrek dovoli preureditev do poljubne vsote.

? Rešitev: »1) Za $\sum\frac1n$ je $\frac{a_{n+1}}{a_n} = \frac{n}{n+1}$. 2) To je manjše od $1$ za vsak $n$. 3) Po kvocientnem kriteriju vrsta konvergira.« Kateri korak je napačen?
- Korak 1
~ Kvocient je pravilno izračunan: $\frac{1/(n+1)}{1/n} = \frac{n}{n+1}$.
- Korak 2
~ Neenakost $\frac{n}{n+1} < 1$ res velja za vsak $n$.
+ Korak 3
> Kriterij zahteva limito $q < 1$; tu je $q = \lim \frac{n}{n+1} = 1$, kriterij ne odloči, harmonična vrsta pa divergira.

? V igri igralec v $n$-tem krogu dobi ali izgubi $\frac{10}{2^n}$ točk, odvisno od izida. Ali lahko strežnik, ki sešteva kroge v drugačnem vrstnem redu, dobi drugačen končni rezultat?
- Da, neskončne vsote se ob preureditvi vedno lahko spremenijo.
~ To velja le za pogojno konvergentne vrste. Tu je $\sum \frac{10}{2^n} = 10$ končna.
- Da, če je minusov več kot plusov.
~ Razmerje predznakov ne vpliva; odloča, ali konvergira vsota absolutnih vrednosti.
+ Ne, ker vrsta konvergira absolutno.
> $\sum |a_n| = \sum \frac{10}{2^n} = 10$ konvergira, zato ima vsaka preureditev isto vsoto (Dirichlet).

:::simboli
n | zaporedna številka člena
a_n, a_{n+1} | n-ti (in naslednji) člen vrste
S | vsota vrste
S_n | n-ta delna vsota | S_n = a_1 + a_2 + \dots + a_n | | napako ocenimo z razliko S − Sₙ
p | eksponent v vrsti 1/nᵖ | | | konvergira za p > 1
q | limita kvocienta (korena) členov | q = \lim\limits_{n\to\infty} \dfrac{\lvert a_{n+1} \rvert}{\lvert a_n \rvert} | | q < 1 konvergira, q > 1 divergira
:::
