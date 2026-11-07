---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec pri vajah samozavestno trdi: »Relacija $\subseteq$ je urejenost, torej lahko vsaki dve množici primerjamo. Poleg tega ima vsaka končna urejena množica največji element.« Obe trditvi zvenita kot nekaj, kar velja za števila. Obe sta napačni, in ta lekcija pokaže, zakaj.

Pri množicah $\{1\}$ in $\{2\}$ ne velja ne $\{1\} \subseteq \{2\}$ ne $\{2\} \subseteq \{1\}$: množici sta **neprimerljivi**. Isto se zgodi v tovarni. Operaciji »vrtanje« in »brušenje« morata obe priti po rezanju in pred varjenjem, med seboj pa nista v vrstnem redu, zato ju lahko izvajata dva stroja hkrati. Takšne strukture opisujejo **delne urejenosti**; tiste z lepimi »najmanjšimi skupnimi zgornjimi mejami« so **mreže**, najlepše med njimi pa **Boolove algebre**, ki jih poznaš iz izjavnega računa in množic.

## Razlaga

**1. Od linearne k delni urejenosti.** Na številih je $\le$ refleksivna, antisimetrična in tranzitivna, in vsaki dve števili sta primerljivi. Delna urejenost obdrži prve tri lastnosti in opusti četrto.

**Definicija.** Relacija $\preceq$ na množici $P$ je **delna urejenost**, če je

- refleksivna: $a \preceq a$,
- antisimetrična: iz $a \preceq b$ in $b \preceq a$ sledi $a = b$,
- tranzitivna: iz $a \preceq b$ in $b \preceq c$ sledi $a \preceq c$.

Par $(P, \preceq)$ je **delno urejena množica**. Elementa sta **primerljiva**, če je $a \preceq b$ ali $b \preceq a$. Če sta primerljiva vsaka dva, je urejenost **linearna** (veriga).

Primeri: $(\mathcal P(A), \subseteq)$; naravna števila z deljivostjo $a \mid b$; operacije proizvodnje z »mora biti pred ali enaka«. Pri deljivosti sta $4$ in $6$ neprimerljiva.

**2. Hassejev diagram.** Element $b$ **pokrije** $a$, če je $a \prec b$ (torej $a \preceq b$, $a \ne b$) in ni $c$ z $a \prec c \prec b$. **Hassejev diagram** končne delno urejene množice nariše elemente kot točke, $b$ višje od $a$, in poveže le pare, kjer $b$ pokrije $a$. Refleksivnost in tranzitivnost nista narisani, sledita iz poti navzgor: $a \preceq b$ natanko tedaj, ko iz $a$ vodi pot navzgor do $b$.

**3. Posebni elementi.** Pri številih je »maksimalen« isto kot »največji«. Tu ne.

**Definicija.** Element $m \in P$ je

- **maksimalen**, če ni $x$ z $m \prec x$ (nad njim ni ničesar),
- **največji**, če je $x \preceq m$ za vse $x \in P$ (nad vsem je).

Enako minimalen in najmanjši. Največji element je maksimalen; obratno ne velja. V $\{2, 3, 4, 6\}$ z deljivostjo sta $4$ in $6$ maksimalna, največjega ni.

**Izrek.** (a) Največji element, če obstaja, je en sam. (b) Vsaka končna neprazna delno urejena množica ima vsaj en maksimalen element.

**Dokaz.** (a) Če sta $m$ in $m'$ največja, je $m \preceq m'$ in $m' \preceq m$, po antisimetričnosti $m = m'$. (b) Vzemi poljuben $a_1$. Če ni maksimalen, obstaja $a_2 \succ a_1$, in tako naprej. Zaradi tranzitivnosti in antisimetričnosti so $a_1 \prec a_2 \prec \dots$ različni, zato se v končni množici zaporedje ustavi pri maksimalnem elementu. $\square$

S tem je sošolčeva druga trditev ovržena: končnost zagotavlja maksimalen element, ne največjega.

:::premisli
V delno urejeni množici je natanko en maksimalen element. Ali mora biti ta element največji, če je množica končna? In če je neskončna?
---
Končna: da. Za vsak $x$ veriga navzgor iz $x$ konča pri maksimalnem elementu, ki je edini, zato je $x \preceq m$. Neskončna: ne nujno. Primer: $\mathbb N \cup \{m\}$, kjer je $m$ neprimerljiv z vsemi števili; $m$ je edini maksimalen, a ni nad $1$.
:::

**4. Supremum in infimum.** Element $u$ je **zgornja meja** množice $S \subseteq P$, če je $s \preceq u$ za vse $s \in S$. **Supremum** $\sup S$ je **najmanjša** zgornja meja (zgornja meja, ki je pod vsemi drugimi zgornjimi mejami). Dualno sta definirana spodnja meja in **infimum** $\inf S$. Supremum je najmanjši element množice zgornjih mej, zato je po dualni obliki izreka (a) enoličen, če obstaja; enako infimum.

Pri deljivosti je $\sup\{a, b\} = \operatorname{v}(a, b)$ (najmanjši skupni večkratnik), $\inf\{a, b\} = \operatorname{D}(a, b)$; pri $\subseteq$ sta to unija in presek.

**5. Mreže.**

**Definicija.** Delno urejena množica je **mreža**, če ima **vsak par** elementov supremum in infimum. Pišemo $a \vee b = \sup\{a, b\}$ (»spoj«) in $a \wedge b = \inf\{a, b\}$ (»srečanje«).

**Izrek.** V mreži za vse $a$, $b$, $c$ velja: idempotentnost $a \vee a = a$; komutativnost $a \vee b = b \vee a$; asociativnost $(a \vee b) \vee c = a \vee (b \vee c)$; **absorpcija** $a \vee (a \wedge b) = a$; in dualno za $\wedge$. Poleg tega $a \preceq b \iff a \wedge b = a \iff a \vee b = b$.

**Dokaz absorpcije.** Ker je $a \wedge b \preceq a$, je $a$ zgornja meja para $\{a, a \wedge b\}$. Vsaka zgornja meja tega para je nad $a$. Zato je $a$ najmanjša zgornja meja: $a \vee (a \wedge b) = a$. $\square$

**6. Boolove algebre.** Mreža je **omejena**, če ima najmanjši element $0$ in največji $1$. Je **distributivna**, če velja $a \wedge (b \vee c) = (a \wedge b) \vee (a \wedge c)$ za vse $a$, $b$, $c$. Element $a'$ je **komplement** elementa $a$, če je $a \wedge a' = 0$ in $a \vee a' = 1$.

**Definicija.** **Boolova algebra** je omejena distributivna mreža, v kateri ima vsak element komplement.

Primer: $(\mathcal P(A), \cup, \cap)$ s komplementom $A \setminus X$; izjavni račun z $\vee$, $\wedge$, $\neg$, $0$, $1$.

**Izrek.** V omejeni distributivni mreži ima vsak element največ en komplement.

**Dokaz.** Naj bosta $x$ in $y$ komplementa elementa $a$. Potem $x = x \wedge 1 = x \wedge (a \vee y) = (x \wedge a) \vee (x \wedge y) = 0 \vee (x \wedge y) = x \wedge y$, torej $x \preceq y$. Simetrično $y \preceq x$, zato $x = y$. $\square$

:::premisli
Mreža $\{0, a, b, c, 1\}$, kjer so $a$, $b$, $c$ med seboj neprimerljivi, med $0$ in $1$. Koliko komplementov ima $a$? Kaj to pove o distributivnosti?
---
Dva: $b$ in $c$ ($a \wedge b = 0$, $a \vee b = 1$, enako s $c$). Po izreku zato mreža ne more biti distributivna; res, $a \wedge (b \vee c) = a \wedge 1 = a$, a $(a \wedge b) \vee (a \wedge c) = 0$.
:::

## Rešeni primeri

### Primer 1 (lažji)

Nariši Hassejev diagram deliteljev števila $12$ glede na deljivost, določi $4 \vee 6$ in $4 \wedge 6$ ter utemelji, ali je to Boolova algebra.

**Podatki:** množica $D_{12} = \{1, 2, 3, 4, 6, 12\}$, relacija $a \mid b$
**Iščemo:** Hassejev diagram, $4 \vee 6$, $4 \wedge 6$, ali je Boolova algebra

:::formula
$a \vee b = \operatorname{v}(a, b)$, $a \wedge b = \operatorname{D}(a, b)$; komplement: $a \wedge a' = 1$ in $a \vee a' = 12$ (najmanjši element je $1$, največji $12$)
:::

**Rešitev:**

1. Pokritja (deljenje s praštevilom): $1$–$2$, $1$–$3$, $2$–$4$, $2$–$6$, $3$–$6$, $4$–$12$, $6$–$12$.
2. Diagram ima tri ravni nad $1$: spodaj $1$; nato $2$ in $3$; nato $4$ in $6$; zgoraj $12$. Število $3$ je povezano le z $1$ in $6$.
3. $4 \vee 6 = \operatorname{v}(4, 6) = 12$; $4 \wedge 6 = \operatorname{D}(4, 6) = 2$.
4. Komplement elementa $2$ bi moral zadoščati $\operatorname{D}(2, x) = 1$ (torej $x$ lih: $1$ ali $3$) in $\operatorname{v}(2, x) = 12$. Ker sta $\operatorname{v}(2, 1) = 2$ in $\operatorname{v}(2, 3) = 6$, komplementa ni.
5. Odgovor: $4 \vee 6 = 12$, $4 \wedge 6 = 2$; $D_{12}$ je (distributivna) mreža, ni pa Boolova algebra, ker element $2$ nima komplementa.

### Primer 2

Izdelava ohišja ima operacije: A rezanje, B vrtanje, C brušenje, D varjenje, E lakiranje, F končna kontrola, G priprava navodil. Zahteve: A pred B, C in G; B in C pred D; D pred E; E in C pred F; G pred F. Vsaka operacija traja $1\,\mathrm{h}$. Nariši Hassejev diagram, poišči najkrajši čas izdelave pri neomejenem številu strojev in največ koliko operacij lahko teče hkrati. Koliko je vrstnih redov, če je na voljo en sam stroj?

**Podatki:** $7$ operacij A–G, zahteve A < B, A < C, A < G, B < D, C < D, D < E, E < F, C < F, G < F; trajanje $1\,\mathrm{h}$
**Iščemo:** diagram, najkrajši čas $t$, največje število hkratnih operacij $w$ in število vrstnih redov $N$

:::formula
Najkrajši čas = število elementov najdaljše verige; hkrati lahko tečejo le paroma neprimerljive operacije (antiveriga); vrstni red na enem stroju = linearna razširitev.
:::

**Rešitev:**

1. Zahteva C < F sledi iz C < D < E < F, zato v diagramu ni povezave C–F (ni pokritje). Pokritja: A–B, A–C, A–G, B–D, C–D, D–E, E–F, G–F.
2. Diagram: spodaj A; nad njim B, C in G; nad B in C je D, nad D je E; na vrhu F, ki pokrije E in G.
3. Najdaljša veriga je A < B < D < E < F (ali z C namesto B): $5$ elementov, torej $t = 5\,\mathrm{h}$.
4. Antiveriga: B, C, G so paroma neprimerljivi; večje antiverige ni: vse elemente pokrijejo tri verige (A < B < D < E < F, C in G), antiveriga pa ima iz vsake verige največ en element. Torej $w = 3$ stroji hkrati.
5. En stroj: A je prvi, F zadnji. Med njima B, C, D, E v vrstnem redu $\{B, C\}$, D, E; to sta $2$ možnosti. G gre kamorkoli med A in F, na eno od $5$ mest v zaporedju štirih operacij: $N = 2 \cdot 5 = 10$.
6. Odgovor: $t = 5\,\mathrm{h}$, hkrati največ $3$ operacije (B, C, G), na enem stroju $10$ vrstnih redov.

### Primer 3 (težji)

Dokaži: mreža deliteljev $D_n$ (z $\vee = \operatorname{v}$, $\wedge = \operatorname{D}$) je Boolova algebra natanko tedaj, ko $n$ ni deljiv s kvadratom nobenega praštevila. Za $n = 30$ zapiši komplement vsakega elementa.

**Podatki:** $D_n$ z deljivostjo, $0 = 1$, $1 = n$; distributivnost $\operatorname{D}(a, \operatorname{v}(b, c)) = \operatorname{v}(\operatorname{D}(a, b), \operatorname{D}(a, c))$ velja za vse $n$; $n = 30$
**Iščemo:** dokaz obeh smeri in komplemente v $D_{30}$

:::formula
$a'$ je komplement: $\operatorname{D}(a, a') = 1$ in $\operatorname{v}(a, a') = n$; za tuji si števili je $\operatorname{v}(a, b) = ab$.
:::

**Rešitev:**

1. Mreža je omejena in distributivna, zato je Boolova natanko tedaj, ko ima vsak element komplement.
2. ($\Leftarrow$) Naj bo $n = p_1 p_2 \cdots p_k$ z različnimi praštevili in $d \mid n$. Vzemi $d' = \frac{n}{d}$. Vsako $p_i$ deli natanko eno od $d$ in $d'$, zato $\operatorname{D}(d, d') = 1$ in $\operatorname{v}(d, d') = dd' = n$.
3. ($\Rightarrow$) Naj $p^2 \mid n$ in naj ima $p$ komplement $x$. Iz $\operatorname{D}(p, x) = 1$ sledi $p \nmid x$, zato $\operatorname{v}(p, x) = px = n$ in $x = \frac np$.
4. Ker $p^2 \mid n$, je $p \mid \frac np = x$, kar nasprotuje koraku 3. Torej $p$ nima komplementa.
5. $D_{30} = \{1, 2, 3, 5, 6, 10, 15, 30\}$ ima $8$ elementov; komplementi so $d' = \frac{30}{d}$: $1 \leftrightarrow 30$, $2 \leftrightarrow 15$, $3 \leftrightarrow 10$, $5 \leftrightarrow 6$.
6. Odgovor: $D_n$ je Boolova algebra natanko za $n$ brez kvadratnih faktorjev. $D_{30}$ je tak primer; z $d \mapsto \{p : p \mid d\}$ je enak $\mathcal P(\{2, 3, 5\})$ (komplement delitelja ustreza komplementu množice).

### Primer 4 – zdaj ti

V $\mathcal P(\{a, b, c\})$ z $\subseteq$ določi $\{a\} \vee \{b\}$, $\{a, b\} \wedge \{b, c\}$ in komplement $\{a, c\}$.

**Podatki:** $\mathcal P(\{a, b, c\})$, $\vee = \cup$, $\wedge = \cap$, $1 = \{a, b, c\}$
**Iščemo:** spoj, srečanje in komplement

:::formula
$X \vee Y = X \cup Y$, $X \wedge Y = X \cap Y$, $X' = \{a, b, c\} \setminus X$
:::

**Rešitev:**

1. $\{a\} \vee \{b\} = \{a, b\}$: najmanjša množica, ki vsebuje obe.
2. Izračunaj srečanje in komplement sam.

:::premisli
Kaj dobiš?
---
$\{a, b\} \wedge \{b, c\} = \{b\}$; komplement $\{a, c\}$ je $\{b\}$, ker $\{a, c\} \cap \{b\} = \emptyset$ in $\{a, c\} \cup \{b\} = \{a, b, c\}$.
:::

## Pogoste napake

- **»Maksimalen = največji.«** Sklep velja le pri linearni urejenosti. V $\{2, 3, 4, 6\}$ z deljivostjo sta $4$ in $6$ maksimalna, največjega ni.
- **»Supremum je največji element množice $S$.«** Supremum ni nujno v $S$: $\sup\{4, 6\} = 12$. In največji element $S$ (če obstaja) je res supremum, a supremum obstaja tudi brez njega.
- **Prepisane tranzitivne povezave.** V Hassejev diagram rišemo le pokritja; povezava $1$–$4$ v $D_{12}$ je odveč, ker vodi pot $1$–$2$–$4$.
- **»Vsaka mreža z $0$ in $1$ je Boolova.«** $D_{12}$ je omejena in distributivna, a element $2$ nima komplementa. Mreža $\{0, a, b, c, 1\}$ ima komplemente, a ni distributivna.
- **Zgornja meja namesto najmanjše.** Pri $\{4, 6\}$ v $D_{24}$ sta zgornji meji $12$ in $24$; supremum je $12$, ne $24$.

## Povzetek

- Delna urejenost: refleksivna, antisimetrična, tranzitivna; elementi so lahko neprimerljivi. Linearna: vsaka dva sta primerljiva.
- Hassejev diagram riše le pokritja; $a \preceq b$, če vodi pot navzgor.
- Maksimalen (nad njim nič) proti največji (nad vsem); največji je enoličen; končna neprazna množica ima maksimalen element.
- $\sup$ je najmanjša zgornja meja, $\inf$ največja spodnja; pri deljivosti $\operatorname{v}$ in $\operatorname{D}$, pri množicah $\cup$ in $\cap$.
- Mreža: vsak par ima $\vee$ in $\wedge$; absorpcija, $a \preceq b \iff a \wedge b = a$.
- Boolova algebra: omejena, distributivna, komplementirana mreža; komplement je enoličen; $D_n$ je Boolova natanko za $n$ brez kvadratnih faktorjev.

## Za izpit

Znati moraš povedati:

- definicijo delne in linearne urejenosti, pokritja in Hassejevega diagrama,
- razliko med maksimalnim in največjim elementom z dokazom enoličnosti največjega in obstoja maksimalnega v končni množici,
- definicijo supremuma, infimuma in mreže ter zakone mreže z dokazom absorpcije,
- definicijo Boolove algebre in dokaz enoličnosti komplementa v distributivni mreži,
- kriterij, kdaj je $D_n$ Boolova algebra.

### Naloga 1

Na $S = \{2, 3, 4, 6, 8, 12, 18, 24\}$ vzemi deljivost. Nariši Hassejev diagram, določi minimalne in maksimalne elemente, najmanjši in največji element (če obstajata), $\sup$ in $\inf$ parov $\{4, 6\}$, $\{8, 12\}$, $\{12, 18\}$ in $\{2, 3\}$. Ali je $S$ mreža?

**Rešitev:**

1. Pokritja: $2$–$4$, $2$–$6$, $3$–$6$, $4$–$8$, $4$–$12$, $6$–$12$, $6$–$18$, $8$–$24$, $12$–$24$.
2. Minimalna: $2$ in $3$ (nič iz $S$ ju ne deli). Maksimalna: $18$ in $24$ (nista delitelja drugih elementov $S$).
3. Najmanjšega in največjega ni, saj sta minimalna in maksimalna po dva.
4. $\{4, 6\}$: zgornji meji $12$, $24$, $\sup = 12$; spodnja meja le $2$, $\inf = 2$.
5. $\{8, 12\}$: zgornja meja le $24$, $\sup = 24$; spodnji meji $2$, $4$, $\inf = 4$.
6. $\{12, 18\}$: zgornja meja bi morala biti deljiva s $36$, v $S$ je ni; $\sup$ ne obstaja. $\inf = 6$ (spodnje meje $2$, $3$, $6$).
7. $\{2, 3\}$: spodnje meje ni ($1 \notin S$), $\inf$ ne obstaja; $\sup = 6$.
8. Odgovor: $S$ ni mreža, ker par $\{12, 18\}$ nima supremuma, par $\{2, 3\}$ pa nima infimuma.

### Naloga 2

Natančno navedi zakone mreže in dokaži: (a) absorpcijo $a \vee (a \wedge b) = a$, (b) $a \preceq b \iff a \wedge b = a$, (c) $a \preceq b \iff a \vee b = b$.

**Rešitev:**

1. Zakoni: idempotentnost, komutativnost, asociativnost in absorpcija za $\vee$ in dualno za $\wedge$.
2. (a) $a \wedge b \preceq a$, zato je $a$ zgornja meja $\{a, a \wedge b\}$; vsaka zgornja meja tega para je $\succeq a$; torej je $a$ supremum.
3. (b) $\Rightarrow$: pri $a \preceq b$ je $a$ spodnja meja $\{a, b\}$, vsaka spodnja meja je $\preceq a$, zato $a \wedge b = a$. $\Leftarrow$: $a = a \wedge b \preceq b$.
4. (c) $\Rightarrow$: pri $a \preceq b$ je $b$ zgornja meja $\{a, b\}$, vsaka zgornja meja je $\succeq b$, zato $a \vee b = b$. $\Leftarrow$: $a \preceq a \vee b = b$.
5. Odgovor: urejenost mreže je določena že z operacijama, $a \preceq b \iff a \wedge b = a \iff a \vee b = b$.

### Naloga 3

Natančno navedi in dokaži izrek o enoličnosti komplementa v omejeni distributivni mreži. Utemelji, ali je mreža deliteljev $D_{12}$ Boolova algebra in ali je mreža $\{0, a, b, c, 1\}$ (trije neprimerljivi elementi med $0$ in $1$) distributivna.

**Rešitev:**

1. Izrek: v omejeni distributivni mreži ima vsak element največ en komplement.
2. Dokaz: za komplementa $x$, $y$ elementa $a$ je $x = x \wedge (a \vee y) = (x \wedge a) \vee (x \wedge y) = x \wedge y$, torej $x \preceq y$; simetrično $y \preceq x$, zato $x = y$.
3. $D_{12}$: distributivna je, a $2$ nima komplementa (Primer 1), zato ni Boolova.
4. $\{0, a, b, c, 1\}$: $a$ ima dva komplementa, $b$ in $c$. Če bi bila distributivna, bi bil po izreku komplement en sam. Torej ni distributivna.
5. Odgovor: izrek velja; $D_{12}$ ni Boolova algebra; peterica s tremi neprimerljivimi elementi ni distributivna.

## Drugače: Na sliki

Hassejev diagram $\mathcal P(\{a, b, c\})$ je kocka:

```
       {a,b,c}
      /   |   \
  {a,b} {a,c} {b,c}
    | \  / \  / |
    |  \/   \/  |
    |  /\   /\  |
   {a}   {b}   {c}
      \   |   /
         { }
```

Vsaka enoelementna množica je povezana z dvema dvoelementnima, ki jo vsebujeta ($\{a\}$ z $\{a, b\}$ in $\{a, c\}$). Vsaka raven ima množice z enakim številom elementov. Supremum dveh točk poiščeš tako, da greš iz obeh navzgor do prve skupne točke; infimum navzdol. Komplement je točka, »zrcalna« čez središče kocke: $\{a\}$ in $\{b, c\}$. Diagram $D_{30}$ je ista kocka, le z oznakami $1$, $2$, $3$, $5$, $6$, $10$, $15$, $30$. Diagram $D_{12}$ pa je pravokotnik $3 \times 2$ točk, ki nima te simetrije; zato komplementi manjkajo.

## Drugače: Uporaba v stroki

- **Načrtovanje proizvodnje.** Operacije z zahtevami vrstnega reda so delna urejenost; najdaljša veriga je kritična pot (metoda CPM/PERT), antiveriga pove, koliko strojev ali delavcev lahko dela hkrati, linearne razširitve so dopustni urniki.
- **Gradnja programov.** Orodja, kot je `make`, in cevovodi v procesni industriji obdelajo naloge v vrstnem redu linearne razširitve odvisnosti; neodvisne naloge (antiverige) poženejo vzporedno.
- **Varnost podatkov.** Stopnje tajnosti z oznakami oddelkov tvorijo mrežo; dokument, ki združi dva vira, dobi supremum njunih oznak.
- **Krmilni sistemi.** Logična vezja in programirljivi krmilniki v tovarnah uporabljajo Boolovo algebro; poenostavitev pogojev za vklop črpalke je računanje v njej.

## Drugače: Bolj natančno

**Dilworthov izrek.** V končni delno urejeni množici je najmanjše število verig, ki pokrijejo vse elemente, enako velikosti največje antiverige. V Primeru 2: tri verige (A–B–D–E–F, C, G) in antiveriga $\{B, C, G\}$.

**Stoneov izrek o predstavitvi.** Vsaka končna Boolova algebra je izomorfna $\mathcal P(A)$ za neko končno $A$ (množico njenih atomov, elementov tik nad $0$), zato ima $2^n$ elementov. $D_{30}$ ima $8 = 2^3$ elementov z atomi $2$, $3$, $5$.

**Distributivnost in podmreže.** Mreža je distributivna natanko tedaj, ko ne vsebuje podmreže oblike peterice s tremi neprimerljivimi elementi ali peterice $0 \prec a \prec b \prec 1$, $0 \prec c \prec 1$ (Birkhoff).

## Preveri se

? Katera trditev o delno urejeni množici je pravilna?
- Vsaka dva elementa sta primerljiva.
~ To velja le za linearne urejenosti; $\{1\}$ in $\{2\}$ pri $\subseteq$ nista primerljiva.
- Vsaka končna ima največji element.
~ Ima maksimalen element, največjega pa ne nujno: $\{2, 3\}$ z deljivostjo.
+ Če največji element obstaja, je en sam.
- Supremum para je vedno eden od obeh elementov.
~ $\sup\{4, 6\} = 12$ pri deljivosti.
> Iz $m \preceq m'$ in $m' \preceq m$ po antisimetričnosti sledi $m = m'$.

? Koliko povezav ima Hassejev diagram $D_{30}$?
- $8$
~ $8$ je število elementov, ne povezav.
+ $12$
- $19$
~ Štete so vse primerljive pare brez enakih, ne le pokritja.
- $6$
~ Šteta so le pokritja nad $1$ in pod $30$; kocka ima $12$ robov.
> $D_{30}$ je kocka $\mathcal P(\{2, 3, 5\})$: $12$ robov (vsak element pokrijejo elementi z enim praštevilom več).

? Študent rešuje: »V $D_{12}$ je komplement elementa $4$ enak $3$, ker $\operatorname{D}(4, 3) = 1$ in $\operatorname{v}(4, 3) = 12$. Zato je $D_{12}$ Boolova algebra.« Kje je napaka?
- $\operatorname{D}(4, 3) \ne 1$.
~ $4$ in $3$ sta tuji si števili, $\operatorname{D}(4, 3) = 1$ drži.
- $\operatorname{v}(4, 3) \ne 12$.
~ $\operatorname{v}(4, 3) = 12$ drži.
+ Komplement mora imeti vsak element; $2$ ga nima.
- V $D_{12}$ je najmanjši element $0$, ne $1$.
~ Najmanjši element $D_{12}$ je število $1$; to je »$0$« mreže.
> En element s komplementom ne zadošča; za Boolovo algebro potrebuje komplement vsak element.

? Primerjaj $(\mathbb N, \le)$ in $(\mathbb N, \mid)$. Kaj velja?
- Obe sta linearni urejenosti.
~ Pri deljivosti sta $2$ in $3$ neprimerljiva.
+ Obe sta mreži; pri $\le$ je $a \vee b = \max\{a, b\}$, pri $\mid$ pa $\operatorname{v}(a, b)$.
- Le $(\mathbb N, \le)$ je mreža.
~ Tudi pri deljivosti ima vsak par $\operatorname{v}$ in $\operatorname{D}$.
- Le $(\mathbb N, \mid)$ ima najmanjši element.
~ Obe imata najmanjši element $1$ (pri $\mid$ ga $1$ deli vse, pri $\le$ je najmanjše število).
> Linearna urejenost je vedno mreža (max in min); deljivost je delna, a mreža.

? V obratu morata operaciji X in Y obe slediti čiščenju in biti končani pred pakiranjem, med seboj pa nimata zahteve. Kaj to pomeni za urnik?
- X mora biti pred Y, ker je navedena prva.
~ Vrstni red navajanja ni zahteva; X in Y sta neprimerljiva.
+ X in Y lahko tečeta hkrati na dveh strojih.
- Pakiranje je supremum le X, ne Y.
~ Pakiranje je zgornja meja obeh; če nič drugega ni vmes, je supremum para.
- Urnik ni mogoč, ker urejenost ni linearna.
~ Urnik je vsaka linearna razširitev; delna urejenost jih ima vedno vsaj eno.
> Neprimerljivi operaciji tvorita antiverigo, zato ju smemo izvajati vzporedno.

:::simboli
P | delno urejena množica | |
S | podmnožica delno urejene množice | |
a, b, c | elementi delno urejene množice | |
x, y | komplementa elementa $a$ | |
a' | komplement elementa $a$ | | | $a \wedge a' = 0$, $a \vee a' = 1$
D_n | množica deliteljev števila $n$ | |
d | delitelj števila $n$ | |
d' | komplement delitelja $d$ v $D_n$ | d' = \frac{n}{d} |
n | naravno število | |
p | praštevilo | |
X, Y | podmnožice | |
t | najkrajši čas izdelave | | h
w | največje število hkratnih operacij | |
N | število vrstnih redov na enem stroju | |
:::
