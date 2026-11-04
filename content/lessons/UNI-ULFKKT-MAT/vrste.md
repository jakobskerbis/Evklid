---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ali lahko seštejemo neskončno mnogo števil in dobimo končen rezultat? Že v gimnaziji si videl, da je $0{,}\overline{3} = 0{,}3 + 0{,}03 + 0{,}003 + \dots = \tfrac13$. Tak neskončen seštevek imenujemo **vrsta**. Vrste so eno osrednjih orodij matematične analize in njenih uporab: z njimi računamo vrednosti funkcij, kot so $\mathrm{e}^x$, $\sin x$ in $\ln x$ (tako to počne kalkulator), rešujemo diferencialne enačbe, približno računamo integrale, ki jih ne znamo izračunati natančno, in opisujemo periodične pojave.

V uporabi vrste srečaš na vsakem koraku: pri kopičenju zdravila v telesu ob rednem jemanju, pri obrestnem računu, pri populacijskih modelih v biologiji, pri približkih v fiziki in kemiji (»za majhne $x$ je $\ln(1 + x) \approx x$«) in pri ocenjevanju napake numeričnih metod. Ključno vprašanje je vedno isto: ali vrsta **konvergira** in koliko je njena vsota.

Naučil se boš:

- kaj je **številska vrsta**, njene **delne vsote** in kdaj **konvergira**,
- sešteti **geometrijsko vrsto**,
- uporabljati **kriterije konvergence** (potrebni pogoj, primerjalni, kvocientni, korenski, integralski, Leibnizov),
- ločiti **absolutno** in **pogojno konvergenco**,
- določiti **konvergenčni polmer** in območje **potenčne vrste**.

## Razlaga

**1. Številska vrsta in delne vsote.** Naj bo $(a_n)_{n \ge 1}$ zaporedje realnih števil. Izraz

$$\sum_{n=1}^{\infty} a_n = a_1 + a_2 + a_3 + \dots$$

imenujemo **številska vrsta**, $a_n$ je njen **splošni člen**. Za vsak $n$ definiramo **delno vsoto** $S_n = a_1 + a_2 + \dots + a_n$. Vrsta **konvergira**, če zaporedje delnih vsot $(S_n)$ konvergira; limito $S = \lim_{n \to \infty} S_n$ imenujemo **vsota vrste** in pišemo $\sum a_n = S$. Če limita ne obstaja (ali je neskončna), vrsta **divergira**.

Vrsta je torej le drug zapis za zaporedje delnih vsot. Vsota vrste ni »seštevek neskončno členov«, ampak limita.

**2. Geometrijska vrsta.** Za $a \ne 0$ in količnik $q$ je

$$\sum_{n=0}^{\infty} a\,q^n = a + aq + aq^2 + \dots$$

*Izrek.* Naj bo $a \ne 0$. Geometrijska vrsta konvergira natanko tedaj, ko je $|q| < 1$, in tedaj je

$$\sum_{n=0}^{\infty} a\,q^n = \frac{a}{1 - q}, \qquad |q| < 1.$$

*Dokaz.* Za $q \ne 1$ odštejemo $S_n = a + aq + \dots + aq^n$ in $qS_n = aq + \dots + aq^{n+1}$: $(1 - q)S_n = a(1 - q^{n+1})$, torej $S_n = a\,\dfrac{1 - q^{n+1}}{1 - q}$. Če je $|q| < 1$, gre $q^{n+1} \to 0$ in $S_n \to \frac{a}{1 - q}$. Če je $|q| \ge 1$, je $|aq^n| \ge |a| > 0$, členi ne gredo proti $0$ in vrsta po potrebnem pogoju (točka 4) divergira. Pravilo »vsota = prvi člen deljeno z $(1 - q)$« velja ne glede na to, pri katerem indeksu se vrsta začne.

:::premisli
Koliko je $0{,}\overline{9} = 0{,}9 + 0{,}09 + 0{,}009 + \dots$? Ali je res manj kot $1$?
---
To je geometrijska vrsta s prvim členom $0{,}9$ in $q = 0{,}1$, zato je vsota $\frac{0{,}9}{1 - 0{,}1} = 1$. Vsaka delna vsota je manjša od $1$, limita delnih vsot pa je natanko $1$.
:::

**3. Lastnosti.** Če konvergirata $\sum a_n$ in $\sum b_n$, konvergira tudi $\sum(\alpha a_n + \beta b_n) = \alpha\sum a_n + \beta\sum b_n$. Konvergenca se ne spremeni, če spremenimo, dodamo ali odvzamemo končno mnogo členov (vsota se seveda spremeni).

**4. Potrebni pogoj.** *Izrek.* Če vrsta $\sum a_n$ konvergira, potem je $\lim_{n \to \infty} a_n = 0$. *Dokaz:* $a_n = S_n - S_{n-1} \to S - S = 0$. Obratno ne velja: **harmonična vrsta** $\sum \dfrac1n$ ima $a_n \to 0$, pa vendar divergira, ker je $S_{2^k} = 1 + \frac12 + \big(\frac13 + \frac14\big) + \big(\frac15 + \dots + \frac18\big) + \dots \ge 1 + \frac{k}{2}$ (vsaka skupina prispeva vsaj $\frac12$), zato delne vsote niso omejene. Pogoj zato uporabljamo le za dokaz divergence: če $a_n \not\to 0$, vrsta divergira.

**5. Vrste s pozitivnimi členi.** Če je $a_n \ge 0$, so delne vsote naraščajoče; ker naraščajoče zaporedje konvergira natanko tedaj, ko je omejeno, vrsta konvergira natanko tedaj, ko so delne vsote omejene. Za takšne vrste imamo kriterije:

- **Primerjalni kriterij.** Naj bo $0 \le a_n \le b_n$ za vse dovolj velike $n$. Če $\sum b_n$ konvergira, konvergira tudi $\sum a_n$. Če $\sum a_n$ divergira, divergira tudi $\sum b_n$. *Dokaz:* delne vsote vrste $\sum a_n$ so (do končno mnogo začetnih členov) navzgor omejene z vsoto $\sum b_n$; drugi del je obrat prvega.
- **Limitni primerjalni kriterij.** Če je $a_n, b_n > 0$ in $\lim a_n/b_n = L$ z $0 < L < \infty$, vrsti hkrati konvergirata ali divergirata.
- **Kvocientni (d'Alembertov) kriterij.** Naj bo $a_n > 0$ in naj obstaja $L = \lim \dfrac{a_{n+1}}{a_n}$. Pri $L < 1$ vrsta konvergira, pri $L > 1$ divergira, pri $L = 1$ kriterij ne odloči. *Ideja dokaza:* pri $L < q < 1$ je od nekod $a_{n+1} \le q\,a_n$, zato vrsto navzgor omeji konvergentna geometrijska vrsta.
- **Korenski (Cauchyjev) kriterij.** Naj bo $a_n \ge 0$ in naj obstaja $L = \lim \sqrt[n]{a_n}$. Pri $L < 1$ konvergira, pri $L > 1$ divergira, pri $L = 1$ ne odloči.
- **Integralski kriterij.** Če je $f$ pozitivna in padajoča na $[1, \infty)$ in $a_n = f(n)$, potem $\sum a_n$ konvergira natanko tedaj, ko konvergira posplošeni integral $\int_1^\infty f(x)\,\mathrm{d}x$. *Dokaz:* ker $f$ pada, je $f(k + 1) \le \int_k^{k+1} f(x)\,\mathrm{d}x \le f(k)$; seštevek po $k = 1, \dots, n - 1$ da $S_n - a_1 \le \int_1^n f(x)\,\mathrm{d}x \le S_{n-1}$, zato so delne vsote omejene natanko tedaj, ko je omejen integral.

Iz integralskega kriterija dobimo pomembno družino za primerjanje: **posplošena harmonična vrsta**

$$\sum_{n=1}^{\infty} \frac{1}{n^p} \quad \text{konvergira natanko tedaj, ko je } p > 1.$$

Tako $\sum \frac{1}{n^2}$ konvergira (vsota je $\pi^2/6$), $\sum \frac{1}{\sqrt n}$ pa divergira.

**Kako izbrati kriterij.** Pri racionalnih izrazih v $n$ (npr. $\frac{n}{n^3 + 1}$) primerjaj s $\frac{1}{n^p}$, kjer je $p$ razlika stopenj imenovalca in števca. Pri potencah $c^n$ in fakultetah $n!$ uporabi kvocientni kriterij, pri izrazih oblike $(\dots)^n$ pa korenski kriterij.

:::premisli
Ali vrsta $\sum \frac{\sqrt n}{n^2 + 1}$ konvergira? S katero vrsto jo primerjaš?
---
Stopnja števca je $\frac12$, imenovalca $2$, zato primerjamo z $\frac{1}{n^{3/2}}$: $\frac{\sqrt n}{n^2 + 1} \cdot n^{3/2} = \frac{n^2}{n^2 + 1} \to 1$. Ker je $p = \frac32 > 1$, vrsta konvergira (limitni primerjalni kriterij).
:::

**6. Alternirajoče vrste.** Vrsta oblike $\sum (-1)^{n+1} b_n$ z $b_n > 0$ je **alternirajoča**. **Leibnizov kriterij:** naj bo $b_n > 0$, zaporedje $(b_n)$ padajoče in $\lim b_n = 0$; potem vrsta $\sum (-1)^{n+1} b_n$ konvergira in za napako velja ocena $|S - S_n| \le b_{n+1}$. (Dokaz je v Nalogi 2 razdelka Za izpit.) Primer: $1 - \frac12 + \frac13 - \frac14 + \dots$ konvergira (vsota je $\ln 2$).

**7. Absolutna in pogojna konvergenca.** Vrsta $\sum a_n$ **absolutno konvergira**, če konvergira $\sum |a_n|$. *Izrek:* **absolutna konvergenca implicira konvergenco**. *Dokaz:* $0 \le a_n + |a_n| \le 2|a_n|$, zato po primerjalnem kriteriju konvergira $\sum (a_n + |a_n|)$, in $\sum a_n = \sum (a_n + |a_n|) - \sum |a_n|$ je razlika konvergentnih vrst. Vrsta, ki konvergira, a ne absolutno, **pogojno konvergira**; primer je $\sum \frac{(-1)^{n+1}}{n}$. Pri absolutno konvergentnih vrstah lahko člene poljubno prerazporedimo in vsota ostane enaka, pri pogojno konvergentnih pa ne.

**8. Potenčne vrste.** Vrsta oblike

$$\sum_{n=0}^{\infty} c_n\,(x - x_0)^n$$

je **potenčna vrsta** s središčem $x_0$. *Izrek.* Za vsako potenčno vrsto obstaja **konvergenčni polmer** $R \in [0, \infty]$: vrsta absolutno konvergira za $|x - x_0| < R$ in divergira za $|x - x_0| > R$. *Jedro dokaza:* če vrsta konvergira v točki $x_1$, gredo členi $c_n (x_1 - x_0)^n$ proti $0$ (potrebni pogoj), zato so po absolutni vrednosti omejeni z nekim $M$; za $|x - x_0| < |x_1 - x_0|$ je zato $|c_n (x - x_0)^n| \le M\theta^n$ s $\theta = \frac{|x - x_0|}{|x_1 - x_0|} < 1$, kar je člen konvergentne geometrijske vrste. Na robu ($|x - x_0| = R$) lahko konvergira ali divergira, zato robni točki preverimo posebej. Polmer pogosto izračunamo s

$$R = \lim_{n \to \infty}\left|\frac{c_n}{c_{n+1}}\right| \qquad \text{ali} \qquad \frac1R = \lim_{n \to \infty}\sqrt[n]{|c_n|},$$

če limiti obstajata. Prva formula sledi iz kvocientnega kriterija za $\sum |c_n|\,|x - x_0|^n$: limita kvocientov je $\frac{|x - x_0|}{R}$, ki je manjša od $1$ natanko za $|x - x_0| < R$. Znane potenčne (Taylorjeve) vrste:

$$\frac{1}{1 - x} = \sum_{n=0}^\infty x^n\ (|x| < 1), \quad \mathrm{e}^x = \sum_{n=0}^\infty \frac{x^n}{n!}\ (x \in \mathbb{R}), \quad \ln(1 + x) = \sum_{n=1}^\infty \frac{(-1)^{n+1}x^n}{n}\ (-1 < x \le 1).$$

Znotraj konvergenčnega intervala lahko potenčno vrsto členoma odvajamo in integriramo; polmer se pri tem ne spremeni.

## Rešeni primeri

### Primer 1 (lažji)

Izračunaj vsoto vrste $\displaystyle\sum_{n=1}^{\infty} \frac{2^{n+1}}{3^n}$.

**Podatki:** splošni člen $a_n = \dfrac{2^{n+1}}{3^n}$, seštevamo od $n = 1$ do $\infty$
**Iščemo:** vsoto vrste $S$

:::formula
Geometrijska vrsta: $\displaystyle\sum a\,q^{k} = \frac{\text{prvi člen}}{1 - q}$ za $|q| < 1$.
:::

**Rešitev:**

1. Zapišemo člen kot potenco: $\dfrac{2^{n+1}}{3^n} = 2 \cdot \left(\dfrac23\right)^n$.
2. To je geometrijska vrsta s količnikom $q = \frac23$; ker je $|q| < 1$, konvergira.
3. Prvi člen ($n = 1$): $a_1 = 2 \cdot \frac23 = \frac43$.
4. Vsota: $S = \dfrac{4/3}{1 - 2/3} = \dfrac{4/3}{1/3} = 4$.
5. Preizkus z delnimi vsotami: $S_1 = 1{,}333$, $S_2 = 1{,}333 + 0{,}889 = 2{,}222$, $S_3 = 2{,}815$; vrednosti se bližajo $4$.
6. Odgovor: vrsta konvergira in njena vsota je $4$.

### Primer 2

Ugotovi, ali konvergirata vrsti (a) $\displaystyle\sum_{n=1}^{\infty} \frac{n}{n^2 + 1}$ in (b) $\displaystyle\sum_{n=1}^{\infty} \frac{n^2}{2^n}$.

**Podatki:** (a) $a_n = \dfrac{n}{n^2 + 1}$, (b) $a_n = \dfrac{n^2}{2^n}$; obe vrsti imata pozitivne člene, $n \ge 1$
**Iščemo:** konvergenco ali divergenco vsake vrste

:::formula
Limitni primerjalni kriterij: $\lim \dfrac{a_n}{b_n} = L \in (0, \infty)$ ⇒ $\sum a_n$ in $\sum b_n$ se obnašata enako. $\quad$ Kvocientni kriterij: $L = \lim \dfrac{a_{n+1}}{a_n} < 1$ ⇒ konvergenca.
:::

**Rešitev:**

1. (a) Za velike $n$ je $\dfrac{n}{n^2 + 1} \approx \dfrac{n}{n^2} = \dfrac1n$, zato primerjamo z $b_n = \frac1n$.
2. $\dfrac{a_n}{b_n} = \dfrac{n^2}{n^2 + 1} \to 1$, kar je med $0$ in $\infty$.
3. Harmonična vrsta $\sum \frac1n$ divergira, zato divergira tudi vrsta (a), čeprav $a_n \to 0$.
4. (b) Zaradi potence $2^n$ uporabimo kvocientni kriterij: $\dfrac{a_{n+1}}{a_n} = \dfrac{(n+1)^2}{2^{n+1}} \cdot \dfrac{2^n}{n^2} = \dfrac12\left(1 + \dfrac1n\right)^2$.
5. Limita: $L = \frac12 \cdot 1 = \frac12 < 1$, zato vrsta (b) konvergira.
6. Odgovor: vrsta (a) divergira, vrsta (b) konvergira (njena vsota je, kot lahko pokažemo z odvajanjem geometrijske vrste, enaka $6$).

### Primer 3 (težji)

Določi konvergenčni polmer in konvergenčno območje potenčne vrste $\displaystyle\sum_{n=1}^{\infty} \frac{(x - 2)^n}{n \cdot 3^n}$. V katerih točkah vrsta konvergira absolutno in v katerih pogojno? Izračunaj vsoto vrste $S(x)$ na vsem konvergenčnem območju in z njo vsoto v levi robni točki.

**Podatki:** potenčna vrsta s koeficienti $c_n = \dfrac{1}{n \cdot 3^n}$ in središčem $x_0 = 2$, $n \ge 1$
**Iščemo:** konvergenčni polmer $R$, konvergenčno območje, vrsto konvergence v robnih točkah, vsoto $S(x)$

:::formula
$R = \lim\limits_{n \to \infty}\left|\dfrac{c_n}{c_{n+1}}\right|$; robni točki $x_0 \pm R$ preverimo posebej (posplošena harmonična vrsta, Leibnizov kriterij); $\ln(1 + u) = \sum_{n=1}^\infty \frac{(-1)^{n+1}u^n}{n}$ za $-1 < u \le 1$.
:::

**Rešitev:**

1. $\dfrac{c_n}{c_{n+1}} = \dfrac{(n+1)\,3^{n+1}}{n\,3^n} = 3 \cdot \dfrac{n+1}{n} \to 3$, torej $R = 3$.
2. Vrsta absolutno konvergira za $|x - 2| < 3$, tj. za $-1 < x < 5$, in divergira za $|x - 2| > 3$.
3. Rob $x = 5$: $(x - 2)^n = 3^n$, vrsta je $\sum \dfrac{3^n}{n\,3^n} = \sum \dfrac1n$, harmonična vrsta, ki divergira.
4. Rob $x = -1$: $(x - 2)^n = (-3)^n$, vrsta je $\sum \dfrac{(-1)^n}{n} = -\sum \dfrac{(-1)^{n+1}}{n}$. Ker $\frac1n$ monotono pada proti $0$, po Leibnizovem kriteriju konvergira; vrsta absolutnih vrednosti $\sum \frac1n$ pa divergira, zato je konvergenca pogojna.
5. Vsota: označimo $t = \frac{x - 2}{3}$; člen je $\frac{t^n}{n}$, območje $[-1, 5)$ pa ustreza $-1 \le t < 1$.
6. V vrsto za $\ln(1 + u)$ vstavimo $u = -t$: $\ln(1 - t) = \sum \frac{(-1)^{n+1}(-t)^n}{n} = -\sum \frac{t^n}{n}$, kar velja za $-1 < -t \le 1$, torej ravno za $-1 \le t < 1$.
7. Zato je $S(x) = -\ln\big(1 - \frac{x - 2}{3}\big) = \ln\dfrac{3}{5 - x}$ za $-1 \le x < 5$. Preizkus: $S(2) = \ln 1 = 0$, kar se ujema, saj so pri $x = 2$ vsi členi $0$.
8. Leva robna točka: $S(-1) = \ln\frac{3}{6} = -\ln 2 \approx -0{,}693$. Delne vsote $-1$; $-0{,}5$; $-0{,}833$; $-0{,}583$ res nihajo okoli te vrednosti, kot napove Leibnizova ocena.
9. Odgovor: $R = 3$; vrsta konvergira na intervalu $[-1, 5)$, absolutno na $(-1, 5)$, v točki $x = -1$ pogojno, v $x = 5$ in zunaj intervala divergira; vsota je $S(x) = \ln\frac{3}{5 - x}$, v $x = -1$ je $-\ln 2$.

## Pogoste napake

- **»Členi gredo proti nič, torej vrsta konvergira.«** Napačno: harmonična vrsta je protiprimer. Pogoj $a_n \to 0$ je le potreben.
- **Zamenjava zaporedja in vrste.** Zaporedje $a_n = \frac1n$ konvergira (proti $0$), vrsta $\sum \frac1n$ pa divergira. Pri vrsti nas zanima limita delnih vsot.
- **Geometrijska vrsta z napačnim prvim členom.** Pri $\sum_{n=1}^\infty q^n$ je prvi člen $q$, ne $1$, zato je vsota $\dfrac{q}{1 - q}$.
- **Kvocientni kriterij pri $L = 1$.** Pri $L = 1$ ne moremo sklepati nič; tako $\sum \frac1n$ kot $\sum \frac1{n^2}$ imata $L = 1$, prva divergira, druga konvergira.
- **Pozabljeni robovi potenčne vrste.** Kvocientni kriterij da le odprti interval. Robni točki je treba preveriti z drugimi kriteriji.
- **Primerjalni kriterij v napačno smer.** Če je $a_n \le b_n$ in $\sum b_n$ **divergira**, o $\sum a_n$ ne vemo nič. Manjša vrsta podeduje konvergenco, večja divergenco.
- **Primerjalni kriteriji za vrste z negativnimi členi.** Kriteriji iz točke 5 veljajo za vrste s pozitivnimi členi. Za druge vrste jih uporabi na $\sum |a_n|$ (absolutna konvergenca).

## Povzetek

- $\sum a_n$ konvergira, če konvergirajo delne vsote $S_n = a_1 + \dots + a_n$; vsota je $\lim S_n$.
- Geometrijska vrsta: $\sum_{n=0}^\infty aq^n = \dfrac{a}{1 - q}$ za $|q| < 1$, sicer divergira.
- Potrebni pogoj: konvergenca ⇒ $a_n \to 0$ (obratno ne velja).
- $\sum \frac{1}{n^p}$ konvergira natanko za $p > 1$; harmonična vrsta divergira.
- Kriteriji za pozitivne vrste: primerjalni, limitni primerjalni, kvocientni, korenski ($L < 1$ konv., $L > 1$ div., $L = 1$ ne odloči), integralski. Alternirajoče: Leibnizov.
- Absolutna konvergenca ($\sum |a_n|$ konv.) ⇒ konvergenca; konvergentna, a ne absolutno: pogojna.
- Potenčna vrsta $\sum c_n(x - x_0)^n$ ima polmer $R$ ($R = \lim |c_n/c_{n+1}|$); robne točke preveri posebej.

## Za izpit

Znati moraš povedati:

- definicijo konvergence in vsote vrste ter izrek o geometrijski vrsti z dokazom;
- potrebni pogoj konvergence z dokazom in dokaz, da harmonična vrsta divergira;
- primerjalni, kvocientni, korenski in integralski kriterij z vsemi pogoji (pozitivni členi, monotonost) in dokaz primerjalnega in integralskega;
- Leibnizov kriterij z oceno napake in dokazom ter izrek »absolutna konvergenca ⇒ konvergenca« z dokazom;
- izrek o konvergenčnem polmeru potenčne vrste ter členoma odvajanje in integriranje znotraj intervala.

### Naloga 1

Dana je potenčna vrsta $\displaystyle\sum_{n=1}^{\infty} n^2 x^n$. (a) Določi konvergenčni polmer in konvergenčno območje. (b) Z odvajanjem geometrijske vrste izračunaj njeno vsoto za $|x| < 1$. (c) Izračunaj $\displaystyle\sum_{n=1}^{\infty} \frac{n^2}{2^n}$ in $\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^n n^2}{3^n}$.

**Rešitev:**

1. (a) $\left|\dfrac{c_n}{c_{n+1}}\right| = \dfrac{n^2}{(n + 1)^2} \to 1$, torej $R = 1$.
2. Robni točki: pri $x = \pm 1$ so členi $n^2(\pm 1)^n$ po absolutni vrednosti enaki $n^2 \not\to 0$, zato vrsta po potrebnem pogoju divergira. Območje je $(-1, 1)$.
3. (b) Za $|x| < 1$ je $\sum_{n=0}^\infty x^n = \frac{1}{1 - x}$. Odvajamo členoma (polmer se ne spremeni) in pomnožimo z $x$: $\sum_{n=1}^\infty n x^n = \dfrac{x}{(1 - x)^2}$.
4. Še enkrat odvajamo: $\Big(\dfrac{x}{(1 - x)^2}\Big)' = \dfrac{(1 - x)^2 + 2x(1 - x)}{(1 - x)^4} = \dfrac{1 + x}{(1 - x)^3}$, kar je $\sum_{n=1}^\infty n^2 x^{n-1}$.
5. Pomnožimo z $x$: $\displaystyle\sum_{n=1}^\infty n^2 x^n = \frac{x(1 + x)}{(1 - x)^3}$ za $|x| < 1$.
6. (c) Pri $x = \frac12$: $\dfrac{\frac12 \cdot \frac32}{\left(\frac12\right)^3} = \dfrac{3/4}{1/8} = 6$, kar potrdi trditev iz Primera 2.
7. Pri $x = -\frac13$: $\dfrac{-\frac13 \cdot \frac23}{\left(\frac43\right)^3} = \dfrac{-2/9}{64/27} = -\dfrac{3}{32} = -0{,}09375$.
8. Odgovor: $R = 1$, območje $(-1, 1)$, vsota $\frac{x(1 + x)}{(1 - x)^3}$; $\sum \frac{n^2}{2^n} = 6$ in $\sum \frac{(-1)^n n^2}{3^n} = -\frac{3}{32}$.

### Naloga 2

Natančno navedi Leibnizov kriterij in ga dokaži skupaj z oceno napake. Koliko členov vrste $\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n^2}$ moramo sešteti, da je napaka zagotovo manjša od $10^{-3}$?

**Rešitev:**

1. Izrek: naj bo $b_n > 0$, $(b_n)$ padajoče in $\lim b_n = 0$. Potem $\sum (-1)^{n+1} b_n$ konvergira in $|S - S_n| \le b_{n+1}$.
2. Sode delne vsote: $S_{2m} = (b_1 - b_2) + (b_3 - b_4) + \dots + (b_{2m-1} - b_{2m})$; vsak oklepaj je $\ge 0$, zato $(S_{2m})$ narašča.
3. Hkrati $S_{2m} = b_1 - (b_2 - b_3) - \dots - (b_{2m-2} - b_{2m-1}) - b_{2m} \le b_1$, zato je $(S_{2m})$ omejeno in konvergira proti neki $S$.
4. Lihe: $S_{2m+1} = S_{2m} + b_{2m+1} \to S + 0 = S$. Ker sode in lihe delne vsote konvergirajo proti $S$, je $\lim S_n = S$.
5. Ocena: na enak način lihe delne vsote padajo. Sode torej naraščajo proti $S$, lihe padajo proti $S$, zato je $S_{2m} \le S \le S_{2m+1}$ in $S$ vedno leži med zaporednima delnima vsotama $S_n$ in $S_{n+1}$, torej $|S - S_n| \le |S_{n+1} - S_n| = b_{n+1}$.
6. Za $b_n = \frac{1}{n^2}$ so pogoji izpolnjeni. Zahtevamo $b_{n+1} = \frac{1}{(n + 1)^2} < 10^{-3}$, torej $(n + 1)^2 > 1000$. Ker je $31^2 = 961$ in $32^2 = 1024$, mora biti $n + 1 \ge 32$.
7. Odgovor: zadošča $31$ členov (napaka je tedaj manjša od $\frac{1}{1024} < 10^{-3}$; prava vsota je $\frac{\pi^2}{12} \approx 0{,}8225$).

### Naloga 3

Utemelji, ali velja: (a) če je $a_n > 0$ in $\sum a_n$ konvergira, konvergira tudi $\sum a_n^2$; (b) če $\sum a_n$ konvergira (členi so lahko poljubnega predznaka), konvergira tudi $\sum a_n^2$.

**Rešitev:**

1. (a) Velja. Ker vrsta konvergira, je $a_n \to 0$ (potrebni pogoj), zato je od nekega $N$ naprej $0 < a_n < 1$.
2. Za $n \ge N$ je tedaj $a_n^2 = a_n \cdot a_n \le a_n$, po primerjalnem kriteriju konvergira $\sum a_n^2$.
3. (b) Ne velja. Protiprimer: $a_n = \frac{(-1)^{n+1}}{\sqrt n}$; $\frac{1}{\sqrt n}$ pada proti $0$, zato $\sum a_n$ konvergira po Leibnizu.
4. Toda kvadrati členov so $\frac{1}{n}$, vrsta kvadratov je torej harmonična in divergira.
5. Odgovor: (a) velja, (b) ne velja; v (a) je bistvena pozitivnost členov, v (b) konvergenca izhaja le iz izmeničnih predznakov.

## Drugače: Na sliki

Vrsto $\sum_{n=1}^\infty \frac{1}{2^n} = \frac12 + \frac14 + \frac18 + \dots$ si predstavljaj kot daljico z dolžino $1$. Najprej pobarvaš polovico, nato polovico preostanka, nato spet polovico preostanka:

```
|<------------------- 1 ------------------->|
[################||########||####||##||#|...]
       1/2            1/4      1/8  1/16
```

Pobarvani del se bliža celi daljici, a je nikoli ne preseže: delne vsote $0{,}5$; $0{,}75$; $0{,}875$; $0{,}9375$ se bližajo $1$.

Delne vsote si lahko narišeš tudi kot točke $(n, S_n)$. Pri konvergentni vrsti se točke bližajo vodoravni premici $y = S$. Pri harmonični vrsti točke rastejo vse počasneje (kot $\ln n$), a ne obstanejo: po milijonu členov je $S_n \approx 14{,}4$, po milijardi približno $21$, in tako naprej brez meje.

## Drugače: Uporaba v stroki

**Farmakokinetika.** Bolnik vsakih $12\,\mathrm{h}$ vzame $100\,\mathrm{mg}$ zdravila. V $12$ urah se izloči toliko, da ostane $25\,\%$ prejšnje količine. Tik po $n$-tem odmerku je v telesu $100 + 100 \cdot 0{,}25 + 100 \cdot 0{,}25^2 + \dots + 100 \cdot 0{,}25^{n-1}\,\mathrm{mg}$. Po dolgem času je to geometrijska vrsta z vsoto $\dfrac{100}{1 - 0{,}25} \approx 133\,\mathrm{mg}$ (največja količina), tik pred odmerkom pa $133 - 100 = 33\,\mathrm{mg}$ (najmanjša). Farmakologi tako določajo odmerke, da je stacionarna koncentracija v terapevtskem območju.

**Fizikalna kemija.** Nihajna particijska funkcija dvoatomne molekule je geometrijska vrsta: $q = \sum_{v=0}^\infty e^{-vx} = \frac{1}{1 - e^{-x}}$ z $x = \frac{hc\tilde\nu}{k_\mathrm{B}T}$. Za $\mathrm{I_2}$ ($\tilde\nu = 214\,\mathrm{cm^{-1}}$) pri $298\,\mathrm{K}$ je $x \approx 1{,}033$, $q \approx 1{,}55$, v osnovnem nihajnem stanju pa je delež $\frac{1}{q} \approx 0{,}64$ molekul. Iz $q$ nato izračunamo nihajni prispevek k notranji energiji in entropiji.

**Približki z oceno napake.** Iz $\ln(1 - x) = -x - \frac{x^2}{2} - \dots$ dobimo za razredčene raztopine z molskim deležem topljenca $x_B$ približek $\ln(1 - x_B) \approx -x_B$, na katerem slonijo izpeljave znižanja tališča, zvišanja vrelišča in osmoznega tlaka. Pri $x_B = 0{,}01$ je prvi izpuščeni člen $5 \cdot 10^{-5}$, torej je relativna napaka približka okoli $0{,}5\,\%$.

## Drugače: Korak za korakom s številkami

Seštej vrsto $\displaystyle\sum_{n=1}^{\infty} \frac{1}{n(n+1)}$ prek delnih vsot.

1. **Razstavimo člen** na delne ulomke: $\dfrac{1}{n(n+1)} = \dfrac1n - \dfrac{1}{n+1}$ (preizkus: $\dfrac{(n+1) - n}{n(n+1)}$).
2. **Prve delne vsote numerično:** $S_1 = 0{,}5$, $S_2 = 0{,}5 + 0{,}1667 = 0{,}6667$, $S_3 = 0{,}75$, $S_4 = 0{,}8$.
3. **Splošna delna vsota:** $S_n = \left(1 - \tfrac12\right) + \left(\tfrac12 - \tfrac13\right) + \dots + \left(\tfrac1n - \tfrac{1}{n+1}\right)$. Notranji členi se odštejejo (**teleskopska vsota**), ostane $S_n = 1 - \dfrac{1}{n+1} = \dfrac{n}{n+1}$.
4. **Preizkus:** $S_4 = \frac45 = 0{,}8$ in $S_{10} = \frac{10}{11} = 0{,}9091$.
5. **Limita:** $S = \lim_{n \to \infty} \dfrac{n}{n+1} = 1$.
6. **Primerjava:** ker je $\frac{1}{n(n+1)} \le \frac{1}{n^2}$ in obratno $\frac{1}{n^2} \le \frac{2}{n(n+1)}$, iz te vrste po primerjalnem kriteriju sledi tudi konvergenca $\sum \frac{1}{n^2}$.

## Drugače: Bolj natančno

**Cauchyjev pogoj.** Ker je $\mathbb{R}$ poln, zaporedje konvergira natanko tedaj, ko je Cauchyjevo. Za vrste: $\sum a_n$ konvergira natanko tedaj, ko za vsak $\varepsilon > 0$ obstaja $N$, da je

$$\left|a_{n+1} + a_{n+2} + \dots + a_{m}\right| < \varepsilon \qquad \text{za vse } m > n \ge N.$$

Za $m = n + 1$ dobimo $|a_{n+1}| < \varepsilon$, kar je dokaz potrebnega pogoja $a_n \to 0$.

**Harmonična vrsta divergira.** Združimo člene v skupine dolžine $2^k$:

$$S_{2^k} = 1 + \tfrac12 + \left(\tfrac13 + \tfrac14\right) + \left(\tfrac15 + \dots + \tfrac18\right) + \dots \ge 1 + \tfrac12 + \tfrac12 + \dots + \tfrac12 = 1 + \tfrac{k}{2}.$$

Delne vsote torej niso omejene. Pri $\sum \frac{1}{n^p}$ s $p > 1$ isti način (skupine od $2^k$ do $2^{k+1} - 1$) da zgornjo mejo z geometrijsko vrsto s količnikom $2^{1-p} < 1$.

**Absolutna konvergenca ⇒ konvergenca.** Če $\sum |a_n|$ konvergira, je za $m > n \ge N$: $\left|\sum_{k=n+1}^m a_k\right| \le \sum_{k=n+1}^m |a_k| < \varepsilon$ (trikotniška neenakost in Cauchyjev pogoj za $\sum |a_n|$). Torej $\sum a_n$ zadošča Cauchyjevemu pogoju.

**Dokaz kvocientnega kriterija.** Naj bo $\lim a_{n+1}/a_n = L < 1$ in izberimo $q$ z $L < q < 1$. Od nekega $N$ naprej je $a_{n+1} \le q\,a_n$, torej $a_{N+k} \le a_N q^k$. Vrsta je od $N$ naprej omejena z geometrijsko vrsto $a_N\sum q^k$, ki konvergira. Pri $L > 1$ členi od nekod naraščajo, zato $a_n \not\to 0$.

**Riemannov izrek o prerazporeditvi.** Če vrsta pogojno konvergira, lahko njene člene prerazporedimo tako, da vsota postane katerokoli vnaprej izbrano realno število ali pa vrsta divergira. Pogojno konvergentnih vrst zato ne smemo obravnavati kot končnih vsot.

**Cauchy-Hadamardova formula.** Konvergenčni polmer potenčne vrste je vedno

$$\frac{1}{R} = \limsup_{n \to \infty} \sqrt[n]{|c_n|}$$

(z dogovorom $1/0 = \infty$, $1/\infty = 0$), tudi kadar navadna limita ne obstaja. Na vsakem zaprtem intervalu $[x_0 - r, x_0 + r]$ z $r < R$ vrsta konvergira **enakomerno** (Weierstrassov kriterij s primerjalno vrsto $\sum |c_n| r^n$). Zato je vsota potenčne vrste zvezna in jo smemo znotraj $(x_0 - R, x_0 + R)$ členoma odvajati in integrirati.

## Preveri se

? Koliko je vsota vrste $\displaystyle\sum_{n=0}^{\infty} \left(\frac13\right)^n$?
- $\dfrac12$
+ $\dfrac32$
- $3$
> Geometrijska vrsta s prvim členom $1$ in $q = \frac13$: $\dfrac{1}{1 - 1/3} = \dfrac32$. $\frac12$ bi dobil, če bi seštevanje začel pri $n = 1$.

? Katera vrsta divergira?
+ $\displaystyle\sum_{n=1}^{\infty} \frac{1}{\sqrt n}$
- $\displaystyle\sum_{n=1}^{\infty} \frac{1}{n^2}$
- $\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n}$
> $\sum \frac{1}{n^p}$ konvergira le za $p > 1$; pri $\frac{1}{\sqrt n}$ je $p = \frac12$. Vrsta $\sum \frac{1}{n^2}$ konvergira ($p = 2$), alternirajoča harmonična pa po Leibnizu (pogojno).

? Za vrsto $\sum a_n$ vemo, da je $\lim_{n \to \infty} a_n = 0$. Kaj lahko sklepamo?
- Vrsta zagotovo konvergira.
- Vrsta zagotovo divergira.
+ Iz tega ne moremo sklepati, ali vrsta konvergira.
> Pogoj $a_n \to 0$ je potreben, ni pa zadosten: $\sum \frac1{n^2}$ konvergira, $\sum \frac1n$ divergira, pri obeh pa členi gredo proti $0$.

? Kolikšen je konvergenčni polmer potenčne vrste $\displaystyle\sum_{n=0}^{\infty} \frac{x^n}{n!}$?
- $R = 0$
- $R = 1$
+ $R = \infty$
> $\left|\dfrac{c_n}{c_{n+1}}\right| = \dfrac{(n+1)!}{n!} = n + 1 \to \infty$. Vrsta konvergira za vsak realni $x$; njena vsota je $\mathrm{e}^x$.

:::simboli
n | indeks (zaporedna številka) člena | | |
a_n | splošni člen vrste | | | potreben pogoj konvergence: aₙ → 0
a_1, a_2, a_3 | prvi, drugi in tretji člen vrste | | |
a | prvi člen geometrijske vrste | | | a ≠ 0
q | količnik geometrijske vrste | | | vrsta konvergira za |q| < 1
p | eksponent v vrsti Σ 1/nᵖ | | | konvergira natanko za p > 1
c_n | koeficienti potenčne vrste | | |
x | spremenljivka potenčne vrste | | |
x_0 | središče potenčne vrste | | |
R | konvergenčni polmer | R = \lim_{n \to \infty}\left\lvert\frac{c_n}{c_{n+1}}\right\rvert | | konvergenca za |x − x₀| < R
c_{n+1} | naslednji koeficient potenčne vrste | | |
a_{n+1}, a_{n+2}, a_m | členi vrste za indeksom n | | |
\varepsilon | poljubno majhno pozitivno število | | | ε > 0
m | indeks, večji od n (Cauchyjev pogoj) | | |
N | indeks, od katerega naprej velja ocena | | |
S_{2^k} | delna vsota prvih 2ᵏ členov harmonične vrste | | | vsaj 1 + k/2, zato vrsta divergira
k | eksponent v potenci (2ᵏ oziroma qᵏ) | | |
b_n | splošni člen primerjalne vrste | | |
L | limita kvocienta pri kriterijih | L = \lim \dfrac{a_{n+1}}{a_n} | | L < 1: konvergenca; pri limitnem primerjalnem L = lim aₙ/bₙ
u | spremenljivka v vrsti za ln(1 + u) | | | −1 < u ≤ 1
t | nova spremenljivka v Primeru 3 | t = \frac{x - 2}{3} | |
S | vsota vrste; S(x) vsota potenčne vrste | S = \lim_{n \to \infty} S_n | |
S_n | n-ta delna vsota | S_n = a_1 + a_2 + \dots + a_n | |
\theta | količnik primerjalne geometrijske vrste | | | 0 ≤ θ < 1
:::
