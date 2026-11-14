---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Profesor reče: »Vsi študenti so oddali domačo nalogo.« Asistent odgovori: »To ni res.« Kaj natanko je asistent trdil? Da *nihče* ni oddal? Ne. Trdil je le, da obstaja **vsaj en** študent, ki naloge ni oddal.

Izjavni račun tega ne zna zapisati. V njem je »vsi študenti so oddali« ena sama izjava $p$, njena negacija pa $\neg p$, brez vpogleda v to, kaj pomeni. Matematične definicije pa so polne besed »za vsak« in »obstaja«: omejeno zaporedje, naraščajoča funkcija, limita, zveznost. Ko dokazujemo s protislovjem ali iščemo protiprimer, moramo take trditve pravilno zanikati. To je naloga **predikatnega računa**.

## Razlaga

**1. Predikat.** Izraz »$x$ je sodo število« ni izjava: ne moremo reči, ali je resničen, dokler ne povemo, kaj je $x$. Pri $x = 4$ dobimo resnično izjavo, pri $x = 7$ neresnično. Takemu izrazu rečemo **predikat** ali **izjavna forma** in ga pišemo $P(x)$. Predikat ima lahko več spremenljivk, npr. $V(x, y)$: »$x < y$«.

Vrednosti, ki jih spremenljivka lahko zavzame, tvorijo **področje pogovora** (domeno) $D$. Brez domene trditev nima natančnega pomena.

**2. Kvantifikatorja.** Iz predikata dobimo izjavo na dva načina:

- $\forall x\, P(x)$ (»za vsak $x$ velja $P(x)$«) je resnična, če je $P(a)$ resnična za **vsak** $a \in D$. Znak $\forall$ je **univerzalni kvantifikator**.
- $\exists x\, P(x)$ (»obstaja $x$, da velja $P(x)$«) je resnična, če je $P(a)$ resnična za **vsaj en** $a \in D$. Znak $\exists$ je **eksistenčni kvantifikator**.

Na končni domeni sta kvantifikatorja le dolga veznika. Vzemimo $D = \{1, 2, 3\}$, $P(x)$: »$x$ je sodo«, $Q(x)$: »$x < 4$«:

| $x$ | $P(x)$ | $Q(x)$ |
|---|---|---|
| $1$ | $0$ | $1$ |
| $2$ | $1$ | $1$ |
| $3$ | $0$ | $1$ |

$\forall x\, P(x) \sim P(1) \wedge P(2) \wedge P(3)$ je $0$, ker ima stolpec vsaj eno ničlo. $\exists x\, P(x) \sim P(1) \vee P(2) \vee P(3)$ je $1$, ker ima stolpec vsaj eno enico. Za $Q$ sta resnični obe izjavi. Za $\forall$ torej preverimo cel stolpec, za $\exists$ zadošča ena vrstica.

:::premisli
Ali je izjava $\exists x\,(x^2 = 2)$ resnična? Odgovori za domeno $\mathbb{Q}$ in za domeno $\mathbb{R}$.
---
Na $\mathbb{Q}$ je neresnična, ker $\sqrt2$ ni racionalno število. Na $\mathbb{R}$ je resnična, priča je $x = \sqrt 2$. Ista formula ima pri različnih domenah različno resničnost.
:::

**3. Prosta in vezana spremenljivka.** V formuli $\exists y\, (x < y)$ je $y$ **vezana**: kvantifikator jo »porabi« in njeno ime lahko zamenjamo ($\exists z\,(x < z)$ pomeni isto). Spremenljivka $x$ je **prosta**. Formula s prosto spremenljivko je še vedno predikat; izjava postane šele, ko vežemo vse spremenljivke.

**4. Omejeni kvantifikatorji.** Pogosto pišemo $\forall x \in A\colon P(x)$ in $\exists x \in A\colon P(x)$. Pomen:

$$\forall x \in A\colon P(x) \ \sim\ \forall x\,\big(x \in A \Rightarrow P(x)\big)$$
$$\exists x \in A\colon P(x) \ \sim\ \exists x\,\big(x \in A \wedge P(x)\big)$$

Pri $\forall$ je veznik implikacija, pri $\exists$ konjunkcija. Stavek »vsa praštevila, večja od $2$, so liha« je torej $\forall x\,\big((x \text{ praštevilo} \wedge x > 2) \Rightarrow x \text{ liho}\big)$.

**5. Negacija.** Izjava $\forall x\, P(x)$ je neresnična natanko tedaj, ko je v stolpcu $P$ kakšna ničla, torej ko obstaja $x$, za katerega $P(x)$ ne velja:

$$\neg\, \forall x\, P(x) \ \sim\ \exists x\, \neg P(x) \qquad \neg\, \exists x\, P(x) \ \sim\ \forall x\, \neg P(x)$$

To je posplošitev De Morganovih zakonov: negacija dolge konjunkcije je dolga disjunkcija negacij in obratno. Pri omejenih kvantifikatorjih se domena ne spremeni:

$$\neg\, \big(\forall x \in A\colon P(x)\big) \ \sim\ \exists x \in A\colon \neg P(x)$$

Iz $\neg(p \Rightarrow q) \sim p \wedge \neg q$ sledi $\neg\, \forall x\,(P(x) \Rightarrow Q(x)) \sim \exists x\,(P(x) \wedge \neg Q(x))$. Zanikanje »vsi so oddali« je torej »nekdo ni oddal«.

**6. Več kvantifikatorjev.** Pri negaciji potujemo z $\neg$ od leve proti desni. Vsak kvantifikator, mimo katerega gre, se obrne ($\forall \leftrightarrow \exists$), na koncu zanikamo predikat:

$$\neg\, \forall x\, \exists y\, P(x, y) \ \sim\ \exists x\, \neg\, \exists y\, P(x, y) \ \sim\ \exists x\, \forall y\, \neg P(x, y)$$

Vrstni red **različnih** kvantifikatorjev je pomemben. Dva enaka kvantifikatorja pa smemo zamenjati: $\forall x\, \forall y \sim \forall y\, \forall x$ in $\exists x\, \exists y \sim \exists y\, \exists x$.

:::premisli
Domena je $\mathbb{N}$. Katera od izjav je resnična: $\forall x\, \exists y\colon y > x$ ali $\exists y\, \forall x\colon y > x$? Zakaj se razlikujeta?
---
Prva je resnična: za vsak $x$ vzamemo $y = x + 1$; $y$ je smel biti odvisen od $x$. Druga je neresnična: trdi, da obstaja eno samo naravno število, večje od vseh, tudi od samega sebe ($x = y$ da $y > y$). Pri $\exists y\, \forall x$ moramo $y$ izbrati, preden poznamo $x$.
:::

## Rešeni primeri

### Primer 1 (lažji): resničnost na končni domeni

Domena je $D = \{1, 2, 3, 4\}$. Ugotovi resničnost izjav: a) $\forall x\colon x^2 \leq 10$, b) $\exists x\colon x^2 - 5x + 6 = 0$, c) $\forall x\, \exists y\colon x + y = 5$.

**Podatki:** domena $D = \{1, 2, 3, 4\}$, izjave a), b), c)
**Iščemo:** resničnost vsake izjave in utemeljitev (protiprimer ali priča)

:::formula
$\forall x\, P(x)$: preveri vse $x \in D$ (zadošča en protiprimer za $0$); $\exists x\, P(x)$: zadošča ena priča za $1$
:::

**Rešitev:**

1. a) Pri $x = 4$ je $4^2 = 16 > 10$. Našli smo protiprimer, zato je izjava neresnična.
2. b) Pri $x = 2$ je $2^2 - 5 \cdot 2 + 6 = 0$. Ena priča zadošča, izjava je resnična.
3. c) Za vsak $x$ poiščemo $y = 5 - x$: pari $(1, 4)$, $(2, 3)$, $(3, 2)$, $(4, 1)$. Vsi $y$ so v $D$, zato je izjava resnična.
4. Odgovor: a) neresnična, b) resnična, c) resnična.

### Primer 2: negacija stavka

Zanikaj stavek »Vsak študent je opravil vsaj en izpit.« Zapiši ga s kvantifikatorji in negacijo prevedi nazaj v slovenščino.

**Podatki:** stavek; $S$ je množica študentov, $I$ množica izpitov, $O(s, i)$: »študent $s$ je opravil izpit $i$«
**Iščemo:** negacijo v simbolih in v besedah

:::formula
$\neg\, \forall x\, P(x) \sim \exists x\, \neg P(x)$, $\quad \neg\, \exists x\, P(x) \sim \forall x\, \neg P(x)$
:::

**Rešitev:**

1. Zapis: $\forall s \in S\ \exists i \in I\colon O(s, i)$.
2. Negacija gre mimo $\forall s$, ki postane $\exists s$: $\exists s \in S\ \neg\, \exists i \in I\colon O(s, i)$.
3. Gre še mimo $\exists i$, ki postane $\forall i$: $\exists s \in S\ \forall i \in I\colon \neg O(s, i)$.
4. Odgovor: »Obstaja študent, ki ni opravil nobenega izpita.« Domeni $S$ in $I$ sta ostali nespremenjeni.

### Primer 3 (težji): protiprimer iz negacije definicije

Funkcija $f\colon \mathbb{R} \to \mathbb{R}$ je **strogo naraščajoča**, če velja $\forall x\, \forall y\colon (x < y \Rightarrow f(x) < f(y))$. Zapiši, kaj pomeni, da $f$ *ni* strogo naraščajoča, in s tem pokaži, da $f(x) = x^2$ ni strogo naraščajoča.

**Podatki:** definicija strogo naraščajoče funkcije, domena $\mathbb{R}$, funkcija $f(x) = x^2$
**Iščemo:** negacijo definicije in konkretno pričo zanjo

:::formula
$\neg\, \forall x\, \forall y\, A \sim \exists x\, \exists y\, \neg A$, $\quad \neg(p \Rightarrow q) \sim p \wedge \neg q$
:::

**Rešitev:**

1. Oba $\forall$ postaneta $\exists$: $\exists x\, \exists y\colon \neg(x < y \Rightarrow f(x) < f(y))$.
2. Negacija implikacije: $\exists x\, \exists y\colon (x < y \wedge f(x) \geq f(y))$. Negacija neenakosti $f(x) < f(y)$ je $f(x) \geq f(y)$, ne $f(x) > f(y)$.
3. Za $f(x) = x^2$ iščemo $x < y$ z $f(x) \geq f(y)$. Vzamemo $x = -1$, $y = 0$.
4. Preverimo: $-1 < 0$ in $f(-1) = 1 \geq 0 = f(0)$.
5. Odgovor: $f$ ni strogo naraščajoča, če obstajata $x < y$ z $f(x) \geq f(y)$; za $x^2$ je priča par $x = -1$, $y = 0$.

### Primer 4: zdaj ti

Množica $\mathbb{N}$ je **navzgor omejena**, če velja $\exists M \in \mathbb{R}\ \forall n \in \mathbb{N}\colon n \leq M$. Zanikaj izjavo in ugotovi, ali drži izjava ali njena negacija.

**Podatki:** izjava $\exists M \in \mathbb{R}\ \forall n \in \mathbb{N}\colon n \leq M$
**Iščemo:** negacijo in odločitev, katera od obeh je resnična

:::formula
Obrni vsak kvantifikator, domeni ohrani, na koncu zanikaj predikat: $\neg(n \leq M) \sim n > M$
:::

**Rešitev:**

1. $\exists M$ postane $\forall M$, $\forall n$ postane $\exists n$.
2. Zapiši negacijo in zanjo za dani $M$ poišči ustrezen $n$.

:::premisli
Kako se glasi negacija, in kateri $n$ ustreza za $M = 1000{,}5$?
---
Negacija: $\forall M \in \mathbb{R}\ \exists n \in \mathbb{N}\colon n > M$. Ta je resnična: za $M = 1000{,}5$ vzamemo $n = 1001$, v splošnem neko naravno število, večje od $M$ (npr. $n = \max(1, \lfloor M \rfloor + 1)$). Množica $\mathbb{N}$ torej ni navzgor omejena. Pri tem je $n$ smel biti odvisen od $M$, ker $\exists n$ stoji za $\forall M$.
:::

## Pogoste napake

- **»Negacija od *vsi* je *nobeden*.«** Napačno: $\neg\, \forall x\, P(x) \sim \forall x\, \neg P(x)$. Za ovržbo trditve o vseh zadošča en protiprimer, ni treba, da trditev pade za vse. Pravilno: $\neg\, \forall x\, P(x) \sim \exists x\, \neg P(x)$.
- **Zanikanje domene.** Napačno: negacija od $\forall x \in \mathbb{R}\colon x^2 \geq 0$ je $\exists x \notin \mathbb{R}\colon x^2 < 0$. Domena pove, o čem govorimo, in ni del trditve. Pravilno: $\exists x \in \mathbb{R}\colon x^2 < 0$.
- **Napačna negacija implikacije pod kvantifikatorjem.** Napačno: $\neg\, \forall x\,(P \Rightarrow Q) \sim \exists x\,(P \Rightarrow \neg Q)$. Implikacija je neresnična le pri $P = 1$, $Q = 0$. Pravilno: $\exists x\,(P(x) \wedge \neg Q(x))$.
- **Zamenjava vrstnega reda $\forall$ in $\exists$.** Kdor zamenja $\forall x\, \exists y$ z $\exists y\, \forall x$, iz »vsak ima svojega« naredi »eden velja za vse«. Prva izjava sledi iz druge, obratno pa ne. Pravilno: vrstni red ohrani tudi pri negaciji.
- **Implikacija pri $\exists$.** Napačno: »neko praštevilo je sodo« zapišemo $\exists x\,(x \text{ praštevilo} \Rightarrow x \text{ sodo})$. To je resnično že pri $x = 4$, ker je premisa neresnična; veljalo bi tudi, če sodega praštevila sploh ne bi bilo. Pravilno: $\exists x\,(x \text{ praštevilo} \wedge x \text{ sodo})$.

## Povzetek

- Predikat $P(x)$ postane izjava, ko $x$ nadomestimo z elementom domene ali ga vežemo s kvantifikatorjem.
- $\forall x\, P(x)$: $P$ velja za vsak $x$ iz domene; $\exists x\, P(x)$: $P$ velja za vsaj en $x$. Resničnost je odvisna od domene.
- $\forall x \in A\colon P(x) \sim \forall x\,(x \in A \Rightarrow P(x))$; $\exists x \in A\colon P(x) \sim \exists x\,(x \in A \wedge P(x))$.
- Negacija: $\neg\, \forall x\, P \sim \exists x\, \neg P$, $\neg\, \exists x\, P \sim \forall x\, \neg P$; domena se ne spremeni; $\neg\, \forall x\,(P \Rightarrow Q) \sim \exists x\,(P \wedge \neg Q)$.
- Pri več kvantifikatorjih se ob negaciji vsak obrne, vrstni red ostane. Vrstni red $\forall$ in $\exists$ je pomemben, enaka kvantifikatorja smemo zamenjati.
- Za ovržbo $\forall$ zadošča protiprimer, za dokaz $\exists$ zadošča priča.

## Drugače: Iz vsakdanjega življenja (igra dveh igralcev)

Izjavo s kvantifikatorji si predstavljaj kot igro med **branilcem**, ki trdi, da izjava drži, in **izzivalcem**, ki trdi nasprotno.

- Pri $\forall x$ izbere $x$ izzivalec. Izbral bo najbolj neugodnega.
- Pri $\exists y$ izbere $y$ branilec. Izbral bo najugodnejšega in pozna vse, kar je bilo izbrano pred njim.
- Na koncu preverimo predikat. Izjava je resnična, če ima branilec zmagovalno strategijo.

Pri $\forall x\, \exists y\colon y > x$ na $\mathbb{N}$ izzivalec reče $x = 100$, branilec odgovori $y = 101$ in zmaga. Pri $\exists y\, \forall x\colon y > x$ mora branilec prvi izbrati $y$, izzivalec pa odgovori z $x = y$ in zmaga.

Negacija zamenja vlogi igralcev. Kar je bila izbira izzivalca ($\forall$), postane izbira novega branilca ($\exists$), in obratno.

## Drugače: Korak za korakom s številkami

Recept za negacijo izjave s kvantifikatorji, na primeru $\forall \varepsilon > 0\ \exists N \in \mathbb{N}\ \forall n \geq N\colon |a_n| < \varepsilon$:

1. Kvantifikatorje prepiši v istem vrstnem redu in vsakega obrni: $\exists \varepsilon > 0\ \forall N \in \mathbb{N}\ \exists n \geq N$.
2. Domene ($\varepsilon > 0$, $N \in \mathbb{N}$, $n \geq N$) prepiši nespremenjene.
3. Zanikaj predikat na koncu: $\neg(|a_n| < \varepsilon) \sim |a_n| \geq \varepsilon$.
4. Rezultat: $\exists \varepsilon > 0\ \forall N \in \mathbb{N}\ \exists n \geq N\colon |a_n| \geq \varepsilon$.
5. Preveri s številkami. Za $a_n = (-1)^n$ vzemi $\varepsilon = \frac12$. Za vsak $N$ je $n = N$ ustrezen, ker je $|a_N| = 1 \geq \frac12$. Negacija drži, zato zaporedje ne gre proti $0$.

## Drugače: Bolj natančno

**Pomen formule.** Formula predikatnega računa dobi resničnost šele v **strukturi**: neprazni domeni $D$ skupaj s pomenom vsakega predikata (podmnožica $D$ oziroma $D^k$ za $k$ spremenljivk). Formula je **splošno veljavna**, če je resnična v vsaki strukturi; to je analog tavtologije. Formuli sta enakovredni, $A \sim B$, če je $A \Leftrightarrow B$ splošno veljavna.

**Kvantifikatorji in vezniki.**

- $\forall x\,(P \wedge Q) \sim \forall x\, P \wedge \forall x\, Q$ in $\exists x\,(P \vee Q) \sim \exists x\, P \vee \exists x\, Q$.
- Velja $\forall x\, P \vee \forall x\, Q \models \forall x\,(P \vee Q)$, obrat ne: na $\mathbb{N}$ je vsako število sodo ali liho, ni pa vsako sodo in ni vsako liho.
- Velja $\exists x\,(P \wedge Q) \models \exists x\, P \wedge \exists x\, Q$, obrat ne (obstaja sodo in obstaja liho število, ni pa števila, ki bi bilo oboje).
- $\exists y\, \forall x\, P(x, y) \models \forall x\, \exists y\, P(x, y)$, obrat ne.
- Če $x$ ni prosta v $B$: $\forall x\,(A \Rightarrow B) \sim \exists x\, A \Rightarrow B$.

**Enolični obstoj.** $\exists! x\, P(x)$ (»obstaja natanko en«) je okrajšava za $\exists x\,\big(P(x) \wedge \forall y\,(P(y) \Rightarrow y = x)\big)$. Njena negacija: $\forall x\,\big(\neg P(x) \vee \exists y\,(P(y) \wedge y \neq x)\big)$, torej »ni nobenega ali sta vsaj dva«.

**Prazna domena pri omejenem kvantifikatorju.** Če je $A = \emptyset$, je $\forall x \in A\colon P(x)$ vedno resnična (implikacija z neresnično premiso), $\exists x \in A\colon P(x)$ pa vedno neresnična.

## Preveri se

? Kdaj je izjava $\exists x \in D\colon P(x)$ resnična?
- Če $P(a)$ velja za vsak $a \in D$.
~ To je pomen univerzalnega kvantifikatorja $\forall$. Za $\exists$ zadošča manj.
+ Če $P(a)$ velja za vsaj en $a \in D$.
- Če $P(a)$ velja za natanko en $a \in D$.
~ »Natanko en« je enolični obstoj $\exists!$. Pri $\exists$ je lahko takih $a$ tudi več.
> Eksistenčni kvantifikator zahteva vsaj eno pričo; na končni domeni je to disjunkcija $P(a_1) \vee \dots \vee P(a_n)$.

? Katera izjava je negacija izjave $\forall x \in \mathbb{R}\colon x^2 > 0$?
- $\forall x \in \mathbb{R}\colon x^2 \leq 0$
~ To je »nobeden ne zadošča«. Za negacijo trditve o vseh zadošča en protiprimer, zato $\forall$ postane $\exists$.
- $\exists x \in \mathbb{R}\colon x^2 < 0$
~ Negacija od $x^2 > 0$ je $x^2 \leq 0$; enakost ne sme izpasti.
+ $\exists x \in \mathbb{R}\colon x^2 \leq 0$
- $\exists x \notin \mathbb{R}\colon x^2 \leq 0$
~ Domena se pri negaciji ne spremeni; govorimo še vedno o realnih številih.
> $\neg\, \forall x\, P \sim \exists x\, \neg P$ in $\neg(x^2 > 0) \sim x^2 \leq 0$. Negacija je resnična, priča je $x = 0$.

? Domena je $\mathbb{N}$. Katera izjava je resnična?
- $\exists y\, \forall x\colon y > x$
~ Tak $y$ bi moral biti večji tudi od samega sebe. Vrstni red pomeni, da $y$ izberemo pred $x$.
+ $\forall x\, \exists y\colon y > x$
- $\forall x\, \forall y\colon y > x$
~ Protiprimer: $x = 2$, $y = 1$. Pri dveh $\forall$ mora predikat veljati za vsak par.
> Za vsak $x$ vzamemo $y = x + 1$. Tu je $y$ smel biti odvisen od $x$, ker $\exists y$ stoji za $\forall x$.

? Katera formula je negacija formule $\forall x\,\big(I(x) \Rightarrow S(x)\big)$ (»vsak, ki je prišel na izpit, je pisal s svinčnikom«)?
- $\exists x\,\big(I(x) \Rightarrow \neg S(x)\big)$
~ Implikacija se ne zanika tako, da zanikaš posledico. Velja $\neg(p \Rightarrow q) \sim p \wedge \neg q$.
- $\forall x\,\big(\neg I(x) \Rightarrow \neg S(x)\big)$
~ Zanikal si obe strani implikacije, poleg tega je ostal $\forall$. Kvantifikator se mora obrniti.
+ $\exists x\,\big(I(x) \wedge \neg S(x)\big)$
- $\exists x\,\big(\neg I(x) \wedge S(x)\big)$
~ Govoriš o nekom, ki ni prišel na izpit. Negacija zahteva nekoga, ki je prišel in ni pisal s svinčnikom.
> $\neg\, \forall x\,(I \Rightarrow S) \sim \exists x\, \neg(I \Rightarrow S) \sim \exists x\,(I(x) \wedge \neg S(x))$: nekdo je prišel na izpit in ni pisal s svinčnikom.

? Zaporedje $(a_n)$ je omejeno, če velja $\exists M > 0\ \forall n \in \mathbb{N}\colon |a_n| \leq M$. Kaj pomeni, da zaporedje *ni* omejeno?
- $\exists M > 0\ \forall n \in \mathbb{N}\colon |a_n| > M$
~ Zanikal si le predikat, kvantifikatorjev pa nisi obrnil. Ob negaciji se obrne vsak.
- $\forall M > 0\ \forall n \in \mathbb{N}\colon |a_n| > M$
~ Obrnil si le prvi kvantifikator. Tudi $\forall n$ mora postati $\exists n$.
+ $\forall M > 0\ \exists n \in \mathbb{N}\colon |a_n| > M$
- $\forall M \leq 0\ \exists n \in \mathbb{N}\colon |a_n| > M$
~ Pogoj $M > 0$ je domena kvantifikatorja in se ne zanika.
> Vsak kvantifikator se obrne, domene ostanejo, $\neg(|a_n| \leq M) \sim |a_n| > M$: za vsako mejo $M$ najdemo člen, ki jo preseže.

:::simboli
x, y | predmetni spremenljivki
P | predikat (izjavna forma)
A | množica, na katero omejimo kvantifikator | | | v pravilih za negacijo poljubna formula
D | področje pogovora (domena)
p, q | izjavi
n | naravno število
M | realno število (zgornja meja)
:::
