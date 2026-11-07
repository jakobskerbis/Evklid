---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ekonomisti in teoretiki iger poznajo postopek **iterativnega izločanja strogo dominiranih strategij**: v vsakem krogu iz igre odstranimo strategije, ki so slabše od neke druge ne glede na to, kaj igrajo nasprotniki, in ponavljamo. V končni igri se postopek ustavi po končno mnogo krogih. Pri igrah z neskončno mnogo strategijami (na primer ponudbe cen v neskončno majhnih korakih) pa so našli primere, kjer se po krogih $0, 1, 2, \dots$ postopek še ne ustavi: ko »opravimo vse kroge z naravnimi števili«, se v novem stanju pokažejo nove dominirane strategije. Potreben je krog *po vseh naravnih številih*, nato še eden in tako naprej.

Naravna števila tu odpovejo kot števec: ne poznajo »koraka po vseh korakih«. Za takšne postopke potrebujemo **ordinalna števila**, ki štejejo *mesto* v vrsti, tudi onkraj neskončnosti, in **transfinitno indukcijo**, s katero o njih dokazujemo. Ob tem natančno ločimo dve vprašanji, ki ju pri končnih množicah ne ločimo: *koliko* je elementov (kardinalno število) in *v kakšnem vrstnem redu* so (ordinalno število).

## Razlaga

Gradimo v majhnih blokih. Za vsakim je vprašanje za preverjanje v eni vrstici.

### Blok 1: dobra urejenost

**Definicija.** Linearna urejenost $(W, <)$ je **dobra urejenost**, če ima vsaka neprazna podmnožica $W$ najmanjši element.

- $(\mathbb N, <)$ je dobro urejena: to je načelo najmanjšega elementa, enakovredno indukciji.
- $(\mathbb Z, <)$ ni: podmnožica negativnih števil nima najmanjšega.
- $([0, 1], <)$ ni: interval $(0, 1]$ nima najmanjšega elementa.
- $\mathbb N$, urejen tako, da je $0$ za vsemi ostalimi ($1 < 2 < 3 < \dots < 0$), je dobro urejen.

**Trditev.** V dobro urejeni množici ni neskončnega strogo padajočega zaporedja $x_0 > x_1 > x_2 > \dots$.

*Dokaz.* Množica $\{x_0, x_1, \dots\}$ je neprazna, zato ima najmanjši element $x_k$. Toda $x_{k+1} < x_k$, protislovje. $\square$

Velja tudi obrat (za dokaz potrebujemo šibko obliko aksioma izbire), zato si dobro urejenost lahko predstavljaš tako: navzdol lahko greš le končno mnogo korakov.

*Preveri:* Je $\{1 - \frac{1}{n} ;\ n \ge 1\} \cup \{1\}$ z običajno urejenostjo dobro urejena? (Da: vsaka neprazna podmnožica ima najmanjši element, $1$ je na koncu.)

### Blok 2: izomorfizem in ključna lema

Urejenosti $(A, <)$ in $(B, \prec)$ sta **izomorfni**, če obstaja bijekcija $f\colon A \to B$, da iz $x < y$ sledi $f(x) \prec f(y)$. Izomorfne urejenosti imajo isti **tip urejenosti**.

**Lema.** Če je $(W, <)$ dobro urejena in $f\colon W \to W$ strogo naraščajoča, je $f(x) \ge x$ za vsak $x \in W$.

*Dokaz.* Recimo, da množica $S = \{x \in W ;\ f(x) < x\}$ ni prazna. Naj bo $x_0$ njen najmanjši element in $y = f(x_0) < x_0$. Ker $f$ strogo narašča, je $f(y) < f(x_0) = y$, torej je $y \in S$ in $y < x_0$. To je v nasprotju z izbiro $x_0$. $\square$

**Posledice.**

1. Dobro urejena množica ni izomorfna nobenemu svojemu **začetnemu odseku** $W_a = \{x ;\ x < a\}$: izomorfizem $f\colon W \to W_a$ bi dal $f(a) < a$.
2. Izomorfizem med dvema dobro urejenima množicama je en sam: za izomorfizma $f, g$ je $g^{-1} \circ f$ strogo naraščajoča, zato $f(x) \ge g(x)$; simetrično $g(x) \ge f(x)$.
3. (**Primerljivost**) Za dve dobro urejeni množici velja natanko ena od možnosti: sta izomorfni, prva je izomorfna začetnemu odseku druge ali obratno.

*Preveri:* Ali je $(\mathbb N, <)$ izomorfna $(\mathbb N \setminus \{0\}, <)$, čeprav je ta prava podmnožica? (Da, z $n \mapsto n + 1$; to ni začetni odsek, zato lema ne nasprotuje.)

### Blok 3: ordinalna števila

Ordinal naj bo kanonični predstavnik tipa dobre urejenosti. Von Neumannova zamisel: vsak ordinal je *množica vseh manjših ordinalov*.

**Definicija.** Množica $\alpha$ je **ordinal**, če je **tranzitivna** (iz $x \in \alpha$ sledi $x \subseteq \alpha$) in z relacijo $\in$ dobro urejena.

$$0 = \emptyset, \quad 1 = \{0\}, \quad 2 = \{0, 1\}, \quad n + 1 = n \cup \{n\}$$

$$\omega = \{0, 1, 2, \dots\}$$

Za ordinala je $\beta < \alpha$ natanko tedaj, ko je $\beta \in \alpha$. **Naslednik** ordinala $\alpha$ je $\alpha + 1 = \alpha \cup \{\alpha\}$. Ordinal, ki ni $0$ in ni naslednik, je **limitni**; najmanjši je $\omega$. Za vsako množico ordinalov je njena unija spet ordinal, in sicer njen **supremum**.

**Izrek (o predstavnikih).** Vsaka dobro urejena množica je izomorfna natanko enemu ordinalu.

Enoličnost sledi iz Posledice 1. Obstoj dokažemo s transfinitno rekurzijo (Blok 4): elementu $x$ priredimo ordinal, ki je množica slik vseh manjših elementov.

*Preveri:* Kateri ordinal je tip urejenosti $1 < 2 < 3 < \dots < 0$ iz Bloka 1? ($\omega + 1 = \{0, 1, 2, \dots, \omega\}$.)

### Blok 4: transfinitna indukcija in rekurzija

**Izrek (transfinitna indukcija).** Naj bo $P$ lastnost ordinalov. Če za vsak ordinal $\alpha$ velja: iz $P(\beta)$ za vse $\beta < \alpha$ sledi $P(\alpha)$, potem $P$ velja za vse ordinale.

*Dokaz.* Če $P$ ne bi veljala za neki $\gamma$, bi bila množica $\{\beta \le \gamma ;\ \neg P(\beta)\}$ neprazna podmnožica dobro urejene $\gamma + 1$ in bi imela najmanjši element $\alpha$. Za vse $\beta < \alpha$ velja $P(\beta)$, po predpostavki torej $P(\alpha)$, protislovje. $\square$

V praksi dokaz razdelimo na tri primere:

1. **začetni korak:** $P(0)$;
2. **naslednik:** iz $P(\alpha)$ sledi $P(\alpha + 1)$;
3. **limitni korak:** če je $\lambda$ limitni in $P(\beta)$ velja za vse $\beta < \lambda$, velja $P(\lambda)$.

**Transfinitna rekurzija** na enak način definira funkcijo na vseh ordinalih: povemo vrednost v $0$, kako iz vrednosti v $\alpha$ dobimo vrednost v $\alpha + 1$ in da je vrednost v limitnem $\lambda$ supremum (ali drug dogovorjen »limes«) prejšnjih vrednosti. Iterativno izločanje strategij iz uvoda je tak postopek: v limitnem krogu obdržimo strategije, ki so preživele vse prejšnje kroge.

*Preveri:* Zakaj pri naravnih številih limitnega koraka ne potrebujemo? (Vsako naravno število razen $0$ je naslednik.)

### Blok 5: ordinalna aritmetika

**Vsota** $\alpha + \beta$ je tip urejenosti, ko za kopijo $\alpha$ postavimo kopijo $\beta$. **Produkt** $\alpha \cdot \beta$ je tip, ko $\beta$-krat zapored postavimo kopijo $\alpha$ (leksikografsko na $\beta \times \alpha$, najprej po $\beta$). Rekurzivno:

:::formula
$\alpha + 0 = \alpha$, $\alpha + (\beta + 1) = (\alpha + \beta) + 1$, za limitni $\lambda$: $\alpha + \lambda = \sup_{\beta < \lambda} (\alpha + \beta)$; $\alpha \cdot 0 = 0$, $\alpha \cdot (\beta + 1) = \alpha \cdot \beta + \alpha$, za limitni $\lambda$: $\alpha \cdot \lambda = \sup_{\beta < \lambda} \alpha \cdot \beta$
:::

Operaciji sta asociativni, nista pa komutativni. Ordinalni enačbi $1 + \omega = \omega$ in $2 \cdot \omega = \omega$ veljata, ordinala $\omega + 1$ in $\omega \cdot 2 = \omega + \omega$ pa sta večja od $\omega$.

:::premisli
Zakaj je $1 + \omega = \omega$, $\omega + 1$ pa ni enako $\omega$? Pomagaj si s sliko vrste.
---
Pri $1 + \omega$ en element postavimo *pred* vrsto $0, 1, 2, \dots$; dobimo spet vrsto brez zadnjega elementa, izomorfno $\omega$ (zamik $n \mapsto n + 1$). Pri $\omega + 1$ ga postavimo *za* vse; ta urejenost ima največji element, $\omega$ pa ga nima, zato nista izomorfni.
:::

### Blok 6: kardinalna števila in njihova aritmetika

Moč dveh množic primerjamo z bijekcijami (lekcija Moč množic). Ordinali $\omega$, $\omega + 1$ in $\omega \cdot 2$ so različni, a vsi števno neskončni.

**Definicija.** **Kardinalno število** (kardinal) je ordinal, ki ni ekvipotenten nobenemu manjšemu ordinalu (**začetni ordinal**). Za dobro uredljivo množico $A$ je $\lvert A \rvert$ edini kardinal, ekvipotenten $A$.

Končni kardinali so $0, 1, 2, \dots$, prvi neskončni je $\aleph_0 = \omega$, naslednji $\aleph_1$ (najmanjši neštevni ordinal) in tako naprej. Da je *vsaka* množica dobro uredljiva, zagotavlja šele aksiom izbire (naslednja lekcija).

Za množici $A$ in $B$ z $\lvert A \rvert = \kappa$, $\lvert B \rvert = \lambda$:

:::formula
$\kappa + \lambda = \lvert A \sqcup B \rvert$ (disjunktna unija), $\kappa \cdot \lambda = \lvert A \times B \rvert$, $\kappa^\lambda = \lvert A^B \rvert$ (vse funkcije $B \to A$)
:::

Definicije niso odvisne od izbire $A$ in $B$. Veljajo pravila iz končne aritmetike: komutativnost, asociativnost, distributivnost in pravila za potence, npr. $\kappa^{\lambda + \mu} = \kappa^\lambda \cdot \kappa^\mu$ in $(\kappa^\lambda)^\mu = \kappa^{\lambda \cdot \mu}$. Cantorjev izrek da $2^\kappa > \kappa$.

**Izrek (Hessenberg).** Za vsak neskončen kardinal $\kappa$ je $\kappa \cdot \kappa = \kappa$.

Za $\kappa = \aleph_0$ to pokaže Cantorjeva preslikava parov $\mathbb N \times \mathbb N \to \mathbb N$, ki šteje po diagonalah. Splošni dokaz uporabi posebno dobro urejenost $\kappa \times \kappa$ in transfinitno indukcijo (glej Bolj natančno).

**Posledica.** Če sta $\kappa, \lambda$ neničelna in vsaj eden neskončen, je $\kappa + \lambda = \kappa \cdot \lambda = \max(\kappa, \lambda)$.

*Dokaz* (za $\kappa \ge \lambda$, $\kappa$ neskončen): $\kappa \le \kappa + \lambda \le \kappa + \kappa = 2 \cdot \kappa \le \kappa \cdot \kappa = \kappa$ in $\kappa \le \kappa \cdot \lambda \le \kappa \cdot \kappa = \kappa$. Cantor-Schröder-Bernstein da enakosti. $\square$

Pozor: kardinalno $\aleph_0 + 1 = \aleph_0$, ordinalno pa $\omega + 1 \ne \omega$. Ista oznaka $+$ pomeni dve različni operaciji.

## Rešeni primeri

### Primer 1 (lažji): katera urejenost je dobra in kateri ordinal je to

Za vsako urejenost ugotovi, ali je dobra urejenost, in če je, njen tip: (a) $\mathbb N$ z obratno urejenostjo $0 > 1 > 2 > \dots$; (b) $\{1 - \frac1n ;\ n \ge 1\} \cup \{1\}$ z običajno; (c) $\mathbb N \times \mathbb N$ leksikografsko, $(a, b) < (c, d)$, če je $a < c$ ali ($a = c$ in $b < d$); to je urejanje paketov dobrin po leksikografskih preferencah.

**Podatki:** tri urejenosti (a), (b), (c), kot so opisane
**Iščemo:** ali so dobre urejenosti in njihove tipe

:::formula
dobra urejenost: vsaka neprazna podmnožica ima najmanjši element; ekvivalentno: ni neskončnega padajočega zaporedja
:::

**Rešitev:**

1. (a) Zaporedje $0, 1, 2, \dots$ je v tej urejenosti strogo padajoče in neskončno, zato to ni dobra urejenost. (Celotna množica nima najmanjšega elementa.)
2. (b) Elementi $0 < \frac12 < \frac23 < \dots$ tvorijo kopijo $\omega$, $1$ je večji od vseh. Neprazna podmnožica, ki vsebuje kak $1 - \frac1n$, ima najmanjšega med njimi; podmnožica $\{1\}$ ima $1$. Tip je $\omega + 1$.
3. (c) Za fiksen $a$ so pari $(a, 0) < (a, 1) < \dots$ kopija $\omega$; kopije si sledijo po $a = 0, 1, 2, \dots$, torej $\omega$-krat. Najmanjši element neprazne $S$: vzamemo najmanjši $a$, ki nastopa v $S$, in med pari s tem $a$ najmanjši $b$. Tip je $\omega \cdot \omega$.
4. Odgovor: (a) ni dobra urejenost; (b) je, tipa $\omega + 1$; (c) je, tipa $\omega \cdot \omega$. Pri (c) potrošnik nikoli ne »zamenja« ene enote prve dobrine za poljubno veliko druge, zato je vsako padajoče zaporedje paketov končno, čeprav ima paket $(1, 0)$ pred sabo neskončno mnogo paketov $(0, b)$.

### Primer 2: računanje z ordinali

Izračunaj in poenostavi: $1 + \omega$, $\omega + 1$, $2 \cdot \omega$, $\omega \cdot 2$, $(\omega + 1) \cdot 2$. Primerjaj s kardinalnimi vsotami in produkti istih moči.

**Podatki:** ordinali $1$, $2$, $\omega$, $\omega + 1$; definicije vsote in produkta iz Bloka 5
**Iščemo:** normalne oblike in moči

:::formula
$\alpha \cdot (\beta + 1) = \alpha \cdot \beta + \alpha$; za limitni $\lambda$ je $\alpha + \lambda = \sup_{\beta < \lambda}(\alpha + \beta)$; asociativnost vsote
:::

**Rešitev:**

1. $1 + \omega = \sup_{n < \omega} (1 + n) = \sup\{1, 2, 3, \dots\} = \omega$.
2. $\omega + 1$ je naslednik $\omega$, večji od $\omega$.
3. $2 \cdot \omega = \sup_{n} (2 \cdot n) = \omega$: $\omega$ kopij para je spet ena sama vrsta brez konca.
4. $\omega \cdot 2 = \omega \cdot 1 + \omega = \omega + \omega$: dve vrsti zapored.
5. $(\omega + 1) \cdot 2 = (\omega + 1) + (\omega + 1) = \omega + (1 + \omega) + 1 = \omega + \omega + 1 = \omega \cdot 2 + 1$ (asociativnost in korak 1).
6. Kardinalno imajo vsi ti ordinali moč $\aleph_0$: $1 + \aleph_0 = \aleph_0 + 1 = 2 \cdot \aleph_0 = \aleph_0 \cdot 2 = \aleph_0$.
7. Odgovor: $1 + \omega = \omega$, $\omega + 1 > \omega$, $2 \cdot \omega = \omega$, $\omega \cdot 2 = \omega + \omega$, $(\omega + 1) \cdot 2 = \omega \cdot 2 + 1$; vsi so števni.

### Primer 3 (težji): koliko je cenovnih poti in modelov povpraševanja

Ekonomist modelira: (a) **cenovno pot** kot zaporedje realnih cen $(p_0, p_1, p_2, \dots)$; (b) **zvezno funkcijo povpraševanja** $D\colon \mathbb R \to \mathbb R$; (c) poljubno funkcijo $\mathbb R \to \mathbb R$. Določi moč vsake množice z $2^{\aleph_0}$ (moč $\mathbb R$) in uredi moči po velikosti.

**Podatki:** $\lvert \mathbb R \rvert = 2^{\aleph_0}$ (kontinuum $\mathfrak c$ iz lekcije Moč množic), $\lvert \mathbb N \rvert = \lvert \mathbb Q \rvert = \aleph_0$; zvezna funkcija je določena z vrednostmi na $\mathbb Q$; pravila potenciranja iz Bloka 6
**Iščemo:** $\lvert \mathbb R^{\mathbb N} \rvert$, $\lvert C(\mathbb R) \rvert$, $\lvert \mathbb R^{\mathbb R} \rvert$

:::formula
$(\kappa^\lambda)^\mu = \kappa^{\lambda \cdot \mu}$; za neskončen $\kappa$ je $\kappa \cdot \kappa = \kappa$; Cantor: $2^\kappa > \kappa$
:::

**Rešitev:**

1. (a) $\lvert \mathbb R^{\mathbb N} \rvert = (2^{\aleph_0})^{\aleph_0} = 2^{\aleph_0 \cdot \aleph_0} = 2^{\aleph_0}$, ker je $\aleph_0 \cdot \aleph_0 = \aleph_0$.
2. (b) Spodnja meja: konstantne funkcije so $2^{\aleph_0}$, torej $\lvert C(\mathbb R) \rvert \ge 2^{\aleph_0}$.
3. Zgornja meja: preslikava $D \mapsto D|_{\mathbb Q}$ je injektivna, ker se zvezni funkciji, ki se ujemata na gosti $\mathbb Q$, ujemata povsod (limita zaporedja racionalnih števil). Zato $\lvert C(\mathbb R) \rvert \le \lvert \mathbb R^{\mathbb Q} \rvert = (2^{\aleph_0})^{\aleph_0} = 2^{\aleph_0}$.
4. Po Cantor-Schröder-Bernsteinu je $\lvert C(\mathbb R) \rvert = 2^{\aleph_0}$.
5. (c) $\lvert \mathbb R^{\mathbb R} \rvert = (2^{\aleph_0})^{2^{\aleph_0}} = 2^{\aleph_0 \cdot 2^{\aleph_0}} = 2^{2^{\aleph_0}}$, ker je $\aleph_0 \cdot 2^{\aleph_0} = 2^{\aleph_0}$ (Posledica Hessenbergovega izreka).
6. Po Cantorju je $2^{2^{\aleph_0}} > 2^{\aleph_0}$.
7. Odgovor: cenovnih poti je toliko kot realnih števil, $2^{\aleph_0}$, prav toliko je zveznih funkcij povpraševanja; vseh funkcij $\mathbb R \to \mathbb R$ je več, $2^{2^{\aleph_0}}$. Zahteva zveznosti torej zmanjša prostor modelov na moč, ki jo lahko »parametriziramo« z eno realno spremenljivko.

### Primer 4 – zdaj ti: indukcija za $0 + \alpha = \alpha$

S transfinitno indukcijo dokaži, da je $0 + \alpha = \alpha$ za vsak ordinal $\alpha$ (pri tem uporabi rekurzivno definicijo vsote).

**Podatki:** rekurzivna definicija vsote iz Bloka 5; dejstvo, da je za limitni $\lambda$ ordinal $\lambda = \sup_{\beta < \lambda} \beta$
**Iščemo:** dokaz v treh primerih

:::formula
$\alpha + 0 = \alpha$, $\alpha + (\beta + 1) = (\alpha + \beta) + 1$, za limitni $\lambda$: $\alpha + \lambda = \sup_{\beta < \lambda}(\alpha + \beta)$
:::

**Rešitev:**

1. Začetni korak: $0 + 0 = 0$ po prvem pravilu.
2. Naslednik: če je $0 + \alpha = \alpha$, je $0 + (\alpha + 1) = (0 + \alpha) + 1 = \alpha + 1$.
3. Dokončaj limitni korak.

:::premisli
Kako gre limitni korak?
---
Naj bo $\lambda$ limitni in $0 + \beta = \beta$ za vse $\beta < \lambda$. Tedaj je $0 + \lambda = \sup_{\beta < \lambda} (0 + \beta) = \sup_{\beta < \lambda} \beta = \lambda$, ker je limitni ordinal unija (supremum) vseh manjših. Po transfinitni indukciji trditev velja za vse $\alpha$. Opazi: pravilo $\alpha + 0 = \alpha$ je definicija, $0 + \alpha = \alpha$ pa izrek, ker vsota ni komutativna.
:::

## Pogoste napake

- **»Ordinalna in kardinalna vsota sta isto.«** Kardinalno je $1 + \aleph_0 = \aleph_0 + 1 = \aleph_0$; ordinalno je $1 + \omega = \omega$, $\omega + 1$ pa je večji ordinal. Pri ordinalih je vrstni red pomemben.
- **»Vsaka linearna urejenost z najmanjšim elementom je dobra.«** Interval $[0, 1]$ ima najmanjši element $0$, a podmnožica $(0, 1]$ ga nima. Najmanjši element mora imeti *vsaka* neprazna podmnožica.
- **Indukcija brez limitnega koraka.** Začetni korak in korak naslednika dokažeta trditev le za končne ordinale; brez limitnega koraka ne dosežemo niti $\omega$ (in s tem ne $\omega + 1$).
- **»$\omega \cdot 2$ in $2 \cdot \omega$ sta enaka.«** $2 \cdot \omega = \omega$ (neskončno parov), $\omega \cdot 2 = \omega + \omega$ (dve vrsti). Produkt $\alpha \cdot \beta$ pomeni $\beta$ kopij $\alpha$.
- **»Neskončno krat neskončno je več.«** Za neskončen kardinal je $\kappa \cdot \kappa = \kappa$; večjo moč da šele potenciranje, $2^\kappa > \kappa$.

## Povzetek

- Dobra urejenost: linearna, vsaka neprazna podmnožica ima najmanjši element; ni neskončnih padajočih zaporedij.
- Strogo naraščajoča $f\colon W \to W$ izpolni $f(x) \ge x$; zato dobra urejenost ni izomorfna začetnemu odseku in izomorfizem je enoličen; dobre urejenosti so primerljive.
- Ordinal: tranzitivna množica, dobro urejena z $\in$; $\alpha + 1 = \alpha \cup \{\alpha\}$, $\omega$ prvi limitni; vsaka dobra urejenost je izomorfna natanko enemu ordinalu.
- Transfinitna indukcija in rekurzija: začetni korak, naslednik, limita.
- Ordinalna vsota in produkt: asociativni, nekomutativni; $1 + \omega = \omega < \omega + 1$, $2 \cdot \omega = \omega < \omega \cdot 2$.
- Kardinal: začetni ordinal; $\kappa + \lambda$, $\kappa \cdot \lambda$, $\kappa^\lambda$ prek disjunktne unije, produkta in funkcij; za neskončne $\kappa + \lambda = \kappa \cdot \lambda = \max(\kappa, \lambda)$, $2^\kappa > \kappa$.

## Za izpit

Znati moraš povedati:

- definicijo dobre urejenosti in dokaz, da ni neskončnih padajočih zaporedij;
- lemo o strogo naraščajoči preslikavi z dokazom in njene posledice;
- definicijo ordinala, naslednika in limitnega ordinala ter izrek o predstavnikih;
- izrek o transfinitni indukciji z dokazom in obliko s tremi primeri;
- definiciji ordinalne vsote in produkta ter primere nekomutativnosti;
- definicijo kardinala in kardinalne aritmetike, Hessenbergov izrek in posledico za vsoto in produkt.

### Naloga 1

(a) Poenostavi ordinala $2 \cdot (\omega + 3)$ in $(\omega + 3) \cdot 2$. (b) Določi moč množice vseh končnih zaporedij realnih števil. (c) Določi moč množice vseh dobrih urejenosti na $\mathbb N$ (vsaka je podmnožica $\mathbb N \times \mathbb N$).

**Rešitev:**

1. (a) Ordinalni enačbi računamo po pravilih. Leva distributivnost $\alpha \cdot (\beta + \gamma) = \alpha \cdot \beta + \alpha \cdot \gamma$ velja: $2 \cdot (\omega + 3) = 2 \cdot \omega + 2 \cdot 3 = \omega + 6$.
2. $(\omega + 3) \cdot 2 = (\omega + 3) + (\omega + 3) = \omega + (3 + \omega) + 3 = \omega + \omega + 3 = \omega \cdot 2 + 3$, ker je $3 + \omega = \omega$. Desna distributivnost ne velja: $\omega \cdot 2 + 3 \cdot 2 = \omega \cdot 2 + 6$ je drug ordinal.
3. (b) Množica zaporedij dolžine $n$ je $\mathbb R^n$ z močjo $(2^{\aleph_0})^n = 2^{\aleph_0 \cdot n} = 2^{\aleph_0}$ za $n \ge 1$ (in $1$ za $n = 0$).
4. Unija po $n \in \mathbb N$: moč je največ $\aleph_0 \cdot 2^{\aleph_0} = 2^{\aleph_0}$ in vsaj $\lvert \mathbb R^1 \rvert = 2^{\aleph_0}$, torej $2^{\aleph_0}$.
5. (c) Zgornja meja: vsaka urejenost je podmnožica $\mathbb N \times \mathbb N$, teh je $2^{\aleph_0 \cdot \aleph_0} = 2^{\aleph_0}$.
6. Spodnja meja: vsaki permutaciji $\pi$ množice $\mathbb N$ priredimo dobro urejenost »$x \prec y$, če je $\pi(x) < \pi(y)$« (tipa $\omega$); različne permutacije dajo različne urejenosti. Permutacij je $2^{\aleph_0}$: vsaki podmnožici $S \subseteq \mathbb N$ priredimo permutacijo, ki zamenja $2k$ in $2k + 1$ natanko za $k \in S$, in te so različne.
7. Odgovor (ordinalni enačbi): (a) $2 \cdot (\omega + 3) = \omega + 6$, $(\omega + 3) \cdot 2 = \omega \cdot 2 + 3$; (b) $2^{\aleph_0}$; (c) $2^{\aleph_0}$.

### Naloga 2

Natančno navedi in dokaži lemo o strogo naraščajoči preslikavi dobro urejene množice vase. Iz nje izpelji, da (i) dobro urejena množica ni izomorfna nobenemu svojemu začetnemu odseku in (ii) med dvema dobro urejenima množicama obstaja največ en izomorfizem. Utemelji, ali (ii) velja tudi za $(\mathbb Z, <)$.

**Rešitev:**

1. Lema: $(W, <)$ dobro urejena, $f\colon W \to W$ strogo naraščajoča $\Rightarrow$ $f(x) \ge x$ za vse $x$. Dokaz s protislovjem in najmanjšim elementom množice $S = \{x ;\ f(x) < x\}$ kot v Bloku 2.
2. (i) Naj bo $f\colon W \to W_a$ izomorfizem. Kot preslikava $W \to W$ je strogo naraščajoča, zato $f(a) \ge a$. Toda $f(a) \in W_a$, torej $f(a) < a$. Protislovje.
3. (ii) Naj bosta $f, g\colon A \to B$ izomorfizma. Tedaj je $h = g^{-1} \circ f\colon A \to A$ strogo naraščajoča, zato $h(x) \ge x$, torej $f(x) \ge g(x)$ (uporabi $g$, ki ohranja urejenost).
4. Simetrično $g(x) \ge f(x)$, zato $f = g$.
5. Za $(\mathbb Z, <)$ ne velja: $x \mapsto x + 1$ in identiteta sta različna izomorfizma $\mathbb Z \to \mathbb Z$. Lema odpove, ker $x \mapsto x - 1$ strogo narašča, a $x - 1 < x$; v $\mathbb Z$ ni najmanjšega elementa, na katerem bi dokaz temeljil.

## Drugače: Na sliki

Ordinal nariši kot vrsto črtic od leve proti desni. Črtice se proti »koncu« zgoščujejo, ker jih je neskončno mnogo.

```
w     | | | ||||…
w+1   | | | ||||…  |
1+w   | | | | ||||…
w*2   | | |||…  | | |||…
```

- $1 + \omega$: dodana črtica na začetku se izgubi v vrsti, slika je enaka $\omega$.
- $\omega + 1$: črtica *za* zgostitvijo stoji sama; ima pred sabo neskončno elementov, a ni naslednik nobenega naravnega števila.
- $\omega \cdot 2$: dve zgostitvi zapored. Element na začetku druge vrste je limitni.

Kardinalno števec vidi le, koliko je črtic; vse štiri slike imajo $\aleph_0$ črtic.

## Drugače: Uporaba v stroki

- **Teorija iger in ekonomija.** Iterativno izločanje dominiranih strategij v neskončnih igrah lahko potrebuje transfinitno mnogo krogov; dokaz, da se postopek ustavi pri nekem ordinalu, je transfinitna indukcija.
- **Računalništvo.** Dokaz, da se program ustavi, pogosto priredi stanju ordinal, ki se z vsakim korakom zmanjša. Ker padajoče zaporedje ordinalov ni neskončno, se program ustavi. Za izraze, ki se pri poenostavljanju razširijo, je potrebna mera v ordinalih do $\omega^\omega$ ali višje.
- **Matematična logika.** Gentzen je s transfinitno indukcijo do ordinala $\varepsilon_0$ dokazal neprotislovnost Peanove aritmetike; »moč« teorij se meri z ordinali.
- **Optimizacija in analiza.** Cantor-Bendixsonov postopek odstranjevanja izoliranih točk zaprte množice teče po ordinalih; podobni postopki se pojavijo v teoriji mere in pri iteracijah, ki jih ne moremo ustaviti v končno korakih.

## Drugače: Bolj natančno

**Dokaz Hessenbergovega izreka (skica).** Na $\kappa \times \kappa$ definiramo urejenost: $(\alpha, \beta) \prec (\gamma, \delta)$, če je $\max(\alpha, \beta) < \max(\gamma, \delta)$, ali je maksimum enak in je $(\alpha, \beta)$ leksikografsko manjši. To je dobra urejenost. Indukcija po neskončnih kardinalih: če $\kappa \cdot \kappa > \kappa$, ima njen tip začetni odsek dolžine $\kappa$, ki je vsebovan v nekem kvadratu $\gamma \times \gamma$ z $\lvert \gamma \rvert < \kappa$. Če je $\gamma$ končen, je $\gamma \times \gamma$ končna; sicer je po indukcijski predpostavki $\lvert \gamma \times \gamma \rvert = \lvert \gamma \rvert < \kappa$. Oboje je protislovje.

**Kardinalna potenca brez aksioma izbire.** Brez aksioma izbire nekatere množice niso ekvipotentne nobenemu ordinalu; tedaj $\lvert A \rvert$ ni nujno kardinal v smislu te lekcije in moči niso vse primerljive. Aksiom izbire je enakovreden trditvi, da je vsaka množica dobro uredljiva (Zermelov izrek); to obravnava naslednja lekcija.

## Preveri se

? Katera slika ustreza ordinalu $\omega + 2$?
- `| | | ||||…`
~ To je $\omega$: ni elementov za zgostitvijo.
- `| | | | | ||||…`
~ Dva elementa pred vrsto se izgubita v njej: to je $2 + \omega = \omega$.
+ `| | | ||||…  | |`
- `| | |||…  | | |||…`
~ To sta dve vrsti zapored, $\omega \cdot 2$.
> $\omega + 2$: vrsta tipa $\omega$, za njo še dva elementa.

? Koliko krogov iterativnega izločanja (ordinalno) potrebuje postopek, ki se po vseh naravnih krogih nadaljuje s še tremi krogi in se nato ustavi?
- $3$
~ Pred temi tremi krogi je že neskončno mnogo krogov.
- $\omega$
~ Po krogih $0, 1, 2, \dots$ postopek še teče; potrebni so še trije krogi.
+ $\omega + 3$
- $3 + \omega$
~ $3 + \omega = \omega$: trije krogi na začetku se izgubijo v neskončni vrsti; tu pa so za njo.
> Najprej $\omega$ krogov, nato še $3$: ordinal $\omega + 3$; kardinalno je krogov $\aleph_0$.

? Zakaj transfinitna indukcija potrebuje poseben limitni korak?
- Ker limitni ordinali niso dobro urejeni.
~ Vsak ordinal je dobro urejen z $\in$, tudi limitni.
+ Ker limitni ordinal ni naslednik, zato do njega ne pridemo s korakom $\alpha \to \alpha + 1$.
- Ker pri limitnih ordinalih ne velja načelo najmanjšega elementa.
~ Načelo velja za vsak ordinal; prav na njem temelji dokaz indukcije.
- Ker so limitni ordinali neštevni.
~ $\omega$ in $\omega \cdot 2$ sta limitna in števna.
> Začetni korak in naslednik dosežeta le $0, 1, 2, \dots$; do $\omega$ (in s tem do $\omega + 1$, $\omega \cdot 2$ in naprej) pripelje šele limitni korak.

? Za katera kardinala $\kappa$ in $\lambda$ velja $\kappa + \lambda = 2^{\aleph_0}$ in $\kappa \cdot \lambda = 2^{\aleph_0}$?
- $\kappa = \lambda = \aleph_0$
~ Vsota in produkt dveh števnih kardinalov sta $\aleph_0$.
+ $\kappa = 2^{\aleph_0}$, $\lambda = \aleph_0$
- $\kappa = 2^{\aleph_0}$, $\lambda = 0$
~ Produkt z $0$ je $0$, vsota pa res $2^{\aleph_0}$.
- $\kappa = 2$, $\lambda = \aleph_0$
~ $2 + \aleph_0 = 2 \cdot \aleph_0 = \aleph_0$; potenca $2^{\aleph_0}$ ni produkt.
> Za neničelna kardinala, od katerih je vsaj eden neskončen, sta vsota in produkt enaka večjemu: $\max(2^{\aleph_0}, \aleph_0) = 2^{\aleph_0}$.

? Optimizacijski algoritem priredi vsakemu stanju ordinal manjši od $\omega \cdot 2$ in v vsakem koraku ta ordinal strogo zmanjša. Kaj lahko sklepaš?
- Algoritem se lahko vrti v neskončnost, ker je ordinalov neskončno.
~ Ordinalov pod $\omega \cdot 2$ je res neskončno, a padajoče zaporedje v dobri urejenosti je vedno končno.
- Algoritem naredi največ $\omega \cdot 2$ korakov, torej neskončno.
~ Število korakov je vedno končno; meja za *število* korakov pa ni enotna, odvisna je od začetnega stanja.
+ Algoritem se vedno ustavi po končno mnogo korakih.
- O ustavitvi ne moremo sklepati, ker $\omega \cdot 2$ ni kardinal.
~ Za sklep potrebujemo le dobro urejenost, ne kardinalov.
> Padajoče zaporedje ordinalov je končno (ni neskončnih padajočih zaporedij v dobri urejenosti).

:::simboli
\alpha, \beta, \gamma, \delta | ordinalna števila | | | 
\lambda | limitni ordinal ali kardinal | | | v Bloku 6 kardinal
\omega | najmanjši neskončni ordinal | | | $\omega = \{0, 1, 2, \dots\}$
\kappa | kardinalno število | | | 
\mu | kardinalno število | | | 
A, B | množici z močema $\kappa$ in $\lambda$ | | | 
n | naravno število | | | 
:::
